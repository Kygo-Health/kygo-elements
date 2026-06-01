# What Kygo Health Does — Product Reference

> Reference for what the Kygo app actually does, so component copy, SEO summaries
> (`__seo`), and JSON-LD stay accurate and consistent. This is the product source of truth;
> when writing or editing a page, keep claims aligned with what's described here.

**In one sentence:** Kygo lets you log food effortlessly (photo, barcode, voice, chat, or
anything you've logged through Apple Health or Health Connect), pulls the best data from your
wearables and the best nutrition numbers from multiple databases, and then tells you which foods
are actually improving or wrecking your sleep, recovery, and energy — with AI doing the tedious
parts.

**What makes it different:** unlike most calorie counters (e.g. MyFitnessPal), Kygo connects
**what you eat** to **how your body actually performs** — surfacing per-metric correlations
between foods/nutrients and sleep, HRV, readiness, energy, and stress.

## Key links

| Link | Purpose |
|---|---|
| https://www.kygo.app/ | Marketing site (homepage) |
| https://kygo.app/iOS | iOS app download (redirect) |
| https://kygo.app/android | Android app download (redirect) |
| https://www.kygo.app/privacy-policy | Privacy policy |

App Store listing: `https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589`
(see `docs/internal-and-app-store-links.md` for the full link inventory).

---

## Logging your food (the core)

Multiple input methods so you can pick whatever's fastest in the moment:

- **Photo** — snap a meal; AI identifies foods and portion sizes.
- **Barcode scan** — packaged food → full nutrition facts instantly.
- **Voice** — dictate in plain language ("two eggs and a slice of toast").
- **Search** — type to search a food database.
- **Chat-style logging** — conversational interface; food cards appear as you go and can be tweaked.
- **Saved foods & meals** — save go-to foods or whole meals, re-add in one tap.
- **Apple Health nutrition import (iOS)** — nutrition logged in other apps that write to Apple
  Health flows into Kygo automatically (you don't have to abandon other food apps).
- **Health Connect nutrition import (Android)** — the Android equivalent.

After logging you can adjust quantities/units (grams, cups, oz, servings), assign to
breakfast/lunch/dinner/snacks, log to past dates, copy meals from previous days, and undo recent
adds. It auto-guesses the meal based on time of day.

**Best-data-wins accuracy:** Kygo weighs evidence from multiple databases (**Edamam, USDA, and
Open Food Facts** for barcodes) plus the AI's photo/voice estimate, and picks the most accurate
calorie/nutrient values rather than the first match. It also sanity-checks the chosen serving
size/unit against what the food actually comes in.

## Nutrition tracking

- **Daily nutrition card** — real-time progress toward calorie, protein, carb, and fat goals.
- **Full micronutrient tracking** — all vitamins and minerals, plus caffeine and alcohol, vs.
  recommended daily intake.
- **USDA enrichment** — backfills micronutrients that source databases leave blank, so tracking
  isn't full of gaps.
- **Personalized macro goals** — calculated from profile (age, weight, height, sex, activity
  level, weight goal) with a live preview; or set custom targets anytime.
- **Water tracking**, **weight tracking** (trends over time), and totals/meal breakdowns for any
  past date.

## Connecting wearables

Auto-syncs from **Oura Ring**, **Apple Health (iOS) / Health Connect (Android)**, **Fitbit**,
**Garmin**, **WHOOP**. Apple Health / Health Connect sync both health metrics *and* nutrition
entries from other apps, in both directions.

Metrics pulled (device-dependent): sleep, HRV, readiness, body temperature, heart rate, activity,
SpO₂, VO₂ max, body battery / strain, resilience, breathing. Each connection is managed in
settings (sync status, last sync time, manual sync, reconnect).

**Best metric from each device:** with multiple wearables, Kygo doesn't double-count or pick
randomly — for each metric it pulls from the most trustworthy source (e.g. Oura/WHOOP lead for
sleep and recovery, Apple Health/Garmin lead for steps and activity, WHOOP/Oura lead for resting
heart rate).

## Correlations & insights (the actual point)

- Insights organized **per health metric** (sleep, HRV, readiness, stress, etc.); within each you
  see the foods and nutrients **helping** vs. **hurting** it.
- Checks foods across **different time lags** (same day plus a few days later) — some foods hit
  immediately, others later.
- Each insight is **graded by strength**, filtering out weak/noisy ones.
- A **"featured question"** surfaces the single most useful discovery right now; a **daily pulse**
  summarizes where you stand today.
- **Pin factors** to watch and track them as little experiments over time.
- Needs ~**a week** of combined food + wearable data before insights kick in.

## Trends

- **Nutrition trends** — daily macros over time vs. targets.
- **Health-metric trends** — each wearable metric over time, with status flags (improving, steady,
  sliding).

## Home dashboard ("Today")

At-a-glance: logging streak, today's nutrition progress, water and weight, latest wearable metrics
(sleep, HRV, stress, heart rate), wearable connection health, and quick-add tiles
(camera/barcode/saved foods/voice). Pull down to refresh and re-sync.

## Onboarding

Guided setup: health profile → nutrition targets (with live preview) → meal-time windows →
connect a wearable → choose a plan. A first-launch walkthrough (replayable from settings) plus a
**value timeline** showing what unlocks over the first weeks (patterns at day 7, experiments at
day 14, etc.).

## Free vs. Pro

- **Free:** food logging + wearable syncing + basic nutrition tracking.
- **Pro (subscription):** correlations, helping/hurting food insights, personalized
  recommendations from the **"Kygo Advisor,"** factor pinning, and experiment tracking.

## Settings & support

- **Account:** sign up / log in (email, Google, or Apple), profile editing, password reset, delete
  account.
- **Notifications:** time- and day-aware meal reminders that skip themselves if you've already
  logged; alerts when a metric has enough data to unlock insights; heads-up if a wearable
  connection drops; support replies.
- **Appearance:** full dark mode.
- **Support:** in-app FAQ, submit bug reports / questions / feature requests, ticket threads with a
  reply badge.
- **Diagnostics:** app version, sync status, nutrition data source.
- **What's New:** badge surfacing recent feature updates.

---

## Quick facts for copy / SEO / JSON-LD

- **Category:** food + health tracking app (nutrition + wearables).
- **Platforms:** iOS and Android.
- **Supported wearables/sources:** Oura, Apple Health, Health Connect, Fitbit, Garmin, WHOOP.
- **Nutrition data sources:** Edamam, USDA, Open Food Facts (barcodes), + AI photo/voice estimate.
- **Core differentiator:** food↔body-performance correlations (sleep, HRV, readiness, stress, energy).
- **Monetization:** freemium — free logging/syncing/basic tracking; Pro unlocks insights & advisor.
- **"Kygo Advisor":** the Pro personalized-recommendation feature name.
