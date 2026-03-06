/**
 * Kygo Health - Tools Page Custom Element
 * Tag: kygo-tools-page
 * Displays all Kygo free tools in a branded grid layout
 * Tools are configurable via the 'tools' attribute (JSON array)
 */

/** Injects accessible text into light DOM so crawlers and AI tools can read component content */
if (typeof __seo === 'undefined') {
  var __seo = function(el, text) {
    if (el.querySelector('[data-seo]')) return;
    const d = document.createElement('div');
    d.setAttribute('data-seo', '');
    d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
    d.textContent = text;
    el.appendChild(d);
  };
}

class KygoToolsPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._tools = [];
  }

  connectedCallback() {
    this._parseTools();
    this.render();
    this._setupAnimations();
    this._setupModalEvents();
    __seo(this, 'Kygo Health Free Tools \u2014 Free tools to understand your nutrition and health. Food Scanner: snap a photo of any meal for instant calories, macros, and health score. Wearable Accuracy: compare real accuracy data for Oura, Apple Watch, Garmin, WHOOP, Fitbit & Samsung across 9 health metrics backed by peer-reviewed research. Hardware vs Software: see exactly what sensors, health metrics, and algorithms make each wearable different across 16 sensor types and 25 proprietary algorithms. HRV Factor Explorer: explore 44 research-backed factors that affect Heart Rate Variability ranked by evidence strength. Step Count Accuracy: compare step counter accuracy across 8+ wearables using 20+ peer-reviewed studies. Sleep Metrics: interactive comparison of sleep-tracking metrics across Oura, Fitbit, Apple Watch, and Garmin. No signup required.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  static get observedAttributes() { return ['tools']; }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'tools' && oldValue !== newValue) {
      this._parseTools();
      this.render();
      this._setupAnimations();
      this._setupModalEvents();
    }
  }

  _setupModalEvents() {
    const _ab = this.shadowRoot.querySelector('.cta-android');
    const _am = this.shadowRoot.querySelector('.android-modal');
    const _mc = this.shadowRoot.querySelector('.modal-close');
    const _af = this.shadowRoot.querySelector('.android-form');
    if (_ab) _ab.addEventListener('click', e => { e.preventDefault(); _am.classList.add('active'); });
    if (_mc) _mc.addEventListener('click', () => _am.classList.remove('active'));
    if (_am) _am.addEventListener('click', e => { if (e.target === _am) _am.classList.remove('active'); });
    if (_af) _af.addEventListener('submit', e => { e.preventDefault(); const email = _af.querySelector('input').value; if (email) { this.dispatchEvent(new CustomEvent('android-signup', { detail: { email }, bubbles: true, composed: true })); _af.innerHTML = '<p class="success-msg">You\'re on the list!</p>'; setTimeout(() => _am.classList.remove('active'), 2000); } });
  }

  _parseTools() {
    try {
      const attr = this.getAttribute('tools');
      if (attr) {
        this._tools = JSON.parse(attr);
        return;
      }
    } catch (e) {}

    // Default tools if none provided
    this._tools = [
      {
        slug: 'calories-in-anything',
        title: 'Food Scanner',
        description: 'Snap a photo of any meal and get instant calories, macros, health score, and nutrition insights powered by AI.',
        icon: 'camera',
        badge: 'Most Popular',
        url: '/calories-in-anything',
        features: ['Instant calorie count', 'Macro & vitamin breakdown', 'Health score 1\u201310']
      },
      {
        slug: 'wearable-accuracy',
        title: 'Wearable Accuracy',
        description: 'Compare real accuracy data for Oura, Apple Watch, Garmin, WHOOP, Fitbit & Samsung across 9 health metrics backed by peer-reviewed research.',
        icon: 'activity',
        url: '/wearable-accuracy',
        features: ['17+ peer-reviewed studies', 'Head-to-head comparison', 'Full bias disclosure']
      },
      {
        slug: 'sensor-comparison',
        title: 'Hardware vs Software',
        description: 'See exactly what sensors, health metrics, and algorithms make each wearable different — Garmin, Whoop, Oura, Apple Watch, and Fitbit compared.',
        icon: 'cpu',
        badge: 'New',
        url: '/sensor-comparison',
        features: ['16 sensor types compared', '25 proprietary algorithms', 'FDA feature breakdown']
      },
      {
        slug: 'hrv-factors',
        title: 'HRV Factor Explorer',
        description: 'Explore 44 research-backed factors that affect Heart Rate Variability — supplements, lifestyle, exercise, and nutrients ranked by evidence.',
        icon: 'heart',
        url: '/hrv-factors',
        features: ['44 factors across 5 categories', 'Evidence-ranked', 'Peer-reviewed sources']
      },
      {
        slug: 'step-count-accuracy',
        title: 'Step Count Accuracy',
        description: 'Compare step counter accuracy across 8+ wearables using 20+ peer-reviewed studies with real-world and lab-tested data.',
        icon: 'activity',
        url: '/step-count-accuracy',
        features: ['8+ devices compared', '20+ studies', 'Real-world vs lab accuracy']
      },
      {
        slug: 'sleep-metrics',
        title: 'Sleep Metrics',
        description: 'Interactive comparison of sleep-tracking metrics across Oura, Fitbit, Apple Watch, and Garmin backed by research.',
        icon: 'brain',
        url: '/sleep-metrics',
        features: ['Sleep stage accuracy', 'Device comparison', 'Research-backed']
      }
    ];
  }

  _getIcon(name) {
    const icons = {
      camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
      calculator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
      salad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1"/><path d="m13 12 4-4"/><path d="M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2"/></svg>',
      utensils: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
      scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',
      sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
      zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>',
      cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>'
    };
    return icons[name] || icons.sparkles;
  }

  _setupAnimations() {
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

      // Stagger tool cards
      const cards = this.shadowRoot.querySelectorAll('.tool-card');
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const index = Array.from(card.parentElement.children).indexOf(card);
            setTimeout(() => card.classList.add('visible'), index * 100);
            cardObserver.unobserve(card);
          }
        });
      }, { threshold: 0.1 });
      cards.forEach(card => cardObserver.observe(card));
    });
  }

  render() {
    const tools = this._tools;
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const appStoreUrl = 'https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --dark: #1E293B;
          --light: #F8FAFC;
          --green: #22C55E;
          --green-dark: #16A34A;
          --green-light: rgba(34, 197, 94, 0.1);
          --green-glow: rgba(34, 197, 94, 0.3);
          --gray-50: #f9fafb;
          --gray-100: #F1F5F9;
          --gray-200: #E2E8F0;
          --gray-400: #94A3B8;
          --gray-600: #475569;
          --gray-700: #334155;
          display: block;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--light);
          color: var(--dark);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        h1, h2, h3 {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          line-height: 1.2;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        /* ===== HERO ===== */
        .hero {
          padding: 48px 0 40px;
          text-align: center;
          background: white;
          border-bottom: 1px solid var(--gray-200);
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--green-light);
          color: var(--green-dark);
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .hero-badge svg { width: 14px; height: 14px; }
        .hero h1 {
          font-size: 32px;
          color: var(--dark);
          margin-bottom: 14px;
          letter-spacing: -0.5px;
        }
        .hero h1 span { color: var(--green); }
        .hero p {
          font-size: 16px;
          color: var(--gray-600);
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* ===== TOOLS GRID ===== */
        .tools-section { padding: 48px 0; }
        .tools-section-header {
          text-align: center;
          margin-bottom: 12px;
        }
        .tools-count {
          font-size: 13px;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 600;
          margin-bottom: 32px;
          text-align: center;
        }
        .tools-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        /* ===== TOOL CARD ===== */
        .tool-card {
          background: white;
          border-radius: 20px;
          border: 2px solid var(--gray-200);
          padding: 28px 24px;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        .tool-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .tool-card:hover {
          border-color: var(--green);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          transform: translateY(-4px);
        }
        .tool-card.visible:hover {
          transform: translateY(-4px);
        }

        .tool-card-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: var(--green);
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .tool-card-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }
        .tool-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, var(--green), var(--green-dark));
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25);
        }
        .tool-icon svg { width: 26px; height: 26px; color: white; }

        .tool-card-header-text { flex: 1; padding-right: 60px; }
        .tool-card-title {
          font-size: 20px;
          color: var(--dark);
          margin-bottom: 4px;
        }
        .tool-card-description {
          font-size: 14px;
          color: var(--gray-600);
          line-height: 1.6;
        }

        .tool-card-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .tool-feature {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          color: var(--gray-600);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        .tool-feature svg {
          width: 12px;
          height: 12px;
          color: var(--green);
          flex-shrink: 0;
        }

        .tool-card-action {
          margin-top: auto;
        }
        .tool-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--green);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
          font-family: inherit;
          -webkit-tap-highlight-color: transparent;
        }
        .tool-btn:hover {
          background: var(--green-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px var(--green-glow);
        }
        .tool-btn:active {
          transform: translateY(0);
        }
        .tool-btn svg {
          width: 16px;
          height: 16px;
          transition: transform 0.2s;
        }
        .tool-btn:hover svg {
          transform: translateX(3px);
        }

        /* ===== COMING SOON CARD ===== */
        .coming-soon-card {
          background: var(--gray-50);
          border: 2px dashed var(--gray-200);
          border-radius: 20px;
          padding: 40px 24px;
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
        }
        .coming-soon-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .coming-soon-icon {
          width: 56px;
          height: 56px;
          background: var(--gray-100);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: var(--gray-400);
        }
        .coming-soon-icon svg { width: 28px; height: 28px; }
        .coming-soon-title {
          font-size: 18px;
          color: var(--dark);
          margin-bottom: 6px;
        }
        .coming-soon-text {
          font-size: 14px;
          color: var(--gray-400);
          max-width: 300px;
          margin: 0 auto;
        }

        /* ===== CTA SECTION ===== */
        .cta-section {
          background: linear-gradient(135deg, var(--green), var(--green-dark));
          border-radius: 24px;
          padding: 48px 24px;
          text-align: center;
          margin: 48px 0;
          position: relative;
          overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        .cta-content { position: relative; z-index: 1; }
        .cta-section h2 {
          font-size: 28px;
          color: white;
          margin-bottom: 12px;
        }
        .cta-section p {
          color: rgba(255,255,255,0.85);
          margin-bottom: 28px;
          font-size: 15px;
          line-height: 1.6;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        .cta-btn-white {
          background: white;
          color: var(--green-dark);
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .cta-btn-white:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .cta-btn-white:active, .cta-btn-white:focus {
          background: white;
          color: var(--green-dark);
          outline: none;
          transform: translateY(0);
        }
        .cta-btn-white svg { width: 18px; height: 18px; }
        .cta-features {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
          font-size: 13px;
          color: rgba(255,255,255,0.8);
        }
        .cta-feature {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .cta-check { color: white; display: flex; }
        .cta-check svg { width: 16px; height: 16px; }
        .cta-android{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.9);border:1.5px solid rgba(255,255,255,0.35);padding:12px 24px;border-radius:10px;font-weight:500;font-size:14px;font-family:inherit;cursor:pointer;transition:all 0.2s;-webkit-tap-highlight-color:transparent;width:100%;max-width:260px;margin-top:12px}
        .cta-android:hover{background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.6)}
        .cta-android svg{width:16px;height:16px;flex-shrink:0}
        .android-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;visibility:hidden;transition:all 0.3s}
        .android-modal.active{opacity:1;visibility:visible}
        .modal-content{background:white;border-radius:20px;padding:32px;max-width:380px;width:90%;text-align:center;position:relative;transform:scale(0.9);transition:transform 0.3s}
        .android-modal.active .modal-content{transform:scale(1)}
        .modal-close{position:absolute;top:12px;right:12px;background:none;border:none;font-size:24px;cursor:pointer;color:#94a3b8;line-height:1}
        .modal-close:hover{color:#1e293b}
        .modal-icon{width:48px;height:48px;background:linear-gradient(135deg,#3DDC84,#00A36C);border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
        .modal-icon svg{width:28px;height:28px;color:white}
        .modal-content h3{font-family:'Space Grotesk',sans-serif;font-size:22px;margin-bottom:8px;color:#1e293b}
        .modal-content>p{color:#64748b;font-size:14px;margin-bottom:20px;line-height:1.5}
        .android-form{display:flex;flex-direction:column;gap:12px}
        .android-form input{padding:14px 16px;border:1px solid #E2E8F0;border-radius:10px;font-size:15px;font-family:inherit;outline:none;transition:border-color 0.2s}
        .android-form input:focus{border-color:#22c55e}
        .android-form button{background:#22c55e;color:white;border:none;padding:14px;border-radius:10px;font-weight:600;font-size:15px;cursor:pointer;transition:background 0.2s;font-family:inherit}
        .android-form button:hover{background:#16a34a}
        .success-msg{color:#22c55e;font-weight:600;padding:20px 0}

        /* ===== FOOTER ===== */
        .footer {
          padding: 32px 0;
          border-top: 1px solid var(--gray-200);
          text-align: center;
        }
        .footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--dark);
          font-weight: 600;
          text-decoration: none;
          margin-bottom: 6px;
          font-size: 14px;
        }
        .footer-brand:hover { color: var(--green); }
        .footer-logo { height: 24px; }
        .footer-tagline { color: var(--gray-600); font-size: 12px; margin-bottom: 12px; }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 16px;
          font-size: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .footer-links a { color: var(--gray-400); text-decoration: none; }
        .footer-links a:hover { color: var(--dark); }
        .footer-copyright { color: var(--gray-400); font-size: 11px; }

        /* ===== ANIMATIONS ===== */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero { opacity: 0; animation: fadeInUp 0.6s ease-out forwards; }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

        @media (prefers-reduced-motion: reduce) {
          .hero, .tool-card, .coming-soon-card, .animate-on-scroll {
            opacity: 1;
            transform: none;
            animation: none;
            transition: none;
          }
          .tool-card:hover, .tool-btn:hover { transform: none; }
        }

        /* ===== TABLET (min-width: 600px) ===== */
        @media (min-width: 600px) {
          .tools-grid { grid-template-columns: repeat(2, 1fr); }
          .cta-features { flex-direction: row; gap: 24px; }
        }

        /* ===== DESKTOP (min-width: 768px) ===== */
        @media (min-width: 768px) {
          .hero { padding: 64px 0 56px; }
          .hero h1 { font-size: 40px; letter-spacing: -1px; }
          .hero p { font-size: 18px; }
          .tools-section { padding: 64px 0; }
          .tools-count { margin-bottom: 40px; }
          .tools-grid { gap: 24px; }
          .tool-card { padding: 32px; border-radius: 24px; }
          .tool-icon { width: 56px; height: 56px; border-radius: 16px; }
          .tool-icon svg { width: 28px; height: 28px; }
          .tool-card-title { font-size: 22px; }
          .tool-card-description { font-size: 15px; }
          .tool-feature { font-size: 13px; padding: 7px 14px; }
          .tool-btn { padding: 14px 28px; font-size: 15px; }
          .coming-soon-card { padding: 56px 32px; }
          .cta-section { padding: 64px 48px; margin: 64px 0; }
          .cta-section h2 { font-size: 36px; }
          .cta-section p { font-size: 16px; }
          .cta-features { gap: 32px; font-size: 14px; }
          .footer { padding: 40px 0; }
          .footer-brand { font-size: 16px; gap: 10px; }
          .footer-logo { height: 28px; }
          .footer-tagline { font-size: 14px; }
          .footer-links { gap: 24px; font-size: 14px; }
        }

        /* ===== LARGE DESKTOP (min-width: 1024px) ===== */
        @media (min-width: 1024px) {
          .hero { padding: 80px 0 64px; }
          .hero h1 { font-size: 48px; }
          .tools-section { padding: 80px 0; }
          .tools-grid { grid-template-columns: repeat(2, 1fr); gap: 28px; }
          .tool-card { padding: 36px; }
        }
      </style>

      <section class="hero">
        <div class="container">
          <div class="hero-badge">
            ${this._getIcon('sparkles')}
            Free Health Tools
          </div>
          <h1>Tools to understand <span>your nutrition</span></h1>
          <p>Free tools to help you understand your nutrition and health. No signup required.</p>
        </div>
      </section>

      <section class="tools-section">
        <div class="container">
          <div class="tools-count">${tools.length} tool${tools.length !== 1 ? 's' : ''} available</div>
          <div class="tools-grid">
            ${tools.map(tool => `
              <div class="tool-card">
                ${tool.badge ? `<div class="tool-card-badge">${tool.badge}</div>` : ''}
                <div class="tool-card-header">
                  <div class="tool-icon">${this._getIcon(tool.icon || 'sparkles')}</div>
                  <div class="tool-card-header-text">
                    <h3 class="tool-card-title">${tool.title}</h3>
                    <p class="tool-card-description">${tool.description}</p>
                  </div>
                </div>
                ${tool.features && tool.features.length ? `
                  <div class="tool-card-features">
                    ${tool.features.map(f => `
                      <span class="tool-feature">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                        ${f}
                      </span>
                    `).join('')}
                  </div>
                ` : ''}
                <div class="tool-card-action">
                  <a href="${tool.url || '#'}" class="tool-btn">
                    Try it now
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a>
                </div>
              </div>
            `).join('')}

            <div class="coming-soon-card">
              <div class="coming-soon-icon">
                ${this._getIcon('zap')}
              </div>
              <h3 class="coming-soon-title">More tools coming soon</h3>
              <p class="coming-soon-text">We're building more free tools to help you understand your health. Stay tuned.</p>
            </div>
          </div>

          <div class="cta-section animate-on-scroll">
            <div class="cta-content">
              <h2>Get the full picture with the Kygo app</h2>
              <p>These tools give you a snapshot. The Kygo app connects your nutrition with wearable data to reveal how food affects your sleep, HRV, energy, and recovery.</p>
              <a href="${appStoreUrl}" class="cta-btn-white" target="_blank">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Download Free on iOS
              </a>
              <div class="cta-features">
                <span class="cta-feature"><span class="cta-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></span> Free forever plan</span>
                <span class="cta-feature"><span class="cta-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></span> Syncs with 4+ wearables</span>
                <span class="cta-feature"><span class="cta-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></span> AI food logging</span>
              </div>
              <button class="cta-android">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                Android — Join Beta
              </button>
            </div>
          </div>
        </div>
      </section>
      <div class="android-modal">
        <div class="modal-content">
          <button class="modal-close">×</button>
          <div class="modal-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg></div>
          <h3>Android Free Beta Open!</h3>
          <p>Sign up and we'll send you an email to access the Android beta.</p>
          <form class="android-form">
            <input type="email" placeholder="Enter your email" required>
            <button type="submit">Join Free Beta</button>
          </form>
        </div>
      </div>

      <footer class="footer">
        <div class="container">
          <a href="https://kygo.app" class="footer-brand" target="_blank">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" />
            Kygo Health
          </a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <div class="footer-links">
            <a href="https://kygo.app" target="_blank">Home</a>
            <a href="https://kygo.app/how-it-works" target="_blank">How It Works</a>
            <a href="https://kygo.app/blog" target="_blank">Blog</a>
            <a href="https://kygo.app/contact" target="_blank">Contact</a>
            <a href="https://kygo.app/privacy" target="_blank">Privacy</a>
            <a href="https://kygo.app/terms" target="_blank">Terms</a>
          </div>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC</p>
        </div>
      </footer>
    `;
  }
}
if (!customElements.get('kygo-tools-page')) {
  customElements.define('kygo-tools-page', KygoToolsPage);
}
