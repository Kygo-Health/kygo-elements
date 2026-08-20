# Fixes & Issues — Consolidated Backlog

> Severity-ranked backlog of bugs/inconsistencies across the repo, with file:line + suggested fix.
> **Status reflects live browser QA (2026-06) — see the Status column.** Deploy model: a commit to
> a tracked branch ships via CDN, so verify before pushing.
>
> Severity: **P1** = visibly broken in prod · **P2** = broken/meaningful · **P3** = polish ·
> **Closed** = QA confirmed fine / not a bug · **Needs input** = blocked on you.

## ✅ Resolved on branch `claude/vo2-max-factors-review-itgrnf` (2026-08)

Source-accuracy pass over the **VO2 Max Factor Explorer** (`kygo-vo2max-factors.js`) and its
canonical reference `vo2research.md`. Every factor row was re-checked against the primary record.

- **#V1 (P2) — overstated or wrong figures corrected** across 30+ rows. Highlights: HIIT vs-control
  SMD 0.41–1.81 (subgroup 0.50–2.48, was "up to 2.48"); SIT given its real pooled effect
  (Hedges' g 0.63, 95% CI 0.39–0.87, 13 of 19 studies, +4.2–13.4%); resistance training +1.89
  (1.21–2.57) for ≤24-week programmes with a null (−0.01) beyond, in healthy over-60s; detraining
  re-bucketed to ≤30 d / >30 d; bed rest 26% with 40-yr aging 27% (previously transposed); sex gap
  restated as ~10% per kg, elite-vs-elite; age given per-decade rates; sauna cohort 2,012 men with
  its real dose-response; sleep deprivation given its SMDs; air pollution 24 studies; heat
  acclimation given its four pooled Hedges' g.
- **#V2 (P2) — claims removed that the cited paper does not make.** "Cardio raises VO2 max more
  than lifting" (Smart 2022 makes no such comparison), "you start losing within ~2 weeks"
  (Zheng 2022's shortest bucket is ≤30 d), tapering's "VO2 max maintained or slightly improved"
  (Bosquet 2007 has no VO2 max outcome — four real effect sizes substituted), dehydration's
  "+1.5%/°C above 27°C", air pollution's "PM2.5 into the bloodstream", smoking's "appears
  reversible" (cross-sectional), type 2 diabetes' "roughly 20% lower", and cold-water immersion's
  "does not compromise VO2 max" (no pooled estimate exists).
- **#V3 (P2) — "no effect" downgraded to "not tested" where the source is silent.** Beta-alanine,
  sodium bicarbonate, and cold-water immersion report no VO2 max outcome at all; omega-3 is
  contested (the ISSN stand's own headline is net-positive), not a clean null; Deng 2025 is now
  cited in the vitamin D row only.
- **#V4 (P2) — direction/grade changes.** Blood donation flipped to *no clear reduction* (the review
  concludes VO2 max is **not** reduced) and downgraded to Weak; concurrent training downgraded to
  Weak (the meta tests training *sequence*, with no endurance-only arm); acute altitude, bed rest,
  dehydration, long COVID, and type 2 diabetes → Moderate; iron and SIT → Moderate–Strong. A
  four-tier evidence scale (Strong / Moderate–Strong / Moderate / Weak) replaces the two-tier one,
  with matching badges and filter chips.
- **#V5 (P2) — 9 broken or wrong citations fixed.** Hadzic (was *J Sport Health Sci* + an unrelated
  DOI → *J Sports Sci Med* 18(2):271-281), Deng (Front Nutr → *Food Sci Nutr*), Meeusen, Macedo
  (Sports Medicine → *Arch Endocrinol Metab*), Jäger, Shaw (first author is Shaw, not Levitt),
  Smart (Sports Medicine → *Age Ageing*), Cheuvront (*Sports Sci Exch* + a 2005 PMID →
  *J Appl Physiol* 2010), Eriksen (Prev Med → *Scand J Med Sci Sports*). Four placeholder PubMed
  URLs that pointed at non-existent IDs (`39900000`, `39800000`, `38000000`, `37000000`,
  `37500000`) replaced with real DOIs.
- **#V6 (P3) — 4 sources added** (49 Santalla 2003, 50 Berger 2006, 51 Lorenzo 2010, 52 Dorelli
  2025), so the bicarbonate slow-component claim is flagged contested, heat acclimation cites
  Lorenzo directly, and the previously-uncited "2025 meta" that *contradicts* the hypoxic-training
  row is named. Tool source count 36 → 40; `vo2research.md` 48 → 52.
- **#V7 (P3) — `vo2research.md` note corrected.** It claimed Sloth 2013's g=0.63/13-studies figures
  came from a different meta-analysis; they are in Sloth's own abstract, verified 2026-08-17.

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
  `kygo-sleep-metrics.js`, `kygo-staying-asleep-factors.js`,
  `kygo-wearable-accuracy.js`, `calories-custom-element.js`.
  (`kygo-step-count-accuracy.js` was rebuilt on the Family-A skeleton and already uses
  `/privacy-policy` + `/terms-conditions`.)

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

### 10. [Resolved in integration strips] Asset `46b3b6ce` / `0c0e48cc` double-labeled
Several "Works with" strips had the Whoop wordmark (`0c0e48cc`) and Health Connect logo
(`46b3b6ce`) swapped between the two badges. As part of the Whoop→Google Health logo swap
(2026-07) these strips were corrected: the Whoop badge became the Google Health logo and the
Health Connect badge was repointed to the true `46b3b6ce` asset, so no Whoop wordmark lingers.
**Still open (editorial):** the comparison pages (`kygo-fitbit-air-vs-whoop.js` WHOOP hero +
tables, and the `whoopImg` in the vo2max/sleep factor comparison scopes) still use `46b3b6ce`
(the Health Connect logo) as the WHOOP product image — left untouched, out of scope for the
integration-only swap.

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
| 18 | Schema | **P2** | Paste ready | Two head `SoftwareApplication` blocks ship conflicting `aggregateRating` (30 vs 1). **Decided:** consolidate to one `@graph`, rating **removed** (App Store reviews not markup-eligible per Google) |
| 19 | Content | **P2** | Paste ready | Footer email `ryan@kygo.app` ≠ schema `support@kygo.app`. **Decided:** use `support@kygo.app` |
| 20 | Links | **P2** | Paste ready | Header/footer link `/contact-8`; components use `/contact`. **Decided:** use `/contact` (change header + footer) |
| 21 | Links/SEO | **P3** | Paste ready | Homepage `@graph` uses bare `https://kygo.app` — normalized to `www` in corrected block (matches #15) |
| 22 | Schema | **P3** | Paste ready | `WebSite.potentialAction` SearchAction targeted `/search?q=` (no such page) — **removed** in corrected block |
| 23 | Schema | **P3** | Paste ready | `SoftwareApplication.screenshot` reused the **logo** URL — **removed** in corrected block |
| 24 | Assets | **P3** | Paste ready | Head fonts `<link>` missing DM Sans `700` — `;700` added in corrected block (#11) |
| 25 | Content | **P3** | Paste ready | Footer disclaimer **© 2025** → **2026** |
| 26 | A11y | **P3** | Optional | Header hamburger is a `<div onclick>` with no `role`/`aria-label`/keyboard handler |

**Confirmed OK:** logo asset, Apple App Store URL, `www.kygo.app/android`, Privacy/Terms/Accessibility
paths, GA4 ID `G-P2224N75KY`, and GA tracking of both download CTAs (via `href` match).

> **Corrected paste-ready blocks for #18–25 live in `wix-global-code.md` → "Corrected blocks".**
> Apply them in the Wix editor, then mark these closed and update the Block 2/3 mirror.

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

## Open — 2026-07-30 (site URL index reconciliation)

- **#18 — stale tool count on two live surfaces (Wix-side, not in repo).** `/post/free-health-wearable-tools`
  still says **19** in title/H1/body and omits `sleep-tracker-accuracy` + `oura-ring-5-vs-4`;
  `llms.txt` link text still reads "All **20** Free Tools" (though it lists all 21 URLs). Both are
  Wix-generated, so they can't be fixed in this repo. `kygo-tools.js` derives the count from the
  array (21), so the repo side is correct. **Needs input:** client update in Wix. *(Severity P2 SEO.)*
- **#19 — three surfaces compete for the "is the Oura Ring 5 worth it" query.** Two live posts
  (`/post/is-the-oura-ring-5-worth-it`, 2026-07-30, in-repo; and the older
  `/post/oura-ring-5-vs-ring-4-is-the-upgrade-worth-it-evidence-based`, which is **not** 301'd and
  still serves a full post) plus the tool `/tools/oura-ring-5-vs-4`. **Needs input:** decide which is
  canonical and 301 the losers. Blocks the blog cross-link (playbook §2.5) on the two Oura tools.
  *(Severity P2 SEO / cannibalization.)*
- **#20 — tool pages span 2+ design generations.** Family A (semantic palette + `.section bg-light/white`):
  calorie-burn-accuracy, deep-sleep-factors, fitbit-air-vs-whoop, oura-5-vs-4, oura-ring-comparison,
  rem-sleep, vo2max-accuracy, vo2max-factors, sleep-tracker-accuracy, heart-rate-accuracy,
  step-count-accuracy. Family B (canonical palette
  `--green/--dark/--gray-*`, `.container` sections, no bg-light/white): hrv-factors, recovery-scores,
  rhr-factors, sensor-comparison, sleep-latency-factors, sleep-metrics, staying-asleep-factors,
  supplements-by-metric, wearable-stress, wearable-accuracy. `calories-in-anything`
  is a third, separate pattern. Relevant to any cross-page UI (see the related-tools rollout).
  *(Severity P3 / architectural note.)*
