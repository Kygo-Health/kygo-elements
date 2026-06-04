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
> skeleton, the reusable modules (logo comparison matrix, collapsible category dropdowns, compact
> sources), the brand-logo map, the mobile/scroll-reveal gotchas, and the pre-commit checklist.
> Use `kygo-oura-ring-comparison.js` / `kygo-vo2max-accuracy.js` as the reference implementations,
> and register the new tool in `kygo-tools.js`.

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

## Guardrails

- Match `class` ↔ tag name exactly; register with `customElements.define('kygo-<name>', Class)`.
- Tokens stay inline (no shared stylesheet). Don't mix the two token naming schemes in one file.
- Wix event `detail` must be plain data only (no functions). Disconnect observers/timeouts in
  `disconnectedCallback`.
- This repo has no CI — verify visually before committing.
