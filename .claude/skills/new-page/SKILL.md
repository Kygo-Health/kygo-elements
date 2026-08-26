---
name: new-page
description: Scaffold a new Kygo Health custom-element page/component following the repo's house style (shadow DOM, __seo light-DOM text, JSON-LD structured data, Wix settings bridge, inline design tokens) plus a matching test-*.html preview harness. Use when the user asks to create a new kygo-* component, page, or section in the kygo-elements repo.
---

# new-page — scaffold a Kygo custom element

Creates a new `kygo-<name>.js` component and a `test-<name>.html` preview harness that match the
conventions documented in the repo root `CLAUDE.md`. Read `CLAUDE.md` first if you haven't —
this skill assumes that house style.

> **If the new page is a full-page tool** (comparison chart, factor explorer, calculator), read
> **`docs/tool-page-playbook.md`** and build to it: the semantic palette, the standard section
> skeleton, the reusable modules (logo comparison matrix, collapsible category dropdowns, the
> standard sources module), the brand-logo map, the mobile/scroll-reveal gotchas, and the
> pre-commit checklist.
> Use `kygo-oura-ring-comparison.js` / `kygo-vo2max-accuracy.js` as the reference implementations,
> and register the new tool in `kygo-tools.js` — including **a green "data-motif" card** for it
> (`_motifFor`/`_motifBody`); see the playbook §6 for the motif catalog and the teaser rules.

## Inputs to determine (ask the user only if unclear)

- **Tag name**: `kygo-<name>` (kebab-case). Class name is the PascalCase form, e.g.
  `kygo-rhr-trends` → `KygoRhrTrends`.
- **Human name / purpose**: one line for the header comment + SEO summary.
- **Schema.org type** for JSON-LD: pick by page kind —
  `FAQPage` (Q&A), `HowTo` (step guides), `WebApplication` (interactive tools),
  `Article`/`ScholarlyArticle` (content/research), `CollectionPage`/`BreadcrumbList` (hubs),
  `Organization`/`ContactPage` (company pages). Default to `WebPage` if none fit.
- **Content source**: check the root `*.md` / `*.json` research files for facts to use.

## Steps

1. Read `CLAUDE.md` and one existing component close to the target kind (e.g. `kygo-contact.js`
   for forms, `kygo-faq-section.js` for FAQ/JSON-LD, `kygo-oura-ring-comparison.js` for the
   newer comparison-page palette) to match idiom and palette.
2. Copy `.claude/skills/new-page/templates/component-template.js` to `kygo-<name>.js` and
   replace every `__NAME__`/`__CLASS__`/`__TAG__`/`__...__` placeholder.
3. Fill in: the `:host` token block (use the canonical palette unless matching a sibling page),
   the `render()` markup from `_getSetting(...)` values, an accurate `__seo(this, ...)` summary,
   and a `_injectStructuredData()` block with the chosen schema.org type guarded by a unique
   `data-kygo-<name>-ld` marker.
4. Copy `.claude/skills/new-page/templates/preview-template.html` to `test-<name>.html`,
   replacing the tag name and script filename.
5. Preview in a browser (use the `run` or `verify` skill) and sanity-check: renders standalone,
   no console errors, `[data-seo]` text present in light DOM, JSON-LD valid.
6. Do **not** add a build step, imports/exports, or external CSS. Keep it a single plain script.
7. **Every tool page gets the full hero anatomy** — pill, two-tone `<h1>` with a green `.hl`
   span, lede, a `hero-vis` visual, and a 4-up `hero-stats` strip, in a `hero-grid` that stacks
   below 880px. The `hero-vis` is not optional: it must state something true and specific to the
   page, taken from the page's own data. Compute the pill and stat numbers from the data getters
   (a `_heroStats` getter) rather than typing them in, so they cannot drift. Copy the hero CSS
   from a page on your palette. Spec in `docs/tool-page-playbook.md` §3 "Hero (the standard
   anatomy)".
8. **Every tool page gets the standard app-CTA module** — the dark card, on its **own
   section, directly after the first content section**, holding the card and nothing else
   (the `<kygo-inline-subscribe>` capture goes further down the page, never in or beside that
   band). Copy `_renderAppCta(bg)` verbatim and write only `_appCta()` — slug, a headline with
   one `<span>` for the green phrase, and a sub. Don't use the retired thin `kband`. Pass
   `'gray'` when the section above is white, and re-check the whole page's band rhythm after
   inserting it. Spec in `docs/tool-page-playbook.md` §3 "App CTA (the standard module)".
9. **Every tool page gets the standard related-tools module — do not design a new one.** Copy
   `_relatedTools` / `_relatedMotif` / `_renderRelatedTools` verbatim from any shipped tool (they
   are byte-identical across all of them) and call `${this._renderRelatedTools()}` directly above
   the sources section, or low on the page if the tool has no sources. Write only
   `_relatedTools()`: exactly 3 cards — a near neighbour, a bridge between accuracy and
   physiology, and one from another family. Never link the page to itself, and **never link the
   Food Scanner** (`/tools/calories-in-anything`). Reuse the destination's existing card copy
   rather than rewriting it, then add the new page to the cross-link table in
   `docs/internal-and-app-store-links.md` and give it inbound links from 2+ sibling tools.
   Full spec in `docs/tool-page-playbook.md` §3 "Related tools (the standard module)".
10. **If the page cites sources, use the standard sources module — do not design a new one.**
   Copy `_renderSourceCards` / `_renderSources` / `_toggleSources`, the `.src*` CSS block and the
   `<div class="sources-wrap animate-on-scroll">${this._renderSources()}</div>` call site verbatim
   from `kygo-sleep-tracker-accuracy.js` (the reference; the module is byte-identical across every
   shipped tool). Supply `get _sources()` returning `{ tag, title, cite, url }` — `tag` carries
   the funding or the topic group, `cite` and `url` are optional. Take the CSS variant matching
   your file's palette, and wire the toggle into the page's click listener:
   `if (e.target.closest('[data-src-toggle]')) { this._toggleSources(); return; }`.
   Full spec in `docs/tool-page-playbook.md` §3 "Sources (the standard module)".

## Guardrails

- Match `class` ↔ tag name exactly; register with `customElements.define('kygo-<name>', Class)`.
- Tokens stay inline (no shared stylesheet). Don't mix the two token naming schemes in one file.
- Wix event `detail` must be plain data only (no functions). Disconnect observers/timeouts in
  `disconnectedCallback`.
- App CTA, related tools and sources all use their standard modules, unchanged. One app-download
  surface per page: the CTA card, no `kband`. Keep the related-tools
  tracking attributes (`data-action="related-tool"`, `data-tool-slug`, `data-track-position`).
- Sources use the standard module, unchanged. No per-page accordions, `<details>` groups, or
  separate desktop/mobile source renderings — those were all consolidated away.
- This repo has no CI — verify visually before committing.
