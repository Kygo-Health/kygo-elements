/**
 * Kygo Health — Wearable Stress Research
 * Tag: kygo-wearable-stress
 * Pick 1 or 2 wearables, see how each measures stress, then explore the
 * factor cards (alcohol, sleep, caffeine, etc.) re-sorted by impact for
 * the selected device.
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

class KygoWearableStress extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._mode = 'single';
    this._device1 = 'garmin';
    this._device2 = 'samsung';
    this._compareExpandedKey = null;
    this._categoryFilter = null;
    this._listExpandedKey = null;
    this._mythsCatPick = null;
    this._eventsBound = false;
  }

  connectedCallback() {
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, 'Wearable Stress Research by Kygo Health. Compare how Garmin, Apple Watch, Samsung Galaxy Watch, Google Pixel/Fitbit Sense, WHOOP, Oura Ring, and Polar measure stress. Each device uses a different mix of signals: HRV, electrodermal activity (EDA), skin temperature, respiratory rate, and SpO2. Multi-signal devices show ~82% accuracy versus ~77% for HRV-only. Explore 14 lifestyle factors — alcohol, sleep, caffeine, exercise, illness, hydration, meditation, cold exposure — with device-specific mechanisms and evidence-based actions to lower your stress score. Every claim sourced from peer-reviewed research including Frontiers in Physiology 2024.');
  }

  _injectStructuredData() {
    if (document.querySelector('script[data-kygo-stress-ld]')) return;

    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Wearable Stress Research',
      'alternateName': 'Kygo Wearable Stress Comparison Tool',
      'description': 'Compare how 7 wearables (Garmin, Apple Watch, Samsung Galaxy Watch, Google Pixel/Fitbit Sense 2, WHOOP, Oura Ring, Polar) measure stress, with 14 lifestyle factors broken down by device-specific mechanism.',
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'url': 'https://www.kygo.app/tools/wearable-stress-research',
      'datePublished': '2026-05-06',
      'dateModified': '2026-05-06',
      'softwareVersion': '1.0',
      'inLanguage': 'en',
      'isAccessibleForFree': true,
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
      'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
      'featureList': '7 wearable comparison (Garmin, Apple, Samsung, Google Pixel/Fitbit, WHOOP, Oura, Polar), 14 lifestyle factors with device-specific mechanisms, what-hurts/what-helps card structure, evidence leaderboard sorted by impact for the selected device, common myths debunked, peer-reviewed citations.',
      'keywords': 'wearable stress measurement, how does Garmin measure stress, Samsung BioActive sensor stress, WHOOP stress monitor, Oura cumulative stress, Apple Watch stress score, Pixel Watch cEDA, Fitbit Sense 2 stress, Polar Nightly Recharge, HRV stress, EDA skin conductance stress, alcohol HRV, sleep deprivation stress, caffeine HRV, overtraining respiratory rate'
    };

    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Does Apple Watch have a built-in stress score?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'No. As of watchOS 11, Apple Watch tracks HRV but does not surface a native stress score. Third-party apps such as StressWatch and Livity read HRV from HealthKit and compute a score on top of it. ECG-based readings can reach 52–64% accuracy in lab studies (University of Waterloo).' }
        },
        {
          '@type': 'Question',
          'name': 'Can I compare a stress score across different wearable brands?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'No. Every brand uses a proprietary algorithm and a personal baseline. A "55" on Garmin does not correspond to a "55" on Samsung. Each device has to be interpreted against its own historical baseline.' }
        },
        {
          '@type': 'Question',
          'name': 'Which wearables use EDA (skin conductance) for stress?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Only Samsung Galaxy Watch (BioActive Sensor) and Google Pixel Watch / Fitbit Sense 2 (continuous EDA, first introduced in 2022) measure EDA at the wrist. Garmin, WHOOP, Oura, Polar, and Apple Watch do not.' }
        },
        {
          '@type': 'Question',
          'name': 'What is the most universal factor that raises wearable stress scores?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Sleep deprivation. Every wearable that scores stress reads HRV, and short or fragmented sleep suppresses parasympathetic tone — so HRV drops and stress climbs the next morning on every device.' }
        },
        {
          '@type': 'Question',
          'name': 'How long does alcohol affect my wearable stress reading?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Even one drink drops RMSSD by about 2 ms. Three or more drinks can keep HRV depressed for 2 to 5 days. Most wearables show full recovery within 2 to 5 alcohol-free nights, with the personal baseline shifting up over a week or two of consistency.' }
        },
        {
          '@type': 'Question',
          'name': 'Are multi-signal wearables more accurate at measuring stress?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Generally yes. Lab studies show ~82% accuracy for multi-signal approaches (HRV + EDA + skin temperature) versus ~77% for HRV alone. But accuracy still depends heavily on algorithm quality, baseline calibration, and the specific stressor being detected.' }
        }
      ]
    };

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Kygo Health', 'item': 'https://www.kygo.app' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
        { '@type': 'ListItem', 'position': 3, 'name': 'Wearable Stress Research', 'item': 'https://www.kygo.app/tools/wearable-stress-research' }
      ]
    };

    [ld, faq, breadcrumb].forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-kygo-stress-ld', '');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  get _devices() {
    return {
      garmin: {
        name: 'Garmin',
        modelLine: 'Body Battery / Stress Score',
        sensors: { hrv: true, hr: true, eda: false, skinTemp: false, spo2: false, rr: false, sleep: false },
        algorithm: 'Firstbeat Analytics — RMSSD-based, samples every few minutes, pauses during exercise.',
        scale: '0–100  ·  rest 0–25 / low 26–50 / med 51–75 / high 76–100',
        baseline: 'Personal rolling baseline. Each reading is compared to your own history.',
        coverage: 'All-day, pauses during workouts.',
        strength: 'Long-running Firstbeat partnership; dependable, well-validated HRV pipeline.',
        limitation: 'HRV-only. Can\'t separate exercise arousal or excitement from psychological stress.',
        color: '#1E293B'
      },
      apple: {
        name: 'Apple Watch',
        modelLine: 'No native stress score (third-party only)',
        sensors: { hrv: true, hr: true, eda: false, skinTemp: false, spo2: false, rr: false, sleep: false },
        algorithm: 'No native algorithm as of watchOS 11. Third-party apps (StressWatch, Livity) read HRV from HealthKit.',
        scale: 'N/A native (third-party apps vary)',
        baseline: 'Set by whichever third-party app you use.',
        coverage: 'Whatever the third-party app reads from HealthKit.',
        strength: 'Highest-quality on-wrist ECG signal (per University of Waterloo lab study). Great raw data for third-party apps.',
        limitation: 'No stress feature shipped by Apple. Must trust a third-party app\'s methodology.',
        color: '#94A3B8'
      },
      samsung: {
        name: 'Samsung Galaxy Watch',
        modelLine: 'BioActive Sensor (HRV + EDA)',
        sensors: { hrv: true, hr: true, eda: true, skinTemp: false, spo2: false, rr: false, sleep: false },
        algorithm: 'BioActive Sensor pairs HRV with EDA (skin conductance). GW8 adds enhanced EDA; GW7 Ultra+ uses AI pattern recognition.',
        scale: '0–100',
        baseline: 'Proprietary AI baseline; adapts to your patterns over time.',
        coverage: 'Continuous real-time, all-day.',
        strength: 'EDA picks up sympathetic arousal directly — a signal HRV-only watches miss entirely.',
        limitation: 'EDA can\'t tell positive arousal (excitement) from negative arousal (anxiety). It detects activation, not valence.',
        color: '#22C55E'
      },
      google_fitbit: {
        name: 'Google Pixel / Fitbit Sense 2',
        modelLine: 'cEDA + ML across 4 signals',
        sensors: { hrv: true, hr: true, eda: true, skinTemp: true, spo2: false, rr: false, sleep: false },
        algorithm: 'Continuous EDA (cEDA) + skin temperature + HRV + HR fed into a machine-learning model. First all-day on-wrist EDA (2022).',
        scale: 'Body Response alerts + 1–100 daily Stress Management Score (12 metrics, 3 categories: exertion balance, sleep, responsiveness).',
        baseline: 'ML baseline built over your first month of wear.',
        coverage: 'Continuous all-day cEDA. Distinguishes exercise from stress automatically.',
        strength: 'Only consumer wearable with continuous on-wrist EDA paired with skin-temp. Catches stress events HRV-only devices miss.',
        limitation: 'cEDA is sensitive to ambient heat and humidity, which can show up as elevated tonic stress on hot days.',
        color: '#16A34A'
      },
      whoop: {
        name: 'WHOOP (4.0 / 5.0)',
        modelLine: 'Recovery + Stress Monitor',
        sensors: { hrv: true, hr: true, eda: false, skinTemp: true, spo2: true, rr: true, sleep: false },
        algorithm: 'RMSSD vs. 14-day personal baseline + respiratory rate + skin temp + SpO2. Motion-aware to filter exercise.',
        scale: 'Stress Monitor 0–3 (low / medium / high)  ·  Recovery 0–100%',
        baseline: '14-day rolling personal RMSSD and respiratory-rate baseline.',
        coverage: 'Real-time. Stress Monitor needs Peak or Life membership; Recovery is the overnight calc.',
        strength: 'Overnight respiratory rate is a clean overtraining and illness flag — very few consumer devices surface it.',
        limitation: 'No EDA, so daytime sympathetic spikes only show up indirectly via HR and HRV.',
        color: '#0F766E'
      },
      oura: {
        name: 'Oura Ring (Gen3 / Ring 4)',
        modelLine: 'Daytime + Resilience + Cumulative Stress',
        sensors: { hrv: true, hr: true, eda: false, skinTemp: true, spo2: false, rr: false, sleep: true },
        algorithm: 'Three layers: real-time Daytime Stress (HRV), Resilience, and Cumulative Stress — a 31-day scan of HRV + sleep + activity, developed with the University of Southern Denmark (released Nov 2025).',
        scale: 'Low / Medium / High + trend',
        baseline: '31-day personal cumulative scan; sleep architecture feeds heavily into the score.',
        coverage: 'Daytime Stress is continuous; Cumulative is a daily rollup.',
        strength: 'Finger-site skin temperature is the cleanest in the consumer market — drives accurate menstrual-cycle and illness detection.',
        limitation: 'No EDA. Daytime spikes lean on HRV alone; sleep weight means a bad night dominates the score.',
        color: '#475569'
      },
      polar: {
        name: 'Polar',
        modelLine: 'Nightly Recharge / ANS Charge',
        sensors: { hrv: true, hr: true, eda: false, skinTemp: false, spo2: false, rr: true, sleep: false },
        algorithm: 'Nightly Recharge measures the first ~4 hours of sleep against a 28-day baseline. No daytime stress score.',
        scale: 'ANS Charge −10 to +10',
        baseline: '28-day personal ANS Charge baseline from overnight readings.',
        coverage: 'Overnight only — recovery focus, not daytime tracking.',
        strength: 'Overnight respiratory rate + HRV + HR together is a strong, clean recovery signal.',
        limitation: 'No daytime score at all. If you want to see acute stress in real time, Polar isn\'t the device.',
        color: '#334155'
      }
    };
  }

  get _metricMeta() {
    return {
      hrv:      { label: 'HRV',         short: 'HRV' },
      hr:       { label: 'Heart Rate',  short: 'HR' },
      eda:      { label: 'EDA',         short: 'EDA' },
      skinTemp: { label: 'Skin Temp',   short: 'Skin Temp' },
      rr:       { label: 'Resp. Rate',  short: 'Resp' },
      spo2:     { label: 'SpO₂',        short: 'SpO₂' },
      sleep:    { label: 'Sleep arch.', short: 'Sleep' }
    };
  }

  get _deviceMetrics() {
    return {
      garmin:        ['hrv', 'hr'],
      apple:         ['hrv', 'hr'],
      samsung:       ['hrv', 'hr', 'eda'],
      google_fitbit: ['hrv', 'hr', 'eda', 'skinTemp'],
      whoop:         ['hrv', 'hr', 'rr', 'skinTemp', 'spo2'],
      oura:          ['hrv', 'hr', 'skinTemp', 'sleep'],
      polar:         ['hrv', 'hr', 'rr']
    };
  }

  get _metricFactors() {
    // Source: Wearable_Stress_Research_Consolidated.md
    const SRC = {
      frontiers2024:    { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/', label: 'Frontiers in Physiology 2024 (PMC11333334)' },
      hrvExercise:      { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/',  label: 'HRV & exercise meta-analysis (PMC8950456)' },
      rhrFactors:       { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/',  label: 'RHR factors review (PMC9549087)' },
      rhrExercise:      { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/',  label: 'Exercise & RHR meta-analysis (PMC6306777)' },
      chronicStress:    { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/',  label: 'Chronic stress & HRV (PMC9974008)' },
      caffeineHrv:      { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/', label: 'Caffeine, sleep & HRV (PMC11284693)' },
      skinTempStress:   { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4664114/',  label: 'Skin temperature & acute stress (PMC4664114)' },
      skinTempAmbient:  { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9690349/',  label: 'Skin temp & ambient confounds (PMC9690349)' },
      edaSenses:        { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10575214/', label: 'EDA & sensory stimulation (PMC10575214)' },
      edaWiki:          { url: 'https://en.wikipedia.org/wiki/Electrodermal_activity', label: 'Electrodermal Activity (Wikipedia)' },
      edaBiopac:        { url: 'https://blog.biopac.com/electrodermal-activity-eda/', label: 'BIOPAC — Electrodermal Activity' },
      skinTempUltra:    { url: 'https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/', label: 'Ultrahuman — Skin temperature factors' },
      skinTempSleep:    { url: 'https://www.nature.com/articles/s41746-026-02633-2', label: 'Nature 2026 — Skin temp during sleep' },
      skinTempDepression: { url: 'https://www.sciencedirect.com/science/article/pii/S2666915325000071', label: 'ScienceDirect 2025 — EDA & skin temp in depression' },
      polarRR:          { url: 'https://support.polar.com/us-en/nightly-recharge-recovery-measurement', label: 'Polar — Nightly Recharge' },
      whoopRecovery:    { url: 'https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/', label: 'WHOOP — Recovery 101' },
      ouraCumulative:   { url: 'https://ouraring.com/blog/what-is-cumulative-stress/', label: 'Oura — Cumulative Stress' },
      kygoHrv:          { url: 'https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence', label: 'Kygo — HRV: 44 factors ranked' },
      aha:              { url: 'https://www.heart.org/en/news/2019/02/01/8-things-that-can-affect-your-heart-and-what-to-do-about-them', label: 'AHA — Heart rate factors' },
      coldHrv:          { url: 'https://marathonhandbook.com/how-to-increase-hrv/', label: 'Marathon Handbook — HRV strategies' },
      sedentary:        { url: 'https://www.hackensackmeridianhealth.org/en/healthier-you/2022/02/24/6-reasons-your-heart-rate-is-high', label: 'HMH — High heart rate causes' },
      clevelandHr:      { url: 'https://health.clevelandclinic.org/how-to-lower-your-resting-heart-rate', label: 'Cleveland Clinic — Lowering RHR' },
      heartFoundation:  { url: 'https://theheartfoundation.org/2018/11/02/your-heart-rate/', label: 'Heart Foundation — Heart rate' }
    };

    return {
      hrv: [
        { key: 'hrv-sleep',          name: 'Consistent sleep (7–9 hrs)',     direction: 'positive', impact: 'high', magnitude: '15–30% RMSSD increase within 4 weeks',                  mechanism: 'Parasympathetic dominance during quality sleep restores vagal tone.',                source: SRC.frontiers2024 },
        { key: 'hrv-aerobic',        name: 'Aerobic exercise (150 min/wk)',  direction: 'positive', impact: 'high', magnitude: 'Significant long-term HRV gain',                        mechanism: 'Enhanced vagal tone and cardiovascular fitness via consistent training.',           source: SRC.hrvExercise },
        { key: 'hrv-meditation',     name: 'Meditation / breathwork',         direction: 'positive', impact: 'med',  magnitude: 'Acute HRV bump within minutes; chronic baseline lift',  mechanism: 'Slow breathing (~6 breaths/min) directly activates the vagus nerve.',               source: SRC.frontiers2024 },
        { key: 'hrv-weight',         name: 'Healthy body weight',             direction: 'positive', impact: 'med',  magnitude: 'Restores sympathovagal balance',                        mechanism: 'Lifestyle weight loss reduces sympathetic load and lifts parasympathetic activity.', source: SRC.frontiers2024 },
        { key: 'hrv-hydration',      name: 'Hydration',                       direction: 'positive', impact: 'low',  magnitude: 'Moderate effect on blood volume',                       mechanism: 'Adequate volume reduces cardiac strain and supports vagal tone.',                   source: SRC.rhrFactors },
        { key: 'hrv-cold',           name: 'Cold exposure (controlled)',      direction: 'positive', impact: 'low',  magnitude: 'Acute vagal stimulation',                               mechanism: 'Brief cold exposure triggers the dive reflex, boosting parasympathetic output.',    source: SRC.coldHrv },
        { key: 'hrv-alcohol',        name: 'Alcohol',                         direction: 'negative', impact: 'high', magnitude: '~2 ms RMSSD drop per drink; up to 13 ms after 3+',     mechanism: 'Direct suppression of parasympathetic activity for hours after intake.',           source: SRC.kygoHrv },
        { key: 'hrv-sleep-dep',      name: 'Sleep deprivation',               direction: 'negative', impact: 'high', magnitude: 'Significant acute RMSSD reduction',                    mechanism: 'Short or fragmented sleep shifts autonomic balance toward sympathetic dominance.', source: SRC.frontiers2024 },
        { key: 'hrv-overtraining',   name: 'Overtraining',                    direction: 'negative', impact: 'high', magnitude: 'Progressive HRV decline with accumulated load',         mechanism: 'Excessive load without recovery suppresses parasympathetic tone over days.',       source: SRC.hrvExercise },
        { key: 'hrv-chronic-stress', name: 'Chronic psychological stress',    direction: 'negative', impact: 'high', magnitude: 'Sustained RMSSD/SDNN reduction',                       mechanism: 'Chronic sympathetic activation suppresses vagal tone over weeks.',                 source: SRC.chronicStress },
        { key: 'hrv-illness',        name: 'Illness / inflammation',          direction: 'negative', impact: 'high', magnitude: 'Significant drop during acute illness',                 mechanism: 'Immune response activates the sympathetic nervous system.',                        source: SRC.frontiers2024 },
        { key: 'hrv-caffeine',       name: 'Excess caffeine',                 direction: 'negative', impact: 'med',  magnitude: '8–12% drop in caffeine-sensitive individuals',         mechanism: 'Sympathetic overstimulation, particularly with afternoon doses.',                  source: SRC.caffeineHrv }
      ],
      hr: [
        { key: 'hr-cardio-fit', name: 'Cardio fitness',         direction: 'positive', impact: 'high', magnitude: 'Strongest factor — dose-dependent RHR drop', mechanism: 'Stronger heart pumps more blood per beat, fewer beats needed at rest.',     source: SRC.rhrExercise },
        { key: 'hr-sleep',      name: 'Adequate sleep',         direction: 'positive', impact: 'med',  magnitude: 'Poor sleep elevates next-day RHR',           mechanism: 'Sleep deprivation shifts autonomic balance toward sympathetic dominance.',  source: SRC.rhrFactors },
        { key: 'hr-sedentary',  name: 'Sedentary lifestyle',    direction: 'negative', impact: 'high', magnitude: 'Most common cause of high RHR',              mechanism: 'Deconditioned heart works harder to maintain output.',                       source: SRC.sedentary },
        { key: 'hr-caffeine',   name: 'Caffeine / stimulants',  direction: 'negative', impact: 'med',  magnitude: 'Acute increase, duration varies',            mechanism: 'Stimulates sympathetic nervous system and adrenal response.',                source: SRC.heartFoundation },
        { key: 'hr-alcohol',    name: 'Alcohol',                direction: 'negative', impact: 'med',  magnitude: 'Acute and next-day elevation',               mechanism: 'Vasodilation requires compensatory heart rate increase.',                    source: SRC.rhrFactors },
        { key: 'hr-heat',       name: 'Heat / dehydration',     direction: 'negative', impact: 'med',  magnitude: 'Significant in hot environments',            mechanism: 'Thicker blood and thermoregulation demand more cardiac work.',               source: SRC.rhrFactors },
        { key: 'hr-fever',      name: 'Illness / fever',        direction: 'negative', impact: 'high', magnitude: '~10 bpm per 1°F of fever',                   mechanism: 'Immune response and thermoregulation increase metabolic demand.',            source: SRC.aha },
        { key: 'hr-stress',     name: 'Stress / anxiety',       direction: 'negative', impact: 'high', magnitude: 'Acute and chronic elevation',                mechanism: 'Sympathetic activation via cortisol and adrenaline.',                        source: SRC.clevelandHr }
      ],
      eda: [
        { key: 'eda-arousal',     name: 'Emotional arousal (anxiety, fear, anger)', direction: 'negative', impact: 'high', magnitude: 'Strong, immediate response',                 mechanism: 'Sympathetic NS triggers eccrine sweat glands, raising skin conductance.',          source: SRC.edaWiki },
        { key: 'eda-cognitive',   name: 'Cognitive load / mental effort',           direction: 'negative', impact: 'med',  magnitude: 'Moderate sustained tonic rise',              mechanism: 'Mental exertion activates the sympathetic nervous system.',                         source: SRC.edaBiopac },
        { key: 'eda-sensory',     name: 'Sensory stimulation (sounds, pain, surprise)', direction: 'negative', impact: 'med', magnitude: 'Acute orienting response',                mechanism: 'Startle/orienting response via sympathetic sweat-gland activation.',                source: SRC.edaSenses },
        { key: 'eda-heat',        name: 'Ambient heat & humidity',                  direction: 'negative', impact: 'med',  magnitude: 'Tonic level rises with environmental heat',  mechanism: 'Thermoregulatory sweating, independent of emotional state — common confounder.',    source: SRC.skinTempAmbient },
        { key: 'eda-excitement',  name: 'Excitement / positive arousal',            direction: 'variable', impact: 'med',  magnitude: 'Indistinguishable from negative arousal',     mechanism: 'EDA reads sympathetic activation only — it cannot tell valence.',                  source: SRC.edaWiki },
        { key: 'eda-meditation',  name: 'Relaxation / meditation',                  direction: 'positive', impact: 'med',  magnitude: 'Gradual reduction in tonic level',           mechanism: 'Parasympathetic activation reduces sympathetic drive to sweat glands.',            source: SRC.edaBiopac },
        { key: 'eda-cool',        name: 'Cool ambient temperature',                 direction: 'positive', impact: 'low',  magnitude: 'Tonic level falls',                          mechanism: 'Less thermoregulatory sweating in cooler conditions.',                              source: SRC.skinTempAmbient },
        { key: 'eda-habituation', name: 'Habituation (repeated stimuli)',           direction: 'positive', impact: 'low',  magnitude: 'Progressive reduction with repeat exposure', mechanism: 'Brain adapts to repeated non-threatening stimuli, dampening response.',            source: SRC.edaWiki },
        { key: 'eda-dehydration', name: 'Dehydration',                              direction: 'variable', impact: 'low',  magnitude: 'Alters electrolyte concentration',           mechanism: 'Changes sweat composition and skin conductance properties unpredictably.',         source: SRC.edaBiopac }
      ],
      skinTemp: [
        { key: 'st-stress',      name: 'Acute psychological stress',     direction: 'negative', impact: 'med',  magnitude: 'Measurable peripheral drop at wrist/finger', mechanism: 'Vasoconstriction redirects blood to core organs.',                                source: SRC.skinTempStress },
        { key: 'st-exercise',    name: 'Exercise',                       direction: 'variable', impact: 'med',  magnitude: 'Rises during, drops post',                   mechanism: 'Vasodilation for heat dissipation; algorithms typically filter this.',           source: SRC.skinTempUltra },
        { key: 'st-cycle',       name: 'Menstrual cycle (luteal phase)', direction: 'negative', impact: 'high', magnitude: '~0.3–0.5°C luteal-phase rise',               mechanism: 'Progesterone raises basal body temperature.',                                     source: SRC.skinTempUltra },
        { key: 'st-fever',       name: 'Illness / fever',                direction: 'negative', impact: 'high', magnitude: 'Significant rise during infection',          mechanism: 'Immune response raises core and peripheral temperature.',                          source: SRC.skinTempUltra },
        { key: 'st-alcohol',     name: 'Alcohol',                        direction: 'negative', impact: 'med',  magnitude: 'Acute peripheral rise',                      mechanism: 'Vasodilation increases skin surface temperature for hours after intake.',          source: SRC.skinTempUltra },
        { key: 'st-ambient',     name: 'Ambient temperature',            direction: 'variable', impact: 'high', magnitude: 'Major confounder for wrist devices',         mechanism: 'External temperature directly affects surface sensor readings.',                  source: SRC.skinTempAmbient },
        { key: 'st-sleep-onset', name: 'Sleep onset',                    direction: 'positive', impact: 'low',  magnitude: 'Normal extremity-temp rise',                 mechanism: 'Vasodilation at extremities initiates the sleep-onset cascade.',                  source: SRC.skinTempSleep },
        { key: 'st-depression',  name: 'Depression / chronic stress',    direction: 'negative', impact: 'med',  magnitude: 'Higher day-to-day temperature variability',  mechanism: 'Disrupted autonomic regulation increases temperature fluctuations.',              source: SRC.skinTempDepression }
      ],
      rr: [
        { key: 'rr-stress',        name: 'Stress / anxiety',           direction: 'negative', impact: 'high', magnitude: 'Acute increase in rate and shallowness', mechanism: 'Sympathetic activation increases respiratory drive.',                source: SRC.polarRR },
        { key: 'rr-pain',          name: 'Pain',                       direction: 'negative', impact: 'med',  magnitude: 'Acute rate increase',                    mechanism: 'Sympathetic activation changes breathing pattern.',                  source: SRC.polarRR },
        { key: 'rr-fever',         name: 'Fever / illness',            direction: 'negative', impact: 'med',  magnitude: 'Proportional to body temperature',       mechanism: 'Increased metabolic demand requires more oxygen.',                   source: SRC.polarRR },
        { key: 'rr-overtraining',  name: 'Overtraining',               direction: 'negative', impact: 'high', magnitude: 'Elevated overnight rate is a key marker', mechanism: 'Incomplete recovery leaves sympathetic tone elevated overnight.',    source: SRC.whoopRecovery },
        { key: 'rr-caffeine',      name: 'Late caffeine',              direction: 'negative', impact: 'low',  magnitude: 'Mild stimulatory rise',                  mechanism: 'CNS stimulation affects the respiratory center.',                    source: SRC.whoopRecovery },
        { key: 'rr-meditation',    name: 'Relaxation / meditation',    direction: 'positive', impact: 'high', magnitude: 'Significant drop with slow breathing',   mechanism: 'Parasympathetic activation, vagal tone increase.',                   source: SRC.polarRR },
        { key: 'rr-cardio-fit',    name: 'Cardio fitness',             direction: 'positive', impact: 'med',  magnitude: 'Lower baseline rate',                    mechanism: 'Efficient gas exchange needs fewer breaths per minute.',             source: SRC.whoopRecovery },
        { key: 'rr-sleep',         name: 'Quality sleep',              direction: 'positive', impact: 'med',  magnitude: 'Lowest overnight rate',                  mechanism: 'Parasympathetic dominance during deep sleep.',                       source: SRC.polarRR }
      ],
      spo2: [
        { key: 'spo2-altitude',    name: 'Altitude',                       direction: 'negative', impact: 'high', magnitude: 'Significant drop above ~5,000 ft',     mechanism: 'Lower atmospheric oxygen reduces hemoglobin saturation.',          source: SRC.whoopRecovery },
        { key: 'spo2-apnea',       name: 'Sleep apnea',                    direction: 'negative', impact: 'high', magnitude: 'Repeated overnight desaturation',      mechanism: 'Airway obstruction causes intermittent hypoxia during sleep.',     source: SRC.whoopRecovery },
        { key: 'spo2-illness',     name: 'Respiratory illness',            direction: 'negative', impact: 'med',  magnitude: 'Varies by severity',                   mechanism: 'Impaired gas exchange in the lungs reduces saturation.',           source: SRC.whoopRecovery },
        { key: 'spo2-smoking',     name: 'Smoking',                        direction: 'negative', impact: 'high', magnitude: 'Chronic reduction',                    mechanism: 'Carbon monoxide displaces oxygen on hemoglobin.',                   source: SRC.whoopRecovery },
        { key: 'spo2-cardio-fit',  name: 'Cardio fitness',                 direction: 'positive', impact: 'low',  magnitude: 'Stable, near 95–100%',                 mechanism: 'Efficient cardiovascular system maintains saturation.',             source: SRC.whoopRecovery },
        { key: 'spo2-breathing',   name: 'Proper breathing during sleep',  direction: 'positive', impact: 'low',  magnitude: 'Fewer desaturation events',            mechanism: 'Unobstructed airway throughout the sleep cycle.',                   source: SRC.whoopRecovery }
      ],
      sleep: [
        { key: 'sl-schedule',      name: 'Consistent sleep schedule',     direction: 'positive', impact: 'high', magnitude: 'Improves all sleep-architecture metrics',  mechanism: 'Circadian rhythm alignment improves deep sleep and continuity.',         source: SRC.ouraCumulative },
        { key: 'sl-cool',          name: 'Cool bedroom (65–68°F)',        direction: 'positive', impact: 'med',  magnitude: 'Increases deep sleep duration',            mechanism: 'Core temperature drop triggers deep sleep initiation.',                   source: SRC.ouraCumulative },
        { key: 'sl-exercise',      name: 'Regular exercise (not late)',   direction: 'positive', impact: 'med',  magnitude: 'Increases deep sleep, reduces latency',    mechanism: 'Physical fatigue promotes sleep drive; vigorous training within 2 hrs of bed disrupts onset.', source: SRC.hrvExercise },
        { key: 'sl-alcohol-bed',   name: 'Alcohol before bed',            direction: 'negative', impact: 'high', magnitude: 'Reduces deep sleep, increases wake-ups',   mechanism: 'Disrupts sleep architecture even when onset feels faster.',              source: SRC.frontiers2024 },
        { key: 'sl-late-caffeine', name: 'Late caffeine (after 2 PM)',    direction: 'negative', impact: 'high', magnitude: 'Delays onset, reduces total sleep',        mechanism: 'Caffeine\'s 5–6 hour half-life blocks adenosine receptors.',             source: SRC.kygoHrv },
        { key: 'sl-late-meals',    name: 'Late heavy meals',              direction: 'negative', impact: 'med',  magnitude: 'Disrupts sleep quality',                   mechanism: 'Digestion raises core temperature and metabolic activity at bedtime.',   source: SRC.ouraCumulative },
        { key: 'sl-screens',       name: 'Screen time before bed',        direction: 'negative', impact: 'med',  magnitude: 'Delays melatonin release',                 mechanism: 'Blue light suppresses pineal melatonin production.',                     source: SRC.ouraCumulative },
        { key: 'sl-stress',        name: 'Chronic stress / anxiety',      direction: 'negative', impact: 'high', magnitude: 'Fragmented sleep, less deep sleep',        mechanism: 'Elevated cortisol disrupts sleep architecture and continuity.',          source: SRC.ouraCumulative }
      ]
    };
  }

  _factorsForDevice(deviceKey) {
    const metrics = this._deviceMetrics[deviceKey] || [];
    const out = [];
    for (const m of metrics) {
      for (const f of (this._metricFactors[m] || [])) {
        out.push({ ...f, metric: m, _devKey: `${deviceKey}-${f.key}` });
      }
    }
    return out;
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
      watch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"/><polyline points="12 10 12 12 13 13"/><path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05"/><path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05"/></svg>'
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
      garmin:        'https://static.wixstatic.com/media/273a63_c545c093c04d4ca4ade77e5ca43fd433~mv2.png',
      apple:         'https://static.wixstatic.com/media/273a63_68b4900c356b4d0c8982e5ecd10f04fe~mv2.png',
      samsung:       'https://static.wixstatic.com/media/273a63_21fd42e4a5d1459bb6db751a0ea5e161~mv2.png',
      google_fitbit: 'https://static.wixstatic.com/media/273a63_c12bab319dc34737a386c7449f5f92c7~mv2.png',
      whoop:         'https://static.wixstatic.com/media/273a63_c52aaaca1f7243f3818cf51d9374dbd4~mv2.png',
      oura:          'https://static.wixstatic.com/media/273a63_722e50e1a554453eb4c71a2e7a58925d~mv2.png'
    })[key] || null;
  }

  _renderComparisonModule() {
    const sensorList = [
      { key: 'hrv',      label: 'HRV',         short: 'HRV' },
      { key: 'hr',       label: 'HR',          short: 'HR' },
      { key: 'eda',      label: 'EDA',         short: 'EDA' },
      { key: 'skinTemp', label: 'Skin Temp',   short: 'Temp' },
      { key: 'spo2',     label: 'SpO₂',        short: 'SpO₂' },
      { key: 'rr',       label: 'Resp. Rate',  short: 'Resp' },
      { key: 'sleep',    label: 'Sleep arch.', short: 'Sleep' }
    ];
    const totalSensors = sensorList.length;

    const ranked = Object.entries(this._devices).map(([key, d]) => {
      const count = Object.values(d.sensors).filter(Boolean).length;
      return { key, d, count };
    }).sort((a, b) => b.count - a.count || a.d.name.localeCompare(b.d.name));

    const expanded = this._compareExpandedKey;

    // Top: matrix table
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

    // Bottom: compact per-device dropdowns
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
                <div><dt>Algorithm</dt><dd>${d.algorithm}</dd></div>
                <div><dt>Scale</dt><dd>${d.scale}</dd></div>
                <div><dt>Baseline</dt><dd>${d.baseline}</dd></div>
                <div><dt>Coverage</dt><dd>${d.coverage}</dd></div>
              </dl>
              <div class="dd-callouts">
                <div class="dd-callout strong"><span class="dd-callout-head"><span class="dd-callout-icon">${this._icon('sparkle')}</span>Unique strength</span><p>${d.strength}</p></div>
                <div class="dd-callout watch"><span class="dd-callout-head"><span class="dd-callout-icon">${this._icon('alert')}</span>Watch out for</span><p>${d.limitation}</p></div>
              </div>
            </div>
          </div>
        </div>`;
    }).join('');

    return `
      <section class="comparison-section section-bg-gray" id="compare">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('compare')}</span>How your device measures stress</span>
            <h2 class="section-h2">Every wearable, <em>side by side</em>.</h2>
            <p class="section-lede">Stress scores aren't comparable across brands. Each device pulls a different mix of HRV, EDA, skin temperature, and breathing rate — here's exactly what each one reads, ranked by signal coverage.</p>
          </div>

          <div class="device-chart">
            <div class="dc-head">
              <div>
                <span class="dc-eyebrow">Signal coverage</span>
                <h3 class="dc-title">Sensors fed into stress, by device</h3>
                <p class="dc-sub">Multi-signal devices average ~82% accuracy in lab studies versus ~77% for HRV-only.</p>
              </div>
              <div class="dc-meta">${ranked.length} wearables · ${totalSensors} signals</div>
            </div>
            <div class="device-table-wrap">
              <table class="device-table">
                ${tableHead}
                <tbody>${tableBody}</tbody>
              </table>
            </div>
          </div>

          <div class="device-details">
            <div class="dd-section-head">
              <span class="dd-section-eyebrow">Full breakdown</span>
              <h3 class="dd-section-title">Tap a device for the algorithm, scale, and tradeoffs</h3>
            </div>
            <div class="dd-list">${detailRows}</div>
          </div>
        </div>
      </section>`;
  }

  _topPicks() {
    return [
      { label: 'Most universal mover', stat: '7 / 7', answer: 'Sleep deprivation', icon: 'moon', note: 'Hits every device because all 7 read HRV and sleep deprivation suppresses parasympathetic tone immediately.', cls: '' },
      { label: 'Only-on-EDA signal',   stat: '2 devices', answer: 'Cognitive load', icon: 'brain', note: 'Sustained mental effort raises tonic skin conductance — invisible to HRV-only watches. Samsung & Pixel/Fitbit only.', cls: '' },
      { label: 'WHOOP / Polar specialty', stat: 'Resp. rate', answer: 'Overtraining', icon: 'dumbbell', note: 'Elevated overnight respiratory rate is the textbook overtraining flag. Only WHOOP and Polar surface it.', cls: '' },
      { label: 'Oura specialty', stat: '0.3–0.5°C', answer: 'Cycle skin temp', icon: 'thermometer', note: 'Finger-site skin temp catches the luteal-phase rise so cleanly that Oura uses it for period prediction.', cls: '' },
      { label: 'Hot-day false positive', stat: 'cEDA', answer: 'Ambient heat', icon: 'sun', note: 'Continuous EDA reads thermoregulatory sweating as stress. Pixel/Fitbit users: cross-check against HRV before reacting.', cls: 'warn' },
      { label: 'The biggest myth', stat: 'Don\'t', answer: 'Compare scores across brands', icon: 'ghost', note: 'A "55" on Garmin doesn\'t mean a "55" on Samsung. Each algorithm uses a different sensor mix and a personal baseline.', cls: 'myth' }
    ];
  }

  get _myths() {
    return [
      { name: 'Higher stress score = something is wrong',                cat: 'Reading the score', why: 'A short spike is usually normal arousal — focus, excitement, a workout. Chronic elevation is the actual flag.' },
      { name: 'My Garmin "55" means the same as my friend\'s Samsung "55"', cat: 'Reading the score', why: 'Every brand uses a proprietary algorithm and a personal baseline. Scores are not comparable across devices.' },
      { name: 'Lowest possible stress all day is the goal',              cat: 'Reading the score', why: 'Some sympathetic activation is healthy and adaptive. Resilience is the recovery, not the absence of stress.' },
      { name: 'A green "recovered" reading means I should max-train',    cat: 'Reading the score', why: 'Recovery scores reflect autonomic state, not muscular readiness. Training judgment still matters.' },
      { name: 'Apple Watch has a native stress score',                   cat: 'Devices',           why: 'As of watchOS 11, no. Apple ships HRV data; third-party apps (StressWatch, Livity) compute the score.' },
      { name: 'EDA detects "stress" specifically',                       cat: 'Devices',           why: 'EDA detects sympathetic arousal — anxiety, excitement, surprise, even ambient heat all raise it.' },
      { name: 'Multi-signal devices are always more accurate',           cat: 'Devices',           why: 'Generally true (~82% vs ~77% in lab studies) but algorithm quality matters as much as signal count.' },
      { name: 'Polar shows my real-time daytime stress',                 cat: 'Devices',           why: 'Polar Nightly Recharge measures only the first ~4 hours of sleep. There is no daytime stress score.' },
      { name: 'A drop in HRV always means stress',                       cat: 'Signals',           why: 'Exercise, illness, alcohol, caffeine, dehydration, and even ambient heat all drop HRV.' },
      { name: 'Wearables can read specific emotions',                    cat: 'Signals',           why: 'Devices detect physiological arousal — not valence. They cannot tell anxiety from excitement.' },
      { name: 'Skin temperature is only useful for fever',               cat: 'Signals',           why: 'It tracks circadian rhythm, menstrual cycle, sleep onset, and overtraining — not just illness.' },
      { name: 'Resting heart rate alone tells you about stress',         cat: 'Signals',           why: 'RHR moves with fitness and hydration too. HRV is the more sensitive autonomic readout.' },
      { name: 'I should aim for zero alcohol forever to fix HRV',        cat: 'Lifestyle',         why: 'Most of the rebound happens in the first 2–5 alcohol-free nights; baseline lifts within weeks.' },
      { name: 'Cold plunges fix chronic stress',                         cat: 'Lifestyle',         why: 'Cold gives a small, real acute vagal bump — but the durable movers are sleep, cardio, and breathwork.' },
      { name: 'Meditation has to be 30+ minutes to work',                cat: 'Lifestyle',         why: '5–10 minutes of slow breathing (~6 breaths/min) shifts HRV and EDA measurably.' },
      { name: 'Adaptogens (ashwagandha, rhodiola) lower wearable stress', cat: 'Lifestyle',         why: 'Trials show subjective stress changes and small HRV shifts; no consistent wearable-score evidence.' }
    ];
  }

  _renderArticleCta() {
    return `
      <section class="article-section section-bg-white">
        <div class="container">
          <a href="https://www.kygo.app/post/wearable-stress-research" class="article-card animate-on-scroll" target="_blank" rel="noopener">
            <span class="article-badge">Deep Dive</span>
            <div class="article-body">
              <span class="article-kicker">Read the full article</span>
              <h3 class="article-title">How 7 Brands Actually Measure Stress <span class="article-year">(2026)</span></h3>
              <p class="article-desc">Every signal, algorithm, and cited study in one long-form read.</p>
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
              <p>Kygo Health connects your wearable data with nutrition tracking to pinpoint personal correlations between what you eat, your sleep, your HRV, and how fast you recover from stress.</p>
              <div class="app-cta-buttons">
                <a href="${iosUrl}" class="app-cta-btn" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </a>
                <a href="https://kygo.app/android" target="_blank" rel="noopener" class="app-cta-android">
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
                  <img src="https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png" alt="Whoop" loading="lazy" />
                  <img src="https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png" alt="Health Connect" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>`;
  }

  _renderMythsSection() {
    const groups = ['Reading the score', 'Devices', 'Signals', 'Lifestyle'];
    const counts = {};
    groups.forEach(g => counts[g] = this._myths.filter(m => m.cat === g).length);
    const total = this._myths.length;
    const picked = this._mythsCatPick;

    // Default highest-value myths shown immediately (no empty state)
    const featuredKeys = [
      'My Garmin "55" means the same as my friend\'s Samsung "55"',
      'Apple Watch has a native stress score',
      'EDA detects "stress" specifically',
      'A drop in HRV always means stress'
    ];
    const items = picked
      ? this._myths.filter(m => m.cat === picked)
      : this._myths.filter(m => featuredKeys.includes(m.name));

    const cards = items.map(m => `
      <article class="myth-card">
        <div class="myth-row">
          <h4 class="myth-name">${m.name}</h4>
          <span class="myth-badge">Myth</span>
        </div>
        <p class="myth-why">${m.why}</p>
        <span class="myth-cat-tag">${m.cat}</span>
      </article>`).join('');

    const tiles = `
      <button class="myth-filter ${picked === null ? 'active' : ''}" data-myths-cat="__featured" aria-pressed="${picked === null}">
        <span>Top picks</span><span class="myth-filter-count">${featuredKeys.length}</span>
      </button>
      ${groups.map(g => {
        const isActive = picked === g;
        return `<button class="myth-filter ${isActive ? 'active' : ''}" data-myths-cat="${g}" aria-pressed="${isActive}">
          <span>${g}</span><span class="myth-filter-count">${counts[g]}</span>
        </button>`;
      }).join('')}
    `;

    return `
      <section class="myths-section section-bg-white" aria-labelledby="myths-title">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow amber"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('ghost')}</span>Common Myths</span>
            <h2 class="section-h2" id="myths-title">What people <em>get wrong</em> about stress scores.</h2>
            <p class="section-lede">${total} misconceptions debunked. The ones below are the four worth dropping today — switch categories for the rest.</p>
          </div>
          <div class="myth-filters" role="tablist">${tiles}</div>
          <div class="myth-grid">${cards}</div>
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
              <span class="picks-eyebrow">Six headlines from the data</span>
              <h2 class="picks-title">If you only remember <em>six things</em>.</h2>
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
    const isExp = this._listExpandedKey === f._devKey;
    const impCfg = this._impactCfg(f.impact);
    const metricLbl = (this._metricMeta[f.metric] || {}).label || '';
    const dirCls = f.direction === 'positive' ? 'fact-dir-pos' : f.direction === 'negative' ? 'fact-dir-neg' : 'fact-dir-var';
    const dirArrow = f.direction === 'positive' ? '↓' : f.direction === 'negative' ? '↑' : '↕';
    const dirLbl = f.direction === 'positive' ? 'Improves stress reading' : f.direction === 'negative' ? 'Worsens stress reading' : 'Variable effect';

    let body = '';
    if (isExp) {
      body = `
        <div class="fact-body">
          <dl class="fact-fields">
            <div><dt>Magnitude</dt><dd>${f.magnitude}</dd></div>
            <div><dt>Mechanism</dt><dd>${f.mechanism}</dd></div>
          </dl>
          <div class="fact-source-row">
            <span class="fact-source-lbl">Source</span>
            <a href="${f.source.url}" target="_blank" rel="noopener" class="source-link">${f.source.label} ${this._icon('externalLink')}</a>
          </div>
        </div>`;
    }

    return `
      <article class="fact-card ${isExp ? 'expanded' : ''}" data-fact-key="${f._devKey}">
        <button class="fact-head" aria-expanded="${isExp}">
          <span class="fact-meta">
            <span class="fact-cat">${metricLbl} <span class="fact-dir ${dirCls}" aria-hidden="true">${dirArrow}</span></span>
            <span class="fact-name">${f.name}</span>
            <span class="fact-effect ${dirCls}">${dirLbl} · ${impCfg.label} impact</span>
          </span>
          <span class="fact-pill ${impCfg.cls}">${impCfg.label}</span>
          <span class="fact-chev" aria-hidden="true">${this._icon('chevDown')}</span>
        </button>
        ${body}
      </article>`;
  }

  _renderFactorList() {
    // Two groups: what helps (improves the metric) vs what hurts (worsens or confounds).
    const all = this._factorsForDevice(this._device1);
    const m = this._categoryFilter;
    const filtered = m ? all.filter(f => f.metric === m) : all;
    if (!filtered.length) return '<p class="dash-empty">No factors match this filter.</p>';

    const byImpact = (a, b) =>
      this._impactCfg(b.impact).weight - this._impactCfg(a.impact).weight ||
      a.name.localeCompare(b.name);
    const helps = filtered.filter(f => f.direction === 'positive').sort(byImpact);
    const hurts = filtered.filter(f => f.direction === 'negative' || f.direction === 'variable').sort(byImpact);

    const group = (cls, label, sub, items) => `
      <div class="fact-group fact-group--${cls}">
        <div class="fact-group-head">
          <span class="fact-group-label"><span class="fact-group-icon" aria-hidden="true"></span>${label}</span>
          <span class="fact-group-meta">${items.length} factor${items.length === 1 ? '' : 's'} · ${sub}</span>
        </div>
        <div class="fact-list">
          ${items.length ? items.map(f => this._renderFactorCard(f)).join('') : '<p class="dash-empty">None in this view.</p>'}
        </div>
      </div>`;

    return `
      <div class="fact-groups">
        ${group('helps', 'What helps', 'Improves your reading', helps)}
        ${group('hurts', 'What hurts', 'Worsens or confounds your reading', hurts)}
      </div>`;
  }

  _renderMetricTiles() {
    const deviceMetrics = this._deviceMetrics[this._device1] || [];
    const tiles = deviceMetrics.map(k => {
      const m = this._metricMeta[k];
      const count = (this._metricFactors[k] || []).length;
      const isActive = this._categoryFilter === k;
      return `
        <button class="picker-tile ${isActive ? 'active' : ''}" data-cat="${k}" aria-pressed="${isActive}">
          <span class="picker-tile-name">${m.label}</span>
          <span class="picker-tile-count">${count}</span>
        </button>`;
    }).join('');
    return `<div class="picker-tiles picker-tiles--metrics" data-metric-count="${deviceMetrics.length}">${tiles}</div>`;
  }

  _renderDevicePicker() {
    const shortName = (k) => ({
      garmin: 'Garmin', apple: 'Apple Watch', samsung: 'Samsung',
      google_fitbit: 'Pixel / Fitbit', whoop: 'WHOOP', oura: 'Oura', polar: 'Polar'
    })[k] || this._devices[k].name;
    const tiles = Object.entries(this._devices).map(([k, d]) => {
      const isActive = this._device1 === k;
      const img = this._deviceImage(k);
      return `
        <button class="device-pick ${isActive ? 'active' : ''}" type="button" data-device-pick="${k}" aria-pressed="${isActive}">
          ${img
            ? `<span class="device-pick-img"><img src="${img}" alt="${d.name}" loading="lazy" /></span>`
            : `<span class="device-pick-img device-pick-img--icon" aria-hidden="true">${this._icon('watch')}</span>`}
          <span class="device-pick-name">${shortName(k)}</span>
        </button>`;
    }).join('');
    return `
      <div class="device-picker">
        <span class="device-picker-label">Your wearable</span>
        <div class="device-picker-tiles">${tiles}</div>
      </div>`;
  }

  _renderFactorsSection() {
    const d1 = this._devices[this._device1];
    const cat = this._categoryFilter;
    const catLabel = cat ? (this._metricMeta[cat] || {}).label : null;
    const total = this._factorsForDevice(this._device1).length;
    const shown = cat
      ? this._factorsForDevice(this._device1).filter(f => f.metric === cat).length
      : total;
    const metricCount = (this._deviceMetrics[this._device1] || []).length;
    return `
      <section class="factors-section section-bg-gray">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('activity')}</span>What moves your score</span>
            <h2 class="section-h2">${total} <em>factors</em> that move your <em>${d1.name}</em> score.</h2>
            <p class="section-lede">Pick your wearable to see the metrics it actually reads, then tap a metric to drill in. Each metric splits into what helps your reading and what hurts it, ranked by impact.</p>
          </div>
          ${this._renderDevicePicker()}
          <span class="metric-tiles-label">${metricCount} metric${metricCount === 1 ? '' : 's'} ${d1.name} reads</span>
          ${this._renderMetricTiles()}
          <div class="picker-panel">
            <div class="picker-panel-head">
              <h3 class="picker-panel-title">${catLabel ? `${catLabel} factors` : 'All factors'}<span class="picker-panel-meta">${shown} factor${shown === 1 ? '' : 's'}</span></h3>
            </div>
            ${this._renderFactorList()}
          </div>
        </div>
      </section>`;
  }

  _renderCalloutSection() {
    return `
      <section class="callout-section section-bg-white">
        <div class="container">
          <div class="callout-card">
            <span class="callout-icon" aria-hidden="true">${this._icon('info')}</span>
            <div class="callout-body">
              <h3>Stress scores aren't comparable across brands.</h3>
              <p>Every wearable uses a proprietary mix of signals and a personal baseline, so a "55" on Garmin doesn't mean the same thing as a "55" on Samsung. Multi-signal devices (HRV + EDA + skin temp) hit ~82% accuracy in lab studies vs. ~77% for HRV-only. And remember: wearables detect <em>arousal</em>, not stress. The same HRV drop comes from anxiety, excitement, caffeine, or a hard workout.</p>
            </div>
          </div>
        </div>
      </section>`;
  }

  _renderSourcesSection() {
    const groups = {
      'Core HRV & stress research': [
        { label: 'Frontiers in Physiology 2024 — Factors influencing HRV (PMC11333334)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/' },
        { label: 'PMC9974008 — Chronic stress & HRV in medical professionals', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/' },
        { label: 'PMC8950456 — HRV & exercise meta-analysis', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/' },
        { label: 'PMC11284693 — Caffeine, sleep & HRV review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/' },
        { label: 'PMC9549087 — Resting heart rate factors', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/' },
        { label: 'PMC6306777 — Exercise & RHR meta-analysis (Reimers 2018)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/' }
      ],
      'EDA & skin conductance': [
        { label: 'BIOPAC — Electrodermal Activity overview', url: 'https://blog.biopac.com/electrodermal-activity-eda/' },
        { label: 'PMC10575214 — Sensory EDA triggering', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10575214/' },
        { label: 'EBSCO Research Starters — Electrodermal Activity', url: 'https://www.ebsco.com/research-starters/health-and-medicine/electrodermal-activity-eda' },
        { label: 'Wikipedia — Electrodermal Activity', url: 'https://en.wikipedia.org/wiki/Electrodermal_activity' }
      ],
      'Skin temperature & ambient confounds': [
        { label: 'PMC4664114 — Skin temperature as stress marker', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4664114/' },
        { label: 'PMC9690349 — Ambient temperature & physiological signals', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9690349/' },
        { label: 'Ultrahuman — Factors influencing skin temperature', url: 'https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/' }
      ],
      'Device documentation': [
        { label: 'WHOOP — Recovery 101', url: 'https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/' },
        { label: 'Polar — Nightly Recharge measurement', url: 'https://support.polar.com/us-en/nightly-recharge-recovery-measurement' },
        { label: 'Oura Blog — Cumulative Stress (2025)', url: 'https://ouraring.com/blog/what-is-cumulative-stress/' },
        { label: 'Oura Blog — Daytime Stress feature', url: 'https://ouraring.com/blog/daytime-stress-feature/' },
        { label: 'Marathon Handbook 2026 — HRV strategies', url: 'https://marathonhandbook.com/how-to-increase-hrv/' },
        { label: 'Kygo.app — How to improve HRV: 44 factors ranked', url: 'https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence' }
      ]
    };
    const total = Object.values(groups).reduce((s, g) => s + g.length, 0);
    return `
      <section class="sources-section section-bg-gray">
        <div class="container">
          <h2 class="section-title">Sources</h2>
          <p class="section-sub">All claims sourced from peer-reviewed research and official device documentation.</p>
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

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const totalFactors = Object.values(this._metricFactors).reduce((s, arr) => s + arr.length, 0);
    const totalDevices = Object.keys(this._devices).length;

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="header">
        <div class="header-inner">
          <a href="https://kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" />
            Stress Research
          </a>
          <a href="https://kygo.app" class="header-link" target="_blank" rel="noopener">
            Get App ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <section class="hero section-bg-white">
        <div class="container hero-inner">
          <div class="hero-kicker animate-on-scroll"><span class="hero-dot" aria-hidden="true"></span>${totalFactors} Factors · ${totalDevices} Wearables · Peer-Reviewed</div>
          <h1 class="hero-title animate-on-scroll">How does <em>your wearable</em> measure stress?</h1>
          <p class="hero-sub animate-on-scroll">Every brand reads stress differently — HRV, EDA, skin temp, breathing rate. Pick your device and the factor list below re-sorts around what actually moves <strong>your</strong> score.</p>
          <div class="animate-on-scroll">
            <div class="hero-meta">
              <div class="hero-cell"><span class="hero-num">${totalDevices}</span><span class="hero-lbl">Wearables</span></div>
              <div class="hero-cell"><span class="hero-num">${totalFactors}</span><span class="hero-lbl">Factors tracked</span></div>
              <div class="hero-cell"><span class="hero-num hero-num--pos">82%</span><span class="hero-lbl">Multi-signal accuracy</span></div>
              <div class="hero-cell"><span class="hero-num">77%</span><span class="hero-lbl">HRV-only accuracy</span></div>
            </div>
          </div>
          ${this._heroWaveSvg()}
        </div>
      </section>

      <div class="animate-on-scroll">${this._renderComparisonModule()}</div>
      <div class="animate-on-scroll">${this._renderFactorsSection()}</div>
      ${this._renderArticleCta()}
      ${this._renderCtaRow()}
      ${this._renderMythsSection()}
      ${this._renderTopPicks()}
      ${this._renderCalloutSection()}
      ${this._renderSourcesSection()}

      <footer class="tool-footer">
        <div class="container">
          <a href="https://kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" loading="lazy" />
            Kygo Health
          </a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Always consult a qualified healthcare provider before changing supplement, exercise, or lifestyle routines.</p>
          <p class="footer-copyright">© ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  _setupEventDelegation() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const shadow = this.shadowRoot;

    shadow.addEventListener('click', (e) => {
      if (e.target.closest('.source-link, a[href], .src-item')) return;

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
        const compSec = shadow.querySelector('.comparison-section');
        if (compSec) compSec.outerHTML = this._renderComparisonModule();
        return;
      }

      const devicePick = e.target.closest('[data-device-pick]');
      if (devicePick) {
        const k = devicePick.dataset.devicePick;
        if (k && this._device1 !== k) {
          this._device1 = k;
          this._listExpandedKey = null;
          const sec = shadow.querySelector('.factors-section');
          if (sec) sec.outerHTML = this._renderFactorsSection();
        }
        return;
      }

      const tile = e.target.closest('[data-cat]');
      if (tile) {
        const k = tile.dataset.cat;
        this._categoryFilter = this._categoryFilter === k ? null : k;
        this._listExpandedKey = null;
        const sec = shadow.querySelector('.factors-section');
        if (sec) sec.outerHTML = this._renderFactorsSection();
        return;
      }

      const mythsTile = e.target.closest('[data-myths-cat]');
      if (mythsTile) {
        const k = mythsTile.dataset.mythsCat;
        this._mythsCatPick = (k === '__featured') ? null : k;
        const sec = shadow.querySelector('.myths-section');
        if (sec) sec.outerHTML = this._renderMythsSection();
        return;
      }

      const factHead = e.target.closest('.fact-head');
      if (factHead) {
        const card = factHead.closest('[data-fact-key]');
        if (card) {
          const k = card.dataset.factKey;
          this._listExpandedKey = this._listExpandedKey === k ? null : k;
          const listEl = shadow.querySelector('.fact-list');
          if (listEl) listEl.outerHTML = this._renderFactorList();
        }
        return;
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
    });
  }

  _styles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

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
      .comparison-section, .factors-section, .callout-section, .sources-section, .picks-section, .myths-section { padding: 48px 0 56px; }
      @media (min-width: 768px) {
        .comparison-section, .factors-section, .callout-section, .sources-section, .picks-section, .myths-section { padding: 64px 0 72px; }
      }

      /* ARTICLE CTA */
      .article-card { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; max-width: 780px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #F6FBF7 0%, #EEF8F1 100%); border: 1px solid rgba(34,197,94,0.25); border-radius: 18px; text-decoration: none; overflow: hidden; transition: transform .2s ease-out, border-color .2s, box-shadow .2s; }
      .article-card::before { content: ''; position: absolute; top: -40%; right: -10%; width: 55%; height: 180%; background: radial-gradient(ellipse at top right, rgba(34,197,94,0.18), transparent 65%); pointer-events: none; }
      .article-card:hover { border-color: var(--green); transform: translateY(-1px); box-shadow: 0 10px 24px rgba(34,197,94,0.14); }
      .article-badge { position: relative; z-index: 1; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--green-dark); background: #fff; padding: 5px 10px; border-radius: 9999px; border: 1px solid rgba(34,197,94,0.3); white-space: nowrap; }
      .article-body { position: relative; z-index: 1; flex: 1; min-width: 0; width: 100%; padding-right: 50px; }
      .article-kicker { display: block; font-size: 11px; font-weight: 600; color: var(--green-dark); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 4px; }
      .article-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); margin: 0; line-height: 1.25; letter-spacing: -0.01em; }
      .article-year { color: var(--gray-400); font-weight: 500; }
      .article-desc { display: none; font-size: 13px; color: var(--gray-600); margin: 6px 0 0; line-height: 1.45; }
      .article-go { position: absolute; top: 18px; right: 18px; z-index: 2; width: 38px; height: 38px; border-radius: 50%; background: var(--green); color: #fff; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background .2s; }
      .article-card:hover .article-go { background: var(--green-dark); }
      .article-go svg { width: 16px; height: 16px; }
      @media (min-width: 768px) {
        .article-card { flex-direction: row; align-items: center; padding: 24px 28px; gap: 18px; border-radius: 22px; }
        .article-title { font-size: 19px; }
        .article-desc { display: block; }
        .article-go { position: static; width: 40px; height: 40px; }
        .article-go svg { width: 18px; height: 18px; }
        .article-body { padding-right: 0; }
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

      .dt-td-device { padding: 10px 12px 10px 4px; min-width: 150px; text-align: left; background: #fff; position: sticky; left: 0; z-index: 1; transition: background .15s; }
      .dt-brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
      .dt-img { width: 32px; height: 32px; border-radius: 8px; background: var(--gray-100); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
      .dt-img img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
      .dt-img--icon { background: var(--accent, var(--gray-200)); color: #fff; }
      .dt-img--icon svg { width: 16px; height: 16px; }
      .dt-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13.5px; color: var(--dark); letter-spacing: -0.01em; line-height: 1.2; overflow-wrap: anywhere; }
      @media (min-width: 768px) {
        .dt-td-device { padding: 14px 14px 14px 4px; min-width: 220px; position: static; }
        .dt-img { width: 38px; height: 38px; border-radius: 10px; }
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

      .dd-list { display: grid; gap: 6px; }
      .dd-row { background: #fff; border: 1px solid var(--gray-200); border-radius: 12px; overflow: hidden; transition: border-color .15s, box-shadow .15s; animation: dcGrow .55s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: var(--delay, 0ms); }
      .dd-row:hover { border-color: var(--gray-300); }
      .dd-row.open { box-shadow: 0 6px 18px rgba(15,23,42,0.06); }
      @keyframes dcGrow { from { opacity: 0; transform: translateY(4px); } }

      .dd-row-head { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px 10px 14px; background: transparent; border: 0; cursor: pointer; font-family: inherit; text-align: left; color: inherit; }
      .dd-row-head:hover { background: var(--gray-50); }
      .dd-img { width: 32px; height: 32px; border-radius: 8px; background: var(--gray-100); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
      .dd-img img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
      .dd-img--icon { background: var(--accent, var(--gray-200)); color: #fff; }
      .dd-img--icon svg { width: 16px; height: 16px; }
      .dd-text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .dd-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14.5px; color: var(--dark); line-height: 1.2; letter-spacing: -0.01em; overflow-wrap: anywhere; }
      .dd-line { display: block; margin-top: 2px; font-size: 11.5px; color: var(--gray-600); line-height: 1.35; overflow-wrap: anywhere; }
      .dd-chev { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; color: var(--gray-400); transition: transform .25s, color .15s, background .15s; flex-shrink: 0; }
      .dd-chev svg { width: 14px; height: 14px; }
      .dd-row-head[aria-expanded="true"] .dd-chev { transform: rotate(180deg); color: var(--green-dark); background: var(--green-light); }

      .dd-body { padding: 0 14px 14px; border-top: 1px dashed var(--gray-200); }
      .dd-body[hidden] { display: none; }
      .dd-body-inner { display: grid; gap: 14px; padding-top: 14px; }
      .dd-fields { display: grid; gap: 10px; margin: 0; }
      .dd-fields > div { display: grid; grid-template-columns: 1fr; gap: 2px; }
      .dd-fields dt { font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); margin: 0; }
      .dd-fields dd { margin: 0; font-size: 13.5px; color: var(--gray-700); line-height: 1.55; }
      .dd-callouts { display: grid; gap: 8px; }
      .dd-callout { padding: 12px 14px; border-radius: 12px; border: 1px solid; }
      .dd-callout.strong { background: rgba(34,197,94,0.06); border-color: rgba(34,197,94,0.22); }
      .dd-callout.watch { background: rgba(180,83,9,0.05); border-color: rgba(180,83,9,0.20); }
      .dd-callout-head { display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 6px; }
      .dd-callout.strong .dd-callout-head { color: var(--green-dark); }
      .dd-callout.watch .dd-callout-head { color: var(--amber); }
      .dd-callout-icon { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; }
      .dd-callout-icon svg { width: 14px; height: 14px; }
      .dd-callout p { margin: 0; font-size: 13px; color: var(--gray-700); line-height: 1.5; }
      @media (min-width: 768px) {
        .dd-row-head { padding: 12px 16px 12px 18px; gap: 12px; }
        .dd-img { width: 36px; height: 36px; border-radius: 10px; }
        .dd-name { font-size: 15.5px; }
        .dd-line { font-size: 12.5px; }
        .dd-body { padding: 0 22px 18px; }
        .dd-body-inner { padding-top: 16px; gap: 16px; }
        .dd-fields { grid-template-columns: 1fr 1fr; gap: 14px 24px; }
        .dd-callouts { grid-template-columns: 1fr 1fr; gap: 10px; }
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
      .device-picker-tiles { display: flex; gap: 6px; padding: 4px 2px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: thin; }
      .device-picker-tiles::-webkit-scrollbar { height: 4px; }
      .device-picker-tiles::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 4px; }
      .device-pick { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px 6px 6px; min-height: 38px; flex-shrink: 0; background: #fff; border: 1px solid var(--gray-200); border-radius: 9999px; font-family: inherit; cursor: pointer; transition: border-color .15s, transform .15s, background .15s, box-shadow .15s; color: var(--dark); white-space: nowrap; }
      .device-pick:hover { border-color: var(--gray-300); transform: translateY(-1px); }
      .device-pick.active { background: var(--dark); color: #fff; border-color: var(--dark); box-shadow: 0 6px 16px rgba(15,23,42,0.16); }
      .device-pick-img { width: 26px; height: 26px; border-radius: 7px; background: var(--gray-100); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
      .device-pick-img img { width: 100%; height: 100%; object-fit: contain; padding: 2px; }
      .device-pick-img--icon { background: var(--gray-200); color: var(--gray-600); }
      .device-pick-img--icon svg { width: 14px; height: 14px; }
      .device-pick.active .device-pick-img { background: rgba(255,255,255,0.14); }
      .device-pick.active .device-pick-img--icon { color: #fff; }
      .device-pick-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13.5px; letter-spacing: -0.01em; }
      @media (min-width: 880px) {
        .device-picker { flex-direction: row; align-items: center; gap: 14px; }
        .device-picker-tiles { flex-wrap: wrap; overflow-x: visible; padding: 0; }
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
      .picker-panel { background: #fff; border: 1px solid var(--gray-200); border-radius: 18px; padding: 18px; box-shadow: 0 1px 0 rgba(15,23,42,0.03); }
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
      .fact-groups { display: grid; grid-template-columns: 1fr; gap: 18px; }
      .fact-group { display: flex; flex-direction: column; gap: 10px; }
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
      .fact-card { background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; overflow: hidden; transition: border-color .15s, box-shadow .15s; }
      .fact-card:hover { border-color: var(--gray-300); }
      .fact-card.expanded { box-shadow: 0 6px 18px rgba(15,23,42,0.06); border-color: var(--gray-300); }
      .fact-head { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 12px; width: 100%; padding: 14px 16px; background: transparent; border: 0; cursor: pointer; font-family: inherit; text-align: left; }
      .fact-head:hover { background: var(--gray-50); }
      .fact-meta { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .fact-cat { display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-size: 9.5px; font-weight: 700; letter-spacing: 0.9px; text-transform: uppercase; color: var(--gray-400); line-height: 1; margin-bottom: 4px; }
      .fact-dir { font-size: 11px; font-weight: 700; line-height: 1; }
      .fact-dir-pos { color: var(--green-dark); }
      .fact-dir-neg { color: var(--red); }
      .fact-dir-var { color: var(--amber); }
      .fact-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); line-height: 1.25; letter-spacing: -0.005em; }
      .fact-effect { font-size: 12.5px; color: var(--gray-600); line-height: 1.4; margin-top: 2px; }
      .fact-effect.fact-dir-pos { color: var(--green-dark); }
      .fact-effect.fact-dir-neg { color: var(--red); }
      .fact-effect.fact-dir-var { color: var(--amber); }
      .fact-ev-inline { color: var(--gray-400); font-weight: 500; }
      .fact-fields { display: grid; gap: 10px; margin: 0 0 4px; }
      .fact-fields > div { display: grid; grid-template-columns: 1fr; gap: 2px; }
      .fact-fields dt { font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); margin: 0; }
      .fact-fields dd { margin: 0; font-size: 13.5px; color: var(--gray-700); line-height: 1.55; }
      @media (min-width: 768px) { .fact-fields { grid-template-columns: 1fr 1fr; gap: 14px 24px; } }
      .metric-tiles-label { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase; color: var(--gray-400); margin: 6px 0 8px; }
      .fact-pill { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; padding: 6px 14px; border-radius: 10px; white-space: nowrap; min-width: 88px; text-align: center; letter-spacing: -0.005em; background: var(--gray-100); color: var(--gray-600); }
      /* In a What helps group, impact reads as a positive intensity (stronger = more helpful). */
      .fact-group--helps .fact-pill.imp-high { background: rgba(22,163,74,0.18); color: var(--green-dark); }
      .fact-group--helps .fact-pill.imp-med  { background: var(--green-light); color: var(--green-dark); }
      .fact-group--helps .fact-pill.imp-low  { background: var(--gray-100); color: var(--gray-600); }
      /* In a What hurts group, impact reads as a warning intensity (stronger = more harmful). */
      .fact-group--hurts .fact-pill.imp-high { background: var(--red-light); color: var(--red); }
      .fact-group--hurts .fact-pill.imp-med  { background: var(--amber-light); color: var(--amber); }
      .fact-group--hurts .fact-pill.imp-low  { background: var(--gray-100); color: var(--gray-600); }
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
      .source-link { display: inline-flex; align-items: center; gap: 4px; color: var(--green-dark); font-weight: 500; font-size: 13px; }
      .source-link svg { width: 12px; height: 12px; }
      .source-link:hover { color: var(--green); }

      /* CTA ROW — combined article + app CTA */
      /* APP CTA — centered card on white section, mirrors RHR */
      .app-cta-section { padding: 48px 0; background: #fff; }
      @media (min-width: 768px) { .app-cta-section { padding: 64px 0; } }
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
      }
    `;
  }
}

if (!customElements.get('kygo-wearable-stress')) {
  customElements.define('kygo-wearable-stress', KygoWearableStress);
}
