# Structured Data (Schemas) & Tracking / Analytics

> Reference for the **JSON-LD schemas** each component injects and all **tracking/analytics**
> in the repo. Use this when adding/editing a page so schema markup and event tracking stay
> consistent. See `CLAUDE.md` for the component anatomy.

---

# Part 1 — Structured Data (JSON-LD)

## How it's injected (the pattern)

Every content component implements `_injectStructuredData()`, called once from
`connectedCallback()`. Conventions:

- Injected into **`document.head`** (not the shadow root) as `<script type="application/ld+json">`.
- **Guarded by a unique marker attribute** `data-kygo-<name>-ld` so it's injected only once even
  if the element re-renders or appears twice: `if (document.querySelector('script[data-kygo-<name>-ld]')) return;`
- Pages that emit **multiple** schema objects build an array and loop, appending one `<script>`
  each (all sharing the same marker):
  ```js
  [ld, faq, breadcrumb].forEach(data => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-kygo-<name>-ld', '');
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  });
  ```
- All `url`/`item` values point at the real `https://www.kygo.app/...` page.
- The **publisher/author** is always the `Kygo Health` Organization block (see below).

## Per-page schema map

| File | Marker | Schemas injected |
|---|---|---|
| `calories-custom-element.js` | `data-kygo-food-scanner-ld` | WebApplication, Offer, FAQPage (Q&A), Organization |
| `kygo-bundle.js` | `data-kygo-org-ld`, `data-kygo-bundle-ld` | Organization, SoftwareApplication, Offer, ContactPoint |
| `kygo-hiw-bundle.js` | `data-kygo-hiw-ld` | HowTo + HowToStep |
| `kygo-contact.js` | `data-kygo-contact-ld` | ContactPage, Organization, ContactPoint |
| `kygo-tools.js` | `data-kygo-tools-ld` | CollectionPage, ItemList, ListItem, Organization |
| `kygo-blog.js` | `data-kygo-blog-ld` | CollectionPage, Organization, ImageObject |
| `kygo-calorie-burn-accuracy.js` | `data-kygo-calorie-burn-ld` | WebApplication, **HowTo + HowToStep + HowToTool**, FAQPage, BreadcrumbList, **7× ScholarlyArticle**, Offer, Organization |
| `kygo-step-count-accuracy.js` | `data-kygo-step-ld` | WebApplication, FAQPage (7 Q&A), BreadcrumbList, Offer, Organization |
| `kygo-wearable-accuracy.js` | `data-kygo-wearable-ld` | WebApplication, FAQPage, BreadcrumbList, **MedicalScholarlyArticle**, Offer, Organization |
| `kygo-wearable-stress.js` | `data-kygo-stress-ld` | WebApplication, FAQPage (11 Q&A), BreadcrumbList, Offer, Organization |
| `kygo-recovery-scores.js` | `data-kygo-recovery-ld` | WebApplication, FAQPage (8 Q&A — **also rendered visibly**), BreadcrumbList, Offer, Organization. FAQ JSON-LD is built from the same `_faqs()` getter that the visible `<details>` accordion renders, so schema and page never drift. WebApplication `name` = "Recovery Score Explorer", `url` = `/tools/recovery-score-explorer`. |
| `kygo-hrv-factors.js` | `data-kygo-hrv-factors-ld` | WebApplication, FAQPage, BreadcrumbList, Offer, Organization |
| `kygo-rhr-factors.js` | `data-kygo-rhr-factors-ld` | WebApplication, FAQPage, BreadcrumbList, Offer, Organization |
| `kygo-sleep-latency-factors.js` | `data-kygo-sleep-latency-factors-ld` | WebApplication, FAQPage, BreadcrumbList, Offer, Organization |
| `kygo-staying-asleep-factors.js` | `data-kygo-staying-asleep-factors-ld` | WebApplication, FAQPage, BreadcrumbList, Offer, Organization |
| `kygo-deep-sleep-factors.js` | `data-kygo-deep-sleep-factors-ld` | FAQPage, BreadcrumbList *(WebApplication intentionally site-level)* |
| `kygo-sleep-metrics.js` | `data-kygo-sleep-ld` | WebApplication, BreadcrumbList, Offer, Organization *(FAQPage intentionally site-level)* |
| `kygo-sensor-comparison.js` | `data-kygo-sensor-comparison-ld` | WebApplication, FAQPage, BreadcrumbList, Offer, Organization |
| `kygo-oura-ring-comparison.js` | `data-kygo-oura-ld` | WebApplication, FAQPage, BreadcrumbList, Offer, Organization |
| `kygo-fitbit-air-vs-whoop.js` | `data-kygo-fitbitair-whoop-ld` | WebApplication, FAQPage, BreadcrumbList, Offer, Organization |
| `kygo-faq-section.js` | — | **none** (FAQPage intentionally site-level; empty `_injectStructuredData()`) |
| `kygo-blog-post.js` | — | **none** (5 post-page widget sub-components; post `BlogPosting`/`FAQPage` handled site-level) |

## Canonical schema shapes

**Tool pages** (the `*-factors`, `*-accuracy`, comparison pages) follow one template: a
`WebApplication` + a `FAQPage` + a `BreadcrumbList`, injected together.

```jsonc
// 1. WebApplication — the tool itself
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "<Tool Name>",
  "alternateName": "<keyword alias>",
  "description": "...",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web",
  "url": "https://www.kygo.app/tools/<slug>",
  "datePublished": "YYYY-MM-DD",
  "dateModified": "YYYY-MM-DD",
  "softwareVersion": "1.0",
  "inLanguage": "en",
  "isAccessibleForFree": true,
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author":    { "@type": "Organization", "name": "Kygo Health", "url": "https://www.kygo.app", "logo": "https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png" },
  "publisher": { "@type": "Organization", "name": "Kygo Health", "url": "https://www.kygo.app" },
  "featureList": "...",
  "keywords": "..."
}

// 2. FAQPage — visible Q&A on the page, mirrored as schema
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }
  ]
}

// 3. BreadcrumbList — Kygo Health › Tools › <Page>
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Kygo Health", "item": "https://www.kygo.app" },
    { "@type": "ListItem", "position": 2, "name": "Tools",       "item": "https://www.kygo.app/tools" },
    { "@type": "ListItem", "position": 3, "name": "<Page>",      "item": "https://www.kygo.app/tools/<slug>" }
  ]
}
```

**The Organization block** (reused as `author`/`publisher` everywhere):
```jsonc
{ "@type": "Organization", "name": "Kygo Health", "url": "https://www.kygo.app",
  "logo": "https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png" }
```

**HowTo** (calorie-burn + how-it-works pages) adds `HowTo` with positioned `HowToStep`s and an
optional `HowToTool`. **ScholarlyArticle / MedicalScholarlyArticle** (calorie-burn,
wearable-accuracy) cite the studies referenced on the page via `citation`. **ContactPage**
(contact) wraps an Organization with a `ContactPoint`. **Blog** uses `CollectionPage` (index)
and `BlogPosting`/`WebPage` (single post) with `ImageObject`.

## Schema notes & intentional omissions

Some pages **deliberately** skip a schema type to avoid injecting duplicate schema when multiple
components render on the same Wix page. These are **not bugs** — each carries an explicit comment
(`… managed via Wix site-level LD+JSON to avoid duplicate schema errors`):

1. **`kygo-faq-section.js`** — empty `_injectStructuredData() {}`; FAQPage is handled at the Wix
   site level.
2. **`kygo-deep-sleep-factors.js`** — injects FAQPage + BreadcrumbList only; WebApplication is
   site-level managed.
3. **`kygo-sleep-metrics.js`** — injects WebApplication + BreadcrumbList only; FAQPage is
   site-level managed.

Genuine notes to keep in mind:

4. **`kygo-blog-post.js`** sub-components (categories/related/subscribe/CTA) emit no schema — they're
   page *fragments*; the post `BlogPosting`/`FAQPage` is handled at the Wix site level. (The old
   `kygo-blog-page.js`, which carried a component-level `BlogPosting`, was orphaned and has been removed.)
5. `datePublished`/`dateModified` are hardcoded per file — keep `dateModified` current when editing.
6. New pages: scaffold via the `new-page` skill, then fill `_injectStructuredData()` with the
   right type and a unique `data-kygo-<name>-ld` marker.
7. Because each component guards only its **own** marker, two *different* components on one page each
   inject their own Organization/WebApplication — the site-level deferral above is how duplicates
   are avoided. Keep this in mind when composing multiple components on a single Wix page.

---

# Part 2 — Tracking & Analytics

## The only analytics: GA4 via `kygo-tracking.js`

There is **one** analytics integration — **Google Analytics 4 (gtag.js)** — loaded by the
separate, optional script **`kygo-tracking.js`**. No PostHog/Mixpanel/Segment/Meta Pixel/etc.
The individual components contain **no** `gtag`/`dataLayer` calls themselves; tracking is fully
delegated to this one script, which listens globally.

**How it loads** (embedded once on the Wix page, alongside the components):
```html
<script src="kygo-tracking.js" data-ga-id="G-XXXXXXXXXX"></script>
```
- Reads the GA4 measurement ID from the script tag's **`data-ga-id`** attribute.
- If `data-ga-id` is missing, it **logs events to the console only** (`[kygo-tracking] ...`) — a
  safe dev/preview fallback, no GA loaded.
- Bootstraps `gtag.js`, sets `window.dataLayer`/`window.gtag`, and calls
  `gtag('config', GA_ID, { send_page_view: true })` → automatic **`page_view`**.

**Shadow-DOM aware:** the click listener is attached at `document` in the **capture phase**
(`true`) and uses **`event.composedPath()`** to pierce shadow roots — this is why a single global
script can track clicks inside every web component. It also identifies the originating component
by walking the path for a registered custom-element tag (`customElements.get(...)`).

## Events sent to GA4

| Event | When | Key params |
|---|---|---|
| `page_view` | automatic on load (gtag config) | standard GA4 |
| `cta_click` | any classified `<a>`/`<button>`/`[data-action]` click | `cta_category`, `cta_label`, `cta_url`, `component`, `position`, `page_path` (+ `affiliate`, `affiliate_marketplace` for Amazon) |
| `tool_interaction` | calculate/compare/analyze buttons | `tool_name` (= component tag), `action`, `button_label` |
| `page_exit` | `visibilitychange` → hidden | `page_path` |
| `email_subscribe` **(key event)** | `subscribe` CustomEvent (newsletter form) → mirrored to GA4 | `lead_type` (`newsletter`), `component`, `source` (if present), `page_path` |
| `contact_submit` **(key event)** | `contactSubmit` CustomEvent (contact form) → mirrored to GA4 | `lead_type` (`contact_form`), `component`, `page_path`. **No PII** — email/name/message are never read from `detail` |
| `tool_result` | `kygo-calorie-calculation` CustomEvent (calculator produced a result) | `tool_name` (= component tag), `page_path` |

`cta_click` is bucketed by **`cta_category`**, derived in `classifyClick()` from the element's
`data-action`, `href`, and CSS classes:

| `cta_category` | Trigger |
|---|---|
| `ios_download` | `data-action="ios-download"`, or `href` contains `apps.apple.com`, or `.cta-primary` + apple href |
| `android_download` | `data-action="android-download"`, `.cta-android`, or `href` contains `kygo.app/android` |
| `see_how_it_works` | `.cta-secondary` or label contains "how it works" |
| `tool_interaction` | `data-action` = `calculate`/`compare`/`analyze`, or `.calculate-button` |
| `header_cta` | `.header-cta` (nav "Get Kygo App") |
| `blog_cta` | `.blog-cta-btn` |
| `primary_cta` | `.cta-primary` / `.cta-button-primary` / `.cta-btn` |
| `affiliate_amazon` | link hostname matches an Amazon marketplace (`amazon.<tld>`) or `amzn.to` short link. Also carries `affiliate: 'amazon'` + `affiliate_marketplace` (the host), and the click handler rewrites the href with a per-click `ascsubtag` (`<page-slug>_<component>`) for Associates-report attribution, preserving the existing `tag=` param |
| `other_action` | any other element with a `data-action` |
| `affiliate_banner` | **not** from `classifyClick()` — fired directly by `kygo-oura-ring-comparison.js` for the HLTH Code banner (see below) |

## How components opt into tracking

Tracking is **convention-based** — components don't call the tracker, they just use the right
**classes / attributes** and the global listener picks them up:

- **CSS classes**: `.cta-primary`, `.cta-android`, `.cta-secondary`, `.header-cta`,
  `.blog-cta-btn`, `.calculate-button`, etc.
- **`data-action="..."`** — explicit intent (`ios-download`, `android-download`, `calculate`,
  `compare`, `analyze`). Used in ~16 files (heaviest: `kygo-calorie-burn-accuracy.js`,
  `kygo-bundle.js`, `kygo-step-count-accuracy.js`).
- **`data-track-label`** — overrides the derived label (else falls back to `textContent`, ≤80 chars).
- **`data-track-position`** — sets `position` (default `'body'`), e.g. distinguishing hero vs footer.

> When adding a CTA you want tracked, give it one of the known classes or a `data-action`, and an
> optional `data-track-label` / `data-track-position`. No JS wiring needed.

### Exception: the HLTH Code affiliate banner (component-fired `cta_click`)

The one place a component fires GA4 **directly** rather than relying on the global listener is the
**HLTH Code** affiliate banner on `kygo-oura-ring-comparison.js` (`_setupAffiliateBanner()`). The
banner is a third-party **Refersion** dynamic creative (`creative.js` → `#rfsn_img_125599`) injected
into light DOM and slotted in — its `<a>` is generated asynchronously and carries no Kygo class, so
`classifyClick()` would bucket it as nothing. Instead the component attaches its own click handler
that calls `window.gtag('event', 'cta_click', …)` with:

| Param | Value |
|---|---|
| `cta_category` | `affiliate_banner` |
| `cta_label` | `HLTH Code` |
| `cta_url` | the actual generated Refersion link clicked (falls back to the `gethlth.com` referral URL) |
| `component` | `kygo-oura-ring-comparison` |
| `position` | `whats-changed` |
| `affiliate` | `hlth_code` |
| `affiliate_network` | `refersion` |

It reuses the **same `cta_click` event** as the rest of the site (so it lands in the same GA4
report, filterable by `cta_category = affiliate_banner` / `affiliate = hlth_code`) and falls back to
`dataLayer` / console if `gtag` isn't present. The global `kygo-tracking.js` listener also sees the
click but `classifyClick()` returns `null` for it → **no duplicate event**. This is the affiliate
A/B-test placement; see `docs/affiliate-links.md` for the affiliate/disclosure side.

## Wix Velo events (not analytics — host integration)

Separately from GA4, components dispatch **`CustomEvent`s** (`bubbles: true, composed: true`,
plain-data `detail`) that the **Wix Velo** host listens for to drive backend actions. These are
*integration* events, not analytics, but worth cataloging:

| Event | Component | Purpose |
|---|---|---|
| `contactSubmit` | `kygo-contact.js` | Contact form submission → Velo sends email |
| `imageUploaded` | `calories-custom-element.js` | Food-scanner image upload |
| `kygo-calculation` | `kygo-calorie-burn-accuracy.js` | Calculator run (could double as analytics signal) |
| `postClick` | `kygo-blog.js`, `kygo-blog-post.js` | Navigate to a blog post |
| `categoryClick` | `kygo-blog-post.js` | Filter by category |
| `seeAllClick` | `kygo-blog-post.js` | "See all" related posts |
| `subscribe` | `kygo-blog-post.js` | Newsletter subscribe |

The host reports results back by setting an **attribute** (e.g. `data-form-result="success"`),
handled in `attributeChangedCallback` — never via a callback (Wix bridges events over
postMessage/structured clone, which can't serialize functions).

> **These CustomEvents are now also mirrored into GA4** by `kygo-tracking.js` (a second set of
> document-level, capture-phase listeners): `subscribe` → `email_subscribe`, `contactSubmit` →
> `contact_submit` (both key events), and `kygo-calorie-calculation` → `tool_result`. The mirror
> reads only non-identifying context from `detail` — **never the email/name/message** — so no PII
> reaches GA4. `postClick`/`categoryClick`/`seeAllClick` are **not** mirrored (the click listener
> already covers those navigations).

## Tracking gaps / notes

1. **Single GA ID via attribute** — tracking only works if the Wix embed includes
   `kygo-tracking.js` with a valid `data-ga-id`. If it's missing on a page, that page has **no
   analytics** (events go to console only). Verify the script is present wherever components ship.
2. ~~**Wix Velo events aren't sent to GA4**~~ **(addressed 2026-07)** — `subscribe`,
   `contactSubmit`, and `kygo-calorie-calculation` are now mirrored to GA4 as `email_subscribe`,
   `contact_submit`, and `tool_result` (see the Wix Velo section above). Remaining unmirrored
   CustomEvents (`imageUploaded`, `postClick`, `categoryClick`, `seeAllClick`) are navigation/host
   plumbing already covered by the click listener or not conversion-relevant.
3. **`page_view` is the only built-in pageview** — SPA-style route changes on Wix won't refire it;
   each component page is a full load so this is generally fine.
4. No consent/CMP gating is present in `kygo-tracking.js`; GA loads immediately when `data-ga-id`
   is set. Confirm this matches the site's privacy/cookie policy.
