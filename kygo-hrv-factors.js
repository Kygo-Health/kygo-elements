/**
 * Kygo Health — HRV Factor Explorer
 * Tag: kygo-hrv-factors
 * Interactive tool exploring 44 research-backed factors that affect Heart Rate Variability across 5 categories
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

class KygoHrvFactors extends HTMLElement {
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
    __seo(this, 'HRV Factor Explorer by Kygo Health. Explore 44 research-backed factors that affect Heart Rate Variability across 5 categories: Supplements, Lifestyle, Exercise, Micronutrients, and Demographics. Supplements include Ashwagandha Witholytin (RCT n=111), Ashwagandha Zenroot (RCT n=90), Probiotics, Polyphenols, Multivitamin, GABA (RCT n=30), L-Theanine, and Beetroot Juice (meta-analysis n=54). Lifestyle factors include Sleep Quality, Slow Breathing at 6 breaths per minute, Cold Exposure with 54-85% RMSSD increase, Meditation, HRV Biofeedback, Forest Bathing, Intermittent Fasting 16:8, Mediterranean Diet, Alcohol dose-dependent decrease, Smoking, THC Cannabis nocturnal decrease, Caffeine recovery delay, Chronic Stress, Sauna, Sexual Activity correlational, Altitude acute negative above 2500m, Caloric Restriction HRV 20 years younger, and Dehydration. Exercise modalities ranked by Yang et al 2024 Network Meta-Analysis of 29 RCTs: HIIT is number 1 for SDNN RMSSD and LF/HF ratio, Aerobic Endurance training, Resistance Training number 1 for HF power, Combined training, Yoga Mind-Body, and Overtraining risk. Micronutrients include Vitamin B12, Vitamin D, Magnesium, Omega-3 EPA DHA most studied dietary HRV factor, and Zinc. Demographics include Age strongest predictor, Sex and Gender, Genetics inconclusive, Circadian Rhythm, BMI Obesity, and Menstrual Cycle luteal phase HRV dip. Each factor shows evidence strength (Strong Moderate Emerging), direction of effect (Positive Negative Mixed), mechanism of action, dosage when applicable, and peer-reviewed citations. How to improve HRV naturally. What affects HRV. Best supplements for HRV. Data sourced from peer-reviewed studies and meta-analyses.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Categories ──────────────────────────────────────────────────────

  get _categories() {
    return {
      lifestyle: { name: 'Lifestyle', icon: 'sun', count: 18 },
      supplements: { name: 'Supplements', icon: 'pill', count: 8 },
      exercise: { name: 'Exercise', icon: 'dumbbell', count: 6 },
      micronutrients: { name: 'Micronutrients', icon: 'droplet', count: 5 },
      demographics: { name: 'Demographics', icon: 'users', count: 6 }
    };
  }

  // ── Factor Data ─────────────────────────────────────────────────────

  get _factors() {
    return {
      supplements: [
        {
          key: 'ashwa-witholytin', name: 'Ashwagandha (Witholytin)',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (RMSSD)',
          keyFinding: 'Strong — RCT, n=111, 12 weeks',
          whatThisMeans: "Didn't boost HRV itself but stopped it from dropping like placebo did. Also cut fatigue nearly in half.",
          mechanism: 'Adaptogenic withanolides modulate cortisol and reduce sympathetic overdrive, preserving vagal tone under stress.',
          dosage: '200 mg twice daily (Witholytin extract)',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10647917/', label: 'PMC10647917' },
          affiliate: { url: 'https://amzn.to/403ZgOP', label: 'Ashwagandha Extract' }
        },
        {
          key: 'ashwa-zenroot', name: 'Ashwagandha (Zenroot)',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (transient)',
          keyFinding: 'Moderate — RCT, n=90, 84 days',
          whatThisMeans: 'Quick early bump in HRV that faded. Stress and anxiety kept improving though, so still useful for mood.',
          mechanism: 'Initial vagal stimulation via cortisol reduction; tolerance may develop for HRV-specific effects.',
          dosage: '500 mg daily (Zenroot KSM-66 extract)',
          source: { url: 'https://link.springer.com/article/10.1007/s12325-025-03327-z', label: 'Springer 2025' },
          affiliate: { url: 'https://amzn.to/4qYXjOD', label: 'KSM-66 Ashwagandha' }
        },
        {
          key: 'probiotics', name: 'Probiotics',
          direction: 'positive', evidence: 'emerging',
          effect: 'Positive (emerging)',
          keyFinding: 'Moderate — emerging data',
          whatThisMeans: 'Your gut talks to your brain via the vagus nerve. Specific strains (L. paracasei LPC-37, L. rhamnosus HN001, L. acidophilus NCFM, B. lactis HN019) reduced inflammation markers that correlated with better HRV in hypertensive women. Higher gut microbial diversity is also associated with higher SDNN.',
          mechanism: 'Probiotic-driven colonization produces SCFAs (butyrate, acetate, propionate) that reduce inflammation and engage the vagus nerve. Higher gut microbial diversity associated with higher SDNN.',
          dosage: 'Multi-strain, CFU counts vary by product',
          source: { url: 'https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2025.1502562/full', label: 'Frontiers Neurosci 2025' },
          affiliate: { url: 'https://amzn.to/40AsqFp', label: 'Multi-Strain Probiotic' }
        },
        {
          key: 'polyphenols', name: 'Polyphenols',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (HF power)',
          keyFinding: 'Moderate — mechanistic + limited',
          whatThisMeans: 'Colorful plant compounds (berries, dark chocolate, green tea) fight inflammation, which helps your nervous system relax.',
          mechanism: 'Antioxidant and anti-inflammatory effects reduce oxidative stress on cardiac autonomic neurons.',
          dosage: 'Dietary sources preferred; supplements vary widely',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5882295/', label: 'PMC5882295' }
        },
        {
          key: 'multivitamin', name: 'Multivitamin',
          direction: 'positive', evidence: 'moderate',
          effect: 'Protective (prevents decline)',
          keyFinding: 'Moderate/Weak — 1 RCT',
          whatThisMeans: 'Like Ashwagandha Witholytin, it protected HRV from declining rather than actively raising it. Evidence is from a single RCT on hemodialysis patients, not healthy adults, so take it with a grain of salt.',
          mechanism: 'Corrects subclinical micronutrient deficiencies that impair autonomic nerve function.',
          dosage: 'Standard daily multivitamin',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7231600/', label: 'PMC7231600' },
          affiliate: { url: 'https://amzn.to/4rM2eDY', label: 'Daily Multivitamin' }
        },
        {
          key: 'gaba', name: 'GABA',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (parasympathetic)',
          keyFinding: 'Moderate — RCT, n=30, 90 days',
          whatThisMeans: "The brain's main 'calm down' chemical. Supplementing shifted the nervous system toward rest-and-recover mode.",
          mechanism: 'GABAergic inhibition of central sympathetic outflow shifts autonomic balance toward parasympathetic dominance.',
          dosage: '100–200 mg daily',
          source: { url: 'https://www.tandfonline.com/doi/full/10.1080/19390211.2024.2308262', label: 'Taylor & Francis 2024' },
          affiliate: { url: 'https://amzn.to/3OyDz7c', label: 'GABA Supplement' }
        },
        {
          key: 'l-theanine', name: 'L-Theanine',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (attenuates sympathetic)',
          keyFinding: 'Moderate — multiple studies',
          whatThisMeans: 'The calming amino acid in green tea. Lowers cortisol and takes the edge off your fight-or-flight response.',
          mechanism: 'Crosses blood-brain barrier, increases alpha waves and GABA, reduces cortisol and sympathetic activation.',
          dosage: '200 mg daily',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/16930802/', label: 'PubMed 16930802' },
          affiliate: { url: 'https://amzn.to/3OEoHEh', label: 'L-Theanine 200mg' }
        },
        {
          key: 'beetroot', name: 'Beetroot Juice',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (post-exercise)',
          keyFinding: 'Moderate — meta-analysis, n=54',
          whatThisMeans: 'Nitrates boost nitric oxide, helping your body recover faster after workouts. Main benefit is quicker HRV bounce-back.',
          mechanism: 'Dietary nitrate → nitric oxide pathway enhances vascular function and parasympathetic reactivation post-exercise.',
          dosage: '~400 mg nitrate (70 mL concentrated juice)',
          source: { url: 'https://www.mdpi.com/2227-9032/13/19/2496', label: 'Healthcare 2025' },
          affiliate: { url: 'https://amzn.to/406okEX', label: 'Beetroot Juice Shots' }
        }
      ],
      lifestyle: [
        {
          key: 'sleep', name: 'Sleep Quality',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (strong)',
          keyFinding: 'Top predictor of nocturnal HRV',
          whatThisMeans: 'Nothing moves the needle more than consistent, quality sleep. Bad sleep = bad HRV, almost guaranteed.',
          mechanism: 'Nocturnal parasympathetic dominance requires uninterrupted sleep architecture. Fragmented sleep elevates sympathetic tone.',
          dosage: '7–9 hours, consistent schedule',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/', label: 'PMC11333334' }
        },
        {
          key: 'slow-breathing', name: 'Slow Breathing (6/min)',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (strong)',
          keyFinding: 'SDNN improved after 4 weeks (RCT)',
          whatThisMeans: "Breathing at 6 breaths per minute hits your body's 'resonance frequency' and maximizes HRV. 20 min/day works.",
          mechanism: 'Respiratory sinus arrhythmia at ~0.1 Hz resonance frequency maximizes baroreflex sensitivity and vagal output.',
          dosage: '20 minutes daily at 6 breaths/min',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8924557/', label: 'PMC8924557' },
          affiliate: { url: 'https://amzn.to/46scAQQ', label: 'Breathing Trainer' }
        },
        {
          key: 'cold-exposure', name: 'Cold Exposure',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (acute)',
          keyFinding: 'RMSSD +54–85% post-session',
          whatThisMeans: "Cold shocks your vagus nerve awake. The +54-85% RMSSD spike is real but fades in 15-20 minutes and doesn't shift baseline HRV with chronic use alone. Best used as a recovery tool between training days, not a standalone HRV builder.",
          mechanism: 'Cold-water face immersion triggers the diving reflex — strong vagal activation via trigeminal nerve afferents.',
          dosage: 'Cold shower or ice bath, 1–5 minutes; best as recovery tool',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3749989/', label: 'PMC3749989' },
          affiliate: { url: 'https://amzn.to/4aYRATe', label: 'Cold Plunge Tub' }
        },
        {
          key: 'meditation', name: 'Meditation',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive',
          keyFinding: 'LF & HF both increased (p<0.05)',
          whatThisMeans: 'Even 20 minutes of non-focused meditation shifts your nervous system toward calm. No special technique needed.',
          mechanism: 'Reduces cortisol, shifts autonomic balance toward parasympathetic via prefrontal-amygdala regulation.',
          dosage: '20+ minutes daily',
          source: { url: 'https://academic.oup.com/eurjpc/article/19/4/773/5928142', label: 'Nesvold 2012' },
          affiliate: { url: 'https://amzn.to/4tZ5Zr2', label: 'Meditation Cushion' }
        },
        {
          key: 'hrv-biofeedback', name: 'HRV Biofeedback',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (mild–moderate)',
          keyFinding: 'Effect sizes across RCTs',
          whatThisMeans: 'Using real-time HRV data to train yourself to control your nervous system. Works for stress, anxiety, and sports.',
          mechanism: 'Operant conditioning of baroreflex sensitivity through paced breathing at resonance frequency with visual feedback.',
          dosage: '10–20 minute sessions, several times per week',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10412682/', label: 'PMC10412682' }
        },
        {
          key: 'forest-bathing', name: 'Forest Bathing',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive',
          keyFinding: 'HF higher in forest vs city (n=280+)',
          whatThisMeans: "Being in nature measurably calms your nervous system. Not just 'feeling relaxed' — it shows up in the data.",
          mechanism: 'Phytoncides (tree terpenes) and reduced sensory stressors lower cortisol and sympathetic activation.',
          dosage: '2+ hours in forested environment',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/19568835/', label: 'PubMed 19568835' }
        },
        {
          key: 'intermittent-fasting', name: 'Intermittent Fasting',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (moderate)',
          keyFinding: 'RMSSD 35 to 45ms in 8 weeks',
          whatThisMeans: "16:8 fasting improved HRV over 8 weeks. But don't overdo it — fasts over 48 hours actually hurt HRV.",
          mechanism: 'Fasting-induced autophagy and reduced inflammatory load improve vagal tone. Extended fasting reverses effect via stress.',
          dosage: '16:8 protocol (16 hours fasting, 8 hours eating)',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10045415/', label: 'PMC10045415' }
        },
        {
          key: 'mediterranean-diet', name: 'Mediterranean Diet',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive',
          keyFinding: 'Higher HRV in observational studies',
          whatThisMeans: 'Anti-inflammatory foods (fish, olive oil, veggies) support a calmer nervous system. High-sugar diets do the opposite.',
          mechanism: 'Anti-inflammatory dietary pattern reduces systemic inflammation and oxidative stress on autonomic neurons.',
          dosage: 'Daily dietary pattern',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5882295/', label: 'PMC5882295' }
        },
        {
          key: 'alcohol', name: 'Alcohol',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (dose-dependent)',
          keyFinding: 'RMSSD: −2 to −13ms per dose level',
          whatThisMeans: 'Even 1 drink hurts HRV. 3+ drinks tanks your recovery score. Being young and fit does NOT protect you.',
          mechanism: 'Ethanol suppresses vagal tone and activates sympathetic nervous system in dose-dependent fashion.',
          dosage: 'Any amount reduces HRV; 3+ drinks severe',
          source: { url: 'https://mental.jmir.org/2018/1/e23', label: 'JMIR 2018' }
        },
        {
          key: 'smoking', name: 'Smoking',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (dose-dependent)',
          keyFinding: 'Active & passive both reduce HRV',
          whatThisMeans: 'Damages vagal tone directly. Even secondhand smoke measurably lowers HRV. Quitting helps it recover.',
          mechanism: 'Nicotine activates sympathetic ganglia; smoke particulates cause systemic inflammation damaging vagal nerve fibers.',
          dosage: 'Any exposure, including secondhand',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/', label: 'PMC11333334' }
        },
        {
          key: 'thc', name: 'THC / Cannabis',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (nocturnal)',
          keyFinding: 'Nocturnal RMSSD down 15–22%',
          whatThisMeans: 'Suppresses your rest-and-digest system overnight. Your sleep HRV takes a clear hit the night you use it.',
          mechanism: 'CB1 receptor activation suppresses parasympathetic outflow during sleep, reducing nocturnal vagal tone.',
          dosage: 'Effect observed with evening use',
          source: { url: 'https://academic.oup.com/sleep/article/46/Supplement_1/A59/7181640', label: 'SLEEP 2023' }
        },
        {
          key: 'caffeine', name: 'Caffeine',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (recovery)',
          keyFinding: 'Delays post-exercise HRV recovery',
          whatThisMeans: 'No real effect at rest, but slows down how fast your HRV bounces back after a workout.',
          mechanism: 'Adenosine receptor antagonism prolongs sympathetic activation during post-exercise recovery window.',
          dosage: 'Moderate intake (~200 mg); timing matters most',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/', label: 'PMC11284693' }
        },
        {
          key: 'chronic-stress', name: 'Chronic Stress',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative',
          keyFinding: 'Sympathetic dominance',
          whatThisMeans: "Keeps your fight-or-flight system stuck 'on.' One of the most common reasons people have persistently low HRV.",
          mechanism: 'HPA axis dysregulation with sustained cortisol elevation suppresses vagal tone and shifts autonomic balance.',
          dosage: 'Cumulative exposure; management is key',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/', label: 'PMC11333334' }
        },
        {
          key: 'sauna', name: 'Sauna',
          direction: 'mixed', evidence: 'moderate',
          effect: 'Mixed',
          keyFinding: 'Acute decrease; chronic no benefit',
          whatThisMeans: "HRV dips during the heat, spikes during cooldown. But regular sauna doesn't improve HRV beyond what exercise alone does.",
          mechanism: 'Acute heat stress activates sympathetic response. Post-cooling parasympathetic rebound. Chronic adaptation unclear.',
          dosage: '15–20 min sessions, 80–100°C',
          source: { url: 'https://physoc.onlinelibrary.wiley.com/doi/full/10.14814/phy2.70449', label: 'Physiol Reports 2025' }
        },
        {
          key: 'sexual-activity', name: 'Sexual Activity',
          direction: 'positive', evidence: 'emerging',
          effect: 'Positive (correlational)',
          keyFinding: 'Associated with higher resting HRV (n=120)',
          whatThisMeans: "Associated with higher resting HRV but causation is unclear. Healthier people may simply have more sex. Interesting signal but don't read too much into it yet.",
          mechanism: 'Possible oxytocin-mediated vagal activation and stress reduction. Confounded by overall health status.',
          dosage: 'Observational — no dosage established',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/12659241/', label: 'Brody & Preut 2003' }
        },
        {
          key: 'altitude', name: 'Altitude',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (acute)',
          keyFinding: 'Sympathetic spike, HF drops above ~2,500m (meta-analysis)',
          whatThisMeans: "Thinner air forces your body into fight-or-flight mode to keep oxygen flowing. HRV recovers when you come back to lower elevation. Don't panic about low readings at altitude — it's expected.",
          mechanism: 'Hypoxia-driven sympathetic activation and reduced parasympathetic (HF) power. Chemoreceptor-mediated response to lower O₂ partial pressure.',
          dosage: 'Effect begins above ~2,500m; reversible on descent',
          source: { url: 'https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1502562/full', label: 'Frontiers Physiol 2025' }
        },
        {
          key: 'caloric-restriction', name: 'Caloric Restriction',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive',
          keyFinding: 'CR practitioners had HRV 20 years younger than age-matched controls (n=42)',
          whatThisMeans: "Eating ~30% below caloric needs while staying nutritionally complete helps your autonomic nervous system stay younger. Mechanism is reduced inflammation and improved insulin sensitivity (hormesis). Not the same as starvation — a meta-analysis found moderate CR doesn't raise cortisol, only fasting/starvation does. Combined with exercise the effect is even stronger.",
          mechanism: 'Reduced inflammation and improved insulin sensitivity via hormesis. Caloric restriction without malnutrition preserves vagal tone and autonomic flexibility.',
          dosage: '~25-30% caloric reduction while maintaining full nutrition',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3598611/', label: 'PMC3598611' }
        },
        {
          key: 'dehydration', name: 'Dehydration',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative',
          keyFinding: 'HR +5-6 bpm, reduced parasympathetic activity; restores with rehydration',
          whatThisMeans: "Being dehydrated shifts your nervous system toward stress mode. Replacing ≥60% of fluid lost restores HRV within 24 hours. Simple but easy to overlook.",
          mechanism: 'Hypovolemia reduces venous return, triggering compensatory sympathetic activation and reduced parasympathetic outflow.',
          dosage: 'Maintain hydration; replace ≥60% of fluid lost',
          source: { url: 'https://www.nature.com/articles/s41598-019-51255-2', label: 'Nature Sci Rep 2019' }
        }
      ],
      exercise: [
        {
          key: 'hiit', name: 'HIIT',
          direction: 'positive', evidence: 'strong',
          effect: 'Strongest overall',
          keyFinding: '#1 for SDNN, RMSSD, LF/HF (NMA)',
          whatThisMeans: "The single best exercise type for improving HRV across every metric. Even better than steady-state cardio. Effects are chronic adaptation over weeks. Expect a 24-48hr HRV dip after each session where RMSSD can drop significantly before rebounding above baseline. Don't misread the next-morning dip as negative adaptation.",
          mechanism: 'High-intensity intervals drive large cardiac output demands, stimulating vagal remodeling during recovery.',
          dosage: '2–3 sessions per week, with adequate recovery',
          source: { url: 'https://www.imrpress.com/journal/RCM/25/1/10.31083/j.rcm2501009', label: 'Yang et al. 2024' }
        },
        {
          key: 'aerobic', name: 'Aerobic / Endurance',
          direction: 'positive', evidence: 'strong',
          effect: 'Strong positive',
          keyFinding: 'RMSSD SMD=0.84 (16 RCTs)',
          whatThisMeans: 'Classic cardio works great too. 150+ min/week of moderate effort for 8+ weeks shows clear improvements.',
          mechanism: 'Sustained aerobic demand upregulates cardiac vagal tone and improves baroreflex sensitivity.',
          dosage: '150+ min/week moderate intensity, 8+ weeks',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11250637/', label: 'PMC11250637' }
        },
        {
          key: 'resistance', name: 'Resistance Training',
          direction: 'positive', evidence: 'moderate',
          effect: 'Moderate positive',
          keyFinding: '#1 for HF power (NMA)',
          whatThisMeans: 'Lifting weights helps HRV, especially the parasympathetic side. Not as strong as cardio overall but still beneficial.',
          mechanism: 'Post-exercise parasympathetic reactivation and chronic reductions in resting sympathetic tone.',
          dosage: '2–3 sessions per week, progressive overload',
          source: { url: 'https://www.imrpress.com/journal/RCM/25/1/10.31083/j.rcm2501009', label: 'Yang et al. 2024' }
        },
        {
          key: 'combined', name: 'Combined (Aero + RT)',
          direction: 'positive', evidence: 'strong',
          effect: 'Strong positive',
          keyFinding: '#1 for LF power (NMA)',
          whatThisMeans: 'Doing both cardio and weights gives complementary benefits. Best of both worlds for overall autonomic health.',
          mechanism: 'Synergistic cardiovascular and neuromuscular adaptations optimize autonomic balance across frequency domains.',
          dosage: 'Mix of cardio and strength, 3–5 days/week',
          source: { url: 'https://www.imrpress.com/journal/RCM/25/1/10.31083/j.rcm2501009', label: 'Yang et al. 2024' }
        },
        {
          key: 'yoga', name: 'Yoga / Mind-Body',
          direction: 'mixed', evidence: 'emerging',
          effect: 'Mixed',
          keyFinding: 'Inconsistent results',
          whatThisMeans: 'Results are all over the place. The breathing component probably drives whatever benefit there is, not the poses.',
          mechanism: 'Pranayama (breathing) component may drive effects via respiratory sinus arrhythmia; asana effects less clear.',
          dosage: 'Regular practice; breathing-focused styles preferred',
          source: { url: 'https://www.frontiersin.org/journals/cardiovascular-medicine/articles/10.3389/fcvm.2025.1364905/full', label: 'Frontiers CV 2025' }
        },
        {
          key: 'overtraining', name: 'Overtraining',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative',
          keyFinding: 'HRV declines signal overreaching',
          whatThisMeans: "If your HRV is trending down despite training, you're doing too much. Use a 7-day rolling average, not single-day readings. A single low day is noise. 3+ consecutive days below your personal baseline by 8-10% is the real signal. Based on Plews et al. coefficient of variation approach.",
          mechanism: 'Excessive training load without recovery causes chronic sympathetic activation and vagal withdrawal.',
          dosage: 'Monitor 7-day rolling HRV average to avoid',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11204851/', label: 'PMC11204851' }
        }
      ],
      micronutrients: [
        {
          key: 'b12', name: 'Vitamin B12',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (when deficient)',
          keyFinding: 'Deficiency reduces LF power',
          whatThisMeans: 'Your nerves need B12 to work properly. Low B12 can quietly wreck your autonomic function before you notice anything else.',
          mechanism: 'Essential cofactor for myelin synthesis and nerve conduction. Deficiency causes demyelination of autonomic fibers.',
          dosage: 'Correct deficiency; RDA 2.4 mcg',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7231600/', label: 'PMC7231600' },
          affiliate: { url: 'https://amzn.to/4lbwIg3', label: 'Vitamin B12' }
        },
        {
          key: 'vitamin-d', name: 'Vitamin D',
          direction: 'positive', evidence: 'moderate',
          effect: 'Positive (when deficient)',
          keyFinding: '8 studies link to reduced HRV',
          whatThisMeans: 'Your heart literally has vitamin D receptors. Being deficient is linked to worse HRV and cardiovascular outcomes.',
          mechanism: 'VDR expression on cardiomyocytes and autonomic neurons; deficiency increases inflammatory cytokines.',
          dosage: 'Correct deficiency; target 30–50 ng/mL',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7231600/', label: 'PMC7231600' },
          affiliate: { url: 'https://amzn.to/4cm6d5m', label: 'Vitamin D3' }
        },
        {
          key: 'magnesium', name: 'Magnesium',
          direction: 'mixed', evidence: 'emerging',
          effect: 'Mixed / Positive',
          keyFinding: '1 RCT showed increase (n=36)',
          whatThisMeans: "Helps stabilize your heart's electrical activity. Results are inconsistent, likely because dose, form, and duration vary so much.",
          mechanism: 'Natural calcium channel blocker; stabilizes cardiac membrane potential and modulates NMDA receptors.',
          dosage: '200–400 mg elemental Mg daily',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7231600/', label: 'PMC7231600' },
          affiliate: { url: 'https://amzn.to/3Nbjq6C', label: 'Magnesium Glycinate' }
        },
        {
          key: 'omega3', name: 'Omega-3 (EPA/DHA)',
          direction: 'positive', evidence: 'strong',
          effect: 'Positive (HF power)',
          keyFinding: 'Most studied dietary HRV factor',
          whatThisMeans: 'The best-researched nutrient for HRV. Fish oil consistently boosts parasympathetic power in meta-analyses.',
          mechanism: 'Membrane incorporation alters ion channel kinetics; anti-inflammatory effects via resolvin/protectin pathways.',
          dosage: '1–2 g EPA+DHA daily',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5882295/', label: 'PMC5882295' },
          affiliate: { url: 'https://amzn.to/4cVnvGt', label: 'Omega-3 Fish Oil' }
        },
        {
          key: 'zinc', name: 'Zinc',
          direction: 'positive', evidence: 'emerging',
          effect: 'Positive (prenatal)',
          keyFinding: 'Improved offspring HRV',
          whatThisMeans: "Interesting but niche — zinc during pregnancy improved the baby's HRV for years. Limited adult data so far.",
          mechanism: 'Zinc-dependent enzymes in autonomic neurodevelopment; prenatal supplementation affects fetal ANS maturation.',
          dosage: 'RDA 8–11 mg; prenatal context',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7231600/', label: 'PMC7231600' },
          affiliate: { url: 'https://amzn.to/4760BIN', label: 'Zinc Picolinate' }
        }
      ],
      demographics: [
        {
          key: 'age', name: 'Age',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative (decline)',
          keyFinding: 'Strongest predictor overall',
          whatThisMeans: 'Nothing affects HRV more than age. But fit older people can have higher HRV than sedentary younger ones.',
          mechanism: 'Progressive loss of sinoatrial node pacemaker cells and reduced vagal nerve fiber density with aging.',
          dosage: 'Non-modifiable; lifestyle can offset',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/', label: 'PMC11333334' }
        },
        {
          key: 'sex', name: 'Sex / Gender',
          direction: 'variable', evidence: 'strong',
          effect: 'Variable',
          keyFinding: 'Women generally higher HF',
          whatThisMeans: 'Women tend to have stronger parasympathetic tone, at least until menopause. Differences narrow with age.',
          mechanism: 'Estrogen enhances vagal tone; testosterone promotes sympathetic activity. Menopause reduces HF power.',
          dosage: 'Non-modifiable',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/', label: 'PMC11333334' }
        },
        {
          key: 'genetics', name: 'Genetics',
          direction: 'variable', evidence: 'emerging',
          effect: 'Inconclusive',
          keyFinding: 'Twin studies yes; gene studies no (n=6,740)',
          whatThisMeans: "Your genes probably matter, but researchers haven't pinpointed which ones. Don't blame genetics — lifestyle still dominates.",
          mechanism: 'Twin studies show heritability ~40–50%, but GWAS (n=6,740) found no significant loci. Polygenic effects likely.',
          dosage: 'Non-modifiable; lifestyle dominates',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/', label: 'PMC11333334' }
        },
        {
          key: 'circadian', name: 'Circadian Rhythm',
          direction: 'variable', evidence: 'strong',
          effect: 'Variable',
          keyFinding: 'HRV rises at night, drops AM',
          whatThisMeans: 'Your HRV naturally peaks overnight and dips in the morning. This is why sleep-time measurement is the gold standard.',
          mechanism: 'Suprachiasmatic nucleus drives 24h autonomic oscillation: parasympathetic peak during sleep, sympathetic peak at waking.',
          dosage: 'Measure HRV during sleep for consistency',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/', label: 'PMC11333334' }
        },
        {
          key: 'bmi', name: 'BMI / Obesity',
          direction: 'negative', evidence: 'strong',
          effect: 'Negative',
          keyFinding: 'Higher BMI = lower HRV',
          whatThisMeans: 'Excess body fat suppresses HRV. One study showed weight loss restored HRV by the equivalent of 20 years of aging.',
          mechanism: 'Adipose-derived inflammatory cytokines impair vagal function; visceral fat particularly harmful via mechanical and hormonal effects.',
          dosage: 'Maintain healthy BMI; weight loss improves HRV',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5882295/', label: 'PMC5882295' }
        },
        {
          key: 'menstrual-cycle', name: 'Menstrual Cycle',
          direction: 'negative', evidence: 'moderate',
          effect: 'Negative (luteal phase)',
          keyFinding: 'HRV lowest ~1 week before period; progesterone suppresses vagal activity',
          whatThisMeans: "Progesterone rises after ovulation and directly lowers HRV. Expect lowest readings about a week before your period — it's hormonal, not something you're doing wrong. Rebounds about a week after menses.",
          mechanism: 'Progesterone suppresses vagal tone during the luteal phase. Estrogen in the follicular phase supports parasympathetic activity. Creates a predictable ~28-day HRV cycle.',
          dosage: 'Non-modifiable; track cycle to contextualize HRV',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7141121/', label: 'PMC7141121' }
        }
      ]
    };
  }

  // ── Top Picks ───────────────────────────────────────────────────────

  get _topPicks() {
    return [
      { icon: 'trophy', label: 'Best Single Habit', answer: 'Sleep Quality', note: 'Top predictor of nocturnal HRV — nothing else comes close', stat: '#1 predictor', category: 'Lifestyle' },
      { icon: 'dumbbell', label: 'Best Exercise', answer: 'HIIT', note: '#1 across SDNN, RMSSD, and LF/HF in network meta-analysis of 29 RCTs', stat: 'NMA, 29 RCTs', category: 'Exercise' },
      { icon: 'pill', label: 'Best Supplement', answer: 'Ashwagandha (Witholytin)', note: 'Strongest evidence — RCT, n=111, 12 weeks, preserved RMSSD', stat: 'RCT, n=111', category: 'Supplements' },
      { icon: 'droplet', label: 'Best Nutrient', answer: 'Omega-3 (EPA/DHA)', note: 'Most studied dietary HRV factor — consistent HF power improvements', stat: 'HF power ↑', category: 'Micronutrients' },
      { icon: 'wind', label: 'Quickest Impact', answer: 'Slow Breathing (6/min)', note: 'Resonance frequency breathing maximizes HRV within minutes', stat: 'SDNN improved in 4 wks', category: 'Lifestyle' },
      { icon: 'alert', label: 'Biggest HRV Killer', answer: 'Alcohol', note: 'RMSSD drops −2 to −13ms per dose — fitness doesn\'t protect you', stat: 'RMSSD −2 to −13ms', category: 'Lifestyle', warning: true }
    ];
  }

  // ── Icons ───────────────────────────────────────────────────────────

  _icon(name) {
    const icons = {
      sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
      pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 1.5 3 3L5.3 12.7a4.24 4.24 0 0 1-6-6L7.5 4.5l3-3z"/><path d="m9 9 6.4-6.4a4.24 4.24 0 0 1 6 6L15 15"/><line x1="14.5" y1="13.5" x2="10.5" y2="9.5"/></svg>',
      dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',
      droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>',
      users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
      wind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>',
      alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>',
      arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>',
      arrowLeftRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
      book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>'
    };
    return icons[name] || icons.heart;
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
              ${f.affiliate ? `<a href="${f.affiliate.url}" class="factor-affiliate" target="_blank" rel="noopener sponsored">
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

  _renderSources() {
    const groups = {
      'Supplements': [
        { label: 'Lopresti et al. 2024 — Ashwagandha Witholytin RCT', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10647917/' },
        { label: 'Thakkar et al. 2025 — Ashwagandha Zenroot RCT', url: 'https://link.springer.com/article/10.1007/s12325-025-03327-z' },
        { label: 'Maia et al. 2025 — Probiotics & HRV in hypertensive women', url: 'https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2025.1502562/full' },
        { label: 'Badawy et al. 2024 — GABA supplementation RCT', url: 'https://www.tandfonline.com/doi/full/10.1080/19390211.2024.2308262' },
        { label: 'Kimura et al. 2007 — L-Theanine & stress', url: 'https://pubmed.ncbi.nlm.nih.gov/16930802/' },
        { label: 'Amiri et al. 2025 — Beetroot juice meta-analysis', url: 'https://www.mdpi.com/2227-9032/13/19/2496' }
      ],
      'Lifestyle': [
        { label: 'Nunan et al. 2024 — Lifestyle determinants of HRV', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/' },
        { label: 'Laborde et al. 2022 — Slow breathing & HRV', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8924557/' },
        { label: 'Mäkinen et al. 2008 — Cold exposure & HRV', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3749989/' },
        { label: 'Nesvold et al. 2012 — Meditation & HRV', url: 'https://academic.oup.com/eurjpc/article/19/4/773/5928142' },
        { label: 'Lehrer & Gevirtz 2014 — HRV biofeedback review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10412682/' },
        { label: 'Park et al. 2010 — Forest bathing & HRV', url: 'https://pubmed.ncbi.nlm.nih.gov/19568835/' },
        { label: 'Moro et al. 2023 — Intermittent fasting & HRV', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10045415/' },
        { label: 'Pietilä et al. 2018 — Alcohol & HRV', url: 'https://mental.jmir.org/2018/1/e23' },
        { label: 'Conner et al. 2023 — THC & nocturnal HRV', url: 'https://academic.oup.com/sleep/article/46/Supplement_1/A59/7181640' },
        { label: 'Gonzalez et al. 2024 — Caffeine & HRV recovery', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/' },
        { label: 'Brunt et al. 2025 — Sauna & HRV', url: 'https://physoc.onlinelibrary.wiley.com/doi/full/10.14814/phy2.70449' },
        { label: 'Brody & Preut 2003 — Sexual activity & HRV', url: 'https://pubmed.ncbi.nlm.nih.gov/12659241/' },
        { label: 'Frontiers Physiol 2025 — Altitude & HRV meta-analysis', url: 'https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1502562/full' },
        { label: 'Stein et al. 2012 — Caloric restriction & HRV', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3598611/' },
        { label: 'Watso et al. 2019 — Dehydration & HRV', url: 'https://www.nature.com/articles/s41598-019-51255-2' }
      ],
      'Exercise': [
        { label: 'Yang et al. 2024 — Exercise NMA (29 RCTs)', url: 'https://www.imrpress.com/journal/RCM/25/1/10.31083/j.rcm2501009' },
        { label: 'Amekran et al. 2024 — Aerobic exercise meta-analysis', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11250637/' },
        { label: 'Fronczyk et al. 2025 — Yoga & HRV review', url: 'https://www.frontiersin.org/journals/cardiovascular-medicine/articles/10.3389/fcvm.2025.1364905/full' },
        { label: 'Bellenger et al. 2024 — Overtraining & HRV', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11204851/' }
      ],
      'Nutrition & Micronutrients': [
        { label: 'Young & Benton 2018 — Gut-brain axis & HRV review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5882295/' },
        { label: 'Lopresti 2020 — Micronutrients & HRV review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7231600/' }
      ],
      'Demographics': [
        { label: 'Nunan et al. 2024 — Lifestyle determinants of HRV', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/' },
        { label: 'Schmalenberger et al. 2019 — Menstrual cycle & HRV', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7141121/' }
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
            HRV Factors
          </a>
          <a href="https://kygo.app" class="header-link" target="_blank" rel="noopener">
            Get Kygo App ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge animate-on-scroll">44 FACTORS • 5 CATEGORIES • ALL PEER-REVIEWED</div>
          <h1 class="animate-on-scroll">What Actually Moves Your HRV?</h1>
          <p class="hero-sub animate-on-scroll">Every supplement, habit, exercise, and nutrient with proven HRV impact — ranked by evidence strength and direction of effect. No guessing, just data.</p>
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
            <a href="https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence" class="blog-link-card" target="_blank" rel="noopener">
              <span class="blog-link-icon"><img src="${logoUrl}" alt="Kygo" style="width:24px;height:24px;" /></span>
              <div class="blog-link-text">
                <span class="blog-link-title">Read the Full Article</span>
                <span class="blog-link-desc">How to Improve HRV: 44 Factors Ranked by Evidence (2026)</span>
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
              <h2>Track Your <span class="highlight">HRV Trends</span> Automatically</h2>
              <p>Kygo syncs with your wearable and food log to show which habits actually move your HRV — correlations personalized to your data.</p>
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
          <p class="footer-copyright">Data sourced from peer-reviewed studies and meta-analyses. Last updated February 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, I earn from qualifying purchases.</p>
          <p class="footer-copyright">© ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  // ── Styles ──────────────────────────────────────────────────────────

  _styles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

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
      .header-link { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #fff; background: var(--green); padding: 8px 16px; border-radius: 50px; text-decoration: none; transition: background 0.2s; }
      .header-link:hover { background: var(--green-dark); }
      .header-link svg { width: 14px; height: 14px; }

      /* ── Hero ── */
      .hero { padding: 48px 0 32px; text-align: center; }
      .hero-badge { display: inline-block; padding: 6px 16px; border-radius: 50px; background: var(--green-light); color: var(--green-dark); font-size: 12px; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 16px; }
      h1 { font-size: clamp(26px, 7vw, 42px); margin-bottom: 16px; color: var(--dark); }
      .hero-sub { font-size: 16px; color: var(--gray-600); max-width: 640px; margin: 0 auto; }

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


      /* ── Sources (accordion) ── */
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
      .blog-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; }
      .blog-cta-btn:hover { background: var(--green-dark); }
      .blog-cta-btn svg { width: 18px; height: 18px; }
      .blog-cta-buttons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
      .blog-cta-tags { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 20px; flex-wrap: wrap; }
      .blog-cta-tags span { color: var(--gray-400); font-size: 12px; }
      .blog-cta-tags img { height: 22px; width: auto; opacity: 0.7; }

      /* ── Android button (in Blog CTA) ── */
      .cta-android { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm, 10px); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; border: none; cursor: pointer; }
      .cta-android:hover { background: var(--green-dark); color: #fff; }
      .cta-android svg { width: 18px; height: 18px; }

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
      .footer-affiliate { font-style: italic; }

      /* ── Responsive ── */
      @media (min-width: 768px) {
        .header-inner { padding: 14px 24px; }
        .hero { padding: 64px 0 40px; }
        .hero-sub { font-size: 17px; }
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
      // Source group accordion
      const srcToggle = e.target.closest('.src-group-toggle');
      if (srcToggle) {
        const group = srcToggle.closest('.src-group');
        if (group) {
          const isOpen = group.classList.toggle('open');
          srcToggle.setAttribute('aria-expanded', isOpen);
        }
        return;
      }

      // Sort dropdown (handled via change event below)


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
    if (document.querySelector('script[data-kygo-hrv-factors-ld]')) return;
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'HRV Factor Explorer',
      'alternateName': 'Kygo HRV Improvement Factors Tool',
      'description': 'Explore 44 research-backed factors that affect Heart Rate Variability — supplements, lifestyle habits, exercise, micronutrients, and demographics ranked by evidence strength.',
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'url': 'https://www.kygo.app/tools/hrv-factors',
      'datePublished': '2026-02-15',
      'dateModified': '2026-03-18',
      'softwareVersion': '1.0',
      'inLanguage': 'en',
      'isAccessibleForFree': true,
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
      'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
      'featureList': 'Explore 44 HRV factors, 5 evidence categories, supplement and lifestyle comparison, peer-reviewed research citations, demographic impact analysis',
      'keywords': 'HRV factors, how to improve HRV, heart rate variability supplements, HRV lifestyle, best exercise for HRV, what affects HRV, increase HRV naturally, RMSSD, SDNN, vagal tone, autonomic nervous system, Ashwagandha HRV, Omega-3 HRV, HIIT HRV, sleep HRV, cold exposure HRV'
    };

    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is the fastest way to improve HRV?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Aerobic exercise is the single most evidence-backed way to improve HRV. Studies show regular moderate-intensity cardio (3-5x/week) can increase RMSSD by 10-20% within 8-12 weeks. Sleep quality and consistency are the second most impactful factor — poor sleep can reduce HRV by 30-50%.' }
        },
        {
          '@type': 'Question',
          'name': 'Which supplements improve HRV?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Omega-3 fatty acids (EPA/DHA) have the strongest evidence for HRV improvement, with multiple RCTs showing 10-15% RMSSD increases at 2g/day. Ashwagandha (300-600mg/day) shows moderate evidence for stress-related HRV improvement. Magnesium glycinate and probiotics have emerging but limited evidence.' }
        },
        {
          '@type': 'Question',
          'name': 'Does cold exposure improve HRV?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Cold water immersion (10-15°C for 2-5 minutes) acutely increases vagal tone and HRV. Regular cold exposure over 4+ weeks shows moderate evidence for sustained HRV improvements. However, cold exposure immediately after strength training may blunt adaptation. Best used on rest days or before bed.' }
        },
        {
          '@type': 'Question',
          'name': 'What lowers HRV the most?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Alcohol is the single biggest HRV suppressor — even 1-2 drinks can reduce HRV by 20-40% for 24-48 hours. Chronic stress, poor sleep (<6 hours), overtraining, and dehydration are the next most impactful factors. Age is the strongest non-modifiable factor, with HRV declining roughly 1-2 ms/year after age 25.' }
        },
        {
          '@type': 'Question',
          'name': 'What is a good HRV score?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'HRV is highly individual — a "good" score depends on age, fitness, and genetics. General RMSSD benchmarks: ages 20-30 average 40-80ms, ages 30-40 average 30-60ms, ages 40-50 average 20-45ms, ages 50+ average 15-35ms. Athletes often have RMSSD above 80ms. The trend over weeks matters more than any single reading.' }
        }
      ]
    };

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Kygo Health', 'item': 'https://www.kygo.app' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
        { '@type': 'ListItem', 'position': 3, 'name': 'HRV Factors', 'item': 'https://www.kygo.app/tools/hrv-factors' }
      ]
    };

    [ld, faq, breadcrumb].forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-kygo-hrv-factors-ld', '');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });
  }
}

if (!customElements.get('kygo-hrv-factors')) {
  customElements.define('kygo-hrv-factors', KygoHrvFactors);
}
