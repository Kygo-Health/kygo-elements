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
| `6b-custom-footer-script-body-end.html` | Body – end → new block, "Kygo Custom Footer JS" | **New block 2 of 2** — the footer no longer fits in one embed (see the cap note below) |
| `5-custom-header-body-start.html` | Body – start → "Kygo Custom Header" | Replace block — **re-synced from the live embed 2026-09-14**, then given the platform CTAs (segmented iOS/Android + "Open web app" on desktop, one device-matched button on a phone) |
| `6-custom-footer-body-end.html` | Body – end → "Kygo Custom Footer" (block 1 of 2) | Replace block — **re-synced from the live embed 2026-09-14** (subscribe strip, `info@kygo.app`, consumer-health-data link), then given the Web app link and the device-ordered CTA trio |

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

## The 15,000-character embed cap (2026-09-14)
Wix rejects a custom-code block over **15,000 characters**. Two consequences:

- **The header** ships with its CSS minified and its JS comments stripped: **13,535 characters**,
  one block. Edit the readable source here, then minify before pasting
  (`/tmp` scratch script, or any CSS minifier) if it grows past the cap again.
- **The footer** does not fit in one block (17.5 KB, 16.9 KB even minified, and the rest of its
  weight is brand SVGs and CSS that should not be degraded to save bytes). It is therefore **two
  Body-end blocks**: `6-…` carries the root div plus the styles (6,320), `6b-…` carries the script
  that builds the markup into that div (10,875). The script waits for `DOMContentLoaded` when the
  div is not there yet, so **the order of the two blocks does not matter** (verified both ways).

Everything stays inline in Wix. Do not move these to a hosted script.

## Device awareness in the header and footer (2026-09-14)
Both blocks pick which platform button leads from the user agent, and both fail safe: an
unrecognised agent (or a `navigator` that throws) falls back to the web app, and every platform
stays reachable on every device, so no visitor is left without a way in. The store buttons keep
their **Tenjin** attribution links; the web app carries
`utm_source=kygo.app&utm_medium=header|footer&utm_campaign=nav`. Both fire the same Mixpanel
`cta_clicked` `{slug:"nav", surface, destination}` that the in-page `<kygo-cta>` element sends.

## If the live site ever drifts from these files
The live Wix editor is the source of truth for what's deployed; these files are a mirror. When you
change one in Wix, update the matching file here so they stay in sync.
