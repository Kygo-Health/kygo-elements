# Assets & URL Inventory (images, logos, fonts, CDNs, citations)

> Every **image/logo asset** and remaining **URL** referenced by the components, and what each is.
> Internal links, app-store links, and affiliate links are covered in their own docs:
> `internal-and-app-store-links.md` and `affiliate-links.md`. This doc covers **everything else**:
> images/logos, fonts, CDNs, the analytics loader URL, and external research/citation links.

## Image hosting & conventions

- **All images are hosted on Wix media:** `https://static.wixstatic.com/media/273a63_<hash>~mv2.png`
  (the `273a63_` prefix is the Wix site's media namespace; `~mv2.png` is Wix's media format).
- Images are referenced **raw** in markup (`<img src>`) or in data objects (`imageUrl`, `logo`,
  device-image maps). Many use graceful degradation: `onerror="this.style.display='none'"` and
  `loading="lazy"`.
- **199 total** image references across the components, resolving to **~22 unique assets**.

---

## 1. Brand / logo assets

Small brand logos, used in headers, footers, and "connect your wearable" sections.

| Asset (hash) | What it is | Usage |
|---|---|---|
| `273a63_7ac49e91323749f49cadfe795ff3680f` | **Kygo Health logo** (primary) | 37 refs — site header/footer **and** the `logo` in every JSON-LD Organization block |
| `273a63_d0b94a6b9cb54aff93a61cb4f2229b21` | **Kygo logo** (glossy 3D render of the same mark) | only `kygo-sensor-comparison.js` (alt="Kygo") — QA-confirmed same logo, not wrong |
| `273a63_56ac2eb53faf43fab1903643b29c0bce` | **Oura Ring** logo | 22 refs (connect-wearable rows, Oura comparison table head) |
| `273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7` | **Health Connect** logo | connect-wearable rows. Still used editorially as the WHOOP `imageUrl`/`whoopImg` in the comparison pages (`kygo-fitbit-air-vs-whoop.js` hero + tables, `kygo-vo2max-accuracy.js` etc.) — a pre-existing mislabel left in place |
| `273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e` | **Google Health** logo | 21 refs — replaced the Whoop badge in every "Works with" / "Connect your wearable" integration strip (2026-07) |
| `273a63_c451e954ff8740338204915f904d8798` | **Fitbit** logo | 20 refs |
| `273a63_1a1ba0e735ea4d4d865c04f7c9540e69` | **Apple / Apple Health** logo | 20 refs |
| `273a63_0a60d1d6c15b421e9f0eca5c4c9e592b` | **Garmin** logo | 18 refs |
| `273a63_0c0e48cc065d4ee3bf506f6d47440518` | **Whoop** logo | **Retired (2026-07)** — the Whoop wordmark badge in the integration strips was swapped to the Google Health logo; this asset is no longer referenced anywhere |

## 2. Device product images

Larger device photos, used in comparison tables and device cards.
`kygo-wearable-stress.js` defines the canonical map in `_deviceImage(key)`.

| Asset (hash) | Device | Notes |
|---|---|---|
| `273a63_68b4900c356b4d0c8982e5ecd10f04fe` | **Apple Watch** (S10 / Ultra 3) | shared for both Apple Watch models in sensor-comparison |
| `273a63_c545c093c04d4ca4ade77e5ca43fd433` | **Garmin** | |
| `273a63_c12bab319dc34737a386c7449f5f92c7` | **Fitbit** (Charge 6) | |
| `273a63_722e50e1a554453eb4c71a2e7a58925d` | **Oura Ring** (Ring 4) | |
| `273a63_21fd42e4a5d1459bb6db751a0ea5e161` | **Samsung Galaxy Watch** | |
| `273a63_c52aaaca1f7243f3818cf51d9374dbd4` | **WHOOP** (product) | distinct from the Whoop *logo* above |
| `273a63_e7e3c05ed0bc4cec8f456cd7f995e70b` | **Polar** | `kygo-wearable-stress.js` only |
| `273a63_b86aaa1f1b5b43a4a8ccc8294293e193` | **COROS** | `kygo-wearable-stress.js` only |
| `273a63_0bf2273473c849a98d9fc92b6ccea514` | **Suunto** | `kygo-vo2max-accuracy.js`, `kygo-recovery-scores.js` |
| `273a63_7b9a43c26540413586d185a889fa853c` | **Google Pixel Watch** | `kygo-wearable-stress.js` only |
| `273a63_01b29289863b4cd5844d575301addb6a` | **Amazfit** | `kygo-wearable-stress.js`, `kygo-recovery-scores.js` |
| `273a63_810650aa12fe4ae59ce7e22c25c312fc` | **Ultrahuman** | `kygo-recovery-scores.js`, `kygo-oura-ring-comparison.js` (cost calculator rival) |
| `273a63_fc0ed00ac88441138f7b4c7e398f7aa8` | **RingConn** | `kygo-recovery-scores.js`, `kygo-oura-ring-comparison.js` (cost calculator rival) |

The Oura comparison table (`kygo-oura-ring-comparison.js`) uses the **Oura logo**
(`56ac2eb5`) for all three rings (Gen 3 / Ring 4 / Ring 5) rather than per-ring photos.

## 3. Dynamic / templated images

- **Blog post images** — `kygo-blog-post.js:286` builds Wix media URLs at runtime from a matched
  ID: `` `https://static.wixstatic.com/media/${m[1]}` `` (image comes from blog data passed by the
  Wix host, not a hardcoded asset).

---

## 4. Fonts (Google Fonts via `@import`)

Loaded at the top of each component's `<style>` block. Two near-identical variants exist:

| URL | Used by |
|---|---|
| `https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap` | newer pages (incl. weight 700) |
| `https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap` | older pages (no DM Sans 700) |

Families: **DM Sans** (body) + **Space Grotesk** (headings). `fonts.gstatic.com` is pulled in
transitively by the stylesheet.

## 5. CDN / deploy URLs

- **jsDelivr** — `https://cdn.jsdelivr.net/gh/Kygo-Health/kygo-elements@<branch>/<file>.js`
  (the CDN the components ship from; referenced in `test-stress.html` and the preview template).

## 6. Analytics URL

- **Google Tag Manager / gtag.js** — `https://www.googletagmanager.com/gtag/js?id=<GA_ID>`,
  loaded only by `kygo-tracking.js`. Full analytics detail in `docs/schemas-and-tracking.md`.

---

## 7. External research / citation links

Editorial source links behind the evidence-based content (factor cards, accuracy stats, FAQ
answers). **~345 unique external URLs** across the content pages. These are **citations, not
affiliate or nav links.** By domain (top sources):

| Domain | ~Count | What it is |
|---|---|---|
| `pmc.ncbi.nlm.nih.gov` | 186 | PubMed Central — full-text studies |
| `pubmed.ncbi.nlm.nih.gov` | 138 | PubMed — study abstracts |
| `sciencedirect.com` | 24 | Elsevier journals |
| `nature.com` | 20 | Nature journals |
| `ouraring.com` / `support.ouraring.com` | 17 / 9 | Oura official + support docs |
| `whoop.com` / `support.whoop.com` | 11 / 6 | WHOOP official + support (editorial, **not** the `join.whoop.com` affiliate) |
| `mdpi.com`, `onlinelibrary.wiley.com`, `ahajournals.org`, `frontiersin.org`, `academic.oup.com`, `link.springer.com`, `tandfonline.com`, `journals.sagepub.com`, `mhealth.jmir.org`, `journals.plos.org`, `imrpress.com` | 4–10 each | Peer-reviewed journals |
| `garmin.com`/`support.garmin.com`, `apple.com`, `support.google.com`, `samsung.com`, `fitbit.com`, `us.amazfit.com`, `ringconn.com`, `coros.com`, `polar.com` | a few each | Manufacturer official/support pages |
| `the5krunner.com`, `dcrainmaker.com`, `wareable.com`, `tomsguide.com`, `techcrunch.com`, `9to5mac.com`, `androidpolice.com` | a few each | Wearables press / reviews |

**Pages carrying citation links:** `kygo-calorie-burn-accuracy.js`, `kygo-deep-sleep-factors.js`,
`kygo-faq-section.js`, `kygo-hrv-factors.js`, `kygo-rhr-factors.js`,
`kygo-sleep-latency-factors.js`, `kygo-staying-asleep-factors.js`, `kygo-wearable-accuracy.js`,
`kygo-wearable-stress.js`. Stored in factor data as
`source: { url, label }` and surfaced as in-page source links / JSON-LD `citation`.

---

## ✅ Closed by browser QA (2026-06)

1. **Whoop image** — the WHOOP card on `/tools/sensor-comparison` renders the correct WHOOP logo
   live; not the wrong asset. *(Residual: the same `46b3b6ce` asset is also labeled "Health
   Connect" — worth a one-time glance that the Health Connect logo rows look right. Tracked as #10
   in `fixes-and-issues.md`.)*
2. **Two Kygo logo assets** — confirmed the **same** brand mark; `d0b94a6b` is just a glossy 3D
   render of `7ac49e91`. Not wrong; no action.

## ⚠️ Still open

3. **Hosting coupling:** every image is a Wix `static.wixstatic.com` URL tied to site namespace
   `273a63_`. If the Wix site/media library changes, these hardcoded URLs break across all
   components with no fallback beyond `onerror` hide. No local/CDN copy exists in this repo. (Info.)
4. **Font `@import` drift:** two slightly different Google Fonts URLs (one includes DM Sans 700,
   one doesn't). Pick one to avoid an extra stylesheet fetch and inconsistent heading weights.
