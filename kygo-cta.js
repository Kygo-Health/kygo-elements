/**
 * Kygo Health - Shared conversion CTA Custom Element for Wix
 * Tag name: kygo-cta
 *
 * One element, one destination config, used on the homepage hero, blog CTA
 * blocks, tool page CTA blocks and /faq. It renders the button cluster only
 * (hook line, primary button, secondary buttons, reassurance note) so it drops
 * straight into an existing card or hero without bringing its own chrome.
 *
 * Attributes:
 *   slug    (required) campaign id, used verbatim as utm_campaign and as the
 *           Apple `ct` value. Must be unique per placement.
 *   surface home | blog | tool | faq. Used as utm_medium.
 *   hook    topic-matched line on the reader's payoff, shown above the buttons.
 *   theme   dark (on the navy conversion card) | light (default, on white).
 *   align   center (default) | left.
 *   note    reassurance line under the buttons. Pass note="" to hide it.
 *   compact thin-bar variant for narrow strips (the FAQ mid-page band, the
 *           homepage inline band): smaller buttons that stay on one row.
 *
 * Destinations:
 *   Desktop  primary  -> app.kygo.app/signup with utm_source/medium/campaign.
 *   iOS      primary  -> App Store with pt/ct attribution (ct capped at 30).
 *   Android  primary  -> Play Store with an encoded install referrer.
 *
 * Layout: all three platforms are always on screen. The visitor's own device
 * takes the filled primary button and leads; the other two follow as outline
 * buttons, in a row on desktop and as a two-up row under the primary on a
 * phone.
 *
 * Analytics: fires Mixpanel `cta_clicked` with {slug, surface, destination} on
 * every button click, and mirrors the same payload as a bubbling `kygo-cta-click`
 * CustomEvent so Wix Velo and GA4 can listen without a second wiring pass.
 */

/** Injects accessible text into light DOM so crawlers and AI tools can read component content */
function __ctaSeo(el, text) {
  if (el.querySelector('[data-seo]')) return;
  const d = document.createElement('div');
  d.setAttribute('data-seo', '');
  d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
  d.textContent = text;
  el.appendChild(d);
}

class KygoCta extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
    this._onClick = this._onClick.bind(this);
  }

  static get observedAttributes() { return ['wixsettings', 'slug', 'surface', 'hook', 'theme', 'align', 'note', 'compact']; }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._attachEventListeners();
    try { __ctaSeo(this, this._seoText()); } catch (e) { /* SEO text is not worth failing over */ }
  }

  disconnectedCallback() {
    if (this._root) this._root.removeEventListener('click', this._onClick);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.shadowRoot) return;
    if (name === 'wixsettings') this._parseWixAttributes();
    if (!this.isConnected) return;
    this.render();
    this._attachEventListeners();
  }

  _parseWixAttributes() {
    try {
      const wixconfig = this.getAttribute('wixconfig');
      const wixsettings = this.getAttribute('wixsettings');
      if (wixconfig) this._config = JSON.parse(wixconfig);
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {
      console.warn('KygoCta: Could not parse Wix attributes', e);
    }
  }

  _getSetting(key, fallback) {
    const v = this._settings[key] != null ? this._settings[key] : this.getAttribute(key);
    return v == null ? fallback : v;
  }

  /* ── Destinations ─────────────────────────────────────────────────────── */

  get _slug() {
    // Slug doubles as utm_campaign, so keep it to safe URL characters.
    return String(this._getSetting('slug', 'kygo') || 'kygo')
      .toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'kygo';
  }

  get _surface() {
    const s = String(this._getSetting('surface', 'home') || 'home').toLowerCase();
    return ['home', 'blog', 'tool', 'faq'].indexOf(s) > -1 ? s : 'home';
  }

  /** Apple's `ct` field is capped at 30 characters. */
  get _ct() { return this._slug.slice(0, 30); }

  _webUrl(path) {
    const p = path || '/signup';
    return 'https://app.kygo.app' + p +
      '?utm_source=kygo.app&utm_medium=' + encodeURIComponent(this._surface) +
      '&utm_campaign=' + encodeURIComponent(this._slug);
  }

  get _iosUrl() {
    return 'https://apps.apple.com/app/apple-store/id6749870589?pt=128052235&ct=' +
      encodeURIComponent(this._ct) + '&mt=8';
  }

  get _androidUrl() {
    const referrer = 'utm_source=kygo.app&utm_medium=' + this._surface + '&utm_campaign=' + this._slug;
    return 'https://play.google.com/store/apps/details?id=com.ryanobzud.foodhealthtracker&referrer=' +
      encodeURIComponent(referrer);
  }

  /** ios | android | desktop. Detection only decides which button leads: all
   *  three platforms render either way, and anything unrecognised (or a
   *  navigator that throws) falls back to desktop, so a visitor is never left
   *  without a way in. */
  _platform() {
    try {
      const ua = (navigator && navigator.userAgent) || '';
      const touch = (navigator && navigator.maxTouchPoints) || 0;
      if (/iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && touch > 1)) return 'ios';
      if (/Android/i.test(ua)) return 'android';
    } catch (e) { /* fall through to desktop */ }
    return 'desktop';
  }

  /* ── Analytics ────────────────────────────────────────────────────────── */

  /** Mixpanel may live on the page or, inside a Wix custom-element iframe, on the parent. */
  _mixpanel() {
    if (window.mixpanel && typeof window.mixpanel.track === 'function') return window.mixpanel;
    try {
      if (window.parent && window.parent !== window && window.parent.mixpanel &&
          typeof window.parent.mixpanel.track === 'function') return window.parent.mixpanel;
    } catch (e) { /* cross-origin parent, nothing to do */ }
    return null;
  }

  _onClick(e) {
    const path = e.composedPath().filter(n => n.nodeType === 1);
    const link = path.filter(n => n.tagName === 'A')[0];
    if (!link || !link.dataset.destination) return;
    const payload = { slug: this._slug, surface: this._surface, destination: link.dataset.destination };
    const mp = this._mixpanel();
    if (mp) {
      try { mp.track('cta_clicked', payload); } catch (err) { /* never block the click */ }
    }
    this.dispatchEvent(new CustomEvent('kygo-cta-click', { detail: payload, bubbles: true, composed: true }));
  }

  _attachEventListeners() {
    if (this._root) this._root.removeEventListener('click', this._onClick);
    this._root = this.shadowRoot.querySelector('.cta');
    if (this._root) this._root.addEventListener('click', this._onClick);
  }

  /* ── Render ───────────────────────────────────────────────────────────── */

  _seoText() {
    const hook = this._getSetting('hook', '');
    return (hook ? hook + ' ' : '') +
      'Start on the web at https://app.kygo.app/signup, or get Kygo on iPhone and Android. ' +
      'One account and one plan cover iOS, Android and web.';
  }

  render() {
    const platform = this._platform();
    const hook = this._getSetting('hook', '');
    const note = this._getSetting('note', 'Free plan available on web or in the app. No card to start. Cancel anytime.');
    const theme = String(this._getSetting('theme', 'light')).toLowerCase() === 'dark' ? 'dark' : 'light';
    const align = String(this._getSetting('align', 'center')).toLowerCase() === 'left' ? 'left' : 'center';
    // `compact` is a bare attribute, so its presence is the signal.
    const compact = this.hasAttribute('compact') || String(this._getSetting('compact', '')) === 'true';

    const apple = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 12.5c-.02-2.1 1.71-3.11 1.79-3.16-.98-1.43-2.5-1.62-3.03-1.64-1.29-.13-2.52.76-3.17.76-.65 0-1.66-.74-2.73-.72-1.4.02-2.7.82-3.42 2.07-1.46 2.54-.37 6.3 1.05 8.36.7 1.01 1.53 2.14 2.62 2.1 1.05-.04 1.45-.68 2.72-.68 1.27 0 1.63.68 2.74.66 1.13-.02 1.85-1.03 2.54-2.04.8-1.17 1.13-2.3 1.15-2.36-.03-.01-2.2-.84-2.22-3.35zM15.02 5.9c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.53.62-1 1.61-.88 2.56.93.07 1.88-.47 2.46-1.16z"/></svg>';
    const android = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 9v7a1 1 0 001 1h1v3a1 1 0 002 0v-3h4v3a1 1 0 002 0v-3h1a1 1 0 001-1V9H6zM4.5 9A1.5 1.5 0 003 10.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 004.5 9zm15 0a1.5 1.5 0 00-1.5 1.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 0019.5 9zM15.5 4.2l1-1.4a.3.3 0 00-.5-.35l-1.1 1.53a5.9 5.9 0 00-3.8 0L9.99 2.45a.3.3 0 00-.5.35l1 1.4A5.28 5.28 0 006 8.2h12a5.28 5.28 0 00-2.5-4zM9.5 6.4a.6.6 0 110-1.2.6.6 0 010 1.2zm5 0a.6.6 0 110-1.2.6.6 0 010 1.2z"/></svg>';
    const globe = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg>';

    const web = (cls, label) =>
      `<a class="${cls}" href="${this._webUrl('/signup')}" data-destination="web" target="_blank" rel="noopener">${globe}${label}</a>`;
    const ios = (cls, label) =>
      `<a class="${cls}" href="${this._iosUrl}" data-destination="ios" target="_blank" rel="noopener">${apple}${label}</a>`;
    const play = (cls, label) =>
      `<a class="${cls}" href="${this._androidUrl}" data-destination="android" target="_blank" rel="noopener">${android}${label}</a>`;

    // Every platform stays on screen; the visitor's own device just goes first
    // and takes the filled button. The other two sit beside it as outline
    // buttons on desktop, and as a two-up row under it on a phone.
    let primary, alts;
    if (platform === 'ios') {
      primary = ios('btn primary', 'Get the iPhone app');
      alts = play('btn secondary', 'Android') + web('btn secondary', 'Web');
    } else if (platform === 'android') {
      primary = play('btn primary', 'Get the Android app');
      alts = ios('btn secondary', 'iPhone') + web('btn secondary', 'Web');
    } else {
      primary = web('btn primary', 'Start on the web');
      alts = ios('btn secondary', 'iPhone') + play('btn secondary', 'Android');
    }

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :host{--green:#22C55E;--green-dark:#16A34A;--dark:#1E293B;--gray-600:#475569;--gray-400:#94A3B8;display:block;max-width:720px;margin:0 auto;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;line-height:1.6}
        .cta{display:flex;flex-direction:column;gap:14px;align-items:${align === 'left' ? 'flex-start' : 'center'};text-align:${align}}
        .hook{font-size:clamp(14px,1.7vw,16px);line-height:1.55;max-width:56ch;color:${theme === 'dark' ? 'rgba(255,255,255,.72)' : 'var(--gray-600)'}}
        .btns{display:flex;flex-wrap:wrap;align-items:center;gap:12px;justify-content:${align === 'left' ? 'flex-start' : 'center'};width:100%}
        .alts{display:flex;gap:12px}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:14px 24px;border-radius:12px;font-weight:600;font-size:15px;text-decoration:none;white-space:nowrap;transition:background .2s ease,transform .2s ease,box-shadow .2s ease,border-color .2s ease}
        .btn svg{width:18px;height:18px;flex:none}
        .btn.primary{background:var(--green);color:#fff;box-shadow:0 8px 20px rgba(34,197,94,.25)}
        .btn.primary:hover{background:var(--green-dark);transform:translateY(-1px)}
        .btn.secondary{background:${theme === 'dark' ? 'rgba(255,255,255,.08)' : '#fff'};color:${theme === 'dark' ? '#fff' : 'var(--dark)'};border:1px solid ${theme === 'dark' ? 'rgba(255,255,255,.22)' : '#E2E8F0'}}
        .btn.secondary:hover{border-color:var(--green);color:${theme === 'dark' ? '#fff' : 'var(--green-dark)'};transform:translateY(-1px)}
        .btn:focus-visible{outline:2px solid ${theme === 'dark' ? '#fff' : 'var(--green-dark)'};outline-offset:3px}
        .note{font-size:13px;line-height:1.5;color:${theme === 'dark' ? 'rgba(255,255,255,.72)' : 'var(--gray-400)'}}
        @media(max-width:560px){
          .btns{flex-direction:column;align-items:stretch;gap:10px}
          .btn.primary{width:100%}
          .alts{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        }
        ${compact ? `
        .cta{gap:10px}
        .btn{padding:10px 16px;font-size:14px}
        .btn svg{width:16px;height:16px}
        .note{font-size:12px}
        .hook{font-size:14px}
        @media(min-width:561px){.btns{flex-wrap:nowrap;gap:10px}.alts{gap:10px}}
        ` : ''}
      </style>
      <div class="cta">
        ${hook ? `<p class="hook">${hook}</p>` : ''}
        <div class="btns">
          ${primary}
          <div class="alts">${alts}</div>
        </div>
        ${note ? `<p class="note">${note}</p>` : ''}
      </div>`;
  }
}

if (!customElements.get('kygo-cta')) customElements.define('kygo-cta', KygoCta);
