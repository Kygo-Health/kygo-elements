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
 *
 * Destinations:
 *   Desktop  primary  -> app.kygo.app/signup with utm_source/medium/campaign,
 *                        store buttons secondary.
 *   iOS      primary  -> App Store with pt/ct attribution (ct capped at 30).
 *   Android  primary  -> Play Store with an encoded install referrer.
 *   Phones also get a plain "or use Kygo on the web" link to app.kygo.app.
 *
 * Layout: one primary button matched to the device, with the other platforms
 * folded behind an "or get the app" disclosure, so the primary path is the only
 * loud one and the alternatives are one click away rather than competing.
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

  static get observedAttributes() { return ['wixsettings', 'slug', 'surface', 'hook', 'theme', 'align', 'note']; }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._attachEventListeners();
    __ctaSeo(this, this._seoText());
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

  /** ios | android | desktop. Phones and tablets get their own store first. */
  _platform() {
    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) ||
      (/Macintosh/.test(ua) && typeof document !== 'undefined' && navigator.maxTouchPoints > 1);
    if (isIOS) return 'ios';
    if (/Android/i.test(ua)) return 'android';
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

    // The disclosure holding the other platforms.
    const toggle = path.filter(n => n.classList && n.classList.contains('toggle'))[0];
    if (toggle) {
      const panel = this.shadowRoot.getElementById(toggle.getAttribute('aria-controls'));
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      if (panel) panel.hidden = open;
      return;
    }

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

    const apple = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 12.5c-.02-2.1 1.71-3.11 1.79-3.16-.98-1.43-2.5-1.62-3.03-1.64-1.29-.13-2.52.76-3.17.76-.65 0-1.66-.74-2.73-.72-1.4.02-2.7.82-3.42 2.07-1.46 2.54-.37 6.3 1.05 8.36.7 1.01 1.53 2.14 2.62 2.1 1.05-.04 1.45-.68 2.72-.68 1.27 0 1.63.68 2.74.66 1.13-.02 1.85-1.03 2.54-2.04.8-1.17 1.13-2.3 1.15-2.36-.03-.01-2.2-.84-2.22-3.35zM15.02 5.9c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.53.62-1 1.61-.88 2.56.93.07 1.88-.47 2.46-1.16z"/></svg>';
    const android = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 9v7a1 1 0 001 1h1v3a1 1 0 002 0v-3h4v3a1 1 0 002 0v-3h1a1 1 0 001-1V9H6zM4.5 9A1.5 1.5 0 003 10.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 004.5 9zm15 0a1.5 1.5 0 00-1.5 1.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 0019.5 9zM15.5 4.2l1-1.4a.3.3 0 00-.5-.35l-1.1 1.53a5.9 5.9 0 00-3.8 0L9.99 2.45a.3.3 0 00-.5.35l1 1.4A5.28 5.28 0 006 8.2h12a5.28 5.28 0 00-2.5-4zM9.5 6.4a.6.6 0 110-1.2.6.6 0 010 1.2zm5 0a.6.6 0 110-1.2.6.6 0 010 1.2z"/></svg>';
    const globe = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg>';

    const web = (cls, label, icon) =>
      `<a class="${cls}" href="${this._webUrl('/signup')}" data-destination="web" target="_blank" rel="noopener">${icon}${label}</a>`;
    const ios = (cls) =>
      `<a class="${cls}" href="${this._iosUrl}" data-destination="ios" target="_blank" rel="noopener">${apple}${cls.indexOf('primary') > -1 ? 'Start on iPhone' : 'iPhone'}</a>`;
    const play = (cls) =>
      `<a class="${cls}" href="${this._androidUrl}" data-destination="android" target="_blank" rel="noopener">${android}${cls.indexOf('primary') > -1 ? 'Start on Android' : 'Android'}</a>`;

    // One primary button matched to the visitor's device, with the other
    // platforms folded behind a disclosure so the primary path stays the loud
    // one. Desktop gets web first and "or get the app" over the two stores;
    // a phone gets its own store first, the web link in plain sight (the spec's
    // requirement), and the other platform's store behind the same toggle.
    let primary, toggleLabel, more, webLink = '';
    if (platform === 'ios') {
      primary = ios('btn primary');
      toggleLabel = 'also on Android';
      more = play('btn secondary');
      webLink = `<a class="weblink" href="${this._webUrl('/signup')}" data-destination="web" target="_blank" rel="noopener">or use Kygo on the web</a>`;
    } else if (platform === 'android') {
      primary = play('btn primary');
      toggleLabel = 'also on iPhone';
      more = ios('btn secondary');
      webLink = `<a class="weblink" href="${this._webUrl('/signup')}" data-destination="web" target="_blank" rel="noopener">or use Kygo on the web</a>`;
    } else {
      primary = web('btn primary', 'Start on the web', globe);
      toggleLabel = 'or get the app';
      more = ios('btn secondary') + play('btn secondary');
    }
    const panelId = 'kygo-cta-more-' + this._slug;

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :host{--green:#22C55E;--green-dark:#16A34A;--dark:#1E293B;--gray-600:#475569;--gray-400:#94A3B8;display:block;max-width:720px;margin:0 auto;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;line-height:1.6}
        .cta{display:flex;flex-direction:column;gap:14px;align-items:${align === 'left' ? 'flex-start' : 'center'};text-align:${align}}
        .hook{font-size:clamp(14px,1.7vw,16px);line-height:1.55;max-width:56ch;color:${theme === 'dark' ? 'rgba(255,255,255,.72)' : 'var(--gray-600)'}}
        .btns{display:flex;flex-wrap:wrap;gap:12px;justify-content:${align === 'left' ? 'flex-start' : 'center'};width:100%}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:14px 24px;border-radius:12px;font-weight:600;font-size:15px;text-decoration:none;white-space:nowrap;transition:background .2s ease,transform .2s ease,box-shadow .2s ease,border-color .2s ease}
        .btn svg{width:18px;height:18px;flex:none}
        .btn.primary{background:var(--green);color:#fff;box-shadow:0 8px 20px rgba(34,197,94,.25)}
        .btn.primary:hover{background:var(--green-dark);transform:translateY(-1px)}
        .btn.secondary{background:${theme === 'dark' ? 'rgba(255,255,255,.08)' : '#fff'};color:${theme === 'dark' ? '#fff' : 'var(--dark)'};border:1px solid ${theme === 'dark' ? 'rgba(255,255,255,.22)' : '#E2E8F0'}}
        .btn.secondary:hover{border-color:var(--green);color:${theme === 'dark' ? '#fff' : 'var(--green-dark)'};transform:translateY(-1px)}
        .btn:focus-visible{outline:2px solid ${theme === 'dark' ? '#fff' : 'var(--green-dark)'};outline-offset:3px}
        .toggle{display:inline-flex;align-items:center;gap:6px;background:none;border:0;padding:0;cursor:pointer;font-family:inherit;font-size:14px;font-weight:600;color:${theme === 'dark' ? '#6EE7A0' : 'var(--green-dark)'};text-decoration:underline;text-underline-offset:3px}
        .toggle svg{width:14px;height:14px;transition:transform .2s ease}
        .toggle[aria-expanded="true"] svg{transform:rotate(180deg)}
        .toggle:focus-visible{outline:2px solid ${theme === 'dark' ? '#fff' : 'var(--green-dark)'};outline-offset:3px;border-radius:4px}
        .more{display:flex;flex-wrap:wrap;gap:12px;justify-content:${align === 'left' ? 'flex-start' : 'center'};width:100%}
        .more[hidden]{display:none}
        .weblink{font-size:14px;font-weight:600;text-decoration:underline;text-underline-offset:3px;color:${theme === 'dark' ? '#6EE7A0' : 'var(--green-dark)'}}
        .note{font-size:13px;line-height:1.5;color:${theme === 'dark' ? 'rgba(255,255,255,.72)' : 'var(--gray-400)'}}
        @media(max-width:560px){.btn{width:100%}}
      </style>
      <div class="cta">
        ${hook ? `<p class="hook">${hook}</p>` : ''}
        <div class="btns">${primary}</div>
        <button class="toggle" type="button" aria-expanded="false" aria-controls="${panelId}">${toggleLabel}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
        <div class="more" id="${panelId}" hidden>${more}</div>
        ${webLink}
        ${note ? `<p class="note">${note}</p>` : ''}
      </div>`;
  }
}

if (!customElements.get('kygo-cta')) customElements.define('kygo-cta', KygoCta);
