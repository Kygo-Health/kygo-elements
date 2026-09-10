# Fixes & Issues — Consolidated Backlog

> Severity-ranked backlog of bugs/inconsistencies across the repo, with file:line + suggested fix.
> **Status reflects live browser QA (2026-06) — see the Status column.** Deploy model: a commit to
> a tracked branch ships via CDN, so verify before pushing.
>
> Severity: **P1** = visibly broken in prod · **P2** = broken/meaningful · **P3** = polish ·
> **Closed** = QA confirmed fine / not a bug · **Needs input** = blocked on you.

## 🆕 Calorie figure correction pass, branch `claude/serene-tesla-mawip8` (2026-09-10)

Closes **OPEN-ITEMS K1** for `/tools/calorie-burn-accuracy` and for the Calorie / Energy metric of
`/tools/wearable-accuracy`. Basis: doc 05 strike table, re-verified against primary sources
2026-09-10 (Change-Log row 63). Component structure, calculator UI, pickers, factor cards,
affiliate blocks and the source accordion pattern are unchanged.

**`kygo-calorie-burn-accuracy.js`**

- **#K1a (P1) — ✅ RESOLVED. Two cells were brand substitutions.** Apple/Strength 53% is the
  **Polar A360** (Boudreaux 2018, n=50); the JSAMS 2023 Apple Watch 6 study (n=11) has no
  resistance protocol at all, so Apple resistance is now marked never-tested. Garmin/Steady 6.7% is
  a **PulseOn** (Parak 2017, two authors PulseOn employees, and Stanford ranked PulseOn worst of
  seven at 92.6%); no Garmin was in that study, so the cell is now an unmeasured estimate and the
  Garmin headline is de Leon 2026's 19.1% treadmill (Vivoactive 4, n=18, unfunded).
- **#K1b (P1) — ✅ RESOLVED. Three point estimates were invented midpoints.** Apple/Swim 45% and
  Garmin/Swim 25% do not appear in the 2018 source, which publishes 17 to 152% and 17.9 to 32.7%
  respectively. Cells now carry `mape: null` with the published range; the calculator shows the
  range instead of a fabricated best estimate, and refuses to build a kcal band where the range
  exceeds 100%.
- **#K1c (P1) — ✅ RESOLVED. Fitbit walking/running came from a TV segment.** 53.5% and 4.3% trace
  to a BBC One Wales *X-Ray* segment. Replaced with O'Driscoll 2020, Health and Technology
  10(3):637-648 (n=59, Vyntus CPX): walking **69%**, running **12 to 15%**. The 2026-07-30 flag
  claiming 69% might be household tasks is withdrawn. Fitbit/Strength added as near zero
  (Lee 2026, Sensors 26(8):2526, n=62).
- **#K1d (P2) — ✅ RESOLVED. WHOOP figures kept but labelled.** Per Ryan's 2026-09-10 call the
  numbers stay. Steady 12%, HIIT 13% and Resistance 29% now carry the same unsourced marker the
  18.4% figure already had, with one shared footnote. "No **locatable** primary publication" is
  upgraded to "no primary publication has been located". The "WHOOP is transparent about not
  measuring absolute calories" framing is removed and must not return: their support page
  (updated 2025-05-09) now claims it "prioritizes accuracy over overestimation".
- **#K1e (P2) — ✅ RESOLVED. Oura per-activity cells relabelled.** 24% / 19% are a calculated
  **floor** (mean MET underestimation over activity reference MET), not MAPEs, and are marked
  `c` with a footnote saying the true error is higher. First author corrected to
  **Andersson-Hall**; the 13% headline now names its comparator (a wrist accelerometer) and the
  card carries hip 42.2% / thigh 44.7% and the ~850 kcal/day disagreement between placements.
- **#K1f (P2) — ✅ RESOLVED. The Sex factor card cited a claim its source does not contain.**
  Choe & Kang's moderators are age, health status, device series, activity intensity and activity
  type; sex is not among them. Replaced with Shcherbina 2017's genuine **heart-rate** sex finding.
- **#K1g (P2) — ✅ RESOLVED. FAQ 8 leaderboarded three incomparable criteria.** Rewritten around
  Fuller 2020 (no brand within 3% of criterion more than 13% of the time) and Shcherbina's
  counterintuitive result that error is worst at rest (52.4%) and best walking (31.8%) and
  running (31.0%). FAQ 7 and 5 rewritten to match. **The live FAQ JSON-LD lives in the Wix SEO
  panel, not Custom Code — it must be updated there too or the schema keeps serving struck
  figures to AI search.**
- **#K1h (P3) — ✅ RESOLVED.** Source accordion corrected and expanded 22 → 25: Huawei funding
  disclosed on Le 2022, JSAMS 2023 relabelled as a running study with its inverted MAPE
  convention flagged, IJERPH 2019 re-cited to Boudreaux 2018 (PMID 29189666), Fuller 2020 scoped
  to lab only with its Garmin-employed author disclosed, MDPI Applied Sciences year corrected
  2025 → 2026, Parak 2017 moved out of the Garmin group. Added O'Driscoll 2020, Chowdhury 2017
  and Lee 2026. Em dashes removed from user-visible strings; every figure now names its device
  model and sample size.

**`kygo-wearable-accuracy.js` (Calorie / Energy metric only)**

- **#K1i (P1) — ✅ RESOLVED. The metric broke its own inclusion rule.** `unitExplainer` promised
  "only devices with a daily-level study get a bar", but neither bar qualified: Oura's 13% is vs
  Axivity AX3 accelerometers and Apple's 28% is press-release sourced and bout-level per-minute.
  Both bars removed; all six devices now carry notes with the reference method named.
- **#K1j (P1) — ✅ RESOLVED.** The insight string's "Oura's 13% daily beats Apple's 28% pooled"
  clause was exactly the cross-criteria ranking the library forbids. Deleted, replaced with the
  Shcherbina at-rest finding and the Fuller 2020 cross-brand sentence.
- **#K1k (P3) — ✅ RESOLVED.** Study key `kristiansson2023` → `anderssonhall2023` and display
  strings relabelled (steps figures untouched); the Parak note now states that no Garmin device
  was tested at all.

**Still open after this pass:** the Wix-side title tag, meta and FAQ JSON-LD; a Change-Log row; and
OPEN-ITEMS K1 for the calorie blog post. D8's handoff
(`06-Wearable-Accuracy/Tool change list - wearable-accuracy (2026-09-09).md`) is stale on calories
and is superseded by this pass.

## 🆕 `/tools` index regrouping on branch `claude/busy-bardeen-n6idlp` (2026-09-09)

All resolved in `kygo-tools.js` on this branch. Tool slugs, tool URLs, the Featured Tool slot and
`kygo-tracking.js` event names are unchanged.

- **#T1 (P1) — ✅ RESOLVED. Tool cards were not links.** All 24 grid cards and the featured card
  rendered as `<div role="button" tabindex="0">` with a JS click handler, so the whole shadow root
  contained 5 `<a>` elements (1 homepage + 4 Tenjin store links). No card could be cmd-clicked,
  middle-clicked, opened in a new tab, copied as a link or hovered for a URL preview, and `/tools`
  passed no link equity to any tool page. Cards and the featured card are now real
  `<a href="/tools/{slug}">` (25 anchors) with the browser owning navigation; the click handler is
  kept as the tracking hook and as a fallback for a non-anchor element still carrying
  `data-open-tool`. `role="button"`/`tabindex` removed (anchors are natively focusable) and a
  `:focus-visible` ring added.

- **#T2 (P1) — ✅ RESOLVED (paired with #T1). Shadow-DOM anchors are still invisible to crawlers.**
  Same fix as `/blog` #C5: `_renderSeo()` replaces the flat `__seo()` string with a light-DOM
  `[data-seo]` block containing a summary plus all 25 tool links as plain `<a>` under the six
  category headings. It is re-rendered when the `tools` attribute changes. The now-unused `__seo`
  shim was removed from the top of the file.

- **#T3 (P2) — ✅ RESOLVED. There was an "Other" bucket with 4 tools in it.** Three device
  comparisons (Oura 5 vs 4 vs 3, Oura 5 vs 4, Fitbit Air vs WHOOP) and the Stress Factor Explorer
  had no mapping, and "Wearables" held 9 of 24 as a catch-all. Regrouped into six categories —
  Sleep (6), Heart Rate & HRV (3), Stress & Recovery (2), Activity & Fitness (3), Calories &
  Nutrition (3), Devices & Buying Guides (8) = 25. Five of the six names match the new `/blog`
  categories verbatim; the blog's "Calories & Energy Burn" + "Nutrition & Food Logging" are merged
  because splitting them here would leave a one-tool group, and "Kygo Product & Updates" has no
  tools. `other` survives only as an unreachable safety net.

- **#T4 (P3) — ✅ RESOLVED (structural).** Category assignment was split across a slug→id map, a
  separate `_categoryMeta` map, a hardcoded `preferredOrder` array and duplicate inline `category:`
  fields on 9 tools — four places to keep in sync, and one map entry (`accuracy-factors`) had been
  pasted a motif object instead of a category id. All four collapse into one `_categories()` list
  that owns section order, slug→category and the display order **inside** each section; the 9
  redundant inline `category:` fields are gone (the `tool.category` override still works for a
  Wix-supplied `tools` attribute). `docs/tool-page-playbook.md` §6 updated.

- **#T5 (P3) — ✅ RESOLVED. Stale "17+ peer-reviewed studies" for `wearable-accuracy`,** in both
  `_defaultTools()` and the featured card's stat strip. Now `30+`, matching the rewritten post.

- **#T6 (open, P3) — no filter or search on `/tools`.** Not a defect at 25 items (stacked sections
  only), but `/blog`'s new search box is the pattern to reuse if the count keeps growing. Not added
  here: it would be the third thing changing on the page in one commit.

- **Checked, not applicable: the `/blog` chip bug.** `/tools` has no filter chips, so nothing was
  copied. For the record, `kygo-blog.js` `_bindEvents()` *is* re-run at the end of every `render()`
  and the `.category-tab` selector matches the rendered markup, so a stale-binding cause looks ruled
  out — if the chips are genuinely dead the cause is likely CSS/overlay on the sticky row. Not
  investigated further; out of scope for this branch.

## 🆕 `/blog` index rebuild on branch `claude/kind-newton-3xzpxt` (2026-09-09)

All resolved in `kygo-blog.js` on this branch.

- **#C1 (P1) — ✅ RESOLVED. 20 posts were missing from `/blog`.** The component built its
  sections by iterating `CATEGORY_CONFIG`, which still held the pre-restructure five categories,
  so any post whose `categorySlug` was not in that array was dropped with no section, no card and
  no error — `stress-recovery` (8), `calories-energy-burn` (6) and `activity-fitness` (6),
  including the whole calorie-accuracy cluster. `CATEGORY_CONFIG` now carries all eight
  categories (old labels kept in `aliases`), **and the grouping now iterates the post data**:
  `_buildCategoryIndex()` gives any unconfigured category its own chip and section headed by the
  raw `category` string, plus a one-time `console.warn`. A category added in Wix can no longer
  make posts disappear silently. Individual `/post/...` URLs were never affected.

- **#C2 (P2) — ✅ RESOLVED. Post cards were not links.** Every card was an `<article>` with a JS
  click handler, so the index had no open-in-new-tab, middle-click, cmd-click, copy-link-address,
  hover URL preview or keyboard activation, and no outbound links for crawlers. Cards and the
  featured card are now real `<a href="/post/{slug}">`. A plain left-click still
  `preventDefault()`s and dispatches `postClick` so Wix Velo keeps owning navigation; a modified
  or middle click is left to the browser and still reports the click. `kygo-tracking.js` event
  names are unchanged.

- **#C3 (P3) — ✅ RESOLVED. Long list was hard to navigate.** All posts still render (no
  pagination, no "show more" — 63 cards = 63 internal links on the strongest hub page). Added:
  a client-side search box over titles/excerpts/category, post counts on every chip, a genuinely
  sticky chip row (`nav.category-tabs` computed to `static` before, despite a comment claiming
  otherwise) and sticky per-category headings pinned below it via a JS-measured `--tabs-h`.

- **#C4 (P3) — ✅ RESOLVED. Featured block ate the first viewport.** Hero paddings tightened, the
  desktop featured card shrunk (image `min-height` 380→280, content padding 48→32/36), and the
  chip row moved **above** the hero band so a returning reader can filter without scrolling. At
  1456×900 the chips and the whole featured card now fit the first screen.

- **#C5 (P3) — ✅ RESOLVED (incidental).** Post titles/excerpts were interpolated into the
  template unescaped; added an `esc()` helper and applied it to all interpolated copy and
  attributes. Also added `decoding="async"` to cover images and a light-DOM `<a>` mirror of every
  post link inside the `[data-seo]` block, since shadow-DOM anchors are invisible to many
  crawlers.

- **#C6 (open, P3) — the mid-page `kband` app CTA.** It sits between the featured card and the
  first category section and adds ~263px before the post list at desktop. Not touched (it is a
  conversion surface, not a bug); moving it below the first category section would be the next
  win if `/blog` still feels top-heavy.

## 🆕 Opened on branch `claude/standardize-blog-sections-1wo0ax` (2026-08)

Found while standardising the blog cross-link section across every tool page. **None of these
were introduced by that pass** — all were pre-existing. #B1, #B2 and #B4 have since been fixed
on the same branch; #B3 and #B5 are still open. Ranked.

- **#B1 (P2) — ✅ RESOLVED.** Six tool pages carried a *second* app-download CTA: the standard
  `_renderAppCta()` card **and** a legacy `blog-cta-section` (a dark card with its own iOS/Android
  Tenjin buttons, "Free plan available" line and six "Works with" badges) — the retired `kband`'s
  successor under a different name. All six removed: `kygo-hrv-factors`, `kygo-rhr-factors`,
  `kygo-sensor-comparison`, `kygo-sleep-latency-factors`, `kygo-sleep-metrics` (where the two dark
  cards rendered back to back) and `kygo-staying-asleep-factors`. Every tool page is now
  **exactly one app-download surface**. Band rhythm was re-derived from the rendered DOM
  afterwards — removing a section flips every band below it — and every page alternates again.

- **#B2 (P3) — ✅ RESOLVED.** ~200 lines of dead `.blog-cta*` CSS in `kygo-wearable-accuracy.js`
  with no matching markup, left behind when that page's `kband` was retired, are gone along with
  the CSS from the six removals above (~150 dead rules in total, plus `.blog-cta-section` dropped
  from the shared multi-selector padding rules and the `.highlight` rules that only the removed
  card used).

- **#B3 (P3) — five tool→tool cross-links are dressed as blog cards.** `class="blog-cta"` anchors
  pointing at `/tools/...`, not `/post/...`: `kygo-oura-5-vs-4.js:909`,
  `kygo-oura-ring-comparison.js:829`, `kygo-oura-vs-ringconn.js:845`,
  `kygo-vo2max-accuracy.js:1112`, `kygo-vo2max-factors.js:1077`. Now that the blog section has
  one standard design and related tools has another, a tool link in a blog-card costume is the
  only remaining ambiguous surface. Two of them also still use `target="_blank"` on an internal
  link (vo2max ×2), against the rest of the site. Fix: fold each into that page's
  `_relatedTools()` (its destination is already in the tool registry), or restyle as a keystone
  card. Note the `.blog-cta` name is shared with #B1's legacy app CTA, so grep the href, not the
  class.

- **#B4 (P3) — ✅ RESOLVED.** Band rhythm broke on four pages away from the blog section
  (`rhr-factors`, `sensor-comparison`, `sleep-metrics`, `wearable-accuracy`), mostly in the
  app/email-CTA region. Fixed while re-deriving the bands after the #B1 removals — all 23 tool
  pages now alternate with no two adjacent sections sharing a background. Two traps worth
  remembering, both found by checking the *rendered* DOM rather than the source classes:
  `.picks-section { background:#fff }` was overriding its own `section-bg-gray` utility class on
  `rhr-factors` (later rule, equal specificity), and on that same page the bands live on wrapper
  `<div class="section-bg-*">` elements while `.section-bg-* > section { background: transparent }`
  blanks the section inside — so the band must be set on the wrapper, not the section. The
  original detail, for reference:
  - `kygo-rhr-factors.js` — four grey bands in a row: app CTA (`:1524`, `'gray'`), baseline
    (`:1529`), email CTA (`:1531`, `'gray'`), sortable factors (`:1535`); then myths (`:1538`)
    and picks (`:1541`) are both white.
  - `kygo-sensor-comparison.js` — stats (`:1470`) + app CTA (`:1475`); email CTA (`:1486`) +
    compare (`:1493`); fda (`:1512`) + the #B1 legacy section (`:1520`). Note `.charts-section`
    and `.fda-section` set their background in CSS, so fixing this needs CSS edits, not just a
    class swap.
  - `kygo-sleep-metrics.js` — hero (`:1112`) + matrix (`:1144`) both white; app CTA (`:1156`) +
    the #B1 legacy section (`:1160`) both grey.
  - `kygo-wearable-accuracy.js` — hero (`:1154`) + comparison (`:1194`); app CTA (`:1226`) +
    deep-dives (`:1234`); email CTA (`:1283`) + recommendations (`:1287`).

- **#B5 (P3) — Wix content, not code.** Two blog-side items surfaced when the card copy was
  pulled from the live `Blog/Posts` collection (details in `docs/blog-cross-links.md`):
  the excerpt for `how-wearables-measure-stress-comparison` starts "very wearable claims…"
  (dropped capital E, visible on the blog index), and `how-to-stay-asleep-factors-ranked-by-evidence`
  is titled "31 Factors" while its own excerpt and the matching tool both say 27. Both are fixed
  in the Wix editor, not here.

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
