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
| `kygo-bundle.js` | — | **none** — the homepage `Organization` + `SoftwareApplication` JSON-LD is served from the Wix head (`wix-global-code.md` Blocks 2 & 3), which is the single source of truth. The `kygo-hero-section` element used to inject duplicate, stale copies (`data-kygo-bundle-ld` SoftwareApplication + `data-kygo-org-ld` Organization); both injections were removed. |
| `kygo-hiw-bundle.js` | `data-kygo-hiw-ld`, `data-kygo-hiw-faq-ld` | HowTo + HowToStep; FAQPage (6 Q&A) |
| `kygo-contact.js` | `data-kygo-contact-ld` | ContactPage, Organization, ContactPoint |
| `kygo-picks.js` | `data-kygo-picks-ld` | CollectionPage (+ BreadcrumbList, ItemList of the 15 sections). **Server copy lives in the Wix SEO panel for `/best-wearables` (page id `o97rs`) since 2026-10-24**; the component skips its runtime copy when a server CollectionPage is present. Change sections → update both. |
| `kygo-tools.js` | `data-kygo-tools-ld` | CollectionPage, ItemList, ListItem, Organization |
| `kygo-blog.js` | `data-kygo-blog-ld` | CollectionPage, Organization, ImageObject |
| `kygo-calorie-burn-accuracy.js` | `data-kygo-calorie-burn-ld` | WebApplication, **HowTo + HowToStep + HowToTool**, FAQPage, BreadcrumbList, **7× ScholarlyArticle**, Offer, Organization |
| `kygo-step-count-accuracy.js` | `data-kygo-step-count-accuracy-ld`, `data-kygo-step-count-accuracy-faq`, `data-kygo-step-count-accuracy-bc` | WebApplication, FAQPage (8 Q&A, from the visible `_faqs` getter), BreadcrumbList, Offer, Organization |
| `kygo-accuracy-factors.js` | `data-kygo-accuracy-factors-ld`, `data-kygo-accuracy-factors-faq`, `data-kygo-accuracy-factors-bc` | WebApplication, FAQPage (8 Q&A, from the visible `_faqs()` getter), BreadcrumbList, Offer, Organization. WebApplication `name` = "Wearable Accuracy: What Actually Affects It", `url` = `/tools/accuracy-factors`. |
| `kygo-wearable-accuracy.js` | `data-kygo-wearable-ld` / `-faq` / `-breadcrumb` | WebApplication, FAQPage, BreadcrumbList, Offer, Organization (v2 rebuild dropped the per-study `MedicalScholarlyArticle` citation list) |
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
| `kygo-faq-section.js` | — | **none** (FAQPage intentionally site-level; empty `_injectStructuredData()`). Site-level source of truth: `FAQ-Rewrite-2026-09-11.jsonld.json`, which carries the web-version and phone-app questions added 2026-09-14. |
| `kygo-cta.js` | — | **none** (shared CTA element; the homepage `SoftwareApplication` + `WebApplication` graph in the Wix head covers the platforms) |
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

## Single-source rule for tool-page JSON-LD (2026-10-14)

Tool pages get JSON-LD from two places: the **Wix SEO panel** (in the server HTML, readable by
non-JS crawlers) and the component's `_injectStructuredData()`. To stop duplicates, every tool
component now appends through `__kygoAppendLdOnce()`, which **skips any `@type` the page already
serves from Wix**. So:

- **The Wix SEO panel is the live copy** for any type it holds. When you edit a component's FAQ,
  WebApplication or BreadcrumbList, update the Wix panel too (Wix API: Item SEO Tags,
  `STATIC_PAGE/<pageId>`, write the draft and then `publish: true`), or the old Wix text keeps serving.
- **Wix caps each script tag at 4,096 bytes.** FAQs over that live only in the component (the
  guard lets them through because Wix has no FAQPage there): recovery-score-explorer (4.9 KB),
  smart-ring-comparison (5.1 KB), supplements-by-metric (6.5 KB). step-count-accuracy and
  wearable-accuracy are also component-only, but their FAQs minify to ~3.95 KB, so they may fit
  in Wix — untested (re-verified 2026-10-14).
  stress-factors and oura-vs-ringconn keep an older, oversized Wix FAQ that predates the cap and
  can't be rewritten via the API without dropping it (content matches the component).
- `/faq` deliberately splits its 14 questions across two Wix FAQPage blocks for the same reason.

## Schema notes & intentional omissions

Some pages **deliberately** skip a schema type to avoid injecting duplicate schema when multiple
components render on the same Wix page. These are **not bugs** — each carries an explicit comment
(`… managed via Wix site-level LD+JSON to avoid duplicate schema errors`):

1. **`kygo-faq-section.js`** — empty `_injectStructuredData() {}`; FAQPage is handled at the Wix
   site level.
2. **`kygo-deep-sleep-factors.js`** (and `kygo-rem-sleep.js`) — inject FAQPage + BreadcrumbList
   only. **Gap:** Wix does *not* serve WebApplication on either page (re-verified live
   2026-10-14), so neither page has one.
3. **`kygo-sleep-metrics.js`** — injects WebApplication + BreadcrumbList only. **Gap:** Wix does
   *not* serve a FAQPage on `/tools/sleep-metrics`, so the page has none.
   Also with no BreadcrumbList anywhere: `/tools/vo2-max-factors`, `/tools/vo2-max-accuracy`,
   `/tools/calories-in-anything`.

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

**Google Analytics 4 (gtag.js)**, loaded by the separate, optional script
**`kygo-tracking.js`**, is the site-wide integration. No PostHog/Segment/Meta Pixel. The same
script also loads the **Reddit Pixel** (advertising, consent-gated, since 2026-11-02; see "Reddit Pixel" below). Clicks and
conversions are delegated to this one script, which listens globally. The exceptions that call
`window.gtag` themselves (only when it exists): the HLTH Code banner on
`kygo-oura-ring-comparison.js` (below), and the in-page `cta_view` of `<kygo-cta>` and
`<kygo-app-card>` (2026-11-01, see "In-page CTA impressions").

**One exception (2026-09-14): `kygo-cta.js`.** The shared `<kygo-cta>` element fires
**Mixpanel `cta_clicked`** itself on every button click, with
`{ slug, surface, destination }` — `destination` being `web` / `ios` / `android`. It looks for
`window.mixpanel`, falling back to `window.parent.mixpanel` and doing nothing if neither exists,
so the click is never blocked. (A Wix custom element renders in the page document itself, not in
an iframe; the parent fallback only matters where `kygo-cta.js` runs inside a blog "HTML code"
iframe, such as the app card.) The same payload
also goes out as a bubbling, composed **`kygo-cta-click`** CustomEvent, which is how Velo or a
GA4 bridge can pick it up without a second wiring pass. Each anchor also carries
**`data-destination`**, which `classifyClick()` reads first, so GA4 `cta_click` fires alongside
on every one of the three buttons — `web_signup` for the web, `ios_download` / `android_download`
for the stores — labelled with the CTA's `slug` and positioned by its `surface`.

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
| `cta_click` | any classified `<a>`/`<button>`/`[data-action]` click, left click or middle click (`auxclick` with button 1, since 2026-11-01; a left click never fires `auxclick`, so nothing is counted twice) | `cta_category`, `cta_label`, `cta_url`, `component`, `position`, `page_path` (+ `affiliate`, `affiliate_marketplace` for Amazon; + `to_tool` for related-tools cards; + `to_post` for related-reading cards; + `action_type` = the `data-action` value for `other_action`) |
| `cta_view` | a CTA half on screen, once per CTA: blog HTML-embed cards via `postMessage` (`component: 'kygo-blog-embed'`), and since 2026-11-01 `<kygo-app-card>` and `<kygo-cta>` in the page itself (see "In-page CTA impressions") | `cta_label`, `component`, `position`, `page_path` (+ `cta_content`) |
| `tool_interaction` | any control a tool declares with `data-tool-control` (a click, Enter / Space on a non-native control, or a field's new value), `window.KygoTrack.toolInteraction(...)`, and the legacy calculate/compare/analyze buttons (see "Tool interactions") | `tool_name` (= component tag), `action`, `page_path`, `visit_campaign` (+ `tool_control`, `tool_value`, `button_label`, `visit_content`) |
| `page_exit` | `visibilitychange` → hidden | `page_path` |
| `email_subscribe` **(key event)** | `subscribe` CustomEvent (any subscribe form) → mirrored to GA4 | `lead_type` (`newsletter`), `component`, **`source`**, `page_path` |
| `contact_submit` **(key event)** | `contactSubmitted` CustomEvent, which `kygo-contact.js` fires only when the host confirms the send (`data-form-result="success"`), since 2026-11-01. Before that it fired on `contactSubmit`, the attempt, so it counted sends that later failed | `lead_type` (`contact_form`), `component`, `page_path`. **No PII** — email/name/message are never read from `detail` |
| `report_download` **(key event)** | `reportDownload` CustomEvent ("Download the PDF" on `/report-download`, `kygo-report-download.js`) → mirrored to GA4 | `lead_type` (`report`), `component`, `source` (`report-download`), `page_path` |
| `gate_hub` | **Retired 2026-10-29.** Was a click on the hub `/tools/wearable-accuracy` report band's link; the hub now embeds the email-capture `<kygo-report-card>` like every tool (`email_subscribe`, source `report-tool-wearable-accuracy`; cover click `gate_tool`) | — |
| `tool_result` | `kygo-calorie-calculation` CustomEvent (calculator produced a result) | `tool_name` (= component tag), `page_path` |

**`email_subscribe` source taxonomy** (email-capture pass, spec 24). Every subscribe form sets
`detail.source`, which `kygo-tracking.js` copies to the GA4 `source` param, and the Velo endpoint
writes to the `Subscribers.source` field — the two always match. Values:
`blog-post` (blog post template), `report-landing` (State of Wearable Accuracy landing page, via page code), `report-<blog|tool|home>-<slug>` (`kygo-report-card`, e.g. `report-home-home`), `footer` (site-wide footer strip), and `tool-<name>`, one per
tool, e.g. `tool-wearable-accuracy`, `tool-calories-in-anything` (`kygo-inline-subscribe` without a
`source` attribute now falls back to `tool-<last path segment>`, never a bare `tool`). A POST with no
source is saved as `unknown` (the backend fallback, kept on purpose) together with a `sourceHint`
field: the referer host + path (no query string) and content type, so the sending surface can be
found (backend change pending paste, see `docs/fixes-and-issues.md` #SUB1). The event
fires **only after a `200` from `/_functions/subscribe`**, so `email_subscribe` counts confirmed
subscribers only. (Watch that `cta_click` doesn't regress on pages where a subscribe strip was
added — attention competition — but do not add any new GA4 event to measure it.)

`cta_click` is bucketed by **`cta_category`**, derived in `classifyClick()` from the element's
`data-destination` (checked first, and set by every `<kygo-cta>` button), then its `data-action`,
`href`, and CSS classes. A `<kygo-cta>` click takes its `cta_label` from the element's `slug` and
its `position` from the element's `surface`:

| `cta_category` | Trigger |
|---|---|
| `ios_download` | **`data-destination="ios"` (any `<kygo-cta>` button)**, `data-action="ios-download"`, or `href` contains `apps.apple.com` **or any known iOS Tenjin link** (`track.tenjin.com/v0/click/<id>`: the default `cD7zgIPLuiZMMWmWkXLsvy`, and since 2026-11-01 the per-campaign, Reddit Organic and email links too, looked up with `KygoAttribution.platformOf(url)` or the fallback table in `kygo-tracking.js`), or `.cta-primary` + apple href / any Tenjin href |
| `android_download` | **`data-destination="android"`**, `data-action="android-download"`, `.cta-android`, or `href` contains **any known Android Tenjin link** (the default `eMjS3ZkseCvs2lO9AVESkO`, what every `<kygo-cta>` Android button points at, plus the campaign, Reddit Organic and email links), `play.google.com` or `kygo.app/android` |
| `web_signup` | **`data-destination="web"`** — the "Start on the web" button on every `<kygo-cta>`, pointing at `app.kygo.app/start` with UTMs (or the visitor's inbound UTMs, plus `fbclid` / `gclid`). Since 2026-11-01 also **any `href` on `https://app.kygo.app`** without a `data-destination` (the header "Open web app" button, the footer web links, inline tool-page links), checked before the class buckets below, so the footer's `kygo-footer-cta-btn` no longer files as `primary_cta` |
| `see_how_it_works` | `.cta-secondary` only (since 2026-11-01; before that any label containing "how it works" matched, which filed the nav and footer "How it works" links here) |
| `tool_interaction` | `data-action` = `calculate`/`compare`/`analyze`, or `.calculate-button` |
| `header_cta` | `.header-cta` (nav "Get Kygo App") |
| `blog_cta` | `.blog-cta-btn` |
| `primary_cta` | `.cta-primary` / `.cta-button-primary` / `.cta-btn` |
| `affiliate_amazon` | link hostname matches an Amazon marketplace (`amazon.<tld>`) or `amzn.to` short link. Also carries `affiliate: 'amazon'` + `affiliate_marketplace` (the host), and the click handler rewrites the href with a per-click `ascsubtag` (`<page-slug>_<component>`) for Associates-report attribution, preserving the existing `tag=` param |
| `related_tool_click` | `data-action="related-tool"` — the standard related-tools cards on every tool page. Also carries **`to_tool`** (the destination slug from `data-tool-slug`), with `position: 'related-tools'`. Paired with `component` (the source tool's custom element) and `page_path`, this gives **source tool → destination tool**, which is how the cross-link section is measured as a retention surface |
| `related_tool_click` (Kygo Picks card) | The shared `<kygo-picks-card>` placed after the buy buttons on 16 tool pages (general / sleep / training card per tool). Its links carry `data-action="related-tool"`, so they file as `related_tool_click` with `to_tool: 'best-wearables'` and `position: 'picks-card-<tool slug>'`; the hub line under it on spoke tools files as `to_tool: 'wearable-accuracy'`, `position: 'picks-hub-link'` |
| `blog_post_click` | `data-action="blog-post"` — the standard related-reading cards on every tool page. Also carries **`to_post`** (the destination slug from `data-post-slug`), with `position: 'related-posts'`. The mirror of `related_tool_click`: with `component` and `page_path` it gives **source tool → destination blog post**, so the blog cross-link section is measured the same way the tool cross-link section is |
| `other_action` | any other element with a `data-action`. Carries **`action_type`** (the `data-action` value, e.g. `source-link`) and `cta_url` (its `href`) since 2026-11-01 |
| `affiliate_banner` | **not** from `classifyClick()` — fired directly by `kygo-oura-ring-comparison.js` for the HLTH Code banner (see below) |

## Reddit Pixel (`kygo-tracking.js`, 2026-11-02)

Reddit Ads pixel **`a2_ivf5p0ctl2fn`**, loaded by `kygo-tracking.js` with Reddit's standard base
code (the `rdt` queue stub plus async `https://www.redditstatic.com/ads/pixel.js`), then
`rdt('init', 'a2_ivf5p0ctl2fn')` and `rdt('track', 'PageVisit')`. Nothing is rendered; no
element is added to the page.

| Reddit event | When | Payload |
|---|---|---|
| `PageVisit` | pixel load, and each later change of `location.pathname` (Wix SPA navigation) | none |
| `Lead` | every GA4 `cta_click` whose `cta_category` is `ios_download`, `android_download` or `web_signup`: the in-page click path (left or middle click) and the blog-embed `{kygo:'embed', type:'click'}` message path. No other category | `{ conversionId }` |
| `SignUp` | every GA4 `email_subscribe`: the `subscribe` CustomEvent and the embed `{kygo:'embed', type:'subscribe'}` message | `{ conversionId }` |

- **`conversionId`** is a fresh random/timestamp string per conversion (`k<base36 time>-<random>`),
  for Reddit's pixel/CAPI dedup. It is the only field sent.
- **No PII, no advanced matching:** `init` takes the id alone; no email, name, phone or external
  id is ever passed (the `subscribe` detail's email is never read).
- **Consent gating (Wix cookie banner):** the pixel loads and every `rdt` call fires only while
  `window.consentPolicyManager.getCurrentConsentPolicy().policy.advertising === true`
  ("Accept all"; "Analytics only" and "Reject all" keep it off). Wix's default policy before a
  choice currently reports `advertising: true`, and the script follows whatever the manager
  returns. A later choice is picked up from Wix's `consentPolicyChanged` event (dispatched on
  `document`, documented at dev.wix.com "About the Consent Policy"), which re-reads the manager,
  plus re-checks at 2s / 5s / 10s / 15s after load. Consent withdrawn after load stops all further
  `rdt` calls (the already-loaded script is not removed). With no `consentPolicyManager` on a
  non-Wix page (a test harness) it loads; on a Wix page (generator meta / `viewerModel`) whose
  manager is not there yet it waits for the re-checks instead of loading unconsented.
- **Top page only:** never loads inside a frame (`window.top !== window`), so the blog HTML-embed
  iframes report through their `postMessage` path instead.
- **SPA:** `history.pushState` / `replaceState` are wrapped, `popstate` is listened to, and
  `pathname` is polled every 1s as a backstop; a `PageVisit` fires only when the pathname differs
  from the last one sent (query or hash changes do not count).
- **Loaded twice:** state lives on `window.__kygoRdt`, so a second copy of the script cannot
  inject `pixel.js` again, init twice or send a second `PageVisit`; conversions are de-duplicated
  per DOM event, so the second copy's click / message / subscribe listeners add nothing.
- Every `rdt` call is wrapped in `try/catch`: the pixel can never break a click.

## Blog HTML-embed cards (`docs/wix-snippets/blog-cta-card.html`)

A Wix Blog **HTML code** block is a sandboxed iframe on a Wix domain, so the click listener
above never sees it. The card snippet loads `<kygo-cta>` inside the iframe and `postMessage`s
`{kygo:'embed', type, ...}` to the page, where `kygo-tracking.js` handles it:

| Message | GA4 / effect |
|---|---|
| `click` | `cta_click` with `cta_category` `ios_download` / `android_download` / `web_signup`, `cta_label` = the card's `slug`, `component: 'kygo-blog-embed'`, `position: 'blog-embed'`, `page_path`, `cta_url`, `cta_content` if set |
| `view` | `cta_view`, same params minus category/url: once per card when half of it is on screen (CTR = clicks ÷ views per slug) |
| `hello` | page replies `{kygo:'embed', type:'attr', utm, click, reddit?}`: the visitor's inbound `utm_*` / `fbclid` / `gclid` (`window.KygoAttribution` when loaded, else the URL), plus `reddit` (the Reddit-organic landing path, a path only, sanitised, sent only when the session has no `utm_*`). Since 2026-10-31 `kygo-cta.js` sends `hello` itself whenever it runs in a cross-origin frame and adopts the reply (`KygoAttribution.adopt`), so store and web links in the frame get the same swap and tags as on the top page. Only a reply from `window.top` in that exact shape is taken |
| `height` | page sets the iframe's height to the card's, when it can find the iframe |

Only fixed-set or sanitised strings are read from the message. Installs are still attributed by
Tenjin, since the store buttons are the standard Tenjin links.

**Known external sender (not in this repo): the Wix "HLTH affiliate bridge" embed.** The HLTH
blog card (`kygo-hlth-card.js`, in a blog "HTML code" iframe) posts
`{type:'kygo-cta-click', action:'affiliate_hlth', position:'post-partner-card', label:<slug>}` to
the top window on a button click (and `{type:'kygo-embed-height', height}` for sizing). That shape
has no `kygo` key, so `kygo-tracking.js` ignores it **on purpose**: the bridge, a site-level Wix
custom-code embed that lives only in the Wix editor, already forwards those clicks to GA4 as
`affiliate_hlth`. Adding a handler here would count every HLTH click twice. If the bridge is ever
removed, add the handler to `kygo-tracking.js` in the same change (`cta_click`,
`cta_category: 'affiliate_hlth'`, `affiliate: 'hlth_code'`).

## Shared blog app card (`kygo-app-card.js`, 2026-10-26)

Replaces the pasted `blog-cta-card.html` card, one post at a time (test: how-accurate-is-your-heart-rate-monitor, mid card). The HTML block holds only `<kygo-app-card post position slug variant focus headline sub>` plus the script tag (`docs/wix-snippets/blog-app-card.html`). It posts the same `{kygo:'embed'}` messages as the old card, so `kygo-tracking.js` needs no change:

| Where | What identifies the card |
|---|---|
| GA4 `cta_click` / `cta_view` | `cta_label` = `slug` (placement), `cta_content` = `variant`, `page_path` = the post, `component: 'kygo-blog-embed'` |
| Tenjin | store links are the standard Website-channel links plus `?site_id=<post>&creative_name=app-card-<variant>-<position>`. `KygoAttribution.storeUrl` keeps both at press time, except that a paid session (utm_campaign listed in `CAMPAIGN_STORE_LINKS`) swaps in the campaign link and sets `creative_name` to its `utm_content`, else its `utm_campaign`; a Reddit-organic session (Reddit referrer, no `utm_*`) swaps in the Reddit Organic links (`REDDIT_ORGANIC_STORE_LINKS`) and sets `creative_name` to the page it landed on from Reddit; `site_id` stays the post in both. Read installs with reporting `group_by=site` / `creative` |
| Attribution in the iframe | the frame cannot read the landing URL or referrer, so `kygo-cta.js` (loaded by the card) posts `hello` to the top window and adopts the `attr` reply from `kygo-tracking.js` with `KygoAttribution.adopt(attr)`. Adopt REPLACES the frame's record (utm_* keys, fbclid / gclid, a path-shaped `reddit`), so the frame never holds a utm value the page did not have, and an organic page clears anything stale. `hello` is retried at 0.7 s, 2 s and 5 s until a reply lands; links are rewritten at press time, so a reply before the first press is enough. With no reply or an organic one the card keeps `site_id=<post>` and `creative_name=app-card-<variant>-<position>`. The click still reaches GA4 through the `{kygo:'embed', type:'click', destination}` message, so a swapped campaign link files as `ios_download` / `android_download` by its `data-destination` |

`cta_content` must be registered as a GA4 event-scoped custom dimension to be reportable.

## Tool-page promos (2026-10-27)

Every tool page runs at most three promos, in this order: the app card, the State of Wearable
Accuracy report card (accuracy and comparison tools only), the Picks card (device tools, above
the FAQ). The inline email band was removed from all tool pages.

- **App card**: the shared `<kygo-app-card surface="tool" web post="tool-<slug>" slug="<slug>">`
  in the page itself (not an iframe). Since 2026-11-06 every card (blog too) has a Web button
  (`data-destination="web"`, `utm_medium=<surface>`, `utm_campaign=<slug>`), so blog cards can
  file `web_signup` as well; the `web` attribute is no longer read. `kygo-tracking.js` treats it like `<kygo-cta>`:
  `cta_click` with `cta_category` ios_download / android_download / web_signup,
  `cta_label` = slug, `position` = tool, `cta_content` = variant (v1). Tenjin: `site_id=tool-<slug>`,
  `creative_name=app-card-v1-mid` (in a paid session: the session's `utm_content`, else its
  `utm_campaign`, on the campaign link; in a Reddit-organic session: the landing path, on the
  Reddit Organic link). `cta_view`: since 2026-11-01 the card sends it to the page's GA4 itself
  (see "In-page CTA impressions"); before that tool pages had none.
- **Report card** (since 2026-10-27 the shared `<kygo-report-card>`, also on blog posts and the
  homepage): captures the email in the card, POSTs `{email, source}` to `/_functions/subscribe`
  (source `report-<blog|tool|home>-<slug>`), then sends the visitor to `/report-download`. GA4:
  `email_subscribe` with `lead_type` report and that source (blog iframes post
  `{kygo:'embed', type:'subscribe', source}` up; no email ever leaves the frame that way).
  The cover image still links to the landing page: on tools/home its link carries
  `data-gate="gate_tool"` / `gate_home`; `kygo-tracking.js` files any
  `data-gate="gate_*"` click as that GA4 event (`cta_label` = `report-<slug>`, `position` =
  report-card / report-cover). The wearable-accuracy hub now uses the same card (it was a link band
  firing `gate_hub` until 2026-10-29). Mark `gate_tool` as a key event in GA4 if wanted.
- **Homepage**: the same report card sits directly above the FAQ (`kygo-home-report` in
  `kygo-bundle.js`), filed as `gate_home` (`cta_label` = report-home).
- **Picks card**: unchanged (`related_tool_click` to best-wearables).

## In-page CTA impressions (`cta_view`, 2026-11-01)

A card in a blog iframe posts `{kygo:'embed', type:'view'}` and `kygo-tracking.js` files it. A
card or CTA in the page itself has no frame to post from, so it calls the page's `window.gtag`
directly (only when it exists, so a page without `kygo-tracking.js` sends nothing). One event per
element, when half of it is first on screen (IntersectionObserver, threshold 0.5, disconnected
after the first view and in `disconnectedCallback`):

| Element | Params |
|---|---|
| `<kygo-app-card>` not in a frame (tool pages) | `cta_label` = slug, `component: 'kygo-app-card'`, `position` = surface (`tool`), `cta_content` = variant, `page_path` |
| `<kygo-cta>` default and `compact` (not `mini`, not `single`, not in a frame) | `cta_label` = slug, `component: 'kygo-cta'`, `position` = surface, `page_path` |

A framed app card still sends only the message, so there is no double count. `cta_view` totals
rise from 2026-11-01 because of this; filter `component = kygo-blog-embed` to compare with earlier
weeks.

## Tool interactions (`tool_interaction`, 2026-11-02)

One shared path for every tool, so no tool writes its own GA4 call. Declare the control:

```html
<button data-tool-control="device-picker" data-tool-value="apple-watch-s8" aria-pressed="false">...</button>
<select data-tool-control="metric">...</select>
<input type="range" data-tool-control="nights" />
```

`kygo-tracking.js` reads, through shadow roots:

- a **click** on any element with `data-tool-control` that is not a form field (a button, a link, a
  `<summary>`, a `div role="button"`). A link or `data-action` element *inside* a control (the
  affiliate name link in a sleep-metrics card header) stays that link's own `cta_click`;
- **Enter / Space** on a declared control that is not a native button, link, field or `<summary>`
  (an accordion `div`), sent only when the tool handled the key (`preventDefault`) and never twice
  when the tool answers the key with `el.click()`;
- a **form field's new value**, from the composed `input` event (a `change` event never leaves a
  shadow root): select / checkbox / radio at once, a range once it has rested 700 ms, a text or
  search field on its own `change` (Enter or leaving it), never per keystroke.

Anything else (a drag, a canvas, a re-rendered slider) calls
`window.KygoTrack.toolInteraction({tool, control, value, action, label})`.

| Param | Value |
|---|---|
| `tool_name` | `data-tool-name`, else the component tag (`kygo-sleep-tracker-accuracy`) |
| `tool_control` | `data-tool-control` (`device-picker`) |
| `tool_value` | `data-tool-value`, else the field's value (checkbox: true/false), else the label; max 100 chars |
| `action` | `data-tool-action`, else read from the state before the click: `aria-pressed` gives `select` / `deselect`, `aria-expanded` (or a `<summary>`'s `<details>` open state) gives `expand` / `collapse`, a tab (`aria-selected`) gives `select`; else `click` / `change`. Legacy buttons keep `calculate` etc. Radio-like pickers (one choice always on) set `data-tool-action="select"` so a click on the current choice is not reported as `deselect` |
| `button_label` | the element's label (`data-track-label` or text) |
| `page_path` | the page |
| `visit_campaign` | the session's `utm_campaign`, `reddit-organic`, or `none` |
| `visit_content` | the session's `utm_content`, when there is one |

The legacy `data-action="calculate"` buttons (calorie-burn-accuracy) keep `tool_name`, `action` and
`button_label` and since 2026-11-02 also carry `page_path` and `visit_campaign` / `visit_content`.
Enter in its calories field (which calculates without the button) sends the same event with
`button_label: 'enter-key'`.

A control that is clicked counts each attempt (a picker's minimum / maximum can refuse one).
`tool_control`, `tool_value`, `visit_campaign`, `visit_content` are registered as GA4 event-scoped
custom dimensions (owner, 2026-11-02).

**Wired (2026-11-02), `tool_control` names by tool.** Names are shared across tools; values are
stable ids or slugs, never translated labels.

| Tool (tag) | `tool_control` values |
|---|---|
| `kygo-sleep-tracker-accuracy` | `device-picker` |
| `kygo-heart-rate-accuracy` | `brand-picker`, `view-toggle` (day / night) |
| `kygo-step-count-accuracy` | `brand-picker` |
| `kygo-oura-5-vs-4` | `metric-tab`, `tier-picker`, `billing-picker`, `case-toggle` (checkbox) |
| `kygo-sleep-metrics` | `category-tab`, `metric-dropdown`, `exclusive-dropdown` |
| `kygo-supplements-by-metric` | `metric-picker`, `supplement-dropdown` |
| `kygo-hrv-factors`, `kygo-rem-sleep`, `kygo-sleep-latency-factors` | `category-tab`, `sort` (select), `factor-dropdown`, `pick-dropdown`, `factor-jump`, `board-expand` |
| `kygo-deep-sleep-factors` | `category-jump`, `factor-dropdown`, `pick-dropdown` |
| `kygo-staying-asleep-factors` | `view-tab`, `category-filter`, `chart-factor`, `sort`, `factor-dropdown` |
| `kygo-rhr-factors` | `category-picker`, `myth-category-picker`, `sort`, `factor-dropdown`, `factor-jump`, `baseline-dropdown` |
| `kygo-wearable-accuracy` | `brand-picker` (select), `metric-tab`, `overview-metric`, `metric-jump`, `comparator-jump`, `score-view-tab`, `finding-tab`, `finding-step` |
| `kygo-wearable-stress` | `device-picker` (select), `category-picker`, `device-dropdown`, `factor-dropdown` |
| `kygo-recovery-scores` | `category-picker`, `device-dropdown`, `factor-dropdown` |
| `kygo-fitbit-air-vs-whoop` | `spec-tab`, `whoop-picker`, `air-picker`, `years-slider` |
| `kygo-oura-ring-comparison` | `spec-tab`, `oura-picker`, `rival-picker`, `years-slider` |
| `kygo-oura-vs-ringconn` | `spec-tab`, `feature-tab`, `oura-picker`, `rival-picker`, `years-slider` |
| `kygo-smart-ring-comparison` | `priority-filter`, `model-picker`, `spec-tab`, `feature-tab`, `calc-ring-picker`, `plugs-toggle`, `years-slider` |
| `kygo-sensor-comparison` | `section-tab`, `algorithm-dropdown`, `radar-brand` (canvas legend) |
| `kygo-vo2max-factors` | `direction-filter`, `evidence-filter`, `search`, `category-dropdown`, `factor-dropdown`, `factor-jump` |
| `kygo-vo2max-accuracy` | `device-dropdown` |
| `kygo-accuracy-factors` | `factor-dropdown` |
| `kygo-food-and-sleep` | `stage-tab`, `food-jump`, `food-dropdown` |
| `kygo-calorie-burn-accuracy` | `device-picker`, `activity-picker` (plus the legacy `calculate`) |
| `calories-in-anything` (calorie scanner) | `photo-upload` (upload / camera / zone / drop), `scan-reset`, `share` |
| `kygo-tools-page` (tools hub) | `tool-card`, `featured-tool-card` (action `open`, value = tool slug), `share` |

`years-slider` (the ring calculators re-render the slider on every input) and `radar-brand` (a canvas)
call `KygoTrack.toolInteraction` from the component; the slider sends once it has rested 700 ms.

Not wired, on purpose: FAQ accordions and the "show all sources" toggles (content, not tool use);
the vo2max-factors "Reset" button (already a `cta_click` `other_action`, `action_type:
reset-filters`, kept so its existing reporting does not change); `kygo-picks` (/best-wearables is a
buying guide, its clicks are `cta_click`); the tools hub has no category filter (the cards and the
share button are its controls).

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
| `contactSubmit` | `kygo-contact.js` | Contact form submission → Velo sends email (the attempt; carries the form fields, never read by GA4) |
| `contactSubmitted` | `kygo-contact.js` | Fired when the host sets `data-form-result="success"`; `detail: {component: 'kygo-contact'}`. Mirrored to GA4 `contact_submit`; Velo needs nothing for it |
| `imageUploaded` | `calories-custom-element.js` | Food-scanner image upload |
| `kygo-calorie-calculation` | `kygo-calorie-burn-accuracy.js` | Calculator run (mirrored to GA4 `tool_result`) |
| `postClick` | `kygo-blog.js`, `kygo-blog-post.js` | Navigate to a blog post |
| `categoryClick` | `kygo-blog-post.js` | Filter by category |
| `seeAllClick` | `kygo-blog-post.js` | "See all" related posts |
| `subscribe` | `kygo-blog-post.js` | Newsletter subscribe |

The host reports results back by setting an **attribute** (e.g. `data-form-result="success"`),
handled in `attributeChangedCallback` — never via a callback (Wix bridges events over
postMessage/structured clone, which can't serialize functions).

> **These CustomEvents are now also mirrored into GA4** by `kygo-tracking.js` (a second set of
> document-level, capture-phase listeners): `subscribe` → `email_subscribe`, `contactSubmitted` →
> `contact_submit` (both key events; `contactSubmitted` is the confirmed send, since 2026-11-01), and `kygo-calorie-calculation` → `tool_result`. The mirror
> reads only non-identifying context from `detail` — **never the email/name/message** — so no PII
> reaches GA4. `postClick`/`categoryClick`/`seeAllClick` are **not** mirrored (the click listener
> already covers those navigations).

## Tracking gaps / notes

1. **Single GA ID via attribute** — tracking only works if the Wix embed includes
   `kygo-tracking.js` with a valid `data-ga-id`. If it's missing on a page, that page has **no
   analytics** (events go to console only). Verify the script is present wherever components ship.
2. ~~**Wix Velo events aren't sent to GA4**~~ **(addressed 2026-07)** — `subscribe`,
   `contactSubmitted` (confirmed send; `contactSubmit` until 2026-11-01), and `kygo-calorie-calculation` are now mirrored to GA4 as `email_subscribe`,
   `contact_submit`, and `tool_result` (see the Wix Velo section above). Remaining unmirrored
   CustomEvents (`imageUploaded`, `postClick`, `categoryClick`, `seeAllClick`) are navigation/host
   plumbing already covered by the click listener or not conversion-relevant.
3. **`page_view` is the only built-in pageview** — SPA-style route changes on Wix won't refire it;
   each component page is a full load so this is generally fine.
4. No consent/CMP gating is present for GA4 in `kygo-tracking.js`; GA loads immediately when
   `data-ga-id` is set. Confirm this matches the site's privacy/cookie policy. (The Reddit Pixel
   *is* gated on Wix advertising consent, since 2026-11-02.)
