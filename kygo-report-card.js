/**
 * Kygo Health - State of Wearable Accuracy report card (shared) Custom Element
 * Tag name: kygo-report-card
 *
 * The free-report card used on blog posts, tool pages and the homepage. It
 * captures the email itself: the visitor types an address, the card POSTs it
 * to the site's /_functions/subscribe endpoint (Subscribers collection), then
 * sends the visitor to /report-download, where the PDF is. One hosted file, so
 * a design or copy change ships everywhere at once.
 *
 * Blog post (Wix Blog "HTML code" block, a sandboxed iframe on a Wix domain):
 *
 *   <style>html,body{margin:0;background:transparent}</style>
 *   <kygo-report-card slug="how-accurate-is-your-heart-rate-monitor">
 *     <a href="https://www.kygo.app/state-of-wearable-accuracy" target="_top">Get the free report</a>
 *   </kygo-report-card>
 *   <script src="https://kygo-health.github.io/kygo-elements/kygo-report-card.js"></script>
 *
 * Tool page / homepage (rendered inside the page component):
 *   <kygo-report-card surface="tool" slug="heart-rate-accuracy" topic="accuracy"></kygo-report-card>
 *
 * Attributes:
 *   slug     page label (post slug cut to 40 chars, or the tool slug). GA4 cta_label
 *            and part of the Subscribers source.
 *   surface  blog (default) | tool | home.
 *   topic    accuracy | general. Picks the copy: "the full rankings behind this
 *            post/tool" on accuracy pages, a plain pitch for the PDF elsewhere.
 *            Left out, it is read from the slug (contains "accura" -> accuracy).
 *
 * Subscribers.source: report-<surface>-<slug> (max 60 chars). The report-* prefix
 * is what the SOWA nurture sequence keys on.
 *
 * Tracking (GA4 via kygo-tracking.js):
 *   - signup: email_subscribe with source (in the page: the `subscribe` document
 *     event; in a blog iframe: {kygo:'embed', type:'subscribe', source} to the top).
 *   - the cover image still links to the report landing page: gate_blog /
 *     gate_companion from a blog iframe ({kygo:'promo', card:'report'} message),
 *     gate_tool / gate_home in the page (data-gate).
 */

(function () {
  if (customElements.get('kygo-report-card')) return;

  const URL_REPORT = 'https://www.kygo.app/state-of-wearable-accuracy';
  const URL_DOWNLOAD = 'https://www.kygo.app/report-download';
  const ENDPOINT = 'https://www.kygo.app/_functions/subscribe';
  const COVER = 'https://kygo-health.github.io/kygo-elements/assets/sowa/sowa-cover.webp';
  // Accuracy-named posts whose page has no ranking behind it.
  const GENERAL_SLUGS = ['wearable-skin-temperature-accuracy'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  class KygoReportCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._settings = {};
      this._state = 'idle';
      this._error = '';
    }

    static get observedAttributes() { return ['wixsettings', 'slug', 'surface', 'topic']; }

    connectedCallback() {
      this._parseWixAttributes();
      this.render();
      this._wire();
    }

    disconnectedCallback() {
      if (this._ro) this._ro.disconnect();
      if (this._io) this._io.disconnect();
      clearTimeout(this._timeout);
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
    get _surface() { const s = String(this._getSetting('surface', 'blog')).toLowerCase(); return ['blog', 'tool', 'home'].includes(s) ? s : 'blog'; }
    get _topic() {
      const t = String(this._getSetting('topic', '')).toLowerCase();
      if (t === 'accuracy' || t === 'general') return t;
      const slug = this._slug;
      return /accura/.test(slug) && !GENERAL_SLUGS.includes(slug) ? 'accuracy' : 'general';
    }
    get _source() { return ('report-' + this._surface + (this._slug ? '-' + this._slug : '')).slice(0, 60); }
    get _inFrame() { try { return window.top !== window; } catch (e) { return true; } }

    _post(msg) {
      try { if (this._inFrame) window.top.postMessage(msg, '*'); } catch (e) { /* no page */ }
    }

    _copy() {
      if (this._topic === 'accuracy') {
        const where = this._surface === 'tool' ? 'tool' : 'post';
        return {
          title: 'Get the full rankings behind this ' + where,
          sub: "Every brand's result on all 11 metrics, plus brand profiles and a buyer's guide."
        };
      }
      if (this._surface === 'home') {
        return {
          title: 'How accurate is your wearable, really?',
          sub: "Every brand's result on all 11 metrics, from 71 peer-reviewed studies, plus brand profiles and a buyer's guide."
        };
      }
      return {
        title: 'The State of Wearable Accuracy 2026',
        sub: 'How accurate every major wearable really is on 11 metrics, from 71 peer-reviewed studies.'
      };
    }

    _wire() {
      if (this._wired) return;
      this._wired = true;
      this.shadowRoot.addEventListener('click', (ev) => {
        const a = ev.composedPath().filter((n) => n.tagName === 'A')[0];
        if (!a || !a.classList.contains('cover')) return;
        this._post({ kygo: 'promo', card: 'report', type: 'click', slug: this._slug, label: 'cover', url: a.href });
      }, true);
      this.shadowRoot.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const input = this.shadowRoot.querySelector('input[type=email]');
        const email = (input && input.value || '').trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          this._error = 'Please enter a valid email.';
          this.render();
          const i = this.shadowRoot.querySelector('input[type=email]');
          if (i) { i.value = email; i.focus(); }
          return;
        }
        this._submit(email);
      });
      const report = () => {
        if (!this._inFrame) return;
        const h = Math.ceil(this.getBoundingClientRect().bottom + (window.scrollY || 0)) + 2;
        if (h < 40) return;
        this._post({ kygo: 'embed', type: 'height', height: h });
        this._post({ type: 'kygo-embed-height', height: h });
        this._post({ kygo: 'promo', card: 'report', type: 'height', slug: this._slug, height: h });
      };
      if (typeof ResizeObserver !== 'undefined') { this._ro = new ResizeObserver(report); this._ro.observe(this); }
      window.addEventListener('load', report);
      setTimeout(report, 0);
      if (this._inFrame && typeof IntersectionObserver !== 'undefined') {
        this._io = new IntersectionObserver((entries) => {
          if (!entries.some((x) => x.isIntersecting)) return;
          this._io.disconnect();
          this._post({ kygo: 'embed', type: 'view', slug: 'report-' + this._slug });
        }, { threshold: 0.5 });
        this._io.observe(this);
      }
    }

    /** POST the email, then go to the download page. In a blog iframe the
     *  endpoint is cross-origin: if the response cannot be read, the request is
     *  re-sent as a simple no-cors POST and the visitor goes on to the PDF (the
     *  download page never depends on the row being written). */
    _submit(email) {
      const source = this._source;
      const body = JSON.stringify({ email, source });
      this._state = 'loading';
      this._error = '';
      this.render();
      clearTimeout(this._timeout);
      this._timeout = setTimeout(() => {
        if (this._state === 'loading') this._done(source);
      }, 8000);
      const sameOrigin = !this._inFrame && /(^|\.)kygo\.app$/.test(location.hostname);
      const url = sameOrigin ? '/_functions/subscribe' : ENDPOINT;
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
        .then((res) => {
          if (res && res.ok) return this._done(source);
          if (res && res.status === 400) {
            clearTimeout(this._timeout);
            this._state = 'idle';
            this._error = 'Please enter a valid email.';
            this.render();
            return null;
          }
          return this._done(source);
        })
        .catch(() => {
          try {
            fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain' }, body });
          } catch (e) { /* nothing more to try */ }
          this._done(source);
        });
    }

    _done(source) {
      if (this._state === 'success') return null;
      clearTimeout(this._timeout);
      this._state = 'success';
      this.render();
      if (this._inFrame) {
        this._post({ kygo: 'embed', type: 'subscribe', source, slug: this._slug });
      } else {
        this.dispatchEvent(new CustomEvent('subscribe', { bubbles: true, composed: true, detail: { source, component: 'kygo-report-card' } }));
      }
      setTimeout(() => {
        try {
          if (this._inFrame) window.top.location.href = URL_DOWNLOAD;
          else window.location.assign(URL_DOWNLOAD);
        } catch (e) { /* the button in the success state takes them there */ }
      }, 500);
      return null;
    }

    render() {
      const c = this._copy();
      const gate = this._surface === 'tool' ? 'gate_tool' : this._surface === 'home' ? 'gate_home' : '';
      const gateAttr = gate && !this._inFrame ? ` data-gate="${gate}" data-track-position="report-cover" data-track-label="report-${esc(this._slug || this._surface)}"` : '';
      const loading = this._state === 'loading';
      const form = this._state === 'success'
        ? `<div class="ok" role="status" aria-live="polite">
             <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
             <span>You're in. Opening your report…</span>
             <a class="btn" href="${URL_DOWNLOAD}" target="_top">Open the report</a>
           </div>`
        : `<form novalidate>
             <label class="sr" for="rc-email">Email address</label>
             <input id="rc-email" type="email" required placeholder="you@email.com" autocomplete="email" ${loading ? 'disabled' : ''}>
             <button class="btn" type="submit" ${loading ? 'disabled' : ''}>${loading ? 'Sending…' : 'Get the free report'}</button>
           </form>
           ${this._error ? `<p class="err">${esc(this._error)}</p>` : ''}`;
      this.shadowRoot.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
          :host { display: block; padding: 24px 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: #0F172A; line-height: 1.5; }
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          a { text-decoration: none; }
          .card { display: grid; gap: 20px; padding: 22px; border-radius: 20px; background: #fff; border: 1.5px solid #E2E8F0; box-shadow: 0 8px 24px rgba(15,23,42,.06); }
          .copy { display: flex; flex-direction: column; align-items: stretch; gap: 8px; min-width: 0; }
          .kicker { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #15803D; }
          .title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(22px, 4vw, 28px); line-height: 1.15; font-weight: 700; letter-spacing: -.01em; }
          .sub { font-size: 15px; line-height: 1.5; max-width: 42ch; color: #475569; }
          form { margin-top: 8px; display: flex; flex-direction: column; gap: 8px; max-width: 440px; }
          input { width: 100%; height: 48px; padding: 0 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font: inherit; font-size: 15px; color: #0F172A; background: #fff; outline: none; transition: border-color .2s, box-shadow .2s; }
          input:focus { border-color: #22C55E; box-shadow: 0 0 0 4px rgba(34,197,94,.12); }
          input::placeholder { color: #94A3B8; }
          .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 0 18px; border: 0; border-radius: 10px; background: #22C55E; color: #0F172A; font: inherit; font-size: 15px; font-weight: 700; white-space: nowrap; cursor: pointer; transition: background .2s; }
          .btn:hover { background: #4ADE80; }
          .btn[disabled] { opacity: .6; cursor: default; }
          .fine { font-size: 12px; color: #64748B; }
          .err { font-size: 13px; color: #DC2626; }
          .ok { margin-top: 8px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px; padding: 12px 14px; border-radius: 12px; background: #F0FDF4; border: 1.5px solid #BBF7D0; font-size: 14px; font-weight: 600; color: #14532D; max-width: 440px; }
          .ok svg { width: 20px; height: 20px; fill: none; stroke: #16A34A; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; flex: none; }
          .ok .btn { min-height: 40px; }
          .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
          .cover { display: block; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 28px rgba(15,23,42,.18); background: #0F172A; }
          .cover img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; }
          @media (min-width: 520px) { form { flex-direction: row; flex-wrap: wrap; } input, .btn { min-height: 44px; height: 44px; } input { flex: 1 1 190px; width: auto; } .btn { flex: 1 0 auto; } }
          @media (min-width: 600px) { .card { padding: 28px; gap: 36px; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; } }
        </style>
        <aside class="card" aria-label="Free report">
          <div class="copy">
            <p class="kicker">Free PDF report</p>
            <h3 class="title">${esc(c.title)}</h3>
            <p class="sub">${esc(c.sub)}</p>
            ${form}
          </div>
          <a class="cover" href="${URL_REPORT}" target="_top"${gateAttr} tabindex="-1" aria-hidden="true"><img src="${COVER}" alt="" width="1280" height="720" loading="lazy"></a>
        </aside>`;
    }
  }

  customElements.define('kygo-report-card', KygoReportCard);
})();
