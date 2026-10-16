#!/usr/bin/env node
/**
 * Kygo Health - SEO markup builder for Wix custom elements
 *
 * Wix serves a custom element's `seoMarkup` (set from Velo) as plain HTML inside the element's
 * tag, so crawlers that don't run JavaScript (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot)
 * can read the tool. Wix requires that markup to match what the element shows, so it is not
 * written by hand: this script renders each component in headless Chromium and serialises its
 * shadow DOM to clean semantic HTML (headings, paragraphs, lists, tables, links), dropping
 * styles, scripts, SVG, controls and the CTA. Output: seo/<tag>.html, served by GitHub Pages.
 *
 * Usage:
 *   node scripts/build-seo-markup.js                 # every entry in TOOLS
 *   node scripts/build-seo-markup.js kygo-hrv-factors # one tag
 *   node scripts/build-seo-markup.js --map           # print the path -> tag map
 *   node scripts/build-seo-markup.js --velo          # only rewrite velo/seoMarkup.web.js from TOOLS
 *
 * A full build (no tag given) also rewrites velo/seoMarkup.web.js.
 *
 * Needs Playwright with a Chromium build (PLAYWRIGHT_CHROMIUM=/path overrides the binary).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'seo');

// tag -> component file + the live page it sits on (the Velo backend maps path -> tag).
// kygo-blog is left out on purpose: its post list comes from Velo at runtime, so a standalone
// render has no posts and the markup would not match the page.
const TOOLS = {
  'kygo-home':                    { file: 'kygo-bundle.js',                    path: '/' },
  'kygo-hiw':                     { file: 'kygo-hiw-bundle.js',                path: '/how-it-works' },
  'kygo-faq-section':             { file: 'kygo-faq-section.js',               path: '/faq' },
  'kygo-tools-page':              { file: 'kygo-tools.js',                     path: '/tools' },
  'kygo-contact-section':         { file: 'kygo-contact.js',                   path: '/contact' },
  'kygo-accuracy-factors':        { file: 'kygo-accuracy-factors.js',          path: '/tools/accuracy-factors' },
  'kygo-calorie-burn-accuracy':   { file: 'kygo-calorie-burn-accuracy.js',     path: '/tools/calorie-burn-accuracy' },
  'calories-in-anything':         { file: 'calories-custom-element.js',        path: '/tools/calories-in-anything' },
  'kygo-deep-sleep-factors':      { file: 'kygo-deep-sleep-factors.js',        path: '/tools/deep-sleep-factors' },
  'kygo-food-and-sleep':          { file: 'kygo-food-and-sleep.js',            path: '/tools/how-food-affects-sleep' },
  'kygo-fitbit-air-vs-whoop':     { file: 'kygo-fitbit-air-vs-whoop.js',       path: '/tools/fitbit-air-vs-whoop-comparison' },
  'kygo-heart-rate-accuracy':     { file: 'kygo-heart-rate-accuracy.js',       path: '/tools/heart-rate-accuracy' },
  'kygo-hrv-factors':             { file: 'kygo-hrv-factors.js',               path: '/tools/hrv-factors' },
  'kygo-oura-5-vs-4':             { file: 'kygo-oura-5-vs-4.js',               path: '/tools/oura-ring-5-vs-4' },
  'kygo-oura-ring-comparison':    { file: 'kygo-oura-ring-comparison.js',      path: '/tools/oura-ring-comparison-tool' },
  'kygo-oura-vs-ringconn':        { file: 'kygo-oura-vs-ringconn.js',          path: '/tools/oura-vs-ringconn' },
  'kygo-recovery-scores':         { file: 'kygo-recovery-scores.js',           path: '/tools/recovery-score-explorer' },
  'kygo-rem-sleep':               { file: 'kygo-rem-sleep.js',                 path: '/tools/rem-sleep-factors' },
  'kygo-rhr-factors':             { file: 'kygo-rhr-factors.js',               path: '/tools/resting-heart-rate-factors' },
  'kygo-sensor-comparison':       { file: 'kygo-sensor-comparison.js',         path: '/tools/sensor-comparison' },
  'kygo-sleep-latency-factors':   { file: 'kygo-sleep-latency-factors.js',     path: '/tools/sleep-latency-factors' },
  'kygo-sleep-metrics':           { file: 'kygo-sleep-metrics.js',             path: '/tools/sleep-metrics' },
  'kygo-sleep-tracker-accuracy':  { file: 'kygo-sleep-tracker-accuracy.js',    path: '/tools/sleep-tracker-accuracy' },
  'kygo-smart-ring-comparison':   { file: 'kygo-smart-ring-comparison.js',     path: '/tools/smart-ring-comparison' },
  'kygo-staying-asleep-factors':  { file: 'kygo-staying-asleep-factors.js',    path: '/tools/staying-asleep-factors' },
  'kygo-step-count-accuracy':     { file: 'kygo-step-count-accuracy.js',       path: '/tools/step-count-accuracy' },
  'kygo-wearable-stress':         { file: 'kygo-wearable-stress.js',           path: '/tools/stress-factors' },
  'kygo-supplements-by-metric':   { file: 'kygo-supplements-by-metric.js',     path: '/tools/supplements-by-metric' },
  'kygo-vo2max-accuracy':         { file: 'kygo-vo2max-accuracy.js',           path: '/tools/vo2-max-accuracy' },
  'kygo-vo2max-factors':          { file: 'kygo-vo2max-factors.js',            path: '/tools/vo2-max-factors' },
  'kygo-wearable-accuracy':       { file: 'kygo-wearable-accuracy.js',         path: '/tools/wearable-accuracy' },
};

// Content that only renders after a click (category tabs, device pickers, "show sources",
// accordions). Every control is clicked in turn and the component is re-serialised; the
// snapshots are merged section by section (a section = a heading and what follows it), so each
// state's content lands once, in page order. Links, CTAs and submit buttons are never clicked.
const TAB_SELECTOR = 'button:not([type="submit"]):not(.form-submit), [role="button"], [role="tab"], summary';

// Runs in the page: number of tab-like controls, across nested shadow roots.
function countTabs([tag, sel]) {
  const all = [];
  (function collect(root) {
    root.querySelectorAll(sel).forEach(e => { if (!e.closest('a, kygo-cta')) all.push(e); });
    root.querySelectorAll('*').forEach(e => e.shadowRoot && collect(e.shadowRoot));
  })(document.querySelector(tag).shadowRoot || document.querySelector(tag));
  return all.length;
}

// Runs in the page: click the i-th tab-like control (re-queried: clicks may re-render the bar).
async function clickTab([tag, sel, i]) {
  const all = [];
  (function collect(root) {
    root.querySelectorAll(sel).forEach(e => { if (!e.closest('a, kygo-cta')) all.push(e); });
    root.querySelectorAll('*').forEach(e => e.shadowRoot && collect(e.shadowRoot));
  })(document.querySelector(tag).shadowRoot || document.querySelector(tag));
  if (all[i]) all[i].click();
  await new Promise(r => setTimeout(r, 200));
}

// Merge serialised snapshots: keep the first, then fold in each later snapshot section by section
// (a section = a heading and the blocks under it). A section whose heading is already present is
// compared by its blocks, not their order (filters and sorts reorder): if every block is already
// there it adds nothing; otherwise only the new blocks are appended to that section.
function mergeSnapshots(snaps) {
  const split = html => html.split(/(?=<h[1-6]>)/).map(x => x.trim()).filter(Boolean);
  const blocks = sec => sec.split('\n').map(x => x.trim()).filter(Boolean);
  const head = sec => (sec.match(/^<h[1-6]>(.*?)<\/h[1-6]>/) || [, ''])[1];
  const merged = split(snaps[0]);
  for (const snap of snaps.slice(1)) {
    let at = -1;
    for (const sec of split(snap)) {
      const i = merged.indexOf(sec) !== -1 ? merged.indexOf(sec)
        : merged.findIndex(m => head(m) && head(m) === head(sec));
      if (i === -1) { merged.splice(at + 1, 0, sec); at += 1; continue; }
      const have = new Set(blocks(merged[i]));
      const extra = blocks(sec).filter(x => !have.has(x));
      if (extra.length) merged[i] = merged[i] + '\n' + extra.join('\n');
      at = i;
    }
  }
  return merged.join('\n') + '\n';
}

// Runs in the page: shadow DOM -> clean HTML string.
function serialise(tag) {
  const KEEP_BLOCK = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'table',
    'thead', 'tbody', 'tr', 'th', 'td', 'blockquote', 'dl', 'dt', 'dd']);
  const KEEP_INLINE = new Set(['strong', 'b', 'em', 'i']);
  // Buttons are kept: several tools render whole factor cards and accordion headers as buttons.
  const SKIP = new Set(['style', 'script', 'svg', 'input', 'select', 'option', 'textarea',
    'noscript', 'template', 'canvas', 'img', 'picture', 'video', 'iframe', 'kygo-cta', 'label']);
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const abs = href => { try { return new URL(href, 'https://www.kygo.app/').href; } catch (e) { return null; } };

  // Returns a list of { block, html } pieces; runs of inline pieces become one <p>.
  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent.replace(/\s+/g, ' ');
      return t.trim() ? [{ block: false, html: esc(t) }] : (t ? [{ block: false, html: ' ' }] : []);
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return [];
    const name = node.localName;
    if (SKIP.has(name) || node.getAttribute('aria-hidden') === 'true') return [];
    const kids = [...(node.shadowRoot ? node.shadowRoot.childNodes : node.childNodes)].flatMap(walk);
    if (!kids.some(k => k.html.trim())) return [];
    if (name === 'a' || KEEP_INLINE.has(name)) {
      if (kids.some(k => k.block)) return kids; // a link wrapping a card: keep the card, drop the link
      const inner = kids.map(k => k.html).join('').trim();
      if (name !== 'a') return [{ block: false, html: `<${name}>${inner}</${name}>` }];
      const href = abs(node.getAttribute('href') || '');
      return [{ block: false, html: href && /^https?:/.test(href) ? `<a href="${esc(href)}">${inner}</a>` : inner }];
    }
    if (KEEP_BLOCK.has(name)) {
      const leaf = /^(h[1-6]|p|li|th|td|dt|dd)$/.test(name);
      // A leaf (heading, paragraph, cell) holds inline content only: nested blocks are unwrapped.
      const inner = leaf
        ? kids.map(k => k.block ? ' ' + k.html.replace(/<\/?(?:h[1-6]|p|ul|ol|li|table|thead|tbody|tr|th|td|blockquote|dl|dt|dd)>/g, ' ') + ' ' : k.html)
          .join('').replace(/\s+/g, ' ').trim()
        : group(kids);
      return [{ block: true, html: `<${name}>${inner}</${name}>` }];
    }
    // div, span, section, ...: transparent; a block container groups its loose text into <p>s.
    if (getComputedStyle(node).display === 'inline') return kids;
    return [{ block: true, html: group(kids) }];
  }

  function group(pieces) {
    let out = '', run = '';
    const flush = () => { if (run.trim()) out += `<p>${run.trim()}</p>\n`; run = ''; };
    for (const p of pieces) { if (p.block) { flush(); out += p.html; } else run += p.html; }
    flush();
    return out;
  }

  const el = document.querySelector(tag);
  return group([...(el.shadowRoot || el).childNodes].flatMap(walk))
    .replace(/(<\/(?:h[1-6]|li|ul|ol|table|tr|blockquote|dl)>)/g, '$1\n')
    .replace(/\n{2,}/g, '\n').trim() + '\n';
}

// velo/seoMarkup.web.js is generated from TOOLS so its path -> tag map never drifts from this
// list. It is the Wix backend file the user pastes into the editor (backend/seoMarkup.web.js).
function writeVeloBackend() {
  const map = Object.fromEntries(Object.entries(TOOLS).map(([t, e]) => [e.path, t]));
  const body = `// GENERATED by scripts/build-seo-markup.js from its TOOLS list. Do not edit by hand.
// Wix Velo backend file: paste the whole file into the Wix editor as backend/seoMarkup.web.js.
// Serves each component page's crawler markup (seo/<tag>.html, kept current by the
// "Build SEO markup" GitHub Action) to the page code, which sets it as the custom element's
// seoMarkup during the server render. See docs/seo-markup-poc.md.
import { Permissions, webMethod } from 'wix-web-module';
import { fetch } from 'wix-fetch';

const BASE = 'https://kygo-health.github.io/kygo-elements/seo/';

// page path -> component tag
const PAGES = ${JSON.stringify(map, null, 2)};

export const getSeoMarkup = webMethod(Permissions.Anyone, async (pathOrTag) => {
  // Accepts a page path ('/tools/hrv-factors') or a tag ('kygo-hrv-factors').
  const tag = PAGES[pathOrTag] || (Object.values(PAGES).includes(pathOrTag) ? pathOrTag : null);
  if (!tag) return '';
  try {
    // Never hold the page render hostage: give up after 2 s and serve the page without markup.
    const res = await Promise.race([
      fetch(BASE + tag + '.html', { method: 'get' }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000)),
    ]);
    return res.ok ? await res.text() : '';
  } catch (e) {
    console.error('getSeoMarkup', pathOrTag, e);
    return '';
  }
});
`;
  fs.writeFileSync(path.join(ROOT, 'velo', 'seoMarkup.web.js'), body);
}

(async () => {
  if (process.argv.includes('--velo')) { writeVeloBackend(); console.log('wrote velo/seoMarkup.web.js'); return; }
  if (process.argv.includes('--map')) {
    const map = Object.fromEntries(Object.entries(TOOLS).map(([t, e]) => [e.path, t]));
    console.log(JSON.stringify(map, null, 2));
    return;
  }
  const only = process.argv.slice(2);
  const tags = only.length ? only : Object.keys(TOOLS);
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
  for (const tag of tags) {
    const entry = TOOLS[tag];
    if (!entry) { console.error(`Unknown tag ${tag}`); process.exitCode = 1; continue; }
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    await page.route(/^https?:\/\//, r => r.abort()); // offline: no fonts, no kygo-cta.js, no tracking
    await page.setContent(`<!doctype html><html><head></head><body><${tag}></${tag}></body></html>`);
    await page.addScriptTag({ content: fs.readFileSync(path.join(ROOT, entry.file), 'utf8') });
    await page.waitForTimeout(1500);
    const snaps = [await page.evaluate(serialise, tag)];
    const tabs = await page.evaluate(countTabs, [tag, TAB_SELECTOR]);
    for (let i = 0; i < tabs; i++) {
      await page.evaluate(clickTab, [tag, TAB_SELECTOR, i]);
      snaps.push(await page.evaluate(serialise, tag));
    }
    const html = mergeSnapshots(snaps);
    fs.writeFileSync(path.join(OUT, `${tag}.html`), html);
    const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    console.log(`${tag}: ${tabs} controls, ${words} words, ${Buffer.byteLength(html)} bytes`);
    await page.close();
  }
  await browser.close();
  if (!only.length) writeVeloBackend();
})();
