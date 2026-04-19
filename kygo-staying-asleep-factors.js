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
    this._activeCategory = 'nutrition';
    this._expandedFactor = null;
    this._expandedTopPick = null;
    this._sortMode = 'default';
    this._eventsBound = false;
  }

  connectedCallback() {
    this.render();
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
          source: { url: 'https://jcsm.aasm.org/doi/10.5664/jcsm.5384', label: 'St-Onge et al. 2016' }
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
          source: { url: 'https://journals.sagepub.com/doi/full/10.1089/jmf.2009.0096', label: 'Pigeon et al. 2010 RCT' }
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
          source: { url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0257843', label: 'Cheah et al. 2021 meta-analysis' }
        },
        {
          key: 'glycine', name: 'Glycine (3 g)',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (↓ WASO, faster SWS)',
          keyFinding: 'PSG-measured crossover, n=11 (Yamadera 2007)',
          whatThisMeans: 'A small but polysomnography-verified study: 3 g of glycine before bed reduced nighttime waking and sped entry into slow-wave sleep. Small sample, but the mechanism is clean and the objective measurement is solid.',
          mechanism: 'Peripheral vasodilation drops core body temperature (a deep-sleep signal); NMDA modulation reduces cortical arousal.',
          dosage: '3 g, 30–60 min before bed',
          source: { url: 'https://onlinelibrary.wiley.com/doi/10.1111/j.1479-8425.2007.00262.x', label: 'Yamadera et al. 2007 PSG study' }
        },
        {
          key: 'magnesium', name: 'Magnesium (500 mg)',
          direction: 'positive', evidence: 'limited',
          effect: 'Positive for sleep efficiency',
          keyFinding: '8-week RCT in 65+ y.o., n=46 (Abbasi 2012)',
          whatThisMeans: 'Magnesium improved overall sleep efficiency in older adults with insomnia (P=0.03), but WASO itself was not directly measured. Early-morning awakening was only marginally better (P=0.08). Best evidence is in elderly people with low dietary magnesium.',
          mechanism: 'NMDA receptor antagonism and GABA-A potentiation reduce cortical arousal; supports melatonin rhythm.',
          dosage: '200–500 mg elemental magnesium (glycinate preferred)',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/23853635/', label: 'Abbasi et al. 2012 RCT' }
        },
        {
          key: 'l-theanine', name: 'L-Theanine (200–450 mg)',
          direction: 'variable', evidence: 'limited',
          effect: 'Mixed WASO results',
          keyFinding: '2025 systematic review of dietary supplementation trials',
          whatThisMeans: 'L-theanine shows subjective relaxation benefits and some sleep-maintenance signal at 200–450 mg/day, but WASO results are inconsistent when it is isolated from combination products. Promising, not yet proven for staying asleep.',
          mechanism: 'Increases alpha brain waves and GABA/glutamate balance; reduces cortisol and sympathetic tone without sedation.',
          dosage: '200–450 mg, 30–60 min before bed',
          source: { url: 'https://www.tandfonline.com/doi/full/10.1080/1028415X.2025.2556925', label: '2025 systematic review' }
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
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/26654880/', label: 'Cho et al. 2016 PSG study' }
        },
        {
          key: 'noise', name: 'Noise (>50 dBA)',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (+30 min WASO)',
          keyFinding: 'WHO systematic review of 74 studies (Basner 2018)',
          whatThisMeans: 'The most comprehensive environmental sleep review to date. Nighttime noise above 50 dBA added roughly 30 minutes of WASO in the reviewed field studies. Traffic, aircraft, and intermittent neighborhood noise all show dose-response effects.',
          mechanism: 'Auditory cortex activation and autonomic arousal interrupt NREM stages; even sub-conscious arousals fragment sleep architecture.',
          dosage: 'Keep bedroom <30 dB; use masking (white/pink noise) or earplugs',
          source: { url: 'https://www.mdpi.com/1660-4601/15/3/519', label: 'Basner et al. 2018 WHO review' }
        },
        {
          key: 'co2-ventilation', name: 'CO₂ >1000 ppm (Poor Ventilation)',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (+5 min wake)',
          keyFinding: 'Field-lab, n=36, 3 ventilation levels (Kang 2024)',
          whatThisMeans: 'A well-designed balanced crossover study found even moderate CO₂ buildup (~1,000 ppm) added measurable wake time during the night. A stuffy, poorly ventilated bedroom is a real and often-overlooked WASO driver.',
          mechanism: 'Elevated CO₂ increases ventilatory drive, sympathetic tone, and micro-arousals; reduced O₂ saturation compounds the effect.',
          dosage: 'Crack a window or use mechanical ventilation; aim <800 ppm',
          source: { url: 'https://www.sciencedirect.com/science/article/pii/S0360132323011459', label: 'Kang et al. 2024' }
        },
        {
          key: 'mattress', name: 'Mattress (Medium-Firm)',
          direction: 'positive', evidence: 'limited',
          effect: 'Positive (most consistent WASO)',
          keyFinding: 'PSG study, n=12, 3 firmness levels (Hu 2025)',
          whatThisMeans: 'A small polysomnography study found a medium-firm mattress produced the most stable sleep and lowest WASO across three firmness levels. Very small sample, but the direction is consistent with broader ergonomic data.',
          mechanism: 'Appropriate spinal support reduces micro-movements and pressure-point arousals that fragment sleep across the night.',
          dosage: 'Medium-firm mattress; replace every 7–10 years',
          source: { url: 'https://www.tandfonline.com/doi/full/10.2147/NSS.S503222', label: 'Hu et al. 2025 PSG study' }
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
    return [
      { icon: 'moon',     label: 'Best Single Habit',        answer: 'Cool, dark, quiet bedroom',      note: 'Temperature, light, and noise have the strongest environmental evidence for staying asleep — all three matter every single night',                       stat: 'Fundamentals',        category: 'Environment' },
      { icon: 'dumbbell', label: 'Best Exercise',            answer: 'Moderate aerobic exercise',      note: 'Meta-analysis of RCTs in insomnia patients: MD = −10.16 min WASO, p < .001 (Riedel 2024)',                                                                   stat: '−10 min WASO',        category: 'Exercise' },
      { icon: 'pill',     label: 'Best Supplement',          answer: 'Ashwagandha (600 mg/day)',       note: 'Meta-analysis of 3 WASO trials, n=281 — SMD −0.39. The only supplement with direct pooled WASO evidence (Cheah 2021)',                                        stat: 'SMD −0.39',           category: 'Supplements' },
      { icon: 'wind',     label: 'Most Overlooked Fix',      answer: 'Fix nighttime bathroom trips',   note: '3–4 nocturia episodes added 34 min to WASO in the SOF study (n=1,520). Limit evening fluids; rule out BPH, overactive bladder, OSA-driven ANP',              stat: '+34 min WASO',        category: 'Demographics' },
      { icon: 'brain',    label: 'Quickest Impact',          answer: 'Kill dim bedroom light',         note: 'Even a nightlight-level 5–10 lux measurably increased WASO on PSG (Cho 2016). Blackout your bedroom tonight',                                                  stat: 'Immediate',           category: 'Environment' },
      { icon: 'alert',    label: 'Biggest WASO Driver',      answer: 'Caffeine',                       note: 'Meta-analysis of 24 studies: +12 min WASO on top of longer sleep onset. Slow metabolizers are hit hardest (Gardiner 2023)',                                    stat: '+12 min WASO',        category: 'Nutrition', warning: true }
    ];
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
      const rank = { strong: 0, moderate: 1, limited: 2, weak: 3 };
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
            <p class="factor-evidence-text"><span class="evidence-label">Evidence:</span> <span style="color:${ev.color};font-weight:600">${ev.label}</span></p>
          </div>
          <div class="factor-body">
            <div class="factor-detail">
              <div class="detail-row">
                <span class="detail-label">Plain English</span>
                <p class="detail-value">${f.whatThisMeans}</p>
              </div>
              <div class="detail-row">
                <span class="detail-label">Key Finding</span>
                <p class="detail-value">${f.keyFinding}</p>
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

  _updateCategory() {
    const shadow = this.shadowRoot;
    const tabs = shadow.querySelector('.cat-tabs');
    const cards = shadow.querySelector('.factor-cards');
    this._expandedFactor = null;
    if (tabs) tabs.innerHTML = this._renderCategoryTabs();
    if (cards) cards.innerHTML = this._renderFactorCards();
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

  _renderSources() {
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
            Staying Asleep
          </a>
          <a href="https://kygo.app" class="header-link" target="_blank" rel="noopener">
            Get Kygo App ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge animate-on-scroll">31 FACTORS • 5 CATEGORIES • ALL PEER-REVIEWED</div>
          <h1 class="animate-on-scroll">What Actually Keeps You Asleep Through the Night?</h1>
          <p class="hero-sub animate-on-scroll">Every nutrition choice, supplement, habit, and environmental variable with proven impact on staying asleep — ranked by evidence strength and direction of effect. Focused on WASO, arousals, and sleep fragmentation. No guessing, just data.</p>
        </div>
      </section>

      <!-- Top Picks -->
      <section class="picks-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Quick Answers</h2>
          <p class="section-sub animate-on-scroll">The top research-backed picks for staying asleep across every category.</p>
          <div class="picks-grid">${this._renderTopPicks()}</div>
        </div>
      </section>

      <!-- Primary Interactive: Category tabs + Factor cards -->
      <section class="explore-section" id="explore">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Explore All Factors</h2>
          <p class="section-sub animate-on-scroll">Tap any factor to see the key finding, mechanism, dosage, and source.</p>

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
            <a href="https://www.kygo.app/post/how-to-stay-asleep-factors-ranked-by-evidence" class="blog-link-card" target="_blank" rel="noopener">
              <span class="blog-link-icon"><img src="${logoUrl}" alt="Kygo" style="width:24px;height:24px;" /></span>
              <div class="blog-link-text">
                <span class="blog-link-title">Read the Full Article</span>
                <span class="blog-link-desc">How to Stay Asleep: 31 Factors Ranked by Evidence (2026)</span>
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
              <h2>Find Out What's Waking You Up <span class="highlight">at Night</span></h2>
              <p>Kygo Health connects your wearable data with nutrition tracking to pinpoint personal correlations between what you eat, how you move, and how well you stay asleep.</p>
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

  _styles() { return ''; }
}

if (!customElements.get('kygo-staying-asleep-factors')) {
  customElements.define('kygo-staying-asleep-factors', KygoStayingAsleepFactors);
}
