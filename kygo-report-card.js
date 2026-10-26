/**
 * Kygo Health - State of Wearable Accuracy report card (shared) Custom Element
 * Tag name: kygo-report-card
 *
 * The report gate card that sits inside blog post copy, in a Wix Blog
 * "HTML code" block. One hosted file, so a design or copy change ships to
 * every post at once. The block only carries the post's label:
 *
 *   <style>html,body{margin:0;background:transparent}</style>
 *   <kygo-report-card slug="how-accurate-is-your-heart-rate-monitor">
 *     <a href="https://www.kygo.app/state-of-wearable-accuracy" target="_top">Get the free report</a>
 *   </kygo-report-card>
 *   <script src="https://kygo-health.github.io/kygo-elements/kygo-report-card.js"></script>
 *
 * Attributes:
 *   slug  the post slug, cut to 40 chars. GA4 cta_label on gate_blog (or
 *         gate_companion for the SOWA companion post, see kygo-tracking.js).
 *
 * Tracking: the same {kygo:'promo', card:'report'} and {kygo:'embed'} messages
 * the old pasted snippet (docs/wix-snippets/blog-report-card.html) posted, so
 * kygo-tracking.js needs no change. The light-DOM link is a fallback that shows
 * only if this file fails to load.
 */

(function () {
  if (customElements.get('kygo-report-card')) return;

  const URL_REPORT = 'https://www.kygo.app/state-of-wearable-accuracy';
  const COVER = 'https://kygo-health.github.io/kygo-elements/assets/sowa/sowa-cover.webp';

  class KygoReportCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._settings = {};
    }

    static get observedAttributes() { return ['wixsettings', 'slug']; }

    connectedCallback() {
      this._parseWixAttributes();
      this.render();
      this._wire();
    }

    disconnectedCallback() {
      if (this._ro) this._ro.disconnect();
      if (this._io) this._io.disconnect();
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
        console.warn('KygoReportCard: Could not parse Wix attributes', e);
      }
    }

    _getSetting(key, fallback) { return this._settings[key] || this.getAttribute(key) || fallback; }

    get _slug() { return String(this._getSetting('slug', '')).toLowerCase().replace(/[^a-z0-9\-]/g, '-').slice(0, 40); }

    _post(msg) {
      try { if (window.top && window.top !== window) window.top.postMessage(msg, '*'); } catch (e) { /* no page */ }
    }

    _wire() {
      if (this._wired) return;
      this._wired = true;
      this.shadowRoot.addEventListener('click', (ev) => {
        const a = ev.composedPath().filter((n) => n.tagName === 'A')[0];
        if (!a) return;
        this._post({ kygo: 'promo', card: 'report', type: 'click', slug: this._slug, label: a.getAttribute('data-label') || '', url: a.href });
      }, true);
      const report = () => {
        const h = Math.ceil(this.getBoundingClientRect().bottom + (window.scrollY || 0)) + 2;
        if (h < 40) return;
        this._post({ kygo: 'embed', type: 'height', height: h });
        this._post({ type: 'kygo-embed-height', height: h });
        this._post({ kygo: 'promo', card: 'report', type: 'height', slug: this._slug, height: h });
      };
      if (typeof ResizeObserver !== 'undefined') { this._ro = new ResizeObserver(report); this._ro.observe(this); }
      window.addEventListener('load', report);
      setTimeout(report, 0);
      if (typeof IntersectionObserver !== 'undefined') {
        this._io = new IntersectionObserver((entries) => {
          if (!entries.some((x) => x.isIntersecting)) return;
          this._io.disconnect();
          this._post({ kygo: 'embed', type: 'view', slug: 'report-' + this._slug });
        }, { threshold: 0.5 });
        this._io.observe(this);
      }
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
          :host { display: block; padding: 24px 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: #0F172A; line-height: 1.5; }
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          a { text-decoration: none; }
          .card { display: grid; gap: 20px; padding: 22px; border-radius: 20px; background: #fff; border: 1.5px solid #E2E8F0; box-shadow: 0 8px 24px rgba(15,23,42,.06); }
          .copy { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
          .kicker { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #15803D; }
          .title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(22px, 4vw, 28px); line-height: 1.15; font-weight: 700; letter-spacing: -.01em; }
          .sub { font-size: 15px; line-height: 1.5; max-width: 40ch; color: #475569; }
          .btn { margin-top: 8px; display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 18px; border-radius: 10px; background: #22C55E; color: #0F172A; font-size: 15px; font-weight: 700; transition: background .2s; }
          .btn:hover { background: #4ADE80; }
          .btn svg { width: 16px; height: 16px; }
          .cover { display: block; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 28px rgba(15,23,42,.18); background: #0F172A; }
          .cover img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; }
          @media (min-width: 600px) { .card { padding: 28px; gap: 28px; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); align-items: center; } }
        </style>
        <aside class="card" aria-label="Free report">
          <div class="copy">
            <p class="kicker">Free report</p>
            <h3 class="title">Get the full rankings behind this post</h3>
            <p class="sub">Every brand's result on all 11 metrics, plus brand profiles and a buyer's guide.</p>
            <a class="btn" href="${URL_REPORT}" target="_top" data-label="button">Get the free report<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
          <a class="cover" href="${URL_REPORT}" target="_top" data-label="cover" tabindex="-1" aria-hidden="true"><img src="${COVER}" alt="" width="1280" height="720" loading="lazy"></a>
        </aside>`;
    }
  }

  customElements.define('kygo-report-card', KygoReportCard);
})();
