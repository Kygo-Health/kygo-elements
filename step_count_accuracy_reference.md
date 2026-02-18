# Wearable Step Count Accuracy — Complete Data Reference

## MASTER SUMMARY TABLE

| Device | Overall Accuracy | MAPE (Lab) | MAPE (Free-Living) | Bias Direction | Wear Location |
|---|---|---|---|---|---|
| Garmin (Forerunner/Vivoactive) | 🥇 82.6% | 0.6–3.5% | 10–17.8% | Underestimates | Wrist |
| Apple Watch (Series 6+) | 🥈 81.1% | 0.9–3.4% | 6.4–10% | Slight underestimate | Wrist |
| Samsung Galaxy Watch 4 | Moderate (r=0.82) | Limited data | Limited data | Overestimates (user reports) | Wrist |
| Fitbit (Charge/Sense) | 🥉 77.3% | ~5–8% | 10–25% | Mixed (lab: under, free-living: over) | Wrist |
| COROS APEX 2 Pro | Good (~98.6% walk test) | Limited data | Limited data | Slight underestimate | Wrist |
| Polar Vantage | Moderate (53.2% meta) | High MAPE | Overreports ~3.8% | Overestimates | Wrist |
| Oura Ring Gen 3 | Poor (50.3% error real-world) | 4.8% controlled | ~25–50% | Overestimates (hand gestures) | Finger |
| WHOOP 4.0/5.0 | Limited data (new feature) | No published validation | No published validation | Unknown | Wrist |

**Sources:** WellnessPulse Meta-Analysis (2025); AIM7 aggregate data; individual studies cited below.

---

## TECHNICAL & ALGORITHMIC APPROACHES

### How Step Counting Works — General Pipeline

All consumer wearables use variations of the same fundamental approach:

1. **Raw Signal Acquisition:** 3-axis MEMS accelerometer captures acceleration in x, y, z directions (typically at 25–100 Hz sampling rate)
2. **Signal Preprocessing:** Compute vector magnitude (√(x² + y² + z²)) or sum of absolute values
3. **Noise Filtering:** Low-pass filter (cutoff ~3–10 Hz) removes high-frequency noise; band-pass filter (0.5–3 Hz) isolates walking cadence range
4. **Step Detection:** Peak detection, zero-crossing, or autocorrelation identifies periodic patterns
5. **Validation Gate:** Time-window constraint (0.2s–2.0s between steps) filters false positives; minimum-bout threshold (e.g., 10+ consecutive steps) reduces phantom counts
6. **Post-Processing:** Machine learning classifiers distinguish walking from non-walking activities

**Gold Standard:** Manual hand-tally count (controlled), or research-grade hip-worn accelerometers (ActiGraph, ActivPAL) for free-living

---

### Algorithm Approaches by Device

| Device | Sensors Used | Algorithm Type | Key Differentiators |
|---|---|---|---|
| **Apple Watch** | 3-axis accelerometer + gyroscope + Core Motion coprocessor | ML-enhanced peak detection via Core Motion framework | High dynamic range gyroscope (Ultra); GPS-calibrated stride length; arm-swing pattern recognition with rotation data; always-on motion coprocessor offloads CPU |
| **Garmin** | 3-axis accelerometer | Threshold-based peak detection with 10-step minimum bout filter | Move IQ auto-classifies activity type; proprietary cadence/amplitude thresholds; conservative false-positive filtering (10-step gate before counting begins) |
| **Fitbit** | MEMS tri-axial accelerometer | Peak detection + proprietary ML model | Early pioneer (MEMS tri-axial since Fitbit Ultra); frequency/amplitude/bout-pattern analysis; per-model algorithm tuning |
| **Samsung Galaxy Watch** | Accelerometer + gyroscope (BioActive Sensor) | Samsung Health algorithm | Gyroscope aids activity classification; Samsung Health fusion with phone step data |
| **Oura Ring** | 3-axis accelerometer (finger-worn) | ML model for step classification | Finger placement detects hand motion as proxy for steps; thermal + motion + pulse wave fusion; ML model decides what counts as a step vs. gesture |
| **Polar** | 3-axis accelerometer | Proprietary peak detection | Internal motion sensor tracks wrist acceleration; known sensitivity to non-walking movements |
| **COROS** | 3-axis accelerometer + barometric altimeter | Peak detection with continuous-motion filter | Requires continuous arm movement to trigger counting; filters out brief stops; barometric data assists stair/elevation detection |
| **WHOOP** | 3-axis accelerometer + 3-axis gyroscope | New algorithm (Oct 2024) | Step tracking added Oct 2024; combines accelerometer cadence with gyroscope rotational data; no published validation yet |

**Source:** Analog Devices AN-2554; Apple Core Motion documentation; Garmin Support; COROS Help Center; Oura Support; WHOOP Support

---

### Algorithm Categories Explained

**1. Peak Detection (Most Common)**
The standard approach: compute acceleration magnitude, apply low-pass filter, identify peaks that exceed a dynamic threshold within a valid time window (0.2–2.0s). Computationally lightweight, runs on low-power microcontrollers. Accuracy: >97% with windowed peak detection in controlled walking.
- **Used by:** Garmin, Fitbit, Polar, COROS (base algorithm)

**2. Machine Learning–Enhanced Detection**
Activity classification model first identifies walking vs. non-walking periods, then applies peak detection only during walking epochs. Reduces false positives from non-locomotor movements. The hybrid SSL + peak detection approach achieved 12.5% MAPE and only 1.3% step underestimation during free living.
- **Used by:** Apple Watch (Core Motion ML), Oura Ring (ML step classifier)
- **Source:** Small et al. (2024), PMC. Self-supervised ML for step counting from wrist accelerometers in UK Biobank.

**3. Deep Learning (End-to-End)**
Neural networks trained directly on accelerometer data to predict step counts without explicit peak detection. Best models achieved 96–99% accuracy (generalization) and 98–99% (personalization). However, performance dropped to ~60% when using accelerometer-only data (no gyroscope), limiting applicability for battery-constrained devices.
- **Source:** Oner et al. (2022), Sensors. DOI: 10.3390/s22113989

**4. Zero-Crossing Detection**
Counts the number of times the acceleration signal crosses a baseline (zero or gravity-corrected) value. Simpler than peak detection but less robust to noise. Used in earlier/simpler pedometers.

**5. Autocorrelation Analysis**
Identifies periodic patterns in the acceleration signal by computing the signal's correlation with time-shifted copies of itself. Good at detecting cadence even in noisy signals, but more computationally intensive.

---

## DETAILED DATA BY DEVICE

---

### 1. APPLE WATCH

**Wear Location:** Wrist (dominant or non-dominant)
**Sensors:** 3-axis accelerometer, 3-axis gyroscope, always-on motion coprocessor, GPS

#### Step Count Accuracy by Generation

| Model | MAPE (Steps) | Condition | Bias Direction | Source |
|---|---|---|---|---|
| Series 2 | ~18.5% | Mixed | Overestimates at slow speeds, underestimates jogging | Choe & Kang (2025) meta-analysis |
| Series 6 | 6.4% | Free-living (24h vs ActivPAL) | r=0.99 vs criterion | Kim et al. (2024), Sensors |
| Series 7 | <7% avg error | Controlled walking | Slight underestimate | Multiple studies |
| Series 8 | ~81% overall accuracy | Meta-analysis aggregate | Slight underestimate at normal pace | WellnessPulse (2025) |
| Ultra 2 | Best in 10-watch test (2025) | 10,000-step walk/jog | Most consistent results | Android Central (Dec 2025) |

#### MAPE by Activity Type (All Generations Pooled)

| Activity | MAPE |
|---|---|
| Moderate-to-vigorous walking | 3.0% |
| Non-treadmill walking | <10% |
| Treadmill | 10.1% |
| Light-intensity / slow walking | 23.9% |

#### MAPE by Demographics

| Factor | MAPE |
|---|---|
| Age <40 | 4.3% |
| Age ≥40 | 10.9% |

#### Bias by Walking Speed (Series 1-era, Penn State)

| Speed | Relative Error | Direction |
|---|---|---|
| Slow pace | −2.6% | Overestimates |
| Moderate pace | −0.9% | Overestimates |
| Brisk pace | −1.6% | Overestimates |
| Jogging pace | +3.4% | Underestimates |
| Overall (all speeds) | 0.034% total error | Near-perfect |

**Source:** Tracking Steps on Apple Watch at Different Walking Speeds, PMC (2018). DOI: 10.1177/2055207618770555

#### Living Systematic Review (npj Digital Medicine, Jan 2026)

A comprehensive review covering Series 1 through Series 9 and Ultra 2 found that all six studies calculating step-count MAPE reported values of 20% or higher in at least one test condition. Overall MAPE ranged from 9.71% (running) to 151.66% (very slow walking). No clear improvement trend across generations was observed for step counting specifically.

**Source:** "The accuracy of Apple Watch measurements: a living systematic review and meta-analysis." *npj Digital Medicine* (2026). DOI: 10.1038/s41746-025-02238-1

#### Key Technical Notes
- **High Dynamic Range Gyroscope** (Ultra/Ultra 2): Provides finer rotational data, improving step detection during varied activities
- **GPS Calibration:** Over time, Apple Watch calibrates stride length by correlating accelerometer data with GPS during outdoor workouts — improving distance estimation from step counts
- **Core Motion Framework:** Handles all motion processing on a dedicated low-power coprocessor, enabling 24/7 tracking without significant battery drain
- **Known Issue:** Some users report phantom steps during driving or desk work, though newer models have improved filtering

**Sources:**
- Choe & Kang (2025). "Apple Watch accuracy in monitoring health metrics." *Physiological Measurement.*
- Kim et al. (2024). "Apple Watch 6 vs. Galaxy Watch 4." *Sensors*, 24(14), 4658. DOI: 10.3390/s24144658
- Apple Developer Documentation: Core Motion Framework

---

### 2. GARMIN

**Wear Location:** Wrist (dominant or non-dominant)
**Sensors:** 3-axis accelerometer (all models); some models add barometric altimeter; higher-end models add gyroscope

#### Step Count Accuracy by Model

| Model | MAPE (Steps) | Condition | Validity | Source |
|---|---|---|---|---|
| Vivosmart HR | 0.61–1.27% | Treadmill (3.2–4.8 km/h) | ✅ Valid | Feehan et al. (2020), PubMed |
| Vivosmart HR | −49.5 steps median diff | Treadmill (1.6 km/h) | ⚠️ Undercounts at slow speeds | Feehan et al. (2020) |
| Vivosmart HR+ | ≤5% (treadmill), ≤10% (free motion) | All conditions | ✅ Valid & Reliable | Roos et al. (2020), PMC |
| Vivosmart | 1.2–3.5% | Three treadmill speeds | ✅ Acceptable | Garmin validity review (2020), PMC |
| Vivoactive 4 | <2% MAPE | Exercise testing | ✅ Excellent | Nature Scientific Reports (2024) |
| Vivofit | Acceptable (varied surfaces) | Natural lawn, gravel, asphalt, etc. | ✅ Surface-independent | Garmin validity review (2020) |
| Vivofit | 17.8% MAPE | Free-living (at home) | ⚠️ Higher error | Garmin validity review (2020) |
| Forerunner 920XT | Good–Excellent CC | Treadmill | ✅ Good | Garmin validity review (2020) |
| Forerunner 265 | 15 steps off / 5,000 | Walking test | ✅ Excellent | Android Central (2023) |

#### Bias Direction
- **General pattern:** Garmin devices tend to **underestimate** steps on treadmill across most speeds
- **Exception:** May overcount during incline walking
- **Slow speeds (<1.6 km/h):** Significant undercounting (median difference of −49.5 steps over a test bout)
- **Normal-to-brisk walking:** Excellent accuracy (<2% error)

#### False Step Filtering
Garmin uses a **10-step minimum bout** threshold: the watch does not register any steps until it detects 10+ consecutive step-like patterns. Once confirmed, all 10 are retroactively credited. This dramatically reduces phantom steps from non-walking activities but can miss very short walking bursts (<10 steps).

**Known false-step triggers:** Driving (road vibrations), brushing teeth, showering, crocheting, vigorous hand gestures.

#### Key Technical Notes
- **Move IQ:** Automatically classifies activity type (walking, running, cycling, swimming) in the background; separate from step counting but informs activity logging
- **No gyroscope on entry-level models:** Vivofit, Vivosmart, and some older Forerunners rely on accelerometer only, which limits activity classification accuracy
- **Surface independence:** Validated across natural lawn, gravel, linoleum, asphalt, and ceramic tile with acceptable MAPE on all

**Sources:**
- Feehan LM, et al. (2020). "The validity of activity trackers is affected by walking speed." *PeerJ.* DOI: 10.7717/peerj.9381
- Roos L, et al. (2020). "Step Count Reliability and Validity of Five Wearable Technology Devices." *PMC.* DOI: 10.3390/ijerph17207123
- Garmin validity review (2020). *PMC.* DOI: 10.3390/ijerph17134269

---

### 3. FITBIT

**Wear Location:** Wrist (all current models)
**Sensors:** MEMS tri-axial accelerometer

#### Step Count Accuracy by Model

| Model | MAPE (Steps) | Condition | Bias Direction | Source |
|---|---|---|---|---|
| Fitbit Ultra | Best of 4 devices tested | Controlled gait | — | Early validation study |
| Fitbit Charge / Charge HR | <25% MAPE | 20 studies (systematic review) | Mixed | Germini et al. (2022), JMIR |
| Fitbit Charge 2 | 3.4% difference vs. open-source algo | Clinical validation | Slight undercount | Straczkiewicz et al. (2023), JMIR Cancer |
| Fitbit Charge 2 | 17.1–35.5% MAPE | 24-hr free-living | Higher in free-living | Giurgiu et al. (2023) |
| Fitbit Alta | 17.1–35.5% MAPE | 24-hr free-living | Higher in free-living | Giurgiu et al. (2023) |
| Fitbit Sense | ~8% MAPE | Exercise testing | Moderate | Nature Scientific Reports (2024) |
| Fitbit Classic | — | — | Overestimates | Fuller et al. (2020), JMIR |
| Fitbit Charge | — | — | Underestimates | Fuller et al. (2020), JMIR |
| Fitbit ChargeHR | — | Pediatric (children with disability) | Overestimates daily count | PubMed (2025) |

#### Bias Direction Summary
- **Lab/controlled settings:** Fitbit devices tend to **underestimate** steps
- **Free-living settings:** Fitbit devices tend to **overestimate** steps
- **Systematic review finding:** "Consistent evidence indicated that Fitbit devices were likely to meet acceptable accuracy for step count approximately half the time"
- **Within-brand variation:** The Fitbit Classic tended to overestimate, while the Fitbit Charge tended to underestimate — algorithm differences between models matter

#### Key Technical Notes
- **Most-studied brand:** 144 validation studies examining 12 models (as of 2020 JMIR review) — more than any other wearable
- **MEMS Accelerometer Pioneer:** Fitbit was among the first to use MEMS tri-axial accelerometers in consumer fitness trackers
- **Algorithm evolution:** Early models used simpler peak detection; newer models (Sense, Charge 5+) incorporate more sophisticated ML-based classification via Google/Fitbit merger
- **Ankle placement dramatically improves accuracy:** Fitbit worn at ankle achieved 5.9% error at 0.4 m/s vs. 48–75% error when waist-worn at same speed

**Sources:**
- Fuller D, et al. (2020). "Reliability and Validity of Commercially Available Wearable Devices." *JMIR mHealth and uHealth*, 8(9), e18694. DOI: 10.2196/18694
- Germini F, et al. (2022). "Accuracy and Acceptability of Wrist-Wearable Activity-Tracking Devices." *JMIR*, 24(1), e30791. DOI: 10.2196/30791
- Straczkiewicz M, et al. (2023). "Open-Source Step-Counting Algorithm." *JMIR Cancer.* DOI: 10.2196/47646

---

### 4. SAMSUNG GALAXY WATCH

**Wear Location:** Wrist
**Sensors:** Accelerometer + gyroscope (BioActive Sensor on Watch 4+)

#### Step Count Accuracy

| Model | Correlation (r) vs Criterion | MAPE | Condition | Source |
|---|---|---|---|---|
| Galaxy Watch 4 | r=0.82 (vs ActivPAL) | — | 24-hr free-living | Kim et al. (2024), Sensors |
| Galaxy Watch 5 | ~200 steps off / 10,000 | ~2% | Walking test | Android Central (2025) |
| Galaxy Watch 7 | User-reported overcounting | — | Daily wear | Tom's Guide (2024); Samsung Community |

**Comparison:** Apple Watch 6 achieved r=0.99 vs. the same criterion in the same study, meaning Samsung's correlation was notably weaker.

#### Bias Direction
- **General pattern:** Samsung Galaxy Watch tends to **overestimate** step counts
- **User reports:** Multiple users report 2,000–3,500+ phantom steps per day during desk work, driving, and stationary bike workouts
- **Possible cause:** Gyroscope sensitivity to non-walking arm movements; algorithm may not filter false positives as aggressively as Garmin's 10-step gate

#### Key Technical Notes
- **BioActive Sensor:** Watch 4+ integrates accelerometer, gyroscope, optical HR, and bioelectrical impedance in one chip — but step counting still primarily relies on accelerometer
- **Samsung Health fusion:** Can combine phone and watch step data, which may introduce discrepancies
- **Limited independent validation:** Fewer published step count validation studies compared to Apple Watch, Garmin, or Fitbit

**Source:** Kim et al. (2024). "Apple Watch 6 vs. Galaxy Watch 4." *Sensors*, 24(14), 4658. DOI: 10.3390/s24144658

---

### 5. OURA RING

**Wear Location:** Finger (index finger recommended for best accuracy)
**Sensors:** 3-axis accelerometer, infrared PPG, skin temperature sensor

#### Step Count Accuracy

| Condition | Metric | Value | Source |
|---|---|---|---|
| Laboratory (combined activities) | MAPE | <10% (acceptable) | Kristiansson et al. (2023), BMC |
| Free-living (14 days) | MAPE | <10% (acceptable) | Kristiansson et al. (2023), BMC |
| Free-living (14 days) | Mean difference vs pedometer | +2,124 ± 4,256 steps (overestimates) | Kristiansson et al. (2023), BMC |
| Free-living (14 days) | Correlation vs reference monitors | r ≥ 0.76 | Kristiansson et al. (2023), BMC |
| Controlled walking (5,000 steps) | Accuracy | Within 12 steps | Android Central (2023) |
| Real-world aggregate | Error rate | ~50.3% | WellnessPulse / AIM7 (2025) |

#### The Finger Placement Problem

Oura Ring's step counting is fundamentally limited by its wear location:

**Overestimation triggers:**
- Hand gestures, talking with hands
- Cooking, chopping, stirring
- Typing (in some cases)
- Any repetitive hand motion that mimics walking cadence

**Underestimation triggers:**
- Pushing a cart, stroller, or lawnmower (hands stationary)
- Walking with hands in pockets
- Carrying bags with arms still
- Short walking bursts (<10 steps) — ML filter may reject them

**"Phantom steps" issue:** Multiple user reports and journalist tests confirm the Oura Ring can add thousands of phantom steps daily from non-walking hand activity — a problem far less prevalent in wrist-worn devices.

#### Key Technical Notes
- **ML step classifier:** Oura uses a machine learning model (not simple peak detection) to decide what counts as a step — more sophisticated but still limited by finger-only input
- **Oura's own recommendation:** Use Oura for health trends, not step-count parity with wrist devices
- **Gen 3 vs Gen 4:** No published data on whether Gen 4 improved step accuracy; most validation is on Gen 2/3
- **Correlation with pedometer is decent (r=0.76+) but absolute error is high** — it tracks trends but daily totals can be significantly off

**Sources:**
- Kristiansson E, et al. (2023). "Validation of Oura ring energy expenditure and steps in laboratory and free-living." *BMC Medical Research Methodology*, 23, 50. DOI: 10.1186/s12874-023-01868-x
- Niela-Vilén H, et al. (2022). "Comparison of Oura Smart Ring Against ActiGraph Accelerometer." *ResearchGate.* DOI: 10.3390/s22072585

---

### 6. POLAR

**Wear Location:** Wrist
**Sensors:** 3-axis accelerometer

#### Step Count Accuracy

| Model | Metric | Value | Condition | Source |
|---|---|---|---|---|
| Polar A360 | ICC | 0.78 | Treadmill jog only | Roos et al. (2020), PMC |
| Polar A360 | Validity | Not valid for any condition | Walking & jogging | Roos et al. (2020), PMC |
| Polar Vantage | MAPE | High (not specified) | Free-living | Henriksen et al. (2022), JMIR |
| Polar Vantage | Bias | Overreports steps | Bland-Altman analysis | Henriksen et al. (2022), JMIR |
| Polar Vantage M3 | % Error | +3.8% (379 extra steps / 10,000) | Walking test | TechRadar (Jan 2025) |
| Polar (10-watch test) | — | Mid-pack | 10,000-step test | Android Central (Dec 2025) |

#### Bias Direction
- **Consistent overestimation:** Both peer-reviewed studies and consumer tests show Polar watches add extra steps
- **Likely cause:** High sensitivity to wrist movements; less aggressive false-positive filtering than Garmin

#### Key Technical Notes
- **Best known for heart rate,** not step counting — Polar's heritage is in chest strap HR monitors
- **Step tracking is secondary** to their HR/training load focus
- **Cannot replace research-grade accelerometers** for step measurement per Henriksen et al.

**Sources:**
- Henriksen A, et al. (2022). "Polar Vantage and Oura Physical Activity and Sleep Trackers." *JMIR Formative Research*, 6(5), e27248.
- Roos L, et al. (2020), PMC. DOI: 10.3390/ijerph17207123

---

### 7. COROS

**Wear Location:** Wrist
**Sensors:** 3-axis accelerometer + barometric altimeter

#### Step Count Accuracy

| Model | Metric | Value | Condition | Source |
|---|---|---|---|---|
| COROS APEX 2 Pro | Steps off / 5,000 | 81 steps (1.6%) | Walking test | Android Central (2023) |
| COROS APEX 2 Pro | Running accuracy | Very accurate (near-exact) | Running test | Android Central (2023) |
| COROS (10-watch test) | — | Within acceptable range | 10,000-step test | Android Central (Dec 2025) |

#### Key Technical Notes
- **Continuous motion requirement:** COROS requires regular, continuous arm movements to trigger step counting — brief stops cause filtering
- **Strong for runners:** Like Garmin, COROS optimizes for running cadence detection
- **Limited peer-reviewed validation:** No published MAPE or Bland-Altman analysis found for step counting specifically
- **Barometric altimeter** adds stair/elevation detection but doesn't directly improve flat-ground step accuracy

**Source:** Android Central consumer testing (2023, 2025)

---

### 8. WHOOP

**Wear Location:** Wrist, bicep, or body (clothing)
**Sensors:** 3-axis accelerometer + 3-axis gyroscope

#### Step Count Accuracy

| Metric | Value | Source |
|---|---|---|
| Published validation studies | **None** | — |
| Step tracking launch date | October 10, 2024 | WHOOP blog |
| Algorithm basis | Accelerometer cadence + gyroscope rotation | WHOOP Support |
| Independent testing | No peer-reviewed data | — |

#### Key Context
- **Newest step tracker on this list:** WHOOP only added step counting in October 2024 — it was intentionally excluded for years because WHOOP considered steps a poor proxy for cardiovascular fitness
- **No hardware change required:** Step counting was enabled via firmware/software update on existing WHOOP 4.0 hardware
- **WHOOP 5.0/MG:** New hardware (launched 2024/2025) uses a "new algorithm" per WHOOP community, but no validation data exists
- **User reports of overcounting:** Some users report inflated counts during non-walking activities (driving, desk work)
- **Philosophical difference:** WHOOP positions Strain (cardiovascular load) as the primary metric, with steps as supplementary

**Source:** WHOOP blog (Oct 2024); WHOOP Community forums; WHOOP Support

---

## WEAR LOCATION COMPARISON

### Accuracy by Body Placement

| Placement | Accuracy Ranking | Typical Error | Best For | Limitations |
|---|---|---|---|---|
| **Ankle/Foot** | 🥇 Most accurate | ~2–6% MAPE | Slow walkers, elderly, clinical | Socially impractical; limited product options |
| **Hip/Waist** | 🥈 Very accurate | ~0.4–5% MAPE | Research-grade measurement | Less convenient; users forget to wear |
| **Wrist** | 🥉 Moderate | ~5–25% MAPE | Daily convenience, 24/7 wear | Overestimates from arm gestures; underestimates when arms stationary |
| **Finger** | 4th | ~10–50%+ MAPE | Sleep/HRV tracking (not steps) | Phantom steps from hand gestures; misses steps when hands still |

**Key finding:** The difference between wrist and hip step counts can range from **30% in young adults to nearly 50% in elderly** subjects.

### Why Wrist Placement is Problematic

Wrist-worn devices detect **arm swing** as a proxy for walking — not actual footfalls. This creates systematic errors:

**Overestimation scenarios (+10% to +35%):**
- Animated hand gestures while talking
- Cooking, cleaning, or other manual work
- Clapping, drumming, or repetitive hand motions

**Underestimation scenarios (−35% to −95%):**
- Pushing a shopping cart, stroller, or wheelchair
- Walking with hands in pockets
- Carrying bags or holding objects with arms still
- Walking while holding handrails (treadmill, stairs)

### Why Ankle Placement Works Better

The ankle experiences **greater acceleration during the swing phase** of gait, producing a cleaner, higher-amplitude signal that is easier for algorithms to detect — even at very slow walking speeds.

At 0.4 m/s: ankle-worn Fitbit achieved **5.9% error** vs. **48–75% error** for waist-worn devices.

**Sources:**
- Comparison of Step Count, Wrist- and Hip-Worn Actigraph GT3X. *Frontiers in Medicine* (2019).
- Capturing step counts at slow walking speeds. *Journal of Rehabilitation Medicine* (2015).
- CDC Prevention of Chronic Disease (2022).

---

## OVERESTIMATION vs. UNDERESTIMATION PATTERNS

### Systematic Bias by Condition

| Condition | Bias Direction | Magnitude | Most Affected Devices |
|---|---|---|---|
| Slow walking (<0.9 m/s) | **Underestimates** | Up to 74% missed steps | All wrist/hip devices |
| Very slow walking (<0.5 m/s) | **Severe underestimate** | Up to 100% missed | Waist-worn worst; ankle best |
| Normal walking (3–5 km/h) | **Near-accurate** | <5% error typical | All devices perform well |
| Brisk walking / jogging | **Near-accurate to slight underestimate** | <3% error typical | Apple Watch, Garmin best |
| Free-living (mixed activities) | **Overestimates** | +10–35% | Wrist-worn devices |
| Stationary (desk work, driving) | **Phantom steps (false positives)** | 500–3,500+ per day | Oura (worst), Samsung, Polar |
| Arms stationary while walking | **Underestimates** | −35% to −95% | All wrist-worn devices |
| Elderly / clinical populations | **Underestimates** | −40% to −160% (hip-worn) | All devices at slow gait speeds |
| Stair climbing | **Underestimates** | Significant | Wrist > hip > ankle (worst to best) |

### Bias Direction by Brand (Summary)

| Device | Lab Bias | Free-Living Bias | Dominant Pattern |
|---|---|---|---|
| Apple Watch | Slight overestimate at slow speeds; slight underestimate jogging | Slight underestimate overall | Generally accurate |
| Garmin | Underestimates on treadmill | Moderate underestimate | Conservative (undercounts) |
| Fitbit | Underestimates in lab | Overestimates in free-living | Context-dependent |
| Samsung | Limited lab data | Overestimates (user reports) | Tends to overcount |
| Oura Ring | Acceptable in controlled walk | Large overestimate (+2,124 steps avg) | Overcounts significantly |
| Polar | — | Overestimates (+3.8%) | Consistent overcount |
| WHOOP | No data | User-reported overcounting | Insufficient data |

**Source:** Fuller et al. (2020), JMIR; Germini et al. (2022), JMIR; Kristiansson et al. (2023), BMC; multiple studies cited above.

---

## FACTORS AFFECTING ACCURACY

### Walking Speed (Most Important Factor)

| Speed | Accuracy | Notes |
|---|---|---|
| <0.5 m/s (very slow / shuffling) | Very poor (<50% in some cases) | Wrist/hip devices miss most steps; ankle placement helps |
| 0.5–0.9 m/s (slow walking) | Poor to moderate (50–80%) | Clinical populations most affected |
| 0.9–1.3 m/s (normal walking) | Good (>90%) | All devices perform acceptably |
| 1.3–1.8 m/s (brisk walking) | Excellent (>95%) | Sweet spot for wrist-worn accuracy |
| >1.8 m/s (jogging/running) | Excellent (>95–99%) | Highest cadence = clearest signal |

### Other Factors

| Factor | Effect on Accuracy | Details |
|---|---|---|
| **Arm swing** | Critical for wrist-worn | Restricted arm swing → undercounting; exaggerated swing → overcounting |
| **Device fit** | Moderate | Loose band = more noise = more false positives |
| **Surface type** | Minimal (for Garmin) | Validated across lawn, gravel, asphalt, tile |
| **Incline** | May cause overcounting | Garmin shown to overcount on incline |
| **BMI** | Moderate | Higher BMI may alter gait pattern, affecting detection |
| **Age** | Significant | Apple Watch MAPE: 4.3% (<40 yrs) vs 10.9% (≥40 yrs) |
| **Gait pathology** | Severe | Algorithms trained on healthy gait detect only 11–47% of steps in neurological conditions |
| **Treadmill vs. overground** | Moderate | Treadmill walking produces different arm-swing patterns |

---

## DEVICE SUMMARY CARDS

### Apple Watch
**Best For:** All-around step tracking with highest consistency
**Step Accuracy:** 🥈 81.1% overall; 6.4% MAPE (Series 6, free-living); best independent correlation (r=0.99)
**Bias:** Slight overestimate at slow speeds, slight underestimate at jogging
**Strengths:** Gyroscope + accelerometer fusion; ML-enhanced Core Motion; GPS stride calibration; most consistent across speeds and activity types
**Weaknesses:** Higher error at slow walking (23.9% MAPE for light-intensity); some phantom steps while driving
**Algorithm:** ML-enhanced peak detection with Core Motion coprocessor

### Garmin
**Best For:** Step count accuracy (especially runners)
**Step Accuracy:** 🥇 82.6% overall; <2% MAPE (Vivoactive 4 exercise testing); 0.6–3.5% MAPE (treadmill)
**Bias:** Consistently underestimates (conservative)
**Strengths:** 10-step minimum bout filter eliminates most phantom steps; surface-independent; excellent running accuracy
**Weaknesses:** Undercounts at very slow speeds; can count driving vibrations; entry-level models lack gyroscope
**Algorithm:** Threshold-based peak detection with 10-step gate + Move IQ activity classification

### Fitbit
**Best For:** General fitness tracking, most-validated brand
**Step Accuracy:** 🥉 77.3% overall; ~8% MAPE (Sense); 17–35% MAPE (free-living)
**Bias:** Underestimates in lab, overestimates in free-living
**Strengths:** Largest body of validation research (144 studies); ankle placement dramatically improves accuracy (5.9% error at 0.4 m/s)
**Weaknesses:** Higher free-living error than Garmin/Apple; within-brand inconsistency (different models have different biases)
**Algorithm:** MEMS tri-axial peak detection + ML model (evolving post-Google acquisition)

### Samsung Galaxy Watch
**Best For:** Android integration, general smartwatch functionality
**Step Accuracy:** Moderate (r=0.82 vs ActivPAL — lower than Apple Watch's r=0.99)
**Bias:** Tends to overestimate; user-reported phantom steps
**Strengths:** BioActive Sensor integrates multiple sensors; Samsung Health ecosystem
**Weaknesses:** Fewer validation studies; user reports of 2,000–3,500 extra steps/day; weaker correlation than Apple Watch
**Algorithm:** Accelerometer + gyroscope via Samsung Health

### Oura Ring
**Best For:** Sleep, HRV, recovery — NOT step counting
**Step Accuracy:** Poor (50.3% error real-world aggregate); acceptable in controlled walking (<10% MAPE); +2,124 steps/day overestimate in free-living
**Bias:** Significant overestimation from hand gestures; underestimation when hands stationary
**Strengths:** Controlled walking accuracy is surprisingly good (within 12 steps of 5,000); decent trend correlation (r≥0.76)
**Weaknesses:** Phantom steps from hand movement (thousands per day reported); finger placement is fundamentally limited for step counting
**Algorithm:** ML step classifier on finger-worn accelerometer data

### Polar
**Best For:** Heart rate monitoring, training load — not step counting
**Step Accuracy:** Moderate to poor (53.2% meta-analysis); overreports ~3.8%
**Bias:** Consistent overestimation
**Strengths:** Strong brand heritage in HR monitoring
**Weaknesses:** A360 found not valid for any walking condition; Vantage overreports steps; cannot replace research-grade accelerometers
**Algorithm:** Proprietary peak detection on wrist accelerometer

### COROS
**Best For:** Running-focused step/cadence tracking
**Step Accuracy:** Good in testing (~1.6% error in walking test); very accurate for running
**Bias:** Slight underestimate (requires continuous arm movement)
**Strengths:** Excellent running step accuracy; long battery life
**Weaknesses:** No peer-reviewed validation; filters out short walking bursts; requires continuous motion to count
**Algorithm:** Peak detection with continuous-motion filter + barometric altimeter

### WHOOP
**Best For:** Strain/recovery tracking — step counting is new and unvalidated
**Step Accuracy:** Unknown (no published validation data)
**Bias:** User reports suggest overcounting
**Strengths:** Accelerometer + gyroscope hardware should enable good accuracy
**Weaknesses:** Feature launched Oct 2024; no peer-reviewed studies; WHOOP intentionally deprioritizes steps vs. Strain
**Algorithm:** New (Oct 2024), accelerometer + gyroscope fusion

---

## SOURCES (Complete)

1. **Fuller D, et al. (2020).** "Reliability and Validity of Commercially Available Wearable Devices for Measuring Steps, Energy Expenditure, and Heart Rate: Systematic Review." *JMIR mHealth and uHealth*, 8(9), e18694. DOI: 10.2196/18694 — 144 Fitbit studies, 42 Garmin studies, 28 Apple studies

2. **Germini F, et al. (2022).** "Accuracy and Acceptability of Wrist-Wearable Activity-Tracking Devices: Systematic Review of the Literature." *JMIR*, 24(1), e30791. DOI: 10.2196/30791

3. **O'Driscoll R, et al. (2024).** "Keeping Pace with Wearables: A Living Umbrella Review of Systematic Reviews Evaluating the Accuracy of Consumer Wearable Technologies in Health Measurement." *Sports Medicine*. DOI: 10.1007/s40279-024-02077-2 — 24 systematic reviews, 249 studies, 430,465 participants

4. **Kim Y, et al. (2024).** "Apple Watch 6 vs. Galaxy Watch 4: A Validity Study of Step-Count Estimation in Daily Activities." *Sensors*, 24(14), 4658. DOI: 10.3390/s24144658 — 104 adults, 24-hr ActivPAL criterion

5. **Kristiansson E, et al. (2023).** "Validation of Oura ring energy expenditure and steps in laboratory and free-living." *BMC Medical Research Methodology*, 23, 50. DOI: 10.1186/s12874-023-01868-x — 32 participants, 14-day free-living + lab

6. **Choe S & Kang M (2025).** "Apple Watch accuracy in monitoring health metrics: a systematic review and meta-analysis." *Physiological Measurement.* — 56 studies, 270 effect sizes

7. **"The accuracy of Apple Watch measurements: a living systematic review and meta-analysis." (2026).** *npj Digital Medicine.* DOI: 10.1038/s41746-025-02238-1 — Through Series 9 and Ultra 2

8. **Garmin Validity Review (2020).** "Review of Validity and Reliability of Garmin Activity Trackers." *PMC.* DOI: 10.3390/ijerph17134269

9. **Feehan LM, et al. (2020).** "The validity of activity trackers is affected by walking speed: the criterion validity of Garmin Vivosmart HR." *PeerJ.* DOI: 10.7717/peerj.9381

10. **Roos L, et al. (2020).** "Step Count Reliability and Validity of Five Wearable Technology Devices." *Int J Environ Res Public Health*, 17(20), 7123. DOI: 10.3390/ijerph17207123

11. **Henriksen A, et al. (2022).** "Polar Vantage and Oura Physical Activity and Sleep Trackers: Validation and Comparison Study." *JMIR Formative Research*, 6(5), e27248.

12. **Giurgiu M, et al. (2023).** "Validity of Wearable Monitors and Smartphone Applications for Measuring Steps in Semi-Structured and Free-Living Settings." *Technologies*, 11(1), 29. DOI: 10.3390/technologies11010029

13. **Straczkiewicz M, et al. (2023).** "Open-Source, Step-Counting Algorithm for Smartphone Data." *JMIR Cancer.* DOI: 10.2196/47646

14. **Small SR, et al. (2024).** "Self-Supervised Machine Learning to Characterize Step Counts from Wrist-Worn Accelerometers in the UK Biobank." *PMC.* DOI: 10.1038/s41591-024-03243-w

15. **Oner C, et al. (2022).** "Accurate Step Count with Generalized and Personalized Deep Learning on Accelerometer Data." *Sensors*, 22(11), 3989. DOI: 10.3390/s22113989

16. **Nature Scientific Reports (2024).** "Accuracy of smartwatches for the remote assessment of exercise capacity." DOI: 10.1038/s41598-024-74140-x — Garmin Vivoactive 4 vs Fitbit Sense

17. **WellnessPulse Meta-Analysis (2025).** Accuracy of Fitness Trackers — Aggregate data

18. **AIM7 (2025).** Smartwatch/Wearable Technology Accuracy — Aggregate validation data

19. **Tracking Steps on Apple Watch at Different Walking Speeds (2018).** *JMIR mHealth.* DOI: 10.1177/2055207618770555

20. **Android Central (2023, 2025).** Consumer step-count testing: 6-watch test (2023), 10-watch test (Dec 2025). — ⚠️ Consumer testing, not peer-reviewed

21. **Analog Devices AN-2554.** "Step Counting Using the ADXL367." — Technical reference for peak detection algorithms

22. **Niela-Vilén H, et al. (2022).** "Comparison of Oura Smart Ring Against ActiGraph Accelerometer." *Sensors*, 22(7), 2585. DOI: 10.3390/s22072585

23. **Comparison of Step Count Assessed Using Wrist- and Hip-Worn Actigraph GT3X (2019).** *Frontiers in Medicine*, 6, 252.

24. **CDC Prevention of Chronic Disease (2022).** "Comparison of Wrist- and Hip-Worn Activity Monitors When Meeting Step Guidelines."

25. **JMIR Formative Research (2025).** "Step Count Accuracy of the Life Plus Connected Watch at Different Localizations and Speeds." DOI: 10.2196/58964

---

## STUDY METHODOLOGY & ACCURACY METRICS EXPLAINED

### Recommended Reporting Hierarchy (per O'Driscoll 2024)

| Priority | Metric | What It Measures |
|---|---|---|
| 1st (Best) | **MAPE** (Mean Absolute Percentage Error) | Average of absolute % differences; prevents positive/negative errors canceling out |
| 2nd | **MPE** (Mean Percentage Error) | Average % difference; can mask errors if over/underestimates cancel |
| 3rd | **Mean Difference** (Bias) | Average raw difference in step count |
| 4th | **Bland-Altman Mean Bias** | Systematic over/underestimation with 95% limits of agreement |
| 5th (Least informative) | **Correlation (r or ICC)** | Measures relationship strength, not agreement — high r doesn't mean accurate |

**Why MAPE matters:** Without using absolute values, a device that overestimates by 500 steps half the time and underestimates by 500 steps the other half would show 0% MPE (appearing perfect) while having a 10%+ MAPE (revealing the true error).

### Thresholds Used in Literature

| Metric | Acceptable Threshold | Source |
|---|---|---|
| MAPE (treadmill) | <5% | Roos et al. (2020) |
| MAPE (free motion) | <10% | Roos et al. (2020) |
| MAPE (free-living) | <10% | Kristiansson et al. (2023) |
| ICC | >0.70 | Roos et al. (2020) |
| Correlation (r) | >0.90 (excellent) | General convention |

---

## IMPORTANT CAVEATS

1. **Lab ≠ Real World.** All devices perform significantly better in controlled settings (MAPE ~5%) than free-living (MAPE >10%). Treat lab-only validation with caution.

2. **Walking speed is the #1 confounder.** Accuracy drops dramatically below 0.9 m/s. If you track elderly or clinical populations, expect large undercounts.

3. **Wrist placement measures arm motion, not footfalls.** This fundamental limitation affects all wrist-worn devices. Push a cart or keep hands still = undercounting. Wave arms at a desk = overcounting.

4. **Oura Ring is not a step counter.** Despite acceptable lab accuracy, the finger placement introduces too much noise from hand gestures for reliable daily step counts. Oura themselves recommend against step-count comparisons with wrist devices.

5. **WHOOP has zero validation data for steps.** The feature was only added in October 2024. Any accuracy claims are anecdotal until peer-reviewed studies are published.

6. **Garmin's 10-step gate trades sensitivity for specificity.** It eliminates phantom steps effectively but will miss very short walking bursts (e.g., 5 steps to the printer).

7. **Model generation matters.** Most validation studies used older devices (Vivofit, Vivosmart HR, Apple Watch Series 2). Current-generation devices may perform better, but we can't confirm without updated studies.

8. **Only ~11% of consumer wearables have been validated** for any biometric outcome. The 249 published validation studies represent just 3.5% of what would be needed for comprehensive evaluation.

9. **Study funding matters.** Check if device manufacturers funded the study. Independent studies sometimes reach different conclusions than manufacturer-funded research.

10. **For clinical or research use, hip-worn research-grade accelerometers remain the standard.** No consumer wrist-worn device matches the accuracy of an ActiGraph or ActivPAL at the hip.

11. **Steps are a proxy, not a direct measure.** All wearable step counts are algorithmic estimates based on motion patterns. No consumer device directly counts footfalls.

12. **Individual variation is significant.** Gait pattern, arm swing, BMI, age, and walking speed all affect accuracy — published MAPE values are population averages, not individual guarantees.
