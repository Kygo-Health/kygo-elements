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
