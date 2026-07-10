/**
 * Kygo Health — Fitbit Air vs WHOOP Comparison Tool
 * Tag: kygo-fitbit-air-vs-whoop
 * URL: /tools/fitbit-air-vs-whoop-comparison
 * Mobile-first side-by-side comparison of Fitbit Air, WHOOP 5.0, and WHOOP MG.
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

class KygoFitbitAirVsWhoop extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._activeTab = 'Sensors';
    this._whoopTier = 'one';
    this._airPlan = 'free';
    this._years = 3;
    this._observer = null;
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
    this._setupAnimations();
    __seo(this, 'Fitbit Air vs WHOOP: Accuracy, Specs & Cost Compared (2026), updated June 2026. Accuracy: for heart rate and HRV WHOOP wins (resting HR CCC 0.91 / 3.0% MAPE vs ECG, ~99% sleep HRV agreement, 1-second storage and bicep/apparel pods near chest-strap), while Fitbit Air uses Pixel Watch-class wrist PPG (workout HR ~73.6% within range). Sleep is closely matched: Fitbit 4-stage agreement kappa 0.42-0.55, WHOOP best-of-six deep-sleep detection 69.6%, REM 62.0%; both ~85-90% sleep/wake. Calories are weak on both: Fitbit ~65.6% accurate, WHOOP no validated figure, expect plus or minus 20-30% in mixed exercise. Neither Fitbit Air (May 2026) nor WHOOP 5.0/MG (April 2025) has device-specific independent validation yet; figures come from inherited Fitbit/Pixel and WHOOP 4.0 platforms. Compare Fitbit Air, WHOOP 5.0, and WHOOP MG specs side by side. Filter by sensors, battery, price, health metrics, and 3-year cost of ownership. Fitbit Air released May 26, 2026 at $99.99 with optional $9.99/mo Premium AI coach. WHOOP 5.0 and MG released April 2025 with required subscriptions: WHOOP One $199/yr, Peak $239/yr, Life $359/yr (MG hardware required for Life). HR sampling: Fitbit Air every 2 seconds vs WHOOP every 1 second (2x more frequent). Pod weight: Fitbit Air 5.2g vs WHOOP ~10g. Water resistance: Fitbit Air 50m vs WHOOP 10m IP68. Battery: Fitbit Air 7 days vs WHOOP 14 days. WHOOP MG only device with FDA-cleared ECG and Blood Pressure Insights. WHOOP supports bicep, calf, and apparel pods. Fitbit Air wrist-only at launch. 3-year total cost of ownership: Fitbit Air $100 core, $396 with AI; WHOOP One $597, WHOOP Life with MG $1,077. Fitbit Air does not require subscription for core function. WHOOP devices are bricked without active subscription. Both work with Android and iOS. Both use phone GPS. Both have SpO2, skin temperature, sleep stages, VO2 Max, and cycle health.');
    this._injectStructuredData();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Data ─────────────────────────────────────────────────────────────

  get _specs() {
    const y = (t) => `<span class="y">${t}</span>`;
    const n = (t) => `<span class="n">${t}</span>`;
    const num = (t, win) => `<span class="num${win ? ' y' : ''}">${t}</span>`;
    return {
      Sensors: [
        { name: 'HR data storage interval', info: 'How often the device records an HR data point', air: 'Every 2 seconds', whoop5: 'Every 1 second', whoopMG: 'Every 1 second', winner: 'whoop' },
        { name: 'PPG architecture', info: 'LED + photodiode stack', air: 'Optical HR + Red + IR for SpO2 (LED count not disclosed)', whoop5: '3 green + 1 red + 1 IR LEDs · 4 photodiodes', whoopMG: 'Same as 5.0', winner: 'whoop' },
        { name: 'SpO₂ (blood oxygen)', info: 'Red + IR LEDs for overnight oxygen', air: 'Yes', whoop5: 'Yes', whoopMG: 'Yes', winner: 'tie' },
        { name: 'Skin temperature', info: 'Nightly variation tracking', air: 'Yes', whoop5: 'Yes', whoopMG: 'Yes', winner: 'tie' },
        { name: 'Accelerometer', info: 'Motion + activity detection', air: '3-axis + gyroscope', whoop5: 'Multi-axis', whoopMG: 'Multi-axis', winner: 'tie' },
        { name: 'ECG (single-lead)', info: 'Confirmed AFib detection', air: n('No'), whoop5: n('No'), whoopMG: y('Yes — FDA-cleared'), winner: 'whoop' },
        { name: 'Blood pressure', info: 'Daily estimates from cuff calibration', air: n('No'), whoop5: n('No'), whoopMG: y('Estimated (cuff calibration required, not FDA-cleared, general wellness only)'), winner: 'whoop' },
        { name: 'AFib alerts', info: 'How irregular rhythm is detected', air: 'PPG-based alerts', whoop5: n('No'), whoopMG: y('ECG-confirmed'), winner: 'whoop' },
        { name: 'EDA (electrodermal)', info: 'Skin conductance for stress', air: n('No'), whoop5: n('No'), whoopMG: n('No'), winner: 'tie' },
        { name: 'GPS', info: 'Location tracking on device', air: 'Phone GPS', whoop5: 'Phone GPS', whoopMG: 'Phone GPS', winner: 'tie' },
      ],
      Accuracy: [
        { name: 'HRV precision', info: 'Higher internal sample rate = cleaner HRV', air: 'Pixel Watch–class', whoop5: y('Lab-validated (peer-reviewed, 26 Hz)'), whoopMG: y('Lab-validated (peer-reviewed, 26 Hz)'), winner: 'whoop' },
        { name: 'High-intensity HR', info: 'HR data resolution during workouts', air: '2-sec storage', whoop5: '1-sec storage', whoopMG: '1-sec storage', winner: 'whoop' },
        { name: 'Auto-detected workouts', info: 'No manual logging needed', air: '40+ via SmartTrack', whoop5: '145+ activities', whoopMG: '145+ activities', winner: 'whoop' },
        { name: 'Strength training', info: 'Resistance load detection', air: 'Basic', whoop5: 'Better axes; manual log recommended', whoopMG: 'Same as 5.0', winner: 'whoop' },
        { name: 'Wear locations', info: 'Where the sensor can sit', air: 'Wrist only', whoop5: y('Wrist · bicep · calf · apparel pods'), whoopMG: y('Wrist · bicep · calf · apparel pods'), winner: 'whoop' },
        { name: 'Sleep stages', info: 'REM/Deep/Light scoring', air: 'Yes + Smart Wake alarm', whoop5: 'Yes + Sleep Coach (exact bedtime)', whoopMG: 'Same', winner: 'tie' },
        { name: 'VO₂ Max', info: 'Aerobic fitness estimate', air: y('Pixel Watch 4 algos'), whoop5: 'Yes', whoopMG: 'Yes', winner: 'tie' },
      ],
      'Form & Battery': [
        { name: 'Pod weight', info: 'The sensor module alone', air: y('5.2 g'), whoop5: '~10 g', whoopMG: '~10 g', winner: 'air' },
        { name: 'Total weight w/ band', air: y('12 g'), whoop5: '~27 g', whoopMG: '~27 g', winner: 'air' },
        { name: 'Display', info: 'Visible screen on device', air: n('None'), whoop5: n('None'), whoopMG: n('None'), winner: 'tie' },
        { name: 'Water resistance', air: y('50 m'), whoop5: '10 m / 2 hr (IP68)', whoopMG: '10 m / 2 hr (IP68)', winner: 'air' },
        { name: 'Battery', air: '~7 days', whoop5: '14 days', whoopMG: '14 days', winner: 'whoop' },
        { name: 'Fast charge', air: y('1 day in 5 min · 0–100% in 90 min'), whoop5: 'Slide-on PowerPack', whoopMG: 'Slide-on PowerPack', winner: 'air' },
        { name: 'Charger', air: 'USB-C bidirectional puck', whoop5: 'Wireless PowerPack', whoopMG: 'Wireless PowerPack', winner: 'tie' },
      ],
      'Cost & Plans': [
        { name: 'Hardware price', air: num('$99.99'), whoop5: num('$0'), whoopMG: num('$0'), winner: 'tie' },
        { name: 'Subscription', info: 'Required for core function?', air: y('Optional · $9.99/mo or $99/yr'), whoop5: 'Required · $199–239/yr', whoopMG: 'Required · $359/yr (Life)', winner: 'air' },
        { name: 'Bricked without sub?', air: y('No'), whoop5: n('Yes'), whoopMG: n('Yes'), winner: 'air' },
        { name: 'Premium trial', air: '3 months Health Premium', whoop5: n('None'), whoopMG: n('None'), winner: 'air' },
        { name: '3-yr cost (core)', air: num('$100', true), whoop5: num('$597'), whoopMG: num('$1,077'), winner: 'air' },
        { name: '3-yr cost (with AI)', air: num('$396', true), whoop5: num('$597+'), whoopMG: num('$1,077+'), winner: 'air' },
      ],
      Software: [
        { name: 'AI coach', air: 'Google Health Coach (Gemini)', whoop5: 'WHOOP Coach (LLM)', whoopMG: 'WHOOP Coach (LLM)', winner: 'tie' },
        { name: 'Companion app', air: 'Google Health (rebranded Fitbit)', whoop5: 'WHOOP', whoopMG: 'WHOOP', winner: 'tie' },
        { name: 'Strain / load', air: 'Cardio Load + Readiness', whoop5: 'Strain 0–21', whoopMG: 'Strain 0–21', winner: 'tie' },
        { name: 'Healthspan', air: 'Health Coach (Premium)', whoop5: 'WHOOP Age + Pace of Aging', whoopMG: 'WHOOP Age + Pace of Aging', winner: 'whoop' },
        { name: 'Cycle health', air: 'Yes', whoop5: 'Yes', whoopMG: 'Yes', winner: 'tie' },
        { name: 'OS support', air: 'Android + iOS', whoop5: 'Android + iOS', whoopMG: 'Android + iOS', winner: 'tie' },
      ],
    };
  }

  get _bestFor() {
    return [
      { icon: 'wallet', label: 'For the budget', pick: 'Fitbit Air', reason: '~$100 (or ~$396 with AI Coach over 3 yrs) vs $597–1,077 for WHOOP. No subscription required for core tracking.', price: '$99.99', yrly: '· no required sub' },
      { icon: 'athlete', label: 'For the athlete', pick: 'WHOOP 5.0', reason: '2× more frequent HR data storage (1-sec vs 2-sec, per official specs). Bicep & apparel pods rival chest-strap accuracy. 145+ activities vs 40+.', price: '$199/yr', yrly: '· One tier' },
      { icon: 'stethoscope', label: 'For medical-grade', pick: 'WHOOP MG', reason: 'Only device with FDA-cleared ECG, ECG-confirmed AFib detection, and daily Blood Pressure Insights (cuff calibration).', price: '$359/yr', yrly: '· Life tier' },
      { icon: 'moon', label: 'For casual / sleep', pick: 'Fitbit Air', reason: 'Pixel Watch 4–class sleep & VO₂ Max algorithms in a 5.2g pod (12g with band). Smart Wake alarm. 7-day battery, 5-min top-up = 1 day.', price: '$99.99', yrly: '· 3-mo Premium trial' },
    ];
  }

  get _faqs() {
    return [
      { q: 'Is Fitbit Air or WHOOP more accurate?', a: 'For heart rate and HRV, WHOOP is more accurate — it stores HR data every second, samples at 26 Hz, and (on the bicep or an apparel pod) approaches chest-strap accuracy, with resting HR validated at CCC 0.91 / 3.0% MAPE vs ECG and ~99% HRV agreement during sleep. For sleep staging the two are closely matched: Fitbit edges overall 4-stage agreement (κ 0.42–0.55) in independent testing, while WHOOP is the best of six devices at detecting deep sleep (69.6%). For calories, neither is reliable — Fitbit lands around 65% accuracy and WHOOP has no independently validated figure. Important caveat: Fitbit Air (2026) and WHOOP 5.0/MG (2025) are too new for device-specific studies, so these numbers come from the Fitbit/Pixel and WHOOP 4.0 platforms they inherit.' },
      { q: 'How accurate is the Fitbit Air?', a: 'Fitbit Air hasn\'t been independently validated yet, but it runs Pixel Watch 4–class algorithms on a wrist PPG sensor. Based on the recent Fitbit/Pixel lineage, expect strong resting and overnight heart-rate accuracy, solid sleep/wake detection (~85–90% 2-stage agreement) and moderate 4-stage sleep staging (κ around 0.42–0.55), workout heart rate around 73% within range (wrist PPG struggles with rapid intensity changes), and weak calorie estimation (~65%, like most wearables). It records HR every 2 seconds vs WHOOP\'s every 1 second.' },
      { q: 'Is Fitbit Air actually a WHOOP killer?', a: 'They\'re aimed at different buyers and different budgets. Fitbit Air is $99.99 once, with no required subscription for core tracking. WHOOP is $0 hardware but $199–359/yr forever, and the device stops working if you cancel. For most people the price gap is the headline story — WHOOP MG\'s FDA-cleared ECG and bicep/apparel pods justify the cost for a smaller, more specific audience.' },
      { q: 'Does 2-sec vs 1-sec HR storage actually matter for me?', a: 'For sleep, resting heart rate, and daily steps — basically nothing. Both devices produce solid scores. For high-intensity workouts or anyone who wants a more granular timeline of their HR, WHOOP\'s tighter 1-second storage shows more data points per minute but you are paying a lot more for this difference.' },
      { q: 'Can I use both?', a: 'Yes — WHOOP on the bicep for workouts, Fitbit Air at night for sleep + recovery. Kygo can pull data from both and treat them as a single signal, automatically picking the more reliable source per metric.' },
      { q: 'What happens to a WHOOP if I cancel my subscription?', a: 'The device stops working. WHOOP\'s entire value is in the membership; the hardware is free but disabled without an active sub. Fitbit Air is the opposite — you own the hardware outright and Premium ($9.99/mo) is purely additive (mainly the AI Coach).' },
      { q: 'Does Kygo work with both?', a: 'Yes — Kygo connects to Fitbit, WHOOP, Oura, Apple Health, Garmin, and Samsung Galaxy Watch. Pick whichever wearable suits you; Kygo handles the cross-source correlations to your nutrition.' },
    ];
  }

  // ── Icons ────────────────────────────────────────────────────────────

  _icon(k) {
    const map = {
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
      wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h16v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7"/><circle cx="17" cy="13" r="1.2"/></svg>',
      athlete: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.2"/><path d="M5 21l3-7 3 2 3-3 5 8M9 13l-2-3"/></svg>',
      stethoscope: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v6a4 4 0 0 0 8 0V3M10 13v3a4 4 0 0 0 8 0v-2"/><circle cx="18" cy="11" r="2"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
      apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg>',
      android: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 10v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-2 0zm10 0v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-2 0zM5 17v3a1 1 0 1 0 2 0v-3H5zm12 0v3a1 1 0 1 0 2 0v-3h-2zm-9.5-9c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5H7.5zm.5 1h8a1 1 0 0 1 1 1v6H7v-6a1 1 0 0 1 1-1zM9 5.5a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zm6 0a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1z"/></svg>',
      plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
      pulse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2-7 4 14 2-7h6"/></svg>',
      flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s5 4 5 9a5 5 0 0 1-10 0c0-1.5.7-2.8 1.5-3.8C9 9 9.5 10 10.5 10c0-2 .5-5 1.5-8z"/></svg>',
    };
    return `<span class="ico">${map[k] || ''}</span>`;
  }

  // ── Render ───────────────────────────────────────────────────────────

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const fitbitImg = 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png';
    const whoopImg = 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png';
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const appleImg = 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png';
    const garminImg = 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png';
    const healthConnectImg = 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" loading="lazy" />
            <span>Kygo Health</span>
          </a>
          <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" class="nav-cta-link cta-primary" data-track-label="subnav-get-app" data-track-position="subnav" target="_blank" rel="noopener">
            Get Kygo App ${this._icon('arrowRight')}
          </a>
        </div>
      </header>


      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill"><span class="dot"></span> UPDATED JUNE 2026</div>
              <h1>Fitbit Air vs WHOOP: Accuracy, Specs &amp; Cost <span class="hl">Compared (2026)</span></h1>
              <p class="hero-lede">Same screenless silhouette. Two completely different bets. Compare every sensor, see the <strong>real accuracy numbers</strong> for heart rate, sleep, and calories, and calculate your true 3-year cost.</p>
              <div class="hero-devices">
                <a class="hero-dev" href="https://www.amazon.com/dp/B0GTMTZF3V?tag=kygohealthapp-20&th=1" data-track-label="fitbit-air" target="_blank" rel="noopener sponsored">
                  <img src="${fitbitImg}" alt="Fitbit Air" />
                  <div>
                    <strong>Fitbit Air</strong>
                    <span>$99.99 · May 2026</span>
                    <span class="hero-dev-aff">View on Amazon ${this._icon('arrowRight')}</span>
                  </div>
                </a>
                <div class="hero-vs">vs</div>
                <a class="hero-dev" href="https://www.amazon.com/dp/B0DY2SWV16?tag=kygohealthapp-20&th=1" data-track-label="whoop-peak-12mo" target="_blank" rel="noopener sponsored">
                  <img src="${whoopImg}" alt="WHOOP 5.0 / MG" />
                  <div>
                    <strong>WHOOP 5.0 / MG</strong>
                    <span>$199–359/yr · Apr 2025</span>
                    <span class="hero-dev-aff">View on Amazon ${this._icon('arrowRight')}</span>
                  </div>
                </a>
              </div>
            </div>
            <div class="hero-vis" aria-hidden="true">
              <svg viewBox="0 0 600 360" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="hgFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stop-color="#22C55E" stop-opacity="0.18"/>
                    <stop offset="1" stop-color="#22C55E" stop-opacity="0"/>
                  </linearGradient>
                </defs>
                <line x1="0" y1="60" x2="600" y2="60" stroke="#E2E8F0" stroke-width="1"/>
                <line x1="0" y1="180" x2="600" y2="180" stroke="#E2E8F0" stroke-width="1"/>
                <line x1="0" y1="300" x2="600" y2="300" stroke="#E2E8F0" stroke-width="1"/>
                <text x="6" y="50" fill="#94A3B8" font-size="11" letter-spacing="1.5">FITBIT AIR · EVERY 2s</text>
                <text x="6" y="170" fill="#94A3B8" font-size="11" letter-spacing="1.5">RESTING</text>
                <text x="6" y="290" fill="#94A3B8" font-size="11" letter-spacing="1.5">WHOOP · EVERY 1s</text>
                <path d="M0,60 L80,60 L100,55 L120,60 L200,60 L220,55 L240,60 L320,60 L340,55 L360,60 L440,60 L460,55 L480,60 L600,60" stroke="#FBBF24" stroke-width="2" fill="none"/>
                <path d="M0,180 C20,180 30,160 50,160 S80,210 100,150 130,90 160,180 190,250 220,180 240,140 260,140 280,200 310,180 340,90 360,180 380,250 410,170 440,150 460,200 490,180 520,140 540,170 560,180 580,180 600,180" stroke="#22C55E" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M0,180 C20,180 30,160 50,160 S80,210 100,150 130,90 160,180 190,250 220,180 240,140 260,140 280,200 310,180 340,90 360,180 380,250 410,170 440,150 460,200 490,180 520,140 540,170 560,180 580,180 600,180 L600,360 L0,360 Z" fill="url(#hgFill)" opacity="0.7"/>
              </svg>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">2<span class="unit">×</span></div><div class="lbl">WHOOP stores HR data 2× more often</div></div>
            <div class="hero-stat"><div class="num">5.2<span class="unit">g</span></div><div class="lbl">Fitbit Air pod — smallest Fitbit ever</div></div>
            <div class="hero-stat"><div class="num">$977</div><div class="lbl">3-yr cost gap, Air vs WHOOP MG</div></div>
            <div class="hero-stat"><div class="num">1<span class="unit">device</span></div><div class="lbl">FDA-cleared ECG: WHOOP MG only</div></div>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The quick answer</div>
            <h2>Fitbit Air vs WHOOP, <span class="hl">in plain English.</span></h2>
            <p class="lede">The full interactive comparison, accuracy numbers, and cost calculator are below — but if you just want the verdict, start here. Specs are from official manufacturer pages; accuracy figures are tied to peer-reviewed studies.</p>
          </div>
          <div class="tldr animate-on-scroll">${this._renderTLDR()}</div>
        </div>
      </section>

      <!-- Early contextual CTA -->
      <section class="kearly-section">
        <div class="section-inner">
          <div class="kearly animate-on-scroll">
            <p class="kearly-copy">Whichever tracker you pick, make its data useful. Kygo connects Fitbit or WHOOP to your nutrition and finds your personal correlations.</p>
            <div class="kearly-btns">
              <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" class="btn btn-primary btn-lg cta-primary" data-track-position="early" data-track-label="fitbit-whoop-early-ios" target="_blank" rel="noopener">${this._icon('apple')} Download for iOS</a>
              <a href="https://www.kygo.app/android" class="btn btn-primary btn-lg cta-android" data-action="android-download" data-track-position="early" data-track-label="fitbit-whoop-early-android" target="_blank" rel="noopener">${this._icon('android')} Get Android</a>
            </div>
          </div>
        </div>
      </section>

      <kygo-inline-subscribe source="tool-fitbit-air-vs-whoop" variant="comparison"></kygo-inline-subscribe>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Side by side</div>
            <h2>Every spec, <span class="hl">organized.</span></h2>
            <p class="lede">35 specs split into five categories. WHOOP 5.0 and MG share hardware externally — MG adds the ECG electrodes.</p>
          </div>
          <div class="tbl-wrap">
            <div class="tbl-tabs" data-tabs>${this._renderTabs()}</div>
            <div data-tbl-body>${this._renderTable()}</div>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Accuracy</div>
            <h2>Fitbit Air vs WHOOP accuracy: <span class="hl">the actual numbers.</span></h2>
            <p class="lede">Heart rate, sleep, and calorie accuracy — measured against ECG, polysomnography, and lab calorimetry. Where a device hasn't been independently tested, we say so rather than imply it.</p>
          </div>
          <div class="acc-grid animate-on-scroll">${this._renderAccuracy()}</div>
          <div class="acc-note animate-on-scroll">
            <span class="acc-note-ico">${this._icon('stethoscope')}</span>
            <p><strong>A note on validation.</strong> Both Fitbit Air (May 2026) and WHOOP 5.0/MG (April 2025) are too new for published device-specific independent studies. The figures above come from the sensor platforms they inherit — recent Fitbit and Pixel Watch models, and WHOOP 4.0 — tested against gold standards. Treat them as the best available evidence, not a measurement of these exact units.</p>
          </div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="kygo-cta-card animate-on-scroll">
            <div class="cta-pill"><span class="dot"></span> Free Forever Plan</div>
            <h3>Get the most accurate metric <span>from each wearable.</span></h3>
            <p>Kygo Health connects to both Fitbit and WHOOP, then cross-checks every reading against what you eat, train, and sleep — so you see which metrics are actually predictive for <em>your</em> body.</p>
            <div class="cta-btn-row">
              <a class="btn btn-primary btn-lg cta-primary" href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" data-track-position="late" data-track-label="fitbit-whoop-late-ios" target="_blank" rel="noopener">${this._icon('apple')} Download for iOS</a>
              <a class="btn btn-primary btn-lg cta-android" href="https://www.kygo.app/android" data-action="android-download" data-track-position="late" data-track-label="fitbit-whoop-late-android" target="_blank" rel="noopener">${this._icon('android')} Download for Android</a>
            </div>
            <div class="cta-works">
              <span>Works with</span>
              <div class="cta-badges">
                <img src="${ouraImg}" alt="Oura Ring" title="Oura Ring" loading="lazy" />
                <img src="${appleImg}" alt="Apple Health" title="Apple Health" loading="lazy" />
                <img src="${fitbitImg}" alt="Fitbit" title="Fitbit" loading="lazy" />
                <img src="${garminImg}" alt="Garmin" title="Garmin" loading="lazy" />
                <img src="https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png" alt="Google Health" title="Google Health" loading="lazy" />
                <img src="${healthConnectImg}" alt="Health Connect" title="Health Connect" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">3-year cost calculator</div>
            <h2>What you'll <span class="hl">actually spend.</span></h2>
            <p class="lede">Pick a WHOOP tier and your Fitbit Air plan. We'll run the math for you over your chosen horizon. Premium 3-month trial is included.</p>
          </div>
          <div class="calc" data-calc>${this._renderCalc()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Quick winner</div>
            <h2>The <span class="hl">right pick</span> depends on what you optimize for.</h2>
            <p class="lede">Four common buyer profiles, ranked head-to-head.</p>
          </div>
          <div class="bestfor-grid">${this._renderBestFor()}</div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <a class="blog-cta animate-on-scroll" href="https://www.kygo.app/post/fitbit-air-vs-whoop-which-screenless-tracker-is-worth-it" target="_blank" rel="noopener">
            <span class="blog-cta-tag">Deep Dive</span>
            <div class="blog-cta-body">
              <div class="blog-cta-kicker">Read the full article</div>
              <div class="blog-cta-title">Fitbit Air vs WHOOP: Which Screenless Tracker Wins? <span class="yr">(2026)</span></div>
              <div class="blog-cta-sub">$100 one-time vs $199/yr subscription. We compared every spec, sensor, and cost between Fitbit Air, WHOOP 5.0/MG, and other Fitbits — here's who each one is for.</div>
            </div>
            <span class="blog-cta-arrow">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Bottom line</div>
            <h2>Three things split them. <span class="hl">Three more decide it.</span></h2>
          </div>
          <div class="gaps">
            <div class="gap animate-on-scroll">
              <h4>Three technical gaps</h4>
              <ul>
                <li><span class="num-tag">1</span><span><strong>HR data resolution.</strong> WHOOP stores HR data every 1 sec; Fitbit Air every 2 sec (Google's official spec). 2× the granularity in your HR timeline.</span></li>
                <li><span class="num-tag">2</span><span><strong>Wear flexibility.</strong> WHOOP supports bicep, calf, and apparel pods (sleeves, shorts, sports bras). Fitbit Air is wrist-only at launch.</span></li>
                <li><span class="num-tag">3</span><span><strong>Medical-grade sensors.</strong> Only WHOOP MG has FDA-cleared ECG and daily Blood Pressure Insights from cuff calibration.</span></li>
              </ul>
            </div>
            <div class="gap animate-on-scroll">
              <h4>Three commercial gaps</h4>
              <ul>
                <li><span class="num-tag">1</span><span><strong>Hardware cost.</strong> Fitbit Air is $99.99 once. WHOOP hardware is free, but with a mandatory annual subscription.</span></li>
                <li><span class="num-tag">2</span><span><strong>Subscription model.</strong> Fitbit Air's is optional ($9.99/mo for AI Coach). WHOOP devices are bricked without an active membership.</span></li>
                <li><span class="num-tag">3</span><span><strong>3-year TCO.</strong> Fitbit Air ~$100 (core) or ~$460 (with AI). WHOOP $597 (One) to $1,077 (Life with MG).</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">FAQ</div>
            <h2>Common <span class="hl">questions.</span></h2>
          </div>
          <div class="faq">${this._renderFAQ()}</div>
        </div>
      </section>

      <footer class="tool-footer">
        <div class="container">
          <a href="https://www.kygo.app" class="footer-brand">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" loading="lazy" />
            <span>Kygo Health</span>
          </a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <div class="footer-links">
            <a href="https://www.kygo.app">Home</a>
            <a href="https://www.kygo.app/how-it-works">How It Works</a>
            <a href="https://www.kygo.app/blog">Blog</a>
            <a href="https://www.kygo.app/contact">Contact</a>
            <a href="https://www.kygo.app/privacy-policy">Privacy</a>
            <a href="https://www.kygo.app/terms-conditions">Terms</a>
          </div>
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Always consult a qualified healthcare provider before starting any supplement, exercise program, or lifestyle change.</p>
          <p class="footer-copyright">Data sourced from official manufacturer specifications, peer-reviewed validation studies (Dial 2025, Schyvens/Antwerp 2025, Robbins 2024), and independent meta-analyses. Last updated June 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  // Static, crawlable summary for the "fitbit air vs whoop" / "fitbit air"
  // queries — the interactive tool below renders in JS where crawlers may not
  // read it, so the verdict is restated here as plain text.
  _renderTLDR() {
    return `
      <p class="tldr-lead"><strong>Fitbit Air</strong> ($99.99, May 2026) and <strong>WHOOP 5.0 / MG</strong> ($199–359/yr, April 2025) are both screenless trackers — but opposite bets. Fitbit Air is buy-once with no required subscription; WHOOP is subscription-only and bricks if you cancel. Here's who each is for.</p>
      <div class="cmp-blocks">
        <div class="cmp-block">
          <h3>Pick Fitbit Air if…</h3>
          <p class="cmp-verdict">Best for value, comfort, and sleep.</p>
          <p>You want the lowest cost, no mandatory subscription, and you mostly track sleep, recovery, and everyday heart rate. It's the lightest option (5.2&nbsp;g pod), tops up a day in 5 minutes, and uses Pixel Watch–class algorithms. You give up the tightest workout-HR resolution and any ECG.</p>
        </div>
        <div class="cmp-block">
          <h3>Pick WHOOP if…</h3>
          <p class="cmp-verdict">Best for serious training and health.</p>
          <p>You want chest-strap-class workout HR from a bicep or apparel pod, the deepest strain/recovery analytics, and 1-second HR storage — or, with WHOOP MG, FDA-cleared ECG. You're accepting a $199–359/yr subscription and the highest 3-year cost here.</p>
        </div>
      </div>
    `;
  }

  get _accuracy() {
    return [
      {
        icon: 'pulse', metric: 'Heart rate & HRV', winner: 'WHOOP',
        rows: [
          { label: 'Resting HR vs ECG', air: 'Not yet tested · wrist PPG accurate at rest', whoop: 'CCC 0.91 · 3.0% MAPE', win: 'whoop' },
          { label: 'Overnight HRV vs ECG', air: 'Not independently validated', whoop: 'CCC 0.94 · 8.2% MAPE · ~99% sleep HRV agreement', win: 'whoop' },
          { label: 'Active / workout HR', air: '~73.6% within range (Fitbit lineage)', whoop: 'Approaches chest-strap on bicep/apparel pod', win: 'whoop' },
        ],
        take: 'WHOOP\'s 1-second storage, 26 Hz sampling, and off-wrist pods give it the clear edge for workouts and HRV. Fitbit Air is dependable for resting and sleeping heart rate.',
        src: 'Dial 2025 (Physiological Reports); Central Queensland Univ. 2020; WellnessPulse meta-analysis 2025',
      },
      {
        icon: 'moon', metric: 'Sleep', winner: 'Closely matched',
        rows: [
          { label: 'Sleep / wake (2-stage)', air: 'High (Fitbit lineage ~85–90%)', whoop: '~89% agreement vs PSG', win: 'tie' },
          { label: 'Full 4-stage (REM/deep/light/wake)', air: 'κ 0.42–0.55 (Fitbit Sense/Charge)', whoop: 'κ 0.37 · ~64% agreement', win: 'air' },
          { label: 'Deep-sleep & REM detection', air: 'REM 55.5% (Fitbit Sense)', whoop: 'Deep 69.6% (best of 6) · REM 62.0%', win: 'whoop' },
        ],
        take: 'A genuine toss-up. Fitbit edges overall 4-stage agreement in independent testing; WHOOP is the best of six devices at catching deep sleep. Both, like all wearables, over-score light sleep.',
        src: 'Schyvens/Univ. Antwerp 2025 (Sleep Advances); Robbins 2024 (Sensors); Univ. of Arizona 2020',
      },
      {
        icon: 'flame', metric: 'Calories (energy)', winner: 'Neither — both weak',
        rows: [
          { label: 'Total energy expenditure', air: '~65.6% accurate (Fitbit lineage)', whoop: 'No validated published figure', win: 'tie' },
          { label: 'For context', air: 'Apple ~71% · Garmin ~48%', whoop: 'Error widens in mixed-intensity exercise', win: 'tie' },
        ],
        take: 'Don\'t buy either for calorie counting. Every wrist/pod wearable is unreliable here (typically ±20–30% in real use); use the trend, not the number.',
        src: 'WellnessPulse meta-analysis 2025; AIM7 validation data',
      },
    ];
  }

  _renderAccuracy() {
    const valCell = (dev, val, isWin) => `<div class="acc-v${isWin ? ' win' : ''}"><span class="dev">${dev}</span><span class="val">${val}</span></div>`;
    return this._accuracy.map(a => `
      <div class="acc-card">
        <div class="acc-head">
          <span class="acc-ico">${this._icon(a.icon)}</span>
          <h3>${a.metric}</h3>
          <span class="acc-win">${a.winner}</span>
        </div>
        <div class="acc-metrics">
          ${a.rows.map(r => `
            <div class="acc-metric">
              <div class="acc-m-label">${r.label}</div>
              <div class="acc-m-vals">
                ${valCell('Fitbit Air', r.air, r.win === 'air')}
                ${valCell('WHOOP', r.whoop, r.win === 'whoop')}
              </div>
            </div>
          `).join('')}
        </div>
        <p class="acc-take">${a.take}</p>
        <p class="acc-src">${a.src}</p>
      </div>
    `).join('');
  }

  _renderBestFor() {
    return this._bestFor.map(b => `
      <div class="bestfor">
        <div class="for-icon">${this._icon(b.icon)}</div>
        <h3>${b.label}</h3>
        <div class="pick"><em>${b.pick}</em> wins</div>
        <p class="reason">${b.reason}</p>
        <div class="footer-row">
          <span class="price">${b.price}</span>
          <span class="yrly">${b.yrly}</span>
        </div>
      </div>
    `).join('');
  }

  _renderTabs() {
    return Object.keys(this._specs).map(c => `
      <button data-tab="${c}" class="${c===this._activeTab?'active':''}">
        ${c}<span class="ct">${this._specs[c].length}</span>
      </button>
    `).join('');
  }

  _renderTable() {
    const fitbitImg = 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png';
    const whoopImg = 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png';
    const fitbitAff = 'https://www.amazon.com/dp/B0GTMTZF3V?tag=kygohealthapp-20&th=1';
    const whoopAff = 'https://www.amazon.com/dp/B0DY2SWV16?tag=kygohealthapp-20&th=1';
    const rows = this._specs[this._activeTab];
    const amazonLink = (url, label) => `<a class="amazon-link" href="${url}" data-track-label="${label}" target="_blank" rel="noopener sponsored">View on Amazon ${this._icon('arrowRight')}</a>`;
    return `
      <table class="tbl">
        <thead>
          <tr>
            <th>Spec</th>
            <th><div class="head-prod"><img src="${fitbitImg}" alt="" /> <span>Fitbit Air</span></div>${amazonLink(fitbitAff, 'fitbit-air')}</th>
            <th><div class="head-prod"><img src="${whoopImg}" alt="" /> <span>WHOOP 5.0</span></div>${amazonLink(whoopAff, 'whoop-peak-12mo')}</th>
            <th><div class="head-prod"><img src="${whoopImg}" alt="" /> <span>WHOOP MG</span></div>${amazonLink(whoopAff, 'whoop-peak-12mo')}</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td class="spec-name" data-label="Spec">
                ${r.name}
                ${r.info ? `<div class="info">${r.info}</div>` : ''}
              </td>
              <td class="cell" data-label="Fitbit Air">
                ${r.air}
              </td>
              <td class="cell" data-label="WHOOP 5.0">
                ${r.whoop5}
              </td>
              <td class="cell" data-label="WHOOP MG">
                ${r.whoopMG}
              </td>
            </tr>
          `).join('')}
          <tr class="aff-row">
            <td colspan="4">
              <div class="aff-row-inner">
                <a class="aff-btn" href="${fitbitAff}" target="_blank" rel="noopener sponsored" data-track-label="fitbit-air"><img src="${fitbitImg}" alt="" /> Fitbit Air on Amazon ${this._icon('arrowRight')}</a>
                <a class="aff-btn" href="${whoopAff}" target="_blank" rel="noopener sponsored" data-track-label="whoop-peak-12mo"><img src="${whoopImg}" alt="" /> WHOOP on Amazon ${this._icon('arrowRight')}</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    `;
  }

  _renderCalc() {
    const fitbitImg = 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png';
    const whoopImg = 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png';
    const tier = this._whoopTier, plan = this._airPlan, years = this._years;
    const whoopAnnual = tier === 'one' ? 199 : tier === 'peak' ? 239 : 359;
    const whoopTotal = whoopAnnual * years;
    const airHardware = 99.99;
    const airSubMonths = plan === 'premium' ? Math.max(0, years * 12 - 3) : 0;
    const airTotal = airHardware + (airSubMonths / 12) * 99;
    const fmt = n => '$' + Math.round(n).toLocaleString();
    const savings = whoopTotal - airTotal;
    const tierName = tier === 'one' ? 'One' : tier === 'peak' ? 'Peak' : 'Life · MG';
    const tierSub = tier === 'life' ? 'Includes MG hardware' : '5.0 hardware';
    const savingMsg = savings > 0
      ? `You save <strong>${fmt(savings)}</strong> vs WHOOP One — or <strong>$977</strong> vs WHOOP MG. Trade-off: 1-sec HR storage, MG's ECG/BP, and bicep/calf/apparel wear.`
      : savings < 0
        ? `WHOOP costs <strong>${fmt(-savings)} less</strong> here.`
        : `Both options total <strong>${fmt(airTotal)}</strong> at this configuration.`;

    return `
      <div class="calc-controls">
        <div class="calc-block">
          <div class="label"><img src="${whoopImg}" alt="" /><span>WHOOP membership tier</span></div>
          <div class="seg" data-seg="whoop">
            <button data-val="one" class="${tier==='one'?'active':''}">One <span class="px">$199/yr</span></button>
            <button data-val="peak" class="${tier==='peak'?'active':''}">Peak <span class="px">$239/yr</span></button>
            <button data-val="life" class="${tier==='life'?'active':''}">Life · MG <span class="px">$359/yr</span></button>
          </div>
        </div>
        <div class="calc-block">
          <div class="label"><img src="${fitbitImg}" alt="" /><span>Fitbit Air plan</span></div>
          <div class="seg" data-seg="air">
            <button data-val="free" class="${plan==='free'?'active':''}">Free <span class="px">core tracking</span></button>
            <button data-val="premium" class="${plan==='premium'?'active':''}">Premium <span class="px">$99/yr · AI Coach</span></button>
          </div>
        </div>
        <div class="calc-block">
          <div class="label"><span>Time horizon</span></div>
          <div class="calc-slider">
            <input type="range" min="1" max="5" step="1" value="${years}" data-years />
            <div class="yrs">${years} <span>${years === 1 ? 'year' : 'years'}</span></div>
          </div>
        </div>
        <p class="calc-foot">Hardware: Fitbit Air $99.99 one-time · WHOOP $0 (subscription required). Premium plan includes 3-month free trial.</p>
      </div>
      <div class="calc-result">
        <h4>${years}-year total cost of ownership</h4>
        <div class="calc-row ${airTotal < whoopTotal ? 'win' : ''}">
          <div class="who"><img src="${fitbitImg}" alt="" /><div>Fitbit Air<span class="sub">${plan === 'premium' ? 'Premium · $99/yr' : 'Free plan'}</span></div></div>
          <div class="total">${fmt(airTotal)}</div>
          <div class="breakdown">$99.99 hardware ${plan==='premium' ? `+ ${airSubMonths} mo × $8.25 (after 3-mo free trial)` : '+ $0 sub'}</div>
        </div>
        <div class="calc-row ${whoopTotal < airTotal ? 'win' : ''}">
          <div class="who"><img src="${whoopImg}" alt="" /><div>WHOOP ${tierName}<span class="sub">${tierSub}</span></div></div>
          <div class="total">${fmt(whoopTotal)}</div>
          <div class="breakdown">$0 hardware + ${years} × $${whoopAnnual}/yr</div>
        </div>
        <div class="calc-savings">${savingMsg}</div>
      </div>
    `;
  }

  _renderFAQ() {
    return this._faqs.map(f => `
      <details>
        <summary>${f.q}</summary>
        <div class="body">${f.a}</div>
      </details>
    `).join('');
  }

  // ── Events ───────────────────────────────────────────────────────────

  _bindEvents() {
    const root = this.shadowRoot;

    // Spec table tabs
    root.querySelector('[data-tabs]').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-tab]');
      if (!btn) return;
      this._activeTab = btn.dataset.tab;
      root.querySelector('[data-tabs]').innerHTML = this._renderTabs();
      root.querySelector('[data-tbl-body]').innerHTML = this._renderTable();
    });

    // Calc segment buttons
    root.querySelector('[data-calc]').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-val]');
      if (!btn) return;
      const seg = btn.parentElement.dataset.seg;
      if (seg === 'whoop') this._whoopTier = btn.dataset.val;
      if (seg === 'air') this._airPlan = btn.dataset.val;
      this._updateCalc();
    });

    // Years slider
    root.querySelector('[data-calc]').addEventListener('input', (e) => {
      if (e.target.matches('[data-years]')) {
        this._years = +e.target.value;
        this._updateCalc();
      }
    });

  }

  _updateCalc() {
    this.shadowRoot.querySelector('[data-calc]').innerHTML = this._renderCalc();
  }

  _setupAnimations() {
    const els = this.shadowRoot.querySelectorAll('.animate-on-scroll');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in'));
      return;
    }
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.01 });
    els.forEach(el => this._observer.observe(el));
  }

  // ── Structured Data ──────────────────────────────────────────────────

  _injectStructuredData() {
    if (!document.querySelector('script[data-kygo-fitbitair-whoop-ld]')) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Fitbit Air vs WHOOP: Accuracy, Specs & Cost Compared (2026)',
        'description': 'Compare Fitbit Air, WHOOP 5.0, and WHOOP MG side by side: heart-rate, sleep, and calorie accuracy with numbers, sensors, battery, price, and 3-year cost of ownership.',
        'url': 'https://www.kygo.app/tools/fitbit-air-vs-whoop-comparison',
        'applicationCategory': 'HealthApplication',
        'operatingSystem': 'Web',
        'inLanguage': 'en',
        'isAccessibleForFree': true,
        'datePublished': '2026-05-08',
        'dateModified': '2026-06-12',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
        'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        'featureList': '35-spec side-by-side comparison, dedicated heart-rate/sleep/calorie accuracy breakdown with peer-reviewed numbers, interactive 3-year cost calculator, HR sampling rate visualization, mobile-first responsive design',
        'keywords': 'fitbit air vs whoop, fitbit air vs whoop accuracy, fitbit air accuracy, fitbit air vs whoop 5.0, fitbit air vs whoop mg, fitbit air heart rate accuracy, fitbit air sleep accuracy, whoop accuracy, screenless fitness tracker comparison 2026, whoop subscription cost, fitbit air price, fitbit air specs, whoop mg ECG'
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-fitbitair-whoop-ld', '');
      s.textContent = JSON.stringify(ld);
      document.head.appendChild(s);
    }

    if (!document.querySelector('script[data-kygo-fitbitair-whoop-faq]')) {
      const faq = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': this._faqs.map(f => ({
          '@type': 'Question',
          'name': f.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
        }))
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-fitbitair-whoop-faq', '');
      s.textContent = JSON.stringify(faq);
      document.head.appendChild(s);
    }

    if (!document.querySelector('script[data-kygo-fitbitair-whoop-bc]')) {
      const bc = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.kygo.app' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
          { '@type': 'ListItem', 'position': 3, 'name': 'Fitbit Air vs WHOOP Comparison', 'item': 'https://www.kygo.app/tools/fitbit-air-vs-whoop-comparison' }
        ]
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-fitbitair-whoop-bc', '');
      s.textContent = JSON.stringify(bc);
      document.head.appendChild(s);
    }
  }

  // ── Styles ───────────────────────────────────────────────────────────

  _styles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

      :host {
        --kygo-green: #22C55E;
        --kygo-green-dark: #16A34A;
        --kygo-green-light: #DCFCE7;
        --kygo-dark: #0F172A;
        --kygo-light: #F8FAFC;
        --bg-canvas: #FFFFFF;
        --bg-surface: #F8FAFC;
        --bg-raised: #F1F5F9;
        --fg-1: #0F172A;
        --fg-2: #475569;
        --fg-3: #94A3B8;
        --border-subtle: #E2E8F0;
        --shadow-md: 0 8px 24px rgba(15,23,42,0.06);
        --shadow-cta: 0 8px 24px rgba(34,197,94,0.30);
        --font-display: 'Space Grotesk', sans-serif;
        --font-body: 'DM Sans', sans-serif;
        --font-numeric: 'Space Grotesk', sans-serif;
        --ease-out: cubic-bezier(.16,1,.3,1);
        display: block;
        font-family: var(--font-body);
        color: var(--fg-1);
        background: var(--bg-canvas);
        line-height: 1.5;
      }
      * { box-sizing: border-box; }
      a { color: inherit; text-decoration: none; }
      .ico { display: inline-flex; align-items: center; justify-content: center; }
      .ico svg { width: 1em; height: 1em; }

      /* Animate */
      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity .6s var(--ease-out), transform .6s var(--ease-out); }
      .animate-on-scroll.in { opacity: 1; transform: none; }

      /* Nav */
      .nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.92); backdrop-filter: saturate(160%) blur(14px); -webkit-backdrop-filter: saturate(160%) blur(14px); border-bottom: 1px solid var(--border-subtle); }
      .nav-inner { max-width: 1200px; margin: 0 auto; padding: 14px 20px; display: flex; align-items: center; gap: 16px; }
      .nav-brand { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 700; font-size: 14px; letter-spacing: -0.01em; color: var(--fg-1); text-transform: uppercase; }
      .nav-brand img { width: 26px; height: 26px; }
      .nav-cta-link { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; background: var(--kygo-green); color: #fff; padding: 8px 14px; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none; }
      .nav-cta-link:hover { background: var(--kygo-green-dark); color: #fff; }
      .nav-cta-link .ico { width: 16px; height: 16px; }
      @media (max-width: 480px) { .nav-brand span { display: none; } }

      /* Toolbar */
      .toolbar { border-bottom: 1px solid var(--border-subtle); background: var(--bg-surface); }
      .toolbar-inner { max-width: 1200px; margin: 0 auto; padding: 12px 20px; }
      .crumb { color: var(--fg-3); font-size: 13px; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
      .crumb a { color: var(--fg-3); }
      .crumb a:hover { color: var(--fg-1); }
      .crumb strong { color: var(--fg-1); font-weight: 600; }
      .crumb .sep { color: var(--fg-3); }

      /* Buttons */
      .btn { font-family: var(--font-body); font-weight: 600; font-size: 14px; padding: 10px 18px; border-radius: 10px; border: 0; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all .2s var(--ease-out); white-space: nowrap; }
      .btn .ico { width: 16px; height: 16px; }
      .btn-primary { background: var(--kygo-green); color: #fff; box-shadow: 0 4px 12px rgba(34,197,94,0.25); }
      .btn-primary:hover { background: var(--kygo-green-dark); transform: translateY(-1px); box-shadow: var(--shadow-cta); }
      .btn-lg { padding: 14px 22px; font-size: 15px; border-radius: 12px; }
      .btn-lg .ico { width: 18px; height: 18px; }

      /* Hero */
      .hero-light { background: #fff; border-bottom: 1px solid var(--border-subtle); }
      .hero-light-inner { max-width: 1200px; margin: 0 auto; padding: 48px 20px 36px; }
      .hero-grid { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: center; margin-bottom: 32px; }
      @media (min-width: 880px) { .hero-grid { grid-template-columns: 1.15fr 1fr; gap: 48px; } .hero-light-inner { padding: 64px 24px 48px; } }
      .hero-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.10); color: var(--kygo-green-dark); padding: 6px 14px; border-radius: 999px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.5px; white-space: nowrap; }
      .hero-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kygo-green); flex: none; }
      .hero-light h1 { font-family: var(--font-display); font-weight: 700; color: var(--fg-1); font-size: clamp(30px, 5.5vw, 60px); line-height: 1.05; letter-spacing: -0.02em; margin: 18px 0 18px; }
      .hero-light h1 .hl { color: var(--kygo-green); }
      .hero-lede { font-size: clamp(15px, 1.6vw, 18px); line-height: 1.55; color: var(--fg-2); max-width: 60ch; margin: 0; }
      .hero-lede strong { color: var(--fg-1); font-weight: 600; }
      .hero-vis { background: #fff; border: 1px solid var(--border-subtle); border-radius: 20px; padding: 16px; aspect-ratio: 5 / 3; }
      .hero-vis svg { width: 100%; height: 100%; display: block; }
      @media (max-width: 880px) { .hero-vis { display: none; } }
      .hero-devices { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 22px; align-items: center; justify-items: stretch; }
      .hero-dev { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 12px 14px; color: var(--fg-1); transition: all .2s var(--ease-out); }
      .hero-dev:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); transform: translateY(-2px); }
      .hero-dev img { width: 36px; height: 36px; border-radius: 8px; object-fit: contain; background: var(--kygo-light); padding: 4px; flex: none; }
      .hero-dev strong { font-family: var(--font-display); font-weight: 600; font-size: 15px; display: block; }
      .hero-dev span { color: var(--fg-3); font-size: 12px; display: block; }
      .hero-dev .hero-dev-aff { display: inline-flex; align-items: center; gap: 3px; color: var(--kygo-green-dark); font-weight: 600; font-size: 11px; margin-top: 2px; }
      .hero-dev .hero-dev-aff .ico { width: 11px; height: 11px; transition: transform .15s; }
      .hero-dev:hover .hero-dev-aff .ico { transform: translateX(2px); }
      .hero-vs { font-family: var(--font-display); font-weight: 700; color: var(--kygo-green); font-size: 14px; text-align: center; padding: 2px 0; letter-spacing: 0.06em; text-transform: uppercase; }
      @media (min-width: 560px) {
        .hero-devices { grid-template-columns: 1fr auto 1fr; gap: 14px; }
        .hero-vs { font-size: 16px; padding: 0 4px; }
      }
      .hero-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; border-top: 1px solid var(--border-subtle); padding-top: 24px; }
      @media (min-width: 720px) { .hero-stats { grid-template-columns: repeat(4, 1fr); gap: 24px; padding-top: 28px; } }
      .hero-stat .num { font-family: var(--font-display); font-weight: 700; font-size: clamp(32px, 4.2vw, 44px); line-height: 1; color: var(--kygo-green); letter-spacing: -0.02em; display: inline-flex; align-items: baseline; gap: 2px; }
      .hero-stat .num .unit { color: var(--kygo-green); font-size: 0.55em; font-weight: 600; }
      .hero-stat .lbl { margin-top: 10px; color: var(--fg-3); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; line-height: 1.4; }

      /* Sections */
      .section { padding: 56px 20px; }
      @media (min-width: 720px) { .section { padding: 80px 24px; } }
      .section-inner { max-width: 1200px; margin: 0 auto; }
      .section.bg-white { background: #fff; }
      .section.bg-light { background: var(--kygo-light); }
      .section-head { margin-bottom: 28px; max-width: 720px; }
      .kicker { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 6px 12px; border-radius: 999px; }
      .section h2 { font-family: var(--font-display); font-weight: 600; font-size: clamp(26px, 4vw, 42px); line-height: 1.1; margin: 16px 0 10px; letter-spacing: -0.01em; }
      .section h2 .hl { color: var(--kygo-green); }
      .lede { color: var(--fg-2); font-size: 16px; line-height: 1.55; max-width: 60ch; margin: 0; }

      /* Quick-answer summary (crawlable prose) */
      .tldr-lead { font-size: clamp(15px, 1.7vw, 17px); line-height: 1.6; color: var(--fg-2); max-width: 80ch; margin: 0 0 22px; }
      .tldr-lead strong { color: var(--fg-1); font-weight: 600; }
      .cmp-blocks { display: grid; grid-template-columns: 1fr; gap: 16px; }
      @media (min-width: 760px) { .cmp-blocks { grid-template-columns: 1fr 1fr; } }
      .cmp-block { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 24px; }
      .cmp-block h3 { font-family: var(--font-display); font-weight: 600; font-size: clamp(17px, 2vw, 20px); line-height: 1.2; margin: 0 0 6px; color: var(--fg-1); }
      .cmp-verdict { font-family: var(--font-display); font-weight: 600; font-size: 14px; line-height: 1.4; color: var(--kygo-green-dark); margin: 0 0 12px; }
      .cmp-block p { font-size: 14.5px; line-height: 1.65; color: var(--fg-2); margin: 0; }
      .cmp-block p strong { color: var(--fg-1); font-weight: 600; }

      /* Accuracy cards */
      .acc-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
      @media (min-width: 880px) { .acc-grid { grid-template-columns: repeat(3, 1fr); } }
      .acc-card { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 22px; display: flex; flex-direction: column; }
      .acc-head { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
      .acc-ico { width: 38px; height: 38px; flex: none; border-radius: 10px; background: var(--kygo-green-light); color: var(--kygo-green-dark); display: flex; align-items: center; justify-content: center; }
      .acc-ico .ico { width: 20px; height: 20px; }
      .acc-head h3 { font-family: var(--font-display); font-weight: 600; font-size: 17px; margin: 0; color: var(--fg-1); flex: 1; }
      .acc-win { font-family: var(--font-display); font-size: 10px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 4px 9px; border-radius: 999px; text-align: center; }
      .acc-metrics { display: flex; flex-direction: column; gap: 12px; }
      .acc-metric { border-top: 1px solid var(--border-subtle); padding-top: 12px; }
      .acc-m-label { font-family: var(--font-display); font-size: 12px; font-weight: 600; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 8px; }
      .acc-m-vals { display: flex; flex-direction: column; gap: 6px; }
      .acc-v { display: flex; flex-direction: column; gap: 1px; padding: 7px 10px; border-radius: 9px; background: var(--bg-raised); }
      .acc-v.win { background: var(--kygo-green-light); }
      .acc-v .dev { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; color: var(--fg-3); }
      .acc-v.win .dev { color: var(--kygo-green-dark); }
      .acc-v .val { font-size: 13px; font-weight: 500; color: var(--fg-1); line-height: 1.4; }
      .acc-take { font-size: 13.5px; line-height: 1.55; color: var(--fg-2); margin: 16px 0 0; }
      .acc-src { font-size: 11px; line-height: 1.45; color: var(--fg-3); margin: 12px 0 0; padding-top: 12px; border-top: 1px solid var(--border-subtle); }
      .acc-note { display: flex; gap: 14px; align-items: flex-start; margin-top: 18px; background: var(--kygo-dark); color: #fff; border-radius: 16px; padding: 20px 22px; }
      .acc-note-ico { width: 38px; height: 38px; flex: none; border-radius: 10px; background: rgba(34,197,94,0.16); color: #6EE7A0; display: flex; align-items: center; justify-content: center; }
      .acc-note-ico .ico { width: 20px; height: 20px; }
      .acc-note p { margin: 0; font-size: 13.5px; line-height: 1.6; color: rgba(255,255,255,0.78); }
      .acc-note p strong { color: #fff; font-weight: 600; }
      @media (max-width: 600px) { .acc-note { flex-direction: column; gap: 10px; } }

      /* Best-for */
      .bestfor-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
      @media (min-width: 560px) { .bestfor-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (min-width: 1000px) { .bestfor-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; } }
      .bestfor { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 22px; display: flex; flex-direction: column; gap: 14px; transition: all .25s var(--ease-out); }
      .bestfor:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); transform: translateY(-3px); }
      .bestfor .for-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--kygo-green-light); color: var(--kygo-green-dark); display: flex; align-items: center; justify-content: center; font-size: 22px; }
      .bestfor h3 { font-family: var(--font-display); font-weight: 600; font-size: 14px; margin: 0; color: var(--fg-2); }
      .bestfor .pick { font-family: var(--font-display); font-weight: 600; font-size: 22px; line-height: 1.15; color: var(--fg-1); margin: -4px 0 0; }
      .bestfor .pick em { color: var(--kygo-green-dark); font-style: normal; }
      .bestfor .reason { font-size: 14px; color: var(--fg-2); line-height: 1.5; margin: 0; }
      .bestfor .footer-row { display: flex; align-items: center; gap: 10px; margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border-subtle); }
      .bestfor .price { font-family: var(--font-display); font-weight: 700; font-size: 15px; color: var(--fg-1); }
      .bestfor .yrly { color: var(--fg-3); font-size: 12px; }

      /* HR sampling viz */
      /* Spec table */
      .tbl-wrap { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; overflow: hidden; }
      .tbl-tabs { display: flex; gap: 4px; padding: 12px; border-bottom: 1px solid var(--border-subtle); overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .tbl-tabs button { font-family: var(--font-body); font-size: 13px; font-weight: 600; padding: 9px 14px; border-radius: 10px; border: 0; background: transparent; color: var(--fg-2); cursor: pointer; white-space: nowrap; transition: all .15s ease; display: inline-flex; align-items: center; gap: 8px; }
      .tbl-tabs button:hover { background: var(--bg-raised); color: var(--fg-1); }
      .tbl-tabs button.active { background: var(--kygo-dark); color: #fff; }
      .tbl-tabs button .ct { font-size: 11px; padding: 2px 7px; border-radius: 999px; background: rgba(0,0,0,0.06); }
      .tbl-tabs button.active .ct { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.85); }
      .tbl { width: 100%; border-collapse: collapse; font-family: var(--font-body); }
      .tbl thead th { text-align: left; padding: 16px 18px; font-family: var(--font-display); font-weight: 600; font-size: 13px; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.4px; background: var(--bg-raised); }
      .tbl thead th .head-prod { display: flex; align-items: center; gap: 10px; color: var(--fg-1); text-transform: none; letter-spacing: 0; font-size: 14px; }
      .tbl thead th .head-prod img { width: 22px; height: 22px; border-radius: 5px; background: #fff; padding: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); object-fit: contain; }
      .tbl thead th .amazon-link { display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; font-family: var(--font-body); font-size: 11px; font-weight: 600; color: var(--kygo-green-dark); text-transform: none; letter-spacing: 0; text-decoration: none; transition: color .15s; }
      .tbl thead th .amazon-link:hover { color: var(--kygo-green); }
      .tbl thead th .amazon-link .ico { width: 12px; height: 12px; transition: transform .15s; }
      .tbl thead th .amazon-link:hover .ico { transform: translateX(2px); }
      .tbl tbody td { padding: 14px 18px; border-top: 1px solid var(--border-subtle); vertical-align: top; font-size: 14px; line-height: 1.5; }
      .tbl tbody tr:hover { background: var(--bg-raised); }
      .tbl .spec-name { font-weight: 600; color: var(--fg-1); width: 28%; }
      .tbl .spec-name .info { font-size: 12px; font-weight: 400; color: var(--fg-3); margin-top: 2px; line-height: 1.4; }
      .tbl .n { color: var(--fg-3); }
      .tbl .num { font-family: var(--font-numeric); font-weight: 600; font-size: 15px; color: var(--fg-1); }
      .aff-row { display: none; }
      .aff-row-inner { display: flex; flex-direction: column; gap: 8px; }
      .aff-btn { display: inline-flex; align-items: center; gap: 8px; justify-content: center; padding: 11px 14px; border-radius: 10px; border: 1.5px solid var(--kygo-green-light); background: rgba(34,197,94,0.06); color: var(--kygo-green-dark); font-family: var(--font-body); font-weight: 600; font-size: 13px; transition: all .15s ease; }
      .aff-btn:hover { border-color: var(--kygo-green); background: rgba(34,197,94,0.1); }
      .aff-btn img { width: 18px; height: 18px; border-radius: 4px; background: #fff; padding: 2px; object-fit: contain; }
      .aff-btn .ico { width: 13px; height: 13px; }
      @media (max-width: 720px) {
        .tbl thead { display: none; }
        .tbl tbody td { display: block; padding: 6px 16px; border-top: 0; }
        .tbl tbody tr { display: block; padding: 14px 0; border-top: 1px solid var(--border-subtle); }
        .tbl .spec-name { width: auto; padding-top: 14px; }
        .tbl tbody td.cell::before { content: attr(data-label); display: block; font-size: 10px; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; font-weight: 600; }
        .tbl tbody tr.aff-row { display: block; padding: 16px; background: var(--bg-surface); }
        .tbl tbody tr.aff-row td { display: block; padding: 0; }
      }

      /* Cost calculator */
      .calc { display: grid; grid-template-columns: 1fr; gap: 18px; align-items: stretch; }
      @media (min-width: 880px) { .calc { grid-template-columns: 1.1fr 1fr; gap: 24px; } }
      .calc-controls { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; padding: 22px; display: flex; flex-direction: column; gap: 20px; }
      @media (min-width: 720px) { .calc-controls { padding: 28px; } }
      .calc-block { display: flex; flex-direction: column; gap: 10px; }
      .calc-block .label { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); }
      .calc-block .label img { width: 22px; height: 22px; border-radius: 5px; background: #fff; padding: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); object-fit: contain; }
      .seg { display: flex; gap: 4px; background: var(--bg-raised); padding: 4px; border-radius: 10px; }
      .seg button { flex: 1; font-family: var(--font-body); font-size: 12px; font-weight: 600; padding: 9px 10px; border-radius: 8px; border: 0; background: transparent; color: var(--fg-2); cursor: pointer; transition: all .15s; display: flex; flex-direction: column; align-items: center; gap: 2px; line-height: 1.2; }
      .seg button .px { font-size: 10px; color: var(--fg-3); font-weight: 500; }
      .seg button.active { background: #fff; color: var(--fg-1); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
      .seg button.active .px { color: var(--kygo-green-dark); }
      .calc-slider { display: flex; align-items: center; gap: 14px; }
      .calc-slider input[type=range] { flex: 1; accent-color: var(--kygo-green); }
      .calc-slider .yrs { font-family: var(--font-display); font-weight: 700; font-size: 22px; min-width: 80px; text-align: right; }
      .calc-slider .yrs span { color: var(--fg-3); font-size: 13px; font-weight: 500; }
      .calc-foot { margin: 0; color: var(--fg-3); font-size: 12px; line-height: 1.5; }

      .calc-result { background: var(--kygo-dark); color: #fff; border-radius: 20px; padding: 22px; display: flex; flex-direction: column; gap: 18px; position: relative; overflow: hidden; }
      @media (min-width: 720px) { .calc-result { padding: 28px; } }
      .calc-result::before { content: ''; position: absolute; top: -100px; right: -100px; width: 320px; height: 320px; background: radial-gradient(closest-side, rgba(34,197,94,0.25), transparent); pointer-events: none; }
      .calc-result h4 { font-family: var(--font-display); font-weight: 600; font-size: 13px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.5px; margin: 0; position: relative; }
      .calc-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; padding: 14px 0; border-top: 1px solid rgba(255,255,255,0.10); position: relative; }
      .calc-row:first-of-type { border-top: 0; }
      .calc-row .who { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 600; font-size: 15px; }
      .calc-row .who img { width: 22px; height: 22px; border-radius: 5px; background: #fff; padding: 2px; object-fit: contain; }
      .calc-row .who .sub { display: block; font-weight: 400; font-size: 12px; color: rgba(255,255,255,0.55); }
      .calc-row .total { font-family: var(--font-display); font-weight: 700; font-size: 28px; line-height: 1; color: #fff; text-align: right; letter-spacing: -0.02em; }
      @media (min-width: 720px) { .calc-row .total { font-size: 32px; } }
      .calc-row.win .total { color: var(--kygo-green); }
      .calc-row .breakdown { grid-column: 1 / -1; color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 2px; line-height: 1.4; }
      .calc-savings { margin-top: auto; position: relative; padding: 12px 14px; border-radius: 12px; background: rgba(34,197,94,0.12); color: #6EE7A0; font-size: 13px; font-weight: 500; line-height: 1.5; }
      .calc-savings strong { color: #fff; }

      /* Verdict gaps */
      .gaps { display: grid; grid-template-columns: 1fr; gap: 16px; }
      @media (min-width: 720px) { .gaps { grid-template-columns: 1fr 1fr; } }
      .gap { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 22px; }
      .gap h4 { font-family: var(--font-display); font-weight: 600; font-size: 12px; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 14px; }
      .gap ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
      .gap li { display: grid; grid-template-columns: 28px 1fr; gap: 12px; font-size: 14px; line-height: 1.55; color: var(--fg-2); }
      .gap li .num-tag { font-family: var(--font-display); font-weight: 700; font-size: 13px; color: var(--kygo-green-dark); background: var(--kygo-green-light); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
      .gap li strong { color: var(--fg-1); font-weight: 600; }

      /* Kygo CTA */
      .kygo-cta-card { background: var(--kygo-dark); border-radius: 20px; padding: 40px 24px; position: relative; overflow: hidden; color: #fff; text-align: center; display: flex; flex-direction: column; align-items: center; }
      @media (min-width: 720px) { .kygo-cta-card { padding: 56px 40px; border-radius: 24px; } }
      .kygo-cta-card::before { content: ''; position: absolute; top: -160px; right: -160px; width: 520px; height: 520px; background: radial-gradient(closest-side, rgba(34,197,94,0.30), transparent); pointer-events: none; }
      .kygo-cta-card::after { content: ''; position: absolute; bottom: -180px; left: -180px; width: 480px; height: 480px; background: radial-gradient(closest-side, rgba(34,197,94,0.12), transparent); pointer-events: none; }
      .kygo-cta-card .cta-pill { position: relative; display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.16); color: #6EE7A0; padding: 6px 14px; border-radius: 999px; font-family: var(--font-display); font-size: 12px; font-weight: 600; border: 1px solid rgba(34,197,94,0.25); }
      .kygo-cta-card .cta-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 8px var(--kygo-green); }
      .kygo-cta-card h3 { position: relative; font-family: var(--font-display); font-weight: 600; color: #fff; font-size: clamp(26px, 4.5vw, 42px); line-height: 1.05; letter-spacing: -0.01em; margin: 18px 0 14px; max-width: 22ch; }
      .kygo-cta-card h3 span { color: var(--kygo-green); }
      .kygo-cta-card p { position: relative; color: rgba(255,255,255,0.72); font-size: clamp(14px, 1.6vw, 16px); line-height: 1.6; max-width: 56ch; margin: 0 auto 24px; }
      .kygo-cta-card p em { font-style: italic; color: #fff; }
      .kygo-cta-card .cta-btn-row { position: relative; display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; width: 100%; }
      @media (max-width: 560px) { .kygo-cta-card .cta-btn-row .btn-lg { width: 100%; justify-content: center; } }
      .kygo-cta-card .cta-works { position: relative; margin-top: 26px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: rgba(255,255,255,0.6); font-size: 13px; }
      .kygo-cta-card .cta-badges { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; justify-content: center; }
      .kygo-cta-card .cta-badges img { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); padding: 4px; object-fit: contain; }

      /* FAQ */
      .faq { display: flex; flex-direction: column; gap: 10px; }
      .faq details { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; padding: 4px 20px; transition: border-color .2s; }
      .faq details[open] { border-color: var(--kygo-green); }
      .faq summary { list-style: none; padding: 16px 0; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 14px; }
      .faq summary::-webkit-details-marker { display: none; }
      .faq summary::after { content: '+'; color: var(--kygo-green-dark); font-weight: 600; font-size: 22px; transition: transform .2s; line-height: 1; }
      .faq details[open] summary::after { content: '−'; }
      .faq .body { padding: 0 0 16px; color: var(--fg-2); font-size: 14px; line-height: 1.65; }

      /* Blog CTA */
      .blog-cta { display: grid; grid-template-columns: auto 1fr auto; gap: 18px; align-items: center; background: linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(34,197,94,0.02) 100%); border: 1.5px solid var(--kygo-green-light); border-radius: 18px; padding: 22px; transition: all .25s var(--ease-out); color: var(--fg-1); }
      .blog-cta:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); transform: translateY(-2px); }
      .blog-cta-tag { display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 999px; background: #fff; border: 1.5px solid var(--kygo-green-light); color: var(--kygo-green-dark); font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; white-space: nowrap; }
      .blog-cta-body { min-width: 0; }
      .blog-cta-kicker { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--kygo-green-dark); margin-bottom: 4px; }
      .blog-cta-title { font-family: var(--font-display); font-size: clamp(15px, 2vw, 18px); font-weight: 600; color: var(--fg-1); line-height: 1.3; }
      .blog-cta-title .yr { color: var(--fg-3); font-weight: 500; }
      .blog-cta-sub { font-size: 13px; color: var(--fg-2); margin-top: 4px; line-height: 1.5; }
      .blog-cta-arrow { width: 44px; height: 44px; border-radius: 50%; background: var(--kygo-green); color: #fff; display: inline-flex; align-items: center; justify-content: center; flex: none; box-shadow: 0 4px 12px rgba(34,197,94,0.30); }
      .blog-cta-arrow .ico { width: 20px; height: 20px; }
      @media (max-width: 600px) {
        .blog-cta { grid-template-columns: 1fr auto; grid-template-areas: 'tag arrow' 'body body'; padding: 18px; gap: 14px; }
        .blog-cta-tag { grid-area: tag; justify-self: start; }
        .blog-cta-arrow { grid-area: arrow; width: 40px; height: 40px; }
        .blog-cta-body { grid-area: body; }
      }

      /* Footer (light disclaimer style) */
      .tool-footer { padding: 56px 20px 40px; background: var(--kygo-light); color: var(--fg-2); border-top: 1px solid var(--border-subtle); }
      .tool-footer .container { max-width: 720px; margin: 0 auto; text-align: center; }
      .footer-brand { display: inline-flex; align-items: center; gap: 10px; color: var(--fg-1); font-family: var(--font-display); font-weight: 700; font-size: 17px; }
      .footer-logo { width: 28px; height: 28px; }
      .footer-tagline { color: var(--fg-3); font-size: 14px; margin: 10px 0 22px; }
      .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 18px; margin-bottom: 28px; font-size: 14px; }
      .footer-links a { color: var(--fg-2); }
      .footer-links a:hover { color: var(--kygo-green-dark); }
      .footer-disclaimer { font-size: 12px; color: var(--fg-3); line-height: 1.6; max-width: 620px; margin: 0 auto 14px; }
      .footer-copyright { font-size: 12px; color: var(--fg-3); margin: 4px 0; }
      .footer-affiliate { font-style: italic; }

      /* Early app-download CTA card */
      .kearly-section { padding: 24px 20px 0; }
      .kearly-section .section-inner { max-width: 1200px; margin: 0 auto; }
      .kearly { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.3); border-radius: 16px; padding: 24px 20px; text-align: center; max-width: 780px; margin: 0 auto; }
      .kearly-copy { font-size: 16px; line-height: 1.5; font-weight: 500; color: var(--fg-1); margin: 0 0 16px; }
      .kearly-btns { display: flex; flex-direction: column; gap: 10px; align-items: center; }
      .kearly-btns > a { width: 100%; max-width: 320px; justify-content: center; min-height: 48px; }
      @media (min-width: 520px) { .kearly-btns { flex-direction: row; justify-content: center; } .kearly-btns > a { width: auto; } }
    `;
  }
}

if (!customElements.get('kygo-fitbit-air-vs-whoop')) {
  customElements.define('kygo-fitbit-air-vs-whoop', KygoFitbitAirVsWhoop);
}
