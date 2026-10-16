/**
 * Kygo Health - __HUMAN_NAME__ Custom Element for Wix
 * Tag name: __TAG__
 *
 * Plain, directly-servable script (no build step). Served raw via GitHub Pages / jsDelivr
 * and embedded as a Wix Custom Element. See repo CLAUDE.md for conventions.
 */

/** Injects accessible text into light DOM so crawlers and AI tools can read component content */
function __seo(el, text) {
  if (el.querySelector('[data-seo]')) return;
  const d = document.createElement('div');
  d.setAttribute('data-seo', '');
  d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
  d.textContent = text;
  el.appendChild(d);
}

class __CLASS__ extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._attachEventListeners();
    this._setupScrollAnimations();
    // TODO: replace with an accurate, keyword-rich plain-text summary of this page.
    __seo(this, '__SEO_SUMMARY__');
    this._injectStructuredData();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  static get observedAttributes() {
    // Add any Wix-settable props here so attributeChangedCallback re-renders.
    return ['wixsettings'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'wixsettings') {
      this._parseWixAttributes();
      this.render();
      this._attachEventListeners();
    }
  }

  _parseWixAttributes() {
    try {
      const wixconfig = this.getAttribute('wixconfig');
      const wixsettings = this.getAttribute('wixsettings');
      if (wixconfig) this._config = JSON.parse(wixconfig);
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {
      console.warn('__CLASS__: Could not parse Wix attributes', e);
    }
  }

  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }

  render() {
    const headline = this._getSetting('headline', '__HUMAN_NAME__');
    const subheadline = this._getSetting('subheadline', '');

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        :host {
          --dark: #1E293B;
          --light: #F8FAFC;
          --green: #22C55E;
          --green-dark: #16A34A;
          --green-light: rgba(34, 197, 94, 0.1);
          --gray-50: #f9fafb;
          --gray-200: #E2E8F0;
          --gray-400: #94A3B8;
          --gray-600: #475569;
          --red: #EF4444;
          display: block;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--light);
          color: var(--dark);
          line-height: 1.6;
        }
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        h1, h2, h3, h4 { font-family: 'Space Grotesk', -apple-system, sans-serif; font-weight: 600; line-height: 1.2; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        .hero { padding: 60px 0 40px; background: linear-gradient(180deg, var(--gray-50) 0%, var(--light) 100%); text-align: center; }
        .hero h1 { font-size: clamp(32px, 8vw, 48px); margin-bottom: 16px; }
        .hero-subtitle { font-size: clamp(16px, 4vw, 18px); color: var(--gray-600); max-width: 560px; margin: 0 auto; }
        @media (min-width: 768px) { .hero { padding: 80px 0 60px; } }

        .animate-on-scroll { opacity: 0; transform: translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .animate-on-scroll.visible { opacity: 1; transform: none; }
      </style>

      <section class="hero">
        <div class="container">
          <h1>${headline}</h1>
          ${subheadline ? `<p class="hero-subtitle">${subheadline}</p>` : ''}
        </div>
      </section>

      <!-- TODO: build the rest of the page here -->
    `;
  }

  _attachEventListeners() {
    // Wire up handlers by querying this.shadowRoot.
    // For Wix Velo events: this.dispatchEvent(new CustomEvent('__TAG__Event', {
    //   detail: { /* plain data only — no functions */ }, bubbles: true, composed: true }));
  }

  _setupScrollAnimations() {
    requestAnimationFrame(() => {
      const elements = this.shadowRoot.querySelectorAll('.animate-on-scroll');
      if (!elements.length) return;
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this._observer.unobserve(entry.target);
          }
        });
      }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
      elements.forEach(el => this._observer.observe(el));
    });
  }

  _injectStructuredData() {
    if (document.querySelector('script[data-kygo-__SLUG__-ld]')) return;
    const ld = {
      '@context': 'https://schema.org',
      '@type': '__SCHEMA_TYPE__',
      'name': '__HUMAN_NAME__',
      'url': 'https://www.kygo.app/__SLUG__'
      // TODO: add type-specific fields (e.g. mainEntity for FAQPage, step for HowTo).
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-kygo-__SLUG__-ld', '');
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }
}

customElements.define('__TAG__', __CLASS__);
