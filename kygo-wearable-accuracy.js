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
    this._activeMetric = 'sleep';
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
        icon: this._appleWatchIcon(),
        bestFor: 'Active HR, SpO2, Sleep (independent), FDA features',
        subscription: 'None required',
        strengths: ['Best active HR (86.3%)', 'Best SpO2 (MAE 2.2%)', 'Top independent sleep \u03BA=0.53', 'Best wake detection (52.2%)', 'Best REM detection (68.6%)', 'FDA-cleared ECG & sleep apnea'],
        weaknesses: ['VO2 max 13\u201316% error', 'Underestimates deep sleep', 'Daily charging needed'],
        researchNote: null,
        studyIds: ['robbins2024', 'schyvens2025', 'park2023', 'wellnesspulse2025', 'caserman2024', 'lambe2025']
      },
      'oura': {
        name: 'Oura Ring',
        short: 'Oura Ring',
        color: '#C4A97D',
        icon: this._ouraIcon(),
        bestFor: 'HRV, Resting HR, Skin Temp, Recovery',
        subscription: '$5.99/mo required',
        strengths: ['Best HRV accuracy (CCC 0.99)', 'Best resting HR (CCC 0.98)', 'Best skin temp (r\u00B2>0.99)', 'Comfortable sleep wear'],
        weaknesses: ['Poor step counting (~50% error)', 'No active HR during exercise', 'No GPS, no screen'],
        researchNote: 'Sleep \u03BA=0.65 is from an Oura-funded study. Independent studies found \u03BA=0.2\u20130.4.',
        studyIds: ['robbins2024', 'dial2025', 'park2023']
      },
      'garmin': {
        name: 'Garmin',
        short: 'Garmin',
        color: '#007CC3',
        icon: this._garminIcon(),
        bestFor: 'Steps, GPS, Outdoor Sports, VO2 Max, Battery',
        subscription: 'None required',
        strengths: ['Best step accuracy (82.6%)', 'Best VO2 max (MAPE 7.05%)', 'Best GPS & battery life', 'Multi-sport tracking'],
        weaknesses: ['Poor sleep staging (\u03BA=0.21)', 'Poor wake detection (27.6%)', 'Lower HRV (CCC 0.87)', 'Worst calorie tracking (48%)'],
        researchNote: 'HRV/sleep studies used Fenix 6 / Vivosmart 4 (older models). Current devices may perform better.',
        studyIds: ['schyvens2025', 'dial2025', 'wellnesspulse2025']
      },
      'whoop': {
        name: 'WHOOP',
        short: 'WHOOP',
        color: '#44B78B',
        icon: this._whoopIcon(),
        bestFor: 'Recovery, Strain, Deep Sleep, Athlete Training',
        subscription: '$30/mo (12-month)',
        strengths: ['Best deep sleep detection (69.6%)', 'Good HRV (CCC 0.94)', 'Best TST agreement (-1.4 min)', '99.7% HR during sleep'],
        weaknesses: ['Moderate sleep staging (\u03BA=0.37)', 'Overestimates REM by ~21 min', 'Poor wake detection (32.5%)', 'No screen, expensive subscription'],
        researchNote: null,
        studyIds: ['schyvens2025', 'dial2025', 'khodr2024']
      },
      'fitbit': {
        name: 'Fitbit',
        short: 'Fitbit',
        color: '#00B0B9',
        icon: this._fitbitIcon(),
        bestFor: 'General Fitness, Sleep Basics, Affordability',
        subscription: 'Premium optional ($9.99/mo)',
        strengths: ['Moderate sleep accuracy (\u03BA=0.42\u20130.55)', 'Decent deep sleep sensitivity (61.7%)', 'FDA-cleared irregular rhythm', 'Affordable entry point'],
        weaknesses: ['Below leaders in most metrics', 'Declining validation research since Google acquisition'],
        researchNote: null,
        studyIds: ['robbins2024', 'schyvens2025', 'park2023', 'wellnesspulse2025']
      },
      'samsung': {
        name: 'Samsung Galaxy Watch',
        short: 'Samsung',
        color: '#1428A0',
        icon: this._samsungIcon(),
        bestFor: 'Android Users, Sleep Apnea Screening, SpO2',
        subscription: 'None required',
        strengths: ['FDA-cleared sleep apnea detection', 'Validated respiratory rate (RMSE 1.13)', 'FDA-cleared ECG', 'Good Android integration'],
        weaknesses: ['Limited independent accuracy studies', 'Less validation data than Apple/Oura'],
        researchNote: null,
        studyIds: ['park2023', 'park2023resp', 'lanfranchi2024']
      }
    };
  }

  get _metrics() {
    return {
      sleep: {
        name: 'Sleep Staging',
        desc: 'How accurately the device classifies sleep into Wake, Light, Deep, and REM stages compared to polysomnography (PSG).',
        unit: "Cohen's \u03BA",
        goldStandard: 'Polysomnography (PSG)',
        higherBetter: true,
        scale: { min: 0, max: 0.8 },
        data: {
          'apple-watch': [
            { value: 0.60, label: '\u03BA=0.60', study: 'Robbins 2024', biased: true },
            { value: 0.53, label: '\u03BA=0.53', study: 'Schyvens 2025', biased: false },
            { value: 0.3, label: '\u03BA=0.2\u20130.4', study: 'Park 2023', biased: false }
          ],
          'oura': [
            { value: 0.65, label: '\u03BA=0.65', study: 'Robbins 2024', biased: true },
            { value: 0.3, label: '\u03BA=0.2\u20130.4', study: 'Park 2023', biased: false }
          ],
          'garmin': [
            { value: 0.21, label: '\u03BA=0.21', study: 'Schyvens 2025', biased: false }
          ],
          'whoop': [
            { value: 0.37, label: '\u03BA=0.37', study: 'Schyvens 2025', biased: false }
          ],
          'fitbit': [
            { value: 0.55, label: '\u03BA=0.55', study: 'Robbins 2024', biased: true },
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
            { value: 3.0, label: 'Reliable', study: 'J Clin Sleep Med 2024', biased: true }
          ]
        },
        insight: 'Apple Watch leads with MAE of 2.2%, but only 58% of readings fall within clinical accuracy range. Skin pigmentation and tattoos affect all SpO2 sensors. No wearable SpO2 is medical-grade.'
      },
      steps: {
        name: 'Step Counting',
        desc: 'How accurately the device counts steps during daily activity.',
        unit: 'Accuracy %',
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
        goldStandard: 'iButton research-grade sensors',
        higherBetter: true,
        scale: { min: 0.8, max: 1.0 },
        data: {
          'apple-watch': [],
          'oura': [
            { value: 0.99, label: 'r\u00B2>0.99 (lab)', study: 'Oura 2024', biased: true },
            { value: 0.92, label: 'r\u00B2>0.92 (real-world)', study: 'Oura 2024', biased: true }
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

  _appleWatchIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="2" width="12" height="20" rx="3"/><rect x="8" y="5" width="8" height="11" rx="1" fill="currentColor" opacity="0.15"/><line x1="10" y1="20" x2="14" y2="20"/></svg>'; }
  _ouraIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="5" stroke-dasharray="2 2"/></svg>'; }
  _garminIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 16 14"/></svg>'; }
  _whoopIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="8" cy="12" r="1.5" fill="currentColor"/></svg>'; }
  _fitbitIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="7" y="2" width="10" height="20" rx="3"/><circle cx="12" cy="10" r="3"/><line x1="12" y1="7" x2="12" y2="10"/><line x1="12" y1="10" x2="14" y2="11.5"/></svg>'; }
  _samsungIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 3C14 8 14 16 12 21"/><path d="M12 3C10 8 10 16 12 21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>'; }

  _getUseCaseIcon(name) {
    const icons = {
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      heartPulse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      steps: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6S11.97 5.28 12 8c.03 2.5-1 3.5-1 5.62V16"/><path d="M12 16v-2.38c0-2.12-1.03-3.12-1-5.62.03-2.72 1.49-6 4.5-6S19.97 5.28 20 8c.03 2.5-1 3.5-1 5.62V16"/></svg>',
      lungs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.081 20C2.732 20 2 17.667 2 16.167c0-2.667 1.333-5 4.333-3l2-3.834C7.56 7.778 6.64 5.112 8.227 3.5 9.814 1.889 12 3.5 12 6v6"/><path d="M17.919 20C21.268 20 22 17.667 22 16.167c0-2.667-1.333-5-4.333-3l-2-3.834c.773-1.555 1.693-4.221.106-5.833C14.186 1.889 12 3.5 12 6v6"/></svg>',
      droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
      shieldPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>',
      dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.5 6.5h11M6 12h12M7 6.5V17M17 6.5V17M4.5 9V15M19.5 9V15M2 10v4M22 10v4"/></svg>'
    };
    return icons[name] || icons.activity;
  }

  // ── Render Helpers ─────────────────────────────────────────────────────

  _renderDeviceSummaryRow() {
    const devices = this._devices;
    return this._selectedDevices.map(dk => {
      const d = devices[dk];
      return `
      <div class="device-summary-card" style="--accent:${d.color}">
        <div class="ds-icon">${d.icon}</div>
        <h3>${d.name}</h3>
        <div class="ds-best-for">${d.bestFor}</div>
        <div class="ds-sub">${d.subscription}</div>
      </div>`;
    }).join('');
  }

  _renderMetricTabs() {
    return Object.entries(this._metrics).map(([k, m]) =>
      `<button class="metric-tab ${k === this._activeMetric ? 'active' : ''}" data-metric="${k}" role="tab">${m.name}</button>`
    ).join('');
  }

  _renderMetricDetail() {
    const devices = this._devices;
    const metric = this._metrics[this._activeMetric];
    return `
      <div class="md-header">
        <h3>${metric.name}</h3>
        <span class="md-gold">Gold Standard: ${metric.goldStandard}</span>
      </div>
      <p class="md-desc">${metric.desc}</p>
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
                <div class="md-bar-study ${e.biased ? 'biased-text' : ''}">${e.study}${e.biased ? ' <span class="funded-badge">funded</span>' : ''}</div>
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
            <span class="dd-study-badge ${s.independent ? 'independent' : 'funded'}">${s.independent ? 'Independent' : 'Funded'}</span>
            <span class="dd-study-cite">${s.authors} (${s.year}). ${s.journal}${s.n ? ', n=' + s.n : ''}${!s.independent ? ' \u2014 ' + s.funder : ''}</span>
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

      <!-- Quick Recommendations -->
      <section class="recommendations">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Best Wearable by Use Case</h2>
          <p class="section-sub animate-on-scroll">What matters most to you? Here's what the research says.</p>
          <div class="rec-list animate-on-scroll">
            ${this._useCases.map((uc, i) => `
              <div class="rec-row" style="--delay:${i * 100}ms">
                <div class="rec-icon">${this._getUseCaseIcon(uc.icon)}</div>
                <div class="rec-label">${uc.label}</div>
                <div class="rec-devices">${uc.devices.map(dk => `<span class="rec-device" style="--dc:${devices[dk].color}">${devices[dk].short}</span>`).join('')}</div>
                <div class="rec-confidence ${uc.confidence.toLowerCase()}">${uc.confidence}</div>
                <div class="rec-note">${uc.note}</div>
              </div>
            `).join('')}
          </div>
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
                    <h3>${d.name}</h3>
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
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Caveats -->
      <section class="caveats">
        <div class="container">
          <div class="caveat-box animate-on-scroll">
            <h2>Important Things to Know</h2>
            <div class="caveat-list">
              ${this._caveats.map((c, i) => `
                <div class="caveat-item ${this._expandedCaveats.has(i) ? 'open' : ''}" data-caveat="${i}">
                  <div class="caveat-header">
                    <span class="caveat-title">${c.title}</span>
                    <span class="caveat-toggle"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></span>
                  </div>
                  <div class="caveat-body"><p>${c.body}</p></div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-box animate-on-scroll">
            <img src="${logoUrl}" alt="Kygo Health" class="cta-logo" width="48" height="48" loading="lazy"/>
            <h2>Get More From Your Wearable</h2>
            <p>Kygo Health syncs with your wearable data to deliver personalized nutrition and recovery insights.</p>
            <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" class="cta-btn" target="_blank" rel="noopener">Download Kygo Health</a>
          </div>
        </div>
      </section>

      <footer class="tool-footer">
        <div class="container">
          <p>Data last updated February 2025. All accuracy claims sourced from peer-reviewed research with full bias disclosure. This tool is for informational purposes only and does not constitute medical advice.</p>
          <p>\u00A9 ${new Date().getFullYear()} Kygo Health. All rights reserved.</p>
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

      /* Animations */
      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: var(--delay, 0ms); }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      /* ── Hero ── */
      .hero { padding: 48px 0 40px; text-align: center; background: linear-gradient(180deg, #f0fdf4 0%, var(--light) 100%); }
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
      .vs-badge { width: 40px; height: 40px; border-radius: 50%; background: var(--dark); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 16px; }

      .device-summary-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
      .device-summary-card { padding: 20px; border-radius: var(--radius); background: var(--gray-50); border: 2px solid var(--gray-200); text-align: center; transition: all 0.3s ease; }
      .device-summary-card:hover { border-color: var(--green); box-shadow: var(--shadow-hover); transform: translateY(-4px); }
      .device-summary-card .ds-icon { width: 40px; height: 40px; margin: 0 auto 8px; color: var(--accent); }
      .device-summary-card .ds-icon svg { width: 100%; height: 100%; }
      .device-summary-card h3 { font-size: 16px; margin-bottom: 4px; }
      .ds-best-for { font-size: 12px; color: var(--gray-600); margin-bottom: 4px; }
      .ds-sub { font-size: 11px; color: var(--gray-400); }

      /* Metric Tabs */
      .metric-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 20px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
      .metric-tabs::-webkit-scrollbar { display: none; }
      .metric-tab { padding: 8px 14px; border-radius: 50px; border: 2px solid var(--gray-200); background: #fff; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--gray-600); cursor: pointer; white-space: nowrap; transition: all 0.2s; }
      .metric-tab:hover { border-color: var(--gray-300); color: var(--dark); }
      .metric-tab.active { background: var(--dark); color: #fff; border-color: var(--dark); }

      /* Metric Detail */
      .metric-detail { background: var(--gray-50); border-radius: var(--radius); padding: 24px; border: 2px solid var(--gray-200); }
      .md-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
      .md-header h3 { font-size: 20px; }
      .md-gold { font-size: 12px; color: var(--gray-400); background: var(--gray-100); padding: 4px 10px; border-radius: 6px; }
      .md-desc { font-size: 14px; color: var(--gray-600); margin-bottom: 20px; line-height: 1.6; }

      .md-bars { display: flex; flex-direction: column; gap: 20px; margin-bottom: 20px; }
      .md-bar-label { font-size: 14px; font-weight: 600; margin-bottom: 8px; padding-left: 2px; color: var(--accent); }
      .md-bar-row { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 10px; margin-bottom: 6px; }
      .md-bar-track { height: 28px; background: var(--gray-200); border-radius: 6px; overflow: hidden; }
      .md-bar-fill { height: 100%; border-radius: 6px; transition: width 0.6s ease-out; min-width: 8px; }
      .md-bar-fill.biased { opacity: 0.5; background-image: repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px) !important; }
      .md-bar-value { font-size: 13px; font-weight: 700; white-space: nowrap; min-width: 70px; text-align: right; }
      .md-bar-study { font-size: 11px; color: var(--gray-400); white-space: nowrap; min-width: 90px; display: flex; align-items: center; gap: 4px; }
      .md-bar-study.biased-text { color: #D97706; }
      .md-no-data { padding: 12px 16px; background: var(--gray-100); border-radius: 8px; font-size: 13px; color: var(--gray-400); font-style: italic; }

      .funded-badge { font-size: 10px; font-weight: 600; color: #92400E; background: #FEF3C7; padding: 1px 6px; border-radius: 4px; }

      .md-insight { display: flex; gap: 10px; padding: 14px 16px; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: var(--radius-sm); }
      .md-insight-icon { flex-shrink: 0; color: #D97706; margin-top: 2px; }
      .md-insight p { font-size: 13px; color: #92400E; line-height: 1.6; }

      /* ── Quick Recommendations ── */
      .recommendations { padding: 48px 0; }
      .rec-list { display: flex; flex-direction: column; gap: 0; background: #fff; border-radius: var(--radius); border: 2px solid var(--gray-200); overflow: hidden; box-shadow: var(--shadow); }
      .rec-row { display: grid; grid-template-columns: 32px 1fr; grid-template-rows: auto auto; align-items: center; gap: 4px 12px; padding: 14px 16px; border-bottom: 1px solid var(--gray-100); transition: background 0.2s; }
      .rec-row:last-child { border-bottom: none; }
      .rec-row:hover { background: var(--gray-50); }
      .rec-icon { grid-row: 1 / 3; width: 28px; height: 28px; color: var(--green-dark); }
      .rec-icon svg { width: 100%; height: 100%; }
      .rec-label { font-size: 14px; font-weight: 600; color: var(--dark); display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .rec-devices { display: inline-flex; gap: 4px; }
      .rec-device { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; background: color-mix(in srgb, var(--dc) 12%, white); color: var(--dc); }
      .rec-confidence { font-size: 11px; font-weight: 600; }
      .rec-confidence.high { color: var(--green-dark); }
      .rec-confidence.moderate { color: #D97706; }
      .rec-confidence.low { color: #DC2626; }
      .rec-note { grid-column: 2; font-size: 12px; color: var(--gray-400); }

      /* ── Device Deep Dives ── */
      .deep-dives { padding: 48px 0; background: #fff; }
      .dd-grid { display: flex; flex-direction: column; gap: 12px; }
      .dd-card { background: var(--gray-50); border-radius: var(--radius); border: 2px solid var(--gray-200); overflow: hidden; transition: all 0.3s ease; box-shadow: var(--shadow); }
      .dd-card:hover { border-color: var(--green); box-shadow: var(--shadow-hover); transform: translateY(-4px); }
      .dd-header { display: flex; align-items: center; gap: 12px; padding: 16px 20px; cursor: pointer; }
      .dd-icon { width: 36px; height: 36px; flex-shrink: 0; color: var(--accent); }
      .dd-icon svg { width: 100%; height: 100%; }
      .dd-info { flex: 1; min-width: 0; }
      .dd-info h3 { font-size: 16px; margin-bottom: 2px; }
      .dd-bestfor { font-size: 12px; color: var(--gray-400); }
      .dd-toggle { flex-shrink: 0; color: var(--gray-400); transition: transform 0.3s; }
      .dd-card.expanded .dd-toggle { transform: rotate(180deg); }
      .dd-body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1); padding: 0 20px; }
      .dd-card.expanded .dd-body { max-height: 800px; padding: 0 20px 20px; }
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

      /* ── Caveats ── */
      .caveats { padding: 48px 0; }
      .caveat-box { background: linear-gradient(135deg, #1E293B, #334155); border-radius: var(--radius); padding: 32px 20px; color: #fff; }
      .caveat-box h2 { font-size: clamp(20px, 5vw, 24px); margin-bottom: 20px; text-align: center; }
      .caveat-list { display: flex; flex-direction: column; gap: 8px; }
      .caveat-item { background: rgba(255,255,255,0.06); border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.08); overflow: hidden; transition: background 0.2s; }
      .caveat-item:hover { background: rgba(255,255,255,0.09); }
      .caveat-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; cursor: pointer; gap: 8px; }
      .caveat-title { font-size: 14px; font-weight: 600; color: #fff; }
      .caveat-toggle { flex-shrink: 0; color: rgba(255,255,255,0.4); transition: transform 0.3s; }
      .caveat-item.open .caveat-toggle { transform: rotate(180deg); }
      .caveat-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding 0.35s ease; padding: 0 16px; }
      .caveat-item.open .caveat-body { max-height: 200px; padding: 0 16px 14px; }
      .caveat-body p { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6; }

      /* ── CTA ── */
      .cta-section { padding: 48px 0; }
      .cta-box { text-align: center; padding: 40px 24px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: var(--radius); border: 1px solid #BBF7D0; }
      .cta-logo { width: 48px; height: 48px; border-radius: 12px; margin-bottom: 16px; }
      .cta-box h2 { font-size: clamp(20px, 5vw, 24px); margin-bottom: 8px; }
      .cta-box p { font-size: 15px; color: var(--gray-600); margin-bottom: 20px; max-width: 400px; margin-left: auto; margin-right: auto; line-height: 1.6; }
      .cta-btn { display: inline-block; padding: 14px 28px; border-radius: 12px; background: var(--green); color: #fff; font-family: inherit; font-size: 15px; font-weight: 600; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 14px rgba(34,197,94,0.3); }
      .cta-btn:hover { background: var(--green-dark); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(34,197,94,0.4); }
      .cta-btn:active { transform: scale(0.97); }

      /* ── Footer ── */
      .tool-footer { padding: 32px 0; text-align: center; border-top: 1px solid var(--gray-200); }
      .tool-footer p { font-size: 12px; color: var(--gray-400); margin-bottom: 4px; line-height: 1.6; }

      /* ── Tablet (768px) ── */
      @media (min-width: 768px) {
        .hero h1 { font-size: clamp(36px, 5vw, 48px); }
        .hero-sub { font-size: 18px; }
        .section-title { font-size: 32px; }
        .comparison, .recommendations, .deep-dives, .caveats, .cta-section { padding: 64px 0; }
        .device-summary-card { padding: 24px; }
        .metric-detail { padding: 28px; }
        .rec-row { grid-template-columns: 32px auto 1fr auto auto; grid-template-rows: auto; gap: 12px; padding: 12px 20px; }
        .rec-note { grid-column: auto; }
        .rec-label { font-size: 14px; }
        .dd-header { padding: 18px 24px; }
        .dd-body { padding: 0 24px; }
        .dd-card.expanded .dd-body { padding: 0 24px 24px; }
        .caveat-box { padding: 40px 32px; }
      }

      /* ── Desktop (1024px) ── */
      @media (min-width: 1024px) {
        .hero { padding: 80px 0 64px; }
        .comparison, .recommendations, .deep-dives, .caveats, .cta-section { padding: 80px 0; }
        .device-summary-card { padding: 28px; }
        .metric-detail { padding: 32px; }
        .md-bar-row { grid-template-columns: 1fr 80px 160px; }
        .dd-header { padding: 20px 28px; }
        .dd-body { padding: 0 28px; }
        .dd-card.expanded .dd-body { padding: 0 28px 28px; }
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

      // Device deep dive toggle
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
        const item = caveatHeader.closest('.caveat-item');
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
