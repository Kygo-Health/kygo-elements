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
    this._expandedSource = null;
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
        affiliateUrl: 'https://amzn.to/4aF93jj',
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
        affiliateUrl: 'https://amzn.to/3ZPkHDc',
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
        affiliateUrl: 'https://amzn.to/4rUcGst',
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
        affiliateUrl: 'https://amzn.to/4aF8l5D',
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

  get _sources() {
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
        ${deviceKeys.map(dk => `<div class="grid-device-header"><img src="${devices[dk].imageUrl}" alt="${devices[dk].short}" class="grid-device-img" /><span>${devices[dk].short}</span></div>`).join('')}
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
                    return `<div class="detail-card"><div class="detail-header"><img src="${d.imageUrl}" alt="${d.short}" class="detail-icon" loading="lazy" /><span class="detail-device">${d.short}</span></div><p class="detail-desc">${m[dk].desc}</p></div>`;
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
              <h3><a href="${d.affiliateUrl}" class="excl-name-link" target="_blank" rel="noopener sponsored">${d.name}</a></h3>
              <span class="excl-count">${d.exclusive.length} exclusive feature${d.exclusive.length > 1 ? 's' : ''}</span>
            </div>
            <div class="excl-toggle">${this._icon('chevDown')}</div>
          </div>
          <div class="excl-body">
            <ul class="excl-list">
              ${d.exclusive.map(f => `<li><span class="excl-dot"></span><div><strong>${f.metric}</strong><span class="excl-fdesc">${f.desc}</span></div></li>`).join('')}
            </ul>
            <a href="${d.affiliateUrl}" class="excl-buy" target="_blank" rel="noopener sponsored">
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

  _renderSources() {
    const devices = this._devices;
    const sources = this._sources;
    const keys = ['oura', 'fitbit', 'appleWatch', 'garmin'];
    return keys.map((dk, i) => {
      const d = devices[dk];
      const s = sources[dk];
      const isExpanded = this._expandedSource === dk;
      return `
        <div class="src-card ${isExpanded ? 'open' : ''}" data-source="${dk}">
          <div class="src-header" role="button" aria-expanded="${isExpanded}">
            <img src="${d.imageUrl}" alt="${d.name}" class="src-img" loading="lazy" />
            <span class="src-name">${d.name}</span>
            <span class="src-count">${s.length} sources</span>
            <span class="src-toggle">${this._icon('chevDown')}</span>
          </div>
          <div class="src-body">
            <ul class="src-list">
              ${s.map(link => `<li><a href="${link.url}" target="_blank" rel="noopener">${link.label} <span class="src-ext">${this._icon('externalLink')}</span></a></li>`).join('')}
            </ul>
          </div>
        </div>`;
    }).join('');
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

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <!-- Header -->
      <header class="header">
        <div class="header-inner">
          <a href="https://kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" />
            Sleep Metrics
          </a>
          <a href="https://kygo.app" class="header-link" target="_blank" rel="noopener">
            Get Kygo App ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge animate-on-scroll">EVERY SLEEP METRIC COMPARED</div>
          <h1 class="animate-on-scroll">What Does Your Wearable Actually Track While You Sleep?</h1>
          <p class="hero-sub animate-on-scroll">We broke down every sleep metric across Oura, Fitbit, Apple Watch, and Garmin \u2014 what each device tracks, what\u2019s exclusive, and how they measure it. All sourced from official documentation.</p>
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

      <!-- Exclusive Features -->
      <section class="exclusive-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Exclusive Sleep Features</h2>
          <p class="section-sub animate-on-scroll">Features only one device offers \u2014 the biggest differentiators for your purchase decision.</p>
          <div class="excl-grid animate-on-scroll">${this._renderExclusiveCards()}</div>
        </div>
      </section>

      <!-- Best By Use Case -->
      <section class="usecase-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Best Wearable by Sleep Priority</h2>
          <p class="section-sub animate-on-scroll">What matters most to you? Here\u2019s what the data says.</p>
          <div class="uc-list animate-on-scroll">${this._renderUseCases()}</div>
        </div>
      </section>

      <!-- Sources -->
      <section class="sources-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Sources</h2>
          <p class="section-sub animate-on-scroll">All data sourced from official manufacturer documentation and peer-reviewed research.</p>
          <div class="src-grid animate-on-scroll">${this._renderSources()}</div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-box animate-on-scroll">
            <div class="cta-box-content">
              <div class="cta-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
              <h2>Your sleep data tells half the story. Nutrition tells the rest.</h2>
              <p>What you eat directly impacts how you sleep. Kygo connects your wearable\u2019s sleep data with your nutrition to show you which foods improve your deep sleep, HRV, and recovery \u2014 and which ones don\u2019t.</p>
              <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" class="cta-btn" target="_blank" rel="noopener">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Download Free on iOS
              </a>
              <div class="cta-features">
                <span class="cta-feat"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Free forever plan</span>
                <span class="cta-feat"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Syncs with Oura, Fitbit, Apple Watch &amp; Garmin</span>
                <span class="cta-feat"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> AI food logging</span>
              </div>
            </div>
          </div>
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
            <a href="https://kygo.app" target="_blank" rel="noopener">Kygo App</a>
            <a href="https://kygo.app/privacy" target="_blank" rel="noopener">Privacy</a>
            <a href="https://kygo.app/terms" target="_blank" rel="noopener">Terms</a>
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
      .header-link { color: var(--green); text-decoration: none; font-size: 13px; display: flex; align-items: center; gap: 4px; font-weight: 500; transition: color 0.2s; }
      .header-link:hover { color: var(--green-dark); }
      .header-link svg { width: 14px; height: 14px; }

      /* ── Hero ── */
      .hero { padding: 48px 0 40px; text-align: center; }
      .hero-badge { display: inline-block; padding: 8px 16px; border-radius: 50px; background: var(--green-light); color: var(--green-dark); font-size: 12px; font-weight: 700; letter-spacing: 1px; margin-bottom: 16px; }
      .hero h1 { font-size: clamp(26px, 7vw, 36px); margin-bottom: 16px; color: var(--dark); }
      .hero-sub { font-size: clamp(15px, 4vw, 18px); color: var(--gray-600); max-width: 640px; margin: 0 auto; line-height: 1.7; }

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
      .metric-grid { background: white; border-radius: var(--radius); border: 1px solid var(--gray-200); overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
      .grid-header { display: grid; grid-template-columns: 1fr repeat(4, 48px); gap: 0; background: var(--gray-50); border-bottom: 2px solid var(--gray-200); padding: 10px 14px; align-items: center; position: sticky; top: 56px; z-index: 5; }
      .grid-metric-label { font-size: 11px; font-weight: 700; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.5px; }
      .grid-device-header { display: flex; flex-direction: column; align-items: center; gap: 2px; }
      .grid-device-header span { font-size: 9px; font-weight: 600; color: var(--gray-600); text-align: center; line-height: 1.1; }
      .grid-device-img { width: 24px; height: 24px; border-radius: 6px; object-fit: contain; }

      .grid-row-wrap { border-bottom: 1px solid var(--gray-100); }
      .grid-row-wrap:last-child { border-bottom: none; }
      .grid-row { display: grid; grid-template-columns: 1fr repeat(4, 48px); gap: 0; padding: 12px 14px; align-items: center; transition: background 0.15s; }
      .grid-row-wrap.expandable .grid-row { cursor: pointer; }
      .grid-row-wrap.expandable .grid-row:hover { background: var(--gray-50); }
      .grid-metric-name { font-size: 13px; font-weight: 500; color: var(--dark); display: flex; align-items: center; gap: 6px; padding-right: 8px; }
      .grid-expand-icon { width: 14px; height: 14px; color: var(--gray-400); transition: transform 0.3s; flex-shrink: 0; display: flex; }
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
      .detail-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
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
      .usecase-section { padding: 48px 0; background: #fff; }
      .uc-list { display: flex; flex-direction: column; background: #fff; border-radius: var(--radius); border: 1px solid var(--gray-200); overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
      .uc-row { display: grid; grid-template-columns: 36px 1fr auto; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--gray-100); border-left: 3px solid transparent; transition: all 0.2s; }
      .uc-row:last-child { border-bottom: none; }
      .uc-row:hover { background: var(--gray-50); border-left-color: var(--green); transform: translateX(2px); }
      .uc-icon { width: 32px; height: 32px; color: var(--green-dark); display: flex; align-items: center; justify-content: center; background: var(--green-light); border-radius: 8px; padding: 5px; }
      .uc-icon svg { width: 100%; height: 100%; }
      .uc-info { min-width: 0; }
      .uc-label { font-size: 14px; font-weight: 600; color: var(--dark); margin-bottom: 2px; }
      .uc-note { font-size: 12px; color: var(--gray-400); line-height: 1.4; }
      .uc-devices { display: flex; gap: 6px; align-items: center; }
      .uc-device-img { width: 32px; height: 32px; border-radius: 8px; object-fit: contain; border: 1px solid var(--gray-200); background: #fff; }

      /* ── Sources ── */
      .sources-section { padding: 48px 0; background: var(--gray-50); }
      .src-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
      .src-card { background: #fff; border-radius: var(--radius-sm); border: 1px solid var(--gray-200); overflow: hidden; transition: all 0.2s; }
      .src-card:hover { border-color: var(--gray-300); }
      .src-header { display: flex; align-items: center; padding: 12px 14px; cursor: pointer; gap: 10px; }
      .src-img { width: 28px; height: 28px; border-radius: 7px; object-fit: contain; flex-shrink: 0; }
      .src-name { font-size: 14px; font-weight: 600; color: var(--dark); flex: 1; }
      .src-count { font-size: 11px; color: var(--gray-400); font-weight: 500; }
      .src-toggle { width: 14px; height: 14px; color: var(--gray-400); transition: transform 0.3s; flex-shrink: 0; display: flex; }
      .src-toggle svg { width: 100%; height: 100%; }
      .src-card.open .src-toggle { transform: rotate(180deg); }
      .src-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding 0.35s ease; padding: 0 14px; }
      .src-card.open .src-body { max-height: 500px; padding: 0 14px 14px; }
      .src-list { list-style: none; }
      .src-list li { margin-bottom: 6px; }
      .src-list a { font-size: 13px; color: var(--green-dark); text-decoration: none; display: flex; align-items: center; gap: 6px; line-height: 1.4; transition: color 0.2s; }
      .src-list a:hover { color: var(--dark); text-decoration: underline; }
      .src-ext { width: 12px; height: 12px; flex-shrink: 0; display: inline-flex; }
      .src-ext svg { width: 100%; height: 100%; }

      /* ── CTA ── */
      .cta-section { padding: 48px 0; }
      .cta-box { background: linear-gradient(135deg, var(--green), var(--green-dark)); border-radius: var(--radius); padding: 32px 20px; text-align: center; position: relative; overflow: hidden; }
      .cta-box::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%); pointer-events: none; }
      .cta-box-content { position: relative; z-index: 1; }
      .cta-icon-wrap { width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; }
      .cta-box h2 { font-size: clamp(20px, 5vw, 24px); margin-bottom: 10px; color: white; }
      .cta-box p { font-size: 14px; color: rgba(255,255,255,0.85); margin-bottom: 24px; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.6; }
      .cta-btn { background: white; color: var(--green-dark); padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 15px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; border: none; cursor: pointer; font-family: inherit; }
      .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
      .cta-features { display: flex; flex-direction: column; justify-content: center; gap: 10px; margin-top: 20px; font-size: 13px; color: rgba(255,255,255,0.8); }
      .cta-feat { display: flex; align-items: center; justify-content: center; gap: 8px; }
      .cta-feat svg { color: white; flex-shrink: 0; }

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
        .header-link { font-size: 14px; gap: 6px; }
        .hero h1 { font-size: clamp(32px, 5vw, 44px); }
        .hero-sub { font-size: 18px; }
        .section-title { font-size: 32px; }
        .matrix-section, .exclusive-section, .usecase-section, .sources-section, .cta-section { padding: 64px 0; }
        .stats-bar { grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .stat-card { padding: 12px 16px; gap: 10px; }
        .stat-img { width: 32px; height: 32px; }
        .stat-name { font-size: 13px; }
        .stat-count { font-size: 12px; }
        .grid-header { grid-template-columns: 1fr repeat(4, 80px); padding: 12px 20px; }
        .grid-device-header span { font-size: 10px; }
        .grid-device-img { width: 28px; height: 28px; }
        .grid-row { grid-template-columns: 1fr repeat(4, 80px); padding: 14px 20px; }
        .grid-detail { padding: 0 20px; }
        .grid-row-wrap.expanded .grid-detail { padding: 0 20px 16px; }
        .grid-detail-cards { grid-template-columns: repeat(4, 1fr); }
        .excl-grid { grid-template-columns: 1fr 1fr; }
        .uc-row { grid-template-columns: 40px 1fr auto; gap: 16px; padding: 14px 20px; }
        .uc-label { font-size: 15px; }
        .uc-device-img { width: 36px; height: 36px; border-radius: 10px; }
        .src-grid { grid-template-columns: 1fr 1fr; }
        .cta-box { padding: 48px 32px; }
        .cta-box h2 { font-size: 28px; }
        .cta-box p { font-size: 16px; }
        .cta-features { flex-direction: row; gap: 24px; font-size: 14px; }
        .footer-brand { font-size: 16px; gap: 10px; }
        .footer-logo { height: 28px; }
      }

      /* ── Desktop ── */
      @media (min-width: 1024px) {
        .hero { padding: 80px 0 64px; }
        .matrix-section, .exclusive-section, .usecase-section, .sources-section, .cta-section { padding: 80px 0; }
        .grid-header { grid-template-columns: 1fr repeat(4, 120px); }
        .grid-row { grid-template-columns: 1fr repeat(4, 120px); }
        .excl-grid { grid-template-columns: 1fr 1fr; }
        .cta-box { padding: 56px 40px; border-radius: 24px; }
      }

      /* ── Reduced Motion ── */
      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .grid-detail, .excl-body, .src-body, .excl-toggle, .src-toggle, .grid-expand-icon { transition: none; }
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

      // Source accordion
      const srcHeader = e.target.closest('.src-header');
      if (srcHeader) {
        const card = srcHeader.closest('.src-card');
        const key = card.dataset.source;
        this._expandedSource = this._expandedSource === key ? null : key;
        shadow.querySelectorAll('.src-card').forEach(c => {
          const isExp = c.dataset.source === this._expandedSource;
          c.classList.toggle('open', isExp);
          const hdr = c.querySelector('.src-header');
          if (hdr) hdr.setAttribute('aria-expanded', isExp);
        });
        return;
      }
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
      'url': 'https://www.kygohealth.com/sleep-metrics',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygohealth.com' },
      'keywords': 'sleep metrics comparison, Oura Ring sleep tracking, Apple Watch sleep tracking, Fitbit sleep tracking, Garmin sleep tracking, wearable sleep features, sleep stage tracking, sleep apnea detection, HRV tracking, best wearable for sleep'
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-kygo-sleep-ld', '');
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }
}

customElements.define('kygo-sleep-metrics', KygoSleepMetrics);
