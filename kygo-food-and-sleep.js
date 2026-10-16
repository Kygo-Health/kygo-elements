/**
 * Kygo Health, How Food Affects Your Sleep
 * Tag: kygo-food-and-sleep
 * URL: /tools/how-food-affects-sleep
 * Foods, drinks and eating patterns tested against each part of sleep (deep
 * sleep, REM, falling asleep and night waking), one section per stage, each
 * finding graded by evidence with industry funding flagged. Companion to the
 * blog post /post/how-food-affects-your-sleep.
 */

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

class KygoFoodAndSleep extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._flashTimer = null;
  }

  connectedCallback() {
    __ensureKygoCta();
    this.render();
    this._bindEvents();
    this._setupAnimations();
    __seo(this, this._seoText());
    this._injectStructuredData();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    if (this._flashTimer) clearTimeout(this._flashTimer);
  }

  // -- Data: evidence grades ----------------------------------------------
  // Strong = a meta-analysis or several RCTs. Moderate = one solid controlled
  // study. Observational = a link in survey or tracking data, not a tested
  // cause. Weak = tiny or uncontrolled. Rank orders each stage's list.

  get _grades() {
    return {
      strong:   { label: 'Strong',        lvl: 4, rank: 0, def: 'A meta-analysis or several RCTs.' },
      moderate: { label: 'Moderate',      lvl: 3, rank: 1, def: 'One solid controlled study.' },
      obs:      { label: 'Observational', lvl: 2, rank: 2, def: 'A link in survey or tracking data, not a tested cause.' },
      weak:     { label: 'Weak',          lvl: 1, rank: 3, def: 'Tiny or uncontrolled.' }
    };
  }

  // Direction is judged for the stage in question: `good` is better sleep in
  // that stage (more deep sleep, more REM, faster sleep onset, less waking).
  _dir(d) {
    return ({
      good:  { icon: 'up',        cls: 'dir-good',  word: 'Helps' },
      bad:   { icon: 'down',      cls: 'dir-bad',   word: 'Hurts' },
      none:  { icon: 'dash',      cls: 'dir-none',  word: 'No change' },
      mixed: { icon: 'swap',      cls: 'dir-mixed', word: 'Mixed' }
    })[d] || { icon: 'dash', cls: 'dir-none', word: 'No change' };
  }

  // -- Data: sources --------------------------------------------------------
  // Keyed so each finding cites by key and the sources section is built from
  // the same list. `tag` is what a reader should see before the title: the
  // study design, with industry funding first where it applies.

  get _src() {
    return {
      gardinerAlc: { short: 'Gardiner 2025', tag: 'Meta-analysis', title: 'Alcohol and sleep architecture in healthy adults: meta-analysis of 27 studies', cite: 'Gardiner et al., Sleep Medicine Reviews, 2025', url: 'https://doi.org/10.1016/j.smrv.2024.102030' },
      gardinerCaf: { short: 'Gardiner 2023', tag: 'Meta-analysis', title: 'Caffeine and sleep: meta-analysis of sleep stages, sleep onset and time awake', cite: 'Gardiner et al., Sleep Medicine Reviews, 2023', url: 'https://doi.org/10.1016/j.smrv.2023.101764' },
      gardinerDose: { short: 'Gardiner 2025', tag: 'Double-blind crossover', title: 'Caffeine dose and timing before bed: 100mg vs 400mg at 12, 8 and 4 hours', cite: 'Gardiner et al., SLEEP, 2025 · n=23 men, home forehead EEG', url: 'https://doi.org/10.1093/sleep/zsae230' },
      vlah:        { short: 'Vlahoyiannis 2021', tag: 'Meta-analysis', title: 'Carbohydrate intake and sleep stages: meta-analysis of 11 studies', cite: 'Vlahoyiannis et al., Nutrients, 2021 · n=179', url: 'https://doi.org/10.3390/nu13041283' },
      saidi:       { short: 'Saidi 2022', tag: 'Randomized crossover', title: 'High protein, lower carb diet vs higher carb diet at equal calories: sleep stages', cite: 'Saidi et al., Nutrients, 2022 · n=24 young men, home PSG', url: 'https://doi.org/10.3390/nu14245299' },
      bahammam:    { short: 'BaHammam 2013', tag: 'Controlled PSG study', title: 'Ramadan-style daytime fasting with sleep times and calories held fixed: sleep architecture', cite: 'BaHammam et al., Behavioral and Brain Functions, 2013 · n=8 men', url: 'https://doi.org/10.1186/1744-9081-9-32' },
      roky:        { short: 'Roky 2001', tag: 'Controlled PSG study', title: 'Daytime fasting outside and during Ramadan: effects on REM sleep', cite: 'Roky et al., Journal of Sleep Research, 2001 · n=8 men', url: 'https://doi.org/10.1046/j.1365-2869.2001.00269.x' },
      gu:          { short: 'Gu 2020', tag: 'Randomized crossover', title: 'Late dinner (10pm) vs routine dinner (6pm): sleep stages and time awake', cite: 'Gu et al., Journal of Clinical Endocrinology & Metabolism, 2020 · n=20, lab PSG', url: 'https://doi.org/10.1210/clinem/dgaa354' },
      desai:       { short: 'Desai 2026', tag: 'Industry-funded · RCT', title: 'Almonds (60g a day for 5 months) vs an equal-calorie snack in adults with poor sleep', cite: 'Desai et al., Frontiers in Nutrition, 2026 · n=175, home PSG · funded by the Almond Board of California', url: 'https://doi.org/10.3389/fnut.2026.1892442' },
      afaghi08:    { short: 'Afaghi 2008', tag: 'Non-randomized PSG study', title: 'Very low carb (ketogenic) vs high carb, low fat diet: deep sleep share', cite: 'Afaghi et al., 2008 · n=14 healthy men, PSG, normal-diet night always first', url: 'https://doi.org/10.1179/147683008X301540' },
      brandao:     { short: 'Brandão 2023', tag: 'Randomized crossover', title: 'A week of high fat, high sugar food vs low fat, low sugar food at the same calories: deep sleep EEG', cite: 'Brandão et al., Obesity, 2023 · n=15 healthy men, lab PSG', url: 'https://doi.org/10.1002/oby.23787' },
      stonge:      { short: 'St-Onge 2016', tag: 'Observational', title: 'Fiber, saturated fat and sugar on a free-eating day vs that night\'s sleep', cite: 'St-Onge et al., Journal of Clinical Sleep Medicine, 2016 · n=26, lab PSG', url: 'https://doi.org/10.5664/jcsm.5384' },
      spaeth:      { short: 'Spaeth 2017', tag: 'Observational', title: 'Fiber intake and slow-wave sleep: replication in a second lab sample', cite: 'Spaeth et al., SLEEP, 2017 · n=46, lab PSG', url: 'https://doi.org/10.1093/sleep/zsw018' },
      chan:        { short: 'Chan 2013', tag: 'Controlled PSG study', title: 'High-dose alcohol (about 5 drinks) before bed: first vs second half of the night', cite: 'Chan et al., Alcoholism: Clinical & Experimental Research, 2013 · n=22 aged 18 to 21', url: 'https://doi.org/10.1111/acer.12141' },
      mccullar:    { short: 'McCullar 2024', tag: 'Randomized crossover', title: 'Alcohol on 3 nights in a row: sleep stages across the night', cite: 'McCullar et al., SLEEP, 2024 · n=30, 3 nights lab PSG', url: 'https://doi.org/10.1093/sleep/zsae003' },
      edwards:     { short: 'Edwards 1992', tag: 'Small PSG study', title: 'Spicy dinner (Tabasco and mustard): deep sleep, time awake and body temperature', cite: 'Edwards et al., International Journal of Psychophysiology, 1992 · n=6 men', url: 'https://doi.org/10.1016/0167-8760(92)90048-g' },
      lundstrom:   { short: 'Lundstrom 2026', tag: 'Observational', title: 'Energy intake relative to training load and WHOOP sleep in college swimmers', cite: 'Lundstrom et al., Journal of the International Society of Sports Nutrition, 2026 · n=26', url: 'https://doi.org/10.1080/15502783.2026.2665547' },
      afaghi07:    { short: 'Afaghi 2007', tag: 'Crossover trial', title: 'High vs low glycemic index rice dinner, 4 hours or 1 hour before bed: time to fall asleep', cite: 'Afaghi et al., American Journal of Clinical Nutrition, 2007 · n=12 healthy men', url: 'https://doi.org/10.1093/ajcn/85.2.426' },
      barnard:     { short: 'Barnard 2024', tag: 'Systematic review', title: 'Alpha-lactalbumin and sleep: review of 8 studies', cite: 'Barnard et al., Journal of Sleep Research, 2024', url: 'https://doi.org/10.1111/jsr.14141' },
      gratwicke:   { short: 'Gratwicke 2022', tag: 'RCT', title: 'Alpha-lactalbumin drink before bed in female rugby players: sleep onset on actigraphy', cite: 'Gratwicke et al., Biology of Sport, 2022 · 12 with usable data', url: 'https://doi.org/10.5114/biolsport.2023.116002' },
      kaldenbach:  { short: 'Kaldenbach 2024', tag: 'Observational', title: 'Energy drink use and sleep in Norwegian students', cite: 'Kaldenbach et al., BMJ Open, 2024 · n=53,226, self-report', url: 'https://doi.org/10.1136/bmjopen-2023-072951' },
      fallah:      { short: 'Fallah 2024', tag: 'Systematic review', title: 'Mediterranean diet and sleep: review of 20 studies', cite: 'Fallah et al., BMC Nutrition, 2024', url: 'https://doi.org/10.1186/s40795-024-00853-x' },
      verkaar:     { short: 'Verkaar 2024', tag: 'Observational', title: 'Mediterranean diet and wrist-tracker sleep in a 533-person cohort', cite: 'Verkaar et al., Sleep Medicine, 2024 · n=533', url: 'https://doi.org/10.1016/j.sleep.2024.05.017' },
      oconnor:     { short: 'O\'Connor 2018', tag: 'Feeding RCT', title: 'Five weeks of a Mediterranean-style diet: measured sleep', cite: 'O\'Connor et al., Journal of Nutrition, 2018 · n=41', url: 'https://doi.org/10.1093/jn/nxy235' },
      pigeon:      { short: 'Pigeon 2010', tag: 'Industry-funded · RCT', title: 'Tart cherry juice vs placebo in older adults with insomnia', cite: 'Pigeon et al., Journal of Medicinal Food, 2010 · n=15, sleep diary · funded entirely by the juice maker', url: 'https://doi.org/10.1089/jmf.2009.0096' },
      boege:       { short: 'Boege 2025', tag: 'Observational', title: 'Daily fruit and vegetable intake and sleep fragmentation over 201 nights', cite: 'Boege et al., Sleep Health, 2025 · n=34, wrist actigraphy', url: 'https://doi.org/10.1016/j.sleh.2025.05.003' },
      iao:         { short: 'Iao 2022', tag: 'Observational', title: 'Eating within an hour of bed and night waking in the US time use survey', cite: 'Iao et al., British Journal of Nutrition, 2022 · n=124,239', url: 'https://doi.org/10.1017/S0007114521003597' },
      enomoto:     { short: 'Enomoto 2026', tag: 'Industry-funded · crossover', title: 'Late dinner (1h vs 5h before bed) for 4 days: time awake on home EEG', cite: 'Enomoto et al., Journal of Physiological Anthropology, 2026 · n=13 young women · funded by Yazuya, a food company', url: 'https://doi.org/10.1186/s40101-026-00430-0' },
      spadola:     { short: 'Spadola 2019', tag: 'Observational', title: 'Evening alcohol, caffeine and nicotine vs actigraphy sleep efficiency', cite: 'Spadola et al., SLEEP, 2019 · n=785', url: 'https://doi.org/10.1093/sleep/zsz136' }
    };
  }

  // -- Data: the four stages -------------------------------------------------
  // Each stage is its own section with its own H2, so each can rank for its own
  // search ("foods that affect deep sleep"). `rows` is the research table for
  // that stage; the order here is ignored, render sorts by evidence grade.

  get _stages() {
    const T = 'https://www.kygo.app/tools/';
    return [
      {
        key: 'deep', kicker: 'Deep sleep (N3)', short: 'Deep sleep',
        h2: 'Foods that affect <span class="hl">deep sleep.</span>',
        lede: 'Caffeine is the only strong-evidence lever, and it costs you deep sleep. Lower carb eating adds a little.',
        tool: { url: T + 'deep-sleep-factors', label: 'Every deep sleep factor, not just food' },
        rows: [
          { key: 'caffeine', food: 'Caffeine', effect: 'Less deep sleep', dir: 'bad', grade: 'strong', stat: 'About 11 min less deep sleep', src: ['gardinerCaf', 'gardinerDose'], design: 'Meta-analysis of 24 studies; dose detail from a double-blind crossover in 23 men on a home forehead EEG device.', plain: 'About 11 min less deep sleep on average across studies. In the trial, 400mg (about 4 standard cups of coffee) 4h before bed cut deep sleep by 29.7 min, and still cut it by 20.6 min at 12h. 100mg had no measurable effect at any timing.' },
          { key: 'low-carb', food: 'Lower carb diet', effect: 'More deep sleep', dir: 'good', grade: 'moderate', stat: 'About 8 min more deep sleep', src: ['vlah'], design: 'Meta-analysis of 11 small studies (27 trial arms).', plain: 'Lower carb gave about 8 min more deep sleep. It is the same meta-analysis that found more REM on higher carb, so carbs look like a trade between the two stages rather than a win or a loss.' },
          { key: 'junk-food', food: 'A week of junk food (high fat, high sugar)', b: 'A week of junk food', effect: 'Shallower deep sleep', dir: 'bad', grade: 'moderate', stat: 'Same minutes, shallower on EEG', src: ['brandao'], design: 'Randomized crossover, 15 healthy men, lab PSG, same calories in both weeks.', plain: 'Compared with a low fat, low sugar week, time in deep sleep did not change but the deep sleep was shallower on EEG. Our read: a wearable would probably show the same deep sleep minutes.' },
          { key: 'alcohol', food: 'Alcohol (high dose, about 5 drinks)', effect: 'No net gain', dir: 'none', grade: 'moderate', stat: 'More early, less late, same total', src: ['chan', 'mccullar'], design: 'Lab PSG in 22 people aged 18 to 21; the same pattern in a randomized crossover of 30 adults over 3 nights.', plain: 'Breath alcohol was about 0.08% at lights out. More deep sleep in the first half of the night, less in the second half, more time awake. Total deep sleep did not go up and REM went down. McCullar saw the same over 3 nights in a row.' },
          { key: 'fiber', food: 'Fiber', effect: 'More deep sleep', dir: 'good', grade: 'obs', stat: 'More fiber, more deep sleep', src: ['stonge', 'spaeth'], design: 'Observational, 26 people in a sleep lab; repeated in 46 people, lab PSG.', plain: 'More fiber on a free eating day predicted more deep sleep that night. A second lab study found the same link.' },
          { key: 'sat-fat', food: 'Saturated fat', effect: 'Less deep sleep', dir: 'bad', grade: 'obs', stat: 'More saturated fat, less deep sleep', src: ['stonge'], design: 'Observational, 26 people, sleep lab PSG.', plain: 'A higher share of calories from saturated fat on a free eating day predicted less deep sleep that night.' },
          { key: 'under-fueling', food: 'Not eating enough for your training', b: 'Under-eating for training', effect: 'Less deep sleep', dir: 'bad', grade: 'obs', stat: 'Fewer hours of deep sleep when under-fueled', src: ['lundstrom'], design: 'Observational, 26 college swimmers, WHOOP plus MyFitnessPal logs over 3 matched days.', plain: 'Swimmers who ate more relative to their training got more hours of deep sleep. 69% were under-eating. Deep sleep as a share of the night did not change.' },
          { key: 'keto', food: 'Very low carb (keto)', effect: 'More deep sleep', dir: 'good', grade: 'weak', stat: '18% of the night vs 14%', src: ['afaghi08'], design: '14 healthy men, PSG, not randomized (the normal diet night always came first).', plain: 'Deep sleep was about 18% of the night vs 14% on a high carb, low fat diet.' },
          { key: 'spicy', food: 'Spicy dinner (Tabasco and mustard)', b: 'Spicy dinner', effect: 'Less deep sleep', dir: 'bad', grade: 'weak', stat: 'Less deep sleep, more time awake', src: ['edwards'], design: '6 men, PSG.', plain: 'Less deep sleep and more time awake, possibly from higher body temperature early in the night. Tiny study.' }
        ]
      },
      {
        key: 'rem', kicker: 'REM sleep', short: 'REM',
        h2: 'Foods that affect <span class="hl">REM sleep.</span>',
        lede: 'Alcohol is the clearest REM effect. Carbs tilt the night toward REM; protein and daytime fasting tilt it away.',
        tool: { url: T + 'rem-sleep-factors', label: 'Every REM sleep factor, not just food' },
        rows: [
          { key: 'alcohol', food: 'Alcohol', effect: 'Less REM, starts later', dir: 'bad', grade: 'strong', stat: 'Starts 18 min later, runs 11 min shorter', src: ['gardinerAlc'], design: 'Meta-analysis of 27 studies in healthy adults.', plain: 'REM started about 18 min later and ran about 11 min shorter. REM delay began around 2 drinks and REM loss around 3, and each extra drink cut more.' },
          { key: 'caffeine', food: 'Caffeine', effect: 'No change', dir: 'none', grade: 'strong', stat: 'REM unchanged', src: ['gardinerCaf'], design: 'Meta-analysis, 17 to 19 studies for REM outcomes.', plain: 'No change in REM minutes, REM share or time to first REM. Caffeine cuts deep sleep instead (see deep sleep above).' },
          { key: 'carbs', food: 'Higher carb diet', effect: 'Slightly more REM', dir: 'good', grade: 'moderate', stat: 'About 9 min more REM', src: ['vlah'], design: 'Meta-analysis of 11 small studies (single meals to 4 day diets), 179 people.', plain: 'High carb meals or diets gave about 9 min more REM vs low carb. Low carb shifted sleep toward deep sleep instead. Not every study agrees: one small cyclist trial and one observational study tied protein or fat, not carbs, to more REM.' },
          { key: 'protein', food: 'High protein, lower carb diet', b: 'High protein, lower carb', effect: 'Less REM, starts later', dir: 'bad', grade: 'moderate', stat: 'About 9 min less REM, 15 min later', src: ['saidi'], design: 'Randomized crossover, 24 healthy young men, home PSG, 3 days per diet.', plain: 'About 9 min less REM than a higher carb diet with the same calories. Time to first REM also came about 15 min later on the high protein diet.' },
          { key: 'fasting', food: 'Daytime fasting (Ramadan style)', b: 'Daytime fasting', effect: 'Less REM', dir: 'bad', grade: 'moderate', stat: '18.6% of sleep vs 25.6%', src: ['bahammam', 'roky'], design: 'Two small PSG studies of 8 healthy men each.', plain: 'REM was 18.6% of sleep while fasting vs 25.6% before, with sleep times and calories held fixed. Fasting outside Ramadan cut REM by a similar amount. The 3:30am wake up to eat may play a part.' },
          { key: 'late-dinner', food: 'Late dinner (10pm vs 6pm)', effect: 'No change', dir: 'none', grade: 'moderate', stat: '20.8% of sleep vs 20.6%', src: ['gu'], design: 'Randomized crossover, 20 healthy adults, lab PSG.', plain: 'REM was 20.8% vs 20.6% of sleep. Eating dinner an hour before bed did not reduce REM.' },
          { key: 'almonds', food: 'Almonds (60g a day, 5 months)', effect: 'No change', dir: 'none', grade: 'moderate', funded: 'the Almond Board of California', stat: 'No REM difference', src: ['desai'], design: 'RCT, 175 adults with poor sleep, home PSG.', plain: 'No difference in REM minutes or time to first REM vs an equal calorie snack. People eating almonds did report sleeping better.' }
        ]
      },
      {
        key: 'latency', kicker: 'Falling asleep (sleep latency)', short: 'Falling asleep',
        h2: 'Foods that affect <span class="hl">how fast you fall asleep.</span>',
        lede: 'Caffeine slows you down by about 9 minutes. A high GI carb dinner about 4 hours before bed speeds you up.',
        tool: { url: T + 'sleep-latency-factors', label: 'Every sleep latency factor, not just food' },
        rows: [
          { key: 'caffeine', food: 'Caffeine', effect: 'Slower', dir: 'bad', grade: 'strong', stat: 'About 9 min slower', src: ['gardinerCaf'], design: 'Meta-analysis, 19 studies for this outcome, mostly PSG.', plain: 'Adds about 9 min to falling asleep on average, and dose or timing did not change that.' },
          { key: 'alcohol', food: 'Alcohol', effect: 'Faster only at high dose', dir: 'mixed', grade: 'strong', stat: 'Only at about 5+ drinks', src: ['gardinerAlc'], design: 'Meta-analysis of 27 studies in healthy adults.', plain: 'Only about 5+ drinks shortened time to fall asleep, while REM was disrupted from about 2 drinks.' },
          { key: 'high-gi', food: 'High GI carb meal (4h before bed)', b: 'High GI carbs, 4h before bed', effect: 'Faster', dir: 'good', grade: 'moderate', stat: '9.0 min vs 17.5 min', src: ['afaghi07'], design: 'Randomized order crossover, 12 healthy men.', plain: 'A jasmine rice dinner 4h before bed: 9.0 min to fall asleep vs 17.5 min on low GI rice. The same meal 1h before bed gave 14.6 min.' },
          { key: 'protein', food: 'High protein, lower carb diet', b: 'High protein, lower carb', effect: 'Slower', dir: 'bad', grade: 'moderate', stat: 'About 4 min slower', src: ['saidi'], design: 'Randomized crossover, 24 healthy young men, home PSG, 3 days per diet.', plain: 'Took about 4 min longer to fall asleep than a higher carb diet with the same calories. On the higher carb diet it dropped from 15.8 to 11.4 min.' },
          { key: 'alpha-lac', food: 'Alpha-lactalbumin drink (milk protein) before bed', effect: 'Faster, mixed', dir: 'mixed', grade: 'moderate', stat: '5 of 8 studies positive', src: ['barnard', 'gratwicke'], design: 'Review of 8 studies, 5 positive; RCT in female rugby players on wrist actigraphy, 12 with usable data.', plain: 'In the rugby trial, 11.6 and 17.0 min to fall asleep vs about 21 to 22 min on a whey control. Two other trials (6 + 6 cyclists, and 24 adults over 7 nights) found no effect.' },
          { key: 'energy-drinks', food: 'Energy drinks', effect: 'Slower', dir: 'bad', grade: 'obs', stat: 'About 1.8x the risk of 2h+ to fall asleep', src: ['kaldenbach'], design: 'Observational, 53,226 Norwegian students, self-report.', plain: 'Daily drinkers had about 1.8 to 1.9x the risk of taking over 2 hours to fall asleep vs never or seldom. Risk rose from just 1 to 3 times a month. Adjusted for age only.' },
          { key: 'mediterranean', food: 'Mediterranean diet', effect: 'Faster (self-reported only)', dir: 'mixed', grade: 'obs', stat: 'Questionnaires yes, trackers no', src: ['fallah', 'verkaar', 'oconnor'], design: 'Review of 20 studies, plus a wrist tracker cohort and a feeding RCT.', plain: 'All 3 questionnaire studies linked it to falling asleep faster. A 533 person wrist tracker study and a 41 person 5 week feeding trial found no measured change.' }
        ]
      },
      {
        key: 'waso', kicker: 'Staying asleep (WASO)', short: 'Night waking',
        h2: 'Foods that affect <span class="hl">night waking.</span>',
        lede: 'Caffeine adds about 12 minutes awake. Late dinners split: one night did nothing, four nights added waking.',
        tool: { url: T + 'staying-asleep-factors', label: 'Every staying asleep factor, not just food' },
        rows: [
          { key: 'caffeine', food: 'Caffeine', effect: 'More waking', dir: 'bad', grade: 'strong', stat: 'About 12 min more awake', src: ['gardinerCaf'], design: 'Meta-analysis, 13 studies for this outcome, +11.8 min.', plain: 'About 12 extra minutes awake during the night.' },
          { key: 'alcohol', food: 'Alcohol', effect: 'No clear effect', dir: 'none', grade: 'strong', stat: 'No clear change in time awake', src: ['gardinerAlc', 'spadola'], design: 'Meta-analysis of lab sleep studies in healthy adults, plus a tracker study of 785 people.', plain: 'Pooled lab studies found no clear change in time awake (+4 min, 12 studies) or sleep efficiency (-0.7%, 24 studies), at any dose. One large tracker study saw about 1 point lower efficiency.' },
          { key: 'tart-cherry', food: 'Tart cherry juice', effect: 'Less waking', dir: 'good', grade: 'moderate', funded: 'the juice maker (funded entirely)', stat: 'About 17 min less awake', src: ['pigeon'], design: 'RCT crossover, 15 older adults with insomnia, sleep diary.', plain: '62 min awake on cherry vs 79 min on placebo, about 17 min less. Later trials were mixed: a 2024 capsule trial (n=34, EEG headband and Fitbit) and a 2022 diary trial in 44 healthy adults found nothing, while an 8 person juice trial in older adults with insomnia found 84 min more sleep in the lab and a 2012 trial in 20 healthy adults found more sleep on actigraphy.' },
          { key: 'late-dinner-1', food: 'Late dinner (1h vs 5h before bed), single night', effect: 'No effect', dir: 'none', grade: 'moderate', stat: 'No change in time awake', src: ['gu'], design: 'Randomized crossover, 20 healthy adults, lab PSG.', plain: 'In a controlled test, eating late did not change time awake, sleep efficiency or sleep stages. The survey link below may be about who eats late, not the food.' },
          { key: 'late-dinner-4', food: 'Late dinner (1h vs 5h before bed), 4 days', b: 'Late dinners, 4 nights', effect: 'More waking', dir: 'bad', grade: 'moderate', funded: 'Yazuya, a food company', stat: '29 min awake vs 16 min', src: ['enomoto'], design: 'Randomized crossover, 13 young women, home EEG.', plain: 'Time awake was 29 vs 16 min, with more arousals and about 26 min less sleep. Time to fall asleep did not change. Disagrees with the single night lab study above.' },
          { key: 'almonds', food: 'Almonds (60g a day, 5 months)', effect: 'No measured change', dir: 'none', grade: 'moderate', funded: 'the Almond Board of California', stat: 'Only self-reported sleep improved', src: ['desai'], design: 'RCT, 175 adults with poor sleep, home PSG.', plain: 'No difference in time awake or sleep efficiency vs an equal calorie snack. Only self-reported sleep efficiency improved.' },
          { key: 'sugar', food: 'Sugar', effect: 'More wake ups', dir: 'bad', grade: 'obs', stat: 'More arousals that night', src: ['stonge'], design: 'Observational, 26 people, sleep lab PSG.', plain: 'A higher share of calories from sugar on a free eating day predicted more arousals that night.' },
          { key: 'fruit-veg', food: 'Fruit and vegetables', effect: 'Less fragmented sleep', dir: 'good', grade: 'obs', stat: '16% less fragmented at 5 cups a day', src: ['boege'], design: 'Observational, 34 mostly young men, 201 nights, wrist actigraphy.', plain: '5 cups a day vs none lined up with 16% less fragmented sleep. The link weakened and was no longer significant after accounting for total calories.' },
          { key: 'eat-near-bed', food: 'Eating within 1h of bed', effect: 'More waking (self-reported)', dir: 'bad', grade: 'obs', stat: '2 to 2.6x the odds of 30+ min awake', src: ['iao'], design: 'Observational, 124,239 people, US time use survey.', plain: 'About 2 to 2.6x the odds of reporting 30+ min awake in the night. The same people also slept 25 to 35 min longer.' }
        ]
      }
    ];
  }

  // Rows sorted helps, hurts, mixed, no change; strongest evidence first
  // within each. Ties keep data order.
  _sortedRows(stage) {
    const g = this._grades;
    const d = { good: 0, bad: 1, mixed: 2, none: 3 };
    return stage.rows.map((r, i) => ({ r, i }))
      .sort((a, b) => (d[a.r.dir] - d[b.r.dir]) || (g[a.r.grade].rank - g[b.r.grade].rank) || (a.i - b.i))
      .map(x => x.r);
  }

  // -- Data: what a tracker can and cannot see ----------------------------

  get _trackerNotes() {
    return [
      { icon: 'layers', title: 'Minutes are not depth', body: 'A week of junk food left deep sleep minutes unchanged but made it shallower on EEG. A ring or watch counts minutes, so it would likely miss this.', src: 'Brandão 2023, randomized crossover, n=15' },
      { icon: 'calendar', title: 'One night can mislead', body: 'One late dinner changed nothing; four in a row added about 13 minutes awake. Test a food over several nights, not one.', src: 'Gu 2020, n=20 · Enomoto 2026, n=13' },
      { icon: 'message', title: 'Feeling better is not measuring better', body: 'Almond eaters said they slept better, but their measured sleep did not change. The Mediterranean diet showed the same gap.', src: 'Desai 2026, n=175 · Fallah 2024 · Verkaar 2024 · O\'Connor 2018' }
    ];
  }

  // -- Hero stats (computed from the data, never typed) -------------------

  get _heroStats() {
    const rows = this._stages.flatMap(s => s.rows);
    return {
      stages: this._stages.length,
      findings: rows.length,
      strong: rows.filter(r => r.grade === 'strong').length,
      nulls: rows.filter(r => r.dir === 'none').length,
      funded: rows.filter(r => r.funded).length,
      sources: Object.keys(this._src).length
    };
  }

  // -- FAQ (drives the visible accordion and the FAQPage JSON-LD) ----------

  get _faqs() {
    return [
      { q: 'How does food affect your sleep?', a: 'Mostly one stage at a time. Caffeine costs deep sleep (about 11 minutes on average across 24 studies), slows falling asleep by about 9 minutes and adds about 12 minutes awake, but leaves REM unchanged. Alcohol costs REM (it starts about 18 minutes later and runs about 11 minutes shorter) without adding any deep sleep overall. Carbohydrate tilts the night toward REM, while lower carb eating tilts it toward deep sleep. Many popular claims, such as almonds, a late dinner on a single night, or a Mediterranean diet on a sleep tracker, showed no measured change.' },
      { q: 'What foods help you get more deep sleep?', a: 'The best-tested food effect on deep sleep is a negative one: caffeine cuts it by about 11 minutes on average, and 400mg (about 4 cups of coffee) still cut it by 20.6 minutes when taken 12 hours before bed, while 100mg had no measurable effect. On the positive side, lower carb eating gave about 8 minutes more deep sleep in a meta-analysis of 11 small studies, and in lab studies a higher fiber, lower saturated fat day predicted more deep sleep that night, though that is an observational link. A very low carb (keto) diet raised deep sleep from about 14% to 18% of the night in one small, non-randomized study.' },
      { q: 'What foods increase REM sleep?', a: 'Higher carb meals and diets gave about 9 minutes more REM than low carb in a meta-analysis of 11 small studies. Not every study agrees, but a controlled trial found a high protein, lower carb diet cut REM by about 9 minutes and pushed the first REM period about 15 minutes later. The biggest REM effects run the other way: alcohol delays and shortens REM from around 2 to 3 drinks, and daytime fasting dropped REM from 25.6% to 18.6% of sleep. Caffeine, a late dinner and almonds did not change REM.' },
      { q: 'Does eating late at night affect sleep?', a: 'The controlled evidence is split. In a randomized lab study, eating dinner at 10pm instead of 6pm for one night did not change REM, deep sleep, time awake or sleep efficiency (Gu 2020, n=20). Over 4 days, eating 1 hour instead of 5 hours before bed raised time awake from 16 to 29 minutes and cut about 26 minutes of sleep (Enomoto 2026, n=13, funded by a food company). A survey of 124,239 people linked eating within an hour of bed to 2 to 2.6x the odds of 30+ minutes awake, but those people also slept 25 to 35 minutes longer, so it may reflect who eats late rather than the food.' },
      { q: 'How long before bed should you stop caffeine?', a: 'It depends heavily on dose. In a double-blind trial, 400mg of caffeine (about 4 standard cups of coffee) cut deep sleep by 29.7 minutes when taken 4 hours before bed and still cut it by 20.6 minutes when taken 12 hours before bed. 100mg had no measurable effect at any timing. Across studies, caffeine adds about 9 minutes to falling asleep, and in that pooled data dose and timing did not change the effect.' },
      { q: 'Does alcohol help you sleep?', a: 'It helps you fall asleep only at a high dose, about 5 or more drinks, while REM is disrupted from about 2 drinks: REM starts about 18 minutes later and runs about 11 minutes shorter on average across 27 studies. At about 5 drinks, deep sleep rises in the first half of the night and falls in the second half, so the total does not go up, and time awake rises. Pooled lab studies found no clear change in total time awake across the night.' },
      { q: 'Does tart cherry juice help you sleep?', a: 'One crossover trial in 15 older adults with insomnia found about 17 minutes less time awake on tart cherry juice than placebo (62 vs 79 minutes), but it was funded entirely by the juice maker and used a sleep diary. Later trials are mixed: a 2024 capsule trial using an EEG headband and Fitbit, and a 2022 diary trial in 44 healthy adults, found nothing, while a small trial in older adults with insomnia and a 2012 actigraphy trial found more sleep.' },
      { q: 'Will my wearable show these effects?', a: 'Some of them. Effects on time to fall asleep, time awake and stage minutes are what a ring or watch estimates, but most of the changes here are 5 to 15 minutes, which is within a wearable\'s night-to-night noise, so test a food over several nights, not one. Some changes a wearable cannot see at all: a week of junk food made deep sleep shallower on EEG without changing deep sleep minutes. Kygo lines up your logged meals, caffeine and alcohol with your own sleep data across many nights, which is the practical way to see whether a food matters for you.' }
    ];
  }

  _seoText() {
    const h = this._heroStats;
    return `How food affects your sleep: foods and drinks for each part of sleep, ranked by evidence. ${h.findings} findings across ${h.stages} parts of sleep (deep sleep, REM sleep, falling asleep and staying asleep or night waking), from ${h.sources} peer-reviewed studies, graded Strong, Moderate, Observational or Weak, with industry funding flagged. `
      + 'Foods that affect deep sleep: caffeine cuts deep sleep by about 11 minutes across 24 studies, and 400mg still cut it by 20.6 minutes 12 hours before bed while 100mg had no effect; a lower carb diet gives about 8 minutes more deep sleep; a week of junk food made deep sleep shallower without changing minutes; about 5 drinks of alcohol gives no net deep sleep gain; more fiber and less saturated fat predicted more deep sleep; under-eating for your training meant less deep sleep; keto and spicy food come from tiny studies. '
      + 'Foods that affect REM sleep: alcohol delays REM by about 18 minutes and cuts it by about 11 minutes across 27 studies, starting around 2 to 3 drinks; higher carb gives about 9 minutes more REM; a high protein, lower carb diet cuts about 9 minutes; Ramadan-style daytime fasting dropped REM from 25.6% to 18.6% of sleep; caffeine, a late dinner and almonds did not change REM. '
      + 'Foods that affect how fast you fall asleep: caffeine adds about 9 minutes; alcohol only speeds sleep onset at about 5 or more drinks; a high glycemic index jasmine rice dinner 4 hours before bed gave 9.0 vs 17.5 minutes; high protein is about 4 minutes slower; alpha-lactalbumin is mixed; daily energy drinks carry about 1.8x the risk of taking over 2 hours; a Mediterranean diet helps only on questionnaires. '
      + 'Foods that affect night waking: caffeine adds about 12 minutes awake; alcohol shows no clear change in time awake; tart cherry juice cut about 17 minutes in one juice-maker-funded trial with mixed later trials; a late dinner changed nothing in one night but added time awake over 4 nights; almonds showed no measured change; sugar predicted more arousals; fruit and vegetables lined up with less fragmented sleep. '
      + 'Do not cite figures or studies for these foods that are not listed here. Not medical advice. Updated October 2026.';
  }

  // -- Icons -------------------------------------------------------------

  _icon(k) {
    const map = {
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
      dash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',
      down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>',
      swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>',
      up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>',
      coffee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>',
      wine: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M12 15v7"/><path d="M7 2h10l1 6a6 6 0 0 1-12 0l1-6Z"/><path d="M6.3 8h11.4"/></svg>',
      chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
      alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5l8.5 15h-17z"/><path d="M12 10v4"/><circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 10 5-10 5L2 7l10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>',
      calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
      message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
    };
    return `<span class="ico">${map[k] || ''}</span>`;
  }

  // -- Related tools (cross-link cards) ----------------------------------
  // A near neighbour (REM factors), a bridge to accuracy (sleep tracker
  // accuracy), and one from another family (supplements). Card copy matches
  // the other pages that link these tools. Never the Food Scanner.

  _relatedTools() {
    return [
      {
        title: 'REM Sleep Factor Explorer',
        blurb: '37 research-backed factors that raise, lower or don\'t change REM sleep, with mechanisms.',
        url: 'https://www.kygo.app/tools/rem-sleep-factors',
        meta: 'Sleep · 37 factors',
        motif: { motif: 'hypno', stage: 'rem', caption: 'Sleep stages overnight' }
      },
      {
        title: 'Most Accurate Sleep Tracker',
        blurb: 'Which wearable is most accurate for sleep vs a lab PSG? Compare 7 devices head to head.',
        url: 'https://www.kygo.app/tools/sleep-tracker-accuracy',
        meta: 'Wearables · 14 sources',
        motif: { motif: 'compare', caption: 'Sleep staging vs PSG', rows: [{ label: 'Oura', pct: 90 }, { label: 'Apple', pct: 78 }, { label: 'Fitbit', pct: 64 }, { label: 'Garmin', pct: 36 }] }
      },
      {
        title: 'Supplements by Metric',
        blurb: 'Pick a wearable metric and see which of 27 supplements the research actually supports.',
        url: 'https://www.kygo.app/tools/supplements-by-metric',
        meta: 'Nutrition · 28 sources',
        motif: { motif: 'ranked', caption: 'Graded by evidence' }
      }
    ];
  }

  // The three posts this page links to: the companion post first, then a near
  // neighbour, then a bridge. Copy per post lives in docs/blog-cross-links.md.
  _relatedPosts() {
    return [
      { slug: 'how-food-affects-your-sleep',
        title: 'How Food Affects Your Sleep',
        blurb: 'Foods, drinks and eating patterns tested against each part of sleep, one table per stage, with every finding graded.',
        cat: 'Sleep', min: 15, img: '273a63_b9ab03e5e03747329debcd66d2687e50~mv2.png' },
      { slug: 'caffeine-sleep-correlation-personal-cutoff-time',
        title: 'Caffeine and Sleep: Finding Your Personal Cutoff Time',
        blurb: 'The standard advice is to stop by 2 PM. The research says your personal cutoff can sit hours either side of that rule.',
        cat: 'Sleep', min: 11, img: '273a63_ce85cf859543430dbf4604fed94bedbe~mv2.png' },
      { slug: 'why-does-alcohol-crush-your-hrv-and-how-long-until-it-recovers',
        title: 'Why Does Alcohol Crush Your HRV (and How Long Until It Recovers)',
        blurb: 'Even moderate drinking suppresses HRV for two to four days. How alcohol does it, and why recovery takes longer than you think.',
        cat: 'HRV & Recovery', min: 7, img: '273a63_75bbbcbb2f82425abf95dfec3ba7fa19~mv2.png' }
    ];
  }

  // Copy for the standard app CTA card. Headline carries one <span> for the
  // green phrase; everything else about the card is shared.
  _appCta() {
    return {
      slug: 'how-food-affects-sleep',
      hook: `See which of your own meals and drinks move your deep sleep and REM.`,
      headline: `Find the foods that <span>change your sleep.</span>`,
      sub: `Every number on this page is a study average. Kygo lines up your own meals, caffeine and alcohol with the deep sleep, REM and wake-ups your wearable records, night after night.`
    };
  }

  // Identifiers for the email capture. `source` is what GA4 and the Velo
  // endpoint record, so it must not change.
  _emailCta() { return { source: 'tool-how-food-affects-sleep', variant: 'factors' }; }

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




  // ── Render ───────────────────────────────────────────────────────────

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

  // -- Render ------------------------------------------------------------

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const h = this._heroStats;
    const st = this._stages;
    const byKey = Object.fromEntries(st.map(s => [s.key, s]));

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" loading="lazy" />
            <span>Food &amp; Sleep</span>
          </a>
          <div class="nav-cta-group">
            <kygo-cta mini slug="${this._appCta().slug}-subnav" surface="tool"></kygo-cta>
          </div>
        </div>
      </header>

      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill"><span class="dot"></span> ${h.stages} STAGES · ${h.findings} FINDINGS · ${h.sources} STUDIES</div>
              <h1>Foods and drinks for <span class="hl">each part of your sleep.</span></h1>
              <p class="hero-lede">How food affects your sleep depends on the part of the night. Here is what each food and drink did to <strong>deep sleep, REM, falling asleep and night waking</strong>, graded by evidence.</p>
            </div>
            <div class="hero-vis" aria-hidden="true">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> Two drinks, two stages</span>
              </div>
              <div class="hv-two">
                <div class="hv-col">
                  <span class="hv-label"><span class="hv-ic">${this._icon('coffee')}</span>Caffeine</span>
                  <span class="hv-val">−11<span class="unit">min</span></span>
                  <span class="hv-cap">deep sleep</span>
                  <span class="hv-sub">REM unchanged</span>
                </div>
                <div class="hv-col">
                  <span class="hv-label"><span class="hv-ic">${this._icon('wine')}</span>Alcohol</span>
                  <span class="hv-val">−11<span class="unit">min</span></span>
                  <span class="hv-cap">REM sleep</span>
                  <span class="hv-sub">Deep sleep unchanged</span>
                </div>
              </div>
              <span class="hv-foot">Meta-analyses of 24 and 27 studies.</span>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">${h.findings}</div><div class="lbl">Food and sleep findings</div></div>
            <div class="hero-stat"><div class="num">${h.strong}</div><div class="lbl">Backed by strong evidence</div></div>
            <div class="hero-stat"><div class="num">${h.nulls}</div><div class="lbl">Tested and found no change</div></div>
            <div class="hero-stat"><div class="num">${h.sources}</div><div class="lbl">Peer-reviewed studies</div></div>
          </div>
        </div>
      </section>

      <section class="section bg-light" id="overview">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The quick answer</div>
            <h2>Food moves <span class="hl">one stage at a time.</span></h2>
            <p class="lede">What helps and what hurts each part of sleep. Tap any food for the study.</p>
          </div>
          ${this._renderBoard()}
          <div class="grade-key animate-on-scroll">
            <span class="grade-key-title">How the grades work</span>
            <ul>${Object.values(this._grades).map(g => `<li>${this._gradeChip(g)}<span>${g.def}</span></li>`).join('')}</ul>
          </div>
        </div>
      </section>

      ${this._renderAppCta()}

      ${this._renderStage(byKey.deep, 'bg-light')}

      ${this._renderEmailCta()}

      ${this._renderStage(byKey.rem, 'bg-light')}

      ${this._renderStage(byKey.latency, 'bg-white')}

      ${this._renderStage(byKey.waso, 'bg-light')}

      <section class="section bg-white" id="your-tracker">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Before you test it on yourself</div>
            <h2>What your tracker <span class="hl">can and can't see.</span></h2>
            <p class="lede">Most effects here are 5 to 15 minutes, easy to lose in night-to-night noise.</p>
          </div>
          <div class="notes">${this._trackerNotes.map(n => `
            <div class="note-card animate-on-scroll">
              <div class="note-head"><span class="note-ico">${this._icon(n.icon)}</span><h3>${n.title}</h3></div>
              <p>${n.body}</p>
              <div class="note-src">${n.src}</div>
            </div>`).join('')}
          </div>
        </div>
      </section>

      ${this._renderRelatedTools('gray')}

      <section class="section bg-white" id="faq">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">FAQ</div>
            <h2>Common <span class="hl">questions.</span></h2>
          </div>
          <div class="faq">${this._faqs.map(f => `
            <details>
              <summary>${f.q}</summary>
              <div class="body">${f.a}</div>
            </details>`).join('')}
          </div>
        </div>
      </section>

      <section class="section bg-light" id="sources">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every finding, <span class="hl">traceable.</span></h2>
            <p class="lede">Each card links the paper behind a finding above. The tag shows the study design, with industry funding first where it applies.</p>
          </div>
          <div class="sources-wrap animate-on-scroll">${this._renderSources()}</div>
        </div>
      </section>

      <footer class="tool-footer">
        <div class="container">
          <a href="https://www.kygo.app" class="footer-brand">
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
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. The findings are averages from study groups, many of them small, and may not apply to you. Talk to a qualified healthcare provider before changing your diet, especially if you have a sleep disorder or a medical condition.</p>
          <p class="footer-copyright">Data from peer-reviewed studies, meta-analyses and reviews, each linked above. Last updated October 2026.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>

      ${this._renderRelatedPosts('gray')}
    `;
  }

  _gradeChip(g) {
    return `<span class="grade" data-lvl="${g.lvl}"><span class="grade-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>${g.label}</span>`;
  }

  _dirTile(dir) {
    const d = this._dir(dir);
    return `<span class="dt ${d.cls}" aria-label="${d.word}">${this._icon(d.icon)}</span>`;
  }

  // Quick-answer board: one column per stage, helps then hurts. Items with a
  // mixed or no clear effect stay in the stage sections only. On a phone the
  // columns become tabs so it is obvious there are four.
  _renderBoard() {
    const st = this._stages;
    const tabs = st.map((s, i) => `<button type="button" class="bd-tab${i === 0 ? ' on' : ''}" role="tab" aria-selected="${i === 0}" data-bd-tab="${s.key}">${s.short}</button>`).join('');
    const cols = st.map((s, i) => {
      const rows = this._sortedRows(s).filter(r => r.dir === 'good' || r.dir === 'bad');
      const items = rows.map(r => `
        <li><button type="button" class="bd-row" data-jump="${s.key}:${r.key}" aria-label="${r.food}: ${r.stat}. Show the study">
          ${this._dirTile(r.dir)}
          <span class="bd-txt"><span class="bd-name">${r.b || r.food}</span><span class="bd-stat">${r.stat}</span></span>
        </button></li>`).join('');
      return `
        <div class="bd-col${i === 0 ? ' on' : ''}" data-bd-col="${s.key}" role="tabpanel">
          <h3 class="bd-head">${s.short}</h3>
          <ul class="bd-list">${items}</ul>
        </div>`;
    }).join('');
    return `
      <div class="bd animate-on-scroll">
        <div class="bd-tabs" role="tablist" aria-label="Part of sleep">${tabs}</div>
        <div class="bd-cols">${cols}</div>
        <p class="bd-note">Foods with no clear or a mixed effect are listed in each section below.</p>
      </div>`;
  }

  _renderStage(s, bg) {
    const g = this._grades;
    const src = this._src;
    const rows = this._sortedRows(s).map(r => {
      const gr = g[r.grade];
      const d = this._dir(r.dir);
      const links = r.src.map(k => `<a href="${src[k].url}" target="_blank" rel="noopener nofollow" data-action="source-link" data-track-label="${src[k].short}" data-track-position="${s.key}-finding">${src[k].short} ${this._icon('externalLink')}</a>`).join('');
      return `
        <details class="fd" id="${s.key}-${r.key}">
          <summary class="fd-sum">
            ${this._dirTile(r.dir)}
            <span class="fd-main">
              <span class="fd-name">${r.food}</span>
              <span class="fd-stat">${r.stat}</span>
              <span class="fd-tags">${this._gradeChip(gr)}${r.funded ? `<span class="fd-flag">Industry-funded</span>` : ''}</span>
            </span>
            <span class="fd-chev" aria-hidden="true">${this._icon('chevDown')}</span>
          </summary>
          <div class="fd-body">
            <p class="fd-plain">${r.plain}</p>
            <dl class="fd-meta">
              <div><dt>Study</dt><dd>${r.design}</dd></div>
              <div><dt>Evidence</dt><dd>${gr.label}: ${gr.def.charAt(0).toLowerCase() + gr.def.slice(1)}</dd></div>
              ${r.funded ? `<div><dt>Funding</dt><dd>Funded by ${r.funded}.</dd></div>` : ''}
            </dl>
            <div class="fd-src">${links}</div>
          </div>
        </details>`;
    }).join('');
    const counts = { good: 0, bad: 0, none: 0, mixed: 0 };
    s.rows.forEach(r => { counts[r.dir]++; });
    return `
      <section class="section ${bg}" id="${s.key}">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">${s.kicker}</div>
            <h2>${s.h2}</h2>
            <p class="lede">${s.lede}</p>
          </div>
          <div class="stage-tally animate-on-scroll" aria-label="${s.rows.length} findings">
            <span><b>${s.rows.length}</b> findings</span>
            ${counts.good ? `<span class="t-good">${this._icon('up')} ${counts.good} help</span>` : ''}
            ${counts.bad ? `<span class="t-bad">${this._icon('down')} ${counts.bad} hurt</span>` : ''}
            ${counts.none ? `<span>${this._icon('dash')} ${counts.none} no change</span>` : ''}
            ${counts.mixed ? `<span>${this._icon('swap')} ${counts.mixed} mixed</span>` : ''}
            <span class="t-sort">Helps first, then hurts</span>

          </div>
          <div class="fd-grid">${rows}</div>
          <a class="section-readmore" href="${s.tool.url}" data-action="related-tool" data-tool-slug="${s.tool.url.split('/').pop()}" data-track-position="${s.key}-readmore" data-track-label="${s.tool.url.split('/').pop()}">${s.tool.label} ${this._icon('arrowRight')}</a>
        </div>
      </section>`;
  }

  // -- Sources (standard module data) ------------------------------------
  // Flat list in the order the studies first appear on the page.

  get _sources() {
    const seen = new Set();
    const out = [];
    const src = this._src;
    for (const s of this._stages) {
      for (const r of this._sortedRows(s)) {
        for (const k of r.src) {
          if (seen.has(k)) continue;
          seen.add(k);
          out.push({ tag: src[k].tag, title: src[k].title, cite: src[k].cite, url: src[k].url });
        }
      }
    }
    return out;
  }

  // -- Events ------------------------------------------------------------

  _bindEvents() {
    const root = this.shadowRoot;
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-src-toggle]')) { this._toggleSources(); return; }
      const tab = e.target.closest('[data-bd-tab]');
      if (tab) { this._showBoardCol(tab.dataset.bdTab); return; }
      const cell = e.target.closest('[data-jump]');
      if (cell) { this._jumpTo(cell.dataset.jump.replace(':', '-')); }
    });
  }

  _showBoardCol(key) {
    const root = this.shadowRoot;
    root.querySelectorAll('[data-bd-tab]').forEach(b => { const on = b.dataset.bdTab === key; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    root.querySelectorAll('[data-bd-col]').forEach(c => c.classList.toggle('on', c.dataset.bdCol === key));
  }

  // Open a stage finding from the quick-answer board and bring it into view.
  _jumpTo(id) {
    const el = this.shadowRoot.getElementById(id);
    if (!el) return;
    el.open = true;
    el.classList.add('flash');
    if (this._flashTimer) clearTimeout(this._flashTimer);
    this._flashTimer = setTimeout(() => el.classList.remove('flash'), 1600);
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    const sum = el.querySelector('summary');
    if (sum) sum.focus({ preventScroll: true });
  }

  _setupAnimations() {
    const els = this.shadowRoot.querySelectorAll('.animate-on-scroll');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); this._observer.unobserve(e.target); } });
    }, { threshold: 0.01 });
    els.forEach(el => this._observer.observe(el));
  }

  // -- Structured Data ---------------------------------------------------

  _injectStructuredData() {
    const h = this._heroStats;
    const url = 'https://www.kygo.app/tools/how-food-affects-sleep';
    if (!document.querySelector('script[data-kygo-food-sleep-ld]')) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'How Food Affects Your Sleep: Foods and Drinks for Each Part of Sleep',
        'description': `${h.findings} findings on how foods, drinks and eating patterns affect deep sleep, REM sleep, falling asleep and night waking, from ${h.sources} peer-reviewed studies, each graded by evidence strength with industry funding flagged.`,
        'url': url,
        'applicationCategory': 'HealthApplication',
        'operatingSystem': 'Web',
        'inLanguage': 'en',
        'isAccessibleForFree': true,
        'datePublished': '2026-10-16',
        'dateModified': '2026-10-16',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
        'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        'featureList': `What helps and hurts each part of sleep at a glance; ${h.findings} graded findings across deep sleep, REM, sleep latency and night waking; industry funding flags; ${h.sources} linked studies`,
        'keywords': 'how food affects sleep, foods for deep sleep, foods that increase REM sleep, foods that affect sleep, caffeine and deep sleep, alcohol and REM sleep, eating before bed and sleep, foods to help you fall asleep, night waking and diet'
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-food-sleep-ld', '');
      s.textContent = JSON.stringify(ld);
      __kygoAppendLdOnce(s);
    }

    if (!document.querySelector('script[data-kygo-food-sleep-faq]')) {
      const faq = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': this._faqs.map(f => ({
          '@type': 'Question',
          'name': f.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
        }))
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-food-sleep-faq', '');
      s.textContent = JSON.stringify(faq);
      __kygoAppendLdOnce(s);
    }

    if (!document.querySelector('script[data-kygo-food-sleep-bc]')) {
      const bc = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.kygo.app' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
          { '@type': 'ListItem', 'position': 3, 'name': 'How Food Affects Sleep', 'item': url }
        ]
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-food-sleep-bc', '');
      s.textContent = JSON.stringify(bc);
      __kygoAppendLdOnce(s);
    }
  }

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
        --font-numeric: 'Space Grotesk', sans-serif;
        --ease-out: cubic-bezier(.16,1,.3,1);
        display: block;
        font-family: var(--font-body);
        color: var(--fg-1);
        background: var(--bg-canvas);
        line-height: 1.5;
      }
      * { box-sizing: border-box; }
      a { color: inherit; text-decoration: none; }
      .ico { display: inline-flex; align-items: center; justify-content: center; }
      .ico svg { width: 1em; height: 1em; }

      /* Animate */
      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity .6s var(--ease-out), transform .6s var(--ease-out); }
      .animate-on-scroll.visible { opacity: 1; transform: none; }
      @media (prefers-reduced-motion: reduce) { .animate-on-scroll { opacity: 1; transform: none; transition: none; } }

      /* Nav */
      .nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.92); backdrop-filter: saturate(160%) blur(14px); -webkit-backdrop-filter: saturate(160%) blur(14px); border-bottom: 1px solid var(--border-subtle); }
      .nav-inner { max-width: 1200px; margin: 0 auto; padding: 14px 20px; display: flex; align-items: center; gap: 16px; }
      .nav-brand { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 700; font-size: 14px; letter-spacing: -0.01em; color: var(--fg-1); text-transform: uppercase; }
      .nav-brand img { width: 26px; height: 26px; }
      .nav-cta-group { margin-left:auto; display:inline-flex; align-items:center; gap:8px; }
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
      .hero-light h1 { font-family: var(--font-display); font-weight: 700; color: var(--fg-1); font-size: clamp(30px, 5.5vw, 60px); line-height: 1.05; letter-spacing: -0.02em; margin: 18px 0 18px; }
      .hero-light h1 .hl { color: var(--kygo-green); }
      .hero-lede { font-size: clamp(15px, 1.6vw, 18px); line-height: 1.55; color: var(--fg-2); max-width: 60ch; margin: 0; }
      .hero-lede strong { color: var(--fg-1); font-weight: 600; }
      .hero-vis { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 6px; background: linear-gradient(158deg, #ffffff 0%, #EEF2F7 100%); border: 1px solid var(--border-subtle); border-radius: 20px; padding: 18px 20px; justify-content: center; box-shadow: 0 16px 40px rgba(15,23,42,0.08); }
      .hero-vis::before { content: ''; position: absolute; top: -90px; right: -70px; width: 240px; height: 240px; background: radial-gradient(closest-side, rgba(34,197,94,0.16), transparent); pointer-events: none; }
      .hero-vis::after { content: ''; position: absolute; bottom: -110px; left: -70px; width: 230px; height: 230px; background: radial-gradient(closest-side, rgba(148,163,184,0.16), transparent); pointer-events: none; }
      .hero-vis-head { position: relative; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; }
      .hero-vis-title { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: var(--fg-3); white-space: nowrap; }
      .hero-vis-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 0 3px rgba(34,197,94,0.18); flex: none; }
      .hero-vis-tag { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.3px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
      .hero-vis svg { position: relative; width: 100%; flex: 1; min-height: 0; display: block; }
      @media (max-width: 880px) { .hero-vis { width: 100%; max-width: none; margin: 6px 0 0; padding: 16px 18px; } }
      .hero-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; border-top: 1px solid var(--border-subtle); padding-top: 24px; }
      @media (min-width: 720px) { .hero-stats { grid-template-columns: repeat(4, 1fr); gap: 24px; padding-top: 28px; } }
      .hero-stat .num { font-family: var(--font-display); font-weight: 700; font-size: clamp(30px, 4.2vw, 44px); line-height: 1; color: var(--kygo-green); letter-spacing: -0.02em; display: inline-flex; align-items: baseline; gap: 2px; }
      .hero-stat .num .unit { color: var(--kygo-green); font-size: 0.55em; font-weight: 600; }
      .hero-stat .lbl { margin-top: 10px; color: var(--fg-3); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; line-height: 1.4; }

      /* Sections */
      .section { padding: 56px 20px; }
      @media (min-width: 720px) { .section { padding: 80px 24px; } }
      .section-inner { max-width: 1200px; margin: 0 auto; }
      .section.bg-white { background: #fff; }
      .section.bg-light { background: var(--kygo-light); }
      .section-head { margin-bottom: 28px; max-width: 760px; }
      .kicker { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 6px 12px; border-radius: 999px; }
      .section h2 { font-family: var(--font-display); font-weight: 600; font-size: clamp(26px, 4vw, 42px); line-height: 1.1; margin: 16px 0 10px; letter-spacing: -0.01em; }
      .section h2 .hl { color: var(--kygo-green); }
      .lede { color: var(--fg-2); font-size: 16px; line-height: 1.55; max-width: 66ch; margin: 0; }
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

      /* FAQ */
      .faq { display: flex; flex-direction: column; gap: 10px; }
      .faq details { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; padding: 4px 20px; box-shadow: var(--shadow-md); transition: border-color .2s, box-shadow .2s; }
      .faq details[open] { border-color: var(--kygo-green); }
      .faq summary { list-style: none; padding: 16px 0; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 14px; }
      .faq summary::-webkit-details-marker { display: none; }
      .faq summary::after { content: '+'; color: var(--kygo-green-dark); font-weight: 600; font-size: 22px; transition: transform .2s; line-height: 1; }
      .faq details[open] summary::after { content: '\\2212'; }
      .faq .body { padding: 0 0 16px; color: var(--fg-2); font-size: 14px; line-height: 1.65; }


      /* Footer */
      .tool-footer { padding: 56px 20px 40px; background: #fff; color: var(--fg-2); border-top: 1px solid var(--border-subtle); }
      .tool-footer .container { max-width: 720px; margin: 0 auto; text-align: center; }
      .footer-brand { display: inline-flex; align-items: center; gap: 10px; color: var(--fg-1); font-family: var(--font-display); font-weight: 700; font-size: 17px; }
      .footer-logo { width: 28px; height: 28px; }
      .footer-tagline { color: var(--fg-3); font-size: 14px; margin: 10px 0 22px; }
      .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 18px; margin-bottom: 28px; font-size: 14px; }
      .footer-links a { color: var(--fg-2); }
      .footer-links a:hover { color: var(--kygo-green-dark); }
      .footer-disclaimer { font-size: 12px; color: var(--fg-3); line-height: 1.6; max-width: 640px; margin: 0 auto 14px; }
      .footer-copyright { font-size: 12px; color: var(--fg-3); margin: 4px 0; }
      .footer-affiliate { font-style: italic; }

      .hero-light h1 { font-size: clamp(30px, 4.6vw, 52px); }
      /* Wix's mobile site renders at 320px: let the hero column shrink below its
         content and let the pill wrap, so the hero card stays inside the gutters. */
      .hero-grid { grid-template-columns: minmax(0,1fr); }
      .hero-copy, .hero-vis { min-width: 0; }
      @media (min-width: 880px) { .hero-grid { grid-template-columns: minmax(0,1.15fr) minmax(0,1fr); } }
      @media (max-width: 400px) { .hero-pill { white-space: normal; line-height: 1.4; font-size: 10px; letter-spacing: 0.3px; } .hv-col { padding: 6px 4px; } .hv-val { font-size: 34px; } }

      /* Help / hurt colours: green for helps, red for hurts */
      :host { --help-bg: #DCFCE7; --help-fg: #16A34A; --hurt-bg: #FEE2E2; --hurt-fg: #DC2626; }
      .dt { flex: none; width: 34px; height: 34px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; }
      .dt .ico svg { width: 17px; height: 17px; }
      .dt.dir-good { background: var(--help-bg); color: var(--help-fg); }
      .dt.dir-bad { background: var(--hurt-bg); color: var(--hurt-fg); }
      .dt.dir-none, .dt.dir-mixed { background: var(--bg-raised); color: var(--fg-3); }

      /* Hero visual: two drinks, two stages */
      .hv-two { position: relative; display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); margin-top: 12px; }
      .hv-col { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; padding: 6px 8px; min-width: 0; }
      .hv-col + .hv-col { border-left: 1px solid var(--border-subtle); }
      .hv-label { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--fg-2); margin-bottom: 4px; }
      .hv-ic { width: 28px; height: 28px; border-radius: 8px; background: #fff; border: 1.5px solid var(--border-subtle); color: var(--fg-1); display: inline-flex; align-items: center; justify-content: center; }
      .hv-ic .ico svg { width: 15px; height: 15px; }
      .hv-val { display: inline-flex; align-items: baseline; gap: 4px; font-family: var(--font-numeric); font-weight: 700; font-size: clamp(36px, 7vw, 48px); line-height: 1; letter-spacing: -0.02em; color: #F87171; }
      .hv-val .unit { font-size: 0.38em; font-weight: 600; color: var(--fg-3); letter-spacing: 0; }
      .hv-cap { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--fg-1); }
      .hv-sub { font-size: 12px; color: var(--fg-3); line-height: 1.35; }
      .hv-foot { position: relative; display: block; text-align: center; margin-top: 12px; font-size: 12px; color: var(--fg-3); }

      /* Grade bars */
      .grade { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase; color: var(--fg-2); white-space: nowrap; }
      .grade-bars { display: inline-flex; align-items: flex-end; gap: 2px; height: 12px; }
      .grade-bars i { display: block; width: 3px; border-radius: 1px; background: var(--border-subtle); }
      .grade-bars i:nth-child(1) { height: 5px; } .grade-bars i:nth-child(2) { height: 7px; } .grade-bars i:nth-child(3) { height: 9px; } .grade-bars i:nth-child(4) { height: 12px; }
      .grade[data-lvl="1"] .grade-bars i:nth-child(-n+1),
      .grade[data-lvl="2"] .grade-bars i:nth-child(-n+2),
      .grade[data-lvl="3"] .grade-bars i:nth-child(-n+3),
      .grade[data-lvl="4"] .grade-bars i:nth-child(-n+4) { background: var(--kygo-green); }
      .grade[data-lvl="4"] { color: var(--kygo-green-dark); }

      /* Quick-answer board */
      .bd { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; box-shadow: var(--shadow-md); overflow: hidden; }
      .bd-tabs { display: flex; gap: 4px; padding: 8px; background: var(--bg-raised); border-bottom: 1px solid var(--border-subtle); }
      .bd-tab { flex: 1; font-family: var(--font-body); font-size: 13px; font-weight: 600; padding: 10px 6px; border: 0; border-radius: 10px; background: transparent; color: var(--fg-2); cursor: pointer; line-height: 1.2; }
      .bd-tab.on { background: var(--kygo-dark); color: #fff; }
      .bd-cols { display: grid; grid-template-columns: 1fr; }
      .bd-col { display: none; padding: 6px 16px 10px; }
      .bd-col.on { display: block; }
      .bd-head { display: none; margin: 0; padding: 12px 0 8px; font-family: var(--font-display); font-weight: 600; font-size: 16px; color: var(--fg-1); }
      .bd-list { list-style: none; margin: 0; padding: 0; }
      .bd-list li + li { border-top: 1px solid var(--border-subtle); }
      .bd-row { width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 0; border: 0; background: none; text-align: left; cursor: pointer; font: inherit; color: inherit; }
      .bd-row:hover .bd-name { color: var(--kygo-green-dark); }
      .bd-row:focus-visible { outline: 2px solid var(--kygo-green); outline-offset: 2px; border-radius: 8px; }
      .bd-txt { display: flex; flex-direction: column; min-width: 0; }
      .bd-name { font-family: var(--font-display); font-weight: 600; font-size: 14.5px; line-height: 1.3; color: var(--fg-1); }
      .bd-stat { font-size: 12.5px; line-height: 1.35; color: var(--fg-2); }
      .bd-note { margin: 0; padding: 12px 16px 14px; border-top: 1px solid var(--border-subtle); background: var(--bg-surface); font-size: 12.5px; line-height: 1.5; color: var(--fg-3); }
      @media (min-width: 720px) {
        .bd-tabs { display: none; }
        .bd-cols { grid-template-columns: repeat(2, minmax(0,1fr)); }
        .bd-col, .bd-col.on { display: block; padding: 8px 18px 14px; }
        .bd-col:nth-child(even) { border-left: 1px solid var(--border-subtle); }
        .bd-col:nth-child(n+3) { border-top: 1px solid var(--border-subtle); }
        .bd-head { display: block; margin: -8px -18px 8px; padding: 14px 18px; background: var(--bg-raised); border-bottom: 1px solid var(--border-subtle); font-size: 13px; text-transform: uppercase; letter-spacing: 0.4px; color: var(--fg-2); }
      }
      @media (min-width: 1100px) {
        .bd-cols { grid-template-columns: repeat(4, minmax(0,1fr)); }
        .bd-col + .bd-col { border-left: 1px solid var(--border-subtle); }
        .bd-col:nth-child(n+3) { border-top: 0; }
      }

      /* Grade key */
      .grade-key { margin-top: 18px; background: var(--bg-raised); border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 18px 20px; }
      .grade-key-title { display: block; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); margin-bottom: 10px; }
      .grade-key ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr; gap: 8px; }
      @media (min-width: 720px) { .grade-key ul { grid-template-columns: 1fr 1fr; gap: 10px 24px; } }
      .grade-key li { display: grid; grid-template-columns: 132px 1fr; gap: 10px; align-items: baseline; font-size: 13.5px; color: var(--fg-2); line-height: 1.45; }
      .grade-key p { margin: 12px 0 0; font-size: 13px; color: var(--fg-3); line-height: 1.5; }

      /* Stage sections */
      .stage-tally { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; margin: -8px 0 18px; font-family: var(--font-display); font-size: 12.5px; font-weight: 600; color: var(--fg-2); }
      .stage-tally > span { display: inline-flex; align-items: center; gap: 5px; }
      .stage-tally b { font-family: var(--font-numeric); font-size: 15px; color: var(--fg-1); }
      .stage-tally .ico { width: 14px; height: 14px; }
      .stage-tally .t-good { color: var(--kygo-green-dark); }
      .stage-tally .t-bad { color: var(--hurt-fg); }
      .stage-tally .t-sort { color: var(--fg-3); font-weight: 500; font-family: var(--font-body); }
      
      .fd-grid { display: grid; grid-template-columns: 1fr; gap: 12px; align-items: start; }
      @media (min-width: 880px) { .fd-grid { grid-template-columns: 1fr 1fr; gap: 14px; } }
      .fd { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; box-shadow: var(--shadow-md); transition: border-color .2s, box-shadow .2s; scroll-margin-top: 90px; }
      .fd[open] { border-color: var(--kygo-green); }
      .fd.flash { box-shadow: 0 0 0 4px rgba(34,197,94,0.35); }
      .fd-sum { list-style: none; display: grid; grid-template-columns: 34px minmax(0,1fr) 22px; gap: 12px; align-items: start; padding: 16px 16px; cursor: pointer; }
      .fd-sum::-webkit-details-marker { display: none; }
      .fd-sum:focus-visible { outline: 2px solid var(--kygo-green); outline-offset: -2px; border-radius: 18px; }
      .fd-main { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
      .fd-name { font-family: var(--font-display); font-weight: 600; font-size: 16px; line-height: 1.3; color: var(--fg-1); }
      .fd-stat { font-family: var(--font-numeric); font-weight: 600; font-size: 14px; line-height: 1.35; color: var(--fg-2); }
      .fd-tags { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin-top: 6px; }
      .fd-flag { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase; color: var(--fg-3); }
      .fd-chev { color: var(--fg-3); margin-top: 6px; transition: transform .2s; }
      .fd-chev .ico svg { width: 18px; height: 18px; }
      .fd[open] .fd-chev { transform: rotate(180deg); color: var(--kygo-green-dark); }
      .fd-body { padding: 0 16px 16px 62px; }
      @media (max-width: 480px) { .fd-body { padding-left: 16px; } }
      .fd-plain { margin: 0 0 12px; font-size: 14.5px; line-height: 1.65; color: var(--fg-1); }
      .fd-meta { margin: 0 0 12px; display: flex; flex-direction: column; gap: 6px; }
      .fd-meta div { display: grid; grid-template-columns: 74px 1fr; gap: 8px; font-size: 13px; line-height: 1.5; }
      .fd-meta dt { font-family: var(--font-display); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; color: var(--fg-3); padding-top: 2px; }
      .fd-meta dd { margin: 0; color: var(--fg-2); }
      .fd-src { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border-subtle); }
      .fd-src a { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 600; color: var(--kygo-green-dark); background: rgba(34,197,94,0.07); padding: 5px 10px; border-radius: 999px; }
      .fd-src a:hover { background: var(--kygo-green-light); }
      .fd-src .ico svg { width: 12px; height: 12px; }
      .section-readmore { display: inline-flex; align-items: center; gap: 6px; margin-top: 20px; font-family: var(--font-body); font-weight: 600; font-size: 14px; color: var(--kygo-green-dark); }
      .section-readmore .ico svg { width: 15px; height: 15px; transition: transform .15s; }
      .section-readmore:hover .ico svg { transform: translateX(2px); }

      /* Tracker notes */
      .notes { display: grid; grid-template-columns: 1fr; gap: 14px; }
      @media (min-width: 880px) { .notes { grid-template-columns: repeat(3, 1fr); } }
      .note-card { display: flex; flex-direction: column; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 22px; box-shadow: var(--shadow-md); }
      .note-head { display: flex; align-items: center; gap: 11px; margin-bottom: 10px; }
      .note-ico { flex: none; width: 34px; height: 34px; border-radius: 10px; background: var(--kygo-green-light); color: var(--kygo-green-dark); display: flex; align-items: center; justify-content: center; }
      .note-ico .ico svg { width: 17px; height: 17px; }
      .note-head h3 { font-family: var(--font-display); font-weight: 600; font-size: 17px; line-height: 1.25; margin: 0; color: var(--fg-1); }
      .note-card p { margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: var(--fg-2); }
      .note-src { margin-top: auto; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.3px; color: var(--fg-3); padding-top: 10px; border-top: 1px solid var(--border-subtle); }
    `;
  }
}

if (!customElements.get('kygo-food-and-sleep')) {
  customElements.define('kygo-food-and-sleep', KygoFoodAndSleep);
}
