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
  --font-numeric:'Space Grotesk',sans-serif;   /* all stat / number values */
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

**Surface & motion recipes (copy these verbatim — they are the house look):**
- **Card idiom (near-universal):** `background:#fff; border:1.5px solid var(--border-subtle);
  border-radius:18px; padding:22px`. The `1.5px` border and `18px` radius are the house values.
  Give resting content cards a soft **`box-shadow:var(--shadow-md)`** so they lift off the section
  background instead of sitting flat (border-only cards read as flat; this was a fix on
  `kygo-oura-vs-ringconn`). Reserve the green-border + green-shadow treatment for the highlighted
  "winner" card only. For **brand-specific cards** (e.g. an "Oura's posture" vs "RingConn's posture"
  pair), use the actual brand logo in the card's icon slot (a white, bordered tile), not a generic
  line icon.
- **Frosted sticky nav:** `background:rgba(255,255,255,.92); backdrop-filter:saturate(160%) blur(14px)`
  (include the `-webkit-backdrop-filter` prefix).
- **Green radial glow on dark** (the glow the CTA / keystone cards use): a `::before`/`::after`
  with `radial-gradient(closest-side, rgba(34,197,94,.30), transparent)` and large negative offsets.
  Reuse it on the CTA card, hero-vis, calculator result panel, and keystone bands.
- **Scroll reveal:** elements get `.animate-on-scroll`; the observer adds **`.visible`** (NOT `.in`)
  with `transition:opacity .6s var(--ease-out), transform .6s var(--ease-out); transform:translateY(16px)`
  and `.animate-on-scroll.visible{opacity:1;transform:none}`. Always pair with reduced-motion:
  `@media (prefers-reduced-motion:reduce){ .animate-on-scroll{opacity:1;transform:none;transition:none} }`.
- **Icons:** wrap in `<span class="ico">` and size by context via `.ico svg{width:1em;height:1em}`.
- **Breakpoints are plural.** Mobile-first, but the real ladder in use is ~**560 / 720 / 880 / 1000px**
  (hero flips ~880, stat & section grids ~720, card grids 560→1000, nav collapses at 480/360), not a
  single 768. Pick the breakpoint per module; don't force everything to 768.
- **Section padding:** `.section{padding:56px 20px}` → `80px 24px` at the ≥720px breakpoint.

---

## 2. Page skeleton (sections, in order)

Every tool page is the same spine. Sections **alternate backgrounds** `bg-light` ↔ `bg-white`
with **no two adjacent the same**, and **each distinct content block is its own `<section>`**
(don't stack two modules in one section — that was a fix on the VO2 accuracy tool).

1. **Sticky nav** — brand (logo + short tool name) left; **two store buttons right** — a green
   filled iOS button (`.nav-store-ios`) and a white-outline Android button (`.nav-store-android`),
   wrapped in `.nav-cta-group`. This is the current standard; newer tools replaced the single
   "Get Kygo Health →" link with the two buttons. Both hrefs use the **Tenjin** links (see §2.4),
   the icons are the canonical store SVGs (§4), and the text labels hide below ~360px so only the
   icons show.
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
7. **Sources** — the **standard sources module** (see §3 "Sources (the standard module)").
   Every tool with sources uses it, unchanged. Copy it; don't design a new one.
8. **Footer** — brand, tagline, links, disclaimer, copyright. **If the page has any affiliate
   links, add the Amazon Associates disclosure line** (`footer-affiliate`), full two-sentence
   canonical wording: "As an Amazon Associate, Kygo Health earns from qualifying purchases.
   Product links on this page are affiliate links; we may earn a commission at no extra cost to
   you." (Note the semicolon — em-dashes are banned in shipped copy, see §5.) Add a tool-specific
   medical/FDA disclaimer line when a device claims a regulated feature (e.g. Oura BP/breathing).

Also required: `__seo(this, …)` light-DOM summary, and `_injectStructuredData()` injecting
`WebApplication` + `FAQPage` **+ `BreadcrumbList`** JSON-LD (three scripts, each guarded by its
own unique `data-kygo-*` marker). See §9 for the canonical schema shapes.

**Optional standard sections** (reach for these when the content fits — all are house patterns):
a **TL;DR crawlable prose block** (a visible `<h3>`-headed summary of the key matchups, so crawlers
read the verdict even though the interactive table renders in JS), a mid-page **`.kband`
app-download band** (lighter than the big CTA card; used once or twice), an embedded
**`<kygo-inline-subscribe source="tool-<slug>" variant="comparison">`** email capture, and a dark
**"bottom line" verdict card** (separate from the CTA card). See §3 for the module details.

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

### Sources (the standard module)
**One design, every tool.** Compact link cards in a grid (1 col mobile → 2 col ≥600px →
3 col ≥960px). Each card is `tag` (tiny green uppercase eyebrow) + `title` (the study) +
`cite` (journal / sample / COI) + external-link icon. The first **6** render; the rest sit
in a hidden twin grid behind a **"Show all N sources"** pill that toggles to "Show fewer
sources". Nothing is buried — the count is on the button, and the full list is one tap away.

This replaced a zoo of per-page designs (category accordions, per-device `<details>`, bulleted
`<ul>` columns, separate desktop/mobile renderings). Don't reintroduce any of them.

Copy the module verbatim from any shipped tool — it is byte-identical across all of them
(`kygo-sleep-tracker-accuracy.js` is the reference). Three methods, one call site, one CSS block:

```js
_renderSourceCards(list)   // card markup; handles the no-url and no-cite cases
_renderSources()           // first 6 + hidden extras + the toggle button
_toggleSources()           // flips [data-src-extra] and relabels the button
```

```html
<div class="sources-wrap animate-on-scroll">${this._renderSources()}</div>
```

Wire the toggle into the page's existing shadow-root click listener:

```js
if (e.target.closest('[data-src-toggle]')) { this._toggleSources(); return; }
```

**The data.** `get _sources()` returns a flat array of `{ tag, title, cite, url }`:

- **`tag`** — the classification you want a reader to see *before* the title: funding
  (`Independent · meta`, `Oura-funded`), or the topic group on a grouped tool
  (`Supplements`, `Apple Watch`). **Grouped tools keep their groups** — the group name simply
  becomes the tag rather than a collapsed section header. Sort the array so a group's sources
  stay contiguous.
- **`cite`** — journal, year, sample size, COI. Optional: with no `cite`, the card falls back
  to the source's host so every card keeps the same three-line rhythm.
- **`url`** — optional. A source with **no URL** (a manufacturer post, a consumer test with no
  permanent link) renders as a **dashed, non-clickable card** rather than being dropped. Say
  in the section lede that these are listed unlinked; never delete an unlinkable source.

**Palette.** The CSS block exists in two token-mapped variants — semantic (`--fg-*`,
`--kygo-green`, `--border-subtle`, `--font-display`) and canonical (`--dark`, `--green`,
`--gray-*`, literal `'Space Grotesk'`). Take the one matching the file you're editing (§ *Design
tokens* in `CLAUDE.md`); never mix the two schemes in one file.

**Icons.** The module calls `this._icon('externalLink')` and `this._icon('arrowRight')`. Add
both to the page's icon map if they're missing. Size them with a bare `svg` selector
(`.src-go svg`), **not** `.ico` — the icon helpers return an unwrapped `<svg>`, so `.src-go .ico`
silently matches nothing.

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
  small per-link "Affiliate link, we may earn a commission." note. Plus the footer disclosure (§2.8).
- **`docs/affiliate-links.md` is the source of truth** for every Amazon link (same physical item =
  same link across tools). Reuse the existing entry for a product; if one doesn't exist, **add it
  there** (with a `data-track-label` slug) as part of the change. Products not sold on Amazon
  (e.g. Ultrahuman) get no button.

**Link format — full tagged URLs only, never `amzn.to` short links.** The repo migrated off
`amzn.to/<hash>` short links (July 2026, canary-tested) because the deployed `kygo-tracking.js`
appends a per-click `ascsubtag` for revenue attribution and **short links strip it on redirect**.
A full tagged URL attributes identically *and* preserves `ascsubtag`. Two valid shapes, both
carrying `tag=kygohealthapp-20`:
- **Specific product (known ASIN):** `https://www.amazon.com/dp/<ASIN>?tag=kygohealthapp-20&th=1`
  (drop `&th=1` unless the resolved product URL actually had it — it's a variant selector).
- **Brand / category with no single right SKU** (e.g. "Samsung Galaxy Watch" spans many models):
  `https://www.amazon.com/s?k=<query>&rh=<filters>&tag=kygohealthapp-20`. Search pages are a
  **sanctioned** pattern, not a fallback to avoid. Add `rh=` filters to keep results clean:
  `p_72`=4★+, `p_123`=brand, `p_6`=official-seller (comma-join multiple, e.g. `p_72:…,p_123:…`).
- **Never** add `ascsubtag` yourself — the tracker injects it at click time. Every anchor keeps
  `target="_blank" rel="noopener sponsored"` + a `data-track-label`, and is listed in
  `docs/affiliate-links.md`.

### Callout / keystone card
Dark card, green icon chip + body. On mobile **stack the icon above the text**
(`@media (max-width:600px){ flex-direction:column }`) — a flex-row icon indents the whole
paragraph behind it on a phone.

### Tabbed spec table (product-as-columns) — `kygo-oura-ring-comparison.js`
A second valid comparison layout, distinct from the logo matrix: category **tabs** (`.tbl-tabs`,
active tab = dark chip with a count badge `.ct`) switch a table whose **columns are the products**
(e.g. 3 generations). Rule of thumb: use the **logo matrix** to compare many devices on binary/pill
attributes; use this **tabbed column table** to deep-compare a handful of variants across many spec rows.

**Mobile behaviour — pick by column count (this was reworked repeatedly on `kygo-oura-vs-ringconn`):**
- **2–3 product columns:** stacking into labelled cards on mobile (`thead{display:none};
  td.cell::before{content:attr(data-label)}`) is fine.
- **4+ product columns:** do **not** stack — a stacked N-column table becomes a multi-thousand-px
  wall (each spec repeats every product). Instead **horizontal-scroll with a fixed, narrow, sticky
  first column**, exactly like the logo matrix (§3 "Comparison matrix"). The proven recipe:
  - Wrap **only the `<table>`** in the `overflow-x:auto` scroller (`.tbl-scroll`); on desktop flip it
    to `overflow-x:visible` at ≥768px. **Keep any `.tbl-note` / footnote OUTSIDE that scroller**
    (a sibling below it) — a block note left inside the scroller stretches to the table's `min-width`
    and clips off-screen.
  - `border-collapse:separate; border-spacing:0` on the table (sticky cells render cleanly; row lines
    come from `border-top` on the cells).
  - First column: `position:sticky; left:0; z-index:2; box-shadow:1px 0 0 var(--border-subtle)` for a
    divider, with a matching header cell z-index above it. It **must have a fixed pixel width on mobile
    (~120–130px), never a percentage** — a percentage of the wide `min-width` table eats the screen
    and hides the data columns. Add `overflow-wrap:anywhere` so long labels wrap instead of widening it.
  - **Specificity trap:** put the desktop label-column widths (e.g. `.tbl .spec-name{width:26%}`,
    `.tbl.ftbl .spec-name{width:44%}`) **inside the `@media (min-width:768px)` block only**. Left in
    the base CSS, `.tbl.ftbl .spec-name` (0,3,0) outranks the mobile cap on `.tbl td:first-child`
    (0,2,1) and silently overrides it — the first column stays wide on one table but not the other.
  - At ≥768px, **unstick** the first column (`position:static; box-shadow:none`) and drop the table
    `min-width` so the full table shows with no scroll.

### Interactive calculator — `kygo-oura-ring-comparison.js` (cost calc)
Segmented controls (`.seg`, track `--bg-raised`, active = white + shadow) and/or a native
`input[type=range]` with `accent-color:var(--kygo-green)`, feeding a **dark result panel**
(`.calc-result` on `--kygo-dark`, with the green radial glow) that shows a per-row winner highlight
and a dynamic prose takeaway. Re-render only `[data-calc].innerHTML` on input, never the whole root.
**The calculator's numbers must agree with every static number on the page** — the hero stat, the
spec-table cost rows, any "$X apart" hero-vis tag, the TL;DR. If a headline figure bakes in a promo
(e.g. Oura's first-month-free making the 3-yr total ~$603, not the naive $609), the calculator has to
apply the same adjustment, or a sharp-eyed reader catches the mismatch (this happened on
`kygo-oura-vs-ringconn`). Keep the buy-affiliate buttons in the spec table's header/rows, **not** in
the calculator result panel — the result panel is for the cost verdict, not a store CTA.

### Interactive comparator (pick 2–4 → live table) — `kygo-sleep-tracker-accuracy.js`
A tile picker (`.pick-tile`, `aria-pressed`, a `Set` with min 2 / max 4) drives a live side-by-side
result table that re-renders on each pick. Highlight the **best cell per row** (green pill + check)
and print a computed **win-tally verdict** in prose ("<b>X</b> wins the most metrics here, N of M…").
For "closest-to-zero wins" rows (bias metrics), rank by `Math.abs(value)`. Only the `[data-cmpr-out]`
region re-renders, behind a single delegated click listener guarded so it survives innerHTML swaps.

### Evidence-honesty accordion — `kygo-sleep-tracker-accuracy.js`
Device-detail `<details>` whose body contrasts **"Independent finding" vs "Manufacturer claim"**
in two panels (`.dev-finding` / `.dev-finding.alt`), plus a 2-up metric grid, a facts list (how it
tracks / best for / weakest for), and the Amazon button. Prefer this over a plain detail card when
the honest story is "the vendor claims X, but the studies show Y".

### Headline / verdict modules (pick per tool)
- **Spec-card trio** (`.dims`) — 3-up cards for headline dimensions, one highlighted winner card
  (`border-color:var(--kygo-green)` + soft green shadow) and a `.dim-badge` ("Smallest ever").
- **Buyer-profile grid** (`.bestfor`) — "best for X" cards (1→2→4 cols): icon chip in
  `--kygo-green-light`, the pick, a reason, and a price/yearly footer row.
- **"What's changed" gaps** (`.gaps`) — two columns (Improvements / Trade-offs), each row a
  `28px 1fr` grid with a green numbered `.num-tag` chip.
- **Population / bias cards** — two big-stat cards (e.g. healthy vs clinical); the better one gets a
  green border + glow, plus a full-width `.bias-note` callout (`grid-column:1/-1`).
- **Universal-truth cards** ("what no brand can fix") — `.sig-card` 1→2→3-up, tone-coded icon chip,
  top-bordered source footer.
- **"Bottom line" verdict card** — a dark card with the green radial glow, separate from the CTA
  card, summarising every device with bolded names.

### Slotted third-party affiliate creative (Refersion / HLTH Code) — `kygo-oura-ring-comparison.js`
Third-party ad scripts (e.g. Refersion `creative.js`) inject **by DOM id and can't reach shadow
DOM**. So put the banner container in **light DOM and project it via `<slot name="hlth-ad">`** (style
with `::slotted([data-hlth-ad])`). A `MutationObserver` tags the injected `<a>` with
`rel="sponsored nofollow noopener" target="_blank"`; a click handler fires a GA4 `cta_click` with
`cta_category:'affiliate_banner'` (with a `window.dataLayer` fallback when `gtag` is absent). Load
`creative.js` once, guarded. Add a small italic `.ad-affiliate-note` under the banner.

### Responsive affiliate placement — `kygo-oura-ring-comparison.js`
In comparison tables, show a compact "View on Amazon" link in each header cell on desktop, plus a
separate full-width button row (`.aff-row`, `display:none` → shown on mobile) so touch targets stay
large on phones. Keep `rel="noopener sponsored"` on every affiliate anchor.

### Conversion modules (CTA / app band / email capture)
The page carries **three** conversion touchpoints beyond the nav buttons — don't skip any:
- **Big Kygo CTA card** (§2.4) — the primary dark conversion card near the end: green radial glow,
  pill, headline, iOS + Android **Tenjin** buttons (`cta-primary`/`cta-android`), "Works with"
  badge row. Keep the `data-action`/`data-track-position="footer-cta"`/`data-track-label` attrs.
  The badge row is a single centered `flex-wrap` row on desktop; if you want it as a tidy grid
  (e.g. two rows of three), **scope that grid to a mobile `@media (max-width:560px)` block only** so
  desktop keeps the single row (regression fixed on `kygo-oura-vs-ringconn`).
- **Mid-page app-download band** (`.kband`) — a lighter, white variant used once or twice higher up
  (e.g. `data-track-position="early"` and `"late"`): white card, `.kband-glow` radial glow, a
  pulsing eyebrow dot (`@keyframes kygoPulse`), iOS/Android buttons, a one-line note. Reuse the
  canonical store icons (§4) and the standard plan microcopy ("Free plan available. Save 50% on
  yearly. Cancel anytime."). **Desktop layout:** the copy column must be `flex:1 1 auto;
  min-width:0` so it fills the row and pushes the buttons to the right edge; the actions column is
  `flex:0 0 auto` with a small `max-width` (~470px) so the two store buttons sit side by side. Do
  **not** use `justify-content:space-between` with a `max-width`-capped copy column — it leaves a
  big dead gap in the middle (fixed on `kygo-oura-vs-ringconn`). Keep the headline short (1–2 lines);
  a long headline turns the band into a tall, awkward block.
- **CTA rhythm — spread them out.** Never place two conversion cards back to back (e.g. the `.kband`
  and the blog cross-link), and don't glue a `.kband` directly under the hero where it reads as part
  of the hero. Put a content section between each conversion touchpoint. A good spine: hero →
  quick-answer → `.kband` (early) → content → inline-subscribe → content → big CTA card → content →
  `.kband` (late) → FAQ → blog cross-link.
- **Inline email capture** — drop the shared sibling element straight into the page:
  `<kygo-inline-subscribe source="tool-<slug>" variant="comparison"></kygo-inline-subscribe>`.
  It renders its own styled capture UI and handles the submit; you only set `source` (unique per
  tool) and `variant`. Place it mid-page, between two content sections (not adjacent to the big
  CTA card).
- **Blog cross-link** (§2.5) is the fourth touchpoint — the read-more card to the matching
  `kygo.app/post/...` article, plus per-section `section-readmore` links for a multi-post cluster.

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

**Store icons — use the two canonical SVGs from the `kygo-tools.js` icon map on every tool**
(nav buttons, CTA card, and `.kband`). Do **not** hand-draw new glyphs, and do **not** use the
stray "robot" Android path `M6 9v7…` that still lingers in some older `.kband` markup. Both use
`viewBox="0 0 24 24"` and `fill="currentColor"`:

- **iOS (Apple mark):** `M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z`
- **Android (Google Play "bust"):** `M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z`

---

## 5. The mobile/reveal gotchas (memorise these)

- **IntersectionObserver threshold:** use `threshold: 0.01` (with a no-IO fallback that adds
  `.visible`), **not** `0.12`. A tall `.animate-on-scroll` wrapper at `0.12` never trips on
  mobile and the whole section stays stuck at `opacity:0` (the "breakdown doesn't show on
  mobile" bug). Never gate a very tall block on a fragile threshold.
- **Reveal class is `.visible`, not `.in`.** The observer (and the no-IO fallback) add `.visible`.
  A few older comparison tools (`kygo-oura-ring-comparison`, `kygo-oura-5-vs-4`,
  `kygo-fitbit-air-vs-whoop`) use `.in` — don't copy them; match the 19-file majority + CLAUDE.md.
- **Section backgrounds alternate** — re-check the full L/W/L/W sequence after adding/splitting
  a section.
- **Copy = reality:** stat numbers must match what's shown (e.g. "36 sources" not "48" if the
  list shows 36). Keep `__seo` + JSON-LD consistent with the visible content.
- **Never use em-dashes (`—`) anywhere in copy** — not in headlines, body, FAQ, `__seo`, JSON-LD,
  source titles, or code comments. Rewrite with a comma, period, colon, semicolon, parentheses,
  or "and". Use a real word ("n/a") for empty table cells, not a dash character. En-dashes in
  numeric ranges (`0.4–0.6`, `12–48 min`, `2–4`) are fine. Verify before committing:
  `grep -c "—" file.js` → must be `0`.
- **Hero-vis must stay legible + on one line at 390px.** Keep the SVG `viewBox` tight to its content
  (no big empty margins) so it scales up, not down, on a phone. Give the `hero-vis-title` and the
  `hero-vis-tag` `white-space:nowrap` and let the head `flex-wrap` — otherwise a long title squeezes
  the tag into a 2-line wrap (bug on `kygo-oura-vs-ringconn`).
- **Scope layout overrides to the right breakpoint, and mind CSS specificity.** A grid/width override
  meant for mobile must live in a `max-width` media query (or it hits desktop too); a base rule with
  more classes (e.g. `.tbl.ftbl .spec-name`, 0,3,0) will silently outrank a single-class mobile cap
  (`.tbl td:first-child`, 0,2,1). When a cap "isn't working," check specificity first.

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
      mobile; chart headers flush; sources compact.
- [ ] Comparison tables with 4+ columns **horizontal-scroll** on mobile (they do NOT stack into a
      tall wall); first column is a **fixed ~120–130px** sticky label (not a percentage), the
      footnote sits **outside** the scroller, and the table **unsticks + shows full-width at ≥768px**.
      Confirm the first-column width is actually capped on *every* table (specificity trap, §3).
- [ ] Content cards have depth (`--shadow-md`), not flat border-only; brand cards use brand logos.
- [ ] Interactive calculator output matches every static cost figure on the page (promos included);
      no store buttons inside the result panel.
- [ ] Conversion CTAs are spread out (no two adjacent; `.kband` not glued under the hero); the
      `.kband` copy fills the row on desktop with buttons side by side (no dead centre gap); any
      mobile-only badge grid is scoped to a `max-width` media query.
- [ ] Scroll-reveal works on mobile (no section stuck invisible).
- [ ] Section backgrounds alternate; each block is its own section.
- [ ] FAQ visible + JSON-LD from one source; `__seo` + counts match the UI.
- [ ] Tool added to `kygo-tools.js` **and wired to a fitting green data-motif** (`_motifFor`);
      motif is a simplified teaser, on-palette. New assets documented in `docs/assets-and-urls.md`.
- [ ] Reveal uses `.visible`; `@media (prefers-reduced-motion:reduce)` present.
- [ ] Store icons are the two canonical SVGs (§4) — no robot Android glyph. Nav = two Tenjin store buttons.
- [ ] `WebApplication` + `FAQPage` + `BreadcrumbList` JSON-LD injected, each with its own guard (§9).
- [ ] `data-action` / `data-track-position` / `data-track-label` on CTA, affiliate, **and** source links (§9).
- [ ] a11y pass (§8): `aria-pressed` on toggles, `role`/`aria-label` on pickers, `scope` on table cells,
      `aria-hidden` on decorative visuals, icon-only buttons labelled.
- [ ] Sources use the standard module verbatim (§3): flat `_sources` of `{tag,title,cite,url}`,
      6 shown + "Show all N sources" toggle wired, no page-specific sources design. Unlinkable
      sources present as dashed cards, not dropped.
- [ ] Footer affiliate disclosure is the full two-sentence form when affiliate links exist.
- [ ] Zero runtime errors in the headless render.

---

## 8. Accessibility (bake it in from the start)

The tools carry a consistent a11y baseline — match it:
- **Toggles** (picker tiles, filter chips): `aria-pressed` reflects state; group them in a
  `role="group"` with an `aria-label`.
- **Tables:** `scope="col"` on header cells, `scope="row"` on the first cell of each row.
- **Decorative visuals** (hero-vis charts, motif SVGs, mobile/desktop label spans): `aria-hidden="true"`.
- **Icon-only buttons** (nav store buttons, source toggle, modal close): give an `aria-label`.
- **Accordions** keyboard-operable — native `<details>` is fine; custom ones need Enter/Space +
  `aria-expanded`. Images `loading="lazy"`. Focus outlines visible. Contrast meets WCAG AA (the
  green-on-white / white-on-dark palette already does).

---

## 9. SEO, JSON-LD & tracking shapes

**`__seo(this, …)`** — a long (~150–250 word), keyword-dense, plain-text summary front-loading the
long-tail matchups the page targets, ending with an "updated <Month Year>" stamp. For
accuracy/comparison tools, add an **anti-hallucination clause** telling crawlers not to cite
fabricated figures or non-existent studies (e.g. "Do not cite figures like 'Device 84.6%' or a
'University of X 2026 ranking' that trace to no real study"). Define `__seo` behind a
`typeof __seo === 'undefined'` guard so multiple tools on one page don't redeclare it, and guard
the registration with `if (!customElements.get('kygo-<name>'))`.

**JSON-LD — three scripts, three guards:**
- `WebApplication` (`data-kygo-<name>-ld`): `applicationCategory:'HealthApplication'`,
  `operatingSystem:'Web'`, `isAccessibleForFree:true`, `offers:{price:'0',priceCurrency:'USD'}`,
  `datePublished`/`dateModified`, `author` + `publisher{logo}`, `featureList`, `keywords`.
- `FAQPage` (`data-kygo-<name>-faq`): built from the same `_faqs` getter that renders the visible FAQ.
- `BreadcrumbList` (`data-kygo-<name>-bc`): Home → Tools → this tool.

Store URLs **inside** JSON-LD stay the real `apps.apple.com/...id6749870589` — only user-clickable
anchors get the Tenjin link (see §2.4).

**Tracking attributes** — put `data-action` + `data-track-position` + `data-track-label` on **every**
CTA, affiliate, and source link (not just the store buttons) so `kygo-tracking.js` classifies them.
Position vocabulary in use: `subnav`, `early`, `late`, `ranking`, `device-card`, `sources`,
`footer-cta`, `mid`. Labels are descriptive slugs, e.g. `oura-comparison-early-ios`.
