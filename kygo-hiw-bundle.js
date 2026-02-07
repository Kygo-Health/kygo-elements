/**
 * Kygo Health - How It Works Hero Section
 * Tag name: kygo-hiw-hero
 */

class KygoHiwHero extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
  }

  _parseWixAttributes() {
    try {
      const wixconfig = this.getAttribute('wixconfig');
      const wixsettings = this.getAttribute('wixsettings');
      if (wixconfig) this._config = JSON.parse(wixconfig);
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {
      console.warn('KygoHiwHero: Could not parse Wix attributes', e);
    }
  }

  static get observedAttributes() {
    return ['wixsettings'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'wixsettings') {
      this._parseWixAttributes();
      this.render();
    }
  }

  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --dark: #1E293B;
          --light: #F8FAFC;
          --green: #22C55E;
          --green-dark: #16A34A;
          --green-light: rgba(34, 197, 94, 0.1);
          --gray-50: #f9fafb;
          --gray-600: #475569;
          
          display: block;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(180deg, var(--gray-50) 0%, var(--light) 100%);
          color: var(--dark);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        h1, h2 {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          line-height: 1.2;
        }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        .hero {
          padding: 48px 0 64px;
          text-align: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--green-light);
          color: var(--green-dark);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .hero-badge svg {
          width: 16px;
          height: 16px;
        }

        .hero h1 {
          font-size: clamp(32px, 8vw, 40px);
          margin-bottom: 16px;
          color: var(--dark);
        }

        .hero h1 .highlight {
          color: var(--green);
        }

        .hero-subtitle {
          font-size: clamp(16px, 4vw, 18px);
          color: var(--gray-600);
          max-width: 600px;
          margin: 0 auto 32px;
          line-height: 1.7;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .hero-stat {
          text-align: center;
        }

        .hero-stat-number {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(24px, 6vw, 32px);
          font-weight: 700;
          color: var(--green);
        }

        .hero-stat-label {
          font-size: 14px;
          color: var(--gray-600);
        }

        @media (min-width: 768px) {
          .hero { padding: 80px 0 100px; }
          .hero h1 { font-size: 52px; }
          .hero-stats { gap: 40px; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-badge {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .hero h1 {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out 0.1s forwards;
        }

        .hero-subtitle {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out 0.2s forwards;
        }

        .hero-stats {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out 0.3s forwards;
        }

        .hero-stat {
          opacity: 0;
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .hero-stat:nth-child(1) { animation-delay: 0.3s; }
        .hero-stat:nth-child(2) { animation-delay: 0.4s; }
        .hero-stat:nth-child(3) { animation-delay: 0.5s; }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      </style>

      <section class="hero">
        <div class="container">
          <div class="hero-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Setup in minutes, correlations in days
          </div>
          
          <h1>How <span class="highlight">Kygo</span> Works</h1>
          <p class="hero-subtitle">Three simple steps to understand the connection between what you eat and how your body responds—backed by real data from your wearables.</p>

          <div class="hero-stats">
            <div class="hero-stat">
              <div class="hero-stat-number">2 min</div>
              <div class="hero-stat-label">Setup time</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-number">7 days</div>
              <div class="hero-stat-label">To first correlations</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-number">5M+</div>
              <div class="hero-stat-label">Foods in database</div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('kygo-hiw-hero', KygoHiwHero);

/**
 * Kygo Health - Phase 1: Connect Your Wearables
 * Tag name: kygo-hiw-phase-connect
 */

class KygoHiwPhaseConnect extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._setupScrollAnimations();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  _parseWixAttributes() {
    try {
      const wixconfig = this.getAttribute('wixconfig');
      const wixsettings = this.getAttribute('wixsettings');
      if (wixconfig) this._config = JSON.parse(wixconfig);
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {
      console.warn('KygoHiwPhaseConnect: Could not parse Wix attributes', e);
    }
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

  static get observedAttributes() {
    return ['wixsettings'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'wixsettings') {
      this._parseWixAttributes();
      this.render();
    }
  }

  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --dark: #1E293B;
          --dark-card: #0f172a;
          --dark-surface: #1a2332;
          --light: #F8FAFC;
          --green: #22C55E;
          --green-dark: #16A34A;
          --green-light: rgba(34, 197, 94, 0.1);
          --green-glow: rgba(34, 197, 94, 0.3);
          --gray-50: #f9fafb;
          --gray-100: #F1F5F9;
          --gray-400: #94A3B8;
          --gray-600: #475569;
          --gray-700: #334155;
          
          display: block;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--gray-50);
          color: var(--dark);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        h2, h4 {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          line-height: 1.2;
        }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        .phase-section { padding: 64px 0; }

        .phase-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .phase-number {
          width: 48px;
          height: 48px;
          background: var(--green);
          color: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 20px;
          flex-shrink: 0;
        }

        .phase-label {
          font-size: 13px;
          color: var(--green);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .phase-title {
          font-size: clamp(26px, 6vw, 32px);
          color: var(--dark);
          margin-bottom: 8px;
        }

        .phase-time {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--gray-100);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          color: var(--gray-600);
          margin-bottom: 24px;
        }

        .phase-time svg { width: 14px; height: 14px; }

        .phase-content { display: grid; gap: 40px; }

        .phase-description {
          font-size: 17px;
          color: var(--gray-600);
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 560px;
        }

        .feature-list { display: flex; flex-direction: column; gap: 16px; }

        .feature-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          background: var(--green-light);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-icon svg {
          width: 20px;
          height: 20px;
          color: var(--green);
        }

        .feature-text h4 {
          font-size: 16px;
          color: var(--dark);
          margin-bottom: 2px;
        }

        .feature-text p {
          font-size: 14px;
          color: var(--gray-600);
          line-height: 1.5;
        }

        .immediate-value {
          background: linear-gradient(135deg, var(--dark), var(--gray-700));
          border-radius: 16px;
          padding: 20px 24px;
          margin-top: 24px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .immediate-value-icon {
          width: 44px;
          height: 44px;
          background: var(--green);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .immediate-value-icon svg {
          width: 22px;
          height: 22px;
          color: white;
        }

        .immediate-value-text { color: white; }

        .immediate-value-text span {
          font-size: 11px;
          color: var(--green);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .immediate-value-text p {
          font-size: 15px;
          margin-top: 2px;
        }

        .phase-visual {
          background: var(--dark);
          border-radius: 24px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .phase-visual::before {
          content: '';
          position: absolute;
          top: -30%;
          right: -20%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, var(--green-glow) 0%, transparent 70%);
          pointer-events: none;
        }

        .connect-flow { position: relative; z-index: 1; }

        .connect-step {
          background: var(--dark-surface);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 14px 18px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: all 0.3s;
        }

        .connect-step.active {
          border-color: var(--green);
          box-shadow: 0 0 20px var(--green-glow);
        }

        .connect-step-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .connect-step-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 5px;
        }

        .connect-step-content { flex: 1; min-width: 0; }

        .connect-step-content strong {
          color: white;
          font-size: 15px;
          display: block;
          margin-bottom: 2px;
        }

        .connect-step-content span {
          color: var(--gray-400);
          font-size: 13px;
        }

        .connect-step-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          flex-shrink: 0;
        }

        .connect-step-status.connected { color: var(--green); }
        .connect-step-status.pending { color: var(--gray-400); }
        .connect-step-status svg { width: 16px; height: 16px; }

        @media (min-width: 768px) {
          .phase-section { padding: 80px 0; }
          .phase-content {
            grid-template-columns: 1fr 1fr;
            align-items: center;
            gap: 64px;
          }
          .phase-visual { padding: 32px; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-on-scroll.delay-1 { transition-delay: 0.1s; }
        .animate-on-scroll.delay-2 { transition-delay: 0.2s; }
        .animate-on-scroll.delay-3 { transition-delay: 0.3s; }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 4px 20px rgba(34, 197, 94, 0.5); }
        }

        .animate-on-scroll.visible .phase-number {
          animation: pulse 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      </style>

      <section class="phase-section">
        <div class="container">
          <div class="phase-content">
            <div class="phase-info animate-on-scroll">
              <div class="phase-header">
                <div class="phase-number">1</div>
                <div class="phase-label">Phase One</div>
              </div>
              <h2 class="phase-title">Connect your wearables</h2>
              <div class="phase-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                2 minutes
              </div>
              
              <p class="phase-description">
                Link your Oura, Apple Health, Fitbit, or Garmin—we pull in your sleep, HRV, activity, and recovery data automatically. No manual entry needed, and your historical data imports so we can start finding patterns immediately.
              </p>

              <div class="feature-list">
                <div class="feature-item">
                  <div class="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                  </div>
                  <div class="feature-text">
                    <h4>One-tap OAuth connection</h4>
                    <p>Secure authorization in seconds—no passwords shared with us</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
                  </div>
                  <div class="feature-text">
                    <h4>Historical data import</h4>
                    <p>Your past sleep, HRV, and activity data imports automatically</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                  </div>
                  <div class="feature-text">
                    <h4>Connect multiple devices</h4>
                    <p>Use Oura for sleep and Garmin for workouts? We combine the data.</p>
                  </div>
                </div>
              </div>

              <div class="immediate-value">
                <div class="immediate-value-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div class="immediate-value-text">
                  <span>Day 1 Value</span>
                  <p>See unified trends from all your devices immediately</p>
                </div>
              </div>
            </div>

            <div class="phase-visual animate-on-scroll delay-2">
              <div class="connect-flow">
                <div class="connect-step active">
                  <div class="connect-step-icon">
                    <img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura">
                  </div>
                  <div class="connect-step-content">
                    <strong>Oura Ring</strong>
                    <span>Sleep, HRV, readiness</span>
                  </div>
                  <div class="connect-step-status connected">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                    Connected
                  </div>
                </div>

                <div class="connect-step active">
                  <div class="connect-step-icon">
                    <img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple Health">
                  </div>
                  <div class="connect-step-content">
                    <strong>Apple Health</strong>
                    <span>Activity, workouts, steps</span>
                  </div>
                  <div class="connect-step-status connected">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                    Connected
                  </div>
                </div>

                <div class="connect-step">
                  <div class="connect-step-icon">
                    <img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit">
                  </div>
                  <div class="connect-step-content">
                    <strong>Fitbit</strong>
                    <span>Steps, heart rate, sleep</span>
                  </div>
                  <div class="connect-step-status pending">+ Add</div>
                </div>

                <div class="connect-step">
                  <div class="connect-step-icon">
                    <img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin">
                  </div>
                  <div class="connect-step-content">
                    <strong>Garmin</strong>
                    <span>Training, recovery, body battery</span>
                  </div>
                  <div class="connect-step-status pending">+ Add</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('kygo-hiw-phase-connect', KygoHiwPhaseConnect);


/**
 * Kygo Health - Phase 2: Log Your Meals
 * Tag name: kygo-hiw-phase-log
 */

class KygoHiwPhaseLog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._setupScrollAnimations();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  _parseWixAttributes() {
    try {
      const wixconfig = this.getAttribute('wixconfig');
      const wixsettings = this.getAttribute('wixsettings');
      if (wixconfig) this._config = JSON.parse(wixconfig);
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {
      console.warn('KygoHiwPhaseLog: Could not parse Wix attributes', e);
    }
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

  static get observedAttributes() {
    return ['wixsettings'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'wixsettings') {
      this._parseWixAttributes();
      this.render();
    }
  }

  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --dark: #1E293B;
          --dark-card: #0f172a;
          --dark-surface: #1a2332;
          --light: #F8FAFC;
          --green: #22C55E;
          --green-dark: #16A34A;
          --green-light: rgba(34, 197, 94, 0.1);
          --green-glow: rgba(34, 197, 94, 0.3);
          --gray-100: #F1F5F9;
          --gray-400: #94A3B8;
          --gray-600: #475569;
          --gray-700: #334155;
          
          display: block;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: white;
          color: var(--dark);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        h2, h4 {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          line-height: 1.2;
        }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        .phase-section { padding: 64px 0; }

        .phase-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .phase-number {
          width: 48px;
          height: 48px;
          background: var(--green);
          color: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 20px;
          flex-shrink: 0;
        }

        .phase-label {
          font-size: 13px;
          color: var(--green);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .phase-title {
          font-size: clamp(26px, 6vw, 32px);
          color: var(--dark);
          margin-bottom: 8px;
        }

        .phase-time {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--gray-100);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          color: var(--gray-600);
          margin-bottom: 24px;
        }

        .phase-time svg { width: 14px; height: 14px; }

        .phase-content { display: grid; gap: 40px; }

        .phase-description {
          font-size: 17px;
          color: var(--gray-600);
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 560px;
        }

        .feature-list { display: flex; flex-direction: column; gap: 16px; }

        .feature-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          background: var(--green-light);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-icon svg {
          width: 20px;
          height: 20px;
          color: var(--green);
        }

        .feature-text h4 {
          font-size: 16px;
          color: var(--dark);
          margin-bottom: 2px;
        }

        .feature-text p {
          font-size: 14px;
          color: var(--gray-600);
          line-height: 1.5;
        }

        .immediate-value {
          background: linear-gradient(135deg, var(--dark), var(--gray-700));
          border-radius: 16px;
          padding: 20px 24px;
          margin-top: 24px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .immediate-value-icon {
          width: 44px;
          height: 44px;
          background: var(--green);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .immediate-value-icon svg {
          width: 22px;
          height: 22px;
          color: white;
        }

        .immediate-value-text { color: white; }

        .immediate-value-text span {
          font-size: 11px;
          color: var(--green);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .immediate-value-text p {
          font-size: 15px;
          margin-top: 2px;
        }

        .phase-visual {
          background: var(--dark);
          border-radius: 24px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .phase-visual::before {
          content: '';
          position: absolute;
          top: -30%;
          right: -20%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, var(--green-glow) 0%, transparent 70%);
          pointer-events: none;
        }

        .log-demo { position: relative; z-index: 1; }

        .log-input-area {
          background: var(--dark-surface);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 16px;
        }

        .log-input-methods {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }

        .log-method {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 12px 8px;
          text-align: center;
          transition: all 0.2s;
          cursor: pointer;
        }

        .log-method:hover,
        .log-method.active {
          background: rgba(34, 197, 94, 0.15);
          border-color: var(--green);
        }

        .log-method svg {
          width: 20px;
          height: 20px;
          color: var(--gray-400);
          margin-bottom: 4px;
        }

        .log-method:hover svg,
        .log-method.active svg {
          color: var(--green);
        }

        .log-method span {
          display: block;
          font-size: 10px;
          color: var(--gray-400);
          font-weight: 500;
        }

        .log-example {
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          padding: 14px;
        }

        .log-example-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .log-example-header svg {
          width: 16px;
          height: 16px;
          color: var(--green);
        }

        .log-example-header span {
          font-size: 12px;
          color: var(--green);
          font-weight: 500;
        }

        .log-example-text {
          color: white;
          font-size: 14px;
          font-style: italic;
        }

        .log-result {
          background: var(--dark-surface);
          border: 1px solid var(--green);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 0 20px var(--green-glow);
        }

        .log-result-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .log-result-image {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4ade80, #22c55e);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .log-result-info { flex: 1; }

        .log-result-info strong {
          color: white;
          font-size: 16px;
          display: block;
        }

        .log-result-info span {
          color: var(--gray-400);
          font-size: 13px;
        }

        .log-result-cals { text-align: right; }

        .log-result-cals strong {
          color: var(--green);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px;
          font-weight: 700;
        }

        .log-result-cals span {
          color: var(--gray-400);
          font-size: 11px;
          display: block;
        }

        .log-result-breakdown {
          display: flex;
          gap: 8px;
        }

        .log-breakdown-item {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          padding: 10px;
          text-align: center;
        }

        .log-breakdown-item strong {
          color: white;
          font-size: 14px;
          display: block;
        }

        .log-breakdown-item span {
          color: var(--gray-400);
          font-size: 10px;
          text-transform: uppercase;
        }

        .log-detail-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: var(--green);
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          margin-top: 14px;
        }

        .log-detail-badge svg { width: 14px; height: 14px; }

        @media (min-width: 768px) {
          .phase-section { padding: 80px 0; }
          .phase-content {
            grid-template-columns: 1fr 1fr;
            align-items: center;
            gap: 64px;
          }
          .phase-visual { order: -1; padding: 32px; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-on-scroll.delay-1 { transition-delay: 0.1s; }
        .animate-on-scroll.delay-2 { transition-delay: 0.2s; }
        .animate-on-scroll.delay-3 { transition-delay: 0.3s; }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 4px 20px rgba(34, 197, 94, 0.5); }
        }

        .animate-on-scroll.visible .phase-number {
          animation: pulse 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      </style>

      <section class="phase-section">
        <div class="container">
          <div class="phase-content">
            <div class="phase-info animate-on-scroll">
              <div class="phase-header">
                <div class="phase-number">2</div>
                <div class="phase-label">Phase Two</div>
              </div>
              <h2 class="phase-title">Log your meals</h2>
              <div class="phase-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Seconds, not minutes
              </div>
              
              <p class="phase-description">
                Four ways to log—pick whatever's fastest in the moment. Snap a photo and we'll identify every ingredient down to the cracked pepper on your eggs. Or just say "two eggs with avocado toast" and we'll handle the rest.
              </p>

              <div class="feature-list">
                <div class="feature-item">
                  <div class="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  </div>
                  <div class="feature-text">
                    <h4>Photo recognition</h4>
                    <p>Point, shoot, done. Identifies every ingredient—even garnishes and toppings.</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
                  </div>
                  <div class="feature-text">
                    <h4>Voice and natural text</h4>
                    <p>"Chicken salad with ranch dressing" → logged in seconds</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5h2M7 5h2M11 5h2M15 5h2M19 5h2M3 10h2M7 10h2M11 10h2M15 10h2M19 10h2M3 15h2M7 15h2M11 15h2M15 15h2M19 15h2"/></svg>
                  </div>
                  <div class="feature-text">
                    <h4>Barcode scanner</h4>
                    <p>5M+ foods in our database. Scan any packaged item.</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>
                  </div>
                  <div class="feature-text">
                    <h4>Meal templates</h4>
                    <p>Your frequent meals saved. One tap to log your regular breakfast.</p>
                  </div>
                </div>
              </div>

              <div class="immediate-value">
                <div class="immediate-value-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div class="immediate-value-text">
                  <span>Day 1 Value</span>
                  <p>Full macro and micronutrient breakdown with every meal</p>
                </div>
              </div>
            </div>

            <div class="phase-visual animate-on-scroll delay-2">
              <div class="log-demo">
                <div class="log-input-area">
                  <div class="log-input-methods">
                    <div class="log-method active">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      <span>Photo</span>
                    </div>
                    <div class="log-method">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5h2M7 5h2M11 5h2M15 5h2M19 5h2M3 10h2M7 10h2M11 10h2M15 10h2M19 10h2"/></svg>
                      <span>Barcode</span>
                    </div>
                    <div class="log-method">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                      <span>Voice</span>
                    </div>
                    <div class="log-method">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <span>Text</span>
                    </div>
                  </div>

                  <div class="log-example">
                    <div class="log-example-header">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      <span>Analyzing photo...</span>
                    </div>
                    <p class="log-example-text">"Scrambled eggs with avocado, whole grain toast, cracked black pepper, cherry tomatoes"</p>
                  </div>
                </div>

                <div class="log-result">
                  <div class="log-result-header">
                    <div class="log-result-image">🍳</div>
                    <div class="log-result-info">
                      <strong>Breakfast Bowl</strong>
                      <span>4 items identified</span>
                    </div>
                    <div class="log-result-cals">
                      <strong>485</strong>
                      <span>calories</span>
                    </div>
                  </div>
                  <div class="log-result-breakdown">
                    <div class="log-breakdown-item">
                      <strong>32g</strong>
                      <span>Protein</span>
                    </div>
                    <div class="log-breakdown-item">
                      <strong>28g</strong>
                      <span>Carbs</span>
                    </div>
                    <div class="log-breakdown-item">
                      <strong>26g</strong>
                      <span>Fat</span>
                    </div>
                    <div class="log-breakdown-item">
                      <strong>8g</strong>
                      <span>Fiber</span>
                    </div>
                  </div>
                  <div class="log-detail-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/></svg>
                    + 23 micronutrients tracked
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('kygo-hiw-phase-log', KygoHiwPhaseLog);


/**
 * Kygo Health - Phase 3: Discover Your Patterns
 * Tag name: kygo-hiw-phase-discover
 */

class KygoHiwPhaseDiscover extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._setupScrollAnimations();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  _parseWixAttributes() {
    try {
      const wixconfig = this.getAttribute('wixconfig');
      const wixsettings = this.getAttribute('wixsettings');
      if (wixconfig) this._config = JSON.parse(wixconfig);
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {
      console.warn('KygoHiwPhaseDiscover: Could not parse Wix attributes', e);
    }
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

  static get observedAttributes() {
    return ['wixsettings'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'wixsettings') {
      this._parseWixAttributes();
      this.render();
    }
  }

  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --dark: #1E293B;
          --dark-card: #0f172a;
          --dark-surface: #1a2332;
          --light: #F8FAFC;
          --green: #22C55E;
          --green-dark: #16A34A;
          --green-light: rgba(34, 197, 94, 0.1);
          --green-glow: rgba(34, 197, 94, 0.3);
          --gray-50: #f9fafb;
          --gray-100: #F1F5F9;
          --gray-400: #94A3B8;
          --gray-600: #475569;
          --gray-700: #334155;
          --yellow: #FBBF24;
          
          display: block;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--gray-50);
          color: var(--dark);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        h2, h4 {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          line-height: 1.2;
        }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        .phase-section { padding: 64px 0; }

        .phase-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .phase-number {
          width: 48px;
          height: 48px;
          background: var(--green);
          color: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 20px;
          flex-shrink: 0;
        }

        .phase-label {
          font-size: 13px;
          color: var(--green);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .phase-title {
          font-size: clamp(26px, 6vw, 32px);
          color: var(--dark);
          margin-bottom: 8px;
        }

        .phase-time {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--gray-100);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          color: var(--gray-600);
          margin-bottom: 24px;
        }

        .phase-time svg { width: 14px; height: 14px; }

        .phase-content { display: grid; gap: 40px; }

        .phase-description {
          font-size: 17px;
          color: var(--gray-600);
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 560px;
        }

        .feature-list { display: flex; flex-direction: column; gap: 16px; }

        .feature-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          background: var(--green-light);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-icon svg {
          width: 20px;
          height: 20px;
          color: var(--green);
        }

        .feature-text h4 {
          font-size: 16px;
          color: var(--dark);
          margin-bottom: 2px;
        }

        .feature-text p {
          font-size: 14px;
          color: var(--gray-600);
          line-height: 1.5;
        }

        .immediate-value {
          background: linear-gradient(135deg, var(--dark), var(--gray-700));
          border-radius: 16px;
          padding: 20px 24px;
          margin-top: 24px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .immediate-value-icon {
          width: 44px;
          height: 44px;
          background: var(--green);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .immediate-value-icon svg {
          width: 22px;
          height: 22px;
          color: white;
        }

        .immediate-value-text { color: white; }

        .immediate-value-text span {
          font-size: 11px;
          color: var(--green);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .immediate-value-text p {
          font-size: 15px;
          margin-top: 2px;
        }

        .phase-visual {
          background: var(--dark);
          border-radius: 24px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .phase-visual::before {
          content: '';
          position: absolute;
          top: -30%;
          right: -20%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, var(--green-glow) 0%, transparent 70%);
          pointer-events: none;
        }

        .discover-demo { position: relative; z-index: 1; }

        .correlation-example {
          background: var(--dark-surface);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 12px;
          transition: all 0.3s;
        }

        .correlation-example:hover {
          border-color: var(--green);
          transform: translateX(4px);
        }

        .correlation-example-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .correlation-example-icon {
          width: 44px;
          height: 44px;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .correlation-example-icon svg {
          width: 22px;
          height: 22px;
          color: var(--green);
        }

        .correlation-example-content { flex: 1; min-width: 0; }

        .correlation-example-content strong {
          color: white;
          font-size: 15px;
          display: block;
          margin-bottom: 2px;
        }

        .correlation-example-content strong span {
          color: var(--green);
        }

        .correlation-example-content p {
          color: var(--gray-400);
          font-size: 13px;
        }

        .correlation-metrics {
          display: flex;
          gap: 16px;
        }

        .correlation-metric { flex: 1; }

        .correlation-metric-label {
          font-size: 10px;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .correlation-metric-bar {
          height: 6px;
          background: var(--gray-700);
          border-radius: 3px;
          overflow: hidden;
        }

        .correlation-metric-fill {
          height: 100%;
          background: var(--green);
          border-radius: 3px;
        }

        .correlation-metric-fill.medium {
          background: var(--yellow);
        }

        @media (min-width: 768px) {
          .phase-section { padding: 80px 0; }
          .phase-content {
            grid-template-columns: 1fr 1fr;
            align-items: center;
            gap: 64px;
          }
          .phase-visual { padding: 32px; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-on-scroll.delay-1 { transition-delay: 0.1s; }
        .animate-on-scroll.delay-2 { transition-delay: 0.2s; }
        .animate-on-scroll.delay-3 { transition-delay: 0.3s; }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 4px 20px rgba(34, 197, 94, 0.5); }
        }

        .animate-on-scroll.visible .phase-number {
          animation: pulse 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      </style>

      <section class="phase-section">
        <div class="container">
          <div class="phase-content">
            <div class="phase-info animate-on-scroll">
              <div class="phase-header">
                <div class="phase-number">3</div>
                <div class="phase-label">Phase Three</div>
              </div>
              <h2 class="phase-title">Discover your patterns</h2>
              <div class="phase-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Insights start at day 7
              </div>
              
              <p class="phase-description">
                After 7 days of logging both nutrition and wearable data, Kygo starts finding statistically significant correlations. We factor in outliers and calculate confidence levels—so you only see patterns we're sure about. The more you log, the more correlations you'll discover.
              </p>

              <div class="feature-list">
                <div class="feature-item">
                  <div class="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 5-6"/></svg>
                  </div>
                  <div class="feature-text">
                    <h4>Real correlations, not guesses</h4>
                    <p>We calculate confidence and strength for every pattern we find</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  </div>
                  <div class="feature-text">
                    <h4>Outliers filtered out</h4>
                    <p>One bad night doesn't skew your data—we account for anomalies</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                  </div>
                  <div class="feature-text">
                    <h4>More data, more correlations</h4>
                    <p>New patterns emerge as your dataset grows over time</p>
                  </div>
                </div>
              </div>

              <div class="immediate-value">
                <div class="immediate-value-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div class="immediate-value-text">
                  <span>The Payoff</span>
                  <p>"Your HRV improves 12% when you avoid sugar after 6pm"—that's YOUR body talking</p>
                </div>
              </div>
            </div>

            <div class="phase-visual animate-on-scroll delay-2">
              <div class="discover-demo">
                <div class="correlation-example">
                  <div class="correlation-example-header">
                    <div class="correlation-example-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    </div>
                    <div class="correlation-example-content">
                      <strong>Sleep latency <span>+8 min</span></strong>
                      <p>When you consume caffeine after 3pm</p>
                    </div>
                  </div>
                  <div class="correlation-metrics">
                    <div class="correlation-metric">
                      <div class="correlation-metric-label">Confidence</div>
                      <div class="correlation-metric-bar">
                        <div class="correlation-metric-fill" style="width: 85%;"></div>
                      </div>
                    </div>
                    <div class="correlation-metric">
                      <div class="correlation-metric-label">Strength</div>
                      <div class="correlation-metric-bar">
                        <div class="correlation-metric-fill" style="width: 72%;"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="correlation-example">
                  <div class="correlation-example-header">
                    <div class="correlation-example-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    </div>
                    <div class="correlation-example-content">
                      <strong>HRV <span>+12% average</span></strong>
                      <p>Days with no sugar after 6pm</p>
                    </div>
                  </div>
                  <div class="correlation-metrics">
                    <div class="correlation-metric">
                      <div class="correlation-metric-label">Confidence</div>
                      <div class="correlation-metric-bar">
                        <div class="correlation-metric-fill" style="width: 78%;"></div>
                      </div>
                    </div>
                    <div class="correlation-metric">
                      <div class="correlation-metric-label">Strength</div>
                      <div class="correlation-metric-bar">
                        <div class="correlation-metric-fill medium" style="width: 65%;"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="correlation-example">
                  <div class="correlation-example-header">
                    <div class="correlation-example-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                    </div>
                    <div class="correlation-example-content">
                      <strong>Deep sleep <span>+23 min</span></strong>
                      <p>High protein dinners (40g+)</p>
                    </div>
                  </div>
                  <div class="correlation-metrics">
                    <div class="correlation-metric">
                      <div class="correlation-metric-label">Confidence</div>
                      <div class="correlation-metric-bar">
                        <div class="correlation-metric-fill medium" style="width: 68%;"></div>
                      </div>
                    </div>
                    <div class="correlation-metric">
                      <div class="correlation-metric-label">Strength</div>
                      <div class="correlation-metric-bar">
                        <div class="correlation-metric-fill" style="width: 71%;"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('kygo-hiw-phase-discover', KygoHiwPhaseDiscover);


/**
 * Kygo Health - Timeline Section (Your First Two Weeks)
 * Tag name: kygo-hiw-timeline
 */

class KygoHiwTimeline extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._setupScrollAnimations();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  _parseWixAttributes() {
    try {
      const wixconfig = this.getAttribute('wixconfig');
      const wixsettings = this.getAttribute('wixsettings');
      if (wixconfig) this._config = JSON.parse(wixconfig);
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {
      console.warn('KygoHiwTimeline: Could not parse Wix attributes', e);
    }
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

  static get observedAttributes() {
    return ['wixsettings'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'wixsettings') {
      this._parseWixAttributes();
      this.render();
    }
  }

  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --dark: #1E293B;
          --light: #F8FAFC;
          --green: #22C55E;
          --green-glow: rgba(34, 197, 94, 0.3);
          --gray-400: #94A3B8;
          --gray-700: #334155;
          
          display: block;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, var(--dark) 0%, var(--gray-700) 100%);
          color: white;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          position: relative;
          overflow: hidden;
        }

        :host::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        h2, h3 {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          line-height: 1.2;
        }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        .timeline-section { padding: 64px 0; position: relative; z-index: 1; }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-header h2 {
          color: white;
          font-size: clamp(28px, 7vw, 36px);
          margin-bottom: 12px;
        }

        .section-header p {
          color: var(--gray-400);
          font-size: 17px;
          max-width: 500px;
          margin: 0 auto;
        }

        .timeline-track {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
        }

        .timeline-line {
          display: none;
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gray-700);
          transform: translateY(-50%);
          border-radius: 2px;
        }

        .timeline-line-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: var(--green);
          border-radius: 2px;
          width: 100%;
        }

        .timeline-items {
          display: grid;
          gap: 20px;
        }

        .timeline-item {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s;
        }

        .timeline-item:hover {
          background: rgba(255,255,255,0.08);
          border-color: var(--green);
          transform: translateY(-4px);
        }

        .timeline-item.active {
          border-color: var(--green);
          box-shadow: 0 0 30px var(--green-glow);
        }

        .timeline-day {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: var(--green);
          color: white;
          border-radius: 50%;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .timeline-item h3 {
          color: white;
          font-size: 18px;
          margin-bottom: 8px;
        }

        .timeline-item p {
          color: var(--gray-400);
          font-size: 14px;
          line-height: 1.6;
        }

        .timeline-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-top: 16px;
        }

        .timeline-feature {
          background: rgba(34, 197, 94, 0.15);
          color: var(--green);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        @media (min-width: 768px) {
          .timeline-section { padding: 80px 0; }
          .timeline-line { display: none; }
          .timeline-items {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-on-scroll.delay-1 { transition-delay: 0.15s; }
        .animate-on-scroll.delay-2 { transition-delay: 0.3s; }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      </style>

      <section class="timeline-section">
        <div class="container">
          <div class="section-header animate-on-scroll">
            <h2>Your first two weeks</h2>
            <p>You get value from day one—correlations are the bonus</p>
          </div>

          <div class="timeline-track">
            <div class="timeline-line">
              <div class="timeline-line-fill"></div>
            </div>
            
            <div class="timeline-items">
              <div class="timeline-item animate-on-scroll">
                <div class="timeline-day">Day 1</div>
                <h3>Value right away</h3>
                <p>See unified health trends from all your devices. Track detailed nutrition with full macro and micro breakdowns. Log your weight.</p>
                <div class="timeline-features">
                  <span class="timeline-feature">Health trends</span>
                  <span class="timeline-feature">Calorie & macro tracking</span>
                  <span class="timeline-feature">Micronutrients</span>
                </div>
              </div>

              <div class="timeline-item animate-on-scroll delay-1 active">
                <div class="timeline-day">Day 7</div>
                <h3>First correlations</h3>
                <p>With a week of nutrition and wearable data, Kygo starts identifying patterns between what you eat and how your body responds.</p>
                <div class="timeline-features">
                  <span class="timeline-feature">Pattern detection</span>
                  <span class="timeline-feature">Initial correlations</span>
                  <span class="timeline-feature">Personalized to you</span>
                </div>
              </div>

              <div class="timeline-item animate-on-scroll delay-2">
                <div class="timeline-day">Day 14+</div>
                <h3>Higher confidence</h3>
                <p>More data means stronger correlations and new patterns. The more you put in, the more you get out.</p>
                <div class="timeline-features">
                  <span class="timeline-feature">Stronger confidence</span>
                  <span class="timeline-feature">More correlations</span>
                  <span class="timeline-feature">Deeper patterns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('kygo-hiw-timeline', KygoHiwTimeline);


/**
 * Kygo Health - Objections Section (Built for Real Life)
 * Tag name: kygo-hiw-objections
 */

class KygoHiwObjections extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._setupScrollAnimations();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  _parseWixAttributes() {
    try {
      const wixconfig = this.getAttribute('wixconfig');
      const wixsettings = this.getAttribute('wixsettings');
      if (wixconfig) this._config = JSON.parse(wixconfig);
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {
      console.warn('KygoHiwObjections: Could not parse Wix attributes', e);
    }
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

  static get observedAttributes() {
    return ['wixsettings'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'wixsettings') {
      this._parseWixAttributes();
      this.render();
    }
  }

  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --dark: #1E293B;
          --light: #F8FAFC;
          --green: #22C55E;
          --green-light: rgba(34, 197, 94, 0.1);
          --gray-50: #f9fafb;
          --gray-200: #E2E8F0;
          --gray-600: #475569;
          
          display: block;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: white;
          color: var(--dark);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        h2, h3 {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          line-height: 1.2;
        }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        .objections-section { padding: 64px 0; }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-header h2 {
          font-size: clamp(28px, 7vw, 36px);
          color: var(--dark);
          margin-bottom: 12px;
        }

        .section-header p {
          color: var(--gray-600);
          font-size: 17px;
        }

        .objections-grid {
          display: grid;
          gap: 24px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .objection-card {
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: 20px;
          padding: 28px;
          display: grid;
          gap: 24px;
          transition: all 0.3s;
        }

        .objection-card:hover {
          border-color: var(--green);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }

        .objection-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .objection-icon {
          width: 56px;
          height: 56px;
          background: var(--green-light);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .objection-icon svg {
          width: 28px;
          height: 28px;
          color: var(--green);
        }

        .objection-header h3 {
          font-size: 20px;
          color: var(--dark);
        }

        .objection-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .objection-point {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .objection-point svg {
          width: 20px;
          height: 20px;
          color: var(--green);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .objection-point p {
          font-size: 15px;
          color: var(--gray-600);
          line-height: 1.6;
        }

        .objection-point strong {
          color: var(--dark);
        }

        @media (min-width: 768px) {
          .objections-section { padding: 80px 0; }
          .objections-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .objection-card {
            display: flex;
            flex-direction: column;
            padding: 32px;
          }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-on-scroll.delay-1 { transition-delay: 0.1s; }
        .animate-on-scroll.delay-2 { transition-delay: 0.2s; }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      </style>

      <section class="objections-section">
        <div class="container">
          <div class="section-header animate-on-scroll">
            <h2>Built for real life</h2>
            <p>We know you've tried tracking before. Here's why this time is different.</p>
          </div>

          <div class="objections-grid">
            <div class="objection-card animate-on-scroll">
              <div class="objection-header">
                <div class="objection-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h3>Your data stays yours</h3>
              </div>
              <div class="objection-content">
                <div class="objection-point">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                  <p><strong>Encrypted and never sold.</strong> We exist to help you understand your health, not monetize your information.</p>
                </div>
                <div class="objection-point">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                  <p><strong>Export or delete anytime.</strong> Your data, your control.</p>
                </div>
              </div>
            </div>

            <div class="objection-card animate-on-scroll delay-1">
              <div class="objection-header">
                <div class="objection-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <h3>Seconds, not minutes</h3>
              </div>
              <div class="objection-content">
                <div class="objection-point">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                  <p><strong>Photo, voice, barcode, or text.</strong> Whatever's fastest in the moment.</p>
                </div>
                <div class="objection-point">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                  <p><strong>Templates learn your habits.</strong> Logging gets easier over time, not harder.</p>
                </div>
              </div>
            </div>

            <div class="objection-card animate-on-scroll delay-2">
              <div class="objection-header">
                <div class="objection-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                </div>
                <h3>Actually accurate</h3>
              </div>
              <div class="objection-content">
                <div class="objection-point">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                  <p><strong>Photo recognition that works.</strong> Identifies every ingredient down to the garnishes.</p>
                </div>
                <div class="objection-point">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                  <p><strong>5M+ foods in our database.</strong> Correlations backed by real statistical analysis.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('kygo-hiw-objections', KygoHiwObjections);


/**
 * Kygo Health - Final CTA Section
 * Tag name: kygo-hiw-final-cta
 */

class KygoHiwFinalCta extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._setupScrollAnimations();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  _parseWixAttributes() {
    try {
      const wixconfig = this.getAttribute('wixconfig');
      const wixsettings = this.getAttribute('wixsettings');
      if (wixconfig) this._config = JSON.parse(wixconfig);
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {
      console.warn('KygoHiwFinalCta: Could not parse Wix attributes', e);
    }
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

  static get observedAttributes() {
    return ['wixsettings', 'cta-link', 'app-store-url'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this._parseWixAttributes();
    this.render();
  }

  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }

  render() {
    const ctaLink = this._getSetting('cta-link', 'https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589') || this._getSetting('app-store-url', 'https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --light: #F8FAFC;
          --green: #22C55E;
          --green-dark: #16A34A;
          --gray-50: #f9fafb;
          
          display: block;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--gray-50);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        h2 {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          line-height: 1.2;
        }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        .final-cta { padding: 64px 0; }

        .final-cta-inner {
          background: linear-gradient(135deg, var(--green), var(--green-dark));
          border-radius: 24px;
          padding: 48px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .final-cta-inner::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .final-cta-content {
          position: relative;
          z-index: 1;
        }

        .final-cta h2 {
          font-size: clamp(28px, 7vw, 36px);
          color: white;
          margin-bottom: 12px;
        }

        .final-cta-content > p {
          color: rgba(255,255,255,0.85);
          margin-bottom: 28px;
          font-size: 17px;
        }

        .cta-primary {
          background: white;
          color: var(--green-dark);
          padding: 16px 28px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }

        .cta-primary:hover {
          background: var(--light);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .cta-primary svg {
          width: 18px;
          height: 18px;
        }

        .risk-reversal {
          margin-top: 20px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (min-width: 768px) {
          .final-cta { padding: 80px 0; }
          .final-cta-inner { padding: 64px 48px; }
          .final-cta h2 { font-size: 44px; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      </style>

      <section class="final-cta">
        <div class="container">
          <div class="final-cta-inner animate-on-scroll">
            <div class="final-cta-content">
              <h2>Ready to understand your body?</h2>
              <p>Stop guessing. Start seeing the correlations between what you eat and how you feel.</p>
              
              <a href="${ctaLink}" class="cta-primary" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download Free on iOS
              </a>
              
              <p class="risk-reversal">
                <span>Free forever plan</span>
                <span>•</span>
                <span>No credit card required</span>
                <span>•</span>
                <span>Correlations free for 14 days</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('kygo-hiw-final-cta', KygoHiwFinalCta);
