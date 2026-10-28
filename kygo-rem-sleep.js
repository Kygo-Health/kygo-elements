/**
 * Kygo Health — What Influences REM Sleep? Factor Explorer
 * Tag: kygo-rem-sleep
 * Interactive tool exploring 37 research-backed factors that affect REM (dream) sleep across 5 categories
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

/** Loads the shared <kygo-app-card> element (the in-page app card) once. */
function __ensureKygoAppCard() {
  if (customElements.get('kygo-app-card')) return;
  if (document.querySelector('script[data-kygo-app-card-loader]')) return;
  const s = document.createElement('script');
  s.src = 'https://kygo-health.github.io/kygo-elements/kygo-app-card.js';
  s.setAttribute('data-kygo-app-card-loader', '');
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

class KygoRemSleep extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._expandedFactor = null;
    this._expandedTopPick = null;
    this._activeCategory = 'environment';
    this._sortMode = 'evidence';
    this._eventsBound = false;
  }

  connectedCallback() {
    __ensureKygoCta();
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, 'What Influences REM Sleep? A research-based factor explorer by Kygo Health covering 37 factors that change REM (rapid eye movement / dream) sleep, or were tested and do not, across 5 categories: Substances and Nutrition, Supplements, Exercise, Environment and Habits, and Demographics and Body. Each factor was re-checked against its primary source in October 2026. A Do More / Cut Back board lists the changeable factors with strong or moderate evidence, each with the tested dose and measured result: do more of sleeping longer, keeping the bedroom cool, sleeping on your body clock and not cutting carbs to zero; cut back on alcohol, hard late workouts, nicotine, all-night noise, hours of bright screens, stress before bed, sleeping at altitude and the first night somewhere new. REM is the dreaming stage tied to emotional processing and memory, concentrated in the last hours of the night. Substances: alcohol is the clearest REM suppressor, delaying REM 18 minutes and cutting it 11.3 minutes, with delay starting around 2 drinks (Gardiner 2024 meta-analysis of 27 studies). Nicotine cuts REM dose-dependently. Ramadan-style daytime fasting is linked to less REM (25.6 to 18.6 percent). Heavy THC can suppress REM and quitting cannabis causes REM rebound; typical doses are unclear. High-carb diets nudge REM up. Caffeine does not change REM, it cuts deep sleep 11.4 minutes. A late dinner did not change REM. Supplements: melatonin 3 mg raised REM only in patients with abnormally low REM; ketone ester protected REM after very hard late training in cyclists; glycine, valerian and CBD 300 mg did not change REM. Exercise: hard evening exercise ending 0.5 to 4 hours before bed cut REM about 2 points and delayed it 7.7 minutes, moderate and morning exercise did not; cold water immersion after exercise did not change REM. Environment and habits: short sleep with an early alarm cuts REM first; a 32 C hot bedroom lowers REM and cooling restores it; the first night in an unfamiliar room costs REM; continuous 50 dB background noise cut REM 18.6 minutes; 4 hours of bright iPad reading cut REM but 90 minutes of phone use did not; presleep stress fragments REM; altitude cuts REM; sleeping sitting upright cut REM 79 percent; a hot bath right before bed delays REM; sleeping next to a partner was linked to slightly more REM; presleep learning tracks REM; REM deprivation causes a rebound to 140 percent; circadian timing sets when REM happens; daytime naps, mattress type and phone radio signals did not change REM. Demographics and body: REM changes little with age, sex and genetics; REM dips slightly in the luteal phase of the menstrual cycle and in late pregnancy; obesity costs a few minutes of REM once sleep apnea is excluded; acute illness can trim REM in lab models. How to increase REM sleep naturally. What affects REM sleep. What reduces dream sleep. Does caffeine affect REM sleep. Best supplements for REM sleep. Why alcohol kills dream sleep. Data sourced from peer-reviewed studies and meta-analyses.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Categories ────────────────────────────────────────────────────────

  get _categories() {
    return {
      environment: { name: 'Environment & Habits', icon: 'moon', count: 16, intro: 'Most of the levers you control live here. REM is back-loaded into the last hours of the night and is sensitive to heat, noise and timing, so protecting the end of your night matters most.' },
      nutrition: { name: 'Substances & Nutrition', icon: 'droplet', count: 7, intro: 'Alcohol is the clearest REM suppressor on this page, and nicotine is close behind. Caffeine, the usual suspect, does not cut REM at all: its cost lands on deep sleep.' },
      supplements: { name: 'Supplements', icon: 'pill', count: 5, intro: 'The supplement literature for REM is thin. Only melatonin (in people whose REM is abnormally low) and ketone esters (after very hard training) moved REM in sleep-lab studies. Treat any "boosts REM" claim as unproven unless it cites REM on a sleep study (PSG).' },
      exercise: { name: 'Exercise', icon: 'dumbbell', count: 2 },
      demographics: { name: 'Demographics & Body', icon: 'users', count: 7, intro: 'REM is surprisingly stable across age, sex and genes. The clear sex and age differences are in deep sleep, not REM.' }
    };
  }

  // ── Factors ───────────────────────────────────────────────────────────
  // Re-verified against each primary source on 15 Oct 2026. "No change"
  // (neutral) rows are well-measured nulls, kept on purpose.

  get _factors() {
    return {
      nutrition: [
        {
          key: 'alcohol',
          name: 'Alcohol',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative (dose-dependent)',
          keyFinding: 'REM 18 min later, 11.3 min shorter (27-study meta)',
          whatThisMeans: 'Even a couple of drinks delay REM, and each extra drink cuts more. This is why a nightcap leaves you under-recovered, and why using a drink to fall asleep backfires.',
          mechanism: 'Alcohol\'s sedative (GABAergic) effect suppresses the cholinergic activity that generates REM early in the night. As it wears off, the rebound arousal and fragmentation hit the second half of the night, where REM concentrates.',
          dosage: 'REM started 18.0 min later and ran 11.3 min shorter (REM share −2.8 points). Each 1 g/kg added 30.1 min to REM onset and cut 40.4 min of REM. REM delay began around 0.35 g/kg (about 2 drinks), REM loss around 0.5 g/kg (about 3). Meta-analysis of 27 studies in healthy adults.',
          source: { url: 'https://doi.org/10.1016/j.smrv.2024.102030', label: 'Gardiner et al., Sleep Med Rev 2024' }
        },
        {
          key: 'nicotine',
          name: 'Nicotine',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative (dose-dependent)',
          keyFinding: '7 or 14 mg patch cut REM, dose-dependently',
          whatThisMeans: 'Nicotine cuts REM, and more nicotine cuts more. That held for a patch in non-smokers and for a 24-hour patch in smokers.',
          mechanism: 'Nicotine activates acetylcholine receptors that promote arousal and fragment sleep. A patch keeps nicotine in the blood all night, so the effect covers the REM-heavy early morning.',
          dosage: 'A 7 or 14 mg patch cut REM time and REM% dose-dependently in non-smokers (n=12); a 24 h patch lowered REM% in smokers (n=15).',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/7962682/', label: 'Gillin et al., 1994' }
        },
        {
          key: 'ramadan-fasting',
          name: 'Ramadan-Style Daytime Fasting',
          direction: 'negative',
          evidence: 'emerging',
          effect: 'Negative',
          keyFinding: 'REM 25.6% → 18.6% during Ramadan (n=8)',
          whatThisMeans: 'Daytime fasting with a pre-dawn meal is linked to less REM, but the 3:30 am wake-up to eat may be the real cause. Both studies were small.',
          mechanism: 'The pattern moves meals into the night and adds a pre-dawn wake-up, which breaks into the REM-rich early morning and shifts circadian cues. The studies cannot separate fasting itself from the schedule change.',
          dosage: 'REM share 25.6% at baseline vs 18.6% during Ramadan, with sleep times and calories fixed (p<0.05); a separate lab also found less REM. BaHammam 2013 (n=8); Roky 2001 (n=8).',
          source: { url: 'https://doi.org/10.1186/1744-9081-9-32', label: 'BaHammam et al., Behav Brain Funct 2013' }
        },
        {
          key: 'cannabis',
          name: 'Cannabis / THC',
          direction: 'mixed',
          evidence: 'moderate',
          effect: 'Mixed; rebound on quitting',
          keyFinding: 'High-dose THC suppresses REM; quitting rebounds it',
          whatThisMeans: 'Heavy THC can suppress dream sleep, and quitting brings vivid dreams back. At typical doses, the effect on REM is unclear.',
          mechanism: 'THC acts on CB1 receptors and reduced REM eye movements and, less so, REM time in early high-dose studies. Stopping after regular use unmasks a consistent REM rebound.',
          dosage: 'High-dose THC reduced REM eye movements and, less so, REM time in small early studies; newer lower-dose studies show mixed or no change; REM rebound on withdrawal is consistent. Velzeboer 2025 (meta, 18 PSG studies); Feinberg 1975 (n=7).',
          source: { url: 'https://doi.org/10.1016/j.smrv.2025.102164', label: 'Velzeboer et al., Sleep Med Rev 2025' }
        },
        {
          key: 'diet-carbs',
          name: 'Diet (Carbs)',
          direction: 'positive',
          evidence: 'moderate',
          effect: 'Positive (small)',
          keyFinding: 'High-carb raised REM vs low-carb (11 trials)',
          whatThisMeans: 'More carbs nudges REM up a little. Low carb shifts sleep toward deep sleep instead.',
          mechanism: 'Carbohydrate raises insulin, which helps tryptophan reach the brain for serotonin and melatonin synthesis, one proposed route to more REM. Low-carb diets shift the balance toward slow-wave sleep.',
          dosage: 'High-carb meals or diets raised REM time and share vs low-carb; low-carb raised deep sleep; REM latency unchanged. Meta-analysis of 11 short-term trials (n=179).',
          source: { url: 'https://doi.org/10.3390/nu13041283', label: 'Vlahoyiannis et al., Nutrients 2021' }
        },
        {
          key: 'caffeine',
          name: 'Caffeine',
          direction: 'neutral',
          evidence: 'strong',
          effect: 'No change in REM',
          keyFinding: 'No change in REM% (k=19); deep sleep −11.4 min',
          whatThisMeans: 'Caffeine doesn\'t cut REM. It cuts deep sleep.',
          mechanism: 'Caffeine blocks adenosine receptors. Adenosine mainly drives deep-sleep pressure, so caffeine\'s clearest cost lands on slow-wave sleep, not REM.',
          dosage: 'No significant change in REM% (k=19), REM minutes (k=17) or REM latency (k=14); deep sleep fell 11.4 min. Meta-analysis.',
          source: { url: 'https://doi.org/10.1016/j.smrv.2023.101764', label: 'Gardiner et al., Sleep Med Rev 2023' }
        },
        {
          key: 'late-dinner',
          name: 'Late Dinner',
          direction: 'neutral',
          evidence: 'moderate',
          effect: 'No change in REM',
          keyFinding: 'REM 20.8% vs 20.6% (P=.87), crossover',
          whatThisMeans: 'Eating dinner an hour before bed didn\'t reduce REM.',
          mechanism: 'A late dinner raised overnight glucose and cortisol and lowered fat burning in this study, but sleep architecture, including REM, held steady.',
          dosage: 'REM 20.8% vs 20.6% (P=.87) with dinner at 22:00 vs 18:00 (the 18:00 arm had a 22:00 snack). Crossover, n=20.',
          source: { url: 'https://doi.org/10.1210/clinem/dgaa354', label: 'Gu et al., J Clin Endocrinol Metab 2020' }
        }
      ],

      supplements: [
        {
          key: 'melatonin',
          name: 'Melatonin',
          direction: 'positive',
          evidence: 'moderate',
          effect: 'Positive (low-REM patients only)',
          keyFinding: 'REM% ~14.7% → 17.8% in low-REM patients',
          whatThisMeans: 'Helps REM only if yours is abnormally low. Otherwise it\'s a timing aid.',
          mechanism: 'Melatonin acts on the circadian clock, and REM follows the clock. In animals the MT1 receptor selectively enhances REM; in humans the REM gain showed up only in patients who started with reduced REM.',
          dosage: '3 mg for 4 weeks raised REM% from about 14.7% to 17.8% (placebo fell to 12.0%) in sleep-disorder patients with low REM; in healthy men REM% did not change. Kunz 2004 (2 RCTs, n=14 total); Rajaratnam 2004 (n=8).',
          source: { url: 'https://doi.org/10.1210/jc.2002-021057', label: 'Kunz et al., JCEM 2004' },
          affiliate: { url: 'https://www.amazon.com/dp/B08666GMWG?tag=kygohealthapp-20&th=1', label: 'Melatonin Supplement' , slug: 'melatonin-gummies' }
        },
        {
          key: 'ketone-ester',
          name: 'Ketone Ester After Hard Exercise',
          direction: 'protects',
          evidence: 'emerging',
          effect: 'Protects REM (athletes)',
          keyFinding: 'Kept REM at 117 vs 93 min after hard training',
          whatThisMeans: 'In trained cyclists, ketone drinks offset the REM loss from a very hard late training day. Untested in everyday life.',
          mechanism: 'Hard training ending an hour before bed cut REM by 26% and nearly doubled time awake overnight. The ketone drink raised dopamine excretion, which the authors offer as a preliminary explanation; the pathway is not confirmed.',
          dosage: 'A hard training day ending 1 h before bed cut REM from 125 to 93 min; 25 g ketone ester after each session and 30 min before bed (75 g total) kept REM at 117 min (p=0.011 vs placebo). Robberechts 2023 (n=10, crossover); Poffé 2026 (n=24, 7 weeks).',
          source: { url: 'https://doi.org/10.1249/MSS.0000000000003231', label: 'Robberechts et al., Med Sci Sports Exerc 2023' }
        },
        {
          key: 'glycine',
          name: 'Glycine (3 g)',
          direction: 'neutral',
          evidence: 'emerging',
          effect: 'No change in REM',
          keyFinding: 'Faster sleep onset; REM unchanged (n=11)',
          whatThisMeans: 'Glycine may help you fall asleep faster but doesn\'t change REM.',
          mechanism: 'Glycine lowers core body temperature and speeds entry into deep sleep, without changing REM latency or stage proportions.',
          dosage: 'Shortened time to fall asleep and to reach deep sleep; REM latency and stage proportions unchanged. n=11 poor sleepers, crossover; authors from Ajinomoto, a glycine maker.',
          source: { url: 'https://doi.org/10.1111/j.1479-8425.2007.00262.x', label: 'Yamadera et al., Sleep Biol Rhythms 2007' }
        },
        {
          key: 'valerian',
          name: 'Valerian',
          direction: 'neutral',
          evidence: 'moderate',
          effect: 'No change in REM',
          keyFinding: 'REM unchanged after 28 days (n=184)',
          whatThisMeans: 'Valerian doesn\'t shift REM either way.',
          mechanism: 'Valerian is thought to act on GABA and adenosine signalling. In sleep-lab studies that has not shown up as any change in REM.',
          dosage: 'REM unchanged after 28 days of valerian-hops in mild insomnia, and in two small PSG studies. Morin 2005 (n=184, industry funded); Schulz 1994; Balderer 1985.',
          source: { url: 'https://doi.org/10.1093/sleep/28.11.1465', label: 'Morin et al., Sleep 2005' }
        },
        {
          key: 'cbd',
          name: 'CBD (300 mg)',
          direction: 'neutral',
          evidence: 'emerging',
          effect: 'No change in REM',
          keyFinding: 'REM 17.6% placebo vs 16.6% CBD',
          whatThisMeans: 'One dose of CBD didn\'t change REM.',
          mechanism: 'Unlike THC, CBD does not strongly activate CB1 receptors. A single 300 mg dose in healthy sleepers left sleep architecture, including REM, intact.',
          dosage: 'REM 17.6% placebo vs 16.6% CBD; REM latency also unchanged. n=26, crossover; authors hold CBD patents.',
          source: { url: 'https://doi.org/10.3389/fphar.2018.00315', label: 'Linares et al., Front Pharmacol 2018' }
        }
      ],

      exercise: [
        {
          key: 'evening-intense-exercise',
          name: 'Evening Intense Exercise',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Small negative (that night only)',
          keyFinding: 'Hard late session: REM −1.95 points (28 trials)',
          whatThisMeans: 'Hard late workouts trim REM a little and push it later. Morning or moderate sessions don\'t.',
          mechanism: 'A hard session close to bed likely keeps core temperature, heart rate and sympathetic drive raised into the first part of the night, which delays and trims REM. The studies measured single nights after one session.',
          dosage: 'One hard session (77%+ HRmax, ending 0.5 to 4 h before bed) cut REM by 1.95 points of total sleep vs no exercise; 2.5 points when it ran over 30 to 60 min. Moderate and light sessions: no significant change. Evening exercise also delayed REM onset by 7.7 min. Morning exercise showed no REM change in timing studies. Yue 2022 (network meta, 28 trials, n=325); Frimpong 2021 (−2.34 points); Stutz 2019 (23 studies).',
          source: { url: 'https://doi.org/10.2147/NSS.S388863', label: 'Yue et al., Nat Sci Sleep 2022' }
        },
        {
          key: 'cold-water-immersion',
          name: 'Cold Water Immersion After Exercise',
          direction: 'neutral',
          evidence: 'emerging',
          effect: 'No change in REM',
          keyFinding: 'No change in REM vs exercise alone (n=11)',
          whatThisMeans: 'An ice bath after an evening workout didn\'t change REM.',
          mechanism: 'Cold water lowers core temperature after exercise, but REM timing and amount did not respond in this study.',
          dosage: 'No difference in stage proportions or REM onset vs exercise alone. n=11.',
          source: { url: 'https://doi.org/10.1249/MSS.0b013e318287f321', label: 'Robey et al., Med Sci Sports Exerc 2013' }
        }
      ],

      environment: [
        {
          key: 'short-sleep',
          name: 'Short Sleep / Early Alarm',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative (REM hit first)',
          keyFinding: '4 h vs 9 h: REM minutes cut first (n=27)',
          whatThisMeans: 'REM is back-loaded, so a short night with a fixed alarm cuts it first.',
          mechanism: 'REM is concentrated in the early morning, so cutting sleep short trims REM more than any other stage, while deep sleep\'s share actually rises.',
          dosage: '4 h vs 9 h for 5 nights cut REM and stage 2 minutes, while deep sleep\'s share rose. n=27, crossover, PSG.',
          source: { url: 'https://doi.org/10.1152/ajpregu.00222.2012', label: 'Shechter et al., Am J Physiol 2012' }
        },
        {
          key: 'bedroom-heat',
          name: 'Bedroom Heat',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative',
          keyFinding: '32°C room lowered REM vs 22°C; cooling restored it',
          whatThisMeans: 'A hot, especially humid, bedroom costs you REM. Staying cool protects it, but going colder won\'t add more.',
          mechanism: 'During REM the body largely suspends temperature control (little effective sweating or shivering), so the sleeper is exposed to the room. Animal studies suggest the brain shortens REM in heat to protect body temperature.',
          dosage: 'A 32°C bedroom cut total sleep by 24.8 min and lowered REM vs 22°C; a cooling mattress topper restored 21.4 min of sleep and the lost REM. At normal room temperature, cooling added deep sleep, not REM. Pasquier 2025 (n=15, crossover, PSG); Kräuchi 2024 (n=72).',
          source: { url: 'https://doi.org/10.1111/jsr.70137', label: 'Pasquier et al., J Sleep Res 2025' }
        },
        {
          key: 'first-night',
          name: 'Unfamiliar Room (First Night)',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative (first night only)',
          keyFinding: 'Less, later REM on night 1 (53-study meta)',
          whatThisMeans: 'Your first night in a hotel or new bedroom costs some REM. It recovers by night two.',
          mechanism: 'In a new place the brain likely stays partly on guard, so sleep is lighter and more broken, and REM starts later and runs shorter until the setting feels familiar.',
          dosage: 'Across 53 studies, the first night in a new sleep setting had less REM and a later REM onset than the second night (p ≤ 0.001); smallest at ages 20 to 29. Meta-analysis, n=1,422.',
          source: { url: 'https://doi.org/10.1016/j.sleep.2021.12.007', label: 'Ding et al., Sleep Med 2021' }
        },
        {
          key: 'background-noise',
          name: 'Continuous Background Noise',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative',
          keyFinding: '50 dB pink noise cut REM 18.6 min (n=25)',
          whatThisMeans: 'A constant noise machine or hum can trim REM. Earplugs mostly protect deep sleep, not REM.',
          mechanism: 'Why steady broadband sound cuts REM is not established. The effect is specific: steady pink noise reduced REM, while on-and-off noise peaks mainly cut deep sleep, which earplugs protected.',
          dosage: '50 dB pink noise all night cut REM by 18.6 min (118.1 to 99.5 min); 32 dB wind turbine noise cut REM 11.1 min and delayed it 16.8 min. On-and-off traffic noise mainly cut deep sleep instead. Basner 2026 (n=25, randomized crossover); Smith 2020 (n=48); same research group.',
          source: { url: 'https://doi.org/10.1093/sleep/zsag001', label: 'Basner et al., Sleep 2026' }
        },
        {
          key: 'evening-screens',
          name: 'Evening Screens',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative at 4 h; none at 90 min',
          keyFinding: '4 h iPad: REM 109 vs 121 min; 90 min phone: no change',
          whatThisMeans: 'Hours of bright screen time before bed can trim REM. A normal evening on your phone did not.',
          mechanism: 'Hours of bright, blue-rich light in the evening suppress and delay melatonin, pushing the body clock later. REM follows the clock, so a fixed alarm cuts into it.',
          dosage: '4 h of iPad reading at full brightness for 5 evenings: REM 109 vs 121 min with a printed book (p=0.03). 90 min of phone reading ending 50 min before bed: REM unchanged (about 19 to 20%). Chang 2015 (n=12, crossover); Höhn 2024 (n=62).',
          source: { url: 'https://doi.org/10.1073/pnas.1418490112', label: 'Chang et al., PNAS 2015' }
        },
        {
          key: 'presleep-stress',
          name: 'Presleep Stress',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative',
          keyFinding: 'Lab stressor lowered REM% and raised REM density',
          whatThisMeans: 'Stress before bed chops REM up. People whose sleep reacts to stress lose the most.',
          mechanism: 'Stress raises cortisol and arousal into the night. In people with high sleep reactivity, that fragments REM, lowers REM time and loads it with more eye movements.',
          dosage: 'A lab stressor before bed lowered REM% and raised REM density; REM minutes fell only in people with stress-reactive sleep. n=62, PSG.',
          source: { url: 'https://doi.org/10.2147/NSS.S415464', label: 'Feng et al., Nat Sci Sleep 2023' }
        },
        {
          key: 'altitude',
          name: 'Altitude',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative',
          keyFinding: 'Higher altitude, less REM (4,559 m vs 490 m)',
          whatThisMeans: 'Sleeping high cuts REM, and higher cuts more.',
          mechanism: 'Low oxygen triggers periodic breathing and frequent arousals, which break up REM and deep sleep. The thinner the air, the bigger the effect.',
          dosage: 'At 4,559 m, REM and deep sleep share fell across nights 1 to 4 vs 490 m; simulated 2,000 and 4,000 m cut REM share step by step. Nussbaumer-Ochsner 2011 (n=14); Li 2021 (n=25).',
          source: { url: 'https://doi.org/10.1089/ham.2010.1073', label: 'Nussbaumer-Ochsner et al., High Alt Med Biol 2011' }
        },
        {
          key: 'sitting-up',
          name: 'Sleeping Sitting Up',
          direction: 'negative',
          evidence: 'emerging',
          effect: 'Negative',
          keyFinding: 'Upright seat: 79% less REM than flat (n=6)',
          whatThisMeans: 'Sleeping upright on a plane or in a car cuts REM most. Recline as far as you can.',
          mechanism: 'The authors give two likely reasons: the head is hard to keep comfortable upright, worse in REM when muscle tone is very low, and an upright posture raises sympathetic (fight-or-flight) activity, keeping the body more aroused.',
          dosage: 'In a 4 h daytime nap, an upright seat gave 79% less REM than a flat seat; a 40° recline gave 37% less. n=6, within-subject.',
          source: { url: 'https://doi.org/10.1080/07420528.2018.1466801', label: 'Roach et al., Chronobiol Int 2018' }
        },
        {
          key: 'hot-bath',
          name: 'Hot Bath Right Before Bed',
          direction: 'negative',
          evidence: 'emerging',
          effect: 'Negative (first REM period)',
          keyFinding: 'Bath at 21:00 cut REM; at 17:00 it didn\'t',
          whatThisMeans: 'Heating your body hard right before bed pushes REM back. An earlier bath didn\'t.',
          mechanism: 'Heating the body close to bedtime raised deep sleep and lowered REM. Aspirin, which blunts the temperature response, mostly cancelled the effect, pointing to the late rise in body heat as the driver.',
          dosage: 'A bath at 21:00 raising core temperature about 2°C cut REM; the same bath at 17:00 changed nothing. 1 h at 41°C ending just before sleep shortened the first REM period. Horne & Shackell 1987 (n=6); Bunnell 1988.',
          source: { url: 'https://doi.org/10.1093/sleep/10.4.383', label: 'Horne & Shackell, Sleep 1987' }
        },
        {
          key: 'partner',
          name: 'Sleeping Next to a Partner',
          direction: 'positive',
          evidence: 'emerging',
          effect: 'Positive (small)',
          keyFinding: 'REM 23.0% with partner vs 21.0% alone (n=24)',
          whatThisMeans: 'Sharing a room with your partner was linked to slightly more, less broken REM.',
          mechanism: 'Not established. Couples\' sleep stages synchronised when they shared a bed, and people with less social support gained the most REM. The authors propose a feedback loop between REM sleep and social bonds.',
          dosage: 'REM share 23.0% beside a partner vs 21.0% alone, with fewer REM interruptions (8.5 to 5.4); no other stage changed. n=24 (12 couples), within-subject.',
          source: { url: 'https://doi.org/10.3389/fpsyt.2020.00583', label: 'Drews et al., Front Psychiatry 2020' }
        },
        {
          key: 'presleep-learning',
          name: 'Presleep Learning',
          direction: 'positive',
          evidence: 'emerging',
          effect: 'Positive (small study)',
          keyFinding: 'Fastest learners had the biggest REM% rise (n=10)',
          whatThisMeans: 'REM tracks how much you learn. Small study.',
          mechanism: 'REM supports consolidation of procedural and emotional memory. In an immersion course, the rise in REM% tracked how fast students learned the language.',
          dosage: 'Students who learned French fastest in a 6-week immersion course showed the biggest rises in REM%. n=10.',
          source: { url: 'https://doi.org/10.1016/0167-8760(89)90018-4', label: 'De Koninck et al., Int J Psychophysiol 1989' }
        },
        {
          key: 'rem-rebound',
          name: 'REM Deprivation',
          direction: 'positive',
          evidence: 'strong',
          effect: 'Rebound',
          keyFinding: 'REM rose to 140% of baseline on recovery night',
          whatThisMeans: 'Lose REM and your brain pays it back the next night.',
          mechanism: 'REM is homeostatically regulated: a REM debt builds pressure that is repaid with extra REM on recovery nights, scaled to the size of the debt.',
          dosage: '3 nights of selective REM deprivation cut REM to 9.2% of baseline; it rose to 140.1% on the first recovery night. n=8 men.',
          source: { url: 'https://doi.org/10.1152/ajpregu.1998.274.4.R1186', label: 'Endo et al., Am J Physiol 1998' }
        },
        {
          key: 'circadian-timing',
          name: 'Circadian Timing',
          direction: 'variable',
          evidence: 'strong',
          effect: 'Sets when REM happens',
          keyFinding: 'REM peaks just after the body-temperature low',
          whatThisMeans: 'Most REM lands in the last hours of the night. Jet lag and shift work misalign it.',
          mechanism: 'REM is gated by the circadian clock. Its propensity peaks just after the core body temperature minimum, on the rising part of the curve, which normally falls in the early morning.',
          dosage: 'REM propensity peaks just after the body temperature low point, on the rising part of the curve. n=10, 306 subject-days.',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/7403736/', label: 'Czeisler et al., Science 1980' }
        },
        {
          key: 'napping',
          name: 'Daytime Napping',
          direction: 'neutral',
          evidence: 'moderate',
          effect: 'No change in amount',
          keyFinding: 'Naps didn\'t reduce the next night\'s REM (n=38)',
          whatThisMeans: 'Naps don\'t eat into your nighttime REM. A late nap may shift when it starts.',
          mechanism: 'Naps spend some sleep pressure, which mostly drives deep sleep. REM follows the circadian clock more than sleep pressure, so nighttime REM amount holds.',
          dosage: 'Naps from 09:00 to 18:00 did not reduce the next night\'s REM in young or older adults; an early-evening nap made REM start sooner. Campbell 2005 (n=38); Werth 1996.',
          source: { url: 'https://doi.org/10.1016/j.neurobiolaging.2004.02.021', label: 'Campbell et al., Neurobiol Aging 2005' }
        },
        {
          key: 'mattress',
          name: 'Mattress Type',
          direction: 'neutral',
          evidence: 'emerging',
          effect: 'No change in REM',
          keyFinding: 'REM unchanged across 4 mattresses (P>0.05)',
          whatThisMeans: 'Mattress choice didn\'t move REM.',
          mechanism: 'How evenly the mattress spread body pressure changed deep sleep and micro-arousals in this study, but not REM. The authors say the underlying mechanism is unknown.',
          dosage: 'REM unchanged across 4 mattresses (all P>0.05); deep sleep did change. n=16; run by the mattress maker.',
          source: { url: 'https://doi.org/10.1371/journal.pone.0099969', label: 'Chen et al., PLoS One 2014' }
        },
        {
          key: 'phone-signals',
          name: 'Phone Radio Signals',
          direction: 'neutral',
          evidence: 'moderate',
          effect: 'No change in REM',
          keyFinding: 'Sleep architecture unchanged (double-blind)',
          whatThisMeans: 'Phone signals haven\'t been shown to change REM.',
          mechanism: 'Phone-type radio exposure has nudged some EEG power bands in lab studies, but not the amount or timing of sleep stages.',
          dosage: 'GSM-type exposure before or during sleep left sleep architecture unchanged (double-blind). Regel 2007 (n=15); Fritzer 2007 (n=10).',
          source: { url: 'https://doi.org/10.1111/j.1365-2869.2007.00603.x', label: 'Regel et al., J Sleep Res 2007' }
        }
      ],

      demographics: [
        {
          key: 'age',
          name: 'Age',
          direction: 'neutral',
          evidence: 'strong',
          effect: 'Small or no decline',
          keyFinding: '~0.6 pts/decade, or none with modern scoring',
          whatThisMeans: 'REM changes little with age. Total sleep and sleep efficiency carry most of the age decline.',
          mechanism: 'Ageing mostly erodes deep sleep and sleep efficiency. REM, driven by brainstem circuits and the circadian clock, is comparatively well preserved.',
          dosage: 'REM% fell about 0.6 points per decade through most of adulthood, levelling off in the mid-70s; a 2019 meta with modern scoring found no significant change (0.0 points per decade). Floyd 2007 (382 studies, n=4,171); Boulos 2019 (169 studies, n=5,273).',
          source: { url: 'https://doi.org/10.1093/sleep/30.7.829', label: 'Floyd et al., Sleep 2007' }
        },
        {
          key: 'sex-hormones',
          name: 'Sex / Hormones',
          direction: 'neutral',
          evidence: 'strong',
          effect: 'Little difference',
          keyFinding: 'REM% didn\'t vary with sex across 169 PSG studies',
          whatThisMeans: 'REM is about the same in men and women. Deep sleep is where the sexes differ.',
          mechanism: 'Sex differences show up in deep sleep, which is higher in women. Hormonal shifts within a person (menstrual phase, pregnancy) move REM more than sex itself.',
          dosage: 'REM% did not vary with the share of men across 169 PSG studies; the clear sex gap is deep sleep, which is higher in women. Boulos 2019 (n=5,273); Redline 2004 (SHHS, n=2,685).',
          source: { url: 'https://doi.org/10.1016/S2213-2600(19)30057-8', label: 'Boulos et al., Lancet Respir Med 2019' }
        },
        {
          key: 'menstrual-cycle',
          name: 'Menstrual Cycle (Luteal)',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Slightly lower in luteal',
          keyFinding: 'Minor REM dip in the mid-luteal phase',
          whatThisMeans: 'REM dips a little in the two weeks before a period, likely because body temperature runs higher.',
          mechanism: 'Progesterone raises core body temperature in the luteal phase, and REM is temperature-sensitive. The dip appears at specific circadian phases.',
          dosage: 'REM was reduced in the mid-luteal phase at specific circadian phases; reviews call it a minor luteal decrease, linked to higher body temperature. Shechter 2010 (n=8); Baker 1999.',
          source: { url: 'https://doi.org/10.1093/sleep/33.5.647', label: 'Shechter et al., Sleep 2010' }
        },
        {
          key: 'late-pregnancy',
          name: 'Late Pregnancy',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative',
          keyFinding: 'Fewer REM minutes in third trimester (lab PSG)',
          whatThisMeans: 'REM tends to be lower late in pregnancy, along with lighter sleep.',
          mechanism: 'Late pregnancy brings physical discomfort, more awakenings, breathing changes and high progesterone, which together lighten sleep and trim REM.',
          dosage: '27 women in the third trimester had fewer REM minutes than 24 non-pregnant women on lab PSG; small longitudinal studies are mixed.',
          source: { url: 'https://doi.org/10.1111/j.1479-828X.2010.01252.x', label: 'Wilson et al., Aust N Z J Obstet Gynaecol 2011' }
        },
        {
          key: 'obesity',
          name: 'Obesity (BMI 30+)',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Slightly negative',
          keyFinding: '7.8 min less REM with apnea excluded (n=1,014)',
          whatThisMeans: 'Extra weight is linked to at most a few minutes less REM once sleep apnea is ruled out.',
          mechanism: 'Much of the link between weight and poor sleep runs through sleep apnea, which fragments REM. With moderate or severe apnea excluded, the remaining REM gap is small.',
          dosage: 'With moderate or severe sleep apnea excluded, BMI 30+ had 7.8 min less REM (p=0.003); in 2,745 older men, REM was not linked to body composition. Pessoa 2025 (Baependi, n=1,014); Rao 2009 (MrOS).',
          source: { url: 'https://doi.org/10.1002/oby.24359', label: 'Pessoa et al., Obesity 2025' }
        },
        {
          key: 'acute-illness',
          name: 'Acute Illness',
          direction: 'negative',
          evidence: 'emerging',
          effect: 'Negative (lab model)',
          keyFinding: 'Evening endotoxin cut REM share (n=15)',
          whatThisMeans: 'Fighting an infection can trim REM for a night, but real colds haven\'t shown a clear REM drop.',
          mechanism: 'Endotoxin raised body temperature and released immune signalling molecules (cytokines) and stress hormones; non-REM sleep rose and REM fell in step with them.',
          dosage: 'Endotoxin given in the evening cut REM share in healthy men (P<0.05); the same dose mid-sleep did not; a real cold cut sleep about 23 min with no REM change reported. Pollmächer 1993 (n=15); Haack 2001 (n=10); Drake 2000 (n=21).',
          source: { url: 'https://doi.org/10.1152/ajpregu.1993.264.6.R1077', label: 'Pollmächer et al., Am J Physiol 1993' }
        },
        {
          key: 'genetics',
          name: 'Genetics',
          direction: 'neutral',
          evidence: 'emerging',
          effect: 'Little to none',
          keyFinding: 'REM heritability h2 0.07 (n.s.) vs deep sleep 0.35',
          whatThisMeans: 'How much REM you get looks driven more by circumstances than genes.',
          mechanism: 'In family data, deep sleep was clearly heritable while REM time was not, suggesting REM depends more on circumstances than genes. Some twin studies disagree.',
          dosage: 'REM time showed no significant heritability (h2 0.07, p=0.19) while deep sleep did (0.35); some twin studies disagree. n=684 family members.',
          source: { url: 'https://doi.org/10.1111/jsr.14448', label: 'Leocadio-Miguel et al., J Sleep Res 2025' }
        }
      ]
    };
  }

  // ── Top Picks ─────────────────────────────────────────────────────────

  get _topPicks() {
    return [
      {
        icon: 'moon',
        label: 'Best Lever You Control',
        answer: 'Sleep Longer',
        note: 'REM is back-loaded into the early morning, so a short night with a fixed alarm cuts dream sleep before any other stage. Protect the back half of the night.',
        stat: '4 h vs 9 h: REM cut first',
        category: 'Environment & Habits'
      },
      {
        icon: 'thermometer',
        label: 'Quickest Environmental Win',
        answer: 'Keep the Room Cool',
        note: 'A 32°C bedroom lowered REM vs 22°C, and a cooling topper restored it. Cool protects REM, but going colder won\'t add more.',
        stat: '32°C vs 22°C: less REM',
        category: 'Environment & Habits'
      },
      {
        icon: 'alert',
        label: 'Biggest REM Killer',
        answer: 'Alcohol',
        note: 'Even a couple of drinks delay REM, and each extra drink cuts more. A nightcap leaves you under-recovered.',
        stat: '−11.3 min REM, +18 min delay',
        category: 'Substances & Nutrition',
        warning: true
      },
      {
        icon: 'trophy',
        label: 'Most Defended',
        answer: 'REM Rebound',
        note: 'Lose REM and your brain pays it back the next night, with extra dream sleep on the first recovery night.',
        stat: '140% of baseline on recovery night',
        category: 'Environment & Habits'
      },
      {
        icon: 'pill',
        label: 'Best Supplement',
        answer: 'Melatonin (if your REM is low)',
        note: 'Raised REM% in patients whose REM started abnormally low, but not in healthy men. For most people it\'s a timing aid, not a REM booster.',
        stat: 'REM% 14.7% → 17.8% (low-REM patients)',
        category: 'Supplements'
      },
      {
        icon: 'droplet',
        label: 'Most Overblown Worry',
        answer: 'Caffeine',
        note: 'A meta-analysis found no change in REM%, REM minutes or REM latency. Caffeine\'s real cost is deep sleep, not REM.',
        stat: 'REM unchanged; deep sleep −11.4 min',
        category: 'Substances & Nutrition'
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
      shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      wheat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"/></svg>',
      wine: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg>',
      cigarette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14"/><path d="M18 8c0-2.5-2-2.5-2-5"/><path d="M21 16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M22 8c0-2.5-2-2.5-2-5"/><path d="M7 12v4"/></svg>',
      volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
      phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
      mountain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>',
      home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
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

  _directionConfig(dir) {
    const map = {
      positive: { icon: 'arrowUp', label: 'Raises REM', color: '#16A34A', bg: 'rgba(34,197,94,0.1)' },
      protects: { icon: 'shield', label: 'Protects REM', color: '#16A34A', bg: 'rgba(34,197,94,0.1)' },
      negative: { icon: 'arrowDown', label: 'Lowers REM', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
      mixed: { icon: 'arrowLeftRight', label: 'Mixed', color: '#D97706', bg: 'rgba(251,191,36,0.12)' },
      variable: { icon: 'arrowLeftRight', label: 'Sets timing', color: '#64748B', bg: 'rgba(148,163,184,0.12)' },
      neutral: { icon: 'minus', label: 'No clear effect', color: '#64748B', bg: 'rgba(148,163,184,0.12)' }
    };
    return map[dir] || map.mixed;
  }

  _evidenceConfig(ev) {
    const map = {
      strong: { label: 'Strong' },
      moderate: { label: 'Moderate' },
      emerging: { label: 'Emerging' }
    };
    return map[ev] || map.moderate;
  }

  // ── Render Helpers ────────────────────────────────────────────────────

  // Centered category tabs; one category's cards show at a time.
  _renderCategoryTabs() {
    return Object.entries(this._categories).map(([k, c]) =>
      `<button class="cat-tab ${k === this._activeCategory ? 'active' : ''}" data-category="${k}" role="tab" aria-selected="${k === this._activeCategory}">
        <span class="cat-tab-icon">${this._icon(c.icon)}</span>
        <span>${c.name}</span>
        <span class="cat-tab-count">${(this._factors[k] || []).length}</span>
      </button>`
    ).join('');
  }

  _renderSortBar() {
    const opt = (v, l) => `<option value="${v}"${this._sortMode === v ? ' selected' : ''}>${l}</option>`;
    return `<label class="sort-label" for="sort-select">Sort by:</label>
      <select class="sort-select" id="sort-select">${opt('evidence', 'Evidence Strength')}${opt('direction', 'Effect Direction')}</select>`;
  }

  _renderFactorCards() {
    let factors = this._factors[this._activeCategory];
    if (!factors) return '';
    if (this._sortMode === 'evidence') {
      const rank = { strong: 0, moderate: 1, emerging: 2 };
      factors = [...factors].sort((a, b) => (rank[a.evidence] ?? 9) - (rank[b.evidence] ?? 9));
    } else if (this._sortMode === 'direction') {
      const rank = { positive: 0, protects: 1, mixed: 2, variable: 3, neutral: 4, negative: 5 };
      factors = [...factors].sort((a, b) => (rank[a.direction] ?? 9) - (rank[b.direction] ?? 9));
    }
    const cat = this._categories[this._activeCategory];
    const note = cat.intro ? `<p class="cat-note">${this._icon(cat.icon)}<span>${cat.intro}</span></p>` : '';
    return note + factors.map(f => this._renderFactorCard(f)).join('');
  }

  _renderFactorCard(f) {
    const dir = this._directionConfig(f.direction);
    const ev = this._evidenceConfig(f.evidence);
    const isExp = this._expandedFactor === f.key;
    return `
      <div class="factor-card ${isExp ? 'expanded' : ''}" data-factor="${f.key}" id="factor-${f.key}">
        <div class="factor-header" role="button" aria-expanded="${isExp}" tabindex="0">
          <div class="factor-top">
            <span class="badge-direction" style="color:${dir.color};background:${dir.bg}"><span class="badge-icon">${this._icon(dir.icon)}</span>${dir.label}</span>
            <span class="factor-toggle">${this._icon('chevDown')}</span>
          </div>
          <h3 class="factor-name">${f.name}</h3>
          <p class="factor-effect">${f.keyFinding}</p>
          <p class="factor-evidence-text"><span class="evidence-label">Evidence:</span> ${ev.label}</p>
        </div>
        <div class="factor-body">
          <div class="factor-detail">
            <div class="detail-row"><span class="detail-label">What this means</span><span class="detail-value">${f.whatThisMeans}</span></div>
            <div class="detail-row"><span class="detail-label">Mechanism</span><span class="detail-value">${f.mechanism}</span></div>
            <div class="detail-row"><span class="detail-label">Dose / context</span><span class="detail-value">${f.dosage}</span></div>
            <div class="detail-row"><span class="detail-label">Source</span><a href="${f.source.url}" class="factor-src" target="_blank" rel="noopener nofollow" data-action="source-link">${f.source.label} ${this._icon('externalLink')}</a></div>
            ${f.affiliate ? `<a href="${f.affiliate.url}" class="factor-affiliate" target="_blank" rel="noopener nofollow sponsored" data-action="affiliate" data-track-label="${f.affiliate.slug}">Check it out on Amazon ${this._icon('externalLink')}</a><span class="factor-affiliate-note">Affiliate link — we may earn a commission at no extra cost to you.</span>` : ''}
          </div>
        </div>
      </div>`;
  }

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

  // ── Action Board ──────────────────────────────────────────────────────
  // "Do more / Cut back": factors a reader can change, with strong or
  // moderate evidence, each with its dose and measured result. Rows are
  // condensed from the matching _factors entry; evidence is read from
  // _factors directly so the two can't disagree. Melatonin is left out
  // (it only helped patients with abnormally low REM).

  get _board() {
    return {
      more: [
        { key: 'short-sleep', icon: 'moon', label: 'Sleep longer', dose: 'Protect the last hours of the night', result: 'Short nights cut REM first' },
        { key: 'bedroom-heat', icon: 'thermometer', label: 'Keep the bedroom cool', dose: 'Around 22°C; cool the bed in a heatwave', result: '32°C room lowered REM' },
        { key: 'circadian-timing', icon: 'clock', label: 'Sleep on your body clock', dose: 'Regular hours; limit jet lag and shift swings', result: 'REM peaks just after the body-temperature low' },
        { key: 'diet-carbs', icon: 'wheat', label: 'Don\'t cut carbs to zero', dose: 'Higher-carb meals vs low-carb', result: 'REM time and share up (11 trials)' }
      ],
      less: [
        { key: 'alcohol', icon: 'wine', label: 'Alcohol', dose: 'From about 2 drinks; more, bigger hit', result: 'REM 18 min later, 11.3 min shorter' },
        { key: 'evening-intense-exercise', icon: 'dumbbell', label: 'Hard late workouts', dose: 'Ending 0.5–4 h before bed', result: 'REM −2 points; moderate is fine' },
        { key: 'nicotine', icon: 'cigarette', label: 'Nicotine', dose: 'Patch or smoking; more, bigger hit', result: 'REM down by dose' },
        { key: 'background-noise', icon: 'volume', label: 'All-night noise', dose: 'Steady noise machine or hum', result: 'REM −18.6 min at 50 dB' },
        { key: 'evening-screens', icon: 'phone', label: 'Hours of bright screens', dose: '4 h before bed; 90 min was fine', result: 'REM 109 vs 121 min' },
        { key: 'presleep-stress', icon: 'alert', label: 'Stress before bed', dose: 'Wind down before lights out', result: 'REM% down, more broken' },
        { key: 'altitude', icon: 'mountain', label: 'Sleeping at altitude', dose: 'The higher, the bigger the cut', result: 'REM share falls step by step' },
        { key: 'first-night', icon: 'home', label: 'First night somewhere new', dose: 'Hotels, new bedrooms; gone by night 2', result: 'Less, later REM on night 1' }
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
            <p class="ab-sub">${rows.length} ${up ? 'habits that protect REM' : 'things that cut or delay REM'}</p>
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
    card.classList.add('flash');
    setTimeout(() => card.classList.remove('flash'), 1600);
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    const hdr = card.querySelector('.factor-header');
    if (hdr) hdr.focus({ preventScroll: true });
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

  // Sources grouped by category, deduped by URL across the whole page.
  // Flat source list for the standard sources module: the factor's category
  // becomes the card's tag and its study label becomes the citation line.
  get _sources() {
    const cats = this._categories;
    const seen = new Set();
    const out = [];
    for (const [catKey, factors] of Object.entries(this._factors)) {
      for (const f of factors) {
        if (f.source && !seen.has(f.source.url)) {
          seen.add(f.source.url);
          out.push({ tag: cats[catKey].name, title: f.name, cite: f.source.label, url: f.source.url });
        }
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

  _sourceCount() {
    const seen = new Set();
    for (const factors of Object.values(this._factors)) {
      for (const f of factors) if (f.source) seen.add(f.source.url);
    }
    return seen.size;
  }

  _factorCount() {
    return Object.values(this._factors).reduce((n, arr) => n + arr.length, 0);
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
        title: 'Deep Sleep Factor Explorer',
        blurb: '28 factors that affect deep sleep, ranked by research with doses and mechanisms.',
        url: 'https://www.kygo.app/tools/deep-sleep-factors',
        meta: 'Sleep · 28 factors',
        motif: { motif: 'hypno', stage: 'deep', caption: 'Sleep stages overnight' }
      },
      {
        title: 'Sleep Latency Factors',
        blurb: '57 factors that affect how fast you fall asleep, ranked by evidence.',
        url: 'https://www.kygo.app/tools/sleep-latency-factors',
        meta: 'Sleep · 57 factors',
        motif: { motif: 'decay', caption: 'Time to fall asleep' }
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
      { slug: 'what-influences-rem-sleep-factors-ranked',
        title: 'What Influences REM Sleep? 37 Factors Checked Against the Research',
        blurb: 'REM is the most chemistry-sensitive stage of your night. What moves it, from alcohol to room temperature, ranked by evidence.',
        cat: 'Sleep', min: 10, img: '273a63_be7638af00034117a0366d56b59127ae~mv2.png' },
      { slug: 'how-to-increase-deep-sleep-factors-ranked',
        title: 'How to Increase Deep Sleep: 38 Factors Backed by Data',
        blurb: 'Deep sleep is the most restorative stage and most people get less than they should. 38 factors, 50+ studies, with doses.',
        cat: 'Sleep', min: 11, img: '273a63_5a16c04aa1b9489da2cc42da679e913a~mv2.png' },
      { slug: 'which-foods-affect-your-sleep-and-hrv',
        title: 'Which Foods Affect Your Sleep & HRV? How to Find Out',
        blurb: 'Caffeine, alcohol and late heavy meals are the usual suspects, but the foods that move your numbers are personal. How to find yours.',
        cat: 'App Updates', min: 7, img: '273a63_817afd636ca34cd6bfae13650a742362~mv2.png' }
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
      slug: 'rem-sleep-factors',
      hook: `Find which of your evenings cost you REM, and which ones give it back.`,
      headline: `Track your <span>REM sleep</span> recovery.`,
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

  // ── App CTA · Kygo standard module ──────────────────────────────────────
  // The shared <kygo-app-card> (kygo-app-card.js), the same card the blog posts
  // use: copy and store buttons on the left, the app's Insights screen on a
  // phone to the right. This tool's own words come from _appCta(). Tenjin gets
  // the tool as site_id; GA4 files clicks as cta_click with cta_label = slug.
  // Promo order on every tool: app card first, the State of Wearable Accuracy
  // report card second (accuracy and comparison tools only), the Picks card
  // last (just above the FAQ), never two promos back to back.
  _renderAppCta(bg) {
    __ensureKygoCta();
    __ensureKygoAppCard();
    const c = this._appCta();
    const txt = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().replace(/"/g, '&quot;');
    return `
      <style>
      .kc-section{padding:16px 20px;background:#fff}
      .kc-section.kc-gray{background:var(--kygo-light,var(--light,#F8FAFC))}
      @media(min-width:720px){.kc-section{padding:24px 24px}}
      .kc-inner{max-width:1100px;margin:0 auto}
      .kc-inner kygo-app-card{display:block}
      </style>
      <section class="kc-section${bg === 'gray' ? ' kc-gray' : ''}" id="get-the-app">
        <div class="kc-inner">
          <kygo-app-card surface="tool" web post="tool-${c.slug}" position="mid" slug="${c.slug}" variant="v1" focus="advisor"
            headline="${txt(c.headline)}" sub="${txt(c.sub)}">
            <a href="https://app.kygo.app/start">Get the Kygo app</a>
          </kygo-app-card>
        </div>
      </section>`;
  }

  // ── Email CTA · Kygo standard module ────────────────────────────────────
  // The inline email capture, on its own band. It never sits directly under the
  // app CTA — a page content section always separates the two conversion
  // touchpoints. Self-contained under `ke-*` names so it drops into either
  // palette. Pass 'gray' to sit on the tinted band.

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const appleImg = 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png';
    const fitbitImg = 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png';
    const garminImg = 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png';
    const googleHealthImg = 'https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png';
    const healthConnectImg = 'https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png';

    const factorCount = this._factorCount();
    const sourceCount = this._sourceCount();

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>


      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill"><span class="dot"></span> ${factorCount} FACTORS · 5 CATEGORIES · PEER-REVIEWED</div>
              <h1>What actually influences your <span class="hl">REM sleep?</span></h1>
              <p class="hero-lede">REM is the stage tied to dreaming, emotional processing, and memory — and it's unusually sensitive to chemistry and body temperature. We dug into the research on what really moves dream sleep, <strong>ranked by evidence strength.</strong> Here's what helps, what hurts, and what's just hype.</p>
            </div>
            <div class="hero-vis">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> REM is defended</span>
                <span class="hero-vis-tag">peer-reviewed</span>
              </div>
              <div class="hv-body">
                <div class="hv-big">140%</div>
                <div class="hv-text">
                  <p>of baseline <strong>REM on the first recovery night</strong> after REM loss — your brain pays back its dream-sleep debt automatically.</p>
                  <span class="hv-src">Endo et al. 1998</span>
                </div>
              </div>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">${factorCount}</div><div class="lbl">Factors analyzed</div></div>
            <div class="hero-stat"><div class="num">${sourceCount}</div><div class="lbl">Peer-reviewed sources</div></div>
            <div class="hero-stat"><div class="num">5</div><div class="lbl">Categories of influence</div></div>
            <div class="hero-stat"><div class="num">−11<span class="unit">min</span></div><div class="lbl">Alcohol's nightly hit to REM</div></div>
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

      <section class="section bg-white" id="action-board">
        <div class="section-inner">
          <div class="section-head center animate-on-scroll">
            <div class="kicker">What to change</div>
            <h2>Do more / <span class="hl">cut back.</span></h2>
            <p class="lede">The changes with real evidence behind them, with the dose that was tested and what it did. Tap any row for the full study details.</p>
          </div>
          <div class="ab-grid animate-on-scroll">${this._renderBoardCol('more')}${this._renderBoardCol('less')}</div>
          <p class="ab-foot">Only factors you can change, with strong or moderate evidence. Supplements that helped only in patients are left out; they stay in the full list below.</p>
        </div>
      </section>
      ${this._renderAppCta('gray')}

      <section class="section bg-white" id="explore">
        <div class="section-inner">
          <div class="section-head center animate-on-scroll">
            <div class="kicker">The library</div>
            <h2>Explore all <span class="hl">${factorCount} factors.</span></h2>
            <p class="lede">Pick a category, then tap any factor for its plain-English takeaway, mechanism, dose, and source.</p>
          </div>
          <div class="cat-tabs animate-on-scroll" role="tablist">${this._renderCategoryTabs()}</div>
          <div class="sort-bar animate-on-scroll">${this._renderSortBar()}</div>
          <div class="factor-cards">${this._renderFactorCards()}</div>
        </div>
      </section>


      ${this._renderRelatedTools('gray')}

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every claim, <span class="hl">traceable.</span></h2>
            <p class="lede">Each factor is anchored to a primary peer-reviewed source. Last updated October 2026.</p>
          </div>
          <div class="sources-wrap animate-on-scroll">${this._renderSources()}</div>
        </div>
      </section>

      <footer class="tool-footer">
        <div class="container">
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Always consult a qualified healthcare provider before starting any supplement, exercise program, or lifestyle change.</p>
          <p class="footer-copyright">Data sourced from peer-reviewed studies and meta-analyses. Last updated October 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases. Product links on this page are affiliate links; we may earn a commission at no extra cost to you.</p>
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
        --fg-1:#0F172A; --fg-2:#475569; --fg-3:#94A3B8; --border-subtle:#E2E8F0; --red:#EF4444;
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
      .hv-big { flex:none; font-family:var(--font-display); font-weight:700; font-size:clamp(42px,9vw,68px); line-height:.92; letter-spacing:-.03em; color:var(--kygo-green-dark); }
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

      .section-head.center { margin-left:auto; margin-right:auto; text-align:center; }
      .section-head.center .lede { margin-left:auto; margin-right:auto; }

      /* Action board · Do more / Cut back */
      .ab-grid { display:grid; grid-template-columns:1fr; gap:16px; align-items:start; }
      @media (min-width:900px){ .ab-grid { grid-template-columns:1fr 1fr; gap:24px; } }
      .ab-col { background:#fff; border:1px solid #D4D4D8; border-radius:20px; box-shadow:0 1px 2px rgba(15,23,42,.04), 0 8px 24px rgba(15,23,42,.05); overflow:hidden; }
      .ab-head { display:flex; align-items:center; gap:12px; padding:18px 20px; border-bottom:1px solid var(--border-subtle); }
      @media (min-width:900px){ .ab-head { padding:20px 24px; } }
      .ab-head-ico { width:36px; height:36px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex:none; color:#fff; }
      .ab-head-ico svg { width:18px; height:18px; }
      .ab-col-more .ab-head { background:#F0FDF4; border-bottom-color:#DCFCE7; }
      .ab-col-less .ab-head { background:#FEF2F2; border-bottom-color:#FEE2E2; }
      .ab-col-more .ab-head-ico { background:var(--kygo-green); }
      .ab-col-less .ab-head-ico { background:var(--red); }
      .ab-title { font-family:var(--font-display); font-weight:600; font-size:19px; color:var(--fg-1); line-height:1.2; margin:0; }
      .ab-sub { font-size:13px; color:var(--fg-2); margin:2px 0 0; }
      .ab-list { list-style:none; margin:0; padding:4px 12px; }
      @media (min-width:900px){ .ab-list { padding:0 16px 4px; } }
      .ab-item + .ab-item { border-top:1px solid var(--bg-raised); }
      .ab-extra { display:none; }
      .ab-col.open .ab-extra { display:block; }
      .ab-row { width:100%; display:grid; grid-template-columns:40px 1fr; column-gap:14px; align-items:start; padding:14px 8px; background:none; border:0; border-radius:12px; text-align:left; font-family:inherit; color:inherit; cursor:pointer; transition:background .15s; }
      .ab-row:hover { background:var(--bg-surface); }
      .ab-row:focus-visible, .ab-toggle:focus-visible, .factor-header:focus-visible, .cat-tab:focus-visible { outline:2px solid var(--kygo-green); outline-offset:2px; }
      .ab-ico { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; background:var(--bg-surface); border:1px solid var(--border-subtle); grid-row:span 2; }
      .ab-ico svg { width:19px; height:19px; }
      .ab-col-more .ab-ico { color:var(--kygo-green-dark); }
      .ab-col-less .ab-ico { color:var(--red); }
      .ab-main { display:flex; flex-direction:column; min-width:0; }
      .ab-name { font-family:var(--font-display); font-weight:600; font-size:15px; color:var(--fg-1); line-height:1.3; }
      .ab-dose { font-size:13px; color:var(--fg-2); line-height:1.45; }
      .ab-side { grid-column:2; display:flex; flex-wrap:wrap; align-items:center; gap:4px 12px; margin-top:6px; }
      .ab-result { font-size:12.5px; font-weight:600; color:var(--fg-1); line-height:1.35; }
      .ab-ev { display:inline-flex; align-items:center; gap:6px; font-size:11.5px; font-weight:500; color:var(--fg-3); white-space:nowrap; }
      .ab-bars { display:inline-flex; align-items:flex-end; gap:2px; height:11px; }
      .ab-bars i { width:3px; border-radius:1px; background:var(--border-subtle); }
      .ab-bars i:nth-child(1) { height:5px; }
      .ab-bars i:nth-child(2) { height:8px; }
      .ab-bars i:nth-child(3) { height:11px; }
      .ab-bars[data-lvl="1"] i:nth-child(-n+1), .ab-bars[data-lvl="2"] i:nth-child(-n+2), .ab-bars[data-lvl="3"] i { background:var(--fg-2); }
      @media (max-width:599px){ .ab-side { flex-direction:column; align-items:flex-start; gap:3px; } }
      .ab-toggle { width:100%; display:flex; align-items:center; justify-content:center; gap:6px; min-height:48px; border:0; border-top:1px solid var(--bg-raised); background:#fff; font:inherit; font-size:14px; font-weight:600; color:var(--fg-2); cursor:pointer; }
      .ab-toggle:hover { color:var(--fg-1); background:var(--bg-surface); }
      .ab-toggle svg { width:16px; height:16px; transition:transform .2s; }
      .ab-col.open .ab-toggle svg { transform:rotate(180deg); }
      .ab-foot { margin:14px auto 0; font-size:12.5px; color:var(--fg-3); text-align:center; max-width:640px; }

      /* Category tabs + sort */
      .cat-tabs { display:flex; flex-wrap:wrap; justify-content:center; gap:8px; margin-bottom:16px; }
      .cat-tab { display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:50px; border:2px solid var(--border-subtle); background:#fff; font-family:inherit; font-size:13px; font-weight:500; color:var(--fg-2); cursor:pointer; white-space:nowrap; transition:all .2s; }
      .cat-tab.active { background:rgba(34,197,94,.1); color:var(--kygo-green-dark); border-color:var(--kygo-green); }
      .cat-tab:hover { border-color:var(--kygo-green); }
      .cat-tab-icon { width:16px; height:16px; display:flex; }
      .cat-tab-icon svg { width:16px; height:16px; }
      .cat-tab-count { background:var(--bg-raised); color:var(--fg-3); font-size:11px; padding:1px 7px; border-radius:50px; }
      .cat-tab.active .cat-tab-count { background:rgba(34,197,94,.2); color:var(--kygo-green-dark); }
      .sort-bar { display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:20px; }
      .sort-label { font-size:12px; font-weight:600; color:var(--fg-3); text-transform:uppercase; letter-spacing:.3px; }
      .sort-select { padding:6px 28px 6px 12px; border-radius:50px; border:1px solid var(--border-subtle); background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center; -webkit-appearance:none; appearance:none; font-family:inherit; font-size:13px; font-weight:500; color:var(--fg-2); cursor:pointer; }
      .sort-select:hover, .sort-select:focus { border-color:var(--kygo-green); outline:none; }

      /* Factor cards */
      .factor-cards { display:grid; grid-template-columns:1fr; gap:12px; }
      @media (min-width:768px){ .factor-cards { grid-template-columns:1fr 1fr; align-items:start; } }
      .cat-note { grid-column:1 / -1; display:flex; gap:10px; align-items:flex-start; margin:0 0 4px; padding:14px 16px; border-radius:14px; background:rgba(34,197,94,.1); border:1px solid rgba(34,197,94,.3); font-size:14px; line-height:1.55; color:var(--fg-2); }
      .cat-note svg { width:18px; height:18px; flex:none; margin-top:2px; color:var(--kygo-green-dark); }
      .factor-card { background:#fff; border:1px solid var(--border-subtle); border-radius:20px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,.04); transition:box-shadow .3s, border-color .3s; scroll-margin-top:84px; }
      .factor-card:hover { box-shadow:0 12px 32px rgba(0,0,0,.08); border-color:#CBD5E1; }
      .factor-card.flash { border-color:var(--kygo-green); box-shadow:0 0 0 3px rgba(34,197,94,.25), 0 12px 32px rgba(0,0,0,.08); }
      .factor-header { padding:20px; cursor:pointer; }
      .factor-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
      .badge-direction { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:50px; font-size:12px; font-weight:600; }
      .badge-icon { width:14px; height:14px; display:flex; }
      .badge-icon svg { width:14px; height:14px; }
      .factor-toggle { width:24px; height:24px; color:var(--fg-3); transition:transform .3s; flex-shrink:0; }
      .factor-toggle svg { width:24px; height:24px; }
      .factor-card.expanded .factor-toggle { transform:rotate(180deg); }
      .factor-name { font-family:var(--font-display); font-weight:600; font-size:18px; line-height:1.25; margin:0 0 4px; color:var(--fg-1); }
      .factor-effect { font-size:14px; font-weight:600; color:var(--fg-2); margin:0 0 2px; line-height:1.45; }
      .factor-evidence-text { font-size:13px; color:var(--fg-1); margin:0; }
      .evidence-label { color:var(--fg-3); font-weight:500; }
      .factor-body { max-height:0; overflow:hidden; transition:max-height .4s cubic-bezier(.4,0,.2,1), padding .4s; padding:0 20px; }
      .factor-card.expanded .factor-body { max-height:1400px; padding:0 20px 20px; }
      .factor-detail { border-top:1px solid var(--bg-raised); padding-top:16px; display:flex; flex-direction:column; gap:12px; }
      .detail-row { display:flex; flex-direction:column; gap:2px; }
      .detail-label { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.5px; color:var(--fg-3); }
      .detail-value { font-size:14px; line-height:1.5; color:var(--fg-2); }
      .factor-src { display:inline-flex; align-items:center; gap:4px; align-self:flex-start; font-size:13px; font-weight:500; color:var(--kygo-green); }
      .factor-src:hover { color:var(--kygo-green-dark); }
      .factor-src svg { width:12px; height:12px; }
      .factor-affiliate { display:inline-flex; align-items:center; gap:6px; align-self:flex-start; padding:10px 14px; border-radius:10px; border:1.5px solid var(--kygo-green-light); background:rgba(34,197,94,.06); color:var(--kygo-green-dark); font-size:13px; font-weight:600; }
      .factor-affiliate:hover { border-color:var(--kygo-green); background:rgba(34,197,94,.12); }
      .factor-affiliate svg { width:13px; height:13px; }
      .factor-affiliate-note { font-size:11px; color:var(--fg-3); line-height:1.4; margin-top:-6px; }
      @media (prefers-reduced-motion:reduce){ .factor-body { transition:none; } }

      /* Blog CTA */

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
      .footer-disclaimer { font-size:12px; color:var(--fg-3); line-height:1.6; max-width:620px; margin:0 auto 14px; }
      .footer-copyright { font-size:12px; color:var(--fg-3); margin:4px 0; }
      .footer-affiliate { font-style:italic; max-width:620px; margin-left:auto; margin-right:auto; }

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
      if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('visible'));
        return;
      }
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
    const guardAttr = 'data-kygo-rem-sleep-ld';
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
        { '@type': 'ListItem', 'position': 3, 'name': 'What Influences REM Sleep', 'item': 'https://www.kygo.app/tools/rem-sleep-factors' }
      ]
    };

    [faq, breadcrumb].forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(guardAttr, '');
      script.textContent = JSON.stringify(data);
      __kygoAppendLdOnce(script);
    });
  }
}

if (!customElements.get('kygo-rem-sleep')) {
  customElements.define('kygo-rem-sleep', KygoRemSleep);
}
