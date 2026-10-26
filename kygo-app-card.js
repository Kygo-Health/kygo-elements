/**
 * Kygo Health - Blog app card (shared) Custom Element
 * Tag name: kygo-app-card
 *
 * The app download card that sits inside blog post copy, in a Wix Blog
 * "HTML code" block. One hosted file, so a design change ships to every post
 * at once; each post's block only carries its own words and labels:
 *
 *   <style>html,body{margin:0;background:transparent}</style>
 *   <kygo-app-card post="how-accurate-is-your-heart-rate-monitor" position="mid"
 *     slug="hr-monitor-mid" focus="hrv" variant="v1"
 *     headline="Separate real patterns from noise."
 *     sub="Kygo matches your heart rate, HRV and sleep to what you actually ate.">
 *     <a href="https://www.kygo.app" target="_top">Get the Kygo app</a>
 *   </kygo-app-card>
 *   <script src="https://kygo-health.github.io/kygo-elements/kygo-app-card.js"></script>
 *
 * Attributes:
 *   post      the blog post's URL slug. Goes to Tenjin as site_id, so installs
 *             can be read per post (Tenjin reporting group_by=site).
 *   position  mid | end (where the card sits in the post).
 *   slug      unique per placement, max 30 chars. The GA4 cta_label (and the
 *             cta_view label). Keep it short: <post-short>-<position>.
 *   variant   design/copy variant id, default "v1". Goes to GA4 as cta_content
 *             and to Tenjin as part of creative_name (<variant>-<position>), so
 *             designs can be compared once more than one exists.
 *   focus     which example finding shows on the right: hrv (default). More
 *             visuals (sleep, heart, food) get added to VISUALS below.
 *   headline  the post's own hook. Never reused across posts.
 *   sub       one sentence under the headline.
 *
 * The light-DOM <a> inside the element is a fallback: it shows only if this
 * file fails to load, so a post never shows an empty box.
 *
 * Tracking (the block is a sandboxed iframe, so the page's GA4 listener cannot
 * see inside it). This file posts to the top window, where kygo-tracking.js
 * files them:
 *   {kygo:'embed', type:'click', destination, slug, content, url} -> GA4 cta_click
 *       (ios_download / android_download, cta_label = slug, cta_content = variant,
 *       page_path = the post)
 *   {kygo:'embed', type:'view', slug, content}  -> GA4 cta_view, once per card
 *   {kygo:'embed', type:'height', height}       -> the page sizes the iframe
 * The store buttons are <kygo-cta apps>, pointed at the standard Tenjin
 * Website-channel links with site_id and creative_name appended.
 */

(function () {
  if (customElements.get('kygo-app-card')) return;

  const CTA_SRC = 'https://kygo-health.github.io/kygo-elements/kygo-cta.js';

  /** Loads the shared <kygo-cta> element once and resolves when it is defined. */
  function ensureKygoCta() {
    if (customElements.get('kygo-cta')) return Promise.resolve();
    if (!document.querySelector('script[data-kygo-cta-loader]')) {
      const s = document.createElement('script');
      s.src = CTA_SRC;
      s.setAttribute('data-kygo-cta-loader', '');
      document.head.appendChild(s);
    }
    return customElements.whenDefined('kygo-cta');
  }

  /** Keeps a label to the characters kygo-tracking.js accepts. */
  function clean(v, max) {
    return String(v == null ? '' : v).toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, max);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /** Example findings, the same sample data the homepage uses. One per focus. */
  const VISUALS = {
    hrv: {
      label: 'Example Kygo finding: over 95mg of caffeine after 2pm drops HRV by 8 ms the next day',
      eyebrow: 'LATE CAFFEINE → HRV',
      title: 'Over 95mg of caffeine after 2pm drops HRV by 8ms next day',
      delta: '−8 ms',
      rows: [
        { label: 'Under 95mg', days: '31 days', width: 72, color: '#64748B', value: '32 ms' },
        { label: 'Over 95mg', days: '16 days', width: 48, color: '#EF4444', value: '24 ms' }
      ],
      chips: ['47 days', 'Next-day effect']
    }
  };

  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';

  class KygoAppCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._settings = {};
      this._onClick = this._onClick.bind(this);
    }

    static get observedAttributes() { return ['wixsettings', 'post', 'position', 'slug', 'variant', 'focus', 'headline', 'sub']; }

    connectedCallback() {
      this._parseWixAttributes();
      this.render();
      this.shadowRoot.addEventListener('click', this._onClick, true);
      this._watchHeight();
      this._watchView();
      ensureKygoCta().then(() => this._wireStoreLinks());
    }

    disconnectedCallback() {
      this.shadowRoot.removeEventListener('click', this._onClick, true);
      if (this._ro) this._ro.disconnect();
      if (this._io) this._io.disconnect();
    }

    attributeChangedCallback(name, oldV, newV) {
      if (oldV === newV || !this.isConnected) return;
      if (name === 'wixsettings') this._parseWixAttributes();
      this.render();
      if (customElements.get('kygo-cta')) this._wireStoreLinks();
    }

    _parseWixAttributes() {
      try {
        const s = this.getAttribute('wixsettings');
        if (s) this._settings = JSON.parse(s);
      } catch (e) {
        console.warn('KygoAppCard: Could not parse Wix attributes', e);
      }
    }

    _getSetting(key, fallback) { return this._settings[key] || this.getAttribute(key) || fallback; }

    get _post() { return clean(this._getSetting('post', 'unknown'), 100) || 'unknown'; }
    get _position() { return clean(this._getSetting('position', 'mid'), 10) || 'mid'; }
    get _slug() { return clean(this._getSetting('slug', this._post.slice(0, 25) + '-' + this._position), 30); }
    get _variant() { return clean(this._getSetting('variant', 'v1'), 20) || 'v1'; }

    /* ── Tracking ─────────────────────────────────────────────────────── */

    _top() { return window.top && window.top !== window ? window.top : null; }

    _send(msg) {
      const top = this._top();
      if (!top) return;
      msg.kygo = 'embed';
      try { top.postMessage(msg, '*'); } catch (e) { /* no page to report to */ }
    }

    /** Store links: the standard Tenjin Website-channel links (owned by
     *  kygo-cta.js) with the post as site_id and variant-position as
     *  creative_name, so installs read per post and per design in Tenjin. */
    _wireStoreLinks() {
      const cta = this.shadowRoot.querySelector('kygo-cta');
      if (!cta || typeof TENJIN_IOS === 'undefined' || typeof TENJIN_ANDROID === 'undefined') return;
      const q = '?site_id=' + encodeURIComponent(this._post) +
        '&creative_name=' + encodeURIComponent('app-card-' + this._variant + '-' + this._position);
      if (cta.getAttribute('ios-link') !== TENJIN_IOS + q) cta.setAttribute('ios-link', TENJIN_IOS + q);
      if (cta.getAttribute('android-link') !== TENJIN_ANDROID + q) cta.setAttribute('android-link', TENJIN_ANDROID + q);
    }

    _onClick(e) {
      const path = e.composedPath ? e.composedPath() : [e.target];
      const link = path.filter((n) => n && n.tagName === 'A' && n.getAttribute && n.getAttribute('data-destination'))[0];
      if (!link) return;
      this._send({ type: 'click', destination: link.getAttribute('data-destination'), slug: this._slug, content: this._variant, url: link.href });
    }

    _watchView() {
      if (typeof IntersectionObserver === 'undefined') return;
      this._io = new IntersectionObserver((entries) => {
        if (!entries.some((x) => x.isIntersecting)) return;
        this._io.disconnect();
        this._send({ type: 'view', slug: this._slug, content: this._variant });
      }, { threshold: 0.5 });
      this._io.observe(this);
    }

    _watchHeight() {
      const report = () => {
        const h = Math.ceil(this.getBoundingClientRect().bottom + (window.scrollY || 0)) + 2;
        if (h < 40) return;
        this._send({ type: 'height', height: h });
        const top = this._top();
        // The HLTH bridge on the page listens for this older shape as well.
        if (top) { try { top.postMessage({ type: 'kygo-embed-height', height: h }, '*'); } catch (e) { /* ignore */ } }
      };
      if (typeof ResizeObserver !== 'undefined') {
        this._ro = new ResizeObserver(report);
        this._ro.observe(this);
      }
      window.addEventListener('load', report);
      setTimeout(report, 0);
    }

    /* ── Render ───────────────────────────────────────────────────────── */

    _visual() {
      const v = VISUALS[clean(this._getSetting('focus', 'hrv'), 10)] || VISUALS.hrv;
      const rows = v.rows.map((r) => `
        <div class="crow">
          <span class="crow-label">${esc(r.label)} <span class="days">· ${esc(r.days)}</span></span>
          <span class="crow-track"><span class="crow-fill" style="width:${Number(r.width)}%;background:${esc(r.color)}"></span></span>
          <span class="crow-val">${esc(r.value)}</span>
        </div>`).join('');
      return `
        <div class="finding" role="img" aria-label="${esc(v.label)}">
          <div class="f-head">
            <div>
              <p class="f-eyebrow">${esc(v.eyebrow)}</p>
              <p class="f-title">${esc(v.title)}</p>
            </div>
            <span class="delta">${esc(v.delta)}</span>
          </div>
          <div class="compare">${rows}</div>
          <div class="chips">
            <span class="chip real">${CHECK}Likely real</span>
            ${v.chips.map((c) => `<span class="chip">${esc(c)}</span>`).join('')}
          </div>
        </div>`;
    }

    render() {
      const headline = this._getSetting('headline', 'See what your food does to your sleep and HRV.');
      const sub = this._getSetting('sub', 'Kygo matches what you eat to the data your wearable already collects.');
      this.shadowRoot.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
          :host { display: block; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: #0F172A; line-height: 1.5; }
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          .card { display: grid; gap: 20px; padding: 22px; border-radius: 20px; background: #0F172A; color: #fff; }
          @media (min-width: 600px) { .card { padding: 28px; gap: 28px; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); align-items: center; } }
          .copy { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; min-width: 0; }
          .kicker { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #6EE7A0; }
          .title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(22px, 4vw, 28px); line-height: 1.15; font-weight: 700; letter-spacing: -.01em; color: #fff; }
          .sub { font-size: 15px; line-height: 1.5; color: rgba(255,255,255,.75); max-width: 40ch; }
          .btns { margin-top: 8px; width: 100%; min-width: 0; }

          .finding { background: #fff; color: #0F172A; border-radius: 16px; padding: 16px; box-shadow: 0 20px 40px -20px rgba(0,0,0,.5); min-width: 0; }
          .f-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
          .f-eyebrow { font-size: 10.5px; font-weight: 700; letter-spacing: .6px; color: #64748B; margin-bottom: 4px; }
          .f-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15.5px; line-height: 1.25; }
          .delta { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 12.5px; color: #DC2626; background: #FEF2F2; padding: 5px 10px; border-radius: 999px; white-space: nowrap; }
          .compare { display: flex; flex-direction: column; gap: 10px; background: #F5F7FA; border-radius: 12px; padding: 12px; }
          .crow { display: flex; align-items: center; gap: 10px; }
          .crow-label { width: 96px; flex-shrink: 0; font-size: 12px; line-height: 1.3; color: #475569; }
          .days { color: #64748B; display: block; font-size: 11px; }
          .crow-track { flex: 1; min-width: 30px; height: 8px; background: #E2E8F0; border-radius: 99px; overflow: hidden; }
          .crow-fill { display: block; height: 100%; border-radius: 99px; }
          .crow-val { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13.5px; width: 44px; text-align: right; }
          .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
          .chip { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 600; padding: 4px 9px; border-radius: 999px; background: #F1F5F9; color: #475569; white-space: nowrap; }
          .chip.real { background: #ECFDF5; color: #15803D; font-weight: 700; }
          .chip svg { width: 11px; height: 11px; }
          @media (min-width: 420px) { .days { display: inline; font-size: 12px; } .crow-label { width: 132px; } }
          @media (min-width: 600px) { .days { display: block; font-size: 11px; } .crow-label { width: 84px; } }
        </style>
        <aside class="card" aria-label="Kygo app">
          <div class="copy">
            <p class="kicker">Kygo app</p>
            <h3 class="title">${esc(headline)}</h3>
            <p class="sub">${esc(sub)}</p>
            <div class="btns">
              <kygo-cta apps theme="dark" align="left" note="" surface="blog"
                slug="${esc(this._slug)}" content="${esc(this._variant)}"></kygo-cta>
            </div>
          </div>
          ${this._visual()}
        </aside>`;
    }
  }

  customElements.define('kygo-app-card', KygoAppCard);
})();
