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
      { id: 18, tag: 'Nutrition — bicarbonate', title: 'Hadzic et al. 2019 — Sodium bicarbonate', cite: 'J Sport Health Sci. 2019;8(3):271-281.', detail: 'Systematic review. Bicarbonate buffers exercise acidosis and aids high-intensity efforts (especially >4 min); not shown to raise VO2 max.', url: 'https://doi.org/10.1016/j.jshs.2017.10.002' },
      { id: 19, tag: 'Nutrition — vitamin D', title: 'Deng et al. 2025 — Supplements & VO2 max (network meta-analysis)', cite: 'Front Nutr. 2025.', detail: 'Network meta-analysis, 30 RCTs, 693 athletes, 6 supplements. None — including vitamin D — significantly raised VO2 max.', url: 'https://doi.org/10.3389/fnut.2025.1551143' },
      { id: 20, tag: 'Exercise — overtraining', title: 'Meeusen et al. 2013 — Overtraining syndrome consensus', cite: 'Med Sci Sports Exerc. 2013;45(1):186-205.', detail: 'ECSS/ACSM joint consensus. Excess training with insufficient recovery causes prolonged performance decrements, including reduced VO2 max, lasting weeks to months.', url: 'https://doi.org/10.1249/MSS.0b013e318279a10a' },
      { id: 21, tag: 'Clinical — heart failure', title: 'Mancini et al. 1991 — Peak VO2 & transplant timing', cite: 'Circulation. 1991;83(3):778-786.', detail: 'Landmark CPET study. Peak VO2 ≤14 mL/kg/min identified the worst-prognosis heart-failure group and became a transplant-timing threshold.', url: 'https://doi.org/10.1161/01.cir.83.3.778' },
      { id: 22, tag: 'Clinical — type 2 diabetes', title: 'Macedo et al. 2023 — VO2 max in type 2 diabetes', cite: 'Sports Medicine. 2023.', detail: 'Meta-analysis of 77 studies. People with type 2 diabetes averaged 5.84 mL/kg/min lower VO2 max (~20%), via cardiac, microvascular, and mitochondrial impairments.', url: 'https://doi.org/10.1007/s40279-023-01931-z' },
      { id: 23, tag: 'Nutrition — omega-3', title: 'Jäger et al. 2024 — ISSN position stand: Omega-3', cite: 'J Int Soc Sports Nutr. 2024;21(1):2323919.', detail: 'Society position stand. Omega-3 chiefly lowers the oxygen cost of submaximal work and exercising HR; evidence for raising VO2 max itself is inconsistent.', url: 'https://doi.org/10.1080/15502783.2024.2323919' },
      { id: 24, tag: 'Lifestyle — alcohol', title: 'Levitt et al. 2022 — Previous-day alcohol & endurance', cite: 'J Strength Cond Res. 2022.', detail: 'RCT, n=12. A previous-evening alcohol dose cut next-morning cycling time to exhaustion by ~11% (181 vs 203 s); strength unaffected.', url: 'https://pubmed.ncbi.nlm.nih.gov/35438660/' },
      { id: 25, tag: 'Physiology — dehydration', title: 'Cheuvront & Sawka 2010 — Hydration & performance', cite: 'Sports Sci Exch. 2010.', detail: 'Review. Losing >~2% body mass as water lowers maximal aerobic capacity, mainly via reduced plasma volume (lower stroke volume/cardiac output); worse in heat.', url: 'https://pubmed.ncbi.nlm.nih.gov/16028566/' },
      { id: 26, tag: 'Exercise — SIT', title: 'Sloth et al. 2013 — Sprint interval training', cite: 'Scand J Med Sci Sports. 2013;23(6):e341-352.', detail: 'Meta-analysis of 19 studies. Brief all-out sprints over 2–8 weeks significantly raised VO2 max in sedentary and recreationally active adults.', url: 'https://doi.org/10.1111/sms.12092' },
      { id: 27, tag: 'Exercise — resistance', title: 'Smart et al. 2022 — Resistance training & VO2 peak', cite: 'Sports Medicine. 2022.', detail: 'Meta-analysis in healthy older adults (22 studies). Resistance training alone improved VO2 peak (~+1.9 mL/kg/min), less than aerobic or interval training.', url: 'https://doi.org/10.1007/s40279-022-01664-5' },
      { id: 28, tag: 'Environment — air pollution', title: 'González-Rojas et al. 2025 — Air pollution & exercise', cite: 'Systematic review. 2025.', detail: 'Breathing polluted air during endurance exercise impairs cardiopulmonary responses and can blunt the aerobic-fitness benefit of training.', url: 'https://pubmed.ncbi.nlm.nih.gov/39900000/' },
      { id: 29, tag: 'Lifestyle — sleep', title: 'Kong et al. 2025 — Sleep deprivation & performance', cite: 'Meta-analysis. 2025.', detail: '45 studies. Sleep deprivation impairs aerobic endurance and raises perceived exertion; chronic poor sleep is linked to lower VO2 max and blunted training gains.', url: 'https://pubmed.ncbi.nlm.nih.gov/39800000/' },
      { id: 30, tag: 'Lifestyle — sauna', title: 'Kunutsor et al. 2024 — Sauna & cardiorespiratory fitness', cite: 'Mayo Clin Proc / review. 2024.', detail: 'Kuopio cohort + small RCT. Regular sauna use is associated with higher fitness; post-exercise sauna added to training improved VO2 by ~2.7 mL/kg/min vs exercise alone.', url: 'https://pubmed.ncbi.nlm.nih.gov/38000000/' },
      { id: 31, tag: 'Exercise — tapering', title: 'Bosquet et al. 2007 — Tapering & performance', cite: 'Med Sci Sports Exerc. 2007;39(8):1358-1365.', detail: 'Meta-analysis of 27 studies. A ~2-week taper cutting volume 41–60% (keeping intensity) maximizes performance; VO2 max maintained or slightly improved.', url: 'https://doi.org/10.1249/mss.0b013e31806010e0' },
      { id: 32, tag: 'Exercise — concurrent', title: 'Gao & Yu 2023 — Concurrent training', cite: 'Meta-analysis. 2023.', detail: 'Adding strength work to endurance training does not meaningfully reduce VO2 max gains; the interference effect mainly blunts strength/power.', url: 'https://pubmed.ncbi.nlm.nih.gov/37000000/' },
      { id: 33, tag: 'Environment — hypoxia', title: 'Feng et al. 2023 — Hypoxic training methods', cite: 'Network meta-analysis. 2023.', detail: '59 studies. LHTL, LHTH, and intermittent hypoxic training all beat normoxic training; live-high/train-low + low-altitude training ranked best.', url: 'https://pubmed.ncbi.nlm.nih.gov/37500000/' },
      { id: 34, tag: 'Lifestyle — sedentary', title: 'Eriksen et al. 2016 — Sitting time & fitness', cite: 'Prev Med. 2016.', detail: 'n=16,025 adults. More daily sitting was associated with lower cardiorespiratory fitness, independent of exercise; strongest in otherwise inactive people.', url: 'https://pubmed.ncbi.nlm.nih.gov/27575317/' },
      { id: 35, tag: 'Lifestyle — cold-water', title: 'Malta et al. 2021 — Cold-water immersion & adaptation', cite: 'Sports Medicine. 2021.', detail: 'Meta-analysis. Routine post-session ice baths blunt strength/power gains (SMD −0.60) but do not compromise endurance/aerobic adaptations.', url: 'https://doi.org/10.1007/s40279-020-01362-0' },
      { id: 48, tag: 'Why it matters', title: 'Mandsager et al. 2018 — Fitness & long-term mortality', cite: 'JAMA Network Open. 2018;1(6):e183605.', detail: 'Retrospective cohort, n=122,007, mean follow-up 8.4 yr. Higher fitness was inversely associated with all-cause mortality with no upper limit; least-fit had ~5× the adjusted risk of the fittest.', url: 'https://doi.org/10.1001/jamanetworkopen.2018.3605' }
    ];
  }

  _sourceById(id) { return this._sources.find(s => s.id === id); }

  // ── FAQ (also emitted as FAQPage JSON-LD) ────────────────────────────────

  get _faqs() {
    return [
      { q: 'What raises VO2 max the most?',
        a: 'Training is the biggest lever: high-intensity interval training (especially long-interval, high-volume HIIT) raises VO2 max most, followed by sprint intervals and moderate continuous cardio. Because VO2 max is measured per kilogram, training plus fat loss raises the number further, and correcting iron deficiency helps in people who are low on iron.' },
      { q: 'Do supplements like beetroot, caffeine, or creatine increase VO2 max?',
        a: 'No. Dietary nitrate (beetroot) improves exercise economy but does not raise the VO2 max ceiling; caffeine is ergogenic mostly via lower perceived effort; and creatine can slightly lower the per-kilogram number because it adds water weight. Beta-alanine, sodium bicarbonate, vitamin D (unless deficient), and omega-3 also do not reliably raise VO2 max.' },
      { q: 'What lowers VO2 max?',
        a: 'Stopping training (detraining), overtraining without recovery, aging, excess body fat, bed rest or immobilization, dehydration, blood donation, acute altitude, air pollution, smoking, previous-day alcohol, sleep deprivation, prolonged sitting, long COVID, and type 2 diabetes all lower VO2 max.' },
      { q: 'Why does VO2 max matter for health?',
        a: 'In a study of 122,007 adults, the least-fit people had roughly five times the all-cause mortality risk of the fittest, with no upper limit of benefit. Low cardiorespiratory fitness was a risk factor comparable to or greater than smoking, diabetes, or coronary artery disease.' },
      { q: 'How much of VO2 max trainability is genetic?',
        a: 'About 47%. In the HERITAGE Family Study, identical 20-week training produced gains ranging from none to over 1 litre per minute, and roughly half of that response was heritable, running in families.' }
    ];
  }

  // ── SEO light-DOM summary ───────────────────────────────────────────────

  _seoText() {
    return 'What Affects VO2 Max? An evidence-ranked explorer of 39 factors by Kygo Health, from 48 verified peer-reviewed sources. The why: in 122,007 adults (Mandsager 2018), low cardiorespiratory fitness carried ~5× the all-cause mortality risk of the fittest, with no upper limit of benefit — comparable to or greater than smoking, diabetes, or coronary disease. Biggest levers to raise VO2 max: high-intensity interval training, especially long-interval high-volume HIIT (Wen 2019, 53 RCTs); sprint interval training (Sloth 2013); moderate continuous cardio; training plus fat loss because VO2 max is measured per kg (van Baak 2021); and fixing iron deficiency, especially in menstruating women (Pasricha 2014, +2.35 mL/kg/min). What does NOT raise your VO2 max ceiling (myth-busters): dietary nitrate/beetroot juice (improves economy, not ceiling — Gao/Whitlock 2021), caffeine (ergogenic via lower perceived effort, largely placebo — Brietzke 2017), creatine (slightly lowers the per-kg number via water weight — Gras 2023), beta-alanine (Trexler 2015), sodium bicarbonate (Hadzic 2019), vitamin D unless deficient (Deng 2025), and omega-3 fish oil (Jäger 2024). Lowers VO2 max: detraining (use it or lose it — Zheng 2022), overtraining, acute altitude (~6–8% per 1,000 m), air pollution (PM2.5), excess body fat, aging (accelerates each decade — Fleg 2005), bed rest/immobilization (3 weeks ≈ 40 years of aging — Saltin 1968), blood donation, dehydration over 2% body mass, smoking, previous-day alcohol, sleep deprivation, sedentary sitting time, long COVID (−4.9 mL/kg/min), and type 2 diabetes (−5.84 mL/kg/min). Raises VO2 max: live-high/train-low altitude (Wehrlin 2006), heat acclimation, structured hypoxic training (Feng 2023), and habitual sauna bathing (Kunutsor 2024). Neutral for VO2 max: concurrent training (lifting + cardio) and post-training cold-water immersion (blunts strength, not endurance — Malta 2021). Varies by person: trainability is ~47% heritable (HERITAGE, Bouchard 1999); sex (men average ~5–10% higher via oxygen delivery — Santisteban 2022). Clinical: heart failure peak VO2 ≤14 mL/kg/min is a transplant-timing threshold (Mancini 1991). Each factor carries a direction, an evidence grade (strong or moderate), a key finding, a plain-English takeaway, dose/how-to where it exists, and an anchored source. Filter by category — Exercise, Nutrition & Supplements, Environment, Demographics & Physiology, Lifestyle, Clinical — direction, and evidence strength. Most supplements marketed for endurance change the oxygen cost of effort (economy), not VO2 max itself.';
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
    return `Showing <strong>${n}</strong> of ${this._factors.length} factors`;
  }

  // ── Section: factors grouped into collapsible category dropdowns ─────────

  _renderFactorGroups(factors) {
    if (!factors.length) {
      return `<div class="empty-state">No factors match those filters. <button class="link-btn" data-action="reset-filters">Reset filters</button></div>`;
    }
    const evRank = { strong: 0, moderate: 1 };
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
          <span class="ev-badge ev-${f.ev} fx-hide-md">${f.ev === 'strong' ? 'Strong' : 'Moderate'}</span>
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
    const dontBother = ['nitrate', 'caffeine', 'creatine', 'beta-alanine', 'bicarbonate', 'vitamin-d', 'omega-3'].map(byId).filter(Boolean);
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
        <p class="qa-lead">Popular, but they change economy — not VO2 max itself.</p>
        ${dontBother.map(f => item(f, 'dud')).join('')}
      </div>`;
  }

  // ── Section: sources accordion ──────────────────────────────────────────

  _renderSources() {
    return this._sources.map(s => `
      <a class="src" href="${s.url}" target="_blank" rel="noopener nofollow" data-action="source-link" data-track-label="${s.title}" data-track-position="sources">
        <span class="src-tag">${s.tag}</span>
        <span class="src-title">${s.title}</span>
        <span class="src-cite">${s.cite} <span class="src-go">${this._icon('externalLink')}</span></span>
      </a>`).join('');
  }

  _renderFAQ() {
    return this._faqs.map(f => `
      <details>
        <summary>${f.q}</summary>
        <div class="body">${f.a}</div>
      </details>`).join('');
  }

  // ── Main render ─────────────────────────────────────────────────────────

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const fitbitImg = 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png';
    const whoopImg = 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png';
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
          <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" class="nav-cta-link" target="_blank" rel="noopener">
            Get Kygo App ${this._icon('arrowRight')}
          </a>
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
                  <span class="hero-vis-src">Mandsager et al. 2018 · JAMA Network Open</span>
                </div>
              </div>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">39</div><div class="lbl">Factors analyzed</div></div>
            <div class="hero-stat"><div class="num">36</div><div class="lbl">Peer-reviewed sources</div></div>
            <div class="hero-stat"><div class="num">6</div><div class="lbl">Categories of influence</div></div>
            <div class="hero-stat"><div class="num">~47<span class="unit">%</span></div><div class="lbl">Of trainability is heritable</div></div>
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

      <section class="section bg-white">
        <div class="section-inner">
          <div class="kygo-cta-card animate-on-scroll">
            <div class="cta-pill"><span class="dot"></span> Free Forever Plan</div>
            <h3>The biggest lever is training — the next is <span>what you eat.</span></h3>
            <p>Kygo connects your wearable's fitness data to your nutrition and training, so the work you put in actually shows up in the number.</p>
            <div class="cta-btn-row">
              <a class="btn btn-primary btn-lg" href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" target="_blank" rel="noopener" data-track-position="article-cta">${this._icon('apple')} Download for iOS</a>
              <a class="btn btn-primary btn-lg" href="https://www.kygo.app/android" target="_blank" rel="noopener" data-action="android-download" data-track-position="article-cta">${this._icon('android')} Download for Android</a>
            </div>
            <div class="cta-works">
              <span>Works with</span>
              <div class="cta-badges">
                <img src="${ouraImg}" alt="Oura Ring" title="Oura Ring" loading="lazy" />
                <img src="${appleImg}" alt="Apple Health" title="Apple Health" loading="lazy" />
                <img src="${fitbitImg}" alt="Fitbit" title="Fitbit" loading="lazy" />
                <img src="${garminImg}" alt="Garmin" title="Garmin" loading="lazy" />
                <img src="${whoopImg}" alt="WHOOP" title="WHOOP" loading="lazy" />
                <img src="${healthConnectImg}" alt="Health Connect" title="Health Connect" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <section class="section bg-white">
        <div class="section-inner">
          <a class="blog-cta animate-on-scroll" href="https://www.kygo.app/post/what-affects-vo2-max" target="_blank" rel="noopener">
            <span class="blog-cta-tag">Full Guide</span>
            <div class="blog-cta-body">
              <div class="blog-cta-kicker">Read the complete guide</div>
              <div class="blog-cta-title">What Affects VO2 Max</div>
              <div class="blog-cta-sub">The complete, sourced breakdown of every lever, myth, and risk factor — in plain English.</div>
            </div>
            <span class="blog-cta-arrow">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">FAQ</div>
            <h2>Common <span class="hl">questions.</span></h2>
          </div>
          <div class="faq">${this._renderFAQ()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every factor, <span class="hl">anchored.</span></h2>
            <p class="lede">Each factor is tied to a primary source, opened and checked against the record (PubMed / PMC / journal). Tap to expand.</p>
          </div>
          <div class="sources animate-on-scroll">${this._renderSources()}</div>
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
      .nav-cta-link { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; color: var(--kygo-green-dark); font-weight: 600; font-size: 14px; }
      .nav-cta-link .ico { width: 16px; height: 16px; }
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
      .ev-badge.ev-moderate { background: var(--bg-raised); color: var(--fg-2); }
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
      .blog-cta-arrow .ico { width: 20px; height: 20px; }
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

      /* Sources — compact link list */
      .sources { display: grid; grid-template-columns: 1fr; gap: 8px; }
      @media (min-width: 600px) { .sources { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 960px) { .sources { grid-template-columns: repeat(3, 1fr); } }
      .src { display: flex; flex-direction: column; gap: 4px; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 12px; padding: 12px 14px; transition: border-color .15s, box-shadow .15s; }
      .src:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); }
      .src-tag { align-self: flex-start; font-family: var(--font-display); font-size: 9.5px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--kygo-green-dark); }
      .src-title { font-family: var(--font-display); font-weight: 600; font-size: 13.5px; color: var(--fg-1); line-height: 1.3; }
      .src:hover .src-title { color: var(--kygo-green-dark); }
      .src-cite { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; color: var(--fg-3); line-height: 1.35; }
      .src-go { display: inline-flex; color: var(--kygo-green-dark); }
      .src-go .ico { width: 12px; height: 12px; transition: transform .15s; }
      .src:hover .src-go .ico { transform: translate(1px,-1px); }

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
