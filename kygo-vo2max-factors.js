/**
 * Kygo Health — VO2 Max Factor Explorer
 * Tag name: kygo-vo2max-factors
 * Interactive library of the factors that move VO2 max — training, nutrition,
 * environment, physiology, lifestyle, clinical — each with direction, evidence
 * grade, key finding, plain-English takeaway, optional dose/how-to, and an
 * anchored peer-reviewed source. Built from vo2research.md (sources #1–35, #48–52).
 */

/** Injects accessible text into light DOM so crawlers and AI tools can read component content */
if (typeof __seo === 'undefined') {
  var __seo = function (el, text) {
    if (el.querySelector('[data-seo]')) return;
    const d = document.createElement('div');
    d.setAttribute('data-seo', '');
    d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
    d.textContent = text;
    el.appendChild(d);
  };
}

class KygoVo2maxFactors extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._eventsBound = false;
    this._dir = new Set();
    this._evidence = new Set();
    this._query = '';
  }

  connectedCallback() {
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, this._seoText());
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Categories ──────────────────────────────────────────────────────────

  get _categories() {
    return [
      { key: 'exercise', label: 'Exercise', icon: 'activity' },
      { key: 'nutrition', label: 'Nutrition & Supplements', icon: 'pill' },
      { key: 'environment', label: 'Environment', icon: 'wind' },
      { key: 'demographics', label: 'Demographics & Physiology', icon: 'dna' },
      { key: 'lifestyle', label: 'Lifestyle', icon: 'moon' },
      { key: 'clinical', label: 'Clinical', icon: 'heart' }
    ];
  }

  _categoryLabel(key) {
    const c = this._categories.find(c => c.key === key);
    return c ? c.label : key;
  }

  // ── Factor data (vo2research.md category tables) ─────────────────────────

  get _factors() {
    return [
      // ── Exercise / Training ──
      { id: 'hiit-long', cat: 'exercise', name: 'HIIT — long interval, high volume', dir: 'positive', dirLabel: 'Raises — strongest', ev: 'strong',
        key: 'Meta of 53 RCTs. vs steady cardio (MICT), only long-interval (≥2 min), high-volume (≥15 min), 4–12 week HIIT beat MICT (SMD 0.65–1.07). Against no training, HIIT overall ran SMD 0.41–1.81, and this long-interval/high-volume subgroup 0.50–2.48.',
        plain: 'Hard intervals are the most effective way to raise VO2 max. The version that wins uses longer work bouts (2 min+) and enough total volume, run for at least a month.',
        dose: 'Work bouts ≥2 min · ≥15 min total interval volume · 4–12 weeks', src: 1, srcLabel: 'Wen et al. 2019' },
      { id: 'hiit-short', cat: 'exercise', name: 'HIIT — short interval, low volume', dir: 'positive', dirLabel: 'Raises', ev: 'strong',
        key: 'Even ≤30 s intervals, ≤5 min volume, ≤4 weeks beat no training (SMD 0.79–1.65), but did not clearly beat MICT.',
        plain: 'Short, time-efficient intervals still work well versus doing nothing. They are not clearly better than steady cardio though.',
        dose: null, src: 1, srcLabel: 'Wen et al. 2019' },
      { id: 'mict', cat: 'exercise', name: 'Moderate continuous cardio (MICT)', dir: 'positive', dirLabel: 'Raises', ev: 'strong',
        key: 'Reliable VO2 max gains across populations; only beaten by higher-volume HIIT.',
        plain: 'Steady-state cardio works. It is just not as time-efficient as well-structured intervals.',
        dose: null, src: 1, srcLabel: 'Wen et al. 2019' },
      { id: 'sit', cat: 'exercise', name: 'Sprint interval training (SIT)', dir: 'positive', dirLabel: 'Raises', ev: 'moderate-strong',
        key: 'Systematic review of 19 studies; 13 pooled for VO2 max: brief all-out sprints (e.g. repeated ~30 s efforts) over 2–8 weeks raised VO2 max versus control (Hedges’ g = 0.63, 95% CI 0.39–0.87), a +4.2 to +13.4% improvement in sedentary and recreationally active adults.',
        plain: 'Very short, very hard sprint sessions reliably raise VO2 max, even with little total work. Great low-time option, but they are genuinely unpleasant.',
        dose: 'Repeated ~30 s all-out efforts · 2–8 weeks', src: 26, srcLabel: 'Sloth et al. 2013' },
      { id: 'resistance', cat: 'exercise', name: 'Resistance training (alone)', dir: 'positive', dirLabel: 'Raises (modest, short programs)', ev: 'moderate',
        key: 'Meta-analysis in healthy adults over 60 (37 studies; 24 reported VO2 peak, 22 pooled): resistance training alone raised VO2 peak by 1.89 mL/kg/min (95% CI 1.21–2.57) in programs of 24 weeks or less. Beyond 24 weeks the pooled effect was null (−0.01).',
        plain: 'Lifting gives a modest VO2 max bump in healthy over-60s, and the pooled gain sits in the first six months. This review did not compare it head-to-head against cardio, so it cannot tell you which raises VO2 max more.',
        dose: 'Programs of ≤24 weeks · evidence is in healthy adults 60+', src: 27, srcLabel: 'Smart et al. 2022' },
      { id: 'detraining', cat: 'exercise', name: 'Detraining (stopping training)', dir: 'negative', dirLabel: 'Lowers', ev: 'strong',
        key: 'Meta of 21 athlete studies: VO2 max fell after short-term (≤30 days) cessation (ES −0.62, avg −3.93%) and roughly twice as much after long-term (>30 days) cessation (ES −1.42, avg −9.43%). Higher-trained athletes lost more only in the long-term analysis.',
        plain: 'Fitness is use-it-or-lose-it. A month off already costs around 4%, and longer layoffs cost more than twice that.',
        dose: 'Light activity during a layoff blunts the long-term loss', src: 8, srcLabel: 'Zheng et al. 2022' },
      { id: 'overtraining', cat: 'exercise', name: 'Overtraining / non-functional overreaching', dir: 'negative', dirLabel: 'Lowers', ev: 'moderate',
        key: 'ECSS/ACSM consensus: too much training with too little recovery causes prolonged performance decrements, including reduced VO2 max, that take weeks to months to resolve. This is a narrative expert consensus on overtraining syndrome as a whole, not a pooled analysis of VO2 max.',
        plain: 'More is not always better. Pushing past recovery can stall or drop your VO2 max. If your fitness is sliding despite hard training, you may be under-recovered, not under-trained.',
        dose: null, src: 20, srcLabel: 'Meeusen et al. 2013' },
      { id: 'tapering', cat: 'exercise', name: 'Tapering (pre-event)', dir: 'neutral', dirLabel: 'No VO2 max outcome measured', ev: 'strong',
        key: 'Meta-analysis of 27 studies. Performance was maximised by a ~2-week taper (ES 0.59 ± 0.33) that exponentially cut training volume by 41–60% (ES 0.72 ± 0.36) while leaving intensity (ES 0.33 ± 0.14) and frequency (ES 0.35 ± 0.17) unchanged. VO2 max was not an outcome in this meta-analysis.',
        plain: 'Backing off volume before a goal event sheds fatigue so your existing fitness shows up on the day. The evidence is about race performance — this meta-analysis never measured VO2 max at all.',
        dose: '~2-week taper · cut volume 41–60% · keep intensity and frequency', src: 31, srcLabel: 'Bosquet et al. 2007' },
      { id: 'concurrent', cat: 'exercise', name: 'Concurrent training (lifting + cardio)', dir: 'neutral', dirLabel: 'Neutral (indirect evidence)', ev: 'weak',
        key: 'Meta-analysis of concurrent-training sequence: doing strength work before versus after endurance made no difference to VO2 max (SMD 0.02, p=0.859). Every arm did both types of training — there was no endurance-only comparison, so this does not test whether adding lifting changes VO2 max gains.',
        plain: 'The order you put lifting and cardio in does not change your VO2 max. Whether adding lifting to cardio helps or hurts is a different question, and this evidence does not answer it.',
        dose: null, src: 32, srcLabel: 'Gao & Yu 2023' },

      // ── Nutrition & Supplements ──
      { id: 'iron', cat: 'nutrition', name: 'Iron (when deficient)', dir: 'positive', dirLabel: 'Raises (if deficient)', ev: 'moderate-strong',
        key: 'Meta of 24 RCTs in women of reproductive age; the VO2 max estimate pools 18 of them. Daily iron raised relative VO2 max by 2.35 mL/kg/min (95% CI 0.82–3.88, p=0.003) and lowered submaximal heart rate. Only 3 of the 24 trials were rated at low risk of bias.',
        plain: 'Fixing low iron raises VO2 max, especially in menstruating women who are prone to deficiency. This is correcting a deficit, not a boost on top of normal iron.',
        dose: 'Daily iron — only corrects a deficiency, not a boost on top of normal levels', src: 6, srcLabel: 'Pasricha et al. 2014' },
      { id: 'nitrate', cat: 'nutrition', name: 'Dietary nitrate / beetroot juice', dir: 'neutral', dirLabel: 'No effect on VO2 max', ev: 'strong',
        key: '73 studies (n=1061): nitrate lowered submaximal VO2 (O2 cost) by ~0.04 L/min (p<0.00001) but had no significant effect on VO2 max.',
        plain: 'Beetroot does not raise your ceiling. It makes a given pace cheaper to hold (better economy), which can help performance without changing VO2 max.',
        dose: null, src: 2, srcLabel: 'Gao/Whitlock et al. 2021' },
      { id: 'caffeine', cat: 'nutrition', name: 'Caffeine', dir: 'neutral', dirLabel: 'No reliable effect', ev: 'moderate',
        key: 'RCT (n=9): caffeine improved time to exhaustion (~+19%) and peak power (~+13%) but did not change VO2 max — and the gains were matched by a placebo believed to be caffeine.',
        plain: 'Caffeine helps you push harder and feel less effort, which improves performance. It does not raise your VO2 max ceiling — a lot of the benefit is expectation/placebo.',
        dose: null, src: 9, srcLabel: 'Brietzke et al. 2017' },
      { id: 'creatine', cat: 'nutrition', name: 'Creatine', dir: 'negative', dirLabel: 'Slightly lowers (per-kg)', ev: 'strong',
        key: 'Meta of 19 RCTs (n=424): VO2 max rose less with creatine than placebo (ES −0.32, 95% CI −0.51 to −0.12).',
        plain: 'Creatine is great for strength and power, and since VO2 max is scored per kg, the number can dip slightly. Added body water and mass is the authors’ likely explanation, not something the trials directly measured.',
        dose: null, src: 13, srcLabel: 'Gras et al. 2023' },
      { id: 'beta-alanine', cat: 'nutrition', name: 'Beta-alanine', dir: 'neutral', dirLabel: 'Not tested for VO2 max', ev: 'moderate',
        key: 'ISSN position stand: beta-alanine raises intramuscular carnosine and most reliably helps efforts longer than 60 s, with the effect most pronounced in the 1–4 minute range. The position stand does not address VO2 max as an outcome.',
        plain: 'Useful for buffering "the burn" in efforts of roughly one to four minutes. There is no evidence it raises VO2 max — the position stand simply does not cover that.',
        dose: null, src: 14, srcLabel: 'Trexler et al. 2015 (ISSN)' },
      { id: 'bicarbonate', cat: 'nutrition', name: 'Sodium bicarbonate', dir: 'neutral', dirLabel: 'Not tested for VO2 max', ev: 'moderate',
        key: 'Systematic review of 35 studies: only 17 reported a performance benefit, concentrated in high-intensity efforts. The review reports no VO2 max outcome. Whether bicarbonate alters the VO2 slow component is contested — Santalla 2003 (7 professional cyclists, 0.3 g/kg) found no change, while Berger 2006 found the slow component delayed.',
        plain: '"Baking soda" loading helps some people tolerate the burn in hard efforts, though only about half the trials found any benefit. Its effect on VO2 max has not been tested.',
        dose: null, src: 18, srcLabel: 'Hadzic et al. 2019' },
      { id: 'vitamin-d', cat: 'nutrition', name: 'Vitamin D', dir: 'neutral', dirLabel: 'No demonstrated effect', ev: 'moderate',
        key: 'Network meta-analysis (30 RCTs, 693 athletes) reported no significant VO2 max benefit for vitamin D. The published effect estimates could not be retrieved, so read this as no demonstrated benefit rather than proof of no effect. Deficiency-correction studies are mixed.',
        plain: 'Worth keeping vitamin D in normal range for general health, but nothing shows it raises VO2 max. The underlying numbers are thin enough that "no effect" is not settled either.',
        dose: null, src: 19, srcLabel: 'Deng et al. 2025' },
      { id: 'omega-3', cat: 'nutrition', name: 'Omega-3 (fish oil)', dir: 'neutral', dirLabel: 'Contested for VO2 max', ev: 'moderate',
        key: 'ISSN position stand. Its own headline conclusion is net-positive for training adaptation and performance, and it reports a lower oxygen cost of submaximal work and lower exercising heart rate. On VO2 max specifically the evidence is contested: some trials show small VO2 peak gains, others are null.',
        plain: 'Fish oil may make a given effort feel a touch easier and is good for general health. Whether it raises VO2 max is genuinely unsettled — the position stand leans positive, individual trials disagree.',
        dose: null, src: 23, srcLabel: 'Jäger et al. 2024 (ISSN)' },

      // ── Environment ──
      { id: 'altitude-lhtl', cat: 'environment', name: 'Altitude (live high, train low)', dir: 'positive', dirLabel: 'Raises', ev: 'moderate',
        key: 'Elite orienteers living at 2,500 m (18 h/day) and training lower for 24 days raised hemoglobin mass (805→848 g) and VO2 max (3,515→3,660 mL/min). The unchanged control group were cross-country skiers, and their "sea level" was really 500–1,600 m.',
        plain: 'Sleeping at altitude builds more oxygen-carrying red cells, which can lift VO2 max. The evidence is one small elite study whose controls were a different sport living at low altitude, and the effect is still debated.',
        dose: 'Sleep high (~2,500 m, 18 h/day), train low · ~3–4 weeks', src: 7, srcLabel: 'Wehrlin et al. 2006' },
      { id: 'acute-altitude', cat: 'environment', name: 'Acute altitude (being at altitude)', dir: 'negative', dirLabel: 'Lowers (on the spot)', ev: 'moderate',
        key: 'VO2 max falls roughly 6–8% per 1,000 m of elevation above about 1,500 m; roughly half of that recovers with ~2 weeks of acclimatisation. This is a standard textbook figure from the broader altitude-physiology literature, not a single cited study — treat the percentage as an approximation.',
        plain: 'The thinner the air, the lower your VO2 max on the spot. Your watch will read lower at elevation until you adapt.',
        dose: null, src: 7, srcLabel: 'Textbook figure — no single source (cf. Wehrlin 2006)' },
      { id: 'heat-acclimation', cat: 'environment', name: 'Heat acclimation', dir: 'positive', dirLabel: 'Raises', ev: 'moderate',
        key: 'Meta-analysis pooled four heat-acclimation effects on VO2 max: Hedges’ g = 0.42 overall, 0.63 when tested in the heat, 0.30 versus a control group, and 0.75 versus control when tested in the heat. The +5% cool / +8% hot and ~6.5% plasma-volume figures come from Lorenzo 2010 (12 acclimated cyclists vs 8 controls, tested at 13°C and 38°C).',
        plain: 'Training in the heat expands blood plasma and can nudge VO2 max up, similar in spirit to altitude. The effect is biggest when you are also tested in heat.',
        dose: 'Repeated heat exposure; effect via plasma-volume expansion', src: 12, srcLabel: 'Waldron et al. 2021 (+ Lorenzo 2010)' },
      { id: 'air-pollution', cat: 'environment', name: 'Air pollution (PM2.5)', dir: 'negative', dirLabel: 'Lowers / blunts gains', ev: 'moderate',
        key: 'Systematic review of 24 studies: breathing polluted air during endurance exercise impairs cardiopulmonary responses and can blunt the aerobic-fitness benefit of training. The review did not establish a dose-response relationship between pollutant concentration and the size of the effect.',
        plain: 'Hard training in heavy traffic or smog works against you. How much depends on exposure in ways this evidence has not pinned down — favour cleaner air and times of day when you can.',
        dose: null, src: 28, srcLabel: 'González-Rojas et al. 2025' },
      { id: 'hypoxic-training', cat: 'environment', name: 'Hypoxic training methods', dir: 'positive', dirLabel: 'Raises (varies by method)', ev: 'moderate',
        key: 'Bayesian network meta-analysis (59 studies) ranked live-high/train-low combined with low-altitude training best (P-scores 0.92 and 0.86); intermittent hypoxic training ranked far lower (0.37) and intermittent hypoxic exposure at rest lowest (0.07). A 2025 meta-analysis of 35 studies contradicts this row for intermittent hypoxic training specifically: no VO2 max benefit over normoxic training (p=0.333), with evidence of publication bias.',
        plain: 'Sleeping high while training low is the most dependable protocol. Doing intervals in a hypoxic mask is the weakest version — and the newest meta-analysis finds it does not work at all.',
        dose: 'Live-high/train-low ranks most reliable; hypoxic-mask intervals do not', src: 33, srcLabel: 'Feng et al. 2023 (vs Dorelli et al. 2025)' },

      // ── Demographics & Physiology ──
      { id: 'body-fat', cat: 'demographics', name: 'Body fat / excess weight', dir: 'negative', dirLabel: 'Lowers (per-kg)', ev: 'strong',
        key: 'VO2 max is expressed per kg, so carrying more fat lowers the number. In adults with overweight/obesity, training raised relative VO2 max by 3.82 mL/kg/min (66 RCTs, n=3,964) — that figure is the effect of the training programmes, not of fat loss on its own.',
        plain: 'Because the score is "per kilo," losing fat raises your VO2 max number even if your heart and lungs do not change. The 3.82 figure above is what training delivered in these trials.',
        dose: 'Training + fat loss; the score is per kg of body weight', src: 10, srcLabel: 'van Baak et al. 2021' },
      { id: 'age', cat: 'demographics', name: 'Age', dir: 'negative', dirLabel: 'Lowers', ev: 'strong',
        key: 'Baltimore Longitudinal Study (n=810, ages 21–87): peak VO2 decline accelerates each decade rather than being linear — roughly 3–6% per decade through the 20s and 30s, rising to more than 20% per decade from the 70s onward. The decline is faster in men from the 40s onward.',
        plain: 'VO2 max drops with age, and the drop speeds up sharply in later decades. Single snapshots across ages make aging look gentler than it really is.',
        dose: null, src: 3, srcLabel: 'Fleg et al. 2005' },
      { id: 'immobilization', cat: 'demographics', name: 'Immobilization / bed rest', dir: 'negative', dirLabel: 'Lowers (severe)', ev: 'moderate',
        key: 'Dallas Bed Rest Study (5 men): 3 weeks of strict bed rest cut VO2 max ~26%, reversed by 8 weeks of training. The 40-year follow-up found 40 years of aging cost ~27% — a comparable drop. Five men, no control group; the usual "falling cardiac output" explanation is not established by this study.',
        plain: 'Extended inactivity is brutally fast at erasing fitness. Three weeks flat on your back cost these men about as much VO2 max as four decades of aging — from a five-man study, so hold the exact number loosely.',
        dose: null, src: 11, srcLabel: 'Saltin et al. 1968' },
      { id: 'blood-donation', cat: 'demographics', name: 'Blood donation (acute)', dir: 'neutral', dirLabel: 'No clear reduction', ev: 'weak',
        key: 'Systematic review of whole-blood donation (~500 mL): the change in VO2 max was not statistically significant, and the review concludes VO2 max is not reduced by donation. Submaximal responses do shift. The stroke-volume / cardiac-output explanation does not come from this review.',
        plain: 'Losing ~500 mL of blood sounds like it should dent your VO2 max, but the pooled evidence does not show a significant drop. The review is small and individual studies disagree, so do not plan around a large effect in either direction.',
        dose: null, src: 16, srcLabel: 'Johnson et al. 2019' },
      { id: 'dehydration', cat: 'demographics', name: 'Dehydration / hypohydration', dir: 'negative', dirLabel: 'Lowers', ev: 'moderate',
        key: 'Review: losing more than ~2% of body mass as water lowers maximal aerobic capacity, mainly by shrinking plasma volume (lower stroke volume and cardiac output). The impairment compounds in the heat.',
        plain: 'Showing up dehydrated lowers your VO2 max on the day because there is less blood volume to pump. Hot conditions make it worse.',
        dose: 'Avoid >2% body-mass water loss before testing or hard efforts', src: 25, srcLabel: 'Cheuvront & Sawka 2010' },
      { id: 'genetics', cat: 'demographics', name: 'Genetics (trainability)', dir: 'variable', dirLabel: 'Varies by person', ev: 'strong',
        key: 'HERITAGE Family Study (n=481, 20-wk identical training): mean gain ~400 mL/min but ranged from no gain to >1.0 L/min. Maximal heritability of the training response was estimated at ~47% — an upper bound, in a Caucasian family sample.',
        plain: 'How much your VO2 max improves from the same training is heavily genetic — up to roughly half of the response. Some people are high responders, some barely move. It runs in families.',
        dose: null, src: 4, srcLabel: 'Bouchard et al. 1999 (HERITAGE)' },
      { id: 'sex', cat: 'demographics', name: 'Sex', dir: 'variable', dirLabel: 'Varies', ev: 'moderate',
        key: 'Narrative review: a ~10–12% endurance performance gap. Comparing elite men with elite women, male VO2 max averages ~10% higher per kg of body mass, driven mainly by greater oxygen delivery (higher hemoglobin mass, larger heart). The review gives no per-fat-free-mass figure.',
        plain: 'Men average higher VO2 max largely because they carry more oxygen per unit of blood and have bigger hearts. The ~10% figure is elite-versus-elite, per kilogram of body weight.',
        dose: null, src: 5, srcLabel: 'Santisteban et al. 2022' },

      // ── Lifestyle ──
      { id: 'smoking', cat: 'lifestyle', name: 'Smoking', dir: 'negative', dirLabel: 'Lowers', ev: 'moderate',
        key: 'Cross-sectional study (n=70, step-test estimate): current smokers had lower estimated VO2 max (38.8) than never-smokers (41.6) and former smokers (41.4). The carbon-monoxide-binds-hemoglobin explanation is standard physiology, not something this study measured. The authors disclose tobacco-industry-funded research ties.',
        plain: 'Smokers in this study had a measurably lower aerobic ceiling. Because it is a single cross-sectional snapshot, it cannot tell you whether quitting restores it.',
        dose: null, src: 15, srcLabel: 'Caci et al. 2024' },
      { id: 'alcohol', cat: 'lifestyle', name: 'Alcohol (previous-day)', dir: 'negative', dirLabel: 'Lowers (performance)', ev: 'moderate',
        key: 'RCT (n=12): a previous-evening alcohol dose (1.09 g ethanol per kg fat-free mass) cut next-morning cycling time to exhaustion by ~11% (181 vs 203 s); strength tests were unaffected. The effect is on endurance capacity rather than a proven VO2 max change.',
        plain: 'Drinking the night before a hard session measurably hurts endurance the next day. The hit is to how long you can hold an effort, more than to your VO2 max ceiling.',
        dose: null, src: 24, srcLabel: 'Shaw et al. 2022' },
      { id: 'sleep-deprivation', cat: 'lifestyle', name: 'Sleep deprivation', dir: 'negative', dirLabel: 'Lowers (performance)', ev: 'moderate',
        key: 'Meta-analysis of 45 studies, 16 of them on aerobic endurance: sleep deprivation cut aerobic endurance performance (SMD −0.76, 95% CI −1.27 to −0.25; athletes −0.66, non-athletes −1.02) and raised perceived exertion. This paper reports no VO2 max outcome — claims that acute sleep loss spares VO2 max, or that chronic short sleep lowers it, are not supported by this source.',
        plain: 'A bad night clearly hurts how long and how hard you can go. What it does to your VO2 max number specifically has not been tested here.',
        dose: null, src: 29, srcLabel: 'Kong et al. 2025' },
      { id: 'sauna', cat: 'lifestyle', name: 'Sauna bathing (habitual)', dir: 'positive', dirLabel: 'Raises', ev: 'moderate',
        key: 'Kuopio cohort of 2,012 men aged 42–61: versus one session a week, 2–3 sessions/week were associated with +0.84 mL/kg/min (p=.008) and 4–7 sessions/week with +1.17 mL/kg/min (p=.041) of estimated fitness; at 11 years only the 2–3/week group remained significant (+1.22, p=.038). Session duration was not associated with fitness. The ~+2.7 mL/kg/min post-exercise-sauna figure comes from a small RCT by the same group, not an independent trial.',
        plain: 'More frequent sauna sessions track with higher fitness in Finnish men — how long you sit does not. The cohort is observational, and the one supporting trial is from the same authors.',
        dose: 'Frequency, not duration: 2–3 or more sessions per week', src: 30, srcLabel: 'Kunutsor et al. 2024' },
      { id: 'sedentary', cat: 'lifestyle', name: 'Sedentary behavior (sitting time)', dir: 'negative', dirLabel: 'Lowers', ev: 'moderate',
        key: 'In 16,025 adults, more daily sitting was associated with lower estimated cardiorespiratory fitness — but no association was seen among the most physically active participants, so it is not independent of exercise. Fitness was estimated, not measured directly.',
        plain: 'Long sitting days track with lower fitness, mainly in people who are not otherwise very active. If you already train a lot, this study does not show sitting hurting you.',
        dose: null, src: 34, srcLabel: 'Eriksen et al. 2016' },
      { id: 'cold-water', cat: 'lifestyle', name: 'Cold-water immersion (post-training)', dir: 'neutral', dirLabel: 'No VO2 max estimate', ev: 'moderate',
        key: 'Meta-analysis: routinely ice-bathing after sessions blunts strength and power gains (SMD −0.60). It reports no pooled VO2 max estimate, so it neither confirms nor rules out an effect on aerobic capacity.',
        plain: 'Ice baths clearly cost you strength gains. For VO2 max there is no pooled evidence either way — this meta-analysis simply did not produce that number.',
        dose: null, src: 35, srcLabel: 'Malta et al. 2021' },

      // ── Clinical ──
      { id: 'long-covid', cat: 'clinical', name: 'Long COVID', dir: 'negative', dirLabel: 'Lowers', ev: 'moderate',
        key: 'Meta-analysis (9 studies, 464 symptomatic vs 359): peak VO2 was 4.9 mL/kg/min lower in people with ongoing symptoms 3+ months after infection, at low certainty of evidence. The included cohorts oversampled people who had been hospitalised, so the gap may be smaller after milder infection.',
        plain: 'Lingering COVID symptoms come with a measurably lower VO2 max. Certainty is low and the studies lean toward people who were hospitalised, so milder cases may be less affected.',
        dose: null, src: 17, srcLabel: 'Durstenfeld et al. 2022' },
      { id: 'type-2-diabetes', cat: 'clinical', name: 'Type 2 diabetes', dir: 'negative', dirLabel: 'Lowers', ev: 'moderate',
        key: 'Meta-analysis (77 studies): people with type 2 diabetes averaged 5.84 mL/kg/min lower VO2 max than those without, driven by cardiac, microvascular, and mitochondrial impairments.',
        plain: 'Type 2 diabetes meaningfully lowers aerobic fitness, and low fitness in turn predicts worse outcomes. Exercise that raises VO2 max is one of the highest-value interventions here.',
        dose: null, src: 22, srcLabel: 'Macedo et al. 2023' },
      { id: 'heart-failure', cat: 'clinical', name: 'Heart failure (VO2 max as prognosis)', dir: 'negative', dirLabel: 'Lowers (prognostic)', ev: 'strong',
        key: 'Landmark CPET study: peak VO2 ≤14 mL/kg/min became the heart-transplant timing threshold, though that group still had ~70% one-year survival. The worst prognosis belonged to patients rejected from transplant for noncardiac reasons — 47% one-year and 32% two-year survival.',
        plain: 'The heart can’t deliver enough oxygen, so VO2 max falls and is one of the strongest predictors of survival in heart failure. The classic ≤14 figure is a transplant-timing threshold, not the worst-prognosis group in the original data.',
        dose: null, src: 21, srcLabel: 'Mancini et al. 1991' },
      { id: 'mortality', cat: 'clinical', name: 'Low fitness as a mortality risk factor', dir: 'predictor', dirLabel: 'Predicts mortality', ev: 'strong',
        key: 'In 122,007 adults followed ~8.4 years, higher treadmill-derived cardiorespiratory fitness — measured in METs, not laboratory VO2 max — was associated with lower all-cause mortality with no upper limit of benefit; the least-fit had ~5× the adjusted mortality risk of the fittest. Observational, so this is an association rather than proof that raising fitness lowers risk.',
        plain: 'Low fitness is one of the strongest markers of dying early, on par with major disease risk factors — and there’s no point of diminishing returns. This is exercise-test fitness in METs rather than a lab VO2 max.',
        dose: null, src: 48, srcLabel: 'Mandsager et al. 2018' }
    ];
  }

  // ── Sources (#1–35, #48–52) ─────────────────────────────────────────────

  get _sources() {
    return [
      { id: 1, tag: 'Exercise — HIIT/MICT', title: 'Wen et al. 2019 — HIIT protocols for VO2 max', cite: 'J Sci Med Sport. 2019;22(8):941-947.', detail: 'Systematic review + meta-analysis of 53 RCTs. HIIT vs control SMD 0.41–1.81 overall (long-interval/high-volume subgroup 0.50–2.48); vs MICT only long-interval/high-volume HIIT won (SMD 0.65–1.07).', url: 'https://doi.org/10.1016/j.jsams.2019.01.013' },
      { id: 2, tag: 'Nutrition — nitrate', title: 'Gao/Whitlock et al. 2021 — Dietary nitrate', cite: 'J Int Soc Sports Nutr. 2021;18:55.', detail: '73 studies (n=1061). Nitrate lowered submaximal VO2 (−0.04 L/min) but had no significant effect on VO2 max — benefit is economy, not ceiling.', url: 'https://doi.org/10.1186/s12970-021-00450-4' },
      { id: 3, tag: 'Physiology — age', title: 'Fleg et al. 2005 — Aerobic capacity decline with age', cite: 'Circulation. 2005;112(5):674-682.', detail: 'Baltimore Longitudinal Study, n=810 (ages 21–87). Peak VO2 decline accelerates from ~3–6% per decade in the 20s–30s to >20% per decade from the 70s; faster in men from the 40s onward.', url: 'https://doi.org/10.1161/CIRCULATIONAHA.105.545459' },
      { id: 4, tag: 'Physiology — genetics', title: 'Bouchard et al. 1999 — HERITAGE Family Study', cite: 'J Appl Physiol. 1999;87(3):1003-1008.', detail: 'n=481, 20-wk identical training, Caucasian families. Mean gain ~400 mL/min, range from no gain to >1.0 L/min; maximal heritability of the response ~47% (an upper bound).', url: 'https://doi.org/10.1152/jappl.1999.87.3.1003' },
      { id: 5, tag: 'Physiology — sex', title: 'Santisteban et al. 2022 — Sex differences in VO2 max', cite: 'Int J Environ Res Public Health. 2022;19(9):4946.', detail: 'Narrative review. ~10–12% performance gap; elite men average ~10% higher VO2 max per kg than elite women, attributed to oxygen delivery (hemoglobin mass, cardiac size). No per-fat-free-mass figure given.', url: 'https://doi.org/10.3390/ijerph19094946' },
      { id: 6, tag: 'Nutrition — iron', title: 'Pasricha et al. 2014 — Iron & physical performance', cite: 'J Nutr. 2014;144(6):906-914.', detail: '24 RCTs in women of reproductive age; VO2 max pooled from 18 of them. Daily iron raised relative VO2 max by 2.35 mL/kg/min (95% CI 0.82–3.88) and lowered submaximal HR. Only 3 of 24 trials at low risk of bias.', url: 'https://doi.org/10.3945/jn.113.189589' },
      { id: 7, tag: 'Environment — altitude', title: 'Wehrlin et al. 2006 — Live high, train low', cite: 'J Appl Physiol. 2006;100(6):1938-1945.', detail: '10 elite orienteers at 2,500 m (18 h/day) for 24 days. Hbmass 805→848 g, VO2 max 3,515→3,660 mL/min. Controls were cross-country skiers whose "sea level" was 500–1,600 m. Small, elite-only; LHTL still debated.', url: 'https://doi.org/10.1152/japplphysiol.01284.2005' },
      { id: 8, tag: 'Exercise — detraining', title: 'Zheng et al. 2022 — Detraining & VO2 max', cite: 'BioMed Research Int. 2022;2022:2130993.', detail: 'Meta of 21 athlete studies. Short-term (≤30 d) ES −0.62 (−3.93%); long-term (>30 d) ES −1.42 (−9.43%). Higher-trained athletes lost more in the long-term analysis only; light activity blunts loss.', url: 'https://doi.org/10.1155/2022/2130993' },
      { id: 9, tag: 'Nutrition — caffeine', title: 'Brietzke et al. 2017 — Caffeine & VO2 max', cite: 'Nutrition and Health. 2017;23(4):231-238.', detail: 'Placebo-perceived-as-caffeine crossover, n=9. Caffeine and placebo both raised time to exhaustion/peak power but VO2 max did not change — effect attributed to expectation (lower RPE).', url: 'https://doi.org/10.1177/0260106017723547' },
      { id: 10, tag: 'Physiology — body fat', title: 'van Baak et al. 2021 — Exercise & fitness in obesity', cite: 'Obesity Reviews. 2021;22(S4):e13239.', detail: '66 RCTs, n=3,964 adults with overweight/obesity. Training raised relative VO2 max (MD 3.82 mL/kg/min) — a training effect, not an effect of fat loss on its own; HIIT slightly > aerobic > resistance.', url: 'https://doi.org/10.1111/obr.13239' },
      { id: 11, tag: 'Physiology — bed rest', title: 'Saltin et al. 1968 — Dallas Bed Rest Study', cite: 'Circulation. 1968;38(5 Suppl):VII1-78.', detail: '5 men, 3 weeks strict bed rest then 8 weeks training, no control group. VO2 max fell ~26%; the 40-year follow-up found 40 years of aging cost ~27%. The cardiac-output mechanism is not established by this study.', url: 'https://pubmed.ncbi.nlm.nih.gov/5696236/' },
      { id: 12, tag: 'Environment — heat', title: 'Waldron et al. 2021 — Heat acclimation & VO2 max', cite: 'Sports Medicine. 2021;51(7):1509-1525.', detail: 'Meta-analysis + meta-regression. Four pooled Hedges’ g for VO2 max: 0.42 overall, 0.63 tested in heat, 0.30 vs control, 0.75 vs control in heat. The +5% cool / +8% hot and ~6.5% plasma-volume figures are Lorenzo 2010 (source below).', url: 'https://doi.org/10.1007/s40279-021-01445-6' },
      { id: 13, tag: 'Nutrition — creatine', title: 'Gras et al. 2023 — Creatine & VO2 max', cite: 'Crit Rev Food Sci Nutr. 2023;63(21):4855-4866.', detail: 'Meta of 19 RCTs, n=424. VO2 max rose less with creatine than placebo (ES −0.32). Added body water/mass is the authors’ likely explanation rather than a measured mechanism; VO2 max is scored per kg.', url: 'https://doi.org/10.1080/10408398.2021.2008864' },
      { id: 14, tag: 'Nutrition — beta-alanine', title: 'Trexler et al. 2015 — ISSN position stand: Beta-Alanine', cite: 'J Int Soc Sports Nutr. 2015;12:30.', detail: 'Society position stand. Beta-alanine raises intramuscular carnosine and most reliably helps efforts >60 s, most pronounced at 1–4 min. The stand does not address VO2 max as an outcome.', url: 'https://doi.org/10.1186/s12970-015-0090-y' },
      { id: 15, tag: 'Lifestyle — smoking', title: 'Caci et al. 2024 — Smoking & aerobic capacity', cite: 'Intern Emerg Med. 2024.', detail: 'Cross-sectional, n=70, Chester Step Test (estimated VO2 max). Current 38.8 vs never 41.6 vs former 41.4 mL/kg/min. Cross-sectional, so it cannot show reversibility; the CO-binding mechanism is not measured here. Authors disclose tobacco-industry-funded research ties.', url: 'https://doi.org/10.1007/s11739-024-03794-2' },
      { id: 16, tag: 'Physiology — blood donation', title: 'Johnson et al. 2019 — Whole-blood donation & exercise', cite: 'PLOS ONE. 2019;14(4):e0215346.', detail: 'Systematic review of 8 studies. The change in VO2 max after ~500 mL donation was not statistically significant and the review concludes VO2 max is not reduced. Cardiac-output/stroke-volume mechanism is absent from the paper.', url: 'https://doi.org/10.1371/journal.pone.0215346' },
      { id: 17, tag: 'Clinical — long COVID', title: 'Durstenfeld et al. 2022 — CPET in long COVID', cite: 'JAMA Netw Open. 2022;5(10):e2236057.', detail: 'Systematic review + meta-analysis, 9 studies. Peak VO2 4.9 mL/kg/min lower in symptomatic vs not, >3 months post-infection, at low certainty of evidence. Cohorts oversampled hospitalised patients.', url: 'https://doi.org/10.1001/jamanetworkopen.2022.36057' },
      { id: 18, tag: 'Nutrition — bicarbonate', title: 'Hadzic et al. 2019 — Sodium bicarbonate', cite: 'J Sports Sci Med. 2019;18(2):271-281.', detail: 'Systematic review of 35 studies; 17 reported a performance benefit, concentrated in high-intensity efforts. No VO2 max outcome is reported in this review.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6544001/' },
      { id: 19, tag: 'Nutrition — vitamin D', title: 'Deng et al. 2025 — Supplements & VO2 max (network meta-analysis)', cite: 'Food Sci Nutr. 2025.', detail: 'Network meta-analysis, 30 RCTs, 693 athletes. No significant VO2 max benefit reported for vitamin D. The published effect estimates could not be retrieved, so this is cited for vitamin D only and read as no demonstrated benefit rather than evidence of absence.', url: 'https://doi.org/10.1002/fsn3.71243' },
      { id: 20, tag: 'Exercise — overtraining', title: 'Meeusen et al. 2013 — Overtraining syndrome consensus', cite: 'Eur J Sport Sci. 2013;13(1):1-24 (also Med Sci Sports Exerc. 2013;45:186-205).', detail: 'ECSS/ACSM joint consensus — a narrative expert statement on overtraining syndrome broadly, not a pooled VO2 max analysis. Excess training with insufficient recovery causes prolonged performance decrements, including reduced VO2 max, lasting weeks to months.', url: 'https://doi.org/10.1080/17461391.2012.730061' },
      { id: 21, tag: 'Clinical — heart failure', title: 'Mancini et al. 1991 — Peak VO2 & transplant timing', cite: 'Circulation. 1991;83(3):778-786.', detail: 'Landmark CPET study. Peak VO2 ≤14 mL/kg/min became the transplant-timing threshold, but that group still had ~70% one-year survival; the worst prognosis was the group rejected from transplant for noncardiac reasons (47% one-year, 32% two-year).', url: 'https://doi.org/10.1161/01.cir.83.3.778' },
      { id: 22, tag: 'Clinical — type 2 diabetes', title: 'Macedo et al. 2023 — VO2 max in type 2 diabetes', cite: 'Arch Endocrinol Metab. 2023.', detail: 'Meta-analysis of 77 studies. People with type 2 diabetes averaged 5.84 mL/kg/min lower VO2 max, via cardiac, microvascular, and mitochondrial impairments.', url: 'https://doi.org/10.20945/2359-4292-2023-0040' },
      { id: 23, tag: 'Nutrition — omega-3', title: 'Jäger et al. 2024 — ISSN position stand: Omega-3', cite: 'J Int Soc Sports Nutr. 2024;22(1).', detail: 'Society position stand whose own headline conclusion is net-positive for training adaptation and performance. It reports lower oxygen cost of submaximal work and lower exercising HR; VO2 max evidence is contested, not cleanly null.', url: 'https://doi.org/10.1080/15502783.2024.2441775' },
      { id: 24, tag: 'Lifestyle — alcohol', title: 'Shaw et al. 2022 — Previous-day alcohol & performance', cite: 'Int J Sports Physiol Perform. 2022;17(1):44-50.', detail: 'RCT, n=12. A previous-evening dose of 1.09 g ethanol per kg fat-free mass cut next-morning cycling time to exhaustion by ~11% (181 vs 203 s); strength unaffected. VO2 max was not the outcome.', url: 'https://doi.org/10.1123/ijspp.2020-0790' },
      { id: 25, tag: 'Physiology — dehydration', title: 'Cheuvront & Sawka 2010 — Hydration & performance', cite: 'J Appl Physiol. 2010;109(6):1989-1995.', detail: 'Review. Losing >~2% body mass as water lowers maximal aerobic capacity, mainly via reduced plasma volume (lower stroke volume/cardiac output); worse in heat. A review rather than a pooled analysis.', url: 'https://doi.org/10.1152/japplphysiol.00367.2010' },
      { id: 26, tag: 'Exercise — SIT', title: 'Sloth et al. 2013 — Sprint interval training', cite: 'Scand J Med Sci Sports. 2013;23(6):e341-352.', detail: 'Systematic review of 19 studies; 13 pooled for VO2 max. Brief all-out sprints over 2–8 weeks raised VO2 max vs control (Hedges’ g 0.63, 95% CI 0.39–0.87; +4.2 to +13.4%).', url: 'https://doi.org/10.1111/sms.12092' },
      { id: 27, tag: 'Exercise — resistance', title: 'Smart et al. 2022 — Resistance training & VO2 peak', cite: 'Age Ageing. 2022;51(6):afac143.', detail: 'Meta-analysis in healthy adults over 60: 37 studies, 24 reporting VO2 peak, 22 pooled. +1.89 mL/kg/min (95% CI 1.21–2.57) for programmes ≤24 weeks; null (−0.01) beyond 24 weeks. No head-to-head comparison with aerobic training.', url: 'https://doi.org/10.1093/ageing/afac143' },
      { id: 28, tag: 'Environment — air pollution', title: 'González-Rojas et al. 2025 — Air pollution & exercise', cite: 'Life. 2025;15(4):595.', detail: '24 studies. Breathing polluted air during endurance exercise impairs cardiopulmonary responses and can blunt the aerobic-fitness benefit of training. A dose-response relationship was not established.', url: 'https://doi.org/10.3390/life15040595' },
      { id: 29, tag: 'Lifestyle — sleep', title: 'Kong et al. 2025 — Sleep deprivation & performance', cite: 'Front Physiol. 2025.', detail: '45 studies, 16 on aerobic endurance. Sleep deprivation reduced aerobic endurance (SMD −0.76, 95% CI −1.27 to −0.25; athletes −0.66, non-athletes −1.02) and raised perceived exertion. VO2 max is not an outcome anywhere in this paper.', url: 'https://doi.org/10.3389/fphys.2025.1544286' },
      { id: 30, tag: 'Lifestyle — sauna', title: 'Kunutsor et al. 2024 — Sauna & cardiorespiratory fitness', cite: 'J Cardiopulm Rehabil Prev. 2024;44(4):295-300.', detail: 'Kuopio (KIHD) cohort, 2,012 men aged 42–61. vs 1 session/week: 2–3/week +0.84 mL/kg/min (p=.008), 4–7/week +1.17 (p=.041); at 11 years only 2–3/week significant (+1.22, p=.038). Duration not associated with CRF. The ~+2.7 mL/kg/min RCT is by the same group, not independent.', url: 'https://pubmed.ncbi.nlm.nih.gov/38836690/' },
      { id: 31, tag: 'Exercise — tapering', title: 'Bosquet et al. 2007 — Tapering & performance', cite: 'Med Sci Sports Exerc. 2007;39(8):1358-1365.', detail: 'Meta-analysis of 27 studies. Optimal taper: ~2 weeks (ES 0.59 ± 0.33), volume cut 41–60% (ES 0.72 ± 0.36), intensity unchanged (ES 0.33 ± 0.14), frequency unchanged (ES 0.35 ± 0.17). VO2 max was not an outcome.', url: 'https://doi.org/10.1249/mss.0b013e31806010e0' },
      { id: 32, tag: 'Exercise — concurrent', title: 'Gao & Yu 2023 — Concurrent training sequence', cite: 'Front Physiol. 2023;14:1072679.', detail: 'Compares strength-before vs strength-after endurance: no difference in VO2 max (SMD 0.02, p=0.859). There is no endurance-only arm, so it is indirect evidence for whether adding strength work affects VO2 max gains.', url: 'https://doi.org/10.3389/fphys.2023.1072679' },
      { id: 33, tag: 'Environment — hypoxia', title: 'Feng et al. 2023 — Hypoxic training methods', cite: 'Front Physiol. 2023;14:1223037.', detail: '59 studies, Bayesian network meta-analysis. Live-high/train-low plus low-altitude training ranked best (P-scores 0.92 and 0.86); intermittent hypoxic training 0.37; intermittent hypoxic exposure at rest 0.07.', url: 'https://doi.org/10.3389/fphys.2023.1223037' },
      { id: 34, tag: 'Lifestyle — sedentary', title: 'Eriksen et al. 2016 — Sitting time & fitness', cite: 'Scand J Med Sci Sports. 2016;26(12):1435-1443.', detail: 'n=16,025 adults, estimated (not measured) cardiorespiratory fitness. More daily sitting was associated with lower fitness, but no association was found among the most physically active — so not independent of exercise.', url: 'https://doi.org/10.1111/sms.12608' },
      { id: 35, tag: 'Lifestyle — cold-water', title: 'Malta et al. 2021 — Cold-water immersion & adaptation', cite: 'Sports Medicine. 2021.', detail: 'Meta-analysis. Routine post-session ice baths blunt strength/power gains (SMD −0.60). No pooled VO2 max estimate is reported, so aerobic adaptation is neither confirmed nor ruled out.', url: 'https://doi.org/10.1007/s40279-020-01362-0' },
      { id: 48, tag: 'Why it matters', title: 'Mandsager et al. 2018 — Fitness & long-term mortality', cite: 'JAMA Network Open. 2018;1(6):e183605.', detail: 'Retrospective cohort, n=122,007, mean follow-up 8.4 yr. Treadmill MET-derived cardiorespiratory fitness (not laboratory VO2 max) was inversely associated with all-cause mortality with no upper limit; least-fit had ~5× the adjusted risk. Observational.', url: 'https://doi.org/10.1001/jamanetworkopen.2018.3605' },
      { id: 49, tag: 'Nutrition — bicarbonate', title: 'Santalla et al. 2003 — Bicarbonate & the VO2 slow component', cite: 'J Sports Sci. 2003;21(1):39-47.', detail: '7 professional road cyclists, 0.3 g/kg NaHCO3 vs placebo, two 6-min bouts at 90% VO2 max. No significant difference in the VO2 slow component between conditions.', url: 'https://doi.org/10.1080/0264041031000070868' },
      { id: 50, tag: 'Nutrition — bicarbonate', title: 'Berger et al. 2006 — Bicarbonate alters the slow phase of VO2 kinetics', cite: 'Med Sci Sports Exerc. 2006;38(11):1909-1917.', detail: 'Counterpoint to Santalla 2003: phase II VO2 kinetics were unchanged, but the onset of the slow component was delayed and end-exercise VO2 reduced. The slow-component question is contested.', url: 'https://doi.org/10.1249/01.mss.0000233791.85916.33' },
      { id: 51, tag: 'Environment — heat', title: 'Lorenzo et al. 2010 — Heat acclimation improves exercise performance', cite: 'J Appl Physiol. 2010;109(4):1140-1147.', detail: '12 trained cyclists heat-acclimated 10 days at 40°C vs 8 controls; tested at 13°C and 38°C. VO2 max +5% cool / +8% hot, plasma volume +6.5%.', url: 'https://doi.org/10.1152/japplphysiol.00495.2010' },
      { id: 52, tag: 'Environment — hypoxia', title: 'Dorelli et al. 2025 — Aerobic intermittent hypoxic training is not beneficial', cite: 'Scand J Med Sci Sports. 2025;35:e70088.', detail: '35 studies, 524 participants. Aerobic IHT did not improve VO2 max (p=0.333), peak power (p=0.159), or time to exhaustion (p=0.410) vs normoxic training, with publication bias detected (p=0.004). Contradicts the IHT ranking in Feng 2023.', url: 'https://doi.org/10.1111/sms.70088' }
    ];
  }

  _sourceById(id) { return this._sources.find(s => s.id === id); }

  // ── FAQ (also emitted as FAQPage JSON-LD) ────────────────────────────────

  get _faqs() {
    return [
      { q: 'What raises VO2 max the most?',
        a: 'Training is the biggest lever: high-intensity interval training raises VO2 max most, and only long-interval (2 min+), high-volume HIIT clearly beats steady cardio (SMD 0.65–1.07 across 53 RCTs). Sprint intervals follow (Hedges g 0.63), then moderate continuous cardio. Because VO2 max is measured per kilogram, training in people carrying excess weight raises the number further, and correcting iron deficiency helps in people who are low on iron.' },
      { q: 'Do supplements like beetroot, caffeine, or creatine increase VO2 max?',
        a: 'No supplement in this library has been shown to raise VO2 max. Dietary nitrate (beetroot) improves exercise economy but has no significant effect on the VO2 max ceiling; caffeine is ergogenic mostly via lower perceived effort; and creatine can slightly lower the per-kilogram number because it adds water weight. Beta-alanine and sodium bicarbonate help short hard efforts but were never tested for VO2 max, vitamin D showed no demonstrated benefit in athletes, and the omega-3 evidence is contested rather than clearly null.' },
      { q: 'What lowers VO2 max?',
        a: 'Stopping training (detraining), overtraining without recovery, aging, excess body fat, bed rest or immobilization, dehydration, acute altitude above about 1,500 m, air pollution, smoking, long COVID, and type 2 diabetes all lower VO2 max. Previous-day alcohol, sleep deprivation, and prolonged sitting hurt endurance performance or track with lower fitness, but were not shown to lower measured VO2 max itself. Blood donation is a common assumption that the pooled evidence does not support.' },
      { q: 'Why does VO2 max matter for health?',
        a: 'In a study of 122,007 adults, the least-fit people had roughly five times the all-cause mortality risk of the fittest, with no upper limit of benefit. Low cardiorespiratory fitness — measured as treadmill METs rather than a laboratory VO2 max — was a risk factor comparable to or greater than smoking, diabetes, or coronary artery disease. The study is observational, so this is a strong association rather than proof of cause.' },
      { q: 'How much of VO2 max trainability is genetic?',
        a: 'Up to about 47%. In the HERITAGE Family Study, identical 20-week training produced gains ranging from none to over 1 litre per minute, and the maximal heritability estimate for that response was ~47% — an upper bound, in a Caucasian family sample. Trainability clearly runs in families.' }
    ];
  }

  // ── SEO light-DOM summary ───────────────────────────────────────────────

  _seoText() {
    return 'What Affects VO2 Max? An evidence-ranked explorer of 39 factors by Kygo Health, each checked against the primary record across 40 peer-reviewed sources. The why: in 122,007 adults (Mandsager 2018), low treadmill MET-derived cardiorespiratory fitness carried ~5× the all-cause mortality risk of the fittest, with no upper limit of benefit — an observational association comparable to or greater than smoking, diabetes, or coronary disease. Biggest levers to raise VO2 max: high-intensity interval training, especially long-interval high-volume HIIT (Wen 2019, 53 RCTs, SMD 0.65–1.07 vs steady cardio, 0.50–2.48 vs no training); sprint interval training (Sloth 2013, Hedges g 0.63, 95% CI 0.39–0.87, +4.2–13.4%); moderate continuous cardio; training in adults with overweight or obesity because VO2 max is measured per kg (van Baak 2021, +3.82 mL/kg/min from training); resistance training alone in healthy over-60s (Smart 2022, +1.89 mL/kg/min for programmes under 24 weeks, null beyond); and fixing iron deficiency, especially in menstruating women (Pasricha 2014, +2.35 mL/kg/min, pooled from 18 of 24 RCTs). What has NOT been shown to raise your VO2 max ceiling (myth-busters): dietary nitrate/beetroot juice (improves economy, not ceiling — Gao/Whitlock 2021), caffeine (ergogenic via lower perceived effort, largely placebo — Brietzke 2017), creatine (slightly lowers the per-kg number, likely via water weight — Gras 2023), beta-alanine and sodium bicarbonate (help efforts of roughly 1–4 minutes; neither source reports a VO2 max outcome — Trexler 2015, Hadzic 2019), and vitamin D (no demonstrated benefit in athletes — Deng 2025). Omega-3 is contested rather than null (Jäger 2024). Lowers VO2 max: detraining (−3.93% within 30 days, −9.43% beyond — Zheng 2022), overtraining, acute altitude (~6–8% per 1,000 m above ~1,500 m, a textbook figure rather than a single cited study), air pollution (24 studies, no established dose-response), excess body fat, aging (3–6% per decade in the 20s–30s rising above 20% per decade from the 70s — Fleg 2005), bed rest (3 weeks ≈ 26%, about the same as 40 years of aging — Saltin 1968), dehydration over 2% body mass, smoking, long COVID (−4.9 mL/kg/min, low certainty — Durstenfeld 2022), and type 2 diabetes (−5.84 mL/kg/min). Hurts performance without a proven VO2 max change: previous-day alcohol (−11% time to exhaustion — Shaw 2022) and sleep deprivation (SMD −0.76 for aerobic endurance; no VO2 max outcome — Kong 2025). Raises VO2 max: live-high/train-low altitude (Wehrlin 2006), heat acclimation (Hedges g 0.42 overall, 0.63 tested in heat — Waldron 2021, Lorenzo 2010), structured hypoxic training (live-high/train-low ranks best; a 2025 meta finds intermittent hypoxic training does not work — Feng 2023, Dorelli 2025), and habitual sauna bathing (2,012 men; frequency but not duration tracks with fitness — Kunutsor 2024). No clear VO2 max effect: blood donation (the pooled review found no significant reduction), concurrent training sequence, tapering (performance meta-analysis with no VO2 max outcome), and post-training cold-water immersion (no pooled VO2 max estimate). Varies by person: trainability is up to ~47% heritable (HERITAGE, Bouchard 1999); sex (elite men average ~10% higher per kg via oxygen delivery — Santisteban 2022). Clinical: heart failure peak VO2 ≤14 mL/kg/min is a transplant-timing threshold (Mancini 1991). Each factor carries a direction, an evidence grade (strong, moderate–strong, moderate, or weak), a key finding, a plain-English takeaway, dose/how-to where it exists, and an anchored source. Filter by category — Exercise, Nutrition & Supplements, Environment, Demographics & Physiology, Lifestyle, Clinical — direction, and evidence strength. Most supplements marketed for endurance change the oxygen cost of effort (economy), not VO2 max itself.';
  }

  // ── Icons ───────────────────────────────────────────────────────────────

  _icon(name) {
    const icons = {
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
      arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>',
      arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
      bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
      pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>',
      wind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>',
      dna: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2c0 6 16 4 16 10S4 16 4 22"/><path d="M20 2c0 6-16 4-16 10s16-2 16 4"/><path d="M6 6h12M6 18h12M8.5 4.5h7M8.5 19.5h7"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
      grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
      chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
      apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg>',
      android: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>'
    };
    return `<span class="ico">${icons[name] || icons.info}</span>`;
  }

  // ── Direction / evidence metadata ───────────────────────────────────────

  _dirMeta(dir) {
    const m = {
      positive: { label: 'Raises', cls: 'dir-pos', icon: 'arrowUp' },
      negative: { label: 'Lowers', cls: 'dir-neg', icon: 'arrowDown' },
      neutral: { label: 'No effect', cls: 'dir-neu', icon: 'minus' },
      variable: { label: 'Varies', cls: 'dir-var', icon: 'info' },
      predictor: { label: 'Predicts outcomes', cls: 'dir-pred', icon: 'heart' }
    };
    return m[dir] || m.neutral;
  }

  _evLabel(ev) {
    return { 'strong': 'Strong', 'moderate-strong': 'Mod–Strong', 'moderate': 'Moderate', 'weak': 'Weak' }[ev] || 'Moderate';
  }

  get _evChips() {
    return [['strong', 'Strong'], ['moderate-strong', 'Moderate–Strong'], ['moderate', 'Moderate'], ['weak', 'Weak']];
  }

  get _dirChips() {
    return [
      { v: 'positive', l: 'Raises' }, { v: 'negative', l: 'Lowers' },
      { v: 'neutral', l: 'No effect' }, { v: 'variable', l: 'Varies' },
      { v: 'predictor', l: 'Predicts outcomes' }
    ];
  }

  // ── Filtering ────────────────────────────────────────────────────────────

  _matches(f) {
    if (this._dir.size && !this._dir.has(f.dir)) return false;
    if (this._evidence.size && !this._evidence.has(f.ev)) return false;
    if (this._query) {
      const q = this._query.toLowerCase();
      const hay = (f.name + ' ' + f.key + ' ' + f.plain + ' ' + (f.dose || '')).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  }

  _filtered() { return this._factors.filter(f => this._matches(f)); }

  _anyFilterActive() {
    return this._dir.size || this._evidence.size || !!this._query;
  }

  _updateResults() {
    const sr = this.shadowRoot;
    const filtered = this._filtered();
    const dirbar = sr.querySelector('.dir-chipbar');
    if (dirbar) dirbar.innerHTML = this._renderFilterChips();
    const count = sr.querySelector('.fx-count');
    if (count) count.innerHTML = this._renderCount(filtered.length);
    const groups = sr.querySelector('.fx-groups');
    if (groups) groups.innerHTML = this._renderFactorGroups(filtered);
  }

  // ── Section: direction + evidence chips ─────────────────────────────────

  _renderFilterChips() {
    const dir = this._dirChips.map(c => {
      const active = this._dir.has(c.v);
      return `<button class="filter-chip${active ? ' active' : ''}" data-filter="dir" data-value="${c.v}" aria-pressed="${active}">${c.l}</button>`;
    }).join('');
    const ev = this._evChips.map(([v, l]) => {
      const active = this._evidence.has(v);
      return `<button class="filter-chip${active ? ' active' : ''}" data-filter="ev" data-value="${v}" aria-pressed="${active}">${l}</button>`;
    }).join('');
    return `
      <div class="chip-group">
        <span class="chip-group-label">Direction</span>
        <div class="chip-row">${dir}</div>
      </div>
      <div class="chip-group">
        <span class="chip-group-label">Evidence</span>
        <div class="chip-row">${ev}</div>
      </div>
      ${this._anyFilterActive() ? `<button class="filter-reset" data-action="reset-filters">Reset</button>` : ''}`;
  }

  _renderCount(n) {
    return `Showing <strong>${n}</strong> of ${this._factors.length} factors`;
  }

  // ── Section: factors grouped into collapsible category dropdowns ─────────

  _renderFactorGroups(factors) {
    if (!factors.length) {
      return `<div class="empty-state">No factors match those filters. <button class="link-btn" data-action="reset-filters">Reset filters</button></div>`;
    }
    const evRank = { strong: 0, 'moderate-strong': 1, moderate: 2, weak: 3 };
    const filtering = this._anyFilterActive();
    const groups = this._categories.map(c => ({
      c,
      items: factors.filter(f => f.cat === c.key)
        .sort((a, b) => (evRank[a.ev] - evRank[b.ev]) || a.name.localeCompare(b.name))
    })).filter(g => g.items.length);

    return groups.map((g, i) => {
      const open = filtering || i === 0; // when filtering, open all matching groups; otherwise open the first
      return `
        <details class="fxcat" data-cat="${g.c.key}"${open ? ' open' : ''}>
          <summary>
            <span class="fxcat-ico">${this._icon(g.c.icon)}</span>
            <span class="fxcat-label">${g.c.label}</span>
            <span class="fxcat-count">${g.items.length}</span>
            <span class="fxcat-chev">${this._icon('chevron')}</span>
          </summary>
          <div class="fxcat-body">${g.items.map(f => this._renderFactorRow(f)).join('')}</div>
        </details>`;
    }).join('');
  }

  _renderFactorRow(f) {
    const d = this._dirMeta(f.dir);
    const s = this._sourceById(f.src);
    return `
      <details class="fx-acc ${d.cls}" data-id="${f.id}">
        <summary>
          <span class="fx-dir ${d.cls}">${this._icon(d.icon)}</span>
          <span class="fx-acc-id"><span class="fx-acc-name">${f.name}</span></span>
          <span class="dir-badge ${d.cls} fx-hide-sm">${f.dirLabel}</span>
          <span class="ev-badge ev-${f.ev} fx-hide-md">${this._evLabel(f.ev)}</span>
          <span class="fx-chev">${this._icon('arrowRight')}</span>
        </summary>
        <div class="fx-acc-body">
          <p class="fx-plain">${f.plain}</p>
          ${f.dose ? `<div class="fx-dose"><span class="fx-dose-ico">${this._icon('bolt')}</span><span><strong>How&nbsp;to</strong> ${f.dose}</span></div>` : ''}
          <div class="fx-keyblock">
            <span class="fx-key-label">Key finding &amp; study</span>
            <p>${f.key}</p>
          </div>
          ${s ? `<a class="fx-src" href="${s.url}" target="_blank" rel="noopener nofollow" data-action="source-link" data-track-label="${f.srcLabel}" data-track-position="factor-card">${f.srcLabel} ${this._icon('externalLink')}</a>` : ''}
        </div>
      </details>`;
  }

  // ── Section: quick answers (levers vs duds) ─────────────────────────────

  _renderQuickAnswers() {
    const byId = id => this._factors.find(f => f.id === id);
    const levers = ['hiit-long', 'sit', 'body-fat', 'iron'].map(byId).filter(Boolean);
    const dontBother = ['nitrate', 'caffeine', 'creatine', 'beta-alanine', 'bicarbonate', 'vitamin-d'].map(byId).filter(Boolean);
    const item = (f, kind) => `
      <button class="qa-item" data-jump="${f.id}">
        <span class="qa-icon qa-${kind}">${this._icon(kind === 'lever' ? 'arrowUp' : 'minus')}</span>
        <span class="qa-text"><strong>${f.name}</strong><span class="qa-sub">${f.dirLabel} · ${f.srcLabel}</span></span>
        <span class="qa-arrow">${this._icon('arrowRight')}</span>
      </button>`;
    return `
      <div class="qa-col good">
        <div class="qa-head"><span class="qa-head-ico up">${this._icon('arrowUp')}</span><h3>Biggest levers</h3></div>
        <p class="qa-lead">What actually moves the needle most.</p>
        ${levers.map(f => item(f, 'lever')).join('')}
      </div>
      <div class="qa-col">
        <div class="qa-head"><span class="qa-head-ico">${this._icon('minus')}</span><h3>Won't raise your ceiling</h3></div>
        <p class="qa-lead">Popular, but none has been shown to raise VO2 max — several were never tested for it.</p>
        ${dontBother.map(f => item(f, 'dud')).join('')}
      </div>`;
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

  _renderFAQ() {
    return this._faqs.map(f => `
      <details>
        <summary>${f.q}</summary>
        <div class="body">${f.a}</div>
      </details>`).join('');
  }

  // ── Main render ─────────────────────────────────────────────────────────

  // Related tools · Kygo standard module ────────────────────────────────
  // Exactly 3 cards: a near neighbour, a bridge between accuracy and
  // physiology, and one from another family. Never links this page to
  // itself, and never links the Food Scanner.

  _relatedTools() {
    return [
      {
        title: 'Most Accurate VO2 Max Wearable',
        blurb: 'How accurately do wearables estimate VO2 max vs a lab CPET? 9 devices compared.',
        url: 'https://www.kygo.app/tools/vo2-max-accuracy',
        meta: 'Wearables · 13 sources',
        motif: { motif: 'compare', caption: 'Accuracy vs lab CPET', rows: [{ label: 'Garmin', pct: 93 }, { label: 'Apple', pct: 85 }, { label: 'Polar', pct: 80 }, { label: 'Fitbit', pct: 64 }] }
      },
      {
        title: 'Recovery Score Explorer',
        blurb: 'Compare readiness and recovery scores across 12 wearables, and see which are actually validated.',
        url: 'https://www.kygo.app/tools/recovery-score-explorer',
        meta: 'Recovery · 12 wearables',
        motif: { motif: 'ring', caption: 'Readiness score', ringValue: 72, ringNote: 'Validated' }
      },
      {
        title: 'HRV Factor Explorer',
        blurb: '38 research-backed factors that affect Heart Rate Variability, ranked by evidence.',
        url: 'https://www.kygo.app/tools/hrv-factors',
        meta: 'Recovery · 38 factors',
        motif: { motif: 'pulse', caption: 'HRV, beat-to-beat' }
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
      { slug: 'what-affects-vo2-max',
        title: 'What Affects VO2 Max? The Levers That Work (and the Ones That Waste Your Time)',
        blurb: 'Training raises VO2 max. Most supplements do not. Every factor that moves the number, ranked by evidence strength.',
        cat: 'Wearables & Data', min: 9, img: '273a63_611237219cac459ab4418aad328c5d5b~mv2.png' },
      { slug: 'most-accurate-vo2-max-wearable',
        title: 'Most Accurate VO2 Max Wearable: Garmin, Apple, WHOOP & Oura Ranked',
        blurb: 'No wearable measures VO2 max. They estimate it, and the gap between brands is large. Which device the research actually backs.',
        cat: 'Wearables & Data', min: 8, img: '273a63_b02ace65027c415981d32f4dd06782be~mv2.png' },
      { slug: 'how-to-improve-hrv-factors-ranked-by-evidence',
        title: 'How to Improve HRV: 44 Factors Ranked by Evidence (2026)',
        blurb: 'Forty-four factors that affect heart rate variability, ranked by how strong the peer-reviewed evidence really is.',
        cat: 'HRV & Recovery', min: 12, img: '273a63_81b206b8ae5e45b69e091fcb7e65b870~mv2.png' }
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
      slug: 'vo2-max-factors',
      headline: `See how <span>what you eat</span> shows up in your recovery.`,
      sub: `Your watch estimates VO2 max. Kygo shows what your training and nutrition do to it over time.`
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
            <p class="kc-note">Free plan available. Save 50% on yearly. Cancel anytime.</p>
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
    return { source: 'tool-vo2max-factors', variant: 'factors' };
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
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const fitbitImg = 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png';
    const googleHealthImg = 'https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png';
    const appleImg = 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png';
    const garminImg = 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png';
    const healthConnectImg = 'https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png';
    const all = this._filtered();

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" loading="lazy" />
            <span>Kygo Health</span>
          </a>
          <div class="nav-cta-group">
            <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" class="nav-store-btn nav-store-ios cta-primary" data-track-label="subnav-get-app-ios" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on the App Store"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg><span>iOS</span></a>
            <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" class="nav-store-btn nav-store-android cta-android" data-action="android-download" data-track-label="subnav-get-app-android" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on Google Play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg><span>Android</span></a>
          </div>
        </div>
      </header>

      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill"><span class="dot"></span> 39 FACTORS · RANKED BY RESEARCH</div>
              <h1>What actually affects your <span class="hl">VO2 max?</span></h1>
              <p class="hero-lede">VO2 max is the single best lab measure of cardiorespiratory fitness — and one of the strongest predictors of how long you'll live. Here's what raises it, what lowers it, and what's just hype, with <strong>every claim anchored to research.</strong></p>
            </div>
            <div class="hero-vis">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> Why it matters</span>
                <span class="hero-vis-tag">n = 122,007</span>
              </div>
              <div class="hero-vis-body">
                <div class="hero-vis-big">≈5×</div>
                <div class="hero-vis-text">
                  <p><strong>higher all-cause mortality</strong> for the least-fit vs the fittest, with <strong>no upper limit</strong> of benefit — low fitness rivals smoking, diabetes, and coronary disease as a risk factor.</p>
                  <span class="hero-vis-src">Mandsager et al. 2018 · JAMA Network Open · treadmill METs</span>
                </div>
              </div>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">39</div><div class="lbl">Factors analyzed</div></div>
            <div class="hero-stat"><div class="num">40</div><div class="lbl">Peer-reviewed sources</div></div>
            <div class="hero-stat"><div class="num">6</div><div class="lbl">Categories of influence</div></div>
            <div class="hero-stat"><div class="num">~47<span class="unit">%</span></div><div class="lbl">Max heritability of trainability</div></div>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Start here</div>
            <h2>Levers vs <span class="hl">duds.</span></h2>
            <p class="lede">The short version before you explore all 39. Tap any item to jump to its full card.</p>
          </div>
          <div class="qa-grid animate-on-scroll">${this._renderQuickAnswers()}</div>
        </div>
      </section>
      ${this._renderAppCta()}




      <section class="section bg-light" id="explorer">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The library</div>
            <h2>Explore every <span class="hl">factor.</span></h2>
            <p class="lede">Open a category, or filter by direction and evidence strength. Tap any factor to expand its plain-English takeaway, the key study finding, dose, and source.</p>
          </div>

          <div class="explorer-controls animate-on-scroll">
            <div class="search-wrap">
              <span class="search-icon">${this._icon('search')}</span>
              <input type="search" class="fx-search" placeholder="Search factors (e.g. HIIT, iron, sauna)…" aria-label="Search factors" />
            </div>
          </div>

          <div class="dir-chipbar animate-on-scroll">${this._renderFilterChips()}</div>
          <div class="fx-count animate-on-scroll">${this._renderCount(all.length)}</div>
          <div class="fx-groups animate-on-scroll">${this._renderFactorGroups(all)}</div>
        </div>
      </section>
      ${this._renderEmailCta()}


      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">FAQ</div>
            <h2>Common <span class="hl">questions.</span></h2>
          </div>
          <div class="faq">${this._renderFAQ()}</div>
        </div>
      </section>

      ${this._renderRelatedTools()}

      <section class="section bg-light">
        <div class="section-inner">
          <a class="blog-cta animate-on-scroll" href="https://www.kygo.app/tools/vo2-max-accuracy" target="_blank" rel="noopener">
            <span class="blog-cta-tag">Related Tool</span>
            <div class="blog-cta-body">
              <div class="blog-cta-kicker">Pair it with</div>
              <div class="blog-cta-title">Most Accurate VO2 Max Wearable</div>
              <div class="blog-cta-sub">See how 9 watches &amp; rings actually stack up against a lab CPET — which brands are independently validated, and which overestimate.</div>
            </div>
            <span class="blog-cta-arrow">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every factor, <span class="hl">anchored.</span></h2>
            <p class="lede">Each factor is tied to a primary source, opened and checked against the record (PubMed / PMC / journal).</p>
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
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Always consult a qualified healthcare provider before making health or training decisions.</p>
          <p class="footer-copyright">Anchored to peer-reviewed research, each source verified against the primary record. Last updated August 2026.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>

      ${this._renderRelatedPosts()}
    `;
  }

  // ── Event delegation ────────────────────────────────────────────────────

  _setupEventDelegation() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const shadow = this.shadowRoot;

    shadow.addEventListener('click', (e) => {
      const tgl = e.target.closest('[data-src-toggle]');
      if (tgl) { this._toggleSources(); return; }
      const reset = e.target.closest('[data-action="reset-filters"]');
      if (reset) {
        this._dir.clear(); this._evidence.clear(); this._query = '';
        const input = shadow.querySelector('.fx-search'); if (input) input.value = '';
        this._updateResults();
        return;
      }

      const chip = e.target.closest('.filter-chip');
      if (chip) {
        const set = chip.dataset.filter === 'dir' ? this._dir : this._evidence;
        const v = chip.dataset.value;
        if (set.has(v)) set.delete(v); else set.add(v);
        this._updateResults();
        return;
      }

      const qa = e.target.closest('.qa-item');
      if (qa) { this._jumpToFactor(qa.dataset.jump); return; }
    });

    shadow.addEventListener('input', (e) => {
      if (e.target.classList.contains('fx-search')) {
        this._query = e.target.value.trim();
        this._updateResults();
      }
    });
  }

  _jumpToFactor(id) {
    // Clear filters so the target is guaranteed visible, then open its category + row, scroll + flash.
    this._dir.clear(); this._evidence.clear(); this._query = '';
    const input = this.shadowRoot.querySelector('.fx-search'); if (input) input.value = '';
    this._updateResults();
    requestAnimationFrame(() => {
      const row = this.shadowRoot.querySelector(`.fx-acc[data-id="${id}"]`);
      if (!row) return;
      const cat = row.closest('.fxcat'); if (cat) cat.open = true;
      row.open = true;
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.classList.add('flash');
      setTimeout(() => row.classList.remove('flash'), 1600);
    });
  }

  // ── Scroll animations ───────────────────────────────────────────────────

  _setupAnimations() {
    requestAnimationFrame(() => {
      const els = this.shadowRoot.querySelectorAll('.animate-on-scroll');
      if (!els.length || !('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('visible'));
        return;
      }
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

  // ── JSON-LD ─────────────────────────────────────────────────────────────

  _injectStructuredData() {
    if (!document.querySelector('script[data-kygo-vo2max-factors-ld]')) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'What Affects VO2 Max? 30+ Factors Ranked by Research',
        'description': 'See what actually raises VO2 max and what doesn’t. 39 training, nutrition, environment, lifestyle & clinical factors ranked by evidence from 40 verified sources.',
        'applicationCategory': 'HealthApplication',
        'operatingSystem': 'Web',
        'url': 'https://www.kygo.app/tools/vo2-max-factors',
        'datePublished': '2026-06-03',
        'dateModified': '2026-08-17',
        'softwareVersion': '1.1',
        'inLanguage': 'en',
        'isAccessibleForFree': true,
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
        'alternateName': 'Kygo VO2 Max Factor Explorer',
        'featureList': 'Explore 39 VO2 max factors, filter by category/direction/evidence strength (strong, moderate–strong, moderate, weak), search, anchored peer-reviewed sources',
        'keywords': 'what affects vo2 max, how to increase vo2 max, what lowers vo2 max, does creatine lower vo2 max, does beetroot increase vo2 max, hiit vo2 max, supplements vo2 max, vo2 max factors'
      };
      const s1 = document.createElement('script');
      s1.type = 'application/ld+json';
      s1.setAttribute('data-kygo-vo2max-factors-ld', '');
      s1.textContent = JSON.stringify(ld);
      document.head.appendChild(s1);
    }

    if (!document.querySelector('script[data-kygo-vo2max-factors-faq]')) {
      const faq = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': this._faqs.map(f => ({
          '@type': 'Question', 'name': f.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
        }))
      };
      const s2 = document.createElement('script');
      s2.type = 'application/ld+json';
      s2.setAttribute('data-kygo-vo2max-factors-faq', '');
      s2.textContent = JSON.stringify(faq);
      document.head.appendChild(s2);
    }
  }

  // ── Styles ──────────────────────────────────────────────────────────────

  _styles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

      :host {
        --kygo-green: #22C55E;
        --kygo-green-dark: #16A34A;
        --kygo-green-light: #DCFCE7;
        --kygo-dark: #0F172A;
        --kygo-light: #F8FAFC;
        --bg-canvas: #FFFFFF;
        --bg-surface: #F8FAFC;
        --bg-raised: #F1F5F9;
        --fg-1: #0F172A;
        --fg-2: #475569;
        --fg-3: #94A3B8;
        --border-subtle: #E2E8F0;
        --shadow-md: 0 8px 24px rgba(15,23,42,0.06);
        --shadow-cta: 0 8px 24px rgba(34,197,94,0.30);
        --font-display: 'Space Grotesk', sans-serif;
        --font-body: 'DM Sans', sans-serif;
        --ease-out: cubic-bezier(.16,1,.3,1);
        display: block;
        font-family: var(--font-body);
        color: var(--fg-1);
        background: var(--bg-canvas);
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }
      * { box-sizing: border-box; }
      a { color: inherit; text-decoration: none; }
      .ico { display: inline-flex; align-items: center; justify-content: center; }
      .ico svg { width: 1em; height: 1em; }

      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity .6s var(--ease-out), transform .6s var(--ease-out); }
      .animate-on-scroll.visible { opacity: 1; transform: none; }

      /* Nav */
      .nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.92); backdrop-filter: saturate(160%) blur(14px); -webkit-backdrop-filter: saturate(160%) blur(14px); border-bottom: 1px solid var(--border-subtle); }
      .nav-inner { max-width: 1200px; margin: 0 auto; padding: 14px 20px; display: flex; align-items: center; gap: 16px; }
      .nav-brand { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 700; font-size: 14px; letter-spacing: -0.01em; color: var(--fg-1); text-transform: uppercase; }
      .nav-brand img { width: 26px; height: 26px; }
      .nav-cta-group { margin-left:auto; display:inline-flex; align-items:center; gap:8px; }
      .nav-cta-group .nav-store-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border-radius:8px; font-weight:600; font-size:13px; text-decoration:none; white-space:nowrap; line-height:1; }
      .nav-cta-group .nav-store-btn svg { width:15px; height:15px; flex-shrink:0; }
      .nav-cta-group .nav-store-ios { background:var(--kygo-green); color:#fff; }
      .nav-cta-group .nav-store-ios:hover { background:var(--kygo-green-dark); color:#fff; }
      .nav-cta-group .nav-store-android { background:#fff; color:var(--kygo-green-dark); border:1.5px solid var(--border-subtle); }
      .nav-cta-group .nav-store-android:hover { border-color:var(--kygo-green); color:var(--kygo-green-dark); }
      @media (max-width:360px){ .nav-cta-group .nav-store-btn span { display:none; } .nav-cta-group .nav-store-btn { padding:8px 10px; } }
      @media (max-width: 480px) { .nav-brand span { display: none; } }

      /* Buttons */
      .btn { font-family: var(--font-body); font-weight: 600; font-size: 14px; padding: 10px 18px; border-radius: 10px; border: 0; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all .2s var(--ease-out); white-space: nowrap; }
      .btn .ico { width: 16px; height: 16px; }
      .btn-primary { background: var(--kygo-green); color: #fff; box-shadow: 0 4px 12px rgba(34,197,94,0.25); }
      .btn-primary:hover { background: var(--kygo-green-dark); transform: translateY(-1px); box-shadow: var(--shadow-cta); }
      .btn-lg { padding: 14px 22px; font-size: 15px; border-radius: 12px; }
      .btn-lg .ico { width: 18px; height: 18px; }

      /* Hero */
      .hero-light { background: #fff; border-bottom: 1px solid var(--border-subtle); }
      .hero-light-inner { max-width: 1200px; margin: 0 auto; padding: 48px 20px 36px; }
      .hero-grid { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: center; margin-bottom: 32px; }
      @media (min-width: 880px) { .hero-grid { grid-template-columns: 1.15fr 1fr; gap: 48px; } .hero-light-inner { padding: 64px 24px 48px; } }
      .hero-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.10); color: var(--kygo-green-dark); padding: 6px 14px; border-radius: 999px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.5px; white-space: nowrap; }
      .hero-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kygo-green); flex: none; }
      .hero-light h1 { font-family: var(--font-display); font-weight: 700; color: var(--fg-1); font-size: clamp(30px, 5.5vw, 58px); line-height: 1.05; letter-spacing: -0.02em; margin: 18px 0 18px; }
      .hero-light h1 .hl { color: var(--kygo-green); }
      .hero-lede { font-size: clamp(15px, 1.6vw, 18px); line-height: 1.55; color: var(--fg-2); max-width: 60ch; margin: 0; }
      .hero-lede strong { color: var(--fg-1); font-weight: 600; }
      .hero-vis { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 14px; background: var(--kygo-dark); border-radius: 20px; padding: 22px 24px; box-shadow: 0 16px 40px rgba(15,23,42,0.18); }
      .hero-vis::before { content: ''; position: absolute; top: -100px; right: -90px; width: 280px; height: 280px; background: radial-gradient(closest-side, rgba(34,197,94,0.28), transparent); pointer-events: none; }
      .hero-vis-head { position: relative; display: flex; align-items: center; justify-content: space-between; }
      .hero-vis-title { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: rgba(255,255,255,0.55); }
      .hero-vis-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 0 3px rgba(34,197,94,0.25); }
      .hero-vis-tag { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.3px; color: #6EE7A0; background: rgba(34,197,94,0.16); padding: 4px 10px; border-radius: 999px; }
      .hero-vis-body { position: relative; display: flex; align-items: center; gap: 20px; }
      .hero-vis-big { flex: none; font-family: var(--font-display); font-weight: 700; font-size: clamp(52px, 12vw, 82px); line-height: 0.92; letter-spacing: -0.03em; color: var(--kygo-green); }
      .hero-vis-text { flex: 1; min-width: 0; }
      .hero-vis-body p { margin: 0 0 10px; font-size: 14px; line-height: 1.55; color: rgba(255,255,255,0.78); }
      .hero-vis-body p strong { color: #fff; font-weight: 600; }
      .hero-vis-src { font-size: 11px; color: rgba(255,255,255,0.45); }
      @media (max-width: 880px) { .hero-vis { width: 100%; max-width: 460px; margin: 4px auto 0; } }
      .hero-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; border-top: 1px solid var(--border-subtle); padding-top: 24px; }
      @media (min-width: 720px) { .hero-stats { grid-template-columns: repeat(4, 1fr); gap: 24px; padding-top: 28px; } }
      .hero-stat .num { font-family: var(--font-display); font-weight: 700; font-size: clamp(30px, 4vw, 42px); line-height: 1; color: var(--kygo-green); letter-spacing: -0.02em; display: inline-flex; align-items: baseline; }
      .hero-stat .num .unit { font-size: 0.6em; }
      .hero-stat .lbl { margin-top: 10px; color: var(--fg-3); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; line-height: 1.4; }

      /* Sections */
      .section { padding: 56px 20px; }
      @media (min-width: 720px) { .section { padding: 80px 24px; } }
      .section-inner { max-width: 1200px; margin: 0 auto; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
      .section.bg-white { background: #fff; }
      .section.bg-light { background: var(--kygo-light); }
      .section-head { margin-bottom: 28px; max-width: 720px; }
      .kicker { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 6px 12px; border-radius: 999px; }
      .section h2 { font-family: var(--font-display); font-weight: 600; font-size: clamp(26px, 4vw, 42px); line-height: 1.1; margin: 16px 0 10px; letter-spacing: -0.01em; }
      .section h2 .hl { color: var(--kygo-green); }
      .lede { color: var(--fg-2); font-size: 16px; line-height: 1.55; max-width: 60ch; margin: 0; }
      .lede strong { color: var(--fg-1); font-weight: 600; }

      /* Quick answers */
      .qa-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
      @media (min-width: 760px) { .qa-grid { grid-template-columns: 1fr 1fr; } }
      .qa-col { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 22px; }
      .qa-col.good { border-color: rgba(34,197,94,0.45); }
      .qa-head { display: flex; align-items: center; gap: 10px; }
      .qa-head-ico { width: 30px; height: 30px; border-radius: 8px; background: var(--bg-raised); color: var(--fg-3); display: inline-flex; align-items: center; justify-content: center; }
      .qa-head-ico.up { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .qa-head-ico .ico { width: 16px; height: 16px; }
      .qa-col h3 { font-family: var(--font-display); font-weight: 600; font-size: 18px; margin: 0; }
      .qa-lead { font-size: 13px; color: var(--fg-3); margin: 8px 0 14px; line-height: 1.5; }
      .qa-item { width: 100%; display: flex; align-items: center; gap: 12px; text-align: left; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 11px 14px; margin-bottom: 8px; cursor: pointer; transition: all .15s ease; font-family: var(--font-body); }
      .qa-item:hover { border-color: var(--kygo-green); background: rgba(34,197,94,0.05); transform: translateX(2px); }
      .qa-icon { width: 26px; height: 26px; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center; flex: none; }
      .qa-icon .ico { width: 14px; height: 14px; }
      .qa-icon.qa-lever { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .qa-icon.qa-dud { background: var(--bg-raised); color: var(--fg-3); }
      .qa-text { display: flex; flex-direction: column; min-width: 0; flex: 1; }
      .qa-text strong { font-weight: 600; font-size: 14px; color: var(--fg-1); }
      .qa-sub { font-size: 11.5px; color: var(--fg-3); }
      .qa-arrow { color: var(--fg-3); flex: none; }
      .qa-arrow .ico { width: 16px; height: 16px; }
      .qa-item:hover .qa-arrow { color: var(--kygo-green-dark); }

      /* Kygo CTA */
      .kygo-cta-card { background: var(--kygo-dark); border-radius: 24px; padding: 40px 24px; position: relative; overflow: hidden; color: #fff; text-align: center; display: flex; flex-direction: column; align-items: center; }
      @media (min-width: 720px) { .kygo-cta-card { padding: 56px 40px; } }
      .kygo-cta-card::before { content: ''; position: absolute; top: -160px; right: -160px; width: 520px; height: 520px; background: radial-gradient(closest-side, rgba(34,197,94,0.30), transparent); pointer-events: none; }
      .kygo-cta-card::after { content: ''; position: absolute; bottom: -180px; left: -180px; width: 480px; height: 480px; background: radial-gradient(closest-side, rgba(34,197,94,0.12), transparent); pointer-events: none; }
      .kygo-cta-card .cta-pill { position: relative; display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.16); color: #6EE7A0; padding: 6px 14px; border-radius: 999px; font-family: var(--font-display); font-size: 12px; font-weight: 600; border: 1px solid rgba(34,197,94,0.25); }
      .kygo-cta-card .cta-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 8px var(--kygo-green); }
      .kygo-cta-card h3 { position: relative; font-family: var(--font-display); font-weight: 600; color: #fff; font-size: clamp(26px, 4.5vw, 42px); line-height: 1.05; letter-spacing: -0.01em; margin: 18px 0 14px; max-width: 24ch; }
      .kygo-cta-card h3 span { color: var(--kygo-green); }
      .kygo-cta-card p { position: relative; color: rgba(255,255,255,0.72); font-size: clamp(14px, 1.6vw, 16px); line-height: 1.6; max-width: 56ch; margin: 0 auto 24px; }
      .kygo-cta-card .cta-btn-row { position: relative; display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; width: 100%; }
      @media (max-width: 560px) { .kygo-cta-card .cta-btn-row .btn-lg { width: 100%; justify-content: center; } }
      .kygo-cta-card .cta-works { position: relative; margin-top: 26px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: rgba(255,255,255,0.6); font-size: 13px; }
      .kygo-cta-card .cta-badges { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; justify-content: center; }
      .kygo-cta-card .cta-badges img { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); padding: 4px; object-fit: contain; }

      /* Explorer controls */
      .explorer-controls { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
      .search-wrap { position: relative; flex: 1; min-width: 220px; }
      .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--fg-3); }
      .search-icon .ico { width: 17px; height: 17px; }
      .fx-search { width: 100%; font-family: var(--font-body); font-size: 14px; padding: 12px 14px 12px 40px; border-radius: 12px; border: 1.5px solid var(--border-subtle); background: #fff; color: var(--fg-1); transition: border-color .15s; }
      .fx-search:focus { outline: none; border-color: var(--kygo-green); }

      /* Filter chips */
      .dir-chipbar { display: flex; flex-wrap: wrap; gap: 16px 24px; align-items: flex-end; padding: 18px 20px; background: var(--bg-raised); border: 1px solid var(--border-subtle); border-radius: 16px; margin-bottom: 16px; }
      .chip-group { display: flex; flex-direction: column; gap: 8px; }
      .chip-group-label { font-family: var(--font-display); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--fg-3); }
      .chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
      .filter-chip { font-family: var(--font-body); font-size: 13px; font-weight: 600; padding: 7px 13px; border-radius: 999px; border: 1.5px solid var(--border-subtle); background: #fff; color: var(--fg-2); cursor: pointer; transition: all .15s ease; }
      .filter-chip:hover { border-color: var(--kygo-green); color: var(--kygo-green-dark); }
      .filter-chip.active { background: var(--kygo-green); border-color: var(--kygo-green); color: #fff; }
      .filter-reset { align-self: flex-end; margin-left: auto; font-family: var(--font-body); font-size: 13px; font-weight: 600; padding: 7px 13px; border-radius: 999px; border: 0; background: transparent; color: var(--fg-3); cursor: pointer; }
      .filter-reset:hover { color: var(--kygo-green-dark); }
      .fx-count { font-size: 13px; color: var(--fg-3); margin-bottom: 18px; }
      .fx-count strong { color: var(--fg-1); }
      .empty-state { grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--fg-2); background: #fff; border: 1.5px dashed var(--border-subtle); border-radius: 18px; }
      .link-btn { border: 0; background: none; color: var(--kygo-green-dark); font-weight: 600; cursor: pointer; font-size: inherit; }

      /* Category dropdowns (collapsible sections) */
      .fx-groups { display: flex; flex-direction: column; gap: 12px; }
      .fxcat { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 16px; overflow: hidden; }
      .fxcat > summary { list-style: none; cursor: pointer; display: flex; align-items: center; gap: 12px; padding: 15px 18px; }
      .fxcat > summary::-webkit-details-marker { display: none; }
      .fxcat > summary:hover { background: var(--bg-surface); }
      .fxcat-ico { width: 36px; height: 36px; border-radius: 10px; background: var(--kygo-green-light); color: var(--kygo-green-dark); display: inline-flex; align-items: center; justify-content: center; flex: none; }
      .fxcat-ico .ico { width: 18px; height: 18px; }
      .fxcat-label { flex: 1; min-width: 0; font-family: var(--font-display); font-weight: 600; font-size: 17px; color: var(--fg-1); line-height: 1.2; }
      .fxcat-count { font-family: var(--font-display); font-weight: 600; font-size: 12px; color: var(--fg-2); background: var(--bg-raised); padding: 3px 10px; border-radius: 999px; flex: none; }
      .fxcat-chev { color: var(--fg-3); flex: none; }
      .fxcat-chev .ico { width: 18px; height: 18px; transition: transform .25s; }
      .fxcat[open] .fxcat-chev .ico { transform: rotate(180deg); color: var(--kygo-green-dark); }
      .fxcat-body { padding: 0 12px 12px; display: flex; flex-direction: column; gap: 8px; }

      /* Factor row (one row per factor inside a category, click to expand) */
      .fx-acc { background: #fff; border: 1px solid var(--border-subtle); border-radius: 11px; overflow: hidden; transition: border-color .2s, box-shadow .2s; scroll-margin-top: 90px; }
      .fx-acc[open] { box-shadow: var(--shadow-md); border-color: var(--kygo-green); }
      .fx-acc.flash { border-color: var(--kygo-green); box-shadow: 0 0 0 4px rgba(34,197,94,0.18); }
      .fx-acc > summary { list-style: none; cursor: pointer; display: flex; align-items: center; gap: 11px; padding: 9px 13px; }
      .fx-acc > summary::-webkit-details-marker { display: none; }
      .fx-acc > summary:hover { background: var(--bg-surface); }
      .fx-dir { width: 27px; height: 27px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; flex: none; }
      .fx-dir .ico { width: 14px; height: 14px; }
      .fx-dir.dir-pos { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .fx-dir.dir-neg { background: var(--bg-raised); color: var(--fg-2); }
      .fx-dir.dir-neu { background: var(--bg-raised); color: var(--fg-3); }
      .fx-dir.dir-var { background: var(--bg-raised); color: var(--fg-2); }
      .fx-dir.dir-pred { background: var(--kygo-dark); color: #fff; }
      .fx-acc-id { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
      .fx-acc-cat { font-family: var(--font-display); font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--fg-3); }
      .fx-acc-name { font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--fg-1); line-height: 1.2; }
      .dir-badge { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-display); font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
      .dir-badge.dir-pos { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .dir-badge.dir-neg { background: var(--bg-raised); color: var(--fg-2); }
      .dir-badge.dir-neu { background: var(--bg-raised); color: var(--fg-3); }
      .dir-badge.dir-var { background: var(--bg-raised); color: var(--fg-2); }
      .dir-badge.dir-pred { background: var(--kygo-dark); color: #fff; }
      .ev-badge { font-family: var(--font-display); font-size: 10px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; padding: 3px 9px; border-radius: 999px; white-space: nowrap; }
      .ev-badge.ev-strong { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .ev-badge.ev-moderate-strong { background: rgba(34,197,94,0.12); color: var(--kygo-green-dark); }
      .ev-badge.ev-moderate { background: var(--bg-raised); color: var(--fg-2); }
      .ev-badge.ev-weak { background: transparent; color: var(--fg-3); box-shadow: inset 0 0 0 1px var(--border-subtle); }
      .fx-chev { color: var(--fg-3); flex: none; }
      .fx-chev .ico { width: 16px; height: 16px; transition: transform .2s; }
      .fx-acc[open] .fx-chev .ico { transform: rotate(90deg); color: var(--kygo-green-dark); }
      .fx-hide-sm, .fx-hide-md { display: inline-flex; }
      @media (max-width: 600px) { .fx-hide-sm { display: none; } }
      @media (max-width: 720px) { .fx-hide-md { display: none; } }
      .fx-acc-body { padding: 0 16px 16px 56px; display: flex; flex-direction: column; gap: 12px; }
      @media (max-width: 480px) { .fx-acc-body { padding-left: 16px; } }
      .fx-plain { font-size: 14px; line-height: 1.55; color: var(--fg-1); margin: 0; }
      .fx-dose { display: flex; gap: 9px; align-items: flex-start; background: var(--bg-surface); border-radius: 10px; padding: 10px 12px; font-size: 12.5px; line-height: 1.45; color: var(--fg-2); }
      .fx-dose-ico { width: 22px; height: 22px; border-radius: 6px; background: var(--kygo-green-light); color: var(--kygo-green-dark); display: inline-flex; align-items: center; justify-content: center; flex: none; }
      .fx-dose-ico .ico { width: 13px; height: 13px; }
      .fx-dose strong { color: var(--fg-1); font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3px; margin-right: 4px; }
      .fx-keyblock { border-top: 1px solid var(--border-subtle); padding-top: 12px; }
      .fx-key-label { font-family: var(--font-display); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--fg-3); }
      .fx-keyblock p { margin: 6px 0 0; font-size: 13px; line-height: 1.6; color: var(--fg-2); }
      .fx-src { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-body); font-size: 12.5px; font-weight: 600; color: var(--kygo-green-dark); }
      .fx-src .ico { width: 13px; height: 13px; transition: transform .15s; }
      .fx-src:hover .ico { transform: translate(1px,-1px); }

      /* Blog CTA */
      .blog-cta { display: grid; grid-template-columns: auto 1fr auto; gap: 18px; align-items: center; background: linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(34,197,94,0.02) 100%); border: 1.5px solid var(--kygo-green-light); border-radius: 18px; padding: 22px; transition: all .25s var(--ease-out); color: var(--fg-1); }
      .blog-cta:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); transform: translateY(-2px); }
      .blog-cta-tag { display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 999px; background: #fff; border: 1.5px solid var(--kygo-green-light); color: var(--kygo-green-dark); font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; white-space: nowrap; }
      .blog-cta-body { min-width: 0; }
      .blog-cta-kicker { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--kygo-green-dark); margin-bottom: 4px; }
      .blog-cta-title { font-family: var(--font-display); font-size: clamp(15px, 2vw, 18px); font-weight: 600; color: var(--fg-1); line-height: 1.3; }
      .blog-cta-sub { font-size: 13px; color: var(--fg-2); margin-top: 4px; line-height: 1.5; }
      .blog-cta-arrow { width: 44px; height: 44px; border-radius: 50%; background: var(--kygo-green); color: #fff; display: inline-flex; align-items: center; justify-content: center; flex: none; box-shadow: 0 4px 12px rgba(34,197,94,0.30); }
      @media (max-width: 600px) {
        .blog-cta { grid-template-columns: 1fr auto; grid-template-areas: 'tag arrow' 'body body'; padding: 18px; gap: 14px; }
        .blog-cta-tag { grid-area: tag; justify-self: start; }
        .blog-cta-arrow { grid-area: arrow; width: 40px; height: 40px; }
        .blog-cta-body { grid-area: body; }
      }

      /* FAQ + Sources (details) */
      .faq { display: flex; flex-direction: column; gap: 10px; }
      .faq details { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; padding: 4px 20px; transition: border-color .2s; }
      .faq details[open] { border-color: var(--kygo-green); }
      .faq summary { list-style: none; padding: 16px 0; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 14px; }
      .faq summary::-webkit-details-marker { display: none; }
      .faq summary::after { content: '+'; color: var(--kygo-green-dark); font-weight: 600; font-size: 22px; transition: transform .2s; line-height: 1; }
      .faq details[open] summary::after { content: '−'; }
      .faq .body { padding: 0 0 16px; color: var(--fg-2); font-size: 14px; line-height: 1.65; }

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
      .tool-footer { padding: 56px 20px 40px; background: var(--kygo-light); color: var(--fg-2); border-top: 1px solid var(--border-subtle); }
      .tool-footer .container { max-width: 720px; margin: 0 auto; text-align: center; }
      .footer-brand { display: inline-flex; align-items: center; gap: 10px; color: var(--fg-1); font-family: var(--font-display); font-weight: 700; font-size: 17px; }
      .footer-logo { width: 28px; height: 28px; }
      .footer-tagline { color: var(--fg-3); font-size: 14px; margin: 10px 0 22px; }
      .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 18px; margin-bottom: 28px; font-size: 14px; }
      .footer-links a { color: var(--fg-2); }
      .footer-links a:hover { color: var(--kygo-green-dark); }
      .footer-disclaimer { font-size: 12px; color: var(--fg-3); line-height: 1.6; max-width: 620px; margin: 0 auto 14px; }
      .footer-copyright { font-size: 12px; color: var(--fg-3); margin: 4px 0; }

      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .qa-item, .fx-acc { transition: none; }
      }
    `;
  }
}

customElements.define('kygo-vo2max-factors', KygoVo2maxFactors);
