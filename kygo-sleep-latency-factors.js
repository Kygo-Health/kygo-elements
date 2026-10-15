/**
 * Kygo Health — Sleep Latency Factor Explorer
 * Tag: kygo-sleep-latency-factors
 * Interactive tool exploring 57 research-backed factors that affect sleep onset latency across 6 categories
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

/** Loads the shared <kygo-cta> element on demand. Wix embeds this file on its
 *  own, so the CTA definition has to come along rather than be assumed present. */
function __ensureKygoCta() {
  if (customElements.get('kygo-cta')) return;
  if (document.querySelector('script[data-kygo-cta-loader]')) return;
  const s = document.createElement('script');
  s.src = 'https://kygo-health.github.io/kygo-elements/kygo-cta.js';
  s.setAttribute('data-kygo-cta-loader', '');
  s.async = true;
  document.head.appendChild(s);
}

/** Appends a JSON-LD script unless the page already serves that @type from the Wix SEO panel */
function __kygoAppendLdOnce(script) {
  let type;
  try { type = JSON.parse(script.textContent)['@type']; } catch (e) { /* malformed: append as-is */ }
  const served = type && [...document.querySelectorAll('script[type="application/ld+json"]')].some(s => {
    if ([...s.attributes].some(a => a.name.startsWith('data-kygo'))) return false;
    try { return JSON.parse(s.textContent)['@type'] === type; } catch (e) { return false; }
  });
  if (!served) document.head.appendChild(script);
}

class KygoSleepLatencyFactors extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._activeCategory = 'environment';
    this._expandedFactor = null;
    this._expandedTopPick = null;
    this._sortMode = 'evidence';
    this._eventsBound = false;
  }

  connectedCallback() {
    __ensureKygoCta();
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, 'Sleep Latency Factor Explorer by Kygo Health. Explore 57 research-backed factors that affect how fast you fall asleep (sleep onset latency, SOL) across 6 categories: Environment and Sleep Hygiene, Therapies and Routines, Nutrition and Substances, Supplements, Exercise and Movement, and Demographics and Physiology. Each factor was re-checked against its primary source in October 2026. A Do More / Cut Back board lists the changeable factors with strong or moderate evidence: do more of a warm bath or shower 1 to 2 hours before bed (about 10 minutes faster), stimulus control (bed is for sleep only), CBT-I (19 minutes faster across 20 RCTs), writing a to-do list at bedtime (15.8 vs 25.1 minutes), regular exercise, yoga and Tai Chi, earplugs and an eye mask, bed socks in a cool room, a high-GI carb dinner about 4 hours before bed, low-melanopic screen light, melatonin around 4 mg about 3 hours before bed (7 minutes faster across 19 RCTs) and ashwagandha; cut back on caffeine (adds 9.1 minutes across 24 studies), energy drinks, smoking, bright evening light, hours of tablet reading, a hot bedroom, bedroom noise, stuffy air and high CO2, hard workouts ending within an hour of bed, and racing thoughts at bedtime. Alcohol only speeds sleep onset at about 5 or more drinks and disrupts REM. Tested nulls: cannabis, intermittent fasting, higher protein, CBD isolate, valerian, omega-3 fish oil, probiotics, acupuncture vs sham, sleep restriction therapy for falling asleep, weighted blankets, cooling bedding, and daily screen time in youth. Mixed results: L-theanine and music feel faster but are not faster on trackers, hypnosis and guided imagery do no better than sham, alpha-lactalbumin, casein hydrolysate (Lactium), saffron, phone use before bed and morning light therapy. Other factors: magnesium in older adults, glycine 3 g, GABA 300 mg, cannabinol CBN 300 mg, brief behavioral therapy BBTI, digital CBT-I apps, mindfulness, gentle bed rocking, sleep-tech wearables, cocaine, older age, evening chronotype, pre-sleep cognitive arousal and race. Each factor shows its effect on sleep onset (faster, slower, mixed, no clear effect), evidence strength, mechanism, dose and a linked peer-reviewed source. How to fall asleep faster. What affects sleep latency. Best supplements to fall asleep. Does caffeine keep you awake. Data sourced from peer-reviewed studies and meta-analyses.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Categories ──────────────────────────────────────────────────────

  get _categories() {
    return {
      environment:  { name: 'Environment & Sleep Hygiene', icon: 'moon',     intro: 'Most of the levers you control live here: temperature, light, noise and what the bed means to your brain. Warm-then-cool and dark-and-quiet are the themes.' },
      therapies:    { name: 'Therapies & Routines',        icon: 'brain',    intro: 'If falling asleep is a regular struggle, structured behavioral therapy (CBT-I) has the biggest, best-tested effect on this page. Several popular add-ons do no better than a fake version.' },
      nutrition:    { name: 'Nutrition & Substances',      icon: 'salad',    intro: 'Caffeine is the clearest thing to cut. Alcohol only speeds sleep onset at heavy doses, and it damages the rest of the night.' },
      supplements:  { name: 'Supplements',                 icon: 'pill',     intro: 'Melatonin has the strongest evidence, and its effect is modest: about 7 minutes. Many popular supplements (valerian, omega-3, probiotics, CBD) showed no effect on how fast you fall asleep.' },
      exercise:     { name: 'Exercise & Movement',         icon: 'dumbbell', intro: 'Regular exercise helps you fall asleep faster, and evening workouts are fine for most people. Only very hard sessions ending within an hour of bed may delay sleep.' },
      physiology:   { name: 'Demographics & Physiology',   icon: 'users',    intro: 'You can\'t change most of these, but they explain why your baseline differs from someone else\'s. Compare yourself to your own trend.' }
    };
  }

  // ── Factor Data ─────────────────────────────────────────────────────
  // Re-verified against each primary source on 15 Oct 2026. "No clear
  // effect" (neutral) rows are tested nulls, kept on purpose.

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
          effect: 'Positive (shorter SOL)',
          keyFinding: 'SOL 9.0 vs 17.5 min, high vs low GI (n=12)',
          whatThisMeans: 'High-GI carbs about 4 hours before bed help you fall asleep faster.',
          mechanism: 'Carbohydrate raises blood tryptophan, the building block of serotonin and melatonin. The authors proposed this route; the study did not measure it.',
          dosage: 'Randomized crossover, n=12 healthy men, PSG: SOL 9.0 vs 17.5 min, high vs low GI rice meal 4 h before bed (p=0.009); the same meal 1 h before bed gave 14.6 min. Afaghi 2007.',
          source: { url: 'https://doi.org/10.1093/ajcn/85.2.426', label: 'Afaghi et al., Am J Clin Nutr 2007' }
        },
        {
          key: 'caffeine', name: 'Caffeine',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (longer SOL)',
          keyFinding: '+9.1 min to fall asleep (24-study meta)',
          whatThisMeans: 'Caffeine delays sleep onset by about 9 minutes on average.',
          mechanism: 'Caffeine blocks adenosine receptors, masking the sleep pressure that builds through the day.',
          dosage: 'Meta-analysis, 24 studies (19 on SOL, mostly PSG): +9.1 min SOL (95% CI 3.8 to 14.4); not moderated by final dose or timing. Gardiner 2023.',
          source: { url: 'https://doi.org/10.1016/j.smrv.2023.101764', label: 'Gardiner et al., Sleep Med Rev 2023' }
        },
        {
          key: 'alcohol', name: 'Alcohol',
          direction: 'mixed', evidence: 'strong',
          effect: 'Dose-dependent',
          keyFinding: 'Faster onset only at about 5+ drinks; REM hit from low doses',
          whatThisMeans: 'Heavy drinking knocks you out faster but wrecks later sleep.',
          mechanism: 'Alcohol boosts GABA-A signalling, which is sedating at high doses. As it wears off later in the night, sleep fragments and REM is disrupted.',
          dosage: 'Meta-analysis, 27 studies, PSG, healthy adults: SOL shortens 6.4 min per 1 g/kg (95% CI 3.5 to 9.3); significant only at about 0.85 g/kg (~5 drinks) or more; REM disrupted from low doses. Gardiner 2025.',
          source: { url: 'https://doi.org/10.1016/j.smrv.2024.102030', label: 'Gardiner et al., Sleep Med Rev 2025' }
        },
        {
          key: 'nicotine', name: 'Nicotine / Smoking',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Smokers +5.4 min to fall asleep (n=6,400)',
          whatThisMeans: 'Smokers take longer to fall asleep. Former smokers were no different from never smokers.',
          mechanism: 'Nicotine is a stimulant acting on nicotinic acetylcholine receptors, and smokers may go into mild withdrawal overnight. Former smokers matching never smokers suggests the effect reverses after quitting.',
          dosage: 'PSG cohort, n=6,400 (Sleep Heart Health Study): current smokers +5.4 min SOL vs never smokers (95% CI 2.9 to 7.9); former smokers no different (Zhang 2006). PSG case-control, 44 smokers vs 44 matched never smokers: longer sleep latency in smokers (Jaehne 2012).',
          source: { url: 'https://doi.org/10.1093/aje/kwj231', label: 'Zhang et al., Am J Epidemiol 2006' },
          source2: { url: 'https://doi.org/10.1016/j.sleep.2012.06.026', label: 'Jaehne et al., Sleep Med 2012' }
        },
        {
          key: 'cannabis', name: 'Cannabis',
          direction: 'neutral', evidence: 'moderate',
          effect: 'Null / inconsistent',
          keyFinding: 'No consistent effect; quitting lengthens SOL',
          whatThisMeans: 'Cannabis doesn\'t reliably help you fall asleep, and quitting makes it harder for a while.',
          mechanism: 'THC acts on CB1 receptors and can be sedating, but tolerance builds with regular use. Stopping after regular use brings withdrawal insomnia.',
          dosage: 'Meta-analysis, 18 PSG studies (9 pooled): no consistent effect on SOL; withdrawal from regular use consistently prolongs SOL. Velzeboer 2025.',
          source: { url: 'https://doi.org/10.1016/j.smrv.2025.102164', label: 'Velzeboer et al., Sleep Med Rev 2025' }
        },
        {
          key: 'energy-drinks', name: 'Energy Drinks',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Daily users ~1.8x more likely to take 2 h+ (n=53,226)',
          whatThisMeans: 'Students who drink energy drinks more often take longer to fall asleep.',
          mechanism: 'Energy drinks are a concentrated caffeine source, and caffeine blocks the adenosine signal that builds sleep pressure. The study was a survey, so it shows a link, not cause.',
          dosage: 'Cross-sectional, n=53,226 Norwegian students, self-report: daily vs never/seldom use, risk of SOL over 2 h RR 1.89 in men (1.62 to 2.21) and 1.77 in women (1.60 to 1.97); risk rises from 1 to 3 times a month upward; age-adjusted only. Kaldenbach 2024.',
          source: { url: 'https://doi.org/10.1136/bmjopen-2023-072951', label: 'Kaldenbach et al., BMJ Open 2024' }
        },
        {
          key: 'cocaine', name: 'Cocaine Use',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Longer SOL a top finding across 19 studies',
          whatThisMeans: 'Cocaine use makes it take longer to fall asleep.',
          mechanism: 'Cocaine blocks the reuptake of dopamine and noradrenaline, a strongly wake-promoting effect, and sleep is also disrupted during withdrawal.',
          dosage: 'Systematic review, 19 studies (12 human), objective sleep only: longer SOL was one of the four most consistent findings, with lower total sleep, sleep efficiency and REM. Medigue 2025.',
          source: { url: 'https://doi.org/10.1016/j.neubiorev.2025.106278', label: 'Medigue et al., Neurosci Biobehav Rev 2025' }
        },
        {
          key: 'alpha-lactalbumin', name: 'Alpha-Lactalbumin Drink',
          direction: 'mixed', evidence: 'moderate',
          effect: 'Positive (mixed)',
          keyFinding: '5 of 8 studies positive; 2 RCTs null',
          whatThisMeans: 'A tryptophan-rich milk protein drink may help you fall asleep faster, but trials disagree.',
          mechanism: 'Alpha-lactalbumin is a whey protein rich in tryptophan, the building block of serotonin and melatonin. Whether one drink raises brain tryptophan enough to matter is not established.',
          dosage: 'Systematic review, 8 studies, 5 positive, SOL the most improved metric (not pooled). RCT, n=18 female rugby players, actigraphy: SOL 11.6 and 17.0 min vs 21.2 and 22.5 min on a whey control (interaction p=0.01). Nulls: Ferguson 2021 (n=15), Barnard 2025 (n=24, 7 nights).',
          source: { url: 'https://doi.org/10.1111/jsr.14141', label: 'Barnard et al., J Sleep Res 2024' },
          source2: { url: 'https://doi.org/10.5114/biolsport.2023.116002', label: 'Gratwicke et al., Biol Sport 2022' }
        },
        {
          key: 'intermittent-fasting', name: 'Intermittent Fasting',
          direction: 'neutral', evidence: 'moderate',
          effect: 'Null to slightly negative',
          keyFinding: 'Mostly null across 16 RCTs',
          whatThisMeans: 'Fasting diets mostly don\'t change how fast you fall asleep.',
          mechanism: 'No consistent pathway shown. In single comparisons, alternate-day fasting and time-restricted eating did slightly worse than plain calorie restriction.',
          dosage: 'Bayesian network meta-analysis, 16 RCTs, adults with overweight/obesity: most comparisons null; alternate-day fasting worse PSQI latency score vs calorie restriction (MD 1.04, 0.15 to 1.93); time-restricted eating 9.54 min longer SOL than calorie restriction (3.43 to 15.68). Zhang 2025.',
          source: { url: 'https://doi.org/10.1016/j.numecd.2025.104365', label: 'Zhang et al., Nutr Metab Cardiovasc Dis 2025' }
        },
        {
          key: 'protein', name: 'Higher Protein Intake',
          direction: 'neutral', evidence: 'moderate',
          effect: 'No clear effect',
          keyFinding: 'No effect on latency (7 RCTs pooled)',
          whatThisMeans: 'Eating more protein overall doesn\'t change time to fall asleep.',
          mechanism: 'Not established; pooled trials found no effect, at very low certainty.',
          dosage: 'Meta-analysis of RCTs: sleep latency pooled across 7 studies, no significant effect; very low certainty. Wirth 2023.',
          source: { url: 'https://doi.org/10.1093/nutrit/nuac061', label: 'Wirth et al., Nutr Rev 2023' }
        }
      ],

      supplements: [
        {
          key: 'melatonin', name: 'Melatonin',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (shorter SOL)',
          keyFinding: '−7 min to fall asleep (19 RCTs); peaks near 4 mg',
          whatThisMeans: 'Melatonin cuts time to fall asleep by about 7 minutes. More isn\'t better past about 4 mg, and timing matters.',
          mechanism: 'Melatonin acts on MT1 and MT2 receptors, signalling biological night to the body clock and promoting sleep onset.',
          dosage: 'Meta-analysis, 19 RCTs, n=1,683, primary sleep disorders: SOL −7.06 min (95% CI 4.37 to 9.75, p<0.001); objective −5.5 min, subjective −10.7 min; longer trials gave larger effects (Ferracioli-Oda 2013). Dose-response meta-analysis, 26 RCTs: SOL and total sleep effects peak around 4 mg/day, taken about 3 h before bed (Cruz-Sanabria 2024).',
          source: { url: 'https://doi.org/10.1371/journal.pone.0063773', label: 'Ferracioli-Oda et al., PLoS One 2013' },
          source2: { url: 'https://doi.org/10.1111/jpi.12985', label: 'Cruz-Sanabria et al., J Pineal Res 2024' },
          affiliate: { url: 'https://www.amazon.com/dp/B08666GMWG?tag=kygohealthapp-20&th=1', label: 'Melatonin Supplement', slug: 'melatonin-gummies' }
        },
        {
          key: 'ashwagandha', name: 'Ashwagandha',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'SMD −0.53 for SOL (3 RCTs, actigraphy)',
          whatThisMeans: 'Ashwagandha shortens sleep onset, most clearly in people with insomnia.',
          mechanism: 'Proposed to lower stress hormones and pre-sleep arousal and to act on GABA signalling; the mechanism in humans is not established.',
          dosage: 'Meta-analysis, 5 RCTs (n=400); actigraphy SOL pooled from 3 RCTs (n=281): SMD −0.53 (95% CI −0.77 to −0.29), GRADE moderate. Overall sleep benefit larger at 600 mg/day or more, 8+ weeks, and in insomnia. Cheah 2021.',
          source: { url: 'https://doi.org/10.1371/journal.pone.0257843', label: 'Cheah et al., PLoS One 2021' },
          affiliate: { url: 'https://www.amazon.com/dp/B073DN2YG9?tag=kygohealthapp-20&th=1', label: 'Ashwagandha Extract', slug: 'ashwagandha-600mg' }
        },
        {
          key: 'magnesium', name: 'Magnesium',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: '−17 min SOL in older adults (3 RCTs, low certainty)',
          whatThisMeans: 'Magnesium may cut sleep onset about 17 minutes in older adults.',
          mechanism: 'Magnesium dampens nerve excitability by blocking NMDA receptors and supporting GABA signalling. The trials were small and in older adults only.',
          dosage: 'Meta-analysis, 3 RCTs, n=151 older adults: SOL −17.36 min (95% CI −27.27 to −7.44, p=0.0006); low to very low certainty. Mah & Pitre 2021.',
          source: { url: 'https://doi.org/10.1186/s12906-021-03297-z', label: 'Mah & Pitre, BMC Complement Med Ther 2021' },
          affiliate: { url: 'https://www.amazon.com/dp/B00151G8L8?tag=kygohealthapp-20&th=1', label: 'Magnesium Glycinate', slug: 'magnesium-glycinate' }
        },
        {
          key: 'glycine', name: 'Glycine (3 g)',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'Faster sleep onset on PSG (n=11, p=0.01)',
          whatThisMeans: '3 grams of glycine before bed helps you fall asleep faster.',
          mechanism: 'In animal work, glycine widens skin blood vessels so core temperature falls, part of the body\'s sleep-onset signal. Not confirmed as the human mechanism.',
          dosage: 'Randomized single-blind crossover, n=11 poor sleepers, PSG: 3 g before bed shortened latency to sleep onset (p=0.01) and to slow-wave sleep (p=0.019). Corresponding author works for Ajinomoto, a glycine maker. Yamadera 2007.',
          source: { url: 'https://doi.org/10.1111/j.1479-8425.2007.00262.x', label: 'Yamadera et al., Sleep Biol Rhythms 2007' },
          affiliate: { url: 'https://www.amazon.com/s?k=Glycine%20Powder&rh=p_72%3A1248903011&tag=kygohealthapp-20', label: 'Glycine Powder', slug: 'glycine-search' }
        },
        {
          key: 'gaba', name: 'GABA (300 mg)',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'SOL 13.4 → 5.7 min at 300 mg (n=40, PSG)',
          whatThisMeans: '300 mg GABA shortened sleep onset in one small trial; low doses haven\'t beaten placebo.',
          mechanism: 'Oral GABA barely crosses into the brain, so any effect may run through the gut and vagus nerve; this is not established.',
          dosage: 'RCT, n=40 (30 GABA, 10 placebo), insomnia symptoms, PSG, 4 weeks: SOL 13.4 to 5.7 min in the GABA arm, group x time p=0.009 (Byun 2018). A 75 mg RCT (Yoon 2022, n=50) cut SOL within-group but not vs placebo.',
          source: { url: 'https://doi.org/10.3988/jcn.2018.14.3.291', label: 'Byun et al., J Clin Neurol 2018' },
          affiliate: { url: 'https://www.amazon.com/dp/B0FT6GB5MB?tag=kygohealthapp-20&th=1', label: 'GABA Supplement', slug: 'gaba-500mg' }
        },
        {
          key: 'l-theanine', name: 'L-Theanine',
          direction: 'mixed', evidence: 'moderate',
          effect: 'Positive (subjective only)',
          keyFinding: 'Feels faster; measured SOL unchanged (19 RCTs)',
          whatThisMeans: 'People report falling asleep slightly faster, but devices don\'t confirm it.',
          mechanism: 'L-theanine is linked to relaxation without sedation, which may change how falling asleep feels more than how fast it happens.',
          dosage: 'Meta-analysis, 19 RCTs (18 pooled), N=897; subjective SOL SMD 0.15 favoring L-theanine (95% CI 0.01 to 0.29, p=0.04; 10 studies). Objective SOL (7 studies): no difference, MD 0.13 min (95% CI −7.96 to 8.22, p=0.98). Bulman 2025.',
          source: { url: 'https://doi.org/10.1016/j.smrv.2025.102076', label: 'Bulman et al., Sleep Med Rev 2025' },
          affiliate: { url: 'https://www.amazon.com/dp/B000H7P9M0?tag=kygohealthapp-20&th=1', label: 'L-Theanine 200mg', slug: 'l-theanine-200mg' }
        },
        {
          key: 'cbd-isolate', name: 'CBD Isolate (150 mg)',
          direction: 'neutral', evidence: 'moderate',
          effect: 'Null on SOL',
          keyFinding: 'No change in diary SOL vs placebo (n=30)',
          whatThisMeans: 'CBD alone doesn\'t appear to change how fast you fall asleep.',
          mechanism: 'CBD has little direct action on CB1 receptors and is not strongly sedating; any sleep benefit is thought to come through lower anxiety.',
          dosage: 'Pilot RCT, n=30 (15/15), primary insomnia, 2 weeks: no difference in diary SOL vs placebo; actigraphy sleep efficiency improved at week 2. Narayan 2024.',
          source: { url: 'https://doi.org/10.5664/jcsm.10998', label: 'Narayan et al., J Clin Sleep Med 2024' }
        },
        {
          key: 'valerian', name: 'Valerian',
          direction: 'neutral', evidence: 'strong',
          effect: 'No clear effect',
          keyFinding: 'SOL +0.7 min vs placebo (18 RCTs)',
          whatThisMeans: 'Pooled trials show valerian doesn\'t shorten time to fall asleep.',
          mechanism: 'Valerian is thought to act on GABA and adenosine signalling, but pooled trials show no measurable effect on sleep onset.',
          dosage: 'Meta-analysis, 18 placebo RCTs: SOL MD 0.70 min (95% CI −3.44 to 4.83). Fernández-San-Martín 2010.',
          source: { url: 'https://doi.org/10.1016/j.sleep.2009.12.009', label: 'Fernández-San-Martín et al., Sleep Med 2010' }
        },
        {
          key: 'omega-3', name: 'Omega-3 (Fish Oil)',
          direction: 'neutral', evidence: 'strong',
          effect: 'Null in adults',
          keyFinding: 'No effect on adult sleep latency',
          whatThisMeans: 'Fish oil doesn\'t help adults fall asleep faster.',
          mechanism: 'No pathway to faster sleep onset has been shown in adults.',
          dosage: 'Meta-analysis, 12 trials + 8 longitudinal studies: no effect on adult sleep latency. Dai 2021.',
          source: { url: 'https://doi.org/10.1093/nutrit/nuaa103', label: 'Dai et al., Nutr Rev 2021' }
        },
        {
          key: 'probiotics', name: 'Probiotics',
          direction: 'neutral', evidence: 'strong',
          effect: 'No clear effect',
          keyFinding: 'No effect on measured latency (14 studies)',
          whatThisMeans: 'Probiotics haven\'t been shown to help you fall asleep faster.',
          mechanism: 'The gut-brain axis is a plausible route, but trials have not shown a measurable effect on sleep onset.',
          dosage: 'Meta-analysis, 14 studies: no effect on PSG/actigraphy latency (Irwin 2020). Meta-analysis, 3 RCTs, n=226 insomnia: SOL −4.74 min (−9.42 to −0.05), p=0.05, judged non-significant by the authors (Liu 2025).',
          source: { url: 'https://doi.org/10.1038/s41430-020-0656-x', label: 'Irwin et al., Eur J Clin Nutr 2020' },
          source2: { url: 'https://doi.org/10.3389/fmicb.2025.1596990', label: 'Liu et al., Front Microbiol 2025' }
        },
        {
          key: 'casein-hydrolysate', name: 'Casein Hydrolysate (Lactium)',
          direction: 'mixed', evidence: 'moderate',
          effect: 'Positive (mixed)',
          keyFinding: 'SOL −7.7 vs +6.1 min on placebo (n=36, PSG)',
          whatThisMeans: 'A milk peptide shortened sleep onset in one sleep-lab trial but not another.',
          mechanism: 'Lactium contains a milk peptide (alpha-casozepine) that binds GABA-A receptors in animal studies, a proposed calming route.',
          dosage: 'RCT, n=36 chronic insomnia, PSG, 4 weeks: SOL −7.7 vs +6.1 min on placebo (p=0.012) (Chang 2024). Crossover RCT (Kim 2019, n=48, maker co-author): PSG null, diary SOL better.',
          source: { url: 'https://doi.org/10.1016/j.clnu.2024.10.039', label: 'Chang et al., Clin Nutr 2024' }
        },
        {
          key: 'saffron', name: 'Saffron',
          direction: 'mixed', evidence: 'moderate',
          effect: 'Positive (mixed)',
          keyFinding: 'SOL 14.3 → 11.3 vs 14.7 → 17.5 min (n=42)',
          whatThisMeans: 'Saffron may trim a few minutes in older adults, but results are inconsistent.',
          mechanism: 'Saffron compounds (crocin, safranal) are thought to act on serotonin and GABA signalling; the human mechanism is not established.',
          dosage: 'Pilot RCT, n=42 older adults, 30 mg, 4 weeks, EEG headband: SOL 14.3 to 11.3 vs 14.7 to 17.5 min on placebo (p=0.03); the maker\'s employees co-authored (Lang 2025). RCT (Pachikian 2021, n=66, maker-funded): actigraphy SOL not reported as changed.',
          source: { url: 'https://doi.org/10.1039/d5fo00917k', label: 'Lang et al., Food Funct 2025' }
        },
        {
          key: 'cbn', name: 'Cannabinol (CBN, 300 mg)',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: '300 mg cut SOL in one night (n=20, PSG)',
          whatThisMeans: 'A high single dose of CBN shortened sleep onset in one lab study.',
          mechanism: 'CBN is a weak CB1 receptor agonist; a high dose may be mildly sedating. The 30 mg dose did nothing.',
          dosage: 'Single-night 3-arm crossover RCT, n=20 insomnia, PSG: 300 mg shortened SOL (p=0.004, dz=−0.74); 30 mg not significant; primary outcome (WASO) null. Lavender 2026.',
          source: { url: 'https://doi.org/10.1111/jsr.70284', label: 'Lavender et al., J Sleep Res 2026' }
        }
      ],

      exercise: [
        {
          key: 'regular-exercise', name: 'Regular Exercise',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'd=0.35 shorter SOL (66-study meta)',
          whatThisMeans: 'Exercising regularly helps you fall asleep faster.',
          mechanism: 'Regular activity builds sleep pressure and lowers anxiety, both of which help sleep onset. The benefit shrinks in older samples.',
          dosage: 'Meta-analysis, 66 studies: regular exercise d=0.35 for shorter SOL (95% CI 0.00 to 0.70, 9 comparisons); a single bout d=0.17 (p=.03, 35 comparisons); the SOL benefit of regular exercise shrinks in older samples. Kredlow 2015.',
          source: { url: 'https://doi.org/10.1007/s10865-015-9617-6', label: 'Kredlow et al., J Behav Med 2015' }
        },
        {
          key: 'yoga', name: 'Yoga',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: '−29 min diary SOL in insomnia (22 RCTs)',
          whatThisMeans: 'A regular yoga practice can meaningfully shorten sleep onset in people with insomnia.',
          mechanism: 'Slow breathing and relaxation lower pre-sleep arousal. The evidence is low certainty and mostly from sleep diaries.',
          dosage: 'Network meta-analysis, 22 RCTs, n=1,348 adults with insomnia: yoga cut diary SOL by 29 min vs active control (95% CI 8 to 50), low certainty (Bu 2026). RCT (Khalsa 2021, n=40): Kundalini yoga beat sleep hygiene on diary SOL, d=−1.16.',
          source: { url: 'https://doi.org/10.1136/bmjebm-2024-113512', label: 'Bu et al., BMJ Evid Based Med 2026' },
          source2: { url: 'https://doi.org/10.5664/jcsm.9320', label: 'Khalsa et al., J Clin Sleep Med 2021' }
        },
        {
          key: 'tai-chi', name: 'Tai Chi',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: '−25 min diary SOL in insomnia (NMA)',
          whatThisMeans: 'Tai Chi improves sleep onset in people with insomnia.',
          mechanism: 'Gentle movement with slow breathing and focused attention lowers arousal before bed.',
          dosage: 'Network meta-analysis (Bu 2026): diary SOL −25 min vs control (95% CI 8 to 41), low certainty. Meta-analysis (Yang 2023, 16 RCTs, n=1,547): PSQI sleep-latency subscore −0.57 points (7 RCTs).',
          source: { url: 'https://doi.org/10.1136/bmjebm-2024-113512', label: 'Bu et al., BMJ Evid Based Med 2026' },
          source2: { url: 'https://doi.org/10.3390/ijerph20043074', label: 'Yang et al., Int J Environ Res Public Health 2023' }
        },
        {
          key: 'vigorous-late', name: 'Vigorous Exercise <1 h Before Bed',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Possible only when a hard session ends ≤1 h before bed',
          whatThisMeans: 'Evening workouts are fine; only very hard sessions right before bed may delay sleep.',
          mechanism: 'Hard exercise raises heart rate, core temperature and stress hormones, which take time to settle. Evening exercise overall did not impair sleep.',
          dosage: 'Meta-analysis, 23 studies, healthy adults: evening exercise overall did not impair sleep. The authors suggest SOL may suffer only after vigorous exercise ending 1 h or less before bed (not a pooled estimate). Stutz 2019.',
          source: { url: 'https://doi.org/10.1007/s40279-018-1015-0', label: 'Stutz et al., Sports Med 2019' }
        }
      ],

      therapies: [
        {
          key: 'cbt-i', name: 'CBT-I (Therapist-Led)',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (shorter SOL)',
          keyFinding: '−19 min to fall asleep (20 RCTs)',
          whatThisMeans: 'Structured insomnia therapy cuts time to fall asleep by about 19 minutes.',
          mechanism: 'Combines stimulus control, sleep restriction, work on unhelpful sleep worries and sleep education, retraining the bed as a cue for sleep and lowering bedtime arousal.',
          dosage: 'Meta-analysis, 20 RCTs, n=1,162 chronic insomnia: diary SOL −19.03 min (95% CI 14.12 to 23.93) vs inactive controls. Trauer 2015.',
          source: { url: 'https://doi.org/10.7326/M14-2841', label: 'Trauer et al., Ann Intern Med 2015' }
        },
        {
          key: 'bbti', name: 'Brief Behavioral Therapy (BBTI)',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (shorter SOL)',
          keyFinding: '−19.8 min SOL vs usual care (18 RCTs)',
          whatThisMeans: 'A 2 to 4 session behavioral program works about as well as full CBT-I.',
          mechanism: 'A short behavioral version of CBT-I built mainly on stimulus control and sleep restriction.',
          dosage: 'Network meta-analysis, 18 RCTs, n=1,104: SOL −19.81 min (−30.64 to −8.98) vs usual care; face-to-face BBTI similar to CBT-I. Hasan 2025.',
          source: { url: 'https://doi.org/10.1111/wvn.70075', label: 'Hasan et al., Worldviews Evid Based Nurs 2025' }
        },
        {
          key: 'digital-cbt-i', name: 'Digital CBT-I (App or Online)',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (mostly self-report)',
          keyFinding: '−12.6 min diary SOL (96 RCTs); smaller on trackers',
          whatThisMeans: 'Insomnia apps help you feel you fall asleep faster; trackers show a smaller effect.',
          mechanism: 'The same components as CBT-I, delivered by app or website. Self-reported gains are larger than tracker-measured ones.',
          dosage: 'Network meta-analysis, 96 RCTs, n=18,419: diary SOL −12.57 min (−15.14 to −10.00), low certainty. Objective SOL (8 RCTs, n=604): not significant overall; −4.28 min only vs active controls. Tong 2026.',
          source: { url: 'https://doi.org/10.1186/s12916-026-05129-8', label: 'Tong et al., BMC Med 2026' }
        },
        {
          key: 'mindfulness', name: 'Mindfulness Programs',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (small)',
          keyFinding: '−8 min measured SOL (digital mindfulness)',
          whatThisMeans: 'Regular mindfulness practice trims a few minutes off falling asleep.',
          mechanism: 'Trains attention away from worry, lowering the mental arousal that delays sleep.',
          dosage: 'Network meta-analysis: digital mindfulness objective SOL −7.96 min (−15.50 to −0.42), moderate certainty (Tong 2026). Cancer-patient meta-analysis (Han 2023): mindfulness shortened objective SOL vs usual care/waitlist, not vs active controls.',
          source: { url: 'https://doi.org/10.1186/s12916-026-05129-8', label: 'Tong et al., BMC Med 2026' },
          source2: { url: 'https://doi.org/10.1016/j.ctim.2023.102954', label: 'Han et al., Complement Ther Med 2023' }
        },
        {
          key: 'todo-list', name: 'Writing a To-Do List at Bedtime',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'SOL 15.8 vs 25.1 min (n=57, PSG)',
          whatThisMeans: 'Writing tomorrow\'s to-do list before bed helped people fall asleep about 9 minutes faster.',
          mechanism: 'Writing down unfinished tasks may offload the worry about them that keeps the mind busy at lights out. The more specific the list, the faster people fell asleep.',
          dosage: 'Randomized experiment, n=57 healthy adults aged 18 to 30, PSG: a 5 min to-do list 15.8 vs 25.1 min after writing about completed tasks (p=0.02, d=0.63). Scullin 2017.',
          source: { url: 'https://doi.org/10.1037/xge0000374', label: 'Scullin et al., J Exp Psychol Gen 2017' }
        },
        {
          key: 'music', name: 'Music at Bedtime',
          direction: 'mixed', evidence: 'moderate',
          effect: 'Positive (subjective only)',
          keyFinding: 'Feels easier; measured SOL may not change (13 RCTs)',
          whatThisMeans: 'Music makes falling asleep feel easier, but trackers don\'t show a change.',
          mechanism: 'Music may relax and distract from worry; objective measures have not confirmed a faster sleep onset.',
          dosage: 'Cochrane review, 13 RCTs, n=1,007 insomnia: self-rated SOL problems score −0.60 (−0.83 to −0.37; 3 studies, low certainty); objective SOL (3 studies, n=136) may not improve. Jespersen 2022.',
          source: { url: 'https://doi.org/10.1002/14651858.CD010459.pub3', label: 'Jespersen et al., Cochrane 2022' }
        },
        {
          key: 'hypnosis', name: 'Hypnosis, Autogenic Training, Imagery',
          direction: 'mixed', evidence: 'moderate',
          effect: 'Positive vs waitlist; null vs sham',
          keyFinding: 'Beat waitlist, not sham (13 RCTs)',
          whatThisMeans: 'Relaxation scripts may help, but no more than a fake version.',
          mechanism: 'Relaxation scripts aim to lower arousal, but sham versions worked as well, pointing to expectation or general relaxation rather than the technique.',
          dosage: 'Meta-analysis, 13 RCTs, n=502, diary SOL: hypnotherapy vs waitlist SMD −0.88 (−1.56 to −0.19); autogenic/imagery −1.16 (−1.92 to −0.40); neither beat sham; 11 of 13 trials low quality. Lam 2015.',
          source: { url: 'https://doi.org/10.1016/j.ctim.2015.07.011', label: 'Lam et al., Complement Ther Med 2015' }
        },
        {
          key: 'acupuncture', name: 'Acupuncture',
          direction: 'neutral', evidence: 'moderate',
          effect: 'Null vs sham',
          keyFinding: '+1.5 min vs sham needling (12 RCTs)',
          whatThisMeans: 'Acupuncture doesn\'t beat fake needling for falling asleep.',
          mechanism: 'No specific effect beyond sham needling; the apparent benefit came from acupuncture added to medication.',
          dosage: 'Meta-analysis, 12 RCTs, PSG SOL −7.25 min (−11.29 to −3.20), driven by acupuncture plus medication vs medication alone; vs sham +1.54 min (−4.98 to 8.06). Hu 2026.',
          source: { url: 'https://doi.org/10.3389/fmed.2026.1807826', label: 'Hu et al., Front Med 2026' }
        },
        {
          key: 'sleep-restriction', name: 'Sleep Restriction Therapy',
          direction: 'neutral', evidence: 'strong',
          effect: 'Null for SOL',
          keyFinding: 'Helps staying asleep, not falling asleep (241 trials)',
          whatThisMeans: 'Restricting time in bed helps you stay asleep, not fall asleep.',
          mechanism: 'Limiting time in bed builds sleep pressure and consolidates sleep, improving efficiency and night waking. Only stimulus control was linked to shorter self-reported latency.',
          dosage: 'Component network meta-analysis, 241 trials, n=31,452: sleep restriction improved sleep efficiency and WASO; only stimulus control was linked to shorter self-reported latency. Furukawa 2024.',
          source: { url: 'https://doi.org/10.1001/jamapsychiatry.2023.5060', label: 'Furukawa et al., JAMA Psychiatry 2024' }
        }
      ],

      environment: [
        {
          key: 'warm-bath', name: 'Warm Bath/Shower 1–2 h Before Bed',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'About 10 min faster (13 pooled studies)',
          whatThisMeans: 'A warm bath before bed helps you fall asleep faster.',
          mechanism: 'Warming the skin opens blood vessels in the hands and feet, so heat leaves the body faster afterward, helping the core-temperature drop that comes with sleep onset.',
          dosage: 'Meta-analysis, 17 studies reviewed (13 pooled): bathing at 40 to 42.5°C, 1 to 2 h before bed, for as little as 10 min significantly shortened SOL, by about 10 min on average (authors\' university release; pooled minutes not in the abstract). Haghayegh 2019.',
          source: { url: 'https://doi.org/10.1016/j.smrv.2019.04.008', label: 'Haghayegh et al., Sleep Med Rev 2019' }
        },
        {
          key: 'stimulus-control', name: 'Stimulus Control (Bed = Sleep Only)',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'g=−0.85 vs passive controls (11 trials)',
          whatThisMeans: 'Only using bed for sleep trains you to fall asleep faster.',
          mechanism: 'Reconditions the bed as a cue for sleep instead of for lying awake and worrying, lowering arousal at bedtime.',
          dosage: 'Meta-analysis, 11 trials, insomnia, diary SOL: g=−0.85 vs passive controls (95% CI −1.64 to −0.06, 5 studies; −0.87 at follow-up); vs active treatments −0.22, not significant. Jansson-Fröjmark 2023.',
          source: { url: 'https://doi.org/10.1111/jsr.14002', label: 'Jansson-Fröjmark et al., J Sleep Res 2023' }
        },
        {
          key: 'bright-evening-light', name: 'Bright Evening Light',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Longer SOL as melanopic light rises (12 lab studies)',
          whatThisMeans: 'The more melatonin-suppressing light before bed, the longer it takes to fall asleep.',
          mechanism: 'Light-sensitive (melanopsin) cells in the eye signal the body clock, which suppresses evening melatonin.',
          dosage: 'Meta-analysis, 12 lab PSG studies: pooled SOL effect 0.69 not significant (95% CI −0.50 to 1.88), but melanopic light from 100 to 1,000 lux showed a dose-response with longer SOL (r=0.59, p=.027). Cajochen 2022.',
          source: { url: 'https://doi.org/10.1177/14771535221078765', label: 'Cajochen et al., Light Res Technol 2022' },
          affiliate: { url: 'https://www.amazon.com/dp/B07W781XWF?tag=kygohealthapp-20&th=1', label: 'Blue Light Glasses', slug: 'blue-light-glasses' }
        },
        {
          key: 'bedroom-noise', name: 'Bedroom Noise',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'Louder bedroom, longer SOL (n=1,076, sound meter)',
          whatThisMeans: 'Noisier bedrooms are linked to taking longer to fall asleep.',
          mechanism: 'Sound can cause brief arousals and keep the brain more alert, delaying the transition into sleep. The study was observational.',
          dosage: 'Cross-sectional, n=1,076 adults 60+, bedside sound meter + actigraphy: each 1 dB of indoor noise linked to longer SOL (β 0.02 log-min, p<0.001) and +0.66 min WASO. Yamagami 2023.',
          source: { url: 'https://academic.oup.com/sleep/article/46/5/zsac197/7008540', label: 'Yamagami et al., Sleep 2023' }
        },
        {
          key: 'hot-bedroom', name: 'Hot Bedroom',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL, small)',
          keyFinding: '+11.3 min on heat-event nights (409 nights)',
          whatThisMeans: 'A hot bedroom adds a few minutes to falling asleep, and about 10 on a heatwave night; it hurts staying asleep more.',
          mechanism: 'A warm room makes it harder to shed heat through the skin, slowing the core-temperature drop that comes with sleep onset.',
          dosage: 'Cohort, n=19 adults, 409 nights, bedroom sensors + actigraphy: +1.85 min SOL per +5°C indoors; heat-event nights +11.3 min (95% CI 2.6 to 20.8) (Caballero-Gomez 2025). Li 2021 (n=68,604, accelerometer): +0.11 min SOL per °C outdoors, vs +0.48 min WASO.',
          source: { url: 'https://doi.org/10.3390/ijerph22091391', label: 'Caballero-Gomez et al., Int J Environ Res Public Health 2025' },
          source2: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8521927/', label: 'Li et al., 2021, n=68,604' }
        },
        {
          key: 'phone-before-bed', name: 'Phone Use Before Bed',
          direction: 'mixed', evidence: 'moderate',
          effect: 'Negative (mixed)',
          keyFinding: 'No devices 2 h before bed: SOL −6 min (n=24)',
          whatThisMeans: 'Phone use right before bed is linked to taking longer to fall asleep, though not every study agrees.',
          mechanism: 'Likely a mix of mental stimulation and screen light; studies disagree on how much it matters.',
          dosage: 'PSG crossover, n=24: banning devices 2 h before bed cut SOL 6.08 min. Wearable EEG, n=21: +0.2 min SOL per minute of pre-bed phone use. Diary crossover, 16 athletes: 36.6 vs 16.8 min. Against: RCT n=167, 1 h phone, actigraphy null. Lu 2025; Montanari 2026.',
          source: { url: 'https://doi.org/10.1080/15402002.2025.2586789', label: 'Lu et al., Behav Sleep Med 2025' },
          source2: { url: 'https://doi.org/10.2196/75898', label: 'Montanari et al., JMIR 2026' }
        },
        {
          key: 'ereader', name: 'Light-Emitting eReader vs Book',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'SOL 25.7 vs 15.8 min after ~4 h tablet reading',
          whatThisMeans: 'Reading on a glowing tablet for hours before bed added about 10 minutes.',
          mechanism: 'Hours of tablet light suppressed and delayed evening melatonin, shifting the body clock later.',
          dosage: 'Inpatient randomized crossover, n=12, PSG, ~4 h reading for 5 evenings: SOL 25.7 vs 15.8 min (p=0.009). Two shorter tablet studies (1 to 2 h) were null. Chang 2015.',
          source: { url: 'https://doi.org/10.1073/pnas.1418490112', label: 'Chang et al., PNAS 2015' }
        },
        {
          key: 'low-melanopic-screen', name: 'Low-Melanopic Screen Light',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive vs standard screen',
          keyFinding: 'Shorter latency than a standard screen (72 men)',
          whatThisMeans: 'Screens that emit less body-clock-stimulating light let people fall asleep faster.',
          mechanism: 'Melanopsin cells in the eye drive evening melatonin suppression; light with less melanopic content stimulates them less.',
          dosage: 'Lab crossover, 72 men, 4 h evening screen use, PSG: lower melanopic light shortened latency in the brightest group (p=0.024); latency about 50% longer from ~5 to ~150 lux melanopic. Schöllhorn 2023.',
          source: { url: 'https://doi.org/10.1038/s42003-023-04598-4', label: 'Schöllhorn et al., Commun Biol 2023' }
        },
        {
          key: 'youth-screen-time', name: 'Daily Screen Time (Youth)',
          direction: 'neutral', evidence: 'strong',
          effect: 'Null',
          keyFinding: 'Later bedtime, not longer SOL (25 studies)',
          whatThisMeans: 'On heavier screen days kids go to bed later but don\'t take longer to fall asleep.',
          mechanism: 'Screen-heavy days push the time of sleep later rather than lengthening the time it takes to fall asleep once in bed.',
          dosage: 'Meta-analysis, 25 within-person studies, n=4,562 aged 3 to 25: more screen time linked to later sleep onset time (r=0.079), not to longer SOL. Bourke 2026.',
          source: { url: 'https://doi.org/10.1001/jamapediatrics.2025.6490', label: 'Bourke et al., JAMA Pediatr 2026' }
        },
        {
          key: 'morning-light', name: 'Morning Bright Light Therapy',
          direction: 'mixed', evidence: 'moderate',
          effect: 'Positive (conflicting)',
          keyFinding: 'g=−0.55 measured SOL; another meta found none',
          whatThisMeans: 'Morning light boxes may help some poor sleepers fall asleep faster.',
          mechanism: 'Bright morning light shifts the body clock earlier, so melatonin rises earlier in the evening.',
          dosage: 'Meta-analysis, 14 studies, n=444 insomnia (primary or comorbid): objective SOL g=−0.545 (Wasilah 2026). Conflicting meta-analysis (Chambe 2023, 13 studies, light at any time of day): no SOL effect.',
          source: { url: 'https://doi.org/10.1016/j.ijnurstu.2026.105588', label: 'Wasilah et al., Int J Nurs Stud 2026' }
        },
        {
          key: 'earplugs-mask', name: 'Earplugs + Eye Mask',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'SOL 46.6 vs 71.4 min in a noisy, bright room',
          whatThisMeans: 'Earplugs and an eye mask helped people fall asleep faster in a noisy, bright room.',
          mechanism: 'Blocking noise and light removes the arousals they cause.',
          dosage: 'RCT, healthy adults in simulated ICU noise and light (n=10 per arm), PSG: SOL 46.6 vs 71.4 min with no aid (p=0.010). Huang 2015.',
          source: { url: 'https://doi.org/10.1186/s13054-015-0842-8', label: 'Huang et al., Crit Care 2015' }
        },
        {
          key: 'skin-warming', name: 'Skin Warming / Bed Socks',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'Gentle trunk-skin warming: SOL −3.1 min (26%)',
          whatThisMeans: 'Gently warming the skin, like bed socks in a cool room, helps you fall asleep a few minutes sooner.',
          mechanism: 'Slightly warmer skin on the trunk, within the normal nightly range, sped sleep onset; the authors suggest skin temperature feeds into the brain\'s sleep centres. In that study, changing core or hand-and-foot temperature alone did not.',
          dosage: 'Lab, n=8, 144 trials: +0.78°C proximal skin warming shortened SOL 3.09 min (1.91 to 4.28), 26% (Raymann 2005). Crossover, n=6 men, 23°C room, actigraphy: bed socks 7.5 min shorter (Ko 2018). Warm footbath studies null.',
          source: { url: 'https://doi.org/10.1152/ajpregu.00492.2004', label: 'Raymann et al., Am J Physiol 2005' },
          source2: { url: 'https://doi.org/10.1186/s40101-018-0172-z', label: 'Ko & Lee, J Physiol Anthropol 2018' }
        },
        {
          key: 'bed-rocking', name: 'Gentle Bed Rocking',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (shorter SOL)',
          keyFinding: 'Faster sleep onset on a rocking bed (n=18)',
          whatThisMeans: 'Sleeping on a slowly rocking bed helped people fall asleep faster.',
          mechanism: 'Slow rhythmic rocking stimulates the inner-ear balance system and synchronized sleep brain rhythms (slow oscillations and spindles) in this study.',
          dosage: 'Crossover, n=18, full-night rocking, PSG: shorter latency to NREM sleep, more deep sleep, fewer arousals. Perrault 2019.',
          source: { url: 'https://doi.org/10.1016/j.cub.2018.12.028', label: 'Perrault et al., Curr Biol 2019' }
        },
        {
          key: 'bedroom-co2', name: 'Bedroom CO2',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'SOL rose linearly from 800 to 3,000 ppm (n=12)',
          whatThisMeans: 'Stuffier bedroom air was linked to taking longer to fall asleep.',
          mechanism: 'Not established. Higher CO2 is also a marker of poor ventilation, so the effect may come from the air quality overall.',
          dosage: 'Chamber study, n=12, 800 / 1,900 / 3,000 ppm over 54 days: SOL rose linearly with CO2. Xu 2020.',
          source: { url: 'https://doi.org/10.1111/ina.12748', label: 'Xu et al., Indoor Air 2020' }
        },
        {
          key: 'sleep-tech', name: 'Sleep-Tech Wearables',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (small)',
          keyFinding: '−4.5 min measured SOL (5 studies)',
          whatThisMeans: 'Some sleep-tech wearables trim a few minutes off falling asleep.',
          mechanism: 'The devices differ (neurostimulation, neurofeedback, light glasses), so there is no single pathway.',
          dosage: 'Meta-analysis, 16 RCTs, n=910 insomnia (neurostimulation, neurofeedback, light glasses): objective SOL −4.52 min (−8.38 to −0.67), 5 studies; subjective null. Zhu 2026.',
          source: { url: 'https://doi.org/10.2196/93496', label: 'Zhu et al., JMIR 2026' }
        },
        {
          key: 'weighted-blanket', name: 'Weighted Blankets',
          direction: 'neutral', evidence: 'moderate',
          effect: 'Null',
          keyFinding: 'No significant change in 3 crossover RCTs',
          whatThisMeans: 'Weighted blankets haven\'t been shown to help people fall asleep faster.',
          mechanism: 'Deep pressure is proposed to be calming, but trials have not shown faster sleep onset.',
          dosage: '3 crossover RCTs: ADHD children n=94 (actigraphy, p=0.43), adopted children n=30, adults with depression n=40 (−4.2 min, p=0.06, maker co-funded). Lönn 2023.',
          source: { url: 'https://doi.org/10.1111/jsr.13990', label: 'Lönn et al., J Sleep Res 2023' }
        },
        {
          key: 'cooling-bedding', name: 'Cooling Bedding',
          direction: 'neutral', evidence: 'moderate',
          effect: 'Null',
          keyFinding: 'No SOL difference (9 RCTs)',
          whatThisMeans: 'Cooling mattresses and pillows haven\'t been shown to speed sleep onset.',
          mechanism: 'Cooling surfaces target body temperature, but trials in healthy adults found no effect on sleep onset.',
          dosage: 'Meta-analysis, 9 RCTs, healthy adults: no SOL difference; very low to low certainty. Pasquier 2025.',
          source: { url: 'https://doi.org/10.1016/j.jtherbio.2024.104030', label: 'Pasquier et al., J Therm Biol 2025' }
        }
      ],

      physiology: [
        {
          key: 'older-age', name: 'Older Age',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (longer SOL)',
          keyFinding: 'SOL lengthens with age, mostly before 60',
          whatThisMeans: 'Falling asleep takes longer as you get older, mostly before 60.',
          mechanism: 'Sleep gets lighter with age (more stage 1 and 2 sleep), and the body clock signal weakens. After 60, only sleep efficiency keeps declining.',
          dosage: 'Meta-analysis, 65 studies, n=3,577, PSG/actigraphy: SOL, WASO, %N1 and %N2 increase with age in adults; after 60 only sleep efficiency keeps declining. Ohayon 2004.',
          source: { url: 'https://doi.org/10.1093/sleep/27.7.1255', label: 'Ohayon et al., Sleep 2004' }
        },
        {
          key: 'evening-chronotype', name: 'Evening Chronotype',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'SOL 21.1 vs 14.1 min, night owls vs larks',
          whatThisMeans: 'Night owls take longer to fall asleep at a normal bedtime.',
          mechanism: 'Evening types\' melatonin rises 2 to 3 hours later, so a conventional bedtime arrives before their body is ready for sleep.',
          dosage: '53 evening vs 35 morning types, 7 nights: actigraphy SOL 21.1 vs 14.1 min (p=.02); in-lab PSG (Colelli 2023, n=2,612) also links evening type to longer SOL. Evening types\' melatonin onset runs 2 to 3 h later (Lack 2009). Lamprou 2024.',
          source: { url: 'https://doi.org/10.1111/ejn.16551', label: 'Lamprou et al., Eur J Neurosci 2024' }
        },
        {
          key: 'cognitive-arousal', name: 'Pre-Sleep Cognitive Arousal',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: 'High arousal: 37 min longer to fall asleep (n=52)',
          whatThisMeans: 'Racing thoughts at bedtime make it harder to fall asleep.',
          mechanism: 'Worry and racing thoughts keep the brain alert, working against the wind-down needed to fall asleep. Adding mental load in the lab also lengthened sleep onset.',
          dosage: 'Observational, n=52, 2 PSG nights: high vs low pre-sleep cognitive arousal took 37 min longer to fall asleep (Kalmbach 2020). Lab experiment (Wuyts 2011, n=15): induced cognitive load prolonged PSG SOL.',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/32247571/', label: 'Kalmbach et al., 2020' }
        },
        {
          key: 'race', name: 'Race (Black vs White US Adults)',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (longer SOL)',
          keyFinding: '+16.3 min adjusted SOL on wrist trackers',
          whatThisMeans: 'Black American adults took about 16 minutes longer to fall asleep on wrist trackers.',
          mechanism: 'The cause was not identified in this study; neighborhood disadvantage did not explain it.',
          dosage: '7-night actigraphy, MIDUS, 133 vs 293: adjusted SOL +16.3 min (10.3 to 22.4); not explained by neighborhood disadvantage. Fuller-Rowell 2016.',
          source: { url: 'https://doi.org/10.1016/j.sleep.2016.10.008', label: 'Fuller-Rowell et al., Sleep Med 2016' }
        }
      ]
    };
  }

  // ── Top Picks ───────────────────────────────────────────────────────

  get _topPicks() {
    return [
      { icon: 'moon',     label: 'Best Single Habit',          answer: 'Warm bath 1–2 h before bed', note: 'Bathing at 40 to 42.5°C for as little as 10 minutes, 1 to 2 hours before bed, cut time to fall asleep by about 10 minutes across pooled studies.', stat: 'About −10 min', category: 'Environment & Sleep Hygiene' },
      { icon: 'brain',    label: 'Best for Insomnia',          answer: 'CBT-I',                      note: 'Structured insomnia therapy cut time to fall asleep by about 19 minutes across 20 RCTs. A 2 to 4 session behavioral version (BBTI) works about as well.', stat: '−19 min, 20 RCTs', category: 'Therapies & Routines' },
      { icon: 'pill',     label: 'Best Supplement',            answer: 'Melatonin',                  note: 'About 7 minutes faster across 19 RCTs. The effect peaks around 4 mg, taken about 3 hours before bed; more isn\'t better.', stat: '−7 min, 19 RCTs', category: 'Supplements' },
      { icon: 'dumbbell', label: 'Best Exercise',              answer: 'Regular exercise',           note: 'A 66-study meta-analysis found regular exercise shortens sleep onset. In people with insomnia, yoga and Tai Chi cut diary sleep onset by about 25 to 29 minutes (low certainty).', stat: 'd=0.35, 66 studies', category: 'Exercise & Movement' },
      { icon: 'wind',     label: 'Quickest Impact',            answer: 'Write tomorrow\'s to-do list', note: 'Five minutes writing a specific to-do list at bedtime: people fell asleep in 15.8 vs 25.1 minutes on a lab sleep study.', stat: 'About −9 min, one night', category: 'Therapies & Routines' },
      { icon: 'alert',    label: 'Biggest Sleep-Onset Killer', answer: 'Caffeine',                   note: 'Adds about 9 minutes to falling asleep on average across 24 studies, and the effect wasn\'t explained by dose or timing.', stat: '+9.1 min SOL', category: 'Nutrition & Substances', warning: true }
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
      minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
      droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>',
      bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>',
      list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
      leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
      volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
      volumeX: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>',
      thermometer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>',
      wheat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/></svg>',
      phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
      sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
      coffee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>',
      cigarette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14"/><path d="M18 8c0-2.5-2-2.5-2-5"/><path d="M21 16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M22 8c0-2.5-2-2.5-2-5"/><path d="M7 12v4"/></svg>',
      zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>'
    };
    return icons[name] || icons.moon;
  }

  // ── Direction helpers ───────────────────────────────────────────────

  _directionConfig(dir) {
    const map = {
      positive: { icon: 'arrowDown', label: 'Faster sleep onset', color: '#16A34A', bg: 'rgba(34,197,94,0.1)' },
      negative: { icon: 'arrowUp', label: 'Slower sleep onset', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
      mixed: { icon: 'arrowLeftRight', label: 'Mixed', color: '#D97706', bg: 'rgba(251,191,36,0.12)' },
      neutral: { icon: 'minus', label: 'No clear effect', color: '#64748B', bg: 'rgba(148,163,184,0.12)' }
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
        <span class="cat-tab-count">${(this._factors[k] || []).length}</span>
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
      const rank = { positive: 0, mixed: 1, neutral: 2, negative: 3 };
      factors = [...factors].sort((a, b) => (rank[a.direction] ?? 9) - (rank[b.direction] ?? 9));
    }
    const cat = this._categories[this._activeCategory];
    const note = cat.intro ? `<p class="cat-note">${this._icon(cat.icon)}<span>${cat.intro}</span></p>` : '';
    return note + factors.map((f, i) => {
      const dir = this._directionConfig(f.direction);
      const ev = this._evidenceConfig(f.evidence);
      const isExpanded = this._expandedFactor === f.key;
      return `
        <div class="factor-card ${isExpanded ? 'expanded' : ''}" data-factor="${f.key}" id="factor-${f.key}" style="--delay:${i * 60}ms">
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
            <p class="factor-effect">${f.keyFinding}</p>
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
                <p class="detail-value"><a href="${f.source.url}" target="_blank" rel="noopener" class="source-link">${f.source.label} ${this._icon('externalLink')}</a>${f.source2 ? `<br><a href="${f.source2.url}" target="_blank" rel="noopener" class="source-link">${f.source2.label} ${this._icon('externalLink')}</a>` : ''}</p>
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

  // Sources grouped by category, built from the factor data and deduped by
  // URL, so the list can never drift from the cards.
  get _srcGroups() {
    const groups = {};
    const seen = new Set();
    for (const [k, list] of Object.entries(this._factors)) {
      const name = this._categories[k].name;
      for (const f of list) {
        for (const src of [f.source, f.source2]) {
          if (!src || seen.has(src.url)) continue;
          seen.add(src.url);
          (groups[name] = groups[name] || []).push({ label: `${f.name} (${src.label})`, url: src.url });
        }
      }
    }
    return groups;
  }

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
    if (sortBar) sortBar.innerHTML = this._renderSortBar();
  }

  _renderSortBar() {
    const opt = (v, l) => `<option value="${v}"${this._sortMode === v ? ' selected' : ''}>${l}</option>`;
    return `<label class="sort-label" for="sort-select">Sort by:</label>
      <select class="sort-select" id="sort-select">${opt('evidence', 'Evidence Strength')}${opt('direction', 'Effect Direction')}</select>`;
  }

  // ── Action Board ────────────────────────────────────────────────────
  // "Do more / Cut back": factors a reader can change, with strong or
  // moderate evidence and a clear direction, each with its dose and
  // measured result. Rows are condensed from the matching _factors entry;
  // evidence is read from _factors so the two can't disagree. Supplements
  // tested only in patients or in one small trial are left out.

  get _board() {
    return {
      more: [
        { key: 'warm-bath', icon: 'droplet', label: 'Warm bath or shower', dose: '40–42.5°C, 1–2 h before bed, 10+ min', result: 'About 10 min faster' },
        { key: 'stimulus-control', icon: 'bed', label: 'Bed = sleep only', dose: 'Get up if you can\'t sleep; no screens or work in bed', result: 'Large effect vs no treatment' },
        { key: 'cbt-i', icon: 'brain', label: 'CBT-I', dose: 'Therapist, 2–4 session BBTI, or an app', result: '−19 min (20 RCTs)' },
        { key: 'todo-list', icon: 'list', label: 'Write a to-do list', dose: '5 min at bedtime; be specific', result: '15.8 vs 25.1 min' },
        { key: 'regular-exercise', icon: 'activity', label: 'Regular exercise', dose: 'Any regular training', result: 'Shorter sleep onset (66 studies)' },
        { key: 'yoga', icon: 'leaf', label: 'Yoga or Tai Chi', dose: 'A regular practice', result: '−25 to −29 min in insomnia' },
        { key: 'earplugs-mask', icon: 'volumeX', label: 'Earplugs + eye mask', dose: 'In a noisy or bright room', result: '46.6 vs 71.4 min' },
        { key: 'skin-warming', icon: 'thermometer', label: 'Bed socks in a cool room', dose: 'Gently warm skin, not a hot room', result: '3–7.5 min faster' },
        { key: 'high-gi-meal', icon: 'wheat', label: 'High-GI carbs at dinner', dose: 'About 4 h before bed', result: '9.0 vs 17.5 min' },
        { key: 'low-melanopic-screen', icon: 'phone', label: 'Low-melanopic screen light', dose: 'Night mode or dimmer, warmer light', result: 'Shorter latency than standard' },
        { key: 'melatonin', icon: 'pill', label: 'Melatonin', dose: 'Around 4 mg, about 3 h before bed', result: '−7 min (19 RCTs)' },
        { key: 'ashwagandha', icon: 'pill', label: 'Ashwagandha', dose: '600 mg/day or more, 8+ weeks', result: 'SMD −0.53 (3 RCTs)' }
      ],
      less: [
        { key: 'caffeine', icon: 'coffee', label: 'Caffeine', dose: 'Dose and timing didn\'t explain it', result: '+9.1 min (24 studies)' },
        { key: 'energy-drinks', icon: 'zap', label: 'Energy drinks', dose: 'Risk rises from a few a month', result: '~1.8x risk of 2 h+ to sleep' },
        { key: 'nicotine', icon: 'cigarette', label: 'Smoking', dose: 'Former smokers were no different', result: '+5.4 min' },
        { key: 'bright-evening-light', icon: 'sun', label: 'Bright evening light', dose: 'More melanopic light, longer delay', result: 'Dose-response with longer SOL' },
        { key: 'ereader', icon: 'phone', label: 'Hours of tablet reading', dose: '~4 h before bed; 1–2 h was fine', result: '25.7 vs 15.8 min' },
        { key: 'hot-bedroom', icon: 'thermometer', label: 'A hot bedroom', dose: 'Worst on heatwave nights', result: '+11.3 min on heat nights' },
        { key: 'bedroom-noise', icon: 'volume', label: 'Bedroom noise', dose: 'Every extra decibel counts', result: 'Louder room, longer SOL' },
        { key: 'bedroom-co2', icon: 'wind', label: 'Stuffy air (CO2)', dose: 'Ventilate; 800 vs 3,000 ppm', result: 'SOL rose with CO2' },
        { key: 'vigorous-late', icon: 'dumbbell', label: 'Hard workouts right before bed', dose: 'Ending ≤1 h before bed only', result: 'Evening exercise overall is fine' },
        { key: 'cognitive-arousal', icon: 'alert', label: 'Racing thoughts at bedtime', dose: 'Wind down; try a to-do list', result: '37 min longer when high' }
      ]
    };
  }

  _renderBoardCol(kind) {
    const up = kind === 'more';
    const byKey = {};
    Object.entries(this._factors).forEach(([cat, list]) => list.forEach(f => { byKey[f.key] = { ...f, cat }; }));
    const rows = this._board[kind].filter(r => byKey[r.key]);
    const visible = 6;
    const items = rows.map((r, i) => {
      const f = byKey[r.key];
      const ev = this._evidenceConfig(f.evidence);
      return `
        <li class="ab-item${i >= visible ? ' ab-extra' : ''}">
          <button type="button" class="ab-row" data-jump="${f.key}" data-cat="${f.cat}" aria-label="${f.name}: ${r.result}. Open details">
            <span class="ab-ico">${this._icon(r.icon)}</span>
            <span class="ab-main">
              <span class="ab-name">${r.label}</span>
              <span class="ab-dose">${r.dose}</span>
            </span>
            <span class="ab-side">
              <span class="ab-result">${r.result}</span>
              <span class="ab-ev" title="${ev.label} evidence"><span class="ab-bars" data-lvl="${{ strong: 3, moderate: 2, emerging: 1 }[f.evidence] || 1}" aria-hidden="true"><i></i><i></i><i></i></span>${ev.label} evidence</span>
            </span>
          </button>
        </li>`;
    }).join('');
    const more = rows.length > visible
      ? `<button type="button" class="ab-toggle" data-ab-more aria-expanded="false"><span class="ab-toggle-lbl">Show all ${rows.length}</span>${this._icon('chevDown')}</button>`
      : '';
    return `
      <div class="ab-col ab-col-${kind}">
        <div class="ab-head">
          <span class="ab-head-ico">${this._icon(up ? 'arrowUp' : 'arrowDown')}</span>
          <div>
            <h3 class="ab-title">${up ? 'Do more' : 'Cut back'}</h3>
            <p class="ab-sub">${rows.length} ${up ? 'habits and aids that speed sleep onset' : 'things that keep you lying awake'}</p>
          </div>
        </div>
        <ul class="ab-list">${items}</ul>
        ${more}
      </div>`;
  }

  _jumpToFactor(key, cat) {
    if (!this._factors[cat]) return;
    this._activeCategory = cat;
    this._updateCategory();
    this._toggleFactor(key);
    const card = this.shadowRoot.getElementById(`factor-${key}`);
    if (!card) return;
    card.classList.add('visible', 'flash');
    setTimeout(() => card.classList.remove('flash'), 1600);
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    const hdr = card.querySelector('.factor-header');
    if (hdr) hdr.focus({ preventScroll: true });
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

  // The three posts this page links to. The only per-page part of the module.
  // Card copy is defined once per post and reused wherever that post is linked,
  // so it cannot drift between tools. Titles, excerpts and cover images come
  // from the Wix Blog collection - see docs/blog-cross-links.md.
  _relatedPosts() {
    return [
      { slug: 'how-to-fall-asleep-faster-factors-ranked-by-evidence',
        title: 'How to Fall Asleep Faster: 33 Factors Ranked by Evidence (2026)',
        blurb: 'Thirty-three factors that change sleep latency, from caffeine and melatonin to warm baths and bedroom temperature, each graded.',
        cat: 'Sleep', min: 10, img: '273a63_301e6ab1c01a477aad452b8ae4373b98~mv2.png' },
      { slug: 'caffeine-sleep-correlation-personal-cutoff-time',
        title: 'Caffeine and Sleep: Finding Your Personal Cutoff Time',
        blurb: 'The standard advice is to stop by 2 PM. The research says your personal cutoff can sit hours either side of that rule.',
        cat: 'Sleep', min: 11, img: '273a63_ce85cf859543430dbf4604fed94bedbe~mv2.png' },
      { slug: 'how-to-stay-asleep-factors-ranked-by-evidence',
        title: 'How to Stay Asleep All Night: 31 Factors Ranked by Evidence (2026)',
        blurb: 'Forty-plus studies ranked by what actually moves WASO. Some confirm what you expect; immediate-release melatonin does not.',
        cat: 'Sleep', min: 8, img: '273a63_1b328da6e96d4110a7de9403036dfac5~mv2.png' }
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
      slug: 'sleep-latency-factors',
      hook: `Find out what is adding minutes to how long you lie awake.`,
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
    __ensureKygoCta();
    const c = this._appCta();
    const badges = [
      ['273a63_56ac2eb53faf43fab1903643b29c0bce', 'Oura Ring', 'Oura'],
      ['273a63_1a1ba0e735ea4d4d865c04f7c9540e69', 'Apple Health', 'Apple'],
      ['273a63_c451e954ff8740338204915f904d8798', 'Fitbit', 'Fitbit'],
      ['273a63_0a60d1d6c15b421e9f0eca5c4c9e592b', 'Garmin', 'Garmin'],
      ['273a63_874a026381ad469698b84e11a2736609', 'WHOOP', 'WHOOP', '#000'],
      ['273a63_e7e3c05ed0bc4cec8f456cd7f995e70b', 'Polar', 'Polar'],
      ['273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e', 'Google Health', 'Google'],
      ['273a63_0c0e48cc065d4ee3bf506f6d47440518', 'Health Connect', 'Health']
    ].map(([id, name, label, bg]) => `<span class="kc-chip"><span class="kc-chip-tile"${bg ? ` style="background:${bg}"` : ''}><img src="https://static.wixstatic.com/media/${id}~mv2.png" alt="${name}" title="${name}" loading="lazy" /></span><span class="kc-chip-label">${label}</span></span>`).join('');
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
      @media(max-width:449px){.kc-badges{gap:4px}.kc-chip-tile{width:36px;height:36px}.kc-chip-label{font-size:9.5px}}
      @media(max-width:403px){.kc-badges{gap:3px}.kc-chip-tile{width:30px;height:30px}.kc-chip-label{font-size:8px}}
      @media(max-width:360px){.kc-badges{gap:2px}.kc-chip-tile{width:28px;height:28px}.kc-chip-label{font-size:7.5px}}
      @media(max-width:340px){.kc-badges{gap:2px}.kc-chip-tile{width:26px;height:26px}.kc-chip-label{font-size:7px}}
      </style>
      <section class="kc-section${bg === 'gray' ? ' kc-gray' : ''}" id="get-the-app">
        <div class="kc-inner">
          <div class="kc-card animate-on-scroll">
            <div class="kc-pill"><span class="kc-dot"></span> Free 7-Day Trial</div>
            <h3 class="kc-h">${c.headline}</h3>
            <p class="kc-p">${c.sub}</p>
            <kygo-cta theme="dark" slug="${c.slug}" surface="tool" hook="${c.hook}"
              note="Free plan available on web or in the app. Save 58% on yearly. Cancel anytime."></kygo-cta>
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
            Sleep Latency
          </a>
          <div class="nav-cta-group">
            <kygo-cta mini slug="${this._appCta().slug}-subnav" surface="tool"></kygo-cta>
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
                  <span class="hv-cap">Average of 24 studies</span>
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

      <!-- Action board: Do more / Cut back -->
      <section class="board-section" id="action-board">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Do More / Cut Back</h2>
          <p class="section-sub animate-on-scroll">The changes with real evidence behind them, with the dose that was tested and what it did. Tap any row for the full study details.</p>
          <div class="ab-grid">${this._renderBoardCol('more')}${this._renderBoardCol('less')}</div>
          <p class="ab-foot">Only factors you can change, with strong or moderate evidence and a clear direction. Supplements tested only in patients or in one small trial are left out; they stay in the full list below.</p>
        </div>
      </section>
      ${this._renderAppCta('gray')}

      <!-- Primary Interactive: Category tabs + Factor cards -->
      <section class="explore-section" id="explore">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Explore All Factors</h2>
          <p class="section-sub animate-on-scroll">Tap any factor to see mechanism, dosage, and source.</p>

          <div class="cat-tabs animate-on-scroll" role="tablist">${this._renderCategoryTabs()}</div>
          <div class="sort-bar animate-on-scroll">${this._renderSortBar()}</div>
          <div class="factor-cards">${this._renderFactorCards()}</div>
        </div>
      </section>
      ${this._renderEmailCta()}

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
          <p class="footer-copyright">Data sourced from peer-reviewed studies and meta-analyses. Last updated October 2026.</p>
          <p class="footer-copyright">© ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>

      ${this._renderRelatedPosts()}
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

      /* Action board · Do more / Cut back */
      .board-section { padding: 48px 0; background: #fff; }
      .ab-grid { display: grid; grid-template-columns: 1fr; gap: 16px; align-items: start; }
      .ab-col { background: #fff; border: 1px solid #D4D4D8; border-radius: var(--radius); box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.05); overflow: hidden; }
      .ab-head { display: flex; align-items: center; gap: 12px; padding: 18px 20px; border-bottom: 1px solid var(--gray-200); }
      .ab-head-ico { width: 36px; height: 36px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex: none; color: #fff; }
      .ab-head-ico svg { width: 18px; height: 18px; }
      .ab-col-more .ab-head { background: #F0FDF4; border-bottom-color: #DCFCE7; }
      .ab-col-less .ab-head { background: #FEF2F2; border-bottom-color: #FEE2E2; }
      .ab-col-more .ab-head-ico { background: var(--green); }
      .ab-col-less .ab-head-ico { background: var(--red); }
      .ab-title { font-size: 19px; color: var(--dark); line-height: 1.2; }
      .ab-sub { font-size: 13px; color: var(--gray-600); margin-top: 2px; }
      .ab-list { list-style: none; padding: 4px 12px; }
      .ab-item + .ab-item { border-top: 1px solid var(--gray-100); }
      .ab-extra { display: none; }
      .ab-col.open .ab-extra { display: block; }
      .ab-row { width: 100%; display: grid; grid-template-columns: 40px 1fr; column-gap: 14px; align-items: start; padding: 14px 8px; background: none; border: 0; border-radius: 12px; text-align: left; font-family: inherit; color: inherit; cursor: pointer; transition: background 0.15s; }
      .ab-row:hover { background: var(--gray-50); }
      .ab-row:focus-visible, .ab-toggle:focus-visible, .factor-header:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; }
      .ab-ico { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: var(--gray-50); border: 1px solid var(--gray-200); grid-row: span 2; }
      .ab-ico svg { width: 19px; height: 19px; }
      .ab-col-more .ab-ico { color: var(--green-dark); }
      .ab-col-less .ab-ico { color: var(--red); }
      .ab-main { display: flex; flex-direction: column; min-width: 0; }
      .ab-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); line-height: 1.3; }
      .ab-dose { font-size: 13px; color: var(--gray-600); line-height: 1.45; }
      .ab-side { grid-column: 2; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; margin-top: 6px; }
      .ab-result { font-size: 12.5px; font-weight: 600; color: var(--dark); line-height: 1.35; }
      .ab-ev { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 500; color: var(--gray-400); white-space: nowrap; }
      .ab-bars { display: inline-flex; align-items: flex-end; gap: 2px; height: 11px; }
      .ab-bars i { width: 3px; border-radius: 1px; background: var(--gray-200); }
      .ab-bars i:nth-child(1) { height: 5px; }
      .ab-bars i:nth-child(2) { height: 8px; }
      .ab-bars i:nth-child(3) { height: 11px; }
      .ab-bars[data-lvl="1"] i:nth-child(-n+1), .ab-bars[data-lvl="2"] i:nth-child(-n+2), .ab-bars[data-lvl="3"] i { background: var(--gray-600); }
      @media (max-width: 599px) { .ab-side { flex-direction: column; align-items: flex-start; gap: 3px; } }
      .ab-toggle { width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; min-height: 48px; border: 0; border-top: 1px solid var(--gray-100); background: #fff; font: inherit; font-size: 14px; font-weight: 600; color: var(--gray-600); cursor: pointer; }
      .ab-toggle:hover { color: var(--dark); background: var(--gray-50); }
      .ab-toggle svg { width: 16px; height: 16px; transition: transform .2s; }
      .ab-col.open .ab-toggle svg { transform: rotate(180deg); }
      .ab-foot { margin-top: 14px; font-size: 12.5px; color: var(--gray-400); text-align: center; max-width: 640px; margin-left: auto; margin-right: auto; }
      @media (min-width: 900px) {
        .board-section { padding: 64px 0; }
        .ab-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
        .ab-head { padding: 20px 24px; }
        .ab-list { padding: 0 16px 4px; }
      }
      @media (min-width: 1024px) { .board-section { padding: 80px 0; } }
      .cat-note { grid-column: 1 / -1; display: flex; gap: 10px; align-items: flex-start; padding: 14px 16px; border-radius: 14px; background: var(--green-light); border: 1px solid rgba(34,197,94,0.3); font-size: 14px; line-height: 1.55; color: var(--gray-600); }
      .cat-note svg { width: 18px; height: 18px; flex: none; margin-top: 2px; color: var(--green-dark); }
      .factor-card { scroll-margin-top: 84px; }
      .factor-card.flash { border-color: var(--green); box-shadow: 0 0 0 3px rgba(34,197,94,0.25), var(--shadow-hover); }
      .explore-section { padding: 48px 0 64px; }

      /* Sort bar */
      .sort-bar { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 20px; }
      .sort-label { font-size: 12px; font-weight: 600; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.3px; }
      .sort-select { padding: 6px 28px 6px 12px; border-radius: 50px; border: 1px solid var(--gray-200); background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center; -webkit-appearance: none; appearance: none; font-size: 13px; font-weight: 500; color: var(--gray-600); cursor: pointer; font-family: inherit; transition: border-color 0.2s; }
      .sort-select:hover, .sort-select:focus { border-color: var(--green); outline: none; }

      /* Category tabs */
      .cat-tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 16px; }
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
      .factor-card.expanded .factor-body { max-height: 1400px; padding: 0 20px 20px; }
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
      .sources-section { padding: 48px 0; background: #fff; }
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

      .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
      @keyframes pulse { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }

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

      // Action board: jump to a factor card, or expand a column
      const jump = e.target.closest('[data-jump]');
      if (jump) { this._jumpToFactor(jump.dataset.jump, jump.dataset.cat); return; }
      const abMore = e.target.closest('[data-ab-more]');
      if (abMore) {
        const col = abMore.closest('.ab-col');
        const open = !col.classList.contains('open');
        col.classList.toggle('open', open);
        abMore.setAttribute('aria-expanded', open ? 'true' : 'false');
        const lbl = abMore.querySelector('.ab-toggle-lbl');
        if (lbl) lbl.textContent = open ? 'Show fewer' : `Show all ${col.querySelectorAll('.ab-item').length}`;
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
      'description': 'Explore 57 research-backed factors that affect sleep onset latency, across environment, therapies, nutrition, supplements, exercise and physiology, ranked by evidence strength, with a Do More / Cut Back action board.',
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'url': 'https://www.kygo.app/tools/sleep-latency-factors',
      'datePublished': '2026-04-09',
      'dateModified': '2026-10-15',
      'softwareVersion': '1.0',
      'inLanguage': 'en',
      'isAccessibleForFree': true,
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
      'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
      'featureList': '57 sleep latency factors in 6 categories, Do More / Cut Back action board, evidence-strength sorting, tested doses and measured minutes, peer-reviewed citations',
      'keywords': 'sleep latency factors, how to fall asleep faster, sleep onset latency, sleep onset insomnia, best supplements for sleep, melatonin dose, warm bath before bed, caffeine and sleep, CBT-I, stimulus control, to-do list before bed, sleep hygiene, chronotype, bedroom temperature for sleep, valerian, magnesium for sleep'
    };

    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': "What's the fastest way to fall asleep?",
          'acceptedAnswer': { '@type': 'Answer', 'text': 'A warm bath or shower at 40 to 42.5°C for as little as 10 minutes, 1 to 2 hours before bed, cut time to fall asleep by about 10 minutes across pooled studies (Haghayegh 2019). Writing a specific to-do list for 5 minutes at bedtime helped people fall asleep in 15.8 vs 25.1 minutes on a lab sleep study (Scullin 2017). For regular trouble falling asleep, CBT-I cut it by about 19 minutes across 20 RCTs (Trauer 2015).' }
        },
        {
          '@type': 'Question',
          'name': 'Do supplements actually help you fall asleep faster?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'A few do, modestly. Melatonin shortens sleep onset by about 7 minutes across 19 RCTs (Ferracioli-Oda 2013), with the effect peaking around 4 mg taken about 3 hours before bed (Cruz-Sanabria 2024). Ashwagandha shortened sleep onset in 3 RCTs, most clearly in insomnia (Cheah 2021). Valerian, omega-3, probiotics and CBD isolate showed no effect, and L-theanine felt faster but was not faster on trackers.' }
        },
        {
          '@type': 'Question',
          'name': 'How much does caffeine delay sleep?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'About 9 minutes on average. A 2023 meta-analysis of 24 studies (Gardiner) found caffeine added 9.1 minutes to sleep onset, and the effect was not explained by the final dose or how close to bed it was taken.' }
        },
        {
          '@type': 'Question',
          'name': 'Does exercise help you fall asleep faster?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes. A 66-study meta-analysis found regular exercise shortens sleep onset (Kredlow 2015), and in people with insomnia yoga and Tai Chi cut diary sleep onset by about 25 to 29 minutes (low certainty, Bu 2026). Evening exercise is fine for most people; only very hard sessions ending within an hour of bed may delay sleep (Stutz 2019).' }
        },
        {
          '@type': 'Question',
          'name': 'Does alcohol help you fall asleep?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Only at heavy doses. In a 27-study meta-analysis, alcohol shortened sleep onset significantly only at about 0.85 g/kg (about 5 drinks) or more, while REM sleep was disrupted from low doses (Gardiner 2025).' }
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
      __kygoAppendLdOnce(script);
    });
  }
}

if (!customElements.get('kygo-sleep-latency-factors')) {
  customElements.define('kygo-sleep-latency-factors', KygoSleepLatencyFactors);
}
