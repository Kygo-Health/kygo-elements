# Wix Velo Code (page + backend) — Reference

> The components in this repo are embedded as **Wix Custom Elements**. Some of them talk to
> **Wix Velo** code (page code + backend web modules) that lives **in the Wix editor, not in this
> repo**. This file documents that Velo code so it's version-controlled context — when a component
> dispatches an event or reads an attribute, this is what's on the other end.
>
> **This is documentation only** — editing it does not change the live site. Update the Wix editor,
> then mirror the change here. Keep it in sync.

## How the bridge works

Components are isolated in Shadow DOM and communicate with the Wix host two ways (see `CLAUDE.md`):
- **Component → Wix:** `dispatchEvent(new CustomEvent(name, { detail, bubbles:true, composed:true }))`
  with **plain-data `detail`** (Wix bridges events over postMessage/structured clone — no functions).
- **Wix → Component:** the host responds by **`setAttribute(...)`** (never a callback), handled in
  the component's `attributeChangedCallback`.

## Event / attribute map (component ↔ Wix)

| Component (tag) | Wix element id | Component → event / Wix → attribute | Wix handler does | Backend / collection |
|---|---|---|---|---|
| `kygo-contact-section` | `#contactSection` | `contactSubmit` → `data-form-result` | calls `submitContactForm`, sets `data-form-result=success`/`error:…` | `backend/contactForm.web.js` → `ContactSubmissions` |
| `kygo-tools-page` | `#customElement1` | Wix sets `tools` attr (JSON) | injects the 14-tool grid data | — (data inline in Velo) |
| `kygo-blog` | `#kygoBlog` | Wix sets `posts`; `postClick` | queries `Blog/Posts`, navigates to `/post/<slug>` | `Blog/Posts` |
| `kygo-blog-post-categories` | `#kygoCats` | Wix sets `categories`; `categoryClick` | queries `Blog/Categories`, navigates | `Blog/Categories` |
| `kygo-blog-post-related` | `#kygoRelated` | Wix sets `posts`; `postClick`, `seeAllClick` | related posts via Blog API, navigates | `Blog/Posts` |
| `kygo-blog-subscribe` | *(none — self-posts)* | POSTs `{email, source:"blog-post"}` to `/_functions/subscribe`; also fires `subscribe` doc event for GA4 | — (no page-code binding; endpoint writes the row) | `backend/http-functions.js` → `Subscribers` |
| `kygo-inline-subscribe` | *(none — nested in tool, self-posts)* | POSTs `{email, source:"tool-<name>"}` to `/_functions/subscribe`; fires `subscribe` doc event for GA4 | — | `backend/http-functions.js` → `Subscribers` |
| *footer subscribe strip* (plain HTML in snippet 6) | *(none)* | POSTs `{email, source:"footer"}` to `/_functions/subscribe`; fires `subscribe` doc event for GA4 | — | `backend/http-functions.js` → `Subscribers` |
| `calories-in-anything` | `#caloriesElement` | `imageUploaded` → `analyzing`/`result`/`error` | calls `analyzeImage` (Gemini) | `backend/gemini.web.js` (secret `GEMINI_API_KEY`) |
| `kygo-faq-section` | `#kygoFaq` | (Wix set `app-store-url`/`email`) | — | — *(now defaults in-component; Wix wiring removable)* |

> **Email capture — native POST model (email-capture pass, spec 24).** All three subscribe
> surfaces (blog, inline-on-tools, footer) capture natively: each **POSTs `{ email, source }`
> to the same-origin Velo HTTP endpoint `/_functions/subscribe`** and drives its own success/
> error UI from the HTTP response — there is **no** Wix page-code element binding and **no**
> `state`-attribute round-trip anymore (the tool + footer forms aren't standalone Wix
> elements, so `$w('#id').on('subscribe')` could never reach them). Separately, each form also
> dispatches a `subscribe` **document** event (`bubbles`+`composed`, `detail {email, source}`)
> that `kygo-tracking.js` mirrors to GA4 as `email_subscribe` with the `source` param. The old
> blog-post page code `$w('#kygoSubscribe').on('subscribe', …)` is **retired** — delete it once
> the endpoint below is live.

## Wix Data collections & secrets used
- **`ContactSubmissions`** — contact form entries (contactForm backend).
- **`Subscribers`** — newsletter signups. Now written by the **`/_functions/subscribe`** HTTP
  endpoint (below) for every source: `blog-post`, `footer`, and `tool-<name>` (one per tool, e.g.
  `tool-wearable-accuracy`). Fields: `email` (Text), `source` (Text), `subscribedAt` (Date & Time).
- **`Blog/Posts`, `Blog/Categories`** — native Wix Blog collections (blog + blog-post pages).
- **Secret `GEMINI_API_KEY`** — Gemini API key for the food scanner (gemini backend).

---

# Page code by page

### Contact page — ✅ KEEP (live, required)
Component dispatches `contactSubmit`; this calls the backend and reports the result back.
```js
import { submitContactForm } from 'backend/contactForm.web';

$w.onReady(function () {
  const contactSection = $w('#contactSection');
  contactSection.on('contactSubmit', async (event) => {
    const formData = event.detail;
    try {
      const result = await submitContactForm(formData);
      if (result.success) {
        contactSection.setAttribute('data-form-result', 'success');
      } else {
        contactSection.setAttribute('data-form-result', 'error:' + (result.error || 'Something went wrong'));
      }
    } catch (error) {
      contactSection.setAttribute('data-form-result', 'error:Something went wrong. Please try again.');
    }
  });
});
```

### Tools page — ❌ REMOVE all (tools list now baked into the component)
The 14-tool grid is now the **built-in default** in `kygo-tools.js` (`_defaultTools()`), so the
page needs no Velo code. Reduce to `$w.onReady(function () {});`. (The component still accepts a
`tools` attribute, so Wix *can* override the list, but doesn't need to.) The old `android-signup`
block is dead and goes away with the rest.
- ✅ The `Stress Factor Explorer` URL is reconciled: real route is `/tools/stress-factors`, and the
  `kygo-wearable-stress.js` canonical/breadcrumb were corrected to match.
- ℹ️ Factor-count copy (HRV "38" vs component ~43–44, staying-asleep "27" vs ~36, deep-sleep "28"
  vs 29) now lives in `_defaultTools()` in the repo — adjust there if you want exact numbers.

### Blog page — ✅ KEEP (live, required)
```js
import wixData from 'wix-data';
import wixLocationFrontend from 'wix-location-frontend';

$w.onReady(async function () {
  const blogElement = $w('#kygoBlog');
  const results = await wixData.query("Blog/Posts").include("categories").limit(20).find();
  const sortedItems = results.items.sort((a, b) =>
    new Date(b.firstPublishedDate).getTime() - new Date(a.firstPublishedDate).getTime());
  const posts = sortedItems.map(post => { /* …maps coverImage (wix:image:// → static.wixstatic.com), category… */ });
  blogElement.setAttribute('posts', JSON.stringify(posts));
  blogElement.on('postClick', (event) => wixLocationFrontend.to(`/post/${event.detail.slug}`));
});
```

### Blog post page — ✅ KEEP (live, required) — ⚠️ REMOVE the old subscribe handler
Handles `#kygoCats` (categoryClick) and `#kygoRelated` (postClick/seeAllClick). **Remove** the old
`$w('#kygoSubscribe').on('subscribe', …)` block: as of the email-capture pass, `kygo-blog-subscribe`
POSTs to `/_functions/subscribe` itself (see the endpoint below), so the page-code binding is dead.
Keep the categories + related-posts wiring. *(Full code mirrored in the Wix editor.)*
Related posts must come from each post's hand-picked selections: look the current post up in
`Blog/Posts` by slug and `.include('relatedPosts')` (a **multi-reference** field), then read
`currentPost.relatedPosts`. Do **not** use `$w('#post1').getPost().relatedPostIds` — the on-page
Blog widget's post object doesn't carry related-posts data, so that path always fell through to the
newest-3 fallback. Fall back to newest-3 only when a post has no picks. *(Mirror in `kygo-blog-post.js`.)*

### Calories-in-anything page — ⚠️ KEEP `imageUploaded`, REMOVE `android-signup`
```js
import { analyzeImage } from 'backend/gemini.web';

$w.onReady(function () {
  const customElement = $w('#caloriesElement');
  customElement.on('imageUploaded', async (event) => {
    const { base64, mode } = event.detail;
    try {
      customElement.setAttribute('analyzing', 'true');
      const result = await analyzeImage(base64);
      customElement.setAttribute('result', JSON.stringify(result));
    } catch (error) {
      customElement.setAttribute('error', 'Failed to analyze image. Please try again.');
    }
  });
  // ❌ REMOVE: import wixCrm + customElement.on('android-signup', …)
});
```

### FAQ page — ❌ REMOVE all (now redundant)
After `kygo-faq-section.js` was given correct in-component defaults (App Store URL + support
email), this page needs **no** Velo code. The old code set a **broken placeholder App Store ID
(`id123456789`)** and a dead `android-signup` handler. Reduce to `$w.onReady(function () {});`.
*(Order: deploy the updated component first, then remove the Wix code — see `fixes-and-issues.md`.)*

### Homepage — ❌ REMOVE all (no code needed)
Homepage sections are self-contained (the founder-CTA App Store link already defaults correctly)
and emit no events. The old `android-signup` handler on `#customElement1`/`#customElement6` is dead
— and those ids disappear once you switch to the single `kygo-home` embed. Reduce to
`$w.onReady(function () {});`.

### Sleep Metrics / Wearable Accuracy / Step Count Accuracy — ❌ REMOVE all
Each page's Velo code is **only** the dead `android-signup` handler. These pages need no host
wiring (the components render standalone). Reduce each to `$w.onReady(function () {});`.

---

# Backend web modules

### `backend/http-functions.js` — 🚀 ADD (email-capture pass, spec 24) — **REQUIRED for the rollout**
Exposes `POST /_functions/subscribe`. Every subscribe surface (blog, inline-on-tools, footer)
POSTs `{ email, source }` here; it writes one `Subscribers` row and returns `200 {ok:true}`.
Same-origin (served from the site domain), so **no CORS needed** from the components.

```js
// backend/http-functions.js
import { ok, badRequest, serverError } from 'wix-http-functions';
import wixData from 'wix-data';

// POST /_functions/subscribe   body: { email, source }
export async function post_subscribe(request) {
  const json = (body) => ({ headers: { 'Content-Type': 'application/json' }, body });
  try {
    const data = await request.body.json();
    const email = (data.email || '').trim().toLowerCase();
    const source = (data.source || 'unknown').toString().trim().slice(0, 60);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return badRequest(json({ ok: false, error: 'invalid_email' }));
    }
    // De-dupe on email so repeat submits don't create duplicate rows.
    const existing = await wixData.query('Subscribers').eq('email', email).limit(1).find({ suppressAuth: true });
    if (existing.items.length === 0) {
      await wixData.insert('Subscribers', { email, source, subscribedAt: new Date() }, { suppressAuth: true });
    }
    return ok(json({ ok: true }));
  } catch (e) {
    return serverError(json({ ok: false, error: 'server_error' }));
  }
}
```

- `Subscribers` collection must exist with fields `email` (Text), `source` (Text),
  `subscribedAt` (Date & Time), and **"Who can add content?" = Anyone** (or rely on the
  `suppressAuth: true` elevation above).
- The component always shows success **only on a real `200`**; any non-2xx / network error shows a
  retry message (never a fake "thank you"), and the `subscribe` GA4 event fires **only** on 200 —
  so `email_subscribe` stays a clean success metric.

> **QA gate (before publishing the full rollout).** On the **published** site, submit the inline
> strip on **wearable-accuracy** and confirm **both**: (1) a `Subscribers` row appears with
> `source = "tool-wearable-accuracy"`, and (2) GA4 fires `email_subscribe` with `source =
> "tool-wearable-accuracy"`. If the row does **not** appear (endpoint missing/misnamed), **stop** —
> a live form would fire GA4 while writing nothing to CMS. Deploy order: (a) add this endpoint +
> `Subscribers` collection, (b) remove the old blog-post page `subscribe` handler, (c) deploy the
> two snippet changes (footer strip + the site-wide `kygo-inline-subscribe.js` loader in the GA4
> head snippet), (d) re-point the tool/blog embeds at the new commit.

### `backend/contactForm.web.js` — ✅ KEEP (live, required)
Validates the contact form and inserts into the **`ContactSubmissions`** collection
(`suppressAuth: true`). Returns `{ success, error? , submissionId? }`. Validations: all fields
required, email regex, name ≤100 chars, message ≤5000 chars. Maps `subject` → human label.
*(Full source mirrored in the Wix editor.)*

### `backend/gemini.web.js` — ✅ KEEP (live, required)
`analyzeImage(imageBase64)` → calls **Gemini `gemini-2.0-flash`** with a nutritionist system
prompt + strict JSON `responseSchema` (item, isFood, calories, breakdown, vitamins, healthScore,
etc.). Reads secret **`GEMINI_API_KEY`** via elevated `secrets.getSecretValue`. Handles SAFETY
finishReason. 
- ⚠️ **Minor bug:** the size guard checks `6 * 1024 * 1024` (6 MB) but the error message says
  "under 4MB" — align the message and the limit.
- Model is pinned to `gemini-2.0-flash`; revisit as newer Gemini models ship.

---

# 🧹 Cleanup checklist (review outcome)

**Remove the dead `android-signup` handler + `import wixCrm from 'wix-crm';` from these 7 pages**
(the beta waitlist is retired and **no component emits `android-signup`**):

| Page | After cleanup |
|---|---|
| Homepage | empty `$w.onReady` |
| FAQ | empty `$w.onReady` (also drop the `setAttribute` lines) |
| Tools | empty `$w.onReady` (tools list now baked into `kygo-tools.js`) |
| Calories-in-anything | keep only the `imageUploaded` handler |
| Sleep Metrics | empty `$w.onReady` |
| Wearable Accuracy | empty `$w.onReady` |
| Step Count Accuracy | empty `$w.onReady` |

**Also (in Wix Velo / content):**
- ✅ Tools `Stress Factor Explorer` URL reconciled — real route `/tools/stress-factors`; component
  canonical corrected to match.
- Factor-count copy now lives in `kygo-tools.js` `_defaultTools()`; adjust there for exact numbers.
- Align the **Gemini size limit message** ("4MB") with the actual check (6 MB).

**Keep (live, required):** Contact (page + backend), Blog, Blog Post,
Calories `imageUploaded` + Gemini backend.
