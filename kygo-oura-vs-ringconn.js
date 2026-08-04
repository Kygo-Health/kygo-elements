/**
 * Kygo Health, Oura Ring vs RingConn Comparison Tool (2026)
 * Tag: kygo-oura-vs-ringconn
 * URL: /tools/oura-vs-ringconn
 * Mobile-first, brand-vs-brand comparison of Oura (Ring 5 / Ring 4) and
 * RingConn (Gen 3 / Gen 2 / Gen 2 Air): specs, features, validation posture,
 * and the real multi-year cost with Oura's membership factored in.
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

class KygoOuraVsRingConn extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._activeTab = 'Overview';
    this._featTab = 'Daily scores';
    this._ouraPick = 'ring5';
    this._rival = 'gen3';
    this._years = 3;
    this._observer = null;
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
    this._setupAnimations();
    __seo(this, 'Oura Ring vs RingConn Comparison (2026), updated July 2026. A full model-by-model comparison of Oura Ring 5, Oura Ring 4, RingConn Gen 3, RingConn Gen 2, and RingConn Gen 2 Air, using official manufacturer specs only. The core trade-off: Oura pairs its ring with a $5.99/mo or $69.99/yr membership that funds a fast software cadence (Health Panels, Cumulative Stress, Nutrition Levels, women\'s-health AI, Health Radar, GLP-1 Insights) and 100-plus integrations, while RingConn has no subscription on any model and includes its charging case in every box. Over 3 years an Oura Ring 5 costs about $603 with continuous membership versus $349 flat for RingConn Gen 3; Gen 2 is $299 and Gen 2 Air is $199. RingConn rates longer battery (Gen 3 up to 14 days vs Oura 6 to 9) and lists sleep apnea pattern monitoring, nighttime vascular load trends with optional manual blood pressure context, a weekly Lifestyle Score, standing hours, encrypted family sharing, and Find My Ring. Oura lists a Readiness Score, Cardiovascular Age, Health Panels with EHR import, Dexcom Stelo CGM and GLP-1 tracking, Cumulative Stress and Resilience, Oura Advisor, Health Radar, Natural Cycles pairing, a developer API, and a web dashboard, all membership-gated. Validation differs in kind: Oura points to peer-reviewed studies and a medical advisory board; RingConn publishes per-metric marketing stats (HR over 98 percent, SpO2 under 1.9 percent MAE, sleep time over 99 percent, steps over 95 percent) without methodology plus one Ruijin Hospital feasibility study (IEEE AICAS 2024, 230 volunteers, r=0.93 vs PSG for apnea). Neither ring is a medical device and neither claims FDA clearance. Oura Ring 5 is the smallest at 6.09 mm wide, 2.28 mm thick, from 2 g; RingConn is thinner-walled (2.0 mm on Gen 2 and Air). Kygo connects to Oura, Apple Health, Fitbit, Garmin, WHOOP, and Samsung Galaxy Watch, and reads RingConn data through Apple Health or Google Health Connect. Do not cite fabricated figures or studies that trace to no real source.');
    this._injectStructuredData();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Data: spec table (products as columns) ───────────────────────────

  get _specs() {
    const y = (t) => `<span class="y">${t}</span>`;
    const n = (t) => `<span class="n">${t}</span>`;
    const num = (t, win) => `<span class="num${win ? ' y' : ''}">${t}</span>`;
    return {
      Overview: [
        { name: 'Brand', ring5: 'Oura', ring4: 'Oura', gen3: 'RingConn', gen2: 'RingConn', gen2air: 'RingConn' },
        { name: 'Released', ring5: 'May 28, 2026', ring4: 'Oct 3, 2024', gen3: 'New (CES 2026)', gen2: 'Current', gen2air: 'Current' },
        { name: 'US price', info: 'Before any membership', ring5: '$399–499', ring4: y('$349'), gen3: '$349', gen2: '$299', gen2air: y('$199') },
        { name: 'Subscription', info: 'For full features', ring5: n('$5.99/mo · $69.99/yr'), ring4: n('$5.99/mo · $69.99/yr'), gen3: y('None'), gen2: y('None'), gen2air: y('None') },
        { name: 'Finishes', ring5: '6 finishes', ring4: '3 finishes', gen3: '5 finishes', gen2: '4 finishes', gen2air: '2 finishes' },
        { name: 'HSA/FSA eligible', ring5: y('Yes'), ring4: y('Yes'), gen3: y('Yes (via Flex)'), gen2: y('Yes'), gen2air: y('Yes') },
        { name: 'Water resistance', ring5: '100 m + IP68', ring4: '100 m', gen3: 'IP68 / 10 ATM, 100 m', gen2: '100 m', gen2air: '100 m' },
      ],
      Hardware: [
        { name: 'Band width', info: 'RingConn does not publish width', ring5: y('6.09 mm'), ring4: '7.90 mm', gen3: 'not published', gen2: 'not published', gen2air: 'not published' },
        { name: 'Wall thickness', ring5: '2.28 mm', ring4: '2.88 mm', gen3: '2.3 mm', gen2: y('2.0 mm'), gen2air: y('2.0 mm') },
        { name: 'Weight', info: 'Varies by size', ring5: y('from 2 g'), ring4: '3.3–5.2 g', gen3: '2.5–3.5 g', gen2: y('2–3 g'), gen2air: '2.5–4 g' },
        { name: 'Material', ring5: 'Titanium', ring4: 'Titanium', gen3: 'Titanium + epoxy, PVD', gen2: 'Aerospace titanium + epoxy', gen2air: 'Stainless steel + epoxy' },
        { name: 'Size range', info: 'US ring sizes', ring5: '6–13', ring4: y('4–15'), gen3: '6–15', gen2: '6–14', gen2air: '6–14' },
        { name: 'Sensors', ring5: '2 photodetectors, dual triple LEDs, 12 pathways, temp, accel', ring4: 'Red/green/IR LEDs, 3 photodiodes, temp, accel', gen3: 'Optical HR, temp, 3-axis accel, vibration motor', gen2: 'Optical HR, temp, accel', gen2air: 'Optical HR, temp, accel' },
        { name: 'On-ring offline storage', ring5: 'not published', ring4: 'not published', gen3: y('10 days'), gen2: '7 days', gen2air: '7 days' },
        { name: 'Connectivity', ring5: 'BLE', ring4: 'BLE', gen3: 'Bluetooth 5.0', gen2: 'Bluetooth', gen2air: 'Bluetooth' },
      ],
      Battery: [
        { name: 'Rated battery', info: 'Manufacturer ratings', ring5: '6–9 days', ring4: '5–8 days', gen3: y('Up to 14 days'), gen2: 'Up to 12 days', gen2air: 'Up to 10 days' },
        { name: 'Ring charge time', ring5: '~80 min', ring4: '20–80 min', gen3: '~90 min', gen2: '~90 min', gen2air: '~90 min' },
        { name: 'Charging case in box', ring5: n('No · $99 add-on'), ring4: n('No'), gen3: y('Yes · wireless case'), gen2: y('Yes · wireless case'), gen2air: y('Yes · wired dock') },
        { name: 'Charging accessory', ring5: '$99 case (holds ~5 charges)', ring4: 'Size-specific charger', gen3: 'Case included', gen2: 'Case included ("up to 150 days" w/ case)', gen2air: 'Dock included · $39.90 case option' },
      ],
      Cost: [
        { name: 'Hardware price', ring5: num('$399–499'), ring4: num('$349'), gen3: num('$349'), gen2: num('$299'), gen2air: num('$199') },
        { name: '3-yr subscription', info: 'At $69.99/yr', ring5: num('$209.97'), ring4: num('$209.97'), gen3: num('$0', true), gen2: num('$0', true), gen2air: num('$0', true) },
        { name: '3-yr total cost', info: 'Hardware + subscription', ring5: num('~$603'), ring4: num('~$553'), gen3: num('$349'), gen2: num('$299'), gen2air: num('$199', true) },
        { name: '5-yr total cost', ring5: num('~$743'), ring4: num('~$693'), gen3: num('$349'), gen2: num('$299'), gen2air: num('$199', true) },
        { name: 'Without subscription', info: 'What still works', ring5: n('3 daily scores only'), ring4: n('3 daily scores only'), gen3: y('Everything included'), gen2: y('Everything included'), gen2air: y('Everything included') },
      ],
      Warranty: [
        { name: 'Standard warranty', ring5: '1 yr US (2 yr some regions)', ring4: '1 yr US (2 yr some regions)', gen3: '1 yr (2 yr EEA)', gen2: '1 yr (2 yr EEA)', gen2air: '1 yr (2 yr EEA)' },
        { name: 'Return window', ring5: y('30 days'), ring4: y('30 days'), gen3: '14 days', gen2: '14 days', gen2air: '14 days' },
        { name: 'Extended protection', ring5: '2-yr $45 / 3-yr $60', ring4: '2-yr $45 / 3-yr $60', gen3: 'Care+ 2-yr $40.99 / 3-yr $51.99', gen2: 'Care+ 2-yr $35.99', gen2air: 'Care+ 2-yr $28.99' },
        { name: 'Trade-in program', ring5: n('None found'), ring4: n('None found'), gen3: y('Up to $70'), gen2: y('Listed per model'), gen2air: y('Listed per model') },
      ],
    };
  }

  // ── Data: feature comparison (Oura vs RingConn) ──────────────────────
  // Each row: name, optional info, o:[has, text], r:[has, text].
  // A dash / has:false means the feature is absent from that brand's official
  // pages as of July 2026, not proof it never exists in-app.

  get _features() {
    return {
      'Daily scores': [
        { name: 'Sleep score', o: [true, 'Sleep Score (stages, latency, timing)'], r: [true, 'Sleep Score'] },
        { name: 'Readiness / recovery score', o: [true, 'Readiness Score drives daily goals'], r: [false, 'No dedicated readiness score'] },
        { name: 'Activity score', o: [true, '1–100, movement vs recovery'], r: [true, 'Activity Score'] },
        { name: 'Stress score', o: [true, 'Daytime Stress'], r: [true, 'Stress Score, real-time trends'] },
        { name: 'Weekly lifestyle score', o: [false, 'Not listed'], r: [true, 'Lifestyle Score (7 factors, weekly)'] },
        { name: 'Bedtime / wind-down guidance', o: [true, 'Bedtime Guidance reminders'], r: [false, 'Not listed'] },
        { name: 'Rest Mode (pause goals when sick)', o: [true, 'Yes'], r: [false, 'Not listed'] },
      ],
      Sleep: [
        { name: 'Sleep stages (light/deep/REM/awake)', o: [true, 'All models'], r: [true, 'All models'] },
        { name: 'Nap tracking', o: [true, 'Nap Detection'], r: [true, 'Tracks naps'] },
        { name: 'Nighttime SpO₂ / breathing', o: [true, 'Blood Oxygen + breathing disturbance'], r: [true, 'SpO₂ every 2 seconds, low-oxygen events'] },
        { name: 'Sleep apnea pattern monitoring', info: 'Neither diagnoses apnea', o: [false, 'Breathing disturbances only, no apnea index'], r: [true, 'Gen 3 + Gen 2 (claimed 90.7%). Not on Gen 2 Air'] },
        { name: 'Chronotype / Body Clock', o: [true, 'Requires >30 days data'], r: [false, 'Not listed'] },
        { name: 'Sleep trend / factor analysis', o: [true, 'Scores + reports'], r: [true, '7-factor breakdown, action insights'] },
      ],
      Heart: [
        { name: 'Heart rate', o: [true, '24/7 (day, night, activity)'], r: [true, '24/7, sampled ~every 2.5 min'] },
        { name: 'HRV', o: [true, '24/7'], r: [true, '24/7'] },
        { name: 'Respiratory rate', o: [true, 'Nightly'], r: [true, 'Nighttime'] },
        { name: 'Skin temperature trends', o: [true, 'Yes'], r: [true, 'Yes'] },
        { name: 'Cardiovascular Age', o: [true, 'CVA vs actual age'], r: [false, 'Not listed'] },
        { name: 'VO₂ max / cardio capacity', o: [true, 'Yes'], r: [true, 'Listed on all models'] },
        { name: 'Vascular / BP-related trends', info: 'Not a cuff, not single readings', o: [false, 'Not listed'], r: [true, 'Gen 3: vascular load + optional manual BP inputs'] },
        { name: 'AFib detection', o: [false, 'Not claimed'], r: [false, 'Not claimed'] },
      ],
      'Activity & stress': [
        { name: 'Steps / calories', o: [true, 'Yes'], r: [true, 'Yes'] },
        { name: 'Automatic activity detection', o: [true, 'Up to 40 activity types'], r: [false, 'Manual workout modes only'] },
        { name: 'Heart-rate zones in workouts', o: [true, 'Customizable max HR, splits'], r: [true, 'Post-exercise data'] },
        { name: 'Goals adapt to recovery', o: [true, 'Via Readiness Score'], r: [false, 'Not listed'] },
        { name: 'Standing hours', o: [false, 'Not listed'], r: [true, 'Standing-hours tracking'] },
        { name: 'Long-term stress load', o: [true, 'Cumulative Stress'], r: [false, 'Not listed'] },
        { name: 'Resilience metric', o: [true, 'Stress Resilience'], r: [false, 'Not listed'] },
        { name: 'Guided breathwork', o: [true, 'Headspace integration'], r: [false, 'Not listed'] },
      ],
      "Women's health": [
        { name: 'Cycle phase tracking', o: [true, 'Cycle Insights (temp-based)'], r: [true, 'Full-cycle predictions (temp-based)'] },
        { name: 'Period prediction', o: [true, 'Yes'], r: [true, 'Yes, with advance reminders'] },
        { name: 'Ovulation / fertile window', o: [true, 'Select countries'], r: [true, 'Ovulation-day temp-dip detection'] },
        { name: 'Pregnancy insights', o: [true, 'Pregnancy Insights'], r: [true, 'Pregnancy Management'] },
        { name: 'FDA-cleared birth-control pairing', o: [true, 'Natural Cycles (+ Clue, Flo)'], r: [false, 'Not listed'] },
        { name: 'Monthly cycle report', o: [false, 'Covered in periodic reports'], r: [true, 'Monthly Cycle Report'] },
        { name: "Dedicated women's-health AI", o: [true, 'Oura Labs'], r: [false, 'Not listed'] },
      ],
      Metabolic: [
        { name: 'Meal logging with AI photo analysis', o: [true, 'Meals → Advisor insights'], r: [false, 'Not listed'] },
        { name: 'Nutrition scoring', o: [true, 'Nutrition Levels'], r: [false, 'Not listed'] },
        { name: 'Continuous glucose (CGM) integration', o: [true, 'Dexcom Stelo, 24/7 graphs'], r: [false, 'Not listed'] },
        { name: 'GLP-1 medication tracking', o: [true, 'GLP-1 Insights'], r: [false, 'Not listed'] },
      ],
      'AI & data': [
        { name: 'AI health coach', o: [true, 'Oura Advisor (membership)'], r: [true, 'RingConn Partner, free but application-only'] },
        { name: 'AI medical guidance', o: [true, 'Counsel Health partnership'], r: [false, 'Not listed'] },
        { name: 'Proactive health surveillance', o: [true, 'Health Radar'], r: [true, 'Smart Vibration Alerts (Gen 3)'] },
        { name: 'Lab / biomarker context', o: [true, 'Health Panels + EHR import'], r: [false, 'Not listed'] },
        { name: 'Reports', o: [true, 'Weekly / monthly / quarterly / yearly'], r: [true, 'Weekly + yearly + cycle report'] },
        { name: 'Encrypted family data sharing', o: [false, 'Not listed'], r: [true, 'Share with family/friends'] },
        { name: 'Find-my-device', o: [false, 'Not listed'], r: [true, 'Find My Ring'] },
        { name: 'Third-party app ecosystem', o: [true, '100+ integrations (membership)'], r: [false, 'Apple Health + Google Health only'] },
        { name: 'Public developer API', o: [true, 'Members only'], r: [false, 'Not listed'] },
        { name: 'Web dashboard', o: [true, 'Oura on the Web'], r: [false, 'Not listed'] },
        { name: 'Raw data export', o: [true, 'CSV, free even without membership'], r: [false, 'No export method published'] },
      ],
    };
  }

  get _bestFor() {
    return [
      { icon: 'shield', label: 'For the deepest feature set + validation', pick: 'Oura Ring 5', reason: 'The widest published feature set (Readiness, Cardiovascular Age, Health Panels, Cumulative Stress, Advisor), 100+ integrations, and the only side pointing to peer-reviewed validation studies and a medical advisory board. All of it needs the membership.', price: '$399', yrly: '· ~$603 / 3 yrs' },
      { icon: 'sparkles', label: 'For metabolic + FDA-cleared cycle pairing', pick: 'Oura Ring 4', reason: 'The cheapest way into Oura at $349. Same app: Dexcom Stelo CGM, GLP-1 Insights, Nutrition Levels, and Natural Cycles birth-control pairing, none of which RingConn lists. Membership still applies.', price: '$349', yrly: '· ~$553 / 3 yrs' },
      { icon: 'battery', label: 'For no subscription + the longest battery', pick: 'RingConn Gen 3', reason: 'Everything is included at purchase with no recurring fee, the charging case is in the box, battery is rated up to 14 days, and it adds sleep apnea monitoring plus nighttime vascular trends. $349 flat, forever.', price: '$349', yrly: '· $0 subscription' },
      { icon: 'wallet', label: 'For the budget buyer', pick: 'RingConn Gen 2', reason: 'Sleep apnea pattern monitoring, SpO₂, HRV, and cycle tracking at $299 with no subscription, or step down to the $199 Gen 2 Air (which drops apnea) for the lowest-cost smart ring here.', price: '$299', yrly: '· Gen 2 Air $199' },
    ];
  }

  get _faqs() {
    return [
      { q: 'Is Oura or RingConn cheaper over time?', a: 'RingConn, and it is not close once you keep the Oura membership. RingConn has no subscription on any model, so a Gen 3 stays $349 forever, a Gen 2 is $299, and a Gen 2 Air is $199. Oura requires a $5.99/mo or $69.99/yr membership for almost every insight beyond the three daily scores, so an Oura Ring 5 works out to roughly $603 over 3 years and about $743 over 5. The honest caveat: that recurring fee funds a genuinely faster software cadence and a much larger feature set, so the fair comparison weighs feature depth, not just the dollar total. Oura membership is also cancelable at any time (you keep the three scores), and both the hardware and the membership are HSA/FSA eligible.' },
      { q: 'Which ring is more accurate, Oura or RingConn?', a: 'Both publish accuracy claims, but the type of evidence differs and that matters. Oura points to multiple peer-reviewed validation studies and a medical advisory board. RingConn lists strong per-metric numbers on its Gen 3 page (heart rate over 98%, SpO₂ under 1.9% MAE, sleep time over 99%, steps over 95%) but does not publish the methodology behind them on that page; its strongest external evidence is a hospital-partnered feasibility study with Ruijin Hospital (IEEE AICAS 2024, 230 volunteers, r=0.93 vs a sleep lab for apnea patterns). Neither ring is a medical device and neither claims FDA clearance. Treat RingConn\'s marketing-page stats as manufacturer claims, and Oura\'s as claims backed by a published research program.' },
      { q: 'Does RingConn really have no subscription?', a: 'Correct, as of July 2026: RingConn charges no subscription on Gen 3, Gen 2, or Gen 2 Air, and includes the charging case or dock in the box. Everything the app offers is unlocked at purchase. The trade-off is that RingConn has no dedicated recurring-revenue stream funding new features, so its published feature set is currently narrower and its release cadence is slower. RingConn markets "no subscription" as permanent, but only Oura\'s membership terms are contractual per purchase, so treat RingConn\'s as its current policy rather than a guarantee.' },
      { q: 'What does RingConn do that Oura does not?', a: 'Per each company\'s official pages: sleep apnea pattern monitoring (Gen 3 and Gen 2), nighttime vascular-load trends with optional manual blood-pressure context (Gen 3), vibration-based health alerts (Gen 3), a weekly Lifestyle Score, a Monthly Cycle Report, standing-hours tracking, encrypted family data sharing, Find My Ring, 7 to 10 days of on-ring offline storage, and a free AI assistant (currently application-only via RingConn Lab). The mirror image is Oura\'s much larger software list, so the two rings are genuinely optimizing for different things.' },
      { q: 'What does Oura do that RingConn does not?', a: 'A Readiness Score, Cardiovascular Age, Health Panels with EHR import, a full metabolic suite (AI meal logging, Nutrition Levels, Dexcom Stelo CGM integration, GLP-1 Insights), Cumulative Stress and Resilience, Oura Advisor plus Counsel Health medical guidance, Health Radar, Natural Cycles and 100+ third-party integrations, a public developer API, a web dashboard, and free CSV data export. Every one of these is gated behind the Oura membership, which is exactly why the multi-year cost is higher.' },
      { q: 'Can Kygo use my Oura or RingConn data?', a: 'Yes. Kygo connects directly to Oura, plus Apple Health, Fitbit, Garmin, WHOOP, and Samsung Galaxy Watch. RingConn syncs to Apple Health and Google Health Connect, so Kygo can read your RingConn sleep, HRV, and heart-rate data through Apple Health on iPhone. Whichever ring you wear, Kygo cross-checks those readings against what you actually eat and train, so you can see which metrics are genuinely predictive for your body instead of just staring at a daily score.' },
    ];
  }

  // ── Icons ────────────────────────────────────────────────────────────

  _icon(k) {
    const map = {
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
      dash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',
      wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h16v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7"/><circle cx="17" cy="13" r="1.2"/></svg>',
      battery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="16" height="9" rx="2"/><path d="M22 11v3"/><path d="M6 11v3"/><path d="M9.5 11v3"/><path d="M13 11v3"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
      shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>',
      sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.9L18.7 9.7l-4.9 1.8L12 16.4l-1.8-4.9L5.3 9.7l4.9-1.8L12 3z"/><path d="M19 14l.8 2.2 2.2.8-2.2.8L19 20l-.8-2.2-2.2-.8 2.2-.8L19 14z"/></svg>',
      flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6.5L5.2 17a2 2 0 0 0 1.7 3h10.2a2 2 0 0 0 1.7-3L14 9.5V3"/><path d="M7.5 14h9"/></svg>',
      apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg>',
      android: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
    };
    return `<span class="ico">${map[k] || ''}</span>`;
  }

  // ── Related tools (cross-link cards) ──────────────────────────────────

  _relatedTools() {
    return [
      { title: 'Oura Ring 5 vs 4 vs 3', blurb: 'Comparing Oura generations instead? Every spec, peer-reviewed accuracy, and the real 3-year cost.', url: 'https://www.kygo.app/tools/oura-ring-comparison-tool', meta: 'Wearables · 3 generations', motif: { motif: 'rings', caption: 'Relative thickness', rings: [{ label: 'Gen 3' }, { label: 'Ring 4' }, { label: 'Ring 5' }] } },
      { title: 'Recovery Score Explorer', blurb: 'Compare readiness and recovery scores across 12 wearables, including Oura and RingConn, and see which are validated.', url: 'https://www.kygo.app/tools/recovery-score-explorer', meta: 'Recovery · 12 wearables', motif: { motif: 'ring', caption: 'Readiness score', ringValue: 72, ringNote: 'Validated' } },
      { title: 'Most Accurate Sleep Tracker', blurb: 'Which wearable is most accurate for sleep vs a lab PSG? Compare devices head to head.', url: 'https://www.kygo.app/tools/sleep-tracker-accuracy', meta: 'Wearables · 14 sources', motif: { motif: 'compare', caption: 'Sleep staging vs PSG', rows: [{ label: 'Oura', pct: 90 }, { label: 'Apple', pct: 78 }, { label: 'Fitbit', pct: 64 }, { label: 'Garmin', pct: 36 }] } }
    ];
  }

  _relatedMotif(c) {
    const m = c.motif || 'compare';
    if (m === 'compare') {
      const fills = ['#16A34A', '#22C55E', '#4ADE80', '#86EFAC'];
      const rows = Array.isArray(c.rows) ? c.rows : [];
      const body = rows.map((r, i) => {
        const fill = (i === rows.length - 1 && rows.length > 1) ? '#CBD5E1' : (fills[i] || '#86EFAC');
        const w = Math.max(0, Math.min(100, r.pct));
        return `<div style="display:flex;align-items:center;gap:8px;"><span style="width:48px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:9px;color:#475569;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.label}</span><span style="flex:1;height:9px;border-radius:5px;background:#EEF1F4;overflow:hidden;"><span style="display:block;height:100%;border-radius:5px;background:${fill};width:${w}%;"></span></span></div>`;
      }).join('');
      return `<div style="display:flex;flex-direction:column;gap:8px;padding:2px 0;">${body}</div>`;
    }
    if (m === 'ring') {
      const v = c.ringValue != null ? c.ringValue : 72;
      const off = (238.8 * (1 - v / 100)).toFixed(1);
      return `<div style="display:flex;align-items:center;justify-content:center;gap:14px;padding:2px 0;"><svg viewBox="0 0 96 96" width="80" height="80"><circle cx="48" cy="48" r="38" fill="none" stroke="#E2E8F0" stroke-width="11"/><circle cx="48" cy="48" r="38" fill="none" stroke="#22C55E" stroke-width="11" stroke-linecap="round" stroke-dasharray="238.8" stroke-dashoffset="${off}" transform="rotate(-90 48 48)"/><text x="48" y="46" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="26" fill="#1E293B">${v}</text><text x="48" y="62" text-anchor="middle" font-family="Space Grotesk" font-weight="600" font-size="8" letter-spacing="0.5" fill="#94A3B8">SCORE</text></svg><div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;color:#16A34A;">&#8593; ${c.ringNote || 'Validated'}</div></div>`;
    }
    if (m === 'rings') {
      const r = Array.isArray(c.rings) ? c.rings : [];
      const OE = 27, cy = 44;
      const sw = [10, 12, 8];
      const colors = ['#CBD5E1', '#94A3B8', '#16A34A'];
      const lbl = ['#94A3B8', '#94A3B8', '#16A34A'];
      const cxs = [34, 100, 166];
      const body = r.map((rr, i) => {
        const w = sw[i] != null ? sw[i] : 10;
        const rad = OE - w / 2;
        const cx = cxs[i] != null ? cxs[i] : (200 / r.length) * (i + 0.5);
        return `<circle cx="${cx}" cy="${cy}" r="${rad.toFixed(1)}" fill="none" stroke="${colors[i] || '#16A34A'}" stroke-width="${w}"/><text x="${cx}" y="90" text-anchor="middle" font-family="Space Grotesk" font-weight="${i === r.length - 1 ? 700 : 600}" font-size="9" fill="${lbl[i] || '#94A3B8'}">${rr.label}</text>`;
      }).join('');
      return `<svg viewBox="0 0 200 100" width="100%" style="display:block;">${body}</svg>`;
    }
    return `<svg viewBox="0 0 200 96" width="100%" style="display:block;"><defs><linearGradient id="mtRankOR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#22C55E"/><stop offset="1" stop-color="#16A34A"/></linearGradient></defs><rect x="0" y="4" width="186" height="11" rx="5.5" fill="url(#mtRankOR)"/><rect x="0" y="25" width="150" height="11" rx="5.5" fill="url(#mtRankOR)" opacity="0.85"/><rect x="0" y="46" width="116" height="11" rx="5.5" fill="url(#mtRankOR)" opacity="0.7"/><rect x="0" y="67" width="82" height="11" rx="5.5" fill="url(#mtRankOR)" opacity="0.55"/><rect x="0" y="88" width="54" height="6" rx="3" fill="#CBD5E1"/></svg>`;
  }

  _renderRelatedTools(bg) {
    const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
    const cards = this._relatedTools().map(t => `
      <a class="related-card animate-on-scroll" href="${t.url}" aria-label="${t.title}">
        <div class="rc-media"><div class="rc-panel"><div class="rc-cap">${t.motif.caption || ''}</div>${this._relatedMotif(t.motif)}</div></div>
        <div class="rc-body">
          <div class="rc-title">${t.title}</div>
          <div class="rc-blurb">${t.blurb}</div>
          <div class="rc-foot"><span class="rc-meta">${t.meta || ''}</span><span class="rc-open">Open ${arrow}</span></div>
        </div>
      </a>`).join('');
    return `
      <style>
      .related-grid{display:grid;grid-template-columns:1fr;gap:18px}
      @media(min-width:720px){.related-grid{grid-template-columns:repeat(3,1fr);gap:22px}}
      .related-card{position:relative;display:flex;flex-direction:column;background:var(--bg-canvas,#fff);border:1px solid var(--border-subtle,#E2E8F0);border-radius:18px;overflow:hidden;text-decoration:none;color:inherit;box-shadow:0 2px 12px rgba(15,23,42,.05);transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s ease,border-color .25s ease}
      .related-card::after{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,var(--kygo-green,#22C55E),var(--kygo-green-dark,#16A34A));opacity:0;transition:opacity .25s ease;pointer-events:none}
      .related-card:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(15,23,42,.10);border-color:#CBD5E1}
      .related-card:hover::after{opacity:1}
      .rc-media{position:relative;aspect-ratio:16/10;overflow:hidden;background:var(--bg-raised,#F1F5F9);display:flex;align-items:center;justify-content:center}
      .rc-panel{display:block;background:var(--bg-canvas,#fff);border:1px solid #EAECEF;border-radius:14px;box-shadow:0 6px 18px rgba(15,23,42,.08);padding:13px 15px;width:78%}
      .rc-cap{display:block;font-family:var(--font-display,'Space Grotesk',sans-serif);font-weight:600;font-size:9px;letter-spacing:.6px;text-transform:uppercase;color:var(--fg-3,#94A3B8);margin-bottom:8px}
      .rc-body{padding:16px 18px 18px;display:flex;flex-direction:column;gap:7px}
      .rc-title{font-family:var(--font-display,'Space Grotesk',sans-serif);font-weight:600;font-size:17px;line-height:1.25;letter-spacing:-.01em;color:var(--fg-1,#0F172A)}
      .rc-blurb{font-family:var(--font-body,'DM Sans',sans-serif);font-size:13.5px;line-height:1.55;color:var(--fg-2,#475569);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .rc-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:5px}
      .rc-meta{font-family:var(--font-body,'DM Sans',sans-serif);font-size:12px;font-weight:500;color:var(--fg-3,#94A3B8);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .rc-open{display:inline-flex;align-items:center;gap:4px;flex-shrink:0;font-family:var(--font-body,'DM Sans',sans-serif);font-size:13px;font-weight:600;color:var(--kygo-green-dark,#16A34A)}
      .rc-open svg{width:15px;height:15px}
      </style>
      <section class="section ${bg || 'bg-white'}" id="related">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Keep exploring</div>
            <h2>Related <span class="hl">tools.</span></h2>
            <p class="lede">More free, evidence-based tools to get the most out of your smart ring.</p>
          </div>
          <div class="related-grid">${cards}</div>
        </div>
      </section>`;
  }

  // ── Render ───────────────────────────────────────────────────────────

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const ringconnImg = 'https://static.wixstatic.com/media/273a63_fc0ed00ac88441138f7b4c7e398f7aa8~mv2.png';
    const fitbitImg = 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png';
    const googleHealthImg = 'https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png';
    const appleImg = 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png';
    const garminImg = 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png';
    const healthConnectImg = 'https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" loading="lazy" />
            <span>Kygo Health</span>
          </a>
          <div class="nav-cta-group">
            <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" class="nav-store-btn nav-store-ios cta-primary" data-track-label="subnav-get-app-ios" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on the App Store"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg><span>iOS</span></a>
            <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" class="nav-store-btn nav-store-android cta-android" data-action="android-download" data-track-label="subnav-get-app-android" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on Google Play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg><span>Android</span></a>
          </div>
        </div>
      </header>

      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill"><span class="dot"></span> UPDATED JULY 2026</div>
              <h1>Oura Ring vs RingConn <span class="hl">(2026)</span></h1>
              <p class="hero-lede"><strong>Two smart rings, two philosophies.</strong> Oura pairs its ring with a membership that funds a deep, fast-moving feature set and peer-reviewed validation. RingConn charges <strong>no subscription on any model</strong> and rates longer battery. Compare every spec, feature, and the real multi-year cost, model by model, using official specs only.</p>
            </div>
            <div class="hero-vis" aria-hidden="true">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> 3-year cost</span>
                <span class="hero-vis-tag">~$254 apart</span>
              </div>
              <svg viewBox="0 0 560 210" preserveAspectRatio="xMidYMid meet" role="img" font-family="'Space Grotesk',sans-serif">
                <defs>
                  <linearGradient id="orSlate" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stop-color="#94A3B8"/>
                    <stop offset="1" stop-color="#CBD5E1"/>
                  </linearGradient>
                  <linearGradient id="orGreen" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stop-color="#16A34A"/>
                    <stop offset="1" stop-color="#4ADE80"/>
                  </linearGradient>
                </defs>
                <!-- Oura Ring 5 bar: hardware + membership (first month free) -->
                <text x="20" y="26" fill="#64748B" font-size="16" font-weight="600">Oura Ring 5</text>
                <rect x="20" y="38" width="265" height="42" rx="9" fill="url(#orSlate)"/>
                <rect x="289" y="38" width="135" height="42" rx="9" fill="#0F172A" opacity="0.82"/>
                <text x="152" y="64" fill="#fff" font-size="14" font-weight="600" text-anchor="middle">$399 ring</text>
                <text x="356" y="64" fill="#fff" font-size="13" font-weight="600" text-anchor="middle">+$204 sub</text>
                <text x="548" y="66" fill="#334155" font-size="18" font-weight="700" text-anchor="end">~$603</text>

                <!-- RingConn Gen 3 bar: hardware only -->
                <text x="20" y="112" fill="#16A34A" font-size="16" font-weight="700">RingConn Gen 3</text>
                <rect x="20" y="124" width="231" height="42" rx="9" fill="url(#orGreen)"/>
                <text x="135" y="150" fill="#fff" font-size="14" font-weight="600" text-anchor="middle">$349 ring</text>
                <text x="548" y="152" fill="#16A34A" font-size="18" font-weight="700" text-anchor="end">$349</text>

                <!-- no-subscription badge -->
                <g transform="translate(284,196)">
                  <rect x="-132" y="-14" width="264" height="26" rx="13" fill="#DCFCE7"/>
                  <text x="0" y="4" fill="#16A34A" font-size="12" font-weight="700" letter-spacing="0.4" text-anchor="middle">RINGCONN: $0 SUBSCRIPTION</text>
                </g>
              </svg>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">$0</div><div class="lbl">RingConn subscription, any model</div></div>
            <div class="hero-stat"><div class="num">$603</div><div class="lbl">Oura Ring 5 real 3-yr cost</div></div>
            <div class="hero-stat"><div class="num">14<span class="unit">d</span></div><div class="lbl">RingConn Gen 3 rated battery</div></div>
            <div class="hero-stat"><div class="num">100<span class="unit">+</span></div><div class="lbl">Oura app integrations</div></div>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The quick answer</div>
            <h2>Oura vs RingConn, <span class="hl">in plain English.</span></h2>
            <p class="lede">The full interactive comparison is below. If you just want the verdict, start here.</p>
          </div>
          <div class="tldr animate-on-scroll">${this._renderTLDR()}</div>
        </div>
      </section>

      <!-- Contextual CTA (below the quick answer) -->
      <section class="kearly-section bg-white">
        <div class="section-inner">
          <div class="kband animate-on-scroll">
            <div class="kband-inner">
              <div class="kband-glow"></div>
              <div class="kband-copy">
                <span class="kband-eyebrow"><span class="kband-dot"></span>From guessing to knowing</span>
                <h2 class="kband-headline">Own a smart ring, or shopping for one? Kygo shows what actually moves your sleep, HRV, and recovery.</h2>
              </div>
              <div class="kband-actions">
                <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" class="kband-btn kband-btn-ios" data-track-position="early" data-track-label="oura-ringconn-early-ios" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M17.05 12.5c-.02-2.1 1.71-3.11 1.79-3.16-.98-1.43-2.5-1.62-3.03-1.64-1.29-.13-2.52.76-3.17.76-.65 0-1.66-.74-2.73-.72-1.4.02-2.7.82-3.42 2.07-1.46 2.54-.37 6.3 1.05 8.36.7 1.01 1.53 2.14 2.62 2.1 1.05-.04 1.45-.68 2.72-.68 1.27 0 1.63.68 2.74.66 1.13-.02 1.85-1.03 2.54-2.04.8-1.17 1.13-2.3 1.15-2.36-.03-.01-2.2-.84-2.22-3.35zM15.02 5.9c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.53.62-1 1.61-.88 2.56.93.07 1.88-.47 2.46-1.16z"/></svg> Try Free for 7 Days</a>
                <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" class="kband-btn kband-btn-android" data-action="android-download" data-track-position="early" data-track-label="oura-ringconn-early-android" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="#22C55E" aria-hidden="true"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg> Get Android</a><p class="kband-note">7-day free trial on yearly. Free plan available. Cancel anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The core trade-off</div>
            <h2>Each ring is optimized for <span class="hl">a different thing.</span></h2>
            <p class="lede">The biggest difference is the business model, and it cuts both ways. Here is what each side alone puts on its official pages.</p>
          </div>
          <div class="gaps">
            <div class="gap animate-on-scroll">
              <h4>Only Oura lists</h4>
              <ul>
                <li><span class="num-tag">${this._icon('check')}</span><span><strong>Readiness Score + Cardiovascular Age.</strong> A dedicated recovery score that drives daily goals, plus cardiovascular-age estimation.</span></li>
                <li><span class="num-tag">${this._icon('check')}</span><span><strong>A full metabolic suite.</strong> AI meal logging, Nutrition Levels, Dexcom Stelo CGM integration, and GLP-1 Insights.</span></li>
                <li><span class="num-tag">${this._icon('check')}</span><span><strong>Depth + ecosystem.</strong> Health Panels with EHR import, Cumulative Stress and Resilience, Advisor, Health Radar, Natural Cycles, 100+ integrations, a developer API, and a web dashboard.</span></li>
                <li><span class="num-tag">${this._icon('check')}</span><span><strong>A published validation program.</strong> Peer-reviewed studies and a medical advisory board. All features above need the membership.</span></li>
              </ul>
            </div>
            <div class="gap animate-on-scroll">
              <h4>Only RingConn lists</h4>
              <ul>
                <li><span class="num-tag">${this._icon('check')}</span><span><strong>No subscription, ever.</strong> Every feature is unlocked at purchase, and the charging case ships in the box.</span></li>
                <li><span class="num-tag">${this._icon('check')}</span><span><strong>Sleep apnea + vascular monitoring.</strong> Apnea pattern monitoring (Gen 3 and Gen 2) and nighttime vascular-load trends with optional manual BP context (Gen 3).</span></li>
                <li><span class="num-tag">${this._icon('check')}</span><span><strong>Longer battery + storage.</strong> Up to 14 days rated (Gen 3) and 7 to 10 days of on-ring offline storage.</span></li>
                <li><span class="num-tag">${this._icon('check')}</span><span><strong>Extras Oura skips.</strong> Weekly Lifestyle Score, Monthly Cycle Report, standing hours, encrypted family sharing, Find My Ring, and a free AI assistant (application-only for now).</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Side by side</div>
            <h2>Every spec, <span class="hl">model by model.</span></h2>
            <p class="lede">Five categories across the full current lineup: Oura Ring 5 and Ring 4, and RingConn Gen 3, Gen 2, and Gen 2 Air. Green marks the standout value in each row. Official manufacturer specs only.</p>
          </div>
          <div class="tbl-wrap">
            <div class="tbl-tabs" data-tabs role="tablist" aria-label="Spec categories">${this._renderTabs()}</div>
            <div class="tbl-scroll"><div data-tbl-body>${this._renderTable()}</div></div>
          </div>
        </div>
      </section>

      <kygo-inline-subscribe source="tool-oura-vs-ringconn" variant="comparison"></kygo-inline-subscribe>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Feature by feature</div>
            <h2>What each app <span class="hl">actually tracks.</span></h2>
            <p class="lede">A brand-level look at the software, by category. Oura's column assumes an active membership; without it everything collapses to the three daily scores. A dash means the feature is absent from that brand's official pages, not proof it never exists in-app.</p>
          </div>
          <div class="tbl-wrap">
            <div class="tbl-tabs" data-ftabs role="tablist" aria-label="Feature categories">${this._renderFeatTabs()}</div>
            <div class="tbl-scroll"><div data-feat-body>${this._renderFeatTable()}</div></div>
          </div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="kygo-cta-card animate-on-scroll">
            <div class="cta-pill"><span class="dot"></span> Free Forever Plan</div>
            <h3>Your ring tracks the data. <span>Kygo tells you what moves it.</span></h3>
            <p>Oura or RingConn, Kygo connects to it (RingConn via Apple Health) and cross-checks every sleep, HRV, and recovery reading against what you actually eat and train, so you see which metrics are genuinely predictive for <em>your</em> body, not just a daily score.</p>
            <div class="cta-btn-row">
              <a class="btn btn-primary btn-lg cta-primary" href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" data-track-position="footer-cta" data-track-label="oura-ringconn-footer-ios" target="_blank" rel="noopener">${this._icon('apple')} Download for iOS</a>
              <a class="btn btn-primary btn-lg cta-android" href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" data-action="android-download" data-track-position="footer-cta" data-track-label="oura-ringconn-footer-android" target="_blank" rel="noopener">${this._icon('android')} Download for Android</a>
            </div>
            <p style="position:relative;margin:16px 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.72);text-align:center;">7-day free trial on yearly. Free plan available. Cancel anytime.</p>
            <div class="cta-works">
              <span>Works with</span>
              <div class="cta-badges">
                <img src="${ouraImg}" alt="Oura Ring" title="Oura Ring" loading="lazy" />
                <img src="${appleImg}" alt="Apple Health" title="Apple Health (reads RingConn)" loading="lazy" />
                <img src="${fitbitImg}" alt="Fitbit" title="Fitbit" loading="lazy" />
                <img src="${garminImg}" alt="Garmin" title="Garmin" loading="lazy" />
                <img src="${googleHealthImg}" alt="Google Health" title="Google Health" loading="lazy" />
                <img src="${healthConnectImg}" alt="Health Connect" title="Health Connect" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Cost calculator</div>
            <h2>What you'll <span class="hl">actually spend.</span></h2>
            <p class="lede">Oura's membership ($69.99/yr) is required for almost every insight beyond the three daily scores. RingConn has none. Pick a model on each side, set your horizon, and see the real total.</p>
          </div>
          <div class="calc" data-calc>${this._renderCalc()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Quick winner</div>
            <h2>The <span class="hl">right pick</span> depends on what you value.</h2>
            <p class="lede">Four common buyer profiles, matched to the model that fits.</p>
          </div>
          <div class="bestfor-grid">${this._renderBestFor()}</div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Accuracy honesty</div>
            <h2>Both publish claims. <span class="hl">The evidence differs in kind.</span></h2>
            <p class="lede">Neither ring is a medical device and neither claims FDA clearance. Read the accuracy numbers on each side with the type of evidence behind them in mind.</p>
          </div>
          <div class="valid-grid">
            <div class="valid-card animate-on-scroll">
              <div class="valid-head"><span class="valid-ico"><img src="${ouraImg}" alt="Oura" loading="lazy" /></span><h3>Oura's posture</h3></div>
              <p>Points to multiple peer-reviewed validation studies and a medical advisory board. Positions itself as "research-grade," with a claimed pulse signal up to 100x stronger than wrist devices. Commercial signals like roughly 5M paid members and a 2026 IPO filing are scale, not accuracy evidence.</p>
              <div class="valid-tag">Peer-reviewed studies + advisory board</div>
            </div>
            <div class="valid-card animate-on-scroll">
              <div class="valid-head"><span class="valid-ico"><img src="${ringconnImg}" alt="RingConn" loading="lazy" /></span><h3>RingConn's posture</h3></div>
              <p>Lists strong per-metric numbers on the Gen 3 page (HR over 98%, SpO₂ under 1.9% MAE, sleep time over 99%, steps over 95%) but publishes no methodology on that page. Its strongest external evidence is a Ruijin Hospital feasibility study (IEEE AICAS 2024, 230 volunteers, r=0.93 vs a sleep lab for apnea patterns).</p>
              <div class="valid-tag">Marketing stats + one feasibility study</div>
            </div>
          </div>
          <p class="valid-note">Both columns are the companies' own claims. The 90.7% sleep-apnea figure is a Gen 2 product-page marketing number, cited as such. RingConn's vascular feature explicitly does not measure blood pressure or replace a cuff, and its apnea feature is "not intended to diagnose." Oura's Blood Pressure Signals and breathing features are likewise not FDA-cleared.</p>
        </div>
      </section>

      <!-- Late slim CTA -->
      <section class="kearly-section kearly-section-slim bg-white">
        <div class="section-inner">
          <div class="kband animate-on-scroll">
            <div class="kband-inner">
              <div class="kband-glow"></div>
              <div class="kband-copy">
                <span class="kband-eyebrow"><span class="kband-dot"></span>From guessing to knowing</span>
                <h2 class="kband-headline">See what your food does to your ring's scores.</h2>
              </div>
              <div class="kband-actions">
                <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" class="kband-btn kband-btn-ios" data-track-position="late" data-track-label="oura-ringconn-late-ios" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M17.05 12.5c-.02-2.1 1.71-3.11 1.79-3.16-.98-1.43-2.5-1.62-3.03-1.64-1.29-.13-2.52.76-3.17.76-.65 0-1.66-.74-2.73-.72-1.4.02-2.7.82-3.42 2.07-1.46 2.54-.37 6.3 1.05 8.36.7 1.01 1.53 2.14 2.62 2.1 1.05-.04 1.45-.68 2.72-.68 1.27 0 1.63.68 2.74.66 1.13-.02 1.85-1.03 2.54-2.04.8-1.17 1.13-2.3 1.15-2.36-.03-.01-2.2-.84-2.22-3.35zM15.02 5.9c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.53.62-1 1.61-.88 2.56.93.07 1.88-.47 2.46-1.16z"/></svg> Try Free for 7 Days</a>
                <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" class="kband-btn kband-btn-android" data-action="android-download" data-track-position="late" data-track-label="oura-ringconn-late-android" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="#22C55E" aria-hidden="true"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg> Get Android</a><p class="kband-note">7-day free trial on yearly. Free plan available. Cancel anytime.</p>
              </div>
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

      <section class="section bg-white">
        <div class="section-inner">
          <a class="blog-cta animate-on-scroll" href="https://www.kygo.app/tools/oura-ring-comparison-tool" target="_self" rel="noopener">
            <span class="blog-cta-tag">Oura only</span>
            <div class="blog-cta-body">
              <div class="blog-cta-kicker">Already set on Oura?</div>
              <div class="blog-cta-title">Oura Ring 5 vs 4 vs 3 <span class="yr">· the generation-by-generation tool</span></div>
              <div class="blog-cta-sub">Compare Oura's own lineup on size, sensors, peer-reviewed accuracy, and the real 3-year cost with membership, before you pick which generation to buy.</div>
            </div>
            <span class="blog-cta-arrow">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>

      ${this._renderRelatedTools('bg-light')}

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every claim, <span class="hl">traceable.</span></h2>
            <p class="lede">Every price and spec was pulled from the companies' own pages (product pages, spec sheets, support articles, and press posts). No third-party reviews were used for the figures.</p>
          </div>
          <div class="sources">${this._renderSources()}</div>
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
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Always consult a qualified healthcare provider before making decisions based on wearable data. Neither Oura nor RingConn is a medical device. RingConn's sleep apnea and vascular features are not FDA-cleared and do not diagnose any condition or measure blood pressure; Oura's Blood Pressure Signals and breathing features are likewise not FDA-cleared.</p>
          <p class="footer-copyright">Prices and specs sourced from official Oura and RingConn pages (verified July 2026), with the Ruijin Hospital OSAHS feasibility study (IEEE AICAS 2024) cited for RingConn's apnea research. Sale pricing and promotions can change. Last updated July 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases. Product links on this page are affiliate links; we may earn a commission at no extra cost to you.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  // Static, crawlable comparison summary for the long-tail matchups.
  _renderTLDR() {
    return `
      <p class="tldr-lead"><strong>Oura</strong> sells a deep, membership-funded software platform. <strong>RingConn</strong> sells capable hardware with no subscription. Here is the short version.</p>
      <div class="cmp-blocks">
        <div class="cmp-block">
          <h3>Oura Ring 5 vs RingConn Gen 3</h3>
          <p class="cmp-verdict">Depth vs no-subscription value.</p>
          <p>Ring 5 is smaller with the widest feature set. Gen 3 is $349 flat forever, rates up to 14-day battery, and adds sleep apnea and vascular monitoring.</p>
        </div>
        <div class="cmp-block">
          <h3>The subscription question</h3>
          <p class="cmp-verdict">RingConn on price, Oura on depth.</p>
          <p>Over 3 years Oura Ring 5 runs about $603 vs $349 for RingConn. But the fee funds a real feature cadence, so weigh depth, not just the dollar gap.</p>
        </div>
        <div class="cmp-block cmp-block-wide">
          <h3>Which should you buy?</h3>
          <p class="cmp-verdict">Oura for the ecosystem, RingConn for the value.</p>
          <p>Pick Oura for metabolic tracking (CGM, GLP-1), the biggest integration library, and peer-reviewed validation. Pick RingConn for long battery, apnea and vascular trends, and a one-time price. Both share the same core PPG sensing, so sleep, HRV, and heart-rate tracking are broadly comparable.</p>
        </div>
      </div>
    `;
  }

  _renderBestFor() {
    return this._bestFor.map(b => `
      <div class="bestfor">
        <div class="for-icon">${this._icon(b.icon)}</div>
        <h3>${b.label}</h3>
        <div class="pick"><em>${b.pick}</em></div>
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
      <button data-tab="${c}" role="tab" aria-selected="${c===this._activeTab}" class="${c===this._activeTab?'active':''}">
        ${c}<span class="ct">${this._specs[c].length}</span>
      </button>
    `).join('');
  }

  _renderTable() {
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const ringconnImg = 'https://static.wixstatic.com/media/273a63_fc0ed00ac88441138f7b4c7e398f7aa8~mv2.png';
    const ring5Link = 'https://www.amazon.com/dp/B0GRK1N94H?tag=kygohealthapp-20&th=1';
    const ring4Link = 'https://www.amazon.com/dp/B0D9WT1S2T?tag=kygohealthapp-20&th=1';
    const gen3Link = 'https://www.amazon.com/dp/B0GVSB66ZY?tag=kygohealthapp-20&th=1';
    const gen2Link = 'https://www.amazon.com/s?k=RingConn+Gen+2&tag=kygohealthapp-20';
    const gen2airLink = 'https://www.amazon.com/s?k=RingConn+Gen+2+Air&tag=kygohealthapp-20';
    const cols = [
      { key: 'ring5', img: ouraImg, name: 'Oura Ring 5', link: ring5Link, slug: 'oura-ring-5' },
      { key: 'ring4', img: ouraImg, name: 'Oura Ring 4', link: ring4Link, slug: 'oura-ring-4' },
      { key: 'gen3', img: ringconnImg, name: 'RingConn Gen 3', link: gen3Link, slug: 'ringconn-gen3' },
      { key: 'gen2', img: ringconnImg, name: 'RingConn Gen 2', link: gen2Link, slug: 'ringconn-gen2' },
      { key: 'gen2air', img: ringconnImg, name: 'RingConn Gen 2 Air', link: gen2airLink, slug: 'ringconn-gen2-air' },
    ];
    const rows = this._specs[this._activeTab];
    const storeLink = (url, label) => `<a class="amazon-link" href="${url}" target="_blank" rel="noopener sponsored" data-track-position="ranking" data-track-label="${label}">View on Amazon ${this._icon('arrowRight')}</a>`;
    return `
      <table class="tbl">
        <thead>
          <tr>
            <th scope="col">Spec</th>
            ${cols.map(c => `<th scope="col"><div class="head-prod"><img src="${c.img}" alt="" /> <span>${c.name}</span></div>${storeLink(c.link, c.slug)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td class="spec-name" scope="row" data-label="Spec">
                ${r.name}
                ${r.info ? `<div class="info">${r.info}</div>` : ''}
              </td>
              ${cols.map(c => `<td class="cell" data-label="${c.name}">${r[c.key]}</td>`).join('')}
            </tr>
          `).join('')}
          <tr class="aff-row">
            <td colspan="6">
              <div class="aff-row-inner">
                ${cols.map(c => `<a class="aff-btn" href="${c.link}" target="_blank" rel="noopener sponsored" data-track-position="ranking" data-track-label="${c.slug}"><img src="${c.img}" alt="" /> ${c.name} on Amazon ${this._icon('arrowRight')}</a>`).join('')}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      ${this._activeTab === 'Overview' ? `<p class="tbl-note">Note: Oura also sells a Ring 4 Ceramic ($399, zirconia exterior) not shown here. RingConn Gen 3 pricing showed $349 with an anniversary promo running; regional prices vary. Oura membership is first-month-free for new members.</p>` : ''}
      ${this._activeTab === 'Battery' ? `<p class="tbl-note">Note: All battery figures are manufacturer ratings under each company's own test conditions and vary by size and settings. RingConn's sleep-apnea monitoring increases power draw; Gen 3 rates 10 to 12 days with vibration on.</p>` : ''}
      ${this._activeTab === 'Cost' ? `<p class="tbl-note">Note: Oura totals assume continuous $69.99/yr membership; it is cancelable anytime and you keep the three daily scores. Ring 4 shown at its $349 sale price. Both hardware and membership are HSA/FSA eligible.</p>` : ''}
    `;
  }

  _renderFeatTabs() {
    return Object.keys(this._features).map(c => `
      <button data-ftab="${c}" role="tab" aria-selected="${c===this._featTab}" class="${c===this._featTab?'active':''}">
        ${c}<span class="ct">${this._features[c].length}</span>
      </button>
    `).join('');
  }

  _fcell(cell) {
    const has = cell[0];
    return `<div class="fcell ${has ? 'yes' : 'no'}">${has ? this._icon('check') : this._icon('dash')}<span>${cell[1]}</span></div>`;
  }

  _renderFeatTable() {
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const ringconnImg = 'https://static.wixstatic.com/media/273a63_fc0ed00ac88441138f7b4c7e398f7aa8~mv2.png';
    const rows = this._features[this._featTab];
    return `
      <table class="tbl ftbl">
        <thead>
          <tr>
            <th scope="col">Feature</th>
            <th scope="col"><div class="head-prod"><img src="${ouraImg}" alt="" /> <span>Oura</span></div><span class="head-sub">Membership</span></th>
            <th scope="col"><div class="head-prod"><img src="${ringconnImg}" alt="" /> <span>RingConn</span></div><span class="head-sub head-sub-green">No subscription</span></th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td class="spec-name" scope="row" data-label="Feature">
                ${r.name}
                ${r.info ? `<div class="info">${r.info}</div>` : ''}
              </td>
              <td class="cell fcol" data-label="Oura">${this._fcell(r.o)}</td>
              <td class="cell fcol" data-label="RingConn">${this._fcell(r.r)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  _renderCalc() {
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const ringconnImg = 'https://static.wixstatic.com/media/273a63_fc0ed00ac88441138f7b4c7e398f7aa8~mv2.png';
    const pick = this._ouraPick, rival = this._rival, years = this._years;
    const ouraHardware = pick === 'ring4' ? 349 : 399;
    const membershipYr = 69.99;
    const firstMonthFree = membershipYr / 12; // Oura gives new members their first month free
    const ouraMembership = membershipYr * years - firstMonthFree;
    const ouraTotal = ouraHardware + ouraMembership;
    const pickName = pick === 'ring4' ? 'Ring 4' : 'Ring 5';
    const pickSub = pick === 'ring4' ? '$349 hardware' : '$399 hardware';

    const rivalHardware = rival === 'gen2air' ? 199 : rival === 'gen2' ? 299 : 349;
    const rivalName = rival === 'gen2air' ? 'RingConn Gen 2 Air' : rival === 'gen2' ? 'RingConn Gen 2' : 'RingConn Gen 3';
    const rivalTotal = rivalHardware; // no required subscription

    const fmt = n => '$' + Math.round(n).toLocaleString();
    const gap = ouraTotal - rivalTotal;
    const gapMsg = gap > 0
      ? `Oura costs <strong>${fmt(gap)} more</strong> than ${rivalName} over ${years} ${years === 1 ? 'year' : 'years'}, and about ${fmt(ouraMembership)} of that is membership. You are paying for the deeper feature set, the metabolic suite, and a published validation program; ${rivalName} has no subscription and includes its charging case.`
      : gap < 0
        ? `${rivalName} costs <strong>${fmt(-gap)} more</strong> at this setup.`
        : `Both options total <strong>${fmt(ouraTotal)}</strong> here.`;

    return `
      <div class="calc-controls">
        <div class="calc-block">
          <div class="label"><img src="${ouraImg}" alt="" /><span>Oura model</span></div>
          <div class="seg" data-seg="oura" role="group" aria-label="Oura model">
            <button data-val="ring5" aria-pressed="${pick==='ring5'}" class="${pick==='ring5'?'active':''}">Ring 5 <span class="px">$399</span></button>
            <button data-val="ring4" aria-pressed="${pick==='ring4'}" class="${pick==='ring4'?'active':''}">Ring 4 <span class="px">$349</span></button>
          </div>
        </div>
        <div class="calc-block">
          <div class="label"><img src="${ringconnImg}" alt="" /><span>RingConn model</span></div>
          <div class="seg" data-seg="rival" role="group" aria-label="RingConn model">
            <button data-val="gen3" aria-pressed="${rival==='gen3'}" class="${rival==='gen3'?'active':''}">Gen 3 <span class="px">$349 · no sub</span></button>
            <button data-val="gen2" aria-pressed="${rival==='gen2'}" class="${rival==='gen2'?'active':''}">Gen 2 <span class="px">$299 · no sub</span></button>
            <button data-val="gen2air" aria-pressed="${rival==='gen2air'}" class="${rival==='gen2air'?'active':''}">Gen 2 Air <span class="px">$199 · no sub</span></button>
          </div>
        </div>
        <div class="calc-block">
          <div class="label"><span>Time horizon</span></div>
          <div class="calc-slider">
            <input type="range" min="1" max="5" step="1" value="${years}" data-years aria-label="Years of ownership" />
            <div class="yrs">${years} <span>${years === 1 ? 'year' : 'years'}</span></div>
          </div>
        </div>
        <p class="calc-foot">Oura Membership is $5.99/mo or $69.99/yr (first month free for new members) and is required for trends, HRV detail, the metabolic suite, and most insights. RingConn has no required subscription on any model. Both hardware and Oura membership are HSA/FSA eligible.</p>
      </div>
      <div class="calc-result">
        <h4>${years}-year total cost of ownership</h4>
        <div class="calc-row ${ouraTotal < rivalTotal ? 'win' : ''}">
          <div class="who"><img src="${ouraImg}" alt="" /><div>Oura ${pickName}<span class="sub">${pickSub} + membership</span></div></div>
          <div class="total">${fmt(ouraTotal)}</div>
          <div class="breakdown">${pickSub} + ${years} × $69.99/yr membership (first month free)</div>
        </div>
        <div class="calc-row ${rivalTotal < ouraTotal ? 'win' : ''}">
          <div class="who"><img src="${ringconnImg}" alt="${rivalName}" /><div>${rivalName}<span class="sub">No subscription</span></div></div>
          <div class="total">${fmt(rivalTotal)}</div>
          <div class="breakdown">$${rivalHardware} hardware + $0 subscription</div>
        </div>
        <div class="calc-savings">${gapMsg}</div>
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
        group: 'Oura official',
        links: [
          { t: 'Oura Store', u: 'https://ouraring.com/store' },
          { t: 'Oura Ring 5 product + specs', u: 'https://ouraring.com/store/rings/oura-ring-5/silver' },
          { t: 'Oura Ring 4 product + specs', u: 'https://ouraring.com/store/rings/oura-ring-4/silver' },
          { t: 'Oura Membership', u: 'https://ouraring.com/membership' },
          { t: 'Membership support article', u: 'https://support.ouraring.com/hc/en-us/articles/4409086524819-Oura-Membership' },
          { t: 'Introducing Oura Ring 5 (blog)', u: 'https://ouraring.com/blog/introducing-oura-ring-5/' },
        ],
      },
      {
        group: 'Oura feature pages',
        links: [
          { t: 'Sleep & Rest', u: 'https://ouraring.com/sleep-and-rest' },
          { t: 'Heart Health', u: 'https://ouraring.com/heart-health' },
          { t: 'Activity & Movement', u: 'https://ouraring.com/activity-and-movement' },
          { t: 'Stress', u: 'https://ouraring.com/stress' },
          { t: "Women's Health", u: 'https://ouraring.com/womens-health' },
          { t: 'Metabolic Health', u: 'https://ouraring.com/metabolic-health' },
        ],
      },
      {
        group: 'RingConn official',
        links: [
          { t: 'RingConn Home', u: 'https://ringconn.com/' },
          { t: 'Gen 3 product + specs + FAQ', u: 'https://ringconn.com/products/ringconn-gen-3' },
          { t: 'Gen 3 landing (accuracy + vascular)', u: 'https://ringconn.com/pages/ringconn-gen-3' },
          { t: 'Gen 2 product', u: 'https://ringconn.com/products/ringconn-gen-2' },
          { t: 'Gen 2 Air product', u: 'https://ringconn.com/products/ringconn-gen-2-air' },
          { t: 'Official compare table', u: 'https://ringconn.com/pages/product-compare' },
          { t: 'App features', u: 'https://ringconn.com/pages/app-features' },
          { t: 'Sleep Health', u: 'https://ringconn.com/pages/sleep-health' },
          { t: "Women's Health", u: 'https://ringconn.com/pages/womens-health' },
        ],
      },
      {
        group: 'RingConn research',
        links: [
          { t: 'Ruijin Hospital OSAHS study (IEEE AICAS 2024)', u: 'https://ringconn.com/blogs/newsroom/ringconn-appeared-at-ieee-aicas-2024-in-the-uae-and-announced-its-research-results-osahs-for-the-first-time' },
          { t: 'Sleep apnea detection (blog)', u: 'https://ringconn.com/blogs/news/can-a-smart-ring-detect-sleep-apnea-how-it-works-why-it-matters-4' },
        ],
      },
    ];
  }

  _renderSources() {
    return this._sources.map(s => `
      <div class="source-group">
        <h4>${s.group}</h4>
        <ul>
          ${s.links.map(l => `<li><a href="${l.u}" target="_blank" rel="noopener nofollow" data-track-position="sources" data-track-label="source-${s.group.toLowerCase().replace(/[^a-z0-9]+/g,'-')}">${l.t} ${this._icon('arrowRight')}</a></li>`).join('')}
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

    root.querySelector('[data-ftabs]').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-ftab]');
      if (!btn) return;
      this._featTab = btn.dataset.ftab;
      root.querySelector('[data-ftabs]').innerHTML = this._renderFeatTabs();
      root.querySelector('[data-feat-body]').innerHTML = this._renderFeatTable();
    });

    const calc = root.querySelector('[data-calc]');
    calc.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-val]');
      if (!btn) return;
      const seg = btn.parentElement.dataset.seg;
      if (seg === 'oura') this._ouraPick = btn.dataset.val;
      if (seg === 'rival') this._rival = btn.dataset.val;
      this._updateCalc();
    });
    calc.addEventListener('input', (e) => {
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
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); this._observer.unobserve(e.target); } });
    }, { threshold: 0.01 });
    els.forEach(el => this._observer.observe(el));
  }

  // ── Structured Data ──────────────────────────────────────────────────

  _injectStructuredData() {
    if (!document.querySelector('script[data-kygo-ouraringconn-ld]')) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Oura Ring vs RingConn Comparison Tool (2026)',
        'description': 'Compare Oura (Ring 5, Ring 4) and RingConn (Gen 3, Gen 2, Gen 2 Air) side by side: specs, feature-by-feature software, validation posture, and the real multi-year cost with Oura membership factored in. Official manufacturer specs only.',
        'url': 'https://www.kygo.app/tools/oura-vs-ringconn',
        'applicationCategory': 'HealthApplication',
        'operatingSystem': 'Web',
        'inLanguage': 'en',
        'isAccessibleForFree': true,
        'datePublished': '2026-07-22',
        'dateModified': '2026-07-22',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
        'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        'featureList': 'Model-by-model spec comparison across five Oura and RingConn models, feature-by-feature software matrix, interactive multi-year cost calculator with subscription math, accuracy and validation honesty breakdown, mobile-first responsive design',
        'keywords': 'oura ring vs ringconn, ringconn vs oura, oura vs ringconn gen 3, ringconn gen 3 vs oura ring 5, smart ring comparison 2026, ringconn no subscription, oura membership cost, best smart ring, ringconn gen 2 vs oura, oura ring alternative'
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-ouraringconn-ld', '');
      s.textContent = JSON.stringify(ld);
      document.head.appendChild(s);
    }

    if (!document.querySelector('script[data-kygo-ouraringconn-faq]')) {
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
      s.setAttribute('data-kygo-ouraringconn-faq', '');
      s.textContent = JSON.stringify(faq);
      document.head.appendChild(s);
    }

    if (!document.querySelector('script[data-kygo-ouraringconn-bc]')) {
      const bc = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.kygo.app' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
          { '@type': 'ListItem', 'position': 3, 'name': 'Oura Ring vs RingConn', 'item': 'https://www.kygo.app/tools/oura-vs-ringconn' }
        ]
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-ouraringconn-bc', '');
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
      .animate-on-scroll.visible { opacity: 1; transform: none; }
      @media (prefers-reduced-motion: reduce) { .animate-on-scroll { opacity: 1; transform: none; transition: none; } }

      /* Nav */
      .nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.92); backdrop-filter: saturate(160%) blur(14px); -webkit-backdrop-filter: saturate(160%) blur(14px); border-bottom: 1px solid var(--border-subtle); }
      .nav-inner { max-width: 1200px; margin: 0 auto; padding: 14px 20px; display: flex; align-items: center; gap: 16px; }
      .nav-brand { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 700; font-size: 14px; letter-spacing: -0.01em; color: var(--fg-1); text-transform: uppercase; }
      .nav-brand img { width: 26px; height: 26px; }
      .nav-cta-group { margin-left:auto; display:inline-flex; align-items:center; gap:8px; }
      .nav-cta-group .nav-store-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border-radius:8px; font-weight:600; font-size:13px; text-decoration:none; white-space:nowrap; line-height:1; }
      .nav-cta-group .nav-store-btn svg { width:15px; height:15px; flex-shrink:0; }
      .nav-cta-group .nav-store-ios { background:var(--kygo-green); color:#fff; }
      .nav-cta-group .nav-store-ios:hover { background:var(--kygo-green-dark); color:#fff; }
      .nav-cta-group .nav-store-android { background:#fff; color:var(--kygo-green-dark); border:1.5px solid var(--border-subtle); }
      .nav-cta-group .nav-store-android:hover { border-color:var(--kygo-green); color:var(--kygo-green-dark); }
      @media (max-width:360px){ .nav-cta-group .nav-store-btn span { display:none; } .nav-cta-group .nav-store-btn { padding:8px 10px; } }
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
      .hero-vis-head { position: relative; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; }
      .hero-vis-title { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: var(--fg-3); white-space: nowrap; }
      .hero-vis-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 0 3px rgba(34,197,94,0.18); flex: none; }
      .hero-vis-tag { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.3px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
      .hero-vis svg { position: relative; width: 100%; flex: 1; min-height: 0; display: block; }
      @media (max-width: 880px) { .hero-vis { width: 100%; max-width: 460px; margin: 4px auto 0; padding: 14px 16px; } }
      .hero-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; border-top: 1px solid var(--border-subtle); padding-top: 24px; }
      @media (min-width: 720px) { .hero-stats { grid-template-columns: repeat(4, 1fr); gap: 24px; padding-top: 28px; } }
      .hero-stat .num { font-family: var(--font-display); font-weight: 700; font-size: clamp(30px, 4.2vw, 44px); line-height: 1; color: var(--kygo-green); letter-spacing: -0.02em; display: inline-flex; align-items: baseline; gap: 2px; }
      .hero-stat .num .unit { color: var(--kygo-green); font-size: 0.55em; font-weight: 600; }
      .hero-stat .lbl { margin-top: 10px; color: var(--fg-3); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; line-height: 1.4; }

      /* Sections */
      .section { padding: 56px 20px; }
      @media (min-width: 720px) { .section { padding: 80px 24px; } }
      .section-inner { max-width: 1200px; margin: 0 auto; }
      .section.bg-white { background: #fff; }
      .section.bg-light { background: var(--kygo-light); }
      .section-head { margin-bottom: 28px; max-width: 760px; }
      .kicker { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 6px 12px; border-radius: 999px; }
      .section h2 { font-family: var(--font-display); font-weight: 600; font-size: clamp(26px, 4vw, 42px); line-height: 1.1; margin: 16px 0 10px; letter-spacing: -0.01em; }
      .section h2 .hl { color: var(--kygo-green); }
      .lede { color: var(--fg-2); font-size: 16px; line-height: 1.55; max-width: 66ch; margin: 0; }

      /* Quick-answer summary (crawlable prose) */
      .tldr { margin-bottom: 8px; }
      .tldr-lead { font-size: clamp(15px, 1.7vw, 17px); line-height: 1.6; color: var(--fg-2); max-width: 78ch; margin: 0 0 22px; }
      .tldr-lead strong { color: var(--fg-1); font-weight: 600; }
      .cmp-blocks { display: grid; grid-template-columns: 1fr; gap: 16px; }
      @media (min-width: 760px) { .cmp-blocks { grid-template-columns: 1fr 1fr; } }
      .cmp-block { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 24px; box-shadow: var(--shadow-md); }
      .cmp-block.cmp-block-wide { grid-column: 1 / -1; }
      .cmp-block h3 { font-family: var(--font-display); font-weight: 600; font-size: clamp(17px, 2vw, 20px); line-height: 1.2; margin: 0 0 6px; color: var(--fg-1); }
      .cmp-verdict { font-family: var(--font-display); font-weight: 600; font-size: 14px; line-height: 1.4; color: var(--kygo-green-dark); margin: 0 0 12px; }
      .cmp-block p { font-size: 14.5px; line-height: 1.65; color: var(--fg-2); margin: 0; }
      .cmp-block p strong { color: var(--fg-1); font-weight: 600; }

      /* Verdict gaps / trade-off cards */
      .gaps { display: grid; grid-template-columns: 1fr; gap: 16px; }
      @media (min-width: 720px) { .gaps { grid-template-columns: 1fr 1fr; } }
      .gap { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 24px; box-shadow: var(--shadow-md); }
      .gap h4 { font-family: var(--font-display); font-weight: 600; font-size: 12px; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 16px; }
      .gap ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
      .gap li { display: grid; grid-template-columns: 28px 1fr; gap: 12px; font-size: 14px; line-height: 1.55; color: var(--fg-2); }
      .gap li .num-tag { color: var(--kygo-green-dark); background: var(--kygo-green-light); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
      .gap li .num-tag .ico { width: 15px; height: 15px; }
      .gap li strong { color: var(--fg-1); font-weight: 600; }

      /* Best-for */
      .bestfor-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
      @media (min-width: 560px) { .bestfor-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (min-width: 1000px) { .bestfor-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; } }
      .bestfor { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 22px; display: flex; flex-direction: column; gap: 14px; box-shadow: var(--shadow-md); transition: all .25s var(--ease-out); }
      .bestfor:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); transform: translateY(-3px); }
      .bestfor .for-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--kygo-green-light); color: var(--kygo-green-dark); display: flex; align-items: center; justify-content: center; font-size: 20px; }
      .bestfor .for-icon .ico { width: 22px; height: 22px; }
      .bestfor h3 { font-family: var(--font-display); font-weight: 600; font-size: 14px; margin: 0; color: var(--fg-2); line-height: 1.35; }
      .bestfor .pick { font-family: var(--font-display); font-weight: 600; font-size: 22px; line-height: 1.15; color: var(--fg-1); margin: -4px 0 0; }
      .bestfor .pick em { color: var(--kygo-green-dark); font-style: normal; }
      .bestfor .reason { font-size: 13.5px; color: var(--fg-2); line-height: 1.55; margin: 0; }
      .bestfor .footer-row { display: flex; align-items: center; gap: 10px; margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border-subtle); }
      .bestfor .price { font-family: var(--font-display); font-weight: 700; font-size: 15px; color: var(--fg-1); }
      .bestfor .yrly { color: var(--fg-3); font-size: 12px; }

      /* Spec + feature tables */
      .tbl-wrap { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-md); }
      .tbl-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .tbl-note { color: var(--fg-3); font-size: 12.5px; line-height: 1.55; margin: 0; padding: 14px 18px 16px; border-top: 1px solid var(--border-subtle); background: var(--bg-surface); }
      .tbl-tabs { display: flex; gap: 4px; padding: 12px; border-bottom: 1px solid var(--border-subtle); overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .tbl-tabs button { font-family: var(--font-body); font-size: 13px; font-weight: 600; padding: 9px 14px; border-radius: 10px; border: 0; background: transparent; color: var(--fg-2); cursor: pointer; white-space: nowrap; transition: all .15s ease; display: inline-flex; align-items: center; gap: 8px; }
      .tbl-tabs button:hover { background: var(--bg-raised); color: var(--fg-1); }
      .tbl-tabs button.active { background: var(--kygo-dark); color: #fff; }
      .tbl-tabs button .ct { font-size: 11px; padding: 2px 7px; border-radius: 999px; background: rgba(0,0,0,0.06); }
      .tbl-tabs button.active .ct { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.85); }
      .tbl { width: 100%; border-collapse: collapse; font-family: var(--font-body); min-width: 860px; }
      .tbl.ftbl { min-width: 560px; }
      /* Sticky first column so the spec/feature label stays pinned while columns scroll */
      .tbl th:first-child, .tbl td:first-child { position: sticky; left: 0; z-index: 2; box-shadow: 1px 0 0 var(--border-subtle); }
      .tbl thead th:first-child { z-index: 3; background: var(--bg-raised); }
      .tbl tbody td:first-child { background: #fff; }
      .tbl tbody tr:hover td:first-child { background: var(--bg-raised); }
      .tbl thead th { text-align: left; padding: 16px 18px; font-family: var(--font-display); font-weight: 600; font-size: 13px; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.4px; background: var(--bg-raised); vertical-align: top; }
      .tbl thead th .head-prod { display: flex; align-items: center; gap: 10px; color: var(--fg-1); text-transform: none; letter-spacing: 0; font-size: 14px; }
      .tbl thead th .head-prod img { width: 22px; height: 22px; border-radius: 5px; background: #fff; padding: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); object-fit: contain; }
      .tbl thead th .head-sub { display: block; margin-top: 5px; font-family: var(--font-body); font-size: 11px; font-weight: 500; color: var(--fg-3); text-transform: none; letter-spacing: 0; }
      .tbl thead th .head-sub-green { color: var(--kygo-green-dark); font-weight: 600; }
      .tbl thead th .amazon-link { display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; font-family: var(--font-body); font-size: 11px; font-weight: 600; color: var(--kygo-green-dark); text-transform: none; letter-spacing: 0; text-decoration: none; transition: color .15s; }
      .tbl thead th .amazon-link:hover { color: var(--kygo-green); }
      .tbl thead th .amazon-link .ico { width: 12px; height: 12px; transition: transform .15s; }
      .tbl thead th .amazon-link:hover .ico { transform: translateX(2px); }
      .tbl tbody td { padding: 14px 18px; border-top: 1px solid var(--border-subtle); vertical-align: top; font-size: 14px; line-height: 1.5; }
      .tbl tbody tr:hover { background: var(--bg-raised); }
      .tbl .spec-name { font-weight: 600; color: var(--fg-1); width: 26%; }
      .tbl.ftbl .spec-name { width: 44%; }
      .tbl .spec-name .info { font-size: 12px; font-weight: 400; color: var(--fg-3); margin-top: 2px; line-height: 1.4; }
      .tbl .y { color: var(--kygo-green-dark); font-weight: 600; }
      .tbl .n { color: var(--fg-2); }
      .tbl .num { font-family: var(--font-numeric); font-weight: 600; font-size: 15px; color: var(--fg-1); }
      .tbl .num.y { color: var(--kygo-green-dark); }
      .fcell { display: flex; align-items: flex-start; gap: 8px; }
      .fcell .ico { flex: none; width: 18px; height: 18px; border-radius: 5px; display: inline-flex; align-items: center; justify-content: center; margin-top: 1px; }
      .fcell .ico svg { width: 12px; height: 12px; }
      .fcell.yes .ico { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .fcell.no .ico { background: var(--bg-raised); color: var(--fg-3); }
      .fcell.yes span { color: var(--fg-1); }
      .fcell.no span { color: var(--fg-3); }
      .aff-row { display: none; }
      .aff-row-inner { display: flex; flex-direction: column; gap: 8px; }
      .aff-btn { display: inline-flex; align-items: center; gap: 8px; justify-content: center; padding: 11px 14px; border-radius: 10px; border: 1.5px solid var(--kygo-green-light); background: rgba(34,197,94,0.06); color: var(--kygo-green-dark); font-family: var(--font-body); font-weight: 600; font-size: 13px; transition: all .15s ease; }
      .aff-btn:hover { border-color: var(--kygo-green); background: rgba(34,197,94,0.1); }
      .aff-btn img { width: 18px; height: 18px; border-radius: 4px; background: #fff; padding: 2px; object-fit: contain; }
      .aff-btn .ico { width: 13px; height: 13px; }
      @media (max-width: 720px) {
        .tbl thead th, .tbl tbody td { padding: 12px 14px; font-size: 13px; }
        .tbl .spec-name { width: 34%; }
      }

      /* Cost calculator */
      .calc { display: grid; grid-template-columns: 1fr; gap: 18px; align-items: stretch; }
      @media (min-width: 880px) { .calc { grid-template-columns: 1.1fr 1fr; gap: 24px; } }
      .calc-controls { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; padding: 22px; display: flex; flex-direction: column; gap: 20px; box-shadow: var(--shadow-md); }
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

      /* Validation cards */
      .valid-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
      @media (min-width: 720px) { .valid-grid { grid-template-columns: 1fr 1fr; align-items: start; } }
      .valid-card { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 24px; box-shadow: var(--shadow-md); }
      .valid-head { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
      .valid-ico { width: 44px; height: 44px; border-radius: 11px; background: #fff; border: 1.5px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; flex: none; box-shadow: 0 1px 3px rgba(15,23,42,0.06); }
      .valid-ico img { width: 28px; height: 28px; object-fit: contain; }
      .valid-head h3 { font-family: var(--font-display); font-weight: 600; font-size: 19px; margin: 0; color: var(--fg-1); }
      .valid-card p { font-size: 14px; line-height: 1.6; color: var(--fg-2); margin: 0 0 14px; }
      .valid-tag { display: inline-block; font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 6px 12px; border-radius: 999px; }
      .valid-note { margin: 20px 0 0; font-size: 13px; line-height: 1.6; color: var(--fg-3); max-width: 90ch; }

      /* Kygo CTA */
      .kygo-cta-card { background: var(--kygo-dark); border-radius: 20px; padding: 40px 24px; position: relative; overflow: hidden; color: #fff; text-align: center; display: flex; flex-direction: column; align-items: center; }
      @media (min-width: 720px) { .kygo-cta-card { padding: 56px 40px; border-radius: 24px; } }
      .kygo-cta-card::before { content: ''; position: absolute; top: -160px; right: -160px; width: 520px; height: 520px; background: radial-gradient(closest-side, rgba(34,197,94,0.30), transparent); pointer-events: none; }
      .kygo-cta-card::after { content: ''; position: absolute; bottom: -180px; left: -180px; width: 480px; height: 480px; background: radial-gradient(closest-side, rgba(34,197,94,0.12), transparent); pointer-events: none; }
      .kygo-cta-card .cta-pill { position: relative; display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.16); color: #6EE7A0; padding: 6px 14px; border-radius: 999px; font-family: var(--font-display); font-size: 12px; font-weight: 600; border: 1px solid rgba(34,197,94,0.25); }
      .kygo-cta-card .cta-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 8px var(--kygo-green); }
      .kygo-cta-card h3 { position: relative; font-family: var(--font-display); font-weight: 600; color: #fff; font-size: clamp(26px, 4.5vw, 42px); line-height: 1.05; letter-spacing: -0.01em; margin: 18px 0 14px; max-width: 22ch; }
      .kygo-cta-card h3 span { color: var(--kygo-green); }
      .kygo-cta-card p { position: relative; color: rgba(255,255,255,0.72); font-size: clamp(14px, 1.6vw, 16px); line-height: 1.6; max-width: 58ch; margin: 0 auto 24px; }
      .kygo-cta-card p em { font-style: italic; color: #fff; }
      .kygo-cta-card .cta-btn-row { position: relative; display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; width: 100%; }
      @media (max-width: 560px) { .kygo-cta-card .cta-btn-row .btn-lg { width: 100%; justify-content: center; } }
      .kygo-cta-card .cta-works { position: relative; margin-top: 26px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: rgba(255,255,255,0.6); font-size: 13px; }
      .kygo-cta-card .cta-badges { display: grid; grid-template-columns: repeat(3, auto); gap: 10px; align-items: center; justify-content: center; }
      .kygo-cta-card .cta-badges img { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); padding: 4px; object-fit: contain; }

      /* Sources */
      .sources { display: grid; grid-template-columns: 1fr; gap: 16px; }
      @media (min-width: 560px) { .sources { grid-template-columns: repeat(2, 1fr); } }
      @media (min-width: 1000px) { .sources { grid-template-columns: repeat(4, 1fr); } }
      .source-group { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 22px; box-shadow: var(--shadow-md); }
      .source-group h4 { font-family: var(--font-display); font-weight: 600; font-size: 12px; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 14px; }
      .source-group ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
      .source-group li { font-size: 13px; line-height: 1.45; }
      .source-group a { display: inline-flex; align-items: flex-start; gap: 5px; color: var(--fg-2); transition: color .15s; }
      .source-group a:hover { color: var(--kygo-green-dark); }
      .source-group a .ico { width: 12px; height: 12px; color: var(--kygo-green-dark); flex: none; margin-top: 3px; transition: transform .15s; }
      .source-group a:hover .ico { transform: translateX(2px); }

      /* FAQ */
      .faq { display: flex; flex-direction: column; gap: 10px; }
      .faq details { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; padding: 4px 20px; box-shadow: var(--shadow-md); transition: border-color .2s, box-shadow .2s; }
      .faq details[open] { border-color: var(--kygo-green); }
      .faq summary { list-style: none; padding: 16px 0; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 14px; }
      .faq summary::-webkit-details-marker { display: none; }
      .faq summary::after { content: '+'; color: var(--kygo-green-dark); font-weight: 600; font-size: 22px; transition: transform .2s; line-height: 1; }
      .faq details[open] summary::after { content: '\\2212'; }
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

      /* Footer */
      .tool-footer { padding: 56px 20px 40px; background: var(--kygo-light); color: var(--fg-2); border-top: 1px solid var(--border-subtle); }
      .tool-footer .container { max-width: 720px; margin: 0 auto; text-align: center; }
      .footer-brand { display: inline-flex; align-items: center; gap: 10px; color: var(--fg-1); font-family: var(--font-display); font-weight: 700; font-size: 17px; }
      .footer-logo { width: 28px; height: 28px; }
      .footer-tagline { color: var(--fg-3); font-size: 14px; margin: 10px 0 22px; }
      .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 18px; margin-bottom: 28px; font-size: 14px; }
      .footer-links a { color: var(--fg-2); }
      .footer-links a:hover { color: var(--kygo-green-dark); }
      .footer-disclaimer { font-size: 12px; color: var(--fg-3); line-height: 1.6; max-width: 640px; margin: 0 auto 14px; }
      .footer-copyright { font-size: 12px; color: var(--fg-3); margin: 4px 0; }
      .footer-affiliate { font-style: italic; }

      /* Early / late app-download CTA cards */
      .kearly-section { padding: 48px 20px; }
      .kearly-section.bg-white { background: #fff; }
      .kearly-section.bg-light { background: var(--kygo-light); }
      .kearly-section .section-inner { max-width: 1200px; margin: 0 auto; }
      .kearly-section-slim { padding: 48px 20px; }
      .kband { max-width: 1100px; margin: 0 auto; }
      .kband-inner { position: relative; overflow: hidden; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; padding: 28px 36px; display: flex; align-items: center; gap: 36px; box-shadow: var(--shadow-md); }
      .kband-glow { position: absolute; top: -120px; right: -80px; width: 360px; height: 360px; background: radial-gradient(circle, rgba(34,197,94,0.14), transparent 65%); pointer-events: none; }
      .kband-copy { position: relative; display: flex; flex-direction: column; gap: 10px; flex: 1 1 auto; min-width: 0; }
      .kband-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 12px; letter-spacing: 0.7px; text-transform: uppercase; color: #16A34A; }
      .kband-dot { width: 7px; height: 7px; border-radius: 50%; background: #22C55E; animation: kygoPulse 2s ease-out infinite; }
      .kband-headline { margin: 0; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 24px; line-height: 1.3; color: #1E293B; }
      .kband-actions { position: relative; display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 12px; flex: 0 0 auto; max-width: 470px; }
      .kband-note { flex-basis: 100%; width: 100%; margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: #475569; text-align: center; }
      .kband-btn { display: inline-flex; align-items: center; gap: 9px; text-decoration: none; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; padding: 15px 24px; border-radius: 12px; white-space: nowrap; transition: transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease; }
      .kband-btn svg { width: 17px; height: 17px; flex-shrink: 0; }
      .kband-btn-ios { background: #22C55E; color: #fff; box-shadow: 0 6px 16px rgba(34,197,94,0.28); }
      .kband-btn-ios:hover { background: #16A34A; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(34,197,94,0.3); }
      .kband-btn-android { background: #fff; color: #16A34A; border: 2px solid #E2E8F0; }
      .kband-btn-android:hover { border-color: #22C55E; transform: translateY(-2px); }
      @keyframes kygoPulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.55); } 70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }
      @media (max-width: 720px) {
        .kband-inner { flex-direction: column; align-items: flex-start; gap: 22px; padding: 28px 24px; }
        .kband-actions { width: 100%; flex-direction: column; }
        .kband-btn { width: 100%; justify-content: center; }
      }
      @media (prefers-reduced-motion: reduce) { .kband-dot { animation: none; } }
    `;
  }
}

if (!customElements.get('kygo-oura-vs-ringconn')) {
  customElements.define('kygo-oura-vs-ringconn', KygoOuraVsRingConn);
}
