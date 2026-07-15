# Tool-Page Playbook — building comparison / explorer / calculator pages

This is the **standard for full-page interactive tools** (comparison charts, factor
explorers, calculators) embedded as Wix Custom Elements — e.g.
`kygo-oura-ring-comparison`, `kygo-vo2max-accuracy`, `kygo-vo2max-factors`,
`kygo-wearable-stress`. Follow it so a new tool ships at the same quality **without a
review round for every detail**. The reference implementation is
`kygo-oura-ring-comparison.js` (the design gold standard); the two VO2 max tools were
rebuilt to match it.

> This complements the component anatomy in `CLAUDE.md`. CLAUDE.md governs all components;
> this doc governs the **tool/comparison/explorer** subset specifically.

---

## 1. Design system (non-negotiable)

Use the **semantic palette only**. Copy this `:host` block verbatim:

```css
:host{
  --kygo-green:#22C55E; --kygo-green-dark:#16A34A; --kygo-green-light:#DCFCE7;
  --kygo-dark:#0F172A; --kygo-light:#F8FAFC;
  --bg-canvas:#FFFFFF; --bg-surface:#F8FAFC; --bg-raised:#F1F5F9;
  --fg-1:#0F172A; --fg-2:#475569; --fg-3:#94A3B8;
  --border-subtle:#E2E8F0;
  --shadow-md:0 8px 24px rgba(15,23,42,.06); --shadow-cta:0 8px 24px rgba(34,197,94,.30);
  --font-display:'Space Grotesk',sans-serif; --font-body:'DM Sans',sans-serif;
  --ease-out:cubic-bezier(.16,1,.3,1);
}
```

**Colour rules (this is what caused the most rework):**
- **Green + neutral slate + dark only.** NO amber, red, blue, orange, purple, teal, or
  per-brand device colours anywhere. Verify before committing:
  `grep -nEi "amber|#f59e0b|#ef4444|#3b82f6|#f97316|--red|--blue|--amber|purple|orange" file.js`
  → must be empty.
  ⚠️ If you copy `kygo-wearable-stress.js` as a base, it ships with `--red`/`--amber`/`--yellow`
  tokens and red/amber `pick-card.warn`/`.myth` accents — **strip those** (recovery did) so the
  rendered page stays green+slate+dark.
- Convey **good vs bad / direction** with **green vs muted-grey + an icon** (check / dash /
  up-arrow / down-arrow), never with extra hues. "Win/validated/raises" = green;
  everything else = `--bg-raised`/`--fg-2`; strongest emphasis = `--kygo-dark` (dark chip).
- Fonts: headings & numbers `--font-display` (Space Grotesk 600/700), body `--font-body`
  (DM Sans). Inline the `@import` at the top of the `<style>` block.

---

## 2. Page skeleton (sections, in order)

Every tool page is the same spine. Sections **alternate backgrounds** `bg-light` ↔ `bg-white`
with **no two adjacent the same**, and **each distinct content block is its own `<section>`**
(don't stack two modules in one section — that was a fix on the VO2 accuracy tool).

1. **Sticky nav** — brand (logo + a short tool name) left, **"Get Kygo Health →"** link right.
   (Client prefers "Get Kygo Health" over "Get App"/"Get Kygo App" — use it on new tools.)
2. **Hero** (`hero-light`, white) — `hero-pill` kicker, `<h1>` with a green `.hl` span, a
   `hero-lede`, a **`hero-vis`** (a clean supporting visual — a small chart or a dark stat
   card), and a **`hero-stats`** strip of 4 numbers (2×2 on mobile, 4-up desktop).
   **Align the hero `<h1>` + lede with the page's meta title/description** so the first screen
   matches what the SERP promised (e.g. meta "Compare … 12 wearables" → h1 "Compare recovery
   scores across 12 wearables"). Meta title/description themselves are **Wix page-SEO settings**,
   not component-injected — hand them to the client; the component only controls the visible copy
   + JSON-LD.
3. **Content sections** — each: `kicker` pill + `<h2>` (with `.hl`) + `lede`, then the module.
4. **Kygo CTA card** — dark card, green radial glow, pill, headline, iOS + Android buttons,
   "Works with" badge row. (Reuse from any tool; just swap copy.) **Clickable store buttons use
   the Tenjin attribution links** (Website channel): iOS `cta-primary` →
   `https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy`, Android `cta-android` →
   `https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO`. These resolve to the App Store /
   Play Store and let Tenjin attribute the install. **Only user-clickable anchor hrefs get the
   Tenjin link** — JSON-LD `downloadUrl`/`installUrl` and any other structured-data store URL
   must stay the real App Store URL `apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589`.
   Keep the `data-track-position`/`data-track-label`/`data-action` attributes and the
   `cta-primary`/`cta-android` classes so `kygo-tracking.js` still classifies the click.)
5. **Blog cross-link** card → the matching `kygo.app/post/...` article. For a **multi-post
   cluster**, use the *hub-and-spoke* pattern: each content section also gets a small
   `section-readmore` link to its *own* matching post (matrix→comparison post, validation→trust
   post, factor explorer→intake post), and the one big CTA card leads with the primary spoke.
6. **FAQ** — accordion of `<details>`. Drive it AND the `FAQPage` JSON-LD from one `_faqs`
   getter (never let JSON-LD FAQs exist without a visible FAQ — the older `kygo-wearable-stress`
   shipped FAQ JSON-LD with **no** visible FAQ; don't copy that omission).
7. **Sources** — **compact link list** (see §4), not big expandable cards.
8. **Footer** — brand, tagline, links, disclaimer, copyright. **If the page has any affiliate
   links, add the Amazon Associates disclosure line** (`footer-affiliate`): "As an Amazon
   Associate, Kygo Health earns from qualifying purchases. Product links on this page are
   affiliate links — we may earn a commission at no extra cost to you."

Also required: `__seo(this, …)` light-DOM summary, and `_injectStructuredData()` injecting
`WebApplication` + `FAQPage` JSON-LD (guarded by unique `data-kygo-*` markers).

---

## 3. Reusable modules

### Comparison matrix (the "logo chart")
The canonical way to compare devices/products. Pattern lives in `kygo-wearable-stress.js`
(`.device-table`) and `kygo-vo2max-accuracy.js` (`.cmp`).
- First column = **brand logo + name** (logo over name on mobile, side-by-side desktop).
  Missing logo → fallback to a neutral type icon.
- Other columns = attributes. Binary cells use a **green check / grey dash**; non-binary use
  small pills (green for the good value, grey otherwise).
- **Header row is grey (`#E2E8F0`) and flush to the card edges** — set the card `padding:0`
  and `overflow:hidden` (so the rounded corners clip it); put padding on the cells and the
  legend instead. An inset grey bar that doesn't reach the first row looks broken.
- **Mobile = horizontal scroll**, not stacking: table `min-width:560px`, wrapper
  `overflow-x:auto` (mobile) → `visible` (≥768px), and the **first column is `position:sticky;
  left:0`** (header cell too) so the brand stays pinned while columns scroll.
- Brand names must `overflow-wrap:anywhere` and be allowed to wrap to 2–3 lines on mobile
  (cap width ~86px); lift the cap on desktop.
- Do **not** use a `position:sticky; top` header here — it fights `overflow:hidden` and
  overlaps rows on mobile. The grey fill is the contrast; that's enough.

### Long lists → collapsible dropdowns (never a flat wall)
If a list exceeds ~12 items, it must **not** render as a flat column of cards on mobile
(39 factor cards = a ~26,000px wall; that was reworked twice). Instead:
- **Group into collapsible category `<details>` sections** ("dropdowns"): summary = icon +
  label + count + chevron; body = the rows. Open the first group by default; when a
  search/filter is active, auto-open every matching group; "jump to item" opens the item's
  group + the item.
- Each row is itself a compact `<details>`: collapsed = direction/▼ icon + name + a badge or
  two + chevron; expanded = the detail (takeaway, finding, dose, source).

### Detail cards / accordions
- Card grids: 1 col mobile → 2–3 col desktop. If a detail accordion looks too empty at
  1-per-row on desktop, go **2-up on desktop** (`grid-template-columns:1fr 1fr; align-items:start`),
  keep 1-up on mobile.
- Stat/value cards stay **side-by-side (2-up) on mobile** — don't let them stack into three
  tall blocks.

### Sources (compact)
A grid of small link cards (1 col mobile → 2–3 col desktop): tag (tiny green eyebrow) +
title (link) + citation + external-link icon. **No big expandable cards** — they ate half
the screen. Mirror the Oura tool's compact sources.

### Filter controls
Give filter bars a **`--bg-raised` background** so they read as distinct from the white
content cards (a white filter box on white cards has no contrast).

### Factor explorer (raise / lower / modifier) — `kygo-recovery-scores.js`
For "what moves this metric" explorers:
- **Filter chips:** one **single word + an icon** each (e.g. "Sleep 🌙", "Nutrition 💧"). Don't
  over-fragment — **consolidate related buckets into one chip** (recovery folds Substances +
  Supplements + Food into a single **Nutrition** chip). Keep a separate granular sub-label on
  each card's eyebrow so detail isn't lost while the chip count stays low (~5).
- **Group order: "What helps" (raises) FIRST, then "What hurts" (lowers), then "Baseline
  modifiers" last.** Helps-before-hurts, every time.
- Each card shows **direction + impact + evidence grade** in the collapsed eyebrow
  (e.g. "Raises your score · Medium impact · Moderate evidence").
- **Group headers must wrap on mobile** (`flex-wrap:wrap; .meta{white-space:normal}`) — a
  `white-space:nowrap` sub-label clips on a phone (the "SHIFT YOUR NUMBER…" bug).
- Keep "don't-rely-on"/weak items in their own card but **never give them an affiliate button**.

### Validation table (score vs signal) — `kygo-recovery-scores.js`
When the honest story is "the score isn't validated but the signal might be," use a text table
(reuse `.device-table` + a `.vtable` variant): columns = **Brand & score | Score validated? |
Signal validated? | Key evidence**. Pills are **green = validated, dark chip = tested-but-weak,
grey = none/poor/na** (no red). Keep **evidence cells to 2–3 lines** (trim the prose); a narrow
**brand column with the logo stacked above the name** (matches the comparison matrix). Give the
card a **grey header band** (`dc-head` on `--bg-raised`, full-bleed via negative margins) to
separate it from the white table.

### Affiliate buy buttons (Amazon) — `kygo-recovery-scores.js`
- Put a green **"View <product> on Amazon"** button (cart + external-link icon) in the expanded
  **device card** *and* expanded **supplement factor card**. Add `rel="noopener sponsored"` and a
  small per-link "Affiliate link — we may earn a commission." note. Plus the footer disclosure (§2.8).
- **Reuse the existing per-product slug** from `docs/affiliate-links.md` (same physical item =
  same link across tools). **Never fabricate an `amzn.to` slug.** If a product has no slug, omit
  the button and **ask the client for the link** (don't ship a bare search URL). Products not
  sold on Amazon (e.g. Ultrahuman) get no button.

### Callout / keystone card
Dark card, green icon chip + body. On mobile **stack the icon above the text**
(`@media (max-width:600px){ flex-direction:column }`) — a flex-row icon indents the whole
paragraph behind it on a phone.

---

## 4. Brand logos & store badges

Use the real Wix-hosted brand product images (catalogued in `docs/assets-and-urls.md`).
Device-image map used by the comparison charts:

```
garmin  273a63_c545c093c04d4ca4ade77e5ca43fd433   apple   273a63_68b4900c356b4d0c8982e5ecd10f04fe
polar   273a63_e7e3c05ed0bc4cec8f456cd7f995e70b    fitbit  273a63_c12bab319dc34737a386c7449f5f92c7
samsung 273a63_21fd42e4a5d1459bb6db751a0ea5e161    whoop   273a63_c52aaaca1f7243f3818cf51d9374dbd4
oura    273a63_722e50e1a554453eb4c71a2e7a58925d    coros   273a63_b86aaa1f1b5b43a4a8ccc8294293e193
suunto  273a63_0bf2273473c849a98d9fc92b6ccea514
```
(All as `https://static.wixstatic.com/media/<id>~mv2.png`.)

**Android icon = the canonical "bust" logo** used in `kygo-tools.js`/`kygo-blog-post.js`
(the `playstore`-named SVG: path starts `M17.523 2.246…`), NOT a different robot. iOS uses
the standard Apple-mark SVG. Keep these consistent across every tool.

---

## 5. The mobile/reveal gotchas (memorise these)

- **IntersectionObserver threshold:** use `threshold: 0.01` (with a no-IO fallback that adds
  `.visible`), **not** `0.12`. A tall `.animate-on-scroll` wrapper at `0.12` never trips on
  mobile and the whole section stays stuck at `opacity:0` (the "breakdown doesn't show on
  mobile" bug). Never gate a very tall block on a fragile threshold.
- **Section backgrounds alternate** — re-check the full L/W/L/W sequence after adding/splitting
  a section.
- **Copy = reality:** stat numbers must match what's shown (e.g. "36 sources" not "48" if the
  list shows 36). Keep `__seo` + JSON-LD consistent with the visible content. Avoid stray
  em-dashes in CTA headlines.

---

## 6. Register the tool on the index page (+ give it a data-motif card)

Add the tool to `kygo-tools.js` → `_defaultTools()`:
`{ slug, title, description, icon, badge:'New', url:'/tools/<slug>', category, features:[…] }`
— `category` is one of `wearables | recovery | sleep | nutrition` (accuracy/comparison tools →
`wearables`; factor explorers → the relevant physiological category). Tool count, grouping and
ItemList JSON-LD update automatically. **Caveat:** if the live Wix `/tools` page passes its own
`tools` attribute, that overrides this default and must be updated in the Wix editor too.
(The `icon` field now only drives the **category section header**, not the card.)

### Card style — image-led "data-motif" tiles (current standard)

The index cards are **image-led** to match the blog: each card opens with a grey media tile
(`#F1F5F9`, `aspect-ratio:16/10`) holding a **white data panel** — an uppercase `caption` + a
small **green motif** that previews the tool's *output* — then the title, a 2-line blurb, and a
muted meta line with an "Open →" affordance. **Every new tool must be wired to a motif.** Do it
in `_motifFor(tool)` (keyed by `slug`, with per-tool override support) and render it via
`_motifBody(cfg)` — both in `kygo-tools.js`.

Pick the motif that fits the tool's data shape (don't default everything to bars):

| Motif | Best for | Key params |
|---|---|---|
| `ranked` | factor/evidence rankings (descending bars) | — |
| `compare` | device accuracy ranking, ≤4 labeled rows | `rows:[{label,pct}]` |
| `diverging` | over/under or bias around zero | `bars:[{label,val}]` (signed) |
| `versus` | 2-device head-to-head duel | `versusA`,`versusB`,`versus:[{a,b}]` |
| `radar` | multi-dimensional focus (device × categories) | `radar:[5 vals 0–1]` |
| `rings` | product generations by size/thickness (Oura) | `rings:[{label}]` (same outer size, varied wall) |
| `tiers` | generic progression (ascending bars) | `tiers:[{label,h}]` |
| `dots` | "X of N" coverage counts | `dots:[{label,n}]` |
| `ring` | a single readiness/score readout (donut) | `ringValue`,`ringNote` |
| `gauge` | a single value on a 180° arc | `gaugePct`,`gaugeValue`,`gaugeUnit` |
| `pulse` | HRV / resting-HR (ECG line) | `bpm` (optional) |
| `decay` | time-to-fall-asleep (falling curve) | — |
| `hypno` | sleep stages (hypnogram, stage highlight) | `stage:'rem'\|'deep'` |
| `donut` | macros/calories ring + legend | — |
| `range` | confidence/likely-range band | `rangeLabel` |

Rules:
- **Teasers, not answers.** Motif values are *simplified, illustrative* — a few rows or a
  representative shape, never the full dataset. The real numbers, the "why," and the verdict
  stay inside the tool. Wire to **real per-tool figures** where a clean one exists (e.g. published
  accuracy/MAPE); otherwise use a representative readout.
- **Strictly green over neutrals.** Ramp `#16A34A → #22C55E → #4ADE80 → #86EFAC`; the
  last/worst row greys out to `#CBD5E1`; tracks `#EEF1F4`, gridlines `#E2E8F0`. No off-palette.
- **Featured tool** uses a "leader by metric" dot grid (the crown is split across devices) — not
  a single-winner bar — so it doesn't imply one wearable wins everything.
- Keep the SVG simple — the panel is ~170px wide. Reuse an existing motif before adding a new one;
  if you add one, give it a `_motifBody` case + (optional) per-tool override passthrough.

---

## 7. Verify before committing (required)

There's no CI. Render and **look** at it, desktop **and** mobile, section by section, in
default *and* interactive states (filters active, accordion expanded). A headless Chromium is
available in the dev container at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` with
Playwright on `NODE_PATH=/opt/node22/lib/node_modules` — drive a `test-<name>.html` harness,
screenshot full-page + element crops at 1280px and 390px. Note: Wix-hosted logos/fonts won't
load in the sandbox (cert proxy) — they show as placeholders but render live; ignore
`ERR_CERT_AUTHORITY_INVALID` console noise.

Pre-commit checklist:
- [ ] `node -c file.js` passes; no off-brand colours (grep above is empty).
- [ ] Every `_icon('x')` has a matching key in the icon map.
- [ ] Desktop + mobile reviewed per section; long lists are collapsible; stat cards 2-up on
      mobile; tables scroll with a sticky first column; chart headers flush; sources compact.
- [ ] Scroll-reveal works on mobile (no section stuck invisible).
- [ ] Section backgrounds alternate; each block is its own section.
- [ ] FAQ visible + JSON-LD from one source; `__seo` + counts match the UI.
- [ ] Tool added to `kygo-tools.js` **and wired to a fitting green data-motif** (`_motifFor`);
      motif is a simplified teaser, on-palette. New assets documented in `docs/assets-and-urls.md`.
- [ ] Zero runtime errors in the headless render.
