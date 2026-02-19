# Step Count Accuracy Tool — Implementation Plan

## Overview
Build a new web component `<kygo-step-count-accuracy>` as a standalone JS file (`kygo-step-count-accuracy.js`), following the same architecture as the existing `kygo-wearable-accuracy.js`. This tool focuses specifically on step count accuracy across wearable devices and what influences it.

---

## Phase 1: Build the Web Component (`kygo-step-count-accuracy.js`)

### 1.1 — Component Skeleton
- Class `KygoStepCountAccuracy extends HTMLElement`
- Shadow DOM, `connectedCallback`, `disconnectedCallback`
- `__seo()` helper for light-DOM crawlable text
- Same CSS variable system (--dark, --green, --gray-*, etc.)
- Same font stack (DM Sans / Space Grotesk)
- Same animation system (IntersectionObserver + `.animate-on-scroll`)

### 1.2 — Data Layer (embedded in JS getters)
All data sourced from `step-count-accuracy-tool-data.json` and `step_count_accuracy_reference.md`:

**Device Data (`get _devices`)** — 8 devices:
| Device | Rank | Overall Accuracy | Key Stat |
|---|---|---|---|
| Garmin | #1 | 82.6% | 0.6–3.5% MAPE lab |
| Apple Watch | #2 | 81.1% | r=0.99 vs ActivPAL |
| Fitbit | #3 | 77.3% | Most-studied (144 studies) |
| Samsung | #4 | r=0.82 | Overcounting issues |
| COROS | #5 | ~98.6% walk | Running-focused |
| Polar | #6 | 53.2% meta | Overreports |
| Oura Ring | #7 | 50.3% error | Finger = phantom steps |
| WHOOP | #8 | No data | Feature added Oct 2024 |

Each device includes: name, rank, color, imageUrl (same Wix static URLs), accuracy %, MAPE ranges, bias direction, algorithm type, false step triggers, strengths, weaknesses, model-specific data with sources, and **Amazon affiliate links** (placeholder — need URLs from user).

**Accuracy Factors (`get _factors`)** — 11 factors ranked by impact:
1. Walking Speed (highest impact) — with speed/accuracy breakdown table
2. Sensor Placement — ankle vs hip vs wrist vs finger comparison
3. Arm Swing — over/under estimation scenarios
4. Age — 4.3% vs 10.9% MAPE
5. Activity Type — lab vs free-living vs stationary
6. Gait Pathology — 11-47% detection
7. BMI / Body Composition
8. Device Fit
9. Surface Type
10. Incline / Terrain
11. Treadmill vs Overground

**How Step Counting Works (`get _pipeline`)** — 6-step technical pipeline
**Algorithm Categories** — Peak Detection, ML-Enhanced, Deep Learning, Zero-Crossing, Autocorrelation
**Research Sources** — 24 peer-reviewed sources with DOIs

### 1.3 — Page Sections (in order)

#### Section 1: Header
- Sticky header with Kygo logo + "Step Count Accuracy" title
- "Get Kygo App" link (right side)
- Same design as wearable tool header

#### Section 2: Hero
- Badge: "PEER-REVIEWED RESEARCH"
- H1: "How Accurate Is Your Wearable's Step Count?"
- Subtitle: "We analyzed 20+ peer-reviewed studies to reveal which devices count steps most accurately — and what factors affect your count."

#### Section 3: Device Rankings
- Ranked list/grid of 8 devices showing:
  - Device icon/image
  - Rank badge (#1, #2, etc.)
  - Device name (linked to Amazon affiliate)
  - Overall accuracy %
  - MAPE range
  - Bias direction (overestimates/underestimates)
  - Quick verdict (e.g., "Most Accurate Step Counter")
- Expandable cards with: model-specific data, algorithm type, false step triggers, strengths/weaknesses, research sources, Amazon links

#### Section 4: What Affects Your Step Count (Accuracy Factors)
- Interactive factor cards ranked by impact
- Each factor has: impact level badge, description, supporting data
- Walking Speed section with visual speed/accuracy chart
- Sensor Placement comparison (ankle > hip > wrist > finger)
- Over/Underestimation scenarios with examples

#### Section 5: How Step Counting Works
- Visual 6-step pipeline
- Algorithm comparison table
- "Fundamental limitation" callout

#### Section 6: Important Caveats
- 12 expandable caveat cards (same pattern as wearable tool)
- Key caveats: lab vs real-world, walking speed, wrist limitation, Oura, WHOOP, etc.

#### Section 7: CTA
- Same gradient green CTA box
- "Your steps tell a story. Kygo reads it."
- iOS download button
- Feature bullets (Free forever, Syncs with 4+ wearables, AI food logging)

#### Section 8: Footer
- Kygo Health branding
- Privacy/Terms links
- Data last updated date
- Amazon Associate disclosure
- Copyright

### 1.4 — Interactive Features
- Device card expand/collapse (click to see details)
- Factor card expand/collapse
- Caveat expand/collapse
- Scroll animations (IntersectionObserver)
- All event handling via single delegated listener

### 1.5 — SEO & AI Search Optimization
- `__seo()` light-DOM text injection with comprehensive keyword-rich summary
- JSON-LD structured data (`WebApplication` + `FAQPage` schema)
- Semantic HTML (h1, h2, h3, section, article)
- Alt text on all images
- Meta-friendly content structure

### 1.6 — Responsive Design
- Mobile-first CSS (base → 768px → 1024px breakpoints)
- Same breakpoint pattern as wearable tool
- Reduced motion support

---

## Phase 2: Amazon Affiliate Links Needed

I will use placeholder `#` URLs for these devices. **You will need to provide Amazon affiliate links for:**

1. **Garmin** — Venu 3, Forerunner 265, Fenix 8 (can reuse from wearable tool)
2. **Apple Watch** — Series 10, Ultra 2 (can reuse from wearable tool)
3. **Fitbit** — Charge 6, Sense 2 (can reuse from wearable tool)
4. **Samsung** — Galaxy Watch 7, Galaxy Watch Ultra (can reuse from wearable tool)
5. **COROS** — APEX 2 Pro or PACE 3 (NEW — not in wearable tool)
6. **Polar** — Vantage M3 or Vantage V3 (NEW — not in wearable tool)
7. **Oura Ring** — Gen 4 (can reuse from wearable tool)
8. **WHOOP** — 4.0 (can reuse from wearable tool)

**Note:** I will reuse the existing affiliate links from the wearable accuracy tool for devices that already have them. Only COROS and Polar are new and need links.

---

## Phase 3: JSON-LD Structured Data for Wix

After building, I will provide you with:
1. **WebApplication** schema — for the tool itself
2. **FAQPage** schema — for the accuracy factors (Google FAQ rich snippets)
3. Instructions on where to paste the JSON-LD in Wix

---

## Phase 4: Wix Integration Instructions

After the JS file is built and pushed, I will provide:
1. The jsDelivr CDN URL: `https://cdn.jsdelivr.net/gh/Kygo-Health/kygo-elements@main/kygo-step-count-accuracy.js`
2. Custom element tag: `<kygo-step-count-accuracy>`
3. Step-by-step Wix embed instructions (same pattern as wearable tool)

---

## File Created
- `/home/user/kygo-elements/kygo-step-count-accuracy.js` — The complete web component

## Files Referenced (read-only)
- `step-count-accuracy-tool-data.json` — Primary data source
- `step_count_accuracy_reference.md` — Detailed reference data
- `kygo-post-step-count-accuracy-wearables.md` — Blog post content
- `kygo-wearable-accuracy.js` — Design/architecture reference

---

## Estimated Complexity
- Single JS file, ~1200-1500 lines (similar to wearable accuracy tool)
- No build step required — vanilla JS web component
- Self-contained with all styles and data embedded
