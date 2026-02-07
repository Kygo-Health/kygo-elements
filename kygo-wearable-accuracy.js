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
    this._showStudyConflicts = false;
  }

  connectedCallback() {
    this.render();
    this._setupEvents();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, 'Wearable Accuracy Comparison Tool by Kygo Health. Compare accuracy of Oura Ring, Apple Watch, Garmin, WHOOP, Fitbit, and Samsung Galaxy Watch across sleep staging, heart rate variability (HRV), resting heart rate, active heart rate, SpO2 blood oxygen, step counting, calorie tracking, VO2 max, skin temperature, and respiratory rate. Data sourced from peer-reviewed studies including Robbins 2024, Dial 2025, Park 2023, Schyvens 2025. Independent and funded study results compared side by side with bias disclosures. Best wearable for sleep: Apple Watch and Fitbit (independent studies). Best for HRV: Oura Ring Gen 4 (CCC 0.99). Best for active heart rate: Apple Watch (86.3%). Best for steps: Garmin (82.6%). Best for SpO2: Apple Watch (MAE 2.2%). No single device wins every metric.');
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
        subscription: 'None',
        strengths: ['Best active HR (86.3%)', 'Best SpO2 (MAE 2.2%)', 'Top independent sleep κ=0.53', 'Best wake detection (52.2%)', 'Best REM detection (68.6%)', 'FDA-cleared ECG & sleep apnea'],
        weaknesses: ['VO2 max 13–16% error', 'Underestimates deep sleep', 'Daily charging needed'],
        researchNote: null
      },
      'oura': {
        name: 'Oura Ring',
        short: 'Oura Ring',
        color: '#C4A97D',
        icon: this._ouraIcon(),
        bestFor: 'HRV, Resting HR, Skin Temp, Recovery',
        subscription: '$5.99/mo required',
        strengths: ['Best HRV accuracy (CCC 0.99)', 'Best resting HR (CCC 0.98)', 'Best skin temp (r²>0.99)', 'Comfortable sleep wear'],
        weaknesses: ['Poor step counting (~50% error)', 'No active HR during exercise', 'No GPS, no screen'],
        researchNote: 'Sleep κ=0.65 is from an Oura-funded study. Independent studies found κ=0.2–0.4.'
      },
      'garmin': {
        name: 'Garmin',
        short: 'Garmin',
        color: '#007CC3',
        icon: this._garminIcon(),
        bestFor: 'Steps, GPS, Outdoor Sports, VO2 Max, Battery',
        subscription: 'None',
        strengths: ['Best step accuracy (82.6%)', 'Best VO2 max (MAPE 7.05%)', 'Best GPS & battery life', 'Multi-sport tracking'],
        weaknesses: ['Poor sleep staging (κ=0.21)', 'Poor wake detection (27.6%)', 'Lower HRV (CCC 0.87)', 'Worst calorie tracking (48%)'],
        researchNote: 'HRV/sleep studies used Fenix 6 / Vivosmart 4 (older models). Current devices may perform better.'
      },
      'whoop': {
        name: 'WHOOP',
        short: 'WHOOP',
        color: '#44B78B',
        icon: this._whoopIcon(),
        bestFor: 'Recovery, Strain, Deep Sleep, Athlete Training',
        subscription: '$30/mo (12-month)',
        strengths: ['Best deep sleep detection (69.6%)', 'Good HRV (CCC 0.94)', 'Best TST agreement (-1.4 min)', '99.7% HR during sleep'],
        weaknesses: ['Moderate sleep staging (κ=0.37)', 'Overestimates REM by ~21 min', 'Poor wake detection (32.5%)', 'No screen, expensive subscription'],
        researchNote: null
      },
      'fitbit': {
        name: 'Fitbit',
        short: 'Fitbit',
        color: '#00B0B9',
        icon: this._fitbitIcon(),
        bestFor: 'General Fitness, Sleep Basics, Affordability',
        subscription: 'Premium optional ($9.99/mo)',
        strengths: ['Moderate sleep accuracy (κ=0.42–0.55)', 'Decent deep sleep sensitivity (61.7%)', 'FDA-cleared irregular rhythm', 'Affordable'],
        weaknesses: ['Below leaders in most metrics', 'Declining validation research since Google acquisition'],
        researchNote: null
      },
      'samsung': {
        name: 'Samsung Galaxy Watch',
        short: 'Samsung',
        color: '#1428A0',
        icon: this._samsungIcon(),
        bestFor: 'Android Users, Sleep Apnea Screening, SpO2',
        subscription: 'None',
        strengths: ['FDA-cleared sleep apnea detection', 'Validated respiratory rate (RMSE 1.13)', 'FDA-cleared ECG', 'Good Android integration'],
        weaknesses: ['Limited independent accuracy studies', 'Less validation data than Apple/Oura'],
        researchNote: null
      }
    };
  }

  get _metrics() {
    return {
      sleep: {
        name: 'Sleep Staging',
        desc: 'How accurately the device classifies sleep into Wake, Light, Deep, and REM stages compared to polysomnography (PSG).',
        unit: "Cohen's κ",
        goldStandard: 'Polysomnography (PSG)',
        higherBetter: true,
        scale: { min: 0, max: 0.8, label: 'κ' },
        data: {
          'apple-watch': [
            { value: 0.60, label: 'κ=0.60', study: 'Robbins 2024', note: 'Oura-funded', biased: true },
            { value: 0.53, label: 'κ=0.53', study: 'Schyvens 2025', note: 'Independent', biased: false },
            { value: 0.3, label: 'κ=0.2–0.4', study: 'Park 2023', note: 'Independent', biased: false }
          ],
          'oura': [
            { value: 0.65, label: 'κ=0.65', study: 'Robbins 2024', note: 'Oura-funded', biased: true },
            { value: 0.3, label: 'κ=0.2–0.4', study: 'Park 2023', note: 'Independent', biased: false }
          ],
          'garmin': [
            { value: 0.21, label: 'κ=0.21', study: 'Schyvens 2025', note: 'Independent', biased: false }
          ],
          'whoop': [
            { value: 0.37, label: 'κ=0.37', study: 'Schyvens 2025', note: 'Independent', biased: false }
          ],
          'fitbit': [
            { value: 0.55, label: 'κ=0.55', study: 'Robbins 2024', note: 'Oura-funded', biased: true },
            { value: 0.42, label: 'κ=0.42', study: 'Schyvens 2025', note: 'Independent', biased: false },
            { value: 0.5, label: 'κ=0.4–0.6', study: 'Park 2023', note: 'Independent', biased: false }
          ],
          'samsung': [
            { value: 0.5, label: 'κ=0.4–0.6', study: 'Park 2023', note: 'Independent', biased: false }
          ]
        },
        insight: 'Independent studies consistently rank Apple Watch and Fitbit near the top. Oura only leads in the Oura-funded study. All devices tend to misclassify wake, deep, and REM as light sleep.'
      },
      hrv: {
        name: 'Nocturnal HRV',
        desc: 'Heart rate variability measured during sleep — a key recovery and stress indicator.',
        unit: 'CCC',
        goldStandard: 'Polar H10 ECG chest strap',
        higherBetter: true,
        scale: { min: 0.7, max: 1.0, label: 'CCC' },
        data: {
          'apple-watch': [],
          'oura': [
            { value: 0.99, label: 'CCC 0.99', study: 'Dial 2025', note: 'Gen 4, Independent', biased: false },
            { value: 0.97, label: 'CCC 0.97', study: 'Dial 2025', note: 'Gen 3, Independent', biased: false }
          ],
          'garmin': [
            { value: 0.87, label: 'CCC 0.87', study: 'Dial 2025', note: 'Fenix 6 (older model)', biased: false }
          ],
          'whoop': [
            { value: 0.94, label: 'CCC 0.94', study: 'Dial 2025', note: 'Independent', biased: false }
          ],
          'fitbit': [],
          'samsung': []
        },
        insight: 'Oura Gen 4 is the clear winner for nocturnal HRV with near-perfect agreement. However, accuracy decreases at HRV >60ms (relevant for very fit individuals). Apple Watch, Fitbit, and Samsung were not included in this study.'
      },
      rhr: {
        name: 'Resting Heart Rate',
        desc: 'How accurately the device measures resting heart rate during sleep.',
        unit: 'CCC',
        goldStandard: 'Polar H10 ECG chest strap',
        higherBetter: true,
        scale: { min: 0.7, max: 1.0, label: 'CCC' },
        data: {
          'apple-watch': [],
          'oura': [
            { value: 0.98, label: 'CCC 0.98', study: 'Dial 2025', note: 'Gen 4, Independent', biased: false },
            { value: 0.97, label: 'CCC 0.97', study: 'Dial 2025', note: 'Gen 3, Independent', biased: false }
          ],
          'garmin': [],
          'whoop': [
            { value: 0.91, label: 'CCC 0.91', study: 'Dial 2025', note: 'Independent', biased: false }
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
        scale: { min: 40, max: 100, label: '%' },
        data: {
          'apple-watch': [
            { value: 86.3, label: '86.3%', study: 'WellnessPulse 2025', note: 'Meta-analysis', biased: false }
          ],
          'oura': [],
          'garmin': [
            { value: 67.7, label: '67.7%', study: 'WellnessPulse 2025', note: 'Meta-analysis', biased: false }
          ],
          'whoop': [],
          'fitbit': [
            { value: 73.6, label: '73.6%', study: 'WellnessPulse 2025', note: 'Meta-analysis', biased: false }
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
        scale: { min: 0, max: 8, label: 'MAE %' },
        data: {
          'apple-watch': [
            { value: 2.2, label: 'MAE 2.2%', study: 'PLOS/Nature studies', note: 'Series 7', biased: false }
          ],
          'oura': [],
          'garmin': [
            { value: 4.5, label: 'MAE ~4.5%', study: 'Validation studies', note: 'Fenix 6 Pro', biased: false },
            { value: 5.8, label: 'MAE 5.8%', study: 'Validation studies', note: 'Venu 2s', biased: false }
          ],
          'whoop': [],
          'fitbit': [],
          'samsung': [
            { value: 3.0, label: 'Reliable', study: 'J Clin Sleep Med 2024', note: 'Samsung-funded', biased: true }
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
        scale: { min: 40, max: 100, label: '%' },
        data: {
          'apple-watch': [
            { value: 81.1, label: '81.1%', study: 'WellnessPulse 2025', note: 'Meta-analysis', biased: false }
          ],
          'oura': [
            { value: 49.7, label: '~50% (real-world)', study: 'AIM7 data', note: '4.8% error controlled', biased: false }
          ],
          'garmin': [
            { value: 82.6, label: '82.6%', study: 'WellnessPulse 2025', note: 'Meta-analysis', biased: false }
          ],
          'whoop': [],
          'fitbit': [
            { value: 77.3, label: '77.3%', study: 'WellnessPulse 2025', note: 'Meta-analysis', biased: false }
          ],
          'samsung': []
        },
        insight: 'Garmin and Apple Watch are neck-and-neck for step counting. Oura Ring is poor for steps due to finger placement — wrist-based devices have a significant advantage for motion detection.'
      },
      calories: {
        name: 'Calorie / Energy',
        desc: 'How accurately the device estimates energy expenditure (calories burned).',
        unit: 'Accuracy %',
        goldStandard: 'Indirect calorimetry',
        higherBetter: true,
        scale: { min: 30, max: 100, label: '%' },
        data: {
          'apple-watch': [
            { value: 71, label: '71%', study: 'WellnessPulse 2025', note: 'Meta-analysis', biased: false }
          ],
          'oura': [
            { value: 87, label: '~87%', study: 'AIM7 data', note: '13% avg error', biased: false }
          ],
          'garmin': [
            { value: 48, label: '48%', study: 'WellnessPulse 2025', note: 'Meta-analysis', biased: false }
          ],
          'whoop': [],
          'fitbit': [
            { value: 65.6, label: '65.6%', study: 'WellnessPulse 2025', note: 'Meta-analysis', biased: false }
          ],
          'samsung': []
        },
        insight: 'Calorie tracking is weak across ALL devices. None should be treated as precise. Accuracy drops further during high-intensity or multi-modal exercise. Use for general trends only.'
      },
      vo2max: {
        name: 'VO2 Max',
        desc: 'Estimated maximal oxygen uptake — a key indicator of cardiovascular fitness.',
        unit: 'MAPE %',
        goldStandard: 'Laboratory metabolic cart',
        higherBetter: false,
        scale: { min: 0, max: 20, label: 'MAPE %' },
        data: {
          'apple-watch': [
            { value: 15.8, label: 'MAPE 15.8%', study: 'Caserman 2024', note: 'Series 7', biased: false },
            { value: 13.3, label: 'MAPE 13.3%', study: 'Lambe 2025', note: 'Validation', biased: false }
          ],
          'oura': [],
          'garmin': [
            { value: 7.05, label: 'MAPE 7.05%', study: 'Sensors 2025', note: 'Fenix 6', biased: false },
            { value: 5.7, label: 'MAPE 5.7%', study: 'Running studies', note: 'Forerunner 245', biased: false }
          ],
          'whoop': [],
          'fitbit': [],
          'samsung': []
        },
        insight: 'Garmin leads significantly for VO2 max estimation. All devices tend to underestimate in fit individuals and overestimate in sedentary populations. Use for trend tracking, not absolute values.'
      },
      temp: {
        name: 'Skin Temperature',
        desc: 'Skin temperature measurement accuracy — useful for illness detection and menstrual cycle tracking.',
        unit: 'r²',
        goldStandard: 'iButton research-grade sensors',
        higherBetter: true,
        scale: { min: 0.8, max: 1.0, label: 'r²' },
        data: {
          'apple-watch': [],
          'oura': [
            { value: 0.99, label: 'r²>0.99 (lab)', study: 'Oura 2024', note: 'Oura internal study', biased: true },
            { value: 0.92, label: 'r²>0.92 (real-world)', study: 'Oura 2024', note: 'Oura internal study', biased: true }
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
      { icon: '&#x1F634;', label: 'Sleep Tracking', devices: ['apple-watch', 'fitbit'], confidence: 'Moderate', note: 'Consistent across independent studies' },
      { icon: '&#x1F49A;', label: 'HRV & Recovery', devices: ['oura'], confidence: 'High', note: 'CCC=0.99, independently validated' },
      { icon: '&#x1F3C3;', label: 'Active Heart Rate', devices: ['apple-watch'], confidence: 'High', note: '86.3% accuracy, multiple studies' },
      { icon: '&#x1F463;', label: 'Step Counting', devices: ['garmin', 'apple-watch'], confidence: 'High', note: '82.6% and 81.1% respectively' },
      { icon: '&#x1F3CB;', label: 'VO2 Max / Fitness', devices: ['garmin'], confidence: 'Moderate', note: 'MAPE 7.05%, use for trends' },
      { icon: '&#x1FA78;', label: 'SpO2 / Blood Oxygen', devices: ['apple-watch'], confidence: 'Moderate', note: 'MAE 2.2%, but not medical-grade' },
      { icon: '&#x1F3E5;', label: 'Medical Features', devices: ['apple-watch', 'samsung'], confidence: 'High', note: 'FDA-cleared ECG & sleep apnea' },
      { icon: '&#x1F4AA;', label: 'Athlete Recovery', devices: ['whoop', 'oura'], confidence: 'Moderate', note: 'Deep sleep + HRV tracking' }
    ];
  }

  get _studies() {
    return [
      { id: 'robbins2024', authors: 'Robbins R, et al.', year: 2024, title: 'Accuracy of Three Commercial Wearable Devices for Sleep Tracking in Healthy Adults', journal: 'Sensors', doi: '10.3390/s24206532', n: 36, funded: 'Oura Ring Inc.', independent: false },
      { id: 'dial2025', authors: 'Dial MB, et al.', year: 2025, title: 'Validation of nocturnal resting heart rate and heart rate variability in consumer wearables', journal: 'Physiological Reports', doi: '10.14814/phy2.70527', n: '13 (536 nights)', funded: 'None disclosed', independent: true },
      { id: 'park2023', authors: 'Park et al.', year: 2023, title: 'Accuracy of 11 Wearable, Nearable, and Airable Consumer Sleep Trackers', journal: 'JMIR mHealth and uHealth', doi: '10.2196/50983', n: 75, funded: 'None disclosed', independent: true },
      { id: 'schyvens2025', authors: 'Schyvens AM, et al.', year: 2025, title: 'Performance of six consumer sleep trackers in comparison with polysomnography in healthy adults', journal: 'Sleep Advances', doi: '10.1093/sleepadvances/zpaf016', n: 62, funded: 'VLAIO (Flanders gov)', independent: true },
      { id: 'khodr2024', authors: 'Khodr R, et al.', year: 2024, title: 'Accuracy, Utility and Applicability of the WHOOP Wearable Monitoring Device — Systematic Review', journal: 'medRxiv', doi: '10.1101/2024.01.04.24300784', n: 'Systematic review', funded: 'None disclosed', independent: true },
      { id: 'caserman2024', authors: 'Caserman P, et al.', year: 2024, title: 'Validity of Apple Watch Series 7 VO2 Max Estimation', journal: 'JMIR Biomedical Engineering', doi: null, n: null, funded: 'None disclosed', independent: true },
      { id: 'lambe2025', authors: 'Lambe RF, et al.', year: 2025, title: 'Validation of Apple Watch VO2 max estimates', journal: 'PLOS One', doi: '10.1371/journal.pone.0318498', n: null, funded: 'None disclosed', independent: true },
      { id: 'wellnesspulse2025', authors: 'WellnessPulse', year: 2025, title: 'Accuracy of Fitness Trackers — Meta-Analysis', journal: 'WellnessPulse', doi: null, n: 'Meta-analysis', funded: 'None disclosed', independent: true }
    ];
  }

  // ── Icons ─────────────────────────────────────────────────────────────

  _appleWatchIcon() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="2" width="12" height="20" rx="3"/><rect x="8" y="5" width="8" height="11" rx="1" fill="currentColor" opacity="0.15"/><line x1="10" y1="20" x2="14" y2="20"/></svg>`; }
  _ouraIcon() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="5" stroke-dasharray="2 2"/></svg>`; }
  _garminIcon() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 16 14"/></svg>`; }
  _whoopIcon() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="8" cy="12" r="1.5" fill="currentColor"/></svg>`; }
  _fitbitIcon() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="7" y="2" width="10" height="20" rx="3"/><circle cx="12" cy="10" r="3"/><line x1="12" y1="7" x2="12" y2="10"/><line x1="12" y1="10" x2="14" y2="11.5"/></svg>`; }
  _samsungIcon() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 3 C14 8, 14 16, 12 21" /><path d="M12 3 C10 8, 10 16, 12 21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>`; }

  // ── Render ─────────────────────────────────────────────────────────────

  render() {
    const devices = this._devices;
    const metrics = this._metrics;
    const metric = metrics[this._activeMetric];
    const d1key = this._selectedDevices[0];
    const d2key = this._selectedDevices[1];
    const d1 = devices[d1key];
    const d2 = devices[d2key];
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge animate-on-scroll">RESEARCH-BACKED COMPARISON</div>
          <h1 class="animate-on-scroll">Which Wearable Is Actually the Most Accurate?</h1>
          <p class="hero-sub animate-on-scroll">We analyzed 17+ peer-reviewed studies so you don't have to. Compare real accuracy data for Oura, Apple Watch, Garmin, WHOOP, Fitbit, and Samsung — with full bias disclosure.</p>
        </div>
      </section>

      <!-- Use Case Quick Picks -->
      <section class="use-cases">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Best Wearable by Use Case</h2>
          <p class="section-sub animate-on-scroll">What matters most to you? Tap a use case to see our research-backed recommendation.</p>
          <div class="use-case-grid">
            ${this._useCases.map((uc, i) => `
              <div class="use-case-card animate-on-scroll" style="--delay:${i * 60}ms">
                <div class="uc-icon">${uc.icon}</div>
                <div class="uc-label">${uc.label}</div>
                <div class="uc-devices">${uc.devices.map(dk => `<span class="uc-device" style="--dc:${devices[dk].color}">${devices[dk].short}</span>`).join('')}</div>
                <div class="uc-confidence ${uc.confidence.toLowerCase()}">${uc.confidence} confidence</div>
                <div class="uc-note">${uc.note}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Comparison Tool -->
      <section class="comparison" id="compare">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Head-to-Head Comparison</h2>
          <p class="section-sub animate-on-scroll">Select two devices and explore accuracy data metric by metric.</p>

          <!-- Device Selectors -->
          <div class="device-selectors animate-on-scroll">
            <div class="selector-group">
              <label>Device 1</label>
              <div class="selector-wrap">
                <select id="device1">
                  ${Object.entries(devices).map(([k, d]) => `<option value="${k}" ${k === d1key ? 'selected' : ''}>${d.name}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="vs-badge">VS</div>
            <div class="selector-group">
              <label>Device 2</label>
              <div class="selector-wrap">
                <select id="device2">
                  ${Object.entries(devices).map(([k, d]) => `<option value="${k}" ${k === d2key ? 'selected' : ''}>${d.name}</option>`).join('')}
                </select>
              </div>
            </div>
          </div>

          <!-- Device Summary Row -->
          <div class="device-summary-row animate-on-scroll">
            ${[d1key, d2key].map(dk => {
              const d = devices[dk];
              return `
              <div class="device-summary-card" style="--accent:${d.color}">
                <div class="ds-icon">${d.icon}</div>
                <h3>${d.name}</h3>
                <div class="ds-best-for">${d.bestFor}</div>
                <div class="ds-sub">${d.subscription}</div>
              </div>`;
            }).join('')}
          </div>

          <!-- Metric Tabs -->
          <div class="metric-tabs animate-on-scroll" role="tablist">
            ${Object.entries(metrics).map(([k, m]) => `
              <button class="metric-tab ${k === this._activeMetric ? 'active' : ''}" data-metric="${k}" role="tab">${m.name}</button>
            `).join('')}
          </div>

          <!-- Metric Detail -->
          <div class="metric-detail animate-on-scroll">
            <div class="md-header">
              <h3>${metric.name}</h3>
              <span class="md-gold">Gold Standard: ${metric.goldStandard}</span>
            </div>
            <p class="md-desc">${metric.desc}</p>

            <!-- Bars -->
            <div class="md-bars">
              ${[d1key, d2key].map(dk => {
                const d = devices[dk];
                const entries = metric.data[dk] || [];
                if (entries.length === 0) {
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
                      <div class="md-bar-study ${e.biased ? 'biased-text' : ''}">${e.study}${e.biased ? ' ⚠️' : ''}</div>
                    </div>`;
                  }).join('')}
                </div>`;
              }).join('')}
            </div>

            <div class="md-insight">
              <div class="md-insight-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
              <p>${metric.insight}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Device Deep Dives -->
      <section class="deep-dives">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Device Deep Dives</h2>
          <p class="section-sub animate-on-scroll">Tap any device for strengths, weaknesses, and research notes.</p>
          <div class="dd-grid">
            ${Object.entries(devices).map(([k, d], i) => `
              <div class="dd-card animate-on-scroll ${this._expandedDevice === k ? 'expanded' : ''}" data-device="${k}" style="--accent:${d.color};--delay:${i * 80}ms">
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
                      <ul>${d.strengths.map(s => `<li><span class="dd-check">&#10003;</span> ${s}</li>`).join('')}</ul>
                    </div>
                    <div class="dd-col">
                      <h4>Weaknesses</h4>
                      <ul>${d.weaknesses.map(w => `<li><span class="dd-x">&#10007;</span> ${w}</li>`).join('')}</ul>
                    </div>
                  </div>
                  <div class="dd-sub">${d.subscription}</div>
                  ${d.researchNote ? `<div class="dd-research-note"><strong>Research Note:</strong> ${d.researchNote}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Study Transparency -->
      <section class="studies">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Study Transparency</h2>
          <p class="section-sub animate-on-scroll">Every data point has a source. We flag funding bias so you can judge the evidence yourself.</p>
          <div class="study-list animate-on-scroll">
            ${this._studies.map(s => `
              <div class="study-card ${s.independent ? '' : 'industry-funded'}">
                <div class="study-badge ${s.independent ? 'independent' : 'funded'}">${s.independent ? 'Independent' : 'Industry-Funded'}</div>
                <div class="study-authors">${s.authors} (${s.year})</div>
                <div class="study-title">${s.title}</div>
                <div class="study-journal">${s.journal}${s.n ? ` · n=${s.n}` : ''}</div>
                ${s.doi ? `<div class="study-doi">DOI: ${s.doi}</div>` : ''}
                ${!s.independent ? `<div class="study-funding">Funded by: ${s.funded}</div>` : ''}
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
            <div class="caveat-grid">
              <div class="caveat-item"><strong>No single device wins everywhere.</strong> The best wearable depends entirely on which metric matters most to you.</div>
              <div class="caveat-item"><strong>Study funding matters.</strong> Industry-funded studies tend to favor the funder's device. We flag every study's funding source.</div>
              <div class="caveat-item"><strong>Device generations change.</strong> Some studies tested older hardware (e.g., Garmin Fenix 6). Current models may perform differently.</div>
              <div class="caveat-item"><strong>Small sample sizes.</strong> The HRV study had 13 participants (536 nights). Sleep studies ranged from 36–75 participants.</div>
              <div class="caveat-item"><strong>All wearables are estimates.</strong> None are medical devices (except specific FDA-cleared features). Data should inform, not diagnose.</div>
              <div class="caveat-item"><strong>Individual variation.</strong> Accuracy varies by skin tone, tattoos, BMI, device fit, and activity. Most studies have limited diversity.</div>
              <div class="caveat-item"><strong>Calorie tracking is weak everywhere.</strong> The best device (Apple Watch) is only 71% accurate. Don't rely on any wearable for precise calorie counts.</div>
              <div class="caveat-item"><strong>Even the gold standard isn't perfect.</strong> Polysomnography has inter-rater reliability of κ≈0.75 — even experts disagree ~25% of the time on sleep staging.</div>
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
          <p>&copy; ${new Date().getFullYear()} Kygo Health. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  // ── Styles ────────────────────────────────────────────────────────────

  _styles() {
    return `
      :host {
        --dark: #1E293B;
        --light: #F8FAFC;
        --green: #22C55E;
        --green-dark: #16A34A;
        --green-light: rgba(34,197,94,0.1);
        --gray-50: #f9fafb;
        --gray-100: #F1F5F9;
        --gray-200: #E2E8F0;
        --gray-300: #CBD5E1;
        --gray-400: #94A3B8;
        --gray-600: #475569;
        --gray-700: #334155;
        --radius: 16px;
        --radius-sm: 10px;
        --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
        --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
        --shadow-lg: 0 10px 30px rgba(0,0,0,0.1);
        display: block;
        font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: var(--light);
        color: var(--dark);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
      }
      *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
      h1, h2, h3, h4 {
        font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 600;
        line-height: 1.2;
      }
      .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

      /* Animations */
      .animate-on-scroll { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; transition-delay: var(--delay, 0ms); }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      /* Hero */
      .hero { padding: 56px 0 40px; text-align: center; background: linear-gradient(180deg, #f0fdf4 0%, var(--light) 100%); }
      .hero-badge { display: inline-block; padding: 6px 16px; border-radius: 100px; background: var(--green-light); color: var(--green-dark); font-size: 12px; font-weight: 700; letter-spacing: 1px; margin-bottom: 16px; }
      .hero h1 { font-size: 32px; margin-bottom: 16px; color: var(--dark); }
      .hero-sub { font-size: 16px; color: var(--gray-600); max-width: 640px; margin: 0 auto; line-height: 1.7; }

      /* Section titles */
      .section-title { font-size: 26px; text-align: center; margin-bottom: 8px; }
      .section-sub { font-size: 15px; color: var(--gray-600); text-align: center; margin-bottom: 32px; max-width: 560px; margin-left: auto; margin-right: auto; }

      /* Use Cases */
      .use-cases { padding: 48px 0; }
      .use-case-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .use-case-card { background: #fff; border-radius: var(--radius-sm); padding: 16px; border: 1px solid var(--gray-200); transition: box-shadow 0.2s, transform 0.2s; cursor: default; }
      .use-case-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
      .uc-icon { font-size: 24px; margin-bottom: 6px; }
      .uc-label { font-weight: 600; font-size: 14px; margin-bottom: 6px; color: var(--dark); }
      .uc-devices { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
      .uc-device { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; background: color-mix(in srgb, var(--dc) 12%, white); color: var(--dc); }
      .uc-confidence { font-size: 11px; font-weight: 600; margin-bottom: 4px; }
      .uc-confidence.high { color: var(--green-dark); }
      .uc-confidence.moderate { color: #D97706; }
      .uc-confidence.low { color: #DC2626; }
      .uc-note { font-size: 12px; color: var(--gray-400); }

      /* Comparison */
      .comparison { padding: 48px 0; background: #fff; }
      .device-selectors { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
      .selector-group { text-align: center; }
      .selector-group label { display: block; font-size: 12px; font-weight: 600; color: var(--gray-400); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
      .selector-wrap select { padding: 10px 16px; border-radius: var(--radius-sm); border: 2px solid var(--gray-200); font-family: inherit; font-size: 15px; font-weight: 600; background: var(--gray-50); color: var(--dark); cursor: pointer; min-width: 140px; appearance: auto; }
      .selector-wrap select:focus { outline: none; border-color: var(--green); }
      .vs-badge { width: 40px; height: 40px; border-radius: 50%; background: var(--dark); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 16px; }

      /* Device Summary Row */
      .device-summary-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
      .device-summary-card { padding: 16px; border-radius: var(--radius-sm); background: var(--gray-50); border: 2px solid var(--gray-200); text-align: center; }
      .device-summary-card .ds-icon { width: 40px; height: 40px; margin: 0 auto 8px; color: var(--accent); }
      .device-summary-card .ds-icon svg { width: 100%; height: 100%; }
      .device-summary-card h3 { font-size: 16px; margin-bottom: 4px; }
      .ds-best-for { font-size: 12px; color: var(--gray-600); margin-bottom: 4px; }
      .ds-sub { font-size: 11px; color: var(--gray-400); }

      /* Metric Tabs */
      .metric-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 20px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
      .metric-tabs::-webkit-scrollbar { display: none; }
      .metric-tab { padding: 8px 14px; border-radius: 100px; border: 1.5px solid var(--gray-200); background: #fff; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--gray-600); cursor: pointer; white-space: nowrap; transition: all 0.2s; }
      .metric-tab:hover { border-color: var(--gray-300); color: var(--dark); }
      .metric-tab.active { background: var(--dark); color: #fff; border-color: var(--dark); }

      /* Metric Detail */
      .metric-detail { background: var(--gray-50); border-radius: var(--radius); padding: 24px; border: 1px solid var(--gray-200); }
      .md-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
      .md-header h3 { font-size: 20px; }
      .md-gold { font-size: 12px; color: var(--gray-400); background: var(--gray-100); padding: 4px 10px; border-radius: 6px; }
      .md-desc { font-size: 14px; color: var(--gray-600); margin-bottom: 20px; }

      /* Bars */
      .md-bars { display: flex; flex-direction: column; gap: 20px; margin-bottom: 20px; }
      .md-bar-group { }
      .md-bar-label { font-size: 14px; font-weight: 600; margin-bottom: 8px; padding-left: 2px; color: var(--accent); }
      .md-bar-row { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 10px; margin-bottom: 6px; }
      .md-bar-track { height: 28px; background: var(--gray-200); border-radius: 6px; overflow: hidden; min-width: 0; }
      .md-bar-fill { height: 100%; border-radius: 6px; transition: width 0.6s ease; min-width: 8px; }
      .md-bar-fill.biased { opacity: 0.55; background-image: repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px) !important; }
      .md-bar-value { font-size: 13px; font-weight: 700; white-space: nowrap; min-width: 70px; text-align: right; }
      .md-bar-study { font-size: 11px; color: var(--gray-400); white-space: nowrap; min-width: 90px; }
      .md-bar-study.biased-text { color: #D97706; }
      .md-no-data { padding: 12px 16px; background: var(--gray-100); border-radius: 8px; font-size: 13px; color: var(--gray-400); font-style: italic; }

      .md-insight { display: flex; gap: 10px; padding: 14px 16px; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: var(--radius-sm); }
      .md-insight-icon { flex-shrink: 0; color: #D97706; margin-top: 2px; }
      .md-insight p { font-size: 13px; color: #92400E; line-height: 1.6; }

      /* Deep Dives */
      .deep-dives { padding: 48px 0; }
      .dd-grid { display: flex; flex-direction: column; gap: 12px; }
      .dd-card { background: #fff; border-radius: var(--radius); border: 1.5px solid var(--gray-200); overflow: hidden; transition: box-shadow 0.2s; }
      .dd-card:hover { box-shadow: var(--shadow); }
      .dd-header { display: flex; align-items: center; gap: 12px; padding: 16px; cursor: pointer; }
      .dd-icon { width: 36px; height: 36px; flex-shrink: 0; color: var(--accent); }
      .dd-icon svg { width: 100%; height: 100%; }
      .dd-info { flex: 1; min-width: 0; }
      .dd-info h3 { font-size: 16px; margin-bottom: 2px; }
      .dd-bestfor { font-size: 12px; color: var(--gray-400); }
      .dd-toggle { flex-shrink: 0; color: var(--gray-400); transition: transform 0.3s; }
      .dd-card.expanded .dd-toggle { transform: rotate(180deg); }
      .dd-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding 0.35s ease; padding: 0 16px; }
      .dd-card.expanded .dd-body { max-height: 600px; padding: 0 16px 16px; }
      .dd-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 12px; }
      .dd-col h4 { font-size: 13px; color: var(--gray-600); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
      .dd-col ul { list-style: none; }
      .dd-col li { font-size: 13px; margin-bottom: 4px; display: flex; align-items: flex-start; gap: 6px; }
      .dd-check { color: var(--green); font-weight: 700; }
      .dd-x { color: #EF4444; font-weight: 700; }
      .dd-sub { font-size: 12px; color: var(--gray-400); margin-bottom: 8px; }
      .dd-research-note { font-size: 12px; color: #92400E; background: #FFFBEB; padding: 10px 12px; border-radius: 8px; border: 1px solid #FDE68A; line-height: 1.5; }

      /* Studies */
      .studies { padding: 48px 0; background: #fff; }
      .study-list { display: flex; flex-direction: column; gap: 10px; }
      .study-card { padding: 16px; border-radius: var(--radius-sm); background: var(--gray-50); border: 1px solid var(--gray-200); }
      .study-card.industry-funded { border-left: 3px solid #F59E0B; }
      .study-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; margin-bottom: 6px; }
      .study-badge.independent { background: #DCFCE7; color: #166534; }
      .study-badge.funded { background: #FEF3C7; color: #92400E; }
      .study-authors { font-size: 13px; font-weight: 600; color: var(--dark); }
      .study-title { font-size: 13px; color: var(--gray-600); margin: 2px 0; line-height: 1.5; }
      .study-journal { font-size: 12px; color: var(--gray-400); }
      .study-doi { font-size: 11px; color: var(--gray-400); word-break: break-all; }
      .study-funding { font-size: 11px; color: #D97706; margin-top: 4px; font-weight: 500; }

      /* Caveats */
      .caveats { padding: 48px 0; }
      .caveat-box { background: linear-gradient(135deg, #1E293B, #334155); border-radius: var(--radius); padding: 32px 24px; color: #fff; }
      .caveat-box h2 { font-size: 22px; margin-bottom: 20px; text-align: center; }
      .caveat-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
      .caveat-item { font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.85); padding: 12px 16px; background: rgba(255,255,255,0.06); border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.08); }
      .caveat-item strong { color: #fff; }

      /* CTA */
      .cta-section { padding: 48px 0; }
      .cta-box { text-align: center; padding: 40px 24px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: var(--radius); border: 1px solid #BBF7D0; }
      .cta-logo { width: 48px; height: 48px; border-radius: 12px; margin-bottom: 16px; }
      .cta-box h2 { font-size: 24px; margin-bottom: 8px; }
      .cta-box p { font-size: 15px; color: var(--gray-600); margin-bottom: 20px; max-width: 400px; margin-left: auto; margin-right: auto; }
      .cta-btn { display: inline-block; padding: 14px 32px; border-radius: 100px; background: var(--green); color: #fff; font-family: inherit; font-size: 15px; font-weight: 600; text-decoration: none; transition: background 0.2s, transform 0.1s; }
      .cta-btn:hover { background: var(--green-dark); }
      .cta-btn:active { transform: scale(0.97); }

      /* Footer */
      .tool-footer { padding: 32px 0; text-align: center; border-top: 1px solid var(--gray-200); }
      .tool-footer p { font-size: 12px; color: var(--gray-400); margin-bottom: 4px; line-height: 1.6; }

      /* ── Tablet ── */
      @media (min-width: 640px) {
        .hero h1 { font-size: 42px; }
        .hero-sub { font-size: 17px; }
        .use-case-grid { grid-template-columns: repeat(4, 1fr); }
        .caveat-grid { grid-template-columns: 1fr 1fr; }
        .section-title { font-size: 30px; }
      }

      /* ── Desktop ── */
      @media (min-width: 1024px) {
        .hero { padding: 72px 0 56px; }
        .hero h1 { font-size: 48px; }
        .use-cases, .comparison, .deep-dives, .studies, .caveats, .cta-section { padding: 64px 0; }
        .dd-cols { grid-template-columns: 1fr 1fr; }
        .md-bar-row { grid-template-columns: 1fr 80px 140px; }
      }
    `;
  }

  // ── Events ────────────────────────────────────────────────────────────

  _setupEvents() {
    const shadow = this.shadowRoot;

    // Device selectors
    shadow.addEventListener('change', (e) => {
      if (e.target.id === 'device1') {
        this._selectedDevices[0] = e.target.value;
        this.render();
        this._setupEvents();
        this._setupAnimations();
      }
      if (e.target.id === 'device2') {
        this._selectedDevices[1] = e.target.value;
        this.render();
        this._setupEvents();
        this._setupAnimations();
      }
    });

    // Metric tabs
    shadow.addEventListener('click', (e) => {
      const tab = e.target.closest('.metric-tab');
      if (tab) {
        this._activeMetric = tab.dataset.metric;
        this.render();
        this._setupEvents();
        this._setupAnimations();
        // Scroll back to comparison
        const section = this.shadowRoot.getElementById('compare');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Deep dive toggle
      const ddHeader = e.target.closest('.dd-header');
      if (ddHeader) {
        const card = ddHeader.closest('.dd-card');
        const key = card.dataset.device;
        this._expandedDevice = this._expandedDevice === key ? null : key;
        // Just toggle class instead of full re-render
        this.shadowRoot.querySelectorAll('.dd-card').forEach(c => {
          c.classList.toggle('expanded', c.dataset.device === this._expandedDevice);
        });
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
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
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
      'description': 'Compare accuracy of popular wearable devices (Oura Ring, Apple Watch, Garmin, WHOOP, Fitbit, Samsung) across sleep, HRV, heart rate, SpO2, steps, and more. Data sourced from 17+ peer-reviewed studies.',
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygohealth.com' },
      'about': {
        '@type': 'MedicalScholarlyArticle',
        'name': 'Wearable Device Accuracy Research Summary',
        'description': 'Comparative analysis of wearable accuracy across 12 health metrics based on peer-reviewed research with full bias disclosure.'
      }
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-kygo-wearable-ld', '');
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }
}

customElements.define('kygo-wearable-accuracy', KygoWearableAccuracy);
