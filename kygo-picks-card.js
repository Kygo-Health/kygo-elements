/**
 * Kygo Health - Best Wearables promo card Custom Element for Wix
 * Tag name: kygo-picks-card
 *
 * A visual card that sends readers to /best-wearables (kygo-picks.js). Drop it into tool pages
 * (as a Custom Element or inside another component) and blog posts (HTML embed, see
 * docs/wix-snippets/picks-card-blog.html).
 *
 * Attributes:
 *   focus   all (default) | sleep | training. Each shows four wearables with the published
 *           result that put them there.
 *   href    page URL (default https://www.kygo.app/best-wearables)
 *   slug    tracking label for this placement, e.g. "sleep-tracker-tool" (default "card")
 *
 * Uses brand logos, not Amazon product photos: the Amazon API license requires its images to
 * link to Amazon, and this card links to our own page. Keep _picks in sync with the Best-for
 * winners in kygo-picks.js.
 */

function __seo(el, text) {
  if (el.querySelector('[data-seo]')) return;
  const d = document.createElement('div');
  d.setAttribute('data-seo', '');
  d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
  d.textContent = text;
  el.appendChild(d);
}

class KygoPicksCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }

  static get observedAttributes() { return ['wixsettings', 'focus', 'href', 'slug']; }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    if (this._embedded) { this.setAttribute('embed', ''); this._wireEmbed(); }
    const c = this._sets[this._focus];
    __seo(this, c.title + ': ' + c.tiles.map(t => t.name + ' (' + t.label + '): ' + t.line).join(' ') + ' Ranked on published validation studies at kygo.app/best-wearables.');
  }

  attributeChangedCallback(name, oldV, newV) {
    if (oldV === newV || !this.isConnected) return;
    if (name === 'wixsettings') this._parseWixAttributes();
    this.render();
  }

  _parseWixAttributes() {
    try {
      const s = this.getAttribute('wixsettings');
      if (s) this._settings = JSON.parse(s);
    } catch (e) {
      console.warn('KygoPicksCard: Could not parse Wix attributes', e);
    }
  }

  _getSetting(key, fallback) { return this._settings[key] || this.getAttribute(key) || fallback; }

  /* ── Blog embed mode ──────────────────────────────────────────────────
   * Inside a Wix Blog "HTML code" block the card runs in a sandboxed iframe,
   * where the page's kygo-tracking.js cannot see it. There the links open in
   * the top window and the card posts the same {kygo:'promo'} messages the old
   * pasted snippet did (click -> GA4 related_tool_click, view -> cta_view,
   * height -> the page sizes the iframe). On a tool page nothing changes. */
  get _embedded() {
    try { return window.top !== window; } catch (e) { return true; }
  }

  _post(msg) {
    try { window.top.postMessage(msg, '*'); } catch (e) { /* no page to report to */ }
  }

  _wireEmbed() {
    if (this._wired) return;
    this._wired = true;
    const slug = String(this._getSetting('slug', 'card')).slice(0, 40);
    this.shadowRoot.addEventListener('click', (ev) => {
      const a = ev.composedPath().filter(n => n.tagName === 'A')[0];
      if (!a) return;
      this._post({ kygo: 'promo', card: 'picks', type: 'click', slug, label: a.getAttribute('data-track-label') || '', url: a.href });
    }, true);
    const report = () => {
      const h = Math.ceil(this.getBoundingClientRect().bottom + (window.scrollY || 0)) + 2;
      if (h < 40) return;
      this._post({ kygo: 'embed', type: 'height', height: h });
      this._post({ type: 'kygo-embed-height', height: h });
      this._post({ kygo: 'promo', card: 'picks', type: 'height', slug, height: h });
    };
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(report).observe(this);
    window.addEventListener('load', report);
    setTimeout(report, 0);
    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver((entries) => {
        if (!entries.some(x => x.isIntersecting)) return;
        io.disconnect();
        this._post({ kygo: 'embed', type: 'view', slug: 'picks-' + slug });
      }, { threshold: 0.5 });
      io.observe(this);
    }
  }

  get _href() { return this._getSetting('href', 'https://www.kygo.app/best-wearables'); }
  get _focus() { const f = this._getSetting('focus', 'all'); return this._sets[f] ? f : 'all'; }

  // Wix media ids for brand logos (a missing one falls back to a monogram).
  get _logos() {
    return {
      oura: '273a63_722e50e1a554453eb4c71a2e7a58925d',
      garmin: '273a63_c545c093c04d4ca4ade77e5ca43fd433',
      apple: '273a63_68b4900c356b4d0c8982e5ecd10f04fe',
      fitbit: '273a63_c12bab319dc34737a386c7449f5f92c7',
      whoop: '273a63_c52aaaca1f7243f3818cf51d9374dbd4',
      polar: '273a63_e7e3c05ed0bc4cec8f456cd7f995e70b'
    };
  }

  // One card per topic, four wearables each, every line taken from the rankings on
  // /best-wearables (kygo-picks.js). Keep in sync when those rankings change.
  get _sets() {
    return {
      all: {
        kicker: 'Kygo Picks', title: 'Shopping for a wearable?',
        sub: 'The most accurate pick for each metric, ranked on published studies.',
        btn: 'See all picks', anchor: '',
        tiles: [
          { label: 'Sleep and HRV', name: 'Oura Ring 5', logo: 'oura', anchor: 'best-sleep', line: 'First on sleep stages, sleep timing, HRV and resting HR.' },
          { label: 'Workout heart rate', name: 'Apple Watch Series 12', logo: 'apple', anchor: 'exercise-hr', line: 'Near-zero bias across 22 studies, and first for blood oxygen.' },
          { label: 'Steps and VO2 max', name: 'Garmin Forerunner 970', logo: 'garmin', anchor: 'best-training', line: 'Closest step count across 59 studies.' },
          { label: 'Calories', name: 'Google Pixel Watch 5', logo: 'fitbit', anchor: 'calories', line: 'Closest calorie estimate across three lab tests.' }
        ]
      },
      sleep: {
        kicker: 'Kygo Picks', title: 'Shopping for a sleep tracker?',
        sub: 'The most accurate picks, ranked against sleep labs in published studies.',
        btn: 'See sleep picks', anchor: 'best-sleep',
        tiles: [
          { label: 'Best overall', name: 'Oura Ring 5', logo: 'oura', anchor: 'sleep-stages', line: 'Best at telling light, deep and REM apart.' },
          { label: 'Overnight HRV', name: 'WHOOP 5.0', logo: 'whoop', anchor: 'hrv', line: 'Second to Oura against a chest-strap ECG.' },
          { label: 'Sleep timing', name: 'Google Pixel Watch 5', logo: 'fitbit', anchor: 'sleep-timing', line: 'Total sleep within 3 minutes of a sleep lab.' },
          { label: 'REM sleep', name: 'Apple Watch Series 12', logo: 'apple', anchor: 'sleep-stages', line: 'Caught 83% of REM, the most of any device.' }
        ]
      },
      training: {
        kicker: 'Kygo Picks', title: 'Shopping for a running watch?',
        sub: 'The most accurate picks for training, ranked on published lab tests.',
        btn: 'See training picks', anchor: 'best-training',
        tiles: [
          { label: 'Steps and VO2 max', name: 'Garmin Forerunner 970', logo: 'garmin', anchor: 'vo2max', line: 'Most accurate VO2 max, and closest steps across 59 studies.' },
          { label: 'Workout heart rate', name: 'Apple Watch Ultra 4', logo: 'apple', anchor: 'exercise-hr', line: 'Most accurate in a head-to-head cycling test.' },
          { label: 'VO2 max', name: 'Google Pixel Watch 5', logo: 'fitbit', anchor: 'vo2max', line: 'Within about 9% of a lab VO2 max test.' },
          { label: 'Resting heart rate', name: 'Polar Grit X2 Pro', logo: 'polar', anchor: 'rhr', line: 'Within 2.7% of a chest-strap ECG overnight.' }
        ]
      }
    };
  }

  _esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  _link(anchor, cls, inner, label) {
    const e = v => this._esc(v);
    const slug = this._getSetting('slug', 'card');
    return `<a class="${cls}" href="${e(this._href + (anchor ? '#' + anchor : ''))}" data-action="related-tool" data-tool-slug="best-wearables"
      data-track-position="picks-card-${e(slug)}" data-track-label="${e(label)}"${this._embedded ? ' target="_top"' : ''}>${inner}</a>`;
  }

  _logo(t) {
    const id = this._logos[t.logo];
    return id ? `<img src="https://static.wixstatic.com/media/${id}~mv2.png" alt="" loading="lazy" decoding="async" />`
      : `<span class="mono">${this._esc(t.name.charAt(0))}</span>`;
  }

  _tile(t) {
    const e = v => this._esc(v);
    return this._link(t.anchor, 'tile', `
        <span class="tile-img">${this._logo(t)}</span>
        <span class="tile-text"><span class="tile-label">${e(t.label)}</span><span class="tile-name">${e(t.name)}</span></span>
        <svg class="tile-go" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>`, t.name);
  }

  render() {
    const e = v => this._esc(v);
    const c = this._sets[this._focus];
    const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    this.shadowRoot.innerHTML = `<style>${this._styles()}</style>
      <div class="card">
        <div class="copy">
          <span class="kicker">${e(c.kicker)}</span>
          <h3 class="title">${e(c.title)}</h3>
          <p class="sub">${e(c.sub)}</p>
          ${this._link(c.anchor, 'btn', e(c.btn) + arrow, 'see-all')}
        </div>
        <div class="tiles">${c.tiles.map(t => this._tile(t)).join('')}</div>
      </div>`;
  }

  _styles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
      :host([embed]) { padding: 24px 0; }
      :host {
        --fg-1: #0F172A; --fg-2: #475569; --fg-3: #94A3B8;
        --bg-surface: #F8FAFC; --bg-raised: #F1F5F9; --border-subtle: #E2E8F0;
        --kygo-green: #22C55E; --kygo-green-dark: #16A34A;
        display: block; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: var(--fg-1); line-height: 1.5;
      }
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      a { color: inherit; text-decoration: none; }
      svg { fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }

      .card { display: grid; gap: 20px; padding: 22px; border-radius: 20px; background: #0F172A; color: #fff; }
      @media (min-width: 720px) { .card { padding: 28px; gap: 28px; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); align-items: center; } }

      .copy { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
      .kicker { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: #6EE7A0; }
      .title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(22px, 3vw, 28px); font-weight: 700; line-height: 1.15; letter-spacing: -0.01em; color: #fff; }
      .sub { font-size: 15px; line-height: 1.5; color: rgba(255,255,255,0.75); max-width: 40ch; }
      .btn { margin-top: 8px; display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 18px; border-radius: 10px; background: var(--kygo-green); color: #0F172A; font-weight: 700; font-size: 15px; transition: background 0.2s; }
      .btn:hover { background: #4ade80; }
      .btn svg { width: 16px; height: 16px; }

      .tiles { display: grid; grid-template-columns: 1fr; gap: 10px; }
      @media (min-width: 480px) { .tiles { grid-template-columns: 1fr 1fr; } }
      .tile { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 12px; background: #fff; color: var(--fg-1); transition: transform 0.2s, box-shadow 0.2s; }
      .tile:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.25); }
      .tile-img { flex: 0 0 48px; width: 48px; height: 48px; border-radius: 10px; overflow: hidden; background: var(--bg-raised); display: flex; align-items: center; justify-content: center; }
      .tile-img img { width: 100%; height: 100%; object-fit: cover; }
      .mono { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; color: var(--fg-1); }
      .tile-text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .tile-label { font-size: 12px; font-weight: 600; color: var(--kygo-green-dark); }
      .tile-name { font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 700; line-height: 1.2; }
      .tile-go { flex: none; width: 16px; height: 16px; color: var(--fg-3); }
    `;
  }
}

if (!customElements.get('kygo-picks-card')) customElements.define('kygo-picks-card', KygoPicksCard);
