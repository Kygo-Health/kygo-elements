# Which Wearable Has the Most Accurate Step Count? A 2024-2025 Research Analysis

**Last Updated: February 15, 2026**

---

**Meta Description:** Which wearable tracks steps most accurately? We analyzed 20+ peer-reviewed studies comparing Garmin, Apple Watch, Fitbit, Oura, WHOOP, and Samsung step count accuracy with full bias disclosure.

**Excerpt:** Garmin leads overall step count accuracy (82.6%), followed by Apple Watch (81.1%) and Fitbit (77.3%). But accuracy depends heavily on walking speed, wear location, and activity type. Here's what the research actually shows.

**URL Slug:** `/step-count-accuracy-wearables-research-2025`

---

Garmin wearables lead overall step count accuracy at 82.6%, with Apple Watch close behind at 81.1% and Fitbit at 77.3%, according to aggregate data from the WellnessPulse Meta-Analysis (2025) and multiple peer-reviewed validation studies. However, these numbers tell only part of the story. Step count accuracy varies dramatically based on walking speed, activity type, and even which arm you swing while walking.


We analyzed over 20 peer-reviewed studies published between 2020 and 2026 to break down exactly how Garmin, Apple Watch, Fitbit, Samsung, Oura Ring, Polar, COROS, and WHOOP perform across different conditions. Below is everything we found—organized by device, with study methodologies and limitations disclosed so you can evaluate the data yourself.


---

## Step Count Accuracy: Master Summary by Device


This table compiles findings across all peer-reviewed studies analyzed. Each device section below includes the full data, study details, and methodology notes.


| Device | Overall Accuracy | MAPE (Lab) | MAPE (Free-Living) | Bias Direction |
|--------|------------------|------------|---------------------|----------------|
| **Garmin** | 🥇 82.6% | 0.6–3.5% | 10–17.8% | Underestimates |
| **Apple Watch** | 🥈 81.1% | 0.9–3.4% | 6.4–10% | Slight underestimate |
| **Fitbit** | 🥉 77.3% | ~5–8% | 10–25% | Mixed |
| Samsung Galaxy Watch | Moderate (r=0.82) | Limited data | Limited data | Overestimates |
| COROS APEX 2 Pro | Good (~98.6% walk) | Limited data | Limited data | Slight underestimate |
| Polar Vantage | Moderate (53.2% meta) | High | Overreports ~3.8% | Overestimates |
| Oura Ring | Poor (50.3% error) | 4.8% controlled | ~25–50% | Overestimates |
| WHOOP | Unknown | No validation | No validation | Unknown |


**Sources:** WellnessPulse Meta-Analysis (2025); AIM7 aggregate data; individual studies cited below.


---

## How Step Counting Actually Works


Before diving into device-specific accuracy, it helps to understand what wearables are actually measuring—and why it's harder than it sounds.


All consumer wearables use variations of the same fundamental approach:


1. **Raw Signal Acquisition:** A 3-axis accelerometer captures acceleration in x, y, and z directions (typically at 25–100 Hz sampling rate)


2. **Signal Preprocessing:** The device computes vector magnitude (√(x² + y² + z²)) to combine all axes into a single value


3. **Noise Filtering:** Low-pass filters (cutoff ~3–10 Hz) remove high-frequency noise; band-pass filters (0.5–3 Hz) isolate the typical human walking cadence range


4. **Step Detection:** Peak detection, zero-crossing, or autocorrelation identifies periodic patterns that match walking


5. **Validation Gate:** Time-window constraints (0.2s–2.0s between steps) filter false positives; minimum-bout thresholds (e.g., 10+ consecutive steps) reduce phantom counts


6. **Post-Processing:** Machine learning classifiers distinguish walking from non-walking activities


The gold standard for validation is manual hand-tally counting in controlled settings, or research-grade hip-worn accelerometers (ActiGraph, ActivPAL) for free-living conditions.


The critical limitation: **wrist-worn devices detect arm swing as a proxy for walking—not actual footfalls.** This creates systematic errors that no algorithm can fully eliminate.


---

## Garmin: Most Accurate Step Counter


**Wear Location:** Wrist

**Sensors:** 3-axis accelerometer (all models); barometric altimeter on some; gyroscope on higher-end models


### Step Count Accuracy by Model


| Model | MAPE | Condition | Source |
|-------|------|-----------|--------|
| Vivoactive 4 | <2% | Exercise testing | Nature Scientific Reports (2024) |
| Vivosmart HR+ | ≤5% (treadmill), ≤10% (free) | All conditions | Roos et al. (2020), PMC |
| Vivosmart | 1.2–3.5% | Three treadmill speeds | Garmin validity review (2020) |
| Forerunner 265 | 0.3% (15 steps off / 5,000) | Walking test | Android Central (2023) |
| Vivofit | 17.8% | Free-living (at home) | Garmin validity review (2020) |


### Why Garmin Wins


Garmin uses a **10-step minimum bout threshold**: the watch does not register any steps until it detects 10+ consecutive step-like patterns. Once confirmed, all 10 are retroactively credited. This dramatically reduces phantom steps from non-walking activities but can miss very short walking bursts (<10 steps).


**Bias direction:** Garmin devices consistently **underestimate** steps on treadmill across most speeds. At very slow speeds (<1.6 km/h), expect significant undercounting (median difference of −49.5 steps over a test bout in one study).


**Known false-step triggers:** Driving (road vibrations), brushing teeth, showering, and vigorous hand gestures can still occasionally trigger counts, but far less frequently than other brands.


**Sources:** Feehan et al. (2020), PeerJ; Roos et al. (2020), PMC; Garmin validity review (2020), PMC


---

## Apple Watch: Best All-Around Consistency


**Wear Location:** Wrist

**Sensors:** 3-axis accelerometer, 3-axis gyroscope, always-on motion coprocessor, GPS


### Step Count Accuracy by Generation


| Model | MAPE | Condition | Source |
|-------|------|-----------|--------|
| Series 6 | 6.4% | Free-living (24h vs ActivPAL) | Kim et al. (2024), Sensors |
| Series 8 | ~81% overall | Meta-analysis aggregate | WellnessPulse (2025) |
| Ultra 2 | Best in 10-watch test | 10,000-step walk/jog | Android Central (Dec 2025) |
| Series 2 | ~18.5% | Mixed conditions | Choe & Kang (2025) meta-analysis |


### MAPE by Activity Type


| Activity | MAPE |
|----------|------|
| Moderate-to-vigorous walking | 3.0% |
| Non-treadmill walking | <10% |
| Treadmill | 10.1% |
| Light-intensity / slow walking | 23.9% |


### Age Affects Apple Watch Accuracy


| Factor | MAPE |
|--------|------|
| Age <40 | 4.3% |
| Age ≥40 | 10.9% |


The Apple Watch achieved **r=0.99 correlation** against ActivPAL reference in a 24-hour free-living study—the highest independent correlation among consumer wearables tested (Kim et al., 2024).


**Key advantage:** Apple's Core Motion framework handles all motion processing on a dedicated low-power coprocessor, combining accelerometer and gyroscope data with ML-enhanced pattern recognition. Over time, Apple Watch calibrates stride length by correlating accelerometer data with GPS during outdoor workouts.


**Sources:** Choe & Kang (2025), Physiological Measurement; Kim et al. (2024), Sensors; npj Digital Medicine (2026)


---

## Fitbit: Most-Studied, Mixed Results


**Wear Location:** Wrist

**Sensors:** MEMS tri-axial accelerometer


### Step Count Accuracy by Model


| Model | MAPE | Condition | Source |
|-------|------|-----------|--------|
| Sense | ~8% | Exercise testing | Nature Scientific Reports (2024) |
| Charge 2 | 3.4% | Clinical validation | Straczkiewicz et al. (2023), JMIR |
| Charge 2 / Alta | 17.1–35.5% | 24-hr free-living | Giurgiu et al. (2023) |
| Charge / Charge HR | <25% | 20 studies (systematic review) | Germini et al. (2022), JMIR |


### The Free-Living Paradox


Fitbit shows a notable pattern: **underestimates in lab conditions, overestimates in free-living conditions.** A systematic review found Fitbit devices meet acceptable accuracy approximately half the time.


**Within-brand variation matters:** The Fitbit Classic tends to overestimate while the Fitbit Charge tends to underestimate—different algorithms produce different biases even within the same brand.


**Ankle placement dramatically improves accuracy:** Fitbit worn at ankle achieved **5.9% error** at 0.4 m/s vs. **48–75% error** for waist-worn devices at the same speed. This suggests the algorithm itself is capable—the wrist placement is the limitation.


**Sources:** Fuller et al. (2020), JMIR (144 Fitbit studies reviewed); Germini et al. (2022), JMIR


---

## Samsung Galaxy Watch: Overcounting Issues


**Wear Location:** Wrist

**Sensors:** Accelerometer + gyroscope (BioActive Sensor on Watch 4+)


### Step Count Accuracy


| Model | Correlation | Condition | Source |
|-------|-------------|-----------|--------|
| Galaxy Watch 4 | r=0.82 vs ActivPAL | 24-hr free-living | Kim et al. (2024) |
| Galaxy Watch 5 | ~2% error | Walking test | Android Central (2025) |


For context: Apple Watch 6 achieved **r=0.99** vs. the same criterion in the same study—Samsung's correlation was notably weaker.


**User-reported issues:** Multiple users report **2,000–3,500+ phantom steps per day** during desk work, driving, and stationary bike workouts. The gyroscope may be overly sensitive to non-walking arm movements, and Samsung's algorithm may not filter false positives as aggressively as Garmin's 10-step gate.


**Source:** Kim et al. (2024), Sensors


---

## Oura Ring: Not a Step Counter


**Wear Location:** Finger

**Sensors:** 3-axis accelerometer, infrared PPG, skin temperature sensor


### The Finger Placement Problem


| Condition | Metric | Value | Source |
|-----------|--------|-------|--------|
| Controlled walking (5,000 steps) | Accuracy | Within 12 steps | Android Central (2023) |
| Laboratory (combined activities) | MAPE | <10% | Kristiansson et al. (2023) |
| Free-living (14 days) | Mean difference | +2,124 ± 4,256 steps | Kristiansson et al. (2023) |
| Real-world aggregate | Error rate | ~50.3% | WellnessPulse (2025) |


In controlled walking conditions, Oura's accuracy is surprisingly good. The problem is everything else.


**Overestimation triggers:** Hand gestures, cooking, chopping, stirring, and any repetitive hand motion that mimics walking cadence can add thousands of phantom steps daily.


**Underestimation triggers:** Pushing a cart or stroller, walking with hands in pockets, or carrying bags with arms still—the ring can't detect steps when your hands aren't moving.


**Oura's own recommendation:** Use Oura for health trends, not step-count parity with wrist devices.


**Sources:** Kristiansson et al. (2023), BMC Medical Research Methodology; Niela-Vilén et al. (2022), Sensors


---

## WHOOP: No Validation Data


**Wear Location:** Wrist, bicep, or body

**Sensors:** 3-axis accelerometer + 3-axis gyroscope


WHOOP only added step counting in **October 2024**. No peer-reviewed validation studies exist.


The hardware (accelerometer + gyroscope) should theoretically enable good accuracy, but without published data, any accuracy claims are anecdotal. User reports suggest overcounting during non-walking activities.


WHOOP intentionally positions Strain (cardiovascular load) as the primary metric, with steps as supplementary. If step count accuracy matters to you, WHOOP isn't the right choice—yet.


---

## Why Walking Speed Matters More Than Device


Walking speed is the single biggest factor affecting step count accuracy across all devices.


| Speed | Typical Accuracy | Notes |
|-------|------------------|-------|
| <0.5 m/s (very slow) | <50% | All devices struggle; ankle placement helps |
| 0.5–0.9 m/s (slow) | 50–80% | Clinical/elderly populations most affected |
| 0.9–1.3 m/s (normal) | >90% | All devices perform acceptably |
| 1.3–1.8 m/s (brisk) | >95% | Sweet spot for wrist-worn accuracy |
| >1.8 m/s (jogging) | >95–99% | Highest cadence = clearest signal |


At very slow walking speeds common in elderly or clinical populations, even the best wrist-worn devices can miss the majority of steps.


---

## Wrist vs. Hip vs. Ankle: Placement Matters


| Placement | Typical Error | Best For |
|-----------|---------------|----------|
| **Ankle** | ~2–6% MAPE | Slow walkers, elderly, clinical |
| **Hip** | ~0.4–5% MAPE | Research-grade measurement |
| **Wrist** | ~5–25% MAPE | Daily convenience |
| **Finger** | ~10–50%+ MAPE | Sleep/HRV (not steps) |


The difference between wrist and hip step counts can range from **30% in young adults to nearly 50% in elderly** subjects.


Wrist-worn devices detect arm swing as a proxy for walking. This means:


- **Overestimation (+10% to +35%):** Animated gestures, cooking, manual work


- **Underestimation (−35% to −95%):** Pushing carts, hands in pockets, carrying bags


---

## How Step Count Accuracy Connects to Understanding Food-Biometric Patterns


Step count data feeds into activity-adjusted calorie estimates, recovery metrics, and daily movement scores across all major wearable platforms. When step counts are inflated by phantom steps or deflated by missed walking, downstream calculations become less reliable.


If you're tracking how nutrition affects your energy levels, sleep quality, or recovery, accurate activity data is part of the foundation. A device that adds 2,000 phantom steps might also overestimate your calorie burn, which affects how you interpret whether a meal timing change actually improved your energy—or if you just moved more that day.


This is one reason [Kygo](https://www.kygo.app) integrates with multiple wearable platforms. Different devices bring different strengths. Garmin may give you the most accurate step counts while Oura gives you the most accurate HRV. Connecting both to nutrition data in one place gives you a more complete picture to work with.


---

## Using Multiple Wearables for Better Data


Many people in the quantified self community wear multiple devices simultaneously—Oura Ring for sleep plus Garmin for steps, or Apple Watch for workouts plus WHOOP for recovery.


The challenge is getting that data to correlate with what you're eating. We wrote a detailed guide on this: [How to Centralize Health Data from Multiple Devices](https://www.kygo.app/post/centralize-health-data-multiple-devices).


If you're specifically interested in how your wearable data compares across different metrics (not just steps), check out: [What's the Most Accurate Wearable Data? A 2024-2025 Study Breakdown by Device](https://www.kygo.app/post/what-s-the-most-accurate-wearable-data-a-2024-2025-study-breakdown-by-device).


---

## Important Caveats


Before drawing conclusions from any of this data:


1. **Lab ≠ Real World.** All devices perform significantly better in controlled settings (MAPE ~5%) than free-living (MAPE >10%). Treat lab-only validation with caution.


2. **Model generation matters.** Most validation studies used older devices. Current-generation devices may perform better, but we can't confirm without updated studies.


3. **Only ~11% of consumer wearables have been validated** for any biometric outcome. The 249 published validation studies represent just 3.5% of what would be needed for comprehensive evaluation.


4. **Steps are a proxy, not a direct measure.** All wearable step counts are algorithmic estimates based on motion patterns. No consumer device directly counts footfalls.


5. **Individual variation is significant.** Gait pattern, arm swing, BMI, age, and walking speed all affect accuracy—published MAPE values are population averages, not individual guarantees.


6. **For clinical or research use, hip-worn research-grade accelerometers remain the standard.** No consumer wrist-worn device matches the accuracy of an ActiGraph or ActivPAL at the hip.


---

## The Bottom Line


If step count accuracy is your priority, Garmin's conservative 10-step gate makes it the most reliable choice for avoiding phantom steps. Apple Watch offers the best all-around consistency with its ML-enhanced Core Motion processing. Fitbit has the most validation research but shows inconsistent results between lab and real-world conditions.


Oura Ring is excellent for sleep and HRV but should not be relied upon for accurate step counting. WHOOP's step feature is too new to evaluate. Samsung Galaxy Watch shows overcounting issues in user reports despite decent hardware.


For most people, the accuracy differences between Garmin, Apple Watch, and Fitbit are smaller than the error introduced by walking speed and arm swing patterns. Focus on consistent daily tracking rather than absolute step count precision.


Ready to see how your activity data connects to your nutrition? [Kygo](https://www.kygo.app) integrates with Oura, Apple Health, Garmin, and Fitbit to help you discover patterns between what you eat and how your body responds. [Download on iOS](https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589) or [join the Android beta](https://www.kygo.app).


---

## Sources


1. **Fuller D, et al. (2020).** "Reliability and Validity of Commercially Available Wearable Devices for Measuring Steps, Energy Expenditure, and Heart Rate: Systematic Review." *JMIR mHealth and uHealth*, 8(9), e18694. DOI: 10.2196/18694


2. **Germini F, et al. (2022).** "Accuracy and Acceptability of Wrist-Wearable Activity-Tracking Devices: Systematic Review of the Literature." *JMIR*, 24(1), e30791. DOI: 10.2196/30791


3. **O'Driscoll R, et al. (2024).** "Keeping Pace with Wearables: A Living Umbrella Review of Systematic Reviews." *Sports Medicine*. DOI: 10.1007/s40279-024-02077-2


4. **Kim Y, et al. (2024).** "Apple Watch 6 vs. Galaxy Watch 4: A Validity Study of Step-Count Estimation." *Sensors*, 24(14), 4658. DOI: 10.3390/s24144658


5. **Kristiansson E, et al. (2023).** "Validation of Oura ring energy expenditure and steps in laboratory and free-living." *BMC Medical Research Methodology*, 23, 50. DOI: 10.1186/s12874-023-01868-x


6. **Choe S & Kang M (2025).** "Apple Watch accuracy in monitoring health metrics: a systematic review and meta-analysis." *Physiological Measurement.*


7. **npj Digital Medicine (2026).** "The accuracy of Apple Watch measurements: a living systematic review and meta-analysis." DOI: 10.1038/s41746-025-02238-1


8. **Roos L, et al. (2020).** "Step Count Reliability and Validity of Five Wearable Technology Devices." *Int J Environ Res Public Health*, 17(20), 7123. DOI: 10.3390/ijerph17207123


9. **Feehan LM, et al. (2020).** "The validity of activity trackers is affected by walking speed." *PeerJ.* DOI: 10.7717/peerj.9381


10. **Nature Scientific Reports (2024).** "Accuracy of smartwatches for the remote assessment of exercise capacity." DOI: 10.1038/s41598-024-74140-x


11. **WellnessPulse Meta-Analysis (2025).** Accuracy of Fitness Trackers — Aggregate data


---

**Disclaimer:** Kygo Health LLC is a personal data aggregation and insights platform designed for informational purposes only. The information provided by Kygo, including correlations, patterns, and trends identified in your data, does not constitute medical advice, diagnosis, or treatment. Always consult a licensed healthcare provider with any questions regarding medical conditions.


---

*Have data on step count accuracy we should include? Reach out at [Ryan@kygo.app](mailto:Ryan@kygo.app).*
