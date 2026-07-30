# Related-Tools Section — Rollout Tracker

Goal: add a "Related tools" row of 3 cross-link cards near the bottom of every tool page
(above sources/footer), reusing the main tools-page card visual, for internal cross-linking.

Reference prototype: `kygo-sleep-tracker-accuracy.js` (shipped inline; look approved 2026-07-30).

## ⚠️ Approach decision (pending)

The tool pages span **2+ design generations** (see `fixes-and-issues.md` #20):
- **Family A** — semantic palette (`--fg-1`, `--bg-surface`, `--kygo-green`) + `.section bg-light/white`.
  The prototype's inline code drops in here.
- **Family B** — older canonical palette (`--green`, `--dark`, `--gray-*`) + `.container` sections,
  no `bg-light/white`. The prototype's CSS vars are **undefined** here → would render unstyled.
- `calories-in-anything` — a third, separate pattern (`calories-custom-element.js`).

So a single inline block cannot be pasted across all 21. Two options:
1. **Shared component `kygo-related-tools.js`** (RECOMMENDED) — one self-contained element (registry +
   picks + motif engine + card UI + isolated styles). Every tool embeds
   `<kygo-related-tools current="<slug>">`; its shadow DOM makes it render identically on any
   generation. Mirrors the existing `<kygo-inline-subscribe>` pattern already embedded on both
   families. Client loads `kygo-related-tools.js` on each tool page in Wix (like inline-subscribe),
   and it must be on GitHub Pages (auto on merge).
2. **Inline, per-generation variants** — adapt the block to Family A vs B palettes + structures.
   High duplication, per-file bespoke work (Family B isn't internally uniform either), higher risk.

## Card data source of truth

`kygo-tools.js` `_defaultTools()` (title/url/category) + the motif map (`_motifFor`) — all 21 tools.
Related cards must use the **canonical URL** (several are non-obvious, e.g. oura → `oura-ring-comparison-tool`).

## Per-tool plan (which 3 + status)

Family: **A** = semantic, **B** = canonical, **S** = special (calories).
Status: ⬜ pending · 🟡 in progress · ✅ done+verified.

| # | Tool (component) | slug | Fam | Related 3 (slugs) | Status |
|---|---|---|---|---|---|
| 1 | kygo-sleep-tracker-accuracy | sleep-tracker-accuracy | A | sleep-metrics, wearable-accuracy, calorie-burn-accuracy | ✅ (prototype) |
| 2 | kygo-wearable-accuracy | wearable-accuracy | B | sleep-tracker-accuracy, step-count-accuracy, vo2-max-accuracy | ⬜ |
| 3 | kygo-calorie-burn-accuracy | calorie-burn-accuracy | A | wearable-accuracy, step-count-accuracy, vo2-max-accuracy | ⬜ |
| 4 | kygo-step-count-accuracy | step-count-accuracy | B | wearable-accuracy, calorie-burn-accuracy, sleep-tracker-accuracy | ⬜ |
| 5 | kygo-vo2max-accuracy | vo2-max-accuracy | A | vo2-max-factors, wearable-accuracy, sensor-comparison | ⬜ |
| 6 | kygo-sensor-comparison | sensor-comparison | B | wearable-accuracy, sleep-metrics, recovery-score-explorer | ⬜ |
| 7 | kygo-oura-ring-comparison | oura-ring-comparison-tool | A | oura-ring-5-vs-4, sleep-tracker-accuracy, wearable-accuracy | ⬜ |
| 8 | kygo-oura-5-vs-4 | oura-ring-5-vs-4 | A | oura-ring-comparison-tool, sleep-tracker-accuracy, wearable-accuracy | ⬜ |
| 9 | kygo-fitbit-air-vs-whoop | fitbit-air-vs-whoop-comparison | A | wearable-accuracy, calorie-burn-accuracy, sleep-tracker-accuracy | ⬜ |
| 10 | kygo-sleep-metrics | sleep-metrics | B | deep-sleep-factors, rem-sleep-factors, sleep-tracker-accuracy | ⬜ |
| 11 | kygo-deep-sleep-factors | deep-sleep-factors | A | staying-asleep-factors, sleep-latency-factors, supplements-by-metric | ⬜ |
| 12 | kygo-sleep-latency-factors | sleep-latency-factors | B | deep-sleep-factors, staying-asleep-factors, supplements-by-metric | ⬜ |
| 13 | kygo-staying-asleep-factors | staying-asleep-factors | B | sleep-latency-factors, deep-sleep-factors, supplements-by-metric | ⬜ |
| 14 | kygo-rem-sleep | rem-sleep-factors | A | deep-sleep-factors, staying-asleep-factors, sleep-metrics | ⬜ |
| 15 | kygo-hrv-factors | hrv-factors | B | resting-heart-rate-factors, recovery-score-explorer, supplements-by-metric | ⬜ |
| 16 | kygo-rhr-factors | resting-heart-rate-factors | B | hrv-factors, recovery-score-explorer, supplements-by-metric | ⬜ |
| 17 | kygo-recovery-scores | recovery-score-explorer | B | hrv-factors, resting-heart-rate-factors, stress-factors | ⬜ |
| 18 | kygo-vo2max-factors | vo2-max-factors | A | vo2-max-accuracy, recovery-score-explorer, hrv-factors | ⬜ |
| 19 | kygo-wearable-stress | stress-factors | B | recovery-score-explorer, hrv-factors, resting-heart-rate-factors | ⬜ |
| 20 | kygo-supplements-by-metric | supplements-by-metric | B | hrv-factors, deep-sleep-factors, recovery-score-explorer | ⬜ |
| 21 | calories-custom-element | calories-in-anything | S | supplements-by-metric, wearable-accuracy, sleep-metrics | ⬜ |

Pick heuristic: same topical cluster first (wearables/devices, sleep, recovery, nutrition), then
adjacent tools; sleep + recovery factor explorers also link to `supplements-by-metric` (topical +
affiliate synergy). No tool links to itself.

## Remaining after rollout
- Document the pattern in `tool-page-playbook.md`.
- Client: load `kygo-related-tools.js` on each tool page in Wix (if the component approach is used).
