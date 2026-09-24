#!/usr/bin/env node
/**
 * Kygo Health - blog CTA migration
 *
 * Swaps the old two-anchor Tenjin store CTA inside existing blog posts for the
 * shared <kygo-cta> element. Wix holds the posts, so this runs against HTML
 * exported from the Blog/Posts collection (one file per post, named
 * <post-slug>.html) and writes the rewritten HTML back in place.
 *
 * DRY RUN BY DEFAULT. Nothing is written until --apply is passed, and the run
 * refuses to start unless every post it would touch has its own hook in
 * scripts/blog-cta-hooks.json. Hooks are never shared between posts, so the
 * script treats a duplicate hook as an error rather than a warning.
 *
 * Usage:
 *   node scripts/migrate-blog-ctas.js <dir-of-exported-posts>          # report only
 *   node scripts/migrate-blog-ctas.js <dir-of-exported-posts> --apply  # rewrite files
 *
 * Wix caveat: the rich-content editor strips unknown tags from post bodies. Check one
 * rewritten post in the editor before running the rest; if <kygo-cta> does not survive, the
 * CTA has to go in as an HTML embed block rather than inline markup, and this script's output
 * becomes the body of that block.
 *
 * Deploy order: push kygo-cta.js first (the element must be live on GitHub
 * Pages), re-import the rewritten posts into Wix, then spot-check one post on
 * desktop, one on iPhone and one on Android before doing the rest.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const IOS_LINK = 'https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy';
const ANDROID_LINK = 'https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO';
const HOOKS_FILE = path.join(__dirname, 'blog-cta-hooks.json');

/** One anchor pointing at either store link, with whatever wrapper markup Wix
 *  left around it. Matched non-greedily so two adjacent anchors stay separate. */
const ANCHOR = new RegExp(
  '<a\\b[^>]*href="(?:' + IOS_LINK + '|' + ANDROID_LINK + ')"[^>]*>[\\s\\S]*?<\\/a>', 'g');

/** The pair of anchors plus any whitespace or wrapper div between them. */
const CTA_BLOCK = new RegExp(
  '(?:<div[^>]*>\\s*)?' + ANCHOR.source + '\\s*(?:<\\/?[a-z][^>]*>\\s*)*' + ANCHOR.source +
  '(?:\\s*<\\/div>)?', 'i');

function loadHooks() {
  if (!fs.existsSync(HOOKS_FILE)) {
    fail('Missing ' + path.relative(process.cwd(), HOOKS_FILE) +
      '. Create it as {"<post-slug>": "<hook line>"} with one unique hook per post.');
  }
  const hooks = JSON.parse(fs.readFileSync(HOOKS_FILE, 'utf8'));
  const seen = new Map();
  for (const [slug, hook] of Object.entries(hooks)) {
    const key = String(hook).trim().toLowerCase();
    if (!key) fail('Empty hook for "' + slug + '".');
    if (seen.has(key)) fail('Hook shared by "' + seen.get(key) + '" and "' + slug + '". Every post needs its own.');
    seen.set(key, slug);
  }
  return hooks;
}

/** Campaign id for the post. Apple caps `ct` at 30 characters. */
function campaign(slug) {
  const base = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  // Keep the suffix whole: a truncated "-end" would read as part of the slug.
  return (base.length + 4 <= 30 ? base + '-end' : base.slice(0, 30)).replace(/-+$/, '');
}

function ctaElement(slug, hook) {
  return '<kygo-cta theme="dark" slug="' + campaign(slug) + '" surface="blog" hook="' +
    hook.replace(/"/g, '&quot;') +
    '" note="Free plan available on web or in the app. Save 58% on yearly. Cancel anytime."></kygo-cta>';
}

function fail(msg) {
  console.error('migrate-blog-ctas: ' + msg);
  process.exit(1);
}

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const dir = args.filter(a => !a.startsWith('--'))[0];
  if (!dir) fail('Pass the directory of exported post HTML. See the header comment.');
  if (!fs.existsSync(dir)) fail('No such directory: ' + dir);

  const hooks = loadHooks();
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort();
  const touched = [];
  const missingHook = [];
  const noCta = [];

  for (const file of files) {
    const slug = path.basename(file, '.html');
    const full = path.join(dir, file);
    const html = fs.readFileSync(full, 'utf8');

    if (!html.includes(IOS_LINK) && !html.includes(ANDROID_LINK)) {
      noCta.push(slug);
      continue;
    }
    if (!hooks[slug]) {
      missingHook.push(slug);
      continue;
    }

    const replaced = html.replace(CTA_BLOCK, ctaElement(slug, hooks[slug]));
    // Any store anchor left over means the post wraps its CTA in markup this
    // pattern does not cover. Those are reported, never half-rewritten.
    if (replaced.includes(IOS_LINK) || replaced.includes(ANDROID_LINK)) {
      console.log('  UNMATCHED  ' + slug + ' (store links remain, needs a look by hand)');
      continue;
    }
    touched.push({ slug, full, replaced });
  }

  console.log('\nPosts scanned:        ' + files.length);
  console.log('Ready to migrate:     ' + touched.length);
  console.log('No old CTA found:     ' + noCta.length);
  console.log('Missing a hook:       ' + missingHook.length);
  if (missingHook.length) {
    console.log('\nAdd a unique hook for each of these to scripts/blog-cta-hooks.json:');
    missingHook.forEach(s => console.log('  "' + s + '": ""'));
  }
  if (touched.length) {
    console.log('\nWould rewrite:');
    touched.forEach(t => console.log('  ' + t.slug + '  ->  slug="' + campaign(t.slug) + '"'));
  }

  if (!apply) {
    console.log('\nDry run. Nothing written. Re-run with --apply once the list above is approved.');
    return;
  }
  if (missingHook.length) fail('Refusing to write while ' + missingHook.length + ' posts have no hook.');
  touched.forEach(t => fs.writeFileSync(t.full, t.replaced));
  console.log('\nRewrote ' + touched.length + ' posts.');
}

main();
