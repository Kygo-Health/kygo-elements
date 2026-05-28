/**
 * Kygo Health — Oura Ring 5 vs Ring 4 vs Gen 3 Comparison Tool
 * Tag: kygo-oura-ring-comparison
 * URL: /oura-ring-comparison-tool
 * Mobile-first side-by-side comparison of Oura Ring Gen 3, Ring 4, and Ring 5.
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

class KygoOuraRingComparison extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._activeTab = 'Overview';
    this._ouraPick = 'ring5';
    this._rival = 'ringconn';
    this._years = 3;
    this._observer = null;
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
    this._setupAnimations();
    __seo(this, 'Oura Ring 5 vs Ring 4 vs Gen 3 Comparison Tool by Kygo Health. Compare Oura Ring Gen 3, Ring 4, and Ring 5 specs side by side with peer-reviewed accuracy data and the real 3-year cost of ownership including the Oura Membership. Ring 5 announced May 28, 2026, ships June 4, starting at $399 (Silver/Black) up to $499 for premium finishes. Ring 5 is 40% smaller than Ring 4, 2 to 2.6 g, 6.09 mm wide, 2.28 mm thick, with 6 to 9 day battery and an optional $99 charging case. Two regressions matter: size range shrinks from Ring 4 sizes 4 to 15 down to Ring 5 sizes 6 to 13, and signal pathways drop from up to 18 on Ring 4 to 12 on Ring 5. Ring 4 launched October 2024 at $349. Gen 3 launched November 2021 and is now discontinued, resale only. All rings require the $5.99/mo or $69.99/yr Oura Membership for full features. Ring 5 3-year total cost of ownership is roughly $609 base or $709 premium; Ring 4 is roughly $559. Peer-reviewed validation supports Gen 3 and Ring 4 as the most accurate consumer sleep tracker vs polysomnography (Khan 2025 meta-analysis, Robbins 2024, Svensson 2024) and the strongest agreement vs ECG for nocturnal HRV and resting heart rate (Dial 2025: Ring 4 CCC 0.98 RHR, 0.99 HRV). Ring 5 has zero independent peer-reviewed validation as of today. The Ring 5 store page "99% HR accuracy" footnote traces to Kinnunen 2020, authored by Oura employees on pre-Gen 3 hardware, and reports an r-squared correlation strength, not an error rate. Subscription-free competitors include RingConn Gen 2 ($299) and Ultrahuman Ring Air ($349). Kygo connects to Oura, Apple Health, Fitbit, Garmin, WHOOP, and Samsung Galaxy Watch.');
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
      Overview: [
        { name: 'Released', gen3: 'Nov 2021', ring4: 'Oct 2024', ring5: 'May 28, 2026 (ships June 4)' },
        { name: 'Status', info: 'Availability today', gen3: n('Discontinued · resale only'), ring4: 'Current', ring5: 'Pre-order' },
        { name: 'Launch price', info: 'Before membership', gen3: '$299–399', ring4: '$349+', ring5: '$399–499' },
        { name: 'Sizes', info: 'US ring size range', gen3: '6–13', ring4: y('4–15'), ring5: '6–13 (launch press)' },
        { name: 'Width', gen3: '7.0–7.9 mm', ring4: '7.90 mm', ring5: y('6.09 mm') },
        { name: 'Thickness', gen3: '2.55 mm', ring4: '2.88–3.51 mm', ring5: y('2.28 mm') },
        { name: 'Weight', gen3: '4–6 g', ring4: '3.3–5.2 g', ring5: y('2–2.6 g') },
        { name: 'Battery (claimed)', gen3: 'Up to 7 days', ring4: '5–8 days', ring5: y('6–9 days') },
        { name: 'Charging case', info: 'Extends time between wall charges', gen3: n('None'), ring4: n('None'), ring5: y('Optional · $99 · ~1 month total') },
        { name: 'Water resistance', gen3: '100 m', ring4: '100 m', ring5: '100 m / IP68' },
        { name: 'Membership required', info: 'For full features', gen3: n('Yes'), ring4: n('Yes'), ring5: n('Yes') },
      ],
      Sensors: [
        { name: 'Core PPG modality', info: 'Green / red / IR LEDs', gen3: 'Yes', ring4: 'Yes', ring5: 'Yes', },
        { name: 'Interior surface', gen3: 'Non-metallic seamless molding (BPA-free)', ring4: 'Full titanium, recessed sensors', ring5: 'Full titanium + PVD scratch coating' },
        { name: 'Sensor dome height', info: 'How far sensors sit from skin', gen3: '~1.3 mm raised', ring4: y('0.3 mm (near-flush)'), ring5: '0.7 mm' },
        { name: 'LEDs', gen3: 'Green, red, IR + IR alignment', ring4: '2 multi-color LEDs + 3 photodiodes', ring5: 'LEDs rotated 180° · shorter paths · more powerful' },
        { name: 'Photodiode', gen3: 'Standard', ring4: 'Standard', ring5: 'Larger PD (offsets shorter paths)' },
        { name: 'Signal pathways', info: 'More pathways = more redundancy', gen3: '~8', ring4: y('Up to 18 (Smart Sensing)'), ring5: n('12 ("stronger" per Oura)') },
        { name: 'Temperature sensor', gen3: 'Analog NTC', ring4: y('Digital'), ring5: y('Digital') },
        { name: 'Accelerometer', gen3: 'Yes', ring4: 'Yes', ring5: 'Yes' },
      ],
      Accuracy: [
        { name: 'Independent validation', info: 'Peer-reviewed, non-Oura', gen3: y('Extensive (Gen 3 explicit, 2024–25)'), ring4: y('Head-to-head vs Gen 3 (Dial 2025)'), ring5: n('None yet · zero studies') },
        { name: 'RHR vs ECG (Dial 2025)', info: 'CCC — higher is better', gen3: '0.97 · MAPE 1.67%', ring4: y('0.98 · MAPE 1.94%'), ring5: 'Inherited claim' },
        { name: 'HRV vs ECG (Dial 2025)', info: 'CCC — higher is better', gen3: '0.97 · MAPE 7.15%', ring4: y('0.99 · MAPE 5.96%'), ring5: 'Inherited claim' },
        { name: 'Sleep/wake vs PSG', info: '2-stage agreement', gen3: '~92% (Robbins/Svensson)', ring4: 'Inferred (shared PPG)', ring5: n('Untested') },
        { name: '4-stage sleep vs PSG', info: 'REM/Deep/Light/Wake', gen3: '76.3% (Robbins, Gen 3)', ring4: 'Inferred', ring5: n('Untested') },
        { name: '"99% HR accuracy" claim', info: 'On Ring 5 store page', gen3: 'Kinnunen 2020 (Oura-authored, r²)', ring4: 'Same source', ring5: n('Inherited, not independent') },
        { name: 'SpO₂ accuracy', info: 'Overnight blood oxygen', gen3: 'Baseline', ring4: y('+30% vs Gen 3 (Oura internal)'), ring5: 'Inherits Ring 4' },
      ],
      'Cost & Plans': [
        { name: 'Hardware price', gen3: num('$299–399 (resale)'), ring4: num('$349'), ring5: num('$399–499') },
        { name: 'Membership', info: 'Required for full features', gen3: '$5.99/mo · $69.99/yr', ring4: '$5.99/mo · $69.99/yr', ring5: '$5.99/mo · $69.99/yr' },
        { name: 'Free without membership', info: 'What still works', gen3: 'Sleep/Readiness/Activity scores only', ring4: 'Same', ring5: 'Same' },
        { name: '3-yr membership', gen3: num('$209.97'), ring4: num('$209.97'), ring5: num('$209.97') },
        { name: '3-yr total cost', info: 'Hardware + membership', gen3: num('~$509 (resale)'), ring4: num('~$559', true), ring5: num('~$609–709') },
        { name: 'Sub-free alternative', info: 'Same category, no membership', gen3: 'RingConn Gen 2 $299 · Ultrahuman $349', ring4: 'RingConn Gen 2 $299 · Ultrahuman $349', ring5: 'RingConn Gen 2 $299 · Ultrahuman $349' },
      ],
      Software: [
        { name: 'Health Radar', info: 'Passive cardiovascular monitoring', gen3: y('Via membership'), ring4: y('Via membership'), ring5: y('Launches here') },
        { name: 'Blood Pressure Signals', info: 'Nighttime BP trends from PPG', gen3: 'Via membership', ring4: 'Via membership', ring5: n('No FDA clearance · not a cuff') },
        { name: 'Nighttime Breathing', info: '30-day breathing-disturbance view', gen3: 'Via membership', ring4: 'Via membership', ring5: n('Not apnea diagnosis') },
        { name: 'GLP-1 Tracking Tools', gen3: y('Via membership'), ring4: y('Via membership'), ring5: y('Yes') },
        { name: 'Live Activity Tracking', info: 'Real-time pace/distance/HR', gen3: 'Via membership', ring4: 'Via membership', ring5: 'Yes' },
        { name: 'Oura Health Records (US)', gen3: y('Via membership'), ring4: y('Via membership'), ring5: y('Yes') },
        { name: 'Advisor AI', gen3: 'Via membership', ring4: 'Via membership', ring5: 'Yes' },
      ],
    };
  }

  get _bestFor() {
    return [
      { icon: 'shield', label: 'For proven accuracy', pick: 'Oura Ring 4', reason: 'The only ring with an independent head-to-head study (Dial 2025): CCC 0.98 RHR and 0.99 HRV vs ECG, beating Gen 3, WHOOP 4.0, Garmin, and Polar. Ring 5 has zero peer-reviewed validation yet.', price: '$349', yrly: '· ~$559 / 3 yrs' },
      { icon: 'moon', label: 'For the smallest ring', pick: 'Oura Ring 5', reason: '40% smaller than Ring 4 at 2–2.6 g and 2.28 mm thick — the world\'s smallest smart ring. 6–9 day battery and an optional $99 charging case for ~1 month between wall charges.', price: '$399', yrly: '· ships June 4' },
      { icon: 'wallet', label: 'For the value buyer', pick: 'Oura Ring 4', reason: 'Cheapest current ring at $349 (~$559 over 3 years vs ~$609 for Ring 5), fully validated, and it keeps the wider 4–15 size range. Every Ring 5 software feature rolls back to it with membership.', price: '$349', yrly: '· no Ring 5 lock-in' },
      { icon: 'ruler', label: 'For small or large fingers', pick: 'Oura Ring 4', reason: 'Ring 5 shrinks the size range to 6–13. Ring 4 still spans sizes 4–15, so very small and very large fingers keep an Oura option that Ring 5 drops at launch.', price: '$349', yrly: '· sizes 4–15' },
    ];
  }

  get _faqs() {
    return [
      { q: 'Is the Ring 5\'s "99% HR accuracy" claim real?', a: 'It needs context. The "99%" footnote on the Ring 5 store page traces back to Kinnunen 2020, a paper authored by Oura employees (including Chief Scientist Hannu Kinnunen), tested on pre-Gen 3 hardware in 49 adults — not Ring 5. The 0.996 figure is an r² correlation strength, not an error percentage. The independent equivalent is Cao 2022 (University of Turku + UC Irvine), which reported a Pearson r of 0.99968 for nightly heart rate — still very strong, but properly attributed. Treat the store-page number as an inherited, Oura-influenced claim, not independent Ring 5 validation.' },
      { q: 'Is the "95% sleep staging accuracy" number accurate?', a: 'It\'s misleading as usually quoted. The ~94–95% figure is the 2-stage sleep/wake sensitivity from Svensson 2024 (which tested Gen 3 and had 3 of 5 authors disclose Oura funding). Full 4-stage classification — REM, deep, light, wake — was 75.5–90.6% by stage in Svensson and 76.3% overall in Robbins 2024. Since PSG inter-rater reliability is only ~80%, mid-70s is near the practical ceiling. The right number depends on which claim is being made.' },
      { q: 'Should I upgrade from Ring 4 to Ring 5?', a: 'For most Ring 4 owners, not yet. Ring 5 is a form-factor and signal-quality refinement, not a new-metric leap — it\'s smaller, lighter, and has slightly longer battery, plus Oura\'s internal study claims 12% better overnight HRV and 24% better workout HR. But all the new software features roll back to Ring 4 with an active membership, Ring 5 has no independent validation yet, the size range shrinks to 6–13, and signal pathways drop from 18 to 12. If your Ring 4 fits and works, there\'s little evidence-based reason to pay again.' },
      { q: 'Do I still need the Oura Membership?', a: 'For almost everything useful, yes. Without an active membership ($5.99/mo or $69.99/yr) the app shows only Sleep, Readiness, and Activity scores plus battery and Explore content. Trends, HRV detail, temperature deviations, period prediction, Advisor AI, Health Radar, Blood Pressure Signals, and GLP-1 tools are all gated. That\'s why the real 3-year cost of a Ring 5 is roughly $609, not $399. Subscription-free rivals like RingConn Gen 2 ($299) and Ultrahuman Ring Air ($349) are genuine alternatives if you only want sleep and HRV.' },
      { q: 'Why did the signal pathway count drop from 18 to 12?', a: 'Because the ring got smaller. Oura\'s engineering blog confirms Ring 5 shrank the battery, PCB, and structural components, so fewer total signal pathways fit in the smaller footprint. Oura frames the 12 pathways as individually "stronger" — LEDs were rotated 180° for shorter optical paths and the photodiode was enlarged to compensate. Whether stronger-but-fewer beats Ring 4\'s 18-pathway Smart Sensing in real-world gap reduction is exactly the kind of claim that has no independent validation yet.' },
      { q: 'Does Kygo work with Oura?', a: 'Yes — Kygo connects to Oura, plus Apple Health, Fitbit, Garmin, WHOOP, and Samsung Galaxy Watch. Whichever ring (or watch) you wear, Kygo cross-checks your sleep, HRV, and recovery data against what you actually eat and train, so you can see which metrics are genuinely predictive for your body.' },
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
      shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>',
      ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l5-5 13 13-5 5z"/><path d="M7 7l2 2M10 4l2 2M13 7l2 2M16 10l2 2"/></svg>',
      apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg>',
      android: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 10v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-2 0zm10 0v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-2 0zM5 17v3a1 1 0 1 0 2 0v-3H5zm12 0v3a1 1 0 1 0 2 0v-3h-2zm-9.5-9c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5H7.5zm.5 1h8a1 1 0 0 1 1 1v6H7v-6a1 1 0 0 1 1-1zM9 5.5a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zm6 0a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1z"/></svg>',
    };
    return `<span class="ico">${map[k] || ''}</span>`;
  }

  // ── Render ───────────────────────────────────────────────────────────

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const fitbitImg = 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png';
    const whoopImg = 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png';
    const appleImg = 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png';
    const garminImg = 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png';
    const healthConnectImg = 'https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="nav">
        <div class="nav-inner">
          <a href="https://kygo.app" class="nav-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" loading="lazy" />
            <span>Kygo Health</span>
          </a>
          <a href="https://kygo.app/iOS" class="nav-cta-link" target="_blank" rel="noopener">
            Get Kygo App ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill"><span class="dot"></span> UPDATED MAY 28, 2026</div>
              <h1>Oura Ring 5 vs Ring 4 vs Gen 3 — <span class="hl">is the upgrade worth it?</span></h1>
              <p class="hero-lede">Ring 5 is smaller, lighter, and longer-lasting — but it has <strong>zero independent validation</strong>, a shrunken size range, and a membership that makes the real 3-year cost ~$609. Compare every spec, the peer-reviewed accuracy data, and your true cost.</p>
            </div>
            <div class="hero-vis" aria-hidden="true">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> Relative thickness</span>
                <span class="hero-vis-tag">40% thinner</span>
              </div>
              <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid meet" role="img" font-family="'Space Grotesk',sans-serif">
                <defs>
                  <linearGradient id="ouraSlate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#CBD5E1"/>
                    <stop offset="1" stop-color="#8A99AD"/>
                  </linearGradient>
                  <linearGradient id="ouraGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#4ADE80"/>
                    <stop offset="1" stop-color="#16A34A"/>
                  </linearGradient>
                  <filter id="ouraDrop" x="-60%" y="-60%" width="220%" height="220%">
                    <feDropShadow dx="0" dy="5" stdDeviation="7" flood-color="#0F172A" flood-opacity="0.14"/>
                  </filter>
                  <filter id="ouraGlow" x="-80%" y="-80%" width="260%" height="260%">
                    <feDropShadow dx="0" dy="6" stdDeviation="11" flood-color="#22C55E" flood-opacity="0.5"/>
                  </filter>
                </defs>

                <!-- ground shadows (same outer diameter) -->
                <ellipse cx="150" cy="230" rx="58" ry="8" fill="#0F172A" opacity="0.06"/>
                <ellipse cx="305" cy="230" rx="58" ry="8" fill="#0F172A" opacity="0.06"/>
                <ellipse cx="460" cy="230" rx="58" ry="8" fill="#0F172A" opacity="0.06"/>

                <!-- Gen 3 — same outer size, medium wall -->
                <g filter="url(#ouraDrop)">
                  <circle cx="150" cy="158" r="51" fill="none" stroke="url(#ouraSlate)" stroke-width="18"/>
                </g>
                <circle cx="150" cy="158" r="42" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.55"/>
                <text x="150" y="250" fill="#64748B" font-size="14" font-weight="600" text-anchor="middle">GEN 3</text>
                <text x="150" y="270" fill="#94A3B8" font-size="12" text-anchor="middle">2.55 mm · 2021</text>

                <!-- Ring 4 — same outer size, thickest wall -->
                <g filter="url(#ouraDrop)">
                  <circle cx="305" cy="158" r="48.5" fill="none" stroke="url(#ouraSlate)" stroke-width="23"/>
                </g>
                <circle cx="305" cy="158" r="37" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.55"/>
                <text x="305" y="250" fill="#64748B" font-size="14" font-weight="600" text-anchor="middle">RING 4</text>
                <text x="305" y="270" fill="#94A3B8" font-size="12" text-anchor="middle">3.51 mm · 2024</text>

                <!-- Ring 5 — same outer size, thinnest wall -->
                <g filter="url(#ouraGlow)">
                  <circle cx="460" cy="158" r="54.5" fill="none" stroke="url(#ouraGreen)" stroke-width="11"/>
                </g>
                <circle cx="460" cy="158" r="49" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.6"/>
                <text x="460" y="250" fill="#16A34A" font-size="14" font-weight="700" text-anchor="middle">RING 5</text>
                <text x="460" y="270" fill="#22C55E" font-size="12" font-weight="600" text-anchor="middle">2.28 mm · 2026</text>

                <!-- thinnest badge -->
                <g transform="translate(460,78)">
                  <rect x="-46" y="-13" width="92" height="22" rx="11" fill="#DCFCE7"/>
                  <text x="0" y="2.5" fill="#16A34A" font-size="10.5" font-weight="700" letter-spacing="0.4" text-anchor="middle">THINNEST EVER</text>
                </g>
              </svg>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">40<span class="unit">%</span></div><div class="lbl">Ring 5 smaller than Ring 4</div></div>
            <div class="hero-stat"><div class="num">2<span class="unit">g</span></div><div class="lbl">Ring 5 — world's smallest smart ring</div></div>
            <div class="hero-stat"><div class="num">$609</div><div class="lbl">Real 3-yr cost with membership</div></div>
            <div class="hero-stat"><div class="num">0</div><div class="lbl">Independent Ring 5 validation studies</div></div>
          </div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Side by side</div>
            <h2>Every spec, <span class="hl">organized.</span></h2>
            <p class="lede">Five categories across three generations. Gen 3 is discontinued (resale only); Ring 4 is current; Ring 5 is pre-order. Green marks the generation that wins each row.</p>
          </div>
          <div class="tbl-wrap">
            <div class="tbl-tabs" data-tabs>${this._renderTabs()}</div>
            <div data-tbl-body>${this._renderTable()}</div>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="kygo-cta-card animate-on-scroll">
            <div class="cta-pill"><span class="dot"></span> Free Forever Plan</div>
            <h3>Your ring tracks the data. <span>Kygo tells you what moves it.</span></h3>
            <p>Whichever Oura you wear, Kygo connects to it and cross-checks every sleep, HRV, and recovery reading against what you actually eat and train — so you see which metrics are genuinely predictive for <em>your</em> body, not just a daily score.</p>
            <div class="cta-btn-row">
              <a class="btn btn-primary btn-lg" href="https://kygo.app/iOS" target="_blank" rel="noopener">${this._icon('apple')} Download for iOS</a>
              <a class="btn btn-primary btn-lg" href="https://kygo.app/android" target="_blank" rel="noopener">${this._icon('android')} Download for Android</a>
            </div>
            <div class="cta-works">
              <span>Works with</span>
              <div class="cta-badges">
                <img src="${ouraImg}" alt="Oura Ring" title="Oura Ring" loading="lazy" />
                <img src="${appleImg}" alt="Apple Health" title="Apple Health" loading="lazy" />
                <img src="${fitbitImg}" alt="Fitbit" title="Fitbit" loading="lazy" />
                <img src="${garminImg}" alt="Garmin" title="Garmin" loading="lazy" />
                <img src="${whoopImg}" alt="WHOOP" title="WHOOP" loading="lazy" />
                <img src="${healthConnectImg}" alt="Health Connect" title="Health Connect" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">3-year cost calculator</div>
            <h2>What you'll <span class="hl">actually spend.</span></h2>
            <p class="lede">The Oura Membership ($69.99/yr) is required for almost every useful insight. Pick a ring, compare against a subscription-free rival, and see the real total over your horizon.</p>
          </div>
          <div class="calc" data-calc>${this._renderCalc()}</div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Quick winner</div>
            <h2>The <span class="hl">right pick</span> depends on what you optimize for.</h2>
            <p class="lede">Four common buyer profiles, ranked on the evidence.</p>
          </div>
          <div class="bestfor-grid">${this._renderBestFor()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <a class="blog-cta animate-on-scroll" href="https://www.kygo.app/post/oura-ring-5-vs-ring-4-is-the-upgrade-worth-it-evidence-based" target="_blank" rel="noopener">
            <span class="blog-cta-tag">Deep Dive</span>
            <div class="blog-cta-body">
              <div class="blog-cta-kicker">Read the full article</div>
              <div class="blog-cta-title">Oura Ring 5 vs Ring 4: Is the Upgrade Worth It? <span class="yr">(Evidence-Based)</span></div>
              <div class="blog-cta-sub">Smaller and lighter — but with no independent validation, a shrunken size range, and fewer signal pathways. We walk through the peer-reviewed accuracy data and the real cost, so you know whether to upgrade.</div>
            </div>
            <span class="blog-cta-arrow">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Bottom line</div>
            <h2>Three real upgrades. <span class="hl">Three things that go backward.</span></h2>
          </div>
          <div class="gaps">
            <div class="gap animate-on-scroll">
              <h4>Three real upgrades</h4>
              <ul>
                <li><span class="num-tag">1</span><span><strong>Dramatically smaller.</strong> 40% smaller than Ring 4, down to 2–2.6 g and 2.28 mm thick — the world's smallest smart ring.</span></li>
                <li><span class="num-tag">2</span><span><strong>Better battery + charging case.</strong> 6–9 days claimed, plus an optional $99 case that holds ~5 charges (~1 month between wall plugs).</span></li>
                <li><span class="num-tag">3</span><span><strong>Oura's internal study.</strong> 12% better overnight HRV, 24% better workout HR signal, 19% better running/cycling/walking accuracy (60 participants, not yet peer-reviewed).</span></li>
              </ul>
            </div>
            <div class="gap animate-on-scroll">
              <h4>Three things that go backward</h4>
              <ul>
                <li><span class="num-tag">1</span><span><strong>Size range shrinks.</strong> From Ring 4's sizes 4–15 down to Ring 5's 6–13. Very small and very large fingers lose Ring 5 as an option.</span></li>
                <li><span class="num-tag">2</span><span><strong>Fewer signal pathways.</strong> 18 on Ring 4 down to 12 on Ring 5. Oura calls them "stronger" — but stronger-but-fewer has no independent validation.</span></li>
                <li><span class="num-tag">3</span><span><strong>No new validation, same cost.</strong> Ring 5 has zero peer-reviewed studies, the "99%" and "95%" claims are Oura-influenced, and membership still pushes TCO to ~$609.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">FAQ</div>
            <h2>Common <span class="hl">questions.</span></h2>
          </div>
          <div class="faq">${this._renderFAQ()}</div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every claim, <span class="hl">traceable.</span></h2>
            <p class="lede">Specs are primary-source verified against Oura's own pages and launch coverage. Accuracy figures come from peer-reviewed studies, with conflicts of interest noted where they apply.</p>
          </div>
          <div class="sources">${this._renderSources()}</div>
        </div>
      </section>

      <footer class="tool-footer">
        <div class="container">
          <a href="https://kygo.app" class="footer-brand">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" loading="lazy" />
            <span>Kygo Health</span>
          </a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <div class="footer-links">
            <a href="https://kygo.app">Home</a>
            <a href="https://kygo.app/how-it-works">How It Works</a>
            <a href="https://kygo.app/blog">Blog</a>
            <a href="https://kygo.app/contact">Contact</a>
            <a href="https://kygo.app/privacy">Privacy</a>
            <a href="https://kygo.app/terms">Terms</a>
          </div>
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Always consult a qualified healthcare provider before making decisions based on wearable data. Oura's Blood Pressure Signals and Nighttime Breathing are not FDA-cleared and do not diagnose any condition.</p>
          <p class="footer-copyright">Data sourced from official Oura specifications, peer-reviewed validation studies (Khan 2025, Robbins 2024, Svensson 2024, Dial 2025, Cao 2022, Kinnunen 2020, Liang 2024), and Ring 5 launch coverage. Last updated May 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
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
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const gen3Link = 'https://amzn.to/3PxP8fM';
    const ring4Link = 'https://amzn.to/3RD6VCL';
    const ring5Link = 'https://amzn.to/3Q4f42J';
    const rows = this._specs[this._activeTab];
    const storeLink = (url) => `<a class="amazon-link" href="${url}" target="_blank" rel="noopener sponsored">View on Amazon ${this._icon('arrowRight')}</a>`;
    return `
      <table class="tbl">
        <thead>
          <tr>
            <th>Spec</th>
            <th><div class="head-prod"><img src="${ouraImg}" alt="" /> <span>Oura Gen 3</span></div>${storeLink(gen3Link)}</th>
            <th><div class="head-prod"><img src="${ouraImg}" alt="" /> <span>Oura Ring 4</span></div>${storeLink(ring4Link)}</th>
            <th><div class="head-prod"><img src="${ouraImg}" alt="" /> <span>Oura Ring 5</span></div>${storeLink(ring5Link)}</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td class="spec-name" data-label="Spec">
                ${r.name}
                ${r.info ? `<div class="info">${r.info}</div>` : ''}
              </td>
              <td class="cell" data-label="Oura Gen 3">${r.gen3}</td>
              <td class="cell" data-label="Oura Ring 4">${r.ring4}</td>
              <td class="cell" data-label="Oura Ring 5">${r.ring5}</td>
            </tr>
          `).join('')}
          <tr class="aff-row">
            <td colspan="4">
              <div class="aff-row-inner">
                <a class="aff-btn" href="${gen3Link}" target="_blank" rel="noopener sponsored"><img src="${ouraImg}" alt="" /> Gen 3 on Amazon ${this._icon('arrowRight')}</a>
                <a class="aff-btn" href="${ring4Link}" target="_blank" rel="noopener sponsored"><img src="${ouraImg}" alt="" /> Ring 4 on Amazon ${this._icon('arrowRight')}</a>
                <a class="aff-btn" href="${ring5Link}" target="_blank" rel="noopener sponsored"><img src="${ouraImg}" alt="" /> Ring 5 on Amazon ${this._icon('arrowRight')}</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    `;
  }

  _renderCalc() {
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const pick = this._ouraPick, rival = this._rival, years = this._years;
    const ouraAmazon = pick === 'ring4' ? 'https://amzn.to/3RD6VCL' : 'https://amzn.to/3Q4f42J';
    const ouraHardware = pick === 'ring4' ? 349 : pick === 'ring5' ? 399 : 499;
    const membershipYr = 69.99;
    const ouraTotal = ouraHardware + membershipYr * years;
    const rivalHardware = rival === 'ringconn' ? 299 : 349;
    const rivalName = rival === 'ringconn' ? 'RingConn Gen 2' : 'Ultrahuman Ring Air';
    const rivalTotal = rivalHardware; // no required subscription
    const fmt = n => '$' + Math.round(n).toLocaleString();
    const pickName = pick === 'ring4' ? 'Ring 4' : pick === 'ring5' ? 'Ring 5' : 'Ring 5 Premium';
    const pickSub = pick === 'ring4' ? '$349 hardware' : pick === 'ring5' ? '$399 hardware' : '$499 hardware';
    const gap = ouraTotal - rivalTotal;
    const gapMsg = gap > 0
      ? `Oura costs <strong>${fmt(gap)} more</strong> than ${rivalName} over ${years} ${years === 1 ? 'year' : 'years'} — almost entirely membership. You're paying for the strongest peer-reviewed validation, Health Radar, and app polish; ${rivalName} has no subscription${rival === 'ringconn' ? ' and 3–4 days more battery' : ' and CGM integration'}.`
      : gap < 0
        ? `${rivalName} costs <strong>${fmt(-gap)} more</strong> at this setup.`
        : `Both options total <strong>${fmt(ouraTotal)}</strong> here.`;

    return `
      <div class="calc-controls">
        <div class="calc-block">
          <div class="label"><img src="${ouraImg}" alt="" /><span>Oura ring</span></div>
          <div class="seg" data-seg="oura">
            <button data-val="ring4" class="${pick==='ring4'?'active':''}">Ring 4 <span class="px">$349</span></button>
            <button data-val="ring5" class="${pick==='ring5'?'active':''}">Ring 5 <span class="px">$399</span></button>
            <button data-val="ring5p" class="${pick==='ring5p'?'active':''}">Ring 5 Premium <span class="px">$499</span></button>
          </div>
        </div>
        <div class="calc-block">
          <div class="label"><span>Subscription-free rival</span></div>
          <div class="seg" data-seg="rival">
            <button data-val="ringconn" class="${rival==='ringconn'?'active':''}">RingConn Gen 2 <span class="px">$299 · no sub</span></button>
            <button data-val="ultrahuman" class="${rival==='ultrahuman'?'active':''}">Ultrahuman Ring Air <span class="px">$349 · no sub</span></button>
          </div>
        </div>
        <div class="calc-block">
          <div class="label"><span>Time horizon</span></div>
          <div class="calc-slider">
            <input type="range" min="1" max="5" step="1" value="${years}" data-years />
            <div class="yrs">${years} <span>${years === 1 ? 'year' : 'years'}</span></div>
          </div>
        </div>
        <p class="calc-foot">Oura Membership is $5.99/mo or $69.99/yr and is required for trends, HRV detail, Health Radar, and most insights. Rivals shown have no required subscription. Resale Gen 3 pricing not included.</p>
      </div>
      <div class="calc-result">
        <h4>${years}-year total cost of ownership</h4>
        <div class="calc-row ${ouraTotal < rivalTotal ? 'win' : ''}">
          <div class="who"><img src="${ouraImg}" alt="" /><div>Oura ${pickName}<span class="sub">${pickSub} + membership</span></div></div>
          <div class="total">${fmt(ouraTotal)}</div>
          <div class="breakdown">${pickSub} + ${years} × $69.99/yr membership</div>
        </div>
        <div class="calc-row ${rivalTotal < ouraTotal ? 'win' : ''}">
          <div class="who"><img src="${ouraImg}" alt="" style="opacity:.35" /><div>${rivalName}<span class="sub">No subscription</span></div></div>
          <div class="total">${fmt(rivalTotal)}</div>
          <div class="breakdown">$${rivalHardware} hardware + $0 sub</div>
        </div>
        <div class="calc-savings">${gapMsg}</div>
        <a class="calc-amazon" href="${ouraAmazon}" target="_blank" rel="noopener sponsored">View Oura ${pickName} on Amazon ${this._icon('arrowRight')}</a>
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

  get _sources() {
    return [
      {
        group: 'Oura primary',
        links: [
          { t: 'Introducing Oura Ring 5', u: 'https://ouraring.com/blog/introducing-oura-ring-5/' },
          { t: 'Inside the Ring: Building Oura Ring 5', u: 'https://ouraring.com/blog/inside-the-ring-oura-ring-5/' },
          { t: 'Oura Ring 5 store page', u: 'https://ouraring.com/store/rings/oura-ring-5' },
          { t: 'Oura Ring 5 Charging Case', u: 'https://ouraring.com/store/accessories/oura-ring-5-charging-case' },
          { t: 'Oura Ring 4 store page', u: 'https://ouraring.com/store/rings/oura-ring-4' },
          { t: 'Previous Oura Ring Generations', u: 'https://support.ouraring.com/hc/en-us/articles/360025570153-Previous-Oura-Ring-Generations' },
          { t: 'Oura Membership', u: 'https://ouraring.com/membership' },
          { t: 'Smart Sensing (Ring 4 vs Gen 3)', u: 'https://ouraring.com/blog/smart-sensing/' },
        ],
      },
      {
        group: 'Peer-reviewed validation',
        links: [
          { t: 'Khan 2025 — meta-analysis (OTO Open)', u: 'https://aao-hnsfjournals.onlinelibrary.wiley.com/doi/full/10.1002/oto2.70181' },
          { t: 'Svensson 2024 (Sleep Med) — Oura COI', u: 'https://pubmed.ncbi.nlm.nih.gov/38382312/' },
          { t: 'Kinnunen 2020 — source of "99%" (Oura-authored)', u: 'https://pubmed.ncbi.nlm.nih.gov/32217820/' },
          { t: 'Cao 2022 — independent (JMIR)', u: 'https://www.jmir.org/2022/1/e27487' },
          { t: 'Robbins 2024 (Sensors)', u: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11511193/' },
          { t: 'Liang, Yilmaz, Soon 2024 (Sensors)', u: 'https://www.mdpi.com/1424-8220/24/23/7475' },
          { t: 'Dial 2025 — Ring 4 vs Gen 3 head-to-head', u: 'https://pubmed.ncbi.nlm.nih.gov/40834291/' },
        ],
      },
      {
        group: 'Ring 5 launch coverage',
        links: [
          { t: 'Business Wire — Ring 5 press release', u: 'https://www.businesswire.com/news/home/20260528686853/en/URA-Introduces-The-Worlds-Smallest-Smart-Ring-Oura-Ring-5' },
          { t: 'TechCrunch', u: 'https://techcrunch.com/2026/05/28/oura-unveils-its-ring-5-with-a-thinner-lighter-design-starting-at-399/' },
          { t: 'Wareable', u: 'https://www.wareable.com/wearable-tech/oura-ring-5-announcement-official-features-design-pricing-availability' },
          { t: "Tom's Guide hands-on", u: 'https://www.tomsguide.com/wellness/smart-rings/ive-worn-the-oura-ring-5-and-it-really-is-tiny-heres-why-i-think-its-the-wearable-to-beat-in-2026' },
          { t: 'AppleInsider — GLP-1 + BP', u: 'https://appleinsider.com/articles/26/05/28/blood-pressure-tracking-glp-1-tools-central-to-new-oura-ring-5' },
          { t: 'The 5k Runner — Ring 4 vs Ring 5', u: 'https://the5krunner.com/2026/05/28/oura-ring-5-vs-ring-4-worth-it-review-opinion/' },
        ],
      },
      {
        group: 'Background & competitors',
        links: [
          { t: 'Wareable — Ring 4 vs Ring 3', u: 'https://www.wareable.com/wearable-tech/oura-ring-4-vs-ring-3-key-differences-compared' },
          { t: 'TechInsights — Ring 4 teardown', u: 'https://www.techinsights.com/blog/oura-ring-gen-4-teardown' },
          { t: 'DC Rainmaker — Ring 4 breakdown', u: 'https://www.dcrainmaker.com/2024/10/oura-announces-oura-4-heres-whats-actually-changed.html' },
          { t: 'RingConn Gen 2 product page', u: 'https://ringconn.com/products/ringconn-gen-2' },
          { t: 'Samsung Galaxy Ring support', u: 'https://www.samsung.com/us/support/answer/ANS10003278/' },
          { t: 'Wareable — Best smart rings 2026', u: 'https://www.wareable.com/fashion/best-smart-rings-1340' },
        ],
      },
    ];
  }

  _renderSources() {
    return this._sources.map(s => `
      <div class="source-group">
        <h4>${s.group}</h4>
        <ul>
          ${s.links.map(l => `<li><a href="${l.u}" target="_blank" rel="noopener nofollow">${l.t} ${this._icon('arrowRight')}</a></li>`).join('')}
        </ul>
      </div>
    `).join('');
  }

  // ── Events ───────────────────────────────────────────────────────────

  _bindEvents() {
    const root = this.shadowRoot;

    root.querySelector('[data-tabs]').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-tab]');
      if (!btn) return;
      this._activeTab = btn.dataset.tab;
      root.querySelector('[data-tabs]').innerHTML = this._renderTabs();
      root.querySelector('[data-tbl-body]').innerHTML = this._renderTable();
    });

    root.querySelector('[data-calc]').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-val]');
      if (!btn) return;
      const seg = btn.parentElement.dataset.seg;
      if (seg === 'oura') this._ouraPick = btn.dataset.val;
      if (seg === 'rival') this._rival = btn.dataset.val;
      this._updateCalc();
    });

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
    if (!('IntersectionObserver' in window)) return;
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12 });
    this.shadowRoot.querySelectorAll('.animate-on-scroll').forEach(el => this._observer.observe(el));
  }

  // ── Structured Data ──────────────────────────────────────────────────

  _injectStructuredData() {
    if (!document.querySelector('script[data-kygo-oura-ld]')) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Oura Ring 5 vs Ring 4 vs Gen 3 Comparison Tool',
        'description': 'Compare Oura Ring 5, Ring 4, and Gen 3 side by side. See specs, peer-reviewed accuracy data, and the real 3-year cost with subscription math included.',
        'url': 'https://www.kygo.app/oura-ring-comparison-tool',
        'applicationCategory': 'HealthApplication',
        'operatingSystem': 'Web',
        'inLanguage': 'en',
        'isAccessibleForFree': true,
        'datePublished': '2026-05-28',
        'dateModified': '2026-05-28',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
        'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        'featureList': '40-spec side-by-side comparison across three Oura generations, peer-reviewed accuracy breakdown, interactive 3-year cost calculator with subscription math, sensor hardware changes, mobile-first responsive design',
        'keywords': 'oura ring 5 vs ring 4, oura ring 5 vs gen 3, oura ring comparison, oura ring 5 specs, oura ring 5 accuracy, oura ring 5 price, oura membership cost, oura ring 4 vs ring 5, smart ring comparison 2026, oura ring validation studies'
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-oura-ld', '');
      s.textContent = JSON.stringify(ld);
      document.head.appendChild(s);
    }

    if (!document.querySelector('script[data-kygo-oura-faq]')) {
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
      s.setAttribute('data-kygo-oura-faq', '');
      s.textContent = JSON.stringify(faq);
      document.head.appendChild(s);
    }

    if (!document.querySelector('script[data-kygo-oura-bc]')) {
      const bc = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.kygo.app' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
          { '@type': 'ListItem', 'position': 3, 'name': 'Oura Ring Comparison Tool', 'item': 'https://www.kygo.app/oura-ring-comparison-tool' }
        ]
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-oura-bc', '');
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
      .nav-cta-link { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; color: var(--kygo-green-dark); font-weight: 600; font-size: 14px; }
      .nav-cta-link .ico { width: 16px; height: 16px; }
      @media (max-width: 480px) { .nav-brand span { display: none; } }

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
      .hero-vis { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 6px; background: linear-gradient(158deg, #ffffff 0%, #EEF2F7 100%); border: 1px solid var(--border-subtle); border-radius: 20px; padding: 16px 18px; aspect-ratio: 5 / 3; box-shadow: 0 16px 40px rgba(15,23,42,0.08); }
      .hero-vis::before { content: ''; position: absolute; top: -90px; right: -70px; width: 240px; height: 240px; background: radial-gradient(closest-side, rgba(34,197,94,0.16), transparent); pointer-events: none; }
      .hero-vis::after { content: ''; position: absolute; bottom: -110px; left: -70px; width: 230px; height: 230px; background: radial-gradient(closest-side, rgba(148,163,184,0.16), transparent); pointer-events: none; }
      .hero-vis-head { position: relative; display: flex; align-items: center; justify-content: space-between; }
      .hero-vis-title { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: var(--fg-3); }
      .hero-vis-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 0 3px rgba(34,197,94,0.18); }
      .hero-vis-tag { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.3px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 4px 10px; border-radius: 999px; }
      .hero-vis svg { position: relative; width: 100%; flex: 1; min-height: 0; display: block; }
      @media (max-width: 880px) { .hero-vis { display: none; } }
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
      .tbl .y { color: var(--kygo-green-dark); font-weight: 600; }
      .tbl .n { color: var(--fg-3); }
      .tbl .num { font-family: var(--font-numeric); font-weight: 600; font-size: 15px; color: var(--fg-1); }
      .tbl .num.y { color: var(--kygo-green-dark); }
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
      .calc-amazon { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 6px; align-self: flex-start; padding: 11px 18px; border-radius: 10px; background: var(--kygo-green); color: #fff; font-family: var(--font-body); font-weight: 600; font-size: 13px; text-decoration: none; transition: all .15s ease; }
      .calc-amazon:hover { background: var(--kygo-green-dark); transform: translateY(-1px); }
      .calc-amazon .ico { width: 14px; height: 14px; transition: transform .15s; }
      .calc-amazon:hover .ico { transform: translateX(2px); }

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

      /* Sources */
      .sources { display: grid; grid-template-columns: 1fr; gap: 16px; }
      @media (min-width: 560px) { .sources { grid-template-columns: repeat(2, 1fr); } }
      @media (min-width: 1000px) { .sources { grid-template-columns: repeat(4, 1fr); } }
      .source-group { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 22px; }
      .source-group h4 { font-family: var(--font-display); font-weight: 600; font-size: 12px; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 14px; }
      .source-group ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
      .source-group li { font-size: 13px; line-height: 1.45; }
      .source-group a { display: inline-flex; align-items: flex-start; gap: 5px; color: var(--fg-2); transition: color .15s; }
      .source-group a:hover { color: var(--kygo-green-dark); }
      .source-group a .ico { width: 12px; height: 12px; color: var(--kygo-green-dark); flex: none; margin-top: 3px; transition: transform .15s; }
      .source-group a:hover .ico { transform: translateX(2px); }

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
    `;
  }
}

if (!customElements.get('kygo-oura-ring-comparison')) {
  customElements.define('kygo-oura-ring-comparison', KygoOuraRingComparison);
}
