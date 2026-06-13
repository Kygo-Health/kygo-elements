# Affiliate Links Inventory

> Every affiliate link in the `kygo-elements` components — what product it points to and where
> it's listed. Affiliate links are **Amazon short links (`amzn.to/...`)** except: two non-Amazon
> referrals (a WHOOP membership link and the HLTH Code Refersion banner — both in Section C), and
> one **full-URL Amazon Associates link** (the Sleep Mask on the staying-asleep page — a tagged
> `amazon.com/dp/...?tag=kygohealthapp-20` link rather than an `amzn.to` short link).
> **40 unique** Amazon links across **12 files**.

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

### VO2 max accuracy tool (`kygo-vo2max-accuracy.js`)
Added 2026-06. One affiliate per device in the `_devices` array (`affiliateUrl`). Reuses the
existing per-brand slugs above; **Suunto (`amzn.to/4fZD5Cx`) is a new link.**
| Short link | Product | Line |
|---|---|---|
| `amzn.to/4aF8l5D` | **Garmin** | 59 |
| `amzn.to/4rUcGst` | **Apple Watch** | 74 |
| `amzn.to/4rqpdnL` | **Polar** | 88 |
| `amzn.to/3ZPkHDc` | **Fitbit / Google** | 102 |
| `amzn.to/3PUMS23` | **Samsung Galaxy Watch** | 116 |
| `amzn.to/4rRoziQ` | **WHOOP** | 130 |
| `amzn.to/4aF93jj` | **Oura Ring** | 144 |
| `amzn.to/4rkOv6I` | **Coros** | 158 |
| `amzn.to/4fZD5Cx` | **Suunto** (new) | 172 |

### Recovery & readiness scores tool (`kygo-recovery-scores.js`)
Added 2026-06. One affiliate per brand in the `_devices` object (`amazon` field), rendered as a
"View … on Amazon" button in each brand deep-dive card with `rel="noopener sponsored"` and a
visible "Affiliate link" disclosure. Reuses the existing per-brand slugs above; **Amazfit
(`amzn.to/4fHVnYW`) and RingConn (`amzn.to/4e5fGyj`) are new links.** **Ultrahuman has no
button** — it is not sold on Amazon (no link).
| Link | Product |
|---|---|
| `amzn.to/4rRoziQ` | **WHOOP** |
| `amzn.to/4aF93jj` | **Oura Ring** |
| `amzn.to/4aF8l5D` | **Garmin** |
| `amzn.to/3ZPkHDc` | **Fitbit / Pixel** |
| `amzn.to/3PUMS23` | **Samsung Galaxy Watch** |
| `amzn.to/4rqpdnL` | **Polar** |
| `amzn.to/4rkOv6I` | **Coros** |
| `amzn.to/4fZD5Cx` | **Suunto** |
| `amzn.to/4rUcGst` | **Apple Watch** |
| `amzn.to/4fHVnYW` | **Amazfit** (new) |
| `amzn.to/4e5fGyj` | **RingConn** (new) |
| — | **Ultrahuman** — not on Amazon, no link |

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

### `kygo-staying-asleep-factors.js`
Wired up 2026-06. Supplement/food links **reuse** the same products as the other factor pages
(same physical item = same link); **Earplugs, Medium-Firm Mattress, and the Sleep Mask are new.**
Rendered via the `_affiliateChips()` helper (a factor's `affiliate` may be a single object or an
array), so the markup appears in all three views (chart / list / qualitative).
| Link | Product label | Line |
|---|---|---|
| `amzn.to/4uL7b1p` | Dietary Fiber Supplement | 68 |
| `amzn.to/3PXqKEh` | Tart Cherry Juice | 119 |
| `amzn.to/403ZgOP` | Ashwagandha Extract | 142 |
| `amzn.to/3PWfatc` | Glycine Powder | 153 |
| `amzn.to/3Nbjq6C` | Magnesium Glycinate | 164 |
| `amzn.to/3OEoHEh` | L-Theanine 200mg | 175 |
| `amazon.com/dp/B07PRG2CQY?...tag=kygohealthapp-20` | Sleep Mask (new, full-URL Amazon link) | 260 |
| `amzn.to/4vGyQk9` | Earplugs (new) | 271 |
| `amzn.to/40gYtKD` | CO₂ Monitor | 282 |
| `amzn.to/4urzyRc` | Medium-Firm Mattress (new) | 293 |

*(Melatonin (immediate-release) and Valerian Root intentionally have **no** affiliate link — the
page states both have no objective WASO benefit, so promoting a product on those rows would be
bad-faith placement.)*

### `kygo-recovery-scores.js` (supplement factors)
Wired up 2026-06. Each supplement factor in the explorer carries an `amazon:{url,label}` that
renders a "… on Amazon" button in the expanded card (`rel="noopener sponsored"` + per-link
disclosure), plus a site-wide Amazon Associates disclosure in the page footer. All **reuse**
existing product slugs. **Saffron and Chamomile are new links (added 2026-06)**; the
consolidated weak-tier still has no button (it is the "don't rely on" line, deliberately
not promoted).
| Short link | Product label |
|---|---|
| `amzn.to/3Nbjq6C` | Magnesium Glycinate |
| `amzn.to/3PWfatc` | Glycine Powder |
| `amzn.to/3PXqKEh` | Tart Cherry Juice |
| `amzn.to/3OEoHEh` | L-Theanine 200mg |
| `amzn.to/403ZgOP` | Ashwagandha Extract |
| `amzn.to/4cVnvGt` | Omega-3 Fish Oil |
| `amzn.to/4szGon9` | Melatonin Supplement |
| `amzn.to/406okEX` | Beetroot Juice Shots (dietary nitrate) |
| `amazon.com/dp/B097TKQSQD?…tag=kygohealthapp-20` | Saffron Extract (new — full tagged URL, no `amzn.to` slug) |
| `amzn.to/3S5tosv` | Chamomile Extract (new) |

### `kygo-supplements-by-metric.js` (supplement × metric explorer)
Added 2026-06. The metric-filtered supplement explorer. Each supplement carries a single
`amazon:{url,label}`; the "… on Amazon" button renders in the expanded card **only when the
selected metric's grade is S / M / W** (i.e. the supplement actually helps that metric) — so
null/✗ and mixed (~) rows never show a buy button, and "don't-rely-on" supplements
(valerian, CBD, creatine, potassium, etc.) carry no link at all. Plus the footer Amazon
Associates disclosure. **All links reuse existing product slugs** — no new slugs introduced.
Magnesium L-threonate has **no button** (no existing slug; would need a client-supplied link).
| Short link | Product label |
|---|---|
| `amzn.to/4cVnvGt` | Omega-3 Fish Oil |
| `amzn.to/3Nbjq6C` | Magnesium Glycinate |
| `amzn.to/3PWfatc` | Glycine Powder |
| `amzn.to/403ZgOP` | Ashwagandha Extract |
| `amzn.to/4szGon9` | Melatonin Supplement |
| `amzn.to/3OyDz7c` | GABA Supplement |
| `amzn.to/3OEoHEh` | L-Theanine 200mg |
| `amzn.to/3PXqKEh` | Tart Cherry Juice |
| `amazon.com/dp/B097TKQSQD?…tag=kygohealthapp-20` | Saffron Extract (full tagged URL, no `amzn.to` slug) |
| `amzn.to/3S5tosv` | Chamomile Extract |
| `amzn.to/406okEX` | Beetroot Juice Shots (dietary nitrate) |
| `amzn.to/4cm6d5m` | Vitamin D3 |
| `amzn.to/4lbwIg3` | Vitamin B12 |
| `amzn.to/4760BIN` | Zinc Picolinate |
| `amzn.to/4rM2eDY` | Daily Multivitamin |
| — | Magnesium L-threonate — no slug yet (ask client); PeptiSleep / passionflower / valerian / CBD / creatine / potassium / L-arginine / chromium / oat-bran / tryptophan / 5-HTP — no link by design |

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
- Refersion's `cdn.refersion.com/creative.js` renders the creative into `#rfsn_img_125599`
  (creative `125599-3f2d…`, `aid: 9131461.c81405e`). Because `creative.js` targets a real DOM
  element by id (can't reach shadow DOM), the banner is appended to **light DOM** and projected
  into the layout via `<slot name="hlth-ad">`.
- **Sized small:** the slotted host is capped at **`max-width: 360px`, centered** so the creative
  doesn't blow up to the full 1200px section width (the blog column constrains its banner naturally;
  this tool section does not).
- The Refersion-injected `<a>` is tagged via `MutationObserver` with `rel="sponsored nofollow
  noopener"` + `target="_blank"` once it appears.
- Affiliate attribution is handled **on Refersion's side** via the `aid`; the visible link is the
  generated creative link (falls back to `https://gethlth.com/?rfsn=9131461.c81405e&utm_source=refersion&utm_medium=affiliate&utm_campaign=oura_ring_comparison`).
- **FTC disclosure:** an italic paid-partnership line sits directly below the banner ("Affiliate
  link. If you buy through this banner, Kygo may earn a commission at no extra cost to you.") —
  matching the blog placement. HLTH Code is **not** covered by the footer's Amazon-Associate line
  (Refersion, not Amazon), so the banner carries its own disclosure. Per HLTH Code's affiliate terms
  this is a **referral-link** placement on owned editorial content (allowed) — **not** PPC "direct
  linking" and **not** a promo-code share, both of which their terms prohibit.
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
