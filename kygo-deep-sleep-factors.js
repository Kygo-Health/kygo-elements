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
    this._expandedFactor = null;
    this._expandedTopPick = null;
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
          affiliate: { url: 'https://www.amazon.com/dp/B081CHLF46?tag=kygohealthapp-20&th=1', label: 'Sunrise Alarm Clock' , slug: 'sunrise-alarm-clock' }
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
          affiliate: { url: 'https://www.amazon.com/dp/B00151G8L8?tag=kygohealthapp-20&th=1', label: 'Magnesium Glycinate' , slug: 'magnesium-glycinate' }
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
          affiliate: { url: 'https://www.amazon.com/s?k=Glycine%20Powder&rh=p_72%3A1248903011&tag=kygohealthapp-20', label: 'Glycine Powder' , slug: 'glycine-search' }
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
          affiliate: { url: 'https://www.amazon.com/dp/B007RC6J72?tag=kygohealthapp-20&th=1', label: 'Tart Cherry Juice' , slug: 'tart-cherry-juice' }
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
          affiliate: { url: 'https://www.amazon.com/dp/B08666GMWG?tag=kygohealthapp-20&th=1', label: 'Melatonin Supplement' , slug: 'melatonin-gummies' }
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
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/38409133/', label: 'Herberger et al. 2024' }
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
          affiliate: { url: 'https://www.amazon.com/dp/B07W781XWF?tag=kygohealthapp-20&th=1', label: 'Blue Light Blocking Glasses' , slug: 'blue-light-glasses' }
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
          affiliate: { url: 'https://www.amazon.com/dp/B07RWRJ4XW?tag=kygohealthapp-20', label: 'White Noise Machine' , slug: 'white-noise-machine' }
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
          affiliate: { url: 'https://www.amazon.com/dp/B0CGX22CR8?tag=kygohealthapp-20&th=1', label: 'CO₂ Monitor' , slug: 'co2-monitor' }
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
      pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>',
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
      book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
      apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg>',
      android: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>'
    };
    return icons[name] || icons.heart;
  }

  // ── Direction & Evidence Config ────────────────────────────────────────

  // Direction → on-brand class + icon (green for positive; neutral slate for the rest,
  // differentiated by the up/down/shuffle icon — no off-brand red/amber).
  _directionConfig(d) {
    const map = {
      positive: { cls: 'dir-pos', icon: 'arrowUp', label: 'Positive' },
      negative: { cls: 'dir-neg', icon: 'arrowDown', label: 'Negative' },
      mixed: { cls: 'dir-mix', icon: 'arrowLeftRight', label: 'Mixed' },
      variable: { cls: 'dir-var', icon: 'arrowLeftRight', label: 'Variable' }
    };
    return map[d] || map.variable;
  }

  _evidenceConfig(e) {
    const map = {
      strong: { cls: 'ev-strong', label: 'Strong' },
      moderate: { cls: 'ev-moderate', label: 'Moderate' },
      emerging: { cls: 'ev-moderate', label: 'Emerging' }
    };
    return map[e] || map.moderate;
  }

  // ── Render Helpers ────────────────────────────────────────────────────

  // Category jump-nav chips — clicking scrolls to that category block.
  _renderCategoryNav() {
    return Object.entries(this._categories).map(([k, c]) =>
      `<button class="cat-chip" data-jump="cat-${k}">
        <span class="cat-chip-ico">${this._icon(c.icon)}</span>${c.name}<span class="cat-chip-n">${c.count}</span>
      </button>`
    ).join('');
  }

  // Each category is its own block (header + a 2-up grid of factor cards on desktop).
  _renderCategoryBlocks() {
    return Object.entries(this._categories).map(([k, c]) => {
      const factors = this._factors[k] || [];
      const intro = c.intro ? `<p class="cat-block-intro">${c.intro}</p>` : '';
      return `
        <div class="cat-block animate-on-scroll" id="cat-${k}">
          <div class="cat-block-head">
            <span class="cat-block-ico">${this._icon(c.icon)}</span>
            <h3 class="cat-block-name">${c.name}</h3>
            <span class="cat-block-count">${factors.length} factors</span>
          </div>
          ${intro}
          <div class="factor-grid">${factors.map(f => this._renderFactorCard(f)).join('')}</div>
        </div>`;
    }).join('');
  }

  _renderFactorCard(f) {
    const dc = this._directionConfig(f.direction);
    const ev = this._evidenceConfig(f.evidence);
    const isExp = this._expandedFactor === f.key;
    return `
      <div class="factor-card ${isExp ? 'expanded' : ''}" data-factor="${f.key}">
        <div class="factor-header" role="button" aria-expanded="${isExp}" tabindex="0">
          <div class="factor-top">
            <span class="badge-direction ${dc.cls}"><span class="badge-icon">${this._icon(dc.icon)}</span>${dc.label}</span>
            <span class="ev-badge ${ev.cls}">${ev.label}</span>
            <span class="factor-toggle">${this._icon('chevDown')}</span>
          </div>
          <h3 class="factor-name">${f.name}</h3>
          <p class="factor-key"><span class="factor-key-label">Key</span> ${f.keyFinding}</p>
        </div>
        <div class="factor-body">
          <div class="detail-row"><span class="detail-label">What this means</span><span class="detail-value">${f.whatThisMeans}</span></div>
          <div class="detail-row"><span class="detail-label">Mechanism</span><span class="detail-value">${f.mechanism}</span></div>
          <div class="detail-row"><span class="detail-label">Dosage / context</span><span class="detail-value">${f.dosage}</span></div>
          <a href="${f.source.url}" class="factor-src" target="_blank" rel="noopener nofollow" data-action="source-link">${f.source.label} ${this._icon('externalLink')}</a>
          ${f.affiliate ? `<a href="${f.affiliate.url}" class="factor-affiliate" target="_blank" rel="noopener nofollow sponsored" data-action="affiliate" data-track-label="${f.affiliate.slug}">Check it out on Amazon ${this._icon('externalLink')}</a>` : ''}
        </div>
      </div>`;
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

  // Compact source list (tag = category, title = factor + study).
  _renderSources() {
    const catLabel = {
      lifestyle: 'Lifestyle', supplements: 'Supplements', environment: 'Environment',
      stress: 'Stress', biology: 'Biology'
    };
    const items = [];
    for (const [catKey, factors] of Object.entries(this._factors)) {
      for (const f of factors) {
        if (f.source) items.push({ tag: catLabel[catKey] || catKey, title: `${f.name} — ${f.source.label}`, url: f.source.url });
      }
    }
    return `
      <div class="src-count">${items.length} peer-reviewed sources</div>
      <div class="sources">${items.map(s => `
        <a class="src" href="${s.url}" target="_blank" rel="noopener nofollow" data-action="source-link">
          <span class="src-tag">${s.tag}</span>
          <span class="src-title">${s.title}</span>
        </a>`).join('')}</div>`;
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
    const iosUrl = 'https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy';
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const appleImg = 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png';
    const fitbitImg = 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png';
    const garminImg = 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png';
    const googleHealthImg = 'https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png';
    const healthConnectImg = 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" loading="lazy" />
            <span>Kygo Health</span>
          </a>
          <a href="${iosUrl}" class="nav-cta-link cta-primary" data-track-label="subnav-get-app" data-track-position="subnav" target="_blank" rel="noopener">Get Kygo App ${this._icon('arrowRight')}</a>
        </div>
      </header>

      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill"><span class="dot"></span> 29 FACTORS · 5 CATEGORIES · PEER-REVIEWED</div>
              <h1>What actually drives your <span class="hl">deep sleep?</span></h1>
              <p class="hero-lede">We dug into every credible study on slow-wave sleep — supplements, lifestyle, environment, stress, and biology — <strong>ranked by evidence strength.</strong> Here's what moves the needle and what doesn't.</p>
            </div>
            <div class="hero-vis">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> Biggest lever</span>
                <span class="hero-vis-tag">peer-reviewed</span>
              </div>
              <div class="hv-body">
                <div class="hv-big">+33%</div>
                <div class="hv-text">
                  <p>more <strong>slow-wave (deep) sleep</strong> from regular moderate exercise — the single most reliable lever you control.</p>
                  <span class="hv-src">Aritake-Okada 2019</span>
                </div>
              </div>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">29</div><div class="lbl">Factors analyzed</div></div>
            <div class="hero-stat"><div class="num">29</div><div class="lbl">Peer-reviewed sources</div></div>
            <div class="hero-stat"><div class="num">5</div><div class="lbl">Categories of influence</div></div>
            <div class="hero-stat"><div class="num">−30<span class="unit">min</span></div><div class="lbl">Late caffeine's hit to deep sleep</div></div>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Start here</div>
            <h2>Quick <span class="hl">answers.</span></h2>
            <p class="lede">Our top picks, ranked on evidence strength and practical impact. Tap any to expand.</p>
          </div>
          <div class="picks-grid animate-on-scroll">${this._renderTopPicks()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="kygo-cta-card animate-on-scroll">
            <div class="cta-pill"><span class="dot"></span> Free Forever Plan</div>
            <h3>Track your <span>deep sleep</span> recovery.</h3>
            <p>Stop guessing which of these applies to you. Kygo correlates your meals, caffeine, and alcohol with YOUR sleep stages.</p>
            <div class="cta-btn-row">
              <a class="btn btn-primary btn-lg cta-primary" href="${iosUrl}" target="_blank" rel="noopener" data-track-position="early" data-track-label="deep-sleep-early-ios">${this._icon('apple')} Try Free for 7 Days</a>
              <a class="btn btn-primary btn-lg cta-android" href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" target="_blank" rel="noopener" data-action="android-download" data-track-position="early" data-track-label="deep-sleep-early-android">${this._icon('android')} Download for Android</a>
            </div>
            <p style="position:relative;margin:16px 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.72);text-align:center;">7-day free trial on yearly. Free plan available. Cancel anytime.</p>
            <div class="cta-works">
              <span>Works with</span>
              <div class="cta-badges">
                <img src="${ouraImg}" alt="Oura Ring" title="Oura Ring" loading="lazy" />
                <img src="${appleImg}" alt="Apple Health" title="Apple Health" loading="lazy" />
                <img src="${fitbitImg}" alt="Fitbit" title="Fitbit" loading="lazy" />
                <img src="${garminImg}" alt="Garmin" title="Garmin" loading="lazy" />
                <img src="${googleHealthImg}" alt="Google Health" title="Google Health" loading="lazy" />
                <img src="${healthConnectImg}" alt="Health Connect" title="Health Connect" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <kygo-inline-subscribe source="tool-deep-sleep-factors" variant="factors"></kygo-inline-subscribe>

      <section class="section bg-light" id="explore">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The library</div>
            <h2>Explore all <span class="hl">29 factors.</span></h2>
            <p class="lede">Jump to a category, then tap any factor to expand its plain-English takeaway, mechanism, dose, and source.</p>
          </div>
          <div class="cat-nav animate-on-scroll">${this._renderCategoryNav()}</div>
          ${this._renderCategoryBlocks()}
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <a class="blog-cta animate-on-scroll" href="https://www.kygo.app/post/how-to-increase-deep-sleep-factors-ranked" target="_blank" rel="noopener">
            <span class="blog-cta-tag">Full Guide</span>
            <div class="blog-cta-body">
              <div class="blog-cta-kicker">Read the complete guide</div>
              <div class="blog-cta-title">How to Increase Deep Sleep</div>
              <div class="blog-cta-sub">Every factor ranked by evidence — what actually moves slow-wave sleep, and what's just hype, in plain English.</div>
            </div>
            <span class="blog-cta-arrow">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every claim, <span class="hl">traceable.</span></h2>
            <p class="lede">Each factor is anchored to a primary peer-reviewed source. Last updated March 2026.</p>
          </div>
          <div class="animate-on-scroll">${this._renderSources()}</div>
        </div>
      </section>

      <footer class="tool-footer">
        <div class="container">
          <a href="https://www.kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" loading="lazy" />
            <span>Kygo Health</span>
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
        --kygo-green:#22C55E; --kygo-green-dark:#16A34A; --kygo-green-light:#DCFCE7;
        --kygo-dark:#0F172A; --kygo-light:#F8FAFC;
        --bg-canvas:#FFFFFF; --bg-surface:#F8FAFC; --bg-raised:#F1F5F9;
        --fg-1:#0F172A; --fg-2:#475569; --fg-3:#94A3B8; --border-subtle:#E2E8F0;
        --shadow-md:0 8px 24px rgba(15,23,42,.06); --shadow-cta:0 8px 24px rgba(34,197,94,.30);
        --font-display:'Space Grotesk',sans-serif; --font-body:'DM Sans',sans-serif;
        --ease-out:cubic-bezier(.16,1,.3,1);
        display:block; font-family:var(--font-body); color:var(--fg-1); background:var(--bg-canvas);
        line-height:1.5; -webkit-font-smoothing:antialiased;
      }
      * { box-sizing:border-box; }
      a { color:inherit; text-decoration:none; }
      .ico { display:inline-flex; align-items:center; justify-content:center; }
      .ico svg, svg.inline { width:1em; height:1em; }

      .animate-on-scroll { opacity:0; transform:translateY(16px); transition:opacity .6s var(--ease-out), transform .6s var(--ease-out); }
      .animate-on-scroll.visible { opacity:1; transform:none; }

      /* Nav */
      .nav { position:sticky; top:0; z-index:50; background:rgba(255,255,255,.92); backdrop-filter:saturate(160%) blur(14px); -webkit-backdrop-filter:saturate(160%) blur(14px); border-bottom:1px solid var(--border-subtle); }
      .nav-inner { max-width:1200px; margin:0 auto; padding:14px 20px; display:flex; align-items:center; gap:16px; }
      .nav-brand { display:flex; align-items:center; gap:10px; font-family:var(--font-display); font-weight:700; font-size:14px; letter-spacing:-.01em; color:var(--fg-1); text-transform:uppercase; }
      .nav-brand img { width:26px; height:26px; }
      .nav-cta-link { margin-left:auto; display:inline-flex; align-items:center; gap:6px; background:var(--kygo-green); color:#fff; padding:8px 14px; border-radius:8px; font-weight:600; font-size:14px; text-decoration:none; }
      .nav-cta-link:hover { background:var(--kygo-green-dark); color:#fff; }
      .nav-cta-link svg { width:16px; height:16px; }
      @media (max-width:480px){ .nav-brand span { display:none; } }

      /* Buttons */
      .btn { font-family:var(--font-body); font-weight:600; font-size:14px; padding:10px 18px; border-radius:10px; border:0; cursor:pointer; display:inline-flex; align-items:center; gap:8px; transition:all .2s var(--ease-out); white-space:nowrap; }
      .btn svg { width:16px; height:16px; }
      .btn-primary { background:var(--kygo-green); color:#fff; box-shadow:0 4px 12px rgba(34,197,94,.25); }
      .btn-primary:hover { background:var(--kygo-green-dark); transform:translateY(-1px); box-shadow:var(--shadow-cta); }
      .btn-lg { padding:14px 22px; font-size:15px; border-radius:12px; }
      .btn-lg svg { width:18px; height:18px; }

      /* Hero */
      .hero-light { background:#fff; border-bottom:1px solid var(--border-subtle); }
      .hero-light-inner { max-width:1200px; margin:0 auto; padding:48px 20px 36px; }
      .hero-grid { display:grid; grid-template-columns:1fr; gap:24px; align-items:center; margin-bottom:32px; }
      @media (min-width:880px){ .hero-grid { grid-template-columns:1.15fr 1fr; gap:48px; } .hero-light-inner { padding:64px 24px 48px; } }
      .hero-pill { display:inline-flex; align-items:center; gap:8px; background:rgba(34,197,94,.10); color:var(--kygo-green-dark); padding:6px 14px; border-radius:999px; font-family:var(--font-display); font-size:11px; font-weight:600; letter-spacing:.5px; white-space:nowrap; }
      .hero-pill .dot { width:6px; height:6px; border-radius:50%; background:var(--kygo-green); flex:none; }
      .hero-light h1 { font-family:var(--font-display); font-weight:700; color:var(--fg-1); font-size:clamp(30px,5.5vw,56px); line-height:1.05; letter-spacing:-.02em; margin:18px 0; }
      .hero-light h1 .hl { color:var(--kygo-green); }
      .hero-lede { font-size:clamp(15px,1.6vw,18px); line-height:1.55; color:var(--fg-2); max-width:60ch; margin:0; }
      .hero-lede strong { color:var(--fg-1); font-weight:600; }
      .hero-vis { position:relative; overflow:hidden; display:flex; flex-direction:column; gap:14px; background:linear-gradient(158deg,#fff 0%,#EEF2F7 100%); border:1px solid var(--border-subtle); border-radius:20px; padding:18px 20px; box-shadow:0 16px 40px rgba(15,23,42,.08); }
      .hero-vis::before { content:''; position:absolute; top:-90px; right:-70px; width:240px; height:240px; background:radial-gradient(closest-side,rgba(34,197,94,.16),transparent); pointer-events:none; }
      .hero-vis-head { position:relative; display:flex; align-items:center; justify-content:space-between; }
      .hero-vis-title { display:inline-flex; align-items:center; gap:7px; font-family:var(--font-display); font-size:11px; font-weight:600; letter-spacing:.6px; text-transform:uppercase; color:var(--fg-3); }
      .hero-vis-dot { width:7px; height:7px; border-radius:50%; background:var(--kygo-green); box-shadow:0 0 0 3px rgba(34,197,94,.18); }
      .hero-vis-tag { font-family:var(--font-display); font-size:11px; font-weight:700; letter-spacing:.3px; color:var(--kygo-green-dark); background:var(--kygo-green-light); padding:4px 10px; border-radius:999px; }
      .hv-body { position:relative; display:flex; align-items:center; gap:18px; }
      .hv-big { flex:none; font-family:var(--font-display); font-weight:700; font-size:clamp(46px,10vw,72px); line-height:.92; letter-spacing:-.03em; color:var(--kygo-green-dark); }
      .hv-text { flex:1; min-width:0; }
      .hv-text p { margin:0 0 8px; font-size:14px; line-height:1.55; color:var(--fg-2); }
      .hv-text p strong { color:var(--fg-1); font-weight:600; }
      .hv-src { font-size:11px; color:var(--fg-3); }
      @media (max-width:880px){ .hero-vis { width:100%; max-width:460px; margin:4px auto 0; } }
      .hero-stats { display:grid; grid-template-columns:repeat(2,1fr); gap:22px; border-top:1px solid var(--border-subtle); padding-top:24px; }
      @media (min-width:720px){ .hero-stats { grid-template-columns:repeat(4,1fr); gap:24px; padding-top:28px; } }
      .hero-stat .num { font-family:var(--font-display); font-weight:700; font-size:clamp(28px,4vw,40px); line-height:1; color:var(--kygo-green); letter-spacing:-.02em; display:inline-flex; align-items:baseline; }
      .hero-stat .num .unit { font-size:.55em; margin-left:2px; }
      .hero-stat .lbl { margin-top:10px; color:var(--fg-3); font-size:11px; text-transform:uppercase; letter-spacing:.5px; font-weight:600; line-height:1.4; }

      /* Sections */
      .section { padding:56px 20px; }
      @media (min-width:720px){ .section { padding:80px 24px; } }
      .section-inner { max-width:1200px; margin:0 auto; }
      .container { max-width:1200px; margin:0 auto; padding:0 20px; }
      .section.bg-white { background:#fff; }
      .section.bg-light { background:var(--kygo-light); }
      .section-head { margin-bottom:28px; max-width:720px; }
      .kicker { display:inline-flex; align-items:center; gap:8px; font-family:var(--font-display); font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.8px; color:var(--kygo-green-dark); background:var(--kygo-green-light); padding:6px 12px; border-radius:999px; }
      .section h2 { font-family:var(--font-display); font-weight:600; font-size:clamp(26px,4vw,42px); line-height:1.1; margin:16px 0 10px; letter-spacing:-.01em; }
      .section h2 .hl { color:var(--kygo-green); }
      .lede { color:var(--fg-2); font-size:16px; line-height:1.55; max-width:60ch; margin:0; }
      .lede strong { color:var(--fg-1); font-weight:600; }

      /* Quick-answer pick cards */
      .picks-grid { display:grid; grid-template-columns:1fr; gap:12px; }
      @media (min-width:620px){ .picks-grid { grid-template-columns:1fr 1fr; } }
      @media (min-width:980px){ .picks-grid { grid-template-columns:repeat(3,1fr); } }
      .pick-card { background:#fff; border:1.5px solid var(--border-subtle); border-radius:16px; overflow:hidden; transition:border-color .2s, box-shadow .2s; }
      .pick-card.expanded { border-color:var(--kygo-green); box-shadow:var(--shadow-md); }
      .pick-header { display:flex; align-items:center; gap:12px; padding:16px; cursor:pointer; }
      .pick-icon { width:38px; height:38px; border-radius:10px; background:var(--kygo-green-light); color:var(--kygo-green-dark); display:inline-flex; align-items:center; justify-content:center; flex:none; }
      .pick-icon svg { width:19px; height:19px; }
      .pick-warning .pick-icon { background:var(--bg-raised); color:var(--fg-2); }
      .pick-info { flex:1; min-width:0; display:flex; flex-direction:column; gap:2px; }
      .pick-label { font-family:var(--font-display); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.5px; color:var(--fg-3); }
      .pick-answer { font-family:var(--font-display); font-weight:600; font-size:16px; color:var(--fg-1); line-height:1.2; }
      .pick-toggle { color:var(--fg-3); flex:none; }
      .pick-toggle svg { width:18px; height:18px; transition:transform .2s; }
      .pick-card.expanded .pick-toggle svg { transform:rotate(180deg); color:var(--kygo-green-dark); }
      .pick-body { display:none; padding:0 16px 16px 66px; }
      .pick-card.expanded .pick-body { display:block; }
      .pick-stat-detail { font-size:12px; color:var(--fg-2); background:var(--bg-surface); border-radius:8px; padding:8px 10px; margin-bottom:8px; }
      .pick-stat-label { font-family:var(--font-display); font-weight:600; font-size:10px; text-transform:uppercase; letter-spacing:.3px; color:var(--kygo-green-dark); }
      .pick-note { margin:0 0 8px; font-size:13px; line-height:1.55; color:var(--fg-2); }
      .pick-cat { font-size:11px; color:var(--fg-3); }

      /* Kygo CTA */
      .kygo-cta-card { background:var(--kygo-dark); border-radius:24px; padding:40px 24px; position:relative; overflow:hidden; color:#fff; text-align:center; display:flex; flex-direction:column; align-items:center; }
      @media (min-width:720px){ .kygo-cta-card { padding:56px 40px; } }
      .kygo-cta-card::before { content:''; position:absolute; top:-160px; right:-160px; width:520px; height:520px; background:radial-gradient(closest-side,rgba(34,197,94,.30),transparent); pointer-events:none; }
      .kygo-cta-card::after { content:''; position:absolute; bottom:-180px; left:-180px; width:480px; height:480px; background:radial-gradient(closest-side,rgba(34,197,94,.12),transparent); pointer-events:none; }
      .kygo-cta-card .cta-pill { position:relative; display:inline-flex; align-items:center; gap:8px; background:rgba(34,197,94,.16); color:#6EE7A0; padding:6px 14px; border-radius:999px; font-family:var(--font-display); font-size:12px; font-weight:600; border:1px solid rgba(34,197,94,.25); }
      .kygo-cta-card .cta-pill .dot { width:6px; height:6px; border-radius:50%; background:var(--kygo-green); box-shadow:0 0 8px var(--kygo-green); }
      .kygo-cta-card h3 { position:relative; font-family:var(--font-display); font-weight:600; color:#fff; font-size:clamp(26px,4.5vw,42px); line-height:1.05; letter-spacing:-.01em; margin:18px 0 14px; max-width:22ch; }
      .kygo-cta-card h3 span { color:var(--kygo-green); }
      .kygo-cta-card p { position:relative; color:rgba(255,255,255,.72); font-size:clamp(14px,1.6vw,16px); line-height:1.6; max-width:56ch; margin:0 auto 24px; }
      .kygo-cta-card .cta-btn-row { position:relative; display:flex; gap:12px; flex-wrap:wrap; justify-content:center; width:100%; }
      @media (max-width:560px){ .kygo-cta-card .cta-btn-row .btn-lg { width:100%; justify-content:center; } }
      .kygo-cta-card .cta-works { position:relative; margin-top:26px; display:flex; flex-direction:column; align-items:center; gap:12px; color:rgba(255,255,255,.6); font-size:13px; }
      .kygo-cta-card .cta-badges { display:flex; gap:10px; align-items:center; flex-wrap:wrap; justify-content:center; }
      .kygo-cta-card .cta-badges img { width:32px; height:32px; border-radius:8px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.10); padding:4px; object-fit:contain; }

      /* Category nav + blocks */
      .cat-nav { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px; }
      .cat-chip { display:inline-flex; align-items:center; gap:8px; font-family:var(--font-body); font-size:13px; font-weight:600; padding:9px 14px; border-radius:999px; border:1.5px solid var(--border-subtle); background:#fff; color:var(--fg-2); cursor:pointer; transition:all .15s ease; }
      .cat-chip:hover { border-color:var(--kygo-green); color:var(--kygo-green-dark); }
      .cat-chip-ico { display:inline-flex; }
      .cat-chip-ico svg { width:15px; height:15px; }
      .cat-chip-n { font-size:11px; padding:2px 7px; border-radius:999px; background:var(--bg-raised); color:var(--fg-3); }
      .cat-block { padding-top:32px; scroll-margin-top:80px; }
      .cat-block-head { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
      .cat-block-ico { width:40px; height:40px; border-radius:11px; background:var(--kygo-green-light); color:var(--kygo-green-dark); display:inline-flex; align-items:center; justify-content:center; flex:none; }
      .cat-block-ico svg { width:20px; height:20px; }
      .cat-block-name { font-family:var(--font-display); font-weight:600; font-size:clamp(19px,2.6vw,24px); margin:0; flex:1; min-width:0; }
      .cat-block-count { font-family:var(--font-display); font-size:12px; font-weight:600; color:var(--fg-3); background:var(--bg-raised); padding:4px 11px; border-radius:999px; white-space:nowrap; }
      .cat-block-intro { font-size:14px; line-height:1.6; color:var(--fg-2); background:#fff; border:1px solid var(--border-subtle); border-radius:14px; padding:14px 16px; margin:0 0 14px; }

      /* Factor cards */
      .factor-grid { display:grid; grid-template-columns:1fr; gap:12px; align-items:start; }
      @media (min-width:768px){ .factor-grid { grid-template-columns:1fr 1fr; } }
      .factor-card { background:#fff; border:1.5px solid var(--border-subtle); border-radius:16px; overflow:hidden; transition:border-color .2s, box-shadow .2s; }
      .factor-card.expanded { border-color:var(--kygo-green); box-shadow:var(--shadow-md); }
      .factor-header { padding:18px; cursor:pointer; }
      .factor-top { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
      .badge-direction { display:inline-flex; align-items:center; gap:5px; font-family:var(--font-display); font-size:11px; font-weight:600; padding:4px 10px; border-radius:999px; }
      .badge-direction .badge-icon { display:inline-flex; }
      .badge-direction .badge-icon svg { width:12px; height:12px; }
      .badge-direction.dir-pos { background:var(--kygo-green-light); color:var(--kygo-green-dark); }
      .badge-direction.dir-neg { background:var(--bg-raised); color:var(--fg-2); }
      .badge-direction.dir-mix { background:var(--bg-raised); color:var(--fg-2); }
      .badge-direction.dir-var { background:var(--bg-raised); color:var(--fg-3); }
      .ev-badge { font-family:var(--font-display); font-size:10px; font-weight:600; letter-spacing:.3px; text-transform:uppercase; padding:3px 9px; border-radius:999px; }
      .ev-badge.ev-strong { background:var(--kygo-green-light); color:var(--kygo-green-dark); }
      .ev-badge.ev-moderate { background:var(--bg-raised); color:var(--fg-2); }
      .factor-toggle { margin-left:auto; color:var(--fg-3); flex:none; }
      .factor-toggle svg { width:18px; height:18px; transition:transform .2s; }
      .factor-card.expanded .factor-toggle svg { transform:rotate(180deg); color:var(--kygo-green-dark); }
      .factor-name { font-family:var(--font-display); font-weight:600; font-size:17px; line-height:1.25; margin:0 0 6px; }
      .factor-key { margin:0; font-size:13px; line-height:1.5; color:var(--fg-2); }
      .factor-key-label { font-family:var(--font-display); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.3px; color:var(--fg-3); margin-right:4px; }
      .factor-body { display:none; padding:0 18px 18px; flex-direction:column; gap:12px; }
      .factor-card.expanded .factor-body { display:flex; }
      .detail-row { display:flex; flex-direction:column; gap:3px; border-top:1px solid var(--border-subtle); padding-top:12px; }
      .detail-label { font-family:var(--font-display); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.4px; color:var(--fg-3); }
      .detail-value { font-size:13px; line-height:1.6; color:var(--fg-2); }
      .factor-src { display:inline-flex; align-items:center; gap:6px; font-family:var(--font-body); font-size:12.5px; font-weight:600; color:var(--kygo-green-dark); }
      .factor-src svg { width:13px; height:13px; }
      .factor-affiliate { display:inline-flex; align-items:center; gap:6px; align-self:flex-start; padding:10px 14px; border-radius:10px; border:1.5px solid var(--kygo-green-light); background:rgba(34,197,94,.06); color:var(--kygo-green-dark); font-family:var(--font-body); font-weight:600; font-size:13px; }
      .factor-affiliate:hover { border-color:var(--kygo-green); background:rgba(34,197,94,.12); }
      .factor-affiliate svg { width:13px; height:13px; }

      /* Blog CTA */
      .blog-cta { display:grid; grid-template-columns:auto 1fr auto; gap:18px; align-items:center; background:linear-gradient(135deg,rgba(34,197,94,.06) 0%,rgba(34,197,94,.02) 100%); border:1.5px solid var(--kygo-green-light); border-radius:18px; padding:22px; transition:all .25s var(--ease-out); color:var(--fg-1); }
      .blog-cta:hover { border-color:var(--kygo-green); box-shadow:var(--shadow-md); transform:translateY(-2px); }
      .blog-cta-tag { display:inline-flex; align-items:center; padding:6px 14px; border-radius:999px; background:#fff; border:1.5px solid var(--kygo-green-light); color:var(--kygo-green-dark); font-family:var(--font-display); font-size:11px; font-weight:700; letter-spacing:.6px; text-transform:uppercase; white-space:nowrap; }
      .blog-cta-body { min-width:0; }
      .blog-cta-kicker { font-family:var(--font-display); font-size:11px; font-weight:700; letter-spacing:.6px; text-transform:uppercase; color:var(--kygo-green-dark); margin-bottom:4px; }
      .blog-cta-title { font-family:var(--font-display); font-size:clamp(15px,2vw,18px); font-weight:600; color:var(--fg-1); line-height:1.3; }
      .blog-cta-sub { font-size:13px; color:var(--fg-2); margin-top:4px; line-height:1.5; }
      .blog-cta-arrow { width:44px; height:44px; border-radius:50%; background:var(--kygo-green); color:#fff; display:inline-flex; align-items:center; justify-content:center; flex:none; box-shadow:0 4px 12px rgba(34,197,94,.30); }
      .blog-cta-arrow svg { width:20px; height:20px; }
      @media (max-width:600px){
        .blog-cta { grid-template-columns:1fr auto; grid-template-areas:'tag arrow' 'body body'; padding:18px; gap:14px; }
        .blog-cta-tag { grid-area:tag; justify-self:start; }
        .blog-cta-arrow { grid-area:arrow; width:40px; height:40px; }
        .blog-cta-body { grid-area:body; }
      }

      /* Sources */
      .src-count { font-size:13px; color:var(--fg-3); margin-bottom:14px; }
      .sources { display:grid; grid-template-columns:1fr; gap:8px; }
      @media (min-width:600px){ .sources { grid-template-columns:1fr 1fr; } }
      @media (min-width:960px){ .sources { grid-template-columns:repeat(3,1fr); } }
      .src { display:flex; flex-direction:column; gap:4px; background:#fff; border:1.5px solid var(--border-subtle); border-radius:12px; padding:12px 14px; transition:border-color .15s, box-shadow .15s; }
      .src:hover { border-color:var(--kygo-green); box-shadow:var(--shadow-md); }
      .src-tag { align-self:flex-start; font-family:var(--font-display); font-size:9.5px; font-weight:700; letter-spacing:.4px; text-transform:uppercase; color:var(--kygo-green-dark); }
      .src-title { font-family:var(--font-display); font-weight:600; font-size:13px; color:var(--fg-1); line-height:1.3; }
      .src:hover .src-title { color:var(--kygo-green-dark); }

      /* Footer */
      .tool-footer { padding:56px 20px 40px; background:var(--kygo-light); color:var(--fg-2); border-top:1px solid var(--border-subtle); }
      .tool-footer .container { max-width:720px; margin:0 auto; text-align:center; }
      .footer-brand { display:inline-flex; align-items:center; gap:10px; color:var(--fg-1); font-family:var(--font-display); font-weight:700; font-size:17px; }
      .footer-logo { width:28px; height:28px; }
      .footer-tagline { color:var(--fg-3); font-size:14px; margin:10px 0 22px; }
      .footer-links { display:flex; flex-wrap:wrap; justify-content:center; gap:18px; margin-bottom:28px; font-size:14px; }
      .footer-links a { color:var(--fg-2); }
      .footer-links a:hover { color:var(--kygo-green-dark); }
      .footer-disclaimer { font-size:12px; color:var(--fg-3); line-height:1.6; max-width:620px; margin:0 auto 14px; }
      .footer-copyright { font-size:12px; color:var(--fg-3); margin:4px 0; }
      .footer-affiliate { font-style:italic; }

      @media (prefers-reduced-motion:reduce){ .animate-on-scroll { opacity:1; transform:none; transition:none; } }
    `;
  }
  // ── Event Delegation ──────────────────────────────────────────────────

  _setupEventDelegation() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const shadow = this.shadowRoot;

    shadow.addEventListener('click', (e) => {
      // Category jump-nav → scroll to that category block
      const jump = e.target.closest('[data-jump]');
      if (jump) {
        const target = shadow.getElementById(jump.dataset.jump);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      // Factor card toggle (skip source/affiliate link clicks)
      if (e.target.closest('[data-action="source-link"]') || e.target.closest('[data-action="affiliate"]')) return;
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
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0.01 });
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
