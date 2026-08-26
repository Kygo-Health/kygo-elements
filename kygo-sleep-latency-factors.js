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

  // Hero counts, derived from the factor data so they can never drift.
  get _heroStats() {
    const all = Object.values(this._factors).flat();
    return {
      total: all.length,
      cats: Object.keys(this._categories).length,
      help: all.filter(f => f.direction === 'positive').length,
      hurt: all.filter(f => f.direction === 'negative').length,
      sources: this._sources.length
    };
  }

  get _factors() {
    return {
      nutrition: [
        {
          key: 'high-gi-meal', name: 'High-GI Carb Meal',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (−8.5 min SOL)',
          keyFinding: 'RCT (Afaghi 2007), n=12: SOL 9.0 vs 17.5 min (p=0.009)',
          whatThisMeans: 'A high-glycemic carb meal ~4 hours before bed nearly halved sleep latency in the original RCT (9 min vs 17.5 min). Timing matters — eaten too close to bed it backfires via reflux and glucose spikes.',
          mechanism: 'Post-prandial tryptophan availability and insulin-mediated LNAA competition increase brain tryptophan → serotonin → melatonin synthesis.',
          dosage: 'High-GI carb meal ~4 hours pre-bed',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/17284739/', label: 'Afaghi et al. 2007 RCT' }
        },
        {
          key: 'mediterranean-diet', name: 'Mediterranean Diet',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'Systematic review: 17/24 studies show positive link',
          whatThisMeans: 'Higher adherence to a Mediterranean-style diet (fish, olive oil, vegetables, legumes) is consistently linked to falling asleep faster across observational studies.',
          mechanism: 'Anti-inflammatory polyphenols, omega-3s, and stable glucose response support melatonin synthesis and reduce nocturnal arousal.',
          dosage: 'Daily dietary pattern',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/38257175/', label: 'Godos et al. 2024 systematic review' }
        },
        {
          key: 'kiwifruit', name: 'Kiwifruit',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (−35.4% SOL)',
          keyFinding: 'RCT (Lin 2011), n=24, 4-week intervention',
          whatThisMeans: 'Eating 2 kiwifruit an hour before bed for 4 weeks shortened sleep onset by 35.4% in adults with sleep disturbances. Small study but the signal is clean.',
          mechanism: 'High serotonin content plus folate, antioxidants, and vitamin C support the serotonin-melatonin synthesis pathway.',
          dosage: '2 kiwifruit, 1 hour before bed',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/21669584/', label: 'Lin et al. 2011 RCT' }
        },
        {
          key: 'dietary-fiber', name: 'Dietary Fiber',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (−12 min SOL)',
          keyFinding: 'RCT (St-Onge 2016): 17 min vs 29 min (high-fiber controlled vs self-selected)',
          whatThisMeans: 'Higher-fiber days predicted falling asleep ~12 minutes faster in a tightly controlled RCT. Fiber, deep sleep, and short sleep latency travel together.',
          mechanism: 'Fiber-driven gut microbiome diversity modulates vagal signaling and systemic inflammation; stable glucose reduces nocturnal cortisol spikes.',
          dosage: '25–35 g/day from whole foods',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/26156950/', label: 'St-Onge et al. 2016 RCT' },
          affiliate: { url: 'https://www.amazon.com/dp/B0BDP24LP4?tag=kygohealthapp-20&th=1', label: 'Dietary Fiber Supplement' , slug: 'fiber-gummies' }
        },
        {
          key: 'saturated-fat', name: 'Saturated Fat',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Same RCT (St-Onge 2016): high-sat-fat meals → 29 min SOL',
          whatThisMeans: 'Days with higher saturated fat intake were linked to longer sleep onset (29 min vs 17 min on the high-fiber controlled arm). Processed, fatty foods near bedtime are the worst offender.',
          mechanism: 'Increased systemic inflammation and disrupted gut microbiota; late-day high-fat meals delay gastric emptying and elevate core temperature.',
          dosage: 'Reduce especially within 3 hours of bed',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/26156950/', label: 'St-Onge et al. 2016 RCT' }
        },
        {
          key: 'caffeine', name: 'Caffeine',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (+9.1 min SOL)',
          keyFinding: 'Meta-analysis of 24 studies (Gardiner 2023)',
          whatThisMeans: 'The biggest sleep-onset killer backed by high-quality data. Meta-analysis of 24 studies found caffeine adds ~9.1 minutes to sleep latency on average, with peak effect ~3 hours after intake. Interestingly, the effect was not moderated by dose or timing in the pooled analysis — any caffeine pushes SOL later.',
          mechanism: 'Adenosine receptor antagonism blocks the homeostatic sleep drive that normally builds across the waking day, delaying sleep onset.',
          dosage: 'Stop ≥8 hours before bed; slow metabolizers may need 10+ hours',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/36870101/', label: 'Gardiner et al. 2023 meta-analysis' }
        },
        {
          key: 'alcohol', name: 'Alcohol',
          direction: 'mixed', evidence: 'strong',
          effect: 'Mixed (dose-dependent)',
          keyFinding: 'Meta-analysis of 27 studies: −6.4 min SOL per 1 g/kg; only at ≥0.85 g/kg (~5 drinks)',
          whatThisMeans: "A 2024 meta-analysis of 27 studies found alcohol only shortens sleep onset at very high doses (roughly 5+ drinks), cutting SOL by ~6.4 min per g/kg. Low and moderate doses don't change sleep onset at all. And even when it does shorten onset, it wrecks the second half of the night.",
          mechanism: 'GABA-A agonism produces rapid sedation at high doses but rebound glutamate and disrupted REM cause mid-night awakenings and lighter sleep.',
          dosage: 'Low/moderate doses null on SOL; heavy use shortens onset but harms later sleep',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/39631226/', label: 'Gardiner et al. 2024 meta-analysis' }
        },
        {
          key: 'nicotine', name: 'Nicotine / Tobacco Smoking',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Review (Jaehne 2009); confirmed in 2024 narrative review',
          whatThisMeans: 'Smokers consistently take longer to fall asleep than non-smokers. Nicotine is a stimulant that also causes nightly withdrawal — a double hit to sleep onset.',
          mechanism: 'Nicotinic acetylcholine receptor activation produces sympathetic arousal and cortical stimulation; overnight withdrawal adds further disruption.',
          dosage: 'Any evening exposure delays onset; vaping and gum count',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/19345124/', label: 'Jaehne et al. 2009 review' }
        },
        {
          key: 'cannabis', name: 'Cannabis (THC/CBD)',
          direction: 'variable', evidence: 'moderate',
          effect: 'Null / inconsistent',
          keyFinding: 'Meta-analysis of 9 studies (Suraev 2025): no consistent SOL effect',
          whatThisMeans: 'Despite how often cannabis is marketed as a sleep aid, a 2025 meta-analysis of 9 controlled studies found no consistent effect on sleep onset. Subjective reports and objective data diverge, and tolerance develops quickly.',
          mechanism: 'CB1 receptor activation is sedative acutely but disrupts sleep architecture and produces tolerance and withdrawal-based insomnia.',
          dosage: 'No reliable sleep-onset effect; avoid chronic use',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/40967124/', label: 'Suraev et al. 2025 meta-analysis' }
        }
      ],
      supplements: [
        {
          key: 'melatonin', name: 'Melatonin',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (−7.06 min SOL)',
          keyFinding: 'Meta-analysis of 19 studies, n=1683 (Ferracioli-Oda 2013)',
          whatThisMeans: 'The best-studied sleep-onset supplement. Pooled across 19 RCTs with 1,683 subjects, melatonin cuts sleep latency by an average of 7.06 minutes (95% CI 4.37–9.75, p<0.001), with peak effect around 4 mg. Best for circadian misalignment (jet lag, shift work, DSPS); less impressive for ordinary insomnia.',
          mechanism: 'Exogenous melatonin binds MT1/MT2 receptors in the SCN, signaling "biological night" and promoting sleep onset.',
          dosage: '0.3–1 mg, 30–60 min before bed (low dose); up to 4 mg if needed',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/23691095/', label: 'Ferracioli-Oda et al. 2013 meta-analysis' },
          affiliate: { url: 'https://www.amazon.com/dp/B08666GMWG?tag=kygohealthapp-20&th=1', label: 'Melatonin Supplement' , slug: 'melatonin-gummies' }
        },
        {
          key: 'ashwagandha', name: 'Ashwagandha',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (SMD −0.53)',
          keyFinding: 'Meta-analysis of 5 RCTs, n=400 (Cheah 2021)',
          whatThisMeans: 'Pooled analysis of 5 RCTs with 400 participants found a standardized mean difference of −0.53 (95% CI −0.77 to −0.29, p<0.001) for sleep onset, with 600 mg/day showing the largest effect. Also reduces anxiety scores, likely part of the mechanism.',
          mechanism: 'Withanolides reduce cortisol and pre-sleep arousal; GABAergic activity may directly promote sleep onset.',
          dosage: '600 mg/day standardized extract (most effective dose)',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/34559859/', label: 'Cheah et al. 2021 meta-analysis' },
          affiliate: { url: 'https://www.amazon.com/dp/B073DN2YG9?tag=kygohealthapp-20&th=1', label: 'Ashwagandha Extract' , slug: 'ashwagandha-600mg' }
        },
        {
          key: 'magnesium', name: 'Magnesium',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (−17.36 min SOL)',
          keyFinding: 'Meta-analysis of 3 RCTs, n=151 older adults (Mah & Pitre 2021)',
          whatThisMeans: 'Pooled across 3 RCTs in 151 older adults, magnesium supplementation cut sleep onset by 17.36 minutes (p=0.0006). Best evidence is in older adults and people with low dietary magnesium. Less clear in already-replete younger people. Glycinate form is better tolerated than oxide.',
          mechanism: 'NMDA receptor antagonism and GABA-A potentiation reduce cortical arousal; regulates melatonin synthesis.',
          dosage: '200–400 mg elemental magnesium (glycinate preferred)',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/33865376/', label: 'Mah & Pitre 2021 meta-analysis' },
          affiliate: { url: 'https://www.amazon.com/dp/B00151G8L8?tag=kygohealthapp-20&th=1', label: 'Magnesium Glycinate' , slug: 'magnesium-glycinate' }
        },
        {
          key: 'glycine', name: 'Glycine',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL on PSG)',
          keyFinding: 'Yamadera 2007: 3 g glycine improved PSG sleep onset',
          whatThisMeans: 'Polysomnography-verified: 3 g glycine taken before bed shortens objective sleep onset and improves subjective sleep quality. Japanese RCTs are small but consistent, and the mechanism is well-characterized.',
          mechanism: 'Peripheral vasodilation lowers core body temperature (a key sleep-onset signal); NMDA modulation in the SCN.',
          dosage: '3 g, 30–60 min before bed',
          source: { url: 'https://onlinelibrary.wiley.com/doi/10.1111/j.1479-8425.2007.00262.x', label: 'Yamadera et al. 2007 PSG study' },
          affiliate: { url: 'https://www.amazon.com/s?k=Glycine%20Powder&rh=p_72%3A1248903011&tag=kygohealthapp-20', label: 'Glycine Powder' , slug: 'glycine-search' }
        },
        {
          key: 'gaba', name: 'GABA',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (13.4 → 5.7 min SOL)',
          keyFinding: 'RCT (Byun 2018): 300 mg cut SOL from 13.4 to 5.7 min (p=0.001)',
          whatThisMeans: 'In a controlled trial, 300 mg of oral GABA dropped sleep onset from 13.4 min to 5.7 min (p=0.001). 75 mg was also effective. The blood-brain barrier debate continues, but the clinical signal is clean.',
          mechanism: 'Likely peripheral vagal afferent signaling; direct CNS effect is debated but enteric GABA receptors appear involved.',
          dosage: '75–300 mg, 30–60 min before bed',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6031986/', label: 'Byun et al. 2018 RCT' },
          affiliate: { url: 'https://www.amazon.com/dp/B0FT6GB5MB?tag=kygohealthapp-20&th=1', label: 'GABA Supplement' , slug: 'gaba-500mg' }
        },
        {
          key: 'l-theanine', name: 'L-Theanine',
          direction: 'variable', evidence: 'moderate',
          effect: 'Subjective only (SMD 0.15)',
          keyFinding: 'Meta-analysis of 10 RCTs, n=897 (Bulman 2025)',
          whatThisMeans: "Meta-analysis of 10 RCTs in 897 people found a small subjective benefit (SMD 0.15, p=0.04) but no objective sleep-onset effect on polysomnography. People report feeling more relaxed, but the SOL reduction doesn't show up on instruments.",
          mechanism: 'Increases alpha brain waves and GABA/glutamate ratio; reduces cortisol and sympathetic tone without sedation.',
          dosage: '200–400 mg, 30–60 min before bed',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/40056718/', label: 'Bulman et al. 2025 meta-analysis' },
          affiliate: { url: 'https://www.amazon.com/dp/B000H7P9M0?tag=kygohealthapp-20&th=1', label: 'L-Theanine 200mg' , slug: 'l-theanine-200mg' }
        },
        {
          key: 'cbd-isolate', name: 'CBD Isolate',
          direction: 'variable', evidence: 'moderate',
          effect: 'Null',
          keyFinding: 'RCT (Narayan 2024): 150 mg CBD, n=30 insomnia — null',
          whatThisMeans: "A 2024 controlled trial of 150 mg CBD isolate in 30 people with insomnia found no effect on sleep onset. Despite heavy marketing, isolated CBD doesn't reliably shorten SOL. Anxious subgroups may see indirect benefits but don't expect a direct sleep-onset effect.",
          mechanism: 'CB1 modulation and serotonin 5-HT1A agonism; dose-response is biphasic and largely anxiolytic rather than sedative.',
          dosage: 'No established dose for sleep onset',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/38174873/', label: 'Narayan et al. 2024 RCT' }
        }
      ],
      exercise: [
        {
          key: 'regular-exercise', name: 'Regular Exercise',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (moderate SOL reduction)',
          keyFinding: 'Meta-analysis (Kredlow 2015): consistent SOL improvement',
          whatThisMeans: 'Regular moderate exercise (cardio or mixed) is one of the most reliably effective behavioral interventions for sleep onset. Works even better for people with insomnia than for good sleepers.',
          mechanism: 'Raises daytime energy expenditure and afternoon core temperature; reduces anxiety; supports circadian amplitude.',
          dosage: '150+ min/week moderate intensity, consistent',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/25596964/', label: 'Kredlow et al. 2015 meta-analysis' }
        },
        {
          key: 'yoga', name: 'Yoga',
          direction: 'positive', evidence: 'strong',
          effect: "Positive (Cohen's d ≈ −1.16)",
          keyFinding: 'Large effect on SOL in chronic insomnia (Khalsa 2021)',
          whatThisMeans: "One of the largest single-intervention effect sizes for sleep onset in the entire dataset. Cohen's d ≈ −1.16 in chronic sleep-onset insomnia. The breathing component likely drives most of the benefit.",
          mechanism: 'Pranayama breathing reduces sympathetic tone and cortical arousal; physical practice raises daytime energy expenditure.',
          dosage: 'Regular practice; daily short sessions or 3+ longer sessions/week',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/33983112/', label: 'Khalsa et al. 2021 RCT' }
        },
        {
          key: 'tai-chi', name: 'Tai Chi',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'Meta-analysis (Yang 2023): SOL improved in older adults',
          whatThisMeans: 'Especially well-studied in older adults. Pooled analyses show meaningful sleep-onset improvements from regular tai chi practice. Low-impact and easy to adopt for people who can\'t do vigorous exercise.',
          mechanism: 'Combines mindful movement, slow breathing, and gentle physical load — reduces arousal and supports circadian entrainment.',
          dosage: '2–3 sessions per week, 45–60 min',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/36767655/', label: 'Yang et al. 2023 meta-analysis' }
        },
        {
          key: 'resistance-training', name: 'Resistance Training',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'Review (Kovacevic 2018): modest SOL reduction',
          whatThisMeans: 'Lifting weights helps sleep onset, though the effect is smaller than cardio or yoga. Older adults and insomniacs benefit most. Works on its own or stacked with cardio.',
          mechanism: 'Raises daytime energy expenditure and growth hormone release; mechanical fatigue increases homeostatic sleep pressure.',
          dosage: '2–3 sessions per week, progressive overload',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/28919335/', label: 'Kovacevic et al. 2018 review' }
        },
        {
          key: 'vigorous-late', name: 'Vigorous Exercise <1h Pre-Bed',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Meta-analysis (Stutz 2019): high-intensity <1h delays onset',
          whatThisMeans: "Moderate exercise any time of day is fine, but truly vigorous effort in the last hour before bed measurably delays sleep onset. Most people can train in the evening — it's only the high-intensity, close-to-bed combo that's a problem.",
          mechanism: 'Sympathetic activation, elevated core temperature, and catecholamine surge oppose the physiological drop needed for sleep onset.',
          dosage: 'Avoid high-intensity exercise in the hour before bed',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/30374942/', label: 'Stutz et al. 2019 meta-analysis' }
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
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/31102877/', label: 'Haghayegh et al. 2019 meta-analysis' }
        },
        {
          key: 'hot-bedroom', name: 'Hot Bedroom (>25°C)',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Thermoregulation review: elevated ambient heat delays sleep onset',
          whatThisMeans: 'A hot bedroom prevents the core-body-temperature drop that triggers sleep onset. Most sleep research points to ~18–20°C (65–68°F) as the sweet spot for fast onset; above ~25°C, latency consistently lengthens.',
          mechanism: 'Elevated ambient temperature blocks heat loss from the skin, preventing the core temperature drop required for sleep initiation.',
          dosage: 'Keep bedroom at 18–20°C (65–68°F)',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/22738673/', label: 'Okamoto-Mizuno & Mizuno 2012 thermoregulation review' }
        },
        {
          key: 'bright-light-evening', name: 'Bright Light in Hour Before Bed',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (delays melatonin)',
          keyFinding: 'Cajochen 2022: room-level light suppresses and delays melatonin',
          whatThisMeans: "Just normal indoor room lighting in the hour before bed is enough to suppress and delay melatonin, pushing sleep onset later. You don't need to be scrolling your phone — the ceiling lights alone are doing it.",
          mechanism: 'Melanopsin-containing retinal ganglion cells detect evening light and suppress SCN-driven melatonin release.',
          dosage: 'Dim lights below ~30 lux in the hour before bed; use warm-tone lighting',
          source: { url: 'https://journals.sagepub.com/doi/10.1177/07487304221100826', label: 'Cajochen et al. 2022' },
          affiliate: { url: 'https://www.amazon.com/dp/B07W781XWF?tag=kygohealthapp-20&th=1', label: 'Blue Light Blocking Glasses' , slug: 'blue-light-glasses' }
        },
        {
          key: 'noise', name: 'Environmental Noise',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Basner & McGuire 2018: nighttime noise delays sleep onset',
          whatThisMeans: 'Ambient noise above ~30 dB measurably delays sleep onset and fragments sleep. Traffic, aircraft, and neighborhood noise all show dose-response effects. White/pink noise or earplugs help mask it when the source is unavoidable.',
          mechanism: 'Auditory cortex activation keeps the brain partially alert; autonomic arousal prevents transition to NREM sleep.',
          dosage: 'Keep bedroom <30 dB; use earplugs or masking if needed',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5877064/', label: 'Basner & McGuire 2018' },
          affiliate: { url: 'https://www.amazon.com/dp/B07RWRJ4XW?tag=kygohealthapp-20', label: 'White Noise Machine' , slug: 'white-noise-machine' }
        },
        {
          key: 'stimulus-control', name: 'Stimulus Control Therapy',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (large effect)',
          keyFinding: 'Meta-analysis (Jansson-Fröjmark 2023): large SOL effect vs controls',
          whatThisMeans: "The 'bed is for sleep only' rule. If you're awake more than ~20 minutes, get up and return only when sleepy. Among the best-studied behavioral treatments for sleep onset, with large effect sizes vs passive controls.",
          mechanism: 'Reconditions the bed as a sleep cue rather than a wakefulness/worry cue; reduces anticipatory arousal at bedtime.',
          dosage: 'Core CBT-I component; practiced nightly',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/37496454/', label: 'Jansson-Fröjmark et al. 2023 meta-analysis' }
        },
        {
          key: 'consistent-schedule', name: 'Consistent Sleep/Wake Schedule',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (immediate)',
          keyFinding: 'Chaput 2020: regularity predicts shorter SOL',
          whatThisMeans: 'A consistent wake time (even more than bedtime) trains your circadian system to release melatonin and drop body temperature at the right time. One of the few sleep-onset fixes that can help the very first night.',
          mechanism: 'Stable morning light exposure and wake time entrain the SCN, anchoring evening melatonin onset and core temperature rhythm.',
          dosage: 'Fix your wake time within a 30-min window daily',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/33054339/', label: 'Chaput et al. 2020 review' }
        }
      ],
      physiology: [
        {
          key: 'older-age', name: 'Older Age',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Ohayon 2004 meta-analysis: SOL rises progressively with age',
          whatThisMeans: 'Sleep onset latency gets longer with age even in healthy older adults. Expected, not pathological — but it compounds with other age-related sleep changes like more awakenings and lighter sleep.',
          mechanism: 'Age-related decline in SCN amplitude, reduced nocturnal melatonin, and lighter sleep architecture all extend time to sleep onset.',
          dosage: 'Non-modifiable; sleep hygiene, morning light, and exercise offset',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/15586779/', label: 'Ohayon et al. 2004 meta-analysis' }
        },
        {
          key: 'evening-chronotype', name: 'Evening Chronotype',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (later onset)',
          keyFinding: 'Duffy 1999: phase-delayed circadian markers in night owls',
          whatThisMeans: "Night owls genuinely fall asleep later — it's not laziness, it's a shifted circadian rhythm. Forcing an early bedtime just means lying awake. Morning bright light exposure plus low-dose evening melatonin can phase-advance the clock earlier.",
          mechanism: 'Shifted SCN phase produces later melatonin onset, later core temperature nadir, and later optimal sleep window.',
          dosage: 'Non-modifiable base; morning light + evening dim can phase-advance',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3630920/', label: 'Duffy et al. 1999' }
        },
        {
          key: 'menopausal-hot-flashes', name: 'Menopausal Hot Flashes',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Baker 2024 AJOG; Pan 2025: vasomotor symptoms delay sleep onset',
          whatThisMeans: "Hot flashes and night sweats during the menopausal transition make it measurably harder to fall asleep. It's a thermoregulatory disruption of the exact core-temp-drop mechanism sleep onset depends on. HRT and cooling strategies both help.",
          mechanism: 'Vasomotor episodes disrupt the core temperature decline required for sleep onset; wakefulness is directly triggered by heat surge.',
          dosage: 'Address via HRT, cooling, and CBT-I where appropriate',
          source: { url: 'https://www.ajog.org/article/S0002-9378(24)00404-5/fulltext', label: 'Baker et al. 2024 AJOG' }
        },
        {
          key: 'cognitive-arousal', name: 'Pre-Sleep Cognitive Arousal',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Wuyts 2011; Kalmbach 2021: cognitive arousal is the strongest modifiable predictor',
          whatThisMeans: "Racing thoughts, rumination, and worry about not sleeping are the #1 modifiable cause of prolonged sleep onset in insomnia. Fix the mind-racing and everything else gets easier. It's why CBT-I outperforms sleeping pills long-term.",
          mechanism: 'Cortical arousal and sympathetic activation from worry directly oppose the decline in EEG activity required for sleep onset.',
          dosage: 'Addressed via CBT-I, cognitive restructuring, paradoxical intention',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/21963535/', label: 'Wuyts et al. 2011' }
        },
        {
          key: 'anxiety', name: 'Generalized Anxiety Disorder',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'PSG studies in GAD consistently show delayed sleep onset',
          whatThisMeans: 'Clinical anxiety consistently delays sleep onset. Treating the underlying anxiety (CBT, SSRIs) typically resolves the sleep-onset problem without needing separate sleep-focused treatment.',
          mechanism: 'Elevated baseline sympathetic tone and HPA-axis activity increase pre-sleep arousal and shift sleep onset later.',
          dosage: 'Treat underlying disorder',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8212183/', label: 'Kalmbach et al. 2021 review' }
        },
        {
          key: 'depression', name: 'Depression',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Nutt 2008; Thase 2006: ~75% of depressed patients report delayed onset',
          whatThisMeans: 'Depression and insomnia are bidirectional — each worsens the other. About 3 in 4 people with depression struggle with sleep onset. Treating depression improves sleep, but addressing sleep directly with CBT-I also improves depression outcomes.',
          mechanism: 'HPA dysregulation, altered serotonin/melatonin pathways, and rumination all delay sleep initiation.',
          dosage: 'Treat underlying disorder; CBT-I often helpful alongside',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3181883/', label: 'Nutt et al. 2008 review' }
        }
      ]
    };
  }

  // ── Top Picks ───────────────────────────────────────────────────────

  get _topPicks() {
    return [
      { icon: 'moon',     label: 'Best Single Habit',         answer: 'Warm bath 1–2h pre-bed',  note: '13 RCTs; cuts sleep onset ~10 min via distal vasodilation and core-temp drop',          stat: '−10 min SOL',     category: 'Environment' },
      { icon: 'dumbbell', label: 'Best Exercise',             answer: 'Yoga',                    note: "Cohen's d ≈ −1.16 for SOL in chronic sleep-onset insomnia (Khalsa 2021)",               stat: 'd ≈ −1.16',       category: 'Exercise' },
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
              ${f.affiliate ? `<a href="${f.affiliate.url}" class="factor-affiliate" target="_blank" rel="noopener sponsored" data-track-label="${f.affiliate.slug}">
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

  get _srcGroups() {
    const groups = {
      'Nutrition & Substances': [
        { label: 'Afaghi et al. 2007 — High-GI carb meal & SOL RCT (n=12; 9.0 vs 17.5 min)', url: 'https://pubmed.ncbi.nlm.nih.gov/17284739/' },
        { label: 'Godos et al. 2024 — Mediterranean diet & sleep systematic review (17/24 studies positive)', url: 'https://pubmed.ncbi.nlm.nih.gov/38257175/' },
        { label: 'Lin et al. 2011 — Kiwifruit & sleep RCT (n=24, −35.4% SOL)', url: 'https://pubmed.ncbi.nlm.nih.gov/21669584/' },
        { label: 'St-Onge et al. 2016 — Fiber, saturated fat & SOL RCT (17 vs 29 min)', url: 'https://pubmed.ncbi.nlm.nih.gov/26156950/' },
        { label: 'Gardiner et al. 2023 — Caffeine & sleep meta-analysis (24 studies, +9.1 min SOL)', url: 'https://pubmed.ncbi.nlm.nih.gov/36870101/' },
        { label: 'Gardiner et al. 2024 — Alcohol & sleep meta-analysis (27 studies)', url: 'https://pubmed.ncbi.nlm.nih.gov/39631226/' },
        { label: 'Jaehne et al. 2009 — Nicotine & sleep review', url: 'https://pubmed.ncbi.nlm.nih.gov/19345124/' },
        { label: 'Suraev et al. 2025 — Cannabis & sleep meta-analysis (9 studies, null SOL)', url: 'https://pubmed.ncbi.nlm.nih.gov/40967124/' }
      ],
      'Supplements': [
        { label: 'Ferracioli-Oda et al. 2013 — Melatonin meta-analysis (19 studies, n=1683, −7.06 min)', url: 'https://pubmed.ncbi.nlm.nih.gov/23691095/' },
        { label: 'Cheah et al. 2021 — Ashwagandha & sleep meta-analysis (5 RCTs, SMD −0.53)', url: 'https://pubmed.ncbi.nlm.nih.gov/34559859/' },
        { label: 'Mah & Pitre 2021 — Magnesium & sleep meta-analysis (3 RCTs, −17.36 min)', url: 'https://pubmed.ncbi.nlm.nih.gov/33865376/' },
        { label: 'Yamadera et al. 2007 — Glycine 3 g & PSG sleep-onset study', url: 'https://onlinelibrary.wiley.com/doi/10.1111/j.1479-8425.2007.00262.x' },
        { label: 'Byun et al. 2018 — GABA supplementation RCT (300 mg, 13.4→5.7 min)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6031986/' },
        { label: 'Bulman et al. 2025 — L-Theanine meta-analysis (10 RCTs, subjective only)', url: 'https://pubmed.ncbi.nlm.nih.gov/40056718/' },
        { label: 'Narayan et al. 2024 — CBD isolate & insomnia RCT (null SOL)', url: 'https://pubmed.ncbi.nlm.nih.gov/38174873/' }
      ],
      'Exercise & Movement': [
        { label: 'Kredlow et al. 2015 — Exercise & sleep meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/25596964/' },
        { label: 'Khalsa et al. 2021 — Yoga for chronic insomnia RCT (d ≈ −1.16)', url: 'https://pubmed.ncbi.nlm.nih.gov/33983112/' },
        { label: 'Yang et al. 2023 — Tai Chi & sleep meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/36767655/' },
        { label: 'Kovacevic et al. 2018 — Resistance training & sleep review', url: 'https://pubmed.ncbi.nlm.nih.gov/28919335/' },
        { label: 'Stutz et al. 2019 — Evening exercise & sleep meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/30374942/' }
      ],
      'Environment & Sleep Hygiene': [
        { label: 'Haghayegh et al. 2019 — Warm bath & sleep meta-analysis (13 RCTs, −10 min SOL)', url: 'https://pubmed.ncbi.nlm.nih.gov/31102877/' },
        { label: 'Okamoto-Mizuno & Mizuno 2012 — Thermoregulation & sleep review', url: 'https://pubmed.ncbi.nlm.nih.gov/22738673/' },
        { label: 'Cajochen et al. 2022 — Evening light & melatonin suppression', url: 'https://journals.sagepub.com/doi/10.1177/07487304221100826' },
        { label: 'Basner & McGuire 2018 — WHO review of nighttime noise & sleep', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5877064/' },
        { label: 'Jansson-Fröjmark et al. 2023 — Stimulus control meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/37496454/' },
        { label: 'Chaput et al. 2020 — Sleep regularity & health review', url: 'https://pubmed.ncbi.nlm.nih.gov/33054339/' }
      ],
      'Demographics & Physiology': [
        { label: 'Ohayon et al. 2004 — Normative sleep parameters meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/15586779/' },
        { label: 'Duffy et al. 1999 — Chronotype & phase-delayed circadian markers', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3630920/' },
        { label: 'Baker et al. 2024 — Menopause, vasomotor symptoms & sleep (AJOG)', url: 'https://www.ajog.org/article/S0002-9378(24)00404-5/fulltext' },
        { label: 'Wuyts et al. 2011 — Pre-sleep cognitive arousal & SOL', url: 'https://pubmed.ncbi.nlm.nih.gov/21963535/' },
        { label: 'Kalmbach et al. 2021 — Cognitive arousal & insomnia review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8212183/' },
        { label: 'Nutt et al. 2008 — Depression & sleep review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3181883/' }
      ]
    };
    return groups;
  }

  // Flat source list for the standard sources module: the topic group becomes
  // the card's tag, and a trailing "(…)" in the label becomes the citation line.
  get _sources() {
    const out = [];
    for (const [tag, items] of Object.entries(this._srcGroups)) {
      for (const s of items) {
        const m = s.label.match(/^(.*\S)\s*\(([^()]*)\)\s*$/);
        out.push({ tag, title: m ? m[1] : s.label, cite: m ? m[2] : '', url: s.url });
      }
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

  // Related tools · Kygo standard module ────────────────────────────────
  // Exactly 3 cards: a near neighbour, a bridge between accuracy and
  // physiology, and one from another family. Never links this page to
  // itself, and never links the Food Scanner.

  _relatedTools() {
    return [
      {
        title: 'Staying Asleep Factors',
        blurb: '27 research-backed factors that affect whether you stay asleep through the night.',
        url: 'https://www.kygo.app/tools/staying-asleep-factors',
        meta: 'Sleep · 27 factors',
        motif: { motif: 'ranked', caption: 'Factors ranked by evidence' }
      },
      {
        title: 'Supplements by Metric',
        blurb: 'Pick a wearable metric and see which of 27 supplements the research actually supports.',
        url: 'https://www.kygo.app/tools/supplements-by-metric',
        meta: 'Nutrition · 28 sources',
        motif: { motif: 'ranked', caption: 'Graded by evidence' }
      },
      {
        title: 'Sleep Metrics Comparison',
        blurb: 'Compare 38 sleep metrics tracked by Oura, Fitbit, Apple Watch and Garmin across 10 categories.',
        url: 'https://www.kygo.app/tools/sleep-metrics',
        meta: 'Sleep · 29 sources',
        motif: { motif: 'dots', caption: 'Metrics tracked', dots: [{ label: 'Oura', n: 9 }, { label: 'Garmin', n: 7 }, { label: 'Apple', n: 6 }, { label: 'Fitbit', n: 5 }] }
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
      .rt-section.rt-gray{background:var(--kygo-light,var(--gray-100,#F8FAFC))}
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
      slug: 'sleep-latency-factors',
      headline: `Stop guessing what's <span>keeping you awake.</span>`,
      sub: `These factors are averages. Kygo correlates your own meals, caffeine and alcohol with how fast you actually fall asleep.`
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
      .kc-section.kc-gray{background:var(--kygo-light,var(--gray-100,#F8FAFC))}
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
    return { source: 'tool-sleep-latency-factors', variant: 'factors' };
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
      .ke-section.ke-gray{background:var(--kygo-light,var(--gray-100,#F8FAFC))}
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
    const iosUrl = 'https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <!-- Header -->
      <header class="header">
        <div class="header-inner">
          <a href="https://www.kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" />
            Sleep Latency
          </a>
          <div class="nav-cta-group">
            <a href="${iosUrl}" class="nav-store-btn nav-store-ios cta-primary" data-track-label="subnav-get-app-ios" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on the App Store"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg><span>iOS</span></a>
            <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" class="nav-store-btn nav-store-android cta-android" data-action="android-download" data-track-label="subnav-get-app-android" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on Google Play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg><span>Android</span></a>
          </div>
        </div>
      </header>

      <!-- Hero -->
      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill animate-on-scroll"><span class="dot"></span> ${hs.total} FACTORS · ${hs.cats} CATEGORIES · PEER-REVIEWED</div>
              <h1 class="animate-on-scroll">What actually helps you <span class="hl">fall asleep faster?</span></h1>
              <p class="hero-lede animate-on-scroll">Every nutrition choice, supplement, habit and environmental tweak with a measured effect on sleep onset — <strong>ranked by evidence strength</strong>, in the minutes it adds to or removes from the time it takes you to drop off.</p>
            </div>
            <div class="hero-vis animate-on-scroll">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> Two choices, same night</span>
                <span class="hero-vis-tag">minutes to sleep</span>
              </div>
              <div class="hv-two">
                <div class="hv-col">
                  <span class="hv-label">Warm bath</span>
                  <span class="hv-val good">−10<span class="unit">min</span></span>
                  <div class="hv-bar"><span class="hv-fill good" style="width:100%"></span></div>
                  <span class="hv-cap good">1–2 h before bed</span>
                </div>
                <div class="hv-col">
                  <span class="hv-label">Late caffeine</span>
                  <span class="hv-val">+9.1<span class="unit">min</span></span>
                  <div class="hv-bar"><span class="hv-fill" style="width:91%"></span></div>
                  <span class="hv-cap">Within 6 h of bed</span>
                </div>
              </div>
              <span class="hv-foot">Change in sleep onset latency · both strong-evidence, both under your control</span>
            </div>
          </div>
          <div class="hero-stats animate-on-scroll">
            <div class="hero-stat"><div class="num">${hs.total}</div><div class="lbl">Factors analysed</div></div>
            <div class="hero-stat"><div class="num">${hs.help}</div><div class="lbl">Help you drop off faster</div></div>
            <div class="hero-stat"><div class="num">${hs.hurt}</div><div class="lbl">Keep you lying awake</div></div>
            <div class="hero-stat"><div class="num">${hs.sources}</div><div class="lbl">Peer-reviewed sources</div></div>
          </div>
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
      ${this._renderAppCta('gray')}


      <!-- Early contextual CTA -->


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
      ${this._renderEmailCta()}


      <!-- Blog CTA -->
      <section class="blog-cta-section">
        <div class="container">
          <div class="blog-cta animate-on-scroll">
            <div class="blog-cta-glow"></div>
            <div class="blog-cta-content">
              <div class="blog-cta-badge"><span class="pulse-dot"></span>Free Forever Plan</div>
              <h2>See How Your Food Affects Your <span class="highlight">Sleep</span></h2>
              <p>Kygo Health connects your wearable data with nutrition tracking to surface personal correlations between what you eat and how you sleep, recover, and perform.</p>
              <div class="blog-cta-buttons">
                <a href="${iosUrl}" class="blog-cta-btn cta-primary" data-track-position="footer-cta" data-track-label="sleep-latency-footer-ios" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </a>
                <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" target="_blank" rel="noopener" class="cta-android" data-action="android-download" data-track-position="footer-cta" data-track-label="sleep-latency-footer-android">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                  Download for Android
                </a>
              </div>
              <p style="margin:14px 0 0;font-size:13px;line-height:1.5;color:#94A3B8;text-align:center;">Free plan available. Save 50% on yearly. Cancel anytime.</p>
              <div class="blog-cta-tags">
                <span>Works with</span>
                <img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura" loading="lazy" />
                <img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple" loading="lazy" />
                <img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit" loading="lazy" />
                <img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin" loading="lazy" />
                <img src="https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png" alt="Google Health" loading="lazy" />
                <img src="https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png" alt="Health Connect" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sources -->
      ${this._renderRelatedTools('gray')}

      <section class="sources-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Sources</h2>
          <p class="section-sub animate-on-scroll">All data sourced from peer-reviewed studies and meta-analyses.</p>
          <div class="sources-wrap animate-on-scroll">${this._renderSources()}</div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="tool-footer">
        <div class="container">
          <a href="https://www.kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" loading="lazy" />
            Kygo Health
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
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

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


      /* ── Sources ── */
      .sources-section { padding: 48px 0; }
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
      .blog-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; white-space:nowrap; }
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
      .kearly-section { padding: 48px 16px; }
      .kband { max-width: 1100px; margin: 0 auto; }
      .kband-inner { position: relative; overflow: hidden; background: #fff; border: 2px solid #E2E8F0; border-radius: 20px; padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; gap: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
      .kband-glow { position: absolute; top: -120px; right: -80px; width: 360px; height: 360px; background: radial-gradient(circle, rgba(34,197,94,0.14), transparent 65%); pointer-events: none; }
      .kband-copy { position: relative; display: flex; flex-direction: column; gap: 10px; max-width: 620px; }
      .kband-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 12px; letter-spacing: 0.7px; text-transform: uppercase; color: #16A34A; }
      .kband-dot { width: 7px; height: 7px; border-radius: 50%; background: #22C55E; animation: kygoPulse 2s ease-out infinite; }
      .kband-headline { margin: 0; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 24px; line-height: 1.3; color: #1E293B; }
      .kband-actions { position: relative; display: flex; flex-wrap: wrap; gap: 12px; flex-shrink: 0; }
      .kband-note { flex-basis: 100%; width: 100%; margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: #475569; text-align: center; }
      .kband-btn { display: inline-flex; align-items: center; gap: 9px; text-decoration: none; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; padding: 15px 24px; border-radius: 12px; white-space: nowrap; transition: transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease; }
      .kband-btn svg { width: 17px; height: 17px; flex-shrink: 0; }
      .kband-btn-ios { background: #22C55E; color: #fff; box-shadow: 0 6px 16px rgba(34,197,94,0.28); }
      .kband-btn-ios:hover { background: #16A34A; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(34,197,94,0.3); }
      .kband-btn-android { background: #fff; color: #16A34A; border: 2px solid #E2E8F0; }
      .kband-btn-android:hover { border-color: #22C55E; transform: translateY(-2px); }
      @keyframes kygoPulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.55); } 70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }
      @media (max-width: 720px) {
        .kband-inner { flex-direction: column; align-items: flex-start; gap: 22px; padding: 28px 24px; }
        .kband-actions { width: 100%; flex-direction: column; }
        .kband-btn { width: 100%; justify-content: center; }
      }
      @media (prefers-reduced-motion: reduce) { .kband-dot { animation: none; } }
      .kearly { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.3); border-radius: 16px; padding: 24px 20px; text-align: center; max-width: 780px; margin: 0 auto; }
      .kearly-copy { font-size: 16px; line-height: 1.5; font-weight: 500; margin: 0 0 16px; color: var(--dark); }
      .kearly-btns { display: flex; flex-direction: column; gap: 10px; align-items: center; }
      .kearly-btns > a { width: 100%; max-width: 320px; justify-content: center; min-height: 48px; }
      @media (min-width: 520px) { .kearly-btns { flex-direction: row; justify-content: center; } .kearly-btns > a { width: auto; } }

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
      // Sources · show-all toggle
      if (e.target.closest('[data-src-toggle]')) { this._toggleSources(); return; }

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
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes — regular moderate exercise consistently shortens sleep onset in meta-analyses. Yoga has the single largest effect size in the dataset (Cohen\'s d ≈ −1.16 for chronic sleep-onset insomnia per Khalsa 2021). Tai Chi, resistance training, and moderate cardio all help. The one exception: vigorous exercise within ~1 hour of bedtime delays onset due to sympathetic arousal and elevated core temperature.' }
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
