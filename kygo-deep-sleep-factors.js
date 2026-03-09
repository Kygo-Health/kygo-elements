/**
 * Kygo Health — Deep Sleep Factor Explorer
 * Tag: kygo-deep-sleep-factors
 * Interactive tool exploring 38 research-backed factors that affect Deep Sleep (N3/SWS) across 5 categories
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

class KygoDeepSleepFactors extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._activeCategory = 'lifestyle';
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
    __seo(this, 'Deep Sleep Factor Explorer by Kygo Health. Explore 38 research-backed factors that affect Deep Sleep N3 slow-wave sleep across 5 categories: Lifestyle and Behavior, Supplements and Micronutrients, Environment and Circadian, Stress and Mental Health, and Biology and Demographics. Lifestyle factors include Aerobic Exercise with 33 percent increase in SWS from moderate cardio, Exercise SWS Quality with increased delta power, Alcohol with mixed net negative effects front-loading then disrupting SWS, Caffeine 400mg reducing N3 by 29.7 minutes at 4 hours pre-bed, Fiber Intake predicting more SWS, High-Carb High-GI reducing sleep onset but not increasing SWS, Smoking and Nicotine reducing N3 by 32.3 minutes, Cannabis THC with net negative chronic effects on delta power, Dehydration reducing SWS by 24 minutes, Napping late afternoon reducing nighttime N3, and Sleep Consistency increasing SWS significantly. Supplements include Magnesium increasing SWS by 6.4 minutes in elderly, Glycine shortening latency to SWS, L-Theanine boosting delta waves, Ashwagandha increasing delta band power, Tart Cherry increasing total sleep time by 84 minutes, Passionflower increasing TST by 23 minutes, Melatonin promoting NREM via MT2 receptors, Omega-3 DHA improving sleep efficiency, and Vitamin D with inconclusive N3 evidence. Environment factors include Body Cooling adding 7.5 minutes N3, Ambient Temperature optimal 18-22C, Blue Light reducing frontal slow-wave activity, Aircraft Noise reducing N3 by 23 minutes, Closed-Loop Audio enhancing slow oscillations, Altitude reducing SWA by 15 percent at 2590m, and Bedroom CO2 linearly reducing SWS. Stress factors include Cortisol HPA Axis bidirectional relationship with SWS, Depression MDD with markedly decreased N3, Anxiety Disorders reducing deep SWS percentage, and Vipassana Meditation preserving SWS with meditators showing 10.63 percent vs 3.94 percent at age 50-60. Biology factors include Age with SWS declining from 18.9 to 3.4 percent, Sex with women maintaining more SWS, PER2 Gene variant reducing SWS by 22 percent, BMI Obesity inversely correlated with SWA, Neurodegeneration with bidirectional amyloid-beta relationship, and Gut Microbiome diversity correlating with sleep efficiency. How to increase deep sleep naturally. What affects deep sleep. Best supplements for deep sleep. How to get more slow wave sleep. What kills deep sleep. Data sourced from peer-reviewed studies and meta-analyses published through 2026.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Categories ────────────────────────────────────────────────────────

  get _categories() {
    return {
      lifestyle: { name: 'Lifestyle & Behavior', icon: 'sun', count: 11 },
      supplements: { name: 'Supplements & Micronutrients', icon: 'pill', count: 9 },
      environment: { name: 'Environment & Circadian', icon: 'moon', count: 7 },
      stress: { name: 'Stress & Mental Health', icon: 'brain', count: 4 },
      biology: { name: 'Biology & Demographics', icon: 'users', count: 7 }
    };
  }

  // ── Factors ───────────────────────────────────────────────────────────

  get _factors() {
    return {
      lifestyle: [
        {
          key: 'aerobic-exercise',
          name: 'Aerobic Exercise',
          direction: 'positive',
          evidence: 'strong',
          effect: 'Positive (strong)',
          keyFinding: '33% SWS increase, meta-analysis',
          whatThisMeans: 'Consistent moderate cardio is one of the most reliable ways to increase deep sleep. You don\'t need to go all-out — 3-4 sessions per week at moderate effort works.',
          mechanism: 'Moderate aerobic exercise increases homeostatic sleep pressure (adenosine accumulation) and enhances thermoregulatory processes that promote SWS entry.',
          dosage: 'Moderate intensity (40% VO2max), 3-4x/week, 8-12 weeks for sustained effect',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/31095458/', label: 'Aritake-Okada 2019' }
        },
        {
          key: 'exercise-quality',
          name: 'Exercise (SWS Quality)',
          direction: 'positive',
          evidence: 'moderate',
          effect: 'Positive (delta power)',
          keyFinding: 'Increased delta power & SWS stability',
          whatThisMeans: 'Exercise improves deep sleep quality in ways you might not feel subjectively but that show up clearly on EEG. Even when you don\'t "feel" like you slept better, the data says you did.',
          mechanism: 'Physical activity increases slow-wave activity (delta power) and stabilizes SWS architecture in early sleep cycles via enhanced adenosine signaling.',
          dosage: 'Regular moderate exercise; effects strongest in early sleep cycles',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7904822/', label: 'Nature Sci Reports 2021' }
        },
        {
          key: 'alcohol',
          name: 'Alcohol',
          direction: 'mixed',
          evidence: 'strong',
          effect: 'Mixed (net negative)',
          keyFinding: 'Redistributes SWS; net negative (meta-analysis)',
          whatThisMeans: 'Alcohol front-loads your deep sleep but then wrecks the second half of the night. Total deep sleep doesn\'t actually increase — it just gets redistributed and disrupted.',
          mechanism: 'Ethanol enhances GABAergic inhibition acutely (promoting early SWS) but causes sympathetic rebound and sleep fragmentation as it metabolizes.',
          dosage: '≥0.85 g/kg = significant disruption; any dose affects second-half sleep',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3987855/', label: 'Chan et al. 2013' }
        },
        {
          key: 'caffeine',
          name: 'Caffeine',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative (strong)',
          keyFinding: '−29.7 min N3 at 400mg/4h pre-bed',
          whatThisMeans: '400mg of caffeine (about 2 large coffees) reduces deep sleep by 30 minutes even when consumed 4 hours before bed. The effect persists even at 12 hours out for high doses.',
          mechanism: 'Adenosine A1 and A2A receptor antagonism directly blocks homeostatic sleep pressure that drives SWS. Half-life of 5-6 hours means late doses interfere with bedtime delta power.',
          dosage: '400mg at 4h: −30 min N3; at 12h: −21 min; 100mg at 12h: no effect',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/39377163/', label: 'SLEEP 2025' }
        },
        {
          key: 'fiber-intake',
          name: 'Fiber Intake',
          direction: 'positive',
          evidence: 'moderate',
          effect: 'Positive',
          keyFinding: 'More fiber → more SWS (p=0.029)',
          whatThisMeans: 'More fiber in your diet = more deep sleep. More saturated fat = less. Simple dietary composition matters for sleep architecture.',
          mechanism: 'Fiber promotes stable glycemic control and feeds gut microbiota that produce short-chain fatty acids influencing central serotonin/melatonin pathways.',
          dosage: 'Higher dietary fiber; lower saturated fat intake',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4702189/', label: 'St-Onge et al. 2016' }
        },
        {
          key: 'high-carb',
          name: 'High-Carb / High-GI',
          direction: 'mixed',
          evidence: 'moderate',
          effect: 'Mixed',
          keyFinding: 'Faster sleep onset but less SWS',
          whatThisMeans: 'High-carb meals help you fall asleep faster but don\'t actually give you more deep sleep. They may even reduce it while increasing REM.',
          mechanism: 'High-GI foods increase tryptophan uptake (reducing sleep latency) but insulin-mediated shifts in amino acid ratios may alter neurotransmitter balance away from SWS promotion.',
          dosage: 'Effect is meal-dependent; timing matters more than total intake',
          source: { url: 'https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2022.933898/full', label: 'Frontiers Nutrition 2022' }
        },
        {
          key: 'smoking',
          name: 'Smoking / Nicotine',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative',
          keyFinding: 'NRT: −32.3 min N3 vs non-smokers',
          whatThisMeans: 'Nicotine directly suppresses deep sleep. NRT patches are even worse than smoking for N3 (probably sustained nicotine delivery). Quitting restores it.',
          mechanism: 'Nicotinic acetylcholine receptor activation promotes cortical arousal and suppresses thalamocortical slow oscillations that generate delta waves.',
          dosage: 'Any nicotine exposure; NRT patches worst due to sustained delivery',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/41197178/', label: 'Tab-OSA Study 2025' }
        },
        {
          key: 'cannabis',
          name: 'Cannabis / THC',
          direction: 'mixed',
          evidence: 'moderate',
          effect: 'Mixed (net negative chronic)',
          keyFinding: 'Meta: chronic use reduces SWS & TST',
          whatThisMeans: 'Acute cannabis use may briefly help sleep, but regular use reduces deep sleep. An EEG study also shows it makes the deep sleep you do get shallower. Similar to alcohol — short-term gain, long-term loss.',
          mechanism: 'CB1 receptor activation acutely enhances GABAergic tone but chronic use downregulates receptors, reducing endocannabinoid-mediated SWS promotion and delta power.',
          dosage: 'Near-daily use associated with reduced SWS; acute low-dose may briefly increase it',
          source: { url: 'https://www.sciencedirect.com/science/article/pii/S1087079225001170', label: 'Cannabis Meta-Analysis 2025' }
        },
        {
          key: 'dehydration',
          name: 'Dehydration',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative',
          keyFinding: '−24 min SWS post-exercise (p=0.028)',
          whatThisMeans: 'Being dehydrated after exercise costs you roughly 24 minutes of deep sleep. Hydrating properly preserves recovery sleep.',
          mechanism: 'Hypovolemia triggers compensatory sympathetic activation that opposes the parasympathetic dominance required for SWS entry and maintenance.',
          dosage: 'Replace fluids after exercise; euhydration preserves SWS',
          source: { url: 'https://journals.physiology.org/doi/abs/10.1152/physiol.2024.39.S1.1321', label: 'Physiology 2024' }
        },
        {
          key: 'napping',
          name: 'Napping (Late Afternoon)',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative (on nighttime N3)',
          keyFinding: 'Sleep onset +27 min; SWA reduced',
          whatThisMeans: 'Late afternoon/evening naps "spend" your deep sleep pressure before nighttime. Your body can\'t rebuild enough sleep drive between the nap and bedtime, so you get less deep sleep that night.',
          mechanism: 'Napping dissipates accumulated homeostatic sleep pressure (Process S). Insufficient time to rebuild adenosine reduces SWA in first nocturnal NREM cycle.',
          dosage: 'Avoid naps after ~2 PM if nighttime deep sleep is a priority',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2824213/', label: 'PMC — SWS Regulation' }
        },
        {
          key: 'sleep-consistency',
          name: 'Sleep Consistency',
          direction: 'positive',
          evidence: 'strong',
          effect: 'Positive',
          keyFinding: 'Consistency → significantly more SWS (n=38,838)',
          whatThisMeans: 'Going to bed and waking up at the same time reliably increases deep sleep. One of the most underappreciated and controllable factors — and irregular sleep patterns are independently linked to mortality risk.',
          mechanism: 'Consistent sleep timing strengthens circadian entrainment of the suprachiasmatic nucleus, optimizing the alignment between homeostatic sleep pressure and circadian SWS promotion windows.',
          dosage: 'Consistent bed/wake times; minimize weekend shift',
          source: { url: 'https://www.whoop.com/us/en/press-center/whoop-study-published-in-sleep-finds/', label: 'WHOOP/SLEEP Study' }
        }
      ],

      supplements: [
        {
          key: 'magnesium',
          name: 'Magnesium',
          direction: 'positive',
          evidence: 'emerging',
          effect: 'Positive (elderly, small)',
          keyFinding: '+6.4 min SWS, n=12 elderly',
          whatThisMeans: 'Magnesium did increase deep sleep in elderly subjects, but only by ~6 minutes in one small study. Most of the hype around magnesium for deep sleep outpaces the actual evidence.',
          mechanism: 'Mg²⁺ acts as a natural NMDA receptor antagonist and voltage-gated calcium channel modulator, enhancing thalamocortical delta oscillations. Also reduces nocturnal cortisol.',
          dosage: '30 mmol/day oral Mg²⁺; 20-day supplementation period',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/12163983/', label: 'Held et al. 2002' },
          affiliate: { url: 'https://amzn.to/3Nbjq6C', label: 'Magnesium Glycinate' }
        },
        {
          key: 'glycine',
          name: 'Glycine',
          direction: 'positive',
          evidence: 'moderate',
          effect: 'Positive (latency)',
          keyFinding: 'SWS latency shortened (p=0.019)',
          whatThisMeans: 'Glycine helps you get into deep sleep faster without changing how much you get. Interesting mechanism but limited data.',
          mechanism: 'Glycine acts on NMDA receptors in the suprachiasmatic nucleus, lowering core body temperature. Also acts as an inhibitory neurotransmitter facilitating NREM entry.',
          dosage: '3g before bed',
          source: { url: 'https://onlinelibrary.wiley.com/doi/10.1111/j.1479-8425.2007.00262.x', label: 'Yamadera et al. 2007' },
          affiliate: { url: 'https://amzn.to/3OyDz7c', label: 'Glycine Powder' }
        },
        {
          key: 'l-theanine',
          name: 'L-Theanine',
          direction: 'positive',
          evidence: 'moderate',
          effect: 'Positive (delta power)',
          keyFinding: 'Boosted delta waves; reversed caffeine suppression',
          whatThisMeans: 'L-theanine (especially with magnesium) enhanced delta wave activity, but most studies use combination formulas so it\'s hard to isolate L-theanine\'s effect on N3.',
          mechanism: 'Crosses blood-brain barrier, increases alpha waves and GABA release, reduces cortisol and sympathetic activation. May directly enhance delta-generating thalamocortical circuits.',
          dosage: '200 mg daily, often combined with magnesium',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9017334/', label: 'PMC 2022' },
          affiliate: { url: 'https://amzn.to/3OEoHEh', label: 'L-Theanine 200mg' }
        },
        {
          key: 'ashwagandha',
          name: 'Ashwagandha',
          direction: 'positive',
          evidence: 'moderate',
          effect: 'Positive (delta power)',
          keyFinding: 'Delta power increase (p<0.001)',
          whatThisMeans: 'Ashwagandha boosted delta brain waves in lab studies. The GABA mechanism makes sense but human polysomnography data specifically measuring N3 duration is limited.',
          mechanism: 'Withanolides enhance GABAAρ1 receptor expression (1.38-1.94 fold), increasing GABAergic inhibition that promotes thalamocortical slow oscillations.',
          dosage: '300-600 mg standardized extract daily',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9007714/', label: 'PMC 2022' },
          affiliate: { url: 'https://amzn.to/403ZgOP', label: 'Ashwagandha Extract' }
        },
        {
          key: 'tart-cherry',
          name: 'Tart Cherry',
          direction: 'positive',
          evidence: 'moderate',
          effect: 'Positive (TST)',
          keyFinding: '+84 min TST (p=0.018), n=8',
          whatThisMeans: 'Tart cherry juice added a dramatic 84 minutes of total sleep in a small pilot. The tryptophan pathway mechanism is solid but the sample size is very small (8 completers).',
          mechanism: 'Proanthocyanidins inhibit indoleamine 2,3-dioxygenase, reducing tryptophan degradation via kynurenine pathway. More tryptophan available for serotonin → melatonin conversion.',
          dosage: '240 mL Montmorency tart cherry juice 2x/day',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5617749/', label: 'Losso et al. 2018' },
          affiliate: { url: 'https://amzn.to/406okEX', label: 'Tart Cherry Juice' }
        },
        {
          key: 'passionflower',
          name: 'Passionflower',
          direction: 'positive',
          evidence: 'moderate',
          effect: 'Positive (TST)',
          keyFinding: '+23 min TST (p=0.049), n=110',
          whatThisMeans: 'Passionflower added about 23 minutes of total sleep in the largest supplement RCT on this list. Effect on deep sleep specifically was not isolated.',
          mechanism: 'Chrysin and other flavonoids bind GABAA receptors, promoting anxiolysis and sleep. MAOI activity may also increase serotonin availability for melatonin synthesis.',
          dosage: 'Standardized extract; dose varies by product',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11026993/', label: 'PMC 2024 RCT' },
          affiliate: { url: 'https://amzn.to/40AsqFp', label: 'Passionflower Extract' }
        },
        {
          key: 'melatonin',
          name: 'Melatonin',
          direction: 'positive',
          evidence: 'moderate',
          effect: 'Positive (via MT2 receptors)',
          keyFinding: 'MT2 activation → +31% NREM, +33% delta',
          whatThisMeans: 'Melatonin mainly helps you fall asleep at the right time. It does appear to increase delta power through MT2 receptors, but its primary value is circadian regulation — not directly boosting deep sleep duration.',
          mechanism: 'Selective MT2 receptor activation in the reticular thalamic nucleus promotes NREM sleep and enhances delta power. MT1 receptors primarily regulate REM.',
          dosage: '0.5-3 mg, 30-60 min before bed; timing > dose',
          source: { url: 'https://onlinelibrary.wiley.com/doi/10.1111/jpi.13011', label: 'Comai et al. 2024' }
        },
        {
          key: 'omega-3',
          name: 'Omega-3 (DHA)',
          direction: 'positive',
          evidence: 'moderate',
          effect: 'Positive (efficiency)',
          keyFinding: 'Sleep efficiency +1.88pp (meta)',
          whatThisMeans: 'DHA improved overall sleep efficiency but the research doesn\'t isolate a specific N3/SWS effect. Benefits are likely indirect through inflammation reduction.',
          mechanism: 'DHA incorporates into neuronal membranes, altering ion channel kinetics. Anti-inflammatory effects via resolvin/protectin pathways reduce autonomic disruption during sleep.',
          dosage: 'DHA-rich oil; 26-week supplementation in studies',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11579846/', label: 'PMC 2024' },
          affiliate: { url: 'https://amzn.to/4cVnvGt', label: 'Omega-3 Fish Oil' }
        },
        {
          key: 'vitamin-d',
          name: 'Vitamin D',
          direction: 'variable',
          evidence: 'emerging',
          effect: 'Inconclusive for N3',
          keyFinding: 'RCT n=189: no sleep improvement',
          whatThisMeans: 'Being deficient in vitamin D is associated with worse sleep, but supplementing it doesn\'t clearly improve deep sleep based on current evidence.',
          mechanism: 'VDR expression on hypothalamic neurons suggests a role in sleep regulation, but interventional data shows no direct effect on sleep architecture in non-deficient populations.',
          dosage: 'Correct deficiency; target 30-50 ng/mL',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8912284/', label: 'PMC 2022' }
        }
      ],

      environment: [
        {
          key: 'body-cooling',
          name: 'Body Cooling',
          direction: 'positive',
          evidence: 'strong',
          effect: 'Positive (strong)',
          keyFinding: '+7.5 min N3 (p=0.004), n=72',
          whatThisMeans: 'Cooling your body (not just your room) reliably increases deep sleep. The research points to heat dissipation as the mechanism, not just feeling cold.',
          mechanism: 'Increasing the core-to-skin temperature gradient via conductive cooling promotes hypothalamic thermoregulatory signaling that gates SWS entry and maintenance.',
          dosage: 'High-heat-capacity cooling mattress; effect driven by core-to-skin gradient',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/38409133/', label: 'Herberger et al. 2024' },
          affiliate: { url: 'https://amzn.to/4aYRATe', label: 'Cooling Mattress Pad' }
        },
        {
          key: 'ambient-temp',
          name: 'Ambient Temperature',
          direction: 'variable',
          evidence: 'strong',
          effect: 'Optimal range',
          keyFinding: '18-22°C optimal; >25°C reduces N3',
          whatThisMeans: 'Keep your bedroom between 64-72°F. Going above 77°F starts cutting into deep sleep, particularly as you age.',
          mechanism: 'Thermoneutral zone supports the natural core body temperature drop required for SWS. Heat exposure above 25°C triggers thermoregulatory arousal responses.',
          dosage: '18-22°C (64-72°F); older adults more sensitive to heat',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6491874/', label: 'PMC Review 2023' }
        },
        {
          key: 'blue-light',
          name: 'Blue Light (Evening)',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative (frontal SWA)',
          keyFinding: '6500K light reduced frontal SWA in cycle 1',
          whatThisMeans: 'Evening screen use reduces deep sleep in the early part of the night. The individual study effects are real but the meta-analysis says the overall evidence is moderate, not overwhelming.',
          mechanism: 'Blue-enriched light (6500K) suppresses melatonin via melanopsin-expressing ipRGCs and delays circadian phase, reducing frontal slow-wave activity in the first sleep cycle.',
          dosage: 'Avoid 6500K+ light 90 min before bed; blue-light filters help',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/23509952/', label: 'Chellappa et al. 2013' }
        },
        {
          key: 'aircraft-noise',
          name: 'Aircraft Noise',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative (strong)',
          keyFinding: '−23 min N3/night; earplugs prevent it',
          whatThisMeans: 'Environmental noise directly cuts into deep sleep. 23 minutes per night is a big loss. Earplugs prevented the reduction in the same study.',
          mechanism: 'Intermittent noise causes cortical arousals that disrupt the thalamocortical slow oscillations maintaining N3. Even sub-awakening arousals shift sleep from N3 to lighter stages.',
          dosage: 'Use earplugs or white noise if exposed to environmental noise',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/37947580/', label: 'Basner et al. SLEEP 2026' }
        },
        {
          key: 'closed-loop-audio',
          name: 'Closed-Loop Audio',
          direction: 'positive',
          evidence: 'moderate',
          effect: 'Positive (precise timing)',
          keyFinding: 'Phase-locked noise enhanced SO rhythm',
          whatThisMeans: 'Precisely timed sound pulses during deep sleep can enhance it. Random background noise does not — and may actually hurt. Consumer devices attempting this need perfect timing to work.',
          mechanism: 'Phase-locked acoustic stimulation (50ms pink noise at 55dB) delivered during the up-state of slow oscillations entrains thalamocortical networks, amplifying endogenous delta rhythms.',
          dosage: 'Requires real-time EEG phase detection; consumer apps vary in accuracy',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/32765139/', label: 'Ngo et al. 2013' }
        },
        {
          key: 'altitude',
          name: 'Altitude',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative',
          keyFinding: '−15% SWA at 2,590m vs 490m',
          whatThisMeans: 'Sleeping at altitude measurably reduces deep sleep. At ~8,500 feet you\'re losing 15% of your slow-wave activity. Partial recovery with acclimatization over 2-3 days.',
          mechanism: 'Hypobaric hypoxia increases periodic breathing and sympathetic activation via peripheral chemoreceptor stimulation, fragmenting SWS and reducing delta power.',
          dosage: 'Effect begins at ~1,630m; −15% SWA at 2,590m; acclimatizes partially',
          source: { url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0076945', label: 'Stadelmann et al. 2013' }
        },
        {
          key: 'bedroom-co2',
          name: 'Bedroom CO₂',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative (linear)',
          keyFinding: 'At 3,000 ppm: quality drops to 80.8%',
          whatThisMeans: 'Stuffy bedrooms with poor ventilation reduce deep sleep. CO₂ above 1,000 ppm starts degrading sleep quality. Opening a window or running a fan makes a measurable difference.',
          mechanism: 'Elevated CO₂ activates central chemoreceptors in the brainstem reticular formation, increasing respiratory drive and cortical arousal that fragments N3.',
          dosage: 'Keep CO₂ below 1,000 ppm; ventilate bedroom before and during sleep',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/32979003/', label: 'Xu et al. 2021' }
        }
      ],

      stress: [
        {
          key: 'cortisol-hpa',
          name: 'Cortisol / HPA Axis',
          direction: 'mixed',
          evidence: 'strong',
          effect: 'Bidirectional',
          keyFinding: 'SWS suppresses cortisol; deprivation raises it',
          whatThisMeans: 'Deep sleep puts the brakes on your stress hormones. Less deep sleep = more cortisol the next day = worse sleep the next night. It\'s a vicious cycle that feeds itself.',
          mechanism: 'SWS exerts inhibitory influence on HPA axis via GABAergic hypothalamic pathways. SWS deprivation removes this brake, elevating next-day cortisol and perpetuating the cycle.',
          dosage: 'Manage stress; protect sleep schedule; break the cortisol-SWS cycle',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4397399/', label: 'PMC 2015' }
        },
        {
          key: 'depression',
          name: 'Depression (MDD)',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative (strong)',
          keyFinding: '37% SWA reduction → 10% symptom improvement',
          whatThisMeans: 'Depression profoundly disrupts deep sleep architecture. The first sleep cycle, which should be your deepest, is most affected.',
          mechanism: 'Serotonergic dysregulation in MDD impairs thalamocortical slow-wave generation. Hyperarousal of the default mode network during NREM reduces delta consolidation.',
          dosage: 'Treat underlying depression; CBT-I as adjunctive therapy',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7866255/', label: 'PMC 2021' }
        },
        {
          key: 'anxiety',
          name: 'Anxiety Disorders',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative',
          keyFinding: 'Less SWS%, more light sleep transitions',
          whatThisMeans: 'Anxiety keeps your brain too activated to drop into deep sleep. More light sleep, more waking, less time in N3.',
          mechanism: 'Hyperactivation of the amygdala and locus coeruleus maintains elevated noradrenergic tone, preventing the cortical deactivation required for N3 entry.',
          dosage: 'Anxiety management; CBT; consider breathing exercises',
          source: { url: 'https://academic.oup.com/sleep/article/20/5/370/2732138', label: 'Sleep 1997' }
        },
        {
          key: 'meditation',
          name: 'Meditation (Vipassana)',
          direction: 'positive',
          evidence: 'moderate',
          effect: 'Positive (preserves SWS)',
          keyFinding: '10.63% vs 3.94% SWS at age 50-60 (n=91)',
          whatThisMeans: 'Long-term meditators maintained nearly 3x more deep sleep at age 50-60 than non-meditators. This is one of the largest effects in the entire deep sleep literature. Results are for Vipassana specifically — other meditation styles show inconsistent N3 effects.',
          mechanism: 'Regular meditation practice reduces HPA axis reactivity and cortical excitability, preserving the thalamocortical slow-oscillation generators that decline with age.',
          dosage: 'Long-term Vipassana practice; effects observed in experienced meditators (years of practice)',
          source: { url: 'https://link.springer.com/article/10.1111/j.1479-8425.2009.00416.x', label: 'Sulekha et al. 2009' }
        }
      ],

      biology: [
        {
          key: 'age-young',
          name: 'Age (Young to Mid-Life)',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative (strong decline)',
          keyFinding: 'SWS: 18.9% → 3.4% (age 16-50)',
          whatThisMeans: 'Deep sleep drops off a cliff between your 20s and 40s. By 35 most men have lost the vast majority of it.',
          mechanism: 'Progressive loss of cortical slow-oscillation generating neurons with age. Reduced growth hormone co-secretion during SWS further diminishes anabolic recovery.',
          dosage: 'Non-modifiable; lifestyle factors can partially offset',
          source: { url: 'https://jamanetwork.com/journals/jama/fullarticle/192981', label: 'Van Cauter et al. 2000' }
        },
        {
          key: 'age-decline',
          name: 'Age (Longitudinal Decline)',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative (ongoing)',
          keyFinding: '−0.6% SWS/yr; 1% loss = 27% dementia risk',
          whatThisMeans: 'Deep sleep keeps declining as you age, and the rate of that decline predicts your dementia risk decades later.',
          mechanism: 'Age-related SWS loss reduces glymphatic clearance of amyloid-β and tau proteins during sleep, accelerating neurodegenerative pathology.',
          dosage: 'Non-modifiable; exercise, meditation, and cooling may slow decline',
          source: { url: 'https://jamanetwork.com/journals/jamaneurology/fullarticle/2810957', label: 'Himali et al. 2023' }
        },
        {
          key: 'sex-gender',
          name: 'Sex / Gender',
          direction: 'variable',
          evidence: 'strong',
          effect: 'Women maintain more',
          keyFinding: 'Women higher SWS%; men decline in 30s',
          whatThisMeans: 'Women hold onto deep sleep longer than men. The gender gap in SWS becomes most obvious between 30-50.',
          mechanism: 'Estrogen exerts neuroprotective effects on slow-oscillation generating cortical networks. Testosterone may accelerate age-related neuronal loss in these circuits.',
          dosage: 'Non-modifiable',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/19302341/', label: 'Bixler et al. 2009' }
        },
        {
          key: 'per2-gene',
          name: 'Genetics (PER2 Gene)',
          direction: 'variable',
          evidence: 'moderate',
          effect: 'Variable',
          keyFinding: '−22% SWS (~20 min); 38% carry variant',
          whatThisMeans: 'About 1 in 3 people carry a clock gene variant that gives them ~20 fewer minutes of deep sleep. You can\'t change your genes but it explains some individual variation.',
          mechanism: 'PER2 rs6753456 minor allele alters circadian clock protein expression, shifting the timing and amplitude of the homeostatic SWS drive.',
          dosage: 'Non-modifiable; explains individual variation',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/27089043/', label: 'Parsons et al. 2016' }
        },
        {
          key: 'bmi-obesity',
          name: 'BMI / Obesity',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative',
          keyFinding: 'N3 loss predicts BMI gain (n=1,187, 14.9yr)',
          whatThisMeans: 'Higher body fat = less deep sleep. And it goes both ways: losing deep sleep predicts future weight gain. Sleep apnea (common in obesity) makes it worse.',
          mechanism: 'Adipose-derived inflammatory cytokines (TNF-α, IL-6) impair thalamocortical slow-oscillation generation. OSA-induced arousals fragment N3.',
          dosage: 'Maintain healthy BMI; treat sleep apnea if present',
          source: { url: 'https://academic.oup.com/sleep/article/44/8/zsab031/6305987', label: 'Wisconsin Sleep Cohort' }
        },
        {
          key: 'neurodegeneration',
          name: 'Neurodegeneration',
          direction: 'mixed',
          evidence: 'strong',
          effect: 'Bidirectional',
          keyFinding: 'SWS disruption → amyloid-β ↑ (r=0.61)',
          whatThisMeans: 'Deep sleep is when your brain takes out the trash (amyloid plaques). Less deep sleep = more Alzheimer\'s-related proteins building up. It\'s likely a vicious cycle.',
          mechanism: 'SWS drives glymphatic clearance of amyloid-β and tau via perivascular CSF flow. Reduced SWS allows toxic protein accumulation, which further impairs SWS — a feedforward loop.',
          dosage: 'Protect deep sleep; exercise, cooling, and stress management all help',
          source: { url: 'https://academic.oup.com/brain/article/140/8/2104/3933862', label: 'Ju et al. 2017' }
        },
        {
          key: 'gut-microbiome',
          name: 'Gut Microbiome',
          direction: 'positive',
          evidence: 'emerging',
          effect: 'Positive (diversity)',
          keyFinding: 'Diversity correlated with sleep efficiency (n=26)',
          whatThisMeans: 'More diverse gut bacteria = better sleep efficiency. The gut-brain axis communicates via the vagus nerve. Note: this study used actigraphy not PSG, so N3-specific data is limited.',
          mechanism: 'Gut microbiota produce SCFAs, serotonin precursors, and GABA that influence central sleep regulation via vagal afferents and systemic inflammation modulation.',
          dosage: 'High-fiber diet; fermented foods; probiotic diversity',
          source: { url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0222394', label: 'Smith et al. 2019' }
        }
      ]
    };
  }

  // ── Top Picks ─────────────────────────────────────────────────────────

  get _topPicks() {
    return [
      {
        icon: 'trophy',
        label: 'Best Single Habit',
        answer: 'Aerobic Exercise',
        note: '33% increase in SWS — the most reliable, repeatable way to boost deep sleep',
        stat: '33% SWS increase',
        category: 'Lifestyle'
      },
      {
        icon: 'moon',
        label: 'Most Underrated',
        answer: 'Sleep Consistency',
        note: 'Same bed/wake time = significantly more SWS. Irregular patterns linked to mortality risk.',
        stat: 'n=38,838',
        category: 'Lifestyle'
      },
      {
        icon: 'thermometer',
        label: 'Quickest Impact',
        answer: 'Body Cooling',
        note: '+7.5 min N3/night from a cooling mattress — works from night one',
        stat: '+7.5 min N3, p=0.004',
        category: 'Environment'
      },
      {
        icon: 'brain',
        label: 'Largest Long-Term Effect',
        answer: 'Vipassana Meditation',
        note: 'Meditators age 50-60 had 2.7x more deep sleep than controls',
        stat: '10.63% vs 3.94% SWS',
        category: 'Stress & Mental Health'
      },
      {
        icon: 'pill',
        label: 'Best Supplement',
        answer: 'Tart Cherry Juice',
        note: '+84 min total sleep via tryptophan pathway — small sample but impressive magnitude',
        stat: '+84 min TST, p=0.018',
        category: 'Supplements'
      },
      {
        icon: 'alert',
        label: 'Biggest Deep Sleep Killer',
        answer: 'Caffeine (Late Day)',
        note: '400mg at 4 hours before bed = −30 minutes of N3. Even at 12 hours: still −21 min.',
        stat: '−29.7 min N3',
        category: 'Lifestyle',
        warning: true
      }
    ];
  }

  // ── Icon Helper ───────────────────────────────────────────────────────

  _icon(name) {
    const icons = {
      sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
      pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 1.5 3 3L5 13 2 10z"/><path d="m13.5 4.5 3 3"/><path d="m2 10 3 3"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.28.44 2.46 1.17 3.39A5.49 5.49 0 0 0 4 14.5 5.5 5.5 0 0 0 9.5 20h0a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 9.5 2z"/><path d="M14.5 2A5.5 5.5 0 0 1 20 7.5c0 1.28-.44 2.46-1.17 3.39A5.49 5.49 0 0 1 20 14.5 5.5 5.5 0 0 1 14.5 20h0a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 14.5 2z"/></svg>',
      users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
      trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
      thermometer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>',
      alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',
      wind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>',
      droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>',
      chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>',
      arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>',
      arrowLeftRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>',
      book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
    };
    return icons[name] || icons.heart;
  }

  // ── Direction & Evidence Config ────────────────────────────────────────

  _directionConfig(d) {
    const map = {
      positive: { icon: 'arrowUp', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', label: 'Positive' },
      negative: { icon: 'arrowDown', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: 'Negative' },
      mixed: { icon: 'arrowLeftRight', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)', label: 'Mixed' },
      variable: { icon: 'arrowLeftRight', color: '#94A3B8', bg: 'rgba(148,163,184,0.1)', label: 'Variable' }
    };
    return map[d] || map.variable;
  }

  _evidenceConfig(e) {
    const map = {
      strong: { color: '#16A34A', bg: 'rgba(34,197,94,0.15)', label: 'Strong' },
      moderate: { color: '#D97706', bg: 'rgba(251,191,36,0.15)', label: 'Moderate' },
      emerging: { color: '#6366F1', bg: 'rgba(99,102,241,0.15)', label: 'Emerging' }
    };
    return map[e] || map.emerging;
  }

  // ── Render Helpers ────────────────────────────────────────────────────

  _renderCategoryTabs() {
    return Object.entries(this._categories).map(([k, c]) =>
      `<button class="cat-tab ${k === this._activeCategory ? 'active' : ''}" data-category="${k}" role="tab" aria-selected="${k === this._activeCategory}">
        <span class="cat-tab-icon">${this._icon(c.icon)}</span>
        <span>${c.name}</span>
        <span class="cat-tab-count">${c.count}</span>
      </button>`
    ).join('');
  }

  _renderSortBar() {
    return `
      <span class="sort-label">Sort by</span>
      <select class="sort-select">
        <option value="default"${this._sortMode === 'default' ? ' selected' : ''}>Default</option>
        <option value="evidence"${this._sortMode === 'evidence' ? ' selected' : ''}>Evidence Strength</option>
        <option value="direction"${this._sortMode === 'direction' ? ' selected' : ''}>Effect Direction</option>
      </select>
    `;
  }

  _renderFactorCards() {
    let factors = this._factors[this._activeCategory];
    if (!factors) return '<p>No factors in this category.</p>';

    if (this._sortMode === 'evidence') {
      const rank = { strong: 0, moderate: 1, emerging: 2 };
      factors = [...factors].sort((a, b) => (rank[a.evidence] ?? 9) - (rank[b.evidence] ?? 9));
    } else if (this._sortMode === 'direction') {
      const rank = { positive: 0, mixed: 1, variable: 2, negative: 3 };
      factors = [...factors].sort((a, b) => (rank[a.direction] ?? 9) - (rank[b.direction] ?? 9));
    }

    return factors.map((f, i) => {
      const dc = this._directionConfig(f.direction);
      const ec = this._evidenceConfig(f.evidence);
      const isExp = this._expandedFactor === f.key;
      return `
        <div class="factor-card ${isExp ? 'expanded' : ''}" data-factor="${f.key}" style="--delay:${i * 60}ms">
          <div class="factor-header" role="button" aria-expanded="${isExp}" tabindex="0">
            <div class="factor-top">
              <div class="factor-badges">
                <span class="badge-direction" style="color:${dc.color};background:${dc.bg}">
                  <span class="badge-icon">${this._icon(dc.icon)}</span>${dc.label}
                </span>
                <span class="badge-evidence" style="color:${ec.color};background:${ec.bg}">${ec.label}</span>
              </div>
              <div class="factor-toggle">${this._icon('chevDown')}</div>
            </div>
            <h3 class="factor-name">${f.name}</h3>
            <div class="factor-effect">${f.effect}</div>
            <div class="factor-evidence-text"><span class="evidence-label">Key: </span>${f.keyFinding}</div>
          </div>
          <div class="factor-body">
            <div class="factor-detail">
              <div class="detail-row">
                <span class="detail-label">What This Means</span>
                <span class="detail-value">${f.whatThisMeans}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Mechanism</span>
                <span class="detail-value">${f.mechanism}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Dosage / Context</span>
                <span class="detail-value">${f.dosage}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Source</span>
                <a href="${f.source.url}" class="source-link" target="_blank" rel="noopener">${f.source.label} ${this._icon('externalLink')}</a>
              </div>
              ${f.affiliate ? `<a href="${f.affiliate.url}" class="factor-affiliate" target="_blank" rel="noopener sponsored"><span>${f.affiliate.label}</span><span>View on Amazon ${this._icon('externalLink')}</span></a>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');
  }

  _renderTopPicks() {
    return this._topPicks.map((p, i) => {
      const isExp = this._expandedTopPick === i;
      return `
        <div class="pick-card ${isExp ? 'expanded' : ''} ${p.warning ? 'pick-warning' : ''}" data-pick="${i}">
          <div class="pick-header" role="button" aria-expanded="${isExp}" tabindex="0">
            <div class="pick-icon"><span>${this._icon(p.icon)}</span></div>
            <div class="pick-info">
              <span class="pick-label">${p.label}</span>
              <span class="pick-answer">${p.answer}</span>
            </div>
            <div class="pick-toggle">${this._icon('chevDown')}</div>
          </div>
          <div class="pick-body">
            <div class="pick-stat-detail"><span class="pick-stat-label">Key Stat: </span>${p.stat}</div>
            <p class="pick-note">${p.note}</p>
            <span class="pick-cat">Category: ${p.category}</span>
          </div>
        </div>`;
    }).join('');
  }

  _renderSources() {
    const catNames = {
      biology: 'Biology & Demographics',
      lifestyle: 'Lifestyle & Behavior',
      environment: 'Environment & Circadian',
      stress: 'Stress & Mental Health',
      supplements: 'Supplements & Micronutrients'
    };
    const allSources = [];
    const groups = {};
    for (const [catKey, factors] of Object.entries(this._factors)) {
      const name = catNames[catKey] || catKey;
      groups[name] = [];
      for (const f of factors) {
        if (f.source) {
          groups[name].push({ label: `${f.name} — ${f.source.label}`, url: f.source.url });
          allSources.push(f.source);
        }
      }
    }
    const totalCount = allSources.length;
    return `
      <div class="src-count-badge">${totalCount} peer-reviewed sources</div>
      ${Object.entries(groups).map(([name, items]) => `
        <div class="src-group">
          <button class="src-group-toggle" aria-expanded="false">
            <span class="src-group-name">${name}</span>
            <span class="src-group-count">${items.length}</span>
            <span class="src-group-chevron">${this._icon('chevDown')}</span>
          </button>
          <div class="src-group-body">
            ${items.map(s => `
              <a href="${s.url}" class="src-item" target="_blank" rel="noopener">
                <span class="src-dot"></span>
                <span class="src-text">${s.label}</span>
                <span class="src-ext">${this._icon('externalLink')}</span>
              </a>`).join('')}
          </div>
        </div>`).join('')}
    `;
  }

  // ── Surgical Updates ──────────────────────────────────────────────────

  _updateCategory() {
    const shadow = this.shadowRoot;
    this._expandedFactor = null;
    const tabs = shadow.querySelector('.cat-tabs');
    const cards = shadow.querySelector('.factor-cards');
    const sortBar = shadow.querySelector('.sort-bar');
    if (tabs) tabs.innerHTML = this._renderCategoryTabs();
    if (cards) cards.innerHTML = this._renderFactorCards();
    if (sortBar) sortBar.innerHTML = this._renderSortBar();
  }

  _toggleFactor(key) {
    this._expandedFactor = this._expandedFactor === key ? null : key;
    this.shadowRoot.querySelectorAll('.factor-card').forEach(card => {
      const isExp = card.dataset.factor === this._expandedFactor;
      card.classList.toggle('expanded', isExp);
      const hdr = card.querySelector('.factor-header');
      if (hdr) hdr.setAttribute('aria-expanded', isExp);
    });
  }

  _toggleTopPick(index) {
    this._expandedTopPick = this._expandedTopPick === index ? null : index;
    this.shadowRoot.querySelectorAll('.pick-card').forEach(card => {
      const isExp = parseInt(card.dataset.pick) === this._expandedTopPick;
      card.classList.toggle('expanded', isExp);
      const hdr = card.querySelector('.pick-header');
      if (hdr) hdr.setAttribute('aria-expanded', isExp);
    });
  }

  // ── Main Render ───────────────────────────────────────────────────────

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const iosUrl = 'https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <!-- Header -->
      <header class="header">
        <div class="header-inner">
          <a href="https://kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" loading="lazy" />
            Deep Sleep Factors
          </a>
          <a href="https://kygo.app" class="header-link" target="_blank" rel="noopener">
            Get Kygo App ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge animate-on-scroll">38 FACTORS • 5 CATEGORIES • ALL PEER-REVIEWED</div>
          <h1 class="animate-on-scroll">What Actually Drives Your Deep Sleep?</h1>
          <p class="hero-sub animate-on-scroll">We dug into every credible study on slow-wave sleep — supplements, lifestyle, environment, stress, and biology — ranked by evidence strength. Here's what actually moves the needle and what doesn't.</p>
        </div>
      </section>

      <!-- Quick Answers -->
      <section class="picks-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Quick Answers</h2>
          <p class="section-sub animate-on-scroll">Our top picks based on evidence strength and practical impact.</p>
          <div class="picks-grid animate-on-scroll">${this._renderTopPicks()}</div>
        </div>
      </section>

      <!-- Explore All Factors -->
      <section class="explore-section" id="explore">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Explore All 38 Factors</h2>
          <p class="section-sub animate-on-scroll">Filter by category, sort by evidence or direction, and expand any card for full details.</p>
          <div class="cat-tabs animate-on-scroll" role="tablist">${this._renderCategoryTabs()}</div>
          <div class="sort-bar animate-on-scroll">${this._renderSortBar()}</div>
          <div class="factor-cards animate-on-scroll">${this._renderFactorCards()}</div>

          <!-- Blog cross-link -->
          <div class="blog-link-wrap">
            <a href="https://www.kygo.app/post/deep-sleep-influences" class="blog-link-card" target="_blank" rel="noopener">
              <div class="blog-link-icon">${this._icon('book')}</div>
              <div class="blog-link-text">
                <span class="blog-link-title">Deep Dive Article</span>
                <span class="blog-link-desc">Read our full guide: What Influences Deep Sleep?</span>
              </div>
              <div class="blog-link-arrow">${this._icon('arrowRight')}</div>
            </a>
          </div>
        </div>
      </section>

      <!-- Blog CTA -->
      <section class="blog-cta-section">
        <div class="container">
          <div class="blog-cta-card">
            <div class="blog-cta-badge"><span class="pulse-dot"></span> Free on iOS</div>
            <h2>Track Your <span class="highlight">Deep Sleep</span> Recovery</h2>
            <p class="blog-cta-desc">Kygo connects your wearable data to nutrition and lifestyle — so you can see what actually improves your sleep.</p>
            <a href="${iosUrl}" class="blog-cta-btn" target="_blank" rel="noopener">Download for iOS</a>
            <div class="blog-cta-tags">
              <span class="blog-cta-tag"><img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura" loading="lazy" /> Oura</span>
              <span class="blog-cta-tag"><img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple" loading="lazy" /> Apple</span>
              <span class="blog-cta-tag"><img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit" loading="lazy" /> Fitbit</span>
              <span class="blog-cta-tag"><img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin" loading="lazy" /> Garmin</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Sources -->
      <section class="sources-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Sources</h2>
          <p class="section-sub animate-on-scroll">Every claim backed by peer-reviewed research.</p>
          <div class="src-accordion animate-on-scroll">${this._renderSources()}</div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-inner">
            <div class="cta-icon">${this._icon('moon')}</div>
            <h2>Optimize Your Deep Sleep</h2>
            <p>Track nutrition, supplements, and wearable data in one place. See what actually moves your deep sleep.</p>
            <a href="${iosUrl}" class="cta-btn" target="_blank" rel="noopener">Download for iOS — Free</a>
            <div class="cta-features">
              <span class="cta-feature">${this._icon('heart')} Wearable Sync</span>
              <span class="cta-feature">${this._icon('pill')} Supplement Tracking</span>
              <span class="cta-feature">${this._icon('brain')} Sleep Insights</span>
            </div>
            <button class="cta-android">Android — Join Beta</button>
          </div>
        </div>
      </section>

      <!-- Android Modal -->
      <div class="android-modal">
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <div class="modal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          </div>
          <h3>Android Free Beta Open!</h3>
          <p>Sign up and we'll send you an email to access the Android beta.</p>
          <form class="android-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Join Free Beta</button>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <footer class="tool-footer">
        <div class="container">
          <a href="https://kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" loading="lazy" />
            Kygo Health
          </a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <div class="footer-links">
            <a href="https://kygo.app">Kygo App</a>
            <a href="https://kygo.app/privacy">Privacy</a>
            <a href="https://kygo.app/terms">Terms</a>
          </div>
          <p class="footer-copyright">Data sourced from peer-reviewed studies and meta-analyses. Last updated March 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, I earn from qualifying purchases.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  // ── Styles ────────────────────────────────────────────────────────────

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
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

      /* Animations */
      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: var(--delay, 0ms); }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      /* Header */
      .header { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid var(--gray-200); }
      .header-inner { display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto; padding: 12px 16px; }
      .logo { display: flex; align-items: center; gap: 8px; text-decoration: none; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); }
      .logo-img { height: 28px; width: auto; }
      .header-link { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--green); color: #fff; text-decoration: none; border-radius: 50px; font-size: 13px; font-weight: 600; transition: background 0.2s; }
      .header-link:hover { background: var(--green-dark); }
      .header-link svg { width: 14px; height: 14px; }

      /* Hero */
      .hero { padding: 48px 0 32px; text-align: center; }
      .hero-badge { display: inline-block; padding: 6px 16px; background: var(--green-light); color: var(--green-dark); font-size: 12px; font-weight: 700; letter-spacing: 1px; border-radius: 50px; margin-bottom: 16px; }
      .hero h1 { font-size: clamp(26px, 7vw, 40px); max-width: 700px; margin: 0 auto 16px; }
      .hero-sub { font-size: 16px; color: var(--gray-600); max-width: 640px; margin: 0 auto; }

      /* Section titles */
      .section-title { font-size: clamp(24px, 6vw, 36px); text-align: center; margin-bottom: 8px; }
      .section-sub { text-align: center; font-size: 15px; color: var(--gray-600); max-width: 600px; margin: 0 auto 24px; }

      /* Quick Answers / Top Picks */
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
      .pick-warning { border-color: rgba(239,68,68,0.3); }
      .pick-warning .pick-icon { background: rgba(239,68,68,0.1); color: var(--red); }
      .pick-stat-detail { font-size: 13px; color: var(--dark); margin-bottom: 8px; font-weight: 500; }
      .pick-stat-label { color: var(--gray-400); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; }
      .pick-warning .pick-stat-detail { color: var(--red); }
      .pick-note { font-size: 14px; color: var(--gray-600); margin-bottom: 6px; }
      .pick-cat { font-size: 12px; color: var(--gray-400); }

      /* Explore Section */
      .explore-section { padding: 48px 0; }

      /* Category Tabs */
      .cat-tabs { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; margin-bottom: 16px; }
      .cat-tabs::-webkit-scrollbar { display: none; }
      .cat-tab { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 50px; border: 2px solid var(--gray-200); background: #fff; font-size: 13px; font-weight: 500; color: var(--gray-600); cursor: pointer; white-space: nowrap; transition: all 0.2s; font-family: inherit; }
      .cat-tab.active { background: var(--green-light); color: var(--green-dark); border-color: var(--green); }
      .cat-tab:hover { border-color: var(--green); }
      .cat-tab-icon { width: 16px; height: 16px; display: flex; }
      .cat-tab-icon svg { width: 16px; height: 16px; }
      .cat-tab-count { background: var(--gray-100); color: var(--gray-400); font-size: 11px; padding: 1px 7px; border-radius: 50px; }
      .cat-tab.active .cat-tab-count { background: rgba(34,197,94,0.2); color: var(--green-dark); }

      /* Sort Bar */
      .sort-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
      .sort-label { font-size: 12px; font-weight: 600; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.3px; }
      .sort-select { padding: 6px 28px 6px 12px; border-radius: 50px; border: 1px solid var(--gray-200); background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center; -webkit-appearance: none; appearance: none; font-size: 13px; font-weight: 500; color: var(--gray-600); cursor: pointer; font-family: inherit; }
      .sort-select:hover, .sort-select:focus { border-color: var(--green); outline: none; }

      /* Factor Cards Grid */
      .factor-cards { display: grid; grid-template-columns: 1fr; gap: 12px; }

      /* Factor Card */
      .factor-card { background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: box-shadow 0.3s, border-color 0.3s; }
      .factor-card:hover { box-shadow: var(--shadow-hover); border-color: var(--gray-300); }
      .factor-header { padding: 20px; cursor: pointer; }
      .factor-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
      .factor-badges { display: flex; gap: 8px; flex-wrap: wrap; }
      .badge-direction { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 50px; font-size: 12px; font-weight: 600; }
      .badge-evidence { display: inline-flex; padding: 3px 10px; border-radius: 50px; font-size: 12px; font-weight: 600; }
      .badge-icon { width: 14px; height: 14px; display: flex; }
      .badge-icon svg { width: 14px; height: 14px; }
      .factor-toggle { width: 24px; height: 24px; color: var(--gray-400); transition: transform 0.3s; flex-shrink: 0; }
      .factor-toggle svg { width: 24px; height: 24px; }
      .factor-card.expanded .factor-toggle { transform: rotate(180deg); }
      .factor-name { font-size: 18px; margin-bottom: 4px; color: var(--dark); }
      .factor-effect { font-size: 14px; font-weight: 600; color: var(--gray-600); margin-bottom: 2px; }
      .factor-evidence-text { font-size: 13px; color: var(--dark); }
      .evidence-label { color: var(--gray-400); font-weight: 500; }

      /* Factor Body (expandable) */
      .factor-body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.4s; padding: 0 20px; }
      .factor-card.expanded .factor-body { max-height: 800px; padding: 0 20px 20px; }
      .factor-detail { border-top: 1px solid var(--gray-100); padding-top: 16px; }
      .detail-row { margin-bottom: 12px; }
      .detail-label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-400); margin-bottom: 2px; }
      .detail-value { font-size: 14px; color: var(--gray-600); line-height: 1.5; }
      .source-link { display: inline-flex; align-items: center; gap: 4px; color: var(--green); font-weight: 500; font-size: 13px; text-decoration: none; }
      .source-link:hover { text-decoration: underline; }
      .source-link svg { width: 12px; height: 12px; }
      .factor-affiliate { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; margin-top: 12px; background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-sm); text-decoration: none; color: var(--gray-600); font-size: 13px; font-weight: 500; transition: all 0.2s; }
      .factor-affiliate:hover { border-color: var(--green); background: var(--green-light); color: var(--green-dark); }
      .factor-affiliate svg { width: 12px; height: 12px; }

      /* Blog Cross-Link */
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

      /* Blog CTA Section */
      .blog-cta-section { padding: 48px 0; }
      .blog-cta-card { position: relative; max-width: 680px; margin: 0 auto; padding: 40px 32px; background: linear-gradient(135deg, var(--dark) 0%, var(--gray-700) 100%); border-radius: var(--radius); text-align: center; color: #fff; overflow: hidden; }
      .blog-cta-card::before { content: ''; position: absolute; top: -50%; right: -30%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(34,197,94,0.15), transparent 70%); pointer-events: none; }
      .blog-cta-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: rgba(255,255,255,0.1); border-radius: 50px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
      .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      .blog-cta-card h2 { font-size: clamp(22px, 5vw, 30px); margin-bottom: 12px; }
      .highlight { color: var(--green); }
      .blog-cta-desc { font-size: 15px; color: var(--gray-300); max-width: 480px; margin: 0 auto 20px; }
      .blog-cta-btn { display: inline-block; padding: 12px 28px; background: var(--green); color: #fff; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 15px; transition: background 0.2s; }
      .blog-cta-btn:hover { background: var(--green-dark); }
      .blog-cta-tags { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-top: 20px; }
      .blog-cta-tag { display: flex; align-items: center; gap: 4px; padding: 4px 10px; background: rgba(255,255,255,0.08); border-radius: 50px; font-size: 12px; font-weight: 500; }
      .blog-cta-tag img { width: 16px; height: 16px; border-radius: 4px; }

      /* Sources Section */
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

      /* CTA Section */
      .cta-section { padding: 64px 0; background: linear-gradient(135deg, var(--green), var(--green-dark)); color: #fff; text-align: center; position: relative; overflow: hidden; }
      .cta-section::before { content: ''; position: absolute; top: 50%; left: 50%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%); transform: translate(-50%, -50%); pointer-events: none; }
      .cta-inner { position: relative; z-index: 1; }
      .cta-icon { width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
      .cta-icon svg { width: 28px; height: 28px; }
      .cta-section h2 { font-size: clamp(24px, 6vw, 36px); margin-bottom: 12px; }
      .cta-section p { font-size: 16px; opacity: 0.9; max-width: 480px; margin: 0 auto 24px; }
      .cta-btn { display: inline-block; padding: 14px 32px; background: #fff; color: var(--green-dark); text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 16px; transition: transform 0.2s, box-shadow 0.2s; }
      .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
      .cta-features { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; margin-top: 20px; font-size: 14px; font-weight: 500; }
      .cta-feature { display: flex; align-items: center; gap: 6px; opacity: 0.9; }
      .cta-feature svg { width: 16px; height: 16px; }
      .cta-android { display: inline-block; margin-top: 16px; padding: 10px 24px; background: transparent; border: 2px solid rgba(255,255,255,0.5); color: #fff; border-radius: 50px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
      .cta-android:hover { background: rgba(255,255,255,0.1); border-color: #fff; }

      /* Android Modal */
      .android-modal { display: none; position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.6); align-items: center; justify-content: center; }
      .android-modal.active { display: flex; }
      .modal-content { background: #fff; border-radius: var(--radius); padding: 32px; max-width: 400px; width: 90%; text-align: center; position: relative; color: var(--dark); }
      .modal-close { position: absolute; top: 12px; right: 16px; background: none; border: none; font-size: 24px; cursor: pointer; color: var(--gray-400); }
      .modal-icon { width: 48px; height: 48px; background: var(--green-light); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; color: var(--green-dark); }
      .modal-icon svg { width: 24px; height: 24px; }
      .modal-content h3 { margin-bottom: 8px; }
      .modal-content p { font-size: 14px; color: var(--gray-600); margin-bottom: 16px; }
      .android-form { display: flex; gap: 8px; }
      .android-form input { flex: 1; padding: 10px 14px; border: 1px solid var(--gray-200); border-radius: var(--radius-sm); font-size: 14px; font-family: inherit; }
      .android-form input:focus { border-color: var(--green); outline: none; }
      .android-form button { padding: 10px 16px; background: var(--green); color: #fff; border: none; border-radius: var(--radius-sm); font-weight: 600; font-size: 14px; cursor: pointer; white-space: nowrap; font-family: inherit; }
      .android-form button:hover { background: var(--green-dark); }
      .success-msg { color: var(--green-dark); font-weight: 600; padding: 12px 0; }

      /* Footer */
      .tool-footer { padding: 32px 0; text-align: center; border-top: 1px solid var(--gray-200); }
      .footer-brand { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; font-family: 'Space Grotesk', sans-serif; font-weight: 600; color: var(--dark); font-size: 16px; }
      .footer-logo { height: 24px; width: auto; }
      .footer-tagline { font-size: 13px; color: var(--gray-400); margin: 8px 0; }
      .footer-links { display: flex; justify-content: center; gap: 16px; margin: 12px 0; }
      .footer-links a { font-size: 13px; color: var(--gray-600); text-decoration: none; }
      .footer-links a:hover { color: var(--green); }
      .footer-copyright { font-size: 12px; color: var(--gray-400); margin-top: 8px; }
      .footer-affiliate { font-style: italic; }

      /* Responsive */
      @media (min-width: 768px) {
        .hero { padding: 64px 0 40px; }
        .picks-grid { grid-template-columns: 1fr 1fr; }
        .factor-cards { grid-template-columns: 1fr 1fr; }
        .header-inner { padding: 14px 24px; }
        .picks-section, .explore-section, .sources-section { padding: 64px 0; }
      }
      @media (min-width: 1024px) {
        .hero { padding: 80px 0 48px; }
        .picks-grid { grid-template-columns: 1fr 1fr 1fr; }
        .picks-section, .explore-section, .sources-section { padding: 80px 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .factor-body, .pick-body, .src-group-body { transition: none; }
        .pulse-dot { animation: none; }
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

      // Factor card toggle (skip affiliate clicks)
      if (e.target.closest('.factor-affiliate') || e.target.closest('.source-link')) return;
      const factorHeader = e.target.closest('.factor-header');
      if (factorHeader) {
        const card = factorHeader.closest('.factor-card');
        if (card) this._toggleFactor(card.dataset.factor);
        return;
      }

      // Top pick toggle
      const pickHeader = e.target.closest('.pick-header');
      if (pickHeader) {
        const card = pickHeader.closest('.pick-card');
        if (card) this._toggleTopPick(parseInt(card.dataset.pick));
        return;
      }

      // Source group toggle
      const srcToggle = e.target.closest('.src-group-toggle');
      if (srcToggle) {
        const group = srcToggle.closest('.src-group');
        group.classList.toggle('open');
        srcToggle.setAttribute('aria-expanded', group.classList.contains('open'));
        return;
      }
    });

    // Sort select
    shadow.addEventListener('change', (e) => {
      if (e.target.classList.contains('sort-select')) {
        this._sortMode = e.target.value;
        const cards = shadow.querySelector('.factor-cards');
        if (cards) cards.innerHTML = this._renderFactorCards();
      }
    });

    // Android modal
    const _ab = shadow.querySelector('.cta-android');
    const _am = shadow.querySelector('.android-modal');
    const _mc = shadow.querySelector('.modal-close');
    const _af = shadow.querySelector('.android-form');
    if (_ab) _ab.addEventListener('click', (e) => { e.preventDefault(); _am.classList.add('active'); });
    if (_mc) _mc.addEventListener('click', () => _am.classList.remove('active'));
    if (_am) _am.addEventListener('click', (e) => { if (e.target === _am) _am.classList.remove('active'); });
    if (_af) _af.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = _af.querySelector('input').value;
      if (email) {
        this.dispatchEvent(new CustomEvent('android-signup', { detail: { email }, bubbles: true, composed: true }));
        _af.innerHTML = '<p class="success-msg">You\'re on the list!</p>';
        setTimeout(() => _am.classList.remove('active'), 2000);
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
          return;
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

  // ── JSON-LD ───────────────────────────────────────────────────────────

  _injectStructuredData() {
    const guardAttr = 'data-kygo-deep-sleep-factors-ld';
    if (document.querySelector(`script[${guardAttr}]`)) return;
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Deep Sleep Factor Explorer',
      'description': 'Explore 38 research-backed factors that affect deep sleep (N3/SWS) — lifestyle, supplements, environment, stress, and biology ranked by evidence strength.',
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'url': 'https://www.kygo.app/tools/deep-sleep-factors',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
      'keywords': 'deep sleep factors, how to increase deep sleep, what affects deep sleep, best supplements for deep sleep, slow wave sleep, N3 sleep, how to get more deep sleep, deep sleep and exercise, caffeine deep sleep, deep sleep and age, SWS factors, improve deep sleep naturally'
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute(guardAttr, '');
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }
}

if (!customElements.get('kygo-deep-sleep-factors')) {
  customElements.define('kygo-deep-sleep-factors', KygoDeepSleepFactors);
}
