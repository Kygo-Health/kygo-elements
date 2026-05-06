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
    this._listSort = 'impact';
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

  get _categoryMeta() {
    return {
      substance:   { label: 'Substance' },
      sleep:       { label: 'Sleep' },
      activity:    { label: 'Activity' },
      mental:      { label: 'Mental' },
      physical:    { label: 'Physical' },
      environment: { label: 'Environment' },
      physiology:  { label: 'Physiology' }
    };
  }

  // Shared boilerplate for HRV-driven mechanism on the "hurts" side.
  _hrvHurtsBase(magnitude) {
    return `Drops your RMSSD ${magnitude}. Your stress score climbs because the algorithm reads suppressed parasympathetic tone as elevated arousal.`;
  }

  get _factors() {
    // Each factor's per-device entry: { impact: 'high'|'med'|'low', signal, magnitude, hurts, helps, timeline? }
    // Impact reflects how much THIS factor moves THIS device's score, given which signals it uses.
    return [
      {
        key: 'alcohol',
        category: 'substance',
        question: 'Drank alcohol in the last 48 hours?',
        name: 'Alcohol',
        baseImpact: 'high',
        perDevice: {
          garmin: {
            impact: 'high', signal: 'HRV (RMSSD)',
            magnitude: '~2 ms RMSSD drop per drink · up to 13 ms for 2–5 days after 3+',
            hurts: 'Garmin uses HRV as its only stress input. Alcohol suppresses your parasympathetic nervous system, so even one drink drops RMSSD ~2 ms. Body Battery drains faster and the stress score climbs. Three or more drinks can keep RMSSD depressed for up to 5 days.',
            helps: 'Two to five alcohol-free nights lets RMSSD recover and shifts your personal baseline up over time. Because Garmin compares each reading to your own history, the lift is visible within about a week of consistent abstinence.',
            timeline: '2–5 days'
          },
          apple: {
            impact: 'high', signal: 'HRV (third-party)',
            magnitude: '~2 ms RMSSD drop per drink · 13 ms for 2–5 days after 3+',
            hurts: 'Apple Watch ships no native stress score, but every third-party stress app — StressWatch, Livity — pulls HRV from HealthKit. Alcohol suppresses parasympathetic activity, so RMSSD drops ~2 ms per drink. Whatever app you use, the next-day reading worsens.',
            helps: 'Skip alcohol for 2–5 nights so HRV recovers fully. The lift will show up in whichever third-party stress app you use, since they all read the same HealthKit RMSSD value.',
            timeline: '2–5 days'
          },
          samsung: {
            impact: 'high', signal: 'HRV + EDA',
            magnitude: '~2 ms RMSSD drop per drink, plus visible EDA changes from vasodilation',
            hurts: 'On top of the HRV suppression every wearable sees, your BioActive Sensor picks up disrupted skin-conductance patterns from alcohol-driven vasodilation — an extra signal Garmin and Oura don\'t see. Both inputs push your score up.',
            helps: 'A few alcohol-free nights moves RMSSD back toward baseline and lets your EDA tonic level settle. Samsung\'s baseline adapts within roughly a week, so consistency compounds.',
            timeline: '2–5 days'
          },
          google_fitbit: {
            impact: 'high', signal: 'HRV + cEDA + skin temp',
            magnitude: '~2 ms RMSSD drop per drink · acute peripheral skin-temp rise',
            hurts: 'Three signals all move at once: HRV drops (~2 ms/drink), continuous EDA shifts from vasodilation, and skin temperature rises peripherally. Your daily Stress Management Score and Body Response alerts both reflect it.',
            helps: 'Two to five clean nights brings all three signals back. Pixel/Fitbit weighs sleep heavily inside the 12-metric score, so dropping evening drinks improves recovery on top of HRV.',
            timeline: '2–5 days'
          },
          whoop: {
            impact: 'high', signal: 'HRV + RR + skin temp',
            magnitude: '~2 ms RMSSD drop · elevated overnight respiratory rate',
            hurts: 'WHOOP\'s overnight RMSSD reading is the dominant input. Alcohol suppresses parasympathetic tone, drops RMSSD, and bumps overnight respiratory rate — both flag as poor recovery. Stress Monitor jumps up the next day.',
            helps: 'WHOOP\'s 14-day rolling baseline rewards consistency. Two to five alcohol-free nights moves RMSSD up and respiratory rate down, lifting the green Recovery zone.',
            timeline: '3–7 days for the rolling baseline'
          },
          oura: {
            impact: 'high', signal: 'HRV + skin temp + sleep',
            magnitude: '~2 ms RMSSD drop · disrupted sleep architecture · peripheral skin-temp rise',
            hurts: 'Oura sees alcohol on three channels: HRV drops, skin temperature rises (vasodilation), and sleep architecture is disrupted — less deep sleep, more wake-ups. Cumulative Stress weights all three, so a single heavy night can sit on the 31-day rollup for days.',
            helps: 'Avoid alcohol for at least 2–3 hours before bed; ideally 2–5 dry nights in a row. Oura\'s 31-day Cumulative scan rewards consistency more than any other device.',
            timeline: '2–5 days · 31-day rollup smooths over time'
          },
          polar: {
            impact: 'high', signal: 'HRV + RR (overnight)',
            magnitude: '~2 ms RMSSD drop · elevated overnight respiratory rate',
            hurts: 'Polar\'s Nightly Recharge reads the first 4 hours of sleep. Alcohol depresses RMSSD and elevates respiratory rate exactly during that window, so ANS Charge drops sharply.',
            helps: 'Cut evening alcohol. Because Polar reads only sleep, the recovery response is the cleanest of any device — one good night usually shows the next morning.',
            timeline: '1–3 nights'
          }
        },
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/', label: 'Frontiers in Physiology 2024 (PMC11333334)' }
      },
      {
        key: 'sleep-deprivation',
        category: 'sleep',
        question: 'Getting less than 7 hours of sleep?',
        name: 'Sleep deprivation',
        baseImpact: 'high',
        perDevice: {
          garmin: { impact: 'high', signal: 'HRV (RMSSD)', magnitude: 'Significant acute RMSSD reduction; elevated next-day RHR', hurts: 'Sleep deprivation shifts your autonomic balance toward sympathetic dominance. Garmin reads it as suppressed RMSSD plus an elevated resting heart rate, so Body Battery starts the day already drained and stress climbs.', helps: 'Aim for 7–9 hours consistently. HRV typically improves 15–30% within 4 weeks of stable sleep. Garmin\'s personal baseline shifts up gradually.', timeline: '15–30% HRV improvement within 4 weeks' },
          apple: { impact: 'high', signal: 'HRV (third-party)', magnitude: 'Acute RMSSD reduction visible in HealthKit', hurts: 'Sympathetic dominance from short sleep drops the HRV value Apple writes to HealthKit. Whichever third-party stress app you use will show it the next morning.', helps: 'Consistent 7–9 hours over 4 weeks lifts HRV 15–30%. The change shows up in any HealthKit-based stress app.', timeline: '4 weeks for 15–30% HRV gain' },
          samsung: { impact: 'high', signal: 'HRV + EDA', magnitude: 'Acute HRV drop + slightly elevated tonic EDA', hurts: 'Both BioActive signals shift: HRV drops from sympathetic dominance, and tonic EDA tends to run higher because you\'re more reactive to small stimuli when underslept.', helps: '7–9 hours of consistent sleep restores HRV (15–30% in 4 weeks) and brings EDA tonic level back down.', timeline: '4 weeks for full restoration' },
          google_fitbit: { impact: 'high', signal: 'HRV + cEDA + sleep metrics', magnitude: 'HRV drop, elevated cEDA reactivity, lower sleep score', hurts: 'Pixel/Fitbit\'s ML model weights sleep heavily inside the daily Stress Management Score. Short sleep tanks the sleep-pattern category and shifts cEDA to a more reactive tonic level.', helps: 'Hit your 7–9 hour target. The 12-metric daily score lifts noticeably within a week, fully recovers in ~4 weeks.', timeline: '1–4 weeks' },
          whoop: { impact: 'high', signal: 'HRV + RR', magnitude: 'Suppressed RMSSD + elevated overnight RR', hurts: 'WHOOP\'s overnight RMSSD reading is dominated by sleep quantity and quality. Short sleep drops RMSSD and pushes respiratory rate up. Recovery score and Stress Monitor both worsen.', helps: 'Consistent 7–9 hours over 2–4 weeks moves the 14-day rolling baseline up. WHOOP rewards consistency more than any other recovery score.', timeline: '2–4 weeks' },
          oura: { impact: 'high', signal: 'HRV + sleep architecture', magnitude: 'HRV drop, less deep sleep, fragmented architecture', hurts: 'Oura is the most sleep-weighted device on the market. Short sleep tanks the Sleep Score directly, suppresses HRV, and feeds straight into Cumulative Stress.', helps: 'Consistent 7–9 hours moves Sleep Score, HRV, and Cumulative Stress together. The 31-day scan smooths over single bad nights.', timeline: '4 weeks for full lift; 31-day rollup smooths' },
          polar: { impact: 'high', signal: 'HRV + RR (overnight)', magnitude: 'Lower ANS Charge reading directly', hurts: 'Polar measures only the first 4 hours of sleep. Short or fragmented sleep means the entire reading window is compromised, so ANS Charge drops sharply.', helps: 'Sleep at least 7 hours. Because the measurement window is narrow, one good night moves Nightly Recharge the next morning.', timeline: '1–3 nights' }
        },
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/', label: 'Frontiers in Physiology 2024 (PMC11333334)' }
      },
      {
        key: 'caffeine',
        category: 'substance',
        question: 'Drinking more than 400 mg of caffeine, or after 2 PM?',
        name: 'Excess or late caffeine',
        baseImpact: 'med',
        perDevice: {
          garmin: { impact: 'med', signal: 'HRV (RMSSD) + HR', magnitude: '8–12% RMSSD drop in sensitive individuals', hurts: 'Caffeine overstimulates the sympathetic nervous system. Garmin sees a transient HR bump and a measurable RMSSD drop, especially if you\'re caffeine-sensitive.', helps: 'Cap intake under ~400 mg/day; nothing after 2 PM (5–6 hr half-life). Most people see HRV recover within 24 hours of cutting back.', timeline: '24 hours' },
          apple: { impact: 'med', signal: 'HRV (third-party)', magnitude: 'HealthKit HRV drop in sensitive individuals', hurts: 'Same sympathetic overstimulation. The HealthKit RMSSD value drops, so any third-party stress app reflects the same hit.', helps: 'Move caffeine before 2 PM and watch the next-day HRV reading recover.', timeline: '24 hours' },
          samsung: { impact: 'med', signal: 'HRV + EDA', magnitude: 'HRV drop + elevated tonic EDA', hurts: 'BioActive Sensor sees both: HRV drops from sympathetic activation, and EDA tonic level runs higher because caffeine raises baseline arousal.', helps: 'Cap intake and avoid late doses. Both signals settle within 24 hours.', timeline: '24 hours' },
          google_fitbit: { impact: 'med', signal: 'HRV + cEDA', magnitude: 'HRV drop + cEDA tonic shift', hurts: 'Continuous EDA shows the sympathetic baseline shift clearly — the score rolls higher even when you don\'t feel "stressed."', helps: 'Cap caffeine and clear it 6+ hours before bed. cEDA tonic level falls back within a day.', timeline: '24 hours' },
          whoop: { impact: 'med', signal: 'HRV + RR', magnitude: 'HRV drop + mild RR elevation', hurts: 'Late caffeine particularly hurts overnight metrics — HRV is suppressed and respiratory rate runs slightly higher when WHOOP measures recovery.', helps: 'No caffeine after 2 PM is the cleanest rule for protecting overnight RMSSD.', timeline: '1–2 nights' },
          oura: { impact: 'med', signal: 'HRV + sleep', magnitude: 'HRV drop + delayed sleep onset, less deep sleep', hurts: 'Caffeine\'s 5–6 hour half-life blocks adenosine receptors, delays sleep onset, and reduces deep sleep — which Oura weighs heavily inside Cumulative Stress.', helps: 'Cut off caffeine by early afternoon. Sleep onset and deep-sleep recovery follow within a night or two.', timeline: '1–3 nights' },
          polar: { impact: 'med', signal: 'HRV + RR (overnight)', magnitude: 'Lower ANS Charge from sympathetic carryover', hurts: 'Late caffeine carries sympathetic activation into the Nightly Recharge measurement window, which Polar reads as poor recovery.', helps: 'Avoid caffeine after 2 PM. Polar\'s overnight reading recovers within 1–2 nights.', timeline: '1–2 nights' }
        },
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/', label: 'Caffeine, sleep & HRV review (PMC11284693)' }
      },
      {
        key: 'aerobic-exercise',
        category: 'activity',
        question: 'Getting at least 150 minutes of moderate cardio a week?',
        name: 'Aerobic exercise (consistent)',
        baseImpact: 'high',
        perDevice: {
          garmin: { impact: 'high', signal: 'HRV + RHR', magnitude: 'Significant long-term HRV gain; RHR drops measurably', hurts: 'Without consistent cardio, vagal tone stays low and resting heart rate runs higher. Garmin reads both and your stress score sits elevated.', helps: 'Hit 150 min/week of moderate cardio. HRV gains compound; RHR drops 5–10 bpm in committed trainees over months.', timeline: '4–12 weeks for visible HRV gains' },
          apple: { impact: 'high', signal: 'HRV (third-party) + RHR', magnitude: 'Long-term HRV gain visible in HealthKit', hurts: 'No vagal tone, no resilience. HealthKit RMSSD stays low and any third-party stress app reflects elevated baseline arousal.', helps: '150 min/week of moderate cardio. HRV climbs in HealthKit over 4–12 weeks.', timeline: '4–12 weeks' },
          samsung: { impact: 'high', signal: 'HRV + HR', magnitude: 'Long-term HRV gain + lower RHR', hurts: 'Without aerobic training your HRV baseline runs low and your BioActive Sensor reads more reactive across the day.', helps: '150 min/week of cardio. HRV improves significantly over 4–12 weeks; RHR follows.', timeline: '4–12 weeks' },
          google_fitbit: { impact: 'high', signal: 'HRV + HR (auto exercise filter)', magnitude: 'HRV gain over months; better Cardio Fitness Score', hurts: 'Pixel/Fitbit auto-distinguishes exercise from stress, so the workout itself doesn\'t blow up the score — but missing aerobic training leaves your baseline HRV low.', helps: '150 min/week of cardio. The Cardio Fitness Score lifts and the daily Stress Management Score baseline improves.', timeline: '4–12 weeks' },
          whoop: { impact: 'high', signal: 'HRV + RR baseline', magnitude: 'HRV gain + lower overnight RR', hurts: 'Cardiorespiratory fitness is the dominant baseline-shifter for both HRV and respiratory rate. Without it, your 14-day baseline sits low.', helps: 'Build aerobic Strain consistently. WHOOP\'s 14-day baseline lifts as cardio fitness improves; overnight respiratory rate drops.', timeline: '4–12 weeks' },
          oura: { impact: 'high', signal: 'HRV + activity + sleep', magnitude: 'HRV gain + better sleep architecture', hurts: 'Oura\'s Cumulative Stress weighs activity and sleep together. Sedentary weeks show as lower readiness and worse sleep depth.', helps: 'Get aerobic activity most days. Avoid vigorous exercise within 2 hours of bed. HRV and deep sleep both lift over weeks.', timeline: '4–12 weeks' },
          polar: { impact: 'high', signal: 'HRV + RR (overnight)', magnitude: 'Higher ANS Charge baseline', hurts: 'Polar is built for athletes — without aerobic training the 28-day ANS Charge baseline stays flat or drifts negative.', helps: 'Train aerobically and let Polar track recovery. ANS Charge baseline lifts over 4–12 weeks.', timeline: '4–12 weeks' }
        },
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/', label: 'HRV & exercise meta-analysis (PMC8950456)' }
      },
      {
        key: 'overtraining',
        category: 'activity',
        question: 'Training hard with little recovery?',
        name: 'Overtraining',
        baseImpact: 'high',
        perDevice: {
          garmin: { impact: 'high', signal: 'HRV + RHR', magnitude: 'Progressive HRV decline; rising RHR', hurts: 'Excessive load without recovery suppresses parasympathetic tone. Garmin reads it as drifting HRV and a rising morning RHR — Body Battery never fully recharges.', helps: 'Take 1–2 deload days. HRV typically rebounds within a week of reduced load.', timeline: '5–10 days' },
          apple: { impact: 'med', signal: 'HRV (third-party)', magnitude: 'Drifting HealthKit RMSSD over weeks', hurts: 'No native overtraining flag, but the HealthKit HRV trend drifts down and any decent third-party stress app will show it.', helps: 'Cut load and let HRV recover.', timeline: '5–10 days' },
          samsung: { impact: 'high', signal: 'HRV + EDA', magnitude: 'HRV drop + reactive EDA', hurts: 'Both BioActive signals shift: HRV drifts down, and EDA runs more reactive because chronic sympathetic load amps you up.', helps: 'Reduce training volume for 5–10 days. Both signals recover together.', timeline: '5–10 days' },
          google_fitbit: { impact: 'high', signal: 'HRV + cEDA + skin temp', magnitude: 'HRV drift + elevated cEDA tonic + skin-temp anomalies', hurts: 'The ML model picks up the chronic sympathetic state across all 4 inputs. Body Response alerts fire more frequently.', helps: 'Deload. The 12-metric score lifts within a week as exertion balance and responsiveness recover.', timeline: '5–10 days' },
          whoop: { impact: 'high', signal: 'HRV + RR + skin temp', magnitude: 'Suppressed HRV + elevated overnight RR (canonical overtraining marker)', hurts: 'Overnight respiratory rate is WHOOP\'s strongest overtraining flag — even before HRV drifts, RR rises. Strain coach will start flashing yellow/red recovery.', helps: 'Listen to the recovery score. A 5–7 day lighter block usually rebuilds the green zone.', timeline: '5–7 days' },
          oura: { impact: 'high', signal: 'HRV + skin temp + sleep', magnitude: 'HRV drift + skin-temp deviation + worse sleep', hurts: 'Cumulative Stress integrates all three signals. Skin temp deviating from your baseline is a common Oura overtraining/illness flag.', helps: 'Reduce vigorous training. Skin temp normalizes within a week, sleep architecture follows.', timeline: '5–10 days' },
          polar: { impact: 'high', signal: 'HRV + RR (overnight)', magnitude: 'ANS Charge sliding negative over consecutive nights', hurts: 'Polar built Nightly Recharge to flag overtraining. Multi-day negative ANS Charge with elevated overnight RR is the classic pattern.', helps: 'Trust the negative ANS Charge. A 5–7 day deload restores it.', timeline: '5–7 days' }
        },
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/', label: 'Overtraining & HRV (PMC8950456)' }
      },
      {
        key: 'meditation',
        category: 'mental',
        question: 'Practicing meditation or slow breathing regularly?',
        name: 'Meditation / breathwork',
        baseImpact: 'med',
        perDevice: {
          garmin: { impact: 'med', signal: 'HRV', magnitude: 'Acute + chronic HRV improvement', hurts: 'Without active parasympathetic practice, you\'re relying on baseline recovery. HRV stays moderate and Body Battery refills slowly.', helps: '5–10 min of slow breathing (~6 breaths/min) daily. Acute HRV jumps measurably within minutes; chronic baseline lifts over weeks.', timeline: 'Acute · weeks for baseline' },
          apple: { impact: 'med', signal: 'HRV (third-party)', magnitude: 'HealthKit HRV improvement, acute and chronic', hurts: 'Apple\'s Mindfulness app cues breathwork but doesn\'t score it. Without practice, HRV trend stays flat.', helps: 'Use Mindfulness or any breathwork app. The HealthKit HRV trend lifts over weeks.', timeline: 'Acute · weeks for baseline' },
          samsung: { impact: 'med', signal: 'HRV + EDA', magnitude: 'HRV rises, EDA tonic level falls', hurts: 'Without parasympathetic practice your EDA tonic level runs higher and HRV stays moderate.', helps: 'Slow breathing drops EDA tonic almost immediately and lifts HRV. Both signals respond fast.', timeline: 'Minutes acute · weeks for baseline' },
          google_fitbit: { impact: 'med', signal: 'HRV + cEDA', magnitude: 'cEDA drops within minutes; HRV climbs over weeks', hurts: 'cEDA captures the parasympathetic shift in real time — without it, tonic arousal stays elevated.', helps: 'Pixel/Fitbit will literally show cEDA dropping during slow breathing. Daily Stress Management Score lifts over weeks.', timeline: 'Minutes acute · weeks for baseline' },
          whoop: { impact: 'med', signal: 'HRV + RR', magnitude: 'Acute HRV bump + lower overnight RR', hurts: 'Without breathwork, sympathetic carryover into the night keeps RR elevated.', helps: 'Slow breathing before bed drops RR into the measurement window — overnight HRV jumps the next morning.', timeline: '1–3 nights for visible Recovery lift' },
          oura: { impact: 'med', signal: 'HRV + sleep', magnitude: 'Acute HRV improvement + better sleep onset', hurts: 'Without parasympathetic practice, sleep onset is slower and Daytime Stress trends higher.', helps: 'Pre-bed breathwork shortens sleep onset and lifts HRV. Cumulative Stress improves over a week.', timeline: 'Days · weeks for cumulative' },
          polar: { impact: 'med', signal: 'HRV + RR (overnight)', magnitude: 'Higher ANS Charge from better recovery start', hurts: 'No breathwork means more sympathetic carryover into the first 4 hours of sleep — exactly the window Polar reads.', helps: '5–10 min of breathwork before bed lifts Nightly Recharge the next morning.', timeline: '1–3 nights' }
        },
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/', label: 'Frontiers in Physiology 2024 (PMC11333334)' }
      },
      {
        key: 'acute-stress',
        category: 'mental',
        question: 'Stuck in a stretch of acute psychological stress?',
        name: 'Acute psychological stress',
        baseImpact: 'high',
        perDevice: {
          garmin: { impact: 'high', signal: 'HRV + HR', magnitude: 'Sustained RMSSD reduction · elevated RHR', hurts: 'Cortisol and adrenaline drive sympathetic activation. Garmin reads it as suppressed HRV and elevated resting HR — the score lives in the high band until the stressor lifts.', helps: 'The biggest movers are sleep, breathwork, and aerobic exercise. Most people see meaningful recovery within 1–2 weeks once the stressor eases.', timeline: '1–2 weeks' },
          apple: { impact: 'high', signal: 'HRV (third-party)', magnitude: 'Sustained HealthKit HRV reduction', hurts: 'Chronic sympathetic activation drops HealthKit RMSSD across the day. Third-party apps read it directly.', helps: 'Address the stressor; use Mindfulness sessions and consistent sleep. HRV recovers gradually.', timeline: '1–2 weeks' },
          samsung: { impact: 'high', signal: 'HRV + EDA', magnitude: 'Strong, immediate EDA increase + HRV drop', hurts: 'EDA is the cleanest acute-stress signal in consumer wearables. Anxiety, fear, anger all spike it within seconds. HRV drops in parallel. Note: EDA can\'t tell positive arousal from negative.', helps: 'Breathwork drops EDA tonic level within minutes. Consistent sleep + exercise rebuild HRV over weeks.', timeline: 'Acute response in minutes · weeks for baseline' },
          google_fitbit: { impact: 'high', signal: 'HRV + cEDA', magnitude: 'Body Response alerts fire; daily score drops', hurts: 'Continuous EDA picks up sympathetic activation in real time. Pixel/Fitbit fires Body Response alerts and the daily Stress Management Score drops sharply.', helps: 'Use the Body Response alert as a cue for guided breathwork. cEDA drops in real time; the daily score recovers within days of stressor relief.', timeline: 'Real-time alerts · 1–2 weeks for baseline' },
          whoop: { impact: 'high', signal: 'HRV + RR', magnitude: 'Suppressed HRV + elevated overnight RR', hurts: 'Sympathetic carryover into sleep depresses RMSSD and elevates respiratory rate. Stress Monitor jumps high; Recovery score sits red.', helps: 'Pre-bed wind-down (breathwork, lower light). Recovery rebuilds within a week of stressor lifting.', timeline: '1 week' },
          oura: { impact: 'high', signal: 'HRV + skin temp + sleep', magnitude: 'HRV drop + peripheral skin-temp drop + worse sleep', hurts: 'Vasoconstriction at the periphery is a measurable acute-stress signal at the finger. Oura sees it on three channels and Cumulative Stress climbs.', helps: 'Sleep + breathwork + activity. Cumulative Stress drops noticeably within 1–2 weeks of stressor relief.', timeline: '1–2 weeks · 31-day rollup' },
          polar: { impact: 'med', signal: 'HRV + RR (overnight)', magnitude: 'ANS Charge sliding into negative range', hurts: 'Polar reads only sleep, so daytime stress shows up indirectly via worse first-4-hour recovery.', helps: 'Reduce evening sympathetic load (breathwork, no late screens). ANS Charge rebuilds within a few nights of relief.', timeline: '3–7 nights' }
        },
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/', label: 'Chronic stress & HRV (PMC9974008)' }
      },
      {
        key: 'illness',
        category: 'physiology',
        question: 'Coming down with something or running a fever?',
        name: 'Illness / fever',
        baseImpact: 'high',
        perDevice: {
          garmin: { impact: 'high', signal: 'HRV + HR', magnitude: 'Significant HRV drop · ~10 bpm RHR rise per 1°F', hurts: 'Immune activation drives sympathetic dominance. HRV drops, RHR rises ~10 bpm per 1°F of fever. Body Battery never recharges.', helps: 'Rest and hydration. Garmin doesn\'t flag illness explicitly but you\'ll see the pattern.', timeline: 'Days, depending on illness' },
          apple: { impact: 'high', signal: 'HRV + HR (third-party)', magnitude: 'HealthKit HRV drop + elevated RHR', hurts: 'Same immune-driven sympathetic shift visible in HealthKit values.', helps: 'Rest. Apple\'s Vitals app on watchOS can flag the deviation if multiple metrics shift together.', timeline: 'Days' },
          samsung: { impact: 'high', signal: 'HRV + EDA', magnitude: 'HRV drop + reactive EDA', hurts: 'Both BioActive signals shift with immune activation.', helps: 'Rest. Both signals normalize as illness resolves.', timeline: 'Days' },
          google_fitbit: { impact: 'high', signal: 'HRV + cEDA + skin temp', magnitude: 'HRV drop + elevated skin temp + cEDA shift', hurts: 'Skin-temperature deviation is a strong illness signal. Pixel/Fitbit weighs all four inputs and the daily Stress Management Score drops hard.', helps: 'Rest. The score rebuilds as skin temp returns to baseline.', timeline: 'Days' },
          whoop: { impact: 'high', signal: 'HRV + RR + skin temp + SpO2', magnitude: 'All four signals shift; SpO2 drops with respiratory illness', hurts: 'WHOOP is the most illness-aware device. Elevated overnight RR + skin-temp deviation + suppressed HRV is the classic pattern; SpO2 drops with respiratory infections.', helps: 'Rest. WHOOP\'s recovery score is conservative — let it stay red until all four signals return.', timeline: 'Days to weeks depending on illness' },
          oura: { impact: 'high', signal: 'HRV + skin temp + sleep', magnitude: 'Skin-temp elevation is the dominant signal', hurts: 'Oura\'s finger-site skin temp is the cleanest in the consumer market — fever shows up clearly. HRV drops, sleep fragments.', helps: 'Rest. Oura often flags illness 1–2 days before subjective symptoms appear.', timeline: 'Days' },
          polar: { impact: 'med', signal: 'HRV + RR (overnight)', magnitude: 'Lower ANS Charge + elevated overnight RR', hurts: 'Polar reads only overnight, but illness-driven sympathetic activation is clear in the first-4-hour window.', helps: 'Rest. ANS Charge recovers as illness resolves.', timeline: 'Days' }
        },
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/', label: 'Frontiers in Physiology 2024 (PMC11333334)' }
      },
      {
        key: 'dehydration-heat',
        category: 'physical',
        question: 'Dehydrated or training in the heat?',
        name: 'Dehydration & heat',
        baseImpact: 'med',
        perDevice: {
          garmin: { impact: 'med', signal: 'HRV + HR', magnitude: 'Moderate HRV drop · significant RHR rise', hurts: 'Lower blood volume + thermoregulation demand drive cardiac strain. RHR climbs measurably and HRV drops modestly.', helps: 'Hydrate consistently (not just before workouts). Both signals settle within a day.', timeline: '24 hours' },
          apple: { impact: 'med', signal: 'HRV + HR', magnitude: 'HealthKit values shift modestly', hurts: 'Same volume-driven sympathetic shift; visible in HealthKit but not flagged natively.', helps: 'Hydrate.', timeline: '24 hours' },
          samsung: { impact: 'med', signal: 'HRV + EDA', magnitude: 'HRV drop + altered EDA conductance', hurts: 'Dehydration changes electrolyte concentration in sweat, so EDA readings can drift unpredictably along with the HRV drop.', helps: 'Hydrate consistently. EDA returns to normal as electrolyte balance restores.', timeline: '24 hours' },
          google_fitbit: { impact: 'high', signal: 'HRV + cEDA + skin temp', magnitude: 'Heat shows up on all three signals', hurts: 'Thermoregulatory sweating raises tonic cEDA independent of emotional state — Pixel/Fitbit can read heat as stress on hot days.', helps: 'Hydrate; treat hot-day spikes with skepticism. The signals settle as ambient cools.', timeline: 'Hours to a day' },
          whoop: { impact: 'med', signal: 'HRV + skin temp', magnitude: 'HRV drop + elevated skin temp', hurts: 'Heat strain shows up overnight as elevated skin temp and suppressed HRV.', helps: 'Hydrate; sleep cool. Both signals normalize within a night.', timeline: '1 night' },
          oura: { impact: 'med', signal: 'HRV + skin temp', magnitude: 'Skin-temp elevation + HRV drop', hurts: 'Finger-site skin temp picks up heat strain clearly. Cumulative Stress climbs on hot days even without subjective stress.', helps: 'Hydrate; sleep cool (65–68°F bedroom is Oura\'s recommended range).', timeline: '1–2 nights' },
          polar: { impact: 'med', signal: 'HRV + RR (overnight)', magnitude: 'Lower ANS Charge from elevated RR + reduced HRV', hurts: 'Heat carries sympathetic activation into sleep, which Polar reads in the first 4 hours.', helps: 'Hydrate; sleep cool. ANS Charge recovers within 1–2 nights.', timeline: '1–2 nights' }
        },
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/', label: 'RHR & hydration review (PMC9549087)' }
      },
      {
        key: 'cold-exposure',
        category: 'physical',
        question: 'Doing controlled cold exposure (cold showers, plunges)?',
        name: 'Cold exposure',
        baseImpact: 'low',
        perDevice: {
          garmin: { impact: 'low', signal: 'HRV', magnitude: 'Acute vagal stimulation; small HRV bump', hurts: 'Without cold exposure you\'re missing one of the cleanest acute parasympathetic levers. Not actively harmful — just leverage you\'re not using.', helps: 'Brief cold exposure (face dunk, 30–60s cold shower) triggers the dive reflex and acutely boosts vagal tone. Effect is small but real.', timeline: 'Acute response' },
          apple: { impact: 'low', signal: 'HRV (third-party)', magnitude: 'Small HealthKit HRV bump', hurts: 'Same — not harmful, just unused leverage.', helps: 'Cold exposure produces a measurable acute HRV bump in HealthKit.', timeline: 'Acute' },
          samsung: { impact: 'low', signal: 'HRV + EDA', magnitude: 'EDA spike then drop; HRV bump', hurts: 'EDA shows the initial sympathetic startle then a parasympathetic rebound.', helps: 'Brief cold exposure shifts both signals favorably after the initial spike.', timeline: 'Acute' },
          google_fitbit: { impact: 'low', signal: 'HRV + cEDA', magnitude: 'cEDA spike then drop', hurts: 'Same biphasic pattern as Samsung.', helps: 'cEDA drops below baseline after the cold response — net positive.', timeline: 'Acute' },
          whoop: { impact: 'low', signal: 'HRV', magnitude: 'Small overnight HRV gain', hurts: 'Not harmful — but WHOOP is built for endurance, not biphasic acute responses.', helps: 'Cold exposure earlier in the day can lift overnight HRV slightly.', timeline: '1 night' },
          oura: { impact: 'low', signal: 'HRV + skin temp', magnitude: 'Skin temp drop + HRV bump', hurts: 'Skin-temp shifts from cold exposure can confound the menstrual-cycle signal if done close to bed.', helps: 'Cold exposure earlier in the day. Avoid right before sleep so skin-temp baseline isn\'t disrupted.', timeline: 'Acute · same night' },
          polar: { impact: 'low', signal: 'HRV + RR (overnight)', magnitude: 'Small ANS Charge bump', hurts: 'Polar reads only overnight, so the acute response is invisible — only carryover effects show.', helps: 'Cold exposure earlier in the day can lift Nightly Recharge slightly.', timeline: '1 night' }
        },
        source: { url: 'https://marathonhandbook.com/how-to-increase-hrv/', label: 'Marathon Handbook 2026 — HRV strategies' }
      },
      {
        key: 'cognitive-load',
        category: 'mental',
        question: 'In a sustained period of high mental effort?',
        name: 'Cognitive load',
        baseImpact: 'med',
        perDevice: {
          garmin: { impact: 'low', signal: 'HRV + HR', magnitude: 'Mild HRV drop · small HR bump', hurts: 'Mental exertion activates the sympathetic nervous system mildly. Garmin\'s HRV-only model picks up only the larger episodes.', helps: 'Brief breaks, breathwork, walks. The acute response is small and reversible.', timeline: 'Hours' },
          apple: { impact: 'low', signal: 'HRV (third-party)', magnitude: 'Small HealthKit HRV change', hurts: 'Mild and easy to miss without EDA.', helps: 'Breaks; Mindfulness sessions.', timeline: 'Hours' },
          samsung: { impact: 'high', signal: 'EDA (primary)', magnitude: 'Moderate EDA increase', hurts: 'EDA is uniquely sensitive to cognitive load — sustained mental effort raises tonic skin conductance even without emotional content. Samsung\'s score reflects this.', helps: 'Brief mental breaks drop EDA quickly. Slow breathing accelerates the drop.', timeline: 'Minutes' },
          google_fitbit: { impact: 'high', signal: 'cEDA (primary)', magnitude: 'cEDA tonic level rises throughout demanding work', hurts: 'Continuous EDA captures cognitive load in real time. Body Response alerts may fire during deep-focus blocks.', helps: 'Pomodoro-style breaks; brief breathwork. cEDA drops noticeably with each break.', timeline: 'Minutes' },
          whoop: { impact: 'low', signal: 'HRV', magnitude: 'Mild overnight HRV impact only if chronic', hurts: 'WHOOP doesn\'t see daytime cognitive load directly; only chronic states carry into overnight RMSSD.', helps: 'Manage chronic load via sleep + breathwork.', timeline: 'Days' },
          oura: { impact: 'low', signal: 'HRV', magnitude: 'Daytime Stress reflects sustained load', hurts: 'Oura\'s Daytime Stress catches sustained sympathetic activation but the resolution is coarser than EDA.', helps: 'Breaks + breathwork. Daytime Stress lifts within hours.', timeline: 'Hours' },
          polar: { impact: 'low', signal: 'HRV + RR (overnight)', magnitude: 'Only chronic load shows', hurts: 'No daytime measurement — cognitive load only visible if it carries into sleep.', helps: 'Wind down before bed.', timeline: 'Nights' }
        },
        source: { url: 'https://blog.biopac.com/electrodermal-activity-eda/', label: 'BIOPAC — Electrodermal Activity overview' }
      },
      {
        key: 'menstrual-cycle',
        category: 'physiology',
        question: 'In the luteal phase (week before period)?',
        name: 'Menstrual cycle (luteal phase)',
        baseImpact: 'med',
        perDevice: {
          garmin: { impact: 'low', signal: 'HRV', magnitude: 'Mild HRV reduction in luteal phase', hurts: 'Without skin temperature, Garmin sees only a small HRV shift across the cycle. Not flagged explicitly.', helps: 'Awareness — the luteal-phase HRV dip is normal and self-resolves at menses.', timeline: 'Resolves at menses onset' },
          apple: { impact: 'low', signal: 'HRV + Cycle Tracking', magnitude: 'HealthKit HRV dip; Cycle Tracking surfaces it', hurts: 'Apple\'s Cycle Tracking gives some context but no skin-temp signal on Series watches under Ultra.', helps: 'Use Cycle Tracking to align expectations.', timeline: 'Resolves at menses' },
          samsung: { impact: 'low', signal: 'HRV', magnitude: 'Small HRV shift', hurts: 'No skin-temp on Galaxy Watch wrist sensors, so cycle is implicit only.', helps: 'Awareness.', timeline: 'Resolves at menses' },
          google_fitbit: { impact: 'med', signal: 'HRV + skin temp', magnitude: 'Skin-temp rise of ~0.3–0.5°C in luteal phase', hurts: 'Pixel/Fitbit\'s skin-temp shifts with progesterone. Daily Stress Management Score may run a few points lower in luteal phase.', helps: 'Track via Cycle Tracking; use the data to plan recovery weeks.', timeline: 'Resolves at menses' },
          whoop: { impact: 'med', signal: 'HRV + skin temp', magnitude: 'Skin-temp rise + HRV dip', hurts: 'WHOOP\'s skin-temp deviation in the luteal phase can look like an overtraining or illness signal if not contextualized.', helps: 'Track with WHOOP Journal so the algorithm contextualizes cycle days.', timeline: 'Resolves at menses' },
          oura: { impact: 'high', signal: 'Skin temp (primary)', magnitude: '~0.3–0.5°C luteal-phase rise · used for period prediction', hurts: 'Oura\'s finger-site skin temp is the cleanest cycle signal in the consumer market — luteal phase clearly raises Cumulative Stress unless accounted for.', helps: 'Oura\'s Cycle Insights uses this signal directly. Treat the luteal HRV/temp shift as expected, not a stress flare.', timeline: 'Resolves at menses' },
          polar: { impact: 'low', signal: 'HRV (overnight)', magnitude: 'Small overnight HRV shift', hurts: 'No skin-temp; only HRV shift visible.', helps: 'Awareness.', timeline: 'Resolves at menses' }
        },
        source: { url: 'https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/', label: 'Ultrahuman — Skin temperature & cycle' }
      },
      {
        key: 'ambient-temp',
        category: 'environment',
        question: 'Tracking on a hot or humid day?',
        name: 'Ambient temperature & humidity',
        baseImpact: 'low',
        perDevice: {
          garmin: { impact: 'low', signal: 'HR (indirect)', magnitude: 'Mild RHR rise in heat', hurts: 'Heat raises baseline HR slightly. Garmin\'s HRV-only stress model is mostly insulated from ambient temperature.', helps: 'Be aware that hot days raise baseline HR. Sleep cool.', timeline: 'Resolves with cool environment' },
          apple: { impact: 'low', signal: 'HR (indirect)', magnitude: 'Mild HR rise in heat', hurts: 'Heat shifts HealthKit HR but not HRV directly.', helps: 'Sleep cool; hydrate.', timeline: 'Resolves quickly' },
          samsung: { impact: 'med', signal: 'EDA confounder', magnitude: 'Tonic EDA rises with thermoregulatory sweating', hurts: 'EDA is sensitive to ambient temperature — humid days raise tonic skin conductance independent of stress, so the score reads higher.', helps: 'Cool environment. Be aware that hot-day spikes may not be psychological stress.', timeline: 'Resolves quickly' },
          google_fitbit: { impact: 'high', signal: 'cEDA confounder', magnitude: 'Continuous EDA tonic level tracks ambient heat', hurts: 'Continuous EDA is most exposed to this confounder — hot/humid days drive Body Response alerts that aren\'t actually stress.', helps: 'Cool environment; cross-reference alerts with HRV trend before treating as stress.', timeline: 'Resolves with cool environment' },
          whoop: { impact: 'low', signal: 'Skin temp (overnight)', magnitude: 'Elevated overnight skin temp in hot rooms', hurts: 'Hot bedroom inflates overnight skin-temp readings.', helps: 'Sleep at 65–68°F.', timeline: 'Resolves quickly' },
          oura: { impact: 'med', signal: 'Skin temp', magnitude: 'Ambient confounds finger skin-temp readings', hurts: 'Cold rooms can drive finger skin-temp down enough to confuse the cycle algorithm; hot rooms inflate readings.', helps: 'Stable bedroom temperature. Oura recommends 65–68°F.', timeline: 'Resolves quickly' },
          polar: { impact: 'low', signal: 'HRV + RR (overnight)', magnitude: 'Hot rooms slightly elevate overnight RR', hurts: 'Modest impact on the first-4-hour reading.', helps: 'Sleep cool.', timeline: '1 night' }
        },
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9690349/', label: 'Ambient temperature & physiological signals (PMC9690349)' }
      },
      {
        key: 'sedentary',
        category: 'activity',
        question: 'Mostly sedentary — under 5,000 steps a day?',
        name: 'Sedentary lifestyle / low fitness',
        baseImpact: 'high',
        perDevice: {
          garmin: { impact: 'high', signal: 'HRV + RHR', magnitude: 'Lower HRV baseline · higher RHR (most common cause of high RHR)', hurts: 'A deconditioned heart works harder to maintain output. Garmin reads a sustained high RHR and a low HRV baseline — the score sits elevated.', helps: 'Build cardio gradually. Even daily walks lift HRV and drop RHR over weeks.', timeline: '4–12 weeks' },
          apple: { impact: 'high', signal: 'HRV + RHR', magnitude: 'Same baseline impact in HealthKit', hurts: 'HealthKit HRV stays low and RHR stays high without aerobic activity.', helps: 'Use Activity Rings as a forcing function. HealthKit HRV climbs over weeks.', timeline: '4–12 weeks' },
          samsung: { impact: 'high', signal: 'HRV + HR', magnitude: 'Low HRV baseline, elevated HR, more reactive EDA', hurts: 'Without aerobic conditioning, every metric runs worse — including EDA reactivity.', helps: 'Daily walks, gradual cardio. All three signals lift over weeks.', timeline: '4–12 weeks' },
          google_fitbit: { impact: 'high', signal: 'HRV + HR + Cardio Fitness Score', magnitude: 'Low Cardio Fitness Score drives lower daily Stress Management Score', hurts: 'Pixel/Fitbit explicitly weighs cardio fitness inside the daily score. Sedentary baseline = lower score consistently.', helps: 'Build steps and Active Zone Minutes. Cardio Fitness lifts within a few weeks.', timeline: '4–12 weeks' },
          whoop: { impact: 'high', signal: 'HRV + RR baseline', magnitude: 'Low HRV baseline + higher overnight RR', hurts: 'Without aerobic Strain, the 14-day baseline sits low and overnight RR sits higher.', helps: 'Build aerobic Strain consistently. Both metrics lift.', timeline: '4–12 weeks' },
          oura: { impact: 'high', signal: 'HRV + activity + sleep', magnitude: 'Low Activity Score drives lower Readiness', hurts: 'Oura\'s Cumulative Stress weighs activity. Sedentary days compound on the 31-day rollup.', helps: 'Hit daily activity goal. Cumulative Stress lifts gradually.', timeline: '4–12 weeks' },
          polar: { impact: 'high', signal: 'HRV + RR (overnight)', magnitude: 'ANS Charge baseline drifts negative', hurts: 'Polar is built around training. Without it, ANS Charge baseline stays flat.', helps: 'Build aerobic training. ANS Charge baseline lifts with cardio fitness.', timeline: '4–12 weeks' }
        },
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/', label: 'Exercise & RHR meta-analysis (PMC6306777)' }
      }
    ];
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

  _categoryIconKey(catKey) {
    return ({
      substance:   'droplet',
      sleep:       'moon',
      activity:    'dumbbell',
      mental:      'brain',
      physical:    'heart',
      environment: 'sun',
      physiology:  'thermometer'
    })[catKey] || 'sparkle';
  }

  _impactCfg(impact) {
    const map = {
      high: { label: 'High',   cls: 'imp-high',   weight: 3 },
      med:  { label: 'Medium', cls: 'imp-med',    weight: 2 },
      low:  { label: 'Low',    cls: 'imp-low',    weight: 1 }
    };
    return map[impact] || map.med;
  }

  _sensorChips(sensors) {
    const order = [
      ['hrv', 'HRV'],
      ['hr', 'Heart Rate'],
      ['eda', 'EDA'],
      ['skinTemp', 'Skin Temp'],
      ['rr', 'Resp. Rate'],
      ['spo2', 'SpO₂'],
      ['sleep', 'Sleep arch.']
    ];
    return order.map(([k, label]) => {
      const on = !!sensors[k];
      return `<span class="sensor-chip ${on ? 'on' : 'off'}">
        <span class="sensor-chip-icon" aria-hidden="true">${on ? this._icon('check') : this._icon('x')}</span>
        ${label}
      </span>`;
    }).join('');
  }

  _renderDeviceCard(deviceKey) {
    const d = this._devices[deviceKey];
    if (!d) return '';
    const sensorCount = Object.values(d.sensors).filter(Boolean).length;
    return `
      <article class="device-card" style="--accent:${d.color}">
        <span class="device-card-stripe" aria-hidden="true"></span>
        <header class="device-card-head">
          <div class="device-card-icon" aria-hidden="true">${this._icon('watch')}</div>
          <div class="device-card-titles">
            <h3 class="device-card-name">${d.name}</h3>
            <span class="device-card-model">${d.modelLine}</span>
          </div>
          <span class="device-card-pill">${sensorCount} signal${sensorCount === 1 ? '' : 's'}</span>
        </header>

        <div class="device-card-section">
          <span class="device-card-eyebrow">Sensors fed into stress</span>
          <div class="device-sensor-row" aria-label="Sensors used by ${d.name}">${this._sensorChips(d.sensors)}</div>
        </div>

        <dl class="device-card-rows">
          <div class="device-card-row"><dt>Algorithm</dt><dd>${d.algorithm}</dd></div>
          <div class="device-card-row"><dt>Scale</dt><dd>${d.scale}</dd></div>
          <div class="device-card-row"><dt>Baseline</dt><dd>${d.baseline}</dd></div>
          <div class="device-card-row"><dt>Coverage</dt><dd>${d.coverage}</dd></div>
        </dl>

        <div class="device-card-callouts">
          <div class="callout-box callout-strength">
            <div class="callout-box-head"><span class="callout-box-icon">${this._icon('sparkle')}</span>Unique strength</div>
            <p>${d.strength}</p>
          </div>
          <div class="callout-box callout-watchout">
            <div class="callout-box-head"><span class="callout-box-icon">${this._icon('alert')}</span>Watch out for</div>
            <p>${d.limitation}</p>
          </div>
        </div>
      </article>`;
  }

  _renderDeviceDiff(d1Key, d2Key) {
    const d1 = this._devices[d1Key];
    const d2 = this._devices[d2Key];
    if (!d1 || !d2 || d1Key === d2Key) return '';
    const sensorLabels = { hrv: 'HRV', hr: 'Heart Rate', eda: 'EDA', skinTemp: 'Skin Temp', rr: 'Respiratory Rate', spo2: 'SpO₂', sleep: 'Sleep architecture' };
    const onlyIn1 = Object.keys(d1.sensors).filter(k => d1.sensors[k] && !d2.sensors[k]).map(k => sensorLabels[k]);
    const onlyIn2 = Object.keys(d2.sensors).filter(k => d2.sensors[k] && !d1.sensors[k]).map(k => sensorLabels[k]);
    const shared = Object.keys(d1.sensors).filter(k => d1.sensors[k] && d2.sensors[k]).map(k => sensorLabels[k]);
    const pill = (label) => `<span class="diff-pill">${label}</span>`;
    const empty = '<span class="diff-empty">None</span>';
    return `
      <div class="device-diff">
        <div class="device-diff-glow" aria-hidden="true"></div>
        <div class="device-diff-head">
          <span class="device-diff-eyebrow">Where they differ</span>
          <h3 class="device-diff-title">${d1.name} <span class="device-diff-vs">vs</span> ${d2.name}</h3>
        </div>
        <div class="device-diff-rows">
          <div class="diff-row">
            <span class="diff-row-label diff-shared">Shared signals</span>
            <div class="diff-row-pills">${shared.length ? shared.map(pill).join('') : empty}</div>
          </div>
          <div class="diff-row">
            <span class="diff-row-label diff-only" style="--accent:${d1.color}">Only ${d1.name}</span>
            <div class="diff-row-pills">${onlyIn1.length ? onlyIn1.map(pill).join('') : empty}</div>
          </div>
          <div class="diff-row">
            <span class="diff-row-label diff-only" style="--accent:${d2.color}">Only ${d2.name}</span>
            <div class="diff-row-pills">${onlyIn2.length ? onlyIn2.map(pill).join('') : empty}</div>
          </div>
        </div>
      </div>`;
  }

  _renderComparisonModule() {
    const devices = this._devices;
    const isCompare = this._mode === 'compare';
    const selectorOpts = (selected) => Object.entries(devices)
      .map(([k, d]) => `<option value="${k}" ${k === selected ? 'selected' : ''}>${d.name}</option>`).join('');

    const selectorRow = isCompare ? `
      <div class="device-selectors compare">
        <div class="selector-group">
          <label>Device 1</label>
          <div class="selector-wrap" style="--accent:${devices[this._device1].color}"><select id="device1">${selectorOpts(this._device1)}</select></div>
        </div>
        <div class="vs-badge" aria-hidden="true">VS</div>
        <div class="selector-group">
          <label>Device 2</label>
          <div class="selector-wrap" style="--accent:${devices[this._device2].color}"><select id="device2">${selectorOpts(this._device2)}</select></div>
        </div>
      </div>
    ` : `
      <div class="device-selectors single">
        <div class="selector-group">
          <label>Your wearable</label>
          <div class="selector-wrap" style="--accent:${devices[this._device1].color}"><select id="device1">${selectorOpts(this._device1)}</select></div>
        </div>
      </div>
    `;

    const cards = isCompare
      ? `<div class="device-card-grid two">${this._renderDeviceCard(this._device1)}${this._renderDeviceCard(this._device2)}</div>${this._renderDeviceDiff(this._device1, this._device2)}`
      : `<div class="device-card-grid one">${this._renderDeviceCard(this._device1)}</div>`;

    return `
      <section class="comparison-section section-bg-gray" id="compare">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('compare')}</span>How your device measures stress</span>
            <h2 class="section-h2">Pick your wearable — see <em>what it actually reads</em>.</h2>
            <p class="section-lede">Stress scores aren't comparable across brands. Each device leans on a different mix of HRV, EDA, skin temperature, and respiratory rate. The factor cards below re-sort by the biggest movers for whichever device you pick.</p>
          </div>

          <div class="comparison-shell">
            <div class="comparison-toolbar">
              <div class="mode-toggle" role="tablist" aria-label="Comparison mode">
                <button class="mode-btn ${this._mode === 'single' ? 'active' : ''}" data-mode="single" role="tab" aria-selected="${this._mode === 'single'}">
                  <span class="mode-btn-icon" aria-hidden="true">${this._icon('watch')}</span>Single device
                </button>
                <button class="mode-btn ${this._mode === 'compare' ? 'active' : ''}" data-mode="compare" role="tab" aria-selected="${this._mode === 'compare'}">
                  <span class="mode-btn-icon" aria-hidden="true">${this._icon('compare')}</span>Compare two
                </button>
              </div>
              ${selectorRow}
            </div>
            ${cards}
          </div>
        </div>
      </section>`;
  }

  _renderImpactBadge(impact, deviceName) {
    const cfg = this._impactCfg(impact);
    return `<span class="impact-badge ${cfg.cls}" aria-label="${cfg.label} impact on ${deviceName}">
      <span class="impact-dot" aria-hidden="true"></span>${cfg.label} on ${deviceName}
    </span>`;
  }

  _renderImpactPill(impact) {
    const cfg = this._impactCfg(impact);
    return `<span class="impact-pill ${cfg.cls}">
      <span class="impact-pill-bars" aria-hidden="true">
        <span class="bar b1"></span><span class="bar b2"></span><span class="bar b3"></span>
      </span>
      <span class="impact-pill-text">${cfg.label} impact</span>
    </span>`;
  }

  _renderEvidenceLeaderboard() {
    const d1 = this._devices[this._device1];
    const factors = this._factors.slice();
    const ranked = factors.map(f => {
      const pd = f.perDevice[this._device1];
      const w = pd ? this._impactCfg(pd.impact).weight : this._impactCfg(f.baseImpact).weight;
      return { ...f, _w: w, _pd: pd };
    }).sort((a, b) => b._w - a._w || a.name.localeCompare(b.name));

    const rows = ranked.map((f, i) => {
      const cfg = this._impactCfg(f._pd ? f._pd.impact : f.baseImpact);
      const pct = (cfg.weight / 3) * 100;
      return `
        <button class="lb-row" data-fact-jump="${f.key}" style="--delay:${i * 30}ms" aria-label="Jump to ${f.name}">
          <span class="lb-rank">${String(i + 1).padStart(2, '0')}</span>
          <span class="lb-name">${f.name}</span>
          <span class="lb-track" aria-hidden="true">
            <span class="lb-bar lb-${cfg.cls}" style="width:${pct}%"></span>
          </span>
          <span class="lb-impact lb-${cfg.cls}">${cfg.label}</span>
        </button>`;
    }).join('');

    return `
      <section class="evidence-section section-bg-white">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('target')}</span>Top movers for ${d1.name}</span>
            <h2 class="section-h2">What moves your <em>${d1.name}</em> score most.</h2>
            <p class="section-lede">Every factor ranked by how much it nudges your stress reading on this specific device. Tap any row to jump to its full mechanism and action below.</p>
          </div>
          <div class="leaderboard">
            <div class="lb-head">
              <span class="lb-head-eyebrow">Ranked impact · ${d1.name}</span>
              <span class="lb-head-meta">${factors.length} factors</span>
            </div>
            <div class="lb-rows">${rows}</div>
            <div class="lb-legend">
              <span class="lb-legend-item"><span class="lb-sw lb-imp-high"></span>High</span>
              <span class="lb-legend-item"><span class="lb-sw lb-imp-med"></span>Medium</span>
              <span class="lb-legend-item"><span class="lb-sw lb-imp-low"></span>Low</span>
            </div>
          </div>
        </div>
      </section>`;
  }

  _renderAppCta() {
    const iosUrl = 'https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589';
    return `
      <section class="app-cta-section section-bg-white">
        <div class="container">
          <div class="app-cta animate-on-scroll">
            <div class="app-cta-glow" aria-hidden="true"></div>
            <div class="app-cta-content">
              <div class="app-cta-badge"><span class="pulse-dot"></span>Free Forever Plan</div>
              <h2>See what's actually moving <span class="highlight">your stress score</span></h2>
              <p>Kygo Health connects your wearable's stress signals with what you eat, drink, and do — pinpointing the personal correlations a generic stress score can't show you.</p>
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
              <h3 class="article-title">Wearable Stress Research: How 7 Brands Actually Measure Stress <span class="article-year">(2026)</span></h3>
              <p class="article-desc">Every signal, every algorithm, every cited study in one long-form read.</p>
            </div>
            <span class="article-go" aria-hidden="true">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>`;
  }

  _renderMythsSection() {
    const groups = ['Reading the score', 'Devices', 'Signals', 'Lifestyle'];
    const counts = {};
    groups.forEach(g => counts[g] = this._myths.filter(m => m.cat === g).length);
    const total = this._myths.length;
    const picked = this._mythsCatPick;

    const tiles = groups.map(g => {
      const isActive = picked === g;
      return `
        <button class="picker-tile ${isActive ? 'active' : ''}" data-myths-cat="${g}" aria-pressed="${isActive}">
          <span class="picker-tile-name">${g}</span>
          <span class="picker-tile-count">${counts[g]}</span>
        </button>`;
    }).join('');

    let panel = '';
    if (picked) {
      const items = this._myths.filter(m => m.cat === picked);
      const cards = items.map(m => `
        <article class="myth-card">
          <div class="myth-row">
            <h4 class="myth-name">${m.name}</h4>
            <span class="myth-badge">Myth</span>
          </div>
          <p class="myth-why">${m.why}</p>
        </article>`).join('');
      panel = `
        <div class="picker-panel">
          <div class="picker-panel-head">
            <h3 class="picker-panel-title">${picked}<span class="picker-panel-meta">${items.length} debunked</span></h3>
          </div>
          <div class="myth-grid">${cards}</div>
        </div>`;
    } else {
      panel = `
        <div class="picker-empty">
          <span class="picker-empty-icon" aria-hidden="true">${this._icon('ghost')}</span>
          <p>Tap a category above to see the most common stress-wearable misconceptions debunked.</p>
        </div>`;
    }

    return `
      <section class="myths-section section-bg-white" aria-labelledby="myths-title">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow amber"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('ghost')}</span>Common Myths</span>
            <h2 class="section-h2" id="myths-title">What people <em>get wrong</em> about stress scores (${total} debunked).</h2>
            <p class="section-lede">A "stress score" sits at the intersection of physiology, signal processing, and marketing — easy to misread. Pick a category to see the misconceptions worth dropping.</p>
          </div>
          <div class="picker-tiles myths-tiles">${tiles}</div>
          ${panel}
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

  _renderHurtsHelps(deviceKey, perDevice) {
    const d = this._devices[deviceKey];
    const pd = perDevice[deviceKey];
    if (!d || !pd) {
      return `<div class="hh-missing">${d ? d.name : 'This device'} doesn't have documented mechanisms for this factor in the source research.</div>`;
    }
    return `
      <div class="hh-grid">
        <div class="hh-col hh-hurts">
          <div class="hh-head">
            <span class="hh-eyebrow">What's hurting</span>
            <span class="hh-magnitude">${pd.magnitude}</span>
          </div>
          <p class="hh-body">${pd.hurts}</p>
          <span class="hh-tag">Signal: ${pd.signal}</span>
        </div>
        <div class="hh-col hh-helps">
          <div class="hh-head">
            <span class="hh-eyebrow">What helps</span>
            ${pd.timeline ? `<span class="hh-timeline">Expect change in ${pd.timeline}</span>` : ''}
          </div>
          <p class="hh-body">${pd.helps}</p>
        </div>
      </div>`;
  }

  _sortedFactors() {
    const factors = this._factors.slice();
    const cat = this._categoryFilter;
    let shown = cat ? factors.filter(f => f.category === cat) : factors;
    if (this._listSort === 'impact') {
      const w = (f) => {
        const pd = f.perDevice[this._device1];
        return pd ? this._impactCfg(pd.impact).weight : this._impactCfg(f.baseImpact).weight;
      };
      shown.sort((a, b) => w(b) - w(a) || a.name.localeCompare(b.name));
    } else if (this._listSort === 'alpha') {
      shown.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this._listSort === 'category') {
      shown.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    }
    return shown;
  }

  _renderFactorCard(f) {
    const isExp = this._listExpandedKey === f.key;
    const d1 = this._devices[this._device1];
    const pd1 = f.perDevice[this._device1];
    const impact = pd1 ? pd1.impact : f.baseImpact;
    const cat = (this._categoryMeta[f.category] || {}).label || '';
    const catIcon = this._categoryIconKey(f.category);
    const isCompare = this._mode === 'compare';

    let body = '';
    if (isExp) {
      if (isCompare) {
        const d2 = this._devices[this._device2];
        body = `
          <div class="fact-body">
            <div class="device-block">
              <div class="device-block-head">
                <span class="device-block-name" style="--accent:${d1.color}">On ${d1.name}</span>
                ${this._renderImpactBadge(pd1 ? pd1.impact : f.baseImpact, d1.name)}
              </div>
              ${this._renderHurtsHelps(this._device1, f.perDevice)}
            </div>
            <div class="device-block">
              <div class="device-block-head">
                <span class="device-block-name" style="--accent:${d2.color}">On ${d2.name}</span>
                ${this._renderImpactBadge(f.perDevice[this._device2] ? f.perDevice[this._device2].impact : f.baseImpact, d2.name)}
              </div>
              ${this._renderHurtsHelps(this._device2, f.perDevice)}
            </div>
            <div class="fact-source-row">
              <span class="fact-source-lbl">Source</span>
              <a href="${f.source.url}" target="_blank" rel="noopener" class="source-link">${f.source.label} ${this._icon('externalLink')}</a>
            </div>
          </div>`;
      } else {
        body = `
          <div class="fact-body">
            ${this._renderHurtsHelps(this._device1, f.perDevice)}
            <div class="fact-source-row">
              <span class="fact-source-lbl">Source</span>
              <a href="${f.source.url}" target="_blank" rel="noopener" class="source-link">${f.source.label} ${this._icon('externalLink')}</a>
            </div>
          </div>`;
      }
    }

    return `
      <article class="fact-card ${isExp ? 'expanded' : ''}" data-fact-key="${f.key}">
        <button class="fact-head" aria-expanded="${isExp}">
          <span class="fact-cat-icon" aria-hidden="true">${this._icon(catIcon)}</span>
          <span class="fact-meta">
            <span class="fact-cat-line">
              <span class="fact-cat">${cat}</span>
              <span class="fact-cat-dot" aria-hidden="true">·</span>
              <span class="fact-cat-q">Question</span>
            </span>
            <span class="fact-question">${f.question}</span>
            <span class="fact-name">${f.name} · on ${d1.name}</span>
          </span>
          <span class="fact-impact-cell">
            ${this._renderImpactPill(impact)}
          </span>
          <span class="fact-chev" aria-hidden="true">${this._icon('chevDown')}</span>
        </button>
        ${body}
      </article>`;
  }

  _renderFactorList() {
    const shown = this._sortedFactors();
    if (!shown.length) return '<p class="dash-empty">No factors match this filter.</p>';
    return `<div class="fact-list">${shown.map(f => this._renderFactorCard(f)).join('')}</div>`;
  }

  _renderSortBar() {
    const opts = [
      { k: 'impact', l: 'Impact (default)' },
      { k: 'alpha', l: 'A–Z' },
      { k: 'category', l: 'Category' }
    ];
    const total = this._factors.length;
    const shown = this._sortedFactors().length;
    const cat = this._categoryFilter;
    const meta = this._categoryMeta[cat];
    const countHtml = cat
      ? `<span class="list-result-count">Showing <strong>${shown}</strong> of ${total} · ${meta ? meta.label : ''}</span>`
      : `<span class="list-result-count"><strong>${total}</strong> factors</span>`;
    return `
      <div class="list-toolbar">
        <div class="list-toolbar-row">
          ${countHtml}
          <span class="list-sort-label">Sort by</span>
        </div>
        <div class="list-sort-btns">
          ${opts.map(o => `<button class="list-sort-btn ${this._listSort === o.k ? 'active' : ''}" data-sort="${o.k}">${o.l}</button>`).join('')}
        </div>
      </div>`;
  }

  _renderCategoryTiles() {
    const counts = {};
    this._factors.forEach(f => { counts[f.category] = (counts[f.category] || 0) + 1; });
    const tiles = Object.entries(this._categoryMeta).map(([k, m]) => {
      const isActive = this._categoryFilter === k;
      return `
        <button class="picker-tile ${isActive ? 'active' : ''}" data-cat="${k}" aria-pressed="${isActive}">
          <span class="picker-tile-name">${m.label}</span>
          <span class="picker-tile-count">${counts[k] || 0}</span>
        </button>`;
    }).join('');
    const allTile = `
      <button class="picker-tile ${this._categoryFilter === null ? 'active' : ''}" data-cat="__all" aria-pressed="${this._categoryFilter === null}">
        <span class="picker-tile-name">All</span>
        <span class="picker-tile-count">${this._factors.length}</span>
      </button>`;
    return `<div class="picker-tiles">${allTile}${tiles}</div>`;
  }

  _renderFactorsSection() {
    const d1 = this._devices[this._device1];
    return `
      <section class="factors-section section-bg-gray">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('activity')}</span>What moves your score</span>
            <h2 class="section-h2">${this._factors.length} factors, sorted for <em>${d1.name}</em>.</h2>
            <p class="section-lede">Each card has two sides: what's hurting your stress reading right now, and what specifically helps. The mechanism is tied to your device's actual signals, not generic advice.</p>
          </div>
          ${this._renderCategoryTiles()}
          ${this._renderSortBar()}
          ${this._renderFactorList()}
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
      <section class="sources-section section-bg-white">
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
    const totalFactors = this._factors.length;
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
          <div class="hero-kicker animate-on-scroll"><span class="hero-dot" aria-hidden="true"></span>${totalFactors} Factors • ${totalDevices} Wearables • All Peer-Reviewed</div>
          <h1 class="hero-title animate-on-scroll">How does <em>your wearable</em> measure stress?</h1>
          <p class="hero-sub animate-on-scroll">Every brand reads stress differently — HRV, EDA, skin temp, breathing rate. Pick your device and the factor cards re-sort around what actually moves <strong>your</strong> score.</p>
          <div class="animate-on-scroll">
            <div class="hero-meta">
              <div class="hero-cell"><span class="hero-num">${totalFactors}</span><span class="hero-lbl">Factors tracked</span></div>
              <div class="hero-cell"><span class="hero-num">${totalDevices}</span><span class="hero-lbl">Wearables compared</span></div>
              <div class="hero-cell"><span class="hero-num hero-num--pos">82%</span><span class="hero-lbl">Multi-signal accuracy</span></div>
              <div class="hero-cell"><span class="hero-num">77%</span><span class="hero-lbl">HRV-only accuracy</span></div>
            </div>
          </div>
          ${this._heroWaveSvg()}
        </div>
      </section>

      <div class="animate-on-scroll">${this._renderComparisonModule()}</div>
      <div class="animate-on-scroll">${this._renderEvidenceLeaderboard()}</div>
      ${this._renderArticleCta()}
      ${this._renderAppCta()}
      <div class="animate-on-scroll">${this._renderFactorsSection()}</div>
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

      const modeBtn = e.target.closest('.mode-btn');
      if (modeBtn) {
        this._mode = modeBtn.dataset.mode;
        this.render();
        this._setupAnimations();
        return;
      }

      const tile = e.target.closest('[data-cat]');
      if (tile) {
        const k = tile.dataset.cat;
        this._categoryFilter = (k === '__all') ? null : (this._categoryFilter === k ? null : k);
        this._listExpandedKey = null;
        const sec = shadow.querySelector('.factors-section');
        if (sec) sec.outerHTML = this._renderFactorsSection();
        return;
      }

      const sortBtn = e.target.closest('.list-sort-btn');
      if (sortBtn) {
        this._listSort = sortBtn.dataset.sort;
        const sec = shadow.querySelector('.factors-section');
        if (sec) sec.outerHTML = this._renderFactorsSection();
        return;
      }

      const mythsTile = e.target.closest('[data-myths-cat]');
      if (mythsTile) {
        const k = mythsTile.dataset.mythsCat;
        this._mythsCatPick = this._mythsCatPick === k ? null : k;
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

      const jumpBtn = e.target.closest('[data-fact-jump]');
      if (jumpBtn) {
        const k = jumpBtn.dataset.factJump;
        this._categoryFilter = null;
        this._listSort = 'impact';
        this._listExpandedKey = k;
        const sec = shadow.querySelector('.factors-section');
        if (sec) sec.outerHTML = this._renderFactorsSection();
        requestAnimationFrame(() => {
          const target = shadow.querySelector(`[data-fact-key="${k}"]`);
          if (target && target.scrollIntoView) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        return;
      }
    });

    shadow.addEventListener('change', (e) => {
      if (e.target.id === 'device1') {
        this._device1 = e.target.value;
        this._updateDeviceDependentSections();
        return;
      }
      if (e.target.id === 'device2') {
        this._device2 = e.target.value;
        this._updateDeviceDependentSections();
        return;
      }
    });
  }

  _updateDeviceDependentSections() {
    const shadow = this.shadowRoot;
    const compSec = shadow.querySelector('.comparison-section');
    if (compSec) compSec.outerHTML = this._renderComparisonModule();
    const evSec = shadow.querySelector('.evidence-section');
    if (evSec) evSec.outerHTML = this._renderEvidenceLeaderboard();
    const factSec = shadow.querySelector('.factors-section');
    if (factSec) factSec.outerHTML = this._renderFactorsSection();
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
      .hero-kicker { display: inline-flex; align-items: center; gap: 7px; font-size: 9.5px; font-weight: 700; color: var(--green-dark); background: var(--green-light); padding: 6px 11px; border-radius: 9999px; letter-spacing: 0.4px; text-transform: uppercase; margin-bottom: 20px; line-height: 1.4; }
      .hero-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 0 rgba(34,197,94,0.6); animation: pulse 2.2s infinite; flex-shrink: 0; }
      @media (min-width: 480px) { .hero-kicker { font-size: 10.5px; white-space: nowrap; } }
      @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.6);} 70%{box-shadow:0 0 0 8px rgba(34,197,94,0);} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0);} }
      .hero-title { font-size: clamp(32px, 8.5vw, 76px); line-height: 1.02; letter-spacing: -0.03em; font-weight: 600; color: var(--dark); max-width: 16ch; }
      .hero-title em { font-style: normal; color: var(--green); font-family: inherit; }
      .hero-sub { margin: 20px 0 0; max-width: 56ch; font-size: clamp(15px, 2.2vw, 19px); line-height: 1.5; color: var(--gray-600); }
      .hero-sub strong { color: var(--dark); font-weight: 600; }
      .hero-meta { margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-top: 1px solid var(--gray-200); padding-top: 20px; max-width: 760px; }
      .hero-cell { padding: 8px 14px 8px 0; border-right: 1px solid var(--gray-200); min-width: 0; }
      .hero-cell:nth-child(2n) { border-right: 0; padding-right: 0; padding-left: 16px; }
      .hero-cell:nth-child(-n+2) { border-bottom: 1px solid var(--gray-200); padding-bottom: 16px; }
      .hero-cell:nth-child(n+3) { padding-top: 16px; }
      .hero-num { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: clamp(26px, 6.5vw, 40px); color: var(--dark); letter-spacing: -0.02em; font-feature-settings: "tnum" 1; display: block; line-height: 1; }
      .hero-num--pos { color: var(--green-dark); }
      .hero-lbl { font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; color: var(--gray-400); font-weight: 600; margin-top: 6px; display: block; }
      .hero-wave { display: none; }
      @media (min-width: 640px) {
        .hero-meta { grid-template-columns: repeat(4, 1fr); }
        .hero-cell { padding: 0 16px; border-right: 1px solid var(--gray-200); border-bottom: 0 !important; }
        .hero-cell:first-child { padding-left: 0; }
        .hero-cell:last-child { border-right: 0; padding-right: 0; }
        .hero-cell:nth-child(n+3), .hero-cell:nth-child(-n+2) { padding-top: 0; padding-bottom: 0; }
      }
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
      .comparison-section, .evidence-section, .factors-section, .callout-section, .sources-section, .picks-section, .app-cta-section, .myths-section, .article-section { padding: 48px 0 56px; }
      @media (min-width: 768px) {
        .comparison-section, .evidence-section, .factors-section, .callout-section, .sources-section, .picks-section, .app-cta-section, .myths-section { padding: 64px 0 72px; }
        .article-section { padding: 56px 0; }
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

      /* PICKER PANEL (myths) */
      .picker-panel { background: #fff; border: 1px solid var(--gray-200); border-radius: 18px; padding: 18px; box-shadow: 0 1px 0 rgba(15,23,42,0.03); animation: panelIn .35s cubic-bezier(0.16, 1, 0.3, 1); }
      @keyframes panelIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      .picker-panel-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--gray-100); }
      .picker-panel-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); margin: 0; letter-spacing: -0.01em; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
      .picker-panel-meta { font-size: 11.5px; font-weight: 600; color: var(--gray-400); letter-spacing: 0.5px; text-transform: uppercase; }
      .picker-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 32px 20px; background: #fff; border: 1px dashed var(--gray-200); border-radius: 18px; text-align: center; color: var(--gray-600); font-size: 13.5px; line-height: 1.5; }
      .picker-empty-icon { width: 32px; height: 32px; border-radius: 9px; background: var(--gray-100); color: var(--gray-400); display: inline-flex; align-items: center; justify-content: center; }
      .picker-empty-icon svg { width: 18px; height: 18px; }
      .picker-empty p { margin: 0; max-width: 36ch; }

      /* MYTH CARDS */
      .myth-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
      .myth-card { background: #fff; border: 1px solid var(--gray-200); border-radius: 12px; padding: 13px 15px; transition: border-color .15s; }
      .myth-card:hover { border-color: var(--gray-300); }
      .myth-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
      .myth-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13.5px; color: var(--dark); margin: 0; line-height: 1.3; flex: 1; min-width: 0; letter-spacing: -0.005em; }
      .myth-badge { font-size: 9.5px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--amber); background: rgba(180,83,9,0.08); padding: 3px 8px; border-radius: 9999px; white-space: nowrap; flex-shrink: 0; }
      .myth-why { margin: 6px 0 0; font-size: 12.5px; color: var(--gray-600); line-height: 1.55; }
      .myths-tiles { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 680px) {
        .myth-grid { grid-template-columns: repeat(2, 1fr); }
        .myths-tiles { grid-template-columns: repeat(4, 1fr); }
      }
      @media (min-width: 1024px) {
        .myth-grid { grid-template-columns: repeat(3, 1fr); }
      }

      /* COMPARISON SHELL */
      .comparison-shell { background: #fff; border: 1px solid var(--gray-200); border-radius: 22px; padding: 22px; box-shadow: 0 1px 0 rgba(15,23,42,0.03); }
      @media (min-width: 768px) { .comparison-shell { padding: 28px; } }
      .comparison-toolbar { display: flex; flex-direction: column; gap: 16px; padding-bottom: 18px; margin-bottom: 18px; border-bottom: 1px dashed var(--gray-200); }
      @media (min-width: 880px) { .comparison-toolbar { flex-direction: row; justify-content: space-between; align-items: center; } }

      /* MODE TOGGLE */
      .mode-toggle { display: inline-flex; gap: 4px; padding: 4px; background: var(--gray-100); border-radius: 9999px; align-self: flex-start; }
      .mode-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 9999px; border: 0; background: transparent; color: var(--gray-600); font-family: inherit; font-weight: 600; font-size: 13px; cursor: pointer; transition: background .2s, color .2s, box-shadow .2s; white-space: nowrap; }
      .mode-btn:hover { color: var(--dark); }
      .mode-btn.active { background: var(--dark); color: #fff; box-shadow: 0 4px 12px rgba(15,23,42,0.18); }
      .mode-btn-icon { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; }
      .mode-btn-icon svg { width: 14px; height: 14px; }

      /* DEVICE SELECTORS */
      .device-selectors { display: flex; align-items: flex-end; justify-content: flex-end; gap: 12px; flex-wrap: wrap; }
      .device-selectors.single { justify-content: flex-end; }
      .selector-group { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
      .selector-group label { font-size: 10.5px; font-weight: 700; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.6px; }
      .selector-wrap { position: relative; }
      .selector-wrap::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: var(--accent, var(--green)); border-radius: 0 0 var(--radius-sm) var(--radius-sm); pointer-events: none; opacity: 0.85; }
      .selector-wrap select { padding: 11px 36px 11px 16px; border-radius: var(--radius-sm); border: 1.5px solid var(--gray-200); font-family: inherit; font-size: 14.5px; font-weight: 600; background: #fff; color: var(--dark); cursor: pointer; min-width: 200px; transition: border-color .2s, box-shadow .2s; appearance: auto; }
      .selector-wrap select:hover { border-color: var(--gray-300); }
      .selector-wrap select:focus { outline: none; border-color: var(--accent, var(--green)); box-shadow: 0 0 0 3px rgba(34,197,94,0.12); }
      .vs-badge { width: 38px; height: 38px; border-radius: 50%; background: var(--dark); color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(15,23,42,0.18); margin-bottom: 4px; flex-shrink: 0; }

      /* DEVICE CARD */
      .device-card-grid { display: grid; gap: 14px; grid-template-columns: 1fr; margin-top: 4px; }
      @media (min-width: 920px) { .device-card-grid.two { grid-template-columns: 1fr 1fr; } }
      .device-card { position: relative; background: #fff; border: 1px solid var(--gray-200); border-radius: 18px; padding: 22px; overflow: hidden; transition: border-color .15s, box-shadow .15s, transform .15s; }
      .device-card:hover { border-color: var(--gray-300); box-shadow: 0 6px 18px rgba(15,23,42,0.05); transform: translateY(-1px); }
      .device-card-stripe { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--accent, var(--green)); }
      .device-card-head { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; padding-top: 4px; }
      .device-card-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--accent, var(--green)); color: #fff; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(15,23,42,0.08); }
      .device-card-icon svg { width: 22px; height: 22px; }
      .device-card-titles { flex: 1; min-width: 0; }
      .device-card-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 20px; color: var(--dark); line-height: 1.2; letter-spacing: -0.01em; }
      .device-card-model { display: block; margin-top: 2px; font-size: 12.5px; color: var(--gray-600); font-weight: 500; }
      .device-card-pill { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; background: var(--gray-100); color: var(--gray-600); white-space: nowrap; flex-shrink: 0; }
      .device-card-section { margin-bottom: 18px; padding-bottom: 16px; border-bottom: 1px dashed var(--gray-200); }
      .device-card-eyebrow { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase; color: var(--gray-400); margin-bottom: 10px; }
      .device-sensor-row { display: flex; flex-wrap: wrap; gap: 6px; }
      .sensor-chip { display: inline-flex; align-items: center; gap: 5px; font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 600; padding: 4px 10px 4px 6px; border-radius: 9999px; letter-spacing: 0.1px; line-height: 1.3; }
      .sensor-chip.on { background: var(--green-light); color: var(--green-dark); }
      .sensor-chip.off { background: var(--gray-100); color: var(--gray-400); }
      .sensor-chip-icon { display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }
      .sensor-chip.on .sensor-chip-icon { background: var(--green); color: #fff; }
      .sensor-chip.off .sensor-chip-icon { background: var(--gray-300); color: #fff; }
      .sensor-chip-icon svg { width: 9px; height: 9px; }

      .device-card-rows { display: grid; gap: 12px; margin-bottom: 18px; }
      .device-card-row { display: grid; grid-template-columns: 100px 1fr; gap: 14px; align-items: start; }
      .device-card-row dt { font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); padding-top: 2px; }
      .device-card-row dd { font-size: 13.5px; color: var(--gray-700); line-height: 1.55; }
      @media (max-width: 480px) {
        .device-card-row { grid-template-columns: 1fr; gap: 2px; }
      }

      .device-card-callouts { display: grid; gap: 8px; }
      @media (min-width: 540px) { .device-card-callouts { grid-template-columns: 1fr 1fr; } }
      .callout-box { padding: 12px 14px; border-radius: 12px; border: 1px solid; }
      .callout-strength { background: rgba(34,197,94,0.06); border-color: rgba(34,197,94,0.22); }
      .callout-watchout { background: rgba(180,83,9,0.05); border-color: rgba(180,83,9,0.20); }
      .callout-box-head { display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 6px; }
      .callout-strength .callout-box-head { color: var(--green-dark); }
      .callout-watchout .callout-box-head { color: var(--amber); }
      .callout-box-icon { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; }
      .callout-box-icon svg { width: 14px; height: 14px; }
      .callout-box p { margin: 0; font-size: 13px; color: var(--gray-700); line-height: 1.5; }

      /* DIFF PANEL */
      .device-diff { position: relative; margin-top: 16px; background: var(--dark-card); color: #fff; border-radius: 18px; padding: 24px; overflow: hidden; }
      .device-diff-glow { position: absolute; top: -50px; right: -50px; width: 240px; height: 240px; background: radial-gradient(circle, rgba(34,197,94,0.22) 0%, transparent 70%); pointer-events: none; }
      .device-diff-head { position: relative; z-index: 1; margin-bottom: 16px; }
      .device-diff-eyebrow { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.55); margin-bottom: 6px; }
      .device-diff-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 22px; color: #fff; letter-spacing: -0.01em; margin: 0; }
      .device-diff-vs { color: var(--green); font-style: italic; font-weight: 500; padding: 0 4px; }
      .device-diff-rows { position: relative; z-index: 1; display: grid; gap: 10px; }
      .diff-row { display: grid; grid-template-columns: 160px 1fr; gap: 14px; align-items: center; padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.08); }
      .diff-row:first-child { border-top: 0; padding-top: 4px; }
      .diff-row-label { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 9999px; letter-spacing: 0.3px; text-align: center; white-space: nowrap; justify-self: start; }
      .diff-shared { background: rgba(255,255,255,0.10); color: rgba(255,255,255,0.85); }
      .diff-only { background: var(--accent, var(--green)); color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.18); }
      .diff-row-pills { display: flex; flex-wrap: wrap; gap: 6px; }
      .diff-pill { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; background: rgba(255,255,255,0.10); color: #fff; }
      .diff-empty { font-size: 12.5px; color: rgba(255,255,255,0.55); font-style: italic; }
      @media (max-width: 540px) {
        .diff-row { grid-template-columns: 1fr; gap: 6px; }
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

      /* PICKER TILES */
      .picker-tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-bottom: 16px; }
      .picker-tile { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 13px 14px; min-height: 52px; min-width: 0; background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; font-family: inherit; cursor: pointer; transition: border-color .15s, transform .15s, background .15s, box-shadow .15s; text-align: left; color: var(--dark); }
      .picker-tile:hover { border-color: var(--gray-300); transform: translateY(-1px); }
      .picker-tile.active { background: var(--dark); color: #fff; border-color: var(--dark); box-shadow: 0 6px 18px rgba(15,23,42,0.12); }
      .picker-tile-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13.5px; letter-spacing: -0.005em; line-height: 1.15; flex: 1; min-width: 0; overflow-wrap: anywhere; }
      .picker-tile-count { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 12.5px; color: var(--gray-600); background: var(--gray-100); border-radius: 9999px; padding: 3px 9px; min-width: 28px; text-align: center; font-feature-settings: "tnum" 1; flex-shrink: 0; }
      .picker-tile.active .picker-tile-count { background: rgba(255,255,255,0.16); color: #fff; }
      @media (min-width: 680px) { .picker-tiles { grid-template-columns: repeat(4, 1fr); } }
      @media (min-width: 1000px) { .picker-tiles { grid-template-columns: repeat(8, 1fr); } }

      /* SORT BAR */
      .list-toolbar { display: flex; flex-direction: column; align-items: stretch; gap: 8px; margin-bottom: 12px; }
      .list-toolbar-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .list-sort-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.7px; color: var(--gray-400); font-weight: 600; }
      .list-result-count { font-size: 12px; font-weight: 500; color: var(--gray-600); font-feature-settings: "tnum" 1; }
      .list-result-count strong { color: var(--dark); font-weight: 700; }
      .list-sort-btns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
      .list-sort-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 38px; padding: 8px 12px; border-radius: 9999px; border: 1px solid var(--gray-200); background: #fff; color: var(--gray-600); font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .15s; }
      .list-sort-btn:hover { border-color: var(--gray-400); }
      .list-sort-btn.active { background: var(--dark); color: #fff; border-color: var(--dark); }
      @media (min-width: 680px) {
        .list-toolbar { flex-direction: row; align-items: center; justify-content: space-between; }
        .list-sort-btns { display: flex; gap: 6px; }
        .list-sort-btn { padding: 8px 16px; min-height: 36px; }
      }

      /* FACTOR CARDS */
      .fact-list { display: grid; gap: 10px; }
      .fact-card { background: #fff; border: 1px solid var(--gray-200); border-radius: 16px; overflow: hidden; transition: border-color .15s, box-shadow .15s; }
      .fact-card:hover { border-color: var(--gray-300); }
      .fact-card.expanded { box-shadow: 0 8px 24px rgba(15,23,42,0.07); border-color: var(--gray-300); }
      .fact-head { display: grid; grid-template-columns: auto minmax(0, 1fr) auto auto; align-items: center; gap: 14px; width: 100%; padding: 16px 18px; background: transparent; border: 0; cursor: pointer; font-family: inherit; text-align: left; }
      .fact-head:hover { background: var(--gray-50); }
      .fact-cat-icon { width: 38px; height: 38px; border-radius: 11px; background: var(--green-light); color: var(--green-dark); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .fact-cat-icon svg { width: 18px; height: 18px; }
      .fact-meta { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .fact-cat-line { display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-size: 9.5px; font-weight: 700; letter-spacing: 0.9px; text-transform: uppercase; line-height: 1; margin-bottom: 4px; }
      .fact-cat { color: var(--green-dark); }
      .fact-cat-dot { color: var(--gray-300); font-weight: 400; }
      .fact-cat-q { color: var(--gray-400); }
      .fact-question { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); line-height: 1.25; letter-spacing: -0.005em; }
      .fact-name { font-size: 12.5px; color: var(--gray-600); margin-top: 2px; }
      .fact-impact-cell { display: inline-flex; align-items: center; flex-shrink: 0; }
      .fact-chev { width: 18px; height: 18px; color: var(--gray-400); display: inline-flex; align-items: center; justify-content: center; transition: transform .2s; flex-shrink: 0; }
      .fact-chev svg { width: 16px; height: 16px; }
      .fact-card.expanded .fact-chev { transform: rotate(180deg); color: var(--green-dark); }
      @media (max-width: 540px) {
        .fact-head { grid-template-columns: auto minmax(0, 1fr) auto; gap: 10px; padding: 14px; }
        .fact-impact-cell { grid-column: 1 / -1; grid-row: 2; padding-left: 48px; }
        .fact-chev { grid-row: 1; }
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

      /* APP CTA */
      .app-cta { position: relative; background: linear-gradient(135deg, var(--dark-card) 0%, var(--gray-700) 100%); border-radius: var(--radius); padding: 32px 24px; text-align: center; max-width: 720px; margin: 0 auto; overflow: hidden; }
      .app-cta-glow { position: absolute; top: -60px; right: -60px; width: 220px; height: 220px; background: radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%); pointer-events: none; }
      .app-cta-content { position: relative; z-index: 1; }
      .app-cta-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,197,94,0.15); color: var(--green); padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
      .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulseDot 2s infinite; }
      @keyframes pulseDot { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }
      .app-cta h2 { color: #fff; font-size: clamp(22px, 5vw, 30px); margin-bottom: 12px; }
      .app-cta .highlight { color: var(--green); }
      .app-cta p { color: var(--gray-400); font-size: 14px; margin-bottom: 22px; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.55; }
      .app-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; }
      .app-cta-btn:hover { background: var(--green-dark); }
      .app-cta-btn svg { width: 18px; height: 18px; }
      .app-cta-android { display: inline-flex; align-items: center; gap: 8px; background: #fff; color: var(--dark); padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; }
      .app-cta-android:hover { background: var(--gray-100); }
      .app-cta-android svg { width: 18px; height: 18px; }
      .app-cta-buttons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
      @media (max-width: 480px) { .app-cta-buttons { flex-direction: column; align-items: stretch; } .app-cta-buttons a { justify-content: center; } }
      .app-cta-tags { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 20px; flex-wrap: nowrap; }
      .app-cta-tags-label { color: var(--gray-400); font-size: 11px; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
      .app-cta-tags-logos { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; overflow: hidden; }
      .app-cta-tags-logos img { height: 18px; width: auto; opacity: 0.75; flex-shrink: 1; min-width: 0; object-fit: contain; }
      @media (min-width: 480px) { .app-cta-tags-logos img { height: 20px; } .app-cta-tags-label { font-size: 12px; } }
      @media (min-width: 768px) { .app-cta { padding: 48px 40px; } .app-cta-tags-logos { gap: 8px; } .app-cta-tags-logos img { height: 22px; } }

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
