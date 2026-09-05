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
  // Flat source list for the standard sources module: the factor's category
  // becomes the card's tag and its study label becomes the citation line.
  get _sources() {
    const catLabel = {
      lifestyle: 'Lifestyle', supplements: 'Supplements', environment: 'Environment',
      stress: 'Stress', biology: 'Biology'
    };
    const out = [];
    for (const [catKey, factors] of Object.entries(this._factors)) {
      for (const f of factors) {
        if (f.source) out.push({ tag: catLabel[catKey] || catKey, title: f.name, cite: f.source.label, url: f.source.url });
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

  // Related tools · Kygo standard module ────────────────────────────────
  // Exactly 3 cards: a near neighbour, a bridge between accuracy and
  // physiology, and one from another family. Never links this page to
  // itself, and never links the Food Scanner.

  _relatedTools() {
    return [
      {
        title: 'REM Sleep Factor Explorer',
        blurb: '23 research-backed factors that raise or lower REM sleep, with mechanisms and doses.',
        url: 'https://www.kygo.app/tools/rem-sleep-factors',
        meta: 'Sleep · 23 factors',
        motif: { motif: 'hypno', stage: 'rem', caption: 'Sleep stages overnight' }
      },
      {
        title: 'Staying Asleep Factors',
        blurb: '27 research-backed factors that affect whether you stay asleep through the night.',
        url: 'https://www.kygo.app/tools/staying-asleep-factors',
        meta: 'Sleep · 27 factors',
        motif: { motif: 'ranked', caption: 'Factors ranked by evidence' }
      },
      {
        title: 'Most Accurate Sleep Tracker',
        blurb: 'Which wearable is most accurate for sleep vs a lab PSG? Compare 7 devices head to head.',
        url: 'https://www.kygo.app/tools/sleep-tracker-accuracy',
        meta: 'Wearables · 14 sources',
        motif: { motif: 'compare', caption: 'Sleep staging vs PSG', rows: [{ label: 'Oura', pct: 90 }, { label: 'Apple', pct: 78 }, { label: 'Fitbit', pct: 64 }, { label: 'Garmin', pct: 36 }] }
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
      { slug: 'how-to-increase-deep-sleep-factors-ranked',
        title: 'How to Increase Deep Sleep: 38 Factors Backed by Data',
        blurb: 'Deep sleep is the most restorative stage and most people get less than they should. 38 factors, 50+ studies, with doses.',
        cat: 'Sleep', min: 11, img: '273a63_5a16c04aa1b9489da2cc42da679e913a~mv2.png' },
      { slug: 'what-influences-rem-sleep-factors-ranked',
        title: 'What Influences REM Sleep? Factors Ranked by Evidence (2026)',
        blurb: 'REM is the most chemistry-sensitive stage of your night. What moves it, from alcohol to room temperature, ranked by evidence.',
        cat: 'Sleep', min: 10, img: '273a63_be7638af00034117a0366d56b59127ae~mv2.png' },
      { slug: 'why-is-my-sleep-score-low-when-i-slept-8-hours',
        title: 'Why Is My Sleep Score Low When I Slept 8 Hours?',
        blurb: 'Your tracker says eight hours and your score is still bad. Why duration is not quality, and what a food log reveals about the cause.',
        cat: 'Sleep', min: 8, img: '273a63_0a9880d341f34b9ea66d1df4c2164bd2~mv2.png' }
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
      slug: 'deep-sleep-factors',
      headline: `Track your <span>deep sleep</span> recovery.`,
      sub: `Stop guessing which of these applies to you. Kygo correlates your meals, caffeine and alcohol with YOUR sleep stages.`
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
      ['273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7', 'WHOOP', 'WHOOP'],
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
    return { source: 'tool-deep-sleep-factors', variant: 'factors' };
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
    const androidUrl = 'https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO';
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const appleImg = 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png';
    const fitbitImg = 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png';
    const garminImg = 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png';
    const googleHealthImg = 'https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png';
    const healthConnectImg = 'https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" loading="lazy" />
            <span>Kygo Health</span>
          </a>
          <div class="nav-cta-group">
            <a href="${iosUrl}" class="nav-store-btn nav-store-ios cta-primary" data-track-label="subnav-get-app-ios" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on the App Store">${this._icon('apple')}<span>iOS</span></a>
            <a href="${androidUrl}" class="nav-store-btn nav-store-android cta-android" data-action="android-download" data-track-label="subnav-get-app-android" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on Google Play">${this._icon('android')}<span>Android</span></a>
          </div>
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
      ${this._renderAppCta()}




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
      ${this._renderEmailCta()}


      ${this._renderRelatedTools('gray')}

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every claim, <span class="hl">traceable.</span></h2>
            <p class="lede">Each factor is anchored to a primary peer-reviewed source. Last updated March 2026.</p>
          </div>
          <div class="sources-wrap animate-on-scroll">${this._renderSources()}</div>
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

      ${this._renderRelatedPosts()}
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
      .nav-cta-group { margin-left:auto; display:inline-flex; align-items:center; gap:8px; }
      .nav-cta-group .nav-store-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border-radius:8px; font-weight:600; font-size:13px; text-decoration:none; white-space:nowrap; line-height:1; }
      .nav-cta-group .nav-store-btn svg { width:15px; height:15px; flex-shrink:0; }
      .nav-cta-group .nav-store-ios { background:var(--kygo-green); color:#fff; }
      .nav-cta-group .nav-store-ios:hover { background:var(--kygo-green-dark); color:#fff; }
      .nav-cta-group .nav-store-android { background:#fff; color:var(--kygo-green-dark); border:1.5px solid var(--border-subtle); }
      .nav-cta-group .nav-store-android:hover { border-color:var(--kygo-green); color:var(--kygo-green-dark); }
      @media (max-width:480px){ .nav-brand span { display:none; } }
      @media (max-width:360px){ .nav-cta-group .nav-store-btn span { display:none; } .nav-cta-group .nav-store-btn { padding:8px 10px; } }

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

      /* Sources */
      /* Sources · Kygo standard module */
      .sources { display: grid; grid-template-columns: 1fr; gap: 8px; }
      @media (min-width: 600px) { .sources { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 960px) { .sources { grid-template-columns: repeat(3, 1fr); } }
      .src { display: flex; flex-direction: column; gap: 4px; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 12px; padding: 12px 14px; text-decoration: none; transition: border-color .15s, box-shadow .15s; }
      a.src:hover { border-color: var(--kygo-green); box-shadow: 0 4px 14px rgba(15,23,42,.08); }
      .src--nolink { background: var(--bg-surface); border-style: dashed; }
      .src-tag { align-self: flex-start; font-family: var(--font-display); font-size: 9.5px; font-weight: 700; letter-spacing: .4px; text-transform: uppercase; color: var(--kygo-green-dark); }
      .src--nolink .src-tag { color: var(--fg-3); }
      .src-title { font-family: var(--font-display); font-weight: 600; font-size: 13.5px; color: var(--fg-1); line-height: 1.3; overflow-wrap: anywhere; }
      a.src:hover .src-title { color: var(--kygo-green-dark); }
      .src-cite { display: inline-flex; align-items: baseline; gap: 5px; flex-wrap: wrap; font-size: 11.5px; color: var(--fg-3); line-height: 1.35; overflow-wrap: anywhere; }
      .src-go { display: inline-flex; align-self: center; flex-shrink: 0; color: var(--kygo-green-dark); }
      .src-go svg { width: 12px; height: 12px; transition: transform .15s; }
      a.src:hover .src-go svg { transform: translate(1px,-1px); }
      .sources.src-extra { margin-top: 8px; }
      .sources.src-extra[hidden] { display: none; }
      .src-toggle-wrap { text-align: center; margin-top: 16px; }
      .src-toggle { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 999px; border: 1.5px solid var(--border-subtle); background: #fff; color: var(--kygo-green-dark); font-family: var(--font-display); font-weight: 600; font-size: 13px; cursor: pointer; transition: border-color .15s, box-shadow .15s; }
      .src-toggle:hover { border-color: var(--kygo-green); box-shadow: 0 4px 14px rgba(15,23,42,.08); }
      .src-toggle svg { width: 14px; height: 14px; transition: transform .2s; }
      .src-toggle.open svg { transform: rotate(90deg); }

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
      // Sources · show-all toggle
      if (e.target.closest('[data-src-toggle]')) { this._toggleSources(); return; }

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
