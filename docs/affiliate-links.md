# Affiliate Links Inventory

> Every affiliate link in the `kygo-elements` components — what product it points to and where
> it's listed. All affiliate links are **Amazon short links (`amzn.to/...`)** except two non-Amazon
> referrals (a WHOOP membership link and the HLTH Code Refersion banner — both in Section C).
> **37 unique** Amazon short links across **10 files**.

All affiliate `<a>` tags use `target="_blank" rel="noopener sponsored"` (the `sponsored` rel is
the FTC/Google-correct attribute for paid links — good). Short links resolve on Amazon's side;
the destination ASIN/tag isn't visible in this repo, only the `amzn.to` slug.

---

## A. Wearable devices

These appear on the accuracy/comparison tool pages, usually one affiliate link per device in a
data object (`affiliateUrl`, `{name,url}`, or `affiliate:{url,label}`).

| Short link | Product | Listed in (file : line) |
|---|---|---|
| `amzn.to/4rUcGst` | **Apple Watch** (S10 / Ultra 3) | sensor-comparison:108,119 · sleep-metrics:82 · step-count-accuracy:102 · wearable-accuracy:58 · calorie-burn-accuracy:1169 |
| `amzn.to/3ZPkHDc` | **Fitbit** (Charge 6) | sensor-comparison:130 · sleep-metrics:67 · step-count-accuracy:131 · wearable-accuracy:122 · calorie-burn-accuracy:1194 |
| `amzn.to/4aF8l5D` | **Garmin** | sensor-comparison:75 · sleep-metrics:97 · step-count-accuracy:74 · wearable-accuracy:90 · calorie-burn-accuracy:1219 |
| `amzn.to/4aF93jj` | **Oura Ring** (Ring 4) | sensor-comparison:97 · sleep-metrics:51 · step-count-accuracy:243 · wearable-accuracy:74 · calorie-burn-accuracy:1269 |
| `amzn.to/4suRaen` | **Whoop 5.0** | sensor-comparison:86 |
| `amzn.to/4rRoziQ` | **WHOOP** | step-count-accuracy:267 · wearable-accuracy:106 |
| `amzn.to/3PUMS23` | **Samsung Galaxy Watch** (unified across all 3 pages) | step-count-accuracy:159 · wearable-accuracy:138 · calorie-burn-accuracy:1294 |
| `amzn.to/4rkOv6I` | **COROS** | step-count-accuracy:186 |
| `amzn.to/4rqpdnL` | **Polar** | step-count-accuracy:214 |

### Oura comparison page (`kygo-oura-ring-comparison.js`)
| Short link | Product | Line(s) |
|---|---|---|
| `amzn.to/3PxP8fM` | **Oura Gen 3** | 414 |
| `amzn.to/3RD6VCL` | **Oura Ring 4** | 415, 459 |
| `amzn.to/3Q4f42J` | **Oura Ring 5** | 416, 459 |

### Fitbit Air vs WHOOP page (`kygo-fitbit-air-vs-whoop.js`)
| Short link | Product | Line(s) |
|---|---|---|
| `amzn.to/4wogJ3y` | **Fitbit Air** | 168, 378 |
| `amzn.to/431iUfG` | **WHOOP 5.0 / MG** | 177, 379 |

---

## B. Supplements & sleep/recovery products

Rendered inline on the "factors" pages as `affiliate:{url,label}` chips under each factor.

### `kygo-deep-sleep-factors.js`
| Short link | Product label | Line |
|---|---|---|
| `amzn.to/4saSeEc` | Sunrise Alarm Clock | 179 |
| `amzn.to/3Nbjq6C` | Magnesium Glycinate | 195 |
| `amzn.to/3PWfatc` | Glycine Powder | 208 |
| `amzn.to/3PXqKEh` | Tart Cherry Juice | 221 |
| `amzn.to/4szGon9` | Melatonin Supplement | 234 |
| _(none)_ | Cooling Mattress Pad — affiliate intentionally removed (no good product found) | 250 (Temperature factor) |
| `amzn.to/4cwMwI1` | Blue Light Blocking Glasses | 263 |
| `amzn.to/4bfT8bC` | White Noise Machine | 276 |
| `amzn.to/40gYtKD` | CO₂ Monitor | 313 |

### `kygo-hrv-factors.js`
| Short link | Product label | Line |
|---|---|---|
| `amzn.to/403ZgOP` | Ashwagandha Extract | 69 |
| `amzn.to/4qYXjOD` | KSM-66 Ashwagandha | 80 |
| `amzn.to/40AsqFp` | Multi-Strain Probiotic | 91 |
| `amzn.to/4rM2eDY` | Daily Multivitamin | 112 |
| `amzn.to/3OyDz7c` | GABA Supplement | 123 |
| `amzn.to/3OEoHEh` | L-Theanine 200mg | 134 |
| `amzn.to/406okEX` | Beetroot Juice Shots | 145 |
| `amzn.to/46scAQQ` | Breathing Trainer | 168 |
| `amzn.to/4aYRATe` | Cold Plunge Tub | 179 |
| `amzn.to/4tZ5Zr2` | Meditation Cushion | 190 |
| `amzn.to/4lbwIg3` | Vitamin B12 | 405 |
| `amzn.to/4cm6d5m` | Vitamin D3 | 416 |
| `amzn.to/3Nbjq6C` | Magnesium Glycinate | 427 |
| `amzn.to/4cVnvGt` | Omega-3 Fish Oil | 438 |
| `amzn.to/4760BIN` | Zinc Picolinate | 449 |

### `kygo-sleep-latency-factors.js`
Wired up 2026-06. Supplement links **reuse** the same products as the Deep Sleep / HRV pages
(same physical item = same link, which is correct); Dietary Fiber is a new link.
| Short link | Product label | Line |
|---|---|---|
| `amzn.to/4uL7b1p` | Dietary Fiber Supplement (new) | 99 |
| `amzn.to/4szGon9` | Melatonin Supplement | 162 |
| `amzn.to/403ZgOP` | Ashwagandha Extract | 173 |
| `amzn.to/3Nbjq6C` | Magnesium Glycinate | 184 |
| `amzn.to/3PWfatc` | Glycine Powder | 195 |
| `amzn.to/3OyDz7c` | GABA Supplement | 206 |
| `amzn.to/3OEoHEh` | L-Theanine 200mg | 217 |
| `amzn.to/4cwMwI1` | Blue Light Blocking Glasses | 312 |
| `amzn.to/4bfT8bC` | White Noise Machine | 323 |

*(CBD Isolate and Kiwifruit factors intentionally have no affiliate link.)*

---

## C. Non-Amazon affiliate / referral

| Link | Product | Listed in |
|---|---|---|
| `https://join.whoop.com/` | **WHOOP** membership referral (WHOOP's own program, not Amazon) | calorie-burn-accuracy.js:1244 |
| `https://gethlth.com/?rfsn=9131461.c81405e` | **HLTH Code** meal-replacement shake — **Refersion** affiliate (referral `aid` `9131461.c81405e`) | kygo-oura-ring-comparison.js (`_setupAffiliateBanner`) |

*(Other `whoop.com` / `support.whoop.com` URLs in the codebase are editorial citations, not affiliate links.)*

### HLTH Code banner (Refersion dynamic creative)

This is the **only non-Amazon, non-`<a>`-tag** affiliate placement: a Refersion **dynamic banner**
(an ad test), not a static link. Mechanics:

- Lives on the **Oura Ring comparison page** (`kygo-oura-ring-comparison.js`), directly below the
  "What's changed" cards, injected by `_setupAffiliateBanner()`.
- Refersion's `cdn.refersion.com/creative.js` renders the creative into `#rfsn_img_125600`
  (creative `125600-f2e0…`, `aid: 9131461.c81405e`). Because `creative.js` targets a real DOM
  element by id (can't reach shadow DOM), the banner is appended to **light DOM** and projected
  into the layout via `<slot name="hlth-ad">`.
- Affiliate attribution is handled **on Refersion's side** via the `aid`; the visible link is the
  generated creative link (falls back to `https://gethlth.com/?rfsn=9131461.c81405e&utm_source=refersion&utm_medium=affiliate`).
- Labeled **"Advertisement"** above the banner (FTC disclosure). The page footer's Amazon-Associate
  line still applies to the Amazon links elsewhere on the page.
- **Tracking:** clicks fire a GA4 `cta_click` with `cta_category: "affiliate_banner"`,
  `affiliate: "hlth_code"`, `affiliate_network: "refersion"` (see `docs/schemas-and-tracking.md`).

---

## ✅ Resolved (branch `claude/hopeful-faraday-ig1PE`, 2026-06)

1. **Reused short links fixed** — the three slugs that pointed at the wrong product on the Deep
   Sleep page were re-pointed; each slug now belongs to one product:
   - Glycine Powder → `amzn.to/3PWfatc` (was `3OyDz7c`, which is GABA on the HRV page)
   - Tart Cherry Juice → `amzn.to/3PXqKEh` (was `406okEX`, which is Beetroot on the HRV page)
   - Cooling Mattress Pad → **affiliate removed** (no good product found; was `4aYRATe`, which is
     Cold Plunge on the HRV page)
2. **Samsung unified** — all three pages now use `amzn.to/3PUMS23` (replaced the broken
   `4tfkllQ` and the old `4aZkBPB`).

3. **Sleep-latency affiliate links wired** — 9 factors populated (8 reusing existing product
   links + new Dietary Fiber `4uL7b1p`). CBD Isolate / Kiwifruit intentionally left without links.

## ⚠️ Still open

4. **Cooling Mattress Pad** has no affiliate link (intentional gap) — add one if a good product turns up.
5. Short links hide the Amazon affiliate **tag**; verify each `amzn.to` still carries the correct
   associate tag on the Amazon side (not auditable from this repo).
