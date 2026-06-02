# Fixes & Issues — Consolidated Backlog

> Severity-ranked backlog of bugs/inconsistencies across the repo, with file:line + suggested fix.
> **Status reflects live browser QA (2026-06) — see the Status column.** Deploy model: a commit to
> a tracked branch ships via CDN, so verify before pushing.
>
> Severity: **P1** = visibly broken in prod · **P2** = broken/meaningful · **P3** = polish ·
> **Closed** = QA confirmed fine / not a bug · **Needs input** = blocked on you.

## ✅ Resolved on branch `claude/hopeful-faraday-ig1PE` (2026-06)

- **#2** food-scanner `${this.dailyLimit}` → now a template literal (`calories-custom-element.js:1296`).
- **#3** tool-component footers → `/privacy-policy` + `/terms-conditions` across all 13 files.
- **#4** calorie-burn article link → `/post/how-accurate-is-your-wearable-calorie-burn`.
- **#5** food-scanner URLs → `/tools/calories-in-anything` (`calories-custom-element.js:229,1615`).
- **#6** Oura canonical/breadcrumb → `/tools/oura-ring-comparison-tool` *(Wix-side redirect of the
  orphaned root route confirmed to `https://www.kygo.app/tools/oura-ring-comparison-tool`)*.
- **#9** deleted orphaned `kygo-blog-page.js`.
- **#1** Deep Sleep affiliate links fixed: Glycine → `3PWfatc`, Tart Cherry → `3PXqKEh`, Cooling
  Mattress Pad affiliate **removed** (no good product). Reused-link collisions with HRV resolved.
- **#7** Samsung Galaxy Watch unified to `amzn.to/3PUMS23` across all 3 pages (replaced broken
  `4tfkllQ` + old `4aZkBPB`).
- **#4** calorie-burn link confirmed live at `/post/how-accurate-is-your-wearable-calorie-burn`.
- **#11** font `@import` standardized on the DM Sans `400;500;600;700` variant (7 files updated, 11 total).
- **#15** host normalized to `https://www.kygo.app` across all components — **except** the
  `kygo.app/android` download redirect, intentionally left bare (verified-working, key conversion;
  `www.kygo.app/android` not yet verified to resolve).
- **#16** iOS download links standardized to the direct App Store URL
  `https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589` (replaced the `/iOS`
  redirect in Oura + Fitbit-vs-WHOOP; also fixes their GA `ios_download` classification).

**Closed (owner decisions):** **#8** no GA forwarding — app-download clicks are the key conversion
and already tracked. **#10** Health Connect logo confirmed correct. **#14** dates updated only on
real edits. **#17** Cooling Mattress Pad stays linkless (no product).

- **#12** sleep-latency affiliate links wired (9 factors: 8 reusing existing product links +
  new Dietary Fiber `amzn.to/4uL7b1p`; CBD/Kiwifruit intentionally skipped).
- **#15 follow-up** done: `kygo.app/android` → `www.kygo.app/android` (confirmed resolving). No
  bare `kygo.app` URLs remain.

**Still open:** **#13** consent gating (your legal call) and the standing **Cooling Mattress Pad**
link gap (no product yet).

## Summary

| # | Area | Severity | Status | One-liner |
|---|---|---|---|---|
| 1 | Affiliate | **P1** | Needs input | Deep Sleep page's 3 affiliate links resolve to the HRV products (all wrong) |
| 2 | Code bug | **P1** | Fix ready | `${this.dailyLimit}` shows literally in food-scanner FAQ |
| 3 | Links | **P1** | Fix ready | Tool-component footers link `/privacy` & `/terms` → both 404 |
| 4 | Links | **P2** | Fix ready | Calorie-burn "Read the Article" → `/blog/…` 404 (should be `/post/…`) |
| 5 | Links | **P2** | Fix ready | Food-scanner internal/canonical URLs 404 (real path `/tools/calories-in-anything`) |
| 6 | Links | **P2** | Fix ready + Wix | Oura tool canonical is root `/oura-ring-comparison-tool` (orphaned/blank); real page is `/tools/…` |
| 7 | Affiliate | **P2** | Needs input | Samsung link `amzn.to/4tfkllQ` → Amazon search + error page (broken) |
| 8 | Tracking | **P3** | Open (opt-in) | Contact/subscribe conversions not sent to GA4 |
| 9 | Code/cleanup | **P3** | Confirm to remove | `kygo-blog-page.js` is an orphaned 2nd `kygo-blog` registration (not live) |
| 10 | Assets | **P3** | Spot-check | Asset `46b3b6ce` double-labeled (Whoop card renders fine; verify Health Connect rows) |
| 11 | Assets | **P3** | Open | Two Google Fonts `@import` variants (DM Sans 700 drift) |
| 12 | Affiliate | **P3** | Open | `kygo-sleep-latency-factors.js` renders affiliate chips but has none |
| 13 | Tracking | **P3** | Verify | No consent/CMP gating before GA loads (GA ID `G-P2224N75KY`) |
| 14 | Schema | **P3** | Open | Hardcoded `dateModified` values go stale |
| — | Links | — | **Closed** | Bare `kygo.app` → `www` redirects cleanly (1 hop) |
| — | Links | — | **Closed** | `/iOS` redirect works → App Store |
| — | Assets | — | **Closed** | "Two Kygo logos" = same mark, flat vs glossy render |
| — | Tracking | — | **Closed** | `kygo-tracking.js` + GA ID confirmed live on tool pages |
| — | Schema | — | **No action** | faq-section / deep-sleep / sleep-metrics omissions are intentional (site-level LD) |

---

## P1 — visibly broken

### 1. [Needs input] Deep Sleep page's affiliate links are wrong
QA confirmed all three shared `amzn.to` slugs resolve to the **HRV** products, so
**`kygo-deep-sleep-factors.js`** is the page with wrong links (HRV page is correct):

| Slug | Actually lands on | HRV label ✅ | Deep Sleep label ❌ (file:line) |
|---|---|---|---|
| `amzn.to/3OyDz7c` | GABA 500mg | "GABA Supplement" | "Glycine Powder" — `kygo-deep-sleep-factors.js:208` |
| `amzn.to/406okEX` | Beetroot Juice (Beet Sport Pro) | "Beetroot Juice Shots" | "Tart Cherry Juice" — `:221` |
| `amzn.to/4aYRATe` | Cold Plunge / Ice Bath Tub | "Cold Plunge Tub" | "Cooling Mattress Pad" — `:250` |

- **Fix:** replace the three Deep Sleep links with correct affiliate URLs for **Glycine Powder**,
  **Tart Cherry Juice**, and a **Cooling Mattress Pad**. → **Need the 3 new `amzn.to`/Amazon URLs from you.**

### 2. [Fix ready] `${this.dailyLimit}` literal in food-scanner FAQ
`calories-custom-element.js:1296` — the answer is a double-quoted argument string, so it renders
`You get ${this.dailyLimit} free scans per day`. **Fix:** make it a template literal (backticks).

### 3. [Fix ready] Tool-component footers point at dead Privacy/Terms
The Wix **site** footer is fine (`/privacy-policy` 200, `/terms-conditions` 200). But each tool
component's **own mini-footer** links `kygo.app/privacy` and `kygo.app/terms` — **both 404 on
every tool page.**
- **Fix:** `/privacy` → `/privacy-policy`, `/terms` → `/terms-conditions` in the component footers.
- Files (13): `kygo-calorie-burn-accuracy.js`, `kygo-deep-sleep-factors.js`,
  `kygo-fitbit-air-vs-whoop.js`, `kygo-hrv-factors.js`, `kygo-oura-ring-comparison.js`,
  `kygo-rhr-factors.js`, `kygo-sensor-comparison.js`, `kygo-sleep-latency-factors.js`,
  `kygo-sleep-metrics.js`, `kygo-staying-asleep-factors.js`, `kygo-step-count-accuracy.js`,
  `kygo-wearable-accuracy.js`, `calories-custom-element.js`.

---

## P2 — broken / meaningful

### 4. [Fix ready] Calorie-burn article link 404
`kygo-calorie-burn-accuracy.js:527` → `/blog/how-accurate-is-your-wearable-calorie-burn` (404).
**Fix:** change `/blog/` → `/post/` to match the live pattern. *Confirm the exact post slug exists.*

### 5. [Fix ready] Food-scanner internal/canonical URLs 404
Both `/food-scanner` and `/tools/food-scanner` 404; the real page is **`/tools/calories-in-anything`**
(matches the tag `calories-in-anything`).
- **Fix in `calories-custom-element.js`:** update the JSON-LD `url`, breadcrumb, and any share/nav
  links (lines ~229 `/tools/food-scanner`, ~1615 `/food-scanner`) to `/tools/calories-in-anything`.

### 6. [Fix ready + Wix] Oura tool canonical path
Real tool lives at **`/tools/oura-ring-comparison-tool`** (loads fine, iOS CTA works). The bare
root `/oura-ring-comparison-tool` is an **orphaned 200-but-blank route** (Wix "did not find the
pageId" error). The component's canonical/JSON-LD uses the **root** path
(`kygo-oura-ring-comparison.js:643,687`).
- **Fix (code):** change canonical/breadcrumb from `/oura-ring-comparison-tool` → `/tools/oura-ring-comparison-tool`.
- **Fix (Wix, your side):** redirect the orphaned root route to the `/tools/` version.

### 7. [Needs input] Samsung affiliate link broken
`amzn.to/4tfkllQ` (`kygo-calorie-burn-accuracy.js:1294`) → Amazon **search** "samsung galaxy
watch" and renders Amazon's "Something went wrong" page. The other pages use `amzn.to/4aZkBPB`
(unverified).
- **Fix:** replace with a working Samsung Galaxy Watch product link. → **Need a valid URL** (and
  ideally unify all Samsung links on it once confirmed working).

---

## P3 — polish / decisions

### 8. [Opt-in] Conversion events not in GA4
`contactSubmit`, `subscribe`, `kygo-calculation` fire as Wix events only. If you want them as GA4
conversions, I can wire `kygo-tracking.js` to forward them. (Otherwise leave as-is.)

### 9. [Confirm to remove] Orphaned `kygo-blog-page.js`
No live conflict — `/blog` uses `kygo-blog.js`, posts use `kygo-blog-post.js`. But
**`kygo-blog-page.js`** also defines `class KygoBlog` / registers `kygo-blog` and appears **unused
live**. **Action:** confirm it's dead and delete it (removes the latent duplicate-registration risk).

### 10. [Spot-check] Asset `46b3b6ce` double-labeled
The Whoop card renders the correct WHOOP logo live, so no visible bug. But the same asset
(`273a63_46b3b6ce…`) is referenced as both a Whoop image and `alt="Health Connect"`. Quick check:
do the **Health Connect** logo rows show the right icon? If yes, just a naming quirk; close it.

### 11. Font `@import` drift — two Google Fonts URLs (one with DM Sans 700). Standardize on one.
### 12. `kygo-sleep-latency-factors.js` — affiliate chip slots wired but empty. Populate or leave.
### 13. No consent/CMP gating before GA (`G-P2224N75KY`) loads — confirm vs. cookie policy.
### 14. Hardcoded `dateModified` in `_injectStructuredData()` — refresh when editing a page.
### 15. [Optional, not broken] Host mismatch — bare `kygo.app` vs `www.kygo.app` used interchangeably. Redirects cleanly (QA); normalize only for SEO/tidiness.
### 16. [Optional, not broken] iOS link style — most pages use the App Store URL; Oura + Fitbit-vs-WHOOP use the `/iOS` redirect (works). Standardize for consistency only.
### 17. [Missing data] Cooling Mattress Pad has no affiliate link (removed; was wrong). Add one if a good product turns up.

---

## Wix global custom code (head + header/footer) — audit 2026-06-02

> Mirrored & reviewed in `docs/wix-global-code.md`. These live in the **Wix editor**
> (Settings → Custom Code + site header/footer), not in this repo — fixes are applied **in Wix**.

| # | Area | Severity | Status | One-liner |
|---|---|---|---|---|
| 18 | Schema | **P2** | Needs input | Two head `SoftwareApplication` blocks ship conflicting `aggregateRating` (`ratingCount` 30 vs 1) — consolidate to one honest rating |
| 19 | Content | **P2** | Needs input | Footer email `ryan@kygo.app` ≠ schema/components `support@kygo.app` — pick one public address |
| 20 | Links | **P2** | Needs input | Header/footer link `/contact-8`; all components + docs use `/contact` — confirm real slug, normalize |
| 21 | Links/SEO | **P3** | Fix in Wix | Homepage `@graph` uses bare `https://kygo.app` for `url`/`downloadUrl` — normalize to `www` (matches #15) |
| 22 | Schema | **P3** | Verify | `WebSite.potentialAction` SearchAction targets `/search?q=` — verify the page exists or remove |
| 23 | Schema | **P3** | Fix in Wix | `SoftwareApplication.screenshot` reuses the **logo** URL, not a real app screenshot |
| 24 | Assets | **P3** | Fix in Wix | Head fonts `<link>` loads DM Sans `400;500;600` (no `700`) — add `;700` to match repo standard (#11) |
| 25 | Content | **P3** | Fix in Wix | Footer disclaimer says **© 2025** (it's 2026) — update the year |
| 26 | A11y | **P3** | Optional | Header hamburger is a `<div onclick>` with no `role`/`aria-label`/keyboard handler |

**Confirmed OK:** logo asset, Apple App Store URL, `www.kygo.app/android`, Privacy/Terms/Accessibility
paths, GA4 ID `G-P2224N75KY`, and GA tracking of both download CTAs (via `href` match).

---

## Closed by QA (no action)
- Bare `kygo.app` → `www.kygo.app` redirects cleanly in one hop.
- `/iOS` redirect resolves to the App Store (Oura + Fitbit-vs-WHOOP CTAs OK).
- Fitbit Air (`4wogJ3y`) and WHOOP (`431iUfG`) hero links are correct.
- "Two Kygo logos" are the same mark (flat vs glossy render) — not wrong.
- `kygo-tracking.js` + GA ID `G-P2224N75KY` confirmed loading on tool pages.
- Intentional schema omissions (faq-section / deep-sleep / sleep-metrics) — leave as-is.

---

## What I can fix now vs. what I need from you

**Can apply immediately (code-side, confirmed):** #2 dailyLimit · #3 footer Privacy/Terms (13 files) ·
#4 calorie-burn `/post/` · #5 food-scanner → `/tools/calories-in-anything` · #6 Oura canonical → `/tools/…`.

**Need input before I can fix:**
- #1 — three correct affiliate URLs for **Glycine Powder, Tart Cherry Juice, Cooling Mattress Pad**.
- #7 — one working **Samsung Galaxy Watch** affiliate URL.
- #9 — confirm `kygo-blog-page.js` is dead so I can delete it.
- #6 (Wix side) & #13 — your call (Wix redirect; consent policy).
