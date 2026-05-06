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
    this._eventsBound = false;
  }

  connectedCallback() {
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    __seo(this, 'Wearable Stress Research by Kygo Health. Compare how Garmin, Apple Watch, Samsung Galaxy Watch, Google Pixel/Fitbit Sense, WHOOP, Oura Ring, and Polar measure stress. Each device uses a different mix of signals: HRV, electrodermal activity (EDA), skin temperature, respiratory rate, and SpO2. Multi-signal devices show ~82% accuracy versus ~77% for HRV-only. Explore 14 lifestyle factors — alcohol, sleep, caffeine, exercise, illness, hydration, meditation, cold exposure — with device-specific mechanisms and evidence-based actions to lower your stress score. Every claim sourced from peer-reviewed research including Frontiers in Physiology 2024.');
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
      compare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M21 3l-7 7"/><path d="M8 21H3v-5"/><path d="M3 21l7-7"/></svg>'
    };
    return icons[name] || icons.heart;
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
      ['sleep', 'Sleep']
    ];
    return order.map(([k, label]) =>
      `<span class="sensor-chip ${sensors[k] ? 'on' : 'off'}">${label}</span>`
    ).join('');
  }

  _renderDeviceCard(deviceKey) {
    const d = this._devices[deviceKey];
    if (!d) return '';
    return `
      <div class="device-card" style="--accent:${d.color}">
        <div class="device-card-head">
          <div class="device-card-title">
            <span class="device-card-eyebrow">${d.modelLine}</span>
            <h3 class="device-card-name">${d.name}</h3>
          </div>
        </div>
        <div class="device-card-sensors" aria-label="Sensors used by ${d.name}">
          ${this._sensorChips(d.sensors)}
        </div>
        <dl class="device-card-rows">
          <div class="device-card-row"><dt>Algorithm</dt><dd>${d.algorithm}</dd></div>
          <div class="device-card-row"><dt>Scale</dt><dd>${d.scale}</dd></div>
          <div class="device-card-row"><dt>Baseline</dt><dd>${d.baseline}</dd></div>
          <div class="device-card-row"><dt>Coverage</dt><dd>${d.coverage}</dd></div>
          <div class="device-card-row strength"><dt>Unique strength</dt><dd>${d.strength}</dd></div>
          <div class="device-card-row limitation"><dt>Key limitation</dt><dd>${d.limitation}</dd></div>
        </dl>
      </div>`;
  }

  _renderDeviceDiff(d1Key, d2Key) {
    const d1 = this._devices[d1Key];
    const d2 = this._devices[d2Key];
    if (!d1 || !d2 || d1Key === d2Key) return '';
    const sensorLabels = { hrv: 'HRV', hr: 'Heart Rate', eda: 'EDA', skinTemp: 'Skin Temp', rr: 'Respiratory Rate', spo2: 'SpO₂', sleep: 'Sleep architecture' };
    const onlyIn1 = Object.keys(d1.sensors).filter(k => d1.sensors[k] && !d2.sensors[k]).map(k => sensorLabels[k]);
    const onlyIn2 = Object.keys(d2.sensors).filter(k => d2.sensors[k] && !d1.sensors[k]).map(k => sensorLabels[k]);
    const shared = Object.keys(d1.sensors).filter(k => d1.sensors[k] && d2.sensors[k]).map(k => sensorLabels[k]);
    return `
      <div class="device-diff">
        <div class="device-diff-eyebrow">Where they differ</div>
        <div class="device-diff-rows">
          <div class="device-diff-row"><span class="diff-tag shared">Shared</span><p>${shared.length ? shared.join(' · ') : 'None'}</p></div>
          <div class="device-diff-row"><span class="diff-tag only" style="--accent:${d1.color}">Only ${d1.name}</span><p>${onlyIn1.length ? onlyIn1.join(' · ') : 'No unique sensors'}</p></div>
          <div class="device-diff-row"><span class="diff-tag only" style="--accent:${d2.color}">Only ${d2.name}</span><p>${onlyIn2.length ? onlyIn2.join(' · ') : 'No unique sensors'}</p></div>
        </div>
      </div>`;
  }

  _renderComparisonModule() {
    const devices = this._devices;
    const isCompare = this._mode === 'compare';
    const selectorOpts = (selected) => Object.entries(devices)
      .map(([k, d]) => `<option value="${k}" ${k === selected ? 'selected' : ''}>${d.name}</option>`).join('');

    const selectorRow = isCompare ? `
      <div class="device-selectors">
        <div class="selector-group">
          <label>Device 1</label>
          <div class="selector-wrap"><select id="device1">${selectorOpts(this._device1)}</select></div>
        </div>
        <div class="vs-badge">VS</div>
        <div class="selector-group">
          <label>Device 2</label>
          <div class="selector-wrap"><select id="device2">${selectorOpts(this._device2)}</select></div>
        </div>
      </div>
    ` : `
      <div class="device-selectors single">
        <div class="selector-group">
          <label>Your wearable</label>
          <div class="selector-wrap"><select id="device1">${selectorOpts(this._device1)}</select></div>
        </div>
      </div>
    `;

    const cards = isCompare
      ? `<div class="device-card-grid two">${this._renderDeviceCard(this._device1)}${this._renderDeviceCard(this._device2)}</div>${this._renderDeviceDiff(this._device1, this._device2)}`
      : `<div class="device-card-grid one">${this._renderDeviceCard(this._device1)}</div>`;

    return `
      <section class="comparison-section section-bg-white" id="compare">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('compare')}</span>How your device measures stress</span>
            <h2 class="section-h2">Pick your wearable — see <em>what it actually reads</em>.</h2>
            <p class="section-lede">Stress scores aren't comparable across brands. Each device leans on a different mix of HRV, EDA, skin temperature, and respiratory rate. The factor cards below re-sort by the biggest movers for whichever device you pick.</p>
          </div>
          <div class="mode-toggle" role="tablist" aria-label="Comparison mode">
            <button class="mode-btn ${this._mode === 'single' ? 'active' : ''}" data-mode="single" role="tab" aria-selected="${this._mode === 'single'}">Single device</button>
            <button class="mode-btn ${this._mode === 'compare' ? 'active' : ''}" data-mode="compare" role="tab" aria-selected="${this._mode === 'compare'}">Compare two</button>
          </div>
          ${selectorRow}
          ${cards}
        </div>
      </section>`;
  }

  _renderImpactBadge(impact, deviceName) {
    const cfg = this._impactCfg(impact);
    return `<span class="impact-badge ${cfg.cls}" aria-label="${cfg.label} impact on ${deviceName}">
      <span class="impact-dot" aria-hidden="true"></span>${cfg.label} on ${deviceName}
    </span>`;
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
              <span class="lbl">Source</span>
              <a href="${f.source.url}" target="_blank" rel="noopener" class="source-link">${f.source.label} ${this._icon('externalLink')}</a>
            </div>
          </div>`;
      } else {
        body = `
          <div class="fact-body">
            ${this._renderHurtsHelps(this._device1, f.perDevice)}
            <div class="fact-source-row">
              <span class="lbl">Source</span>
              <a href="${f.source.url}" target="_blank" rel="noopener" class="source-link">${f.source.label} ${this._icon('externalLink')}</a>
            </div>
          </div>`;
      }
    }

    return `
      <article class="fact-card ${isExp ? 'expanded' : ''}" data-fact-key="${f.key}">
        <button class="fact-head" aria-expanded="${isExp}">
          <span class="fact-meta">
            <span class="fact-cat">Question · ${cat}</span>
            <span class="fact-question">${f.question}</span>
            <span class="fact-name">${f.name}</span>
          </span>
          ${this._renderImpactBadge(impact, d1.name)}
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
        <div class="container">
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
        </div>
      </section>

      <div class="animate-on-scroll">${this._renderComparisonModule()}</div>
      <div class="animate-on-scroll">${this._renderFactorsSection()}</div>
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
        --light: #F8FAFC;
        --green: #22C55E;
        --green-dark: #16A34A;
        --green-light: rgba(34,197,94,0.10);
        --amber: #B45309;
        --red: #EF4444;
        --red-light: rgba(239,68,68,0.08);
        --gray-50: #f9fafb;
        --gray-100: #F1F5F9;
        --gray-200: #E2E8F0;
        --gray-300: #CBD5E1;
        --gray-400: #94A3B8;
        --gray-600: #475569;
        --gray-700: #334155;
        --radius: 20px;
        --radius-sm: 10px;
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

      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      :focus { outline: none; }
      button:focus-visible, .source-link:focus-visible, select:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; }

      /* Header */
      .header { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid var(--gray-200); }
      .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 16px; max-width: 1200px; margin: 0 auto; }
      .logo { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); }
      .logo-img { height: 26px; width: auto; }
      .header-link { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: #fff; background: var(--green); padding: 7px 12px; border-radius: 50px; }
      .header-link:hover { background: var(--green-dark); }
      .header-link svg { width: 13px; height: 13px; }

      /* Hero */
      .hero { padding: 40px 0 28px; background: #fff; }
      .hero-kicker { display: inline-flex; align-items: center; gap: 7px; font-size: 10.5px; font-weight: 700; color: var(--green-dark); background: var(--green-light); padding: 6px 11px; border-radius: 9999px; letter-spacing: 0.4px; text-transform: uppercase; margin-bottom: 20px; }
      .hero-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); animation: pulse 2.2s infinite; }
      @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.6);} 70%{box-shadow:0 0 0 8px rgba(34,197,94,0);} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0);} }
      .hero-title { font-size: clamp(32px, 8vw, 64px); line-height: 1.04; letter-spacing: -0.03em; font-weight: 600; color: var(--dark); max-width: 18ch; }
      .hero-title em { font-style: normal; color: var(--green); }
      .hero-sub { margin: 20px 0 0; max-width: 60ch; font-size: clamp(15px, 2.2vw, 19px); color: var(--gray-600); }
      .hero-sub strong { color: var(--dark); font-weight: 600; }
      .hero-meta { margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-top: 1px solid var(--gray-200); padding-top: 20px; max-width: 760px; }
      .hero-cell { padding: 8px 14px 8px 0; border-right: 1px solid var(--gray-200); }
      .hero-cell:nth-child(2n) { border-right: 0; padding-left: 16px; }
      .hero-cell:nth-child(-n+2) { border-bottom: 1px solid var(--gray-200); padding-bottom: 16px; }
      .hero-cell:nth-child(n+3) { padding-top: 16px; }
      .hero-num { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: clamp(26px, 6vw, 36px); color: var(--dark); display: block; line-height: 1; }
      .hero-num--pos { color: var(--green-dark); }
      .hero-lbl { font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; color: var(--gray-400); font-weight: 600; margin-top: 6px; display: block; }
      @media (min-width: 640px) {
        .hero-meta { grid-template-columns: repeat(4, 1fr); }
        .hero-cell { padding: 0 16px; border-bottom: 0 !important; }
        .hero-cell:first-child { padding-left: 0; }
        .hero-cell:last-child { border-right: 0; padding-right: 0; }
      }

      /* Section backgrounds */
      .section-bg-white { background: #fff; }
      .section-bg-gray { background: var(--gray-100); }

      .section-header { margin-bottom: 24px; max-width: 760px; }
      .section-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 10.5px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--green-dark); margin-bottom: 12px; }
      .section-eyebrow-icon { width: 22px; height: 22px; border-radius: 7px; background: var(--green-light); color: var(--green-dark); display: inline-flex; align-items: center; justify-content: center; }
      .section-eyebrow-icon svg { width: 13px; height: 13px; }
      .section-h2 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: clamp(26px, 5vw, 38px); letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 12px; color: var(--dark); }
      .section-h2 em { font-style: normal; color: var(--green); }
      .section-lede { font-size: 15px; color: var(--gray-600); line-height: 1.5; margin: 0; }
      .section-title { font-size: clamp(24px, 5vw, 34px); text-align: center; margin-bottom: 8px; }
      .section-sub { text-align: center; color: var(--gray-600); font-size: 15px; margin-bottom: 32px; max-width: 560px; margin-left: auto; margin-right: auto; }
      .comparison-section, .factors-section, .callout-section, .sources-section { padding: 48px 0 56px; }
      @media (min-width: 768px) {
        .comparison-section, .factors-section, .callout-section, .sources-section { padding: 64px 0 72px; }
      }

      /* Mode toggle */
      .mode-toggle { display: inline-flex; gap: 4px; padding: 4px; background: var(--gray-100); border-radius: 9999px; margin-bottom: 20px; }
      .mode-btn { padding: 8px 18px; border-radius: 9999px; border: 0; background: transparent; color: var(--gray-600); font-family: inherit; font-weight: 600; font-size: 13.5px; cursor: pointer; transition: background .2s, color .2s; }
      .mode-btn.active { background: var(--dark); color: #fff; }

      /* Device selectors */
      .device-selectors { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
      .device-selectors.single { justify-content: flex-start; }
      .selector-group { text-align: center; }
      .selector-group label { display: block; font-size: 11px; font-weight: 700; color: var(--gray-400); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.6px; }
      .selector-wrap select { padding: 11px 18px; border-radius: var(--radius-sm); border: 2px solid var(--gray-200); font-family: inherit; font-size: 15px; font-weight: 600; background: #fff; color: var(--dark); cursor: pointer; min-width: 180px; transition: border-color 0.2s; }
      .selector-wrap select:focus { outline: none; border-color: var(--green); }
      .vs-badge { width: 40px; height: 40px; border-radius: 50%; background: var(--green); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; box-shadow: 0 2px 8px rgba(34,197,94,0.3); margin-top: 18px; }

      /* Device card */
      .device-card-grid { display: grid; gap: 12px; grid-template-columns: 1fr; }
      @media (min-width: 880px) { .device-card-grid.two { grid-template-columns: 1fr 1fr; } }
      .device-card { background: #fff; border: 1px solid var(--gray-200); border-radius: 18px; padding: 22px; border-top: 4px solid var(--accent, var(--green)); }
      .device-card-head { margin-bottom: 14px; }
      .device-card-eyebrow { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase; color: var(--gray-400); margin-bottom: 4px; }
      .device-card-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 22px; color: var(--dark); }
      .device-card-sensors { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px dashed var(--gray-200); }
      .sensor-chip { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.2px; }
      .sensor-chip.on { background: var(--green-light); color: var(--green-dark); }
      .sensor-chip.off { background: var(--gray-100); color: var(--gray-400); text-decoration: line-through; opacity: 0.7; }
      .device-card-rows { display: grid; gap: 10px; }
      .device-card-row { display: grid; grid-template-columns: 110px 1fr; gap: 12px; align-items: start; }
      .device-card-row dt { font-size: 10px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); padding-top: 2px; }
      .device-card-row dd { font-size: 13.5px; color: var(--gray-700); line-height: 1.5; }
      .device-card-row.strength dd { color: var(--green-dark); font-weight: 500; }
      .device-card-row.limitation dd { color: var(--amber); font-weight: 500; }
      @media (max-width: 520px) {
        .device-card-row { grid-template-columns: 1fr; gap: 2px; }
      }

      .device-diff { margin-top: 14px; background: var(--dark-card); color: #fff; border-radius: 16px; padding: 20px; }
      .device-diff-eyebrow { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.55); margin-bottom: 12px; }
      .device-diff-rows { display: grid; gap: 8px; }
      .device-diff-row { display: grid; grid-template-columns: 140px 1fr; gap: 12px; align-items: start; }
      .diff-tag { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.3px; text-align: center; }
      .diff-tag.shared { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.9); }
      .diff-tag.only { background: var(--accent, #fff); color: #fff; }
      .device-diff-row p { margin: 0; font-size: 13.5px; color: rgba(255,255,255,0.85); padding-top: 2px; }
      @media (max-width: 520px) {
        .device-diff-row { grid-template-columns: 1fr; gap: 4px; }
        .diff-tag { justify-self: start; }
      }

      /* Picker tiles */
      .picker-tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; margin-bottom: 14px; }
      .picker-tile { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 12px; min-height: 46px; background: #fff; border: 1px solid var(--gray-200); border-radius: 12px; font-family: inherit; cursor: pointer; transition: border-color .15s, background .15s; text-align: left; color: var(--dark); }
      .picker-tile:hover { border-color: var(--gray-300); }
      .picker-tile.active { background: var(--dark); color: #fff; border-color: var(--dark); }
      .picker-tile-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13.5px; }
      .picker-tile-count { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 12px; color: var(--gray-600); background: var(--gray-100); border-radius: 9999px; padding: 2px 8px; min-width: 24px; text-align: center; }
      .picker-tile.active .picker-tile-count { background: rgba(255,255,255,0.18); color: #fff; }
      @media (min-width: 680px) { .picker-tiles { grid-template-columns: repeat(4, 1fr); } }
      @media (min-width: 1000px) { .picker-tiles { grid-template-columns: repeat(8, 1fr); } }

      /* Sort bar */
      .list-toolbar { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
      .list-toolbar-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .list-sort-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.7px; color: var(--gray-400); font-weight: 600; }
      .list-result-count { font-size: 12px; color: var(--gray-600); }
      .list-result-count strong { color: var(--dark); font-weight: 700; }
      .list-sort-btns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
      .list-sort-btn { padding: 8px 10px; border-radius: 9999px; border: 1px solid var(--gray-200); background: #fff; color: var(--gray-600); font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .15s; }
      .list-sort-btn:hover { border-color: var(--gray-400); }
      .list-sort-btn.active { background: var(--dark); color: #fff; border-color: var(--dark); }
      @media (min-width: 680px) {
        .list-toolbar { flex-direction: row; align-items: center; justify-content: space-between; }
        .list-sort-btns { display: flex; }
      }

      /* Factor cards */
      .fact-list { display: grid; gap: 10px; }
      .fact-card { background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; overflow: hidden; transition: border-color .15s, box-shadow .15s; }
      .fact-card:hover { border-color: var(--gray-300); }
      .fact-card.expanded { box-shadow: 0 6px 18px rgba(15,23,42,0.06); border-color: var(--gray-300); }
      .fact-head { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 12px; width: 100%; padding: 14px 16px; background: transparent; border: 0; cursor: pointer; font-family: inherit; text-align: left; }
      .fact-head:hover { background: var(--gray-50); }
      .fact-meta { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
      .fact-cat { font-family: 'Space Grotesk', sans-serif; font-size: 9.5px; font-weight: 700; letter-spacing: 0.9px; text-transform: uppercase; color: var(--gray-400); }
      .fact-question { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15.5px; color: var(--dark); line-height: 1.25; }
      .fact-name { font-size: 12.5px; color: var(--gray-600); }
      .fact-chev { width: 18px; height: 18px; color: var(--gray-400); display: inline-flex; align-items: center; justify-content: center; transition: transform .2s; }
      .fact-chev svg { width: 16px; height: 16px; }
      .fact-card.expanded .fact-chev { transform: rotate(180deg); color: var(--green-dark); }

      .impact-badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 9999px; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.2px; white-space: nowrap; }
      .impact-dot { width: 6px; height: 6px; border-radius: 50%; }
      .impact-badge.imp-high { background: var(--red-light); color: var(--red); }
      .impact-badge.imp-high .impact-dot { background: var(--red); }
      .impact-badge.imp-med { background: rgba(180,83,9,0.10); color: var(--amber); }
      .impact-badge.imp-med .impact-dot { background: var(--amber); }
      .impact-badge.imp-low { background: var(--green-light); color: var(--green-dark); }
      .impact-badge.imp-low .impact-dot { background: var(--green); }

      /* Hurts/Helps body */
      .fact-body { padding: 6px 16px 18px; border-top: 1px dashed var(--gray-200); background: var(--gray-50); }
      .device-block { padding-top: 14px; }
      .device-block + .device-block { border-top: 1px dashed var(--gray-200); }
      .device-block-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
      .device-block-name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; color: var(--dark); padding-left: 10px; border-left: 3px solid var(--accent, var(--green)); }
      .hh-grid { display: grid; gap: 12px; grid-template-columns: 1fr; }
      @media (min-width: 720px) { .hh-grid { grid-template-columns: 1fr 1fr; } }
      .hh-col { background: #fff; border: 1px solid var(--gray-200); border-radius: 12px; padding: 14px 16px; }
      .hh-col.hh-hurts { border-left: 4px solid var(--red); }
      .hh-col.hh-helps { border-left: 4px solid var(--green); }
      .hh-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
      .hh-eyebrow { font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; }
      .hh-hurts .hh-eyebrow { color: var(--red); }
      .hh-helps .hh-eyebrow { color: var(--green-dark); }
      .hh-magnitude { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 700; color: var(--red); background: var(--red-light); padding: 3px 9px; border-radius: 6px; }
      .hh-timeline { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 700; color: var(--green-dark); background: var(--green-light); padding: 3px 9px; border-radius: 6px; }
      .hh-body { margin: 0 0 10px; font-size: 13.5px; color: var(--gray-700); line-height: 1.55; }
      .hh-tag { display: inline-block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--gray-400); }
      .hh-missing { padding: 14px; background: #fff; border: 1px dashed var(--gray-200); border-radius: 10px; font-size: 13px; color: var(--gray-600); text-align: center; }

      .fact-source-row { margin-top: 14px; padding-top: 12px; border-top: 1px dashed var(--gray-200); display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
      .fact-source-row .lbl { font-size: 10px; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); font-weight: 600; }
      .source-link { display: inline-flex; align-items: center; gap: 4px; color: var(--green-dark); font-weight: 500; font-size: 13px; }
      .source-link svg { width: 12px; height: 12px; }
      .source-link:hover { color: var(--green); }

      /* Callout */
      .callout-card { display: flex; gap: 16px; align-items: flex-start; background: var(--dark-card); color: #fff; padding: 24px 22px; border-radius: 18px; max-width: 880px; margin: 0 auto; }
      .callout-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(34,197,94,0.18); color: var(--green); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .callout-icon svg { width: 20px; height: 20px; }
      .callout-body h3 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 19px; margin-bottom: 8px; }
      .callout-body p { font-size: 14px; color: rgba(255,255,255,0.8); line-height: 1.55; margin: 0; }
      .callout-body em { color: var(--green); font-style: normal; font-weight: 600; }

      /* Sources */
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
      .src-item { display: flex; align-items: center; gap: 8px; padding: 8px 16px; text-decoration: none; color: var(--gray-600); font-size: 13px; }
      .src-item:last-child { padding-bottom: 12px; }
      .src-item:hover { background: var(--gray-50); }
      .src-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
      .src-text { flex: 1; }
      .src-ext { width: 14px; height: 14px; color: var(--gray-400); flex-shrink: 0; }
      .src-ext svg { width: 14px; height: 14px; }

      /* Footer */
      .tool-footer { padding: 40px 0 28px; text-align: center; border-top: 1px solid var(--gray-200); }
      .footer-brand { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); margin-bottom: 8px; }
      .footer-logo { height: 22px; width: auto; }
      .footer-tagline { font-size: 13px; color: var(--gray-400); margin-bottom: 12px; }
      .footer-disclaimer { font-size: 11px; color: var(--gray-400); line-height: 1.5; max-width: 560px; margin: 0 auto 10px; }
      .footer-copyright { font-size: 12px; color: var(--gray-400); }

      .dash-empty { padding: 24px 18px; text-align: center; color: var(--gray-400); font-size: 14px; background: #fff; border: 1px dashed var(--gray-200); border-radius: 12px; }

      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .hero-dot { animation: none; }
      }
    `;
  }
}

if (!customElements.get('kygo-wearable-stress')) {
  customElements.define('kygo-wearable-stress', KygoWearableStress);
}
