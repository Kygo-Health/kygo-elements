/**
 * Kygo Health — Calorie Burn Accuracy Calculator
 * Tag name: kygo-calorie-burn-accuracy
 * Enter your wearable's reported calorie burn and see the likely actual range, backed by
 * peer-reviewed per-activity accuracy data. Compares Apple Watch, Fitbit, Garmin, WHOOP,
 * Oura Ring and Samsung Galaxy Watch across 7 activity types.
 * Data: "Wearable Calorie & Activity Tracking" research (primary-source re-audit 2026-07-08).
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

class KygoCalorieBurnAccuracy extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._selectedDevice = 'apple';
    this._selectedActivity = 'steady-cardio';
    this._reportedCalories = null;
    this._result = null;
  }

  connectedCallback() {
    this.render();
    this._setupEvents();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, this._seoText());
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Brand product images (shared Wix assets, by device key) ─────────────

  _deviceImage(key) {
    return ({
      garmin:  'https://static.wixstatic.com/media/273a63_c545c093c04d4ca4ade77e5ca43fd433~mv2.png',
      apple:   'https://static.wixstatic.com/media/273a63_68b4900c356b4d0c8982e5ecd10f04fe~mv2.png',
      fitbit:  'https://static.wixstatic.com/media/273a63_c12bab319dc34737a386c7449f5f92c7~mv2.png',
      samsung: 'https://static.wixstatic.com/media/273a63_21fd42e4a5d1459bb6db751a0ea5e161~mv2.png',
      whoop:   'https://static.wixstatic.com/media/273a63_c52aaaca1f7243f3818cf51d9374dbd4~mv2.png',
      oura:    'https://static.wixstatic.com/media/273a63_722e50e1a554453eb4c71a2e7a58925d~mv2.png'
    })[key] || null;
  }

  _deviceLogo(key, name) {
    const img = this._deviceImage(key);
    return img
      ? `<span class="brand-img"><img src="${img}" alt="${name}" loading="lazy" /></span>`
      : `<span class="brand-img brand-img--icon">${this._icon('watch')}</span>`;
  }

  // ── Activities (calculator + matrix columns) ────────────────────────────

  get _activities() {
    return {
      'steady-cardio': { name: 'Steady cardio', short: 'Steady', icon: 'heart', desc: 'Elliptical, rowing, stair-climber at a consistent pace.' },
      'running':       { name: 'Running',       short: 'Running', icon: 'run',  desc: 'Outdoor or treadmill running.' },
      'walking':       { name: 'Walking',       short: 'Walking', icon: 'walk', desc: 'Outdoor or treadmill walking.' },
      'cycling':       { name: 'Cycling',       short: 'Cycling', icon: 'bike', desc: 'Indoor or outdoor cycling.' },
      'hiit':          { name: 'HIIT',          short: 'HIIT',    icon: 'zap',  desc: 'High-intensity interval training with rapid heart-rate swings.' },
      'strength':      { name: 'Strength',      short: 'Strength',icon: 'dumbbell', desc: 'Weightlifting and resistance training.' },
      'swimming':      { name: 'Swimming',      short: 'Swim',    icon: 'swim', desc: 'Pool or open-water swimming.' }
    };
  }

  // ── Device data ─────────────────────────────────────────────────────────
  // acc[activity] = { mape, lo, hi, dir, ev, src }
  //   ev: 'measured'  = peer-reviewed per-activity MAPE (shown in the published matrix)
  //       'estimated' = extrapolated from the device's overall/related data (calculator only)
  //       'untested'  = never metabolically tested & not calculable — no number is published
  //   dir: 'over' | 'under' | 'mixed'

  get _devices() {
    return {
      apple: {
        name: 'Apple Watch', short: 'Apple', key: 'apple',
        affiliate: 'https://www.amazon.com/s?k=Apple%20Watch&rh=p_123%3A110955&tag=kygohealthapp-20', trackLabel: 'apple-watch-search',
        headline: '~28%', headlineLabel: 'daily calorie error (MAPE)',
        headlineSrc: 'Choe & Kang 2025 · 56-study meta-analysis',
        bias: 'Overestimates in women, underestimates in men',
        algorithm: 'Proprietary ML neural networks trained on metabolic-chamber studies — combines heart rate, motion, GPS speed, elevation and your profile. Active + Resting calories are summed for the total.',
        sensors: 'Optical HR (green-LED PPG), 3-axis accelerometer, gyroscope, GPS, barometric altimeter.',
        bmr: 'Resting rate likely from the Harris-Benedict equation (Apple does not disclose it).',
        strengths: ['Most-studied device — a 56-study meta-analysis', 'Reasonable for steady-state cardio and walking', 'Heart-rate itself is excellent (~4.4% MAPE)'],
        weaknesses: ['Systematic sex bias (over in women, under in men)', 'Overestimates strength training by ~53%', 'No body-composition input'],
        source: 'Choe & Kang 2025, Physiological Measurement (56-study meta-analysis)',
        sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/40199339/',
        acc: {
          'steady-cardio': { mape: 18, lo: 15, hi: 22, dir: 'mixed', ev: 'estimated' },
          'running':       { mape: 24, lo: 18, hi: 30, dir: 'mixed', ev: 'measured', src: 'Frontiers in Physiology 2022' },
          'walking':       { mape: 20, lo: 15, hi: 25, dir: 'over',  ev: 'measured', src: 'Frontiers in Physiology 2022 (19.8%)' },
          'cycling':       { mape: 45, lo: 35, hi: 55, dir: 'mixed', ev: 'estimated' },
          'hiit':          { mape: 30, lo: 20, hi: 45, dir: 'mixed', ev: 'estimated' },
          'strength':      { mape: 53, lo: 40, hi: 65, dir: 'over',  ev: 'measured', src: 'J Sci Med Sport 2023 (52.95%, Apple Watch 6)' },
          'swimming':      { mape: 45, lo: 17, hi: 90, dir: 'mixed', ev: 'measured', src: 'Single 2018 study (n=78) — huge variance' }
        }
      },
      fitbit: {
        name: 'Fitbit', short: 'Fitbit', key: 'fitbit',
        affiliate: 'https://www.amazon.com/s?k=Fitbit%3A&rh=p_123%3A213215&tag=kygohealthapp-20', trackLabel: 'fitbit-search',
        headline: '~16%', headlineLabel: 'daily calorie error (MAPE)',
        headlineSrc: 'Free-living Flex / Charge HR studies',
        bias: 'Near-zero average bias, but wide individual swing (−5 to +6 kcal/min)',
        algorithm: 'Heart rate is the primary driver: each minute in an HR zone becomes METs, then calories using your weight. Steps only matter indirectly by raising HR.',
        sensors: '3-axis accelerometer, optical HR, altimeter, gyroscope; Charge 6 adds ECG, SpO2, EDA and skin temperature.',
        bmr: 'A standard metabolic equation (likely Mifflin-St Jeor — undisclosed).',
        strengths: ['Best running accuracy of any brand (~4–15%)', 'Near-zero average bias across a 52-study meta-analysis', 'SmartTrack auto-detects common activities'],
        weaknesses: ['Walking heavily overestimated (older Charge 2, ~54%)', 'Near-zero average masks huge individual variance (−5 to +6 kcal/min)', 'No independent Charge 6 / Sense 2 calorie validation yet'],
        source: 'Chevance et al. 2022, JMIR mHealth (52-study meta-analysis)',
        sourceUrl: 'https://mhealth.jmir.org/2022/4/e35626',
        acc: {
          'steady-cardio': { mape: 20, lo: 15, hi: 28, dir: 'mixed', ev: 'estimated' },
          'running':       { mape: 10, lo: 4,  hi: 15, dir: 'under', ev: 'measured', src: 'Aberystwyth 2019 / Health & Technology 2019' },
          'walking':       { mape: 54, lo: 54, hi: 69, dir: 'over',  ev: 'measured', src: 'Aberystwyth 2019 (53.5%, Charge 2)' },
          'cycling':       { mape: 40, lo: 39, hi: 40, dir: 'over',  ev: 'measured', src: 'Health & Technology 2019 (Charge 2)' },
          'hiit':          { mape: 35, lo: 25, hi: 50, dir: 'mixed', ev: 'estimated' },
          'strength':      { mape: 40, lo: 30, hi: 50, dir: 'mixed', ev: 'estimated' },
          'swimming':      { mape: 45, lo: 35, hi: 55, dir: 'mixed', ev: 'estimated' }
        }
      },
      garmin: {
        name: 'Garmin', short: 'Garmin', key: 'garmin',
        affiliate: 'https://www.amazon.com/s?k=garmin%20fitness%20tracker&tag=kygohealthapp-20', trackLabel: 'garmin-search',
        headline: '6.7%', headlineLabel: 'best case — med/hard cardio',
        headlineSrc: 'Independent JMIR mHealth 2017 (Firstbeat modeling)',
        bias: 'Underestimates in ~69% of observations (JMIR 2020 review)',
        algorithm: 'Firstbeat engine: beat-by-beat R-R interval analysis derives respiration rate from HRV, estimates VO2, then converts to METs → calories. Adding respiration lifts accuracy over HR-only methods.',
        sensors: 'PPG optical HR (Elevate Gen 4 red/IR; Gen 5 adds green LEDs), accelerometer, GPS, ANT+/BLE chest-strap compatible.',
        bmr: 'A standard metabolic equation (undisclosed); nudged up for light daily movement.',
        strengths: ['Most sophisticated engine (Firstbeat HRV modeling)', 'Best measured cardio accuracy (~6.7% med/hard)', 'A paired chest strap sharply improves accuracy'],
        weaknesses: ['Resting calories widely reported ~15–20% too high', 'Underestimates in ~69% of observations', 'Strength training ~57% off (Vivosmart HR)'],
        source: 'Firstbeat physiological-modeling validation (2017), JMIR mHealth',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5548984/',
        acc: {
          'steady-cardio': { mape: 7,  lo: 5,  hi: 10, dir: 'under', ev: 'measured', src: 'JMIR mHealth 2017 (6.7%, med/hard)' },
          'running':       { mape: 22, lo: 15, hi: 28, dir: 'mixed', ev: 'measured', src: 'Frontiers in Physiology 2022 (21.8%)' },
          'walking':       { mape: 32, lo: 22, hi: 43, dir: 'mixed', ev: 'measured', src: 'Frontiers in Physiology 2022 (32.0%)' },
          'cycling':       { mape: 40, lo: 30, hi: 52, dir: 'under', ev: 'estimated' },
          'hiit':          { mape: 25, lo: 15, hi: 35, dir: 'mixed', ev: 'estimated' },
          'strength':      { mape: 57, lo: 45, hi: 65, dir: 'mixed', ev: 'measured', src: 'IJERPH 2019 (57.02%, Vivosmart HR)' },
          'swimming':      { mape: 25, lo: 18, hi: 33, dir: 'mixed', ev: 'measured', src: 'Single 2018 study (17.9–32.7%)' }
        }
      },
      whoop: {
        name: 'WHOOP', short: 'WHOOP', key: 'whoop',
        affiliate: 'https://www.amazon.com/s?k=whoop%20fitness%20tracker&tag=kygohealthapp-20', trackLabel: 'whoop-search',
        headline: '~12%', headlineLabel: 'best case — steady cardio',
        headlineSrc: 'Univ. of Colorado Boulder 2022',
        bias: 'Recovery-coupled — the same workout can read differently by day',
        algorithm: 'ACSM metabolic equations extended by Keytel et al. 2005: Calories = BMR + f(heart rate), activating once HR rises above your resting baseline. Recovery status shifts the estimate.',
        sensors: 'Advanced PPG (MAX86171 on 4.0), accelerometer, skin temperature, SpO2; 5.0 adds ~26 Hz sampling + respiratory rate.',
        bmr: 'Age, sex, height, weight; 5.0 adds a 30-day personalized calibration window.',
        strengths: ['Unusually transparent that absolute calories aren\'t its strength', 'Built for relative strain and recovery trends', 'HR/HRV signal itself is well-validated (Bellenger 2021)'],
        weaknesses: ['Overestimates HIIT sessions by ~13%', 'Resistance training ~29% off', 'Widely-cited 18.4% TDEE figure has no locatable primary publication'],
        source: 'University of Colorado Boulder 2022 (Bellenger 2021 validates HR/HRV only)',
        sourceUrl: 'https://www.whoop.com/us/en/thelocker/calorie-tracking-science/',
        acc: {
          'steady-cardio': { mape: 12, lo: 8,  hi: 18, dir: 'mixed', ev: 'measured', src: 'Colorado Boulder 2022 (~12%)' },
          'running':       { mape: 18, lo: 12, hi: 25, dir: 'mixed', ev: 'estimated' },
          'walking':       { mape: 25, lo: 18, hi: 35, dir: 'mixed', ev: 'estimated' },
          'cycling':       { mape: 35, lo: 25, hi: 45, dir: 'mixed', ev: 'estimated' },
          'hiit':          { mape: 13, lo: 6,  hi: 30, dir: 'over',  ev: 'measured', src: 'J Sci Med Sport 2023 (12.7% overest.)' },
          'strength':      { mape: 29, lo: 20, hi: 40, dir: 'mixed', ev: 'measured', src: 'Colorado Boulder 2022 (~29%)' },
          'swimming':      { mape: 40, lo: 30, hi: 50, dir: 'mixed', ev: 'estimated' }
        }
      },
      oura: {
        name: 'Oura Ring', short: 'Oura', key: 'oura',
        affiliate: 'https://www.amazon.com/s?k=Oura%20Ring&tag=kygohealthapp-20', trackLabel: 'oura-ring-search',
        headline: '13%', headlineLabel: 'daily error, free-living',
        headlineSrc: 'Kristiansson et al. 2023 (BMC) — confirmed',
        bias: 'Underestimates more as intensity rises',
        algorithm: 'BMR + activity calories via METs across the day (resets at 4 AM). A Nov 2024 update folded in HR intensity, cutting median active-calorie error by 53%. Recognizes 40+ activity types.',
        sensors: '18-path multi-wavelength PPG (red/IR/green LEDs), 3D accelerometer, 2 precision thermistors.',
        bmr: 'A standard metabolic equation using age, sex, height and weight.',
        strengths: ['Best daily/free-living accuracy measured (13%)', 'Strong lab correlation (r=0.93)', 'Finger PPG gives a cleaner resting signal than the wrist'],
        weaknesses: ['No GPS; poor for cycling/elliptical (no hand motion)', 'Underestimation grows with intensity', 'Never metabolically tested for cycling, HIIT, strength or swimming'],
        source: 'Kristiansson et al. 2023, BMC Medical Research Methodology',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9950693/',
        acc: {
          // Walking/running are a MET-derived floor (mean systematic underestimation, not a true MAPE).
          'steady-cardio': { mape: 15, lo: 10, hi: 22, dir: 'under', ev: 'estimated' },
          'running':       { mape: 24, lo: 18, hi: 32, dir: 'under', ev: 'measured', src: 'Kristiansson 2023 (MET-derived floor, ~24%)' },
          'walking':       { mape: 19, lo: 13, hi: 28, dir: 'under', ev: 'measured', src: 'Kristiansson 2023 (MET-derived floor, ~19%)' },
          // Never tested — no number is published (research flags any Oura figure here as unsourced).
          'cycling':       { mape: null, dir: 'under', ev: 'untested' },
          'hiit':          { mape: null, dir: 'under', ev: 'untested' },
          'strength':      { mape: null, dir: 'under', ev: 'untested' },
          'swimming':      { mape: null, dir: 'under', ev: 'untested' }
        }
      },
      samsung: {
        name: 'Samsung Galaxy Watch', short: 'Samsung', key: 'samsung',
        affiliate: 'https://www.amazon.com/s?k=samsung%20galaxy%20watch&rh=p_72%3A1248879011&tag=kygohealthapp-20', trackLabel: 'samsung-watch-search',
        headline: '~3%', headlineLabel: 'intermittent running vs gold standard',
        headlineSrc: 'JMIR Formative Research 2026 (GW6/7)',
        bias: 'Too few studies to establish a pattern',
        algorithm: 'HR-VO2 relationships combined with accelerometer and GPS; MET tables applied to recognized activities. Watch 7 adds a BIA body-composition sensor whose role in the calorie model is undocumented.',
        sensors: 'Optical HR (PPG), 3-axis accelerometer, gyroscope, barometer, GPS; Watch 7 adds the BioActive sensor (ECG, BIA body composition).',
        bmr: 'A standard metabolic equation (undisclosed — Harris-Benedict or Mifflin-St Jeor).',
        strengths: ['Excellent for intermittent running (~3% vs gold standard)', 'BioActive sensor can read body composition (Watch 7+)', 'Tight Samsung Health integration'],
        weaknesses: ['Far less independent research than Apple/Fitbit/Garmin', 'No published calorie white papers', 'Not enough studies to characterize other activities'],
        source: 'Samsung Galaxy Watch 6/7 intermittent-running validation (2026), JMIR Formative Research',
        sourceUrl: 'https://formative.jmir.org/2026/1/e83090',
        acc: {
          'steady-cardio': { mape: 15, lo: 9,  hi: 21, dir: 'mixed', ev: 'estimated' },
          'running':       { mape: 3,  lo: 2,  hi: 9,  dir: 'mixed', ev: 'measured', src: 'JMIR Formative Research 2026 (GW6/7)' },
          'walking':       { mape: 15, lo: 9,  hi: 21, dir: 'mixed', ev: 'estimated' },
          'cycling':       { mape: 18, lo: 9,  hi: 21, dir: 'mixed', ev: 'estimated' },
          'hiit':          { mape: 18, lo: 9,  hi: 21, dir: 'mixed', ev: 'estimated' },
          'strength':      { mape: 20, lo: 9,  hi: 21, dir: 'mixed', ev: 'estimated' },
          'swimming':      { mape: 20, lo: 9,  hi: 21, dir: 'mixed', ev: 'estimated' }
        }
      }
    };
  }

  get _populationFactors() {
    return [
      { title: 'Body composition / BMI', impact: 'high', desc: 'Algorithms are trained on average builds. Very lean, muscular or higher-BMI bodies skew the HR-to-calorie conversion — Fitbit is specifically less accurate at higher BMI.' },
      { title: 'Medications (beta-blockers, stimulants)', impact: 'high', desc: 'Beta-blockers cap heart rate and cause big underestimation; stimulants raise resting HR and inflate the count. Devices can\'t detect either.' },
      { title: 'Tattoos', impact: 'high', desc: 'Dense or dark ink over the sensor blocks light transmission and can make wrist PPG readings unreliable.' },
      { title: 'Device fit & placement', impact: 'high', desc: 'Loose bands, wrist hair and low placement all add motion artifact. The band should sit snug, 1–2 finger-widths above the wrist bone.' },
      { title: 'Skin tone', impact: 'moderate', desc: 'LED optical sensors read darker pigmentation less consistently. Garmin Elevate Gen 5 and Apple Series 9+ improved this, but a Series 9 study still found tracking inconsistent across pigmentation groups.' },
      { title: 'Sex', impact: 'moderate', desc: 'Apple Watch shows a systematic bias — overestimating in women and underestimating in men (Choe & Kang 2025).' },
      { title: 'Age', impact: 'moderate', desc: 'Optical signal quality drops with skin changes, and the 220−age max-HR assumption drifts further off with age.' },
      { title: 'Caffeine & hormonal state', impact: 'moderate', desc: 'Caffeine lifts heart rate independent of effort; menstrual cycle, thyroid and other hormonal shifts move metabolic rate in ways no wearable can see.' }
    ];
  }

  get _faqs() {
    return [
      { q: 'How accurate is Apple Watch calorie burn?',
        a: 'A 56-study meta-analysis (Choe & Kang 2025) puts Apple Watch daily calorie error near 28% (MAPE), even though its heart-rate accuracy is excellent (~4.4%). It reads most accurately for steady cardio and walking (~20%) and worst for strength training, where it overestimates by about 53%. It also carries a systematic sex bias — overestimating in women and underestimating in men.' },
      { q: 'Which wearable is most accurate for calories?',
        a: 'It depends on the activity. For everyday totals, the Oura Ring has the lowest measured free-living error (13%, Kristiansson 2023). For medium-to-hard cardio, Garmin\'s Firstbeat engine hit about 6.7% in one independent study. Samsung logged ~3% for intermittent running. No device is reliable across the board — activity type matters more than brand.' },
      { q: 'Why does my wearable overestimate or underestimate calories?',
        a: 'Wearables don\'t measure calories directly — they infer them from heart rate, motion and your profile, so the conversion carries the error. Sex, skin tone, body composition, medications (beta-blockers, stimulants), tattoos and band fit all shift the result. Static, low-motion work like strength training is the hardest case for every brand.' },
      { q: 'Is the calorie number on my watch good enough for a diet?',
        a: 'Not for precise nutrition math. Real-world calorie error runs 15–40%+, and the Stanford 2017 study found some devices off by up to 93%. Use the number for week-over-week trends and relative effort, not as an exact figure to eat back.' },
      { q: 'How accurate is Oura, WHOOP or Garmin for exercise calories?',
        a: 'Oura is strong at daily totals but was never metabolically tested for cycling, HIIT, strength or swimming — any per-activity figure for those is unsourced, so we don\'t publish one. WHOOP is transparent that absolute calories aren\'t its focus (it overestimates HIIT ~13%, strength ~29%). Garmin is best for steady cardio but ~57% off for strength.' },
      { q: 'How does this calculator work?',
        a: 'Pick your device and activity, enter the calories it reported, and the tool applies the peer-reviewed per-activity error and bias direction for that exact combination to show your likely actual range. Where no direct per-activity study exists, the result is clearly flagged as an estimate rather than presented as fact.' }
    ];
  }

  get _sourceGroups() {
    return [
      { key: 'cross',   label: 'Multi-device & gold standard' },
      { key: 'apple',   label: 'Apple Watch', device: 'apple' },
      { key: 'fitbit',  label: 'Fitbit', device: 'fitbit' },
      { key: 'garmin',  label: 'Garmin', device: 'garmin' },
      { key: 'whoop',   label: 'WHOOP', device: 'whoop' },
      { key: 'oura',    label: 'Oura Ring', device: 'oura' },
      { key: 'samsung', label: 'Samsung Galaxy Watch', device: 'samsung' }
    ];
  }

  get _sources() {
    return [
      { group: 'cross', tag: 'Anchor · multi-device', title: 'Shcherbina et al. 2017 — Stanford 7-device study', cite: 'J Personalized Medicine · 27–93% EE error', url: 'https://pubmed.ncbi.nlm.nih.gov/28538708/' },
      { group: 'cross', tag: 'Apple / Garmin', title: 'Frontiers in Physiology 2022 — walking & running', cite: 'Series 6 + Garmin vs COSMED K5, 20 participants', url: 'https://pubmed.ncbi.nlm.nih.gov/36225296/' },
      { group: 'cross', tag: 'Fitbit / Apple / Garmin', title: 'JMIR mHealth 2017 — Charge HR comparison', cite: '62 participants · error rises with intensity', url: 'https://mhealth.jmir.org/2017/3/e34/' },
      { group: 'cross', tag: 'Gold standard', title: 'Murakami et al. 2019 — 12-device DLW validation', cite: 'JMIR mHealth · only 2 of 12 acceptable free-living', url: 'https://mhealth.jmir.org/2019/8/e13938' },
      { group: 'apple', tag: 'Anchor · Apple', title: 'Choe & Kang 2025 — Apple Watch meta-analysis', cite: 'Physiological Measurement · 56 studies · 27.96%', url: 'https://pubmed.ncbi.nlm.nih.gov/40199339/' },
      { group: 'apple', tag: 'Apple', title: 'J Sci Med Sport 2023 — resistance training', cite: 'Apple Watch 6 · 52.95% overestimation', url: 'https://www.jsams.org/article/S1440-2440(23)00177-9/fulltext' },
      { group: 'apple', tag: 'Apple', title: 'MDPI Sensors 2024 — Series 9 skin pigmentation', cite: 'Tracking inconsistent across pigmentation groups', url: 'https://www.mdpi.com/2411-5142/9/4/275' },
      { group: 'apple', tag: 'Apple', title: 'Apple — Heart Rate & Calorimetry white paper (2024)', cite: 'Manufacturer method documentation', url: 'https://www.apple.com/health/pdf/Heart_Rate_Calorimetry_Activity_on_Apple_Watch_November_2024.pdf' },
      { group: 'fitbit', tag: 'Anchor · Fitbit', title: 'Chevance et al. 2022 — Fitbit meta-analysis', cite: 'JMIR mHealth · 52 studies · wide variance', url: 'https://mhealth.jmir.org/2022/4/e35626' },
      { group: 'fitbit', tag: 'Fitbit', title: 'Health & Technology 2019 — Charge 2 breakdown', cite: 'Springer · 59 adults · walking/running/cycling', url: 'https://link.springer.com/article/10.1007/s12553-019-00392-7' },
      { group: 'fitbit', tag: 'Fitbit', title: 'Fitbit — How calorie burn is calculated', cite: 'Manufacturer method documentation', url: 'https://support.google.com/fitbit/answer/14237111' },
      { group: 'garmin', tag: 'Garmin', title: 'JMIR mHealth 2017 — Firstbeat modeling (PulseOn)', cite: '6.7% med/hard · 16.5% light intensity', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5548984/' },
      { group: 'garmin', tag: 'Garmin', title: 'IJERPH 2019 — Vivosmart HR resistance', cite: '57.02% MAPE · no device < 25% for resistance', url: 'https://pubmed.ncbi.nlm.nih.gov/29189666/' },
      { group: 'garmin', tag: 'Garmin', title: 'JMIR mHealth 2020 — wrist-wearable review', cite: 'Underestimated EE in 69% of observations', url: 'https://mhealth.jmir.org/2020/9/e18694' },
      { group: 'garmin', tag: 'Garmin', title: 'MDPI Applied Sciences 2025 — Vivoactive 4', cite: 'Treadmill · 19.1% MAPE', url: 'https://www.mdpi.com/2076-3417/16/3/1286' },
      { group: 'garmin', tag: 'Garmin', title: 'Firstbeat — Energy expenditure white paper', cite: 'Manufacturer method documentation', url: 'https://assets.firstbeat.com/firstbeat/uploads/2015/10/white_paper_energy_expenditure_estimation.pdf' },
      { group: 'whoop', tag: 'WHOOP', title: 'Bellenger et al. 2021 — HR/HRV validation', cite: 'Sensors · validates HR & HRV only, not calories', url: 'https://www.mdpi.com/1424-8220/21/10/3571' },
      { group: 'whoop', tag: 'WHOOP', title: 'Keytel et al. 2005 — HR-to-EE equation', cite: 'J Sports Sciences · basis of WHOOP\'s algorithm', url: 'https://pubmed.ncbi.nlm.nih.gov/15966347/' },
      { group: 'whoop', tag: 'WHOOP', title: 'WHOOP — How calories are calculated', cite: 'Manufacturer method documentation', url: 'https://support.whoop.com/hc/en-us/articles/360033775513-How-does-WHOOP-calculate-calories-burned-' },
      { group: 'oura', tag: 'Oura', title: 'Kristiansson et al. 2023 — EE validation', cite: 'BMC Med Res Methodology · 13% free-living, 21.1% lab', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9950693/' },
      { group: 'oura', tag: 'Oura', title: 'Oura — Activity improvements (Nov 2024)', cite: 'HR integration cut median active-calorie error 53%', url: 'https://ouraring.com/blog/activity-improvements/' },
      { group: 'samsung', tag: 'Samsung', title: 'JMIR Formative Research 2026 — Galaxy Watch 6/7', cite: 'Intermittent running · no sig. diff vs calorimetry', url: 'https://formative.jmir.org/2026/1/e83090' }
    ];
  }

  // ── SEO light-DOM summary ───────────────────────────────────────────────

  _seoText() {
    return 'Calorie Burn Accuracy Calculator by Kygo Health. How accurate is your wearable\'s calorie burn? No wearable measures calories directly — they estimate energy expenditure from heart rate, motion and your profile, and that conversion carries 15–40%+ error in the real world (Stanford 2017 found 27–93% across seven devices), even though heart rate itself is measured well (~96%). Enter the calories your device reported for a given activity and see the likely actual range, the typical error, and whether that device and activity tend to over- or under-estimate. Devices compared: Apple Watch (daily error ~28% MAPE, Choe & Kang 2025 56-study meta-analysis; overestimates in women, underestimates in men; strength training overestimated ~53%; walking ~20%, running ~24%), Fitbit (near-zero average bias but −5 to +6 kcal/min individual swing, Chevance 2022 52-study meta-analysis; best running accuracy 4–15%; older Charge 2 walking overestimated ~54%; cycling ~40%; daily ~16%), Garmin (Firstbeat engine; best measured cardio ~6.7% med/hard, JMIR 2017; walking ~32%, running ~22%, strength ~57%; underestimates in ~69% of observations; resting calories run high), WHOOP (ACSM/Keytel 2005 equation; steady cardio ~12%, HIIT overestimated ~13%, strength ~29%; the widely-cited 18.4% TDEE figure has no locatable primary publication; Bellenger 2021 validates HR/HRV only, not calories), Oura Ring (best measured daily/free-living error 13%, Kristiansson 2023; walking ~19% and running ~24% are MET-derived floors, not true MAPE; underestimates more as intensity rises; never metabolically tested for cycling, HIIT, strength or swimming, so no per-activity figure is published for those), and Samsung Galaxy Watch (~3% for intermittent running, JMIR Formative Research 2026; 9–21% elsewhere; limited independent research). Accuracy by activity: steady cardio is best across brands (7–20%), running 4–24%, walking surprisingly poor (20–69% overestimation), cycling 40–52%, HIIT variable, strength training worst (29–57%), swimming poor and largely untested on rings and straps. Factors that skew every device: body composition and BMI, medications (beta-blockers, stimulants), tattoos, band fit, skin tone, sex, age, caffeine and hormonal state. Bottom line: use wearable calories for week-over-week trends and relative effort, not precise nutrition math. Apple Watch vs Fitbit vs Garmin vs WHOOP vs Oura vs Samsung calorie accuracy. Research re-audited against primary sources July 2026.';
  }

  // ── Icons ───────────────────────────────────────────────────────────────

  _icon(name) {
    const icons = {
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
      arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
      arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>',
      swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8h13M7 8l3-3M7 8l3 3M17 16H4m13 0l-3-3m3 3l-3 3"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
      run: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="2"/><path d="m6 20 2-5 3 1 1 4"/><path d="m5 11 4-2 3 3 4-1"/></svg>',
      walk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><path d="m10 22 1-6-2-2 1-5 3 3 2 1"/><path d="m9 9-2 4"/></svg>',
      bike: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 17.5 9 9l3-3 3 3 2 1M9 9H6"/></svg>',
      zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5 17.5 17.5M4 8v8M8 4v6M20 8v8M16 14v6M2 12h2M20 12h2"/></svg>',
      swim: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="17" cy="6" r="2"/><path d="m4 15 3-2 3 2 3-2 3 2 3-2M4 19l3-2 3 2 3-2 3 2 3-2M6 12l4-4 2 1"/></svg>',
      watch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"/><polyline points="12 10 12 12 13 13"/><path d="m9 4.5.5-2.5h5l.5 2.5"/><path d="m9 19.5.5 2.5h5l.5-2.5"/></svg>',
      apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg>',
      android: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>'
    };
    return `<span class="ico">${icons[name] || icons.info}</span>`;
  }

  // ── Calculator ──────────────────────────────────────────────────────────

  _dirMeta(dir) {
    if (dir === 'over') return { cls: 'over', icon: 'arrowUp', label: 'Usually overestimates', note: 'so your actual burn is likely lower than reported.' };
    if (dir === 'under') return { cls: 'under', icon: 'arrowDown', label: 'Usually underestimates', note: 'so your actual burn is likely higher than reported.' };
    return { cls: 'mixed', icon: 'swap', label: 'Highly variable', note: 'so your actual burn could land either side of the reported number.' };
  }

  _compute() {
    const d = this._devices[this._selectedDevice];
    const a = d.acc[this._selectedActivity];
    const reported = this._reportedCalories;
    if (!a) return null;
    if (a.ev === 'untested') return { untested: true };
    if (!reported || reported <= 0) return null;

    const lo = a.lo / 100, hi = a.hi / 100, mid = a.mape / 100;
    let low, high, best;
    if (a.dir === 'over') {
      low = Math.round(reported * (1 - hi));
      high = Math.round(reported * (1 - lo));
      best = Math.round(reported * (1 - mid));
    } else if (a.dir === 'under') {
      low = Math.round(reported * (1 + lo));
      high = Math.round(reported * (1 + hi));
      best = Math.round(reported * (1 + mid));
    } else {
      low = Math.round(reported * (1 - hi));
      high = Math.round(reported * (1 + hi));
      best = reported;
    }
    return {
      untested: false, low: Math.max(0, low), high: Math.max(0, high), best: Math.max(0, best),
      mape: a.mape, lo: a.lo, hi: a.hi, dir: a.dir, ev: a.ev, src: a.src || null
    };
  }

  _renderResults() {
    const d = this._devices[this._selectedDevice];
    const act = this._activities[this._selectedActivity];
    const r = this._result;
    if (!r) return '';

    if (r.untested) {
      return `
        <div class="res-untested">
          <span class="res-untested-badge">${this._icon('info')} Not independently tested</span>
          <h3>${d.name} has never been metabolically tested for ${act.name.toLowerCase()}.</h3>
          <p>Kristiansson 2023 — the only lab validation of Oura energy expenditure — excluded cycling, HIIT, strength and swimming, so there is <strong>no validated per-activity number</strong> to publish. Any specific ${act.name.toLowerCase()} figure you see elsewhere for Oura is unsourced.</p>
          <p class="res-untested-why">Because the ring reads no hand motion during ${act.name.toLowerCase()} and relies on generic MET tables, its estimate here is expected to be unreliable. Pick a tested activity (running, walking or daily total) for a grounded range.</p>
        </div>`;
    }

    const dm = this._dirMeta(r.dir);
    const span = Math.max(r.high - r.low, 1);
    const bestPct = Math.min(96, Math.max(4, ((r.best - r.low) / span) * 100));
    const reportedInSpan = this._reportedCalories >= r.low && this._reportedCalories <= r.high;
    const reportedPct = reportedInSpan ? ((this._reportedCalories - r.low) / span) * 100 : null;
    const evChip = r.ev === 'measured'
      ? `<span class="ev-chip ev-measured">${this._icon('check')} Peer-reviewed data</span>`
      : `<span class="ev-chip ev-est">Estimated — no direct study for this pairing</span>`;

    return `
      <div class="res-head">
        <div class="res-label">Likely actual burn · ${d.short}</div>
        <div class="res-best">${r.best.toLocaleString()}</div>
        <div class="res-unit">kcal &nbsp;·&nbsp; your device reported ${this._reportedCalories.toLocaleString()}</div>
        ${evChip}
      </div>

      <div class="res-bar" role="img" aria-label="Likely range ${r.low} to ${r.high} kcal, best estimate ${r.best}">
        <div class="res-bar-track">
          <div class="res-bar-fill" style="left:0;width:100%"></div>
          ${reportedPct !== null ? `<span class="res-bar-reported" style="left:${reportedPct}%" title="Reported ${this._reportedCalories}"></span>` : ''}
          <span class="res-bar-best" style="left:${bestPct}%"><span class="res-bar-dot"></span></span>
        </div>
        <div class="res-bar-labels"><span>Low ${r.low.toLocaleString()}</span><span>High ${r.high.toLocaleString()}</span></div>
      </div>

      <div class="res-grid">
        <div class="res-card">
          <div class="res-card-label">Typical error</div>
          <div class="res-card-value">±${r.mape}%</div>
        </div>
        <div class="res-card">
          <div class="res-card-label">Bias direction</div>
          <div class="res-card-value res-card-dir ${dm.cls}">${this._icon(dm.icon)} ${r.dir === 'mixed' ? 'Variable' : (r.dir === 'over' ? 'Over' : 'Under')}</div>
        </div>
      </div>

      <div class="res-tendency ${dm.cls}">${this._icon(dm.icon)} <span><strong>${dm.label}</strong> for ${act.name.toLowerCase()} — ${dm.note}</span></div>

      <details class="res-detail">
        <summary>How ${d.short} calculated this ${this._icon('arrowRight')}</summary>
        <div class="res-detail-body">
          <p><strong>Algorithm.</strong> ${d.algorithm}</p>
          <p><strong>Sensors.</strong> ${d.sensors}</p>
          ${r.src ? `<p class="res-src">${this._icon('info')} Per-activity error from ${r.src}. Individual results vary with the factors below.</p>`
                  : `<p class="res-src">${this._icon('info')} No direct ${act.name.toLowerCase()} study exists for ${d.short}; this range is extrapolated from its overall accuracy and should be treated as indicative.</p>`}
        </div>
      </details>`;
  }

  _renderCalculator() {
    const devButtons = Object.values(this._devices).map(d => `
      <button class="dev-btn${d.key === this._selectedDevice ? ' active' : ''}" data-device="${d.key}" role="tab" aria-selected="${d.key === this._selectedDevice}">
        ${this._deviceLogo(d.key, d.name)}
        <span>${d.short}</span>
      </button>`).join('');

    const actButtons = Object.entries(this._activities).map(([k, a]) => `
      <button class="act-btn${k === this._selectedActivity ? ' active' : ''}" data-activity="${k}" role="tab" aria-selected="${k === this._selectedActivity}">
        ${this._icon(a.icon)}<span>${a.name}</span>
      </button>`).join('');

    return `
      <div class="calc">
        <div class="calc-form">
          <div class="calc-group">
            <label>Your wearable</label>
            <div class="dev-btns" role="tablist">${devButtons}</div>
          </div>
          <div class="calc-group">
            <label>Activity</label>
            <div class="act-btns" role="tablist">${actButtons}</div>
          </div>
          <div class="calc-group">
            <label>Calories it reported</label>
            <div class="calc-input">
              <input type="number" inputmode="numeric" min="0" placeholder="e.g. 400" data-input="calories" value="${this._reportedCalories || ''}" aria-label="Calories your device reported" />
              <span class="calc-unit">kcal</span>
            </div>
          </div>
          <button class="btn btn-primary btn-block" data-action="calculate">${this._icon('flame')} Reveal my likely burn</button>
        </div>
        <div class="calc-result${this._result ? ' show' : ''}" data-section="result">
          <div class="calc-placeholder">
            <div class="calc-placeholder-vis">
              <span style="height:38%"></span><span style="height:64%"></span><span style="height:48%"></span><span style="height:82%"></span>
            </div>
            <div class="calc-placeholder-title">Your likely range appears here</div>
            <div class="calc-placeholder-desc">Choose a device and activity, enter your reported calories, then reveal the peer-reviewed actual range.</div>
          </div>
          <div class="calc-live">${this._renderResults()}</div>
        </div>
      </div>`;
  }

  // ── Accuracy matrix (published data only) ───────────────────────────────

  _matrixCell(a) {
    if (!a || a.ev === 'untested') return `<td><span class="mk-na" title="Never tested on this device">${this._icon('minus')}</span></td>`;
    if (a.ev === 'estimated') return `<td><span class="mk-na" title="No peer-reviewed per-activity study">${this._icon('minus')}</span></td>`;
    const dm = this._dirMeta(a.dir);
    return `<td><span class="mk-val ${dm.cls}">${this._icon(dm.icon)}<b>${a.mape}%</b></span></td>`;
  }

  _renderMatrix() {
    const acts = Object.entries(this._activities);
    const devs = Object.values(this._devices);
    return `
      <div class="cmp">
        <div class="cmp-scroll">
          <table class="cmp-table">
            <thead>
              <tr>
                <th class="cmp-th-device" scope="col">Device</th>
                ${acts.map(([, a]) => `<th scope="col">${a.short}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${devs.map(d => `
                <tr>
                  <th class="cmp-td-device" scope="row">
                    <span class="brand">${this._deviceLogo(d.key, d.name)}<span class="brand-name">${d.name}</span></span>
                  </th>
                  ${acts.map(([k]) => this._matrixCell(d.acc[k])).join('')}
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <p class="cmp-legend">
          <span class="lg"><span class="mk-val under">${this._icon('arrowDown')}</span> Underestimates</span>
          <span class="lg"><span class="mk-val over">${this._icon('arrowUp')}</span> Overestimates</span>
          <span class="lg"><span class="mk-val mixed">${this._icon('swap')}</span> Variable</span>
          <span class="lg"><span class="mk-na">${this._icon('minus')}</span> No peer-reviewed per-activity data</span>
        </p>
      </div>
      <div class="callout animate-on-scroll">${this._icon('info')} <span>Every filled cell is a named peer-reviewed study (values are MAPE — mean absolute percentage error). Blank cells mean no per-activity study exists for that pairing — including <strong>Oura for cycling, HIIT, strength and swimming, which were never lab-tested</strong>, so no honest number can be published.</span></div>`;
  }

  // ── Device detail accordion ─────────────────────────────────────────────

  _renderDevices() {
    const actNames = this._activities;
    return `<div class="dev-acc">${Object.values(this._devices).map(d => {
      const measured = Object.entries(d.acc).filter(([, a]) => a.ev === 'measured' && a.mape != null);
      const sorted = measured.slice().sort((x, y) => x[1].mape - y[1].mape);
      const best = sorted[0];
      const worst = sorted[sorted.length - 1];
      return `
      <details class="dacc">
        <summary>
          ${this._deviceLogo(d.key, d.name)}
          <span class="dacc-id">
            <span class="dacc-name">${d.name}</span>
            <span class="dacc-head"><b>${d.headline}</b> ${d.headlineLabel}</span>
          </span>
          <span class="dacc-chev">${this._icon('arrowRight')}</span>
        </summary>
        <div class="dacc-body">
          <div class="dev-finding">
            <span class="dev-label">How it calculates</span>
            <p>${d.algorithm}</p>
          </div>
          <ul class="dev-facts">
            <li><span class="fct-ico">${this._icon('flame')}</span><span><strong>Sensors</strong> ${d.sensors}</span></li>
            <li><span class="fct-ico">${this._icon('info')}</span><span><strong>Resting rate</strong> ${d.bmr}</span></li>
            ${best ? `<li><span class="fct-ico ok">${this._icon('check')}</span><span><strong>Best measured</strong> ${actNames[best[0]].name} (~${best[1].mape}%)</span></li>` : ''}
            ${worst && worst !== best ? `<li><span class="fct-ico">${this._icon('minus')}</span><span><strong>Worst measured</strong> ${actNames[worst[0]].name} (~${worst[1].mape}%)</span></li>` : ''}
            <li><span class="fct-ico">${this._icon('swap')}</span><span><strong>Tendency</strong> ${d.bias}</span></li>
          </ul>
          <div class="dev-cols">
            <div>
              <span class="dev-label">Strengths</span>
              <ul class="dev-list good">${d.strengths.map(s => `<li>${this._icon('check')}<span>${s}</span></li>`).join('')}</ul>
            </div>
            <div>
              <span class="dev-label">Watch-outs</span>
              <ul class="dev-list">${d.weaknesses.map(w => `<li>${this._icon('minus')}<span>${w}</span></li>`).join('')}</ul>
            </div>
          </div>
          <div class="dev-actions">
            <a href="${d.sourceUrl}" class="dev-source" target="_blank" rel="noopener nofollow">Read the study ${this._icon('externalLink')}</a>
            <a href="${d.affiliate}" class="dev-amazon" target="_blank" rel="noopener sponsored" data-action="affiliate-click" data-track-label="${d.trackLabel}" data-track-position="device-card">View ${d.short} on Amazon ${this._icon('arrowRight')}</a>
          </div>
          <p class="dev-affnote">Affiliate link — we may earn a commission at no extra cost to you.</p>
        </div>
      </details>`;
    }).join('')}</div>`;
  }

  _renderFactors() {
    const order = { high: 0, moderate: 1 };
    return `<div class="fac-grid">${[...this._populationFactors]
      .sort((a, b) => (order[a.impact] ?? 9) - (order[b.impact] ?? 9))
      .map(f => `
        <article class="fac-card">
          <div class="fac-top">
            <h4>${f.title}</h4>
            <span class="fac-impact ${f.impact}">${f.impact === 'high' ? 'High impact' : 'Moderate'}</span>
          </div>
          <p>${f.desc}</p>
        </article>`).join('')}</div>`;
  }

  _sourceCard(s) {
    return `
      <a class="src" href="${s.url}" target="_blank" rel="noopener nofollow" data-action="source-link" data-track-label="${s.title}" data-track-position="sources">
        <span class="src-tag">${s.tag}</span>
        <span class="src-title">${s.title}</span>
        <span class="src-cite">${s.cite} <span class="src-go">${this._icon('externalLink')}</span></span>
      </a>`;
  }

  _renderSources() {
    return this._sourceGroups.map((g, i) => {
      const items = this._sources.filter(s => s.group === g.key);
      if (!items.length) return '';
      const logo = g.device
        ? this._deviceLogo(g.device, g.label)
        : `<span class="brand-img brand-img--icon">${this._icon('flame')}</span>`;
      return `
        <details class="src-group"${i === 0 ? ' open' : ''}>
          <summary>
            ${logo}
            <span class="src-group-label">${g.label}</span>
            <span class="src-group-count">${items.length}</span>
            <span class="src-group-chev">${this._icon('arrowRight')}</span>
          </summary>
          <div class="sources">${items.map(s => this._sourceCard(s)).join('')}</div>
        </details>`;
    }).join('');
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
    const appleImg = 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png';
    const garminImg = 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png';
    const googleHealthImg = 'https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png';
    const healthConnectImg = 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" loading="lazy" />
            <span>Calorie Accuracy</span>
          </a>
          <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" class="nav-cta-link cta-primary" data-track-label="subnav-get-app" data-track-position="subnav" target="_blank" rel="noopener">
            Get Kygo Health ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill"><span class="dot"></span> 6 DEVICES · 7 ACTIVITIES · PEER-REVIEWED</div>
              <h1>How accurate is your <span class="hl">calorie burn?</span></h1>
              <p class="hero-lede">No wearable <strong>measures</strong> calories — they <strong>estimate</strong> energy from heart rate, motion and your profile. Enter the number your device reported and see the likely <em>actual</em> range, using real per-activity research.</p>
              <a class="btn btn-primary btn-lg hero-btn" href="#calculator" data-action="scroll-calc">${this._icon('flame')} Check your number</a>
            </div>
            <div class="hero-vis" aria-hidden="true">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> Where accuracy breaks</span>
                <span class="hero-vis-tag">input vs output</span>
              </div>
              <div class="hv-two">
                <div class="hv-col">
                  <span class="hv-label">Heart rate</span>
                  <span class="hv-val good">~96%</span>
                  <div class="hv-bar"><span class="hv-fill good" style="width:96%"></span></div>
                  <span class="hv-cap good">The input they nail</span>
                </div>
                <div class="hv-col">
                  <span class="hv-label">Calorie burn</span>
                  <span class="hv-val">15–40%</span>
                  <div class="hv-bar"><span class="hv-fill" style="width:70%"></span></div>
                  <span class="hv-cap">Typical real-world error</span>
                </div>
              </div>
              <span class="hv-foot">HR MAPE ~4% · calorie conversion is the weak link</span>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">0</div><div class="lbl">Devices that truly measure calories</div></div>
            <div class="hero-stat"><div class="num">27–93%</div><div class="lbl">Calorie error across 7 devices · Stanford</div></div>
            <div class="hero-stat"><div class="num">~96%</div><div class="lbl">Heart-rate accuracy (what they get right)</div></div>
            <div class="hero-stat"><div class="num">13%</div><div class="lbl">Lowest measured daily error (Oura)</div></div>
          </div>
        </div>
      </section>

      <section class="section bg-light" id="calculator">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The calculator</div>
            <h2>Turn your reported burn into a <span class="hl">real range.</span></h2>
            <p class="lede">Pick your device and activity, enter what it showed, and we apply the peer-reviewed error and bias for that exact pairing.</p>
          </div>
          <div class="animate-on-scroll">${this._renderCalculator()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="kygo-cta-card animate-on-scroll">
            <div class="cta-pill"><span class="dot"></span> Free Forever Plan</div>
            <h3>See how <span>what you eat</span> shows up in your data.</h3>
            <p>Calorie counts are estimates. Kygo helps you log what you eat in seconds and see how it affects your sleep, energy, and recovery.</p>
            <div class="cta-btn-row">
              <a class="btn btn-primary btn-lg cta-primary" href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" target="_blank" rel="noopener" data-track-position="early" data-track-label="calorie-burn-early-ios">${this._icon('apple')} Download for iOS</a>
              <a class="btn btn-primary btn-lg cta-android" href="https://www.kygo.app/android" target="_blank" rel="noopener" data-action="android-download" data-track-position="early" data-track-label="calorie-burn-early-android">${this._icon('android')} Download for Android</a>
            </div>
            <div class="cta-works">
              <span>Works with</span>
              <div class="cta-badges">
                <img src="${ouraImg}" alt="Oura Ring" title="Oura Ring" loading="lazy" />
                <img src="${appleImg}" alt="Apple Health" title="Apple Health" loading="lazy" />
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
            <div class="kicker">By activity</div>
            <h2>Accuracy swings <span class="hl">wildly by activity.</span></h2>
            <p class="lede">The same device is decent for steady cardio and hopeless for strength. Only cells with a named peer-reviewed study show a number — scroll sideways on mobile.</p>
          </div>
          <div class="animate-on-scroll">${this._renderMatrix()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Brand by brand</div>
            <h2>How each device <span class="hl">gets its number.</span></h2>
            <p class="lede">Tap any wearable for its method, sensors, best and worst measured activities, and where it breaks down.</p>
          </div>
          <div class="animate-on-scroll">${this._renderDevices()}</div>
          <p class="aff-disclosure animate-on-scroll">${this._icon('info')} <span>The "View on Amazon" links above are affiliate links. As an Amazon Associate, Kygo Health earns from qualifying purchases — at no extra cost to you.</span></p>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <a class="blog-cta animate-on-scroll" href="https://www.kygo.app/post/how-accurate-is-your-wearable-calorie-burn" target="_blank" rel="noopener">
            <span class="blog-cta-tag">Deep Dive</span>
            <div class="blog-cta-body">
              <div class="blog-cta-kicker">Read the full breakdown</div>
              <div class="blog-cta-title">How Accurate Is Your Wearable's Calorie Burn?</div>
              <div class="blog-cta-sub">Why the calorie math breaks down, how each brand really calculates it, and how to read your own number — evidence-based.</div>
            </div>
            <span class="blog-cta-arrow">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Hidden variables</div>
            <h2>Factors that skew <span class="hl">every device.</span></h2>
            <p class="lede">Even the best wearable can't see these — and each one shifts the calorie estimate.</p>
          </div>
          <div class="animate-on-scroll">${this._renderFactors()}</div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="bottomline animate-on-scroll">
            <div class="bottomline-tag">The bottom line</div>
            <p>Wearables get <strong>heart rate</strong> right (~96%) but the leap from heart rate to calories carries <strong>15–40%+ real-world error</strong> — up to 93% in the Stanford study. <strong>Steady cardio</strong> is the safe zone; <strong>strength training and cycling</strong> are the worst regardless of brand. Use the number for <strong>week-over-week trends and relative effort</strong>, never as an exact figure to eat back.</p>
          </div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">FAQ</div>
            <h2>Common <span class="hl">questions.</span></h2>
          </div>
          <div class="faq animate-on-scroll">${this._renderFAQ()}</div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every claim, <span class="hl">traceable.</span></h2>
            <p class="lede">Each checked against the primary record (PubMed / PMC / journal / manufacturer). Verified July 2026.</p>
          </div>
          <div class="src-groups animate-on-scroll">${this._renderSources()}</div>
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
          <p class="footer-disclaimer">This calculator is for educational purposes only and is not medical or nutrition advice. Wearable calorie estimates vary by individual, environment and algorithm updates. Always consult a qualified professional before making health decisions based on wearable data.</p>
          <p class="footer-copyright">Data from peer-reviewed studies, meta-analyses and manufacturer documentation. Last updated July 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases. Product links on this page are affiliate links — we may earn a commission at no extra cost to you.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  // ── Events ──────────────────────────────────────────────────────────────

  _setupEvents() {
    const root = this.shadowRoot;

    root.addEventListener('click', (e) => {
      const devBtn = e.target.closest('[data-device]');
      if (devBtn) {
        this._selectedDevice = devBtn.getAttribute('data-device');
        root.querySelectorAll('[data-device]').forEach(b => {
          const on = b === devBtn;
          b.classList.toggle('active', on);
          b.setAttribute('aria-selected', on);
        });
        this._clearResult();
        return;
      }
      const actBtn = e.target.closest('[data-activity]');
      if (actBtn) {
        this._selectedActivity = actBtn.getAttribute('data-activity');
        root.querySelectorAll('[data-activity]').forEach(b => {
          const on = b === actBtn;
          b.classList.toggle('active', on);
          b.setAttribute('aria-selected', on);
        });
        this._clearResult();
        return;
      }
      const action = e.target.closest('[data-action]');
      if (action) {
        const a = action.getAttribute('data-action');
        if (a === 'calculate') { e.preventDefault(); this._doCalculate(); }
        else if (a === 'scroll-calc') {
          e.preventDefault();
          const el = root.getElementById('calculator');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });

    root.addEventListener('input', (e) => {
      const input = e.target.closest('[data-input="calories"]');
      if (input) {
        const v = parseInt(input.value, 10);
        this._reportedCalories = Number.isFinite(v) && v > 0 ? v : null;
      }
    });

    root.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const input = e.target.closest('[data-input="calories"]');
        if (input) { e.preventDefault(); this._doCalculate(); }
      }
    });
  }

  _doCalculate() {
    this._result = this._compute();
    const panel = this.shadowRoot.querySelector('[data-section="result"]');
    if (!panel) return;
    const live = panel.querySelector('.calc-live');
    if (live) live.innerHTML = this._renderResults();
    panel.classList.toggle('show', !!this._result);
    if (this._result) {
      this.dispatchEvent(new CustomEvent('kygo-calorie-calculation', {
        detail: { device: this._selectedDevice, activity: this._selectedActivity, reported: this._reportedCalories, result: this._result },
        bubbles: true, composed: true
      }));
    }
  }

  // Clear the result panel when the device/activity selection changes.
  _clearResult() {
    this._result = null;
    const panel = this.shadowRoot.querySelector('[data-section="result"]');
    if (panel) panel.classList.remove('show');
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
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0.01 });
      els.forEach(el => this._observer.observe(el));
    });
  }

  // ── JSON-LD ─────────────────────────────────────────────────────────────

  _injectStructuredData() {
    if (!document.querySelector('script[data-kygo-calorie-burn-ld]')) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Calorie Burn Accuracy Calculator',
        'alternateName': 'Kygo Wearable Calorie Burn Accuracy Tool',
        'description': 'Enter your wearable\'s reported calorie burn and see the likely actual range. Compares Apple Watch, Fitbit, Garmin, WHOOP, Oura Ring and Samsung Galaxy Watch across 7 activity types using peer-reviewed per-activity accuracy data (Choe & Kang 2025, Chevance 2022, Kristiansson 2023 and others).',
        'applicationCategory': 'HealthApplication',
        'operatingSystem': 'Web',
        'url': 'https://www.kygo.app/tools/calorie-burn-accuracy',
        'datePublished': '2026-03-01',
        'dateModified': '2026-07-08',
        'softwareVersion': '2.0',
        'inLanguage': 'en',
        'isAccessibleForFree': true,
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
        'featureList': 'Compare 6 wearable brands across 7 activity types, peer-reviewed per-activity accuracy data, personalized calorie range calculator, bias-direction indicator, evidence-level flagging',
        'keywords': 'calorie burn accuracy, wearable calorie burn, Apple Watch calorie accuracy, Fitbit calorie accuracy, Garmin calorie accuracy, WHOOP calorie accuracy, Oura Ring calorie accuracy, Samsung Galaxy Watch calorie accuracy, fitness tracker energy expenditure error, how accurate is Apple Watch calories'
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-calorie-burn-ld', '');
      s.textContent = JSON.stringify(ld);
      document.head.appendChild(s);
    }

    if (!document.querySelector('script[data-kygo-calorie-burn-faq]')) {
      const faq = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': this._faqs.map(f => ({
          '@type': 'Question', 'name': f.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
        }))
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-calorie-burn-faq', '');
      s.textContent = JSON.stringify(faq);
      document.head.appendChild(s);
    }

    if (!document.querySelector('script[data-kygo-calorie-burn-breadcrumb]')) {
      const bc = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Kygo Health', 'item': 'https://www.kygo.app' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
          { '@type': 'ListItem', 'position': 3, 'name': 'Calorie Burn Accuracy', 'item': 'https://www.kygo.app/tools/calorie-burn-accuracy' }
        ]
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-calorie-burn-breadcrumb', '');
      s.textContent = JSON.stringify(bc);
      document.head.appendChild(s);
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
      .nav-cta-link { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; background: var(--kygo-green); color: #fff; font-weight: 600; font-size: 14px; padding: 8px 14px; border-radius: 8px; text-decoration: none; }
      .nav-cta-link:hover { background: var(--kygo-green-dark); color: #fff; }
      .nav-cta-link .ico { width: 16px; height: 16px; }
      @media (max-width: 420px) { .nav-brand span { display: none; } }

      /* Buttons */
      .btn { font-family: var(--font-body); font-weight: 600; font-size: 14px; padding: 10px 18px; border-radius: 10px; border: 0; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all .2s var(--ease-out); white-space: nowrap; }
      .btn .ico { width: 16px; height: 16px; }
      .btn-primary { background: var(--kygo-green); color: #fff; box-shadow: 0 4px 12px rgba(34,197,94,0.25); }
      .btn-primary:hover { background: var(--kygo-green-dark); transform: translateY(-1px); box-shadow: var(--shadow-cta); }
      .btn-lg { padding: 14px 22px; font-size: 15px; border-radius: 12px; }
      .btn-lg .ico { width: 18px; height: 18px; }
      .btn-block { width: 100%; justify-content: center; }

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
      .hero-lede em { font-style: italic; }
      .hero-btn { margin-top: 22px; }
      .hero-vis { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 14px; background: linear-gradient(158deg, #ffffff 0%, #EEF2F7 100%); border: 1px solid var(--border-subtle); border-radius: 20px; padding: 18px 20px 20px; box-shadow: 0 16px 40px rgba(15,23,42,0.08); }
      .hero-vis::before { content: ''; position: absolute; top: -90px; right: -70px; width: 240px; height: 240px; background: radial-gradient(closest-side, rgba(34,197,94,0.16), transparent); pointer-events: none; }
      .hero-vis-head { position: relative; display: flex; align-items: center; justify-content: space-between; }
      .hero-vis-title { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: var(--fg-3); }
      .hero-vis-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 0 3px rgba(34,197,94,0.18); }
      .hero-vis-tag { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.3px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 4px 10px; border-radius: 999px; }
      .hv-two { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px; }
      .hv-col { display: flex; flex-direction: column; align-items: center; gap: 9px; text-align: center; padding: 12px 6px; }
      .hv-col + .hv-col { border-left: 1px solid var(--border-subtle); }
      .hv-label { font-family: var(--font-display); font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: var(--fg-2); }
      .hv-val { font-family: var(--font-display); font-weight: 700; font-size: clamp(26px, 5.4vw, 42px); line-height: 1; letter-spacing: -0.02em; color: var(--fg-2); white-space: nowrap; }
      .hv-val.good { color: var(--kygo-green-dark); }
      .hv-bar { width: 100%; max-width: 150px; height: 8px; border-radius: 999px; background: var(--bg-raised); overflow: hidden; }
      .hv-fill { display: block; height: 100%; border-radius: 999px; background: var(--fg-3); }
      .hv-fill.good { background: var(--kygo-green); }
      .hv-cap { font-family: var(--font-display); font-size: 11px; font-weight: 600; color: var(--fg-3); }
      .hv-cap.good { color: var(--kygo-green-dark); }
      .hv-foot { position: relative; display: block; text-align: center; margin-top: 12px; font-size: 12px; color: var(--fg-3); }
      @media (max-width: 880px) { .hero-vis { width: 100%; max-width: 440px; margin: 4px auto 0; } }
      .hero-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; border-top: 1px solid var(--border-subtle); padding-top: 24px; }
      @media (min-width: 720px) { .hero-stats { grid-template-columns: repeat(4, 1fr); gap: 24px; padding-top: 28px; } }
      .hero-stat .num { font-family: var(--font-display); font-weight: 700; font-size: clamp(26px, 3.6vw, 38px); line-height: 1; color: var(--kygo-green); letter-spacing: -0.02em; }
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
      .lede { color: var(--fg-2); font-size: 16px; line-height: 1.55; max-width: 62ch; margin: 0; }
      .lede strong { color: var(--fg-1); font-weight: 600; }

      /* Callout */
      .callout { margin-top: 24px; display: flex; gap: 12px; align-items: flex-start; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 16px 18px; font-size: 14px; line-height: 1.6; color: var(--fg-2); }
      .callout .ico { width: 18px; height: 18px; color: var(--kygo-green-dark); flex: none; margin-top: 2px; }
      .callout strong { color: var(--fg-1); font-weight: 600; }

      /* ── Calculator ───────────────────────────────────────────────────── */
      .calc { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; }
      @media (min-width: 900px) { .calc { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 28px; align-items: start; } }
      .calc-form { min-width: 0; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; padding: 22px; display: flex; flex-direction: column; gap: 20px; }
      .calc-group { display: flex; flex-direction: column; gap: 10px; }
      .calc-group > label { font-family: var(--font-display); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: var(--fg-3); }
      .dev-btns { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
      @media (min-width: 480px) { .dev-btns { grid-template-columns: repeat(6, minmax(0, 1fr)); } }
      .dev-btn { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 12px; padding: 10px 4px; display: flex; flex-direction: column; align-items: center; gap: 6px; font-family: var(--font-display); font-size: 10.5px; font-weight: 600; color: var(--fg-2); cursor: pointer; transition: all .15s ease; }
      .dev-btn .brand-img { width: 30px; height: 30px; border-radius: 8px; }
      .dev-btn span { line-height: 1.1; text-align: center; }
      .dev-btn:hover { border-color: var(--fg-3); }
      .dev-btn.active { border-color: var(--kygo-green); background: rgba(34,197,94,0.06); color: var(--kygo-green-dark); box-shadow: 0 0 0 3px rgba(34,197,94,0.10); }
      .act-btns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
      @media (min-width: 480px) { .act-btns { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
      .act-btn { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 10px; padding: 10px 8px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-family: var(--font-display); font-size: 12px; font-weight: 600; color: var(--fg-2); cursor: pointer; transition: all .15s ease; }
      .act-btn .ico { width: 15px; height: 15px; color: var(--fg-3); }
      .act-btn:hover { border-color: var(--fg-3); }
      .act-btn.active { border-color: var(--kygo-green); background: rgba(34,197,94,0.06); color: var(--kygo-green-dark); }
      .act-btn.active .ico { color: var(--kygo-green-dark); }
      .calc-input { display: flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 12px; padding: 12px 16px; transition: border-color .15s ease; }
      .calc-input:focus-within { border-color: var(--kygo-green); box-shadow: 0 0 0 3px rgba(34,197,94,0.10); }
      .calc-input input { flex: 1; min-width: 0; background: transparent; border: 0; outline: 0; font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--fg-1); }
      .calc-input input::placeholder { color: var(--fg-3); font-weight: 500; }
      .calc-unit { font-family: var(--font-display); font-size: 13px; font-weight: 600; color: var(--fg-3); }

      /* Result panel */
      .calc-result { min-width: 0; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; padding: 24px 20px; min-height: 100%; }
      @media (min-width: 900px) { .calc-result { padding: 28px 26px; } }
      .calc-result.show .calc-placeholder { display: none; }
      .calc-result .calc-live { display: none; }
      .calc-result.show .calc-live { display: block; }
      .calc-placeholder { text-align: center; padding: 26px 10px; }
      .calc-placeholder-vis { display: flex; align-items: flex-end; justify-content: center; gap: 8px; height: 72px; margin-bottom: 18px; }
      .calc-placeholder-vis span { width: 18px; border-radius: 5px 5px 0 0; background: var(--kygo-green-light); }
      .calc-placeholder-vis span:nth-child(4) { background: var(--kygo-green); }
      .calc-placeholder-title { font-family: var(--font-display); font-weight: 600; font-size: 16px; color: var(--fg-1); margin-bottom: 8px; }
      .calc-placeholder-desc { font-size: 14px; color: var(--fg-3); line-height: 1.5; max-width: 34ch; margin: 0 auto; }

      .res-head { text-align: center; }
      .res-label { font-family: var(--font-display); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; color: var(--fg-3); }
      .res-best { font-family: var(--font-display); font-weight: 700; font-size: clamp(46px, 12vw, 64px); line-height: 1; color: var(--kygo-green); letter-spacing: -0.02em; margin: 6px 0 4px; }
      .res-unit { font-size: 13px; color: var(--fg-2); }
      .ev-chip { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; font-family: var(--font-display); font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 999px; }
      .ev-chip .ico { width: 12px; height: 12px; }
      .ev-chip.ev-measured { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .ev-chip.ev-est { background: var(--bg-raised); color: var(--fg-2); }

      .res-bar { margin-top: 22px; }
      .res-bar-track { position: relative; height: 12px; border-radius: 999px; background: var(--bg-raised); }
      .res-bar-fill { position: absolute; top: 0; height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--kygo-green-dark), var(--kygo-green)); opacity: .22; }
      .res-bar-best { position: absolute; top: 50%; transform: translate(-50%, -50%); }
      .res-bar-dot { display: block; width: 20px; height: 20px; border-radius: 50%; background: var(--kygo-green); border: 3px solid #fff; box-shadow: 0 2px 8px rgba(34,197,94,0.45); }
      .res-bar-reported { position: absolute; top: -3px; width: 2px; height: 18px; background: var(--fg-3); transform: translateX(-50%); border-radius: 1px; }
      .res-bar-labels { display: flex; justify-content: space-between; margin-top: 10px; font-family: var(--font-display); font-size: 12px; font-weight: 600; color: var(--fg-2); }

      .res-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 22px; }
      .res-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 14px 16px; }
      .res-card-label { font-family: var(--font-display); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--fg-3); margin-bottom: 6px; }
      .res-card-value { font-family: var(--font-display); font-weight: 700; font-size: 22px; color: var(--fg-1); }
      .res-card-dir { display: inline-flex; align-items: center; gap: 6px; font-size: 17px; }
      .res-card-dir .ico { width: 16px; height: 16px; }
      .res-card-dir.under { color: var(--kygo-green-dark); }
      .res-card-dir.over { color: var(--kygo-dark); }
      .res-card-dir.mixed { color: var(--fg-2); }

      .res-tendency { display: flex; gap: 10px; align-items: flex-start; margin-top: 16px; padding: 13px 15px; border-radius: 12px; font-size: 13.5px; line-height: 1.5; }
      .res-tendency .ico { width: 16px; height: 16px; flex: none; margin-top: 2px; }
      .res-tendency strong { font-weight: 600; }
      .res-tendency.under { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .res-tendency.under strong { color: var(--kygo-green-dark); }
      .res-tendency.over { background: var(--kygo-dark); color: rgba(255,255,255,0.85); }
      .res-tendency.over strong { color: #fff; }
      .res-tendency.over .ico { color: #6EE7A0; }
      .res-tendency.mixed { background: var(--bg-raised); color: var(--fg-2); }
      .res-tendency.mixed strong { color: var(--fg-1); }

      .res-detail { margin-top: 16px; border-top: 1px solid var(--border-subtle); }
      .res-detail summary { list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 14px 0 0; font-family: var(--font-display); font-weight: 600; font-size: 13.5px; color: var(--fg-1); }
      .res-detail summary::-webkit-details-marker { display: none; }
      .res-detail summary .ico { width: 16px; height: 16px; color: var(--fg-3); transition: transform .2s; }
      .res-detail[open] summary .ico { transform: rotate(90deg); color: var(--kygo-green-dark); }
      .res-detail-body { padding-top: 10px; }
      .res-detail-body p { margin: 0 0 10px; font-size: 13px; line-height: 1.55; color: var(--fg-2); }
      .res-detail-body strong { color: var(--fg-1); font-weight: 600; }
      .res-src { display: flex; gap: 8px; align-items: flex-start; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 10px 12px; color: var(--fg-2) !important; }
      .res-src .ico { width: 14px; height: 14px; color: var(--kygo-green-dark); flex: none; margin-top: 2px; }

      /* Untested state */
      .res-untested { text-align: left; }
      .res-untested-badge { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-display); font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 999px; background: var(--kygo-dark); color: #fff; }
      .res-untested-badge .ico { width: 12px; height: 12px; color: #6EE7A0; }
      .res-untested h3 { font-family: var(--font-display); font-weight: 600; font-size: 19px; line-height: 1.25; color: var(--fg-1); margin: 16px 0 12px; }
      .res-untested p { font-size: 14px; line-height: 1.6; color: var(--fg-2); margin: 0 0 12px; }
      .res-untested strong { color: var(--fg-1); font-weight: 600; }
      .res-untested-why { padding: 13px 15px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; }

      /* ── Comparison matrix ────────────────────────────────────────────── */
      .cmp { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; overflow: hidden; }
      @media (min-width: 768px) { .cmp { border-radius: 22px; } }
      .cmp-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      @media (min-width: 900px) { .cmp-scroll { overflow-x: visible; } }
      .cmp-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 640px; }
      .cmp-table th, .cmp-table td { padding: 0; vertical-align: middle; }
      .cmp-table thead th { font-family: var(--font-display); font-weight: 700; font-size: 10.5px; letter-spacing: 0.4px; text-transform: uppercase; color: #334155; text-align: center; padding: 12px 6px; border-bottom: 1px solid #CBD5E1; white-space: nowrap; background: #E2E8F0; }
      .cmp-table thead .cmp-th-device { text-align: left; padding-left: 14px; position: sticky; left: 0; z-index: 3; background: #E2E8F0; }
      .cmp-table tbody tr + tr td, .cmp-table tbody tr + tr th { border-top: 1px solid var(--border-subtle); }
      .cmp-table tbody tr:hover td, .cmp-table tbody tr:hover .cmp-td-device { background: var(--bg-surface); }
      .cmp-td-device { padding: 10px 6px; width: 104px; min-width: 104px; text-align: left; background: #fff; position: sticky; left: 0; z-index: 1; box-shadow: 1px 0 0 var(--border-subtle); }
      .brand { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; }
      .brand-img { width: 38px; height: 38px; border-radius: 9px; background: var(--bg-raised); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
      .brand-img img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
      .brand-img.brand-img--icon { color: var(--fg-3); }
      .brand-img.brand-img--icon .ico { width: 18px; height: 18px; }
      .brand-name { font-family: var(--font-display); font-weight: 600; font-size: 11px; color: var(--fg-1); line-height: 1.2; overflow-wrap: anywhere; max-width: 92px; }
      @media (min-width: 900px) {
        .cmp-td-device { padding: 12px 14px 12px 8px; width: auto; min-width: 190px; position: static; box-shadow: none; }
        .brand { flex-direction: row; align-items: center; gap: 12px; text-align: left; }
        .brand-img { width: 42px; height: 42px; border-radius: 11px; }
        .brand-name { font-size: 15px; max-width: none; }
        .cmp-table thead th { font-size: 11px; padding: 14px 8px; }
      }
      .cmp-table tbody td { text-align: center; padding: 10px 6px; }
      @media (min-width: 900px) { .cmp-table tbody td { padding: 12px 8px; } }
      .mk-val { display: inline-flex; align-items: center; gap: 3px; font-family: var(--font-display); font-weight: 700; font-size: 12px; padding: 4px 9px; border-radius: 999px; white-space: nowrap; }
      .mk-val .ico { width: 12px; height: 12px; }
      .mk-val.under { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .mk-val.over { background: var(--kygo-dark); color: #fff; }
      .mk-val.mixed { background: var(--bg-raised); color: var(--fg-2); }
      .mk-na { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: var(--bg-raised); color: var(--fg-3); }
      .mk-na .ico { width: 12px; height: 12px; }
      .cmp-legend { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; margin: 0; padding: 14px 16px; font-size: 12px; color: var(--fg-2); }
      .cmp-legend .lg { display: inline-flex; align-items: center; gap: 6px; }

      /* ── Device detail accordion ──────────────────────────────────────── */
      .dev-acc { display: grid; grid-template-columns: 1fr; gap: 10px; align-items: start; }
      @media (min-width: 768px) { .dev-acc { grid-template-columns: 1fr 1fr; gap: 12px; } }
      .dacc { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; overflow: hidden; transition: border-color .2s, box-shadow .2s; }
      .dacc[open] { box-shadow: var(--shadow-md); border-color: var(--kygo-green); }
      .dacc > summary { list-style: none; cursor: pointer; display: flex; align-items: center; gap: 12px; padding: 12px 14px; }
      .dacc > summary::-webkit-details-marker { display: none; }
      .dacc > summary:hover { background: var(--bg-surface); }
      .dacc .brand-img { width: 40px; height: 40px; border-radius: 10px; flex: none; }
      .dacc-id { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
      .dacc-name { font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); line-height: 1.2; }
      .dacc-head { font-size: 12px; color: var(--fg-2); }
      .dacc-head b { font-family: var(--font-display); color: var(--kygo-green-dark); }
      .dacc-chev { color: var(--fg-3); flex: none; }
      .dacc-chev .ico { width: 16px; height: 16px; transition: transform .2s; }
      .dacc[open] .dacc-chev .ico { transform: rotate(90deg); color: var(--kygo-green-dark); }
      .dacc-body { padding: 0 14px 16px; display: flex; flex-direction: column; gap: 14px; }
      .dev-finding { background: var(--bg-surface); border-radius: 12px; padding: 12px 14px; }
      .dev-label { font-family: var(--font-display); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--fg-3); }
      .dev-finding p { margin: 4px 0 0; font-size: 13px; line-height: 1.55; color: var(--fg-1); }
      .dev-facts { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
      .dev-facts li { display: grid; grid-template-columns: 24px 1fr; gap: 10px; font-size: 13px; line-height: 1.5; color: var(--fg-2); }
      .dev-facts .fct-ico { width: 24px; height: 24px; border-radius: 7px; background: var(--bg-raised); color: var(--fg-3); display: inline-flex; align-items: center; justify-content: center; }
      .dev-facts .fct-ico.ok { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .dev-facts .fct-ico .ico { width: 13px; height: 13px; }
      .dev-facts strong { color: var(--fg-1); font-weight: 600; display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; }
      .dev-cols { display: grid; grid-template-columns: 1fr; gap: 14px; }
      @media (min-width: 520px) { .dev-cols { grid-template-columns: 1fr 1fr; } }
      .dev-list { list-style: none; margin: 6px 0 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
      .dev-list li { display: grid; grid-template-columns: 16px 1fr; gap: 8px; font-size: 12.5px; line-height: 1.45; color: var(--fg-2); }
      .dev-list .ico { width: 14px; height: 14px; margin-top: 2px; color: var(--fg-3); }
      .dev-list.good .ico { color: var(--kygo-green-dark); }
      .dev-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
      .dev-source { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-display); font-weight: 600; font-size: 13px; color: var(--kygo-green-dark); }
      .dev-source .ico { width: 13px; height: 13px; }
      .dev-amazon { margin-left: auto; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 14px; border-radius: 10px; border: 1.5px solid var(--kygo-green-light); background: rgba(34,197,94,0.06); color: var(--kygo-green-dark); font-family: var(--font-body); font-weight: 600; font-size: 13px; transition: all .15s ease; }
      .dev-amazon:hover { border-color: var(--kygo-green); background: rgba(34,197,94,0.12); }
      .dev-amazon .ico { width: 14px; height: 14px; transition: transform .15s; }
      .dev-amazon:hover .ico { transform: translateX(2px); }
      .dev-affnote { margin: 0; font-size: 11px; color: var(--fg-3); font-style: italic; }
      .aff-disclosure { display: flex; gap: 10px; align-items: flex-start; margin: 20px 0 0; font-size: 12.5px; line-height: 1.55; color: var(--fg-3); font-style: italic; }
      .aff-disclosure .ico { width: 15px; height: 15px; color: var(--kygo-green-dark); flex: none; margin-top: 2px; }

      /* ── Population factors ───────────────────────────────────────────── */
      .fac-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
      @media (min-width: 640px) { .fac-grid { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 1000px) { .fac-grid { grid-template-columns: repeat(3, 1fr); } }
      .fac-card { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 16px; padding: 18px; transition: border-color .2s, box-shadow .2s; }
      .fac-card:hover { border-color: var(--fg-3); box-shadow: var(--shadow-md); }
      .fac-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
      .fac-card h4 { font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); line-height: 1.25; margin: 0; }
      .fac-impact { flex: none; font-family: var(--font-display); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; padding: 4px 9px; border-radius: 999px; }
      .fac-impact.high { background: var(--kygo-dark); color: #fff; }
      .fac-impact.moderate { background: var(--bg-raised); color: var(--fg-2); }
      .fac-card p { margin: 0; font-size: 13.5px; line-height: 1.55; color: var(--fg-2); }

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

      /* Bottom line */
      .bottomline { background: var(--kygo-dark); color: rgba(255,255,255,0.82); border-radius: 22px; padding: 32px 26px; position: relative; overflow: hidden; }
      @media (min-width: 720px) { .bottomline { padding: 44px 40px; } }
      .bottomline::before { content: ''; position: absolute; top: -120px; right: -120px; width: 360px; height: 360px; background: radial-gradient(closest-side, rgba(34,197,94,0.22), transparent); pointer-events: none; }
      .bottomline-tag { position: relative; display: inline-flex; font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: #6EE7A0; background: rgba(34,197,94,0.14); border: 1px solid rgba(34,197,94,0.25); padding: 6px 12px; border-radius: 999px; margin-bottom: 18px; }
      .bottomline p { position: relative; font-size: clamp(15px, 1.8vw, 18px); line-height: 1.65; margin: 0 0 14px; }
      .bottomline strong { color: #fff; font-weight: 600; }

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

      /* FAQ */
      .faq { display: flex; flex-direction: column; gap: 10px; }
      .faq details { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; padding: 4px 20px; transition: border-color .2s; }
      .faq details[open] { border-color: var(--kygo-green); }
      .faq summary { list-style: none; padding: 16px 0; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 14px; }
      .faq summary::-webkit-details-marker { display: none; }
      .faq summary::after { content: '+'; color: var(--kygo-green-dark); font-weight: 600; font-size: 22px; transition: transform .2s; line-height: 1; }
      .faq details[open] summary::after { content: '−'; }
      .faq .body { padding: 0 0 16px; color: var(--fg-2); font-size: 14px; line-height: 1.65; }

      /* Sources — collapsible groups by brand */
      .src-groups { display: flex; flex-direction: column; gap: 10px; }
      .src-group { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; overflow: hidden; transition: border-color .2s, box-shadow .2s; }
      .src-group[open] { border-color: var(--kygo-green); box-shadow: var(--shadow-md); }
      .src-group > summary { list-style: none; cursor: pointer; display: flex; align-items: center; gap: 12px; padding: 12px 14px; }
      .src-group > summary::-webkit-details-marker { display: none; }
      .src-group > summary:hover { background: var(--bg-surface); }
      .src-group .brand-img { width: 34px; height: 34px; border-radius: 9px; flex: none; }
      .src-group-label { flex: 1; min-width: 0; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); line-height: 1.2; }
      .src-group-count { flex: none; font-family: var(--font-display); font-weight: 700; font-size: 12px; color: var(--kygo-green-dark); background: var(--kygo-green-light); border-radius: 999px; min-width: 24px; height: 22px; padding: 0 8px; display: inline-flex; align-items: center; justify-content: center; }
      .src-group-chev { flex: none; color: var(--fg-3); }
      .src-group-chev .ico { width: 16px; height: 16px; transition: transform .2s; }
      .src-group[open] .src-group-chev .ico { transform: rotate(90deg); color: var(--kygo-green-dark); }
      .src-group .sources { padding: 0 14px 14px; }

      .sources { display: grid; grid-template-columns: 1fr; gap: 8px; }
      @media (min-width: 600px) { .sources { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 960px) { .sources { grid-template-columns: repeat(3, 1fr); } }
      .src { display: flex; flex-direction: column; gap: 4px; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 12px; padding: 12px 14px; transition: border-color .15s, box-shadow .15s; }
      .src:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); }
      .src-tag { align-self: flex-start; font-family: var(--font-display); font-size: 9.5px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--kygo-green-dark); }
      .src-title { font-family: var(--font-display); font-weight: 600; font-size: 13.5px; color: var(--fg-1); line-height: 1.3; }
      .src:hover .src-title { color: var(--kygo-green-dark); }
      .src-cite { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; color: var(--fg-3); line-height: 1.35; }
      .src-go { display: inline-flex; color: var(--kygo-green-dark); }
      .src-go .ico { width: 12px; height: 12px; transition: transform .15s; }
      .src:hover .src-go .ico { transform: translate(1px,-1px); }

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
        * { animation-duration: 0s !important; transition-duration: 0s !important; }
      }
    `;
  }
}

if (!customElements.get('kygo-calorie-burn-accuracy')) {
  customElements.define('kygo-calorie-burn-accuracy', KygoCalorieBurnAccuracy);
}

// Usage: <kygo-calorie-burn-accuracy></kygo-calorie-burn-accuracy>
