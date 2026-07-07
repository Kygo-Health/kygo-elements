/**
 * Kygo Health — Wearable Recovery & Readiness Scores Research
 * Tag: kygo-recovery-scores
 * Compare how 12 brands build a morning recovery/readiness score, explore the
 * factors that move it (grouped into what raises it, what lowers it, and
 * baseline modifiers), and see which scores are actually validated.
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

class KygoRecoveryScores extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._compareExpandedKey = null;
    this._categoryFilter = null;
    this._listExpandedKey = null;
    this._eventsBound = false;
  }

  connectedCallback() {
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, 'Wearable Recovery & Readiness Scores Research by Kygo Health. Compare how 12 brands build a single morning recovery score: WHOOP Recovery, Oura Readiness, Garmin Training Readiness, Fitbit/Pixel Daily Readiness, Samsung Energy Score, Polar Nightly Recharge (ANS Charge), Ultrahuman Dynamic Recovery, Coros Recovery Timer & Fatigue, Amazfit/Zepp HybridCharge, Suunto Body Resources, Apple (no native score), and RingConn Wellness Balance. They are NOT interchangeable — different inputs, baselines, and scales mean two devices on one wrist will disagree. The common spine is HRV + resting heart rate + sleep, differenced against a personal baseline; training-load scores (Coros, Suunto, Garmin) weight workload instead. Explore 35 factors that move your score — alcohol (HRV down ~15%), sleep loss, hard training, illness onset, late and high-glycemic meals, caffeine timing, dehydration, altitude, plus what raises it (consistent sleep, aerobic fitness, slow breathing, cold immersion) and evidence-graded supplements (magnesium, glycine, tart cherry, L-theanine, ashwagandha, saffron, omega-3, melatonin) and baseline modifiers (age, sex, body fat, menstrual cycle). Validation: only WHOOP and Oura have ever been tested against an external reference (WHOOP weak, Oura moderate); the signals (HRV/RHR) are validated in some devices but the composite scores are largely unvalidated black boxes. Cite the signal, never the score. Sourced from the De Gruyter composite-scores evaluation (Doherty/Altini 2025), Dial 2025 nocturnal HRV/RHR validation, brand documentation, and peer-reviewed factor and supplement research.');
  }

  _injectStructuredData() {
    if (document.querySelector('script[data-kygo-recovery-ld]')) return;

    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Recovery Score Explorer',
      'alternateName': 'Kygo Recovery & Readiness Score Comparison Tool',
      'description': 'Compare recovery and readiness scores across 12 wearables, see the 35 factors that move yours, and find which scores are actually validated. The scores are not interchangeable and largely unvalidated; the underlying HRV/RHR signals are validated in some devices.',
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'url': 'https://www.kygo.app/tools/recovery-score-explorer',
      'datePublished': '2026-06-11',
      'dateModified': '2026-06-11',
      'softwareVersion': '1.0',
      'inLanguage': 'en',
      'isAccessibleForFree': true,
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
      'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
      'featureList': '12-brand recovery-score comparison ranked by input coverage, per-brand deep dive (score name, scale, inputs, window, free vs paid), 35-factor explorer grouped into what raises / lowers / shifts your score with evidence grades, score-vs-signal validation table, peer-reviewed and vendor citations.',
      'keywords': 'wearable recovery score, readiness score comparison, WHOOP Recovery, Oura Readiness, Garmin Training Readiness, Body Battery, Fitbit Daily Readiness Score, Pixel Daily Readiness, Samsung Energy Score, Polar Nightly Recharge ANS Charge, Ultrahuman Dynamic Recovery, Coros Recovery Timer Fatigue EvoLab, Amazfit HybridCharge Zepp LifeLoad, Suunto Body Resources, Apple Watch recovery score, RingConn Wellness Balance, HRV RHR sleep recovery, recovery score validation, Dial 2025, De Gruyter composite scores Altini, what lowers recovery score alcohol, magnesium glycine tart cherry recovery supplements, recovery score baseline'
    };

    const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': this._faqs().map(f => ({ '@type': 'Question', 'name': f.q, 'acceptedAnswer': { '@type': 'Answer', 'text': f.a } })) };

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Kygo Health', 'item': 'https://www.kygo.app' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
        { '@type': 'ListItem', 'position': 3, 'name': 'Recovery Score Explorer', 'item': 'https://www.kygo.app/tools/recovery-score-explorer' }
      ]
    };

    [ld, faq, breadcrumb].forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-kygo-recovery-ld', '');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });
  }

  get _posts() {
    // Hub-and-spoke: each tool section deep-links its matching post so the tool feeds
    // the blog rather than competing with it. Primary "read the guide" CTA = spoke 1 (intake).
    const base = 'https://www.kygo.app/post/';
    return {
      lowers:     base + 'what-lowers-recovery-score',                  // spoke 1 — intake / factor explorer
      compared:   base + 'recovery-scores-compared-whoop-oura-garmin',  // spoke 2 — comparison matrix + per-brand
      trust:      base + 'can-you-trust-your-recovery-score'            // spoke 3 — validation
    };
  }

  _readMore(url, label) {
    return `<a class="section-readmore" href="${url}" target="_blank" rel="noopener">${label} <span aria-hidden="true">${this._icon('arrowRight')}</span></a>`;
  }

  _faqs() {
    return [
      { q: 'Can I compare a recovery score across different brands?', a: 'No. Every brand uses different inputs, baselines, and scales, so a "75" on one device does not mean a "75" on another. Polar is not even on a 0–100 scale (ANS Charge runs −10 to +10). Two devices on the same wrist will routinely disagree. Only the trend versus your own personal baseline is meaningful — never the cross-brand number.' },
      { q: 'Are wearable recovery scores actually validated?', a: 'Mostly no. Of 12 brands, only WHOOP and Oura have ever been tested against an external reference, and WHOOP\'s came out weak — the raw HRV carried the signal while the composite Recovery score added no consistent association. Oura has moderate support. Everyone else has at most component validation or vendor white papers, not an independent test of the score itself. There is no clinical gold standard for "recovery" the way polysomnography is for sleep, so brands validate their inputs, not the output. A recovery score is a modeled opinion, not a measurement.' },
      { q: 'Which brands have a free recovery score?', a: 'Free: Garmin Training Readiness, Fitbit/Pixel Daily Readiness (free since app v4.27 — most articles still wrongly say "Premium required"), Samsung Energy Score, Polar Nightly Recharge, Ultrahuman Dynamic Recovery, Coros, Amazfit HybridCharge, Suunto Body Resources, and RingConn. Paid: WHOOP (band requires a membership) and Oura (membership ~$5.99/mo). Apple has no native recovery score at all — third-party apps fill the gap.' },
      { q: 'What lowers your recovery score the most?', a: 'Alcohol is the biggest single controllable hit — Oura\'s 600,000-member data shows HRV down about 15% (~10.8 ms) and heart rate up about 9.6%, and WHOOP found a single drink cuts next-day recovery roughly 8%. Sleep loss, hard training or overreaching, and the onset of illness are the other strong-evidence drops. Late or high-glycemic meals near bed, evening caffeine, dehydration, altitude, and nicotine are moderate hits.' },
      { q: 'Does the Apple Watch have a recovery score?', a: 'No native one. Apple tracks every input a recovery score needs — HRV, resting heart rate, sleep stages, the watchOS 26 Sleep Score and Training Load, and the Vitals app — but does not output a recovery score. Third-party apps like Athlytic, Bevel, Gentler Streak, and Training Today compute their own scores on top. It is the biggest install base with no first-party score.' },
      { q: 'Which supplements actually help recovery?', a: 'The defensible ones, by evidence: magnesium (bisglycinate), glycine, tart cherry, L-theanine, ashwagandha, and saffron. Omega-3 (DHA) modestly lowers resting heart rate. Melatonin is a circadian timing aid, not a recovery booster. Do not rely on the trendy isolated apigenin (it has no human sleep RCT — the evidence is for whole chamomile extract), or on valerian, GABA, CBD, or creatine as recovery aids. Trial quality across this whole category is often low; doses are study doses, not recommendations, and this is not medical advice.' },
      { q: 'Why do my two wearables show different recovery numbers?', a: 'Because they are not measuring the same thing the same way. The common spine is HRV + resting heart rate + sleep differenced against a personal baseline, but each brand weights those differently, uses a different window (Polar reads only the first ~4 hours of sleep; Garmin and Coros lean on training load), and anchors to a different baseline length. The scores are inferences, not measurements, so disagreement is expected.' },
      { q: 'How does what I eat and drink affect my recovery score?', a: 'Alcohol, late or heavy meals within ~3 hours of bed, high-glycemic spikes near bedtime, evening caffeine, and dehydration all move the HRV + RHR + sleep signals your score is built on. These are the levers a food-logging user can actually see and change, and the brands\' own blogs tend to underplay them — which is exactly why connecting nutrition to your recovery trend is the highest-value angle.' }
    ];
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  get _devices() {
    const ACC = '#475569';
    return {
      whoop: {
        name: 'WHOOP',
        amazon: 'https://amzn.to/4rRoziQ',
        scoreName: 'Recovery',
        modelLine: 'Recovery · 1–100% (green/yellow/red) · membership',
        sensors: { hrv: true, rhr: true, sleep: true, temp: false, rr: true, load: false, subj: false },
        free: false,
        algorithm: 'A single morning percentage built from four inputs — HRV (the largest driver), resting heart rate, sleep performance, and respiratory rate — all measured during sleep and scored against your own personal baseline rather than population norms. Color bands: green 67–99%, yellow 34–66%, red 1–33% (the average member sits around 58%). Designed to be paired with Strain: "match today\'s strain to your recovery." Note: SpO₂ and skin temperature live in WHOOP\'s Health Monitor and are NOT stated to feed Recovery — they only provide illness context.',
        scale: '1–100% · green 67–99 / yellow 34–66 / red 1–33',
        inputs: 'HRV (largest driver), resting heart rate, sleep performance, respiratory rate',
        window: 'During sleep',
        strength: 'The four-input model is lean and transparent by consumer standards, and Recovery is one of only two scores ever tested against an external reference.',
        limitation: 'Requires a paid membership. When tested in NCAA swimmers, the raw HRV carried the signal — the composite Recovery score did not add to it.',
        validation: { score: 'weak', signal: 'moderate', evidence: 'Tested in NCAA swimmers (Lundstrom 2024): raw HRV carried the signal, the composite did not. Signals OK (Dial 2025, HRV CCC 0.94).' },
        color: ACC
      },
      oura: {
        name: 'Oura Ring',
        amazon: 'https://amzn.to/4aF93jj',
        scoreName: 'Readiness',
        modelLine: 'Readiness · 0–100 · 9 contributors · membership',
        sensors: { hrv: true, rhr: true, sleep: true, temp: true, rr: false, load: true, subj: false },
        free: false,
        algorithm: 'A 0–100 morning score built from NINE contributors: resting heart rate, HRV balance (past 14 days vs your 3-month average), body temperature, recovery index (how much sleep you got AFTER your HR hit its overnight low — 6h+ is optimal), sleep, sleep balance, sleep regularity, previous-day activity, and activity balance. "Long-term" means your past two months. Ratings: 85+ optimal, 70–84 good, 60–69 fair, under 60 pay attention.',
        scale: '0–100 · 85+ optimal / 70–84 good / 60–69 fair / <60 pay attention',
        inputs: 'RHR, HRV balance, body temp, recovery index, sleep, sleep balance, sleep regularity, prev-day activity, activity balance',
        window: 'Overnight',
        strength: 'Finger-site temperature plus nine contributors is the richest input set in the market, and Oura\'s signals are the most accurate tested (Dial CCC 0.97–0.99). The only score with even moderate independent support.',
        limitation: 'Needs a paid membership (~$5.99/mo). Validation is "moderate," and some of the supporting work is Oura-affiliated.',
        validation: { score: 'moderate', signal: 'strong', evidence: 'Readiness correlated with subjective recovery in endurance athletes (2025). Signals most accurate tested — Dial 2025, HRV CCC 0.97–0.99.' },
        color: ACC
      },
      garmin: {
        name: 'Garmin',
        amazon: 'https://amzn.to/4aF8l5D',
        scoreName: 'Training Readiness',
        modelLine: 'Training Readiness · 0–100 · Body Battery is separate · free',
        sensors: { hrv: true, rhr: false, sleep: true, temp: false, rr: false, load: true, subj: false },
        free: true,
        algorithm: 'A 0–100 continuous score that blends your overnight recovery with your training workload: sleep score, recovery time, HRV status, acute load, sleep history (3 nights), and stress history (3 days). Body Battery is a SEPARATE Firstbeat energy gauge, a common point of confusion. The 6th Training Readiness factor is sleep history, NOT Body Battery. Available on Forerunner / Fenix / Epix / Venu X1.',
        scale: '0–100 (continuous)',
        inputs: 'Sleep score, recovery time, HRV status, acute load, sleep history (3 nights), stress history (3 days)',
        window: 'Continuous',
        strength: 'The most training-load-oriented of the mainstream scores. Built for athletes managing workload, and free.',
        limitation: 'No independent validation of the composite. Garmin\'s nocturnal HRV/RHR were poor in Dial 2025 (excluded from the RHR analysis on methodology grounds).',
        validation: { score: 'none', signal: 'poor', evidence: 'Firstbeat white papers cover components, not the composite. Nocturnal HRV poor (Dial 2025).' },
        color: ACC
      },
      fitbit: {
        name: 'Fitbit / Pixel',
        amazon: 'https://amzn.to/3ZPkHDc',
        scoreName: 'Daily Readiness Score',
        modelLine: 'Daily Readiness · 1–100 · free since app v4.27',
        sensors: { hrv: true, rhr: true, sleep: true, temp: false, rr: false, load: false, subj: false },
        free: true,
        algorithm: 'A 1–100 overnight score from three inputs: HRV (from sleep), sleep over the past week, and resting heart rate. The old "activity" input was removed and replaced by RHR. Seven nights to set a baseline (about a month for the full picture). Labels: low 1–29, moderate 30–64, high 65–100. NO LONGER Premium-gated — free to all users on app v4.27+; Premium only adds workout recommendations.',
        scale: '1–100 · low 1–29 / moderate 30–64 / high 65–100',
        inputs: 'HRV (from sleep), sleep (past week), resting heart rate',
        window: 'Overnight',
        strength: 'Free, simple, three-input model. Most third-party articles still wrongly say "Premium required" — it isn\'t.',
        limitation: 'No published independent test of the score ("built on research"). Signal validation is moderate and component-level only.',
        validation: { score: 'none', signal: 'moderate', evidence: 'No published independent test of the score. Signal-level validation only.' },
        color: ACC
      },
      samsung: {
        name: 'Samsung',
        amazon: 'https://amzn.to/3PUMS23',
        scoreName: 'Energy Score',
        modelLine: 'Energy Score · 0–100 · Galaxy Watch 7 / Ultra+ · free',
        sensors: { hrv: true, rhr: true, sleep: true, temp: false, rr: false, load: true, subj: false },
        free: true,
        algorithm: 'A 0–100 overnight score from activity, sleep, sleeping heart rate, and sleeping HRV, with age and gender weighting the factors. Activity uses an Acute:Chronic Workload Ratio; sleep uses an "energy reservoir" model. Built with Prof. Patrick O\'Connor (University of Georgia) as "Overall Capacity" — physical plus cognitive. Needs roughly 24h of wear. Galaxy Watch 7 / Ultra (Wear OS 5).',
        scale: '0–100',
        inputs: 'Activity, sleep, sleeping HR, sleeping HRV (age & gender weighted)',
        window: 'Overnight + 24h wear',
        strength: 'Built with an academic collaborator and free across the Galaxy Watch line.',
        limitation: 'The only validation is company-affiliated (UGA correlated it to cognitive-test performance) — no independent test of the score.',
        validation: { score: 'none', signal: 'yes', evidence: 'Only company-affiliated work (UGA, cognitive performance). No independent score test.' },
        color: ACC
      },
      polar: {
        name: 'Polar',
        amazon: 'https://amzn.to/4rqpdnL',
        scoreName: 'Nightly Recharge',
        modelLine: 'Nightly Recharge · ANS Charge −10 to +10 · free',
        sensors: { hrv: true, rhr: true, sleep: true, temp: false, rr: true, load: false, subj: false },
        free: true,
        algorithm: 'The only brand not on a 0–100 scale. Nightly Recharge combines ANS Charge and Sleep Charge. ANS Charge is the autonomic piece: heart rate, HRV, and breathing measured over the first ~4 hours of sleep versus your 28-day usual level. Three nights to baseline.',
        scale: 'ANS Charge −10 to +10 (plus a Sleep Charge component)',
        inputs: 'HR, HRV, breathing over the first ~4h of sleep, vs a 28-day baseline',
        window: 'First 4h of sleep',
        strength: 'The 28-day overnight baseline is one of the most personalized windows in the market; pairs with the H10 chest strap (the lab reference for most wearable studies).',
        limitation: 'Wrist nocturnal RHR/HRV were poor in Dial 2025 (RHR CCC 0.86). No independent validation of the composite.',
        validation: { score: 'none', signal: 'poor', evidence: 'Sleep staging validated vs PSG, but not the composite. Nocturnal RHR poor (Dial 2025, CCC 0.86).' },
        color: ACC
      },
      ultrahuman: {
        name: 'Ultrahuman',
        scoreName: 'Dynamic Recovery',
        modelLine: 'Dynamic Recovery · 0–100% · re-adjusts intraday · free',
        sensors: { hrv: true, rhr: true, sleep: true, temp: true, rr: false, load: false, subj: false },
        free: true,
        algorithm: 'A 0–100% score from five factors — Sleep Quotient, Stress Rhythm, Temperature, RHR, and HRV Form — that re-adjusts through the day rather than locking a single morning number. 85+ is "good." No mandatory subscription, which is its wedge against Oura.',
        scale: '0–100% · 85+ good',
        inputs: 'Sleep, stress rhythm, temperature, RHR, HRV',
        window: 'Overnight + daytime',
        strength: 'Re-adjusts intraday and has no mandatory subscription.',
        limitation: 'No independent validation of the score located; only signal-level HRV validation.',
        validation: { score: 'none', signal: 'moderate', evidence: 'No independent score validation located. Some signal-level HRV validation only.' },
        color: ACC
      },
      coros: {
        name: 'COROS',
        amazon: 'https://amzn.to/4rkOv6I',
        scoreName: 'Recovery Timer + Fatigue',
        modelLine: 'Recovery Timer + Fatigue (EvoLab) · training-load only · free',
        sensors: { hrv: false, rhr: false, sleep: false, temp: false, rr: false, load: true, subj: false },
        free: true,
        algorithm: 'The genuine outlier: NO single physiological recovery score. Recovery Timer is a percentage countdown to full recovery (0–29 rest, 30–89 easy, 90–100 hard, capped at 96h). Fatigue (0–100) = Base Fitness minus Load Impact. Purely training-load and fitness math — no HRV, temperature, or sleep in the model. Inputs: training load, base fitness, load impact, marathon level, running efficiency.',
        scale: 'Recovery Timer = % to full recovery · Fatigue 0–100',
        inputs: 'Training load, base fitness, load impact, marathon level, running efficiency. NO HRV / temp / sleep',
        window: 'Continuous',
        strength: 'Honest, performance-framed training-load math for endurance athletes — no "wellness" overreach.',
        limitation: 'Not a physiological recovery score at all, so there is nothing to validate as one. The De Gruyter paper lists its composite as "Daily Stress."',
        validation: { score: 'na', signal: 'na', evidence: 'Not a recovery score, so nothing to validate as one. No HRV input.' },
        color: ACC
      },
      amazfit: {
        name: 'Amazfit / Zepp',
        amazon: 'https://amzn.to/4fHVnYW',
        scoreName: 'HybridCharge',
        modelLine: 'HybridCharge · 0–100 · replaced BioCharge May 2026 · free',
        sensors: { hrv: true, rhr: true, sleep: true, temp: false, rr: false, load: true, subj: true },
        free: true,
        algorithm: 'Zepp app 10.4.0 (May 2026) replaced BioCharge and Readiness with HybridCharge — the first mainstream score to blend sensor data (sleep, HRV, RHR, activity) with subjective daily self-report (LifeLoad: sleep, physical state, mood, cognitive load, nutrition, environment, each rated low/med/high) plus an RPE-based "Internal Load." About 7 days to calibrate. No primary Amazfit documentation is published yet (strong secondary sourcing only).',
        scale: '0–100',
        inputs: 'Sensor data (sleep, HRV, RHR, activity) PLUS subjective self-report (LifeLoad)',
        window: 'Continuous + daily log',
        strength: 'The first mainstream score to formally blend sensor data with structured subjective self-report.',
        limitation: 'Brand-new (May 2026) with no primary documentation and no validation; treat as a longitudinal-only tool.',
        validation: { score: 'none', signal: 'none', evidence: 'Brand-new (May 2026). No validation located for the score or its signals.' },
        color: ACC
      },
      suunto: {
        name: 'Suunto',
        amazon: 'https://amzn.to/4fZD5Cx',
        scoreName: 'Body Resources',
        modelLine: 'Body Resources · 0–100 gauge · free',
        sensors: { hrv: true, rhr: false, sleep: true, temp: false, rr: false, load: true, subj: false },
        free: true,
        algorithm: 'Same Firstbeat lineage as Garmin\'s Body Battery: autonomic balance read through HRV, plus activity and sleep. Shows states (active, inactive, recovering, stressed) and a depleting/recharging level rather than a once-daily morning score. Requires daily HR enabled.',
        scale: '0–100 (gauge)',
        inputs: 'Firstbeat HRV-derived autonomic balance, activity, sleep',
        window: 'Continuous',
        strength: 'A continuous Firstbeat autonomic gauge for outdoor athletes.',
        limitation: 'No independent validation located; rides on Firstbeat\'s vendor lineage.',
        validation: { score: 'none', signal: 'na', evidence: 'No independent validation located. Rides on Firstbeat lineage (vendor).' },
        color: ACC
      },
      apple: {
        name: 'Apple Watch',
        amazon: 'https://amzn.to/4rUcGst',
        scoreName: 'No native score',
        modelLine: 'No native recovery score · third-party apps fill the gap',
        sensors: { hrv: true, rhr: true, sleep: true, temp: true, rr: false, load: true, subj: false },
        free: true,
        algorithm: 'Apple tracks every input a recovery score needs — HRV, resting heart rate, sleep stages, wrist temperature (Series 8+ / Ultra, surfaced in the Vitals app), and the watchOS 26 Sleep Score and Training Load — but does NOT output a recovery score. Third-party apps fill the gap: Athlytic, Bevel, Gentler Streak, Training Today. It is the biggest install base with no first-party score — a content and SEO opportunity.',
        scale: 'n/a (no native score)',
        inputs: 'Tracks HRV, RHR, sleep, wrist temperature, Sleep Score, Training Load — but outputs no score',
        window: 'n/a',
        strength: 'Its signals (especially HRV/RHR) are well validated, and the third-party ecosystem is the largest anywhere.',
        limitation: 'No first-party recovery score exists — every "Apple recovery score" you see is a third-party computation.',
        validation: { score: 'na', signal: 'yes', evidence: 'No native score to validate. Signals well validated at the signal level.' },
        color: ACC
      },
      ringconn: {
        name: 'RingConn',
        amazon: 'https://amzn.to/4e5fGyj',
        scoreName: 'Wellness Balance',
        modelLine: 'Wellness Balance · 4 petals (not a true score) · free',
        sensors: { hrv: true, rhr: true, sleep: true, temp: false, rr: false, load: true, subj: false },
        free: true,
        algorithm: 'Not a true readiness score — a "Wellness Balance" flower with petals for Sleep, Activity, Relax Status, and Vitals Status. A dashboard, not a single composite recovery number. Positioned as an Oura competitor, so users will ask about it.',
        scale: '4 petals / sub-scores (no single composite number)',
        inputs: 'Sleep, Activity, Relax status, Vitals status',
        window: 'Overnight + continuous',
        strength: 'Sleep and heart rate validated vs PSG (a vendor-cited IEEE study); a low-cost Oura alternative.',
        limitation: 'Not a composite recovery score — a petal dashboard, so there is no single number to track or validate.',
        validation: { score: 'na', signal: 'yes', evidence: 'Not a recovery score. Sleep/HR validated vs PSG (vendor-cited IEEE study).' },
        color: ACC
      }
    };
  }

  get _signalMeta() {
    return {
      hrv:   { label: 'HRV',           short: 'HRV' },
      rhr:   { label: 'Resting HR',    short: 'RHR' },
      sleep: { label: 'Sleep',         short: 'Sleep' },
      temp:  { label: 'Body Temp',     short: 'Temp' },
      rr:    { label: 'Resp. Rate',    short: 'Resp' },
      load:  { label: 'Training Load', short: 'Load' },
      subj:  { label: 'Self-report',   short: 'Subj.' }
    };
  }

  get _factorCategories() {
    // Chips for the filter row. Nutrition consolidates the intake factors —
    // food/hydration, substances (alcohol, caffeine, nicotine, THC) and supplements.
    return [
      { key: 'sleep',     label: 'Sleep',     icon: 'moon',     cats: ['sleep'] },
      { key: 'nutrition', label: 'Nutrition', icon: 'droplet',  cats: ['nutrition', 'substances', 'supplements'] },
      { key: 'training',  label: 'Training',  icon: 'dumbbell', cats: ['training'] },
      { key: 'stress',    label: 'Stress',    icon: 'brain',    cats: ['stress'] },
      { key: 'baseline',  label: 'Baseline',  icon: 'target',   cats: ['baseline'] }
    ];
  }

  // Granular label for a factor's own sub-category (shown as the card eyebrow).
  _catLabel(catKey) {
    return ({
      sleep: 'Sleep', substances: 'Substances', nutrition: 'Nutrition',
      supplements: 'Supplement', training: 'Training', stress: 'Stress', baseline: 'Baseline'
    })[catKey] || '';
  }

  get _allFactors() {
    // Source: Wearable_Recovery_Readiness_Scores_Research (v1.6), full-verified
    // 2026-06-11. direction: positive = raises your score, negative = lowers it,
    // modifier = shifts your baseline (neither good nor bad). impact = how much it
    // moves the number; evidence = strength of the underlying research.
    const SRC = {
      alcoholOura:   { url: 'https://ouraring.com/blog/how-does-alcohol-impact-oura-members/', label: 'Oura — alcohol’s impact on members’ sleep & HRV (brand data, 600k members)' },
      alcoholWhoop:  { url: 'https://www.whoop.com/us/en/thelocker/alcohol-affects-body-hrv-sleep/', label: 'WHOOP — alcohol effects on HRV, sleep & recovery (brand data)' },
      alcoholHrv:    { url: 'https://journals.physiology.org/doi/full/10.1152/ajpheart.00700.2009', label: 'Dose-related effects of alcohol on HRV (Am J Physiol Heart Circ, 2009)' },
      trainingLoad:  { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6026827/', label: 'Next-day recovery after acute low vs high training load (PMC6026827)' },
      sleepDep:      { url: 'https://www.frontiersin.org/journals/neurology/articles/10.3389/fneur.2025.1556784/full', label: 'Sleep deprivation & HRV: systematic review & meta-analysis (Frontiers, 2025)' },
      feverClassic:  { url: 'https://pubmed.ncbi.nlm.nih.gov/2424378/', label: 'Fever & cardiac rhythm: ~8.5 bpm per 1°C (PubMed, classic)' },
      illnessSensor: { url: 'https://www.mdpi.com/1424-8220/24/6/1818', label: 'Wearable fever/illness detection physiology (MDPI Sensors, 2024)' },
      stressPersist: { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6821413/', label: 'Persistent effect of acute psychosocial stress on HRV (Egyptian Heart J, PMC)' },
      mealsLate:     { url: 'https://pubmed.ncbi.nlm.nih.gov/33426778/', label: 'Late-night eating: sleep, HPA axis & autonomic function (PubMed, 2021)' },
      glucoseSleep:  { url: 'https://pubmed.ncbi.nlm.nih.gov/38042028/', label: 'Heart rate variations & glucose fluctuations during sleep (PubMed, 2023)' },
      glucoseGI:     { url: 'https://www.tandfonline.com/doi/full/10.1080/07420528.2024.2428203', label: 'High-glycemic-index breakfast & HRV by chronotype (Chronobiology Int, 2024)' },
      caffeineSleep: { url: 'https://pubmed.ncbi.nlm.nih.gov/16184581/', label: 'Caffeine effects on heart rate & QT variability during sleep (PubMed, 2005)' },
      hydration:     { url: 'https://pubmed.ncbi.nlm.nih.gov/25726222/', label: 'Hydration status affects RMR & HRV (PubMed, 2015)' },
      altitude:      { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12812737/', label: 'Acute high-altitude exposure & HRV: meta-analysis (PMC)' },
      bedroomTemp:   { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12751657/', label: 'Bedroom temperature & HRV in older adults (PMC)' },
      circadian:     { url: 'https://pubmed.ncbi.nlm.nih.gov/9005885/', label: 'Circadian HRV rhythm in shift workers (PubMed)' },
      nicotine:      { url: 'https://academic.oup.com/ntr/article/13/5/369/1168539', label: 'Single 4 mg nicotine dose reduces HRV in nonsmokers (Nicotine & Tobacco Research)' },
      thcWhoop:      { url: 'https://www.whoop.com/us/en/thelocker/impact-of-marijuana-sleep-resting-heart-rate-hrv/', label: 'WHOOP — marijuana (THC) effects on sleep, RHR & HRV (brand data)' },
      thcSleep:      { url: 'https://academic.oup.com/sleep/article/46/Supplement_1/A59/7181640', label: 'THC before bed reduces nocturnal parasympathetic control (SLEEP, 2023)' },
      breathing:     { url: 'https://www.sciencedirect.com/science/article/abs/pii/S0149763422002007', label: 'Voluntary slow breathing & HRV: systematic review & meta-analysis (2022)' },
      coldImmersion: { url: 'https://onlinelibrary.wiley.com/doi/abs/10.1002/pri.70033', label: 'Cold water immersion, HRV & post-exercise recovery: systematic review (2025)' },
      saunaPos:      { url: 'https://www.sciencedirect.com/science/article/abs/pii/S0965229919301943', label: 'Recovery from sauna favorably modulates cardiac autonomic system (J Sci Med Sport)' },
      saunaNull:     { url: 'https://physoc.onlinelibrary.wiley.com/doi/abs/10.14814/phy2.70449', label: 'Regular post-exercise sauna does NOT improve HRV: RCT (Physiological Reports, 2025)' },
      hrvDeterm:     { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6686273/', label: 'Age, sex & fitness differences in HRV (PMC6686273)' },
      bodyfat:       { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3743431/', label: 'Body fat percentage & HRV sympathovagal balance (PMC3743431)' },
      menstrual:     { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5588411/', label: 'Menstrual cycle & cardiac autonomic function / HRV (PMC5588411)' },
      omega3:        { url: 'https://www.nature.com/articles/s41430-017-0052-3', label: 'Omega-3 & resting heart rate: meta-analysis of RCTs (Eur J Clin Nutr, 2018)' },
      magMeta:       { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8053283/', label: 'Magnesium for insomnia: systematic review & meta-analysis (Mah 2021, PMC)' },
      magOura:       { url: 'https://www.tandfonline.com/doi/full/10.2147/NSS.S524348', label: 'Magnesium bisglycinate in adults with poor sleep: RCT (Nature & Science of Sleep, 2025)' },
      glycine:       { url: 'https://onlinelibrary.wiley.com/doi/10.1111/j.1479-8425.2007.00262.x', label: 'Glycine improves sleep quality: PSG evidence (Sleep & Biological Rhythms, 2007)' },
      tartCherry:    { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12438961/', label: 'Montmorency tart cherry & sleep: systematic review (PMC)' },
      lTheanine:     { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6836118/', label: 'L-theanine reduces stress responses & improves sleep: RCT (PMC)' },
      ashwagandha:   { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6750292/', label: 'Ashwagandha reduces cortisol & anxiety: RCT (PMC)' },
      saffron:       { url: 'https://pubmed.ncbi.nlm.nih.gov/35325766/', label: 'Saffron & sleep quality: meta-analysis of 21 RCTs (Sleep Medicine, 2022)' },
      chamomile:     { url: 'https://onlinelibrary.wiley.com/doi/10.1002/ptr.6349', label: 'Chamomile for sleep & anxiety: systematic review & meta-analysis (Phytotherapy Research)' },
      apigenin:      { url: 'https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2024.1359176/full', label: 'Apigenin at the sleep/aging intersection — notes NO human sleep RCT (Frontiers, 2024)' },
      melatonin:     { url: 'https://www.nature.com/articles/s44323-024-00007-z', label: 'Melatonin in the cardiovascular system, dose-dependent effects (npj Biol Timing & Sleep, 2024)' },
      nitrate:       { url: 'https://journals.physiology.org/doi/full/10.1152/ajpheart.00163.2017', label: 'Beetroot nitrate decreases central sympathetic outflow: RCT (Am J Physiol, 2017)' },
      valerian:      { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4394901/', label: 'Valerian for sleep: systematic review & meta-analysis (Am J Medicine)' }
    };

    return [
      // ---- WHAT LOWERS YOUR SCORE (negative) ----
      { key: 'alcohol', cat: 'substances', name: 'Alcohol', direction: 'negative', impact: 'high', evidence: 'Strong',
        plainEnglish: 'The biggest single controllable hit to your score. Even one drink suppresses your nervous system through the night, and the effect is dose-dependent — mixed drinks and liquor are the worst. If your number suddenly tanks with no other explanation, look here first.',
        effect: 'HRV down ~15% (~10.8 ms) and HR up ~9.6% [Oura, 600k-member data]; a single drink: HRV −7 ms, RHR +3 bpm, next-day recovery ~8% lower [WHOOP data].',
        mechanism: 'Alcohol suppresses parasympathetic (vagal) activity and disrupts deep sleep, and the liver keeps sympathetic tone elevated for hours after the last drink.',
        whatToDo: 'Treat each drink as an overnight cost. A few alcohol-free nights per week recover the most; cut off 3+ hours before bed if you do drink.',
        source: SRC.alcoholOura },
      { key: 'sleep-loss', cat: 'sleep', name: 'Sleep loss / sleep debt', direction: 'negative', impact: 'high', evidence: 'Strong',
        plainEnglish: 'The most common reason a recovery score looks bad even when you did nothing else wrong. One short night shows up the next morning — and a pattern of them compounds.',
        effect: 'RMSSD down, RHR up; persists into the next day. One 4-hour night can take 2–3 nights to fully clear.',
        mechanism: 'Short or fragmented sleep stops the nightly autonomic reset, so you wake up locked in sympathetic dominance with cortisol still elevated.',
        whatToDo: 'Protect 7–9 hours with consistent times. Don\'t try to "make up" sleep on weekends — regularity beats catch-up.',
        source: SRC.sleepDep },
      { key: 'overreaching', cat: 'training', name: 'Hard training / overreaching', direction: 'negative', impact: 'high', evidence: 'Strong',
        plainEnglish: 'Pushing past your recovery capacity drops the score — and on training-load brands this is the intended signal, not a bug. Watch for a multi-day decline, not how tired you feel today.',
        effect: 'Large RHR rise and a moderate HRV drop (rMSSD, lnSDNN) the next day. A 5–7 day decline signals functional overreaching.',
        mechanism: 'Accumulated load without recovery keeps cortisol and sympathetic tone elevated, so vagal tone and HRV fall together.',
        whatToDo: 'If your 7-day trend is down, take a deload — easier sessions, more sleep, more protein — until it rebounds.',
        source: SRC.trainingLoad },
      { key: 'illness', cat: 'stress', name: 'Illness onset', direction: 'negative', impact: 'high', evidence: 'Strong',
        plainEnglish: 'A sudden red day can precede feeling sick by 1–3 days. If the score drops with no lifestyle cause, your body may already be fighting something.',
        effect: 'RHR rises, skin temperature rises, HRV drops — often 1–3 days before symptoms. A 1°C temperature rise adds about 8.5 bpm (classic 1986 figure; a 2019 study of 4,493 patients found ~7.2).',
        mechanism: 'Cytokines and inflammatory signaling activate the sympathetic nervous system and raise metabolic and thermoregulatory demand.',
        whatToDo: 'Take the drop as a real signal — rest, hydrate, and skip hard training even before you "feel" sick. (Exact night-by-night staging varies and isn\'t from a controlled study.)',
        source: SRC.feverClassic },
      { key: 'psych-stress', cat: 'stress', name: 'Psychological stress', direction: 'negative', impact: 'med', evidence: 'Moderate–strong',
        plainEnglish: 'Work pressure, conflict, or worry sits on your nervous system and can keep the score down even after you feel calm again.',
        effect: 'HRV down (vagal withdrawal); the physiological effect can persist beyond the emotion itself.',
        mechanism: 'Acute stress triggers vagal withdrawal and catecholamine release; the autonomic shift lingers after the subjective feeling fades.',
        whatToDo: 'Slow breathing, regular cardio, and social connection. Don\'t expect the number to recover until the stressor eases.',
        source: SRC.stressPersist },
      { key: 'late-meal', cat: 'nutrition', name: 'Late or heavy meal near bed', direction: 'negative', impact: 'med', evidence: 'Moderate',
        plainEnglish: 'Eating a large meal within ~3 hours of bed raises your sleeping heart rate and disturbs sleep, which dents the morning score.',
        effect: 'Higher sleeping HR, lower HRV, disturbed sleep. Effect varies with meal size and macros (one controlled study saw sleep disruption but mixed HRV change).',
        mechanism: 'Digestion keeps metabolic rate and sympathetic tone up when they should be falling for sleep.',
        whatToDo: 'Finish dinner 3+ hours before bed; keep late meals smaller and lower in fat.',
        source: SRC.mealsLate },
      { key: 'glucose', cat: 'nutrition', name: 'High-glycemic meal / glucose spike', direction: 'negative', impact: 'med', evidence: 'Moderate (direction)',
        plainEnglish: 'The most Kygo-aligned intake factor: a high-GI dinner or sugar spike near bed dents overnight HRV, tying your recovery directly to food logging.',
        effect: 'HRV falls as glucose rises; higher fasting glucose tracks higher RHR. The often-cited sleep glucose–HRV r ≈ −0.45 is from a very small study (n=5), so cite the direction, not that number.',
        mechanism: 'Glycemic spikes drive a counter-regulatory sympathetic response that suppresses vagally-mediated HRV.',
        whatToDo: 'Favor lower-GI evening meals; pair carbs with protein, fat, or fiber; avoid sugar spikes close to bed.',
        source: SRC.glucoseGI },
      { key: 'evening-caffeine', cat: 'substances', name: 'Evening caffeine', direction: 'negative', impact: 'med', evidence: 'Moderate',
        plainEnglish: 'Caffeine\'s long half-life means an afternoon or evening dose still has half its punch at bedtime — and the recovery hit usually comes via worse sleep.',
        effect: 'Worse sleep, higher sympathetic tone, delayed HRV recovery. Afternoon and evening doses matter most.',
        mechanism: 'Caffeine blocks adenosine and stimulates sympathetic activity; with a 5–6h half-life, a 3 PM coffee still has half its dose at 9 PM.',
        whatToDo: 'Cap intake and stop by early afternoon (roughly 8–10 hours before bed). Track your own on- vs off-caffeine nights — sensitivity is genetic.',
        source: SRC.caffeineSleep },
      { key: 'dehydration', cat: 'nutrition', name: 'Dehydration', direction: 'negative', impact: 'med', evidence: 'Moderate',
        plainEnglish: 'Being under-hydrated keeps blood volume low, forcing the heart to work harder — HRV down, RHR up — especially after exercise or in the heat.',
        effect: 'HRV down, RHR up (especially post-exercise or in heat, around 3.4% body-mass loss). Rehydrating restores HRV within ~24h.',
        mechanism: 'Reduced plasma volume increases sympathetic drive to maintain blood pressure, lowering stroke volume and vagal tone.',
        whatToDo: 'Drink to thirst plus a baseline; add electrolytes (sodium, potassium) if you sweat heavily or train in heat.',
        source: SRC.hydration },
      { key: 'hot-bedroom', cat: 'sleep', name: 'Hot bedroom / acute heat', direction: 'negative', impact: 'med', evidence: 'Moderate',
        plainEnglish: 'A warm room fragments sleep and keeps your autonomic system busy cooling you down, so the morning score suffers.',
        effect: 'Fragmented sleep, lower HRV, higher RHR. A cooler room helps.',
        mechanism: 'Thermoregulatory load raises sympathetic activity and disrupts the deep-sleep windows where HRV recovers.',
        whatToDo: 'Keep the bedroom cool (around 65–68°F / 18–20°C); a fan or A/C measurably helps.',
        source: SRC.bedroomTemp },
      { key: 'altitude', cat: 'stress', name: 'High altitude (acute)', direction: 'negative', impact: 'high', evidence: 'Strong at altitude',
        plainEnglish: 'Travel to elevation tanks the score for days until you acclimate. It\'s a real physiological load, not a measurement error.',
        effect: 'Marked HRV drop, higher LF/HF ratio, worse sleep — until acclimatization.',
        mechanism: 'Lower oxygen availability drives a sustained sympathetic response and hypoxia-disrupted sleep.',
        whatToDo: 'Expect lower numbers for several days after arriving at altitude; ease training and prioritize sleep and hydration.',
        source: SRC.altitude },
      { key: 'circadian', cat: 'sleep', name: 'Circadian disruption (jet lag, shift work)', direction: 'negative', impact: 'med', evidence: 'Moderate',
        plainEnglish: 'Late nights, time-zone travel, and rotating shifts misalign the body clock the score depends on — so the recovery window lands at the wrong time.',
        effect: 'HRV rhythm disrupted, sympathetic dominance, a worse recovery window.',
        mechanism: 'Circadian misalignment desynchronizes autonomic rhythm from the sleep period, blunting overnight parasympathetic recovery.',
        whatToDo: 'Anchor wake time and morning light; shift gradually before travel where possible.',
        source: SRC.circadian },
      { key: 'nicotine', cat: 'substances', name: 'Nicotine', direction: 'negative', impact: 'high', evidence: 'Strong',
        plainEnglish: 'Nicotine is a direct sympathetic stimulant — and that includes vaping and pouches, not just cigarettes.',
        effect: 'HRV down (vagal withdrawal), heart rate and blood pressure up.',
        mechanism: 'Nicotine triggers catecholamine release, raising sympathetic tone and suppressing vagal output.',
        whatToDo: 'Avoid nicotine, especially in the evening. Any form counts — vape, pouch, gum, or cigarette.',
        source: SRC.nicotine },
      { key: 'thc', cat: 'substances', name: 'THC / cannabis', direction: 'negative', impact: 'low', evidence: 'Minor',
        plainEnglish: 'Despite small signal shifts, WHOOP found NO significant change to next-day recovery — so the effect on the score itself is minimal, even though it disrupts sleep architecture.',
        effect: 'RHR +~1 bpm, HRV −~2.8 ms, suppresses REM [WHOOP data] — but no significant change to next-day recovery.',
        mechanism: 'THC alters sleep architecture (notably REM suppression) and produces small autonomic shifts that mostly wash out by morning.',
        whatToDo: 'Don\'t expect cannabis to wreck the score, but know it does disrupt REM. Judge by your own trend.',
        source: SRC.thcWhoop },

      // ---- WHAT RAISES YOUR SCORE (positive) ----
      { key: 'consistent-sleep', cat: 'sleep', name: 'Adequate, consistent sleep', direction: 'positive', impact: 'high', evidence: 'Strong',
        plainEnglish: 'The single biggest lever you have. Across every brand, adequate and regular sleep is the dominant positive input — and regularity matters as much as duration.',
        effect: 'The dominant positive input across every brand. Regularity matters as much as total hours.',
        mechanism: 'Deep and REM sleep are when vagal tone takes over and beat-to-beat variability widens; consistent timing keeps the circadian recovery window aligned.',
        whatToDo: 'Protect 7–9 hours with consistent bed and wake times — even on weekends.',
        source: SRC.sleepDep },
      { key: 'aerobic-fitness', cat: 'training', name: 'Aerobic fitness (long-term)', direction: 'positive', impact: 'high', evidence: 'Strong',
        plainEnglish: 'Consistent aerobic training raises your whole baseline — higher resting HRV and lower RHR over weeks to months — not just one night.',
        effect: 'Higher resting HRV and lower RHR over weeks to months; it lifts the baseline the score compares against.',
        mechanism: 'Endurance training expands stroke volume and shifts autonomic balance toward parasympathetic dominance.',
        whatToDo: 'Build an aerobic base — ~150 min/week of zone-2 cardio — and let the baseline rise over months.',
        source: SRC.hrvDeterm },
      { key: 'breathing', cat: 'stress', name: 'Slow breathing / meditation', direction: 'positive', impact: 'med', evidence: 'Moderate–strong',
        plainEnglish: 'Slow breathing is a direct line to the vagus nerve — it works acutely and is trainable over weeks.',
        effect: 'Higher vagally-mediated HRV, both acutely and as a trained baseline lift.',
        mechanism: 'Breathing at ~6 breaths/min creates cardiorespiratory resonance that maximally engages vagal output.',
        whatToDo: '5–10 min/day of slow-paced breathing (~6 breaths/min). Pre-bed timing compounds with sleep benefits.',
        source: SRC.breathing },
      { key: 'heat-accl', cat: 'training', name: 'Heat acclimation (repeated heat)', direction: 'positive', impact: 'med', evidence: 'Moderate',
        plainEnglish: 'The opposite of a one-off hot night: repeated heat exposure expands plasma volume and nudges morning HRV up.',
        effect: 'Plasma volume up, morning HRV up after a block of repeated heat exposure.',
        mechanism: 'Heat adaptation increases plasma volume and improves cardiovascular efficiency, supporting vagal tone.',
        whatToDo: 'Structured, progressive heat exposure (e.g. heat training blocks) — distinct from a single hot, sleepless night.',
        source: SRC.saunaPos },
      { key: 'cold-immersion', cat: 'training', name: 'Cold water immersion (post-exercise)', direction: 'positive', impact: 'med', evidence: 'Moderate',
        plainEnglish: 'Clearest in the post-exercise window — it accelerates parasympathetic reactivation and raises HRV acutely. But it\'s an acute effect, not a proven overnight-score lever.',
        effect: 'Accelerates parasympathetic reactivation and raises HRV acutely (e.g. ~11°C for ~6 min). Gone by ~4h; immersion at any temperature helps somewhat.',
        mechanism: 'Cold triggers a parasympathetic rebound after exercise, speeding the return of vagal tone.',
        whatToDo: 'Use it post-session for acute recovery if you like it; don\'t count on it moving the overnight number.',
        source: SRC.coldImmersion },
      { key: 'sauna', cat: 'training', name: 'Sauna (acute session)', direction: 'positive', impact: 'low', evidence: 'Mixed',
        plainEnglish: 'HRV dips during a sauna then rebounds above baseline after, with lower RHR into the next morning — but the long-term benefit is unproven.',
        effect: 'HRV dips during, rebounds above baseline after; RHR lower post-session, often into the next morning. A 2025 RCT found regular post-exercise sauna does NOT improve HRV long-term.',
        mechanism: 'Acute heat stress is followed by a parasympathetic rebound; the durable adaptation seen for heat training doesn\'t reliably appear for sauna alone.',
        whatToDo: 'Fine as an acute recovery ritual; don\'t expect a lasting HRV gain from sauna by itself.',
        source: SRC.saunaNull },

      // ---- SUPPLEMENTS (positive, unless noted) ----
      { key: 'magnesium', cat: 'supplements', name: 'Magnesium (bisglycinate)', direction: 'positive', impact: 'med', evidence: 'Moderate–weak',
        plainEnglish: 'A defensible pick: faster sleep onset and a small HRV/readiness benefit — but the evidence is weaker than blogs claim.',
        effect: 'Sleep onset ~17 min faster; a small HRV/readiness benefit.',
        mechanism: 'Magnesium supports GABAergic and NMDA balance involved in sleep onset; the autonomic effect is modest.',
        note: 'CORRECTED: the meta-analysis (Mah 2021) had only 3 small trials (n=151) with low-quality evidence, NOT the "27 RCTs / 2,496" figure circulating on blogs. A separate small Oura crossover (n=31) improved readiness and deep-sleep scores. Typical study dose ~200–360 mg.',
        amazon: { url: 'https://amzn.to/3Nbjq6C', label: 'Magnesium Glycinate' },
        source: SRC.magMeta },
      { key: 'glycine', cat: 'supplements', name: 'Glycine', direction: 'positive', impact: 'med', evidence: 'Moderate',
        plainEnglish: 'Small but PSG-correlated: faster sleep onset and better quality, partly by lowering core temperature.',
        effect: 'Faster sleep onset, better sleep quality; lowers core temperature ~0.28°C.',
        mechanism: 'Glycine promotes peripheral vasodilation and a core-temperature drop that helps initiate sleep.',
        note: 'Typical study dose 3 g pre-bed (Inagawa 2006 / Yamadera 2007) — PSG-correlated but small samples.',
        amazon: { url: 'https://amzn.to/3PWfatc', label: 'Glycine Powder' },
        source: SRC.glycine },
      { key: 'tart-cherry', cat: 'supplements', name: 'Tart cherry (Montmorency)', direction: 'positive', impact: 'med', evidence: 'Moderate (small pilots)',
        plainEnglish: 'Adds sleep time and eases muscle soreness — handy as a double-duty training-recovery aid, though the trials are small.',
        effect: '+34 to 84 min sleep, raises melatonin, eases muscle soreness. The +84 min figure is from an 8-person pilot; Pigeon 2010 (n=15) cut insomnia severity.',
        mechanism: 'Naturally contains melatonin and anti-inflammatory anthocyanins.',
        note: 'Typical dose 60 mL concentrate 2×/day or juice. Small pilots (n=8–15).',
        amazon: { url: 'https://amzn.to/3PXqKEh', label: 'Tart Cherry Juice' },
        source: SRC.tartCherry },
      { key: 'l-theanine', cat: 'supplements', name: 'L-theanine', direction: 'positive', impact: 'med', evidence: 'Moderate',
        plainEnglish: 'Lowers heart rate and cortisol under acute stress and improves sleep — and it pairs well with caffeine to blunt the jitters.',
        effect: 'Lowers HR and cortisol under acute stress; improves sleep.',
        mechanism: 'Promotes alpha-wave activity and dampens the sympathetic stress response.',
        note: 'Typical dose 200 mg. Often paired with caffeine to blunt its sympathetic effect.',
        amazon: { url: 'https://amzn.to/3OEoHEh', label: 'L-Theanine 200mg' },
        source: SRC.lTheanine },
      { key: 'ashwagandha', cat: 'supplements', name: 'Ashwagandha', direction: 'positive', impact: 'med', evidence: 'Moderate',
        plainEnglish: 'Cortisol and sleep benefits are the clearest; direct HRV evidence is thinner.',
        effect: 'Lowers cortisol and anxiety, improves sleep; some HRV gain.',
        mechanism: 'An adaptogen that lowers HPA-axis cortisol output.',
        note: 'Typical dose 300–600 mg. Cortisol/sleep clearest; direct HRV evidence thinner.',
        amazon: { url: 'https://amzn.to/403ZgOP', label: 'Ashwagandha Extract' },
        source: SRC.ashwagandha },
      { key: 'omega3', cat: 'supplements', name: 'Omega-3 (DHA)', direction: 'positive', impact: 'low', evidence: 'Moderate (RHR)',
        plainEnglish: 'A small, reliable resting-heart-rate drop — and notably the effect is from DHA, not EPA.',
        effect: 'Lowers resting heart rate ~2.2 bpm; HRV evidence mixed.',
        mechanism: 'DHA incorporates into cardiac membranes and modulates autonomic control of heart rate.',
        note: '51-RCT meta-analysis. Effect from DHA, not EPA.',
        amazon: { url: 'https://amzn.to/4cVnvGt', label: 'Omega-3 Fish Oil' },
        source: SRC.omega3 },
      { key: 'saffron', cat: 'supplements', name: 'Saffron', direction: 'positive', impact: 'med', evidence: 'Moderate',
        plainEnglish: 'Surprisingly solid for a botanical: a meaningful sleep-quality improvement across a large meta-analysis.',
        effect: 'Improves sleep quality (PSQI ~ −2.2 vs placebo).',
        mechanism: 'Saffron constituents (crocin, safranal) have serotonergic and mild sedative effects.',
        note: 'Meta-analysis of 21 RCTs (>1,700 people). Typical dose ~100 mg/day.',
        amazon: { url: 'https://www.amazon.com/dp/B097TKQSQD?ref=t_ac_view_request_product_image&campaignId=amzn1.campaign.2VRN9CPN5GVH8&linkCode=tr1&tag=kygohealthapp-20&linkId=amzn1.campaign.2VRN9CPN5GVH8_1781287684808', label: 'Saffron Extract' },
        source: SRC.saffron },
      { key: 'chamomile', cat: 'supplements', name: 'Chamomile extract', direction: 'positive', impact: 'low', evidence: 'Moderate',
        plainEnglish: 'Whole-extract chamomile improves sleep and anxiety — but the trendy isolated apigenin does not have the evidence people assume.',
        effect: 'Improves sleep quality and anxiety.',
        mechanism: 'Apigenin and other flavonoids bind benzodiazepine and GABA receptors, but the human evidence is for whole extract.',
        note: 'IMPORTANT: isolated apigenin (the trendy ~50 mg version) has NO human sleep RCT; the evidence is for whole chamomile extract. Typical dose 200–560 mg.',
        amazon: { url: 'https://amzn.to/3S5tosv', label: 'Chamomile Extract' },
        source: SRC.chamomile },
      { key: 'melatonin', cat: 'supplements', name: 'Melatonin', direction: 'positive', impact: 'low', evidence: 'Moderate (timing)',
        plainEnglish: 'Primarily a circadian timing aid, not a recovery booster. It speeds sleep onset and shifts timing; the HRV effect is modest and fades.',
        effect: 'Speeds sleep onset and shifts circadian timing; 2 mg modestly raises HRV and lowers overnight HR (peaks ~day 3–5, then fades).',
        mechanism: 'Melatonin shifts the circadian phase and has a small, transient autonomic effect.',
        note: 'Typical dose 0.5–3 mg. A timing aid, not a recovery booster; high doses can nudge BP/HR.',
        amazon: { url: 'https://amzn.to/4szGon9', label: 'Melatonin Supplement' },
        source: SRC.melatonin },
      { key: 'nitrate', cat: 'supplements', name: 'Dietary nitrate / beetroot', direction: 'positive', impact: 'low', evidence: 'Moderate / mixed',
        plainEnglish: 'Raises HRV and lowers sympathetic outflow and blood pressure — clearest acutely, and it varies by population.',
        effect: 'Raises SDNN, lowers sympathetic outflow and blood pressure.',
        mechanism: 'Dietary nitrate boosts nitric-oxide availability, improving vascular function and autonomic balance.',
        note: 'Clearest acutely; varies by population.',
        amazon: { url: 'https://amzn.to/406okEX', label: 'Beetroot Juice Shots' },
        source: SRC.nitrate },
      { key: 'weak-tier', cat: 'supplements', name: 'Weak / don’t rely on (valerian, GABA, CBD, creatine)', direction: 'positive', impact: 'low', evidence: 'Weak',
        plainEnglish: 'Kept here as one line on purpose so recovery content doesn\'t recommend these as recovery aids — the evidence doesn\'t support it.',
        effect: 'Valerian: subjective improvement only, objective measures unconvincing. GABA: poor oral absorption. CBD: WHOOP data shows no meaningful recovery change. Creatine: a cognitive buffer when underslept, not an HRV/recovery aid.',
        note: 'Taurine was dropped (no recovery audience; clinical/animal evidence only). Do not feature these in recovery or affiliate content.',
        source: SRC.valerian },

      // ---- BASELINE MODIFIERS (shift your number, not "good" or "bad") ----
      { key: 'age', cat: 'baseline', name: 'Age', direction: 'modifier', impact: 'high', evidence: 'Strong',
        plainEnglish: 'HRV falls with age, so a "low" number for a 60-year-old can be perfectly normal. Compare to age norms and your own baseline, never to other people.',
        effect: 'HRV declines with age (~80 ms in teens to ~25 ms over 75).',
        mechanism: 'Vagal tone and autonomic flexibility decline with age.',
        whatToDo: 'Judge your score against your own history and age-appropriate norms.',
        source: SRC.hrvDeterm },
      { key: 'sex', cat: 'baseline', name: 'Sex', direction: 'modifier', impact: 'med', evidence: 'Moderate',
        plainEnglish: 'Women tend to run higher vagal tone, men higher sympathetic — and the gap narrows after about 55 (menopause).',
        effect: 'Women: higher vagal tone; men: higher sympathetic. The gap narrows after ~55 (menopause).',
        mechanism: 'Sex hormones modulate autonomic balance; the difference attenuates post-menopause.',
        source: SRC.hrvDeterm },
      { key: 'body-comp', cat: 'baseline', name: 'Body composition (body fat %)', direction: 'modifier', impact: 'med', evidence: 'Moderate',
        plainEnglish: 'Body fat percentage — not weight or BMI — is the informative measure: higher body fat tracks lower HRV and higher RHR, and it improves with fat loss.',
        effect: 'Higher body fat tracks lower HRV and higher RHR; BMI alone is not independently associated.',
        mechanism: 'Adipose tissue raises sympathetic tone and inflammatory load; fat loss restores autonomic balance.',
        whatToDo: 'Track body fat %, not the scale; sustainable fat loss lifts the baseline.',
        source: SRC.bodyfat },
      { key: 'menstrual', cat: 'baseline', name: 'Menstrual cycle (luteal phase)', direction: 'modifier', impact: 'med', evidence: 'Moderate–strong',
        plainEnglish: 'Normal physiology, not a problem: expect lower scores mid-to-late cycle as RHR and temperature rise and HRV dips.',
        effect: 'RHR +~3–5 bpm (~3%), HRV down, temperature +~0.5°C in the luteal phase.',
        mechanism: 'Progesterone raises basal temperature and heart rate and lowers vagal tone in the luteal phase.',
        whatToDo: 'Expect and accept lower numbers in the luteal phase; compare within-cycle, not across phases.',
        source: SRC.menstrual }
    ];
  }

  _factorsInCat(chipKey) {
    if (!chipKey) return this._allFactors;
    const chip = this._factorCategories.find(c => c.key === chipKey);
    if (!chip) return this._allFactors;
    return this._allFactors.filter(f => chip.cats.includes(f.cat));
  }

  _icon(name) {
    const icons = {
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>',
      chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      compare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M21 3l-7 7"/><path d="M8 21H3v-5"/><path d="M3 21l7-7"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
      sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 13.7 8.3 19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7Z"/><path d="M19 17v4"/><path d="M17 19h4"/></svg>',
      alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
      brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v13"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
      sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
      droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/></svg>',
      coffee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>',
      thermometer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>',
      bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',
      ghost: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>',
      target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
      trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
      flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
      watch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"/><polyline points="12 10 12 12 13 13"/><path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05"/><path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05"/></svg>',
      cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>'
    };
    return icons[name] || icons.heart;
  }

  _heroWaveSvg() {
    return `
      <svg class="hero-wave" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="kygo-stress-wave-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#22C55E" stop-opacity="0.10"/>
            <stop offset="1" stop-color="#22C55E" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="M0 130 L 80 130 L 95 130 L 105 100 L 115 165 L 130 90 L 145 145 L 160 130 L 240 130 L 255 130 L 265 105 L 275 160 L 290 95 L 305 150 L 320 130 L 400 130 L 415 130 L 425 102 L 435 168 L 450 92 L 465 148 L 480 130 L 600 130" stroke="#22C55E" stroke-width="2" fill="none" opacity="0.75"/>
        <path d="M0 130 L 600 130 L 600 240 L 0 240 Z" fill="url(#kygo-stress-wave-g)"/>
        <g stroke="rgba(30,41,59,0.07)" stroke-width="1">
          <line x1="0" y1="40" x2="600" y2="40"/>
          <line x1="0" y1="200" x2="600" y2="200"/>
        </g>
      </svg>`;
  }


  _impactCfg(impact) {
    const map = {
      high: { label: 'High',   cls: 'imp-high',   weight: 3 },
      med:  { label: 'Medium', cls: 'imp-med',    weight: 2 },
      low:  { label: 'Low',    cls: 'imp-low',    weight: 1 }
    };
    return map[impact] || map.med;
  }


  _deviceImage(key) {
    return ({
      garmin:  'https://static.wixstatic.com/media/273a63_c545c093c04d4ca4ade77e5ca43fd433~mv2.png',
      samsung: 'https://static.wixstatic.com/media/273a63_21fd42e4a5d1459bb6db751a0ea5e161~mv2.png',
      fitbit:  'https://static.wixstatic.com/media/273a63_c12bab319dc34737a386c7449f5f92c7~mv2.png',
      whoop:   'https://static.wixstatic.com/media/273a63_c52aaaca1f7243f3818cf51d9374dbd4~mv2.png',
      oura:    'https://static.wixstatic.com/media/273a63_722e50e1a554453eb4c71a2e7a58925d~mv2.png',
      polar:   'https://static.wixstatic.com/media/273a63_e7e3c05ed0bc4cec8f456cd7f995e70b~mv2.png',
      apple:   'https://static.wixstatic.com/media/273a63_68b4900c356b4d0c8982e5ecd10f04fe~mv2.png',
      coros:   'https://static.wixstatic.com/media/273a63_b86aaa1f1b5b43a4a8ccc8294293e193~mv2.png',
      suunto:  'https://static.wixstatic.com/media/273a63_0bf2273473c849a98d9fc92b6ccea514~mv2.png',
      amazfit: 'https://static.wixstatic.com/media/273a63_01b29289863b4cd5844d575301addb6a~mv2.png',
      ultrahuman: 'https://static.wixstatic.com/media/273a63_810650aa12fe4ae59ce7e22c25c312fc~mv2.png',
      ringconn:   'https://static.wixstatic.com/media/273a63_fc0ed00ac88441138f7b4c7e398f7aa8~mv2.png'
    })[key] || null;
  }

  _renderComparisonModule() {
    const sensorList = [
      { key: 'hrv',   label: 'HRV',           short: 'HRV' },
      { key: 'rhr',   label: 'Resting HR',    short: 'RHR' },
      { key: 'sleep', label: 'Sleep',         short: 'Sleep' },
      { key: 'temp',  label: 'Body Temp',     short: 'Temp' },
      { key: 'rr',    label: 'Resp. Rate',    short: 'Resp' },
      { key: 'load',  label: 'Training Load', short: 'Load' },
      { key: 'subj',  label: 'Self-report',   short: 'Subj.' }
    ];
    const totalSensors = sensorList.length;

    const ranked = Object.entries(this._devices).map(([key, d]) => {
      const count = Object.values(d.sensors).filter(Boolean).length;
      return { key, d, count };
    }).sort((a, b) => b.count - a.count || a.d.name.localeCompare(b.d.name));

    const tableHead = `
      <thead>
        <tr>
          <th class="dt-th-device" scope="col">Wearable</th>
          ${sensorList.map(s => `
            <th scope="col">
              <span class="dt-th-full">${s.label}</span>
              <span class="dt-th-short" aria-hidden="true">${s.short}</span>
            </th>`).join('')}
          <th class="dt-th-count" scope="col">Signals</th>
        </tr>
      </thead>`;

    const tableBody = ranked.map(({ key, d, count }) => {
      const img = this._deviceImage(key);
      return `
        <tr style="--accent:${d.color}">
          <th class="dt-td-device" scope="row">
            <span class="dt-brand">
              ${img
                ? `<span class="dt-img"><img src="${img}" alt="${d.name}" loading="lazy" /></span>`
                : `<span class="dt-img dt-img--icon" aria-hidden="true">${this._icon('watch')}</span>`}
              <span class="dt-name">${d.name}</span>
            </span>
          </th>
          ${sensorList.map(s => {
            const on = !!d.sensors[s.key];
            return `<td class="dt-cell ${on ? 'on' : 'off'}" aria-label="${s.label} ${on ? 'used' : 'not used'}">
              <span class="dt-mark" aria-hidden="true">${on ? this._icon('check') : '<span class="dt-dash"></span>'}</span>
            </td>`;
          }).join('')}
          <td class="dt-td-count">
            <span class="dt-count-num">${count}</span><span class="dt-count-lbl">/ ${totalSensors}</span>
          </td>
        </tr>`;
    }).join('');

    return `
      <section class="comparison-section section-bg-gray" id="compare">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('compare')}</span>How each brand measures recovery</span>
            <h2 class="section-h2">Every recovery score, <em>side by side</em>.</h2>
            <p class="section-lede">Two devices on one wrist will disagree — different inputs, baselines, and scales. Here's what each score actually reads, ranked by input coverage.</p>
            ${this._readMore(this._posts.compared, 'Full breakdown: WHOOP vs Oura vs Garmin compared')}
          </div>

          <div class="device-chart">
            <div class="dc-head">
              <div>
                <span class="dc-eyebrow">Input coverage</span>
                <h3 class="dc-title">Signals fed into the recovery score, by brand</h3>
                <p class="dc-sub">Same core ingredients — HRV (86% of scores), resting HR (79%), sleep (71%). The difference between brands is weighting, not raw signals.</p>
              </div>
              <div class="dc-meta">${ranked.length} brands · ${totalSensors} signals</div>
            </div>
            <div class="device-table-wrap">
              <table class="device-table">
                ${tableHead}
                <tbody>${tableBody}</tbody>
              </table>
            </div>
          </div>
        </div>
      </section>`;
  }

  _renderFullBreakdown() {
    const ranked = Object.entries(this._devices).map(([key, d]) => {
      const count = Object.values(d.sensors).filter(Boolean).length;
      return { key, d, count };
    }).sort((a, b) => b.count - a.count || a.d.name.localeCompare(b.d.name));

    const expanded = this._compareExpandedKey;

    const detailRows = ranked.map(({ key, d }, i) => {
      const img = this._deviceImage(key);
      const isOpen = expanded === key;
      return `
        <div class="dd-row ${isOpen ? 'open' : ''}" style="--accent:${d.color};--delay:${i * 30}ms">
          <button class="dd-row-head" type="button" data-device-row="${key}" aria-expanded="${isOpen}">
            ${img
              ? `<span class="dd-img"><img src="${img}" alt="${d.name}" loading="lazy" /></span>`
              : `<span class="dd-img dd-img--icon" aria-hidden="true">${this._icon('watch')}</span>`}
            <span class="dd-text">
              <span class="dd-name">${d.name}</span>
              <span class="dd-line">${d.modelLine}</span>
            </span>
            <span class="dd-chev" aria-hidden="true">${this._icon('chevDown')}</span>
          </button>
          <div class="dd-body" ${isOpen ? '' : 'hidden'}>
            <div class="dd-body-inner">
              <dl class="dd-fields">
                <div><dt>Score name</dt><dd>${d.scoreName}${d.free ? ' · <strong>Free</strong>' : ' · Paid'}</dd></div>
                <div><dt>How it's built</dt><dd>${d.algorithm}</dd></div>
                <div><dt>Scale</dt><dd>${d.scale}</dd></div>
                <div><dt>Core inputs</dt><dd>${d.inputs}</dd></div>
                <div><dt>Measurement window</dt><dd>${d.window}</dd></div>
                ${d.validation ? `<div><dt>Validation</dt><dd>${d.validation.evidence}</dd></div>` : ''}
              </dl>
              <div class="dd-callouts">
                <div class="dd-callout strong"><span class="dd-callout-head"><span class="dd-callout-icon">${this._icon('sparkle')}</span>Unique strength</span><p>${d.strength}</p></div>
                <div class="dd-callout watch"><span class="dd-callout-head"><span class="dd-callout-icon">${this._icon('alert')}</span>Watch out for</span><p>${d.limitation}</p></div>
              </div>
              ${d.amazon ? `<div class="dd-buy-row"><a class="dd-buy" href="${d.amazon}" target="_blank" rel="noopener sponsored"><span class="dd-buy-cart" aria-hidden="true">${this._icon('cart')}</span>View ${d.name} on Amazon<span class="dd-buy-go" aria-hidden="true">${this._icon('externalLink')}</span></a><span class="dd-buy-aff">Affiliate link — we may earn a commission.</span></div>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');

    return `
      <section class="breakdown-section section-bg-gray" id="full-breakdown">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('sparkle')}</span>Per-brand deep dive</span>
            <h2 class="section-h2">How each recovery score <em>actually works</em>.</h2>
            <p class="section-lede">Tap any brand for how its score is built, its scale and inputs, free vs paid, and where it falls short.</p>
            ${this._readMore(this._posts.compared, 'Read: recovery scores compared, brand by brand')}
          </div>
          <div class="device-details">
            <div class="dd-list">${detailRows}</div>
          </div>
        </div>
      </section>`;
  }

  _topPicks() {
    return [
      { label: 'What you\'re buying', stat: 'One number', answer: 'A modeled opinion, not a measurement', icon: 'bolt', note: 'Almost every brand now sells a single morning number for "how recovered are you." But there\'s no clinical gold standard for recovery the way polysomnography exists for sleep — so brands validate their inputs, not the output. A recovery score is a modeled opinion layered on real signals.', cls: '' },
      { label: 'Cross-brand comparison', stat: 'Don\'t', answer: 'An "80" means different things', icon: 'ghost', note: 'Different inputs, baselines, and scales. Polar isn\'t even on 0–100 (it\'s ANS Charge, −10 to +10). Two devices on one wrist will routinely disagree. Only the trend versus your own baseline is meaningful — never the cross-brand number.', cls: '' },
      { label: 'Scores independently validated', stat: '2 / 12', answer: 'Only WHOOP & Oura', icon: 'shield', note: 'And WHOOP\'s came out weak — the raw HRV carried the signal, the composite didn\'t add to it. Everyone else has at most component validation or vendor white papers. "2 of 12" is the headline finding, not a coverage gap.', cls: '' },
      { label: 'The common spine', stat: 'HRV+RHR+sleep', answer: 'Same ingredients, different recipe', icon: 'activity', note: 'Across the De Gruyter catalogue: HRV in 86% of scores, RHR 79%, activity 71%, sleep 71%. The differences between brands are weighting and window length, not the raw ingredients.', cls: '' },
      { label: 'Biggest controllable hit', stat: '~15%', answer: 'Alcohol drops HRV overnight', icon: 'droplet', note: 'Oura\'s 600,000-member data: HRV down ~15% (~10.8 ms), HR up ~9.6%. WHOOP: a single drink cuts next-day recovery ~8%. Dose-dependent, and the clearest lever a food-logging user can actually see and change.', cls: '' },
      { label: 'Single biggest lever up', stat: 'Sleep', answer: 'Consistency = duration', icon: 'moon', note: 'Adequate, regular sleep is the dominant positive input across every brand. Regularity matters as much as hours. Everything else — supplements, cold plunges, breathwork — is a rounding error next to it.', cls: '' },
      { label: 'Signals beat scores', stat: 'Oura best', answer: 'Cite the signal, not the score', icon: 'target', note: 'Dial 2025 (536 nights vs ECG): Oura HRV CCC 0.97–0.99, WHOOP 0.94, Garmin and Polar poor. The ingredients are reasonably sound (best in Oura); the recipe layered on top is the unvalidated part.', cls: '' },
      { label: 'The independence problem', stat: 'Double-count', answer: 'One bad night hits 3 inputs', icon: 'alert', note: 'Poor sleep lowers next-day HRV and raises RHR — so a score "combining" sleep + HRV + RHR partly counts the same event twice. This can overstate a single bad night, a known critique of every composite score.', cls: '' }
    ];
  }

  _renderArticleCta() {
    return `
      <section class="article-section section-bg-white">
        <div class="container">
          <a href="${this._posts.lowers}" class="article-card animate-on-scroll" target="_blank" rel="noopener">
            <span class="article-badge">Read the guide</span>
            <div class="article-body">
              <span class="article-kicker">Why is your score doing that?</span>
              <h3 class="article-title">What Lowers Your Recovery Score <span class="article-year">(2026)</span></h3>
              <p class="article-desc">The intake triggers — alcohol, late meals, caffeine — that move your number, and how to find your own with Kygo.</p>
            </div>
            <span class="article-go" aria-hidden="true">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>`;
  }

  _renderCtaRow() {
    const iosUrl = 'https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589';
    return `
      <section class="app-cta-section section-bg-white">
        <div class="container">
          <div class="app-cta animate-on-scroll">
            <div class="app-cta-glow" aria-hidden="true"></div>
            <div class="app-cta-content">
              <div class="app-cta-badge"><span class="pulse-dot"></span>Free Forever Plan</div>
              <h2>See How Your Food Influences <span class="highlight">Your Sleep, HRV &amp; Recovery</span></h2>
              <p>Kygo Health connects your wearable data with nutrition tracking to pinpoint personal correlations between what you eat, your sleep, your HRV, and your morning recovery score.</p>
              <div class="app-cta-buttons">
                <a href="${iosUrl}" class="app-cta-btn" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </a>
                <a href="https://www.kygo.app/android" target="_blank" rel="noopener" class="app-cta-android">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                  Download for Android
                </a>
              </div>
              <div class="app-cta-tags">
                <span class="app-cta-tags-label">Works with</span>
                <div class="app-cta-tags-logos">
                  <img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura" loading="lazy" />
                  <img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple" loading="lazy" />
                  <img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit" loading="lazy" />
                  <img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin" loading="lazy" />
                  <img src="https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png" alt="Google Health" loading="lazy" />
                  <img src="https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png" alt="Health Connect" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>`;
  }


  _renderTopPicks() {
    return `
      <section class="picks-section section-bg-gray">
        <div class="container">
          <div class="picks-card">
            <div class="picks-glow" aria-hidden="true"></div>
            <div class="picks-head animate-on-scroll">
              <span class="picks-eyebrow">Eight headlines from the data</span>
              <h2 class="picks-title">If you only remember <em>eight things</em>.</h2>
            </div>
            <div class="picks-grid">
              ${this._topPicks().map((p, i) => `
                <article class="pick-card ${p.cls || ''} animate-on-scroll" style="--delay:${i * 70}ms">
                  <span class="pick-icon" aria-hidden="true">${this._icon(p.icon)}</span>
                  <span class="pick-label">${p.label}</span>
                  <div class="pick-stat">${p.stat}</div>
                  <h3 class="pick-answer">${p.answer}</h3>
                  <p class="pick-note">${p.note}</p>
                </article>`).join('')}
            </div>
          </div>
        </div>
      </section>`;
  }

  _renderFactorCard(f) {
    const isExp = this._listExpandedKey === f.key;
    const impCfg = this._impactCfg(f.impact);
    const catLbl = this._catLabel(f.cat);
    const dirCls = f.direction === 'positive' ? 'fact-dir-pos' : f.direction === 'negative' ? 'fact-dir-neg' : 'fact-dir-var';
    const dirArrow = f.direction === 'positive' ? '↑' : f.direction === 'negative' ? '↓' : '↕';
    const dirLbl = f.direction === 'positive' ? 'Raises your score' : f.direction === 'negative' ? 'Lowers your score' : 'Shifts your baseline';

    let body = '';
    if (isExp) {
      body = `
        <div class="fact-body">
          ${f.plainEnglish ? `<p class="fact-lede">${f.plainEnglish}</p>` : ''}
          <dl class="fact-fields">
            <div><dt>Effect on the signals</dt><dd>${f.effect}</dd></div>
            <div><dt>Evidence</dt><dd>${f.evidence}</dd></div>
            ${f.mechanism ? `<div><dt>Mechanism</dt><dd>${f.mechanism}</dd></div>` : ''}
            ${f.note ? `<div${f.whatToDo ? '' : ' class="fact-fields--full"'}><dt>${f.cat === 'supplements' ? 'Dose & caveat' : 'Note'}</dt><dd>${f.note}</dd></div>` : ''}
            ${f.whatToDo ? `<div class="fact-fields--full"><dt>What to do</dt><dd>${f.whatToDo}</dd></div>` : ''}
          </dl>
          <div class="fact-source-row">
            <span class="fact-source-lbl">Source</span>
            <a href="${f.source.url}" target="_blank" rel="noopener" class="source-link">${f.source.label} ${this._icon('externalLink')}</a>
          </div>
          ${f.amazon ? `<div class="fact-buy-row"><a class="dd-buy dd-buy--sm" href="${f.amazon.url}" target="_blank" rel="noopener sponsored"><span class="dd-buy-cart" aria-hidden="true">${this._icon('cart')}</span>${f.amazon.label} on Amazon<span class="dd-buy-go" aria-hidden="true">${this._icon('externalLink')}</span></a><span class="dd-buy-aff">Affiliate link — we may earn a commission.</span></div>` : ''}
        </div>`;
    }

    return `
      <article class="fact-card ${isExp ? 'expanded' : ''}" data-fact-key="${f.key}">
        <button class="fact-head" aria-expanded="${isExp}">
          <span class="fact-meta">
            <span class="fact-cat">${catLbl} <span class="fact-dir ${dirCls}" aria-hidden="true">${dirArrow}</span></span>
            <span class="fact-name">${f.name}</span>
            <span class="fact-effect ${dirCls}">${dirLbl} · ${impCfg.label} impact <span class="fact-ev-inline">· ${f.evidence} evidence</span></span>
          </span>
          <span class="fact-pill ${impCfg.cls}">${impCfg.label}</span>
          <span class="fact-chev" aria-hidden="true">${this._icon('chevDown')}</span>
        </button>
        ${body}
      </article>`;
  }

  _renderFactorList() {
    // Until a category is picked, prompt instead of dumping all 35 cards (too long on mobile).
    if (!this._categoryFilter) {
      const cats = this._factorCategories.map(c =>
        `<button class="fact-prompt-chip" data-cat="${c.key}">${c.label}</button>`).join('');
      return `
        <div class="fact-prompt">
          <span class="fact-prompt-ic" aria-hidden="true">${this._icon('activity')}</span>
          <p class="fact-prompt-lead">Pick a category to explore its factors.</p>
          <div class="fact-prompt-chips">${cats}</div>
        </div>`;
    }

    // Three direction groups: raises (positive), lowers (negative), baseline modifiers (modifier).
    const filtered = this._factorsInCat(this._categoryFilter);
    if (!filtered.length) return '<p class="dash-empty">No factors match this filter.</p>';

    const byImpact = (a, b) =>
      this._impactCfg(b.impact).weight - this._impactCfg(a.impact).weight ||
      a.name.localeCompare(b.name);
    const raises = filtered.filter(f => f.direction === 'positive').sort(byImpact);
    const lowers = filtered.filter(f => f.direction === 'negative').sort(byImpact);
    const mods   = filtered.filter(f => f.direction === 'modifier').sort(byImpact);

    const group = (cls, label, sub, items) => items.length ? `
      <div class="fact-group fact-group--${cls}">
        <div class="fact-group-head">
          <span class="fact-group-label"><span class="fact-group-icon" aria-hidden="true"></span>${label}</span>
          <span class="fact-group-meta">${items.length} factor${items.length === 1 ? '' : 's'} · ${sub}</span>
        </div>
        <div class="fact-list">
          ${items.map(f => this._renderFactorCard(f)).join('')}
        </div>
      </div>` : '';

    return `
      <div class="fact-groups">
        ${group('raises', 'What helps', 'Raises your score', raises)}
        ${group('lowers', 'What hurts', 'Lowers your score', lowers)}
        ${group('modifier', 'Baseline modifiers', 'Shift your baseline', mods)}
      </div>`;
  }

  _renderCategoryTiles() {
    const tiles = this._factorCategories.map(c => {
      const count = this._allFactors.filter(f => c.cats.includes(f.cat)).length;
      const isActive = this._categoryFilter === c.key;
      return `
        <button class="picker-tile ${isActive ? 'active' : ''}" data-cat="${c.key}" aria-pressed="${isActive}">
          <span class="picker-tile-main"><span class="picker-tile-ic" aria-hidden="true">${this._icon(c.icon)}</span><span class="picker-tile-name">${c.label}</span></span>
          <span class="picker-tile-count">${count}</span>
        </button>`;
    }).join('');
    return `<div class="picker-tiles picker-tiles--metrics" data-cat-count="${this._factorCategories.length}">${tiles}</div>`;
  }

  _renderFactorsSection() {
    const cat = this._categoryFilter;
    const catLabel = cat ? (this._factorCategories.find(c => c.key === cat) || {}).label : null;
    const total = this._allFactors.length;
    const shown = this._factorsInCat(cat).length;
    return `
      <section class="factors-section section-bg-gray">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('activity')}</span>What moves your score</span>
            <h2 class="section-h2">${total} <em>factors</em> that move your recovery score.</h2>
            <p class="section-lede">Anything that moves HRV, resting heart rate or sleep moves your score — always relative to your own baseline.</p>
            ${this._readMore(this._posts.lowers, 'Read: what lowers your recovery score')}
          </div>
          <span class="metric-tiles-label">Filter by category — ${this._factorCategories.length} groups</span>
          ${this._renderCategoryTiles()}
          <div class="picker-panel">
            <div class="picker-panel-head">
              <h3 class="picker-panel-title">${catLabel ? catLabel : 'Browse by category'}<span class="picker-panel-meta">${catLabel ? `${shown} factor${shown === 1 ? '' : 's'}` : `${total} total`}</span></h3>
            </div>
            ${this._renderFactorList()}
          </div>
        </div>
      </section>`;
  }

  _renderSourcesSection() {
    const groups = {
      'Recovery & composite-score validation': [
        { label: 'De Gruyter 2025 — Readiness, recovery & strain: evaluation of composite health scores (Doherty / Altini et al.)', url: 'https://www.degruyterbrill.com/document/doi/10.1515/teb-2025-0001/html' },
        { label: 'Marco Altini — summary of the composite-scores paper (Substack)', url: 'https://marcoaltini.substack.com/p/paper-readiness-recovery-and-strain' },
        { label: 'Dial et al. 2025 — nocturnal RHR/HRV validation, 536 nights vs ECG (Physiological Reports)', url: 'https://physoc.onlinelibrary.wiley.com/doi/10.14814/phy2.70527' },
        { label: 'Bellenger et al. 2021 — WHOOP wrist-PPG HR/HRV validation vs ECG (Sensors, MDPI)', url: 'https://www.mdpi.com/1424-8220/21/10/3571' },
        { label: 'Lundstrom et al. 2024 — WHOOP metrics vs energy deficiency in elite swimmers (Sage)', url: 'https://journals.sagepub.com/doi/10.1177/17479541231206424' },
        { label: 'Penn State thesis — WHOOP score vs metabolism/recovery in D1 swimmers', url: 'https://etda.libraries.psu.edu/catalog/18210eal259' },
        { label: 'CTS / TrainRight — analysis of the swimmer wearable-score study', url: 'https://trainright.com/new-study-reveals-holes-in-wearable-device-scores/' },
        { label: 'Sports Medicine Open 2025 — validating subjective ratings with Oura data in elite endurance athletes', url: 'https://link.springer.com/article/10.1186/s40798-025-00958-y' },
        { label: 'SciTePress 2025 — Recovery & Readiness Monitoring Using Wearable Technology', url: 'https://www.scitepress.org/Papers/2025/137331/137331.pdf' }
      ],
      'Brand documentation': [
        { label: 'WHOOP — Recovery: How It Works (Recovery 101)', url: 'https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/' },
        { label: 'Oura — Readiness Contributors (Oura Help)', url: 'https://support.ouraring.com/hc/en-us/articles/360057791533-Readiness-Contributors' },
        { label: 'Garmin — Training Readiness (owner\'s manual)', url: 'https://www8.garmin.com/manuals/webhelp/GUID-C001C335-A8EC-4A41-AB0E-BAC434259F92/EN-US/GUID-C21BE0C8-A08E-4DA1-B6C6-2E0E2DDDB372.html' },
        { label: 'Fitbit / Google — Daily Readiness Score (Google Health Help)', url: 'https://support.google.com/fitbit/answer/14236710?hl=en' },
        { label: 'Samsung × University of Georgia — Energy Score (Samsung Newsroom)', url: 'https://news.samsung.com/global/samsung-collaborates-with-the-university-of-georgia-to-define-and-measure-energy-for-innovative-digital-health-experiences' },
        { label: 'Polar — Nightly Recharge / ANS Charge (Polar Support)', url: 'https://support.polar.com/en/nightly-recharge-recovery-measurement' },
        { label: 'Ultrahuman — Dynamic Recovery score guide (Ultrahuman blog)', url: 'https://blog.ultrahuman.com/blog/ultrahuman-ring-recovery-score-guide/' },
        { label: 'COROS — EvoLab Metrics (COROS Help)', url: 'https://support.coros.com/hc/en-us/articles/360061452651-EvoLab-Metrics' },
        { label: 'Amazfit HybridCharge / Zepp 10 update (the5krunner)', url: 'https://the5krunner.com/2026/05/25/amazfit-hybridcharge-zepp-10-update/' },
        { label: 'Apple — Track Your Training Load on Apple Watch (Apple Support)', url: 'https://support.apple.com/guide/watch/track-your-training-load-apde4c07a6cf/watchos' },
        { label: 'RingConn — Health Scores Explained (RingConn)', url: 'https://ringconn.com/blogs/news/guide-ringconn-health-scores' }
      ],
      'What moves your score — lifestyle factors': [
        { label: 'Oura — alcohol\'s impact on members\' sleep & HRV (brand data, 600k members)', url: 'https://ouraring.com/blog/how-does-alcohol-impact-oura-members/' },
        { label: 'WHOOP — alcohol effects on HRV, sleep & recovery (brand data)', url: 'https://www.whoop.com/us/en/thelocker/alcohol-affects-body-hrv-sleep/' },
        { label: 'WHOOP — marijuana (THC) effects on sleep, RHR & HRV (brand data)', url: 'https://www.whoop.com/us/en/thelocker/impact-of-marijuana-sleep-resting-heart-rate-hrv/' },
        { label: 'Am J Physiol Heart Circ 2009 — dose-related effects of alcohol on HRV', url: 'https://journals.physiology.org/doi/full/10.1152/ajpheart.00700.2009' },
        { label: 'Frontiers in Neurology 2025 — sleep deprivation & HRV: systematic review & meta-analysis', url: 'https://www.frontiersin.org/journals/neurology/articles/10.3389/fneur.2025.1556784/full' },
        { label: 'PMC6026827 — next-day recovery after acute low vs high training load (rugby)', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6026827/' },
        { label: 'Egyptian Heart Journal (PMC6821413) — persistent effect of acute psychosocial stress on HRV', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6821413/' },
        { label: 'MDPI Sensors 2024 — wearable fever / illness detection physiology', url: 'https://www.mdpi.com/1424-8220/24/6/1818' },
        { label: 'PubMed 2424378 — fever & cardiac rhythm: ~8.5 bpm per 1°C (classic)', url: 'https://pubmed.ncbi.nlm.nih.gov/2424378/' },
        { label: 'PubMed 33426778 — late-night eating: sleep, HPA axis & autonomic function', url: 'https://pubmed.ncbi.nlm.nih.gov/33426778/' },
        { label: 'PubMed 38042028 — heart rate variations & glucose fluctuations during sleep', url: 'https://pubmed.ncbi.nlm.nih.gov/38042028/' },
        { label: 'Chronobiology Int 2024 — high-glycemic-index breakfast & HRV by chronotype', url: 'https://www.tandfonline.com/doi/full/10.1080/07420528.2024.2428203' },
        { label: 'PubMed 16184581 — caffeine effects on heart rate & QT variability during sleep', url: 'https://pubmed.ncbi.nlm.nih.gov/16184581/' },
        { label: 'PubMed 25726222 — hydration status affects RMR & HRV', url: 'https://pubmed.ncbi.nlm.nih.gov/25726222/' },
        { label: 'PMC12812737 — acute high-altitude exposure & HRV: meta-analysis', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12812737/' },
        { label: 'PMC12751657 — bedroom temperature & HRV in older adults', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12751657/' },
        { label: 'PubMed 9005885 — circadian HRV rhythm in shift workers', url: 'https://pubmed.ncbi.nlm.nih.gov/9005885/' },
        { label: 'Nicotine & Tobacco Research — single 4 mg nicotine dose reduces HRV in nonsmokers', url: 'https://academic.oup.com/ntr/article/13/5/369/1168539' },
        { label: 'SLEEP 2023 — THC before bed reduces nocturnal parasympathetic control', url: 'https://academic.oup.com/sleep/article/46/Supplement_1/A59/7181640' },
        { label: 'ScienceDirect 2022 — voluntary slow breathing & HRV: systematic review & meta-analysis', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0149763422002007' },
        { label: 'Wiley 2025 — cold water immersion, HRV & post-exercise recovery: systematic review', url: 'https://onlinelibrary.wiley.com/doi/abs/10.1002/pri.70033' },
        { label: 'J Sci Med Sport — recovery from sauna favorably modulates cardiac autonomic system', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0965229919301943' },
        { label: 'Physiological Reports 2025 — regular post-exercise sauna does NOT improve HRV: RCT', url: 'https://physoc.onlinelibrary.wiley.com/doi/abs/10.14814/phy2.70449' },
        { label: 'Eur J Clin Nutr 2018 — omega-3 & resting heart rate: meta-analysis of RCTs', url: 'https://www.nature.com/articles/s41430-017-0052-3' },
        { label: 'PMC6686273 — age, sex & fitness differences in HRV', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6686273/' },
        { label: 'PMC3743431 — body fat percentage & HRV sympathovagal balance', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3743431/' },
        { label: 'PMC5588411 — menstrual cycle & cardiac autonomic function / HRV', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5588411/' }
      ],
      'Sleep & recovery supplements': [
        { label: 'PMC8053283 — magnesium for insomnia: systematic review & meta-analysis (Mah 2021)', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8053283/' },
        { label: 'Nature & Science of Sleep 2025 — magnesium bisglycinate in adults with poor sleep: RCT', url: 'https://www.tandfonline.com/doi/full/10.2147/NSS.S524348' },
        { label: 'Sleep & Biological Rhythms 2007 — glycine improves sleep quality: PSG evidence', url: 'https://onlinelibrary.wiley.com/doi/10.1111/j.1479-8425.2007.00262.x' },
        { label: 'PMC — Montmorency tart cherry & sleep: systematic review', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12438961/' },
        { label: 'Sleep Medicine 2022 — saffron & sleep quality: meta-analysis of 21 RCTs', url: 'https://pubmed.ncbi.nlm.nih.gov/35325766/' },
        { label: 'Phytotherapy Research — chamomile for sleep & anxiety: systematic review & meta-analysis', url: 'https://onlinelibrary.wiley.com/doi/10.1002/ptr.6349' },
        { label: 'Frontiers 2024 — apigenin at the sleep/aging intersection (notes NO human sleep RCT)', url: 'https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2024.1359176/full' },
        { label: 'npj Biological Timing & Sleep 2024 — melatonin in the cardiovascular system, dose-dependent effects', url: 'https://www.nature.com/articles/s44323-024-00007-z' },
        { label: 'Am J Physiol 2017 — beetroot nitrate decreases central sympathetic outflow: RCT', url: 'https://journals.physiology.org/doi/full/10.1152/ajpheart.00163.2017' },
        { label: 'Am J Medicine (PMC4394901) — valerian for sleep: systematic review & meta-analysis', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4394901/' },
        { label: 'MDPI Foods 2025 — GABA mechanism in improving sleep: review', url: 'https://www.mdpi.com/2304-8158/14/22/3856' },
        { label: 'PMC6836118 — L-theanine reduces stress responses & improves sleep: RCT', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6836118/' },
        { label: 'PMC6750292 — ashwagandha reduces cortisol & anxiety: RCT', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6750292/' }
      ]
    };
    const total = Object.values(groups).reduce((s, g) => s + g.length, 0);
    return `
      <section class="sources-section section-bg-gray">
        <div class="container">
          <h2 class="section-title">Sources</h2>
          <p class="section-sub">Every brand checked against vendor docs; every factor and supplement claim verified against primary research.</p>
          <div class="src-accordion">
            <div class="src-count-badge">${total} sources cited</div>
            ${Object.entries(groups).map(([cat, items]) => `
              <div class="src-group">
                <button class="src-group-toggle" aria-expanded="false">
                  <span class="src-group-name">${cat}</span>
                  <span class="src-group-count">${items.length}</span>
                  <span class="src-group-chevron">${this._icon('chevDown')}</span>
                </button>
                <div class="src-group-body">
                  ${items.map(s => `<a href="${s.url}" class="src-item" target="_blank" rel="noopener"><span class="src-dot"></span><span class="src-text">${s.label}</span><span class="src-ext">${this._icon('externalLink')}</span></a>`).join('')}
                </div>
              </div>`).join('')}
          </div>
        </div>
      </section>`;
  }

  _vpill(kind) {
    const map = {
      moderate: { cls: 'vp-good',  text: 'Moderate' },
      strong:   { cls: 'vp-good',  text: 'Strong' },
      yes:      { cls: 'vp-good',  text: 'Validated' },
      weak:     { cls: 'vp-weak',  text: 'Tested — weak' },
      poor:     { cls: 'vp-none',  text: 'Poor' },
      none:     { cls: 'vp-none',  text: 'None located' },
      na:       { cls: 'vp-na',    text: 'n/a' }
    };
    const m = map[kind] || map.na;
    return `<span class="vpill ${m.cls}">${m.text}</span>`;
  }

  _renderValidationModule() {
    const ranked = Object.entries(this._devices);
    const validated = ranked.filter(([, d]) => d.validation && (d.validation.score === 'moderate' || d.validation.score === 'weak')).length;

    const rows = ranked.map(([key, d]) => {
      const img = this._deviceImage(key);
      const v = d.validation || { score: 'na', signal: 'na', evidence: '' };
      return `
        <tr>
          <th class="vt-brand" scope="row">
            <span class="vt-brand-inner">
              ${img
                ? `<span class="vt-img"><img src="${img}" alt="${d.name}" loading="lazy" /></span>`
                : `<span class="vt-img vt-img--icon" aria-hidden="true">${this._icon('watch')}</span>`}
              <span class="vt-name">${d.name}<span class="vt-score">${d.scoreName}</span></span>
            </span>
          </th>
          <td class="vt-status">${this._vpill(v.score)}</td>
          <td class="vt-status">${this._vpill(v.signal)}</td>
          <td class="vt-ev">${v.evidence}</td>
        </tr>`;
    }).join('');

    return `
      <section class="validation-section section-bg-white" id="validation">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('shield')}</span>Can you trust the number?</span>
            <h2 class="section-h2"><em>${validated} of ${ranked.length}</em> scores have any independent validation.</h2>
            <p class="section-lede">The <strong>scores</strong> are mostly unvalidated black boxes; the underlying <strong>HRV/RHR signals</strong> are validated in some devices. Only WHOOP and Oura have been tested against a reference — and WHOOP's came out weak. Trust the signal, not the score.</p>
            ${this._readMore(this._posts.trust, 'Read: can you trust your recovery score?')}
          </div>

          <div class="device-chart">
            <div class="dc-head">
              <div>
                <span class="dc-eyebrow">Score vs signal</span>
                <h3 class="dc-title">Is it validated — the score, or just the signals?</h3>
                <p class="dc-sub">"None located" is a real finding, not a gap — each brand was searched individually for a study testing its score.</p>
              </div>
              <div class="dc-meta">${ranked.length} brands</div>
            </div>
            <div class="device-table-wrap">
              <table class="device-table vtable">
                <thead>
                  <tr>
                    <th class="vt-th-brand" scope="col">Brand &amp; score</th>
                    <th scope="col">Score validated?</th>
                    <th scope="col">Signals (HRV/RHR)?</th>
                    <th class="vt-th-ev" scope="col">Key evidence</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
          </div>

          <div class="callout-card animate-on-scroll" style="margin-top:24px;">
            <span class="callout-icon" aria-hidden="true">${this._icon('info')}</span>
            <div class="callout-body">
              <h3>The keystone paper</h3>
              <p>Doherty, Baldwin, Altini et al., <em>"Readiness, recovery, and strain: an evaluation of composite health scores in consumer wearables"</em> (Translational Exercise Biomedicine, De Gruyter, 2025) catalogued 14 composite scores across 10 manufacturers. Co-author Marco Altini is an HRV scientist and an Oura advisor, so this is not an anti-wearable piece. Verbatim: <em>"None of the manufacturers disclosed their exact algorithmic formulas, and few provided empirical validation or peer-reviewed evidence supporting the accuracy or clinical relevance of their scores."</em> Most common inputs: HRV 86%, RHR 79%, activity 71%, sleep 71%.</p>
            </div>
          </div>
        </div>
      </section>`;
  }

  _renderFaqSection() {
    const faqs = this._faqs();
    return `
      <section class="faq-section section-bg-white" id="faq">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('info')}</span>Common questions</span>
            <h2 class="section-h2">Recovery scores, <em>answered</em>.</h2>
          </div>
          <div class="faq-list">
            ${faqs.map(f => `
              <details class="faq-item">
                <summary class="faq-q"><span>${f.q}</span><span class="faq-chev" aria-hidden="true">${this._icon('chevDown')}</span></summary>
                <div class="faq-a"><p>${f.a}</p></div>
              </details>`).join('')}
          </div>
        </div>
      </section>`;
  }

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const totalFactors = this._allFactors.length;
    const totalDevices = Object.keys(this._devices).length;

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="header">
        <div class="header-inner">
          <a href="https://www.kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" />
            Recovery Scores
          </a>
          <a href="https://www.kygo.app" class="header-link" target="_blank" rel="noopener">
            Get Kygo Health ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <section class="hero section-bg-white">
        <div class="container hero-inner">
          <div class="hero-kicker animate-on-scroll"><span class="hero-dot" aria-hidden="true"></span>${totalDevices} Wearables · ${totalFactors} Factors</div>
          <h1 class="hero-title animate-on-scroll">Compare recovery scores across <em>12 wearables</em>.</h1>
          <p class="hero-sub animate-on-scroll">See the <strong>${totalFactors} factors</strong> that move yours, and which scores are actually <strong>validated</strong>. They aren't interchangeable — two devices on one wrist disagree — and only <strong>2 of 12</strong> are validated.</p>
          <div class="animate-on-scroll">
            <div class="hero-meta">
              <div class="hero-cell"><span class="hero-num">${totalDevices}</span><span class="hero-lbl">Brands compared</span></div>
              <div class="hero-cell"><span class="hero-num">${totalFactors}</span><span class="hero-lbl">Factors that move it</span></div>
              <div class="hero-cell"><span class="hero-num">2 / 12</span><span class="hero-lbl">Scores validated</span></div>
              <div class="hero-cell"><span class="hero-num">86%</span><span class="hero-lbl">Use HRV as an input</span></div>
            </div>
          </div>
          ${this._heroWaveSvg()}
        </div>
      </section>

      ${this._renderComparisonModule()}
      ${this._renderCtaRow()}
      ${this._renderFactorsSection()}
      ${this._renderArticleCta()}
      ${this._renderFullBreakdown()}
      ${this._renderValidationModule()}
      ${this._renderTopPicks()}
      ${this._renderFaqSection()}
      ${this._renderSourcesSection()}

      <footer class="tool-footer">
        <div class="container">
          <a href="https://www.kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" loading="lazy" />
            Kygo Health
          </a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Always consult a qualified healthcare provider before changing supplement, exercise, or lifestyle routines.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases. Product links on this page are affiliate links — we may earn a commission at no extra cost to you.</p>
          <p class="footer-copyright">© ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  _setupEventDelegation() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const shadow = this.shadowRoot;

    // Replace an element with freshly-parsed HTML. Works whether the parent
    // is a regular Element OR a ShadowRoot/DocumentFragment — `outerHTML =`
    // throws on the latter, so we always go through replaceWith().
    const replaceWithHTML = (oldEl, html) => {
      if (!oldEl) return;
      const tmpl = document.createElement('template');
      tmpl.innerHTML = html;
      const newEl = tmpl.content.firstElementChild;
      if (newEl) oldEl.replaceWith(newEl);
    };

    shadow.addEventListener('click', (e) => {
      if (e.target.closest('.source-link, a[href]')) return;

      const srcToggle = e.target.closest('.src-group-toggle');
      if (srcToggle) {
        const group = srcToggle.closest('.src-group');
        if (group) {
          const isOpen = group.classList.toggle('open');
          srcToggle.setAttribute('aria-expanded', isOpen);
        }
        return;
      }

      const dcRow = e.target.closest('[data-device-row]');
      if (dcRow) {
        const k = dcRow.dataset.deviceRow;
        this._compareExpandedKey = this._compareExpandedKey === k ? null : k;
        replaceWithHTML(shadow.querySelector('.breakdown-section'), this._renderFullBreakdown());
        return;
      }

      const tile = e.target.closest('[data-cat]');
      if (tile) {
        const k = tile.dataset.cat;
        this._categoryFilter = this._categoryFilter === k ? null : k;
        this._listExpandedKey = null;
        replaceWithHTML(shadow.querySelector('.factors-section'), this._renderFactorsSection());
        return;
      }

      const factHead = e.target.closest('.fact-head');
      if (factHead) {
        const card = factHead.closest('[data-fact-key]');
        if (card) {
          const k = card.dataset.factKey;
          this._listExpandedKey = this._listExpandedKey === k ? null : k;
          replaceWithHTML(shadow.querySelector('.fact-groups'), this._renderFactorList());
        }
        return;
      }
    });

    shadow.addEventListener('change', (e) => {
      const sel = e.target.closest('[data-device-select]');
      if (sel) {
        const k = sel.value;
        if (k && this._device1 !== k) {
          this._device1 = k;
          this._categoryFilter = null;
          this._listExpandedKey = null;
          replaceWithHTML(shadow.querySelector('.factors-section'), this._renderFactorsSection());
        }
      }
    });
  }

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
      }, { rootMargin: '0px 0px -50px 0px', threshold: 0.2 });
      els.forEach(el => this._observer.observe(el));
      // Safety net: if the IntersectionObserver hasn't revealed an element
      // within 1.5s (slow scroll, missed callback, prefers-reduced-motion
      // edge cases), reveal it anyway so content is never stuck invisible.
      setTimeout(() => {
        this.shadowRoot.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(el => el.classList.add('visible'));
      }, 1500);
    });
  }

  _styles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

      :host {
        --dark: #1E293B;
        --dark-card: #0F172A;
        --dark-surface: #1a2332;
        --light: #F8FAFC;
        --green: #22C55E;
        --green-dark: #16A34A;
        --green-light: rgba(34,197,94,0.10);
        --green-glow: rgba(34,197,94,0.3);
        --amber: #B45309;
        --amber-light: rgba(180,83,9,0.10);
        --yellow: #FBBF24;
        --red: #EF4444;
        --red-light: rgba(239,68,68,0.10);
        --indigo: #6366F1;
        --gray-50: #f9fafb;
        --gray-100: #F1F5F9;
        --gray-200: #E2E8F0;
        --gray-300: #CBD5E1;
        --gray-400: #94A3B8;
        --gray-600: #475569;
        --gray-700: #334155;
        --radius: 20px;
        --radius-sm: 10px;
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
      a { color: var(--green); text-decoration: none; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; min-width: 0; }

      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: var(--delay, 0ms); }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      :focus { outline: none; }
      button:focus-visible, .source-link:focus-visible, select:focus-visible, a:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; border-radius: 6px; }

      /* HEADER */
      .header { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid var(--gray-200); }
      .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 16px; max-width: 1200px; margin: 0 auto; }
      .logo { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); white-space: nowrap; min-width: 0; }
      .logo-img { height: 26px; width: auto; flex-shrink: 0; }
      .header-link { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: #fff; background: var(--green); padding: 7px 12px; border-radius: 50px; transition: background .2s; white-space: nowrap; flex-shrink: 0; }
      .header-link:hover { background: var(--green-dark); }
      .header-link svg { width: 13px; height: 13px; }

      /* HERO */
      .hero { padding: 40px 0 28px; background: #fff; }
      .hero-inner { position: relative; }
      .hero-kicker { display: inline-flex; align-items: center; gap: 7px; font-size: 9.5px; font-weight: 700; color: var(--green-dark); background: var(--green-light); padding: 6px 11px; border-radius: 9999px; letter-spacing: 0.4px; text-transform: uppercase; margin-bottom: 20px; max-width: 100%; line-height: 1.4; text-align: left; }
      .hero-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 0 rgba(34,197,94,0.6); animation: pulse 2.2s infinite; flex-shrink: 0; }
      @media (min-width: 480px) { .hero-kicker { font-size: 10.5px; white-space: nowrap; } }
      @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.6);} 70%{box-shadow:0 0 0 8px rgba(34,197,94,0);} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0);} }
      .hero-title { font-size: clamp(32px, 8.5vw, 76px); line-height: 1.02; letter-spacing: -0.03em; font-weight: 600; margin: 0; color: var(--dark); max-width: 15ch; }
      .hero-title em { font-style: normal; color: var(--green); font-family: inherit; }
      .hero-sub { margin: 20px 0 0; max-width: 56ch; font-size: clamp(15px, 2.2vw, 19px); line-height: 1.5; color: var(--gray-600); }
      .hero-sub strong { color: var(--dark); font-weight: 600; }
      .hero-meta { margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-top: 1px solid var(--gray-200); padding-top: 20px; max-width: 760px; }
      .hero-meta .hero-cell { padding: 8px 14px 8px 0; border-right: 1px solid var(--gray-200); min-width: 0; }
      .hero-meta .hero-cell:nth-child(2n) { border-right: 0; padding-right: 0; padding-left: 16px; }
      .hero-meta .hero-cell:nth-child(-n+2) { border-bottom: 1px solid var(--gray-200); padding-bottom: 16px; }
      .hero-meta .hero-cell:nth-child(n+3) { padding-top: 16px; }
      .hero-num { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: clamp(26px, 6.5vw, 40px); color: var(--dark); letter-spacing: -0.02em; font-feature-settings: "tnum" 1; display: block; line-height: 1; }
      .hero-num--pos { color: var(--green-dark); }
      .hero-num--neg { color: var(--red); }
      .hero-lbl { font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; color: var(--gray-400); font-weight: 600; margin-top: 6px; display: block; }
      .hero-wave { display: none; }
      @media (min-width: 640px) {
        .hero-meta { grid-template-columns: repeat(4, 1fr); }
        .hero-meta .hero-cell { padding: 0 16px; border-right: 1px solid var(--gray-200); border-bottom: 0 !important; }
        .hero-meta .hero-cell:first-child { padding-left: 0; }
        .hero-meta .hero-cell:last-child { border-right: 0; padding-right: 0; }
        .hero-meta .hero-cell:nth-child(n+3), .hero-meta .hero-cell:nth-child(-n+2) { padding-top: 0; padding-bottom: 0; }
      }
      @media (min-width: 768px) { .hero { padding: 72px 0 48px; } }
      @media (min-width: 1000px) {
        .hero-wave { display: block; position: absolute; right: -20px; top: 30px; width: 46%; max-width: 560px; opacity: 0.9; pointer-events: none; }
      }

      /* SECTION BACKGROUNDS */
      .section-bg-white { background: #fff; }
      .section-bg-gray { background: var(--gray-100); }

      .section-header { margin-bottom: 28px; max-width: 760px; }
      .section-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 10.5px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--green-dark); margin-bottom: 12px; }
      .section-eyebrow-icon { width: 22px; height: 22px; border-radius: 7px; background: var(--green-light); color: var(--green-dark); display: inline-flex; align-items: center; justify-content: center; }
      .section-eyebrow-icon svg { width: 13px; height: 13px; }
      .section-eyebrow.amber { color: var(--amber); }
      .section-eyebrow.amber .section-eyebrow-icon { background: rgba(180,83,9,0.10); color: var(--amber); }
      .section-h2 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: clamp(26px, 5.5vw, 40px); letter-spacing: -0.02em; line-height: 1.08; margin: 0 0 12px; color: var(--dark); }
      .section-h2 em { font-style: normal; color: var(--green); font-family: inherit; }
      .section-lede { font-size: 15px; color: var(--gray-600); line-height: 1.55; margin: 0; max-width: 64ch; }
      .section-title { font-size: clamp(24px, 6vw, 36px); text-align: center; margin-bottom: 8px; }
      .section-sub { text-align: center; color: var(--gray-600); font-size: 15px; margin-bottom: 32px; max-width: 560px; margin-left: auto; margin-right: auto; }
      .comparison-section, .breakdown-section, .factors-section, .callout-section, .sources-section, .picks-section, .myths-section { padding: 48px 0 56px; }
      @media (min-width: 768px) {
        .comparison-section, .factors-section, .callout-section, .sources-section, .picks-section, .myths-section { padding: 64px 0 72px; }
      }

      /* ARTICLE CTA */
      .article-card { position: relative; display: grid; grid-template-columns: auto 1fr auto; grid-template-areas: 'badge . arrow' 'body body body'; align-items: center; gap: 14px 12px; max-width: 780px; margin: 0 auto; padding: 18px; background: linear-gradient(135deg, #F6FBF7 0%, #EEF8F1 100%); border: 1px solid rgba(34,197,94,0.25); border-radius: 18px; text-decoration: none; overflow: hidden; transition: transform .2s ease-out, border-color .2s, box-shadow .2s; }
      .article-card::before { content: ''; position: absolute; top: -40%; right: -10%; width: 55%; height: 180%; background: radial-gradient(ellipse at top right, rgba(34,197,94,0.18), transparent 65%); pointer-events: none; }
      .article-card:hover { border-color: var(--green); transform: translateY(-1px); box-shadow: 0 10px 24px rgba(34,197,94,0.14); }
      .article-badge { grid-area: badge; position: relative; z-index: 1; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--green-dark); background: #fff; padding: 5px 10px; border-radius: 9999px; border: 1px solid rgba(34,197,94,0.3); white-space: nowrap; justify-self: start; }
      .article-body { grid-area: body; position: relative; z-index: 1; min-width: 0; }
      .article-kicker { display: block; font-size: 11px; font-weight: 600; color: var(--green-dark); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 4px; }
      .article-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); margin: 0; line-height: 1.3; letter-spacing: -0.01em; overflow-wrap: anywhere; }
      .article-year { color: var(--gray-400); font-weight: 500; }
      .article-desc { display: none; font-size: 13px; color: var(--gray-600); margin: 6px 0 0; line-height: 1.45; }
      .article-go { grid-area: arrow; position: relative; z-index: 2; width: 36px; height: 36px; border-radius: 50%; background: var(--green); color: #fff; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background .2s; justify-self: end; }
      .article-card:hover .article-go { background: var(--green-dark); }
      .article-go svg { width: 16px; height: 16px; }
      @media (min-width: 768px) {
        .article-card { grid-template-columns: auto 1fr auto; grid-template-areas: 'badge body arrow'; padding: 24px 28px; gap: 18px; border-radius: 22px; }
        .article-title { font-size: 19px; }
        .article-desc { display: block; }
        .article-go { width: 40px; height: 40px; }
        .article-go svg { width: 18px; height: 18px; }
      }

      /* MYTH FILTERS — pill row, no empty state */
      .myth-filters { display: flex; gap: 6px; padding: 4px 2px 16px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .myth-filters::-webkit-scrollbar { height: 4px; }
      .myth-filters::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 4px; }
      .myth-filter { display: inline-flex; align-items: center; gap: 7px; padding: 7px 12px; min-height: 34px; flex-shrink: 0; background: #fff; border: 1px solid var(--gray-200); border-radius: 9999px; font-family: inherit; font-weight: 600; font-size: 12.5px; color: var(--gray-700); cursor: pointer; white-space: nowrap; transition: all .15s; }
      .myth-filter:hover { border-color: var(--gray-300); }
      .myth-filter.active { background: var(--dark); color: #fff; border-color: var(--dark); }
      .myth-filter-count { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 10.5px; color: var(--gray-400); background: var(--gray-100); padding: 1px 6px; border-radius: 9999px; }
      .myth-filter.active .myth-filter-count { background: rgba(255,255,255,0.18); color: #fff; }

      /* MYTH CARDS */
      .myth-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
      .myth-card { position: relative; background: #fff; border: 1px solid var(--gray-200); border-left: 3px solid var(--amber); border-radius: 12px; padding: 14px 16px 14px 14px; transition: border-color .15s, box-shadow .15s, transform .15s; }
      .myth-card:hover { border-color: var(--gray-300); border-left-color: var(--amber); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(15,23,42,0.06); }
      .myth-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
      .myth-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14px; color: var(--dark); margin: 0; line-height: 1.3; flex: 1; min-width: 0; letter-spacing: -0.005em; }
      .myth-badge { font-size: 9.5px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--amber); background: rgba(180,83,9,0.08); padding: 3px 8px; border-radius: 9999px; white-space: nowrap; flex-shrink: 0; }
      .myth-why { margin: 6px 0 8px; font-size: 12.5px; color: var(--gray-600); line-height: 1.55; }
      .myth-cat-tag { display: inline-block; font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--gray-400); }
      @media (min-width: 680px) {
        .myth-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (min-width: 1024px) {
        .myth-grid { grid-template-columns: repeat(2, 1fr); }
      }

      /* DEVICE CHART — matrix table */
      .device-chart { background: #fff; border: 1px solid var(--gray-200); border-radius: 18px; padding: 18px 16px 14px; box-shadow: 0 1px 0 rgba(15,23,42,0.03); }
      @media (min-width: 768px) { .device-chart { padding: 26px 28px 22px; border-radius: 22px; } }
      .dc-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding-bottom: 14px; margin-bottom: 6px; border-bottom: 1px dashed var(--gray-200); }
      .dc-eyebrow { display: block; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--green-dark); margin-bottom: 4px; }
      .dc-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 19px; color: var(--dark); margin: 0 0 6px; letter-spacing: -0.01em; line-height: 1.2; }
      .dc-sub { font-size: 13px; color: var(--gray-600); margin: 0; line-height: 1.5; max-width: 60ch; }
      .dc-meta { font-size: 11.5px; color: var(--gray-400); font-weight: 600; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.6px; }

      .device-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0 -16px; padding: 0 16px 4px; }
      @media (min-width: 768px) { .device-table-wrap { margin: 0; padding: 0; overflow-x: visible; } }
      .device-table { width: 100%; border-collapse: separate; border-spacing: 0; font-feature-settings: "tnum" 1; min-width: 520px; }
      .device-table th, .device-table td { padding: 0; vertical-align: middle; }

      .device-table thead th { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 10.5px; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); text-align: center; padding: 12px 4px; vertical-align: middle; border-bottom: 1px solid var(--gray-200); white-space: nowrap; background: #fff; }
      .device-table thead .dt-th-device { text-align: left; padding-left: 4px; }
      .device-table thead .dt-th-count { text-align: right; padding-right: 4px; }
      .dt-th-full { display: none; }
      .dt-th-short { display: inline; }
      @media (min-width: 768px) {
        .dt-th-full { display: inline; }
        .dt-th-short { display: none; }
        .device-table thead th { font-size: 11px; padding: 14px 6px; }
      }

      .device-table tbody tr { transition: background .15s; }
      .device-table tbody tr + tr td, .device-table tbody tr + tr th { border-top: 1px solid var(--gray-100); }
      .device-table tbody tr:hover { background: var(--gray-50); }
      .device-table tbody tr:hover .dt-td-device { background: var(--gray-50); }

      .dt-td-device { padding: 10px 6px 10px 4px; width: 76px; min-width: 76px; text-align: left; background: #fff; position: sticky; left: 0; z-index: 1; transition: background .15s; box-shadow: 1px 0 0 var(--gray-200); }
      .dt-brand { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 0; text-align: center; }
      .dt-img { width: 36px; height: 36px; border-radius: 9px; background: var(--gray-100); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
      .dt-img img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
      .dt-img--icon { background: var(--accent, var(--gray-200)); color: #fff; }
      .dt-img--icon svg { width: 16px; height: 16px; }
      .dt-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 10.5px; color: var(--dark); letter-spacing: -0.01em; line-height: 1.15; overflow-wrap: anywhere; }
      @media (min-width: 768px) {
        .dt-td-device { padding: 14px 14px 14px 4px; width: auto; min-width: 220px; position: static; box-shadow: none; }
        .dt-brand { flex-direction: row; align-items: center; gap: 10px; text-align: left; }
        .dt-img { width: 40px; height: 40px; border-radius: 10px; }
        .dt-name { font-size: 15px; }
      }

      .device-table tbody td { text-align: center; padding: 10px 6px; }
      @media (min-width: 768px) { .device-table tbody td { padding: 14px 8px; } }
      .dt-mark { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; }
      .device-table tbody td.on .dt-mark { background: var(--green); color: #fff; box-shadow: 0 0 0 3px rgba(34,197,94,0.10); }
      .device-table tbody td.on .dt-mark svg { width: 11px; height: 11px; }
      .device-table tbody td.off .dt-mark { background: var(--gray-100); }
      .dt-dash { display: block; width: 9px; height: 2px; border-radius: 1px; background: var(--gray-300); }
      @media (min-width: 768px) {
        .dt-mark { width: 26px; height: 26px; }
        .device-table tbody td.on .dt-mark svg { width: 12px; height: 12px; }
      }

      .dt-td-count { text-align: right; padding-right: 4px; padding-left: 8px; white-space: nowrap; }
      .dt-count-num { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; color: var(--dark); letter-spacing: -0.02em; }
      .dt-count-lbl { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 11px; color: var(--gray-400); margin-left: 2px; }
      @media (min-width: 768px) {
        .dt-count-num { font-size: 19px; }
        .dt-count-lbl { font-size: 12px; }
      }

      /* DEVICE DETAILS — compact dropdowns below the table */
      .device-details { margin-top: 22px; }
      .dd-section-head { margin-bottom: 12px; }
      .dd-section-eyebrow { display: block; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--green-dark); margin-bottom: 4px; }
      .dd-section-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); margin: 0; letter-spacing: -0.01em; line-height: 1.3; }
      @media (min-width: 768px) { .dd-section-title { font-size: 18px; } }

      .dd-list { display: grid; gap: 10px; grid-template-columns: 1fr; }
      .dd-row { background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; overflow: hidden; transition: border-color .15s, box-shadow .15s; animation: dcGrow .55s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: var(--delay, 0ms); }
      .dd-row:hover { border-color: var(--gray-300); }
      .dd-row.open { box-shadow: 0 8px 24px rgba(15,23,42,0.06); }
      @keyframes dcGrow { from { opacity: 0; transform: translateY(4px); } }

      .dd-row-head { display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px 16px; background: transparent; border: 0; cursor: pointer; font-family: inherit; text-align: left; color: inherit; }
      .dd-row-head:hover { background: var(--gray-50); }
      .dd-img { width: 40px; height: 40px; border-radius: 10px; background: var(--gray-100); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
      .dd-img img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
      .dd-img--icon { background: var(--accent, var(--gray-200)); color: #fff; }
      .dd-img--icon svg { width: 18px; height: 18px; }
      .dd-text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .dd-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15.5px; color: var(--dark); line-height: 1.2; letter-spacing: -0.01em; overflow-wrap: anywhere; }
      .dd-line { display: block; margin-top: 3px; font-size: 12.5px; color: var(--gray-600); line-height: 1.35; overflow-wrap: anywhere; }
      .dd-chev { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 9px; color: var(--gray-400); transition: transform .25s, color .15s, background .15s; flex-shrink: 0; }
      .dd-chev svg { width: 15px; height: 15px; }
      .dd-row-head[aria-expanded="true"] .dd-chev { transform: rotate(180deg); color: var(--green-dark); background: var(--green-light); }

      .dd-body { padding: 0 16px 16px; border-top: 1px dashed var(--gray-200); }
      .dd-body[hidden] { display: none; }
      .dd-body-inner { display: grid; gap: 14px; padding-top: 16px; }
      .dd-fields { display: grid; gap: 12px; margin: 0; }
      .dd-fields > div { display: grid; grid-template-columns: 1fr; gap: 3px; }
      .dd-fields dt { font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); margin: 0; }
      .dd-fields dd { margin: 0; font-size: 13.5px; color: var(--gray-700); line-height: 1.55; }
      .dd-callouts { display: grid; gap: 10px; }
      .dd-callout { padding: 14px 16px; border-radius: 12px; border: 1px solid; }
      .dd-callout.strong { background: rgba(34,197,94,0.06); border-color: rgba(34,197,94,0.22); }
      .dd-callout.watch { background: rgba(180,83,9,0.05); border-color: rgba(180,83,9,0.20); }
      .dd-callout-head { display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 6px; }
      .dd-callout.strong .dd-callout-head { color: var(--green-dark); }
      .dd-callout.watch .dd-callout-head { color: var(--amber); }
      .dd-callout-icon { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; }
      .dd-callout-icon svg { width: 14px; height: 14px; }
      .dd-callout p { margin: 0; font-size: 13.5px; color: var(--gray-700); line-height: 1.55; }
      @media (min-width: 880px) {
        /* Two cards per row on desktop — slightly bigger overall */
        .dd-list { grid-template-columns: 1fr 1fr; gap: 14px; align-items: start; }
        .dd-row { border-radius: 16px; }
        .dd-row-head { padding: 18px 20px; gap: 14px; }
        .dd-img { width: 48px; height: 48px; border-radius: 12px; }
        .dd-img--icon svg { width: 22px; height: 22px; }
        .dd-name { font-size: 17px; letter-spacing: -0.015em; }
        .dd-line { font-size: 13px; margin-top: 4px; }
        .dd-chev { width: 32px; height: 32px; border-radius: 10px; }
        .dd-chev svg { width: 16px; height: 16px; }
        .dd-body { padding: 0 22px 22px; }
        .dd-body-inner { padding-top: 18px; gap: 16px; }
      }

      /* EVIDENCE LEADERBOARD */
      .leaderboard { background: #fff; border: 1px solid var(--gray-200); border-radius: 22px; padding: 22px; box-shadow: 0 1px 0 rgba(15,23,42,0.03); }
      @media (min-width: 768px) { .leaderboard { padding: 28px 30px; } }
      .lb-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding-bottom: 14px; margin-bottom: 14px; border-bottom: 1px dashed var(--gray-200); }
      .lb-head-eyebrow { font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase; color: var(--green-dark); }
      .lb-head-meta { font-size: 12px; color: var(--gray-400); font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase; }
      .lb-rows { display: grid; gap: 6px; }
      .lb-row { display: grid; grid-template-columns: 32px minmax(0, 1.4fr) minmax(0, 2fr) auto; gap: 12px; align-items: center; padding: 10px 12px; background: transparent; border: 0; border-radius: 10px; cursor: pointer; font-family: inherit; text-align: left; transition: background .15s; animation: lbGrow .55s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: var(--delay, 0ms); }
      .lb-row:hover { background: var(--gray-50); }
      .lb-rank { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 700; color: var(--gray-400); font-feature-settings: "tnum" 1; }
      .lb-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14px; color: var(--dark); line-height: 1.2; min-width: 0; overflow-wrap: anywhere; }
      .lb-track { position: relative; height: 10px; background: var(--gray-100); border-radius: 9999px; overflow: hidden; }
      .lb-bar { display: block; height: 100%; border-radius: 9999px; animation: lbBarGrow .7s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: calc(var(--delay, 0ms) + 80ms); }
      .lb-bar.lb-imp-high { background: linear-gradient(90deg, var(--red), #F87171); }
      .lb-bar.lb-imp-med  { background: linear-gradient(90deg, var(--amber), #F59E0B); }
      .lb-bar.lb-imp-low  { background: linear-gradient(90deg, var(--green-dark), #4ADE80); }
      @keyframes lbGrow { from { opacity: 0; transform: translateY(4px); } }
      @keyframes lbBarGrow { from { width: 0 !important; } }
      .lb-impact { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.2px; white-space: nowrap; }
      .lb-impact.lb-imp-high { background: var(--red-light); color: var(--red); }
      .lb-impact.lb-imp-med  { background: var(--amber-light); color: var(--amber); }
      .lb-impact.lb-imp-low  { background: var(--green-light); color: var(--green-dark); }
      .lb-legend { display: flex; gap: 16px; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--gray-100); justify-content: flex-end; flex-wrap: wrap; }
      .lb-legend-item { display: inline-flex; align-items: center; gap: 6px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--gray-400); }
      .lb-sw { width: 12px; height: 6px; border-radius: 3px; }
      .lb-sw.lb-imp-high { background: linear-gradient(90deg, var(--red), #F87171); }
      .lb-sw.lb-imp-med  { background: linear-gradient(90deg, var(--amber), #F59E0B); }
      .lb-sw.lb-imp-low  { background: linear-gradient(90deg, var(--green-dark), #4ADE80); }
      @media (max-width: 540px) {
        .lb-row { grid-template-columns: 28px 1fr auto; gap: 8px; }
        .lb-track { display: none; }
      }

      /* CATEGORY PICKER TILES — RHR style: large white pill cards in a 2 / 4-column grid */
      /* DEVICE PICKER — pick your wearable for the factor list */
      .device-picker { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
      .device-picker-label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase; color: var(--gray-400); }
      .device-select-wrap { position: relative; max-width: 360px; }
      .device-select { width: 100%; appearance: none; -webkit-appearance: none; -moz-appearance: none; padding: 14px 44px 14px 16px; min-height: 52px; background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15.5px; color: var(--dark); letter-spacing: -0.01em; cursor: pointer; transition: border-color .15s, box-shadow .15s; }
      .device-select:hover { border-color: var(--gray-300); }
      .device-select:focus-visible { outline: 0; border-color: var(--green); box-shadow: 0 0 0 3px rgba(34,197,94,0.18); }
      .device-select-chev { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--gray-400); pointer-events: none; display: inline-flex; align-items: center; justify-content: center; }
      .device-select-chev svg { width: 18px; height: 18px; }
      @media (min-width: 880px) {
        .device-picker { flex-direction: row; align-items: center; gap: 14px; }
        .device-select-wrap { max-width: 320px; }
      }

      .picker-tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-bottom: 16px; }
      .picker-tile { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 14px 16px; min-height: 56px; min-width: 0; background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; font-family: inherit; cursor: pointer; transition: border-color .15s, transform .15s, background .15s, box-shadow .15s; text-align: left; color: var(--dark); }
      .picker-tile:hover { border-color: var(--gray-300); transform: translateY(-1px); }
      .picker-tile.active { background: var(--dark); color: #fff; border-color: var(--dark); box-shadow: 0 6px 18px rgba(15,23,42,0.12); }
      .picker-tile-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14.5px; letter-spacing: -0.005em; line-height: 1.2; min-width: 0; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .picker-tile-count { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 12.5px; color: var(--gray-600); background: var(--gray-100); border-radius: 9999px; padding: 3px 9px; min-width: 28px; text-align: center; font-feature-settings: "tnum" 1; flex-shrink: 0; }
      .picker-tile.active .picker-tile-count { background: rgba(255,255,255,0.16); color: #fff; }
      .picker-tiles--metrics { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
      @media (min-width: 560px) { .picker-tiles { grid-template-columns: repeat(3, 1fr); } }
      @media (min-width: 880px) { .picker-tiles { grid-template-columns: repeat(5, 1fr); } }
      @media (min-width: 880px) { .picker-tiles--metrics { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); } }

      /* PICKER PANEL — white card holding the sort bar + factor list */
      .picker-panel { background: #fff; border: 1px solid var(--gray-200); border-radius: 18px; padding: 14px; box-shadow: 0 1px 0 rgba(15,23,42,0.03); min-width: 0; overflow: hidden; }
      .picker-panel-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--gray-100); }
      .picker-panel-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); margin: 0; letter-spacing: -0.01em; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
      .picker-panel-meta { font-size: 11.5px; font-weight: 600; color: var(--gray-400); letter-spacing: 0.5px; text-transform: uppercase; }
      @media (min-width: 768px) { .picker-panel { padding: 24px 26px; border-radius: 22px; } }

      /* SORT BAR — RHR style: count on left, label + pill row on right */
      .list-toolbar { display: flex; flex-direction: column; align-items: stretch; gap: 8px; margin-bottom: 12px; }
      .list-toolbar-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .list-sort-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.7px; color: var(--gray-400); font-weight: 600; }
      .list-result-count { font-size: 12px; font-weight: 500; color: var(--gray-600); font-feature-settings: "tnum" 1; }
      .list-result-count strong { color: var(--dark); font-weight: 700; }
      .list-sort-btns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
      .list-sort-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 38px; padding: 8px 10px; border-radius: 9999px; border: 1px solid var(--gray-200); background: #fff; color: var(--gray-600); font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .15s; }
      .list-sort-btn:hover { border-color: var(--gray-400); }
      .list-sort-btn.active { background: var(--dark); color: #fff; border-color: var(--dark); }
      @media (min-width: 680px) {
        .list-toolbar { flex-direction: row; align-items: center; justify-content: space-between; gap: 14px; }
        .list-toolbar-row { gap: 14px; }
        .list-sort-btns { display: flex; gap: 6px; flex-wrap: wrap; }
        .list-sort-btn { padding: 8px 14px; min-height: 36px; }
      }

      /* FACTOR CARDS — clean RHR pattern: eyebrow + name + sub + value pill + chevron */
      .fact-groups { display: grid; grid-template-columns: 1fr; gap: 18px; min-width: 0; }
      .fact-group { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
      .fact-group-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 0 2px 4px; border-bottom: 1px dashed var(--gray-200); }
      .fact-group-label { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13.5px; letter-spacing: -0.005em; }
      .fact-group-icon { width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; line-height: 1; flex-shrink: 0; }
      .fact-group--helps .fact-group-label { color: var(--green-dark); }
      .fact-group--helps .fact-group-icon { background: var(--green); color: #fff; }
      .fact-group--helps .fact-group-icon::after { content: '↓'; }
      .fact-group--hurts .fact-group-label { color: var(--red); }
      .fact-group--hurts .fact-group-icon { background: var(--red); color: #fff; }
      .fact-group--hurts .fact-group-icon::after { content: '↑'; }
      .fact-group-meta { font-size: 11px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; color: var(--gray-400); white-space: nowrap; }
      @media (min-width: 880px) { .fact-groups { grid-template-columns: 1fr 1fr; gap: 22px; } }
      .fact-list { display: grid; grid-template-columns: 1fr; gap: 8px; }
      .fact-card { background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; overflow: hidden; min-width: 0; transition: border-color .15s, box-shadow .15s; }
      .fact-card:hover { border-color: var(--gray-300); }
      .fact-card.expanded { box-shadow: 0 6px 18px rgba(15,23,42,0.06); border-color: var(--gray-300); }
      .fact-head { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 10px; width: 100%; padding: 12px 14px; background: transparent; border: 0; cursor: pointer; font-family: inherit; text-align: left; }
      .fact-head:hover { background: var(--gray-50); }
      .fact-meta { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .fact-cat { display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-size: 9.5px; font-weight: 700; letter-spacing: 0.9px; text-transform: uppercase; color: var(--gray-400); line-height: 1; margin-bottom: 4px; }
      .fact-dir { font-size: 11px; font-weight: 700; line-height: 1; }
      .fact-dir-pos { color: var(--green-dark); }
      .fact-dir-neg { color: var(--red); }
      .fact-dir-var { color: var(--amber); }
      .fact-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); line-height: 1.25; letter-spacing: -0.005em; overflow-wrap: anywhere; }
      .fact-effect { font-size: 12.5px; color: var(--gray-600); line-height: 1.4; margin-top: 2px; }
      .fact-effect.fact-dir-pos { color: var(--green-dark); }
      .fact-effect.fact-dir-neg { color: var(--red); }
      .fact-effect.fact-dir-var { color: var(--amber); }
      .fact-ev-inline { color: var(--gray-400); font-weight: 500; }
      .fact-lede { margin: 0 0 14px; font-size: 14px; line-height: 1.6; color: var(--dark); font-weight: 500; overflow-wrap: anywhere; }
      .fact-fields { display: grid; gap: 12px; margin: 0 0 4px; min-width: 0; }
      .fact-fields > div { display: grid; grid-template-columns: 1fr; gap: 3px; min-width: 0; }
      .fact-fields dt { font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); margin: 0; }
      .fact-fields dd { margin: 0; font-size: 13.5px; color: var(--gray-700); line-height: 1.55; overflow-wrap: anywhere; }
      @media (min-width: 768px) { .fact-fields { grid-template-columns: 1fr 1fr; gap: 14px 24px; } .fact-fields--full { grid-column: 1 / -1; } }
      .metric-tiles-label { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase; color: var(--gray-400); margin: 6px 0 8px; }
      /* Pills always sit on a neutral grey chip; only the label color shifts. */
      .fact-pill { font-family: 'Space Grotesk', sans-serif; font-size: 12.5px; font-weight: 700; padding: 5px 11px; border-radius: 9px; white-space: nowrap; min-width: 60px; text-align: center; letter-spacing: -0.005em; background: var(--gray-100); color: var(--gray-400); }
      @media (min-width: 480px) { .fact-pill { font-size: 14px; padding: 6px 14px; border-radius: 10px; min-width: 84px; } }
      .fact-pill.imp-med  { color: var(--dark); }
      .fact-pill.imp-low  { color: var(--gray-400); }
      .fact-group--helps .fact-pill.imp-high { color: var(--green-dark); }
      .fact-group--hurts .fact-pill.imp-high { color: var(--red); }
      .fact-chev { width: 18px; height: 18px; color: var(--gray-400); display: inline-flex; align-items: center; justify-content: center; transition: transform .2s; flex-shrink: 0; }
      .fact-chev svg { width: 16px; height: 16px; }
      .fact-card.expanded .fact-chev { transform: rotate(180deg); color: var(--green-dark); }
      @media (min-width: 768px) {
        .fact-list { gap: 10px; }
        .fact-card { border-radius: 16px; }
        .fact-head { padding: 16px 20px; gap: 8px 14px; }
        .fact-name { font-size: 16px; }
        .fact-effect { font-size: 13px; }
      }

      /* IMPACT BADGE & PILL */
      .impact-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 9px; border-radius: 9999px; font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: 0.2px; white-space: nowrap; }
      .impact-dot { width: 6px; height: 6px; border-radius: 50%; }
      .impact-badge.imp-high { background: var(--red-light); color: var(--red); }
      .impact-badge.imp-high .impact-dot { background: var(--red); }
      .impact-badge.imp-med { background: var(--amber-light); color: var(--amber); }
      .impact-badge.imp-med .impact-dot { background: var(--amber); }
      .impact-badge.imp-low { background: var(--green-light); color: var(--green-dark); }
      .impact-badge.imp-low .impact-dot { background: var(--green); }

      .impact-pill { display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px 7px 10px; border-radius: 12px; font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 700; white-space: nowrap; min-width: 130px; justify-content: flex-start; letter-spacing: -0.01em; }
      .impact-pill.imp-high { background: var(--red-light); color: var(--red); }
      .impact-pill.imp-med  { background: var(--amber-light); color: var(--amber); }
      .impact-pill.imp-low  { background: var(--green-light); color: var(--green-dark); }
      .impact-pill-bars { display: inline-flex; align-items: flex-end; gap: 2px; height: 14px; }
      .impact-pill-bars .bar { width: 3px; border-radius: 1px; background: currentColor; opacity: 0.25; }
      .impact-pill-bars .b1 { height: 5px; }
      .impact-pill-bars .b2 { height: 9px; }
      .impact-pill-bars .b3 { height: 13px; }
      .impact-pill.imp-low .b1 { opacity: 1; }
      .impact-pill.imp-med .b1, .impact-pill.imp-med .b2 { opacity: 1; }
      .impact-pill.imp-high .b1, .impact-pill.imp-high .b2, .impact-pill.imp-high .b3 { opacity: 1; }
      .impact-pill-text { font-feature-settings: "tnum" 1; }

      /* HURTS / HELPS BODY */
      .fact-body { padding: 6px 18px 18px; border-top: 1px dashed var(--gray-200); background: var(--gray-50); }
      .device-block { padding-top: 14px; }
      .device-block + .device-block { margin-top: 8px; padding-top: 14px; border-top: 1px dashed var(--gray-200); }
      .device-block-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
      .device-block-name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13.5px; color: var(--dark); padding-left: 10px; border-left: 3px solid var(--accent, var(--green)); letter-spacing: 0.1px; }
      .hh-grid { display: grid; gap: 10px; grid-template-columns: 1fr; }
      @media (min-width: 720px) { .hh-grid { grid-template-columns: 1fr 1fr; } }
      .hh-col { background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; padding: 16px 18px; transition: border-color .2s, box-shadow .2s; }
      .hh-col.hh-hurts { border-left: 4px solid var(--red); }
      .hh-col.hh-helps { border-left: 4px solid var(--green); }
      .hh-col.hh-hurts:hover { border-color: rgba(239,68,68,0.4); border-left-color: var(--red); }
      .hh-col.hh-helps:hover { border-color: rgba(34,197,94,0.4); border-left-color: var(--green); }
      .hh-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
      .hh-eyebrow { font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase; }
      .hh-hurts .hh-eyebrow { color: var(--red); }
      .hh-helps .hh-eyebrow { color: var(--green-dark); }
      .hh-magnitude { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; color: var(--red); background: var(--red-light); padding: 3px 9px; border-radius: 6px; }
      .hh-timeline { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; color: var(--green-dark); background: var(--green-light); padding: 3px 9px; border-radius: 6px; }
      .hh-body { margin: 0 0 10px; font-size: 13.5px; color: var(--gray-700); line-height: 1.55; }
      .hh-tag { display: inline-block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--gray-400); padding: 3px 8px; background: var(--gray-100); border-radius: 6px; }
      .hh-missing { padding: 16px; background: #fff; border: 1px dashed var(--gray-200); border-radius: 12px; font-size: 13px; color: var(--gray-600); text-align: center; line-height: 1.5; }

      .fact-source-row { margin-top: 16px; padding-top: 12px; border-top: 1px dashed var(--gray-200); display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
      .fact-source-lbl { font-size: 10px; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); font-weight: 700; }
      .source-link { display: inline-flex; align-items: center; gap: 4px; color: var(--green-dark); font-weight: 500; font-size: 13px; overflow-wrap: anywhere; min-width: 0; }
      .source-link svg { width: 12px; height: 12px; }
      .source-link:hover { color: var(--green); }

      /* CTA ROW — combined article + app CTA */
      /* APP CTA — centered card on white section, mirrors RHR */
      .app-cta-section { padding: 48px 0; background: #fff; }
      @media (min-width: 768px) { .app-cta-section { padding: 64px 0; } }
      .article-section { padding: 48px 0; background: #fff; }
      @media (min-width: 768px) { .article-section { padding: 64px 0; } }
      .app-cta { position: relative; background: linear-gradient(135deg, var(--dark-card) 0%, var(--gray-700) 100%); border-radius: var(--radius); padding: 32px 24px; text-align: center; max-width: 680px; margin: 0 auto; overflow: hidden; }
      .app-cta-glow { position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%); pointer-events: none; }
      .app-cta-content { position: relative; z-index: 1; }
      .app-cta-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,197,94,0.15); color: var(--green); padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
      .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulseDot 2s infinite; }
      @keyframes pulseDot { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }
      .app-cta h2 { color: #fff; font-size: clamp(22px, 5vw, 30px); margin: 0 0 12px; line-height: 1.2; letter-spacing: -0.01em; }
      .app-cta .highlight { color: var(--green); }
      .app-cta p { color: var(--gray-400); font-size: 14px; margin: 0 auto 20px; max-width: 480px; line-height: 1.55; }
      .app-cta-buttons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
      @media (max-width: 480px) { .app-cta-buttons { flex-direction: column; align-items: stretch; } .app-cta-buttons a { justify-content: center; text-align: center; } }
      .app-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; }
      .app-cta-btn:hover { background: var(--green-dark); }
      .app-cta-btn svg { width: 18px; height: 18px; }
      .app-cta-android { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; }
      .app-cta-android:hover { background: var(--green-dark); color: #fff; }
      .app-cta-android svg { width: 18px; height: 18px; }
      .app-cta-tags { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 20px; flex-wrap: nowrap; }
      .app-cta-tags-label { color: var(--gray-400); font-size: 11px; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
      .app-cta-tags-logos { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; overflow: hidden; }
      .app-cta-tags-logos img { height: 18px; width: auto; opacity: 0.75; flex-shrink: 1; min-width: 0; object-fit: contain; }
      @media (min-width: 480px) { .app-cta-tags-logos img { height: 20px; } .app-cta-tags-label { font-size: 12px; } }
      @media (min-width: 768px) { .app-cta-tags-logos { gap: 8px; } .app-cta-tags-logos img { height: 22px; } }

      /* TOP PICKS */
      .picks-card { position: relative; background: var(--dark-card); color: #fff; border-radius: 24px; padding: 36px 22px; overflow: hidden; }
      .picks-glow { position: absolute; top: 0; right: 0; width: 90%; max-width: 520px; aspect-ratio: 1 / 1; background: radial-gradient(ellipse at top right, rgba(34,197,94,0.22) 0%, rgba(34,197,94,0.08) 35%, transparent 70%); pointer-events: none; }
      .picks-head { position: relative; z-index: 1; margin-bottom: 24px; }
      .picks-eyebrow { display: block; font-size: 11px; letter-spacing: 0.6px; text-transform: uppercase; color: rgba(255,255,255,0.5); font-weight: 600; margin-bottom: 8px; }
      .picks-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; color: #fff; margin: 0; font-size: clamp(26px, 5.5vw, 40px); letter-spacing: -0.02em; line-height: 1.08; }
      .picks-title em { font-style: normal; color: var(--green); font-family: inherit; }
      .picks-grid { display: grid; grid-template-columns: 1fr; gap: 12px; position: relative; z-index: 1; }
      .pick-card { position: relative; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 22px 20px 20px; transition: transform .25s ease-out, background .25s ease-out, border-color .25s ease-out; }
      .pick-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(34,197,94,0.5); transform: translateY(-3px); }
      .pick-card.warn { border-color: rgba(239,68,68,0.35); }
      .pick-card.warn:hover { border-color: rgba(239,68,68,0.6); }
      .pick-card.myth { border-color: rgba(251,191,36,0.32); }
      .pick-card.myth:hover { border-color: rgba(251,191,36,0.55); }
      .pick-icon { position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 9px; background: rgba(34,197,94,0.15); color: var(--green); display: inline-flex; align-items: center; justify-content: center; }
      .pick-card.warn .pick-icon { background: rgba(239,68,68,0.18); color: #FCA5A5; }
      .pick-card.myth .pick-icon { background: rgba(251,191,36,0.16); color: #FCD34D; }
      .pick-icon svg { width: 18px; height: 18px; }
      .pick-label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: rgba(255,255,255,0.42); font-weight: 600; max-width: calc(100% - 44px); }
      .pick-stat { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 28px; color: var(--green); margin: 8px 0 6px; letter-spacing: -0.02em; line-height: 1; }
      .pick-card.warn .pick-stat { color: #FCA5A5; }
      .pick-card.myth .pick-stat { color: #FCD34D; }
      .pick-answer { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 17px; color: #fff; line-height: 1.2; margin: 0; }
      .pick-note { margin: 10px 0 0; font-size: 13px; color: rgba(255,255,255,0.62); line-height: 1.5; }
      @media (min-width: 768px) { .picks-card { padding: 48px 36px; border-radius: 28px; } .picks-grid { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 1024px) { .picks-grid { grid-template-columns: 1fr 1fr 1fr; } }

      /* CALLOUT */
      .callout-card { display: flex; gap: 16px; align-items: flex-start; background: var(--dark-card); color: #fff; padding: 26px 24px; border-radius: 18px; max-width: 880px; margin: 0 auto; }
      .callout-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(34,197,94,0.18); color: var(--green); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .callout-icon svg { width: 20px; height: 20px; }
      .callout-body h3 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 19px; margin-bottom: 8px; letter-spacing: -0.01em; }
      .callout-body p { font-size: 14px; color: rgba(255,255,255,0.78); line-height: 1.6; margin: 0; }
      .callout-body em { color: var(--green); font-style: normal; font-weight: 600; }

      /* SOURCES */
      .src-accordion { max-width: 780px; margin: 0 auto; }
      .src-count-badge { text-align: center; font-size: 13px; font-weight: 600; color: var(--gray-400); margin-bottom: 16px; }
      .src-group { border: 1px solid var(--gray-200); border-radius: var(--radius-sm); margin-bottom: 8px; overflow: hidden; background: #fff; }
      .src-group-toggle { display: flex; align-items: center; width: 100%; padding: 12px 16px; background: none; border: none; cursor: pointer; font-family: inherit; gap: 8px; }
      .src-group-name { flex: 1; text-align: left; font-size: 14px; font-weight: 600; color: var(--dark); }
      .src-group-count { font-size: 11px; font-weight: 600; color: var(--gray-400); background: var(--gray-100); padding: 2px 8px; border-radius: 50px; }
      .src-group-chevron { width: 18px; height: 18px; color: var(--gray-400); transition: transform 0.3s; display: flex; }
      .src-group-chevron svg { width: 18px; height: 18px; }
      .src-group.open .src-group-chevron { transform: rotate(180deg); }
      .src-group-body { max-height: 0; overflow: hidden; transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1); }
      .src-group.open .src-group-body { max-height: 800px; }
      .src-item { display: flex; align-items: center; gap: 8px; padding: 8px 16px; text-decoration: none; color: var(--gray-600); font-size: 13px; transition: background 0.2s; }
      .src-item:last-child { padding-bottom: 12px; }
      .src-item:hover { background: var(--gray-50); }
      .src-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
      .src-text { flex: 1; }
      .src-ext { width: 14px; height: 14px; color: var(--gray-400); flex-shrink: 0; }
      .src-ext svg { width: 14px; height: 14px; }

      /* FOOTER */
      .tool-footer { padding: 48px 0 32px; text-align: center; border-top: 1px solid var(--gray-200); }
      .footer-brand { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); text-decoration: none; margin-bottom: 8px; }
      .footer-logo { height: 24px; width: auto; }
      .footer-tagline { font-size: 13px; color: var(--gray-400); margin-bottom: 16px; }
      .footer-disclaimer { font-size: 11px; color: var(--gray-400); line-height: 1.5; max-width: 560px; margin: 0 auto 12px; }
      .footer-copyright { font-size: 12px; color: var(--gray-400); margin-bottom: 4px; }

      .dash-empty { padding: 24px 18px; text-align: center; color: var(--gray-400); font-size: 14px; background: #fff; border: 1px dashed var(--gray-200); border-radius: 16px; }

      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .pulse-dot, .hero-dot { animation: none; }
        .lb-row, .lb-bar, .pick-card, .fact-card, .device-card { animation: none; transition: none; }
        .faq-item { transition: none; }
      }

      /* FACTOR GROUPS — let the head wrap on narrow screens instead of clipping the sub-text */
      .fact-group-head { flex-wrap: wrap; gap: 2px 12px; }
      .fact-group-meta { white-space: normal; }
      /* FACTOR GROUPS — recovery: raises (green ↑), lowers (slate ↓), modifiers (↕) */
      .fact-group--raises .fact-group-label { color: var(--green-dark); }
      .fact-group--raises .fact-group-icon { background: var(--green); color: #fff; }
      .fact-group--raises .fact-group-icon::after { content: '↑'; }
      .fact-group--lowers .fact-group-label { color: var(--dark); }
      .fact-group--lowers .fact-group-icon { background: var(--dark); color: #fff; }
      .fact-group--lowers .fact-group-icon::after { content: '↓'; }
      .fact-group--modifier .fact-group-label { color: var(--gray-600); }
      .fact-group--modifier .fact-group-icon { background: var(--gray-400); color: #fff; }
      .fact-group--modifier .fact-group-icon::after { content: '↕'; }
      .fact-group--lowers .fact-pill.imp-high { color: var(--dark); }
      .fact-group--raises .fact-pill.imp-high { color: var(--green-dark); }
      /* direction chip in the card eyebrow: lowers uses dark (no off-brand red emphasis here) */
      .fact-dir-neg { color: var(--dark); }
      .fact-effect.fact-dir-neg { color: var(--gray-600); }
      .fact-dir-var, .fact-effect.fact-dir-var { color: var(--gray-600); }

      /* VALIDATION TABLE — text-heavy variant of the matrix table */
      .vtable { min-width: 660px; }
      .vtable thead th { text-align: left; padding: 12px 10px; }
      .vtable thead .vt-th-brand { padding-left: 4px; text-align: center; }
      .vtable tbody td, .vtable tbody th { text-align: left; vertical-align: top; padding: 14px 10px; }
      /* Brand cell: narrow, logo stacked above name (matches the chart above) */
      .vt-brand { width: 92px; min-width: 92px; background: #fff; position: sticky; left: 0; z-index: 1; box-shadow: 1px 0 0 var(--gray-200); padding: 14px 6px !important; }
      .device-table.vtable tbody tr:hover .vt-brand { background: var(--gray-50); }
      .vt-brand-inner { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; }
      .vt-img { width: 38px; height: 38px; border-radius: 9px; background: var(--gray-100); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
      .vt-img img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
      .vt-img--icon { background: var(--gray-400); color: #fff; }
      .vt-img--icon svg { width: 16px; height: 16px; }
      .vt-name { display: flex; flex-direction: column; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 12px; color: var(--dark); line-height: 1.15; overflow-wrap: anywhere; }
      .vt-score { font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 10.5px; color: var(--gray-400); margin-top: 3px; line-height: 1.2; }
      .vt-status { width: 116px; }
      .vt-ev { font-size: 12.5px; color: var(--gray-600); line-height: 1.5; min-width: 300px; }
      .vpill { display: inline-block; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.1px; white-space: nowrap; }
      .vpill.vp-good { background: var(--green-light); color: var(--green-dark); }
      .vpill.vp-weak { background: var(--dark); color: #fff; }
      .vpill.vp-none { background: var(--gray-100); color: var(--gray-600); }
      .vpill.vp-na { background: var(--gray-100); color: var(--gray-400); }
      @media (min-width: 768px) {
        .vt-brand { width: 132px; min-width: 132px; position: static; box-shadow: none; }
        .vt-name { font-size: 13.5px; }
        .vt-img { width: 42px; height: 42px; }
      }

      /* FAQ — left-align the list with the section header (was centered) */
      .faq-list { max-width: 820px; margin: 0; display: grid; gap: 10px; }
      .faq-item { background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; overflow: hidden; transition: border-color .15s, box-shadow .15s; }
      .faq-item[open] { border-color: var(--gray-300); box-shadow: 0 6px 18px rgba(15,23,42,0.06); }
      .faq-item:hover { border-color: var(--gray-300); }
      .faq-q { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 16px 18px; cursor: pointer; list-style: none; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); line-height: 1.3; letter-spacing: -0.005em; }
      .faq-q::-webkit-details-marker { display: none; }
      .faq-chev { width: 20px; height: 20px; color: var(--gray-400); flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; transition: transform .25s, color .15s; }
      .faq-chev svg { width: 18px; height: 18px; }
      .faq-item[open] .faq-chev { transform: rotate(180deg); color: var(--green-dark); }
      .faq-a { padding: 0 18px 18px; border-top: 1px dashed var(--gray-200); }
      .faq-a p { margin: 14px 0 0; font-size: 14px; color: var(--gray-700); line-height: 1.6; }
      .validation-section { padding: 48px 0 56px; }
      @media (min-width: 768px) { .validation-section, .faq-section { padding: 64px 0 72px; } }
      .faq-section { padding: 48px 0 56px; }

      /* FACTOR EXPLORER — category prompt shown before a chip is picked */
      .fact-prompt { text-align: center; padding: 28px 18px 10px; }
      .fact-prompt-ic { width: 44px; height: 44px; border-radius: 12px; background: var(--green-light); color: var(--green-dark); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; }
      .fact-prompt-ic svg { width: 22px; height: 22px; }
      .fact-prompt-lead { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); margin: 0 0 14px; letter-spacing: -0.01em; }
      .fact-prompt-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
      .fact-prompt-chip { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13px; color: var(--dark); background: var(--gray-100); border: 1px solid var(--gray-200); border-radius: 9999px; padding: 8px 14px; cursor: pointer; transition: background .15s, border-color .15s, color .15s; }
      .fact-prompt-chip:hover { background: var(--green-light); border-color: var(--green); color: var(--green-dark); }

      /* SECTION DEEP-LINK — small read-more under a section lede */
      .section-readmore { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; color: var(--green-dark); letter-spacing: -0.005em; transition: gap .15s, color .15s; }
      .section-readmore:hover { color: var(--green); gap: 9px; }
      .section-readmore span { display: inline-flex; }
      .section-readmore svg { width: 15px; height: 15px; }

      /* APP CTA — center the "Works with" logo row */
      .app-cta-tags { justify-content: center; flex-wrap: wrap; gap: 10px 12px; }
      .app-cta-tags-logos { flex: 0 1 auto; overflow: visible; justify-content: center; }

      /* CATEGORY TILES — icon + single-word label */
      .picker-tile-main { display: inline-flex; align-items: center; gap: 9px; min-width: 0; flex: 1; }
      .picker-tile-ic { width: 26px; height: 26px; border-radius: 8px; background: var(--green-light); color: var(--green-dark); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background .15s, color .15s; }
      .picker-tile-ic svg { width: 15px; height: 15px; }
      .picker-tile.active .picker-tile-ic { background: rgba(255,255,255,0.16); color: #fff; }

      /* VALIDATION CARD — grey header band for visual separation */
      .validation-section .device-chart { padding-top: 0; overflow: hidden; }
      .validation-section .dc-head { background: var(--gray-100); margin: 0 -16px 14px; padding: 18px 16px 16px; border-bottom: 1px solid var(--gray-200); }
      @media (min-width: 768px) {
        .validation-section .dc-head { margin: 0 -28px 16px; padding: 22px 28px 18px; }
      }

      /* AMAZON BUY LINK — inside brand deep-dive cards */
      .dd-buy-row { display: flex; flex-direction: column; gap: 6px; }
      .dd-buy { display: inline-flex; align-items: center; justify-content: center; gap: 8px; align-self: flex-start; padding: 11px 18px; border-radius: 10px; background: var(--green); color: #fff; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13.5px; letter-spacing: -0.005em; transition: background .2s; }
      .dd-buy:hover { background: var(--green-dark); color: #fff; }
      .dd-buy-cart { width: 16px; height: 16px; display: inline-flex; }
      .dd-buy-cart svg { width: 16px; height: 16px; }
      .dd-buy-go { width: 13px; height: 13px; opacity: 0.85; display: inline-flex; }
      .dd-buy-go svg { width: 13px; height: 13px; }
      .dd-buy-aff { font-size: 10.5px; color: var(--gray-400); letter-spacing: 0.2px; }
      /* Affiliate buy link inside an expanded factor card */
      .fact-buy-row { display: flex; flex-direction: column; gap: 6px; margin-top: 14px; padding-top: 12px; border-top: 1px dashed var(--gray-200); }
      .dd-buy--sm { padding: 9px 14px; font-size: 12.5px; }
      .dd-buy--sm .dd-buy-cart { width: 15px; height: 15px; }
      .dd-buy--sm .dd-buy-cart svg { width: 15px; height: 15px; }
      /* Footer Amazon Associates disclosure */
      .footer-affiliate { max-width: 560px; margin: 0 auto 10px; line-height: 1.5; font-size: 11px; }
      /* Keystone callout — stack the icon above the text on mobile so the paragraph
         uses the full width instead of being indented behind the icon */
      @media (max-width: 600px) {
        .callout-card { flex-direction: column; gap: 12px; padding: 22px 20px; }
      }
    `;
  }
}

if (!customElements.get('kygo-recovery-scores')) {
  customElements.define('kygo-recovery-scores', KygoRecoveryScores);
}
