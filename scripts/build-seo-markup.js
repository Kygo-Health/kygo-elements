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
 *   node scripts/build-seo-markup.js kygo-hrv-factors
 *
 * Needs Playwright with a Chromium build (PLAYWRIGHT_CHROMIUM=/path overrides the binary).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'seo');

// tag -> component file. Start with the proof of concept; add tools once it passes.
const TOOLS = {
  'kygo-hrv-factors': 'kygo-hrv-factors.js',
};

// Interactive states the static render misses. `tabs` are clicked in turn and each tab's
// `panel` content is stacked under a heading, so the markup carries every category, not just
// the default one (equivalent content reachable by a click, like any tabbed page).
const STATES = {
  'kygo-hrv-factors': { tabs: '.cat-tab', panel: '.factor-cards', label: 'span:nth-child(2)' },
};

// Runs in the page: expand tabbed panels so every state is in the DOM at once.
async function expandTabs([tag, cfg]) {
  const root = document.querySelector(tag).shadowRoot;
  const count = root.querySelectorAll(cfg.tabs).length;
  const parts = [];
  for (let i = 0; i < count; i++) {
    const tab = root.querySelectorAll(cfg.tabs)[i]; // re-query: a click may re-render the tab bar
    tab.click();
    await new Promise(r => setTimeout(r, 150));
    const label = (tab.querySelector(cfg.label) || tab).textContent.replace(/\s+/g, ' ').trim();
    parts.push(`<h3>${label} factors</h3>` + root.querySelector(cfg.panel).innerHTML);
  }
  root.querySelector(cfg.panel).innerHTML = parts.join('');
}

// Runs in the page: shadow DOM -> clean HTML string.
function serialise(tag) {
  const KEEP_BLOCK = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'table',
    'thead', 'tbody', 'tr', 'th', 'td', 'blockquote', 'dl', 'dt', 'dd']);
  const KEEP_INLINE = new Set(['strong', 'b', 'em', 'i']);
  const SKIP = new Set(['style', 'script', 'svg', 'button', 'input', 'select', 'option', 'textarea',
    'noscript', 'template', 'canvas', 'img', 'picture', 'video', 'iframe', 'kygo-cta', 'form', 'label']);
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
      const inner = leaf ? kids.map(k => k.html).join('').trim() : group(kids);
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
  return group([...el.shadowRoot.childNodes].flatMap(walk))
    .replace(/(<\/(?:h[1-6]|li|ul|ol|table|tr|blockquote|dl)>)/g, '$1\n')
    .replace(/\n{2,}/g, '\n').trim() + '\n';
}

(async () => {
  const only = process.argv.slice(2);
  const tags = only.length ? only : Object.keys(TOOLS);
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
  for (const tag of tags) {
    const file = TOOLS[tag];
    if (!file) { console.error(`Unknown tag ${tag}`); process.exitCode = 1; continue; }
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    await page.route(/^https?:\/\//, r => r.abort()); // offline: no fonts, no kygo-cta.js, no tracking
    await page.setContent(`<!doctype html><html><head></head><body><${tag}></${tag}></body></html>`);
    await page.addScriptTag({ content: fs.readFileSync(path.join(ROOT, file), 'utf8') });
    await page.waitForTimeout(1500);
    if (STATES[tag]) await page.evaluate(expandTabs, [tag, STATES[tag]]);
    const html = await page.evaluate(serialise, tag);
    fs.writeFileSync(path.join(OUT, `${tag}.html`), html);
    const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    console.log(`${tag}: ${words} words, ${Buffer.byteLength(html)} bytes -> seo/${tag}.html`);
    await page.close();
  }
  await browser.close();
})();
