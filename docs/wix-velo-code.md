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
| `kygo-blog-subscribe` | `#kygoSubscribe` | `subscribe` → `state` | inserts email, sets `state=success`/`idle` | `Subscribers` |
| `calories-in-anything` | `#caloriesElement` | `imageUploaded` → `analyzing`/`result`/`error` | calls `analyzeImage` (Gemini) | `backend/gemini.web.js` (secret `GEMINI_API_KEY`) |
| `kygo-faq-section` | `#kygoFaq` | (Wix set `app-store-url`/`email`) | — | — *(now defaults in-component; Wix wiring removable)* |

## Wix Data collections & secrets used
- **`ContactSubmissions`** — contact form entries (contactForm backend).
- **`Subscribers`** — newsletter signups (blog post subscribe).
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

### Blog post page — ✅ KEEP (live, required)
Handles `#kygoCats` (categoryClick), `#kygoRelated` (postClick/seeAllClick), `#kygoSubscribe`
(subscribe → `Subscribers` collection, state flipped via `setAttribute('state', …)`). No dead code.
*(Full code mirrored in the Wix editor; data flow captured in the map table above.)*

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
