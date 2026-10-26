/**
 * Kygo Health - Wearable Accuracy Comparison Tool (v2, 2026-09-26 rebuild)
 * Tag: kygo-wearable-accuracy
 *
 * Long-form, one-section-per-metric accuracy guide for Oura, Apple Watch,
 * Garmin, WHOOP, Fitbit, Samsung and Polar. Every chart shows one study criterion
 * at a time; cross-study figures are never put on a shared axis.
 *
 * Sources of truth (Kygo Research Library): docs 20 (sleep), 24 (heart
 * rate, HRV, RHR), 15 (VO2 max), 09 (steps), 05 + calorie-source-sweep
 * 2026-09-26 (calories), 36 (skin temperature), 06 section 13 + fda sweep
 * (FDA), spo2-source-sweep and respiratory-rate-source-sweep (2026-09-26).
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

/** Loads the shared <kygo-cta> element on demand. Wix embeds this file on its
 *  own, so the CTA definition has to come along rather than be assumed present. */
function __ensureKygoCta() {
  if (customElements.get('kygo-cta')) return;
  if (document.querySelector('script[data-kygo-cta-loader]')) return;
  const s = document.createElement('script');
  s.src = 'https://kygo-health.github.io/kygo-elements/kygo-cta.js';
  s.setAttribute('data-kygo-cta-loader', '');
  s.async = true;
  document.head.appendChild(s);
}

/** Loads the shared kygo-picks-card element on demand. Wix embeds this file on its
 *  own, so the card script has to come along rather than be assumed present. */
function __ensureKygoPicksCard() {
  if (customElements.get('kygo-picks-card')) return;
  if (document.querySelector('script[data-kygo-picks-card-loader]')) return;
  const s = document.createElement('script');
  s.src = 'https://kygo-health.github.io/kygo-elements/kygo-picks-card.js';
  s.setAttribute('data-kygo-picks-card-loader', '');
  s.async = true;
  document.head.appendChild(s);
}

/** Appends a JSON-LD script unless the page already serves that @type from the Wix SEO panel */
function __kygoAppendLdOnce(script) {
  let type;
  try { type = JSON.parse(script.textContent)['@type']; } catch (e) { /* malformed: append as-is */ }
  const served = type && [...document.querySelectorAll('script[type="application/ld+json"]')].some(s => {
    if ([...s.attributes].some(a => a.name.startsWith('data-kygo'))) return false;
    try { return JSON.parse(s.textContent)['@type'] === type; } catch (e) { return false; }
  });
  if (!served) document.head.appendChild(script);
}

class KygoWearableAccuracy extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._cmpDevs = ['apple-watch', 'oura'];
    this._cmpMetric = 'overview';
    this._wired = false;
  }

  connectedCallback() {
    __ensureKygoCta();
    this.render();
    this._wire();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, 'Most accurate wearable 2026, by Kygo Health. Metric-by-metric accuracy guide for Oura Ring, Apple Watch, Garmin, WHOOP, Fitbit, Samsung Galaxy Watch and Polar covering sleep stages, overnight HRV, resting heart rate, heart rate during exercise, blood oxygen SpO2, step counting, calories burned, VO2 max, skin temperature, respiratory rate and FDA-cleared features. Every figure comes from a peer-reviewed study, preprint or FDA record, with manufacturer funding flagged. One podium per metric, ranked on the numbers. Sleep stages: Oura Ring first (kappa 0.65 in healthy sleepers), Apple Watch second (0.60, best REM detection), Fitbit third (0.55); every device drops sharply in people with sleep problems. Sleep timing: Oura first (total sleep within 2 minutes, catches 73% of wake), Fitbit second, Apple third (misses half of wake). Overnight HRV: Oura Ring 4 first (6% error, agreement 0.99), WHOOP second (8%), Garmin third (10.5%), Polar fourth (16.32%, first 4 hours of sleep only), all from one independent 536-night study (Dial 2025). Resting heart rate: Oura first (1.94% error, 1.1 bpm), Polar second (2.71%, first 4 hours of sleep, Grit X Pro), WHOOP third (3.00%, 1.8 bpm), all from one independent overnight study (Dial 2025). Heart rate during activity: Apple Watch first (lowest error of four watches cycling, 2.5 bpm), Garmin second, Fitbit third; the top four brands are within 2 to 7% of each other. Blood oxygen: Apple first (Arms 2.2), Samsung second (3.8), Garmin third; every watch drifts when oxygen is truly low. Steps: Garmin first (3% over in daily life, pooled across 59 studies), Apple second (7%), Samsung third; Fitbit overcounts by 15% and Oura was 50 to 69% off before its 2025 update. Calories: Fitbit first, Samsung second, Apple third, but no brand came within 9% on the max treadmill test and weight-training errors reach 115%. VO2 max: Garmin first (6.7% with a chest strap), Fitbit second (8.7%), Apple third (13%, reads low). Breathing rate: Fitbit first (independent test), WHOOP second; no third qualifies. Skin temperature: not ranked, no brand has an independent sensor test. Rankings are for the models tested, mostly one to three generations old. FDA: Apple has five cleared features, Samsung three, Fitbit two, Garmin and WHOOP MG one (ECG), Oura none; Polar was not checked. Current hardware such as Oura Ring 5, WHOOP 5.0, Apple Watch Series 10, 11 and 12 and Galaxy Watch 8 has no independent validation.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Data: devices ─────────────────────────────────────────────────────

  get _devices() {
    const img = id => `https://static.wixstatic.com/media/${id}~mv2.png`;
    return {
      'apple-watch': {
        name: 'Apple Watch', short: 'Apple', color: '#8E959A',
        imageUrl: img('273a63_68b4900c356b4d0c8982e5ecd10f04fe'),
        bestFor: 'Workout heart rate, SpO2, FDA features; second for steps and sleep stages',
        subscription: 'None required',
        strengths: [
          'Most accurate workout heart rate: lowest error of four watches cycling (2.5 bpm, Series 8) and near-zero pooled bias across 22 studies (Lambe 2026)',
          'Most accurate blood oxygen: Arms 2.2 in a low-oxygen test (Series 8) and 2.4 against arterial blood in 112 patients',
          'Second for sleep stages (κ 0.60) with the best REM detection of any brand (83%), healthy adults',
          'Second for steps: +7% in daily life pooled across 59 studies, 6.4% in a 36-adult study',
          '5 FDA-cleared features: ECG, irregular rhythm alerts, AFib History, sleep apnea and hypertension notifications (most of any brand)'
        ],
        weaknesses: [
          'Third for sleep timing: misses about half of the time you lie awake (52%) and reads total sleep 8 min high',
          'VO2 max underestimated in all 3 independent studies (MAPE 13 to 16%), third behind Garmin and Fitbit',
          'Weight-training calories off by 112% on average (Series 8, Yun 2026)',
          'Clinical-sample sleep staging drops to κ=0.30 (Lee 2023)',
          'Over-read 85% of blood oxygen readings when true oxygen was below 88% (Series 7)',
          'Cleared alerts miss many cases: hypertension 41% sensitivity, sleep apnea 66% (FDA summaries)',
          'Hypertension notifications on Series 12 / Ultra 4 on hold in 33 countries (not the US)',
          'Series 10, 11 and Ultra 3 have no heart rate or sleep validation'
        ],
        researchNote: 'US watches have computed blood oxygen on the paired iPhone since August 2025. Every Apple SpO2 study predates that change or was run outside the US.',
        studyIds: ['schyvens2025', 'lee2023', 'robbins2024', 'gielen2026', 'lambe2026', 'miller2022', 'hong2024', 'miwa2026', 'rowe2025', 'kostrna2026', 'yun2026', 'lee2026', 'perez2025', 'apple2024wp', 'caserman2024', 'lambe2025', 'mayo2026', 'walzel2023', 'jiang2023', 'jiang2026', 'wang2025', 'ogrady2024'],
        affiliateLinks: [{ name: 'Apple Watch', slug: 'apple-watch-search', url: 'https://www.amazon.com/s?k=Apple%20Watch&rh=p_123%3A110955&tag=kygohealthapp-20' }]
      },
      'oura': {
        name: 'Oura Ring', short: 'Oura', color: '#B8975E',
        imageUrl: img('273a63_722e50e1a554453eb4c71a2e7a58925d'),
        bestFor: 'Sleep stages, sleep timing, overnight HRV, resting heart rate',
        subscription: '$5.99/mo required',
        strengths: [
          'Most accurate overnight HRV: 6% error, agreement 0.99 (Ring 4, 139 nights, independent)',
          'Most accurate resting heart rate overnight: 1.1 bpm, 1.9% (Ring 4; Polar 2.71% and WHOOP 1.8 bpm in the same study)',
          'Most accurate sleep stages in healthy sleepers (κ 0.65 vs Apple 0.60, Fitbit 0.55 in Oura\'s own study; independent preprint agrees on the order)',
          'Most accurate sleep timing: total sleep within 2 min, catches 73% of wake (96 adults, multi-night)',
          'Only brand with a published temperature sensor test (its own)',
          'Lightest Oura yet: Ring 5 weighs 2 to 2.6 g (Oura spec)'
        ],
        weaknesses: [
          'Steps 50 to 69% off before its May 2025 algorithm change; nothing published since',
          'Daytime heart rate error 15% (Gen 3, Gielen 2026), bottom tier',
          'Sleep staging κ=0.35 in a clinical sample; 53% accuracy in sleep-clinic patients',
          'Calorie algorithm changed May 2025 and has not been independently tested',
          'No independent blood oxygen or respiratory rate validation',
          'No FDA-cleared features (Oura IPO filing, Sept 2026); Ring 5 blood pressure is wellness only',
          'Ring 5 has zero validation of any kind'
        ],
        researchNote: 'Sleep κ=0.65 is from an Oura-funded study of screened healthy sleepers that used the same method as the independent studies. In people with sleep complaints Oura scored κ=0.35 (Lee 2023) and 53% accuracy in sleep-clinic patients (Herberger 2025).',
        studyIds: ['robbins2024', 'lee2023', 'herberger2025', 'khan2025', 'dial2025', 'miller2022', 'gielen2026', 'kristiansson2023', 'oura2020temp', 'thigpen2025', 'oura2020rr', 'nielavilen2022'],
        affiliateLinks: [{ name: 'Oura Ring', slug: 'oura-ring-search', url: 'https://www.amazon.com/s?k=Oura%20Ring&tag=kygohealthapp-20' }]
      },
      'garmin': {
        name: 'Garmin', short: 'Garmin', color: '#007CC3',
        imageUrl: img('273a63_c545c093c04d4ca4ade77e5ca43fd433'),
        bestFor: 'Steps, VO2 max (chest strap), workout heart rate',
        subscription: 'None required',
        strengths: [
          'Most accurate steps: +3% in daily life pooled across 59 studies, 1 to 2% on a treadmill in 258 adults',
          'Most accurate VO2 max with a chest strap: 6.7% error in 35 runners, about 7% in two more lab tests',
          'Second for workout heart rate: 2.9 bpm cycling, 6.3% in a ten-device test (Vivoactive 5)',
          'Third for overnight HRV (10.5% error, CCC 0.87, Fenix 6)',
          'FDA-cleared ECG app on select watches (2023)',
          'Up to 11 days of battery (Vivoactive 5, Garmin spec)'
        ],
        weaknesses: [
          'Weakest sleep: stages κ 0.21 to 0.25, catches 27% of wake, reads total sleep 44 min high',
          'Wrist-only VO2 max read 13 mL/kg/min high in 207 mostly older women (56% error)',
          'Largest workout calorie error in a four-brand test (77.6% cycling) and 115% in weight training',
          'Blood oxygen read low at rest (Venu 2s) and high at altitude (Fenix 5X)',
          'Respiratory rate barely tracked real breathing in hospital patients (r 0.28)',
          '11.5% of ECGs came back inconclusive in the FDA study',
          'No flagship since the Fenix 6 has peer-reviewed validation'
        ],
        researchNote: 'Every Garmin figure here is Fenix 5X/6, Forerunner 245, Vivosmart 4/5, Vivoactive 4/5 or Venu 2s. Fenix 8, Forerunner 970 and Venu 4 have nothing beyond one 2026 hospital preprint.',
        studyIds: ['schyvens2025', 'dial2025', 'miller2022', 'gielen2026', 'deleon2026', 'rider2025', 'kostrna2026', 'yun2026', 'lee2026', 'perez2025', 'carrier2025', 'carrier2023', 'engel2026', 'jiang2023', 'schiefer2021', 'knevels2026', 'helmer2024', 'svarre2020', 'an2017', 'montes2020'],
        affiliateLinks: [{ name: 'Garmin', slug: 'garmin-search', url: 'https://www.amazon.com/s?k=garmin%20fitness%20tracker&tag=kygohealthapp-20' }]
      },
      'whoop': {
        name: 'WHOOP', short: 'WHOOP', color: '#2FA37A',
        imageUrl: img('273a63_c52aaaca1f7243f3818cf51d9374dbd4'),
        bestFor: 'Overnight HRV and breathing rate (second), resting heart rate (third)',
        subscription: 'From $199/yr',
        strengths: [
          'Second for overnight HRV: 8% error, agreement 0.94 (4.0, 289 nights, independent)',
          'Third for resting heart rate overnight: 1.8 bpm, 3.0% (same study), 0.3 points behind Polar',
          'Second for breathing rate: +0.1 breaths/min vs sleep-lab belts (Strap 2.0, WHOOP-funded, peer reviewed)',
          'Caught 70% of deep sleep in a mixed sample (Schyvens 2025)',
          'FDA-cleared ECG, WHOOP MG only',
          'Continuous 24/7 wear, no screen'
        ],
        weaknesses: [
          'Daytime heart rate MAPE 8.5% vs 12-lead ECG, second worst of five (Van Oost 2025)',
          'Total-sleep-time bias +24.5 min (Schyvens 2025)',
          'No published calorie, step, SpO2 or independent VO2 max validation',
          'Blood pressure is a wellness estimate, not cleared; FDA dropped its warning letter in June 2026 after WHOOP changed the feature',
          'WHOOP 5.0 and MG have no validation; VO2 max is 5.0/MG only'
        ],
        researchNote: 'The widely quoted "99.7% heart rate accuracy" comes from one night of sleep on WHOOP 3.0 (Miller 2022), in a lab that receives WHOOP support.',
        studyIds: ['schyvens2025', 'dial2025', 'miller2022', 'vanoost2025', 'berryhill2020'],
        affiliateLinks: [{ name: 'WHOOP', slug: 'whoop-search', url: 'https://www.amazon.com/s?k=whoop%20fitness%20tracker&tag=kygohealthapp-20' }]
      },
      'fitbit': {
        name: 'Fitbit', short: 'Fitbit', color: '#00A3AD',
        imageUrl: img('273a63_c12bab319dc34737a386c7449f5f92c7'),
        bestFor: 'Calories (least bad), breathing rate, sleep timing, VO2 max',
        subscription: 'Google Health Premium optional ($9.99/mo)',
        strengths: [
          'Least bad calories: wins three of five head-to-head comparisons, weight-training reads only 4% high',
          'Only brand with an independent breathing rate test: 0.3 to 1 breath/min high (Charge 4)',
          'Second for sleep timing (total sleep -3 min, catches 68% of wake) and third for stages (κ 0.55)',
          'Second for VO2 max: 8.7% (Pixel Watch 3, Google-funded), 9.1% in 60 adults (Charge 2)',
          'Third for workout heart rate; the Charge 6 was best of ten devices (5.5%) but the Sense 2 last of four cycling',
          'Daily calories 9 to 13% off doubly labelled water, the gold standard (Alta HR, Shook 2022)',
          'FDA-cleared ECG (Sense, Sense 2, Charge 5 and 6) and irregular rhythm alerts on most models'
        ],
        weaknesses: [
          'Worst device in the same ten-device heart rate test was also a Fitbit (Inspire 3, 16.5%)',
          'Overcounts steps by 15% in free living pooled across 59 studies, up to 26% in single studies',
          'Smallest average calorie bias, but large misses on single workouts and implausible readings in one study',
          'Pooled heart rate under-reads by 3.4 bpm with wide limits (Chevance 2022)',
          'Blood oxygen over-reads by about 2 points in COPD (Charge 4, ICC 0.32)',
          'No sleep or step validation for any model newer than the Sense / Inspire 2'
        ],
        researchNote: 'Since 19 May 2026 Google derives Fitbit VO2 max only from outdoor GPS runs. That method has no published validation.',
        studyIds: ['schyvens2025', 'lee2023', 'robbins2024', 'gielen2026', 'chevance2022', 'cheung2025', 'miwa2026', 'kostrna2026', 'yun2026', 'lee2026', 'perez2025', 'shook2022', 'lambe2026pixel', 'freeberg2019', 'hermans2024', 'natarajan2021', 'nasr2025', 'doheny2024'],
        affiliateLinks: [{ name: 'Fitbit', slug: 'fitbit-search', url: 'https://www.amazon.com/s?k=Fitbit%3A&rh=p_123%3A213215&tag=kygohealthapp-20' }]
      },
      'samsung': {
        name: 'Samsung Galaxy Watch', short: 'Samsung', color: '#E08A00',
        imageUrl: img('273a63_21fd42e4a5d1459bb6db751a0ea5e161'),
        bestFor: 'Blood oxygen and calories (second), steps (third), sleep apnea screening',
        subscription: 'None required',
        strengths: [
          'Second for blood oxygen: Arms 3.8 in a low-oxygen test (Galaxy Watch 5), 1.8 vs arterial blood under the FDA protocol (Samsung-funded)',
          'Second for calories: most accurate on steady running and walking (9% max treadmill, 0.5% walking)',
          'Third for steps: 10.5% in daily life (Galaxy Watch 4)',
          'Near-ECG heart rate in heart patients on a stress test (Galaxy Watch 4, ICC 0.997), but 3rd of 4 cycling and worst of 4 on a treadmill (Galaxy Watch 6)',
          'FDA-cleared ECG, irregular rhythm alerts and sleep apnea risk check (first sleep apnea feature of its kind, De Novo 2024; v2.0 cleared July 2026 for Galaxy Ring too)'
        ],
        weaknesses: [
          'Calories roughly double true burn on weights (85%) and miss by 67% cycling',
          'Heart rate agreement drops above 160 bpm',
          'Blood oxygen read low in an independent hypoxia test (Galaxy Watch 5, bias -2.6)',
          'Respiratory rate validation was Samsung-funded and tested a research algorithm, not the consumer feature',
          'US blood pressure is a wellness feature, not FDA-cleared, and needs cuff calibration every 28 days',
          'No independent VO2 max, step or sleep validation for any current model; Galaxy Watch 8 and Galaxy Ring have nothing'
        ],
        researchNote: null,
        studyIds: ['lee2023', 'kim2023', 'kostrna2026', 'yun2026', 'lee2026', 'perez2025', 'ferreira2026', 'walzel2023', 'browne2025', 'browne2024', 'jung2023resp', 'kim2026temp', 'sarhaddi2022', 'hong2024'],
        affiliateLinks: [{ name: 'Samsung Galaxy Watch', slug: 'samsung-watch-search', url: 'https://www.amazon.com/s?k=samsung%20galaxy%20watch&rh=p_72%3A1248879011&tag=kygohealthapp-20' }]
      },
      'polar': {
        name: 'Polar', short: 'Polar', color: '#D10019',
        imageUrl: img('273a63_e7e3c05ed0bc4cec8f456cd7f995e70b'),
        bestFor: 'Resting heart rate (second)',
        subscription: 'None required',
        strengths: [
          'Second for resting heart rate overnight: 2.71% error over the first 4 h of sleep (Grit X Pro, Dial 2025), 0.3 points ahead of WHOOP',
          'Corroborated: Vantage V2 night bias -0.7 bpm (Nuuttila 2021, partly Polar-funded)',
          'Total sleep -0.8 min against a lab sleep study (Vantage V, Miller 2022)'
        ],
        weaknesses: [
          'Steps 72% off in free living (Vantage V / M); 6.6 to 9.6% in lab walking (A360)',
          'Sleep stages κ 0.28 (Vantage V), with 33% of deep and 49% of REM caught; catches 51% of wake',
          'Overnight HRV 16.32% error, CCC 0.82 (Grit X Pro), fourth of four in the same study',
          'Workout heart rate 11.2% (Ignite 3) and 13.1% (Pacer) in a ten-device test',
          'Calories 21.10% off on a max treadmill test (Vantage M3)',
          'VO2 max 13.7% error from the resting Fitness Test (Vantage M2, 24 adults, mostly patients)',
          'No blood oxygen readings produced; no breathing rate or skin temperature test'
        ],
        researchNote: 'Polar figures here span several models (Grit X Pro, Vantage V, V2, M, M2 and M3, Ignite 3, Pacer, A360). The Grit X2 Pro linked here has no published validation yet.',
        studyIds: ['miller2022', 'chinoy2022', 'dial2025', 'nuuttila2021', 'gielen2026', 'henriksen2022', 'montes2020', 'perez2025', 'neudorfer2025'],
        affiliateLinks: [{ name: 'Polar Grit X2 Pro', slug: 'polar-grit-x2-pro', url: 'https://www.amazon.com/dp/B0CXHJRWN9?tag=kygohealthapp-20' }]
      }
    };
  }

  // ── Data: scorecard (one cell per metric per device) ──────────────────
  // Levels: strong, good, mixed, weak, vendor (company data only),
  // none (no comparable data), fda (count of cleared features, not accuracy).

  get _levels() {
    return {
      strong: { label: 'Best supported', rank: 5 },
      good: { label: 'Good', rank: 4 },
      mixed: { label: 'Mixed', rank: 3 },
      weak: { label: 'Weak', rank: 2 },
      vendor: { label: 'Company data only', rank: 1 },
      none: { label: 'No comparable data', rank: 0 }
    };
  }

  get _scorecard() {
    return {
      sleep: {
        'apple-watch': ['good', 'κ 0.60 healthy, best REM (83%); 0.53 clinical'], 'oura': ['strong', 'κ 0.65 healthy; 0.35 clinical'], 'garmin': ['weak', 'κ 0.25 healthy, 0.21 clinical'],
        'whoop': ['mixed', 'κ 0.44 healthy, 0.37 clinical'], 'fitbit': ['good', 'κ 0.55 healthy, 0.41 clinical'], 'samsung': ['mixed', 'κ 0.42 clinical only'],
        'polar': ['weak', 'κ 0.28 healthy (Vantage V)']
      },
      sleepTiming: {
        'apple-watch': ['good', 'Total sleep +8 min; catches 52% of wake'], 'oura': ['strong', 'Total sleep -2 min; catches 73% of wake'], 'garmin': ['weak', 'Total sleep +44 min; catches 27% of wake'],
        'whoop': ['mixed', 'Total sleep -12 min; catches 56% of wake (3.0)'], 'fitbit': ['good', 'Total sleep -3 min; catches 68% of wake'], 'samsung': ['none', 'No healthy-adult test'],
        'polar': ['mixed', 'Total sleep -0.8 min; catches 51% of wake (Vantage V)']
      },
      hrv: {
        'apple-watch': ['weak', '29% error, different statistic (SDNN, mornings)'], 'oura': ['strong', '6% error, CCC 0.99 (Ring 4)'], 'garmin': ['mixed', '10.5% error, CCC 0.87 (Fenix 6)'],
        'whoop': ['good', '8% error, CCC 0.94'], 'fitbit': ['none', 'No current-model error figure (Charge 4 reads 7 ms low)'], 'samsung': ['none', 'No test of the watch feature'],
        'polar': ['mixed', '16.3% error, CCC 0.82, first 4 h of sleep (Grit X Pro)']
      },
      rhr: {
        'apple-watch': ['mixed', '5.9%, 3.7 bpm off, mornings lying down (Series 9)'], 'oura': ['strong', '1.9%, 1.1 bpm off overnight (Ring 4)'], 'garmin': ['weak', '5.4 bpm off, one lab night'],
        'whoop': ['good', '3.0%, 1.8 bpm off overnight'], 'fitbit': ['mixed', '+4 bpm in healthy adults (counts relaxed awake time)'], 'samsung': ['none', 'No test of the watch feature'],
        'polar': ['good', '2.7%, first 4 h of sleep (Grit X Pro)']
      },
      activeHr: {
        'apple-watch': ['strong', '2.5 bpm cycling (best of 4); 7.3% ten-device test'], 'oura': ['weak', '15% ten-device test (Gen 3)'], 'garmin': ['strong', '2.9 bpm cycling; 6.3% ten-device test'],
        'whoop': ['mixed', '8.5% treadmill vs 12-lead ECG'], 'fitbit': ['good', '3.9 bpm cycling (Sense 2); 5.5% ten-device test (Charge 6)'], 'samsung': ['mixed', '3.4 bpm cycling; under 2% in heart patients'],
        'polar': ['mixed', '11.2% ten-device test (Ignite 3)']
      },
      spo2: {
        'apple-watch': ['good', 'Arms 2.2, bias -0.1 (Series 8)'], 'oura': ['vendor', 'Own claim only'], 'garmin': ['weak', '3.5 vs arterial blood, reads 2.7 low (Fenix 6 Pro)'],
        'whoop': ['none', 'No study found'], 'fitbit': ['weak', '2 points high, ICC 0.32 (COPD, Charge 4)'], 'samsung': ['mixed', 'Arms 3.8, reads 2.6 low (Galaxy Watch 5)'],
        'polar': ['none', 'No readings produced']
      },
      steps: {
        'apple-watch': ['strong', '+7% daily life pooled; 6.4% in 36 adults'], 'oura': ['weak', '50 to 69% off, pre-2025 algorithm'], 'garmin': ['strong', '+3% daily life pooled; 1 to 2% lab'],
        'whoop': ['none', 'No study'], 'fitbit': ['mixed', '+15% daily life pooled; 3.6% lab'], 'samsung': ['mixed', '10.5% daily life (Galaxy Watch 4)'],
        'polar': ['weak', '72% daily life (Vantage V / M); 6.6 to 9.6% lab (A360)']
      },
      calories: {
        'apple-watch': ['weak', '26% treadmill, 36% cycling, 112% weights'], 'oura': ['none', '21.1% in METs, one lab test (Ring Gen 2), not ranked'], 'garmin': ['weak', '15% treadmill, 78% cycling, 115% weights'],
        'whoop': ['none', 'No study'], 'fitbit': ['weak', '14% treadmill, 32% cycling, 42% weights'], 'samsung': ['weak', '9% treadmill, 67% cycling, 85% weights'],
        'polar': ['weak', '21% treadmill (Vantage M3)']
      },
      vo2max: {
        'apple-watch': ['mixed', '13.2%, reads low (Series 10)'], 'oura': ['vendor', 'No independent test'], 'garmin': ['good', '6.7% with a chest strap (Forerunner 245)'],
        'whoop': ['vendor', 'Unpublished company test'], 'fitbit': ['mixed', '8.7% (Pixel Watch 3, Google-funded); 9.1% (Charge 2)'], 'samsung': ['vendor', 'Press release only'],
        'polar': ['mixed', '13.7%, resting test, mostly patients (Vantage M2)']
      },
      temp: {
        'apple-watch': ['none', 'No sensor test'], 'oura': ['vendor', 'Own 2020 test'], 'garmin': ['none', 'No sensor test'],
        'whoop': ['none', 'No sensor test'], 'fitbit': ['none', 'No sensor test'], 'samsung': ['vendor', 'Wrist vs oral r 0.42, Samsung-funded'],
        'polar': ['none', 'No peer-reviewed test']
      },
      resp: {
        'apple-watch': ['none', 'No readings (2 hospital studies)'], 'oura': ['vendor', 'Own 2020 blog'], 'garmin': ['weak', 'r 0.28, hospital patients'],
        'whoop': ['mixed', '+0.1 /min, WHOOP-funded, peer reviewed (Strap 2.0)'], 'fitbit': ['good', '0.3 to 1 /min high, independent'], 'samsung': ['vendor', 'Samsung-funded research algorithm'],
        'polar': ['none', 'No peer-reviewed test']
      },
      fda: {
        'apple-watch': ['fda', '5 cleared'], 'oura': ['fda0', 'None'], 'garmin': ['fda', '1 (ECG)'],
        'whoop': ['fda', '1 (ECG, MG only)'], 'fitbit': ['fda', '2 (ECG, rhythm)'], 'samsung': ['fda', '3 cleared'],
        'polar': ['none', 'Not checked']
      }
    };
  }

  get _fdaCounts() { return { 'apple-watch': 5, 'samsung': 3, 'fitbit': 2, 'garmin': 1, 'whoop': 1, 'oura': 0 }; }

  // ── Data: metric sections (order = page order) ────────────────────────

  get _sections() {
    return [
      { id: 'sleep', nav: 'Sleep stages', name: 'Sleep stages', icon: 'moon', gold: 'Polysomnography (lab sleep study)',
        short: 'Oura stages sleep most accurately in healthy sleepers, Apple is second and Fitbit third. No tracker matches a lab, and every one gets worse in people with sleep problems.',
        verdict: 'No tracker stages sleep like a lab. In the one study that put Oura, Apple and Fitbit on the same sleepers, Oura scored highest (κ 0.65), Apple second (0.60, with the best REM detection) and Fitbit third (0.55); WHOOP, Garmin and Polar are well behind. Every device drops sharply in people with sleep problems, where Apple holds up best.',
        studies: ['robbins2024', 'svensson2024', 'schyvens2025', 'lee2023', 'herberger2025', 'miller2022', 'topalidis2026'] },
      { id: 'sleepTiming', nav: 'Sleep timing', name: 'Sleep timing', icon: 'clock', gold: 'Polysomnography (lab sleep study)',
        short: 'Oura knows when you were asleep best: total sleep within 2 minutes of a lab study. Fitbit is second, Apple third because it misses half of the time you lie awake.',
        verdict: 'Telling asleep from awake is the part of sleep tracking that drives your sleep score. Oura leads (total sleep within 2 minutes, 73% of wake caught), Fitbit is second and Apple third: Apple reads total sleep 8 minutes high and misses about half of wake. WHOOP and Garmin overestimate sleep by 12 and 44 minutes. In people with sleep problems every brand reads sleep high and catches half of wake at best.',
        studies: ['svensson2024', 'robbins2024', 'miller2022', 'chinoy2021', 'miller2021', 'stone2020', 'schyvens2025', 'herberger2025', 'lee2023', 'byun2023', 'budig2022', 'khan2025', 'chinoy2022'] },
      { id: 'hrv', nav: 'HRV', name: 'Overnight HRV', icon: 'heartPulse', gold: 'Polar H10 chest-strap ECG',
        short: 'Oura Ring 4 matched a chest-strap ECG almost perfectly over 139 nights (6% error). WHOOP is second (8%) and Garmin third (10.5%) in the same independent test; Apple, Fitbit and Samsung have no comparable figure.',
        verdict: 'Oura Ring 4 matched a chest-strap ECG almost perfectly overnight (6% error, agreement 0.99). WHOOP was second (8%, 0.94) and Garmin third (10.5%, 0.87) in the same 536-night independent study; Polar was fourth (16.3%, 0.82, scored on the first four hours of sleep only). Apple reports a different statistic (SDNN, mornings) and was 29% off, Fitbit has no current-model error figure and Samsung has no test of the watch feature.',
        studies: ['dial2025', 'miller2022', 'ogrady2024', 'hermans2024', 'nasr2025', 'sarhaddi2022', 'xu2026'] },
      { id: 'rhr', nav: 'Resting HR', name: 'Resting heart rate', icon: 'heart', gold: 'Chest-strap or lead II ECG',
        short: 'Oura is the most accurate overnight (1.94% error, 1.1 bpm), Polar second (2.71%, first 4 hours of sleep) and WHOOP third (3.00%, 1.8 bpm), all in one independent study; Garmin was 5.4 bpm off in its one lab night.',
        verdict: 'The easiest number a wearable produces. Oura leads (1.1 bpm, 1.94%), Polar is second (2.71%, scored on the first four hours of sleep only) and WHOOP third (1.8 bpm, 3.00%) in the same independent overnight study (Dial 2025); Polar and WHOOP are 0.3 points apart, within noise. Apple was 5.91% off (3.7 bpm) lying down in the morning in a different study. Fitbit reads about 4 bpm high in healthy adults because it counts relaxed awake time, Garmin was 5.4 bpm off in one lab night and Samsung has no test of the watch feature.',
        studies: ['dial2025', 'miller2022', 'sarhaddi2022', 'ziaurrehman2024', 'haghayegh2019hr', 'stucky2021', 'hermans2024', 'doheny2024', 'ogrady2024', 'nuuttila2021'] },
      { id: 'activeHr', nav: 'Active HR', name: 'Heart rate during activity', icon: 'activity', gold: 'Chest strap or 12-lead ECG',
        short: 'Apple edges Garmin and Fitbit across three head-to-head tests, and the top four brands sit within 2 to 7% of each other. Model matters: the best and worst devices in a ten-device test were both Fitbits.',
        verdict: 'Apple is first: lowest error of four watches cycling (2.5 bpm), bias zero in a second cycling test and near-zero pooled bias across 22 studies. Garmin is second (2.9 bpm cycling, 6.3% in the ten-device test) and Fitbit third (best of ten with the Charge 6 at 5.5%, but last of four cycling with the Sense 2). Samsung is fourth; its sub-2% result was heart patients on a stress test. The order is not firm: the top four are within 2 to 7%. Arm movement, not intensity, is what breaks the reading.',
        studies: ['gielen2026', 'vanoost2025', 'kim2023', 'ceugniez2025', 'lambe2026', 'chevance2022'] },
      { id: 'spo2', nav: 'SpO2', name: 'SpO2', icon: 'droplet', gold: 'Arterial blood or hospital oximeter',
        short: 'Apple is the most accurate (2.2 points off in a low-oxygen test), Samsung second (3.8, reads low) and Garmin a distant third. Every watch is least reliable when oxygen is truly low.',
        verdict: 'Apple leads: Arms 2.2 in a low-oxygen lab test, 2.4 against arterial blood in 112 patients, pooled bias near zero across nine studies. Samsung is second (Arms 3.8, reads 2.6 low) and Garmin third by default (3.5 against arterial blood, fails the ISO limit against a finger oximeter). Fitbit has two small, poor tests; Oura and WHOOP have none. When oxygen is truly low no watch has proven reliable, and 10 to 45% of readings simply fail.',
        studies: ['walzel2023', 'jiang2023', 'jiang2026', 'browne2025', 'browne2024', 'schiefer2021', 'knevels2026', 'hermans2024', 'lee2026fitbit', 'hearn2023', 'lambe2026', 'apple2022spo2'] },
      { id: 'steps', nav: 'Steps', name: 'Step counting', icon: 'steps', gold: 'Hand count (lab) or research pedometer (daily life)',
        short: 'Garmin counts steps most accurately: 3% over in daily life across 59 studies and 1 to 2% in the lab. Apple is second (7%), Samsung third. Fitbit and especially Oura overcount in daily life.',
        verdict: 'Garmin is first: 3% over in daily life pooled across 59 studies, and 1 to 2% on a treadmill in 258 adults. Apple is second (7% pooled, 6.4% in a 36-adult study, within 3.4% at every treadmill speed) and Samsung third (10.5% in daily life). Fitbit is 3.6% on a normal lab walk but overcounts by 15% in daily life, which is how people use it. Oura was 50 to 69% off before its May 2025 algorithm change, with nothing published since.',
        studies: ['hong2024', 'miwa2026', 'rowe2025', 'deleon2026', 'rider2025', 'cheung2025', 'ozel2026', 'giurgiu2023', 'kristiansson2023', 'svarre2020', 'nielavilen2022', 'an2017', 'montes2020'] },
      { id: 'calories', nav: 'Calories', name: 'Calories burned', icon: 'flame', gold: 'Indirect calorimetry (lab gas analysis)',
        short: 'The least accurate number on any wearable. Fitbit is least bad, Samsung second, Apple third, and no brand came within 9% on the max treadmill test.',
        verdict: 'The least accurate number on any wearable. Across four head-to-head lab tests on the same people, Fitbit wins three of five comparisons and has the smallest worst case (42% on weights, where it reads only 4% high); Samsung is the most accurate on steady running and walking but roughly doubles true burn on weights; Apple and Garmin are off by 112% and 115% on weights. No brand came within 9% on the max treadmill test. Oura has one lab test against gas analysis (21.1% error for Oura Ring Gen 2, an older model, measured as METs), listed as context and not ranked; WHOOP has no calorie study.',
        studies: ['kostrna2026', 'yun2026', 'lee2026', 'perez2025', 'shook2022', 'henriksen2022', 'miwa2026', 'ferreira2026', 'apple2024wp', 'shcherbina2017'] },
      { id: 'vo2max', nav: 'VO2 max', name: 'VO2 max', icon: 'lungs', gold: 'Lab metabolic cart (CPET)',
        short: 'Garmin has the most validation at about 7% error. Apple reads low in all three independent studies, and Fitbit\'s Pixel Watch 3 came in at 8.7% in a Google-funded test.',
        verdict: 'Garmin has the most independent validation at about 7% error. Apple has three independent studies and underestimates in all of them. Fitbit\'s Pixel Watch 3 came in at 8.7% in a Google-funded test; its older Charge 2 studies tested a method Google has retired. Polar\'s resting Fitness Test was 13.7% off in 24 mostly patient adults (Vantage M2), not ranked. Oura, WHOOP and Samsung have vendor claims only.',
        studies: ['engel2026', 'carrier2025', 'carrier2023', 'caserman2024', 'lambe2025', 'mayo2026', 'lambe2026pixel', 'klepin2019', 'freeberg2019', 'molina2022', 'neudorfer2025'] },
      { id: 'temp', nav: 'Skin temp', name: 'Skin temperature', icon: 'thermo', gold: 'Research-grade iButton sensors',
        short: 'No independent study has tested any brand\'s temperature sensor.',
        verdict: 'No independent study has tested any brand\'s temperature sensor. Oura is the only brand that has published a sensor test, and it ran that test itself.',
        studies: ['oura2020temp', 'thigpen2025', 'wang2025', 'kim2026temp'] },
      { id: 'resp', nav: 'Breathing', name: 'Breathing rate', icon: 'wind', gold: 'Nasal airflow, chest bands or impedance',
        short: 'Fitbit is the only brand with an independent test of the shipped feature (0.3 to 1 breath a minute high); WHOOP is second on a peer-reviewed company-funded test. No third qualifies.',
        verdict: 'Only two brands qualify. Fitbit is first: an independent overnight test put the Charge 4 0.3 to 1 breath a minute high, and Fitbit\'s own test agrees (RMSE 0.65). WHOOP is second on a WHOOP-funded but peer-reviewed sleep-lab test of the Strap 2.0 (+0.1 a minute). Garmin\'s shipped feature failed its hospital test (r 0.28), Apple gave no readings in two hospital studies, Oura\'s 0.71 is a blog post and Samsung\'s 1.13 is a research algorithm.',
        studies: ['jung2023resp', 'natarajan2021', 'berryhill2020', 'oura2020rr', 'helmer2024', 'knevels2026', 'hermans2024', 'abimansour2024'] },
      { id: 'fda', nav: 'FDA-cleared', name: 'FDA-cleared features', icon: 'shieldPlus', gold: 'FDA 510(k) and De Novo decisions',
        short: 'Apple has the most cleared features (5) and Oura has none, but cleared does not mean every case is caught.',
        verdict: 'Apple has the most cleared features (5), then Samsung (3), Fitbit (2), Garmin and WHOOP MG (1 each, ECG). Oura has none. Clearance means a claim was reviewed, not that the alert catches everything.',
        studies: ['fdaK250507', 'fdaK240929', 'fdaDEN180042', 'fdaDEN180044', 'fdaK213971', 'fdaK201168', 'fdaK230292', 'fdaDEN230041', 'fdaK261011', 'fdaK200948', 'fdaK212372', 'fdaK242967', 'fdaK221774', 'fdaK243236'] }
    ];
  }

  // ── Data: study registry ──────────────────────────────────────────────
  // type: peer | preprint | abstract | vendor | regulatory. `funder` is set
  // when a manufacturer funded or authored the work. Regulatory records are
  // listed but never counted as validation studies.

  get _studies() {
    const S = (authors, year, title, journal, doi, n, funder, type, extra) =>
      Object.assign({ authors, year, title, journal, doi, n, funder: funder || null, independent: !funder, type: type || 'peer' }, extra || {});
    const fda = (id, title, maker, kind) => S('FDA', title.year, title.t, kind, null, null, maker, 'regulatory',
      { url: kind === 'De Novo' ? `https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/denovo.cfm?id=${id}` : `https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=${id}`, code: id });
    return {
      // Sleep
      robbins2024: S('Robbins R, et al.', 2024, 'Accuracy of three commercial wearable devices for sleep tracking in healthy adults', 'Sensors', '10.3390/s24206532', 35, 'Oura', 'peer', { note: 'Lead author is a paid Oura advisor. Healthy, screened sample.' }),
      svensson2024: S('Svensson T, et al.', 2024, 'Validity of the Oura Ring Gen 3 against polysomnography over multiple nights in healthy adults', 'Sleep Medicine', '10.1016/j.sleep.2024.01.020', 96, 'Oura', 'peer', { note: 'Oura-funded authors; home polysomnography over several nights.' }),
      topalidis2026: S('Topalidis P, et al.', 2026, 'Head-to-head comparison of eight consumer sleep trackers against polysomnography', 'Preprint', null, 18, null, 'preprint', { note: 'Not peer reviewed; the authors also develop a rival algorithm.' }),
      chinoy2022: S('Chinoy ED, Cuellar JA, Jameson JT, Markwald RR', 2022, 'Performance of four commercial wearable sleep-tracking devices tested under unrestricted conditions at home in healthy young adults', 'Nature and Science of Sleep', '10.2147/NSS.S348795', 21, null, 'peer', { note: 'Reference was an EEG headband (Dreem 2), not polysomnography.' }),
      chinoy2021: S('Chinoy ED, et al.', 2021, 'Performance of seven consumer sleep-tracking devices compared with polysomnography', 'Sleep', '10.1093/sleep/zsaa291', 34),
      miller2021: S('Miller DJ, et al.', 2021, 'A validation of six wearable devices for estimating sleep, heart rate and heart rate variability in healthy adults', 'Biosensors', '10.3390/bios11060185', 6, null, 'peer', { note: 'Lead author later WHOOP-sponsored.' }),
      stone2020: S('Stone JD, et al.', 2020, 'Evaluations of commercial sleep technologies for objective monitoring during routine sleeping conditions', 'Nature and Science of Sleep', '10.2147/NSS.S270705', 5, null, 'peer', { note: 'Reference was an EEG headband, not polysomnography.' }),
      byun2023: S('Byun JH, et al.', 2023, 'Validity of the Galaxy Watch 2 for sleep in patients with obstructive sleep apnea', 'Chronobiology International', null, 127, null, 'abstract'),
      budig2022: S('Budig M, et al.', 2022, 'Validity of two consumer multisport activity tracker and one accelerometer against polysomnography', 'Sensors', '10.3390/s22239540', 49),
      schyvens2025: S('Schyvens AM, et al.', 2025, 'Performance of six consumer sleep trackers vs polysomnography', 'Sleep Advances', '10.1093/sleepadvances/zpaf021', 62, null, 'peer', { note: 'Per-stage deep and REM values come from supplementary error matrices.' }),
      lee2023: S('Lee T, et al.', 2023, 'Accuracy of 11 wearable, nearable and airable consumer sleep trackers', 'JMIR mHealth and uHealth', '10.2196/50983', '75 (clinical, mean AHI 18)', null, 'peer', { note: 'Several authors are affiliated with Asleep Co., maker of a competing tracker; the conflict cuts against Oura, Fitbit and Apple, not for them.' }),
      haghayegh2019: S('Haghayegh S, et al.', 2019, 'Accuracy of wristband Fitbit models in assessing sleep: systematic review and meta-analysis', 'Journal of Medical Internet Research', '10.2196/16273', 'Meta-analysis'),
      herberger2025: S('Herberger S, et al.', 2025, 'Oura Ring Gen 3 in sleep-clinic patients', 'Scientific Reports', '10.1038/s41598-025-93756-1', 45),
      khan2025: S('Khan S, et al.', 2025, 'Oura Ring sleep measurement: systematic review and meta-analysis', 'OTO Open', '10.1002/oto2.70181', '6 studies, 388 people'),
      // HRV / RHR / HR
      ogrady2024: S('O\'Grady B, Lambe R, Baldwin M, Acheson T, Doherty C', 2024, 'The validity of Apple Watch Series 9 and Ultra 2 for serial measurements of heart rate variability and resting heart rate', 'Sensors', '10.3390/s24196220', 39, null, 'peer', { note: '316 readings over 14 days vs Polar H10 and Kubios; Series 9 and Ultra 2 pooled' }),
      nasr2025: S('Nasr N, Behbehani K, Wang J, et al.', 2025, 'Agreement between Fitbit Versa 4 and a reference standard on time-domain nocturnal heart rate variability: a pilot study', 'Digital Health', '10.1177/20552076251394960', 8, null, 'peer', { note: '26 nights vs Firstbeat Bodyguard 3; 7 of 8 had shoulder pain' }),
      xu2026: S('Xu, et al.', 2026, 'Accuracy of photoplethysmography-derived pulse rate variability compared with ECG-derived HRV: systematic review and meta-analysis', 'Sensors', '10.3390/s26165192', '43 studies', null, 'peer', { note: 'Mostly resting, healthy adults; authors say not to generalise to sleep, exercise or free living' }),
      doheny2024: S('Doheny EP, Renerts K, Braun A, et al.', 2024, 'Assessment of Fitbit Charge 4 for sleep stage and heart rate monitoring against polysomnography and during home monitoring in Huntington\'s disease', 'Journal of Clinical Sleep Medicine', '10.5664/jcsm.11098', 10, null, 'peer', { note: 'In-lab polysomnography, then 7 nights at home' }),
      nuuttila2021: S('Nuuttila OP, Korhonen E, Laukkanen J, Kyröläinen H', 2021, 'Validity of the wrist-worn Polar Vantage V2 to measure heart rate and heart rate variability at rest', 'Sensors', '10.3390/s22010137', '39 (29 overnight)', 'Polar', 'peer', { note: 'Partly Polar-funded.' }),
      dial2025: S('Dial MB, et al.', 2025, 'Validation of nocturnal resting heart rate and HRV in consumer wearables', 'Physiological Reports', '10.14814/phy2.70527', '13 (536 nights)'),
      miller2022: S('Miller, et al.', 2022, 'Six wearables vs polysomnography and ECG for sleep, heart rate and HRV', 'Sensors', '10.3390/s22166317', 53, null, 'peer', { note: 'Funded by the Australian Institute of Sport; the authors\' lab receives funding and equipment from WHOOP.' }),
      gielen2026: S('Gielen J, et al.', 2026, 'Ten-device wrist heart rate validation', 'JMIR Formative Research', '10.2196/85186', '45 (10 sessions per device)', null, 'peer', { note: 'Two devices per participant, so the range is quotable and the order is not.' }),
      ceugniez2025: S('Ceugniez M, et al.', 2025, 'Fitbit Charge 4 heart rate across real training sessions and sports', 'JMIR mHealth and uHealth', '10.2196/54871', 26, null, 'peer', { note: 'No funding statement in the paper; conflicts none declared.' }),
      haghayegh2019hr: S('Haghayegh S, et al.', 2019, 'Accuracy of Fitbit Charge 2 heart rate during sleep', 'Chronobiology International', '10.1080/07420528.2019.1596947', 35, null, 'peer', { note: 'Closed access; figures from the abstract.' }),
      stucky2021: S('Stucky B, et al.', 2021, 'Validation of Fitbit Charge 2 sleep and heart rate in shift workers', 'Journal of Medical Internet Research', '10.2196/26476', 59),
      vanoost2025: S('Van Oost L, et al.', 2025, 'Five wearables vs 12-lead ECG during exercise', 'Sensors', '10.3390/s25206319', 24),
      sarhaddi2022: S('Sarhaddi F, et al.', 2022, 'A comprehensive accuracy assessment of Samsung smartwatch heart rate and heart rate variability', 'PLOS ONE', '10.1371/journal.pone.0268361', 28, null, 'peer', { note: '24 hours free-living; sleep and wake split from self-report logs.' }),
      ziaurrehman2024: S('Zia Ur Rehman R, et al.', 2024, 'Assessment of physiological signals from photoplethysmography sensors compared to an electrocardiogram sensor in daily life', 'Sensors', '10.3390/s24216826', 25, null, 'peer', { note: 'Authors employed by Janssen R&D; no device-maker funding.' }),
      kim2023: S('Kim J, et al.', 2023, 'Apple Watch 7 and Galaxy Watch 4 vs 12-lead ECG during cardiopulmonary exercise testing', 'Annals of Rehabilitation Medicine', '10.5535/arm.23090', '44 cardiac patients'),
      neudorfer2025: S('Neudorfer M, Ötzlinger L, Kumar D, Niebauer J, Smeddinck JD, Sareban M, Treff G', 2025, 'Validation of the Polar Fitness Test for estimation of maximal oxygen consumption at rest in medically supervised exercise training', 'Sensors', '10.3390/s25185649', 24),
      lambe2026pixel: S('Lambe R, et al.', 2026, 'Validity of the Google Pixel Watch 3 for estimating VO2 max and heart rate against a maximal treadmill test', 'PLOS ONE', '10.1371/journal.pone.0356808', 26, 'Google', 'peer', { note: 'Google-funded; authors state Google had no role. Outdoor GPS runs, the method Google now ships.' }),
      lambe2026: S('Lambe R, et al.', 2026, 'The accuracy of Apple Watch measurements: a living systematic review and meta-analysis', 'npj Digital Medicine', '10.1038/s41746-025-02238-1', '82 studies'),
      chevance2022: S('Chevance G, et al.', 2022, 'Accuracy and precision of energy expenditure, heart rate and steps measured by Fitbit', 'JMIR mHealth and uHealth', '10.2196/35626', '32 heart rate studies'),
      // SpO2
      walzel2023: S('Walzel S, et al.', 2023, 'Evaluation of leading smartwatches for the detection of hypoxemia', 'Sensors', '10.3390/s23229164', 18),
      jiang2023: S('Jiang Y, et al.', 2023, 'Accuracy of blood oxygen saturation in common consumer smartwatches', 'PLOS Digital Health', '10.1371/journal.pdig.0000296', 49),
      jiang2026: S('Jiang Y, et al.', 2026, 'Wearable pulse oximetry during controlled hypoxia induction', 'JMIR Formative Research', '10.2196/85253', '9 (308 blood samples)'),
      browne2025: S('Browne SH, et al.', 2025, 'Smartphone and smartwatch pulse oximetry during hypoxia laboratory testing', 'Sensors', '10.3390/s25051286', '12 in the watch arm', 'Samsung'),
      browne2024: S('Browne SH, et al.', 2024, 'Smartwatch vs polysomnography for overnight oximetry and sleep apnea evaluation', 'Journal of Clinical Sleep Medicine', '10.5664/jcsm.11178', 51, null, 'peer', { note: 'Previously mislabelled "Lanfranchi 2024". Samsung funding unconfirmed; only an NIH grant is recorded.' }),
      schiefer2021: S('Schiefer LM, et al.', 2021, 'Garmin Fenix 5X Plus oxygen saturation at 4,559 m', 'Sensors', '10.3390/s21196363', 13),
      hermans2024: S('Hermans F, et al.', 2024, 'Consumer wearable clinical parameters in COPD and healthy controls', 'JMIR mHealth and uHealth', '10.2196/56027', '38'),
      knevels2026: S('Knevels R, et al.', 2026, 'Garmin Venu heart rate, respiratory rate and SpO2 in a respiratory ward', 'Research Square (preprint)', '10.21203/rs.3.rs-10301855/v1', 29, null, 'preprint'),
      hearn2023: S('Hearn, et al.', 2023, 'Arterial oxygen saturation from wearables under varying conditions', 'Aerospace Medicine and Human Performance', '10.3357/AMHP.6078.2023', 10),
      lee2026fitbit: S('Lee, et al.', 2026, 'Fitbit Sense 2 in hospitalized general medicine patients', 'International Journal of Medical Informatics', '10.1016/j.ijmedinf.2026.106704', 33),
      apple2022spo2: S('Apple', 2022, 'Blood Oxygen app on Apple Watch (white paper)', 'Apple', null, 50, 'Apple', 'vendor', { url: 'https://www.apple.com/healthcare/docs/site/Blood_Oxygen_app_on_Apple_Watch_October_2022.pdf' }),
      // Steps
      hong2024: S('Hong KR, Hwang IW, Kim HJ, Yang SH, Lee JM', 2024, 'Apple Watch 6 vs Galaxy Watch 4: a validity study of step-count estimation in daily activities', 'Sensors', '10.3390/s24144658', 104, null, 'peer', { note: '24 hours vs a thigh-worn ActivPAL; 36 Apple, 25 Samsung users' }),
      an2017: S('An HS, Jones GC, Kang SK, Welk GJ, Lee JM', 2017, 'How valid are wearable physical activity trackers for measuring steps?', 'European Journal of Sport Science', '10.1080/17461391.2016.1255261', 35, null, 'peer', { note: 'Vivofit 17.8% MAPE at home vs a pedometer, as reported in the Evenson & Spade 2020 Garmin review (doi 10.1123/jmpb.2019-0035)' }),
      montes2020: S('Montes J, Tandy R, Young J, Lee SP, Navalta JW', 2020, 'Step count reliability and validity of five wearable technology devices while walking and jogging in a free motion setting and on a treadmill', 'International Journal of Exercise Science', '10.70252/IZMD1804', 40),
      svarre2020: S('Svarre FR, Jensen MM, Nielsen J, Villumsen M', 2020, 'The validity of activity trackers is affected by walking speed: Garmin VivosmartHR and StepWatch3', 'PeerJ', '10.7717/peerj.9381', 30),
      nielavilen2022: S('Niela-Vilén H, Azimi I, Suorsa K, et al.', 2022, 'Comparison of Oura smart ring against ActiGraph accelerometer for physical activity and sedentary time in a free-living context', 'Computers, Informatics, Nursing', '10.1097/CIN.0000000000000885', 42),
      miwa2026: S('Miwa T, et al.', 2026, 'Consumer wearables vs a research-grade monitor for physical activity in free living', 'PLOS ONE', '10.1371/journal.pone.0342543', 36, null, 'peer', { note: 'Funded by Chugai Pharmaceutical; authors are employees. Only 5 wore Oura.' }),
      rowe2025: S('Rowe G, et al.', 2025, 'Apple Watch step counting during slow and shuffling gait', 'PLOS ONE', '10.1371/journal.pone.0333504', null),
      deleon2026: S('de Leon MF, et al.', 2026, 'Garmin Vivoactive 4 heart rate, calories and steps on a treadmill', 'Applied Sciences', '10.3390/app16031286', 18),
      rider2025: S('Rider BC, et al.', 2025, 'Four smartwatches in laboratory and field conditions', 'Journal for the Measurement of Physical Behaviour', '10.1123/jmpb.2025-0012', 12),
      cheung2025: S('Cheung YS, et al.', 2025, 'Fitbit Inspire 2 treadmill step accuracy', 'Physiotherapy Practice and Research', '10.1177/22130683251337300', 30),
      giurgiu2023: S('Giurgiu M, et al.', 2023, 'Validity of wearable monitors and smartphone applications for measuring steps in semi-structured and free-living settings', 'Technologies', '10.3390/technologies11010029', null),
      ozel2026: S('Özel A, et al.', 2026, 'Why your smartwatch may be misleading your doctor: mobility aids and wearable accuracy in older adults', 'PeerJ', '10.7717/peerj.20690', '42 adults aged 51 to 80'),
      kristiansson2023: S('Kristiansson E, Fridolfsson J, Arvidsson D, Holmäng A, Börjesson M, Andersson-Hall U', 2023, 'Validation of Oura ring energy expenditure and steps in laboratory and free-living (correction 10.1186/s12874-023-02029-w)', 'BMC Medical Research Methodology', '10.1186/s12874-023-01868-x', null),
      // Calories
      kostrna2026: S('Kostrna, et al.', 2026, 'Four smartwatches vs indirect calorimetry during cycling', 'PLOS ONE', '10.1371/journal.pone.0353261', 58),
      lee2026: S('Lee TH, et al.', 2026, 'Four smartwatches during endurance and resistance exercise vs indirect calorimetry', 'Sensors', '10.3390/s26082526', 62, null, 'peer', { note: 'One author works at SOLUM, a sensor company, which funded the study; not one of the seven brands. Same lab as Yun 2026 but a separate sample. The abstract says "underestimated"; the tables show all four watches reading high.' }),
      yun2026: S('Yun, Ko, Lee', 2026, 'Four smartwatches during resistance exercise', 'Bioengineering', '10.3390/bioengineering13101099', 70),
      perez2025: S('Perez, Davis, Wong, Navalta', 2025, 'Five wrist wearables with sex-specific energy expenditure algorithms', 'Int J Exercise Science Conference Proceedings (abstract)', null, '97 (about 20 per device)', null, 'abstract'),
      ferreira2026: S('Ferreira, et al.', 2026, 'Galaxy Watch 6 and 7 during intermittent running', 'JMIR Formative Research', '10.2196/83090', 148, 'Samsung'),
      henriksen2022: S('Henriksen A, et al.', 2022, 'Oura Gen 2 and Polar Vantage vs research monitors in free living', 'JMIR Formative Research', '10.2196/27248', null),
      shook2022: S('Shook RP, et al.', 2022, 'Fitbit Alta HR vs doubly labelled water', 'Journal of Nutrition', '10.1093/jn/nxab317', 24),
      apple2024wp: S('Apple', 2024, 'Heart Rate, Calorimetry, and Activity on Apple Watch (white paper)', 'Apple', null, null, 'Apple', 'vendor', { url: 'https://www.apple.com/health/pdf/Heart_Rate_Calorimetry_Activity_on_Apple_Watch_November_2024.pdf' }),
      shcherbina2017: S('Shcherbina A, et al.', 2017, 'Accuracy in wrist-worn devices for heart rate and energy expenditure', 'Journal of Personalized Medicine', '10.3390/jpm7020003', 60),
      // VO2 max
      carrier2025: S('Carrier B, et al.', 2025, 'Validation of aerobic capacity (VO2max) and pulse oximetry in wearable technology', 'Sensors', '10.3390/s25010275', 19),
      carrier2023: S('Carrier B, et al.', 2023, 'Garmin Fenix 6 with chest strap in an athletic sample', 'Technologies', '10.3390/technologies11030071', 20),
      engel2026: S('Engel FA, et al.', 2026, 'Forerunner 245 VO2 max in highly vs moderately trained runners', 'European Journal of Applied Physiology', '10.1007/s00421-025-05923-x', 35),
      caserman2024: S('Caserman P, et al.', 2024, 'Apple Watch VO2 max estimation', 'JMIR Biomedical Engineering', '10.2196/59459', null),
      lambe2025: S('Lambe RF, et al.', 2025, 'Validation of Apple Watch VO2 max estimates', 'PLOS ONE', '10.1371/journal.pone.0323741', null),
      mayo2026: S('Lambe R, et al.', 2026, 'Accuracy of VO2 max estimates from Apple Watch Series 10', 'Mayo Clinic Proceedings: Digital Health', '10.1016/j.mcpdig.2026.100357', 40, null, 'peer', { note: 'Same University College Dublin group as Lambe 2025. 40 tested; fitness-band classification reported for 35.' }),
      klepin2019: S('Klepin K, et al.', 2019, 'Validity of cardiorespiratory fitness measured with Fitbit compared to VO2max', 'Medicine & Science in Sports & Exercise', '10.1249/MSS.0000000000002041', 60),
      freeberg2019: S('Freeberg KA, et al.', 2019, 'Fitbit Charge 2 VO2 max estimation', 'mHealth', '10.21037/mhealth.2019.09.07', null),
      molina2022: S('Molina-Garcia P, et al. (INTERLIVE)', 2022, 'Validity of consumer wearable VO2 max estimates: meta-analysis', 'Sports Medicine', '10.1007/s40279-021-01639-y', 'Meta-analysis'),
      // Skin temperature
      oura2020temp: S('Oura', 2020, 'How accurate is Oura\'s temperature data? (internal study, not peer reviewed)', 'Oura blog', null, '16 people + lab bath test', 'Oura', 'vendor', { url: 'https://ouraring.com/blog/temperature-validated-accurate/' }),
      thigpen2025: S('Thigpen N, et al.', 2025, 'Oura Ring as a tool for ovulation detection', 'Journal of Medical Internet Research', '10.2196/60667', '964 users, 1,155 cycles', 'Oura', 'peer', { note: 'All authors Oura employees.' }),
      wang2025: S('Wang Y, et al.', 2025, 'Wrist temperature algorithms for ovulation and next-period prediction', 'Human Reproduction', '10.1093/humrep/deaf005', '260 people, 889 cycles', 'Apple', 'peer', { note: 'Used an additional Apple Watch prototype, not a retail watch.' }),
      kim2026temp: S('Kim SE, et al.', 2026, 'Galaxy Watch 5 wrist temperature for ovulation prediction', 'Biosensors and Bioelectronics', '10.1016/j.bios.2026.118755', '85 women, 225 cycles', 'Samsung'),
      // Respiratory rate
      jung2023resp: S('Jung H, et al.', 2023, 'Validating a consumer smartwatch for nocturnal respiratory rate', 'Sensors', '10.3390/s23187976', '195 sleep-clinic patients', 'Samsung', 'peer', { note: 'Previously mislabelled "Park 2023" with a wrong DOI. Tested a research algorithm on Galaxy Watch 4/5 sensors, not the consumer feature.' }),
      natarajan2021: S('Natarajan A, et al.', 2021, 'Measurement of respiratory rate using wearable devices', 'npj Digital Medicine', '10.1038/s41746-021-00493-6', '28 people, 52 nights', 'Fitbit'),
      berryhill2020: S('Berryhill S, et al.', 2020, 'Effect of wearables on sleep in healthy individuals: validation study', 'Journal of Clinical Sleep Medicine', '10.5664/jcsm.8356', 32, 'WHOOP'),
      oura2020rr: S('Oura', 2020, 'How accurate is Oura\'s respiratory rate? (not peer reviewed)', 'Oura blog', null, 43, 'Oura', 'vendor', { url: 'https://ouraring.com/blog/how-accurate-is-ouras-respiratory-rate/' }),
      helmer2024: S('Helmer P, et al.', 2024, 'Continuous vital sign monitoring in post-operative patients with consumer fitness trackers', 'Digital Health', '10.1177/20552076241254026', '12 in the Garmin arm'),
      abimansour2024: S('AbiMansour JP, et al.', 2024, 'Consumer wearables for continuous monitoring during endoscopy', 'Frontiers in Digital Health', '10.3389/fdgth.2024.1422929', '292 procedures'),
      // FDA records (regulatory, not validation studies)
      fdaK250507: fda('K250507', { t: 'Apple Hypertension Notification Feature', year: 2025 }, 'Apple', '510(k)'),
      fdaK240929: fda('K240929', { t: 'Apple Sleep Apnea Notification Feature', year: 2024 }, 'Apple', '510(k)'),
      fdaDEN180042: fda('DEN180042', { t: 'Apple Irregular Rhythm Notification Feature', year: 2018 }, 'Apple', 'De Novo'),
      fdaDEN180044: fda('DEN180044', { t: 'Apple ECG App', year: 2018 }, 'Apple', 'De Novo'),
      fdaK213971: fda('K213971', { t: 'Apple AFib History Feature', year: 2022 }, 'Apple', '510(k)'),
      fdaK201168: fda('K201168', { t: 'Samsung ECG Monitor App', year: 2020 }, 'Samsung', '510(k)'),
      fdaK230292: fda('K230292', { t: 'Samsung Irregular Heart Rhythm Notification', year: 2023 }, 'Samsung', '510(k)'),
      fdaDEN230041: fda('DEN230041', { t: 'Samsung Sleep Apnea Feature (first De Novo)', year: 2024 }, 'Samsung', 'De Novo'),
      fdaK261011: fda('K261011', { t: 'Samsung Sleep Apnea Feature v2.0 (Galaxy Watch and Galaxy Ring)', year: 2026 }, 'Samsung', '510(k)'),
      fdaK200948: fda('K200948', { t: 'Fitbit ECG App', year: 2020 }, 'Google / Fitbit', '510(k)'),
      fdaK212372: fda('K212372', { t: 'Fitbit Irregular Rhythm Notifications', year: 2022 }, 'Google / Fitbit', '510(k)'),
      fdaK242967: fda('K242967', { t: 'Pixel Watch Loss of Pulse Detection', year: 2025 }, 'Google', '510(k)'),
      fdaK221774: fda('K221774', { t: 'Garmin ECG App', year: 2023 }, 'Garmin', '510(k)'),
      fdaK243236: fda('K243236', { t: 'WHOOP MG Heart Screener (ECG)', year: 2025 }, 'WHOOP', '510(k)')
    };
  }

  // Counts for the hero and structured data, computed from the registry
  get _heroStats() {
    const all = Object.values(this._studies);
    const studies = all.filter(s => s.type === 'peer' || s.type === 'preprint' || s.type === 'abstract');
    return {
      metrics: 10,
      devices: Object.keys(this._devices).length,
      studies: studies.length,
      funded: all.filter(s => s.type !== 'regulatory' && s.funder).length,
      fda: all.filter(s => s.type === 'regulatory').length,
      independent: studies.filter(s => !s.funder).length,
      fundedStudies: studies.filter(s => s.funder).length,
      recent: studies.filter(s => s.year >= 2025).length
    };
  }

  // ── Icons (sleep-tool set + a few extras) ─────────────────────────────

  _icon(name) {
    const P = {
      check: '<polyline points="20 6 9 17 4 12"/>',
      run: '<circle cx="14" cy="4" r="2"/><path d="M12 8l-2 5M8 10l4-2 3 3h3M10 13l3 3-1 5M10 13l-3 4H4"/>',
      bike: '<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>',
      tennis: '<circle cx="9" cy="9" r="6"/><path d="M13.5 13.5 20 20M5 9h8M9 5v8"/><circle cx="19" cy="5" r="2"/>',
      compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
      shuttle: '<path d="M10 17h4v1a2 2 0 0 1-4 0z"/><path d="M10 17 6 4h12l-4 13M9.5 4l1.5 13M14.5 4 13 17M7.2 8h9.6"/>',
      soccer: '<circle cx="12" cy="12" r="10"/><path d="M12 7l4 3-1.5 4.5h-5L8 10z"/><path d="M12 2v5M16 10l5-1.5M14.5 14.5l3 4.5M9.5 14.5l-3 4.5M8 10 3 8.5"/>',
      minus: '<line x1="5" y1="12" x2="19" y2="12"/>',
      arrowRight: '<path d="M5 12h14M13 5l7 7-7 7"/>',
      externalLink: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
      info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
      alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
      user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
      layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
      dollar: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
      shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
      droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
      flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
      plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
      moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
      activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
      heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>',
      heartPulse: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/><polyline points="3.5 12 8 12 10 9 13 15 15 12 20.5 12"/>',
      steps: '<path d="M4 16v-2.4C4 11.5 3 10.5 3 8c0-2.7 1.5-6 4.5-6C9.4 2 10 3.8 10 5.5c0 3.1-2 5.7-2 8.7V16a2 2 0 1 1-4 0z"/><path d="M20 20v-2.4c0-2.1 1-3.1 1-5.6 0-2.7-1.5-6-4.5-6C14.6 6 14 7.8 14 9.5c0 3.1 2 5.7 2 8.7V20a2 2 0 1 0 4 0z"/>',
      lungs: '<path d="M6.08 9.5A4 4 0 0 0 2 13.5V18a2 2 0 0 0 2 2h1.5A2.5 2.5 0 0 0 8 17.5V12a3 3 0 0 0-1.92-2.5z"/><path d="M17.92 9.5A4 4 0 0 1 22 13.5V18a2 2 0 0 1-2 2h-1.5a2.5 2.5 0 0 1-2.5-2.5V12a3 3 0 0 1 1.92-2.5z"/><path d="M12 4v8M8 12c2 0 4-1 4-3M16 12c-2 0-4-1-4-3"/>',
      thermo: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>',
      wind: '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>',
      shieldPlus: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v6M9 11h6"/>',
      bulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z"/>',
      barChart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
      fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
      chevronDown: '<polyline points="6 9 12 15 18 9"/>',
      x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
      arrowsLR: '<path d="M3 12h18"/><polyline points="7 8 3 12 7 16"/><polyline points="17 8 21 12 17 16"/>',
      trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'
    }[name] || '<circle cx="12" cy="12" r="10"/>';
    const sw = name === 'check' ? 3 : 2;
    return `<span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${P}</svg></span>`;
  }

  // ── Small render helpers (sleep-tool vocabulary) ──────────────────────

  _pill(text, tone) { return `<span class="vpill ${tone || 'mid'}">${text}</span>`; }
  _na() { return `<span class="mk off"><span class="dash"></span></span>`; }
  _logo(dk, size) {
    const d = this._devices[dk];
    return `<span class="brand-img${size === 'sm' ? ' sm' : ''}"><img src="${d.imageUrl}" alt="${d.name}" loading="lazy" /></span>`;
  }
  _amazon(dk, position) {
    const l = this._devices[dk].affiliateLinks[0];
    return `<a class="amz-link" href="${l.url}" target="_blank" rel="sponsored nofollow noopener" data-action="affiliate-click" data-track-label="${l.slug}" data-track-position="${position}">Amazon ${this._icon('arrowRight')}</a>`;
  }
  _grade(level) {
    return ({
      strong: this._pill('Strong', 'good'), good: this._pill('Good', 'good'), mixed: this._pill('Mixed', 'mid'),
      weak: this._pill('Weak', 'dark'), vendor: this._pill('Company data', 'line'), none: this._na()
    })[level] || this._na();
  }

  /**
   * Ranking table in the sleep-tool style.
   * spec.cols: [{ key, label, short, bar: {min, max} }]  (first col may carry a bar)
   * spec.rows: [{ dev, model, grade, cells: { key: { t, tone, note } } }]
   */
  _isFund(note) { return note && /funded|linked|staff/i.test(note); }

  _rankTable(spec) {
    const cols = spec.cols;
    const head = `<tr>
      <th class="cmp-th-device" scope="col">Wearable</th>
      ${cols.map(c => `<th scope="col" class="${c.bar ? 'th-bar' : ''}"><span class="th-full">${c.label}</span><span class="th-short" aria-hidden="true">${c.short || c.label}</span></th>`).join('')}
      ${spec.noGrade ? '' : '<th scope="col">Grade</th>'}
      ${spec.noBuy ? '' : '<th scope="col">Buy</th>'}
    </tr>`;
    const body = spec.rows.map((r, i) => {
      const d = this._devices[r.dev];
      const cells = cols.map(c => {
        const v = r.cells[c.key];
        const lab = ` data-label="${c.short || c.label}"`;
        if (!v) return `<td${lab}${c.bar ? ' class="td-bar"' : ''}>${this._na()}</td>`;
        if (spec.plain && !c.bar) return `<td${lab}><span class="cell cell-plain"><span class="cp-v">${v.t}</span>${v.note ? `<span class="cp-n">${v.note}</span>` : ''}</span></td>`;
        const fund = this._isFund(v.note);
        const note = v.note ? (fund ? `<span class="fund-tag">${v.note}</span>` : `<span class="cell-note">${v.note}</span>`) : '';
        if (c.bar && v.v != null) {
          const w = Math.max(3, Math.min(100, (v.v - c.bar.min) / (c.bar.max - c.bar.min) * 100));
          return `<td class="td-bar"${lab}><span class="barcell"><span class="bar-track"><span class="bar-fill tone-${v.tone}${fund ? ' is-funded' : ''}" style="--w:${w}%;--i:${i}"></span></span><span class="bar-val">${v.t}</span></span>${note}</td>`;
        }
        return `<td${lab}><span class="cell">${this._pill(v.t, v.tone)}${note}</span></td>`;
      }).join('');
      const empty = !cols.some(c => r.cells[c.key]);
      return `<tr${empty ? ' class="row-empty"' : ''}>
        <th class="cmp-td-device${spec.plain ? ' td-stack' : ''}" scope="row">
          <span class="brand">${this._logo(r.dev, 'sm')}<span class="brand-text"><span class="brand-name">${d.short}${r.model ? ` <span class="brand-model">${r.model}</span>` : ''}</span></span></span>
        </th>
        ${cells}
        ${spec.noGrade ? '' : `<td class="td-grade" data-label="Grade">${spec.plain ? (r.grade === 'vendor' ? '<span class="cp-na">Company claim only</span>' : r.grade === 'none' ? this._na() : this._grade(r.grade)) : this._grade(r.grade)}</td>`}
        ${spec.noBuy ? '' : `<td class="td-buy">${this._amazon(r.dev, 'metric-' + spec.id)}</td>`}
      </tr>`;
    }).join('');
    return `
      <div class="cmp rank">
        <div class="cmp-scroll"><table class="cmp-table rank-table${spec.plain ? ' rank-plain' : ''}"><thead>${head}</thead><tbody>${body}</tbody></table></div>
        ${spec.legend ? `<p class="cmp-legend">${this._icon('info')}<span>${spec.legend}</span></p>` : ''}
      </div>`;
  }

  /** Compact secondary table for the "dive deeper" drawers (no buy column). */
  _miniTable(title, cols, rows, foot) {
    return `
      <div class="mini">
        <div class="mini-title">${title}</div>
        <div class="cmp-scroll"><table class="cmp-table mini-table">
          <thead><tr><th class="cmp-th-device" scope="col">Wearable</th>${cols.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead>
          <tbody>${rows.map(r => `<tr><th class="cmp-td-device" scope="row"><span class="brand">${this._logo(r.dev, 'sm')}<span class="brand-text"><span class="brand-name">${this._devices[r.dev].short}${r.model ? ` <span class="brand-model">${r.model}</span>` : ''}</span></span></span></th>${r.cells.map((c, j) => `<td data-label="${cols[j]}">${c == null ? this._na() : c}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>
        ${foot ? `<p class="mini-foot">${foot}</p>` : ''}
      </div>`;
  }

  _scTabs(views) {
    if (views.length === 1) { const v = views[0]; return `<div class="sc-tabs sc-tabs-one"><span class="sc-tab on">${this._icon(v.icon)}<span class="sc-tl">${v.tab}</span></span></div>`; }
    return `<div class="sc-tabs" role="tablist">${views.map((v, i) => `<button type="button" class="sc-tab${i ? '' : ' on'}" role="tab" aria-selected="${!i}" data-sc="${v.id}">${this._icon(v.icon)}<span class="sc-tl">${v.tab}</span><span class="sc-ts" aria-hidden="true">${v.tabS}</span></button>`).join('')}</div>`;
  }

  /**
   * Two-bar chart with view tabs (sleep, HRV, SpO2).
   * cfg: { pos, keys?: [a, b], legend, views: [{ id, tab, tabS, icon, unit, max, ref?, q, keys?: [a, b], rows: [[dev, model, A, B]] }] }
   * A and B are { v: [n] or [lo, hi], src, txt? } or null. Shared keys sit by the tabs; per-view keys sit in the panel.
   */
  _dualChart(cfg, only) {
    const fmt = (n, u) => u === '%' ? n.toFixed(1) + '%' : u === 'ms' ? n.toFixed(1) + ' ms' : u === 'bpm' ? n.toFixed(1) + ' /min' : n.toFixed(2);
    const keyHtml = (k, view) => { const ref = view && view.ref ? `<span><i class="sw ref"></i>${view.refLabel || `${view.ref[1]}: ${view.ref[0]}`}</span>` : ''; const show = k && (k.length > 1 || (view && view.keepKey)); return show || ref ? `<div class="sc-key">${show ? `<span><i class="sw h"></i>${k[0]}</span>${k[1] ? `<span><i class="sw c"></i>${k[1]}</span>` : ''}` : ''}${ref}</div>` : ''; };
    const bar = (cell, kind, view) => {
      const name = (view.keys || cfg.keys)[kind === 'h' ? 0 : 1];
      if (!cell || !cell.v) return `<div class="sc-bar ${kind} is-na" title="${name}"><span class="sc-track"></span><span class="sc-val">${(cell && cell.txt) || 'Not tested'}</span></div>`;
      const lo = cell.v[0], hi = cell.v[cell.v.length - 1];
      if (view.div) {
        const p = n => Math.min(50, Math.abs(n) / view.max * 50);
        const rad = lo >= 0 ? (hi > lo ? '0' : '0 99px 99px 0') : '99px 0 0 99px';
        const fill = `<span class="dv-fill" style="left:${lo >= 0 ? 50 : 50 - p(lo)}%;width:${Math.max(0.8, p(lo))}%;border-radius:${rad}"></span>`;
        const rng = hi > lo ? `<span class="dv-fill rng" style="left:${50 + p(lo)}%;width:${p(hi) - p(lo)}%"></span>` : '';
        const refs = view.ref ? [-1, 1].map(sg => `<span class="sc-ref" style="--l:${50 + sg * p(view.ref[0])}%"></span>`).join('') : '';
        return `<div class="sc-bar dv l${kind === 'h' ? 0 : 1}${cell.alt ? ' alt' : ''}" title="${name}: ${cell.src}"><span class="dv-track">${refs}${fill}${rng}<span class="dv-zero"></span></span><span class="sc-val">${cell.txt}${cell.alt ? `<span class="sc-alt">${typeof cell.alt === 'string' ? cell.alt : 'different study'}</span>` : ''}</span></div>`;
      }
      const mx = Array.isArray(view.max) ? view.max[kind === 'h' ? 0 : 1] : view.max;
      const pct = n => Math.max(2, Math.min(100, n / mx * 100));
      const txt = cell.txt || (cell.v.length > 1 ? `${fmt(lo, view.unit)} to ${fmt(hi, view.unit)}` : fmt(lo, view.unit));
      return `<div class="sc-bar ${kind}${cell.alt ? ' alt' : ''}" title="${name}: ${cell.src}"><span class="sc-track"><span class="sc-fill" style="--w:${pct(lo)}%"></span>${hi > lo ? `<span class="sc-rng" style="--l:${pct(lo)}%;--w:${pct(hi) - pct(lo)}%"></span>` : ''}${view.ref ? `<span class="sc-ref" style="--l:${view.ref[0] / view.max * 100}%"></span>` : ''}</span><span class="sc-val">${txt}${cell.alt ? `<span class="sc-alt">${typeof cell.alt === 'string' ? cell.alt : 'different study'}</span>` : ''}</span></div>`;
    };
    const panels = cfg.views.map((view, vi) => {
      const pick = view.labelRows ? view.rows : view.rows.filter(r => !only || only.includes(r[0]));
      const shown = only || view.labelRows ? pick : pick.filter(r => r[2] || r[3]);
      const missing = only || view.labelRows ? [] : Object.keys(this._devices).filter(k => !view.rows.some(r => r[0] === k && (r[2] || r[3])));
      const rows = shown.map(r => {
        if (view.labelRows) return `<div class="sc-row">
          <div class="sc-dev${cfg.brandOnly ? ' sc-brand-cell' : ''}">${r[4] ? `<span class="sc-ico">${this._icon(r[4])}</span>` : ''}<span class="${cfg.brandOnly ? 'brand-name' : 'brand-text'}">${cfg.brandOnly ? r[1] : `<span class="brand-name">${r[1]}</span>`}</span></div>
          <div class="sc-bars">${bar(r[2], 'h', view)}</div>
        </div>`;
        const d = this._devices[r[0]];
        if (cfg.brandOnly) return `<div class="sc-row">
          <div class="sc-dev sc-brand-cell">${this._logo(r[0], 'sm')}<span class="brand-name">${d.short}</span></div>
          <div class="sc-bars">${bar(r[2], 'h', view)}${(view.keys || cfg.keys)[1] ? bar(r[3], 'c', view) : ''}</div>
        </div>`;
        return `<div class="sc-row">
          <div class="sc-dev">${this._logo(r[0], 'sm')}<span class="brand-text"><span class="brand-name">${d.short} <span class="brand-model">${r[1]}</span></span></span><span class="sc-buy">${this._amazon(r[0], 'metric-' + cfg.pos)}</span></div>
          <div class="sc-bars">${bar(r[2], 'h', view)}${(view.keys || cfg.keys)[1] ? bar(r[3], 'c', view) : ''}</div>
        </div>`;
      }).join('');
      return `<div class="sc-panel" data-sc-panel="${view.id}"${vi ? ' hidden' : ''}>
        <div class="sc-qrow"><p class="sc-q">${view.q}</p>${view.keys || view.ref ? keyHtml(view.keys, view) : ''}</div>
        ${view.div ? `<div class="dv-axis"><span class="dv-ax"><span>${this._icon('arrowRight')}${view.axis[0]}</span><b>0</b><span>${view.axis[1]}${this._icon('arrowRight')}</span></span><span></span></div>` : ''}
        <div class="sc-rows">${rows}</div>
        ${missing.length ? `<div class="sc-foot">${missing.length ? `<span class="sc-miss">Not in this test: ${missing.map(k => `<span class="sc-mi">${this._logo(k, 'sm')}${this._devices[k].short}</span>`).join('')}</span>` : ''}</div>` : ''}
      </div>`;
    }).join('');
    return `<div class="cmp sc${cfg.brandOnly ? ' sc-brand' : ''}"><div class="sc-body">
      <div class="sc-top">
        ${this._scTabs(cfg.views)}
        ${cfg.keys ? keyHtml(cfg.keys) : ''}
      </div>
      ${panels}
      </div><p class="cmp-legend">${this._icon('info')}<span>${cfg.legend}</span></p>
    </div>`;
  }

  /**
   * Over/under chart: bars run left (under) or right (over) from zero; a shaded band shows typical miss either way.
   * view.rows: [{ dev, model, lines: [ { m?: {v, src}, b?: {v, hi?, src}, txt, na? } | null ] }]
   */
  _divChart(cfg, only) {
    const lineHtml = (ln, li, view) => {
      const name = view.keys[li];
      if (ln && ln.note) return `<div class="sc-bar sc-note" title="${name}: ${ln.src || ''}"><span class="sc-notet">${ln.note}</span><span class="sc-val">${ln.txt}</span></div>`;
      if (!ln || ln.na) return `<div class="sc-bar is-na" title="${name}"><span class="sc-track"></span><span class="sc-val">${(ln && ln.na) || 'Not tested'}</span></div>`;
      const p = n => Math.min(50, Math.abs(n) / view.max * 50);
      const tip = [ln.m && ln.m.src, ln.b && ln.b.src].filter(Boolean).join('. ');
      const band = ln.b ? `${ln.b.hi ? `<span class="dv-band out" style="left:${50 - p(ln.b.hi)}%;width:${2 * p(ln.b.hi)}%"></span>` : ''}<span class="dv-band" style="left:${50 - p(ln.b.v)}%;width:${2 * p(ln.b.v)}%"></span>` : '';
      if (view.plain) {
        const w = q => Math.max(2, Math.min(100, q / view.max * 100));
        const lo = ln.m.v, hi = ln.m.hi;
        if (ln.m.ub) return `<div class="sc-bar dv l${li}" title="${name}: ${tip}"><span class="dv-track"><span class="dv-fill rng ub" style="left:0;width:${w(lo)}%"></span></span><span class="sc-val">${ln.txt}</span></div>`;
        return `<div class="sc-bar dv l${li}" title="${name}: ${tip}"><span class="dv-track"><span class="dv-fill" style="left:0;width:${w(lo)}%"></span>${hi ? `<span class="dv-fill rng" style="left:${w(lo)}%;width:${w(hi) - w(lo)}%"></span>` : ''}</span><span class="sc-val">${ln.txt}</span></div>`;
      }
      const fill = ln.m ? `<span class="dv-fill" style="left:${ln.m.v >= 0 ? 50 : 50 - p(ln.m.v)}%;width:${Math.max(0.8, p(ln.m.v))}%;border-radius:${ln.m.v >= 0 ? '0 99px 99px 0' : '99px 0 0 99px'}"></span>` : '';
      return `<div class="sc-bar dv l${li}" title="${name}: ${tip}"><span class="dv-track">${band}${fill}<span class="dv-zero"></span></span><span class="sc-val">${ln.txt}</span></div>`;
    };
    const keyHtml = view => {
      const two = view.keys.length > 1;
      const hasM = view.rows.some(r => (r.lines || []).some(l => l && l.m)), hasB = view.rows.some(r => (r.lines || []).some(l => l && l.b));
      const lineM = i => view.rows.some(r => r.lines && r.lines[i] && r.lines[i].m), lineB = i => view.rows.some(r => r.lines && r.lines[i] && r.lines[i].b);
      const sw = i => lineM(i) && lineB(i) ? `<i class="sw ${i ? 'c' : 'h'}"></i><i class="sw band${i ? ' c' : ''}"></i>` : !lineM(i) && lineB(i) ? `<i class="sw band${i ? ' c' : ''}"></i>` : `<i class="sw ${i ? 'c' : 'h'}"></i>`;
      return `<div class="sc-key">${two ? view.keys.map((k, i) => `<span>${sw(i)}${k}</span>`).join('') : (hasM && !view.plain ? `<span><i class="sw h"></i>Average over or under</span>` : '')}${hasB && !two ? '<span><i class="sw band"></i>Typical miss</span>' : ''}</div>`;
    };
    const panels = cfg.views.map((view, vi) => {
      const pick = view.rows.filter(r => r.group || r.label || !only || only.includes(r.dev)).filter((r, i, a) => !r.group || (a[i + 1] && !a[i + 1].group));
      const missing = view.noMiss ? [] : only ? only.filter(k => !pick.some(r => r.dev === k)) : Object.keys(this._devices).filter(k => !view.rows.some(r => r.dev === k));
      const rows = pick.map(r => {
        if (r.group) return `<div class="sc-grp"><span class="sc-grp-t">${r.group}</span><span class="sc-grp-s">${r.sub}</span></div>`;
        if (r.label) return `<div class="sc-row">
          <div class="sc-dev${cfg.brandOnly ? ' sc-brand-cell' : ''}">${r.icon ? `<span class="sc-ico">${this._icon(r.icon)}</span>` : ''}<span class="brand-text"><span class="brand-name">${r.label}</span></span></div>
          <div class="sc-bars">${view.keys.map((k, li) => lineHtml(r.lines[li], li, view)).join('')}</div>
        </div>`;
        const d = this._devices[r.dev];
        if (cfg.brandOnly) return `<div class="sc-row">
          <div class="sc-dev sc-brand-cell">${this._logo(r.dev, 'sm')}<span class="brand-name">${this._devices[r.dev].short}</span></div>
          <div class="sc-bars">${view.keys.map((k, li) => li && r.lines[li] === undefined ? '' : lineHtml(r.lines[li], li, view)).join('')}</div>
        </div>`;
        const more = r.more && r.more.length ? `<details class="sc-more"><summary>${this._icon('plus')}<span>${r.more.length} more ${r.more.length > 1 ? 'tests' : 'test'}</span></summary><ul>${r.more.map(x => `<li title="${x.src || ''}"><span class="scm-m">${x.model}</span><span class="scm-n">${x.note}</span><span class="scm-v">${x.txt}</span></li>`).join('')}</ul></details>` : '';
        return `<div class="sc-row">
          <div class="sc-dev">${this._logo(r.dev, 'sm')}<span class="brand-text"><span class="brand-name">${d.short} <span class="brand-model">${r.model}</span></span></span><span class="sc-buy">${this._amazon(r.dev, 'metric-' + cfg.pos)}</span></div>
          <div class="sc-bars">${view.keys.map((k, li) => li && r.lines[li] === undefined ? '' : lineHtml(r.lines[li], li, view)).join('')}</div>
          ${more}
        </div>`;
      }).join('');
      return `<div class="sc-panel" data-sc-panel="${view.id}"${vi ? ' hidden' : ''}>
        <div class="sc-qrow"><p class="sc-q">${view.q}</p>${keyHtml(view)}</div>
        ${view.plain ? '' : `<div class="dv-axis"><span class="dv-ax"><span>${this._icon('arrowRight')}${view.axis[0]}</span><b>0</b><span>${view.axis[1]}${this._icon('arrowRight')}</span></span><span></span></div>`}
        <div class="sc-rows">${rows}</div>
        ${view.callout ? `<p class="sc-callout">${this._icon('bulb')}<span>${view.callout}</span></p>` : ''}
        ${missing.length ? `<div class="sc-foot"><span class="sc-miss">Not in this test: ${missing.map(k => `<span class="sc-mi">${this._logo(k, 'sm')}${this._devices[k].short}</span>`).join('')}</span></div>` : ''}
      </div>`;
    }).join('');
    return `<div class="cmp sc${cfg.brandOnly ? ' sc-brand' : ''}"><div class="sc-body">
      <div class="sc-top">${this._scTabs(cfg.views)}</div>
      ${panels}
      </div><p class="cmp-legend">${this._icon('info')}<span>${cfg.legend}</span></p>
    </div>`;
  }

  _sleepStagesChart(only) {
    const V = (v, src, txt) => ({ v, src, txt });
    const K2 = ['Healthy adults', 'Sleep problems'];
    return this._dualChart({
      pos: 'sleep', brandOnly: true,
      legend: 'Healthy adults: Robbins 2024 (Oura-funded, one lab test of Oura, Apple and Fitbit), Svensson 2024 (Oura-funded; Oura deep and REM) and Miller 2022 (WHOOP, Garmin, Polar Vantage V; lab receives WHOOP support). Sleep problems: Schyvens 2025 (Apple, Fitbit, WHOOP, Garmin; about half with sleep apnea), Lee 2023 (Oura kappa, Samsung) and Herberger 2025 (Oura deep and REM, sleep-clinic patients). The independent Topalidis 2026 preprint orders Oura 0.59, WHOOP 0.54, Garmin 0.41, consistent with the healthy column.',
      views: [
        { id: 'overall', tab: 'Overall staging', tabS: 'Overall', icon: 'layers', unit: 'k', max: 1, ref: [0.75, 'Two human scorers'], keys: K2,
          q: 'Match with a lab sleep study (kappa, 1 is perfect)',
          rows: [
            ['oura', 'Ring 3', V([0.65], 'Robbins 2024 (Oura-funded)'), V([0.35], 'Lee 2023')],
            ['apple-watch', 'Series 8', V([0.60], 'Robbins 2024 (Oura-funded)'), V([0.53], 'Schyvens 2025')],
            ['fitbit', 'Sense 2 / Charge 5', V([0.55], 'Robbins 2024 (Oura-funded)'), V([0.41], 'Schyvens 2025, Charge 5')],
            ['whoop', '3.0 / 4.0', V([0.44], 'Miller 2022, WHOOP 3.0'), V([0.37], 'Schyvens 2025, WHOOP 4.0')],
            ['samsung', 'Galaxy Watch 5', null, V([0.42], 'Lee 2023')],
            ['polar', 'Vantage V', V([0.28], 'Miller 2022, Vantage V'), null],
            ['garmin', 'Forerunner 245 / Vivosmart 4', V([0.25], 'Miller 2022, Forerunner 245'), V([0.21], 'Schyvens 2025, Vivosmart 4')]
          ] },
        { id: 'deep', tab: 'Deep sleep', tabS: 'Deep', icon: 'moon', unit: '%', max: 100, keys: K2,
          q: 'Deep sleep correctly caught',
          rows: [
            ['oura', 'Ring 3', V([64.0], 'Svensson 2024 (Oura-funded)'), V([50], 'Herberger 2025')],
            ['apple-watch', 'Series 8', V([50.5], 'Robbins 2024 (Oura-funded)'), V([50.7], 'Schyvens 2025')],
            ['fitbit', 'Sense 2 / Charge 5', V([61.7], 'Robbins 2024 (Oura-funded)'), V([51.5], 'Schyvens 2025')],
            ['whoop', '3.0 / 4.0', V([62], 'Miller 2022'), V([69.6], 'Schyvens 2025')],
            ['samsung', 'Galaxy Watch 5', null, V([47.5], 'Lee 2023')],
            ['polar', 'Vantage V', V([33], 'Miller 2022, Vantage V'), null],
            ['garmin', 'Forerunner 245 / Vivosmart 4', V([28], 'Miller 2022'), V([47.5], 'Schyvens 2025')]
          ] },
        { id: 'rem', tab: 'REM sleep', tabS: 'REM', icon: 'activity', unit: '%', max: 100, keys: K2,
          q: 'REM sleep correctly caught',
          rows: [
            ['oura', 'Ring 3', V([72.6], 'Svensson 2024 (Oura-funded)'), V([55], 'Herberger 2025')],
            ['apple-watch', 'Series 8', V([82.6], 'Robbins 2024 (Oura-funded)'), V([68.6], 'Schyvens 2025')],
            ['fitbit', 'Sense 2 / Charge 5', V([67.6], 'Robbins 2024 (Oura-funded)'), V([60.0], 'Schyvens 2025')],
            ['whoop', '3.0 / 4.0', V([66], 'Miller 2022'), V([62.0], 'Schyvens 2025')],
            ['samsung', 'Galaxy Watch 5', null, V([62.7], 'Lee 2023')],
            ['polar', 'Vantage V', V([49], 'Miller 2022, Vantage V'), null],
            ['garmin', 'Forerunner 245 / Vivosmart 4', V([50], 'Miller 2022'), V([33.1], 'Schyvens 2025')]
          ] }
      ]
    }, only);
  }

  _sleepTimingChart(only) {
    const V = (v, src, txt) => ({ v, src, txt });
    const K2 = ['Healthy adults', 'Sleep problems'];
    const D = { div: true, axis: ['Reads low', 'Reads high'], keys: K2 };
    return this._dualChart({
      pos: 'sleepTiming', brandOnly: true,
      legend: 'Device minus the lab study. Healthy adults: Svensson 2024 (Oura, Oura-funded, 96 adults over several nights), Robbins 2024 (Apple, Fitbit; Oura-funded), Miller 2022 (WHOOP 3.0, Garmin Forerunner 245, Polar Vantage V, Apple asleep vs awake; lab receives WHOOP support), Chinoy 2022 (Polar Vantage V Titan efficiency and fall asleep, vs an EEG headband), Chinoy 2021 (Garmin Vivosmart 3 efficiency, fall asleep, awake at night), Miller 2021 (WHOOP 2.0 fall asleep) and Stone 2020 (WHOOP 2.0 efficiency, vs an EEG headband rather than a lab study). Sleep problems: Schyvens 2025 (Apple, Fitbit Charge 5, WHOOP 4.0), Herberger 2025 (Oura), Lee 2023 (Samsung efficiency), Byun 2023 (Samsung total sleep) and Budig 2022 (Garmin Forerunner 945). Asleep vs awake runs high for every device because most of the night is sleep.',
      views: [
        { id: 'awake', tab: 'Awake time caught', tabS: 'Awake', icon: 'check', unit: '%', max: 100, keys: K2,
          q: 'Time awake in bed correctly caught (higher is better)',
          rows: [
            ['oura', 'Ring 3', V([73.0], 'Svensson 2024 (Oura-funded)'), V([46.2], 'Herberger 2025')],
            ['fitbit', 'Sense 2 / Charge 5', V([67.7], 'Robbins 2024 (Oura-funded)'), V([47.5], 'Schyvens 2025')],
            ['apple-watch', 'Series 8', V([52.4], 'Robbins 2024 (Oura-funded)'), V([52.2], 'Schyvens 2025')],
            ['whoop', '3.0 / 4.0', V([56], 'Miller 2022'), V([40.1], 'Schyvens 2025')],
            ['samsung', 'Galaxy Watch 5', null, V([48.1], 'Lee 2023')],
            ['polar', 'Vantage V', V([51], 'Miller 2022, Vantage V'), null],
            ['garmin', 'Forerunner 245 / Vivosmart 4', V([27], 'Miller 2022'), V([29.4], 'Schyvens 2025')]
          ] },
        Object.assign({ id: 'tst', tab: 'Total sleep time', tabS: 'Total', icon: 'clock', unit: 'min', max: 85,
          q: 'Total sleep time vs a lab study, in minutes (closer to 0 is better)',
          rows: [
            ['oura', 'Ring 3', V([-2.1], 'Svensson 2024 (Oura-funded)', '-2 min'), V([11.7], 'Herberger 2025', '+12 min')],
            ['fitbit', 'Sense 2 / Charge 5', V([-3], 'Robbins 2024 (Oura-funded)', '-3 min'), V([11.1], 'Schyvens 2025', '+11 min')],
            ['apple-watch', 'Series 8', V([8], 'Robbins 2024 (Oura-funded)', '+8 min'), V([19.6], 'Schyvens 2025', '+20 min')],
            ['whoop', '3.0 / 4.0', V([-12.2], 'Miller 2022', '-12 min'), V([24.5], 'Schyvens 2025', '+25 min')],
            ['samsung', 'Galaxy Watch 2', null, V([-24.9], 'Byun 2023, sleep apnea patients', '-25 min')],
            ['polar', 'Vantage V', V([-0.8], 'Miller 2022, Vantage V', '-0.8 min'), null],
            ['garmin', 'Forerunner 245 / 945', V([43.8], 'Miller 2022', '+44 min'), V([83.0], 'Budig 2022, Forerunner 945', '+83 min')]
          ] }, D),
        Object.assign({ id: 'eff', tab: 'Sleep efficiency', tabS: 'Efficiency', icon: 'barChart', unit: 'pts', max: 15,
          q: 'Sleep efficiency vs a lab study, in percentage points (closer to 0 is better)',
          rows: [
            ['oura', 'Ring 3', V([-1.1], 'Svensson 2024 (Oura-funded)', '-1.1 pts'), V([3.0], 'Herberger 2025', '+3.0 pts')],
            ['fitbit', 'Sense 2 / Charge 5', V([-1], 'Robbins 2024 (Oura-funded)', '-1 pt'), V([3.4], 'Schyvens 2025', '+3.4 pts')],
            ['apple-watch', 'Series 8', V([2], 'Robbins 2024 (Oura-funded)', '+2 pts'), V([4.4], 'Schyvens 2025', '+4.4 pts')],
            ['whoop', '2.0 / 4.0', V([7.4], 'Stone 2020, WHOOP 2.0, vs an EEG headband', '+7.4 pts'), V([4.1], 'Schyvens 2025', '+4.1 pts')],
            ['samsung', 'Galaxy Watch 5', null, V([-0.4], 'Lee 2023', '-0.4 pts')],
            ['polar', 'Vantage V Titan', V([0.3], 'Chinoy 2022, Vantage V Titan, vs an EEG headband', '+0.3 pts'), null],
            ['garmin', 'Vivosmart 3 / Forerunner 945', V([10.1], 'Chinoy 2021, Vivosmart 3', '+10.1 pts'), V([14.9], 'Budig 2022', '+14.9 pts')]
          ] }, D),
        Object.assign({ id: 'sol', tab: 'Time to fall asleep', tabS: 'Fall asleep', icon: 'moon', unit: 'min', max: 12,
          q: 'Time to fall asleep vs a lab study, in minutes (closer to 0 is better)',
          rows: [
            ['oura', 'Ring 3', V([0], 'Svensson 2024 (Oura-funded)', '0 min'), V([-3.2], 'Herberger 2025', '-3 min')],
            ['fitbit', 'Sense 2 / Charge 5', V([0], 'Robbins 2024 (Oura-funded)', '0 min'), V([6.6], 'Schyvens 2025', '+7 min')],
            ['apple-watch', 'Series 8', V([2], 'Robbins 2024 (Oura-funded)', '+2 min'), V([1.9], 'Schyvens 2025', '+2 min')],
            ['whoop', '2.0 / 4.0', V([-0.2], 'Miller 2021, WHOOP 2.0', '0 min'), V([-11.0], 'Schyvens 2025', '-11 min')],
            ['polar', 'Vantage V Titan', V([-7.9], 'Chinoy 2022, Vantage V Titan, vs an EEG headband', '-7.9 min'), null],
            ['garmin', 'Vivosmart 3 / Forerunner 945', V([-1.1], 'Chinoy 2021', '-1 min'), V([-10.4], 'Budig 2022', '-10 min')]
          ] }, D),
        Object.assign({ id: 'waso', tab: 'Awake at night', tabS: 'Awake min', icon: 'clock', unit: 'min', max: 50,
          q: 'Time awake during the night vs a lab study, in minutes (closer to 0 is better)',
          rows: [
            ['oura', 'Ring 3', V([-1.8], 'Svensson 2024 (Oura-funded)', '-2 min'), V([-8.6], 'Herberger 2025', '-9 min')],
            ['fitbit', 'Sense 2 / Charge 5', V([4], 'Robbins 2024 (Oura-funded)', '+4 min'), V([-16.9], 'Schyvens 2025', '-17 min')],
            ['apple-watch', 'Series 8', V([-10], 'Robbins 2024 (Oura-funded)', '-10 min'), V([-21.2], 'Schyvens 2025', '-21 min')],
            ['whoop', '4.0', null, V([-19.2], 'Schyvens 2025', '-19 min')],
            ['polar', 'Vantage V', V([-21.3], 'Miller 2022, Vantage V', '-21.3 min'), null],
            ['garmin', 'Vivosmart 3 / Forerunner 945', V([-47.6], 'Chinoy 2021', '-48 min'), V([-49.9], 'Budig 2022', '-50 min')]
          ] }, D),
        { id: 'sw', tab: 'Asleep vs awake', tabS: 'Asleep', icon: 'check', unit: '%', max: 100, keys: ['Healthy adults'], keepKey: true,
          q: 'Asleep or awake, called right (agreement with a lab study)',
          rows: [
            ['apple-watch', 'Series 8', V([93], 'Robbins 2024 (Oura-funded)', '93%'), null],
            ['fitbit', 'Sense 2', V([91], 'Robbins 2024 (Oura-funded)', '91%'), null],
            ['oura', 'Gen 2', V([89], 'Miller 2022, Gen 2', '89%'), null],
            ['garmin', 'Forerunner 245', V([89], 'Miller 2022', '89%'), null],
            ['polar', 'Vantage V', V([87], 'Miller 2022, Vantage V', '87%'), null],
            ['whoop', '3.0', V([86], 'Miller 2022', '86%'), null]
          ] }
      ]
    }, only);
  }

  _hrvChart(only) {
    const V = (v, src, txt, alt) => ({ v, src, txt, alt });
    return this._dualChart({
      pos: 'hrv', brandOnly: true,
      legend: 'Agreement: 1 is perfect; one independent study (Dial 2025, 13 people, 536 nights) sets the medals. Polar (Grit X Pro), marked lighter, was in the same study but scored on the first 4 hours of sleep only, and has no reads high or low figure there. Fitbit (Hermans 2024) and Apple (Miller 2022) are marked as different studies that report the closely related ICC; Samsung has no agreement figure. Reads high or low: the average gap from a chest strap or ECG in milliseconds. Oura, WHOOP and Garmin come from Dial 2025; Apple (O\'Grady 2024, morning readings), Fitbit (Hermans 2024, healthy adults) and Samsung (Sarhaddi 2022, research software, not the watch feature) are separate studies, so compare direction more than size. For scale: Oura read 1 to 2.5 ms low in Dial but an older Oura (Gen 2) read 10 ms low in a one-night lab study.',
      views: [
        { id: 'agree', tab: 'Agreement', tabS: 'Agreement', icon: 'heartPulse', unit: 'k', max: 1, keys: ['Agreement with ECG'],
          q: 'Overnight HRV, agreement with a chest-strap ECG',
          rows: [
            ['oura', 'Ring 4', V([0.99], 'Ring 4: CCC 0.99, 5.96% error (Dial 2025)')],
            ['whoop', '4.0', V([0.94], 'WHOOP 4.0: CCC 0.94, 8.17% error (Dial 2025)')],
            ['garmin', 'Fenix 6', V([0.87], 'Fenix 6: CCC 0.87, 10.52% error (Dial 2025)')],
            ['polar', 'Grit X Pro', V([0.82], 'Grit X Pro: CCC 0.82, 16.32% error, 206 nights, first 4 h of sleep only (Dial 2025)', null, 'first 4 h of sleep')],
            ['fitbit', 'Charge 4', V([0.69], 'Charge 4, Hermans 2024: ICC 0.69 in healthy adults over 7 nights vs a chest strap (0.87 in COPD patients)', null, true)],
            ['apple-watch', 'Series 6', V([0.67], 'Series 6, Miller 2022: ICC 0.67, one lab night, read through a third-party app', null, true)],
            ['samsung', '', null]
          ] },
        { id: 'bias', tab: 'Reads high or low', tabS: 'High or low', icon: 'arrowsLR', div: true, max: 20, axis: ['Reads low', 'Reads high'], keys: ['Average gap, ms'],
          q: 'How far HRV reads high or low on average',
          rows: [
            ['whoop', '4.0', V([-0.78], 'WHOOP 4.0, Dial 2025, 289 nights: average 0.8 ms low, typical miss 4.2 ms', '-0.8 ms')],
            ['oura', 'Ring 4', V([-0.96], 'Ring 4, Dial 2025, 139 nights: average 1.0 ms low, typical miss 3.9 ms (Gen 3: 2.5 ms low)', '-1.0 ms')],
            ['garmin', 'Fenix 6', V([-1.84], 'Fenix 6, Dial 2025, 150 nights: average 1.8 ms low, typical miss 5.3 ms', '-1.8 ms')],
            ['fitbit', 'Charge 4', V([-7], 'Charge 4, Hermans 2024: 7 ms low in healthy adults, 3 ms low in COPD patients (Versa 4 pilot: about 1 ms high, Nasr 2025)', '-7 ms', true)],
            ['apple-watch', 'Series 9 / Ultra 2', V([-8.31], 'Series 9 and Ultra 2, O\'Grady 2024: 8.3 ms low, typical miss 20.5 ms (Series 6 in Miller 2022: 9.6 ms low)', '-8.3 ms', true)],
            ['samsung', 'Gear Sport', V([-18.24], 'Gear Sport, Sarhaddi 2022, asleep: 18.2 ms low, typical miss 22.4 ms; research software, not the watch feature', '-18.2 ms', true)]
          ] }
      ]
    }, only);
  }

  _rhrChart(only) {
    const V = (v, src, txt, alt) => ({ v, src, txt, alt });
    return this._dualChart({
      pos: 'rhr', brandOnly: true,
      legend: 'Percent error: Oura, Polar and WHOOP from one independent overnight study (Dial 2025), which sets the medals; Polar, marked lighter, was scored on the first 4 hours of sleep only, and Polar and WHOOP are 0.3 points apart, within noise. Apple, marked as a different study: mornings lying down (O\'Grady 2024). Polar is corroborated by a Vantage V2 night bias of -0.7 bpm (Nuuttila 2021, partly Polar-funded). Beats off: shorter is better. Oura (138 nights) and WHOOP (288 nights) from Dial 2025. Apple and Garmin, marked as a different study: one night in a lab that receives WHOOP funding (Miller 2022). Fitbit (Charge 4, 10 people with Huntington\'s disease in a lab sleep study, Doheny 2024) and Samsung (Gear Sport asleep, research software, Sarhaddi 2022) measured heart rate through the night rather than one resting value, also marked. Reads high or low: the average gap in bpm, for every brand except Polar (no figure in Dial 2025); Fitbit (Hermans 2024), Samsung (Sarhaddi 2022, research software) and Apple and Garmin (Miller 2022) are separate studies, so compare direction more than size. Older Fitbit studies: Charge 2 0.1 to 0.9 bpm off overnight (Haghayegh 2019, Stucky 2021), Charge HR 0.7 bpm low over a day (Benedetti 2021).',
      views: [
        { id: 'pct', tab: 'Percent error', tabS: 'Percent', icon: 'heart', unit: '%', max: 7, keys: ['Error overnight'],
          q: 'Resting heart rate overnight, percent error against an ECG (sets the medals)',
          rows: [
            ['oura', 'Ring 4', V([1.94], 'Ring 4, Dial 2025, 138 nights', '1.94%'), null],
            ['polar', 'Grit X Pro', V([2.71], 'Grit X Pro, Dial 2025, first 4 h of sleep only. Vantage V2 night bias -0.7 bpm (Nuuttila 2021, partly Polar-funded)', '2.71%', 'first 4 h of sleep'), null],
            ['whoop', '4.0', V([3.00], 'WHOOP 4.0, Dial 2025, 288 nights', '3.00%'), null],
            ['apple-watch', 'Series 9 / Ultra 2', V([5.91], 'Series 9 and Ultra 2, O\'Grady 2024: mornings, lying down', '5.91%', true), null]
          ] },
        { id: 'night', tab: 'Typical error', tabS: 'Error', icon: 'heart', unit: 'bpm', max: 6, keys: ['Beats off overnight'],
          q: 'Resting heart rate overnight, how far off an ECG',
          rows: [
            ['oura', 'Ring 4', V([1.08], 'Ring 4, Dial 2025, 138 nights', '1.1 bpm'), null],
            ['whoop', '4.0', V([1.78], 'WHOOP 4.0, Dial 2025, 288 nights', '1.8 bpm'), null],
            ['apple-watch', 'Series 6', V([1.5], 'Series 6, Miller 2022, one night', '1.5 bpm', true), null],
            ['garmin', 'Forerunner 245', V([5.4], 'Forerunner 245, Miller 2022, one night', '5.4 bpm', true), null],
            ['fitbit', 'Charge 4', V([1.16], 'Charge 4, Doheny 2024: heart rate during an in-lab sleep study, minute by minute, 10 people with Huntington\'s disease', '1.2 bpm', true), null],
            ['samsung', 'Gear Sport', V([1.06], 'Gear Sport, Sarhaddi 2022: heart rate asleep in 5-minute windows (11.1 bpm awake); research software, not the watch feature', '1.1 bpm', true), null]
          ] },
        { id: 'bias', tab: 'Reads high or low', tabS: 'High or low', icon: 'arrowsLR', div: true, max: 6, axis: ['Reads low', 'Reads high'], keys: ['Average gap, bpm'],
          q: 'How far resting heart rate reads high or low on average',
          rows: [
            ['oura', 'Ring 4', V([-0.94], 'Ring 4, Dial 2025, 138 nights: 0.9 bpm low (Gen 3: 0.9 low)', '-0.9 bpm'), null],
            ['whoop', '4.0', V([-1.41], 'WHOOP 4.0, Dial 2025, 288 nights: 1.4 bpm low', '-1.4 bpm'), null],
            ['samsung', 'Gear Sport', V([-0.38], 'Gear Sport, Sarhaddi 2022: 0.4 bpm low asleep (9.5 bpm low awake); research software, not the watch feature', '-0.4 bpm', true), null],
            ['apple-watch', 'Series 6', V([0.5], 'Series 6, Miller 2022, one lab night: 0.5 bpm high', '+0.5 bpm', true), null],
            ['fitbit', 'Charge 4', V([4], 'Charge 4, Hermans 2024: 4 bpm high in healthy adults, 0.3 bpm low in COPD patients, vs a chest strap. Fitbit counts relaxed awake time in resting HR, the reference was sleep only', '+4 bpm', true), null],
            ['garmin', 'Forerunner 245', V([5.0], 'Forerunner 245, Miller 2022, one lab night: 5.0 bpm high', '+5.0 bpm', true), null]
          ] }
      ]
    }, only);
  }

  _activeHrChart(only) {
    const V = (v, src, txt, alt) => ({ v, src, txt, alt });
    return this._dualChart({
      pos: 'activeHr', brandOnly: true,
      legend: 'Typical error, shorter is better. Fitbit, Garmin, Apple, Polar and Oura: one ten-device test against a chest strap (Gielen 2026), read as tiers: Fitbit and Garmin Tier 1, Apple Tier 2, Oura Tier 4; Polar Ignite 3 11.2% and Pacer 13.1%, not on the podium. Medals combine this test with two other head-to-heads on the same people: cycling against a chest strap (Kostrna 2026: Apple 2.5 bpm, Garmin 2.9, Samsung 3.4, Fitbit 3.9) and a treadmill against a 12-lead ECG (Van Oost 2025), which puts Apple first, Garmin second, Fitbit third; the four are within 2 to 7% of each other. WHOOP, marked as a different study: Van Oost 2025. Samsung is not charted: its own test was heart patients in a hospital stress test (Kim 2023, under 2%), and it was 3rd of 4 cycling and worst of 4 on a treadmill (Jeong 2026). By sport: one Fitbit in real training (Ceugniez 2025).',
      views: [
        { id: 'day', tab: 'Daytime', tabS: 'Daytime', icon: 'activity', unit: '%', max: 18, keys: ['Typical error'],
          q: 'Heart rate during daytime activity',
          rows: [
            ['fitbit', 'Charge 6', V([5.5], 'Charge 6, Gielen 2026, Tier 1')],
            ['garmin', 'Vivoactive 5', V([6.3], 'Vivoactive 5, Gielen 2026, Tier 1')],
            ['apple-watch', 'Watch SE', V([7.3], 'Watch SE, Gielen 2026, Tier 2')],
            ['polar', 'Ignite 3', V([11.2], 'Ignite 3, Gielen 2026 (Pacer in the same test: 13.1%)')],
            ['oura', 'Gen 3', V([15.0], 'Gen 3, Gielen 2026, Tier 4')],
            ['whoop', '4.0', V([8.5], 'WHOOP 4.0, treadmill vs 12-lead ECG, Van Oost 2025', null, true)]
          ] },
        { id: 'sport', tab: 'By sport', tabS: 'Sport', icon: 'barChart', unit: '%', max: 20, keys: ['Typical error'], labelRows: true,
          q: 'Same watch, same people, real training',
          rows: [
            ['fitbit', 'Running', V([1.2], 'Fitbit Charge 4, Ceugniez 2025'), null, 'run'],
            ['fitbit', 'Cycling', V([8.1], 'Fitbit Charge 4, Ceugniez 2025'), null, 'bike'],
            ['fitbit', 'Tennis', V([8.9], 'Fitbit Charge 4, Ceugniez 2025: reads low'), null, 'tennis'],
            ['fitbit', 'Orienteering', V([9.5], 'Fitbit Charge 4, Ceugniez 2025: reads low'), null, 'compass'],
            ['fitbit', 'Badminton', V([16.2], 'Fitbit Charge 4, Ceugniez 2025: reads about 16 bpm low'), null, 'shuttle'],
            ['fitbit', 'Soccer', V([17.5], 'Fitbit Charge 4, Ceugniez 2025: reads about 16 bpm low'), null, 'soccer']
          ] }
      ]
    }, only);
  }

  _stepsChart(only) {
    const M = (v, src) => ({ v, src }), B = (v, src, hi) => ({ v, src, hi });
    return this._divChart({
      pos: 'steps', brandOnly: true,
      legend: 'Separate studies, so read each brand on its own. Medals follow the pooled free-living result across 59 studies (Paluch 2026: Garmin +3%, Apple +7%, Fitbit +15%), with Samsung third on its single 24-hour study. Daily life: Miwa 2026, Hong 2024 (Apple and Samsung in the same 24-hour study: 6.4% vs 10.5%), Kristiansson 2023; Oura figures predate its 2025 step update. Garmin: Vivofit, a 2014 model, at home (An 2017). Polar: Vantage V / M (Henriksen 2022) and A360 (Montes 2020). Lab: Fitbit and Garmin on normal treadmill walks (Cheung 2025, de Leon 2026); Apple on slow and shuffle walks (Rowe 2025), which is harder.',
      views: [
        { id: 'life', tab: 'Daily life', tabS: 'Daily life', icon: 'steps', max: 75, keys: ['Daily count'], axis: ['Reads low', 'Reads high'],
          q: 'Steps over whole days of normal life',
          rows: [
            { dev: 'apple-watch', model: '', lines: [{ m: M(2.12, 'Series 6, Miwa 2026, 3 weeks'), b: B(6.4, 'Series 6, Hong 2024, 24 hours'), txt: '+2% · ±6%' }] },
            { dev: 'garmin', model: '', lines: [{ b: B(17.8, 'Vivofit (2014 model) worn at home vs a pedometer, An 2017 (via the Evenson & Spade 2020 Garmin review); no newer Garmin daily-life study'), txt: '±18%' }] },
            { dev: 'fitbit', model: '', lines: [{ m: M(18.0, 'Sense, Miwa 2026, 3 weeks'), txt: '+18%' }] },
            { dev: 'oura', model: '', lines: [{ m: M(18.8, 'Gen 2, Kristiansson 2023: +2,124 steps a day'), b: B(50.3, 'Gen 2, Kristiansson 2023, typical daily miss'), txt: '+19% · ±50%' }] },
            { dev: 'samsung', model: '', lines: [{ b: B(10.5, 'Galaxy Watch 4, Hong 2024, 24 hours vs ActivPAL; Apple Watch 6 in the same study: 6.4%'), txt: '±10.5%' }] },
            { dev: 'polar', model: '', lines: [{ b: B(72, 'Vantage V / M, Henriksen 2022, 57 free-living days vs a hip ActiGraph'), txt: '±72%' }] }
          ] },
        { id: 'lab', tab: 'Lab walking', tabS: 'Lab', icon: 'run', max: 40, keys: ['Step count'], axis: ['Reads low', 'Reads high'],
          q: 'Against a hand or video count',
          rows: [
            { dev: 'fitbit', model: '', lines: [{ b: B(3.6, 'Inspire 2, treadmill, Cheung 2025'), txt: '±3.6%' }] },
            { dev: 'garmin', model: '', lines: [{ b: B(4.6, 'Vivoactive 4, treadmill, de Leon 2026'), txt: '±4.6%' }] },
            { dev: 'apple-watch', model: '', lines: [{ b: B(9.3, 'Series 5, slow and shuffle walk, Rowe 2025'), txt: '±9.3% slow walk' }] },
            { dev: 'polar', model: '', lines: [{ b: B(6.6, 'A360, Montes 2020, walking and jogging vs a hand tally', 9.6), txt: '±6.6 to 9.6%' }] }
          ] }
      ]
    }, only);
  }

  _caloriesChart(only) {
    const M = (v, src) => ({ v, src }), B = (v, src, hi) => ({ v, src, hi });
    return this._divChart({
      pos: 'calories', brandOnly: true,
      legend: 'Typical miss either way (striped) and average over or under (solid). Workouts: cycling with the same 58 people on all four brands (Kostrna 2026) and weight training, 70 men (Yun 2026). Reads high or low: 62 men wore all four through endurance and weight sessions (Lee 2026; its abstract says "underestimated" but its tables show all four reading high). Daily: each brand used a different reference, so do not compare them.',
      views: [
        { id: 'work', tab: 'Workouts', tabS: 'Workouts', icon: 'flame', max: 120, keys: ['Cycling', 'Weight training'], axis: ['Reads low', 'Reads high'],
          q: 'Workout calories, typical miss either way (the studies give no direction)',
          rows: [
            { dev: 'fitbit', model: '', lines: [{ b: B(31.7, 'Sense 2, Kostrna 2026: average only +3 kcal, after 7 implausible readings were removed'), txt: '±32%' }, { b: B(41.7, 'Charge 5, Yun 2026'), txt: '±42%' }] },
            { dev: 'apple-watch', model: '', lines: [{ b: B(35.7, 'Series 8, Kostrna 2026: averaged +21.6 kcal high'), txt: '±36%' }, { b: B(112.2, 'Series 8, Yun 2026'), txt: '±112%' }] },
            { dev: 'samsung', model: '', lines: [{ b: B(66.5, 'Galaxy Watch 5, Kostrna 2026: averaged +56.8 kcal high'), txt: '±67%' }, { b: B(84.5, 'Galaxy Watch 5, Yun 2026'), txt: '±85%' }] },
            { dev: 'garmin', model: '', lines: [{ b: B(77.6, 'Forerunner 955, Kostrna 2026: averaged +68.6 kcal high'), txt: '±78%' }, { b: B(114.9, 'Vivosmart 5, Yun 2026'), txt: '±115%' }] }
          ] },
        { id: 'bias', tab: 'Reads high or low', tabS: 'High or low', icon: 'arrowsLR', max: 120, keys: ['Endurance', 'Weight training'], axis: ['Reads low', 'Reads high'],
          q: 'Average over or under the real burn, same 62 people',
          rows: [
            { dev: 'fitbit', model: '', lines: [{ m: M(21, 'Lee 2026, endurance: averaged 21% high') , txt: '+21%' }, { m: M(4, 'Lee 2026, weight training: averaged 4% high'), txt: '+4%' }] },
            { dev: 'apple-watch', model: '', lines: [{ m: M(14, 'Lee 2026, endurance: averaged 14% high'), txt: '+14%' }, { m: M(112, 'Lee 2026, weight training: averaged 112% high'), txt: '+112%' }] },
            { dev: 'samsung', model: '', lines: [{ m: M(9, 'Lee 2026, endurance: averaged 9% high'), txt: '+9%' }, { m: M(83, 'Lee 2026, weight training: averaged 83% high'), txt: '+83%' }] },
            { dev: 'garmin', model: '', lines: [{ m: M(30, 'Lee 2026, endurance: averaged 30% high'), txt: '+30%' }, { m: M(116, 'Lee 2026, weight training: averaged 116% high'), txt: '+116%' }] }
          ] },
        { id: 'daily', tab: 'Daily totals', tabS: 'Daily', icon: 'clock', max: 140, keys: ['Whole-day burn', 'Activity calories only'], axis: ['Reads low', 'Reads high'],
          q: 'Calories across whole days of normal life',
          rows: [
            { dev: 'fitbit', model: '', lines: [{ b: B(9.3, 'Alta HR vs doubly labelled water, Shook 2022, two 14-day periods; read slightly high', 12.5), txt: '±9 to 13%' }, { m: M(139.2, 'Sense vs ActiGraph, Miwa 2026, 3 weeks'), txt: '+139%' }] },
            { dev: 'oura', model: '', lines: [{ b: B(13, 'Gen 2 vs wrist accelerometers, Kristiansson 2023, 14 days'), txt: '±13%' }, null] },
            { dev: 'apple-watch', model: '', lines: [null, { m: M(25.9, 'Series 6 vs ActiGraph, Miwa 2026, 3 weeks'), txt: '+26%' }] }
          ] }
      ]
    }, only);
  }

  _vo2Chart(only) {
    const M = (v, src, hi) => ({ v, src, hi });
    return this._divChart({
      pos: 'vo2max', brandOnly: true,
      legend: 'Typical error against a lab treadmill test with gas analysis, shorter is better. Rows follow the medal order. Separate studies, so read each brand on its own. Medals: Garmin first on error (6.7% with a chest strap); Fitbit second on the Pixel Watch 3 (8.7%, Google-funded), which uses the outdoor-run method Google now ships, with the Charge 2 at 9.1% on the retired method; Apple third (13.2%, reads low in all three independent studies). Garmin: Engel 2026 (35 runners). Apple: Lambe 2026, Series 10 (40 adults), reading low like two earlier Apple studies. Fitbit: Klepin 2019 (60 people), on an algorithm Google retired in May 2026. Polar: Vantage M2 resting Fitness Test, 13.7% in 24 adults, mostly patients (Neudorfer 2025), not ranked. Oura, WHOOP and Samsung have no independent VO2 max study.',
      views: [
        { id: 'err', tab: 'Typical error', tabS: 'Error', icon: 'barChart', plain: true, max: 18, keys: ['Typical error'],
          q: 'How far off a lab VO2 max test',
          rows: [
            { dev: 'garmin', model: '', lines: [{ m: M(6.7, 'Forerunner 245, Engel 2026, 35 endurance runners'), txt: '6.7%' }] },
            { dev: 'fitbit', model: '', lines: [{ m: M(8.7, 'Pixel Watch 3, Lambe 2026 (Google-funded), 26 adults: reads 0.5 low; Charge 2 9.1% on the retired method (Klepin 2019)'), txt: '8.7%' }] },
            { dev: 'apple-watch', model: '', lines: [{ m: M(13.2, 'Series 10, Lambe 2026, 40 adults: reads 6.3 low'), txt: '13.2%' }] },
            { dev: 'polar', model: '', lines: [{ m: M(13.7, 'Vantage M2 resting Fitness Test, Neudorfer 2025, 24 adults, mostly patients; not ranked'), txt: '13.7%' }] }
          ] }
      ]
    }, only);
  }

  _respChart(only) {
    const V = (v, src, txt) => ({ v, src, txt });
    return this._dualChart({
      pos: 'resp', brandOnly: true,
      legend: 'Breaths per minute off, shorter is better. Different tests and measures (average error, RMSE, bias), so not a ranking. Company tests are mostly healthy sleepers; independent tests include hospital patients. Samsung\'s figure is a research algorithm, not the watch feature. Garmin\'s readings tracked the reference poorly (correlation 0.28). Not charted: Apple Watch Series 7 gave no readings in two independent tests (Helmer 2024, AbiMansour 2024), and WHOOP has only a bias figure (Berryhill 2020, 1.8%).',
      views: [
        { id: 'resp', tab: 'Breathing rate', tabS: 'Breathing', icon: 'wind', unit: 'bpm', max: 5, keys: ['Independent test', 'Company-run test'],
          q: 'Overnight breathing rate, breaths per minute off',
          rows: [
            ['fitbit', '', V([0.3, 1], 'Charge 4, Hermans 2024: reads 0.3 high in COPD, 1 high in healthy adults (ECG-derived reference)', '0.3 to 1/min'), V([0.46], 'Breathing Rate feature, Natarajan 2021 (Fitbit employees, 28 people), average error', '0.5/min')],
            ['garmin', '', V([1.46], 'Fenix 6 Pro, Helmer 2024: reads 1.5 low, correlation only 0.28, ward patients', '1.5/min low'), null],
            ['oura', '', null, V([0.71], '2020 hardware, Oura blog 2020, 43 teenagers, not peer reviewed', '0.7/min')],
            ['samsung', '', null, V([1.13], 'Galaxy Watch 4/5 sensors, Jung 2023, Samsung-funded research algorithm, RMSE', '1.1/min')],
          ] }
      ]
    }, only);
  }

  _spo2Chart(only) {
    const V = (v, src, txt, alt) => ({ v, src, txt, alt });
    return this._dualChart({
      pos: 'spo2', brandOnly: true,
      legend: 'Typical error: oxygen points off, shorter is better; Apple and Samsung come from the same low-oxygen lab test (Walzel 2023), which sets the medals, and Garmin (clinic patients at rest, Jiang 2023) is marked as a different study. Reads high or low: the average gap in oxygen points; Fitbit (Hermans 2024, COPD patients overnight) and Garmin are separate studies, so compare direction more than size. Oura and WHOOP have no independent SpO2 study; Oura has only its own unpublished comparison. Polar produced no SpO2 readings.',
      views: [
        { id: 'spo2', tab: 'Typical error', tabS: 'Error', icon: 'droplet', unit: '%', max: 8, keys: ['Typical error'],
          q: 'How far off a medical reference',
          rows: [
            ['apple-watch', 'Series 8', V([2.2], 'Series 8, Walzel 2023 (2.5% at 80% oxygen or below)'), null],
            ['samsung', 'Galaxy Watch 5', V([3.8], 'Galaxy Watch 5, Walzel 2023: reads low (2.7% at 80% oxygen or below)'), null],
            ['garmin', 'Venu 2s', V([5.8], 'Venu 2s, Jiang 2023: clinic patients at rest, reads low', null, true), null],
            ['oura', '', null, null], ['whoop', '', null, null]
          ] },
        { id: 'bias', tab: 'Reads high or low', tabS: 'High or low', icon: 'arrowsLR', div: true, max: 6, axis: ['Reads low', 'Reads high'], keys: ['Average gap, oxygen points'],
          q: 'How far blood oxygen reads high or low on average',
          rows: [
            ['apple-watch', 'Series 8', V([-0.1], 'Series 8, Walzel 2023, low-oxygen lab test: 0.1 points low on average', '-0.1 pts'), null],
            ['samsung', 'Galaxy Watch 5', V([-2.6], 'Galaxy Watch 5, Walzel 2023, low-oxygen lab test: 2.6 points low on average', '-2.6 pts'), null],
            ['fitbit', 'Charge 4', V([2], 'Charge 4, Hermans 2024: 2 points high overnight in 19 COPD patients, ICC 0.32. Sense 2 in hospital inpatients: 1.7 points high, readings present only 41% of the time (Lee 2026)', '+2 pts', true), null],
            ['garmin', 'Venu 2s', V([-5.5], 'Venu 2s, Jiang 2023: about 5.5 points low in clinic patients at rest', '-5.5 pts', true), null],
            ['oura', '', null, null], ['whoop', '', null, null]
          ] }
      ]
    }, only);
  }

  _notes(items) {
    return `<ul class="dnotes">${items.map(([dk, t]) => this._devices[dk] ? `<li>${this._logo(dk, 'sm')}<span><strong>${this._devices[dk].short}</strong> ${t}</span></li>` : `<li><span><strong>All brands</strong> ${t}</span></li>`).join('')}</ul>`;
  }

  _stat(big, text) { return `<div class="big-stat"><span class="big-num">${big}</span><span>${text}</span></div>`; }

  // ── Per-metric content: primary table + deeper drawers ────────────────

  get _metricContent() {
    const P = (t, tone, note, v) => ({ t, tone, note, v });
    const F = f => `${f}-funded`;
    return {
      sleep: {
        table: {
          cols: [{ key: 'r', label: 'Healthy adults (κ)', short: 'Healthy', bar: { min: 0, max: 0.8 } }, { key: 'c', label: 'Sleep problems (κ)', short: 'Sleep problems' }],
          rows: [
            { dev: 'oura', model: 'Ring 3', grade: 'strong', cells: { r: P('0.65', 'good', F('Oura'), 0.65), c: P('0.35', 'mid') } },
            { dev: 'apple-watch', model: 'Series 8', grade: 'good', cells: { r: P('0.60', 'good', F('Oura'), 0.60), c: P('0.53', 'good') } },
            { dev: 'fitbit', model: 'Sense 2 / Charge 5', grade: 'good', cells: { r: P('0.55', 'mid', F('Oura'), 0.55), c: P('0.41', 'mid') } },
            { dev: 'whoop', model: '3.0 / 4.0', grade: 'mixed', cells: { r: P('0.44', 'mid', null, 0.44), c: P('0.37', 'mid') } },
            { dev: 'samsung', model: 'Galaxy Watch 5', grade: 'mixed', cells: { c: P('0.42', 'good') } },
            { dev: 'polar', model: 'Vantage V', grade: 'weak', cells: { r: P('0.28', 'dark', null, 0.28) } },
            { dev: 'garmin', model: 'Forerunner 245 / Vivosmart 4', grade: 'weak', cells: { r: P('0.25', 'dark', null, 0.25), c: P('0.21', 'dark') } }
          ],
          legend: 'Cohen\'s kappa against an in-lab sleep study. Healthy adults: Robbins 2024 (Oura-funded, same method as the independent studies) and Miller 2022. Sleep problems: Schyvens 2025 and Lee 2023. 0.4 to 0.6 is "moderate"; two human scorers agree at about 0.75.'
        },
        chart: only => this._sleepStagesChart(only),
        tip: 'Treat the stage breakdown as a rough guide, especially if you sleep poorly. Oura is the most accurate stager in healthy sleepers; Apple catches REM best but scores half of deep sleep as light.',
        insight: 'One podium: Oura first (κ 0.65), Apple second (0.60, best REM detection at 83%, but half of deep sleep scored as light), Fitbit third (0.55), all from one Oura-funded lab study of healthy sleepers that used the same method as the independent studies; the independent Topalidis 2026 preprint orders Oura, WHOOP and Garmin the same way. WHOOP (0.44), Garmin (0.25) and Polar (0.28) are well behind. Every device drops in people with sleep problems: Apple holds up best there (0.53), Oura falls to 0.35.',
        link: { url: 'https://www.kygo.app/tools/sleep-tracker-accuracy', label: 'Full sleep breakdown: 7 trackers vs the lab', slug: 'sleep-tracker-accuracy' }
      },
      sleepTiming: {
        chart: only => this._sleepTimingChart(only),
        table: {
          cols: [{ key: 'w', label: 'Awake time caught (healthy)', short: 'Awake caught', bar: { min: 0, max: 100 } }, { key: 't', label: 'Total sleep time (healthy)', short: 'Total sleep' }],
          rows: [
            { dev: 'oura', model: 'Ring 3', grade: 'strong', cells: { w: P('73%', 'good', F('Oura'), 73), t: P('-2 min', 'good') } },
            { dev: 'fitbit', model: 'Sense 2', grade: 'good', cells: { w: P('68%', 'good', F('Oura'), 67.7), t: P('-3 min', 'good') } },
            { dev: 'apple-watch', model: 'Series 8', grade: 'good', cells: { w: P('52%', 'mid', F('Oura'), 52.4), t: P('+8 min', 'good') } },
            { dev: 'whoop', model: '3.0', grade: 'mixed', cells: { w: P('56%', 'mid', null, 56), t: P('-12 min', 'mid') } },
            { dev: 'polar', model: 'Vantage V', grade: 'mixed', cells: { w: P('51%', 'mid', null, 51), t: P('-0.8 min', 'good') } },
            { dev: 'garmin', model: 'Forerunner 245', grade: 'weak', cells: { w: P('27%', 'dark', null, 27), t: P('+44 min', 'dark') } },
            { dev: 'samsung', grade: 'none', cells: {} }
          ],
          legend: 'Healthy adults vs an in-lab sleep study: Svensson 2024 (Oura-funded), Robbins 2024 (Oura-funded), Miller 2022.'
        },
        tip: 'Total sleep time and sleep efficiency are the dependable numbers on Oura, Fitbit and Apple. On any brand, the minutes awake figure is the one to doubt: every device misses a third to two thirds of the time you lie awake.',
        insight: 'One podium: Oura first (total sleep within 2 minutes, catches 73% of wake), Fitbit second (-3 minutes, 68% of wake), Apple third (+8 minutes; misses about half of wake, so it reads time awake at night 10 minutes low). Fitbit beats Apple on five of six timing measures; Apple\'s one win, asleep vs awake agreement, runs high for every device because most of the night is sleep. Polar is close on total sleep (-0.8 minutes, Vantage V) but catches only 51% of wake; WHOOP (-12 minutes, 56% of wake) and Garmin (+44 minutes, 27% of wake) are well behind. In people with sleep problems every brand reads total sleep 11 to 25 minutes high (Garmin 83), and no brand catches more than 52% of wake.'
      },
      hrv: {
        chart: only => this._hrvChart(only),
        table: {
          cols: [{ key: 'ccc', label: 'Agreement with ECG (CCC)', short: 'CCC', bar: { min: 0.7, max: 1 } }, { key: 'mape', label: 'Average error', short: 'Error' }],
          rows: [
            { dev: 'oura', model: 'Ring 4', grade: 'strong', cells: { ccc: P('0.99', 'good', null, 0.99), mape: P('5.96%', 'good') } },
            { dev: 'oura', model: 'Gen 3', grade: 'strong', cells: { ccc: P('0.97', 'good', null, 0.97), mape: P('7.15%', 'mid') } },
            { dev: 'whoop', model: '4.0', grade: 'good', cells: { ccc: P('0.94', 'good', null, 0.94), mape: P('8.17%', 'mid') } },
            { dev: 'garmin', model: 'Fenix 6', grade: 'mixed', cells: { ccc: P('0.87', 'mid', null, 0.87), mape: P('10.52%', 'mid') } },
            { dev: 'apple-watch', grade: 'none', cells: {} },
            { dev: 'fitbit', grade: 'none', cells: {} },
            { dev: 'samsung', grade: 'none', cells: {} }
          ],
          legend: 'Dial 2025: 13 people, 536 nights, overnight, vs a Polar H10 chest strap. Apple, Fitbit and Samsung were not in the study; their own tests are in More data.'
        },
        more: () => this._notes([
          ['oura', 'Ring 4: CCC 0.99, 5.96% error (138 nights); Gen 3: CCC 0.97, 7.15% (470 nights), Dial 2025. Ring 5 has not been tested; the Ring 4 figures do not transfer to a redesigned sensor.'],
          ['whoop', '4.0: CCC 0.94, 8.17% (Dial 2025). WHOOP 3.0 scored ICC 0.99 in a lab that receives WHOOP funding (Miller 2022); its "99% HRV" claim traces to that study. WHOOP 5.0 and MG are untested.'],
          ['garmin', 'Fenix 6: CCC 0.87, 10.52% (Dial 2025). Forerunner 245: ICC 0.24 in Miller 2022, but that was a 3-minute reading while awake before bed, not overnight.'],
          ['polar', 'Grit X Pro: CCC 0.82, 16.32% error over 206 nights, first 4 hours of sleep only (Dial 2025).'],
          ['apple-watch', 'Apple reports SDNN while the others report RMSSD, so Apple HRV numbers are not directly comparable to the rest. Series 9 and Ultra 2 (pooled): read 8.3 ms low on average, typical miss 20.5 ms (29%), outside a ±10 ms equivalence margin; 39 people over 14 days vs a chest strap (O\'Grady 2024). Series 6: 22.5 ms off in one lab night, ICC 0.67, via a third-party sleep app (Miller 2022).'],
          ['fitbit', 'Charge 4: read 3 ms low in COPD patients (ICC 0.87) and 7 ms low in healthy adults (ICC 0.69) over up to 5 nights vs a chest strap (Hermans 2024). Versa 4: nightly median 21.7 vs 20.6 ms, rho 0.94, in an 8-person pilot, 7 with shoulder pain (Nasr 2025).'],
          ['samsung', 'Gear Sport: 22.4 ms off asleep (r 0.78) and 32 ms awake (r 0.25) over 24 hours vs an ECG. The researchers processed raw sensor data with their own software, so this is not the HRV figure the watch shows (Sarhaddi 2022).'],
          ['all', 'Across 43 studies, wrist pulse-based HRV agreed acceptably with ECG at rest, but the authors warn against applying that to sleep, exercise or daily life (Xu 2026).']
        ]),
        tip: 'These are sleep-time numbers, so use overnight HRV only. Most watches and rings read increasingly low when your HRV is high, so very fit people should follow the trend rather than single nights.',
        insight: 'Oura Ring 4 is the clear leader for overnight HRV. Most devices read increasingly low at high HRV (Apple, Oura, Polar and Garmin in Miller 2022; WHOOP, which supplied raw beat data, did not), which matters for very fit people. These are sleep-time numbers only.'
      },
      rhr: {
        chart: only => this._rhrChart(only),
        table: {
          cols: [{ key: 'ccc', label: 'Agreement with ECG (CCC)', short: 'CCC', bar: { min: 0.7, max: 1 } }, { key: 'bpm', label: 'Beats off (second study)', short: 'bpm off' }],
          rows: [
            { dev: 'oura', model: 'Ring 4 / Gen 2', grade: 'strong', cells: { ccc: P('0.98', 'good', 'Ring 4', 0.98), bpm: P('1.8 bpm', 'mid', 'Gen 2') } },
            { dev: 'whoop', model: '4.0 / 3.0', grade: 'good', cells: { ccc: P('0.91', 'good', '4.0', 0.91), bpm: P('0.7 bpm', 'good', '3.0 · WHOOP-linked lab') } },
            { dev: 'apple-watch', model: 'Series 6', grade: 'good', cells: { bpm: P('1.5 bpm', 'good') } },
            { dev: 'garmin', model: 'Forerunner 245', grade: 'weak', cells: { bpm: P('5.4 bpm', 'dark') } },
            { dev: 'fitbit', model: 'Charge 2', grade: 'none', cells: { bpm: P('0.1 to 0.9 bpm', 'good', 'separate studies') } },
            { dev: 'samsung', model: 'Gear Sport', grade: 'none', cells: { bpm: P('1.1 bpm asleep', 'good', 'Sarhaddi 2022') } }
          ],
          legend: 'CCC from Dial 2025 (overnight, chest strap). Beats off from Miller 2022 (53 people, one night, lead II ECG). Two different tests; read each column on its own.'
        },
        more: () => `<div class="stat-pair">
            ${this._stat('11.1 bpm', '<strong>off while awake</strong> versus 1.1 bpm asleep: the same Samsung watch, the same 24-hour recording (Sarhaddi 2022). Night is easy, day is hard.')}
          </div>`
          + this._notes([
            ['oura', 'Ring 4: 1.1 bpm, 1.9% (138 nights); Gen 3: 1.0 bpm, 1.7% (470 nights), Dial 2025. Gen 2: 1.8 bpm in one night (Miller 2022).'],
            ['polar', 'Grit X Pro: 2.71% (Dial 2025, first 4 hours of sleep only). Vantage V2: night bias -0.7 bpm (Nuuttila 2021, partly Polar-funded).'],
            ['whoop', '4.0: 1.8 bpm, 3.0% (288 nights, Dial 2025); 1.3 bpm asleep and 1.7 bpm awake over 5 days (Zia Ur Rehman 2024). 3.0: 0.7 bpm in a lab that receives WHOOP funding (Miller 2022).'],
            ['fitbit', 'Charge 2 overnight: 0.09 bpm against a 3-lead ECG (Haghayegh 2019) and 0.9 bpm in a home sleep study (Stucky 2021).'],
            ['samsung', 'Gear Sport: 1.1 bpm asleep but 11.1 bpm awake in the same recording (Sarhaddi 2022).'],
            ['apple-watch', 'Series 6: 1.5 bpm in one night (Miller 2022).'],
            ['garmin', 'Forerunner 245: 5.4 bpm in one night (Miller 2022). The Fenix 6 was left out of Dial 2025 because Garmin does not say which 30 minutes it uses.']
          ]),
        tip: 'Resting heart rate is the most trustworthy wearable number: Oura (1.94%), Polar (2.71%) and WHOOP (3.00%) all stayed close to an ECG overnight in the largest test. If you use a Fitbit, know that its resting figure includes relaxed awake time, so it runs a few bpm high.',
        insight: 'Resting heart rate is where wearables are most trustworthy. Oura Ring 4 was validated on 138 nights and Gen 3 on 470. Fitbit and Samsung were not in those two studies, but older models were within about 1 bpm asleep in smaller ones (Fitbit Charge 2, Samsung Gear Sport). Oura Ring 5 has no validation of any kind.'
      },
      activeHr: {
        chart: only => this._activeHrChart(only),
        table: {
          cols: [{ key: 'e', label: 'Error vs chest strap', short: 'Error', bar: { min: 0, max: 18 } }, { key: 't', label: 'Tier', short: 'Tier' }],
          rows: [
            { dev: 'fitbit', model: 'Charge 6', grade: 'good', cells: { e: P('5.5%', 'good', null, 5.5), t: P('Tier 1', 'good') } },
            { dev: 'garmin', model: 'Vivoactive 5', grade: 'good', cells: { e: P('6.3%', 'good', null, 6.3), t: P('Tier 1', 'good') } },
            { dev: 'apple-watch', model: 'Watch SE', grade: 'good', cells: { e: P('7.3%', 'mid', null, 7.3), t: P('Tier 2', 'mid') } },
            { dev: 'oura', model: 'Gen 3, daytime', grade: 'weak', cells: { e: P('15.0%', 'dark', null, 15), t: P('Tier 4', 'dark') } },
            { dev: 'fitbit', model: 'Inspire 3', grade: 'mixed', cells: { e: P('16.5%', 'dark', null, 16.5), t: P('Tier 4', 'dark') } },
            { dev: 'whoop', model: '4.0', grade: 'none', cells: { e: P('8.5%', 'mid', 'vs 12-lead ECG'), t: P('Not in this test', 'line') } },
            { dev: 'samsung', model: 'Galaxy Watch 4', grade: 'none', cells: { e: P('Under 2%', 'mid', 'heart patients, stress test'), t: P('Not in this test', 'line') } }
          ],
          legend: 'Mean absolute percentage error, lower is better. Top five from one ten-device test (Gielen 2026): read as tiers, not a ranking. WHOOP (Van Oost 2025) and Samsung (Kim 2023) come from different tests.'
        },
        more: () => `<div class="stat-pair">
            ${this._stat('-0.27 bpm', '<strong>Apple Watch, 22 studies.</strong> Pooled bias near zero; Series 6 onward stay within -3.7 to +2.6 bpm (Lambe 2026).')}
            ${this._stat('-3.39 bpm', '<strong>Fitbit, 32 studies.</strong> Reads low on average, with wide limits of -24.3 to +17.5 bpm (Chevance 2022).')}
          </div>`
          + this._notes([
            ['fitbit', 'Charge 6: 5.5%, Tier 1. The Inspire 3 in the same test: 16.5%, Tier 4 (Gielen 2026). Model matters more than brand.'],
            ['garmin', 'Vivoactive 5: 6.3%, Tier 1. Vivosmart 5: 8.1%, Tier 2 (Gielen 2026).'],
            ['apple-watch', 'Watch SE: 7.3%, Tier 2 (Gielen 2026). Apple Watch 7: ICC 0.998 in a hospital stress test (Kim 2023).'],
            ['polar', 'Ignite 3: 11.2%; Pacer: 13.1% (Gielen 2026).'],
            ['whoop', '4.0: 8.5% on a treadmill against a 12-lead ECG, with 13% of readings missing (Van Oost 2025).'],
            ['samsung', 'Galaxy Watch 4: under 2% in heart patients on a hospital treadmill, falling to ICC 0.867 above 160 bpm (Kim 2023).']
          ]),
        tip: 'Apple, Garmin and Fitbit are all within a few bpm on steady cardio; the brand matters less than the sport. Steady running reads well, racquet and field sports read worst. Two free fixes: wear the watch three finger-widths above the wrist bone and tighten the strap.',
        insight: 'The failure mode is irregular arm movement, not intensity: steady running is easy, racquet and field sports are worst. The WHOOP 99.7% and Oura 99% accuracy claims come from sleep data. Two free fixes: wear the watch three finger-widths above the wrist bone and tighten the strap.',
        link: { url: 'https://www.kygo.app/tools/heart-rate-accuracy', label: 'Full heart rate breakdown: 10 devices vs ECG', slug: 'heart-rate-accuracy' }
      },
      spo2: {
        chart: only => this._spo2Chart(only),
        table: {
          cols: [{ key: 'e', label: 'Error vs reference', short: 'Error' }, { key: 't', label: 'Test', short: 'Test' }],
          rows: [
            { dev: 'apple-watch', model: 'Series 8', grade: 'good', cells: { e: P('2.2%', 'good', 'Walzel 2023'), t: P('Low-oxygen lab test', 'mid') } },
            { dev: 'samsung', model: 'Galaxy Watch 5', grade: 'mixed', cells: { e: P('3.8%', 'mid', 'reads low'), t: P('Low-oxygen lab test', 'mid') } },
            { dev: 'garmin', model: 'Venu 2s', grade: 'none', cells: { e: P('5.8%', 'dark', 'reads low'), t: P('Clinic patients, at rest', 'mid') } },
            { dev: 'fitbit', model: 'Charge 4', grade: 'none', cells: { e: P('About +2 pts', 'dark', 'ICC 0.32'), t: P('COPD, overnight', 'mid') } },
            { dev: 'oura', grade: 'vendor', cells: { e: P('No figure', 'line', 'own claim only') } },
            { dev: 'whoop', grade: 'none', cells: {} }
          ],
          legend: 'Arms or mean absolute error in oxygen points, lower is better. Each row names its test; rows from different tests are not directly comparable.'
        },
        more: () => `<div class="stat-pair">
            ${this._stat('85%', '<strong>of Apple Watch Series 7 readings were too high</strong> when true oxygen was below 88%, in a test against arterial blood (Jiang 2026, 9 people).')}
            ${this._stat('Up to 92%', '<strong>of readings failed</strong> with moderate movement at simulated altitude, across devices including Apple and Garmin (Hearn 2023).')}
          </div>`
          + this._notes([
            ['apple-watch', 'Series 8 in the lab test: 2.2% at all levels, 2.5% at 80% oxygen or below (Walzel 2023). Series 7: 2.2% in clinic patients at rest with 11% of readings failing (Jiang 2023), and 4.6% against arterial blood (Jiang 2026).'],
            ['samsung', 'Galaxy Watch 5 in the lab test: 3.8% at all levels, 2.7% at 80% or below, reading low (Walzel 2023). Galaxy Watch 4: 1.8% against arterial blood in a Samsung-funded study (Browne 2025).'],
            ['garmin', 'Venu 2s: 5.8% at rest with 14% of readings failing; Fenix 6 Pro: 28% of readings failed (Jiang 2023). Venu 3 / Venu 4: 2.96% overnight in 29 ward patients, a preprint (Knevels 2026).'],
            ['fitbit', 'Charge 4 read about 2 points high overnight in COPD patients, ICC 0.32 (Hermans 2024).'],
            ['oura', 'Oura reports "30% more accurate" than Gen 3 from its own 60-person test; no absolute error published.'],
            ['whoop', 'No published SpO2 accuracy study found.'],
            ['polar', 'No SpO2 readings produced.'],
            ['apple-watch', 'US watches have computed blood oxygen on the paired iPhone since August 2025. That pipeline has no independent validation.']
          ]),
        tip: 'A normal reading is not reassurance if you feel unwell, because no watch has proven reliable when oxygen is truly low. No SpO2 feature on these brands is FDA-cleared.',
        insight: 'At normal levels the best watches land within about 2 points. When oxygen is truly low, the range that matters, an Apple Watch over-read most readings in one test, so a normal number is not reassurance. No SpO2 feature on any of these brands is FDA-cleared.'
      },
      steps: {
        chart: only => this._stepsChart(only),
        table: {
          cols: [{ key: 'lab', label: 'In the lab', short: 'Lab' }, { key: 'life', label: 'In daily life', short: 'Daily life' }],
          rows: [
            { dev: 'apple-watch', model: 'Series 5 / 6', grade: 'strong', cells: { lab: P('9.3%', 'mid', 'slow walking'), life: P('2 to 6%', 'good', 'over 3 weeks') } },
            { dev: 'garmin', model: 'Vivoactive 4', grade: 'good', cells: { lab: P('4.6%', 'good') } },
            { dev: 'fitbit', model: 'Inspire 2 / Sense', grade: 'mixed', cells: { lab: P('3.6%', 'good', 'treadmill'), life: P('+18%', 'dark', 'overcounts') } },
            { dev: 'oura', model: 'Gen 2', grade: 'weak', cells: { life: P('50.3%', 'dark', 'overcounts') } },
            { dev: 'samsung', model: 'Galaxy Watch 4', grade: 'mixed', cells: { life: P('r 0.82', 'mid', 'no error figure') } },
            { dev: 'whoop', grade: 'none', cells: {} }
          ],
          legend: 'Error vs a hand count (lab) or research pedometer (daily life), lower is better. A plus sign means average overcount.'
        },
        more: () => this._notes([
            ['apple-watch', 'Daily life: Series 6 +2.1% over 3 weeks (Miwa 2026) and 6.4% typical miss over 24 hours (Hong 2024). Lab: Series 5 ±9.3% on slow and shuffle walks (Rowe 2025); Series 8 -16% at a very slow walk and -36% with a rolling walker in adults 51 to 80 (Özel 2026).'],
            ['garmin', 'Daily life: Vivofit (2014 model) 17.8% typical miss at home vs a pedometer (An 2017, per the Evenson & Spade 2020 review of 32 Garmin studies). Short walking and jogging bouts: Vivosmart HR+ within 10% over ground and 5% on a treadmill (Montes 2020). Lab: Vivoactive 4 ±4.6% (de Leon 2026); Vivosmart HR 0.6 to 1.3% at 3.2 to 4.8 km/h, undercounting at slow speeds (Svarre 2020); Fenix 6 -15% on a treadmill-and-chores protocol (Rider 2025).'],
            ['fitbit', 'Daily life: Sense +18% (Miwa 2026); Charge 2 and Alta 17 to 36% typical miss (Giurgiu 2023). Lab: Inspire 2 ±3.6% (Cheung 2025).'],
            ['oura', 'Gen 2: +2,124 steps a day, 50% typical daily miss (Kristiansson 2023, corrected); +1,416 a day against an ActiGraph (Niela-Vilén 2022). Gen 3: -6.2% in only 5 people (Miwa 2026). The 2025 Real Steps update has no published validation. No lab step data exists.'],
            ['samsung', 'Galaxy Watch 4: 10.5% typical miss over 24 hours of daily life, r 0.82, against a thigh-worn ActivPAL; Apple Watch 6 in the same study: 6.4%, r 0.99 (Hong 2024). No lab study.'],
            ['polar', 'Daily life: Vantage V / M 72% off (Henriksen 2022). Lab: A360 6.6 to 9.6% walking and jogging (Montes 2020).'],
            ['whoop', 'No published step study.']
          ]),
        tip: 'Garmin and Apple are the counts to trust day to day (3% and 7% over, pooled). Fitbit runs about 15% high in daily life. Oura overcounted by 2,000 to 3,800 steps a day before its 2025 update, so use its count as a trend.',
        insight: 'One podium: Garmin first, Apple second, Samsung third, set by the pooled free-living result across 59 studies (Garmin +3%, Apple +7%, Fitbit +15%) and the lab tests. On a normal treadmill walk Fitbit and Garmin land under 5%; Apple\'s recent lab tests used slow or assisted walking, where every wrist device struggles. Apple beat Samsung in the same 24-hour study (6.4% vs 10.5%). Both Gen 2 studies of Oura found it overcounting by 1,400 to 2,100 steps a day; its 2025 "Real Steps" algorithm has no published validation. No Fitbit newer than the Sense or Inspire 2, no Pixel Watch and no WHOOP has peer-reviewed step data.',
        link: { url: 'https://www.kygo.app/tools/step-count-accuracy', label: 'Full step count breakdown', slug: 'step-count-accuracy' }
      },
      calories: {
        chart: only => this._caloriesChart(only),
        table: {
          cols: [{ key: 'bike', label: 'Cycling', short: 'Cycling', bar: { min: 0, max: 120 } }, { key: 'lift', label: 'Weight training', short: 'Weights' }],
          rows: [
            { dev: 'fitbit', model: 'Sense 2 / Charge 5', grade: 'weak', cells: { bike: P('31.7%', 'mid', 'outliers removed', 31.7), lift: P('41.7%', 'mid') } },
            { dev: 'apple-watch', model: 'Series 8', grade: 'weak', cells: { bike: P('35.7%', 'mid', null, 35.7), lift: P('112%', 'dark') } },
            { dev: 'samsung', model: 'Galaxy Watch 5', grade: 'weak', cells: { bike: P('66.5%', 'dark', null, 66.5), lift: P('84.5%', 'dark') } },
            { dev: 'garmin', model: 'FR955 / Vivosmart 5', grade: 'weak', cells: { bike: P('77.6%', 'dark', null, 77.6), lift: P('115%', 'dark') } },
            { dev: 'oura', grade: 'none', cells: {} },
            { dev: 'whoop', grade: 'none', cells: {} }
          ],
          legend: 'Workout calorie error vs lab gas analysis, lower is better. Cycling: same 58 people wore all four watches (Kostrna 2026). Weight training: 70 men (Yun 2026). Apple, Samsung and Garmin read high; Fitbit averaged close to zero.'
        },
        more: () => this._notes([
            ['fitbit', 'In cycling, 7 implausible readings (about 13% of Fitbit trials) were removed; with them, Fitbit had the largest error of all four. Daily calories: the Alta HR was 9 to 13% off doubly labelled water, the gold standard (Shook 2022).'],
            ['garmin', 'Vivoactive 4 on a treadmill run: 19.1% (de Leon 2026). Forerunner 935: 15.3% (Uphill 2024). Garmin\'s direction is not consistent across studies.'],
            ['samsung', 'Galaxy Watch 6 and 7: 10 to 13% in a Samsung-funded study (Ferreira 2026).'],
            ['apple-watch', 'Apple Watch 5: 11.3% (Uphill 2024). A 2026 living review could not pool Apple calorie results: errors ranged from 9.7% to 152% (Lambe 2026).'],
            ['apple-watch', 'Apple\'s own white paper reports -2% to +5% across 11 workout types. Independent studies have not reproduced this.'],
            ['oura', 'Gen 2 in the lab: 21.1% (Kristiansson 2023). Oura changed its active-calorie algorithm in May 2025; nobody has tested the new one.'],
            ['whoop', 'No published calorie validation of any kind.']
          ]) + `<p class="mini-foot">Max treadmill test, a conference abstract with about 20 different people per watch, so not a ranking (Perez 2025): Galaxy Watch7 9.4%, Fitbit Charge 6 14%, Garmin Forerunner 265S 15%, Polar Vantage M3 21.10%, Apple Ultra 2 26%.</p>`,
        tip: 'Fitbit is the least bad, Samsung is the most accurate on steady running and walking, and no brand came within 9% on the max treadmill test. Weight-training errors run from 42% (Fitbit) to 115% (Garmin). Error grows with body fat. Treat the number as a trend, not a target.',
        insight: 'Calories are the least accurate number on any wearable, so the podium separates bad from worse: Fitbit wins three of five head-to-head comparisons (max treadmill 14%, cycling 32%, weights 42%, reads only 4% high on weights), Samsung is second (9% on a max treadmill and 0.5% walking, but 67% cycling and 85% weights), Apple third (26%, 36%, 112%). Garmin is 78% off cycling and 115% on weights. Error also grows with body fat. Treat the number as a trend, not a target.',
        link: { url: 'https://www.kygo.app/tools/calorie-burn-accuracy', label: 'Check your device in the calorie burn calculator', slug: 'calorie-burn-accuracy' }
      },
      vo2max: {
        chart: only => this._vo2Chart(only),
        table: {
          cols: [{ key: 'e', label: 'Error vs lab test', short: 'Error', bar: { min: 0, max: 20 } }, { key: 'n', label: 'Independent studies', short: 'Studies' }],
          rows: [
            { dev: 'garmin', model: 'Fenix 6, FR245', grade: 'good', cells: { e: P('About 7%', 'good', null, 7), n: P('3', 'good') } },
            { dev: 'fitbit', model: 'Charge 2', grade: 'mixed', cells: { e: P('Under 10%', 'mid', 'retired method', 10), n: P('2', 'mid') } },
            { dev: 'apple-watch', model: 'Series 7 to 10', grade: 'mixed', cells: { e: P('13 to 16%', 'dark', 'reads low', 14.5), n: P('3', 'good') } },
            { dev: 'oura', grade: 'vendor', cells: { e: P('Vendor claim', 'line') } },
            { dev: 'whoop', grade: 'vendor', cells: { e: P('Vendor claim', 'line') } },
            { dev: 'samsung', grade: 'vendor', cells: { e: P('Vendor claim', 'line', 'company-funded') } }
          ],
          legend: 'Mean absolute percentage error vs a lab metabolic cart, lower is better.'
        },
        more: () => this._notes([
            ['apple-watch', 'Reads low in every study: Series 10 −6.3 (13.2% typical error, Lambe 2026), Series 9 and Ultra 2 −6.1 (13.3%, Lambe 2025), Series 7 −4.5 (15.8%, Caserman 2024).'],
            ['garmin', 'Forerunner 245: 6.7% overall in 35 endurance runners, 2.8 to 4.1% in moderately trained but 9.4 to 10.4% in highly trained (Engel 2026). Fenix 6: 7.1% (Carrier 2025); 6.9% with a chest strap in elite athletes (Carrier 2023). No newer Garmin has been studied.'],
            ['fitbit', 'Pixel Watch 3: 8.7%, reading 0.5 low (Lambe 2026, Google-funded, 26 adults), on the outdoor-run method Google now ships. Charge 2: 9.1%, reading 0.3 high (Klepin 2019, 60 people); +2.6 high (Freeberg 2019). Both Charge 2 studies tested an algorithm Google retired in May 2026.'],
            ['polar', 'Vantage M2 resting Fitness Test: 13.7% typical error in 24 adults, mostly patients in medically supervised exercise training (Neudorfer 2025).'],
            ['whoop', 'Company figures only: about 8% typical error, off by 3.3 to 3.7 mL/kg/min on average (r 0.90) in WHOOP\'s own test of 248 people against a lab gas analyser. No independent check. VO2 max is on WHOOP 5.0 and MG only.'],
            ['oura', 'No independent study and no published accuracy figure. Oura states its 6-minute walk test estimate is less accurate than a lab test and weaker for athletes and at altitude.'],
            ['samsung', 'Company-funded testing only: r 0.82 against lab equipment (Samsung-funded University of Michigan testing). The only independent Galaxy Watch study checked heart rate during a max test, not VO2 max.']
          ]) + `<p class="mini-foot">Fitbit now derives VO2 max from outdoor GPS runs, a method with no published validation.</p>`,
        tip: 'Garmin with a chest strap is the estimate to trust (about 7% off); wrist-only Garmin in older adults was 56% off. Estimates from a real outdoor run beat ones from resting heart rate. Apple reads low, most in fit women. Use it as a trend.',
        insight: 'Method beats brand: estimates from a real outdoor run show about zero group bias, estimates from resting heart rate overestimate by about 2 mL/kg/min (INTERLIVE 2022). Accuracy degrades in highly trained users, and the one elite study that avoided this used a chest strap. Use it as a trend, not a number.'
      },
      temp: {
        table: {
          noBuy: true, plain: true,
          cols: [{ key: 's', label: 'Sensor test', short: 'Sensor' }, { key: 'c', label: 'Cycle tracking study', short: 'Cycles' }],
          rows: [
            { dev: 'apple-watch', grade: 'none', cells: { c: P('89% within 2 days', 'mid', 'Apple-funded, prototype') } },
            { dev: 'oura', grade: 'vendor', cells: { s: P('r² above 0.92 worn', 'line', 'Own 2020 test'), c: P('96.4% detected', 'mid', 'Oura staff') } },
            { dev: 'garmin', grade: 'none', cells: {} },
            { dev: 'whoop', grade: 'none', cells: {} },
            { dev: 'fitbit', grade: 'none', cells: {} },
            { dev: 'samsung', grade: 'none', cells: { c: P('78% within 3 days', 'mid', 'Samsung-funded') } },
            { dev: 'polar', grade: 'none', cells: {} }
          ],
          legend: 'No independent study has tested any brand\'s temperature sensor. Cycle figures use different definitions and are not comparable across brands.'
        },
        tip: 'Use skin temperature for nightly change against your own baseline, not as a thermometer. For cycle tracking, the FDA-cleared part is the Natural Cycles app, not the ring or watch.',
        insight: 'There is no winner because there is no independent comparison. Oura\'s lab figures (r² above 0.99, within 0.36°C) come from rings tested on their own in water baths. Apple reports nightly change from baseline and states it is not a thermometer. For cycle tracking, the FDA-cleared part is the Natural Cycles app, not the ring or watch.'
      },
      resp: {
        chart: only => this._respChart(only),
        table: {
          cols: [{ key: 'f', label: 'Reported error', short: 'Error' }, { key: 'w', label: 'Who ran the test', short: 'Tested by' }],
          rows: [
            { dev: 'fitbit', model: 'algorithm / Charge 4', grade: 'mixed', cells: { f: P('0.46 to 1 /min', 'mid'), w: P('Fitbit + independent', 'mid') } },
            { dev: 'oura', model: '2020 hardware', grade: 'vendor', cells: { f: P('0.71 /min', 'mid'), w: P('Oura blog', 'line') } },
            { dev: 'samsung', model: 'GW4/5 research algorithm', grade: 'vendor', cells: { f: P('1.13 /min', 'mid'), w: P('Samsung-funded', 'line') } },
            { dev: 'whoop', model: 'Strap 2.0', grade: 'vendor', cells: { f: P('1.8% bias', 'mid'), w: P('WHOOP-funded', 'line') } },
            { dev: 'garmin', model: 'Fenix 6 Pro', grade: 'weak', cells: { f: P('1.5 low, r 0.28', 'dark'), w: P('Independent', 'good') } },
            { dev: 'apple-watch', model: 'Series 7', grade: 'none', cells: { f: P('No readings', 'dark', 'in 2 hospital studies'), w: P('Independent', 'good') } }
          ],
          legend: 'Breaths per minute. Every study used a different reference and population, so this cannot be ranked.'
        },
        more: () => this._notes([
            ['fitbit', 'Charge 4: reads 0.3 high in COPD and 1 high in healthy adults, ICC 0.77 to 0.84, against an ECG-derived reference (Hermans 2024). Company test: 0.46 average error (Natarajan 2021).'],
            ['garmin', 'Fenix 6 Pro: correlation 0.28 with the hospital monitor, reading 1.5 low (Helmer 2024). Venu 3 / Venu 4: 4.2 off, 47% of readings within 3, acceptable only up to 22 breaths a minute (Knevels 2026, preprint).'],
            ['samsung', 'Research algorithm: 1.13 RMSE overall, 0.46 in milder sleep apnea but 2.17 in severe apnea (Jung 2023, Samsung-funded).'],
            ['apple-watch', 'No readings in two hospital studies (Helmer 2024, AbiMansour 2024). A 2026 living review lists respiratory rate as yet to be validated.'],
            ['whoop', 'Strap 2.0: 1.8% bias only (Berryhill 2020, WHOOP-funded). Nothing for WHOOP 4.0 or 5.0.']
          ]),
        tip: 'Overnight averages on a Fitbit or WHOOP are the best-supported use. Garmin\'s breathing rate failed its hospital test and Apple only measures during sleep. Treat single readings with caution.',
        insight: 'Fitbit first, WHOOP second, no third. Company-run tests in sleeping, mostly healthy adults report errors under 1 to 2 breaths a minute, and Fitbit\'s independent COPD-and-healthy test agrees (0.3 to 1 high). A Garmin barely followed real breathing in hospital patients and an Apple Watch gave no readings. Samsung\'s often-quoted figure came from a research algorithm the watch did not offer to users. Overnight averages are the best-supported use.'
      },
      fda: {
        custom: () => this._fdaTable(),
        more: () => `<div class="mini"><div class="mini-title">Cleared does not mean it catches everything</div>
          <p class="mini-foot" style="margin:0 0 10px">Share of real cases each alert flagged in the maker's own FDA study. Different features and studies, not a brand ranking.</p>
          ${[['Apple hypertension', 41.2, '92.3% specificity'], ['Apple sleep apnea', 66.3, '98.5% specificity'], ['Samsung irregular rhythm', 68, '98.8% specificity'], ['Pixel Watch loss of pulse', 69.3, '99.97% specificity'], ['Samsung sleep apnea v2.0, ring', 77.9, '95.9% specificity'], ['Samsung sleep apnea v2.0, watch', 90.8, '90.3% specificity']]
            .map(([n, p, s]) => `<div class="catch"><span class="catch-name">${n}<small>${s}</small></span><span class="catch-bar"><span style="--w:${p}%"></span></span><span class="catch-val">${p}%</span></div>`).join('')}
        </div>`,
        tip: 'An alert is worth acting on, but no alert is not an all-clear. Only Apple\'s hypertension alert is cleared for blood pressure, and it gives no numbers.',
        insight: 'ECG apps from all five cleared brands score 96% to 100% on recordings they could classify, because inconclusive ones are excluded (2.9% for Samsung up to 11.5% for Garmin), so do not rank brands on ECG. Nothing here is "FDA-approved"; these are clearances for specific features. Only Apple\'s hypertension alert is cleared for blood pressure, and it gives no numbers.'
      }
    };
  }

  _fdaTable(only) {
    const all = Object.keys(this._devices).filter(k => k in this._fdaCounts);
    const skip = (only || Object.keys(this._devices)).filter(k => !(k in this._fdaCounts));
    const cols = (only || all).filter(k => k in this._fdaCounts);
    const y = t => ({ k: 'y', t }), w = t => ({ k: 'w', t }), n = { k: 'n' };
    const rows = [
      // Cells in the old column order (Apple, Samsung, Fitbit, Garmin, WHOOP, Oura), remapped to the page brand order below.
      ['ECG / AFib check', [y('Series 4+'), y('Watch4+'), y('Sense, Charge 5/6'), y('Select watches'), y('MG only'), n]],
      ['Irregular rhythm alerts', [y(), y(), y('Most models'), n, n, n]],
      ['AFib History', [y(), n, n, n, n, n]],
      ['Sleep apnea alerts', [y('S9+, Ultra 2+, SE 3'), y('Watch and Ring'), n, n, n, n]],
      ['Hypertension alerts', [y('S9+, Ultra 2+'), n, n, n, n, n]],
      ['Blood pressure (wellness, not cleared)', [n, w(), w('Pixel'), n, w('MG'), w('Ring 5, no numbers')]]
    ].map(([f, c]) => { const old = ['apple-watch', 'samsung', 'fitbit', 'garmin', 'whoop', 'oura']; return [f, all.map(k => c[old.indexOf(k)])]; });
    const note = t => t ? `<span class="cell-note">${t}</span>` : '';
    const cell = c => c.k === 'y' ? `<span class="fda-yes">${this._icon('check')}</span>${note(c.t)}` : c.k === 'w' ? `${this._pill('Wellness', 'line')}${note(c.t)}` : this._na();
    const idx = cols.map(k => all.indexOf(k));
    const count = k => { const n = this._fdaCounts[k]; return `<span class="pill-n ${n ? 'fair' : 'zero'}">${n}</span>`; };
    const list = cols.map((k, ci) => {
      const items = rows.map(([f, c]) => [f, c[idx[ci]]]).filter(([, c]) => c.k !== 'n');
      return `<div class="fdam-card">
        <div class="fdam-head">${this._logo(k, 'sm')}<span class="fdam-name">${this._devices[k].short}</span><span class="fdam-count">${count(k)}<em>cleared</em></span></div>
        ${items.length ? `<ul class="fdam-list">${items.map(([f, c]) => `<li class="${c.k}"><span class="fdam-ico">${c.k === 'y' ? this._icon('check') : this._icon('minus')}</span><span>${c.k === 'w' && !/wellness/i.test(f) ? f + ', wellness only' : f}${c.t ? ` <small>${c.t}</small>` : ''}</span></li>`).join('')}</ul>` : '<p class="fdam-none">No FDA-cleared features</p>'}
      </div>`;
    }).join('');
    return `
      <div class="cmp">
        <div class="cmp-scroll fda-desk"><table class="cmp-table fda-table">
          <thead><tr><th class="cmp-th-device" scope="col">Feature</th>${cols.map(k => `<th scope="col"><span class="cr-dev">${this._logo(k, 'sm')}<span class="cr-dev-name">${this._devices[k].short}</span></span></th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map(([f, c]) => `<tr><th class="cmp-td-device" scope="row"><span class="brand-name">${f}</span></th>${idx.map(j => `<td><span class="cell">${cell(c[j])}</span></td>`).join('')}</tr>`).join('')}
            <tr class="fda-total"><th class="cmp-td-device" scope="row"><span class="brand-name">Cleared features</span></th>${cols.map(k => `<td>${count(k)}</td>`).join('')}</tr>
          </tbody>
        </table></div>
        <div class="fda-m">${list}</div>
        <p class="cmp-legend">${this._icon('info')}<span>From the FDA record (510(k) and De Novo decisions). Fitbit column counts Fitbit-branded devices; Google's Pixel Watch also has a cleared Loss of Pulse feature (3 in total). No wearable's blood oxygen feature is cleared.${skip.length ? ` Not checked: ${skip.map(k => this._devices[k].short).join(', ')}.` : ''}</span></p>
      </div>`;
  }


  _relatedTools() {
    return [
      {
        title: 'Wearable Accuracy: What Actually Affects It',
        blurb: 'Tattoos, hairy arms, cold hands, strap tightness, which wrist. What the studies found and the free fixes that work tonight.',
        url: 'https://www.kygo.app/tools/accuracy-factors',
        meta: 'Wearables · 26 answers',
        motif: { motif: 'tiers', caption: 'What moves accuracy', tiers: [{ label: 'Minor', h: 0.35 }, { label: 'Moderate', h: 0.62 }, { label: 'Major', h: 1 }] }
      },
      {
        title: 'Hardware & Software Differences',
        blurb: 'What actually makes Garmin, Whoop, Oura, Apple Watch and Fitbit different, sensor by sensor.',
        url: 'https://www.kygo.app/tools/sensor-comparison',
        meta: 'Wearables · 6 devices',
        motif: { motif: 'radar', caption: 'Sensor & software focus', radar: [0.92, 0.6, 0.78, 0.5, 0.85] }
      },
      {
        title: 'Most Accurate Heart Rate Wearable',
        blurb: '10 wearables ranked against an ECG or chest strap, and why arm motion is what breaks them.',
        url: 'https://www.kygo.app/tools/heart-rate-accuracy',
        meta: 'Wearables · 10 devices',
        motif: { motif: 'compare', caption: 'Error vs chest strap', rows: [{ label: 'Fitbit', pct: 92 }, { label: 'Apple', pct: 86 }, { label: 'Oura', pct: 62 }, { label: 'Xiaomi', pct: 44 }] }
      }
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
    if (m === 'pulse') {
      return `<svg viewBox="0 0 200 74" width="100%" style="display:block;"><path d="M0 48 L34 48 L44 48 L52 18 L60 60 L70 30 L80 48 L118 48 L128 48 L136 14 L144 58 L154 34 L164 48 L200 48" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="136" cy="14" r="4" fill="#22C55E"/>${c.bpm ? `<text x="200" y="68" text-anchor="end" font-family="Space Grotesk" font-weight="700" font-size="13" fill="#1E293B">${c.bpm}</text>` : ''}</svg>`;
    }
    if (m === 'gauge') {
      const pct = c.gaugePct != null ? c.gaugePct : 70;
      const off = (125.7 * (1 - pct / 100)).toFixed(1);
      return `<div style="display:flex;align-items:center;justify-content:center;padding:2px 0;"><svg viewBox="0 0 96 64" width="118" height="78"><path d="M8 56 A40 40 0 0 1 88 56" fill="none" stroke="#E2E8F0" stroke-width="10" stroke-linecap="round"/><path d="M8 56 A40 40 0 0 1 88 56" fill="none" stroke="#22C55E" stroke-width="10" stroke-linecap="round" stroke-dasharray="125.7" stroke-dashoffset="${off}"/><text x="48" y="50" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="22" fill="#1E293B">${c.gaugeValue || ''}</text><text x="48" y="62" text-anchor="middle" font-family="Space Grotesk" font-weight="600" font-size="7" letter-spacing="0.5" fill="#94A3B8">${c.gaugeUnit || ''}</text></svg></div>`;
    }
    if (m === 'decay') {
      return `<svg viewBox="0 0 200 88" width="100%" style="display:block;"><defs><linearGradient id="mtDecay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(34,197,94,0.22)"/><stop offset="1" stop-color="rgba(34,197,94,0)"/></linearGradient></defs><path d="M0 10 C40 10 46 58 96 66 L200 74 L200 88 L0 88 Z" fill="url(#mtDecay)"/><path d="M0 10 C40 10 46 58 96 66 L200 74" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round"/><circle cx="96" cy="66" r="4" fill="#22C55E"/></svg>`;
    }
    if (m === 'hypno') {
      const rem = c.stage === 'rem', deep = c.stage === 'deep';
      return `<svg viewBox="0 0 200 80" width="100%" style="display:block;"><g font-family="Space Grotesk" font-weight="600" font-size="7" fill="#94A3B8"><text x="0" y="11">Awake</text><text x="0" y="33">REM</text><text x="0" y="55">Light</text><text x="0" y="77">Deep</text></g><path d="M36 8 L54 8 L54 52 L80 52 L80 74 L106 74 L106 30 L128 30 L128 52 L152 52 L152 30 L176 30 L176 52 L200 52" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${rem ? '<rect x="106" y="24" width="22" height="12" rx="3" fill="rgba(34,197,94,0.16)"/>' : ''}${deep ? '<rect x="80" y="68" width="26" height="12" rx="3" fill="rgba(34,197,94,0.16)"/>' : ''}</svg>`;
    }
    if (m === 'donut') {
      return `<div style="display:flex;align-items:center;justify-content:center;gap:14px;padding:2px 0;"><svg viewBox="0 0 84 84" width="78" height="78"><circle cx="42" cy="42" r="34" fill="none" stroke="#16A34A" stroke-width="12" stroke-dasharray="96 213.6" stroke-dashoffset="0" transform="rotate(-90 42 42)"/><circle cx="42" cy="42" r="34" fill="none" stroke="#22C55E" stroke-width="12" stroke-dasharray="64 213.6" stroke-dashoffset="-96" transform="rotate(-90 42 42)"/><circle cx="42" cy="42" r="34" fill="none" stroke="#86EFAC" stroke-width="12" stroke-dasharray="53 213.6" stroke-dashoffset="-160" transform="rotate(-90 42 42)"/><text x="42" y="40" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="17" fill="#1E293B">540</text><text x="42" y="53" text-anchor="middle" font-family="Space Grotesk" font-weight="600" font-size="7" letter-spacing="0.5" fill="#94A3B8">KCAL</text></svg><div style="display:flex;flex-direction:column;gap:5px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:9px;color:#475569;"><span style="display:inline-flex;align-items:center;gap:5px;"><span style="width:8px;height:8px;border-radius:2px;background:#16A34A;"></span>Protein</span><span style="display:inline-flex;align-items:center;gap:5px;"><span style="width:8px;height:8px;border-radius:2px;background:#22C55E;"></span>Carbs</span><span style="display:inline-flex;align-items:center;gap:5px;"><span style="width:8px;height:8px;border-radius:2px;background:#86EFAC;"></span>Fat</span></div></div>`;
    }
    if (m === 'range') {
      return `<svg viewBox="0 0 200 74" width="100%" style="display:block;"><defs><linearGradient id="mtRange" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#22C55E"/><stop offset="1" stop-color="#16A34A"/></linearGradient></defs><line x1="6" y1="50" x2="194" y2="50" stroke="#E2E8F0" stroke-width="2"/><g stroke="#CBD5E1" stroke-width="2"><line x1="6" y1="46" x2="6" y2="54"/><line x1="100" y1="46" x2="100" y2="54"/><line x1="194" y1="46" x2="194" y2="54"/></g><rect x="78" y="22" width="76" height="16" rx="8" fill="rgba(34,197,94,0.18)"/><rect x="78" y="44" width="76" height="12" rx="6" fill="url(#mtRange)"/><circle cx="116" cy="50" r="7" fill="#16A34A" stroke="#fff" stroke-width="2.5"/><text x="116" y="16" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="12" fill="#1E293B">${c.rangeLabel || ''}</text></svg>`;
    }
    if (m === 'steps') {
      return `<svg viewBox="0 0 200 88" width="100%" style="display:block;"><defs><linearGradient id="mtSteps" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22C55E"/><stop offset="1" stop-color="#16A34A"/></linearGradient></defs><g><rect x="2" y="50" width="20" height="34" rx="4" fill="#CBD5E1"/><rect x="30" y="40" width="20" height="44" rx="4" fill="#86EFAC"/><rect x="58" y="58" width="20" height="26" rx="4" fill="#CBD5E1"/><rect x="86" y="20" width="20" height="64" rx="4" fill="url(#mtSteps)"/><rect x="114" y="44" width="20" height="40" rx="4" fill="#86EFAC"/><rect x="142" y="34" width="20" height="50" rx="4" fill="#22C55E" opacity="0.8"/><rect x="170" y="54" width="20" height="30" rx="4" fill="#CBD5E1"/></g></svg>`;
    }
    if (m === 'radar') {
      const vals = Array.isArray(c.radar) && c.radar.length === 5 ? c.radar : [0.92, 0.6, 0.78, 0.5, 0.85];
      const cx = 100, cy = 52, R = 38;
      const ang = k => (-90 + 72 * k) * Math.PI / 180;
      const pt = (k, r) => [cx + r * Math.cos(ang(k)), cy + r * Math.sin(ang(k))];
      const ring = r => 'M ' + [0, 1, 2, 3, 4].map(k => { const [x, y] = pt(k, r); return x.toFixed(1) + ' ' + y.toFixed(1); }).join(' L ') + ' Z';
      const dataPts = [0, 1, 2, 3, 4].map(k => pt(k, R * Math.max(0.08, Math.min(1, vals[k]))));
      const dataPath = 'M ' + dataPts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L ') + ' Z';
      const spokes = [0, 1, 2, 3, 4].map(k => { const [x, y] = pt(k, R); return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#E2E8F0" stroke-width="1"/>`; }).join('');
      const dots = dataPts.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2" fill="#22C55E"/>`).join('');
      return `<svg viewBox="0 0 200 104" width="100%" style="display:block;"><path d="${ring(R)}" fill="none" stroke="#E2E8F0" stroke-width="1"/><path d="${ring(R * 0.5)}" fill="none" stroke="#EEF1F4" stroke-width="1"/>${spokes}<path d="${dataPath}" fill="rgba(34,197,94,0.18)" stroke="#16A34A" stroke-width="2" stroke-linejoin="round"/>${dots}</svg>`;
    }
    if (m === 'diverging') {
      const fills = ['#16A34A', '#22C55E', '#4ADE80', '#86EFAC'];
      const rows = Array.isArray(c.bars) ? c.bars : [];
      const cx = 124, maxLen = 70;
      const dmax = Math.max(20, ...rows.map(r => Math.abs(r.val || 0)));
      const body = rows.map((r, i) => {
        const fill = (i === rows.length - 1 && rows.length > 1) ? '#CBD5E1' : (fills[i] || '#86EFAC');
        const v = r.val || 0;
        const len = Math.max(5, Math.abs(v) / dmax * maxLen);
        const x = v >= 0 ? cx : cx - len;
        const y = 6 + i * 20;
        return `<text x="0" y="${y + 11}" font-family="Space Grotesk" font-weight="600" font-size="9" fill="#475569">${r.label}</text><rect x="${x.toFixed(1)}" y="${y}" width="${len.toFixed(1)}" height="11" rx="3" fill="${fill}"/>`;
      }).join('');
      const h = 6 + rows.length * 20;
      return `<svg viewBox="0 0 200 ${h}" width="100%" style="display:block;"><line x1="${cx}" y1="2" x2="${cx}" y2="${h - 2}" stroke="#E2E8F0" stroke-width="2"/>${body}</svg>`;
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
    if (m === 'versus') {
      const a = c.versusA || 'A', b = c.versusB || 'B';
      const rows = Array.isArray(c.versus) ? c.versus : [];
      const cx = 100, maxLen = 84;
      const body = rows.map((r, i) => {
        const y = 24 + i * 22;
        const la = Math.max(0, Math.min(100, r.a)) / 100 * maxLen;
        const lb = Math.max(0, Math.min(100, r.b)) / 100 * maxLen;
        return `<rect x="${(cx - la).toFixed(1)}" y="${y}" width="${la.toFixed(1)}" height="10" rx="5" fill="#16A34A"/><rect x="${cx}" y="${y}" width="${lb.toFixed(1)}" height="10" rx="5" fill="#86EFAC"/>`;
      }).join('');
      const h = 24 + rows.length * 22;
      return `<svg viewBox="0 0 200 ${h}" width="100%" style="display:block;"><text x="2" y="12" font-family="Space Grotesk" font-weight="600" font-size="10" fill="#16A34A">${a}</text><text x="198" y="12" text-anchor="end" font-family="Space Grotesk" font-weight="600" font-size="10" fill="#94A3B8">${b}</text><line x1="${cx}" y1="18" x2="${cx}" y2="${h - 2}" stroke="#E2E8F0" stroke-width="2"/>${body}</svg>`;
    }
    if (m === 'tiers') {
      const t = Array.isArray(c.tiers) ? c.tiers : [];
      const n = t.length || 3;
      const gap = 16, colW = (200 - gap * (n + 1)) / n, base = 84;
      const fills = ['#86EFAC', '#22C55E', '#16A34A'];
      let x = gap;
      const bars = t.map((tt, i) => {
        const hh = Math.max(0.1, Math.min(1, tt.h)) * (base - 14);
        const y = base - hh;
        const fill = i === n - 1 ? 'url(#mtTier)' : (fills[i] || '#86EFAC');
        const out = `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${colW.toFixed(1)}" height="${hh.toFixed(1)}" rx="6" fill="${fill}"/><text x="${(x + colW / 2).toFixed(1)}" y="96" text-anchor="middle" font-family="Space Grotesk" font-weight="600" font-size="8" fill="#94A3B8">${tt.label}</text>`;
        x += colW + gap;
        return out;
      }).join('');
      return `<svg viewBox="0 0 200 100" width="100%" style="display:block;"><defs><linearGradient id="mtTier" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22C55E"/><stop offset="1" stop-color="#16A34A"/></linearGradient></defs><line x1="0" y1="84" x2="200" y2="84" stroke="#E2E8F0" stroke-width="1.5"/>${bars}</svg>`;
    }
    if (m === 'dots') {
      const rows = Array.isArray(c.dots) ? c.dots : [];
      const fills = ['#16A34A', '#22C55E', '#4ADE80', '#86EFAC'];
      const TOT = 10;
      const body = rows.map((r, i) => {
        const fill = fills[i] || '#86EFAC';
        const n = Math.max(0, Math.min(TOT, r.n || 0));
        let dots = '';
        for (let k = 0; k < TOT; k++) dots += `<span style="width:7px;height:7px;border-radius:50%;background:${k < n ? fill : '#E2E8F0'};display:block;"></span>`;
        return `<div style="display:flex;align-items:center;gap:8px;"><span style="width:42px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:9px;color:#475569;">${r.label}</span><span style="display:flex;gap:4px;">${dots}</span></div>`;
      }).join('');
      return `<div style="display:flex;flex-direction:column;gap:7px;padding:2px 0;">${body}</div>`;
    }
    return `<svg viewBox="0 0 200 96" width="100%" style="display:block;"><defs><linearGradient id="mtRank" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#22C55E"/><stop offset="1" stop-color="#16A34A"/></linearGradient></defs><rect x="0" y="4" width="186" height="11" rx="5.5" fill="url(#mtRank)"/><rect x="0" y="25" width="150" height="11" rx="5.5" fill="url(#mtRank)" opacity="0.85"/><rect x="0" y="46" width="116" height="11" rx="5.5" fill="url(#mtRank)" opacity="0.7"/><rect x="0" y="67" width="82" height="11" rx="5.5" fill="url(#mtRank)" opacity="0.55"/><rect x="0" y="88" width="54" height="6" rx="3" fill="#CBD5E1"/></svg>`;
  }

  // Renderer + styles are self-contained under `rt-*` names, and every custom
  // property carries a literal fallback, so the same block drops into either
  // palette unchanged. Pass 'gray' to sit the section on the tinted band.

  // The three posts this page links to. The only per-page part of the module.
  // Card copy is defined once per post and reused wherever that post is linked,
  // so it cannot drift between tools. Titles, excerpts and cover images come
  // from the Wix Blog collection - see docs/blog-cross-links.md.
  _relatedPosts() {
    return [
      { slug: 'what-s-the-most-accurate-wearable-data-a-2024-2025-study-breakdown-by-device',
        title: 'What’s the Most Accurate Wearable? 45+ Studies, 6 Devices, Ranked (2026)',
        blurb: 'Independent peer-reviewed studies reveal which wearables deliver the most accurate sleep, HRV, heart rate, and step data. We break down the actual numbers so you know what to trust.',
        cat: 'Wearables & Data', min: 10, img: '273a63_f6d12b66837342a6a552e4e3d9297fef~mv2.png' },
      { slug: 'how-accurate-is-your-heart-rate-monitor',
        title: 'How Accurate Is Your Heart Rate Monitor? 10 Devices Ranked',
        blurb: 'Ten wearables, the same 45 wrists, the same day, and error running from 5.5% to 16.5%. Which device you own matters less than you think.',
        cat: 'Wearables & Data', min: 12, img: '273a63_0160a65e547b4b539b2b8be66e2749cf~mv2.png' },
      { slug: 'most-accurate-sleep-tracker-oura-vs-apple-vs-fitbit-2026',
        title: 'Most Accurate Sleep Tracker? Oura vs Apple vs Fitbit vs Garmin vs Whoop (2026)',
        blurb: 'Every tracker calls itself accurate. Measured against lab polysomnography, the ranking changes completely on one thing most reviews ignore.',
        cat: 'Sleep', min: 8, img: '273a63_4c319b0df429425296d15711c577310b~mv2.png' }
    ];
  }

  // -- Related reading (the standard module) -------------------------------
  // One design, every tool page: three blog cards in a grid (1 col mobile ->
  // 3 col >=720px) with the post's real cover image, category, title, a
  // two-line blurb and read time - the same card the main blog page uses.
  // Self-contained under `rp-*` names with a literal fallback behind every
  // custom property, so the identical block renders the same on either
  // palette. Copy this method verbatim; only `_relatedPosts()` is per page.
  // Placement: its own section, directly above the related-tools section.
  // A tool content section always separates it from the app CTA and from the
  // email capture - it never sits directly above or below either one.
  // Pass 'gray' to sit the section on the tinted band.
  _renderRelatedPosts(bg) {
    const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
    const cards = this._relatedPosts().map(p => `
      <a class="rp-card animate-on-scroll" href="https://www.kygo.app/post/${p.slug}" aria-label="${p.title}" data-action="blog-post" data-post-slug="${p.slug}" data-track-position="related-posts" data-track-label="${p.slug}">
        <span class="rp-media"><img src="https://static.wixstatic.com/media/${p.img}" alt="${p.title}" loading="lazy" decoding="async" onerror="this.closest('.rp-media').classList.add('rp-noimg')"></span>
        <span class="rp-body">
          <span class="rp-cat">${p.cat}</span>
          <span class="rp-title">${p.title}</span>
          <span class="rp-blurb">${p.blurb}</span>
          <span class="rp-foot"><span class="rp-meta">${p.min} min read</span><span class="rp-open">Read ${arrow}</span></span>
        </span>
      </a>`).join('');
    return `
      <style>
      .rp-section{padding:56px 20px;background:#fff}
      .rp-section.rp-gray{background:var(--kygo-light,var(--light,#F8FAFC))}
      @media(min-width:720px){.rp-section{padding:80px 24px}}
      .rp-inner{max-width:1200px;margin:0 auto}
      .rp-head{margin-bottom:28px;max-width:720px}
      .rp-kicker{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-display,'Space Grotesk',sans-serif);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--kygo-green-dark,#16A34A);background:var(--kygo-green-light,rgba(34,197,94,.12));padding:6px 12px;border-radius:999px}
      .rp-h2{font-family:var(--font-display,'Space Grotesk',sans-serif);font-weight:600;font-size:clamp(26px,4vw,42px);line-height:1.1;margin:16px 0 10px;letter-spacing:-.01em;color:var(--fg-1,var(--dark,#0F172A))}
      .rp-h2 .rp-hl{color:var(--kygo-green,var(--green,#22C55E))}
      .rp-lede{font-family:var(--font-body,'DM Sans',sans-serif);color:var(--fg-2,var(--gray-600,#475569));font-size:16px;line-height:1.55;max-width:62ch;margin:0}
      .rp-grid{display:grid;grid-template-columns:1fr;gap:18px}
      @media(min-width:720px){.rp-grid{grid-template-columns:repeat(3,1fr);gap:22px}}
      .rp-card{position:relative;display:flex;flex-direction:column;background:var(--bg-canvas,#fff);border:1px solid var(--border-subtle,var(--gray-200,#E2E8F0));border-radius:18px;overflow:hidden;text-decoration:none;color:inherit;box-shadow:0 2px 12px rgba(15,23,42,.05);transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s ease,border-color .25s ease}
      .rp-card::after{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,var(--kygo-green,var(--green,#22C55E)),var(--kygo-green-dark,var(--green-dark,#16A34A)));opacity:0;transition:opacity .25s ease;pointer-events:none}
      .rp-card:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(15,23,42,.10);border-color:#CBD5E1}
      .rp-card:hover::after{opacity:1}
      .rp-card:focus-visible{outline:2px solid var(--kygo-green,var(--green,#22C55E));outline-offset:3px}
      .rp-media{position:relative;aspect-ratio:16/10;overflow:hidden;background:var(--bg-raised,var(--gray-100,#F1F5F9))}
      .rp-media img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .35s cubic-bezier(.16,1,.3,1)}
      .rp-card:hover .rp-media img{transform:scale(1.03)}
      .rp-media.rp-noimg img{display:none}
      .rp-body{flex:1;padding:16px 18px 18px;display:flex;flex-direction:column;gap:7px}
      .rp-cat{font-family:var(--font-display,'Space Grotesk',sans-serif);font-weight:600;font-size:10.5px;letter-spacing:.7px;text-transform:uppercase;color:var(--kygo-green-dark,var(--green-dark,#16A34A))}
      .rp-title{font-family:var(--font-display,'Space Grotesk',sans-serif);font-weight:600;font-size:17px;line-height:1.25;letter-spacing:-.01em;color:var(--fg-1,var(--dark,#0F172A));display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
      .rp-blurb{font-family:var(--font-body,'DM Sans',sans-serif);font-size:13.5px;line-height:1.55;color:var(--fg-2,var(--gray-600,#475569));display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .rp-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:auto;padding-top:5px}
      .rp-meta{font-family:var(--font-body,'DM Sans',sans-serif);font-size:12px;font-weight:500;color:var(--fg-3,var(--gray-400,#94A3B8));overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .rp-open{display:inline-flex;align-items:center;gap:4px;flex-shrink:0;font-family:var(--font-body,'DM Sans',sans-serif);font-size:13px;font-weight:600;color:var(--kygo-green-dark,var(--green-dark,#16A34A))}
      .rp-open svg{width:15px;height:15px}
      </style>
      <section class="rp-section${bg === 'gray' ? ' rp-gray' : ''}" id="related-reading">
        <div class="rp-inner">
          <div class="rp-head animate-on-scroll">
            <div class="rp-kicker">From the blog</div>
            <h2 class="rp-h2">Keep <span class="rp-hl">reading.</span></h2>
            <p class="rp-lede">The long-form, evidence-based articles behind this tool.</p>
          </div>
          <div class="rp-grid">${cards}</div>
        </div>
      </section>`;
  }

  _renderRelatedTools(bg) {
    const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
    const cards = this._relatedTools().map(t => {
      const slug = t.url.split('/').filter(Boolean).pop();
      return `
      <a class="rt-card animate-on-scroll" href="${t.url}" aria-label="${t.title}" data-action="related-tool" data-tool-slug="${slug}" data-track-position="related-tools" data-track-label="${slug}">
        <span class="rt-media"><span class="rt-panel"><span class="rt-cap">${t.motif.caption || ''}</span>${this._relatedMotif(t.motif)}</span></span>
        <span class="rt-body">
          <span class="rt-title">${t.title}</span>
          <span class="rt-blurb">${t.blurb}</span>
          <span class="rt-foot"><span class="rt-meta">${t.meta || ''}</span><span class="rt-open">Open ${arrow}</span></span>
        </span>
      </a>`;
    }).join('');
    return `
      <style>
      .rt-section{padding:56px 20px;background:#fff}
      .rt-section.rt-gray{background:var(--kygo-light,var(--light,#F8FAFC))}
      @media(min-width:720px){.rt-section{padding:80px 24px}}
      .rt-inner{max-width:1200px;margin:0 auto}
      .rt-head{margin-bottom:28px;max-width:720px}
      .rt-kicker{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-display,'Space Grotesk',sans-serif);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--kygo-green-dark,#16A34A);background:var(--kygo-green-light,rgba(34,197,94,.12));padding:6px 12px;border-radius:999px}
      .rt-h2{font-family:var(--font-display,'Space Grotesk',sans-serif);font-weight:600;font-size:clamp(26px,4vw,42px);line-height:1.1;margin:16px 0 10px;letter-spacing:-.01em;color:var(--fg-1,#0F172A)}
      .rt-h2 .rt-hl{color:var(--kygo-green,#22C55E)}
      .rt-lede{font-family:var(--font-body,'DM Sans',sans-serif);color:var(--fg-2,#475569);font-size:16px;line-height:1.55;max-width:62ch;margin:0}
      .rt-grid{display:grid;grid-template-columns:1fr;gap:18px}
      @media(min-width:720px){.rt-grid{grid-template-columns:repeat(3,1fr);gap:22px}}
      .rt-card{position:relative;display:flex;flex-direction:column;background:var(--bg-canvas,#fff);border:1px solid var(--border-subtle,#E2E8F0);border-radius:18px;overflow:hidden;text-decoration:none;color:inherit;box-shadow:0 2px 12px rgba(15,23,42,.05);transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s ease,border-color .25s ease}
      .rt-card::after{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,var(--kygo-green,#22C55E),var(--kygo-green-dark,#16A34A));opacity:0;transition:opacity .25s ease;pointer-events:none}
      .rt-card:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(15,23,42,.10);border-color:#CBD5E1}
      .rt-card:hover::after{opacity:1}
      .rt-card:focus-visible{outline:2px solid var(--kygo-green,#22C55E);outline-offset:3px}
      .rt-media{position:relative;aspect-ratio:16/10;overflow:hidden;background:var(--bg-raised,#F1F5F9);display:flex;align-items:center;justify-content:center}
      .rt-panel{display:block;background:var(--bg-canvas,#fff);border:1px solid #EAECEF;border-radius:14px;box-shadow:0 6px 18px rgba(15,23,42,.08);padding:13px 15px;width:78%}
      .rt-cap{display:block;font-family:var(--font-display,'Space Grotesk',sans-serif);font-weight:600;font-size:9px;letter-spacing:.6px;text-transform:uppercase;color:var(--fg-3,#94A3B8);margin-bottom:8px}
      .rt-body{padding:16px 18px 18px;display:flex;flex-direction:column;gap:7px}
      .rt-title{font-family:var(--font-display,'Space Grotesk',sans-serif);font-weight:600;font-size:17px;line-height:1.25;letter-spacing:-.01em;color:var(--fg-1,#0F172A)}
      .rt-blurb{font-family:var(--font-body,'DM Sans',sans-serif);font-size:13.5px;line-height:1.55;color:var(--fg-2,#475569);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .rt-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:5px}
      .rt-meta{font-family:var(--font-body,'DM Sans',sans-serif);font-size:12px;font-weight:500;color:var(--fg-3,#94A3B8);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .rt-open{display:inline-flex;align-items:center;gap:4px;flex-shrink:0;font-family:var(--font-body,'DM Sans',sans-serif);font-size:13px;font-weight:600;color:var(--kygo-green-dark,#16A34A)}
      .rt-open svg{width:15px;height:15px}
      </style>
      <section class="rt-section${bg === 'gray' ? ' rt-gray' : ''}" id="related-tools">
        <div class="rt-inner">
          <div class="rt-head animate-on-scroll">
            <div class="rt-kicker">Keep exploring</div>
            <h2 class="rt-h2">Related <span class="rt-hl">tools.</span></h2>
            <p class="rt-lede">More free, evidence-based tools to get the most out of your wearable.</p>
          </div>
          <div class="rt-grid">${cards}</div>
        </div>
      </section>`;
  }

  // Copy for the standard app CTA card. Headline carries one <span> for the
  // green phrase; everything else about the card is shared.
  _appCta() {
    return {
      slug: 'wearable-accuracy',
      hook: `See which of your device's readings to trust, with your own data behind it.`,
      headline: `No device wins everywhere. <span>Kygo reads them all.</span>`,
      sub: `Whichever wearable you own, Kygo connects to it and cross-checks your key metrics against what you actually eat, train and sleep.`
    };
  }

  // ── App CTA · Kygo standard module ──────────────────────────────────────
  // The dark conversion card, on its own section, directly after the first
  // content section. Self-contained under `kc-*` names with a literal fallback
  // behind every custom property, so the same block renders identically on
  // either palette. Nothing else belongs in this section - the email capture
  // is a separate band further down the page.
  // Pass 'gray' to sit the section on the tinted band.

  _renderAppCta(bg) {
    __ensureKygoCta();
    const c = this._appCta();
    const badges = [
      ['273a63_56ac2eb53faf43fab1903643b29c0bce', 'Oura Ring', 'Oura'],
      ['273a63_1a1ba0e735ea4d4d865c04f7c9540e69', 'Apple Health', 'Apple'],
      ['273a63_c451e954ff8740338204915f904d8798', 'Fitbit', 'Fitbit'],
      ['273a63_0a60d1d6c15b421e9f0eca5c4c9e592b', 'Garmin', 'Garmin'],
      ['273a63_874a026381ad469698b84e11a2736609', 'WHOOP', 'WHOOP', '#000'],
      ['273a63_e7e3c05ed0bc4cec8f456cd7f995e70b', 'Polar', 'Polar'],
      ['273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e', 'Google Health', 'Google'],
      ['273a63_0c0e48cc065d4ee3bf506f6d47440518', 'Health Connect', 'Health']
    ].map(([id, name, label, bg]) => `<span class="kc-chip"><span class="kc-chip-tile"${bg ? ` style="background:${bg}"` : ''}><img src="https://static.wixstatic.com/media/${id}~mv2.png" alt="${name}" title="${name}" loading="lazy" /></span><span class="kc-chip-label">${label}</span></span>`).join('');
    return `
      <style>
      .kc-section{padding:56px 20px;background:#fff}
      .kc-section.kc-gray{background:var(--kygo-light,var(--light,#F8FAFC))}
      @media(min-width:720px){.kc-section{padding:72px 24px}}
      .kc-inner{max-width:1100px;margin:0 auto}
      .kc-card{position:relative;overflow:hidden;background:#0F172A;border-radius:24px;padding:40px 24px;color:#fff;text-align:center;display:flex;flex-direction:column;align-items:center}
      @media(min-width:720px){.kc-card{padding:56px 40px}}
      .kc-card::before{content:'';position:absolute;top:-160px;right:-160px;width:520px;height:520px;background:radial-gradient(closest-side,rgba(34,197,94,.30),transparent);pointer-events:none}
      .kc-card::after{content:'';position:absolute;bottom:-180px;left:-180px;width:480px;height:480px;background:radial-gradient(closest-side,rgba(34,197,94,.12),transparent);pointer-events:none}
      .kc-pill{position:relative;display:inline-flex;align-items:center;gap:8px;background:rgba(34,197,94,.16);color:#6EE7A0;padding:6px 14px;border-radius:999px;font-family:var(--font-display,'Space Grotesk',sans-serif);font-size:12px;font-weight:600;border:1px solid rgba(34,197,94,.25)}
      .kc-pill .kc-dot{width:6px;height:6px;border-radius:50%;background:#22C55E;box-shadow:0 0 8px #22C55E}
      .kc-h{position:relative;font-family:var(--font-display,'Space Grotesk',sans-serif);font-weight:600;color:#fff;font-size:clamp(26px,4.5vw,42px);line-height:1.05;letter-spacing:-.01em;margin:18px 0 14px;max-width:22ch}
      .kc-h span{color:#22C55E}
      .kc-p{position:relative;font-family:var(--font-body,'DM Sans',sans-serif);color:rgba(255,255,255,.72);font-size:clamp(14px,1.6vw,16px);line-height:1.6;max-width:56ch;margin:0 auto 24px}
      .kc-p em{font-style:italic}
      .kc-btns{position:relative;display:flex;gap:12px;flex-wrap:wrap;justify-content:center;width:100%}
      .kc-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 22px;border-radius:12px;background:#22C55E;color:#fff;font-family:var(--font-body,'DM Sans',sans-serif);font-weight:600;font-size:15px;text-decoration:none;box-shadow:0 4px 12px rgba(34,197,94,.25);transition:background .2s ease,transform .2s ease,box-shadow .2s ease}
      .kc-btn:hover{background:#16A34A;transform:translateY(-1px);box-shadow:0 10px 24px rgba(34,197,94,.32)}
      .kc-btn:focus-visible{outline:2px solid #fff;outline-offset:3px}
      .kc-btn svg{width:18px;height:18px;flex:none}
      @media(max-width:560px){.kc-btn{width:100%}}
      .kc-note{position:relative;margin:16px 0 0;font-family:var(--font-body,'DM Sans',sans-serif);font-size:13px;line-height:1.5;color:rgba(255,255,255,.72)}
      .kc-works{position:relative;margin-top:26px;display:flex;flex-direction:column;align-items:center;gap:12px;font-family:var(--font-body,'DM Sans',sans-serif);color:rgba(255,255,255,.6);font-size:13px}
      /* Logo tile + brand label, matching the homepage step-2 chips. Always one line. */
      .kc-badges{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:center;gap:6px;row-gap:12px}
      .kc-chip{display:flex;flex-direction:column;align-items:center;gap:6px;flex:0 0 auto}
      .kc-chip-tile{width:40px;height:40px;flex-shrink:0;border-radius:11px;background:#fff;overflow:hidden;display:flex;align-items:center;justify-content:center}
      .kc-chip-tile img{width:100%;height:100%;object-fit:cover;border-radius:11px;display:block}
      .kc-chip-label{font-size:10px;font-weight:600;color:rgba(255,255,255,.6);white-space:nowrap}
      @media(max-width:449px){.kc-badges{gap:4px}.kc-chip-tile{width:36px;height:36px}.kc-chip-label{font-size:9.5px}}
      @media(max-width:403px){.kc-badges{gap:3px}.kc-chip-tile{width:30px;height:30px}.kc-chip-label{font-size:8px}}
      .kc-left,.kc-right{position:relative;display:flex;flex-direction:column;align-items:center;width:100%}
      @media(min-width:880px){
        .kc-card{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:40px;align-items:center;text-align:left;padding:48px 48px}
        .kc-left{align-items:flex-start}
        .kc-left .kc-h{margin:16px 0 12px}
        .kc-left .kc-p{margin:0}
        .kc-works{margin-top:20px}
      }
      @media(max-width:360px){.kc-badges{gap:2px}.kc-chip-tile{width:28px;height:28px}.kc-chip-label{font-size:7.5px}}
      @media(max-width:340px){.kc-badges{gap:2px}.kc-chip-tile{width:26px;height:26px}.kc-chip-label{font-size:7px}}
      </style>
      <section class="kc-section${bg === 'gray' ? ' kc-gray' : ''}" id="get-the-app">
        <div class="kc-inner">
          <div class="kc-card animate-on-scroll">
            <div class="kc-left">
            <div class="kc-pill"><span class="kc-dot"></span> Free 7-day trial</div>
            <h3 class="kc-h">${c.headline}</h3>
            <p class="kc-p">${c.sub}</p>
            </div>
            <div class="kc-right">
            <kygo-cta theme="dark" slug="${c.slug}" surface="tool" hook="${c.hook}"
              note="7-day free trial. Save 58% on yearly. Cancel anytime."></kygo-cta>
            <div class="kc-works">
              <span>Works with</span>
              <div class="kc-badges">${badges}</div>
            </div>
            </div>
          </div>
        </div>
      </section>`;
  }

  // Identifiers for the email capture. `source` is what GA4 and the Velo
  // endpoint record, so it must not change.
  _emailCta() {
    return { source: 'tool-wearable-accuracy', variant: 'comparison' };
  }

  // ── Email CTA · Kygo standard module ────────────────────────────────────
  // The inline email capture, on its own band. It never sits directly under the
  // app CTA - a page content section always separates the two conversion
  // touchpoints. Self-contained under `ke-*` names so it drops into either
  // palette. Pass 'gray' to sit on the tinted band.

  _renderEmailCta(bg) {
    const c = this._emailCta();
    return `
      <style>
      .ke-section{padding:8px 20px 12px;background:#fff}
      .ke-section.ke-gray{background:var(--kygo-light,var(--light,#F8FAFC))}
      @media(min-width:720px){.ke-section{padding:16px 24px 20px}}
      .ke-inner{max-width:1100px;margin:0 auto}
      </style>
      <section class="ke-section${bg === 'gray' ? ' ke-gray' : ''}" id="email-signup">
        <div class="ke-inner">
          <kygo-inline-subscribe source="${c.source}" variant="${c.variant}"></kygo-inline-subscribe>
        </div>
      </section>`;
  }


  // ── Data: facts, FAQ, sources ─────────────────────────────────────────

  get _facts() {
    return [
      { icon: 'user', tone: 'dark', tag: 'Population', stat: '0.65 → 0.35', statLabel: 'Oura\'s sleep-staging score in healthy sleepers, then in people with sleep complaints', title: 'Who wears it beats which brand',
        body: 'The same device scores far lower in people with sleep complaints, across studies: Oura falls from κ 0.65 to 0.35, Apple from 0.53 to 0.30.', src: 'Robbins 2024 · Lee 2023 · Schyvens 2025' },
      { icon: 'flame', tone: 'dark', tag: 'Universal', stat: '115%', statLabel: 'The worst workout calorie error in a 2026 lab test', title: 'Calories are the weakest number',
        body: 'In 2026 lab tests weight-training calories were off by up to 115%, and Apple, Samsung and Garmin read high in cycling. Fitbit was close only on average. Use calories as a trend only.', src: 'Kostrna 2026 · Yun 2026' },
      { icon: 'dollar', tone: 'mid', tag: 'Funding', stat: String(this._heroStats.funded), statLabel: 'Sources here funded or written by the brand being tested', title: 'Who paid for the study matters',
        body: `${this._heroStats.funded} sources here were funded or written by the brand being tested: ${this._heroStats.fundedStudies} studies and ${this._heroStats.funded - this._heroStats.fundedStudies} company documents. Each one is flagged.`, src: 'Funding checked per source' },
      { icon: 'clock', tone: 'dark', tag: 'Coverage gap', stat: '2 to 4 yrs', statLabel: 'How far peer review lags new hardware', title: 'The newest models are unvalidated',
        body: 'Oura Ring 5, WHOOP 5.0, Apple Watch Series 10 to 12 and Galaxy Watch 8 have little or no independent data. Peer review lags hardware by 2 to 4 years.', src: 'Validation coverage, Sept 2026' },
      { icon: 'droplet', tone: 'mid', tag: 'Blood oxygen', stat: '85%', statLabel: 'Of readings below 88% oxygen, the share an Apple Watch Series 7 over-read (Jiang 2026)', title: 'SpO2 is least reliable when it matters',
        body: 'An Apple Watch over-read most readings when oxygen was truly low, and no watch has proven reliable in that range, so a normal reading is not reassurance if you feel unwell.', src: 'Jiang 2023 · Jiang 2026' },
      { icon: 'shield', tone: 'good', tag: 'Regulation', stat: '41%', statLabel: 'Of people with hypertension, the share Apple\'s alert caught in its own FDA study', title: 'Cleared does not mean it catches everything',
        body: 'Apple\'s hypertension alert caught 41% of cases in its own FDA study, its sleep apnea alert 66%. No alert is not an all-clear.', src: 'FDA K250507 · K240929' }
    ];
  }

  get _faqs() {
    return [
      { q: 'Which wearable is the most accurate overall?', a: 'No single wearable is most accurate across all metrics. Oura Ring is the most accurate for everything measured overnight: sleep stages (kappa 0.65, Ring 3), sleep timing (total sleep within 2 minutes of a lab study), overnight HRV (6% error, agreement 0.99, Ring 4) and resting heart rate (1.1 bpm). Apple Watch is the most accurate for heart rate during exercise (lowest error of four watches cycling, 2.5 bpm) and blood oxygen (2.2 points off in a low-oxygen test), and has the most FDA-cleared features (five). Garmin is the most accurate for steps (3% over in daily life, pooled across 59 studies) and VO2 max (6.7% error with a chest strap). Fitbit is the least bad for calories and the only brand with an independent breathing rate test. WHOOP is second for HRV and breathing rate and third for resting heart rate. Polar is second for resting heart rate (2.71% error over the first four hours of sleep, Grit X Pro). Samsung is second for blood oxygen and calories. These rankings are for the models tested, mostly one to three generations old; the newest models have little or no published validation.' },
      { q: 'How accurate is Oura Ring for sleep tracking?', a: 'It depends on who is wearing it. In an Oura-funded study of screened healthy sleepers (Robbins 2024, n=35) the Gen 3 ring reached a kappa of 0.65 against a lab sleep study. In independent clinical samples it falls to 0.35 (Lee 2023) and 53% stage accuracy in sleep-clinic patients (Herberger 2025). Oura is strongest at total sleep time, with a bias of about -3 minutes. Oura Ring 5 has no published validation.' },
      { q: 'Is Apple Watch or Garmin more accurate for heart rate?', a: 'Apple, by a small margin. In the one cycling test that put both on the same people (Kostrna 2026) the Apple Watch Series 8 had the lowest error of four watches (2.5 bpm) and the Garmin Forerunner 955 was second (2.9 bpm); across 22 studies Apple\'s pooled bias is close to zero (-0.27 bpm, Lambe 2026). In a ten-device test against a chest strap (Gielen 2026) the Garmin Vivoactive 5 came in at 6.3% and the budget Apple Watch SE at 7.3%, with the Fitbit Charge 6 best at 5.5% and the Fitbit Inspire 3 worst at 16.5%. Model matters as much as brand, and irregular arm movement, not intensity, is what breaks wrist readings.' },
      { q: 'Which smartwatch has the most accurate blood oxygen (SpO2)?', a: 'Apple Watch has the most evidence and the smallest errors at normal levels: 2.2% in a low-oxygen lab test (Series 8, Walzel 2023) and 2.2% at rest (Series 7, Jiang 2023). Galaxy Watch 5 measured 3.8% and read low; Garmin Venu 2s measured 5.8% and read low. When oxygen is truly low, watches tend to read high: an Apple Watch Series 7 over-read 85% of readings below 88% against arterial blood (Jiang 2026). Oura and WHOOP have no independent SpO2 validation, Polar produced no readings, and no wearable SpO2 feature is FDA-cleared.' },
      { q: 'How accurate are wearable calorie counts?', a: 'Calories are the least accurate wearable metric. In a 2026 study that tested Apple, Fitbit, Garmin and Samsung on the same 58 people against lab gas analysis, cycling errors ran from 31.7% to 77.6% (Kostrna 2026). Apple, Garmin and Samsung read high on average; Fitbit averaged close to zero, but only after implausible readings were removed. In weight training, Apple, Garmin and Samsung errors ran from 84.5% to 115% (Yun 2026), and a second 2026 study of 62 men found all four brands reading high in both endurance and weight sessions (Lee 2026). No study has tested WHOOP calories or Oura\'s current calorie algorithm.' },
      { q: 'Which wearables have FDA-cleared features?', a: 'Apple Watch has five FDA-cleared features (ECG, irregular rhythm alerts, AFib History, sleep apnea and hypertension notifications). Samsung has three (ECG, irregular rhythm alerts, sleep apnea). Fitbit has two (ECG, irregular rhythm alerts), Garmin and WHOOP MG one each (ECG). Oura has none. Blood pressure on Samsung, WHOOP, Oura and Pixel Watch is a wellness feature, not FDA-cleared, and no wearable blood oxygen feature is cleared.' }
    ];
  }

  _renderFAQ() {
    return this._faqs.map(f => `<details><summary><span>${f.q}</span>${this._icon('plus')}</summary><div class="body">${f.a}</div></details>`).join('');
  }

  _renderFactCards() {
    const F = this._facts;
    const i0 = this._factIdx || 0;
    const tabs = F.map((f, i) => `<button type="button" class="fx-tab${i === i0 ? ' on' : ''}" data-fact="${i}" role="tab" aria-selected="${i === i0}" aria-controls="fx-p${i}"><span class="fx-ico">${this._icon(f.icon)}</span><span class="fx-tt"><span class="fx-tag">${f.tag}</span><span class="fx-ttl">${f.title}</span></span></button>`).join('');
    const panels = F.map((f, i) => `<div class="fx-panel" id="fx-p${i}" role="tabpanel"${i === i0 ? '' : ' hidden'}>
        <span class="fx-tag">${f.tag}</span>
        <div class="fx-stat">${f.stat}</div>
        <p class="fx-statl">${f.statLabel}</p>
        <h4 class="fx-title">${f.title}</h4>
        <p class="fx-body">${f.body}</p>
        <span class="sig-src">${f.src}</span>
      </div>`).join('');
    return `<div class="fx" data-fx>
      <div class="fx-tabs" role="tablist" aria-label="Findings">${tabs}</div>
      <div class="fx-main">${panels}
        <div class="fx-nav"><button type="button" class="fx-step" data-fact-step="-1" aria-label="Previous finding">${this._icon('arrowRight')}</button><span class="fx-count" data-fx-count>${i0 + 1} of ${F.length}</span><button type="button" class="fx-step" data-fact-step="1" aria-label="Next finding">${this._icon('arrowRight')}</button></div>
      </div>
    </div>`;
  }

  _setFact(i) {
    const n = this._facts.length;
    this._factIdx = (i + n) % n;
    const root = this.shadowRoot;
    root.querySelectorAll('[data-fact]').forEach(b => { const on = +b.dataset.fact === this._factIdx; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); if (on) b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); });
    root.querySelectorAll('.fx-panel').forEach((p, j) => { if (j === this._factIdx) p.removeAttribute('hidden'); else p.setAttribute('hidden', ''); });
    const c = root.querySelector('[data-fx-count]'); if (c) c.textContent = `${this._factIdx + 1} of ${n}`;
  }

  get _sources() {
    const tagFor = st => {
      if (st.type === 'regulatory') return 'FDA record';
      if (st.type === 'vendor') return (st.funder || 'Vendor') + ' document';
      const base = st.funder ? st.funder + '-funded' : 'Independent';
      return st.type === 'preprint' ? base + ' · preprint' : st.type === 'abstract' ? base + ' · abstract' : base;
    };
    return Object.values(this._studies).map(st => ({
      tag: tagFor(st), title: st.title,
      cite: `${st.authors} ${st.year}. ${st.journal.replace(/\.$/, '')}${st.n ? ', n=' + st.n : ''}${st.code ? ', ' + st.code : ''}.`,
      url: st.doi ? 'https://doi.org/' + st.doi : (st.url || null)
    }));
  }

  _renderSourceCards(list) {
    return list.map(s => {
      const tag = `<span class="src-tag">${s.tag}</span>`;
      const title = `<span class="src-title">${s.title}</span>`;
      if (!s.url) return `<div class="src src--nolink">${tag}${title}<span class="src-cite">${s.cite || ''}</span></div>`;
      return `<a class="src" href="${s.url}" target="_blank" rel="noopener nofollow" data-action="source-link" data-track-label="${s.title}" data-track-position="sources">${tag}${title}<span class="src-cite">${s.cite} <span class="src-go">${this._icon('externalLink')}</span></span></a>`;
    }).join('');
  }

  _renderSources() {
    const list = this._sources;
    const rest = list.slice(6);
    return `
      <div class="sources">${this._renderSourceCards(list.slice(0, 6))}</div>
      ${rest.length ? `
      <div class="sources src-extra" data-src-extra hidden>${this._renderSourceCards(rest)}</div>
      <div class="src-toggle-wrap"><button type="button" class="src-toggle" data-src-toggle aria-expanded="false">${this._icon('arrowRight')} <span data-src-toggle-label>Show all ${list.length} sources</span></button></div>` : ''}`;
  }

  _toggleSources() {
    const root = this.shadowRoot;
    const extra = root.querySelector('[data-src-extra]');
    const btn = root.querySelector('[data-src-toggle]');
    const lbl = root.querySelector('[data-src-toggle-label]');
    if (!extra) return;
    const open = extra.hasAttribute('hidden');
    if (open) extra.removeAttribute('hidden'); else extra.setAttribute('hidden', '');
    if (btn) { btn.classList.toggle('open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    if (lbl) lbl.textContent = open ? 'Show fewer sources' : `Show all ${this._sources.length} sources`;
  }

  // ── Comparator: pick brands + one metric, show that metric's own table ──

  _tone(level) { return level === 'strong' || level === 'good' ? 'good' : level === 'weak' ? 'dark' : 'mid'; }

  _renderComparator() {
    const d = this._devices;
    const sel = this._cmpDevs;
    const sc = this._scorecard;
    const opts = cur => Object.keys(d).map(k => `<option value="${k}"${k === cur ? ' selected' : ''}>${d[k].short}</option>`).join('');
    const card = (k, i) => {
      const best = this._sections.filter(s => s.id !== 'fda' && ['strong', 'good'].includes(sc[s.id][k][0])).map(s => s.nav);
      return `${i ? '<span class="cx-vsb" aria-hidden="true">VS</span>' : ''}<div class="cx-card">
        ${this._logo(k)}
        <span class="cx-sel"><select data-cx-slot="${i}" aria-label="Brand ${i + 1}">${opts(k)}</select>${this._icon('chevronDown')}</span>
        <span class="cx-card-best">${best.length ? 'Best for ' + best.join(', ') : 'Little independent data yet'}</span>
        <span class="cx-card-sub">${d[k].subscription}</span>
      </div>`;
    };
    const tab = (id, label, icon, full) => `<button type="button" class="cx-tab${id === this._cmpMetric ? ' on' : ''}" data-cx-metric="${id}" aria-pressed="${id === this._cmpMetric}" title="${full}">${this._icon(icon)}<span>${label}</span></button>`;
    return `<div class="cx">
      <div class="cx-cards">${sel.map(card).join('')}</div>
      <div class="cx-tabs" role="group" aria-label="Metric">${tab('overview', 'Overview', 'layers', 'Overview')}${this._sections.map(s => tab(s.id, s.nav, s.icon, s.name)).join('')}</div>
      <div class="cx-panel" data-cx-panel aria-live="polite">${this._renderCmprPanel()}</div>
    </div>`;
  }

  _renderOverview() {
    const sel = this._cmpDevs;
    const L = this._levels, sc = this._scorecard, d = this._devices;
    const rows = this._sections.map(sec => {
      const rank = k => sec.id === 'fda' ? (k in this._fdaCounts ? this._fdaCounts[k] : -1) : L[sc[sec.id][k][0]].rank;
      const ranks = sel.map(rank), top = Math.max(...ranks);
      let win = top >= (sec.id === 'fda' ? 1 : 3) && ranks.some(r => r < top);
      if (sec.id === 'temp' || (sec.id === 'fda' && sel.some(k => !(k in this._fdaCounts)))) win = false;
      let isWin = k => win && rank(k) === top;
      // Sleep: compare study by study (higher kappa is better). A brand wins only if it matches or
      // beats every other pick in each study they share, and beats at least one; pairs with no shared
      // study fall back to the grade.
      if (sec.id === 'sleep') {
        const t = this._metricContent.sleep.table;
        const vals = k => { const r = t.rows.find(x => x.dev === k); const o = {}; if (r) t.cols.forEach(c => { const v = r.cells[c.key]; const n = v && parseFloat(v.t); if (v && !isNaN(n) && !/to/.test(v.t)) o[c.key] = n; }); return o; };
        const cmp = (a, b) => { const va = vals(a), vb = vals(b); const ks = Object.keys(va).filter(x => x in vb); if (!ks.length) return Math.sign(rank(a) - rank(b)); const ge = ks.every(x => va[x] >= vb[x]), le = ks.every(x => va[x] <= vb[x]); return ge && !le ? 1 : le && !ge ? -1 : ge && le ? 0 : null; };
        const winners = sel.filter(a => rank(a) >= 3 && sel.every(b => b === a || [0, 1].includes(cmp(a, b))) && sel.some(b => b !== a && cmp(a, b) === 1));
        win = winners.length > 0; isWin = k => winners.includes(k);
      }
      const cells = sel.map(k => {
        const [lv, t] = sc[sec.id][k];
        let txt, cls = '';
        if (sec.id === 'fda') { const n = this._fdaCounts[k]; txt = !(k in this._fdaCounts) ? 'Not checked' : n ? `${n} cleared` : 'None'; if (!n) cls = ' na'; }
        else if (lv === 'none') { txt = t || 'Not tested'; cls = ' na'; }
        else if (lv === 'vendor') { txt = 'Company claim only'; cls = ' na'; }
        else txt = t;
        const w = isWin(k);
        return `<div class="ov-c${w ? ' win' : ''}${cls}">${w ? `<span class="ov-chk">${this._icon('check')}</span>` : ''}<span>${txt}</span></div>`;
      }).join('');
      return `<button type="button" class="ov-lab" data-cx-metric="${sec.id}">${this._icon(sec.icon)}<span>${sec.nav}</span></button>${cells}`;
    }).join('');
    const head = `<div class="ov-h ov-h0">Metric</div>` + sel.map(k => `<div class="ov-h">${this._logo(k, 'sm')}<span>${d[k].short}</span></div>`).join('');
    return `
      <div class="cx-head"><span class="cx-ico">${this._icon('layers')}</span><div class="cx-title"><h3>Every metric, side by side</h3><span class="cx-meta">Peer-reviewed results, funding flagged in each section · green marks the better one</span></div></div>
      <div class="ov" style="--n:${sel.length}">${head}${rows}</div>
      <div class="cx-foot"><span>Figures summarise each metric's section. Tap a metric name for the full chart.</span></div>`;
  }

  _renderCmprPanel() {
    if (this._cmpMetric === 'overview') return this._renderOverview();
    const id = this._cmpMetric;
    const sec = this._sections.find(s => s.id === id);
    const c = this._metricContent[id];
    const m = this._hubMeta[id];
    const order = Object.keys(this._devices);
    const sel = order.filter(k => this._cmpDevs.includes(k));
    let table;
    if (c.custom) {
      table = this._fdaTable(sel);
    } else if (c.chart) {
      table = c.chart(sel);
    } else {
      const rows = c.table.rows.filter(r => sel.includes(r.dev));
      sel.filter(k => !rows.some(r => r.dev === k)).forEach(k => rows.push({ dev: k, grade: 'none', cells: {} }));
      table = this._rankTable(Object.assign({}, c.table, { id: 'compare-' + id, rows }));
    }
    return `
      <div class="cx-head">
        <span class="cx-ico">${this._icon(sec.icon)}</span>
        <div class="cx-title"><h3>${sec.name}</h3><span class="cx-meta">Tested against ${/^[A-Z][a-z]/.test(sec.gold) && !/^(Polar|FDA)/.test(sec.gold) ? sec.gold[0].toLowerCase() + sec.gold.slice(1) : sec.gold} · checked ${m.checked}</span></div>
      </div>
      <p class="cx-verdict">${sec.short || sec.verdict}</p>
      ${table}
      <div class="cx-foot"><span>Same figures as the full section, filtered to your brands. A dashed circle means no independent study.</span><button type="button" class="cx-go" data-jump="${id}">Full section and studies ${this._icon('arrowRight')}</button></div>`;
  }

  // ── Hub: metric index + one stacked section per metric ───────────────

  get _updated() { return { page: 'Oct 25, 2026', pageIso: '2026-10-25' }; }

  // "Checked" = last verification date of the library doc behind each section.
  // Spokes = the dedicated tool that goes deeper on that metric.
  get _hubMeta() {
    return {
      sleepTiming: { checked: 'Oct 2026', hl: 'Oura, then Fitbit, then Apple.' },
      sleep: { checked: 'Oct 2026', hl: 'Oura leads; who you are matters more.',
        spoke: { url: 'https://www.kygo.app/tools/sleep-tracker-accuracy', slug: 'sleep-tracker-accuracy', title: 'Sleep Tracker Accuracy', blurb: '7 trackers vs a lab sleep study: staging in healthy and clinical sleepers, deep and REM detection, sleep/wake and total sleep time.', meta: '7 devices · head-to-head builder' } },
      hrv: { checked: 'Oct 2026', hl: 'Oura leads.' },
      rhr: { checked: 'Oct 2026', hl: 'Oura, then Polar and WHOOP.' },
      activeHr: { checked: 'Oct 2026', hl: 'Apple edges Garmin and Fitbit.',
        spoke: { url: 'https://www.kygo.app/tools/heart-rate-accuracy', slug: 'heart-rate-accuracy', title: 'Most Accurate Heart Rate Wearable', blurb: '10 wearables against an ECG or chest strap, tier by tier, and why arm movement is what breaks the reading.', meta: '10 devices · tiers, not rankings' } },
      spo2: { checked: 'Oct 2026', hl: 'least reliable when it counts.' },
      steps: { checked: 'Oct 2026', hl: 'Garmin leads in daily life.',
        spoke: { url: 'https://www.kygo.app/tools/step-count-accuracy', slug: 'step-count-accuracy', title: 'Step Count Accuracy', blurb: 'Every device ranked with a lab vs daily-life split, plus why rings and wrists miscount.', meta: 'Lab vs daily life' } },
      calories: { checked: 'Oct 2026', hl: 'Fitbit is least bad; none is reliable.',
        spoke: { url: 'https://www.kygo.app/tools/calorie-burn-accuracy', slug: 'calorie-burn-accuracy', title: 'Calorie Burn Accuracy Calculator', blurb: 'Enter your device, activity and the calories it reported, and see the likely real range.', meta: 'Calculator · by device and activity' } },
      vo2max: { checked: 'Oct 2026', hl: 'Garmin leads, with a chest strap.',
        spoke: { url: 'https://www.kygo.app/tools/vo2-max-accuracy', slug: 'vo2-max-accuracy', title: 'VO2 Max Accuracy', blurb: '9 wearables vs a lab treadmill test, split by how each one estimates VO2 max.', meta: '9 devices · by method' } },
      temp: { checked: 'Oct 2026', hl: 'no independent sensor test.' },
      resp: { checked: 'Oct 2026', hl: 'only two brands qualify.' },
      fda: { checked: 'Oct 2026', hl: 'cleared is not caught.' }
    };
  }

  _renderJumpNav() {
    return `<nav class="jn" aria-label="Jump to a metric">${this._sections.map(s => `<a class="jn-chip" href="#m-${s.id}" data-jump="${s.id}" title="${s.name}">${this._icon(s.icon)}<span>${s.nav}</span></a>`).join('')}</nav>`;
  }

  // Hero panel: how much evidence sits behind each brand.
  _renderHeroPanel() {
    const hs = this._heroStats;
    const st = this._studies;
    const isStudy = s => s && ['peer', 'preprint', 'abstract'].includes(s.type);
    const rows = Object.entries(this._devices).map(([k, d]) => {
      const ss = d.studyIds.map(id => st[id]).filter(isStudy);
      const ind = ss.filter(s => !s.funder).length;
      return { k, d, ind, fund: ss.length - ind, n: ss.length };
    }).sort((a, b) => b.n - a.n);
    const max = Math.max(...rows.map(r => r.n));
    return `<div class="hero-vis ev">
      <div class="hero-vis-head"><span class="hero-vis-title"><span class="hero-vis-dot"></span> Research behind this page</span><span class="hero-vis-tag">Funding checked</span></div>
      <div class="ev-big">
        <div><strong>${hs.studies}</strong><span>validation studies</span></div>
        <div><strong>${hs.fda}</strong><span>FDA records</span></div>
        <div><strong>${this._sections.length - 1}</strong><span>metrics graded, plus FDA</span></div>
      </div>
      <div class="ev-rows">${rows.map(r => `
        <div class="ev-row">
          <span class="ev-dev">${this._logo(r.k, 'sm')}<span>${r.d.short}</span></span>
          <span class="ev-bar"><span class="ev-ind" style="width:${r.ind / max * 100}%"></span><span class="ev-fund" style="width:${r.fund / max * 100}%"></span></span>
          <span class="ev-n"><strong>${r.n}</strong> studies</span>
        </div>`).join('')}
      </div>
      <div class="ev-legend"><span><i class="ev-key ind"></i>Independent</span><span><i class="ev-key fund"></i>Funded by the brand</span></div>
    </div>`;
  }

  _renderStudiesDrawer(sec) {
    const st = this._studies;
    const refs = sec.studies.filter(id => st[id]).map(id => st[id]);
    const rows = refs.map(s => {
      const url = s.doi ? 'https://doi.org/' + s.doi : s.url;
      const who = s.type === 'regulatory' ? 'FDA record' : s.funder ? `${s.funder}-funded` : 'Independent';
      const inner = `<span class="st-who ${s.funder && s.type !== 'regulatory' ? 'funded' : ''}">${who}</span><span class="st-title">${s.title}</span><span class="st-cite">${s.type === 'regulatory' ? s.code : s.authors} · ${s.year}${s.journal && s.type !== 'regulatory' ? ' · ' + s.journal : ''}${s.n ? ' · n=' + s.n : ''}</span>`;
      return url ? `<a class="st-row" href="${url}" target="_blank" rel="noopener nofollow" data-action="source-link" data-track-label="${s.code || s.title}" data-track-position="metric-${sec.id}">${inner}<span class="st-go">${this._icon('arrowRight')}</span></a>` : `<div class="st-row">${inner}</div>`;
    }).join('');
    return `<details class="deep-item"><summary><span class="dk-lab"><span class="dk-ico">${this._icon('fileText')}</span>Studies behind this</span><span class="deep-hint">${refs.length} source${refs.length === 1 ? '' : 's'}, funding labelled</span>${this._icon('plus')}</summary><div class="deep-body"><div class="st-list">${rows}</div></div></details>`;
  }

  // Mini preview of the dedicated tool, drawn from this section's own table.
  _spokePreview(id) {
    const c = this._metricContent[id];
    const col = c.table && c.table.cols.find(x => x.bar);
    const rows = col
      ? c.table.rows.filter(r => r.cells[col.key] && r.cells[col.key].v != null).slice(0, 4)
          .map(r => ({ label: this._devices[r.dev].short, pct: Math.max(8, (r.cells[col.key].v - col.bar.min) / (col.bar.max - col.bar.min) * 100) }))
      : c.table.rows.slice(0, 4).map((r, i) => ({ label: this._devices[r.dev].short, pct: 90 - i * 18 }));
    return this._relatedMotif({ motif: 'compare', rows });
  }

  _renderSpoke(sp, id) {
    return `<a class="spoke" href="${sp.url}" data-action="related-tool" data-tool-slug="${sp.slug}" data-track-label="${sp.slug}" data-track-position="hub-section">
      <span class="spoke-media"><span class="spoke-panel"><span class="spoke-cap">${sp.meta}</span>${this._spokePreview(id)}</span></span>
      <span class="spoke-body"><span class="spoke-k">Go deeper · dedicated tool</span><span class="spoke-title">${sp.title}</span><span class="spoke-blurb">${sp.blurb}</span>
      <span class="spoke-btn">Open the full breakdown ${this._icon('arrowRight')}</span></span>
    </a>`;
  }

  _goldLc(sec) { const g = sec.gold; return /^[A-Z][a-z]/.test(g) && !/^(Polar|FDA)/.test(g) ? g[0].toLowerCase() + g.slice(1) : g; }

  // Compact link row to the dedicated tool (replaces the big spoke card inside sections).
  _renderToolRow(sp, icon) {
    return `<a class="ml-tool" href="${sp.url}" data-action="related-tool" data-tool-slug="${sp.slug}" data-track-label="${sp.slug}" data-track-position="hub-section">
      <span class="dk-ico ml-tool-ico">${this._icon(icon || 'layers')}</span>
      <span class="ml-text"><span class="ml-title">${sp.title}</span><span class="ml-hint">Dedicated tool · ${sp.meta}</span></span>
      <span class="ml-go">Open ${this._icon('arrowRight')}</span>
    </a>`;
  }

  _renderMetricSection(sec, i) {
    const c = this._metricContent[sec.id];
    const m = this._hubMeta[sec.id];
    const table = c.custom ? c.custom() : c.chart ? c.chart() : this._rankTable(Object.assign({ id: sec.id }, c.table));
    // Metrics with a dedicated tool keep only the summary here; the rest keep their extra data.
    // Condensed sections (with a short lede and tip) keep their full original text in the More data drawer,
    // so nothing is removed from the page for search engines or AI assistants.
    const full = c.tip ? `<div class="full-txt"><p>${sec.verdict}</p><p>${c.insight}</p></div>` : '';
    const extra = c.more ? c.more() : '';
    const more = full || extra
      ? `<details class="deep-item"><summary><span class="dk-lab"><span class="dk-ico">${this._icon('barChart')}</span>More data</span><span class="deep-hint">The full picture, secondary tests and notes</span>${this._icon('plus')}</summary><div class="deep-body">${full}${extra}</div></details>` : '';
    return `
      <section class="section bg-light metric-sec" id="m-${sec.id}">
        <div class="section-inner">
          <article class="m-card animate-on-scroll">
          <header class="section-head m-card-head">
            <div class="m-kick"><span class="m-ico" data-i="${sec.icon}">${this._icon(sec.icon)}</span><div class="kicker">Metric ${String(i + 1).padStart(2, '0')} · ${sec.nav}</div></div>
            <h2>${sec.name}: <span class="hl">${m.hl}</span></h2>
            <p class="lede">${sec.short || sec.verdict}</p>
            <div class="m-meta"><span class="m-date">${this._icon('clock')} Checked ${m.checked} · Tested against ${this._goldLc(sec)}</span></div>
          </header>
          <div class="m-card-chart">${table}</div>
          <div class="m-card-foot">
            <div class="takeaway"><span class="tk-ico">${this._icon('bulb')}</span><div class="tk-body"><span class="takeaway-k">What this means for you</span><p>${c.tip || c.insight}</p></div></div>
            <div class="deep m-links">${m.spoke ? this._renderToolRow(m.spoke, sec.icon) : ''}${more}${this._renderStudiesDrawer(sec)}</div>
          </div>
          </article>
        </div>
      </section>`;
  }

  _jumpTo(id) {
    const root = this.shadowRoot;
    const target = root.getElementById(id === 'compare' || id === 'metrics' ? id : 'm-' + id);
    if (!target) return;
    const nav = root.querySelector('.nav');
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - (nav ? nav.offsetHeight : 0) - 8, behavior: reduce ? 'auto' : 'smooth' });
  }

  // ── Brand cards: the short answer per brand ───────────────────────────

  get _brandVerdicts() {
    return {
      'apple-watch': 'The most accurate for workout heart rate and blood oxygen, second for steps and sleep stages, with the most FDA-cleared features (5).',
      'oura': 'The most accurate for everything measured overnight: sleep stages, sleep timing, HRV and resting heart rate. Nothing to show in the daytime.',
      'garmin': 'The most accurate for steps and VO2 max (with a chest strap), second for workout heart rate.',
      'whoop': 'Second for HRV and breathing rate, third for resting heart rate. No peer-reviewed test for anything in the daytime.',
      'fitbit': 'The least bad for calories and the only brand with an independent breathing rate test. Second for sleep timing and VO2 max.',
      'samsung': 'Second for blood oxygen and calories, third for steps. No test of the shipped feature for HRV, resting heart rate, VO2 max or breathing rate.',
      'polar': 'Second for overnight resting heart rate (2.71% error over the first four hours of sleep, Grit X Pro). Nothing else places: steps were 72% off in daily life and it produced no blood oxygen readings.'
    };
  }

  _medalSvg(m) {
    const C = { 1: ['#F4C542', '#C9971A', '#5C4300', '#2F6FB5', '#24578F'], 2: ['#E3E8EE', '#A3AFBD', '#334155', '#2F6FB5', '#24578F'], 3: ['#E8B48A', '#B97A47', '#5A3418', '#2F6FB5', '#24578F'] }[m];
    return `<svg viewBox="0 0 32 40" aria-hidden="true"><path d="M8 1h7l4 13h-7z" fill="${C[3]}"/><path d="M24 1h-7l-4 13h7z" fill="${C[4]}"/><circle cx="16" cy="25" r="13" fill="${C[0]}" stroke="${C[1]}" stroke-width="2"/><circle cx="16" cy="25" r="9" fill="none" stroke="${C[1]}" stroke-width="1" opacity=".55"/><text x="16" y="29.5" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="12.5" fill="${C[2]}">${m}</text></svg>`;
  }

  _renderBrandCards() {
    const sc = this._scorecard;
    const st = this._studies;
    const V = this._brandVerdicts;
    const devs = Object.entries(this._devices);
    const tone = lv => lv === 'strong' || lv === 'good' ? 'good' : lv === 'mixed' ? 'fair' : lv === 'weak' ? 'weak' : 'none';
    const word = { good: 'Good', fair: 'Fair', weak: 'Weak', none: 'No qualifying test' };
    // Scoreboard rows: the metric sections, with sleep split into two podiums (stages, timing), per the
    // "Most accurate by metric" tab of the Wearable Accuracy by Metric doc (20 Oct 2026).
    const metrics = this._sections.filter(s => s.id !== 'fda');
    const head = `<div class="sb-h sb-corner"><span>Metric</span></div>` + devs.map(([k, d]) => `<div class="sb-h">${this._logo(k)}<span class="sb-hn">${d.short}</span></div>`).join('');
    // Medals: one podium per metric, ranked on the numbers across every sub-measure of that metric.
    // Brand-funded studies count (footnoted in each section); research algorithms, preprints and
    // unpublished company tests do not. Breathing rate has only two qualifying brands; skin temperature none.
    const medals = {
      sleep: { oura: 1, 'apple-watch': 2, fitbit: 3 },
      sleepTiming: { oura: 1, fitbit: 2, 'apple-watch': 3 },
      hrv: { oura: 1, whoop: 2, garmin: 3 },
      rhr: { oura: 1, polar: 2, whoop: 3 },
      activeHr: { 'apple-watch': 1, garmin: 2, fitbit: 3 },
      spo2: { 'apple-watch': 1, samsung: 2, garmin: 3 },
      steps: { garmin: 1, 'apple-watch': 2, samsung: 3 },
      calories: { fitbit: 1, samsung: 2, 'apple-watch': 3 },
      vo2max: { garmin: 1, fitbit: 2, 'apple-watch': 3 },
      resp: { fitbit: 1, whoop: 2 }
    };
    const subs = {};
    const place = ['', 'Gold', 'Silver', 'Bronze'];
    const cell = (m, lv, name, d, x, tip) => {
      if (m) return `<div class="sb-c${x}"><span class="sb-medal m${m}" role="img" aria-label="${d.short}, ${name}: ${place[m]}" title="${place[m]}">${this._medalSvg(m)}</span></div>`;
      const t = tone(lv);
      const lab = t === 'none' && tip ? tip : word[t];
      return `<div class="sb-c${x}"><span class="sb-g sb-${t}" role="img" aria-label="${d.short}, ${name}: ${lab}" title="${lab}"></span></div>`;
    };
    const rows = metrics.map(sec => `<div class="sb-lab">${this._icon(sec.icon)}<span>${sec.nav}</span></div>`
      + devs.map(([k, d]) => cell(medals[sec.id] && medals[sec.id][k], sc[sec.id][k][0], sec.name, d, '', sc[sec.id][k][1])).join('')
      + (subs[sec.id] || []).map(([id, name, m, g]) => `<div class="sb-lab sb-sub"><span>${name}</span></div>` + devs.map(([k, d]) => cell(m[k], g[k] || 'none', name, d, ' sb-xs')).join('')).join('')).join('');
    const fda = `<div class="sb-lab">${this._icon('shieldPlus')}<span>FDA-cleared</span></div>` + devs.map(([k, d]) => { const n = this._fdaCounts[k]; return k in this._fdaCounts ? `<div class="sb-c"><span class="pill-n ${n ? 'fair' : 'zero'}">${n}</span></div>` : `<div class="sb-c"><span class="sb-g sb-none" role="img" aria-label="${d.short}, FDA-cleared: Not checked" title="Not checked"></span></div>`; }).join('');
    const buy = `<div class="sb-lab sb-buy-lab"><span>Buy</span></div>` + devs.map(([k, d]) => { const l = d.affiliateLinks[0]; return `<div class="sb-c"><a class="sb-buy" href="${l.url}" target="_blank" rel="sponsored nofollow noopener" data-action="affiliate-click" data-track-label="${l.slug}" data-track-position="scoreboard" aria-label="View ${d.short} on Amazon">Amazon</a></div>`; }).join('');
    const detail = devs.map(([k, d]) => `
      <div class="sbd">
        <div class="sbd-head">${this._logo(k, 'sm')}<strong>${d.name}</strong></div>
        <p class="bc-verdict">${V[k] || ''}</p>
        <div class="dev-finding"><span class="dev-label">Where it leads</span><ul class="dev-list">${d.strengths.map(s => `<li>${s}</li>`).join('')}</ul></div>
        <div class="dev-finding alt"><span class="dev-label">Where it falls short</span><ul class="dev-list">${d.weaknesses.map(s => `<li>${s}</li>`).join('')}</ul></div>
        ${d.researchNote ? `<p class="dev-note">${this._icon('info')}<span>${d.researchNote}</span></p>` : ''}
        <p class="dev-meta"><strong>Subscription</strong> ${d.subscription} · <strong>Studies</strong> ${d.studyIds.filter(id => st[id]).map(id => { const s = st[id]; return s.authors.split(',')[0].replace(/ et al\.?$/, '').replace(/\s+[A-Z]{1,3}$/, '') + ' ' + s.year; }).join(', ')}</p>
      </div>`).join('');
    return `
      <div class="sb-card" data-sb-card><div class="sb" style="--sb-n:${devs.length}">${head}${rows}${fda}${buy}</div>
      <div class="sb-under">
        <div class="sb-legend"><span><span class="sb-medals"><i class="sb-medal m1">${this._medalSvg(1)}</i><i class="sb-medal m2">${this._medalSvg(2)}</i><i class="sb-medal m3">${this._medalSvg(3)}</i></span>Top three</span><span><i class="sb-g sb-good"></i>Good</span><span><i class="sb-g sb-fair"></i>Fair</span><span><i class="sb-g sb-weak"></i>Weak</span><span><i class="sb-g sb-none"></i>Not tested, or no qualifying test</span></div>
        <p class="sb-rule">One podium per metric, ranked on the numbers across every measure of that metric (sleep is two: telling stages apart, and knowing when you were asleep). Brand-funded studies count and are flagged in each section; research algorithms and unpublished company tests do not. Calories medals mean least bad: no brand came within 9% on the max treadmill test. Breathing rate has only two qualifying brands, and no brand has an independent skin temperature test.</p>
      </div></div>
      <details class="deep-item sb-more"><summary><span class="dk-lab"><span class="dk-ico">${this._icon('fileText')}</span>Each brand in detail</span><span class="deep-hint">Strengths, gaps, subscription and studies</span>${this._icon('plus')}</summary><div class="deep-body"><div class="sbd-grid">${detail}</div></div></details>`;
  }

  // ── Main render ───────────────────────────────────────────────────────

  // ── Report band · State of Wearable Accuracy 2026 (hub only) ───────────
  // The email-gate offer, a full-width band after the scoreboard and before the
  // first metric section (canvas artboards GateTools + GateMobile). The link is
  // untagged on purpose: internal UTMs would overwrite the visitor's real source.
  // Clicks fire the GA4 event gate_hub (_trackGate, wired in _wire).
  _renderReportBand() {
    const cover = 'https://kygo-health.github.io/kygo-elements/assets/sowa/sowa-cover.webp';
    return `
      <style>
      .kr-section{padding:8px 20px 12px;background:var(--kygo-light,var(--light,#F8FAFC))}
      @media(min-width:720px){.kr-section{padding:16px 24px 20px}}
      .kr-inner{max-width:1100px;margin:0 auto}
      .kr-card{display:flex;flex-direction:column;gap:20px;padding:22px;border:1.5px solid #E2E8F0;border-radius:20px;background:#fff;box-shadow:0 8px 24px rgba(15,23,42,.06);color:#0F172A}
      @media(min-width:720px){.kr-card{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:28px;align-items:center;padding:28px}}
      .kr-copy{display:flex;flex-direction:column;align-items:flex-start;gap:8px}
      .kr-eyebrow{margin:0;font-family:'Space Grotesk',sans-serif;font-size:11.5px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#15803D}
      .kr-title{margin:0;font-family:'Space Grotesk',sans-serif;font-size:22px;line-height:1.15;font-weight:700;letter-spacing:-.01em;color:#0F172A}
      @media(min-width:720px){.kr-title{font-size:28px}}
      .kr-sub{margin:0;font-size:15px;line-height:1.5;color:#475569}
      @media(min-width:720px){.kr-sub{max-width:40ch}}
      .kr-btn{margin-top:8px;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 18px;border-radius:10px;background:#22C55E;color:#0F172A;font-size:15px;font-weight:700;text-decoration:none;transition:background .2s}
      .kr-btn:hover{background:#4ADE80;color:#0F172A}
      .kr-btn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
      .kr-cover{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:12px;box-shadow:0 12px 28px rgba(15,23,42,.18);background:#0F172A}
      </style>
      <section class="kr-section" id="free-report">
        <div class="kr-inner">
          <aside class="kr-card" aria-label="Free report">
            <div class="kr-copy">
              <p class="kr-eyebrow">Free report</p>
              <h2 class="kr-title">Take every ranking on this page with you</h2>
              <p class="kr-sub">The State of Wearable Accuracy 2026 puts all eleven metrics into one 78-page PDF, with brand profiles and a buyer's guide by goal.</p>
              <p class="kr-sub">Free. 71 peer-reviewed studies, no brand funding, every figure from the paper's own tables.</p>
              <a class="kr-btn" href="https://www.kygo.app/state-of-wearable-accuracy" data-gate="gate_hub" data-track-position="hub-band" data-track-label="report-gate">Get the free report<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
            </div>
            <img class="kr-cover" src="${cover}" alt="Report cover: State of Wearable Accuracy 2026" width="1280" height="720" loading="lazy" decoding="async" />
          </aside>
        </div>
      </section>`;
  }

  /** GA4 click event for a report gate placement (gate_hub here). Uses gtag when
   *  kygo-tracking.js has defined it, else queues the event on the dataLayer. */
  _trackGate(name) {
    const params = { cta_url: 'https://www.kygo.app/state-of-wearable-accuracy', component: 'kygo-wearable-accuracy', position: 'hub-band', page_path: window.location.pathname };
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, params);
      else (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: name }, params));
    } catch (e) { /* tracking must never block the link */ }
  }

  // ── Kygo Picks card · shared <kygo-picks-card> ───────────────────────────
  // The /best-wearables promo (all card), placed right after this tool's buy
  // buttons. Its links carry data-action="related-tool", so kygo-tracking.js files
  // every click in GA4 as a cta_click (related_tool_click, to_tool best-wearables).
  _renderPicksCard() {
    __ensureKygoPicksCard();
    return `
      <style>
      .kp-wrap{margin:32px 0 0}
      .kp-wrap kygo-picks-card{display:block}
      .kp-hub{margin:14px 0 0;font-size:14px;line-height:1.5;color:#475569}
      .kp-hub a{color:#16A34A;font-weight:600;text-decoration:underline;text-underline-offset:3px}
      .kp-hub a:hover{color:#0F172A}
      </style>
      <div class="kp-wrap">
        <kygo-picks-card focus="all" slug="wearable-accuracy"></kygo-picks-card>
      </div>`;
  }

  render() {
    const hs = this._heroStats;
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand" target="_blank" rel="noopener"><img src="${logoUrl}" alt="Kygo" loading="lazy" /><span>Kygo Health</span></a>
          <div class="nav-cta-group"><kygo-cta mini slug="${this._appCta().slug}-subnav" surface="tool"></kygo-cta></div>
        </div>
      </header>

      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill"><span class="dot"></span> UPDATED ${this._updated.page.toUpperCase()} · ${hs.devices} BRANDS · 10 METRICS + FDA</div>
              <h1>Which wearable is <span class="hl">actually accurate?</span></h1>
              <p class="hero-lede">We read ${hs.studies} validation studies and ${hs.fda} FDA records on Oura, Apple Watch, Garmin, WHOOP, Fitbit, Samsung and Polar. <strong>No device wins everywhere</strong>, so compare the ones you're considering on the metrics you care about.</p>
            </div>
            ${this._renderHeroPanel()}
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">${hs.independent}</div><div class="lbl">Independent studies, no brand money</div></div>
            <div class="hero-stat"><div class="num">${hs.fundedStudies}</div><div class="lbl">Brand-funded studies, flagged</div></div>
            <div class="hero-stat"><div class="num">${hs.recent}</div><div class="lbl">Published in 2025 or 2026</div></div>
            <div class="hero-stat"><div class="num">115%</div><div class="lbl">Worst calorie error in a 2026 lab test</div></div>
          </div>
        </div>
      </section>

      <section class="section bg-light cx-sec" id="compare">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Build your comparison</div>
            <h2>Compare wearables <span class="hl">head-to-head.</span></h2>
            <p class="lede">Pick two brands and see every metric side by side. Open any metric for the full chart.</p>
          </div>
          <div class="animate-on-scroll" data-cmpr>${this._renderComparator()}</div>
        </div>
      </section>
      ${this._renderAppCta()}

      <section class="section bg-light" id="brands">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The short answer</div>
            <h2>Each brand wins something, <span class="hl">none wins everything.</span></h2>
            <p class="lede">How each brand graded on every metric, from peer-reviewed studies with funding flagged. Every device is weak on calories, and the newest models are mostly untested.</p>
          </div>
          <div class="animate-on-scroll">${this._renderBrandCards()}</div>
          <p class="aff-disclosure animate-on-scroll">${this._icon('info')} <span>The Amazon links are affiliate links. As an Amazon Associate, Kygo Health earns from qualifying purchases, at no extra cost to you.</span></p>
          ${this._renderPicksCard()}
        </div>
      </section>


      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">True for every device</div>
            <h2>What no brand <span class="hl">can fix.</span></h2>
            <p class="lede">Six findings that hold across every wearable here. Read these before you trust any single number.</p>
          </div>
          <div class="animate-on-scroll">${this._renderFactCards()}</div>
        </div>
      </section>

      ${this._renderReportBand()}

      <section class="section bg-light jn-sec" id="metrics">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The metrics</div>
            <h2>Ten metrics plus FDA, <span class="hl">one section each.</span></h2>
            <p class="lede">The verdict, every brand against the lab gold standard, and who funded each study. Jump to the one you care about.</p>
          </div>
          <div class="animate-on-scroll">${this._renderJumpNav()}</div>
        </div>
      </section>

      ${this._sections.slice(0, 5).map((s, i) => this._renderMetricSection(s, i)).join('')}

      ${this._renderEmailCta('gray')}

      ${this._sections.slice(5).map((s, i) => this._renderMetricSection(s, i + 5)).join('')}

      ${this._renderRelatedTools('gray')}

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll"><div class="kicker">FAQ</div><h2>Common <span class="hl">questions.</span></h2></div>
          <div class="faq">${this._renderFAQ()}</div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every claim, <span class="hl">traceable.</span></h2>
            <p class="lede">${hs.studies} validation studies, ${hs.fda} FDA records and a few manufacturer documents, each labelled with who funded it. Last updated ${this._updated.page}.</p>
          </div>
          <div class="sources-wrap animate-on-scroll">${this._renderSources()}</div>
        </div>
      </section>

      ${this._renderRelatedPosts('white')}

      <footer class="tool-footer">
        <div class="container">
          <a href="https://www.kygo.app" class="footer-brand" target="_blank" rel="noopener"><img src="${logoUrl}" alt="Kygo Health" class="footer-logo" loading="lazy" /><span>Kygo Health</span></a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <div class="footer-links">
            <a href="https://www.kygo.app">Home</a>
            <a href="https://www.kygo.app/how-it-works">How It Works</a>
            <a href="https://www.kygo.app/blog">Blog</a>
            <a href="https://www.kygo.app/contact">Contact</a>
            <a href="https://www.kygo.app/privacy-policy">Privacy</a>
            <a href="https://www.kygo.app/terms-conditions">Terms</a>
          </div>
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Wearable readings are estimates, not clinical measurements. Consult a qualified healthcare provider before making health decisions based on wearable data.</p>
          <p class="footer-copyright">Data from peer-reviewed validation studies, preprints, FDA records and manufacturer documentation. Last updated ${this._updated.page}.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases. Product links on this page are affiliate links; we may earn a commission at no extra cost to you.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>

    `;
  }

  // ── Styles: kygo-sleep-tracker-accuracy design system + additions ─────

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
      .nav-cta-group { margin-left:auto; display:inline-flex; align-items:center; gap:8px; }
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
      .hero-vis { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 14px; background: linear-gradient(158deg, #ffffff 0%, #EEF2F7 100%); border: 1px solid var(--border-subtle); border-radius: 20px; padding: 18px 20px 20px; box-shadow: 0 16px 40px rgba(15,23,42,0.08); }
      .hero-vis::before { content: ''; position: absolute; top: -90px; right: -70px; width: 240px; height: 240px; background: radial-gradient(closest-side, rgba(34,197,94,0.16), transparent); pointer-events: none; }
      .hero-vis-head { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
      .hero-vis-title { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: var(--fg-3); }
      .hero-vis-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 0 3px rgba(34,197,94,0.18); flex: none; }
      .hero-vis-tag { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.3px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
      .hv-two { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px; }
      .hv-col { display: flex; flex-direction: column; align-items: center; gap: 9px; text-align: center; padding: 12px 6px; }
      .hv-col + .hv-col { border-left: 1px solid var(--border-subtle); }
      .hv-label { font-family: var(--font-display); font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: var(--fg-2); }
      .hv-val { font-family: var(--font-display); font-weight: 700; font-size: clamp(34px, 7vw, 46px); line-height: 1; letter-spacing: -0.02em; color: var(--fg-2); }
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
      .lede { color: var(--fg-2); font-size: 16px; line-height: 1.55; max-width: 62ch; margin: 0; }
      .lede strong { color: var(--fg-1); font-weight: 600; }

      /* Population module (stacks on mobile, 2-up on wider screens) */
      .bias { display: grid; grid-template-columns: 1fr; gap: 12px; }
      @media (min-width: 620px) { .bias { grid-template-columns: 1fr 1fr; } }
      .bias-card { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 4px; }
      .bias-card.good { border-color: var(--kygo-green); box-shadow: 0 8px 24px rgba(34,197,94,0.10); }
      .bias-tag { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-display); font-weight: 600; font-size: 12px; color: var(--fg-2); }
      .bias-tag .ico { width: 14px; height: 14px; color: var(--fg-3); }
      .bias-card.good .bias-tag .ico { color: var(--kygo-green-dark); }
      .bias-stat { font-family: var(--font-display); font-weight: 700; font-size: clamp(24px, 6vw, 36px); line-height: 1.05; letter-spacing: -0.02em; color: var(--fg-2); margin-top: 6px; }
      .bias-card.good .bias-stat { color: var(--kygo-green-dark); }
      .bias-stat small { font-size: 12px; font-weight: 500; color: var(--fg-3); }
      .bias-cap { font-family: var(--font-display); font-weight: 600; font-size: 11px; letter-spacing: 0.2px; text-transform: uppercase; color: var(--fg-3); }
      .bias-card.good .bias-cap { color: var(--kygo-green-dark); }
      .bias-card p { margin: 6px 0 0; font-size: 13px; line-height: 1.5; color: var(--fg-2); }
      .bias-note { grid-column: 1 / -1; display: flex; gap: 10px; align-items: flex-start; margin: 2px 0 0; font-size: 13px; line-height: 1.55; color: var(--fg-2); background: #fff; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 14px 16px; }
      .bias-note .ico { width: 16px; height: 16px; color: var(--kygo-green-dark); flex: none; margin-top: 2px; }
      .bias-note strong { color: var(--fg-1); font-weight: 600; }
      .bias-note em { font-style: normal; color: var(--fg-3); font-size: 12px; }

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

      /* ── Comparison matrix (logo chart) ───────────────────────────────── */
      .cmp { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; overflow: hidden; }
      @media (min-width: 768px) { .cmp { border-radius: 22px; } }
      .cmp-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      @media (min-width: 768px) { .cmp-scroll { overflow-x: visible; } }
      .cmp-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 560px; }
      .cmp-table th, .cmp-table td { padding: 0; vertical-align: middle; }
      .cmp-table thead th { font-family: var(--font-display); font-weight: 700; font-size: 10.5px; letter-spacing: 0.4px; text-transform: uppercase; color: #334155; text-align: center; padding: 12px 6px; border-bottom: 1px solid #CBD5E1; white-space: nowrap; background: #E2E8F0; }
      .cmp-table thead .cmp-th-device { text-align: left; padding-left: 14px; position: sticky; left: 0; z-index: 3; background: #E2E8F0; }
      .th-full { display: none; } .th-short { display: inline; }
      @media (min-width: 768px) {
        .th-full { display: inline; } .th-short { display: none; }
        .cmp-table thead th { font-size: 11px; padding: 14px 8px; }
      }
      .cmp-table tbody tr + tr td, .cmp-table tbody tr + tr th { border-top: 1px solid var(--border-subtle); }
      .cmp-table tbody tr:hover td, .cmp-table tbody tr:hover .cmp-td-device { background: var(--bg-surface); }
      .cmp-td-device { padding: 10px 6px; width: 108px; min-width: 108px; text-align: left; background: #fff; position: sticky; left: 0; z-index: 1; box-shadow: 1px 0 0 var(--border-subtle); }
      .brand { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; }
      .brand-img { width: 38px; height: 38px; border-radius: 9px; background: var(--bg-raised); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
      .brand-img img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
      .brand-img.brand-img--icon { color: var(--fg-3); }
      .brand-img.brand-img--icon .ico { width: 18px; height: 18px; }
      .brand-img.sm { width: 34px; height: 34px; border-radius: 8px; }
      .brand-text { display: flex; flex-direction: column; min-width: 0; }
      .brand-name { font-family: var(--font-display); font-weight: 600; font-size: 11px; color: var(--fg-1); line-height: 1.2; overflow-wrap: anywhere; word-break: break-word; max-width: 92px; }
      @media (min-width: 768px) {
        .cmp-td-device { padding: 12px 14px 12px 8px; width: auto; min-width: 210px; position: static; box-shadow: none; }
        .brand { flex-direction: row; align-items: center; gap: 12px; text-align: left; }
        .brand-img { width: 42px; height: 42px; border-radius: 11px; }
        .brand-img.sm { width: 42px; height: 42px; border-radius: 11px; }
        .brand-name { font-size: 15px; max-width: none; }
      }
      .cmp-table tbody td { text-align: center; padding: 10px 6px; }
      @media (min-width: 768px) { .cmp-table tbody td { padding: 12px 8px; } }
      .mk { display: inline-flex; align-items: center; justify-content: center; min-width: 24px; height: 24px; border-radius: 50%; }
      .mk.off { background: var(--bg-raised); }
      .mk .dash { display: block; width: 9px; height: 2px; border-radius: 1px; background: var(--fg-3); }
      .vpill { display: inline-flex; align-items: center; font-family: var(--font-display); font-size: 11.5px; font-weight: 600; padding: 4px 11px; border-radius: 999px; white-space: nowrap; }
      .vpill.good { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .vpill.mid { background: var(--bg-raised); color: var(--fg-2); }
      .vpill.dark { background: var(--kygo-dark); color: #fff; }
      .amz-link { display: inline-flex; align-items: center; gap: 3px; font-family: var(--font-display); font-weight: 600; font-size: 11px; color: var(--kygo-green-dark); white-space: nowrap; }
      .amz-link .ico { width: 11px; height: 11px; transition: transform .15s; }
      .amz-link:hover { color: var(--kygo-green); }
      .amz-link:hover .ico { transform: translateX(2px); }
      .cell-note { display: block; margin-top: 4px; font-size: 9.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; color: var(--fg-3); }
      .cmp-legend { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; margin: 0; padding: 12px 16px 14px; font-size: 12px; line-height: 1.55; color: var(--fg-3); }
      .cmp-legend .ico { width: 13px; height: 13px; color: var(--kygo-green-dark); background: var(--kygo-green-light); border-radius: 50%; padding: 2px; box-sizing: content-box; flex: none; }
      .cmp-legend strong { color: var(--fg-2); font-weight: 600; }
      .cmp-legend .lg-good { color: var(--kygo-green-dark); font-weight: 600; }

      /* ── Interactive comparator ──────────────────────────────────────── */
      .cmpr { display: flex; flex-direction: column; gap: 16px; }
      .cmpr-picker-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 12px; }
      .cmpr-picker-title { font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--fg-1); }
      .cmpr-picker-hint { font-size: 12px; color: var(--fg-3); }
      .picker { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; background: var(--bg-raised); border: 1px solid var(--border-subtle); border-radius: 16px; padding: 10px; }
      @media (min-width: 480px) { .picker { grid-template-columns: repeat(4, 1fr); } }
      @media (min-width: 860px) { .picker { grid-template-columns: repeat(7, 1fr); } }
      .pick-tile { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 12px; padding: 12px 6px 10px; cursor: pointer; transition: all .15s ease; font-family: var(--font-display); }
      .pick-tile:hover { border-color: var(--fg-3); }
      .pick-tile .brand-img.sm { width: 34px; height: 34px; border-radius: 8px; }
      .pick-name { font-weight: 600; font-size: 11.5px; color: var(--fg-1); line-height: 1.2; text-align: center; overflow-wrap: anywhere; }
      .pick-check { position: absolute; top: 6px; right: 6px; width: 18px; height: 18px; border-radius: 50%; background: var(--kygo-green); color: #fff; display: none; align-items: center; justify-content: center; }
      .pick-check .ico { width: 10px; height: 10px; }
      .pick-tile.active { border-color: var(--kygo-green); background: rgba(34,197,94,0.06); box-shadow: 0 0 0 3px rgba(34,197,94,0.10); }
      .pick-tile.active .pick-name { color: var(--kygo-green-dark); }
      .pick-tile.active .pick-check { display: inline-flex; }

      .cr-wrap { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; overflow: hidden; }
      @media (min-width: 768px) { .cr-wrap { border-radius: 22px; } }
      .cr-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .cr-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 440px; }
      .cr-table th, .cr-table td { padding: 11px 7px; text-align: center; vertical-align: middle; }
      .cr-table thead th { background: #E2E8F0; border-bottom: 1px solid #CBD5E1; }
      .cr-table thead th.cr-corner { text-align: left; font-family: var(--font-display); font-weight: 700; font-size: 10px; letter-spacing: .4px; text-transform: uppercase; color: #334155; position: sticky; left: 0; z-index: 3; background: #E2E8F0; }
      .cr-dev { display: flex; flex-direction: column; align-items: center; gap: 5px; }
      .cr-dev .brand-img.sm { width: 30px; height: 30px; border-radius: 8px; }
      .cr-dev-name { font-family: var(--font-display); font-weight: 600; font-size: 11.5px; color: var(--fg-1); line-height: 1.15; }
      .cr-table tbody tr + tr th, .cr-table tbody tr + tr td { border-top: 1px solid var(--border-subtle); }
      .cr-table tbody th { text-align: left; position: sticky; left: 0; z-index: 1; background: #fff; box-shadow: 1px 0 0 var(--border-subtle); width: 116px; min-width: 116px; }
      .cr-metric { display: block; font-family: var(--font-body); font-weight: 600; font-size: 12px; color: var(--fg-1); line-height: 1.25; }
      .cr-unit { display: block; margin-top: 2px; font-size: 10px; color: var(--fg-3); }
      .cr-dir { display: none; margin-top: 3px; font-family: var(--font-display); font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: .3px; color: var(--kygo-green-dark); }
      .cr-table tbody td .vpill { font-size: 11px; padding: 4px 9px; }
      @media (min-width: 768px) {
        .cr-table { min-width: 560px; }
        .cr-table th, .cr-table td { padding: 12px 10px; }
        .cr-table thead th.cr-corner { font-size: 10.5px; }
        .cr-dev .brand-img.sm { width: 34px; height: 34px; }
        .cr-dev-name { font-size: 12px; }
        .cr-table tbody th { width: 168px; min-width: 168px; }
        .cr-metric { font-size: 13px; }
        .cr-unit { font-size: 10.5px; }
        .cr-dir { display: block; }
      }
      .cr-table tbody td .vpill { min-width: 0; }
      .cr-table .vpill .ico { width: 11px; height: 11px; margin-left: 4px; }
      .cr-verdict { display: flex; gap: 12px; align-items: flex-start; background: var(--kygo-green-light); border: 1px solid rgba(34,197,94,0.28); border-radius: 14px; padding: 14px 16px; font-size: 13.5px; line-height: 1.55; color: var(--fg-1); }
      .cr-verdict .ico { width: 18px; height: 18px; color: var(--kygo-green-dark); flex: none; margin-top: 1px; }
      .cr-verdict strong { color: var(--kygo-green-dark); font-weight: 700; }
      .cmpr-empty { display: flex; gap: 10px; align-items: center; justify-content: center; background: #fff; border: 1.5px dashed var(--border-subtle); border-radius: 16px; padding: 28px 20px; color: var(--fg-3); font-size: 14px; text-align: center; }
      .cmpr-empty .ico { width: 18px; height: 18px; color: var(--kygo-green-dark); flex: none; }

      /* Device detail accordion (one row per wearable, click to expand) */
      .dev-acc { display: grid; grid-template-columns: 1fr; gap: 10px; align-items: start; }
      @media (min-width: 768px) { .dev-acc { grid-template-columns: 1fr 1fr; gap: 12px; } }
      .dacc { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; overflow: hidden; transition: border-color .2s, box-shadow .2s; }
      .dacc.is-validated { border-color: rgba(34,197,94,0.40); }
      .dacc[open] { box-shadow: var(--shadow-md); border-color: var(--kygo-green); }
      .dacc > summary { list-style: none; cursor: pointer; display: flex; align-items: center; gap: 12px; padding: 12px 14px; }
      .dacc > summary::-webkit-details-marker { display: none; }
      .dacc > summary:hover { background: var(--bg-surface); }
      .dacc .brand-img.sm { width: 40px; height: 40px; border-radius: 10px; flex: none; }
      .dacc-id { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
      .dacc-name { font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); line-height: 1.2; }
      .dacc-sub { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
      .dacc-chev { color: var(--fg-3); flex: none; }
      .dacc-chev .ico { width: 16px; height: 16px; transition: transform .2s; }
      .dacc[open] .dacc-chev .ico { transform: rotate(90deg); color: var(--kygo-green-dark); }
      .dacc-body { padding: 0 14px 16px; display: flex; flex-direction: column; gap: 12px; }
      .dev-finding { background: var(--bg-surface); border-radius: 12px; padding: 12px 14px; margin-top: 4px; }
      .dev-finding.alt { background: #fff; border: 1px solid var(--border-subtle); margin-top: 0; }
      .dev-label { font-family: var(--font-display); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--fg-3); }
      .dev-finding p { margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: var(--fg-1); }
      .dev-finding.alt p { color: var(--fg-2); }
      .dmetrics { display: grid; grid-template-columns: 1fr; gap: 8px; }
      @media (min-width: 460px) { .dmetrics { grid-template-columns: 1fr 1fr; } }
      .dmetric { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 11px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
      .dm-lbl { font-family: var(--font-display); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: var(--fg-3); }
      .dm-vals { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
      .dm-tag { font-family: var(--font-display); font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; color: var(--fg-3); }
      .dm-none { font-size: 11.5px; color: var(--fg-3); }
      .dm-note { font-size: 10.5px; line-height: 1.4; color: var(--fg-3); }
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
      .aff-disclosure { display: flex; gap: 10px; align-items: flex-start; margin: 20px 0 0; font-size: 12.5px; line-height: 1.55; color: var(--fg-3); font-style: italic; }
      .aff-disclosure .ico { width: 15px; height: 15px; color: var(--kygo-green-dark); flex: none; margin-top: 2px; }

      /* Fact cards (fixed facts) */
      .sig-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
      @media (min-width: 620px) { .sig-grid { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 1000px) { .sig-grid { grid-template-columns: repeat(3, 1fr); } }
      .sig-card { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 8px; }
      .sig-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
      .fact-ico { width: 34px; height: 34px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; }
      .fact-ico .ico { width: 17px; height: 17px; }
      .fact-ico.tone-good { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .fact-ico.tone-mid { background: var(--bg-raised); color: var(--fg-2); }
      .fact-ico.tone-dark { background: var(--kygo-dark); color: #fff; }
      .sig-rank { font-family: var(--font-display); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: var(--fg-3); }
      .sig-name { font-family: var(--font-display); font-weight: 600; font-size: 15px; margin: 2px 0 0; line-height: 1.3; color: var(--fg-1); }
      .sig-find { margin: 0; font-size: 13px; line-height: 1.55; color: var(--fg-2); }
      .sig-src { margin-top: auto; padding-top: 8px; font-size: 11.5px; color: var(--fg-3); border-top: 1px solid var(--border-subtle); }

      /* Bottom line */
      .bottomline { background: var(--kygo-dark); color: rgba(255,255,255,0.82); border-radius: 22px; padding: 32px 26px; position: relative; overflow: hidden; }
      @media (min-width: 720px) { .bottomline { padding: 44px 40px; } }
      .bottomline::before { content: ''; position: absolute; top: -120px; right: -120px; width: 360px; height: 360px; background: radial-gradient(closest-side, rgba(34,197,94,0.22), transparent); pointer-events: none; }
      .bottomline-tag { position: relative; display: inline-flex; font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: #6EE7A0; background: rgba(34,197,94,0.14); border: 1px solid rgba(34,197,94,0.25); padding: 6px 12px; border-radius: 999px; margin-bottom: 18px; }
      .bottomline p { position: relative; font-size: clamp(15px, 1.8vw, 18px); line-height: 1.65; margin: 0 0 14px; }
      .bottomline strong { color: #fff; font-weight: 600; }
      .bottomline em { font-style: italic; color: #fff; }

      /* Blog CTA */

      /* FAQ */
      .faq { display: flex; flex-direction: column; gap: 10px; }
      .faq details { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; padding: 4px 20px; transition: border-color .2s; }
      .faq details[open] { border-color: var(--kygo-green); }
      .faq summary { list-style: none; padding: 16px 0; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 14px; }
      .faq summary::-webkit-details-marker { display: none; }
      .faq summary::after { content: '+'; color: var(--kygo-green-dark); font-weight: 600; font-size: 22px; transition: transform .2s; line-height: 1; }
      .faq details[open] summary::after { content: '−'; }
      .faq .body { padding: 0 0 16px; color: var(--fg-2); font-size: 14px; line-height: 1.65; }


      /* Sources · Kygo standard module */
      .sources { display: grid; grid-template-columns: 1fr; gap: 8px; }
      @media (min-width: 600px) { .sources { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 960px) { .sources { grid-template-columns: repeat(3, 1fr); } }
      .src { display: flex; flex-direction: column; gap: 4px; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 12px; padding: 12px 14px; text-decoration: none; transition: border-color .15s, box-shadow .15s; }
      a.src:hover { border-color: var(--kygo-green); box-shadow: 0 4px 14px rgba(15,23,42,.08); }
      .src--nolink { background: var(--bg-surface); border-style: dashed; }
      .src-tag { align-self: flex-start; font-family: var(--font-display); font-size: 9.5px; font-weight: 700; letter-spacing: .4px; text-transform: uppercase; color: var(--kygo-green-dark); }
      .src--nolink .src-tag { color: var(--fg-3); }
      .src-title { font-family: var(--font-display); font-weight: 600; font-size: 13.5px; color: var(--fg-1); line-height: 1.3; overflow-wrap: anywhere; }
      a.src:hover .src-title { color: var(--kygo-green-dark); }
      .src-cite { display: inline-flex; align-items: baseline; gap: 5px; flex-wrap: wrap; font-size: 11.5px; color: var(--fg-3); line-height: 1.35; overflow-wrap: anywhere; }
      .src-go { display: inline-flex; align-self: center; flex-shrink: 0; color: var(--kygo-green-dark); }
      .src-go svg { width: 12px; height: 12px; transition: transform .15s; }
      a.src:hover .src-go svg { transform: translate(1px,-1px); }
      .sources.src-extra { margin-top: 8px; }
      .sources.src-extra[hidden] { display: none; }
      .src-toggle-wrap { text-align: center; margin-top: 16px; }
      .src-toggle { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 999px; border: 1.5px solid var(--border-subtle); background: #fff; color: var(--kygo-green-dark); font-family: var(--font-display); font-weight: 600; font-size: 13px; cursor: pointer; transition: border-color .15s, box-shadow .15s; }
      .src-toggle:hover { border-color: var(--kygo-green); box-shadow: 0 4px 14px rgba(15,23,42,.08); }
      .src-toggle svg { width: 14px; height: 14px; transition: transform .2s; }
      .src-toggle.open svg { transform: rotate(90deg); }

      /* Footer */
      .tool-footer { padding: 56px 20px 40px; background: #fff; color: var(--fg-2); border-top: 1px solid var(--border-subtle); }
      .tool-footer .container { max-width: 720px; margin: 0 auto; text-align: center; padding: 0; }
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
    
      /* ── Wearable-accuracy additions (same system) ───────────────────── */
      .vpill.line { background: #fff; color: var(--fg-2); box-shadow: inset 0 0 0 1px #CBD5E1; }
      .cell { display: inline-flex; flex-direction: column; align-items: center; gap: 5px; }
      .cell-note { display: block; font-family: var(--font-display); font-size: 9.5px; font-weight: 600; letter-spacing: .3px; text-transform: uppercase; color: var(--fg-3); line-height: 1.3; max-width: 150px; }
      .mini-bar { display: block; width: 72px; height: 4px; border-radius: 99px; background: var(--bg-raised); overflow: hidden; }
      .mini-bar span { display: block; height: 100%; width: var(--w); border-radius: inherit; background: var(--kygo-green); }
      .brand-model { display: block; font-family: var(--font-body); font-weight: 500; font-size: 10.5px; color: var(--fg-3); }
      @media (min-width: 768px) { .brand-model { display: inline; font-size: 12.5px; margin-left: 4px; } }
      @media (min-width: 860px) { .picker.picker-6 { grid-template-columns: repeat(6, 1fr); } }
      .cr-table button.cr-dir { display: inline-flex; align-items: center; gap: 4px; background: none; border: 0; padding: 0; cursor: pointer; }
      .cr-table button.cr-dir .ico { width: 10px; height: 10px; }
      .cr-table button.cr-dir:hover { text-decoration: underline; }
      .cr-none { font-size: 11px; color: var(--fg-3); }

      /* Hero: best-result list */
      .hw { position: relative; display: flex; flex-direction: column; }
      .hw-row { display: grid; grid-template-columns: 1fr auto 80px; gap: 12px; align-items: center; padding: 9px 2px; border-top: 1px solid var(--border-subtle); }
      .hw-row:first-child { border-top: 0; }
      .hw-metric { font-size: 13px; color: var(--fg-2); }
      .hw-dev { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 13px; color: var(--fg-1); }
      .hw-dev .brand-img.sm { width: 26px; height: 26px; border-radius: 7px; }
      .hw-val { text-align: right; font-family: var(--font-display); font-weight: 600; font-size: 13px; color: var(--kygo-green-dark); }

      /* Metric explorer */
      .mx-tabs { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; padding: 2px 2px 14px; margin: 0 -2px; }
      .mx-tabs::-webkit-scrollbar { display: none; }
      .mx-tab { flex: none; font-family: var(--font-display); font-weight: 600; font-size: 13px; color: var(--fg-2); background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 999px; padding: 8px 15px; cursor: pointer; transition: all .15s ease; }
      .mx-tab:hover { border-color: var(--fg-3); color: var(--fg-1); }
      .mx-tab.active { background: var(--kygo-dark); border-color: var(--kygo-dark); color: #fff; }
      .mx-tab:focus-visible, .pick-tile:focus-visible, .deep-item summary:focus-visible { outline: 2px solid var(--kygo-green); outline-offset: 2px; }
      .mx-panel { display: flex; flex-direction: column; gap: 14px; opacity: 0; transform: translateY(6px); transition: opacity .35s var(--ease-out), transform .35s var(--ease-out); }
      .mx-panel.in { opacity: 1; transform: none; }
      .mx-head { padding: 4px 2px 2px; }
      .mx-head h3 { font-family: var(--font-display); font-weight: 600; font-size: clamp(20px, 3vw, 26px); margin: 0 0 6px; letter-spacing: -0.01em; }
      .mx-head p { margin: 0; font-size: 15px; line-height: 1.6; color: var(--fg-2); max-width: 72ch; }
      .mx-insight a { display: inline-flex; align-items: center; gap: 4px; color: var(--kygo-green-dark); font-weight: 600; }
      .mx-insight a .ico { width: 13px; height: 13px; margin: 0; color: inherit; }

      /* Dive-deeper drawers */
      .deep { display: flex; flex-direction: column; gap: 8px; }
      .deep-item { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; transition: border-color .2s; }
      .deep-item[open] { border-color: var(--kygo-green); }
      .deep-item > summary { list-style: none; cursor: pointer; display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 12px; padding: 14px 44px 14px 18px; position: relative; font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--fg-1); }
      .deep-item > summary::-webkit-details-marker { display: none; }
      .deep-hint { font-family: var(--font-body); font-weight: 400; font-size: 12.5px; color: var(--fg-3); }
      .deep-item > summary .ico { position: absolute; right: 16px; top: 15px; width: 16px; height: 16px; color: var(--kygo-green-dark); transition: transform .2s; }
      .deep-item[open] > summary .ico { transform: rotate(45deg); }
      .deep-body { padding: 0 18px 18px; display: flex; flex-direction: column; gap: 16px; }
      .mini-title { font-family: var(--font-display); font-weight: 600; font-size: 13.5px; color: var(--fg-1); margin-bottom: 8px; }
      .mini .cmp-scroll { border: 1px solid var(--border-subtle); border-radius: 12px; overflow-x: auto; }
      .mini-table { min-width: 0; }
      .mini-table thead th { background: var(--bg-surface); border-bottom: 1px solid var(--border-subtle); }
      .mini-table thead .cmp-th-device { background: var(--bg-surface); }
      .mini-table .cmp-td-device { min-width: 0; }
      .mini-table td { white-space: normal; }
      .mini-foot { margin: 8px 0 0; font-size: 12px; line-height: 1.5; color: var(--fg-3); }
      .dnotes { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
      .dnotes li { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; line-height: 1.5; color: var(--fg-2); }
      .dnotes .brand-img.sm, .dnotes .brand-img { width: 28px; height: 28px; border-radius: 7px; flex: none; }
      .dnotes strong { color: var(--fg-1); }
      .stat-pair { display: grid; grid-template-columns: 1fr; gap: 10px; }
      @media (min-width: 620px) { .stat-pair { grid-template-columns: 1fr 1fr; } }
      .big-stat { display: flex; flex-direction: column; gap: 6px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 16px; font-size: 13px; line-height: 1.5; color: var(--fg-2); }
      .big-num { font-family: var(--font-display); font-weight: 700; font-size: 28px; line-height: 1; letter-spacing: -0.02em; color: var(--fg-1); }
      .big-stat strong { color: var(--fg-1); }
      .catch { display: grid; grid-template-columns: minmax(130px, 220px) 1fr 52px; gap: 12px; align-items: center; padding: 8px 0; border-top: 1px solid var(--border-subtle); }
      .catch-name { font-size: 13px; font-weight: 600; color: var(--fg-1); display: flex; flex-direction: column; }
      .catch-name small { font-weight: 400; font-size: 11px; color: var(--fg-3); }
      .catch-bar { height: 8px; border-radius: 99px; background: var(--bg-raised); overflow: hidden; }
      .catch-bar span { display: block; height: 100%; width: var(--w); background: var(--kygo-green); border-radius: inherit; }
      .catch-val { text-align: right; font-family: var(--font-display); font-weight: 600; font-size: 13px; }
      .st-list { display: grid; grid-template-columns: 1fr; gap: 8px; }
      @media (min-width: 768px) { .st-list { grid-template-columns: 1fr 1fr; } }
      .st-row { display: flex; flex-direction: column; gap: 3px; padding: 11px 13px; border: 1px solid var(--border-subtle); border-radius: 11px; transition: border-color .15s; }
      a.st-row:hover { border-color: var(--kygo-green); }
      .st-who { font-family: var(--font-display); font-size: 9.5px; font-weight: 700; letter-spacing: .4px; text-transform: uppercase; color: var(--kygo-green-dark); }
      .st-who.funded { color: var(--fg-2); }
      .st-title { font-family: var(--font-display); font-weight: 600; font-size: 13px; color: var(--fg-1); line-height: 1.3; }
      .st-cite { font-size: 11.5px; color: var(--fg-3); }

      /* FDA table */
      .fda-table { min-width: 640px; }
      .fda-table .cmp-td-device { padding-left: 14px; }
      .fda-table .cmp-td-device .brand-name { max-width: none; }
      .fda-yes { display: inline-flex; width: 24px; height: 24px; border-radius: 50%; background: var(--kygo-green); color: #fff; align-items: center; justify-content: center; }
      .fda-yes .ico { width: 12px; height: 12px; }
      .fda-total th, .fda-total td { background: var(--bg-surface); }

      /* Device breakdown additions */
      .dev-list { margin: 6px 0 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; font-size: 13px; line-height: 1.5; color: var(--fg-1); }
      .dev-finding.alt .dev-list { color: var(--fg-2); }
      .dev-note { display: flex; gap: 8px; margin: 0; font-size: 12.5px; line-height: 1.5; color: var(--fg-2); }
      .dev-note .ico { width: 15px; height: 15px; color: var(--kygo-green-dark); flex: none; margin-top: 2px; }
      .dev-meta { margin: 0; font-size: 12px; line-height: 1.55; color: var(--fg-3); }
      .dev-meta strong { color: var(--fg-2); font-weight: 600; }
      @media (prefers-reduced-motion: reduce) { .mx-panel { transition: none; } }

      /* ── Hub v3: metric index, stacked sections, spoke cards ─────────── */
      .mi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      @media (min-width: 720px) { .mi-grid { grid-template-columns: repeat(3, 1fr); } }
      @media (min-width: 1000px) { .mi-grid { grid-template-columns: repeat(4, 1fr); gap: 12px; } }
      .mi-card { display: flex; flex-direction: column; gap: 8px; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 16px; padding: 14px; transition: border-color .15s, box-shadow .15s, transform .15s; }
      .mi-card:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); transform: translateY(-1px); }
      .mi-top { display: flex; justify-content: space-between; align-items: center; }
      .mi-num { font-family: var(--font-display); font-size: 11px; font-weight: 700; color: var(--fg-3); letter-spacing: .5px; }
      .mi-tag { font-family: var(--font-display); font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 3px 8px; border-radius: 999px; }
      .mi-name { font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); line-height: 1.25; }
      .mi-best { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--fg-2); }
      .mi-best .brand-img.sm { width: 28px; height: 28px; border-radius: 7px; flex: none; }
      .mi-best strong { display: block; font-family: var(--font-display); font-size: 12.5px; color: var(--fg-1); }
      .mi-best em { display: block; font-style: normal; font-size: 11.5px; color: var(--kygo-green-dark); font-weight: 600; }
      .mi-best.mi-none { font-size: 12px; font-weight: 600; color: var(--fg-3); min-height: 28px; }
      .mi-compare { background: var(--bg-raised); border-style: dashed; }
      .mi-compare .mi-date { display: inline-flex; align-items: center; gap: 4px; color: var(--kygo-green-dark); font-weight: 600; }
      .mi-compare .mi-date .ico { width: 11px; height: 11px; }
      .mi-date { margin-top: auto; padding-top: 8px; border-top: 1px solid var(--border-subtle); font-size: 10.5px; color: var(--fg-3); }

      .metric-sec { scroll-margin-top: 70px; }
      .m-meta { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; margin-top: 14px; }
      .m-date { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-display); font-size: 11.5px; font-weight: 600; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 5px 11px; border-radius: 999px; }
      .m-date .ico { width: 13px; height: 13px; }
      .m-ref { font-size: 12.5px; color: var(--fg-3); }
      .m-stack { display: flex; flex-direction: column; gap: 14px; }

      .spoke { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 14px; background: var(--kygo-dark); color: #fff; border-radius: 18px; padding: 20px; transition: transform .15s, box-shadow .15s; }
      .spoke::before { content: ''; position: absolute; top: -120px; right: -100px; width: 320px; height: 320px; background: radial-gradient(closest-side, rgba(34,197,94,.22), transparent); pointer-events: none; }
      .spoke:hover { transform: translateY(-1px); box-shadow: 0 14px 32px rgba(15,23,42,.18); }
      @media (min-width: 768px) { .spoke { flex-direction: row; align-items: center; justify-content: space-between; padding: 22px 26px; } }
      .spoke-body { position: relative; display: flex; flex-direction: column; gap: 4px; max-width: 640px; }
      .spoke-k { font-family: var(--font-display); font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: #6EE7A0; }
      .spoke-title { font-family: var(--font-display); font-weight: 600; font-size: 19px; }
      .spoke-blurb { font-size: 13.5px; line-height: 1.55; color: rgba(255,255,255,.72); }
      .spoke-meta { font-size: 12px; color: rgba(255,255,255,.5); }
      .spoke-btn { position: relative; flex: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--kygo-green); color: #fff; font-family: var(--font-display); font-weight: 600; font-size: 14px; padding: 12px 18px; border-radius: 12px; box-shadow: var(--shadow-cta); }
      .spoke:hover .spoke-btn { background: var(--kygo-green-dark); }
      .spoke-btn .ico { width: 15px; height: 15px; }

      /* ── v4: bar-chart tables, neutral takeaway, white Go deeper cards ─ */
      .metric-sec .section-head h2 .hl { color: var(--kygo-green); }

      /* Evidence-checked chip stays, in neutral gray */
      .m-date { color: var(--fg-2); background: var(--bg-raised); }

      .takeaway { background: #fff; border: 1px solid var(--border-subtle); border-left: 4px solid var(--kygo-dark); border-radius: 12px; padding: 14px 18px; }
      .bg-white .takeaway { background: var(--bg-surface); }
      .takeaway-k { display: block; font-family: var(--font-display); font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px; color: var(--fg-3); margin-bottom: 4px; }
      .takeaway p { margin: 0; font-size: 14px; line-height: 1.6; color: var(--fg-1); }

      .rank-table thead th.th-bar { width: 38%; text-align: left; padding-left: 14px; }
      .rank-table td.td-bar { text-align: left; padding-left: 14px; padding-right: 14px; }
      .barcell { display: flex; align-items: center; gap: 10px; min-width: 180px; }
      .bar-track { flex: 1; height: 12px; border-radius: 99px; background: var(--bg-raised); overflow: hidden; }
      .bar-fill { display: block; height: 100%; width: 0; border-radius: inherit; background: #94A3B8; transition: width .9s var(--ease-out); transition-delay: calc(var(--i, 0) * 70ms); }
      .visible .bar-fill { width: var(--w); }
      .bar-fill.tone-good { background: var(--kygo-green); }
      .bar-fill.tone-mid { background: #94A3B8; }
      .bar-fill.tone-dark { background: var(--kygo-dark); }
      .bar-fill.is-funded { background: repeating-linear-gradient(135deg, var(--kygo-green) 0 5px, #86E3A8 5px 10px); }
      .bar-val { flex: none; min-width: 64px; font-family: var(--font-display); font-weight: 700; font-size: 14px; color: var(--fg-1); text-align: right; }
      .td-bar .cell-note, .td-bar .fund-tag { margin-top: 5px; }
      .fund-tag { display: inline-flex; align-items: center; font-family: var(--font-display); font-size: 9.5px; font-weight: 700; letter-spacing: .3px; text-transform: uppercase; color: var(--fg-2); background: #fff; border: 1px dashed #94A3B8; padding: 2px 7px; border-radius: 6px; line-height: 1.3; }
      .cell .fund-tag { margin-top: 2px; }
      @media (max-width: 767px) { .barcell { min-width: 140px; gap: 6px; } .bar-val { min-width: 44px; font-size: 12.5px; } .fund-tag { font-size: 8.5px; padding: 2px 5px; } }

      .spoke { background: #fff; color: var(--fg-1); border: 1.5px solid var(--border-subtle); padding: 0; flex-direction: column; align-items: stretch; gap: 0; }
      .spoke::before { display: none; }
      .spoke:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); transform: translateY(-1px); }
      @media (min-width: 768px) { .spoke { flex-direction: row; padding: 0; } }
      .spoke-media { flex: none; background: var(--bg-raised); display: flex; align-items: center; justify-content: center; padding: 18px; }
      @media (min-width: 768px) { .spoke-media { width: 300px; } }
      .spoke-panel { width: 100%; max-width: 260px; background: #fff; border-radius: 12px; box-shadow: 0 6px 18px rgba(15,23,42,.08); padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
      .spoke-cap { font-family: var(--font-display); font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--fg-3); }
      .spoke-body { padding: 18px 22px; gap: 6px; max-width: none; flex: 1; }
      .spoke-k { color: var(--kygo-green-dark); }
      .spoke-blurb { color: var(--fg-2); }
      .spoke-meta { display: none; }
      .spoke-btn { align-self: flex-start; margin-top: 8px; background: #fff; color: var(--kygo-green-dark); border: 1.5px solid var(--kygo-green); box-shadow: none; padding: 9px 14px; font-size: 13.5px; }
      .spoke:hover .spoke-btn { background: var(--kygo-green); color: #fff; }
      @media (prefers-reduced-motion: reduce) { .bar-fill { transition: none; width: var(--w); } }

      /* ── Hero evidence panel ── */
      .ev { --sky: #EAF1F8; --sky-2: #D6E4F2; --sky-ink: #3E6286; gap: 16px; }
      .ev-big { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); background: #fff; border: 1px solid var(--border-subtle); border-radius: 14px; }
      .ev-big > div { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 14px 6px; text-align: center; }
      .ev-big > div + div { border-left: 1px solid var(--border-subtle); }
      .ev-big strong { font-family: var(--font-display); font-weight: 700; font-size: clamp(26px, 4vw, 34px); line-height: 1; letter-spacing: -0.02em; color: var(--fg-1); }
      .ev-big > div:first-child strong { color: var(--kygo-green-dark); }
      .ev-big span { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .4px; color: var(--fg-3); }
      .ev-rows { position: relative; display: flex; flex-direction: column; gap: 9px; }
      .ev-row { display: grid; grid-template-columns: 104px 1fr 74px; gap: 12px; align-items: center; }
      .ev-dev { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-weight: 600; font-size: 13px; color: var(--fg-1); }
      .ev-dev .brand-img.sm { width: 24px; height: 24px; border-radius: 7px; }
      .ev-bar { display: flex; height: 10px; border-radius: 999px; background: #EEF2F6; overflow: hidden; }
      .ev-ind { background: var(--sky-ink); }
      .ev-fund { background: repeating-linear-gradient(135deg, #A9C1D9 0 4px, #D6E4F2 4px 8px); }
      .ev-n { text-align: right; font-size: 12px; color: var(--fg-3); white-space: nowrap; }
      .ev-n strong { font-family: var(--font-display); font-size: 14px; color: var(--fg-1); margin-right: 2px; }
      .ev-legend { position: relative; display: flex; justify-content: center; gap: 18px; font-size: 12px; color: var(--fg-3); }
      .ev-legend span { display: inline-flex; align-items: center; gap: 6px; }
      .ev-key { display: inline-block; width: 12px; height: 8px; border-radius: 3px; }
      .ev-key.ind { background: var(--sky-ink); }
      .ev-key.fund { background: repeating-linear-gradient(135deg, #A9C1D9 0 3px, #D6E4F2 3px 6px); }
      @media (max-width: 479px) { .ev-row { grid-template-columns: 92px 1fr 64px; gap: 8px; } }

      /* ── Brand cards ── */
      .bc-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
      @media (min-width: 640px) { .bc-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (min-width: 1000px) { .bc-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; } }
      .bc { display: flex; flex-direction: column; gap: 12px; background: #fff; border: 1px solid var(--border-subtle); border-radius: 18px; padding: 20px; box-shadow: 0 1px 2px rgba(15,23,42,0.04); }
      .bc-head { display: flex; align-items: center; gap: 12px; }
      .bc-head .brand-img { width: 44px; height: 44px; border-radius: 12px; }
      .bc-head h3 { font-family: var(--font-display); font-weight: 600; font-size: 18px; margin: 0; color: var(--fg-1); }
      .bc-verdict { margin: 0; font-size: 14.5px; line-height: 1.55; color: var(--fg-2); }
      .bc-tags { display: flex; flex-direction: column; gap: 6px; }
      .bc-tag { font-size: 12.5px; line-height: 1.4; padding: 7px 10px; border-radius: 10px; }
      .bc-tag b { font-family: var(--font-display); font-weight: 600; margin-right: 4px; }
      .bc-tag.good { background: #F0FDF4; color: var(--fg-1); }
      .bc-tag.good b { color: var(--kygo-green-dark); }
      .bc-tag.weak { background: #F1F5F9; color: var(--fg-1); }
      .bc-tag.weak b { color: var(--fg-2); }
      .bc-more { border-top: 1px solid #F1F5F9; padding-top: 10px; margin-top: auto; }
      .bc-more summary { list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; font-family: var(--font-display); font-weight: 600; font-size: 13px; color: var(--fg-2); }
      .bc-more summary::-webkit-details-marker { display: none; }
      .bc-more summary .ico { color: var(--fg-3); transition: transform .2s; }
      .bc-more[open] summary .ico { transform: rotate(45deg); }
      .bc-body { padding-top: 12px; display: flex; flex-direction: column; gap: 10px; font-size: 13.5px; }
      .bc-amz { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-display); font-weight: 600; font-size: 13px; color: var(--kygo-green-dark); }
      .bc-amz .ico { width: 13px; height: 13px; }

      /* ── Metric jump nav ── */
      .jn { display: flex; flex-wrap: wrap; gap: 8px; }
      .jn-chip { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-weight: 600; font-size: 13.5px; color: var(--fg-1); background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 999px; padding: 9px 15px 9px 12px; transition: border-color .15s, background .15s; }
      .jn-chip .ico { color: #3E6286; }
      .jn-chip:hover { border-color: #A9C1D9; background: #F7FAFD; }

      /* ── v9: footnote separated from last row; takeaway as a light-blue callout ── */
      .cmp-legend { border-top: 1px solid #CBD5E1; background: var(--bg-surface); }
      .takeaway { display: flex; gap: 14px; align-items: flex-start; background: #F4F8FC; border: 1px solid #D6E4F2; border-left: 1px solid #D6E4F2; border-radius: 16px; padding: 16px 18px; }
      .bg-white .takeaway { background: #F4F8FC; }
      .tk-ico { width: 36px; height: 36px; border-radius: 10px; background: #fff; color: #3E6286; display: inline-flex; align-items: center; justify-content: center; flex: none; font-size: 18px; box-shadow: 0 1px 2px rgba(15,23,42,0.06); }
      .tk-body { min-width: 0; }
      .takeaway-k { color: #3E6286; margin-bottom: 6px; }
      .takeaway p { font-size: 15px; line-height: 1.65; color: var(--fg-1); }
      @media (min-width: 768px) { .takeaway { padding: 20px 24px; gap: 18px; } .tk-ico { width: 40px; height: 40px; } }

      /* ── v10: mobile first. Phones (<640px) get stacked rows, carousels, tighter rhythm ── */
      .swipe-hint { display: none; }
      .fda-m { display: none; }
      @media (max-width: 639px) {
        .section { padding: 44px 16px; }
        .hero-light-inner { padding: 32px 16px 28px; }
        .hero-grid { margin-bottom: 24px; }
        .hero-vis-tag { display: none; }
        .section-head { margin-bottom: 20px; }
        .lede { font-size: 15px; }

        /* Data tables become one card row per device: name and grade on top, the bar full width, extra columns as label/value lines */
        .rank-table, .mini-table { min-width: 0; display: block; }
        .rank-table thead, .mini-table thead { display: none; }
        .rank-table tbody, .mini-table tbody { display: block; }
        .cmp-scroll:has(.rank-table) { overflow: visible; }
        .rank-table tr, .mini-table tr { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 6px 10px; padding: 12px 14px; }
        .rank-table tbody tr + tr, .mini-table tbody tr + tr { border-top: 1px solid var(--border-subtle); }
        .rank-table tbody tr + tr td, .rank-table tbody tr + tr th, .mini-table tbody tr + tr td, .mini-table tbody tr + tr th { border-top: 0; }
        .rank-table .cmp-td-device, .mini-table .cmp-td-device { grid-column: 1; position: static; width: auto; min-width: 0; padding: 0; box-shadow: none; background: none; }
        .rank-table .brand, .mini-table .brand { flex-direction: row; align-items: center; gap: 10px; text-align: left; }
        .rank-table .brand-img.sm, .mini-table .brand-img.sm { width: 32px; height: 32px; }
        .rank-table .brand-name, .mini-table .brand-name { font-size: 15px; max-width: none; }
        .rank-table .brand-model, .mini-table .brand-model { display: inline; font-size: 12px; margin-left: 4px; }
        table.rank-table tbody td, table.mini-table tbody td { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0; text-align: right; background: none !important; }
        .rank-table td[data-label]::before, .mini-table td[data-label]::before { content: attr(data-label); font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: .3px; text-transform: uppercase; color: var(--fg-3); text-align: left; flex: none; max-width: 55%; }
        .rank-table .cell, .mini-table .cell { align-items: flex-end; }
        .rank-table .cell-note { max-width: none; text-align: right; }
        .rank-table td.td-grade { grid-column: 2; grid-row: 1; }
        .rank-table td.td-grade::before { display: none; }
        table.rank-table tbody td.td-bar { padding: 0; flex-direction: column; align-items: stretch; gap: 4px; text-align: left; }
        .rank-table td.td-bar::before { display: none; }
        .rank-table tbody tr:first-child td.td-bar::before { display: block; max-width: none; }
        .rank-table td.td-bar .barcell { min-width: 0; width: 100%; }
        table.rank-table tbody td.td-bar:not(:has(.barcell)) { display: none; }
        table.rank-table tbody td.td-buy { margin-top: -2px; }
        .rank-table tbody tr:hover td { background: none; }
        .rank-table td.td-bar .fund-tag, .rank-table td.td-bar .cell-note { align-self: flex-start; }
        .rank-table td.td-buy { justify-content: flex-end; }
        .rank-table tr.row-empty td:not(.td-buy) { display: none; }
        .rank-table tr.row-empty::after { content: 'No independent study'; grid-column: 1 / -1; grid-row: 2; font-size: 12.5px; color: var(--fg-3); }
        .rank-table tr.row-empty td.td-buy { grid-column: 2; grid-row: 1; }
        .mini .cmp-scroll { overflow: visible; }

        /* FDA: per-brand list instead of a 6-column grid */
        .fda-desk { display: none; }
        .fda-m { display: flex; flex-direction: column; }
        .fdam-card { padding: 14px; }
        .fdam-card + .fdam-card { border-top: 1px solid var(--border-subtle); }
        .fdam-head { display: flex; align-items: center; gap: 10px; }
        .fdam-head .brand-img.sm { width: 32px; height: 32px; }
        .fdam-name { flex: 1; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); }
        .fdam-count { display: inline-flex; align-items: center; gap: 6px; }
        .fdam-count em { font-style: normal; font-size: 12px; color: var(--fg-3); }
        .fdam-list { list-style: none; margin: 10px 0 0; padding: 0 0 0 42px; display: flex; flex-direction: column; gap: 7px; }
        .fdam-list li { display: flex; align-items: flex-start; gap: 8px; font-size: 13.5px; color: var(--fg-1); line-height: 1.4; }
        .fdam-list li small { color: var(--fg-3); font-size: 12px; }
        .fdam-ico { width: 18px; height: 18px; border-radius: 50%; background: var(--kygo-green); color: #fff; display: inline-flex; align-items: center; justify-content: center; flex: none; margin-top: 1px; }
        .fdam-ico .ico svg { width: 10px; height: 10px; }
        .fdam-list li.w .fdam-ico { background: var(--bg-raised); color: var(--fg-3); }
        .fdam-list li.w { color: var(--fg-2); }
        .fdam-none { margin: 8px 0 0 42px; font-size: 13px; color: var(--fg-3); }

        /* Card groups become swipeable rows with a peek of the next card */
        .swipe-hint { display: inline-flex; align-items: center; gap: 6px; margin: -6px 0 12px; font-family: var(--font-display); font-size: 12.5px; font-weight: 600; color: #3E6286; }
        .swipe-hint .ico { width: 13px; height: 13px; }
        .bc-grid, .sig-grid, :host .rt-grid, :host .rp-grid { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 12px; margin: 0 -16px; padding: 2px 16px 14px; scroll-padding: 0 16px; scrollbar-width: none; overscroll-behavior-x: contain; }
        .bc-grid::-webkit-scrollbar, .sig-grid::-webkit-scrollbar, :host .rt-grid::-webkit-scrollbar, :host .rp-grid::-webkit-scrollbar { display: none; }
        .bc-grid > *, .sig-grid > *, :host .rt-grid > *, :host .rp-grid > * { flex: 0 0 84%; scroll-snap-align: start; }
        .bc { padding: 18px; }


        /* Jump nav scrolls sideways */
        .jn { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin: 0 -16px; padding: 2px 16px 6px; }
        .jn::-webkit-scrollbar { display: none; }
        .jn-chip { flex: none; }

        /* Metric sections */
        .m-meta { flex-wrap: wrap; gap: 6px 10px; }
        .takeaway { flex-direction: column; gap: 10px; padding: 14px 16px; }
        .tk-ico { width: 30px; height: 30px; font-size: 15px; }
        .takeaway p { font-size: 14.5px; line-height: 1.6; }
        .spoke-media { padding: 14px; }
      }

      /* ── v11: icons on metric headings, brand tags, drawers ── */
      .m-kick { display: flex; align-items: center; gap: 12px; }
      .m-ico { width: 44px; height: 44px; border-radius: 12px; background: #EAF1F8; color: #3E6286; display: inline-flex; align-items: center; justify-content: center; flex: none; font-size: 21px; }
      .bg-light .m-ico { background: #fff; box-shadow: inset 0 0 0 1px #D6E4F2; }
      .bc-tag { display: flex; align-items: flex-start; gap: 8px; }
      .bc-ti { width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; flex: none; margin-top: 0; }
      .bc-ti .ico svg { width: 11px; height: 11px; }
      .bc-tag.good .bc-ti { background: var(--kygo-green); color: #fff; }
      .bc-tag.weak .bc-ti { background: #E2E8F0; color: var(--fg-2); }
      .dk-lab { display: inline-flex; align-items: center; gap: 10px; }
      .deep-item > summary .dk-ico .ico { position: static; width: auto; height: auto; color: inherit; transform: none; }
      .dk-ico { width: 30px; height: 30px; border-radius: 9px; background: #EAF1F8; color: #3E6286; display: inline-flex; align-items: center; justify-content: center; flex: none; font-size: 15px; }
      .deep-item > summary { align-items: center; }
      .deep-item > summary > .ico { top: 50%; margin-top: -8px; }
      .dk-lab + .deep-hint { padding-left: 40px; }
      @media (min-width: 640px) { .dk-lab + .deep-hint { padding-left: 0; } }
      @media (max-width: 639px) { .m-ico { width: 38px; height: 38px; font-size: 18px; border-radius: 11px; } .dk-ico { width: 28px; height: 28px; } }

      /* ── v12: one grouped card under each table for tool link, more data, studies ── */
      .deep.m-links { display: block; gap: 0; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 16px; overflow: hidden; }
      .m-links .deep-item { border: 0; border-radius: 0; background: none; }
      .deep.m-links > .deep-item + .deep-item, .deep.m-links > .ml-tool + .deep-item { border-top: 1px solid var(--border-subtle); }
      .m-links .deep-item[open] { background: #FBFCFE; }
      .m-links .deep-item > summary:hover, .ml-tool:hover { background: var(--bg-surface); }
      .ml-tool { display: flex; align-items: center; gap: 10px; padding: 12px 16px 12px 18px; transition: background .15s; }
      .ml-tool-ico { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .ml-text { display: flex; flex-direction: column; min-width: 0; flex: 1; }
      .ml-title { font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--fg-1); }
      .ml-hint { font-size: 12.5px; color: var(--fg-3); }
      .ml-go { display: inline-flex; align-items: center; gap: 5px; flex: none; font-family: var(--font-display); font-weight: 600; font-size: 13px; color: var(--kygo-green-dark); }
      .ml-go .ico { width: 14px; height: 14px; transition: transform .15s; }
      .ml-tool:hover .ml-go .ico { transform: translateX(2px); }
      .m-links .deep-item > summary { padding-top: 12px; padding-bottom: 12px; }
      @media (min-width: 768px) { .ml-tool { padding: 12px 20px 12px 18px; } }

      /* ── v13: footnote icon sits beside its text; study rows get an open arrow ── */
      .cmp-legend { display: flex; flex-wrap: nowrap; align-items: flex-start; gap: 8px; padding: 10px 16px 11px; }
      .cmp-legend > .ico { margin-top: 2px; }
      .cmp-legend > span { min-width: 0; }
      a.st-row { position: relative; padding-right: 44px; }
      .st-go { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); width: 26px; height: 26px; border-radius: 50%; background: var(--bg-raised); color: var(--fg-2); display: inline-flex; align-items: center; justify-content: center; transition: background .15s, color .15s; }
      .st-go .ico svg { width: 13px; height: 13px; }
      a.st-row:hover .st-go { background: var(--kygo-green); color: #fff; }

      /* ── v14: condensed copy; full original text lives in More data ── */
      .full-txt { margin-bottom: 14px; }
      .full-txt p { margin: 0 0 10px; font-size: 14px; line-height: 1.6; color: var(--fg-2); max-width: 80ch; }
      .full-txt p:last-child { margin-bottom: 0; }
      .m-date { white-space: normal; line-height: 1.4; }

      /* ── v17: brand cards share one fixed 10-tile grid, coloured by grade ── */
      .bc { gap: 14px; }
      .bc-head h3 { flex: 1; min-width: 0; }
      .bc-fda { flex: none; font-family: var(--font-display); font-size: 11px; font-weight: 600; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 4px 9px; border-radius: 999px; white-space: nowrap; }
      .bc-fda.zero { color: var(--fg-3); background: var(--bg-raised); }
      .bc-tiles { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px 4px; }
      .bc-ic { display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 0; }
      .bc-ic-box { width: 40px; height: 40px; border-radius: 11px; display: inline-flex; align-items: center; justify-content: center; font-size: 19px; box-sizing: border-box; }
      .bc-ic em { font-style: normal; font-family: var(--font-display); font-size: 10.5px; font-weight: 600; text-align: center; line-height: 1.2; min-height: 2.4em; color: var(--fg-2); }
      .bc-ic.good .bc-ic-box { background: var(--kygo-green); color: #fff; }
      .bc-ic.fair .bc-ic-box { background: #EAF1F8; color: #3E6286; }
      .bc-ic.weak .bc-ic-box { background: #CBD5E1; color: #475569; }
      .bc-ic.none .bc-ic-box { background: transparent; color: #CBD5E1; border: 1.5px dashed #CBD5E1; }
      .bc-ic.none em { color: var(--fg-3); font-weight: 500; }
      .bc-legend { display: flex; flex-wrap: wrap; gap: 6px 16px; margin: 0 0 14px; font-size: 12.5px; color: var(--fg-2); }
      .bc-legend span { display: inline-flex; align-items: center; gap: 6px; }
      .bc-legend i { width: 14px; height: 14px; border-radius: 4px; display: inline-block; box-sizing: border-box; }
      .bc-legend i.good { background: var(--kygo-green); }
      .bc-legend i.fair { background: #EAF1F8; box-shadow: inset 0 0 0 1px #D6E4F2; }
      .bc-legend i.weak { background: #CBD5E1; }
      .bc-legend i.none { border: 1.5px dashed #CBD5E1; }
      .bc-body .bc-verdict { font-size: 14px; color: var(--fg-1); margin: 0; }
      .bc-more { margin-top: auto; }
      @media (max-width: 639px) { .bc-ic-box { width: 36px; height: 36px; font-size: 17px; border-radius: 10px; } .bc-ic em { font-size: 10px; } }

      /* ── v18: scoreboard (replaces brand cards), fact switcher ── */
      .sb-card { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; box-shadow: var(--shadow-md); padding: 4px 24px 0; }
      .sb { display: grid; grid-template-columns: 200px repeat(var(--sb-n, 6), minmax(0, 1fr)); }
      .sb > * { border-top: 1px solid #EEF2F6; }
      .sb > .sb-h { border-top: 0; }
      .sb-h { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 16px 0 12px; min-width: 0; }
      .sb-h .brand-img { width: 40px; height: 40px; border-radius: 11px; }
      .sb-hn { font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--fg-1); }
      .sb-corner { align-items: flex-start; justify-content: flex-end; }
      .sb-corner span { font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; color: #64748B; }
      .sb-lab { display: flex; align-items: center; gap: 10px; padding: 12px 0; font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--fg-1); min-width: 0; }
      .sb-lab .ico { color: #3E6286; font-size: 18px; flex: none; }
      .sb-c { display: flex; align-items: center; justify-content: center; padding: 12px 0; }
      .sb-g { width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; flex: none; }
      .sb-good { background: var(--kygo-green); }
      .sb-good::after { content: ""; width: 10px; height: 5px; border-left: 2.5px solid #fff; border-bottom: 2.5px solid #fff; transform: translateY(-1px) rotate(-45deg); }
      .sb-fair { background: #EAF1F8; box-shadow: inset 0 0 0 2px #A9C1D9; }
      .sb-fair::after { content: ""; width: 8px; height: 8px; border-radius: 50%; background: #3E6286; }
      .sb-weak { background: #64748B; }
      .sb-weak::after { content: ""; width: 10px; height: 2.5px; border-radius: 2px; background: #fff; }
      .sb-none { border: 2px dashed #CBD5E1; }
      .pill-n { display: inline-flex; align-items: center; justify-content: center; min-width: 28px; font-family: var(--font-display); font-weight: 600; font-size: 12px; padding: 4px 9px; border-radius: 999px; }
      .pill-n.good { background: var(--kygo-green-light); color: #15803D; }
      .pill-n.fair { background: #EAF1F8; color: #3E6286; }
      .pill-n.zero { background: #E2E8F0; color: #334155; }
      .sb-buy-lab span { font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; color: #64748B; }
      .sb-buy { font-family: var(--font-display); font-weight: 600; font-size: 12.5px; color: var(--kygo-green-dark); }
      .sb-buy:hover { color: var(--kygo-green); }
      .sb-under { display: flex; justify-content: space-between; align-items: center; gap: 12px 20px; flex-wrap: wrap; margin-top: 14px; }
      .sb-legend { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 12.5px; color: var(--fg-2); }
      .sb-legend span { display: inline-flex; align-items: center; gap: 7px; }
      .sb-legend .sb-g { width: 16px; height: 16px; }
      .sb-legend .sb-good::after { width: 6px; height: 3px; border-width: 0 0 2px 2px; }
      .sb-legend .sb-fair::after { width: 5px; height: 5px; }
      .sb-legend .sb-weak::after { width: 7px; height: 2px; }
      .sb-more { margin-top: 16px; }
      .sbd-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
      .sbd { border: 1px solid var(--border-subtle); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 10px; font-size: 13.5px; }
      .sbd-head { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-size: 15px; }
      .sbd-head .brand-img.sm { width: 30px; height: 30px; }
      @media (max-width: 639px) {
        .sb-card { padding: 0 10px; border-radius: 16px; }
        .sb { grid-template-columns: 62px repeat(var(--sb-n, 6), minmax(0, 1fr)); }
        .sb-h { padding: 12px 0 10px; gap: 4px; }
        .sb-h .brand-img { width: 28px; height: 28px; border-radius: 8px; }
        .sb-hn { font-size: 9.5px; }
        .sb-corner span { display: none; }
        .sb-lab { flex-direction: column; align-items: flex-start; gap: 3px; font-size: 10px; padding: 9px 0; line-height: 1.15; }
        .sb-lab .ico { font-size: 15px; }
        .sb-c { padding: 9px 0; }
        .sb-g { width: 22px; height: 22px; }
        .sb-good::after { width: 8px; height: 4px; }
        .pill-n { min-width: 22px; font-size: 11px; padding: 3px 6px; }
        .sb-buy { font-size: 10px; }
        .sbd-grid { grid-template-columns: 1fr; }
      }

      .fx { display: grid; grid-template-columns: minmax(0, 330px) minmax(0, 1fr); background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; box-shadow: var(--shadow-md); overflow: hidden; }
      .fx-tabs { display: flex; flex-direction: column; gap: 2px; padding: 10px; border-right: 1px solid #EEF2F6; background: #FBFCFE; }
      .fx-tab { display: flex; align-items: center; gap: 12px; text-align: left; background: none; border: 0; padding: 11px 12px; border-radius: 12px; cursor: pointer; font: inherit; color: inherit; transition: background .15s; }
      .fx-tab:hover { background: #F1F5F9; }
      .fx-tab.on { background: #EAF1F8; }
      .fx-tab:focus-visible, .fx-step:focus-visible { outline: 2px solid var(--kygo-green); outline-offset: 2px; }
      .fx-ico { width: 34px; height: 34px; border-radius: 10px; background: #EAF1F8; color: #3E6286; display: inline-flex; align-items: center; justify-content: center; flex: none; font-size: 16px; }
      .fx-tab.on .fx-ico { background: #3E6286; color: #fff; }
      .fx-tt { display: flex; flex-direction: column; min-width: 0; }
      .fx-tag { font-family: var(--font-display); font-size: 10.5px; font-weight: 600; letter-spacing: .6px; text-transform: uppercase; color: #64748B; }
      .fx-ttl { font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--fg-1); line-height: 1.3; }
      .fx-main { padding: 34px 40px; display: flex; flex-direction: column; justify-content: center; gap: 20px; min-width: 0; }
      .fx-panel { display: flex; flex-direction: column; gap: 8px; }
      .fx-panel[hidden] { display: none; }
      .fx-panel > .fx-tag { display: none; }
      .fx-stat { font-family: var(--font-display); font-weight: 700; font-size: 56px; line-height: 1; letter-spacing: -0.02em; color: var(--fg-1); }
      .fx-statl { margin: 2px 0 0; font-size: 14px; line-height: 1.5; color: var(--fg-2); max-width: 46ch; }
      .fx-title { margin: 14px 0 0; font-family: var(--font-display); font-weight: 600; font-size: 20px; color: var(--fg-1); }
      .fx-body { margin: 0; font-size: 15px; line-height: 1.6; color: var(--fg-2); max-width: 60ch; }
      .fx-nav { display: none; align-items: center; gap: 12px; }
      .fx-step { width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid var(--border-subtle); background: #fff; color: var(--fg-1); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
      .fx-step:first-child .ico { transform: rotate(180deg); }
      .fx-count { font-family: var(--font-display); font-size: 13px; font-weight: 600; color: #64748B; min-width: 48px; text-align: center; }
      @media (max-width: 879px) {
        .fx { grid-template-columns: 1fr; }
        .fx-tabs { flex-direction: row; overflow-x: auto; scrollbar-width: none; border-right: 0; border-bottom: 1px solid #EEF2F6; padding: 10px; gap: 6px; }
        .fx-tabs::-webkit-scrollbar { display: none; }
        .fx-tab { flex: none; padding: 7px 12px 7px 7px; gap: 8px; border: 1.5px solid var(--border-subtle); background: #fff; border-radius: 999px; }
        .fx-tab.on { border-color: #3E6286; background: #EAF1F8; }
        .fx-ico { width: 26px; height: 26px; border-radius: 50%; font-size: 13px; }
        .fx-ttl { display: none; }
        .fx-tab .fx-tag { font-size: 11px; color: var(--fg-1); letter-spacing: .3px; }
        .fx-main { padding: 24px 20px 18px; gap: 18px; }
        .fx-stat { font-size: 44px; }
        .fx-title { font-size: 18px; }
        .fx-body { font-size: 14.5px; }
        .fx-nav { display: flex; justify-content: center; }
      }

      /* ── v21: metric tabs on one line, with the chart icons ── */
      .cx-tabs { flex-wrap: nowrap; overflow-x: auto; justify-content: flex-start; gap: 6px; scrollbar-width: none; padding: 2px 2px 4px; }
      .cx-tabs::-webkit-scrollbar { display: none; }
      .cx-tabs > :first-child { margin-left: auto; }
      .cx-tabs > :last-child { margin-right: auto; }
      .cx-tab { flex: none; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; padding: 7px 12px 7px 10px; }
      .cx-tab .ico { font-size: 15px; color: #3E6286; }
      .cx-tab.on .ico { color: var(--kygo-green-dark); }
      @media (max-width: 639px) { .cx-tabs > :first-child { margin-left: 0; } .cx-tabs > :last-child { margin-right: 0; } }


      /* ── v23: compare (two brands). Head, picker cards, metric tabs, panel, Overview table ── */
      .cx-sec .section-head { text-align: center; margin-left: auto; margin-right: auto; }
      .cx-sec .section-head .lede { margin-left: auto; margin-right: auto; }
      .cx { display: flex; flex-direction: column; gap: 18px; }
      .cx-cards { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: stretch; gap: 0 14px; max-width: 860px; margin: 0 auto; width: 100%; }
      .cx-vsb { align-self: center; width: 40px; height: 40px; border-radius: 50%; background: var(--kygo-green); color: #fff; font-family: var(--font-display); font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; flex: none; }
      .cx-card { position: relative; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; box-shadow: var(--shadow-md); padding: 22px 18px 20px; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; min-width: 0; }
      .cx-card .brand-img { width: 52px; height: 52px; border-radius: 14px; margin-bottom: 2px; }
      .cx-sel { position: relative; display: inline-flex; width: 100%; max-width: 240px; }
      .cx-sel select { appearance: none; -webkit-appearance: none; width: 100%; min-width: 0; height: 40px; padding: 0 34px 0 14px; border: 1.5px solid var(--border-subtle); border-radius: 10px; background: #F8FAFC; font-family: var(--font-display); font-weight: 600; font-size: 16px; color: var(--fg-1); text-align: center; text-align-last: center; cursor: pointer; text-overflow: ellipsis; }
      .cx-sel select:hover { background: #fff; border-color: #A9C1D9; }
      .cx-sel select:focus-visible { outline: 2px solid var(--kygo-green); outline-offset: 2px; }
      .cx-sel .ico { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); color: var(--fg-2); font-size: 16px; pointer-events: none; }
      .cx-card-best { font-size: 13px; color: var(--fg-2); line-height: 1.4; }
      .cx-card-sub { font-size: 12px; color: #64748B; }
      .cx-tabs { display: flex; flex-wrap: nowrap; overflow-x: auto; justify-content: flex-start; gap: 6px; scrollbar-width: none; padding: 2px 2px 4px; }
      .cx-tabs::-webkit-scrollbar { display: none; }
      .cx-tabs > :first-child { margin-left: auto; }
      .cx-tabs > :last-child { margin-right: auto; }
      .cx-tab { flex: none; display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-display); font-weight: 500; font-size: 13px; color: var(--fg-1); background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 999px; padding: 7px 12px 7px 10px; cursor: pointer; white-space: nowrap; transition: border-color .15s, color .15s, background .15s; }
      .cx-tab .ico { font-size: 15px; color: #3E6286; }
      .cx-tab:hover { border-color: #A9C1D9; }
      .cx-tab.on { border-color: var(--kygo-green); color: var(--kygo-green-dark); background: #F0FDF4; font-weight: 600; }
      .cx-tab.on .ico { color: var(--kygo-green-dark); }
      .cx-tab:focus-visible, .cx-go:focus-visible { outline: 2px solid var(--kygo-green); outline-offset: 2px; }
      .cx-panel { display: flex; flex-direction: column; gap: 14px; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; box-shadow: var(--shadow-md); padding: 26px 28px; }
      .cx-head { display: flex; align-items: center; gap: 12px; }
      .cx-ico { width: 40px; height: 40px; border-radius: 12px; background: #EAF1F8; color: #3E6286; display: inline-flex; align-items: center; justify-content: center; flex: none; font-size: 19px; }
      .cx-title h3 { font-family: var(--font-display); font-weight: 600; font-size: clamp(19px, 2.6vw, 24px); margin: 0; color: var(--fg-1); }
      .cx-meta { font-size: 12.5px; color: var(--fg-3); }
      .cx-verdict { margin: 0; font-size: 15px; line-height: 1.6; color: var(--fg-2); max-width: 75ch; }
      .cx-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; font-size: 12.5px; color: var(--fg-3); }
      .cx-go { display: inline-flex; align-items: center; gap: 6px; background: #fff; border: 1.5px solid var(--kygo-green); color: var(--kygo-green-dark); font-family: var(--font-display); font-weight: 600; font-size: 13.5px; padding: 9px 14px; border-radius: 999px; cursor: pointer; }
      .cx-go:hover { background: var(--kygo-green); color: #fff; }
      .cx-go .ico { width: 13px; height: 13px; }
      .ov { display: grid; grid-template-columns: 190px repeat(var(--n), minmax(0, 1fr)); background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; overflow: hidden; }
      .ov > * { border-top: 1px solid #EEF2F6; }
      .ov > .ov-h { border-top: 0; }
      .ov-h { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 10px; background: #F8FAFC; font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--fg-1); }
      .ov-h .brand-img.sm { width: 28px; height: 28px; border-radius: 8px; }
      .ov-h0 { justify-content: flex-start; padding-left: 18px; font-size: 11px; letter-spacing: .5px; text-transform: uppercase; color: #64748B; }
      .ov-lab { display: flex; align-items: center; gap: 10px; padding: 12px 18px; background: none; border: 0; border-top: 1px solid #EEF2F6; text-align: left; font: inherit; font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--fg-1); cursor: pointer; }
      .ov-lab .ico { color: #3E6286; font-size: 17px; flex: none; }
      .ov-lab:hover span { color: var(--kygo-green-dark); text-decoration: underline; }
      .ov-c { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px 10px; font-size: 13.5px; color: var(--fg-1); text-align: center; line-height: 1.3; }
      .ov-c.na { color: var(--fg-3); font-size: 12.5px; }
      .ov-c.win { background: #F0FDF4; color: #15803D; font-weight: 600; }
      .ov-chk { width: 18px; height: 18px; border-radius: 50%; background: var(--kygo-green); color: #fff; display: inline-flex; align-items: center; justify-content: center; flex: none; }
      .ov-chk .ico svg { width: 10px; height: 10px; }
      @media (max-width: 639px) {
        .cx-cards { gap: 0 8px; }
        .cx-vsb { width: 30px; height: 30px; font-size: 10px; }
        .cx-card { padding: 14px 8px 12px; gap: 6px; border-radius: 14px; }
        .cx-card .brand-img { width: 40px; height: 40px; border-radius: 11px; }
        .cx-sel { max-width: none; }
        .cx-sel select { height: 36px; font-size: 13.5px; padding: 0 22px 0 6px; }
        .cx-sel .ico { right: 6px; font-size: 14px; }
        .cx-card-best { font-size: 11.5px; }
        .cx-card-sub { font-size: 11px; }
        .cx-tabs { margin: 0 -16px; padding: 2px 16px 6px; }
        .cx-tabs > :first-child { margin-left: 0; }
        .cx-tabs > :last-child { margin-right: 0; }
        .cx-panel { padding: 18px 14px; border-radius: 16px; }
        .cx-ico { width: 34px; height: 34px; font-size: 16px; }
        .cx-verdict { font-size: 14.5px; }
        .cx-foot { flex-direction: column; align-items: stretch; }
        .cx-go { justify-content: center; }
        .ov { grid-template-columns: 78px repeat(var(--n), minmax(0, 1fr)); border-radius: 14px; }
        .ov-h { flex-direction: column; gap: 4px; padding: 10px 4px; font-size: 11.5px; }
        .ov-h0 { padding-left: 10px; font-size: 9.5px; }
        .ov-lab { flex-direction: column; align-items: flex-start; gap: 3px; padding: 10px; font-size: 11px; }
        .ov-lab .ico { font-size: 15px; }
        .ov-c { flex-direction: column; gap: 3px; padding: 10px 4px; font-size: 11.5px; }
        .ov-c.na { font-size: 10.5px; }
        .ov-chk { width: 15px; height: 15px; }
      }

      /* v24 sleep chart */
      .sc-body { padding: 18px 22px 8px; }
      .sc-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 4px; }
      .sc-tabs { display: inline-flex; gap: 4px; background: #EEF2F6; border-radius: 999px; padding: 4px; }
      .sc-tab { display: inline-flex; align-items: center; gap: 6px; border: 0; background: transparent; border-radius: 999px; padding: 7px 14px; font-family: var(--font-display); font-weight: 600; font-size: 13px; color: #64748B; cursor: pointer; white-space: nowrap; }
      .sc-tab .ico, .sc-tab svg { width: 15px; height: 15px; }
      .sc-tab.on { background: #fff; color: var(--fg-1); box-shadow: 0 1px 3px rgba(15,23,42,0.10); }
      .sc-ts { display: none; }
      .sc-key { display: flex; gap: 14px; font-family: var(--font-display); font-size: 12px; font-weight: 600; color: #475569; }
      .sc-key span { display: inline-flex; align-items: center; gap: 6px; }
      .sc-key .sw { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
      .sw.h { background: var(--kygo-green); } .sw.c { background: #A7E8BF; }
      .sc-qrow { display: flex; align-items: center; justify-content: space-between; gap: 10px 16px; flex-wrap: wrap; margin: 12px 0 6px; }
      .sc-q { margin: 0; font-size: 14px; color: #475569; }
      .sc-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px 18px; flex-wrap: wrap; margin: 2px 0 8px; }
      .sc-foot .sc-refkey { margin: 0; }
      .sc-miss { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; font-family: var(--font-display); font-size: 12px; font-weight: 600; color: #94A3B8; }
      .sc-mi { display: inline-flex; align-items: center; gap: 5px; color: #64748B; }
      .sc-mi .brand-img { width: 20px; height: 20px; border-radius: 6px; flex: none; }
      .sc-row { display: grid; grid-template-columns: 250px 1fr; gap: 18px; align-items: center; padding: 14px 0; border-top: 1px solid #EEF2F6; }
      .sc-row:first-child { border-top: 0; }
      .sc-dev { display: flex; align-items: center; gap: 10px; min-width: 0; }
      .sc-dev .brand-name { font-family: var(--font-display); font-weight: 700; font-size: 14px; color: var(--fg-1); }
      .sc-dev .brand-model { display: block; font-weight: 500; font-size: 12px; color: #64748B; }
      .sc-buy { margin-left: auto; }
      .sc-bars { display: grid; gap: 6px; }
      .sc-bar { display: grid; grid-template-columns: 1fr 104px; align-items: center; gap: 12px; }
      .sc-track { position: relative; height: 12px; border-radius: 99px; background: #F1F5F9; }
      .sc-fill, .sc-rng { position: absolute; top: 0; bottom: 0; border-radius: 99px; }
      .sc-fill { left: 0; width: 0; transition: width .9s var(--ease-out); }
      .sc-rng { left: var(--l); width: 0; opacity: .45; transition: width .9s var(--ease-out) .3s; }
      .visible .sc-fill, .cx-panel .sc-fill { width: var(--w); }
      .visible .sc-rng, .cx-panel .sc-rng { width: var(--w); }
      .sc-bar.h .sc-fill, .sc-bar.h .sc-rng { background: var(--kygo-green); }
      .sc-bar.c .sc-fill, .sc-bar.c .sc-rng { background: #A7E8BF; }
      .sc-bar.c .sc-rng { opacity: .6; }
      .sc-ref { position: absolute; left: var(--l); top: -4px; bottom: -4px; border-left: 2px dashed #0F172A; opacity: .35; }
      .sc-val { font-family: var(--font-display); font-weight: 700; font-size: 14px; color: var(--fg-1); white-space: nowrap; }
      .sc-bar.alt .sc-fill, .sc-bar.alt .dv-fill { opacity: .45; }
      .sc-alt { margin-left: 6px; font-family: var(--font-body, inherit); font-weight: 500; font-size: 11px; color: #64748B; }
      .sc-bar.is-na .sc-val { font-weight: 500; font-size: 12.5px; color: #94A3B8; }
      .sc-bar.is-na .sc-track { background: repeating-linear-gradient(90deg, #F1F5F9 0 6px, transparent 6px 10px); }
      .sc-refkey { display: flex; align-items: center; gap: 8px; margin: 2px 0 8px; font-size: 12px; color: #64748B; }
      .sc-refmark { width: 0; height: 14px; border-left: 2px dashed #0F172A; opacity: .35; }
      @media (prefers-reduced-motion: reduce) { .sc-fill, .sc-rng { transition: none; width: var(--w); } }
      @media (max-width: 767px) {
        .sc-body { padding: 14px 14px 6px; }
        .sc-top { flex-direction: column; align-items: stretch; }
        .sc-tabs { display: flex; }
        .sc-tab { flex: 1; justify-content: center; padding: 8px 6px; font-size: 12.5px; }
        .sc-tab svg { display: none; }
        .sc-tl { display: none; } .sc-ts { display: inline; }
        .sc-key { justify-content: center; }
        .sc-row { grid-template-columns: 1fr; gap: 10px; }
        .sc-bar { grid-template-columns: 1fr 92px; gap: 10px; }
        .sc-val { font-size: 13px; white-space: normal; }
      }

      /* v30 over/under chart */
      .dv-track { position: relative; height: 12px; border-radius: 99px; background: #F1F5F9; }
      .dv-zero { position: absolute; left: 50%; top: -5px; bottom: -5px; border-left: 2px solid #64748B; }
      .dv-fill { position: absolute; top: 0; bottom: 0; border-radius: 99px; background: var(--kygo-green); }
      .dv-band { position: absolute; top: 1px; bottom: 1px; border-radius: 99px; background: repeating-linear-gradient(135deg, rgba(34,197,94,0.55) 0 3px, rgba(34,197,94,0.12) 3px 6px); }
      .dv-band.out { background: repeating-linear-gradient(135deg, rgba(34,197,94,0.25) 0 3px, transparent 3px 6px); }
      .dv.l1 .dv-fill { background: #A7E8BF; }
      .dv.l1 .dv-band { background: repeating-linear-gradient(135deg, rgba(74,222,128,0.6) 0 3px, rgba(74,222,128,0.12) 3px 6px); }
      .dv.l1 .dv-band.out { background: repeating-linear-gradient(135deg, rgba(74,222,128,0.28) 0 3px, transparent 3px 6px); }
      .dv-fill.rng { opacity: .45; border-radius: 0 99px 99px 0; }
      .sw.band { background: repeating-linear-gradient(135deg, rgba(34,197,94,0.6) 0 2px, rgba(34,197,94,0.12) 2px 4px); }
      .dv-axis { display: grid; grid-template-columns: 250px 1fr; gap: 18px; margin-top: 4px; }
      .dv-axis::before { content: ''; }
      .dv-axis > span:last-child { display: none; }
      .dv-ax { display: grid; grid-template-columns: 1fr auto 1fr 104px; align-items: center; gap: 0 12px; font-family: var(--font-display); font-size: 11.5px; font-weight: 600; color: #94A3B8; }
      .dv-ax::after { content: ''; }
      .dv-ax > span { display: inline-flex; align-items: center; gap: 4px; }
      .dv-ax > span:first-child svg { transform: rotate(180deg); }
      .dv-ax > span:nth-child(3) { justify-content: flex-end; }
      .dv-ax svg { width: 12px; height: 12px; }
      .dv-ax b { color: #64748B; }
      @media (max-width: 767px) {
        .dv-axis { grid-template-columns: 1fr; gap: 0; }
        .dv-axis::before { display: none; }
        .dv-ax { grid-template-columns: 1fr auto 1fr 92px; gap: 0 10px; }
      }

      /* v33 grouped rows */
      .sc-grp { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; padding: 14px 0 4px; border-top: 1px solid #E2E8F0; }
      .sc-rows > .sc-grp:first-child { border-top: 0; padding-top: 4px; }
      .sc-grp-t { font-family: var(--font-display); font-weight: 700; font-size: 13px; letter-spacing: .3px; text-transform: uppercase; color: var(--kygo-green-dark); }
      .sc-grp-s { font-size: 12px; color: #64748B; }
      .metric-sec.section { padding-top: 22px; padding-bottom: 22px; }
      .m-card { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 22px; overflow: hidden; box-shadow: 0 1px 2px rgba(15,23,42,.04); }
      .m-card .m-card-head { max-width: none; margin: 0; padding: 26px 28px 20px; }
      .m-card .m-card-head h2 { font-size: clamp(22px, 2.4vw, 28px); line-height: 1.2; margin: 12px 0 8px; }
      .m-card .m-card-head .m-meta { margin-top: 12px; }
      .m-card .cmp { border: 0; border-radius: 0; border-top: 1px solid #EEF2F6; }
      .m-card-foot { display: flex; flex-direction: column; gap: 12px; padding: 16px 20px 20px; border-top: 1px solid #EEF2F6; }
      .m-card-foot .deep.m-links { border-radius: 14px; }
      @media (max-width: 767px) {
        .metric-sec.section { padding: 14px 12px; }
        .m-card { border-radius: 18px; }
        .m-card .m-card-head { padding: 18px 16px 14px; }
        .m-card-foot { padding: 12px 12px 12px; }
      }
      .sc-brand .sc-row { grid-template-columns: 76px 1fr; gap: 16px; }
      .sc-brand .sc-dev.sc-brand-cell { flex-direction: column; align-items: center; justify-content: center; gap: 6px; text-align: center; }
      .sc-brand .sc-brand-cell .brand-name { font-family: var(--font-display); font-weight: 700; font-size: 12.5px; color: var(--fg-1); line-height: 1.2; }
      @media (max-width: 767px) { .sc-brand .sc-row { grid-template-columns: 64px 1fr; gap: 12px; } }
      .sc-more { grid-column: 2; margin-top: -6px; }
      .sc-more > summary { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; list-style: none; font-size: 12.5px; font-weight: 600; color: #475569; padding: 4px 10px; border-radius: 99px; background: #F1F5F9; }
      .sc-more > summary::-webkit-details-marker { display: none; }
      .sc-more > summary svg { width: 12px; height: 12px; transition: transform .2s; }
      .sc-more[open] > summary svg { transform: rotate(45deg); }
      .sc-more ul { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 6px; }
      .sc-more li { display: grid; grid-template-columns: 130px 1fr auto; gap: 12px; align-items: baseline; font-size: 12.5px; color: #64748B; padding: 8px 12px; border-radius: 10px; background: #F8FAFC; }
      .scm-m { font-weight: 600; color: #0F172A; }
      .scm-v { font-family: var(--font-display); font-weight: 700; color: #0F172A; white-space: nowrap; }
      @media (max-width: 767px) { .sc-more { grid-column: 1 / -1; margin-top: 0; } .sc-more li { grid-template-columns: 1fr auto; } .sc-more .scm-n { grid-column: 1 / -1; grid-row: 2; } }
      .sc-ico { width: 36px; height: 36px; flex: none; border-radius: 10px; background: #EFF6FF; color: #1E3A5F; display: grid; place-items: center; }
      .sc-ico svg { width: 20px; height: 20px; }
      .sc-note .sc-notet { font-size: 12.5px; line-height: 1.4; color: #64748B; }
      .sc-callout { display: flex; align-items: flex-start; gap: 8px; margin: 12px 0 0; padding: 10px 14px; border-radius: 10px; background: #EFF6FF; color: #0F172A; font-size: 13px; line-height: 1.5; }
      .sc-callout svg { width: 16px; height: 16px; flex: none; margin-top: 2px; color: #3B82F6; }
      .sc-grp + .sc-row { border-top: 0; }

      /* v36 scoreboard: flat medals, quieter non-podium marks */
      .sb-medal { width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 700; font-size: 12.5px; line-height: 1; flex: none; position: relative; }
      .sb-medal.m1 { background: #F4C542; color: #5C4300; box-shadow: inset 0 0 0 2px #E0AE22; }
      .sb-medal.m2 { background: #DDE3EA; color: #334155; box-shadow: inset 0 0 0 2px #B9C3CF; }
      .sb-medal.m3 { background: #E8B48A; color: #5A3418; box-shadow: inset 0 0 0 2px #D0925F; }
      .sb .sb-weak { background: #fff; box-shadow: inset 0 0 0 2px #94A3B8; }
      .sb .sb-weak::after { background: #64748B; width: 10px; height: 2px; }
      .sb .sb-fair { background: #fff; box-shadow: inset 0 0 0 2px #94A3B8; }
      .sb .sb-fair::after { background: #64748B; width: 7px; height: 7px; }
      .sb .sb-none { border: 2px dashed #E2E8F0; }
      .sb-legend .sb-medal { width: 16px; height: 16px; font-size: 9px; box-shadow: none; }
      .sb-legend .sb-medals { display: inline-flex; gap: 3px; }
      .sb-legend .sb-weak { background: #fff; box-shadow: inset 0 0 0 1.5px #94A3B8; }
      .sb-legend .sb-weak::after { background: #64748B; }
      .sb-legend .sb-fair { background: #fff; box-shadow: inset 0 0 0 1.5px #94A3B8; }
      .sb-legend .sb-fair::after { background: #64748B; }
      .sb-legend .sb-none { border: 1.5px dashed #CBD5E1; }
      .sb-lab.sb-sub { font-weight: 500; font-size: 13px; color: #64748B; padding-top: 8px; padding-bottom: 8px; }
      .sb-lab.sb-sub::before { content: ''; width: 18px; height: 12px; margin-left: 4px; border-left: 1.5px solid #CBD5E1; border-bottom: 1.5px solid #CBD5E1; border-bottom-left-radius: 4px; transform: translateY(-4px); flex: none; }
      .sb-sub + .sb-c, .sb-sub ~ .sb-c { }
      .sb-rule { flex-basis: 100%; margin: 0; font-size: 12px; color: #64748B; }
      @media (max-width: 767px) { .sb-medal { width: 22px; height: 22px; font-size: 11px; } .sb-lab.sb-sub { font-size: 11.5px; line-height: 1.25; } .sb-lab.sb-sub::before { display: none; } }

      /* v37 scoreboard breakdowns */
      .sb-card:not(.open) .sb-x { display: none; }
      .sb-toggle { display: inline-flex; align-items: center; gap: 8px; border: 1.5px solid var(--kygo-green); background: #fff; color: var(--kygo-green-dark); border-radius: 999px; padding: 8px 16px; font-family: var(--font-display); font-weight: 600; font-size: 13px; cursor: pointer; }
      .sb-toggle svg { width: 15px; height: 15px; }
      .sb-toggle .sb-tg-on, .sb-toggle.on .sb-tg-off { display: none; }
      .sb-toggle.on .sb-tg-on { display: inline; }
      .sb-toggle.on { background: #F0FDF4; }
      .sb-lab.sb-sub, .sb-c.sb-x { background: #FBFCFE; }
      /* v61 design consistency */
      .sw.c { background: #9DB9D8; }
      .sc-bar.c .sc-fill, .sc-bar.c .sc-rng { background: #9DB9D8; }
      .dv.l1 .dv-fill { background: #9DB9D8; }
      .dv.l1 .dv-band { background: repeating-linear-gradient(135deg, rgba(62,98,134,0.5) 0 3px, rgba(62,98,134,0.10) 3px 6px); }
      .dv.l1 .dv-band.out { background: repeating-linear-gradient(135deg, rgba(62,98,134,0.22) 0 3px, transparent 3px 6px); }
      .sw.band.c { background: repeating-linear-gradient(135deg, rgba(62,98,134,0.55) 0 2px, rgba(62,98,134,0.10) 2px 4px); }
      .sw.band.n { background: repeating-linear-gradient(135deg, rgba(100,116,139,0.6) 0 2px, rgba(100,116,139,0.10) 2px 4px); }
      .sc-key span .sw + .sw { margin-left: -3px; }
      .sc-rng, .sc-bar.c .sc-rng, .sc-bar.h .sc-rng { background: transparent !important; opacity: 1 !important; box-sizing: border-box; border: 2px solid var(--kygo-green); border-left: 0; border-radius: 0 99px 99px 0; }
      .sc-bar.c .sc-rng { border-color: #9DB9D8; }
      .dv-fill.rng { background: transparent !important; opacity: 1; box-sizing: border-box; border: 2px solid var(--kygo-green); border-left: 0; }
      .sc-alt { display: block; margin: 1px 0 0; line-height: 1.2; white-space: nowrap; }
      .sc-val { white-space: nowrap; }

      .m-card .cmp-table thead th, .m-card .cmp-table thead .cmp-th-device { background: #F8FAFC; color: #64748B; border-bottom: 1px solid #EEF2F6; }
      .m-card .fda-total th, .m-card .fda-total td { background: #F8FAFC; }
      .fx-tab.on .fx-ico { background: var(--kygo-green); color: #fff; }
      .cx-sec .section-head { text-align: left; margin-left: 0; margin-right: 0; }
      .cx-sec .section-head .lede { margin-left: 0; margin-right: 0; }
      .cx-cards { margin: 0; }
      .cx-tabs > :first-child { margin-left: 0; }
      .dv.l1 .dv-band { background: repeating-linear-gradient(135deg, rgba(74,124,178,0.75) 0 3px, rgba(74,124,178,0.14) 3px 6px); }
      .sw.band.c { background: repeating-linear-gradient(135deg, rgba(74,124,178,0.8) 0 2px, rgba(74,124,178,0.14) 2px 4px); }
      .sc-brand .dv-axis { grid-template-columns: 76px 1fr; gap: 16px; }
      .dv-ax { grid-template-columns: 1fr 1fr 116px; gap: 0; }
      .dv-ax > span:first-child { grid-column: 1; grid-row: 1; justify-self: end; padding-right: 22px; }
      .dv-ax > b { grid-column: 1 / 3; grid-row: 1; justify-self: center; }
      .dv-ax > span:nth-child(3) { grid-column: 2; grid-row: 1; justify-self: start; padding-left: 22px; }
      .dv-ax::after { grid-column: 3; grid-row: 1; }
      @media (max-width: 767px) {
        .sc-top { min-width: 0; max-width: 100%; }
        .sc-brand .dv-axis { grid-template-columns: 64px 1fr; gap: 12px; }
        .sc-brand .dv-axis::before { display: block; }
        .dv-ax { grid-template-columns: 1fr 1fr 102px; }
        .dv-ax > span:first-child { padding-right: 12px; } .dv-ax > span:nth-child(3) { padding-left: 12px; }
        .sc-tabs { overflow-x: auto; scrollbar-width: none; max-width: 100%; min-width: 0; }
        .sc-tabs::-webkit-scrollbar { display: none; }
        .sc-tab { flex: 1 0 auto; padding: 8px 8px; }
        .sc-tabs { gap: 2px; }
        .sc-val { white-space: nowrap; }
        .fx-tab.on { border-color: var(--kygo-green); }
      }
      /* v64 section separation */
      .metric-sec.section { padding-top: 20px; padding-bottom: 20px; }
      .m-card { border: 1px solid #D9E1EA; box-shadow: 0 2px 10px rgba(15,23,42,.06); }
      .m-ico, .bg-light .m-ico { background: #F1F5F9; color: var(--kygo-dark); box-shadow: inset 0 0 0 1px #E2E8F0; }
      .m-ico svg { stroke-width: 2.25; }
      .m-ico[data-i="moon"] path, .m-ico[data-i="heart"] path, .m-ico[data-i="droplet"] path, .m-ico[data-i="flame"] path, .m-ico[data-i="thermo"] path,
      .m-ico[data-i="steps"] path, .m-ico[data-i="heartPulse"] path, .m-ico[data-i="shieldPlus"] path:first-child,
      .m-ico[data-i="lungs"] path:nth-child(-n+2) { fill: currentColor; }
      .m-ico[data-i="heartPulse"] polyline, .m-ico[data-i="shieldPlus"] path:nth-child(2) { stroke: #F1F5F9; stroke-width: 2; }
      .m-ico[data-i="activity"] svg, .m-ico[data-i="wind"] svg { stroke-width: 2.6; }
      .m-card .cmp { margin: 20px 22px 4px; border: 1px solid #DDE4EC; border-radius: 16px; overflow: hidden; background: #fff; }
      .m-card .m-card-chart > .cmp { border-top: 1px solid #DDE4EC; }
      .sc-row { border-top-color: #E6EBF1; }
      .m-card .cmp-legend { border-radius: 0; }
      .m-card-foot { border-top: 0; }
      @media (max-width: 767px) {
        .metric-sec.section { padding-top: 14px; padding-bottom: 14px; }
        .m-card .cmp { margin: 14px 12px 2px; border-radius: 14px; }
      }
      /* v66 trial: darker blue for headings and section icons */
      :host { --navy: #1E3A5F; }
      .hero-light h1, .section h2, section .rt-h2, section .rp-h2 { color: var(--navy); }
      .m-ico, .bg-light .m-ico { color: var(--navy); }

      /* v69 design consistency pass 2 */
      /* 1 hero on the same 1200px grid as every section */
      .hero-light-inner { max-width: 1248px; padding-left: 24px; padding-right: 24px; }
      @media (max-width: 639px) { .hero-light-inner { padding-left: 16px; padding-right: 16px; } }
      /* 2 compare: picker cards span the full width, metric tabs wrap instead of clipping */
      .cx-cards { max-width: none; }
      @media (min-width: 768px) { .cx-tabs { flex-wrap: wrap; overflow: visible; } }
      @media (min-width: 1100px) { .cx-tabs { gap: 6px; justify-content: center; } .cx-tabs > .cx-tab { flex: 0 1 auto; justify-content: center; padding: 7px 10px; margin: 0; } }
      /* 3 no dead gap between the metric jump nav and the first metric card */
      .jn-sec.section { padding-bottom: 28px; }
      @media (min-width: 1100px) { .jn { flex-wrap: nowrap; gap: 8px; } .jn > .jn-chip { flex: 1 1 auto; justify-content: center; padding-left: 8px; padding-right: 8px; } }
      @media (max-width: 639px) { .jn-sec.section { padding-bottom: 18px; } }
      /* 4 headings break into balanced lines */
      .section-head { max-width: 800px; }
      .section-head h2, .rt-h2, .rp-h2, .hero-light h1 { text-wrap: balance; }
      /* 10 FDA counts: one style, grey only for zero */
      .pill-n.good { background: #EAF1F8; color: #3E6286; }
      /* 11 big stat in the facts switcher matches the other big stats */
      .fx-stat { color: var(--kygo-green); }
      /* 14 and 15: one-view charts get a static label in the tab slot */
      .sc-tabs-one .sc-tab { cursor: default; flex: none; }
      .sc-tabs-one { align-self: flex-start; }
      .sc-qrow:has(> .sc-key:empty) .sc-key { display: none; }
      /* 17 upper limit drawn as an outline from zero */
      .dv-fill.rng.ub { border-left: 2px solid var(--kygo-green); border-radius: 99px; }
      /* 18 reference line lives in the key */
      .sc-key .sw.ref { width: 0; height: 14px; border-radius: 0; border-left: 2px dashed #64748B; background: none; margin: 0 4px; }
      /* 20 chart footnotes easier to read */
      .cmp-legend { font-size: 12.5px; line-height: 1.6; color: #64748B; }
      /* 21 chart panel lines up with the takeaway and drawers below it */
      .m-card .cmp { margin-left: 20px; margin-right: 20px; }
      @media (max-width: 767px) { .m-card .cmp { margin-left: 12px; margin-right: 12px; } }
      /* 22 one "missing" marker everywhere: the scoreboard's dashed circle */
      .mk.off { background: none; border: 2px dashed #E2E8F0; box-sizing: border-box; width: 26px; min-width: 26px; height: 26px; }
      .mk.off .dash { display: none; }
      /* 5, 6 and 23: skin temp table uses chart-style brands and plain values */
      .rank-plain .cmp-td-device.td-stack { padding: 12px 8px 12px 16px; width: 96px; min-width: 96px; }
      .rank-plain .td-stack .brand { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
      .rank-plain .td-stack .brand-name { font-family: var(--font-display); font-weight: 700; font-size: 12.5px; color: var(--fg-1); }
      .cell-plain { display: flex; flex-direction: column; align-items: center; gap: 2px; }
      .cp-v { font-family: var(--font-display); font-weight: 700; font-size: 14px; color: var(--fg-1); white-space: nowrap; }
      .cp-n { font-size: 11px; font-weight: 500; color: #64748B; line-height: 1.25; }
      .cp-na { font-family: var(--font-display); font-weight: 500; font-size: 12.5px; color: #94A3B8; }
      @media (max-width: 767px) {
        .rank-plain .cmp-td-device.td-stack { width: auto; min-width: 0; padding: 0; }
        .rank-plain .td-stack .brand { flex-direction: row; text-align: left; }
        .cell-plain { align-items: flex-end; text-align: right; }
        .cp-v { font-size: 13px; }
      }
      /* 7 FDA table brand headers: normal case, same type as the charts */
      .fda-table thead th .cr-dev-name { text-transform: none; letter-spacing: 0; }
      .fda-table .cell-note { text-transform: none; letter-spacing: 0; font-family: var(--font-body, inherit); font-size: 11px; font-weight: 500; color: #64748B; }
      .fda-table .cr-dev-name { font-weight: 700; font-size: 12.5px; color: var(--fg-1); }
      .fda-table .cr-dev .brand-img.sm { width: 34px; height: 34px; }
      /* 24 scoreboard sub-rows shaded across the whole row */
      .sb-c.sb-xs { background: #FBFCFE; }
      /* 25 scoreboard legend inside the card, styled like the chart footnotes */
      .sb-card { padding-bottom: 0; overflow: hidden; }
      .sb-card .sb-under { margin: 0 -24px; padding: 12px 24px 14px; border-top: 1px solid #E2E8F0; background: var(--bg-surface); }
      @media (max-width: 767px) { .sb-card .sb-under { margin: 0 -10px; padding: 12px 10px 14px; } }
      /* 26 chart tabs keep their full names on phones (the tab row scrolls) */
      @media (max-width: 767px) { .sc-tl { display: inline; } .sc-ts { display: none; } .sc-tab svg { display: inline-block; } }
      /* 27 related tools: Open row pinned to the card bottom */
      .rt-card .rt-body { flex: 1; } .rt-card .rt-foot { margin-top: auto; padding-top: 5px; }
      /* 28 FAQ uses the same plus icon as the drawers */
      .faq summary::after, .faq details[open] summary::after { content: none; }
      .faq summary { gap: 16px; }
      .faq summary .ico { width: 16px; height: 16px; flex: none; color: var(--kygo-green-dark); transition: transform .2s; }
      .faq details[open] summary .ico { transform: rotate(45deg); }
      /* 29 source cards: link icon pinned top right, never on its own line */
      .src { position: relative; padding-right: 34px; }
      .src .src-go { position: absolute; top: 13px; right: 13px; }
      /* 30 no italic text */
      .aff-disclosure, .footer-affiliate { font-style: normal; }
      /* v70 medals: ribbon and coin instead of numbered circles */
      .sb-medal, .sb-medal.m1, .sb-medal.m2, .sb-medal.m3 { background: none; box-shadow: none; border-radius: 0; width: 30px; height: 37px; }
      .sb-medal svg { width: 100%; height: 100%; display: block; overflow: visible; filter: drop-shadow(0 1px 1px rgba(15,23,42,.15)); }
      .sb-legend .sb-medal.m1, .sb-legend .sb-medal.m2, .sb-legend .sb-medal.m3 { width: 15px; height: 19px; }
      .sb-legend .sb-medal svg { filter: none; }
      @media (max-width: 767px) { .sb-medal, .sb-medal.m1, .sb-medal.m2, .sb-medal.m3 { width: 22px; height: 27px; } }

      /* ── v71: seventh brand (Polar). Scoreboard columns follow --sb-n; phone labels sized for 7 columns ── */
      @media (max-width: 639px) {
        .sb-hn { font-size: 8.5px; letter-spacing: -.1px; }
        .sb-buy { font-size: 8.5px; letter-spacing: -.1px; }
      }
      @media (max-width: 360px) { .sb-hn, .sb-buy { font-size: 7.5px; } }
`;
  }

  // ── Events ────────────────────────────────────────────────────────────

  _wire() {
    if (this._wired) return;
    this._wired = true;
    const root = this.shadowRoot;
    root.addEventListener('change', (e) => {
      const sl = e.target.closest('[data-cx-slot]');
      if (sl) this._setCmpSlot(+sl.dataset.cxSlot, sl.value);
    });
    root.addEventListener('click', (e) => {
      const gate = e.target.closest('[data-gate]');
      if (gate) { this._trackGate(gate.dataset.gate); return; }
      const jump = e.target.closest('[data-jump]');
      if (jump) { e.preventDefault(); this._jumpTo(jump.dataset.jump); return; }
      const ft = e.target.closest('[data-fact]');
      if (ft) { this._setFact(+ft.dataset.fact); return; }
      const fs = e.target.closest('[data-fact-step]');
      if (fs) { this._setFact((this._factIdx || 0) + +fs.dataset.factStep); return; }
      const sbt = e.target.closest('[data-sb-toggle]');
      if (sbt) { const card = root.querySelector('[data-sb-card]'); const open = !card.classList.contains('open'); card.classList.toggle('open', open); sbt.setAttribute('aria-expanded', open); sbt.classList.toggle('on', open); return; }
      const sct = e.target.closest('[data-sc]');
      if (sct) { const box = sct.closest('.sc'); box.querySelectorAll('[data-sc]').forEach(b => { const on = b === sct; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); }); box.querySelectorAll('[data-sc-panel]').forEach(p => { p.hidden = p.dataset.scPanel !== sct.dataset.sc; }); return; }
      const met = e.target.closest('[data-cx-metric]');
      if (met) { this._cmpMetric = met.dataset.cxMetric; this._refreshCmpr(); return; }
      if (e.target.closest('[data-src-toggle]')) { this._toggleSources(); return; }
    });
  }

  _setCmpSlot(i, k) {
    const s = this._cmpDevs;
    const j = s.indexOf(k);
    if (j > -1 && j !== i) s[j] = s[i];
    s[i] = k;
    this._refreshCmpr(true);
  }

  _refreshCmpr(full) {
    const root = this.shadowRoot;
    if (full) { const box = root.querySelector('[data-cmpr]'); if (box) box.innerHTML = this._renderComparator(); return; }
    root.querySelectorAll('[data-cx-metric]').forEach(b => { if (!b.classList.contains('cx-tab')) return; const on = b.dataset.cxMetric === this._cmpMetric; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    const panel = root.querySelector('[data-cx-panel]');
    if (panel) panel.innerHTML = this._renderCmprPanel();
  }

  _setupAnimations() {
    requestAnimationFrame(() => {
      const els = this.shadowRoot.querySelectorAll('.animate-on-scroll');
      if (!els.length || !('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visible')); return; }
      if (this._observer) this._observer.disconnect();
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); this._observer.unobserve(entry.target); } });
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0.01 });
      els.forEach(el => this._observer.observe(el));
    });
  }

  // ── Structured data (JSON-LD) ─────────────────────────────────────────

  _injectStructuredData() {
    const hs = this._heroStats;
    if (!document.querySelector('script[data-kygo-wearable-ld]')) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Wearable Accuracy Comparison Tool',
        'alternateName': 'Kygo Wearable Accuracy Comparison Tool',
        'description': `Metric-by-metric accuracy guide for Oura Ring, Apple Watch, Garmin, WHOOP, Fitbit, Samsung Galaxy Watch and Polar: sleep stages, HRV, resting and active heart rate, blood oxygen, steps, calories, VO2 max, skin temperature, respiratory rate and FDA-cleared features. Built from ${hs.studies} validation studies and ${hs.fda} FDA records with funding disclosed.`,
        'applicationCategory': 'HealthApplication',
        'operatingSystem': 'Web',
        'url': 'https://www.kygo.app/tools/wearable-accuracy',
        'datePublished': '2026-02-01',
        'dateModified': this._updated.pageIso,
        'softwareVersion': '2.0',
        'inLanguage': 'en',
        'isAccessibleForFree': true,
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        'featureList': `Accuracy scorecard for ${hs.devices} wearable brands across ${hs.metrics} metrics plus FDA features, ${hs.studies} validation studies, ${hs.funded} company-funded sources flagged, head-to-head comparison`,
        'keywords': 'most accurate wearable, wearable accuracy, Oura Ring accuracy, Apple Watch accuracy, Garmin accuracy, WHOOP accuracy, Fitbit accuracy, Samsung Galaxy Watch accuracy, Polar accuracy, sleep tracker accuracy, HRV accuracy, heart rate accuracy, SpO2 accuracy, blood oxygen smartwatch accuracy, step count accuracy, calorie burn accuracy, VO2 max accuracy, skin temperature accuracy, respiratory rate accuracy, FDA cleared wearable features'
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-kygo-wearable-ld', '');
      script.textContent = JSON.stringify(ld);
      __kygoAppendLdOnce(script);
    }

    if (!document.querySelector('script[data-kygo-wearable-faq]')) {
      const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': this._faqs.map(f => ({ '@type': 'Question', 'name': f.q, 'acceptedAnswer': { '@type': 'Answer', 'text': f.a } })) };
      const faqScript = document.createElement('script');
      faqScript.type = 'application/ld+json';
      faqScript.setAttribute('data-kygo-wearable-faq', '');
      faqScript.textContent = JSON.stringify(faq);
      __kygoAppendLdOnce(faqScript);
    }

    if (!document.querySelector('script[data-kygo-wearable-breadcrumb]')) {
      const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Kygo Health', 'item': 'https://www.kygo.app' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
          { '@type': 'ListItem', 'position': 3, 'name': 'Wearable Accuracy', 'item': 'https://www.kygo.app/tools/wearable-accuracy' }
        ]
      };
      const bcScript = document.createElement('script');
      bcScript.type = 'application/ld+json';
      bcScript.setAttribute('data-kygo-wearable-breadcrumb', '');
      bcScript.textContent = JSON.stringify(breadcrumb);
      __kygoAppendLdOnce(bcScript);
    }
  }
}

if (!customElements.get('kygo-wearable-accuracy')) customElements.define('kygo-wearable-accuracy', KygoWearableAccuracy);
