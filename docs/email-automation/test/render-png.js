#!/usr/bin/env node
/**
 * Renders test/out/email1.html ... email5.html (written by run-tests.js) to PNG with Playwright,
 * at desktop width (600 px wide email, 2x) and at phone width (375 px, 2x).
 * Images are served to the page through request interception: from IMG_DIR when set (the canvas
 * blob copies, <blob id>.png, matched to each wixstatic URL through the fixtures' data-email-src),
 * otherwise downloaded with curl. Any image that fails to load fails the render.
 *
 * Usage: NODE_PATH=$(npm root -g) [IMG_DIR=dir] node test/render-png.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const OUT = path.join(__dirname, 'out');
const PNG = path.join(__dirname, '..', 'png');
fs.mkdirSync(PNG, { recursive: true });

// wixstatic URL -> canvas blob id, read from the fixtures
const BLOB = {};
for (const f of fs.readdirSync(path.join(__dirname, 'fixtures'))) {
  const html = fs.readFileSync(path.join(__dirname, 'fixtures', f), 'utf8');
  for (const m of html.matchAll(/src="\/_blob\/([a-f0-9]{32})" data-email-src="([^"]+)"/g)) BLOB[m[2]] = m[1];
}

function download(url) {
  const dir = process.env.IMG_DIR;
  if (dir && BLOB[url] && fs.existsSync(path.join(dir, BLOB[url] + '.png'))) return fs.readFileSync(path.join(dir, BLOB[url] + '.png'));
  // curl honours HTTPS_PROXY and the configured CA bundle
  return execFileSync('curl', ['-sSfL', '--max-time', '30', url], { maxBuffer: 50 * 1024 * 1024 });
}

(async () => {
  const cache = {};
  const browser = await chromium.launch();
  const report = [];
  for (const [label, width] of [['desktop', 600], ['mobile', 375]]) {
    const page = await browser.newPage({ viewport: { width, height: 800 }, deviceScaleFactor: 2, isMobile: label === 'mobile' });
    await page.route('**/*', async (route) => {
      const url = route.request().url();
      if (url.startsWith('file:')) return route.continue();
      if (/^https:\/\/static\.wixstatic\.com\//.test(url)) {
        if (!cache[url]) cache[url] = download(url);
        return route.fulfill({ status: 200, contentType: 'image/png', body: cache[url] });
      }
      return route.abort(); // the email must not need anything else
    });
    for (let n = 1; n <= 5; n++) {
      await page.goto('file://' + path.join(OUT, `email${n}.html`));
      await page.waitForLoadState('load');
      const broken = await page.$$eval('img', (imgs) => imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
      if (broken.length) throw new Error(`email ${n} (${label}): images failed to load: ${broken.join(', ')}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) throw new Error(`email ${n} (${label}): horizontal overflow ${overflow}px`);
      const file = path.join(PNG, label === 'desktop' ? `email${n}.png` : `email${n}-mobile.png`);
      await page.screenshot({ path: file, fullPage: true });
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      report.push(`${path.basename(file)}  ${width}x${h} css px, images ok, no horizontal overflow`);
    }
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'render-results.txt'), report.join('\n') + '\n');
  console.log(report.join('\n'));
})().catch((e) => { console.error(e); process.exit(1); });
