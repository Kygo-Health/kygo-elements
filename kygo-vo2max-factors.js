/**
 * Kygo Health — VO2 Max Factor Explorer
 * Tag name: kygo-vo2max-factors
 * Interactive library of the factors that move VO2 max — training, nutrition,
 * environment, physiology, lifestyle, clinical — each with direction, evidence
 * grade, key finding, plain-English takeaway, optional dose/how-to, and an
 * anchored peer-reviewed source. Built from vo2research.md (sources #1–35, #48).
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
    this._expandedSource = null;
    this._category = 'all';
    this._dir = new Set();
    this._evidence = new Set();
    this._sort = 'category';
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
        key: 'vs steady cardio (MICT), only long-interval (≥2 min), high-volume (≥15 min), 4–12 week HIIT beat MICT (SMD 0.65–1.07); vs no training SMD up to 2.48. 53 RCTs.',
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
      { id: 'sit', cat: 'exercise', name: 'Sprint interval training (SIT)', dir: 'positive', dirLabel: 'Raises', ev: 'strong',
        key: 'Meta-analysis of 19 studies: brief all-out sprints (e.g. repeated ~30 s efforts) over 2–8 weeks significantly raised VO2 max in sedentary and recreationally active adults.',
        plain: 'Very short, very hard sprint sessions reliably raise VO2 max, even with little total work. Great low-time option, but they are genuinely unpleasant.',
        dose: 'Repeated ~30 s all-out efforts · 2–8 weeks', src: 26, srcLabel: 'Sloth et al. 2013' },
      { id: 'resistance', cat: 'exercise', name: 'Resistance training (alone)', dir: 'positive', dirLabel: 'Raises (modest)', ev: 'moderate',
        key: 'Meta-analysis in healthy older adults (22 studies): resistance training alone improved VO2 peak (~+1.9 mL/kg/min), but less than aerobic or interval training.',
        plain: 'Lifting gives a modest VO2 max bump, especially if you are deconditioned, but cardio and intervals raise it more. Best used alongside, not instead of, aerobic work.',
        dose: null, src: 27, srcLabel: 'Smart et al. 2022' },
      { id: 'detraining', cat: 'exercise', name: 'Detraining (stopping training)', dir: 'negative', dirLabel: 'Lowers', ev: 'strong',
        key: 'Meta of 21 athlete studies: VO2 max fell after short-term (<30 days) cessation (ES −0.62, avg −3.93%) and more after long-term (30–90 days) cessation (ES −1.42, avg −9.43%). Higher-trained athletes lose more.',
        plain: 'Fitness is use-it-or-lose-it. You start losing VO2 max within ~2 weeks of stopping, and the fitter you are the more you have to lose.',
        dose: 'Light activity during a layoff blunts the long-term loss', src: 8, srcLabel: 'Zheng et al. 2022' },
      { id: 'overtraining', cat: 'exercise', name: 'Overtraining / non-functional overreaching', dir: 'negative', dirLabel: 'Lowers', ev: 'moderate',
        key: 'ECSS/ACSM consensus: too much training with too little recovery causes prolonged performance decrements, including reduced VO2 max, that take weeks to months to resolve.',
        plain: 'More is not always better. Pushing past recovery can stall or drop your VO2 max. If your fitness is sliding despite hard training, you may be under-recovered, not under-trained.',
        dose: null, src: 20, srcLabel: 'Meeusen et al. 2013' },
      { id: 'tapering', cat: 'exercise', name: 'Tapering (pre-event)', dir: 'positive', dirLabel: 'Maintains / slight raise', ev: 'strong',
        key: 'Meta-analysis of 27 studies: a ~2-week taper that cuts training volume by 41–60% (keeping intensity) maximizes performance; VO2 max is maintained or slightly improved as fatigue clears.',
        plain: 'Backing off volume before a goal event does not cost you VO2 max. It sheds fatigue so your existing fitness shows up on the day.',
        dose: '~2-week taper · cut volume 41–60% · keep intensity', src: 31, srcLabel: 'Bosquet et al. 2007' },
      { id: 'concurrent', cat: 'exercise', name: 'Concurrent training (lifting + cardio)', dir: 'neutral', dirLabel: 'Neutral for VO2 max', ev: 'moderate',
        key: 'Meta-analysis: adding strength work to endurance training does not meaningfully reduce VO2 max gains; the classic "interference effect" mainly blunts strength/power.',
        plain: 'You can lift and do cardio in the same program without hurting your VO2 max. Interference mostly costs strength gains, not aerobic ones.',
        dose: null, src: 32, srcLabel: 'Gao & Yu 2023' },

      // ── Nutrition & Supplements ──
      { id: 'iron', cat: 'nutrition', name: 'Iron (when deficient)', dir: 'positive', dirLabel: 'Raises (if deficient)', ev: 'strong',
        key: 'Meta of 24 RCTs in women of reproductive age: daily iron raised relative VO2 max by 2.35 mL/kg/min (95% CI 0.82–3.88, p=0.003) and lowered submaximal heart rate.',
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
        plain: 'Creatine is great for strength and power, but it adds water weight, and since VO2 max is measured per kg, the number can dip slightly. It does not improve aerobic capacity.',
        dose: null, src: 13, srcLabel: 'Gras et al. 2023' },
      { id: 'beta-alanine', cat: 'nutrition', name: 'Beta-alanine', dir: 'neutral', dirLabel: 'No effect on VO2 max', ev: 'moderate',
        key: 'ISSN position stand: beta-alanine raises muscle carnosine and helps efforts lasting ~30 s to 10 min, but does not increase VO2 max.',
        plain: 'Useful for buffering "the burn" in short hard efforts. It does not raise your VO2 max ceiling.',
        dose: null, src: 14, srcLabel: 'Trexler et al. 2015 (ISSN)' },
      { id: 'bicarbonate', cat: 'nutrition', name: 'Sodium bicarbonate', dir: 'neutral', dirLabel: 'No effect on VO2 max', ev: 'moderate',
        key: 'Systematic review: bicarbonate buffers exercise acidosis and aids high-intensity efforts (especially >4 min), but is not shown to raise VO2 max.',
        plain: '"Baking soda" loading helps you tolerate the burn in hard efforts. It does not raise your aerobic ceiling.',
        dose: null, src: 18, srcLabel: 'Hadzic et al. 2019' },
      { id: 'vitamin-d', cat: 'nutrition', name: 'Vitamin D', dir: 'neutral', dirLabel: 'No consistent effect', ev: 'moderate',
        key: 'Network meta-analysis of 6 supplements (30 RCTs, 693 athletes): none, including vitamin D, significantly raised VO2 max. Deficiency-correction studies are mixed.',
        plain: 'Worth keeping vitamin D in normal range for general health, but supplementing it does not reliably raise VO2 max unless you were deficient.',
        dose: null, src: 19, srcLabel: 'Deng et al. 2025' },
      { id: 'omega-3', cat: 'nutrition', name: 'Omega-3 (fish oil)', dir: 'neutral', dirLabel: 'No consistent effect', ev: 'moderate',
        key: 'ISSN position stand: omega-3 (EPA/DHA) chiefly lowers the oxygen cost of submaximal work and exercising heart rate; evidence for raising VO2 max itself is inconsistent.',
        plain: 'Fish oil may make a given effort feel a touch easier and is good for general health, but it is not a reliable way to raise your VO2 max ceiling.',
        dose: null, src: 23, srcLabel: 'Jäger et al. 2024 (ISSN)' },

      // ── Environment ──
      { id: 'altitude-lhtl', cat: 'environment', name: 'Altitude (live high, train low)', dir: 'positive', dirLabel: 'Raises', ev: 'moderate',
        key: 'Elite orienteers living at 2,500 m (18 h/day) and training lower for 24 days raised hemoglobin mass (805→848 g) and VO2 max (3,515→3,660 mL/min); sea-level controls did not change.',
        plain: 'Sleeping at altitude builds more oxygen-carrying red cells, which can lift VO2 max. Evidence is from small elite-athlete studies and the effect is still debated.',
        dose: 'Sleep high (~2,500 m, 18 h/day), train low · ~3–4 weeks', src: 7, srcLabel: 'Wehrlin et al. 2006' },
      { id: 'acute-altitude', cat: 'environment', name: 'Acute altitude (being at altitude)', dir: 'negative', dirLabel: 'Lowers (on the spot)', ev: 'strong',
        key: 'VO2 max drops ~6–8% per 1,000 m above sea level in elite athletes; about half recovers with ~2 weeks of acclimatization.',
        plain: 'The thinner the air, the lower your VO2 max on the spot. Your watch will read lower at elevation until you adapt.',
        dose: null, src: 7, srcLabel: 'Established altitude-physiology literature (cf. Wehrlin 2006)' },
      { id: 'heat-acclimation', cat: 'environment', name: 'Heat acclimation', dir: 'positive', dirLabel: 'Raises', ev: 'moderate',
        key: 'Meta-analysis: repeated heat exposure raises VO2 max a small-to-moderate-large amount (larger tested in heat). A key trial showed +5% cool / +8% hot via ~6.5% plasma-volume expansion.',
        plain: 'Training in the heat expands blood plasma and can nudge VO2 max up, similar in spirit to altitude. Clearest when you are also tested in heat.',
        dose: 'Repeated heat exposure; effect via plasma-volume expansion', src: 12, srcLabel: 'Waldron et al. 2021 / Lorenzo 2010' },
      { id: 'air-pollution', cat: 'environment', name: 'Air pollution (PM2.5)', dir: 'negative', dirLabel: 'Lowers / blunts gains', ev: 'moderate',
        key: 'Systematic review: breathing polluted air during endurance exercise impairs cardiopulmonary responses and can blunt the aerobic-fitness benefit of training.',
        plain: 'Hard training in heavy traffic or smog works against you. Favor cleaner air and times of day when you can.',
        dose: null, src: 28, srcLabel: 'González-Rojas et al. 2025' },
      { id: 'hypoxic-training', cat: 'environment', name: 'Hypoxic training methods', dir: 'positive', dirLabel: 'Raises (varies by method)', ev: 'moderate',
        key: 'Network meta-analysis (59 studies): live-high/train-low, live-high/train-high, and intermittent hypoxic training all beat normoxic training; LHTL + low-altitude training ranks best.',
        plain: 'Structured altitude/hypoxia protocols can raise VO2 max, but the method matters: sleeping high while training low is the most dependable. A hypoxic mask alone is the weakest version.',
        dose: 'Live-high/train-low ranks most reliable', src: 33, srcLabel: 'Feng et al. 2023' },

      // ── Demographics & Physiology ──
      { id: 'body-fat', cat: 'demographics', name: 'Body fat / excess weight', dir: 'negative', dirLabel: 'Lowers (per-kg)', ev: 'strong',
        key: 'VO2 max is expressed per kg, so carrying more fat lowers the number. In adults with overweight/obesity, training raised relative VO2 max by 3.82 mL/kg/min (66 RCTs, n=3,964).',
        plain: 'Because the score is "per kilo," losing fat raises your VO2 max number even if your heart and lungs do not change. Training plus fat loss is the big lever here.',
        dose: 'Training + fat loss; the score is per kg of body weight', src: 10, srcLabel: 'van Baak et al. 2021' },
      { id: 'age', cat: 'demographics', name: 'Age', dir: 'negative', dirLabel: 'Lowers', ev: 'strong',
        key: 'Baltimore Longitudinal Study (n=810, ages 21–87): peak VO2 decline accelerates each decade rather than being linear, and is faster in men.',
        plain: 'VO2 max drops with age, and the drop speeds up the older you get. Single snapshots across ages make aging look gentler than it really is.',
        dose: null, src: 3, srcLabel: 'Fleg et al. 2005' },
      { id: 'immobilization', cat: 'demographics', name: 'Immobilization / bed rest', dir: 'negative', dirLabel: 'Lowers (severe)', ev: 'strong',
        key: 'Dallas Bed Rest Study (5 men): 3 weeks of strict bed rest cut VO2 max ~27%, reversed by 8 weeks of training. A 40-year follow-up found 40 years of aging caused about the same proportional drop.',
        plain: 'Extended inactivity is brutally fast at erasing fitness. Three weeks flat on your back cost these men as much VO2 max as four decades of aging.',
        dose: null, src: 11, srcLabel: 'Saltin et al. 1968' },
      { id: 'blood-donation', cat: 'demographics', name: 'Blood donation (acute)', dir: 'negative', dirLabel: 'Lowers (temporary)', ev: 'moderate',
        key: 'Systematic review: mean VO2 max reduction after ~500 mL whole-blood donation (medium effect size), via reduced cardiac output and oxygen-carrying capacity; ~4–11% acute drop, recovering over ~2–3 weeks.',
        plain: 'Donating blood temporarily dents your VO2 max because you have fewer red cells to carry oxygen. It bounces back in a couple of weeks — time donations away from key events.',
        dose: null, src: 16, srcLabel: 'Johnson et al. 2019' },
      { id: 'dehydration', cat: 'demographics', name: 'Dehydration / hypohydration', dir: 'negative', dirLabel: 'Lowers', ev: 'strong',
        key: 'Losing more than ~2% of body mass as water lowers maximal aerobic capacity, mainly by shrinking plasma volume (lower stroke volume and cardiac output). Worse in the heat.',
        plain: 'Showing up dehydrated lowers your VO2 max on the day because there is less blood volume to pump. Hot conditions make it worse.',
        dose: 'Avoid >2% body-mass water loss before testing or hard efforts', src: 25, srcLabel: 'Cheuvront & Sawka 2010' },
      { id: 'genetics', cat: 'demographics', name: 'Genetics (trainability)', dir: 'variable', dirLabel: 'Varies by person', ev: 'strong',
        key: 'HERITAGE Family Study (n=481, 20-wk identical training): mean gain ~400 mL/min but ranged from no gain to >1.0 L/min. ~47% of the response was heritable.',
        plain: 'How much your VO2 max improves from the same training is roughly half genetic. Some people are high responders, some barely move. It runs in families.',
        dose: null, src: 4, srcLabel: 'Bouchard et al. 1999 (HERITAGE)' },
      { id: 'sex', cat: 'demographics', name: 'Sex', dir: 'variable', dirLabel: 'Varies', ev: 'moderate',
        key: '~10–12% endurance performance gap. Even adjusted per kg or per fat-free mass, men average ~5–10% higher VO2 max, driven mainly by greater oxygen delivery (higher hemoglobin mass, larger heart).',
        plain: 'Men average higher VO2 max largely because they carry more oxygen per unit of blood and have bigger hearts. Part of the gap remains even after correcting for body size.',
        dose: null, src: 5, srcLabel: 'Santisteban et al. 2022' },

      // ── Lifestyle ──
      { id: 'smoking', cat: 'lifestyle', name: 'Smoking', dir: 'negative', dirLabel: 'Lowers', ev: 'moderate',
        key: 'Current smokers had lower estimated VO2 max (38.8) than never-smokers (41.6) and former smokers (41.4). Carbon monoxide binds hemoglobin ~200× harder than oxygen, cutting oxygen delivery.',
        plain: 'Smoking lowers your aerobic ceiling, mostly by hogging the oxygen seats on your red blood cells. The good news: quitters in this study matched never-smokers, so it appears reversible.',
        dose: null, src: 15, srcLabel: 'Caci et al. 2024' },
      { id: 'alcohol', cat: 'lifestyle', name: 'Alcohol (previous-day)', dir: 'negative', dirLabel: 'Lowers (performance)', ev: 'moderate',
        key: 'RCT (n=12): a previous-evening alcohol dose cut next-morning cycling time to exhaustion by ~11% (181 vs 203 s); strength tests were unaffected. Effect is on endurance capacity rather than a proven VO2 max change.',
        plain: 'Drinking the night before a hard session measurably hurts endurance the next day. The hit is to how long you can hold an effort, more than to your VO2 max ceiling.',
        dose: null, src: 24, srcLabel: 'Levitt et al. 2022' },
      { id: 'sleep-deprivation', cat: 'lifestyle', name: 'Sleep deprivation', dir: 'negative', dirLabel: 'Lowers (performance)', ev: 'moderate',
        key: 'Meta-analysis (45 studies): sleep deprivation impairs aerobic endurance and raises perceived exertion. Acute loss does not reliably change measured VO2 max, but chronic poor sleep is linked to lower VO2 max and blunts training gains.',
        plain: 'A bad night mostly hurts how long and how hard you can go, not your peak number on a single test. But consistently short sleep undercuts the fitness you build over time.',
        dose: null, src: 29, srcLabel: 'Kong et al. 2025' },
      { id: 'sauna', cat: 'lifestyle', name: 'Sauna bathing (habitual)', dir: 'positive', dirLabel: 'Raises', ev: 'moderate',
        key: 'Kuopio cohort + small RCT: regular sauna use is associated with higher cardiorespiratory fitness, and adding post-exercise sauna to training improved VO2 by ~2.7 mL/kg/min versus exercise alone.',
        plain: 'Sauna triggers heart-rate and plasma-volume responses a bit like exercise, and stacking it onto training may give a small extra VO2 max bump.',
        dose: 'Regular post-exercise sauna added to training (~+2.7 mL/kg/min in one RCT)', src: 30, srcLabel: 'Kunutsor et al. 2024' },
      { id: 'sedentary', cat: 'lifestyle', name: 'Sedentary behavior (sitting time)', dir: 'negative', dirLabel: 'Lowers', ev: 'moderate',
        key: 'In 16,025 adults, more daily sitting was associated with lower cardiorespiratory fitness, independent of exercise, with the strongest link in otherwise inactive people.',
        plain: 'Long sitting days drag down your fitness even if you also work out. Breaking up sitting matters on top of your training, not instead of it.',
        dose: null, src: 34, srcLabel: 'Eriksen et al. 2016' },
      { id: 'cold-water', cat: 'lifestyle', name: 'Cold-water immersion (post-training)', dir: 'neutral', dirLabel: 'Neutral for VO2 max', ev: 'moderate',
        key: 'Meta-analysis: routinely ice-bathing after sessions blunts strength and power gains (SMD −0.60) but does not compromise endurance/aerobic adaptations.',
        plain: 'Ice baths mainly cost you strength gains, not VO2 max. For endurance, regular cold plunges appear fine; if you are chasing strength, use them sparingly.',
        dose: null, src: 35, srcLabel: 'Malta et al. 2021' },

      // ── Clinical ──
      { id: 'long-covid', cat: 'clinical', name: 'Long COVID', dir: 'negative', dirLabel: 'Lowers', ev: 'strong',
        key: 'Meta-analysis (9 studies, 464 symptomatic vs 359): peak VO2 was 4.9 mL/kg/min lower in people with ongoing symptoms 3+ months after infection (deconditioning, dysfunctional breathing, impaired O2 extraction).',
        plain: 'Lingering COVID symptoms come with a measurably lower VO2 max, comparable to deconditioning from bed rest. Some is reversible with graded reconditioning.',
        dose: null, src: 17, srcLabel: 'Durstenfeld et al. 2022' },
      { id: 'type-2-diabetes', cat: 'clinical', name: 'Type 2 diabetes', dir: 'negative', dirLabel: 'Lowers', ev: 'strong',
        key: 'Meta-analysis (77 studies): people with type 2 diabetes averaged 5.84 mL/kg/min lower VO2 max than those without (~20% lower), driven by cardiac, microvascular, and mitochondrial impairments.',
        plain: 'Type 2 diabetes meaningfully lowers aerobic fitness, and low fitness in turn predicts worse outcomes. Exercise that raises VO2 max is one of the highest-value interventions here.',
        dose: null, src: 22, srcLabel: 'Macedo et al. 2023' },
      { id: 'heart-failure', cat: 'clinical', name: 'Heart failure (VO2 max as prognosis)', dir: 'negative', dirLabel: 'Lowers (prognostic)', ev: 'strong',
        key: 'Heart failure lowers peak VO2, and the value is prognostic: in the landmark CPET study, peak VO2 ≤14 mL/kg/min marked the worst-prognosis group and became a heart-transplant timing threshold.',
        plain: 'The heart can’t deliver enough oxygen, so VO2 max falls and is one of the strongest predictors of survival in heart failure. It is used to time transplant decisions.',
        dose: null, src: 21, srcLabel: 'Mancini et al. 1991' },
      { id: 'mortality', cat: 'clinical', name: 'Low fitness as a mortality risk factor', dir: 'predictor', dirLabel: 'Predicts mortality', ev: 'strong',
        key: 'In 122,007 adults followed ~8.4 years, higher cardiorespiratory fitness was associated with lower all-cause mortality with no upper limit of benefit; the least-fit had ~5× the adjusted mortality risk of the fittest — comparable to or greater than smoking, diabetes, or coronary disease.',
        plain: 'Low VO2 max is one of the strongest predictors of dying early, on par with major disease risk factors — and there’s no point of diminishing returns. Raising it is among the highest-leverage things you can do for longevity.',
        dose: null, src: 48, srcLabel: 'Mandsager et al. 2018' }
    ];
  }

  // ── Sources (#1–35, #48) ────────────────────────────────────────────────

  get _sources() {
    return [
      { id: 1, tag: 'Exercise — HIIT/MICT', title: 'Wen et al. 2019 — HIIT protocols for VO2 max', cite: 'J Sci Med Sport. 2019;22(8):941-947.', detail: 'Systematic review + meta-analysis of 53 RCTs. Long-interval/high-volume HIIT beat MICT (SMD 0.65–1.07); HIIT vs control SMD 0.79–1.65.', url: 'https://doi.org/10.1016/j.jsams.2019.01.013' },
      { id: 2, tag: 'Nutrition — nitrate', title: 'Gao/Whitlock et al. 2021 — Dietary nitrate', cite: 'J Int Soc Sports Nutr. 2021;18:55.', detail: '73 studies (n=1061). Nitrate lowered submaximal VO2 (−0.04 L/min) but had no significant effect on VO2 max — benefit is economy, not ceiling.', url: 'https://doi.org/10.1186/s12970-021-00450-4' },
      { id: 3, tag: 'Physiology — age', title: 'Fleg et al. 2005 — Aerobic capacity decline with age', cite: 'Circulation. 2005;112(5):674-682.', detail: 'Baltimore Longitudinal Study, n=810 (ages 21–87). Peak VO2 decline accelerates each decade and is faster in men; cross-sectional snapshots underestimate it.', url: 'https://doi.org/10.1161/CIRCULATIONAHA.105.545459' },
      { id: 4, tag: 'Physiology — genetics', title: 'Bouchard et al. 1999 — HERITAGE Family Study', cite: 'J Appl Physiol. 1999;87(3):1003-1008.', detail: 'n=481, 20-wk identical training. Mean gain ~400 mL/min, range from no gain to >1.0 L/min; ~47% heritable, 2.5× more between-family than within-family variance.', url: 'https://doi.org/10.1152/jappl.1999.87.3.1003' },
      { id: 5, tag: 'Physiology — sex', title: 'Santisteban et al. 2022 — Sex differences in VO2 max', cite: 'Int J Environ Res Public Health. 2022;19(9):4946.', detail: 'Narrative review. ~10–12% performance gap; male advantage attributed to oxygen delivery (hemoglobin mass, cardiac size), partly persisting after normalizing to fat-free mass.', url: 'https://doi.org/10.3390/ijerph19094946' },
      { id: 6, tag: 'Nutrition — iron', title: 'Pasricha et al. 2014 — Iron & physical performance', cite: 'J Nutr. 2014;144(6):906-914.', detail: 'Meta of 24 RCTs in women of reproductive age. Daily iron raised relative VO2 max by 2.35 mL/kg/min (95% CI 0.82–3.88) and lowered submaximal HR. Corrects a deficit.', url: 'https://doi.org/10.3945/jn.113.189589' },
      { id: 7, tag: 'Environment — altitude', title: 'Wehrlin et al. 2006 — Live high, train low', cite: 'J Appl Physiol. 2006;100(6):1938-1945.', detail: '10 elite orienteers at 2,500 m (18 h/day) for 24 days. Hbmass 805→848 g, VO2 max 3,515→3,660 mL/min; sea-level controls unchanged. Small, elite-only; LHTL still debated.', url: 'https://doi.org/10.1152/japplphysiol.01284.2005' },
      { id: 8, tag: 'Exercise — detraining', title: 'Zheng et al. 2022 — Detraining & VO2 max', cite: 'BioMed Research Int. 2022;2022:2130993.', detail: 'Meta of 21 athlete studies. Short-term (<30 d) ES −0.62 (−3.93%); long-term (30–90 d) ES −1.42 (−9.43%). Higher-trained athletes lose more; light activity blunts loss.', url: 'https://doi.org/10.1155/2022/2130993' },
      { id: 9, tag: 'Nutrition — caffeine', title: 'Brietzke et al. 2017 — Caffeine & VO2 max', cite: 'Nutrition and Health. 2017;23(4):231-238.', detail: 'Placebo-perceived-as-caffeine crossover, n=9. Caffeine and placebo both raised time to exhaustion/peak power but VO2 max did not change — effect attributed to expectation (lower RPE).', url: 'https://doi.org/10.1177/0260106017723547' },
      { id: 10, tag: 'Physiology — body fat', title: 'van Baak et al. 2021 — Exercise & fitness in obesity', cite: 'Obesity Reviews. 2021;22(S4):e13239.', detail: '66 RCTs, n=3,964 adults with overweight/obesity. All training types raised relative VO2 max (MD 3.82 mL/kg/min); HIIT slightly > aerobic > resistance.', url: 'https://doi.org/10.1111/obr.13239' },
      { id: 11, tag: 'Physiology — bed rest', title: 'Saltin et al. 1968 — Dallas Bed Rest Study', cite: 'Circulation. 1968;38(5 Suppl):VII1-78.', detail: '5 men, 3 weeks strict bed rest then 8 weeks training. VO2 max fell ~27% after bed rest; 40-yr follow-up found 40 years of aging caused a comparable proportional drop.', url: 'https://pubmed.ncbi.nlm.nih.gov/5696236/' },
      { id: 12, tag: 'Environment — heat', title: 'Waldron et al. 2021 / Lorenzo 2010 — Heat acclimation', cite: 'Sports Medicine. 2021;51(7):1509-1525.', detail: 'Meta-analysis + meta-regression. Heat acclimation raises VO2 max small-to-moderate-large; the +5% cool / +8% hot and ~6.5% plasma-volume figures come from Lorenzo 2010.', url: 'https://doi.org/10.1007/s40279-021-01445-6' },
      { id: 13, tag: 'Nutrition — creatine', title: 'Gras et al. 2023 — Creatine & VO2 max', cite: 'Crit Rev Food Sci Nutr. 2023;63(21):4855-4866.', detail: 'Meta of 19 RCTs, n=424. VO2 max rose less with creatine than placebo (ES −0.32). Likely mechanism: added body water/mass, and VO2 max is per kg.', url: 'https://doi.org/10.1080/10408398.2021.2008864' },
      { id: 14, tag: 'Nutrition — beta-alanine', title: 'Trexler et al. 2015 — ISSN position stand: Beta-Alanine', cite: 'J Int Soc Sports Nutr. 2015;12:30.', detail: 'Society position stand. Beta-alanine raises muscle carnosine and helps ~30 s–10 min efforts; it is not established to increase VO2 max.', url: 'https://doi.org/10.1186/s12970-015-0090-y' },
      { id: 15, tag: 'Lifestyle — smoking', title: 'Caci et al. 2024 — Smoking & aerobic capacity', cite: 'Intern Emerg Med. 2024.', detail: 'Cross-sectional, n=70, Chester Step Test (estimated VO2 max). Current 38.8 vs never 41.6 vs former 41.4 mL/kg/min; former and never did not differ. Small, estimated.', url: 'https://doi.org/10.1007/s11739-024-03794-2' },
      { id: 16, tag: 'Physiology — blood donation', title: 'Johnson et al. 2019 — Whole-blood donation & exercise', cite: 'PLOS ONE. 2019;14(4):e0215346.', detail: 'Systematic review of 8 studies. Mean VO2 max reduction (medium effect) after ~500 mL donation via reduced cardiac output and O2-carrying capacity.', url: 'https://doi.org/10.1371/journal.pone.0215346' },
      { id: 17, tag: 'Clinical — long COVID', title: 'Durstenfeld et al. 2022 — CPET in long COVID', cite: 'JAMA Netw Open. 2022;5(10):e2236057.', detail: 'Systematic review + meta-analysis. Among symptomatic vs not, peak VO2 was 4.9 mL/kg/min lower (9 studies, >3 months post-infection).', url: 'https://doi.org/10.1001/jamanetworkopen.2022.36057' },
      { id: 18, tag: 'Nutrition — bicarbonate', title: 'Hadzic et al. 2019 — Sodium bicarbonate', cite: 'J Sports Sci Med. 2019;18(2):271-281.', detail: 'Systematic review. Bicarbonate buffers acidosis and aids high-intensity efforts (especially >4 min); it is not established to raise VO2 max.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6544001/' },
      { id: 19, tag: 'Nutrition — vitamin D', title: 'Deng et al. 2025 — Supplements network meta-analysis', cite: 'Food Science & Nutrition. 2025.', detail: 'Network meta-analysis, 30 RCTs, 693 athletes, 6 supplements. None — including vitamin D — significantly raised VO2 max (protein best for endurance). Corroborates creatine/beta-alanine/nitrate nulls.', url: 'https://doi.org/10.1002/fsn3.71243' },
      { id: 20, tag: 'Exercise — overtraining', title: 'Meeusen et al. 2013 — ECSS/ACSM overtraining consensus', cite: 'Eur J Sport Sci. 2013;13(1):1-24.', detail: 'Joint society consensus. Excess load with inadequate recovery causes overreaching/overtraining with prolonged decrements including reduced VO2 max.', url: 'https://doi.org/10.1080/17461391.2012.730061' },
      { id: 21, tag: 'Clinical — heart failure', title: 'Mancini et al. 1991 — Peak VO2 & transplant timing', cite: 'Circulation. 1991;83(3):778-786.', detail: 'Prospective CPET cohort. Peak VO2 ≤14 mL/kg/min marked the worst-prognosis group and became a heart-transplant timing threshold.', url: 'https://doi.org/10.1161/01.CIR.83.3.778' },
      { id: 22, tag: 'Clinical — type 2 diabetes', title: 'Macedo et al. 2023 — CRF in type 2 diabetes', cite: 'Arch Endocrinol Metab. 2023.', detail: 'Meta-analysis of 77 studies. VO2 max was 5.84 mL/kg/min lower in type 2 diabetes vs controls (~20% lower).', url: 'https://doi.org/10.20945/2359-4292-2023-0040' },
      { id: 23, tag: 'Nutrition — omega-3', title: 'Jäger et al. 2024 — ISSN position stand: Omega-3', cite: 'J Int Soc Sports Nutr. 2024;22(1).', detail: 'Position stand. Omega-3 mainly lowers the oxygen cost of submaximal exercise and exercising HR; evidence for raising VO2 max is inconsistent.', url: 'https://doi.org/10.1080/15502783.2024.2441775' },
      { id: 24, tag: 'Lifestyle — alcohol', title: 'Levitt et al. 2022 — Previous-day alcohol', cite: 'Int J Sports Physiol Perform. 2022;17(1):44-50.', detail: 'Randomized crossover, n=12. Prior-evening alcohol cut next-morning cycling time to exhaustion ~11% (181 vs 203 s); strength unaffected. Measures capacity, not VO2 max directly.', url: 'https://doi.org/10.1123/ijspp.2020-0790' },
      { id: 25, tag: 'Physiology — dehydration', title: 'Cheuvront & Sawka 2010 — Heat stress & dehydration', cite: 'J Appl Physiol. 2010;109(6):1989-1995.', detail: 'Mechanisms review. Hypohydration >2% body mass reduces aerobic capacity chiefly via reduced plasma volume → lower stroke volume and cardiac output; worsens as skin temperature rises.', url: 'https://doi.org/10.1152/japplphysiol.00367.2010' },
      { id: 26, tag: 'Exercise — SIT', title: 'Sloth et al. 2013 — Sprint interval training', cite: 'Scand J Med Sci Sports. 2013;23(6):e341-e352.', detail: 'Meta of 19 studies, SIT 2–8 weeks in sedentary/recreationally active adults. SIT produces significant VO2 max improvements.', url: 'https://doi.org/10.1111/sms.12092' },
      { id: 27, tag: 'Exercise — resistance', title: 'Smart et al. 2022 — Resistance training & CRF', cite: 'Age and Ageing. 2022;51(6):afac143.', detail: 'Meta of 22 studies in healthy older adults. Resistance training alone improved VO2 peak (~+1.9 mL/kg/min), less than aerobic/interval training.', url: 'https://doi.org/10.1093/ageing/afac143' },
      { id: 28, tag: 'Environment — air pollution', title: 'González-Rojas et al. 2025 — Air pollution & endurance', cite: 'Life. 2025;15(4):595.', detail: 'Systematic review. Air pollution during endurance activity impairs cardiopulmonary health; PM2.5 penetrates lungs and bloodstream and can blunt training benefit.', url: 'https://doi.org/10.3390/life15040595' },
      { id: 29, tag: 'Lifestyle — sleep', title: 'Kong et al. 2025 — Sleep deprivation & performance', cite: 'Front Physiol. 2025.', detail: 'Meta of 45 studies (16 aerobic). Sleep deprivation impairs aerobic endurance and increases RPE; acute loss does not reliably change measured VO2 max.', url: 'https://doi.org/10.3389/fphys.2025.1544286' },
      { id: 30, tag: 'Lifestyle — sauna', title: 'Kunutsor et al. 2024 — Sauna & cardiorespiratory fitness', cite: 'J Cardiopulm Rehabil Prev. 2024;44(4):295-300.', detail: 'Kuopio cohort (2,291 men) + small RCT. Habitual sauna linked to higher CRF; exercise + post-exercise sauna improved CRF +2.7 mL/kg/min vs exercise alone.', url: 'https://pubmed.ncbi.nlm.nih.gov/38836690/' },
      { id: 31, tag: 'Exercise — tapering', title: 'Bosquet et al. 2007 — Tapering & performance', cite: 'Med Sci Sports Exerc. 2007;39(8):1358-1365.', detail: 'Meta of 27 studies. A 2-week taper cutting volume 41–60% (intensity maintained) maximizes performance; VO2 max is maintained or modestly improved.', url: 'https://doi.org/10.1249/mss.0b013e31806010e0' },
      { id: 32, tag: 'Exercise — concurrent', title: 'Gao & Yu 2023 — Concurrent training & VO2 max', cite: 'Front Physiol. 2023;14:1072679.', detail: 'Meta-analysis. Concurrent training improves VO2 max; sequence affects lower-limb strength more than VO2 max — adding strength does not meaningfully blunt aerobic gains.', url: 'https://doi.org/10.3389/fphys.2023.1072679' },
      { id: 33, tag: 'Environment — hypoxic', title: 'Feng et al. 2023 — Hypoxic training network meta-analysis', cite: 'Front Physiol. 2023;14:1223037.', detail: 'Bayesian network meta-analysis, 59 studies. LHTL, LHTH, and IHT all beat normoxic training; LHTL + low-altitude training ranked best.', url: 'https://doi.org/10.3389/fphys.2023.1223037' },
      { id: 34, tag: 'Lifestyle — sitting', title: 'Eriksen et al. 2016 — Fitness, activity & sitting time', cite: 'Scand J Med Sci Sports. 2016;26(12):1435-1443.', detail: 'Cross-sectional, n=16,025. Greater sitting time inversely associated with CRF, strongest in less-active people; no association in the highly active. Observational.', url: 'https://doi.org/10.1111/sms.12608' },
      { id: 35, tag: 'Lifestyle — cold-water', title: 'Malta et al. 2021 — Regular cold-water immersion', cite: 'Sports Medicine. 2021;51(1):161-174.', detail: 'Meta of 8 studies. Regular post-training CWI blunts strength/power (SMD −0.60) but does not compromise endurance/aerobic adaptations.', url: 'https://doi.org/10.1007/s40279-020-01362-0' },
      { id: 48, tag: 'Why it matters — mortality', title: 'Mandsager et al. 2018 — Fitness & long-term mortality', cite: 'JAMA Netw Open. 2018;1(6):e183605.', detail: 'Retrospective cohort, n=122,007, follow-up 8.4 yr. CRF inversely associated with all-cause mortality with no upper limit of benefit; least-fit had ~5× the adjusted mortality risk of the fittest.', url: 'https://doi.org/10.1001/jamanetworkopen.2018.3605' }
    ];
  }

  _sourceById(id) { return this._sources.find(s => s.id === id); }

  // ── SEO light-DOM summary ───────────────────────────────────────────────

  _seoText() {
    return 'What Affects VO2 Max? An evidence-ranked explorer of 39 factors by Kygo Health, from 48 verified peer-reviewed sources. The why: in 122,007 adults (Mandsager 2018), low cardiorespiratory fitness carried ~5× the all-cause mortality risk of the fittest, with no upper limit of benefit — comparable to or greater than smoking, diabetes, or coronary disease. Biggest levers to raise VO2 max: high-intensity interval training, especially long-interval high-volume HIIT (Wen 2019, 53 RCTs); sprint interval training (Sloth 2013); moderate continuous cardio; training plus fat loss because VO2 max is measured per kg (van Baak 2021); and fixing iron deficiency, especially in menstruating women (Pasricha 2014, +2.35 mL/kg/min). What does NOT raise your VO2 max ceiling (myth-busters): dietary nitrate/beetroot juice (improves economy, not ceiling — Gao/Whitlock 2021), caffeine (ergogenic via lower perceived effort, largely placebo — Brietzke 2017), creatine (slightly lowers the per-kg number via water weight — Gras 2023), beta-alanine (Trexler 2015), sodium bicarbonate (Hadzic 2019), vitamin D unless deficient (Deng 2025), and omega-3 fish oil (Jäger 2024). Lowers VO2 max: detraining (use it or lose it — Zheng 2022), overtraining, acute altitude (~6–8% per 1,000 m), air pollution (PM2.5), excess body fat, aging (accelerates each decade — Fleg 2005), bed rest/immobilization (3 weeks ≈ 40 years of aging — Saltin 1968), blood donation, dehydration over 2% body mass, smoking, previous-day alcohol, sleep deprivation, sedentary sitting time, long COVID (−4.9 mL/kg/min), and type 2 diabetes (−5.84 mL/kg/min). Raises VO2 max: live-high/train-low altitude (Wehrlin 2006), heat acclimation, structured hypoxic training (Feng 2023), and habitual sauna bathing (Kunutsor 2024). Neutral for VO2 max: concurrent training (lifting + cardio) and post-training cold-water immersion (blunts strength, not endurance — Malta 2021). Varies by person: trainability is ~47% heritable (HERITAGE, Bouchard 1999); sex (men average ~5–10% higher via oxygen delivery — Santisteban 2022). Clinical: heart failure peak VO2 ≤14 mL/kg/min is a transplant-timing threshold (Mancini 1991). Each factor carries a direction, an evidence grade (strong or moderate), a key finding, a plain-English takeaway, dose/how-to where it exists, and an anchored source. Filter by category — Exercise, Nutrition & Supplements, Environment, Demographics & Physiology, Lifestyle, Clinical — direction, and evidence strength. Most supplements marketed for endurance change the oxygen cost of effort (economy), not VO2 max itself.';
  }

  // ── Icons ───────────────────────────────────────────────────────────────

  _icon(name) {
    const icons = {
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
      chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>',
      arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      externalLinkSm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
      bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
      pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>',
      wind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>',
      dna: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2c0 6 16 4 16 10S4 16 4 22"/><path d="M20 2c0 6-16 4-16 10s16-2 16 4"/><path d="M6 6h12M6 18h12M8.5 4.5h7M8.5 19.5h7"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
      grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'
    };
    return icons[name] || icons.info;
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

  get _dirChips() {
    return [
      { v: 'positive', l: 'Raises' }, { v: 'negative', l: 'Lowers' },
      { v: 'neutral', l: 'No effect' }, { v: 'variable', l: 'Varies' },
      { v: 'predictor', l: 'Predicts outcomes' }
    ];
  }

  // ── Filtering + sorting ─────────────────────────────────────────────────

  _matches(f) {
    if (this._category !== 'all' && f.cat !== this._category) return false;
    if (this._dir.size && !this._dir.has(f.dir)) return false;
    if (this._evidence.size && !this._evidence.has(f.ev)) return false;
    if (this._query) {
      const q = this._query.toLowerCase();
      const hay = (f.name + ' ' + f.key + ' ' + f.plain + ' ' + (f.dose || '')).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  }

  _filtered() {
    const catOrder = this._categories.map(c => c.key);
    const evRank = { strong: 0, moderate: 1 };
    const dirRank = { positive: 0, variable: 1, neutral: 2, predictor: 3, negative: 4 };
    let list = this._factors.filter(f => this._matches(f));
    if (this._sort === 'az') {
      list = list.slice().sort((a, b) => a.name.localeCompare(b.name));
    } else if (this._sort === 'evidence') {
      list = list.slice().sort((a, b) => (evRank[a.ev] - evRank[b.ev]) || (dirRank[a.dir] - dirRank[b.dir]) || a.name.localeCompare(b.name));
    } else { // category (default)
      list = list.slice().sort((a, b) => (catOrder.indexOf(a.cat) - catOrder.indexOf(b.cat)) || (evRank[a.ev] - evRank[b.ev]) || a.name.localeCompare(b.name));
    }
    return list;
  }

  _anyFilterActive() {
    return this._category !== 'all' || this._dir.size || this._evidence.size || this._query;
  }

  _updateResults() {
    const sr = this.shadowRoot;
    const filtered = this._filtered();
    const tabs = sr.querySelector('.cat-tabs');
    if (tabs) tabs.innerHTML = this._renderCatTabs();
    const dirbar = sr.querySelector('.dir-chipbar');
    if (dirbar) dirbar.innerHTML = this._renderFilterChips();
    const count = sr.querySelector('.fx-count');
    if (count) count.innerHTML = this._renderCount(filtered.length);
    const grid = sr.querySelector('.fx-grid');
    if (grid) grid.innerHTML = this._renderFactorCards(filtered);
  }

  // ── Section: category tabs ──────────────────────────────────────────────

  _renderCatTabs() {
    const total = this._factors.length;
    const tab = (key, label, icon, n) => {
      const active = this._category === key;
      return `<button class="cat-tab${active ? ' active' : ''}" data-cat="${key}" aria-pressed="${active}">
        <span class="cat-icon">${this._icon(icon)}</span>${label}<span class="cat-n">${n}</span>
      </button>`;
    };
    return tab('all', 'All factors', 'grid', total) +
      this._categories.map(c => tab(c.key, c.label, c.icon, this._factors.filter(f => f.cat === c.key).length)).join('');
  }

  // ── Section: direction + evidence chips + sort ──────────────────────────

  _renderFilterChips() {
    const dir = this._dirChips.map(c => {
      const active = this._dir.has(c.v);
      return `<button class="filter-chip${active ? ' active' : ''}" data-filter="dir" data-value="${c.v}" aria-pressed="${active}">${c.l}</button>`;
    }).join('');
    const ev = [['strong', 'Strong evidence'], ['moderate', 'Moderate evidence']].map(([v, l]) => {
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
    return `Showing <strong>${n}</strong> of ${this._factors.length} factors${this._category !== 'all' ? ` in ${this._categoryLabel(this._category)}` : ''}`;
  }

  // ── Section: factor cards ───────────────────────────────────────────────

  _renderFactorCards(factors) {
    if (!factors.length) {
      return `<div class="empty-state">No factors match those filters. <button class="link-btn" data-action="reset-filters">Reset</button></div>`;
    }
    return factors.map(f => {
      const d = this._dirMeta(f.dir);
      const s = this._sourceById(f.src);
      return `
        <article class="fx-card ${d.cls}" data-id="${f.id}">
          <div class="fx-card-head">
            <span class="fx-cat">${this._categoryLabel(f.cat)}</span>
            <span class="dir-badge ${d.cls}">${this._icon(d.icon)} ${f.dirLabel}</span>
          </div>
          <h3 class="fx-name">${f.name}</h3>
          <span class="ev-badge ev-${f.ev}">${f.ev === 'strong' ? 'Strong' : 'Moderate'} evidence</span>
          <p class="fx-plain">${f.plain}</p>
          <p class="fx-key"><span class="fx-key-label">Key finding</span> ${f.key}</p>
          ${f.dose ? `<p class="fx-dose"><span class="fx-dose-icon">${this._icon('bolt')}</span><span><strong>How to / dose:</strong> ${f.dose}</span></p>` : ''}
          ${s ? `<a class="fx-src" href="${s.url}" target="_blank" rel="noopener" data-action="source-link" data-track-label="${f.srcLabel}" data-track-position="factor-card">${f.srcLabel} ${this._icon('externalLinkSm')}</a>` : ''}
        </article>`;
    }).join('');
  }

  // ── Section: quick answers ──────────────────────────────────────────────

  _renderQuickAnswers() {
    const byId = id => this._factors.find(f => f.id === id);
    const levers = ['hiit-long', 'sit', 'body-fat', 'iron'].map(byId).filter(Boolean);
    const dontBother = ['nitrate', 'caffeine', 'creatine', 'beta-alanine', 'bicarbonate', 'vitamin-d', 'omega-3'].map(byId).filter(Boolean);
    const item = (f, kind) => `
      <button class="qa-item" data-jump="${f.id}">
        <span class="qa-icon qa-${kind}">${this._icon(kind === 'lever' ? 'arrowUp' : 'minus')}</span>
        <span class="qa-text"><strong>${f.name}</strong><span class="qa-sub">${kind === 'lever' ? f.dirLabel : f.dirLabel} · ${f.srcLabel}</span></span>
      </button>`;
    return `
      <div class="qa-col qa-good">
        <h3>${this._icon('arrowUp')} Biggest levers</h3>
        <p class="qa-lead">What actually moves the needle most.</p>
        ${levers.map(f => item(f, 'lever')).join('')}
      </div>
      <div class="qa-col qa-bad">
        <h3>${this._icon('minus')} Don’t bother (for VO2 max)</h3>
        <p class="qa-lead">Popular but they won’t raise your ceiling — most change economy, not VO2 max.</p>
        ${dontBother.map(f => item(f, 'dud')).join('')}
      </div>`;
  }

  // ── Section: sources accordion ──────────────────────────────────────────

  _renderSources() {
    return this._sources.map(s => `
      <div class="src-card" data-source="${s.id}">
        <div class="src-header" tabindex="0" role="button" aria-expanded="false">
          <span class="src-num">#${s.id}</span>
          <span class="src-brand-wrap">
            <span class="src-title">${s.title}</span>
            <span class="src-tag">${s.tag}</span>
          </span>
          <span class="src-toggle">${this._icon('chevDown')}</span>
        </div>
        <div class="src-body">
          <p class="src-detail">${s.detail}</p>
          <p class="src-cite">${s.cite}</p>
          <a href="${s.url}" target="_blank" rel="noopener">View source ${this._icon('externalLink')}</a>
        </div>
      </div>`).join('');
  }

  // ── Main render ─────────────────────────────────────────────────────────

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const all = this._filtered();

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <!-- Header -->
      <header class="header">
        <div class="header-inner">
          <a href="https://www.kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" loading="lazy" />
            VO2 Max Factors
          </a>
          <a href="https://www.kygo.app" class="header-link" target="_blank" rel="noopener">
            Get Kygo App ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <!-- Hero (Mandsager mortality hook) -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge animate-on-scroll">39 FACTORS · RANKED BY RESEARCH</div>
          <h1 class="animate-on-scroll">What Actually Affects Your VO2 Max?</h1>
          <p class="hero-sub animate-on-scroll">VO2 max is the single best lab measure of cardiorespiratory fitness — and one of the strongest predictors of how long you'll live. Here's what raises it, what lowers it, and what's just hype, with every claim anchored to research.</p>
          <div class="hero-stat animate-on-scroll">
            <span class="hero-stat-num">~5×</span>
            <span class="hero-stat-text">In 122,007 adults, the <strong>least-fit had about five times the mortality risk</strong> of the fittest — with <strong>no upper limit of benefit.</strong> Low fitness rivaled smoking, diabetes, and coronary disease as a risk factor.<span class="hero-stat-src">Mandsager et al. 2018, JAMA Network Open</span></span>
          </div>
        </div>
      </section>

      <!-- Quick answers -->
      <section class="qa-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Start here: levers vs duds</h2>
          <p class="section-sub animate-on-scroll">The short version before you explore all 39. Tap any item to jump to its full card.</p>
          <div class="qa-grid animate-on-scroll">${this._renderQuickAnswers()}</div>
        </div>
      </section>

      <!-- Explorer -->
      <section class="explorer-section" id="explorer">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Explore every factor</h2>
          <p class="section-sub animate-on-scroll">Filter by category, direction, and evidence strength. Each card shows the key finding, a plain-English takeaway, dose/how-to where it exists, and its source.</p>

          <div class="cat-tabs animate-on-scroll" role="tablist">${this._renderCatTabs()}</div>

          <div class="explorer-controls animate-on-scroll">
            <div class="search-wrap">
              <span class="search-icon">${this._icon('search')}</span>
              <input type="search" class="fx-search" placeholder="Search factors (e.g. HIIT, iron, sauna)…" aria-label="Search factors" />
            </div>
            <label class="sort-wrap">
              <span>Sort</span>
              <select class="fx-sort" aria-label="Sort factors">
                <option value="category">By category</option>
                <option value="evidence">Strongest evidence first</option>
                <option value="az">A–Z</option>
              </select>
            </label>
          </div>

          <div class="dir-chipbar animate-on-scroll">${this._renderFilterChips()}</div>
          <div class="fx-count animate-on-scroll">${this._renderCount(all.length)}</div>
          <div class="fx-grid">${this._renderFactorCards(all)}</div>
        </div>
      </section>

      <!-- Companion blog cross-link -->
      <section class="blog-link-section">
        <div class="container">
          <div class="blog-link-wrap animate-on-scroll">
            <a href="https://www.kygo.app/post/what-affects-vo2-max" class="blog-link-card" target="_blank" rel="noopener">
              <span class="blog-link-icon">${this._icon('activity')}</span>
              <div class="blog-link-text">
                <span class="blog-link-title">Read the full guide</span>
                <span class="blog-link-desc">What Affects VO2 Max — the complete, sourced breakdown</span>
              </div>
              <span class="blog-link-arrow">${this._icon('arrowRight')}</span>
            </a>
          </div>
        </div>
      </section>

      <!-- App CTA -->
      <section class="blog-cta-section">
        <div class="container">
          <div class="blog-cta-wrapper animate-on-scroll">
            <div class="blog-cta">
              <div class="blog-cta-glow"></div>
              <div class="blog-cta-content">
                <div class="blog-cta-badge"><span class="pulse-dot"></span>Free Forever Plan</div>
                <h2>The Biggest Lever Is Training — The Next Is <span class="highlight">What You Eat</span></h2>
                <p>Kygo Health connects your wearable's fitness data to your nutrition, so the work you put in actually shows up.</p>
                <div class="blog-cta-buttons">
                  <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" class="blog-cta-btn" data-track-position="article-cta" target="_blank" rel="noopener">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    Download for iOS
                  </a>
                  <a href="https://www.kygo.app/android" target="_blank" rel="noopener" class="blog-cta-android-btn" data-action="android-download" data-track-position="article-cta">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                    Download for Android
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sources -->
      <section class="sources-section">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Sources</h2>
          <p class="section-sub animate-on-scroll">Every factor is anchored to a primary source, each opened and checked against the record (PubMed/PMC/journal). Tap to expand.</p>
          <div class="sources-list animate-on-scroll">${this._renderSources()}</div>
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
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Always consult a qualified healthcare provider before making health or training decisions.</p>
          <p class="footer-copyright">Anchored to peer-reviewed research, each source verified against the primary record. Last updated June 2026.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  // ── Event delegation ────────────────────────────────────────────────────

  _setupEventDelegation() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const shadow = this.shadowRoot;

    shadow.addEventListener('click', (e) => {
      const reset = e.target.closest('[data-action="reset-filters"]');
      if (reset) {
        this._category = 'all'; this._dir.clear(); this._evidence.clear(); this._query = '';
        const input = shadow.querySelector('.fx-search'); if (input) input.value = '';
        this._updateResults();
        return;
      }

      const tab = e.target.closest('.cat-tab');
      if (tab) { this._category = tab.dataset.cat; this._updateResults(); return; }

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

      const srcHeader = e.target.closest('.src-header');
      if (srcHeader) {
        const card = srcHeader.closest('.src-card');
        const key = card.dataset.source;
        this._expandedSource = this._expandedSource === key ? null : key;
        shadow.querySelectorAll('.src-card').forEach(c => {
          const open = c.dataset.source === this._expandedSource;
          c.classList.toggle('open', open);
          const h = c.querySelector('.src-header');
          if (h) h.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        return;
      }
    });

    shadow.addEventListener('input', (e) => {
      if (e.target.classList.contains('fx-search')) {
        this._query = e.target.value.trim();
        this._updateResults();
      }
    });

    shadow.addEventListener('change', (e) => {
      if (e.target.classList.contains('fx-sort')) {
        this._sort = e.target.value;
        this._updateResults();
      }
    });

    shadow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const srcHeader = e.target.closest('.src-header');
        if (srcHeader) { e.preventDefault(); srcHeader.click(); }
      }
    });
  }

  _jumpToFactor(id) {
    // Clear filters so the target is guaranteed visible, then scroll + flash.
    this._category = 'all'; this._dir.clear(); this._evidence.clear(); this._query = '';
    const input = this.shadowRoot.querySelector('.fx-search'); if (input) input.value = '';
    this._updateResults();
    requestAnimationFrame(() => {
      const card = this.shadowRoot.querySelector(`.fx-card[data-id="${id}"]`);
      if (!card) return;
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('flash');
      setTimeout(() => card.classList.remove('flash'), 1600);
    });
  }

  // ── Scroll animations ───────────────────────────────────────────────────

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
      }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
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
        'description': 'See what actually raises VO2 max and what doesn’t. 30+ training, nutrition, lifestyle & clinical factors ranked by evidence from 48 studies.',
        'applicationCategory': 'HealthApplication',
        'operatingSystem': 'Web',
        'url': 'https://www.kygo.app/tools/vo2-max-factors',
        'datePublished': '2026-06-03',
        'dateModified': '2026-06-03',
        'softwareVersion': '1.0',
        'inLanguage': 'en',
        'isAccessibleForFree': true,
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
        'alternateName': 'Kygo VO2 Max Factor Explorer',
        'featureList': 'Explore 39 VO2 max factors, filter by category/direction/evidence, search, sort by evidence strength, anchored peer-reviewed sources',
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
        'mainEntity': [
          { '@type': 'Question', 'name': 'What raises VO2 max the most?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'Training is the biggest lever: high-intensity interval training (especially long-interval, high-volume HIIT) raises VO2 max most, followed by sprint intervals and moderate continuous cardio. Because VO2 max is measured per kilogram, training plus fat loss raises the number further, and correcting iron deficiency helps in people who are low on iron.' } },
          { '@type': 'Question', 'name': 'Do supplements like beetroot, caffeine, or creatine increase VO2 max?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'No. Dietary nitrate (beetroot) improves exercise economy but does not raise the VO2 max ceiling; caffeine is ergogenic mostly via lower perceived effort; and creatine can slightly lower the per-kilogram number because it adds water weight. Beta-alanine, sodium bicarbonate, vitamin D (unless deficient), and omega-3 also do not reliably raise VO2 max.' } },
          { '@type': 'Question', 'name': 'What lowers VO2 max?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'Stopping training (detraining), overtraining without recovery, aging, excess body fat, bed rest or immobilization, dehydration, blood donation, acute altitude, air pollution, smoking, previous-day alcohol, sleep deprivation, prolonged sitting, long COVID, and type 2 diabetes all lower VO2 max.' } },
          { '@type': 'Question', 'name': 'Why does VO2 max matter for health?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'In a study of 122,007 adults, the least-fit people had roughly five times the all-cause mortality risk of the fittest, with no upper limit of benefit. Low cardiorespiratory fitness was a risk factor comparable to or greater than smoking, diabetes, or coronary artery disease.' } },
          { '@type': 'Question', 'name': 'How much of VO2 max trainability is genetic?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'About 47%. In the HERITAGE Family Study, identical 20-week training produced gains ranging from none to over 1 litre per minute, and roughly half of that response was heritable, running in families.' } }
        ]
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
        --dark: #1E293B;
        --light: #F8FAFC;
        --green: #22C55E;
        --green-dark: #16A34A;
        --green-light: rgba(34,197,94,0.1);
        --amber: #F59E0B;
        --amber-light: rgba(245,158,11,0.1);
        --red: #EF4444;
        --red-light: rgba(239,68,68,0.1);
        --blue: #3B82F6;
        --blue-light: rgba(59,130,246,0.1);
        --purple: #8B5CF6;
        --purple-light: rgba(139,92,246,0.1);
        --gray-50: #f9fafb;
        --gray-100: #F1F5F9;
        --gray-200: #E2E8F0;
        --gray-300: #CBD5E1;
        --gray-400: #94A3B8;
        --gray-600: #475569;
        --gray-700: #334155;
        --radius: 20px;
        --radius-sm: 12px;
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
      a { text-decoration: none; }
      em { font-style: italic; }

      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      /* Header */
      .header { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid var(--gray-200); }
      .header-inner { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; max-width: 1200px; margin: 0 auto; gap: 10px; }
      .logo { display: flex; align-items: center; gap: 8px; color: var(--dark); font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; min-width: 0; }
      .logo-img { height: 28px; width: auto; flex-shrink: 0; }
      .header-link { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #fff; background: var(--green); padding: 8px 16px; border-radius: 50px; transition: background 0.2s; flex-shrink: 0; white-space: nowrap; }
      .header-link:hover { background: var(--green-dark); }
      .header-link svg { width: 14px; height: 14px; }

      /* Hero */
      .hero { padding: 56px 0 28px; text-align: center; }
      .hero-badge { display: inline-block; background: var(--green-light); color: var(--green-dark); font-size: 11px; font-weight: 600; letter-spacing: 1.5px; padding: 6px 16px; border-radius: 50px; margin-bottom: 16px; }
      .hero h1 { font-size: clamp(26px, 7vw, 42px); max-width: 740px; margin: 0 auto 16px; }
      .hero-sub { color: var(--gray-600); font-size: 16px; max-width: 660px; margin: 0 auto 24px; }
      .hero-stat { display: flex; align-items: center; gap: 18px; text-align: left; max-width: 640px; margin: 0 auto; background: var(--dark); color: #fff; border-radius: var(--radius); padding: 22px 24px; }
      .hero-stat-num { font-family: 'Space Grotesk', sans-serif; font-size: clamp(40px, 11vw, 60px); font-weight: 700; color: var(--green); line-height: 1; flex-shrink: 0; }
      .hero-stat-text { font-size: 14px; color: var(--gray-200); }
      .hero-stat-text strong { color: #fff; }
      .hero-stat-src { display: block; font-size: 11px; color: var(--gray-400); font-style: italic; margin-top: 6px; }

      /* Section headings */
      .section-title { font-size: clamp(22px, 5vw, 32px); margin-bottom: 8px; }
      .section-sub { color: var(--gray-600); font-size: 15px; margin-bottom: 24px; max-width: 720px; }

      /* Quick answers */
      .qa-section { padding: 44px 0; background: #fff; }
      .qa-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
      .qa-col { border: 1px solid var(--gray-200); border-radius: var(--radius); padding: 20px; }
      .qa-good { background: var(--green-light); border-color: rgba(34,197,94,0.3); }
      .qa-bad { background: var(--gray-50); }
      .qa-col h3 { display: flex; align-items: center; gap: 8px; font-size: 16px; margin-bottom: 4px; }
      .qa-col h3 svg { width: 18px; height: 18px; }
      .qa-good h3 svg { color: var(--green-dark); }
      .qa-bad h3 svg { color: var(--gray-400); }
      .qa-lead { font-size: 13px; color: var(--gray-600); margin-bottom: 14px; }
      .qa-item { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius-sm); padding: 11px 14px; margin-bottom: 8px; cursor: pointer; font-family: inherit; transition: box-shadow 0.2s, transform 0.1s; }
      .qa-item:last-child { margin-bottom: 0; }
      .qa-item:hover { box-shadow: var(--shadow); transform: translateY(-1px); }
      .qa-icon { width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .qa-icon svg { width: 15px; height: 15px; }
      .qa-lever { background: var(--green-light); color: var(--green-dark); }
      .qa-dud { background: var(--gray-100); color: var(--gray-400); }
      .qa-text { display: flex; flex-direction: column; min-width: 0; }
      .qa-text strong { font-size: 14px; font-weight: 600; color: var(--dark); }
      .qa-sub { font-size: 12px; color: var(--gray-400); }

      /* Explorer */
      .explorer-section { padding: 48px 0; }
      .cat-tabs { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; margin-bottom: 18px; padding-bottom: 4px; }
      .cat-tabs::-webkit-scrollbar { display: none; }
      .cat-tab { display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; border: 2px solid var(--gray-200); border-radius: 50px; background: #fff; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--gray-600); cursor: pointer; white-space: nowrap; transition: all 0.18s; }
      .cat-tab:hover { border-color: var(--gray-300); }
      .cat-tab.active { background: var(--green-light); color: var(--green-dark); border-color: var(--green); }
      .cat-icon { width: 15px; height: 15px; display: inline-flex; }
      .cat-icon svg { width: 100%; height: 100%; }
      .cat-n { font-size: 11px; font-weight: 700; background: var(--gray-100); color: var(--gray-600); padding: 1px 7px; border-radius: 50px; }
      .cat-tab.active .cat-n { background: rgba(34,197,94,0.2); color: var(--green-dark); }

      .explorer-controls { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; align-items: center; }
      .search-wrap { position: relative; flex: 1; min-width: 220px; }
      .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--gray-400); pointer-events: none; }
      .search-icon svg { width: 100%; height: 100%; }
      .fx-search { width: 100%; padding: 11px 14px 11px 40px; border: 2px solid var(--gray-200); border-radius: 50px; font-family: inherit; font-size: 14px; color: var(--dark); background: #fff; transition: border-color 0.18s; }
      .fx-search:focus { outline: none; border-color: var(--green); }
      .sort-wrap { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--gray-600); }
      .fx-sort { padding: 10px 14px; border: 2px solid var(--gray-200); border-radius: 50px; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--dark); background: #fff; cursor: pointer; }
      .fx-sort:focus { outline: none; border-color: var(--green); }

      .dir-chipbar { display: flex; flex-wrap: wrap; gap: 14px 24px; margin-bottom: 14px; align-items: flex-end; }
      .chip-group { display: flex; flex-direction: column; gap: 6px; }
      .chip-group-label { font-size: 11px; font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase; color: var(--gray-400); }
      .chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
      .filter-chip { padding: 7px 14px; border: 2px solid var(--gray-200); border-radius: 50px; background: #fff; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--gray-600); cursor: pointer; transition: all 0.18s; white-space: nowrap; }
      .filter-chip:hover { border-color: var(--gray-300); }
      .filter-chip.active { background: var(--green-light); color: var(--green-dark); border-color: var(--green); }
      .filter-reset { align-self: flex-end; padding: 7px 14px; border: none; background: none; color: var(--gray-400); font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer; text-decoration: underline; }
      .filter-reset:hover { color: var(--dark); }
      .fx-count { font-size: 13px; color: var(--gray-400); margin-bottom: 16px; }
      .fx-count strong { color: var(--dark); }

      /* Factor cards */
      .fx-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
      .fx-card { background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius-sm); padding: 18px 20px; border-left: 4px solid var(--gray-300); display: flex; flex-direction: column; transition: box-shadow 0.2s; }
      .fx-card:hover { box-shadow: var(--shadow); }
      .fx-card.dir-pos { border-left-color: var(--green); }
      .fx-card.dir-neg { border-left-color: var(--red); }
      .fx-card.dir-neu { border-left-color: var(--gray-300); }
      .fx-card.dir-var { border-left-color: var(--blue); }
      .fx-card.dir-pred { border-left-color: var(--purple); }
      .fx-card.flash { animation: cardFlash 1.6s ease-out; }
      @keyframes cardFlash { 0%,100% { box-shadow: var(--shadow); } 20% { box-shadow: 0 0 0 3px var(--green), var(--shadow-hover); } }
      .fx-card-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
      .fx-cat { font-size: 11px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; color: var(--gray-400); }
      .dir-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 50px; white-space: nowrap; }
      .dir-badge svg { width: 12px; height: 12px; }
      .dir-badge.dir-pos { background: var(--green-light); color: var(--green-dark); }
      .dir-badge.dir-neg { background: var(--red-light); color: #B91C1C; }
      .dir-badge.dir-neu { background: var(--gray-100); color: var(--gray-600); }
      .dir-badge.dir-var { background: var(--blue-light); color: #1D4ED8; }
      .dir-badge.dir-pred { background: var(--purple-light); color: #6D28D9; }
      .fx-name { font-size: 17px; margin-bottom: 8px; }
      .ev-badge { align-self: flex-start; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 50px; margin-bottom: 12px; }
      .ev-strong { background: var(--green-light); color: var(--green-dark); }
      .ev-moderate { background: var(--amber-light); color: #B45309; }
      .fx-plain { font-size: 14px; color: var(--gray-700); margin-bottom: 12px; }
      .fx-key { font-size: 13px; color: var(--gray-600); background: var(--gray-50); border-radius: 10px; padding: 11px 13px; margin-bottom: 12px; }
      .fx-key-label { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; color: var(--gray-400); margin-bottom: 3px; }
      .fx-dose { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: var(--gray-700); background: var(--green-light); border-radius: 10px; padding: 10px 13px; margin-bottom: 12px; }
      .fx-dose strong { color: var(--green-dark); }
      .fx-dose-icon { display: inline-flex; flex-shrink: 0; color: var(--green-dark); margin-top: 1px; }
      .fx-dose-icon svg { width: 15px; height: 15px; }
      .fx-src { display: inline-flex; align-items: center; gap: 5px; align-self: flex-start; margin-top: auto; font-size: 12px; font-weight: 600; color: var(--gray-600); transition: color 0.2s; }
      .fx-src:hover { color: var(--green-dark); }
      .fx-src svg { width: 13px; height: 13px; }

      .empty-state { padding: 40px 20px; text-align: center; color: var(--gray-400); font-size: 14px; background: #fff; border: 1px dashed var(--gray-300); border-radius: var(--radius-sm); }
      .link-btn { border: none; background: none; color: var(--green-dark); font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: underline; }

      /* Companion blog cross-link */
      .blog-link-section { padding: 8px 0 0; }
      .blog-link-wrap { max-width: 720px; margin: 0 auto; }
      .blog-link-card { display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: var(--green-light); border: 2px solid var(--green); border-radius: var(--radius); transition: box-shadow 0.3s; }
      .blog-link-card:hover { box-shadow: var(--shadow-hover); }
      .blog-link-icon { width: 40px; height: 40px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 10px; color: var(--green-dark); }
      .blog-link-icon svg { width: 20px; height: 20px; }
      .blog-link-text { flex: 1; min-width: 0; }
      .blog-link-title { display: block; font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--green-dark); letter-spacing: 0.3px; }
      .blog-link-desc { display: block; font-size: 14px; font-weight: 500; color: var(--dark); margin-top: 2px; }
      .blog-link-arrow { width: 20px; height: 20px; color: var(--green-dark); flex-shrink: 0; }
      .blog-link-arrow svg { width: 20px; height: 20px; }

      /* Blog CTA */
      .blog-cta-section { padding: 48px 0; overflow: hidden; }
      .blog-cta-wrapper { max-width: 680px; margin: 0 auto; }
      .blog-cta { position: relative; background: linear-gradient(135deg, var(--dark) 0%, var(--gray-700) 100%); border-radius: var(--radius); padding: 40px 32px; overflow: hidden; text-align: center; color: #fff; }
      .blog-cta-glow { position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(34,197,94,0.15), transparent 70%); pointer-events: none; }
      .blog-cta-content { position: relative; z-index: 1; }
      .blog-cta-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 500; margin-bottom: 16px; }
      .pulse-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; animation: pulse 2s infinite; }
      @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      .blog-cta h2 { font-size: clamp(20px, 5vw, 28px); margin-bottom: 12px; }
      .highlight { color: var(--green); }
      .blog-cta p { color: var(--gray-300); font-size: 14px; margin-bottom: 20px; }
      .blog-cta-buttons { display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; }
      .blog-cta-btn, .blog-cta-android-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; font-weight: 600; padding: 12px 24px; border-radius: var(--radius-sm); font-size: 15px; transition: background 0.2s; border: none; cursor: pointer; font-family: inherit; }
      .blog-cta-btn:hover, .blog-cta-android-btn:hover { background: var(--green-dark); color: #fff; }
      .blog-cta-btn svg, .blog-cta-android-btn svg { width: 18px; height: 18px; }
      @media (max-width: 480px) { .blog-cta-buttons { flex-direction: column; align-items: stretch; } .blog-cta-buttons a { justify-content: center; } }

      /* Sources */
      .sources-section { padding: 48px 0; background: #fff; }
      .sources-list { display: flex; flex-direction: column; gap: 6px; }
      .src-card { background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-sm); overflow: hidden; }
      .src-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; }
      .src-num { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; color: var(--green-dark); flex-shrink: 0; min-width: 28px; }
      .src-brand-wrap { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
      .src-title { font-size: 14px; font-weight: 600; color: var(--dark); }
      .src-tag { font-size: 11px; color: var(--gray-400); }
      .src-toggle { width: 18px; height: 18px; color: var(--gray-400); transition: transform 0.3s; flex-shrink: 0; }
      .src-toggle svg { width: 100%; height: 100%; }
      .src-card.open .src-toggle { transform: rotate(180deg); }
      .src-body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.4s; padding: 0 16px; }
      .src-card.open .src-body { max-height: 460px; padding: 0 16px 16px; }
      .src-detail { font-size: 13px; color: var(--gray-600); margin-bottom: 8px; }
      .src-cite { font-size: 12px; color: var(--gray-400); font-style: italic; margin-bottom: 8px; }
      .src-body a { display: inline-flex; align-items: center; gap: 6px; color: var(--green-dark); font-size: 13px; font-weight: 600; }
      .src-body a svg { width: 13px; height: 13px; }

      /* Footer */
      .tool-footer { padding: 28px 0 18px; text-align: center; border-top: 1px solid var(--gray-200); }
      .footer-brand { display: inline-flex; align-items: center; gap: 8px; color: var(--dark); font-family: 'Space Grotesk', sans-serif; font-weight: 600; margin-bottom: 8px; }
      .footer-logo { height: 24px; width: auto; }
      .footer-tagline { color: var(--gray-400); font-size: 13px; margin-bottom: 12px; }
      .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 16px; margin-bottom: 16px; padding: 0 16px; }
      .footer-links a { color: var(--gray-600); font-size: 13px; white-space: nowrap; }
      .footer-links a:hover { color: var(--green-dark); }
      .footer-copyright { color: var(--gray-400); font-size: 12px; margin-top: 4px; }
      .footer-disclaimer { font-size: 11px; color: var(--gray-400); line-height: 1.5; max-width: 600px; margin: 0 auto 12px; }

      /* Responsive */
      @media (min-width: 768px) {
        .hero { padding: 72px 0 36px; }
        .qa-grid { grid-template-columns: 1fr 1fr; }
        .fx-grid { grid-template-columns: 1fr 1fr; }
      }
      @media (min-width: 1024px) {
        .fx-grid { grid-template-columns: 1fr 1fr 1fr; }
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .src-body { transition: none; }
        .pulse-dot { animation: none; }
        .fx-card.flash { animation: none; }
      }
    `;
  }
}

customElements.define('kygo-vo2max-factors', KygoVo2maxFactors);
