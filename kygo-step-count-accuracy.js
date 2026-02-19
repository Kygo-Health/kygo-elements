/**
 * Kygo Health — Step Count Accuracy Tool
 * Tag: kygo-step-count-accuracy
 * Compares step count accuracy across 8 wearables, backed by peer-reviewed research.
 */

function __seo(el, text) {
  if (el.querySelector('[data-seo]')) return;
  const d = document.createElement('div');
  d.setAttribute('data-seo', '');
  d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
  d.textContent = text;
  el.appendChild(d);
}

class KygoStepCountAccuracy extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._expandedDevice = null;
    this._expandedCaveats = new Set();
    this._expandedFactors = new Set();
    this._eventsBound = false;
  }

  connectedCallback() {
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, 'Step Count Accuracy by Wearable Device — Kygo Health. Garmin is the most accurate step counter (MAPE 0.6–3.5% lab, 82.6% overall). Apple Watch ranks #2 (MAPE 0.9–3.4% lab, 81.1% overall). Fitbit ranks #3 (MAPE ~5–8% lab, mixed free-living). Samsung Galaxy Watch has moderate accuracy with overcounting issues. COROS is excellent for running. Polar is not recommended for step counting. Oura Ring has acceptable lab accuracy but +2,124 steps average overcount in free-living. WHOOP added step counting in October 2024 with no published validation data. Data sourced from 20+ peer-reviewed studies including Roos 2020, Feehan 2020, Kim 2024, Kristiansson 2023, Choe & Kang 2025. Walking speed is the #1 accuracy factor — accuracy drops dramatically below 0.9 m/s.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Data ──────────────────────────────────────────────────────────────

  get _devices() {
    return {
      garmin: {
        name: 'Garmin', short: 'Garmin', rank: 1,
        rankLabel: '🥇 Most Accurate',
        color: '#007CC3',
        imageUrl: 'https://static.wixstatic.com/media/273a63_c545c093c04d4ca4ade77e5ca43fd433~mv2.png',
        wearLocation: 'Wrist',
        overallPct: 82.6,
        mapeLab: '0.6–3.5%',
        mapeFree: '10–17.8%',
        bias: 'Underestimates',
        algorithm: 'Threshold-based peak detection with 10-step minimum bout filter',
        keyDiff: '10-step minimum bout: does not register steps until 10+ consecutive step-like patterns detected, then retroactively credits all 10. Dramatically reduces phantom steps but misses very short bursts.',
        bestFor: 'Step accuracy, runners, outdoor sports',
        subscription: 'None required',
        strengths: ['Best overall step accuracy (82.6%)', 'MAPE 0.6–1.27% at normal walking speeds', 'Validated across lawn, gravel, asphalt, tile', '10-step filter eliminates most phantom steps', 'Best VO2 max & GPS tracking'],
        weaknesses: ['Undercounts at slow speeds (<1.6 km/h)', '10-step gate misses very short bursts (<10 consecutive steps)', 'Vivofit free-living MAPE 17.8%', 'Can count driving/road vibrations', 'Entry models lack gyroscope'],
        falseSteps: ['Driving (road vibrations)', 'Brushing teeth', 'Showering', 'Crocheting', 'Vigorous hand gestures'],
        modelData: [
          { model: 'Vivoactive 4', mape: '<2%', condition: 'Exercise testing', source: 'Nature Scientific Reports (2024)' },
          { model: 'Vivosmart HR+', mape: '≤5% treadmill, ≤10% free motion', condition: 'All conditions', source: 'Roos et al. (2020)' },
          { model: 'Vivosmart HR', mape: '0.61–1.27%', condition: 'Treadmill 3.2–4.8 km/h', source: 'Feehan et al. (2020)' },
          { model: 'Vivosmart', mape: '1.2–3.5%', condition: 'Three treadmill speeds', source: 'Garmin validity review (2020)' },
          { model: 'Forerunner 265', mape: '0.3% (15 steps off / 5,000)', condition: 'Walking test', source: 'Android Central (2023)', note: 'Consumer test, not peer-reviewed' },
          { model: 'Vivofit', mape: '17.8%', condition: 'Free-living (at home)', source: 'Garmin validity review (2020)' }
        ],
        studies: ['roos2020', 'feehan2020', 'natureSR2024'],
        affiliateLinks: [
          { name: 'Garmin Forerunner 265', url: 'https://amzn.to/4r7eC0M' },
          { name: 'Garmin Venu 3', url: 'https://amzn.to/3ZUWQ50' },
          { name: 'Garmin Fenix 8', url: 'https://amzn.to/4qp6dEU' }
        ]
      },
      'apple-watch': {
        name: 'Apple Watch', short: 'Apple Watch', rank: 2,
        rankLabel: '🥈 Best All-Around',
        color: '#A2AAAD',
        imageUrl: 'https://static.wixstatic.com/media/273a63_68b4900c356b4d0c8982e5ecd10f04fe~mv2.png',
        wearLocation: 'Wrist',
        overallPct: 81.1,
        mapeLab: '0.9–3.4%',
        mapeFree: '6.4–10%',
        bias: 'Slight underestimate',
        algorithm: 'ML-enhanced peak detection via Core Motion framework + always-on motion coprocessor',
        keyDiff: 'High dynamic range gyroscope (Ultra); GPS-calibrated stride length; arm-swing pattern recognition with rotation data; always-on coprocessor for 24/7 tracking; r=0.99 correlation vs ActivPAL in free-living.',
        bestFor: 'All-around step tracking, consistency across speeds and activities',
        subscription: 'None required',
        strengths: ['81.1% overall accuracy', 'MAPE 6.4% free-living (r=0.99 vs ActivPAL)', '0.034% total error across all speeds (one study)', 'Best consistency across speed range', 'FDA-cleared ECG and sleep apnea detection'],
        weaknesses: ['23.9% MAPE for light-intensity / slow walking', '10.1% MAPE on treadmill', 'Age ≥40: 10.9% MAPE vs 4.3% for age <40', 'Some phantom steps while driving'],
        falseSteps: ['Driving', 'Desk work (newer models improved)'],
        modelData: [
          { model: 'Series 6', mape: '6.4%', condition: 'Free-living 24h vs ActivPAL', source: 'Kim et al. (2024)', note: 'r=0.99 correlation' },
          { model: 'Series 8', mape: '~81% overall', condition: 'Meta-analysis aggregate', source: 'WellnessPulse (2025)', note: 'Consumer aggregation' },
          { model: 'Ultra 2', mape: 'Best in 10-watch test', condition: '10,000-step walk/jog', source: 'Android Central (Dec 2025)', note: 'Consumer test, not peer-reviewed' },
          { model: 'Series 2', mape: '~18.5%', condition: 'Mixed conditions', source: 'Choe & Kang (2025)' }
        ],
        studies: ['kim2024', 'choekang2025', 'natureSR2024'],
        affiliateLinks: [
          { name: 'Apple Watch Series 10', url: 'https://amzn.to/4kw5Uaa' },
          { name: 'Apple Watch Ultra 2', url: 'https://amzn.to/4kqQi7K' }
        ]
      },
      fitbit: {
        name: 'Fitbit', short: 'Fitbit', rank: 3,
        rankLabel: '🥉 Most-Studied, Mixed Results',
        color: '#00B0B9',
        imageUrl: 'https://static.wixstatic.com/media/273a63_c12bab319dc34737a386c7449f5f92c7~mv2.png',
        wearLocation: 'Wrist',
        overallPct: 77.3,
        mapeLab: '~5–8%',
        mapeFree: '10–25%',
        bias: 'Mixed (underestimates lab; overestimates free-living)',
        algorithm: 'MEMS tri-axial peak detection + ML model (evolving post-Google acquisition)',
        keyDiff: 'Most-validated brand (144 studies, 12 models). Ankle placement dramatically improves accuracy: 5.9% error at 0.4 m/s vs. 48–75% error waist-worn. Fitbit Classic overestimates; Fitbit Charge underestimates.',
        bestFor: 'General fitness tracking, most research validation available',
        subscription: 'Premium optional ($9.99/mo)',
        strengths: ['Most peer-reviewed validation (144 studies)', 'Charge 2: 3.4% difference vs gold standard', 'Ankle placement gives near-clinical accuracy', 'Most affordable entry point'],
        weaknesses: ['Free-living MAPE 17.1–35.5% (Charge 2/Alta)', 'Within-brand inconsistency between models', 'Meets acceptable accuracy only ~50% of the time'],
        falseSteps: ['Various non-walking arm movements'],
        modelData: [
          { model: 'Sense', mape: '~8%', condition: 'Exercise testing', source: 'Nature Scientific Reports (2024)' },
          { model: 'Charge 2', mape: '3.4% diff vs gold standard', condition: 'Clinical validation', source: 'Straczkiewicz et al. (2023)' },
          { model: 'Charge 2 / Alta', mape: '17.1–35.5%', condition: '24-hr free-living', source: 'Giurgiu et al. (2023)' },
          { model: 'Charge / Charge HR', mape: '<25%', condition: '20 studies (systematic review)', source: 'Germini et al. (2022)' }
        ],
        studies: ['roos2020', 'straczkiewicz2023', 'giurgiu2023', 'germini2022'],
        affiliateLinks: [
          { name: 'Fitbit Charge 6', url: 'https://amzn.to/4chbzyr' },
          { name: 'Fitbit Sense 2', url: 'https://amzn.to/4ck9W33' }
        ]
      },
      samsung: {
        name: 'Samsung Galaxy Watch', short: 'Samsung', rank: 4,
        rankLabel: 'Moderate — Overcounting Issues',
        color: '#F59E0B',
        imageUrl: 'https://static.wixstatic.com/media/273a63_21fd42e4a5d1459bb6db751a0ea5e161~mv2.png',
        wearLocation: 'Wrist',
        overallPct: null,
        overallNote: 'Moderate (r=0.82 vs ActivPAL — lower than Apple Watch r=0.99 in same study)',
        mapeLab: 'Limited data',
        mapeFree: 'Limited data',
        bias: 'Overestimates',
        algorithm: 'Accelerometer + gyroscope via Samsung Health',
        keyDiff: 'BioActive Sensor integrates multiple sensors. Samsung Health can fuse phone + watch step data (may introduce discrepancies). Galaxy Watch 5: ~2% in controlled test but thousands of phantom steps reported daily.',
        bestFor: 'Android integration, general smartwatch features',
        subscription: 'None required',
        strengths: ['~2% MAPE in controlled walking test (Watch 5)', 'BioActive multi-sensor fusion', 'FDA-cleared ECG and sleep apnea detection', 'Strong Android ecosystem'],
        weaknesses: ['r=0.82 vs ActivPAL (vs Apple Watch r=0.99)', '2,000–3,500+ phantom steps/day at desk/driving', 'Fewer independent validation studies', 'Gyroscope may be overly sensitive to arm movements'],
        falseSteps: ['Desk work', 'Driving', 'Stationary bike'],
        modelData: [
          { model: 'Galaxy Watch 4', mape: null, condition: '24-hr free-living', source: 'Kim et al. (2024)', note: 'r=0.82 vs ActivPAL (lower than Apple Watch r=0.99 in same study)' },
          { model: 'Galaxy Watch 5', mape: '~2% (~200 steps off / 10,000)', condition: 'Walking test', source: 'Android Central (2025)', note: 'Consumer test, not peer-reviewed' }
        ],
        studies: ['kim2024'],
        affiliateLinks: [
          { name: 'Galaxy Watch 7', url: 'https://amzn.to/3Owp4R1' },
          { name: 'Galaxy Watch Ultra', url: 'https://amzn.to/3ZqzKmE' }
        ]
      },
      coros: {
        name: 'COROS', short: 'COROS', rank: 5,
        rankLabel: 'Good — Running Focused',
        color: '#EF4444',
        imageUrl: null,
        wearLocation: 'Wrist',
        overallPct: null,
        overallNote: 'Good (~98.6% in walking test; near-exact for running)',
        mapeLab: '~1.6%',
        mapeFree: 'Limited data',
        bias: 'Slight underestimate',
        algorithm: 'Peak detection with continuous-motion filter + barometric altimeter',
        keyDiff: 'Requires continuous arm movement to trigger counting — filters out brief stops, meaning it will undercount short walking bursts but excels at sustained activity. Best-in-class for running cadence.',
        bestFor: 'Running-focused step and cadence tracking',
        subscription: 'None required',
        strengths: ['~98.6% accuracy in walking test', '1.6% MAPE (81 steps off / 5,000)', 'Excellent running cadence tracking', 'Long battery life', 'Barometric altimeter for elevation'],
        weaknesses: ['No peer-reviewed validation studies', 'Requires continuous arm motion to count', 'Undercounts short walking bursts (<10-step sprints)'],
        falseSteps: [],
        modelData: [
          { model: 'APEX 2 Pro', mape: '1.6% (81 steps off / 5,000)', condition: 'Walking test', source: 'Android Central (2023)', note: 'Consumer test, not peer-reviewed' }
        ],
        studies: [],
        affiliateLinks: null
      },
      polar: {
        name: 'Polar', short: 'Polar', rank: 6,
        rankLabel: 'Moderate to Poor — Not a Step Counter',
        color: '#8B5CF6',
        imageUrl: null,
        wearLocation: 'Wrist',
        overallPct: null,
        overallNote: 'Moderate to poor (53.2% in meta-analysis); overreports ~3.8%',
        mapeLab: 'High',
        mapeFree: 'Overreports ~3.8%',
        bias: 'Overestimates',
        algorithm: 'Proprietary peak detection on wrist accelerometer',
        keyDiff: 'Best known for heart rate monitoring (chest strap heritage), not step counting. Polar A360 found not valid for any walking condition in peer-reviewed testing. Step tracking is secondary to HR/training load.',
        bestFor: 'Heart rate monitoring and training load — NOT step counting',
        subscription: 'Polar Flow free; Polar Premium optional',
        strengths: ['Best-in-class heart rate monitoring', 'Training load (RPE) features', 'Polar Vantage M3: only +3.8% error in consumer test'],
        weaknesses: ['A360: not valid for any walking condition (Roos 2020)', 'Vantage overreports steps consistently', '53.2% accuracy in meta-analysis', 'Cannot replace research-grade accelerometers', 'Not recommended for step count reliability'],
        falseSteps: ['Non-walking wrist movements'],
        modelData: [
          { model: 'A360', mape: null, condition: 'Walking & jogging', source: 'Roos et al. (2020)', note: 'Not valid for any walking condition' },
          { model: 'Vantage', mape: 'High (not specified)', condition: 'Free-living', source: 'Henriksen et al. (2022), JMIR Formative Research', note: 'Overreports steps' },
          { model: 'Vantage M3', mape: '+3.8% (379 extra steps / 10,000)', condition: 'Walking test', source: 'TechRadar (Jan 2025)', note: 'Consumer test, not peer-reviewed' }
        ],
        studies: ['roos2020'],
        affiliateLinks: null
      },
      oura: {
        name: 'Oura Ring', short: 'Oura Ring', rank: 7,
        rankLabel: 'Poor for Steps — Excellent for Sleep/HRV',
        color: '#C4A97D',
        imageUrl: 'https://static.wixstatic.com/media/273a63_722e50e1a554453eb4c71a2e7a58925d~mv2.png',
        wearLocation: 'Finger',
        overallPct: null,
        overallNote: 'Poor real-world (~50% error aggregate); acceptable lab (<10% MAPE controlled)',
        mapeLab: '4.8% controlled',
        mapeFree: '~25–50%',
        bias: 'Overestimates (hand gestures)',
        algorithm: 'ML step classifier on finger-worn accelerometer data',
        keyDiff: 'Finger placement detects hand motion as proxy for steps. Surprisingly good in controlled walking (within 12 steps of 5,000-step test). Terrible in real-world due to hand gestures — average +2,124 ± 4,256 extra steps per day in free-living.',
        bestFor: 'Sleep, HRV, recovery tracking — NOT step counting',
        subscription: '$5.99/mo required',
        strengths: ['Within 12 steps of 5,000 in controlled walk', 'MAPE <10% in lab combined activities', 'No sharp edges — comfortable 24/7 wear', 'Best HRV and sleep accuracy among all devices'],
        weaknesses: ['+2,124 avg phantom steps/day in free-living', 'Massive variance (±4,256 steps)', 'Hand gestures, cooking, typing = fake steps', 'Finger placement fundamentally limited for steps', '$5.99/mo subscription required'],
        falseSteps: ['Hand gestures / talking with hands', 'Cooking / chopping / stirring', 'Typing (some cases)', 'Any repetitive hand motion matching walking cadence'],
        modelData: [
          { model: 'Gen 3', mape: '<10%', condition: 'Laboratory (combined activities)', source: 'Kristiansson et al. (2023)' },
          { model: 'Gen 3', mape: null, condition: 'Free-living (14 days)', source: 'Kristiansson et al. (2023)', note: 'Mean diff +2,124 ± 4,256 steps/day; r≥0.76' },
          { model: 'Gen 3', mape: null, condition: 'Controlled walk (5,000 steps)', source: 'Android Central (2023)', note: 'Within 12 steps of 5,000 — consumer test' }
        ],
        studies: ['kristiansson2023'],
        affiliateLinks: [
          { name: 'Oura Ring Gen 4', url: 'https://amzn.to/4klINic' }
        ]
      },
      whoop: {
        name: 'WHOOP', short: 'WHOOP', rank: 8,
        rankLabel: 'Unknown — No Validation Data',
        color: '#44B78B',
        imageUrl: 'https://static.wixstatic.com/media/273a63_c52aaaca1f7243f3818cf51d9374dbd4~mv2.png',
        wearLocation: 'Wrist / Bicep / Body',
        overallPct: null,
        overallNote: 'Unknown — no published validation studies',
        mapeLab: 'No published data',
        mapeFree: 'No published data',
        bias: 'Unknown (user reports suggest overcounting)',
        algorithm: 'Accelerometer cadence + gyroscope rotational data (new algorithm, Oct 2024)',
        keyDiff: 'WHOOP added step counting October 2024 via firmware update. Hardware should theoretically enable good accuracy (3-axis accel + gyro) but zero peer-reviewed validation exists. WHOOP intentionally positions Strain (cardiovascular load) as primary metric.',
        bestFor: 'Strain/recovery tracking — step counting is new and unvalidated',
        subscription: '$30/mo (12-month plan)',
        strengths: ['3-axis accelerometer + 3-axis gyroscope hardware', 'Flexible wear locations (wrist, bicep, body)', 'Excellent for recovery and HRV tracking', 'No screen distraction'],
        weaknesses: ['Step counting added Oct 2024 — no peer-reviewed studies', 'User-reported overcounting', 'WHOOP deprioritizes steps vs. Strain metric', 'Most expensive subscription on this list'],
        falseSteps: ['Driving (user-reported)', 'Desk work (user-reported)'],
        modelData: [],
        studies: [],
        affiliateLinks: [
          { name: 'WHOOP 4.0', url: 'https://amzn.to/3Zmzkh8', note: '12-month subscription included' }
        ]
      }
    };
  }

  get _studies() {
    return {
      roos2020: { authors: 'Roos et al.', year: 2020, title: 'Validation of 12 Consumer-Grade Wrist-Worn Fitness Trackers', journal: 'Int J Environ Res Public Health', doi: '10.3390/ijerph17207123', independent: true },
      feehan2020: { authors: 'Feehan et al.', year: 2020, title: 'Accuracy of Fitbit Devices: Systematic Review', journal: 'PeerJ', doi: '10.7717/peerj.9381', independent: true },
      kim2024: { authors: 'Kim et al.', year: 2024, title: 'Validity of Consumer Wearables for 24-hour Step Count vs ActivPAL', journal: 'Sensors', doi: '10.3390/s24144658', independent: true },
      kristiansson2023: { authors: 'Kristiansson et al.', year: 2023, title: 'Validity of Oura Ring Gen 3 Step Count in Free-Living', journal: 'BMC Medical Research Methodology', doi: '10.1186/s12874-023-01868-x', independent: true },
      choekang2025: { authors: 'Choe & Kang', year: 2025, title: 'Age-Related Accuracy of Apple Watch Step Counting', journal: 'Physiological Measurement', doi: '10.1088/1361-6579/adca82', independent: true },
      natureSR2024: { authors: 'Nature Scientific Reports', year: 2024, title: 'Comparative Accuracy of Consumer Wearables (Garmin, Fitbit, Apple)', journal: 'Scientific Reports', doi: '10.1038/s41598-024-74140-x', independent: true },
      straczkiewicz2023: { authors: 'Straczkiewicz et al.', year: 2023, title: 'Clinical Validation of Fitbit Charge 2 Step Count', journal: 'JMIR mHealth', doi: '10.2196/47646', independent: true },
      giurgiu2023: { authors: 'Giurgiu et al.', year: 2023, title: '24-Hour Free-Living Step Count Validity of Fitbit', journal: 'Technologies', doi: '10.3390/technologies11010029', independent: true },
      germini2022: { authors: 'Germini et al.', year: 2022, title: 'Accuracy of Fitbit Step Count: Systematic Review of 20 Studies', journal: 'JMIR mHealth', doi: '10.2196/30791', independent: true }
    };
  }

  get _accuracyFactors() {
    return [
      {
        factor: 'Walking Speed',
        impact: 'Highest — single biggest factor',
        impactLevel: 'highest',
        detail: 'Accuracy drops dramatically below 0.9 m/s. At very slow speeds, even the best devices miss the majority of steps.',
        speeds: [
          { speed: '<0.5 m/s (very slow / shuffling)', accuracy: 'Very poor (<50%)', note: 'All devices struggle; ankle placement helps most' },
          { speed: '0.5–0.9 m/s (slow walking)', accuracy: 'Poor–moderate (50–80%)', note: 'Clinical/elderly populations most affected' },
          { speed: '0.9–1.3 m/s (normal walking)', accuracy: 'Good (>90%)', note: 'All devices perform acceptably' },
          { speed: '1.3–1.8 m/s (brisk walking)', accuracy: 'Excellent (>95%)', note: 'Sweet spot for wrist-worn accuracy' },
          { speed: '>1.8 m/s (jogging / running)', accuracy: 'Excellent (>95–99%)', note: 'Highest cadence = clearest signal' }
        ]
      },
      {
        factor: 'Sensor Placement (Wear Location)',
        impact: 'Very High',
        impactLevel: 'very-high',
        detail: 'Wrist devices detect arm swing as a proxy for walking — not actual footfalls. This fundamental limitation creates systematic errors no algorithm can fully eliminate.',
        placements: [
          { placement: 'Ankle / Foot', rank: '🥇 Most accurate', error: '~2–6% MAPE', bestFor: 'Slow walkers, elderly, clinical', limit: 'Socially impractical; limited products' },
          { placement: 'Hip / Waist', rank: '🥈 Very accurate', error: '~0.4–5% MAPE', bestFor: 'Research-grade measurement', limit: 'Less convenient; users forget to wear' },
          { placement: 'Wrist', rank: '🥉 Moderate', error: '~5–25% MAPE', bestFor: 'Daily convenience, 24/7 wear', limit: 'Over/underestimates from arm motion' },
          { placement: 'Finger (Oura)', rank: '4th', error: '~10–50%+ MAPE', bestFor: 'Sleep/HRV (not steps)', limit: 'Phantom steps from hand gestures' }
        ],
        keyFinding: 'Wrist vs. hip step counts differ by 30% in young adults, nearly 50% in elderly.'
      },
      {
        factor: 'Arm Swing',
        impact: 'High (critical for wrist-worn)',
        impactLevel: 'high',
        detail: 'Wrist-worn devices measure arm swing, not footfalls. Restricted arm swing causes undercounting; exaggerated arm movement causes overcounting.',
        overTriggers: { range: '+10% to +35%', examples: ['Animated hand gestures while talking', 'Cooking, cleaning, manual work', 'Clapping, drumming, repetitive hand motions'] },
        underTriggers: { range: '−35% to −95%', examples: ['Pushing shopping cart, stroller, wheelchair', 'Walking with hands in pockets', 'Carrying bags or holding objects', 'Holding treadmill handrails'] }
      },
      {
        factor: 'Age',
        impact: 'Significant',
        impactLevel: 'significant',
        detail: 'Apple Watch MAPE: 4.3% for age <40 vs. 10.9% for age ≥40. Age affects gait pattern, walking speed, and arm swing — all compound to reduce accuracy. Elderly at slow gait speeds see the worst accuracy of any group.',
        source: 'Choe & Kang (2025); Modave et al. (2017)'
      },
      {
        factor: 'Activity Type',
        impact: 'Significant',
        impactLevel: 'significant',
        detail: 'Lab/controlled settings consistently show better accuracy than free-living. All devices: ~5% MAPE in lab vs. >10% in real-world. Phantom steps from stationary activities are a major real-world problem.',
        conditions: [
          { condition: 'Normal walking (3–5 km/h)', bias: 'Near-accurate', magnitude: '<5% error' },
          { condition: 'Free-living (mixed activities)', bias: 'Overestimates', magnitude: '+10–35%' },
          { condition: 'Stationary (desk, driving)', bias: 'Phantom steps', magnitude: '500–3,500+ per day' },
          { condition: 'Arms stationary while walking', bias: 'Underestimates', magnitude: '−35% to −95%' },
          { condition: 'Stair climbing', bias: 'Underestimates', magnitude: 'Significant' },
          { condition: 'Stepping-in-place', bias: 'Underestimates', magnitude: '20–60%' }
        ]
      },
      {
        factor: 'Gait Pathology / Neurological Conditions',
        impact: 'Severe',
        impactLevel: 'severe',
        detail: 'Algorithms trained on healthy gait detect only 11–47% of steps in individuals with neurological conditions (stroke, Parkinson\'s, etc.). Consumer devices are NOT validated for clinical populations — population-specific algorithms are essential for research use.',
        source: 'Sensors (2025); Lamont et al. (2018)'
      },
      {
        factor: 'Device Fit / Band Tightness',
        impact: 'Moderate',
        impactLevel: 'moderate',
        detail: 'Loose band = more signal noise = more false positives. A snug (not tight) fit reduces noise and improves accuracy. This is one of the few user-controllable accuracy factors.'
      },
      {
        factor: 'BMI / Body Composition',
        impact: 'Moderate (indirect)',
        impactLevel: 'moderate',
        detail: 'BMI itself does not directly impact step count accuracy. However, obesity alters gait patterns (slower speed, shorter steps, wider stance, reduced arm swing) which indirectly reduces accuracy through the walking speed and arm swing factors.',
        source: 'Modave et al. (2017), JMIR; Scataglini et al. (2025)'
      },
      {
        factor: 'Surface Type',
        impact: 'Minimal',
        impactLevel: 'moderate',
        detail: 'Garmin validated across natural lawn, gravel, asphalt, linoleum, and ceramic tile with acceptable MAPE on all surfaces. Surface type alone has minimal independent effect on step count accuracy — walking speed changes on surfaces are the more relevant factor.',
        source: 'Garmin validity review (2020), DOI: 10.3390/ijerph17134269'
      },
      {
        factor: 'Incline / Terrain',
        impact: 'Moderate',
        impactLevel: 'moderate',
        detail: 'Garmin has been shown to overcount during incline walking. Changes in stride mechanics on hills — shorter strides, altered arm swing, and different cadence patterns — affect step detection algorithms calibrated for level-ground walking.'
      },
      {
        factor: 'Treadmill vs. Overground Walking',
        impact: 'Moderate',
        impactLevel: 'moderate',
        detail: 'Treadmill walking produces different arm-swing patterns than overground walking. Users often hold the handrails (severely reducing arm swing) or alter their gait to match belt speed. This leads to systematically different accuracy profiles — Apple Watch shows 10.1% MAPE on treadmill vs. <10% overground.'
      }
    ];
  }

  get _pipeline() {
    return {
      steps: [
        { n: 1, name: 'Raw Signal Acquisition', detail: '3-axis MEMS accelerometer captures acceleration in x, y, z at 25–100 Hz sampling rate.' },
        { n: 2, name: 'Signal Preprocessing', detail: 'Compute vector magnitude √(x² + y² + z²) to combine all axes into a single value.' },
        { n: 3, name: 'Noise Filtering', detail: 'Low-pass filter (cutoff ~3–10 Hz) removes high-frequency noise; band-pass filter (0.5–3 Hz) isolates walking cadence range.' },
        { n: 4, name: 'Step Detection', detail: 'Peak detection, zero-crossing, or autocorrelation identifies periodic patterns matching walking cadence.' },
        { n: 5, name: 'Validation Gate', detail: 'Time-window constraints (0.2s–2.0s between steps) filter false positives; minimum-bout thresholds (e.g., 10+ consecutive steps) reduce phantom counts.' },
        { n: 6, name: 'Post-Processing', detail: 'Machine learning classifiers distinguish walking from non-walking activities and apply activity-specific corrections.' }
      ],
      algorithms: [
        { name: 'Peak Detection', accuracy: '>97% controlled walking', usedBy: 'Garmin, Fitbit, Polar, COROS', note: 'Most common, computationally lightweight' },
        { name: 'ML-Enhanced Detection', accuracy: '12.5% MAPE free-living, 1.3% underestimation', usedBy: 'Apple Watch (Core Motion), Oura Ring', note: 'Classifies walking vs. non-walking first, then applies peak detection' },
        { name: 'Deep Learning (End-to-End)', accuracy: '96–99% with gyroscope, ~60% accel-only', usedBy: 'Research / emerging', note: 'Neural networks trained directly on accelerometer data' },
        { name: 'Zero-Crossing Detection', accuracy: 'Lower than peak detection', usedBy: 'Earlier / simpler pedometers', note: 'Counts signal baseline crossings; less robust to noise' },
        { name: 'Autocorrelation Analysis', accuracy: 'Good cadence detection', usedBy: 'Research / hybrid approaches', note: 'Identifies periodic patterns; more computationally intensive' }
      ],
      fundamentalLimit: 'Wrist-worn devices detect arm swing as a proxy for walking — not actual footfalls. This creates systematic errors no algorithm can fully eliminate.',
      goldStandard: 'Manual hand-tally counting (controlled) or research-grade hip-worn accelerometers (ActiGraph, ActivPAL) for free-living studies.'
    };
  }

  get _caveats() {
    return [
      { title: 'Lab ≠ Real World', body: 'All devices score ~5% MAPE in controlled lab testing. In free-living conditions, the same devices jump to >10% error. The controlled walking test showing your device is "98% accurate" tells you almost nothing about daily step count reliability. Individual variation compounds this further — your personal accuracy depends on your gait, arm swing, walking speed, age, and body composition.' },
      { title: 'Walking speed is the #1 confounder', body: 'Below 0.9 m/s, accuracy collapses on all devices. Elderly adults, post-surgical patients, and anyone using a walker or cane will see dramatically worse accuracy than published numbers suggest. This is the single most important caveat in this entire tool.' },
      { title: 'Wrist devices measure arm swing, not footfalls', body: 'Every wrist-worn device is fundamentally counting arm movement as a proxy for walking. Push a stroller and it massively underestimates. Wave your hands while talking and it overcounts. No algorithm can fully eliminate this physical constraint — it is baked into the sensor placement.' },
      { title: 'Oura Ring is NOT a step counter', body: 'Despite showing acceptable lab accuracy (<10% MAPE in controlled walks), the Oura Ring averages +2,124 extra phantom steps per day in free-living due to hand gestures. Its finger placement makes it fundamentally unsuited for daily step count reliability. Use it for sleep and HRV — not steps.' },
      { title: 'WHOOP has zero validation data for steps', body: 'Step counting was added to WHOOP via a firmware update in October 2024. The hardware is theoretically capable, but no peer-reviewed validation studies exist. WHOOP intentionally positions Strain (cardiovascular load) as its primary metric — not steps.' },
      { title: 'Model generations matter — a lot', body: 'Studies on the Garmin Vivofit or Fitbit Charge HR may not reflect your current device\'s accuracy. Firmware updates and new sensor generations can dramatically change step counting behavior. Always check which model generation was studied before applying data to your device.' },
      { title: 'The validation gap is massive', body: 'Only ~11% of consumer wearables have been independently validated for any biometric. An estimated 249 studies represent just 3.5% of what would be needed for comprehensive validation. Most devices on the market have no published accuracy data at all.' },
      { title: 'No device is accurate below 0.9 m/s', body: 'This threshold applies universally. Below 0.9 m/s — a slow shuffle — every consumer wearable produces unreliable step counts regardless of brand or price point. Clinical populations, elderly adults, and rehabilitation patients routinely walk at these speeds. Published accuracy figures almost never reflect this population.' }
    ];
  }

  // ── Render ────────────────────────────────────────────────────────────

  render() {
    const devices = this._devices;
    const deviceList = Object.entries(devices);
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="header">
        <div class="header-inner">
          <a href="https://kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="logo-img" />
            Step Count Accuracy
          </a>
          <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" class="header-cta" target="_blank" rel="noopener">
            Get Kygo App <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </header>

      <section class="hero">
        <div class="container">
          <div class="hero-badge animate-on-scroll">PEER-REVIEWED RESEARCH</div>
          <h1 class="animate-on-scroll">How Accurate Is Your Wearable's Step Count?</h1>
          <p class="hero-sub animate-on-scroll">We analyzed 20+ peer-reviewed studies to reveal which devices count steps most accurately — and what factors affect your count.</p>
        </div>
      </section>

      <section class="rankings">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Step Count Accuracy Rankings</h2>
          <p class="section-sub animate-on-scroll">Ranked by overall accuracy. MAPE = Mean Absolute Percentage Error — lower is better.</p>
          <div class="table-wrap animate-on-scroll">
            <table class="rankings-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Device</th>
                  <th>MAPE (Lab)</th>
                  <th>MAPE (Free-Living)</th>
                  <th>Bias</th>
                  <th>Overall</th>
                </tr>
              </thead>
              <tbody>
                ${deviceList.map(([k, d]) => `
                  <tr class="rank-row" data-device="${k}" style="--accent:${d.color}">
                    <td class="rank-num" style="color:${d.color}">${d.rank}</td>
                    <td class="rank-name">
                      <div class="rank-name-inner">
                        ${d.imageUrl
                          ? `<img src="${d.imageUrl}" alt="${d.name}" class="rank-img" />`
                          : `<span class="rank-fallback" style="background:${d.color}">${d.short[0]}</span>`
                        }
                        <span>${d.name}</span>
                      </div>
                    </td>
                    <td class="rank-mape">${d.mapeLab}</td>
                    <td class="rank-free">${d.mapeFree}</td>
                    <td>
                      <span class="bias-tag bias-${d.bias.toLowerCase().includes('under') ? 'under' : d.bias.toLowerCase().includes('over') ? 'over' : d.bias.toLowerCase().includes('mixed') ? 'mixed' : 'unknown'}">${d.bias}</span>
                    </td>
                    <td class="rank-overall">
                      ${d.overallPct
                        ? `<div class="overall-bar-wrap"><div class="overall-bar" style="width:${d.overallPct}%;background:${d.color}"></div><span>${d.overallPct}%</span></div>`
                        : `<span class="overall-na">${d.overallNote || 'See details'}</span>`
                      }
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <p class="table-note animate-on-scroll">MAPE = Mean Absolute Percentage Error. Lower = more accurate. Free-living data reflects real-world daily wear conditions.</p>
        </div>
      </section>

      <section class="deep-dives">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Device Deep Dives</h2>
          <p class="section-sub animate-on-scroll">Tap any device to see strengths, weaknesses, algorithm details, and research sources.</p>
          <div class="dd-grid">
            ${deviceList.map(([k, d], i) => `
              <div class="dd-card animate-on-scroll ${this._expandedDevice === k ? 'expanded' : ''}" data-device="${k}" style="--accent:${d.color};--delay:${i * 80}ms">
                <div class="dd-header">
                  ${d.imageUrl
                    ? `<img src="${d.imageUrl}" alt="${d.name}" class="dd-img" />`
                    : `<span class="dd-fallback" style="background:${d.color}">${d.short[0]}</span>`
                  }
                  <div class="dd-info">
                    <div class="dd-rank-label" style="color:${d.color}">${d.rankLabel}</div>
                    <h3>${d.affiliateLinks && d.affiliateLinks.length ? `<a href="${d.affiliateLinks[0].url}" class="dd-name-link" target="_blank" rel="noopener sponsored">${d.name}</a>` : d.name}</h3>
                    <span class="dd-bestfor">${d.bestFor}</span>
                  </div>
                  <div class="dd-toggle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
                <div class="dd-body">
                  <div class="dd-cols">
                    <div class="dd-col">
                      <h4>Strengths</h4>
                      <ul>${d.strengths.map(s => `<li><span class="dd-check">✓</span> ${s}</li>`).join('')}</ul>
                    </div>
                    <div class="dd-col">
                      <h4>Weaknesses</h4>
                      <ul>${d.weaknesses.map(w => `<li><span class="dd-x">✗</span> ${w}</li>`).join('')}</ul>
                    </div>
                  </div>
                  ${d.falseSteps.length ? `
                  <div class="dd-false-steps">
                    <h4>Phantom Step Triggers</h4>
                    <div class="dd-tags">${d.falseSteps.map(f => `<span class="dd-tag">${f}</span>`).join('')}</div>
                  </div>` : ''}
                  ${this._renderStudiesForDevice(k)}
                  ${d.affiliateLinks ? `
                  <div class="dd-buy">
                    <h4>Available on Amazon</h4>
                    <div class="dd-buy-links">
                      ${d.affiliateLinks.map(l => `
                        <a href="${l.url}" class="dd-buy-link" target="_blank" rel="noopener sponsored">
                          <span class="dd-buy-name">${l.name}</span>
                          ${l.note ? `<span class="dd-buy-note">${l.note}</span>` : ''}
                          <span class="dd-buy-cta">View on Amazon <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
                        </a>
                      `).join('')}
                    </div>
                  </div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="factors">
        <div class="container">
          <h2 class="section-title animate-on-scroll">What Affects Step Count Accuracy?</h2>
          <p class="section-sub animate-on-scroll">These factors apply to all devices — understanding them helps you interpret your step count data correctly.</p>
          <div class="factors-list animate-on-scroll">
            ${this._accuracyFactors.map((f, i) => `
              <div class="factor-item ${this._expandedFactors.has(i) ? 'open' : ''}" data-factor="${i}">
                <div class="factor-header">
                  <div class="factor-left">
                    <span class="impact-pill impact-${f.impactLevel}">${f.impact}</span>
                    <span class="factor-name">${f.factor}</span>
                  </div>
                  <span class="factor-toggle"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></span>
                </div>
                <div class="factor-body">
                  <p>${f.detail}</p>
                  ${f.source ? `<p class="factor-source">Source: ${f.source}</p>` : ''}
                  ${f.speeds ? `
                    <table class="factor-table">
                      <thead><tr><th>Speed</th><th>Accuracy</th><th>Note</th></tr></thead>
                      <tbody>${f.speeds.map(s => `<tr><td>${s.speed}</td><td>${s.accuracy}</td><td>${s.note}</td></tr>`).join('')}</tbody>
                    </table>` : ''}
                  ${f.placements ? `
                    <table class="factor-table">
                      <thead><tr><th>Placement</th><th>Rank</th><th>Typical Error</th><th>Best For</th><th>Limitation</th></tr></thead>
                      <tbody>${f.placements.map(p => `<tr><td>${p.placement}</td><td>${p.rank}</td><td>${p.error}</td><td>${p.bestFor}</td><td>${p.limit}</td></tr>`).join('')}</tbody>
                    </table>
                    <p class="factor-source">Key finding: ${f.keyFinding}</p>` : ''}
                  ${f.overTriggers ? `
                    <div class="factor-triggers">
                      <div class="trigger-group">
                        <h5 class="trigger-label over">Overcounting Triggers (${f.overTriggers.range})</h5>
                        <ul>${f.overTriggers.examples.map(e => `<li>${e}</li>`).join('')}</ul>
                      </div>
                      <div class="trigger-group">
                        <h5 class="trigger-label under">Undercounting Triggers (${f.underTriggers.range})</h5>
                        <ul>${f.underTriggers.examples.map(e => `<li>${e}</li>`).join('')}</ul>
                      </div>
                    </div>` : ''}
                  ${f.conditions ? `
                    <table class="factor-table">
                      <thead><tr><th>Condition</th><th>Bias Direction</th><th>Magnitude</th></tr></thead>
                      <tbody>${f.conditions.map(c => `<tr><td>${c.condition}</td><td>${c.bias}</td><td>${c.magnitude}</td></tr>`).join('')}</tbody>
                    </table>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="pipeline">
        <div class="container">
          <h2 class="section-title animate-on-scroll">How Step Counting Actually Works</h2>
          <p class="section-sub animate-on-scroll">Every consumer wearable uses variations of the same 6-step signal processing pipeline.</p>
          <div class="pipeline-steps animate-on-scroll">
            ${this._pipeline.steps.map(s => `
              <div class="pipeline-step">
                <div class="pipeline-num">${s.n}</div>
                <div class="pipeline-content">
                  <h4>${s.name}</h4>
                  <p>${s.detail}</p>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="pipeline-limit animate-on-scroll">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            <p><strong>Fundamental Limitation:</strong> ${this._pipeline.fundamentalLimit}</p>
          </div>
          <h3 class="pipeline-algo-title animate-on-scroll">Algorithm Types</h3>
          <div class="table-wrap animate-on-scroll">
            <table class="rankings-table">
              <thead>
                <tr><th>Algorithm</th><th>Accuracy</th><th>Used By</th><th>Note</th></tr>
              </thead>
              <tbody>
                ${this._pipeline.algorithms.map(a => `
                  <tr class="rank-row">
                    <td style="font-weight:600">${a.name}</td>
                    <td>${a.accuracy}</td>
                    <td>${a.usedBy}</td>
                    <td style="color:var(--gray-400);font-size:12px">${a.note}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <p class="table-note animate-on-scroll">Gold standard: ${this._pipeline.goldStandard}</p>
        </div>
      </section>

      <section class="caveats">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Important Caveats</h2>
          <p class="section-sub animate-on-scroll">Context for interpreting step count accuracy data.</p>
          <div class="caveat-grid animate-on-scroll" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:8px">
            ${this._caveats.map((c, i) => `
              <div class="caveat-card ${this._expandedCaveats.has(i) ? 'open' : ''}" data-caveat="${i}">
                <div class="caveat-header">
                  <span class="caveat-num">${i + 1}</span>
                  <span class="caveat-title">${c.title}</span>
                  <span class="caveat-toggle"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></span>
                </div>
                <div class="caveat-body"><p>${c.body}</p></div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="cta-section">
        <div class="container">
          <div class="cta-box animate-on-scroll">
            <div class="cta-box-content">
              <div class="cta-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
              <h2>Your steps tell a story. Kygo reads it.</h2>
              <p>Connect your wearable step data with nutrition to reveal which foods fuel your activity, sleep, and recovery best.</p>
              <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" class="cta-btn" target="_blank" rel="noopener">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Download Free on iOS
              </a>
              <div class="cta-features">
                <span class="cta-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Free forever plan</span>
                <span class="cta-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Syncs with 4+ wearables</span>
                <span class="cta-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> AI food logging</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer class="tool-footer">
        <div class="container">
          <a href="https://kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" />
            Kygo Health
          </a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <div class="footer-links">
            <a href="https://kygo.app" target="_blank" rel="noopener">Kygo App</a>
            <a href="https://kygo.app/privacy" target="_blank" rel="noopener">Privacy</a>
            <a href="https://kygo.app/terms" target="_blank" rel="noopener">Terms</a>
          </div>
          <p class="footer-copy">Data last updated February 2026. All accuracy claims sourced from peer-reviewed research with full bias disclosure.</p>
          <p class="footer-copy footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases.</p>
          <p class="footer-copy">© ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  _renderModelData(deviceKey) {
    const device = this._devices[deviceKey];
    if (!device || !device.modelData || !device.modelData.length) return '';
    return `
      <div class="dd-model-data">
        <h4>Model-Specific Research Data</h4>
        <table class="model-table">
          <thead><tr><th>Model</th><th>MAPE / Accuracy</th><th>Condition</th><th>Source</th></tr></thead>
          <tbody>
            ${device.modelData.map(m => `
              <tr>
                <td style="font-weight:600;white-space:nowrap">${m.model}</td>
                <td>${m.mape || '—'}</td>
                <td>${m.condition}</td>
                <td>${m.source}${m.note ? `<br><span class="model-note">${m.note}</span>` : ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  _renderStudiesForDevice(deviceKey) {
    const device = this._devices[deviceKey];
    if (!device || !device.studies || !device.studies.length) return '';
    const studies = this._studies;
    const relevant = device.studies.filter(id => studies[id]).map(id => studies[id]);
    if (!relevant.length) return '';
    return `
      <div class="dd-studies">
        <h4>Research Sources</h4>
        ${relevant.map(s => `
          <div class="dd-study-row ${s.independent ? '' : 'dd-study-funded'}">
            <span class="dd-study-badge ${s.independent ? 'independent' : 'funded'}">${s.independent ? 'Independent' : 'Funded'}</span>
            <span class="dd-study-cite">${s.authors} (${s.year}). ${s.title}. <em>${s.journal}</em>${s.doi ? `. DOI: ${s.doi}` : ''}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ── Styles ────────────────────────────────────────────────────────────

  _styles() {
    return `
      :host {
        --dark: #1E293B;
        --dark-card: #0f172a;
        --light: #F8FAFC;
        --green: #22C55E;
        --green-dark: #16A34A;
        --green-light: rgba(34,197,94,0.1);
        --yellow: #FBBF24;
        --red: #EF4444;
        --gray-100: #F1F5F9;
        --gray-200: #E2E8F0;
        --gray-300: #CBD5E1;
        --gray-400: #94A3B8;
        --gray-600: #475569;
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
      h1, h2, h3, h4 { font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 600; line-height: 1.2; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

      /* Header */
      .header { background: #fff; border-bottom: 1px solid var(--gray-200); padding: 12px 16px; position: sticky; top: 0; z-index: 50; }
      .header-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
      .logo { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; color: var(--dark); text-decoration: none; }
      .logo-img { height: 28px; width: auto; }
      .header-cta { color: var(--green); text-decoration: none; font-size: 13px; display: flex; align-items: center; gap: 4px; font-weight: 500; transition: color 0.2s; }
      .header-cta:hover { color: var(--green-dark); }

      /* Animations */
      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: var(--delay, 0ms); }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      /* Hero */
      .hero { padding: 56px 0 48px; text-align: center; background: #fff; }
      .hero-badge { display: inline-block; padding: 8px 16px; border-radius: 50px; background: var(--green-light); color: var(--green-dark); font-size: 12px; font-weight: 700; letter-spacing: 1px; margin-bottom: 16px; }
      .hero h1 { font-size: clamp(28px, 6vw, 42px); margin-bottom: 16px; }
      .hero-sub { font-size: clamp(15px, 3.5vw, 18px); color: var(--gray-600); max-width: 640px; margin: 0 auto; line-height: 1.7; }

      /* Rankings */
      .rankings { padding: 56px 0; background: var(--light); }
      .section-title { font-size: clamp(24px, 5vw, 36px); text-align: center; margin-bottom: 8px; }
      .section-sub { font-size: clamp(14px, 3.5vw, 16px); color: var(--gray-600); text-align: center; margin-bottom: 32px; max-width: 560px; margin-left: auto; margin-right: auto; }
      .table-wrap { overflow-x: auto; border-radius: var(--radius); box-shadow: 0 4px 24px rgba(0,0,0,0.07); background: #fff; }
      .rankings-table { width: 100%; border-collapse: collapse; min-width: 640px; }
      .rankings-table thead th { background: var(--dark); color: #fff; padding: 14px 16px; text-align: left; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
      .rankings-table thead th:first-child { border-radius: var(--radius-sm) 0 0 0; }
      .rankings-table thead th:last-child { border-radius: 0 var(--radius-sm) 0 0; }
      .rank-row { border-bottom: 1px solid var(--gray-100); transition: background 0.15s; }
      .rank-row:hover { background: var(--gray-100); }
      .rank-row td { padding: 14px 16px; font-size: 14px; vertical-align: middle; }
      .rank-num { font-size: 18px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; }
      .rank-name-inner { display: flex; align-items: center; gap: 10px; font-weight: 600; }
      .rank-img { width: 32px; height: 32px; object-fit: contain; border-radius: 8px; flex-shrink: 0; }
      .rank-fallback { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 14px; flex-shrink: 0; }
      .rank-mape { font-weight: 600; color: var(--green-dark); }
      .bias-tag { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 600; white-space: nowrap; }
      .bias-under { background: rgba(34,197,94,0.12); color: #16A34A; }
      .bias-over { background: rgba(239,68,68,0.12); color: #DC2626; }
      .bias-mixed { background: rgba(251,191,36,0.15); color: #B45309; }
      .bias-unknown { background: var(--gray-100); color: var(--gray-600); }
      .overall-bar-wrap { display: flex; align-items: center; gap: 8px; }
      .overall-bar { height: 8px; border-radius: 4px; min-width: 4px; transition: width 0.8s ease; }
      .overall-bar-wrap span { font-size: 13px; font-weight: 600; white-space: nowrap; }
      .overall-na { font-size: 12px; color: var(--gray-400); }
      .table-note { font-size: 13px; color: var(--gray-400); text-align: center; margin-top: 12px; }

      /* Deep Dives */
      .deep-dives { padding: 56px 0; background: #fff; }
      .dd-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
      .dd-card { border-radius: var(--radius); border: 2px solid var(--gray-200); background: #fff; overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s; cursor: pointer; }
      .dd-card:hover { border-color: var(--accent); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
      .dd-card.expanded { border-color: var(--accent); box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
      .dd-header { display: flex; align-items: center; gap: 12px; padding: 16px; }
      .dd-img { width: 40px; height: 40px; object-fit: contain; border-radius: 10px; flex-shrink: 0; }
      .dd-fallback { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 18px; flex-shrink: 0; }
      .dd-info { flex: 1; min-width: 0; }
      .dd-rank-label { font-size: 11px; font-weight: 700; letter-spacing: 0.3px; margin-bottom: 2px; }
      .dd-info h3 { font-size: 16px; margin-bottom: 2px; }
      .dd-bestfor { font-size: 12px; color: var(--gray-600); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .dd-name-link { color: inherit; text-decoration: underline; text-decoration-color: var(--gray-300); text-underline-offset: 2px; }
      .dd-name-link:hover { text-decoration-color: var(--accent); }
      .dd-toggle { color: var(--gray-400); transition: transform 0.3s; flex-shrink: 0; }
      .dd-card.expanded .dd-toggle { transform: rotate(180deg); }
      .dd-body { display: none; padding: 0 16px 16px; border-top: 1px solid var(--gray-100); padding-top: 16px; }
      .dd-card.expanded .dd-body { display: block; }
      .dd-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
      .dd-col h4 { font-size: 13px; margin-bottom: 8px; color: var(--dark); }
      .dd-col ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
      .dd-col li { display: flex; gap: 6px; align-items: flex-start; font-size: 12px; color: var(--gray-600); }
      .dd-check { color: var(--green); font-size: 14px; flex-shrink: 0; }
      .dd-x { color: var(--red); font-size: 14px; flex-shrink: 0; }
      .dd-false-steps { margin-bottom: 12px; }
      .dd-false-steps h4 { font-size: 12px; color: var(--gray-600); margin-bottom: 8px; }
      .dd-tags { display: flex; flex-wrap: wrap; gap: 6px; }
      .dd-tag { padding: 3px 10px; background: rgba(239,68,68,0.08); color: #DC2626; border-radius: 50px; font-size: 11px; font-weight: 500; }
      .dd-studies { margin-bottom: 12px; }
      .dd-studies h4 { font-size: 12px; color: var(--gray-600); margin-bottom: 8px; }
      .dd-study-row { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 6px; font-size: 12px; }
      .dd-study-badge { padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; white-space: nowrap; flex-shrink: 0; }
      .dd-study-badge.independent { background: var(--green-light); color: var(--green-dark); }
      .dd-study-badge.funded { background: rgba(251,191,36,0.15); color: #B45309; }
      .dd-study-cite { color: var(--gray-600); line-height: 1.5; }
      .dd-buy { margin-top: 8px; }
      .dd-buy h4 { font-size: 12px; color: var(--gray-600); margin-bottom: 8px; }
      .dd-buy-links { display: flex; flex-direction: column; gap: 6px; }
      .dd-buy-link { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--gray-100); border-radius: var(--radius-sm); text-decoration: none; color: var(--dark); transition: background 0.2s; gap: 8px; }
      .dd-buy-link:hover { background: var(--gray-200); }
      .dd-buy-name { font-size: 13px; font-weight: 600; flex: 1; }
      .dd-buy-note { font-size: 11px; color: var(--gray-400); }
      .dd-buy-cta { font-size: 12px; color: var(--green-dark); font-weight: 600; display: flex; align-items: center; gap: 4px; white-space: nowrap; }

      /* Factors */
      .factors { padding: 56px 0; background: var(--light); }
      .factors-list { display: flex; flex-direction: column; gap: 8px; }
      .factor-item { border-radius: var(--radius-sm); border: 1px solid var(--gray-200); background: #fff; overflow: hidden; }
      .factor-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; cursor: pointer; gap: 12px; transition: background 0.15s; }
      .factor-header:hover { background: var(--gray-100); }
      .factor-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
      .impact-pill { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 700; white-space: nowrap; flex-shrink: 0; }
      .impact-highest { background: rgba(239,68,68,0.12); color: #DC2626; }
      .impact-very-high { background: rgba(251,146,60,0.12); color: #C2410C; }
      .impact-high { background: rgba(251,191,36,0.15); color: #B45309; }
      .impact-significant { background: rgba(99,102,241,0.1); color: #4338CA; }
      .impact-severe { background: rgba(239,68,68,0.18); color: #991B1B; }
      .impact-moderate { background: rgba(34,197,94,0.1); color: var(--green-dark); }
      .factor-name { font-size: 15px; font-weight: 600; }
      .factor-toggle { color: var(--gray-400); transition: transform 0.3s; flex-shrink: 0; }
      .factor-item.open .factor-toggle { transform: rotate(180deg); }
      .factor-body { display: none; padding: 0 20px 16px; }
      .factor-item.open .factor-body { display: block; }
      .factor-body p { font-size: 14px; color: var(--gray-600); line-height: 1.7; margin-bottom: 12px; }
      .factor-source { font-size: 12px; color: var(--gray-400); font-style: italic; }
      .factor-table { width: 100%; border-collapse: collapse; font-size: 13px; border-radius: var(--radius-sm); overflow: hidden; margin-top: 8px; }
      .factor-table thead th { background: var(--gray-100); padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 600; color: var(--gray-600); text-transform: uppercase; letter-spacing: 0.3px; }
      .factor-table td { padding: 8px 12px; border-bottom: 1px solid var(--gray-100); color: var(--gray-600); }
      .factor-table tr:last-child td { border-bottom: none; }
      .factor-triggers { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; }
      .trigger-group { border-radius: var(--radius-sm); padding: 12px; }
      .trigger-label { font-size: 12px; font-weight: 700; margin-bottom: 8px; display: block; }
      .trigger-label.over { color: #DC2626; background: rgba(239,68,68,0.06); padding: 4px 8px; border-radius: 4px; }
      .trigger-label.under { color: #B45309; background: rgba(251,191,36,0.1); padding: 4px 8px; border-radius: 4px; }
      .trigger-group ul { list-style: none; display: flex; flex-direction: column; gap: 4px; }
      .trigger-group li { font-size: 12px; color: var(--gray-600); padding-left: 12px; position: relative; }
      .trigger-group li::before { content: '•'; position: absolute; left: 0; }

      /* Pipeline */
      .pipeline { padding: 56px 0; background: #fff; }
      .pipeline-steps { display: flex; flex-direction: column; gap: 0; margin-bottom: 24px; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--gray-200); }
      .pipeline-step { display: flex; gap: 16px; align-items: flex-start; padding: 20px 24px; border-bottom: 1px solid var(--gray-100); background: #fff; transition: background 0.15s; }
      .pipeline-step:last-child { border-bottom: none; }
      .pipeline-step:hover { background: var(--gray-100); }
      .pipeline-num { width: 32px; height: 32px; border-radius: 50%; background: var(--green); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; }
      .pipeline-content h4 { font-size: 15px; margin-bottom: 4px; }
      .pipeline-content p { font-size: 13px; color: var(--gray-600); line-height: 1.6; margin: 0; }
      .pipeline-limit { display: flex; gap: 12px; align-items: flex-start; background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); border-radius: var(--radius-sm); padding: 16px 20px; margin-bottom: 32px; color: #DC2626; }
      .pipeline-limit svg { flex-shrink: 0; margin-top: 2px; }
      .pipeline-limit p { font-size: 14px; color: var(--gray-600); margin: 0; line-height: 1.6; }
      .pipeline-limit p strong { color: #DC2626; }
      .pipeline-algo-title { font-size: 20px; margin-bottom: 16px; }

      /* Caveats */
      .caveats { padding: 56px 0; background: #fff; }
      .caveat-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
      .caveat-card { border-radius: var(--radius-sm); border: 1px solid var(--gray-200); background: #fff; overflow: hidden; }
      .caveat-header { display: flex; align-items: center; gap: 12px; padding: 14px 20px; cursor: pointer; transition: background 0.15s; }
      .caveat-header:hover { background: var(--gray-100); }
      .caveat-num { width: 24px; height: 24px; border-radius: 50%; background: var(--green-light); color: var(--green-dark); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
      .caveat-title { flex: 1; font-size: 15px; font-weight: 600; }
      .caveat-toggle { color: var(--gray-400); transition: transform 0.3s; }
      .caveat-card.open .caveat-toggle { transform: rotate(180deg); }
      .caveat-body { display: none; padding: 0 20px 16px 56px; }
      .caveat-card.open .caveat-body { display: block; }
      .caveat-body p { font-size: 14px; color: var(--gray-600); line-height: 1.7; }

      /* CTA */
      .cta-section { padding: 56px 0; background: var(--light); }
      .cta-box { background: var(--dark); border-radius: var(--radius); padding: 48px 40px; text-align: center; }
      .cta-box-content { max-width: 520px; margin: 0 auto; }
      .cta-icon { color: var(--green); margin-bottom: 16px; }
      .cta-box h2 { color: #fff; font-size: clamp(22px, 4vw, 30px); margin-bottom: 12px; }
      .cta-box p { color: var(--gray-300); font-size: 16px; margin-bottom: 28px; line-height: 1.7; }
      .cta-btn { display: inline-flex; align-items: center; gap: 10px; background: #fff; color: var(--dark); padding: 14px 28px; border-radius: 50px; font-weight: 700; font-size: 15px; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
      .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
      .cta-features { display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 20px; flex-wrap: wrap; }
      .cta-feature { display: flex; align-items: center; gap: 6px; color: var(--gray-300); font-size: 13px; }
      .cta-feature svg { color: var(--green); flex-shrink: 0; }

      /* Footer */
      .tool-footer { background: var(--dark); padding: 40px 0; text-align: center; }
      .footer-brand { display: inline-flex; align-items: center; gap: 8px; color: #fff; text-decoration: none; font-weight: 600; margin-bottom: 8px; }
      .footer-logo { height: 28px; width: auto; }
      .footer-tagline { color: var(--gray-400); font-size: 13px; margin-bottom: 16px; }
      .footer-links { display: flex; justify-content: center; gap: 20px; margin-bottom: 16px; }
      .footer-links a { color: var(--gray-400); text-decoration: none; font-size: 13px; transition: color 0.2s; }
      .footer-links a:hover { color: #fff; }
      .footer-copy { color: var(--gray-600); font-size: 12px; margin-bottom: 4px; }
      .footer-affiliate { color: var(--gray-600); }

      /* Responsive */
      @media (max-width: 640px) {
        .dd-grid { grid-template-columns: 1fr; }
        .dd-cols { grid-template-columns: 1fr; }
        .factor-triggers { grid-template-columns: 1fr; }
        .cta-box { padding: 32px 20px; }
        .cta-features { gap: 12px; }
      }
    `;
  }

  // ── Events ────────────────────────────────────────────────────────────

  _setupEventDelegation() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const shadow = this.shadowRoot;

    shadow.addEventListener('click', (e) => {
      // Device card expand/collapse (ignore affiliate link clicks)
      if (e.target.closest('.dd-name-link') || e.target.closest('.dd-buy-link')) return;
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

      // Accuracy factors accordion
      const factorHeader = e.target.closest('.factor-header');
      if (factorHeader) {
        const item = factorHeader.closest('.factor-item');
        const idx = parseInt(item.dataset.factor, 10);
        if (this._expandedFactors.has(idx)) {
          this._expandedFactors.delete(idx);
          item.classList.remove('open');
        } else {
          this._expandedFactors.add(idx);
          item.classList.add('open');
        }
        return;
      }

      // Caveats accordion
      const caveatHeader = e.target.closest('.caveat-header');
      if (caveatHeader) {
        const item = caveatHeader.closest('.caveat-card');
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
      }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
      els.forEach(el => this._observer.observe(el));
    });
  }

  // ── Structured Data (JSON-LD) ─────────────────────────────────────────

  _injectStructuredData() {
    if (document.querySelector('script[data-kygo-step-ld]')) return;

    const webApp = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Step Count Accuracy by Wearable Device — Kygo Health',
      'description': 'Compare step count accuracy across 8 wearable devices including Garmin, Apple Watch, Fitbit, Samsung Galaxy Watch, COROS, Polar, Oura Ring, and WHOOP. Data sourced from 20+ peer-reviewed studies with full bias disclosure.',
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'url': 'https://www.kygohealth.com/step-count-accuracy',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygohealth.com' },
      'keywords': 'step count accuracy, wearable step counter accuracy, Garmin step count accuracy, Apple Watch step count accuracy, Fitbit step count accuracy, Samsung Galaxy Watch steps, Oura Ring step count, WHOOP step count, COROS accuracy, step counter comparison, pedometer accuracy'
    };

    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Which wearable has the most accurate step counter?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Garmin ranks #1 for step count accuracy with 82.6% overall accuracy and MAPE of 0.6–3.5% in lab conditions. Apple Watch ranks #2 with 81.1% overall accuracy and r=0.99 correlation against ActivPAL in 24-hour free-living testing. Both significantly outperform other devices.' }
        },
        {
          '@type': 'Question',
          'name': 'How accurate is the Apple Watch step counter?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Apple Watch has 81.1% overall step count accuracy, with MAPE of 0.9–3.4% in lab conditions and 6.4–10% in free-living conditions. It achieved r=0.99 correlation against ActivPAL in a 24-hour free-living study. Accuracy drops to 23.9% MAPE for light-intensity or slow walking, and accuracy is lower for adults aged 40+ (10.9% MAPE vs 4.3% for under 40).' }
        },
        {
          '@type': 'Question',
          'name': 'Is the Oura Ring accurate for step counting?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'No. While the Oura Ring shows acceptable lab accuracy (<10% MAPE in controlled walking tests), it averages +2,124 phantom steps per day in free-living conditions due to hand gestures being misclassified as steps. The finger placement makes it fundamentally unsuited for reliable daily step counting. Use the Oura Ring for sleep and HRV, not step counts.' }
        },
        {
          '@type': 'Question',
          'name': 'What is the biggest factor affecting step count accuracy?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Walking speed is the single biggest factor. All wearables perform well at normal walking speeds (0.9–1.8 m/s) but accuracy drops dramatically below 0.9 m/s. At very slow speeds (<0.5 m/s), even the best devices miss the majority of steps. Sensor placement (ankle vs. wrist) and arm swing are the next most important factors.' }
        },
        {
          '@type': 'Question',
          'name': 'Does Garmin overcount or undercount steps?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Garmin predominantly underestimates steps, especially at slow walking speeds and on treadmills. Its 10-step minimum bout filter — which waits for 10 consecutive step-like patterns before recording — eliminates phantom steps but causes it to miss very short walking bursts. In free-living conditions, MAPE ranges from 10–17.8% depending on the model.' }
        },
        {
          '@type': 'Question',
          'name': 'How does WHOOP count steps?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'WHOOP added step counting via a firmware update in October 2024. It uses a 3-axis accelerometer plus 3-axis gyroscope to detect step cadence. However, as of early 2026, no peer-reviewed validation studies exist for WHOOP step counting. WHOOP intentionally focuses on Strain (cardiovascular load) rather than steps.' }
        },
        {
          '@type': 'Question',
          'name': 'Why does my wearable count steps when I\'m driving or sitting?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Wrist-worn devices detect arm motion as a proxy for walking. Road vibrations during driving, desk work, and repetitive hand movements can all trigger the step detection algorithm. Samsung and Oura users report the most phantom steps (2,000–3,500+ per day). Garmin\'s 10-step minimum bout filter provides the best defense against phantom steps.' }
        }
      ]
    };

    [webApp, faq].forEach((schema, i) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      if (i === 0) script.setAttribute('data-kygo-step-ld', '');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }
}

customElements.define('kygo-step-count-accuracy', KygoStepCountAccuracy);
