# seoMarkup proof of concept — `/tools/hrv-factors`

**Problem.** Tool content renders client-side in shadow DOM. Google renders JavaScript and
flattens shadow DOM, so it indexes the tools. The major AI crawlers don't run JavaScript (Vercel /
MERJ, Dec 2024: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot), so they get an
empty `<kygo-hrv-factors></kygo-hrv-factors>`. Baseline on 2026-10-14: 0 words inside the tag for
every user agent (`scripts/check-seo-markup.sh`).

**Fix.** Wix's own mechanism for custom elements: the Velo `seoMarkup` property. It puts HTML
inside the element's tag in the server-rendered page. The component's shadow root has no `<slot>`,
so visitors never see that HTML; crawlers read it. Wix requires it to match what the element shows
(cloaking), so it is generated from the component, never written by hand:

- `scripts/build-seo-markup.js` renders the component in headless Chromium, clicks through every
  category tab, and writes the content as plain semantic HTML to `seo/<tag>.html`.
- A Velo backend web method fetches that file during the server render; page code sets
  `seoMarkup` and returns the promise so Wix waits for it (documented `onReady` behaviour).

Docs: [custom element SEO](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/introduction),
[seoMarkup](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/seo-markup),
[onReady + SSR](https://dev.wix.com/docs/velo/velo-only-apis/$w/on-ready).

## 1. Backend file — create `backend/seoMarkup.web.js` in the Wix editor

```js
import { Permissions, webMethod } from 'wix-web-module';
import { fetch } from 'wix-fetch';

// Proof of concept: pinned jsDelivr commit (works before the branch is merged).
// After merge, switch to 'https://kygo-health.github.io/kygo-elements/seo/'.
const BASE = 'https://cdn.jsdelivr.net/gh/Kygo-Health/kygo-elements@c0b55536f239325763d5b3147dff6ee1ac328764/seo/';
const ALLOWED = new Set(['kygo-hrv-factors']);

export const getSeoMarkup = webMethod(Permissions.Anyone, async (tag) => {
  if (!ALLOWED.has(tag)) return '';
  try {
    // Never hold the page render hostage: give up after 2 s and serve the page without markup.
    const res = await Promise.race([
      fetch(BASE + tag + '.html', { method: 'get' }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000)),
    ]);
    return res.ok ? await res.text() : '';
  } catch (e) {
    console.error('getSeoMarkup', tag, e);
    return '';
  }
});
```

## 2. Page code — HRV Factors page

Replace `#customElement1` with the custom element's ID on that page (select it in the editor; the
ID shows in the Properties panel). Merge into the existing `onReady` if the page has one — one
`onReady` per page.

```js
import wixWindowFrontend from 'wix-window-frontend';
import { getSeoMarkup } from 'backend/seoMarkup.web';

$w.onReady(function () {
  // Only the server render needs it; crawlers always get a server render.
  if (wixWindowFrontend.rendering.env !== 'backend') return;
  return getSeoMarkup('kygo-hrv-factors').then((html) => {
    if (html) $w('#customElement1').seoMarkup = html;
  });
});
```

Publish (server rendering never happens in Preview).

## 3. Test

```bash
scripts/check-seo-markup.sh https://www.kygo.app/tools/hrv-factors kygo-hrv-factors "Ashwagandha (Zenroot)"
```

Pass = every agent shows ~3,700 words in the tag and `probe=yes`, with TTFB close to the baseline
(1.0–1.8 s through this proxy). Also check, in a normal browser, that the page looks unchanged.

What each outcome means:

| Result | Meaning | Next |
|---|---|---|
| All agents get the markup | Works as documented | Add Action + roll out tool by tool |
| Only Googlebot / some bots get it | Wix serves it to a bot list only | Check which AI bots are on it; decide if enough |
| Markup cut short | Wix size limit | Trim the snapshot (drop "Plain English" / mechanism blocks) |
| Nobody gets it | SSR didn't wait or property ignored | Check Wix site logs for `getSeoMarkup` errors |
| TTFB clearly worse | Fetch slows first load | Add web method caching or trim size |

## Result — PASSED (2026-10-14, after publish)

| Agent | Words in tag | Probe phrase | TTFB |
|---|---|---|---|
| Normal browser | 0 (Wix serves seoMarkup to crawlers only; page unchanged for visitors) | no | 1.4–1.7 s |
| Googlebot, bingbot, Applebot | 3,700 | yes | ~1.3 s |
| GPTBot, OAI-SearchBot, ChatGPT-User | 3,700 | yes | 1.1–1.8 s |
| ClaudeBot, Claude-User | 3,700 | yes | ~1.2 s |
| PerplexityBot, Perplexity-User | 3,700 | yes | ~1.1 s |

Full snapshot served (no size cut at 33 KB). TTFB is within the pre-change baseline (1.0–1.8 s).
Wix picks crawlers by user agent, so the markup must keep matching the component — hence the
generator, never hand edits.

## Rollout (only if the test passes)

1. Add each tool to `TOOLS` (and `STATES` for tabbed tools) in `scripts/build-seo-markup.js`.
2. A GitHub Action regenerates `seo/*.html` on every push to `main`, so the markup can't drift.
3. Per tool page: 4 lines of page code. Then retire the hand-written "Text summary of this page"
   embeds, which become redundant.
