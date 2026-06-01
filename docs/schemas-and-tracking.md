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
| `kygo-blog-page.js` | `data-kygo-blog-post-ld` | BlogPosting, WebPage, Organization, ImageObject |
| `kygo-calorie-burn-accuracy.js` | `data-kygo-calorie-burn-ld` | WebApplication, **HowTo + HowToStep + HowToTool**, FAQPage, BreadcrumbList, **7× ScholarlyArticle**, Offer, Organization |
| `kygo-step-count-accuracy.js` | `data-kygo-step-ld` | WebApplication, FAQPage (7 Q&A), BreadcrumbList, Offer, Organization |
| `kygo-wearable-accuracy.js` | `data-kygo-wearable-ld` | WebApplication, FAQPage, BreadcrumbList, **MedicalScholarlyArticle**, Offer, Organization |
| `kygo-wearable-stress.js` | `data-kygo-stress-ld` | WebApplication, FAQPage (11 Q&A), BreadcrumbList, Offer, Organization |
| `kygo-hrv-factors.js` | `data-kygo-hrv-factors-ld` | WebApplication, FAQPage, BreadcrumbList, Offer, Organization |
| `kygo-rhr-factors.js` | `data-kygo-rhr-factors-ld` | WebApplication, FAQPage, BreadcrumbList, Offer, Organization |
| `kygo-sleep-latency-factors.js` | `data-kygo-sleep-latency-factors-ld` | WebApplication, FAQPage, BreadcrumbList, Offer, Organization |
| `kygo-staying-asleep-factors.js` | `data-kygo-staying-asleep-factors-ld` | WebApplication, FAQPage, BreadcrumbList, Offer, Organization |
| `kygo-deep-sleep-factors.js` | `data-kygo-deep-sleep-factors-ld` | FAQPage, BreadcrumbList *(no WebApplication — see gaps)* |
| `kygo-sleep-metrics.js` | `data-kygo-sleep-ld` | WebApplication, BreadcrumbList, Offer, Organization *(no FAQPage)* |
| `kygo-sensor-comparison.js` | `data-kygo-sensor-comparison-ld` | WebApplication, FAQPage, BreadcrumbList, Offer, Organization |
| `kygo-oura-ring-comparison.js` | `data-kygo-oura-ld` | WebApplication, FAQPage, BreadcrumbList, Offer, Organization |
| `kygo-fitbit-air-vs-whoop.js` | `data-kygo-fitbitair-whoop-ld` | WebApplication, FAQPage, BreadcrumbList, Offer, Organization |
| `kygo-faq-section.js` | — | **none** ⚠️ (FAQ UI but no FAQPage schema — see gaps) |
| `kygo-blog-post.js` | — | **none** ⚠️ (sub-components: categories, related, subscribe, CTA) |

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

## Schema gaps / inconsistencies to review

1. **`kygo-faq-section.js` emits no FAQPage schema** despite being the FAQ UI — the biggest miss
   for rich results. Other pages inline their own FAQPage; this dedicated one doesn't.
2. **`kygo-blog-post.js` (categories/related/subscribe/CTA sub-components) emit no schema.**
3. **`kygo-deep-sleep-factors.js`** injects only FAQPage + BreadcrumbList — **no `WebApplication`**,
   unlike its sibling factor pages.
4. **`kygo-sleep-metrics.js`** injects `WebApplication` + Breadcrumb but **no FAQPage**.
5. `datePublished`/`dateModified` are hardcoded per file — keep `dateModified` current when editing.
6. New pages: scaffold via the `new-page` skill, then fill `_injectStructuredData()` with the
   right type and a unique `data-kygo-<name>-ld` marker.

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
| `cta_click` | any classified `<a>`/`<button>`/`[data-action]` click | `cta_category`, `cta_label`, `cta_url`, `component`, `position`, `page_path` |
| `tool_interaction` | calculate/compare/analyze buttons | `tool_name` (= component tag), `action`, `button_label` |
| `page_exit` | `visibilitychange` → hidden | `page_path` |

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
| `other_action` | any other element with a `data-action` |

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

## Wix Velo events (not analytics — host integration)

Separately from GA4, components dispatch **`CustomEvent`s** (`bubbles: true, composed: true`,
plain-data `detail`) that the **Wix Velo** host listens for to drive backend actions. These are
*integration* events, not analytics, but worth cataloging:

| Event | Component | Purpose |
|---|---|---|
| `contactSubmit` | `kygo-contact.js` | Contact form submission → Velo sends email |
| `imageUploaded` | `calories-custom-element.js` | Food-scanner image upload |
| `kygo-calculation` | `kygo-calorie-burn-accuracy.js` | Calculator run (could double as analytics signal) |
| `postClick` | `kygo-blog.js`, `kygo-blog-page.js`, `kygo-blog-post.js` | Navigate to a blog post |
| `categoryClick` | `kygo-blog-post.js` | Filter by category |
| `seeAllClick` | `kygo-blog-post.js` | "See all" related posts |
| `subscribe` | `kygo-blog-post.js` | Newsletter subscribe |

The host reports results back by setting an **attribute** (e.g. `data-form-result="success"`),
handled in `attributeChangedCallback` — never via a callback (Wix bridges events over
postMessage/structured clone, which can't serialize functions).

## Tracking gaps / notes

1. **Single GA ID via attribute** — tracking only works if the Wix embed includes
   `kygo-tracking.js` with a valid `data-ga-id`. If it's missing on a page, that page has **no
   analytics** (events go to console only). Verify the script is present wherever components ship.
2. **Wix Velo events aren't sent to GA4** — e.g. `subscribe`, `contactSubmit`, `kygo-calculation`
   fire as CustomEvents but aren't mirrored as GA events. If you want conversion tracking for
   form submits / subscribes, either add matching `data-action`s the tracker classifies, or
   extend `kygo-tracking.js` to listen for these CustomEvents.
3. **`page_view` is the only built-in pageview** — SPA-style route changes on Wix won't refire it;
   each component page is a full load so this is generally fine.
4. No consent/CMP gating is present in `kygo-tracking.js`; GA loads immediately when `data-ga-id`
   is set. Confirm this matches the site's privacy/cookie policy.
