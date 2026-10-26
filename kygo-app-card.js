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
 *   focus     which insight the phone mockup shows: hrv (default). More
 *             (sleep, heart, food) get added to VISUALS below.
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
 * The store buttons use the standard Tenjin links owned by kygo-cta.js (loaded first)
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

  /** The insight shown on the phone mockup, one per focus. Sample data, the same
   *  example the homepage uses. */
  const VISUALS = {
    hrv: {
      eyebrow: 'CAFFEINE → HRV',
      title: 'Caffeine after 2pm lowers next-day HRV',
      rows: [
        { label: 'Under 95mg', width: 72, color: '#64748B', value: '32 ms' },
        { label: 'Over 95mg', width: 48, color: '#EF4444', value: '24 ms' }
      ],
      log: { name: 'Coffee', meta: '2:30 PM · 95mg' }
    }
  };

  const APPLE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 12.5c-.02-2.1 1.71-3.11 1.79-3.16-.98-1.43-2.5-1.62-3.03-1.64-1.29-.13-2.52.76-3.17.76-.65 0-1.66-.74-2.73-.72-1.4.02-2.7.82-3.42 2.07-1.46 2.54-.37 6.3 1.05 8.36.7 1.01 1.53 2.14 2.62 2.1 1.05-.04 1.45-.68 2.72-.68 1.27 0 1.63.68 2.74.66 1.13-.02 1.85-1.03 2.54-2.04.8-1.17 1.13-2.3 1.15-2.36-.03-.01-2.2-.84-2.22-3.35zM15.02 5.9c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.53.62-1 1.61-.88 2.56.93.07 1.88-.47 2.46-1.16z"/></svg>';
  const ANDROID = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 9v7a1 1 0 001 1h1v3a1 1 0 002 0v-3h4v3a1 1 0 002 0v-3h1a1 1 0 001-1V9H6zM4.5 9A1.5 1.5 0 003 10.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 004.5 9zm15 0a1.5 1.5 0 00-1.5 1.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 0019.5 9zM15.5 4.2l1-1.4a.3.3 0 00-.5-.35l-1.1 1.53a5.9 5.9 0 00-3.8 0L9.99 2.45a.3.3 0 00-.5.35l1 1.4A5.28 5.28 0 006 8.2h12a5.28 5.28 0 00-2.5-4zM9.5 6.4a.6.6 0 110-1.2.6.6 0 010 1.2zm5 0a.6.6 0 110-1.2.6.6 0 010 1.2z"/></svg>';

  /** One real App Store review, shown under the buttons on wider cards. */
  const REVIEW = 'Strikes the balance of seamlessness and data analytics perfectly.';

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

    /** ios | android | desktop, the same test kygo-cta.js uses. */
    _platform() {
      try {
        const ua = navigator.userAgent || '';
        if (/iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
        if (/Android/i.test(ua)) return 'android';
      } catch (e) { /* desktop */ }
      return 'desktop';
    }

    /** Store buttons. The Tenjin Website-channel links are owned by kygo-cta.js
     *  (loaded first, read here as TENJIN_IOS / TENJIN_ANDROID); this adds the
     *  post as site_id and variant-position as creative_name, so installs read
     *  per post and per design in Tenjin. A phone gets its own store alone,
     *  desktop gets iPhone filled plus Android. */
    _wireStoreLinks() {
      const box = this.shadowRoot.querySelector('.btns');
      if (!box || typeof TENJIN_IOS === 'undefined' || typeof TENJIN_ANDROID === 'undefined') return;
      const q = '?site_id=' + encodeURIComponent(this._post) +
        '&creative_name=' + encodeURIComponent('app-card-' + this._variant + '-' + this._position);
      const ios = (cls) => `<a class="btn ${cls}" href="${esc(TENJIN_IOS + q)}" data-destination="ios" target="_blank" rel="noopener" aria-label="Start your free trial on the App Store">${APPLE}<span>${cls === 'primary' ? 'Start your free trial' : 'iPhone'}</span></a>`;
      const android = (cls) => `<a class="btn ${cls}" href="${esc(TENJIN_ANDROID + q)}" data-destination="android" target="_blank" rel="noopener" aria-label="Start your free trial on Google Play">${ANDROID}<span>${cls === 'primary' ? 'Start your free trial' : 'Android'}</span></a>`;
      const pf = this._platform();
      box.classList.toggle('solo', pf !== 'desktop');
      box.innerHTML = pf === 'ios' ? ios('primary') : pf === 'android' ? android('primary') : ios('primary') + android('secondary');
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

    _phone() {
      const v = VISUALS[clean(this._getSetting('focus', 'hrv'), 10)] || VISUALS.hrv;
      const rows = v.rows.map((r) => `
        <div class="p-row"><span class="p-lbl">${esc(r.label)}</span><span class="p-track"><span style="width:${Number(r.width)}%;background:${esc(r.color)}"></span></span><span class="p-val">${esc(r.value)}</span></div>`).join('');
      return `
        <div class="phone" aria-hidden="true"><div class="screen">
          <div class="island"></div>
          <div class="status"><span>9:41</span><span class="batt"></span></div>
          <div class="p-body">
            <div class="p-head"><span class="p-title">Insights</span><span class="p-sub">Last 47 days</span></div>
            <div class="p-card">
              <div class="p-top"><span class="p-eye">${esc(v.eyebrow)}</span><span class="p-real">Likely real</span></div>
              <p class="p-find">${esc(v.title)}</p>
              ${rows}
            </div>
            <div class="p-log"><span class="p-ic"><span></span></span><span class="p-logtxt"><b>${esc(v.log.name)}</b><span>${esc(v.log.meta)}</span></span><span class="p-ok">Logged</span></div>
          </div>
        </div></div>`;
    }

    render() {
      const headline = this._getSetting('headline', 'See what your food does to your sleep and HRV.');
      const sub = this._getSetting('sub', 'Kygo matches what you eat to the data your wearable already collects.');
      this.shadowRoot.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
          :host { display: block; padding: 24px 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: #0F172A; line-height: 1.5; }
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          .card { position: relative; overflow: hidden; border-radius: 18px; padding: 22px 20px 0; color: #fff;
            background: radial-gradient(300px 200px at 100% 100%, rgba(34,197,94,.22), transparent 70%), #0F172A; }
          .kicker { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #6EE7A0; margin-bottom: 8px; }
          .title { font-family: 'Space Grotesk', sans-serif; font-size: 22px; line-height: 1.2; font-weight: 700; letter-spacing: -.01em; color: #fff; margin-bottom: 6px; }
          .sub { font-size: 14px; line-height: 1.45; color: rgba(255,255,255,.72); }
          .btns { margin-top: 16px; display: flex; gap: 10px; min-height: 48px; }
          .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 0 18px; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; white-space: nowrap; transition: background .2s, border-color .2s; }
          .btn svg { width: 16px; height: 16px; flex: none; }
          .btn.primary { background: #22C55E; color: #0F172A; }
          .btn.primary:hover { background: #4ADE80; }
          .btn.secondary { color: #fff; border: 1px solid rgba(255,255,255,.22); font-weight: 600; }
          .btn.secondary:hover { border-color: #22C55E; }
          .btns.solo .btn { flex: 1; }
          .review { display: none; }

          .phone { position: relative; width: 236px; height: 400px; margin: 20px auto -210px; padding: 7px; border-radius: 40px;
            background: linear-gradient(160deg, #334155, #0B1220); box-shadow: 0 0 0 1px rgba(255,255,255,.10), 0 40px 70px -24px rgba(0,0,0,.75); }
          .screen { position: relative; height: 100%; border-radius: 33px; background: #F8FAFC; overflow: hidden; color: #0F172A; }
          .island { position: absolute; top: 8px; left: 50%; margin-left: -38px; width: 76px; height: 22px; border-radius: 12px; background: #0B1220; }
          .status { display: flex; justify-content: space-between; align-items: center; padding: 11px 20px 0; font-size: 11px; font-weight: 700; }
          .batt { width: 14px; height: 7px; border-radius: 2px; background: #0F172A; }
          .p-body { padding: 20px 14px 0; }
          .p-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; }
          .p-title { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; }
          .p-sub { font-size: 10px; font-weight: 600; color: #64748B; }
          .p-card { padding: 12px; border-radius: 14px; background: #fff; border: 1px solid #E2E8F0; box-shadow: 0 6px 16px -10px rgba(15,23,42,.25); }
          .p-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
          .p-eye { font-size: 9.5px; font-weight: 700; letter-spacing: .5px; color: #64748B; }
          .p-real { padding: 2px 7px; border-radius: 99px; background: #ECFDF5; color: #15803D; font-size: 9.5px; font-weight: 700; }
          .p-find { font-family: 'Space Grotesk', sans-serif; font-size: 13px; line-height: 1.25; font-weight: 700; margin-bottom: 10px; }
          .p-row { display: flex; align-items: center; gap: 8px; margin-top: 7px; }
          .p-lbl { width: 62px; font-size: 10px; color: #475569; }
          .p-track { flex: 1; height: 7px; border-radius: 99px; background: #E2E8F0; overflow: hidden; }
          .p-track span { display: block; height: 100%; }
          .p-val { width: 34px; text-align: right; font-size: 11px; font-weight: 700; }
          .p-log { margin-top: 10px; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 14px; background: #fff; border: 1px solid #E2E8F0; }
          .p-ic { width: 28px; height: 28px; border-radius: 8px; background: #FEF3C7; display: flex; align-items: center; justify-content: center; }
          .p-ic span { width: 10px; height: 10px; border-radius: 3px; background: #D97706; }
          .p-logtxt { flex: 1; display: flex; flex-direction: column; font-size: 10px; color: #64748B; }
          .p-logtxt b { font-size: 11.5px; font-weight: 600; color: #0F172A; }
          .p-ok { font-size: 10px; font-weight: 700; color: #16A34A; }

          @media (min-width: 600px) {
            .card { padding: 28px 286px 28px 32px; border-radius: 20px;
              background: radial-gradient(420px 300px at 85% 110%, rgba(34,197,94,.28), transparent 70%), #0F172A; }
            .title { font-size: 26px; line-height: 1.15; }
            .sub { font-size: 15px; line-height: 1.5; }
            .btns { margin-top: 18px; }
            .btn { min-height: 44px; }
            .phone { position: absolute; right: 32px; top: 28px; height: 460px; margin: 0; }
            .review { display: block; margin-top: 16px; padding: 10px 12px; border-radius: 12px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); }
            .r-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
            .stars { color: #FBBF24; font-size: 12px; letter-spacing: 1px; }
            .review figcaption { font-size: 11.5px; color: rgba(255,255,255,.5); }
            .review blockquote { font-size: 13px; line-height: 1.4; color: rgba(255,255,255,.88); }
          }
        </style>
        <aside class="card" aria-label="Kygo app">
          <p class="kicker">Kygo app</p>
          <h3 class="title">${esc(headline)}</h3>
          <p class="sub">${esc(sub)}</p>
          <div class="btns">
          </div>
          <figure class="review">
            <div class="r-top"><span class="stars" aria-label="5 out of 5 stars">★★★★★</span><figcaption>App Store review</figcaption></div>
            <blockquote>“${esc(REVIEW)}”</blockquote>
          </figure>
          ${this._phone()}
        </aside>`;
    }
  }

  customElements.define('kygo-app-card', KygoAppCard);
})();
