# Kygo Site URL Index

**Source:** [kygo.app/pages-sitemap.xml](https://www.kygo.app/pages-sitemap.xml) + [blog-posts-sitemap.xml](https://www.kygo.app/blog-posts-sitemap.xml) + [blog-feed.xml](https://www.kygo.app/blog-feed.xml)
**Last Updated:** 2026-07-30 (re-verified live against both sitemaps later the same day)
**Totals:** 9 site pages, 21 tools, 49 published blog posts

This is the canonical list of every live URL on kygo.app. Tool descriptions and what each tool actually does live in `Kygo Tools Directory.md`.

**How to regenerate:** `/pages-sitemap.xml` gives pages + tools (30 entries = 9 pages + 21 tools). `/blog-posts-sitemap.xml` gives all 49 published posts and is COMPLETE. `robots.txt` points at `/sitemap.xml`, which indexes all three child sitemaps.

⚠️ **CORRECTION 2026-07-30, supersedes the previous instruction here.** This file used to say the blog sitemap "lags badly, missing the 14 newest posts" and to take a union with `/blog-feed.xml`. **That was wrong** — an artifact of a truncated fetch. Every post previously marked as missing is in the sitemap. `/blog-feed.xml` carries only the 20 most recent posts, so it is a cross-check, not a required union. When a fetched sitemap looks short, re-fetch and demand an explicit entry count plus the full `<loc>` list before concluding anything is missing. Automated summarisers also miscount `<url>` entries — enumerate, do not ask for a total.

---

## Site Pages (9)

| Page | URL |
|------|-----|
| Home | https://www.kygo.app |
| How It Works | https://www.kygo.app/how-it-works |
| Tools (index) | https://www.kygo.app/tools |
| Blog (index) | https://www.kygo.app/blog |
| FAQ | https://www.kygo.app/faq |
| Contact | https://www.kygo.app/contact |
| Privacy Policy | https://www.kygo.app/privacy-policy |
| Terms & Conditions | https://www.kygo.app/terms-conditions |
| Accessibility Statement | https://www.kygo.app/accessibility-statement |

**Machine-readable endpoints (not pages, not in sitemap):**

| Resource | URL | Status |
|----------|-----|--------|
| llms.txt | https://www.kygo.app/llms.txt | Live (Wix auto-generated; points at the site MCP endpoint) |
| Site MCP endpoint | https://www.kygo.app/_api/mcp | Live |

> ⚠️ `https://www.kygo.app/llms-txt` (the page, hyphenated) now **404s**. It was listed in the previous version of this index. Either it was deleted or the route changed — worth confirming nothing links to it.

---

## Tools (21)

| Tool | URL |
|------|-----|
| Most Accurate Wearable | https://www.kygo.app/tools/wearable-accuracy |
| Sleep Tracker Accuracy | https://www.kygo.app/tools/sleep-tracker-accuracy |
| Calorie Burn Accuracy Calculator | https://www.kygo.app/tools/calorie-burn-accuracy |
| Step Count Accuracy | https://www.kygo.app/tools/step-count-accuracy |
| VO2 Max Accuracy | https://www.kygo.app/tools/vo2-max-accuracy |
| Calories in Anything | https://www.kygo.app/tools/calories-in-anything |
| Supplements by Metric | https://www.kygo.app/tools/supplements-by-metric |
| Hardware & Software Differences | https://www.kygo.app/tools/sensor-comparison |
| Sleep Metrics Comparison | https://www.kygo.app/tools/sleep-metrics |
| Deep Sleep Factor Explorer | https://www.kygo.app/tools/deep-sleep-factors |
| Sleep Latency Factors | https://www.kygo.app/tools/sleep-latency-factors |
| Staying Asleep Factors | https://www.kygo.app/tools/staying-asleep-factors |
| REM Sleep Factors | https://www.kygo.app/tools/rem-sleep-factors |
| HRV Factor Explorer | https://www.kygo.app/tools/hrv-factors |
| Resting Heart Rate Factors | https://www.kygo.app/tools/resting-heart-rate-factors |
| Recovery Score Explorer | https://www.kygo.app/tools/recovery-score-explorer |
| Stress Factor Explorer | https://www.kygo.app/tools/stress-factors |
| VO2 Max Factors | https://www.kygo.app/tools/vo2-max-factors |
| Fitbit Air vs WHOOP Comparison | https://www.kygo.app/tools/fitbit-air-vs-whoop-comparison |
| Oura Ring Comparison Tool | https://www.kygo.app/tools/oura-ring-comparison-tool |
| Oura Ring 5 vs 4 | https://www.kygo.app/tools/oura-ring-5-vs-4 |

> **New since 7/10:** `sleep-tracker-accuracy` (2026-07-13), `oura-ring-5-vs-4` (2026-07-30).
> ⚠️ **CORRECTION 2026-07-30 (later same day).** This line previously read: "The `/tools` index page, its GEO/SEO text block, `llms.txt` and the `free-health-wearable-tools` post all read **21** as of 2026-07-30 and list both new tools." That was not true. Re-checked live:
>
> | Surface | State | Detail |
> |---|---|---|
> | `/pages-sitemap.xml` | ✅ correct | 21 tool URLs, both new ones present |
> | `llms.txt` | ⚠️ partly stale | lists all 21 tool URLs including both new ones, but the directory link text still says "All **20** Free Tools" |
> | `/post/free-health-wearable-tools` | ❌ stale | title, H1 and body all still say **19**; `sleep-tracker-accuracy` and `oura-ring-5-vs-4` are not listed |
> | `/tools` page GEO text block | ❓ unverified | the served HTML gives WebFetch nothing usable (Shadow DOM); needs a browser check |

---

## Blog Posts (49)

Newest first. **All 49 are present in `/blog-posts-sitemap.xml`** — verified 2026-07-30 by enumerating every `<loc>`. The stale † "missing from the sitemap" markers have been stripped; that claim was always false.

⚠️ **Two Oura Ring 5 posts are now live at once.** `/post/is-the-oura-ring-5-worth-it` published 2026-07-30, and `/post/oura-ring-5-vs-ring-4-is-the-upgrade-worth-it-evidence-based` is still serving a full post (title "Oura Ring 5 vs 4: Is the Upgrade Worth It? (2026)"). The earlier note in this file that the older URL was 301'd into `/tools/oura-ring-5-vs-4` **does not hold** — checked 2026-07-30, it returns the post, not the tool. Three surfaces now target the same "is the Ring 5 worth it" query: two posts and one tool. Decide which is canonical.

| Date | Post | URL |
|------|------|-----|
| 2026-07-30 | Is the Oura Ring 5 Worth It? What Changed and What Didn't | https://www.kygo.app/post/is-the-oura-ring-5-worth-it |
| 2026-07-19 | 19 Free Health & Wearable Tools From Kygo (No Signup) | https://www.kygo.app/post/free-health-wearable-tools |
| 2026-07-19 | What Is Kygo Health? The App That Links Food to Sleep & HRV | https://www.kygo.app/post/what-is-kygo-health-app-features-pricing |
| 2026-07-14 | Most Accurate Sleep Tracker? Oura vs Apple vs Fitbit vs Garmin vs Whoop (2026) | https://www.kygo.app/post/most-accurate-sleep-tracker-oura-vs-apple-vs-fitbit-2026 |
| 2026-07-08 | How Accurate Is Fitbit Calorie Burn? (2026 Research) | https://www.kygo.app/post/how-accurate-is-fitbit-calorie-burn |
| 2026-07-08 | How Accurate Is Apple Watch Calorie Burn? (2026 Research) | https://www.kygo.app/post/how-accurate-is-apple-watch-calorie-burn |
| 2026-07-08 | How Accurate Is Garmin Calorie Burn? (2026 Research) | https://www.kygo.app/post/how-accurate-is-garmin-calorie-burn |
| 2026-06-24 | What Influences REM Sleep? Factors Ranked by Evidence (2026) | https://www.kygo.app/post/what-influences-rem-sleep-factors-ranked |
| 2026-06-16 | Supplements for Wearable Metrics: What Works, What's Hype | https://www.kygo.app/post/supplements-for-wearable-metrics-what-works-what-s-hype |
| 2026-06-12 | Recovery Score Comparison: WHOOP vs Oura vs Garmin 2026 | https://www.kygo.app/post/recovery-scores-compared-whoop-oura-garmin |
| 2026-06-12 | Can You Trust Your Recovery Score? What the Science Says | https://www.kygo.app/post/can-you-trust-your-recovery-score |
| 2026-06-12 | Recovery Score Low? The Food & Drink Causes Most People Miss | https://www.kygo.app/post/what-lowers-recovery-score |
| 2026-06-04 | Most Accurate VO2 Max Wearable: Garmin, Apple, WHOOP & Oura Ranked | https://www.kygo.app/post/most-accurate-vo2-max-wearable |
| 2026-06-04 | What Affects VO2 Max? The Levers That Work (and the Ones That Waste Your Time) | https://www.kygo.app/post/what-affects-vo2-max |
| 2026-06-02 | Which Foods Affect Your Sleep & HRV? How to Find Out | https://www.kygo.app/post/which-foods-affect-your-sleep-and-hrv |
| 2026-05-28 | Oura Ring 5 vs Ring 4: Is the Upgrade Worth It? (Evidence-Based) | https://www.kygo.app/post/oura-ring-5-vs-ring-4-is-the-upgrade-worth-it-evidence-based |
| 2026-05-14 | Google Pixel Watch & Fitbit Stress Tracking: How cEDA and Body Response Actually Work (2026) | https://www.kygo.app/post/pixel-watch-fitbit-stress-tracking-explained |
| 2026-05-14 | WHOOP Stress Score and Recovery: What 5 Sensors Actually Measure (2026) | https://www.kygo.app/post/whoop-stress-score-recovery-explained |
| 2026-05-13 | Apple Watch Stress Tracking: How to Read the Data You Already Have (2026) | https://www.kygo.app/post/apple-watch-stress-tracking-explained |
| 2026-05-14 | How Wearables Measure Stress (Comparison) | https://www.kygo.app/post/how-wearables-measure-stress-comparison |
| 2026-05-10 | Oura Ring Stress Tracking: How 3 Layers of Stress Data Actually Work (2026) | https://www.kygo.app/post/oura-ring-stress-tracking-explained |
| 2026-05-08 | Fitbit Air vs WHOOP: Which Screenless Tracker Is Actually Worth It? (2026) | https://www.kygo.app/post/fitbit-air-vs-whoop-which-screenless-tracker-is-worth-it |
| 2026-04-26 | Resting Heart Rate Factors | https://www.kygo.app/post/resting-heart-rate-factors |
| 2026-04-20 | How to Stay Asleep: Factors Ranked by Evidence | https://www.kygo.app/post/how-to-stay-asleep-factors-ranked-by-evidence |
| 2026-04-15 | What's New at Kygo: Apple Health Overhaul, Smarter Correlations & Growth Update | https://www.kygo.app/post/whats-new-at-kygo-apple-health-overhaul-smarter-correlations-and-growth-update |
| 2026-04-09 | How to Fall Asleep Faster: Factors Ranked by Evidence | https://www.kygo.app/post/how-to-fall-asleep-faster-factors-ranked-by-evidence |
| 2026-03-23 | Why Does Alcohol Crush Your HRV (and How Long Until It Recovers)? | https://www.kygo.app/post/why-does-alcohol-crush-your-hrv-and-how-long-until-it-recovers |
| 2026-03-23 | Caffeine & Sleep Correlation: Your Personal Cutoff Time | https://www.kygo.app/post/caffeine-sleep-correlation-personal-cutoff-time |
| 2026-03-23 | Oura Ring Food Tracking: Complete Guide | https://www.kygo.app/post/oura-ring-food-tracking-complete-guide |
| 2026-03-23 | Why 80% of People Quit Food Logging Apps (and How to Stick With It) | https://www.kygo.app/post/why-80-of-people-quit-food-logging-apps-and-how-to-actually-stick-with-it |
| 2026-03-23 | Step Count Accuracy Factors | https://www.kygo.app/post/step-count-accuracy-factors |
| 2026-03-23 | Why Is My Resting Heart Rate Suddenly Higher? A Data-Driven Breakdown | https://www.kygo.app/post/why-is-my-resting-heart-rate-suddenly-higher-a-data-driven-breakdown |
| 2026-03-23 | What's the Most Accurate Wearable Data? A 2024-2025 Study Breakdown by Device | https://www.kygo.app/post/what-s-the-most-accurate-wearable-data-a-2024-2025-study-breakdown-by-device |
| 2026-03-23 | Which Wearable Has the Most Accurate Step Count? A 2024-2025 Research Analysis | https://www.kygo.app/post/which-wearable-has-the-most-accurate-step-count-a-2024-2025-research-analysis |
| 2026-03-23 | Oura Ring Nutrition Tracking: Connect Food to Sleep | https://www.kygo.app/post/oura-ring-nutrition-tracking-connect-food-to-sleep |
| 2026-03-23 | Centralize Health Data From Multiple Devices | https://www.kygo.app/post/centralize-health-data-multiple-devices |
| 2026-03-23 | Why Is My Sleep Score Low When I Slept 8 Hours? | https://www.kygo.app/post/why-is-my-sleep-score-low-when-i-slept-8-hours |
| 2026-03-23 | Why Did My HRV Drop? 12 Common Causes & What Your Food Log Reveals | https://www.kygo.app/post/why-did-my-hrv-drop-12-common-causes-and-what-your-food-log-reveals |
| 2026-03-22 | How Accurate Is Your Wearable Calorie Burn? | https://www.kygo.app/post/how-accurate-is-your-wearable-calorie-burn |
| 2026-03-22 | Long Overdue Update: A Lot Has Happened at Kygo Health | https://www.kygo.app/post/long-overdue-update-a-lot-has-happened-at-kygo-health |
| 2026-03-22 | How to Improve HRV: Factors Ranked by Evidence | https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence |
| 2026-03-22 | Wearable Hardware vs Software Differences (2025) | https://www.kygo.app/post/wearable-hardware-vs-software-differences-2025 |
| 2026-03-22 | How to Increase Deep Sleep: Factors Ranked | https://www.kygo.app/post/how-to-increase-deep-sleep-factors-ranked |
| 2026-02-27 | Every Sleep Metric Your Wearable Tracks (Oura, Apple Watch, Fitbit, Garmin) | https://www.kygo.app/post/every-sleep-metric-your-wearable-tracks-oura-apple-watch-fitbit-garmin |
| 2026-01-27 | Kygo Is Live on the App Store | https://www.kygo.app/post/kygo-is-live-on-the-app-store |
| 2026-01-22 | Why I Built the Kygo Health App | https://www.kygo.app/post/why-i-built-kygo-health-app |
| 2026-01-12 | Phase 1 Beta Is Live and We're Almost Ready for You | https://www.kygo.app/post/phase-1-beta-is-live-and-we-re-almost-ready-for-you |
| 2026-01-12 | Update Nov 3 2025: Rebuilt Food Logging From the Ground Up and Made It Free | https://www.kygo.app/post/update-november-3-2025-rebuilt-food-logging-from-the-ground-up-and-made-it-free |
| 2026-01-12 | Kygo Beta Opens to All Users: Apple Health Integration Now Live | https://www.kygo.app/post/kygo-beta-opens-to-all-users-apple-health-integration-now-live |

---

## Blog → Tool pairings

Most tools have a companion post. Useful for internal linking audits.

| Tool | Companion post(s) |
|------|-------------------|
| wearable-accuracy | what-s-the-most-accurate-wearable-data-... |
| sleep-tracker-accuracy | most-accurate-sleep-tracker-oura-vs-apple-vs-fitbit-2026 |
| calorie-burn-accuracy | how-accurate-is-your-wearable-calorie-burn + the 3 per-brand posts (garmin / apple watch / fitbit) |
| step-count-accuracy | which-wearable-has-the-most-accurate-step-count-... , step-count-accuracy-factors |
| vo2-max-accuracy | most-accurate-vo2-max-wearable |
| vo2-max-factors | what-affects-vo2-max |
| sensor-comparison | wearable-hardware-vs-software-differences-2025 |
| sleep-metrics | every-sleep-metric-your-wearable-tracks-... |
| deep-sleep-factors | how-to-increase-deep-sleep-factors-ranked |
| sleep-latency-factors | how-to-fall-asleep-faster-factors-ranked-by-evidence |
| staying-asleep-factors | how-to-stay-asleep-factors-ranked-by-evidence |
| rem-sleep-factors | what-influences-rem-sleep-factors-ranked |
| hrv-factors | how-to-improve-hrv-factors-ranked-by-evidence |
| resting-heart-rate-factors | resting-heart-rate-factors |
| recovery-score-explorer | recovery-scores-compared-whoop-oura-garmin, can-you-trust-your-recovery-score, what-lowers-recovery-score |
| stress-factors | how-wearables-measure-stress-comparison + 4 per-brand stress posts |
| supplements-by-metric | supplements-for-wearable-metrics-what-works-what-s-hype |
| fitbit-air-vs-whoop-comparison | fitbit-air-vs-whoop-which-screenless-tracker-is-worth-it |
| oura-ring-comparison-tool | oura-ring-5-vs-ring-4-is-the-upgrade-worth-it-evidence-based |
| oura-ring-5-vs-4 | is-the-oura-ring-5-worth-it (2026-07-30) — and, by topic, oura-ring-5-vs-ring-4-... , which is also mapped to oura-ring-comparison-tool above. Overlapping. |
| calories-in-anything | *(none — no companion post)* |

---

**Change log**
- 2026-07-30 (2nd pass, live re-verification): Blog posts 48 → 49 — `is-the-oura-ring-5-worth-it` published today and is in the sitemap. Pages sitemap re-enumerated: 30 entries, still 9 pages + 21 tools, no change. Stripped the meaningless † markers. Corrected two false claims that were in the morning version of this file: (a) the "all four surfaces read 21" ✅ — `free-health-wearable-tools` still says 19 and `llms.txt` link text still says 20; (b) the "older Oura post is 301'd into the tool" note — it is not, it still serves the post.
- 2026-07-29: Full re-pull. Tools 19 → 20 (added Sleep Tracker Accuracy). Blog posts 39 → 48 (found 9 additional live posts absent from both the old index and the blog sitemap). Removed dead `/llms-txt` page, added live `/llms.txt` + MCP endpoint. Added blog→tool pairing map.
- 2026-07-10: Previous version — 10 pages, 19 tools, 39 posts.
- 2026-06-13: Older version — 10 pages, 14 tools, 34 posts.
