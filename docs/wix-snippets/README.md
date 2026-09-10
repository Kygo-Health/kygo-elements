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
| `5-custom-header-body-start.html` | Body – start → "Kygo Custom Header" | Replace block (`/contact` slug) |
| `6-custom-footer-body-end.html` | Body – end → "Kygo Custom Footer" | Replace block — **adds the native footer subscribe strip** (POSTs `{email, source:"footer"}` to `/_functions/subscribe`) |

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

## If the live site ever drifts from these files
The live Wix editor is the source of truth for what's deployed; these files are a mirror. When you
change one in Wix, update the matching file here so they stay in sync.
