/**
 * Kygo Health — Staying Asleep Factor Explorer
 * Tag: kygo-staying-asleep-factors
 * Interactive tool exploring 31 research-backed factors that affect sleep maintenance
 * (WASO, sleep arousals, fragmentation, sleep efficiency) across 5 categories
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

class KygoStayingAsleepFactors extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._view = 'chart';
    this._catFilter = null;
    this._chartSelectedKey = null;
    this._listSort = 'impact';
    this._listExpandedKey = null;
    this._eventsBound = false;
  }

  connectedCallback() {
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, 'Staying Asleep Factor Explorer by Kygo Health. Explore 31 research-backed factors that affect sleep maintenance — wake after sleep onset (WASO), nighttime arousals, sleep fragmentation, and sleep efficiency — across 5 categories: Nutrition & Substances, Supplements, Exercise & Movement, Environment & Sleep Hygiene, and Demographics & Physiology. Nutrition factors include dietary fiber (reduces arousals per St-Onge 2016), sugar and refined carbs (increases arousals), caffeine (+12 min WASO per Gardiner 2023 meta-analysis), alcohol-driven sleep fragmentation (Spadola 2019 Jackson Heart Study), late eating (2–2.6× WASO odds per Crispim 2022), and tart cherry juice (−17 min WASO per Pigeon 2010 RCT). Supplements include immediate-release melatonin (no WASO effect per Menczel Schrire 2022), ashwagandha 600 mg (SMD −0.39 for WASO per Cheah 2021), glycine 3 g (PSG-verified WASO reduction), magnesium 500 mg, L-theanine, and valerian root (no consistent objective WASO benefit). Exercise factors include moderate aerobic exercise (−10 min WASO per Riedel 2024), resistance training, yoga, evening moderate exercise, and vigorous exercise within one hour of bedtime (+21.9 min WASO per Stutz 2019). Environment factors include bedroom temperature 20–25°C, light at night (even 5–10 lux increases WASO per Cho 2016), noise above 50 dBA (+30 min WASO per Basner 2018 WHO review), CO2 above 1000 ppm (Kang 2024 ventilation study), and mattress firmness. Demographics and physiology factors include aging (+10 min WASO per decade per Ohayon 2004), female sex subjective–objective paradox, menopausal hot flashes (Joffe 2013 GnRH model, 69% of flashes cause awakenings), obesity BMI 30 or higher (Zhao 2021 Sleep Heart Health Study), shift work sleep disorder, nocturia with two or more episodes (+34 min WASO per Fung 2017 SOF study), obstructive sleep apnea, chronic pain (Mathias 2018 meta-analysis of 37 studies), and psychological stress via cortisol elevation. Each factor includes evidence grade (Strong, Moderate, Limited, or Weak), direction of effect, mechanism, dosage or context, and peer-reviewed citation. How to stay asleep through the night. What causes waking up at night. WASO wake after sleep onset. Best supplements for staying asleep. Data sourced from peer-reviewed studies and meta-analyses.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  get _categories() {
    return {
      nutrition:   { name: 'Nutrition & Substances',      icon: 'salad',    count: 6 },
      supplements: { name: 'Supplements',                 icon: 'pill',     count: 6 },
      exercise:    { name: 'Exercise & Movement',         icon: 'dumbbell', count: 5 },
      environment: { name: 'Environment & Sleep Hygiene', icon: 'moon',     count: 5 },
      physiology:  { name: 'Demographics & Physiology',   icon: 'users',    count: 9 }
    };
  }

  get _factors() {
    return {
      nutrition: [
        {
          key: 'dietary-fiber', name: 'Dietary Fiber',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (↓ arousals)',
          keyFinding: 'St-Onge 2016; n=26, PSG, controlled crossover',
          whatThisMeans: 'A tightly controlled inpatient study with polysomnography found higher-fiber days independently predicted fewer sleep arousals. Fiber is one of the strongest dietary signals for staying asleep through the night.',
          mechanism: 'Stable overnight glucose, lower systemic inflammation, and microbiome-driven vagal tone reduce the arousals that fragment deep sleep.',
          dosage: '25–35 g/day from whole foods',
          source: { url: 'https://jcsm.aasm.org/doi/10.5664/jcsm.5384', label: 'St-Onge et al. 2016' },
          affiliate: { url: 'https://www.amazon.com/dp/B0BDP24LP4?tag=kygohealthapp-20&th=1', label: 'Dietary Fiber Supplement' , slug: 'fiber-gummies' }
        },
        {
          key: 'sugar', name: 'Sugar / Refined Carbs',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (↑ arousals)',
          keyFinding: 'St-Onge 2016; significant independent predictor of arousals',
          whatThisMeans: 'In the same PSG-verified study, higher sugar intake directly increased nighttime arousals — independently of fiber. Refined carb–heavy days fragment sleep even when total sleep time is unchanged.',
          mechanism: 'Overnight glucose swings trigger sympathetic arousal; insulin/cortisol counter-regulation produces mid-night awakenings.',
          dosage: 'Minimize added sugar, especially after dinner',
          source: { url: 'https://jcsm.aasm.org/doi/10.5664/jcsm.5384', label: 'St-Onge et al. 2016' }
        },
        {
          key: 'caffeine', name: 'Caffeine',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (+12 min WASO)',
          keyFinding: 'Meta-analysis of 24 studies, 13 reporting WASO (Gardiner 2023)',
          whatThisMeans: 'The most robust evidence for a sleep-maintenance disruptor. Pooled across 24 studies, caffeine added roughly 12 minutes of time awake after sleep onset — on top of lengthening sleep latency. Slow metabolizers and late-day intake see larger effects.',
          mechanism: 'Adenosine receptor antagonism blocks the homeostatic pressure that keeps you in consolidated sleep, producing lighter sleep and more spontaneous arousals.',
          dosage: 'Stop ≥8 hours before bed; slow metabolizers may need 10+ hours',
          source: { url: 'https://www.sciencedirect.com/science/article/pii/S1087079223000205', label: 'Gardiner et al. 2023 meta-analysis' }
        },
        {
          key: 'alcohol', name: 'Alcohol',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (↑ fragmentation)',
          keyFinding: 'Jackson Heart Study, n=785, actigraphy (Spadola 2019)',
          whatThisMeans: "Alcohol may help you fall asleep faster at high doses, but it wrecks the second half of the night. As it metabolizes, sleep breaks apart — more awakenings, lower sleep efficiency, and lighter sleep. The effect scales with dose.",
          mechanism: 'Initial GABA-A sedation is followed by rebound glutamate activity and disrupted REM as alcohol clears, producing mid-night arousals and shallower sleep.',
          dosage: 'Avoid within 3+ hours of bed; lower the dose or skip entirely',
          source: { url: 'https://academic.oup.com/sleep/article/42/11/zsz136/5535848', label: 'Spadola et al. 2019' }
        },
        {
          key: 'late-eating', name: 'Late Eating (<1 hr pre-bed)',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (2–2.6× WASO odds)',
          keyFinding: 'American Time Use Survey analysis (Crispim 2022)',
          whatThisMeans: 'Eating in the hour before bed more than doubled the odds of prolonged wake time after sleep onset. Late meals delay core temperature drop and raise the risk of reflux-driven awakenings.',
          mechanism: 'Active digestion elevates core body temperature and sympathetic activity; reflux and glucose swings drive mid-night arousal.',
          dosage: 'Finish eating 2–3 hours before bed',
          source: { url: 'https://www.cambridge.org/core/journals/british-journal-of-nutrition/article/associations-between-bedtime-eating-or-drinking-sleep-duration-and-wake-after-sleep-onset-findings-from-the-american-time-use-survey/72A5D22C25A35FA975A5B50991431E0C', label: 'Crispim et al. 2022' }
        },
        {
          key: 'tart-cherry', name: 'Tart Cherry Juice',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (−17 min WASO)',
          keyFinding: 'RCT crossover, n=15 adults with insomnia (Pigeon 2010)',
          whatThisMeans: 'A small but clean pilot RCT found tart cherry juice cut WASO by about 17 minutes versus placebo in older adults with insomnia. Needs replication at larger scale, but the mechanism is plausible and the signal is direct.',
          mechanism: 'Naturally occurring melatonin and tryptophan plus anti-inflammatory anthocyanins support consolidated overnight sleep.',
          dosage: '240 mL (8 oz) twice daily; morning and 1–2 hrs pre-bed',
          source: { url: 'https://journals.sagepub.com/doi/full/10.1089/jmf.2009.0096', label: 'Pigeon et al. 2010 RCT' },
          affiliate: { url: 'https://www.amazon.com/dp/B007RC6J72?tag=kygohealthapp-20&th=1', label: 'Tart Cherry Juice' , slug: 'tart-cherry-juice' }
        }
      ],
      supplements: [
        {
          key: 'melatonin-ir', name: 'Melatonin (Immediate-Release)',
          direction: 'variable', evidence: 'strong',
          effect: 'Null (no WASO effect)',
          keyFinding: 'Meta-analysis of RCTs (Menczel Schrire 2022)',
          whatThisMeans: "The form of melatonin most people buy does not help you stay asleep. A 2022 meta-analysis in Neuropsychopharmacology found no significant WASO benefit for immediate-release melatonin. It shortens sleep onset and shifts circadian timing — but it won't keep you asleep.",
          mechanism: 'Short half-life (~45 min) means exogenous melatonin is largely cleared before the second half of the night, so it cannot suppress overnight arousals.',
          dosage: 'Use for sleep onset or circadian shift, not maintenance',
          source: { url: 'https://www.nature.com/articles/s41386-022-01278-5', label: 'Menczel Schrire et al. 2022' }
        },
        {
          key: 'ashwagandha', name: 'Ashwagandha (600 mg/day)',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (SMD −0.39 for WASO)',
          keyFinding: 'Meta-analysis of 3 WASO trials, n=281 (Cheah 2021)',
          whatThisMeans: 'The strongest supplement-specific evidence for staying asleep. Pooled across 3 RCTs with 281 participants, ashwagandha produced a standardized mean difference of −0.39 for WASO — meaningfully less nighttime waking. 600 mg/day of standardized extract shows the largest effect.',
          mechanism: 'Withanolides reduce cortisol and overnight sympathetic tone; GABAergic activity dampens the arousals that fragment sleep.',
          dosage: '600 mg/day standardized extract, split AM/PM or taken evening',
          source: { url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0257843', label: 'Cheah et al. 2021 meta-analysis' },
          affiliate: { url: 'https://www.amazon.com/dp/B073DN2YG9?tag=kygohealthapp-20&th=1', label: 'Ashwagandha Extract' , slug: 'ashwagandha-600mg' }
        },
        {
          key: 'glycine', name: 'Glycine (3 g)',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (↓ WASO, faster SWS)',
          keyFinding: 'PSG-measured crossover, n=11 (Yamadera 2007)',
          whatThisMeans: 'A small but polysomnography-verified study: 3 g of glycine before bed reduced nighttime waking and sped entry into slow-wave sleep. Small sample, but the mechanism is clean and the objective measurement is solid.',
          mechanism: 'Peripheral vasodilation drops core body temperature (a deep-sleep signal); NMDA modulation reduces cortical arousal.',
          dosage: '3 g, 30–60 min before bed',
          source: { url: 'https://onlinelibrary.wiley.com/doi/10.1111/j.1479-8425.2007.00262.x', label: 'Yamadera et al. 2007 PSG study' },
          affiliate: { url: 'https://www.amazon.com/s?k=Glycine%20Powder&rh=p_72%3A1248903011&tag=kygohealthapp-20', label: 'Glycine Powder' , slug: 'glycine-search' }
        },
        {
          key: 'magnesium', name: 'Magnesium (500 mg)',
          direction: 'positive', evidence: 'limited',
          effect: 'Positive for sleep efficiency',
          keyFinding: '8-week RCT in 65+ y.o., n=46 (Abbasi 2012)',
          whatThisMeans: 'Magnesium improved overall sleep efficiency in older adults with insomnia (P=0.03), but WASO itself was not directly measured. Early-morning awakening was only marginally better (P=0.08). Best evidence is in elderly people with low dietary magnesium.',
          mechanism: 'NMDA receptor antagonism and GABA-A potentiation reduce cortical arousal; supports melatonin rhythm.',
          dosage: '200–500 mg elemental magnesium (glycinate preferred)',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/23853635/', label: 'Abbasi et al. 2012 RCT' },
          affiliate: { url: 'https://www.amazon.com/dp/B00151G8L8?tag=kygohealthapp-20&th=1', label: 'Magnesium Glycinate' , slug: 'magnesium-glycinate' }
        },
        {
          key: 'l-theanine', name: 'L-Theanine (200–450 mg)',
          direction: 'variable', evidence: 'limited',
          effect: 'Mixed WASO results',
          keyFinding: '2025 systematic review of dietary supplementation trials',
          whatThisMeans: 'L-theanine shows subjective relaxation benefits and some sleep-maintenance signal at 200–450 mg/day, but WASO results are inconsistent when it is isolated from combination products. Promising, not yet proven for staying asleep.',
          mechanism: 'Increases alpha brain waves and GABA/glutamate balance; reduces cortisol and sympathetic tone without sedation.',
          dosage: '200–450 mg, 30–60 min before bed',
          source: { url: 'https://www.tandfonline.com/doi/full/10.1080/1028415X.2025.2556925', label: '2025 systematic review' },
          affiliate: { url: 'https://www.amazon.com/dp/B000H7P9M0?tag=kygohealthapp-20&th=1', label: 'L-Theanine 200mg' , slug: 'l-theanine-200mg' }
        },
        {
          key: 'valerian', name: 'Valerian Root',
          direction: 'variable', evidence: 'weak',
          effect: 'Null (no objective WASO benefit)',
          keyFinding: 'Meta-analysis of 60 studies, n=6,894 (Shinjyo 2020)',
          whatThisMeans: 'Despite widespread use, valerian does not consistently improve objective WASO. Subjective sleep ratings improve, but polysomnography and actigraphy do not confirm it. The perceived benefit may be placebo or from combination formulations.',
          mechanism: 'Weak GABA-A modulation and adenosine receptor binding; clinical signal inconsistent across doses and preparations.',
          dosage: 'Not recommended as first-line for WASO',
          source: { url: 'https://journals.sagepub.com/doi/10.1177/2515690X20967323', label: 'Shinjyo et al. 2020 meta-analysis' }
        }
      ],
      exercise: [
        {
          key: 'moderate-aerobic', name: 'Moderate Aerobic Exercise',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (−10 min WASO)',
          keyFinding: 'Meta-analysis of RCTs in insomnia patients (Riedel 2024)',
          whatThisMeans: 'The strongest exercise evidence for sleep maintenance. A 2024 meta-analysis of RCTs in insomnia patients found regular moderate aerobic exercise cut WASO by about 10 minutes (MD = −10.16, p < .001). Reliable, well-tolerated, and works alongside other interventions.',
          mechanism: 'Raises daytime energy expenditure, deepens homeostatic sleep pressure, lowers cortisol, and strengthens circadian amplitude.',
          dosage: '150+ min/week moderate intensity, consistent schedule',
          source: { url: 'https://www.sciencedirect.com/science/article/pii/S1087079224000522', label: 'Riedel et al. 2024 meta-analysis' }
        },
        {
          key: 'resistance-training', name: 'Resistance Training',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (↓ disturbance, ↑ efficiency)',
          keyFinding: 'Systematic review of 13 studies, n=652 (Kovacevic 2018)',
          whatThisMeans: 'Strength training improved mid-sleep disturbance and sleep efficiency across 13 studies. WASO was not pooled specifically, but individual RCTs showed reductions. Works on its own and stacks well with cardio.',
          mechanism: 'Elevated growth hormone and muscle-recovery demands deepen slow-wave sleep; reduced anxiety and stable glucose lower overnight arousals.',
          dosage: '2–3 sessions per week, progressive overload',
          source: { url: 'https://www.sciencedirect.com/science/article/abs/pii/S1087079216301526', label: 'Kovacevic et al. 2018 review' }
        },
        {
          key: 'yoga', name: 'Yoga',
          direction: 'positive', evidence: 'limited',
          effect: 'Positive (−56 min WASO, likely inflated)',
          keyFinding: 'Network meta-analysis of 22 RCTs, n=1,348 (Bu 2025)',
          whatThisMeans: 'Yoga showed the largest raw WASO reduction in the 2025 network meta-analysis — about 56 minutes in insomnia patients. Flagged as low-certainty because of small samples and heterogeneity, so the effect size is likely inflated. Still worth trying given the low downside.',
          mechanism: 'Pranayama breathing reduces sympathetic tone; gentle physical load supports circadian amplitude; mindfulness reduces rumination-driven arousals.',
          dosage: 'Regular practice; 3+ sessions per week',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/40664502/', label: 'Bu et al. 2025 network meta-analysis' }
        },
        {
          key: 'evening-moderate', name: 'Moderate Evening Exercise',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (↓ WASO)',
          keyFinding: 'Narrative review of 34 studies (Dolezal 2017)',
          whatThisMeans: "Moderate-intensity evening exercise reduced WASO across a broad review — contrary to the old 'never train at night' advice. Only vigorous, close-to-bedtime sessions carry risk; ordinary evening workouts help you stay asleep.",
          mechanism: 'Moderate post-exercise cooling and parasympathetic rebound support the overnight core-temperature drop and reduced sympathetic tone needed for consolidated sleep.',
          dosage: 'Moderate intensity, finish 1.5+ hrs before bed',
          source: { url: 'https://onlinelibrary.wiley.com/doi/10.1155/2017/1364387', label: 'Dolezal et al. 2017 review' }
        },
        {
          key: 'vigorous-late', name: 'Vigorous Exercise ≤1 hr Pre-Bed',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (+21.9 min WASO)',
          keyFinding: 'Meta-analysis of 23 studies (Stutz 2019)',
          whatThisMeans: 'Vigorous training that ends within an hour of bedtime measurably fragments sleep — particularly when intensity exceeds your usual level (b = +21.9 min WASO, p = 0.044). Any exercise during the day is fine; just keep the hardest effort away from bedtime.',
          mechanism: 'Sympathetic activation, catecholamine surge, and elevated core temperature oppose the physiological drop needed to stay in consolidated sleep.',
          dosage: 'Avoid high-intensity exercise in the hour before bed',
          source: { url: 'https://link.springer.com/article/10.1007/s40279-018-1015-0', label: 'Stutz et al. 2019 meta-analysis' }
        }
      ],
      environment: [
        {
          key: 'bedroom-temp', name: 'Bedroom Temp (20–25°C)',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive at optimal range',
          keyFinding: 'Multiple PSG-measured studies; 20–25°C optimal',
          whatThisMeans: 'Both too-hot and too-cold bedrooms measurably increase WASO. The 20–25°C (68–77°F) range is consistently supported; most sleep research points to the cooler end. Individual preference varies.',
          mechanism: 'Ambient temperature outside the thermoneutral zone prevents the core-to-skin heat transfer that maintains deep sleep, producing mid-night arousals.',
          dosage: 'Aim for 18–22°C (65–72°F); layer bedding to fine-tune',
          source: { url: 'https://onlinelibrary.wiley.com/doi/full/10.1002/2475-8876.12187', label: 'Akiyama 2021 thermal environment study' }
        },
        {
          key: 'light-at-night', name: 'Light at Night (even dim)',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (↑ WASO)',
          keyFinding: 'PSG study, n=23, 5–10 lux (Cho 2016)',
          whatThisMeans: "Even dim light during sleep — roughly a nightlight at 5–10 lux — significantly increased WASO and shallow REM on polysomnography. You don't have to be looking at a screen; ambient bedroom light is enough to fragment sleep.",
          mechanism: 'Melanopsin-containing retinal ganglion cells detect light through the eyelids, suppressing melatonin and raising cortical arousal.',
          dosage: 'Bedroom as dark as possible; cover electronics, use blackout',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/26654880/', label: 'Cho et al. 2016 PSG study' },
          affiliate: { url: 'https://www.amazon.com/dp/B07PRG2CQY?tag=kygohealthapp-20', label: 'Sleep Mask', slug: 'sleep-mask' }
        },
        {
          key: 'noise', name: 'Noise (>50 dBA)',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (+30 min WASO)',
          keyFinding: 'WHO systematic review of 74 studies (Basner 2018)',
          whatThisMeans: 'The most comprehensive environmental sleep review to date. Nighttime noise above 50 dBA added roughly 30 minutes of WASO in the reviewed field studies. Traffic, aircraft, and intermittent neighborhood noise all show dose-response effects.',
          mechanism: 'Auditory cortex activation and autonomic arousal interrupt NREM stages; even sub-conscious arousals fragment sleep architecture.',
          dosage: 'Keep bedroom <30 dB; use masking (white/pink noise) or earplugs',
          source: { url: 'https://www.mdpi.com/1660-4601/15/3/519', label: 'Basner et al. 2018 WHO review' },
          affiliate: { url: 'https://www.amazon.com/dp/B0FSHYJHHV?tag=kygohealthapp-20&th=1', label: 'Earplugs' , slug: 'silicone-earplugs' }
        },
        {
          key: 'co2-ventilation', name: 'CO₂ >1000 ppm (Poor Ventilation)',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (+5 min wake)',
          keyFinding: 'Field-lab, n=36, 3 ventilation levels (Kang 2024)',
          whatThisMeans: 'A well-designed balanced crossover study found even moderate CO₂ buildup (~1,000 ppm) added measurable wake time during the night. A stuffy, poorly ventilated bedroom is a real and often-overlooked WASO driver.',
          mechanism: 'Elevated CO₂ increases ventilatory drive, sympathetic tone, and micro-arousals; reduced O₂ saturation compounds the effect.',
          dosage: 'Crack a window or use mechanical ventilation; aim <800 ppm',
          source: { url: 'https://www.sciencedirect.com/science/article/pii/S0360132323011459', label: 'Kang et al. 2024' },
          affiliate: { url: 'https://www.amazon.com/dp/B0CGX22CR8?tag=kygohealthapp-20&th=1', label: 'CO₂ Monitor' , slug: 'co2-monitor' }
        },
        {
          key: 'mattress', name: 'Mattress (Medium-Firm)',
          direction: 'positive', evidence: 'limited',
          effect: 'Positive (most consistent WASO)',
          keyFinding: 'PSG study, n=12, 3 firmness levels (Hu 2025)',
          whatThisMeans: 'A small polysomnography study found a medium-firm mattress produced the most stable sleep and lowest WASO across three firmness levels. Very small sample, but the direction is consistent with broader ergonomic data.',
          mechanism: 'Appropriate spinal support reduces micro-movements and pressure-point arousals that fragment sleep across the night.',
          dosage: 'Medium-firm mattress; replace every 7–10 years',
          source: { url: 'https://www.tandfonline.com/doi/full/10.2147/NSS.S503222', label: 'Hu et al. 2025 PSG study' },
          affiliate: { url: 'https://www.amazon.com/dp/B0DKTCWC8X?tag=kygohealthapp-20&th=1', label: 'Medium-Firm Mattress' , slug: 'memory-foam-mattress' }
        }
      ],
      physiology: [
        {
          key: 'aging', name: 'Aging (30–60+)',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (+10 min WASO/decade)',
          keyFinding: 'Meta-analysis of 65 studies, n=3,577 (Ohayon 2004)',
          whatThisMeans: 'The definitive reference on normal sleep architecture. WASO increases roughly 10 minutes per decade between age 30 and 60, then plateaus. Expected, not pathological — but it compounds with other age-related changes like lighter sleep and more frequent bathroom trips.',
          mechanism: 'Reduced SCN amplitude, blunted nocturnal melatonin, and thinner cortical sleep architecture all increase spontaneous arousals.',
          dosage: 'Non-modifiable; offset with morning light, exercise, sleep hygiene',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/15586779/', label: 'Ohayon et al. 2004 meta-analysis' }
        },
        {
          key: 'female-sex', name: 'Female Sex (Subjective–Objective Paradox)',
          direction: 'variable', evidence: 'strong',
          effect: 'More complaints, better PSG',
          keyFinding: 'Ohayon 2004: women sleep better objectively, report worse subjectively',
          whatThisMeans: 'A well-documented paradox: women report more sleep complaints across every age group, yet show objectively better sleep continuity on polysomnography than men. Hormonal cycles, perimenopause, and insomnia prevalence likely explain the subjective side.',
          mechanism: 'Hormonal fluctuations (menstrual, perimenopausal) drive perceived sleep disruption; baseline sleep architecture remains objectively stronger than age-matched men.',
          dosage: 'Non-modifiable; address specific drivers (hormonal, hot flashes, anxiety)',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/15586779/', label: 'Ohayon et al. 2004 meta-analysis' }
        },
        {
          key: 'menopause', name: 'Menopausal Hot Flashes',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (69% hot flashes → wake)',
          keyFinding: 'PSG + GnRH model, n=29 (Joffe 2013)',
          whatThisMeans: 'A controlled GnRH-agonist model with polysomnography found 69% of women developed vasomotor symptoms, and each additional nighttime hot flash increased WASO by 62% (P=0.007). Hot flashes accounted for about 27% of total WASO. HRT, cooling strategies, and CBT-I all help.',
          mechanism: 'Vasomotor episodes produce abrupt heat surges that directly trigger awakening; autonomic destabilization keeps sleep light between episodes.',
          dosage: 'HRT, cooling bedroom, moisture-wicking bedding; CBT-I adjunct',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/24293774/', label: 'Joffe et al. 2013 PSG study' }
        },
        {
          key: 'obesity', name: 'Obesity (BMI ≥30)',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (↑ WASO)',
          keyFinding: 'Sleep Heart Health Study, n=5,723 PSG (Zhao 2021)',
          whatThisMeans: 'A large PSG-based cohort found WASO was independently associated with obesity after full adjustment (OR 1.003 per minute, P=0.007). Cross-sectional — so directionality is uncertain — but the link is well-established and bi-directional with sleep apnea.',
          mechanism: 'Upper-airway loading (even without OSA), increased inflammation, and altered thermoregulation all raise overnight arousals.',
          dosage: 'Weight management; screen for OSA if BMI ≥30',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/34196121/', label: 'Zhao et al. 2021 SHHS' }
        },
        {
          key: 'shift-work', name: 'Shift Work',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (↑ WASO, ↓ efficiency)',
          keyFinding: 'Narrative review of SWSD patients (Wickwire 2017)',
          whatThisMeans: 'Shift workers — especially those with diagnosable shift work sleep disorder — show more fragmented daytime sleep, higher WASO, and lower efficiency. The mismatch between sleep time and circadian phase is the core issue.',
          mechanism: 'Daytime sleep attempts fight the circadian alerting signal; light, noise, and social obligations interrupt the rest window.',
          dosage: 'Strategic light, blackout sleep environment, timed melatonin, naps',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/28012806/', label: 'Wickwire et al. 2017 Chest review' }
        },
        {
          key: 'nocturia', name: 'Nocturia (≥2 episodes/night)',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (+34 min WASO)',
          keyFinding: 'SOF study, n=1,520 actigraphy (Fung 2017)',
          whatThisMeans: 'One of the most impactful real-world WASO drivers and commonly overlooked. WASO climbed from 55.5 min (0 episodes) to 89.8 min (3–4 episodes) — a 34-minute swing. Nocturia frequency explained 6% additional variance in WASO beyond all other factors.',
          mechanism: 'Each bathroom trip is a full arousal plus ambient light exposure plus cold sheets on return — compounding sleep fragmentation.',
          dosage: 'Limit evening fluids; rule out BPH, overactive bladder, OSA-driven ANP',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/28914959/', label: 'Fung et al. 2017 SOF study' }
        },
        {
          key: 'osa', name: 'Obstructive Sleep Apnea',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (↑ WASO, ↑ arousals with severity)',
          keyFinding: 'Comprehensive review, PSG data (Patel 2019)',
          whatThisMeans: 'Among the most well-established causes of sleep fragmentation in medicine. Every obstructive breathing event triggers an arousal — by definition. WASO and arousal index scale directly with apnea-hypopnea index. Diagnosis and treatment (CPAP, oral appliance) produce large WASO reductions.',
          mechanism: 'Repeated airway collapse triggers cortical arousal to restore airway patency; each event fragments NREM and prevents consolidated sleep.',
          dosage: 'Screen with home sleep test if suspected; treat with CPAP or oral appliance',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8340897/', label: 'Patel 2019 Annals IM review' }
        },
        {
          key: 'chronic-pain', name: 'Chronic Pain',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (large effect)',
          keyFinding: 'Meta-analysis of 37 studies, PSG (Mathias 2018)',
          whatThisMeans: 'PSG-measured WASO roughly doubles in people with chronic pain versus healthy controls across 37 studies. Pain directly interrupts sleep, and the resulting fatigue lowers pain tolerance the next day — a vicious cycle that CBT-I and pain-focused therapy can both break.',
          mechanism: 'Nociceptive input continues through sleep, producing repeated arousals; central sensitization amplifies even minor stimuli into full awakenings.',
          dosage: 'Treat underlying pain; CBT-I improves both pain and sleep outcomes',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/30314881/', label: 'Mathias et al. 2018 meta-analysis' }
        },
        {
          key: 'stress', name: 'Psychological Stress',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (↑ WASO via cortisol)',
          keyFinding: '24-hr cortisol + PSG, n=24 (Vgontzas 2001)',
          whatThisMeans: "The foundational paper for the 'hyperarousal' model of sleep-maintenance insomnia. Chronic insomnia patients showed elevated 24-hour cortisol — particularly pre-sleep and during the first half of the night — directly fragmenting sleep. Stress hormones are a real, measurable WASO driver.",
          mechanism: 'HPA axis activation elevates cortisol and sympathetic tone, which lowers arousal threshold and produces spontaneous mid-night awakenings.',
          dosage: 'CBT-I, mindfulness, cognitive restructuring; address chronic stressors',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/11502812/', label: 'Vgontzas et al. 2001' }
        }
      ]
    };
  }

  get _topPicks() {
    // Six headlines from the data — non-expanding editorial cards
    return [
      { label: 'Biggest hurter',     stat: '+34 min',   answer: 'Nocturia (≥2 trips)',        note: 'SOF study, n=1,520 — WASO climbs from 55.5 → 89.8 min as trips go 0 → 3–4.',                             cls: 'warn' },
      { label: 'Biggest helper',     stat: '−17 min',   answer: 'Tart cherry juice',          note: 'Pigeon 2010 RCT crossover, n=15 insomnia adults. Needs replication, but the signal is clean.',            cls: '' },
      { label: 'Hidden environment', stat: '+30 min',   answer: 'Noise over 50 dBA',          note: 'WHO review of 74 studies. Even intermittent neighborhood noise shows dose-response effects.',            cls: 'warn' },
      { label: 'Reliable daily win', stat: '−10 min',   answer: 'Moderate aerobic exercise',  note: 'Riedel 2024 meta-analysis of insomnia RCTs. MD = −10.16 min WASO, p < .001.',                             cls: '' },
      { label: 'Myth, busted',       stat: '±0 min',    answer: 'Melatonin (standard)',       note: 'Menczel Schrire 2022 meta-analysis — no significant WASO effect. Use for onset, not maintenance.',        cls: 'neutral' },
      { label: 'Quickest fix',       stat: 'Tonight',   answer: 'Kill dim bedroom light',     note: 'Cho 2016 PSG — even 5–10 lux (nightlight-level) measurably raises WASO. Blackout the bedroom.',          cls: '' }
    ];
  }

  _heroStats() {
    const all = Object.values(this._factors).flat();
    return {
      total:   all.length,
      helpers: all.filter(f => f.direction === 'positive').length,
      hurters: all.filter(f => f.direction === 'negative').length,
      strong:  all.filter(f => f.evidence === 'strong').length
    };
  }

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
      cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
      arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>',
      arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>',
      arrowLeftRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>'
    };
    return icons[name] || icons.moon;
  }

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
      limited: { label: 'Limited', color: '#6366F1', bg: 'rgba(99,102,241,0.15)' },
      weak: { label: 'Weak', color: '#94A3B8', bg: 'rgba(148,163,184,0.15)' }
    };
    return map[ev] || map.moderate;
  }

  get _categoryMeta() {
    return {
      nutrition:   { label: 'Nutrition & Substances',    hue: '#22C55E' },
      supplements: { label: 'Supplements',               hue: '#6366F1' },
      exercise:    { label: 'Exercise & Movement',       hue: '#F59E0B' },
      environment: { label: 'Environment & Hygiene',     hue: '#06B6D4' },
      physiology:  { label: 'Demographics & Physiology', hue: '#EC4899' }
    };
  }

  /** Category-relevant icon (single brand-green color) — replaces the old per-category color dots */
  _catIcon(catKey) {
    const c = this._categories[catKey];
    return this._icon(c ? c.icon : 'moon');
  }

  get _factorMeta() {
    // waso (min; + = worse, - = better, 0 = null-effect, null = directional-only)
    // time: 'day' | 'evening' | 'bedtime' | 'overnight' | 'chronic'
    return {
      'dietary-fiber':       { waso: null, time: 'day' },
      'sugar':               { waso: null, time: 'evening' },
      'caffeine':            { waso: 12,   time: 'day' },
      'alcohol':             { waso: null, time: 'evening' },
      'late-eating':         { waso: null, time: 'bedtime' },
      'tart-cherry':         { waso: -17,  time: 'bedtime' },
      'melatonin-ir':        { waso: 0,    time: 'bedtime' },
      'ashwagandha':         { waso: null, time: 'chronic' },
      'glycine':             { waso: null, time: 'bedtime' },
      'magnesium':           { waso: null, time: 'chronic' },
      'l-theanine':          { waso: null, time: 'bedtime' },
      'valerian':            { waso: 0,    time: 'bedtime' },
      'moderate-aerobic':    { waso: -10,  time: 'day' },
      'resistance-training': { waso: null, time: 'day' },
      'yoga':                { waso: -56,  time: 'evening', caveat: true },
      'evening-moderate':    { waso: null, time: 'evening' },
      'vigorous-late':       { waso: 22,   time: 'bedtime' },
      'bedroom-temp':        { waso: null, time: 'overnight' },
      'light-at-night':      { waso: null, time: 'overnight' },
      'noise':               { waso: 30,   time: 'overnight' },
      'co2-ventilation':     { waso: 5,    time: 'overnight' },
      'mattress':            { waso: null, time: 'overnight' },
      'aging':               { waso: 10,   time: 'chronic' },
      'female-sex':          { waso: null, time: 'chronic' },
      'menopause':           { waso: null, time: 'overnight' },
      'obesity':             { waso: null, time: 'chronic' },
      'shift-work':          { waso: null, time: 'chronic' },
      'nocturia':            { waso: 34,   time: 'overnight' },
      'osa':                 { waso: null, time: 'overnight' },
      'chronic-pain':        { waso: null, time: 'chronic' },
      'stress':              { waso: null, time: 'chronic' }
    };
  }

  _flatFactors() {
    const meta = this._factorMeta;
    const out = [];
    Object.entries(this._factors).forEach(([catKey, arr]) => {
      arr.forEach(f => {
        const m = meta[f.key] || { waso: null, time: 'chronic' };
        out.push({ ...f, category: catKey, waso: m.waso, time: m.time, caveat: !!m.caveat });
      });
    });
    return out;
  }

  _dirClass(dir) {
    return dir === 'positive' ? 'pos' : dir === 'negative' ? 'neg' : 'neu';
  }

  _wasoDisplay(f) {
    if (f.waso === null || f.waso === undefined) return { text: '—', cls: 'na', label: 'No numeric' };
    if (f.waso === 0) return { text: '±0 min', cls: 'zero', label: '±0 min' };
    if (f.waso < 0) return { text: `${f.waso} min`, cls: 'pos', label: `${f.waso} min` };
    return { text: `+${f.waso} min`, cls: 'neg', label: `+${f.waso} min` };
  }

  get _timeSlots() {
    return [
      { key: 'day',       time: '6A–6P',  label: 'Daytime',            desc: 'Sets the stage — circadian, pressure, cortisol tone.' },
      { key: 'evening',   time: '6–9P',   label: 'Evening',            desc: 'Wind-down window — the last chance to shape the night.' },
      { key: 'bedtime',   time: '9–11P',  label: 'Bedtime',            desc: 'The hour before lights-out. Highest-leverage window.' },
      { key: 'overnight', time: '11P–6A', label: 'Overnight',          desc: "What's in the room matters more than what's in your head." },
      { key: 'chronic',   time: 'Always', label: 'Chronic / Baseline', desc: 'Always-on — demographics, disorders, baseline stress.' }
    ];
  }

  get _viewConfig() {
    return [
      { k: 'chart',    label: 'Impact chart',   sub: 'Ranked by magnitude',      step: '01', lede: 'Bar length = minutes of Wake After Sleep Onset added or removed per night. Only factors with numeric WASO figures appear in the chart. Tap a bar for the mechanism and source.' },
      { k: 'list',     label: 'Leaderboard',    sub: 'Every factor, sortable',   step: '02', lede: 'All 31 factors, sortable by impact, evidence, direction, or category. Tap a row for the key finding, mechanism, and source link.' },
      { k: 'timeline', label: 'Night timeline', sub: 'Grouped by time of day',   step: '03', lede: 'Factors arranged by when they matter most — from daytime habits, through bedtime rituals, to what is happening in your bedroom overnight.' }
    ];
  }

  _viewIcon(k) {
    if (k === 'chart')    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 12h4M3 6h8M3 18h6M14 12h7M14 6h4M14 18h5"/></svg>';
    if (k === 'list')     return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  }

  _renderViewPicker() {
    return `
      <div class="view-picker" role="tablist" aria-label="Data view">
        ${this._viewConfig.map(v => `
          <button class="view-tab ${this._view === v.k ? 'active' : ''}" data-view="${v.k}" role="tab" aria-selected="${this._view === v.k}">
            <span class="view-icon">${this._viewIcon(v.k)}</span>
            <span class="view-meta">
              <span class="view-lbl">${v.label}</span>
              <span class="view-sub">${v.sub}</span>
            </span>
            <span class="view-step">${v.step}</span>
          </button>
        `).join('')}
      </div>`;
  }

  _renderCatRail() {
    const flat = this._flatFactors();
    const chips = [`
      <button class="cat-chip ${!this._catFilter ? 'active' : ''}" data-cat="" aria-pressed="${!this._catFilter}">
        All <span class="count">${flat.length}</span>
      </button>`];
    Object.entries(this._categoryMeta).forEach(([k, m]) => {
      const count = flat.filter(f => f.category === k).length;
      const active = this._catFilter === k;
      chips.push(`
        <button class="cat-chip ${active ? 'active' : ''}" data-cat="${k}" aria-pressed="${active}">
          <span class="cat-hue" aria-hidden="true">${this._catIcon(k)}</span>${m.label}
          <span class="count">${count}</span>
        </button>`);
    });
    return `<div class="cat-rail" role="tablist" aria-label="Filter by category">${chips.join('')}</div>`;
  }

  _renderChartView() {
    const flat = this._flatFactors();
    const quantified = flat
      .filter(f => f.waso !== null && f.waso !== undefined)
      .filter(f => !this._catFilter || f.category === this._catFilter)
      .sort((a, b) => Math.abs(b.waso) - Math.abs(a.waso));
    const domainMax = 40;
    const ticks = [-40, -20, 0, 20, 40];
    const meta = this._categoryMeta;
    const selectedKey = this._chartSelectedKey;

    const rows = quantified.map((f, i) => {
      const val = f.waso;
      const visualVal = Math.max(-domainMax, Math.min(domainMax, val));
      const pct = (Math.abs(visualVal) / domainMax) * 50;
      const isZero = val === 0;
      const isPos = val < 0;
      const isNeg = val > 0;
      const isSelected = selectedKey === f.key;
      const dim = selectedKey && !isSelected ? 'dim' : '';
      return `
        <div class="chart-row ${dim}">
          <button class="chart-label" data-chart-key="${f.key}" aria-expanded="${isSelected}">
            <span class="chart-label-name">${f.name}</span>
            <span class="chart-label-dot" aria-hidden="true">${this._catIcon(f.category)}</span>
          </button>
          <div class="chart-bar">
            <span class="chart-axis" aria-hidden="true"></span>
            ${isZero ? '<span class="chart-fill zero"></span>' : ''}
            ${isPos ? `<span class="chart-fill pos" style="right:50%;width:${pct}%;animation-delay:${i * 40}ms"></span>` : ''}
            ${isNeg ? `<span class="chart-fill neg" style="left:50%;width:${pct}%;animation-delay:${i * 40}ms"></span>` : ''}
          </div>
          <div class="chart-val ${isZero ? 'zero' : isPos ? 'pos' : 'neg'}">
            ${isZero ? '±0' : (isPos ? val : `+${val}`)} min${f.caveat ? '<sup class="chart-caveat">*</sup>' : ''}
          </div>
        </div>`;
    }).join('');

    const scaleTicks = ticks.map(t => {
      const pct = ((t + domainMax) / (domainMax * 2)) * 100;
      return `<span class="chart-tick ${t === 0 ? 'zero' : ''}" style="left:${pct}%">${t > 0 ? `+${t}` : t}</span>`;
    }).join('');

    const detail = selectedKey ? this._renderChartDetail(quantified.find(f => f.key === selectedKey) || flat.find(f => f.key === selectedKey)) : '';
    const emptyState = quantified.length === 0 ? '<p class="dash-empty">No quantified factors in this category. See the qualitative grid below.</p>' : '';
    const caveatNote = quantified.some(f => f.caveat) ? '<p class="chart-caveat-note">*Yoga effect (−56 min) capped at −40 in chart; network meta-analysis rated low-certainty. Chart shows only factors with reported numeric WASO minutes.</p>' : '';

    return `
      <div class="k-chart">
        <div class="k-chart-head">
          <div>
            <h3 class="chart-title">WASO impact per night</h3>
            <p class="chart-sub">Minutes added or removed from Wake After Sleep Onset, per peer-reviewed meta-analysis or RCT.</p>
          </div>
          <div class="chart-meta">${quantified.length} quantified factor${quantified.length === 1 ? '' : 's'}</div>
        </div>
        <div class="chart-legend-head">
          <span class="helps"><span class="sw pos"></span>← Helps you stay asleep</span>
          <span class="hurts">Wakes you up →<span class="sw neg"></span></span>
        </div>
        ${emptyState}
        <div class="chart-wrap">
          ${rows}
          <div class="chart-scale-spacer"></div>
          <div class="chart-scale">${scaleTicks}</div>
          <div class="chart-scale-spacer"></div>
        </div>
        ${detail}
        ${caveatNote}
      </div>`;
  }

  _affiliateChips(f, position) {
    if (!f.affiliate) return '';
    const list = Array.isArray(f.affiliate) ? f.affiliate : [f.affiliate];
    return list.map(a => `<a href="${a.url}" class="factor-affiliate" target="_blank" rel="noopener sponsored" data-action="affiliate-click" data-track-label="${a.slug}" data-track-position="${position}"><span class="aff-icon" aria-hidden="true">${this._icon('cart')}</span><span class="aff-text">View <strong>${a.label}</strong> on Amazon</span><span class="factor-affiliate-arrow" aria-hidden="true">${this._icon('externalLink')}</span></a>`).join('');
  }

  _renderChartDetail(f) {
    if (!f) return '';
    const val = f.waso;
    const isZero = val === 0;
    const isPos = val < 0;
    const cls = isZero ? 'zero' : isPos ? 'pos' : 'neg';
    const bigVal = isZero ? '±0' : (isPos ? val : `+${val}`);
    return `
      <div class="chart-detail" role="region" aria-label="${f.name} detail">
        <h4 class="chart-detail-h">
          <span>${f.name}</span>
          <span class="chart-detail-big ${cls}">${bigVal} min WASO</span>
        </h4>
        <div class="chart-detail-col">
          <div class="chart-detail-row"><span class="lbl">Plain English</span><p>${f.whatThisMeans}</p></div>
          <div class="chart-detail-row"><span class="lbl">Mechanism</span><p>${f.mechanism}</p></div>
        </div>
        <div class="chart-detail-col">
          <div class="chart-detail-row"><span class="lbl">Key finding</span><p>${f.keyFinding}</p></div>
          <div class="chart-detail-row"><span class="lbl">What to do</span><p>${f.dosage}</p></div>
          <div class="chart-detail-row"><span class="lbl">Source</span><p><a href="${f.source.url}" target="_blank" rel="noopener" class="source-link">${f.source.label} ${this._icon('externalLink')}</a></p></div>
          ${this._affiliateChips(f, 'factor-chart')}
        </div>
      </div>`;
  }

  _renderListView() {
    const flat = this._flatFactors();
    const meta = this._categoryMeta;
    let shown = flat.filter(f => !this._catFilter || f.category === this._catFilter);
    if (this._listSort === 'impact') {
      shown = shown.slice().sort((a, b) => {
        const aw = a.waso === null || a.waso === undefined ? 0 : Math.abs(a.waso);
        const bw = b.waso === null || b.waso === undefined ? 0 : Math.abs(b.waso);
        return bw - aw;
      });
    } else if (this._listSort === 'evidence') {
      const r = { strong: 0, moderate: 1, limited: 2, weak: 3 };
      shown = shown.slice().sort((a, b) => (r[a.evidence] ?? 9) - (r[b.evidence] ?? 9));
    } else if (this._listSort === 'direction') {
      const r = { positive: 0, mixed: 1, variable: 2, negative: 3 };
      shown = shown.slice().sort((a, b) => (r[a.direction] ?? 9) - (r[b.direction] ?? 9));
    } else if (this._listSort === 'category') {
      shown = shown.slice().sort((a, b) => a.category.localeCompare(b.category));
    }

    const evColor = { strong: 'var(--green-dark)', moderate: '#B45309', limited: '#4338CA', weak: 'var(--gray-600)' };
    const dirLabel = (d) => d === 'positive' ? '↓ Helps' : d === 'negative' ? '↑ Hurts' : '— Neutral';

    const sortBtns = [
      { k: 'impact',    l: 'Impact' },
      { k: 'evidence',  l: 'Evidence' },
      { k: 'direction', l: 'Direction' },
      { k: 'category',  l: 'Category' }
    ].map(o => `<button class="list-sort-btn ${this._listSort === o.k ? 'active' : ''}" data-sort="${o.k}">${o.l}</button>`).join('');

    const rows = shown.map((f, i) => {
      const waso = this._wasoDisplay(f);
      const isExp = this._listExpandedKey === f.key;
      return `
        <div class="list-row ${isExp ? 'expanded' : ''}" data-list-key="${f.key}" role="button" tabindex="0" aria-expanded="${isExp}">
          <div class="list-rank">${String(i + 1).padStart(2, '0')}</div>
          <div class="list-name"><span class="list-dot" aria-hidden="true">${this._catIcon(f.category)}</span>${f.name}</div>
          <div class="list-col-dir"><span class="list-dir ${this._dirClass(f.direction)}">${dirLabel(f.direction)}</span></div>
          <div class="list-eff hide-m">${f.effect}</div>
          <div class="list-ev hide-m" style="color:${evColor[f.evidence]}">${f.evidence.toUpperCase()}</div>
          <div class="list-waso ${waso.cls}">${waso.text}</div>
          <div class="list-chev" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg></div>
        </div>
        ${isExp ? `
          <div class="list-body">
            <div class="list-body-grid">
              <div>
                <span class="lbl">Plain English</span><p>${f.whatThisMeans}</p>
                <span class="lbl">Mechanism</span><p>${f.mechanism}</p>
              </div>
              <div>
                <span class="lbl">Key finding</span><p>${f.keyFinding}</p>
                <span class="lbl">What to do</span><p>${f.dosage}</p>
                <span class="lbl">Source</span><p><a href="${f.source.url}" target="_blank" rel="noopener" class="source-link">${f.source.label} ${this._icon('externalLink')}</a></p>
                ${this._affiliateChips(f, 'factor-list')}
              </div>
            </div>
          </div>` : ''}`;
    }).join('');

    return `
      <div class="list-toolbar">
        <span class="list-sort-label">Sort by</span>
        <div class="list-sort-btns">${sortBtns}</div>
      </div>
      <div class="k-list">
        <div class="list-row head" role="row">
          <div>#</div>
          <div>Factor</div>
          <div class="list-col-dir">Direction</div>
          <div class="hide-m">Effect</div>
          <div class="hide-m">Evidence</div>
          <div class="list-waso-head">WASO Δ</div>
          <div></div>
        </div>
        ${rows || '<p class="dash-empty">No factors match this filter.</p>'}
      </div>`;
  }

  _renderTimelineView() {
    const flat = this._flatFactors();
    const meta = this._categoryMeta;
    const shown = flat.filter(f => !this._catFilter || f.category === this._catFilter);
    const slots = this._timeSlots.map(slot => {
      const bucket = shown
        .filter(f => f.time === slot.key)
        .sort((a, b) => {
          const aw = a.waso === null || a.waso === undefined ? 0 : a.waso;
          const bw = b.waso === null || b.waso === undefined ? 0 : b.waso;
          return bw - aw;
        });
      const chips = bucket.length ? bucket.map(f => {
          return `<div class="tl-chip ${this._dirClass(f.direction)}">
          <span class="tl-dot" aria-hidden="true">${this._catIcon(f.category)}</span>
          <div class="tl-text"><span class="tl-name">${f.name}</span><span class="tl-eff">${f.effect}</span></div>
        </div>`;
      }).join('') : '<p class="tl-empty">No factors in this slot.</p>';
      return `
        <div class="tl-slot ${slot.key}">
          <div class="tl-head">
            <div class="tl-head-l">
              <div class="tl-time">${slot.time}</div>
              <div class="tl-label">${slot.label}</div>
            </div>
            <div class="tl-count">${String(bucket.length).padStart(2, '0')}</div>
          </div>
          <p class="tl-desc">${slot.desc}</p>
          <div class="tl-chips">${chips}</div>
        </div>`;
    }).join('');

    return `
      <div class="k-timeline">
        <div class="tl-track">
          <div class="tl-axis" aria-hidden="true"></div>
          <div class="tl-ticks" aria-hidden="true">
            <span>06:00</span><span>12:00</span><span>18:00</span><span class="now">22:00</span><span>02:00</span><span>06:00</span>
          </div>
        </div>
        <div class="tl-slots">${slots}</div>
      </div>`;
  }

  /** Effect text with the redundant direction prefix stripped - the group header states direction. */
  _effectDetail(f) {
    const raw = (f.effect || '').trim();
    const m = raw.match(/^(?:Positive|Negative|Null|Mixed|Variable)\s*\((.+)\)$/i);
    const text = m ? m[1] : raw;
    return text.replace(/^[a-z]/, c => c.toUpperCase());
  }

  _factorCard(f) {
    return `
      <article class="qual-card">
        <div class="qual-row">
          <h4 class="qual-name">${f.name}</h4>
          <span class="qual-ev ${f.evidence}" title="${f.evidence} evidence">${f.evidence[0].toUpperCase()}</span>
        </div>
        <p class="qual-effect">${this._effectDetail(f)}</p>
        <details class="qual-details">
          <summary class="qual-more">
            <span class="qual-more-closed">Read more &#8595;</span>
            <span class="qual-more-open">Collapse &#8593;</span>
          </summary>
          <div class="qual-body">
            <p>${f.whatThisMeans}</p>
            <p><strong>Mechanism.</strong> ${f.mechanism}</p>
            <p><strong>What to do.</strong> ${f.dosage}</p>
            <p><a href="${f.source.url}" target="_blank" rel="noopener" class="source-link">${f.source.label} ${this._icon('externalLink')}</a></p>
            ${this._affiliateChips(f, 'factor-breakdown')}
          </div>
        </details>
      </article>`;
  }

  /** Helping / hurting split rendered inside every category group. */
  get _splitGroups() {
    return [
      { key: 'positive', cls: 'pos', label: 'Helps you stay asleep',    icon: 'arrowUp' },
      { key: 'negative', cls: 'neg', label: 'Wakes you up',             icon: 'arrowDown' },
      { key: 'variable', cls: 'neu', label: 'Mixed or no clear effect', icon: 'arrowLeftRight' }
    ];
  }

  /** Full factor breakdown - grouped by category, then split into helping vs hurting. */
  _renderFactorBreakdown() {
    const flat = this._flatFactors();
    const bucket = f => (f.direction === 'positive' || f.direction === 'negative') ? f.direction : 'variable';
    return Object.entries(this._categoryMeta).map(([catKey, meta], idx) => {
      const items = flat.filter(f => f.category === catKey);
      if (!items.length) return '';
      const splits = this._splitGroups.map(g => {
        const group = items.filter(f => bucket(f) === g.key);
        if (!group.length) return '';
        return `
            <div class="bd-split">
              <div class="bd-split-head ${g.cls}">
                <span class="bd-split-icon" aria-hidden="true">${this._icon(g.icon)}</span>
                <span class="bd-split-label">${g.label}</span>
                <span class="bd-split-count">${group.length}</span>
              </div>
              <div class="bd-grid">${group.map(f => this._factorCard(f)).join('')}</div>
            </div>`;
      }).filter(Boolean).join('');
      return `
        <details class="bd-group" ${idx === 0 ? 'open' : ''}>
          <summary class="bd-group-head">
            <span class="bd-group-dot" aria-hidden="true">${this._catIcon(catKey)}</span>
            <span class="bd-group-title">${meta.label}</span>
            <span class="bd-group-count">${items.length}</span>
            <span class="bd-group-chev" aria-hidden="true">${this._icon('chevDown')}</span>
          </summary>
          <div class="bd-splits">${splits}</div>
        </details>`;
    }).filter(Boolean).join('');
  }

  /** Cross-links to the other free Kygo tools. */
  // Related tools · Kygo standard module ────────────────────────────────
  // Exactly 3 cards: a near neighbour, a bridge between accuracy and
  // physiology, and one from another family. Never links this page to
  // itself, and never links the Food Scanner.

  _relatedTools() {
    return [
      {
        title: 'Sleep Latency Factors',
        blurb: '33 factors that affect how fast you fall asleep, ranked by evidence.',
        url: 'https://www.kygo.app/tools/sleep-latency-factors',
        meta: 'Sleep · 33 factors',
        motif: { motif: 'decay', caption: 'Time to fall asleep' }
      },
      {
        title: 'Deep Sleep Factor Explorer',
        blurb: '28 factors that affect deep sleep, ranked by research with doses and mechanisms.',
        url: 'https://www.kygo.app/tools/deep-sleep-factors',
        meta: 'Sleep · 28 factors',
        motif: { motif: 'hypno', stage: 'deep', caption: 'Sleep stages overnight' }
      },
      {
        title: 'Supplements by Metric',
        blurb: 'Pick a wearable metric and see which of 27 supplements the research actually supports.',
        url: 'https://www.kygo.app/tools/supplements-by-metric',
        meta: 'Nutrition · 28 sources',
        motif: { motif: 'ranked', caption: 'Graded by evidence' }
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
      { slug: 'how-to-stay-asleep-factors-ranked-by-evidence',
        title: 'How to Stay Asleep All Night: 31 Factors Ranked by Evidence (2026)',
        blurb: 'Forty-plus studies ranked by what actually moves WASO. Some confirm what you expect; immediate-release melatonin does not.',
        cat: 'Sleep', min: 8, img: '273a63_1b328da6e96d4110a7de9403036dfac5~mv2.png' },
      { slug: 'how-to-fall-asleep-faster-factors-ranked-by-evidence',
        title: 'How to Fall Asleep Faster: 33 Factors Ranked by Evidence (2026)',
        blurb: 'Thirty-three factors that change sleep latency, from caffeine and melatonin to warm baths and bedroom temperature, each graded.',
        cat: 'Sleep', min: 10, img: '273a63_301e6ab1c01a477aad452b8ae4373b98~mv2.png' },
      { slug: 'which-foods-affect-your-sleep-and-hrv',
        title: 'Which Foods Affect Your Sleep & HRV? How to Find Out',
        blurb: 'Caffeine, alcohol and late heavy meals are the usual suspects, but the foods that move your numbers are personal. How to find yours.',
        cat: 'App Updates', min: 7, img: '273a63_817afd636ca34cd6bfae13650a742362~mv2.png' }
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

  _renderDashboardBody() {
    if (this._view === 'chart')    return this._renderChartView();
    if (this._view === 'list')     return this._renderListView();
    if (this._view === 'timeline') return this._renderTimelineView();
    return '';
  }

  _renderTopPicks() {
    return this._topPicks.map((p, i) => `
        <article class="pick-card ${p.cls || ''} animate-on-scroll" style="--delay:${i * 70}ms">
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
        <div class="hero-cell"><span class="hero-num hero-num--pos">${s.helpers}</span><span class="hero-lbl">Help you stay asleep</span></div>
        <div class="hero-cell"><span class="hero-num hero-num--neg">${s.hurters}</span><span class="hero-lbl">Wake you up</span></div>
        <div class="hero-cell"><span class="hero-num">${s.strong}</span><span class="hero-lbl">Strong-evidence</span></div>
      </div>`;
  }

  _sleepWaveSvg() {
    return `
      <svg class="hero-wave" viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="kygo-sa-wave-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#22C55E" stop-opacity="0.08"/>
            <stop offset="1" stop-color="#22C55E" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="M0 180 Q 40 160, 80 180 T 160 180 L 170 140 L 180 180 Q 220 210, 260 180 T 340 180 L 350 220 L 360 170 L 370 200 L 380 180 Q 420 150, 460 180 T 540 180 T 600 180" stroke="#22C55E" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M0 180 Q 40 160, 80 180 T 160 180 L 170 140 L 180 180 Q 220 210, 260 180 T 340 180 L 350 220 L 360 170 L 370 200 L 380 180 Q 420 150, 460 180 T 540 180 T 600 180 L 600 300 L 0 300 Z" fill="url(#kygo-sa-wave-g)"/>
        <g stroke="rgba(30,41,59,0.08)" stroke-width="1">
          <line x1="0" y1="60" x2="600" y2="60"/>
          <line x1="0" y1="120" x2="600" y2="120"/>
          <line x1="0" y1="240" x2="600" y2="240"/>
        </g>
        <g fill="#1E293B" font-size="10" font-family="Space Grotesk, sans-serif" opacity="0.35">
          <text x="8" y="56">AWAKE</text>
          <text x="8" y="116">REM</text>
          <text x="8" y="176">N1 / N2</text>
          <text x="8" y="236">DEEP</text>
        </g>
      </svg>`;
  }

  _updateDashboard() {
    const shadow = this.shadowRoot;
    const stepEl = shadow.querySelector('.dash-step');
    if (stepEl) {
      const idx = this._viewConfig.findIndex(v => v.k === this._view);
      stepEl.textContent = `View ${String(idx + 1).padStart(2, '0')} / 03`;
    }
    const ledeEl = shadow.querySelector('.dash-lede');
    if (ledeEl) {
      const cur = this._viewConfig.find(v => v.k === this._view);
      ledeEl.textContent = cur ? cur.lede : '';
    }
    const pickerEl = shadow.querySelector('.view-picker');
    if (pickerEl) pickerEl.outerHTML = this._renderViewPicker();
    const railEl = shadow.querySelector('.cat-rail');
    if (railEl) railEl.outerHTML = this._renderCatRail();
    const bodyEl = shadow.querySelector('.dash-body');
    if (bodyEl) bodyEl.innerHTML = this._renderDashboardBody();
  }

  _toggleChartFactor(key) {
    this._chartSelectedKey = this._chartSelectedKey === key ? null : key;
    const bodyEl = this.shadowRoot.querySelector('.dash-body');
    if (bodyEl) bodyEl.innerHTML = this._renderDashboardBody();
  }

  _toggleListRow(key) {
    this._listExpandedKey = this._listExpandedKey === key ? null : key;
    const bodyEl = this.shadowRoot.querySelector('.dash-body');
    if (bodyEl) bodyEl.innerHTML = this._renderDashboardBody();
  }

  get _srcGroups() {
    const groups = {
      'Nutrition & Substances': [
        { label: 'St-Onge et al. 2016 — Fiber, saturated fat & sleep arousals (J Clin Sleep Med)', url: 'https://jcsm.aasm.org/doi/10.5664/jcsm.5384' },
        { label: 'Gardiner et al. 2023 — Caffeine & WASO meta-analysis (24 studies)', url: 'https://www.sciencedirect.com/science/article/pii/S1087079223000205' },
        { label: 'Spadola et al. 2019 — Evening alcohol & sleep fragmentation (Jackson Heart Study, n=785)', url: 'https://academic.oup.com/sleep/article/42/11/zsz136/5535848' },
        { label: 'Crispim et al. 2022 — Bedtime eating & WASO (British J Nutrition)', url: 'https://www.cambridge.org/core/journals/british-journal-of-nutrition/article/associations-between-bedtime-eating-or-drinking-sleep-duration-and-wake-after-sleep-onset-findings-from-the-american-time-use-survey/72A5D22C25A35FA975A5B50991431E0C' },
        { label: 'Pigeon et al. 2010 — Tart cherry juice & WASO pilot RCT', url: 'https://journals.sagepub.com/doi/full/10.1089/jmf.2009.0096' }
      ],
      'Supplements': [
        { label: 'Menczel Schrire et al. 2022 — Melatonergic agents meta-analysis (Neuropsychopharmacology)', url: 'https://www.nature.com/articles/s41386-022-01278-5' },
        { label: 'Cheah et al. 2021 — Ashwagandha & sleep meta-analysis (5 RCTs, n=400)', url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0257843' },
        { label: 'Yamadera et al. 2007 — Glycine 3 g & PSG sleep-quality study', url: 'https://onlinelibrary.wiley.com/doi/10.1111/j.1479-8425.2007.00262.x' },
        { label: 'Abbasi et al. 2012 — Magnesium & insomnia in elderly RCT', url: 'https://pubmed.ncbi.nlm.nih.gov/23853635/' },
        { label: '2025 Systematic Review — L-theanine & sleep dietary trials (Nutritional Neuroscience)', url: 'https://www.tandfonline.com/doi/full/10.1080/1028415X.2025.2556925' },
        { label: 'Shinjyo et al. 2020 — Valerian root & sleep meta-analysis (60 studies)', url: 'https://journals.sagepub.com/doi/10.1177/2515690X20967323' }
      ],
      'Exercise & Movement': [
        { label: 'Riedel et al. 2024 — Exercise & insomnia meta-analysis (−10.16 min WASO)', url: 'https://www.sciencedirect.com/science/article/pii/S1087079224000522' },
        { label: 'Kovacevic et al. 2018 — Resistance exercise & sleep review (13 studies)', url: 'https://www.sciencedirect.com/science/article/abs/pii/S1087079216301526' },
        { label: 'Bu et al. 2025 — Exercise interventions in insomnia network meta-analysis (22 RCTs)', url: 'https://pubmed.ncbi.nlm.nih.gov/40664502/' },
        { label: 'Dolezal et al. 2017 — Sleep & exercise interrelationship review', url: 'https://onlinelibrary.wiley.com/doi/10.1155/2017/1364387' },
        { label: 'Stutz et al. 2019 — Evening exercise & sleep meta-analysis (Sports Med)', url: 'https://link.springer.com/article/10.1007/s40279-018-1015-0' }
      ],
      'Environment & Sleep Hygiene': [
        { label: 'Akiyama 2021 — Thermal environment & sleep quality in actual bedrooms', url: 'https://onlinelibrary.wiley.com/doi/full/10.1002/2475-8876.12187' },
        { label: 'Cho et al. 2016 — Dim light at night & REM/awakenings (Chronobiology Int)', url: 'https://pubmed.ncbi.nlm.nih.gov/26654880/' },
        { label: 'Basner et al. 2018 — WHO environmental noise & sleep review (74 studies)', url: 'https://www.mdpi.com/1660-4601/15/3/519' },
        { label: 'Kang et al. 2024 — CO₂ concentration & sleep (Building & Environment)', url: 'https://www.sciencedirect.com/science/article/pii/S0360132323011459' },
        { label: 'Hu et al. 2025 — Mattress firmness & sleep architecture (PSG)', url: 'https://www.tandfonline.com/doi/full/10.2147/NSS.S503222' }
      ],
      'Demographics & Physiology': [
        { label: 'Ohayon et al. 2004 — Normative sleep parameters meta-analysis (65 studies)', url: 'https://pubmed.ncbi.nlm.nih.gov/15586779/' },
        { label: 'Joffe et al. 2013 — GnRH model: hot flashes interrupt objective sleep', url: 'https://pubmed.ncbi.nlm.nih.gov/24293774/' },
        { label: 'Zhao et al. 2021 — Sleep fragmentation & obesity (Sleep Heart Health Study, n=5,723)', url: 'https://pubmed.ncbi.nlm.nih.gov/34196121/' },
        { label: 'Wickwire et al. 2017 — Shift work & shift work sleep disorder (Chest)', url: 'https://pubmed.ncbi.nlm.nih.gov/28012806/' },
        { label: 'Fung et al. 2017 — Nocturia & sleep quality in older women (SOF, n=1,520)', url: 'https://pubmed.ncbi.nlm.nih.gov/28914959/' },
        { label: 'Patel 2019 — Obstructive sleep apnea review (Annals Internal Medicine)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8340897/' },
        { label: 'Mathias et al. 2018 — Sleep disturbances in chronic pain meta-analysis (37 studies)', url: 'https://pubmed.ncbi.nlm.nih.gov/30314881/' },
        { label: 'Vgontzas et al. 2001 — Chronic insomnia & HPA axis activation', url: 'https://pubmed.ncbi.nlm.nih.gov/11502812/' }
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

  // Copy for the standard app CTA card. Headline carries one <span> for the
  // green phrase; everything else about the card is shared.
  _appCta() {
    return {
      slug: 'staying-asleep-factors',
      headline: `Find what's waking <span>you</span> at 3 AM.`,
      sub: `These factors are averages. Kygo correlates your own meals, caffeine and alcohol with the nights you actually sleep through.`
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
      ['273a63_56ac2eb53faf43fab1903643b29c0bce', 'Oura Ring', 'Oura'],
      ['273a63_1a1ba0e735ea4d4d865c04f7c9540e69', 'Apple Health', 'Apple'],
      ['273a63_c451e954ff8740338204915f904d8798', 'Fitbit', 'Fitbit'],
      ['273a63_0a60d1d6c15b421e9f0eca5c4c9e592b', 'Garmin', 'Garmin'],
      ['273a63_21019d0fbe9e4afcbabdb3ca9dcad89d', 'WHOOP', 'WHOOP'],
      ['273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e', 'Google Health', 'Google'],
      ['273a63_0c0e48cc065d4ee3bf506f6d47440518', 'Health Connect', 'Health']
    ].map(([id, name, label]) => `<span class="kc-chip"><span class="kc-chip-tile"><img src="https://static.wixstatic.com/media/${id}~mv2.png" alt="${name}" title="${name}" loading="lazy" /></span><span class="kc-chip-label">${label}</span></span>`).join('');
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
      /* Logo tile + brand label, matching the homepage step-2 chips. Always one line. */
      .kc-badges{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:center;gap:6px;row-gap:12px}
      .kc-chip{display:flex;flex-direction:column;align-items:center;gap:6px;flex:0 0 auto}
      .kc-chip-tile{width:40px;height:40px;flex-shrink:0;border-radius:11px;background:#fff;overflow:hidden;display:flex;align-items:center;justify-content:center}
      .kc-chip-tile img{width:100%;height:100%;object-fit:cover;border-radius:11px;display:block}
      .kc-chip-label{font-size:10px;font-weight:600;color:rgba(255,255,255,.6);white-space:nowrap}
      @media(max-width:420px){.kc-badges{gap:4px}.kc-chip-tile{width:36px;height:36px}.kc-chip-label{font-size:9.5px}}
      @media(max-width:360px){.kc-badges{gap:2px}.kc-chip-tile{width:28px;height:28px}.kc-chip-label{font-size:7.5px}}
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
            <p class="kc-note">Free plan available. Save 58% on yearly. Cancel anytime.</p>
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
    return { source: 'tool-staying-asleep-factors', variant: 'factors' };
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
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const iosUrl = 'https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <!-- Header -->
      <header class="header">
        <div class="header-inner">
          <a href="https://www.kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" />
            Staying Asleep
          </a>
          <div class="nav-cta-group">
            <a href="${iosUrl}" class="nav-store-btn nav-store-ios cta-primary" data-track-label="subnav-get-app-ios" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on the App Store"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg><span>iOS</span></a>
            <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" class="nav-store-btn nav-store-android cta-android" data-action="android-download" data-track-label="subnav-get-app-android" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on Google Play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg><span>Android</span></a>
          </div>
        </div>
      </header>

      <!-- Hero -->
      <section class="hero section-bg-white">
        <div class="container hero-inner">
          <div class="hero-kicker animate-on-scroll"><span class="hero-dot" aria-hidden="true"></span>31 Factors • 28 Studies • Updated Apr 2026</div>
          <h1 class="hero-title animate-on-scroll">The things <em>keeping you up</em> at 3&nbsp;AM — ranked.</h1>
          <p class="hero-sub animate-on-scroll">Every nutrition choice, supplement, habit, and environmental variable with measurable impact on <strong>staying asleep</strong> — sorted by the minutes of wake time it adds or removes from your night. No guessing. Just the data.</p>
          <div class="animate-on-scroll">${this._renderHeroMeta()}</div>
          ${this._sleepWaveSvg()}
        </div>
      </section>

      <!-- Data Dashboard: "What the evidence actually says" -->
      <section class="dash-section section-bg-gray" id="explore">
        <div class="container">
          <div class="dash-head animate-on-scroll">
            <div>
              <span class="dash-eyebrow">The evidence</span>
              <h2 class="dash-h2">What the <em>evidence</em> actually says.</h2>
            </div>
            <span class="dash-step">View ${String(this._viewConfig.findIndex(v => v.k === this._view) + 1).padStart(2, '0')} / 03</span>
          </div>

          <div class="animate-on-scroll">${this._renderViewPicker()}</div>

          <p class="dash-lede animate-on-scroll">${this._viewConfig.find(v => v.k === this._view).lede}</p>

          <div class="animate-on-scroll">${this._renderCatRail()}</div>

          <div class="dash-body">${this._renderDashboardBody()}</div>
        </div>
      </section>
      ${this._renderAppCta()}

      <!-- Mid-page app band -->

      <!-- Factor breakdown (cards) -->
      <section class="breakdown-section section-bg-gray">
        <div class="container">
          <div class="bd-head animate-on-scroll">
            <span class="dash-eyebrow">The full breakdown</span>
            <h2 class="dash-h2">Every factor, <em>explained</em>.</h2>
            <p class="bd-lede">Browse all 31 by category — direction, evidence grade, mechanism, what to do, and the source. Tap a card to expand.</p>
          </div>
          <div class="bd-groups animate-on-scroll">${this._renderFactorBreakdown()}</div>
        </div>
      </section>
      ${this._renderEmailCta()}

      <!-- Email capture -->

      <!-- Six headlines from the data -->
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

      ${this._renderRelatedTools()}

      <!-- Sources -->
      <section class="sources-section section-bg-gray">
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

      ${this._renderRelatedPosts('gray')}
    `;
  }

  _setupEventDelegation() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const shadow = this.shadowRoot;

    shadow.addEventListener('click', (e) => {
      if (e.target.closest('.source-link, a[href]')) return;

      // Sources · show-all toggle
      if (e.target.closest('[data-src-toggle]')) { this._toggleSources(); return; }

      const viewTab = e.target.closest('.view-tab');
      if (viewTab) {
        const k = viewTab.dataset.view;
        if (k && k !== this._view) {
          this._view = k;
          this._chartSelectedKey = null;
          this._listExpandedKey = null;
          this._updateDashboard();
        }
        return;
      }

      const catChip = e.target.closest('.cat-chip');
      if (catChip) {
        const k = catChip.dataset.cat || null;
        this._catFilter = (this._catFilter === k || k === '') ? null : k;
        this._chartSelectedKey = null;
        this._listExpandedKey = null;
        this._updateDashboard();
        return;
      }

      const sortBtn = e.target.closest('.list-sort-btn');
      if (sortBtn) {
        this._listSort = sortBtn.dataset.sort;
        const bodyEl = shadow.querySelector('.dash-body');
        if (bodyEl) bodyEl.innerHTML = this._renderDashboardBody();
        return;
      }

      const chartLbl = e.target.closest('.chart-label');
      if (chartLbl) {
        this._toggleChartFactor(chartLbl.dataset.chartKey);
        return;
      }

      const listRow = e.target.closest('.list-row');
      if (listRow && !listRow.classList.contains('head') && listRow.dataset.listKey) {
        this._toggleListRow(listRow.dataset.listKey);
        return;
      }
    });

    shadow.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const listRow = e.target.closest('.list-row');
      if (listRow && !listRow.classList.contains('head') && listRow.dataset.listKey) {
        e.preventDefault();
        this._toggleListRow(listRow.dataset.listKey);
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
    if (document.querySelector('script[data-kygo-staying-asleep-factors-ld]')) return;
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Staying Asleep Factor Explorer',
      'alternateName': 'Kygo Sleep Maintenance Factors Tool',
      'description': 'Explore 31 research-backed factors that affect sleep maintenance — nutrition, supplements, exercise, environment, and physiology ranked by evidence strength. Focused on WASO, arousals, and sleep fragmentation.',
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'url': 'https://www.kygo.app/tools/staying-asleep-factors',
      'datePublished': '2026-04-19',
      'dateModified': '2026-04-19',
      'softwareVersion': '1.0',
      'inLanguage': 'en',
      'isAccessibleForFree': true,
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
      'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
      'featureList': 'Explore 31 sleep maintenance factors, 5 evidence categories, nutrition and supplement comparison, peer-reviewed research citations, sleep environment guidance',
      'keywords': 'staying asleep factors, how to stay asleep, wake after sleep onset, WASO, sleep fragmentation, sleep arousals, sleep maintenance insomnia, caffeine and WASO, ashwagandha sleep, melatonin maintenance, nocturia WASO, menopausal hot flashes sleep, sleep apnea WASO, bedroom temperature, dim light at night, chronic pain sleep'
    };

    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is WASO and why does it matter?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'WASO (Wake After Sleep Onset) is the total minutes spent awake after you first fall asleep. Clinically it matters more than sleep latency for sleep maintenance insomnia — high WASO fragments the night, cuts deep sleep, and drives next-day fatigue even when total time in bed looks normal. Healthy adults typically have WASO under 30 minutes; over 45 minutes is a common threshold for sleep-maintenance insomnia.' }
        },
        {
          '@type': 'Question',
          'name': 'Does melatonin help you stay asleep?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Standard immediate-release melatonin — the form most people buy — does not significantly reduce WASO according to a 2022 meta-analysis in Neuropsychopharmacology (Menczel Schrire). Its half-life is too short to suppress overnight arousals. Extended-release formulations and prescription ramelteon have better evidence for maintenance. Melatonin shortens sleep onset and shifts circadian timing but is not a reliable fix for waking up at night.' }
        },
        {
          '@type': 'Question',
          'name': 'What supplement actually reduces WASO?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Ashwagandha has the strongest supplement-specific WASO evidence. A 2021 meta-analysis (Cheah, PLoS ONE) pooled 3 RCTs with 281 participants and found a standardized mean difference of −0.39 for WASO, with 600 mg/day of standardized extract most effective. Glycine 3 g before bed also reduces nighttime waking with PSG verification, though the study was small (n=11).' }
        },
        {
          '@type': 'Question',
          'name': 'How does caffeine affect staying asleep?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Caffeine adds about 12 minutes to WASO on top of lengthening sleep latency, per a 2023 meta-analysis of 24 studies (Gardiner). Adenosine receptor antagonism lowers the arousal threshold, producing lighter sleep and more spontaneous awakenings. The effect is larger in slow metabolizers and with later-day intake — stop at least 8 hours before bed, or 10+ if you metabolize caffeine slowly.' }
        },
        {
          '@type': 'Question',
          'name': 'Why do I wake up between 2 and 4 a.m.?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Common drivers: alcohol clearing (rebound glutamate), cortisol awakening response starting too early, elevated core body temperature, nocturia (bathroom trips), dim room light, CO₂ buildup in a poorly ventilated bedroom, menopausal hot flashes, and undiagnosed sleep apnea. Nocturia alone adds 34 minutes to WASO in people with 3–4 episodes per night (Fung 2017 SOF study). Addressing the specific driver produces much larger WASO reductions than generic sleep hygiene.' }
        }
      ]
    };

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Kygo Health', 'item': 'https://www.kygo.app' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
        { '@type': 'ListItem', 'position': 3, 'name': 'Staying Asleep Factors', 'item': 'https://www.kygo.app/tools/staying-asleep-factors' }
      ]
    };

    [ld, faq, breadcrumb].forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-kygo-staying-asleep-factors-ld', '');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });
  }

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

      /* Alternating section bands - every section declares one of these, never its own background */
      .section-bg-white { background: #fff; }
      .section-bg-gray { background: var(--gray-100); }

      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: var(--delay, 0ms); }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      .header { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid var(--gray-200); }
      .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 16px; max-width: 1200px; margin: 0 auto; }
      .logo { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); text-decoration: none; white-space: nowrap; min-width: 0; line-height: 1.2; }
      .logo-img { height: 26px; width: auto; flex-shrink: 0; }
      .nav-cta-group { margin-left:auto; display:inline-flex; align-items:center; gap:8px; }
      .nav-cta-group .nav-store-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border-radius:8px; font-weight:600; font-size:13px; text-decoration:none; white-space:nowrap; line-height:1; }
      .nav-cta-group .nav-store-btn svg { width:15px; height:15px; flex-shrink:0; }
      .nav-cta-group .nav-store-ios { background:var(--green); color:#fff; }
      .nav-cta-group .nav-store-ios:hover { background:var(--green-dark); color:#fff; }
      .nav-cta-group .nav-store-android { background:#fff; color:var(--green-dark); border:1.5px solid var(--gray-200); }
      .nav-cta-group .nav-store-android:hover { border-color:var(--green); color:var(--green-dark); }
      @media (max-width:360px){ .nav-cta-group .nav-store-btn span { display:none; } .nav-cta-group .nav-store-btn { padding:8px 10px; } }

      /* ========== HERO (mobile-first) ========== */
      .hero { padding: 40px 0 28px; }
      .hero-inner { position: relative; }
      .hero-kicker { display: inline-flex; align-items: center; gap: 7px; font-size: 9.5px; font-weight: 700; color: var(--green-dark); background: var(--green-light); padding: 5px 10px; border-radius: 9999px; letter-spacing: 0.4px; text-transform: uppercase; margin-bottom: 20px; white-space: nowrap; max-width: 100%; }
      .hero-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 0 rgba(34,197,94,0.6); animation: pulse 2.2s infinite; flex-shrink: 0; }
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

      /* ========== SIX HEADLINES ========== */
      .picks-section { padding: 40px 0; }
      .picks-card { position: relative; background: var(--dark-card); color: #fff; border-radius: 24px; padding: 36px 22px; overflow: hidden; }
      .picks-glow { position: absolute; top: -40%; right: -15%; width: 70%; height: 160%; background: radial-gradient(circle at center, rgba(34,197,94,0.22), transparent 60%); pointer-events: none; }
      .picks-head { position: relative; z-index: 1; margin-bottom: 24px; }
      .picks-eyebrow { display: block; font-size: 11px; letter-spacing: 0.6px; text-transform: uppercase; color: rgba(255,255,255,0.5); font-weight: 600; margin-bottom: 8px; }
      .picks-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; color: #fff; margin: 0; font-size: clamp(26px, 5.5vw, 40px); letter-spacing: -0.02em; line-height: 1.08; }
      .picks-title em { font-style: normal; color: var(--green); font-family: inherit; }
      .picks-grid { display: grid; grid-template-columns: 1fr; gap: 12px; position: relative; z-index: 1; }
      .pick-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; transition: transform .25s ease-out, background .25s ease-out, border-color .25s ease-out; }
      .pick-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(34,197,94,0.5); transform: translateY(-3px); }
      .pick-card.warn { border-color: rgba(239,68,68,0.35); }
      .pick-card.warn:hover { border-color: rgba(239,68,68,0.6); }
      .pick-label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: rgba(255,255,255,0.42); font-weight: 600; }
      .pick-stat { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 28px; color: var(--green); margin: 8px 0 6px; letter-spacing: -0.02em; font-feature-settings: "tnum" 1; line-height: 1; }
      .pick-card.warn .pick-stat { color: #FCA5A5; }
      .pick-card.neutral .pick-stat { color: #fff; }
      .pick-answer { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 17px; color: #fff; line-height: 1.2; margin: 0; }
      .pick-note { margin: 10px 0 0; font-size: 13px; color: rgba(255,255,255,0.62); line-height: 1.5; }

      /* ========== DATA DASHBOARD (mobile-first) ========== */
      .dash-section { padding: 40px 0 56px; }
      .dash-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }
      .dash-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.4px; color: var(--green-dark); margin-bottom: 10px; }
      .dash-eyebrow::before { content: ''; width: 14px; height: 1px; background: currentColor; }
      .dash-h2 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: clamp(26px, 5.5vw, 40px); letter-spacing: -0.02em; line-height: 1.08; margin: 0; color: var(--dark); max-width: 20ch; }
      .dash-h2 em { font-style: normal; color: var(--green); font-family: inherit; }
      .dash-step { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--gray-400); font-weight: 600; font-family: 'Space Grotesk', sans-serif; }
      .dash-lede { display: none; color: var(--gray-600); font-size: 15px; max-width: 64ch; margin: 0 0 18px; line-height: 1.55; }
      .dash-body { }
      .dash-empty { padding: 24px 18px; text-align: center; color: var(--gray-400); font-size: 14px; background: #fff; border: 1px dashed var(--gray-200); border-radius: 16px; }

      /* View Picker — 3x1 row on mobile */
      .view-picker { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; padding: 4px; margin: 0 0 14px; background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; }
      .view-tab { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 10px 6px 8px; background: transparent; border: 0; border-radius: 10px; cursor: pointer; text-align: center; color: var(--gray-600); font-family: inherit; transition: background .2s ease-out, color .2s ease-out; min-width: 0; }
      .view-tab:hover { background: var(--gray-50); color: var(--dark); }
      .view-tab.active { background: var(--dark); color: #fff; }
      .view-icon { width: 26px; height: 26px; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center; background: var(--gray-100); color: var(--dark); flex-shrink: 0; transition: background .2s ease-out, color .2s ease-out; }
      .view-icon svg { width: 14px; height: 14px; }
      .view-tab.active .view-icon { background: var(--green); color: #fff; }
      .view-meta { min-width: 0; }
      .view-lbl { font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 600; line-height: 1.15; color: inherit; display: block; letter-spacing: -0.005em; }
      .view-sub { display: none; }
      .view-step { position: absolute; top: 6px; right: 8px; font-family: 'Space Grotesk', sans-serif; font-size: 9px; font-weight: 600; color: var(--gray-400); letter-spacing: 0.04em; }
      .view-tab.active .view-step { color: rgba(255,255,255,0.5); }

      /* Category rail — single-row horizontal scroll on mobile */
      .cat-rail { display: flex; gap: 6px; flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding: 2px 0 6px; margin: 0 -20px 18px; padding-left: 20px; padding-right: 20px; scroll-padding-left: 20px; }
      .cat-rail::-webkit-scrollbar { display: none; }
      .cat-chip { display: inline-flex; align-items: center; gap: 7px; padding: 7px 12px; border-radius: 9999px; background: #fff; border: 1px solid var(--gray-200); font-size: 12px; font-weight: 600; color: var(--gray-600); cursor: pointer; transition: all .15s; font-family: inherit; white-space: nowrap; flex-shrink: 0; }
      .cat-chip .cat-hue { width: 15px; height: 15px; display: inline-flex; color: var(--green); flex-shrink: 0; }
      .cat-chip .cat-hue svg { width: 100%; height: 100%; }
      .cat-chip.active .cat-hue { color: #fff; }
      .cat-chip:hover { border-color: var(--gray-400); }
      .cat-chip.active { background: var(--dark); color: #fff; border-color: var(--dark); }
      .cat-chip .count { font-size: 11px; color: var(--gray-400); padding-left: 6px; border-left: 1px solid var(--gray-200); }
      .cat-chip.active .count { color: rgba(255,255,255,0.55); border-color: rgba(255,255,255,0.2); }

      /* Chart view */
      .k-chart { background: #fff; border: 1px solid var(--gray-200); border-radius: 20px; padding: 22px 18px 28px; position: relative; overflow: hidden; box-shadow: 0 1px 0 rgba(30,41,59,0.03); }
      .k-chart-head { display: flex; align-items: baseline; justify-content: space-between; gap: 14px; margin-bottom: 18px; flex-wrap: wrap; }
      .chart-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 18px; color: var(--dark); margin: 0 0 4px; letter-spacing: -0.01em; }
      .chart-sub { font-size: 13px; color: var(--gray-400); margin: 0; line-height: 1.45; }
      .chart-meta { font-size: 12px; color: var(--gray-400); font-weight: 500; white-space: nowrap; }
      .chart-legend-head { display: flex; justify-content: space-between; gap: 8px; margin: 4px 0 14px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.6px; font-weight: 700; color: var(--gray-400); }
      .chart-legend-head .helps { color: var(--green-dark); display: inline-flex; align-items: center; gap: 6px; }
      .chart-legend-head .hurts { color: var(--red); display: inline-flex; align-items: center; gap: 6px; }
      .chart-legend-head .sw { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }
      .chart-legend-head .sw.pos { background: linear-gradient(-90deg, #22C55E 0%, #4ADE80 100%); }
      .chart-legend-head .sw.neg { background: linear-gradient(90deg, #EF4444 0%, #F87171 100%); }

      .chart-wrap { display: grid; grid-template-columns: 1fr; row-gap: 10px; position: relative; font-feature-settings: "tnum" 1; }
      .chart-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-rows: auto auto; row-gap: 4px; transition: opacity .25s; }
      .chart-row.dim { opacity: 0.35; }
      .chart-label { grid-column: 1; grid-row: 1; display: inline-flex; align-items: center; gap: 6px; padding: 0; background: none; border: 0; cursor: pointer; text-align: left; font-family: inherit; font-size: 12px; font-weight: 600; color: var(--dark); line-height: 1.25; min-width: 0; max-width: 100%; padding-right: 8px; }
      .chart-label:hover { color: var(--green-dark); }
      .chart-label-name { min-width: 0; overflow-wrap: anywhere; word-break: normal; hyphens: auto; }
      .chart-label-dot { width: 14px; height: 14px; display: inline-flex; color: var(--green); flex-shrink: 0; }
      .chart-label-dot svg { width: 100%; height: 100%; }
      .chart-val { grid-column: 2; grid-row: 1; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13px; letter-spacing: -0.01em; text-align: right; white-space: nowrap; align-self: start; }
      .chart-val.pos { color: var(--green-dark); }
      .chart-val.neg { color: var(--red); }
      .chart-val.zero { color: var(--gray-400); }
      .chart-caveat { font-size: 10px; color: var(--gray-400); margin-left: 2px; }
      .chart-bar { grid-column: 1 / -1; grid-row: 2; position: relative; height: 22px; }
      .chart-bar .chart-axis { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: var(--gray-200); }
      .chart-bar .chart-fill { position: absolute; top: 4px; bottom: 4px; border-radius: 4px; animation: chartGrow .7s cubic-bezier(0.16, 1, 0.3, 1) both; transform-origin: left center; }
      .chart-bar .chart-fill.pos { background: linear-gradient(-90deg, #22C55E 0%, #4ADE80 100%); }
      .chart-bar .chart-fill.neg { background: linear-gradient(90deg, #EF4444 0%, #F87171 100%); }
      .chart-bar .chart-fill.zero { left: 50%; width: 4px; background: var(--gray-300); transform: translateX(-2px); }
      @keyframes chartGrow { from { width: 0 !important; } }
      .chart-scale-spacer { display: none; }
      .chart-scale { grid-column: 1 / -1; position: relative; height: 26px; margin-top: 6px; border-top: 1px solid var(--gray-200); color: var(--gray-400); font-size: 10.5px; font-feature-settings: "tnum" 1; }
      .chart-tick { position: absolute; top: 6px; transform: translateX(-50%); padding-top: 2px; white-space: nowrap; }
      .chart-tick::before { content: ''; position: absolute; left: 50%; top: -1px; height: 4px; width: 1px; background: var(--gray-300); transform: translateX(-50%); }
      .chart-tick.zero { font-weight: 600; color: var(--dark); }
      .chart-caveat-note { margin-top: 16px; font-size: 11px; color: var(--gray-400); line-height: 1.5; }

      /* Chart detail */
      .chart-detail { margin-top: 20px; padding: 18px 18px; background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 14px; display: grid; grid-template-columns: 1fr; gap: 14px; animation: detailIn .35s cubic-bezier(0.16, 1, 0.3, 1); }
      @keyframes detailIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      .chart-detail-h { grid-column: 1 / -1; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 17px; margin: 0 0 4px; color: var(--dark); display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px 12px; }
      .chart-detail-big { font-size: 22px; letter-spacing: -0.02em; }
      .chart-detail-big.pos { color: var(--green-dark); }
      .chart-detail-big.neg { color: var(--red); }
      .chart-detail-big.zero { color: var(--gray-400); }
      .chart-detail-col { display: flex; flex-direction: column; gap: 14px; }
      .chart-detail-row .lbl { font-size: 10px; letter-spacing: 0.8px; text-transform: uppercase; color: var(--gray-400); font-weight: 600; display: block; margin-bottom: 3px; }
      .chart-detail-row p { margin: 0; font-size: 13.5px; color: var(--gray-600); line-height: 1.55; }
      .source-link { display: inline-flex; align-items: center; gap: 4px; color: var(--green-dark); font-weight: 500; font-size: 13px; }
      .source-link svg { width: 12px; height: 12px; }
      .source-link:hover { color: var(--green); }
      .factor-affiliate { display: flex; align-items: center; gap: 10px; padding: 11px 14px; margin-top: 12px; background: #fff; border: 1.5px solid var(--green); border-radius: var(--radius-sm, 12px); text-decoration: none; color: var(--green-dark); font-size: 13px; font-weight: 600; transition: all 0.2s; }
      .factor-affiliate:hover { background: var(--green-light); box-shadow: 0 2px 12px rgba(34,197,94,0.18); }
      .aff-icon { width: 18px; height: 18px; display: inline-flex; flex-shrink: 0; color: var(--green); }
      .aff-icon svg { width: 100%; height: 100%; }
      .aff-text { flex: 1; min-width: 0; }
      .aff-text strong { font-weight: 700; }
      .factor-affiliate-arrow { width: 14px; height: 14px; display: flex; flex-shrink: 0; color: var(--green); }
      .factor-affiliate-arrow svg { width: 100%; height: 100%; }

      /* List / leaderboard view */
      .list-toolbar { display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
      .list-sort-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: var(--gray-400); font-weight: 600; }
      .list-sort-btns { display: flex; gap: 6px; flex-wrap: wrap; }
      .list-sort-btn { padding: 6px 12px; border-radius: 9999px; border: 1px solid var(--gray-200); background: #fff; color: var(--gray-600); font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .15s; }
      .list-sort-btn:hover { border-color: var(--gray-400); }
      .list-sort-btn.active { background: var(--dark); color: #fff; border-color: var(--dark); }
      .k-list { background: #fff; border: 1px solid var(--gray-200); border-radius: 18px; overflow: hidden; box-shadow: 0 1px 0 rgba(30,41,59,0.03); }
      .list-row { display: grid; grid-template-columns: 28px 1fr 74px 22px; gap: 10px; align-items: center; padding: 12px 14px; border-bottom: 1px solid var(--gray-100); font-size: 13px; cursor: pointer; transition: background .15s; }
      .list-row .list-col-dir { display: none; }
      .list-row:last-child { border-bottom: 0; }
      .list-row:hover { background: var(--gray-50); }
      .list-row.head { cursor: default; font-size: 10px; text-transform: uppercase; letter-spacing: 0.6px; color: var(--gray-400); font-weight: 600; background: var(--gray-50); }
      .list-row.head:hover { background: var(--gray-50); }
      .list-row .hide-m { display: none; }
      .list-rank { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 12px; color: var(--gray-400); font-feature-settings: "tnum" 1; }
      .list-name { display: flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; color: var(--dark); font-size: 13.5px; line-height: 1.2; min-width: 0; }
      .list-dot { width: 16px; height: 16px; display: inline-flex; color: var(--green); flex-shrink: 0; }
      .list-dot svg { width: 100%; height: 100%; }
      .list-dir { font-size: 10.5px; font-weight: 600; padding: 3px 8px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }
      .list-dir.pos { background: var(--green-light); color: var(--green-dark); }
      .list-dir.neg { background: rgba(239,68,68,0.1); color: var(--red); }
      .list-dir.neu { background: rgba(148,163,184,0.18); color: var(--gray-600); }
      .list-eff { color: var(--gray-600); font-size: 13px; }
      .list-ev { font-size: 11px; font-weight: 600; }
      .list-waso { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14px; color: var(--dark); font-feature-settings: "tnum" 1; text-align: right; white-space: nowrap; }
      .list-waso.pos { color: var(--green-dark); }
      .list-waso.neg { color: var(--red); }
      .list-waso.zero { color: var(--gray-400); font-weight: 500; }
      .list-waso.na { color: var(--gray-400); font-size: 12px; font-weight: 500; }
      .list-waso-head { text-align: right; }
      .list-chev { color: var(--gray-400); transition: transform .2s; display: flex; justify-content: flex-end; }
      .list-chev svg { width: 14px; height: 14px; }
      .list-row.expanded .list-chev { transform: rotate(90deg); }
      .list-body { padding: 0 14px 16px 44px; background: var(--gray-50); border-bottom: 1px solid var(--gray-100); font-size: 13px; color: var(--gray-600); }
      .list-body-grid { display: grid; grid-template-columns: 1fr; gap: 4px; padding-top: 14px; }
      .list-body .lbl { font-size: 10px; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); font-weight: 600; margin-bottom: 3px; display: block; }
      .list-body p { margin: 0 0 10px; line-height: 1.55; }
      .list-body a { color: var(--green-dark); font-weight: 500; }

      /* Timeline view */
      .k-timeline { background: #fff; border: 1px solid var(--gray-200); border-radius: 20px; padding: 22px 18px; box-shadow: 0 1px 0 rgba(30,41,59,0.03); }
      .tl-track { position: relative; padding: 16px 0 4px; }
      .tl-axis { height: 2px; background: linear-gradient(90deg, rgba(34,197,94,0.2) 0%, rgba(30,41,59,0.15) 18%, var(--dark) 35%, var(--dark) 65%, rgba(30,41,59,0.15) 82%, rgba(34,197,94,0.2) 100%); }
      .tl-ticks { display: flex; justify-content: space-between; margin-top: 10px; font-family: 'Space Grotesk', sans-serif; font-weight: 500; font-size: 11px; color: var(--gray-400); font-feature-settings: "tnum" 1; letter-spacing: 0.04em; }
      .tl-ticks span.now { color: var(--green-dark); font-weight: 600; }
      .tl-slots { display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 22px; }
      .tl-slot { background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; min-height: 0; }
      .tl-slot.overnight { background: var(--dark-card); border-color: var(--dark); color: #fff; }
      .tl-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
      .tl-time { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 10.5px; letter-spacing: 0.8px; text-transform: uppercase; color: var(--gray-400); white-space: nowrap; font-feature-settings: "tnum" 1; }
      .tl-slot.overnight .tl-time { color: rgba(255,255,255,0.65); }
      .tl-label { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); margin: 2px 0 0; letter-spacing: -0.01em; white-space: nowrap; }
      .tl-slot.overnight .tl-label { color: #fff; }
      .tl-count { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 17px; color: var(--gray-400); font-feature-settings: "tnum" 1; letter-spacing: -0.02em; }
      .tl-slot.overnight .tl-count { color: rgba(255,255,255,0.55); }
      .tl-desc { font-size: 11.5px; color: var(--gray-400); line-height: 1.45; margin: 6px 0 12px; }
      .tl-slot.overnight .tl-desc { color: rgba(255,255,255,0.55); }
      .tl-chips { display: flex; flex-direction: column; gap: 6px; }
      .tl-chip { background: #fff; border: 1px solid var(--gray-200); border-radius: 10px; padding: 9px 11px; font-size: 12px; display: flex; align-items: flex-start; gap: 8px; }
      .tl-chip.pos { border-left: 3px solid var(--green); }
      .tl-chip.neg { border-left: 3px solid var(--red); }
      .tl-chip.neu { border-left: 3px solid var(--gray-400); }
      .tl-slot.overnight .tl-chip { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); }
      .tl-dot { width: 14px; height: 14px; display: inline-flex; color: var(--green); margin-top: 1px; flex-shrink: 0; }
      .tl-dot svg { width: 100%; height: 100%; }
      .tl-text { flex: 1; min-width: 0; }
      .tl-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 12.5px; color: var(--dark); display: block; line-height: 1.2; }
      .tl-slot.overnight .tl-name { color: #fff; }
      .tl-eff { font-size: 11px; color: var(--gray-600); margin-top: 2px; display: block; }
      .tl-slot.overnight .tl-eff { color: rgba(255,255,255,0.55); }
      .tl-empty { font-size: 11.5px; color: var(--gray-400); font-style: italic; padding: 6px 0; margin: 0; }
      .tl-slot.overnight .tl-empty { color: rgba(255,255,255,0.4); }

      /* Qualitative — clickable category accordion */
      .qual-wrap { margin-top: 28px; }
      .qual-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
      .qual-head h3 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); margin: 0; letter-spacing: -0.01em; line-height: 1.25; }
      .qual-count { font-size: 11.5px; color: var(--gray-400); font-weight: 500; }
      .qual-accordion { display: flex; flex-direction: column; gap: 8px; }
      .qual-group { background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; overflow: hidden; transition: border-color .2s, box-shadow .2s; }
      .qual-group:hover { border-color: var(--gray-400); }
      .qual-group.open { border-color: var(--gray-300); box-shadow: 0 1px 0 rgba(30,41,59,0.03); }
      .qual-group-head { display: flex; width: 100%; align-items: center; gap: 10px; padding: 14px 16px; background: #fff; border: 0; cursor: pointer; font-family: inherit; text-align: left; }
      .qual-group-head:hover { background: var(--gray-50); }
      .qual-group-dot { width: 18px; height: 18px; display: inline-flex; color: var(--green); flex-shrink: 0; }
      .qual-group-dot svg { width: 100%; height: 100%; }
      .qual-group-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14px; color: var(--dark); letter-spacing: -0.005em; flex: 1; }
      .qual-group-count { font-size: 11px; font-weight: 700; color: var(--gray-600); background: var(--gray-100); padding: 3px 10px; border-radius: 9999px; }
      .qual-group-chev { width: 20px; height: 20px; color: var(--gray-400); transition: transform .25s ease-out; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .qual-group-chev svg { width: 18px; height: 18px; }
      .qual-group.open .qual-group-chev { transform: rotate(180deg); color: var(--green-dark); }
      .qual-group-body { padding: 12px; background: var(--gray-50); border-top: 1px solid var(--gray-100); }
      .qual-group-body[hidden] { display: none; }
      .qual-grid { display: grid; grid-template-columns: 1fr; gap: 6px; }
      .qual-card { background: #fff; border: 1px solid var(--gray-200); border-radius: 10px; padding: 10px 12px; transition: border-color .2s, box-shadow .2s; }
      .qual-card:hover { border-color: var(--gray-400); }

      /* Factor breakdown (full card library, native <details> accordion) */
      .breakdown-section { padding: 40px 0; }
      .bd-head { margin-bottom: 18px; }
      .bd-lede { color: var(--gray-600); font-size: 14px; margin-top: 8px; max-width: 640px; }
      .bd-groups { display: flex; flex-direction: column; gap: 8px; }
      .bd-group { background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; overflow: hidden; transition: border-color .2s, box-shadow .2s; }
      .bd-group:hover { border-color: var(--gray-400); }
      .bd-group[open] { border-color: var(--gray-300); box-shadow: 0 1px 0 rgba(30,41,59,0.03); }
      .bd-group-head { display: flex; align-items: center; gap: 10px; padding: 14px 16px; cursor: pointer; list-style: none; user-select: none; }
      .bd-group-head::-webkit-details-marker { display: none; }
      .bd-group-head:hover { background: var(--gray-50); }
      .bd-group-dot { width: 18px; height: 18px; display: inline-flex; color: var(--green); flex-shrink: 0; }
      .bd-group-dot svg { width: 100%; height: 100%; }
      .bd-group-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14px; color: var(--dark); letter-spacing: -0.005em; flex: 1; }
      .bd-group-count { font-size: 11px; font-weight: 700; color: var(--gray-600); background: var(--gray-100); padding: 3px 10px; border-radius: 9999px; }
      .bd-group-chev { width: 20px; height: 20px; color: var(--gray-400); transition: transform .25s ease-out; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .bd-group-chev svg { width: 18px; height: 18px; }
      .bd-group[open] .bd-group-chev { transform: rotate(180deg); color: var(--green-dark); }
      .bd-splits { display: flex; flex-direction: column; gap: 16px; padding: 4px 12px 14px; }
      .bd-split-head { display: flex; align-items: center; gap: 8px; padding: 7px 11px; margin-bottom: 8px; border-radius: 10px; border: 1px solid var(--gray-200); background: var(--gray-50); }
      .bd-split-icon { width: 15px; height: 15px; display: inline-flex; flex-shrink: 0; }
      .bd-split-icon svg { width: 100%; height: 100%; }
      .bd-split-label { flex: 1; min-width: 0; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 12.5px; letter-spacing: -0.005em; }
      .bd-split-count { font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 9999px; background: #fff; border: 1px solid var(--gray-200); color: var(--gray-600); }
      .bd-split-head.pos { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.22); color: var(--green-dark); }
      .bd-split-head.neg { background: rgba(30,41,59,0.05); border-color: var(--gray-300); color: var(--dark); }
      .bd-split-head.neu { background: #fff; border-color: var(--gray-200); color: var(--gray-600); }
      .bd-grid { display: grid; grid-template-columns: 1fr; gap: 6px; }
      @media (min-width: 768px) { .bd-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (min-width: 1024px) { .bd-grid { grid-template-columns: repeat(3, 1fr); } }
      .qual-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
      .qual-ev { font-size: 10px; font-weight: 700; width: 18px; height: 18px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; letter-spacing: 0; }
      .qual-ev.strong { background: var(--green-light); color: var(--green-dark); }
      .qual-ev.moderate { background: rgba(245,158,11,0.12); color: #B45309; }
      .qual-ev.limited { background: rgba(99,102,241,0.12); color: #4338CA; }
      .qual-ev.weak { background: rgba(148,163,184,0.18); color: var(--gray-600); }
      .qual-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13.5px; color: var(--dark); margin: 0; line-height: 1.2; flex: 1; min-width: 0; }
      .qual-effect { font-size: 11.5px; color: var(--gray-600); margin: 3px 0 0; font-weight: 500; line-height: 1.35; }
      .qual-details { margin-top: 4px; }
      .qual-details summary { list-style: none; cursor: pointer; }
      .qual-details summary::-webkit-details-marker { display: none; }
      .qual-more { font-size: 11px; font-weight: 600; color: var(--green-dark); display: inline-flex; align-items: center; gap: 4px; padding: 4px 0 0; }
      .qual-details[open] .qual-more-closed { display: none; }
      .qual-details:not([open]) .qual-more-open { display: none; }
      .qual-body { margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--gray-200); font-size: 12px; line-height: 1.55; color: var(--gray-600); }
      .qual-body p { margin: 0 0 6px; }
      .qual-body p:last-child { margin-bottom: 0; }
      .qual-body strong { color: var(--dark); font-weight: 600; }
      .qual-body a { color: var(--green-dark); font-weight: 500; }

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

      /* Read-the-full-article — own section */

      .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
      @keyframes pulse { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }

      .cta-android { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm, 10px); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; border: none; cursor: pointer; }
      .cta-android:hover { background: var(--green-dark); color: #fff; }
      .cta-android svg { width: 18px; height: 18px; }
      /* MID-PAGE APP BAND */
      .kband-section { padding: 40px 0; }
      @media (min-width: 768px) { .kband-section { padding: 56px 0; } }
      .kband { max-width: 1100px; margin: 0 auto; }
      .kband-inner { position: relative; overflow: hidden; background: #fff; border: 1.5px solid var(--gray-200); border-radius: 20px; padding: 26px 22px; display: flex; flex-direction: column; align-items: flex-start; gap: 22px; box-shadow: 0 8px 24px rgba(15,23,42,0.06); }
      .kband-glow { position: absolute; top: -120px; right: -80px; width: 360px; height: 360px; background: radial-gradient(closest-side, rgba(34,197,94,0.16), transparent); pointer-events: none; }
      .kband-copy { position: relative; display: flex; flex-direction: column; gap: 9px; flex: 1 1 auto; min-width: 0; max-width: 640px; }
      .kband-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 0.7px; text-transform: uppercase; color: var(--green-dark); }
      .kband-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: kygoPulse 2s ease-out infinite; flex-shrink: 0; }
      .kband-headline { margin: 0; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: clamp(18px, 2.4vw, 23px); line-height: 1.3; color: var(--dark); }
      .kband-actions { position: relative; display: flex; flex-wrap: wrap; gap: 12px; width: 100%; }
      .kband-btn { display: inline-flex; align-items: center; justify-content: center; gap: 9px; width: 100%; text-decoration: none; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; padding: 14px 22px; border-radius: 12px; white-space: nowrap; transition: transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease; }
      .kband-btn svg { width: 17px; height: 17px; flex-shrink: 0; }
      .kband-btn-ios { background: var(--green); color: #fff; box-shadow: 0 6px 16px rgba(34,197,94,0.28); }
      .kband-btn-ios:hover { background: var(--green-dark); color: #fff; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(34,197,94,0.3); }
      .kband-btn-android { background: #fff; color: var(--green-dark); border: 1.5px solid var(--gray-200); }
      .kband-btn-android:hover { border-color: var(--green); transform: translateY(-2px); }
      .kband-note { flex-basis: 100%; width: 100%; margin: 4px 0 0; font-size: 12.5px; line-height: 1.5; color: var(--gray-600); text-align: center; }
      @media (min-width: 560px) { .kband-btn { width: auto; flex: 1 1 190px; } }
      @media (min-width: 900px) {
        .kband-inner { flex-direction: row; align-items: center; justify-content: space-between; gap: 36px; padding: 28px 32px; }
        .kband-actions { width: auto; flex: 0 0 auto; max-width: 470px; }
        .kband-btn { flex: 0 0 auto; }
      }
      @keyframes kygoPulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.55); } 70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }
      @media (prefers-reduced-motion: reduce) { .kband-dot { animation: none; } }

      /* EMAIL CAPTURE */
      .subscribe-section { padding: 16px 0; }
      @media (min-width: 768px) { .subscribe-section { padding: 24px 0; } }

      .tool-footer { padding: 48px 0 32px; text-align: center; background: #fff; border-top: 1px solid var(--gray-200); }
      .footer-brand { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); text-decoration: none; margin-bottom: 8px; }
      .footer-logo { height: 24px; width: auto; }
      .footer-tagline { font-size: 13px; color: var(--gray-400); margin-bottom: 16px; }
      .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 16px; margin-bottom: 16px; padding: 0 16px; }
      .footer-links a { font-size: 13px; color: var(--gray-600); text-decoration: none; white-space: nowrap; }
      .footer-links a:hover { color: var(--green); }
      .footer-copyright { font-size: 12px; color: var(--gray-400); margin-bottom: 4px; }
      .footer-disclaimer { font-size: 11px; color: var(--gray-400); line-height: 1.5; max-width: 560px; margin: 0 auto 12px; }

      @media (min-width: 640px) {
        .hero-meta { grid-template-columns: repeat(4, 1fr); }
        .hero-meta .hero-cell { padding: 0 16px; border-right: 1px solid var(--gray-200); border-bottom: 0 !important; }
        .hero-meta .hero-cell:first-child { padding-left: 0; }
        .hero-meta .hero-cell:last-child { border-right: 0; padding-right: 0; }
        .hero-meta .hero-cell:nth-child(n+3), .hero-meta .hero-cell:nth-child(-n+2) { padding-top: 0; padding-bottom: 0; }
      }
      @media (min-width: 680px) {
        .view-picker { gap: 8px; padding: 8px; border-radius: 16px; }
        .view-tab { flex-direction: row; gap: 12px; padding: 14px 16px 14px 14px; text-align: left; align-items: center; justify-content: flex-start; }
        .view-icon { width: 36px; height: 36px; border-radius: 9px; }
        .view-icon svg { width: 18px; height: 18px; }
        .view-lbl { font-size: 15px; }
        .view-sub { display: block; font-size: 11.5px; font-weight: 500; line-height: 1.3; color: var(--gray-400); margin-top: 2px; }
        .view-tab.active .view-sub { color: rgba(255,255,255,0.65); }
        .view-step { top: 10px; right: 12px; font-size: 10px; }
        .cat-rail { margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; flex-wrap: wrap; overflow: visible; }
        .dash-lede { display: block; }
        .qual-grid { grid-template-columns: repeat(2, 1fr); }
        .tl-slots { grid-template-columns: repeat(2, 1fr); }
      }
      @media (min-width: 768px) {
        .header-inner { padding: 14px 24px; }
        .logo { font-size: 16px; }
        .logo-img { height: 28px; }
        .hero { padding: 72px 0 48px; }
        .picks-grid { grid-template-columns: 1fr 1fr; }
        .picks-section { padding: 64px 0; }
        .picks-card { padding: 48px 36px; border-radius: 28px; }
        .dash-section { padding: 56px 0 72px; }
        .k-chart { padding: 30px 32px 36px; border-radius: 24px; }
        .k-timeline { padding: 30px 28px; border-radius: 24px; }
        .chart-wrap { grid-template-columns: 220px 1fr auto; column-gap: 20px; row-gap: 6px; }
        .chart-row { display: contents; }
        .chart-label { grid-column: 1; grid-row: auto; justify-content: flex-end; text-align: right; padding: 10px 0; font-size: 14px; }
        .chart-bar { grid-column: 2; grid-row: auto; height: 34px; }
        .chart-bar .chart-fill { top: 6px; bottom: 6px; border-radius: 5px; }
        .chart-val { grid-column: 3; grid-row: auto; padding: 10px 0; min-width: 78px; text-align: left; font-size: 15px; }
        .chart-scale-spacer { display: block; }
        .chart-scale-spacer:first-of-type { grid-column: 1; }
        .chart-scale { grid-column: 2; margin-top: 4px; }
        .chart-scale-spacer:last-of-type { grid-column: 3; }
        .chart-detail { grid-template-columns: 1fr 1fr; gap: 20px 32px; padding: 22px 24px; }
        .list-row { grid-template-columns: 40px 1.6fr 110px 1fr 110px 80px 28px; gap: 14px; padding: 14px 20px; font-size: 13px; }
        .list-row .hide-m { display: block; }
        .list-row .list-col-dir { display: block; }
        .list-body { padding: 0 20px 18px 54px; }
        .list-body-grid { grid-template-columns: 1fr 1fr; gap: 8px 28px; }
        .tl-slots { grid-template-columns: repeat(5, 1fr); gap: 14px; }
        .tl-slot { min-height: 190px; }
        .qual-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
      }
      @media (min-width: 1000px) {
        .hero-wave { display: block; position: absolute; right: -20px; top: 30px; width: 46%; max-width: 560px; opacity: 0.9; pointer-events: none; }
      }
      @media (min-width: 1024px) {
        .picks-grid { grid-template-columns: 1fr 1fr 1fr; }
        .dash-section { padding: 72px 0 88px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .pulse-dot, .hero-dot { animation: none; }
        .pick-card, .qual-card, .chart-fill, .view-tab, .list-row, .list-chev { transition: none; animation: none; }
        .chart-detail { animation: none; }
      }
    `;
  }
}

if (!customElements.get('kygo-staying-asleep-factors')) {
  customElements.define('kygo-staying-asleep-factors', KygoStayingAsleepFactors);
}
