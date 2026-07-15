# Wix Global Custom Code (head + header/footer + site JSON-LD) — Reference

> The Kygo site is built on **Wix**. Besides the `kygo-*.js` Custom Elements (this repo) and the
> **Velo** page/backend code (`wix-velo-code.md`), the site also injects **global custom code** via
> Wix's **Settings → Custom Code** (head/body embeds) and the **site header/footer**. That code is
> **not** a component and lives **only in the Wix editor** — nothing else in this repo references it.
>
> This file is a **version-controlled mirror** of those snippets so we have a recoverable copy and a
> single place to audit links/tracking/schema. **Editing this file does not change the live site** —
> update the Wix editor, then mirror the change here. Keep it in sync.
>
> Last mirrored: **2026-06-02** (from the live site, pasted by owner).

## Where each block lives in Wix

| # | Wix slot (Custom Code / header / footer) | Block name | What it is |
|---|---|---|---|
| 1 | Head | **Custom** | Google Fonts `preconnect` + stylesheet (`DM Sans`, `Space Grotesk`) |
| 2 | Head | **JSON-LD Structured Data** | `SoftwareApplication` schema (standalone) |
| 3 | Head | **Homepage JSON-LD Schema** | `@graph`: `Organization` + `SoftwareApplication` + `WebSite` |
| 4 | Head | **Kygo GA4 Tracking** | loads `kygo-tracking.js` with `data-ga-id` |
| 5 | Body – start | **Kygo Custom Header** | fixed nav bar (logo, links, iOS/Android CTAs, mobile menu) |
| 6 | Body – end | **Kygo Custom Footer** | dark footer (brand, socials, link columns, CTAs, legal disclaimer) |

> Blocks 5 & 6 are full HTML/CSS/JS embeds (not Shadow DOM) — their `.kygo-nav-*` / `.kygo-footer-*`
> classes are **global** and could collide with page CSS, so keep the `kygo-` prefixes.

---

## Canonical values these blocks must match

These are the repo-wide canonical values (see `internal-and-app-store-links.md`,
`assets-and-urls.md`, `schemas-and-tracking.md`). The global code should agree with them:

| Thing | Canonical value |
|---|---|
| Logo asset | `https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png` |
| Apple App Store | `https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589` (tool pages). **Header/footer + kygo-home store buttons now use the Tenjin iOS link `https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy`** → App Store. |
| Android download | `https://www.kygo.app/android` (redirect; still used by tool pages). **Header/footer + kygo-home store buttons now use the Tenjin Android link `https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO`** → Play Store. |
| Host | `https://www.kygo.app` (normalized to `www`; see fixes #15) |
| Privacy / Terms / Accessibility | `/privacy-policy`, `/terms-conditions`, `/accessibility-statement` |
| Org name (schema) | `Kygo Health` (components) / `Kygo Health LLC` (site graph + legal) |
| Support email (components/schema) | `support@kygo.app` |
| GA4 measurement ID | `G-P2224N75KY` |
| Fonts | `DM Sans` (400–700) + `Space Grotesk` (500–700) |

---

## Block 1 — Head: Fonts (`Custom`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
```

- Loads the brand fonts site-wide via `<link>` (the components additionally `@import` their own copy
  inside each Shadow DOM, so they don't depend on this).
- ⚠️ **Font drift:** this loads `DM Sans:wght@400;500;600` — the **older** variant **without 700**.
  The repo standardized component `@import`s on `…400;500;600;700` (fixes #11). The global
  header/footer don't use DM Sans 700 (their bold logo text is `Space Grotesk` 700, which **is**
  loaded), so nothing visibly breaks — but for consistency, add `;700` here too.

## Block 2 — Head: `SoftwareApplication` (`JSON-LD Structured Data`)

```json
{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Kygo Health","applicationCategory":"HealthApplication","operatingSystem":"iOS","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"aggregateRating":{"@type":"AggregateRating","ratingValue":"5","ratingCount":"30"},"description":"Connect your health wearables with nutrition tracking to reveal personalized correlations between what you eat and how you feel. See how food affects your sleep, energy, and recovery.","url":"https://www.kygo.app","author":{"@type":"Organization","name":"Kygo Health LLC","url":"https://www.kygo.app"}}
```

## Block 3 — Head: Homepage `@graph` (`Homepage JSON-LD Schema`)

`@graph` of three entities (formatted here for readability; ship minified):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://kygo.app/#organization",
      "name": "Kygo Health LLC",
      "url": "https://kygo.app",
      "logo": { "@type": "ImageObject", "url": "https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png" },
      "description": "Health technology company that correlates nutrition data with biometric data from wearables to provide personalized health insights.",
      "email": "support@kygo.app",
      "foundingDate": "2024",
      "sameAs": ["https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589"]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://kygo.app/#software",
      "name": "Kygo",
      "alternateName": "Kygo Health App",
      "description": "Kygo connects your wearables with nutrition tracking to reveal personalized correlations between what you eat and how your body responds—including sleep quality, HRV, energy, and recovery.",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "iOS",
      "url": "https://kygo.app",
      "downloadUrl": "https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589",
      "screenshot": "https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png",
      "softwareVersion": "1.0",
      "author": { "@id": "https://kygo.app/#organization" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "description": "Free tier with optional premium at $9.99/month or $39.99/year" },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "ratingCount": "1", "bestRating": "5", "worstRating": "1" },
      "featureList": [
        "Correlates nutrition with sleep, HRV, and recovery data",
        "Integrates with Oura Ring, Apple Health, Fitbit, and Garmin",
        "AI-powered food logging via photo, voice, barcode, or text",
        "5M+ food database",
        "Personalized health insights based on your data",
        "23+ micronutrient tracking",
        "Meal templates for one-tap logging",
        "Patent-pending correlation technology"
      ],
      "keywords": "nutrition tracking, wearable integration, health correlations, sleep tracking, HRV, Oura Ring app, Apple Health, food logging, personalized nutrition, health insights"
    },
    {
      "@type": "WebSite",
      "@id": "https://kygo.app/#website",
      "url": "https://kygo.app",
      "name": "Kygo",
      "description": "See how your food affects your sleep, energy, and recovery",
      "publisher": { "@id": "https://kygo.app/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://kygo.app/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
```

## Block 4 — Head: GA4 tracking (`Kygo GA4 Tracking`)

```html
<script src="https://kygo-health.github.io/kygo-elements/kygo-tracking.js" data-ga-id="G-P2224N75KY"></script>
```

- Loads **`kygo-tracking.js`** (this repo) from **GitHub Pages** (default branch) with the live GA4
  ID **`G-P2224N75KY`**. ✅ Matches the documented ID.
- The script reads `script[data-ga-id]`, bootstraps `gtag.js`, and fires `page_view` + classified
  `cta_click` / `tool_interaction` / `page_exit`. See `schemas-and-tracking.md` Part 2.
- **Header/footer CTA tracking:** the store buttons now point at **Tenjin attribution links**
  (iOS `track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy`, Android
  `track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO`). `kygo-tracking.js` classifies them by
  `href`: the iOS link (and any `apps.apple.com` link) → `ios_download`; the Android link
  (and any `kygo.app/android` link) → `android_download`. The Android buttons also carry
  `class="cta-android"` + `data-action="android-download"`, so they classify even without the
  href match. So both download CTAs **are** tracked even though their wrapper classes
  (`kygo-nav-cta*`, `kygo-footer-cta*`) aren't in the tracker's class list. Plain nav links
  (How It Works / FAQ / Blog / Tools / Contact) are **not** tracked (no class/`data-action`/match) —
  intentional/acceptable.
- Not version-pinned or cache-busted (relies on GitHub Pages caching). Fine for a global include.

## Block 5 — Body-start: Custom Header

Fixed top nav rendered into `<div id="kygo-header-root">` by an IIFE. Key facts:

- **Logo** → `https://www.kygo.app/` · asset = canonical logo. Wordmark: `KYGO HEALTH`.
- **Nav links:** `/how-it-works`, `/faq`, `/blog`, `/tools`, **`/contact-8`**.
- **iOS CTA** → `https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy` (Tenjin → App Store, `target=_blank`).
- **Android CTA** → `https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO` (Tenjin → Play Store).
- Mobile menu mirrors the same links + both download CTAs; hamburger toggles via global
  `toggleKygoMobile()` / `closeKygoMobile()`; scroll adds `.scrolled` shadow to `#kygo-nav`.
- `z-index: 99999`; `.kygo-nav-spacer` (70px) offsets the fixed bar.

## Block 6 — Body-end: Custom Footer

Dark footer rendered into `<div id="kygo-footer-root">` by an IIFE. Key facts:

- **Logo** → `https://www.kygo.app/` · wordmark `KYGO`.
- **Socials:** Facebook `https://www.facebook.com/profile.php?id=61586603470107` ·
  Reddit `https://www.reddit.com/user/KygoApp/` · X `https://x.com/KygoApp`.
  *(These are the only place social URLs appear — not in any component. Recorded here as canonical.)*
- **Contact:** `Jersey City, NJ` · email **`ryan@kygo.app`** (`mailto:`).
- **Product col:** `/how-it-works`, `/faq`, iOS (Tenjin link), Android (Tenjin link).
- **Resources col:** `/blog`, `/tools`, **`/contact-8`**.
- **CTA col:** iOS (Tenjin link) + Android (Tenjin link) buttons.
- **Legal:** `/privacy-policy`, `/terms-conditions`, `/accessibility-statement`. ✅ matches fixes #3.
- **Disclaimer:** "© **2025** by KYGO Health LLC … not intended to diagnose, treat, cure, or prevent
  any disease … consult your physician."

---

## Review findings (2026-06-02)

### ✅ Correct
- Logo asset matches canonical value. Store buttons now route through **Tenjin attribution links**
  (iOS `…/cD7zgIPLuiZMMWmWkXLsvy`, Android `…/eMjS3ZkseCvs2lO9AVESkO`) — trial-first launch 2026-07-14.
- Privacy / Terms / Accessibility paths are the corrected ones (`-policy` / `-conditions` / `-statement`).
- GA4 ID `G-P2224N75KY` is correct; both header & footer download CTAs are GA-tracked via `href` match.
- Legal/medical disclaimer present in the footer.

### ⚠️ Needs owner decision (can't verify from code — values disagree across sources)
1. **Conflicting `aggregateRating` (SEO risk).** Two `SoftwareApplication` entities ship in the
   head with **different** ratings: Block 2 = `ratingCount 30`, Block 3 = `ratingCount 1` (both
   `ratingValue 5`). Google can ignore or penalize inconsistent/duplicate `aggregateRating`.
   **Recommend:** keep **one** `SoftwareApplication` block (fold Block 2 into the Block 3 `@graph`),
   with a single honest `ratingValue`/`ratingCount` backed by real reviews.
2. **Support email mismatch.** Footer shows **`ryan@kygo.app`**; the Organization schema and all
   components use **`support@kygo.app`** (`partnerships@kygo.app` also exists). Pick one public
   address and use it consistently.
3. **Contact path mismatch.** Header & footer link **`/contact-8`**; every component + the docs use
   **`/contact`** (10 refs, none use `/contact-8`). Confirm the real slug, then normalize the other
   side (likely make components match the live Wix slug, or add a Wix redirect).

### 🔧 Recommended fixes (low-risk, in the Wix editor)
4. **Host normalization.** Block 3's `@graph` uses bare **`https://kygo.app`** for `url` /
   `downloadUrl` / `WebSite`; repo standard is **`www.kygo.app`** (fixes #15). `@id` strings can stay
   as opaque IDs, but the user-facing `url`/`downloadUrl` should be `www`.
5. **`SearchAction` target.** Block 3 `WebSite.potentialAction` points at
   `https://kygo.app/search?q={search_term_string}`. Verify a working `/search` page exists — if not,
   remove the `potentialAction` (an invalid sitelinks searchbox does nothing / can confuse crawlers).
6. **`screenshot` = logo.** Block 3's `SoftwareApplication.screenshot` reuses the **logo** URL, not an
   actual app screenshot. Point it at a real screenshot or drop the field.
7. **Font import:** add `;700` to the DM Sans `<link>` (Block 1) to match the repo standard.
8. **Copyright year:** footer says **© 2025**; it's 2026. Use the current year (or `2024–2026`).
9. **`operatingSystem: "iOS"`** is accurate (only the iOS app exists; Android is a `/android`
   redirect/waitlist) — leave as-is, but revisit when the Android app ships.

### ℹ️ Minor / optional
- Hamburger control is a `<div onclick=…>` with no `role="button"`/`aria-label`/keyboard handler —
  add for a11y if revising.
- Header/footer use global (non-Shadow-DOM) `.kygo-*` classes — keep the prefixes to avoid Wix CSS
  collisions.

> When any of the above is changed in the Wix editor, update this file (and `fixes-and-issues.md` if
> it was a tracked issue) so the mirror stays accurate.

---

## Corrected blocks — decided 2026-06-02 (⏳ pending paste into Wix)

Owner decisions: email → **`support@kygo.app`**; contact slug → **`/contact`**; rating →
**removed** (App Store reviews can't be marked up here per Google policy — re-add only when genuine
reviews are displayed on-page). Once these are pasted into the Wix editor, move the **Block 2/3**
above to match and mark issues #18–25 closed.

**Block 1 — fonts `<link>`** (add `;700`):
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
```

**Block 2 — delete** the standalone `SoftwareApplication` "JSON-LD Structured Data" block (the
duplicate carrying the conflicting `ratingCount`).

**Block 3 — replace** "Homepage JSON-LD Schema" with the consolidated `@graph` (host → `www`,
`screenshot` + `aggregateRating` removed, `support@kygo.app`):
```html
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://www.kygo.app/#organization","name":"Kygo Health LLC","url":"https://www.kygo.app","logo":{"@type":"ImageObject","url":"https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png"},"description":"Health technology company that correlates nutrition data with biometric data from wearables to provide personalized health insights.","email":"support@kygo.app","foundingDate":"2024","sameAs":["https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589"]},{"@type":"SoftwareApplication","@id":"https://www.kygo.app/#software","name":"Kygo","alternateName":"Kygo Health App","description":"Kygo connects your wearables with nutrition tracking to reveal personalized correlations between what you eat and how your body responds—including sleep quality, HRV, energy, and recovery.","applicationCategory":"HealthApplication","operatingSystem":"iOS","url":"https://www.kygo.app","downloadUrl":"https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589","softwareVersion":"1.0","author":{"@id":"https://www.kygo.app/#organization"},"offers":{"@type":"Offer","price":"0","priceCurrency":"USD","description":"Free tier with optional premium at $9.99/month or $39.99/year"},"featureList":["Correlates nutrition with sleep, HRV, and recovery data","Integrates with Oura Ring, Apple Health, Fitbit, and Garmin","AI-powered food logging via photo, voice, barcode, or text","5M+ food database","Personalized health insights based on your data","23+ micronutrient tracking","Meal templates for one-tap logging","Patent-pending correlation technology"],"keywords":"nutrition tracking, wearable integration, health correlations, sleep tracking, HRV, Oura Ring app, Apple Health, food logging, personalized nutrition, health insights"},{"@type":"WebSite","@id":"https://www.kygo.app/#website","url":"https://www.kygo.app","name":"Kygo","description":"See how your food affects your sleep, energy, and recovery","publisher":{"@id":"https://www.kygo.app/#organization"},"potentialAction":{"@type":"SearchAction","target":"https://www.kygo.app/search?q={search_term_string}","query-input":"required name=search_term_string"}}]}</script>
```
- ⚠️ `potentialAction`/SearchAction **removed** (confirmed 2026-06 there is no `/search` page).
- To re-add a rating later (real on-page reviews only), insert after `"softwareVersion":"1.0",`:
  `"aggregateRating":{"@type":"AggregateRating","ratingValue":"5","ratingCount":"N","bestRating":"5","worstRating":"1"},`

**Block 5 — header** (`<script>`): replace both `https://www.kygo.app/contact-8` → `https://www.kygo.app/contact`.

**Block 6 — footer** (`<script>`):
- `https://www.kygo.app/contact-8` → `https://www.kygo.app/contact`
- `mailto:ryan@kygo.app">ryan@kygo.app` → `mailto:support@kygo.app">support@kygo.app`
- `© 2025 by KYGO Health LLC` → `© 2026 by KYGO Health LLC`

**Block 4 — GA tracking:** no change.

> 📋 **Full, paste-ready source for every block lives in `wix-snippets/`** (one file per Wix slot) —
> see `wix-snippets/README.md`. Paste those directly; the find/replaces above are just what changed.
</content>
