/**
 * Kygo Health - Wearable Accuracy Comparison Tool
 * Tag: kygo-wearable-accuracy
 * Interactive tool to compare wearable device accuracy backed by peer-reviewed research
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

class KygoWearableAccuracy extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._selectedDevices = ['apple-watch', 'oura'];
    this._activeMetric = 'overview';
    this._expandedDevice = null;
    this._expandedCaveats = new Set();
    this._eventsBound = false;
  }

  connectedCallback() {
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, 'Wearable Accuracy Comparison Tool by Kygo Health. Compare accuracy of Oura Ring, Apple Watch, Garmin, WHOOP, Fitbit, and Samsung Galaxy Watch across sleep staging, heart rate variability (HRV), resting heart rate, active heart rate, SpO2 blood oxygen, step counting, calorie tracking, VO2 max, and skin temperature. Data sourced from peer-reviewed studies including Robbins 2024, Dial 2025, Lee 2023, Schyvens 2025, Gielen 2026, Van Oost 2025, Kristiansson 2023 and Carrier 2025. Independent and funded study results compared side by side with bias disclosures. Best wearable for sleep staging: Apple Watch in healthy adults (kappa 0.53) and Fitbit across populations (0.42); every device drops sharply in clinical samples. Best for nocturnal HRV and resting heart rate: Oura Ring 4 (CCC 0.99 and 0.98). Best for daytime heart rate: Fitbit Charge 6 (MAPE 5.5%) and Garmin Vivoactive 5 (6.3%). Best for steps: Apple Watch and Garmin, both under 5% error in the lab; Oura is worst at 50.3% in free living. Best for VO2 max: Garmin, about 7% error across 3 independent studies. Calorie estimates are weak on every device, 27% to 93% error in the Stanford seven-device study. Best for SpO2: Apple Watch (MAE 2.2%). No single device wins every metric, and current hardware such as Oura Ring 5, WHOOP 5.0, Apple Watch Series 10 and 11 and Galaxy Watch 7 and 8 has no independent validation at all.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Data ──────────────────────────────────────────────────────────────

  get _devices() {
    return {
      'apple-watch': {
        name: 'Apple Watch',
        short: 'Apple Watch',
        color: '#A2AAAD',
        imageUrl: 'https://static.wixstatic.com/media/273a63_68b4900c356b4d0c8982e5ecd10f04fe~mv2.png',
        icon: '<img src="https://static.wixstatic.com/media/273a63_68b4900c356b4d0c8982e5ecd10f04fe~mv2.png" alt="Apple Watch" loading="lazy" />',
        bestFor: 'Heart rate, SpO2, Sleep (healthy adults), FDA features',
        subscription: 'None required',
        strengths: ['Near-zero pooled HR bias across 22 studies (Lambe 2026)', 'Best SpO2 (MAE 2.2%)', 'Top independent sleep \u03BA=0.53', 'Best wake detection (52.2%, healthy adults)', 'Best REM detection (68.6%, healthy adults)', 'FDA-cleared ECG & sleep apnea'],
        weaknesses: ['VO2 max underestimated in all 3 independent studies (MAPE 13 to 16%)', 'Clinical-sample staging drops to \u03BA=0.30 (Lee 2023)', 'Series 10, 11 and Ultra 3 have no HR or sleep validation', 'Underestimates deep sleep', 'Daily charging needed'],
        researchNote: null,
        studyIds: ['robbins2024', 'schyvens2025', 'lee2023', 'gielen2026', 'lambe2026', 'caserman2024', 'lambe2025', 'mayo2026', 'choe2025', 'kim2024', 'miwa2026', 'rowe2025'],
        affiliateLinks: [
          { name: 'Apple Watch', url: 'https://www.amazon.com/s?k=Apple%20Watch&rh=p_123%3A110955&tag=kygohealthapp-20' , slug: 'apple-watch-search' }
        ]
      },
      'oura': {
        name: 'Oura Ring',
        short: 'Oura Ring',
        color: '#C4A97D',
        imageUrl: 'https://static.wixstatic.com/media/273a63_722e50e1a554453eb4c71a2e7a58925d~mv2.png',
        icon: '<img src="https://static.wixstatic.com/media/273a63_722e50e1a554453eb4c71a2e7a58925d~mv2.png" alt="Oura Ring" loading="lazy" />',
        bestFor: 'HRV, Resting HR, Skin Temp, Recovery',
        subscription: '$5.99/mo required',
        strengths: ['Best nocturnal HRV (CCC 0.99, Ring 4)', 'Best nocturnal resting HR (CCC 0.98, Ring 4)', 'Smallest total-sleep-time bias (-3 min, 6-study meta)', 'Best skin temp (r\u00B2>0.99)', 'Comfortable sleep wear'],
        weaknesses: ['Worst measured step count (50.3% free-living error, Gen 2; overcounts 1,400 to 2,100 a day in both studies)', 'Daytime HR error 15% (Gen 3, Gielen 2026), bottom tier', 'Sleep staging \u03BA=0.35 in a clinical sample; 53% accuracy in sleep-clinic patients', 'Ring 5 has zero validation', 'No GPS, no screen'],
        researchNote: 'Sleep \u03BA=0.65 is from an Oura-funded study on screened healthy sleepers. The only independent staging numbers are clinical: \u03BA=0.35 (Lee 2023) and 53% accuracy (Herberger 2025). Oura was not in the independent Antwerp wrist study.',
        studyIds: ['robbins2024', 'dial2025', 'lee2023', 'gielen2026', 'kristiansson2023', 'herberger2025', 'khan2025'],
        affiliateLinks: [
          { name: 'Oura Ring', url: 'https://www.amazon.com/s?k=Oura%20Ring&tag=kygohealthapp-20' , slug: 'oura-ring-search' }
        ]
      },
      'garmin': {
        name: 'Garmin',
        short: 'Garmin',
        color: '#007CC3',
        imageUrl: 'https://static.wixstatic.com/media/273a63_c545c093c04d4ca4ade77e5ca43fd433~mv2.png',
        icon: '<img src="https://static.wixstatic.com/media/273a63_c545c093c04d4ca4ade77e5ca43fd433~mv2.png" alt="Garmin" loading="lazy" />',
        bestFor: 'Steps, GPS, Outdoor Sports, VO2 Max, Battery',
        subscription: 'None required',
        strengths: ['Under 5% step error in the lab (Vivoactive 4)', 'Most independently validated VO2 max (about 7% error, 3 studies)', 'Tier-1 daytime HR (Vivoactive 5, MAPE 6.3%)', 'Best GPS & battery life', 'Multi-sport tracking'],
        weaknesses: ['Poor sleep staging (\u03BA=0.21)', 'Poor wake detection (27.6%)', 'REM detection 33.1% and deep 47.5% (Vivosmart 4)', 'Lower HRV (CCC 0.87)', 'Resistance-training calories 57% off; walking 32%', 'Publishes no HR accuracy figure of its own', 'No flagship since the Fenix 6 has any peer-reviewed validation'],
        researchNote: 'HRV/sleep studies used Fenix 6 / Vivosmart 4 (older models). Every Garmin figure here is Fenix 6, Vivosmart 4 or Vivoactive 4/5. Fenix 8, Forerunner 970 and Venu 4 have nothing.',
        studyIds: ['schyvens2025', 'dial2025', 'gielen2026', 'deleon2026', 'rider2025', 'carrier2025', 'carrier2023', 'engel2026'],
        affiliateLinks: [
          { name: 'Garmin', url: 'https://www.amazon.com/s?k=garmin%20fitness%20tracker&tag=kygohealthapp-20' , slug: 'garmin-search' }
        ]
      },
      'whoop': {
        name: 'WHOOP',
        short: 'WHOOP',
        color: '#44B78B',
        imageUrl: 'https://static.wixstatic.com/media/273a63_c52aaaca1f7243f3818cf51d9374dbd4~mv2.png',
        icon: '<img src="https://static.wixstatic.com/media/273a63_c52aaaca1f7243f3818cf51d9374dbd4~mv2.png" alt="WHOOP" loading="lazy" />',
        bestFor: 'Recovery, Strain, Deep Sleep, Athlete Training',
        subscription: '$30/mo (12-month)',
        strengths: ['Best deep sleep detection (69.6%, independent, healthy)', 'Nocturnal HRV CCC 0.94, RHR CCC 0.91 (Dial 2025)', 'Continuous 24/7 wear, no screen to charge around'],
        weaknesses: ['Moderate sleep staging (\u03BA=0.37)', 'Poor wake detection (32.5%)', 'Daytime HR MAPE 8.5% vs 12-lead ECG, second worst of five (Van Oost 2025)', 'Total-sleep-time bias +24.5 min (Schyvens 2025)', 'WHOOP 5.0 and MG have no validation; VO2 max is 5.0/MG only', 'No screen, expensive subscription'],
        researchNote: null,
        studyIds: ['schyvens2025', 'dial2025', 'vanoost2025'],
        affiliateLinks: [
          { name: 'WHOOP', url: 'https://www.amazon.com/s?k=whoop%20fitness%20tracker&tag=kygohealthapp-20' , slug: 'whoop-search' }
        ]
      },
      'fitbit': {
        name: 'Fitbit',
        short: 'Fitbit',
        color: '#00B0B9',
        imageUrl: 'https://static.wixstatic.com/media/273a63_c12bab319dc34737a386c7449f5f92c7~mv2.png',
        icon: '<img src="https://static.wixstatic.com/media/273a63_c12bab319dc34737a386c7449f5f92c7~mv2.png" alt="Fitbit" loading="lazy" />',
        bestFor: 'General Fitness, Sleep Basics, Affordability',
        subscription: 'Premium optional ($9.99/mo)',
        strengths: ['Moderate sleep accuracy (\u03BA=0.42\u20130.55)', 'Most population-robust staging: \u03BA=0.42 healthy and clinical', 'Best daytime HR in a ten-device test (Charge 6, MAPE 5.5%)', 'Under 4% step error on a treadmill (Inspire 2)', 'FDA-cleared irregular rhythm', 'Affordable entry point'],
        weaknesses: ['No sleep or step validation for any model newer than the Sense / Inspire 2; Charge 6 has HR only', 'Overcounts steps by 18% in free living (Sense)', 'Pooled HR under-reads by 3.4 bpm with wide limits (Chevance 2022)', 'Worst device in the same ten-device HR test was also a Fitbit (Inspire 3, 16.5%)'],
        researchNote: null,
        studyIds: ['robbins2024', 'schyvens2025', 'lee2023', 'gielen2026', 'cheung2025', 'miwa2026', 'chevance2022'],
        affiliateLinks: [
          { name: 'Fitbit', url: 'https://www.amazon.com/s?k=Fitbit%3A&rh=p_123%3A213215&tag=kygohealthapp-20' , slug: 'fitbit-search' }
        ]
      },
      'samsung': {
        name: 'Samsung Galaxy Watch',
        short: 'Samsung',
        color: '#F59E0B',
        imageUrl: 'https://static.wixstatic.com/media/273a63_21fd42e4a5d1459bb6db751a0ea5e161~mv2.png',
        icon: '<img src="https://static.wixstatic.com/media/273a63_21fd42e4a5d1459bb6db751a0ea5e161~mv2.png" alt="Samsung Galaxy Watch" loading="lazy" />',
        bestFor: 'Android Users, Sleep Apnea Screening, SpO2',
        subscription: 'None required',
        strengths: ['Near-ECG heart rate on a hospital treadmill test (Galaxy Watch 4, ICC 0.997, Kim 2023)', 'FDA-cleared sleep apnea detection', 'Validated respiratory rate (RMSE 1.13)', 'FDA-cleared ECG', 'Good Android integration'],
        weaknesses: ['HR agreement drops above 160 bpm', 'No independent VO2 max, step or sleep validation for any current model; Galaxy Watch 7, 8 and Galaxy Ring have nothing', 'Limited independent accuracy studies', 'Less validation data than Apple/Oura'],
        researchNote: null,
        studyIds: ['lee2023', 'kim2023', 'park2023resp', 'lanfranchi2024'],
        affiliateLinks: [
          { name: 'Samsung Galaxy Watch', url: 'https://www.amazon.com/s?k=samsung%20galaxy%20watch&rh=p_72%3A1248879011&tag=kygohealthapp-20' , slug: 'samsung-watch-search' }
        ]
      }
    };
  }

  get _metrics() {
    return {
      sleep: {
        name: 'Sleep Staging',
        desc: 'How accurately the device classifies sleep into Wake, Light, Deep, and REM stages compared to polysomnography (PSG).',
        unit: "Cohen's \u03BA",
        unitExplainer: '\u03BA (kappa) measures agreement with a lab sleep study: 0 = random chance, 1 = perfect match',
        goldStandard: 'Polysomnography (PSG)',
        higherBetter: true,
        scale: { min: 0, max: 0.8 },
        data: {
          'apple-watch': [
            { value: 0.60, label: '\u03BA=0.60', study: 'Robbins 2024 (healthy)', biased: true, funder: 'Oura' },
            { value: 0.53, label: '\u03BA=0.53', study: 'Schyvens 2025 (healthy)', biased: false },
            { value: 0.30, label: '\u03BA=0.30', study: 'Lee 2023 (clinical)', biased: false }
          ],
          'oura': [
            { value: 0.65, label: '\u03BA=0.65', study: 'Robbins 2024 (healthy, Gen 3)', biased: true, funder: 'Oura' },
            { value: 0.35, label: '\u03BA=0.35', study: 'Lee 2023 (clinical, Gen 3)', biased: false }
          ],
          'garmin': [
            { value: 0.21, label: '\u03BA=0.21', study: 'Schyvens 2025 (healthy, Vivosmart 4)', biased: false }
          ],
          'whoop': [
            { value: 0.37, label: '\u03BA=0.37', study: 'Schyvens 2025 (healthy, 4.0)', biased: false }
          ],
          'fitbit': [
            { value: 0.55, label: '\u03BA=0.55', study: 'Robbins 2024 (healthy, Sense 2)', biased: true, funder: 'Oura' },
            { value: 0.42, label: '\u03BA=0.42', study: 'Schyvens 2025 (healthy, Sense)', biased: false },
            { value: 0.42, label: '\u03BA=0.42', study: 'Lee 2023 (clinical, Sense 2)', biased: false }
          ],
          'samsung': [
            { value: 0.5, label: '\u03BA=0.4\u20130.6', study: 'Lee 2023 (clinical, Galaxy Watch 5)', biased: false }
          ]
        },
        insight: 'Healthy vs clinical is the axis that matters. Every device scores far higher in screened healthy sleepers than in people with sleep complaints: Apple falls from 0.53 to 0.30, Oura from 0.65 to 0.35 (and to 53% accuracy in a Berlin sleep-clinic sample, Herberger 2025). Fitbit is the most population-robust at 0.42 in both. In independent healthy testing nobody clears about 0.53. The Robbins 0.65 for Oura is a legitimate study on a screened sample, not a method trick, but Oura was not in the independent wrist study (Schyvens), so its only independent staging numbers are clinical.'
      },
      hrv: {
        name: 'Nocturnal HRV',
        desc: 'Heart rate variability measured during sleep, a key recovery and stress indicator.',
        unit: 'CCC',
        unitExplainer: 'CCC measures correlation with a chest-strap ECG: 0 = no agreement, 1 = perfect match',
        goldStandard: 'Polar H10 ECG chest strap',
        higherBetter: true,
        scale: { min: 0.7, max: 1.0 },
        data: {
          'apple-watch': [],
          'oura': [
            { value: 0.99, label: 'CCC 0.99', study: 'Dial 2025 (Ring 4)', biased: false },
            { value: 0.97, label: 'CCC 0.97', study: 'Dial 2025 (Gen 3)', biased: false }
          ],
          'garmin': [
            { value: 0.87, label: 'CCC 0.87', study: 'Dial 2025 (Fenix 6)', biased: false }
          ],
          'whoop': [
            { value: 0.94, label: 'CCC 0.94', study: 'Dial 2025 (4.0)', biased: false }
          ],
          'fitbit': [],
          'samsung': []
        },
        insight: 'Oura Ring 4 is the clear winner for nocturnal HRV with near-perfect agreement. Accuracy decreases above 60 ms of HRV (relevant for very fit individuals). Apple Watch, Fitbit, and Samsung were not included in this study.'
      },
      rhr: {
        name: 'Resting Heart Rate',
        desc: 'How accurately the device measures resting heart rate during sleep.',
        unit: 'CCC',
        unitExplainer: 'CCC measures correlation with a chest-strap ECG: 0 = no agreement, 1 = perfect match',
        goldStandard: 'Polar H10 ECG chest strap',
        higherBetter: true,
        scale: { min: 0.7, max: 1.0 },
        data: {
          'apple-watch': [],
          'oura': [
            { value: 0.98, label: 'CCC 0.98', study: 'Dial 2025 (Ring 4)', biased: false },
            { value: 0.97, label: 'CCC 0.97', study: 'Dial 2025 (Gen 3)', biased: false }
          ],
          'garmin': [],
          'whoop': [
            { value: 0.91, label: 'CCC 0.91', study: 'Dial 2025 (4.0)', biased: false }
          ],
          'fitbit': [],
          'samsung': []
        },
        insight: 'Oura Ring leads for resting heart rate accuracy. Ring 4 was validated on 138 nights, Gen 3 on 470. Oura Ring 5 shipped June 2026 with a redesigned sensor and has no validation of any kind yet; the Ring 4 figures do not transfer. Garmin Fenix 6 was excluded due to timestamp reporting issues. Apple Watch, Fitbit, and Samsung were not tested in this study.'
      },
      activeHr: {
        name: 'Active Heart Rate',
        desc: 'Heart rate accuracy during exercise and physical activity.',
        unit: 'MAPE %',
        unitExplainer: 'Mean absolute percentage error against a chest strap or ECG during walking and light activity. Lower is better.',
        goldStandard: 'Chest strap or 12-lead ECG',
        higherBetter: false,
        scale: { min: 0, max: 20 },
        data: {
          'apple-watch': [
            { value: 7.3, label: 'MAPE 7.3%', study: 'Gielen 2026 (Watch SE, budget model)', biased: false }
          ],
          'oura': [
            { value: 15.0, label: 'MAPE 15.0%', study: 'Gielen 2026 (Gen 3, daytime)', biased: false }
          ],
          'garmin': [
            { value: 6.3, label: 'MAPE 6.3%', study: 'Gielen 2026 (Vivoactive 5)', biased: false }
          ],
          'whoop': [
            { value: 8.52, label: 'MAPE 8.5%', study: 'Van Oost 2025 (4.0, 12-lead ECG)', biased: false }
          ],
          'fitbit': [
            { value: 5.5, label: 'MAPE 5.5%', study: 'Gielen 2026 (Charge 6)', biased: false },
            { value: 16.5, label: 'MAPE 16.5%', study: 'Gielen 2026 (Inspire 3)', biased: false }
          ],
          'samsung': [
            { value: 2, label: 'MAPE under 2%', study: 'Kim 2023 (Galaxy Watch 4, cardiac stress test)', biased: false }
          ]
        },
        insight: 'Read this as tiers, not a ranking. Gielen 2026 tested ten devices but only two per participant, so the range is quotable and the order is not. The failure mode is irregular arm movement, not intensity: steady running is one of the easiest conditions, racquet and field sport the worst. Night is easy, day is hard, and every manufacturer accuracy claim (WHOOP 99.7%, Oura 99%) comes from sleep data. Two free fixes: wear the watch three finger-widths above the wrist bone and tighten the strap.'
      },
      spo2: {
        name: 'Blood Oxygen (SpO2)',
        desc: 'Blood oxygen saturation measurement accuracy. Important for detecting sleep apnea and respiratory issues.',
        unit: 'MAE %',
        unitExplainer: 'Mean Absolute Error: average error in percentage points vs. a medical device. Lower is better',
        goldStandard: 'Medical-grade pulse oximeter',
        higherBetter: false,
        scale: { min: 0, max: 8 },
        data: {
          'apple-watch': [
            { value: 2.2, label: 'MAE 2.2%', study: 'PLOS/Nature studies', biased: false }
          ],
          'oura': [],
          'garmin': [
            { value: 4.5, label: 'MAE ~4.5%', study: 'Validation studies (Fenix 6)', biased: false },
            { value: 5.8, label: 'MAE 5.8%', study: 'Validation studies (Venu 2s)', biased: false }
          ],
          'whoop': [],
          'fitbit': [],
          'samsung': [
            { value: 3.0, label: 'Reliable', study: 'J Clin Sleep Med 2024', biased: true, funder: 'Samsung' }
          ]
        },
        insight: 'Apple Watch leads with MAE of 2.2%, but only 58% of readings fall within clinical accuracy range. Skin pigmentation and tattoos affect all SpO2 sensors. No wearable SpO2 is medical-grade.'
      },
      steps: {
        name: 'Step Counting',
        desc: 'How accurately the device counts steps during daily activity.',
        unit: 'MAPE %',
        unitExplainer: 'Mean absolute percentage error vs a hand count or research pedometer. Lab and free-living are different tests, so each bar says which.',
        goldStandard: 'Manual count (lab) or ActiGraph / pedometer (free-living)',
        higherBetter: false,
        scale: { min: 0, max: 55 },
        data: {
          'apple-watch': [
            { value: 6.4, label: 'MAPE 6.4%', study: 'Kim 2024, Sensors (Series 6, free-living)', biased: false },
            { value: 2.1, label: '+2.1%', study: 'Miwa 2026, PLOS ONE (Series 6, free-living, 3 weeks)', biased: false },
            { value: 9.3, label: 'MAPE 9.3%', study: 'Rowe 2025, PLOS ONE (Series 5, slow and shuffle walking)', biased: false }
          ],
          'oura': [
            { value: 50.3, label: 'MAPE 50.3%', study: 'Kristiansson 2023 corrected (Gen 2, free-living vs pedometer, pre-2025 algorithm)', biased: false }
          ],
          'garmin': [
            { value: 4.6, label: 'MAPE 4.6%', study: 'de Leon 2026, Applied Sciences (Vivoactive 4, lab)', biased: false },
            { value: 15, label: 'about -15%', study: 'Rider 2025, JMPB (Fenix 6, lab; equivalent in the field)', biased: false }
          ],
          'whoop': [
            { value: null, label: 'No published validation', study: 'No peer-reviewed step study exists for any WHOOP', biased: false }
          ],
          'fitbit': [
            { value: 3.6, label: 'MAPE 3.6%', study: 'Cheung 2025 (Inspire 2, treadmill)', biased: false },
            { value: 18.0, label: '+18.0%', study: 'Miwa 2026, PLOS ONE (Sense, free-living, 3 weeks)', biased: false }
          ],
          'samsung': [
            { value: null, label: 'No MAPE published', study: 'Galaxy Watch 4: r=0.82 vs activPAL, no error figure reported', biased: false }
          ]
        },
        insight: 'In the lab, Apple, Garmin and Fitbit all land under 5% on a normal walk. Free living separates them: Apple Watch stays within a few percent over three weeks, Fitbit overcounts by about 18%, and the only two studies to measure Oura both found it overcounting by 1,400 to 2,100 steps a day. Oura\'s 2025 "Real Steps" algorithm undercounts instead and has no published validation. No Fitbit newer than the Sense or Inspire 2, no Pixel Watch, and no WHOOP has any peer-reviewed step validation. <a href="https://www.kygo.app/tools/step-count-accuracy" data-action="internal-link" data-track-label="step-count-accuracy" data-track-position="metric-insight">Full breakdown in the step count accuracy tool.</a>'
      },
      calories: {
        name: 'Calorie / Energy',
        desc: 'How accurately the device estimates energy expenditure (calories burned).',
        unit: 'MAPE %',
        unitExplainer: 'Error in daily energy expenditure against indirect calorimetry or doubly labelled water. Only devices with a daily-level study get a bar.',
        goldStandard: 'Indirect calorimetry / doubly labelled water',
        higherBetter: false,
        scale: { min: 0, max: 40 },
        data: {
          'apple-watch': [
            { value: 28.0, label: 'MAPE about 28%', study: 'Choe and Kang 2025 (56-study meta, daily)', biased: false }
          ],
          'oura': [
            { value: 13.0, label: 'MAPE 13%', study: 'Kristiansson 2023 corrected (free-living daily; 21.1% in the lab)', biased: false }
          ],
          'garmin': [
            { value: null, label: 'No daily MAPE', study: 'Parak 2017, JMIR mHealth: steady cardio about 6.7%, light activity 16.5% (Firstbeat engine, PulseOn device). Bout-level, not comparable to the daily bars.', biased: false }
          ],
          'whoop': [
            { value: null, label: 'No published figure', study: 'The 18.4% TDEE figure is unverifiable, no primary publication', biased: false }
          ],
          'fitbit': [
            { value: null, label: 'No daily MAPE', study: 'Chevance 2022: pooled bias 0.19 kcal/min, limits -5.3 to +5.7', biased: false }
          ],
          'samsung': [
            { value: null, label: 'No daily MAPE', study: '9 to 21% in one small study', biased: false }
          ]
        },
        insight: 'Every wearable is weak at calories and none should be used as a counter. The cleanest multi-device figure is the Stanford study (Shcherbina 2017): across seven devices, energy expenditure error ran 27% to 93% while heart rate on the same devices was under 5%. Oura\'s 13% daily figure beats Apple\'s 28% pooled, but a ring has almost no motion signal when the hand is still, so it undercounts cycling, lifting and hard efforts. <a href="https://www.kygo.app/tools/calorie-burn-accuracy" data-action="internal-link" data-track-label="calorie-burn-accuracy" data-track-position="metric-insight">Use the calorie burn accuracy calculator for your device and activity.</a>'
      },
      vo2max: {
        name: 'VO2 Max',
        desc: 'Estimated maximal oxygen uptake, a key indicator of cardiovascular fitness.',
        unit: 'MAPE %',
        unitExplainer: 'Mean Absolute Percentage Error: average % off from a lab test. Lower is better',
        goldStandard: 'Laboratory metabolic cart',
        higherBetter: false,
        scale: { min: 0, max: 20 },
        data: {
          'apple-watch': [
            { value: 15.8, label: 'MAPE 15.8%', study: 'Caserman 2024 (Series 7, underestimates)', biased: false },
            { value: 13.3, label: 'MAPE 13.3%', study: 'Lambe 2025 (S9 / Ultra 2, -6.07 mL/kg/min)', biased: false },
            { value: 13.2, label: 'MAPE 13.2%', study: 'Mayo Clin Proc Digital Health 2026 (Series 10, -6.25 mL/kg/min)', biased: false }
          ],
          'oura': [
            { value: null, label: 'No independent data', study: 'Vendor claim only, from a 6-minute walk test', biased: false }
          ],
          'garmin': [
            { value: 7.05, label: 'MAPE 7.05%', study: 'Carrier 2025, Sensors (Fenix 6)', biased: false },
            { value: 6.85, label: 'MAPE 6.85%', study: 'Carrier 2023 (Fenix 6 + chest strap, elite sample)', biased: false },
            { value: 6.7, label: 'MAPE 6.7%', study: 'Engel 2026 (Forerunner 245; 9.4 to 10.4% in highly trained)', biased: false }
          ],
          'whoop': [
            { value: null, label: 'No independent data', study: 'Vendor claim only. VO2 max is WHOOP 5.0 and MG only, a 4.0 cannot produce it', biased: false }
          ],
          'fitbit': [
            { value: 10.2, label: 'MAPE about 10%', study: 'Freeberg 2019 (Charge 2, retired algorithm, small overestimate). Klepin 2019, n=60, also under 10%.', biased: false },
            { value: null, label: 'No current validation', study: 'Since 19 May 2026 Google derives VO2 max from outdoor GPS runs only; that method has no published validation', biased: false }
          ],
          'samsung': [
            { value: null, label: 'No independent data', study: 'Vendor claim only. The University of Michigan 82% figure is company-funded', biased: false }
          ]
        },
        insight: 'Method beats brand. Estimates built from a real outdoor run have about zero group-level bias against the lab; estimates built from resting heart rate overestimate by about 2 mL/kg/min (INTERLIVE 2022 meta). Either way individual error is wide. Garmin has the most independent validation of any brand at roughly 7% error; Apple has three independent studies and underestimates in all of them. Accuracy degrades in highly trained users, and the one elite study that avoided this used a chest strap. Use it as a trend, not a number.'
      },
      temp: {
        name: 'Skin Temperature',
        desc: 'Skin temperature measurement accuracy, useful for illness detection and menstrual cycle tracking.',
        unit: 'r\u00B2',
        unitExplainer: 'r\u00B2 measures how well readings track lab sensors: 0 = no correlation, 1 = perfect fit',
        goldStandard: 'iButton research-grade sensors',
        higherBetter: true,
        scale: { min: 0.8, max: 1.0 },
        data: {
          'apple-watch': [],
          'oura': [
            { value: 0.99, label: 'r\u00B2>0.99 (lab)', study: 'Oura 2024', biased: true, funder: 'Oura' },
            { value: 0.92, label: 'r\u00B2>0.92 (real-world)', study: 'Oura 2024', biased: true, funder: 'Oura' }
          ],
          'garmin': [],
          'whoop': [],
          'fitbit': [],
          'samsung': []
        },
        insight: 'Oura is the only device with published skin temperature validation data, but it comes from Oura\'s own study. Finger placement provides more consistent skin contact than wrist-based devices. Validated independently for menstrual cycle tracking (83.3% ovulation detection).'
      }
    };
  }

  get _useCases() {
    return [
      { icon: 'moon', label: 'Sleep Tracking', devices: ['apple-watch', 'fitbit'], confidence: 'Moderate', note: 'Apple best in healthy adults (\u03BA=0.53), Fitbit most robust across populations (0.42)' },
      { icon: 'heartPulse', label: 'HRV & Recovery', devices: ['oura'], confidence: 'High', note: 'Ring 4 CCC 0.99, nocturnal only' },
      { icon: 'activity', label: 'Active Heart Rate', devices: ['fitbit', 'garmin'], confidence: 'High', note: 'Charge 6 and Vivoactive 5 in the top tier of a ten-device test; model matters more than brand' },
      { icon: 'steps', label: 'Step Counting', devices: ['apple-watch', 'garmin'], confidence: 'High', note: 'Both under 5% in the lab; Apple within a few percent in free living' },
      { icon: 'lungs', label: 'VO2 Max / Fitness', devices: ['garmin'], confidence: 'Moderate', note: 'About 7% error, 3 independent studies; use for trends' },
      { icon: 'droplet', label: 'SpO2 / Blood Oxygen', devices: ['apple-watch'], confidence: 'Moderate', note: 'MAE 2.2%, but not medical-grade' },
      { icon: 'shieldPlus', label: 'Medical Features', devices: ['apple-watch', 'samsung'], confidence: 'High', note: 'FDA-cleared ECG & sleep apnea' },
      { icon: 'dumbbell', label: 'Athlete Recovery', devices: ['whoop', 'oura'], confidence: 'Moderate', note: 'Deep sleep + HRV tracking' }
    ];
  }

  // Hero counts, derived from the metric/device/study data so they can never drift.
  get _heroStats() {
    const studies = Object.values(this._studies);
    return {
      metrics: Object.keys(this._metrics).length,
      devices: Object.keys(this._devices).length,
      studies: studies.length,
      funded: studies.filter(s => !s.independent).length
    };
  }

  get _studies() {
    return {
      robbins2024: { authors: 'Robbins R, et al.', year: 2024, title: 'Accuracy of Three Commercial Wearable Devices for Sleep Tracking', journal: 'Sensors', doi: '10.3390/s24206532', n: 35, independent: false, funder: 'Oura Ring Inc.' },
      dial2025: { authors: 'Dial MB, et al.', year: 2025, title: 'Validation of nocturnal resting HR and HRV in consumer wearables', journal: 'Physiological Reports', doi: '10.14814/phy2.70527', n: '13 (536 nights)', independent: true, funder: null },
      lee2023: { authors: 'Lee T, et al.', year: 2023, title: 'Accuracy of 11 Wearable Consumer Sleep Trackers', journal: 'JMIR mHealth', doi: '10.2196/50983', n: '75 (clinical, mean AHI 18)', independent: true, funder: null, note: 'Several authors are affiliated with Asleep Co., maker of a competing tracker that came top. The Oura, Fitbit and Apple values used here are competitor devices, so the conflict cuts against them, not for them.' },
      schyvens2025: { authors: 'Schyvens AM, et al.', year: 2025, title: 'Performance of six consumer sleep trackers vs polysomnography', journal: 'Sleep Advances', doi: '10.1093/sleepadvances/zpaf016', n: 62, independent: true, funder: null },
      herberger2025: { authors: 'Herberger S, et al.', year: 2025, title: 'Oura Ring Gen 3 in sleep-clinic patients', journal: 'Scientific Reports', doi: '10.1038/s41598-025-93756-1', n: 45, independent: true, funder: null },
      khan2025: { authors: 'Khan S, et al.', year: 2025, title: 'Oura Ring sleep measurement: systematic review and meta-analysis', journal: 'OTO Open', doi: '10.1002/oto2.70181', n: '6 studies, 388 participants', independent: true, funder: null },
      gielen2026: { authors: 'Gielen J, et al.', year: 2026, title: 'Ten-device wrist heart rate validation', journal: 'JMIR Formative Research', doi: '10.2196/85186', n: '45 (10 sessions per device)', independent: true, funder: null, note: 'KU Leuven. Two devices per participant, so the range is quotable and the order is not.' },
      vanoost2025: { authors: 'Van Oost L, et al.', year: 2025, title: 'Five wearables vs 12-lead ECG during exercise', journal: 'Sensors', doi: '10.3390/s25206319', n: 24, independent: true, funder: null },
      kim2023: { authors: 'Kim J, et al.', year: 2023, title: 'Apple Watch 7 and Galaxy Watch 4 vs 12-lead ECG during cardiopulmonary exercise testing', journal: 'Annals of Rehabilitation Medicine', doi: '10.5535/arm.23090', n: '44 cardiac patients', independent: true, funder: null },
      lambe2026: { authors: 'Lambe RF, et al.', year: 2026, title: 'Apple Watch accuracy: living systematic review', journal: 'npj Digital Medicine', doi: '10.1038/s41746-026-01463-y', n: '82 studies', independent: true, funder: null },
      chevance2022: { authors: 'Chevance G, et al.', year: 2022, title: 'Accuracy and precision of energy expenditure, heart rate and steps measured by Fitbit', journal: 'JMIR mHealth', doi: '10.2196/35626', n: '32 heart-rate studies', independent: true, funder: null },
      choe2025: { authors: 'Choe S, Kang D', year: 2025, title: 'Apple Watch validity for heart rate and energy expenditure: meta-analysis', journal: 'Physiological Measurement', doi: null, n: '56 studies', independent: true, funder: null },
      shcherbina2017: { authors: 'Shcherbina A, et al.', year: 2017, title: 'Accuracy in wrist-worn devices for heart rate and energy expenditure', journal: 'Journal of Personalized Medicine', doi: '10.3390/jpm7020003', n: 60, independent: true, funder: null },
      kristiansson2023: { authors: 'Kristiansson E, et al.', year: 2023, title: 'Validation of Oura Ring energy expenditure and steps in free-living conditions', journal: 'BMC Medical Research Methodology', doi: '10.1186/s12874-023-02029-w', n: null, independent: true, funder: null, note: 'Cite the 9 September 2023 correction, not the original.' },
      miwa2026: { authors: 'Miwa H, et al.', year: 2026, title: 'Apple Watch Series 6 and Fitbit Sense free-living steps vs ActiGraph', journal: 'PLOS ONE', doi: null, n: 22, independent: true, funder: null },
      kim2024: { authors: 'Kim Y, et al.', year: 2024, title: 'Apple Watch Series 6 free-living step counting vs activPAL', journal: 'Sensors', doi: null, n: null, independent: true, funder: null },
      deleon2026: { authors: 'de Leon A, et al.', year: 2026, title: 'Garmin Vivoactive 4 treadmill step-count validity', journal: 'Applied Sciences', doi: null, n: 18, independent: true, funder: null },
      rider2025: { authors: 'Rider BC, et al.', year: 2025, title: 'Four smartwatches in laboratory and field conditions', journal: 'Journal for the Measurement of Physical Behaviour', doi: null, n: 12, independent: true, funder: null },
      cheung2025: { authors: 'Cheung J, et al.', year: 2025, title: 'Fitbit Inspire 2 treadmill step accuracy', journal: 'Physiotherapy Practice and Research', doi: null, n: 30, independent: true, funder: null },
      rowe2025: { authors: 'Rowe DA, et al.', year: 2025, title: 'Apple Watch step counting during slow and shuffling gait', journal: 'PLOS ONE', doi: null, n: null, independent: true, funder: null },
      carrier2025: { authors: 'Carrier B, et al.', year: 2025, title: 'Garmin Fenix 6 VO2 max estimation validity', journal: 'Sensors', doi: '10.3390/s25010275', n: null, independent: true, funder: null },
      carrier2023: { authors: 'Carrier B, et al.', year: 2023, title: 'Garmin Fenix 6 with chest strap in an athletic sample', journal: 'Technologies', doi: '10.3390/technologies11030071', n: 20, independent: true, funder: null },
      engel2026: { authors: 'Engel FA, et al.', year: 2026, title: 'Forerunner 245 VO2 max in highly vs moderately trained runners', journal: 'European Journal of Applied Physiology', doi: null, n: 35, independent: true, funder: null },
      caserman2024: { authors: 'Caserman P, et al.', year: 2024, title: 'Apple Watch VO2 Max Estimation', journal: 'JMIR Biomedical Engineering', doi: '10.2196/59459', n: null, independent: true, funder: null },
      lambe2025: { authors: 'Lambe RF, et al.', year: 2025, title: 'Validation of Apple Watch VO2 max estimates', journal: 'PLOS ONE', doi: '10.1371/journal.pone.0323741', n: null, independent: true, funder: null },
      mayo2026: { authors: 'Mayo Clinic investigators', year: 2026, title: 'Apple Watch Series 10 VO2 max validity', journal: 'Mayo Clinic Proceedings: Digital Health', doi: null, n: 40, independent: true, funder: null },
      freeberg2019: { authors: 'Freeberg KA, et al.', year: 2019, title: 'Fitbit Charge 2 VO2 max estimation', journal: 'mHealth', doi: '10.21037/mhealth.2019.09.07', n: null, independent: true, funder: null },
      molina2022: { authors: 'Molina-Garcia P, et al. (INTERLIVE)', year: 2022, title: 'Validity of consumer wearable VO2 max estimates: systematic review and meta-analysis', journal: 'Sports Medicine', doi: '10.1007/s40279-021-01639-y', n: 'Meta-analysis', independent: true, funder: null },
      park2023resp: { authors: 'Park et al.', year: 2023, title: 'Validating a Consumer Smartwatch for Nocturnal Respiratory Rate', journal: 'Sensors', doi: '10.3390/s23187867', n: null, independent: false, funder: 'Samsung' },
      lanfranchi2024: { authors: 'Lanfranchi et al.', year: 2024, title: 'Samsung Galaxy Watch SpO2 validation', journal: 'J Clin Sleep Med', doi: '10.5664/jcsm.11178', n: null, independent: false, funder: 'Samsung' }
    };
  }

  // ── Icons ─────────────────────────────────────────────────────────────

  _icon(name) {
    return ({
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
    })[name] || '';
  }

  // Flat source list for the standard sources module, built from the same
  // study records the device deep-dives cite. Funding is the card's tag, so a
  // vendor-funded result is labelled before it is read. A study with no DOI
  // renders as a dashed, non-clickable card rather than being dropped.
  get _sources() {
    return Object.values(this._studies).map(st => ({
      tag: st.independent ? 'Independent' : (st.funder ? st.funder.replace(/ Inc\.$/, '') + '-funded' : 'Funded'),
      title: st.title,
      cite: `${st.authors} ${st.year}. ${st.journal.replace(/\.$/, '')}${st.n ? ', n=' + st.n : ''}.`,
      url: st.doi ? 'https://doi.org/' + st.doi : null
    }));
  }

  // ── Sources · Kygo standard module (compact cards + show-all toggle) ────
  // Source shape: { tag, title, cite, url }. `tag` doubles as the group label
  // on tools whose sources are grouped by topic; `cite` is optional; a source
  // with no `url` renders as a dashed, non-clickable card rather than being
  // dropped. First 6 show, the rest sit behind "Show all N sources".

  _renderSourceCards(list) {
    return list.map(s => {
      const tag = `<span class="src-tag">${s.tag}</span>`;
      const title = `<span class="src-title">${s.title}</span>`;
      if (!s.url) {
        return `<div class="src src--nolink">${tag}${title}<span class="src-cite">${s.cite || ''}</span></div>`;
      }
      // With no citation line, fall back to the host so every card keeps the
      // same three-line rhythm and the link icon never sits on its own row.
      const cite = s.cite || s.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      return `<a class="src" href="${s.url}" target="_blank" rel="noopener nofollow" data-action="source-link" data-track-label="${s.title}" data-track-position="sources">${tag}${title}<span class="src-cite">${cite} <span class="src-go">${this._icon('externalLink')}</span></span></a>`;
    }).join('');
  }

  _renderSources() {
    const list = this._sources;
    const rest = list.slice(6);
    return `
      <div class="sources">${this._renderSourceCards(list.slice(0, 6))}</div>
      ${rest.length ? `
      <div class="sources src-extra" data-src-extra hidden>${this._renderSourceCards(rest)}</div>
      <div class="src-toggle-wrap">
        <button type="button" class="src-toggle" data-src-toggle aria-expanded="false">${this._icon('arrowRight')} <span data-src-toggle-label>Show all ${list.length} sources</span></button>
      </div>` : ''}`;
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

  get _caveats() {
    return [
      { title: 'No single device wins everywhere', body: 'The best wearable depends entirely on which metric matters most to you. A device that excels at HRV may be poor at step counting, and vice versa.' },
      { title: 'Healthy vs clinical is the biggest gap', body: 'The same device scores far higher in screened healthy young sleepers than in people with sleep complaints. Oura Gen 3 goes from \u03BA=0.65 to 0.35; Apple from 0.53 to 0.30. Numbers from healthy cohorts do not describe the people most likely to be reading this.' },
      { title: 'Study funding matters', body: 'Industry-funded studies tend to favor the funder\'s device. The primary sleep study (Robbins et al.) was Oura-funded and ranked Oura #1. Independent studies (Lee, Schyvens, Herberger) reached different conclusions. The funded Oura study used the same method as the independent ones; its higher number comes from screening out anyone with a sleep disorder, not from a method trick. We flag every study\'s funding source throughout this tool.' },
      { title: 'Current hardware is barely studied', body: 'Peer review lags hardware by 2 to 4 years. Oura Ring 5, WHOOP 5.0 and MG, Apple Watch Series 10, 11 and Ultra 3, Galaxy Watch 7 and 8, Pixel Watch 3 and 4, and every Garmin flagship since the Fenix 6 have no independent validation for any metric on this page. Validation of one generation does not transfer to the next.' },
      { title: 'Device generations change fast', body: 'Some studies tested older hardware (e.g., Garmin Fenix 6, Vivosmart 4). These are 2+ generations behind current models. Results may not reflect the latest firmware and sensor updates.' },
      { title: 'Small sample sizes are common', body: 'The HRV study (Dial 2025) had only 13 participants across 536 nights. The Antwerp sleep study had 62 participants for a single night. The Oura-funded sleep study had 35. Larger, multi-site studies are needed to draw definitive conclusions.' },
      { title: 'All wearables are estimates, not diagnostics', body: 'No consumer wearable is a medical device (except specific FDA-cleared features like Apple Watch ECG). Wearable data should inform your health awareness, not replace professional medical evaluation.' },
      { title: 'Individual variation is significant', body: 'Accuracy varies based on skin tone, tattoos, BMI, device fit, and activity level. Most validation studies have predominantly Caucasian participants, a documented research gap in wearable accuracy.' },
      { title: 'Calorie tracking is weak across all devices', body: 'In the Stanford seven-device study, calorie error ran from 27% to 93% while heart rate on the same devices was under 5%. No wearable should be relied upon as a precise calorie counter.' },
      { title: 'Even the gold standard has limits', body: 'Polysomnography (the "gold standard" for sleep) has inter-rater reliability of \u03BA\u22480.75, meaning trained experts disagree about 25% of the time on sleep staging. All consumer devices tend to misclassify wake, deep, and REM as light sleep.' }
    ];
  }

  // ── Icons ─────────────────────────────────────────────────────────────

  _getUseCaseIcon(name) {
    const icons = {
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      heartPulse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      steps: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="4" r="2"/><path d="M9.5 21 12 15l2 3 3.5-7"/><path d="M6 16l3-5 3.5 1"/></svg>',
      lungs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
      droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
      shieldPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>',
      dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>'
    };
    return icons[name] || icons.activity;
  }

  _getAffiliateUrl(deviceKey) {
    const d = this._devices[deviceKey];
    return (d && d.affiliateLinks && d.affiliateLinks.length) ? d.affiliateLinks[0].url : null;
  }

  // ── Render Helpers ─────────────────────────────────────────────────────

  _renderDeviceSummaryRow() {
    const devices = this._devices;
    return this._selectedDevices.map(dk => {
      const d = devices[dk];
      const affUrl = this._getAffiliateUrl(dk);
      const nameHtml = affUrl
        ? `<a href="${affUrl}" class="ds-name-link" target="_blank" rel="noopener sponsored" data-track-label="${d.affiliateLinks[0].slug}">${d.name}</a>`
        : d.name;
      return `
      <div class="device-summary-card" style="--accent:${d.color}">
        <div class="ds-icon">${d.icon}</div>
        <h3>${nameHtml}</h3>
        <div class="ds-best-for">${d.bestFor}</div>
        <div class="ds-sub">${d.subscription}</div>
      </div>`;
    }).join('');
  }

  _renderMetricTabs() {
    const available = Object.entries(this._metrics).filter(([k, m]) =>
      this._selectedDevices.some(dk => m.data[dk] && m.data[dk].length > 0)
    );
    if (this._activeMetric !== 'overview' && !available.some(([k]) => k === this._activeMetric) && available.length) {
      this._activeMetric = 'overview';
    }
    const overviewTab = `<button class="metric-tab ${this._activeMetric === 'overview' ? 'active' : ''}" data-metric="overview" role="tab">Overview</button>`;
    return overviewTab + available.map(([k, m]) =>
      `<button class="metric-tab ${k === this._activeMetric ? 'active' : ''}" data-metric="${k}" role="tab">${m.name}</button>`
    ).join('');
  }

  _renderOverview() {
    const devices = this._devices;
    const metrics = this._metrics;
    const dk1 = this._selectedDevices[0];
    const dk2 = this._selectedDevices[1];
    const d1 = devices[dk1];
    const d2 = devices[dk2];

    const available = Object.entries(metrics).filter(([k, m]) =>
      [dk1, dk2].some(dk => m.data[dk] && m.data[dk].length > 0)
    );

    const rows = available.map(([k, m]) => {
      const e1 = (m.data[dk1] || []).filter(e => e.value != null);
      const e2 = (m.data[dk2] || []).filter(e => e.value != null);
      const best1 = e1.length ? (m.higherBetter ? e1.reduce((a, b) => a.value > b.value ? a : b) : e1.reduce((a, b) => a.value < b.value ? a : b)) : null;
      const best2 = e2.length ? (m.higherBetter ? e2.reduce((a, b) => a.value > b.value ? a : b) : e2.reduce((a, b) => a.value < b.value ? a : b)) : null;

      let winner = 'tie';
      if (best1 && best2) {
        if (m.higherBetter) winner = best1.value > best2.value ? 'dev1' : best1.value < best2.value ? 'dev2' : 'tie';
        else winner = best1.value < best2.value ? 'dev1' : best1.value > best2.value ? 'dev2' : 'tie';
      } else if (best1 && !best2) {
        winner = 'dev1';
      } else if (!best1 && best2) {
        winner = 'dev2';
      }

      const val1 = best1 ? best1.label : 'No data';
      const val2 = best2 ? best2.label : 'No data';
      const biased1 = best1 && best1.biased;
      const biased2 = best2 && best2.biased;

      return `<div class="ov-row">
        <div class="ov-metric">${m.name}</div>
        <div class="ov-val ${winner === 'dev1' ? 'ov-winner' : ''}" style="--accent:${d1.color}">${val1}${biased1 ? '<span class="ov-biased">*</span>' : ''}</div>
        <div class="ov-val ${winner === 'dev2' ? 'ov-winner' : ''}" style="--accent:${d2.color}">${val2}${biased2 ? '<span class="ov-biased">*</span>' : ''}</div>
      </div>`;
    }).join('');

    // Count wins
    let wins1 = 0, wins2 = 0;
    available.forEach(([k, m]) => {
      const e1 = (m.data[dk1] || []).filter(e => e.value != null);
      const e2 = (m.data[dk2] || []).filter(e => e.value != null);
      const best1 = e1.length ? (m.higherBetter ? e1.reduce((a, b) => a.value > b.value ? a : b) : e1.reduce((a, b) => a.value < b.value ? a : b)) : null;
      const best2 = e2.length ? (m.higherBetter ? e2.reduce((a, b) => a.value > b.value ? a : b) : e2.reduce((a, b) => a.value < b.value ? a : b)) : null;
      if (best1 && best2) {
        if (m.higherBetter) { if (best1.value > best2.value) wins1++; else if (best2.value > best1.value) wins2++; }
        else { if (best1.value < best2.value) wins1++; else if (best2.value < best1.value) wins2++; }
      } else if (best1 && !best2) wins1++;
      else if (!best1 && best2) wins2++;
    });

    const summaryText = wins1 > wins2
      ? `${d1.short} leads in ${wins1} of ${available.length} comparable metrics.`
      : wins2 > wins1
      ? `${d2.short} leads in ${wins2} of ${available.length} comparable metrics.`
      : `Both devices are evenly matched across ${available.length} metrics.`;

    return `
      <div class="ov-header">
        <h3>Quick Overview</h3>
        <span class="ov-summary">${summaryText}</span>
      </div>
      <div class="ov-table">
        <div class="ov-row ov-row-header">
          <div class="ov-metric">Metric</div>
          <div class="ov-val ov-val-header" style="--accent:${d1.color}"><img src="${d1.imageUrl}" alt="${d1.short}" class="ov-device-icon" /> ${d1.short}</div>
          <div class="ov-val ov-val-header" style="--accent:${d2.color}"><img src="${d2.imageUrl}" alt="${d2.short}" class="ov-device-icon" /> ${d2.short}</div>
        </div>
        ${rows}
      </div>
      <div class="ov-footer">
        <span class="ov-biased-note">* Value from industry-funded study</span>
      </div>
      <div class="ov-strengths">
        <div class="ov-str-col">
          <h4 style="color:${d1.color}">${d1.short} Best For</h4>
          <p>${d1.bestFor}</p>
        </div>
        <div class="ov-str-col">
          <h4 style="color:${d2.color}">${d2.short} Best For</h4>
          <p>${d2.bestFor}</p>
        </div>
      </div>
    `;
  }

  _renderMetricDetail() {
    if (this._activeMetric === 'overview') return this._renderOverview();
    const devices = this._devices;
    const metric = this._metrics[this._activeMetric];
    return `
      <div class="md-header">
        <h3>${metric.name}</h3>
        <span class="md-gold">Gold Standard: ${metric.goldStandard}</span>
      </div>
      <p class="md-desc">${metric.desc}</p>
      ${metric.unitExplainer ? `<div class="md-unit-explainer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg> <span>${metric.unitExplainer}</span></div>` : ''}
      <div class="md-bars">
        ${this._selectedDevices.map(dk => {
          const d = devices[dk];
          const entries = metric.data[dk] || [];
          if (!entries.length) {
            return `<div class="md-bar-group">
              <div class="md-bar-label" style="--accent:${d.color}">${d.short}</div>
              <div class="md-no-data">No data available for this metric</div>
            </div>`;
          }
          return `<div class="md-bar-group">
            <div class="md-bar-label" style="--accent:${d.color}">${d.short}</div>
            ${entries.map(e => {
              // Some devices have a documented finding but no figure on this
              // metric's axis (different criterion, or vendor claim only). They
              // get a note row instead of a bar so the text still ships.
              if (e.value == null) {
                return `<div class="md-bar-note"><span class="md-bar-note-val">${e.label}</span> ${e.study}</div>`;
              }
              const pct = metric.higherBetter
                ? ((e.value - metric.scale.min) / (metric.scale.max - metric.scale.min)) * 100
                : ((metric.scale.max - e.value) / (metric.scale.max - metric.scale.min)) * 100;
              const clamped = Math.max(5, Math.min(100, pct));
              return `<div class="md-bar-row">
                <div class="md-bar-track">
                  <div class="md-bar-fill ${e.biased ? 'biased' : ''}" style="width:${clamped}%;background:${d.color}"></div>
                </div>
                <div class="md-bar-value">${e.label}</div>
                <div class="md-bar-study ${e.biased ? 'biased-text' : ''}">${e.study}${e.biased ? ' <span class="funded-badge">' + (e.funder || 'Industry') + ' Funded</span>' : ''}</div>
              </div>`;
            }).join('')}
          </div>`;
        }).join('')}
      </div>
      <div class="md-insight">
        <div class="md-insight-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
        <p>${metric.insight}</p>
      </div>
    `;
  }

  _renderStudiesForDevice(deviceKey) {
    const device = this._devices[deviceKey];
    if (!device || !device.studyIds) return '';
    const studies = this._studies;
    const relevant = device.studyIds.filter(id => studies[id]).map(id => studies[id]);
    if (!relevant.length) return '';
    return `
      <div class="dd-studies">
        <h4>Research Sources</h4>
        ${relevant.map(s => `
          <div class="dd-study-row ${s.independent ? '' : 'dd-study-funded'}">
            <span class="dd-study-badge ${s.independent ? 'independent' : 'funded'}">${s.independent ? 'Independent' : (s.funder ? s.funder.replace(/ Inc\.$/, '') + ' Funded' : 'Funded')}</span>
            <span class="dd-study-cite">${s.authors} (${s.year}). ${s.journal}${s.n ? ', n=' + s.n : ''}${s.note ? ' <span class="dd-study-note">' + s.note + '</span>' : ''}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ── Comparison update (surgical, no re-render) ─────────────────────────

  _updateComparison() {
    const shadow = this.shadowRoot;
    const detail = shadow.querySelector('.metric-detail');
    const tabs = shadow.querySelector('.metric-tabs');
    const summary = shadow.querySelector('.device-summary-row');
    if (detail) detail.innerHTML = this._renderMetricDetail();
    if (tabs) tabs.innerHTML = this._renderMetricTabs();
    if (summary) summary.innerHTML = this._renderDeviceSummaryRow();
  }

  // ── Main Render ────────────────────────────────────────────────────────

  // Related tools · Kygo standard module ────────────────────────────────
  // Exactly 3 cards: a near neighbour, a bridge between accuracy and
  // physiology, and one from another family. Never links this page to
  // itself, and never links the Food Scanner.

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
        title: 'What\'s the Most Accurate Wearable? 17 Studies, 6 Devices, Ranked (2026)',
        blurb: 'Seventeen independent studies on sleep, HRV, heart rate and step accuracy, with the actual numbers behind each device.',
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
      headline: `No device wins everywhere. <span>Kygo reads them all.</span>`,
      sub: `Whichever wearable you own, Kygo connects to it and cross-checks every metric against what you actually eat, train and sleep.`
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
    const c = this._appCta();
    const ios = 'https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy';
    const android = 'https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO';
    const badges = [
      ['273a63_56ac2eb53faf43fab1903643b29c0bce', 'Oura Ring', 'Oura'],
      ['273a63_1a1ba0e735ea4d4d865c04f7c9540e69', 'Apple Health', 'Apple'],
      ['273a63_c451e954ff8740338204915f904d8798', 'Fitbit', 'Fitbit'],
      ['273a63_0a60d1d6c15b421e9f0eca5c4c9e592b', 'Garmin', 'Garmin'],
      ['273a63_21019d0fbe9e4afcbabdb3ca9dcad89d', 'WHOOP', 'WHOOP'],
      ['273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e', 'Google Health', 'Google'],
      ['273a63_0c0e48cc065d4ee3bf506f6d47440518', 'Health Connect', 'Health']
    ].map(([id, name, label]) => `<span class="kc-chip"><span class="kc-chip-tile"><img src="https://static.wixstatic.com/media/${id}~mv2.png" alt="${name}" title="${name}" loading="lazy" /></span><span class="kc-chip-label">${label}</span></span>`).join('');
    const appleIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 12.5c-.02-2.1 1.71-3.11 1.79-3.16-.98-1.43-2.5-1.62-3.03-1.64-1.29-.13-2.52.76-3.17.76-.65 0-1.66-.74-2.73-.72-1.4.02-2.7.82-3.42 2.07-1.46 2.54-.37 6.3 1.05 8.36.7 1.01 1.53 2.14 2.62 2.1 1.05-.04 1.45-.68 2.72-.68 1.27 0 1.63.68 2.74.66 1.13-.02 1.85-1.03 2.54-2.04.8-1.17 1.13-2.3 1.15-2.36-.03-.01-2.2-.84-2.22-3.35zM15.02 5.9c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.53.62-1 1.61-.88 2.56.93.07 1.88-.47 2.46-1.16z"/></svg>';
    const androidIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 9v7a1 1 0 001 1h1v3a1 1 0 002 0v-3h4v3a1 1 0 002 0v-3h1a1 1 0 001-1V9H6zM4.5 9A1.5 1.5 0 003 10.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 004.5 9zm15 0a1.5 1.5 0 00-1.5 1.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 0019.5 9zM15.5 4.2l1-1.4a.3.3 0 00-.5-.35l-1.1 1.53a5.9 5.9 0 00-3.8 0L9.99 2.45a.3.3 0 00-.5.35l1 1.4A5.28 5.28 0 006 8.2h12a5.28 5.28 0 00-2.5-4zM9.5 6.4a.6.6 0 110-1.2.6.6 0 010 1.2zm5 0a.6.6 0 110-1.2.6.6 0 010 1.2z"/></svg>';
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
      @media(max-width:420px){.kc-badges{gap:4px}.kc-chip-tile{width:36px;height:36px}.kc-chip-label{font-size:9.5px}}
      @media(max-width:360px){.kc-badges{gap:2px}.kc-chip-tile{width:28px;height:28px}.kc-chip-label{font-size:7.5px}}
      </style>
      <section class="kc-section${bg === 'gray' ? ' kc-gray' : ''}" id="get-the-app">
        <div class="kc-inner">
          <div class="kc-card animate-on-scroll">
            <div class="kc-pill"><span class="kc-dot"></span> Free Forever Plan</div>
            <h3 class="kc-h">${c.headline}</h3>
            <p class="kc-p">${c.sub}</p>
            <div class="kc-btns">
              <a class="kc-btn cta-primary" href="${ios}" target="_blank" rel="noopener" data-track-position="early" data-track-label="${c.slug}-early-ios">${appleIcon} Download for iOS</a>
              <a class="kc-btn cta-android" href="${android}" target="_blank" rel="noopener" data-action="android-download" data-track-position="early" data-track-label="${c.slug}-early-android">${androidIcon} Download for Android</a>
            </div>
            <p class="kc-note">Free plan available. Save 58% on yearly. Cancel anytime.</p>
            <div class="kc-works">
              <span>Works with</span>
              <div class="kc-badges">${badges}</div>
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

  render() {
    const hs = this._heroStats;
    const devices = this._devices;
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <!-- Header -->
      <header class="header">
        <div class="header-inner">
          <a href="https://www.kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" />
            Wearable Accuracy
          </a>
          <div class="nav-cta-group">
            <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" class="nav-store-btn nav-store-ios cta-primary" data-track-label="subnav-get-app-ios" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on the App Store"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg><span>iOS</span></a>
            <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" class="nav-store-btn nav-store-android cta-android" data-action="android-download" data-track-label="subnav-get-app-android" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on Google Play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg><span>Android</span></a>
          </div>
        </div>
      </header>

      <!-- Hero -->
      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill animate-on-scroll"><span class="dot"></span> ${hs.metrics} METRICS · ${hs.studies} STUDIES · BIAS DISCLOSED</div>
              <h1 class="animate-on-scroll">Which wearable is <span class="hl">actually the most accurate?</span></h1>
              <p class="hero-lede animate-on-scroll">No single device wins everywhere. We read ${hs.studies} validation studies on Oura, Apple Watch, Garmin, WHOOP, Fitbit and Samsung, compared them metric by metric, and <strong>flagged who funded each one</strong>.</p>
            </div>
            <div class="hero-vis animate-on-scroll">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> Same ring, two funders</span>
                <span class="hero-vis-tag">who paid matters</span>
              </div>
              <div class="hv-two">
                <div class="hv-col">
                  <span class="hv-label">Oura-funded</span>
                  <span class="hv-val good">0.65</span>
                  <div class="hv-bar"><span class="hv-fill good" style="width:87%"></span></div>
                  <span class="hv-cap good">Screened healthy sleepers</span>
                </div>
                <div class="hv-col">
                  <span class="hv-label">Independent</span>
                  <span class="hv-val">0.35</span>
                  <div class="hv-bar"><span class="hv-fill" style="width:47%"></span></div>
                  <span class="hv-cap">Clinical sample (Lee 2023)</span>
                </div>
              </div>
              <span class="hv-foot">Cohen's kappa · Oura sleep staging · ${hs.funded} of ${hs.studies} studies here are vendor-funded</span>
            </div>
          </div>
          <div class="hero-stats animate-on-scroll">
            <div class="hero-stat"><div class="num">${hs.metrics}</div><div class="lbl">Health metrics compared</div></div>
            <div class="hero-stat"><div class="num">${hs.devices}</div><div class="lbl">Devices head to head</div></div>
            <div class="hero-stat"><div class="num">${hs.studies}</div><div class="lbl">Validation studies read</div></div>
            <div class="hero-stat"><div class="num">${hs.funded}</div><div class="lbl">Vendor-funded, flagged</div></div>
          </div>
        </div>
      </section>

      <!-- Head-to-Head Comparison -->
      <section class="comparison" id="compare">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Head-to-Head Comparison</h2>
          <p class="section-sub animate-on-scroll">Select two devices and explore accuracy data metric by metric.</p>

          <div class="device-selectors animate-on-scroll">
            <div class="selector-group">
              <label>Device 1</label>
              <div class="selector-wrap">
                <select id="device1">
                  ${Object.entries(devices).map(([k, d]) => `<option value="${k}" ${k === this._selectedDevices[0] ? 'selected' : ''}>${d.name}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="vs-badge">VS</div>
            <div class="selector-group">
              <label>Device 2</label>
              <div class="selector-wrap">
                <select id="device2">
                  ${Object.entries(devices).map(([k, d]) => `<option value="${k}" ${k === this._selectedDevices[1] ? 'selected' : ''}>${d.name}</option>`).join('')}
                </select>
              </div>
            </div>
          </div>

          <div class="device-summary-row animate-on-scroll">${this._renderDeviceSummaryRow()}</div>

          <div class="metric-tabs animate-on-scroll" role="tablist">${this._renderMetricTabs()}</div>

          <div class="metric-detail animate-on-scroll">${this._renderMetricDetail()}</div>
        </div>
      </section>
      ${this._renderAppCta()}

      <!-- Early contextual CTA -->

      <!-- Inline email capture (~50% depth, below the early app CTA) -->

      <!-- Device Deep Dives -->
      <section class="deep-dives">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Device Deep Dives</h2>
          <p class="section-sub animate-on-scroll">Tap any device for strengths, weaknesses, and research sources.</p>
          <div class="dd-grid">
            ${Object.entries(devices).map(([k, d], i) => `
              <div class="dd-card animate-on-scroll ${this._expandedDevice === k ? 'expanded' : ''}" data-device="${k}" style="--accent:${d.color};--delay:${i * 100}ms">
                <div class="dd-header">
                  <div class="dd-icon">${d.icon}</div>
                  <div class="dd-info">
                    <h3>${d.affiliateLinks && d.affiliateLinks.length ? `<a href="${d.affiliateLinks[0].url}" class="dd-name-link" target="_blank" rel="noopener sponsored" data-track-label="${d.affiliateLinks[0].slug}">${d.name}</a>` : d.name}</h3>
                    <span class="dd-bestfor">${d.bestFor}</span>
                  </div>
                  <div class="dd-toggle"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></div>
                </div>
                <div class="dd-body">
                  <div class="dd-cols">
                    <div class="dd-col">
                      <h4>Strengths</h4>
                      <ul>${d.strengths.map(s => `<li><span class="dd-check">\u2713</span> ${s}</li>`).join('')}</ul>
                    </div>
                    <div class="dd-col">
                      <h4>Weaknesses</h4>
                      <ul>${d.weaknesses.map(w => `<li><span class="dd-x">\u2717</span> ${w}</li>`).join('')}</ul>
                    </div>
                  </div>
                  <div class="dd-sub">${d.subscription}</div>
                  ${d.researchNote ? `<div class="dd-research-note"><strong>Research Note:</strong> ${d.researchNote}</div>` : ''}
                  ${this._renderStudiesForDevice(k)}
                  ${d.affiliateLinks ? `
                  <div class="dd-buy">
                    <h4>Available on Amazon</h4>
                    <div class="dd-buy-links">
                      ${d.affiliateLinks.map(l => `
                        <a href="${l.url}" class="dd-buy-link" target="_blank" rel="noopener sponsored" data-track-label="${l.slug}">
                          <span class="dd-buy-name">${l.name}</span>
                          ${l.note ? `<span class="dd-buy-note">${l.note}</span>` : ''}
                          <span class="dd-buy-cta">View on Amazon<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
                        </a>
                      `).join('')}
                    </div>
                  </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ${this._renderEmailCta()}

      <!-- Quick Recommendations -->
      <section class="recommendations">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Best Wearable by Use Case</h2>
          <p class="section-sub animate-on-scroll">What matters most to you? Here's what the research says.</p>
          <div class="rec-list animate-on-scroll">
            ${this._useCases.map((uc, i) => `
              <div class="rec-row" style="--delay:${i * 100}ms">
                <div class="rec-icon">${this._getUseCaseIcon(uc.icon)}</div>
                <div class="rec-info">
                  <div class="rec-label">${uc.label}</div>
                  <div class="rec-note">${uc.note}</div>
                </div>
                <div class="rec-devices">${uc.devices.map(dk => `<img src="${devices[dk].imageUrl}" alt="${devices[dk].short}" class="rec-device-img" title="${devices[dk].short}" />`).join('')}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Caveats -->
      ${this._renderRelatedTools()}

      <section class="caveats">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Important Things to Know</h2>
          <p class="section-sub animate-on-scroll">Context for interpreting wearable accuracy data.</p>
          <div class="caveat-grid animate-on-scroll">
            ${this._caveats.map((c, i) => `
              <div class="caveat-card ${this._expandedCaveats.has(i) ? 'open' : ''}" data-caveat="${i}">
                <div class="caveat-header">
                  <span class="caveat-num">${i + 1}</span>
                  <span class="caveat-title">${c.title}</span>
                  <span class="caveat-toggle"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></span>
                </div>
                <div class="caveat-body"><p>${c.body}</p></div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Sources -->

      <section class="sources-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Sources</h2>
          <p class="section-sub animate-on-scroll">Every accuracy figure on this page traces to one of these studies, each labelled with who funded it.</p>
          <div class="sources-wrap animate-on-scroll">${this._renderSources()}</div>
        </div>
      </section>

      <!-- CTA -->
      <footer class="tool-footer">
        <div class="container">
          <a href="https://www.kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" />
            Kygo Health
          </a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <div class="footer-links">
            <a href="https://www.kygo.app" target="_blank" rel="noopener">Kygo App</a>
            <a href="https://www.kygo.app/privacy-policy" target="_blank" rel="noopener">Privacy</a>
            <a href="https://www.kygo.app/terms-conditions" target="_blank" rel="noopener">Terms</a>
          </div>
          <p class="footer-copyright">Data last updated February 2025. All accuracy claims sourced from peer-reviewed research with full bias disclosure.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, I earn from qualifying purchases.</p>
          <p class="footer-copyright">\u00A9 ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>

      ${this._renderRelatedPosts()}
    `;
  }

  // ── Styles ────────────────────────────────────────────────────────────

  _styles() {
    return `
      :host {
        --dark: #1E293B;
        --dark-card: #0f172a;
        --dark-surface: #1a2332;
        --light: #F8FAFC;
        --green: #22C55E;
        --green-dark: #16A34A;
        --green-light: rgba(34,197,94,0.1);
        --green-glow: rgba(34,197,94,0.3);
        --yellow: #FBBF24;
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
        -moz-osx-font-smoothing: grayscale;
      }
      *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
      h1, h2, h3, h4 {
        font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 600;
        line-height: 1.2;
      }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

      /* ── Header ── */
      .header {
        background: white;
        border-bottom: 1px solid var(--gray-200);
        padding: 12px 16px;
        position: sticky;
        top: 0;
        z-index: 50;
      }
      .header-inner {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 14px;
        color: var(--dark);
        text-decoration: none;
      }
      .logo-img { height: 28px; width: auto; }
      .nav-cta-group { margin-left:auto; display:inline-flex; align-items:center; gap:8px; }
      .nav-cta-group .nav-store-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border-radius:8px; font-weight:600; font-size:13px; text-decoration:none; white-space:nowrap; line-height:1; }
      .nav-cta-group .nav-store-btn svg { width:15px; height:15px; flex-shrink:0; }
      .nav-cta-group .nav-store-ios { background:var(--green); color:#fff; }
      .nav-cta-group .nav-store-ios:hover { background:var(--green-dark); color:#fff; }
      .nav-cta-group .nav-store-android { background:#fff; color:var(--green-dark); border:1.5px solid var(--gray-200); }
      .nav-cta-group .nav-store-android:hover { border-color:var(--green); color:var(--green-dark); }
      @media (max-width:360px){ .nav-cta-group .nav-store-btn span { display:none; } .nav-cta-group .nav-store-btn { padding:8px 10px; } }

      /* Early contextual CTA band */
      .kearly-section { padding: 48px 16px; }
      .kband { max-width: 1100px; margin: 0 auto; }
      .kband-inner { position: relative; overflow: hidden; background: #fff; border: 2px solid #E2E8F0; border-radius: 20px; padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; gap: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
      .kband-glow { position: absolute; top: -120px; right: -80px; width: 360px; height: 360px; background: radial-gradient(circle, rgba(34,197,94,0.14), transparent 65%); pointer-events: none; }
      .kband-copy { position: relative; display: flex; flex-direction: column; gap: 10px; max-width: 620px; }
      .kband-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 12px; letter-spacing: 0.7px; text-transform: uppercase; color: var(--green-dark, #16A34A); }
      .kband-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green, #22C55E); animation: kygoPulse 2s ease-out infinite; }
      .kband-headline { margin: 0; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 24px; line-height: 1.3; color: var(--dark, #1E293B); }
      .kband-actions { position: relative; display: flex; flex-wrap: wrap; gap: 12px; flex-shrink: 0; }
      .kband-note { flex-basis: 100%; width: 100%; margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: #475569; text-align: center; }
      .kband-btn { display: inline-flex; align-items: center; gap: 9px; text-decoration: none; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; padding: 15px 24px; border-radius: 12px; white-space: nowrap; transition: transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease; }
      .kband-btn svg { width: 17px; height: 17px; flex-shrink: 0; }
      .kband-btn-ios { background: var(--green, #22C55E); color: #fff; box-shadow: 0 6px 16px rgba(34,197,94,0.28); }
      .kband-btn-ios:hover { background: var(--green-dark, #16A34A); transform: translateY(-2px); box-shadow: 0 10px 20px rgba(34,197,94,0.3); }
      .kband-btn-android { background: #fff; color: var(--green-dark, #16A34A); border: 2px solid #E2E8F0; }
      .kband-btn-android:hover { border-color: var(--green, #22C55E); transform: translateY(-2px); }
      @keyframes kygoPulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.55); } 70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }
      @media (max-width: 720px) {
        .kband-inner { flex-direction: column; align-items: flex-start; gap: 22px; padding: 28px 24px; }
        .kband-actions { width: 100%; flex-direction: column; }
        .kband-btn { width: 100%; justify-content: center; }
      }
      @media (prefers-reduced-motion: reduce) { .kband-dot { animation: none; } }

      /* Animations */
      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: var(--delay, 0ms); }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      /* ── Hero ── */
      .hero-light { background: #fff; border-bottom: 1px solid var(--gray-200); }
      .hero-light-inner { max-width: 1200px; margin: 0 auto; padding: 48px 20px 36px; }
      .hero-grid { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: center; margin-bottom: 32px; }
      @media (min-width: 880px) { .hero-grid { grid-template-columns: 1.15fr 1fr; gap: 48px; } .hero-light-inner { padding: 64px 24px 48px; } }
      .hero-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.10); color: var(--green-dark); padding: 6px 14px; border-radius: 999px; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; white-space: nowrap; }
      .hero-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); flex: none; }
      .hero-light h1 { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: var(--dark); font-size: clamp(30px, 5.5vw, 58px); line-height: 1.05; letter-spacing: -0.02em; margin: 18px 0 18px; }
      .hero-light h1 .hl { color: var(--green); }
      .hero-lede { font-size: clamp(15px, 1.6vw, 18px); line-height: 1.55; color: var(--gray-600); max-width: 60ch; margin: 0; }
      .hero-lede strong { color: var(--dark); font-weight: 600; }
      .hero-vis { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 14px; background: linear-gradient(158deg, #ffffff 0%, #EEF2F7 100%); border: 1px solid var(--gray-200); border-radius: 20px; padding: 18px 20px 20px; box-shadow: 0 16px 40px rgba(15,23,42,0.08); }
      .hero-vis::before { content: ''; position: absolute; top: -90px; right: -70px; width: 240px; height: 240px; background: radial-gradient(closest-side, rgba(34,197,94,0.16), transparent); pointer-events: none; }
      .hero-vis-head { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
      .hero-vis-title { display: inline-flex; align-items: center; gap: 7px; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); }
      .hero-vis-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 3px rgba(34,197,94,0.18); flex: none; }
      .hero-vis-tag { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.3px; color: var(--green-dark); background: var(--green-light); padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
      .hv-two { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px; }
      .hv-col { display: flex; flex-direction: column; align-items: center; gap: 9px; text-align: center; padding: 12px 6px; }
      .hv-col + .hv-col { border-left: 1px solid var(--gray-200); }
      .hv-label { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: var(--gray-600); }
      .hv-val { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: clamp(34px, 7vw, 46px); line-height: 1; letter-spacing: -0.02em; color: var(--gray-600); }
      .hv-val.good { color: var(--green-dark); }
      .hv-bar { width: 100%; max-width: 150px; height: 8px; border-radius: 999px; background: var(--gray-100); overflow: hidden; }
      .hv-fill { display: block; height: 100%; border-radius: 999px; background: var(--gray-400); }
      .hv-fill.good { background: var(--green); }
      .hv-cap { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600; color: var(--gray-400); }
      .hv-cap.good { color: var(--green-dark); }
      .hv-foot { position: relative; display: block; text-align: center; margin-top: 12px; font-size: 12px; color: var(--gray-400); }
      @media (max-width: 880px) { .hero-vis { width: 100%; max-width: 440px; margin: 4px auto 0; } }
      .hero-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; border-top: 1px solid var(--gray-200); padding-top: 24px; }
      @media (min-width: 720px) { .hero-stats { grid-template-columns: repeat(4, 1fr); gap: 24px; padding-top: 28px; } }
      .hero-stat .num { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: clamp(28px, 4vw, 40px); line-height: 1; color: var(--green); letter-spacing: -0.02em; }
      .hero-stat .lbl { margin-top: 10px; color: var(--gray-400); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; line-height: 1.4; }
      .hv-body { position: relative; display: flex; align-items: center; gap: 16px; padding: 6px 2px 2px; }
      .hv-big { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: clamp(38px, 8vw, 54px); line-height: 1; letter-spacing: -0.02em; color: var(--green-dark); flex: none; }
      .hv-text { font-size: 13.5px; line-height: 1.5; color: var(--gray-600); }
      .hv-text p { margin: 0; }
      .hv-text strong { color: var(--dark); font-weight: 600; }
      .hv-src { display: block; margin-top: 7px; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600; color: var(--gray-400); }
      .hero-stat .unit { font-size: 0.5em; font-weight: 600; margin-left: 2px; }

      /* ── Section Titles ── */
      .section-title { font-size: clamp(24px, 6vw, 36px); text-align: center; margin-bottom: 8px; }
      .section-sub { font-size: clamp(14px, 4vw, 16px); color: var(--gray-600); text-align: center; margin-bottom: 32px; max-width: 560px; margin-left: auto; margin-right: auto; }

      /* ── Comparison ── */
      .comparison { padding: 48px 0; background: var(--gray-50); }
      .device-selectors { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
      .selector-group { text-align: center; }
      .selector-group label { display: block; font-size: 12px; font-weight: 600; color: var(--gray-400); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
      .selector-wrap select { padding: 10px 16px; border-radius: var(--radius-sm); border: 2px solid var(--gray-200); font-family: inherit; font-size: 15px; font-weight: 600; background: var(--gray-50); color: var(--dark); cursor: pointer; min-width: 140px; appearance: auto; transition: border-color 0.2s; }
      .selector-wrap select:focus { outline: none; border-color: var(--green); }
      .vs-badge { width: 40px; height: 40px; border-radius: 50%; background: var(--green); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 16px; box-shadow: 0 2px 8px rgba(34,197,94,0.3); }

      .device-summary-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
      .device-summary-card { padding: 20px; border-radius: var(--radius); background: white; border: 1px solid var(--gray-200); text-align: center; transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(0,0,0,0.06); display: flex; flex-direction: column; align-items: center; }
      .device-summary-card:hover { border-color: var(--green); box-shadow: 0 12px 32px rgba(0,0,0,0.08); transform: translateY(-4px); }
      .device-summary-card .ds-icon { width: 48px; height: 48px; margin: 0 auto 8px; flex-shrink: 0; }
      .device-summary-card .ds-icon img { width: 100%; height: 100%; object-fit: contain; border-radius: 12px; }
      .device-summary-card h3 { font-size: 16px; margin-bottom: 4px; }
      .ds-best-for { font-size: 12px; color: var(--gray-600); margin-bottom: 4px; flex: 1; }
      .ds-sub { font-size: 11px; color: var(--gray-400); }
      .ds-name-link { color: inherit; text-decoration: underline; text-decoration-color: var(--gray-300); text-underline-offset: 2px; transition: text-decoration-color 0.2s; }
      .ds-name-link:hover { text-decoration-color: var(--green); }

      /* Metric Tabs */
      .metric-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 20px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
      .metric-tabs::-webkit-scrollbar { display: none; }
      .metric-tab { padding: 8px 14px; border-radius: 50px; border: 2px solid var(--gray-200); background: #fff; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--gray-600); cursor: pointer; white-space: nowrap; transition: all 0.2s; }
      .metric-tab:hover { border-color: var(--gray-300); color: var(--dark); }
      .metric-tab.active { background: var(--green-light); color: var(--green-dark); border-color: var(--green); font-weight: 600; }

      /* Metric Detail */
      .metric-detail { background: white; border-radius: var(--radius); padding: 24px; border: 1px solid var(--gray-200); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
      .md-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
      .md-header h3 { font-size: 20px; }
      .md-gold { font-size: 12px; color: var(--gray-400); background: var(--gray-100); padding: 4px 10px; border-radius: 6px; }
      .md-desc { font-size: 14px; color: var(--gray-600); margin-bottom: 12px; line-height: 1.6; }
      .md-unit-explainer { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--green-dark); background: var(--green-light); padding: 8px 12px; border-radius: 8px; margin-bottom: 20px; line-height: 1.4; }
      .md-unit-explainer svg { flex-shrink: 0; color: var(--green); }

      .md-bars { display: flex; flex-direction: column; gap: 20px; margin-bottom: 20px; }
      .md-bar-label { font-size: 14px; font-weight: 600; margin-bottom: 8px; padding-left: 2px; color: var(--accent); }
      .md-bar-row { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 6px; margin-bottom: 6px; }
      .md-bar-track { height: 28px; background: var(--gray-200); border-radius: 6px; overflow: hidden; min-width: 0; }
      .md-bar-fill { height: 100%; border-radius: 6px; transition: width 0.6s ease-out; min-width: 8px; }
      .md-bar-fill.biased { opacity: 0.5; background-image: repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px) !important; }
      .md-bar-value { font-size: 13px; font-weight: 700; white-space: nowrap; min-width: 60px; text-align: right; }
      .md-bar-study { font-size: 11px; color: var(--gray-400); line-height: 1.45; display: flex; flex-wrap: wrap; align-items: center; gap: 4px; grid-column: 1 / -1; }
      .md-bar-study.biased-text { color: #D97706; }
      .md-bar-note { padding: 10px 14px; margin-bottom: 6px; background: var(--gray-100); border-left: 3px solid var(--gray-200); border-radius: 6px; font-size: 12px; line-height: 1.5; color: var(--gray-600); }
      .md-bar-note-val { font-weight: 700; color: var(--dark); }
      .md-no-data { padding: 12px 16px; background: var(--gray-100); border-radius: 8px; font-size: 13px; color: var(--gray-400); font-style: italic; }

      .funded-badge { font-size: 10px; font-weight: 600; color: #92400E; background: #FEF3C7; padding: 1px 6px; border-radius: 4px; }

      /* ── Overview Tab ── */
      .ov-header { margin-bottom: 16px; }
      .ov-header h3 { font-size: 20px; margin-bottom: 4px; }
      .ov-summary { font-size: 14px; color: var(--gray-600); }
      .ov-table { border: 1px solid var(--gray-200); border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 12px; }
      .ov-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; border-bottom: 1px solid var(--gray-100); }
      .ov-row:last-child { border-bottom: none; }
      .ov-row-header { background: var(--gray-50); font-weight: 600; }
      .ov-metric { padding: 10px 12px; font-size: 13px; font-weight: 600; color: var(--dark); display: flex; align-items: center; }
      .ov-val { padding: 10px 12px; font-size: 13px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 4px; border-left: 1px solid var(--gray-100); }
      .ov-val-header { font-size: 12px; font-weight: 600; color: var(--accent); }
      .ov-device-icon { width: 20px; height: 20px; border-radius: 5px; object-fit: contain; }
      .ov-winner { background: var(--green-light); font-weight: 700; color: var(--green-dark); }
      .ov-biased { font-size: 10px; color: #D97706; }
      .ov-footer { margin-bottom: 16px; }
      .ov-biased-note { font-size: 11px; color: var(--gray-400); font-style: italic; }
      .ov-strengths { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .ov-str-col { padding: 14px 16px; background: var(--gray-50); border-radius: var(--radius-sm); border: 1px solid var(--gray-200); }
      .ov-str-col h4 { font-size: 13px; margin-bottom: 4px; }
      .ov-str-col p { font-size: 12px; color: var(--gray-600); line-height: 1.5; }

      .md-insight { display: flex; gap: 10px; padding: 14px 16px; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: var(--radius-sm); }
      .md-insight-icon { flex-shrink: 0; color: #D97706; margin-top: 2px; }
      .md-insight p { font-size: 13px; color: #92400E; line-height: 1.6; }
      .md-insight p a { color: #92400E; font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
      .md-insight p a:hover { color: #B45309; }

      /* ── Quick Recommendations ── */
      .recommendations { padding: 48px 0; background: var(--gray-50); }
      .rec-list { display: flex; flex-direction: column; gap: 0; background: #fff; border-radius: var(--radius); border: 1px solid var(--gray-200); overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
      .rec-row { display: grid; grid-template-columns: 36px 1fr auto; align-items: center; gap: 12px; padding: 16px 16px; border-bottom: 1px solid var(--gray-100); border-left: 3px solid transparent; transition: all 0.2s; }
      .rec-row:last-child { border-bottom: none; }
      .rec-row:hover { background: var(--gray-50); border-left-color: var(--green); transform: translateX(2px); }
      .rec-row:hover .rec-label { color: var(--green-dark); }
      .rec-icon { width: 32px; height: 32px; color: var(--green-dark); display: flex; align-items: center; justify-content: center; background: var(--green-light); border-radius: 8px; padding: 4px; }
      .rec-icon svg { width: 100%; height: 100%; }
      .rec-info { min-width: 0; }
      .rec-label { font-size: 14px; font-weight: 600; color: var(--dark); margin-bottom: 2px; }
      .rec-note { font-size: 12px; color: var(--gray-400); line-height: 1.4; }
      .rec-devices { display: flex; gap: 6px; align-items: center; }
      .rec-device-img { width: 36px; height: 36px; border-radius: 10px; object-fit: contain; border: 1px solid var(--gray-200); background: #fff; }

      /* ── Device Deep Dives ── */
      .deep-dives { padding: 48px 0; background: var(--gray-50); }
      .dd-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
      .dd-card { background: white; border-radius: var(--radius); border: 1px solid var(--gray-200); overflow: hidden; transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
      .dd-card:hover { border-color: var(--green); box-shadow: var(--shadow-hover); transform: translateY(-2px); }
      .dd-card.expanded { border-color: var(--green); box-shadow: 0 8px 24px rgba(34,197,94,0.12); }
      .dd-header { display: flex; align-items: center; gap: 12px; padding: 16px 20px; cursor: pointer; }
      .dd-icon { width: 40px; height: 40px; flex-shrink: 0; border-radius: 10px; overflow: hidden; }
      .dd-icon img { width: 100%; height: 100%; object-fit: contain; border-radius: 10px; }
      .dd-info { flex: 1; min-width: 0; }
      .dd-info h3 { font-size: 16px; margin-bottom: 2px; }
      .dd-name-link { color: inherit; text-decoration: underline; text-decoration-color: var(--gray-300); text-underline-offset: 2px; transition: text-decoration-color 0.2s; }
      .dd-name-link:hover { text-decoration-color: var(--green); }
      .dd-bestfor { font-size: 12px; color: var(--gray-400); }
      .dd-toggle { flex-shrink: 0; color: var(--gray-400); transition: transform 0.3s; }
      .dd-card.expanded .dd-toggle { transform: rotate(180deg); }
      .dd-body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1); padding: 0 20px; }
      .dd-card.expanded .dd-body { max-height: 1200px; padding: 0 20px 20px; }
      .dd-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 12px; }
      .dd-col h4 { font-size: 12px; color: var(--gray-600); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'DM Sans', sans-serif; }
      .dd-col ul { list-style: none; }
      .dd-col li { font-size: 13px; margin-bottom: 4px; display: flex; align-items: flex-start; gap: 6px; line-height: 1.5; }
      .dd-check { color: var(--green); font-weight: 700; flex-shrink: 0; }
      .dd-x { color: #EF4444; font-weight: 700; flex-shrink: 0; }
      .dd-sub { font-size: 12px; color: var(--gray-400); margin-bottom: 8px; }
      .dd-research-note { font-size: 12px; color: #92400E; background: #FFFBEB; padding: 10px 12px; border-radius: 8px; border: 1px solid #FDE68A; line-height: 1.5; margin-bottom: 8px; }

      .dd-studies { margin-top: 8px; }
      .dd-studies h4 { font-size: 12px; color: var(--gray-600); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'DM Sans', sans-serif; }
      .dd-study-row { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px; }
      .dd-study-badge { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; flex-shrink: 0; margin-top: 1px; }
      .dd-study-badge.independent { background: #DCFCE7; color: #166534; }
      .dd-study-badge.funded { background: #FEF3C7; color: #92400E; }
      .dd-study-cite { font-size: 12px; color: var(--gray-400); line-height: 1.5; }
      .dd-study-note { display: block; margin-top: 4px; font-size: 11.5px; color: var(--gray-600); font-style: italic; }
      .dd-study-funded .dd-study-cite { color: #D97706; }

      /* ── Available on Amazon (Affiliate) ── */
      .dd-buy { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--gray-200); }
      .dd-buy h4 { font-size: 12px; color: var(--gray-600); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'DM Sans', sans-serif; }
      .dd-buy-links { display: flex; flex-direction: column; gap: 6px; }
      .dd-buy-link {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        background: var(--gray-50);
        border: 1px solid var(--gray-200);
        border-radius: var(--radius-sm);
        text-decoration: none;
        color: var(--dark);
        transition: all 0.2s;
      }
      .dd-buy-link:hover { border-color: var(--green); background: var(--green-light); }
      .dd-buy-name { font-size: 13px; font-weight: 600; }
      .dd-buy-note { font-size: 11px; color: var(--gray-400); }
      .dd-buy-cta {
        margin-left: auto;
        font-size: 12px;
        font-weight: 600;
        color: var(--green-dark);
        display: inline-flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      }
      .dd-buy-cta svg { flex-shrink: 0; }

      /* ── Caveats ── */
      .caveats { padding: 48px 0; background: var(--gray-50); }
      .caveat-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
      .caveat-card { background: #fff; border-radius: var(--radius-sm); border: 1px solid var(--gray-200); overflow: hidden; transition: all 0.2s; }
      .caveat-card:hover { border-color: var(--gray-300); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
      .caveat-header { display: flex; align-items: center; padding: 12px 14px; cursor: pointer; gap: 10px; }
      .caveat-num { width: 24px; height: 24px; border-radius: 50%; background: var(--green-light); color: var(--green-dark); font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .caveat-title { font-size: 13px; font-weight: 600; color: var(--dark); flex: 1; }
      .caveat-toggle { flex-shrink: 0; color: var(--gray-400); transition: transform 0.3s; }
      .caveat-card.open .caveat-toggle { transform: rotate(180deg); }
      .caveat-card.open .caveat-num { background: var(--green); color: #fff; }
      .caveat-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding 0.35s ease; padding: 0 14px; }
      .caveat-card.open .caveat-body { max-height: 200px; padding: 0 14px 12px; }
      .caveat-body p { font-size: 12px; color: var(--gray-600); line-height: 1.6; padding-left: 34px; }

      /* ── Sources ── */
      .sources-section { padding: 48px 0; background: #fff; }
      /* Sources · Kygo standard module */
      .sources { display: grid; grid-template-columns: 1fr; gap: 8px; }
      @media (min-width: 600px) { .sources { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 960px) { .sources { grid-template-columns: repeat(3, 1fr); } }
      .src { display: flex; flex-direction: column; gap: 4px; background: #fff; border: 1.5px solid var(--gray-200); border-radius: 12px; padding: 12px 14px; text-decoration: none; transition: border-color .15s, box-shadow .15s; }
      a.src:hover { border-color: var(--green); box-shadow: 0 4px 14px rgba(15,23,42,.08); }
      .src--nolink { background: var(--gray-50); border-style: dashed; }
      .src-tag { align-self: flex-start; font-family: 'Space Grotesk', sans-serif; font-size: 9.5px; font-weight: 700; letter-spacing: .4px; text-transform: uppercase; color: var(--green-dark); }
      .src--nolink .src-tag { color: var(--gray-400); }
      .src-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13.5px; color: var(--dark); line-height: 1.3; overflow-wrap: anywhere; }
      a.src:hover .src-title { color: var(--green-dark); }
      .src-cite { display: inline-flex; align-items: baseline; gap: 5px; flex-wrap: wrap; font-size: 11.5px; color: var(--gray-400); line-height: 1.35; overflow-wrap: anywhere; }
      .src-go { display: inline-flex; align-self: center; flex-shrink: 0; color: var(--green-dark); }
      .src-go svg { width: 12px; height: 12px; transition: transform .15s; }
      a.src:hover .src-go svg { transform: translate(1px,-1px); }
      .sources.src-extra { margin-top: 8px; }
      .sources.src-extra[hidden] { display: none; }
      .src-toggle-wrap { text-align: center; margin-top: 16px; }
      .src-toggle { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 999px; border: 1.5px solid var(--gray-200); background: #fff; color: var(--green-dark); font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13px; cursor: pointer; transition: border-color .15s, box-shadow .15s; }
      .src-toggle:hover { border-color: var(--green); box-shadow: 0 4px 14px rgba(15,23,42,.08); }
      .src-toggle svg { width: 14px; height: 14px; transition: transform .2s; }
      .src-toggle.open svg { transform: rotate(90deg); }


      /* ── CTA ── */
      .cta-section { padding: 38px 0; }
      .cta-buttons{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
      .cta-box {
        background: linear-gradient(135deg, var(--green), var(--green-dark));
        border-radius: var(--radius);
        padding: 26px 16px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      .cta-box::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
        pointer-events: none;
      }
      .cta-box-content { position: relative; z-index: 1; }
      .cta-icon {
        width: 56px;
        height: 56px;
        background: rgba(255,255,255,0.2);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        color: white;
      }
      .cta-box h2 { font-size: clamp(20px, 5vw, 24px); margin-bottom: 10px; color: white; }
      .cta-box p { font-size: 14px; color: rgba(255,255,255,0.85); margin-bottom: 24px; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.6; }
      .cta-btn-white { display: inline-flex; align-items: center; gap: 8px; background: white; color: var(--green-dark); padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; border: none; cursor: pointer; }
      .cta-btn-white:hover { background: var(--gray-100); }
      .cta-features {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
        font-size: 13px;
        color: rgba(255,255,255,0.8);
      }
      .cta-feature { display: flex; align-items: center; justify-content: center; gap: 8px; }
      .cta-feature svg { color: white; flex-shrink: 0; }
      .cta-android{background:white;color:var(--green-dark);padding:12px 24px;border-radius:var(--radius-sm, 10px);font-weight:600;font-size:15px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:background 0.2s;border:none;cursor:pointer}
      .cta-android:hover{background:var(--gray-100)}
      .cta-android svg{width:18px;height:18px}
      @media(max-width:480px){.cta-buttons{flex-direction:column;align-items:stretch}.cta-buttons a{width:100%;justify-content:center;text-align:center}}

      /* ── Footer ── */
      .tool-footer { padding: 32px 0; text-align: center; border-top: 1px solid var(--gray-200); }
      .footer-brand {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--dark);
        font-weight: 600;
        text-decoration: none;
        margin-bottom: 6px;
        font-size: 14px;
      }
      .footer-brand:hover { color: var(--green); }
      .footer-logo { height: 24px; width: auto; }
      .footer-tagline { color: var(--gray-600); font-size: 12px; margin-bottom: 12px; }
      .footer-links {
        display: flex;
        justify-content: center;
        gap: 16px;
        font-size: 12px;
        margin-bottom: 12px;
        flex-wrap: wrap;
      }
      .footer-links a { color: var(--gray-400); text-decoration: none; }
      .footer-links a:hover { color: var(--dark); }
      .footer-copyright { font-size: 11px; color: var(--gray-400); margin-bottom: 4px; line-height: 1.6; }
      .footer-affiliate { font-style: italic; }

      /* ── Tablet (768px) ── */
      @media (min-width: 768px) {
        .header { padding: 14px 24px; }
        .logo { font-size: 16px; gap: 10px; }
        .logo-img { height: 32px; }
        .section-title { font-size: 32px; }
        .comparison, .recommendations, .deep-dives, .caveats, .cta-section { padding: 64px 0; }
        .device-summary-card { padding: 24px; }
        .device-summary-card .ds-icon { width: 52px; height: 52px; }
        .metric-detail { padding: 28px; }
        .md-bar-row { grid-template-columns: 1fr auto auto; gap: 10px; }
        .md-bar-study { grid-column: auto; min-width: 90px; }
        .rec-row { grid-template-columns: 40px 1fr auto; gap: 16px; padding: 14px 20px; }
        .rec-icon { width: 36px; height: 36px; }
        .rec-label { font-size: 15px; }
        .rec-device-img { width: 40px; height: 40px; }
        .dd-grid { grid-template-columns: 1fr 1fr; }
        .dd-header { padding: 18px 24px; }
        .dd-icon { width: 44px; height: 44px; }
        .dd-body { padding: 0 24px; }
        .dd-card.expanded .dd-body { padding: 0 24px 24px; }
        .caveat-grid { grid-template-columns: 1fr 1fr; }
        .cta-box { padding: 48px 32px; }
        .cta-box h2 { font-size: 28px; }
        .cta-box p { font-size: 16px; }
        .cta-features { flex-direction: row; gap: 24px; font-size: 14px; }
        .footer-brand { font-size: 16px; gap: 10px; }
        .footer-logo { height: 28px; }
        .footer-tagline { font-size: 14px; }
        .footer-links { gap: 24px; font-size: 14px; }
      }

      /* ── Desktop (1024px) ── */
      @media (min-width: 1024px) {
        .comparison, .recommendations, .deep-dives, .caveats, .cta-section { padding: 80px 0; }
        .device-summary-card { padding: 28px; }
        .device-summary-card .ds-icon { width: 56px; height: 56px; }
        .metric-detail { padding: 32px; }
        .md-bar-row { grid-template-columns: 1fr 92px 210px; }
        .md-bar-study { grid-column: auto; }
        .rec-row { padding: 16px 24px; }
        .rec-device-img { width: 44px; height: 44px; border-radius: 12px; }
        .dd-grid { grid-template-columns: 1fr 1fr 1fr; }
        .dd-header { padding: 20px 28px; }
        .dd-icon { width: 48px; height: 48px; border-radius: 12px; }
        .dd-body { padding: 0 28px; }
        .dd-card.expanded .dd-body { padding: 0 28px 28px; }
        .cta-box { padding: 56px 40px; border-radius: 24px; }
      }

      /* ── Reduced Motion ── */
      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .dd-body, .caveat-body, .dd-toggle, .caveat-toggle, .md-bar-fill { transition: none; }
      }
    `;
  }

  // ── Event Delegation (bound once) ─────────────────────────────────────

  _setupEventDelegation() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const shadow = this.shadowRoot;

    shadow.addEventListener('change', (e) => {
      if (e.target.id === 'device1') {
        this._selectedDevices[0] = e.target.value;
        this._updateComparison();
      }
      if (e.target.id === 'device2') {
        this._selectedDevices[1] = e.target.value;
        this._updateComparison();
      }
    });

    shadow.addEventListener('click', (e) => {
      // Sources · show-all toggle
      if (e.target.closest('[data-src-toggle]')) { this._toggleSources(); return; }

      // Metric tabs
      const tab = e.target.closest('.metric-tab');
      if (tab) {
        this._activeMetric = tab.dataset.metric;
        this._updateComparison();
        return;
      }

      // Device deep dive toggle (ignore clicks on affiliate links)
      if (e.target.closest('.dd-name-link') || e.target.closest('.ds-name-link')) return;
      const ddHeader = e.target.closest('.dd-header');
      if (ddHeader) {
        const card = ddHeader.closest('.dd-card');
        const key = card.dataset.device;
        this._expandedDevice = this._expandedDevice === key ? null : key;
        shadow.querySelectorAll('.dd-card').forEach(c => {
          c.classList.toggle('expanded', c.dataset.device === this._expandedDevice);
        });
        return;
      }

      // Caveat expand/collapse
      const caveatHeader = e.target.closest('.caveat-header');
      if (caveatHeader) {
        const item = caveatHeader.closest('.caveat-card') || caveatHeader.closest('.caveat-item');
        const idx = parseInt(item.dataset.caveat, 10);
        if (this._expandedCaveats.has(idx)) {
          this._expandedCaveats.delete(idx);
          item.classList.remove('open');
        } else {
          this._expandedCaveats.add(idx);
          item.classList.add('open');
        }
        return;
      }
    });

  }

  // ── Animations ────────────────────────────────────────────────────────

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
    });
  }

  // ── Structured Data (JSON-LD) ─────────────────────────────────────────

  _injectStructuredData() {
    if (document.querySelector('script[data-kygo-wearable-ld]')) return;
    const hs = this._heroStats;
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Wearable Accuracy Comparison Tool',
      'description': `Compare accuracy of popular wearable devices (Oura Ring, Apple Watch, Garmin, WHOOP, Fitbit, Samsung) across sleep, HRV, heart rate, SpO2, steps, calories, VO2 max and skin temperature. Data sourced from ${hs.studies} peer-reviewed studies with full bias disclosure.`,
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'url': 'https://www.kygo.app/tools/wearable-accuracy',
      'datePublished': '2026-02-01',
      'dateModified': '2026-09-09',
      'softwareVersion': '1.0',
      'inLanguage': 'en',
      'isAccessibleForFree': true,
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
      'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
      'alternateName': 'Kygo Wearable Accuracy Comparison Tool',
      'featureList': `Compare ${hs.devices} wearable brands, ${hs.metrics} health metrics, ${hs.studies} peer-reviewed studies, funding bias disclosure, MedicalScholarlyArticle citations`,
      'about': {
        '@type': 'MedicalScholarlyArticle',
        'name': 'Wearable Device Accuracy Research Summary',
        'description': `Comparative analysis of wearable accuracy across ${hs.metrics} health metrics based on ${hs.studies} peer-reviewed studies with full funding bias disclosure.`
      },
      'keywords': 'wearable accuracy, Oura Ring accuracy, Apple Watch accuracy, Garmin accuracy, WHOOP accuracy, Fitbit accuracy, Samsung Galaxy Watch accuracy, sleep tracking accuracy, HRV accuracy, heart rate accuracy, SpO2 accuracy, step counting accuracy, VO2 max accuracy'
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-kygo-wearable-ld', '');
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);

    // FAQPage schema
    if (!document.querySelector('script[data-kygo-wearable-faq]')) {
      const faq = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'Which wearable is the most accurate overall?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'No single wearable is most accurate across all metrics. Oura Ring 4 leads for nocturnal HRV and resting heart rate (CCC 0.99 and 0.98, Dial 2025). Apple Watch has the best independent sleep staging in healthy adults (kappa 0.53) and the most FDA-cleared features. Fitbit Charge 6 and Garmin Vivoactive 5 were the top tier for daytime heart rate in a ten-device test (MAPE 5.5% and 6.3%, Gielen 2026). Apple Watch and Garmin are both under 5% error for steps in the lab, and Garmin has the most independently validated VO2 max at about 7% error.' }
          },
          {
            '@type': 'Question',
            'name': 'How accurate is Oura Ring for sleep tracking?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'It depends heavily on who is wearing it. In an Oura-funded study of screened healthy sleepers (Robbins 2024, n=35) the Gen 3 ring reached a Cohen kappa of 0.65 against polysomnography. In independent clinical samples it falls to kappa 0.35 (Lee 2023, n=75 with sleep complaints) and 53% stage accuracy in sleep-clinic patients (Herberger 2025). Oura is strongest at total sleep time, where a six-study meta-analysis found a bias of only about -3 minutes. Oura Ring 5 has no published validation of any kind.' }
          },
          {
            '@type': 'Question',
            'name': 'Is Apple Watch or Garmin more accurate for heart rate?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'Model matters more than brand. In a ten-device test against a chest strap (Gielen 2026), the Garmin Vivoactive 5 came in at 6.3% mean absolute percentage error and the Apple Watch SE at 7.3%, with the Fitbit Charge 6 best overall at 5.5%. Across 22 studies, Apple Watch pooled bias is close to zero (-0.27 bpm, Lambe 2026). The failure mode for every wrist device is irregular arm movement rather than intensity, so racquet and field sports are far worse than steady running.' }
          },
          {
            '@type': 'Question',
            'name': 'How accurate is WHOOP for HRV?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'WHOOP 4.0 measured nocturnal HRV with a concordance correlation coefficient of 0.94 against a chest-strap ECG, and resting heart rate at 0.91 (Dial 2025). That is good but behind Oura Ring 4 (0.99 and 0.98). Daytime heart rate is weaker: 8.5% mean absolute percentage error against a 12-lead ECG, second worst of five devices tested (Van Oost 2025). WHOOP 5.0 and MG have no independent validation.' }
          },
          {
            '@type': 'Question',
            'name': 'Which wearable has the most accurate SpO2 sensor?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'Apple Watch and Garmin lead for SpO2 accuracy with ±2% error compared to medical pulse oximeters in the 90-100% range. Oura Ring 4 achieves similar accuracy from the finger, which is clinically preferred for pulse oximetry. Fitbit and WHOOP average ±3% error. All consumer wearables lose reliability below 90% SpO2, which is the clinical threshold where accuracy matters most.' }
          }
        ]
      };
      const faqScript = document.createElement('script');
      faqScript.type = 'application/ld+json';
      faqScript.setAttribute('data-kygo-wearable-faq', '');
      faqScript.textContent = JSON.stringify(faq);
      document.head.appendChild(faqScript);
    }

    // BreadcrumbList schema
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
      document.head.appendChild(bcScript);
    }
  }
}

customElements.define('kygo-wearable-accuracy', KygoWearableAccuracy);
