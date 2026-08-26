/**
 * Kygo Health — What Influences REM Sleep? Factor Explorer
 * Tag: kygo-rem-sleep
 * Interactive tool exploring 23 research-backed factors that affect REM (dream) sleep across 5 categories
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

class KygoRemSleep extends HTMLElement {
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
    __seo(this, 'What Influences REM Sleep? A research-based factor explorer by Kygo Health covering 23 factors that affect REM (rapid eye movement / dream) sleep across 5 categories: Nutrition and Substances, Supplements, Exercise and Physical Activity, Environment and Sleep Hygiene, and Demographics and Physiology. REM sleep is the dreaming stage tied to emotional processing and memory, normally 20 to 25 percent of total sleep, concentrated in the second half of the night. Nutrition factors: Alcohol is one of the most reliable REM suppressors, pushing REM latency 18 minutes later and cutting REM duration 11.3 minutes on average, worse per drink (Gardiner meta-analysis 2024). Caffeine delays REM timing but may not cut total REM. Cannabis and THC suppress REM and cause vivid-dream REM rebound on quitting. Nicotine and smoking reduce REM dose-dependently, with the patch worse than cigarettes. Diet: more carbohydrate tracks with more REM, high protein low carb with later REM, weak evidence. Supplements: Melatonin increases REM duration in people whose REM started low via MT1 receptors. 5-HTP raised REM percent in a small Parkinson trial. Vitamin B6 boosts dream recall and vividness but not proven REM duration. Glycine speeds sleep onset and deep sleep without changing REM. Exercise: hard late intense evening workouts slightly cut REM percent by about 2.5 percent and push it later; regular aerobic training mostly adds deep sleep not REM; morning exercise spares REM. Environment: ambient heat strongly shortens REM because thermoregulation is suspended during REM so keep the room cool; circadian timing gates REM which peaks near the core body temperature minimum about 2 hours before wake; sleep curtailment cuts REM first because REM is back-loaded into the early morning; REM rebound surges to 140 percent of baseline on recovery nights after REM loss; daytime napping reduces nighttime REM; pre-sleep learning and cognitive load increase REM; pre-sleep stress fragments REM and raises density but can trigger rebound; altitude reduces REM on first nights then recovers. Demographics: REM percent declines gradually about 0.6 percent per decade with age; sex differences are small and hormones matter more; the luteal phase before a period lowers REM as core body temperature rises. How to increase REM sleep naturally. What affects REM sleep. What reduces dream sleep. Best supplements for REM sleep. Why alcohol kills dream sleep. Data sourced from peer-reviewed studies and meta-analyses published through 2026.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Categories ────────────────────────────────────────────────────────

  get _categories() {
    return {
      nutrition: { name: 'Nutrition & Substances', icon: 'droplet', count: 5, intro: 'REM sleep is unusually sensitive to chemistry. Alcohol, cannabis, and nicotine have the clearest effects of any substances here — and all three reduce dream sleep.' },
      supplements: { name: 'Supplements', icon: 'pill', count: 4, intro: 'The supplement literature for REM specifically is thin. Most sleep supplements are studied against sleep latency or deep sleep, not isolated REM — treat any "boosts REM" claim as unproven unless it cites REM% on a sleep study (PSG).' },
      exercise: { name: 'Exercise & Physical Activity', icon: 'dumbbell', count: 3 },
      environment: { name: 'Environment & Sleep Hygiene', icon: 'moon', count: 8 },
      demographics: { name: 'Demographics & Physiology', icon: 'users', count: 3 }
    };
  }

  // ── Factors ───────────────────────────────────────────────────────────

  get _factors() {
    return {
      nutrition: [
        {
          key: 'alcohol',
          name: 'Alcohol',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative (dose-dependent)',
          keyFinding: '−11.3 min REM duration, +18 min REM latency (27-study meta)',
          whatThisMeans: 'Alcohol is one of the most reliable REM suppressors. Even two drinks delay and shorten your dream sleep, and it gets worse with every additional drink. This is why a nightcap leaves you under-recovered, and why using a drink to fall asleep backfires.',
          mechanism: 'Ethanol\'s acute sedative (GABAergic) effect suppresses the cholinergic activity that generates REM early in the night. As it metabolizes, the resulting sympathetic rebound and fragmentation wreck the second half of the night — exactly where REM concentrates.',
          dosage: 'Disruption begins at ~2 standard drinks; per 1 g/kg, REM latency rose 30.1 min and REM duration fell 40.4 min; REM% dropped 2.8%.',
          source: { url: 'https://www.sciencedirect.com/science/article/pii/S1087079224001345', label: 'Gardiner et al., Sleep Medicine Reviews 2024' }
        },
        {
          key: 'caffeine',
          name: 'Caffeine',
          direction: 'mixed',
          evidence: 'moderate',
          effect: 'Mixed (delays, may not cut total)',
          keyFinding: 'Delays REM timing; meta-analysis found no significant change in REM%',
          whatThisMeans: 'Caffeine clearly delays when REM shows up, but the evidence that it cuts how much REM you get is weaker and mixed. The bigger, clearer hits from caffeine are to deep sleep and how fast you fall asleep.',
          mechanism: 'Adenosine receptor antagonism delays sleep onset and pushes the nightly timing of REM later. Its clearest effects are on deep sleep and sleep onset rather than total REM amount.',
          dosage: 'Ten days of regular caffeine delayed nightly REM timing in healthy men; avoid late-day doses to protect REM timing.',
          source: { url: 'https://journals.sagepub.com/doi/full/10.1177/07487304211013995', label: 'Weibel et al., J Biol Rhythms 2021' }
        },
        {
          key: 'cannabis',
          name: 'Cannabis / THC',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative (suppression + rebound)',
          keyFinding: 'Suppresses REM; quitting triggers vivid-dream REM rebound',
          whatThisMeans: 'Cannabis suppresses dream sleep, which is why heavy users often report not dreaming. Quit and the dreams come roaring back (REM rebound), which makes stopping hard. Lower medical doses are less clear-cut.',
          mechanism: 'THC reduces eye-movement activity and, to a lesser degree, REM duration via CB1 signaling. Frequent use near bedtime raises REM latency and lowers sleep efficiency; stopping after heavy use unmasks a strong REM rebound.',
          dosage: 'Frequent bedtime use is worst; newer low therapeutic doses show mixed or null REM effects.',
          source: { url: 'https://www.sciencedirect.com/science/article/pii/S1087079225001170', label: 'Cannabis Meta-Analysis, Sleep Med Reviews 2025' }
        },
        {
          key: 'nicotine',
          name: 'Nicotine / Smoking',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative (dose-dependent)',
          keyFinding: 'Dose-dependent REM reduction; patch can be worse than cigarettes',
          whatThisMeans: 'Nicotine cuts dream sleep, whether from cigarettes or the patch. The patch can be worse for REM specifically because it keeps nicotine in your system all night rather than tapering off as a cigarette would.',
          mechanism: 'Nicotinic acetylcholine receptor activation promotes cortical arousal and fragments sleep. Transdermal delivery sustains nicotine across the whole night, suppressing REM more than a cigarette that tapers off.',
          dosage: 'Any nicotine exposure reduces REM; the all-night patch is worst. In the Sleep Heart Health Study (n=6,400) smokers had longer latency and lighter, more disrupted sleep.',
          source: { url: 'https://academic.oup.com/aje/article/164/6/529/129824', label: 'Zhang et al., Am J Epidemiology 2006 (SHHS)' }
        },
        {
          key: 'diet-macros',
          name: 'Diet / Macronutrient Mix',
          direction: 'mixed',
          evidence: 'emerging',
          effect: 'Shifts REM (weak evidence)',
          keyFinding: 'More carbs ~ more REM; high-protein/low-carb → later REM',
          whatThisMeans: 'More carbs tends to track with more REM, and very low-carb/high-protein with later REM — but this is among the weakest factors here: the data are observational and the mechanism may not apply to normal diets.',
          mechanism: 'A proposed tryptophan-availability pathway shifts serotonin/melatonin signaling toward more REM, but it may only hold at unusually low protein intakes, so real-world relevance is debated.',
          dosage: 'Observational only; among the weakest factors on this page.',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5612383/', label: 'Dietary Macronutrients & Sleep review, 2017' }
        }
      ],

      supplements: [
        {
          key: 'melatonin',
          name: 'Melatonin',
          direction: 'positive',
          evidence: 'moderate',
          effect: 'Positive (in low-REM individuals)',
          keyFinding: '↑ REM duration in people whose REM started ≥25% below age norm (2 RCTs)',
          whatThisMeans: 'Melatonin can nudge REM up, but the evidence is in people who started low, and the trials were small. Its core job is still circadian timing, not REM boosting. The effect in normal sleepers is unclear.',
          mechanism: 'In animals the MT1 receptor selectively enhances REM without changing non-REM. In humans the REM benefit showed up mainly in patients who began with reduced REM.',
          dosage: 'Two double-blind RCTs (n=14, mean age 50) in patients with REM ≥25% below age norm; effect in normal sleepers unclear.',
          source: { url: 'https://academic.oup.com/jcem/article/89/1/128/2840303', label: 'Kunz et al., JCEM 2004' },
          affiliate: { url: 'https://www.amazon.com/dp/B08666GMWG?tag=kygohealthapp-20&th=1', label: 'Melatonin Supplement' , slug: 'melatonin-gummies' }
        },
        {
          key: '5-htp',
          name: '5-HTP',
          direction: 'positive',
          evidence: 'emerging',
          effect: 'Positive (small, clinical sample)',
          keyFinding: '↑ REM% in a small RCT (n=18, Parkinson\'s, 50 mg/day)',
          whatThisMeans: '5-HTP nudged REM% up in a small trial, but that trial was in Parkinson\'s patients. The mechanism is plausible (it feeds serotonin and melatonin), yet it has not been confirmed in healthy sleepers.',
          mechanism: 'As a direct serotonin and melatonin precursor, 5-HTP may raise REM more reliably than L-tryptophan — but this rests on one small clinical sample.',
          dosage: '50 mg/day for 4 weeks in a clinical (Parkinson\'s) sample; unconfirmed in healthy adults.',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9418091/', label: '5-HTP RCT, Sleep and Breathing 2021' }
        },
        {
          key: 'vitamin-b6',
          name: 'Vitamin B6',
          direction: 'variable',
          evidence: 'emerging',
          effect: 'Dream recall, not REM duration',
          keyFinding: '↑ dream vividness & recall; no measured change in REM time',
          whatThisMeans: 'B6 makes dreams more vivid and easier to recall, which feels like "more REM" — but the studies did not actually show more REM time. It is a dream-recall effect, not a proven REM-duration effect.',
          mechanism: 'Proposed to raise cortical arousal during REM, increasing recall and vividness, without lengthening REM itself.',
          dosage: 'Increased vividness in a 250 mg pilot and recall in a larger study; no significant change in measured sleep variables.',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/11883552/', label: 'Ebben et al., 2002' }
        },
        {
          key: 'glycine',
          name: 'Glycine',
          direction: 'neutral',
          evidence: 'moderate',
          effect: 'No effect on REM',
          keyFinding: 'Speeds sleep onset & deep sleep; REM architecture unchanged',
          whatThisMeans: 'Glycine helps you fall asleep and reach deep sleep faster without disturbing REM, unlike sedatives. Useful for sleep onset, neutral for dream sleep.',
          mechanism: 'Glycine lowers core body temperature and speeds entry into NREM/slow-wave sleep, but does not change REM latency or overall sleep architecture.',
          dosage: '3 g before bed shortened latency to sleep and to slow-wave sleep without altering REM.',
          source: { url: 'https://onlinelibrary.wiley.com/doi/full/10.1111/j.1479-8425.2007.00262.x', label: 'Yamadera et al., Sleep & Biol Rhythms 2007' }
        }
      ],

      exercise: [
        {
          key: 'exercise-acute',
          name: 'Exercise (Acute, Evening, Intense)',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Slightly negative',
          keyFinding: 'Long, high-intensity evening exercise cut REM% by ~2.5%',
          whatThisMeans: 'Hard, late, long workouts shave a little REM and push it later. Regular daytime exercise is still net positive for sleep overall; the small REM cost is mostly an evening-intensity issue.',
          mechanism: 'Acute exercise slightly raises REM latency and decreases REM duration. Long, intense evening sessions elevate nocturnal core temperature, and REM is temperature-sensitive.',
          dosage: 'Mostly an evening-intensity issue; daytime exercise is net positive for sleep.',
          source: { url: 'https://www.tandfonline.com/doi/full/10.2147/NSS.S388863', label: 'Evening exercise meta-analysis, Nat Sci Sleep 2022' }
        },
        {
          key: 'aerobic-training',
          name: 'Regular Aerobic Training (Chronic)',
          direction: 'mixed',
          evidence: 'moderate',
          effect: 'Mixed (mostly neutral / slight reduction)',
          keyFinding: 'Adds deep sleep & shortens REM latency; REM duration flat-to-slightly-down',
          whatThisMeans: 'Building a regular exercise habit is good for sleep overall, but it mostly adds deep sleep, not REM. Do not expect training to raise dream sleep; if anything REM dips slightly.',
          mechanism: 'Chronic aerobic training raises total and deep sleep and tends to shorten REM latency, but effects on REM duration are mixed — most data show a small decrease or no change rather than an increase.',
          dosage: 'Build the habit for overall sleep; don\'t expect a REM increase.',
          source: { url: 'https://link.springer.com/article/10.1007/s10865-015-9617-6', label: 'Kredlow et al., J Behav Med 2015' }
        },
        {
          key: 'exercise-timing',
          name: 'Exercise Timing (Morning vs Evening)',
          direction: 'variable',
          evidence: 'moderate',
          effect: 'Timing-dependent',
          keyFinding: 'Evening sessions (~17:00–19:00) delay melatonin & cut REM; morning spares it',
          whatThisMeans: 'When you exercise matters for REM: late, intense sessions warm you up and push melatonin later, trimming REM, while morning workouts leave dream sleep alone. Finishing a couple hours before bed mostly fixes it.',
          mechanism: 'Evening exercise raises nocturnal core temperature and delays the melatonin rhythm, reducing REM. Morning exercise is less likely to disturb it.',
          dosage: 'Prefer morning sessions, or finish more than ~2 hours before bed to blunt the effect.',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10636512/', label: 'Exercise timing & sleep systematic review, 2023' }
        }
      ],

      environment: [
        {
          key: 'ambient-heat',
          name: 'Ambient Heat',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative (strong)',
          keyFinding: 'Hot rooms reliably shorten REM — thermoregulation is offline during REM',
          whatThisMeans: 'REM is the stage where your body\'s thermostat goes offline, so a hot room hits REM hardest. Heat is one of the most direct environmental levers on dream sleep. Keep the room cool.',
          mechanism: 'During REM the body suspends thermoregulation (no effective sweating or shivering), so the sleeper is exposed to room temperature. The melanin-concentrating hormone (MCH) system links REM amount to ambient temperature.',
          dosage: 'Keep the bedroom cool; elevated ambient heat reliably shortens REM.',
          source: { url: 'https://www.cell.com/current-biology/fulltext/S0960-9822(19)30542-1', label: 'Komagata et al., Current Biology 2019' }
        },
        {
          key: 'circadian-timing',
          name: 'Circadian Timing',
          direction: 'variable',
          evidence: 'strong',
          effect: 'Strong driver of distribution',
          keyFinding: 'REM peaks near the core-temperature minimum, ~2 h before wake',
          whatThisMeans: 'Most of your REM is in the last few hours before you wake. Cut your night short and you disproportionately cut REM. Sleeping in odd circadian windows (jet lag, shift work) misaligns it.',
          mechanism: 'REM is gated by the circadian clock and peaks near the core body temperature minimum, which falls roughly 2 hours before normal wake time — concentrating REM in the late night and early morning.',
          dosage: 'Protect the back end of the night; avoid off-phase sleep where possible.',
          source: { url: 'https://academic.oup.com/sleep/article-pdf/2/3/329/13660651/020307.pdf', label: 'Czeisler et al., Sleep 1980' }
        },
        {
          key: 'sleep-curtailment',
          name: 'Sleep Duration / Curtailment',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative (REM hit first)',
          keyFinding: 'At 4 h vs 9 h/night, REM duration & % dropped (n=27)',
          whatThisMeans: 'The simplest REM lever is to sleep longer. Trimming the back end of your night cuts dream sleep first, which is why a 5-hour night can feel emotionally rough even when you got your deep sleep.',
          mechanism: 'Because REM is back-loaded into the early morning, cutting sleep short trims REM more than any other stage, while slow-wave sleep percentage actually rises.',
          dosage: 'Sleep longer; the back end of the night is where REM lives.',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3517705/', label: 'Shechter et al., Am J Physiol 2012' }
        },
        {
          key: 'rem-rebound',
          name: 'Sleep Deprivation / REM Rebound',
          direction: 'positive',
          evidence: 'strong',
          effect: 'Rebound (compensatory)',
          keyFinding: 'After REM deprivation, REM surged to 140% of baseline on recovery night (n=8)',
          whatThisMeans: 'REM is defended. Lose it and your brain pays itself back, front-loading extra REM on recovery nights. The bigger the debt, the longer the payback.',
          mechanism: 'Selective REM deprivation cut REM to 9.2% of baseline; on the first recovery night it surged to 140.1%. The longer the prior deprivation, the longer the rebound.',
          dosage: 'Compensatory and automatic; scaled to the size of the REM debt.',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/9575987/', label: 'Endo et al., Am J Physiol 1998' }
        },
        {
          key: 'napping',
          name: 'Daytime Napping',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative (on nighttime REM)',
          keyFinding: 'Naps discharge sleep pressure, reducing nighttime REM & N2',
          whatThisMeans: 'As with deep sleep, a daytime nap spends some of the drive your body would otherwise put into nighttime REM. Long, late naps shift dream sleep into the nap and away from the night.',
          mechanism: 'Naps discharge homeostatic sleep pressure; split-sleep studies show daytime naps reduce subsequent nighttime REM and N2 duration.',
          dosage: 'Avoid long, late naps if nighttime REM is a priority.',
          source: { url: 'https://www.nature.com/articles/s41598-021-84625-8', label: 'Split sleep, Scientific Reports 2021' }
        },
        {
          key: 'pre-sleep-learning',
          name: 'Pre-Sleep Learning / Cognitive Load',
          direction: 'positive',
          evidence: 'emerging',
          effect: 'Positive',
          keyFinding: 'REM% rose with intensive language learning; tracked learning efficiency (n=10)',
          whatThisMeans: 'Heavy mental learning during the day nudges REM up that night as the brain uses dream sleep to lock in skills, and the people who learned most gained the most REM. Sample sizes here are small.',
          mechanism: 'REM preferentially supports procedural and emotional memory. In an immersion course, the rise in REM% correlated with language-learning efficiency (slow-wave sleep shares the load).',
          dosage: 'Demanding daytime learning; effect is modest and based on small samples.',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/2584082/', label: 'De Koninck et al., 1989' }
        },
        {
          key: 'pre-sleep-stress',
          name: 'Pre-Sleep Stress / Arousal',
          direction: 'mixed',
          evidence: 'moderate',
          effect: 'Mixed (fragmentation, density, rebound)',
          keyFinding: 'Acute stress fragments REM & raises density; can also trigger REM rebound',
          whatThisMeans: 'Stress chops REM up and loads it with eye movements in the moment, but can also trigger a rebound of extra REM afterward as the brain processes the load. Winding down before bed protects it.',
          mechanism: 'After acute stress, high-sleep-reactivity people show fragmented REM, lower REM duration, and higher REM density with a stronger cortisol response; separately, some stressors are followed by increased REM (rebound) as emotional-processing recovery.',
          dosage: 'Wind down before bed to protect REM continuity.',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10332417/', label: 'Sleep reactivity & cortisol, PMC 2023' }
        },
        {
          key: 'altitude',
          name: 'Altitude (High / Extreme)',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative (mixed strength)',
          keyFinding: 'REM reduced on first nights at altitude; recovers with acclimatization',
          whatThisMeans: 'Sleeping high (mountains, travel) tends to cut REM at first, especially if you feel altitude sick, but the body adapts over a few nights. The evidence here is less consistent than it is for deep sleep.',
          mechanism: 'On first nights at high altitude — and in acute mountain sickness — REM is reduced (near-absent at extreme altitude) via hypoxia and periodic breathing; slow-wave sleep is hit more consistently and REM recovers with acclimatization.',
          dosage: 'Worst on the first nights; adapts over ~2–3 nights.',
          source: { url: 'https://journals.physiology.org/doi/pdf/10.1152/japplphysiol.00448.2015', label: 'Sleep at high altitude review, J Appl Physiol 2015' }
        }
      ],

      demographics: [
        {
          key: 'age',
          name: 'Age',
          direction: 'negative',
          evidence: 'strong',
          effect: 'Negative (gradual)',
          keyFinding: 'REM% declined ~0.6%/decade from age 19–75 (65-study meta, n=3,577)',
          whatThisMeans: 'REM erodes slowly with age, not off a cliff like deep sleep does. The decline is gradual and modest — around half a percent of your sleep per decade.',
          mechanism: 'Across 65 studies, REM% declined roughly linearly with age, then ticked up slightly between 75 and 85. REM latency also shortened with age.',
          dosage: 'Non-modifiable; the decline is gradual and modest.',
          source: { url: 'https://pubmed.ncbi.nlm.nih.gov/15586779/', label: 'Ohayon et al., SLEEP 2004 meta-analysis' }
        },
        {
          key: 'sex-hormonal',
          name: 'Sex / Hormonal Status',
          direction: 'variable',
          evidence: 'moderate',
          effect: 'Small differences',
          keyFinding: 'Modest, inconsistent sex differences; hormones matter more than sex',
          whatThisMeans: 'Unlike deep sleep, REM does not differ dramatically between men and women. Hormonal changes matter more than sex itself.',
          mechanism: 'REM differences between sexes are modest and inconsistent in healthy adults relative to the large deep-sleep gap; hormonal states (menstrual phase, menopause) shift REM more than baseline sex does.',
          dosage: 'Non-modifiable; hormonal state matters more than sex.',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1978369/', label: 'REM% over the adult lifespan, PMC' }
        },
        {
          key: 'menstrual-cycle',
          name: 'Menstrual Cycle (Luteal Phase)',
          direction: 'negative',
          evidence: 'moderate',
          effect: 'Negative (luteal dip)',
          keyFinding: 'REM lower in the luteal phase; tracks the luteal rise in body temperature',
          whatThisMeans: 'In the roughly two weeks before a period, REM tends to dip and sleep gets lighter, partly because body temperature runs higher then and REM is temperature-sensitive. This is a normal hormonal pattern, not a disorder.',
          mechanism: 'REM duration is lower in the luteal phase than the follicular phase, with more arousals and lighter sleep; the drop tracks the luteal rise in core body temperature and progesterone.',
          dosage: 'Cyclical and normal; not a disorder.',
          source: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2864880/', label: 'Shechter & Boivin, Sleep 2010' }
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
        note: 'REM is back-loaded into the early morning, so trimming the end of your night cuts dream sleep before any other stage. Protect the back half of the night.',
        stat: '4 h vs 9 h: REM duration & % drop',
        category: 'Environment & Sleep Hygiene'
      },
      {
        icon: 'thermometer',
        label: 'Quickest Environmental Win',
        answer: 'Keep the Room Cool',
        note: 'During REM your body\'s thermostat goes offline, so a hot room hits REM hardest. Heat is one of the most direct environmental levers on dream sleep.',
        stat: 'Thermoregulation suspended during REM',
        category: 'Environment & Sleep Hygiene'
      },
      {
        icon: 'alert',
        label: 'Biggest REM Killer',
        answer: 'Alcohol',
        note: 'Even two drinks delay and shorten dream sleep, and it gets worse with every additional drink. A nightcap leaves you under-recovered.',
        stat: '−11.3 min REM, +18 min latency',
        category: 'Nutrition & Substances',
        warning: true
      },
      {
        icon: 'trophy',
        label: 'Most Defended',
        answer: 'REM Rebound',
        note: 'Lose REM and your brain pays itself back, front-loading extra dream sleep on recovery nights. The bigger the debt, the longer the payback.',
        stat: '140% of baseline on recovery night',
        category: 'Environment & Sleep Hygiene'
      },
      {
        icon: 'pill',
        label: 'Best Supplement',
        answer: 'Melatonin (if your REM is low)',
        note: 'Raised REM duration in people who started below their age norm via MT1 receptors — but the trials were small and it\'s really a circadian-timing tool, not a REM booster for normal sleepers.',
        stat: '2 RCTs, low-REM patients',
        category: 'Supplements'
      },
      {
        icon: 'dumbbell',
        label: 'Most Overrated for REM',
        answer: 'Exercise to Boost REM',
        note: 'Training is great for sleep — but it mostly adds deep sleep, not REM. Hard, late, intense sessions actually trim REM slightly and push it later.',
        stat: 'Evening exercise: −2.5% REM%',
        category: 'Exercise & Physical Activity'
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

  // Direction → on-brand class + icon (green for positive; neutral slate for the rest,
  // differentiated by the up/down/shuffle/minus icon — no off-brand red/amber).
  _directionConfig(d) {
    const map = {
      positive: { cls: 'dir-pos', icon: 'arrowUp', label: 'Positive' },
      negative: { cls: 'dir-neg', icon: 'arrowDown', label: 'Negative' },
      mixed: { cls: 'dir-mix', icon: 'arrowLeftRight', label: 'Mixed' },
      variable: { cls: 'dir-var', icon: 'arrowLeftRight', label: 'Variable' },
      neutral: { cls: 'dir-var', icon: 'minus', label: 'Neutral' }
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
          <div class="detail-row"><span class="detail-label">Dose / context</span><span class="detail-value">${f.dosage}</span></div>
          <a href="${f.source.url}" class="factor-src" target="_blank" rel="noopener nofollow" data-action="source-link">${f.source.label} ${this._icon('externalLink')}</a>
          ${f.affiliate ? `<a href="${f.affiliate.url}" class="factor-affiliate" target="_blank" rel="noopener nofollow sponsored" data-action="affiliate" data-track-label="${f.affiliate.slug}">Check it out on Amazon ${this._icon('externalLink')}</a><span class="factor-affiliate-note">Affiliate link — we may earn a commission at no extra cost to you.</span>` : ''}
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
        blurb: '33 factors that affect how fast you fall asleep, ranked by evidence.',
        url: 'https://www.kygo.app/tools/sleep-latency-factors',
        meta: 'Sleep · 33 factors',
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
        title: 'What Influences REM Sleep? Factors Ranked by Evidence (2026)',
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

  _renderAppCta(bg) {
    const c = this._appCta();
    const ios = 'https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy';
    const android = 'https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO';
    const badges = [
      ['273a63_56ac2eb53faf43fab1903643b29c0bce', 'Oura Ring'],
      ['273a63_1a1ba0e735ea4d4d865c04f7c9540e69', 'Apple Health'],
      ['273a63_c451e954ff8740338204915f904d8798', 'Fitbit'],
      ['273a63_0a60d1d6c15b421e9f0eca5c4c9e592b', 'Garmin'],
      ['273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e', 'Google Health'],
      ['273a63_0c0e48cc065d4ee3bf506f6d47440518', 'Health Connect']
    ].map(([id, name]) => `<img src="https://static.wixstatic.com/media/${id}~mv2.png" alt="${name}" title="${name}" loading="lazy" />`).join('');
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
      .kc-badges{display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center}
      .kc-badges img{width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);padding:4px;object-fit:contain}
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
    return { source: 'tool-rem-sleep', variant: 'factors' };
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

      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" loading="lazy" />
            <span>Kygo Health</span>
          </a>
          <div class="nav-cta-group">
            <a href="${iosUrl}" class="nav-store-btn nav-store-ios cta-primary" data-track-label="subnav-get-app-ios" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on the App Store"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg><span>iOS</span></a>
            <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" class="nav-store-btn nav-store-android cta-android" data-action="android-download" data-track-label="subnav-get-app-android" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on Google Play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg><span>Android</span></a>
          </div>
        </div>
      </header>

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
      ${this._renderAppCta()}




      <section class="section bg-light" id="explore">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The library</div>
            <h2>Explore all <span class="hl">${factorCount} factors.</span></h2>
            <p class="lede">Jump to a category, then tap any factor to expand its plain-English takeaway, mechanism, dose, and source.</p>
          </div>
          <div class="cat-nav animate-on-scroll">${this._renderCategoryNav()}</div>
          ${this._renderCategoryBlocks()}
        </div>
      </section>
      ${this._renderEmailCta()}


      ${this._renderRelatedTools('gray')}
      ${this._renderRelatedPosts()}

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every claim, <span class="hl">traceable.</span></h2>
            <p class="lede">Each factor is anchored to a primary peer-reviewed source. Last updated June 2026.</p>
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
          <p class="footer-copyright">Data sourced from peer-reviewed studies and meta-analyses. Last updated June 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases. Product links on this page are affiliate links — we may earn a commission at no extra cost to you.</p>
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
      .nav-cta-group { margin-left:auto; display:inline-flex; align-items:center; gap:8px; }
      .nav-cta-group .nav-store-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border-radius:8px; font-weight:600; font-size:13px; text-decoration:none; white-space:nowrap; line-height:1; }
      .nav-cta-group .nav-store-btn svg { width:15px; height:15px; flex-shrink:0; }
      .nav-cta-group .nav-store-ios { background:var(--kygo-green); color:#fff; }
      .nav-cta-group .nav-store-ios:hover { background:var(--kygo-green-dark); color:#fff; }
      .nav-cta-group .nav-store-android { background:#fff; color:var(--kygo-green-dark); border:1.5px solid var(--border-subtle); }
      .nav-cta-group .nav-store-android:hover { border-color:var(--kygo-green); color:var(--kygo-green-dark); }
      @media (max-width:360px){ .nav-cta-group .nav-store-btn span { display:none; } .nav-cta-group .nav-store-btn { padding:8px 10px; } }
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
      .factor-affiliate-note { font-size:11px; color:var(--fg-3); line-height:1.4; margin-top:-6px; }

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
      .footer-brand { display:inline-flex; align-items:center; gap:10px; color:var(--fg-1); font-family:var(--font-display); font-weight:700; font-size:17px; }
      .footer-logo { width:28px; height:28px; }
      .footer-tagline { color:var(--fg-3); font-size:14px; margin:10px 0 22px; }
      .footer-links { display:flex; flex-wrap:wrap; justify-content:center; gap:18px; margin-bottom:28px; font-size:14px; }
      .footer-links a { color:var(--fg-2); }
      .footer-links a:hover { color:var(--kygo-green-dark); }
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
      document.head.appendChild(script);
    });
  }
}

if (!customElements.get('kygo-rem-sleep')) {
  customElements.define('kygo-rem-sleep', KygoRemSleep);
}
