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
  _sourceGroups() {
    const cats = this._categories;
    const seen = new Set();
    const groups = [];
    for (const [catKey, factors] of Object.entries(this._factors)) {
      const items = [];
      for (const f of factors) {
        if (f.source && !seen.has(f.source.url)) {
          seen.add(f.source.url);
          items.push({ title: `${f.name} — ${f.source.label}`, url: f.source.url });
        }
      }
      if (items.length) groups.push({ key: catKey, name: cats[catKey].name, icon: cats[catKey].icon, items });
    }
    return groups;
  }

  _srcLink(s, tag) {
    return `<a class="src" href="${s.url}" target="_blank" rel="noopener nofollow" data-action="source-link">
        ${tag ? `<span class="src-tag">${tag}</span>` : ''}
        <span class="src-title">${s.title}</span>
      </a>`;
  }

  // Desktop = compact grid (tag = category); mobile = one collapsible <details>
  // per category (first open) so it isn't one long wall of every source at once.
  _renderSources() {
    const groups = this._sourceGroups();
    const total = groups.reduce((n, g) => n + g.items.length, 0);
    const desktop = `<div class="src-desktop">${
      groups.map(g => g.items.map(s => this._srcLink(s, g.name)).join('')).join('')
    }</div>`;
    const mobile = `<div class="src-mobile">${
      groups.map((g, i) => `
        <details class="src-group"${i === 0 ? ' open' : ''}>
          <summary class="src-group-head">
            <span class="src-group-ico">${this._icon(g.icon)}</span>
            <span class="src-group-name">${g.name}</span>
            <span class="src-group-n">${g.items.length}</span>
            <span class="src-group-chev">${this._icon('chevDown')}</span>
          </summary>
          <div class="src-group-body">${g.items.map(s => this._srcLink(s, null)).join('')}</div>
        </details>`).join('')
    }</div>`;
    return `<div class="src-count">${total} peer-reviewed sources across ${groups.length} categories</div>${desktop}${mobile}`;
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

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const iosUrl = 'https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589';
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const appleImg = 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png';
    const fitbitImg = 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png';
    const garminImg = 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png';
    const googleHealthImg = 'https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png';
    const healthConnectImg = 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png';

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
          <a href="${iosUrl}" class="nav-cta-link cta-primary" data-track-label="subnav-get-app" data-track-position="subnav" target="_blank" rel="noopener">Get Kygo App ${this._icon('arrowRight')}</a>
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

      <section class="section bg-white">
        <div class="section-inner">
          <div class="kygo-cta-card animate-on-scroll">
            <div class="cta-pill"><span class="dot"></span> Free Forever Plan</div>
            <h3>Track your <span>REM sleep</span> recovery.</h3>
            <p>Stop guessing which of these applies to you. Kygo correlates your meals, caffeine, and alcohol with YOUR sleep stages.</p>
            <div class="cta-btn-row">
              <a class="btn btn-primary btn-lg cta-primary" href="${iosUrl}" target="_blank" rel="noopener" data-track-position="early" data-track-label="rem-sleep-early-ios">${this._icon('apple')} Download for iOS</a>
              <a class="btn btn-primary btn-lg cta-android" href="https://www.kygo.app/android" target="_blank" rel="noopener" data-action="android-download" data-track-position="early" data-track-label="rem-sleep-early-android">${this._icon('android')} Download for Android</a>
            </div>
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

      <kygo-inline-subscribe source="tool-rem-sleep" variant="factors"></kygo-inline-subscribe>

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

      <section class="section bg-white">
        <div class="section-inner">
          <a class="blog-cta animate-on-scroll" href="https://www.kygo.app/post/what-influences-rem-sleep-factors-ranked" target="_blank" rel="noopener">
            <span class="blog-cta-tag">Full Guide</span>
            <div class="blog-cta-body">
              <div class="blog-cta-kicker">Read the complete guide</div>
              <div class="blog-cta-title">What Influences REM Sleep</div>
              <div class="blog-cta-sub">Every factor ranked by evidence — what actually moves dream sleep, and what's just hype, in plain English.</div>
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
            <p class="lede">Each factor is anchored to a primary peer-reviewed source. Last updated June 2026.</p>
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
      .src { display:flex; flex-direction:column; gap:4px; background:#fff; border:1.5px solid var(--border-subtle); border-radius:12px; padding:12px 14px; transition:border-color .15s, box-shadow .15s; }
      .src:hover { border-color:var(--kygo-green); box-shadow:var(--shadow-md); }
      .src-tag { align-self:flex-start; font-family:var(--font-display); font-size:9.5px; font-weight:700; letter-spacing:.4px; text-transform:uppercase; color:var(--kygo-green-dark); }
      .src-title { font-family:var(--font-display); font-weight:600; font-size:13px; color:var(--fg-1); line-height:1.3; }
      .src:hover .src-title { color:var(--kygo-green-dark); }

      /* Mobile = collapsible accordion by category; desktop = compact grid */
      .src-desktop { display:none; }
      .src-mobile { display:flex; flex-direction:column; gap:10px; }
      .src-group { background:#fff; border:1.5px solid var(--border-subtle); border-radius:14px; overflow:hidden; transition:border-color .2s; }
      .src-group[open] { border-color:var(--kygo-green-light); }
      .src-group-head { display:flex; align-items:center; gap:10px; padding:14px 16px; cursor:pointer; list-style:none; }
      .src-group-head::-webkit-details-marker { display:none; }
      .src-group-ico { width:30px; height:30px; border-radius:8px; background:var(--kygo-green-light); color:var(--kygo-green-dark); display:inline-flex; align-items:center; justify-content:center; flex:none; }
      .src-group-ico svg { width:16px; height:16px; }
      .src-group-name { font-family:var(--font-display); font-weight:600; font-size:14px; color:var(--fg-1); flex:1; min-width:0; }
      .src-group-n { font-family:var(--font-display); font-size:11px; font-weight:600; color:var(--fg-3); background:var(--bg-raised); padding:3px 9px; border-radius:999px; flex:none; }
      .src-group-chev { color:var(--fg-3); display:inline-flex; flex:none; }
      .src-group-chev svg { width:16px; height:16px; transition:transform .2s; }
      .src-group[open] .src-group-chev svg { transform:rotate(180deg); color:var(--kygo-green-dark); }
      .src-group-body { display:flex; flex-direction:column; gap:8px; padding:0 16px 16px; }
      @media (min-width:768px){
        .src-mobile { display:none; }
        .src-desktop { display:grid; gap:8px; grid-template-columns:1fr 1fr; }
      }
      @media (min-width:960px){ .src-desktop { grid-template-columns:repeat(3,1fr); } }

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
