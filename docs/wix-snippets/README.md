# Wix global custom-code snippets (paste-ready)

Full, final source for the site-level code that lives in the **Wix editor** (Settings → Custom
Code + site header/footer). These files are the **recoverable copy** — paste them into the matching
Wix slot. See `../wix-global-code.md` for the audit and rationale behind each value.

| File | Wix slot | Action |
|---|---|---|
| `1-fonts-head.html` | Head → "Custom" | Replace block (adds DM Sans `700`) |
| *(none)* | Head → "JSON-LD Structured Data" | **DELETE** — the duplicate `SoftwareApplication`; folded into the file below |
| `3-homepage-jsonld-head.html` | Head → "Homepage JSON-LD Schema" | Replace block (one `@graph`, `www` host, no fake rating/screenshot) |
| `4-ga4-tracking-head.html` | Head → "Kygo GA4 Tracking" | Replace block — **adds the site-wide `kygo-inline-subscribe.js` loader** (email-capture pass) |
| `5-custom-header-body-start.html` | Body – start → "Kygo Custom Header" | Replace block — **re-synced from the live embed 2026-09-14**, then given the platform CTAs (segmented iOS/Android + "Open web app" on desktop, one device-matched button on a phone) |
| `6-custom-footer-body-end.html` | Body – end → "Kygo Custom Footer" | Replace block — **re-synced from the live embed 2026-09-14** (subscribe strip, `info@kygo.app`, consumer-health-data link), then given the Web app link and the device-ordered CTA trio |
| `blog-cta-card.html` | **Not global.** Blog post editor → Add → HTML code, mid-article | Template, one per card: edit copy/design, a unique `slug` and `hook`. Clicks reach GA4 through `kygo-tracking.js` (see `../schemas-and-tracking.md`, "Blog HTML-embed cards") |

## Email-capture pass (spec 24) — deploy order
The two snippet changes above (footer strip + inline-subscribe loader) and the `kygo-*-subscribe`
components all POST to the Velo endpoint **`/_functions/subscribe`**. Deploy that endpoint and the
`Subscribers` collection **first** (see `../wix-velo-code.md`), then these snippets, then run the
QA gate (submit on wearable-accuracy → confirm a `Subscribers` row **and** GA4 `email_subscribe`
with `source="tool-wearable-accuracy"`). Until the endpoint is live, the strips render but every
submit shows the retry error and no GA4 event fires.

## Before you publish
- **Rating:** intentionally omitted (App Store reviews aren't markup-eligible on this domain). Re-add
  only with genuine reviews shown on-page — snippet in `../wix-global-code.md`.
- After pasting the two head JSON-LD changes, run the homepage URL through Google's
  **Rich Results Test** and confirm one clean Organization/SoftwareApplication/WebSite graph.

## Device awareness in the header and footer (2026-09-14)
Both blocks pick which platform button leads from the user agent, and both fail safe: an
unrecognised agent (or a `navigator` that throws) falls back to the web app, and every platform
stays reachable on every device, so no visitor is left without a way in. The store buttons keep
their **Tenjin** attribution links; the web app goes to `app.kygo.app/start` with
`utm_source=kygo.app&utm_medium=header|footer` (no `utm_campaign`). Both blocks load `kygo-cta.js`,
whose listener swaps in a visitor's inbound `utm_*` and forwards `fbclid` / `gclid` on press. Both fire the same Mixpanel
`cta_clicked` `{slug:"nav", surface, destination}` that the in-page `<kygo-cta>` element sends.

## If the live site ever drifts from these files
The live Wix editor is the source of truth for what's deployed; these files are a mirror. When you
change one in Wix, update the matching file here so they stay in sync.

## Blog in-content cards (shared components, 2026-10-26)
Every card inside blog post copy is now a short HTML block that loads a hosted component, so a design
change is one commit (GitHub Pages refresh up to 10 min) and no post edits:
| Card | Component | Block template |
|---|---|---|
| App download | `kygo-app-card.js` | `blog-app-card.html` |
| State of Wearable Accuracy report | `kygo-report-card.js` | `<kygo-report-card slug="POST-SLUG">` + script |
| Kygo Picks | `kygo-picks-card.js` (blog embed mode when framed) | `<kygo-picks-card focus="all|sleep|training" slug="POST-SLUG">` + script |
Rules: max 3 cards per post, one app card (mid-post), Picks at the end of the buying section or the end of the post, never directly above the FAQ.
The pasted `blog-cta-card.html`, `blog-report-card.html` and `blog-picks-card-*.html` are retired; HLTH stays pasted (`kygo-hlth-code-affiliate`).
