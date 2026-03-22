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
    __seo(this, 'Deep Sleep Factor Explorer by Kygo Health. Explore 29 research-backed factors that affect Deep Sleep N3 slow-wave sleep across 5 categories: Lifestyle and Behavior, Supplements and Micronutrients, Environment and Circadian, Stress and Mental Health, and Biology and Demographics. Lifestyle factors include Exercise with 33 percent increase in SWS and increased delta power from moderate cardio, Alcohol with mixed net negative effects front-loading then disrupting SWS, Caffeine 400mg reducing N3 by 29.7 minutes at 4 hours pre-bed, Fiber Intake predicting more SWS, High-Carb High-GI with faster sleep onset but reduced SWS where low carb diets show more N3, Smoking and Nicotine with significant N3 reduction, Cannabis THC with net negative chronic effects on delta power, Dehydration reducing SWS by 24 minutes, Napping late afternoon reducing nighttime N3, and Sleep Consistency increasing SWS significantly. Supplements include Magnesium increasing SWS by 6.4 minutes in elderly, Glycine shortening latency to SWS, Tart Cherry increasing total sleep time by 84 minutes, and Melatonin helping via circadian and homeostatic pathways. Environment factors include Temperature with cooling mattress adding 7.5 minutes N3 and optimal room temp 18-22C, Blue Light reducing frontal slow-wave activity, Aircraft Noise reducing N3 by 23 minutes, Closed-Loop Audio enhancing slow oscillations, Altitude reducing SWA by 15 percent at 2590m, and Bedroom CO2 linearly reducing SWS. Stress factors include Depression MDD with markedly decreased N3, Anxiety Disorders reducing deep SWS percentage, and Vipassana Meditation preserving SWS with meditators showing 10.63 percent vs 3.94 percent at age 50-60. Biology factors include Age with SWS declining from 18.9 to 3.4 percent, Sex with women maintaining more SWS, PER2 Gene variant reducing SWS by 22 percent, BMI Obesity inversely correlated with SWA, and Gut Microbiome diversity correlating with sleep efficiency. How to increase deep sleep naturally. What affects deep sleep. Best supplements for deep sleep. How to get more slow wave sleep. What kills deep sleep. Data sourced from peer-reviewed studies and meta-analyses published through 2026.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Categories ────────────────────────────────────────────────────────

  get _categories() {
    return {
      lifestyle: { name: 'Lifestyle & Behavior', icon: 'sun', count: 10 },
      supplements: { name: 'Supplements & Micronutrients', icon: 'pill', count: 4 },
      environment: { name: 'Environment & Circadian', icon: 'moon', count: 6 },
      stress: { name: 'Stress & Mental Health', icon: 'brain', count: 3, intro: 'Stress and deep sleep form a vicious cycle: SWS suppresses cortisol via GABAergic hypothalamic pathways, but when deep sleep is reduced, next-day cortisol rises — making it harder to get deep sleep the following night. Breaking this cycle is the common thread across all stress-related factors below.' },
      biology: { name: 'Biology & Demographics', icon: 'users', count: 6 }
    };
  }

  // ── Factors ───────────────────────────────────────────────────────────

  get _factors() {
    return {
      lifestyle: [
        {
          key: 'exercise',
          name: 'Exercise',
          direction: 'positive',
          evidence: 'strong',
          effect: 'Positive (strong)',
          keyFinding: '+33% SWS; also increases delta power & stability',
          whatThisMeans: 'Consistent moderate cardio is one of the most reliable ways to increase deep sleep. 3-4 sessions per week at moderate effort works. Beyond duration, exercise also improves deep sleep quality — increased delta power and more stable SWS architecture show up on EEG even when you don\'t subjectively feel a difference.',
          mechanism: 'Moderate aerobic exercise increases homeostatic sleep pressure (adenosine accumulation) and enhances thermoregulatory processes that promote SWS entry. Also increases slow-wave activity (delta power) and stabilizes SWS architecture in early sleep cycles.',
          dosage: 'Moderate intensity (40% VO2max), 3-4x/week, 8-12 weeks for sustained effect; effects strongest in early sleep cycles',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/31095458/', label: 'Aritake-Okada 2019' }
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
          effect: 'Mixed (net negative for SWS)',
          keyFinding: 'Faster sleep onset but reduced SWS. Low carb diets show more N3.',
          whatThisMeans: 'High-carb meals help you fall asleep faster but actually reduce deep sleep. Low carbohydrate diets are associated with more N3/SWS. If deep sleep is your goal, cutting carbs — especially high-GI carbs at dinner — may help.',
          mechanism: 'High-GI foods increase tryptophan uptake (reducing sleep latency) but insulin-mediated shifts in amino acid ratios alter neurotransmitter balance away from SWS promotion. Low carb intake preserves more delta-wave generating capacity.',
          dosage: 'Low carb diets favor more SWS; effect is meal-dependent; timing matters more than total intake',
          source: { url: 'https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2022.933898/full', label: 'Frontiers Nutrition 2022' }
        },
        {
          key: 'smoking',
          name: 'Smoking / Nicotine',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative',
          keyFinding: 'NRT: significant N3 reduction vs non-smokers',
          whatThisMeans: 'Nicotine directly suppresses deep sleep. NRT patches are even worse than smoking for N3 (probably sustained nicotine delivery). Quitting restores it. Note: the exact magnitude of reduction could not be independently verified from published abstracts; the general direction (smoking reduces N3, quitting restores it) is well-confirmed.',
          mechanism: 'Nicotinic acetylcholine receptor activation promotes cortical arousal and suppresses thalamocortical slow oscillations that generate delta waves.',
          dosage: 'Any nicotine exposure reduces N3; NRT patches worst due to sustained delivery; quitting restores deep sleep',
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
          source: { url: 'https://www.whoop.com/us/en/press-center/whoop-study-published-in-sleep-finds/', label: 'WHOOP/SLEEP Study' },
          affiliate: { url: 'https://amzn.to/4saSeEc', label: 'Sunrise Alarm Clock' }
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
          key: 'melatonin',
          name: 'Melatonin',
          direction: 'positive',
          evidence: 'moderate',
          effect: 'Positive (via MT2 receptors)',
          keyFinding: 'MT2 activation → +31% NREM, +33% delta',
          whatThisMeans: 'Helps via circadian and homeostatic pathways. More about sleep timing than N3 depth. MT2 receptors do increase delta power, but melatonin\'s primary value is regulating when you sleep rather than how deep.',
          mechanism: 'Selective MT2 receptor activation in the reticular thalamic nucleus promotes NREM sleep and enhances delta power. MT1 receptors primarily regulate REM.',
          dosage: '0.5-3 mg, 30-60 min before bed; timing > dose',
          source: { url: 'https://onlinelibrary.wiley.com/doi/10.1111/jpi.13011', label: 'Comai et al. 2024' },
          affiliate: { url: 'https://amzn.to/4szGon9', label: 'Melatonin Supplement' }
        }
      ],

      environment: [
        {
          key: 'temperature',
          name: 'Temperature',
          direction: 'positive',
          evidence: 'strong',
          effect: 'Positive (strong)',
          keyFinding: '+7.5 min N3 from cooling mattress; optimal room temp 18-22°C',
          whatThisMeans: 'Cooling your body reliably increases deep sleep — a cooling mattress added 7.5 minutes of N3 per night. Keep your bedroom between 64-72°F (18-22°C). Going above 77°F starts cutting into deep sleep, particularly as you age.',
          mechanism: 'Increasing the core-to-skin temperature gradient via conductive cooling promotes hypothalamic thermoregulatory signaling that gates SWS entry and maintenance. Heat exposure above 25°C triggers thermoregulatory arousal responses.',
          dosage: 'Cooling mattress for body temp; bedroom 18-22°C (64-72°F); older adults more sensitive to heat',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/38409133/', label: 'Herberger et al. 2024' },
          affiliate: { url: 'https://amzn.to/4aYRATe', label: 'Cooling Mattress Pad' }
        },
        {
          key: 'blue-light',
          name: 'Blue Light (Evening)',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative (SWA reduction)',
          keyFinding: '6500K light reduced frontal SWA',
          whatThisMeans: 'Evening screen use reduces deep sleep. The individual study effects are real but the meta-analysis says the overall evidence is moderate, not overwhelming. Note: specific timing claims about which part of the night is most affected could not be verified.',
          mechanism: 'Blue-enriched light (6500K) suppresses melatonin via melanopsin-expressing ipRGCs and delays circadian phase, reducing frontal slow-wave activity.',
          dosage: 'Avoid 6500K+ light 90 min before bed; blue-light filters help',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/23509952/', label: 'Chellappa et al. 2013' },
          affiliate: { url: 'https://amzn.to/4cwMwI1', label: 'Blue Light Blocking Glasses' }
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
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/37947580/', label: 'Basner et al. SLEEP 2026' },
          affiliate: { url: 'https://amzn.to/4bfT8bC', label: 'White Noise Machine' }
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
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/32979003/', label: 'Xu et al. 2021' },
          affiliate: { url: 'https://amzn.to/40gYtKD', label: 'CO₂ Monitor' }
        }
      ],

      stress: [
        {
          key: 'depression',
          name: 'Depression (MDD)',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative (strong)',
          keyFinding: '37% SWA reduction → 10% symptom improvement',
          whatThisMeans: 'Depression profoundly disrupts deep sleep architecture. N3 reduction in MDD is well-confirmed, though specific claims about which sleep cycles are most affected could not be independently verified.',
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
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/27089043/', label: 'Chang et al., Chronobiology International 2016' }
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
        answer: 'Exercise',
        note: '33% increase in SWS plus enhanced delta power — the most reliable, repeatable way to boost deep sleep',
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
        answer: 'Temperature Control',
        note: '+7.5 min N3/night from a cooling mattress — works from night one. Keep room at 18-22°C.',
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
      pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 1.5 3 3L5.3 12.7a4.24 4.24 0 0 1-6-6L7.5 4.5l3-3z"/><path d="m9 9 6.4-6.4a4.24 4.24 0 0 1 6 6L15 15"/><line x1="14.5" y1="13.5" x2="10.5" y2="9.5"/></svg>',
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
      <label class="sort-label" for="sort-select">Sort by:</label>
      <select class="sort-select" id="sort-select">
        <option value="default"${this._sortMode === 'default' ? ' selected' : ''}>Default</option>
        <option value="evidence"${this._sortMode === 'evidence' ? ' selected' : ''}>Evidence Strength</option>
        <option value="direction"${this._sortMode === 'direction' ? ' selected' : ''}>Effect Direction</option>
      </select>
    `;
  }

  _renderFactorCards() {
    let factors = this._factors[this._activeCategory];
    if (!factors) return '<p>No factors in this category.</p>';
    const catInfo = this._categories[this._activeCategory];
    const introHtml = catInfo && catInfo.intro ? `<div class="category-intro">${catInfo.intro}</div>` : '';

    if (this._sortMode === 'evidence') {
      const rank = { strong: 0, moderate: 1, emerging: 2 };
      factors = [...factors].sort((a, b) => (rank[a.evidence] ?? 9) - (rank[b.evidence] ?? 9));
    } else if (this._sortMode === 'direction') {
      const rank = { positive: 0, mixed: 1, variable: 2, negative: 3 };
      factors = [...factors].sort((a, b) => (rank[a.direction] ?? 9) - (rank[b.direction] ?? 9));
    }

    return introHtml + factors.map((f, i) => {
      const dc = this._directionConfig(f.direction);
      const isExp = this._expandedFactor === f.key;
      return `
        <div class="factor-card ${isExp ? 'expanded' : ''}" data-factor="${f.key}" style="--delay:${i * 60}ms">
          <div class="factor-header" role="button" aria-expanded="${isExp}" tabindex="0">
            <div class="factor-top">
              <div class="factor-badges">
                <span class="badge-direction" style="color:${dc.color};background:${dc.bg}">
                  <span class="badge-icon">${this._icon(dc.icon)}</span>${dc.label}
                </span>
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
              ${f.affiliate ? `<a href="${f.affiliate.url}" class="factor-affiliate" target="_blank" rel="noopener nofollow sponsored"><span>Check it out on Amazon</span><span class="factor-affiliate-arrow">${this._icon('externalLink')}</span></a>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');
  }

  _renderTopPicks() {
    return this._topPicks.map((p, i) => {
      const isExp = this._expandedTopPick === i;
      return `
        <div class="pick-card ${isExp ? 'expanded' : ''} ${p.warning ? 'pick-warning' : ''} animate-on-scroll" data-pick="${i}" style="--delay:${i * 80}ms">
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
            <img src="${logoUrl}" alt="Kygo" class="logo-img" />
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
          <div class="hero-badge animate-on-scroll">29 FACTORS • 5 CATEGORIES • ALL PEER-REVIEWED</div>
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
          <h2 class="section-title animate-on-scroll">Explore All 29 Factors</h2>
          <p class="section-sub animate-on-scroll">Filter by category, sort by evidence or direction, and expand any card for full details.</p>
          <div class="cat-tabs animate-on-scroll" role="tablist">${this._renderCategoryTabs()}</div>
          <div class="sort-bar animate-on-scroll">${this._renderSortBar()}</div>
          <div class="factor-cards animate-on-scroll">${this._renderFactorCards()}</div>

          <!-- Blog cross-link -->
          <div class="blog-link-wrap animate-on-scroll">
            <a href="https://www.kygo.app/post/how-to-increase-deep-sleep-factors-ranked" class="blog-link-card" target="_blank" rel="noopener">
              <div class="blog-link-icon"><img src="${logoUrl}" alt="Kygo" style="width:24px;height:24px;" /></div>
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
          <div class="blog-cta animate-on-scroll">
            <div class="blog-cta-glow"></div>
            <div class="blog-cta-content">
              <div class="blog-cta-badge"><span class="pulse-dot"></span>Free Forever Plan</div>
              <h2>Track Your <span class="highlight">Deep Sleep</span> Recovery</h2>
              <p>Kygo connects your wearable data to nutrition and lifestyle — so you can see what actually improves your sleep.</p>
              <div class="blog-cta-buttons">
                <a href="${iosUrl}" class="blog-cta-btn" data-track-position="article-cta" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download Free on iOS
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
          <p class="section-sub animate-on-scroll">Every claim backed by peer-reviewed research.</p>
          <div class="src-accordion animate-on-scroll">${this._renderSources()}</div>
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
      a { color: var(--green); text-decoration: none; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

      /* Animations */
      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: var(--delay, 0ms); }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      /* Header */
      .header { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid var(--gray-200); }
      .header-inner { display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto; padding: 12px 16px; }
      .logo { display: flex; align-items: center; gap: 8px; text-decoration: none; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); }
      .logo-img { height: 28px; width: auto; }
      .header-link { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--green); color: #fff; text-decoration: none; border-radius: 50px; font-size: 13px; font-weight: 600; transition: background 0.2s; white-space: nowrap; }
      .header-link:hover { background: var(--green-dark); }
      .header-link svg { width: 14px; height: 14px; }

      /* Hero */
      .hero { padding: 48px 0 32px; text-align: center; background: #fff; }
      .hero-badge { display: inline-block; padding: 6px 16px; background: var(--green-light); color: var(--green-dark); font-size: 12px; font-weight: 700; letter-spacing: 1px; border-radius: 50px; margin-bottom: 16px; }
      .hero h1 { font-size: clamp(26px, 7vw, 40px); max-width: 700px; margin: 0 auto 16px; }
      .hero-sub { font-size: 16px; color: var(--gray-600); max-width: 640px; margin: 0 auto; }

      /* Section titles */
      .section-title { font-size: clamp(24px, 6vw, 36px); text-align: center; margin-bottom: 8px; }
      .section-sub { text-align: center; font-size: 15px; color: var(--gray-600); max-width: 600px; margin: 0 auto 24px; }

      /* Quick Answers / Top Picks */
      .picks-section { padding: 48px 0; background: #fff; }
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
      .pick-card.expanded .pick-body { max-height: 300px; padding: 0 20px 16px; }
      .pick-warning { border-color: rgba(239,68,68,0.3); }
      .pick-warning .pick-icon { background: rgba(239,68,68,0.1); color: var(--red); }
      .pick-stat-detail { font-size: 13px; color: var(--dark); margin-bottom: 8px; font-weight: 500; }
      .pick-stat-label { color: var(--gray-400); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; }
      .pick-warning .pick-stat-detail { color: var(--red); }
      .pick-note { font-size: 14px; color: var(--gray-600); margin-bottom: 6px; }
      .pick-cat { font-size: 12px; color: var(--gray-400); }

      /* Explore Section */
      .explore-section { padding: 48px 0; background: var(--gray-50); }

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

      /* Category Intro */
      .category-intro { grid-column: 1 / -1; padding: 14px 18px; background: rgba(99,102,241,0.06); border-left: 3px solid #6366F1; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 14px; color: var(--gray-600); line-height: 1.6; margin-bottom: 4px; }

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
      .detail-row:last-child { margin-bottom: 0; }
      .detail-label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-400); margin-bottom: 2px; }
      .detail-value { font-size: 14px; color: var(--gray-600); line-height: 1.5; }
      .source-link { display: inline-flex; align-items: center; gap: 4px; color: var(--green); font-weight: 500; font-size: 13px; text-decoration: none; }
      .source-link:hover { text-decoration: underline; }
      .source-link svg { width: 12px; height: 12px; }
      .factor-affiliate { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; margin-top: 12px; background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-sm); text-decoration: none; color: var(--gray-600); font-size: 13px; font-weight: 500; transition: all 0.2s; }
      .factor-affiliate:hover { border-color: var(--green); background: var(--green-light); color: var(--green-dark); }
      .factor-affiliate-arrow { width: 14px; height: 14px; display: flex; }
      .factor-affiliate-arrow svg { width: 100%; height: 100%; }

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
      .blog-cta-section { padding: 48px 0; background: var(--gray-50); }
      .blog-cta { position: relative; background: linear-gradient(135deg, var(--dark-card) 0%, var(--gray-700) 100%); border-radius: var(--radius); padding: 32px 24px; text-align: center; max-width: 680px; margin: 0 auto; overflow: hidden; }
      .blog-cta-glow { position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%); pointer-events: none; }
      .blog-cta-content { position: relative; z-index: 1; }
      .blog-cta-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,197,94,0.15); color: var(--green); padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
      .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      .blog-cta h2 { color: #fff; font-size: clamp(22px, 5vw, 30px); margin-bottom: 12px; }
      .blog-cta .highlight { color: var(--green); }
      .blog-cta p { color: var(--gray-400); font-size: 14px; margin-bottom: 20px; max-width: 480px; margin-left: auto; margin-right: auto; }
      .blog-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; }
      .blog-cta-btn:hover { background: var(--green-dark); }
      .blog-cta-btn svg { width: 18px; height: 18px; }
      .blog-cta-buttons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
      .blog-cta-tags { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 20px; flex-wrap: wrap; }
      .blog-cta-tags span { color: var(--gray-400); font-size: 12px; }
      .blog-cta-tags img { height: 22px; width: auto; opacity: 0.7; }

      /* Sources Section */
      .sources-section { padding: 48px 0; background: #fff; }
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

      /* Android button (in Blog CTA) */
      .cta-android { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm, 10px); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; border: none; cursor: pointer; }
      .cta-android:hover { background: var(--green-dark); color: #fff; }
      .cta-android svg { width: 18px; height: 18px; }

      /* Footer */
      .tool-footer { padding: 48px 0 32px; text-align: center; border-top: 1px solid var(--gray-200); }
      .footer-brand { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); text-decoration: none; margin-bottom: 8px; }
      .footer-logo { height: 24px; width: auto; }
      .footer-tagline { font-size: 13px; color: var(--gray-400); margin-bottom: 16px; }
      .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 16px; margin-bottom: 16px; padding: 0 16px; }
      .footer-links a { font-size: 13px; color: var(--gray-600); text-decoration: none; white-space: nowrap; }
      .footer-links a:hover { color: var(--green); }
      .footer-disclaimer { font-size: 11px; color: var(--gray-400); line-height: 1.5; max-width: 560px; margin: 0 auto 12px; }
      .footer-copyright { font-size: 12px; color: var(--gray-400); margin-bottom: 4px; }
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

    // WebApplication schema is managed via Wix site-level LD+JSON to avoid duplicates

    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': this._topPicks.map(p => ({
        '@type': 'Question',
        'name': p.label + '?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': p.answer + ' — ' + p.note
        }
      }))
    };

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Kygo Health', 'item': 'https://www.kygo.app' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
        { '@type': 'ListItem', 'position': 3, 'name': 'Deep Sleep Factors', 'item': 'https://www.kygo.app/tools/deep-sleep-factors' }
      ]
    };

    [faq, breadcrumb].forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(guardAttr, '');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });
  }
}

if (!customElements.get('kygo-deep-sleep-factors')) {
  customElements.define('kygo-deep-sleep-factors', KygoDeepSleepFactors);
}
