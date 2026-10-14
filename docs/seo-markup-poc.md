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

## Rollout (site-wide)

**What's in the repo**
- `scripts/build-seo-markup.js` — renders all 30 component pages, clicks every control (tabs,
  pickers, "show sources", accordions) and merges the states, so the markup holds everything the
  component can show. Fidelity check on 2026-10-14: 100% of rendered text nodes present on every
  page; builds are deterministic. `--map` prints the path -> tag map.
- `.github/workflows/build-seo-markup.yml` — regenerates `seo/*.html` on every push to `main` that
  touches a component, and commits the result. Never edit `seo/*.html` by hand.
- `velo/seoMarkup.web.js` — the backend file (path -> tag map, 2 s timeout).
- `velo/page-seo-snippet.js` — the page code, identical on every page (selects the element by
  type and looks the page up by path, so no element IDs).

**Generic snippet verified (2026-10-14):** HRV running `velo/page-seo-snippet.js` (type selector +
path lookup, no element ID) serves the snapshot from GitHub Pages to every crawler agent; TTFB
matches a page without the snippet. After the site-wide publish, all 31 pages (30 + `/blog`, whose
markup the page code builds from the post list) served the full snapshot to GPTBot and Googlebot.

**Gotcha: Wix also gives `seoMarkup` to browsers**, as plain children of the element's tag. Shadow-DOM
components hide them automatically (unslotted light DOM never renders). A component that renders in
**light DOM** shows them as raw text: that broke the homepage (`kygo-home`) until `kygo-bundle.js`
added a rule hiding every `<kygo-home>` child except its own `kygo-*` sections. Any future
light-DOM component needs the same before its page gets the snippet.

**Not covered:** `/blog` (its post list comes from Velo at runtime, so a standalone render has no
posts). Legal pages and blog posts are native Wix and already server-rendered.

**Steps**
1. Replace the backend file `backend/seoMarkup.web.js` with `velo/seoMarkup.web.js`.
2. Replace the HRV page code with `velo/page-seo-snippet.js`, publish, and run
   `scripts/check-seo-markup.sh` on HRV. This proves the type selector and path lookup.
   If it fails, fall back to `$w('#<elementId>')` per page.
3. Paste the snippet on every other page in `PAGES`. Contact and calories-in-anything already
   have page code: merge into their existing `onReady`.
4. Publish, then check each page with `scripts/check-seo-markup.sh`.
5. Watch the largest pages: wearable-accuracy (106 KB) and smart-ring-comparison (65 KB) are
   2–3x the 33 KB proven on HRV. If the check shows them cut short, trim them in the generator.
6. Remove the hand-written "Text summary of this page" custom-code embeds once each page passes.

**Size per page** (words): wearable-accuracy 14.7k, smart-ring 7.7k, wearable-stress 6.7k,
recovery 6.2k, heart-rate 6.0k, accuracy-factors 5.7k; the rest 0.2k–5.3k.
