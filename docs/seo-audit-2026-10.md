# SEO Audit — www.kygo.app (2026-10-14)

> **Status (same day):** fixed — C1 (Wix schema synced to components on 12 pages, published;
> component guard against duplicates), H3, M1 (except stress-factors: its Wix FAQ exceeds the 4 KB
> API limit, so any write would drop it), stale counts in HRV / VO2-factors / wearable-accuracy
> titles. Correction: `/faq`'s two FAQPage blocks are a deliberate split (4 KB cap), not duplicates,
> and stress-factors does get WebApplication (from its component). Still open: H1, H2 (sleep-metrics
> FAQPage, deep-sleep/REM WebApplication), H4, M2, L1–L5 — these need the Wix editor or a decision.

> **Re-verified 2026-10-14 (fresh fetches, cache MISS; GitHub Pages = HEAD):** C1 resolved. No
> rendered page serves an @type twice (`/faq`'s split excepted), and the Wix SEO panel draft = live
> = component JSON-LD on every page (only diff: SpO2 vs SpO₂ in the oura-vs-ringconn FAQ). H3 fixed.
> Still open: H1 (tool pages ~215–330 server-side words), H2 (see `schemas-and-tracking.md`), H4
> (pages now cross-link; titles still overlap), M1 (stress-factors title 72 / desc 181;
> calories-in-anything title 63; supplements-by-metric title 62), M2, L1, L3 (footer on all 35
> pages). Fixed in code the same day: stale HRV "38 factors" (live: 43) on `/tools` + 3 related
> cards; pricing copy on `/faq`, `/how-it-works`, home (web $39.99 + lifetime added; `/faq` said the
> price was the same on web and app). Not yet fixed: the `/faq` Wix FAQPage answers still carry the
> old pricing text; several comparison FAQs list Samsung Galaxy Watch (not Polar) as a Kygo
> integration — needs a product decision.

Scope: the 35 URLs in `pages-sitemap.xml` (home, `/tools` + 25 tool pages, how-it-works, FAQ,
blog index, contact, legal). The 70 blog posts were not audited.

Method: [Claude SEO](https://github.com/AgriciDaniel/claude-seo) v2.4.2 audit checklist
(`skills/seo-audit`). Its own fetcher refuses to run behind the session's network proxy (its
SSRF guard rejects the proxy's private address), so pages were rendered with Playwright/Chromium
directly (desktop 1366px + iPhone 13), and raw pre-JavaScript HTML was fetched with a Googlebot
user agent. Performance numbers are lab-only through a proxy and are **not** used as findings;
confirm Core Web Vitals in PageSpeed Insights / Search Console.

## Top quick wins

1. Sync the Wix SEO-panel FAQ JSON-LD to the component FAQ on the 10 pages where answers conflict (C1).
2. Remove the duplicate FAQPage on `/faq` and the extra FAQPage on `/tools/recovery-score-explorer` (C1).
3. Shorten the meta descriptions on 6 pages to ≤160 chars (M1).
4. Shorten the 3 titles over 60 chars (M1).
5. Rewrite the `/tools` title + description, which still describe a food-analysis page (H3).
6. Give each tool page its own `og:image`; all 35 pages share one (M2).
7. Add FAQPage to `/tools/sleep-metrics` or drop the docs claim that Wix manages it (H2).
8. Fix the second H1 on `/blog` and `/consumer-health-data` (L1).
9. Update the stale footer (`© 2025`, `ryan@kygo.app`) and the "iOS and Android app" line in the static summaries (L3).
10. Pick one canonical page for "Oura Ring 5 vs 4" (H4).

## What works

- All 35 pages return 200, self-canonical, `lang` set, viewport set, no `noindex`, no mobile
  horizontal overflow, no console errors, zero images without `alt`.
- `robots.txt` allows all crawlers (AI bots included) and declares the sitemap; `kygo.app` and
  trailing-slash URLs 301 to the canonical `www` form; unknown URLs return a real 404.
- `/llms.txt` exists and is accurate and current (pricing, platforms, methodology).
- Every tool page has a static "Text summary of this page" block in the server HTML, so non-JS
  crawlers get some page-specific text.
- Every tool page has one H1, in the component's shadow DOM; Google renders shadow DOM, so this is fine.

## Critical

### C1. Every tool page serves its structured data twice, and on 10 pages the two FAQ copies disagree

Each tool page has JSON-LD from **two sources**: the Wix SEO panel (in the server HTML) and the
component's `_injectStructuredData()` (added by JavaScript, tagged `data-kygo-*-ld`). After
rendering, Google sees 2× FAQPage, 2× WebApplication and 2× BreadcrumbList on 23 tool pages.

The FAQ copies have drifted. Same question, different answer text (Wix copy vs component copy):

| Page | FAQ Qs (Wix / component) | Same Q, different answer |
|---|---|---|
| `/tools/vo2-max-factors` | 5 / 5 | 5 |
| `/tools/hrv-factors` | 5 / 5 | 5 |
| `/tools/accuracy-factors` | 8 / 9 | 5 (+3 Qs only in one copy) |
| `/tools/step-count-accuracy` | 7 / 8 | 4 (+3 Qs only in one copy) |
| `/tools/wearable-accuracy` | 5 / 6 | 3 (+2 Qs only in one copy) |
| `/tools/vo2-max-accuracy` | 5 / 5 | 3 |
| `/tools/fitbit-air-vs-whoop-comparison` | 7 / 7 | 3 |
| `/tools/oura-vs-ringconn` | 6 / 6 | 1 |
| `/tools/smart-ring-comparison` | 8 / 8 | 1 |
| `/tools/supplements-by-metric` | 8 / 11 | 0 (3 Qs only in the component) |
| `/tools/recovery-score-explorer` | 4 + 4 / 8 | **three** FAQPage blocks, no overlap |
| `/faq` | 7 + 7 | two FAQPage blocks, both from Wix |

Impact: Search Console reports duplicate `FAQPage` as an error. Worse, the server-HTML copy is
the one non-JS AI crawlers read, and it is the stale one. `fixes-and-issues.md` #K1g already
warns that "the live FAQ JSON-LD lives in the Wix SEO panel". This is that risk, on 10 pages.

Fix: keep **one** source per type per page.
- Recommended: treat the component as the source of truth, paste its current FAQ into the Wix
  SEO panel, then delete the duplicate types from the component's `_injectStructuredData()`.
  The Wix copy is in server HTML, so non-JS crawlers can read it.
- The functions are at `kygo-vo2max-factors.js:1223`, `kygo-hrv-factors.js:1923`,
  `kygo-accuracy-factors.js:742`, `kygo-step-count-accuracy.js:1549`,
  `kygo-wearable-accuracy.js:2001`, `kygo-vo2max-accuracy.js:1212`,
  `kygo-fitbit-air-vs-whoop.js:1064`, `kygo-oura-vs-ringconn.js:1294`,
  `kygo-smart-ring-comparison.js:1702`, `kygo-supplements-by-metric.js:651`,
  `kygo-recovery-scores.js:52`; the other tool components (same pattern, identical copies) are
  listed in the appendix.
- `kygo-oura-5-vs-4.js` already follows this model (Wix-only schema, no duplication).

## High

### H1. The tool content itself is invisible without JavaScript

Server HTML for a tool page is ~215–330 words: nav, footer, disclaimer and the ~100-word static
summary. The thousands of words of factor cards, tables and FAQs, and the `__seo()` light-DOM
text, only exist after JavaScript runs. Google renders JS; GPTBot, ClaudeBot and PerplexityBot
are widely reported not to. So for AI search, each tool page is effectively ~100 words.

`/tools/oura-ring-5-vs-4` (434 server-side words; its "Wix GEO static-text embed", see
`kygo-oura-5-vs-4.js:14`) shows the pattern working. Fix: expand the static summary on each tool
page to the key findings (the top factors / rankings / headline numbers, ~300–500 words), in
the Wix-side text embed, not in the component.

### H2. The schema docs no longer match the live site

`docs/schemas-and-tracking.md` ("Schema notes & intentional omissions") says:
- `kygo-sleep-metrics.js` skips FAQPage because Wix manages it. Live: **no FAQPage at all** on
  `/tools/sleep-metrics`.
- `kygo-deep-sleep-factors.js` skips WebApplication because Wix manages it. Live: **no
  WebApplication** on `/tools/deep-sleep-factors` (also missing on `/tools/rem-sleep-factors`
  and `/tools/stress-factors`).

Fix: add the missing types in the Wix panel (or the component, per C1's single-source rule) and
update the doc.

### H3. `/tools` title and description describe a different page

Title "Free Health Tools | Kygo Health" (31 chars) and description "…AI-powered food analysis,
calorie estimates, and more" while the page is a directory of 25 wearable-accuracy and
factor-research tools. Suggested title: "Free Wearable Accuracy & Health Research Tools | Kygo"
with a description naming the tool groups (accuracy, sleep, HRV, comparisons).

### H4. Two pages compete for "Oura Ring 5 vs 4"

`/tools/oura-ring-comparison-tool` ("Oura Ring 5 vs 4 vs 3 Comparison Tool") and
`/tools/oura-ring-5-vs-4` ("Oura Ring 5 vs Oura Ring 4") target the same query. Pick the
primary for "5 vs 4"; refocus the other title on "vs 3"/"all generations" and link the two
pages to each other.

## Medium

### M1. Title and meta-description lengths
Descriptions over ~160 chars (truncated in results): `/tools/sleep-metrics` 231,
`/tools/step-count-accuracy` 218, `/consumer-health-data` 202, `/tools/stress-factors` 181,
home 171, `/tools/calorie-burn-accuracy` 164. Titles over ~60 chars: `/tools/sleep-metrics` 87,
`/tools/stress-factors` 72, `/tools/wearable-accuracy` 68. All are set in the Wix page SEO panel.

### M2. One `og:image` for all 35 pages
Every page shares the same `og:image`, so shared links all show the same card. Give each tool
page its own 1200×630 image (the cover image of the related blog post works).

### M3. Page weight
~170–250 network requests per page (Wix baseline plus 3 shared Kygo scripts plus the tool
script). Lab LCP through the proxy was noisy (0.3–8 s) and is not reported as a finding; check
field data in Search Console → Core Web Vitals before optimising.

## Low

- **L1. Two H1s** on `/blog` ("Kygo Health's Blog" + Wix's "All Posts") and
  `/consumer-health-data` (page title + all-caps document heading). Demote the second to H2.
- **L2. Heading level skips** (e.g. H2 → H4) on most tool pages, worst on
  `oura-vs-ringconn`, `oura-ring-comparison-tool`, `fitbit-air-vs-whoop`, `oura-ring-5-vs-4`,
  `heart-rate-accuracy` (3 skips each). Accessibility more than ranking.
- **L3. Stale sitewide footer and summary text** in server HTML: "© 2025", contact
  `ryan@kygo.app` (llms.txt and schema say `support@kygo.app`), and the static summaries call
  Kygo "an iOS and Android app" (it is iOS, Android and web).
- **L4. `/tools/calories-in-anything` H1** "Scan your food. Know your nutrition." does not
  contain the target phrase ("calorie scanner" / "calories in").
- **L5. `/contact`** has 69 words of server HTML and no H1 before JavaScript runs.

## Appendix — tool components with identical duplicate schema (C1, no content drift)

`kygo-deep-sleep-factors.js:1548`, `kygo-sleep-latency-factors.js:1630`,
`kygo-oura-ring-comparison.js:1289`, `kygo-wearable-stress.js:55`,
`kygo-staying-asleep-factors.js:1709`, `kygo-sensor-comparison.js:1919`,
`kygo-rem-sleep.js:1492`, `kygo-rhr-factors.js:1672`, `kygo-sleep-tracker-accuracy.js:1287`,
`kygo-heart-rate-accuracy.js:1629`, `kygo-calorie-burn-accuracy.js:1404`,
`kygo-sleep-metrics.js:1610` (WebApplication + BreadcrumbList duplicated). `/tools/calories-in-anything`
also duplicates WebApplication + FAQPage (3 identical Qs).
