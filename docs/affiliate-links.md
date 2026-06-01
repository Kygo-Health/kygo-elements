# Affiliate Links Inventory

> Every affiliate link in the `kygo-elements` components — what product it points to and where
> it's listed. All affiliate links are **Amazon short links (`amzn.to/...`)** except one WHOOP
> referral link (noted at the bottom). **35 unique** Amazon short links across **10 files**.

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
| `amzn.to/4aZkBPB` | **Samsung Galaxy Watch** | step-count-accuracy:159 · wearable-accuracy:138 |
| `amzn.to/4tfkllQ` | **Samsung Galaxy Watch** ⚠️ different link than above | calorie-burn-accuracy:1294 |
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
| `amzn.to/3OyDz7c` | Glycine Powder | 208 |
| `amzn.to/406okEX` | Tart Cherry Juice | 221 |
| `amzn.to/4szGon9` | Melatonin Supplement | 234 |
| `amzn.to/4aYRATe` | Cooling Mattress Pad | 250 |
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
| `amzn.to/3OyDz7c` | GABA Supplement ⚠️ same link as Glycine Powder above | 123 |
| `amzn.to/3OEoHEh` | L-Theanine 200mg | 134 |
| `amzn.to/406okEX` | Beetroot Juice Shots ⚠️ same link as Tart Cherry Juice above | 145 |
| `amzn.to/46scAQQ` | Breathing Trainer | 168 |
| `amzn.to/4aYRATe` | Cold Plunge Tub ⚠️ same link as Cooling Mattress Pad above | 179 |
| `amzn.to/4tZ5Zr2` | Meditation Cushion | 190 |
| `amzn.to/4lbwIg3` | Vitamin B12 | 405 |
| `amzn.to/4cm6d5m` | Vitamin D3 | 416 |
| `amzn.to/3Nbjq6C` | Magnesium Glycinate | 427 |
| `amzn.to/4cVnvGt` | Omega-3 Fish Oil | 438 |
| `amzn.to/4760BIN` | Zinc Picolinate | 449 |

---

## C. Non-Amazon affiliate / referral

| Link | Product | Listed in |
|---|---|---|
| `https://join.whoop.com/` | **WHOOP** membership referral (WHOOP's own program, not Amazon) | calorie-burn-accuracy.js:1244 |

*(Other `whoop.com` / `support.whoop.com` URLs in the codebase are editorial citations, not affiliate links.)*

---

## ⚠️ Anomalies to review

1. **One short link reused for different products** — likely copy-paste errors that send buyers to the wrong item:
   - `amzn.to/3OyDz7c` = "Glycine Powder" (deep-sleep:208) **and** "GABA Supplement" (hrv:123)
   - `amzn.to/406okEX` = "Tart Cherry Juice" (deep-sleep:221) **and** "Beetroot Juice Shots" (hrv:145)
   - `amzn.to/4aYRATe` = "Cooling Mattress Pad" (deep-sleep:250) **and** "Cold Plunge Tub" (hrv:179)
2. **Samsung Galaxy Watch has two different links**: `amzn.to/4aZkBPB` (step-count, wearable-accuracy) vs `amzn.to/4tfkllQ` (calorie-burn). Confirm which is the intended/current affiliate link.
3. **`kygo-sleep-latency-factors.js`** renders affiliate chips (`f.affiliate`, line 518) but its current factor data contains **no** affiliate URLs — the slots are wired up but empty.
4. Short links hide the Amazon affiliate **tag**; verify each `amzn.to` still carries the correct associate tag on the Amazon side (not auditable from this repo).
