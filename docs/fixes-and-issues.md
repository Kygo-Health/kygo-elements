# Fixes & Issues — Consolidated Backlog

> Everything found across the repo that may need fixing, grouped by area and **ranked by
> severity**. Each item lists the exact file/line and a suggested fix. Verified against source on
> the audit date; items needing live-site confirmation are marked **[verify]**.
>
> Severity: **P1** = visibly broken / wrong in production · **P2** = likely broken or
> meaningful inconsistency · **P3** = polish / consistency / maintainability · **Intentional /
> No action** = confirmed deliberate, listed so it isn't "re-discovered" as a bug.

## Summary

| # | Area | Severity | One-liner |
|---|---|---|---|
| 1 | Code bug | **P1** | Duplicate `kygo-blog` custom-element registration in two files |
| 2 | Code bug | **P1** | `${this.dailyLimit}` in a double-quoted string renders literally |
| 3 | Assets | **P1** | Whoop card shows the Health Connect logo image |
| 4 | Affiliate | **P1** | 3 Amazon short links reused for different products |
| 5 | Links | **P2** [verify] | Footer links `/privacy` but real page is `/privacy-policy` |
| 6 | Links | **P2** [verify] | Calorie-burn article uses `/blog/…` while all others use `/post/…` |
| 7 | Affiliate | **P2** | Samsung Galaxy Watch has two different affiliate links |
| 8 | Links | **P2** | Bare `kygo.app` vs `www.kygo.app` used interchangeably |
| 9 | Tracking | **P2** | Conversion CustomEvents not forwarded to GA4 |
| 10 | Tracking | **P2** [verify] | Analytics only fires if `kygo-tracking.js` + `data-ga-id` present |
| 11 | Links | **P3** | iOS download: App Store URL vs `/iOS` redirect inconsistency |
| 12 | Links | **P3** | Food-scanner uses both `/food-scanner` and `/tools/food-scanner` |
| 13 | Links | **P3** | Oura tool lives at `/oura-ring-comparison-tool`, not under `/tools/` |
| 14 | Assets | **P3** | Two different Kygo logo assets |
| 15 | Assets | **P3** | Two Google Fonts `@import` variants (DM Sans 700 drift) |
| 16 | Affiliate | **P3** | `kygo-sleep-latency-factors.js` renders affiliate chips but has none |
| 17 | Tracking | **P3** [verify] | No consent/CMP gating before GA loads |
| 18 | Schema | **P3** | Hardcoded `dateModified` values go stale |
| 19 | Assets | **Info** | All images hardcoded to Wix `static.wixstatic.com` (no fallback) |
| — | Schema | **No action** | `faq-section` / `deep-sleep` / `sleep-metrics` omissions are intentional |

---

## Area 1 — Code bugs (functional)

### 1. [P1] Duplicate `kygo-blog` registration
`kygo-blog.js:1068` and `kygo-blog-page.js:618` both define `class KygoBlog` and call
`customElements.define('kygo-blog', KygoBlog)`. If both scripts load on the same page, the second
`define()` throws `DOMException: 'kygo-blog' has already been used` and that component fails to
render.
- **Fix:** decide which is canonical, then delete/retire the other or rename its tag
  (e.g. `kygo-blog-page`). Confirm the Wix embeds only point at the surviving file.
- **Note:** `kygo-blog-page.js` also injects `BlogPosting`/`WebPage` schema and `kygo-blog.js`
  injects `CollectionPage` — they may be an index vs. single-post split that was never renamed.

### 2. [P1] Un-interpolated `${this.dailyLimit}` in food-scanner FAQ
`calories-custom-element.js:1296` —
`renderFaqItem(4, "Is there a daily limit?", "You get ${this.dailyLimit} free scans per day …")`.
The answer is a **double-quoted string** (a function argument), so `${this.dailyLimit}` is **not**
interpolated and the page literally shows "You get ${this.dailyLimit} free scans per day."
- **Fix:** use a template literal or concatenation:
  `` `You get ${this.dailyLimit} free scans per day …` `` (or `"You get " + this.dailyLimit + " …"`).
- Only occurrence (the JSON-LD FAQ at line ~1652 uses separate, correct text).

---

## Area 2 — Image / logo assets

### 3. [P1] Whoop card uses the Health Connect logo
`kygo-sensor-comparison.js:81` sets the **Whoop 5.0** `imageUrl` to
`273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png`, which is the **Health Connect logo** everywhere
else (incl. line 1076 of the same file, `alt="Health Connect"`).
- **Fix:** point it at the Whoop product image `273a63_c52aaaca1f7243f3818cf51d9374dbd4~mv2.png`
  (or the Whoop logo `273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png`, matching sibling cards).

### 14. [P3] Two Kygo logo assets
`273a63_7ac49e91…` is used in 37 places (and as the JSON-LD Organization `logo`);
`273a63_d0b94a6b…` is used only in `kygo-sensor-comparison.js`.
- **Fix:** confirm the current brand logo and standardize on one hash.

### 15. [P3] Font `@import` drift
Two near-identical Google Fonts URLs exist — one includes `DM Sans` weight **700**, one doesn't.
- **Fix:** pick one (the 700 variant if any headings/bold use 700) for consistent weights and one
  cached stylesheet. See `docs/assets-and-urls.md §4`.

### 19. [Info] Wix media coupling
Every image is a hardcoded `static.wixstatic.com/media/273a63_…` URL with no repo-local fallback
beyond `onerror="this.style.display='none'"`. If the Wix media library changes, images break
across all components. Architectural note, not an immediate fix.

---

## Area 3 — Affiliate links

### 4. [P1] Reused Amazon short links → wrong product
The same `amzn.to` slug points at two different products (buyers land on the wrong item):

| Short link | Used as | and as |
|---|---|---|
| `amzn.to/3OyDz7c` | Glycine Powder (`kygo-deep-sleep-factors.js:208`) | GABA Supplement (`kygo-hrv-factors.js:123`) |
| `amzn.to/406okEX` | Tart Cherry Juice (`kygo-deep-sleep-factors.js:221`) | Beetroot Juice Shots (`kygo-hrv-factors.js:145`) |
| `amzn.to/4aYRATe` | Cooling Mattress Pad (`kygo-deep-sleep-factors.js:250`) | Cold Plunge Tub (`kygo-hrv-factors.js:179`) |

- **Fix:** create a correct, distinct Amazon affiliate link for each product. **[needs your input]** —
  I can't see the destination ASIN behind a short link, so I need the right URLs.

### 7. [P2] Samsung Galaxy Watch — two different links
`amzn.to/4aZkBPB` (`step-count-accuracy.js:159`, `wearable-accuracy.js:138`) vs
`amzn.to/4tfkllQ` (`calorie-burn-accuracy.js:1294`).
- **Fix:** confirm the canonical Samsung link and use it everywhere.

### 16. [P3] Empty affiliate slots in sleep-latency
`kygo-sleep-latency-factors.js:518` renders `f.affiliate` chips, but the factor data contains no
affiliate URLs — the capability is wired but unused.
- **Fix:** either populate relevant affiliate links or leave intentionally empty (no harm).

### [Info] Short links hide the associate tag
Every device/product link is an `amzn.to` short link; the Amazon associate **tag** isn't visible
in-repo and can't be audited here. Verify tags on Amazon's side.

---

## Area 4 — Internal links & URLs

### 5. [P2][verify] Privacy path mismatch
Components link `https://kygo.app/privacy` (13 places), but the live policy page is
`https://www.kygo.app/privacy-policy` (per product owner).
- **Fix (if confirmed):** update footer links to `/privacy-policy`. Also re-check `/terms`.
- Locations: footers in `kygo-calorie-burn-accuracy.js`, `kygo-deep-sleep-factors.js`,
  `kygo-fitbit-air-vs-whoop.js`, `kygo-hrv-factors.js`, `kygo-oura-ring-comparison.js`,
  `kygo-rhr-factors.js`, `kygo-sensor-comparison.js`, `kygo-sleep-latency-factors.js`,
  `kygo-sleep-metrics.js`, `kygo-staying-asleep-factors.js`, `kygo-step-count-accuracy.js`,
  `kygo-wearable-accuracy.js`, `calories-custom-element.js`.

### 6. [P2][verify] Calorie-burn article link prefix
`kygo-calorie-burn-accuracy.js:527` links `…/blog/how-accurate-is-your-wearable-calorie-burn`,
while all other article links use `…/post/<slug>`.
- **Fix (if `/post/` is correct):** change to `/post/how-accurate-is-your-wearable-calorie-burn`.

### 8. [P2] Host inconsistency `kygo.app` vs `www.kygo.app`
In-page nav/footer use bare `kygo.app`; JSON-LD `url`/canonical use `www.kygo.app`. Mixed hosts
hurt canonicalization/SEO.
- **Fix:** choose one canonical host (JSON-LD already standardizes on `www.`) and normalize links.

### 11. [P3] iOS download inconsistency
Most files link the App Store URL directly; `kygo-oura-ring-comparison.js` and
`kygo-fitbit-air-vs-whoop.js` use a `/iOS` redirect.
- **Fix:** standardize (either always App Store URL or always the redirect).

### 12. [P3] Food-scanner dual path
`calories-custom-element.js` uses both `/tools/food-scanner` (line 229) and `/food-scanner`
(line 1615).
- **Fix:** pick the real route and use it in both places.

### 13. [P3] Oura tool off-pattern path
`kygo-oura-ring-comparison.js` canonical is `/oura-ring-comparison-tool` (root), while every other
tool is `/tools/<slug>`. Confirm intended; normalize if it should be `/tools/…`.

---

## Area 5 — Tracking / analytics

### 9. [P2] Conversion events not sent to GA4
`subscribe` (`kygo-blog-post.js`), `contactSubmit` (`kygo-contact.js`), and `kygo-calculation`
(`kygo-calorie-burn-accuracy.js`) fire as Wix CustomEvents but are **not** mirrored to GA4, so
these conversions aren't measured.
- **Fix:** add matching `data-action`s the tracker already classifies, or extend
  `kygo-tracking.js` to listen for these CustomEvents and `track()` them.

### 10. [P2][verify] Analytics depends on the embed
GA4 only fires if the Wix page includes `kygo-tracking.js` **with a valid `data-ga-id`**. Any page
missing it has no analytics (events log to console only).
- **Fix:** verify the tracking script + GA ID are present on every page that ships components.

### 17. [P3][verify] No consent/CMP gating
`kygo-tracking.js` loads gtag immediately when `data-ga-id` is set — no cookie-consent gate.
- **Fix:** confirm this matches the site privacy/cookie policy; add CMP gating if required.

---

## Area 6 — Schema / structured data

### 18. [P3] Stale `dateModified`
`datePublished`/`dateModified` are hardcoded per file in `_injectStructuredData()`. Update
`dateModified` whenever a page's content changes.

### [No action] Intentional schema omissions
Confirmed **deliberate** (explicit "managed via Wix site-level LD+JSON" comments) — do **not**
"fix":
- `kygo-faq-section.js` — empty `_injectStructuredData() {}`, FAQPage at site level.
- `kygo-deep-sleep-factors.js` — no WebApplication (site level).
- `kygo-sleep-metrics.js` — no FAQPage (site level).
- `kygo-blog-post.js` sub-components — page fragments; schema lives in `kygo-blog-page.js`.

---

## Suggested order of attack

1. **P1 quick wins** (small, safe, visible): #2 dailyLimit, #3 Whoop image. Then #1 blog dedupe
   (needs a decision on which file survives).
2. **P1 needing your input:** #4 affiliate links (need correct ASIN URLs).
3. **P2 link/route fixes** once you confirm live routes: #5 privacy, #6 article prefix, #7 Samsung,
   #8 host normalization.
4. **P2 tracking:** #9 conversion events, #10 verify embeds.
5. **P3 polish** as a batch: #11–#18.

*Items marked [verify] or [needs your input] need confirmation before I change them; the rest I can
fix directly on request.*
