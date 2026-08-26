/**
 * Kygo Health — Sleep Metrics Comparison Tool
 * Tag: kygo-sleep-metrics
 * Interactive tool to compare sleep-tracking metrics across Oura, Fitbit, Apple Watch, and Garmin
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

class KygoSleepMetrics extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._activeCategory = 'sleepStages';
    this._expandedMetric = null;
    this._expandedExclusive = null;
    this._eventsBound = false;
  }

  connectedCallback() {
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, 'Sleep Metrics Comparison Tool by Kygo Health. Compare every sleep metric tracked by Oura Ring, Fitbit, Apple Watch, and Garmin. 38 metrics across 10 categories: Composite Scores, Sleep Duration and Timing, Sleep Stages, Sleep Quality, Heart and Vitals, Temperature, Breathing and Apnea, Naps and Coaching, Monthly Profile Analytics, Stress and Recovery. Oura Ring tracks 22 metrics including Sleep Onset Latency, Sleep Efficiency, Circadian Alignment, Readiness Score, Recovery Index, and HRV Balance. Fitbit tracks 21 metrics including Sleep Profile with 10 monthly metrics, Sleep Animal Archetype, Sleep Schedule Variability, and Snoring Detection. Apple Watch tracks 20 metrics including FDA-authorized Sleep Apnea Notifications, Breathing Disturbances Detection, Nighttime Awakenings count, Interruptions Score, and Bedtime Consistency Score. Garmin tracks 21 metrics including Training Readiness, Body Battery Recharge, Stress Level During Sleep, Sleep Coach with Personalized Sleep Need, HRV Status, and Breathing Variations Classification. All four devices track sleep stages (Light/Core, Deep, REM, Awake), Heart Rate, HRV, SpO2, Respiratory Rate, Skin Temperature, and Nap Tracking. Data sourced from official manufacturer documentation.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Device Data ────────────────────────────────────────────────────────

  get _devices() {
    return {
      oura: {
        name: 'Oura Ring',
        short: 'Oura',
        color: '#C4A97D',
        imageUrl: 'https://static.wixstatic.com/media/273a63_722e50e1a554453eb4c71a2e7a58925d~mv2.png',
        totalMetrics: 22,
        affiliateUrl: 'https://www.amazon.com/s?k=Oura%20Ring&tag=kygohealthapp-20', trackLabel: 'oura-ring-search',
        exclusive: [
          { metric: 'Sleep Onset Latency', desc: 'Time from lying down to first detected sleep — flags sleep issues' },
          { metric: 'Sleep Efficiency', desc: 'Percentage of time in bed actually spent asleep' },
          { metric: 'Circadian Alignment', desc: 'Scores how well your sleep midpoint aligns to your circadian rhythm' },
          { metric: 'Readiness Score', desc: 'Combines HR, HRV, temp, recovery, and activity balance' },
          { metric: 'Recovery Index', desc: 'Hours of sleep after HR stabilizes at nightly low' },
          { metric: 'HRV Balance', desc: '14-day avg compared against 3-month avg, recent days weighted more' }
        ]
      },
      fitbit: {
        name: 'Fitbit',
        short: 'Fitbit',
        color: '#00B0B9',
        imageUrl: 'https://static.wixstatic.com/media/273a63_c12bab319dc34737a386c7449f5f92c7~mv2.png',
        totalMetrics: 21,
        affiliateUrl: 'https://www.amazon.com/s?k=Fitbit%3A&rh=p_123%3A213215&tag=kygohealthapp-20', trackLabel: 'fitbit-search',
        exclusive: [
          { metric: 'Sleep Profile (10 Metrics)', desc: '10 metrics analyzed monthly, compared by age and gender (Premium)' },
          { metric: 'Sleep Animal Archetype', desc: '6 animal types assigned from 10-metric clustering (Premium)' },
          { metric: 'Sleep Schedule Variability', desc: 'Standard deviation of bed and wake times monthly (Premium)' },
          { metric: 'Snoring & Noise Detection', desc: 'On-device mic classifies snoring by dBA level' },
          { metric: 'Disrupted Sleep', desc: 'Monthly frequency of significant mid-sleep awakenings (Premium)' }
        ]
      },
      appleWatch: {
        name: 'Apple Watch',
        short: 'Apple Watch',
        color: '#A2AAAD',
        imageUrl: 'https://static.wixstatic.com/media/273a63_68b4900c356b4d0c8982e5ecd10f04fe~mv2.png',
        totalMetrics: 20,
        affiliateUrl: 'https://www.amazon.com/s?k=Apple%20Watch&rh=p_123%3A110955&tag=kygohealthapp-20', trackLabel: 'apple-watch-search',
        exclusive: [
          { metric: 'Sleep Apnea Notifications', desc: 'FDA-authorized — 30-day evaluation, accelerometer-based' },
          { metric: 'Breathing Disturbances', desc: 'ML-classified wrist micro-movements detect respiratory effort' },
          { metric: 'Nighttime Awakenings', desc: 'Count of wake epochs, feeds Interruptions sub-score' },
          { metric: 'Interruptions Score', desc: 'Sub-score based on number and duration of awake periods' },
          { metric: 'Bedtime Consistency Score', desc: 'Compares sleep onset times across last 13 nights' }
        ]
      },
      garmin: {
        name: 'Garmin',
        short: 'Garmin',
        color: '#007CC3',
        imageUrl: 'https://static.wixstatic.com/media/273a63_c545c093c04d4ca4ade77e5ca43fd433~mv2.png',
        totalMetrics: 21,
        affiliateUrl: 'https://www.amazon.com/s?k=garmin%20fitness%20tracker&tag=kygohealthapp-20', trackLabel: 'garmin-search',
        exclusive: [
          { metric: 'Training Readiness', desc: 'Combines sleep, HRV, recovery time, and training load' },
          { metric: 'Body Battery Recharge', desc: 'HRV-based recovery minus stress and activity drain' },
          { metric: 'Stress Level During Sleep', desc: 'Sympathetic vs parasympathetic ANS activity via HRV' },
          { metric: 'Sleep Coach', desc: 'Estimates personal sleep need from activity, sleep history, and HRV' },
          { metric: 'HRV Status', desc: 'Overnight avg vs baseline, rated Balanced to Poor' },
          { metric: 'Breathing Variations', desc: 'Pulse Ox-derived, rated Minimal/Few/Occasional/Frequent' }
        ]
      }
    };
  }

  // ── Categories & Metrics ───────────────────────────────────────────────

  // Hero counts, derived from the metric matrix so they can never drift.
  get _heroStats() {
    const rows = Object.values(this._metrics).flat();
    const covered = k => rows.filter(r => r[k] && r[k].has).length;
    const keys = ['oura', 'fitbit', 'appleWatch', 'garmin'];
    const best = keys.map(k => ({ k, n: covered(k) })).sort((a, b) => b.n - a.n)[0];
    return {
      metrics: rows.length,
      cats: Object.keys(this._categories).length,
      devices: keys.length,
      sources: this._sources.length,
      bestName: this._devices[best.k].name,
      bestN: best.n
    };
  }

  get _categories() {
    return {
      compositeScores: { name: 'Composite Scores', icon: 'gauge' },
      sleepDuration: { name: 'Duration & Timing', icon: 'clock' },
      sleepStages: { name: 'Sleep Stages', icon: 'layers' },
      sleepQuality: { name: 'Sleep Quality', icon: 'sparkle' },
      heartVitals: { name: 'Heart & Vitals', icon: 'heart' },
      temperature: { name: 'Temperature', icon: 'thermometer' },
      breathingApnea: { name: 'Breathing & Apnea', icon: 'wind' },
      napsCoaching: { name: 'Naps & Coaching', icon: 'sun' },
      monthlyAnalytics: { name: 'Monthly Analytics', icon: 'calendar' },
      stressRecovery: { name: 'Stress & Recovery', icon: 'battery' }
    };
  }

  get _metrics() {
    return {
      compositeScores: [
        {
          key: 'sleepScore', name: 'Sleep Score (0–100)',
          oura: { has: true, desc: '7 contributors, weighting proprietary' },
          fitbit: { has: true, desc: '50pt duration, 25pt stages, 25pt restoration' },
          appleWatch: { has: true, desc: '50pt duration, 30pt consistency, 20pt interruptions' },
          garmin: { has: true, desc: '3 pillars via Firstbeat, weighting proprietary' }
        },
        {
          key: 'readinessScore', name: 'Readiness Score',
          oura: { has: true, desc: 'Combines HR, HRV, temp, recovery, and activity balance' },
          fitbit: { has: false }, appleWatch: { has: false }, garmin: { has: false }
        },
        {
          key: 'trainingReadiness', name: 'Training Readiness',
          oura: { has: false },
          fitbit: { has: false }, appleWatch: { has: false },
          garmin: { has: true, desc: 'Combines sleep, HRV, recovery time, and training load' }
        },
        {
          key: 'bodyBattery', name: 'Body Battery Recharge',
          oura: { has: false }, fitbit: { has: false }, appleWatch: { has: false },
          garmin: { has: true, desc: 'HRV-based recovery minus stress and activity drain' }
        }
      ],
      sleepDuration: [
        {
          key: 'totalSleepTime', name: 'Total Sleep Time',
          oura: { has: true, desc: 'Sum of light, deep, REM via HR, motion, and temp' },
          fitbit: { has: true, desc: 'Time asleep via accelerometer and HR' },
          appleWatch: { has: true, desc: 'Sum of core, deep, REM in 30-sec epochs' },
          garmin: { has: true, desc: 'Sum of light, deep, REM via PPG and accelerometer' }
        },
        {
          key: 'timeInBed', name: 'Time in Bed',
          oura: { has: true, desc: 'Bedtime to final wake including awake periods' },
          fitbit: { has: true, desc: 'Sleep start to final wake including awake time' },
          appleWatch: { has: true, desc: 'Schedule start to wake including awake time' },
          garmin: { has: false }
        },
        {
          key: 'sleepOnsetLatency', name: 'Sleep Onset Latency',
          oura: { has: true, desc: 'Time from lying down to first detected sleep' },
          fitbit: { has: false }, appleWatch: { has: false }, garmin: { has: false }
        },
        {
          key: 'sleepOnsetTime', name: 'Sleep Onset Time',
          oura: { has: true, desc: 'First sleep epoch via movement and HR changes' },
          fitbit: { has: true, desc: 'Detected by HR drop and movement stopping' },
          appleWatch: { has: true, desc: 'First sustained sleep epoch via ML model' },
          garmin: { has: true, desc: 'Detected by HR and movement transition patterns' }
        },
        {
          key: 'wakeUpTime', name: 'Wake-up Time',
          oura: { has: true, desc: 'Final sleep-to-wake transition via HR and motion' },
          fitbit: { has: true, desc: 'Detected by sustained wakefulness in HR and movement' },
          appleWatch: { has: true, desc: 'Final sleep-to-wake transition detected' },
          garmin: { has: true, desc: 'Detected by HR and movement at awakening' }
        },
        {
          key: 'sleepTiming', name: 'Sleep Timing (Circadian Alignment)',
          oura: { has: true, desc: 'Scores how well sleep midpoint aligns to circadian rhythm' },
          fitbit: { has: false }, appleWatch: { has: false }, garmin: { has: false }
        },
        {
          key: 'sleepEfficiency', name: 'Sleep Efficiency',
          oura: { has: true, desc: 'Time asleep divided by time in bed' },
          fitbit: { has: false }, appleWatch: { has: false }, garmin: { has: false }
        }
      ],
      sleepStages: [
        {
          key: 'lightSleep', name: 'Light / Core Sleep',
          oura: { has: true, desc: "Called 'Light Sleep' \u2014 OSSA 2.0 multi-sensor" },
          fitbit: { has: true, desc: "Called 'Light Sleep' \u2014 HR and movement classified" },
          appleWatch: { has: true, desc: "Called 'Core Sleep' \u2014 ML model in 30-sec epochs" },
          garmin: { has: true, desc: "Called 'Light Sleep' \u2014 HR variability and motion" }
        },
        {
          key: 'deepSleep', name: 'Deep Sleep (NREM Stage 3)',
          oura: { has: true, desc: 'OSSA 2.0 multi-sensor classification' },
          fitbit: { has: true, desc: 'Classified by low movement and stable low HR' },
          appleWatch: { has: true, desc: 'Classified by sustained stillness and low stable HR' },
          garmin: { has: true, desc: 'Classified by low stable HR and near-zero movement' }
        },
        {
          key: 'remSleep', name: 'REM Sleep',
          oura: { has: true, desc: 'Classified by irregular HRV and low movement' },
          fitbit: { has: true, desc: 'Classified by elevated HR with minimal movement' },
          appleWatch: { has: true, desc: 'Classified by elevated HR with minimal movement' },
          garmin: { has: true, desc: 'Classified by irregular HR with muscle atonia' }
        },
        {
          key: 'awakeTime', name: 'Awake Time',
          oura: { has: true, desc: 'Movement and elevated HR during sleep period' },
          fitbit: { has: true, desc: 'Movement and HR patterns indicating wakefulness' },
          appleWatch: { has: true, desc: 'Motion and HR epochs during sleep window' },
          garmin: { has: true, desc: 'Movement and HR patterns indicating wakefulness' }
        }
      ],
      sleepQuality: [
        {
          key: 'restfulness', name: 'Restfulness / Restlessness',
          oura: { has: true, desc: "Called 'Restfulness' \u2014 wake-ups and tossing events" },
          fitbit: { has: true, desc: "Called 'Restoration' \u2014 combines HR and tossing" },
          appleWatch: { has: false },
          garmin: { has: true, desc: "Called 'Restlessness' \u2014 tossing and turning count" }
        },
        {
          key: 'nightAwakenings', name: 'Nighttime Awakenings (count)',
          oura: { has: false },
          fitbit: { has: false },
          appleWatch: { has: true, desc: 'Count of wake epochs, feeds Interruptions sub-score' },
          garmin: { has: false }
        },
        {
          key: 'disruptedSleep', name: 'Disrupted Sleep',
          oura: { has: false },
          fitbit: { has: true, desc: 'Monthly mid-sleep awakening frequency (Premium)' },
          appleWatch: { has: false }, garmin: { has: false }
        },
        {
          key: 'interruptionsScore', name: 'Interruptions Score',
          oura: { has: false }, fitbit: { has: false },
          appleWatch: { has: true, desc: 'Calculated from number and duration of awake periods' },
          garmin: { has: false }
        },
        {
          key: 'bedtimeConsistency', name: 'Bedtime Consistency Score',
          oura: { has: false }, fitbit: { has: false },
          appleWatch: { has: true, desc: 'Compares sleep onset times across last 13 nights' },
          garmin: { has: false }
        }
      ],
      heartVitals: [
        {
          key: 'restingHR', name: 'Resting / Sleeping Heart Rate',
          oura: { has: true, desc: 'Lowest nighttime HR via infrared PPG' },
          fitbit: { has: true, desc: 'Continuous overnight HR via green PPG' },
          appleWatch: { has: true, desc: 'Continuous overnight HR via green PPG' },
          garmin: { has: true, desc: 'Continuous overnight HR via green PPG' }
        },
        {
          key: 'hrv', name: 'Heart Rate Variability (HRV)',
          oura: { has: true, desc: '5-min RMSSD samples via infrared PPG overnight' },
          fitbit: { has: true, desc: 'Beat-to-beat via PPG, tracked per sleep stage' },
          appleWatch: { has: true, desc: 'Pulse wave intervals, single overnight value' },
          garmin: { has: true, desc: 'Overnight avg compared against personal baseline' }
        },
        {
          key: 'spo2', name: 'Blood Oxygen (SpO2)',
          oura: { has: true, desc: 'Red and IR pulse oximetry on finger' },
          fitbit: { has: true, desc: 'Red and IR LEDs on wrist, avg and variation' },
          appleWatch: { has: true, desc: 'Red and IR pulse oximetry on wrist' },
          garmin: { has: true, desc: 'Red and IR LEDs on wrist when Pulse Ox enabled' }
        },
        {
          key: 'respiratoryRate', name: 'Respiratory Rate',
          oura: { has: true, desc: 'PPG-derived respiratory sinus arrhythmia' },
          fitbit: { has: true, desc: 'PPG and accelerometer cyclic variations' },
          appleWatch: { has: true, desc: 'Accelerometer micro-movements and PPG modulation' },
          garmin: { has: true, desc: 'HRV-derived respiratory sinus arrhythmia' }
        }
      ],
      temperature: [
        {
          key: 'skinTemp', name: 'Skin / Wrist Temperature',
          oura: { has: true, desc: 'Finger NTC thermistor, deviation from baseline' },
          fitbit: { has: true, desc: 'Wrist thermistor, deviation from baseline' },
          appleWatch: { has: true, desc: 'Dual wrist sensors every 5 sec, 5-night baseline' },
          garmin: { has: true, desc: 'Wrist thermistor on select models, deviation shown' }
        }
      ],
      breathingApnea: [
        {
          key: 'breathingDisturbances', name: 'Breathing Disturbances Detection',
          oura: { has: false }, fitbit: { has: false },
          appleWatch: { has: true, desc: 'Accelerometer wrist micro-movements, ML-classified' },
          garmin: { has: false }
        },
        {
          key: 'breathingVariations', name: 'Breathing Variations Classification',
          oura: { has: false }, fitbit: { has: false }, appleWatch: { has: false },
          garmin: { has: true, desc: 'Pulse Ox-derived, rated Minimal/Few/Occasional/Frequent' }
        },
        {
          key: 'sleepApnea', name: 'Sleep Apnea Notifications (FDA)',
          oura: { has: false }, fitbit: { has: false },
          appleWatch: { has: true, desc: '30-day evaluation, FDA-cleared, accelerometer-based' },
          garmin: { has: false }
        },
        {
          key: 'snoringDetection', name: 'Snoring & Noise Detection',
          oura: { has: false },
          fitbit: { has: true, desc: 'On-device mic classifies snoring by dBA (Sense/Versa 3)' },
          appleWatch: { has: false }, garmin: { has: false }
        }
      ],
      napsCoaching: [
        {
          key: 'napTracking', name: 'Nap Tracking',
          oura: { has: true, desc: 'Auto-detects 15 min to 3 hrs with full stage data' },
          fitbit: { has: true, desc: 'Monthly count and duration via Sleep Profile' },
          appleWatch: { has: true, desc: 'Auto-detects since watchOS 11, no stage data' },
          garmin: { has: true, desc: 'Auto-detects under 3 hrs, no stage classification' }
        },
        {
          key: 'sleepCoach', name: 'Sleep Coach / Personalized Sleep Need',
          oura: { has: false }, fitbit: { has: false }, appleWatch: { has: false },
          garmin: { has: true, desc: 'Estimates need from activity, sleep history, and HRV' }
        }
      ],
      monthlyAnalytics: [
        {
          key: 'sleepProfile', name: 'Sleep Profile (10 Monthly Metrics)',
          oura: { has: false },
          fitbit: { has: true, desc: '10 metrics monthly compared by age and gender (Premium)' },
          appleWatch: { has: false }, garmin: { has: false }
        },
        {
          key: 'sleepAnimal', name: 'Sleep Animal Archetype',
          oura: { has: false },
          fitbit: { has: true, desc: '6 animal types from 10-metric clustering (Premium)' },
          appleWatch: { has: false }, garmin: { has: false }
        },
        {
          key: 'scheduleVariability', name: 'Sleep Schedule Variability',
          oura: { has: false },
          fitbit: { has: true, desc: 'Std deviation of bed and wake times monthly (Premium)' },
          appleWatch: { has: false }, garmin: { has: false }
        }
      ],
      stressRecovery: [
        {
          key: 'stressDuringSleep', name: 'Stress Level During Sleep',
          oura: { has: false }, fitbit: { has: false }, appleWatch: { has: false },
          garmin: { has: true, desc: 'Sympathetic vs parasympathetic ANS activity via HRV' }
        },
        {
          key: 'recoveryIndex', name: 'Recovery Index (HR Stabilization)',
          oura: { has: true, desc: 'Hours of sleep after HR stabilizes at nightly low' },
          fitbit: { has: false }, appleWatch: { has: false }, garmin: { has: false }
        },
        {
          key: 'hrvBalance', name: 'HRV Balance (14-day vs 3-month)',
          oura: { has: true, desc: '14-day avg compared against 3-month avg, recent weighted' },
          fitbit: { has: false }, appleWatch: { has: false }, garmin: { has: false }
        },
        {
          key: 'hrvStatus', name: 'HRV Status (Rated Category)',
          oura: { has: false }, fitbit: { has: false }, appleWatch: { has: false },
          garmin: { has: true, desc: 'Overnight avg vs baseline, rated Balanced to Poor' }
        }
      ]
    };
  }

  // ── Use Cases ──────────────────────────────────────────────────────────

  get _useCases() {
    return [
      { icon: 'layers', label: 'Sleep Stage Breakdown', devices: ['oura', 'fitbit', 'appleWatch', 'garmin'], note: 'All 4 track Light, Deep, REM, and Awake' },
      { icon: 'shield', label: 'Sleep Apnea Screening', devices: ['appleWatch'], note: 'Only FDA-authorized sleep apnea notifications' },
      { icon: 'battery', label: 'Recovery & Readiness', devices: ['oura'], note: 'Readiness Score + Recovery Index + HRV Balance' },
      { icon: 'dumbbell', label: 'Athlete / Training Recovery', devices: ['garmin'], note: 'Training Readiness + Body Battery + Stress during sleep' },
      { icon: 'calendar', label: 'Long-Term Sleep Trends', devices: ['fitbit'], note: '10-metric monthly Sleep Profile + Sleep Animals' },
      { icon: 'mic', label: 'Snoring Detection', devices: ['fitbit'], note: 'Only device with on-device mic for snoring' },
      { icon: 'brain', label: 'Sleep Coaching', devices: ['garmin'], note: 'Personalized sleep need estimation from HRV and activity' },
      { icon: 'moon', label: 'Nap Tracking (with Stages)', devices: ['oura'], note: 'Only device providing full stage data for naps' },
      { icon: 'heart', label: 'Heart & Vitals Coverage', devices: ['oura', 'fitbit', 'appleWatch', 'garmin'], note: 'All track HR, HRV, SpO2, Respiratory Rate, Temp' },
      { icon: 'clock', label: 'Circadian Rhythm Awareness', devices: ['oura'], note: 'Only device scoring circadian alignment' }
    ];
  }

  // ── Sources ────────────────────────────────────────────────────────────

  get _srcByDevice() {
    return {
      oura: [
        { label: 'Oura Support \u2014 Sleep Score', url: 'https://support.ouraring.com/hc/en-us/articles/360025445574-Sleep-Score' },
        { label: 'Oura Support \u2014 Sleep Contributors', url: 'https://support.ouraring.com/hc/en-us/articles/360057792293-Sleep-Contributors' },
        { label: 'Oura Support \u2014 Readiness Contributors', url: 'https://support.ouraring.com/hc/en-us/articles/360057791533-Readiness-Contributors' },
        { label: 'Oura Support \u2014 Heart Rate Variability', url: 'https://support.ouraring.com/hc/en-us/articles/360025441974-Heart-Rate-Variability' },
        { label: 'Oura Support \u2014 Nap Detection', url: 'https://support.ouraring.com/hc/en-us/articles/1500009653181-Nap-Detection' },
        { label: 'Oura Blog \u2014 Sleep Score', url: 'https://ouraring.com/blog/sleep-score/' },
        { label: 'ScienceDirect \u2014 Oura OSSA 2.0 Validation', url: 'https://www.sciencedirect.com/science/article/pii/S1389945724000200' }
      ],
      fitbit: [
        { label: 'Google Support \u2014 Sleep Score', url: 'https://support.google.com/fitbit/answer/14236513?hl=en' },
        { label: 'Google Support \u2014 Sleep Stages', url: 'https://support.google.com/fitbit/answer/14236712?hl=en' },
        { label: 'Google Support \u2014 Sleep Profile', url: 'https://support.google.com/fitbit/answer/14236407?hl=en' },
        { label: 'Google Blog \u2014 Sleep Profile', url: 'https://blog.google/products/fitbit/sleep-profile/' },
        { label: 'Fitbit \u2014 Sleep Technology', url: 'https://www.fitbit.com/global/us/technology/sleep' },
        { label: 'Android Police \u2014 Sleep Score Calculation', url: 'https://www.androidpolice.com/fitbit-sleep-score-calculation-explainer/' },
        { label: "Tom's Guide \u2014 Snore Detection", url: 'https://www.tomsguide.com/news/fitbit-is-rolling-out-snore-and-noise-detection' },
        { label: 'My Healthy Apple \u2014 Snoring Features', url: 'https://www.myhealthyapple.com/how-to-setup-and-use-fitbit-snoring-detection-features/' }
      ],
      appleWatch: [
        { label: 'Apple Support \u2014 Sleep Score', url: 'https://support.apple.com/guide/watch/view-your-sleep-score-apded441a669/watchos' },
        { label: 'The5kRunner \u2014 Sleep Score Calculation', url: 'https://the5krunner.com/2025/10/06/how-apple-watchs-sleep-score-is-calculated-all-you-need-to-know-to-improve-sleep-health/' },
        { label: 'Apple Support \u2014 Sleep Tracking', url: 'https://support.apple.com/en-us/102674' },
        { label: 'Apple \u2014 Sleep Apnea Whitepaper (PDF)', url: 'https://www.apple.com/health/pdf/sleep-apnea/Sleep_Apnea_Notifications_on_Apple_Watch_September_2024.pdf' },
        { label: 'Empirical Health \u2014 Sleep Apnea', url: 'https://www.empirical.health/blog/apple-watch-sleep-apnea/' },
        { label: 'SimplyMac \u2014 Nap Tracking', url: 'https://www.simplymac.com/apple-watch/does-apple-watch-track-naps' },
        { label: 'Wareable \u2014 Sleep Tracking Guide', url: 'https://www.wareable.com/apple/apple-watch-sleep-tracking-guide-8356' }
      ],
      garmin: [
        { label: 'Garmin Blog \u2014 Sleep Tracking & Score', url: 'https://www.garmin.com/en-US/blog/fitness/how-garmin-watches-track-your-sleep-calculate-sleep-score/' },
        { label: 'Garmin Blog \u2014 Sleep Score & Insights', url: 'https://www.garmin.com/en-US/blog/health/garmin-sleep-score-and-sleep-insights/' },
        { label: 'Garmin Support \u2014 Pulse Ox', url: 'https://support.garmin.com/en-US/?faq=mBRMf4ks7XAQ03qtsbI8J6' },
        { label: 'Garmin Support \u2014 Body Battery', url: 'https://support.garmin.com/en-US/?faq=DWcdBazhr097VgqFufsTk8' },
        { label: 'Garmin \u2014 Sleep Tracking Technology', url: 'https://www.garmin.com/en-US/garmin-technology/health-science/sleep-tracking/' },
        { label: 'Wareable \u2014 Garmin Sleep Guide', url: 'https://www.wareable.com/garmin/garmin-sleep-tracking-guide-7529' },
        { label: 'ComputerCity \u2014 Garmin Sleep Score', url: 'https://computercity.com/watches/garmin-sleep-score' }
      ]
    };
  }

  // ── Icons ──────────────────────────────────────────────────────────────

  _icon(name) {
    const icons = {
      gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16v-4"/><path d="M12 8h.01"/><circle cx="12" cy="12" r="10"/></svg>',
      clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/></svg>',
      sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
      thermometer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>',
      wind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>',
      sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
      calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>',
      battery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/><line x1="6" x2="6" y1="11" y2="13"/><line x1="10" x2="10" y1="11" y2="13"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>',
      dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',
      mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>',
      brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
      chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'
    };
    return icons[name] || icons.heart;
  }

  // ── Render Helpers ─────────────────────────────────────────────────────

  _renderDeviceStatsBar() {
    const devices = this._devices;
    const keys = ['oura', 'fitbit', 'appleWatch', 'garmin'];
    return keys.map(dk => {
      const d = devices[dk];
      return `<div class="stat-card">
        <img src="${d.imageUrl}" alt="${d.name}" class="stat-img" />
        <div class="stat-info">
          <span class="stat-name">${d.short}</span>
          <span class="stat-count">${d.totalMetrics} metrics</span>
        </div>
      </div>`;
    }).join('');
  }

  _renderCategoryTabs() {
    return Object.entries(this._categories).map(([k, c]) =>
      `<button class="cat-tab ${k === this._activeCategory ? 'active' : ''}" data-category="${k}" role="tab" aria-selected="${k === this._activeCategory}">
        <span class="cat-tab-icon">${this._icon(c.icon)}</span>
        <span>${c.name}</span>
      </button>`
    ).join('');
  }

  _renderMetricGrid() {
    const catKey = this._activeCategory;
    const metrics = this._metrics[catKey];
    if (!metrics) return '<p class="no-data">No metrics in this category.</p>';

    const deviceKeys = ['oura', 'fitbit', 'appleWatch', 'garmin'];
    const devices = this._devices;

    return `
      <div class="grid-header">
        <div class="grid-metric-label">Metric</div>
        ${deviceKeys.map(dk => `<a href="${devices[dk].affiliateUrl}" class="grid-device-header" target="_blank" rel="noopener sponsored" data-track-label="${devices[dk].trackLabel}"><img src="${devices[dk].imageUrl}" alt="${devices[dk].short}" class="grid-device-img" /><span>${devices[dk].short}</span></a>`).join('')}
      </div>
      <div class="grid-body">
        ${metrics.map(m => {
          const isExpanded = this._expandedMetric === m.key;
          const hasAnyDesc = deviceKeys.some(dk => m[dk].has && m[dk].desc);
          return `
            <div class="grid-row-wrap ${isExpanded ? 'expanded' : ''} ${hasAnyDesc ? 'expandable' : ''}" data-metric="${m.key}">
              <div class="grid-row"${hasAnyDesc ? ' role="button" tabindex="0" aria-expanded="' + (isExpanded ? 'true' : 'false') + '"' : ''}>
                <div class="grid-metric-name">${m.name}${hasAnyDesc ? `<span class="grid-expand-icon">${this._icon('chevDown')}</span>` : ''}</div>
                ${deviceKeys.map(dk => `<div class="grid-cell">${m[dk].has ? `<span class="cell-check">${this._icon('check')}</span>` : `<span class="cell-dash">${this._icon('minus')}</span>`}</div>`).join('')}
              </div>
              ${hasAnyDesc ? `<div class="grid-detail">
                <div class="grid-detail-cards">
                  ${deviceKeys.map(dk => {
                    const d = devices[dk];
                    if (!m[dk].has) return `<div class="detail-card unavailable"><div class="detail-header"><img src="${d.imageUrl}" alt="${d.short}" class="detail-icon" loading="lazy" /><span class="detail-device">${d.short}</span></div><span class="detail-na">Not available</span></div>`;
                    return `<div class="detail-card"><a href="${d.affiliateUrl}" class="detail-header" target="_blank" rel="noopener sponsored" data-track-label="${d.trackLabel}"><img src="${d.imageUrl}" alt="${d.short}" class="detail-icon" loading="lazy" /><span class="detail-device">${d.short}</span></a><p class="detail-desc">${m[dk].desc}</p></div>`;
                  }).join('')}
                </div>
              </div>` : ''}
            </div>`;
        }).join('')}
      </div>`;
  }

  _renderExclusiveCards() {
    const devices = this._devices;
    const keys = ['oura', 'fitbit', 'appleWatch', 'garmin'];
    return keys.map((dk, i) => {
      const d = devices[dk];
      const isExpanded = this._expandedExclusive === dk;
      return `
        <div class="excl-card ${isExpanded ? 'expanded' : ''}" data-exclusive="${dk}" style="--delay:${i * 100}ms">
          <div class="excl-header" role="button" aria-expanded="${isExpanded}">
            <img src="${d.imageUrl}" alt="${d.name}" class="excl-img" loading="lazy" />
            <div class="excl-info">
              <h3><a href="${d.affiliateUrl}" class="excl-name-link" target="_blank" rel="noopener sponsored" data-track-label="${d.trackLabel}">${d.name}</a></h3>
              <span class="excl-count">${d.exclusive.length} exclusive feature${d.exclusive.length > 1 ? 's' : ''}</span>
            </div>
            <div class="excl-toggle">${this._icon('chevDown')}</div>
          </div>
          <div class="excl-body">
            <ul class="excl-list">
              ${d.exclusive.map(f => `<li><span class="excl-dot"></span><div><strong>${f.metric}</strong><span class="excl-fdesc">${f.desc}</span></div></li>`).join('')}
            </ul>
            <a href="${d.affiliateUrl}" class="excl-buy" target="_blank" rel="noopener sponsored" data-track-label="${d.trackLabel}">
              <span>View on Amazon</span>
              <span class="excl-buy-arrow">${this._icon('externalLink')}</span>
            </a>
          </div>
        </div>`;
    }).join('');
  }

  _renderUseCases() {
    const devices = this._devices;
    return this._useCases.map((uc, i) => `
      <div class="uc-row" style="--delay:${i * 80}ms">
        <div class="uc-icon">${this._icon(uc.icon)}</div>
        <div class="uc-info">
          <div class="uc-label">${uc.label}</div>
          <div class="uc-note">${uc.note}</div>
        </div>
        <div class="uc-devices">${uc.devices.map(dk => `<img src="${devices[dk].imageUrl}" alt="${devices[dk].short}" class="uc-device-img" title="${devices[dk].short}" loading="lazy" />`).join('')}</div>
      </div>
    `).join('');
  }

  // Flat source list for the standard sources module: the device name becomes
  // the card's tag.
  get _sources() {
    const devices = this._devices;
    const byDevice = this._srcByDevice;
    const out = [];
    for (const dk of ['oura', 'fitbit', 'appleWatch', 'garmin']) {
      for (const s of byDevice[dk] || []) out.push({ tag: devices[dk].name, title: s.label, cite: '', url: s.url });
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

  // ── Surgical Update ────────────────────────────────────────────────────

  _updateCategory() {
    const shadow = this.shadowRoot;
    const tabs = shadow.querySelector('.cat-tabs');
    const grid = shadow.querySelector('.metric-grid');
    this._expandedMetric = null;
    if (tabs) tabs.innerHTML = this._renderCategoryTabs();
    if (grid) grid.innerHTML = this._renderMetricGrid();
  }

  _toggleMetricRow(key) {
    this._expandedMetric = this._expandedMetric === key ? null : key;
    const shadow = this.shadowRoot;
    shadow.querySelectorAll('.grid-row-wrap').forEach(row => {
      const isExp = row.dataset.metric === this._expandedMetric;
      row.classList.toggle('expanded', isExp);
      const btn = row.querySelector('.grid-row[role="button"]');
      if (btn) btn.setAttribute('aria-expanded', isExp);
    });
  }

  // ── Main Render ────────────────────────────────────────────────────────

  // Related tools · Kygo standard module ────────────────────────────────
  // Exactly 3 cards: a near neighbour, a bridge between accuracy and
  // physiology, and one from another family. Never links this page to
  // itself, and never links the Food Scanner.

  _relatedTools() {
    return [
      {
        title: 'Most Accurate Sleep Tracker',
        blurb: 'Which wearable is most accurate for sleep vs a lab PSG? Compare 7 devices head to head.',
        url: 'https://www.kygo.app/tools/sleep-tracker-accuracy',
        meta: 'Wearables · 14 sources',
        motif: { motif: 'compare', caption: 'Sleep staging vs PSG', rows: [{ label: 'Oura', pct: 90 }, { label: 'Apple', pct: 78 }, { label: 'Fitbit', pct: 64 }, { label: 'Garmin', pct: 36 }] }
      },
      {
        title: 'Deep Sleep Factor Explorer',
        blurb: '28 factors that affect deep sleep, ranked by research with doses and mechanisms.',
        url: 'https://www.kygo.app/tools/deep-sleep-factors',
        meta: 'Sleep · 28 factors',
        motif: { motif: 'hypno', stage: 'deep', caption: 'Sleep stages overnight' }
      },
      {
        title: 'Hardware & Software Differences',
        blurb: 'What actually makes Garmin, Whoop, Oura, Apple Watch and Fitbit different, sensor by sensor.',
        url: 'https://www.kygo.app/tools/sensor-comparison',
        meta: 'Wearables · 6 devices',
        motif: { motif: 'radar', caption: 'Sensor & software focus', radar: [0.92, 0.6, 0.78, 0.5, 0.85] }
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
      { slug: 'every-sleep-metric-your-wearable-tracks-oura-apple-watch-fitbit-garmin',
        title: 'Every Sleep Metric Your Wearable Tracks: Oura vs Apple Watch vs Fitbit vs Garmin Compared',
        blurb: 'What Oura, Apple Watch, Fitbit and Garmin each actually measure overnight, what they miss, and why the gaps matter.',
        cat: 'Sleep', min: 9, img: '273a63_9746eb6e86f740c8bba2779fcce40365~mv2.png' },
      { slug: 'most-accurate-sleep-tracker-oura-vs-apple-vs-fitbit-2026',
        title: 'Most Accurate Sleep Tracker? Oura vs Apple vs Fitbit vs Garmin vs Whoop (2026)',
        blurb: 'Every tracker calls itself accurate. Measured against lab polysomnography, the ranking changes completely on one thing most reviews ignore.',
        cat: 'Sleep', min: 8, img: '273a63_4c319b0df429425296d15711c577310b~mv2.png' },
      { slug: 'why-is-my-sleep-score-low-when-i-slept-8-hours',
        title: 'Why Is My Sleep Score Low When I Slept 8 Hours?',
        blurb: 'Your tracker says eight hours and your score is still bad. Why duration is not quality, and what a food log reveals about the cause.',
        cat: 'Sleep', min: 8, img: '273a63_0a9880d341f34b9ea66d1df4c2164bd2~mv2.png' }
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
      slug: 'sleep-metrics',
      headline: `Your wearable records it. <span>Kygo explains it.</span>`,
      sub: `Tracking 38 metrics is not the same as knowing which one moved. Kygo connects your sleep data to your nutrition and training.`
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
      ['273a63_56ac2eb53faf43fab1903643b29c0bce', 'Oura Ring'],
      ['273a63_1a1ba0e735ea4d4d865c04f7c9540e69', 'Apple Health'],
      ['273a63_c451e954ff8740338204915f904d8798', 'Fitbit'],
      ['273a63_0a60d1d6c15b421e9f0eca5c4c9e592b', 'Garmin'],
      ['273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e', 'Google Health'],
      ['273a63_0c0e48cc065d4ee3bf506f6d47440518', 'Health Connect']
    ].map(([id, name]) => `<img src="https://static.wixstatic.com/media/${id}~mv2.png" alt="${name}" title="${name}" loading="lazy" />`).join('');
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
      .kc-badges{display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center}
      .kc-badges img{width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);padding:4px;object-fit:contain}
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
            <p class="kc-note">Free plan available. Save 50% on yearly. Cancel anytime.</p>
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
    return { source: 'tool-sleep-metrics', variant: 'comparison' };
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
            <img src="${logoUrl}" alt="Kygo" class="logo-img" />
            Sleep Metrics
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
              <div class="hero-pill animate-on-scroll"><span class="dot"></span> ${hs.metrics} METRICS · ${hs.cats} CATEGORIES · ${hs.devices} DEVICES</div>
              <h1 class="animate-on-scroll">What does your wearable <span class="hl">track while you sleep?</span></h1>
              <p class="hero-lede animate-on-scroll">Every sleep metric across Oura, Fitbit, Apple Watch and Garmin — <strong>what each device records, what's exclusive to one brand, and how it's measured</strong>. All of it from official documentation.</p>
            </div>
            <div class="hero-vis animate-on-scroll">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> Best coverage</span>
                <span class="hero-vis-tag">no device tracks all</span>
              </div>
              <div class="hv-body">
                <div class="hv-big">${hs.bestN}<span class="unit">/${hs.metrics}</span></div>
                <div class="hv-text">
                  <p>metrics tracked by <strong>${hs.bestName}</strong>, the widest coverage of any device here — and still barely half the list.</p>
                  <span class="hv-src">Counted from each brand's own documentation</span>
                </div>
              </div>
            </div>
          </div>
          <div class="hero-stats animate-on-scroll">
            <div class="hero-stat"><div class="num">${hs.metrics}</div><div class="lbl">Sleep metrics compared</div></div>
            <div class="hero-stat"><div class="num">${hs.cats}</div><div class="lbl">Metric categories</div></div>
            <div class="hero-stat"><div class="num">${hs.devices}</div><div class="lbl">Devices side by side</div></div>
            <div class="hero-stat"><div class="num">${hs.sources}</div><div class="lbl">Verified sources</div></div>
          </div>
        </div>
      </section>

      <!-- Feature Matrix -->
      <section class="matrix-section" id="compare">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Sleep Metric Comparison</h2>
          <p class="section-sub animate-on-scroll">Tap any metric to see how each device measures it.</p>

          <div class="stats-bar animate-on-scroll">${this._renderDeviceStatsBar()}</div>

          <div class="cat-tabs animate-on-scroll" role="tablist">${this._renderCategoryTabs()}</div>

          <div class="metric-grid animate-on-scroll">${this._renderMetricGrid()}</div>
        </div>
      </section>
      ${this._renderAppCta('gray')}


      <!-- Blog CTA -->
      <section class="blog-cta-section">
        <div class="container">
          <div class="blog-cta animate-on-scroll">
            <div class="blog-cta-badge">
              <div class="blog-cta-badge-dot"></div>
              <span>Free Forever Plan</span>
            </div>
            <div class="blog-cta-headline">See how your food affects your <span class="highlight">sleep, energy, and recovery</span></div>
            <p class="blog-cta-sub">Stop guessing which of these applies to you. Kygo correlates your meals, caffeine, and alcohol with YOUR sleep stages.</p>
            <div class="blog-cta-actions">
              <div class="blog-cta-buttons">
                <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" target="_blank" rel="noopener noreferrer" class="blog-cta-btn cta-primary" data-track-position="early" data-track-label="sleep-metrics-early-ios">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </a>
                <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" target="_blank" rel="noopener" class="cta-android" data-action="android-download" data-track-position="early" data-track-label="sleep-metrics-early-android">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                  Download for Android
                </a>
              </div>
              <span class="blog-cta-meta">Free plan available. Save 50% on yearly. Cancel anytime.</span>
            </div>
            <div class="blog-cta-devices">
              <span class="blog-cta-devices-label">Works with</span>
              <div class="blog-cta-device-tags">
                <span class="blog-cta-device-tag"><img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura">Oura</span>
                <span class="blog-cta-device-tag"><img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple">Apple</span>
                <span class="blog-cta-device-tag"><img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit">Fitbit</span>
                <span class="blog-cta-device-tag"><img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin">Garmin</span>
                <span class="blog-cta-device-tag"><img src="https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png" alt="Google Health">Google Health</span>
                <span class="blog-cta-device-tag"><img src="https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png" alt="Health Connect">Health Connect</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      ${this._renderEmailCta()}



      <!-- Exclusive Features -->
      <section class="exclusive-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Exclusive Sleep Features</h2>
          <p class="section-sub animate-on-scroll">Features only one device offers \u2014 the biggest differentiators for your purchase decision.</p>
          <div class="excl-grid animate-on-scroll">${this._renderExclusiveCards()}</div>
        </div>
      </section>

      <!-- Best By Use Case -->
      ${this._renderRelatedPosts()}

      <section class="usecase-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Best Wearable by Sleep Priority</h2>
          <p class="section-sub animate-on-scroll">What matters most to you? Here\u2019s what the data says.</p>
          <div class="uc-list animate-on-scroll">${this._renderUseCases()}</div>
        </div>
      </section>

      <!-- Sources -->
      ${this._renderRelatedTools()}

      <section class="sources-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Sources</h2>
          <p class="section-sub animate-on-scroll">All data sourced from official manufacturer documentation and peer-reviewed research.</p>
          <div class="sources-wrap animate-on-scroll">${this._renderSources()}</div>
        </div>
      </section>

      <!-- CTA -->
      <!-- Footer -->
      <footer class="tool-footer">
        <div class="container">
          <a href="https://www.kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" loading="lazy" />
            Kygo Health
          </a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <div class="footer-links">
            <a href="https://www.kygo.app" target="_blank" rel="noopener">Kygo App</a>
            <a href="https://www.kygo.app/privacy-policy" target="_blank" rel="noopener">Privacy</a>
            <a href="https://www.kygo.app/terms-conditions" target="_blank" rel="noopener">Terms</a>
          </div>
          <p class="footer-copyright">Data sourced from official manufacturer documentation. Last updated February 2025.</p>
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
      h1, h2, h3, h4 { font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 600; line-height: 1.2; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

      /* Animations */
      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: var(--delay, 0ms); }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      /* ── Header ── */
      .header { background: white; border-bottom: 1px solid var(--gray-200); padding: 12px 16px; position: sticky; top: 0; z-index: 50; }
      .header-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
      .logo { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; color: var(--dark); text-decoration: none; }
      .logo-img { height: 28px; width: auto; }
      .nav-cta-group { margin-left:auto; display:inline-flex; align-items:center; gap:8px; }
      .nav-cta-group .nav-store-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border-radius:8px; font-weight:600; font-size:13px; text-decoration:none; white-space:nowrap; line-height:1; }
      .nav-cta-group .nav-store-btn svg { width:15px; height:15px; flex-shrink:0; }
      .nav-cta-group .nav-store-ios { background:var(--green); color:#fff; }
      .nav-cta-group .nav-store-ios:hover { background:var(--green-dark); color:#fff; }
      .nav-cta-group .nav-store-android { background:#fff; color:var(--green-dark); border:1.5px solid var(--gray-200); }
      .nav-cta-group .nav-store-android:hover { border-color:var(--green); color:var(--green-dark); }
      @media (max-width:360px){ .nav-cta-group .nav-store-btn span { display:none; } .nav-cta-group .nav-store-btn { padding:8px 10px; } }

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

      /* ── Stats Bar ── */
      .stats-bar { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 20px; }
      .stat-card { display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: white; border-radius: var(--radius-sm); border: 1px solid var(--gray-200); transition: all 0.2s; }
      .stat-card:hover { border-color: var(--green); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
      .stat-img { width: 28px; height: 28px; border-radius: 8px; object-fit: contain; flex-shrink: 0; }
      .stat-info { display: flex; flex-direction: column; min-width: 0; }
      .stat-name { font-size: 11px; font-weight: 600; color: var(--dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .stat-count { font-size: 11px; color: var(--green-dark); font-weight: 700; }

      /* ── Matrix Section ── */
      .matrix-section { padding: 48px 0; background: #fff; }

      /* Category Tabs */
      .cat-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 20px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
      .cat-tabs::-webkit-scrollbar { display: none; }
      .cat-tab { padding: 8px 14px; border-radius: 50px; border: 2px solid var(--gray-200); background: #fff; font-family: inherit; font-size: 12px; font-weight: 500; color: var(--gray-600); cursor: pointer; white-space: nowrap; transition: all 0.2s; display: flex; align-items: center; gap: 5px; }
      .cat-tab:hover { border-color: var(--gray-300); color: var(--dark); }
      .cat-tab.active { background: var(--green-light); color: var(--green-dark); border-color: var(--green); font-weight: 600; }
      .cat-tab-icon { width: 14px; height: 14px; display: flex; flex-shrink: 0; }
      .cat-tab-icon svg { width: 100%; height: 100%; }

      /* Metric Grid */
      .metric-grid { background: white; border-radius: var(--radius); border: 1px solid var(--gray-200); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
      .grid-header { display: grid; grid-template-columns: 1fr repeat(4, 30px); gap: 0; background: var(--gray-50); border-bottom: 2px solid var(--gray-200); padding: 10px 10px; align-items: center; position: sticky; top: 56px; z-index: 5; border-radius: var(--radius) var(--radius) 0 0; }
      .grid-metric-label { font-size: 11px; font-weight: 700; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.5px; }
      .grid-device-header { display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; color: inherit; transition: transform 0.15s; }
      .grid-device-header:hover { transform: scale(1.1); }
      .grid-device-header span { font-size: 9px; font-weight: 600; color: var(--gray-600); text-align: center; line-height: 1.1; display: none; }
      .grid-device-img { width: 20px; height: 20px; border-radius: 5px; object-fit: contain; }

      .grid-row-wrap { border-bottom: 1px solid var(--gray-100); }
      .grid-row-wrap:last-child { border-bottom: none; }
      .grid-row { display: grid; grid-template-columns: 1fr repeat(4, 30px); gap: 0; padding: 12px 10px; align-items: center; transition: background 0.15s; }
      .grid-row-wrap.expandable .grid-row { cursor: pointer; }
      .grid-row-wrap.expandable .grid-row:hover { background: var(--gray-50); }
      .grid-metric-name { font-size: 12px; font-weight: 500; color: var(--dark); display: flex; align-items: center; gap: 4px; padding-right: 4px; }
      .grid-expand-icon { width: 12px; height: 12px; color: var(--gray-400); transition: transform 0.3s; flex-shrink: 0; display: flex; }
      .grid-expand-icon svg { width: 100%; height: 100%; }
      .grid-row-wrap.expanded .grid-expand-icon { transform: rotate(180deg); }
      .grid-cell { display: flex; align-items: center; justify-content: center; }
      .cell-check { width: 20px; height: 20px; color: var(--green); display: flex; }
      .cell-check svg { width: 100%; height: 100%; }
      .cell-dash { width: 16px; height: 16px; color: var(--gray-300); display: flex; }
      .cell-dash svg { width: 100%; height: 100%; }

      /* Grid Detail Expansion */
      .grid-detail { max-height: 0; overflow: hidden; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), padding 0.35s cubic-bezier(0.4,0,0.2,1); padding: 0 14px; }
      .grid-row-wrap.expanded .grid-detail { max-height: 400px; padding: 0 14px 14px; }
      .grid-detail-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      .detail-card { padding: 10px 12px; background: var(--gray-50); border-radius: 8px; border-left: 3px solid var(--green); }
      .detail-card.unavailable { border-left-color: var(--gray-200); opacity: 0.5; }
      .detail-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; text-decoration: none; color: inherit; }
      .detail-icon { width: 20px; height: 20px; border-radius: 5px; object-fit: contain; flex-shrink: 0; }
      .detail-device { font-size: 11px; font-weight: 700; color: var(--dark); text-transform: uppercase; letter-spacing: 0.3px; }
      .detail-card.unavailable .detail-device { color: var(--gray-400); }
      .detail-desc { font-size: 12px; color: var(--gray-600); line-height: 1.5; }
      .detail-na { font-size: 12px; color: var(--gray-400); font-style: italic; }

      /* ── Exclusive Features ── */
      .exclusive-section { padding: 48px 0; background: var(--gray-50); }
      .excl-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
      .excl-card { background: white; border-radius: var(--radius); border: 1px solid var(--gray-200); overflow: hidden; transition: all 0.3s ease; box-shadow: var(--shadow); }
      .excl-card:hover { border-color: var(--green); box-shadow: var(--shadow-hover); transform: translateY(-2px); }
      .excl-card.expanded { border-color: var(--green); box-shadow: 0 8px 24px rgba(34,197,94,0.12); }
      .excl-header { display: flex; align-items: center; gap: 12px; padding: 16px 20px; cursor: pointer; }
      .excl-img { width: 40px; height: 40px; border-radius: 10px; object-fit: contain; flex-shrink: 0; }
      .excl-info { flex: 1; min-width: 0; }
      .excl-info h3 { font-size: 16px; margin-bottom: 2px; }
      .excl-name-link { color: inherit; text-decoration: underline; text-decoration-color: var(--gray-300); text-underline-offset: 2px; transition: text-decoration-color 0.2s; }
      .excl-name-link:hover { text-decoration-color: var(--green); }
      .excl-count { font-size: 12px; color: var(--green-dark); font-weight: 600; }
      .excl-toggle { flex-shrink: 0; color: var(--gray-400); transition: transform 0.3s; width: 20px; height: 20px; }
      .excl-toggle svg { width: 100%; height: 100%; }
      .excl-card.expanded .excl-toggle { transform: rotate(180deg); }
      .excl-body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.4s cubic-bezier(0.4,0,0.2,1); padding: 0 20px; }
      .excl-card.expanded .excl-body { max-height: 600px; padding: 0 20px 20px; }
      .excl-list { list-style: none; }
      .excl-list li { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 13px; line-height: 1.5; }
      .excl-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 6px; background: var(--green); }
      .excl-list strong { display: block; color: var(--dark); font-weight: 600; }
      .excl-fdesc { display: block; color: var(--gray-600); font-size: 12px; }
      .excl-buy { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; margin-top: 12px; background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-sm); text-decoration: none; color: var(--green-dark); font-size: 13px; font-weight: 600; transition: all 0.2s; }
      .excl-buy:hover { border-color: var(--green); background: var(--green-light); }
      .excl-buy-arrow { width: 14px; height: 14px; display: flex; }
      .excl-buy-arrow svg { width: 100%; height: 100%; }

      /* ── Use Cases ── */
      .usecase-section { padding: 48px 0; background: var(--gray-50); }
      .uc-list { display: flex; flex-direction: column; background: #fff; border-radius: var(--radius); border: 1px solid var(--gray-200); overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
      .uc-row { display: grid; grid-template-columns: 36px 1fr; align-items: start; gap: 8px 10px; padding: 14px 14px; border-bottom: 1px solid var(--gray-100); border-left: 3px solid transparent; transition: all 0.2s; }
      .uc-row:last-child { border-bottom: none; }
      .uc-row:hover { background: var(--gray-50); border-left-color: var(--green); transform: translateX(2px); }
      .uc-icon { width: 32px; height: 32px; color: var(--green-dark); display: flex; align-items: center; justify-content: center; background: var(--green-light); border-radius: 8px; padding: 5px; }
      .uc-icon svg { width: 100%; height: 100%; }
      .uc-info { min-width: 0; }
      .uc-label { font-size: 14px; font-weight: 600; color: var(--dark); margin-bottom: 2px; }
      .uc-note { font-size: 12px; color: var(--gray-400); line-height: 1.4; }
      .uc-devices { display: flex; gap: 6px; align-items: center; grid-column: 2; }
      .uc-device-img { width: 28px; height: 28px; border-radius: 8px; object-fit: contain; border: 1px solid var(--gray-200); background: #fff; }

      /* ── Sources ── */
      .sources-section { padding: 48px 0; background: var(--gray-50); }
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

      /* ── Blog CTA (below comparison) ── */
      .blog-cta-section { padding: 48px 0; }
      .blog-cta {
        width: 100%;
        max-width: 680px;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        background: linear-gradient(135deg, var(--dark) 0%, var(--gray-700, #334155) 100%);
        padding: 24px 20px;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 16px 40px rgba(30,41,59,0.25);
      }
      .blog-cta::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -30%;
        width: 260px;
        height: 260px;
        background: radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%);
        pointer-events: none;
      }
      .blog-cta-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(34,197,94,0.1);
        border: 1px solid rgba(34,197,94,0.2);
        border-radius: 16px;
        padding: 4px 10px;
        margin-bottom: 16px;
        position: relative;
        z-index: 1;
      }
      .blog-cta-badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--green);
        animation: blogCtaPulse 2s ease-in-out infinite;
      }
      @keyframes blogCtaPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      .blog-cta-badge span {
        font-size: 10px;
        font-weight: 600;
        color: var(--green);
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }
      .blog-cta-headline {
        font-family: 'Space Grotesk', -apple-system, sans-serif;
        font-size: 20px;
        font-weight: 600;
        color: white;
        line-height: 1.25;
        margin-bottom: 10px;
        position: relative;
        z-index: 1;
      }
      .blog-cta-headline .highlight { color: var(--green); }
      .blog-cta-sub {
        font-size: 14px;
        color: #94A3B8;
        line-height: 1.65;
        margin-bottom: 20px;
        position: relative;
        z-index: 1;
      }
      .blog-cta-actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        position: relative;
        z-index: 1;
      }
      .blog-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; white-space:nowrap; }
      .blog-cta-btn:hover { background: var(--green-dark); }
      .blog-cta-btn svg { width: 18px; height: 18px; }
      .blog-cta-meta {
        font-size: 12px;
        color: #94A3B8;
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .blog-cta-devices {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid rgba(255,255,255,0.08);
        position: relative;
        z-index: 1;
      }
      .blog-cta-devices-label {
        font-size: 10px;
        font-weight: 500;
        color: #94A3B8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .blog-cta-device-tags {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
        width: 100%;
      }
      .blog-cta-device-tag {
        font-size: 11px;
        font-weight: 500;
        color: #94A3B8;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 8px;
        padding: 4px 8px;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.2s;
      }
      .blog-cta-device-tag:hover {
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.15);
      }
      .blog-cta-device-tag img {
        width: 14px;
        height: 14px;
        border-radius: 3px;
        object-fit: contain;
      }

      /* ── CTA ── */
      .cta-section { padding: 38px 0; }
      .cta-buttons{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
      .cta-box { background: linear-gradient(135deg, var(--green), var(--green-dark)); border-radius: var(--radius); padding: 26px 16px; text-align: center; position: relative; overflow: hidden; }
      .cta-box::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%); pointer-events: none; }
      .cta-box-content { position: relative; z-index: 1; }
      .cta-icon-wrap { width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; }
      .cta-box h2 { font-size: clamp(20px, 5vw, 24px); margin-bottom: 10px; color: white; }
      .cta-box p { font-size: 14px; color: rgba(255,255,255,0.85); margin-bottom: 24px; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.6; }
      .cta-btn { display: inline-flex; align-items: center; gap: 8px; background: white; color: var(--green-dark); padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; border: none; cursor: pointer; }
      .cta-btn:hover { background: var(--gray-100); }
      .cta-features { display: flex; flex-direction: column; justify-content: center; gap: 10px; margin-top: 20px; font-size: 13px; color: rgba(255,255,255,0.8); }
      .cta-feat { display: flex; align-items: center; justify-content: center; gap: 8px; }
      .cta-feat svg { color: white; flex-shrink: 0; }
      .blog-cta-buttons{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
      .cta-android{background:white;color:var(--green-dark);padding:12px 24px;border-radius:var(--radius-sm, 10px);font-weight:600;font-size:15px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:background 0.2s;border:none;cursor:pointer}
      .cta-android:hover{background:var(--gray-100)}
      .cta-android svg{width:18px;height:18px}
      @media(max-width:480px){.cta-buttons{flex-direction:column;align-items:stretch}.cta-buttons a{width:100%;justify-content:center;text-align:center}.blog-cta-buttons{flex-direction:column;align-items:stretch}.blog-cta-buttons a{width:100%;justify-content:center;text-align:center}}

      /* ── Footer ── */
      .tool-footer { padding: 32px 0; text-align: center; border-top: 1px solid var(--gray-200); }
      .footer-brand { display: inline-flex; align-items: center; gap: 8px; color: var(--dark); font-weight: 600; text-decoration: none; margin-bottom: 6px; font-size: 14px; }
      .footer-brand:hover { color: var(--green); }
      .footer-logo { height: 24px; width: auto; }
      .footer-tagline { color: var(--gray-600); font-size: 12px; margin-bottom: 12px; }
      .footer-links { display: flex; justify-content: center; gap: 16px; font-size: 12px; margin-bottom: 12px; flex-wrap: wrap; }
      .footer-links a { color: var(--gray-400); text-decoration: none; }
      .footer-links a:hover { color: var(--dark); }
      .footer-copyright { font-size: 11px; color: var(--gray-400); margin-bottom: 4px; line-height: 1.6; }
      .footer-affiliate { font-style: italic; }

      /* ── Tablet ── */
      @media (min-width: 768px) {
        .header { padding: 14px 24px; }
        .logo { font-size: 16px; gap: 10px; }
        .logo-img { height: 32px; }
        .section-title { font-size: 32px; }
        .matrix-section, .exclusive-section, .usecase-section, .sources-section, .cta-section, .blog-cta-section { padding: 64px 0; }
        .blog-cta { padding: 32px 28px; border-radius: 18px; }
        .blog-cta-headline { font-size: 24px; }
        .blog-cta-sub { font-size: 15px; }
        .blog-cta-actions { flex-direction: row; align-items: center; gap: 16px; }
        .blog-cta-btn { width: auto; }
        .blog-cta-devices { flex-direction: row; align-items: center; gap: 14px; }
        .blog-cta-device-tags { grid-template-columns: repeat(4, auto); width: auto; }
        .stats-bar { grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .stat-card { padding: 12px 16px; gap: 10px; }
        .stat-img { width: 32px; height: 32px; }
        .stat-name { font-size: 13px; }
        .stat-count { font-size: 12px; }
        .grid-header { grid-template-columns: 1fr repeat(4, 80px); padding: 12px 20px; }
        .grid-device-header span { font-size: 10px; display: block; }
        .grid-device-img { width: 28px; height: 28px; }
        .grid-row { grid-template-columns: 1fr repeat(4, 80px); padding: 14px 20px; }
        .grid-metric-name { font-size: 14px; gap: 6px; padding-right: 8px; }
        .grid-expand-icon { width: 14px; height: 14px; }
        .grid-detail { padding: 0 20px; }
        .grid-row-wrap.expanded .grid-detail { padding: 0 20px 16px; }
        .grid-detail-cards { grid-template-columns: repeat(4, 1fr); }
        .excl-grid { grid-template-columns: 1fr 1fr; }
        .uc-row { grid-template-columns: 40px 1fr auto; gap: 16px; padding: 14px 20px; align-items: center; }
        .uc-label { font-size: 15px; }
        .uc-devices { grid-column: auto; }
        .uc-device-img { width: 36px; height: 36px; border-radius: 10px; }
        .cta-box { padding: 48px 32px; }
        .cta-box h2 { font-size: 28px; }
        .cta-box p { font-size: 16px; }
        .cta-features { flex-direction: row; gap: 24px; font-size: 14px; }
        .footer-brand { font-size: 16px; gap: 10px; }
        .footer-logo { height: 28px; }
      }

      /* ── Desktop ── */
      @media (min-width: 1024px) {
        .matrix-section, .exclusive-section, .usecase-section, .sources-section, .cta-section, .blog-cta-section { padding: 80px 0; }
        .blog-cta { padding: 40px 36px; border-radius: 20px; }
        .blog-cta-badge { padding: 5px 12px; margin-bottom: 20px; }
        .blog-cta-headline { font-size: 26px; margin-bottom: 12px; }
        .blog-cta-sub { font-size: 15px; margin-bottom: 28px; max-width: 560px; }
        .blog-cta-meta { font-size: 13px; }
        .blog-cta-devices { margin-top: 24px; padding-top: 24px; gap: 16px; }
        .blog-cta-device-tag { padding: 5px 10px; font-size: 11px; gap: 6px; }
        .blog-cta-device-tag img { width: 16px; height: 16px; }
        .grid-header { grid-template-columns: 1fr repeat(4, 120px); }
        .grid-row { grid-template-columns: 1fr repeat(4, 120px); }
        .excl-grid { grid-template-columns: 1fr 1fr; }
        .cta-box { padding: 56px 40px; border-radius: 24px; }
      }

      /* ── Reduced Motion ── */
      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .grid-detail, .excl-body, .excl-toggle, .src-toggle, .grid-expand-icon { transition: none; }
        .blog-cta-badge-dot { animation: none; }
      }
    `;
  }

  // ── Event Delegation ──────────────────────────────────────────────────

  _setupEventDelegation() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const shadow = this.shadowRoot;

    shadow.addEventListener('click', (e) => {
      // Category tabs
      const tab = e.target.closest('.cat-tab');
      if (tab) {
        this._activeCategory = tab.dataset.category;
        this._updateCategory();
        return;
      }

      // Metric row expansion (ignore if not expandable)
      const gridRow = e.target.closest('.grid-row');
      if (gridRow) {
        const wrap = gridRow.closest('.grid-row-wrap');
        if (wrap && wrap.classList.contains('expandable')) {
          this._toggleMetricRow(wrap.dataset.metric);
        }
        return;
      }

      // Exclusive card toggle (ignore affiliate links)
      if (e.target.closest('.excl-name-link') || e.target.closest('.excl-buy')) return;
      const exclHeader = e.target.closest('.excl-header');
      if (exclHeader) {
        const card = exclHeader.closest('.excl-card');
        const key = card.dataset.exclusive;
        this._expandedExclusive = this._expandedExclusive === key ? null : key;
        shadow.querySelectorAll('.excl-card').forEach(c => {
          const isExp = c.dataset.exclusive === this._expandedExclusive;
          c.classList.toggle('expanded', isExp);
          const hdr = c.querySelector('.excl-header');
          if (hdr) hdr.setAttribute('aria-expanded', isExp);
        });
        return;
      }

      // Sources · show-all toggle
      if (e.target.closest('[data-src-toggle]')) { this._toggleSources(); return; }
    });

    // Keyboard support for grid rows
    shadow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const gridRow = e.target.closest('.grid-row');
        if (gridRow) {
          const wrap = gridRow.closest('.grid-row-wrap');
          if (wrap && wrap.classList.contains('expandable')) {
            e.preventDefault();
            this._toggleMetricRow(wrap.dataset.metric);
          }
        }
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

  // ── Structured Data ───────────────────────────────────────────────────

  _injectStructuredData() {
    if (document.querySelector('script[data-kygo-sleep-ld]')) return;
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Sleep Metrics Comparison Tool',
      'description': 'Compare every sleep metric tracked by Oura Ring, Fitbit, Apple Watch, and Garmin. 38 metrics across 10 categories including sleep stages, HRV, SpO2, respiratory rate, sleep apnea detection, and more. See what each device tracks, exclusive features, and how they measure each metric.',
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'url': 'https://www.kygo.app/tools/sleep-metrics',
      'datePublished': '2026-02-01',
      'dateModified': '2026-03-18',
      'softwareVersion': '1.0',
      'inLanguage': 'en',
      'isAccessibleForFree': true,
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
      'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
      'alternateName': 'Kygo Sleep Metrics Comparison Tool',
      'featureList': 'Compare 4 wearable brands, 38 sleep metrics, 10 metric categories, exclusive feature identification, sensor technology details',
      'keywords': 'sleep metrics comparison, Oura Ring sleep tracking, Apple Watch sleep tracking, Fitbit sleep tracking, Garmin sleep tracking, wearable sleep features, sleep stage tracking, sleep apnea detection, HRV tracking, best wearable for sleep'
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-kygo-sleep-ld', '');
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);

    // FAQPage schema is managed via Wix site-level LD+JSON to avoid duplicates

    // BreadcrumbList schema
    if (!document.querySelector('script[data-kygo-sleep-breadcrumb]')) {
      const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Kygo Health', 'item': 'https://www.kygo.app' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
          { '@type': 'ListItem', 'position': 3, 'name': 'Sleep Metrics', 'item': 'https://www.kygo.app/tools/sleep-metrics' }
        ]
      };
      const bcScript = document.createElement('script');
      bcScript.type = 'application/ld+json';
      bcScript.setAttribute('data-kygo-sleep-breadcrumb', '');
      bcScript.textContent = JSON.stringify(breadcrumb);
      document.head.appendChild(bcScript);
    }
  }
}

customElements.define('kygo-sleep-metrics', KygoSleepMetrics);
