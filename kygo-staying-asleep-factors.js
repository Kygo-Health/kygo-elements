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
      ]
    };
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>:host { display:block; font-family: system-ui, -apple-system, sans-serif; padding: 40px 20px; text-align:center; color:#1E293B; }</style>
      <h1>Staying Asleep Factor Explorer</h1>
      <p>Coming soon — 31 research-backed factors that affect sleep maintenance (WASO, arousals, fragmentation).</p>
    `;
  }
}

if (!customElements.get('kygo-staying-asleep-factors')) {
  customElements.define('kygo-staying-asleep-factors', KygoStayingAsleepFactors);
}
