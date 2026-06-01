# CLAUDE.md — kygo-elements

Guidance for working in this repo. Read this before editing or creating components.

## Reference docs (read when relevant)

- **`docs/about-kygo.md`** — what the Kygo app actually does (features, wearables, data sources,
  Free vs Pro). Use it to keep page copy, `__seo` summaries, and JSON-LD accurate.
- **`docs/internal-and-app-store-links.md`** — every internal kygo.app + app-store link, by file.
- **`docs/affiliate-links.md`** — every Amazon/affiliate link, the product it points to, and where.

## What this repo is

A flat collection of **standalone vanilla-JS Web Components** (custom elements) that power
the **Kygo Health** marketing/content site. Each `kygo-*.js` file is one self-contained
component (or a small bundle of related ones) that registers itself with
`customElements.define(...)`.

There is **no build step, no bundler, no package manager, no tests, and no lint**. Files are
authored by hand and shipped exactly as written. Do not introduce a build pipeline, add
`import`/`export` statements, or convert files to modules unless explicitly asked — the deploy
model depends on these being plain, directly-servable scripts.

## How it ships (deploy model)

1. Files are committed to this repo and served **raw** via **GitHub Pages** and the
   **jsDelivr CDN** (`https://cdn.jsdelivr.net/gh/Kygo-Health/kygo-elements@<branch>/<file>.js`).
2. The Kygo site is built on **Wix**. Each component is embedded as a **Wix Custom Element**
   pointing at one of these script URLs.
3. New code goes live by **committing + pushing**; the page cache-busts with `?v=Date.now()`.
   There is no release step — a merged commit *is* the deploy.

Because there's no test/CI gate, correctness is verified by **previewing in a browser**
(see "Previewing" below). Be conservative: a broken file ships to production as-is.

## Component anatomy (the house style)

Every component follows the same shape. Match it exactly when editing or adding one.

```js
/**
 * Kygo Health - <Human Name> Custom Element for Wix
 * Tag name: kygo-<name>
 */

/** Injects accessible text into light DOM so crawlers and AI tools can read component content */
function __seo(el, text) {
  if (el.querySelector('[data-seo]')) return;
  const d = document.createElement('div');
  d.setAttribute('data-seo', '');
  d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
  d.textContent = text;
  el.appendChild(d);
}

class KygoName extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._attachEventListeners();
    this._setupScrollAnimations();
    __seo(this, '<plain-text summary of the page content for SEO / LLM crawlers>');
    this._injectStructuredData();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  static get observedAttributes() { return ['wixsettings', /* ...settable props */ ]; }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'wixsettings') { this._parseWixAttributes(); this.render(); this._attachEventListeners(); }
  }

  _parseWixAttributes() {
    try {
      const wixconfig = this.getAttribute('wixconfig');
      const wixsettings = this.getAttribute('wixsettings');
      if (wixconfig) this._config = JSON.parse(wixconfig);
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {
      console.warn('KygoName: Could not parse Wix attributes', e);
    }
  }

  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }

  render() {
    this.shadowRoot.innerHTML = `<style>/* :host tokens + styles */</style> ...markup...`;
  }

  _attachEventListeners() { /* query shadowRoot, wire handlers */ }
  _setupScrollAnimations() { /* IntersectionObserver on .animate-on-scroll */ }
  _injectStructuredData() { /* JSON-LD into document.head, guarded by a data-* marker */ }
}

customElements.define('kygo-name', KygoName);
```

### Key conventions, and why they exist

- **Shadow DOM (`mode: 'open'`)** isolates component styles from the Wix host page. All
  styles live inside the component's `<style>` block in `render()`; there is no external CSS.
- **`__seo(this, text)`** copies a plain-text summary into the **light DOM** (visually hidden).
  Shadow DOM content is invisible to many crawlers/LLMs, so this is how the page stays
  indexable. Every content page should call it with an accurate, keyword-rich summary.
- **`_injectStructuredData()`** appends JSON-LD (`application/ld+json`) to `document.head`,
  **guarded by a unique `data-kygo-*-ld` marker** so it's only injected once. Common types in
  use: `FAQPage`/`Question`/`Answer`, `BreadcrumbList`, `Organization`, `WebApplication`,
  `HowTo`/`HowToStep`, `ScholarlyArticle`, `ContactPage`. Keep `url` values pointing at the
  real `https://www.kygo.app/...` page.
- **Wix settings bridge**: Wix passes config as the `wixsettings`/`wixconfig` **attributes**
  (JSON strings). Read them via `_getSetting(key, fallback)` so the component still renders
  with sensible defaults when opened standalone.
- **Events to Wix Velo**: dispatch `CustomEvent` with `bubbles: true, composed: true` and a
  **plain-data `detail` only** (no functions — Wix bridges events over postMessage/structured
  clone, which can't serialize functions). The host reports results back by setting an
  attribute (e.g. `data-form-result="success"`), handled in `attributeChangedCallback` — never
  via a callback. See `kygo-contact.js` for the canonical form-submit pattern (including the
  10s safety timeout that surfaces a real error instead of faking success).
- **Scroll animations**: elements get class `animate-on-scroll`, revealed by an
  `IntersectionObserver` that adds `.visible`. Always disconnect observers in
  `disconnectedCallback`.
- **Cleanup**: anything created in `connectedCallback` (observers, timeouts, listeners) must be
  torn down in `disconnectedCallback`.

## Design tokens (documented; keep inline)

Tokens are **intentionally duplicated inline** in each component's `:host` block — there is no
shared stylesheet, and that's deliberate (zero extra network request, no cross-file coupling at
the CDN). When adding a component, copy the token block below rather than importing anything.

**Brand palette (canonical — used by ~20 files):**
```css
:host {
  --dark: #1E293B;
  --light: #F8FAFC;
  --green: #22C55E;          /* Kygo brand green */
  --green-dark: #16A34A;
  --green-light: rgba(34, 197, 94, 0.1);
  --gray-50: #f9fafb;
  --gray-200: #E2E8F0;
  --gray-400: #94A3B8;
  --gray-600: #475569;
  --red: #EF4444;
  display: block;
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--light);
  color: var(--dark);
  line-height: 1.6;
}
```

**Newer semantic palette (used by the comparison pages `kygo-oura-ring-comparison.js`,
`kygo-sensor-comparison.js`):** `--fg-1:#0F172A`, `--fg-2:#475569`, `--fg-3:#94A3B8`,
`--bg-canvas:#FFFFFF`, `--bg-surface:#F8FAFC`, `--bg-raised:#F1F5F9`, `--border-subtle:#E2E8F0`,
`--kygo-green:#22C55E`, `--kygo-green-dark:#16A34A`. The same brand colors, just
semantically named. **Match the palette of whichever file/section you're editing**; for a brand
new page, the canonical palette above is the safe default.

**Fonts** (loaded via `@import` at the top of the `<style>` block):
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
```
- Body: `'DM Sans'` · Headings: `'Space Grotesk'` (weight 600).

**Layout conventions:** `.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }`,
mobile-first with `@media (min-width: 768px)` breakpoints, fluid type via
`clamp(min, vw, max)`, `box-sizing: border-box` reset.

## Previewing a component

There's no dev server. Use a per-component HTML harness (see `test-stress.html` as the model):
it renders the tag and loads the script with a `?v=Date.now()` cache-bust so you always see the
latest commit. Open it in a browser (or via the `run`/`verify` skills). For a live CDN preview,
point the `<script src>` at the jsDelivr branch URL shown in `test-stress.html`.

## Content sources

Page copy is researched/drafted in the Markdown + JSON files at the repo root
(`*_Research_Consolidated.md`, `*_reference.md`, `*-content.md`, `*_tool_data.*`,
`step-count-accuracy-tool-data.json`). When building or updating a content page, treat these as
the source of truth for facts and figures, and keep the component's copy + JSON-LD consistent
with them.

## Adding a new page — checklist

Prefer the **`new-page` skill** (`.claude/skills/new-page/`) to scaffold, then fill it in. By hand:

1. Create `kygo-<name>.js` with the header comment (`Tag name: kygo-<name>`) and the anatomy above.
2. Inline the font `@import`, the `:host` token block, and a `*,*::before,*::after` reset.
3. Build markup in `render()` from `_getSetting(...)` values so it works standalone and in Wix.
4. Add an accurate `__seo(this, ...)` summary and a `_injectStructuredData()` block with the
   right schema.org type, guarded by a unique `data-kygo-<name>-ld` marker.
5. Register with `customElements.define('kygo-<name>', KygoName)`.
6. Add a `test-<name>.html` harness and preview it in a browser.
7. Disconnect observers/timeouts in `disconnectedCallback`.
8. Keep `class` and tag names consistent: `KygoName` ↔ `kygo-name`.

## Conventions recap (do / don't)

- **Do** keep everything in one plain script per component; **don't** add imports/exports/build tooling.
- **Do** duplicate tokens inline; **don't** create a shared stylesheet.
- **Do** keep `detail` payloads plain-data; **don't** pass functions to Wix events.
- **Do** verify in a browser before pushing; **don't** assume — there is no CI safety net.
- **Do** match the surrounding file's palette/idiom; **don't** mix the two token naming schemes within one file.

## Git / workflow

- Work on the assigned feature branch; commit with clear messages; push with `git push -u origin <branch>`.
- Do **not** open a PR unless explicitly asked.
