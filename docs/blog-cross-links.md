# Blog cross-links — the related-reading registry

> The canonical copy for the **standard related-reading module** (`_relatedPosts()` +
> `_renderRelatedPosts(bg)`) that every tool page carries. Card copy is defined **once per
> post here** and reused wherever that post is linked, so it cannot drift between tools.
>
> Placement, styling and the module contract live in `docs/tool-page-playbook.md` §3
> ("Related reading (the standard module)"). Tracking lives in `docs/schemas-and-tracking.md`.

## Where the data comes from

Titles, excerpts, read times, categories and **cover images are the real values from the Wix
Blog collection** (`Blog/Posts`), read via the Blog REST API:

```
GET https://www.wixapis.com/blog/v3/posts?paging.limit=15&paging.offset=<n>&fieldsets=URL
GET https://www.wixapis.com/blog/v3/categories
```

Cover image = `post.media.wixMedia.image.id`, rendered as
`https://static.wixstatic.com/media/<id>` — the same asset the blog index shows for that post,
so a tool card and the blog card never disagree.

**Blurbs are hand-written**, not the raw Wix excerpt: the card clamps to two lines, and several
Wix excerpts are 250+ characters (or are the opening paragraph rather than a summary). Keep new
blurbs to ~110–150 characters, in the house voice, with no em dashes.

**Re-pull before a copy pass.** Post titles get edited in Wix without anyone touching this repo,
and a stale title on a card is worse than no card. Re-run the two calls above and diff against
this table.

## Card fields

| Field | Source | Notes |
|---|---|---|
| `slug` | `post.slug` | The card's href is `https://www.kygo.app/post/<slug>` — no `target`, same tab (internal link) |
| `title` | `post.title` | Verbatim from Wix. Clamps to 3 lines |
| `blurb` | hand-written | ~110–150 chars, clamps to 2 lines |
| `cat` | category `label` | Wearables & Data · HRV & Recovery · Sleep · Nutrition · App Updates |
| `min` | `post.minutesToRead` | Rendered as "N min read" |
| `img` | `post.media.wixMedia.image.id` | Just the id; the module prefixes the media host |

## Which tool links to which posts

Three cards per page. Rule: **the page's own companion post first** (the primary spoke), then a
**near neighbour** in the same topic family, then a **bridge** to another family — so no page
shows three near-duplicates. "In" is how many tool pages link that post under the current map.

| Page | Component | Links out to (in order) |
|---|---|---|
| `/tools/accuracy-factors` | `kygo-accuracy-factors.js` | `what-s-the-most-accurate-wearable-data-…`, `heart-rate-accuracy-by-activity-type`, `step-count-accuracy-factors` |
| `/tools/calorie-burn-accuracy` | `kygo-calorie-burn-accuracy.js` | `how-accurate-is-your-wearable-calorie-burn`, `how-accurate-is-apple-watch-calorie-burn`, `how-accurate-is-fitbit-calorie-burn` |
| `/tools/deep-sleep-factors` | `kygo-deep-sleep-factors.js` | `how-to-increase-deep-sleep-factors-ranked`, `what-influences-rem-sleep-factors-ranked`, `why-is-my-sleep-score-low-when-i-slept-8-hours` |
| `/tools/fitbit-air-vs-whoop-comparison` | `kygo-fitbit-air-vs-whoop.js` | `fitbit-air-vs-whoop-which-screenless-tracker-is-worth-it`, `does-the-fitbit-air-measure-blood-pressure`, `whoop-stress-score-recovery-explained` |
| `/tools/heart-rate-accuracy` | `kygo-heart-rate-accuracy.js` | `how-accurate-is-your-heart-rate-monitor`, `heart-rate-accuracy-by-activity-type`, `why-is-my-resting-heart-rate-suddenly-higher-…` |
| `/tools/hrv-factors` | `kygo-hrv-factors.js` | `how-to-improve-hrv-factors-ranked-by-evidence`, `why-is-my-hrv-always-low`, `why-does-alcohol-crush-your-hrv-…` |
| `/tools/oura-ring-5-vs-4` | `kygo-oura-5-vs-4.js` | `is-the-oura-ring-5-worth-it`, `oura-ring-5-vs-ring-4-is-the-upgrade-worth-it-evidence-based`, `oura-ring-stress-tracking-explained` |
| `/tools/oura-ring-comparison-tool` | `kygo-oura-ring-comparison.js` | `oura-ring-5-vs-ring-4-is-the-upgrade-worth-it-evidence-based`, `is-the-oura-ring-5-worth-it`, `oura-ring-food-tracking-complete-guide` |
| `/tools/oura-vs-ringconn` | `kygo-oura-vs-ringconn.js` | `is-the-oura-ring-5-worth-it`, `oura-ring-5-vs-ring-4-is-the-upgrade-worth-it-evidence-based`, `what-s-the-most-accurate-wearable-data-…` |
| `/tools/recovery-score-explorer` | `kygo-recovery-scores.js` | `what-lowers-recovery-score`, `recovery-scores-compared-whoop-oura-garmin`, `can-you-trust-your-recovery-score` |
| `/tools/rem-sleep-factors` | `kygo-rem-sleep.js` | `what-influences-rem-sleep-factors-ranked`, `how-to-increase-deep-sleep-factors-ranked`, `which-foods-affect-your-sleep-and-hrv` |
| `/tools/resting-heart-rate-factors` | `kygo-rhr-factors.js` | `resting-heart-rate-factors`, `why-is-my-resting-heart-rate-suddenly-higher-…`, `how-to-improve-hrv-factors-ranked-by-evidence` |
| `/tools/sensor-comparison` | `kygo-sensor-comparison.js` | `wearable-hardware-vs-software-differences-2025`, `what-s-the-most-accurate-wearable-data-…`, `centralize-health-data-multiple-devices` |
| `/tools/sleep-latency-factors` | `kygo-sleep-latency-factors.js` | `how-to-fall-asleep-faster-factors-ranked-by-evidence`, `caffeine-sleep-correlation-personal-cutoff-time`, `how-to-stay-asleep-factors-ranked-by-evidence` |
| `/tools/sleep-metrics` | `kygo-sleep-metrics.js` | `every-sleep-metric-your-wearable-tracks-…`, `most-accurate-sleep-tracker-oura-vs-apple-vs-fitbit-2026`, `why-is-my-sleep-score-low-when-i-slept-8-hours` |
| `/tools/sleep-tracker-accuracy` | `kygo-sleep-tracker-accuracy.js` | `most-accurate-sleep-tracker-oura-vs-apple-vs-fitbit-2026`, `every-sleep-metric-your-wearable-tracks-…`, `why-is-my-sleep-score-low-when-i-slept-8-hours` |
| `/tools/staying-asleep-factors` | `kygo-staying-asleep-factors.js` | `how-to-stay-asleep-factors-ranked-by-evidence`, `how-to-fall-asleep-faster-factors-ranked-by-evidence`, `which-foods-affect-your-sleep-and-hrv` |
| `/tools/step-count-accuracy` | `kygo-step-count-accuracy.js` | `which-wearable-has-the-most-accurate-step-count-…`, `step-count-accuracy-factors`, `what-s-the-most-accurate-wearable-data-…` |
| `/tools/stress-factors` | `kygo-wearable-stress.js` | `how-wearables-measure-stress-comparison`, `oura-ring-stress-tracking-explained`, `whoop-stress-score-recovery-explained` |
| `/tools/supplements-by-metric` | `kygo-supplements-by-metric.js` | `supplements-for-wearable-metrics-what-works-what-s-hype`, `how-to-improve-hrv-factors-ranked-by-evidence`, `how-to-increase-deep-sleep-factors-ranked` |
| `/tools/vo2-max-accuracy` | `kygo-vo2max-accuracy.js` | `most-accurate-vo2-max-wearable`, `whoop-vo2-max-accuracy-why-yours-looks-wrong`, `fitbit-air-vo2-max-why-it-says-not-tracked` |
| `/tools/vo2-max-factors` | `kygo-vo2max-factors.js` | `what-affects-vo2-max`, `most-accurate-vo2-max-wearable`, `how-to-improve-hrv-factors-ranked-by-evidence` |
| `/tools/wearable-accuracy` | `kygo-wearable-accuracy.js` | `what-s-the-most-accurate-wearable-data-…`, `how-accurate-is-your-heart-rate-monitor`, `most-accurate-sleep-tracker-oura-vs-apple-vs-fitbit-2026` |

### Inbound counts (posts linked from 2+ tools)

| Post | In |
|---|---|
| `what-s-the-most-accurate-wearable-data-…` | 5 |
| `how-to-improve-hrv-factors-ranked-by-evidence` | 4 |
| `how-to-increase-deep-sleep-factors-ranked` | 3 |
| `why-is-my-sleep-score-low-when-i-slept-8-hours` | 3 |
| `is-the-oura-ring-5-worth-it` | 3 |
| `oura-ring-5-vs-ring-4-is-the-upgrade-worth-it-evidence-based` | 3 |
| `most-accurate-sleep-tracker-oura-vs-apple-vs-fitbit-2026` | 3 |
| `heart-rate-accuracy-by-activity-type` · `step-count-accuracy-factors` · `what-influences-rem-sleep-factors-ranked` · `whoop-stress-score-recovery-explained` · `how-accurate-is-your-heart-rate-monitor` · `why-is-my-resting-heart-rate-suddenly-higher-…` · `oura-ring-stress-tracking-explained` · `which-foods-affect-your-sleep-and-hrv` · `how-to-fall-asleep-faster-factors-ranked-by-evidence` · `how-to-stay-asleep-factors-ranked-by-evidence` · `every-sleep-metric-your-wearable-tracks-…` · `most-accurate-vo2-max-wearable` | 2 |

The other 21 linked posts have 1 inbound tool link. **40 of the 56 published posts are linked
from at least one tool page**; the remaining 16 (app updates, the founder essays, most of the
food-logging posts) have no matching tool and are deliberately not linked.

Regenerate the counts after any retarget by grepping every `_relatedPosts()` block for its
`slug:` values and tallying them — e.g. a short Python script over `kygo-*.js` that pulls
`slug: '<value>'` out of each `_relatedPosts()` return array into a `collections.Counter`.

## Post catalog (56 published, newest first)

Cover-image ids are the `273a63_…~mv2.png` suffix of
`https://static.wixstatic.com/media/`. `min` = `minutesToRead`.

| Slug | Title | Category | min | Cover image id |
|---|---|---|---|---|
| `can-the-oura-ring-track-food-and-calories` | Can the Oura Ring Track Food and Calories? | Nutrition | 11 | `273a63_ced164386c25467cb01de494e6ac4f8c~mv2.png` |
| `whoop-vo2-max-accuracy-why-yours-looks-wrong` | WHOOP VO2 Max Accuracy: Why Yours Looks Wrong | Wearables & Data | 11 | `273a63_3cf17ba07c50468e8c46362eda06d2d4~mv2.png` |
| `why-is-my-hrv-always-low` | Why Is My HRV Always Low? | HRV & Recovery | 11 | `273a63_7dd707ddec3f46dfafcd5ce04581407c~mv2.png` |
| `fitbit-air-vo2-max-why-it-says-not-tracked` | Fitbit Air VO2 Max: Why It Says Not Tracked (2026) | HRV & Recovery | 11 | `273a63_c8f2fa66cfb44083b46b53878dabad9f~mv2.png` |
| `does-the-fitbit-air-measure-blood-pressure` | Does the Fitbit Air Measure Blood Pressure? (2026) | Wearables & Data | 11 | `273a63_488943e9d9c946459e0c2f58d680ffa9~mv2.png` |
| `heart-rate-accuracy-by-activity-type` | Heart Rate Accuracy by Activity Type: What Breaks Your Watch | HRV & Recovery | 13 | `273a63_9cf51f2ccc2b492fb52f1e15958fe3e1~mv2.png` |
| `how-accurate-is-your-heart-rate-monitor` | How Accurate Is Your Heart Rate Monitor? 10 Devices Ranked | Wearables & Data | 12 | `273a63_0160a65e547b4b539b2b8be66e2749cf~mv2.png` |
| `is-the-oura-ring-5-worth-it` | Is the Oura Ring 5 Worth It? What Changed and What Didn't | Wearables & Data | 7 | `273a63_5b1f7436802f4db3896917ad31e36cf3~mv2.png` |
| `free-health-wearable-tools` | 23 Free Health & Wearable Tools From Kygo (No Signup) | Wearables & Data | 4 | `273a63_b5d93735644b40d8bf6a47f5e8e5aff5~mv2.png` |
| `what-is-kygo-health-app-features-pricing` | What Is Kygo Health? The App That Links Food to Sleep & HRV | App Updates | 6 | `273a63_817afd636ca34cd6bfae13650a742362~mv2.png` |
| `most-accurate-sleep-tracker-oura-vs-apple-vs-fitbit-2026` | Most Accurate Sleep Tracker? Oura vs Apple vs Fitbit vs Garmin vs Whoop (2026) | Sleep | 8 | `273a63_4c319b0df429425296d15711c577310b~mv2.png` |
| `how-accurate-is-fitbit-calorie-burn` | How Accurate Is Fitbit Calorie Burn? (2026 Research) | Wearables & Data | 7 | `273a63_c3cc27e698454947bdd11932bbe17b1a~mv2.png` |
| `how-accurate-is-apple-watch-calorie-burn` | How Accurate Is Apple Watch Calorie Burn? (2026 Research) | Wearables & Data | 8 | `273a63_4f7696792b1b4dffa57aeb8ff91ab62f~mv2.png` |
| `how-accurate-is-garmin-calorie-burn` | How Accurate Is Garmin Calorie Burn? (2026 Research) | Wearables & Data | 7 | `273a63_1e22b34273da40ceb7269ac33e1e5ced~mv2.png` |
| `what-influences-rem-sleep-factors-ranked` | What Influences REM Sleep? Factors Ranked by Evidence (2026) | Sleep | 10 | `273a63_be7638af00034117a0366d56b59127ae~mv2.png` |
| `supplements-for-wearable-metrics-what-works-what-s-hype` | Supplements for Wearable Metrics: What Works, What's Hype | Nutrition | 10 | `273a63_1867fe44ffbf4d6ba4fd157f0e218ed9~mv2.png` |
| `recovery-scores-compared-whoop-oura-garmin` | Recovery Score Comparison: WHOOP vs Oura vs Garmin 2026 | Wearables & Data | 7 | `273a63_df4fa2af9cd146dd8aabc609c815210a~mv2.png` |
| `can-you-trust-your-recovery-score` | Can You Trust Your Recovery Score? What the Science Says | HRV & Recovery | 7 | `273a63_9588721f1d69413c8910bbcbe7cd12b4~mv2.png` |
| `what-lowers-recovery-score` | Recovery Score Low? The Food & Drink Causes Most People Miss | Nutrition | 8 | `273a63_1aabeb9f974c47e984894fadbe79fa16~mv2.png` |
| `most-accurate-vo2-max-wearable` | Most Accurate VO2 Max Wearable: Garmin, Apple, WHOOP & Oura Ranked | Wearables & Data | 8 | `273a63_b02ace65027c415981d32f4dd06782be~mv2.png` |
| `what-affects-vo2-max` | What Affects VO2 Max? The Levers That Work (and the Ones That Waste Your Time) | Wearables & Data | 9 | `273a63_611237219cac459ab4418aad328c5d5b~mv2.png` |
| `which-foods-affect-your-sleep-and-hrv` | Which Foods Affect Your Sleep & HRV? How to Find Out | App Updates | 7 | `273a63_817afd636ca34cd6bfae13650a742362~mv2.png` |
| `oura-ring-5-vs-ring-4-is-the-upgrade-worth-it-evidence-based` | Oura Ring 5 vs Ring 4: Is the Upgrade Worth It? (Evidence-Based) | Wearables & Data | 8 | `273a63_4ee944408ac042769fe13efe8021eb63~mv2.png` |
| `pixel-watch-fitbit-stress-tracking-explained` | Google Pixel Watch & Fitbit Stress Tracking: How cEDA and Body Response Actually Work (2026) | HRV & Recovery | 9 | `273a63_1e4512833f8443ca84dde67e17ed7a27~mv2.png` |
| `whoop-stress-score-recovery-explained` | WHOOP Stress Score and Recovery: What 5 Sensors Actually Measure (2026) | HRV & Recovery | 8 | `273a63_4b600cc3354e4e9b8154215eb4aad3fb~mv2.png` |
| `apple-watch-stress-tracking-explained` | Apple Watch Stress Tracking: How to Read the Data You Already Have (2026) | HRV & Recovery | 10 | `273a63_9b929d341cd14192a897827304c3c5d4~mv2.png` |
| `oura-ring-stress-tracking-explained` | Oura Ring Stress Tracking: How 3 Layers of Stress Data Actually Work (2026) | HRV & Recovery | 8 | `273a63_10d7664086de4f1d8f3991f5ce7a60c5~mv2.png` |
| `fitbit-air-vs-whoop-which-screenless-tracker-is-worth-it` | Fitbit Air vs WHOOP: Which Screenless Tracker Is Actually Worth It? (2026) | Wearables & Data | 12 | `273a63_3377c7490d01499ea7f8a47dffb5835a~mv2.png` |
| `how-wearables-measure-stress-comparison` | Wearable Stress Scores Compared: Garmin vs WHOOP vs Oura vs Samsung vs Apple Watch (2026) | HRV & Recovery | 10 | `273a63_b5d93735644b40d8bf6a47f5e8e5aff5~mv2.png` |
| `resting-heart-rate-factors` | Resting Heart Rate Too High? 37 Factors Backed by Research (Most Are Fixable) | HRV & Recovery | 9 | `273a63_d62672eff81a4208843d39b88102e8e9~mv2.png` |
| `how-to-stay-asleep-factors-ranked-by-evidence` | How to Stay Asleep All Night: 31 Factors Ranked by Evidence (2026) | Sleep | 8 | `273a63_1b328da6e96d4110a7de9403036dfac5~mv2.png` |
| `whats-new-at-kygo-apple-health-overhaul-smarter-correlations-and-growth-update` | What's New at Kygo: Apple Health Overhaul, Smarter Correlations, and Growth Update | App Updates | 4 | `273a63_d0b94a6b9cb54aff93a61cb4f2229b21~mv2.png` |
| `how-to-fall-asleep-faster-factors-ranked-by-evidence` | How to Fall Asleep Faster: 33 Factors Ranked by Evidence (2026) | Sleep | 10 | `273a63_301e6ab1c01a477aad452b8ae4373b98~mv2.png` |
| `long-overdue-update-a-lot-has-happened-at-kygo-health` | Long Overdue Update: A Lot Has Happened at Kygo Health | App Updates | 4 | `273a63_d0b94a6b9cb54aff93a61cb4f2229b21~mv2.png` |
| `how-accurate-is-your-wearable-calorie-burn` | How Accurate Is Your Wearable's Calorie Burn? 5 Devices Compared by Research | Wearables & Data | 10 | `273a63_c9770cd7f57b4c3596d0eb6ff616660b~mv2.png` |
| `how-to-increase-deep-sleep-factors-ranked` | How to Increase Deep Sleep: 38 Factors Backed by Data | Sleep | 11 | `273a63_5a16c04aa1b9489da2cc42da679e913a~mv2.png` |
| `wearable-hardware-vs-software-differences-2025` | Garmin vs WHOOP vs Oura vs Apple Watch vs Fitbit: Hardware & Software Differences Explained (2026) | Wearables & Data | 8 | `273a63_e3b6fec04fa9434e89320a3dba67b9c8~mv2.png` |
| `how-to-improve-hrv-factors-ranked-by-evidence` | How to Improve HRV: 44 Factors Ranked by Evidence (2026) | HRV & Recovery | 12 | `273a63_81b206b8ae5e45b69e091fcb7e65b870~mv2.png` |
| `every-sleep-metric-your-wearable-tracks-oura-apple-watch-fitbit-garmin` | Every Sleep Metric Your Wearable Tracks: Oura vs Apple Watch vs Fitbit vs Garmin Compared | Sleep | 9 | `273a63_9746eb6e86f740c8bba2779fcce40365~mv2.png` |
| `step-count-accuracy-factors` | What Actually Affects Your Wearable's Step Count Accuracy, Ranked by Impact | Wearables & Data | 7 | `273a63_555e30a7fca44d14bf995a7e320a93dd~mv2.png` |
| `which-wearable-has-the-most-accurate-step-count-a-2024-2025-research-analysis` | Which Wearable Has the Most Accurate Step Count? A 2024-2025 Research Analysis | Wearables & Data | 8 | `273a63_274f98119a1547799ecdfd849e893e4f~mv2.png` |
| `why-is-my-sleep-score-low-when-i-slept-8-hours` | Why Is My Sleep Score Low When I Slept 8 Hours? | Sleep | 8 | `273a63_0a9880d341f34b9ea66d1df4c2164bd2~mv2.png` |
| `why-does-alcohol-crush-your-hrv-and-how-long-until-it-recovers` | Why Does Alcohol Crush Your HRV (and How Long Until It Recovers) | HRV & Recovery | 7 | `273a63_75bbbcbb2f82425abf95dfec3ba7fa19~mv2.png` |
| `why-is-my-resting-heart-rate-suddenly-higher-a-data-driven-breakdown` | Why Is My Resting Heart Rate Suddenly Higher? A Data-Driven Breakdown | HRV & Recovery | 7 | `273a63_03df52034a544018aef1e44af7e6afa7~mv2.png` |
| `kygo-is-live-on-the-app-store` | Kygo Is Live on the App Store | App Updates | 2 | `273a63_817afd636ca34cd6bfae13650a742362~mv2.png` |
| `what-s-the-most-accurate-wearable-data-a-2024-2025-study-breakdown-by-device` | What's the Most Accurate Wearable? 17 Studies, 6 Devices, Ranked (2026) | Wearables & Data | 10 | `273a63_f6d12b66837342a6a552e4e3d9297fef~mv2.png` |
| `why-did-my-hrv-drop-12-common-causes-and-what-your-food-log-reveals` | Why Did My HRV Drop? 12 Common Causes and What Your Food Log Reveals | HRV & Recovery | 18 | `273a63_f284deaad62f49aa84be4a1ee6f5cb8d~mv2.png` |
| `centralize-health-data-multiple-devices` | Centralize Health Data From Multiple Devices: The Complete Guide | Wearables & Data | 9 | `273a63_2889c7cc0ed1471da8daf7f79182cd6b~mv2.png` |
| `oura-ring-food-tracking-complete-guide` | Oura Meals and Food Tracking: How to Combine Them (2026 Guide) | Nutrition | 8 | `273a63_59d966f3eb8a430cb8f444d92f4078e9~mv2.png` |
| `caffeine-sleep-correlation-personal-cutoff-time` | Caffeine and Sleep: Finding Your Personal Cutoff Time | Sleep | 11 | `273a63_ce85cf859543430dbf4604fed94bedbe~mv2.png` |
| `kygo-beta-opens-to-all-users-apple-health-integration-now-live` | Kygo Beta Opens to All Users: Apple Health Integration Now Live | App Updates | 7 | `273a63_817afd636ca34cd6bfae13650a742362~mv2.png` |
| `phase-1-beta-is-live-and-we-re-almost-ready-for-you` | Phase 1 Kygo Beta Is Live, and We're Almost Ready for You | App Updates | 4 | `273a63_817afd636ca34cd6bfae13650a742362~mv2.png` |
| `update-november-3-2025-rebuilt-food-logging-from-the-ground-up-and-made-it-free` | Update: Rebuilt Food Logging From the Ground Up (and Made It Free) | App Updates | 4 | `273a63_817afd636ca34cd6bfae13650a742362~mv2.png` |
| `oura-ring-nutrition-tracking-connect-food-to-sleep` | Oura Ring Nutrition Tracking: Connect Food to Sleep Quality | Wearables & Data | 11 | `273a63_849cdff81eee41d68b4f3603127ef654~mv2.png` |
| `why-80-of-people-quit-food-logging-apps-and-how-to-actually-stick-with-it` | Why 80% of People Quit Food Logging Apps (and How to Stick With It) | Nutrition | 7 | `273a63_b1dc798915304644a6f4e99b2901dd1e~mv2.png` |
| `why-i-built-kygo-health-app` | Why I Built the Kygo Health App: Connecting What You Eat to How You Feel | App Updates | 4 | `273a63_817afd636ca34cd6bfae13650a742362~mv2.png` |

## Notes on the source data

Worth a look next time you're in the Wix editor — none of these block anything:

- **Two posts share the "mainstress" cover** (`b5d93735…`): `free-health-wearable-tools` and
  `how-wearables-measure-stress-comparison`. So do all four App Updates posts and
  `which-foods-affect-your-sleep-and-hrv` (the Kygo logo image). Cards for those look identical.
- **`how-wearables-measure-stress-comparison`'s Wix excerpt starts "very wearable claims…"** — a
  dropped capital E. The card blurb here is written fresh, so the tool pages are unaffected, but
  the blog index shows the typo.
- **Titles drift from the tool copy.** Several tool pages previously advertised paraphrased titles
  (`How 10 Brands Actually Measure Stress`, `Resting Heart Rate Factors: 37 Inputs Ranked by
  Evidence`) that no post ever carried. Cards now use the Wix title verbatim.
- **`how-to-stay-asleep-…`** is titled "31 Factors" while its own excerpt says 27 and the tool says
  27. One of the three is wrong; the card follows the title.
