/**
 * Kygo Health — RHR Factor Explorer
 * Tag: kygo-rhr-factors
 * Interactive tool exploring 37 research-backed factors that affect resting heart rate
 * across 4 modifiable categories (Nutrition, Supplements, Exercise, Environment)
 * plus 7 demographic baseline factors. Includes a "Common Myths" section.
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

class KygoRhrFactors extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._catFilter = null;          // currently picked category for the sortable factors section
    this._listSort = 'impact';
    this._listExpandedKey = null;
    this._baselineExpandedKey = null;
    this._mythsCatPick = null;       // currently picked category for the myths section
    this._eventsBound = false;
  }

  connectedCallback() {
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, 'RHR Factor Explorer by Kygo Health. Explore 37 research-backed factors that influence resting heart rate (RHR) across 4 modifiable categories — Nutrition, Supplements, Exercise, and Environment — plus 7 demographic baseline factors. Nutrition factors include omega-3 EPA/DHA (lowers RHR by 1.6 bpm per Hidayat 2018 meta-analysis of 51 RCTs), habitual coffee (no significant effect), acute high-dose caffeine, alcohol (raises RHR 2.4 bpm per drink above average per 5.1M person-day wearables study), weight loss (Look AHEAD trial), Mediterranean diet (lowers 2.2 bpm in SUN cohort n=15,863), and reduced sodium (raises 1.65 bpm per Graudal meta-analysis). Supplements include omega-3 fish oil, soluble fiber, chromium, potassium (null), vitamin D (null per BEST-D RCT), L-arginine (null), and melatonin (mixed). Exercise factors include endurance training (lowers 8.4 bpm with 30+ weeks per Huang 2005), HIIT (lowers 3.9 bpm per Edwards 2023 meta-analysis of 97 RCTs), yoga (lowers 5.27 bpm per Cramer 2014), VO2max fitness, resistance training alone (null), tai chi, sedentary behavior, and overtraining. Environment factors include heat, cold, altitude, air pollution, nighttime traffic noise, time of day, and season. Demographics include age, female sex, genetics, obesity, pregnancy, menstrual cycle, and ethnicity. Includes Common Myths section with 33 popular factors that lack RHR-specific evidence including dark chocolate, beetroot juice, magnesium, CoQ10, ashwagandha for RHR, and creatine. Every claim backed by RCTs and meta-analyses. What affects resting heart rate. How to lower resting heart rate naturally. Best supplements for heart rate. Data sourced from peer-reviewed studies.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  get _categories() {
    return {
      nutrition:   { name: 'Nutrition',   icon: 'salad',    count: 7 },
      supplements: { name: 'Supplements', icon: 'pill',     count: 7 },
      exercise:    { name: 'Exercise',    icon: 'dumbbell', count: 8 },
      environment: { name: 'Environment', icon: 'wind',     count: 8 }
    };
  }

  get _categoryMeta() {
    // All categories use brand-aligned tones (green family + dark navy) instead of
    // a rainbow palette. Variation comes from intensity, not hue rotation.
    return {
      nutrition:   { label: 'Nutrition',   hue: '#16A34A' },
      supplements: { label: 'Supplements', hue: '#0F766E' },
      exercise:    { label: 'Exercise',    hue: '#1E293B' },
      environment: { label: 'Environment', hue: '#475569' }
    };
  }

  get _factorsNutrition() {
    return [
      {
        key: 'omega3-diet', name: 'Omega-3 (EPA/DHA) Intake',
        direction: 'positive', evidence: 'strong', effectSize: 1.6,
        effect: 'Lowers RHR (↓)',
        keyFinding: 'Meta-analysis of 51 RCTs: −1.6 bpm; −2.5 bpm if baseline ≥69',
        whatThisMeans: 'Eating fatty fish or supplementing with EPA/DHA reliably slows your resting heart rate. The effect is small but rock-solid — pooled across 51 randomized trials, it averages about 1.6 bpm lower, and gets stronger if your starting RHR is already elevated. One of the cleanest dietary signals in the entire RHR literature.',
        mechanism: 'EPA/DHA incorporate into cardiomyocyte membranes, modulating ion channels and slowing sinoatrial node firing; also enhance vagal tone.',
        dosage: '1–2 g/day combined EPA+DHA from fatty fish or supplement',
        source: { url: 'https://www.nature.com/articles/s41430-017-0052-3', label: 'Hidayat 2018 meta-analysis (PMC5988646)' }
      },
      {
        key: 'habitual-coffee', name: 'Habitual Coffee (Chronic)',
        direction: 'variable', evidence: 'strong', effectSize: null,
        effect: 'No effect (→)',
        keyFinding: 'Meta-analysis 6 RCTs: +0.40 bpm RHR, not significant',
        whatThisMeans: "Daily coffee drinkers — relax. The pooled evidence across 6 controlled trials shows habitual coffee doesn't move your resting heart rate in either direction. The +0.4 bpm change wasn't statistically significant. This is a documented null finding, not a recommendation.",
        mechanism: 'Tolerance develops to caffeine\'s adenosine receptor blockade with repeated exposure; chronic heart-rate response normalizes within weeks.',
        dosage: 'Up to 3–4 cups/day appears neutral for chronic RHR',
        source: { url: 'https://pubmed.ncbi.nlm.nih.gov/37647856/', label: '2023 meta-analysis of 6 RCTs (PubMed 37647856)' }
      },
      {
        key: 'acute-caffeine', name: 'Acute High-Dose Caffeine (>3 mg/kg)',
        direction: 'negative', evidence: 'moderate', effectSize: null,
        effect: 'Raises RHR (↑)',
        keyFinding: 'Narrative review: dose-dependent; high doses raise HR',
        whatThisMeans: "A single big caffeine dose — pre-workout scoop, double espresso on an empty stomach — does temporarily raise heart rate in a dose-dependent way. This is the acute response, not the chronic one. Low doses (under 3 mg/kg) typically don't.",
        mechanism: 'Adenosine receptor antagonism removes baseline inhibition on sympathetic activity; catecholamine release elevates HR transiently.',
        dosage: 'Effect emerges above ~3 mg/kg single dose',
        source: { url: 'https://pubmed.ncbi.nlm.nih.gov/24203773/', label: 'Mesas 2014 review (PubMed 24203773)' }
      },
      {
        key: 'alcohol', name: 'Alcohol (per drink above average)',
        direction: 'negative', evidence: 'strong', effectSize: 2.4,
        effect: 'Raises RHR (+2.4 bpm)',
        keyFinding: 'Wearables study n=20,968 (5.1M person-days): +2.4 bpm M / +2.8 bpm F per drink',
        whatThisMeans: 'The largest real-world dataset on alcohol and heart rate ever assembled. Each additional drink above your personal average raised overnight RHR by about 2.4–2.8 bpm. This is the kind of effect your wearable will catch the morning after a few drinks — and the data confirms it is real, dose-related, and consistent across millions of person-days.',
        mechanism: 'Sympathetic activation, vagal withdrawal, and dehydration during alcohol metabolism elevate overnight HR; effect persists into the next morning.',
        dosage: 'Each drink above baseline matters; abstinence days produce the cleanest RHR',
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12970902/', label: '2026 wearables study (PMC12970902)' }
      },
      {
        key: 'weight-loss', name: 'Weight Loss (Lifestyle Intervention)',
        direction: 'positive', evidence: 'strong', effectSize: 5,
        effect: 'Lowers RHR (≈5 bpm)',
        keyFinding: 'Look AHEAD RCT yr 1: intensive lifestyle 72.8 vs 77.7 bpm; bariatric: −13 bpm at 2 yrs',
        whatThisMeans: 'Losing weight through a structured lifestyle program lowers RHR by about 5 bpm in the first year — not a small change. Bariatric surgery patients drop closer to 13 bpm over two years. Among the largest, most reliable RHR-modifiers available, and one of the few that compounds with cardiovascular benefit.',
        mechanism: 'Reduced sympathetic drive, lower circulating catecholamines, improved cardiac efficiency; less metabolic load on the heart at rest.',
        dosage: 'Sustained lifestyle program (caloric + activity); 7–10% weight loss yields measurable change',
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3512322/', label: 'Look AHEAD 2012 (PMC3512322)' }
      },
      {
        key: 'mediterranean', name: 'Mediterranean Diet Adherence',
        direction: 'positive', evidence: 'moderate', effectSize: 2.2,
        effect: 'Lowers RHR (−2.2 bpm)',
        keyFinding: 'SUN cohort, n=15,863: high vs low adherence = −2.2 bpm (95% CI 1.4–3.1)',
        whatThisMeans: 'A cross-sectional study of nearly 16,000 people found those eating closest to a Mediterranean pattern had RHR about 2.2 bpm lower than those eating furthest from it. Cross-sectional data so causality is uncertain, but the size of the cohort and tightness of the confidence interval make this a serious signal.',
        mechanism: 'High polyphenol/omega-3 intake reduces inflammation and endothelial dysfunction; lower processed-food intake supports vagal tone.',
        dosage: 'High adherence: vegetables, legumes, fish, olive oil, whole grains; low red meat',
        source: { url: 'https://pubmed.ncbi.nlm.nih.gov/23144202/', label: 'García-López 2014 SUN cohort (PubMed 23144202)' }
      },
      {
        key: 'low-sodium', name: 'Reduced Sodium Intake',
        direction: 'negative', evidence: 'strong', effectSize: 1.65,
        effect: 'Raises RHR (+1.65 bpm)',
        keyFinding: 'Meta-analysis 63 RCTs: low-sodium raises HR by 1.65 bpm',
        whatThisMeans: "A counter-intuitive but well-replicated finding. Cutting sodium meaningfully lowers blood pressure — but it nudges resting heart rate up by about 1.65 bpm across 63 controlled trials. The body compensates for reduced volume by raising HR. Doesn't negate sodium reduction's BP benefit, just worth knowing.",
        mechanism: 'Reduced extracellular volume triggers compensatory sympathetic activation and renin–angiotensin response, modestly raising HR.',
        dosage: 'Moderate reduction (not extreme); BP benefit still outweighs RHR effect for most',
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4805644/', label: 'Graudal 2016 meta-analysis (PMC4805644)' }
      }
    ];
  }

  get _factorsSupplements() {
    return [
      {
        key: 'omega3-supp', name: 'Omega-3 Fish Oil (Supplement)',
        direction: 'positive', evidence: 'strong', effectSize: 1.6,
        effect: 'Lowers RHR (−1.6 bpm)',
        keyFinding: 'Meta-analysis 51 RCTs: −1.6 bpm; −2.5 bpm at baseline ≥69',
        whatThisMeans: 'The single supplement with strong, replicated RHR-specific evidence. Across 51 randomized trials, fish-oil supplementation lowered resting heart rate by about 1.6 bpm — and by 2.5 bpm if your starting RHR was already 69 or higher. If you only take one supplement for cardiovascular markers, this is the one with the data.',
        mechanism: 'EPA/DHA modify cardiac ion channels and membrane fluidity, slowing sinoatrial firing; vagal-tone enhancement is a secondary mechanism.',
        dosage: '1–2 g/day combined EPA+DHA; standardized triglyceride form',
        source: { url: 'https://www.nature.com/articles/s41430-017-0052-3', label: 'Hidayat 2018 meta-analysis (PMC5988646)' }
      },
      {
        key: 'oat-bran', name: 'Soluble Fiber (Oat Bran 30 g/d)',
        direction: 'positive', evidence: 'emerging', effectSize: null,
        effect: 'Lowers RHR (HTN only)',
        keyFinding: 'Single RCT n=70 over 3 mo: significant 24-h HR reduction vs DASH-only control',
        whatThisMeans: 'A single 3-month trial in hypertensive patients found 30 g/day of oat bran on top of a DASH diet meaningfully reduced 24-hour heart rate compared to DASH alone. Specific to a clinical population — not yet replicated in healthy adults — but a clean, hypothesis-generating result.',
        mechanism: 'Soluble fiber improves glycemic stability, lowers LDL, and shifts gut microbiome toward short-chain fatty acid producers that support vagal tone.',
        dosage: '30 g/day oat bran (or equivalent soluble fiber)',
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9370281/', label: 'Nutrients 2022 RCT (PMC9370281)' }
      },
      {
        key: 'chromium', name: 'Chromium Yeast (MetS / IGT)',
        direction: 'positive', evidence: 'emerging', effectSize: null,
        effect: 'Lowers RHR (MetS only)',
        keyFinding: 'Single RCT in MetS/IGT: only RHR significantly reduced',
        whatThisMeans: 'In one RCT in metabolic syndrome / impaired glucose tolerance patients, chromium yeast was the only intervention that significantly reduced RHR among the markers tested. Population-specific, single trial — interesting signal but not generalizable yet.',
        mechanism: 'Chromium improves insulin sensitivity; reduced hyperinsulinemia may indirectly lower sympathetic tone in metabolically impaired individuals.',
        dosage: 'Chromium yeast supplementation (per trial protocol); only studied in MetS/IGT',
        source: { url: 'https://pubmed.ncbi.nlm.nih.gov/28856601/', label: 'Chromium MetS RCT (PubMed 28856601)' }
      },
      {
        key: 'potassium', name: 'Potassium Supplements',
        direction: 'variable', evidence: 'strong', effectSize: null,
        effect: 'No effect (→)',
        keyFinding: 'Meta-analysis 22 RCTs, n=1,086: +0.19 bpm, not significant',
        whatThisMeans: "A documented null finding. Pooled across 22 RCTs and over 1,000 participants, potassium supplements changed resting heart rate by 0.19 bpm — not statistically different from zero. Useful for blood pressure in some people, but it's not an RHR lever.",
        mechanism: 'No clear chronic chronotropic mechanism at supplementation doses; HR effect appears neutral.',
        dosage: 'Not recommended for RHR; consider for BP under clinician guidance',
        source: { url: 'https://pubmed.ncbi.nlm.nih.gov/27289164/', label: 'Gijsbers 2016 meta-analysis (PubMed 27289164)' }
      },
      {
        key: 'vitamin-d', name: 'Vitamin D',
        direction: 'variable', evidence: 'strong', effectSize: null,
        effect: 'No effect (→)',
        keyFinding: 'BEST-D RCT, n=305, 12 mo: no HR effect at any dose',
        whatThisMeans: 'A clean, year-long, dose-response RCT — and vitamin D produced zero change in heart rate at any dose tested. One of the most over-supplemented compounds in the wellness world; for resting heart rate specifically, the evidence says it does nothing.',
        mechanism: 'No demonstrated direct chronotropic effect at any tested dose over 12 months.',
        dosage: 'Not recommended for RHR; supplement only if clinically deficient',
        source: { url: 'https://www.ahajournals.org/doi/10.1161/JAHA.117.005707', label: 'BEST-D RCT 2017 (PMC5721827)' }
      },
      {
        key: 'l-arginine', name: 'L-Arginine',
        direction: 'variable', evidence: 'moderate', effectSize: null,
        effect: 'No effect (→)',
        keyFinding: 'Multiple RCTs (HF, healthy, athletes): no consistent RHR change',
        whatThisMeans: "Heavily marketed for cardiovascular and exercise benefits, but the RHR data is null across multiple trials in heart failure patients, healthy adults, and athletes. There's no consistent direction of effect on resting heart rate.",
        mechanism: 'NO precursor pathway affects vasodilation and BP, but does not consistently translate to chronic RHR change.',
        dosage: 'Not recommended for RHR',
        source: { url: 'https://www.ahajournals.org/doi/10.1161/01.CIR.93.12.2135', label: 'Rector 1996 RCT (PubMed 8925582)' }
      },
      {
        key: 'melatonin', name: 'Melatonin',
        direction: 'mixed', evidence: 'emerging', effectSize: null,
        effect: 'Mixed (↕)',
        keyFinding: 'Mixed: some ↓ nocturnal BP/HR, one CAD trial ↑ 24-h HR; emerging HF safety signal',
        whatThisMeans: "Melatonin's effect on RHR is genuinely mixed: some trials show modest nocturnal HR reduction, but a CAD trial actually saw 24-hour HR rise, and observational data is flagging a possible heart-failure safety signal. Not a clean RHR-lowering tool.",
        mechanism: 'MT1/MT2 receptor activity influences cardiovascular autonomics; effect direction varies by population, dose, and timing.',
        dosage: 'Use for sleep onset / circadian shift, not RHR; caution in cardiac patients',
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9251346/', label: 'Tobeiha 2022 review (PMC9251346)' }
      }
    ];
  }

  get _factorsExercise() {
    return [
      {
        key: 'aerobic-endurance', name: 'Endurance / Aerobic Training',
        direction: 'positive', evidence: 'strong', effectSize: 8.37,
        effect: 'Lowers RHR (−8.4 bpm)',
        keyFinding: 'Huang 2005 meta-analysis (older adults): SES −0.58 (−8.4%); −8.37 bpm if >30 wk vs −4.86 bpm if <30 wk',
        whatThisMeans: "The single largest, cleanest RHR-lowering intervention in the literature. Sustained aerobic training drops resting heart rate by about 8.4 bpm — but only after 30+ weeks of consistent work. Shorter programs still deliver about 4.9 bpm. There's no other modifiable factor with this kind of effect size.",
        mechanism: 'Cardiac remodeling increases stroke volume; enhanced vagal tone and reduced intrinsic sinus rate produce sustained lower RHR.',
        dosage: '150+ min/week moderate aerobic activity; 30+ weeks for maximal effect',
        source: { url: 'https://pubmed.ncbi.nlm.nih.gov/16118586/', label: 'Huang 2005 meta-analysis (PubMed 16118586)' }
      },
      {
        key: 'hiit', name: 'High-Intensity Interval Training (HIIT)',
        direction: 'positive', evidence: 'strong', effectSize: 3.9,
        effect: 'Lowers RHR (−3.9 bpm)',
        keyFinding: '97-RCT meta-analysis: −3.9 bpm; long-term (≥12 wk) SMD −0.33',
        whatThisMeans: 'Across 97 RCTs and over 3,000 participants, HIIT lowered resting heart rate by about 3.9 bpm. Smaller absolute effect than long-term endurance training, but it shows up faster — meaningful change within 12 weeks. The most time-efficient way to drop RHR.',
        mechanism: 'Repeated supramaximal stimulus drives cardiac autonomic remodeling, vagal reactivation, and improved stroke volume in shorter timeframes.',
        dosage: '2–3 sessions/week for ≥12 weeks; e.g. 4×4 min intervals',
        source: { url: 'https://pubmed.ncbi.nlm.nih.gov/37204620/', label: 'Edwards 2023 meta-analysis (PubMed 37204620)' }
      },
      {
        key: 'yoga', name: 'Yoga (Chronic Practice)',
        direction: 'positive', evidence: 'strong', effectSize: 5.27,
        effect: 'Lowers RHR (−5.3 bpm)',
        keyFinding: 'Cramer 2014 meta-analysis: −5.27 bpm (95% CI −9.55 to −1.00) vs non-exercise control',
        whatThisMeans: 'A robust meta-analysis found regular yoga practice lowers RHR by about 5.27 bpm versus non-exercise controls. The effect rivals dedicated cardio in some trials — likely because the breathwork directly drives parasympathetic tone, on top of the modest physical demand.',
        mechanism: 'Pranayama breathing activates the vagus nerve and parasympathetic nervous system; postural work supports cardiovascular conditioning.',
        dosage: '3+ sessions/week of regular practice',
        source: { url: 'https://pubmed.ncbi.nlm.nih.gov/24636547/', label: 'Cramer 2014 meta-analysis (PubMed 24636547)' }
      },
      {
        key: 'vo2max', name: 'Cardiorespiratory Fitness (VO₂max)',
        direction: 'positive', evidence: 'strong', effectSize: null,
        effect: 'Lowers RHR (↓)',
        keyFinding: 'Fenland Study, n=10,865: inverse RHR–fitness relationship; β ≈ −0.30',
        whatThisMeans: 'In a population-level study of nearly 11,000 adults, RHR tracked tightly inversely with VO₂max. Higher fitness, lower RHR — at the population level, RHR is essentially a proxy for cardiorespiratory fitness. This is why your morning RHR is one of the most informative single numbers your wearable produces.',
        mechanism: 'Higher VO₂max reflects greater cardiac stroke volume and vagal dominance, both of which reduce required HR at rest.',
        dosage: 'Build VO₂max via consistent aerobic + interval training',
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10174582/', label: 'Gonzales 2023 Fenland Study (PMC10174582)' }
      },
      {
        key: 'resistance-only', name: 'Resistance Training Alone',
        direction: 'variable', evidence: 'strong', effectSize: 0.08,
        effect: 'No effect (→)',
        keyFinding: 'Reimers 2018 (43 strength trials); isometric meta-analysis: −0.08 bpm, n.s.',
        whatThisMeans: "Lifting weights is great for many things — RHR isn't really one of them. Across 43 strength-training trials and an isometric meta-analysis, the change was 0.08 bpm and not statistically significant. If you want lower RHR, add cardio. Strength alone doesn't move the number meaningfully.",
        mechanism: 'Pure strength training produces minimal cardiac remodeling and limited vagal activation versus aerobic work.',
        dosage: 'Combine with aerobic training for RHR benefit; resistance alone is insufficient',
        source: { url: 'https://pubmed.ncbi.nlm.nih.gov/30624369/', label: 'López-Valenciano 2019 meta-analysis (PubMed 30624369)' }
      },
      {
        key: 'tai-chi', name: 'Tai Chi / Qigong',
        direction: 'positive', evidence: 'moderate', effectSize: null,
        effect: 'Lowers RHR (↓)',
        keyFinding: 'Reimers 2018 subgroups (5 tai chi + 3 qigong): consistent ↓ direction, smaller magnitude',
        whatThisMeans: 'Subgroup analyses across 8 trials of tai chi and qigong consistently lowered RHR — the magnitude was smaller than yoga or aerobic exercise, but the direction was consistent. A reasonable option for low-impact RHR support, especially in older adults.',
        mechanism: 'Slow movement plus deep diaphragmatic breathing engage parasympathetic tone; modest cardiovascular load conditions the sinoatrial response.',
        dosage: 'Regular practice; 3+ sessions/week',
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/', label: 'Reimers 2018 (PMC6306777)' }
      },
      {
        key: 'sedentary', name: 'Sedentary Behavior / Sitting Time',
        direction: 'negative', evidence: 'moderate', effectSize: null,
        effect: 'Raises RHR (↑)',
        keyFinding: 'Cohort + cross-sectional: more leisure sitting → elevated RHR + reduced HRV',
        whatThisMeans: "Cohort and cross-sectional data agree: more leisure sitting time tracks with higher resting heart rate (and lower HRV). It's not just the absence of exercise — prolonged inactivity itself appears to push RHR up. Standing breaks and step counts do help.",
        mechanism: 'Prolonged sitting reduces venous return and skeletal-muscle pump activity, blunting cardiovascular conditioning and elevating sympathetic tone.',
        dosage: 'Break sitting hourly; integrate movement throughout the day',
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6406480/', label: 'Hallman 2019 (PMC6406480)' }
      },
      {
        key: 'overtraining', name: 'Overtraining / Overreaching',
        direction: 'negative', evidence: 'moderate', effectSize: null,
        effect: 'Raises RHR (↑)',
        keyFinding: 'Systematic review (Bosquet 2008): morning HR can rise with overtraining, small amplitude limits utility',
        whatThisMeans: "Pushing volume past your recovery capacity raises morning RHR — but the change is often small enough that it's an unreliable single marker. Watch for trends over weeks alongside HRV and perceived recovery, not single-day spikes.",
        mechanism: 'Sympathetic overactivation, suppressed parasympathetic tone, and unrecovered cardiovascular load elevate baseline HR.',
        dosage: 'Schedule recovery weeks; track 7-day average RHR for trends',
        source: { url: 'https://pubmed.ncbi.nlm.nih.gov/18308872/', label: 'Bosquet 2008 review (PubMed 18308872)' }
      }
    ];
  }

  get _factorsEnvironment() {
    return [
      {
        key: 'heat', name: 'High Ambient Temperature (Heat)',
        direction: 'negative', evidence: 'strong', effectSize: 0.11,
        effect: 'Raises RHR (+0.11/°C)',
        keyFinding: 'Madaniyazi 2016, Chinese cohort n=47,591: +0.11 bpm per 1 °C increase in mean daily temp',
        whatThisMeans: 'In a cohort of nearly 48,000 adults, heart rate rose about 0.11 bpm for every 1 °C increase in mean daily temperature. Small per-degree but adds up across summer or in hot bedrooms — a measurable real-world signal.',
        mechanism: 'Heat dilates peripheral vasculature for cooling; HR rises to maintain blood pressure and dissipate heat through skin perfusion.',
        dosage: 'Cool the bedroom; hydrate in heat; expect higher RHR readings in summer',
        source: { url: 'https://www.nature.com/articles/srep21003', label: 'Madaniyazi 2016 (PMC4753475)' }
      },
      {
        key: 'cold', name: 'Cold Ambient Temperature',
        direction: 'negative', evidence: 'strong', effectSize: null,
        effect: 'Raises RHR (↑)',
        keyFinding: 'Madaniyazi 2016: V-shape relationship; cold also raises RHR (more so in low-BMI individuals)',
        whatThisMeans: "RHR has a V-shaped relationship with temperature: both heat and cold push it up. The cold effect is more pronounced in lean people, who have less insulation. The thermoneutral comfort zone really is a heart-rate sweet spot.",
        mechanism: 'Cold triggers vasoconstriction and sympathetic activation to preserve core temperature; HR rises to support thermogenesis.',
        dosage: 'Stay in thermoneutral range when possible; layer rather than under-heat the bedroom',
        source: { url: 'https://www.nature.com/articles/srep21003', label: 'Madaniyazi 2016 (PMC4753475)' }
      },
      {
        key: 'altitude-acute', name: 'High Altitude — Acute',
        direction: 'negative', evidence: 'strong', effectSize: null,
        effect: 'Raises RHR (↑)',
        keyFinding: 'Bärtsch & Gibbs 2007 (Circulation): hypobaric hypoxia → sympathetic activation → RHR rises',
        whatThisMeans: 'In the first hours-to-days at altitude, your resting heart rate rises measurably as the body responds to lower oxygen pressure. Expect this on ski trips, mountain hikes, or after flights to high-altitude cities — it normalizes with acclimatization.',
        mechanism: 'Hypobaric hypoxia activates chemoreceptors and the sympathetic nervous system; HR rises to maintain oxygen delivery.',
        dosage: 'Expect transient RHR elevation; expect normalization within weeks of acclimatization',
        source: { url: 'https://www.ahajournals.org/doi/10.1161/circulationaha.106.650796', label: 'Bärtsch & Gibbs 2007 (PubMed 17984389)' }
      },
      {
        key: 'altitude-chronic', name: 'High Altitude — Acclimatized',
        direction: 'variable', evidence: 'strong', effectSize: null,
        effect: 'No effect (→)',
        keyFinding: 'Bärtsch & Gibbs 2007: RHR returns toward sea-level values with acclimatization (weeks)',
        whatThisMeans: 'After several weeks at altitude, RHR returns toward sea-level values as the body acclimatizes. Long-term high-altitude residents show RHR roughly comparable to sea-level peers, not chronically elevated.',
        mechanism: 'Increased red blood cell mass, hematocrit, and improved cardiac efficiency restore normal HR despite low oxygen tension.',
        dosage: 'No intervention needed; allow weeks for acclimatization',
        source: { url: 'https://www.ahajournals.org/doi/10.1161/circulationaha.106.650796', label: 'Bärtsch & Gibbs 2007 (PubMed 17984389)' }
      },
      {
        key: 'air-pollution', name: 'Air Pollution (PM2.5, NO₂)',
        direction: 'negative', evidence: 'moderate', effectSize: 2.01,
        effect: 'Raises RHR (+2.01 bpm)',
        keyFinding: 'COPD cohort 2025 (PMC11796267), 54,487 hourly observations: +2.01 bpm per IQR NO₂',
        whatThisMeans: 'In a COPD cohort with over 54,000 hourly observations, each interquartile-range increase in nitrogen dioxide raised RHR by about 2.01 bpm. Studied in a vulnerable population, but the mechanism applies broadly. Polluted-air days are RHR-bumpier days.',
        mechanism: 'Air pollutants increase systemic inflammation and oxidative stress, blunt vagal tone, and shift cardiac autonomics toward sympathetic dominance.',
        dosage: 'Use HEPA indoors on bad-air days; check AQI before outdoor exercise',
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11796267/', label: '2025 COPD cohort (PMC11796267)' }
      },
      {
        key: 'noise', name: 'Nighttime Traffic Noise',
        direction: 'negative', evidence: 'strong', effectSize: 9,
        effect: 'Raises RHR (+9 bpm)',
        keyFinding: 'Griefahn 2008 lab study, n=24: +9 bpm during noise without awakening; +30 bpm with awakening',
        whatThisMeans: 'A controlled lab study showed nighttime traffic noise spikes heart rate by 9 bpm even when you don\'t consciously wake up — and 30 bpm when you do. Your sleeping cardiovascular system is registering the noise even when your brain isn\'t. Soundproofing is RHR work.',
        mechanism: 'Acoustic stimuli activate the autonomic nervous system through brainstem pathways; sympathetic surge spikes HR within seconds.',
        dosage: 'White noise, earplugs, soundproofing; aim for bedroom <30 dB',
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2279756/', label: 'Griefahn 2008 (PMC2279756)' }
      },
      {
        key: 'circadian', name: 'Time of Day (Circadian)',
        direction: 'mixed', evidence: 'strong', effectSize: null,
        effect: 'Mixed (↕)',
        keyFinding: 'Boudreau 2012: RHR peaks afternoon (~16:36), trough during biological night',
        whatThisMeans: "Your RHR isn't a single number — it follows a daily rhythm with a peak around 4:30 PM and a trough during biological night. This is why morning RHR is the cleanest measurement for tracking. Afternoon spikes are normal physiology, not a problem.",
        mechanism: 'Circadian regulation of autonomic tone — sympathetic activity rises through the day, peaks in late afternoon, and falls during sleep.',
        dosage: 'Track RHR at consistent time (typically just after waking) for cleanest signal',
        source: { url: 'https://pubmed.ncbi.nlm.nih.gov/22734576/', label: 'Boudreau 2012 (PubMed 22734576)' }
      },
      {
        key: 'season', name: 'Season (Winter vs Summer)',
        direction: 'negative', evidence: 'strong', effectSize: 2,
        effect: 'Raises RHR in winter (+2 bpm)',
        keyFinding: 'Wearable cohort n=92,457 (PMC7001906): ~2 bpm higher in winter vs midsummer minimum',
        whatThisMeans: "A wearable study of over 92,000 adults showed RHR is about 2 bpm higher in winter than at midsummer's minimum. Real, but small — don't panic if your January readings tick up. It's a normal seasonal pattern, not a health red flag.",
        mechanism: 'Winter combines cold thermal load, reduced activity, lower light exposure, and higher infection rates — all nudge RHR upward.',
        dosage: 'Expect seasonal variation; compare year-over-year same-month rather than month-to-month',
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7001906/', label: 'PLOS ONE 2020 wearable cohort (PMC7001906)' }
      }
    ];
  }

  get _factorsDemographics() {
    return [
      {
        key: 'age', name: 'Increasing Age',
        evidence: 'strong',
        effect: 'Lowers RHR (−1.47 bpm/decade)',
        keyFinding: 'Health eHeart Study n=66,788: −1.47 bpm per 10 years of age',
        whatThisMeans: "In the largest real-world dataset of its kind, RHR drops by about 1.47 bpm per decade of age. Counter to the common assumption that aging raises every cardiovascular marker — for resting heart rate specifically, the trend is gently downward in healthy adults.",
        mechanism: 'Reduced intrinsic sinus node firing rate and decreased β-adrenergic responsiveness with age, balanced against age-related vagal decline.',
        source: { url: 'https://www.nature.com/articles/s41746-019-0134-9', label: 'Avram 2019 Health eHeart (PMC6592896)' }
      },
      {
        key: 'sex-female', name: 'Female Sex',
        evidence: 'strong',
        effect: 'Higher RHR (+6 to +14 bpm vs men)',
        keyFinding: 'Gillum 1988 NHANES: women +6 to +14 bpm vs men at each age (adjusted)',
        whatThisMeans: "A consistent finding across decades of national surveys: women have measurably higher resting heart rate than men at every age, even after adjusting for body size and activity. Doesn't reflect worse health — it's baseline physiology.",
        mechanism: 'Smaller heart size means lower stroke volume per beat, requiring higher HR to maintain cardiac output; hormonal influences also play a role.',
        source: { url: 'https://pubmed.ncbi.nlm.nih.gov/2969182/', label: 'Gillum 1988 NHANES (PubMed 2969182)' }
      },
      {
        key: 'genetics', name: 'Genetics / Heritability',
        evidence: 'strong',
        effect: 'Intrinsic (h² ≈ 0.23)',
        keyFinding: 'Jensen 2018 Danish twins n=4,282: h² = 0.23; 2023 GWAS n=835,465 identified 493 variants',
        whatThisMeans: "About a quarter of the variation in resting heart rate between people is genetic — confirmed in twin studies and a massive GWAS that identified 493 genetic variants. Some of your RHR is just inherited. The other ~77% is everything else on this list.",
        mechanism: 'Multiple genetic variants influence ion channel function, autonomic tone, and cardiac structure, collectively setting individual baseline HR.',
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5831408/', label: 'Jensen 2018 (PMC5831408) + 2023 GWAS' }
      },
      {
        key: 'obesity', name: 'Obesity / High BMI',
        evidence: 'strong',
        effect: 'Raises RHR (J-shape)',
        keyFinding: 'J-shape: 22.7% of those with HR >90 bpm had BMI >40, vs 10.3% of normal-weight',
        whatThisMeans: "RHR has a J-shaped relationship with BMI: it's higher both at very low and very high body weights, with a minimum in the normal-weight range. People with severe obesity were more than twice as likely to have RHR over 90 bpm.",
        mechanism: 'Excess body mass increases cardiac workload, sympathetic tone, and inflammation; all raise resting HR.',
        source: { url: 'https://pubmed.ncbi.nlm.nih.gov/37249904/', label: '2023 BMI–HR study (PubMed 37249904)' }
      },
      {
        key: 'pregnancy', name: 'Pregnancy (Across Gestation)',
        evidence: 'strong',
        effect: 'Raises RHR (+10 to +20 bpm)',
        keyFinding: 'Sanghavi & Rutherford 2014 Circulation review: HR rises 10–20 bpm progressively, peak in 3rd trimester',
        whatThisMeans: "Pregnancy progressively raises resting heart rate by 10–20 bpm, peaking in the third trimester. This is the single largest physiological RHR change in healthy adults — and it's expected, not pathological. RHR returns to baseline within weeks of delivery.",
        mechanism: 'Increased blood volume, lower vascular resistance, and elevated metabolic demand all drive cardiac output and HR upward through gestation.',
        source: { url: 'https://www.ahajournals.org/doi/10.1161/circulationaha.114.009029', label: 'Sanghavi 2014 Circulation (PubMed 25223771)' }
      },
      {
        key: 'menstrual', name: 'Menstrual Cycle (Luteal Phase)',
        evidence: 'moderate',
        effect: 'Raises RHR (+2.33 bpm vs follicular)',
        keyFinding: 'Premenopausal women n=49: +2.33 bpm in luteal vs follicular phase',
        whatThisMeans: 'In premenopausal women, RHR runs about 2.33 bpm higher in the luteal phase (post-ovulation) than in the follicular phase. A small but real cyclical variation worth knowing about when interpreting your wearable data day-to-day.',
        mechanism: 'Luteal-phase progesterone shifts autonomic balance toward sympathetic dominance and modestly raises core temperature.',
        source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9572726/', label: 'Premenopausal women study (PMC9572726)' }
      },
      {
        key: 'race-ethnicity', name: 'Race / Ethnicity',
        evidence: 'moderate',
        effect: 'Mixed (small variation)',
        keyFinding: 'Gillum 1988 NHANES: small race-related variation; sex difference holds across races',
        whatThisMeans: "NHANES data showed small race-related variations in resting heart rate (e.g., Black men ages 18–34 slightly lower than White men), but the differences are minor and the male/female gap holds across racial groups. A real but minor demographic factor.",
        mechanism: 'Likely reflects a mix of genetic, environmental, and socioeconomic factors; magnitude is small relative to other demographic determinants.',
        source: { url: 'https://pubmed.ncbi.nlm.nih.gov/2969182/', label: 'Gillum 1988 NHANES (PubMed 2969182)' }
      }
    ];
  }

  get _myths() {
    return [
      // Nutrition
      { name: 'Dark chocolate / cocoa flavanols', cat: 'Nutrition', why: 'Large RCT (COSMOS, n=21,442) found no HR effect; chronic-RHR evidence absent.' },
      { name: 'Dietary nitrate / beetroot juice', cat: 'Nutrition', why: 'Chronic-supplementation meta-analysis (6 RCTs, n=181) showed no significant RHR change.' },
      { name: 'Green tea catechins', cat: 'Nutrition', why: 'RCT in hypertensive women found no RHR change (PubMed 24619865).' },
      { name: 'Sugar-sweetened beverages', cat: 'Nutrition', why: 'Acute hemodynamic effect documented, but no longitudinal evidence linking habitual SSB intake to baseline RHR.' },
      { name: 'Hydration / water intake', cat: 'Nutrition', why: 'Acute drinking-water response is real but transient; chronic dietary water → baseline RHR link not established.' },
      { name: 'Energy drinks / taurine', cat: 'Nutrition', why: 'Mixed RCT findings, confounded by caffeine and sugar content.' },
      { name: 'B-vitamins, polyphenols, probiotics (nutrition)', cat: 'Nutrition', why: 'Flagged for HRV benefits in keystone reviews; RHR-specific evidence is sparse.' },
      // Supplements
      { name: 'L-theanine', cat: 'Supplements', why: 'Kimura 2007 RCT measured HR during acute stress, not baseline RHR. No evidence for chronic RHR.' },
      { name: 'Magnesium', cat: 'Supplements', why: 'No meta-analysis on RHR exists; magnesium-L-threonate trials measure sleep scores, not RHR.' },
      { name: 'Coenzyme Q10 (CoQ10)', cat: 'Supplements', why: 'No RHR-specific RCTs identified; cardiovascular literature focuses on heart-failure mortality.' },
      { name: 'Oral iron', cat: 'Supplements', why: 'No clear RHR signal except in true iron-deficiency anemia; IRONOUT-HF trial was null.' },
      { name: 'Ashwagandha (Withania)', cat: 'Supplements', why: 'RCTs show HRV improvement and stress changes, but no significant change in resting HR.' },
      { name: 'Creatine', cat: 'Supplements', why: 'No published RHR endpoint data.' },
      { name: 'Hawthorn (Crataegus)', cat: 'Supplements', why: 'In vitro effect documented but clean human RCT data on RHR specifically is sparse.' },
      { name: 'Garlic', cat: 'Supplements', why: 'No meta-analysis on RHR; well-studied for BP and lipids only.' },
      { name: 'Beetroot extract / nitrate', cat: 'Supplements', why: 'Meta-analysis (6 RCTs, n=181) showed no RHR change.' },
      { name: 'B-vitamins, polyphenols, probiotics (supplement)', cat: 'Supplements', why: 'Flagged for HRV benefits in keystone reviews but RHR-specific evidence is sparse.' },
      // Exercise
      { name: 'Single bouts of exercise (acute)', cat: 'Exercise', why: 'Transient response, not a chronic determinant of RHR.' },
      { name: 'Stretching alone', cat: 'Exercise', why: 'No chronic RHR effect demonstrated in trials.' },
      { name: 'HERITAGE Family Study findings', cat: 'Exercise', why: 'Found "minimal effect" in a single 20-week cohort — outlier contradicted by Reimers 2018 meta-analysis of 121 endurance trials.' },
      { name: 'Walking specifically', cat: 'Exercise', why: 'Covered under endurance/aerobic; no separate meta-analysis on walking-only RHR.' },
      { name: 'HRV training as RHR proxy', cat: 'Exercise', why: 'Different physiological measure; intentionally separate from RHR-specific evidence.' },
      // Environment
      { name: 'Sleep deprivation', cat: 'Environment', why: 'Mixed evidence — Kato 2000 found no HR change despite raised BP. HRV effects clearer than RHR.' },
      { name: 'Indoor temperature / heating', cat: 'Environment', why: 'Covered under heat/cold; no separate controlled-exposure RHR data of comparable scale.' },
      { name: 'Humidity (isolated)', cat: 'Environment', why: 'Affects thermoregulation but isolated humidity → RHR data is sparse.' },
      { name: 'UV / sunlight exposure', cat: 'Environment', why: 'No direct RHR-specific evidence beyond temperature confounding.' },
      { name: 'Air travel / cabin pressure', cat: 'Environment', why: 'Covered under altitude (cabin altitude ≈ 6,000–8,000 ft).' },
      { name: 'Light exposure / screen time at night', cat: 'Environment', why: 'Primarily affects circadian timing rather than RHR per se.' },
      // Demographics
      { name: 'Height (independent of sex)', cat: 'Demographics', why: 'Palatini 1999 found a small inverse correlation, but the effect is minor and confounded by sex.' },
      { name: 'Childhood vs adult RHR', cat: 'Demographics', why: 'Captured under "age" rather than as a separate factor.' },
      { name: 'Menopause status (independent)', cat: 'Demographics', why: 'Postmenopausal RHR change is small relative to overall sex difference; research focuses on HRV.' },
      { name: 'Pubertal stage', cat: 'Demographics', why: 'Captured under age; specific puberty-RHR studies measure HRV rather than baseline RHR.' },
      { name: 'Socioeconomic status', cat: 'Demographics', why: 'Affects RHR via mediators (stress, BMI, exercise), not as a direct demographic determinant.' }
    ];
  }

  get _topPicks() {
    return [
      { label: 'Best single habit',     stat: '−8.4 bpm', answer: 'Aerobic Exercise',     icon: 'trophy',   note: '30+ weeks of training. Huang 2005 meta-analysis in older adults — largest single modifier in the literature.', cls: '' },
      { label: 'Best supplement',       stat: '−1.6 bpm', answer: 'Omega-3 / Fish Oil',  icon: 'pill',     note: 'Hidayat 2018 meta-analysis of 51 RCTs. The only supplement with strong, replicated RHR-specific evidence.', cls: '' },
      { label: 'Best diet',             stat: '−2.2 bpm', answer: 'Mediterranean Diet',  icon: 'droplet',  note: 'García-López 2014 SUN cohort (n=15,863). High vs low adherence: 2.2 bpm lower (95% CI 1.4–3.1).', cls: '' },
      { label: 'Quickest impact',       stat: '−3.9 bpm', answer: 'HIIT',                icon: 'dumbbell', note: 'Edwards 2023 meta-analysis of 97 RCTs. Measurable change within 12 weeks — far faster than endurance training.', cls: '' },
      { label: 'Biggest RHR killer',    stat: '+2.4 bpm', answer: 'Alcohol',             icon: 'alert',    note: 'Per drink above your average. 2026 wearables study (n=20,968; 5.1M person-days). Effect persists overnight.', cls: 'warn' },
      { label: 'Biggest myth',          stat: '±0 bpm',   answer: 'Vitamin D',           icon: 'ghost',    note: 'BEST-D: a year-long, dose-response RCT showed zero RHR effect at any dose. Heavily marketed, no signal.',     cls: 'myth' }
    ];
  }

  _flatModifiable() {
    const out = [];
    out.push(...this._factorsNutrition.map(f => ({ ...f, category: 'nutrition' })));
    out.push(...this._factorsSupplements.map(f => ({ ...f, category: 'supplements' })));
    out.push(...this._factorsExercise.map(f => ({ ...f, category: 'exercise' })));
    out.push(...this._factorsEnvironment.map(f => ({ ...f, category: 'environment' })));
    return out;
  }

  _heroStats() {
    const all = this._flatModifiable();
    return {
      total:    all.length + this._factorsDemographics.length,
      lowers:   all.filter(f => f.direction === 'positive').length,
      raisers:  all.filter(f => f.direction === 'negative').length,
      strong:   all.filter(f => f.evidence === 'strong').length
    };
  }

  _dirClass(dir) {
    return dir === 'positive' ? 'pos' : dir === 'negative' ? 'neg' : dir === 'mixed' ? 'mix' : 'neu';
  }

  _icon(name) {
    const icons = {
      salad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1"/><path d="m13 12 4-4"/></svg>',
      pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 1.5 3 3L5.3 12.7a4.24 4.24 0 0 1-6-6L7.5 4.5l3-3z"/><path d="m9 9 6.4-6.4a4.24 4.24 0 0 1 6 6L15 15"/><line x1="14.5" y1="13.5" x2="10.5" y2="9.5"/></svg>',
      dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',
      wind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>',
      users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>',
      trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
      droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/></svg>',
      alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
      ghost: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>',
      chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>',
      arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>',
      arrowLeftRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
    };
    return icons[name] || icons.heart;
  }

  _evidenceConfig(ev) {
    const map = {
      strong:   { label: 'Strong',   color: '#16A34A', bg: 'rgba(34,197,94,0.15)' },
      moderate: { label: 'Moderate', color: '#D97706', bg: 'rgba(251,191,36,0.15)' },
      emerging: { label: 'Emerging', color: '#6366F1', bg: 'rgba(99,102,241,0.15)' },
      weak:     { label: 'Weak',     color: '#94A3B8', bg: 'rgba(148,163,184,0.15)' }
    };
    return map[ev] || map.moderate;
  }

  _effectSizeText(f) {
    if (f.effectSize === null || f.effectSize === undefined) {
      // Documented null findings (variable direction with no number) are an explicit "no effect" result —
      // not a missing data point. Make that distinction visible.
      if (f.direction === 'variable') return { text: '±0 bpm', cls: 'zero' };
      if (f.direction === 'mixed')    return { text: 'Mixed',  cls: 'mix' };
      return { text: 'Directional', cls: 'na' };
    }
    if (f.direction === 'positive') return { text: `−${f.effectSize} bpm`, cls: 'pos' };
    if (f.direction === 'negative') return { text: `+${f.effectSize} bpm`, cls: 'neg' };
    if (f.direction === 'variable' && f.effectSize === 0) return { text: '±0 bpm', cls: 'zero' };
    return { text: `${f.effectSize} bpm`, cls: 'neu' };
  }

  _renderEvidenceSection() {
    return `
      <section class="evidence-section" aria-labelledby="evidence-title">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('arrowDown')}</span>The evidence</span>
            <h2 class="section-h2" id="evidence-title">What the <em>evidence</em> actually says.</h2>
            <p class="section-lede">Every modifiable factor with a clean numeric effect size, sorted by magnitude. Tap any bar to jump to its full source and mechanism below.</p>
          </div>
          ${this._renderImpactChart()}
        </div>
      </section>`;
  }

  _renderImpactChart() {
    // Pulls every quantified factor (effectSize !== null), normalises sign by direction,
    // and renders a single horizontal-bar chart centered on a 0-line.
    const flat = this._flatModifiable().filter(f => f.effectSize !== null && f.effectSize !== undefined);
    const signed = flat.map(f => {
      const sign = f.direction === 'positive' ? -1 : f.direction === 'negative' ? 1 : 0;
      return { ...f, signedBpm: sign * Math.abs(f.effectSize) };
    });
    signed.sort((a, b) => Math.abs(b.signedBpm) - Math.abs(a.signedBpm));

    const max = Math.max(...signed.map(f => Math.abs(f.signedBpm)), 1);
    // Clean tick scale — round up to next whole bpm
    const domain = Math.ceil(max);
    const ticks = [-domain, -Math.round(domain/2), 0, Math.round(domain/2), domain];

    const rows = signed.map((f, i) => {
      const v = f.signedBpm;
      const pct = (Math.abs(v) / domain) * 50; // 50% = one half of the chart
      const isLowers = v < 0;
      const isRaises = v > 0;
      return `
        <div class="imp-row" style="--delay:${i * 30}ms">
          <button class="imp-label" data-fact-jump="${f.key}" aria-label="Jump to ${f.name}">
            ${f.name}
          </button>
          <div class="imp-track">
            <span class="imp-axis" aria-hidden="true"></span>
            ${isLowers ? `<span class="imp-bar lowers" style="right:50%;width:${pct}%"></span>` : ''}
            ${isRaises ? `<span class="imp-bar raises" style="left:50%;width:${pct}%"></span>` : ''}
          </div>
          <div class="imp-val ${isLowers ? 'pos' : isRaises ? 'neg' : 'zero'}">
            ${isLowers ? `−${Math.abs(v)}` : isRaises ? `+${v}` : '±0'} bpm
          </div>
        </div>`;
    }).join('');

    const tickRow = ticks.map(t => {
      const pct = ((t + domain) / (domain * 2)) * 100;
      return `<span class="imp-tick ${t === 0 ? 'zero' : ''}" style="left:${pct}%">${t > 0 ? '+' : ''}${t}</span>`;
    }).join('');

    return `
      <div class="impact-chart">
        <div class="imp-head">
          <div>
            <span class="imp-eyebrow">Top movers</span>
            <h3 class="imp-title">By measured bpm impact</h3>
            <p class="imp-sub">Every modifiable factor with a clean numeric effect size from a meta-analysis or RCT — sorted by magnitude.</p>
          </div>
          <div class="imp-meta">${signed.length} quantified</div>
        </div>
        <div class="imp-legend">
          <span class="imp-legend-l"><span class="sw lowers"></span>Lowers RHR</span>
          <span class="imp-legend-r">Raises RHR<span class="sw raises"></span></span>
        </div>
        <div class="imp-chart">
          ${rows}
          <div class="imp-scale-spacer"></div>
          <div class="imp-scale">${tickRow}</div>
          <div class="imp-scale-spacer"></div>
        </div>
        <p class="imp-note">Bars show absolute bpm change reported in the strongest available study. The 16 directional-only factors (no clean numeric magnitude) appear in the full list below.</p>
      </div>`;
  }

  _renderSortableFactorsSection() {
    const flat = this._flatModifiable();
    const picked = this._catFilter;
    const meta = this._categoryMeta;

    const tiles = Object.entries(meta).map(([k, m]) => {
      const count = flat.filter(f => f.category === k).length;
      const isActive = picked === k;
      return `
        <button class="picker-tile ${isActive ? 'active' : ''}" data-factors-cat="${k}" aria-pressed="${isActive}">
          <span class="picker-tile-name">${m.label}</span>
          <span class="picker-tile-count">${count}</span>
        </button>`;
    }).join('');

    let panel = '';
    if (picked) {
      panel = `
        <div class="picker-panel">
          <div class="picker-panel-head">
            <h3 class="picker-panel-title">${meta[picked].label} factors<span class="picker-panel-meta">${flat.filter(f => f.category === picked).length} factor${flat.filter(f => f.category === picked).length === 1 ? '' : 's'}</span></h3>
          </div>
          ${this._renderSortBar()}
          ${this._renderFactorList()}
        </div>`;
    } else {
      panel = `
        <div class="picker-empty">
          <span class="picker-empty-icon" aria-hidden="true">${this._icon('arrowDown')}</span>
          <p>Tap a category above to see its factors with sources, mechanisms, and dosing.</p>
        </div>`;
    }

    return `
      <section class="factors-section" aria-labelledby="factors-title">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('arrowRight')}</span>Every factor, sortable</span>
            <h2 class="section-h2" id="factors-title">All ${flat.length} <em>modifiable</em> factors.</h2>
            <p class="section-lede">Pick a category to drill in. Each factor expands with the plain-English explanation, mechanism, dosage, and the primary source.</p>
          </div>
          <div class="picker-tiles">${tiles}</div>
          ${panel}
        </div>
      </section>`;
  }

  _renderSortBar() {
    const opts = [
      { k: 'default',   l: 'Default' },
      { k: 'evidence',  l: 'Evidence' },
      { k: 'direction', l: 'Direction' },
      { k: 'impact',    l: 'Impact' }
    ];
    const total = this._flatModifiable().length;
    const shownCount = this._catFilter
      ? this._flatModifiable().filter(f => f.category === this._catFilter).length
      : total;
    const meta = this._categoryMeta[this._catFilter];
    const countHtml = this._catFilter
      ? `<span class="list-result-count">Showing <strong>${shownCount}</strong> of ${total} · ${meta ? meta.label : ''}</span>`
      : `<span class="list-result-count"><strong>${total}</strong> modifiable factors</span>`;
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

  _renderFactorList() {
    const flat = this._flatModifiable();
    const meta = this._categoryMeta;
    let shown = flat.filter(f => !this._catFilter || f.category === this._catFilter);
    if (this._listSort === 'evidence') {
      const r = { strong: 0, moderate: 1, emerging: 2, weak: 3 };
      shown = shown.slice().sort((a, b) => (r[a.evidence] ?? 9) - (r[b.evidence] ?? 9));
    } else if (this._listSort === 'direction') {
      const r = { positive: 0, mixed: 1, variable: 2, negative: 3 };
      shown = shown.slice().sort((a, b) => (r[a.direction] ?? 9) - (r[b.direction] ?? 9));
    } else if (this._listSort === 'impact') {
      shown = shown.slice().sort((a, b) => {
        const av = (a.effectSize === null || a.effectSize === undefined) ? -Infinity : Math.abs(a.effectSize);
        const bv = (b.effectSize === null || b.effectSize === undefined) ? -Infinity : Math.abs(b.effectSize);
        return bv - av;
      });
    }

    const dirLabel = (d) => d === 'positive' ? '↓ Lowers' : d === 'negative' ? '↑ Raises' : d === 'mixed' ? '↕ Mixed' : '→ Variable';

    const cards = shown.map((f, i) => {
      const isExp = this._listExpandedKey === f.key;
      const hue = (meta[f.category] || {}).hue || '#94A3B8';
      const ev = this._evidenceConfig(f.evidence);
      const eff = this._effectSizeText(f);
      return `
        <article class="fact-card ${this._dirClass(f.direction)} ${isExp ? 'expanded' : ''}" data-fact-key="${f.key}">
          <button class="fact-head" aria-expanded="${isExp}">
            <span class="fact-meta">
              <span class="fact-cat" data-cat="${f.category}">${(meta[f.category] || {}).label || ''}</span>
              <span class="fact-name">${f.name}</span>
              <span class="fact-effect">${f.effect} <span class="fact-ev-inline">· ${ev.label} evidence</span></span>
            </span>
            <span class="fact-bpm ${eff.cls}" aria-label="Effect size: ${eff.text}">${eff.text}</span>
            <span class="fact-chev" aria-hidden="true">${this._icon('chevDown')}</span>
          </button>
          ${isExp ? `
            <div class="fact-body">
              <div class="fact-body-row">
                <span class="lbl">Plain English</span>
                <p>${f.whatThisMeans}</p>
              </div>
              <div class="fact-body-row">
                <span class="lbl">Mechanism</span>
                <p>${f.mechanism}</p>
              </div>
              <div class="fact-body-row">
                <span class="lbl">Key finding</span>
                <p>${f.keyFinding}</p>
              </div>
              <div class="fact-body-row">
                <span class="lbl">What to do</span>
                <p>${f.dosage || '—'}</p>
              </div>
              <div class="fact-body-row">
                <span class="lbl">Source</span>
                <p><a href="${f.source.url}" target="_blank" rel="noopener" class="source-link">${f.source.label} ${this._icon('externalLink')}</a></p>
              </div>
            </div>` : ''}
        </article>`;
    }).join('');

    return `<div class="fact-list">${cards || '<p class="dash-empty">No factors match this filter.</p>'}</div>`;
  }

  _renderBaseCard(f) {
    const isExp = this._baselineExpandedKey === f.key;
    const ev = this._evidenceConfig(f.evidence);
    return `
      <article class="base-card ${isExp ? 'expanded' : ''}" data-base-key="${f.key}">
        <button class="base-head" aria-expanded="${isExp}">
          <span class="base-meta">
            <span class="base-name">${f.name}</span>
            <span class="base-effect">${f.effect}</span>
          </span>
          <span class="base-badges">
            <span class="base-ev" style="color:${ev.color};background:${ev.bg}">${ev.label}</span>
          </span>
          <span class="base-chev" aria-hidden="true">${this._icon('chevDown')}</span>
        </button>
        ${isExp ? `
          <div class="base-body">
            <div class="base-body-row"><span class="lbl">Plain English</span><p>${f.whatThisMeans}</p></div>
            <div class="base-body-row"><span class="lbl">Mechanism</span><p>${f.mechanism}</p></div>
            <div class="base-body-row"><span class="lbl">Key finding</span><p>${f.keyFinding}</p></div>
            <div class="base-body-row"><span class="lbl">Source</span><p><a href="${f.source.url}" target="_blank" rel="noopener" class="source-link">${f.source.label} ${this._icon('externalLink')}</a></p></div>
          </div>` : ''}
      </article>`;
  }

  _renderBaselineSection() {
    const cards = this._factorsDemographics.map(f => this._renderBaseCard(f)).join('');
    return `
      <section class="baseline-section" aria-labelledby="baseline-title">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('users')}</span>Your baseline</span>
            <h2 class="section-h2" id="baseline-title">What you can't change — <em>but should know</em></h2>
            <p class="section-lede">${this._factorsDemographics.length} demographic and physiological factors that set your starting RHR. Tap any factor for the full study and mechanism.</p>
          </div>
          <div class="base-grid">${cards}</div>
        </div>
      </section>`;
  }

  _renderMythsSection() {
    const groups = ['Nutrition', 'Supplements', 'Exercise', 'Environment', 'Demographics'];
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
            <span class="myth-badge">No evidence</span>
          </div>
          <p class="myth-why">${m.why}</p>
        </article>`).join('');
      panel = `
        <div class="picker-panel">
          <div class="picker-panel-head">
            <h3 class="picker-panel-title">${picked} myths<span class="picker-panel-meta">${items.length} debunked</span></h3>
          </div>
          <div class="myth-grid">${cards}</div>
        </div>`;
    } else {
      panel = `
        <div class="picker-empty">
          <span class="picker-empty-icon" aria-hidden="true">${this._icon('ghost')}</span>
          <p>Tap a category above to see the myths debunked.</p>
        </div>`;
    }

    return `
      <section class="myths-section" aria-labelledby="myths-title">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow amber"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('ghost')}</span>Common Myths</span>
            <h2 class="section-h2" id="myths-title">What <em>doesn't</em> actually work (${total} debunked)</h2>
            <p class="section-lede">Popular claims that don't survive an RHR-specific evidence review. Pick a category to see what got cut.</p>
          </div>
          <div class="picker-tiles">${tiles}</div>
          ${panel}
        </div>
      </section>`;
  }

  _renderTopPicks() {
    return this._topPicks.map((p, i) => `
        <article class="pick-card ${p.cls || ''} animate-on-scroll" style="--delay:${i * 70}ms">
          <span class="pick-icon" aria-hidden="true">${this._icon(p.icon)}</span>
          <span class="pick-label">${p.label}</span>
          <div class="pick-stat">${p.stat}</div>
          <h3 class="pick-answer">${p.answer}</h3>
          <p class="pick-note">${p.note}</p>
        </article>`).join('');
  }

  _renderHeroMeta() {
    const s = this._heroStats();
    return `
      <div class="hero-meta">
        <div class="hero-cell"><span class="hero-num">${s.total}</span><span class="hero-lbl">Factors tracked</span></div>
        <div class="hero-cell"><span class="hero-num hero-num--pos">${s.lowers}</span><span class="hero-lbl">Lower your RHR</span></div>
        <div class="hero-cell"><span class="hero-num hero-num--neg">${s.raisers}</span><span class="hero-lbl">Raise your RHR</span></div>
        <div class="hero-cell"><span class="hero-num">${s.strong}</span><span class="hero-lbl">Strong-evidence</span></div>
      </div>`;
  }

  _heartWaveSvg() {
    return `
      <svg class="hero-wave" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="kygo-rhr-wave-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#22C55E" stop-opacity="0.10"/>
            <stop offset="1" stop-color="#22C55E" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="M0 130 L 80 130 L 95 130 L 105 100 L 115 165 L 130 90 L 145 145 L 160 130 L 240 130 L 255 130 L 265 105 L 275 160 L 290 95 L 305 150 L 320 130 L 400 130 L 415 130 L 425 102 L 435 168 L 450 92 L 465 148 L 480 130 L 600 130" stroke="#22C55E" stroke-width="2" fill="none" opacity="0.75"/>
        <path d="M0 130 L 600 130 L 600 240 L 0 240 Z" fill="url(#kygo-rhr-wave-g)"/>
        <g stroke="rgba(30,41,59,0.07)" stroke-width="1">
          <line x1="0" y1="40" x2="600" y2="40"/>
          <line x1="0" y1="200" x2="600" y2="200"/>
        </g>
      </svg>`;
  }

  _renderSources() {
    const groups = {
      'Nutrition': [
        { label: 'Alexander 2022 — Factors affecting RHR in healthy humans (Front Physiol)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/' },
        { label: 'Palatini 2008 — RHR as a modifiable prognostic indicator (Drugs)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2787005/' },
        { label: 'Hidayat 2018 — Omega-3 & heart rate meta-analysis of 51 RCTs (Eur J Clin Nutr)', url: 'https://www.nature.com/articles/s41430-017-0052-3' },
        { label: '2023 meta-analysis — Coffee consumption & heart rate (6 RCTs)', url: 'https://pubmed.ncbi.nlm.nih.gov/37647856/' },
        { label: 'Mesas 2014 — Caffeine, BP & HR review (Nutr Hosp)', url: 'https://pubmed.ncbi.nlm.nih.gov/24203773/' },
        { label: '2026 wearables study — Alcohol effects on HR (n=20,968; 5.1M person-days)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12970902/' },
        { label: 'Look AHEAD 2012 — Lifestyle intervention & HR recovery (n=4,503)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3512322/' },
        { label: 'Wasmund 2011 — Bariatric surgery & HR recovery (Heart Rhythm)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3019138/' },
        { label: 'García-López 2014 — Mediterranean diet & HR (SUN cohort, n=15,863)', url: 'https://pubmed.ncbi.nlm.nih.gov/23144202/' },
        { label: 'Graudal 2016 — Reduced sodium intake & HR (63 RCTs)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4805644/' }
      ],
      'Supplements': [
        { label: 'Hidayat 2018 — Omega-3 supplementation & heart rate (51 RCTs)', url: 'https://www.nature.com/articles/s41430-017-0052-3' },
        { label: 'Nutrients 2022 — Oat bran fiber & HR in hypertension RCT', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9370281/' },
        { label: 'Chromium MetS RCT — RHR reduction in metabolic syndrome', url: 'https://pubmed.ncbi.nlm.nih.gov/28856601/' },
        { label: 'Gijsbers 2016 — Potassium supplementation & HR meta-analysis (22 RCTs)', url: 'https://pubmed.ncbi.nlm.nih.gov/27289164/' },
        { label: 'BEST-D 2017 — Vitamin D & cardiovascular function (12 mo RCT)', url: 'https://www.ahajournals.org/doi/10.1161/JAHA.117.005707' },
        { label: 'Rector 1996 — L-arginine in heart failure RCT (Circulation)', url: 'https://www.ahajournals.org/doi/10.1161/01.CIR.93.12.2135' },
        { label: 'Tobeiha 2022 — Melatonin & cardiovascular disease review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9251346/' }
      ],
      'Exercise': [
        { label: 'Reimers 2018 — Exercise & RHR meta-analysis of 191 trials (J Clin Med)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/' },
        { label: 'Huang 2005 — Endurance training & RHR in older adults meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/16118586/' },
        { label: 'Edwards 2023 — HIIT & cardiometabolic health (97 RCTs, n=3,399)', url: 'https://pubmed.ncbi.nlm.nih.gov/37204620/' },
        { label: 'Cramer 2014 — Yoga & cardiovascular disease risk meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/24636547/' },
        { label: 'Gonzales 2023 — RHR as biomarker of fitness, Fenland Study (n=10,865)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10174582/' },
        { label: 'López-Valenciano 2019 — Isometric resistance training meta-analysis (16 trials)', url: 'https://pubmed.ncbi.nlm.nih.gov/30624369/' },
        { label: 'Hallman 2019 — Sitting & autonomic cardiac modulation (n=490)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6406480/' },
        { label: 'Bosquet 2008 — Heart rate as overreaching marker, systematic review', url: 'https://pubmed.ncbi.nlm.nih.gov/18308872/' }
      ],
      'Environment': [
        { label: 'Madaniyazi 2016 — Outdoor temperature, HR & BP (Kailuan cohort, n=47,591)', url: 'https://www.nature.com/articles/srep21003' },
        { label: 'Bärtsch & Gibbs 2007 — Effect of altitude on heart and lungs (Circulation)', url: 'https://www.ahajournals.org/doi/10.1161/circulationaha.106.650796' },
        { label: '2025 — Air pollution & RHR in COPD (54,487 hourly observations)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11796267/' },
        { label: 'Griefahn 2008 — Traffic noise & autonomic arousals during sleep', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2279756/' },
        { label: 'Boudreau 2012 — Circadian rhythm in HRV & sympathovagal response', url: 'https://pubmed.ncbi.nlm.nih.gov/22734576/' },
        { label: 'PLOS ONE 2020 — Daily RHR variability across seasons (n=92,457)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7001906/' }
      ],
      'Demographics': [
        { label: 'Avram 2019 — Real-world heart rate norms, Health eHeart (n=66,788)', url: 'https://www.nature.com/articles/s41746-019-0134-9' },
        { label: 'Gillum 1988 — Epidemiology of RHR in NHANES national sample', url: 'https://pubmed.ncbi.nlm.nih.gov/2969182/' },
        { label: 'Jensen 2018 — Heritability of RHR in Danish twins (n=4,282)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5831408/' },
        { label: '2023 GWAS — RHR variants, Nature Communications (n=835,465)', url: 'https://www.nature.com/articles/s41467-023-39521-2' },
        { label: '2023 — Higher HR & abnormal BMI in J-shape pattern', url: 'https://pubmed.ncbi.nlm.nih.gov/37249904/' },
        { label: 'Sanghavi & Rutherford 2014 — Cardiovascular physiology of pregnancy', url: 'https://www.ahajournals.org/doi/10.1161/circulationaha.114.009029' },
        { label: 'Premenopausal women study — Cardiovascular function across menstrual cycle (n=49)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9572726/' }
      ]
    };
    const totalCount = Object.values(groups).reduce((s, g) => s + g.length, 0);
    return `<div class="src-accordion">
      <div class="src-count-badge">${totalCount} sources cited</div>
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
    </div>`;
  }

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const iosUrl = 'https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="header">
        <div class="header-inner">
          <a href="https://kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" />
            RHR Factors
          </a>
          <a href="https://kygo.app" class="header-link" target="_blank" rel="noopener">
            Get App ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <!-- 1. Hero (white) -->
      <section class="hero section-bg-white">
        <div class="container hero-inner">
          <div class="hero-kicker animate-on-scroll"><span class="hero-dot" aria-hidden="true"></span>37 Factors • 4 Categories • All Peer-Reviewed</div>
          <h1 class="hero-title animate-on-scroll">What <em>Moves</em> Your Resting Heart Rate?</h1>
          <p class="hero-sub animate-on-scroll">Every claim backed by RCTs and meta-analyses. <strong>No blog science.</strong> See what actually lowers, raises, or doesn't change your RHR.</p>
          <div class="animate-on-scroll">${this._renderHeroMeta()}</div>
          ${this._heartWaveSvg()}
        </div>
      </section>

      <!-- 2. Evidence chart (gray) -->
      <div class="section-bg-gray">${this._renderEvidenceSection()}</div>

      <!-- 3. App CTA "See What's Influencing Your RHR" (white) -->
      <section class="blog-cta-section section-bg-white">
        <div class="container">
          <div class="blog-cta animate-on-scroll">
            <div class="blog-cta-glow"></div>
            <div class="blog-cta-content">
              <div class="blog-cta-badge"><span class="pulse-dot"></span>Free Forever Plan</div>
              <h2>See What's Influencing <span class="highlight">Your RHR</span></h2>
              <p>Kygo Health connects your wearable data with nutrition tracking to pinpoint personal correlations between what you eat, how you move, and your resting heart rate.</p>
              <div class="blog-cta-buttons">
                <a href="${iosUrl}" class="blog-cta-btn" data-track-position="article-cta" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </a>
                <a href="https://kygo.app/android" target="_blank" rel="noopener" class="cta-android" data-action="android-download">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                  Download for Android
                </a>
              </div>
              <div class="blog-cta-tags">
                <span class="blog-cta-tags-label">Works with</span>
                <div class="blog-cta-tags-logos">
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
      </section>

      <!-- 4. Baseline "What you can't change" — expanded by default (gray) -->
      <div class="section-bg-gray">${this._renderBaselineSection()}</div>

      <!-- 5. Blog CTA — Read the full article (white) -->
      <section class="article-section section-bg-white">
        <div class="container">
          <a href="https://www.kygo.app/post/resting-heart-rate-factors" class="article-card animate-on-scroll" target="_blank" rel="noopener">
            <span class="article-badge">Deep Dive</span>
            <div class="article-body">
              <span class="article-kicker">Read the full article</span>
              <h3 class="article-title">Resting Heart Rate Factors: 37 Inputs Ranked by Evidence <span class="article-year">(2026)</span></h3>
              <p class="article-desc">Every mechanism, dosage, and source in one long-form read.</p>
            </div>
            <span class="article-go" aria-hidden="true">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>

      <!-- 6. Every factor sortable — category picker (gray) -->
      <div class="section-bg-gray">${this._renderSortableFactorsSection()}</div>

      <!-- 7. Common Myths — category picker (white) -->
      <div class="section-bg-white">${this._renderMythsSection()}</div>

      <!-- 8. Top picks (gray) -->
      <section class="picks-section section-bg-gray" id="headlines">
        <div class="container">
          <div class="picks-card">
            <div class="picks-glow" aria-hidden="true"></div>
            <div class="picks-head animate-on-scroll">
              <span class="picks-eyebrow">Six headlines from the data</span>
              <h2 class="picks-title">If you only remember <em>six things</em>.</h2>
            </div>
            <div class="picks-grid">${this._renderTopPicks()}</div>
          </div>
        </div>
      </section>

      <!-- 9. Sources (white) -->
      <section class="sources-section section-bg-white">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Sources</h2>
          <p class="section-sub animate-on-scroll">All data sourced from peer-reviewed studies and meta-analyses.</p>
          <div class="sources-list animate-on-scroll">${this._renderSources()}</div>
        </div>
      </section>

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
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Always consult a qualified healthcare provider before starting any supplement, exercise program, or lifestyle change.</p>
          <p class="footer-copyright">Data sourced from peer-reviewed studies and meta-analyses. Last updated April 2026.</p>
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
      if (e.target.closest('.source-link, a[href]')) return;

      const srcToggle = e.target.closest('.src-group-toggle');
      if (srcToggle) {
        const group = srcToggle.closest('.src-group');
        if (group) {
          const isOpen = group.classList.toggle('open');
          srcToggle.setAttribute('aria-expanded', isOpen);
        }
        return;
      }

      const factorsTile = e.target.closest('[data-factors-cat]');
      if (factorsTile) {
        const k = factorsTile.dataset.factorsCat;
        // Toggle: same tile collapses, different tile switches
        this._catFilter = this._catFilter === k ? null : k;
        this._listExpandedKey = null;
        const sec = shadow.querySelector('.factors-section');
        if (sec) sec.outerHTML = this._renderSortableFactorsSection();
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

      const sortBtn = e.target.closest('.list-sort-btn');
      if (sortBtn) {
        this._listSort = sortBtn.dataset.sort;
        const sec = shadow.querySelector('.factors-section');
        if (sec) sec.outerHTML = this._renderSortableFactorsSection();
        return;
      }

      const baseHead = e.target.closest('.base-head');
      if (baseHead) {
        const card = baseHead.closest('[data-base-key]');
        if (card) {
          const k = card.dataset.baseKey;
          this._baselineExpandedKey = this._baselineExpandedKey === k ? null : k;
          const baseGrid = shadow.querySelector('.base-grid');
          if (baseGrid) {
            baseGrid.innerHTML = this._factorsDemographics.map(f => this._renderBaseCard(f)).join('');
          }
        }
        return;
      }

      const jumpBtn = e.target.closest('[data-fact-jump]');
      if (jumpBtn) {
        const k = jumpBtn.dataset.factJump;
        // Tap a chart label → open that factor's category, sort by impact, expand the card, scroll
        const f = this._flatModifiable().find(x => x.key === k);
        if (f) {
          this._catFilter = f.category;
          this._listSort = 'impact';
          this._listExpandedKey = k;
          const sec = shadow.querySelector('.factors-section');
          if (sec) sec.outerHTML = this._renderSortableFactorsSection();
          requestAnimationFrame(() => {
            const target = shadow.querySelector(`[data-fact-key="${k}"]`);
            if (target && target.scrollIntoView) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        }
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

  _injectStructuredData() {
    if (document.querySelector('script[data-kygo-rhr-factors-ld]')) return;
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'RHR Factor Explorer',
      'alternateName': 'Kygo Resting Heart Rate Factors Tool',
      'description': 'Explore 37 research-backed factors that affect resting heart rate — nutrition, supplements, exercise, environment, and demographics — every claim backed by RCTs and meta-analyses.',
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'url': 'https://www.kygo.app/tools/resting-heart-rate-factors',
      'datePublished': '2026-04-26',
      'dateModified': '2026-04-26',
      'softwareVersion': '1.0',
      'inLanguage': 'en',
      'isAccessibleForFree': true,
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
      'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
      'featureList': 'Explore 37 resting heart rate factors, sortable by effect size in bpm, evidence-graded across 4 modifiable categories plus 7 demographic baselines, peer-reviewed citations, debunked myths section',
      'keywords': 'what affects resting heart rate, how to lower resting heart rate, resting heart rate factors, RHR, omega-3 heart rate, alcohol heart rate, aerobic exercise RHR, HIIT resting heart rate, Mediterranean diet heart rate, vitamin D heart rate myth, fish oil RHR meta-analysis, sodium heart rate, weight loss heart rate, RHR by age, RHR pregnancy, RHR menstrual cycle'
    };

    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What affects resting heart rate the most?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Aerobic exercise has the largest single effect — sustained endurance training drops resting heart rate by about 8.4 bpm after 30+ weeks (Huang 2005 meta-analysis). HIIT delivers about 3.9 bpm in under 12 weeks (Edwards 2023 meta-analysis of 97 RCTs). Among modifiable factors, sustained cardio is the most powerful lever for lowering RHR.' }
        },
        {
          '@type': 'Question',
          'name': 'Does coffee raise resting heart rate?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Habitual daily coffee does not significantly change resting heart rate. A 2023 meta-analysis of 6 RCTs found a +0.4 bpm change that was not statistically significant. Acute high-dose caffeine (above 3 mg/kg) does raise HR transiently, but tolerance develops with regular consumption.' }
        },
        {
          '@type': 'Question',
          'name': 'What supplement actually lowers resting heart rate?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Omega-3 fish oil is the only supplement with strong, replicated RHR-specific evidence. The Hidayat 2018 meta-analysis of 51 RCTs found omega-3 supplementation lowered RHR by 1.6 bpm on average — and 2.5 bpm in people with starting RHR ≥69. Most other popular supplements (magnesium, CoQ10, ashwagandha for RHR, L-theanine, creatine) lack RHR-specific evidence.' }
        },
        {
          '@type': 'Question',
          'name': 'Does alcohol raise resting heart rate?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes — clearly and dose-dependently. A 2026 wearables study (n=20,968 adults, 5.1 million person-days) found each drink above your personal average raised overnight RHR by about 2.4 bpm in men and 2.8 bpm in women. The effect is the morning-after spike that wearables routinely capture.' }
        },
        {
          '@type': 'Question',
          'name': 'Does vitamin D lower resting heart rate?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'No. The BEST-D randomized controlled trial (n=305, 12 months) found vitamin D had zero effect on heart rate at any dose. Despite widespread cardiovascular marketing, vitamin D supplementation does not lower resting heart rate.' }
        }
      ]
    };

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Kygo Health', 'item': 'https://www.kygo.app' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
        { '@type': 'ListItem', 'position': 3, 'name': 'Resting Heart Rate Factors', 'item': 'https://www.kygo.app/tools/resting-heart-rate-factors' }
      ]
    };

    [ld, faq, breadcrumb].forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-kygo-rhr-factors-ld', '');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
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
        --green-light: rgba(34,197,94,0.1);
        --yellow: #FBBF24;
        --amber: #B45309;
        --red: #EF4444;
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
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: var(--delay, 0ms); }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      /* Keyboard focus — visible green ring on every interactive element */
      :focus { outline: none; }
      .picker-tile:focus-visible,
      .list-sort-btn:focus-visible,
      .fact-head:focus-visible,
      .base-head:focus-visible,
      .src-group-toggle:focus-visible,
      .header-link:focus-visible,
      .blog-cta-btn:focus-visible,
      .cta-android:focus-visible,
      .article-card:focus-visible,
      .source-link:focus-visible,
      .imp-label:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; }

      .header { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid var(--gray-200); }
      .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 16px; max-width: 1200px; margin: 0 auto; }
      .logo { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); text-decoration: none; white-space: nowrap; min-width: 0; line-height: 1.2; }
      .logo-img { height: 26px; width: auto; flex-shrink: 0; }
      .header-link { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: #fff; background: var(--green); padding: 7px 12px; border-radius: 50px; text-decoration: none; transition: background 0.2s; white-space: nowrap; flex-shrink: 0; line-height: 1; }
      .header-link:hover { background: var(--green-dark); }
      .header-link svg { width: 13px; height: 13px; }

      /* HERO */
      .hero { padding: 40px 0 28px; background: #fff; }
      .hero-inner { position: relative; }
      .hero-kicker { display: inline-flex; align-items: center; gap: 7px; font-size: 9.5px; font-weight: 700; color: var(--green-dark); background: var(--green-light); padding: 6px 11px; border-radius: 9999px; letter-spacing: 0.4px; text-transform: uppercase; margin-bottom: 20px; max-width: 100%; line-height: 1.4; text-align: left; }
      .hero-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 0 rgba(34,197,94,0.6); animation: pulse 2.2s infinite; flex-shrink: 0; }
      @media (min-width: 480px) { .hero-kicker { font-size: 10.5px; white-space: nowrap; } }
      @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.6);} 70%{box-shadow:0 0 0 8px rgba(34,197,94,0);} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0);} }
      .hero-title { font-size: clamp(32px, 8.5vw, 76px); line-height: 1.02; letter-spacing: -0.03em; font-weight: 600; margin: 0; color: var(--dark); max-width: 14ch; }
      .hero-title em { font-style: normal; color: var(--green); font-family: inherit; }
      .hero-sub { margin: 20px 0 0; max-width: 54ch; font-size: clamp(15px, 2.2vw, 19px); line-height: 1.5; color: var(--gray-600); }
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

      .section-title { font-size: clamp(24px, 6vw, 36px); text-align: center; margin-bottom: 8px; }
      .section-sub { text-align: center; color: var(--gray-600); font-size: 15px; margin-bottom: 32px; max-width: 560px; margin-left: auto; margin-right: auto; }

      /* SECTION BACKGROUNDS — alternating white/gray rhythm */
      .section-bg-white { background: #fff; }
      .section-bg-gray  { background: var(--gray-100); }
      .section-bg-white > section,
      .section-bg-gray  > section { background: transparent; }

      /* Shared section header used by Evidence, Baseline, Sortable Factors, Myths */
      .section-header { margin-bottom: 24px; max-width: 720px; }
      .section-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 10.5px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--green-dark); margin-bottom: 12px; }
      .section-eyebrow.amber { color: var(--amber); }
      .section-eyebrow-icon { width: 22px; height: 22px; border-radius: 7px; background: var(--green-light); color: var(--green-dark); display: inline-flex; align-items: center; justify-content: center; }
      .section-eyebrow.amber .section-eyebrow-icon { background: rgba(180,83,9,0.10); color: var(--amber); }
      .section-eyebrow-icon svg { width: 13px; height: 13px; }
      .section-h2 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: clamp(26px, 5.5vw, 40px); letter-spacing: -0.02em; line-height: 1.08; margin: 0 0 12px; color: var(--dark); }
      .section-h2 em { font-style: normal; color: var(--green); font-family: inherit; }
      .factors-section, .baseline-section, .myths-section, .evidence-section { padding: 48px 0 56px; }

      /* PICKER TILES — used by Sortable Factors and Myths sections */
      .picker-tiles { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 16px; }
      .picker-tile { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 14px 16px; min-height: 56px; background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; font-family: inherit; cursor: pointer; transition: border-color .15s, transform .15s, background .15s, box-shadow .15s; text-align: left; color: var(--dark); }
      .picker-tile:hover { border-color: var(--gray-300); transform: translateY(-1px); }
      .picker-tile.active { background: var(--dark); color: #fff; border-color: var(--dark); box-shadow: 0 6px 18px rgba(15,23,42,0.12); }
      .picker-tile-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14.5px; letter-spacing: -0.005em; line-height: 1.15; }
      .picker-tile-count { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; color: var(--gray-600); background: var(--gray-100); border-radius: 9999px; padding: 4px 10px; min-width: 32px; text-align: center; font-feature-settings: "tnum" 1; }
      .picker-tile.active .picker-tile-count { background: rgba(255,255,255,0.16); color: #fff; }

      /* PICKER PANEL — the reveal area when a tile is selected */
      .picker-panel { background: #fff; border: 1px solid var(--gray-200); border-radius: 18px; padding: 18px; box-shadow: 0 1px 0 rgba(15,23,42,0.03); animation: panelIn .35s cubic-bezier(0.16, 1, 0.3, 1); }
      @keyframes panelIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      .picker-panel-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--gray-100); }
      .picker-panel-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); margin: 0; letter-spacing: -0.01em; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
      .picker-panel-meta { font-size: 11.5px; font-weight: 600; color: var(--gray-400); letter-spacing: 0.5px; text-transform: uppercase; }

      /* PICKER EMPTY — shown before any tile is selected */
      .picker-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 32px 20px; background: #fff; border: 1px dashed var(--gray-200); border-radius: 18px; text-align: center; color: var(--gray-600); font-size: 13.5px; line-height: 1.5; }
      .picker-empty-icon { width: 32px; height: 32px; border-radius: 9px; background: var(--gray-100); color: var(--gray-400); display: inline-flex; align-items: center; justify-content: center; }
      .picker-empty-icon svg { width: 18px; height: 18px; }
      .picker-empty p { margin: 0; max-width: 36ch; }

      /* BASELINE (Demographics) — content only, the section bg comes from .section-bg-* */
      .base-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
      .base-card { background: #fff; border: 1px solid var(--gray-200); border-radius: 12px; overflow: hidden; transition: border-color .15s, box-shadow .15s; }
      .base-card:hover { border-color: var(--gray-300); }
      .base-card.expanded { border-color: var(--green); box-shadow: 0 4px 14px rgba(34,197,94,0.08); }
      .base-head { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 10px; width: 100%; padding: 12px 14px; background: transparent; border: 0; cursor: pointer; font-family: inherit; text-align: left; }
      .base-head:hover { background: var(--gray-50); }
      .base-meta { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .base-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14px; color: var(--dark); line-height: 1.2; }
      .base-effect { font-size: 12px; color: var(--gray-600); line-height: 1.35; }
      .base-badges { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
      .base-ev { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; letter-spacing: 0.3px; }
      .base-chev { width: 18px; height: 18px; color: var(--gray-400); display: inline-flex; align-items: center; transition: transform .2s; flex-shrink: 0; }
      .base-chev svg { width: 16px; height: 16px; }
      .base-card.expanded .base-chev { transform: rotate(180deg); color: var(--green-dark); }
      .base-body { padding: 6px 14px 14px; border-top: 1px dashed var(--gray-200); background: #fafafa; }
      .base-body-row { padding-top: 10px; }
      .base-body-row .lbl { font-size: 10px; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); font-weight: 600; display: block; margin-bottom: 3px; }
      .base-body-row p { margin: 0; font-size: 13px; color: var(--gray-600); line-height: 1.55; }

      .dash-empty { padding: 24px 18px; text-align: center; color: var(--gray-400); font-size: 14px; background: #fff; border: 1px dashed var(--gray-200); border-radius: 16px; }

      /* IMPACT CHART — the leaderboard view */
      .impact-chart { background: #fff; border: 1px solid var(--gray-200); border-radius: 18px; padding: 22px 18px 24px; margin-bottom: 36px; box-shadow: 0 1px 0 rgba(15,23,42,0.03); }
      .imp-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
      .imp-eyebrow { display: block; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--green-dark); margin-bottom: 4px; }
      .imp-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 19px; color: var(--dark); margin: 0 0 4px; letter-spacing: -0.01em; line-height: 1.2; }
      .imp-sub { font-size: 13px; color: var(--gray-600); margin: 0; line-height: 1.5; max-width: 56ch; }
      .imp-meta { font-size: 11.5px; color: var(--gray-400); font-weight: 600; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.6px; }
      .imp-legend { display: flex; justify-content: space-between; align-items: center; font-size: 10px; text-transform: uppercase; letter-spacing: 0.7px; font-weight: 700; color: var(--gray-400); margin: 4px 0 14px; }
      .imp-legend-l { color: var(--green-dark); display: inline-flex; align-items: center; gap: 6px; }
      .imp-legend-r { color: var(--dark); display: inline-flex; align-items: center; gap: 6px; }
      .imp-legend .sw { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }
      .imp-legend .sw.lowers { background: linear-gradient(-90deg, #16A34A, #4ADE80); }
      .imp-legend .sw.raises { background: linear-gradient(90deg, #1E293B, #475569); }
      .imp-chart { display: grid; grid-template-columns: 1fr; row-gap: 12px; font-feature-settings: "tnum" 1; }
      .imp-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-rows: auto auto; column-gap: 10px; row-gap: 4px; }
      .imp-label { grid-column: 1; grid-row: 1; padding: 0; background: 0; border: 0; cursor: pointer; text-align: left; font-family: inherit; font-size: 12.5px; font-weight: 600; color: var(--dark); line-height: 1.25; min-width: 0; overflow-wrap: anywhere; padding-right: 8px; }
      .imp-label:hover { color: var(--green-dark); }
      .imp-val { grid-column: 2; grid-row: 1; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13.5px; letter-spacing: -0.01em; text-align: right; white-space: nowrap; }
      .imp-val.pos { color: var(--green-dark); }
      .imp-val.neg { color: var(--dark); }
      .imp-val.zero { color: var(--gray-400); }
      .imp-track { grid-column: 1 / -1; grid-row: 2; position: relative; height: 22px; }
      .imp-axis { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: var(--gray-200); }
      .imp-bar { position: absolute; top: 5px; bottom: 5px; border-radius: 4px; animation: impGrow .7s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: var(--delay, 0ms); }
      .imp-bar.lowers { background: linear-gradient(-90deg, #16A34A, #4ADE80); }
      .imp-bar.raises { background: linear-gradient(90deg, #1E293B, #475569); }
      @keyframes impGrow { from { width: 0 !important; } }
      .imp-scale-spacer { display: none; }
      .imp-scale { grid-column: 1 / -1; position: relative; height: 26px; margin-top: 6px; border-top: 1px solid var(--gray-200); color: var(--gray-400); font-size: 10.5px; font-feature-settings: "tnum" 1; }
      .imp-tick { position: absolute; top: 6px; transform: translateX(-50%); padding-top: 2px; white-space: nowrap; }
      .imp-tick::before { content: ''; position: absolute; left: 50%; top: -1px; height: 4px; width: 1px; background: var(--gray-300); transform: translateX(-50%); }
      .imp-tick.zero { font-weight: 700; color: var(--dark); }
      .imp-note { margin: 14px 0 0; font-size: 11.5px; color: var(--gray-400); line-height: 1.5; }

      /* Sort bar — mobile: label on its own row, buttons fill full width */
      .list-toolbar { display: flex; flex-direction: column; align-items: stretch; gap: 8px; margin-bottom: 12px; }
      .list-toolbar-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .list-sort-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.7px; color: var(--gray-400); font-weight: 600; }
      .list-result-count { font-size: 12px; font-weight: 500; color: var(--gray-600); font-feature-settings: "tnum" 1; }
      .list-result-count strong { color: var(--dark); font-weight: 700; }
      .list-sort-btns { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
      .list-sort-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 38px; padding: 8px 10px; border-radius: 9999px; border: 1px solid var(--gray-200); background: #fff; color: var(--gray-600); font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .15s; }
      .list-sort-btn:hover { border-color: var(--gray-400); }
      .list-sort-btn.active { background: var(--dark); color: #fff; border-color: var(--dark); }

      /* Factor cards — bpm value carries the visual weight on the right */
      .fact-list { display: grid; grid-template-columns: 1fr; gap: 8px; }
      .fact-card { background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; overflow: hidden; transition: border-color .15s, box-shadow .15s; }
      .fact-card:hover { border-color: var(--gray-300); }
      .fact-card.expanded { box-shadow: 0 6px 18px rgba(15,23,42,0.06); border-color: var(--gray-300); }
      .fact-head { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 12px; width: 100%; padding: 14px 16px; background: transparent; border: 0; cursor: pointer; font-family: inherit; text-align: left; }
      .fact-head:hover { background: var(--gray-50); }
      .fact-meta { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .fact-cat { font-family: 'Space Grotesk', sans-serif; font-size: 9.5px; font-weight: 700; letter-spacing: 0.9px; text-transform: uppercase; color: var(--gray-400); line-height: 1; margin-bottom: 4px; }
      .fact-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); line-height: 1.25; letter-spacing: -0.005em; }
      .fact-effect { font-size: 12.5px; color: var(--gray-600); line-height: 1.4; margin-top: 2px; }
      .fact-ev-inline { color: var(--gray-400); font-weight: 500; }
      .fact-chev { width: 18px; height: 18px; color: var(--gray-400); display: inline-flex; align-items: center; justify-content: center; transition: transform .2s; flex-shrink: 0; }
      .fact-chev svg { width: 16px; height: 16px; }
      .fact-card.expanded .fact-chev { transform: rotate(180deg); color: var(--green-dark); }
      /* Big right-aligned bpm value — the visual focal point */
      .fact-bpm { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; padding: 6px 12px; border-radius: 10px; white-space: nowrap; font-feature-settings: "tnum" 1; letter-spacing: -0.01em; min-width: 88px; text-align: center; }
      .fact-bpm.pos  { background: rgba(34,197,94,0.10);  color: var(--green-dark); }
      .fact-bpm.neg  { background: rgba(30,41,59,0.07);   color: var(--dark); }
      .fact-bpm.zero { background: rgba(180,83,9,0.08);   color: var(--amber); }
      .fact-bpm.mix  { background: rgba(180,83,9,0.06);   color: var(--amber); }
      .fact-bpm.na   { background: var(--gray-100);       color: var(--gray-600); font-size: 13px; font-weight: 600; }
      .fact-body { padding: 4px 16px 14px; border-top: 1px dashed var(--gray-200); background: var(--gray-50); }
      .fact-body-row { padding-top: 10px; }
      .fact-body-row .lbl { font-size: 10px; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); font-weight: 600; display: block; margin-bottom: 3px; }
      .fact-body-row p { margin: 0; font-size: 13px; color: var(--gray-600); line-height: 1.55; }
      .source-link { display: inline-flex; align-items: center; gap: 4px; color: var(--green-dark); font-weight: 500; font-size: 13px; }
      .source-link svg { width: 12px; height: 12px; }
      .source-link:hover { color: var(--green); }

      /* MYTHS — content only, section bg comes from .section-bg-* */
      .myth-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
      .myth-card { background: #fff; border: 1px solid var(--gray-200); border-radius: 10px; padding: 12px 14px; transition: border-color .15s; }
      .myth-card:hover { border-color: var(--gray-300); }
      .myth-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
      .myth-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13.5px; color: var(--dark); margin: 0; line-height: 1.25; flex: 1; min-width: 0; }
      .myth-badge { font-size: 9.5px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--amber); background: rgba(180,83,9,0.08); padding: 3px 8px; border-radius: 9999px; white-space: nowrap; flex-shrink: 0; }
      .myth-why { margin: 4px 0 0; font-size: 12.5px; color: var(--gray-600); line-height: 1.5; }

      /* TOP PICKS */
      .picks-section { padding: 40px 0; background: #fff; }
      .picks-card { position: relative; background: var(--dark-card); color: #fff; border-radius: 24px; padding: 36px 22px; overflow: hidden; }
      .picks-glow { position: absolute; top: -40%; right: -15%; width: 70%; height: 160%; background: radial-gradient(circle at center, rgba(34,197,94,0.22), transparent 60%); pointer-events: none; }
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
      .pick-stat { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 28px; color: var(--green); margin: 8px 0 6px; letter-spacing: -0.02em; font-feature-settings: "tnum" 1; line-height: 1; }
      .pick-card.warn .pick-stat { color: #FCA5A5; }
      .pick-card.myth .pick-stat { color: #FCD34D; }
      .pick-answer { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 17px; color: #fff; line-height: 1.2; margin: 0; }
      .pick-note { margin: 10px 0 0; font-size: 13px; color: rgba(255,255,255,0.62); line-height: 1.5; }

      /* SOURCES */
      .sources-section { padding: 48px 0; }
      .src-accordion { max-width: 720px; margin: 0 auto; }
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

      /* ARTICLE CTA */
      .article-section { padding: 40px 0; background: #fff; }
      .article-card { position: relative; display: flex; align-items: center; gap: 14px; max-width: 780px; margin: 0 auto; padding: 20px 20px 20px 22px; background: linear-gradient(135deg, #F6FBF7 0%, #EEF8F1 100%); border: 1px solid rgba(34,197,94,0.25); border-radius: 18px; text-decoration: none; overflow: hidden; transition: transform .2s ease-out, border-color .2s, box-shadow .2s; }
      .article-card::before { content: ''; position: absolute; top: -40%; right: -10%; width: 55%; height: 180%; background: radial-gradient(circle at center, rgba(34,197,94,0.18), transparent 65%); pointer-events: none; }
      .article-card:hover { border-color: var(--green); transform: translateY(-1px); box-shadow: 0 10px 24px rgba(34,197,94,0.14); }
      .article-badge { position: relative; z-index: 1; align-self: flex-start; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--green-dark); background: #fff; padding: 5px 10px; border-radius: 9999px; border: 1px solid rgba(34,197,94,0.3); white-space: nowrap; }
      .article-body { position: relative; z-index: 1; flex: 1; min-width: 0; }
      .article-kicker { display: block; font-size: 11px; font-weight: 600; color: var(--green-dark); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 4px; }
      .article-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); margin: 0; line-height: 1.25; letter-spacing: -0.01em; }
      .article-year { color: var(--gray-400); font-weight: 500; }
      .article-desc { display: none; font-size: 13px; color: var(--gray-600); margin: 6px 0 0; line-height: 1.45; }
      .article-go { position: relative; z-index: 1; width: 34px; height: 34px; border-radius: 50%; background: var(--green); color: #fff; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background .2s; }
      .article-card:hover .article-go { background: var(--green-dark); }
      .article-go svg { width: 16px; height: 16px; }

      /* APP CTA */
      .blog-cta-section { padding: 48px 0; }
      .blog-cta { position: relative; background: linear-gradient(135deg, var(--dark-card) 0%, var(--gray-700) 100%); border-radius: var(--radius); padding: 32px 24px; text-align: center; max-width: 680px; margin: 0 auto; overflow: hidden; }
      .blog-cta-glow { position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%); pointer-events: none; }
      .blog-cta-content { position: relative; z-index: 1; }
      .blog-cta-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,197,94,0.15); color: var(--green); padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
      .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulseDot 2s infinite; }
      @keyframes pulseDot { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }
      .blog-cta h2 { color: #fff; font-size: clamp(22px, 5vw, 30px); margin-bottom: 12px; }
      .blog-cta .highlight { color: var(--green); }
      .blog-cta p { color: var(--gray-400); font-size: 14px; margin-bottom: 20px; max-width: 480px; margin-left: auto; margin-right: auto; }
      .blog-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; }
      .blog-cta-btn:hover { background: var(--green-dark); }
      .blog-cta-btn svg { width: 18px; height: 18px; }
      .blog-cta-buttons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
      @media (max-width: 480px) { .blog-cta-buttons { flex-direction: column; align-items: stretch; } .blog-cta-buttons a, .blog-cta-buttons button { justify-content: center; text-align: center; } }
      .blog-cta-tags { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 20px; flex-wrap: nowrap; }
      .blog-cta-tags-label { color: var(--gray-400); font-size: 11px; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
      .blog-cta-tags-logos { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; overflow: hidden; }
      .blog-cta-tags-logos img { height: 18px; width: auto; opacity: 0.75; flex-shrink: 1; min-width: 0; object-fit: contain; }
      @media (min-width: 480px) { .blog-cta-tags-logos img { height: 20px; } .blog-cta-tags-label { font-size: 12px; } }
      @media (min-width: 768px) { .blog-cta-tags-logos { gap: 8px; } .blog-cta-tags-logos img { height: 22px; } }

      .cta-android { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm, 10px); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; border: none; cursor: pointer; }
      .cta-android:hover { background: var(--green-dark); color: #fff; }
      .cta-android svg { width: 18px; height: 18px; }

      /* FOOTER */
      .tool-footer { padding: 48px 0 32px; text-align: center; border-top: 1px solid var(--gray-200); }
      .footer-brand { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); text-decoration: none; margin-bottom: 8px; }
      .footer-logo { height: 24px; width: auto; }
      .footer-tagline { font-size: 13px; color: var(--gray-400); margin-bottom: 16px; }
      .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 16px; margin-bottom: 16px; padding: 0 16px; }
      .footer-links a { font-size: 13px; color: var(--gray-600); text-decoration: none; white-space: nowrap; }
      .footer-links a:hover { color: var(--green); }
      .footer-copyright { font-size: 12px; color: var(--gray-400); margin-bottom: 4px; }
      .footer-disclaimer { font-size: 11px; color: var(--gray-400); line-height: 1.5; max-width: 560px; margin: 0 auto 12px; }

      /* RESPONSIVE */
      @media (min-width: 640px) {
        .hero-meta { grid-template-columns: repeat(4, 1fr); }
        .hero-meta .hero-cell { padding: 0 16px; border-right: 1px solid var(--gray-200); border-bottom: 0 !important; }
        .hero-meta .hero-cell:first-child { padding-left: 0; }
        .hero-meta .hero-cell:last-child { border-right: 0; padding-right: 0; }
        .hero-meta .hero-cell:nth-child(n+3), .hero-meta .hero-cell:nth-child(-n+2) { padding-top: 0; padding-bottom: 0; }
      }
      @media (min-width: 680px) {
        .base-grid { grid-template-columns: repeat(2, 1fr); }
        .myth-grid { grid-template-columns: repeat(2, 1fr); }
        .picker-tiles { grid-template-columns: repeat(4, 1fr); }
        .myths-section .picker-tiles { grid-template-columns: repeat(5, 1fr); }
        .list-toolbar { flex-direction: row; align-items: center; justify-content: space-between; gap: 12px; }
        .list-toolbar-row { gap: 14px; }
        .list-sort-btns { display: flex; grid-template-columns: none; gap: 6px; flex-wrap: wrap; }
        .list-sort-btn { padding: 8px 14px; min-height: 36px; }
      }
      @media (min-width: 768px) {
        .impact-chart { padding: 30px 32px 32px; border-radius: 22px; }
        .imp-title { font-size: 22px; }
        .imp-chart { grid-template-columns: 240px 1fr auto; column-gap: 20px; row-gap: 8px; }
        .imp-row { display: contents; }
        .imp-label { grid-column: 1; grid-row: auto; justify-content: flex-end; text-align: right; padding: 9px 0; font-size: 13.5px; }
        .imp-track { grid-column: 2; grid-row: auto; height: 32px; }
        .imp-bar { top: 6px; bottom: 6px; border-radius: 5px; }
        .imp-val { grid-column: 3; grid-row: auto; padding: 9px 0 9px 4px; min-width: 80px; text-align: left; font-size: 14.5px; }
        .imp-scale-spacer { display: block; }
        .imp-scale-spacer:first-of-type { grid-column: 1; }
        .imp-scale { grid-column: 2; }
        .imp-scale-spacer:last-of-type { grid-column: 3; }
        .header-inner { padding: 14px 24px; }
        .header-link { font-size: 13px; padding: 8px 16px; gap: 6px; }
        .header-link svg { width: 14px; height: 14px; }
        .logo { font-size: 16px; }
        .logo-img { height: 28px; }
        .hero { padding: 72px 0 48px; }
        .factors-section, .baseline-section, .myths-section, .evidence-section { padding: 64px 0 72px; }
        .picks-grid { grid-template-columns: 1fr 1fr; }
        .picks-section { padding: 64px 0; }
        .picks-card { padding: 48px 36px; border-radius: 28px; }
        .blog-cta { padding: 48px 40px; }
        .article-section { padding: 56px 0; }
        .article-card { padding: 24px 28px; gap: 18px; border-radius: 22px; }
        .article-title { font-size: 19px; }
        .article-desc { display: block; }
        .article-go { width: 40px; height: 40px; }
        .article-go svg { width: 18px; height: 18px; }
        .picker-tile { min-height: 64px; padding: 16px 18px; }
        .picker-tile-name { font-size: 15.5px; }
        .picker-panel { padding: 24px 26px; border-radius: 22px; }
        .fact-list { gap: 10px; }
        .fact-card { border-radius: 16px; }
        .fact-head { padding: 16px 20px; gap: 8px 14px; }
        .fact-name { font-size: 16px; }
        .fact-effect { font-size: 13px; }
        .myth-grid { grid-template-columns: repeat(3, 1fr); }
      }
      @media (min-width: 1000px) {
        .hero-wave { display: block; position: absolute; right: -20px; top: 30px; width: 46%; max-width: 560px; opacity: 0.9; pointer-events: none; }
      }
      @media (min-width: 1024px) {
        .picks-grid { grid-template-columns: 1fr 1fr 1fr; }
        .base-grid { grid-template-columns: repeat(3, 1fr); }
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .pulse-dot, .hero-dot { animation: none; }
        .pick-card, .fact-card, .base-card, .myth-card { transition: none; }
      }
    `;
  }
}

if (!customElements.get('kygo-rhr-factors')) {
  customElements.define('kygo-rhr-factors', KygoRhrFactors);
}
