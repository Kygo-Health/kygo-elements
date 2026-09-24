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
 *   slug    (required) campaign id, used verbatim as utm_campaign on the web
 *           link and as the GA4 / Mixpanel label. Must be unique per placement.
 *   surface home | blog | tool | faq. Used as utm_medium.
 *   hook    topic-matched line on the reader's payoff, shown above the buttons.
 *   theme   dark (on the navy conversion card) | green (on a Kygo-green
 *           card, where the filled button goes white) | light (default, on white).
 *   align   center (default) | left.
 *   note    reassurance line under the buttons. Pass note="" to hide it.
 *   ios-link / android-link
 *           override the Tenjin click URL for a placement with its own campaign
 *           link. Defaults are the site-wide Website-channel links.
 *   compact thin-bar variant for narrow strips (the FAQ mid-page band, the
 *           homepage inline band): smaller buttons and tighter spacing.
 *   mini    header/sub-nav variant: one nowrap row of small pills, no hook and
 *           no note, labels dropping away as the header narrows. Use it only in
 *           a page header, where the element spans the page width.
 *   single  renders the visitor's own destination alone, for a card whose whole
 *           point is one action (a pricing plan). Never the page's main CTA —
 *           those keep all three platforms on screen. Takes `label` for the
 *           button wording, `block` to fill the card width and
 *           variant="outline" for the quieter of two plan buttons.
 *
 * Destinations:
 *   Web      -> app.kygo.app/register with utm_source/medium/campaign.
 *   iOS      -> the Tenjin iOS click URL, which redirects to the App Store.
 *   Android  -> the Tenjin Android click URL, which redirects to Play.
 * Tenjin is the system of record for install attribution, so the store buttons
 * always go through it. Per-campaign overrides: ios-link / android-link.
 *
 * Layout: all three platforms are always on screen. The visitor's own device
 * takes the filled primary button and leads; the other two follow as outline
 * buttons, on one row where there is room and as a two-up row under the
 * primary where there is not. That choice is made from this element's own
 * measured width, not the viewport, so the same CTA fits a full-width hero
 * and a thin band beside a headline without overflowing either.
 *
 * Analytics: fires Mixpanel `cta_clicked` with {slug, surface, destination} on
 * every button click, and mirrors the same payload as a bubbling `kygo-cta-click`
 * CustomEvent so Wix Velo and GA4 can listen without a second wiring pass.
 */

/** Tenjin attribution click URLs (Website channel). They redirect to the App
 *  Store / Play Store, and every store CTA on the site goes through them so
 *  Tenjin sees the click and attributes the install. */
const TENJIN_IOS = 'https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy';
const TENJIN_ANDROID = 'https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO';

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

  static get observedAttributes() { return ['wixsettings', 'slug', 'surface', 'hook', 'theme', 'align', 'note', 'compact', 'mini', 'single', 'block', 'variant', 'label', 'ios-link', 'android-link']; }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._attachEventListeners();
    this._observeSize();
    // The header pill row repeats what the page's main CTA already spells out
    // for crawlers, so mini does not add a second copy of it.
    if (!this.hasAttribute('mini')) {
      try { __ctaSeo(this, this._seoText()); } catch (e) { /* SEO text is not worth failing over */ }
    }
  }

  disconnectedCallback() {
    if (this._root) this._root.removeEventListener('click', this._onClick);
    if (this._ro) { this._ro.disconnect(); this._ro = null; }
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

  _webUrl(path) {
    const p = path || '/register';
    return 'https://app.kygo.app' + p +
      '?utm_source=kygo.app&utm_medium=' + encodeURIComponent(this._surface) +
      '&utm_campaign=' + encodeURIComponent(this._slug);
  }

  /** Both store buttons go through Tenjin (Website channel), which redirects to
   *  the store and attributes the install. Tenjin is the system of record for
   *  installs across the whole site, so these are the only store URLs any
   *  component should ever point at — direct App Store / Play URLs belong in
   *  JSON-LD and nowhere else. Overridable per placement via the ios-link /
   *  android-link attributes, for a campaign with its own Tenjin link. */
  get _iosUrl() { return this._getSetting('ios-link', TENJIN_IOS); }

  get _androidUrl() { return this._getSetting('android-link', TENJIN_ANDROID); }

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
      'Start on the web at https://app.kygo.app/register, or get Kygo on iPhone and Android. ' +
      'One account and one plan cover iOS, Android and web.';
  }

  render() {
    const platform = this._platform();
    const hook = this._getSetting('hook', '');
    const note = this._getSetting('note', 'Free plan available on web or in the app. No card to start. Cancel anytime.');
    // light = on white, dark = on the navy card, green = on a Kygo-green card
    // (there the filled button has to go white, or it disappears into the card).
    const themeName = String(this._getSetting('theme', 'light')).toLowerCase();
    const theme = ['dark', 'green'].indexOf(themeName) > -1 ? themeName : 'light';
    const palette = {
      light: { hook: 'var(--gray-600)', note: 'var(--gray-400)', outline: 'var(--green-dark)',
               pBg: 'var(--green)', pFg: '#fff', pShadow: '0 8px 20px rgba(34,197,94,.25)', pHover: 'var(--green-dark)',
               sBg: '#fff', sFg: 'var(--dark)', sBorder: '#E2E8F0', sHoverFg: 'var(--green-dark)', sHoverBorder: 'var(--green)' },
      dark:  { hook: 'rgba(255,255,255,.72)', note: 'rgba(255,255,255,.72)', outline: '#fff',
               pBg: 'var(--green)', pFg: '#fff', pShadow: '0 8px 20px rgba(34,197,94,.25)', pHover: 'var(--green-dark)',
               sBg: 'rgba(255,255,255,.08)', sFg: '#fff', sBorder: 'rgba(255,255,255,.22)', sHoverFg: '#fff', sHoverBorder: 'var(--green)' },
      green: { hook: 'rgba(255,255,255,.9)', note: 'rgba(255,255,255,.9)', outline: '#fff',
               pBg: '#fff', pFg: 'var(--green-dark)', pShadow: '0 8px 20px rgba(15,23,42,.14)', pHover: '#F0FDF4',
               sBg: 'rgba(255,255,255,.12)', sFg: '#fff', sBorder: 'rgba(255,255,255,.55)', sHoverFg: '#fff', sHoverBorder: '#fff' }
    }[theme];
    const align = String(this._getSetting('align', 'center')).toLowerCase() === 'left' ? 'left' : 'center';
    // `compact` and `mini` are bare attributes, so their presence is the signal.
    const compact = this.hasAttribute('compact') || String(this._getSetting('compact', '')) === 'true';
    const mini = this.hasAttribute('mini') || String(this._getSetting('mini', '')) === 'true';
    const single = this.hasAttribute('single') || String(this._getSetting('single', '')) === 'true';
    const block = this.hasAttribute('block') || String(this._getSetting('block', '')) === 'true';
    const outline = String(this._getSetting('variant', '')).toLowerCase() === 'outline';
    const label = this._getSetting('label', '');

    const apple = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 12.5c-.02-2.1 1.71-3.11 1.79-3.16-.98-1.43-2.5-1.62-3.03-1.64-1.29-.13-2.52.76-3.17.76-.65 0-1.66-.74-2.73-.72-1.4.02-2.7.82-3.42 2.07-1.46 2.54-.37 6.3 1.05 8.36.7 1.01 1.53 2.14 2.62 2.1 1.05-.04 1.45-.68 2.72-.68 1.27 0 1.63.68 2.74.66 1.13-.02 1.85-1.03 2.54-2.04.8-1.17 1.13-2.3 1.15-2.36-.03-.01-2.2-.84-2.22-3.35zM15.02 5.9c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.53.62-1 1.61-.88 2.56.93.07 1.88-.47 2.46-1.16z"/></svg>';
    const android = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 9v7a1 1 0 001 1h1v3a1 1 0 002 0v-3h4v3a1 1 0 002 0v-3h1a1 1 0 001-1V9H6zM4.5 9A1.5 1.5 0 003 10.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 004.5 9zm15 0a1.5 1.5 0 00-1.5 1.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 0019.5 9zM15.5 4.2l1-1.4a.3.3 0 00-.5-.35l-1.1 1.53a5.9 5.9 0 00-3.8 0L9.99 2.45a.3.3 0 00-.5.35l1 1.4A5.28 5.28 0 006 8.2h12a5.28 5.28 0 00-2.5-4zM9.5 6.4a.6.6 0 110-1.2.6.6 0 010 1.2zm5 0a.6.6 0 110-1.2.6.6 0 010 1.2z"/></svg>';
    const globe = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg>';

    // aria-label carries the full wording even where the visible label is
    // dropped for width, so an icon-only pill still announces itself.
    const web = (cls, label) =>
      `<a class="${cls}" href="${this._webUrl('/register')}" data-destination="web" target="_blank" rel="noopener" aria-label="Start Kygo on the web">${globe}<span class="lbl">${label}</span></a>`;
    const ios = (cls, label) =>
      `<a class="${cls}" href="${this._iosUrl}" data-destination="ios" target="_blank" rel="noopener" aria-label="Get Kygo on the App Store">${apple}<span class="lbl">${label}</span></a>`;
    const play = (cls, label) =>
      `<a class="${cls}" href="${this._androidUrl}" data-destination="android" target="_blank" rel="noopener" aria-label="Get Kygo on Google Play">${android}<span class="lbl">${label}</span></a>`;

    // Every platform stays on screen; the visitor's own device just goes first
    // and takes the filled button. The other two sit beside it as outline
    // buttons on desktop, and as a two-up row under it on a phone.
    // A header has room for a verb and not much else, so mini shortens the
    // primary label rather than dropping a platform.
    let primary, alts;
    const primaryCls = 'btn ' + (outline ? 'secondary' : 'primary');
    if (platform === 'ios') {
      primary = ios(primaryCls, label || (mini ? 'Get the app' : 'Get the iPhone app'));
      alts = play('btn secondary', 'Android') + web('btn secondary', 'Web');
    } else if (platform === 'android') {
      primary = play(primaryCls, label || (mini ? 'Get the app' : 'Get the Android app'));
      alts = ios('btn secondary', 'iPhone') + web('btn secondary', 'Web');
    } else {
      primary = web(primaryCls, label || (mini ? 'Start free' : 'Start on the web'));
      alts = ios('btn secondary', 'iPhone') + play('btn secondary', 'Android');
    }

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :host{--green:#22C55E;--green-dark:#16A34A;--dark:#1E293B;--gray-600:#475569;--gray-400:#94A3B8;display:block;min-width:0;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;line-height:1.6}
        .cta{display:flex;flex-direction:column;gap:14px;align-items:${align === 'left' ? 'flex-start' : 'center'};text-align:${align};width:100%;max-width:720px;margin:0 auto}
        .hook{font-size:clamp(14px,1.7vw,16px);line-height:1.55;max-width:56ch;color:${palette.hook}}
        .btns{display:flex;flex-wrap:wrap;align-items:center;gap:12px;justify-content:${align === 'left' ? 'flex-start' : 'center'};width:100%;max-width:100%;min-width:0}
        .alts{display:flex;flex-wrap:wrap;gap:12px;max-width:100%;min-width:0}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:14px 24px;border-radius:12px;font-weight:600;font-size:15px;text-decoration:none;white-space:nowrap;min-width:0;max-width:100%;transition:background .2s ease,transform .2s ease,box-shadow .2s ease,border-color .2s ease}
        .btn svg{width:18px;height:18px;flex:none}
        .btn.primary{background:${palette.pBg};color:${palette.pFg};box-shadow:${palette.pShadow}}
        .btn.primary:hover{background:${palette.pHover};color:${palette.pFg};transform:translateY(-1px)}
        .btn.secondary{background:${palette.sBg};color:${palette.sFg};border:1px solid ${palette.sBorder}}
        .btn.secondary:hover{border-color:${palette.sHoverBorder};color:${palette.sHoverFg};transform:translateY(-1px)}
        .btn:focus-visible{outline:2px solid ${palette.outline};outline-offset:3px}
        .note{font-size:13px;line-height:1.5;color:${palette.note}}
        /* Layout is driven by the element's own width, not the viewport: the
           same CTA sits in a full-width hero and in a thin band beside a
           headline, and only its own box tells it which. The stack and tight classes
           are set by _applyLayout() from a measurement of the button row. */
        .cta.stack .btns{flex-direction:column;align-items:stretch;gap:10px}
        .cta.stack .btn.primary{width:100%}
        .cta.stack .alts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;width:100%}
        .cta.stack .alts .btn{width:100%}
        .cta.tight .alts{grid-template-columns:minmax(0,1fr)}
        /* Measurement pass: lay the buttons out on one unconstrained row so
           _applyLayout() can read their natural width. */
        .cta.measuring .btns{flex-direction:row!important;flex-wrap:nowrap!important;width:max-content!important;max-width:none!important}
        .cta.measuring .alts{display:flex!important;flex-wrap:nowrap!important;width:auto!important}
        .cta.measuring .btn{width:auto!important}
        ${compact ? `
        .cta{gap:10px}
        .btn{padding:10px 16px;font-size:14px}
        .btn svg{width:16px;height:16px}
        .note{font-size:12px}
        .hook{font-size:14px}
        .btns{gap:10px}
        .alts{gap:10px}
        ` : ''}
        ${single ? `
        .cta{max-width:none;margin:0}
        ${block ? '.btn{width:100%}' : ''}
        ` : ''}
        ${mini ? `
        /* Header pills. A page header spans the page, so here the viewport is
           the right thing to measure: the labels drop away as the header runs
           out of room, the row never wraps and never stacks. */
        .cta{gap:0;width:auto;max-width:none;margin:0}
        .btns{flex-wrap:nowrap;gap:8px;width:auto}
        .alts{flex-wrap:nowrap;gap:8px}
        .btn{padding:8px 12px;border-radius:8px;font-size:13px;gap:6px;line-height:1}
        .btn svg{width:15px;height:15px}
        .btn.primary{box-shadow:none}
        .btn.primary:hover,.btn.secondary:hover{transform:none}
        @media(max-width:520px){.btn.secondary .lbl{display:none}.btn.secondary{padding:8px 10px}}
        @media(max-width:360px){.btn .lbl{display:none}.btn{padding:8px 10px}}
        ` : ''}
      </style>
      <div class="cta">
        ${hook && !mini ? `<p class="hook">${hook}</p>` : ''}
        <div class="btns">
          ${primary}
          ${single ? '' : `<div class="alts">${alts}</div>`}
        </div>
        ${note && !mini ? `<p class="note">${note}</p>` : ''}
      </div>`;

    this._rowWidth = 0;
    this._altsWidth = 0;
    this._applyLayout();
  }

  /* ── Responsive layout ────────────────────────────────────────────────── */

  /** Natural widths of the one-row button cluster and of the two outline
   *  buttons on their own, measured once per render from a throwaway layout
   *  pass. Measuring beats a hardcoded breakpoint because the primary label
   *  changes with the visitor's platform. */
  _measure(root) {
    const btns = root.querySelector('.btns');
    const alts = root.querySelector('.alts');
    if (!btns) return;
    root.classList.add('measuring');
    this._rowWidth = Math.ceil(btns.scrollWidth);
    this._altsWidth = alts ? Math.ceil(alts.scrollWidth) : 0;
    root.classList.remove('measuring');
  }

  /** Stack the primary above a two-up row of the other platforms as soon as
   *  one row no longer fits the space this element was actually given, and
   *  drop to a single column when even two buttons side by side do not fit. */
  _applyLayout() {
    const root = this.shadowRoot && this.shadowRoot.querySelector('.cta');
    if (!root) return;
    if (this.hasAttribute('mini') || this.hasAttribute('single')) { root.classList.remove('stack', 'tight'); return; }
    const width = root.getBoundingClientRect().width;
    if (!width) return; // not laid out yet; the ResizeObserver will call back
    if (!this._rowWidth) this._measure(root);
    root.classList.toggle('stack', width < this._rowWidth);
    root.classList.toggle('tight', width < this._altsWidth);
  }

  _observeSize() {
    if (this._ro || typeof ResizeObserver === 'undefined') return;
    this._ro = new ResizeObserver(() => this._applyLayout());
    this._ro.observe(this);
  }
}

if (!customElements.get('kygo-cta')) customElements.define('kygo-cta', KygoCta);
