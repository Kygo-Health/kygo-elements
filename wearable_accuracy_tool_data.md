# Wearable Accuracy Tool — Complete Data Reference

## MASTER SUMMARY TABLE

| Biometric | 🥇 Winner | 🥈 Second | 🥉 Third | Worst |
|---|---|---|---|---|
| Sleep Staging (Oura-funded) | Oura (κ=0.65) | Apple Watch (κ=0.60) | Fitbit (κ=0.55) | — |
| Sleep Staging (Independent, Antwerp 2025) | Apple Watch (κ=0.53) | Fitbit Sense (κ=0.42) | Fitbit Charge 5 (κ=0.41) | Garmin (κ=0.21) |
| Deep Sleep Detection (Antwerp 2025) | WHOOP (69.6%) | Apple Watch (50.7%) | Fitbit Sense (48.3%) | Withings (29.8%) |
| REM Detection (Antwerp 2025) | Apple Watch (68.6%) | WHOOP (62.0%) | Fitbit Sense (55.5%) | Garmin (28.7%) |
| Wake Detection (Antwerp 2025) | Apple Watch (52.2%) | Fitbit Charge 5 (42.7%) | Fitbit Sense (39.2%) | Garmin (27.6%) |
| Nocturnal HRV | Oura Gen 4 (MAPE 5.96%) | WHOOP (8.17%) | Garmin (10.52%) | Polar (16.32%) |
| Resting Heart Rate | Oura Gen 4 (CCC 0.98) | Oura Gen 3 (0.97) | WHOOP (0.91) | Polar (0.86) |
| Active Heart Rate | Apple Watch (86.3%) | Fitbit (73.6%) | Garmin (67.7%) | — |
| HR Correlation vs ECG | Polar Chest Strap (r=0.99) | Apple Watch (r=0.80) | Garmin (r=0.52) | — |
| SpO2 | Apple Watch (MAE 2.2%) | Garmin Fenix (~4.5%) | Withings (~4.8%) | Garmin Venu (5.8%) |
| Step Count | Garmin (82.6%) | Apple Watch (81.1%) | Fitbit (77.3%) | Oura (poor) |
| Calories/Energy | Apple Watch (71%) | Fitbit (65.6%) | — | Garmin (48%) |
| VO2 Max Estimation | Garmin Fenix 6 (MAPE 7.05%) | Apple Watch (MAPE 13–16%) | — | — |
| Skin Temperature | Oura (r²>0.99 lab, r²>0.92 real-world) | — | — | — |
| Respiratory Rate | Samsung Galaxy Watch (RMSE 1.13 bpm avg) | Limited data | — | — |

---

## DETAILED DATA BY METRIC

---

### 1. SLEEP STAGING (4-Stage Classification)

**Gold Standard:** Polysomnography (PSG)

| Device | Cohen's Kappa (κ) | Notes |
|---|---|---|
| Oura Ring Gen 3 | 0.65 (Substantial) | No significant over/underestimation of any sleep stage |
| Apple Watch Series 8 | 0.60 (Moderate) | Overestimated light sleep by 45 min, underestimated deep sleep by 43 min |
| Fitbit Sense 2 | 0.55 (Moderate) | Moderate accuracy overall |

**Source:** Robbins R, et al. (2024). "Accuracy of Three Commercial Wearable Devices for Sleep Tracking in Healthy Adults." *Sensors.* DOI: 10.3390/s24206532
- **Study Design:** 36 participants, multiple nights, Brigham and Women's Hospital
- **⚠️ Bias Note:** This study was funded by Oura Ring Inc. Lead author Dr. Rebecca Robbins is an Oura scientific advisor.

**Conflicting Data — Korean Multicenter Study (JMIR, 2023):**

| Device | Cohen's Kappa (κ) | Notes |
|---|---|---|
| Google Pixel Watch | 0.4–0.6 (Moderate) | — |
| Galaxy Watch 5 | 0.4–0.6 (Moderate) | — |
| Fitbit Sense 2 | 0.4–0.6 (Moderate) | — |
| Apple Watch 8 | 0.2–0.4 (Fair) | — |
| Oura Ring 3 | 0.2–0.4 (Fair) | — |

**Source:** Park et al. (2023). "Accuracy of 11 Wearable, Nearable, and Airable Consumer Sleep Trackers." *JMIR mHealth and uHealth.* DOI: 10.2196/50983
- **Study Design:** 75 participants, 2 centers (Korea), 349,114 epochs analyzed
- **⚠️ Note:** This study found different rankings than the Brigham study. Oura scored lower here. No industry funding disclosed.

**Key Context for Tool:** Present both studies. Users should know that sleep staging accuracy varies by study methodology and population. The Brigham study (Oura-funded) and Korean multicenter study (independent) reached different conclusions about Oura vs competitors.

**Most Recent Head-to-Head — Antwerp 2025 Study (6 Devices vs PSG):**

| Device | Cohen's κ (4-stage) | TST Bias | Deep Sleep Correct | REM Correct | Wake Specificity |
|---|---|---|---|---|---|
| Apple Watch Series 8 | 0.53 (Moderate) | +19.6 min ✅ | 50.7% | 68.6% 🥇 | 52.2% 🥇 |
| Fitbit Sense | 0.42 (Moderate) | +6.3 min ✅ | 48.3% | 55.5% | 39.2% |
| Fitbit Charge 5 | 0.41 (Moderate) | +11.1 min ✅ | 43.3% | 47.5% | 42.7% |
| WHOOP 4.0 | 0.37 (Fair) | +24.5 min ✅ | 69.6% 🥇 | 62.0% | 32.5% |
| Withings Scanwatch | 0.22 (Fair) | +39.9 min ❌ | 29.8% | 36.5% | 29.4% |
| Garmin Vivosmart 4 | 0.21 (Fair) | +38.4 min ❌ | 32.1% | 28.7% | 27.6% |

✅ = Clinically acceptable (<30 min bias), ❌ = Not clinically acceptable

**Common Error Pattern:** All 6 devices misclassify wake, deep sleep, and REM as light sleep (conservative algorithm approach). All devices significantly underestimated Wake After Sleep Onset (WASO) by 12–48 min.

**Source:** Schyvens AM, et al. (2025). "Performance of six consumer sleep trackers in healthy adults." *Sleep Advances*, 6(1), zpaf016. DOI: 10.1093/sleepadvances/zpaf016
- **Study Design:** 62 adults, single night PSG, University of Antwerp
- **Funding:** VLAIO (Flanders Innovation & Entrepreneurship) — no device manufacturer funding

**WHOOP Sleep Validation (Additional Studies):**
- University of Arizona (2020): 89% agreement 2-stage (sleep/wake), 64% for 4-stage, κ=0.47 (moderate). Overestimated TST by 8.2±32.9 min (non-significant).
- 2024 Systematic Review: Least TST disagreement of any device (-1.4 min), but largest REM overestimation (+21.0 min). Light sleep: -9.6 min, Deep sleep: -9.3 min.
- Central Queensland University: 99.7% accurate for HR during sleep, 99% for HRV during sleep.
- **Source:** Khodr R, et al. (2024). *medRxiv.* DOI: 10.1101/2024.01.04.24300784

---

### 2. DEEP SLEEP DETECTION SENSITIVITY

| Device | Sensitivity |
|---|---|
| Oura Ring Gen 3 | 79.5% |
| Fitbit Sense 2 | 61.7% |
| Apple Watch Series 8 | 50.5% |

**Source:** Robbins et al. (2024), Sensors. DOI: 10.3390/s24206532
- **⚠️ Bias Note:** Oura-funded study

**Deep Sleep Bias (systematic over/underestimation):**
| Device | Bias |
|---|---|
| Oura Ring Gen 3 | No significant bias |
| Fitbit Sense 2 | -15 min (underestimates) |
| Apple Watch Series 8 | -43 min (underestimates) |

---

### 3. WAKE DETECTION SENSITIVITY

| Device | Sensitivity |
|---|---|
| Oura Ring Gen 3 | 68.6% |
| Fitbit Sense 2 | 67.7% |
| Apple Watch Series 8 | 52.4% |
| Garmin Vivosmart 4 | 27% |

**Sources:**
- Robbins et al. (2024), Sensors. DOI: 10.3390/s24206532 (Oura, Fitbit, Apple)
- Chinoy et al. (2022), Sleep. (Garmin)

---

### 4. NOCTURNAL HRV (Heart Rate Variability)

**Gold Standard:** Polar H10 ECG chest strap (1000 Hz sampling)

| Device | CCC | MAPE | Rating |
|---|---|---|---|
| Oura Gen 4 | 0.99 | 5.96% ± 5.12% | Nearly Perfect |
| Oura Gen 3 | 0.97 | 7.15% ± 5.48% | Substantial |
| WHOOP 4.0 | 0.94 | 8.17% ± 10.49% | Moderate |
| Garmin Fenix 6 | 0.87 | 10.52% ± 8.63% | Poor |
| Polar Grit X Pro | 0.82 | 16.32% ± 24.39% | Poor |

**CCC Scale:** >0.99 = Nearly Perfect, 0.95–0.99 = Substantial, 0.90–0.95 = Moderate, <0.90 = Poor

**Source:** Dial MB, et al. (2025). "Validation of nocturnal resting heart rate and heart rate variability in consumer wearables." *Physiological Reports.* DOI: 10.14814/phy2.70527
- **Study Design:** 13 participants, 536 nights, Ohio State University / Air Force Research Lab
- **⚠️ Bias Note:** No industry funding disclosed. However, Garmin Fenix 6 is 2+ generations old; current Garmin devices may perform differently. Study authors acknowledged this limitation.
- **Notable Finding:** Oura accuracy decreased at HRV >60ms (relevant for very fit individuals)

---

### 5. RESTING HEART RATE (RHR)

| Device | CCC | MAPE | Rating |
|---|---|---|---|
| Oura Gen 4 | 0.98 | 1.94% ± 2.51% | Nearly Perfect |
| Oura Gen 3 | 0.97 | 1.67% ± 1.54% | Substantial |
| WHOOP 4.0 | 0.91 | 3.00% ± 2.15% | Moderate |
| Polar Grit X Pro | 0.86 | 2.71% ± 2.75% | Poor |

**Note:** Garmin Fenix 6 was excluded from RHR analysis due to timestamp reporting issues that prevented alignment with the Polar H10 reference data.

**Source:** Dial et al. (2025), Physiological Reports. DOI: 10.14814/phy2.70527

---

### 6. ACTIVE HEART RATE ACCURACY

| Device | Accuracy |
|---|---|
| Apple Watch | 86.31% |
| Fitbit | 73.56% |
| Garmin | 67.73% |
| TomTom | 67.63% |

**Source:** WellnessPulse Meta-Analysis (2025). Accuracy of Fitness Trackers.

**Heart Rate Correlation vs ECG (during activity):**

| Device | Correlation (r) |
|---|---|
| Polar Chest Strap | 0.99 |
| Apple Watch | 0.80 |
| Garmin | 0.52 |

**Source:** WellnessPulse / PubMed Central aggregate studies

---

### 7. BLOOD OXYGEN (SpO2) ACCURACY

| Device | MAE | MDE | RMSE |
|---|---|---|---|
| Apple Watch Series 7 | 2.2% | -0.4% | 2.9% |
| Garmin Fenix 6 Pro | ~4.5% | — | — |
| Withings ScanWatch | ~4.8% | — | — |
| Garmin Venu 2s | 5.8% | 5.5% | 6.7% |

**SpO2 — % Readings Within Accuracy Range:**

| Device | Within Range | Underestimate | Missing Data |
|---|---|---|---|
| Apple Watch Series 7 | 58.3% | 24.3% | 11% |
| Garmin Fenix 6 Pro | ~44% | ~28% | 28% |
| Withings ScanWatch | ~38% | ~31% | 31% |
| Garmin Venu 2s | 18.5% | 67.4% | 14% |

**Oura Ring 4 SpO2 (from Oura's internal study, Aug 2024):**
- 120% improvement in signal quality over Gen 3
- 30% increase in accuracy for average overnight SpO2 measurement
- **⚠️ Note:** These are Oura's own claims from an internal study (60 participants), not independent peer-reviewed research.

**Samsung Galaxy Watch 4 SpO2 (J Clin Sleep Med, 2024):**
- Reliable overnight continuous SpO2 monitoring
- Potential utility for sleep apnea evaluation
- **Source:** DOI: 10.5664/jcsm.11178

**General SpO2 Limitations:**
- Skin pigmentation affects accuracy (racial bias documented in pulse oximetry)
- Tattoos can block sensor light
- All wearable SpO2 should be considered estimates, not medical-grade

**Sources:** PLOS, Nature, various validation studies

---

### 8. STEP COUNT ACCURACY

| Device | Accuracy |
|---|---|
| Garmin | 82.58% |
| Apple Watch | 81.07% |
| Fitbit | 77.29% |
| Jawbone | 57.91% |
| Polar | 53.21% |
| Oura Ring | Poor (50.3% error real-world, 4.8% controlled) |

**Step Count During Exercise Testing (MAPE):**

| Device | MAPE |
|---|---|
| Garmin Vivoactive 4 | <2% |
| Fitbit Sense | ~8% |

**Source:** WellnessPulse Meta-Analysis (2025); AIM7 aggregate data

---

### 9. ENERGY EXPENDITURE (Calories)

| Device | Accuracy |
|---|---|
| Apple Watch | 71.02% |
| Fitbit | 65.57% |
| Polar | ~50–65% |
| Garmin | 48.05% |
| Oura Ring | ~87% (13% avg error) |

**Key Context:** All wearables are weak at calorie estimation. None should be treated as precise. Accuracy decreases during high-intensity or multi-modal exercise.

**Sources:** WellnessPulse Meta-Analysis (2025); AIM7 validation data

---

### 10. VO2 MAX ESTIMATION

**Gold Standard:** Laboratory metabolic cart (indirect calorimetry)
**Note:** All wearable VO2 max values are algorithmic estimates based on HR, activity pace, and user profile — not direct measurements.

| Device | MAPE | MAE | Bias Direction |
|---|---|---|---|
| Garmin Forerunner 245 | 5.7% | — | Acceptable for runners |
| Garmin Fenix 6 | 7.05% | — | CCC=0.73 for 30s averages |
| Apple Watch Series 7 | 15.79% | 6.07 ml/kg/min | Underestimates |
| Apple Watch (2025 study) | 13.31% | 6.92 ml/kg/min | Mixed |

**Systematic Bias:** All devices tend to underestimate VO2 max in highly fit individuals and overestimate in sedentary/lower fitness populations.

**Sources:**
- **Caserman P, et al. (2024).** "Apple Watch VO2 Max Estimation." *JMIR Biomedical Engineering*, 9, e54023.
- **Lambe RF, et al. (2025).** "Validation of Apple Watch VO2 max." *PLOS One*, 20(2), e0318498. DOI: 10.1371/journal.pone.0318498
- **Garmin validation (2025).** *Sensors*, Fenix 6 against metabolic system.
- **Garmin Forerunner 245 validation.** Multiple running-focused studies.

**Key Context for Tool:** VO2 max from wearables should be used for trend tracking over time, not as absolute values. A 7–16% error margin means a person with a true VO2 max of 50 could see readings of 42–54 depending on the device.

---

### 11. SKIN TEMPERATURE

| Device | Lab Accuracy | Real-World Accuracy | Precision |
|---|---|---|---|
| Oura Ring | r² > 0.99 | r² > 0.92 | ±0.13°C (0.234°F) per minute |

**Validated against:** iButton research-grade sensors
**Study Design:** 16 individuals, 1 week, 93,571 data points
**Source:** Oura internal validation study (2024)
- **⚠️ Bias Note:** This is Oura's own study, not independently peer-reviewed. However, Oura's temperature data has been validated in independent menstrual cycle tracking studies.

**Additional Validation — Menstrual Cycle Tracking:**
- Oura can detect bi-phasic temperature pattern of menstrual cycle
- Ovulation detection sensitivity: 83.3% (±3 to +2 days)
- **Source:** Maijala et al. (2019). "Nocturnal finger skin temperature in menstrual cycle tracking." *BMC Women's Health.* DOI: 10.1186/s12905-019-0844-9

**Other Devices:**
- Apple Watch, Garmin, WHOOP, and Samsung all track skin temperature, but limited independent validation data comparing accuracy across devices exists
- Oura's finger placement provides more consistent skin contact than wrist-based devices

---

### 12. RESPIRATORY RATE

Limited head-to-head comparison data. Most devices derive respiratory rate from PPG signals during sleep.

**Samsung Galaxy Watch 4/5 (vs polysomnography):**
| Metric | Value |
|---|---|
| Avg overnight RR RMSE | 1.13 bpm |
| Continuous RR RMSE | 1.62 bpm |
| Bias | 0.37–0.39 bpm |
| Accuracy degrades with | Severe obstructive sleep apnea |

**Source:** Park et al. (2023). "Validating a Consumer Smartwatch for Nocturnal Respiratory Rate." *Sensors.* DOI: 10.3390/s23187867
- **⚠️ Bias Note:** Study authors affiliated with Samsung Electronics. Samsung-funded.

**Other Devices:**
- Oura Ring: Measures respiratory rate during sleep via PPG. No published RMSE comparison data found.
- Apple Watch: Tracks respiratory rate during sleep. No published validation study comparing to reference found.
- WHOOP: Tracks respiratory rate during sleep. Used in their recovery algorithm. No published head-to-head validation.
- Garmin: Tracks respiratory rate. No published validation against medical reference found.

**Key Context for Tool:** Respiratory rate accuracy is the least validated metric across devices. Most manufacturers claim to track it, but independent comparative studies are essentially nonexistent.

---

### 13. FDA-CLEARED FEATURES

| Feature | Device | Status |
|---|---|---|
| ECG / Atrial Fibrillation Detection | Apple Watch (Series 4+) | FDA Cleared |
| ECG / Atrial Fibrillation Detection | Samsung Galaxy Watch (4+) | FDA Cleared |
| Sleep Apnea Notification | Apple Watch (Series 9+, Ultra 2) | FDA Authorized |
| Sleep Apnea Detection | Samsung Galaxy Watch | FDA De Novo Authorized (Feb 2024) |
| Blood Oxygen (SpO2) | Apple Watch | Wellness feature (not FDA cleared) |
| Irregular Rhythm Notification | Fitbit | FDA Cleared |

---

## DEVICE SUMMARY CARDS (For Tool UI)

### Oura Ring
**Best For:** Sleep, HRV, RHR, Skin Temperature, Recovery
**Strengths:** Best-in-class HRV (CCC=0.99), near-perfect nocturnal RHR (CCC=0.98), best skin temperature tracking (r²>0.99), strong sleep staging in Oura-funded study (κ=0.65)
**Weaknesses:** Poor step counting (~50% error real-world), no active heart rate tracking during exercise, no GPS, no screen, not tested in Antwerp 2025 study
**Subscription:** Required ($5.99/mo)
**⚠️ Research Note:** Sleep κ=0.65 comes from Oura-funded study. Independent Korean study found κ=0.2–0.4 (fair). HRV/RHR validation (Dial et al.) is independent and very strong.

### Apple Watch
**Best For:** Active heart rate, SpO2, sleep staging (independent studies), FDA-cleared health features, smartwatch functionality
**Strengths:** Best active HR accuracy (86.3%), best SpO2 (MAE 2.2%), highest independent sleep κ=0.53 (Antwerp 2025), best wake detection (52.2%), best REM detection (68.6%), FDA-cleared ECG and sleep apnea detection
**Weaknesses:** VO2 max estimation has 13–16% error, underestimates deep sleep, daily charging needed
**Subscription:** None required

### Garmin
**Best For:** Step counting, GPS tracking, outdoor sports, battery life, VO2 max estimation
**Strengths:** Best step count accuracy (82.6%), best VO2 max estimation (MAPE 7.05%), best GPS, excellent battery life, multi-sport tracking
**Weaknesses:** Poor sleep staging (κ=0.21, Antwerp 2025), poor wake detection (27.6%), lower HRV accuracy (CCC=0.87), worst calorie tracking (48%)
**Subscription:** None required
**⚠️ Research Note:** HRV/sleep studies used Fenix 6 / Vivosmart 4 (older models). Current devices may perform better.

### WHOOP
**Best For:** Recovery tracking, strain monitoring, deep sleep detection, athlete training load
**Strengths:** Best deep sleep detection (69.6%, Antwerp 2025), good HRV accuracy (CCC=0.94), best TST agreement (-1.4 min systematic review), 99.7% HR accuracy during sleep
**Weaknesses:** Moderate overall sleep staging (κ=0.37), overestimates REM by ~21 min, poor wake detection (32.5%), no screen, requires subscription
**Subscription:** Required ($30/mo for 12-month commitment)

### Fitbit
**Best For:** General fitness tracking, sleep basics, affordability
**Strengths:** Moderate sleep accuracy (κ=0.55), decent deep sleep sensitivity (61.7%), FDA-cleared irregular rhythm
**Weaknesses:** Below leaders in most metrics, declining validation research since Google acquisition
**Subscription:** Fitbit Premium optional ($9.99/mo)

### Samsung Galaxy Watch
**Best For:** Android users, sleep apnea screening, SpO2 monitoring
**Strengths:** FDA-cleared sleep apnea detection, validated respiratory rate tracking (RMSE 1.13 bpm), moderate sleep staging
**Weaknesses:** Limited independent accuracy studies compared to Oura/Apple Watch
**Subscription:** None required

---

## SOURCES (Complete)

1. **Robbins R, et al. (2024).** "Accuracy of Three Commercial Wearable Devices for Sleep Tracking in Healthy Adults." *Sensors*, 24(20), 6532. DOI: 10.3390/s24206532 — ⚠️ Funded by Oura Ring Inc.

2. **Dial MB, et al. (2025).** "Validation of nocturnal resting heart rate and heart rate variability in consumer wearables." *Physiological Reports*, 13(16), e70527. DOI: 10.14814/phy2.70527 — Independent (Ohio State / Air Force Research Lab)

3. **Park et al. (2023).** "Accuracy of 11 Wearable, Nearable, and Airable Consumer Sleep Trackers: Prospective Multicenter Validation Study." *JMIR mHealth and uHealth*, 11, e50983. DOI: 10.2196/50983 — Independent (Korean multicenter)

4. **Park et al. (2023).** "Validating a Consumer Smartwatch for Nocturnal Respiratory Rate Measurements in Sleep Monitoring." *Sensors*, 23(18), 7867. DOI: 10.3390/s23187867 — ⚠️ Samsung-affiliated authors, Samsung-funded

5. **Khodr R, et al. (2024).** "Accuracy, Utility and Applicability of the WHOOP Wearable Monitoring Device in Health, Wellness and Performance — A Systematic Review." *medRxiv*. DOI: 10.1101/2024.01.04.24300784

6. **Oura Internal Validation (2024).** Temperature sensor validation study. 16 participants, 93,571 data points. Published on ouraring.com/blog — ⚠️ Oura internal study

7. **Maijala et al. (2019).** "Nocturnal finger skin temperature in menstrual cycle tracking." *BMC Women's Health*, 19, 150. DOI: 10.1186/s12905-019-0844-9

8. **Lanfranchi et al. (2024).** Samsung Galaxy Watch SpO2 validation. *Journal of Clinical Sleep Medicine*, 20(9), 1479–1488. DOI: 10.5664/jcsm.11178 — ⚠️ Samsung-affiliated

9. **WellnessPulse Meta-Analysis (2025).** Accuracy of Fitness Trackers — Aggregate data

10. **AIM7.** Smartwatch/Wearable Technology Accuracy — Aggregate validation data

11. **Christakis et al. (2025).** "A guide to consumer-grade wearables in cardiovascular clinical care." *npj Cardiovascular Health*, 2, 82. DOI: 10.1038/s44325-025-00082-6

12. **PMC/JAMA (2025).** "Selecting Wearable Devices to Measure Cardiovascular Functions in Community-Dwelling Adults." DOI: 10.1016/j.jamda.2025.105529

13. **Schyvens AM, et al. (2025).** "Performance of six consumer sleep trackers in comparison with polysomnography in healthy adults." *Sleep Advances*, 6(1), zpaf016. DOI: 10.1093/sleepadvances/zpaf016 — Independent (VLAIO-funded, University of Antwerp)

14. **Caserman P, et al. (2024).** "Validity of Apple Watch Series 7 VO2 Max Estimation." *JMIR Biomedical Engineering*, 9, e54023.

15. **Lambe RF, et al. (2025).** "Validation of Apple Watch VO2 max estimates." *PLOS One*, 20(2), e0318498. DOI: 10.1371/journal.pone.0318498

16. **Miller DJ, et al. (2022).** "A Validation of Six Wearable Devices for Estimating Sleep, Heart Rate and Heart Rate Variability in Healthy Adults." *Sensors*, 22(16), 6317. DOI: 10.3390/s22166317

17. **University of Arizona (2020).** WHOOP sleep staging validation vs polysomnography. 89% 2-stage agreement, 64% 4-stage, κ=0.47.

---

## STUDY CONFLICT MATRIX — SLEEP STAGING RANKINGS BY STUDY

| Study | Funding | N | #1 | #2 | #3 | #4+ |
|---|---|---|---|---|---|---|
| Robbins 2024 (Sensors) | ⚠️ Oura-funded | 36 | Oura (0.65) | Apple Watch (0.60) | Fitbit (0.55) | — |
| Park 2023 (JMIR) | ✅ Independent | 75 | Pixel/Galaxy/Fitbit (0.4–0.6) | — | Apple/Oura (0.2–0.4) | — |
| Schyvens 2025 (Sleep Advances) | ✅ Independent | 62 | Apple Watch (0.53) | Fitbit Sense (0.42) | WHOOP (0.37) | Garmin (0.21) |

**Interpretation:** Independent studies consistently rank Apple Watch and Fitbit near the top. Oura only leads in the Oura-funded study. WHOOP shows moderate overall κ but excels at deep sleep detection specifically.

---

## ACCURACY BY USE CASE

| Use Case | Best Device(s) | Confidence | Notes |
|---|---|---|---|
| Sleep tracking (overall) | Apple Watch, Fitbit | Moderate | Consistent across independent studies |
| Deep sleep specifically | WHOOP | Moderate | 69.6% detection rate (Antwerp 2025) |
| HRV / Recovery | Oura Ring | High | CCC=0.99, independently validated |
| Resting heart rate | Oura Ring | High | CCC=0.98, independently validated |
| Active heart rate | Apple Watch | High | 86.3% accuracy, multiple studies |
| SpO2 | Apple Watch | Moderate | MAE 2.2%, but only 58% within clinical range |
| Steps | Garmin, Apple Watch | High | 82.6% and 81.1% respectively |
| VO2 max trends | Garmin | Moderate | MAPE 7.05% (use for trends, not absolutes) |
| Skin temperature | Oura Ring | Moderate | r²>0.99 lab (but Oura-funded validation) |
| Calories | None recommended | Low | Best is 71% (Apple Watch) — all are weak |
| Medical features (ECG/AFib) | Apple Watch, Samsung | High | FDA-cleared |

---

## IMPORTANT CAVEATS FOR TOOL DISCLAIMER

1. **No single device wins everywhere.** Best device depends on which metric matters most to the user.
2. **Study funding matters.** The primary sleep study (Robbins et al.) was Oura-funded. Independent studies (Park, Schyvens) found different rankings.
3. **Device generations matter.** Studies often test older hardware. Garmin Fenix 6 and Vivosmart 4 are 2+ generations behind current. Results may not apply to current models.
4. **Small sample sizes.** The HRV/RHR study had only 13 participants (though 536 nights of data). Antwerp had 62 participants, 1 night each.
5. **All wearables are estimates.** None are medical devices (except specific FDA-cleared features). Data should inform, not diagnose.
6. **Calorie tracking is weak across all devices.** None should be used as precise calorie counters.
7. **Individual variation.** Accuracy can vary based on skin tone, tattoos, BMI, fit, and activity level.
8. **Skin tone bias.** PPG sensor accuracy is affected by skin pigmentation. Most validation studies have predominantly Caucasian participants — a critical research gap.
9. **PSG is imperfect too.** The "gold standard" polysomnography has interrater reliability of κ≈0.75, meaning even human experts disagree ~25% of the time on sleep staging.
10. **Common device failure mode.** All consumer devices tend to misclassify wake, deep sleep, and REM as light sleep — a conservative algorithmic approach that inflates light sleep totals.
