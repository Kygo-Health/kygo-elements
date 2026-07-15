/**
 * Kygo Health · Most Accurate Sleep Tracker Comparison Tool
 * Tag name: kygo-sleep-tracker-accuracy
 * Which consumer wearable is most accurate for sleep vs the lab gold standard (PSG)?
 * Ranks 7 devices on 4-stage staging (healthy vs clinical), deep- and REM-stage
 * detection, sleep/wake agreement, and total-sleep-time bias, with the population
 * caveat (healthy vs clinical) that decides every number.
 * Data: Sleep-Tracker-Accuracy research v2.8 (Schyvens 2025, Lee 2023, Robbins 2024,
 * Miller 2022, Khan 2025, Searles 2026, Haghayegh 2019, Dial 2025, npj EEG meta 2025).
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

class KygoSleepTrackerAccuracy extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._selected = null; // Set of device ids chosen in the comparator
  }

  connectedCallback() {
    if (!this._selected) {
      // Default to the top three by healthy-adult staging (Oura, Apple, Fitbit Sense)
      this._selected = new Set(this._devices.slice(0, 3).map(d => this._did(d)));
    }
    this.render();
    this._setupAnimations();
    this._wire();
    this._injectStructuredData();
    __seo(this, this._seoText());
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Interactivity: one delegated listener on the shadow root so it
  //    survives the innerHTML swap of the comparator result region ─────────
  _wire() {
    if (this._wired) return;
    this._wired = true;
    this.shadowRoot.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-cmpr-id]');
      if (chip) { this._toggleDevice(chip.getAttribute('data-cmpr-id')); return; }
      const tgl = e.target.closest('[data-src-toggle]');
      if (tgl) { this._toggleSources(); return; }
    });
  }

  _toggleDevice(id) {
    const sel = this._selected;
    if (sel.has(id)) { if (sel.size > 2) sel.delete(id); }      // keep a minimum of 2
    else { if (sel.size < 4) sel.add(id); }                     // cap at 4
    const root = this.shadowRoot;
    root.querySelectorAll('[data-cmpr-id]').forEach(c => {
      const on = sel.has(c.getAttribute('data-cmpr-id'));
      c.classList.toggle('active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const out = root.querySelector('[data-cmpr-out]');
    if (out) out.innerHTML = this._renderCmprResult();
  }

  _toggleSources() {
    const root = this.shadowRoot;
    const extra = root.querySelector('[data-src-extra]');
    const btn = root.querySelector('[data-src-toggle]');
    const lbl = root.querySelector('[data-src-toggle-label]');
    if (!extra) return;
    if (extra.hasAttribute('hidden')) {
      extra.removeAttribute('hidden');
      if (btn) btn.classList.add('open');
      if (lbl) lbl.textContent = 'Show fewer sources';
    } else {
      extra.setAttribute('hidden', '');
      if (btn) btn.classList.remove('open');
      if (lbl) lbl.textContent = 'Show all ' + this._sources.length + ' sources';
    }
  }

  // ── Brand product images (shared Wix assets, by device key) ─────────────

  _deviceImage(key) {
    return ({
      garmin:  'https://static.wixstatic.com/media/273a63_c545c093c04d4ca4ade77e5ca43fd433~mv2.png',
      apple:   'https://static.wixstatic.com/media/273a63_68b4900c356b4d0c8982e5ecd10f04fe~mv2.png',
      fitbit:  'https://static.wixstatic.com/media/273a63_c12bab319dc34737a386c7449f5f92c7~mv2.png',
      whoop:   'https://static.wixstatic.com/media/273a63_c52aaaca1f7243f3818cf51d9374dbd4~mv2.png',
      oura:    'https://static.wixstatic.com/media/273a63_722e50e1a554453eb4c71a2e7a58925d~mv2.png'
    })[key] || null;
  }

  _deviceLogo(d, size) {
    const img = this._deviceImage(d.key);
    const cls = size === 'sm' ? 'brand-img sm' : 'brand-img';
    return img
      ? `<span class="${cls}"><img src="${img}" alt="${d.name}" loading="lazy" /></span>`
      : `<span class="${cls} brand-img--icon">${this._typeIcon(d.type)}</span>`;
  }

  // ── Device data (every wearable vs PSG, ranked by healthy 4-stage kappa) ──

  get _devices() {
    return [
      {
        key: 'oura', name: 'Oura Ring Gen 3', short: 'Oura Ring', type: 'ring', typeLabel: 'Ring',
        method: 'Ring PPG + skin temperature; overnight autonomic + movement staging.',
        kHealthy: 0.65, kHealthyStr: '0.65', kHealthyFunded: true,
        kClinicalStr: '0.35', kClinicalNote: '53% acc (Herberger)',
        deepH: 79.5, deepC: 77.8, remH: 76.0, remC: 71.2,
        sw: '89%', swNote: 'Gen 2 · Miller 2022',
        tstVal: -3.0, tst: '−3.0 min', tstNote: 'Khan meta (pooled)',
        independent: 'Independently tested only in clinical patients: kappa 0.35 (Lee 2023) and 53% accuracy (Herberger 2025). The strong 0.65 healthy figure is from Oura\'s own funded study (Robbins 2024), a rigorous method but a screened, best-case sample.',
        vendorClaim: 'OSSA 2.0 staging accuracy 75.5–90.6%; sleep/wake sensitivity ~94% (Svensson 2024, Oura-linked). Reports raw % / PABAK, not kappa, so its figures inflate and aren\'t directly comparable.',
        bestFor: 'Total sleep time and deep/REM detection; the vitals measured while you sleep',
        weakestFor: 'Wake detection and sleep-disorder patients (0.65 → 0.35)',
        affiliateUrl: 'https://www.amazon.com/s?k=Oura%20Ring&tag=kygohealthapp-20', trackLabel: 'oura-ring-search'
      },
      {
        key: 'apple', name: 'Apple Watch S8', short: 'Apple Watch', type: 'watch', typeLabel: 'Watch',
        method: 'Watch accelerometer + PPG; wrist-based stage classification.',
        kHealthy: 0.53, kHealthyStr: '0.53', kHealthyFunded: false, kHealthyNote: '0.60 (Robbins)',
        kClinicalStr: '0.30', kClinicalNote: null,
        deepH: 50.7, deepC: 41.3, remH: 68.6, remC: 42.8,
        sw: '88%', swNote: 'Series 6 · Miller 2022',
        tstVal: 19.6, tst: '+19.6 min', tstNote: 'Schyvens',
        independent: 'The best independently-tested staging watch: kappa 0.53 in healthy adults (Schyvens 2025), dropping to 0.30 in a sleep-apnea sample (Lee 2023). It posts the strongest independent-healthy REM detection (68.6%), but that nearly halves in patients (42.8%).',
        vendorClaim: 'Apple white paper (Sept 2023): ~1,400 nights, kappa 0.63, sensitivity 97.8% / specificity 76%. Its FDA-cleared apnea notifications (Sept 2024) show weighted sensitivity 66.3% (severe-OSA 89.1% but moderate-OSA only 43%).',
        bestFor: 'Independently-validated staging; REM detection in healthy sleepers',
        weakestFor: 'REM accuracy halves in apnea patients; over-reports sleep (+19.6 min)',
        affiliateUrl: 'https://www.amazon.com/s?k=Apple%20Watch&rh=p_123%3A110955&tag=kygohealthapp-20', trackLabel: 'apple-watch-search'
      },
      {
        key: 'fitbit', name: 'Fitbit Sense / Sense 2', short: 'Fitbit', type: 'watch', typeLabel: 'Watch',
        method: 'Wrist PPG + motion; Fitbit Sleep Stages algorithm.',
        kHealthy: 0.42, kHealthyStr: '0.42', kHealthyFunded: false, kHealthyNote: '0.55 (Robbins)',
        kClinicalStr: '0.42', kClinicalNote: null,
        deepH: 50.9, deepC: 67.1, remH: 61.3, remC: 68.1,
        sw: '81–91%', swNote: 'Haghayegh 2019 meta',
        tstVal: 6.3, tst: '+6.3 min', tstNote: 'Schyvens (Sense)',
        independent: 'The most population-robust device tested: kappa 0.42 in both healthy adults (Schyvens 2025) and clinical patients (Lee 2023), the only wearable that doesn\'t collapse between the two. Per-stage detection actually improves in patients (deep 67.1%, REM 68.1%).',
        vendorClaim: 'Google/Fitbit (2026, in press) report an updated algorithm at kappa 0.63 (up from 0.56) and 77% accuracy (up from 71%). Not yet independently validated.',
        bestFor: 'Holding up across populations (healthy and clinical alike); small TST bias',
        weakestFor: 'Middling deep/REM detection in healthy adults; still misses wake',
        affiliateUrl: 'https://www.amazon.com/s?k=Fitbit%3A&rh=p_123%3A213215&tag=kygohealthapp-20', trackLabel: 'fitbit-search'
      },
      {
        key: 'fitbit', name: 'Fitbit Charge 5', short: 'Fitbit', type: 'band', typeLabel: 'Band',
        method: 'Wrist band; optical PPG + motion, Sleep Stages algorithm.',
        kHealthy: 0.41, kHealthyStr: '0.41', kHealthyFunded: false,
        kClinicalStr: null, kClinicalNote: null,
        deepH: null, deepC: null, remH: null, remC: null,
        sw: null, swNote: null,
        tstVal: 11.1, tst: '+11.1 min', tstNote: 'Schyvens',
        independent: 'Independent healthy staging kappa 0.41 (Schyvens 2025) with a modest total-sleep-time bias of +11.1 min. Per-stage detection for this band wasn\'t broken out separately, so treat it as roughly Fitbit-class.',
        vendorClaim: 'Covered by the same Google/Fitbit algorithm update (kappa 0.63, 77% accuracy, 2026 in press) as the Sense line; independent validation still pending.',
        bestFor: 'A low-cost band with a decent total-sleep-time bias',
        weakestFor: 'Limited independent per-stage data; shares the wake-detection weakness',
        affiliateUrl: 'https://www.amazon.com/s?k=Fitbit%3A&rh=p_123%3A213215&tag=kygohealthapp-20', trackLabel: 'fitbit-search'
      },
      {
        key: 'whoop', name: 'WHOOP 4.0', short: 'WHOOP', type: 'strap', typeLabel: 'Strap',
        method: 'Screenless arm strap; PPG + motion, worn 24/7.',
        kHealthy: 0.37, kHealthyStr: '0.37', kHealthyFunded: false,
        kClinicalStr: null, kClinicalNote: null,
        deepH: 69.6, deepC: null, remH: 62.0, remC: null,
        sw: '86%', swNote: 'WHOOP 3.0 · Miller 2022',
        tstVal: 24.5, tst: '+24.5 min', tstNote: 'Schyvens',
        independent: 'Independent healthy staging kappa 0.37 (Schyvens 2025), but the best independent-healthy deep-sleep detection of any device tested (69.6%). No independent clinical data exists for WHOOP.',
        vendorClaim: 'WHOOP cites internal validation; note its research lab (Miller / CQU) is WHOOP-affiliated. Beyond Schyvens (0.37), no independent 4-stage kappa is published for WHOOP 4.0.',
        bestFor: 'The strongest independent-healthy deep-sleep detection (69.6%)',
        weakestFor: 'No clinical data; over-reports total sleep time (+24.5 min)',
        affiliateUrl: 'https://www.amazon.com/s?k=whoop%20fitness%20tracker&tag=kygohealthapp-20', trackLabel: 'whoop-search'
      },
      {
        key: 'withings', name: 'Withings ScanWatch', short: 'Withings', type: 'watch', typeLabel: 'Watch',
        method: 'Hybrid analog watch; wrist PPG + accelerometer.',
        kHealthy: 0.22, kHealthyStr: '0.22', kHealthyFunded: false,
        kClinicalStr: null, kClinicalNote: null,
        deepH: null, deepC: null, remH: null, remC: null,
        sw: null, swNote: null,
        tstVal: 39.9, tst: '+39.9 min', tstNote: 'Schyvens',
        independent: 'Independent healthy staging kappa 0.22 (Schyvens 2025), near the bottom of the wrist devices, paired with the largest total-sleep-time bias of any device tested (+39.9 min, well past the ±30 min acceptable line).',
        vendorClaim: 'No manufacturer 4-stage staging-accuracy figure is published. The ScanWatch\'s validated strengths are ECG / afib and SpO2 detection, not sleep staging.',
        bestFor: 'ECG and clinical-grade heart features (not sleep staging)',
        weakestFor: 'Weakest staging among watches; largest TST over-report (+39.9 min)',
        affiliateUrl: null, trackLabel: 'withings-search'
      },
      {
        key: 'garmin', name: 'Garmin Vivosmart 4', short: 'Garmin', type: 'band', typeLabel: 'Band',
        method: 'Wrist band; optical heart rate + motion (Firstbeat).',
        kHealthy: 0.21, kHealthyStr: '0.21', kHealthyFunded: false,
        kClinicalStr: null, kClinicalNote: null,
        deepH: 47.5, deepC: null, remH: 33.1, remC: null,
        sw: '89%', swNote: 'Forerunner 245 · Miller 2022',
        tstVal: 38.4, tst: '+38.4 min', tstNote: 'Schyvens',
        independent: 'Independent healthy staging kappa 0.21 (Schyvens 2025), the weakest of the wrist devices, and the weakest REM detection tested (33.1%). It does hold up on the easy sleep/wake question (89%), but over-reports total sleep time by +38.4 min.',
        vendorClaim: 'No manufacturer 4-stage staging-accuracy figure is published. Garmin\'s sleep staging uses the Firstbeat engine; independent testing puts its 4-stage kappa at 0.21.',
        bestFor: 'Solid sleep/wake (asleep-vs-awake) agreement (89%)',
        weakestFor: 'Weakest REM (33.1%) and staging (0.21); large TST over-report',
        affiliateUrl: 'https://www.amazon.com/s?k=garmin%20fitness%20tracker&tag=kygohealthapp-20', trackLabel: 'garmin-search'
      }
    ];
  }

  // ── Fixed facts (true regardless of device) ─────────────────────────────

  get _facts() {
    return [
      { icon: 'alert', tone: 'dark', tag: 'Universal', title: 'No device reliably measures wake',
        body: 'Every wearable has high sleep sensitivity (89–95%) but low wake specificity (27–52%). They all overestimate sleep and underestimate time awake (WASO) by 12–48 min. No wrist or ring reliably tells you how long you were actually awake.',
        src: 'Schyvens 2025 · Haghayegh 2019' },
      { icon: 'user', tone: 'mid', tag: 'Age effect', title: 'Accuracy drops sharply with age',
        body: 'In older adults, total sleep time is underestimated by roughly 75 min and deep-sleep error explodes (MAPE 400–700%) on both the Fitbit Sense 2 and the Oura Gen 3. Numbers from young cohorts do not generalize.',
        src: 'Searles 2026' },
      { icon: 'brain', tone: 'good', tag: 'Better tier', title: 'EEG headbands beat every ring & watch',
        body: 'Muse-S and ear-EEG headbands reach kappa ~0.76, above any consumer ring or watch and matching human scorers. If you need genuine staging accuracy, that is the class to look at, not a wrist device.',
        src: 'npj Biomedical Innovations 2025 meta' },
      { icon: 'layers', tone: 'mid', tag: 'Form factor', title: 'Rings win vitals, watches win stages',
        body: 'Rings (Oura) lead the vitals measured during sleep: HRV (CCC 0.99), resting HR (CCC 0.98), temperature. Watches (Apple) tend to win the stage labels. Both share the same wake-detection weakness.',
        src: 'Dial 2025' },
      { icon: 'clock', tone: 'dark', tag: 'Coverage gap', title: 'The newest models are unvalidated',
        body: 'Every independent staging study tested a prior generation. Oura Ring 4/5, WHOOP 5/MG, Apple S9/S10/Ultra, Galaxy Watch/Ring and Pixel carry manufacturer-only claims, because peer review lags hardware by 18–36 months.',
        src: 'Validation coverage gap, 2026' }
    ];
  }

  // ── Sources (compact link list) ─────────────────────────────────────────

  get _sources() {
    return [
      { tag: 'Independent · 6 wrist devices', title: 'Schyvens et al. 2025: Wrist wearables vs PSG',
        cite: 'Sleep Advances. 2025;6(2):zpaf021. N=62.', url: 'https://doi.org/10.1093/sleepadvances/zpaf021' },
      { tag: 'Independent · clinical', title: 'Lee T et al. 2023: 11 devices in sleep-clinic patients',
        cite: 'JMIR mHealth uHealth. 2023;11:e50983. N=75, mean AHI 18.', url: 'https://doi.org/10.2196/50983' },
      { tag: 'Independent · clinical', title: 'Herberger et al. 2025: Oura Gen 3 + 2 rings vs PSG',
        cite: 'Scientific Reports. 2025;15:9461. N=45 sleep-clinic patients.', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Herberger+2025+Oura+sleep+polysomnography' },
      { tag: 'Independent · meta', title: 'Khan et al. 2025: Oura sleep meta-analysis',
        cite: 'OTO Open. 2025;9:e70181. 6 studies, N=388 (COI: none).', url: 'https://doi.org/10.1002/oto2.70181' },
      { tag: 'Independent · meta', title: 'JCSM wrist-wearable sleep meta (Lee et al.)',
        cite: 'J Clin Sleep Med. 24 studies, N=798.', url: 'https://doi.org/10.5664/jcsm.11460' },
      { tag: 'Independent · 2-state', title: 'Miller et al. 2022: Sleep/wake across 6 devices',
        cite: 'Sensors. 2022;22(16):6317. N=53, PSG.', url: 'https://doi.org/10.3390/s22166317' },
      { tag: 'Independent · Fitbit meta', title: 'Haghayegh et al. 2019: Fitbit sleep-stage meta',
        cite: 'JMIR. 2019;21(11):e16273. PMC6908975 (COI: none).', url: 'https://doi.org/10.2196/16273' },
      { tag: 'Independent · age effect', title: 'Searles et al. 2026: Age & sleep-tracker accuracy',
        cite: 'Sleep Advances. 2026;7(1):zpag006. Fitbit Sense 2 + Oura Gen 3.', url: 'https://doi.org/10.1093/sleepadvances/zpag006' },
      { tag: 'Independent · EEG tier', title: 'npj Biomedical Innovations 2025: Wearable-EEG meta',
        cite: '43 studies. Muse-S / ear-EEG kappa ~0.76.', url: 'https://doi.org/10.1038/s44385-025-00034-w' },
      { tag: 'Independent · vitals', title: 'Dial et al. 2025: Oura Gen 4 HRV / RHR vs ECG',
        cite: 'Physiological Reports. 2025;13:e70527 (AFRL).', url: 'https://doi.org/10.14814/phy2.70527' },
      { tag: 'Oura-funded · healthy', title: 'Robbins et al. 2024: Oura Gen 3 vs PSG',
        cite: 'Sensors. 2024;24(20):6532. Healthy-screened; deep 79.5%, REM 76.0%.', url: 'https://doi.org/10.3390/s24206532' },
      { tag: 'Oura-linked', title: 'Svensson et al. 2024: OSSA 2.0 staging accuracy',
        cite: 'Sleep Medicine. 2024;115:251. Reports raw % / PABAK, not kappa.', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Svensson+2024+Oura+OSSA+sleep+staging' },
      { tag: 'Manufacturer', title: 'Apple Watch sleep-staging white paper (Sept 2023)',
        cite: '~1,400 nights; kappa 0.63; sens 97.8% / spec 76%.', url: 'https://www.apple.com/healthcare/docs/site/Apple_Watch_sleep_staging_white_paper.pdf' },
      { tag: 'Manufacturer · in press', title: 'Google/Fitbit 2026: Updated staging algorithm',
        cite: 'kappa 0.63 (up from 0.56); accuracy 77% (up from 71%).', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Fitbit+sleep+staging+algorithm+2026' }
    ];
  }

  // ── FAQ (also emitted as FAQPage JSON-LD) ────────────────────────────────

  get _faqs() {
    return [
      { q: 'Which wearable is the most accurate for sleep?',
        a: 'Oura leads on sleep staging (Cohen\'s kappa 0.65 in healthy adults, from its own funded study) and on total sleep time (bias about 3 minutes). Apple is the most accurate in independent testing (kappa 0.53). But no consumer device is "accurate" in an absolute sense: the best land at moderate agreement (kappa around 0.5), while two human sleep scorers agree at about 0.75.' },
      { q: 'Are sleep trackers accurate for sleep stages?',
        a: 'Only moderately. A 4-stage agreement of kappa 0.4 to 0.6 is the current ceiling for consumer wearables. Every device overestimates sleep, misses wake, and drops sharply in older adults and in people with sleep disorders. Use the trend over weeks, not a single night\'s stage breakdown.' },
      { q: 'Why do the accuracy numbers drop for people with sleep problems?',
        a: 'It is a population effect, not a study disagreement. Screened healthy sleepers score far higher than real sleep-clinic patients. Oura falls from kappa 0.65 (healthy) to 0.35 (clinical); Apple from 0.53 to 0.30. Apnea-fragmented sleep is simply harder to stage, so every device drops. Fitbit is the most robust, holding kappa 0.42 in both.' },
      { q: 'Can my watch or ring tell how long I was awake?',
        a: 'Not reliably. Every device has high sleep sensitivity (89 to 95%) but low wake specificity (27 to 52%), so they all overestimate sleep and underestimate time awake by 12 to 48 minutes. Wake detection is the universal weakness across every brand.' },
      { q: 'Do rings or watches track sleep better?',
        a: 'They win different things. Rings like Oura win the vitals measured during sleep (heart-rate variability, resting heart rate and temperature) plus total sleep time. Watches like Apple tend to win the actual stage labels (light, deep, REM). Both share the wake-detection weakness.' },
      { q: 'Are the newest models like Oura Ring 4, WHOOP 5 and Apple Series 10 more accurate?',
        a: 'Unknown independently. Every published validation study tested a prior generation, so all current-generation accuracy claims are manufacturer-only. Peer-reviewed validation lags new hardware by roughly 18 to 36 months, so newer does not yet mean proven.' }
    ];
  }

  // ── SEO light-DOM summary ───────────────────────────────────────────────

  _seoText() {
    return 'Most Accurate Sleep Tracker comparison by Kygo Health. Interactive tool: pick 2 to 4 wearables and compare them side by side on six metrics (4-stage staging in healthy and clinical sleepers, deep-sleep detection, REM detection, sleep/wake agreement, total-sleep-time bias), with the best value in each row highlighted. Which wearable is most accurate for sleep versus the lab gold standard, polysomnography (PSG)? No wristband or ring measures sleep; a lab PSG reads brain waves, while a wearable only estimates stages from heart rate, movement and temperature. Two rules decide every number. Rule 1: healthy versus clinical population is the main axis: the same device scores far higher in screened healthy young sleepers than in older adults or real sleep-disorder patients (Oura Gen 3 4-stage agreement kappa 0.65 healthy but 0.35 in sleep-clinic patients; Apple Watch S8 kappa 0.53 healthy to 0.30 in a sleep-apnea population). Rule 2: manufacturer-funded means best-case population, not weaker method (Oura-funded Robbins 2024 used the same in-lab PSG rigor). Grading: a 4-stage kappa of 0.4 to 0.6 is "moderate," the current consumer ceiling; human PSG scorers agree at about 0.75, so no consumer device is accurate in an absolute sense. 4-STAGE SLEEP STAGING (Cohen\'s kappa, healthy adults): Oura Ring Gen 3 0.65 (Robbins), Apple Watch S8 0.53 (Schyvens), Fitbit Sense/Sense 2 0.42 (Schyvens), Fitbit Charge 5 0.41, WHOOP 4.0 0.37, Withings ScanWatch 0.22, Garmin Vivosmart 4 0.21. Clinical population: Oura 0.35, Apple 0.30, Fitbit 0.42 (most population-robust). DEEP SLEEP DETECTION sensitivity (healthy): Oura 79.5%, WHOOP 69.6%, Fitbit 50.9%, Apple 50.7%, Garmin 47.5%. REM DETECTION sensitivity (healthy): Oura 76.0%, Apple 68.6%, WHOOP 62.0%, Fitbit 61.3%, Garmin 33.1%. SLEEP/WAKE (2-state) agreement: Oura Gen 2 89%, Garmin 89%, Apple S6 88%, WHOOP 3.0 86%, Fitbit 81 to 91%. TOTAL SLEEP TIME bias: Oura -3.0 min, Fitbit Sense +6.3, Fitbit Charge 5 +11.1, Apple +19.6, WHOOP +24.5, Garmin +38.4, Withings +39.9 (within about plus or minus 30 min is clinically acceptable). Fixed facts: wake detection is universally poor (high sleep sensitivity, low wake specificity 27 to 52%; all overestimate sleep and underestimate WASO by 12 to 48 min); accuracy drops with age (Searles 2026: about 75 min TST underestimate and deep-sleep MAPE 400 to 700% in older adults on Fitbit Sense 2 and Oura Gen 3); EEG headbands (Muse-S, ear-EEG) reach kappa about 0.76, a better tier than any ring or watch; rings win the vitals measured during sleep (HRV CCC 0.99, resting HR CCC 0.98) while watches win stage labels; current-generation flagships (Oura Ring 4/5, WHOOP 5/MG, Apple S9/S10/Ultra, Galaxy Watch/Ring, Pixel) have no independent staging validation. Do not cite fabricated figures such as "Charge 6 84.6%," "Venu 3 85 to 90%," "Fitbit Sense 2 94%," or a "University of Salzburg 2026 ranking" trace to no study. Sources: Schyvens 2025, Lee 2023, Herberger 2025, Khan 2025, JCSM meta, Miller 2022, Haghayegh 2019, Searles 2026, npj EEG meta 2025, Dial 2025, Robbins 2024, Svensson 2024, Apple white paper, Google/Fitbit 2026. Oura vs Apple Watch vs Fitbit vs WHOOP vs Garmin vs Withings sleep tracking accuracy. Data verified July 2026.';
  }

  // ── Icons ───────────────────────────────────────────────────────────────

  _icon(name) {
    const icons = {
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      watch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"/><polyline points="12 10 12 12 13 13"/><path d="m9 4.5.5-2.5h5l.5 2.5"/><path d="m9 19.5.5 2.5h5l.5-2.5"/></svg>',
      ring: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="6"/><path d="M9 4h6l-1.5 4h-3z"/></svg>',
      strap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="8" width="10" height="8" rx="2"/><path d="M7 10H4m16 0h-3M7 14H4m16 0h-3"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/></svg>',
      clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
      alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg>',
      android: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>'
    };
    return `<span class="ico">${icons[name] || icons.info}</span>`;
  }

  _typeIcon(t) { return t === 'ring' ? this._icon('ring') : (t === 'strap' ? this._icon('strap') : this._icon('watch')); }

  // ── Small render helpers ────────────────────────────────────────────────

  // value pill: tone green (good) / grey (mid) / dark (bad)
  _pill(text, tone) { return `<span class="vpill ${tone}">${text}</span>`; }
  _na() { return `<span class="mk off"><span class="dash"></span></span>`; }
  _amazonLink(d, position) {
    if (!d.affiliateUrl) return '';
    return `<a class="amz-link" href="${d.affiliateUrl}" target="_blank" rel="noopener sponsored" data-action="affiliate-click" data-track-label="${d.trackLabel}" data-track-position="${position}">Amazon ${this._icon('arrowRight')}</a>`;
  }

  _kHealthyPill(d) {
    return this._pill(d.kHealthyStr, d.kHealthy >= 0.50 ? 'good' : 'mid');
  }
  _gradePill(d) {
    return d.kHealthy >= 0.40
      ? `<span class="vpill good">Moderate</span>`
      : `<span class="vpill dark">Weak</span>`;
  }

  // ── Interactive comparator (pick 2–4 devices → side-by-side) ────────────

  // stable id + short chip label per device
  _did(d) { return d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  _chip(d) {
    if (d.name.includes('Sense')) return 'Fitbit Sense';
    if (d.name.includes('Charge')) return 'Fitbit Charge 5';
    return d.short;
  }
  // numeric accessors for the comparator rows (null when a device wasn't tested)
  _kcVal(d) { return d.kClinicalStr ? parseFloat(d.kClinicalStr) : null; }
  _swVal(d) { if (!d.sw) return null; const m = d.sw.match(/\d+/g); if (!m) return null; const n = m.map(Number); return n.reduce((a, b) => a + b, 0) / n.length; }
  _cmprVal(d, key) {
    switch (key) {
      case 'kH': return d.kHealthy;
      case 'kC': return this._kcVal(d);
      case 'deep': return d.deepH;
      case 'rem': return d.remH;
      case 'sw': return this._swVal(d);
      case 'tst': return d.tstVal;
    }
    return null;
  }
  _cmprFmt(d, key) {
    switch (key) {
      case 'kH': return d.kHealthyStr;
      case 'kC': return d.kClinicalStr || 'n/a';
      case 'deep': return d.deepH != null ? d.deepH + '%' : 'n/a';
      case 'rem': return d.remH != null ? d.remH + '%' : 'n/a';
      case 'sw': return d.sw || 'n/a';
      case 'tst': return d.tst;
    }
    return 'n/a';
  }
  _cmprRows() {
    return [
      { key: 'kH', label: '4-stage staging', unit: 'κ · healthy adults', better: 'high' },
      { key: 'kC', label: '4-stage staging', unit: 'κ · clinical patients', better: 'high' },
      { key: 'deep', label: 'Deep sleep detection', unit: '% caught vs PSG', better: 'high' },
      { key: 'rem', label: 'REM sleep detection', unit: '% caught vs PSG', better: 'high' },
      { key: 'sw', label: 'Sleep / wake agreement', unit: '2-state %', better: 'high' },
      { key: 'tst', label: 'Total sleep time bias', unit: 'min from PSG', better: 'zero' }
    ];
  }

  _renderComparator() {
    return `
      <div class="cmpr">
        <div class="cmpr-picker-head">
          <span class="cmpr-picker-title">Choose devices to compare</span>
          <span class="cmpr-picker-hint">Tap to add or remove · 2–4 at a time</span>
        </div>
        <div class="picker" role="group" aria-label="Choose sleep trackers to compare">
          ${this._devices.map(d => {
            const id = this._did(d), on = this._selected.has(id);
            return `<button type="button" class="pick-tile${on ? ' active' : ''}" data-cmpr-id="${id}" aria-pressed="${on}">
              <span class="pick-check">${this._icon('check')}</span>
              ${this._deviceLogo(d, 'sm')}
              <span class="pick-name">${this._chip(d)}</span>
            </button>`;
          }).join('')}
        </div>
        <div class="cmpr-out" data-cmpr-out>${this._renderCmprResult()}</div>
      </div>`;
  }

  _renderCmprResult() {
    const sel = this._devices.filter(d => this._selected.has(this._did(d)));
    if (sel.length < 2) {
      return `<div class="cmpr-empty">${this._icon('info')} Pick at least two devices above to see them side by side.</div>`;
    }
    const rows = this._cmprRows();
    const wins = {}; sel.forEach(d => { wins[this._did(d)] = 0; });
    let scored = 0;

    const body = rows.map(r => {
      const vals = sel.map(d => ({ id: this._did(d), v: this._cmprVal(d, r.key) }));
      const valid = vals.filter(x => x.v != null);
      const best = new Set();
      if (valid.length > 1) {
        const metric = x => r.better === 'zero' ? Math.abs(x.v) : x.v;
        const target = r.better === 'zero'
          ? Math.min(...valid.map(metric))
          : Math.max(...valid.map(metric));
        valid.forEach(x => { if (metric(x) === target) best.add(x.id); });
        if (best.size < valid.length) { scored++; best.forEach(id => { wins[id]++; }); }
      }
      const cells = sel.map(d => {
        const id = this._did(d), v = this._cmprVal(d, r.key);
        if (v == null) return `<td>${this._na()}</td>`;
        const isBest = best.has(id) && best.size < valid.length;
        const txt = this._cmprFmt(d, r.key);
        return `<td>${isBest ? `<span class="vpill good">${txt}${this._icon('check')}</span>` : `<span class="vpill mid">${txt}</span>`}</td>`;
      }).join('');
      return `<tr>
        <th scope="row"><span class="cr-metric">${r.label}</span><span class="cr-unit">${r.unit}</span><span class="cr-dir">${r.better === 'zero' ? 'closest to 0 wins' : 'higher wins'}</span></th>
        ${cells}
      </tr>`;
    }).join('');

    const head = `<tr>
      <th class="cr-corner" scope="col">Metric</th>
      ${sel.map(d => `<th scope="col"><span class="cr-dev">${this._deviceLogo(d, 'sm')}<span class="cr-dev-name">${this._chip(d)}</span></span></th>`).join('')}
    </tr>`;

    const entries = Object.entries(wins);
    const max = Math.max(...entries.map(([, w]) => w));
    let verdict;
    if (max === 0) {
      verdict = `These devices are too close to separate on the metrics they share, and every one of them overestimates sleep and struggles to detect wake.`;
    } else {
      const leaders = entries.filter(([, w]) => w === max).map(([id]) => this._chip(sel.find(d => this._did(d) === id)));
      verdict = leaders.length === 1
        ? `<strong>${leaders[0]}</strong> wins the most metrics here (${max} of ${scored}). These are healthy-adult figures; accuracy drops in older adults and sleep-disorder patients, and no device reliably measures wake.`
        : `It's a tie: <strong>${leaders.join('</strong> and <strong>')}</strong> each lead on ${max} of ${scored} metrics. All of them overestimate sleep and can't reliably measure wake.`;
    }

    return `
      <div class="cr-wrap">
        <div class="cr-scroll">
          <table class="cr-table">
            <thead>${head}</thead>
            <tbody>${body}</tbody>
          </table>
        </div>
      </div>
      <div class="cr-verdict">${this._icon('info')}<span>${verdict}</span></div>`;
  }

  // ── Section: headline 4-stage staging matrix (logo chart) ───────────────

  _renderStagingMatrix() {
    const rows = this._devices;
    return `
      <div class="cmp">
        <div class="cmp-scroll">
          <table class="cmp-table">
            <thead>
              <tr>
                <th class="cmp-th-device" scope="col">Wearable</th>
                <th scope="col"><span class="th-full">Healthy adults (κ)</span><span class="th-short" aria-hidden="true">Healthy κ</span></th>
                <th scope="col"><span class="th-full">Clinical patients (κ)</span><span class="th-short" aria-hidden="true">Clinical κ</span></th>
                <th scope="col">Grade</th>
                <th scope="col">Buy</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(d => `
                <tr>
                  <th class="cmp-td-device" scope="row">
                    <span class="brand">
                      ${this._deviceLogo(d, 'sm')}
                      <span class="brand-text"><span class="brand-name">${d.name}</span></span>
                    </span>
                  </th>
                  <td>${this._kHealthyPill(d)}${d.kHealthyFunded ? `<span class="cell-note">Oura-funded</span>` : ''}</td>
                  <td>${d.kClinicalStr ? this._pill(d.kClinicalStr, 'mid') : this._na()}</td>
                  <td>${this._gradePill(d)}</td>
                  <td>${this._amazonLink(d, 'ranking')}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <p class="cmp-legend">${this._icon('info')} Cohen's kappa vs in-lab PSG · <strong>0.4–0.6 = "moderate,"</strong> the consumer ceiling · human sleep scorers agree at ~0.75 · <span class="lg-good">green</span> ≥ 0.50. Ranked by healthy-adult agreement.</p>
      </div>`;
  }

  // ── Section: per-device detail accordion ────────────────────────────────

  _renderDeviceDetails() {
    return `<div class="dev-acc">${this._devices.map(d => {
      const metrics = [];
      metrics.push(`
        <div class="dmetric">
          <span class="dm-lbl">4-stage staging (κ)</span>
          <div class="dm-vals">
            <span class="dm-tag">Healthy</span> ${this._kHealthyPill(d)}
            <span class="dm-tag">Clinical</span> ${d.kClinicalStr ? this._pill(d.kClinicalStr, 'mid') : `<span class="dm-none">not tested</span>`}
          </div>
          ${d.kHealthyFunded ? `<span class="dm-note">healthy figure is Oura-funded (Robbins)</span>` : (d.kHealthyNote ? `<span class="dm-note">also ${d.kHealthyNote}</span>` : '')}
        </div>`);
      if (d.deepH != null || d.remH != null) {
        metrics.push(`
          <div class="dmetric">
            <span class="dm-lbl">Deep &amp; REM detection</span>
            <div class="dm-vals">
              <span class="dm-tag">Deep</span> ${d.deepH != null ? this._pill(d.deepH + '%', d.deepH >= 65 ? 'good' : 'mid') : `<span class="dm-none">n/a</span>`}
              <span class="dm-tag">REM</span> ${d.remH != null ? this._pill(d.remH + '%', d.remH >= 65 ? 'good' : 'mid') : `<span class="dm-none">n/a</span>`}
            </div>
            ${(d.deepC != null || d.remC != null) ? `<span class="dm-note">clinical: deep ${d.deepC != null ? d.deepC + '%' : 'n/a'} · REM ${d.remC != null ? d.remC + '%' : 'n/a'}</span>` : ''}
          </div>`);
      }
      metrics.push(`
        <div class="dmetric">
          <span class="dm-lbl">Sleep / wake &amp; timing</span>
          <div class="dm-vals">
            <span class="dm-tag">2-state</span> ${d.sw ? this._pill(d.sw, 'good') : `<span class="dm-none">n/a</span>`}
            <span class="dm-tag">TST bias</span> ${this._pill(d.tst, Math.abs(d.tstVal) <= 30 ? 'good' : 'dark')}
          </div>
          ${d.swNote ? `<span class="dm-note">2-state: ${d.swNote} · TST: ${d.tstNote}</span>` : `<span class="dm-note">TST: ${d.tstNote}</span>`}
        </div>`);
      return `
      <details class="dacc${d.kHealthy >= 0.50 ? ' is-validated' : ''}">
        <summary>
          ${this._deviceLogo(d, 'sm')}
          <span class="dacc-id">
            <span class="dacc-name">${d.name}</span>
            <span class="dacc-sub"><span class="vpill ${d.kHealthy >= 0.40 ? 'good' : 'dark'}">κ ${d.kHealthyStr}</span></span>
          </span>
          <span class="dacc-chev">${this._icon('arrowRight')}</span>
        </summary>
        <div class="dacc-body">
          <div class="dev-finding">
            <span class="dev-label">Independent finding vs lab PSG</span>
            <p>${d.independent}</p>
          </div>
          <div class="dmetrics">${metrics.join('')}</div>
          <div class="dev-finding alt">
            <span class="dev-label">Manufacturer claim</span>
            <p>${d.vendorClaim}</p>
          </div>
          <ul class="dev-facts">
            <li><span class="fct-ico">${this._icon('moon')}</span><span><strong>How it tracks</strong> ${d.method}</span></li>
            <li><span class="fct-ico ok">${this._icon('check')}</span><span><strong>Best for</strong> ${d.bestFor}</span></li>
            <li><span class="fct-ico">${this._icon('minus')}</span><span><strong>Weakest for</strong> ${d.weakestFor}</span></li>
          </ul>
          ${d.affiliateUrl
            ? `<a href="${d.affiliateUrl}" class="dev-amazon" target="_blank" rel="noopener sponsored" data-action="affiliate-click" data-track-label="${d.trackLabel}" data-track-position="device-card">View ${d.short} on Amazon ${this._icon('arrowRight')}</a>`
            : ''}
        </div>
      </details>`;
    }).join('')}</div>`;
  }

  // ── Section: fixed-fact cards ────────────────────────────────────────────

  _renderFactCards() {
    return `<div class="sig-grid">${this._facts.map(f => `
      <article class="sig-card">
        <div class="sig-top">
          <span class="fact-ico tone-${f.tone}">${this._icon(f.icon)}</span>
          <span class="sig-rank">${f.tag}</span>
        </div>
        <h4 class="sig-name">${f.title}</h4>
        <p class="sig-find">${f.body}</p>
        <span class="sig-src">${f.src}</span>
      </article>`).join('')}</div>`;
  }

  // ── Section: sources (compact link list) ────────────────────────────────

  _renderSourceCards(list) {
    return list.map(s => `
      <a class="src" href="${s.url}" target="_blank" rel="noopener nofollow" data-action="source-link" data-track-label="${s.title}" data-track-position="sources">
        <span class="src-tag">${s.tag}</span>
        <span class="src-title">${s.title}</span>
        <span class="src-cite">${s.cite} <span class="src-go">${this._icon('externalLink')}</span></span>
      </a>`).join('');
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
    const googleHealthImg = 'https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png';
    const appleImg = 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png';
    const garminImg = 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png';
    const healthConnectImg = 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" loading="lazy" />
            <span>Kygo Health</span>
          </a>
          <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" class="nav-cta-link cta-primary" data-track-label="subnav-get-app" data-track-position="subnav" target="_blank" rel="noopener">
            Get Kygo Health ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill"><span class="dot"></span> 7 WEARABLES · PSG-VALIDATED ACCURACY</div>
              <h1>Which sleep tracker is <span class="hl">actually accurate?</span></h1>
              <p class="hero-lede">No wristband or ring <strong>measures</strong> your sleep. A lab PSG reads your brain waves; a wearable only <strong>estimates</strong> stages from heart rate, movement and temperature. Here's how 7 devices really stack up against the lab.</p>
            </div>
            <div class="hero-vis" aria-hidden="true">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> Same ring, two populations</span>
                <span class="hero-vis-tag">population &gt; brand</span>
              </div>
              <div class="hv-two">
                <div class="hv-col">
                  <span class="hv-label">Healthy adults</span>
                  <span class="hv-val good">0.65</span>
                  <div class="hv-bar"><span class="hv-fill good" style="width:87%"></span></div>
                  <span class="hv-cap good">Best case</span>
                </div>
                <div class="hv-col">
                  <span class="hv-label">Clinical patients</span>
                  <span class="hv-val">0.35</span>
                  <div class="hv-bar"><span class="hv-fill" style="width:47%"></span></div>
                  <span class="hv-cap">Real users</span>
                </div>
              </div>
              <span class="hv-foot">Cohen's kappa · Oura Ring Gen 3 · one device, two samples</span>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">0.65</div><div class="lbl">Best 4-stage agreement (Oura, healthy)</div></div>
            <div class="hero-stat"><div class="num">0.75</div><div class="lbl">Where human sleep scorers agree</div></div>
            <div class="hero-stat"><div class="num">0</div><div class="lbl">Devices that reliably measure wake</div></div>
            <div class="hero-stat"><div class="num">7</div><div class="lbl">Wearables compared vs lab PSG</div></div>
          </div>
        </div>
      </section>

      <section class="section bg-light" id="compare">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Build your comparison</div>
            <h2>Compare sleep trackers <span class="hl">head-to-head.</span></h2>
            <p class="lede">Pick 2–4 devices and see them side by side on the six metrics that matter: staging in healthy <em>and</em> clinical sleepers, deep &amp; REM detection, sleep/wake, and total-sleep-time bias. The best value in each row is highlighted.</p>
          </div>
          <div class="animate-on-scroll">${this._renderComparator()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="kygo-cta-card animate-on-scroll">
            <div class="cta-pill"><span class="dot"></span> Free Forever Plan</div>
            <h3>See what your <span>sleep data</span> is really telling you.</h3>
            <p>Your tracker estimates your stages. Kygo connects your sleep, nutrition and recovery so you can act on the trend, not chase a single night's number.</p>
            <div class="cta-btn-row">
              <a class="btn btn-primary btn-lg cta-primary" href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" target="_blank" rel="noopener" data-track-position="early" data-track-label="sleep-accuracy-early-ios">${this._icon('apple')} Try Free for 7 Days</a>
              <a class="btn btn-primary btn-lg cta-android" href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" target="_blank" rel="noopener" data-action="android-download" data-track-position="early" data-track-label="sleep-accuracy-early-android">${this._icon('android')} Download for Android</a>
            </div>
            <p style="position:relative;margin:16px 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.72);text-align:center;">7-day free trial on yearly. Free plan available. Cancel anytime.</p>
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

      <kygo-inline-subscribe source="tool-sleep-tracker-accuracy" variant="comparison"></kygo-inline-subscribe>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The full ranking</div>
            <h2>All seven, ranked on <span class="hl">the headline metric.</span></h2>
            <p class="lede">Sleep staging (light / deep / REM / wake) is the hard task and the number people quote. Here's every device ranked by healthy-adult agreement, with how it holds up in clinical patients. Scroll sideways on mobile.</p>
          </div>
          <div class="animate-on-scroll">${this._renderStagingMatrix()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Read this before you trust a number</div>
            <h2>The one thing that <span class="hl">decides accuracy.</span></h2>
            <p class="lede">Who's wearing it matters more than which brand it is. The <strong>same device</strong> scores far higher in screened healthy sleepers than in older adults or real sleep-clinic patients, which is why the comparison above splits staging into healthy vs clinical.</p>
          </div>
          <div class="bias animate-on-scroll">
            <div class="bias-card good">
              <span class="bias-tag">${this._icon('check')} Screened healthy adults</span>
              <span class="bias-stat">κ 0.65 <small>best case</small></span>
              <span class="bias-cap">Ceiling numbers live here</span>
              <p>Young, health-screened sleepers. The manufacturer-funded "best" figures come from this population: a best-case sample, not a method trick.</p>
            </div>
            <div class="bias-card">
              <span class="bias-tag">${this._icon('user')} Older adults &amp; patients</span>
              <span class="bias-stat">κ 0.30–0.42 <small>real users</small></span>
              <span class="bias-cap">Every device drops</span>
              <p>Sleep-clinic patients and older adults. Apnea-fragmented sleep is harder to stage, so Oura falls 0.65 → 0.35 and Apple 0.53 → 0.30. Fitbit is the exception (0.42 in both).</p>
            </div>
            <p class="bias-note">${this._icon('info')} <span><strong>A 4-stage kappa of 0.4–0.6 is only "moderate,"</strong> the current ceiling for consumer devices. Two human PSG scorers agree at ~0.75, so no wearable is "accurate" in an absolute sense. <em>Schyvens 2025 · Lee 2023</em></span></p>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">In detail</div>
            <h2>The full breakdown, <span class="hl">tap any device.</span></h2>
            <p class="lede">Every wearable's independent finding vs a lab PSG, the manufacturer's claim, its per-stage and timing numbers, and what it's best and weakest for.</p>
          </div>
          <div class="animate-on-scroll">${this._renderDeviceDetails()}</div>
          <p class="aff-disclosure animate-on-scroll">${this._icon('info')} <span>The "View on Amazon" links above are affiliate links. As an Amazon Associate, Kygo Health earns from qualifying purchases, at no extra cost to you.</span></p>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">True for every device</div>
            <h2>What no brand <span class="hl">can fix.</span></h2>
            <p class="lede">Five findings that hold across every wearable in the tables. Read these before you trust any single number.</p>
          </div>
          <div class="animate-on-scroll">${this._renderFactCards()}</div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <a class="blog-cta animate-on-scroll" href="https://www.kygo.app/post/most-accurate-sleep-tracker-oura-vs-apple-vs-fitbit-2026" target="_blank" rel="noopener">
            <span class="blog-cta-tag">Deep Dive</span>
            <div class="blog-cta-body">
              <div class="blog-cta-kicker">Read the full breakdown</div>
              <div class="blog-cta-title">The Most Accurate Sleep Tracker: Oura vs Apple vs Fitbit (2026)</div>
              <div class="blog-cta-sub">Why the "best" number depends on who's wearing it, which brands hold up in real patients, and how to actually read your own sleep stages, all evidence-based.</div>
            </div>
            <span class="blog-cta-arrow">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="bottomline animate-on-scroll">
            <div class="bottomline-tag">The bottom line</div>
            <p><strong>Oura</strong> leads sleep staging (κ 0.65 healthy, its own funded study) and total sleep time (bias about 3 min). <strong>Apple</strong> is the most accurate in independent testing (κ 0.53) and best for REM in healthy sleepers. <strong>Fitbit</strong> is the most population-robust (κ 0.42 healthy <em>and</em> clinical). <strong>WHOOP</strong> wins independent-healthy deep sleep, while <strong>Garmin</strong> and <strong>Withings</strong> trail on staging and over-report sleep the most. But every device overestimates sleep, can't reliably measure wake, and collapses in older adults and clinical patients, so use the trend, not the absolute number.</p>
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
            <p class="lede">Each figure checked against the primary record (PubMed / journal / manufacturer paper). Verified July 2026.</p>
          </div>
          <div class="sources animate-on-scroll">${this._renderSourceCards(this._sources.slice(0, 6))}</div>
          <div class="sources src-extra animate-on-scroll" data-src-extra hidden>${this._renderSourceCards(this._sources.slice(6))}</div>
          <div class="src-toggle-wrap animate-on-scroll">
            <button type="button" class="src-toggle" data-src-toggle aria-label="Toggle full source list">${this._icon('arrowRight')} <span data-src-toggle-label>Show all ${this._sources.length} sources</span></button>
          </div>
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
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Wearable sleep staging is an estimate, not a clinical measurement. Consult a qualified healthcare provider before making health decisions based on wearable data.</p>
          <p class="footer-copyright">Data from peer-reviewed validation studies and manufacturer documentation. Last updated July 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases. Product links on this page are affiliate links; we may earn a commission at no extra cost to you.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
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
    if (!document.querySelector('script[data-kygo-sleep-tracker-accuracy-ld]')) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Most Accurate Sleep Tracker: Oura, Apple Watch, Fitbit, WHOOP & Garmin',
        'description': 'Which wearable is most accurate for sleep vs a lab PSG? Compare 7 devices on 4-stage staging (healthy vs clinical), deep- and REM-stage detection, sleep/wake agreement, and total-sleep-time bias.',
        'applicationCategory': 'HealthApplication',
        'operatingSystem': 'Web',
        'url': 'https://www.kygo.app/tools/sleep-tracker-accuracy',
        'datePublished': '2026-07-13',
        'dateModified': '2026-07-13',
        'softwareVersion': '1.0',
        'inLanguage': 'en',
        'isAccessibleForFree': true,
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
        'alternateName': 'Kygo Sleep Tracker Accuracy Comparison Tool',
        'featureList': 'Compare 7 wearables for sleep, healthy vs clinical staging accuracy, deep and REM detection, sleep/wake agreement, total sleep time bias, manufacturer vs independent validation',
        'keywords': 'most accurate sleep tracker, sleep tracker accuracy, oura sleep accuracy, apple watch sleep accuracy, fitbit sleep accuracy, whoop sleep accuracy, garmin sleep accuracy, do sleep trackers work, wearable sleep staging accuracy, best sleep tracker 2026'
      };
      const s1 = document.createElement('script');
      s1.type = 'application/ld+json';
      s1.setAttribute('data-kygo-sleep-tracker-accuracy-ld', '');
      s1.textContent = JSON.stringify(ld);
      document.head.appendChild(s1);
    }

    if (!document.querySelector('script[data-kygo-sleep-tracker-accuracy-faq]')) {
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
      s2.setAttribute('data-kygo-sleep-tracker-accuracy-faq', '');
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
      .nav-cta-link { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; background: var(--kygo-green); color: #fff; font-weight: 600; font-size: 14px; padding: 8px 14px; border-radius: 8px; text-decoration: none; }
      .nav-cta-link:hover { background: var(--kygo-green-dark); color: #fff; }
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

      /* Sources · compact link list */
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
      .sources.src-extra { margin-top: 8px; }
      .sources.src-extra[hidden] { display: none; }
      .src-toggle-wrap { text-align: center; margin-top: 16px; }
      .src-toggle { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 999px; border: 1.5px solid var(--border-subtle); background: #fff; color: var(--kygo-green-dark); font-family: var(--font-display); font-weight: 600; font-size: 13px; cursor: pointer; transition: border-color .15s, box-shadow .15s; }
      .src-toggle:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); }
      .src-toggle .ico { width: 14px; height: 14px; transition: transform .2s; }
      .src-toggle.open .ico { transform: rotate(90deg); }

      /* Footer */
      .tool-footer { padding: 56px 20px 40px; background: var(--kygo-light); color: var(--fg-2); border-top: 1px solid var(--border-subtle); }
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
    `;
  }
}

customElements.define('kygo-sleep-tracker-accuracy', KygoSleepTrackerAccuracy);
