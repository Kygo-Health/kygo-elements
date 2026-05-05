# Wearable Stress Metrics: Research-Based Factor Breakdown by Brand

Every wearable stress score is a proprietary wrapper around a handful of known physiological signals. Since the signals are well-researched, we can identify exactly what influences each brand's score — regardless of their black-box algorithm.

**Logic chain:** Wearable score → underlying signal(s) → researched influencing factors

**Key insight:** Multi-signal approaches (HRV + EDA + temp) show ~82% accuracy vs. ~77% for HRV alone. Only Samsung and Google/Fitbit use EDA alongside HRV. Scores are NOT comparable across brands due to proprietary algorithms.

---

## Garmin

**Signals used:** HRV, Heart Rate
**Algorithm:** Firstbeat Analytics (RMSSD-based)
**Scale:** 0–100 (0–25 rest, 26–50 low, 51–75 med, 76–100 high)
**Behavior:** Samples every few minutes. Pauses during exercise.

### HRV factors (primary driver)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Sleep (7–9 hrs consistent) | ↑ Improves | 15–30% increase within 4 weeks | Parasympathetic dominance during quality sleep restores vagal tone | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) — "Update: Factors Influencing HRV" |
| Aerobic exercise (150 min/wk moderate) | ↑ Improves | Significant long-term increase | Enhanced cardiovascular fitness and vagal tone via regular training | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) — "Analysis of HRV and Implication of Different Factors" |
| Meditation / breathwork | ↑ Improves | Acute + chronic improvement | Activates parasympathetic nervous system, slows respiration rate | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Healthy body weight / weight loss | ↑ Improves | Restores sympathovagal balance | Weight loss via lifestyle changes increases parasympathetic activity, reduces sympathetic activation | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Hydration | ↑ Improves | Moderate effect on blood volume | Adequate blood volume reduces cardiac strain, supports parasympathetic tone | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) — "Factors Affecting RHR in Free-Living Humans" |
| Cold exposure (controlled) | ↑ Improves | Acute vagal stimulation | Triggers vagus nerve via dive reflex, boosts parasympathetic output | [Marathon Handbook](https://marathonhandbook.com/how-to-increase-hrv/) — "11 Evidence-Backed Strategies" (2026) |
| Alcohol (even 1 drink) | ↓ Worsens | RMSSD drops ~2ms/drink; 3+ drinks = up to 13ms drop for 2–5 days | Suppresses parasympathetic nervous system activity directly | [Kygo.app](https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence) — "44 Factors Ranked by Evidence" (2026); [Frontiers in Physiology 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Sleep deprivation | ↓ Worsens | Significant acute reduction | Shifts autonomic balance toward sympathetic dominance | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Overtraining (without recovery) | ↓ Worsens | Progressive decline with accumulated fatigue | Excessive physical stress without recovery suppresses parasympathetic tone | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) — "Analysis of HRV and Implication of Different Factors" |
| Chronic psychological stress | ↓ Worsens | Sustained reduction in RMSSD/SDNN | Chronic sympathetic activation suppresses vagal tone | [PMC9974008](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/) — "HRV as Measure of Stress in Medical Professionals" |
| Illness / inflammation | ↓ Worsens | Significant during acute illness | Immune response activates sympathetic nervous system | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Excess caffeine | ↓ Worsens | 8–12% drop in sensitive individuals | Overstimulates sympathetic nervous system; avoid after 2 PM for sleep impact | [PMC11284693](https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/) — "Caffeine Intake Strategies on HRV Recovery" |
| Age (non-controllable) | — Declines | Progressive decline with age | Natural reduction in parasympathetic nervous system function | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Sex (non-controllable) | — Varies | Females tend to have lower SDNN | Hormonal and autonomic nervous system differences | [PMC11439429](https://pmc.ncbi.nlm.nih.gov/articles/PMC11439429/) — "HRV Measurement and Influencing Factors" |
| Beta-blockers (medication) | ↑ Increases | Restores sympathovagal balance | Decreases sympathetic activity in cardiovascular patients | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |

### Heart rate factors (secondary driver)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Cardio fitness (strongest factor) | ↓ Lowers RHR (= healthier baseline) | All sport types reduce RHR; dose-dependent | Stronger heart pumps more blood per beat, needs fewer beats at rest | [PMC6306777](https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/) — "Effects of Exercise on RHR: Systematic Review & Meta-Analysis" |
| Adequate sleep | ↓ Lowers RHR | Elevated next-day HR from poor sleep | Sleep deprivation shifts autonomic balance toward sympathetic | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) — "Factors Affecting RHR in Free-Living Humans" |
| Healthy body weight | ↓ Lowers RHR | Proportional to weight loss | Less strain on cardiovascular system, reduced peripheral resistance | [AHA](https://www.heart.org/en/news/2019/02/01/8-things-that-can-affect-your-heart-and-what-to-do-about-them) — "8 Things That Can Affect Your Heart" |
| Hydration | ↓ Lowers RHR | Moderate effect | Adequate blood volume means heart pumps efficiently | [Cleveland Clinic](https://health.clevelandclinic.org/how-to-lower-your-resting-heart-rate) — "How to Lower Your Resting Heart Rate" |
| Sedentary lifestyle | ↑ Raises RHR | Most common cause of high RHR | Deconditioned heart must work harder to maintain output | [Hackensack Meridian Health](https://www.hackensackmeridianhealth.org/en/healthier-you/2022/02/24/6-reasons-your-heart-rate-is-high) — "6 Reasons Your Heart Rate is High" |
| Caffeine / stimulants | ↑ Raises RHR | Acute increase, duration varies | Stimulates sympathetic nervous system and adrenal response | [The Heart Foundation](https://theheartfoundation.org/2018/11/02/your-heart-rate/) — "Your Heart Rate" |
| Alcohol | ↑ Raises RHR | Acute and next-day elevation | Vasodilation requires compensatory heart rate increase | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) — "Factors Affecting RHR in Free-Living Humans" |
| Heat / dehydration | ↑ Raises RHR | Significant in hot environments | Thicker blood + thermoregulation demand = more cardiac work | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) — "Factors Affecting RHR in Free-Living Humans" |
| Illness / fever | ↑ Raises RHR | ~10 bpm per 1°F fever | Immune response + thermoregulation increase metabolic demand | [AHA](https://www.heart.org/en/news/2019/02/01/8-things-that-can-affect-your-heart-and-what-to-do-about-them) — "8 Things That Can Affect Your Heart" |
| Stress / anxiety | ↑ Raises RHR | Acute and chronic elevation | Sympathetic nervous system activation via cortisol/adrenaline | [Cleveland Clinic](https://health.clevelandclinic.org/how-to-lower-your-resting-heart-rate) — "How to Lower Your Resting Heart Rate" |

---

## Samsung Galaxy Watch

**Signals used:** HRV, Heart Rate, EDA (Electrodermal Activity)
**Algorithm:** BioActive Sensor (proprietary, dual HRV + EDA). GW8 adds enhanced EDA. AI pattern recognition on GW7 Ultra+.
**Scale:** 0–100
**Behavior:** Continuous real-time.

### HRV factors (primary driver)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Sleep (7–9 hrs consistent) | ↑ Improves | 15–30% increase within 4 weeks | Parasympathetic dominance during quality sleep restores vagal tone | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Aerobic exercise (150 min/wk moderate) | ↑ Improves | Significant long-term increase | Enhanced cardiovascular fitness and vagal tone via regular training | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Meditation / breathwork | ↑ Improves | Acute + chronic improvement | Activates parasympathetic nervous system, slows respiration rate | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Healthy body weight / weight loss | ↑ Improves | Restores sympathovagal balance | Increases parasympathetic activity, reduces sympathetic activation | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Hydration | ↑ Improves | Moderate effect | Adequate blood volume reduces cardiac strain | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Cold exposure (controlled) | ↑ Improves | Acute vagal stimulation | Triggers vagus nerve via dive reflex | [Marathon Handbook (2026)](https://marathonhandbook.com/how-to-increase-hrv/) |
| Alcohol (even 1 drink) | ↓ Worsens | RMSSD drops ~2ms/drink; 3+ = up to 13ms for 2–5 days | Suppresses parasympathetic activity directly | [Kygo.app (2026)](https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence); Frontiers in Physiology 2024 |
| Sleep deprivation | ↓ Worsens | Significant acute reduction | Shifts autonomic balance toward sympathetic dominance | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Overtraining | ↓ Worsens | Progressive decline | Excessive stress without recovery suppresses parasympathetic tone | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Chronic psychological stress | ↓ Worsens | Sustained RMSSD/SDNN reduction | Chronic sympathetic activation suppresses vagal tone | [PMC9974008](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/) |
| Illness / inflammation | ↓ Worsens | Significant during acute illness | Immune response activates sympathetic nervous system | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Excess caffeine | ↓ Worsens | 8–12% drop in sensitive individuals | Overstimulates sympathetic nervous system | [PMC11284693](https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/) |

### Heart rate factors (secondary driver)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Cardio fitness | ↓ Lowers RHR | All sport types; dose-dependent | Stronger heart pumps more per beat | [PMC6306777](https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/) |
| Adequate sleep | ↓ Lowers RHR | Elevated next-day HR from poor sleep | Sympathetic shift from sleep deprivation | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Sedentary lifestyle | ↑ Raises RHR | Most common cause of high RHR | Deconditioned heart works harder | [Hackensack Meridian Health](https://www.hackensackmeridianhealth.org/en/healthier-you/2022/02/24/6-reasons-your-heart-rate-is-high) |
| Caffeine / stimulants | ↑ Raises RHR | Acute increase | Stimulates sympathetic nervous system | [The Heart Foundation](https://theheartfoundation.org/2018/11/02/your-heart-rate/) |
| Alcohol | ↑ Raises RHR | Acute and next-day elevation | Vasodilation requires compensatory HR increase | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Heat / dehydration | ↑ Raises RHR | Significant in hot environments | Thicker blood + thermoregulation demand | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Illness / fever | ↑ Raises RHR | ~10 bpm per 1°F fever | Immune + thermoregulation demand | [AHA](https://www.heart.org/en/news/2019/02/01/8-things-that-can-affect-your-heart-and-what-to-do-about-them) |
| Stress / anxiety | ↑ Raises RHR | Acute and chronic | Cortisol/adrenaline activation | [Cleveland Clinic](https://health.clevelandclinic.org/how-to-lower-your-resting-heart-rate) |

### EDA factors (unique to Samsung — differentiator signal)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Emotional arousal (anxiety, fear, anger) | ↑ Increases (= higher stress reading) | Strong and immediate | Sympathetic NS triggers eccrine sweat glands, increasing skin conductance | [Wikipedia](https://en.wikipedia.org/wiki/Electrodermal_activity); [EBSCO Research Starters](https://www.ebsco.com/research-starters/health-and-medicine/electrodermal-activity-eda) |
| Cognitive load / mental effort | ↑ Increases | Moderate response | Mental exertion activates sympathetic NS | [BIOPAC Blog](https://blog.biopac.com/electrodermal-activity-eda/) — "Electrodermal Activity (EDA)" |
| Sensory stimulation (loud sounds, pain, surprise) | ↑ Increases | Acute orienting response | Startle/orienting response via sympathetic sweat gland activation | [PMC10575214](https://pmc.ncbi.nlm.nih.gov/articles/PMC10575214/) — "Five Basic Human Senses Evoke EDA" |
| Ambient heat + humidity (confounder) | ↑ Increases | Tonic level rises | Thermoregulatory sweating independent of emotional state | [Noldus Academy](https://academy.noldus.com/courses/getting-started-with-noldushub/lessons/noldushub-parameters/topics/skin-conductance-gsr/) — "Electrodermal Activity" |
| Excitement / positive arousal | ↑ Increases | Similar to negative arousal | EDA cannot distinguish positive from negative — detects sympathetic activation only | [Innsightful](https://www.innsightful.com/electrodermal-activity-eda-the-science-of-skin-conductance-and-emotional-arousal/) — "Science of Skin Conductance and Emotional Arousal" |
| Relaxation / meditation | ↓ Decreases (= lower stress reading) | Gradual reduction | Parasympathetic activation reduces sympathetic drive to sweat glands | [ScienceDirect](https://www.sciencedirect.com/topics/psychology/electrodermal-activity) |
| Cool ambient temperature | ↓ Decreases | Tonic level falls | Less thermoregulatory sweating | [U. Birmingham Guide](https://www.birmingham.ac.uk/documents/college-les/psych/saal/guide-electrodermal-activity.pdf) — "Analysing Electrodermal Activity" |
| Habituation (repeated stimuli) | ↓ Decreases | Progressive reduction per exposure | Brain adapts to repeated non-threatening stimuli | [EBSCO Research Starters](https://www.ebsco.com/research-starters/health-and-medicine/electrodermal-activity-eda) |
| Dehydration | ↑ or variable | Alters electrolyte concentration | Changes sweat composition and conductance properties | [Noldus Academy](https://academy.noldus.com/courses/getting-started-with-noldushub/lessons/noldushub-parameters/topics/skin-conductance-gsr/) |

---

## Google Pixel Watch & Fitbit Sense 2

**Signals used:** HRV, Heart Rate, EDA (cEDA — continuous), Skin Temperature
**Algorithm:** cEDA sensor + machine learning model across 4 signals. Builds baseline over first month. First consumer all-day on-wrist EDA (2022).
**Scale:** Body Response alerts + daily Stress Management Score 1–100 (Fitbit uses 12 metrics across 3 categories: exertion balance, sleep patterns, responsiveness)
**Behavior:** Continuous (cEDA all-day). Distinguishes exercise from stress automatically.

### HRV factors (primary driver)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Sleep (7–9 hrs consistent) | ↑ Improves | 15–30% increase within 4 weeks | Parasympathetic dominance restores vagal tone | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Aerobic exercise (150 min/wk) | ↑ Improves | Significant long-term increase | Enhanced vagal tone via training | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Meditation / breathwork | ↑ Improves | Acute + chronic improvement | Activates parasympathetic NS | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Healthy body weight | ↑ Improves | Restores sympathovagal balance | Increases parasympathetic, reduces sympathetic | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Hydration | ↑ Improves | Moderate | Reduces cardiac strain | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Cold exposure | ↑ Improves | Acute vagal stimulation | Dive reflex | [Marathon Handbook (2026)](https://marathonhandbook.com/how-to-increase-hrv/) |
| Alcohol | ↓ Worsens | ~2ms/drink; 3+ = 13ms for 2–5 days | Suppresses parasympathetic activity | [Kygo.app (2026)](https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence); [Frontiers 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Sleep deprivation | ↓ Worsens | Significant acute reduction | Sympathetic dominance shift | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Overtraining | ↓ Worsens | Progressive decline | Suppresses parasympathetic tone | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Chronic stress | ↓ Worsens | Sustained RMSSD reduction | Chronic sympathetic activation | [PMC9974008](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/) |
| Illness | ↓ Worsens | Significant | Immune response activates sympathetic NS | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Excess caffeine | ↓ Worsens | 8–12% in sensitive individuals | Overstimulates sympathetic NS | [PMC11284693](https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/) |

### Heart rate factors

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Cardio fitness | ↓ Lowers RHR | Dose-dependent | Stronger heart, fewer beats needed | [PMC6306777](https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/) |
| Adequate sleep | ↓ Lowers RHR | Next-day elevation from poor sleep | Sympathetic shift | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Sedentary lifestyle | ↑ Raises RHR | Most common cause | Deconditioned heart | [Hackensack Meridian Health](https://www.hackensackmeridianhealth.org/en/healthier-you/2022/02/24/6-reasons-your-heart-rate-is-high) |
| Caffeine | ↑ Raises RHR | Acute increase | Sympathetic stimulation | [The Heart Foundation](https://theheartfoundation.org/2018/11/02/your-heart-rate/) |
| Alcohol | ↑ Raises RHR | Acute + next-day | Vasodilation compensation | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Heat / dehydration | ↑ Raises RHR | Significant in heat | Thicker blood, thermoregulation | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Illness / fever | ↑ Raises RHR | ~10 bpm/1°F | Immune + thermoregulation demand | [AHA](https://www.heart.org/en/news/2019/02/01/8-things-that-can-affect-your-heart-and-what-to-do-about-them) |
| Stress / anxiety | ↑ Raises RHR | Acute and chronic | Cortisol/adrenaline | [Cleveland Clinic](https://health.clevelandclinic.org/how-to-lower-your-resting-heart-rate) |

### EDA factors (cEDA — continuous all-day tracking)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Emotional arousal (anxiety, fear, anger) | ↑ Increases | Strong and immediate | Sympathetic triggers sweat glands | Wikipedia; [EBSCO](https://www.ebsco.com/research-starters/health-and-medicine/electrodermal-activity-eda) |
| Cognitive load / mental effort | ↑ Increases | Moderate | Sympathetic activation from mental exertion | [BIOPAC Blog](https://blog.biopac.com/electrodermal-activity-eda/) |
| Sensory stimulation (sounds, pain, surprise) | ↑ Increases | Acute orienting response | Startle response via sympathetic sweat activation | [PMC10575214](https://pmc.ncbi.nlm.nih.gov/articles/PMC10575214/) |
| Ambient heat + humidity (confounder) | ↑ Increases | Tonic level rises | Thermoregulatory sweating | [Noldus Academy](https://academy.noldus.com/courses/getting-started-with-noldushub/lessons/noldushub-parameters/topics/skin-conductance-gsr/) |
| Excitement / positive arousal | ↑ Increases | Similar to negative | EDA can't distinguish valence — only arousal | [Innsightful](https://www.innsightful.com/electrodermal-activity-eda-the-science-of-skin-conductance-and-emotional-arousal/) |
| Relaxation / meditation | ↓ Decreases | Gradual | Parasympathetic reduces sympathetic drive | ScienceDirect |
| Cool ambient temperature | ↓ Decreases | Tonic level falls | Less thermoregulatory sweating | [U. Birmingham Guide](https://www.birmingham.ac.uk/documents/college-les/psych/saal/guide-electrodermal-activity.pdf) |
| Habituation | ↓ Decreases | Progressive per exposure | Brain adapts to repeated stimuli | [EBSCO](https://www.ebsco.com/research-starters/health-and-medicine/electrodermal-activity-eda) |

### Skin temperature factors (unique additional signal)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Acute psychological stress | ↓ Drops (periphery) | Measurable at wrist/fingertip | Vasoconstriction redirects blood to core organs | [PMC4664114](https://pmc.ncbi.nlm.nih.gov/articles/PMC4664114/) — "Skin Temp Reveals Intensity of Acute Stress" |
| Exercise | ↑ Rises then drops | Significant during/post | Vasodilation for heat dissipation; devices filter this | [Ultrahuman Blog](https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/) |
| Menstrual cycle | ↑ Rises in luteal phase | ~0.3–0.5°C | Progesterone raises basal body temp | [Ultrahuman Blog](https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/) |
| Illness / fever | ↑ Rises | Significant | Immune response raises core and peripheral temp | [Ultrahuman Blog](https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/) |
| Alcohol | ↑ Rises (peripheral) | Acute vasodilation | Blood vessel dilation increases skin surface temp | [Ultrahuman Blog](https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/) |
| Ambient temperature | ↑↓ Follows environment | Major confounder for wrist devices | External temp directly affects surface readings | [PMC9690349](https://pmc.ncbi.nlm.nih.gov/articles/PMC9690349/) |
| Sleep onset | ↑ Rises at extremities | Normal circadian pattern | Vasodilation at extremities initiates sleep | Nature — "Wearable-derived Skin Temp Dynamics" (2026) |
| Depression / chronic stress | ↑ Higher variability | Positive association with depression | Disrupted autonomic regulation increases temp fluctuations | ScienceDirect — "EDA and Skin Temp in Stress and Depression" (2025) |

---

## WHOOP (4.0 / 5.0)

**Signals used:** HRV, Heart Rate, Respiratory Rate, Skin Temperature, SpO2
**Algorithm:** RMSSD vs. 14-day personal baseline. Motion-aware to filter exercise.
**Scale:** Stress Monitor 0–3 (0–1 low, 1–2 medium, 2–3 high) | Recovery 0–100%
**Behavior:** Real-time. Stress Monitor requires Peak or Life membership (not available on base WHOOP One tier).

### HRV factors (dominant driver — measured overnight via RMSSD)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Sleep (7–9 hrs consistent) | ↑ Improves | 15–30% increase within 4 weeks | Parasympathetic dominance restores vagal tone | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Aerobic exercise (150 min/wk) | ↑ Improves | Significant long-term | Enhanced vagal tone | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Meditation / breathwork | ↑ Improves | Acute + chronic | Activates parasympathetic NS | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Healthy body weight | ↑ Improves | Restores balance | Increases parasympathetic activity | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Hydration | ↑ Improves | Moderate | Reduces cardiac strain | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Cold exposure | ↑ Improves | Acute vagal stimulation | Dive reflex | [Marathon Handbook (2026)](https://marathonhandbook.com/how-to-increase-hrv/) |
| Alcohol | ↓ Worsens | ~2ms/drink; 3+ = 13ms for 2–5 days | Suppresses parasympathetic activity | [Kygo.app (2026)](https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence); [Frontiers 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Sleep deprivation | ↓ Worsens | Significant acute reduction | Sympathetic dominance | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Overtraining | ↓ Worsens | Progressive decline | Suppresses parasympathetic tone | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Chronic stress | ↓ Worsens | Sustained RMSSD reduction | Chronic sympathetic activation | [PMC9974008](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/) |
| Illness | ↓ Worsens | Significant | Immune response activates sympathetic NS | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Excess caffeine | ↓ Worsens | 8–12% in sensitive individuals | Overstimulates sympathetic NS | [PMC11284693](https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/) |

### Heart rate factors

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Cardio fitness | ↓ Lowers RHR | Dose-dependent | Stronger heart | [PMC6306777](https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/) |
| Adequate sleep | ↓ Lowers RHR | Next-day elevation from poor sleep | Sympathetic shift | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Sedentary lifestyle | ↑ Raises RHR | Most common cause | Deconditioned heart | [Hackensack Meridian Health](https://www.hackensackmeridianhealth.org/en/healthier-you/2022/02/24/6-reasons-your-heart-rate-is-high) |
| Caffeine | ↑ Raises RHR | Acute increase | Sympathetic stimulation | [The Heart Foundation](https://theheartfoundation.org/2018/11/02/your-heart-rate/) |
| Alcohol | ↑ Raises RHR | Acute + next-day | Vasodilation compensation | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Heat / dehydration | ↑ Raises RHR | Significant | Thicker blood, thermoregulation | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Illness / fever | ↑ Raises RHR | ~10 bpm/1°F | Immune demand | [AHA](https://www.heart.org/en/news/2019/02/01/8-things-that-can-affect-your-heart-and-what-to-do-about-them) |
| Stress / anxiety | ↑ Raises RHR | Acute and chronic | Cortisol/adrenaline | [Cleveland Clinic](https://health.clevelandclinic.org/how-to-lower-your-resting-heart-rate) |

### Respiratory rate factors (WHOOP-specific signal)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Stress / anxiety | ↑ Rises | Acute increase in rate and shallowness | Sympathetic activation increases respiratory drive | [Polar — Nightly Recharge](https://support.polar.com/us-en/nightly-recharge-recovery-measurement) |
| Pain | ↑ Rises | Acute response | Sympathetic activation changes breathing pattern | [Polar — Vantage V3 Manual](https://support.polar.com/e_manuals/vantage-v3/polar-vantage-v3-user-manual-english/nightly-recharge.htm) |
| Fever / illness | ↑ Rises | Proportional to temperature | Increased metabolic demand requires more oxygen | [Polar — Nightly Recharge](https://support.polar.com/us-en/nightly-recharge-recovery-measurement) |
| Overtraining | ↑ Rises (overnight) | Elevated overnight rate is key overtraining marker | Incomplete recovery leaves sympathetic tone elevated | [WHOOP — Recovery 101](https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/) |
| Caffeine | ↑ Rises | Mild stimulatory effect | CNS stimulation affects respiratory center | [WHOOP — Recovery](https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/) |
| Relaxation / meditation | ↓ Drops | Significant with slow breathing protocols | Parasympathetic activation, vagal tone increase | [Polar — Nightly Recharge](https://support.polar.com/us-en/nightly-recharge-recovery-measurement) |
| Good cardio fitness | ↓ Lower baseline | Proportional to VO2max | Efficient gas exchange needs fewer breaths/min | [WHOOP — Recovery](https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/) |
| Quality sleep | ↓ Lower overnight rate | Reflects parasympathetic dominance | Deep sleep = lowest respiratory rates | [Polar — Nightly Recharge](https://support.polar.com/us-en/nightly-recharge-recovery-measurement) |

### Skin temperature factors

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Acute psychological stress | ↓ Drops (periphery) | Measurable at wrist | Vasoconstriction redirects blood to core | [PMC4664114](https://pmc.ncbi.nlm.nih.gov/articles/PMC4664114/) |
| Exercise | ↑ Rises then drops | Significant | Vasodilation for heat dissipation | [Ultrahuman Blog](https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/) |
| Menstrual cycle | ↑ Rises in luteal phase | ~0.3–0.5°C | Progesterone raises basal temp | [Ultrahuman Blog](https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/) |
| Illness / fever | ↑ Rises | Significant | Immune response | [Ultrahuman Blog](https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/) |
| Alcohol | ↑ Rises (peripheral) | Acute | Vasodilation | [Ultrahuman Blog](https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/) |
| Ambient temperature | ↑↓ Follows environment | Major confounder | Direct external effect | [PMC9690349](https://pmc.ncbi.nlm.nih.gov/articles/PMC9690349/) |
| Sleep onset | ↑ Rises at extremities | Normal circadian | Vasodilation initiates sleep | [Nature (2026)](https://www.nature.com/articles/s41746-026-02633-2) |

### SpO2 factors (WHOOP-specific signal)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Altitude | ↓ Drops | Significant above 5,000 ft | Lower atmospheric O2 reduces hemoglobin saturation | [WHOOP — Recovery](https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/) |
| Sleep apnea | ↓ Drops (overnight dips) | Repeated desaturation events | Airway obstruction causes intermittent hypoxia | [WHOOP — Recovery 101](https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/) |
| Respiratory illness | ↓ Drops | Varies by severity | Impaired gas exchange in lungs | [WHOOP — Recovery](https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/) |
| Smoking | ↓ Drops | Chronic reduction | CO displaces O2 on hemoglobin | [WHOOP — Recovery](https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/) |
| Good cardio fitness | ↑ Stable/high | Maintains 95–100% | Efficient cardiovascular system | [WHOOP — Recovery](https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/) |
| Proper breathing during sleep | ↑ Stable | Fewer desaturation events | Unobstructed airway | [WHOOP — Recovery](https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/) |

---

## Oura Ring (Gen3 / Ring 4)

**Signals used:** HRV, Heart Rate, Skin Temperature, Sleep Metrics
**Algorithm:** 3 layers — Daytime Stress (real-time HRV), Resilience (recovery capacity over time), Cumulative Stress (31-day scan of HRV + sleep + activity signatures). Cumulative Stress developed with University of Southern Denmark (151-participant study, released Nov 2025).
**Scale:** Low / Med / High + trend
**Behavior:** Daytime Stress is continuous. Cumulative Stress is a daily rollup.

### HRV factors (primary driver)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Sleep (7–9 hrs consistent) | ↑ Improves | 15–30% increase within 4 weeks | Parasympathetic dominance restores vagal tone | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Aerobic exercise (150 min/wk) | ↑ Improves | Significant long-term | Enhanced vagal tone | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Meditation / breathwork | ↑ Improves | Acute + chronic | Parasympathetic activation | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Healthy body weight | ↑ Improves | Restores balance | Increases parasympathetic activity | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Hydration | ↑ Improves | Moderate | Reduces cardiac strain | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Cold exposure | ↑ Improves | Acute vagal stimulation | Dive reflex | [Marathon Handbook (2026)](https://marathonhandbook.com/how-to-increase-hrv/) |
| Alcohol | ↓ Worsens | ~2ms/drink; 3+ = 13ms for 2–5 days | Suppresses parasympathetic activity | [Kygo.app (2026)](https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence); [Frontiers 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Sleep deprivation | ↓ Worsens | Significant acute reduction | Sympathetic dominance | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Overtraining | ↓ Worsens | Progressive decline | Suppresses parasympathetic tone | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Chronic stress | ↓ Worsens | Sustained RMSSD reduction | Chronic sympathetic activation | [PMC9974008](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/) |
| Illness | ↓ Worsens | Significant | Immune response activates sympathetic NS | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Excess caffeine | ↓ Worsens | 8–12% in sensitive individuals | Overstimulates sympathetic NS | [PMC11284693](https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/) |

### Heart rate factors

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Cardio fitness | ↓ Lowers RHR | Dose-dependent | Stronger heart | [PMC6306777](https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/) |
| Adequate sleep | ↓ Lowers RHR | Next-day elevation from poor sleep | Sympathetic shift | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Sedentary lifestyle | ↑ Raises RHR | Most common cause | Deconditioned heart | [Hackensack Meridian Health](https://www.hackensackmeridianhealth.org/en/healthier-you/2022/02/24/6-reasons-your-heart-rate-is-high) |
| Caffeine | ↑ Raises RHR | Acute increase | Sympathetic stimulation | [The Heart Foundation](https://theheartfoundation.org/2018/11/02/your-heart-rate/) |
| Alcohol | ↑ Raises RHR | Acute + next-day | Vasodilation compensation | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Heat / dehydration | ↑ Raises RHR | Significant | Thicker blood, thermoregulation | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Illness / fever | ↑ Raises RHR | ~10 bpm/1°F | Immune demand | [AHA](https://www.heart.org/en/news/2019/02/01/8-things-that-can-affect-your-heart-and-what-to-do-about-them) |
| Stress / anxiety | ↑ Raises RHR | Acute and chronic | Cortisol/adrenaline | [Cleveland Clinic](https://health.clevelandclinic.org/how-to-lower-your-resting-heart-rate) |

### Skin temperature factors

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Acute psychological stress | ↓ Drops (periphery) | Measurable at finger | Vasoconstriction redirects blood to core | [PMC4664114](https://pmc.ncbi.nlm.nih.gov/articles/PMC4664114/) |
| Exercise | ↑ Rises then drops | Significant | Vasodilation for heat dissipation | [Ultrahuman Blog](https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/) |
| Menstrual cycle | ↑ Rises in luteal phase | ~0.3–0.5°C (Oura uses this for period prediction) | Progesterone raises basal temp | [Ultrahuman Blog](https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/) |
| Illness / fever | ↑ Rises | Significant | Immune response | [Ultrahuman Blog](https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/) |
| Alcohol | ↑ Rises (peripheral) | Acute | Vasodilation | [Ultrahuman Blog](https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/) |
| Ambient temperature | ↑↓ Follows environment | Major confounder | Direct external effect | [PMC9690349](https://pmc.ncbi.nlm.nih.gov/articles/PMC9690349/) |
| Sleep onset | ↑ Rises at extremities | Normal circadian | Vasodilation initiates sleep | [Nature (2026)](https://www.nature.com/articles/s41746-026-02633-2) |
| Depression / chronic stress | ↑ Higher variability | Positive association | Disrupted autonomic regulation | [ScienceDirect (2025)](https://www.sciencedirect.com/science/article/pii/S2666915325000071) |

### Sleep metric factors (unique Oura emphasis — feeds Cumulative Stress)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Consistent sleep schedule | ↑ Improves all metrics | Significant effect on deep sleep % | Circadian rhythm alignment improves sleep architecture | [Oura Blog — Cumulative Stress (2025)](https://ouraring.com/blog/what-is-cumulative-stress/) |
| Cool bedroom (65–68°F) | ↑ Improves | Increases deep sleep duration | Core temp drop triggers deep sleep initiation | [Oura Blog — Daytime Stress](https://ouraring.com/blog/daytime-stress-feature/) |
| Regular exercise (not late) | ↑ Improves | Increases deep sleep %, reduces latency | Physical fatigue promotes sleep drive; avoid vigorous within 2 hrs of bed | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Alcohol before bed | ↓ Worsens | Reduces deep sleep, increases wake-ups | Disrupts sleep architecture even if onset is faster | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Late caffeine (after 2 PM) | ↓ Worsens | Delays onset, reduces total sleep | Caffeine half-life 5–6 hrs blocks adenosine receptors | [Kygo.app — 44 Factors Ranked](https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence) |
| Late heavy meals | ↓ Worsens | Disrupts sleep quality | Digestion raises core temp and metabolic activity | [Oura Blog — Cumulative Stress](https://ouraring.com/blog/what-is-cumulative-stress/) |
| Screen time before bed | ↓ Worsens | Delays melatonin release | Blue light suppresses melatonin production | [Oura Blog — Cumulative Stress](https://ouraring.com/blog/what-is-cumulative-stress/) |
| Chronic stress / anxiety | ↓ Worsens | Fragmented sleep, less deep sleep | Elevated cortisol disrupts sleep architecture | [Oura — Univ. of Southern Denmark study (2025)](https://ouraring.com/blog/inside-the-ring-cumulative-stress/) |

---

## Apple Watch

**Signals used:** HRV, Heart Rate (NO native stress score as of watchOS 11 — third-party apps only)
**Algorithm:** N/A native. Third-party apps (StressWatch, Livity, StressFace) analyze HRV data.
**Scale:** N/A native
**Note:** Research shows 52–64% accuracy via 30-second ECG readings (University of Waterloo study). No confirmed native stress feature for watchOS 12/26.

### HRV factors (what third-party apps analyze)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Sleep (7–9 hrs consistent) | ↑ Improves | 15–30% increase within 4 weeks | Parasympathetic dominance restores vagal tone | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Aerobic exercise (150 min/wk) | ↑ Improves | Significant long-term | Enhanced vagal tone | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Meditation / breathwork | ↑ Improves | Acute + chronic | Parasympathetic activation | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Healthy body weight | ↑ Improves | Restores balance | Increases parasympathetic activity | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Hydration | ↑ Improves | Moderate | Reduces cardiac strain | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Alcohol | ↓ Worsens | ~2ms/drink; 3+ = 13ms for 2–5 days | Suppresses parasympathetic activity | [Kygo.app (2026)](https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence); [Frontiers 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Sleep deprivation | ↓ Worsens | Significant acute reduction | Sympathetic dominance | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Overtraining | ↓ Worsens | Progressive decline | Suppresses parasympathetic tone | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Chronic stress | ↓ Worsens | Sustained RMSSD reduction | Chronic sympathetic activation | [PMC9974008](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/) |
| Illness | ↓ Worsens | Significant | Immune response | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Excess caffeine | ↓ Worsens | 8–12% in sensitive individuals | Overstimulates sympathetic NS | [PMC11284693](https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/) |

### Heart rate factors

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Cardio fitness | ↓ Lowers RHR | Dose-dependent | Stronger heart | [PMC6306777](https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/) |
| Adequate sleep | ↓ Lowers RHR | Next-day elevation from poor sleep | Sympathetic shift | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Sedentary lifestyle | ↑ Raises RHR | Most common cause | Deconditioned heart | [Hackensack Meridian Health](https://www.hackensackmeridianhealth.org/en/healthier-you/2022/02/24/6-reasons-your-heart-rate-is-high) |
| Caffeine | ↑ Raises RHR | Acute increase | Sympathetic stimulation | [The Heart Foundation](https://theheartfoundation.org/2018/11/02/your-heart-rate/) |
| Alcohol | ↑ Raises RHR | Acute + next-day | Vasodilation compensation | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Heat / dehydration | ↑ Raises RHR | Significant | Thicker blood, thermoregulation | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Illness / fever | ↑ Raises RHR | ~10 bpm/1°F | Immune demand | [AHA](https://www.heart.org/en/news/2019/02/01/8-things-that-can-affect-your-heart-and-what-to-do-about-them) |

---

## COROS

**Signals used:** HRV, Heart Rate
**Algorithm:** Proprietary vs. individual baseline
**Scale:** 0–100
**Behavior:** Measures every 5 min. Focused on endurance athletes.

### HRV factors (primary driver)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Sleep (7–9 hrs consistent) | ↑ Improves | 15–30% increase within 4 weeks | Parasympathetic dominance restores vagal tone | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Aerobic exercise (150 min/wk) | ↑ Improves | Significant long-term | Enhanced vagal tone | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Meditation / breathwork | ↑ Improves | Acute + chronic | Parasympathetic activation | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Healthy body weight | ↑ Improves | Restores balance | Increases parasympathetic activity | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Alcohol | ↓ Worsens | ~2ms/drink; 3+ = 13ms for 2–5 days | Suppresses parasympathetic activity | [Kygo.app (2026)](https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence); [Frontiers 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Sleep deprivation | ↓ Worsens | Significant | Sympathetic dominance | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Overtraining | ↓ Worsens | Progressive decline | Suppresses parasympathetic tone | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Chronic stress | ↓ Worsens | Sustained RMSSD reduction | Chronic sympathetic activation | [PMC9974008](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/) |
| Illness | ↓ Worsens | Significant | Immune response | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Excess caffeine | ↓ Worsens | 8–12% in sensitive individuals | Overstimulates sympathetic NS | [PMC11284693](https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/) |

### Heart rate factors

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Cardio fitness | ↓ Lowers RHR | Dose-dependent | Stronger heart | [PMC6306777](https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/) |
| Adequate sleep | ↓ Lowers RHR | Next-day elevation | Sympathetic shift | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Sedentary lifestyle | ↑ Raises RHR | Most common cause | Deconditioned heart | [Hackensack Meridian Health](https://www.hackensackmeridianhealth.org/en/healthier-you/2022/02/24/6-reasons-your-heart-rate-is-high) |
| Caffeine | ↑ Raises RHR | Acute increase | Sympathetic stimulation | [The Heart Foundation](https://theheartfoundation.org/2018/11/02/your-heart-rate/) |
| Alcohol | ↑ Raises RHR | Acute + next-day | Vasodilation compensation | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Heat / dehydration | ↑ Raises RHR | Significant | Thicker blood, thermoregulation | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |

---

## Amazfit

**Signals used:** HRV, Heart Rate
**Algorithm:** RMSSD + proprietary stress model. Auto-measures every 5 min.
**Scale:** 0–100

### HRV factors (primary driver)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Sleep (7–9 hrs consistent) | ↑ Improves | 15–30% increase within 4 weeks | Parasympathetic dominance restores vagal tone | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Aerobic exercise (150 min/wk) | ↑ Improves | Significant long-term | Enhanced vagal tone | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Meditation / breathwork | ↑ Improves | Acute + chronic | Parasympathetic activation | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Healthy body weight | ↑ Improves | Restores balance | Increases parasympathetic activity | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Alcohol | ↓ Worsens | ~2ms/drink; 3+ = 13ms for 2–5 days | Suppresses parasympathetic activity | [Kygo.app (2026)](https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence); [Frontiers 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Sleep deprivation | ↓ Worsens | Significant | Sympathetic dominance | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Overtraining | ↓ Worsens | Progressive decline | Suppresses parasympathetic tone | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Chronic stress | ↓ Worsens | Sustained RMSSD reduction | Chronic sympathetic activation | [PMC9974008](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/) |
| Illness | ↓ Worsens | Significant | Immune response | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Excess caffeine | ↓ Worsens | 8–12% in sensitive individuals | Overstimulates sympathetic NS | [PMC11284693](https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/) |

### Heart rate factors

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Cardio fitness | ↓ Lowers RHR | Dose-dependent | Stronger heart | [PMC6306777](https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/) |
| Adequate sleep | ↓ Lowers RHR | Next-day elevation | Sympathetic shift | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Sedentary lifestyle | ↑ Raises RHR | Most common cause | Deconditioned heart | [Hackensack Meridian Health](https://www.hackensackmeridianhealth.org/en/healthier-you/2022/02/24/6-reasons-your-heart-rate-is-high) |
| Caffeine | ↑ Raises RHR | Acute increase | Sympathetic stimulation | [The Heart Foundation](https://theheartfoundation.org/2018/11/02/your-heart-rate/) |
| Alcohol | ↑ Raises RHR | Acute + next-day | Vasodilation compensation | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Heat / dehydration | ↑ Raises RHR | Significant | Thicker blood, thermoregulation | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |

---

## Polar

**Signals used:** HRV, Heart Rate, Respiratory Rate (overnight only)
**Algorithm:** Nightly Recharge / ANS Charge — measures first ~4 hrs of sleep using HR + HRV + breathing rate vs. 28-day baseline.
**Scale:** ANS Charge −10 to +10
**Behavior:** Overnight only. Measures recovery from prior day's total stress — no continuous daytime score.

### HRV factors (primary driver — measured during first 4 hrs of sleep)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Sleep (7–9 hrs consistent) | ↑ Improves | 15–30% increase within 4 weeks | Parasympathetic dominance restores vagal tone | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Aerobic exercise (150 min/wk) | ↑ Improves | Significant long-term | Enhanced vagal tone | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Meditation / breathwork | ↑ Improves | Acute + chronic | Parasympathetic activation | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Healthy body weight | ↑ Improves | Restores balance | Increases parasympathetic activity | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Alcohol | ↓ Worsens | ~2ms/drink; 3+ = 13ms for 2–5 days | Suppresses parasympathetic activity | [Kygo.app (2026)](https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence); [Frontiers 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Sleep deprivation | ↓ Worsens | Significant | Sympathetic dominance | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Overtraining | ↓ Worsens | Progressive decline | Suppresses parasympathetic tone | [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| Chronic stress | ↓ Worsens | Sustained RMSSD reduction | Chronic sympathetic activation | [PMC9974008](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/) |
| Illness | ↓ Worsens | Significant | Immune response | [Frontiers in Physiology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| Excess caffeine | ↓ Worsens | 8–12% in sensitive individuals | Overstimulates sympathetic NS | [PMC11284693](https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/) |

### Heart rate factors

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Cardio fitness | ↓ Lowers RHR | Dose-dependent | Stronger heart | [PMC6306777](https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/) |
| Adequate sleep | ↓ Lowers RHR | Next-day elevation | Sympathetic shift | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Sedentary lifestyle | ↑ Raises RHR | Most common cause | Deconditioned heart | [Hackensack Meridian Health](https://www.hackensackmeridianhealth.org/en/healthier-you/2022/02/24/6-reasons-your-heart-rate-is-high) |
| Caffeine | ↑ Raises RHR | Acute increase | Sympathetic stimulation | [The Heart Foundation](https://theheartfoundation.org/2018/11/02/your-heart-rate/) |
| Alcohol | ↑ Raises RHR | Acute + next-day | Vasodilation compensation | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| Heat / dehydration | ↑ Raises RHR | Significant | Thicker blood, thermoregulation | [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |

### Respiratory rate factors (Polar-specific signal — part of ANS Charge)

| Factor | Direction | Magnitude / Effect Size | Mechanism | Source |
|--------|-----------|------------------------|-----------|--------|
| Stress / anxiety (prior day) | ↑ Elevated overnight rate | Acute increase | Sympathetic activation increases respiratory drive | [Polar — Nightly Recharge](https://support.polar.com/us-en/nightly-recharge-recovery-measurement) |
| Pain | ↑ Rises | Acute response | Sympathetic breathing pattern change | [Polar — Vantage V3 Manual](https://support.polar.com/e_manuals/vantage-v3/polar-vantage-v3-user-manual-english/nightly-recharge.htm) |
| Fever / illness | ↑ Rises | Proportional to temperature | Increased metabolic O2 demand | [Polar — Nightly Recharge](https://support.polar.com/us-en/nightly-recharge-recovery-measurement) |
| Overtraining | ↑ Elevated overnight | Key overtraining marker | Incomplete recovery keeps sympathetic elevated | [WHOOP — Recovery](https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/) |
| Caffeine (late intake) | ↑ Rises | Mild stimulatory | CNS stimulation affects respiratory center | [WHOOP — Recovery](https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/) |
| Relaxation / meditation (evening) | ↓ Lower overnight rate | Significant with breathwork | Parasympathetic activation | [Polar — Nightly Recharge](https://support.polar.com/us-en/nightly-recharge-recovery-measurement) |
| Good cardio fitness | ↓ Lower baseline | Proportional to VO2max | Efficient gas exchange | [WHOOP — Recovery](https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/) |
| Quality sleep | ↓ Lower rate | Parasympathetic dominance | Deep sleep = lowest rates | [Polar — Nightly Recharge](https://support.polar.com/us-en/nightly-recharge-recovery-measurement) |

---

## Master Source List

| Source | Citation | Link |
|--------|----------|------|
| Frontiers in Physiology, 2024 | "Update: Factors Influencing Heart Rate Variability — A Narrative Review" | [https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/) |
| [PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) | "Analysis of Heart Rate Variability and Implication of Different Factors on HRV" | [https://pmc.ncbi.nlm.nih.gov/articles/[PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/)/]([PMC8950456](https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/) |
| [PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) | "Factors Affecting Resting Heart Rate in Free-Living Healthy Humans" | [https://pmc.ncbi.nlm.nih.gov/articles/[PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/)/]([PMC9549087](https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/) |
| [PMC6306777](https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/) | "Effects of Exercise on Resting Heart Rate: Systematic Review & Meta-Analysis" | [https://pmc.ncbi.nlm.nih.gov/articles/[PMC6306777](https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/)/]([PMC6306777](https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/) |
| [PMC9974008](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/) | "Systematic Review of HRV as a Measure of Stress in Medical Professionals" | [https://pmc.ncbi.nlm.nih.gov/articles/[PMC9974008](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/)/]([PMC9974008](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/) |
| [PMC11284693](https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/) | "Impact of Caffeine Intake Strategies on HRV during Post-Exercise Recovery" | [https://pmc.ncbi.nlm.nih.gov/articles/[PMC11284693](https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/)/]([PMC11284693](https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/) |
| PMC11439429 | "Heart Rate Variability Measurement and Influencing Factors" | [https://pmc.ncbi.nlm.nih.gov/articles/PMC11439429/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11439429/) |
| [PMC4664114](https://pmc.ncbi.nlm.nih.gov/articles/PMC4664114/) | "Skin Temperature Reveals the Intensity of Acute Stress" | [https://pmc.ncbi.nlm.nih.gov/articles/[PMC4664114](https://pmc.ncbi.nlm.nih.gov/articles/PMC4664114/)/]([PMC4664114](https://pmc.ncbi.nlm.nih.gov/articles/PMC4664114/) |
| [PMC9690349](https://pmc.ncbi.nlm.nih.gov/articles/PMC9690349/) | "Diurnal Nonlinear Recurrence Metrics of Skin Temp" | [https://pmc.ncbi.nlm.nih.gov/articles/[PMC9690349](https://pmc.ncbi.nlm.nih.gov/articles/PMC9690349/)/]([PMC9690349](https://pmc.ncbi.nlm.nih.gov/articles/PMC9690349/) |
| [PMC10575214](https://pmc.ncbi.nlm.nih.gov/articles/PMC10575214/) | "The Five Basic Human Senses Evoke Electrodermal Activity" | [https://pmc.ncbi.nlm.nih.gov/articles/[PMC10575214](https://pmc.ncbi.nlm.nih.gov/articles/PMC10575214/)/]([PMC10575214](https://pmc.ncbi.nlm.nih.gov/articles/PMC10575214/) |
| [Nature (2026)](https://www.nature.com/articles/s41746-026-02633-2) | "Wearable-derived Skin Temperature Dynamics During Sleep" | [https://www.nature.com/articles/s41746-026-02633-2](https://www.nature.com/articles/s41746-026-02633-2) |
| [ScienceDirect (2025)](https://www.sciencedirect.com/science/article/pii/S2666915325000071) | "Electrodermal Activity and Skin Temperature in Stress and Depression" | [https://www.sciencedirect.com/science/article/pii/S2666915325000071](https://www.sciencedirect.com/science/article/pii/S2666915325000071) |
| [Kygo.app (2026)](https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence) | "How to Improve HRV: 44 Factors Ranked by Evidence" | [https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence](https://www.kygo.app/post/how-to-improve-hrv-factors-ranked-by-evidence) |
| [Marathon Handbook (2026)](https://marathonhandbook.com/how-to-increase-hrv/) | "How to Increase HRV: 11 Evidence-Backed Strategies" | [https://marathonhandbook.com/how-to-increase-hrv/](https://marathonhandbook.com/how-to-increase-hrv/) |
| Garmin Support | "What Is the Stress Level Feature on My Garmin Device?" | [https://support.garmin.com/en-US/?faq=WT9BmhjacO4ZpxbCc0EKn9](https://support.garmin.com/en-US/?faq=WT9BmhjacO4ZpxbCc0EKn9) |
| Samsung Developer | "How the Galaxy Watch's EDA Sensor Enhances Your Health Monitoring" | [https://developer.samsung.com/health/blog/en/how-the-galaxy-watchs-eda-sensor-enhances-your-health-monitoring](https://developer.samsung.com/health/blog/en/how-the-galaxy-watchs-eda-sensor-enhances-your-health-monitoring) |
| Google Research | "What Does Electrodermal Sensing Reveal?" | [https://research.google/blog/what-does-electrodermal-sensing-reveal-insights-from-the-pixel-watch-fitbit-sense-2/](https://research.google/blog/what-does-electrodermal-sensing-reveal-insights-from-the-pixel-watch-fitbit-sense-2/) |
| Google Blog | "How We Trained Fitbit's Body Response Feature to Detect Stress" | [https://blog.google/products/fitbit/how-we-trained-fitbits-body-response-feature-to-detect-stress/](https://blog.google/products/fitbit/how-we-trained-fitbits-body-response-feature-to-detect-stress/) |
| WHOOP Support | "Get to Know the Stress Monitor" | [https://support.whoop.com/s/article/Get-to-Know-the-Stress-Monitor](https://support.whoop.com/s/article/Get-to-Know-the-Stress-Monitor) |
| WHOOP Blog | "How Does WHOOP Recovery Work 101" | [https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/](https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/) |
| Oura Blog (2025) | "Introducing Cumulative Stress" | [https://ouraring.com/blog/what-is-cumulative-stress/](https://ouraring.com/blog/what-is-cumulative-stress/) |
| Oura Blog | "Discover Oura's Daytime Stress Feature" | [https://ouraring.com/blog/daytime-stress-feature/](https://ouraring.com/blog/daytime-stress-feature/) |
| Polar Support | "Nightly Recharge Recovery Measurement" | [https://support.polar.com/us-en/nightly-recharge-recovery-measurement](https://support.polar.com/us-en/nightly-recharge-recovery-measurement) |
| COROS Help Center | "Daily Stress" | [https://support.coros.com/hc/en-us/articles/22933434857108-Daily-Stress](https://support.coros.com/hc/en-us/articles/22933434857108-Daily-Stress) |
| Amazfit Support | "What Is Stress Monitoring?" | [https://support.amazfit.com/en/faq/4133](https://support.amazfit.com/en/faq/4133) |
| [AHA](https://www.heart.org/en/news/2019/02/01/8-things-that-can-affect-your-heart-and-what-to-do-about-them) | "8 Things That Can Affect Your Heart" | [https://www.heart.org/en/news/2019/02/01/8-things-that-can-affect-your-heart-and-what-to-do-about-them](https://www.heart.org/en/news/2019/02/01/8-things-that-can-affect-your-heart-and-what-to-do-about-them) |
| [Cleveland Clinic](https://health.clevelandclinic.org/how-to-lower-your-resting-heart-rate) | "High Resting Heart Rate? Here's How to Slow It Down" | [https://health.clevelandclinic.org/how-to-lower-your-resting-heart-rate](https://health.clevelandclinic.org/how-to-lower-your-resting-heart-rate) |
| [Hackensack Meridian Health](https://www.hackensackmeridianhealth.org/en/healthier-you/2022/02/24/6-reasons-your-heart-rate-is-high) | "6 Reasons Your Heart Rate Is High" | [https://www.hackensackmeridianhealth.org/en/healthier-you/2022/02/24/6-reasons-your-heart-rate-is-high](https://www.hackensackmeridianhealth.org/en/healthier-you/2022/02/24/6-reasons-your-heart-rate-is-high) |
| [The Heart Foundation](https://theheartfoundation.org/2018/11/02/your-heart-rate/) | "Your Heart Rate" | [https://theheartfoundation.org/2018/11/02/your-heart-rate/](https://theheartfoundation.org/2018/11/02/your-heart-rate/) |
| Wareable (2026) | "Best Stress Trackers 2026: Long-Term Tests" | [https://www.wareable.com/health-and-wellbeing/stress-monitoring-wearables-explained-7969](https://www.wareable.com/health-and-wellbeing/stress-monitoring-wearables-explained-7969) |
| Wikipedia | "Electrodermal Activity" | [https://en.wikipedia.org/wiki/Electrodermal_activity](https://en.wikipedia.org/wiki/Electrodermal_activity) |
| [EBSCO Research Starters](https://www.ebsco.com/research-starters/health-and-medicine/electrodermal-activity-eda) | "Electrodermal Activity (EDA)" | [https://www.ebsco.com/research-starters/health-and-medicine/electrodermal-activity-eda](https://www.ebsco.com/research-starters/health-and-medicine/electrodermal-activity-eda) |
| [BIOPAC Blog](https://blog.biopac.com/electrodermal-activity-eda/) | "Electrodermal Activity (EDA)" | [https://blog.biopac.com/electrodermal-activity-eda/](https://blog.biopac.com/electrodermal-activity-eda/) |
| [Innsightful](https://www.innsightful.com/electrodermal-activity-eda-the-science-of-skin-conductance-and-emotional-arousal/) | "Science of Skin Conductance and Emotional Arousal" | [https://www.innsightful.com/electrodermal-activity-eda-the-science-of-skin-conductance-and-emotional-arousal/](https://www.innsightful.com/electrodermal-activity-eda-the-science-of-skin-conductance-and-emotional-arousal/) |
| [Noldus Academy](https://academy.noldus.com/courses/getting-started-with-noldushub/lessons/noldushub-parameters/topics/skin-conductance-gsr/) | "Electrodermal Activity" | [https://academy.noldus.com/courses/getting-started-with-noldushub/lessons/noldushub-parameters/topics/skin-conductance-gsr/](https://academy.noldus.com/courses/getting-started-with-noldushub/lessons/noldushub-parameters/topics/skin-conductance-gsr/) |
| U. Birmingham | "Guide for Analysing Electrodermal Activity" | [https://www.birmingham.ac.uk/documents/college-les/psych/saal/guide-electrodermal-activity.pdf](https://www.birmingham.ac.uk/documents/college-les/psych/saal/guide-electrodermal-activity.pdf) |
| [Ultrahuman Blog](https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/) | "Factors Influencing Skin Temperature" | [https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/](https://blog.ultrahuman.com/blog/factors-influencing-skin-temperature/) |
| Amazfit | "What is Heart Rate Variability (HRV)?" | [https://us.amazfit.com/pages/what-is-heart-rate-variability-hrv](https://us.amazfit.com/pages/what-is-heart-rate-variability-hrv) |
| Android Authority | "How Does the Samsung Galaxy Watch Measure Stress?" | [https://www.androidauthority.com/how-does-galaxy-watch-measure-stress-3234828/](https://www.androidauthority.com/how-does-galaxy-watch-measure-stress-3234828/) |
| Garmin | "HRV Stress Test Technology" | [https://www.garmin.com/en-US/garmin-technology/running-science/physiological-measurements/hrv-stress-test/](https://www.garmin.com/en-US/garmin-technology/running-science/physiological-measurements/hrv-stress-test/) |
| Tom's Guide | "Can Your Apple Watch Detect Stress?" | [https://www.tomsguide.com/wellness/smartwatches/can-your-apple-watch-detect-stress-new-study-says-yes](https://www.tomsguide.com/wellness/smartwatches/can-your-apple-watch-detect-stress-new-study-says-yes) |
| Livity (2026) | "How to Track Stress on Apple Watch" | [https://livity-app.com/en/blog/how-to-track-stress-on-apple-watch](https://livity-app.com/en/blog/how-to-track-stress-on-apple-watch) |
| WHOOP 5.0 Review (2026) | "Is It Worth It?" | [https://cybernews.com/health-tech/whoop-review/](https://cybernews.com/health-tech/whoop-review/) |
| Oura | "Inside the Ring: Data-Driven Approach to Quantifying Chronic Stress" | [https://ouraring.com/blog/inside-the-ring-cumulative-stress/](https://ouraring.com/blog/inside-the-ring-cumulative-stress/) |
