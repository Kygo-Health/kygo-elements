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
        affiliateUrl: 'https://www.amazon.com/s?k=garmin%20fitness%20tracker&tag=kygohealthapp-20', trackLabel: 'garmin-search'
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
        affiliateUrl: 'https://www.amazon.com/s?k=whoop&rh=p_72%3A1248957011%2Cp_6%3AA95DP87XYU2J1&tag=kygohealthapp-20', trackLabel: 'whoop-search'
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
        affiliateUrl: 'https://www.amazon.com/s?k=Oura%20Ring&tag=kygohealthapp-20', trackLabel: 'oura-ring-search'
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
        affiliateUrl: 'https://www.amazon.com/s?k=Apple%20Watch&rh=p_123%3A110955&tag=kygohealthapp-20', trackLabel: 'apple-watch-search'
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
        affiliateUrl: 'https://www.amazon.com/s?k=Apple%20Watch&rh=p_123%3A110955&tag=kygohealthapp-20', trackLabel: 'apple-watch-search'
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
        affiliateUrl: 'https://www.amazon.com/s?k=Fitbit%3A&rh=p_123%3A213215&tag=kygohealthapp-20', trackLabel: 'fitbit-search'
      }
    };
  }

  // ── Sensor Hardware Data ───────────────────────────────────────────────

  // Hero counts, derived from the hardware/software data so they can never drift.
  get _heroStats() {
    return {
      devices: Object.keys(this._devices).length,
      sensors: this._sensors.length,
      algorithms: this._algorithms.length,
      sources: this._sources.length
    };
  }

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

  get _srcByBrand() {
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
              ${deviceKeys.map(dk => `<td><a href="${devices[dk].affiliateUrl}" class="amazon-link" target="_blank" rel="noopener sponsored" data-track-label="${devices[dk].trackLabel}">View on Amazon <span class="amazon-arrow">${this._icon('arrowRight')}</span></a></td>`).join('')}
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
              ${deviceKeys.map(dk => `<td><a href="${devices[dk].affiliateUrl}" class="amazon-link" target="_blank" rel="noopener sponsored" data-track-label="${devices[dk].trackLabel}">View on Amazon <span class="amazon-arrow">${this._icon('arrowRight')}</span></a></td>`).join('')}
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

  // Flat source list for the standard sources module: the brand becomes the
  // card's tag. (The Amazon links that used to sit in the old accordion
  // headers are unchanged in the two comparison tables above.)
  get _sources() {
    const devices = this._devices;
    const out = [];
    for (const [bk, srcs] of Object.entries(this._srcByBrand)) {
      const brand = bk === 'apple' ? 'Apple Watch' : (devices[bk] ? devices[bk].name : bk);
      for (const s of srcs) out.push({ tag: brand, title: s.label, cite: '', url: s.url });
    }
    return out;
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

  // Related tools · Kygo standard module ────────────────────────────────
  // Exactly 3 cards: a near neighbour, a bridge between accuracy and
  // physiology, and one from another family. Never links this page to
  // itself, and never links the Food Scanner.

  _relatedTools() {
    return [
      {
        title: 'Most Accurate Wearable',
        blurb: 'See which wearable is most accurate across 9 health metrics, backed by peer-reviewed research.',
        url: 'https://www.kygo.app/tools/wearable-accuracy',
        meta: 'Wearables · 17+ studies',
        motif: { motif: 'compare', caption: 'Accuracy vs lab', rows: [{ label: 'Oura', pct: 94 }, { label: 'Apple', pct: 88 }, { label: 'Garmin', pct: 80 }, { label: 'Fitbit', pct: 66 }] }
      },
      {
        title: 'Sleep Metrics Comparison',
        blurb: 'Compare 38 sleep metrics tracked by Oura, Fitbit, Apple Watch and Garmin across 10 categories.',
        url: 'https://www.kygo.app/tools/sleep-metrics',
        meta: 'Sleep · 29 sources',
        motif: { motif: 'dots', caption: 'Metrics tracked', dots: [{ label: 'Oura', n: 9 }, { label: 'Garmin', n: 7 }, { label: 'Apple', n: 6 }, { label: 'Fitbit', n: 5 }] }
      },
      {
        title: 'Oura Ring 5 vs 4 vs 3',
        blurb: 'Every spec across three Oura generations, peer-reviewed accuracy, and the real 3-year cost.',
        url: 'https://www.kygo.app/tools/oura-ring-comparison-tool',
        meta: 'Wearables · 3 generations',
        motif: { motif: 'rings', caption: 'Relative thickness', rings: [{ label: 'Gen 3' }, { label: 'Ring 4' }, { label: 'Ring 5' }] }
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
      { slug: 'wearable-hardware-vs-software-differences-2025',
        title: 'Garmin vs WHOOP vs Oura vs Apple Watch vs Fitbit: Hardware & Software Differences Explained (2026)',
        blurb: 'Every wearable tracks heart rate and sleep, but the hardware and software doing the work are wildly different.',
        cat: 'Wearables & Data', min: 8, img: '273a63_e3b6fec04fa9434e89320a3dba67b9c8~mv2.png' },
      { slug: 'what-s-the-most-accurate-wearable-data-a-2024-2025-study-breakdown-by-device',
        title: 'What\'s the Most Accurate Wearable? 17 Studies, 6 Devices, Ranked (2026)',
        blurb: 'Seventeen independent studies on sleep, HRV, heart rate and step accuracy, with the actual numbers behind each device.',
        cat: 'Wearables & Data', min: 10, img: '273a63_f6d12b66837342a6a552e4e3d9297fef~mv2.png' },
      { slug: 'centralize-health-data-multiple-devices',
        title: 'Centralize Health Data From Multiple Devices: The Complete Guide',
        blurb: 'Stop switching between five apps to understand your health, and see the patterns that only appear once the data sits in one place.',
        cat: 'Wearables & Data', min: 9, img: '273a63_2889c7cc0ed1471da8daf7f79182cd6b~mv2.png' }
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
      slug: 'sensor-comparison',
      headline: `The sensors are similar. <span>The context isn't.</span>`,
      sub: `Every brand runs its own maths on much the same hardware. Kygo adds the piece none of them have: what you actually ate and did.`
    };
  }

  // ── App CTA · Kygo standard module ──────────────────────────────────────
  // The dark conversion card, on its own section, directly after the first
  // content section. Self-contained under `kc-*` names with a literal fallback
  // behind every custom property, so the same block renders identically on
  // either palette. Nothing else belongs in this section — the email capture
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
    return { source: 'tool-sensor-comparison', variant: 'comparison' };
  }

  // ── Email CTA · Kygo standard module ────────────────────────────────────
  // The inline email capture, on its own band. It never sits directly under the
  // app CTA — a page content section always separates the two conversion
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
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <!-- Header -->
      <header class="header">
        <div class="header-inner">
          <a href="https://www.kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" loading="lazy" />
            Sensor Comparison
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
              <div class="hero-pill animate-on-scroll"><span class="dot"></span> ${hs.devices} DEVICES · ${hs.sensors} SENSORS · ${hs.algorithms} ALGORITHMS</div>
              <h1 class="animate-on-scroll">What's actually <span class="hl">inside your wearable?</span></h1>
              <p class="hero-lede animate-on-scroll">We took apart the specs of every major wearable, sensor by sensor and metric by metric. Exactly what hardware you are paying for, what health data it produces, and <strong>which features are only software</strong>.</p>
            </div>
            <div class="hero-vis animate-on-scroll">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> Where the difference lives</span>
                <span class="hero-vis-tag">software &gt; hardware</span>
              </div>
              <div class="hv-two">
                <div class="hv-col">
                  <span class="hv-label">Sensors</span>
                  <span class="hv-val">${hs.sensors}</span>
                  <div class="hv-bar"><span class="hv-fill" style="width:64%"></span></div>
                  <span class="hv-cap">Physical hardware</span>
                </div>
                <div class="hv-col">
                  <span class="hv-label">Algorithms</span>
                  <span class="hv-val good">${hs.algorithms}</span>
                  <div class="hv-bar"><span class="hv-fill good" style="width:100%"></span></div>
                  <span class="hv-cap good">Proprietary software</span>
                </div>
              </div>
              <span class="hv-foot">Across ${hs.devices} latest-generation devices · brands share sensors, not the maths on top</span>
            </div>
          </div>
          <div class="hero-stats animate-on-scroll">
            <div class="hero-stat"><div class="num">${hs.devices}</div><div class="lbl">Devices torn down</div></div>
            <div class="hero-stat"><div class="num">${hs.sensors}</div><div class="lbl">Distinct sensors mapped</div></div>
            <div class="hero-stat"><div class="num">${hs.algorithms}</div><div class="lbl">Proprietary algorithms</div></div>
            <div class="hero-stat"><div class="num">${hs.sources}</div><div class="lbl">Verified sources</div></div>
          </div>
        </div>
      </section>

      <!-- Device Stats -->
      <section class="stats-section">
        <div class="container">
          <div class="stats-bar animate-on-scroll">${this._renderDeviceStatsBar()}</div>
        </div>
      </section>
      ${this._renderAppCta()}

      <!-- Visual Charts -->
      <section class="charts-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">At a Glance</h2>
          <p class="section-sub animate-on-scroll">Visual breakdown of sensor counts, brand focus areas, proprietary algorithms, and FDA-cleared features across all 6 devices.</p>
          ${this._renderChartsSection()}
        </div>
      </section>
      ${this._renderEmailCta()}

      <!-- Early contextual CTA -->

      <!-- Main Comparison Section -->
      <section class="compare-section" id="compare">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Device Comparison</h2>
          <p class="section-sub animate-on-scroll">Switch between hardware sensors, the health metrics they produce, and software-only features.</p>
          <div class="main-tabs animate-on-scroll" role="tablist">${this._renderMainTabs()}</div>
          <div class="tab-content animate-on-scroll">${this._renderSensorTable()}</div>
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
      ${this._renderRelatedTools('gray')}

      <section class="fda-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">FDA-Cleared Medical Features</h2>
          <div class="fda-grid animate-on-scroll">${this._renderFdaSummary()}</div>
        </div>
      </section>

      <!-- Sources -->

      <section class="sources-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Sources</h2>
          <p class="section-sub animate-on-scroll">All data from official manufacturer specs, support docs, and independent reviews. Verified March 2026.</p>
          <div class="sources-wrap animate-on-scroll">${this._renderSources()}</div>
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
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Always consult a qualified healthcare provider before making health decisions based on wearable data.</p>
          <p class="footer-copyright">Data sourced from official manufacturer specs, support documentation, and independent reviews. Last updated March 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, I earn from qualifying purchases.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>

      ${this._renderRelatedPosts('gray')}
    `;
  }

  // ── Styles ─────────────────────────────────────────────────────────────

  _styles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

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
      .nav-cta-group { margin-left:auto; display:inline-flex; align-items:center; gap:8px; }
      .nav-cta-group .nav-store-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border-radius:8px; font-weight:600; font-size:13px; text-decoration:none; white-space:nowrap; line-height:1; }
      .nav-cta-group .nav-store-btn svg { width:15px; height:15px; flex-shrink:0; }
      .nav-cta-group .nav-store-ios { background:var(--green); color:#fff; }
      .nav-cta-group .nav-store-ios:hover { background:var(--green-dark); color:#fff; }
      .nav-cta-group .nav-store-android { background:#fff; color:var(--green-dark); border:1.5px solid var(--gray-200); }
      .nav-cta-group .nav-store-android:hover { border-color:var(--green); color:var(--green-dark); }
      @media (max-width:360px){ .nav-cta-group .nav-store-btn span { display:none; } .nav-cta-group .nav-store-btn { padding:8px 10px; } }

      /* Hero */
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
      .charts-section { padding: 48px 0; background: var(--bg-surface); }
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
      .fda-section { padding: 48px 0; background: #fff; }
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

      .pulse-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; animation: pulse 2s infinite; }
      @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      .kearly-section { padding: 48px 16px; }
      .kband { max-width: 1100px; margin: 0 auto; }
      .kband-inner { position: relative; overflow: hidden; background: #fff; border: 2px solid #E2E8F0; border-radius: 20px; padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; gap: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
      .kband-glow { position: absolute; top: -120px; right: -80px; width: 360px; height: 360px; background: radial-gradient(circle, rgba(34,197,94,0.14), transparent 65%); pointer-events: none; }
      .kband-copy { position: relative; display: flex; flex-direction: column; gap: 10px; max-width: 620px; }
      .kband-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 12px; letter-spacing: 0.7px; text-transform: uppercase; color: #16A34A; }
      .kband-dot { width: 7px; height: 7px; border-radius: 50%; background: #22C55E; animation: kygoPulse 2s ease-out infinite; }
      .kband-headline { margin: 0; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 24px; line-height: 1.3; color: #1E293B; }
      .kband-actions { position: relative; display: flex; flex-wrap: wrap; gap: 12px; flex-shrink: 0; }
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
      .kearly { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.3); border-radius: 16px; padding: 24px 20px; text-align: center; max-width: 780px; margin: 0 auto; }
      .kearly-copy { font-size: 16px; line-height: 1.5; font-weight: 500; margin: 0 0 16px; color: var(--dark); }
      .kearly-btns { display: flex; flex-direction: column; gap: 10px; align-items: center; }
      .kearly-btns > a { width: 100%; max-width: 320px; justify-content: center; min-height: 48px; }
      @media (min-width: 520px) { .kearly-btns { flex-direction: row; justify-content: center; } .kearly-btns > a { width: auto; } }

      /* Blog Cross-Link */

      /* Sources */
      .sources-section { padding: 48px 0; }
      .sources-list { display: flex; flex-direction: column; gap: 6px; }
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

      /* Footer */
      .tool-footer { padding: 24px 0 16px; text-align: center; background: #fff; border-top: 1px solid var(--gray-200); }
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
        .algo-body { transition: none; }
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

      // Sources · show-all toggle
      if (e.target.closest('[data-src-toggle]')) { this._toggleSources(); return; }
    });

    // Keyboard accessibility
    shadow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const algoHeader = e.target.closest('.algo-header');
        if (algoHeader) { e.preventDefault(); algoHeader.click(); }
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
