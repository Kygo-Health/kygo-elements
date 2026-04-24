/**
 * Kygo Health - Tools Page Custom Element
 * Tag: kygo-tools-page
 * Mobile-first tools index: hero, category chips, featured navy card, tool grid, dark navy app promo.
 * Tools are configurable via the 'tools' attribute (JSON array).
 */

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
    this._activeCategory = 'all';
  }

  connectedCallback() {
    this._parseTools();
    this.render();
    this._setupEvents();
    this._setupAnimations();
    __seo(this, 'Kygo Health Free Tools — Free research-backed tools to understand your nutrition and health. Food Scanner, Wearable Accuracy, HRV Factors, Sleep Factors, Step Count Accuracy, Sleep Metrics, Calorie Burn Accuracy, Sensor Comparison, and more. No signup required.');
    this._injectStructuredData();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  static get observedAttributes() { return ['tools']; }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'tools' && oldValue !== newValue) {
      this._parseTools();
      this.render();
      this._setupEvents();
      this._setupAnimations();
    }
  }

  _parseTools() {
    try {
      const attr = this.getAttribute('tools');
      if (attr) { this._tools = JSON.parse(attr); return; }
    } catch (e) {}
    this._tools = [];
  }

  // Slug → category mapping (overridable via tool.category)
  _categoryFor(tool) {
    if (tool.category) return tool.category;
    const map = {
      'wearable-accuracy': 'wearables',
      'sensor-comparison': 'wearables',
      'calorie-burn-accuracy': 'wearables',
      'step-count-accuracy': 'wearables',
      'sleep-metrics': 'sleep',
      'sleep-latency-factors': 'sleep',
      'staying-asleep-factors': 'sleep',
      'deep-sleep-factors': 'sleep',
      'hrv-factors': 'recovery',
      'food-scanner': 'nutrition'
    };
    return map[tool.slug] || 'other';
  }

  _categories() {
    const order = ['all', 'sleep', 'recovery', 'nutrition', 'wearables'];
    const labels = { all: 'All', sleep: 'Sleep', recovery: 'Recovery', nutrition: 'Nutrition', wearables: 'Wearables' };
    const counts = { all: this._tools.length };
    this._tools.forEach(t => {
      const c = this._categoryFor(t);
      counts[c] = (counts[c] || 0) + 1;
    });
    return order
      .filter(id => id === 'all' || counts[id])
      .map(id => ({ id, label: labels[id], count: counts[id] || 0 }));
  }

  _filteredTools() {
    if (this._activeCategory === 'all') return this._tools;
    return this._tools.filter(t => this._categoryFor(t) === this._activeCategory);
  }

  // Parse "17+ peer-reviewed studies" → { n: '17+', l: 'peer-reviewed studies' }
  _statsFor(tool) {
    const features = Array.isArray(tool.features) ? tool.features.slice(0, 3) : [];
    return features.map(f => {
      const s = String(f);
      const space = s.indexOf(' ');
      if (space > 0 && /\d/.test(s.slice(0, space))) {
        return { n: s.slice(0, space), l: s.slice(space + 1) };
      }
      return { n: '', l: s };
    });
  }

  _featured() {
    return this._tools.find(t => t.featured === true)
      || this._tools.find(t => (t.badge || '').toLowerCase() === 'most popular')
      || null;
  }

  _badgeTone(badge) {
    const b = (badge || '').toLowerCase();
    if (b === 'most popular') return 'popular';
    if (b === 'new') return 'new';
    if (b === 'trending') return 'trending';
    return 'soft';
  }

  _getIcon(name) {
    const icons = {
      camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
      calculator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
      brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/></svg>',
      zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
      steps: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.48-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      'arrow-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
      playstore: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
      share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>'
    };
    return icons[name] || icons.sparkles;
  }

  _setupEvents() {
    const root = this.shadowRoot;
    root.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-cat');
        if (id === this._activeCategory) return;
        this._activeCategory = id;
        this.render();
        this._setupEvents();
        this._setupAnimations();
      });
    });

    root.querySelectorAll('[data-open-tool]').forEach(el => {
      el.addEventListener('click', (e) => {
        const url = el.getAttribute('data-open-tool');
        if (!url) return;
        e.preventDefault();
        window.location.href = url;
      });
    });

    const shareBtn = root.querySelector('[data-share]');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const url = window.location.href;
        const title = 'Kygo Health — Free Tools';
        if (navigator.share) {
          navigator.share({ title, url }).catch(() => {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(url).catch(() => {});
        }
      });
    }
  }

  _setupAnimations() {
    if (this._observer) this._observer.disconnect();
    requestAnimationFrame(() => {
      const cards = this.shadowRoot.querySelectorAll('.tool-card');
      if (!cards.length) return;
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const idx = Array.from(card.parentElement.children).indexOf(card);
            setTimeout(() => card.classList.add('visible'), Math.min(idx, 6) * 60);
            this._observer.unobserve(card);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      cards.forEach(c => this._observer.observe(c));
    });
  }

  _styles() {
    return `
      :host {
        --dark: #1E293B;
        --dark-card: #0F172A;
        --light: #F8FAFC;
        --green: #22C55E;
        --green-dark: #16A34A;
        --green-light: rgba(34, 197, 94, 0.10);
        --green-glow: rgba(34, 197, 94, 0.30);
        --gray-50: #F9FAFB;
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
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; min-width: 0; }
      h1, h2, h3 {
        font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 600;
        line-height: 1.15;
        letter-spacing: -0.01em;
      }
      button { font-family: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
      a { color: inherit; text-decoration: none; }

      /* ===== SECTIONS / BANDS ===== */
      .sec { width: 100%; }
      .sec-hero { background: #fff; border-bottom: 1px solid var(--gray-200); }
      .sec-tools { background: var(--light); }
      .sec-promo { background: #fff; }
      .wrap {
        width: 100%;
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 20px;
        box-sizing: border-box;
      }

      /* ===== HEADER ===== */
      .page-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 18px 0 6px;
      }
      .brand { display: flex; align-items: center; gap: 8px; }
      .brand-logo { height: 26px; width: auto; display: block; }
      .brand-name {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 700; font-size: 16px; color: var(--dark);
        letter-spacing: -0.005em;
      }
      .brand-sub {
        font-size: 12px; font-weight: 600;
        color: var(--gray-400); margin-left: 2px;
      }
      .icon-btn {
        border: none; background: transparent; color: var(--dark);
        padding: 6px; display: inline-flex; align-items: center; justify-content: center;
      }
      .icon-btn svg { width: 22px; height: 22px; }

      /* ===== HERO (centered, matches site pattern) ===== */
      .hero { padding: 32px 0 40px; text-align: center; }
      .kicker-pill {
        display: inline-flex; align-items: center; gap: 6px;
        background: var(--green-light); color: var(--green-dark);
        padding: 6px 14px; border-radius: 9999px;
        font-size: 12px; font-weight: 600;
        margin-bottom: 18px;
      }
      .kicker-pill svg { width: 14px; height: 14px; }
      .hero h1 {
        font-size: clamp(28px, 6vw, 40px); color: var(--dark);
        margin: 0 0 14px; letter-spacing: -0.02em;
      }
      .hero h1 .hl { color: var(--green); }
      .hero p {
        font-size: clamp(15px, 2vw, 17px); color: var(--gray-600);
        line-height: 1.6; margin: 0 auto 20px;
        max-width: 560px;
      }
      .mini-stats {
        display: flex; flex-wrap: wrap; gap: 8px;
        font-size: 13px; color: var(--gray-600);
        justify-content: center;
      }
      .mini-stats .dot { color: var(--gray-400); }
      .mini-stats .item { display: inline-flex; align-items: center; gap: 5px; }
      .mini-stats .item svg { width: 13px; height: 13px; color: var(--green); }
      @media (min-width: 768px) {
        .hero { padding: 56px 0 56px; }
      }

      /* ===== CATEGORY CHIPS ===== */
      .chips-wrap { padding: 4px 0 16px; }
      .chips {
        display: flex; gap: 8px; overflow-x: auto;
        padding: 4px 0; scrollbar-width: none;
      }
      .chips::-webkit-scrollbar { display: none; }
      .chip {
        flex-shrink: 0;
        background: #fff; color: var(--gray-600);
        border: 1.5px solid var(--gray-200);
        border-radius: 9999px;
        padding: 8px 14px;
        font-size: 13px; font-weight: 600;
        display: inline-flex; align-items: center; gap: 6px;
        transition: all 150ms ease;
      }
      .chip .count {
        font-size: 11px; font-weight: 500; color: var(--gray-400);
      }
      .chip.active {
        background: var(--dark); color: #fff; border-color: var(--dark);
      }
      .chip.active .count { color: rgba(255,255,255,0.6); }
    `;
  }

  _styles2() {
    return `
      /* ===== FEATURED ===== */
      .featured-wrap { padding: 24px 0 4px; }
      .featured {
        display: block; width: 100%; text-align: left;
        background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
        color: #fff; border-radius: 24px; padding: 22px;
        border: none; position: relative; overflow: hidden;
        box-shadow: 0 12px 32px rgba(15,23,42,0.25);
      }
      .featured::before {
        content: ''; position: absolute; top: -40px; right: -40px;
        width: 220px; height: 220px; border-radius: 50%;
        background: radial-gradient(circle, rgba(34,197,94,0.35) 0%, transparent 70%);
        pointer-events: none;
      }
      .featured-inner { position: relative; z-index: 1; }
      .featured-top {
        display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
      }
      .featured-meta {
        font-size: 10px; font-weight: 600; letter-spacing: 0.5px;
        text-transform: uppercase; color: rgba(255,255,255,0.5);
      }
      .featured-icon {
        width: 50px; height: 50px; border-radius: 14px;
        background: linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);
        display: flex; align-items: center; justify-content: center;
        color: #fff; margin-bottom: 16px;
        box-shadow: 0 8px 20px rgba(34,197,94,0.4);
      }
      .featured-icon svg { width: 26px; height: 26px; }
      .featured h2 {
        font-size: 26px; color: #fff; margin: 0 0 8px; line-height: 1.15;
      }
      .featured-blurb {
        font-size: 14px; color: rgba(255,255,255,0.72);
        line-height: 1.5; margin: 0 0 20px;
      }
      .featured-stats {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
        padding: 14px 0; margin-bottom: 18px;
        border-top: 1px solid rgba(255,255,255,0.12);
        border-bottom: 1px solid rgba(255,255,255,0.12);
      }
      .featured-stats .n {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 20px; font-weight: 700; color: var(--green); line-height: 1;
      }
      .featured-stats .l {
        font-size: 10px; color: rgba(255,255,255,0.55);
        margin-top: 4px; line-height: 1.2;
      }
      .featured-cta {
        display: inline-flex; align-items: center; gap: 8px;
        background: var(--green); color: #fff;
        padding: 12px 18px; border-radius: 12px;
        font-weight: 600; font-size: 14px;
        border: none;
      }
      .featured-cta svg { width: 16px; height: 16px; }

      /* ===== TAG PILLS ===== */
      .tag {
        display: inline-flex; align-items: center; gap: 5px;
        font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
        text-transform: uppercase;
        padding: 4px 9px; border-radius: 9999px;
      }
      .tag.popular { background: var(--green); color: #fff; }
      .tag.new { background: var(--dark); color: #fff; }
      .tag.trending, .tag.soft {
        background: var(--green-light); color: var(--green-dark);
      }
      .tag .dot {
        width: 5px; height: 5px; border-radius: 9999px;
        background: var(--green); display: inline-block;
      }

      /* ===== SECTION HEADER ===== */
      .section-head {
        padding: 24px 0 12px;
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
      }
      .section-kicker {
        font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
        text-transform: uppercase; color: var(--gray-400);
      }
      .section-count {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 20px; font-weight: 600; color: var(--dark);
        margin-top: 2px;
      }
    `;
  }

  _styles3() {
    return `
      /* ===== TOOL CARDS ===== */
      .grid {
        padding: 0 0 32px;
        display: grid; grid-template-columns: 1fr; gap: 14px;
      }
      .tool-card {
        width: 100%; text-align: left;
        background: #fff; border: 1.5px solid var(--gray-200);
        border-radius: 20px; padding: 18px;
        position: relative;
        opacity: 0; transform: translateY(12px);
        transition: opacity 400ms ease, transform 400ms ease,
                    border-color 160ms ease, box-shadow 160ms ease;
      }
      .tool-card.visible { opacity: 1; transform: translateY(0); }
      .tool-card:hover {
        border-color: var(--green);
        box-shadow: 0 12px 32px rgba(0,0,0,0.06);
        cursor: pointer;
      }
      .tool-card:hover .card-cta {
        background: var(--green); color: #fff;
      }
      .card-head {
        display: flex; align-items: flex-start; justify-content: space-between;
        gap: 10px; margin-bottom: 14px;
      }
      .card-icon {
        width: 44px; height: 44px; border-radius: 12px;
        background: var(--green-light); color: var(--green-dark);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .card-icon svg { width: 22px; height: 22px; }
      .card-title {
        font-size: 17px; font-weight: 600; color: var(--dark);
        margin: 0 0 6px; line-height: 1.25;
      }
      .card-blurb {
        font-size: 13px; color: var(--gray-600);
        line-height: 1.5; margin: 0 0 14px;
      }
      .card-foot {
        display: flex; align-items: center; gap: 10px;
        padding-top: 12px;
        border-top: 1px solid var(--gray-200);
      }
      .card-stats {
        display: flex; gap: 14px; flex: 1; min-width: 0;
      }
      .card-stat { min-width: 0; }
      .card-stat .n {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 16px; font-weight: 700; color: var(--dark); line-height: 1;
      }
      .card-stat .n.check {
        display: inline-flex; align-items: center; color: var(--green);
      }
      .card-stat .n.check svg { width: 16px; height: 16px; }
      .card-stat .l {
        font-size: 10px; color: var(--gray-400); margin-top: 3px;
        line-height: 1.2; white-space: nowrap;
        overflow: hidden; text-overflow: ellipsis;
      }
      .card-cta {
        flex-shrink: 0;
        width: 36px; height: 36px; border-radius: 9999px;
        background: var(--green-light); color: var(--green-dark);
        display: flex; align-items: center; justify-content: center;
        transition: background 160ms, color 160ms;
      }
      .card-cta svg { width: 16px; height: 16px; }

      /* ===== EMPTY STATE ===== */
      .empty {
        padding: 48px 0; text-align: center;
      }
      .empty-icon {
        width: 60px; height: 60px; border-radius: 16px;
        background: var(--gray-100); color: var(--gray-400);
        display: inline-flex; align-items: center; justify-content: center;
        margin-bottom: 12px;
      }
      .empty-icon svg { width: 24px; height: 24px; }
      .empty-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 16px; font-weight: 600; color: var(--dark); margin-bottom: 4px;
      }
      .empty-sub { font-size: 13px; color: var(--gray-600); }

      /* ===== APP PROMO ===== */
      .promo-wrap { padding: 48px 0; }
      .promo {
        background: linear-gradient(180deg, #1E293B 0%, #0F172A 100%);
        border-radius: 24px; padding: 40px 24px;
        color: #fff; position: relative; overflow: hidden;
        box-shadow: 0 12px 32px rgba(15,23,42,0.25);
      }
      @media (min-width: 768px) {
        .promo { padding: 56px 40px; }
      }
      .promo::before {
        content: ''; position: absolute; top: -60px; right: -60px;
        width: 220px; height: 220px; border-radius: 50%;
        background: radial-gradient(circle, rgba(34,197,94,0.28) 0%, transparent 65%);
        pointer-events: none;
      }
      .promo-inner { position: relative; text-align: center; }
      .promo-pill {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(34,197,94,0.15);
        color: var(--green);
        border: 1px solid rgba(34,197,94,0.3);
        padding: 5px 12px; border-radius: 9999px;
        font-size: 12px; font-weight: 600;
        margin-bottom: 18px;
      }
      .promo-pill .d {
        width: 6px; height: 6px; border-radius: 9999px;
        background: var(--green); display: inline-block;
      }
      .promo h2 {
        font-size: 26px; color: #fff;
        margin: 0 0 12px; line-height: 1.15;
      }
      .promo h2 .hl { color: var(--green); }
      .promo p {
        font-size: 14px; color: rgba(255,255,255,0.7);
        line-height: 1.55; margin: 0 auto 22px; max-width: 320px;
      }
      .promo-buttons {
        display: flex; flex-direction: column; gap: 10px;
        margin: 0 auto 22px; max-width: 340px;
      }
      @media (min-width: 520px) {
        .promo-buttons { flex-direction: row; justify-content: center; max-width: none; }
        .promo-btn { min-width: 220px; }
      }
      .promo-btn {
        background: var(--green); color: #fff;
        border: none; border-radius: 12px;
        padding: 14px 16px;
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        font-weight: 700; font-size: 15px;
        box-shadow: 0 8px 20px rgba(34,197,94,0.25);
        text-decoration: none;
      }
      .promo-btn svg { width: 18px; height: 18px; }
      .promo-btn:hover { background: var(--green-dark); }
      .works-with {
        display: flex; align-items: center; justify-content: center;
        gap: 10px; flex-wrap: wrap;
      }
      .works-label {
        font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 500;
      }
      .works-dots { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
      .wd {
        width: 32px; height: 32px; border-radius: 8px;
        background: rgba(255,255,255,0.08);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; overflow: hidden;
        transition: background 150ms ease, transform 150ms ease;
      }
      .wd:hover { background: rgba(255,255,255,0.15); transform: scale(1.08); }
      .wd img {
        width: 20px; height: 20px;
        object-fit: contain; border-radius: 4px;
        opacity: 0.85; transition: opacity 150ms ease;
      }
      .wd:hover img { opacity: 1; }

      /* ===== RESPONSIVE ===== */
      @media (min-width: 640px) {
        .grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
      }
      @media (min-width: 1024px) {
        .grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .tool-card { opacity: 1; transform: none; transition: none; }
      }
    `;
  }

  _renderFeatured(tool) {
    if (!tool) return '';
    const stats = this._statsFor(tool);
    return `
      <div class="featured-wrap">
        <button class="featured" data-open-tool="${tool.url || '#'}" aria-label="${tool.title}">
          <div class="featured-inner">
            <div class="featured-top">
              ${tool.badge ? `<span class="tag ${this._badgeTone(tool.badge)}">${tool.badge}</span>` : ''}
              <span class="featured-meta">Featured Tool</span>
            </div>
            <div class="featured-icon">${this._getIcon(tool.icon || 'sparkles')}</div>
            <h2>${tool.title}</h2>
            <p class="featured-blurb">${tool.description || ''}</p>
            ${stats.length ? `
              <div class="featured-stats">
                ${stats.map(s => `
                  <div>
                    <div class="n">${s.n || '✓'}</div>
                    <div class="l">${s.l || ''}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            <span class="featured-cta">Open tool ${this._getIcon('arrow-right')}</span>
          </div>
        </button>
      </div>
    `;
  }

  _renderCard(tool) {
    const stats = this._statsFor(tool);
    return `
      <div class="tool-card" data-open-tool="${tool.url || '#'}" role="button" tabindex="0" aria-label="${tool.title}">
        <div class="card-head">
          <div class="card-icon">${this._getIcon(tool.icon || 'sparkles')}</div>
          ${tool.badge ? `<span class="tag ${this._badgeTone(tool.badge)}">${(this._badgeTone(tool.badge) === 'trending' || this._badgeTone(tool.badge) === 'soft') ? '<span class="dot"></span>' : ''}${tool.badge}</span>` : ''}
        </div>
        <h3 class="card-title">${tool.title}</h3>
        <p class="card-blurb">${tool.description || ''}</p>
        <div class="card-foot">
          <div class="card-stats">
            ${stats.map(s => `
              <div class="card-stat">
                <div class="n${s.n ? '' : ' check'}">${s.n || this._getIcon('check')}</div>
                <div class="l">${s.l || ''}</div>
              </div>
            `).join('')}
          </div>
          <span class="card-cta">${this._getIcon('arrow-right')}</span>
        </div>
      </div>
    `;
  }

  _renderChips(cats) {
    return `
      <div class="chips-wrap">
        <div class="chips">
          ${cats.map(c => `
            <button class="chip ${this._activeCategory === c.id ? 'active' : ''}" data-cat="${c.id}">
              ${c.label}
              <span class="count">${c.count}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const appStoreUrl = 'https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589';
    const playStoreUrl = 'https://kygo.app/android';

    const cats = this._categories();
    const featured = this._featured();
    const filtered = this._filteredTools();
    const showFeatured = this._activeCategory === 'all' && featured;
    const cardTools = showFeatured ? filtered.filter(t => t !== featured) : filtered;

    const sectionLabel = this._activeCategory === 'all'
      ? 'All Tools'
      : (cats.find(c => c.id === this._activeCategory)?.label || 'Tools');

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}${this._styles2()}${this._styles3()}</style>

      <section class="sec sec-hero">
        <div class="wrap">
          <header class="page-header">
            <a class="brand" href="https://kygo.app">
              <img class="brand-logo" src="${logoUrl}" alt="Kygo Health" />
              <span class="brand-name">Kygo</span>
              <span class="brand-sub">/ Tools</span>
            </a>
            <button class="icon-btn" aria-label="Share" data-share>${this._getIcon('share')}</button>
          </header>

          <div class="hero">
            <div class="kicker-pill">${this._getIcon('sparkles')} Free Health Tools</div>
            <h1>Tools to understand <span class="hl">your well-being.</span></h1>
            <p>Research-backed calculators and factor explorers. No signup. Free forever.</p>
            <div class="mini-stats">
              <span class="item">${this._getIcon('check')} ${this._tools.length} tools</span>
              <span class="dot">•</span>
              <span class="item">${this._getIcon('check')} 200+ studies</span>
              <span class="dot">•</span>
              <span class="item">${this._getIcon('check')} No signup</span>
            </div>
          </div>
        </div>
      </section>

      <section class="sec sec-tools">
        <div class="wrap">
          ${showFeatured ? this._renderFeatured(featured) : ''}

          <div class="section-head">
            <div>
              <div class="section-kicker">${sectionLabel}</div>
              <div class="section-count">${filtered.length} ${filtered.length === 1 ? 'tool' : 'tools'} available</div>
            </div>
          </div>

          ${this._renderChips(cats)}

          ${cardTools.length ? `
            <div class="grid">
              ${cardTools.map(t => this._renderCard(t)).join('')}
            </div>
          ` : `
            <div class="empty">
              <div class="empty-icon">${this._getIcon('sparkles')}</div>
              <div class="empty-title">No tools yet</div>
              <div class="empty-sub">Try another category.</div>
            </div>
          `}
        </div>
      </section>

      <section class="sec sec-promo">
        <div class="wrap">
          <div class="promo-wrap">
            <div class="promo">
              <div class="promo-inner">
                <div class="promo-pill"><span class="d"></span> iOS & Android</div>
                <h2>These tools are a snapshot.<br/><span class="hl">Kygo is the full picture.</span></h2>
                <p>Connect your wearable. Log your meals. See how food affects your sleep, HRV, energy, and recovery.</p>
                <div class="promo-buttons">
                  <a class="promo-btn" href="${appStoreUrl}" target="_blank" rel="noopener">${this._getIcon('apple')} Download for iOS</a>
                  <a class="promo-btn" href="${playStoreUrl}" target="_blank" rel="noopener">${this._getIcon('playstore')} Download for Android</a>
                </div>
                <div class="works-with">
                  <span class="works-label">Works with</span>
                  <div class="works-dots">
                    <span class="wd" title="Oura Ring"><img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura Ring" loading="lazy"/></span>
                    <span class="wd" title="Apple Health"><img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple Health" loading="lazy"/></span>
                    <span class="wd" title="Fitbit"><img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit" loading="lazy"/></span>
                    <span class="wd" title="Garmin"><img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin" loading="lazy"/></span>
                    <span class="wd" title="Whoop"><img src="https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png" alt="Whoop" loading="lazy"/></span>
                    <span class="wd" title="Health Connect"><img src="https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png" alt="Health Connect" loading="lazy"/></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  _injectStructuredData() {
    if (document.querySelector('script[data-kygo-tools-ld]')) return;
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Kygo Health Free Tools',
      'description': 'Free research-backed health tools by Kygo Health. Compare wearable accuracy, explore sleep and HRV factors, analyze calorie burn accuracy, and more.',
      'url': 'https://www.kygo.app/tools',
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': this._tools.map((t, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'name': t.title,
          'description': t.description || '',
          'url': t.url ? (t.url.startsWith('http') ? t.url : `https://www.kygo.app${t.url.startsWith('/') ? '' : '/'}${t.url}`) : 'https://www.kygo.app/tools'
        }))
      },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' }
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-kygo-tools-ld', '');
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }
}

if (!customElements.get('kygo-tools-page')) {
  customElements.define('kygo-tools-page', KygoToolsPage);
}
