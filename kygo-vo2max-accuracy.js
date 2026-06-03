/**
 * Kygo Health — Wearable VO2 Max Accuracy Comparison Tool
 * Tag name: kygo-vo2max-accuracy
 * Side-by-side accuracy breakdown of how 9 consumer wearables ESTIMATE VO2 max
 * (vs lab CPET): method, what it needs, vendor claim vs independent validation,
 * the signals each device feeds in, and how good those signals are.
 * Data: vo2research.md (sources #36–48), reconciled with files #06/#07.
 */

/** Injects accessible text into light DOM so crawlers and AI tools can read component content */
if (typeof __seo === 'undefined') {
  var __seo = function (el, text) {
    if (el.querySelector('[data-seo]')) return;
    const d = document.createElement('div');
    d.setAttribute('data-seo', '');
    d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
    d.textContent = text;
    el.appendChild(d);
  };
}

class KygoVo2maxAccuracy extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._eventsBound = false;
    this._expandedSource = null;
    this._filters = { type: new Set(), sub: new Set(), val: new Set(), run: new Set() };
  }

  connectedCallback() {
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, this._seoText());
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Device data (the "Wearable VO2 Max Comparison" + accuracy tables) ───

  get _devices() {
    return [
      {
        key: 'garmin', name: 'Garmin (Firstbeat)', short: 'Garmin', color: '#f59e0b',
        type: 'watch', typeLabel: 'Watch',
        method: 'exercise', methodLabel: 'Exercise — HR-to-pace run',
        needs: 'Outdoor run + HR (chest strap best)', needsRun: true,
        vendorClaim: 'Firstbeat: ~95% accuracy / MAPE ~5%, most errors <3.5 mL/kg/min (n=2,690 runs)',
        validation: 'validated',
        independent: 'Strongest independent evidence. Fēnix 6 MAPE 7.05%, CCC 0.73 (Carrier 2025); Forerunner 245 overall MAPE 6.7% but underestimates ~9–10% in highly trained (Engel 2025).',
        bestFor: 'Recreational & general users',
        weakestFor: 'Highly trained (underestimates ~9–10%)',
        subscription: false, subLabel: 'Free',
        affiliateUrl: 'https://amzn.to/4aF8l5D',
        hrSource: 'Wrist optical or paired chest strap',
        gps: true, hrv: false, restingHr: false, profile: true, maxHr: true
      },
      {
        key: 'apple', name: 'Apple Watch', short: 'Apple', color: '#64748b',
        type: 'watch', typeLabel: 'Watch',
        method: 'exercise', methodLabel: 'Exercise — outdoor walk/run/hike',
        needs: 'GPS + ~30% HR rise', needsRun: true,
        vendorClaim: 'No published numeric figure (developed via the Apple Heart & Movement Study)',
        validation: 'validated',
        independent: 'Two independent studies, both show underestimation: MAPE 13.3%, −6.07 mL/kg/min (Lambe 2025); MAPE 15.8%, predicted ~41 vs measured ~46 (Caserman 2024, Series 7).',
        bestFor: 'Everyday users',
        weakestFor: 'Underestimates, especially fitter people',
        subscription: false, subLabel: 'Free',
        affiliateUrl: 'https://amzn.to/4rUcGst',
        hrSource: 'Wrist optical', gps: true, hrv: false, restingHr: false, profile: true, maxHr: true
      },
      {
        key: 'polar', name: 'Polar', short: 'Polar', color: '#ef4444',
        type: 'watch', typeLabel: 'Watch',
        method: 'resting', methodLabel: 'Resting Fitness Test (HR + HRV); exercise on run models',
        needs: 'Nothing for the resting test; a run for exercise mode', needsRun: false,
        vendorClaim: 'Marketed as a validated non-exercise estimate (developer-reported high correlation)',
        validation: 'validated',
        independent: 'Resting methods overestimate ~+2.2 mL/kg/min with wide limits of agreement (INTERLIVE 2022); CPET study MAPE 13.7%, ICC 0.74, bias −1.0 (Neudorfer 2025).',
        bestFor: 'A quick estimate with no run',
        weakestFor: 'Wide individual error',
        subscription: false, subLabel: 'Free',
        affiliateUrl: 'https://amzn.to/4rqpdnL',
        hrSource: 'Wrist optical / chest, at rest', gps: false, hrv: true, restingHr: true, profile: true, maxHr: true
      },
      {
        key: 'fitbit', name: 'Fitbit / Google', short: 'Fitbit', color: '#10b981',
        type: 'watch', typeLabel: 'Watch / band',
        method: 'resting', methodLabel: 'Resting HR + profile (Cardio Fitness Score)',
        needs: 'Nothing (a GPS run refines it)', needsRun: false,
        vendorClaim: 'Proprietary; no public numeric accuracy figure',
        validation: 'validated',
        independent: 'Overestimates absolute VO2 max: 52.5 vs 49.9 mL/kg/min, p=0.03 (Freeberg 2019). The score is consistent/unbiased as a trend but reads high vs lab.',
        bestFor: 'Casual trend tracking',
        weakestFor: 'Overestimates the absolute number',
        subscription: false, subLabel: 'Free metric (Premium = coaching only)',
        affiliateUrl: 'https://amzn.to/3ZPkHDc',
        hrSource: 'Wrist optical', gps: 'opt', hrv: false, restingHr: true, profile: true, maxHr: true
      },
      {
        key: 'samsung', name: 'Samsung Galaxy Watch', short: 'Samsung', color: '#3b82f6',
        type: 'watch', typeLabel: 'Watch',
        method: 'exercise', methodLabel: 'Exercise — outdoor run',
        needs: 'Outdoor run + GPS', needsRun: true,
        vendorClaim: '~82% correlation vs clinical equipment (company-funded University of Michigan testing)',
        validation: 'none',
        independent: 'No independent VO2 max validation found. Independent work validates only heart rate during a maximal CPET (Inoue 2026, Galaxy Watch 6), not VO2 max.',
        bestFor: 'Samsung-ecosystem trend',
        weakestFor: 'Unverified for VO2 max; likely underestimates in trained users',
        subscription: false, subLabel: 'Free',
        affiliateUrl: 'https://amzn.to/3PUMS23',
        hrSource: 'Wrist optical', gps: true, hrv: false, restingHr: false, profile: true, maxHr: true
      },
      {
        key: 'whoop', name: 'WHOOP', short: 'WHOOP', color: '#0f172a',
        type: 'strap', typeLabel: 'Strap (no screen)',
        method: 'hybrid', methodLabel: 'Proprietary — passive / GPS / calibrated (3-tier)',
        needs: 'A GPS run for the calibrated estimate', needsRun: true,
        vendorClaim: 'Internal: MAE 3.7 mL/kg/min, MAPE 8.0%, r 0.90 vs metabolic cart (n=248)',
        validation: 'none',
        independent: 'No independent peer-reviewed VO2 max validation found. Field reports suggest MAE ~5–8 mL/kg/min and under-prediction in trained runners (>55).',
        bestFor: '24/7-wear trend',
        weakestFor: 'No independent validation; under-predicts trained',
        subscription: true, subLabel: 'Membership required (WHOOP One ~$199/yr+)',
        affiliateUrl: 'https://amzn.to/4rRoziQ',
        hrSource: 'Wrist/arm optical (PPG)', gps: true, hrv: 'part', restingHr: true, profile: true, maxHr: true
      },
      {
        key: 'oura', name: 'Oura Ring', short: 'Oura', color: '#C4A97D',
        type: 'ring', typeLabel: 'Ring',
        method: 'hybrid', methodLabel: 'Guided in-app 6-minute walk test (Cardio Capacity)',
        needs: 'Take the in-app walk test', needsRun: false,
        vendorClaim: 'States it is less accurate than a lab test, weak for athletes/altitude (built with KULTU/UCLA)',
        validation: 'none',
        independent: 'No independent peer-reviewed VO2 max validation located. Oura’s independent validations cover sleep/HR/energy, not VO2 max.',
        bestFor: 'Ring users wanting an estimate',
        weakestFor: 'No validation; weak for athletes/altitude',
        subscription: true, subLabel: 'Membership ($5.99/mo or $69.99/yr)',
        affiliateUrl: 'https://amzn.to/4aF93jj',
        hrSource: 'Ring PPG, during the walk test', gps: false, hrv: false, restingHr: false, profile: true, maxHr: true
      },
      {
        key: 'coros', name: 'Coros', short: 'Coros', color: '#f97316',
        type: 'watch', typeLabel: 'Watch',
        method: 'exercise', methodLabel: 'Exercise — HR-to-pace (algorithm unpublished)',
        needs: 'Outdoor run + HR', needsRun: true,
        vendorClaim: 'Claims results are "very close to lab" (no figures published)',
        validation: 'none',
        independent: 'No independent peer-reviewed VO2 max validation located.',
        bestFor: 'Coros runners’ trend',
        weakestFor: 'No validation',
        subscription: false, subLabel: 'Free',
        affiliateUrl: 'https://amzn.to/4rkOv6I',
        hrSource: 'Wrist optical or paired chest strap', gps: true, hrv: false, restingHr: false, profile: true, maxHr: true
      },
      {
        key: 'suunto', name: 'Suunto', short: 'Suunto', color: '#1e3a8a',
        type: 'watch', typeLabel: 'Watch',
        method: 'exercise', methodLabel: 'Exercise — Firstbeat engine (current models)',
        needs: 'Outdoor run + HR', needsRun: true,
        vendorClaim: 'Inherits Firstbeat’s ~95% claim',
        validation: 'indirect',
        independent: 'Covered indirectly by Firstbeat/Garmin validations (same engine); no Suunto-specific study located.',
        bestFor: 'Like Garmin (shared engine)',
        weakestFor: 'No brand-specific study',
        subscription: false, subLabel: 'Free',
        affiliateUrl: null,
        hrSource: 'Wrist optical or paired chest strap', gps: true, hrv: false, restingHr: false, profile: true, maxHr: true
      }
    ];
  }

  // ── Table B — how good each INPUT signal is (independent evidence) ───────

  get _inputSignals() {
    return [
      { signal: 'Chest-strap HR (Polar H10)', quality: 'good', qLabel: 'ECG-grade',
        finding: 'Effectively ECG-grade at rest and during exercise (RR/HR agreement >99%).',
        source: 'Gilgen-Ammann 2019; #06 (r=0.99 vs ECG)' },
      { signal: 'Wrist optical HR — steady effort', quality: 'good', qLabel: 'Generally accurate',
        finding: '6 of 7 wrist devices tracked HR within ~5% of ECG — though none measured energy expenditure well (27–93% off).',
        source: 'Shcherbina 2017' },
      { signal: 'Wrist optical HR — hard/variable exercise', quality: 'mixed', qLabel: 'Degrades',
        finding: 'Device-dependent and drops off: active-HR agreement vs ECG ranges ~0.80 (Apple) down to ~0.52 (Garmin wrist).',
        source: '#06 (Dial 2025; Miller 2022)' },
      { signal: 'Ring PPG HR (Oura)', quality: 'mixed', qLabel: 'Rest only',
        finding: 'Excellent at rest/overnight (resting-HR CCC ~0.98); no validated active-exercise HR.',
        source: '#06 (Dial 2025); Kinnunen 2020 + Cao 2022' },
      { signal: 'GPS pace / distance', quality: 'mixed', qLabel: 'MAPE 3–6%',
        finding: 'MAPE 3.2–6.1% across 8 watches; only Polar <5%. Worse in urban/forest, better on a track.',
        source: '8-watch GPS study 2020' },
      { signal: 'Assumed maximum HR (often 220−age)', quality: 'poor', qLabel: 'Weak link',
        finding: 'Not a sensor — an assumption baked into the model. When wrong it directly skews VO2 max, and is a leading error source (especially in highly trained people).',
        source: 'Flagged in INTERLIVE 2022 + Firstbeat methodology' }
    ];
  }

  // ── Sources accordion (#36–48) ──────────────────────────────────────────

  get _sources() {
    return [
      { id: 39, tag: 'Key meta-analysis', title: 'Molina-García et al. 2022 — INTERLIVE Network',
        detail: 'Systematic review + meta-analysis + expert statement. Exercise-based wearable algorithms had near-nil mean bias vs lab (−0.09 mL/kg/min); resting-based algorithms overestimated (+2.17 mL/kg/min, limits of agreement −13.07 to +17.41). The organizing source for this tool.',
        cite: 'Sports Medicine. 2022;52(7):1577-1597.', url: 'https://doi.org/10.1007/s40279-021-01639-y' },
      { id: 36, tag: 'Systematic review', title: 'Železnik Mežan 2025 — Accuracy of wearables for VO2 max & lactate threshold',
        detail: 'PRISMA systematic review (QUADAS-2), 13 of 252 records. In 7 of 13 studies wearables were valid/acceptable vs gold standard — valid in untrained/recreational/team-sport populations, questionable in elite endurance athletes. Mostly Garmin + chest belt (Firstbeat).',
        cite: 'Frontiers in Sports and Active Living. 2025. PMC12748164.', url: 'https://doi.org/10.3389/fspor.2025.1707991' },
      { id: 42, tag: 'Garmin (independent)', title: 'Carrier et al. 2025 — Garmin fēnix 6 validation',
        detail: 'Independent validation (UNLV) vs metabolic system. VO2 max MAPE 7.05% (30 s avg), Lin’s CCC 0.73 — accurate; pulse-ox (SpO2) failed under any condition.',
        cite: 'Sensors. 2025;25(1):275.', url: 'https://doi.org/10.3390/s25010275' },
      { id: 43, tag: 'Garmin (independent)', title: 'Engel et al. 2025/2026 — Forerunner 245 in trained athletes',
        detail: 'n=35 endurance athletes vs treadmill gas analysis. Overall MAPE 6.7%; moderately trained 2.8–4.1%; highly trained underestimated (MAPE 9.4–10.4%, mean diff −4.7/−4.0 mL/kg/min). Exercise-based estimates degrade in highly trained.',
        cite: 'European Journal of Applied Physiology. 2026;126:591-603.', url: 'https://doi.org/10.1007/s00421-025-05923-x' },
      { id: 37, tag: 'Apple (independent)', title: 'Lambe et al. 2025 — Apple Watch VO2 max validation',
        detail: 'n=30; 5–10 days of wear then maximal treadmill test. Apple Watch underestimated VO2 max by 6.07 mL/kg/min; MAPE 13.31%; MAE 6.92. Authors say estimates need refinement before clinical use.',
        cite: 'PLOS ONE. 2025;20(5):e0323741.', url: 'https://doi.org/10.1371/journal.pone.0323741' },
      { id: 41, tag: 'Apple (independent)', title: 'Caserman et al. 2024 — Apple Watch Series 7',
        detail: 'n=19, cycle-ergometer graded test with gas analyzer. MAPE 15.79%; significantly underestimated (predicted 41.37 vs measured 45.88 mL/kg/min). Consistent with Lambe 2025.',
        cite: 'JMIR Biomedical Engineering. 2024;9:e59459.', url: 'https://doi.org/10.2196/59459' },
      { id: 40, tag: 'Polar (independent)', title: 'Neudorfer et al. 2025 — Polar Fitness Test vs CPET',
        detail: 'n=24, resting Polar Fitness Test vs CPET and 6MWT. MAPE 13.7%, ICC 0.743, bias −1.0 mL/min/kg, LoA ±11.4. The Porcari 6MWT equation performed similarly.',
        cite: 'Sensors. 2025;25(18):5649.', url: 'https://doi.org/10.3390/s25185649' },
      { id: 38, tag: 'Fitbit (independent)', title: 'Freeberg et al. 2019 — Fitbit Charge 2 cardio fitness score',
        detail: 'n=30, 7 days wear then treadmill VO2 max with verification. Consistent/unbiased estimate but significantly overestimates absolute VO2 max (52.5 vs 49.9 mL/kg/min, p=0.03).',
        cite: 'mHealth. 2019;5:39. PMID 31620466.', url: 'https://pubmed.ncbi.nlm.nih.gov/31620466/' },
      { id: 44, tag: 'Samsung (HR only)', title: 'Inoue et al. 2026 — Galaxy Watch heart rate during CPET',
        detail: 'n=55, Galaxy Watch 6 vs Polar H10 during maximal CPET. Validates heart rate (good agreement; error rises near max), NOT VO2 max. Included to show Samsung’s independent evidence covers HR, not VO2 max.',
        cite: 'JMIR Cardio. 2026;10:e81917.', url: 'https://doi.org/10.2196/81917' },
      { id: 46, tag: 'Input signal — HR', title: 'Gilgen-Ammann et al. 2019 — Chest-strap RR/HR validity',
        detail: 'Polar H10 vs ECG Holter across five rest-to-high-intensity activities. RR/HR signal quality is effectively ECG-grade (>99% of beats correctly detected). Establishes the chest strap as the best HR input.',
        cite: 'European Journal of Applied Physiology. 2019;119(7):1525-1532.', url: 'https://doi.org/10.1007/s00421-019-04142-5' },
      { id: 45, tag: 'Input signal — HR', title: 'Shcherbina et al. 2017 — Wrist HR vs energy expenditure',
        detail: 'Stanford, n=60, 7 wrist devices vs ECG + indirect calorimetry. Most measured HR within ~5% (6 of 7 acceptable), but none measured energy expenditure acceptably (off ~27–93%).',
        cite: 'Journal of Personalized Medicine. 2017;7(2):3.', url: 'https://doi.org/10.3390/jpm7020003' },
      { id: 47, tag: 'Input signal — GPS', title: 'GPS distance accuracy in 8 sport watches 2020',
        detail: '8 watches (Apple, Coros, Garmin, Polar, Suunto) across urban/forest/track. MAPE 3.2–6.1%; only Polar’s receivers <5% overall; distances underestimated and least accurate in urban/forest.',
        cite: 'JMIR mHealth and uHealth. 2020;8(6):e17118.', url: 'https://doi.org/10.2196/17118' },
      { id: 48, tag: 'Why it matters', title: 'Mandsager et al. 2018 — Fitness & long-term mortality',
        detail: 'Retrospective cohort, n=122,007, mean follow-up 8.4 yr. Cardiorespiratory fitness was inversely associated with all-cause mortality with no upper limit of benefit; the least-fit had ~5× the adjusted mortality risk of the fittest. The motivational anchor for tracking VO2 max at all.',
        cite: 'JAMA Network Open. 2018;1(6):e183605.', url: 'https://doi.org/10.1001/jamanetworkopen.2018.3605' }
    ];
  }

  // ── SEO light-DOM summary ───────────────────────────────────────────────

  _seoText() {
    return 'Wearable VO2 Max Accuracy Comparison by Kygo Health. How accurate is your watch or ring at estimating VO2 max versus a lab CPET test? Consumer wearables do not measure VO2 max — they estimate it from heart rate, GPS pace, and your profile (age, sex, weight). Key finding (INTERLIVE meta-analysis, Molina-García 2022): exercise-based estimates from an actual workout had near-zero average bias vs lab (−0.09 mL/kg/min), while resting-based estimates overestimated by +2.17 mL/kg/min, with large individual error (limits of agreement roughly ±13 to 17 mL/kg/min). Compare 9 devices: Garmin (Firstbeat), Apple Watch, Polar, Fitbit/Google, Samsung Galaxy Watch, WHOOP, Oura Ring, Coros, and Suunto on method, what each needs, vendor accuracy claim, independent validation, best/weakest use, and whether VO2 max sits behind a subscription. Independent (non-vendor) peer-reviewed VO2 max validation exists only for Garmin (Carrier 2025 Fēnix 6 MAPE 7.05%, CCC 0.73; Engel 2025 Forerunner 245 MAPE 6.7%, underestimates 9–10% in highly trained), Apple (Lambe 2025 MAPE 13.3%, underestimates −6.07 mL/kg/min; Caserman 2024 Series 7 MAPE 15.8%), Polar (Neudorfer 2025 resting Fitness Test MAPE 13.7%, ICC 0.74, overestimates), and Fitbit (Freeberg 2019 overestimates 52.5 vs 49.9 mL/kg/min). Samsung, WHOOP, Oura, and Coros rely on vendor or company-funded claims with no independent VO2 max validation; the often-cited Galaxy Watch ±4.7 mL/kg/min figure could not be traced to a real study and is excluded. Garmin with a chest strap on an outdoor run is the most trustworthy setup. Apple underestimates broadly. Polar resting test and Fitbit overestimate. Accuracy degrades in highly trained people, with wrist-only optical heart rate, in heat, and when the assumed max heart rate (220 minus age) is wrong. Use the number to track your own trend over time, not to compare people or hit a clinical threshold. What each device feeds in: heart-rate source (wrist optical, chest strap, or ring PPG), GPS pace, HRV, resting HR, profile, and an assumed maximum HR. How good those inputs are: chest-strap HR is ECG-grade (Gilgen-Ammann 2019); wrist optical HR is decent at steady effort but degrades during hard exercise (active-HR agreement ~0.80 Apple to ~0.52 Garmin wrist); Oura ring PPG is excellent at rest but has no validated active-exercise HR; GPS pace MAPE 3.2–6.1%. Garmin vs Apple Watch vs Whoop vs Oura vs Polar vs Fitbit VO2 max accuracy. Data verified June 2026.';
  }

  // ── Icons ───────────────────────────────────────────────────────────────

  _icon(name) {
    const icons = {
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
      chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      watch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"/><polyline points="12 10 12 12 13 13"/><path d="m9 4.5.5-2.5h5l.5 2.5"/><path d="m9 19.5.5 2.5h5l.5-2.5"/></svg>',
      ring: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="6"/><path d="M9 4h6l-1.5 4h-3z"/></svg>',
      strap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="8" width="10" height="8" rx="2"/><path d="M7 10H4m16 0h-3M7 14H4m16 0h-3"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      lab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6.5L4.5 17A2 2 0 0 0 6.3 20h11.4a2 2 0 0 0 1.8-3L15 8.5V2"/><path d="M8 2h8"/><path d="M7.5 13h9"/></svg>',
      lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
      unlock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
      run: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="2"/><path d="m6 20 2-5 3 1 1 4"/><path d="m5 11 4-2 3 3 4-1"/></svg>'
    };
    return icons[name] || icons.info;
  }

  // ── Filtering ───────────────────────────────────────────────────────────

  get _filterGroups() {
    return [
      { facet: 'type', label: 'Device type', chips: [
        { v: 'watch', l: 'Watch' }, { v: 'ring', l: 'Ring' }, { v: 'strap', l: 'Strap' } ] },
      { facet: 'val', label: 'Validation', chips: [
        { v: 'validated', l: 'Independently validated' }, { v: 'notvalidated', l: 'Vendor / indirect only' } ] },
      { facet: 'run', label: 'Effort needed', chips: [
        { v: 'run', l: 'Needs a workout' }, { v: 'norun', l: 'No workout needed' } ] },
      { facet: 'sub', label: 'VO2 max access', chips: [
        { v: 'free', l: 'Free' }, { v: 'paid', l: 'Subscription' } ] }
    ];
  }

  _deviceFacet(d, facet) {
    if (facet === 'type') return d.type;
    if (facet === 'val') return d.validation === 'validated' ? 'validated' : 'notvalidated';
    if (facet === 'run') return d.needsRun ? 'run' : 'norun';
    if (facet === 'sub') return d.subscription ? 'paid' : 'free';
    return '';
  }

  _matches(d) {
    for (const facet of Object.keys(this._filters)) {
      const set = this._filters[facet];
      if (set.size && !set.has(this._deviceFacet(d, facet))) return false;
    }
    return true;
  }

  _filtered() { return this._devices.filter(d => this._matches(d)); }

  _updateResults() {
    const sr = this.shadowRoot;
    const filtered = this._filtered();
    const chipbar = sr.querySelector('.vo2-chipbar');
    if (chipbar) chipbar.innerHTML = this._renderChips();
    const count = sr.querySelector('.vo2-count');
    if (count) count.textContent = `Showing ${filtered.length} of ${this._devices.length} devices`;
    const matrix = sr.querySelector('.vo2-matrix');
    if (matrix) matrix.innerHTML = this._renderMatrix(filtered);
    const cards = sr.querySelector('.vo2-cards');
    if (cards) cards.innerHTML = this._renderCards(filtered);
  }

  // ── Small render helpers ────────────────────────────────────────────────

  _validationBadge(v) {
    if (v === 'validated') return `<span class="badge badge-yes">${this._icon('check')} Independently validated</span>`;
    if (v === 'indirect') return `<span class="badge badge-mid">≈ Same engine (Firstbeat)</span>`;
    return `<span class="badge badge-no">Vendor claims only</span>`;
  }

  _methodPill(d) {
    const cls = d.method === 'exercise' ? 'pill-ex' : (d.method === 'resting' ? 'pill-rest' : 'pill-hybrid');
    const txt = d.method === 'exercise' ? 'Exercise-based' : (d.method === 'resting' ? 'Resting-based' : 'Hybrid');
    return `<span class="method-pill ${cls}">${txt}</span>`;
  }

  _yn(v) {
    if (v === true) return `<span class="yn yn-yes">${this._icon('check')}</span>`;
    if (v === 'opt') return `<span class="yn yn-opt">Optional</span>`;
    if (v === 'part') return `<span class="yn yn-opt">Partial</span>`;
    return `<span class="yn yn-no">${this._icon('minus')}</span>`;
  }

  _typeIcon(t) { return t === 'ring' ? this._icon('ring') : (t === 'strap' ? this._icon('strap') : this._icon('watch')); }

  // ── Section: filter chips ───────────────────────────────────────────────

  _renderChips() {
    const anyActive = Object.values(this._filters).some(s => s.size);
    const groups = this._filterGroups.map(g => `
      <div class="chip-group">
        <span class="chip-group-label">${g.label}</span>
        <div class="chip-row">
          ${g.chips.map(c => {
            const active = this._filters[g.facet].has(c.v);
            return `<button class="filter-chip${active ? ' active' : ''}" data-facet="${g.facet}" data-value="${c.v}" aria-pressed="${active}">${c.l}</button>`;
          }).join('')}
        </div>
      </div>`).join('');
    return groups + (anyActive
      ? `<button class="filter-reset" data-action="reset-filters">Reset filters</button>`
      : '');
  }

  // ── Section: comparison matrix ──────────────────────────────────────────

  _renderMatrix(devices) {
    if (!devices.length) {
      return `<div class="empty-state">No devices match those filters. <button class="link-btn" data-action="reset-filters">Reset</button></div>`;
    }
    return `
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Device</th>
              <th>How it estimates</th>
              <th>What it needs</th>
              <th>Vendor claim</th>
              <th>Independent validation</th>
              <th>Best / weakest for</th>
              <th>VO2 max access</th>
            </tr>
          </thead>
          <tbody>
            ${devices.map(d => `
              <tr>
                <td class="cell-device">
                  <span class="dev-dot" style="background:${d.color}"></span>
                  <span class="dev-name">${d.name}</span>
                  <span class="dev-type">${this._typeIcon(d.type)} ${d.typeLabel}</span>
                </td>
                <td>${this._methodPill(d)}<span class="cell-sub">${d.methodLabel}</span></td>
                <td><span class="cell-sub">${d.needs}</span></td>
                <td><span class="cell-sub">${d.vendorClaim}</span></td>
                <td>${this._validationBadge(d.validation)}<span class="cell-sub">${d.independent}</span></td>
                <td><span class="bw bw-best">${this._icon('check')} ${d.bestFor}</span><span class="bw bw-weak">${this._icon('minus')} ${d.weakestFor}</span></td>
                <td>${d.subscription
                  ? `<span class="sub-tag sub-paid">${this._icon('lock')} Paid</span>`
                  : `<span class="sub-tag sub-free">${this._icon('unlock')} Free</span>`}<span class="cell-sub">${d.subLabel}</span></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  }

  // ── Section: per-device cards ───────────────────────────────────────────

  _renderCards(devices) {
    if (!devices.length) {
      return `<div class="empty-state">No devices match those filters. <button class="link-btn" data-action="reset-filters">Reset</button></div>`;
    }
    return devices.map(d => `
      <article class="dev-card" style="--accent:${d.color}">
        <div class="dev-card-top">
          <div class="dev-card-head">
            <span class="dev-card-icon">${this._typeIcon(d.type)}</span>
            <div>
              <h3>${d.name}</h3>
              <span class="dev-card-type">${d.typeLabel} · ${this._methodPill(d)}</span>
            </div>
          </div>
          ${this._validationBadge(d.validation)}
        </div>

        <div class="acc-grid">
          <div class="acc-cell acc-vendor">
            <span class="acc-label">Vendor claim</span>
            <p>${d.vendorClaim}</p>
          </div>
          <div class="acc-cell acc-indep">
            <span class="acc-label">Independent vs lab CPET</span>
            <p>${d.independent}</p>
          </div>
        </div>

        <ul class="dev-facts">
          <li><span>${this._icon('run')}</span><strong>Needs:</strong> ${d.needs}</li>
          <li><span>${this._icon('check')}</span><strong>Best for:</strong> ${d.bestFor}</li>
          <li><span>${this._icon('minus')}</span><strong>Weakest for:</strong> ${d.weakestFor}</li>
          <li><span>${d.subscription ? this._icon('lock') : this._icon('unlock')}</span><strong>Access:</strong> ${d.subLabel}</li>
        </ul>

        ${d.affiliateUrl
          ? `<a href="${d.affiliateUrl}" class="amazon-link" target="_blank" rel="noopener sponsored" data-action="affiliate-click" data-track-label="${d.short} Amazon" data-track-position="device-card">View ${d.short} on Amazon ${this._icon('arrowRight')}</a>`
          : `<span class="amazon-link amazon-link-disabled">No affiliate link available</span>`}
      </article>`).join('');
  }

  // ── Section: how they calculate it (Table A + Table B) ──────────────────

  _renderInputsTableA(devices) {
    return `
      <div class="table-scroll">
        <table class="data-table data-table-inputs">
          <thead>
            <tr>
              <th>Device</th>
              <th>Heart-rate source</th>
              <th>GPS pace</th>
              <th>HRV</th>
              <th>Resting HR</th>
              <th>Profile</th>
              <th>Extrapolates via assumed max HR</th>
            </tr>
          </thead>
          <tbody>
            ${devices.map(d => `
              <tr>
                <td class="cell-device"><span class="dev-dot" style="background:${d.color}"></span><span class="dev-name">${d.name}</span></td>
                <td><span class="cell-sub">${d.hrSource}</span></td>
                <td>${this._yn(d.gps)}</td>
                <td>${this._yn(d.hrv)}</td>
                <td>${this._yn(d.restingHr)}</td>
                <td>${this._yn(d.profile)}</td>
                <td>${this._yn(d.maxHr)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  }

  _renderInputsTableB() {
    return `
      <div class="table-scroll">
        <table class="data-table data-table-signals">
          <thead>
            <tr><th>Input signal</th><th>How good it is (independent evidence)</th><th>Source</th></tr>
          </thead>
          <tbody>
            ${this._inputSignals.map(s => `
              <tr>
                <td class="cell-label">${s.signal}</td>
                <td><span class="q-pill q-${s.quality}">${s.qLabel}</span><span class="cell-sub">${s.finding}</span></td>
                <td><span class="cell-sub">${s.source}</span></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  }

  // ── Section: sources accordion ──────────────────────────────────────────

  _renderSources() {
    return this._sources.map(s => `
      <div class="src-card" data-source="${s.id}">
        <div class="src-header" tabindex="0" role="button" aria-expanded="false">
          <span class="src-num">#${s.id}</span>
          <span class="src-brand-wrap">
            <span class="src-title">${s.title}</span>
            <span class="src-tag">${s.tag}</span>
          </span>
          <span class="src-toggle">${this._icon('chevDown')}</span>
        </div>
        <div class="src-body">
          <p class="src-detail">${s.detail}</p>
          <p class="src-cite">${s.cite}</p>
          <a href="${s.url}" target="_blank" rel="noopener">View source ${this._icon('externalLink')}</a>
        </div>
      </div>`).join('');
  }

  // ── Main render ─────────────────────────────────────────────────────────

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const all = this._devices;

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <!-- Header -->
      <header class="header">
        <div class="header-inner">
          <a href="https://www.kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" loading="lazy" />
            VO2 Max Accuracy
          </a>
          <a href="https://www.kygo.app" class="header-link" target="_blank" rel="noopener">
            Get Kygo App ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge animate-on-scroll">9 DEVICES · LAB-VALIDATED ACCURACY</div>
          <h1 class="animate-on-scroll">How Accurate Is Your Watch's VO2 Max?</h1>
          <p class="hero-sub animate-on-scroll">No wearable <em>measures</em> VO2 max — the lab test analyzes the gas in your breath; a watch only <strong>estimates</strong> from heart rate, GPS pace, and your profile. Here's how 9 devices actually stack up against a lab CPET, brand by brand.</p>
          <div class="hero-note animate-on-scroll">${this._icon('info')} Treat the number as a fitness <em>trend tracker</em>, not a clinical value. Keep the device and protocol consistent and watch your own trend.</div>
        </div>
      </section>

      <!-- Key framing: exercise vs resting (INTERLIVE) -->
      <section class="framing-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">The one thing that decides accuracy</h2>
          <p class="section-sub animate-on-scroll">The INTERLIVE meta-analysis of consumer wearables found that <strong>how the device collects the data matters more than the brand.</strong></p>
          <div class="framing-grid">
            <div class="framing-card framing-good animate-on-scroll">
              <span class="framing-tag">${this._icon('activity')} Exercise-based (more accurate)</span>
              <span class="framing-stat">−0.09<small> mL/kg/min</small></span>
              <span class="framing-desc">Average bias vs lab when the estimate comes from an actual workout (HR-to-pace on an outdoor run). Essentially nil at the group level.</span>
            </div>
            <div class="framing-card framing-bad animate-on-scroll">
              <span class="framing-tag">${this._icon('info')} Resting-based (overestimates)</span>
              <span class="framing-stat">+2.17<small> mL/kg/min</small></span>
              <span class="framing-desc">Average overestimation when the estimate comes from resting HR + age/sex/weight, with no workout. Convenient, but reads high.</span>
            </div>
          </div>
          <div class="framing-foot animate-on-scroll">${this._icon('info')} <strong>Either way, individual error is large</strong> — limits of agreement run roughly ±13 to 17 mL/kg/min for resting methods. That's why it's a trend tool, not a precise personal value. <span class="src-ref">Molina-García 2022 (INTERLIVE)</span></div>
        </div>
      </section>

      <!-- App CTA (placed high, after the framing teaser) -->
      <section class="blog-cta-section">
        <div class="container">
          <div class="blog-cta-wrapper animate-on-scroll">
            <div class="blog-cta">
              <div class="blog-cta-glow"></div>
              <div class="blog-cta-content">
                <div class="blog-cta-badge"><span class="pulse-dot"></span>Free Forever Plan</div>
                <h2>Track Your VO2 Max Trend — Alongside <span class="highlight">What You Eat</span></h2>
                <p>Kygo Health connects your wearable's data to your nutrition so you can see the full picture, not just one number.</p>
                <div class="blog-cta-buttons">
                  <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" class="blog-cta-btn" data-track-position="article-cta" target="_blank" rel="noopener">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    Download for iOS
                  </a>
                  <a href="https://www.kygo.app/android" target="_blank" rel="noopener" class="blog-cta-android-btn" data-action="android-download" data-track-position="article-cta">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                    Download for Android
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Decision filters + comparison matrix -->
      <section class="compare-section" id="compare">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Find &amp; compare your device</h2>
          <p class="section-sub animate-on-scroll">Filter by what matters to you, then read the matrix. Independent validation = it exists in non-vendor peer-reviewed literature.</p>
          <div class="vo2-chipbar animate-on-scroll">${this._renderChips()}</div>
          <div class="vo2-count animate-on-scroll">Showing ${all.length} of ${all.length} devices</div>
          <div class="vo2-matrix animate-on-scroll">${this._renderMatrix(all)}</div>
        </div>
      </section>

      <!-- Per-device cards -->
      <section class="cards-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Device-by-device accuracy</h2>
          <p class="section-sub animate-on-scroll">Vendor claims vs what independent studies actually found. Badge shows whether independent peer-reviewed VO2 max validation exists.</p>
          <div class="vo2-cards">${this._renderCards(all)}</div>
        </div>
      </section>

      <!-- Companion blog cross-link -->
      <section class="blog-link-section">
        <div class="container">
          <div class="blog-link-wrap animate-on-scroll">
            <a href="https://www.kygo.app/post/most-accurate-vo2-max-wearable" class="blog-link-card" target="_blank" rel="noopener">
              <span class="blog-link-icon">${this._icon('activity')}</span>
              <div class="blog-link-text">
                <span class="blog-link-title">Read the full breakdown</span>
                <span class="blog-link-desc">The Most Accurate VO2 Max Wearable — which brands are actually validated</span>
              </div>
              <span class="blog-link-arrow">${this._icon('arrowRight')}</span>
            </a>
          </div>
        </div>
      </section>

      <!-- How they calculate it -->
      <section class="inputs-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">How they calculate it</h2>
          <p class="section-sub animate-on-scroll">VO2 max is only as good as the signals fed in. None of these measure oxygen — they infer it from HR, GPS pace, and your profile.</p>
          <h3 class="sub-head animate-on-scroll">What each device feeds in</h3>
          <div class="animate-on-scroll">${this._renderInputsTableA(all)}</div>
          <h3 class="sub-head animate-on-scroll">How good those inputs are</h3>
          <div class="animate-on-scroll">${this._renderInputsTableB()}</div>
          <div class="inputs-note animate-on-scroll">${this._icon('info')} The limiting input is heart rate <em>during the run</em> plus the assumed max HR (often just 220−age). That combination — not the sensor at rest — is the real ceiling on accuracy, which is why a chest strap helps and why very fit people get the biggest errors.</div>
        </div>
      </section>

      <!-- Bottom line / verification note -->
      <section class="bottomline-section">
        <div class="container">
          <div class="bottomline-card animate-on-scroll">
            <h2>The bottom line</h2>
            <p>A VO2 max estimate from a hard outdoor run with a chest strap (<strong>Garmin/Firstbeat — the only brand with solid independent validation, ~5–7% error in general populations</strong>) is the most trustworthy. <strong>Apple</strong> has two independent studies and both show it <em>underestimates</em> (~13–16%). <strong>Polar's</strong> resting test and <strong>Fitbit</strong> overestimate. <strong>Samsung, WHOOP, Oura, and Coros</strong> rely on company claims with little or no independent peer-reviewed VO2 max validation.</p>
            <p class="verify-note">${this._icon('info')} <strong>Verification note (triple-checked).</strong> Independent VO2 max validation exists only for Garmin, Apple, Polar, and Fitbit. A frequently-repeated "Galaxy Watch ±4.7 mL/kg/min" figure appears only on marketing/AI-content sites and could not be traced to a real indexed study — it is deliberately excluded here.</p>
          </div>
        </div>
      </section>

      <!-- Sources -->
      <section class="sources-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Sources</h2>
          <p class="section-sub animate-on-scroll">Each opened and checked against the primary record (PubMed/PMC/journal). Tap to expand. Verified June 2026.</p>
          <div class="sources-list animate-on-scroll">${this._renderSources()}</div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="tool-footer">
        <div class="container">
          <a href="https://www.kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" loading="lazy" />
            Kygo Health
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
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Wearable VO2 max is an estimate, not a clinical measurement. Always consult a qualified healthcare provider before making health decisions based on wearable data.</p>
          <p class="footer-copyright">Data from peer-reviewed validation studies and manufacturer documentation. Last updated June 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  // ── Event delegation ────────────────────────────────────────────────────

  _setupEventDelegation() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const shadow = this.shadowRoot;

    shadow.addEventListener('click', (e) => {
      const reset = e.target.closest('[data-action="reset-filters"]');
      if (reset) {
        Object.values(this._filters).forEach(s => s.clear());
        this._updateResults();
        return;
      }

      const chip = e.target.closest('.filter-chip');
      if (chip) {
        const facet = chip.dataset.facet;
        const value = chip.dataset.value;
        const set = this._filters[facet];
        if (set.has(value)) set.delete(value); else set.add(value);
        this._updateResults();
        return;
      }

      const srcHeader = e.target.closest('.src-header');
      if (srcHeader) {
        const card = srcHeader.closest('.src-card');
        const key = card.dataset.source;
        this._expandedSource = this._expandedSource === key ? null : key;
        shadow.querySelectorAll('.src-card').forEach(c => {
          const open = c.dataset.source === this._expandedSource;
          c.classList.toggle('open', open);
          const h = c.querySelector('.src-header');
          if (h) h.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        return;
      }
    });

    shadow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const srcHeader = e.target.closest('.src-header');
        if (srcHeader) { e.preventDefault(); srcHeader.click(); }
      }
    });
  }

  // ── Scroll animations ───────────────────────────────────────────────────

  _setupAnimations() {
    requestAnimationFrame(() => {
      const els = this.shadowRoot.querySelectorAll('.animate-on-scroll');
      if (!els.length) return;
      if (this._observer) this._observer.disconnect();
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this._observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -50px 0px', threshold: 0.15 });
      els.forEach(el => this._observer.observe(el));
    });
  }

  // ── JSON-LD ─────────────────────────────────────────────────────────────

  _injectStructuredData() {
    if (!document.querySelector('script[data-kygo-vo2max-accuracy-ld]')) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Most Accurate VO2 Max Wearable: Garmin, WHOOP, Oura & More',
        'description': 'How accurately do Garmin, Apple, WHOOP, Oura, Fitbit, Polar & Samsung estimate VO2 max? Compared vs lab CPET, with which brands are actually validated.',
        'applicationCategory': 'HealthApplication',
        'operatingSystem': 'Web',
        'url': 'https://www.kygo.app/tools/vo2-max-accuracy',
        'datePublished': '2026-06-03',
        'dateModified': '2026-06-03',
        'softwareVersion': '1.0',
        'inLanguage': 'en',
        'isAccessibleForFree': true,
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
        'alternateName': 'Kygo Wearable VO2 Max Accuracy Tool',
        'featureList': 'Compare 9 wearables, exercise vs resting estimation, vendor vs independent validation, input-signal accuracy, subscription requirements, decision filters',
        'keywords': 'wearable vo2 max accuracy, garmin vo2 max accuracy, apple watch vo2 max accuracy, whoop vo2 max accuracy, oura vo2 max, polar fitness test accuracy, fitbit cardio fitness score accuracy, does apple watch overestimate vo2 max, most accurate vo2 max watch 2026'
      };
      const s1 = document.createElement('script');
      s1.type = 'application/ld+json';
      s1.setAttribute('data-kygo-vo2max-accuracy-ld', '');
      s1.textContent = JSON.stringify(ld);
      document.head.appendChild(s1);
    }

    if (!document.querySelector('script[data-kygo-vo2max-accuracy-faq]')) {
      const faq = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          { '@type': 'Question', 'name': 'Do wearables actually measure VO2 max?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'No. The lab gold standard (CPET) analyzes the oxygen and carbon dioxide in your breath. Watches, rings, and straps have no gas analysis, so they estimate VO2 max from heart rate, motion, GPS pace, and your profile (age, sex, weight). Treat it as a fitness trend, not a clinical value.' } },
          { '@type': 'Question', 'name': 'Which wearable has the most accurate VO2 max?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'Garmin (Firstbeat) from a hard outdoor run with a chest strap is the most trustworthy and the only brand with solid independent validation (about 5 to 7 percent error in general populations). Apple has two independent studies but both show it underestimates by roughly 13 to 16 percent.' } },
          { '@type': 'Question', 'name': 'Does the Apple Watch overestimate or underestimate VO2 max?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'Two independent studies show the Apple Watch underestimates VO2 max: by 6.07 mL/kg/min (MAPE 13.3%, Lambe 2025) and predicting about 41 versus a measured 46 mL/kg/min on the Series 7 (MAPE 15.8%, Caserman 2024). The underestimation is larger in fitter people.' } },
          { '@type': 'Question', 'name': 'Why are resting VO2 max estimates less accurate?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'Resting-based estimates (Polar Fitness Test, Fitbit cardio fitness score) use resting heart rate plus age, sex and weight with no workout. The INTERLIVE meta-analysis found they overestimate by about +2.17 mL/kg/min on average, versus near-zero bias for exercise-based estimates from an actual run.' } },
          { '@type': 'Question', 'name': 'Do you need a subscription to see your VO2 max?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'Most watches show VO2 max for free (Garmin, Apple, Polar, Samsung, Coros, Suunto; Fitbit shows the metric free with Premium adding coaching only). WHOOP requires a paid membership, and Oura requires its membership to see Cardio Capacity.' } }
        ]
      };
      const s2 = document.createElement('script');
      s2.type = 'application/ld+json';
      s2.setAttribute('data-kygo-vo2max-accuracy-faq', '');
      s2.textContent = JSON.stringify(faq);
      document.head.appendChild(s2);
    }
  }

  // ── Styles ──────────────────────────────────────────────────────────────

  _styles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

      :host {
        --dark: #1E293B;
        --light: #F8FAFC;
        --green: #22C55E;
        --green-dark: #16A34A;
        --green-light: rgba(34,197,94,0.1);
        --amber: #F59E0B;
        --amber-light: rgba(245,158,11,0.1);
        --red: #EF4444;
        --red-light: rgba(239,68,68,0.1);
        --blue: #3B82F6;
        --gray-50: #f9fafb;
        --gray-100: #F1F5F9;
        --gray-200: #E2E8F0;
        --gray-300: #CBD5E1;
        --gray-400: #94A3B8;
        --gray-600: #475569;
        --gray-700: #334155;
        --radius: 20px;
        --radius-sm: 12px;
        --shadow: 0 4px 12px rgba(0,0,0,0.04);
        --shadow-hover: 0 12px 32px rgba(0,0,0,0.08);
        display: block;
        font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: var(--light);
        color: var(--dark);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
      }
      *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
      h1, h2, h3, h4 { font-family: 'Space Grotesk', -apple-system, sans-serif; font-weight: 600; line-height: 1.2; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
      a { text-decoration: none; }
      em { font-style: italic; }

      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      /* Header */
      .header { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid var(--gray-200); }
      .header-inner { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; max-width: 1200px; margin: 0 auto; gap: 10px; }
      .logo { display: flex; align-items: center; gap: 8px; color: var(--dark); font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; min-width: 0; }
      .logo-img { height: 28px; width: auto; flex-shrink: 0; }
      .header-link { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #fff; background: var(--green); padding: 8px 16px; border-radius: 50px; transition: background 0.2s; flex-shrink: 0; white-space: nowrap; }
      .header-link:hover { background: var(--green-dark); }
      .header-link svg { width: 14px; height: 14px; }

      /* Hero */
      .hero { padding: 56px 0 28px; text-align: center; }
      .hero-badge { display: inline-block; background: var(--green-light); color: var(--green-dark); font-size: 11px; font-weight: 600; letter-spacing: 1.5px; padding: 6px 16px; border-radius: 50px; margin-bottom: 16px; }
      .hero h1 { font-size: clamp(26px, 7vw, 42px); max-width: 740px; margin: 0 auto 16px; }
      .hero-sub { color: var(--gray-600); font-size: 16px; max-width: 640px; margin: 0 auto 18px; }
      .hero-sub strong { color: var(--dark); }
      .hero-note { display: inline-flex; align-items: flex-start; gap: 8px; text-align: left; background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius-sm); padding: 12px 16px; font-size: 13px; color: var(--gray-600); max-width: 560px; }
      .hero-note svg { width: 16px; height: 16px; color: var(--green-dark); flex-shrink: 0; margin-top: 2px; }

      /* Section headings */
      .section-title { font-size: clamp(22px, 5vw, 32px); margin-bottom: 8px; }
      .section-sub { color: var(--gray-600); font-size: 15px; margin-bottom: 24px; max-width: 720px; }
      .section-sub strong { color: var(--dark); }
      .sub-head { font-size: 16px; margin: 28px 0 12px; color: var(--dark); }

      /* Framing (exercise vs resting) */
      .framing-section { padding: 40px 0; background: #fff; }
      .framing-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
      .framing-card { border-radius: var(--radius-sm); padding: 22px; display: flex; flex-direction: column; gap: 8px; border: 1px solid var(--gray-200); }
      .framing-good { background: var(--green-light); border-color: rgba(34,197,94,0.3); }
      .framing-bad { background: var(--amber-light); border-color: rgba(245,158,11,0.3); }
      .framing-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; }
      .framing-good .framing-tag { color: var(--green-dark); }
      .framing-bad .framing-tag { color: #B45309; }
      .framing-tag svg { width: 15px; height: 15px; }
      .framing-stat { font-family: 'Space Grotesk', sans-serif; font-size: clamp(30px, 8vw, 44px); font-weight: 700; line-height: 1; }
      .framing-good .framing-stat { color: var(--green-dark); }
      .framing-bad .framing-stat { color: #B45309; }
      .framing-stat small { font-size: 14px; font-weight: 500; color: var(--gray-600); margin-left: 4px; }
      .framing-desc { font-size: 14px; color: var(--gray-600); }
      .framing-foot { display: flex; align-items: flex-start; gap: 8px; margin-top: 16px; font-size: 13px; color: var(--gray-600); background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-sm); padding: 12px 16px; }
      .framing-foot strong { color: var(--dark); }
      .framing-foot svg { width: 16px; height: 16px; color: var(--gray-400); flex-shrink: 0; margin-top: 2px; }
      .src-ref { display: inline-block; font-size: 11px; color: var(--gray-400); font-style: italic; }

      /* Compare section + filter chips */
      .compare-section { padding: 48px 0; }
      .vo2-chipbar { display: flex; flex-wrap: wrap; gap: 16px 24px; margin-bottom: 16px; align-items: flex-end; }
      .chip-group { display: flex; flex-direction: column; gap: 6px; }
      .chip-group-label { font-size: 11px; font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase; color: var(--gray-400); }
      .chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
      .filter-chip { padding: 7px 14px; border: 2px solid var(--gray-200); border-radius: 50px; background: #fff; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--gray-600); cursor: pointer; transition: all 0.18s; white-space: nowrap; }
      .filter-chip:hover { border-color: var(--gray-300); }
      .filter-chip.active { background: var(--green-light); color: var(--green-dark); border-color: var(--green); }
      .filter-reset { align-self: flex-end; padding: 7px 14px; border: none; background: none; color: var(--gray-400); font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer; text-decoration: underline; }
      .filter-reset:hover { color: var(--dark); }
      .vo2-count { font-size: 13px; color: var(--gray-400); margin-bottom: 14px; font-weight: 500; }

      /* Data tables */
      .table-scroll { overflow-x: auto; border: 1px solid var(--gray-200); border-radius: var(--radius-sm); background: #fff; -webkit-overflow-scrolling: touch; }
      .table-scroll::after { content: 'Swipe to see more →'; display: block; text-align: center; font-size: 12px; color: var(--gray-400); padding: 8px; }
      @media (min-width: 1024px) { .table-scroll::after { display: none; } }
      .data-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 13px; min-width: 1040px; }
      .data-table-inputs { min-width: 880px; }
      .data-table-signals { min-width: 720px; }
      .data-table th { background: var(--gray-50); padding: 12px 14px; text-align: left; font-weight: 600; font-size: 12px; color: var(--gray-600); border-bottom: 1px solid var(--gray-200); white-space: nowrap; }
      .data-table td { padding: 12px 14px; border-bottom: 1px solid var(--gray-100); vertical-align: top; }
      .data-table tr:last-child td { border-bottom: none; }
      .data-table tbody tr:hover td { background: rgba(34,197,94,0.03); }
      .data-table th:first-child, .data-table td:first-child { position: sticky; left: 0; z-index: 2; background: #fff; min-width: 150px; box-shadow: 2px 0 4px rgba(0,0,0,0.05); }
      .data-table th:first-child { background: var(--gray-50); }
      .cell-device { display: flex; flex-direction: column; gap: 4px; }
      .dev-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
      .dev-name { font-weight: 600; font-size: 13px; }
      .dev-type { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: var(--gray-400); }
      .dev-type svg { width: 13px; height: 13px; }
      .cell-sub { display: block; font-size: 12px; color: var(--gray-600); margin-top: 4px; }
      .cell-label { font-weight: 600; }

      .method-pill { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 50px; }
      .pill-ex { background: var(--green-light); color: var(--green-dark); }
      .pill-rest { background: var(--amber-light); color: #B45309; }
      .pill-hybrid { background: rgba(59,130,246,0.1); color: #1D4ED8; }

      .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 50px; white-space: nowrap; }
      .badge svg { width: 13px; height: 13px; }
      .badge-yes { background: var(--green-light); color: var(--green-dark); }
      .badge-mid { background: var(--amber-light); color: #B45309; }
      .badge-no { background: var(--gray-100); color: var(--gray-600); }

      .bw { display: flex; align-items: flex-start; gap: 4px; font-size: 12px; margin-bottom: 4px; }
      .bw svg { width: 13px; height: 13px; flex-shrink: 0; margin-top: 2px; }
      .bw-best { color: var(--gray-700); }
      .bw-best svg { color: var(--green); }
      .bw-weak { color: var(--gray-400); }
      .bw-weak svg { color: var(--gray-300); }

      .sub-tag { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 50px; }
      .sub-tag svg { width: 12px; height: 12px; }
      .sub-free { background: var(--green-light); color: var(--green-dark); }
      .sub-paid { background: var(--amber-light); color: #B45309; }

      .yn { display: inline-flex; align-items: center; }
      .yn svg { width: 18px; height: 18px; }
      .yn-yes svg { color: var(--green); }
      .yn-no svg { color: var(--gray-300); }
      .yn-opt { font-size: 11px; font-weight: 600; color: var(--amber); }

      .q-pill { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 50px; }
      .q-good { background: var(--green-light); color: var(--green-dark); }
      .q-mixed { background: var(--amber-light); color: #B45309; }
      .q-poor { background: var(--red-light); color: #B91C1C; }

      .empty-state { padding: 40px 20px; text-align: center; color: var(--gray-400); font-size: 14px; background: #fff; border: 1px dashed var(--gray-300); border-radius: var(--radius-sm); }
      .link-btn { border: none; background: none; color: var(--green-dark); font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: underline; }

      /* Device cards */
      .cards-section { padding: 48px 0; background: #fff; }
      .vo2-cards { display: grid; grid-template-columns: 1fr; gap: 16px; }
      .dev-card { background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-sm); padding: 20px; border-top: 4px solid var(--accent, var(--green)); display: flex; flex-direction: column; }
      .dev-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
      .dev-card-head { display: flex; align-items: center; gap: 12px; }
      .dev-card-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid var(--gray-200); border-radius: 10px; color: var(--accent, var(--dark)); flex-shrink: 0; }
      .dev-card-icon svg { width: 20px; height: 20px; }
      .dev-card-head h3 { font-size: 17px; }
      .dev-card-type { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--gray-400); }
      .acc-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 14px; }
      .acc-cell { background: #fff; border: 1px solid var(--gray-200); border-radius: 10px; padding: 12px 14px; }
      .acc-indep { border-left: 3px solid var(--green); }
      .acc-vendor { border-left: 3px solid var(--gray-300); }
      .acc-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; color: var(--gray-400); margin-bottom: 4px; }
      .acc-cell p { font-size: 13px; color: var(--gray-700); }
      .dev-facts { list-style: none; display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
      .dev-facts li { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: var(--gray-600); }
      .dev-facts li span { display: inline-flex; flex-shrink: 0; margin-top: 1px; }
      .dev-facts li svg { width: 15px; height: 15px; color: var(--gray-400); }
      .dev-facts strong { color: var(--dark); font-weight: 600; }
      .amazon-link { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; margin-top: auto; font-size: 13px; font-weight: 600; color: #fff; background: var(--accent, var(--green-dark)); padding: 9px 16px; border-radius: 50px; transition: filter 0.2s; }
      .amazon-link:hover { filter: brightness(0.92); }
      .amazon-link svg { width: 15px; height: 15px; }
      .amazon-link-disabled { background: var(--gray-100); color: var(--gray-400); font-weight: 500; cursor: default; }

      /* Inputs section */
      .inputs-section { padding: 48px 0; }
      .inputs-note { display: flex; align-items: flex-start; gap: 8px; margin-top: 18px; font-size: 13px; color: var(--gray-600); background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius-sm); padding: 14px 16px; }
      .inputs-note svg { width: 16px; height: 16px; color: var(--green-dark); flex-shrink: 0; margin-top: 2px; }

      /* Bottom line */
      .bottomline-section { padding: 16px 0 48px; }
      .bottomline-card { background: var(--dark); color: #fff; border-radius: var(--radius); padding: 32px 28px; max-width: 860px; margin: 0 auto; }
      .bottomline-card h2 { font-size: clamp(20px, 5vw, 26px); margin-bottom: 14px; }
      .bottomline-card p { font-size: 15px; color: var(--gray-200); margin-bottom: 14px; }
      .bottomline-card strong { color: #fff; }
      .verify-note { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: var(--gray-300); background: rgba(255,255,255,0.06); border-radius: var(--radius-sm); padding: 14px 16px; margin-bottom: 0 !important; }
      .verify-note svg { width: 16px; height: 16px; color: var(--green); flex-shrink: 0; margin-top: 2px; }
      .verify-note strong { color: #fff; }

      /* Companion blog cross-link */
      .blog-link-section { padding: 24px 0 8px; }
      .blog-link-wrap { max-width: 720px; margin: 0 auto; }
      .blog-link-card { display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: var(--green-light); border: 2px solid var(--green); border-radius: var(--radius); transition: box-shadow 0.3s; }
      .blog-link-card:hover { box-shadow: var(--shadow-hover); }
      .blog-link-icon { width: 40px; height: 40px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 10px; color: var(--green-dark); }
      .blog-link-icon svg { width: 20px; height: 20px; }
      .blog-link-text { flex: 1; min-width: 0; }
      .blog-link-title { display: block; font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--green-dark); letter-spacing: 0.3px; }
      .blog-link-desc { display: block; font-size: 14px; font-weight: 500; color: var(--dark); margin-top: 2px; }
      .blog-link-arrow { width: 20px; height: 20px; color: var(--green-dark); flex-shrink: 0; }
      .blog-link-arrow svg { width: 20px; height: 20px; }

      /* Blog CTA */
      .blog-cta-section { padding: 48px 0; overflow: hidden; }
      .blog-cta-wrapper { max-width: 680px; margin: 0 auto; }
      .blog-cta { position: relative; background: linear-gradient(135deg, var(--dark) 0%, var(--gray-700) 100%); border-radius: var(--radius); padding: 40px 32px; overflow: hidden; text-align: center; color: #fff; }
      .blog-cta-glow { position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(34,197,94,0.15), transparent 70%); pointer-events: none; }
      .blog-cta-content { position: relative; z-index: 1; }
      .blog-cta-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 500; margin-bottom: 16px; }
      .pulse-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; animation: pulse 2s infinite; }
      @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      .blog-cta h2 { font-size: clamp(20px, 5vw, 28px); margin-bottom: 12px; }
      .highlight { color: var(--green); }
      .blog-cta p { color: var(--gray-300); font-size: 14px; margin-bottom: 20px; }
      .blog-cta-buttons { display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; }
      .blog-cta-btn, .blog-cta-android-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; font-weight: 600; padding: 12px 24px; border-radius: var(--radius-sm); font-size: 15px; transition: background 0.2s; border: none; cursor: pointer; font-family: inherit; }
      .blog-cta-btn:hover, .blog-cta-android-btn:hover { background: var(--green-dark); color: #fff; }
      .blog-cta-btn svg, .blog-cta-android-btn svg { width: 18px; height: 18px; }
      @media (max-width: 480px) { .blog-cta-buttons { flex-direction: column; align-items: stretch; } .blog-cta-buttons a { justify-content: center; } }

      /* Sources */
      .sources-section { padding: 48px 0; background: #fff; }
      .sources-list { display: flex; flex-direction: column; gap: 6px; }
      .src-card { background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-sm); overflow: hidden; }
      .src-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; }
      .src-num { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; color: var(--green-dark); flex-shrink: 0; }
      .src-brand-wrap { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
      .src-title { font-size: 14px; font-weight: 600; color: var(--dark); }
      .src-tag { font-size: 11px; color: var(--gray-400); }
      .src-toggle { width: 18px; height: 18px; color: var(--gray-400); transition: transform 0.3s; flex-shrink: 0; }
      .src-toggle svg { width: 100%; height: 100%; }
      .src-card.open .src-toggle { transform: rotate(180deg); }
      .src-body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.4s; padding: 0 16px; }
      .src-card.open .src-body { max-height: 460px; padding: 0 16px 16px; }
      .src-detail { font-size: 13px; color: var(--gray-600); margin-bottom: 8px; }
      .src-cite { font-size: 12px; color: var(--gray-400); font-style: italic; margin-bottom: 8px; }
      .src-body a { display: inline-flex; align-items: center; gap: 6px; color: var(--green-dark); font-size: 13px; font-weight: 600; }
      .src-body a svg { width: 13px; height: 13px; }

      /* Footer */
      .tool-footer { padding: 28px 0 18px; text-align: center; border-top: 1px solid var(--gray-200); }
      .footer-brand { display: inline-flex; align-items: center; gap: 8px; color: var(--dark); font-family: 'Space Grotesk', sans-serif; font-weight: 600; margin-bottom: 8px; }
      .footer-logo { height: 24px; width: auto; }
      .footer-tagline { color: var(--gray-400); font-size: 13px; margin-bottom: 12px; }
      .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 16px; margin-bottom: 16px; padding: 0 16px; }
      .footer-links a { color: var(--gray-600); font-size: 13px; white-space: nowrap; }
      .footer-links a:hover { color: var(--green-dark); }
      .footer-copyright { color: var(--gray-400); font-size: 12px; margin-top: 4px; }
      .footer-disclaimer { font-size: 11px; color: var(--gray-400); line-height: 1.5; max-width: 600px; margin: 0 auto 12px; }
      .footer-affiliate { font-style: italic; }

      /* Responsive */
      @media (min-width: 768px) {
        .hero { padding: 72px 0 36px; }
        .framing-grid { grid-template-columns: 1fr 1fr; }
        .vo2-cards { grid-template-columns: 1fr 1fr; }
        .acc-grid { grid-template-columns: 1fr 1fr; }
      }
      @media (min-width: 1024px) {
        .vo2-cards { grid-template-columns: 1fr 1fr 1fr; }
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .src-body { transition: none; }
        .pulse-dot { animation: none; }
      }
    `;
  }
}

customElements.define('kygo-vo2max-accuracy', KygoVo2maxAccuracy);
