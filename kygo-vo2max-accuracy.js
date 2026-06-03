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
        key: 'garmin', name: 'Garmin (Firstbeat)', short: 'Garmin',
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
        key: 'apple', name: 'Apple Watch', short: 'Apple',
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
        key: 'polar', name: 'Polar', short: 'Polar',
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
        key: 'fitbit', name: 'Fitbit / Google', short: 'Fitbit',
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
        key: 'samsung', name: 'Samsung Galaxy Watch', short: 'Samsung',
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
        key: 'whoop', name: 'WHOOP', short: 'WHOOP',
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
        key: 'oura', name: 'Oura Ring', short: 'Oura',
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
        key: 'coros', name: 'Coros', short: 'Coros',
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
        key: 'suunto', name: 'Suunto', short: 'Suunto',
        type: 'watch', typeLabel: 'Watch',
        method: 'exercise', methodLabel: 'Exercise — Firstbeat engine (current models)',
        needs: 'Outdoor run + HR', needsRun: true,
        vendorClaim: 'Inherits Firstbeat’s ~95% claim',
        validation: 'indirect',
        independent: 'Covered indirectly by Firstbeat/Garmin validations (same engine); no Suunto-specific study located.',
        bestFor: 'Like Garmin (shared engine)',
        weakestFor: 'No brand-specific study',
        subscription: false, subLabel: 'Free',
        affiliateUrl: 'https://amzn.to/4fZD5Cx',
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

  // ── FAQ (also emitted as FAQPage JSON-LD) ────────────────────────────────

  get _faqs() {
    return [
      { q: 'Do wearables actually measure VO2 max?',
        a: 'No. The lab gold standard (CPET) analyzes the oxygen and carbon dioxide in your breath. Watches, rings, and straps have no gas analysis, so they estimate VO2 max from heart rate, motion, GPS pace, and your profile (age, sex, weight). Treat it as a fitness trend, not a clinical value.' },
      { q: 'Which wearable has the most accurate VO2 max?',
        a: 'Garmin (Firstbeat) from a hard outdoor run with a chest strap is the most trustworthy and the only brand with solid independent validation (about 5 to 7 percent error in general populations). Apple has two independent studies but both show it underestimates by roughly 13 to 16 percent.' },
      { q: 'Does the Apple Watch overestimate or underestimate VO2 max?',
        a: 'Two independent studies show the Apple Watch underestimates VO2 max: by 6.07 mL/kg/min (MAPE 13.3%, Lambe 2025) and predicting about 41 versus a measured 46 mL/kg/min on the Series 7 (MAPE 15.8%, Caserman 2024). The underestimation is larger in fitter people.' },
      { q: 'Why are resting VO2 max estimates less accurate?',
        a: 'Resting-based estimates (Polar Fitness Test, Fitbit cardio fitness score) use resting heart rate plus age, sex and weight with no workout. The INTERLIVE meta-analysis found they overestimate by about +2.17 mL/kg/min on average, versus near-zero bias for exercise-based estimates from an actual run.' },
      { q: 'Do you need a subscription to see your VO2 max?',
        a: 'Most watches show VO2 max for free (Garmin, Apple, Polar, Samsung, Coros, Suunto; Fitbit shows the metric free with Premium adding coaching only). WHOOP requires a paid membership, and Oura requires its membership to see Cardio Capacity.' }
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
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      watch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"/><polyline points="12 10 12 12 13 13"/><path d="m9 4.5.5-2.5h5l.5 2.5"/><path d="m9 19.5.5 2.5h5l.5-2.5"/></svg>',
      ring: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="6"/><path d="M9 4h6l-1.5 4h-3z"/></svg>',
      strap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="8" width="10" height="8" rx="2"/><path d="M7 10H4m16 0h-3M7 14H4m16 0h-3"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
      unlock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
      run: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="2"/><path d="m6 20 2-5 3 1 1 4"/><path d="m5 11 4-2 3 3 4-1"/></svg>',
      apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg>',
      android: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 10v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-2 0zm10 0v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-2 0zM5 17v3a1 1 0 1 0 2 0v-3H5zm12 0v3a1 1 0 1 0 2 0v-3h-2zm-9.5-9c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5H7.5zm.5 1h8a1 1 0 0 1 1 1v6H7v-6a1 1 0 0 1 1-1zM9 5.5a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zm6 0a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1z"/></svg>'
    };
    return `<span class="ico">${icons[name] || icons.info}</span>`;
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
    const chipbar = sr.querySelector('[data-chips]');
    if (chipbar) chipbar.innerHTML = this._renderChips();
    const count = sr.querySelector('[data-count]');
    if (count) count.innerHTML = `Showing <strong>${filtered.length}</strong> of ${this._devices.length} devices`;
    const cards = sr.querySelector('[data-cards]');
    if (cards) cards.innerHTML = this._renderCards(filtered);
  }

  // ── Small render helpers ────────────────────────────────────────────────

  _typeIcon(t) { return t === 'ring' ? this._icon('ring') : (t === 'strap' ? this._icon('strap') : this._icon('watch')); }

  _validationBadge(v) {
    if (v === 'validated') return `<span class="vbadge yes">${this._icon('check')} Independently validated</span>`;
    if (v === 'indirect') return `<span class="vbadge mid">≈ Same engine (Firstbeat)</span>`;
    return `<span class="vbadge no">Vendor claims only</span>`;
  }

  _methodPill(d) {
    const cls = d.method === 'exercise' ? 'ex' : 'rest';
    const txt = d.method === 'exercise' ? 'Exercise-based' : (d.method === 'resting' ? 'Resting-based' : 'Hybrid');
    return `<span class="m-pill ${cls}">${txt}</span>`;
  }

  _yn(v) {
    if (v === true) return `<span class="yn yes">${this._icon('check')}</span>`;
    if (v === 'opt') return `<span class="yn opt">Optional</span>`;
    if (v === 'part') return `<span class="yn opt">Partial</span>`;
    return `<span class="yn no">${this._icon('minus')}</span>`;
  }

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
      ? `<button class="filter-reset" data-action="reset-filters">Reset</button>`
      : '');
  }

  // ── Section: per-device cards (single consolidated comparison) ───────────

  _renderCards(devices) {
    if (!devices.length) {
      return `<div class="empty-state">No devices match those filters. <button class="link-btn" data-action="reset-filters">Reset filters</button></div>`;
    }
    return devices.map(d => `
      <article class="dev-card${d.validation === 'validated' ? ' is-validated' : ''}">
        <div class="dev-head">
          <span class="dev-icon">${this._typeIcon(d.type)}</span>
          <div class="dev-headtext">
            <h3>${d.name}</h3>
            <span class="dev-meta">${d.typeLabel}</span>
          </div>
          ${d.subscription
            ? `<span class="sub-tag paid">${this._icon('lock')} Paid</span>`
            : `<span class="sub-tag free">${this._icon('unlock')} Free</span>`}
        </div>

        <div class="dev-pills">${this._methodPill(d)}${this._validationBadge(d.validation)}</div>

        <div class="dev-finding">
          <span class="dev-label">Independent vs lab CPET</span>
          <p>${d.independent}</p>
        </div>

        <details class="dev-vendor">
          <summary>Vendor claim</summary>
          <p>${d.vendorClaim}</p>
        </details>

        <ul class="dev-facts">
          <li><span class="fct-ico">${this._icon('run')}</span><span><strong>Needs</strong> ${d.needs}</span></li>
          <li><span class="fct-ico ok">${this._icon('check')}</span><span><strong>Best for</strong> ${d.bestFor}</span></li>
          <li><span class="fct-ico">${this._icon('minus')}</span><span><strong>Weakest for</strong> ${d.weakestFor}</span></li>
        </ul>

        ${d.affiliateUrl
          ? `<a href="${d.affiliateUrl}" class="dev-amazon" target="_blank" rel="noopener sponsored" data-action="affiliate-click" data-track-label="${d.short} Amazon" data-track-position="device-card">View ${d.short} on Amazon ${this._icon('arrowRight')}</a>`
          : ''}
      </article>`).join('');
  }

  // ── Section: how they calculate it (Table A + Table B) ──────────────────

  _renderInputsTableA(devices) {
    return `
      <div class="tbl-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>Device</th>
              <th>Heart-rate source</th>
              <th>GPS</th>
              <th>HRV</th>
              <th>Resting HR</th>
              <th>Profile</th>
              <th>Assumed max HR</th>
            </tr>
          </thead>
          <tbody>
            ${devices.map(d => `
              <tr>
                <td class="spec-name" data-label="Device">${d.name}</td>
                <td class="cell" data-label="Heart-rate source">${d.hrSource}</td>
                <td class="cell tc" data-label="GPS">${this._yn(d.gps)}</td>
                <td class="cell tc" data-label="HRV">${this._yn(d.hrv)}</td>
                <td class="cell tc" data-label="Resting HR">${this._yn(d.restingHr)}</td>
                <td class="cell tc" data-label="Profile">${this._yn(d.profile)}</td>
                <td class="cell tc" data-label="Assumed max HR">${this._yn(d.maxHr)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  }

  _renderInputsTableB() {
    return `
      <div class="tbl-wrap">
        <table class="tbl">
          <thead>
            <tr><th>Input signal</th><th>How good it is (independent evidence)</th><th>Source</th></tr>
          </thead>
          <tbody>
            ${this._inputSignals.map(s => `
              <tr>
                <td class="spec-name" data-label="Input signal">${s.signal}</td>
                <td class="cell" data-label="How good it is"><span class="q-pill q-${s.quality}">${s.qLabel}</span><span class="cell-sub">${s.finding}</span></td>
                <td class="cell" data-label="Source"><span class="cell-sub">${s.source}</span></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  }

  // ── Section: sources accordion ──────────────────────────────────────────

  _renderSources() {
    return this._sources.map(s => `
      <details class="src">
        <summary>
          <span class="src-tag">${s.tag}</span>
          <span class="src-title">${s.title}</span>
        </summary>
        <div class="src-body">
          <p class="src-detail">${s.detail}</p>
          <p class="src-cite">${s.cite}</p>
          <a href="${s.url}" target="_blank" rel="noopener nofollow">View source ${this._icon('externalLink')}</a>
        </div>
      </details>`).join('');
  }

  _renderFAQ() {
    return this._faqs.map(f => `
      <details>
        <summary>${f.q}</summary>
        <div class="body">${f.a}</div>
      </details>`).join('');
  }

  // ── Main render ─────────────────────────────────────────────────────────

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const fitbitImg = 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png';
    const whoopImg = 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png';
    const appleImg = 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png';
    const garminImg = 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png';
    const healthConnectImg = 'https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png';
    const all = this._devices;

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" loading="lazy" />
            <span>Kygo Health</span>
          </a>
          <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" class="nav-cta-link" target="_blank" rel="noopener">
            Get Kygo App ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill"><span class="dot"></span> 9 DEVICES · LAB-VALIDATED ACCURACY</div>
              <h1>How accurate is your watch's <span class="hl">VO2 max?</span></h1>
              <p class="hero-lede">No wearable <strong>measures</strong> VO2 max — a lab CPET analyzes the gas in your breath; a watch only <strong>estimates</strong> from heart rate, GPS pace, and your profile. Here's how 9 devices actually stack up against the lab, brand by brand.</p>
            </div>
            <div class="hero-vis" aria-hidden="true">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> Avg bias vs lab</span>
                <span class="hero-vis-tag">method &gt; brand</span>
              </div>
              <svg viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet" font-family="'Space Grotesk',sans-serif">
                <!-- zero (lab) line -->
                <line x1="190" y1="40" x2="190" y2="250" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="4 5"/>
                <text x="190" y="270" fill="#94A3B8" font-size="13" font-weight="600" text-anchor="middle">LAB = 0</text>
                <!-- exercise bar (near zero, green) -->
                <text x="20" y="92" fill="#475569" font-size="14" font-weight="600">Exercise-based</text>
                <rect x="184" y="104" width="14" height="34" rx="3" fill="#22C55E"/>
                <g transform="translate(214,121)"><rect x="0" y="-15" width="92" height="30" rx="8" fill="#DCFCE7"/><text x="46" y="5" fill="#16A34A" font-size="15" font-weight="700" text-anchor="middle">−0.09</text></g>
                <!-- resting bar (overestimates, slate) -->
                <text x="20" y="182" fill="#475569" font-size="14" font-weight="600">Resting-based</text>
                <rect x="190" y="194" width="150" height="34" rx="3" fill="#94A3B8"/>
                <g transform="translate(352,211)"><rect x="0" y="-15" width="92" height="30" rx="8" fill="#F1F5F9"/><text x="46" y="5" fill="#475569" font-size="15" font-weight="700" text-anchor="middle">+2.17</text></g>
                <text x="300" y="304" fill="#94A3B8" font-size="12" text-anchor="middle">mL/kg/min — INTERLIVE meta-analysis</text>
              </svg>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">0</div><div class="lbl">Wearables that truly measure VO2 max</div></div>
            <div class="hero-stat"><div class="num">4</div><div class="lbl">Brands with independent validation</div></div>
            <div class="hero-stat"><div class="num">−0.09</div><div class="lbl">Exercise-based avg bias vs lab</div></div>
            <div class="hero-stat"><div class="num">+2.17</div><div class="lbl">Resting-based avg bias vs lab</div></div>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Method matters most</div>
            <h2>The one thing that <span class="hl">decides accuracy.</span></h2>
            <p class="lede">The INTERLIVE meta-analysis of consumer wearables found that <strong>how the device collects the data matters more than the brand.</strong></p>
          </div>
          <div class="framing-grid">
            <div class="framing-card good animate-on-scroll">
              <span class="framing-tag">${this._icon('activity')} Exercise-based</span>
              <span class="framing-stat">−0.09<small>mL/kg/min</small></span>
              <span class="framing-cap">More accurate</span>
              <p>Average bias vs lab when the estimate comes from an actual workout (HR-to-pace on an outdoor run). Essentially nil at the group level.</p>
            </div>
            <div class="framing-card animate-on-scroll">
              <span class="framing-tag">${this._icon('info')} Resting-based</span>
              <span class="framing-stat">+2.17<small>mL/kg/min</small></span>
              <span class="framing-cap">Overestimates</span>
              <p>Average overestimation when the estimate comes from resting HR + age/sex/weight, with no workout. Convenient, but reads high.</p>
            </div>
          </div>
          <div class="callout animate-on-scroll">${this._icon('info')} <span><strong>Either way, individual error is large</strong> — limits of agreement run roughly ±13 to 17 mL/kg/min for resting methods. That's why it's a trend tool, not a precise personal value. <em>Molina-García 2022 (INTERLIVE)</em></span></div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="kygo-cta-card animate-on-scroll">
            <div class="cta-pill"><span class="dot"></span> Free Forever Plan</div>
            <h3>Track your VO2 max trend — alongside <span>what you eat.</span></h3>
            <p>Kygo connects your wearable's data to your nutrition and training, so you see the full picture behind the number — not just one score that drifts.</p>
            <div class="cta-btn-row">
              <a class="btn btn-primary btn-lg" href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" target="_blank" rel="noopener" data-track-position="article-cta">${this._icon('apple')} Download for iOS</a>
              <a class="btn btn-primary btn-lg" href="https://www.kygo.app/android" target="_blank" rel="noopener" data-action="android-download" data-track-position="article-cta">${this._icon('android')} Download for Android</a>
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

      <section class="section bg-light" id="compare">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Side by side</div>
            <h2>Find &amp; compare <span class="hl">your device.</span></h2>
            <p class="lede">Filter by what matters to you. <em>Independently validated</em> means non-vendor, peer-reviewed VO2 max evidence exists.</p>
          </div>
          <div class="filters animate-on-scroll" data-chips>${this._renderChips()}</div>
          <div class="count animate-on-scroll" data-count>Showing <strong>${all.length}</strong> of ${all.length} devices</div>
          <div class="dev-grid animate-on-scroll" data-cards>${this._renderCards(all)}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <a class="blog-cta animate-on-scroll" href="https://www.kygo.app/post/most-accurate-vo2-max-wearable" target="_blank" rel="noopener">
            <span class="blog-cta-tag">Deep Dive</span>
            <div class="blog-cta-body">
              <div class="blog-cta-kicker">Read the full breakdown</div>
              <div class="blog-cta-title">The Most Accurate VO2 Max Wearable</div>
              <div class="blog-cta-sub">Which brands are actually validated, which overestimate, and how to read your own number — evidence-based.</div>
            </div>
            <span class="blog-cta-arrow">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Under the hood</div>
            <h2>How they <span class="hl">calculate it.</span></h2>
            <p class="lede">VO2 max is only as good as the signals fed in. None of these measure oxygen — they infer it from HR, GPS pace, and your profile.</p>
          </div>
          <h3 class="sub-head animate-on-scroll">What each device feeds in</h3>
          <div class="animate-on-scroll">${this._renderInputsTableA(all)}</div>
          <h3 class="sub-head animate-on-scroll">How good those inputs are</h3>
          <div class="animate-on-scroll">${this._renderInputsTableB()}</div>
          <div class="callout animate-on-scroll">${this._icon('info')} <span>The limiting input is heart rate <em>during the run</em> plus the assumed max HR (often just 220−age). That combination — not the sensor at rest — is the real ceiling on accuracy, which is why a chest strap helps and why very fit people get the biggest errors.</span></div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="bottomline animate-on-scroll">
            <div class="bottomline-tag">The bottom line</div>
            <p>A VO2 max estimate from a hard outdoor run with a chest strap — <strong>Garmin / Firstbeat, the only brand with solid independent validation (~5–7% error in general populations)</strong> — is the most trustworthy. <strong>Apple</strong> has two independent studies and both show it <em>underestimates</em> (~13–16%). <strong>Polar's</strong> resting test and <strong>Fitbit</strong> overestimate. <strong>Samsung, WHOOP, Oura, and Coros</strong> rely on company claims with little or no independent peer-reviewed VO2 max validation.</p>
            <p class="verify-note">${this._icon('info')} <strong>Verification note (triple-checked).</strong> Independent VO2 max validation exists only for Garmin, Apple, Polar, and Fitbit. A frequently-repeated "Galaxy Watch ±4.7 mL/kg/min" figure appears only on marketing/AI-content sites and could not be traced to a real indexed study — it is deliberately excluded here.</p>
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
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every claim, <span class="hl">traceable.</span></h2>
            <p class="lede">Each opened and checked against the primary record (PubMed / PMC / journal). Tap to expand. Verified June 2026.</p>
          </div>
          <div class="sources animate-on-scroll">${this._renderSources()}</div>
        </div>
      </section>

      <footer class="tool-footer">
        <div class="container">
          <a href="https://www.kygo.app" class="footer-brand" target="_blank" rel="noopener">
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
        const set = this._filters[chip.dataset.facet];
        const value = chip.dataset.value;
        if (set.has(value)) set.delete(value); else set.add(value);
        this._updateResults();
        return;
      }
    });
  }

  // ── Scroll animations ───────────────────────────────────────────────────

  _setupAnimations() {
    requestAnimationFrame(() => {
      const els = this.shadowRoot.querySelectorAll('.animate-on-scroll');
      if (!els.length || !('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('visible'));
        return;
      }
      if (this._observer) this._observer.disconnect();
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this._observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -50px 0px', threshold: 0.12 });
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
        'mainEntity': this._faqs.map(f => ({
          '@type': 'Question', 'name': f.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
        }))
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
        --ease-out: cubic-bezier(.16,1,.3,1);
        display: block;
        font-family: var(--font-body);
        color: var(--fg-1);
        background: var(--bg-canvas);
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }
      * { box-sizing: border-box; }
      a { color: inherit; text-decoration: none; }
      .ico { display: inline-flex; align-items: center; justify-content: center; }
      .ico svg { width: 1em; height: 1em; }

      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity .6s var(--ease-out), transform .6s var(--ease-out); }
      .animate-on-scroll.visible { opacity: 1; transform: none; }

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
      .hero-light h1 { font-family: var(--font-display); font-weight: 700; color: var(--fg-1); font-size: clamp(30px, 5.5vw, 58px); line-height: 1.05; letter-spacing: -0.02em; margin: 18px 0 18px; }
      .hero-light h1 .hl { color: var(--kygo-green); }
      .hero-lede { font-size: clamp(15px, 1.6vw, 18px); line-height: 1.55; color: var(--fg-2); max-width: 60ch; margin: 0; }
      .hero-lede strong { color: var(--fg-1); font-weight: 600; }
      .hero-vis { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 6px; background: linear-gradient(158deg, #ffffff 0%, #EEF2F7 100%); border: 1px solid var(--border-subtle); border-radius: 20px; padding: 16px 18px; aspect-ratio: 5 / 3; box-shadow: 0 16px 40px rgba(15,23,42,0.08); }
      .hero-vis::before { content: ''; position: absolute; top: -90px; right: -70px; width: 240px; height: 240px; background: radial-gradient(closest-side, rgba(34,197,94,0.16), transparent); pointer-events: none; }
      .hero-vis-head { position: relative; display: flex; align-items: center; justify-content: space-between; }
      .hero-vis-title { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: var(--fg-3); }
      .hero-vis-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 0 3px rgba(34,197,94,0.18); }
      .hero-vis-tag { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.3px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 4px 10px; border-radius: 999px; }
      .hero-vis svg { position: relative; width: 100%; flex: 1; min-height: 0; display: block; }
      @media (max-width: 880px) { .hero-vis { width: 100%; max-width: 440px; margin: 4px auto 0; } }
      .hero-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; border-top: 1px solid var(--border-subtle); padding-top: 24px; }
      @media (min-width: 720px) { .hero-stats { grid-template-columns: repeat(4, 1fr); gap: 24px; padding-top: 28px; } }
      .hero-stat .num { font-family: var(--font-display); font-weight: 700; font-size: clamp(28px, 4vw, 40px); line-height: 1; color: var(--kygo-green); letter-spacing: -0.02em; }
      .hero-stat .lbl { margin-top: 10px; color: var(--fg-3); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; line-height: 1.4; }

      /* Sections */
      .section { padding: 56px 20px; }
      @media (min-width: 720px) { .section { padding: 80px 24px; } }
      .section-inner { max-width: 1200px; margin: 0 auto; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
      .section.bg-white { background: #fff; }
      .section.bg-light { background: var(--kygo-light); }
      .section-head { margin-bottom: 28px; max-width: 720px; }
      .kicker { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 6px 12px; border-radius: 999px; }
      .section h2 { font-family: var(--font-display); font-weight: 600; font-size: clamp(26px, 4vw, 42px); line-height: 1.1; margin: 16px 0 10px; letter-spacing: -0.01em; }
      .section h2 .hl { color: var(--kygo-green); }
      .lede { color: var(--fg-2); font-size: 16px; line-height: 1.55; max-width: 60ch; margin: 0; }
      .lede strong { color: var(--fg-1); font-weight: 600; }
      .sub-head { font-family: var(--font-display); font-weight: 600; font-size: 16px; color: var(--fg-2); margin: 28px 0 14px; }

      /* Callout */
      .callout { margin-top: 24px; display: flex; gap: 12px; align-items: flex-start; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 16px 18px; font-size: 14px; line-height: 1.6; color: var(--fg-2); }
      .callout .ico { width: 18px; height: 18px; color: var(--kygo-green-dark); flex: none; margin-top: 2px; }
      .callout strong { color: var(--fg-1); font-weight: 600; }
      .callout em { font-style: normal; color: var(--fg-3); font-size: 12.5px; }

      /* Framing cards */
      .framing-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
      @media (min-width: 640px) { .framing-grid { grid-template-columns: 1fr 1fr; } }
      .framing-card { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 24px; display: flex; flex-direction: column; gap: 6px; }
      .framing-card.good { border-color: var(--kygo-green); box-shadow: 0 8px 24px rgba(34,197,94,0.10); }
      .framing-tag { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-display); font-weight: 600; font-size: 13px; color: var(--fg-2); }
      .framing-tag .ico { width: 16px; height: 16px; color: var(--fg-3); }
      .framing-card.good .framing-tag .ico { color: var(--kygo-green-dark); }
      .framing-stat { font-family: var(--font-display); font-weight: 700; font-size: clamp(34px, 6vw, 48px); line-height: 1; letter-spacing: -0.02em; color: var(--fg-2); margin-top: 8px; display: inline-flex; align-items: baseline; gap: 6px; }
      .framing-card.good .framing-stat { color: var(--kygo-green-dark); }
      .framing-stat small { font-size: 14px; font-weight: 500; color: var(--fg-3); }
      .framing-cap { font-family: var(--font-display); font-weight: 600; font-size: 12px; letter-spacing: 0.4px; text-transform: uppercase; color: var(--fg-3); }
      .framing-card.good .framing-cap { color: var(--kygo-green-dark); }
      .framing-card p { margin: 6px 0 0; font-size: 14px; line-height: 1.55; color: var(--fg-2); }

      /* Kygo CTA */
      .kygo-cta-card { background: var(--kygo-dark); border-radius: 24px; padding: 40px 24px; position: relative; overflow: hidden; color: #fff; text-align: center; display: flex; flex-direction: column; align-items: center; }
      @media (min-width: 720px) { .kygo-cta-card { padding: 56px 40px; } }
      .kygo-cta-card::before { content: ''; position: absolute; top: -160px; right: -160px; width: 520px; height: 520px; background: radial-gradient(closest-side, rgba(34,197,94,0.30), transparent); pointer-events: none; }
      .kygo-cta-card::after { content: ''; position: absolute; bottom: -180px; left: -180px; width: 480px; height: 480px; background: radial-gradient(closest-side, rgba(34,197,94,0.12), transparent); pointer-events: none; }
      .kygo-cta-card .cta-pill { position: relative; display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.16); color: #6EE7A0; padding: 6px 14px; border-radius: 999px; font-family: var(--font-display); font-size: 12px; font-weight: 600; border: 1px solid rgba(34,197,94,0.25); }
      .kygo-cta-card .cta-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 8px var(--kygo-green); }
      .kygo-cta-card h3 { position: relative; font-family: var(--font-display); font-weight: 600; color: #fff; font-size: clamp(26px, 4.5vw, 42px); line-height: 1.05; letter-spacing: -0.01em; margin: 18px 0 14px; max-width: 22ch; }
      .kygo-cta-card h3 span { color: var(--kygo-green); }
      .kygo-cta-card p { position: relative; color: rgba(255,255,255,0.72); font-size: clamp(14px, 1.6vw, 16px); line-height: 1.6; max-width: 56ch; margin: 0 auto 24px; }
      .kygo-cta-card .cta-btn-row { position: relative; display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; width: 100%; }
      @media (max-width: 560px) { .kygo-cta-card .cta-btn-row .btn-lg { width: 100%; justify-content: center; } }
      .kygo-cta-card .cta-works { position: relative; margin-top: 26px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: rgba(255,255,255,0.6); font-size: 13px; }
      .kygo-cta-card .cta-badges { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; justify-content: center; }
      .kygo-cta-card .cta-badges img { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); padding: 4px; object-fit: contain; }

      /* Filters */
      .filters { display: flex; flex-wrap: wrap; gap: 18px 28px; align-items: flex-end; padding: 20px 22px; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; margin-bottom: 18px; }
      .chip-group { display: flex; flex-direction: column; gap: 8px; }
      .chip-group-label { font-family: var(--font-display); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--fg-3); }
      .chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
      .filter-chip { font-family: var(--font-body); font-size: 13px; font-weight: 600; padding: 8px 14px; border-radius: 999px; border: 1.5px solid var(--border-subtle); background: #fff; color: var(--fg-2); cursor: pointer; transition: all .15s ease; }
      .filter-chip:hover { border-color: var(--kygo-green); color: var(--kygo-green-dark); }
      .filter-chip.active { background: var(--kygo-green); border-color: var(--kygo-green); color: #fff; }
      .filter-reset { align-self: flex-end; margin-left: auto; font-family: var(--font-body); font-size: 13px; font-weight: 600; padding: 8px 14px; border-radius: 999px; border: 0; background: transparent; color: var(--fg-3); cursor: pointer; }
      .filter-reset:hover { color: var(--kygo-green-dark); }
      .count { font-size: 13px; color: var(--fg-3); margin-bottom: 18px; }
      .count strong { color: var(--fg-1); }
      .empty-state { grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--fg-2); background: #fff; border: 1.5px dashed var(--border-subtle); border-radius: 18px; }
      .link-btn { border: 0; background: none; color: var(--kygo-green-dark); font-weight: 600; cursor: pointer; font-size: inherit; }

      /* Device cards */
      .dev-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
      @media (min-width: 620px) { .dev-grid { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 1000px) { .dev-grid { grid-template-columns: repeat(3, 1fr); } }
      .dev-card { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 20px; display: flex; flex-direction: column; gap: 14px; transition: all .25s var(--ease-out); }
      .dev-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
      .dev-card.is-validated { border-color: rgba(34,197,94,0.45); }
      .dev-head { display: flex; align-items: center; gap: 12px; }
      .dev-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--bg-raised); color: var(--fg-2); display: inline-flex; align-items: center; justify-content: center; flex: none; }
      .dev-icon .ico { width: 20px; height: 20px; }
      .dev-headtext { min-width: 0; flex: 1; }
      .dev-headtext h3 { font-family: var(--font-display); font-weight: 600; font-size: 17px; margin: 0; line-height: 1.2; }
      .dev-meta { font-size: 12px; color: var(--fg-3); }
      .sub-tag { display: inline-flex; align-items: center; gap: 4px; font-family: var(--font-display); font-size: 11px; font-weight: 600; padding: 4px 9px; border-radius: 999px; white-space: nowrap; }
      .sub-tag .ico { width: 11px; height: 11px; }
      .sub-tag.free { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .sub-tag.paid { background: var(--bg-raised); color: var(--fg-2); }
      .dev-pills { display: flex; flex-wrap: wrap; gap: 6px; }
      .m-pill { display: inline-flex; align-items: center; font-family: var(--font-display); font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 999px; }
      .m-pill.ex { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .m-pill.rest { background: var(--bg-raised); color: var(--fg-2); }
      .vbadge { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-display); font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 999px; }
      .vbadge .ico { width: 12px; height: 12px; }
      .vbadge.yes { background: var(--kygo-green); color: #fff; }
      .vbadge.mid { background: var(--bg-raised); color: var(--fg-2); }
      .vbadge.no { background: #fff; border: 1px solid var(--border-subtle); color: var(--fg-3); }
      .dev-finding { background: var(--bg-surface); border-radius: 12px; padding: 12px 14px; }
      .dev-label { font-family: var(--font-display); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--fg-3); }
      .dev-finding p { margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: var(--fg-1); }
      .dev-vendor { font-size: 13px; }
      .dev-vendor summary { list-style: none; cursor: pointer; font-family: var(--font-display); font-weight: 600; font-size: 12px; color: var(--fg-3); display: inline-flex; align-items: center; gap: 6px; }
      .dev-vendor summary::-webkit-details-marker { display: none; }
      .dev-vendor summary::after { content: '+'; font-size: 15px; line-height: 1; color: var(--kygo-green-dark); }
      .dev-vendor[open] summary::after { content: '−'; }
      .dev-vendor p { margin: 8px 0 0; font-size: 13px; line-height: 1.5; color: var(--fg-2); }
      .dev-facts { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
      .dev-facts li { display: grid; grid-template-columns: 22px 1fr; gap: 9px; font-size: 13px; line-height: 1.45; color: var(--fg-2); }
      .dev-facts .fct-ico { width: 22px; height: 22px; border-radius: 6px; background: var(--bg-raised); color: var(--fg-3); display: inline-flex; align-items: center; justify-content: center; }
      .dev-facts .fct-ico.ok { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .dev-facts .fct-ico .ico { width: 13px; height: 13px; }
      .dev-facts strong { color: var(--fg-1); font-weight: 600; display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; }
      .dev-amazon { margin-top: auto; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 14px; border-radius: 10px; border: 1.5px solid var(--kygo-green-light); background: rgba(34,197,94,0.06); color: var(--kygo-green-dark); font-family: var(--font-body); font-weight: 600; font-size: 13px; transition: all .15s ease; }
      .dev-amazon:hover { border-color: var(--kygo-green); background: rgba(34,197,94,0.12); }
      .dev-amazon .ico { width: 14px; height: 14px; transition: transform .15s; }
      .dev-amazon:hover .ico { transform: translateX(2px); }

      /* Tables */
      .tbl-wrap { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; overflow: hidden; }
      .tbl { width: 100%; border-collapse: collapse; font-family: var(--font-body); }
      .tbl thead th { text-align: left; padding: 14px 16px; font-family: var(--font-display); font-weight: 600; font-size: 12px; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.4px; background: var(--bg-raised); }
      .tbl tbody td { padding: 13px 16px; border-top: 1px solid var(--border-subtle); vertical-align: top; font-size: 13.5px; line-height: 1.5; }
      .tbl tbody tr:hover { background: var(--bg-surface); }
      .tbl .spec-name { font-weight: 600; color: var(--fg-1); }
      .tbl .tc { text-align: center; }
      .tbl .cell-sub { display: block; color: var(--fg-2); font-size: 13px; line-height: 1.5; margin-top: 4px; }
      .yn { display: inline-flex; align-items: center; justify-content: center; }
      .yn .ico { width: 16px; height: 16px; }
      .yn.yes { color: var(--kygo-green-dark); }
      .yn.no { color: var(--fg-3); }
      .yn.opt { font-size: 11px; font-weight: 600; color: var(--fg-2); background: var(--bg-raised); padding: 2px 8px; border-radius: 999px; }
      .q-pill { display: inline-block; font-family: var(--font-display); font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 999px; }
      .q-good { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .q-mixed { background: var(--bg-raised); color: var(--fg-2); }
      .q-poor { background: var(--kygo-dark); color: #fff; }
      @media (max-width: 760px) {
        .tbl thead { display: none; }
        .tbl tbody td { display: flex; justify-content: space-between; gap: 16px; padding: 8px 16px; border-top: 0; text-align: right; }
        .tbl tbody tr { display: block; padding: 12px 0; border-top: 1px solid var(--border-subtle); }
        .tbl tbody td::before { content: attr(data-label); font-family: var(--font-display); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; color: var(--fg-3); text-align: left; }
        .tbl .spec-name { padding-top: 12px; }
        .tbl .cell-sub { text-align: right; margin-top: 0; }
        .tbl .tc { justify-content: space-between; }
      }

      /* Bottom line */
      .bottomline { background: var(--kygo-dark); color: rgba(255,255,255,0.82); border-radius: 22px; padding: 32px 26px; position: relative; overflow: hidden; }
      @media (min-width: 720px) { .bottomline { padding: 44px 40px; } }
      .bottomline::before { content: ''; position: absolute; top: -120px; right: -120px; width: 360px; height: 360px; background: radial-gradient(closest-side, rgba(34,197,94,0.22), transparent); pointer-events: none; }
      .bottomline-tag { position: relative; display: inline-flex; font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: #6EE7A0; background: rgba(34,197,94,0.14); border: 1px solid rgba(34,197,94,0.25); padding: 6px 12px; border-radius: 999px; margin-bottom: 18px; }
      .bottomline p { position: relative; font-size: clamp(15px, 1.8vw, 18px); line-height: 1.65; margin: 0 0 14px; }
      .bottomline strong { color: #fff; font-weight: 600; }
      .bottomline em { font-style: italic; color: #fff; }
      .bottomline .verify-note { font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.55); display: flex; gap: 10px; align-items: flex-start; margin-top: 18px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.12); }
      .bottomline .verify-note .ico { width: 16px; height: 16px; color: #6EE7A0; flex: none; margin-top: 2px; }
      .bottomline .verify-note strong { color: rgba(255,255,255,0.85); }

      /* Blog CTA */
      .blog-cta { display: grid; grid-template-columns: auto 1fr auto; gap: 18px; align-items: center; background: linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(34,197,94,0.02) 100%); border: 1.5px solid var(--kygo-green-light); border-radius: 18px; padding: 22px; transition: all .25s var(--ease-out); color: var(--fg-1); }
      .blog-cta:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); transform: translateY(-2px); }
      .blog-cta-tag { display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 999px; background: #fff; border: 1.5px solid var(--kygo-green-light); color: var(--kygo-green-dark); font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; white-space: nowrap; }
      .blog-cta-body { min-width: 0; }
      .blog-cta-kicker { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--kygo-green-dark); margin-bottom: 4px; }
      .blog-cta-title { font-family: var(--font-display); font-size: clamp(15px, 2vw, 18px); font-weight: 600; color: var(--fg-1); line-height: 1.3; }
      .blog-cta-sub { font-size: 13px; color: var(--fg-2); margin-top: 4px; line-height: 1.5; }
      .blog-cta-arrow { width: 44px; height: 44px; border-radius: 50%; background: var(--kygo-green); color: #fff; display: inline-flex; align-items: center; justify-content: center; flex: none; box-shadow: 0 4px 12px rgba(34,197,94,0.30); }
      .blog-cta-arrow .ico { width: 20px; height: 20px; }
      @media (max-width: 600px) {
        .blog-cta { grid-template-columns: 1fr auto; grid-template-areas: 'tag arrow' 'body body'; padding: 18px; gap: 14px; }
        .blog-cta-tag { grid-area: tag; justify-self: start; }
        .blog-cta-arrow { grid-area: arrow; width: 40px; height: 40px; }
        .blog-cta-body { grid-area: body; }
      }

      /* FAQ + Sources (details) */
      .faq { display: flex; flex-direction: column; gap: 10px; }
      .faq details { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; padding: 4px 20px; transition: border-color .2s; }
      .faq details[open] { border-color: var(--kygo-green); }
      .faq summary { list-style: none; padding: 16px 0; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 14px; }
      .faq summary::-webkit-details-marker { display: none; }
      .faq summary::after { content: '+'; color: var(--kygo-green-dark); font-weight: 600; font-size: 22px; transition: transform .2s; line-height: 1; }
      .faq details[open] summary::after { content: '−'; }
      .faq .body { padding: 0 0 16px; color: var(--fg-2); font-size: 14px; line-height: 1.65; }

      .sources { display: grid; grid-template-columns: 1fr; gap: 10px; }
      @media (min-width: 760px) { .sources { grid-template-columns: 1fr 1fr; } }
      .src { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; padding: 4px 18px; transition: border-color .2s; }
      .src[open] { border-color: var(--kygo-green); }
      .src summary { list-style: none; padding: 14px 0; cursor: pointer; display: flex; flex-direction: column; gap: 6px; }
      .src summary::-webkit-details-marker { display: none; }
      .src-tag { align-self: flex-start; font-family: var(--font-display); font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 3px 9px; border-radius: 999px; }
      .src-title { font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--fg-1); line-height: 1.35; }
      .src-body { padding: 0 0 16px; }
      .src-detail { font-size: 13.5px; line-height: 1.6; color: var(--fg-2); margin: 0 0 8px; }
      .src-cite { font-size: 12px; color: var(--fg-3); margin: 0 0 10px; }
      .src-body a { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 600; color: var(--kygo-green-dark); }
      .src-body a .ico { width: 13px; height: 13px; }

      /* Footer */
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

      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
      }
    `;
  }
}

customElements.define('kygo-vo2max-accuracy', KygoVo2maxAccuracy);
