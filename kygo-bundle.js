/**
 * Kygo Health - Combined Custom Elements Bundle
 * All 11 elements in one file for faster loading
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

/** Consistent scroll-in reveal: adds `.reveal` to each element the first time it
 *  enters the viewport, then stops observing it. Sections gate their entrance
 *  animations on `.reveal` so every section fades/slides up the same way as it
 *  scrolls into view. Returns the observer so callers can disconnect it. */
function __revealOnScroll(els) {
  const list = (Array.isArray(els) ? els : [els]).filter(Boolean);
  if (!list.length) return null;
  if (!('IntersectionObserver' in window)) {
    list.forEach(el => el.classList.add('reveal'));
    return null;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  list.forEach(el => io.observe(el));
  return io;
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
    __seo(this, 'Kygo Health \u2014 See how your food affects your sleep, energy, and recovery. The free iOS app connects nutrition data with Apple Watch, Oura Ring, Garmin, WHOOP, Fitbit, and Samsung Galaxy Watch to reveal food-body correlations. AI photo logging identifies meals in seconds from over 5 million foods. Unlike MyFitnessPal or Lose It, Kygo shows how what you eat impacts deep sleep, HRV, resting heart rate, and recovery \u2014 not just calorie totals. Correlations appear after 7 days of logging. Free forever plan available.');
    // No structured-data injection here: the homepage Organization + SoftwareApplication
    // JSON-LD is the single source of truth in the Wix head (see docs/wix-global-code.md,
    // Blocks 2 & 3). This component previously injected duplicate, stale copies.
  }
  setupEvents() {
    const secondaryBtn = this.shadowRoot.querySelector('.cta-secondary');

    if (secondaryBtn) {
      secondaryBtn.addEventListener('click', e => {
        e.preventDefault();
        const target = parent.document.getElementById('kygo-insights-steps');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.parent.location.hash = 'kygo-insights-steps';
        }
      });
    }
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host{--dark:#1E293B;--navy:#0F172A;--light:#F8FAFC;--green:#22C55E;--green-dark:#16A34A;--green-glow:rgba(34,197,94,0.12);--gray-400:#94A3B8;--gray-500:#64748B;--gray-600:#475569;--border:#E2E8F0;--red:#EF4444;display:block;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:var(--dark);line-height:1.6;-webkit-font-smoothing:antialiased}
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}

        .hero{position:relative;padding:clamp(48px,6vw,84px) 20px clamp(52px,6vw,80px);background:#fff;border-bottom:1px solid #F1F5F9;overflow:hidden}
        .hero-glow{position:absolute;top:-160px;right:-80px;width:640px;height:640px;max-width:120vw;background:radial-gradient(circle,var(--green-glow) 0%,transparent 62%);pointer-events:none}
        .container{max-width:1180px;margin:0 auto;position:relative}
        .hero-row{display:flex;flex-wrap:wrap;gap:clamp(40px,5vw,64px);align-items:center}

        /* ---- Left column (copy) ---- */
        .hero-copy{flex:1 1 420px;min-width:0}
        .hero-copy h1{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(34px,5.4vw,52px);line-height:1.05;letter-spacing:-0.03em;margin-bottom:20px;color:var(--dark);animation:hiwUp .6s ease-out .06s both}
        .hero-copy h1 .highlight{color:var(--green)}
        .hero-subheadline{font-size:clamp(16px,2.2vw,19px);color:var(--gray-600);max-width:440px;margin-bottom:30px;line-height:1.6;animation:hiwUp .6s ease-out .12s both}
        .cta-group-top{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px;animation:hiwUp .6s ease-out .18s both}
        .cta-primary{display:inline-flex;align-items:center;justify-content:center;gap:9px;background:var(--green);color:#fff;font-weight:600;font-size:16px;padding:15px 26px;border-radius:12px;white-space:nowrap;text-decoration:none;box-shadow:0 10px 24px -8px rgba(34,197,94,0.5);transition:transform .2s,background .2s;border:none;cursor:pointer}
        .cta-primary:hover{transform:translateY(-2px);background:var(--green-dark)}
        .cta-primary svg{width:20px;height:20px;flex-shrink:0}
        .cta-android{display:inline-flex;align-items:center;justify-content:center;gap:9px;background:var(--dark);color:#fff;font-weight:600;font-size:16px;padding:15px 26px;border-radius:12px;white-space:nowrap;text-decoration:none;transition:transform .2s,background .2s;border:none;cursor:pointer}
        .cta-android:hover{transform:translateY(-2px);background:var(--navy)}
        .cta-android svg{width:20px;height:20px;flex-shrink:0}
        .risk-reversal{font-size:14px;color:var(--gray-400);font-weight:500;margin-bottom:14px;animation:hiwUp .6s ease-out .24s both}
        .cta-secondary{display:inline-flex;align-items:center;gap:8px;font-weight:600;font-size:15px;color:var(--green-dark);text-decoration:none;cursor:pointer;background:none;border:none;transition:gap .2s ease,color .2s ease;animation:hiwUp .6s ease-out .3s both}
        .cta-secondary:hover{color:#15803d;gap:12px}
        .cta-secondary svg{width:16px;height:16px;flex-shrink:0}

        /* ---- Right column (animated phone) ---- */
        .hero-demo{flex:1 1 380px;display:flex;flex-direction:column;align-items:center;animation:hiwUp .7s ease-out .2s both}
        .phone-wrap{position:relative;width:300px;max-width:82vw}
        .phone-float{position:relative;animation:hiwFloat 6s ease-in-out infinite}
        .phone-bezel{position:relative;background:var(--navy);border-radius:44px;padding:11px;box-shadow:0 44px 84px -34px rgba(15,23,42,.6),0 0 0 1px rgba(255,255,255,.06) inset}
        .phone-screen{position:relative;background:#F5F7FA;border-radius:34px;overflow:hidden;height:604px}
        .phone-notch{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:9;width:104px;height:26px;background:var(--navy);border-radius:99px}
        .swap-track{position:absolute;top:0;left:0;right:0;height:1208px;animation:hiwSwap 15s ease-in-out infinite}
        .app-screen{height:604px;position:relative;background:#F5F7FA}
        .sg{font-family:'Space Grotesk',sans-serif}

        /* Screen A */
        .a-topbar{background:#F5F7FA;padding:44px 13px 8px;display:flex;align-items:center;justify-content:space-between;gap:6px}
        .a-pill{display:inline-flex;align-items:center;gap:4px;border:1.5px solid var(--border);background:#fff;border-radius:11px;padding:7px 11px;font-weight:700;font-size:13px;color:var(--navy);white-space:nowrap}
        .a-pill-time{display:inline-flex;align-items:center;gap:5px;border:1.5px solid var(--border);background:#fff;border-radius:11px;padding:7px 10px;font-weight:600;font-size:12px;color:var(--gray-600);white-space:nowrap}
        .a-add{width:30px;height:30px;flex-shrink:0;border:1.5px solid var(--border);background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center}
        .a-chat{padding:10px 13px 0;display:flex;flex-direction:column;gap:9px}
        .a-advlabel{display:flex;align-items:center;gap:6px}
        .a-advlabel img{width:16px;height:16px;object-fit:contain}
        .a-advlabel span{font-size:11px;font-weight:600;color:var(--gray-500)}
        .a-bub-ai{align-self:flex-start;max-width:82%;background:#fff;border-radius:15px 15px 15px 5px;padding:9px 14px;font-weight:600;font-size:13px;color:var(--navy);box-shadow:0 3px 10px rgba(15,23,42,.06)}
        .a-bub-user{align-self:flex-end;max-width:82%;background:var(--green);color:#fff;border-radius:15px 15px 5px 15px;padding:9px 14px;font-size:12.5px;font-weight:500;box-shadow:0 6px 14px -6px rgba(34,197,94,.6);opacity:0;animation:hiwUserBub 15s ease-in-out infinite}
        .a-logged{align-self:flex-start;display:flex;align-items:center;gap:6px;opacity:0;animation:hiwAdv 15s ease-in-out infinite}
        .a-logged img{width:15px;height:15px;object-fit:contain}
        .a-logged span{font-size:11px;font-weight:700;color:var(--green-dark)}
        .a-row{display:flex;align-items:center;gap:10px;background:#fff;border-radius:13px;padding:9px 12px;box-shadow:0 3px 10px rgba(15,23,42,.06);opacity:0}
        .a-row.r1{animation:hiwR1 15s ease-in-out infinite}
        .a-row.r2{animation:hiwR2 15s ease-in-out infinite}
        .a-row.r3{animation:hiwR3 15s ease-in-out infinite}
        .a-tile{width:30px;height:30px;border-radius:9px;background:#F1F5F9;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
        .a-rowmid{flex:1;min-width:0}
        .a-rowname{display:block;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;color:var(--navy);line-height:1.25}
        .a-rowmeta{display:block;font-size:10px;color:var(--gray-400)}
        .a-rowkcal{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;color:var(--navy);flex-shrink:0}
        .a-rowkcal small{font-size:9px;color:var(--gray-400);font-weight:600}
        .a-total{position:absolute;left:50%;bottom:104px;transform:translate(-50%,0);display:flex;align-items:center;gap:9px;background:#fff;border-radius:14px;padding:9px 10px 9px 15px;box-shadow:0 16px 34px -10px rgba(15,23,42,.3);border:1px solid #EEF2F6;white-space:nowrap;opacity:0;animation:hiwTotal 15s ease-in-out infinite}
        .a-total-lbl{display:block;font-size:9px;font-weight:600;color:var(--gray-400)}
        .a-total-val{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:16px;color:var(--navy)}
        .a-total-val small{font-size:9px;color:var(--gray-400);font-weight:600}
        .a-bookmark{width:32px;height:32px;border-radius:9px;background:#F1F5F9;display:flex;align-items:center;justify-content:center}
        .a-logbtn{position:relative;background:var(--green);color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;padding:10px 16px;border-radius:10px;animation:hiwLift 15s ease-in-out infinite}
        .a-ripple{position:absolute;top:50%;left:50%;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:99px;background:rgba(255,255,255,.5);animation:hiwTap 15s ease-in-out infinite}
        .a-dock{position:absolute;left:0;right:0;bottom:0;background:rgba(248,250,252,.97);border-top:1px solid #EEF2F6;padding:9px 12px 12px;display:flex;flex-direction:column;gap:8px}
        .a-dockrow{display:flex;align-items:center;gap:8px}
        .a-input{flex:1;position:relative;background:#fff;border:1px solid var(--border);border-radius:99px;height:34px;padding:0 14px;display:flex;align-items:center;overflow:hidden}
        .a-place{position:absolute;left:14px;right:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:11px;color:var(--gray-400);animation:hiwPlace 15s ease-in-out infinite}
        .a-typewrap{display:inline-flex;align-items:center;max-width:100%;overflow:hidden}
        .a-type{display:inline-block;overflow:hidden;white-space:nowrap;width:0;font-size:11px;font-weight:500;color:var(--navy);animation:hiwType 15s ease-in-out infinite}
        .a-caret{width:1.5px;height:14px;background:var(--green);margin-left:1px;flex-shrink:0;opacity:0;animation:hiwCaret 15s ease-in-out infinite}
        .a-send{width:32px;height:32px;border-radius:10px;background:#CBD5E1;display:flex;align-items:center;justify-content:center;flex-shrink:0;animation:hiwSend 15s ease-in-out infinite}
        .a-tools{display:flex;align-items:center;justify-content:space-between}
        .a-toolgrp{display:flex;gap:7px}
        .a-tool{width:30px;height:30px;border:1px solid var(--border);border-radius:9px;background:#fff;display:flex;align-items:center;justify-content:center}

        /* Screen B */
        .b-screen{height:604px;position:relative;background:#F5F7FA;display:flex;flex-direction:column}
        .b-head{background:#fff;padding:42px 15px 10px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;flex-shrink:0}
        .b-head > svg{justify-self:start}
        .b-title{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:17px;color:var(--navy);text-align:center}
        .b-day{justify-self:end;background:var(--green);color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:11px;padding:5px 10px;border-radius:999px;white-space:nowrap}
        .b-tabs{background:#fff;display:flex;justify-content:center;gap:18px;padding:0 15px;border-bottom:1px solid #F1F5F9;flex-shrink:0}
        .b-tab{padding:8px 0 10px;border-bottom:2px solid transparent;font-weight:700;font-size:11px}
        .b-tab.help{animation:hiwTabHelp 15s ease-in-out infinite}
        .b-tab.hurt{animation:hiwTabHurt 15s ease-in-out infinite}
        .b-tab.dev{font-weight:600;color:var(--gray-400)}
        .b-views{position:relative;flex:1;min-height:0}
        .b-view{position:absolute;inset:0;padding:13px 14px;display:flex;flex-direction:column;gap:12px}
        .b-view.hurt{animation:hiwHurt 15s ease-in-out infinite}
        .b-view.help{opacity:0;animation:hiwHelp 15s ease-in-out infinite}
        .b-src{display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:600;color:var(--gray-400)}
        .b-card{background:#fff;border-radius:16px;padding:16px;box-shadow:0 4px 14px rgba(15,23,42,.06)}
        .b-cap{font-size:9.5px;font-weight:700;letter-spacing:.5px;color:var(--gray-400);margin-bottom:8px}
        .b-see{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:19px;line-height:1.22;color:var(--navy);margin-bottom:16px}
        .b-stats{display:flex;justify-content:space-between;border-top:1px solid #F1F5F9;padding-top:13px}
        .b-statlbl{display:block;font-size:9px;font-weight:700;letter-spacing:.4px;color:var(--gray-400);margin-bottom:2px}
        .b-statval{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:15px;color:var(--navy)}
        .b-dethead{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
        .b-detname{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:15px;color:var(--navy)}
        .b-pill-neg{font-size:11px;font-weight:700;color:var(--red);background:#FEF2F2;padding:4px 9px;border-radius:999px}
        .b-pill-pos{font-size:11px;font-weight:700;color:var(--green-dark);background:#ECFDF5;padding:4px 9px;border-radius:999px}
        .b-detdesc{font-size:11.5px;color:var(--gray-600);line-height:1.5;margin-bottom:12px}
        .b-bars{background:#F5F7FA;border-radius:11px;padding:11px 12px;display:flex;flex-direction:column;gap:9px}
        .b-barrow{display:flex;align-items:center;gap:8px}
        .b-barlbl{font-size:10px;color:var(--gray-500);width:64px;flex-shrink:0}
        .b-track{flex:1;height:7px;background:var(--border);border-radius:99px;overflow:hidden}
        .b-fill{display:block;height:100%;border-radius:99px;transform-origin:left}
        .b-view.hurt .b-fill{animation:hiwBarH 15s ease-in-out infinite}
        .b-view.help .b-fill{animation:hiwBarG 15s ease-in-out infinite}
        .b-barval{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:11px;color:var(--navy)}
        .b-rank{display:flex;align-items:center;gap:7px;margin-top:12px}
        .b-badge{color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:9.5px;padding:3px 7px;border-radius:6px}
        .b-real{font-size:11px;font-weight:600;color:var(--navy)}
        .b-meta{font-size:11px;color:var(--gray-400)}

        /* Floating connected badges (real Oura + Apple logos) */
        .hero-badge{position:absolute;z-index:40}
        .hero-badge.a{top:60px;left:-64px;animation:heroBadgeCycle 15s ease-in-out infinite}
        .hero-badge.b{top:140px;right:-68px;animation:heroBadgeCycle 15s ease-in-out infinite .4s}
        .hero-badge-inner{display:inline-flex;align-items:center;gap:9px;background:#fff;border-radius:13px;padding:8px 13px 8px 8px;box-shadow:0 14px 30px -12px rgba(15,23,42,.4)}
        .hero-badge.a .hero-badge-inner{animation:heroBadgeA 3.4s ease-in-out infinite}
        .hero-badge.b .hero-badge-inner{animation:heroBadgeB 3.9s ease-in-out infinite 1s}
        .hero-badge-icon{width:30px;height:30px;flex-shrink:0;border-radius:9px;background:#F1F5F9;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .hero-badge-icon img{width:22px;height:22px;object-fit:contain}
        .hero-badge-icon.rounded img{border-radius:5px}
        .hero-badge-label{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;color:var(--navy);white-space:nowrap}
        .patent-notice{position:relative;z-index:40;margin-top:40px;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:var(--gray-400);font-weight:600;text-align:center;animation:hiwUp .6s ease-out .5s both}
        .hero-demo .cta-secondary{margin-top:18px}

        /* ---- Keyframes ---- */
        @keyframes hiwUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes hiwFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes heroBadgeA{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes heroBadgeB{0%,100%{transform:translateY(0)}50%{transform:translateY(7px)}}
        @keyframes heroBadgeCycle{0%{opacity:0;transform:scale(.92)}5%,42%{opacity:1;transform:scale(1)}50%,94%{opacity:0;transform:scale(.96)}100%{opacity:0;transform:scale(.92)}}
        @keyframes hiwSwap{0%,46%{transform:translateY(0)}52%,94%{transform:translateY(-50%)}99%,100%{transform:translateY(0)}}
        @keyframes hiwType{0%,4%{width:0}15%,19%{width:23ch}21%,100%{width:0}}
        @keyframes hiwPlace{0%,3%{opacity:1}5%,20%{opacity:0}22%,100%{opacity:1}}
        @keyframes hiwCaret{0%,3.6%{opacity:0}4%,20%{opacity:1}20.4%,100%{opacity:0}}
        @keyframes hiwSend{0%,4%{background:#CBD5E1}6%,19%{background:#22C55E}21%,100%{background:#CBD5E1}}
        @keyframes hiwUserBub{0%,19%{opacity:0;transform:translateY(10px) scale(.96)}22%,100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes hiwAdv{0%,23%{opacity:0;transform:translateY(8px)}26%,100%{opacity:1;transform:translateY(0)}}
        @keyframes hiwR1{0%,26%{opacity:0;transform:translateY(10px)}30%,100%{opacity:1;transform:translateY(0)}}
        @keyframes hiwR2{0%,30%{opacity:0;transform:translateY(10px)}34%,100%{opacity:1;transform:translateY(0)}}
        @keyframes hiwR3{0%,34%{opacity:0;transform:translateY(10px)}38%,100%{opacity:1;transform:translateY(0)}}
        @keyframes hiwTap{0%,41%{transform:scale(1);opacity:0}43%{transform:scale(1);opacity:.9}46%{transform:scale(2.4);opacity:0}100%{opacity:0}}
        @keyframes hiwLift{0%,41%{transform:translateY(0);box-shadow:0 8px 16px -6px rgba(34,197,94,.55)}43.5%{transform:translateY(-2px);box-shadow:0 12px 22px -6px rgba(34,197,94,.7)}47%,100%{transform:translateY(0);box-shadow:0 8px 16px -6px rgba(34,197,94,.55)}}
        @keyframes hiwTotal{0%,37%{opacity:0;transform:translate(-50%,16px) scale(.9)}44%,100%{opacity:1;transform:translate(-50%,0) scale(1)}}
        @keyframes hiwHurt{0%,64%{opacity:1}70%,100%{opacity:0}}
        @keyframes hiwHelp{0%,66%{opacity:0}72%,94%{opacity:1}98%,100%{opacity:0}}
        @keyframes hiwTabHurt{0%,64%{color:#0F172A;border-bottom-color:#EF4444}70%,100%{color:#94A3B8;border-bottom-color:transparent}}
        @keyframes hiwTabHelp{0%,66%{color:#94A3B8;border-bottom-color:transparent}72%,94%{color:#0F172A;border-bottom-color:#22C55E}98%,100%{color:#94A3B8;border-bottom-color:transparent}}
        @keyframes hiwBarH{0%,53%{transform:scaleX(0)}62%,100%{transform:scaleX(1)}}
        @keyframes hiwBarG{0%,73%{transform:scaleX(0)}82%,100%{transform:scaleX(1)}}

        /* ---- Mobile tuning ---- */
        /* Center the copy + stack full-width CTAs once columns wrap */
        @media(max-width:860px){
          .hero-copy{text-align:center}
          .hero-subheadline{margin-left:auto;margin-right:auto}
          .cta-group-top{justify-content:center}
        }
        @media(max-width:600px){
          .cta-group-top{flex-direction:column;align-items:stretch}
          .cta-primary,.cta-android{width:100%}
          .hero-badge.a{left:-14px;top:44px}
          .hero-badge.b{right:-14px;top:92px}
          .hero-badge-inner{padding:7px 11px 7px 7px}
          .hero-badge-label{font-size:12px}
        }
        @media(max-width:360px){
          .hero-badge.a{left:-6px}
          .hero-badge.b{right:-6px}
        }

        /* ---- Reduced motion: freeze animation, force the static resting state visible ---- */
        @media (prefers-reduced-motion: reduce){
          *{animation:none !important;transition:none !important}
          .a-bub-user,.a-logged,.a-row,.a-total{opacity:1 !important;transform:none !important}
          .a-total{transform:translate(-50%,0) !important}
          .a-type{width:auto !important}
          .a-place,.a-caret{opacity:0 !important}
          .a-send{background:var(--green) !important}
          .b-view.help{opacity:0 !important}
          .hero-badge{opacity:1 !important}
        }
      </style>
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="container">
          <div class="hero-row">
            <!-- Left column: copy + CTAs -->
            <div class="hero-copy">
              <h1>See how your food affects your <span class="highlight">sleep, energy, and recovery</span></h1>
              <p class="hero-subheadline">Kygo connects your wearables with nutrition tracking to reveal personalized correlations, so you can stop guessing and start understanding your body.</p>
              <div class="cta-group-top">
                <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" target="_blank" class="cta-primary" data-track-position="early" data-track-label="home-hero-ios">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </a>
                <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" target="_blank" rel="noopener" class="cta-android" data-action="android-download" data-track-position="early" data-track-label="home-hero-android">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                  Get it on Android
                </a>
              </div>
              <p class="risk-reversal">Two minute setup&nbsp;&nbsp;•&nbsp;&nbsp;Free plan available&nbsp;&nbsp;•&nbsp;&nbsp;Cancel anytime</p>
            </div>

            <!-- Right column: animated phone -->
            <div class="hero-demo">
              <div class="phone-wrap">
                <div class="phone-float">
                  <div class="phone-bezel">
                    <div class="phone-screen">
                      <div class="phone-notch"></div>
                      <div class="swap-track">

                        <!-- Screen A: breakfast chat / meal log -->
                        <div class="app-screen">
                          <div class="a-topbar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#0F172A" stroke-width="2.4" style="width:17px;height:17px;flex-shrink:0"><path d="M15 18l-6-6 6-6"/></svg>
                            <span class="a-pill">Breakfast <svg viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.4" style="width:12px;height:12px"><path d="M6 9l6 6 6-6"/></svg></span>
                            <span class="a-pill-time"><svg viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" style="width:12px;height:12px"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>8:14 AM</span>
                            <span class="a-add"><svg viewBox="0 0 24 24" fill="none" stroke="#0F172A" stroke-width="2.2" style="width:15px;height:15px"><path d="M12 5v14M5 12h14"/></svg></span>
                          </div>
                          <div class="a-chat">
                            <span class="a-advlabel"><img src="https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png" alt="Kygo"><span>Kygo Advisor</span></span>
                            <span class="a-bub-ai">Morning! What are we logging?</span>
                            <span class="a-bub-user">Oatmeal, banana &amp; coffee</span>
                            <span class="a-logged"><img src="https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png" alt="Kygo"><span>Logged 3 items · 268 kcal</span></span>
                            <div class="a-row r1">
                              <span class="a-tile">☕</span>
                              <span class="a-rowmid"><span class="a-rowname">Coffee</span><span class="a-rowmeta">1 cup · 95mg caffeine</span></span>
                              <span class="a-rowkcal">5<small> kcal</small></span>
                            </div>
                            <div class="a-row r2">
                              <span class="a-tile">🥣</span>
                              <span class="a-rowmid"><span class="a-rowname">Oatmeal</span><span class="a-rowmeta">1 cup cooked · 6P · 27C · 3F</span></span>
                              <span class="a-rowkcal">158<small> kcal</small></span>
                            </div>
                            <div class="a-row r3">
                              <span class="a-tile">🍌</span>
                              <span class="a-rowmid"><span class="a-rowname">Banana</span><span class="a-rowmeta">1 medium · 1P · 27C · 0F</span></span>
                              <span class="a-rowkcal">105<small> kcal</small></span>
                            </div>
                          </div>
                          <div class="a-total">
                            <span><span class="a-total-lbl">Meal Total</span><span class="a-total-val">268<small> kcal</small></span></span>
                            <span class="a-bookmark"><svg viewBox="0 0 24 24" fill="#16A34A" stroke="#16A34A" stroke-width="1.5" style="width:14px;height:14px"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></span>
                            <span class="a-logbtn">Log Meal<span class="a-ripple"></span></span>
                          </div>
                          <div class="a-dock">
                            <div class="a-dockrow">
                              <span class="a-input">
                                <span class="a-place">Log food, water, supplements…</span>
                                <span class="a-typewrap">
                                  <span class="a-type">Oatmeal, banana &amp; coffee</span>
                                  <span class="a-caret"></span>
                                </span>
                              </span>
                              <span class="a-send"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" style="width:15px;height:15px"><path d="M12 19V5M5 12l7-7 7 7"/></svg></span>
                            </div>
                            <div class="a-tools">
                              <span class="a-toolgrp">
                                <span class="a-tool"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" style="width:14px;height:14px"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></span>
                                <span class="a-tool"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" style="width:14px;height:14px"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.8"/><path d="M21 15l-5-5L5 21"/></svg></span>
                                <span class="a-tool"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" style="width:14px;height:14px"><path d="M3 5v14M7 5v14M11 5v14M15 5v14M19 5v14"/></svg></span>
                              </span>
                              <span class="a-toolgrp">
                                <span class="a-tool"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" style="width:14px;height:14px"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4"/></svg></span>
                                <span class="a-tool"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" style="width:14px;height:14px"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <!-- Screen B: HRV Insights -->
                        <div class="b-screen">
                          <div class="b-head">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#0F172A" stroke-width="2.4" style="width:17px;height:17px"><path d="M15 18l-6-6 6-6"/></svg>
                            <span class="b-title">HRV</span>
                            <span class="b-day">Day 52</span>
                          </div>
                          <div class="b-tabs">
                            <span class="b-tab help">Helping <span style="color:#16A34A">3</span></span>
                            <span class="b-tab hurt">Hurting <span style="color:#EF4444">2</span></span>
                            <span class="b-tab dev">Developing 54</span>
                          </div>
                          <div class="b-views">
                            <!-- Hurting view -->
                            <div class="b-view hurt">
                              <span class="b-src"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px"><rect x="6" y="3" width="12" height="18" rx="3"/><path d="M11 6h2"/></svg>Data from Apple Health · Fitbit</span>
                              <div class="b-card">
                                <div class="b-cap">WHAT WE SEE</div>
                                <div class="b-see">Late caffeine is your <span style="color:#EF4444">biggest drag</span> on HRV.</div>
                                <div class="b-stats">
                                  <span><span class="b-statlbl">TRACKING</span><span class="b-statval">64 days</span></span>
                                  <span><span class="b-statlbl">AVERAGE</span><span class="b-statval">31 ms</span></span>
                                  <span><span class="b-statlbl">RANGE</span><span class="b-statval">14–56</span></span>
                                </div>
                              </div>
                              <div class="b-card">
                                <div class="b-dethead"><span class="b-detname">Late caffeine intake</span><span class="b-pill-neg">−8 ms</span></div>
                                <p class="b-detdesc">Days you go over <b>94.7 mg</b>, your HRV runs <span style="color:#EF4444;font-weight:700">8 ms lower</span> the next day.</p>
                                <div class="b-bars">
                                  <span class="b-barrow"><span class="b-barlbl">Under 95mg</span><span class="b-track"><span class="b-fill" style="width:72%;background:#64748B"></span></span><span class="b-barval">32 ms</span></span>
                                  <span class="b-barrow"><span class="b-barlbl">Over 95mg</span><span class="b-track"><span class="b-fill" style="width:48%;background:#EF4444"></span></span><span class="b-barval">24 ms</span></span>
                                </div>
                                <div class="b-rank"><span class="b-badge" style="background:#0F172A">#1</span><span class="b-real">Likely real</span><span class="b-meta">· 47 days · 1 day later</span></div>
                              </div>
                            </div>
                            <!-- Helping view -->
                            <div class="b-view help">
                              <span class="b-src"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px"><rect x="6" y="3" width="12" height="18" rx="3"/><path d="M11 6h2"/></svg>Data from Apple Health · Fitbit</span>
                              <div class="b-card">
                                <div class="b-cap">WHAT WE SEE</div>
                                <div class="b-see">Magnesium at night is your <span style="color:#22C55E">biggest boost</span> to HRV.</div>
                                <div class="b-stats">
                                  <span><span class="b-statlbl">TRACKING</span><span class="b-statval">47 days</span></span>
                                  <span><span class="b-statlbl">AVERAGE</span><span class="b-statval">34 ms</span></span>
                                  <span><span class="b-statlbl">RANGE</span><span class="b-statval">18–58</span></span>
                                </div>
                              </div>
                              <div class="b-card">
                                <div class="b-dethead"><span class="b-detname">Magnesium before bed</span><span class="b-pill-pos">+6 ms</span></div>
                                <p class="b-detdesc">Nights you take <b>magnesium</b>, your HRV runs <span style="color:#16A34A;font-weight:700">6 ms higher</span> the next morning.</p>
                                <div class="b-bars">
                                  <span class="b-barrow"><span class="b-barlbl">With Mg</span><span class="b-track"><span class="b-fill" style="width:82%;background:#22C55E"></span></span><span class="b-barval">38 ms</span></span>
                                  <span class="b-barrow"><span class="b-barlbl">Without</span><span class="b-track"><span class="b-fill" style="width:64%;background:#64748B"></span></span><span class="b-barval">30 ms</span></span>
                                </div>
                                <div class="b-rank"><span class="b-badge" style="background:#16A34A">#1</span><span class="b-real">Likely real</span><span class="b-meta">· 47 days · 1 day later</span></div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                <!-- Floating connected badges: real Oura + Apple logos -->
                <div class="hero-badge a">
                  <div class="hero-badge-inner">
                    <span class="hero-badge-icon rounded"><img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura Ring"></span>
                    <span class="hero-badge-label">Oura synced</span>
                  </div>
                </div>
                <div class="hero-badge b">
                  <div class="hero-badge-inner">
                    <span class="hero-badge-icon"><img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple Health"></span>
                    <span class="hero-badge-label">Apple connected</span>
                  </div>
                </div>
              </div>
              <p class="patent-notice">Patent Pending Technology</p>
              <a href="#kygo-insights-steps" class="cta-secondary" data-track-position="hero">
                See how it works
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  }

}
customElements.define('kygo-hero-section', KygoHeroSection);


/* ========================================
   2. KYGO SOCIAL PROOF SECTION (dark navy stats band)
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
    __seo(this, 'Kygo Health \u2014 Trusted by health-conscious individuals tracking how nutrition impacts sleep quality, heart rate variability, energy levels, and recovery. Users discover personal patterns like which foods improve deep sleep or raise resting heart rate within their first two weeks.');
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
        /* Mobile: hide the "Works with" logo row so the band stays compact */
        @media(max-width:767px){.device-logos{display:none}}
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
              <div class="device-logo-item" title="WHOOP"><img src="https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png" alt="WHOOP"></div>
              <div class="device-logo-item" title="Google Health"><img src="https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png" alt="Google Health"></div>
              <div class="device-logo-item" title="Health Connect"><img src="https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png" alt="Health Connect"></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('kygo-social-proof-section', KygoSocialProofSection);



/* ========================================
   3. KYGO PROBLEM SECTION (Why Kygo)
   Tag: kygo-problem-section
======================================== */
class KygoProblemSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
    this._observer = null;
  }
  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._setupScrollAnimations();
    __seo(this, 'Stop guessing how food affects your body. Kygo Health uses AI to connect your nutrition data with wearable health metrics including sleep stages, HRV, resting heart rate, blood oxygen, skin temperature, and respiratory rate. The app identifies statistically significant correlations between specific foods and health outcomes \u2014 for example, showing that high-glycemic meals before bed reduce your deep sleep by a measurable percentage.');
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
  static get observedAttributes() { return ['wixsettings', 'eyebrow', 'headline', 'subheadline']; }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this._parseWixAttributes();
    this.render();
    this._setupScrollAnimations();
  }
  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }
  _setupScrollAnimations() {
    if (this._observer) this._observer.disconnect();
    requestAnimationFrame(() => {
      const root = this.shadowRoot.querySelector('.why-section');
      if (!root) return;
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this._observer.unobserve(entry.target);
          }
        });
      }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
      this._observer.observe(root);
    });
  }
  render() {
    const eyebrow = this._getSetting('eyebrow', 'Why Kygo');
    const headline = this._getSetting('headline', "There's a better way to understand your health");
    const subheadline = this._getSetting('subheadline', "Your wearable shows what's happening. We show you why.");
    const oldWay = [
      'You log for months and learn nothing',
      'Your score drops and you never find out why',
      'You cut foods that were never the problem',
      'Logging takes so long you quit by week two'
    ];
    const kygoWay = [
      'Answers start showing up in 7 days',
      'See what moved your HRV, and by how much',
      "Stop cutting foods that don't affect you",
      'Photo, voice or chat, all under 10 seconds a meal'
    ];
    const xIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    const checkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
    // Row/badge stagger: old-way rows start at 0.24s, Kygo-way rows at 0.32s; +70ms per index; badge lands +80ms behind its row.
    const rows = (items, baseDelay, iconHtml) => items.map((text, i) => {
      const rowDelay = (baseDelay + i * 0.07).toFixed(2);
      const popDelay = (baseDelay + i * 0.07 + 0.08).toFixed(2);
      return `
              <div class="why-row" style="--row-delay:${rowDelay}s">
                <span class="why-badge" style="--pop-delay:${popDelay}s">${iconHtml}</span>
                <span class="why-item-text">${text}</span>
              </div>`;
    }).join('');
    this.shadowRoot.innerHTML = `
      <style>
        :host{--dark:#1E293B;--navy:#0F172A;--green:#22C55E;--green-dark:#16A34A;--slate-600:#475569;--slate-500:#64748B;--gray-100:#F1F5F9;--gray-200:#E2E8F0;--gray-400:#94A3B8;display:block;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.6}
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        h2{font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:700;line-height:1.08}
        .why-section{padding:clamp(56px,7vw,92px) 20px;background:#fff;border-bottom:1px solid #F1F5F9}
        .container{max-width:1180px;margin:0 auto}
        .why-header{text-align:center;max-width:660px;margin:0 auto 48px}
        .why-eyebrow{font-weight:700;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:var(--green-dark);margin-bottom:12px}
        .why-header h2{font-size:clamp(28px,3.8vw,40px);letter-spacing:-0.03em;color:var(--navy);margin-bottom:14px}
        .why-header p{font-size:clamp(16px,2.2vw,18px);color:var(--slate-600)}
        .why-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:22px}
        .why-card{border-radius:18px;padding:30px 26px}
        .why-card.old-way{background:var(--gray-100);border:1px solid var(--gray-200)}
        .why-card.kygo-way{position:relative;background:#fff;border:2px solid var(--green);box-shadow:0 16px 40px -22px rgba(34,197,94,.4);transition:transform .25s ease-out,box-shadow .25s ease-out}
        .why-card-label{font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:700;font-size:12px;letter-spacing:1px;text-transform:uppercase;margin-bottom:18px}
        .why-card.old-way .why-card-label{color:var(--gray-400)}
        .why-card.kygo-way .why-card-label{color:var(--green-dark)}
        .why-rows{display:flex;flex-direction:column;gap:14px}
        .why-row{display:flex;align-items:flex-start;gap:12px}
        .why-badge{width:24px;height:24px;flex-shrink:0;border-radius:99px;display:flex;align-items:center;justify-content:center}
        .why-badge svg{width:13px;height:13px}
        .why-card.old-way .why-badge{background:var(--gray-200)}
        .why-card.kygo-way .why-badge{background:rgba(34,197,94,.14)}
        .why-item-text{font-size:15.5px;font-weight:500}
        .why-card.old-way .why-item-text{color:var(--slate-500)}
        .why-card.kygo-way .why-item-text{color:var(--dark)}

        /* Entry animations — gated on .visible so they fire when the section scrolls into view */
        @keyframes hiwUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes hiwRow{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes hiwPop{from{opacity:0;transform:scale(.55)}to{opacity:1;transform:scale(1)}}
        .why-eyebrow,.why-header h2,.why-header p,.why-card,.why-row,.why-badge{opacity:0}
        .why-section.visible .why-eyebrow{animation:hiwUp .6s ease-out 0s both}
        .why-section.visible .why-header h2{animation:hiwUp .6s ease-out .06s both}
        .why-section.visible .why-header p{animation:hiwUp .6s ease-out .12s both}
        .why-section.visible .why-card.old-way{animation:hiwUp .6s ease-out .18s both}
        .why-section.visible .why-card.kygo-way{animation:hiwUp .6s ease-out .26s both}
        .why-section.visible .why-row{animation:hiwRow .5s ease-out var(--row-delay) both}
        .why-section.visible .why-badge{animation:hiwPop .42s ease-out var(--pop-delay) both}
        .why-card.kygo-way:hover{transform:translateY(-4px);box-shadow:0 22px 48px -20px rgba(34,197,94,.45)}

        @media(prefers-reduced-motion:reduce){
          .why-eyebrow,.why-header h2,.why-header p,.why-card,.why-row,.why-badge{opacity:1!important;animation:none!important}
          .why-card.kygo-way:hover{transform:none}
        }
      </style>
      <section class="why-section">
        <div class="container">
          <div class="why-header">
            <div class="why-eyebrow">${eyebrow}</div>
            <h2>${headline}</h2>
            <p>${subheadline}</p>
          </div>
          <div class="why-grid">
            <div class="why-card old-way">
              <div class="why-card-label">The old way</div>
              <div class="why-rows">${rows(oldWay, 0.24, xIcon)}
              </div>
            </div>
            <div class="why-card kygo-way">
              <div class="why-card-label">The Kygo way</div>
              <div class="why-rows">${rows(kygoWay, 0.32, checkIcon)}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('kygo-problem-section', KygoProblemSection);


/* ========================================
   4. KYGO INSIGHTS STEPS (How it works — 3-step block)
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
    // Real Wix-hosted Kygo brand logos (connect-wearable rows). Keep in sync
    // with docs/assets-and-urls.md so the homepage matches the rest of the site.
    return {
      oura: 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png',
      garmin: 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png',
      fitbit: 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png',
      apple: 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png',
      whoop: 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png',
      google: 'https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png',
      health: 'https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png'
    };
  }
  render() {
    const icons = this.getWearableIcons();
    this.shadowRoot.innerHTML = `
      <style>
        :host{--dark:#0F172A;--green:#22C55E;--green-dark:#16A34A;--navy:#1E293B;--navy-deep:#0F172A;--canvas:#F8FAFC;--slate-100:#F1F5F9;--border:#E2E8F0;--body:#475569;--label:#64748B;display:block;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;color:var(--dark);line-height:1.6;-webkit-font-smoothing:antialiased}
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        @keyframes hiwUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes hiwPop{from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:none}}
        .insights-section{padding:clamp(56px,7vw,92px) 20px;background:var(--canvas)}
        .container{max-width:1180px;margin:0 auto}
        .section-header{text-align:center;max-width:640px;margin:0 auto 48px}
        .kicker{font-weight:700;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:var(--green-dark);margin-bottom:12px}
        .section-header h2{font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:700;font-size:clamp(28px,3.8vw,40px);line-height:1.08;letter-spacing:-0.03em;color:var(--dark);margin-bottom:14px}
        .section-subtitle{font-size:clamp(16px,2.2vw,18px);color:var(--body)}
        .steps-container{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
        .step-card{position:relative;overflow:hidden;display:flex;flex-direction:column;background:#fff;border:2px solid var(--border);border-radius:18px;padding:28px 24px;box-shadow:0 4px 12px rgba(15,23,42,.04);transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease}
        .step-card:hover{transform:translateY(-5px);border-color:var(--green);box-shadow:0 18px 40px -22px rgba(15,23,42,.4)}
        .ghost-num{position:absolute;top:10px;right:18px;font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:700;font-size:66px;line-height:1;color:var(--slate-100);pointer-events:none;user-select:none}
        .step-icon{position:relative;width:46px;height:46px;border-radius:13px;background:linear-gradient(135deg,#22C55E,#16A34A);display:flex;align-items:center;justify-content:center;margin-bottom:16px;box-shadow:0 8px 16px -8px rgba(34,197,94,.7)}
        .step-icon svg{width:23px;height:23px}
        .step-card h3{font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:700;font-size:21px;color:var(--dark);margin-bottom:8px;line-height:1.2}
        .step-card p{font-size:15px;color:var(--body);margin-bottom:20px}
        .hfoot{margin-top:auto;padding-top:18px;border-top:1px solid var(--slate-100)}
        .hfoot-methods{display:flex;justify-content:center;gap:10px}
        .hfoot-devices{display:flex;flex-wrap:nowrap;align-items:flex-start;justify-content:center;gap:6px}
        .hfoot-results{display:flex;align-items:center;gap:8px;min-height:82px}
        .chip{display:flex;flex-direction:column;align-items:center;gap:6px;transition:transform .18s ease}
        .chip:hover{transform:translateY(-3px)}
        .chip-tile{width:40px;height:40px;flex-shrink:0;border-radius:11px;border:1px solid var(--border);background:var(--canvas);display:flex;align-items:center;justify-content:center}
        .chip-tile svg{width:19px;height:19px}
        .chip-tile.device{overflow:hidden;background:#fff;padding:0}
        .chip-tile.device img{width:100%;height:100%;object-fit:cover;border-radius:10px}
        .chip-label{font-size:10px;font-weight:600;color:var(--label);white-space:nowrap}
        /* 7 device chips: the step cards get narrow at some widths (3-up grid on
           small laptops, 1-up on phones), so scale the tiles down where the card
           can't hold the row — the strip always stays on a single line. */
        @media(max-width:1199px){.hfoot-devices{gap:4px}.chip-tile{width:34px;height:34px}.chip-label{font-size:9px}}
        @media(max-width:899px){.hfoot-devices{gap:4px}.chip-tile{width:38px;height:38px}.chip-label{font-size:9.5px}}
        /* one card per row below 768 so the 7-chip strip has the full width */
        @media(max-width:767px){.steps-container{grid-template-columns:1fr}.hfoot-devices{gap:6px}.chip-tile{width:40px;height:40px}.chip-label{font-size:10px}}
        @media(max-width:420px){.hfoot-devices{gap:4px}.chip-tile{width:36px;height:36px}.chip-label{font-size:9.5px}}
        .result-pill{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;border-radius:12px;padding:8px 11px;line-height:1.25}
        .result-pill.good{background:#F0FDF4;border:1px solid #BBF7D0}
        .result-pill.bad{background:#FEF2F2;border:1px solid #FECACA}
        .result-line{font-size:12.5px;font-weight:600;color:var(--label);white-space:nowrap}
        .result-line .arrow{font-weight:700}
        .result-pill.good .arrow{color:var(--green-dark)}
        .result-pill.bad .arrow{color:#EF4444}
        .result-stat{font-family:'Space Grotesk',-apple-system,sans-serif;font-size:11.5px;font-weight:700}
        .result-pill.good .result-stat{color:var(--green-dark)}
        .result-pill.bad .result-stat{color:#EF4444}
        .steps-cta{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:40px}
        .cta-primary{display:inline-flex;align-items:center;gap:9px;background:var(--green);color:#fff;font-weight:600;font-size:16px;padding:15px 26px;border-radius:12px;white-space:nowrap;text-decoration:none;box-shadow:0 10px 24px -8px rgba(34,197,94,.5);transition:transform .2s ease,background .2s ease,box-shadow .2s ease;cursor:pointer;border:none;font-family:inherit}
        .cta-primary:hover{background:var(--green-dark);transform:translateY(-2px);box-shadow:0 14px 30px -10px rgba(34,197,94,.6)}
        .cta-primary svg{width:20px;height:20px;flex-shrink:0}
        .cta-android{display:inline-flex;align-items:center;gap:9px;background:var(--navy);color:#fff;font-weight:600;font-size:16px;padding:15px 26px;border-radius:12px;white-space:nowrap;text-decoration:none;transition:transform .2s ease,background .2s ease,box-shadow .2s ease;cursor:pointer;border:none;font-family:inherit}
        .cta-android:hover{background:var(--navy-deep);transform:translateY(-2px)}
        .cta-android svg{width:20px;height:20px;flex-shrink:0}
        /* Entrance animations, gated on .reveal so they play when scrolled into view */
        .reveal .kicker{animation:hiwUp .6s ease-out both}
        .reveal .section-header h2{animation:hiwUp .6s ease-out .06s both}
        .reveal .section-subtitle{animation:hiwUp .6s ease-out .12s both}
        .reveal .step-card:nth-child(1){animation:hiwUp .6s ease-out .16s both}
        .reveal .step-card:nth-child(2){animation:hiwUp .6s ease-out .24s both}
        .reveal .step-card:nth-child(3){animation:hiwUp .6s ease-out .32s both}
        .reveal .hfoot .chip,.reveal .hfoot .result-pill{animation:hiwPop .5s ease-out both}
        .reveal .hfoot .chip:nth-child(1),.reveal .hfoot .result-pill:nth-child(1){animation-delay:.30s}
        .reveal .hfoot .chip:nth-child(2),.reveal .hfoot .result-pill:nth-child(2){animation-delay:.38s}
        .reveal .hfoot .chip:nth-child(3){animation-delay:.46s}
        .reveal .hfoot .chip:nth-child(4){animation-delay:.54s}
        .reveal .hfoot .chip:nth-child(5){animation-delay:.62s}
        @media(max-width:480px){
          /* Stack the store buttons and give them a single, consistent width */
          .steps-cta{flex-direction:column;align-items:center}
          .cta-primary,.cta-android{width:100%;max-width:320px;justify-content:center}
          /* Keep the result pills to a single line on small screens */
          .result-pill{padding:8px 8px}
          .result-line{font-size:11px}
        }
        @media(max-width:360px){
          .step-card{padding:24px 18px}
          .hfoot-devices{gap:3px}
          .chip-tile{width:31px;height:31px}
          .chip-label{font-size:8.5px}
          .result-line{font-size:10.5px}
        }
        @media(prefers-reduced-motion:reduce){*{animation:none !important}}
      </style>
      <section class="insights-section">
        <div class="container">
          <div class="section-header">
            <div class="kicker">How it works</div>
            <h2>From first meal to real answers</h2>
            <p class="section-subtitle">Three steps. About a week of logging. Patterns you can actually act on.</p>
          </div>
          <div class="steps-container">
            <div class="step-card" data-step="1">
              <span class="ghost-num" aria-hidden="true">01</span>
              <span class="step-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></span>
              <h3>Log your food</h3>
              <p>Photo, voice, barcode, or text. Logging takes seconds and Kygo does the counting so you don't have to.</p>
              <div class="hfoot hfoot-methods">
                <span class="chip">
                  <span class="chip-tile"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></span>
                  <span class="chip-label">Photo</span>
                </span>
                <span class="chip">
                  <span class="chip-tile"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4"/></svg></span>
                  <span class="chip-label">Voice</span>
                </span>
                <span class="chip">
                  <span class="chip-tile"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2"><path d="M3 5v14M7 5v14M11 5v14M15 5v14M19 5v14"/></svg></span>
                  <span class="chip-label">Barcode</span>
                </span>
                <span class="chip">
                  <span class="chip-tile"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
                  <span class="chip-label">Chat</span>
                </span>
              </div>
            </div>
            <div class="step-card" data-step="2">
              <span class="ghost-num" aria-hidden="true">02</span>
              <span class="step-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="5.5"/><path d="M12 9.5V12l1.6 1.2"/><path d="M8.6 6.6 8 3.4A1 1 0 0 1 9 2.2h6a1 1 0 0 1 1 1.2l-.6 3.2"/><path d="m8.6 17.4-.6 3.2a1 1 0 0 0 1 1.2h6a1 1 0 0 0 1-1.2l-.6-3.2"/></svg></span>
              <h3>Connect your wearable</h3>
              <p>One device or five, we sync them all, then prioritize the most accurate source for each metric automatically.</p>
              <div class="hfoot hfoot-devices">
                <span class="chip">
                  <span class="chip-tile device"><img src="${icons.oura}" alt="Oura" loading="lazy"/></span>
                  <span class="chip-label">Oura</span>
                </span>
                <span class="chip">
                  <span class="chip-tile device"><img src="${icons.garmin}" alt="Garmin" loading="lazy"/></span>
                  <span class="chip-label">Garmin</span>
                </span>
                <span class="chip">
                  <span class="chip-tile device"><img src="${icons.fitbit}" alt="Fitbit" loading="lazy"/></span>
                  <span class="chip-label">Fitbit</span>
                </span>
                <span class="chip">
                  <span class="chip-tile device"><img src="${icons.whoop}" alt="WHOOP" loading="lazy"/></span>
                  <span class="chip-label">WHOOP</span>
                </span>
                <span class="chip">
                  <span class="chip-tile device"><img src="${icons.apple}" alt="Apple Health" loading="lazy"/></span>
                  <span class="chip-label">Apple</span>
                </span>
                <span class="chip">
                  <span class="chip-tile device"><img src="${icons.google}" alt="Google Health" loading="lazy"/></span>
                  <span class="chip-label">Google</span>
                </span>
                <span class="chip">
                  <span class="chip-tile device"><img src="${icons.health}" alt="Health Connect" loading="lazy"/></span>
                  <span class="chip-label">Health</span>
                </span>
              </div>
            </div>
            <div class="step-card" data-step="3">
              <span class="ghost-num" aria-hidden="true">03</span>
              <span class="step-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 3l1.9 5.2L19 10l-5.1 1.8L12 17l-1.9-5.2L5 10l5.1-1.8z"/></svg></span>
              <h3>Discover your patterns</h3>
              <p>Kygo connects your meals and your metrics to show which foods are helping or hurting your sleep, energy, and recovery.</p>
              <div class="hfoot hfoot-results">
                <span class="result-pill good">
                  <span class="result-line"><span class="arrow">&#8593;</span> Dinner before 7pm</span>
                  <span class="result-stat">+23 min sleep</span>
                </span>
                <span class="result-pill bad">
                  <span class="result-line"><span class="arrow">&#8595;</span> Late caffeine</span>
                  <span class="result-stat">&#8722;9 pt Sleep</span>
                </span>
              </div>
            </div>
          </div>
          <div class="steps-cta">
            <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" target="_blank" rel="noopener" class="cta-primary" aria-label="Download Kygo on the App Store" data-track-position="bottom" data-track-label="home-insights-ios">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <span>Download for iOS</span>
            </a>
            <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" target="_blank" rel="noopener" class="cta-android" data-action="android-download" aria-label="Download Kygo on Google Play" data-track-position="bottom" data-track-label="home-insights-android">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
              <span>Download for Android</span>
            </a>
          </div>
        </div>
      </section>
    `;
  }
  setupAnimations() {
    const section = this.shadowRoot.querySelector('.insights-section');
    if (!section) return;
    if ('IntersectionObserver' in window) {
      this.animationObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
      this.animationObserver.observe(section);
    } else {
      section.classList.add('reveal');
    }
  }
}
customElements.define('kygo-insights-steps', KygoInsightsSteps);


/* ========================================
   5. KYGO CORRELATIONS OVERVIEW
   Tag: kygo-correlations-overview
   Dark navy section: narrative copy + an example correlation card with an
   IntersectionObserver-driven contributor panel that expands in view.
======================================== */
class KygoCorrelationsOverview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
    this._revealObserver = null;
    this._panelObserver = null;
    this._panelTimer = null;
  }
  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._setupReveal();
    this._setupContributorPanel();
    __seo(this, 'How Kygo correlations work — Kygo finds personal food-body patterns from your own logged data, not generic studies. Example: caffeine over 95mg after 2pm lowers HRV by about 8 ms (32 ms on low-caffeine days vs 24 ms on high-caffeine days), based on 47 days compared and measured one day later. Findings build confidence over time — Developing, then Emerging, then Likely Real — and every correlation opens to the meals behind it (coffee 62%, pre-workout 28%, chocolate 10%).');
  }
  disconnectedCallback() {
    if (this._revealObserver) this._revealObserver.disconnect();
    if (this._panelObserver) this._panelObserver.disconnect();
    clearTimeout(this._panelTimer);
  }
  static get observedAttributes() { return ['wixsettings']; }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this._parseWixAttributes();
    this.render();
    this._setupReveal();
    this._setupContributorPanel();
  }
  _parseWixAttributes() {
    try {
      const wixsettings = this.getAttribute('wixsettings');
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {}
  }
  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }
  _setupReveal() {
    requestAnimationFrame(() => {
      const section = this.shadowRoot.querySelector('.corr-section');
      if (!section) return;
      if ('IntersectionObserver' in window) {
        this._revealObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
        this._revealObserver.observe(section);
      } else {
        section.classList.add('reveal');
      }
    });
  }
  _setupContributorPanel() {
    requestAnimationFrame(() => {
      const anchor = this.shadowRoot.querySelector('.compare');
      const panel = this.shadowRoot.querySelector('.panel');
      if (!anchor || !panel) return;
      if (!('IntersectionObserver' in window)) { panel.classList.add('expanded'); return; }
      // Expand once the comparison bars are well in view, then leave it open —
      // no re-collapse on scroll-away (that read as jumpy / half-open).
      this._panelObserver = new IntersectionObserver((entries, obs) => {
        if (entries.some(e => e.isIntersecting)) {
          this._panelTimer = setTimeout(() => panel.classList.add('expanded'), 220);
          obs.disconnect();
        }
      }, { threshold: 0.6, rootMargin: '0px 0px -40px 0px' });
      this._panelObserver.observe(anchor);
    });
  }
  render() {
    const kicker = this._getSetting('kicker', 'How correlations work');
    const heading = this._getSetting('heading', 'Patterns only your data could show.');
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        :host{--green:#22C55E;--green-dark:#16A34A;display:block;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:#0F172A;color:#1E293B;line-height:1.6;-webkit-font-smoothing:antialiased}
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        @keyframes hiwUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .corr-section{position:relative;background:#0F172A;padding:clamp(44px,5.5vw,72px) 0;overflow:hidden}
        .corr-glow{position:absolute;top:-180px;right:-120px;width:600px;height:600px;background:radial-gradient(circle,rgba(34,197,94,.16) 0%,transparent 62%);pointer-events:none}
        .corr-grid{position:relative;max-width:1200px;margin:0 auto;padding:0 20px;display:grid;grid-template-columns:minmax(0,1fr);gap:32px;align-items:center}
        .kicker{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#22C55E;margin-bottom:12px}
        .corr-copy h2{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(28px,3.4vw,40px);line-height:1.08;letter-spacing:-0.03em;color:#fff;margin-bottom:16px}
        .corr-copy p{font-size:clamp(16px,2vw,18px);color:#94A3B8;margin-bottom:14px}
        .corr-copy p.p2{margin-bottom:26px}
        .ladder{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
        .ladder .pill{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:12px;letter-spacing:.4px;padding:6px 12px;border-radius:6px;white-space:nowrap}
        .ladder .arrow{color:#475569}
        @media(max-width:480px){
          .ladder{flex-wrap:nowrap;gap:5px}
          .ladder .pill{font-size:10.5px;letter-spacing:.2px;padding:5px 7px}
          .ladder .arrow{font-size:11px}
        }
        .pill.developing{color:#94A3B8;background:rgba(255,255,255,.07)}
        .pill.emerging{color:#CBD5E1;background:rgba(255,255,255,.14)}
        .pill.likely{color:#22C55E;background:rgba(34,197,94,.16)}
        .wcard{background:#fff;border:2px solid #E2E8F0;border-radius:20px;padding:22px 18px;box-shadow:0 20px 40px -20px rgba(0,0,0,.5);transition:border-color .3s ease,box-shadow .3s ease,transform .3s ease}
        .wcard:hover{border-color:#22C55E;box-shadow:0 16px 36px rgba(0,0,0,.28);transform:translateY(-4px)}
        .wcard-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px}
        .wcard-eyebrow{font-size:11px;font-weight:700;letter-spacing:.6px;color:#94A3B8;margin-bottom:4px}
        .wcard-title{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(19px,4.5vw,22px);color:#0F172A;line-height:1.2}
        .delta{flex-shrink:0;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;color:#EF4444;background:#FEF2F2;padding:6px 12px;border-radius:999px;white-space:nowrap}
        .compare{display:flex;flex-direction:column;gap:12px;background:#F5F7FA;border-radius:14px;padding:16px}
        .crow{display:flex;align-items:center;gap:12px}
        .crow-label{width:104px;flex-shrink:0;font-size:12.5px;color:#475569}
        .crow-label .days{color:#94A3B8}
        .crow-track{flex:1;min-width:40px;height:9px;background:#E2E8F0;border-radius:99px;overflow:hidden}
        .crow-fill{display:block;height:100%;border-radius:99px}
        .crow-val{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;color:#0F172A;width:44px;text-align:right}
        .panel{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows .55s cubic-bezier(.4,0,.2,1),opacity .4s ease-out}
        .panel.expanded{grid-template-rows:1fr;opacity:1}
        .panel-inner{overflow:hidden;min-height:0}
        .panel-pad{padding-top:20px}
        .panel-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:11px}
        .panel-head .lbl{font-size:11px;font-weight:700;letter-spacing:.6px;color:#94A3B8}
        .panel-head .total{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;color:#0F172A}
        .seg{display:flex;gap:3px;height:14px;border-radius:99px;overflow:hidden;margin-bottom:14px}
        .seg span{border-radius:99px}
        .legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px}
        .legend .item{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
        .legend .dot{width:8px;height:8px;border-radius:99px;flex-shrink:0}
        .legend .name{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;color:#0F172A}
        .legend .pct{font-size:12.5px;color:#64748B}
        .chips{display:flex;flex-wrap:nowrap;align-items:center;gap:8px;margin-top:20px;padding-top:18px;border-top:1px solid #F1F5F9}
        .chip{display:inline-flex;align-items:center;font-weight:600;font-size:12.5px;padding:6px 12px;border-radius:999px;white-space:nowrap;background:#F1F5F9;color:#475569}
        .chip.real{gap:6px;background:#ECFDF5;color:#16A34A;font-weight:700}
        .chip.real svg{width:13px;height:13px}
        @media(max-width:480px){.chips{gap:7px}.chip{font-size:12px;padding:5px 10px}.chip.real{gap:5px}.chip.real svg{width:12px;height:12px}}
        @media(max-width:339px){.chips{flex-wrap:wrap}}
        .corr-section.reveal .corr-copy{animation:hiwUp .6s ease-out both}
        .corr-section.reveal .wcard{animation:hiwUp .6s ease-out .1s both}
        @media(min-width:480px){
          .wcard{padding:clamp(24px,2.4vw,30px)}
          .compare{gap:14px;padding:18px 20px}
          .crow{gap:14px}
          .crow-label{width:152px;font-size:13px}
          .crow-track{min-width:60px}
          .crow-val{font-size:15px;width:52px}
          .wcard-title{font-size:22px}
        }
        @media(min-width:900px){
          .corr-grid{padding:0 40px;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:clamp(40px,5vw,72px)}
        }
        @media(prefers-reduced-motion:reduce){
          .corr-section.reveal .corr-copy,.corr-section.reveal .wcard{animation:none}
          .wcard:hover{transform:none}
          .panel{transition:none;grid-template-rows:1fr;opacity:1}
        }
      </style>
      <section class="corr-section">
        <div class="corr-glow"></div>
        <div class="corr-grid">
          <div class="corr-copy">
            <div class="kicker">${kicker}</div>
            <h2>${heading}</h2>
            <p>See how your body responds every time a food shows up in your log.</p>
            <p class="p2">Patterns surface once they've held up long enough to trust, and every finding opens to the meals behind it.</p>
            <div class="ladder">
              <span class="pill developing">DEVELOPING</span>
              <span class="arrow">&#8594;</span>
              <span class="pill emerging">EMERGING</span>
              <span class="arrow">&#8594;</span>
              <span class="pill likely">LIKELY REAL</span>
            </div>
          </div>
          <div class="wcard">
            <div class="wcard-head">
              <div>
                <div class="wcard-eyebrow">LATE CAFFEINE &#8594; HRV</div>
                <div class="wcard-title">Over 95mg of caffeine after 2pm drops HRV by 8ms next day</div>
              </div>
              <span class="delta">&#8722;8 ms</span>
            </div>
            <div class="compare">
              <div class="crow">
                <span class="crow-label">Under 95mg <span class="days">&#183; 31 days</span></span>
                <span class="crow-track"><span class="crow-fill" style="width:72%;background:#64748B"></span></span>
                <span class="crow-val">32 ms</span>
              </div>
              <div class="crow">
                <span class="crow-label">Over 95mg <span class="days">&#183; 16 days</span></span>
                <span class="crow-track"><span class="crow-fill" style="width:48%;background:#EF4444"></span></span>
                <span class="crow-val">24 ms</span>
              </div>
            </div>
            <div class="panel">
              <div class="panel-inner">
                <div class="panel-pad">
                  <div class="panel-head">
                    <span class="lbl">WHERE THE CAFFEINE CAME FROM</span>
                    <span class="total">365mg</span>
                  </div>
                  <div class="seg">
                    <span style="width:62%;background:#EF4444"></span>
                    <span style="width:28%;background:#F87171"></span>
                    <span style="width:10%;background:#CBD5E1"></span>
                  </div>
                  <div class="legend">
                    <span class="item"><span class="dot" style="background:#EF4444"></span><span class="name">Coffee</span><span class="pct">62%</span></span>
                    <span class="item"><span class="dot" style="background:#F87171"></span><span class="name">Pre-workout</span><span class="pct">28%</span></span>
                    <span class="item"><span class="dot" style="background:#CBD5E1"></span><span class="name">Chocolate</span><span class="pct">10%</span></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="chips">
              <span class="chip real"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Likely real</span>
              <span class="chip">47 days</span>
              <span class="chip">Next-day effect</span>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('kygo-correlations-overview', KygoCorrelationsOverview);


/* ========================================
   6. KYGO FEATURES USERS LOVE
   Tag: kygo-features-users-love
   Gray-50 section: centered header + six equal feature cards.
======================================== */
class KygoFeaturesUsersLove extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
    this._observer = null;
  }
  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._setupReveal();
    __seo(this, 'Features Kygo users love — the everyday details that keep you logging past week two. Dietitian Verified Database: over 5 million foods cross-checked against USDA, with full vitamin and mineral detail, not just macros. Track Your Supplement Stack by voice and see whether it moved anything. Water and Weight sit next to your macros on the Today screen. Best Source Wins: when two wearables disagree, Kygo knows which one to trust for each metric. Run an Experiment: put one food on trial for two weeks and get a verdict. One Tap Repeats for saved foods, reusable meals, and yesterday’s dinner.');
  }
  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }
  static get observedAttributes() { return ['wixsettings']; }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this._parseWixAttributes();
    this.render();
    this._setupReveal();
  }
  _parseWixAttributes() {
    try {
      const wixsettings = this.getAttribute('wixsettings');
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {}
  }
  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }
  _setupReveal() {
    requestAnimationFrame(() => {
      const section = this.shadowRoot.querySelector('.ful-section');
      if (!section) return;
      if ('IntersectionObserver' in window) {
        this._observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
        this._observer.observe(section);
      } else {
        section.classList.add('reveal');
      }
    });
  }
  render() {
    const kicker = this._getSetting('kicker', 'Features our users love');
    const heading = this._getSetting('heading', "The details you'll use every day");
    const lead = this._getSetting('lead', 'Not the headline features. The ones that keep you logging past week two.');
    const cards = [
      { t: 'Dietitian Verified Database', p: 'Over 5 million foods, cross checked against USDA. Full vitamin and mineral detail, not just macros.', svg: '<path d="M20 6.5V17c0 1.7-3.6 3-8 3s-8-1.3-8-3V6.5"/><ellipse cx="12" cy="6.5" rx="8" ry="3"/><path d="M9 13.2l2 2 4-4"/>' },
      { t: 'Track Your Supplement Stack', p: 'Build your stack, log it by voice, keep the streak. Then see whether it moved anything.', svg: '<path d="M11.5 21.5a4.95 4.95 0 0 1-7-7l7-7a4.95 4.95 0 0 1 7 7z"/><path d="M8 13l6-6"/>' },
      { t: 'Water and Weight, Same View', p: 'Hydration and weight sit next to your macros on the Today screen. One glance, whole day.', svg: '<path d="M12 2.7l4.9 6.6a6.1 6.1 0 1 1-9.8 0z"/><path d="M9.5 14.5h5"/>' },
      { t: 'Best Source Wins', p: 'Wear two devices and they will disagree. Kygo knows which one to trust for each metric.', svg: '<path d="M12 3v18"/><path d="M4 8h16"/><path d="M4 8l-2 6h6z"/><path d="M18 8l-2 6h6z"/>' },
      { t: 'Run an Experiment', p: 'Put one food on trial for two weeks. Kygo tracks the days and gives you a verdict.', svg: '<path d="M9 3h6"/><path d="M10 3v5.5L5.2 18A2 2 0 0 0 7 21h10a2 2 0 0 0 1.8-3L14 8.5V3"/><path d="M7.5 14h9"/>' },
      { t: 'One Tap Repeats', p: "Saved foods, reusable meals, and yesterday's dinner copied straight into today.", svg: '<path d="M4 9V7a3 3 0 0 1 3-3h10"/><path d="M14 1.5L17 4l-3 2.5"/><path d="M20 15v2a3 3 0 0 1-3 3H7"/><path d="M10 22.5L7 20l3-2.5"/>' }
    ];
    const cardHtml = cards.map(c => `
            <div class="fcard">
              <div class="fcard-row">
                <span class="fic"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${c.svg}</svg></span>
                <div>
                  <h3>${c.t}</h3>
                  <p>${c.p}</p>
                </div>
              </div>
            </div>`).join('');
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        :host{--green:#22C55E;--green-dark:#16A34A;display:block;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:#f9fafb;color:#1E293B;line-height:1.6;-webkit-font-smoothing:antialiased}
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        @keyframes hiwUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .ful-section{padding:clamp(48px,6vw,80px) 0;background:#f9fafb}
        .container{max-width:1200px;margin:0 auto;padding:0 20px}
        .ful-head{text-align:center;max-width:660px;margin:0 auto 48px}
        .kicker{font-weight:700;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#16A34A;margin-bottom:12px}
        .ful-head h2{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(28px,3.8vw,40px);line-height:1.08;letter-spacing:-0.03em;color:#0F172A;margin-bottom:14px}
        .ful-head p{font-size:clamp(16px,2.2vw,18px);color:#475569}
        .ful-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:20px}
        .fcard{background:#fff;border:2px solid #E2E8F0;border-radius:20px;padding:clamp(24px,3vw,32px) clamp(20px,2.6vw,28px);box-shadow:0 4px 12px rgba(0,0,0,0.04);transition:border-color .3s ease,box-shadow .3s ease,transform .6s ease-out}
        .fcard:hover{border-color:#22C55E;box-shadow:0 12px 32px rgba(0,0,0,0.08);transform:translateY(-4px)}
        .fcard-row{display:flex;align-items:flex-start;gap:14px}
        .fic{flex-shrink:0;display:flex;width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#22C55E,#16A34A);align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(34,197,94,0.25)}
        .fic svg{width:24px;height:24px}
        .fcard h3{font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:600;line-height:1.2;font-size:clamp(18px,4.5vw,20px);color:#1E293B;margin-bottom:4px;transition:color .3s ease}
        .fcard:hover h3{color:#16A34A}
        .fcard p{color:#475569;font-size:clamp(13px,3.5vw,14px);line-height:1.5}
        .ful-section.reveal .ful-head{animation:hiwUp .6s ease-out both}
        .ful-section.reveal .fcard{animation:hiwUp .6s ease-out both}
        .ful-section.reveal .fcard:nth-child(1){animation-delay:.08s}
        .ful-section.reveal .fcard:nth-child(2){animation-delay:.16s}
        .ful-section.reveal .fcard:nth-child(3){animation-delay:.24s}
        .ful-section.reveal .fcard:nth-child(4){animation-delay:.32s}
        .ful-section.reveal .fcard:nth-child(5){animation-delay:.40s}
        .ful-section.reveal .fcard:nth-child(6){animation-delay:.48s}
        @media(max-width:600px){
          .ful-head{margin-bottom:28px}
          .ful-grid{gap:12px}
          .fcard{padding:16px 16px;border-radius:16px}
          .fcard-row{gap:12px}
          .fic{width:40px;height:40px;border-radius:10px;box-shadow:0 3px 9px rgba(34,197,94,0.22)}
          .fic svg{width:20px;height:20px}
          .fcard h3{font-size:16px;margin-bottom:2px}
          .fcard p{font-size:13px;line-height:1.45}
        }
        @media(prefers-reduced-motion:reduce){
          .ful-section.reveal .ful-head,.ful-section.reveal .fcard{animation:none}
          .fcard:hover{transform:none}
        }
      </style>
      <section class="ful-section">
        <div class="container">
          <div class="ful-head">
            <div class="kicker">${kicker}</div>
            <h2>${heading}</h2>
            <p>${lead}</p>
          </div>
          <div class="ful-grid">${cardHtml}
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('kygo-features-users-love', KygoFeaturesUsersLove);


/* ========================================
   7. KYGO FOUNDER (Why I built Kygo — below Features Users Love)
   Tag: kygo-founder
   Compact dark founder card that sits ABOVE the FAQ (see kygo-home order).
   A visible lead paragraph plus a "Read the full story" toggle that expands
   the pull-quote and closing paragraphs. Entrance reveal is pure CSS.
======================================== */
class KygoFounder extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.render();
    this.setupToggle();
    this._observer = __revealOnScroll(this.shadowRoot.querySelector('.founder-story'));
    __seo(this, 'Why I built Kygo — a note from Ryan, Founder of Kygo Health. I wanted logging that takes seconds, not minutes — and insights that align to your individual metrics and diet, not generic advice. That is why I built Kygo. "Your sleep latency increases 8 minutes when you consume caffeine after 3pm." That is not from a study — that is YOUR body telling you something specifically. Kygo brings everything together and automatically finds the correlations that matter. No more guessing. No more generic advice. Just personalized insights based on YOUR data. I hope Kygo can make a positive impact in your life as well.');
  }
  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }
  setupToggle() {
    const note = this.shadowRoot.querySelector('.founder-note');
    const btn = this.shadowRoot.querySelector('.founder-toggle');
    if (!note || !btn) return;
    const label = btn.childNodes[0];
    btn.addEventListener('click', () => {
      const open = note.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (label) label.nodeValue = open ? 'Show less ' : 'Read the full story ';
    });
  }
  render() {
    const founderName = this.getAttribute('founder-name') || 'Ryan';
    const founderTitle = this.getAttribute('founder-title') || 'Founder, Kygo Health';
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;--dark:#1E293B;--green:#22C55E;--green-dark:#16A34A;--gray-400:#94A3B8;--gray-700:#334155;line-height:1.6;-webkit-font-smoothing:antialiased}
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        h4{font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:600;line-height:1.2}
        @keyframes revealUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        .container{max-width:1200px;margin:0 auto;padding:0 20px}
        .founder-story{padding:48px 0;background:#0F172A;position:relative;overflow:hidden}
        .founder-story::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");pointer-events:none}
        .founder-content{max-width:720px;margin:0 auto;position:relative;z-index:1}
        .founder-note{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:26px 28px}
        .founder-story.reveal .founder-note{animation:revealUp .6s ease-out both}
        @media(prefers-reduced-motion:reduce){.founder-story.reveal .founder-note{animation:none}}
        .founder-note-head{display:flex;align-items:center;gap:14px;margin-bottom:16px}
        .founder-avatar{width:46px;height:46px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:rgba(34,197,94,0.12);border-radius:50%;padding:9px}
        .founder-avatar img{width:100%;height:100%;object-fit:contain}
        .founder-eyebrow{font-family:'Space Grotesk',-apple-system,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:#4ADE80;margin-bottom:3px}
        .founder-info h4{color:#fff;font-size:15px;font-weight:600;line-height:1.25}
        .founder-info h4 span{color:var(--gray-400);font-weight:500}
        .founder-lead{color:#CBD5E1;font-size:15.5px;line-height:1.75}
        .founder-more{max-height:0;overflow:hidden;opacity:0;transition:max-height .4s ease,opacity .35s ease,margin-top .4s ease}
        .founder-note.open .founder-more{max-height:640px;opacity:1;margin-top:18px}
        .founder-quote{background:rgba(34,197,94,0.1);border-left:4px solid var(--green);padding:16px 20px;border-radius:0 12px 12px 0;margin-bottom:16px}
        .founder-quote p{color:#fff;font-style:italic;font-size:15.5px;line-height:1.6}
        .founder-more>p{color:var(--gray-400);font-size:15px;line-height:1.75;margin-bottom:14px}
        .founder-more>p:last-child{margin-bottom:0}
        .founder-toggle{margin-top:16px;background:none;border:none;cursor:pointer;color:#4ADE80;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:8px;padding:0;transition:color .2s ease}
        .founder-toggle:hover{color:#6EE7A0}
        .founder-toggle .chev{transition:transform .3s ease;display:inline-block;font-size:15px}
        .founder-note.open .founder-toggle .chev{transform:rotate(90deg)}
        @media(prefers-reduced-motion:reduce){.founder-note{animation:none}}
        @media(min-width:768px){
          .founder-story{padding:64px 0}
          .founder-note{padding:32px 34px}
        }
      </style>
      <section class="founder-story">
        <div class="container">
          <div class="founder-content">
            <div class="founder-note">
              <div class="founder-note-head">
                <div class="founder-avatar"><img src="${logoUrl}" alt="Kygo Health"></div>
                <div class="founder-info">
                  <div class="founder-eyebrow">Why I built Kygo</div>
                  <h4>${founderName} <span>· ${founderTitle}</span></h4>
                </div>
              </div>
              <p class="founder-lead">I wanted logging that takes seconds, not minutes — and insights that align to your individual metrics and diet, not generic advice. That's why I built Kygo.</p>
              <div class="founder-more">
                <div class="founder-quote">
                  <p>"Your sleep latency increases 8 minutes when you consume caffeine after 3pm." That's not from a study—that's YOUR body telling you something specifically.</p>
                </div>
                <p>Kygo brings everything together and automatically finds the correlations that matter. No more guessing. No more generic advice. Just personalized insights based on YOUR data.</p>
                <p>I hope Kygo can make a positive impact in your life as well.</p>
              </div>
              <button class="founder-toggle" type="button" aria-expanded="false">Read the full story <span class="chev">→</span></button>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('kygo-founder', KygoFounder);


/* ========================================
   8. KYGO TESTIMONIALS (approved, anonymized user quotes)
   Tag: kygo-testimonials
   Continuously auto-scrolling social-proof marquee rendered between the FAQ
   and the final CTA (see kygo-home wrapper order). Star-rated cards with a
   green initial-avatar; the set is duplicated once for a seamless loop, the
   marquee pauses on hover, and it falls back to a scrollable row under
   prefers-reduced-motion.
======================================== */
class KygoTestimonials extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }
  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._observer = __revealOnScroll(this.shadowRoot.querySelector('.testimonials-section'));
    __seo(this, 'What Kygo users say: "I\'ve boosted my deep sleep after making changes to stop the age-related slow-wave decline." (Oura user) "I love the experiments and the insights, like seeing how fat impacts my sleep." (Kygo user) "I always get excited when I see your posts. The research is truly valued, and the app is amazing." (Oura user) "Insights into how different nutrients impact my sleep and resting heart rate keep me engaged." (App Store review) "Very interesting. I noticed not getting enough time in bed was the biggest impact for me. Once I fixed that, my stats improved." (Oura user)');
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
  }
  render() {
    const stars = `<div class="t-stars">${Array(5).fill('<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.6 5.7 6.2.6-4.7 4.2 1.4 6.1L12 19.9 6.5 19.1l1.4-6.1L3.2 8.8l6.2-.6z"/></svg>').join('')}</div>`;
    const card = (q, a, dup) => `<figure class="t-card"${dup ? ' aria-hidden="true"' : ''}><blockquote>${stars}<p>${q}</p></blockquote><figcaption><span class="t-avatar">${a.charAt(0)}</span><span class="t-meta"><span class="t-name">${a}</span></span></figcaption></figure>`;
    const data = [
      ['"I\'ve boosted my deep sleep after making changes to stop the age-related slow-wave decline."', 'Oura user'],
      ['"I love the experiments and the insights, like seeing how fat impacts my sleep."', 'Kygo user'],
      ['"I always get excited when I see your posts. The research is truly valued, and the app is amazing."', 'Oura user'],
      ['"Insights into how different nutrients impact my sleep and resting heart rate keep me engaged."', 'App Store review'],
      ['"Very interesting. I noticed not getting enough time in bed was the biggest impact for me. Once I fixed that, my stats improved."', 'Oura user']
    ];
    const cards = data.map(([q, a]) => card(q, a, false)).join('\n            ');
    const dupes = data.map(([q, a]) => card(q, a, true)).join('\n            ');
    this.shadowRoot.innerHTML = `
      <style>
        :host{--dark:#1E293B;--green:#22C55E;--green-dark:#16A34A;--gray-50:#f9fafb;--gray-200:#E2E8F0;--gray-400:#94A3B8;--gray-600:#475569;display:block;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.6}
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        @keyframes tmarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes revealUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        .testimonials-section{padding:48px 0;background:#fff}
        .container{max-width:1200px;margin:0 auto;padding:0 20px}
        .testimonials-section.reveal .t-head{animation:revealUp .6s ease-out both}
        .testimonials-section.reveal .t-marquee{animation:revealUp .6s ease-out .1s both}
        .t-head{text-align:center;margin-bottom:28px;max-width:560px;margin-left:auto;margin-right:auto}
        .t-eyebrow{font-family:'Space Grotesk',-apple-system,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:var(--green-dark);margin-bottom:8px}
        .t-head h2{font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:600;line-height:1.2;font-size:24px;color:var(--dark);margin-bottom:10px}
        .t-head p{color:#64748B;font-size:15px;line-height:1.6}
        .t-viewport{overflow:hidden;position:relative;-webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)}
        .t-track{display:flex;width:max-content;padding:8px 0 12px;animation:tmarquee 48s linear infinite;will-change:transform}
        .t-viewport:hover .t-track{animation-play-state:paused}
        .t-card{flex:0 0 auto;width:262px;margin-right:14px;background:#fff;border:1px solid var(--gray-200);border-radius:18px;padding:18px 18px;box-shadow:0 4px 16px rgba(15,23,42,0.05);display:flex;flex-direction:column;gap:12px;transition:border-color 0.25s ease,box-shadow 0.25s ease,transform 0.25s ease}
        .t-card:hover{border-color:var(--green);box-shadow:0 12px 28px rgba(34,197,94,0.12);transform:translateY(-4px)}
        .t-card blockquote{border:0;display:flex;flex-direction:column;gap:12px;flex:1}
        .t-stars{display:flex;gap:3px;color:var(--green)}
        .t-stars svg{width:16px;height:16px}
        .t-card p{color:var(--dark);font-size:13.5px;line-height:1.5;font-weight:500}
        .t-card figcaption{display:flex;align-items:center;gap:11px;padding-top:14px;border-top:1px solid #F1F5F9}
        .t-avatar{width:36px;height:36px;flex-shrink:0;border-radius:50%;background:rgba(34,197,94,0.12);color:var(--green-dark);display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:600;font-size:15px}
        .t-meta{display:flex;flex-direction:column;line-height:1.3;min-width:0}
        .t-meta .t-name{color:var(--dark);font-size:13.5px;font-weight:600}
        @media(min-width:768px){
          .testimonials-section{padding:64px 0}
          .t-head{margin-bottom:36px}
          .t-head h2{font-size:30px}
          .t-card{width:340px;padding:24px 22px;gap:16px;border-radius:20px}
          .t-card p{font-size:15px;line-height:1.6}
        }
        @media(min-width:1024px){
          .testimonials-section{padding:80px 0}
        }
        @media(prefers-reduced-motion:reduce){
          .t-viewport{overflow-x:auto;-webkit-mask-image:none;mask-image:none}
          .t-track{animation:none}
          .testimonials-section.reveal .t-head,.testimonials-section.reveal .t-marquee{animation:none}
        }
      </style>
      <section class="testimonials-section">
        <div class="container">
          <div class="t-head">
            <div class="t-eyebrow">Testimonials</div>
            <h2>What our users say</h2>
            <p>Real reviews from people who connected a wearable and started seeing their own patterns.</p>
          </div>
          <div class="t-marquee">
            <div class="t-viewport">
              <div class="t-track">
            ${cards}
            ${dupes}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('kygo-testimonials', KygoTestimonials);


/* ========================================
   9. KYGO INLINE CTA BAND
   Tag: kygo-inline-cta
   Thin one-line CTA band below Testimonials: headline + proof strip + the two
   store buttons. Deliberately the lightest CTA on the page.
======================================== */
class KygoInlineCta extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
    this._observer = null;
  }
  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._setupReveal();
    __seo(this, 'Your patterns are already in your data. Go find them. Download Kygo Health free — 2-minute setup, every wearable connected (Oura, WHOOP, Apple Watch, Garmin, Fitbit), and first correlations in about 7 days. Available for iOS and Android.');
  }
  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }
  static get observedAttributes() { return ['wixsettings']; }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this._parseWixAttributes();
    this.render();
    this._setupReveal();
  }
  _parseWixAttributes() {
    try {
      const wixsettings = this.getAttribute('wixsettings');
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {}
  }
  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }
  _setupReveal() {
    requestAnimationFrame(() => {
      const section = this.shadowRoot.querySelector('.band');
      const row = this.shadowRoot.querySelector('.band-row');
      if (!section || !row) return;
      if ('IntersectionObserver' in window) {
        this._observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              row.classList.add('reveal');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
        this._observer.observe(section);
      } else {
        row.classList.add('reveal');
      }
    });
  }
  render() {
    const appStoreUrl = this._getSetting('app-store-url', 'https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy');
    const androidUrl = this._getSetting('android-url', 'https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO');
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        :host{--green:#22C55E;--green-dark:#16A34A;display:block;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:#f9fafb;color:#1E293B;line-height:1.6;-webkit-font-smoothing:antialiased}
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        @keyframes hiwUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .band{background:#fff;padding:6px 20px clamp(28px,3.4vw,36px);margin-top:clamp(-40px,-4vw,-20px)}
        .band-row{display:flex;align-items:center;justify-content:space-between;gap:clamp(16px,3vw,40px);max-width:1160px;margin:0 auto}
        .band-headline{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:clamp(19px,2.4vw,24px);line-height:1.25;letter-spacing:-0.02em;color:#0F172A}
        .band-headline span{color:#16A34A}
        .band-meta{display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-size:13px;color:#94A3B8;margin-top:8px}
        .band-meta .sep{color:#CBD5E1}
        .band-btns{display:flex;align-items:center;gap:12px;flex-shrink:0}
        .cta-primary{display:flex;align-items:center;gap:8px;background:#22C55E;color:#fff;font-weight:600;font-size:15px;padding:14px 24px;border-radius:12px;white-space:nowrap;text-decoration:none;transition:background .25s ease,transform .25s ease,box-shadow .25s ease}
        .cta-primary:hover{background:#16A34A;transform:translateY(-2px);box-shadow:0 10px 20px rgba(34,197,94,0.3)}
        .cta-primary svg{width:17px;height:17px;flex-shrink:0}
        .cta-android{display:flex;align-items:center;gap:8px;background:#1E293B;color:#fff;font-weight:600;font-size:15px;padding:14px 24px;border-radius:12px;white-space:nowrap;text-decoration:none;transition:background .25s ease,transform .25s ease,box-shadow .25s ease}
        .cta-android:hover{background:#0F172A;transform:translateY(-2px);box-shadow:0 10px 20px rgba(15,23,42,0.22)}
        .cta-android svg{width:18px;height:18px;flex-shrink:0}
        .reveal{animation:hiwUp .6s ease-out both}
        @media(max-width:820px){
          .band-row{flex-direction:column;align-items:stretch;text-align:center;gap:20px}
          .band-btns{flex-direction:column;align-items:stretch}
          .band-btns > a{justify-content:center}
          .band-meta{justify-content:center}
        }
        @media(prefers-reduced-motion:reduce){
          .reveal{animation:none}
          .cta-primary:hover,.cta-android:hover{transform:none}
        }
      </style>
      <section class="band">
        <div class="band-row">
          <div>
            <div class="band-headline">Your patterns are already in your data. <span>Go find them.</span></div>
            <div class="band-meta">
              <span>2-min setup</span><span class="sep">&#8226;</span><span>Every wearable connected</span><span class="sep">&#8226;</span><span>First correlations in 7 days</span>
            </div>
          </div>
          <div class="band-btns">
            <a class="cta-primary" href="${appStoreUrl}" target="_blank" rel="noopener noreferrer" data-action="ios-download" data-track-position="testimonials-inline" data-track-label="home-inline-ios">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.9c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.7.8-3.4.8-.7 0-1.7-.8-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.8 1.1 9 .7 1.1 1.6 2.3 2.8 2.2 1.1 0 1.5-.7 2.9-.7 1.3 0 1.7.7 2.9.7 1.2 0 2-1.1 2.7-2.2.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.2-.9-2.2-3.4zM14.2 5.6c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.7-.9 2.6 1 .1 2-.5 2.6-1.2z"/></svg>
              Download for iOS
            </a>
            <a class="cta-android" href="${androidUrl}" target="_blank" rel="noopener" data-action="android-download" data-track-position="testimonials-inline" data-track-label="home-inline-android">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
              Get it on Android
            </a>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('kygo-inline-cta', KygoInlineCta);


/* ========================================
   10. KYGO FAQ
   Tag: kygo-faq
======================================== */
class KygoFaq extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }
  connectedCallback() {
    this.render();
    this._observer = __revealOnScroll(this.shadowRoot.querySelector('.faq'));
    __seo(this, 'Frequently asked questions about Kygo Health — nutrition tracking, wearable integration, AI-powered food logging, and personalized health insights. What is Kygo? Most apps show you a sleep or HRV score and stop there. Kygo, available on iPhone and Android, connects your wearable data to your food and supplements so you can see why your numbers move, not just what they are. Logging is effortless: snap a photo, use your voice, type it, or scan, with no manual database searching. Connect Garmin, Fitbit, Oura, Apple Health, and Health Connect to pull the most accurate metrics from each device, and Kygo correlates them with your sleep, HRV, energy, and recovery to reveal what actually works for you. Other common questions include how Kygo differs from calorie-only trackers (it shows food-body correlations), which wearables are supported (Oura Ring, Garmin, Fitbit, Apple Health, and Health Connect), how the AI food scanner works (photo recognition with over 5 million foods), and how long it takes to see correlations (about seven days of consistent logging).');
  }
  _faqData() {
    return [
      {
        q: 'Is my health data secure?',
        a: 'Yes, protected end to end. All traffic is encrypted with modern TLS and your data is encrypted at rest with AES-256, on accounts secured with bcrypt hashing and token-based authentication, with every request scoped so only you can reach your own data. We never sell your data. Your wearable connections use official OAuth you can revoke anytime, and deleting your account permanently purges your data. ',
        link: { href: 'https://www.kygo.app/privacy-policy', text: 'Read our privacy policy →' }
      },
      { q: 'What is Kygo?', a: 'Most apps show you a sleep or HRV score and stop there. Kygo, available on iPhone and Android, connects your wearable data to your food and supplements so you can see why your numbers move, not just what they are. Logging is effortless: snap a photo, use your voice, type it, or scan, with no manual database searching. Connect Garmin, Fitbit, Oura, Apple Health, and Health Connect to pull the most accurate metrics from each device.' },
      { q: 'How is Kygo different from MyFitnessPal?', a: 'MyFitnessPal tracks calories for weight loss. Kygo shows you how food affects your sleep, HRV, energy, and recovery by correlating your nutrition with your wearable data. It’s not about dieting, it’s about understanding your body’s unique responses.' },
      { q: 'Which devices do you support?', a: 'We integrate with Oura Ring, Garmin, Fitbit, WHOOP, Apple Health, and Health Connect. You can connect one device or multiple, we’ll combine the data to fill gaps and give you the most complete picture.' },
      { q: 'How long until I see correlations?', a: 'Basic trends show immediately. Meaningful correlations typically appear after about seven days of consistent logging. The more data you provide, the better and more accurate your insights become.' },
      { q: 'Is it really free?', a: 'Yes! Voice, barcode, and text logging, wearable sync, supplements, and trend tracking are free forever, plus 5 AI photo scans a month. Pro adds food-body insights, unlimited photo logging, a daily factor spotlight, and nutrition write-back to Apple Health and Health Connect, for $9.99/month or $59.99/year.' }
    ];
  }
  render() {
    const faqs = this._faqData().map(f => {
      const answer = f.link
        ? `${f.a}<a href="${f.link.href}" target="_blank" rel="noopener">${f.link.text}</a>`
        : f.a;
      return `
            <details class="faq-item">
              <summary>
                <span>${f.q}</span>
                <svg class="faq-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
              </summary>
              <div class="faq-answer">${answer}</div>
            </details>`;
    }).join('');
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;--dark:#1E293B;--navy:#0F172A;--green:#22C55E;--green-dark:#16A34A;--gray-200:#E2E8F0;--gray-400:#94A3B8;--gray-600:#475569;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.6}
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        @keyframes hiwUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .faq{padding:clamp(56px,7vw,88px) 20px;background:#f9fafb}
        .faq.reveal .section-header{animation:hiwUp .6s ease-out both}
        .faq.reveal .faq-item{animation:hiwUp .6s ease-out both}
        .faq.reveal .faq-item:nth-child(1){animation-delay:.08s}
        .faq.reveal .faq-item:nth-child(2){animation-delay:.16s}
        .faq.reveal .faq-item:nth-child(3){animation-delay:.24s}
        .faq.reveal .faq-item:nth-child(4){animation-delay:.32s}
        .faq.reveal .faq-item:nth-child(5){animation-delay:.40s}
        .faq.reveal .faq-item:nth-child(6){animation-delay:.48s}
        @media(prefers-reduced-motion:reduce){.faq.reveal .section-header,.faq.reveal .faq-item{animation:none}}
        .container{max-width:760px;margin:0 auto}
        .section-header{text-align:center;margin-bottom:36px}
        .kicker{font-family:'Space Grotesk',-apple-system,sans-serif;font-size:11px;font-weight:600;letter-spacing:.9px;text-transform:uppercase;color:var(--green-dark);margin-bottom:8px}
        .section-header h2{font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:700;line-height:1.08;letter-spacing:-0.03em;font-size:clamp(28px,4vw,40px);color:var(--navy);margin-bottom:12px}
        .section-header p{color:var(--gray-600);font-size:clamp(16px,2.2vw,18px)}
        .section-header p a{color:var(--green-dark);font-weight:600;text-decoration:none}
        .section-header p a:hover{text-decoration:underline}
        .faq-list{display:flex;flex-direction:column;gap:12px}
        .faq-item{background:#fff;border:2px solid var(--gray-200);border-radius:20px;overflow:hidden;box-shadow:0 4px 12px rgba(15,23,42,.04);transition:border-color .25s ease,box-shadow .25s ease}
        .faq-item summary{list-style:none;padding:20px 24px;font-weight:600;font-size:16px;color:var(--dark);display:flex;justify-content:space-between;align-items:center;gap:16px;cursor:pointer}
        .faq-item summary::-webkit-details-marker{display:none}
        .faq-chev{flex-shrink:0;width:20px;height:20px;color:var(--gray-400);transition:transform .25s ease,color .25s ease}
        .faq-item[open] .faq-chev{transform:rotate(180deg);color:var(--green)}
        .faq-item[open]{border-color:var(--green);box-shadow:0 4px 20px rgba(34,197,94,.1)}
        .faq-item[open] summary{color:var(--green-dark)}
        .faq-item:hover{border-color:var(--gray-400)}
        .faq-item[open]:hover{border-color:var(--green)}
        .faq-answer{padding:0 24px 20px;color:var(--gray-600);font-size:15px;line-height:1.7}
        .faq-answer a{color:var(--green-dark);font-weight:600;text-decoration:none;white-space:nowrap}
        .faq-answer a:hover{text-decoration:underline}
      </style>
      <section class="faq" id="faq">
        <div class="container">
          <div class="section-header">
            <div class="kicker">Questions &amp; answers</div>
            <h2>Frequently asked questions</h2>
            <p>Everything you need to know before you start. <a href="https://www.kygo.app/faq">See the full help center</a>.</p>
          </div>
          <div class="faq-list">${faqs}
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('kygo-faq', KygoFaq);


/* ========================================
   11. KYGO FINAL CTA
   Tag: kygo-final-cta
   The closing call-to-action (dark card on a WHITE section background) that
   sits at the bottom of the homepage, after the testimonials. Entrance reveal
   is pure CSS.
======================================== */
class KygoFinalCta extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.render();
    this._observer = __revealOnScroll(this.shadowRoot.querySelector('.final-cta'));
    __seo(this, 'Download Kygo Health free on iOS and Android. Connect nutrition with Apple Watch, Oura Ring, Garmin, WHOOP, Fitbit, or Samsung Galaxy Watch data for personalized health insights. Free forever plan includes AI food logging, wearable sync, and food-body correlation tracking. Setup takes about 2 minutes.');
  }
  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }
  render() {
    const appStoreUrl = this.getAttribute('app-store-url') || 'https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy';
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;--green:#22C55E;--green-dark:#16A34A;line-height:1.6;-webkit-font-smoothing:antialiased}
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        h2{font-family:'Space Grotesk',-apple-system,sans-serif;font-weight:600;line-height:1.2}
        @keyframes revealUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        .container{max-width:1200px;margin:0 auto;padding:0 20px}
        .final-cta{padding:72px 0;background:#fff}
        .final-cta-inner{background:#0F172A;border-radius:24px;padding:40px 24px;text-align:center;position:relative;overflow:hidden;color:#fff}
        .final-cta.reveal .final-cta-inner{animation:revealUp .6s ease-out both}
        .final-cta-inner::before{content:'';position:absolute;top:-160px;right:-160px;width:520px;height:520px;background:radial-gradient(closest-side,rgba(34,197,94,0.30),transparent);pointer-events:none}
        .final-cta-inner::after{content:'';position:absolute;bottom:-180px;left:-180px;width:480px;height:480px;background:radial-gradient(closest-side,rgba(34,197,94,0.12),transparent);pointer-events:none}
        .final-cta-content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center}
        .cta-pill{display:inline-flex;align-items:center;gap:8px;background:rgba(34,197,94,0.16);color:#6EE7A0;padding:6px 14px;border-radius:999px;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;border:1px solid rgba(34,197,94,0.25);margin-bottom:18px}
        .cta-pill .dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green)}
        .final-cta h2{font-size:clamp(26px,4.5vw,42px);line-height:1.05;color:#fff;margin-bottom:14px;max-width:22ch}
        .final-cta h2 span{color:var(--green)}
        .final-cta-content>p{color:rgba(255,255,255,0.72);margin-bottom:24px;font-size:clamp(14px,1.6vw,16px);max-width:56ch;line-height:1.6}
        .cta-buttons{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .cta-primary,.cta-android{background:var(--green);color:#fff;padding:14px 24px;border-radius:12px;font-weight:600;font-size:15px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .2s ease,box-shadow .2s ease,background .2s ease;cursor:pointer;border:none;font-family:inherit;-webkit-tap-highlight-color:transparent}
        .cta-primary:hover,.cta-android:hover{background:var(--green-dark);transform:translateY(-2px);box-shadow:0 10px 30px rgba(34,197,94,0.30)}
        .cta-primary:active,.cta-primary:focus,.cta-android:active,.cta-android:focus{outline:none;transform:translateY(0);box-shadow:0 4px 15px rgba(34,197,94,0.20)}
        .cta-primary svg,.cta-android svg{width:18px;height:18px}
        .cta-works{margin-top:26px;display:flex;flex-direction:column;align-items:center;gap:12px;color:rgba(255,255,255,0.6);font-size:13px}
        /* Logo tile + brand label, matching the homepage step-2 chips. Always one line. */
        .cta-badges{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:center;gap:6px;row-gap:12px}
        .cta-chip{display:flex;flex-direction:column;align-items:center;gap:6px;flex:0 0 auto}
        .cta-chip-tile{width:40px;height:40px;flex-shrink:0;border-radius:11px;background:#fff;overflow:hidden;display:flex;align-items:center;justify-content:center}
        .cta-chip-tile img{width:100%;height:100%;object-fit:cover;border-radius:11px;display:block}
        .cta-chip-label{font-size:10px;font-weight:600;color:rgba(255,255,255,.6);white-space:nowrap}
        @media(max-width:420px){.cta-badges{gap:4px}.cta-chip-tile{width:36px;height:36px}.cta-chip-label{font-size:9.5px}}
        @media(max-width:360px){.cta-badges{gap:2px}.cta-chip-tile{width:28px;height:28px}.cta-chip-label{font-size:7.5px}}
        @media(prefers-reduced-motion:reduce){.final-cta.reveal .final-cta-inner{animation:none}}
        @media(max-width:480px){.cta-buttons{flex-direction:column;align-items:center}.cta-buttons .cta-primary,.cta-buttons .cta-android{width:100%;max-width:320px;justify-content:center;white-space:nowrap}}
        @media(min-width:768px){.final-cta{padding:96px 0}.final-cta-inner{padding:56px 40px}}
      </style>
      <section class="final-cta">
        <div class="container">
          <div class="final-cta-inner">
            <div class="final-cta-content">
              <div class="cta-pill"><span class="dot"></span> Free Plan Available</div>
              <h2>Your wearable tracks it. <span>Kygo explains it.</span></h2>
              <p>Log meals in seconds and Kygo connects them to your sleep, HRV, and energy, so you finally see what works for you.</p>
              <div class="cta-buttons">
                <a href="${appStoreUrl}" class="cta-primary" data-track-position="footer-cta" data-track-label="home-footer-ios" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Get Kygo
                </a>
                <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" target="_blank" rel="noopener" class="cta-android" data-action="android-download" data-track-position="footer-cta" data-track-label="home-footer-android">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                  Download for Android
                </a>
              </div>
              <div class="cta-works">
                <span>Works with</span>
                <div class="cta-badges">
                  <span class="cta-chip"><span class="cta-chip-tile"><img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura Ring" title="Oura Ring" loading="lazy" /></span><span class="cta-chip-label">Oura</span></span>
                  <span class="cta-chip"><span class="cta-chip-tile"><img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple Health" title="Apple Health" loading="lazy" /></span><span class="cta-chip-label">Apple</span></span>
                  <span class="cta-chip"><span class="cta-chip-tile"><img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit" title="Fitbit" loading="lazy" /></span><span class="cta-chip-label">Fitbit</span></span>
                  <span class="cta-chip"><span class="cta-chip-tile"><img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin" title="Garmin" loading="lazy" /></span><span class="cta-chip-label">Garmin</span></span>
                  <span class="cta-chip"><span class="cta-chip-tile"><img src="https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png" alt="WHOOP" title="WHOOP" loading="lazy" /></span><span class="cta-chip-label">WHOOP</span></span>
                  <span class="cta-chip"><span class="cta-chip-tile"><img src="https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png" alt="Google Health" title="Google Health" loading="lazy" /></span><span class="cta-chip-label">Google</span></span>
                  <span class="cta-chip"><span class="cta-chip-tile"><img src="https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png" alt="Health Connect" title="Health Connect" loading="lazy" /></span><span class="cta-chip-label">Health</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('kygo-final-cta', KygoFinalCta);

/* ========================================
   KYGO HOME (single-embed wrapper)
   Tag: kygo-home
   Renders all homepage sections in order so the page needs only ONE Wix
   custom-element embed (one URL to bump on each push) instead of many.
   Sections are appended to LIGHT DOM so each one's __seo text stays
   crawlable and its structured data still injects normally. Each section
   uses its built-in defaults (no per-section Wix settings are forwarded).
   Each child also gets id=tag so in-page anchors (e.g. the hero's
   "See how it works" → #kygo-insights-steps) resolve within the light DOM.
   Page order: Hero → Stats → Why Kygo → How it works → Correlations →
   Features Users Love → Testimonials → Inline CTA → FAQ → Final CTA → Founder.
======================================== */
class KygoHome extends HTMLElement {
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;
    [
      'kygo-hero-section',
      'kygo-social-proof-section',
      'kygo-problem-section',
      'kygo-insights-steps',
      'kygo-correlations-overview',
      'kygo-features-users-love',
      'kygo-founder',
      'kygo-testimonials',
      'kygo-inline-cta',
      'kygo-faq',
      'kygo-final-cta'
    ].forEach(tag => {
      const el = document.createElement(tag);
      el.id = tag;
      this.appendChild(el);
    });
  }
}
customElements.define('kygo-home', KygoHome);

/* ========================================
   BUNDLE COMPLETE
   All 11 elements registered:
   - kygo-hero-section
   - kygo-social-proof-section
   - kygo-problem-section
   - kygo-insights-steps
   - kygo-correlations-overview
   - kygo-features-users-love
   - kygo-testimonials
   - kygo-inline-cta
   - kygo-faq
   - kygo-final-cta
   - kygo-founder
   Plus kygo-home — a wrapper that renders all 11 as a single embed.
======================================== */
