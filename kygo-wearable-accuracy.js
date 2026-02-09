/**
 * Kygo Health — Wearable Accuracy Comparison Tool
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
    __seo(this, 'Wearable Accuracy Comparison Tool by Kygo Health. Compare accuracy of Oura Ring, Apple Watch, Garmin, WHOOP, Fitbit, and Samsung Galaxy Watch across sleep staging, heart rate variability (HRV), resting heart rate, active heart rate, SpO2 blood oxygen, step counting, calorie tracking, VO2 max, and skin temperature. Data sourced from peer-reviewed studies including Robbins 2024, Dial 2025, Park 2023, Schyvens 2025. Independent and funded study results compared side by side with bias disclosures. Best wearable for sleep: Apple Watch and Fitbit (independent studies). Best for HRV: Oura Ring Gen 4 (CCC 0.99). Best for active heart rate: Apple Watch (86.3%). Best for steps: Garmin (82.6%). Best for SpO2: Apple Watch (MAE 2.2%). No single device wins every metric.');
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
        bestFor: 'Active HR, SpO2, Sleep (independent), FDA features',
        subscription: 'None required',
        strengths: ['Best active HR (86.3%)', 'Best SpO2 (MAE 2.2%)', 'Top independent sleep \u03BA=0.53', 'Best wake detection (52.2%)', 'Best REM detection (68.6%)', 'FDA-cleared ECG & sleep apnea'],
        weaknesses: ['VO2 max 13\u201316% error', 'Underestimates deep sleep', 'Daily charging needed'],
        researchNote: null,
        studyIds: ['robbins2024', 'schyvens2025', 'park2023', 'wellnesspulse2025', 'caserman2024', 'lambe2025'],
        affiliateLinks: [
          { name: 'Apple Watch Series 10', url: 'https://amzn.to/4kw5Uaa' },
          { name: 'Apple Watch Ultra 2', url: 'https://amzn.to/4kqQi7K' }
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
        strengths: ['Best HRV accuracy (CCC 0.99)', 'Best resting HR (CCC 0.98)', 'Best skin temp (r\u00B2>0.99)', 'Comfortable sleep wear'],
        weaknesses: ['Poor step counting (~50% error)', 'No active HR during exercise', 'No GPS, no screen'],
        researchNote: 'Sleep \u03BA=0.65 is from an Oura-funded study. Independent studies found \u03BA=0.2\u20130.4.',
        studyIds: ['robbins2024', 'dial2025', 'park2023'],
        affiliateLinks: [
          { name: 'Oura Ring Gen 4', url: 'https://amzn.to/4klINic' }
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
        strengths: ['Best step accuracy (82.6%)', 'Best VO2 max (MAPE 7.05%)', 'Best GPS & battery life', 'Multi-sport tracking'],
        weaknesses: ['Poor sleep staging (\u03BA=0.21)', 'Poor wake detection (27.6%)', 'Lower HRV (CCC 0.87)', 'Worst calorie tracking (48%)'],
        researchNote: 'HRV/sleep studies used Fenix 6 / Vivosmart 4 (older models). Current devices may perform better.',
        studyIds: ['schyvens2025', 'dial2025', 'wellnesspulse2025'],
        affiliateLinks: [
          { name: 'Garmin Venu 3', url: 'https://amzn.to/3ZUWQ50' },
          { name: 'Garmin Fenix 8', url: 'https://amzn.to/4qp6dEU' },
          { name: 'Garmin Forerunner 265', url: 'https://amzn.to/4r7eC0M' }
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
        strengths: ['Best deep sleep detection (69.6%)', 'Good HRV (CCC 0.94)', 'Best TST agreement (-1.4 min)', '99.7% HR during sleep'],
        weaknesses: ['Moderate sleep staging (\u03BA=0.37)', 'Overestimates REM by ~21 min', 'Poor wake detection (32.5%)', 'No screen, expensive subscription'],
        researchNote: null,
        studyIds: ['schyvens2025', 'dial2025', 'khodr2024'],
        affiliateLinks: [
          { name: 'WHOOP 4.0', url: 'https://amzn.to/3Zmzkh8', note: '12-month subscription included' }
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
        strengths: ['Moderate sleep accuracy (\u03BA=0.42\u20130.55)', 'Decent deep sleep sensitivity (61.7%)', 'FDA-cleared irregular rhythm', 'Affordable entry point'],
        weaknesses: ['Below leaders in most metrics', 'Declining validation research since Google acquisition'],
        researchNote: null,
        studyIds: ['robbins2024', 'schyvens2025', 'park2023', 'wellnesspulse2025'],
        affiliateLinks: [
          { name: 'Fitbit Charge 6', url: 'https://amzn.to/4chbzyr' },
          { name: 'Fitbit Sense 2', url: 'https://amzn.to/4ck9W33' }
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
        strengths: ['FDA-cleared sleep apnea detection', 'Validated respiratory rate (RMSE 1.13)', 'FDA-cleared ECG', 'Good Android integration'],
        weaknesses: ['Limited independent accuracy studies', 'Less validation data than Apple/Oura'],
        researchNote: null,
        studyIds: ['park2023', 'park2023resp', 'lanfranchi2024'],
        affiliateLinks: [
          { name: 'Galaxy Watch 7', url: 'https://amzn.to/3Owp4R1' },
          { name: 'Galaxy Watch Ultra', url: 'https://amzn.to/3ZqzKmE' }
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
        unitExplainer: '\u03BA (kappa) measures agreement with lab sleep study \u2014 0 = random chance, 1 = perfect match',
        goldStandard: 'Polysomnography (PSG)',
        higherBetter: true,
        scale: { min: 0, max: 0.8 },
        data: {
          'apple-watch': [
            { value: 0.60, label: '\u03BA=0.60', study: 'Robbins 2024', biased: true, funder: 'Oura' },
            { value: 0.53, label: '\u03BA=0.53', study: 'Schyvens 2025', biased: false },
            { value: 0.3, label: '\u03BA=0.2\u20130.4', study: 'Park 2023', biased: false }
          ],
          'oura': [
            { value: 0.65, label: '\u03BA=0.65', study: 'Robbins 2024', biased: true, funder: 'Oura' },
            { value: 0.3, label: '\u03BA=0.2\u20130.4', study: 'Park 2023', biased: false }
          ],
          'garmin': [
            { value: 0.21, label: '\u03BA=0.21', study: 'Schyvens 2025', biased: false }
          ],
          'whoop': [
            { value: 0.37, label: '\u03BA=0.37', study: 'Schyvens 2025', biased: false }
          ],
          'fitbit': [
            { value: 0.55, label: '\u03BA=0.55', study: 'Robbins 2024', biased: true, funder: 'Oura' },
            { value: 0.42, label: '\u03BA=0.42', study: 'Schyvens 2025', biased: false },
            { value: 0.5, label: '\u03BA=0.4\u20130.6', study: 'Park 2023', biased: false }
          ],
          'samsung': [
            { value: 0.5, label: '\u03BA=0.4\u20130.6', study: 'Park 2023', biased: false }
          ]
        },
        insight: 'Independent studies consistently rank Apple Watch and Fitbit near the top. Oura only leads in the Oura-funded study. All devices tend to misclassify wake, deep, and REM as light sleep.'
      },
      hrv: {
        name: 'Nocturnal HRV',
        desc: 'Heart rate variability measured during sleep \u2014 a key recovery and stress indicator.',
        unit: 'CCC',
        unitExplainer: 'CCC measures correlation with chest-strap ECG \u2014 0 = no agreement, 1 = perfect match',
        goldStandard: 'Polar H10 ECG chest strap',
        higherBetter: true,
        scale: { min: 0.7, max: 1.0 },
        data: {
          'apple-watch': [],
          'oura': [
            { value: 0.99, label: 'CCC 0.99', study: 'Dial 2025 (Gen 4)', biased: false },
            { value: 0.97, label: 'CCC 0.97', study: 'Dial 2025 (Gen 3)', biased: false }
          ],
          'garmin': [
            { value: 0.87, label: 'CCC 0.87', study: 'Dial 2025 (Fenix 6)', biased: false }
          ],
          'whoop': [
            { value: 0.94, label: 'CCC 0.94', study: 'Dial 2025', biased: false }
          ],
          'fitbit': [],
          'samsung': []
        },
        insight: 'Oura Gen 4 is the clear winner for nocturnal HRV with near-perfect agreement. Accuracy decreases at HRV >60ms (relevant for very fit individuals). Apple Watch, Fitbit, and Samsung were not included in this study.'
      },
      rhr: {
        name: 'Resting Heart Rate',
        desc: 'How accurately the device measures resting heart rate during sleep.',
        unit: 'CCC',
        unitExplainer: 'CCC measures correlation with chest-strap ECG \u2014 0 = no agreement, 1 = perfect match',
        goldStandard: 'Polar H10 ECG chest strap',
        higherBetter: true,
        scale: { min: 0.7, max: 1.0 },
        data: {
          'apple-watch': [],
          'oura': [
            { value: 0.98, label: 'CCC 0.98', study: 'Dial 2025 (Gen 4)', biased: false },
            { value: 0.97, label: 'CCC 0.97', study: 'Dial 2025 (Gen 3)', biased: false }
          ],
          'garmin': [],
          'whoop': [
            { value: 0.91, label: 'CCC 0.91', study: 'Dial 2025', biased: false }
          ],
          'fitbit': [],
          'samsung': []
        },
        insight: 'Oura Ring leads for resting heart rate accuracy. Garmin Fenix 6 was excluded due to timestamp reporting issues. Apple Watch, Fitbit, and Samsung were not tested in this study.'
      },
      activeHr: {
        name: 'Active Heart Rate',
        desc: 'Heart rate accuracy during exercise and physical activity.',
        unit: 'Accuracy %',
        unitExplainer: 'Percentage of readings within acceptable range of chest-strap ECG',
        goldStandard: 'ECG chest strap',
        higherBetter: true,
        scale: { min: 40, max: 100 },
        data: {
          'apple-watch': [
            { value: 86.3, label: '86.3%', study: 'WellnessPulse 2025', biased: false }
          ],
          'oura': [],
          'garmin': [
            { value: 67.7, label: '67.7%', study: 'WellnessPulse 2025', biased: false }
          ],
          'whoop': [],
          'fitbit': [
            { value: 73.6, label: '73.6%', study: 'WellnessPulse 2025', biased: false }
          ],
          'samsung': []
        },
        insight: 'Apple Watch leads for active heart rate during exercise. Oura Ring does not track active heart rate. Wrist-based optical sensors struggle during high-intensity or high-motion activities.'
      },
      spo2: {
        name: 'Blood Oxygen (SpO2)',
        desc: 'Blood oxygen saturation measurement accuracy. Important for detecting sleep apnea and respiratory issues.',
        unit: 'MAE %',
        unitExplainer: 'Mean Absolute Error \u2014 average error in percentage points vs. medical device. Lower is better',
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
        unit: 'Accuracy %',
        unitExplainer: 'Percentage accuracy compared to manual counting by researchers',
        goldStandard: 'Manual counting / research pedometer',
        higherBetter: true,
        scale: { min: 40, max: 100 },
        data: {
          'apple-watch': [
            { value: 81.1, label: '81.1%', study: 'WellnessPulse 2025', biased: false }
          ],
          'oura': [
            { value: 49.7, label: '~50% (real-world)', study: 'AIM7 data', biased: false }
          ],
          'garmin': [
            { value: 82.6, label: '82.6%', study: 'WellnessPulse 2025', biased: false }
          ],
          'whoop': [],
          'fitbit': [
            { value: 77.3, label: '77.3%', study: 'WellnessPulse 2025', biased: false }
          ],
          'samsung': []
        },
        insight: 'Garmin and Apple Watch are neck-and-neck for step counting. Oura Ring is poor for steps due to finger placement \u2014 wrist-based devices have a significant advantage for motion detection.'
      },
      calories: {
        name: 'Calorie / Energy',
        desc: 'How accurately the device estimates energy expenditure (calories burned).',
        unit: 'Accuracy %',
        unitExplainer: 'Percentage accuracy compared to lab calorimetry measurement',
        goldStandard: 'Indirect calorimetry',
        higherBetter: true,
        scale: { min: 30, max: 100 },
        data: {
          'apple-watch': [
            { value: 71, label: '71%', study: 'WellnessPulse 2025', biased: false }
          ],
          'oura': [
            { value: 87, label: '~87%', study: 'AIM7 data', biased: false }
          ],
          'garmin': [
            { value: 48, label: '48%', study: 'WellnessPulse 2025', biased: false }
          ],
          'whoop': [],
          'fitbit': [
            { value: 65.6, label: '65.6%', study: 'WellnessPulse 2025', biased: false }
          ],
          'samsung': []
        },
        insight: 'Calorie tracking is weak across ALL devices. None should be treated as precise. Accuracy drops further during high-intensity or multi-modal exercise. Use for general trends only.'
      },
      vo2max: {
        name: 'VO2 Max',
        desc: 'Estimated maximal oxygen uptake \u2014 a key indicator of cardiovascular fitness.',
        unit: 'MAPE %',
        unitExplainer: 'Mean Absolute Percentage Error \u2014 average % off from lab test. Lower is better',
        goldStandard: 'Laboratory metabolic cart',
        higherBetter: false,
        scale: { min: 0, max: 20 },
        data: {
          'apple-watch': [
            { value: 15.8, label: 'MAPE 15.8%', study: 'Caserman 2024', biased: false },
            { value: 13.3, label: 'MAPE 13.3%', study: 'Lambe 2025', biased: false }
          ],
          'oura': [],
          'garmin': [
            { value: 7.05, label: 'MAPE 7.05%', study: 'Sensors 2025 (Fenix 6)', biased: false },
            { value: 5.7, label: 'MAPE 5.7%', study: 'Running studies (FR 245)', biased: false }
          ],
          'whoop': [],
          'fitbit': [],
          'samsung': []
        },
        insight: 'Garmin leads significantly for VO2 max estimation, especially for runners. All devices tend to underestimate in fit individuals and overestimate in sedentary populations. Use for trend tracking, not absolute values.'
      },
      temp: {
        name: 'Skin Temperature',
        desc: 'Skin temperature measurement accuracy \u2014 useful for illness detection and menstrual cycle tracking.',
        unit: 'r\u00B2',
        unitExplainer: 'r\u00B2 measures how well readings track lab sensors \u2014 0 = no correlation, 1 = perfect fit',
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
      { icon: 'moon', label: 'Sleep Tracking', devices: ['apple-watch', 'fitbit'], confidence: 'Moderate', note: 'Consistent across independent studies' },
      { icon: 'heartPulse', label: 'HRV & Recovery', devices: ['oura'], confidence: 'High', note: 'CCC=0.99, independently validated' },
      { icon: 'activity', label: 'Active Heart Rate', devices: ['apple-watch'], confidence: 'High', note: '86.3% accuracy, multiple studies' },
      { icon: 'steps', label: 'Step Counting', devices: ['garmin', 'apple-watch'], confidence: 'High', note: '82.6% and 81.1% respectively' },
      { icon: 'lungs', label: 'VO2 Max / Fitness', devices: ['garmin'], confidence: 'Moderate', note: 'MAPE 7.05%, use for trends' },
      { icon: 'droplet', label: 'SpO2 / Blood Oxygen', devices: ['apple-watch'], confidence: 'Moderate', note: 'MAE 2.2%, but not medical-grade' },
      { icon: 'shieldPlus', label: 'Medical Features', devices: ['apple-watch', 'samsung'], confidence: 'High', note: 'FDA-cleared ECG & sleep apnea' },
      { icon: 'dumbbell', label: 'Athlete Recovery', devices: ['whoop', 'oura'], confidence: 'Moderate', note: 'Deep sleep + HRV tracking' }
    ];
  }

  get _studies() {
    return {
      robbins2024: { authors: 'Robbins R, et al.', year: 2024, title: 'Accuracy of Three Commercial Wearable Devices for Sleep Tracking', journal: 'Sensors', doi: '10.3390/s24206532', n: 36, independent: false, funder: 'Oura Ring Inc.' },
      dial2025: { authors: 'Dial MB, et al.', year: 2025, title: 'Validation of nocturnal resting HR and HRV in consumer wearables', journal: 'Physiological Reports', doi: '10.14814/phy2.70527', n: '13 (536 nights)', independent: true, funder: null },
      park2023: { authors: 'Park et al.', year: 2023, title: 'Accuracy of 11 Wearable Consumer Sleep Trackers', journal: 'JMIR mHealth', doi: '10.2196/50983', n: 75, independent: true, funder: null },
      schyvens2025: { authors: 'Schyvens AM, et al.', year: 2025, title: 'Performance of six consumer sleep trackers vs polysomnography', journal: 'Sleep Advances', doi: '10.1093/sleepadvances/zpaf016', n: 62, independent: true, funder: null },
      khodr2024: { authors: 'Khodr R, et al.', year: 2024, title: 'WHOOP Wearable Monitoring \u2014 Systematic Review', journal: 'medRxiv', doi: '10.1101/2024.01.04.24300784', n: 'Review', independent: true, funder: null },
      caserman2024: { authors: 'Caserman P, et al.', year: 2024, title: 'Apple Watch VO2 Max Estimation', journal: 'JMIR Biomedical Eng.', doi: null, n: null, independent: true, funder: null },
      lambe2025: { authors: 'Lambe RF, et al.', year: 2025, title: 'Validation of Apple Watch VO2 max estimates', journal: 'PLOS One', doi: '10.1371/journal.pone.0318498', n: null, independent: true, funder: null },
      wellnesspulse2025: { authors: 'WellnessPulse', year: 2025, title: 'Accuracy of Fitness Trackers \u2014 Meta-Analysis', journal: 'WellnessPulse', doi: null, n: 'Meta-analysis', independent: true, funder: null },
      park2023resp: { authors: 'Park et al.', year: 2023, title: 'Validating a Consumer Smartwatch for Nocturnal Respiratory Rate', journal: 'Sensors', doi: '10.3390/s23187867', n: null, independent: false, funder: 'Samsung' },
      lanfranchi2024: { authors: 'Lanfranchi et al.', year: 2024, title: 'Samsung Galaxy Watch SpO2 validation', journal: 'J Clin Sleep Med', doi: '10.5664/jcsm.11178', n: null, independent: false, funder: 'Samsung' }
    };
  }

  get _caveats() {
    return [
      { title: 'No single device wins everywhere', body: 'The best wearable depends entirely on which metric matters most to you. A device that excels at HRV may be poor at step counting, and vice versa.' },
      { title: 'Study funding matters', body: 'Industry-funded studies tend to favor the funder\'s device. The primary sleep study (Robbins et al.) was Oura-funded and ranked Oura #1. Independent studies (Park, Schyvens) reached different conclusions. We flag every study\'s funding source throughout this tool.' },
      { title: 'Device generations change fast', body: 'Some studies tested older hardware (e.g., Garmin Fenix 6, Vivosmart 4). These are 2+ generations behind current models. Results may not reflect the latest firmware and sensor updates.' },
      { title: 'Small sample sizes are common', body: 'The HRV study (Dial 2025) had only 13 participants across 536 nights. The Antwerp sleep study had 62 participants for a single night. Larger, multi-site studies are needed to draw definitive conclusions.' },
      { title: 'All wearables are estimates, not diagnostics', body: 'No consumer wearable is a medical device (except specific FDA-cleared features like Apple Watch ECG). Wearable data should inform your health awareness, not replace professional medical evaluation.' },
      { title: 'Individual variation is significant', body: 'Accuracy varies based on skin tone, tattoos, BMI, device fit, and activity level. Most validation studies have predominantly Caucasian participants \u2014 a documented research gap in wearable accuracy.' },
      { title: 'Calorie tracking is weak across all devices', body: 'The best device (Apple Watch) achieves only 71% accuracy for calorie estimation. Accuracy drops further during high-intensity exercise. No wearable should be relied upon as a precise calorie counter.' },
      { title: 'Even the gold standard has limits', body: 'Polysomnography (the "gold standard" for sleep) has inter-rater reliability of \u03BA\u22480.75 \u2014 meaning trained experts disagree about 25% of the time on sleep staging. All consumer devices tend to misclassify wake, deep, and REM as light sleep.' }
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
        ? `<a href="${affUrl}" class="ds-name-link" target="_blank" rel="noopener sponsored">${d.name}</a>`
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
      const e1 = m.data[dk1] || [];
      const e2 = m.data[dk2] || [];
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

      const val1 = best1 ? best1.label : '—';
      const val2 = best2 ? best2.label : '—';
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
      const e1 = m.data[dk1] || [];
      const e2 = m.data[dk2] || [];
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
            <span class="dd-study-cite">${s.authors} (${s.year}). ${s.journal}${s.n ? ', n=' + s.n : ''}</span>
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

  render() {
    const devices = this._devices;
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <!-- Header -->
      <header class="header">
        <div class="header-inner">
          <a href="https://kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" />
            Wearable Accuracy
          </a>
          <a href="https://kygo.app" class="header-link" target="_blank" rel="noopener">
            Get Kygo App <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </header>

      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge animate-on-scroll">RESEARCH-BACKED COMPARISON</div>
          <h1 class="animate-on-scroll">Which Wearable Is Actually the Most Accurate?</h1>
          <p class="hero-sub animate-on-scroll">We analyzed 17+ peer-reviewed studies so you don't have to. Compare real accuracy data for Oura, Apple Watch, Garmin, WHOOP, Fitbit, and Samsung \u2014 with full bias disclosure.</p>
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
                    <h3>${d.affiliateLinks && d.affiliateLinks.length ? `<a href="${d.affiliateLinks[0].url}" class="dd-name-link" target="_blank" rel="noopener sponsored">${d.name}</a>` : d.name}</h3>
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
                        <a href="${l.url}" class="dd-buy-link" target="_blank" rel="noopener sponsored">
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

      <!-- CTA -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-box animate-on-scroll">
            <div class="cta-box-content">
              <div class="cta-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
              <h2>Go beyond accuracy data. See cause and effect.</h2>
              <p>Kygo connects your wearable data with nutrition to reveal which foods help you sleep, recover, and perform best.</p>
              <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" class="cta-btn-white" target="_blank" rel="noopener">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Download Free on iOS
              </a>
              <div class="cta-features">
                <span class="cta-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Free forever plan</span>
                <span class="cta-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Syncs with 4+ wearables</span>
                <span class="cta-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> AI food logging</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer class="tool-footer">
        <div class="container">
          <a href="https://kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" />
            Kygo Health
          </a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <div class="footer-links">
            <a href="https://kygo.app" target="_blank" rel="noopener">Kygo App</a>
            <a href="https://kygo.app/privacy" target="_blank" rel="noopener">Privacy</a>
            <a href="https://kygo.app/terms" target="_blank" rel="noopener">Terms</a>
          </div>
          <p class="footer-copyright">Data last updated February 2025. All accuracy claims sourced from peer-reviewed research with full bias disclosure.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, I earn from qualifying purchases.</p>
          <p class="footer-copyright">\u00A9 ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
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
      .header-link {
        color: var(--green);
        text-decoration: none;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 500;
        transition: color 0.2s;
      }
      .header-link:hover { color: var(--green-dark); }

      /* Animations */
      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: var(--delay, 0ms); }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      /* ── Hero ── */
      .hero { padding: 48px 0 40px; text-align: center; }
      .hero-badge { display: inline-block; padding: 8px 16px; border-radius: 50px; background: var(--green-light); color: var(--green-dark); font-size: 12px; font-weight: 700; letter-spacing: 1px; margin-bottom: 16px; }
      .hero h1 { font-size: clamp(28px, 7vw, 36px); margin-bottom: 16px; color: var(--dark); }
      .hero-sub { font-size: clamp(16px, 4vw, 18px); color: var(--gray-600); max-width: 640px; margin: 0 auto; line-height: 1.7; }

      /* ── Section Titles ── */
      .section-title { font-size: clamp(24px, 6vw, 36px); text-align: center; margin-bottom: 8px; }
      .section-sub { font-size: clamp(14px, 4vw, 16px); color: var(--gray-600); text-align: center; margin-bottom: 32px; max-width: 560px; margin-left: auto; margin-right: auto; }

      /* ── Comparison ── */
      .comparison { padding: 48px 0; background: #fff; }
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
      .md-bar-study { font-size: 11px; color: var(--gray-400); white-space: nowrap; display: flex; align-items: center; gap: 4px; grid-column: 1 / -1; }
      .md-bar-study.biased-text { color: #D97706; }
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

      /* ── Quick Recommendations ── */
      .recommendations { padding: 48px 0; background: #fff; }
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

      /* ── CTA ── */
      .cta-section { padding: 48px 0; }
      .cta-box {
        background: linear-gradient(135deg, var(--green), var(--green-dark));
        border-radius: var(--radius);
        padding: 32px 20px;
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
      .cta-btn-white {
        background: white;
        color: var(--green-dark);
        padding: 14px 28px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 15px;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s;
        border: none;
        cursor: pointer;
        font-family: inherit;
      }
      .cta-btn-white:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
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
        .header-link { font-size: 14px; gap: 6px; }
        .hero h1 { font-size: clamp(36px, 5vw, 48px); }
        .hero-sub { font-size: 18px; }
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
        .hero { padding: 80px 0 64px; }
        .comparison, .recommendations, .deep-dives, .caveats, .cta-section { padding: 80px 0; }
        .device-summary-card { padding: 28px; }
        .device-summary-card .ds-icon { width: 56px; height: 56px; }
        .metric-detail { padding: 32px; }
        .md-bar-row { grid-template-columns: 1fr 80px 160px; }
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
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Wearable Accuracy Comparison Tool',
      'description': 'Compare accuracy of popular wearable devices (Oura Ring, Apple Watch, Garmin, WHOOP, Fitbit, Samsung) across sleep, HRV, heart rate, SpO2, steps, calories, VO2 max, skin temperature, and respiratory rate. Data sourced from 17+ peer-reviewed studies with full bias disclosure.',
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'url': 'https://www.kygohealth.com/wearable-accuracy',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygohealth.com' },
      'about': {
        '@type': 'MedicalScholarlyArticle',
        'name': 'Wearable Device Accuracy Research Summary',
        'description': 'Comparative analysis of wearable accuracy across 9 health metrics based on 17+ peer-reviewed studies with full funding bias disclosure.'
      },
      'keywords': 'wearable accuracy, Oura Ring accuracy, Apple Watch accuracy, Garmin accuracy, WHOOP accuracy, Fitbit accuracy, Samsung Galaxy Watch accuracy, sleep tracking accuracy, HRV accuracy, heart rate accuracy, SpO2 accuracy, step counting accuracy, VO2 max accuracy'
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-kygo-wearable-ld', '');
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }
}

customElements.define('kygo-wearable-accuracy', KygoWearableAccuracy);
