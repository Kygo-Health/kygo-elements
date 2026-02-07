/**
 * Kygo Health - Combined Custom Elements Bundle
 * All 7 elements in one file for faster loading
 * Host on GitHub + jsDelivr CDN
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

/* ========================================
   1. KYGO HERO SECTION
   Tag: kygo-hero-section
======================================== */
class KygoHeroSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.render();
    this.setupEvents();
    __seo(this, 'Kygo Health \u2014 See how your food affects your sleep, energy, and recovery. Track nutrition alongside wearable data with the free Kygo app for iOS.');
  }
  setupEvents() {
    const androidBtn = this.shadowRoot.querySelector('.cta-android');
    const secondaryBtn = this.shadowRoot.querySelector('.cta-secondary');
    const modal = this.shadowRoot.querySelector('.android-modal');
    const closeBtn = this.shadowRoot.querySelector('.modal-close');
    const form = this.shadowRoot.querySelector('.android-form');
    
    if (secondaryBtn) {
      secondaryBtn.addEventListener('click', e => {
        e.preventDefault();
        const target = parent.document.getElementById('kygo-features-section');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.parent.location.hash = 'kygo-features-section';
        }
      });
    }

    if (androidBtn) androidBtn.addEventListener('click', e => { e.preventDefault(); modal.classList.add('active'); });
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });
    
    if (form) form.addEventListener('submit', e => {
      e.preventDefault();
      const email = form.querySelector('input').value;
      if (email) {
        this.dispatchEvent(new CustomEvent('android-signup', { detail: { email }, bubbles: true, composed: true }));
        form.innerHTML = '<p class="success-msg">You\'re on the list! 🎉</p>';
        setTimeout(() => modal.classList.remove('active'), 2000);
      }
    });
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host{--dark:#1E293B;--dark-card:#0f172a;--dark-surface:#1a2332;--light:#F8FAFC;--green:#22C55E;--green-dark:#16A34A;--green-glow:rgba(34,197,94,0.3);--gray-400:#94A3B8;--gray-600:#475569;--gray-700:#334155;display:block;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:var(--light);color:var(--dark);line-height:1.6;-webkit-font-smoothing:antialiased}
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        h1{font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:600;line-height:1.2}
        .container{max-width:1200px;margin:0 auto;padding:0 20px}
        .hero{padding:32px 0 48px;overflow:hidden}
        .hero-content{display:flex;flex-direction:column;gap:32px}
        .hero-copy{text-align:center}
        .hero h1{font-size:clamp(28px,7vw,36px);margin-bottom:16px;color:var(--dark)}
        .hero h1 .highlight{color:var(--green)}
        .hero-subheadline{font-size:clamp(16px,4vw,18px);color:var(--gray-600);margin-bottom:24px;max-width:480px;margin-left:auto;margin-right:auto;line-height:1.7}
        .cta-container{display:flex;flex-direction:column;align-items:center;gap:16px}
        .cta-group-top{display:flex;flex-direction:column;gap:12px;width:100%;align-items:center}
        .cta-primary{background:var(--green);color:white;padding:14px 24px;border-radius:12px;font-weight:600;font-size:15px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;border:none;cursor:pointer;width:100%;max-width:260px}
        .cta-primary:hover{background:var(--green-dark);transform:translateY(-2px);box-shadow:0 10px 20px rgba(34,197,94,0.3)}
        .cta-primary svg{width:18px;height:18px;flex-shrink:0}
        .cta-secondary{background:none;border:none;color:var(--gray-600);font-weight:500;font-size:14px;text-decoration:none;text-underline-offset:4px;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:all .2s;cursor:pointer;padding:8px 0}
        .cta-secondary:hover{color:var(--dark);text-decoration-color:var(--green)}
        .cta-secondary svg{width:16px;height:16px;transition:transform .2s}
        .cta-secondary:hover svg{transform:translateX(3px)}
        .risk-reversal{font-size:13px;color:var(--gray-400);display:flex;align-items:center;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:8px}
        .risk-reversal span{white-space:nowrap}
        .cta-android{background:transparent;color:var(--gray-600);padding:12px 20px;border-radius:10px;font-weight:500;font-size:14px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;border:1.5px solid #E2E8F0;cursor:pointer;width:100%;max-width:260px}
        .cta-android:hover{border-color:var(--dark);color:var(--dark);background:rgba(0,0,0,0.02)}
        .cta-android svg{width:16px;height:16px}
        .android-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;visibility:hidden;transition:all .3s}
        .android-modal.active{opacity:1;visibility:visible}
        .modal-content{background:white;border-radius:20px;padding:32px;max-width:380px;width:90%;text-align:center;position:relative;transform:scale(0.9);transition:transform .3s}
        .android-modal.active .modal-content{transform:scale(1)}
        .modal-close{position:absolute;top:12px;right:12px;background:none;border:none;font-size:24px;cursor:pointer;color:var(--gray-400);line-height:1}
        .modal-close:hover{color:var(--dark)}
        .modal-icon{width:48px;height:48px;background:linear-gradient(135deg,#3DDC84,#00A36C);border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
        .modal-icon svg{width:28px;height:28px;color:white}
        .modal-content h3{font-family:'Space Grotesk',sans-serif;font-size:22px;margin-bottom:8px;color:var(--dark)}
        .modal-content p{color:var(--gray-600);font-size:14px;margin-bottom:20px;line-height:1.5}
        .android-form{display:flex;flex-direction:column;gap:12px}
        .android-form input{padding:14px 16px;border:1px solid #E2E8F0;border-radius:10px;font-size:15px;font-family:inherit;outline:none;transition:border-color .2s}
        .android-form input:focus{border-color:var(--green)}
        .android-form button{background:var(--green);color:white;border:none;padding:14px;border-radius:10px;font-weight:600;font-size:15px;cursor:pointer;transition:background .2s}
        .android-form button:hover{background:var(--green-dark)}
        .success-msg{color:var(--green);font-weight:600;padding:20px 0}
        .hero-demo{display:flex;flex-direction:column;align-items:center;perspective:1000px}
        .app-demo-container{position:relative;width:100%;max-width:300px}
        .phone-frame{background:var(--dark);border-radius:36px;padding:10px;box-shadow:0 25px 50px rgba(30,41,59,0.3),0 0 0 1px rgba(255,255,255,0.1) inset}
        .phone-screen{background:var(--dark-card);border-radius:28px;overflow:hidden;aspect-ratio:9/19}
        .app-ui{height:100%;display:flex;flex-direction:column;padding:14px 12px}
        .app-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
        .app-logo{display:flex;align-items:center;gap:6px;color:white;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px}
        .app-logo img{width:20px;height:20px;border-radius:4px}
        .app-time{color:var(--gray-400);font-size:10px}
        .insight-card{background:var(--dark-surface);border-radius:12px;padding:12px;margin-bottom:8px;border:1px solid rgba(255,255,255,0.05);animation:slideUp .6s ease-out forwards}
        .insight-card.highlight{border:1px solid var(--green);box-shadow:0 0 16px var(--green-glow)}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .insight-label{display:flex;align-items:center;gap:5px;color:var(--green);font-size:8px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
        .insight-label svg{width:10px;height:10px}
        .insight-title{color:white;font-size:11px;font-weight:500;line-height:1.4;margin-bottom:8px}
        .insight-title strong{color:var(--green)}
        .insight-chart{display:flex;align-items:flex-end;gap:3px;height:32px;margin-bottom:6px}
        .chart-bar{flex:1;background:var(--gray-700);border-radius:2px;animation:barGrow .8s ease-out forwards;animation-delay:calc(var(--i)*.08s);transform-origin:bottom}
        .chart-bar.active{background:var(--green)}
        @keyframes barGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
        .insight-meta{display:flex;justify-content:space-between;color:var(--gray-400);font-size:8px}
        .chat-exchange{animation:slideUp .6s ease-out .15s forwards;opacity:0;display:flex;flex-direction:column;gap:6px;margin-bottom:8px}
        .advisor-bubble{background:var(--dark-surface);border-radius:12px 12px 12px 4px;padding:8px 10px;border:1px solid rgba(34,197,94,0.15);max-width:85%;align-self:flex-start}
        .advisor-bubble .advisor-label{display:flex;align-items:center;gap:4px;color:var(--green);font-size:7px;font-weight:600;margin-bottom:3px}
        .advisor-bubble .advisor-label svg{width:9px;height:9px}
        .advisor-bubble p{color:white;font-size:10px;line-height:1.4}
        .user-message{align-self:flex-end;background:var(--gray-700);color:white;padding:8px 10px;border-radius:12px 12px 4px 12px;font-size:10px;max-width:80%}
        .advisor-response{background:var(--dark-surface);border-radius:12px;padding:10px;border:1px solid rgba(34,197,94,0.2);align-self:flex-start;max-width:95%}
        .advisor-label{display:flex;align-items:center;gap:4px;color:var(--green);font-size:7px;font-weight:600;margin-bottom:6px}
        .advisor-label svg{width:9px;height:9px}
        .food-items-row{display:flex;gap:5px}
        .food-chip{flex:1;background:rgba(255,255,255,0.05);border-radius:6px;padding:6px;display:flex;align-items:center;gap:4px;font-size:9px;color:white;font-weight:500}
        .food-emoji{font-size:12px}
        .chip-cal{margin-left:auto;color:var(--green);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:10px}
        .meal-footer{display:flex;justify-content:center;margin-top:6px}
        .meal-card{background:var(--dark-surface);border-radius:8px;padding:6px 12px;display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,0.05)}
        .meal-total{display:flex;align-items:baseline;gap:2px}
        .meal-total-cal{color:white;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px}
        .meal-total-label{color:var(--gray-400);font-size:8px}
        .log-meal-btn{background:var(--green);color:white;border:none;border-radius:6px;padding:5px 10px;font-size:9px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;white-space:nowrap}
        .input-bar{margin-top:auto;background:var(--dark-surface);border-radius:10px;padding:8px 10px;display:flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,0.05);animation:slideUp .6s ease-out .3s forwards;opacity:0}
        .input-placeholder{flex:1;color:var(--gray-400);font-size:11px}
        .input-actions{display:flex;gap:5px}
        .input-action{width:26px;height:26px;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--green);cursor:pointer}
        .input-action svg{width:12px;height:12px}
        .floating-badge{position:absolute;background:white;border-radius:10px;padding:8px 12px;box-shadow:0 8px 24px rgba(0,0,0,0.12);display:flex;align-items:center;gap:8px;font-size:11px;font-weight:500;color:var(--dark);animation:float 3s ease-in-out infinite;z-index:10}
        .floating-badge.top-left{top:8%;left:-8px}
        .floating-badge.top-right{top:22%;right:-8px;animation-delay:1s}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .badge-icon{width:24px;height:24px;overflow:hidden;flex-shrink:0}
        .badge-icon img{width:100%;height:100%;object-fit:cover}
        .badge-icon.rounded{border-radius:5px}
        .patent-notice{text-align:center;margin-top:16px;font-size:11px;color:var(--gray-400);letter-spacing:0.5px;text-transform:uppercase}
        @media(min-width:768px){
          .hero{padding:60px 0 80px}
          .hero-content{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
          .hero-copy{text-align:left;order:1}
          .hero-demo{order:2}
          .hero h1{font-size:clamp(36px,5vw,48px)}
          .hero-subheadline{margin-left:0;margin-right:0}
          .cta-container{align-items:flex-start}
          .cta-group-top{flex-direction:row;justify-content:flex-start;align-items:center}
          .cta-primary{width:auto}
          .cta-secondary{padding:0}
          .risk-reversal{justify-content:flex-start}
        }
      </style>
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <div class="hero-copy">
              <h1>See how your food affects your <span class="highlight">sleep, energy, and recovery</span></h1>
              <p class="hero-subheadline">Kygo connects your wearables with nutrition tracking to reveal personalized correlations—so you can stop guessing and start understanding your body.</p>
              <div class="cta-container">
                <div class="cta-group-top">
                  <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" target="_blank" class="cta-primary">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    Download Free on iOS
                  </a>
                  <a href="#kygo-features-section" class="cta-secondary">
                    See how it works
                    <svg viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  </a>
                </div>
                <p class="risk-reversal"><span>2-min setup</span><span>•</span><span>Free forever plan</span><span>•</span><span>No credit card</span></p>
                <button class="cta-android">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                  Android Free Beta
                </button>
              </div>
            </div>
            <div class="hero-demo">
              <div class="app-demo-container">
                <div class="floating-badge top-left">
                  <div class="badge-icon rounded"><img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura"></div>
                  <span>Oura synced</span>
                </div>
                <div class="floating-badge top-right">
                  <div class="badge-icon"><img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple Health"></div>
                  <span>Health connected</span>
                </div>
                <div class="phone-frame">
                  <div class="phone-screen">
                    <div class="app-ui">
                      <div class="app-header">
                        <div class="app-logo">
                          <img src="https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png" alt="Kygo">
                          Kygo
                        </div>
                        <span class="app-time">Today</span>
                      </div>
                      <div class="insight-card highlight">
                        <div class="insight-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>New Insight</div>
                        <p class="insight-title">Your <strong>deep sleep decreases 18 min</strong> when you consume over 250g carbs daily</p>
                        <div class="insight-chart">
                          <div class="chart-bar" style="height:45%;--i:0"></div>
                          <div class="chart-bar" style="height:60%;--i:1"></div>
                          <div class="chart-bar active" style="height:90%;--i:2"></div>
                          <div class="chart-bar active" style="height:85%;--i:3"></div>
                          <div class="chart-bar" style="height:50%;--i:4"></div>
                          <div class="chart-bar" style="height:40%;--i:5"></div>
                          <div class="chart-bar" style="height:35%;--i:6"></div>
                        </div>
                        <div class="insight-meta"><span>Based on 14 days</span><span>High confidence</span></div>
                      </div>
                      <div class="chat-exchange">
                        <div class="advisor-bubble">
                          <div class="advisor-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>Kygo Advisor</div>
                          <p>What's cooking for breakfast?</p>
                        </div>
                        <div class="user-message">2 pancakes with syrup</div>
                        <div class="advisor-response">
                          <div class="advisor-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>Kygo Advisor</div>
                          <div class="food-items-row">
                            <div class="food-chip"><span class="food-emoji">🥞</span><span>Pancakes</span><span class="chip-cal">296</span></div>
                            <div class="food-chip"><span class="food-emoji">🍯</span><span>Syrup</span><span class="chip-cal">104</span></div>
                          </div>
                        </div>
                        <div class="meal-footer">
                          <div class="meal-card">
                            <div class="meal-total"><span class="meal-total-cal">400</span><span class="meal-total-label">cal</span></div>
                            <button class="log-meal-btn">Log Meal</button>
                          </div>
                        </div>
                      </div>
                      <div class="input-bar">
                        <span class="input-placeholder">What did you eat?</span>
                        <div class="input-actions">
                          <button class="input-action"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z"/></svg></button>
                          <button class="input-action"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p class="patent-notice">Patent Pending Technology</p>
            </div>
          </div>
        </div>
      </section>
      <div class="android-modal">
        <div class="modal-content">
          <button class="modal-close">×</button>
          <div class="modal-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg></div>
          <h3>Android Beta Coming Soon</h3>
          <p>Be first to know when Kygo launches on Android. Join our free beta waitlist!</p>
          <form class="android-form">
            <input type="email" placeholder="Enter your email" required>
            <button type="submit">Join Free Beta</button>
          </form>
        </div>
      </div>
    `;
  }
}
customElements.define('kygo-hero-section', KygoHeroSection);


/* ========================================
   2. KYGO SOCIAL PROOF SECTION
   Tag: kygo-social-proof-section
======================================== */
class KygoSocialProofSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }
  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    __seo(this, 'Kygo Health \u2014 Trusted by health-conscious individuals tracking how nutrition impacts their wellness metrics.');
  }
  _parseWixAttributes() {
    try {
      const wixsettings = this.getAttribute('wixsettings');
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {}
  }
  static get observedAttributes() { return ['wixsettings']; }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this._parseWixAttributes();
    this.render();
  }
  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }
  render() {
    const stat1Number = this._getSetting('stat1-number', '5M+');
    const stat1Label = this._getSetting('stat1-label', 'Foods in Database');
    const stat2Number = this._getSetting('stat2-number', '1000s');
    const stat2Label = this._getSetting('stat2-label', 'Possible Correlations');
    const stat3Number = this._getSetting('stat3-number', '2 min');
    const stat3Label = this._getSetting('stat3-label', 'Setup Time');
    this.shadowRoot.innerHTML = `
      <style>
        :host{--dark:#1E293B;--green:#22C55E;--gray-400:#94A3B8;display:block;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased}
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        .social-proof{background:var(--dark);padding:24px 0}
        .container{max-width:1200px;margin:0 auto;padding:0 20px}
        .social-proof-inner{display:flex;flex-direction:column;align-items:center;gap:20px}
        .stats-bar{display:flex;justify-content:center;gap:24px;flex-wrap:wrap}
        .stat-item{text-align:center;min-width:80px;opacity:0;animation:fadeInUp 0.5s ease-out forwards}
        .stat-item:nth-child(1){animation-delay:0.1s}
        .stat-item:nth-child(2){animation-delay:0.2s}
        .stat-item:nth-child(3){animation-delay:0.3s}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .stat-number{font-family:'Space Grotesk',-apple-system,sans-serif;font-size:22px;font-weight:700;color:var(--green);line-height:1.2}
        .stat-label{font-size:11px;color:var(--gray-400);margin-top:2px;line-height:1.3}
        .device-logos{display:flex;gap:12px;align-items:center;flex-wrap:wrap;justify-content:center;opacity:0;animation:fadeInUp 0.5s ease-out 0.4s forwards}
        .device-logos-label{color:var(--gray-400);font-size:11px}
        .device-logo-item{width:32px;height:32px;background:rgba(255,255,255,0.08);border-radius:8px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;cursor:pointer;overflow:hidden}
        .device-logo-item:hover{background:rgba(255,255,255,0.15);transform:scale(1.08)}
        .device-logo-item img{width:20px;height:20px;object-fit:contain;border-radius:4px;opacity:0.7;transition:opacity 0.2s}
        .device-logo-item:hover img{opacity:1}
        @media(min-width:768px){
          .social-proof{padding:28px 0}
          .social-proof-inner{flex-direction:row;justify-content:space-between}
          .stats-bar{gap:48px}
          .stat-number{font-size:26px}
          .stat-label{font-size:12px}
          .device-logos{gap:16px}
          .device-logo-item{width:36px;height:36px}
          .device-logo-item img{width:22px;height:22px;border-radius:5px}
        }
      </style>
      <section class="social-proof">
        <div class="container">
          <div class="social-proof-inner">
            <div class="stats-bar">
              <div class="stat-item"><div class="stat-number">${stat1Number}</div><div class="stat-label">${stat1Label}</div></div>
              <div class="stat-item"><div class="stat-number">${stat2Number}</div><div class="stat-label">${stat2Label}</div></div>
              <div class="stat-item"><div class="stat-number">${stat3Number}</div><div class="stat-label">${stat3Label}</div></div>
            </div>
            <div class="device-logos">
              <span class="device-logos-label">Works with:</span>
              <div class="device-logo-item" title="Oura Ring"><img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura Ring"></div>
              <div class="device-logo-item" title="Apple Health"><img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple Health"></div>
              <div class="device-logo-item" title="Fitbit"><img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit"></div>
              <div class="device-logo-item" title="Garmin"><img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin"></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('kygo-social-proof-section', KygoSocialProofSection);


/* ========================================
   3. KYGO PROBLEM SECTION
   Tag: kygo-problem-section
======================================== */
class KygoProblemSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }
  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    __seo(this, 'Stop guessing how food affects your body. Kygo Health uses AI to connect your nutrition data with wearable health insights for personalized recommendations.');
  }
  _parseWixAttributes() {
    try {
      const wixsettings = this.getAttribute('wixsettings');
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {}
  }
  static get observedAttributes() { return ['wixsettings', 'headline', 'subheadline']; }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this._parseWixAttributes();
    this.render();
  }
  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }
  render() {
    const headline = this._getSetting('headline', "There's a better way to understand your health");
    const subheadline = this._getSetting('subheadline', "Your wearable shows what's happening. We show you why.");
    this.shadowRoot.innerHTML = `
      <style>
        :host{--dark:#1E293B;--green:#22C55E;--green-dark:#16A34A;--gray-100:#F1F5F9;--gray-200:#E2E8F0;--gray-400:#94A3B8;--gray-600:#475569;display:block;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.6}
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        h2{font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:600;line-height:1.2}
        .problem-section{padding:48px 0;background:white}
        .container{max-width:1200px;margin:0 auto;padding:0 20px}
        .section-header{text-align:center;margin-bottom:32px;opacity:0;animation:fadeInUp 0.6s ease-out forwards}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .section-header h2{font-size:24px;margin-bottom:8px;color:var(--dark)}
        .section-header p{color:var(--gray-600);font-size:15px;max-width:500px;margin:0 auto}
        .comparison-grid{display:grid;gap:16px;max-width:900px;margin:0 auto}
        .comparison-column{padding:24px;border-radius:20px;opacity:0;animation:fadeInUp 0.6s ease-out forwards;transition:all 0.3s ease}
        .comparison-column.old-way{background:var(--gray-100);animation-delay:0.1s}
        .comparison-column.new-way{background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.02));border:2px solid var(--green);animation-delay:0.2s}
        .comparison-column h3{font-family:'Space Grotesk',-apple-system,sans-serif;font-size:15px;font-weight:600;margin-bottom:16px;display:flex;align-items:center;gap:10px;line-height:1.3}
        .comparison-column.old-way h3{color:var(--gray-600)}
        .comparison-column.new-way h3{color:var(--green-dark)}
        .comparison-column h3 svg{flex-shrink:0}
        .comparison-list{list-style:none;display:grid;gap:12px}
        .comparison-list li{font-size:14px;display:flex;align-items:flex-start;gap:10px;line-height:1.5}
        .comparison-list li svg{flex-shrink:0;margin-top:6px}
        .comparison-list li strong{color:var(--dark);font-weight:600}
        .comparison-list li span{color:var(--gray-600)}
        .comparison-column:hover{transform:translateY(-4px)}
        .comparison-column.old-way:hover{box-shadow:0 8px 24px rgba(0,0,0,0.08)}
        .comparison-column.new-way:hover{box-shadow:0 8px 24px rgba(34,197,94,0.15)}
        @media(min-width:768px){
          .problem-section{padding:60px 0}
          .section-header{margin-bottom:40px}
          .section-header h2{font-size:32px}
          .section-header p{font-size:16px}
          .comparison-grid{grid-template-columns:1fr 1fr;gap:24px}
          .comparison-column{padding:28px}
          .comparison-column h3{font-size:16px}
        }
        @media(min-width:1024px){
          .problem-section{padding:80px 0}
          .section-header h2{font-size:36px}
          .comparison-column{padding:32px}
          .comparison-list li{font-size:15px}
        }
      </style>
      <section class="problem-section">
        <div class="container">
          <div class="section-header">
            <h2>${headline}</h2>
            <p>${subheadline}</p>
          </div>
          <div class="comparison-grid">
            <div class="comparison-column old-way">
              <h3>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#94A3B8" stroke-width="2"/><path d="M8 8l8 8M16 8l-8 8" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/></svg>
                The Old Way
              </h3>
              <ul class="comparison-list">
                <li><svg width="6" height="6" fill="#94A3B8"><circle cx="3" cy="3" r="3"/></svg><span><strong>Wearable shows your HRV is down</strong> — but not why</span></li>
                <li><svg width="6" height="6" fill="#94A3B8"><circle cx="3" cy="3" r="3"/></svg><span><strong>Food Loggers tracks calories</strong> — can't connect to how you feel</span></li>
                <li><svg width="6" height="6" fill="#94A3B8"><circle cx="3" cy="3" r="3"/></svg><span><strong>Generic health advice</strong> — not personalized to your body</span></li>
              </ul>
            </div>
            <div class="comparison-column new-way">
              <h3>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#22C55E" stroke-width="2"/><path d="M8 12l3 3 5-6" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                The Kygo Way
              </h3>
              <ul class="comparison-list">
                <li><svg width="6" height="6" fill="#22C55E"><circle cx="3" cy="3" r="3"/></svg><span><strong>See cause-and-effect</strong> — correlations from YOUR data</span></li>
                <li><svg width="6" height="6" fill="#22C55E"><circle cx="3" cy="3" r="3"/></svg><span><strong>Log meals in seconds</strong> — with AI assisted logging</span></li>
                <li><svg width="6" height="6" fill="#22C55E"><circle cx="3" cy="3" r="3"/></svg><span><strong>All devices, one place</strong> — sleep from Oura, activity from Apple</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('kygo-problem-section', KygoProblemSection);


/* ========================================
   4. KYGO FEATURES SECTION
   Tag: kygo-features-section
======================================== */
class KygoFeaturesSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
    this._observer = null;
  }
  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._setupIntersectionObserver();
    __seo(this, 'Kygo Health Features \u2014 AI food logging, wearable sync with Apple Watch, Oura Ring, and WHOOP. Nutrition insights, health score tracking, and personalized recommendations.');
  }
  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }
  _parseWixAttributes() {
    try {
      const wixsettings = this.getAttribute('wixsettings');
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {}
  }
  static get observedAttributes() { return ['wixsettings']; }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this._parseWixAttributes();
    this.render();
    this._setupIntersectionObserver();
  }
  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }
  _setupIntersectionObserver() {
    requestAnimationFrame(() => {
      const cards = this.shadowRoot.querySelectorAll('.animate-on-scroll');
      if (!cards.length) return;
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), index * 100);
          }
        });
      }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
      cards.forEach(card => this._observer.observe(card));
    });
  }
  render() {
    const sectionTitle = this._getSetting('section-title', 'From guessing to knowing');
    const sectionSubtitle = this._getSetting('section-subtitle', 'Track nutrition, sync your wearables, discover what works for your body.');
    const appleIcon = 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png';
    const ouraIcon = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const fitbitIcon = 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png';
    const garminIcon = 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png';
    this.shadowRoot.innerHTML = `
      <style>
        :host{--dark:#1E293B;--dark-card:#0f172a;--dark-surface:#1a2332;--green:#22C55E;--green-dark:#16A34A;--green-light:rgba(34,197,94,0.1);--green-glow:rgba(34,197,94,0.3);--gray-50:#f9fafb;--gray-100:#F1F5F9;--gray-200:#E2E8F0;--gray-400:#94A3B8;--gray-600:#475569;--gray-700:#334155;display:block;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:var(--gray-50);color:var(--dark);line-height:1.6;-webkit-font-smoothing:antialiased}
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        h2,h3{font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:600;line-height:1.2}
        .container{max-width:1200px;margin:0 auto;padding:0 20px}
        .features-section{padding:48px 0}
        .section-header{text-align:center;margin-bottom:32px}
        .section-header h2{font-size:clamp(24px,6vw,36px);margin-bottom:10px;color:var(--dark)}
        .section-header p{color:var(--gray-600);font-size:clamp(14px,4vw,16px);max-width:500px;margin:0 auto;line-height:1.6}
        .animate-on-scroll{opacity:0;transform:translateY(30px);transition:opacity 0.6s ease-out,transform 0.6s ease-out}
        .animate-on-scroll.visible{opacity:1;transform:translateY(0)}
        .feature-hero{background:var(--dark);border-radius:20px;padding:28px 20px;margin-bottom:16px;display:grid;gap:28px;overflow:hidden;position:relative;border:2px solid transparent;transition:all 0.3s ease}
        .feature-hero:hover{border-color:var(--green);box-shadow:0 12px 32px rgba(0,0,0,0.15);transform:translateY(-4px)}
        .feature-hero::before{content:'';position:absolute;top:-50%;right:-30%;width:300px;height:300px;background:radial-gradient(circle,var(--green-glow) 0%,transparent 70%);pointer-events:none}
        .feature-hero-content{position:relative;z-index:1}
        .feature-badge{background:var(--green);color:white;font-size:10px;font-weight:600;padding:5px 10px;border-radius:16px;display:inline-block;margin-bottom:14px;text-transform:uppercase;letter-spacing:0.5px}
        .feature-hero h3{color:white;font-size:clamp(22px,5vw,32px);margin-bottom:10px}
        .feature-hero>.feature-hero-content>p{color:var(--gray-400);font-size:clamp(14px,3.5vw,16px);line-height:1.6;max-width:400px}
        .feature-hero-demo{position:relative;z-index:1;display:flex;flex-direction:column;gap:10px}
        .correlation-card{background:var(--dark-surface);border-radius:14px;padding:14px;border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:12px;transition:all 0.3s ease;cursor:default}
        .correlation-card:hover{border-color:var(--green);transform:translateX(4px);box-shadow:0 0 20px rgba(34,197,94,0.15)}
        .correlation-icon{width:44px;height:44px;background:rgba(34,197,94,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .correlation-icon svg{width:22px;height:22px;color:var(--green)}
        .correlation-content{flex:1;min-width:0}
        .correlation-metric{color:white;font-weight:600;font-size:14px;margin-bottom:2px}
        .correlation-metric span{color:var(--green)}
        .correlation-cause{color:var(--gray-400);font-size:12px}
        .correlation-confidence{text-align:right;flex-shrink:0}
        .confidence-label{color:var(--gray-400);font-size:9px;text-transform:uppercase;margin-bottom:4px;letter-spacing:0.3px}
        .confidence-bar{width:50px;height:4px;background:var(--gray-700);border-radius:2px;overflow:hidden}
        .confidence-fill{height:100%;background:var(--green);border-radius:2px;transition:width 1s ease-out 0.3s}
        .features-row{display:grid;gap:16px}
        .feature-card{background:white;border-radius:20px;padding:24px 20px;border:2px solid var(--gray-200);transition:all 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.04)}
        .feature-card:hover{border-color:var(--green);box-shadow:0 12px 32px rgba(0,0,0,0.08);transform:translateY(-4px)}
        .feature-card-header{display:flex;align-items:flex-start;gap:14px;margin-bottom:20px}
        .feature-icon{width:48px;height:48px;background:linear-gradient(135deg,var(--green),var(--green-dark));border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 12px rgba(34,197,94,0.25)}
        .feature-icon svg{width:24px;height:24px;color:white}
        .feature-card-header h3{font-size:clamp(18px,4.5vw,20px);color:var(--dark);margin-bottom:4px}
        .feature-card-header p{color:var(--gray-600);font-size:clamp(13px,3.5vw,14px);line-height:1.5}
        .logging-methods,.device-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
        .log-method{background:var(--gray-50);border:2px solid var(--gray-200);border-radius:14px;padding:16px 12px;text-align:center;transition:all 0.25s ease;cursor:pointer}
        .log-method:hover{background:white;border-color:var(--green);transform:scale(1.02)}
        .log-method-icon{width:44px;height:44px;background:white;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;box-shadow:0 2px 8px rgba(0,0,0,0.06);transition:all 0.25s ease}
        .log-method:hover .log-method-icon{box-shadow:0 4px 12px rgba(34,197,94,0.2)}
        .log-method-icon svg{width:22px;height:22px;color:var(--green)}
        .log-method span{font-size:13px;font-weight:600;color:var(--dark)}
        .device-item{background:var(--gray-50);border:2px solid var(--gray-200);border-radius:14px;padding:16px 12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;transition:all 0.25s ease;cursor:pointer}
        .device-item:hover{border-color:var(--green);background:white;transform:scale(1.02)}
        .device-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;background:white;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
        .device-icon img{width:32px;height:32px;object-fit:contain;border-radius:5px}
        .device-info{text-align:center}
        .device-info strong{display:block;font-size:13px;font-weight:600;color:var(--dark)}
        @media(min-width:768px){
          .features-section{padding:64px 0}
          .section-header{margin-bottom:40px}
          .feature-hero{grid-template-columns:1fr 1fr;padding:40px;align-items:center;border-radius:24px;margin-bottom:20px}
          .features-row{grid-template-columns:1fr 1fr;gap:20px}
          .feature-card{padding:28px}
          .logging-methods,.device-grid{gap:12px}
          .correlation-card{padding:16px}
          .correlation-icon{width:48px;height:48px}
          .correlation-icon svg{width:24px;height:24px}
          .correlation-metric{font-size:15px}
          .correlation-cause{font-size:13px}
          .confidence-bar{width:60px}
        }
        @media(min-width:1024px){
          .features-section{padding:80px 0}
          .feature-hero{padding:48px;gap:40px}
          .feature-card{padding:32px}
          .feature-icon{width:52px;height:52px}
          .feature-icon svg{width:26px;height:26px}
          .log-method-icon,.device-icon{width:48px;height:48px}
          .device-icon img{width:36px;height:36px;border-radius:5px}
          .log-method-icon svg{width:24px;height:24px}
          .log-method span,.device-info strong{font-size:14px}
        }
      </style>
      <section class="features-section" id="features">
        <div class="container">
          <div class="section-header animate-on-scroll">
            <h2>${sectionTitle}</h2>
            <p>${sectionSubtitle}</p>
          </div>
          <div class="feature-hero animate-on-scroll">
            <div class="feature-hero-content">
              <span class="feature-badge">Key Feature</span>
              <h3>Personalized Correlations</h3>
              <p>Discover statistically significant relationships between what you eat and how your body responds. Real insights from your data—not generic advice.</p>
            </div>
            <div class="feature-hero-demo">
              <div class="correlation-card">
                <div class="correlation-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></div>
                <div class="correlation-content">
                  <div class="correlation-metric">Sleep latency <span>+8 min</span></div>
                  <div class="correlation-cause">Caffeine after 3pm</div>
                </div>
                <div class="correlation-confidence">
                  <div class="confidence-label">Confidence</div>
                  <div class="confidence-bar"><div class="confidence-fill" style="width:85%"></div></div>
                </div>
              </div>
              <div class="correlation-card">
                <div class="correlation-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
                <div class="correlation-content">
                  <div class="correlation-metric">HRV <span>+12% avg</span></div>
                  <div class="correlation-cause">No sugar after 6pm</div>
                </div>
                <div class="correlation-confidence">
                  <div class="confidence-label">Confidence</div>
                  <div class="confidence-bar"><div class="confidence-fill" style="width:72%"></div></div>
                </div>
              </div>
              <div class="correlation-card">
                <div class="correlation-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg></div>
                <div class="correlation-content">
                  <div class="correlation-metric">Deep sleep <span>+23 min</span></div>
                  <div class="correlation-cause">High protein dinner</div>
                </div>
                <div class="correlation-confidence">
                  <div class="confidence-label">Confidence</div>
                  <div class="confidence-bar"><div class="confidence-fill" style="width:68%"></div></div>
                </div>
              </div>
            </div>
          </div>
          <div class="features-row">
            <div class="feature-card animate-on-scroll">
              <div class="feature-card-header">
                <div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
                <div>
                  <h3>Log Meals in Seconds</h3>
                  <p>Snap a pic, type it out. AI assisted logging.</p>
                </div>
              </div>
              <div class="logging-methods">
                <div class="log-method"><div class="log-method-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div><span>Photo</span></div>
                <div class="log-method"><div class="log-method-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5h2M7 5h2M11 5h2M15 5h2M19 5h2M3 10h2M7 10h2M11 10h2M15 10h2M19 10h2M3 15h2M7 15h2M11 15h2M15 15h2M19 15h2"/></svg></div><span>Barcode</span></div>
                <div class="log-method"><div class="log-method-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg></div><span>Voice</span></div>
                <div class="log-method"><div class="log-method-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><span>Text</span></div>
              </div>
            </div>
            <div class="feature-card animate-on-scroll">
              <div class="feature-card-header">
                <div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg></div>
                <div>
                  <h3>All Devices, One App</h3>
                  <p>Connect multiple wearables. See the best metrics together.</p>
                </div>
              </div>
              <div class="device-grid">
                <div class="device-item"><div class="device-icon"><img src="${ouraIcon}" alt="Oura Ring" loading="lazy"/></div><div class="device-info"><strong>Oura</strong></div></div>
                <div class="device-item"><div class="device-icon"><img src="${appleIcon}" alt="Apple Health" loading="lazy"/></div><div class="device-info"><strong>Apple</strong></div></div>
                <div class="device-item"><div class="device-icon"><img src="${fitbitIcon}" alt="Fitbit" loading="lazy"/></div><div class="device-info"><strong>Fitbit</strong></div></div>
                <div class="device-item"><div class="device-icon"><img src="${garminIcon}" alt="Garmin" loading="lazy"/></div><div class="device-info"><strong>Garmin</strong></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('kygo-features-section', KygoFeaturesSection);


/* ========================================
   5. KYGO INSIGHTS STEPS
   Tag: kygo-insights-steps
======================================== */
class KygoInsightsSteps extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.animationObserver = null;
  }
  connectedCallback() {
    this.render();
    this.setupAnimations();
    __seo(this, 'How Kygo works: Step 1 \u2014 Log your food with AI photo scanning. Step 2 \u2014 Sync your wearable data automatically. Step 3 \u2014 Discover how food affects your sleep, HRV, energy, and recovery.');
  }
  disconnectedCallback() {
    if (this.animationObserver) this.animationObserver.disconnect();
  }
  getWearableIcons() {
    return {
      apple: 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png',
      oura: 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png'
    };
  }
  render() {
    const icons = this.getWearableIcons();
    this.shadowRoot.innerHTML = `
      <style>
        :host{--dark:#1E293B;--green:#22C55E;--green-dark:#16A34A;--gray-50:#f9fafb;--gray-200:#E2E8F0;--gray-400:#94A3B8;--gray-600:#475569;display:block;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;color:var(--dark);line-height:1.6;-webkit-font-smoothing:antialiased}
        *{margin:0;padding:0;box-sizing:border-box}
        .insights-section{padding:48px 0 56px;background:white}
        .container{max-width:900px;margin:0 auto;padding:0 20px}
        .section-header{text-align:center;margin-bottom:36px}
        .section-header h2{font-family:'Space Grotesk',-apple-system,sans-serif;font-size:28px;font-weight:600;line-height:1.2;margin-bottom:10px;color:var(--dark)}
        .section-subtitle{color:var(--gray-600);font-size:15px;max-width:400px;margin:0 auto}
        .steps-container{display:flex;flex-direction:column;gap:16px}
        .step-card{background:var(--gray-50);border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:20px;opacity:0;transform:translateY(20px);transition:all 0.5s cubic-bezier(0.4,0,0.2,1);border:1px solid var(--gray-200)}
        .step-card.visible{opacity:1;transform:translateY(0)}
        .step-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.06)}
        .step-card[data-step="1"]{transition-delay:0s}
        .step-card[data-step="2"]{transition-delay:0.15s}
        .step-card[data-step="3"]{transition-delay:0.3s}
        .step-indicator{display:flex;align-items:flex-start;gap:16px}
        .step-number{width:48px;height:48px;min-width:48px;background:var(--green);color:white;border-radius:14px;display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:700;font-size:20px;flex-shrink:0;box-shadow:0 4px 12px rgba(34,197,94,0.3)}
        .step-text h3{font-family:'Space Grotesk',-apple-system,sans-serif;font-size:18px;font-weight:600;margin-bottom:4px;color:var(--dark);line-height:1.3}
        .step-text p{color:var(--gray-600);font-size:14px;line-height:1.5}
        .step-visual{background:white;border-radius:14px;padding:16px;border:1px solid var(--gray-200)}
        .visual-items{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap}
        .visual-item{background:var(--gray-50);border:1px solid var(--gray-200);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:var(--gray-600);transition:all 0.2s;min-width:90px;justify-content:center}
        .visual-item:hover{border-color:var(--green);background:white}
        .visual-item svg{color:var(--green);flex-shrink:0}
        .device-icon{width:20px;height:20px;object-fit:contain;flex-shrink:0;border-radius:5px}
        .visual-item.highlight{background:var(--green);color:white;border-color:var(--green);font-weight:600}
        .visual-item.highlight svg{color:white}
        .visual-item.highlight:hover{background:var(--green-dark);border-color:var(--green-dark)}
        .steps-cta{text-align:center;margin-top:36px}
        .cta-primary{display:inline-flex;align-items:center;gap:8px;background:var(--green);color:white;padding:14px 28px;border-radius:12px;font-weight:600;font-size:15px;text-decoration:none;transition:all 0.25s;box-shadow:0 4px 14px rgba(34,197,94,0.3);cursor:pointer;border:none;font-family:inherit}
        .cta-primary:hover{background:var(--green-dark);transform:translateY(-2px);box-shadow:0 6px 20px rgba(34,197,94,0.4)}
        .cta-primary svg{transition:transform 0.2s}
        .cta-primary:hover svg{transform:translateX(4px)}
        @media(min-width:600px){
          .insights-section{padding:64px 0 72px}
          .section-header h2{font-size:32px}
          .section-subtitle{font-size:16px}
          .steps-container{gap:20px}
          .step-card{padding:28px;flex-direction:row;align-items:center;justify-content:space-between;gap:24px}
          .step-content{flex:1;max-width:400px}
          .step-number{width:52px;height:52px;min-width:52px;font-size:22px}
          .step-text h3{font-size:19px}
          .step-text p{font-size:15px}
          .step-visual{flex-shrink:0;min-width:280px;padding:18px}
          .visual-items{gap:12px;flex-wrap:nowrap}
          .visual-item{padding:12px 16px;font-size:14px;flex:1;min-width:80px}
          .cta-primary{padding:16px 32px;font-size:16px}
        }
        @media(min-width:900px){
          .insights-section{padding:80px 0 88px}
          .section-header{margin-bottom:48px}
          .section-header h2{font-size:36px}
          .steps-container{gap:24px}
          .step-card{padding:32px 36px;gap:32px}
          .step-number{width:56px;height:56px;min-width:56px;font-size:24px;border-radius:16px}
          .step-text h3{font-size:20px}
          .step-visual{min-width:320px;padding:20px}
          .steps-cta{margin-top:48px}
        }
        @keyframes pulse{0%,100%{box-shadow:0 4px 12px rgba(34,197,94,0.3)}50%{box-shadow:0 4px 20px rgba(34,197,94,0.5)}}
        .step-card.visible .step-number{animation:pulse 2s ease-in-out infinite;animation-delay:0.5s}
      </style>
      <section class="insights-section">
        <div class="container">
          <div class="section-header">
            <h2>Get insights in 3 steps</h2>
            <p class="section-subtitle">Setup takes 2 minutes. First correlations appear in 7-14 days.</p>
          </div>
          <div class="steps-container">
            <div class="step-card step-1" data-step="1">
              <div class="step-content">
                <div class="step-indicator">
                  <div class="step-number">1</div>
                  <div class="step-text">
                    <h3>Connect your devices</h3>
                    <p>Link your wearables in seconds. Historical data syncs automatically.</p>
                  </div>
                </div>
              </div>
              <div class="step-visual">
                <div class="visual-items">
                  <div class="visual-item device-item"><img src="${icons.oura}" alt="Oura" class="device-icon"/><span>Oura</span></div>
                  <div class="visual-item device-item"><img src="${icons.apple}" alt="Apple" class="device-icon"/><span>Apple</span></div>
                  <div class="visual-item highlight connected-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Connected</span></div>
                </div>
              </div>
            </div>
            <div class="step-card step-2" data-step="2">
              <div class="step-content">
                <div class="step-indicator">
                  <div class="step-number">2</div>
                  <div class="step-text">
                    <h3>Log your meals</h3>
                    <p>Snap a photo, scan a barcode, or just tell us what you ate.</p>
                  </div>
                </div>
              </div>
              <div class="step-visual">
                <div class="visual-items">
                  <div class="visual-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>Photo</span></div>
                  <div class="visual-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg><span>Voice</span></div>
                  <div class="visual-item highlight"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Logged</span></div>
                </div>
              </div>
            </div>
            <div class="step-card step-3" data-step="3">
              <div class="step-content">
                <div class="step-indicator">
                  <div class="step-number">3</div>
                  <div class="step-text">
                    <h3>Discover your patterns</h3>
                    <p>The more you log the more you learn with stronger correlations.</p>
                  </div>
                </div>
              </div>
              <div class="step-visual">
                <div class="visual-items">
                  <div class="visual-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg><span>Food</span></div>
                  <div class="visual-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg><span>Biometrics</span></div>
                  <div class="visual-item highlight"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6"/><path d="M11 8v6"/></svg><span>Discovered</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="steps-cta">
            <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" target="_blank" class="cta-primary">
              <span>Start Free Today</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M10 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </a>
          </div>
        </div>
      </section>
    `;
  }
  setupAnimations() {
    if ('IntersectionObserver' in window) {
      this.animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
      this.shadowRoot.querySelectorAll('.step-card').forEach(card => this.animationObserver.observe(card));
    } else {
      this.shadowRoot.querySelectorAll('.step-card').forEach(card => card.classList.add('visible'));
    }
  }
}
customElements.define('kygo-insights-steps', KygoInsightsSteps);


/* ========================================
   6. KYGO FAQ
   Tag: kygo-faq
======================================== */
class KygoFaq extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.render();
    this.setupAccordion();
    this.setupIntersectionObserver();
    __seo(this, 'Frequently asked questions about Kygo Health \u2014 nutrition tracking, wearable integration, AI-powered food logging, and personalized health insights.');
  }
  setupAccordion() {
    const questions = this.shadowRoot.querySelectorAll('.faq-question');
    questions.forEach(question => {
      question.addEventListener('click', () => {
        const item = question.parentElement;
        const wasOpen = item.classList.contains('open');
        this.shadowRoot.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });
  }
  setupIntersectionObserver() {
    const items = this.shadowRoot.querySelectorAll('.faq-item');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), index * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    items.forEach(item => observer.observe(item));
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;--dark:#1E293B;--green:#22C55E;--gray-200:#E2E8F0;--gray-400:#94A3B8;--gray-600:#475569}
        *{margin:0;padding:0;box-sizing:border-box}
        .faq{padding:60px 0;background:white;font-family:'DM Sans',sans-serif}
        .container{max-width:1200px;margin:0 auto;padding:0 20px}
        .section-header{text-align:center;margin-bottom:40px}
        .section-header h2{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:28px;line-height:1.2;color:var(--dark);margin-bottom:10px}
        .faq-list{max-width:700px;margin:0 auto}
        .faq-item{border-bottom:1px solid var(--gray-200);opacity:0;transform:translateY(15px);transition:all 0.4s cubic-bezier(0.4,0,0.2,1)}
        .faq-item.visible{opacity:1;transform:translateY(0)}
        .faq-item:last-child{border-bottom:none}
        .faq-question{padding:20px 0;font-weight:600;font-size:16px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;transition:color 0.2s;color:var(--dark);gap:16px}
        .faq-question:hover{color:var(--green)}
        .faq-question svg{flex-shrink:0;transition:transform 0.3s;color:var(--gray-400)}
        .faq-item.open .faq-question svg{transform:rotate(180deg);color:var(--green)}
        .faq-answer{max-height:0;overflow:hidden;transition:max-height 0.3s,padding 0.3s,opacity 0.3s;opacity:0}
        .faq-answer-inner{padding-bottom:20px;color:var(--gray-600);font-size:15px;line-height:1.7}
        .faq-item.open .faq-answer{max-height:300px;opacity:1}
        @media(min-width:768px){.faq{padding:80px 0}.section-header h2{font-size:36px}.faq-question{font-size:17px}}
      </style>
      <section class="faq" id="faq">
        <div class="container">
          <div class="section-header"><h2>Common questions</h2></div>
          <div class="faq-list">
            <div class="faq-item open visible">
              <div class="faq-question">How is Kygo different from MyFitnessPal?<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
              <div class="faq-answer"><div class="faq-answer-inner">MyFitnessPal tracks calories for weight loss. Kygo shows you how food affects your sleep, HRV, energy, and recovery by correlating your nutrition with your wearable data. It's not about dieting—it's about understanding your body's unique responses.</div></div>
            </div>
            <div class="faq-item">
              <div class="faq-question">Which devices do you support?<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
              <div class="faq-answer"><div class="faq-answer-inner">We integrate with Oura Ring, Apple Health, Fitbit, and Garmin. You can connect one device or multiple—we'll combine the data to fill gaps and give you the most complete picture.</div></div>
            </div>
            <div class="faq-item">
              <div class="faq-question">How long until I see correlations?<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
              <div class="faq-answer"><div class="faq-answer-inner">Basic trends show immediately. Meaningful correlations typically appear after 7-14 days of consistent logging. The more data you provide, the better and more accurate your insights become.</div></div>
            </div>
            <div class="faq-item">
              <div class="faq-question">Is it really free?<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
              <div class="faq-answer"><div class="faq-answer-inner">Yes! Food logging, wearable sync, and trend tracking are free forever. The correlation engine is free for 14 days, then $7.99/month or $50/year to continue seeing personalized insights.</div></div>
            </div>
            <div class="faq-item">
              <div class="faq-question">Is my health data secure?<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
              <div class="faq-answer"><div class="faq-answer-inner">Your data is encrypted and never sold. We exist to help you understand your health, not to monetize your information. You can export or delete your data anytime.</div></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('kygo-faq', KygoFaq);


/* ========================================
   7. KYGO FOUNDER CTA
   Tag: kygo-founder-cta
======================================== */
class KygoFounderCta extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.render();
    this.setupIntersectionObserver();
    this.setupEvents();
    __seo(this, 'Download Kygo Health free on iOS. Connect nutrition with wearable data for personalized health insights. Free forever plan available.');
  }
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    this.shadowRoot.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  }
  setupEvents() {
    const androidBtn = this.shadowRoot.querySelector('.cta-android');
    const modal = this.shadowRoot.querySelector('.android-modal');
    const closeBtn = this.shadowRoot.querySelector('.modal-close');
    const form = this.shadowRoot.querySelector('.android-form');
    if (androidBtn) androidBtn.addEventListener('click', e => { e.preventDefault(); modal.classList.add('active'); });
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });
    if (form) form.addEventListener('submit', e => {
      e.preventDefault();
      const email = form.querySelector('input').value;
      if (email) {
        this.dispatchEvent(new CustomEvent('android-signup', { detail: { email }, bubbles: true, composed: true }));
        form.innerHTML = '<p class="success-msg">You\'re on the list! 🎉</p>';
        setTimeout(() => modal.classList.remove('active'), 2000);
      }
    });
  }
  render() {
    const appStoreUrl = this.getAttribute('app-store-url') || 'https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589';
    const founderName = this.getAttribute('founder-name') || 'Ryan';
    const founderTitle = this.getAttribute('founder-title') || 'Founder, Kygo Health';
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;--dark:#1E293B;--dark-card:#0f172a;--green:#22C55E;--green-dark:#16A34A;--green-light:rgba(34,197,94,0.1);--gray-50:#f9fafb;--gray-400:#94A3B8;--gray-600:#475569;--gray-700:#334155;line-height:1.6;-webkit-font-smoothing:antialiased}
        *{margin:0;padding:0;box-sizing:border-box}
        h1,h2,h3,h4{font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:600;line-height:1.2}
        .container{max-width:1200px;margin:0 auto;padding:0 20px}
        .animate-on-scroll{opacity:0;transform:translateY(30px);transition:opacity 0.6s ease-out,transform 0.6s ease-out}
        .animate-on-scroll.visible{opacity:1;transform:translateY(0)}
        .animate-on-scroll.delay-1{transition-delay:0.1s}
        .founder-story{padding:60px 0;background:linear-gradient(135deg,var(--dark) 0%,var(--gray-700) 100%);position:relative;overflow:hidden}
        .founder-story::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");pointer-events:none}
        .founder-content{max-width:800px;margin:0 auto;position:relative;z-index:1}
        .founder-header{text-align:center;margin-bottom:32px}
        .founder-header h2{font-size:32px;color:white;margin-bottom:8px}
        .founder-header p{color:var(--gray-400);font-size:16px}
        .founder-story-text{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:32px}
        .founder-story-text p{color:var(--gray-400);font-size:16px;line-height:1.8;margin-bottom:20px}
        .founder-story-text p:last-of-type{margin-bottom:0}
        .founder-quote{background:var(--green-light);border-left:4px solid var(--green);padding:20px 24px;border-radius:0 12px 12px 0;margin:24px 0}
        .founder-quote p{color:white !important;font-style:italic;font-size:17px !important;margin-bottom:0 !important}
        .founder-profile{display:flex;align-items:center;gap:16px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1);margin-top:24px}
        .founder-avatar{width:48px;height:48px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
        .founder-avatar img{width:100%;height:100%;object-fit:contain}
        .founder-info{display:flex;flex-direction:column;justify-content:center}
        .founder-info h4{color:white;font-size:16px;margin-bottom:2px;line-height:1.2}
        .founder-info span{color:var(--gray-400);font-size:14px;line-height:1.2}
        .final-cta{padding:60px 0;background:var(--gray-50)}
        .final-cta-inner{background:linear-gradient(135deg,var(--green),var(--green-dark));border-radius:24px;padding:48px 24px;text-align:center;position:relative;overflow:hidden}
        .final-cta-inner::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 50%);pointer-events:none}
        .final-cta-content{position:relative;z-index:1}
        .final-cta h2{font-size:32px;color:white;margin-bottom:12px}
        .final-cta-content>p{color:rgba(255,255,255,0.8);margin-bottom:28px;font-size:17px}
        .cta-primary{background:white;color:var(--green-dark);padding:16px 28px;border-radius:12px;font-weight:600;font-size:16px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:all 0.2s;cursor:pointer;border:none;font-family:inherit;-webkit-tap-highlight-color:transparent}
        .cta-primary:hover{background:var(--light);transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,0.2)}
        .cta-primary:active,.cta-primary:focus{background:white;color:var(--green-dark);outline:none;transform:translateY(0);box-shadow:0 4px 15px rgba(0,0,0,0.15)}
        .cta-primary svg{width:18px;height:18px}
        .risk-reversal{margin-top:20px;color:rgba(255,255,255,0.7);display:flex;flex-wrap:wrap;gap:8px;justify-content:center;font-size:13px}
        .risk-reversal span{display:inline-flex;align-items:center}
        .android-waitlist{margin-top:32px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.2)}
        .android-waitlist p{color:rgba(255,255,255,0.7);font-size:14px;margin-bottom:16px}
        .cta-android{background:white;color:var(--green-dark);padding:14px 24px;border-radius:10px;font-weight:600;font-size:15px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;border:none;cursor:pointer;font-family:inherit;-webkit-tap-highlight-color:transparent}
        .cta-android:hover{background:var(--light);transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,0.2)}
        .cta-android:active,.cta-android:focus{background:white;color:var(--green-dark);outline:none;transform:translateY(0);box-shadow:0 4px 15px rgba(0,0,0,0.15)}
        .cta-android svg{width:18px;height:18px}
        .android-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;visibility:hidden;transition:all 0.3s}
        .android-modal.active{opacity:1;visibility:visible}
        .modal-content{background:white;border-radius:20px;padding:32px;max-width:380px;width:90%;text-align:center;position:relative;transform:scale(0.9);transition:transform 0.3s}
        .android-modal.active .modal-content{transform:scale(1)}
        .modal-close{position:absolute;top:12px;right:12px;background:none;border:none;font-size:24px;cursor:pointer;color:var(--gray-400);line-height:1}
        .modal-close:hover{color:var(--dark)}
        .modal-icon{width:48px;height:48px;background:linear-gradient(135deg,#3DDC84,#00A36C);border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
        .modal-icon svg{width:28px;height:28px;color:white}
        .modal-content h3{font-family:'Space Grotesk',sans-serif;font-size:22px;margin-bottom:8px;color:var(--dark)}
        .modal-content>p{color:var(--gray-600);font-size:14px;margin-bottom:20px;line-height:1.5}
        .android-form{display:flex;flex-direction:column;gap:12px}
        .android-form input{padding:14px 16px;border:1px solid #E2E8F0;border-radius:10px;font-size:15px;font-family:inherit;outline:none;transition:border-color 0.2s}
        .android-form input:focus{border-color:var(--green)}
        .android-form button{background:var(--green);color:white;border:none;padding:14px;border-radius:10px;font-weight:600;font-size:15px;cursor:pointer;transition:background 0.2s;font-family:inherit}
        .android-form button:hover{background:var(--green-dark)}
        .success-msg{color:var(--green);font-weight:600;padding:20px 0}
        @media(min-width:768px){.founder-story{padding:100px 0}.founder-header h2{font-size:40px}.final-cta{padding:80px 0}.final-cta-inner{padding:64px 48px}.final-cta h2{font-size:40px}}
      </style>
      <section class="founder-story">
        <div class="container">
          <div class="founder-content">
            <div class="founder-header animate-on-scroll">
              <h2>Why I built Kygo</h2>
              <p>The problem I couldn't stop thinking about</p>
            </div>
            <div class="founder-story-text animate-on-scroll delay-1">
              <p>I've lost count of how many times I've started a food log only to quit because searching for individual ingredients felt like a part-time job. Even my Apple Watch eventually ended up in a junk drawer; like most health tech, it gave me plenty of data but very little direction. The information was all there, but I had no idea what to actually do with it.</p>
              <p>Kygo was born out of a need for simplicity. I wanted food logging easy enough for my grandparents to use with their Fitbits, yet powerful enough to get my partner to stop telling me how annoying it is to constantly switch from Oura and MyFitnessPal.</p>
              <div class="founder-quote">
                <p>"Your sleep latency increases 8 minutes when you consume caffeine after 3pm." That's not from a study—that's YOUR body telling you something specifically.</p>
              </div>
              <p>Kygo brings everything together and automatically finds the correlations that matter. No more guessing. No more generic advice. Just personalized insights based on YOUR data.</p>
              <p>I hope Kygo can make a positive impact in your life as well.</p>
              <div class="founder-profile">
                <div class="founder-avatar"><img src="${logoUrl}" alt="Kygo Health"></div>
                <div class="founder-info">
                  <h4>${founderName}</h4>
                  <span>${founderTitle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="final-cta">
        <div class="container">
          <div class="final-cta-inner animate-on-scroll">
            <div class="final-cta-content">
              <h2>Ready to understand your body?</h2>
              <p>Stop guessing. Start discovering what actually works for you.</p>
              <a href="${appStoreUrl}" class="cta-primary" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Download Free on iOS
              </a>
              <p class="risk-reversal"><span>Free forever plan</span><span>•</span><span>No credit card required</span><span>•</span><span>Cancel anytime</span></p>
              <div class="android-waitlist">
                <p>Android coming soon</p>
                <button class="cta-android">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                  Join Android Beta
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="android-modal">
        <div class="modal-content">
          <button class="modal-close">×</button>
          <div class="modal-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg></div>
          <h3>Android Beta Coming Soon</h3>
          <p>Be first to know when Kygo launches on Android. Join our free beta waitlist!</p>
          <form class="android-form">
            <input type="email" placeholder="Enter your email" required>
            <button type="submit">Join Free Beta</button>
          </form>
        </div>
      </div>
    `;
  }
}
customElements.define('kygo-founder-cta', KygoFounderCta);

/* ========================================
   BUNDLE COMPLETE
   All 7 elements registered:
   - kygo-hero-section
   - kygo-social-proof-section
   - kygo-problem-section
   - kygo-features-section
   - kygo-insights-steps
   - kygo-faq
   - kygo-founder-cta
======================================== */
