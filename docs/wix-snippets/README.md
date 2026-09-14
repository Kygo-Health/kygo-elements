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

## The header and footer now load their JS from GitHub Pages (2026-09-14)
Wix caps a custom-code embed at **15,000 characters**, and the footer no longer fitted. Both
blocks were therefore split: the `<style>` stays **inline in the embed** (so the bar paints
before anything loads, no flash of unstyled header) and the markup + behaviour moved to
**`kygo-header.js`** and **`kygo-footer.js`** at the repo root, served from GitHub Pages like
every other component. The embeds are now 8.1 KB and 6.4 KB.

**Deploy order matters:** GitHub Pages serves the **default branch**, so merge the branch
carrying these two files to `main` *before* pasting the embeds. Paste first and the header and
footer render empty until the merge lands. After that, editing a header or footer is a push, not
a re-paste.

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
