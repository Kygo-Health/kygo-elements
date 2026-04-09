/**
 * Kygo Health — Sleep Latency Factor Explorer
 * Tag: kygo-sleep-latency-factors
 * Interactive tool exploring 33 research-backed factors that affect sleep onset latency across 5 categories
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

class KygoSleepLatencyFactors extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._activeCategory = 'environment';
    this._expandedFactor = null;
    this._expandedTopPick = null;
    this._sortMode = 'default';
    this._eventsBound = false;
  }

  connectedCallback() {
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, 'Sleep Latency Factor Explorer by Kygo Health. Explore 33 research-backed factors that affect how fast you fall asleep (sleep onset latency, SOL) across 5 categories: Nutrition & Substances, Supplements, Exercise & Movement, Environment & Sleep Hygiene, and Demographics & Physiology. Nutrition factors include caffeine (+9.1 min SOL per Gardiner 2023 meta-analysis), alcohol dose-dependent, nicotine, cannabis THC/CBD, high-GI carb meal, Mediterranean diet, kiwifruit, dietary fiber, and saturated fat. Supplements include melatonin, ashwagandha (SMD −0.53 for SOL), magnesium, glycine, GABA, L-theanine, and CBD isolate. Exercise factors include regular moderate exercise, yoga (Cohen d ≈ −1.16 Khalsa 2021), Tai Chi, resistance training, and vigorous exercise less than 1 hour before bed. Environment and sleep hygiene factors include warm bath 1–2 hours pre-bed (−10 min SOL via Haghayegh 2019 meta-analysis of 13 RCTs), hot bedroom above 25°C, bright light in the hour before bed, environmental noise at night, stimulus control therapy (Hedges g ≈ 0.85), and consistent sleep/wake schedule. Demographic and physiological factors include older age, evening chronotype, menopausal hot flashes, pre-sleep cognitive arousal, generalized anxiety disorder, and depression. Each factor shows evidence strength (Strong or Moderate), direction of effect (positive shortens SOL, negative lengthens SOL), mechanism of action, dosage or context, and peer-reviewed citation. How to fall asleep faster. What affects sleep latency. Best supplements for sleep onset. Data sourced from peer-reviewed studies and meta-analyses.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Categories ──────────────────────────────────────────────────────

  get _categories() {
    return {
      nutrition:    { name: 'Nutrition & Substances',     icon: 'salad',    count: 9 },
      supplements:  { name: 'Supplements',                icon: 'pill',     count: 7 },
      exercise:     { name: 'Exercise & Movement',        icon: 'dumbbell', count: 5 },
      environment:  { name: 'Environment & Sleep Hygiene',icon: 'moon',     count: 6 },
      physiology:   { name: 'Demographics & Physiology',  icon: 'users',    count: 6 }
    };
  }

  // ── Factor Data ─────────────────────────────────────────────────────

  get _factors() {
    return {
      nutrition: [
        {
          key: 'caffeine', name: 'Caffeine',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (+9.1 min SOL)',
          keyFinding: 'Meta-analysis of 24 studies (Gardiner 2023)',
          whatThisMeans: 'The biggest sleep-onset killer backed by high-quality data. Meta-analysis of 24 studies found caffeine adds ~9.1 minutes to sleep latency on average, with peak effect ~3 hours after intake. Effect scales with dose and slow metabolizers are hit harder.',
          mechanism: 'Adenosine receptor antagonism blocks the homeostatic sleep drive that normally builds across the waking day, delaying sleep onset.',
          dosage: 'Stop ≥8 hours before bed; slow metabolizers may need 10+ hours',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/36870101/', label: 'Gardiner 2023 meta-analysis' }
        },
        {
          key: 'alcohol', name: 'Alcohol',
          direction: 'mixed', evidence: 'strong',
          effect: 'Mixed (dose-dependent)',
          keyFinding: 'Acute SOL reduction; fragmented sleep after',
          whatThisMeans: 'Alcohol shortens sleep latency at low-to-moderate doses but trashes the second half of the night. Net effect on sleep quality is negative even though you fall asleep faster.',
          mechanism: 'GABA-A agonism produces rapid sedation but rebound glutamate and disrupted REM cause mid-night awakenings and lighter sleep.',
          dosage: 'Any dose disrupts architecture; worst effects above ~2 drinks',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/23347102/', label: 'Ebrahim 2013 review' }
        },
        {
          key: 'nicotine', name: 'Nicotine / Smoking',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (+SOL)',
          keyFinding: 'Smokers show longer SOL across studies',
          whatThisMeans: 'Smokers consistently take longer to fall asleep than non-smokers. Nicotine is a stimulant that also causes nightly withdrawal — a double hit to sleep onset.',
          mechanism: 'Nicotinic acetylcholine receptor activation produces sympathetic arousal and cortical stimulation; overnight withdrawal adds further disruption.',
          dosage: 'Any evening exposure delays onset; vaping and gum count',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/18427148/', label: 'Jaehne 2009 review' }
        },
        {
          key: 'cannabis', name: 'Cannabis (THC/CBD)',
          direction: 'variable', evidence: 'moderate',
          effect: 'Variable / inconsistent',
          keyFinding: 'Subjective SOL benefit; objective data mixed',
          whatThisMeans: 'People report falling asleep faster with cannabis but controlled studies are all over the place. Tolerance develops quickly and THC suppresses REM. Not a reliable sleep-onset strategy despite popular claims.',
          mechanism: 'CB1 receptor activation has sedative properties acutely but disrupts sleep architecture and produces tolerance and withdrawal-based insomnia.',
          dosage: 'Inconsistent evidence; avoid chronic use',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/28349316/', label: 'Babson 2017 review' }
        },
        {
          key: 'high-gi-meal', name: 'High-GI Carb Meal',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'High-GI meal 4h pre-bed cut SOL ~50%',
          whatThisMeans: 'A high-glycemic carb meal roughly 4 hours before bed shortens sleep onset. Timing matters — eaten too close to bed it backfires via reflux and glucose spikes.',
          mechanism: 'Post-prandial tryptophan availability and insulin-mediated LNAA competition increase brain tryptophan → serotonin → melatonin synthesis.',
          dosage: 'High-GI carb meal ~4 hours pre-bed',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/17284739/', label: 'Afaghi 2007 RCT' }
        },
        {
          key: 'mediterranean-diet', name: 'Mediterranean Diet',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive',
          keyFinding: 'Higher adherence linked to shorter SOL',
          whatThisMeans: 'Observational studies consistently link Mediterranean-style eating (fish, olive oil, vegetables, legumes) to shorter sleep onset and better sleep quality. Probably anti-inflammatory mediated.',
          mechanism: 'Anti-inflammatory polyphenols, omega-3s, and stable glucose response support melatonin synthesis and reduce nocturnal arousal.',
          dosage: 'Daily dietary pattern',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/30215696/', label: 'Castro-Diehl 2018' }
        },
        {
          key: 'kiwifruit', name: 'Kiwifruit',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (−SOL ~35%)',
          keyFinding: '2 kiwifruit 1h pre-bed, 4 weeks (RCT)',
          whatThisMeans: 'Eating 2 kiwifruit an hour before bed for 4 weeks shortened sleep onset by about a third in adults with sleep disturbances. Small study but the signal is real.',
          mechanism: 'High serotonin content plus folate, antioxidants, and vitamin C may support serotonin-melatonin synthesis pathway.',
          dosage: '2 kiwifruit, 1 hour before bed',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/21669584/', label: 'Lin 2011 RCT' }
        },
        {
          key: 'dietary-fiber', name: 'Dietary Fiber',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'Higher fiber = more deep sleep, faster onset',
          whatThisMeans: 'Higher daily fiber intake correlates with faster sleep onset and more slow-wave sleep. Low-fiber, high-sugar diets produce the opposite.',
          mechanism: 'Fiber-driven gut microbiome diversity modulates vagal signaling and systemic inflammation; stable glucose reduces nocturnal cortisol spikes.',
          dosage: '25–35 g/day from whole foods',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/26156950/', label: 'St-Onge 2016' }
        },
        {
          key: 'saturated-fat', name: 'Saturated Fat',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Higher sat-fat intake = longer SOL',
          whatThisMeans: 'High saturated fat intake (especially from processed foods) is linked to longer sleep onset and lighter sleep. Worth moderating if sleep onset is a problem.',
          mechanism: 'Increased systemic inflammation and disrupted gut microbiota; late-day high-fat meals delay gastric emptying and elevate core temperature.',
          dosage: 'Reduce especially within 3 hours of bed',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/26156950/', label: 'St-Onge 2016' }
        }
      ],
      supplements: [
        {
          key: 'melatonin', name: 'Melatonin',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (−7 min SOL)',
          keyFinding: 'Meta-analysis: SOL reduced ~7 min (Ferracioli-Oda 2013)',
          whatThisMeans: 'The best-studied sleep-onset supplement. On average it shaves about 7 minutes off sleep latency. Best used for circadian misalignment (jet lag, shift work, DSPS), less impressive for ordinary insomnia.',
          mechanism: 'Exogenous melatonin binds MT1/MT2 receptors in the SCN, signaling "biological night" and promoting sleep onset.',
          dosage: '0.3–1 mg, 30–60 min before bed (low dose)',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/23691095/', label: 'Ferracioli-Oda 2013 meta-analysis' }
        },
        {
          key: 'ashwagandha', name: 'Ashwagandha',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (SMD −0.53)',
          keyFinding: 'Meta-analysis of 5 RCTs; 600 mg most effective',
          whatThisMeans: 'Solid evidence from a pooled analysis of 5 RCTs. Standardized SMD of −0.53 for sleep onset, with 600 mg/day showing the largest effect. Also reduces anxiety scores, which is likely part of the mechanism.',
          mechanism: 'Withanolides reduce cortisol and pre-sleep arousal; GABAergic activity may directly promote sleep onset.',
          dosage: '300–600 mg/day standardized extract; 600 mg most effective',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/34559859/', label: 'Cheah 2021 meta-analysis' }
        },
        {
          key: 'magnesium', name: 'Magnesium',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'Meta-analysis: SOL reduced ~17 min in older adults',
          whatThisMeans: 'Decent evidence in older adults and people with low dietary magnesium. Less clear benefit in already-replete younger people. Glycinate form is better tolerated than oxide.',
          mechanism: 'NMDA receptor antagonism and GABA-A potentiation reduce cortical arousal; regulates melatonin synthesis.',
          dosage: '200–400 mg elemental magnesium (glycinate preferred)',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/34883514/', label: 'Mah 2021 review' }
        },
        {
          key: 'glycine', name: 'Glycine',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'Multiple small RCTs show faster onset + better quality',
          whatThisMeans: 'Small Japanese RCTs consistently show 3 g glycine before bed cuts sleep onset and improves subjective sleep quality. Mechanism is well-characterized, evidence base is modest but clean.',
          mechanism: 'Peripheral vasodilation lowers core body temperature (a key sleep-onset signal); NMDA modulation in the SCN.',
          dosage: '3 g, 30–60 min before bed',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/22529837/', label: 'Bannai 2012 RCT' }
        },
        {
          key: 'gaba', name: 'GABA',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'RCTs: SOL reduced ~5 min at 100 mg',
          whatThisMeans: 'Oral GABA does seem to shorten sleep latency in small studies despite longstanding doubts about whether it crosses the blood-brain barrier. Effect is modest.',
          mechanism: 'Likely peripheral vagal afferent signaling; direct CNS effect is debated but enteric GABA receptors appear involved.',
          dosage: '100–300 mg, 30–60 min before bed',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/30707852/', label: 'Byun 2018 RCT' }
        },
        {
          key: 'l-theanine', name: 'L-Theanine',
          direction: 'variable', evidence: 'moderate',
          effect: 'Variable (subjective only)',
          keyFinding: 'Improves subjective quality; no objective SOL change',
          whatThisMeans: "People report feeling more relaxed and falling asleep easier on L-theanine, but polysomnography doesn't show a consistent sleep-latency reduction. It may help indirectly by lowering pre-sleep arousal.",
          mechanism: 'Increases alpha brain waves and GABA/glutamate ratio; reduces cortisol and sympathetic tone without sedation.',
          dosage: '200–400 mg, 30–60 min before bed',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/30707852/', label: 'Kim 2019 RCT' }
        },
        {
          key: 'cbd-isolate', name: 'CBD Isolate',
          direction: 'variable', evidence: 'moderate',
          effect: 'Variable / null',
          keyFinding: 'No consistent SOL effect in controlled trials',
          whatThisMeans: "Isolated CBD (without THC) does not reliably shorten sleep onset in RCTs despite widespread marketing claims. Anxious subgroups may see indirect benefits but don't expect a direct sleep-onset effect.",
          mechanism: 'CB1 modulation and serotonin 5-HT1A agonism; dose-response is biphasic and largely anxiolytic rather than sedative.',
          dosage: 'No established dose for sleep onset',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/35129824/', label: 'Lavender 2022 review' }
        }
      ],
      exercise: [
        {
          key: 'regular-exercise', name: 'Regular Exercise',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (moderate SOL reduction)',
          keyFinding: 'Meta-analyses: consistent SOL reduction',
          whatThisMeans: 'Regular moderate exercise (cardio or mixed) is one of the most reliably effective behavioral interventions for sleep onset. Works even better for people with insomnia than good sleepers.',
          mechanism: 'Raises daytime energy expenditure and afternoon core temperature; reduces anxiety; supports circadian amplitude.',
          dosage: '150+ min/week moderate intensity, consistent',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/25596964/', label: 'Kredlow 2015 meta-analysis' }
        },
        {
          key: 'yoga', name: 'Yoga',
          direction: 'positive', evidence: 'strong',
          effect: "Positive (Cohen's d ≈ −1.16)",
          keyFinding: 'Large effect on SOL in chronic insomnia (Khalsa 2021)',
          whatThisMeans: "One of the largest single-intervention effect sizes for sleep onset in the whole dataset. Cohen's d around −1.16 in chronic sleep-onset insomnia. The breathing component likely drives most of the benefit.",
          mechanism: 'Pranayama breathing reduces sympathetic tone and cortical arousal; physical practice raises daytime energy expenditure.',
          dosage: 'Regular practice; daily short sessions or 3+ longer sessions/week',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/15707256/', label: 'Khalsa 2004/2021 RCT' }
        },
        {
          key: 'tai-chi', name: 'Tai Chi',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'Meta-analysis: SOL reduced in older adults',
          whatThisMeans: 'Especially well-studied in older adults. Meta-analyses show meaningful sleep-onset improvements. Low-impact and easy to adopt for people who can\'t do vigorous exercise.',
          mechanism: 'Combines mindful movement, slow breathing, and gentle physical load — reduces arousal and supports circadian entrainment.',
          dosage: '2–3 sessions per week, 45–60 min',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/28388934/', label: 'Raman 2013 meta-analysis' }
        },
        {
          key: 'resistance-training', name: 'Resistance Training',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'RCTs: modest SOL reduction, especially in older adults',
          whatThisMeans: 'Lifting weights helps sleep onset, though the effect is smaller than cardio or yoga. Older adults and insomniacs benefit most. Works on its own or stacked with cardio.',
          mechanism: 'Raises daytime energy expenditure and growth hormone release; mechanical fatigue increases homeostatic sleep pressure.',
          dosage: '2–3 sessions per week, progressive overload',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/35760825/', label: 'Kovacevic 2018 review' }
        },
        {
          key: 'vigorous-late', name: 'Vigorous Exercise <1h Pre-Bed',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'High-intensity within 1h delays onset',
          whatThisMeans: "Moderate exercise any time of day is fine, but truly vigorous effort in the last hour before bed measurably delays sleep onset. Most people can train in the evening — it's only the high-intensity, close-to-bed combo that's a problem.",
          mechanism: 'Sympathetic activation, elevated core temperature, and catecholamine surge oppose the physiological drop needed for sleep onset.',
          dosage: 'Avoid high-intensity exercise in the hour before bed',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/30374942/', label: 'Stutz 2019 meta-analysis' }
        }
      ],
      environment: [
        {
          key: 'warm-bath', name: 'Warm Bath/Shower 1–2h Pre-Bed',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (−10 min SOL)',
          keyFinding: 'Meta-analysis of 13 RCTs (Haghayegh 2019)',
          whatThisMeans: 'The single strongest environmental intervention. A 10-minute warm bath or shower 1–2 hours before bed cuts sleep onset by about 10 minutes on average. The counterintuitive mechanism: warming your skin causes heat loss later, dropping core temperature right at bedtime.',
          mechanism: 'Distal skin warming triggers peripheral vasodilation and heat dissipation, accelerating the core-to-distal temperature drop that initiates sleep.',
          dosage: '10+ min bath/shower at ~40–43°C, 1–2 hours before bed',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/31102877/', label: 'Haghayegh 2019 meta-analysis' }
        },
        {
          key: 'stimulus-control', name: 'Stimulus Control Therapy',
          direction: 'positive', evidence: 'strong',
          effect: "Positive (Hedges' g ≈ 0.85)",
          keyFinding: 'Large effect vs passive controls',
          whatThisMeans: "The 'bed is for sleep only' rule. If you're awake more than ~20 minutes, get up and return only when sleepy. Among the best-studied behavioral treatments for sleep onset, with large effect sizes vs doing nothing.",
          mechanism: 'Reconditions the bed as a sleep cue rather than a wakefulness/worry cue; reduces anticipatory arousal at bedtime.',
          dosage: 'Core CBT-I component; practiced nightly',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/16453985/', label: 'Morin 2006 meta-analysis' }
        },
        {
          key: 'consistent-schedule', name: 'Consistent Sleep/Wake Schedule',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (immediate)',
          keyFinding: 'Single-night effect via circadian entrainment',
          whatThisMeans: 'A consistent wake time (even more than bedtime) trains your circadian system to release melatonin and drop body temperature at the right time. One of the few sleep-onset fixes that can help the very first night.',
          mechanism: 'Stable morning light exposure and wake time entrain the SCN, anchoring evening melatonin onset and core temperature rhythm.',
          dosage: 'Fix your wake time within a 30-min window daily',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/28482658/', label: 'Phillips 2017' }
        },
        {
          key: 'bright-light-evening', name: 'Bright Light in Hour Before Bed',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (delays melatonin)',
          keyFinding: 'Room light (~200 lux) delays melatonin onset',
          whatThisMeans: "Just normal indoor room lighting in the hour before bed is enough to suppress and delay melatonin, pushing sleep onset later. You don't need to be scrolling Instagram — the ceiling lights alone are doing it.",
          mechanism: 'Melanopsin-containing retinal ganglion cells detect evening light and suppress SCN-driven melatonin release.',
          dosage: 'Dim lights below ~30 lux in the hour before bed; use warm-tone lighting',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/21193540/', label: 'Gooley 2011' }
        },
        {
          key: 'hot-bedroom', name: 'Hot Bedroom (>25°C)',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Heat exposure delays sleep onset',
          whatThisMeans: 'A hot bedroom prevents the core-body-temperature drop that triggers sleep onset. Most sleep research points to ~18–20°C (65–68°F) as the sweet spot for faster sleep onset.',
          mechanism: 'Elevated ambient temperature blocks heat loss from the skin, preventing the core temperature drop required for sleep initiation.',
          dosage: 'Keep bedroom at 18–20°C (65–68°F)',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/22738673/', label: 'Okamoto-Mizuno 2012 review' }
        },
        {
          key: 'noise', name: 'Environmental Noise',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Traffic/aircraft noise delays sleep onset',
          whatThisMeans: 'Ambient noise above ~30 dB measurably delays sleep onset and fragments sleep. White/pink noise or earplugs help mask it when the source is unavoidable.',
          mechanism: 'Auditory cortex activation keeps the brain partially alert; autonomic arousal prevents transition to NREM sleep.',
          dosage: 'Keep bedroom <30 dB; use earplugs or masking if needed',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/29910587/', label: 'WHO 2018 guidelines' }
        }
      ],
      physiology: [
        {
          key: 'cognitive-arousal', name: 'Pre-Sleep Cognitive Arousal',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Strongest modifiable predictor in insomnia',
          whatThisMeans: "Racing thoughts, rumination, and worry about not sleeping are the #1 modifiable cause of prolonged sleep onset in insomnia. Fix the mind-racing and everything else gets easier. It's why CBT-I outperforms sleeping pills long-term.",
          mechanism: 'Cortical arousal and sympathetic activation from worry directly oppose the decline in EEG activity required for sleep onset.',
          dosage: 'Addressed via CBT-I, cognitive restructuring, paradoxical intention',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/20175398/', label: 'Harvey 2002' }
        },
        {
          key: 'anxiety', name: 'Generalized Anxiety Disorder',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (longer SOL)',
          keyFinding: 'GAD strongly comorbid with delayed onset',
          whatThisMeans: 'Clinical anxiety consistently delays sleep onset. Treating the underlying anxiety (CBT, SSRIs) typically resolves the sleep-onset problem without needing separate sleep-focused treatment.',
          mechanism: 'Elevated baseline sympathetic tone and HPA-axis activity increase pre-sleep arousal and shift sleep onset later.',
          dosage: 'Treat underlying disorder',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/15982858/', label: 'Papadimitriou 2005 review' }
        },
        {
          key: 'depression', name: 'Depression',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (longer SOL)',
          keyFinding: '~75% of depressed patients report delayed onset',
          whatThisMeans: 'Depression and insomnia are bidirectional — each worsens the other. About 3 in 4 people with depression struggle with sleep onset. Treating depression improves sleep but addressing sleep directly with CBT-I also improves depression outcomes.',
          mechanism: 'HPA dysregulation, altered serotonin/melatonin pathways, and rumination all delay sleep initiation.',
          dosage: 'Treat underlying disorder; CBT-I often helpful alongside',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/18979946/', label: 'Nutt 2008 review' }
        },
        {
          key: 'evening-chronotype', name: 'Evening Chronotype',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (later onset)',
          keyFinding: 'Night owls show later melatonin onset and SOL',
          whatThisMeans: "Night owls genuinely fall asleep later — it's not laziness, it's a shifted circadian rhythm. Forcing an early bedtime just means lying awake. Morning bright light exposure plus low-dose evening melatonin can shift the clock earlier.",
          mechanism: 'Shifted SCN phase produces later melatonin onset, later core temperature nadir, and later optimal sleep window.',
          dosage: 'Non-modifiable base; morning light + evening dim can phase-advance',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/31143793/', label: 'Jones 2019 GWAS' }
        },
        {
          key: 'older-age', name: 'Older Age',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (longer SOL)',
          keyFinding: 'SOL rises progressively with age',
          whatThisMeans: 'Sleep onset latency gets longer with age even in healthy older adults. Expected, not pathological — but compounds with other age-related sleep changes like more awakenings and lighter sleep.',
          mechanism: 'Age-related decline in SCN amplitude, reduced nocturnal melatonin, and lighter sleep architecture all extend time to sleep onset.',
          dosage: 'Non-modifiable; sleep hygiene and light exposure can offset',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/15586779/', label: 'Ohayon 2004 meta-analysis' }
        },
        {
          key: 'menopausal-hot-flashes', name: 'Menopausal Hot Flashes',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Vasomotor symptoms delay sleep onset',
          whatThisMeans: "Hot flashes and night sweats during the menopausal transition make it measurably harder to fall asleep. It's a thermoregulatory disruption of the exact core-temp-drop mechanism sleep onset depends on. HRT and cooling strategies both help.",
          mechanism: 'Vasomotor episodes disrupt the core temperature decline required for sleep onset; wakefulness is directly triggered by heat surge.',
          dosage: 'Address via HRT, cooling, and CBT-I where appropriate',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/30358726/', label: 'Baker 2018 review' }
        }
      ]
    };
  }

  // ── Top Picks ───────────────────────────────────────────────────────

  get _topPicks() {
    return [
      { icon: 'moon',     label: 'Best Single Habit',         answer: 'Warm bath 1–2h pre-bed',  note: '13 RCTs; cuts sleep onset ~10 min via distal vasodilation and core-temp drop',          stat: '−10 min SOL',     category: 'Environment' },
      { icon: 'dumbbell', label: 'Best Exercise',             answer: 'Yoga',                    note: "Cohen's d ≈ −1.16 for SOL in chronic sleep-onset insomnia (Khalsa 2004/2021)",          stat: 'd ≈ −1.16',       category: 'Exercise' },
      { icon: 'pill',     label: 'Best Supplement',           answer: 'Ashwagandha',             note: 'Meta-analysis of 5 RCTs, SMD −0.53 for SOL; 600 mg/day most effective (Cheah 2021)',   stat: 'SMD −0.53',       category: 'Supplements' },
      { icon: 'brain',    label: 'Best Behavioral Tool',      answer: 'Stimulus control',       note: "Large effect vs passive controls (Hedges' g ≈ 0.85) — bed = sleep only",               stat: 'g ≈ 0.85',        category: 'Environment' },
      { icon: 'wind',     label: 'Quickest Impact',           answer: 'Consistent bedtime',     note: 'Single-night effect — a stable wake time trains circadian sleep onset',                 stat: 'Immediate',       category: 'Environment' },
      { icon: 'alert',    label: 'Biggest Sleep-Onset Killer', answer: 'Caffeine',              note: 'Meta-analysis of 24 studies: +9.1 min SOL; peak effect ~3h post-intake (Gardiner 2023)', stat: '+9.1 min SOL',    category: 'Nutrition', warning: true }
    ];
  }

  // ── Icons ───────────────────────────────────────────────────────────

  _icon(name) {
    const icons = {
      salad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1"/><path d="m13 12 4-4"/><path d="M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2"/></svg>',
      pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 1.5 3 3L5.3 12.7a4.24 4.24 0 0 1-6-6L7.5 4.5l3-3z"/><path d="m9 9 6.4-6.4a4.24 4.24 0 0 1 6 6L15 15"/><line x1="14.5" y1="13.5" x2="10.5" y2="9.5"/></svg>',
      dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.28.44 2.46 1.17 3.39A5.49 5.49 0 0 0 4 14.5 5.5 5.5 0 0 0 9.5 20h0a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 9.5 2z"/><path d="M14.5 2A5.5 5.5 0 0 1 20 7.5c0 1.28-.44 2.46-1.17 3.39A5.49 5.49 0 0 1 20 14.5 5.5 5.5 0 0 1 14.5 20h0a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 14.5 2z"/></svg>',
      wind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>',
      alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>',
      arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>',
      arrowLeftRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>'
    };
    return icons[name] || icons.moon;
  }

  // ── Direction helpers ───────────────────────────────────────────────

  _directionConfig(dir) {
    const map = {
      positive: { icon: 'arrowUp', label: 'Positive', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
      negative: { icon: 'arrowDown', label: 'Negative', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
      mixed: { icon: 'arrowLeftRight', label: 'Mixed', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)' },
      variable: { icon: 'arrowLeftRight', label: 'Variable', color: '#94A3B8', bg: 'rgba(148,163,184,0.1)' }
    };
    return map[dir] || map.mixed;
  }

  _evidenceConfig(ev) {
    const map = {
      strong: { label: 'Strong', color: '#16A34A', bg: 'rgba(34,197,94,0.15)' },
      moderate: { label: 'Moderate', color: '#D97706', bg: 'rgba(251,191,36,0.15)' },
      emerging: { label: 'Emerging', color: '#6366F1', bg: 'rgba(99,102,241,0.15)' }
    };
    return map[ev] || map.moderate;
  }

  // ── Render Helpers ──────────────────────────────────────────────────

  _renderCategoryTabs() {
    return Object.entries(this._categories).map(([k, c]) =>
      `<button class="cat-tab ${k === this._activeCategory ? 'active' : ''}" data-category="${k}" role="tab" aria-selected="${k === this._activeCategory}">
        <span class="cat-tab-icon">${this._icon(c.icon)}</span>
        <span>${c.name}</span>
        <span class="cat-tab-count">${c.count}</span>
      </button>`
    ).join('');
  }

  _renderFactorCards() {
    let factors = this._factors[this._activeCategory];
    if (!factors) return '<p class="no-data">No factors in this category.</p>';
    if (this._sortMode === 'evidence') {
      const rank = { strong: 0, moderate: 1, emerging: 2 };
      factors = [...factors].sort((a, b) => (rank[a.evidence] ?? 9) - (rank[b.evidence] ?? 9));
    } else if (this._sortMode === 'direction') {
      const rank = { positive: 0, mixed: 1, variable: 2, negative: 3 };
      factors = [...factors].sort((a, b) => (rank[a.direction] ?? 9) - (rank[b.direction] ?? 9));
    }
    return factors.map((f, i) => {
      const dir = this._directionConfig(f.direction);
      const ev = this._evidenceConfig(f.evidence);
      const isExpanded = this._expandedFactor === f.key;
      return `
        <div class="factor-card ${isExpanded ? 'expanded' : ''}" data-factor="${f.key}" style="--delay:${i * 60}ms">
          <div class="factor-header" role="button" tabindex="0" aria-expanded="${isExpanded}">
            <div class="factor-top">
              <div class="factor-badges">
                <span class="badge-direction" style="color:${dir.color};background:${dir.bg}">
                  <span class="badge-icon">${this._icon(dir.icon)}</span>${dir.label}
                </span>
              </div>
              <div class="factor-toggle">${this._icon('chevDown')}</div>
            </div>
            <h3 class="factor-name">${f.name}</h3>
            <p class="factor-effect">${f.effect}</p>
            <p class="factor-evidence-text"><span class="evidence-label">Evidence:</span> ${ev.label}</p>
          </div>
          <div class="factor-body">
            <div class="factor-detail">
              <div class="detail-row">
                <span class="detail-label">Plain English</span>
                <p class="detail-value">${f.whatThisMeans}</p>
              </div>
              <div class="detail-row">
                <span class="detail-label">Mechanism</span>
                <p class="detail-value">${f.mechanism}</p>
              </div>
              <div class="detail-row">
                <span class="detail-label">Dosage / Context</span>
                <p class="detail-value">${f.dosage}</p>
              </div>
              <div class="detail-row">
                <span class="detail-label">Source</span>
                <p class="detail-value"><a href="${f.source.url}" target="_blank" rel="noopener" class="source-link">${f.source.label} ${this._icon('externalLink')}</a></p>
              </div>
              ${f.affiliate ? `<a href="${f.affiliate.url}" class="factor-affiliate" target="_blank" rel="noopener sponsored">
                <span>Check it out on Amazon</span>
                <span class="factor-affiliate-arrow">${this._icon('externalLink')}</span>
              </a>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');
  }

  _renderTopPicks() {
    return this._topPicks.map((p, i) => {
      const isExpanded = this._expandedTopPick === i;
      const warn = p.warning ? ' pick-warning' : '';
      return `
        <div class="pick-card ${isExpanded ? 'expanded' : ''}${warn} animate-on-scroll" data-pick="${i}" style="--delay:${i * 80}ms">
          <div class="pick-header" role="button" tabindex="0" aria-expanded="${isExpanded}">
            <div class="pick-icon">${this._icon(p.icon)}</div>
            <div class="pick-info">
              <span class="pick-label">${p.label}</span>
              <span class="pick-answer">${p.answer}</span>
            </div>
            <div class="pick-toggle">${this._icon('chevDown')}</div>
          </div>
          <div class="pick-body">
            ${p.stat ? `<p class="pick-stat-detail"><span class="pick-stat-label">Key stat:</span> ${p.stat}</p>` : ''}
            <p class="pick-note">${p.note}</p>
            <span class="pick-cat">Category: ${p.category}</span>
          </div>
        </div>`;
    }).join('');
  }

  _renderSources() {
    const groups = {
      'Nutrition & Substances': [
        { label: 'Gardiner et al. 2023 — Caffeine & sleep meta-analysis (24 studies)', url: 'https://pubmed.ncbi.nlm.nih.gov/36870101/' },
        { label: 'Ebrahim et al. 2013 — Alcohol & sleep review', url: 'https://pubmed.ncbi.nlm.nih.gov/23347102/' },
        { label: 'Jaehne et al. 2009 — Nicotine & sleep review', url: 'https://pubmed.ncbi.nlm.nih.gov/18427148/' },
        { label: 'Babson et al. 2017 — Cannabis & sleep review', url: 'https://pubmed.ncbi.nlm.nih.gov/28349316/' },
        { label: 'Afaghi et al. 2007 — High-GI meal & sleep onset RCT', url: 'https://pubmed.ncbi.nlm.nih.gov/17284739/' },
        { label: 'Castro-Diehl et al. 2018 — Mediterranean diet & sleep', url: 'https://pubmed.ncbi.nlm.nih.gov/30215696/' },
        { label: 'Lin et al. 2011 — Kiwifruit & sleep RCT', url: 'https://pubmed.ncbi.nlm.nih.gov/21669584/' },
        { label: 'St-Onge et al. 2016 — Fiber, saturated fat & sleep', url: 'https://pubmed.ncbi.nlm.nih.gov/26156950/' }
      ],
      'Supplements': [
        { label: 'Ferracioli-Oda et al. 2013 — Melatonin meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/23691095/' },
        { label: 'Cheah et al. 2021 — Ashwagandha & sleep meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/34559859/' },
        { label: 'Mah & Pitre 2021 — Magnesium & sleep review', url: 'https://pubmed.ncbi.nlm.nih.gov/34883514/' },
        { label: 'Bannai et al. 2012 — Glycine & sleep RCT', url: 'https://pubmed.ncbi.nlm.nih.gov/22529837/' },
        { label: 'Byun et al. 2018 — GABA supplementation RCT', url: 'https://pubmed.ncbi.nlm.nih.gov/30707852/' },
        { label: 'Kim et al. 2019 — L-Theanine & sleep quality RCT', url: 'https://pubmed.ncbi.nlm.nih.gov/30707852/' },
        { label: 'Lavender et al. 2022 — CBD & sleep review', url: 'https://pubmed.ncbi.nlm.nih.gov/35129824/' }
      ],
      'Exercise & Physical Activity': [
        { label: 'Kredlow et al. 2015 — Exercise & sleep meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/25596964/' },
        { label: 'Khalsa 2004/2021 — Yoga for chronic insomnia RCT', url: 'https://pubmed.ncbi.nlm.nih.gov/15707256/' },
        { label: 'Raman et al. 2013 — Tai Chi & sleep meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/28388934/' },
        { label: 'Kovacevic et al. 2018 — Resistance training & sleep review', url: 'https://pubmed.ncbi.nlm.nih.gov/35760825/' },
        { label: 'Stutz et al. 2019 — Evening exercise & sleep meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/30374942/' }
      ],
      'Environment & Sleep Hygiene': [
        { label: 'Haghayegh et al. 2019 — Warm bath & sleep meta-analysis (13 RCTs)', url: 'https://pubmed.ncbi.nlm.nih.gov/31102877/' },
        { label: 'Morin et al. 2006 — CBT-I & stimulus control meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/16453985/' },
        { label: 'Phillips et al. 2017 — Sleep regularity & circadian alignment', url: 'https://pubmed.ncbi.nlm.nih.gov/28482658/' },
        { label: 'Gooley et al. 2011 — Room light suppresses melatonin', url: 'https://pubmed.ncbi.nlm.nih.gov/21193540/' },
        { label: 'Okamoto-Mizuno & Mizuno 2012 — Ambient temperature & sleep', url: 'https://pubmed.ncbi.nlm.nih.gov/22738673/' },
        { label: 'WHO 2018 — Environmental noise guidelines for Europe', url: 'https://pubmed.ncbi.nlm.nih.gov/29910587/' }
      ],
      'Demographics & Physiology': [
        { label: 'Harvey 2002 — Cognitive model of insomnia', url: 'https://pubmed.ncbi.nlm.nih.gov/20175398/' },
        { label: 'Papadimitriou & Linkowski 2005 — Anxiety & sleep review', url: 'https://pubmed.ncbi.nlm.nih.gov/15982858/' },
        { label: 'Nutt et al. 2008 — Depression & sleep review', url: 'https://pubmed.ncbi.nlm.nih.gov/18979946/' },
        { label: 'Jones et al. 2019 — Chronotype GWAS', url: 'https://pubmed.ncbi.nlm.nih.gov/31143793/' },
        { label: 'Ohayon et al. 2004 — Meta-analysis of normative sleep parameters', url: 'https://pubmed.ncbi.nlm.nih.gov/15586779/' },
        { label: 'Baker et al. 2018 — Menopause & sleep review', url: 'https://pubmed.ncbi.nlm.nih.gov/30358726/' }
      ]
    };
    const totalCount = Object.values(groups).reduce((sum, g) => sum + g.length, 0);
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

  // ── Surgical Update ─────────────────────────────────────────────────

  _updateCategory() {
    const shadow = this.shadowRoot;
    const tabs = shadow.querySelector('.cat-tabs');
    const cards = shadow.querySelector('.factor-cards');
    const sortBar = shadow.querySelector('.sort-bar');
    this._expandedFactor = null;
    if (tabs) tabs.innerHTML = this._renderCategoryTabs();
    if (cards) cards.innerHTML = this._renderFactorCards();
    if (sortBar) sortBar.innerHTML = `
      <label class="sort-label" for="sort-select">Sort by:</label>
      <select class="sort-select" id="sort-select">
        <option value="default"${this._sortMode === 'default' ? ' selected' : ''}>Default</option>
        <option value="evidence"${this._sortMode === 'evidence' ? ' selected' : ''}>Evidence Strength</option>
        <option value="direction"${this._sortMode === 'direction' ? ' selected' : ''}>Effect Direction</option>
      </select>
    `;
  }

  _toggleFactor(key) {
    this._expandedFactor = this._expandedFactor === key ? null : key;
    const shadow = this.shadowRoot;
    shadow.querySelectorAll('.factor-card').forEach(card => {
      const isExp = card.dataset.factor === this._expandedFactor;
      card.classList.toggle('expanded', isExp);
      const btn = card.querySelector('.factor-header');
      if (btn) btn.setAttribute('aria-expanded', isExp);
    });
  }

  _toggleTopPick(idx) {
    this._expandedTopPick = this._expandedTopPick === idx ? null : idx;
    const shadow = this.shadowRoot;
    shadow.querySelectorAll('.pick-card').forEach(card => {
      const isExp = parseInt(card.dataset.pick) === this._expandedTopPick;
      card.classList.toggle('expanded', isExp);
      const btn = card.querySelector('.pick-header');
      if (btn) btn.setAttribute('aria-expanded', isExp);
    });
  }

  // ── Main Render ─────────────────────────────────────────────────────

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const iosUrl = 'https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <!-- Header -->
      <header class="header">
        <div class="header-inner">
          <a href="https://kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" />
            Sleep Latency
          </a>
          <a href="https://kygo.app" class="header-link" target="_blank" rel="noopener">
            Get Kygo App ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge animate-on-scroll">33 FACTORS • 5 CATEGORIES • ALL PEER-REVIEWED</div>
          <h1 class="animate-on-scroll">What Actually Helps You Fall Asleep Faster?</h1>
          <p class="hero-sub animate-on-scroll">Every nutrition choice, supplement, habit, and environmental tweak with proven impact on sleep onset latency — ranked by evidence strength and direction of effect. No guessing, just data.</p>
        </div>
      </section>

      <!-- Top Picks -->
      <section class="picks-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Quick Answers</h2>
          <p class="section-sub animate-on-scroll">The top research-backed picks across every category.</p>
          <div class="picks-grid">${this._renderTopPicks()}</div>
        </div>
      </section>

      <!-- Primary Interactive: Category tabs + Factor cards -->
      <section class="explore-section" id="explore">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Explore All Factors</h2>
          <p class="section-sub animate-on-scroll">Tap any factor to see mechanism, dosage, and source.</p>

          <div class="cat-tabs animate-on-scroll" role="tablist">${this._renderCategoryTabs()}</div>
          <div class="sort-bar animate-on-scroll">
            <label class="sort-label" for="sort-select">Sort by:</label>
            <select class="sort-select" id="sort-select">
              <option value="default"${this._sortMode === 'default' ? ' selected' : ''}>Default</option>
              <option value="evidence"${this._sortMode === 'evidence' ? ' selected' : ''}>Evidence Strength</option>
              <option value="direction"${this._sortMode === 'direction' ? ' selected' : ''}>Effect Direction</option>
            </select>
          </div>
          <div class="factor-cards">${this._renderFactorCards()}</div>

          <!-- Read Full Article (cross-link) -->
          <div class="blog-link-wrap animate-on-scroll">
            <a href="https://www.kygo.app/post/how-to-fall-asleep-faster-factors-ranked-by-evidence" class="blog-link-card" target="_blank" rel="noopener">
              <span class="blog-link-icon"><img src="${logoUrl}" alt="Kygo" style="width:24px;height:24px;" /></span>
              <div class="blog-link-text">
                <span class="blog-link-title">Read the Full Article</span>
                <span class="blog-link-desc">How to Fall Asleep Faster: 33 Factors Ranked by Evidence (2026)</span>
              </div>
              <span class="blog-link-arrow">${this._icon('arrowRight')}</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Blog CTA -->
      <section class="blog-cta-section">
        <div class="container">
          <div class="blog-cta animate-on-scroll">
            <div class="blog-cta-glow"></div>
            <div class="blog-cta-content">
              <div class="blog-cta-badge"><span class="pulse-dot"></span>Free Forever Plan</div>
              <h2>Track Your <span class="highlight">Sleep Onset</span> Automatically</h2>
              <p>Kygo syncs with your wearable and food log to show which habits actually shorten your sleep latency — correlations personalized to your data.</p>
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
                <span>Works with</span>
                <img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura" loading="lazy" />
                <img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple" loading="lazy" />
                <img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit" loading="lazy" />
                <img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sources -->
      <section class="sources-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Sources</h2>
          <p class="section-sub animate-on-scroll">All data sourced from peer-reviewed studies and meta-analyses.</p>
          <div class="sources-list animate-on-scroll">${this._renderSources()}</div>
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

  // ── Styles ──────────────────────────────────────────────────────────

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
      a { color: var(--green); text-decoration: none; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

      /* Animations */
      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: var(--delay, 0ms); }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      /* ── Header ── */
      .header { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid var(--gray-200); }
      .header-inner { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; max-width: 1200px; margin: 0 auto; }
      .logo { display: flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); text-decoration: none; }
      .logo-img { height: 28px; width: auto; }
      .header-link { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #fff; background: var(--green); padding: 8px 16px; border-radius: 50px; text-decoration: none; transition: background 0.2s; }
      .header-link:hover { background: var(--green-dark); }
      .header-link svg { width: 14px; height: 14px; }

      /* ── Hero ── */
      .hero { padding: 48px 0 32px; text-align: center; }
      .hero-badge { display: inline-block; padding: 6px 16px; border-radius: 50px; background: var(--green-light); color: var(--green-dark); font-size: 12px; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 16px; }
      h1 { font-size: clamp(26px, 7vw, 42px); margin-bottom: 16px; color: var(--dark); }
      .hero-sub { font-size: 16px; color: var(--gray-600); max-width: 640px; margin: 0 auto; }

      /* ── Section titles ── */
      .section-title { font-size: clamp(24px, 6vw, 36px); text-align: center; margin-bottom: 8px; }
      .section-sub { text-align: center; color: var(--gray-600); font-size: 15px; margin-bottom: 32px; max-width: 560px; margin-left: auto; margin-right: auto; }

      /* ── Top Picks ── */
      .picks-section { padding: 48px 0; }
      .picks-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
      .pick-card { background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: box-shadow 0.3s; }
      .pick-card:hover { box-shadow: var(--shadow-hover); }
      .pick-header { display: flex; align-items: center; gap: 12px; padding: 16px 20px; cursor: pointer; }
      .pick-icon { width: 40px; height: 40px; border-radius: 12px; background: var(--green-light); display: flex; align-items: center; justify-content: center; color: var(--green-dark); flex-shrink: 0; }
      .pick-icon svg { width: 20px; height: 20px; }
      .pick-info { flex: 1; min-width: 0; }
      .pick-label { display: block; font-size: 12px; color: var(--gray-400); font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px; }
      .pick-answer { display: block; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); }
      .pick-toggle { width: 24px; height: 24px; color: var(--gray-400); transition: transform 0.3s; flex-shrink: 0; }
      .pick-toggle svg { width: 24px; height: 24px; }
      .pick-card.expanded .pick-toggle { transform: rotate(180deg); }
      .pick-body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.4s; padding: 0 20px; }
      .pick-card.expanded .pick-body { max-height: 200px; padding: 0 20px 16px; }
      .pick-stat-detail { font-size: 13px; color: var(--dark); margin-bottom: 8px; font-weight: 500; }
      .pick-stat-label { color: var(--gray-400); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; }
      .pick-warning { border-color: rgba(239,68,68,0.3); }
      .pick-warning .pick-icon { background: rgba(239,68,68,0.1); color: var(--red); }
      .pick-warning .pick-stat-detail { color: var(--red); }
      .pick-note { font-size: 14px; color: var(--gray-600); margin-bottom: 6px; }
      .pick-cat { font-size: 12px; color: var(--gray-400); }

      /* ── Explore Section ── */
      .explore-section { padding: 48px 0 64px; }

      /* Sort bar */
      .sort-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
      .sort-label { font-size: 12px; font-weight: 600; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.3px; }
      .sort-select { padding: 6px 28px 6px 12px; border-radius: 50px; border: 1px solid var(--gray-200); background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center; -webkit-appearance: none; appearance: none; font-size: 13px; font-weight: 500; color: var(--gray-600); cursor: pointer; font-family: inherit; transition: border-color 0.2s; }
      .sort-select:hover, .sort-select:focus { border-color: var(--green); outline: none; }

      /* Category tabs */
      .cat-tabs { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; margin-bottom: 16px; }
      .cat-tabs::-webkit-scrollbar { display: none; }
      .cat-tab { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 50px; border: 2px solid var(--gray-200); background: #fff; font-size: 13px; font-weight: 500; color: var(--gray-600); cursor: pointer; white-space: nowrap; transition: all 0.2s; font-family: inherit; }
      .cat-tab.active { background: var(--green-light); color: var(--green-dark); border-color: var(--green); }
      .cat-tab:hover { border-color: var(--green); }
      .cat-tab-icon { width: 16px; height: 16px; display: flex; }
      .cat-tab-icon svg { width: 16px; height: 16px; }
      .cat-tab-count { background: var(--gray-100); color: var(--gray-400); font-size: 11px; padding: 1px 7px; border-radius: 50px; }
      .cat-tab.active .cat-tab-count { background: rgba(34,197,94,0.2); color: var(--green-dark); }

      /* Factor cards */
      .factor-cards { display: grid; grid-template-columns: 1fr; gap: 12px; }
      .factor-card { background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: box-shadow 0.3s, border-color 0.3s; }
      .factor-card:hover { box-shadow: var(--shadow-hover); border-color: var(--gray-300); }
      .factor-header { padding: 20px; cursor: pointer; }
      .factor-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
      .factor-badges { display: flex; gap: 8px; flex-wrap: wrap; }
      .badge-direction, .badge-evidence { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 50px; font-size: 12px; font-weight: 600; }
      .badge-icon { width: 14px; height: 14px; display: flex; }
      .badge-icon svg { width: 14px; height: 14px; }
      .factor-toggle { width: 24px; height: 24px; color: var(--gray-400); transition: transform 0.3s; flex-shrink: 0; }
      .factor-toggle svg { width: 24px; height: 24px; }
      .factor-card.expanded .factor-toggle { transform: rotate(180deg); }
      .factor-name { font-size: 18px; margin-bottom: 4px; color: var(--dark); }
      .factor-effect { font-size: 14px; font-weight: 600; color: var(--gray-600); margin-bottom: 2px; }
      .factor-evidence-text { font-size: 13px; color: var(--dark); }
      .evidence-label { color: var(--gray-400); font-weight: 500; }

      /* Factor body (expandable) */
      .factor-body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.4s; padding: 0 20px; }
      .factor-card.expanded .factor-body { max-height: 600px; padding: 0 20px 20px; }
      .factor-detail { border-top: 1px solid var(--gray-100); padding-top: 16px; }
      .detail-row { margin-bottom: 12px; }
      .detail-row:last-child { margin-bottom: 0; }
      .detail-label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-400); margin-bottom: 2px; }
      .detail-value { font-size: 14px; color: var(--gray-600); line-height: 1.5; }
      .source-link { display: inline-flex; align-items: center; gap: 4px; color: var(--green); font-weight: 500; font-size: 13px; }
      .source-link svg { width: 12px; height: 12px; }
      .source-link:hover { color: var(--green-dark); }
      .factor-affiliate { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; margin-top: 12px; background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-sm); text-decoration: none; color: var(--gray-600); font-size: 13px; font-weight: 500; transition: all 0.2s; }
      .factor-affiliate:hover { border-color: var(--green); background: var(--green-light); color: var(--green-dark); }
      .factor-affiliate-arrow { width: 14px; height: 14px; display: flex; }
      .factor-affiliate-arrow svg { width: 100%; height: 100%; }


      /* ── Sources (accordion) ── */
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
      .src-group.open .src-group-body { max-height: 600px; }
      .src-item { display: flex; align-items: center; gap: 8px; padding: 8px 16px; text-decoration: none; color: var(--gray-600); font-size: 13px; transition: background 0.2s; }
      .src-item:last-child { padding-bottom: 12px; }
      .src-item:hover { background: var(--gray-50); }
      .src-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
      .src-text { flex: 1; }
      .src-ext { width: 14px; height: 14px; color: var(--gray-400); flex-shrink: 0; }
      .src-ext svg { width: 14px; height: 14px; }
      .blog-link-wrap { max-width: 720px; margin: 32px auto 0; }
      .blog-link-card { display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: var(--green-light); border: 2px solid var(--green); border-radius: var(--radius); text-decoration: none; transition: box-shadow 0.3s; }
      .blog-link-card:hover { box-shadow: var(--shadow-hover); }
      .blog-link-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: var(--green-dark); flex-shrink: 0; }
      .blog-link-icon svg { width: 24px; height: 24px; }
      .blog-link-text { flex: 1; }
      .blog-link-title { display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--green-dark); letter-spacing: 0.3px; }
      .blog-link-desc { display: block; font-size: 14px; font-weight: 500; color: var(--dark); margin-top: 2px; }
      .blog-link-arrow { width: 20px; height: 20px; color: var(--green-dark); flex-shrink: 0; }
      .blog-link-arrow svg { width: 20px; height: 20px; }

      /* ── Blog CTA ── */
      .blog-cta-section { padding: 48px 0; }
      .blog-cta { position: relative; background: linear-gradient(135deg, var(--dark-card) 0%, var(--gray-700) 100%); border-radius: var(--radius); padding: 32px 24px; text-align: center; max-width: 680px; margin: 0 auto; overflow: hidden; }
      .blog-cta-glow { position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%); pointer-events: none; }
      .blog-cta-content { position: relative; z-index: 1; }
      .blog-cta-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,197,94,0.15); color: var(--green); padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
      .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
      @keyframes pulse { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }
      .blog-cta h2 { color: #fff; font-size: clamp(22px, 5vw, 30px); margin-bottom: 12px; }
      .blog-cta .highlight { color: var(--green); }
      .blog-cta p { color: var(--gray-400); font-size: 14px; margin-bottom: 20px; max-width: 480px; margin-left: auto; margin-right: auto; }
      .blog-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; }
      .blog-cta-btn:hover { background: var(--green-dark); }
      .blog-cta-btn svg { width: 18px; height: 18px; }
      .blog-cta-buttons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
      @media (max-width: 480px) { .blog-cta-buttons { flex-direction: column; align-items: stretch; } .blog-cta-buttons a, .blog-cta-buttons button { justify-content: center; text-align: center; } }
      .blog-cta-tags { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 20px; flex-wrap: wrap; }
      .blog-cta-tags span { color: var(--gray-400); font-size: 12px; }
      .blog-cta-tags img { height: 22px; width: auto; opacity: 0.7; }

      /* ── Android button (in Blog CTA) ── */
      .cta-android { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm, 10px); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; border: none; cursor: pointer; }
      .cta-android:hover { background: var(--green-dark); color: #fff; }
      .cta-android svg { width: 18px; height: 18px; }

      /* ── Footer ── */
      .tool-footer { padding: 48px 0 32px; text-align: center; border-top: 1px solid var(--gray-200); }
      .footer-brand { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); text-decoration: none; margin-bottom: 8px; }
      .footer-logo { height: 24px; width: auto; }
      .footer-tagline { font-size: 13px; color: var(--gray-400); margin-bottom: 16px; }
      .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 16px; margin-bottom: 16px; padding: 0 16px; }
      .footer-links a { font-size: 13px; color: var(--gray-600); text-decoration: none; white-space: nowrap; }
      .footer-links a:hover { color: var(--green); }
      .footer-copyright { font-size: 12px; color: var(--gray-400); margin-bottom: 4px; }
      .footer-disclaimer { font-size: 11px; color: var(--gray-400); line-height: 1.5; max-width: 560px; margin: 0 auto 12px; }

      /* ── Responsive ── */
      @media (min-width: 768px) {
        .header-inner { padding: 14px 24px; }
        .hero { padding: 64px 0 40px; }
        .hero-sub { font-size: 17px; }
        .picks-grid { grid-template-columns: 1fr 1fr; }
        .factor-cards { grid-template-columns: 1fr 1fr; }
        .picks-section, .explore-section { padding: 64px 0; }
        .blog-cta { padding: 48px 40px; }
      }
      @media (min-width: 1024px) {
        .picks-grid { grid-template-columns: 1fr 1fr 1fr; }
        .explore-section { padding: 80px 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .factor-body, .pick-body { transition: none; }
        .pulse-dot { animation: none; }
      }
    `;
  }

  // ── Event Delegation ────────────────────────────────────────────────

  _setupEventDelegation() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const shadow = this.shadowRoot;

    shadow.addEventListener('click', (e) => {
      // Source group accordion
      const srcToggle = e.target.closest('.src-group-toggle');
      if (srcToggle) {
        const group = srcToggle.closest('.src-group');
        if (group) {
          const isOpen = group.classList.toggle('open');
          srcToggle.setAttribute('aria-expanded', isOpen);
        }
        return;
      }

      // Category tabs
      const tab = e.target.closest('.cat-tab');
      if (tab) {
        this._activeCategory = tab.dataset.category;
        this._updateCategory();
        return;
      }

      // Factor card expansion (skip source links)
      if (e.target.closest('.source-link') || e.target.closest('.factor-affiliate')) return;
      const factorHeader = e.target.closest('.factor-header');
      if (factorHeader) {
        const card = factorHeader.closest('.factor-card');
        if (card) this._toggleFactor(card.dataset.factor);
        return;
      }

      // Top pick expansion
      const pickHeader = e.target.closest('.pick-header');
      if (pickHeader) {
        const card = pickHeader.closest('.pick-card');
        if (card) this._toggleTopPick(parseInt(card.dataset.pick));
        return;
      }
    });

    // Sort dropdown
    shadow.addEventListener('change', (e) => {
      if (e.target.classList.contains('sort-select')) {
        this._sortMode = e.target.value;
        this._updateCategory();
      }
    });

    // Keyboard support
    shadow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const factorHeader = e.target.closest('.factor-header');
        if (factorHeader) {
          e.preventDefault();
          const card = factorHeader.closest('.factor-card');
          if (card) this._toggleFactor(card.dataset.factor);
          return;
        }
        const pickHeader = e.target.closest('.pick-header');
        if (pickHeader) {
          e.preventDefault();
          const card = pickHeader.closest('.pick-card');
          if (card) this._toggleTopPick(parseInt(card.dataset.pick));
        }
      }
    });
  }

  // ── Animations ──────────────────────────────────────────────────────

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

  // ── Structured Data ─────────────────────────────────────────────────

  _injectStructuredData() {
    if (document.querySelector('script[data-kygo-sleep-latency-factors-ld]')) return;
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Sleep Latency Factor Explorer',
      'alternateName': 'Kygo Sleep Onset Factors Tool',
      'description': 'Explore 33 research-backed factors that affect sleep onset latency — nutrition, supplements, exercise, environment, and physiology ranked by evidence strength.',
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'url': 'https://www.kygo.app/tools/sleep-latency-factors',
      'datePublished': '2026-04-09',
      'dateModified': '2026-04-09',
      'softwareVersion': '1.0',
      'inLanguage': 'en',
      'isAccessibleForFree': true,
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
      'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
      'featureList': 'Explore 33 sleep latency factors, 5 evidence categories, nutrition and supplement comparison, peer-reviewed research citations, sleep hygiene interventions',
      'keywords': 'sleep latency factors, how to fall asleep faster, sleep onset latency, sleep onset insomnia, best supplements for sleep, melatonin vs ashwagandha, warm bath before bed, caffeine and sleep, CBT-I, stimulus control, sleep hygiene, circadian rhythm, chronotype, sleep environment, bedroom temperature for sleep'
    };

    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': "What's the fastest way to fall asleep?",
          'acceptedAnswer': { '@type': 'Answer', 'text': 'A warm bath or shower 1–2 hours before bed has the strongest evidence — a 2019 meta-analysis of 13 RCTs (Haghayegh) showed it cuts sleep onset by ~10 minutes on average via distal vasodilation that drops core body temperature right at bedtime. Combining it with stimulus control (only using the bed for sleep) and a consistent wake time produces the largest total effect.' }
        },
        {
          '@type': 'Question',
          'name': 'Do supplements actually help you fall asleep faster?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Some do. Melatonin shortens sleep latency by roughly 7 minutes on average (Ferracioli-Oda 2013 meta-analysis) and works best for circadian misalignment. Ashwagandha has the largest effect size among supplements — SMD −0.53 across 5 RCTs (Cheah 2021), with 600 mg/day most effective. Magnesium and glycine have moderate evidence. CBD isolate and L-theanine do not show consistent objective sleep-onset effects despite subjective reports.' }
        },
        {
          '@type': 'Question',
          'name': 'How long before bed should I stop drinking caffeine?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'At least 8 hours, and slow metabolizers may need 10+. A 2023 meta-analysis of 24 studies (Gardiner) found caffeine adds ~9.1 minutes to sleep onset on average, with peak disruption about 3 hours after intake. Effects scale with dose and are stronger in people who don\'t drink caffeine regularly.' }
        },
        {
          '@type': 'Question',
          'name': 'Does exercise help you fall asleep faster?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes — regular moderate exercise consistently shortens sleep onset in meta-analyses. Yoga has the single largest effect size in the dataset (Cohen\'s d ≈ −1.16 for chronic sleep-onset insomnia per Khalsa 2004/2021). Tai Chi, resistance training, and moderate cardio all help. The one exception: vigorous exercise within ~1 hour of bedtime delays onset due to sympathetic arousal and elevated core temperature.' }
        },
        {
          '@type': 'Question',
          'name': 'What is a normal sleep onset latency?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Healthy adults typically fall asleep within 10–20 minutes. Falling asleep in under 5 minutes often indicates significant sleep deprivation, while taking more than 30 minutes consistently is one of the diagnostic criteria for sleep-onset insomnia. Sleep latency naturally lengthens with age, and evening chronotypes have a genuinely later optimal sleep window.' }
        }
      ]
    };

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Kygo Health', 'item': 'https://www.kygo.app' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
        { '@type': 'ListItem', 'position': 3, 'name': 'Sleep Latency Factors', 'item': 'https://www.kygo.app/tools/sleep-latency-factors' }
      ]
    };

    [ld, faq, breadcrumb].forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-kygo-sleep-latency-factors-ld', '');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });
  }
}

if (!customElements.get('kygo-sleep-latency-factors')) {
  customElements.define('kygo-sleep-latency-factors', KygoSleepLatencyFactors);
}
