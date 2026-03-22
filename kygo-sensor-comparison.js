/**
 * Kygo Health — Wearable Sensor & Health Metric Comparison Tool
 * Tag: kygo-sensor-comparison
 * Interactive comparison of sensor hardware, health metrics, and software algorithms across 6 wearable devices (2025 latest gen)
 */

/** SEO helper — injects visible text outside Shadow DOM for crawlers */
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

// Polyfill roundRect for older browsers
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    const r = typeof radii === 'number' ? radii : (Array.isArray(radii) ? radii[0] : 0);
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
  };
}

class KygoSensorComparison extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._activeTab = 'hardware';
    this._expandedSensor = null;
    this._expandedMetric = null;
    this._expandedAlgo = null;
    this._expandedSource = null;
    this._eventsBound = false;
    this._radarVisibleBrands = null;
    this._radarClickBound = false;
    this._radarLegendAreas = [];
  }

  connectedCallback() {
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    this._injectStructuredData();
    this._drawCharts();
    __seo(this, 'Wearable Hardware and Software Differences Tool by Kygo Health. See exactly what makes Garmin Venu 4, Whoop 5.0, Oura Ring 4, Apple Watch Series 10, Apple Watch Ultra 3, and Fitbit Charge 6 different under the hood. Sensor counts: Apple Watch Ultra 3 has 11 sensors (most), Garmin Venu 4 has 10, Apple Watch S10 has 10, Fitbit Charge 6 has 7, Whoop 5.0 has 4, Oura Ring 4 has 4. Hardware differences across 16 sensor types: PPG optical heart rate, ECG, SpO2, skin temperature, EDA stress sensor, accelerometer, gyroscope, barometric altimeter, GPS, depth gauge, NFC, mic/speaker, ambient light, noise level, LED flashlight, compass. Key hardware facts: Oura has 18-path PPG on the finger for best signal quality. Whoop has fastest PPG sampling at 26 Hz. Garmin has best GPS with multi-band GNSS L1/L5. Fitbit is the only device with a dedicated EDA stress sensor. Only Apple Watch detects sleep apnea using accelerometer (FDA-authorized). Only Apple Watch Ultra 3 has hypertension alerts via PPG pulse wave analysis. ECG available on Garmin, Apple Watch S10, Apple Watch Ultra 3, and Fitbit — not on Whoop 5.0 or Oura Ring 4. How hardware differences affect health metrics: HRV heart rate variability, sleep apnea detection, stress measurement, hypertension alerts, fall detection, blood oxygen SpO2, respiratory rate, skin temperature trends, cycle tracking. FDA-cleared features: Apple Watch Ultra 3 has 3 (ECG, Apnea, Hypertension), Apple Watch S10 has 2 (ECG, Apnea), Garmin has 1 (ECG/AFib), Fitbit has 1 (ECG/AFib), Whoop has 0, Oura has 0. Software differences across 25 proprietary algorithms: Garmin has 6 algorithms including Body Battery and Training Readiness and HRV Status and Health Status and Sleep Coach and Lifestyle Habit Logging. Whoop has 8 algorithms including Recovery Score and Strain Score and VO2 Max and Healthspan/Whoop Age and Hormonal Insights and Journal and Sleep Coach and Whoop Coach AI powered by OpenAI. Oura has 4 algorithms including Readiness Score and Cardiovascular Age and Cardio Capacity VO2 Max and Resilience. Apple has 4 algorithms including Sleep Score and Vitals App and Cardio Fitness VO2 Max and Hearing Health. Fitbit has 3 algorithms including Daily Readiness and Stress Management Score with EDA and Active Zone Minutes. Brand focus areas rated 0-10: Garmin strongest in Training (10) and Recovery (9). Whoop strongest in Recovery (10) and Longevity (10). Oura strongest in Sleep (10). Apple strongest in Medical (10). Fitbit strongest in Stress (9). Whoop vs Oura vs Garmin vs Apple Watch vs Fitbit — what is actually different about each wearable. Data verified March 2026.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
  }

  // ── Device Data ────────────────────────────────────────────────────────

  get _devices() {
    return {
      garmin: {
        name: 'Garmin Venu 4',
        short: 'Garmin',
        color: '#f59e0b',
        imageUrl: 'https://static.wixstatic.com/media/273a63_c545c093c04d4ca4ade77e5ca43fd433~mv2.png',
        sensorCount: 10,
        algoCount: 6,
        fdaCount: 1,
        uniqueSensor: 'Best GPS (multi-band GNSS L1/L5)',
        affiliateUrl: 'https://amzn.to/4aF8l5D'
      },
      whoop: {
        name: 'Whoop 5.0',
        short: 'Whoop',
        color: '#3b82f6',
        imageUrl: 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png',
        sensorCount: 4,
        algoCount: 8,
        fdaCount: 0,
        uniqueSensor: 'Fastest PPG sampling (26 Hz)',
        affiliateUrl: 'https://amzn.to/4suRaen'
      },
      oura: {
        name: 'Oura Ring 4',
        short: 'Oura',
        color: '#C4A97D',
        imageUrl: 'https://static.wixstatic.com/media/273a63_722e50e1a554453eb4c71a2e7a58925d~mv2.png',
        sensorCount: 4,
        algoCount: 4,
        fdaCount: 0,
        uniqueSensor: 'Best PPG (18-path, finger-based)',
        affiliateUrl: 'https://amzn.to/4aF93jj'
      },
      appleS10: {
        name: 'Apple Watch S10',
        short: 'Apple S10',
        color: '#6b7280',
        imageUrl: 'https://static.wixstatic.com/media/273a63_68b4900c356b4d0c8982e5ecd10f04fe~mv2.png',
        sensorCount: 10,
        algoCount: 4,
        fdaCount: 2,
        uniqueSensor: 'Depth gauge (6m)',
        affiliateUrl: 'https://amzn.to/4rUcGst'
      },
      appleU3: {
        name: 'Apple Watch Ultra 3',
        short: 'Apple Ultra 3',
        color: '#a855f7',
        imageUrl: 'https://static.wixstatic.com/media/273a63_68b4900c356b4d0c8982e5ecd10f04fe~mv2.png',
        sensorCount: 11,
        algoCount: 4,
        fdaCount: 3,
        uniqueSensor: 'Depth gauge (40m) + Hypertension PPG',
        affiliateUrl: 'https://amzn.to/4rUcGst'
      },
      fitbit: {
        name: 'Fitbit Charge 6',
        short: 'Fitbit',
        color: '#10b981',
        imageUrl: 'https://static.wixstatic.com/media/273a63_c12bab319dc34737a386c7449f5f92c7~mv2.png',
        sensorCount: 7,
        algoCount: 3,
        fdaCount: 1,
        uniqueSensor: 'Only EDA stress sensor',
        affiliateUrl: 'https://amzn.to/3ZPkHDc'
      }
    };
  }

  // ── Sensor Hardware Data ───────────────────────────────────────────────

  get _sensors() {
    return [
      { key: 'ppg', name: 'Optical HR (PPG)', garmin: 'Elevate Gen 5 — green + red + IR LEDs', whoop: 'Custom PPG — 26 Hz sampling', oura: '18-path — green + red + IR, 3 photodiodes', appleS10: '3rd-gen optical', appleU3: '3rd-gen optical', fitbit: 'Optical HR' },
      { key: 'ecg', name: 'ECG', garmin: 'Single-lead', whoop: null, oura: null, appleS10: 'Single-lead', appleU3: 'Single-lead', fitbit: 'Single-lead', whoopNote: 'MG only' },
      { key: 'spo2', name: 'SpO2 (Blood Oxygen)', garmin: 'Pulse Ox (red + IR)', whoop: 'Optical', oura: 'Red + IR LEDs', appleS10: 'Optical', appleU3: 'Optical', fitbit: 'SpO2 sensor' },
      { key: 'temp', name: 'Skin Temperature', garmin: 'Dedicated sensor', whoop: 'Digital temp sensor (±1°C)', oura: 'Digital temp sensor', appleS10: 'Wrist temp (sleep)', appleU3: 'Wrist temp (sleep)', fitbit: 'Skin temp sensor' },
      { key: 'eda', name: 'EDA (Stress Sensor)', garmin: null, whoop: null, oura: null, appleS10: null, appleU3: null, fitbit: 'Scan-based (90-sec manual)' },
      { key: 'accel', name: 'Accelerometer', garmin: 'Yes', whoop: 'Yes', oura: 'Bosch MEMS', appleS10: 'High-g', appleU3: 'High-g', fitbit: '3-axis' },
      { key: 'gyro', name: 'Gyroscope', garmin: 'Yes', whoop: null, oura: null, appleS10: 'High dynamic range', appleU3: 'High dynamic range', fitbit: null },
      { key: 'baro', name: 'Barometric Altimeter', garmin: 'Yes', whoop: null, oura: null, appleS10: 'Always-on', appleU3: 'Always-on', fitbit: null },
      { key: 'compass', name: 'Compass', garmin: 'Yes', whoop: null, oura: null, appleS10: 'Yes', appleU3: 'Yes', fitbit: null },
      { key: 'gps', name: 'GPS', garmin: 'Multi-band GNSS (L1/L5)', whoop: null, oura: null, appleS10: 'L1 + GLONASS + Galileo + BeiDou', appleU3: 'Dual-freq L1/L5 + all constellations', fitbit: 'Built-in GPS', whoopNote: 'phone GPS' },
      { key: 'depth', name: 'Depth / Water Temp', garmin: null, whoop: null, oura: null, appleS10: 'Up to 6m', appleU3: 'Up to 40m (EN 13319)', fitbit: null },
      { key: 'nfc', name: 'NFC', garmin: 'Garmin Pay', whoop: null, oura: null, appleS10: 'Apple Pay', appleU3: 'Apple Pay', fitbit: 'Google Wallet' },
      { key: 'mic', name: 'Mic / Speaker', garmin: 'Yes', whoop: null, oura: null, appleS10: 'Yes', appleU3: 'Yes', fitbit: null },
      { key: 'ambient', name: 'Ambient Light', garmin: 'Yes', whoop: null, oura: null, appleS10: 'Yes', appleU3: 'Yes', fitbit: 'Yes' },
      { key: 'noise', name: 'Noise / Sound Level', garmin: null, whoop: null, oura: null, appleS10: 'Hearing health', appleU3: 'Hearing health', fitbit: null },
      { key: 'flashlight', name: 'LED Flashlight', garmin: 'Yes', whoop: null, oura: null, appleS10: null, appleU3: null, fitbit: null }
    ];
  }

  // ── Health Metrics Data ────────────────────────────────────────────────

  get _healthMetrics() {
    return [
      { key: 'rhr', name: 'Resting Heart Rate', sensor: 'PPG', garmin: '24/7', whoop: '24/7, 26 Hz', oura: '24/7, 18-path', appleS10: '24/7', appleU3: '24/7', fitbit: '24/7' },
      { key: 'hrv', name: 'Heart Rate Variability', sensor: 'PPG', garmin: 'Trends + status', whoop: 'Nightly avg', oura: 'Nightly + daytime', appleS10: 'Nightly avg', appleU3: 'Nightly avg', fitbit: 'Nightly avg' },
      { key: 'ecg_afib', name: 'ECG / AFib Detection', sensor: 'ECG electrodes', garmin: 'On-demand + alerts', whoop: null, oura: null, appleS10: 'On-demand + alerts', appleU3: 'On-demand + alerts', fitbit: 'On-demand + Irregular Rhythm', whoopNote: 'MG only', ouraNote: 'No ECG' },
      { key: 'spo2_metric', name: 'Blood Oxygen (SpO2)', sensor: 'Red + IR LEDs', garmin: 'On-demand + overnight', whoop: 'Continuous overnight', oura: 'Overnight auto', appleS10: 'On-demand + background', appleU3: 'On-demand + background', fitbit: 'Overnight' },
      { key: 'resp', name: 'Respiratory Rate', sensor: 'PPG + Accel', garmin: 'Sleep', whoop: '24/7', oura: 'Sleep', appleS10: 'Sleep', appleU3: 'Sleep', fitbit: 'Sleep' },
      { key: 'skin_temp', name: 'Skin Temp Trends', sensor: 'Temp sensor', garmin: 'Deviation', whoop: 'Deviation', oura: 'Deviation', appleS10: 'Sleep only', appleU3: 'Sleep only', fitbit: 'Variation' },
      { key: 'apnea', name: 'Sleep Apnea', sensor: 'Accelerometer', garmin: null, whoop: null, oura: null, appleS10: 'FDA-authorized', appleU3: 'FDA-authorized', fitbit: null },
      { key: 'hypertension', name: 'Hypertension Alerts', sensor: 'PPG (pulse wave)', garmin: null, whoop: null, oura: null, appleS10: null, appleU3: '30-day trend alerts', fitbit: null, appleS10Note: 'Series 11 only' },
      { key: 'stress_direct', name: 'Stress (Direct)', sensor: 'EDA sensor', garmin: null, whoop: null, oura: null, appleS10: null, appleU3: null, fitbit: 'EDA + HRV combined' },
      { key: 'stress_derived', name: 'Stress (HRV-derived)', sensor: 'PPG → HRV', garmin: 'Stress Score', whoop: 'Stress metric', oura: 'Daytime Stress', appleS10: null, appleU3: null, fitbit: 'Also uses HRV' },
      { key: 'elevation', name: 'Elevation / Floors', sensor: 'Barometric altimeter', garmin: 'Yes', whoop: null, oura: null, appleS10: 'Yes', appleU3: 'Yes', fitbit: null },
      { key: 'fall', name: 'Fall / Crash Detection', sensor: 'Accel + Gyro', garmin: 'Yes', whoop: null, oura: null, appleS10: 'Yes', appleU3: 'Yes', fitbit: null },
      { key: 'dive', name: 'Dive Depth', sensor: 'Depth gauge', garmin: null, whoop: null, oura: null, appleS10: 'Up to 6m', appleU3: 'Up to 40m', fitbit: null },
      { key: 'cycle', name: 'Cycle / Menstrual', sensor: 'Temp + PPG', garmin: 'Temp-based', whoop: 'Temp + HRV', oura: 'Temp-based', appleS10: 'Wrist temp', appleU3: 'Wrist temp', fitbit: 'Basic tracking' },
      { key: 'hearing', name: 'Hearing Health', sensor: 'Microphone', garmin: null, whoop: null, oura: null, appleS10: 'Noise exposure alerts', appleU3: 'Noise exposure alerts', fitbit: null },
      { key: 'water_temp', name: 'Water Temperature', sensor: 'Depth/temp gauge', garmin: null, whoop: null, oura: null, appleS10: 'In swim workouts', appleU3: 'In swim workouts', fitbit: null }
    ];
  }

  // ── Software Algorithms ────────────────────────────────────────────────

  get _algorithms() {
    return [
      { key: 'body_battery', name: 'Body Battery', brand: 'Garmin', brandKey: 'garmin', inputs: 'HRV + stress + sleep + activity', what: '0–100 energy score. Charges during rest, drains with activity/stress. Real-time updates.', diff: 'Only score showing live energy drain throughout the day. Built with Firstbeat Analytics.' },
      { key: 'training_readiness', name: 'Training Readiness', brand: 'Garmin', brandKey: 'garmin', inputs: 'HRV + sleep + recovery + multi-day load', what: 'Tells you if your body can handle a hard workout today.', diff: 'Factors in training load across multiple days — not just last night\'s sleep.' },
      { key: 'hrv_status', name: 'HRV Status', brand: 'Garmin', brandKey: 'garmin', inputs: 'Overnight HRV over weeks', what: 'Shows your HRV baseline trend: balanced, low, or improving.', diff: 'Long-term trend view rather than a single nightly number.' },
      { key: 'health_status', name: 'Health Status', brand: 'Garmin', brandKey: 'garmin', inputs: 'HR + HRV + sleep + SpO2 + resp rate', what: 'Integrates 5 key health metrics into one view.', diff: 'New to Venu 4. Quick daily health check-in.' },
      { key: 'garmin_sleep_coach', name: 'Sleep Coach', brand: 'Garmin', brandKey: 'garmin', inputs: 'Sleep data + circadian rhythm', what: 'Personalized sleep schedule suggestions with consistency scores.', diff: 'Tracks sleep regularity and circadian alignment.' },
      { key: 'habit_logging', name: 'Lifestyle Habit Logging', brand: 'Garmin', brandKey: 'garmin', inputs: 'User-logged behaviors (40+)', what: 'Log daily habits and see how they correlate with Body Battery, sleep, and stress.', diff: 'Similar to Whoop Journal but with 40+ trackable habits.' },
      { key: 'recovery', name: 'Recovery Score', brand: 'Whoop', brandKey: 'whoop', inputs: 'HRV + RHR + resp rate + sleep', what: '0–100% morning score. Green / yellow / red.', diff: 'Core feature. Tuned for strain-to-recovery balance.' },
      { key: 'strain', name: 'Strain Score', brand: 'Whoop', brandKey: 'whoop', inputs: 'HR during activity', what: '0–21 scale of cardiovascular load.', diff: 'Measures daily cardiovascular load paired with Recovery.' },
      { key: 'whoop_vo2', name: 'VO2 Max', brand: 'Whoop', brandKey: 'whoop', inputs: 'HR + activity data', what: 'Estimates cardiovascular fitness from heart rate and exercise.', diff: 'Added in 2025. Linked to Healthspan as a longevity indicator.' },
      { key: 'healthspan', name: 'Healthspan / Whoop Age', brand: 'Whoop', brandKey: 'whoop', inputs: '9 metrics including HRV, RHR, sleep, temp', what: 'Estimates biological age and "Pace of Aging."', diff: 'Only device with a longevity metric. Built with Buck Institute.' },
      { key: 'hormonal', name: 'Hormonal Insights', brand: 'Whoop', brandKey: 'whoop', inputs: 'Temp + HRV + sleep + cycle data', what: 'Shows how menstrual cycle phases affect recovery and sleep.', diff: 'Correlates hormonal phases with performance data.' },
      { key: 'journal', name: 'Journal', brand: 'Whoop', brandKey: 'whoop', inputs: 'User-logged behaviors (160+)', what: 'Tracks daily habits and correlates them with recovery/sleep.', diff: 'Most extensive behavior tracking — 160+ habits.' },
      { key: 'whoop_sleep_coach', name: 'Sleep Coach / Planner', brand: 'Whoop', brandKey: 'whoop', inputs: 'Sleep data + circadian rhythm', what: 'Recommends optimal bedtime. Haptic alarm at ideal wake time.', diff: 'Personalized sleep scheduling with vibration-based wake-up.' },
      { key: 'whoop_ai', name: 'Whoop Coach (AI)', brand: 'Whoop', brandKey: 'whoop', inputs: 'All biometric data', what: 'AI assistant answering natural-language health questions.', diff: 'Only device with a conversational AI coach (powered by OpenAI).' },
      { key: 'readiness', name: 'Readiness Score', brand: 'Oura', brandKey: 'oura', inputs: 'Temp + HRV + RHR + sleep + activity', what: 'Daily score: how prepared your body is.', diff: 'Benefits from finger-based signal. Leans on temp deviations.' },
      { key: 'cardio_age', name: 'Cardiovascular Age', brand: 'Oura', brandKey: 'oura', inputs: 'RHR + HRV + VO2 Max + age', what: 'Estimates your heart\'s biological age.', diff: 'Paired with Cardio Capacity. Oura-only metric.' },
      { key: 'oura_vo2', name: 'Cardio Capacity (VO2 Max)', brand: 'Oura', brandKey: 'oura', inputs: 'Accel + PPG during walking test', what: 'Estimates VO2 Max from a guided walking test.', diff: 'Requires manual walking test to calibrate.' },
      { key: 'resilience', name: 'Resilience', brand: 'Oura', brandKey: 'oura', inputs: 'HRV + sleep + activity + stress', what: 'Long-term score of stress-recovery patterns.', diff: 'Tracks recovery patterns over weeks/months. Oura Labs.' },
      { key: 'apple_sleep', name: 'Sleep Score', brand: 'Apple', brandKey: 'appleS10', inputs: 'Accel + PPG + temp', what: 'Rates overall sleep quality.', diff: 'Newer feature — less mature than Oura or Whoop sleep algorithms.' },
      { key: 'vitals', name: 'Vitals App', brand: 'Apple', brandKey: 'appleS10', inputs: 'HR + resp rate + temp + SpO2 + sleep', what: 'Dashboard of overnight health metrics with alerts.', diff: 'Consolidates multiple sensors into one daily health view.' },
      { key: 'apple_vo2', name: 'Cardio Fitness (VO2 Max)', brand: 'Apple', brandKey: 'appleS10', inputs: 'GPS + accel + PPG', what: 'Estimates VO2 Max from outdoor walks/runs.', diff: 'Passive — calculates automatically. Requires GPS.' },
      { key: 'hearing_health', name: 'Hearing Health', brand: 'Apple', brandKey: 'appleS10', inputs: 'Microphone', what: 'Monitors noise levels. Alerts when exposure could damage hearing.', diff: 'Only wearable with hearing protection alerts.' },
      { key: 'fitbit_readiness', name: 'Daily Readiness', brand: 'Fitbit', brandKey: 'fitbit', inputs: 'HRV + RHR + sleep + activity', what: '1–100 score: push hard or rest.', diff: 'Requires Fitbit Premium ($9.99/mo) for full insights.' },
      { key: 'stress_mgmt', name: 'Stress Management Score', brand: 'Fitbit', brandKey: 'fitbit', inputs: 'EDA + HRV + RHR + sleep + activity', what: '1–100 from 3 sub-scores: Responsiveness (30), Exertion Balance (40), Sleep Patterns (30).', diff: 'Only score using hardware stress sensor (EDA) alongside HRV.' },
      { key: 'active_zone', name: 'Active Zone Minutes', brand: 'Fitbit', brandKey: 'fitbit', inputs: 'PPG (HR zones)', what: 'Double credit for time in cardio/peak HR zones.', diff: 'Simpler alternative to Whoop Strain or Garmin Training Load.' }
    ];
  }

  // ── Hardware Insights ──────────────────────────────────────────────────

  get _insights() {
    return [
      { title: 'Heart Rate & HRV', icon: 'heart', text: 'Oura\'s 18-path PPG on the finger reads through thinner skin with less motion noise — 31% fewer nighttime gaps vs Gen 3. Whoop counters with 26 Hz sampling (fastest here) for better exercise tracking. Garmin\'s Elevate Gen 5 added red + IR LEDs alongside green for better accuracy across skin tones.' },
      { title: 'SpO2 (Blood Oxygen)', icon: 'wind', text: 'All six use red + IR light, but Oura\'s finger placement and 18-path design gets 120% better signal quality than Gen 3. Whoop runs continuous overnight SpO2. Everyone else does periodic or on-demand checks.' },
      { title: 'Sleep Apnea', icon: 'moon', text: 'Only Apple Watch (S10, Ultra 3). Uses the accelerometer, not SpO2 — detects tiny wrist movements from interrupted breathing. Needs 30 nights of data. 89% accurate for severe apnea, 43% for moderate. FDA-authorized.' },
      { title: 'Stress Measurement', icon: 'battery', text: 'Fitbit is the only device with a dedicated stress sensor (EDA) that reads sweat gland activity via skin conductance — a direct nervous system signal. Requires 90-sec manual scan. Garmin, Whoop, and Oura estimate stress from HRV (indirect). Apple has no stress feature.' },
      { title: 'Hypertension', icon: 'gauge', text: 'Only Apple Watch Ultra 3. Analyzes how blood vessels respond to heartbeats via PPG. Does NOT give BP numbers — flags 30-day trends. Algorithm trained on 100,000+ participants.' },
      { title: 'Fall Detection', icon: 'shield', text: 'Garmin and both Apple Watches use accelerometer + gyroscope — the gyro adds rotational data to tell real falls from arm drops. Whoop and Oura lack gyroscopes so can\'t do this.' }
    ];
  }

  // ── Brand Focus Scores ─────────────────────────────────────────────────

  get _brandFocus() {
    return {
      labels: ['Recovery', 'Training', 'Sleep', 'Stress', 'Longevity', 'Medical'],
      garmin: [9, 10, 7, 7, 0, 5],
      whoop: [10, 8, 9, 7, 10, 0],
      oura: [8, 4, 10, 7, 0, 0],
      apple: [2, 6, 7, 0, 0, 10],
      fitbit: [6, 5, 6, 9, 0, 4]
    };
  }

  // ── Sources ────────────────────────────────────────────────────────────

  get _sources() {
    return {
      garmin: [
        { label: 'Garmin Newsroom — Venu 4 Announcement', url: 'https://www.garmin.com/en-US/newsroom/press-release/sports-fitness/take-steps-towards-a-healthier-lifestyle-with-the-venu-4-from-garmin/' },
        { label: 'DC Rainmaker — Venu 4 Hands-On', url: 'https://www.dcrainmaker.com/2025/09/garmin-venu-4-hands-on-everything.html' },
        { label: 'The5kRunner — Elevate Gen 5 Sensor Details', url: 'https://the5krunner.com/2023/05/13/new-garmin-elevate-gen-5/' },
        { label: 'Garmin Wiki — Venu 4 Full Specs', url: 'https://wiki.garminrumors.com/Venu_4' }
      ],
      whoop: [
        { label: 'Whoop Press Release — Whoop 5.0 and MG', url: 'https://www.whoop.com/us/en/press-center/whoop-unveils-5.0-MG/' },
        { label: 'Whoop Blog — Everything Launched in 2025', url: 'https://www.whoop.com/us/en/thelocker/everything-whoop-launched-in-2025/' },
        { label: 'Whoop — AI Coach (OpenAI)', url: 'https://www.whoop.com/eu/en/press-center/whoop-unveils-the-new-whoop-coach-powered-by-openai/' },
        { label: 'The5kRunner — Whoop 4.0 vs 5.0 Architecture', url: 'https://the5krunner.com/2025/06/16/whoop-4-0-vs-whoop-5-0-sensor-architecture-changes-detailed-technical-content/' }
      ],
      oura: [
        { label: 'Oura Support — Ring 4 Specs', url: 'https://support.ouraring.com/hc/en-us/articles/33045011508115-Oura-Ring-4' },
        { label: 'Oura Blog — Technology in Ring 4', url: 'https://ouraring.com/blog/technology-in-oura-ring-4/' },
        { label: 'Oura Blog — Smart Sensing (18-path)', url: 'https://ouraring.com/blog/smart-sensing/' },
        { label: 'DC Rainmaker — Oura 4 What\'s Changed', url: 'https://www.dcrainmaker.com/2024/10/oura-announces-oura-4-heres-whats-actually-changed.html' }
      ],
      apple: [
        { label: 'Apple Newsroom — Apple Watch Ultra 3', url: 'https://www.apple.com/newsroom/2025/09/introducing-apple-watch-ultra-3/' },
        { label: 'Apple Support — Sleep Apnea Notifications', url: 'https://support.apple.com/en-us/120031' },
        { label: '9to5Mac — Accelerometer-Based Sleep Apnea', url: 'https://9to5mac.com/2024/09/16/apple-details-how-apple-watch-accelerometer-based-sleep-apnea-feature-works/' },
        { label: 'Apple Newsroom — Blood Oxygen Update (Aug 2025)', url: 'https://www.apple.com/newsroom/2025/08/an-update-on-blood-oxygen-for-apple-watch-in-the-us/' },
        { label: 'Cardiovascular Business — Ultra 3 Hypertension', url: 'https://cardiovascularbusiness.com/topics/clinical/hypertension/new-apple-watch-ultra-3-makes-early-hypertension-detection-priority' }
      ],
      fitbit: [
        { label: 'Google Blog — Introducing Charge 6', url: 'https://blog.google/products/fitbit/fitness-tracker-charge-6/' },
        { label: 'DC Rainmaker — Charge 6 In-Depth Review', url: 'https://www.dcrainmaker.com/2023/10/fitbit-charge-depth-review.html' },
        { label: 'Fitbit Support — ECG App', url: 'https://support.google.com/fitbit/answer/14236718' },
        { label: 'Fitbit — Stress Management Technology', url: 'https://www.fitbit.com/global/us/technology/stress' }
      ]
    };
  }

  // ── Chart Rendering (Vanilla Canvas) ─────────────────────────────────

  _renderChartsSection() {
    return `
      <div class="charts-grid">
        <div class="chart-card animate-on-scroll" style="--delay:0ms">
          <h3>Sensor Count by Device</h3>
          <canvas id="sensorCountChart" width="480" height="260"></canvas>
        </div>
        <div class="chart-card animate-on-scroll" style="--delay:80ms">
          <h3>Brand Focus Areas</h3>
          <canvas id="brandRadarChart" width="480" height="320"></canvas>
        </div>
        <div class="chart-card animate-on-scroll" style="--delay:160ms">
          <h3>Proprietary Algorithms</h3>
          <canvas id="algoCountChart" width="480" height="260"></canvas>
        </div>
        <div class="chart-card animate-on-scroll" style="--delay:240ms">
          <h3>FDA-Cleared Features</h3>
          <canvas id="fdaChart" width="480" height="260"></canvas>
        </div>
      </div>`;
  }

  _drawCharts() {
    requestAnimationFrame(() => {
      setTimeout(() => {
        this._drawAllCharts();
      }, 300);
    });
    // Redraw on resize (debounced)
    if (!this._resizeHandler) {
      let resizeTimer;
      this._resizeHandler = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => this._drawAllCharts(), 200);
      };
      window.addEventListener('resize', this._resizeHandler);
    }
  }

  _drawAllCharts() {
    this._drawSensorCountChart();
    this._drawAlgoCountChart();
    this._drawFdaChart();
    this._drawBrandRadarChart();
  }

  _drawSensorCountChart() {
    const canvas = this.shadowRoot.getElementById('sensorCountChart');
    if (!canvas || !canvas.offsetWidth) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth, h = canvas.offsetHeight;

    const data = [
      { label: 'Ultra 3', value: 11, color: '#a855f7' },
      { label: 'Garmin', value: 10, color: '#f59e0b' },
      { label: 'Apple S10', value: 10, color: '#6b7280' },
      { label: 'Fitbit', value: 7, color: '#10b981' },
      { label: 'Whoop', value: 4, color: '#3b82f6' },
      { label: 'Oura', value: 4, color: '#C4A97D' }
    ];

    const isMobile = w < 380;
    const maxVal = 12;
    const barWidth = Math.min(48, (w - 80) / data.length - (isMobile ? 6 : 12));
    const chartLeft = 32;
    const chartBottom = isMobile ? h - 56 : h - 36;
    const chartTop = 16;
    const chartHeight = chartBottom - chartTop;
    const gap = (w - chartLeft - 12) / data.length;

    // Grid lines
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 0.5;
    ctx.font = `${isMobile ? 10 : 11}px DM Sans, sans-serif`;
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = Math.round(maxVal / 4 * i);
      const y = chartBottom - (val / maxVal) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(chartLeft, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();
      ctx.fillText(val.toString(), chartLeft - 6, y + 4);
    }

    // Bars
    data.forEach((d, i) => {
      const x = chartLeft + gap * i + (gap - barWidth) / 2;
      const barH = (d.value / maxVal) * chartHeight;
      const y = chartBottom - barH;

      // Bar with rounded top
      ctx.fillStyle = d.color;
      ctx.beginPath();
      const r = Math.min(6, barWidth / 2);
      ctx.moveTo(x, chartBottom);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x + barWidth - r, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
      ctx.lineTo(x + barWidth, chartBottom);
      ctx.closePath();
      ctx.fill();

      // Value on bar
      ctx.fillStyle = '#1E293B';
      ctx.font = `bold ${isMobile ? 11 : 13}px Space Grotesk, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(d.value.toString(), x + barWidth / 2, y - 5);

      // Label — rotate on mobile to prevent overlap
      ctx.fillStyle = '#475569';
      ctx.font = `${isMobile ? 10 : 11}px DM Sans, sans-serif`;
      if (isMobile) {
        ctx.save();
        ctx.translate(x + barWidth / 2, chartBottom + 8);
        ctx.rotate(-Math.PI / 4);
        ctx.textAlign = 'right';
        ctx.fillText(d.label, 0, 0);
        ctx.restore();
      } else {
        ctx.textAlign = 'center';
        ctx.fillText(d.label, x + barWidth / 2, chartBottom + 16);
      }
    });
  }

  _drawAlgoCountChart() {
    const canvas = this.shadowRoot.getElementById('algoCountChart');
    if (!canvas || !canvas.offsetWidth) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth, h = canvas.offsetHeight;

    const data = [
      { label: 'Whoop', value: 8, color: '#3b82f6' },
      { label: 'Garmin', value: 6, color: '#f59e0b' },
      { label: 'Oura', value: 4, color: '#C4A97D' },
      { label: 'Apple', value: 4, color: '#a855f7' },
      { label: 'Fitbit', value: 3, color: '#10b981' }
    ];
    const total = data.reduce((s, d) => s + d.value, 0);
    const cx = w * 0.35, cy = h / 2;
    const outerR = Math.min(cx - 20, cy - 20);
    const innerR = outerR * 0.55;

    let angle = -Math.PI / 2;
    data.forEach(d => {
      const slice = (d.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, angle, angle + slice);
      ctx.arc(cx, cy, innerR, angle + slice, angle, true);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      angle += slice;
    });

    // Center text
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 22px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(total.toString(), cx, cy + 2);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px DM Sans, sans-serif';
    ctx.fillText('Total', cx, cy + 16);

    // Legend
    const legendX = w * 0.65;
    let legendY = cy - (data.length * 24) / 2;
    data.forEach(d => {
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(legendX, legendY + 6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1E293B';
      ctx.font = '13px DM Sans, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${d.label} (${d.value})`, legendX + 14, legendY + 10);
      legendY += 28;
    });
  }

  _drawFdaChart() {
    const canvas = this.shadowRoot.getElementById('fdaChart');
    if (!canvas || !canvas.offsetWidth) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth, h = canvas.offsetHeight;

    const data = [
      { label: 'Apple Ultra 3', value: 3, color: '#a855f7', detail: 'ECG, Apnea, Hypertension' },
      { label: 'Apple S10', value: 2, color: '#6b7280', detail: 'ECG, Apnea' },
      { label: 'Garmin', value: 1, color: '#f59e0b', detail: 'ECG/AFib' },
      { label: 'Fitbit', value: 1, color: '#10b981', detail: 'ECG/AFib' },
      { label: 'Whoop', value: 0, color: '#3b82f6', detail: 'None' },
      { label: 'Oura', value: 0, color: '#C4A97D', detail: 'None' }
    ];

    const isMobile = w < 380;
    const maxVal = 3;
    const barH = isMobile ? 20 : 22;
    const gap = isMobile ? 6 : 8;
    const labelFontSize = isMobile ? 10 : 12;
    const chartLeft = isMobile ? 70 : 90;
    const chartRight = w - 10;
    const maxBarWidth = (chartRight - chartLeft) * (isMobile ? 0.35 : 0.4);
    const startY = 16;

    data.forEach((d, i) => {
      const y = startY + i * (barH + gap);

      // Label
      ctx.fillStyle = '#475569';
      ctx.font = `${labelFontSize}px DM Sans, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(d.label, chartLeft - 8, y + barH / 2);

      // Background bar
      ctx.fillStyle = '#F1F5F9';
      ctx.beginPath();
      const r = barH / 2;
      const bgWidth = chartRight - chartLeft;
      ctx.roundRect(chartLeft, y, bgWidth, barH, r);
      ctx.fill();

      // Value bar
      const barW = d.value > 0 ? Math.max((d.value / maxVal) * maxBarWidth, barH) : 0;
      if (barW > 0) {
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.roundRect(chartLeft, y, barW, barH, r);
        ctx.fill();

        // Count number inside bar
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${isMobile ? 10 : 11}px Space Grotesk, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(d.value.toString(), chartLeft + barW / 2, y + barH / 2 + 1);
      }

      // Detail text after bar
      ctx.fillStyle = d.value > 0 ? '#1E293B' : '#94A3B8';
      ctx.font = `${isMobile ? 10 : 11}px DM Sans, sans-serif`;
      ctx.textAlign = 'left';
      const textX = d.value > 0 ? chartLeft + barW + 8 : chartLeft + 12;
      ctx.fillText(d.detail, textX, y + barH / 2 + 1);
    });
  }

  _drawBrandRadarChart() {
    const canvas = this.shadowRoot.getElementById('brandRadarChart');
    if (!canvas || !canvas.offsetWidth) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth, h = canvas.offsetHeight;

    const bf = this._brandFocus;
    const labels = bf.labels;
    const n = labels.length;
    const isMobile = w < 420;
    const cx = isMobile ? w * 0.38 : w * 0.45, cy = h * 0.48;
    const maxR = Math.min(cx - (isMobile ? 36 : 50), cy - 30);
    const maxVal = 10;

    // Grid
    const angleStep = (Math.PI * 2) / n;
    const startAngle = -Math.PI / 2;

    for (let ring = 1; ring <= 4; ring++) {
      const r = (ring / 4) * maxR;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const a = startAngle + i * angleStep;
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    // Axis lines + labels
    const labelFont = isMobile ? 10 : 11;
    ctx.font = `${labelFont}px DM Sans, sans-serif`;
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'center';
    for (let i = 0; i < n; i++) {
      const a = startAngle + i * angleStep;
      const x1 = cx + Math.cos(a) * maxR;
      const y1 = cy + Math.sin(a) * maxR;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      const lx = cx + Math.cos(a) * (maxR + (isMobile ? 14 : 16));
      const ly = cy + Math.sin(a) * (maxR + (isMobile ? 14 : 16));
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], lx, ly);
    }

    // Brand data
    const brands = [
      { key: 'garmin', label: 'Garmin', color: '#f59e0b', data: bf.garmin },
      { key: 'whoop', label: 'Whoop', color: '#3b82f6', data: bf.whoop },
      { key: 'oura', label: 'Oura', color: '#C4A97D', data: bf.oura },
      { key: 'apple', label: 'Apple', color: '#a855f7', data: bf.apple },
      { key: 'fitbit', label: 'Fitbit', color: '#10b981', data: bf.fitbit }
    ];

    // Filter to only visible brands (if toggled)
    const visibleBrands = this._radarVisibleBrands || null;
    const filteredBrands = visibleBrands ? brands.filter(b => visibleBrands.includes(b.key)) : brands;

    filteredBrands.forEach(brand => {
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const idx = i % n;
        const a = startAngle + idx * angleStep;
        const r = (brand.data[idx] / maxVal) * maxR;
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = brand.color + '18';
      ctx.fill();
      ctx.strokeStyle = brand.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Show values on data points when filtered
      if (visibleBrands && visibleBrands.length <= 2) {
        for (let i = 0; i < n; i++) {
          const a = startAngle + i * angleStep;
          const r = (brand.data[i] / maxVal) * maxR;
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;
          if (brand.data[i] > 0) {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(px, py, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = brand.color;
            ctx.beginPath();
            ctx.arc(px, py, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 9px Space Grotesk, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(brand.data[i].toString(), px, py);
          }
        }
      }
    });

    // Legend (clickable)
    const legendX = isMobile ? w * 0.78 : w * 0.82;
    let legendY = cy - (brands.length * 22) / 2;
    // Store legend hit areas for click handling
    this._radarLegendAreas = [];
    brands.forEach(b => {
      const isActive = !visibleBrands || visibleBrands.includes(b.key);
      const alpha = isActive ? 1 : 0.3;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(legendX, legendY + 5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1E293B';
      ctx.font = `${isMobile ? 10 : 11}px DM Sans, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.label, legendX + 14, legendY + 5);
      ctx.globalAlpha = 1;
      // Store hit area
      this._radarLegendAreas.push({ key: b.key, x: legendX - 8, y: legendY - 8, w: 80, h: 22 });
      legendY += 24;
    });

    // Setup click handler once
    if (!this._radarClickBound) {
      this._radarClickBound = true;
      canvas.style.cursor = 'pointer';
      canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.offsetWidth / rect.width;
        const scaleY = canvas.offsetHeight / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;
        if (!this._radarLegendAreas) return;
        for (const area of this._radarLegendAreas) {
          if (mx >= area.x && mx <= area.x + area.w && my >= area.y && my <= area.y + area.h) {
            if (!this._radarVisibleBrands) {
              this._radarVisibleBrands = [area.key];
            } else if (this._radarVisibleBrands.includes(area.key)) {
              this._radarVisibleBrands = this._radarVisibleBrands.filter(k => k !== area.key);
              if (this._radarVisibleBrands.length === 0) this._radarVisibleBrands = null;
            } else {
              this._radarVisibleBrands.push(area.key);
            }
            this._drawBrandRadarChart();
            return;
          }
        }
        // Click outside legend resets
        this._radarVisibleBrands = null;
        this._drawBrandRadarChart();
      });
    }
  }

  // ── Icons ──────────────────────────────────────────────────────────────

  _icon(name) {
    const icons = {
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
      chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
      wind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      battery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg>',
      gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m14.31 8 1.414 1.414-4.95 4.95-1.414-1.414z"/></svg>',
      shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
      code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
    };
    return icons[name] || icons.heart;
  }

  // ── Render: Device Stats Bar ───────────────────────────────────────────

  _renderDeviceStatsBar() {
    const devices = this._devices;
    const keys = ['garmin', 'whoop', 'oura', 'appleU3', 'fitbit'];
    return keys.map(dk => {
      const d = devices[dk];
      return `<div class="stat-card" style="--accent:${d.color}">
        <img src="${d.imageUrl}" alt="${d.name}" class="stat-img" loading="lazy" onerror="this.style.display='none'" />
        <div class="stat-info">
          <span class="stat-name">${d.short}</span>
          <span class="stat-count">${d.sensorCount} sensors</span>
        </div>
      </div>`;
    }).join('');
  }

  // ── Render: Main Tabs ──────────────────────────────────────────────────

  _renderMainTabs() {
    const tabs = [
      { key: 'hardware', label: 'Sensor Hardware', icon: 'cpu' },
      { key: 'metrics', label: 'Health Metrics', icon: 'activity' },
      { key: 'algorithms', label: 'Software Algorithms', icon: 'code' }
    ];
    return tabs.map(t =>
      `<button class="main-tab ${t.key === this._activeTab ? 'active' : ''}" data-tab="${t.key}" role="tab" aria-selected="${t.key === this._activeTab}">
        <span class="tab-icon">${this._icon(t.icon)}</span>
        <span>${t.label}</span>
      </button>`
    ).join('');
  }

  // ── Render: Sensor Hardware Table ──────────────────────────────────────

  _renderSensorTable() {
    const deviceKeys = ['garmin', 'whoop', 'oura', 'appleS10', 'appleU3', 'fitbit'];
    const devices = this._devices;
    return `
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th class="col-label">Sensor</th>
              ${deviceKeys.map(dk => `<th class="col-device"><span class="th-name" style="color:${devices[dk].color}">${devices[dk].short}</span></th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${this._sensors.map(s => `
              <tr>
                <td class="cell-label">${s.name}</td>
                ${deviceKeys.map(dk => {
                  const val = s[dk];
                  const note = s[dk + 'Note'];
                  if (val) return `<td class="cell-yes"><span class="cell-check-icon">${this._icon('check')}</span><span class="cell-detail">${val}</span></td>`;
                  if (note) return `<td class="cell-no"><span class="cell-dash-icon">${this._icon('minus')}</span><span class="cell-note">${note}</span></td>`;
                  return `<td class="cell-no"><span class="cell-dash-icon">${this._icon('minus')}</span></td>`;
                }).join('')}
              </tr>
            `).join('')}
            <tr class="amazon-row">
              <td class="cell-label"></td>
              ${deviceKeys.map(dk => `<td><a href="${devices[dk].affiliateUrl}" class="amazon-link" target="_blank" rel="noopener sponsored">View on Amazon <span class="amazon-arrow">${this._icon('arrowRight')}</span></a></td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
      <div class="spo2-note">
        <strong>Apple Watch SpO2 in the US:</strong> Blood oxygen was disabled Jan 2024 (Masimo patent). Re-enabled Aug 2025 via iPhone-processed workaround. Masimo is contesting. Works normally outside the US.
      </div>`;
  }

  // ── Render: Health Metrics Table ───────────────────────────────────────

  _renderMetricsTable() {
    const deviceKeys = ['garmin', 'whoop', 'oura', 'appleS10', 'appleU3', 'fitbit'];
    const devices = this._devices;
    return `
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th class="col-label">Metric</th>
              <th class="col-sensor">Sensor</th>
              ${deviceKeys.map(dk => `<th class="col-device"><span class="th-name" style="color:${devices[dk].color}">${devices[dk].short}</span></th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${this._healthMetrics.map(m => `
              <tr>
                <td class="cell-label">${m.name}</td>
                <td class="cell-sensor">${m.sensor}</td>
                ${deviceKeys.map(dk => {
                  const val = m[dk];
                  const note = m[dk + 'Note'];
                  if (val) return `<td class="cell-yes"><span class="cell-check-icon">${this._icon('check')}</span><span class="cell-detail">${val}</span></td>`;
                  if (note) return `<td class="cell-no"><span class="cell-dash-icon">${this._icon('minus')}</span><span class="cell-note">${note}</span></td>`;
                  return `<td class="cell-no"><span class="cell-dash-icon">${this._icon('minus')}</span></td>`;
                }).join('')}
              </tr>
            `).join('')}
            <tr class="amazon-row">
              <td class="cell-label"></td>
              <td></td>
              ${deviceKeys.map(dk => `<td><a href="${devices[dk].affiliateUrl}" class="amazon-link" target="_blank" rel="noopener sponsored">View on Amazon <span class="amazon-arrow">${this._icon('arrowRight')}</span></a></td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>`;
  }

  // ── Render: Algorithm Cards ────────────────────────────────────────────

  _renderAlgorithmCards() {
    const brands = ['garmin', 'whoop', 'oura', 'appleS10', 'fitbit'];
    const brandNames = { garmin: 'Garmin', whoop: 'Whoop', oura: 'Oura', appleS10: 'Apple', fitbit: 'Fitbit' };
    const brandColors = { garmin: '#f59e0b', whoop: '#3b82f6', oura: '#C4A97D', appleS10: '#a855f7', fitbit: '#10b981' };

    return brands.map((bk, i) => {
      const algos = this._algorithms.filter(a => a.brandKey === bk);
      const isExpanded = this._expandedAlgo === bk;
      return `
        <div class="algo-card ${isExpanded ? 'expanded' : ''}" data-algo="${bk}" style="--delay:${i * 80}ms; --accent:${brandColors[bk]}">
          <div class="algo-header" role="button" tabindex="0" aria-expanded="${isExpanded}">
            <div class="algo-brand">
              <span class="algo-dot" style="background:${brandColors[bk]}"></span>
              <h3>${brandNames[bk]}</h3>
              <span class="algo-count">${algos.length} algorithms</span>
            </div>
            <div class="algo-toggle">${this._icon('chevDown')}</div>
          </div>
          <div class="algo-body">
            ${algos.map(a => `
              <div class="algo-item">
                <div class="algo-name">${a.name}</div>
                <div class="algo-inputs"><strong>Inputs:</strong> ${a.inputs}</div>
                <div class="algo-what">${a.what}</div>
                <div class="algo-diff">${a.diff}</div>
              </div>
            `).join('')}
          </div>
        </div>`;
    }).join('');
  }

  // ── Render: Insight Cards ──────────────────────────────────────────────

  _renderInsights() {
    return this._insights.map((ins, i) => `
      <div class="insight-card animate-on-scroll" style="--delay:${i * 80}ms">
        <div class="insight-icon">${this._icon(ins.icon)}</div>
        <h3>${ins.title}</h3>
        <p>${ins.text}</p>
      </div>
    `).join('');
  }

  // ── Render: Sources ────────────────────────────────────────────────────

  _renderSources() {
    const sources = this._sources;
    const devices = this._devices;
    const affiliateMap = {
      garmin: devices.garmin.affiliateUrl,
      whoop: devices.whoop.affiliateUrl,
      oura: devices.oura.affiliateUrl,
      apple: devices.appleS10.affiliateUrl,
      fitbit: devices.fitbit.affiliateUrl
    };
    return Object.entries(sources).map(([bk, srcs], i) => {
      const isOpen = this._expandedSource === bk;
      const brandColor = bk === 'apple' ? '#a855f7' : (devices[bk] ? devices[bk].color : '#6b7280');
      const brandName = bk === 'apple' ? 'Apple Watch' : (devices[bk] ? devices[bk].name : bk);
      const affUrl = affiliateMap[bk];
      return `
        <div class="src-card ${isOpen ? 'open' : ''}" data-source="${bk}">
          <div class="src-header" role="button" tabindex="0" aria-expanded="${isOpen}">
            <span class="src-dot" style="background:${brandColor}"></span>
            <div class="src-brand-wrap">
              <span class="src-brand">${brandName}</span>
              ${affUrl ? `<a href="${affUrl}" class="src-amazon-link" target="_blank" rel="noopener sponsored">View on Amazon ${this._icon('arrowRight')}</a>` : ''}
            </div>
            <span class="src-count">${srcs.length} sources</span>
            <span class="src-toggle">${this._icon('chevDown')}</span>
          </div>
          <div class="src-body">
            <ul>${srcs.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label} ${this._icon('externalLink')}</a></li>`).join('')}</ul>
          </div>
        </div>`;
    }).join('');
  }

  // ── Render: FDA Summary ────────────────────────────────────────────────

  _renderFdaSummary() {
    const fda = [
      { device: 'Apple Watch Ultra 3', features: 'ECG/AFib, Sleep Apnea, Hypertension', count: 3, color: '#a855f7' },
      { device: 'Apple Watch S10', features: 'ECG/AFib, Sleep Apnea', count: 2, color: '#6b7280' },
      { device: 'Garmin Venu 4', features: 'ECG/AFib', count: 1, color: '#f59e0b' },
      { device: 'Fitbit Charge 6', features: 'ECG/AFib', count: 1, color: '#10b981' },
      { device: 'Whoop 5.0', features: 'None (MG has ECG)', count: 0, color: '#3b82f6' },
      { device: 'Oura Ring 4', features: 'None', count: 0, color: '#C4A97D' }
    ];
    return fda.map(f => `
      <div class="fda-row">
        <div class="fda-device"><span class="fda-dot" style="background:${f.color}"></span>${f.device}</div>
        <div class="fda-bar-wrap">
          <div class="fda-bar" style="width:${(f.count / 3) * 100}%; background:${f.color}"></div>
        </div>
        <div class="fda-features">${f.features}</div>
      </div>
    `).join('');
  }

  // ── Surgical Updates ───────────────────────────────────────────────────

  _updateTab() {
    const shadow = this.shadowRoot;
    const tabs = shadow.querySelector('.main-tabs');
    const content = shadow.querySelector('.tab-content');
    if (tabs) tabs.innerHTML = this._renderMainTabs();
    if (content) {
      if (this._activeTab === 'hardware') content.innerHTML = this._renderSensorTable();
      else if (this._activeTab === 'metrics') content.innerHTML = this._renderMetricsTable();
      else if (this._activeTab === 'algorithms') content.innerHTML = this._renderAlgorithmCards();
    }
  }

  // ── Main Render ────────────────────────────────────────────────────────

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <!-- Header -->
      <header class="header">
        <div class="header-inner">
          <a href="https://kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" loading="lazy" />
            Sensor Comparison
          </a>
          <a href="https://kygo.app" class="header-link" target="_blank" rel="noopener">
            Get Kygo App ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge animate-on-scroll">6 DEVICES — 16 SENSORS — 25 ALGORITHMS</div>
          <h1 class="animate-on-scroll">What's Actually Inside Your Wearable?</h1>
          <p class="hero-sub animate-on-scroll">We tore apart the specs of every major wearable — sensor by sensor, metric by metric. Here's exactly what hardware you're getting, what health data it produces, and which features are just software.</p>
        </div>
      </section>

      <!-- Device Stats -->
      <section class="stats-section">
        <div class="container">
          <div class="stats-bar animate-on-scroll">${this._renderDeviceStatsBar()}</div>
        </div>
      </section>

      <!-- Visual Charts -->
      <section class="charts-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">At a Glance</h2>
          <p class="section-sub animate-on-scroll">Visual breakdown of sensor counts, brand focus areas, proprietary algorithms, and FDA-cleared features across all 6 devices.</p>
          ${this._renderChartsSection()}
        </div>
      </section>

      <!-- Main Comparison Section -->
      <section class="compare-section" id="compare">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Device Comparison</h2>
          <p class="section-sub animate-on-scroll">Switch between hardware sensors, the health metrics they produce, and software-only features.</p>
          <div class="main-tabs animate-on-scroll" role="tablist">${this._renderMainTabs()}</div>
          <div class="tab-content animate-on-scroll">${this._renderSensorTable()}</div>
        </div>
      </section>

      <!-- Blog Cross-Link -->
      <section class="blog-link-section">
        <div class="container">
          <div class="blog-link-wrap animate-on-scroll">
            <a href="https://www.kygo.app/post/wearable-hardware-vs-software-differences-2025" class="blog-link-card" target="_blank" rel="noopener">
              <img src="https://static.wixstatic.com/media/273a63_d0b94a6b9cb54aff93a61cb4f2229b21~mv2.png" alt="Kygo" class="blog-link-logo" onerror="this.style.display='none'" />
              <div class="blog-link-text">
                <span class="blog-link-title">Read the Full Article</span>
                <span class="blog-link-desc">Wearable Hardware vs Software Differences (2025)</span>
              </div>
              <span class="blog-link-arrow">${this._icon('arrowRight')}</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Hardware Insights -->
      <section class="insights-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Why the Hardware Differences Matter</h2>
          <p class="section-sub animate-on-scroll">Same metric name doesn't mean the same measurement. Here's how hardware design affects what you actually get.</p>
          <div class="insights-grid">${this._renderInsights()}</div>
        </div>
      </section>

      <!-- FDA Summary -->
      <section class="fda-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">FDA-Cleared Medical Features</h2>
          <div class="fda-grid animate-on-scroll">${this._renderFdaSummary()}</div>
        </div>
      </section>

      <!-- Blog CTA -->
      <section class="blog-cta-section">
        <div class="container">
          <div class="blog-cta-wrapper animate-on-scroll">
            <div class="blog-cta">
              <div class="blog-cta-glow"></div>
              <div class="blog-cta-content">
                <div class="blog-cta-badge"><span class="pulse-dot"></span>Free Forever Plan</div>
                <h2>Your Wearable Tracks Everything — Except <span class="highlight">What You Eat</span></h2>
                <p>Kygo Health connects your nutrition to your biometrics so you can finally see the full picture.</p>
                <div class="blog-cta-buttons">
                  <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" class="blog-cta-btn" data-track-position="article-cta" target="_blank" rel="noopener">Download for iOS</a>
                  <a href="https://kygo.app/android" target="_blank" rel="noopener" class="blog-cta-android-btn" data-action="android-download" data-track-position="article-cta">Download for Android</a>
                </div>
                <div class="blog-cta-devices">
                  <span>Works with</span>
                  <img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura" loading="lazy" onerror="this.style.display='none'" />
                  <img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple" loading="lazy" onerror="this.style.display='none'" />
                  <img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit" loading="lazy" onerror="this.style.display='none'" />
                  <img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin" loading="lazy" onerror="this.style.display='none'" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sources -->
      <section class="sources-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Sources</h2>
          <p class="section-sub animate-on-scroll">All data from official manufacturer specs, support docs, and independent reviews. Verified March 2026.</p>
          <div class="sources-list animate-on-scroll">${this._renderSources()}</div>
        </div>
      </section>


      <!-- Footer -->
      <footer class="tool-footer">
        <div class="container">
          <a href="https://kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" loading="lazy" />
            Kygo Health
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
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Always consult a qualified healthcare provider before making health decisions based on wearable data.</p>
          <p class="footer-copyright">Data sourced from official manufacturer specs, support documentation, and independent reviews. Last updated March 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, I earn from qualifying purchases.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  // ── Styles ─────────────────────────────────────────────────────────────

  _styles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

      :host {
        --dark: #1E293B;
        --dark-card: #0F172A;
        --light: #F8FAFC;
        --green: #22C55E;
        --green-dark: #16A34A;
        --green-light: rgba(34,197,94,0.1);
        --yellow: #FBBF24;
        --red: #EF4444;
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
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
      a { text-decoration: none; }

      /* Animations */
      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: var(--delay, 0ms); }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      /* Header */
      .header { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid var(--gray-200); }
      .header-inner { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; max-width: 1200px; margin: 0 auto; gap: 10px; }
      .logo { display: flex; align-items: center; gap: 8px; color: var(--dark); font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; min-width: 0; }
      .logo-img { height: 28px; width: auto; flex-shrink: 0; }
      .header-link { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #fff; background: var(--green); padding: 8px 16px; border-radius: 50px; text-decoration: none; transition: background 0.2s; flex-shrink: 0; white-space: nowrap; }
      .header-link:hover { background: var(--green-dark); }
      .header-link svg { width: 14px; height: 14px; }

      /* Hero */
      .hero { padding: 60px 0 32px; text-align: center; }
      .hero-badge { display: inline-block; background: var(--green-light); color: var(--green-dark); font-size: 11px; font-weight: 600; letter-spacing: 1.5px; padding: 6px 16px; border-radius: 50px; margin-bottom: 16px; }
      .hero h1 { font-size: clamp(26px, 7vw, 40px); max-width: 700px; margin: 0 auto 16px; }
      .hero-sub { color: var(--gray-600); font-size: 16px; max-width: 600px; margin: 0 auto; }

      /* Stats Bar */
      .stats-section { padding: 0 0 32px; }
      .stats-bar { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
      .stats-bar::-webkit-scrollbar { display: none; }
      .stat-card { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius-sm); padding: 10px 16px; min-width: 160px; flex-shrink: 0; }
      .stat-img { width: 36px; height: 36px; object-fit: contain; }
      .stat-name { font-weight: 600; font-size: 13px; display: block; }
      .stat-count { font-size: 12px; color: var(--gray-400); }

      /* Main Tabs */
      .compare-section { padding: 48px 0; }
      .section-title { font-size: clamp(22px, 5vw, 32px); margin-bottom: 8px; }
      .section-sub { color: var(--gray-600); font-size: 15px; margin-bottom: 24px; }
      .main-tabs { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; margin-bottom: 20px; }
      .main-tabs::-webkit-scrollbar { display: none; }
      .main-tab { display: flex; align-items: center; gap: 6px; padding: 10px 18px; border: 2px solid var(--gray-200); border-radius: 50px; background: #fff; font-family: inherit; font-size: 14px; font-weight: 500; color: var(--gray-600); cursor: pointer; white-space: nowrap; transition: all 0.2s; }
      .main-tab:hover { border-color: var(--gray-300); }
      .main-tab.active { background: var(--green-light); color: var(--green-dark); border-color: var(--green); }
      .tab-icon { width: 16px; height: 16px; display: flex; }
      .tab-icon svg { width: 100%; height: 100%; }

      /* Data Table */
      .table-scroll { overflow-x: auto; border: 1px solid var(--gray-200); border-radius: var(--radius-sm); background: #fff; position: relative; -webkit-overflow-scrolling: touch; }
      .table-scroll::after { content: 'Swipe to see all devices →'; display: block; text-align: center; font-size: 12px; color: var(--gray-400); padding: 8px; }
      @media (min-width: 1024px) { .table-scroll::after { display: none; } }
      .data-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 13px; min-width: 900px; }
      .data-table th { background: var(--gray-50); padding: 12px 14px; text-align: left; font-weight: 600; font-size: 12px; color: var(--gray-600); border-bottom: 1px solid var(--gray-200); white-space: nowrap; position: sticky; top: 0; z-index: 2; }
      .data-table td { padding: 10px 14px; border-bottom: 1px solid var(--gray-100); vertical-align: middle; }
      .data-table tr:last-child td { border-bottom: none; }
      .data-table tr:hover td { background: rgba(34,197,94,0.03); }
      .data-table th:first-child, .data-table td:first-child { position: sticky; left: 0; z-index: 3; background: #fff; min-width: 140px; box-shadow: 2px 0 4px rgba(0,0,0,0.06); }
      .data-table th:first-child { background: var(--gray-50); z-index: 4; }
      .amazon-row td { border-top: 1px solid var(--gray-200); background: #fff !important; padding: 10px 14px; }
      .amazon-link { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 500; color: var(--gray-600); text-decoration: none; white-space: nowrap; transition: color 0.2s; }
      .amazon-link:hover { color: var(--dark); }
      .amazon-arrow { display: inline-flex; color: var(--green-dark); }
      .amazon-arrow svg { width: 14px; height: 14px; }
      .col-label { min-width: 170px; }
      .col-sensor { min-width: 120px; color: var(--gray-400); font-size: 12px; }
      .col-device { min-width: 110px; }
      .th-name { font-weight: 700; font-size: 12px; }
      .cell-label { font-weight: 600; }
      .cell-sensor { color: var(--gray-400); font-size: 12px; }
      .cell-yes { color: var(--dark); }
      .cell-no { color: var(--gray-300); }
      .cell-check-icon, .cell-dash-icon { display: inline-flex; width: 16px; height: 16px; vertical-align: middle; margin-right: 4px; }
      .cell-check-icon svg { color: var(--green); }
      .cell-dash-icon svg { color: var(--gray-300); }
      .cell-detail { font-size: 12px; color: var(--gray-600); }
      .cell-note { font-size: 11px; color: var(--gray-400); font-style: italic; }

      /* SpO2 Note */
      .spo2-note { background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.2); border-radius: var(--radius-sm); padding: 12px 16px; margin-top: 12px; font-size: 13px; color: var(--gray-600); }
      .spo2-note strong { color: var(--dark); }

      /* Charts */
      .charts-section { padding: 48px 0; background: #fff; }
      .charts-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
      .chart-card { background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-sm); padding: 20px; }
      .chart-card h3 { font-size: 15px; margin-bottom: 12px; color: var(--dark); }
      .chart-card canvas { width: 100%; height: auto; }

      /* Insights */
      .insights-section { padding: 64px 0; background: #fff; }
      .insights-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
      .insight-card { background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-sm); padding: 20px; }
      .insight-icon { width: 32px; height: 32px; color: var(--green); margin-bottom: 10px; }
      .insight-icon svg { width: 100%; height: 100%; }
      .insight-card h3 { font-size: 16px; margin-bottom: 8px; }
      .insight-card p { font-size: 14px; color: var(--gray-600); }

      /* FDA */
      .fda-section { padding: 48px 0; }
      .fda-grid { display: flex; flex-direction: column; gap: 10px; }
      .fda-row { display: grid; grid-template-columns: 180px 1fr 200px; align-items: center; gap: 12px; background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius-sm); padding: 12px 16px; font-size: 13px; }
      .fda-device { font-weight: 600; display: flex; align-items: center; gap: 8px; }
      .fda-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
      .fda-bar-wrap { height: 8px; background: var(--gray-100); border-radius: 4px; overflow: hidden; }
      .fda-bar { height: 100%; border-radius: 4px; transition: width 0.6s ease-out; }
      .fda-features { font-size: 12px; color: var(--gray-400); }

      /* Algorithm Cards */
      .algo-card { background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius-sm); margin-bottom: 8px; overflow: hidden; transition: box-shadow 0.2s; }
      .algo-card:hover { box-shadow: var(--shadow); }
      .algo-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; cursor: pointer; }
      .algo-brand { display: flex; align-items: center; gap: 10px; }
      .algo-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
      .algo-brand h3 { font-size: 15px; }
      .algo-count { font-size: 12px; color: var(--gray-400); background: var(--gray-100); padding: 2px 8px; border-radius: 50px; }
      .algo-toggle { width: 20px; height: 20px; color: var(--gray-400); transition: transform 0.3s; }
      .algo-toggle svg { width: 100%; height: 100%; }
      .algo-card.expanded .algo-toggle { transform: rotate(180deg); }
      .algo-body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.4s; padding: 0 18px; }
      .algo-card.expanded .algo-body { max-height: 1200px; padding: 0 18px 18px; }
      .algo-item { padding: 12px 0; border-top: 1px solid var(--gray-100); }
      .algo-item:first-child { border-top: none; }
      .algo-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; color: var(--accent, var(--dark)); }
      .algo-inputs { font-size: 12px; color: var(--gray-400); margin-bottom: 4px; }
      .algo-what { font-size: 13px; margin-bottom: 4px; }
      .algo-diff { font-size: 12px; color: var(--green-dark); background: var(--green-light); padding: 4px 8px; border-radius: 4px; display: inline-block; }

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
      .blog-cta-btn { display: inline-block; background: var(--green); color: #fff; font-weight: 600; padding: 12px 28px; border-radius: var(--radius-sm); font-size: 14px; transition: background 0.2s; }
      .blog-cta-btn:hover { background: var(--green-dark); }
      .blog-cta-android-btn { background: none; border: 2px solid rgba(255,255,255,0.4); color: #fff; padding: 10px 24px; border-radius: var(--radius-sm); font-family: inherit; font-size: 14px; font-weight: 500; cursor: pointer; transition: border-color 0.2s; text-decoration: none; }
      .blog-cta-android-btn:hover { border-color: #fff; }
      .blog-cta-devices { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 20px; font-size: 12px; color: var(--gray-400); }
      .blog-cta-devices img { height: 20px; width: auto; opacity: 0.7; }

      /* Blog Cross-Link */
      .blog-link-section { padding: 32px 0 0; }
      .blog-link-wrap { max-width: 720px; margin: 0 auto; }
      .blog-link-card { display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: var(--green-light); border: 2px solid var(--green); border-radius: var(--radius); text-decoration: none; transition: box-shadow 0.3s; }
      .blog-link-card:hover { box-shadow: var(--shadow-hover); }
      .blog-link-logo { width: 36px; height: 36px; object-fit: contain; flex-shrink: 0; border-radius: 6px; }
      .blog-link-text { flex: 1; }
      .blog-link-title { display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--green-dark); letter-spacing: 0.3px; }
      .blog-link-desc { display: block; font-size: 14px; font-weight: 500; color: var(--dark); margin-top: 2px; }
      .blog-link-arrow { width: 20px; height: 20px; color: var(--green-dark); flex-shrink: 0; }
      .blog-link-arrow svg { width: 20px; height: 20px; }

      /* Sources */
      .sources-section { padding: 48px 0; background: #fff; }
      .sources-list { display: flex; flex-direction: column; gap: 6px; }
      .src-card { background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-sm); overflow: hidden; }
      .src-header { display: flex; align-items: center; gap: 10px; padding: 12px 16px; cursor: pointer; font-size: 14px; font-weight: 500; }
      .src-brand-wrap { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
      .src-amazon-link { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 500; color: var(--gray-600); text-decoration: none; transition: color 0.2s; }
      .src-amazon-link:hover { color: var(--dark); }
      .src-amazon-link svg { width: 12px; height: 12px; color: var(--green-dark); }
      .src-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
      .src-count { font-size: 12px; color: var(--gray-400); flex-shrink: 0; }
      .src-toggle { width: 18px; height: 18px; color: var(--gray-400); transition: transform 0.3s; }
      .src-toggle svg { width: 100%; height: 100%; }
      .src-card.open .src-toggle { transform: rotate(180deg); }
      .src-body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.4s; padding: 0 16px; }
      .src-card.open .src-body { max-height: 400px; padding: 0 16px 14px; }
      .src-body ul { list-style: none; }
      .src-body li { padding: 6px 0; border-top: 1px solid var(--gray-100); }
      .src-body li:first-child { border-top: none; }
      .src-body a { color: var(--green-dark); font-size: 13px; display: flex; align-items: center; gap: 6px; }
      .src-body a svg { width: 12px; height: 12px; flex-shrink: 0; }

      /* Footer */
      .tool-footer { padding: 24px 0 16px; text-align: center; border-top: 1px solid var(--gray-200); }
      .footer-brand { display: inline-flex; align-items: center; gap: 8px; color: var(--dark); font-family: 'Space Grotesk', sans-serif; font-weight: 600; margin-bottom: 8px; }
      .footer-logo { height: 24px; width: auto; }
      .footer-tagline { color: var(--gray-400); font-size: 13px; margin-bottom: 12px; }
      .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 16px; margin-bottom: 16px; padding: 0 16px; }
      .footer-links a { color: var(--gray-600); font-size: 13px; white-space: nowrap; }
      .footer-links a:hover { color: var(--green-dark); }
      .footer-copyright { color: var(--gray-400); font-size: 12px; margin-top: 4px; }
      .footer-disclaimer { font-size: 11px; color: var(--gray-400); line-height: 1.5; max-width: 560px; margin: 0 auto 12px; }
      .footer-affiliate { font-style: italic; }

      /* Responsive */
      @media (min-width: 768px) {
        .hero { padding: 80px 0 40px; }
        .charts-grid { grid-template-columns: 1fr 1fr; }
        .insights-grid { grid-template-columns: 1fr 1fr; }
        .fda-row { grid-template-columns: 200px 1fr 220px; }
      }
      @media (min-width: 1024px) {
        .insights-grid { grid-template-columns: 1fr 1fr 1fr; }
        .compare-section { padding: 64px 0; }
      }
      @media (max-width: 600px) {
        .fda-row { grid-template-columns: 1fr; gap: 6px; }
        .fda-bar-wrap { display: none; }
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .algo-body, .src-body { transition: none; }
        .pulse-dot { animation: none; }
      }
    `;
  }

  // ── Event Delegation ───────────────────────────────────────────────────

  _setupEventDelegation() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const shadow = this.shadowRoot;

    shadow.addEventListener('click', (e) => {
      // Main tabs
      const tab = e.target.closest('.main-tab');
      if (tab) {
        this._activeTab = tab.dataset.tab;
        this._updateTab();
        return;
      }

      // Algorithm card toggle
      const algoHeader = e.target.closest('.algo-header');
      if (algoHeader) {
        const card = algoHeader.closest('.algo-card');
        const key = card.dataset.algo;
        this._expandedAlgo = this._expandedAlgo === key ? null : key;
        shadow.querySelectorAll('.algo-card').forEach(c => {
          c.classList.toggle('expanded', c.dataset.algo === this._expandedAlgo);
        });
        return;
      }

      // Source card toggle
      const srcHeader = e.target.closest('.src-header');
      if (srcHeader) {
        const card = srcHeader.closest('.src-card');
        const key = card.dataset.source;
        this._expandedSource = this._expandedSource === key ? null : key;
        shadow.querySelectorAll('.src-card').forEach(c => {
          c.classList.toggle('open', c.dataset.source === this._expandedSource);
        });
        return;
      }
    });

    // Keyboard accessibility
    shadow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const algoHeader = e.target.closest('.algo-header');
        if (algoHeader) { e.preventDefault(); algoHeader.click(); }
        const srcHeader = e.target.closest('.src-header');
        if (srcHeader) { e.preventDefault(); srcHeader.click(); }
      }
    });
  }

  // ── Scroll Animations ──────────────────────────────────────────────────

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

  // ── JSON-LD ────────────────────────────────────────────────────────────

  _injectStructuredData() {
    if (document.querySelector('script[data-kygo-sensor-comparison-ld]')) return;
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Wearable Hardware & Software Differences — Garmin vs Whoop vs Oura vs Apple Watch vs Fitbit',
      'description': 'See exactly what hardware and software makes each wearable different. Compare Garmin Venu 4, Whoop 5.0, Oura Ring 4, Apple Watch Series 10, Apple Watch Ultra 3, and Fitbit Charge 6 side by side.',
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'url': 'https://www.kygo.app/tools/sensor-comparison',
      'datePublished': '2026-03-01',
      'dateModified': '2026-03-18',
      'softwareVersion': '1.0',
      'inLanguage': 'en',
      'isAccessibleForFree': true,
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
      'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
      'alternateName': 'Kygo Wearable Hardware & Software Comparison Tool',
      'featureList': 'Compare 6 wearable devices, hardware vs software features, FDA clearance tracking, sensor count comparison, proprietary algorithm analysis',
      'keywords': 'whoop vs oura vs garmin differences, apple watch vs whoop vs garmin, wearable hardware vs software, health wearable comparison 2026, garmin venu 4 vs apple watch, whoop 5.0 vs oura ring 4, fitbit charge 6 EDA stress, wearable health features differences, best health tracker comparison 2026'
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-kygo-sensor-comparison-ld', '');
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);

    // FAQ schema for rich snippets
    if (document.querySelector('script[data-kygo-sensor-comparison-faq]')) return;
    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Which wearable has the most sensors?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Apple Watch Ultra 3 has the most sensors at 11, followed by Garmin Venu 4 and Apple Watch S10 at 10 each. Whoop 5.0 and Oura Ring 4 have 4 sensors each.' }
        },
        {
          '@type': 'Question',
          'name': 'Which wearable has the most FDA-cleared features?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Apple Watch Ultra 3 leads with 3 FDA-cleared features (ECG/AFib, Sleep Apnea, Hypertension). Apple Watch S10 has 2 (ECG, Apnea). Garmin and Fitbit each have 1 (ECG/AFib). Whoop and Oura have none.' }
        },
        {
          '@type': 'Question',
          'name': 'What is the difference between hardware and software features on wearables?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Hardware features are physical sensors (PPG, ECG, accelerometer, EDA) that collect raw biometric data. Software features are proprietary algorithms (Body Battery, Recovery Score, Readiness Score) that process sensor data into actionable health insights. The same sensor can produce very different results depending on the algorithm.' }
        },
        {
          '@type': 'Question',
          'name': 'Which wearable is best for stress tracking?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Fitbit Charge 6 is the only device with a dedicated EDA (electrodermal activity) stress sensor that measures sweat gland activity — a direct nervous system signal. Garmin, Whoop, and Oura estimate stress indirectly from HRV. Apple Watch has no stress feature.' }
        },
        {
          '@type': 'Question',
          'name': 'Which wearable has the best heart rate sensor?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Oura Ring 4 has the best PPG signal quality with its 18-path finger-based sensor (120% better signal vs Gen 3). Whoop 5.0 has the fastest sampling rate at 26 Hz. Garmin Elevate Gen 5 added multi-LED (green + red + IR) for better accuracy across skin tones.' }
        }
      ]
    };
    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.setAttribute('data-kygo-sensor-comparison-faq', '');
    faqScript.textContent = JSON.stringify(faq);
    document.head.appendChild(faqScript);

    // BreadcrumbList schema
    if (!document.querySelector('script[data-kygo-sensor-comparison-breadcrumb]')) {
      const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Kygo Health', 'item': 'https://www.kygo.app' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
          { '@type': 'ListItem', 'position': 3, 'name': 'Sensor Comparison', 'item': 'https://www.kygo.app/tools/sensor-comparison' }
        ]
      };
      const bcScript = document.createElement('script');
      bcScript.type = 'application/ld+json';
      bcScript.setAttribute('data-kygo-sensor-comparison-breadcrumb', '');
      bcScript.textContent = JSON.stringify(breadcrumb);
      document.head.appendChild(bcScript);
    }
  }
}

if (!customElements.get('kygo-sensor-comparison')) {
  customElements.define('kygo-sensor-comparison', KygoSensorComparison);
}
