/**
 * Kygo Health — Wearable Stress Research
 * Tag: kygo-wearable-stress
 * Pick 1 or 2 wearables, see how each measures stress, then explore the
 * factor cards (alcohol, sleep, caffeine, etc.) re-sorted by impact for
 * the selected device.
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

class KygoWearableStress extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._mode = 'single';
    this._device1 = 'oura';
    this._device2 = 'samsung';
    this._compareExpandedKey = null;
    this._categoryFilter = null;
    this._listExpandedKey = null;
    this._eventsBound = false;
  }

  connectedCallback() {
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, 'Wearable Stress Research by Kygo Health. Compare how Garmin, Samsung Galaxy Watch (GW4–GW8), Google Pixel Watch, Fitbit Sense 2, WHOOP, Oura Ring (Gen 3 / Ring 4), Apple Watch, Polar, COROS, and Amazfit measure stress. Each device uses a different mix of signals: HRV, electrodermal activity (EDA), skin temperature, respiratory rate, and SpO2. Multi-signal devices show ~82% accuracy versus ~77% for HRV-only — but every wearable is detecting autonomic arousal, not stress directly. Explore lifestyle factors that move each underlying signal — alcohol, sleep, caffeine, exercise, illness, hydration, meditation, cold exposure — with device-specific mechanisms, hardware-generation context (Garmin Elevate Gen 4 vs Gen 5, Samsung BioActive Sensor, Apple HealthKit SDNN, WHOOP lnRMSSD), validation data versus Polar H10 chest strap, and evidence-based actions. Every claim sourced from peer-reviewed research including Frontiers in Physiology 2024, the Trier Social Stress Test meta-analysis, and the npj Digital Medicine 2025 living meta-analysis of Apple Watch accuracy.');
  }

  _injectStructuredData() {
    if (document.querySelector('script[data-kygo-stress-ld]')) return;

    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Wearable Stress Research',
      'alternateName': 'Kygo Wearable Stress Comparison Tool',
      'description': 'Compare how 10 wearables (Garmin, Samsung Galaxy Watch GW4–GW8, Google Pixel Watch, Fitbit Sense 2, WHOOP, Oura Ring Gen 3 / Ring 4, Apple Watch, Polar, COROS, Amazfit) measure stress, with hardware-generation context, lifestyle factors broken down by underlying signal, and validation data versus the Polar H10 chest-strap reference. Includes the methodological framing that all wearables detect autonomic arousal rather than stress directly.',
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'url': 'https://www.kygo.app/tools/wearable-stress',
      'datePublished': '2026-05-06',
      'dateModified': '2026-05-06',
      'softwareVersion': '1.0',
      'inLanguage': 'en',
      'isAccessibleForFree': true,
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
      'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
      'featureList': '10 wearable comparison (Garmin, Samsung, Google Pixel Watch, Fitbit Sense 2, WHOOP, Oura, Apple Watch, Polar, COROS, Amazfit), per-signal factor breakdown (HRV, HR, EDA, Skin Temp, Resp Rate, SpO2, Sleep), hardware-generation lineage, device-specific validation data, what-helps/what-hurts grouping, peer-reviewed citations.',
      'keywords': 'wearable stress measurement, how does Garmin measure stress, Garmin Elevate Gen 4 vs Gen 5, Garmin HRV Stress Test, Samsung BioActive sensor stress, Samsung GW8 Vascular Load Antioxidant Index AGEs, WHOOP stress monitor lnRMSSD, Oura cumulative stress resilience restorative time, Pixel Watch cEDA, Fitbit Sense 2 stress, Polar Nightly Recharge H10, Apple Watch HRV SDNN HealthKit, Athlytic Welltory, COROS Daily Stress, Amazfit Stress Index, HRV vs RMSSD vs SDNN, EDA skin conductance, alcohol HRV, sleep deprivation stress, caffeine HRV, overtraining respiratory rate, Trier Social Stress Test, wearable stress accuracy meta-analysis'
    };

    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Can I compare a stress score across different wearable brands?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'No. Every brand uses a proprietary algorithm and a personal baseline. A "55" on Garmin does not correspond to a "55" on Samsung. WHOOP\'s Stress Monitor is 0–3, not 0–100. Oura uses Low / Medium / High. Polar uses ANS Charge from −10 to +10. Apple Watch has no native stress score at all. Each device has to be interpreted against its own historical baseline.' }
        },
        {
          '@type': 'Question',
          'name': 'Which wearables use EDA (skin conductance) for stress?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Samsung Galaxy Watch (BioActive Sensor since GW4), Google Pixel Watch 2 and 3, and Fitbit Sense 2 all measure continuous EDA (cEDA) at the wrist. Fitbit Sense Gen 1 had EDA but only as a manual 2-minute spot-check. Pixel Watch 1 had no EDA. Garmin, WHOOP, Oura, Apple Watch, Polar, COROS, and Amazfit do not measure EDA.' }
        },
        {
          '@type': 'Question',
          'name': 'Does Apple Watch have a native stress score?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'No. As of watchOS 11 / 12 / 26 there is no native Apple Watch stress feature. Apple HealthKit exposes HRV as SDNN (Standard Deviation of NN intervals — not RMSSD), sampled approximately every 4 hours by default, every 2 hours with Irregular Rhythm Notifications enabled, or every 15 minutes with AFib History enabled. Third-party apps like Athlytic and Welltory read this data and compute their own stress and recovery scores on top.' }
        },
        {
          '@type': 'Question',
          'name': 'How accurate is Apple Watch HRV compared to a chest strap?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'A 2024 peer-reviewed validation (Sensors, n=39 healthy adults, 316 measurements) found Apple Watch Series 9 / Ultra 2 underestimates SDNN by a mean of 8.31 ms versus a Polar H10 chest strap with Kubios — failing the ±10 ms equivalence margin. Resting heart rate is far more accurate: MAPE 5.91%, MAE 3.73 bpm. The widely-cited "1–4% error" is the low end of a 1.16%–6.46% MAPE range per the 2025 npj Digital Medicine living meta-analysis.' }
        },
        {
          '@type': 'Question',
          'name': 'What is the most universal factor that raises wearable stress scores?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Sleep deprivation. Every wearable that scores stress reads HRV, and short or fragmented sleep suppresses parasympathetic tone — so HRV drops and stress climbs the next morning on every device.' }
        },
        {
          '@type': 'Question',
          'name': 'How long does alcohol affect my wearable stress reading?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Effect is dose-dependent. Peer-reviewed data shows RMSSD drops of about 2 ms at low doses, 5.7 ms at moderate doses, and 12.9 ms at high doses, with the acute autonomic effect persisting up to roughly 10 hours. Most wearables look clean again after one to two alcohol-free nights, and consistent abstinence shifts the personal baseline up over a week or two.' }
        },
        {
          '@type': 'Question',
          'name': 'Are multi-signal wearables more accurate at measuring stress?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Generally yes. The 2024 JMIR systematic review and meta-analysis found pooled accuracy of ~82% for multi-signal approaches (HRV + EDA + skin temperature) versus ~77% for HRV alone. But the larger caveat is that wearables detect autonomic arousal, not stress per se — EDA cannot distinguish positive from negative arousal, and accuracy degrades significantly from lab paradigms (Trier Social Stress Test) to real-world daily use.' }
        },
        {
          '@type': 'Question',
          'name': 'Do wearables actually measure stress?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'They measure autonomic arousal — sympathetic nervous system activation — and infer stress on top. EDA fires the same way whether you are anxious, excited, or scared. HRV drops the same way from a stressful email, a cold drink, exercise, or caffeine. The closest reference standards are the Trier Social Stress Test (cortisol response), 12-lead ECG-derived HRV per Task Force 1996, and validated questionnaires like PSS-10. Wearable scores are inferences layered on arousal detection.' }
        },
        {
          '@type': 'Question',
          'name': 'What does Garmin\'s HRV Stress Test do that the regular stress score doesn\'t?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'The HRV Stress Test is a 3-minute on-demand reading taken while standing still, with a Garmin chest HRM (e.g., HRM-Pro). It uses ECG-derived R-R intervals rather than wrist PPG, which is closer to lab quality. The all-day Stress Score samples HRV from the Elevate optical wrist sensor every few minutes. The chest-strap test is available on Fenix and high-end Forerunner models.' }
        },
        {
          '@type': 'Question',
          'name': 'What chronic-stress metrics does the Samsung Galaxy Watch 8 add?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'GW8 / GW8 Classic (launched July 2025) added two new chronic-stress markers on top of the existing acute Stress Score and the GW7-introduced AGEs Index and Energy Score: Vascular Load (overnight PPG waveform analysis of blood volume and vascular stiffness, requires ≥3 nights of sleep in 14 days) and Antioxidant Index (multi-wavelength absorption spectroscopy of skin carotenoids — thumb on the rear sensor for ~5 seconds, scored 0–100). Antioxidant Index is GW8-series exclusive; it is not on GW Ultra or GW7.' }
        },
        {
          '@type': 'Question',
          'name': 'What are the five contributors to Oura\'s Cumulative Stress score?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Per Oura\'s official documentation: sleep continuity (sleep fragmentation overnight), heart stress-response (changes in HR and HRV), sleep micromotions (involuntary movements during sleep), temperature regulation (shifts in overnight temperature patterns), and activity impact (daily activity, energy use, and elevated RHR adding strain). Cumulative Stress requires at least 21 days of data in the past 31. It was developed with the University of Southern Denmark and released in November 2025.' }
        }
      ]
    };

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Kygo Health', 'item': 'https://www.kygo.app' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
        { '@type': 'ListItem', 'position': 3, 'name': 'Wearable Stress Research', 'item': 'https://www.kygo.app/tools/wearable-stress' }
      ]
    };

    [ld, faq, breadcrumb].forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-kygo-stress-ld', '');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  get _devices() {
    return {
      oura: {
        name: 'Oura Ring',
        scoreName: 'Cumulative Stress',
        modelLine: 'Daytime + Resilience + Cumulative Stress',
        sensors: { hrv: true, hr: true, eda: false, skinTemp: true, spo2: false, rr: false, sleep: true },
        algorithm: 'Three stacked layers. Daytime Stress reads HRV in real time when you\'re still. Resilience scores recovery capacity across 14 days (5 tiers: Exceptional → Strong → Solid → Adequate → Limited). Cumulative Stress, released Nov 2025 with the University of Southern Denmark, scans the last 31 days across five named contributors: sleep continuity, heart stress-response (HR + HRV), sleep micromotions, overnight temperature regulation, and daily activity impact. Restorative Time captures daytime windows where HR drops and HRV rises — active waking recovery, separate from sleep.',
        scale: 'Daytime Stress: Low / Medium / High + trend  ·  Resilience: 5 tiers  ·  Cumulative Stress: levelled output over the 31-day window.',
        baseline: 'Resilience needs a 14-day average with ≥5 complete days (10 for new members). Cumulative Stress needs ≥21 days of data in the last 31. Sleep architecture is the heaviest single input.',
        coverage: 'Daytime Stress is continuous when still; Cumulative is a daily rollup; Resilience updates daily once thresholds are met.',
        hardware: 'Gen 3 ring or Ring 4 — finger PPG, NTC skin-temp sensor, motion (sleep micromotion).',
        strength: 'Finger-site skin temperature is the cleanest signal in the consumer market — Oura uses it deliberately for period prediction and early illness flags. Cumulative + Resilience is the only chronic-stress layer in any consumer wearable.',
        limitation: 'No EDA. Daytime spikes lean on HRV alone; sleep dominates the score, so a single bad night drags Cumulative more than it probably should.',
        color: '#475569'
      },
      garmin: {
        name: 'Garmin',
        scoreName: 'Stress Score',
        modelLine: 'Stress Score · Body Battery · optional HRV Stress Test',
        sensors: { hrv: true, hr: true, eda: false, skinTemp: false, spo2: false, rr: false, sleep: false },
        algorithm: 'Firstbeat Analytics — RMSSD-derived, sampled every few minutes from the Elevate optical sensor. Pauses during exercise. Body Battery is a derived 0–100 "energy tank" aggregator that combines the same stress signal with sleep, activity, and recovery — it is not a separate measurement. High-end models (Fenix, top Forerunner) also support an optional 3-minute HRV Stress Test taken while standing still with a Garmin chest HRM (HRM-Pro): uses ECG-derived R-R intervals — closer to lab quality than wrist PPG — and is tracked over time as a training-readiness signal.',
        scale: 'Stress: 0–100 (rest 0–25 / low 26–50 / med 51–75 / high 76–100)  ·  Body Battery: 0–100 energy aggregator',
        baseline: 'Multi-week personal rolling baseline; each reading is compared to your own history.',
        coverage: 'All-day, pauses during workouts. HRV Stress Test is a manual on-demand reading.',
        hardware: 'Elevate Gen 4 (2022 launch — Fenix 7 base/Solar, Forerunner 955, Venu 2 Plus, Venu 3) added red + IR LEDs alongside green for deeper penetration. Elevate Gen 5 (2023+ — Fenix 7 Pro, Epix Pro Gen 2, Fenix 8, Forerunner 965, Venu 4) expanded ECG support and improved signal fidelity.',
        strength: 'Long-running Firstbeat partnership with a dependable, well-validated HRV pipeline. Only major brand offering an optional ECG-strap HRV test, which is genuinely lab-grade.',
        limitation: 'HRV-only at the wrist. Can\'t separate exercise arousal or excitement from psychological stress. Common error: people confuse Elevate Gen 4 (FR 955) with Gen 5 (FR 965) — they are different sensors, not the same.',
        color: '#1E293B'
      },
      samsung: {
        name: 'Samsung Galaxy Watch',
        scoreName: 'Stress Score',
        modelLine: 'BioActive Sensor (PPG + ECG + BIA) + EDA',
        sensors: { hrv: true, hr: true, eda: true, skinTemp: false, spo2: false, rr: false, sleep: false },
        algorithm: 'The BioActive Sensor (introduced GW4) is a 3-in-1 chip — Optical Heart Rate / PPG + Electrical Heart / ECG + Bioelectrical Impedance Analysis / BIA. The acute Stress Score pairs HRV with EDA (skin conductance) and, on GW7 Ultra+, runs an AI pattern-recognition layer. Newer models layer chronic-stress markers on top of the acute score: AGEs Index (Advanced Glycation End-products, a metabolic-aging marker) and Energy Score on GW7 / GW Ultra / GW8; Vascular Load (overnight PPG waveform analysis of blood volume and vascular stiffness) and Antioxidant Index (multi-wavelength absorption spectroscopy of skin carotenoids — thumb on rear sensor for ~5 sec) on the GW8 series only.',
        scale: 'Acute Stress: 0–100  ·  AGEs Index, Vascular Load, Antioxidant Index: separate 0–100 chronic-stress / metabolic markers',
        baseline: 'Proprietary AI baseline that adapts over time. Vascular Load needs ≥3 nights of sleep within a 14-day window before it surfaces.',
        coverage: 'Acute Stress is continuous all day; chronic markers update on their own cadence (overnight or on-demand for Antioxidant).',
        hardware: 'GW4 / GW5 / GW6: core BioActive (PPG + ECG + BIA). GW7 / GW Ultra (2024): enhanced BioActive + AGEs + Energy Score. GW8 / GW8 Classic (July 2025): adds Vascular Load and Antioxidant Index.',
        strength: 'Dual HRV + EDA on the same chip catches sympathetic arousal HRV-only watches miss. Only consumer wearable measuring skin carotenoids and vascular stiffness.',
        limitation: 'EDA can\'t tell positive arousal (excitement) from negative arousal (anxiety) — detects activation, not valence. Common errors: Antioxidant Index is GW8 series only (not GW Ultra, not GW7); the new chronic-stress markers have limited independent validation.',
        color: '#22C55E'
      },
      google: {
        name: 'Google Pixel Watch',
        scoreName: 'Stress Management Score',
        modelLine: 'cEDA + ML across 4 signals',
        sensors: { hrv: true, hr: true, eda: true, skinTemp: true, spo2: false, rr: false, sleep: false },
        algorithm: 'Continuous EDA (cEDA) + skin temperature + HRV + HR feed into a machine-learning model trained on lab-induced social stress tests (mock interviews, surprise math tests — Trier-style protocols). First consumer all-day on-wrist EDA, introduced in 2022. The model distinguishes exercise from stress automatically; Body Response alerts surface acute sympathetic spikes in real time.',
        scale: 'Body Response alerts + 1–100 daily Stress Management Score across 12 sub-metrics in 3 categories (exertion balance, sleep patterns, responsiveness).',
        baseline: 'ML baseline built over your first month of wear.',
        coverage: 'Continuous all-day cEDA.',
        hardware: 'Pixel Watch 1 (2022) shipped without an EDA sensor — only HRV and Stress Management Score. Pixel Watch 2 (2023) and Pixel Watch 3 (2024) added the same cEDA hardware Fitbit Sense 2 uses.',
        strength: 'Continuous on-wrist EDA paired with skin temp catches stress events HRV-only devices miss entirely. ML model trained on real social-evaluative threat tasks, not just self-report.',
        limitation: 'cEDA is sensitive to ambient heat and humidity, which shows up as elevated tonic stress on hot days. Like all EDA, it reads sympathetic activation — it cannot tell anxiety from excitement.',
        color: '#16A34A'
      },
      fitbit: {
        name: 'Fitbit Sense 2',
        scoreName: 'Stress Management Score',
        modelLine: 'cEDA + ML Stress Management Score',
        sensors: { hrv: true, hr: true, eda: true, skinTemp: true, spo2: false, rr: false, sleep: false },
        algorithm: 'Identical cEDA + ML pipeline to Pixel Watch 2/3 — Google\'s engineering across both product lines. Daily Stress Management Score blends 12 metrics across exertion balance, sleep patterns, and responsiveness; Body Response alerts fire for acute sympathetic spikes.',
        scale: 'Body Response alerts + 1–100 daily Stress Management Score.',
        baseline: 'ML baseline built over your first month of wear.',
        coverage: 'Continuous all-day cEDA. Premium subscription unlocks deeper analysis breakdowns.',
        hardware: 'Fitbit Sense (Gen 1, 2020) was sEDA only — a manual 2-minute palm-on-watch spot-check. Fitbit Sense 2 (2022) introduced cEDA, the same hardware shared with Pixel Watch 2/3.',
        strength: 'Same cEDA hardware as Pixel Watch with a richer Fitbit dashboard — historically the most polished daily stress breakdown in consumer wearables.',
        limitation: 'Same heat/humidity confounder as Pixel Watch. Best signal quality and full insights require Premium subscription.',
        color: '#16A34A'
      },
      whoop: {
        name: 'WHOOP',
        scoreName: 'Stress Monitor',
        modelLine: 'Recovery + Stress Monitor (lnRMSSD)',
        sensors: { hrv: true, hr: true, eda: false, skinTemp: true, spo2: true, rr: true, sleep: false },
        algorithm: 'RMSSD is measured during the deepest period of overnight sleep, then natural-log-transformed (lnRMSSD) — standard practice for longitudinal HRV monitoring, since raw RMSSD is heteroscedastic. Recovery blends lnRMSSD, RHR, respiratory rate, sleep performance, and (on 4.0+) SpO2 and skin temperature. Stress Monitor compares live HR + HRV to a 14-day baseline. Motion-aware: a February 2026 re-architecture of the motion-artifact separation layer materially sharpened HR accuracy during running and reduced spurious spikes outside activity, with downstream cleanups to Recovery, Strain, and Sleep. The in-app Journal logs 160+ behaviors and perceived stress; Recovery Impacts surfaces correlations between logged behaviors and next-day HRV, RHR, recovery, and sleep-stage durations. Research on 11,000+ members showed that stress mindset (challenge vs. threat) measurably shifts recovery.',
        scale: 'Stress Monitor 0–3 (0–1 low / 1–2 med / 2–3 high)  ·  Recovery 0–100%',
        baseline: '14-day rolling personal lnRMSSD and respiratory-rate baseline.',
        coverage: 'Real-time. Stress Monitor requires Peak or Life membership (not on base WHOOP One). Recovery is the overnight calc.',
        hardware: 'WHOOP 4.0 / 5.0 / MG — high-frequency wrist PPG + skin temp + SpO2. Strapless form factor enables overnight skin-contact uptime that wrist watches can\'t match.',
        validation: 'WHOOP-derived lnRMSSD day-to-day variability sits within or below alternative reference-protocol ranges (PMC9505647, Olympic water polo cohort). PPG-based HR/HRV validated vs ECG (PMC8160717), with strong agreement at rest and degraded agreement under motion pre-Feb-2026 — that update specifically targeted the motion failure mode.',
        strength: 'Overnight respiratory rate is one of the cleanest overtraining and illness flags in any consumer wearable. lnRMSSD math is the most rigorous longitudinal HRV pipeline shipped on a consumer device. Journal + Recovery Impacts is the only built-in behavior-to-physiology correlation system.',
        limitation: 'No EDA — daytime sympathetic spikes only show up indirectly via HR + HRV. Common error: WHOOP\'s Stress Monitor is 0–3, not 0–100; Recovery is 0–100%. The two are different metrics on different scales.',
        color: '#0F766E'
      },
      apple: {
        name: 'Apple Watch',
        scoreName: 'HRV (HealthKit SDNN) — no native stress score',
        modelLine: 'SDNN in HealthKit · third-party apps build scores',
        sensors: { hrv: true, hr: true, eda: false, skinTemp: false, spo2: false, rr: false, sleep: false },
        algorithm: 'No native stress score as of watchOS 11 / 12 / 26. HealthKit exposes HRV as SDNN (Standard Deviation of NN intervals — not RMSSD), measured automatically when the user is still. Third-party apps build scores on top: Athlytic computes RMSSD if enabled (else SDNN) plus RHR against a 60-day rolling baseline; Welltory runs frequency-domain analysis (LF / HF / VLF power) on ≥300 RR-interval measurements against personal + population norms.',
        scale: 'N/A native. Athlytic / Welltory / StressWatch / Livity each apply their own scale.',
        baseline: 'No native baseline. Athlytic\'s 60-day rolling baseline is computed on iPhone and synced; Welltory blends personal and population norms.',
        coverage: 'HRV is sampled approximately every 4 hours by default, only when the user is still. Bumps to every 2 hours with Irregular Rhythm Notifications enabled, every 15 minutes with AFib History enabled. The default cadence is too sparse for tight stress tracking — frequent users typically force readings via Mindfulness sessions.',
        hardware: 'Series 6+ — green/red/IR PPG. Series 4+ supports ECG (single-lead, on-demand). Series 9 / Ultra 2 are the validation-study reference points in recent literature.',
        validation: 'Series 9 / Ultra 2 vs Polar H10 + Kubios (Sensors 2024, n=39, 316 measurements): SDNN underestimated by mean 8.31 ms; MAPE 28.88%; MAE 20.46 ms — failed the ±10 ms equivalence margin. RHR was much closer: MAPE 5.91%, MAE 3.73 bpm, mean difference −0.1 bpm. Heart rate accuracy (Series 6+, npj Digital Medicine 2025 living meta): BPM MAPE 1.16% to 6.46%, limits of agreement −3.68 to 2.59 bpm — activity-dependent. Apple Watch ECG for stress detection: F1-weighted scores 52–64% (Mishra et al. 2022, pilot).',
        strength: 'Largest third-party app ecosystem and the most flexible HealthKit data plumbing — pair it with Athlytic, Welltory, or Bevel for the score you actually want.',
        limitation: 'No native stress feature, so every "Apple Watch stress score" you see is a third-party computation. HRV is reported as SDNN, not RMSSD — the two are different summary statistics. The widely repeated "Apple Watch error is 1–4%" line cherry-picks the low end of a 1.16–6.46% range. Default 4-hour sampling is too coarse for stress without manual readings.',
        color: '#18181B'
      },
      polar: {
        name: 'Polar',
        scoreName: 'Nightly Recharge',
        modelLine: 'Nightly Recharge / ANS Charge',
        sensors: { hrv: true, hr: true, eda: false, skinTemp: false, spo2: false, rr: true, sleep: false },
        algorithm: 'Nightly Recharge measures the first ~4 hours of sleep using HR + RMSSD + breathing rate against a 28-day baseline. ANS Charge is the autonomic component on a −10 to +10 scale; Sleep Charge is the architectural component. There is no daytime stress score — Polar\'s entire framing is recovery from the prior day.',
        scale: 'ANS Charge −10 to +10  ·  Sleep Charge component score',
        baseline: '28-day personal ANS Charge baseline anchored to your own overnight history — the most personalized baseline window in consumer wearables.',
        coverage: 'Overnight only. No continuous daytime tracking.',
        hardware: 'Vantage V3 and Grit X2 Pro use wrist PPG; the optional H10 chest strap is the lab-reference standard used in most peer-reviewed wearable validation studies.',
        strength: 'Overnight RR + HRV + HR together is a strong, clean recovery signal. The 28-day baseline anchors readings to your own physiology rather than a population norm. Pairing with H10 chest strap upgrades the pipeline to lab quality.',
        limitation: 'No daytime score at all. If you want acute stress in real time, Polar isn\'t the device.',
        color: '#334155'
      },
      coros: {
        name: 'COROS',
        scoreName: 'Daily Stress',
        modelLine: 'HRV + HR every 5 min vs individual baseline',
        sensors: { hrv: true, hr: true, eda: false, skinTemp: false, spo2: false, rr: false, sleep: false },
        algorithm: 'Proprietary stress model — HR + HRV sampled every 5 minutes during inactivity, compared to an individual baseline. Pairs with COROS Training Readiness to feed into next-workout decisions.',
        scale: '0–100 Daily Stress · Training Readiness composite',
        baseline: 'Individual personal baseline; tightly coupled to training load.',
        coverage: 'Every 5 minutes when still. Pauses during workouts (the data feeds Training Readiness instead).',
        hardware: 'PACE 3, APEX 2, VERTIX 2 series — wrist optical PPG.',
        strength: 'Tight integration with Training Readiness for endurance athletes. Less marketing-driven than competitors — the framing is performance, not "wellness."',
        limitation: 'HRV + HR only — no EDA, no skin temp, no SpO2 in the stress pipeline. Less independent peer-reviewed validation than Garmin / WHOOP / Apple. Best fit for athletes already tracking training load.',
        color: '#DC2626'
      },
      amazfit: {
        name: 'Amazfit',
        scoreName: 'Stress Index',
        modelLine: 'RMSSD-based HRV + proprietary stress model',
        sensors: { hrv: true, hr: true, eda: false, skinTemp: false, spo2: false, rr: false, sleep: false },
        algorithm: 'Auto-measures RMSSD-derived HRV every 5 minutes, feeds it into a proprietary stress model. Some models add Zepp-branded readiness and sleep-quality scores layered on the same signal.',
        scale: '0–100 Stress Index',
        baseline: 'Personalized rolling baseline.',
        coverage: 'Every 5 minutes when still.',
        hardware: 'GTR / GTS / T-Rex / Balance series — wrist optical PPG.',
        strength: 'The most affordable serious HRV-based stress tracking on the market — usable HRV pipeline at sub-$200 price points.',
        limitation: 'HRV + HR only, minimal independent validation in peer-reviewed literature. Best treated as a longitudinal personal-baseline tool — don\'t over-interpret single readings.',
        color: '#F97316'
      }
    };
  }

  get _metricMeta() {
    return {
      hrv:      { label: 'HRV',         short: 'HRV' },
      hr:       { label: 'Heart Rate',  short: 'HR' },
      eda:      { label: 'EDA',         short: 'EDA' },
      skinTemp: { label: 'Skin Temp',   short: 'Skin Temp' },
      rr:       { label: 'Resp. Rate',  short: 'Resp' },
      spo2:     { label: 'SpO₂',        short: 'SpO₂' },
      sleep:    { label: 'Sleep arch.', short: 'Sleep' }
    };
  }

  get _deviceMetrics() {
    return {
      oura:    ['hrv', 'hr', 'skinTemp', 'sleep'],
      garmin:  ['hrv', 'hr'],
      samsung: ['hrv', 'hr', 'eda'],
      google:  ['hrv', 'hr', 'eda', 'skinTemp'],
      fitbit:  ['hrv', 'hr', 'eda', 'skinTemp'],
      whoop:   ['hrv', 'hr', 'rr', 'skinTemp', 'spo2'],
      apple:   ['hrv', 'hr'],
      polar:   ['hrv', 'hr', 'rr'],
      coros:   ['hrv', 'hr'],
      amazfit: ['hrv', 'hr']
    };
  }

  get _metricFactors() {
    // Source: Wearable_Stress_Research_Consolidated.md
    // Every claim is sourced to peer-reviewed primary research or official
    // device documentation. Non-peer-reviewed secondary sources removed in
    // the May 2026 revision and replaced with primary research.
    const SRC = {
      // HRV — generalist references
      frontiers2024:     { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/', label: 'Frontiers in Physiology 2024 — Factors Influencing HRV (PMC11333334)' },
      hrvExercise:       { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/',  label: 'HRV & exercise meta-analysis (PMC8950456)' },
      chronicStress:     { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/',  label: 'Chronic stress & HRV (PMC9974008)' },
      hrvFactorsReview:  { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11439429/', label: 'HRV measurement & influencing factors (PMC11439429)' },

      // Resting heart rate
      rhrFactors:        { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/',  label: 'RHR factors in free-living adults (PMC9549087)' },
      rhrExercise:       { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/',  label: 'Exercise & RHR meta-analysis (PMC6306777)' },
      sedentaryMeta:     { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8391190/',  label: 'Sedentary time & HR/HRV meta-analysis (PMC8391190)' },
      stressAcute:       { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6821413/',  label: 'Acute psychosocial stress & HRV (PMC6821413)' },
      liebermeister:     { url: 'https://pubmed.ncbi.nlm.nih.gov/31345594/',         label: 'Body temperature & heart rate — Liebermeister (PubMed 31345594)' },

      // Alcohol
      alcoholRmssd:      { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4971776/',  label: 'Alcohol dose-response on RMSSD — Brunetti (PMC4971776)' },
      alcoholReal:       { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5878366/',  label: 'Real-world alcohol effect on overnight HRV — Pietilä (PMC5878366)' },
      alcoholThermo:     { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11391823/', label: 'Alcohol & thermoregulation review (PMC11391823)' },
      alcoholSleep:      { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5821259/',  label: 'Alcohol & the sleeping brain — Colrain (PMC5821259)' },
      alcoholSleepMeta:  { url: 'https://www.sciencedirect.com/science/article/pii/S1087079224001345', label: 'Alcohol & sleep meta-analysis 2024 (S1087079224001345)' },

      // Caffeine
      caffeineHrv:       { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/', label: 'Caffeine & HRV meta-analysis — Costa (PMC11284693)' },
      caffeineCohort:    { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5537855/',  label: 'Coffee & HRV — ELSA-Brasil cohort (PMC5537855)' },
      caffeineCardio:    { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11648991/', label: 'Caffeine cardiovascular response review (PMC11648991)' },
      caffeineHrPub:     { url: 'https://pubmed.ncbi.nlm.nih.gov/24203773/',         label: 'Caffeine effects on BP & HR (PubMed 24203773)' },
      caffeineRr:        { url: 'https://pubmed.ncbi.nlm.nih.gov/2312473/',          label: 'Caffeine & ventilatory responses — D\'Urzo (PubMed 2312473)' },
      caffeineSleep:     { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9541543/',  label: 'Adenosine, caffeine & sleep regulation — Reichert (PMC9541543)' },

      // Hydration
      hydrationCardio:   { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2343381/',  label: 'Hydration & post-exercise cardiovascular control — Charkoudian (PMC2343381)' },
      hydrationNature:   { url: 'https://www.nature.com/articles/s41598-019-52775-5', label: 'Hydration, autonomic adaptation & mood — Nature 2019' },

      // Body weight
      weightHrv:         { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8072942/',  label: 'Obesity, nutrition & HRV review (PMC8072942)' },
      weightLossHrv:     { url: 'https://www.sciencedirect.com/science/article/abs/pii/S026156142200334X', label: 'Weight loss via lifestyle changes & HRV systematic review' },
      obesityRhr:        { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8260607/',  label: 'Elevated RHR, inflammation & CV risk in obesity (PMC8260607)' },

      // Cold exposure
      coldHrv:           { url: 'https://www.sciencedirect.com/science/article/abs/pii/S0306456524000755', label: 'Cold exposure & cardiac autonomic control — Bouzigon meta-analysis 2024' },

      // Skin temperature
      skinTempStress:    { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4664114/',  label: 'Skin temperature & acute stress (PMC4664114)' },
      skinTempAmbient:   { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9690349/',  label: 'Skin temp & ambient confounds (PMC9690349)' },
      skinTempSleep:     { url: 'https://www.nature.com/articles/s41746-026-02633-2', label: 'Wearable skin temp during sleep — Nature 2026' },
      skinTempDepression:{ url: 'https://www.sciencedirect.com/science/article/pii/S2666915325000071', label: 'EDA & skin temp in depression — ScienceDirect 2025' },
      vasodilation:      { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5356216/',  label: 'Active vasodilation in human skin (PMC5356216)' },
      heatStress:        { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9394784/',  label: 'Human temperature regulation under heat stress (PMC9394784)' },
      menstrualBaker:    { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7575238/',  label: 'Temperature regulation across the menstrual cycle — Baker (PMC7575238)' },
      menstrualWrist:    { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11452339/', label: 'Wrist skin temp across the menstrual cycle (PMC11452339)' },

      // Fever / illness HR & RR
      feverHrRr:         { url: 'https://pubmed.ncbi.nlm.nih.gov/31536050/',         label: 'Fever raises HR & RR (PubMed 31536050)' },

      // EDA
      edaSenses:         { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10575214/', label: 'Five senses evoke EDA (PMC10575214)' },
      edaArousal:        { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9333288/',  label: 'EDA characterizes autonomic NS in real time (PMC9333288)' },
      edaCognitive:      { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9573480/',  label: 'EDA features for mental effort — Posada-Quintero (PMC9573480)' },
      edaArousalBradley: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6287044/',  label: 'Arousal, pupil, HR & skin conductance — Bradley (PMC6287044)' },
      edaThermo:         { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4977170/',  label: 'Preoptic activation & thermal sweating — Farrell (PMC4977170)' },
      edaMindfulness:    { url: 'https://pubmed.ncbi.nlm.nih.gov/32367339/',         label: 'Mindfulness predicts SCR to stress — Lin (PubMed 32367339)' },
      edaHabituation:    { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3883934/',  label: 'EDA habituation — latent class approach (PMC3883934)' },
      edaDehydration:    { url: 'https://pubmed.ncbi.nlm.nih.gov/39294847/',         label: 'Mild dehydration does not alter sweat electrolytes — Baker (PubMed 39294847)' },

      // Respiratory rate
      rrStress:          { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5577533/',  label: 'Ventilatory response to stress — Grassmann (PMC5577533)' },
      rrPain:            { url: 'https://pubmed.ncbi.nlm.nih.gov/28240995/',         label: 'Pain & respiration systematic review — Jafari (PubMed 28240995)' },
      rrPainSci:         { url: 'https://www.sciencedirect.com/science/article/abs/pii/S0735675719300385', label: 'RR most strongly reflects pain intensity (S0735675719300385)' },
      rrMeditation:      { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10741869/', label: 'Breathing practices for stress & anxiety — Hopper (PMC10741869)' },
      rrCardioFit:       { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6465339/',  label: 'Pulse-respiration quotient (PMC6465339)' },
      rrCardioFreq:      { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5732209/',  label: 'Respiratory frequency review (PMC5732209)' },
      rrSleepVar:        { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5027356/',  label: 'RR variability in healthy sleep — Lechat (PMC5027356)' },
      overtraining:      { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11235883/', label: 'Monitoring fatigue with HR & subjective measures — Schmitt (PMC11235883)' },

      // SpO2
      altitudeSpo2:      { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9697047/',  label: 'High-altitude SpO2 review (PMC9697047)' },
      apneaOdi:          { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10250969/', label: 'Oxygen Desaturation Index as OSA marker (PMC10250969)' },
      spo2Pneumonia:     { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10044291/', label: 'Pulse oximetry & pneumonia (PMC10044291)' },
      spo2Bts:           { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/',  label: 'BTS guideline for oxygen use in adults (PMC5531304)' },
      smokingCohb:       { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6013732/',  label: 'Carboxyhemoglobin in smokers — Hampson (PMC6013732)' },

      // Sleep architecture
      mealsSleep:        { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8131073/',  label: 'Dinner timing & sleep stages (PMC8131073)' },
      mealsSleepReview:  { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11293727/', label: 'Meal timing & sleep quality review (PMC11293727)' },
      screensSleep:      { url: 'https://pubmed.ncbi.nlm.nih.gov/21164152/',         label: 'Blue light & dose-dependent melatonin suppression — Brainard (PubMed 21164152)' },
      screensSleepRev:   { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9424753/',  label: 'Blue light, sleep & wellbeing systematic review (PMC9424753)' },

      // Manufacturer / official documentation
      polarRR:           { url: 'https://support.polar.com/us-en/nightly-recharge-recovery-measurement', label: 'Polar — Nightly Recharge' },
      whoopRecovery:     { url: 'https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/', label: 'WHOOP — Recovery 101' },
      ouraCumulative:    { url: 'https://ouraring.com/blog/what-is-cumulative-stress/', label: 'Oura — Cumulative Stress' }
    };

    return {
      hrv: [
        {
          key: 'hrv-sleep', name: 'Consistent sleep (7–9 hrs)', direction: 'positive', impact: 'high',
          plainEnglish: 'Sleep is the single biggest lever you have for HRV. Your overnight reading is essentially a scoreboard for how well your nervous system reset — short or fragmented sleep means it didn\'t, and your stress score climbs the next day. Chronic short sleepers see HRV depressed for weeks, but consistency rebuilds the baseline fast.',
          magnitude: 'Roughly 15–30% RMSSD increase within 4 weeks of consistent 7–9 hour sleep. Effect compounds over months.',
          mechanism: 'During deep and REM sleep, parasympathetic (vagal) tone takes over and beat-to-beat variability widens. Cut sleep short and you wake up locked in sympathetic dominance, which suppresses HRV all day.',
          whatToDo: 'Protect 7–9 hours, with consistent bed and wake times. Keep the room cool and dark, no caffeine after 2 PM, and screen-light off in the last hour before bed.',
          source: SRC.frontiers2024
        },
        {
          key: 'hrv-aerobic', name: 'Aerobic exercise (150 min/wk)', direction: 'positive', impact: 'high',
          plainEnglish: 'Of everything you can do for HRV, consistent aerobic training has the most evidence behind it. It physically remodels your heart and your autonomic nervous system over weeks and months — there\'s no app, supplement, or cold plunge with anywhere near this much data.',
          magnitude: 'Significant long-term HRV gain — typically 10–20% over 8–12 weeks of consistent training, with continued improvement past 6 months.',
          mechanism: 'Aerobic training increases stroke volume (more blood per beat) and shifts your autonomic balance toward parasympathetic dominance. Both raise resting HRV and lower resting heart rate.',
          whatToDo: '150 min/week of moderate cardio (zone 2 — conversational pace) is the floor. Mix in 1–2 higher-intensity sessions for VO₂max gains. Build slowly to avoid overtraining.',
          source: SRC.hrvExercise
        },
        {
          key: 'hrv-meditation', name: 'Meditation / breathwork', direction: 'positive', impact: 'med',
          plainEnglish: 'Slow breathing isn\'t woo — it\'s a direct line to your vagus nerve. Five to ten minutes of breathwork at around six breaths per minute can bump your HRV measurably within minutes, and consistent practice raises your baseline over weeks.',
          magnitude: 'Acute HRV bump within minutes of practice; chronic baseline lift of 5–10% over 4–8 weeks of daily practice.',
          mechanism: 'Breathing at ~6 breaths/min synchronizes heart rhythm with breath rhythm — a state called resonance — which maximally engages the vagus nerve and parasympathetic output.',
          whatToDo: '5–10 min of slow-paced breathing daily. Box breathing (4-4-4-4), 4-7-8, or any app that paces you to ~6 breaths/min. Pre-bed timing compounds with sleep benefits.',
          source: SRC.frontiers2024
        },
        {
          key: 'hrv-weight', name: 'Healthy body weight', direction: 'positive', impact: 'med',
          plainEnglish: 'Carrying excess body weight keeps your sympathetic nervous system slightly elevated all the time, even at rest. Sustainable weight loss — not crash dieting — restores autonomic balance and lifts HRV measurably over months.',
          magnitude: 'Modest weight loss (~3.9 kg) produces measurable HRV improvement. Larger effects in those starting from higher BMI.',
          mechanism: 'Adipose tissue produces inflammatory cytokines and raises sympathetic tone. Sustainable loss restores sympathovagal balance: more parasympathetic, less sympathetic.',
          whatToDo: 'Protein-forward eating, daily walks, gradual caloric deficit (≤1% body weight per week). Crash diets temporarily lower HRV — slow and steady wins here.',
          source: SRC.weightHrv
        },
        {
          key: 'hrv-hydration', name: 'Hydration', direction: 'positive', impact: 'low',
          plainEnglish: 'Being chronically under-hydrated keeps your blood volume low, which forces your heart to work a little harder all day and bumps HRV down. The effect is small but consistent — easy win if your overnight readings are mediocre and you\'re routinely thirsty.',
          magnitude: 'Hypohydration raises resting HR by ~5.8 bpm and lowers HRV; rehydration restores parasympathetic balance.',
          mechanism: 'Reduced plasma volume increases sympathetic drive to maintain blood pressure. Adequate hydration restores stroke volume and vagal tone.',
          whatToDo: 'Drink to thirst plus a baseline — rough rule, half your body weight in ounces per day. Add electrolytes (sodium, potassium) if you sweat heavily or train in heat.',
          source: SRC.hydrationCardio
        },
        {
          key: 'hrv-cold', name: 'Cold exposure (controlled)', direction: 'positive', impact: 'low',
          plainEnglish: 'A brief cold shower or face-dunk gives your vagus nerve a quick jolt — useful as an acute stress-management tool, but not a long-term HRV builder. Don\'t overdo it; chronic cold exposure can backfire and raise sympathetic tone.',
          magnitude: 'Acute vagal stimulation — meta-analysis (Bouzigon 2024) shows transient HRV bump that fades within hours. No durable baseline change from cold alone.',
          mechanism: 'Cold water on the face triggers the mammalian dive reflex — heart rate drops sharply and parasympathetic output spikes within seconds.',
          whatToDo: '30–60 seconds of cold water (face splash or whole-body) in the morning is plenty. Skip if you have cardiovascular conditions or untreated hypertension.',
          source: SRC.coldHrv
        },
        {
          key: 'hrv-alcohol', name: 'Alcohol', direction: 'negative', impact: 'high',
          plainEnglish: 'Alcohol crushes HRV harder than almost anything else you can do. Even one drink suppresses your nervous system through the night, and the bigger the dose, the bigger the hit. If your HRV is suddenly tanking with no other explanation, look here first.',
          magnitude: 'Dose-dependent RMSSD drop: ~2.0 ms (low dose), ~5.7 ms (moderate), ~12.9 ms (high dose). Acute autonomic effect persists up to ~10 hours.',
          mechanism: 'Alcohol directly suppresses parasympathetic activity and disrupts deep sleep — both crater overnight HRV. Liver metabolism keeps sympathetic tone elevated for hours after the last drink.',
          whatToDo: 'Treat each drink as an overnight HRV cost. A few alcohol-free nights per week recover the most. Cut off 3+ hours before bed if you do drink.',
          source: SRC.alcoholRmssd
        },
        {
          key: 'hrv-sleep-dep', name: 'Sleep deprivation', direction: 'negative', impact: 'high',
          plainEnglish: 'Pull a short night and your HRV the next morning will show it — sometimes for several days, especially if it\'s a pattern. Sleep debt is the most common reason recovery scores look bad even when you didn\'t do anything else wrong.',
          magnitude: 'Significant acute RMSSD reduction the next morning; cumulative effect across consecutive short nights.',
          mechanism: 'Short or fragmented sleep stops the nightly autonomic reset. You wake up locked in sympathetic dominance, which suppresses HRV all day and keeps cortisol elevated.',
          whatToDo: 'Protect 7–9 hours. If you can\'t, even a 20-minute daytime nap recovers some autonomic ground. Don\'t try to "make up" sleep on weekends — consistency beats catch-up.',
          source: SRC.frontiers2024
        },
        {
          key: 'hrv-overtraining', name: 'Overtraining', direction: 'negative', impact: 'high',
          plainEnglish: 'Pushing past your recovery capacity will tank HRV — and your wearable will see it days before you feel burned out. Watch for HRV trending down across a week or two of hard training; that\'s the actual overtraining signal, not how tired you feel today.',
          magnitude: 'Progressive HRV decline over days to weeks of accumulated load. Recovery requires reducing volume, not just one rest day.',
          mechanism: 'Excessive training without recovery keeps cortisol and sympathetic tone elevated. Vagal tone drops, HRV drops with it, and the longer it goes the harder the rebound.',
          whatToDo: 'If your 7-day HRV trend is down 10%+, take a deload week — easier zone-2 sessions, more sleep, more protein. Keep training at 50–70% of normal volume until HRV rebounds.',
          source: SRC.hrvExercise
        },
        {
          key: 'hrv-chronic-stress', name: 'Chronic psychological stress', direction: 'negative', impact: 'high',
          plainEnglish: 'The grind — work pressure, relationship stress, financial worry — sits on your nervous system 24/7. Unlike acute stress, which spikes and resolves, chronic stress keeps HRV suppressed for weeks or months until you address the source. Your wearable can\'t fix this, but it will tell you when it\'s real.',
          magnitude: 'Sustained RMSSD/SDNN reduction lasting weeks to months. Larger effects with longer duration and higher subjective intensity.',
          mechanism: 'Chronic cortisol exposure and sustained sympathetic activation suppress vagal output. Brain-body inflammation can compound the effect.',
          whatToDo: 'Address the source where you can. Otherwise: daily breathwork, regular cardio, social connection, and therapy. Don\'t expect HRV to recover until the stressor eases.',
          source: SRC.chronicStress
        },
        {
          key: 'hrv-illness', name: 'Illness / inflammation', direction: 'negative', impact: 'high',
          plainEnglish: 'Your immune system burns through resources fighting infection — including the autonomic resources that keep HRV up. A sudden HRV drop with no obvious lifestyle cause is often the first sign you\'re getting sick, sometimes 24–48 hours before symptoms appear.',
          magnitude: 'Significant drop during acute illness, often 1–2 days before subjective symptoms. Recovery tracks with illness resolution.',
          mechanism: 'Cytokines and inflammatory signaling activate the sympathetic nervous system. The body redirects resources toward immune response, which suppresses vagal output.',
          whatToDo: 'Take HRV drops as a real signal. Rest, hydrate, eat well, and skip hard training even before you "feel" sick. Most people would catch illness earlier if they trusted the data.',
          source: SRC.frontiers2024
        },
        {
          key: 'hrv-caffeine', name: 'Caffeine', direction: 'variable', impact: 'low',
          plainEnglish: 'Caffeine\'s effect on HRV is more nuanced than the wellness internet suggests. Moderate doses don\'t reliably move HRV in healthy adults; the bigger risk is timing — late caffeine compresses sleep, and bad sleep is what actually crushes HRV. Heavy chronic intake (3+ cups/day) shows a possible reduction, but it\'s confounded by sleep, stress, and CYP1A2 genetics.',
          magnitude: 'Mixed/inconsistent. Acute moderate doses: minimal direct HRV effect. Chronic high intake (≥3 cups/day) shows possible reduction in some cohorts, confounded by other habits.',
          mechanism: 'Caffeine blocks adenosine receptors and stimulates sympathetic activity. Half-life is 5–6 hours, so a 3 PM coffee still has half its dose at 9 PM — meaning the overnight HRV hit usually comes via degraded sleep, not direct autonomic suppression.',
          whatToDo: 'Cap at ~400 mg/day (≈3 cups), nothing past 2 PM. If you\'re shaky or anxious from coffee, your dose is too high. Track your own HRV on coffee vs no-coffee days — sensitivity varies a lot by genotype.',
          source: SRC.caffeineHrv
        }
      ],
      hr: [
        {
          key: 'hr-cardio-fit', name: 'Cardio fitness', direction: 'positive', impact: 'high',
          plainEnglish: 'Resting heart rate is essentially a fitness scoreboard. Trained athletes run 40–55 bpm at rest, sedentary adults 70–80. Lower is generally better — it means your heart pumps more blood per beat and works less to keep you alive.',
          magnitude: 'Strongest single factor — every additional ~10 ml/kg/min of VO₂max drops resting HR roughly 3 bpm. Trained adults often sit 15–25 bpm below sedentary peers.',
          mechanism: 'Endurance training thickens the heart wall and expands stroke volume. Each beat moves more blood, so fewer beats are needed at rest. Vagal tone also rises, slowing the resting rate further.',
          whatToDo: 'Build aerobic base — zone 2 (conversational pace) cardio, 150+ min/week. Resting HR drops within 4–8 weeks of consistent training and continues for months.',
          source: SRC.rhrExercise
        },
        {
          key: 'hr-sleep', name: 'Adequate sleep', direction: 'positive', impact: 'med',
          plainEnglish: 'Bad sleep raises your morning heart rate — sometimes more after a really short night. Your wearable\'s morning RHR is essentially a sleep-quality readout that shows up before you\'ve even had coffee.',
          magnitude: 'Elevated next-day RHR after poor sleep. Effect compounds across consecutive short nights.',
          mechanism: 'Sleep deprivation shifts autonomic balance toward sympathetic dominance, raising baseline heart rate even at rest. Cortisol stays elevated, which keeps HR elevated with it.',
          whatToDo: 'Protect 7–9 hours. Watch your morning RHR — if it\'s a few bpm above baseline, your sleep was poor regardless of what your sleep score says.',
          source: SRC.rhrFactors
        },
        {
          key: 'hr-weight', name: 'Healthy body weight', direction: 'positive', impact: 'med',
          plainEnglish: 'Carrying excess body weight elevates resting heart rate at every age — and weight loss reliably brings it back down. The mechanism runs through both reduced sympathetic overactivity and lower inflammatory load on the cardiovascular system.',
          magnitude: 'RHR is significantly higher in obese vs non-obese adults. Weight loss reduces RHR; effect proportional to amount lost.',
          mechanism: 'Adipose tissue raises sympathetic tone and circulating inflammatory markers, which together push the resting heart to work harder. Sustainable loss reverses both.',
          whatToDo: 'Protein-forward eating, daily walks, gradual caloric deficit (≤1% body weight per week). Crash diets temporarily raise HR — slow and steady wins.',
          source: SRC.obesityRhr
        },
        {
          key: 'hr-hydration', name: 'Hydration', direction: 'positive', impact: 'low',
          plainEnglish: 'Being chronically under-hydrated keeps blood volume low, which makes the heart work harder to maintain output — and bumps RHR up. The fix is small but immediate: rehydrate and your morning reading drops back to baseline.',
          magnitude: 'Hypohydration raises resting HR by ~5.8 bpm; rehydration restores stroke volume and lowers HR back to baseline.',
          mechanism: 'Reduced plasma volume increases sympathetic drive to maintain blood pressure. Hydration restores stroke volume so each beat moves more blood, requiring fewer beats.',
          whatToDo: 'Drink to thirst plus a baseline — rough rule, half your body weight in ounces per day. Add electrolytes (sodium, potassium) if you sweat heavily or train in heat.',
          source: SRC.hydrationCardio
        },
        {
          key: 'hr-sedentary', name: 'Sedentary lifestyle', direction: 'negative', impact: 'high',
          plainEnglish: 'Sitting all day deconditions your heart. Resting heart rate creeps up over weeks and months, which is why most desk-workers see RHR in the 70s while their athletic friends sit in the 50s. The fix isn\'t one workout — it\'s consistent movement.',
          magnitude: 'Meta-analysis: each additional hour of sedentary time raises RHR by ~0.24 bpm. Effect compounds across a typical workday.',
          mechanism: 'Without aerobic stress, the heart doesn\'t develop stroke volume capacity. Smaller stroke volume means more beats per minute to push the same blood — both at rest and during activity. Sedentary time also reduces parasympathetic modulation.',
          whatToDo: 'Daily walks (8K+ steps), structured cardio 3–4x/week. Stand up and move every 30–60 minutes during desk work — even brief breaks shift the day.',
          source: SRC.sedentaryMeta
        },
        {
          key: 'hr-caffeine', name: 'Caffeine / stimulants', direction: 'negative', impact: 'med',
          plainEnglish: 'Coffee acutely bumps your heart rate for a few hours via sympathetic activation. Tolerance develops with daily use, but pre-workout, energy drinks, or first-thing-in-the-morning caffeine before measurement will skew your "resting" reading upward.',
          magnitude: 'Acute transient HR increase, with size varying by dose and habituation. Bigger spikes from energy drinks and stimulant stacks than from coffee alone.',
          mechanism: 'Caffeine inhibits phosphodiesterase (raising cAMP and cardiac contractility) and antagonizes adenosine receptors. Heart rate rises and stays elevated for 3–6 hours per dose.',
          whatToDo: 'Measure RHR before coffee, not after. Avoid stimulants 4+ hours before workouts you want to track accurately. Limit late-day caffeine to protect overnight readings.',
          source: SRC.caffeineCardio
        },
        {
          key: 'hr-alcohol', name: 'Alcohol', direction: 'negative', impact: 'med',
          plainEnglish: 'Alcohol raises heart rate the night you drink AND the morning after. Your wearable\'s morning RHR will show every late-night session, sometimes for more than a day.',
          magnitude: 'Acute and next-day HR elevation. Heavier drinking sessions keep RHR elevated longer.',
          mechanism: 'Alcohol triggers vasodilation, which forces the heart to work harder to maintain blood pressure. Recovery (liver metabolism, dehydration) requires extra cardiac work for hours after the last drink.',
          whatToDo: 'Treat each drink as an overnight HR cost. Hydrate during and after — water helps but doesn\'t eliminate the effect. A few alcohol-free nights/week recover the most.',
          source: SRC.rhrFactors
        },
        {
          key: 'hr-heat', name: 'Heat / dehydration', direction: 'negative', impact: 'med',
          plainEnglish: 'Hot weather and dehydration both raise heart rate at rest. Athletes call it "cardiac drift" — same effort, higher HR. If your morning readings spike on hot days, this is why; it\'s not stress.',
          magnitude: 'Hypohydration alone raises resting HR by ~5.8 bpm. Heat compounds the effect via thermoregulatory load.',
          mechanism: 'Heat triggers sweating and dilation of skin vessels for cooling. Dehydration thickens blood and lowers blood volume. Both increase cardiac workload to deliver the same oxygen.',
          whatToDo: 'Pre-hydrate (16–20 oz fluid 1–2 hours before activity in heat). Add electrolytes when sweating heavily. Sleep cool — bedroom 65–68°F is the sweet spot.',
          source: SRC.hydrationCardio
        },
        {
          key: 'hr-fever', name: 'Illness / fever', direction: 'negative', impact: 'high',
          plainEnglish: 'Fever raises heart rate proportionally to temperature — Liebermeister\'s rule. Your morning RHR jumping 5+ bpm with no other explanation is often the first sign you\'re getting sick, sometimes before symptoms.',
          magnitude: 'About 7–10 bpm per 1°C of fever (roughly 4–6 bpm per 1°F). Sustained for the duration of illness.',
          mechanism: 'Immune activation raises metabolic demand, and fever requires extra cardiac work for thermoregulation. Both push HR up and keep it elevated until the body clears the infection.',
          whatToDo: 'Treat sudden RHR spikes as a real signal. Rest, hydrate, skip hard workouts. Pushing through usually extends illness — and your data will tell you when it\'s actually back to baseline.',
          source: SRC.liebermeister
        },
        {
          key: 'hr-stress', name: 'Stress / anxiety', direction: 'negative', impact: 'high',
          plainEnglish: 'Acute stress (a tough meeting, an argument) spikes heart rate within seconds. Chronic stress (long-term work pressure, family stress) keeps it elevated through the day, every day, until the source eases.',
          magnitude: 'Acute psychosocial stress raises HR by ~25%, systolic BP by ~13%, and norepinephrine by ~60%. Chronic stress sustains a smaller baseline elevation.',
          mechanism: 'SAM-axis activation releases catecholamines (adrenaline, norepinephrine) and HPA-axis activation releases cortisol — both directly raise heart rate. Chronic stress maintains this state at lower intensity even during "rest" periods.',
          whatToDo: 'Daily breathwork (4-7-8, box breathing), regular cardio for the chronic baseline, address stressors at the source where possible. Therapy if it\'s not lifting on its own.',
          source: SRC.stressAcute
        }
      ],
      eda: [
        {
          key: 'eda-arousal', name: 'Emotional arousal (anxiety, fear, anger)', direction: 'negative', impact: 'high',
          plainEnglish: 'EDA is the cleanest acute-stress signal in consumer wearables. Anxiety, fear, anger — within seconds of the emotional spike, your skin starts producing tiny amounts of sweat that the sensor reads as a conductance jump. This is why EDA-equipped watches catch stress events that HRV-only devices miss.',
          magnitude: 'Strong and immediate — measurable phasic response within 1–4 seconds of an emotional trigger.',
          mechanism: 'The sympathetic nervous system triggers eccrine sweat glands almost instantly during emotional arousal. Sweat raises the skin\'s electrical conductance, which the sensor measures as a microsiemen change.',
          whatToDo: 'Treat repeated EDA spikes during the day as a real signal. The fastest counter is slow-paced breathing — EDA tonic level often drops within 60–90 seconds of starting.',
          source: SRC.edaArousal
        },
        {
          key: 'eda-cognitive', name: 'Cognitive load / mental effort', direction: 'negative', impact: 'med',
          plainEnglish: 'Sustained mental effort — coding, deep writing, hard problem-solving — raises tonic skin conductance even when you don\'t feel emotionally stressed. EDA-equipped watches will read a long deep-focus block as elevated stress, which is technically accurate at the physiology level even if the work feels rewarding.',
          magnitude: 'Moderate sustained tonic rise that persists for the duration of demanding mental work (Posada-Quintero et al.).',
          mechanism: 'Mental exertion activates sympathetic output to support attention and working memory. The same sweat-gland activation that signals emotional arousal kicks in for cognitive load.',
          whatToDo: 'Pomodoro-style breaks (25 min focus, 5 min off) drop EDA back toward baseline. A 90-second breathing reset between tasks compounds.',
          source: SRC.edaCognitive
        },
        {
          key: 'eda-sensory', name: 'Sensory stimulation (sounds, pain, surprise)', direction: 'negative', impact: 'med',
          plainEnglish: 'Loud sounds, pain, sudden bright lights — even surprises that aren\'t threatening — trigger an immediate EDA spike. This is why your stress score might jump during a movie scene or a noisy commute even though you\'re not anxious.',
          magnitude: 'Acute orienting response — sharp phasic spike within 2–3 seconds of stimulus, then decays back over 10–20 seconds.',
          mechanism: 'The brain\'s startle/orienting response sends rapid sympathetic activation to sweat glands as part of "what was that?" assessment, regardless of whether the stimulus is threatening.',
          whatToDo: 'These spikes are normal and brief. If your environment has constant sensory load (open offices, noisy commute), noise-canceling headphones meaningfully reduce tonic EDA.',
          source: SRC.edaSenses
        },
        {
          key: 'eda-heat', name: 'Ambient heat & humidity', direction: 'negative', impact: 'med',
          plainEnglish: 'EDA reads thermoregulatory sweating the same way it reads emotional sweating — it can\'t tell the difference. On hot or humid days, your stress score will run higher even if you\'re calm. This is the single biggest false-positive on Pixel/Fitbit cEDA.',
          magnitude: 'Tonic skin conductance rises measurably with environmental heat. Effect strongest above 75°F and in high humidity.',
          mechanism: 'Eccrine sweat glands are activated by both emotional sympathetic output and thermoregulatory drive (preoptic activation). The sensor sees the same conductance change either way.',
          whatToDo: 'Cross-check elevated EDA against your HRV trend on hot days — if HRV is normal but EDA is up, it\'s probably heat. Cool environment, fan, or A/C resolves it.',
          source: SRC.edaThermo
        },
        {
          key: 'eda-excitement', name: 'Excitement / positive arousal', direction: 'variable', impact: 'med',
          plainEnglish: 'EDA cannot tell anxiety from excitement — both look identical to the sensor. The same spike fires whether you\'re scared, surprised in a good way, or genuinely excited about something. This is a fundamental limit, not an algorithm problem.',
          magnitude: 'Indistinguishable from negative arousal at the signal level. Same magnitude and timing as a fear or anger spike (Bradley et al.).',
          mechanism: 'EDA reads sympathetic activation only. The brain produces the same activation pattern for "good" and "bad" arousal — the valence (positive/negative) lives in higher cortical areas the sensor can\'t see.',
          whatToDo: 'When your wearable flags "stress," sanity-check what you were actually doing. Watching a thriller, riding a roller coaster, or finishing a big project all spike EDA but aren\'t bad for you.',
          source: SRC.edaArousalBradley
        },
        {
          key: 'eda-meditation', name: 'Relaxation / meditation', direction: 'positive', impact: 'med',
          plainEnglish: 'Slow, deliberate breathing or meditation drops EDA tonic level within minutes. Pixel/Fitbit users will literally see the line going down on the cEDA chart during a breathwork session — it\'s one of the cleanest real-time biofeedback signals consumer wearables produce.',
          magnitude: 'An 8-week MBSR program reduced EDA roughly 64% in trial data; higher state mindfulness consistently associates with lower SCR to stress.',
          mechanism: 'Parasympathetic activation reduces sympathetic drive to sweat glands. Slow breathing in particular engages the vagus nerve and dampens the sympathetic baseline.',
          whatToDo: 'When your wearable fires a Body Response or stress alert, treat it as a cue: 5 minutes of slow-paced breathing. Watch the cEDA line drop in real time.',
          source: SRC.edaMindfulness
        },
        {
          key: 'eda-cool', name: 'Cool ambient temperature', direction: 'positive', impact: 'low',
          plainEnglish: 'Cool conditions reduce thermoregulatory sweating, which drops the EDA tonic baseline. If your stress score reads lower in air-conditioned spaces, this is part of the reason — not necessarily that you\'re less stressed there.',
          magnitude: 'Modest tonic-level reduction in cool environments. Effect most visible in people who sweat heavily at room temperature.',
          mechanism: 'Less thermoregulatory sweat output means less skin conductance change. The sensor reads a lower tonic baseline.',
          whatToDo: 'Bedroom 65–68°F supports lower overnight EDA along with deeper sleep. Office cool-side is fine if it doesn\'t make you uncomfortable.',
          source: SRC.edaThermo
        },
        {
          key: 'eda-habituation', name: 'Habituation (repeated stimuli)', direction: 'positive', impact: 'low',
          plainEnglish: 'Your nervous system stops reacting to repeated harmless stimuli — the third loud noise barely registers compared to the first. This is why anxiety-provoking situations (public speaking, hard conversations) get easier with practice: your EDA literally responds less.',
          magnitude: 'Progressive reduction per exposure (Lissek et al.). Most of the dampening happens in the first 5–10 exposures.',
          mechanism: 'The brain learns that a stimulus isn\'t threatening and dampens the orienting response on subsequent exposures. Less sympathetic drive means less EDA spike.',
          whatToDo: 'Exposure works. If something spikes you, repeated controlled exposure (presentations, hard runs, cold showers) trains the response down over time.',
          source: SRC.edaHabituation
        },
        {
          key: 'eda-dehydration', name: 'Dehydration', direction: 'variable', impact: 'low',
          plainEnglish: 'You\'ll see "hydration affects EDA" repeated all over the wellness internet, but the underlying evidence is thin. Mild dehydration doesn\'t substantially shift sweat electrolyte concentrations during exercise, and the effect on wrist-based EDA specifically is poorly characterized.',
          magnitude: 'Limited evidence. Mild dehydration does not substantially alter sweat Na⁺/Cl⁻/K⁺ concentrations; effect on wrist EDA is poorly characterized.',
          mechanism: 'EDA conductance depends on sweat ion content. The assumption was that dehydration would shift those ions enough to move the reading — recent research (Baker 2024) shows that\'s not the case at typical dehydration levels.',
          whatToDo: 'Stay normally hydrated for general health reasons, but don\'t blame weird EDA readings on hydration. Heat, cognitive load, or emotional state are more likely culprits.',
          source: SRC.edaDehydration
        }
      ],
      skinTemp: [
        {
          key: 'st-stress', name: 'Acute psychological stress', direction: 'negative', impact: 'med',
          plainEnglish: 'When you\'re acutely stressed, your body shunts blood away from the skin and toward core organs — the same "fight or flight" response that makes your hands cold during anxiety. Your wearable\'s peripheral skin-temp sensor catches the drop in real time.',
          magnitude: 'Measurable peripheral drop at the wrist or finger within minutes of stress onset. Often 0.2–0.5°C below baseline.',
          mechanism: 'Sympathetic activation triggers vasoconstriction in peripheral blood vessels, redirecting blood to the core. The skin surface cools as less blood flows there.',
          whatToDo: 'Don\'t fight the response — acknowledge the stress, then engage parasympathetic recovery (slow breathing, brief walk). Skin temp returns to baseline within 10–20 minutes once the stressor eases.',
          source: SRC.skinTempStress
        },
        {
          key: 'st-exercise', name: 'Exercise', direction: 'variable', impact: 'med',
          plainEnglish: 'Skin temp rises during exercise as your body dumps heat through skin vessels, then drops below baseline post-workout. Most wearables filter this out so it doesn\'t inflate your stress score, but it can confound overnight readings if you train late.',
          magnitude: 'Rises during exercise via active vasodilation, then drops below baseline post-workout. Effect resolves within 1–2 hours.',
          mechanism: 'Working muscle generates heat. The body actively vasodilates skin vessels to dissipate it, which raises the surface temperature the sensor reads.',
          whatToDo: 'Avoid hard training within 2 hours of bed — your overnight skin-temp baseline can\'t settle and Oura/WHOOP will read it as a deviation.',
          source: SRC.vasodilation
        },
        {
          key: 'st-cycle', name: 'Menstrual cycle (luteal phase)', direction: 'negative', impact: 'high',
          plainEnglish: 'Progesterone in the second half of the menstrual cycle raises basal body temperature. Your wearable reads this as a stress signal even though it\'s a normal hormonal pattern. Oura uses it deliberately for period prediction.',
          magnitude: 'Roughly 0.3–0.7°C luteal-phase rise that persists until menses onset.',
          mechanism: 'Progesterone, which spikes after ovulation, acts on the hypothalamus to raise the body\'s temperature setpoint. The shift shows up clearly at extremity sites like the finger and wrist.',
          whatToDo: 'Track your cycle in the wearable\'s app so the algorithm contextualizes the rise. Treat luteal-phase HRV/temp shifts as expected, not a sign of illness or overtraining.',
          source: SRC.menstrualBaker
        },
        {
          key: 'st-fever', name: 'Illness / fever', direction: 'negative', impact: 'high',
          plainEnglish: 'Skin temperature rising clearly above your baseline is one of the earliest signs of infection your wearable will catch — sometimes 1–2 days before fever or symptoms register. Take it seriously.',
          magnitude: 'Significant rise during infection. Tracks with severity of the immune response.',
          mechanism: 'Cytokines and immune signaling raise the hypothalamic temperature setpoint. The body produces and retains more heat to make the environment hostile to pathogens.',
          whatToDo: 'A clear skin-temp spike with no exercise, alcohol, or hot-room explanation is a real illness signal. Rest and hydrate before symptoms hit — most people would catch flu earlier if they trusted this data.',
          source: SRC.heatStress
        },
        {
          key: 'st-alcohol', name: 'Alcohol', direction: 'negative', impact: 'med',
          plainEnglish: 'Alcohol opens up your skin blood vessels — that warm flush you feel after a drink is real. Your peripheral skin temp rises for several hours, which Oura and WHOOP both pick up overnight.',
          magnitude: 'Acute peripheral rise lasting hours after drinking. Compounds with HRV suppression and disrupted thermoregulation.',
          mechanism: 'Alcohol triggers peripheral vasodilation, sending more warm blood to the skin surface. The sensor reads the rise as a baseline deviation.',
          whatToDo: 'Cut off alcohol 3+ hours before bed if you want clean overnight skin-temp readings. The effect compounds with HRV suppression to make recovery scores look extra bad.',
          source: SRC.alcoholThermo
        },
        {
          key: 'st-ambient', name: 'Ambient temperature', direction: 'variable', impact: 'high',
          plainEnglish: 'Wrist-based skin temp is heavily influenced by the room you\'re in. Hot rooms inflate readings; cold rooms deflate them. This is the biggest accuracy issue with wrist devices — finger-site sensors (Oura) are insulated better but still affected.',
          magnitude: 'Major confounder for wrist devices. Hot/cold rooms can shift readings 0.5–1.5°C from your true baseline.',
          mechanism: 'External air temperature directly affects surface sensor readings, especially on a wrist where the sensor sits close to the skin and to ambient air.',
          whatToDo: 'Stable bedroom temperature is the single biggest fix — 65–68°F is Oura\'s recommended range. If your skin-temp deviation looks weird, check your thermostat before assuming illness.',
          source: SRC.skinTempAmbient
        },
        {
          key: 'st-sleep-onset', name: 'Sleep onset', direction: 'positive', impact: 'low',
          plainEnglish: 'When you\'re falling asleep, blood vessels in your hands and feet dilate to dump heat — that\'s why warm hands and feet make you sleepy. The sensor reads a rise at the extremities, which is actually a sign of healthy sleep onset.',
          magnitude: 'Normal extremity-temp rise of 0.3–0.5°C as you transition into sleep.',
          mechanism: 'Distal vasodilation initiates the sleep-onset cascade — your core cools while extremities warm. This redistribution is essential for falling asleep.',
          whatToDo: 'If you have trouble falling asleep, warm hands/feet (warm bath, socks) before bed accelerates the process. Cold extremities = harder to drop off.',
          source: SRC.skinTempSleep
        },
        {
          key: 'st-depression', name: 'Depression / chronic stress', direction: 'negative', impact: 'med',
          plainEnglish: 'Long-term depression and chronic stress show up as more day-to-day variability in skin temperature, not a constant high or low. The body\'s autonomic regulation gets less stable, so readings swing more from one day to the next.',
          magnitude: 'Higher day-to-day temperature variability over weeks. Effect tracks with subjective severity.',
          mechanism: 'Disrupted autonomic regulation under chronic stress destabilizes thermoregulation. The body has a harder time holding a steady setpoint, so readings drift more.',
          whatToDo: 'Address the underlying issue — therapy, exercise, social connection, sleep. Skin-temp variability stabilizes as autonomic regulation recovers, often over months.',
          source: SRC.skinTempDepression
        }
      ],
      rr: [
        {
          key: 'rr-stress', name: 'Stress / anxiety', direction: 'negative', impact: 'high',
          plainEnglish: 'Stress and anxiety raise breathing rate and make it shallower — even when you\'re not aware you\'re doing it. WHOOP and Polar pick this up overnight as elevated respiratory rate, which is one of the cleanest markers of unresolved daytime stress carrying into sleep.',
          magnitude: 'Acute rate increase under stress (Grassmann et al.); sustained baseline elevation in chronic anxiety.',
          mechanism: 'Sympathetic activation increases respiratory drive directly. Your brain\'s breathing center gets a "speed up" signal alongside the cardiovascular spike.',
          whatToDo: 'Slow-paced breathing in the evening (4-7-8, box breathing, or any 6-breath/min pattern) drops the carryover into sleep. Start 30+ minutes before bed for the best overnight rate.',
          source: SRC.rrStress
        },
        {
          key: 'rr-pain', name: 'Pain', direction: 'negative', impact: 'med',
          plainEnglish: 'Pain — chronic injury pain, post-surgery, even bad muscle soreness — raises your respiratory rate the same way emotional stress does. In prehospital studies, RR is actually the vital sign most strongly correlated with pain intensity.',
          magnitude: 'RR is the vital sign most strongly correlated with prehospital pain intensity; RR > 25/min predicts severe pain.',
          mechanism: 'Pain signaling triggers sympathetic activation, which changes breathing pattern toward faster and shallower.',
          whatToDo: 'Treat the pain source where you can. If injured, expect overnight RR to stay elevated until healing — don\'t over-interpret it as overtraining or stress.',
          source: SRC.rrPain
        },
        {
          key: 'rr-fever', name: 'Fever / illness', direction: 'negative', impact: 'med',
          plainEnglish: 'Fever raises your respiratory rate proportionally — your body needs more oxygen to fuel the immune fight. WHOOP and Polar will catch elevated overnight RR before you\'re aware you\'re sick.',
          magnitude: 'Fever raises both HR and RR proportionally to temperature elevation (prospective study).',
          mechanism: 'Higher core temperature raises metabolic rate, which requires more oxygen delivery and CO₂ removal. The respiratory center responds with faster breathing.',
          whatToDo: 'Elevated overnight RR with no other explanation is a real early-illness signal. Rest, hydrate, skip hard training even before symptoms hit.',
          source: SRC.feverHrRr
        },
        {
          key: 'rr-overtraining', name: 'Overtraining', direction: 'negative', impact: 'high',
          plainEnglish: 'Elevated overnight respiratory rate is often described as a textbook overtraining marker. The strongest direct evidence is actually for elevated nocturnal HR and reduced HRV, but breathing rate moves alongside them — and WHOOP and Polar are the consumer wearables that surface it.',
          magnitude: 'Limited direct RR evidence. Overtraining is best documented via elevated nocturnal HR and reduced HRV (Schmitt et al.); RR typically tracks alongside.',
          mechanism: 'Incomplete recovery leaves sympathetic tone elevated through the night. Cortisol stays high, which keeps respiratory drive up even during deep sleep.',
          whatToDo: 'Watch your 7-day overnight HR + RR trend together. Sustained rises over a week of hard training are a deload signal. Ease volume by 30–50% for 5–7 days.',
          source: SRC.overtraining
        },
        {
          key: 'rr-caffeine', name: 'Late caffeine', direction: 'variable', impact: 'low',
          plainEnglish: 'You\'ll see "caffeine raises breathing rate" in a lot of wellness writeups, but the actual adult-study evidence shows little or no change in respiratory rate — caffeine\'s effect is mostly on tidal volume (how deeply you breathe) and minute ventilation, not rate. The overnight RR cost of late caffeine usually comes via worse sleep, not direct stimulation.',
          magnitude: 'Adult studies report "little if any change" in respiratory rate from caffeine. Primary effect is on tidal volume and minute ventilation, not rate.',
          mechanism: 'Adenosine antagonism stimulates the brainstem respiratory center, but in adults the response shows up as deeper breathing rather than faster breathing.',
          whatToDo: 'No caffeine after 2 PM is still the cleanest rule — but the overnight RR risk is mostly through degraded sleep architecture rather than direct respiratory stimulation.',
          source: SRC.caffeineRr
        },
        {
          key: 'rr-meditation', name: 'Relaxation / meditation', direction: 'positive', impact: 'high',
          plainEnglish: 'Slow-paced breathing literally trains your nervous system to default to slower, deeper breaths — the effect persists past the practice window. Consistent practice drops your overnight respiratory rate over weeks, which lifts WHOOP recovery and Polar Nightly Recharge.',
          magnitude: 'Significant acute drop during slow-breathing protocols (Hopper et al. systematic review). Chronic baseline drop builds over 4–8 weeks of daily practice.',
          mechanism: 'Slow breathing engages the vagus nerve and shifts autonomic balance toward parasympathetic dominance. The respiratory center recalibrates to a lower default rate.',
          whatToDo: '5–10 minutes of slow breathing daily. Pre-bed timing carries the effect into sleep. Apps that pace you to ~6 breaths/min work best.',
          source: SRC.rrMeditation
        },
        {
          key: 'rr-cardio-fit', name: 'Cardio fitness', direction: 'positive', impact: 'med',
          plainEnglish: 'Trained athletes breathe less at rest — same oxygen delivery, fewer breaths needed. Building aerobic fitness drops your baseline respiratory rate the same way it drops your resting heart rate.',
          magnitude: 'Spontaneous adult RR is 12–20/min; the pulse-respiration quotient varies with fitness, with trained adults sitting at the lower end.',
          mechanism: 'Higher VO₂max means efficient gas exchange and a lower metabolic cost per breath. Fewer breaths cover the same demand.',
          whatToDo: 'Same prescription as for HRV and resting HR — 150+ min/week of zone-2 cardio, with some higher-intensity work for VO₂max gains.',
          source: SRC.rrCardioFit
        },
        {
          key: 'rr-sleep', name: 'Quality sleep', direction: 'positive', impact: 'med',
          plainEnglish: 'Your respiratory rate variability is lowest during deep sleep — that\'s when parasympathetic tone is fully in control. The absolute rate doesn\'t change as much across stages as you\'d think; what matters is how stable it is overnight.',
          magnitude: 'RR variability is lowest in N3 (deep sleep); absolute rate is similar across sleep stages (Lechat et al.).',
          mechanism: 'Parasympathetic dominance during NREM3 produces stable, regular breathing. Sleep fragmentation pulls you into lighter stages with more variable breathing.',
          whatToDo: 'Sleep hygiene basics — cool dark room, consistent timing, no late alcohol. Polar Nightly Recharge is essentially a respiratory readout of how cleanly you slept the first 4 hours.',
          source: SRC.rrSleepVar
        }
      ],
      spo2: [
        {
          key: 'spo2-altitude', name: 'Altitude', direction: 'negative', impact: 'high',
          plainEnglish: 'High elevation has less oxygen in the air, so your blood carries less. The drop becomes meaningful above ~8,000 ft and is smaller (but real) above ~5,000 ft. WHOOP recovery scores will look bad until you acclimatize over several days.',
          magnitude: 'Significant drop above ~2,500 m / 8,000 ft. Smaller, real reductions begin above ~1,500 m. Healthy individuals stay 95–100% at sea level.',
          mechanism: 'Lower atmospheric oxygen pressure reduces how much oxygen binds to hemoglobin in the lungs. Saturation is a direct function of altitude until the body responds with more red blood cells.',
          whatToDo: 'Expect 5–7 days for partial acclimatization. Hydrate aggressively, sleep low if possible, and don\'t train hard the first 48 hours. WHOOP will eventually recalibrate.',
          source: SRC.altitudeSpo2
        },
        {
          key: 'spo2-apnea', name: 'Sleep apnea', direction: 'negative', impact: 'high',
          plainEnglish: 'Sleep apnea causes your airway to repeatedly close during sleep, which drops oxygen and forces brief micro-arousals. WHOOP\'s overnight SpO₂ trace will show repeated dips — sometimes the first time anyone sees apnea data is on a wearable.',
          magnitude: 'Repeated overnight desaturation events. The Oxygen Desaturation Index (ODI) tracks with apnea-hypopnea severity.',
          mechanism: 'Airway obstruction during sleep causes intermittent hypoxia — oxygen briefly drops, the brain wakes you slightly to breathe, and the cycle repeats dozens or hundreds of times a night.',
          whatToDo: 'If you see a "sawtooth" SpO₂ pattern overnight, see a sleep doctor. CPAP or oral appliance therapy resolves it cleanly. Untreated apnea is a major cardiovascular risk.',
          source: SRC.apneaOdi
        },
        {
          key: 'spo2-illness', name: 'Respiratory illness', direction: 'negative', impact: 'med',
          plainEnglish: 'Anything that affects your lungs — flu, COVID, pneumonia, bronchitis, asthma flare — reduces how efficiently you absorb oxygen. WHOOP\'s overnight SpO₂ will dip below your usual baseline; severity tracks with how sick you actually are.',
          magnitude: 'Pneumonia produces lower SpO₂ than other acute infections. SpO₂ ≤90% has good specificity for adverse outcomes in community-acquired pneumonia. BTS long-term oxygen threshold for COPD is <92%.',
          mechanism: 'Impaired gas exchange in the lungs (inflammation, fluid, congestion) reduces how much oxygen reaches the bloodstream per breath.',
          whatToDo: 'Sustained SpO₂ below 92% with respiratory symptoms warrants medical attention, especially if breathing feels labored. Track your trend; recovery means returning to your normal baseline.',
          source: SRC.spo2Pneumonia
        },
        {
          key: 'spo2-smoking', name: 'Smoking', direction: 'negative', impact: 'high',
          plainEnglish: 'Smoking creates a tricky situation for SpO₂. Carbon monoxide from smoke binds hemoglobin and elevates carboxyhemoglobin (COHb) — and consumer pulse oximeters can\'t tell COHb from oxygen-bound hemoglobin, which means your SpO₂ reading is inflated even though your tissues are getting less oxygen.',
          magnitude: 'Pulse-oximetry SpO₂ is inflated by ~5% in smokers (vs ~2% in non-smokers) due to chronic carboxyhemoglobin elevation. Reading looks better than the truth.',
          mechanism: 'Carbon monoxide binds to hemoglobin ~200x more tightly than oxygen, forming carboxyhemoglobin that pulse oximeters misread as oxygenated hemoglobin.',
          whatToDo: 'Quit. The SpO₂ inflation reverses within weeks of quitting as COHb clears; actual tissue oxygenation improves immediately. WHOOP recovery scores improve noticeably even in the first month.',
          source: SRC.smokingCohb
        },
        {
          key: 'spo2-cardio-fit', name: 'Cardio fitness', direction: 'positive', impact: 'low',
          plainEnglish: 'Healthy cardiovascular systems maintain SpO₂ near 95–100% almost effortlessly — there\'s a ceiling effect, so fitness doesn\'t push the number higher. It just keeps it stable. If your SpO₂ trends down at rest, fitness probably isn\'t the issue.',
          magnitude: 'Healthy individuals maintain 95–100% saturation at rest at sea level. Limited room to improve from here.',
          mechanism: 'Efficient cardiovascular and respiratory systems deliver and exchange oxygen reliably, keeping hemoglobin saturation near maximum.',
          whatToDo: 'If your SpO₂ is in the high 90s, you\'re fine. Focus on other levers (HRV, RR, sleep). Drops below 95% at rest deserve attention.',
          source: SRC.altitudeSpo2
        },
        {
          key: 'spo2-breathing', name: 'Proper breathing during sleep', direction: 'positive', impact: 'low',
          plainEnglish: 'Sleeping with a clear airway — no nasal blockage, no severe snoring, no positional collapse — keeps SpO₂ stable through the night. Most people don\'t realize how much positional sleep affects their oxygen until they see the data.',
          magnitude: 'Fewer overnight desaturation events on the ODI. Steady saturation through the sleep cycle.',
          mechanism: 'An unobstructed airway throughout the sleep cycle allows uninterrupted gas exchange and stable hemoglobin saturation.',
          whatToDo: 'Side-sleep if you snore on your back. Address nasal congestion (nose strips, allergy treatment). Avoid late alcohol — it relaxes airway muscles and worsens snoring.',
          source: SRC.apneaOdi
        }
      ],
      sleep: [
        {
          key: 'sl-schedule', name: 'Consistent sleep schedule', direction: 'positive', impact: 'high',
          plainEnglish: 'Sleeping at the same time every night — including weekends — is more important than how many hours you log. Your circadian rhythm runs on regularity, and consistent timing produces deeper sleep stages and cleaner architecture than catching up on weekends.',
          magnitude: 'Improves deep sleep percentage, REM continuity, and onset latency. Effect compounds over 2–4 weeks of consistency.',
          mechanism: 'Circadian rhythm alignment optimizes melatonin and cortisol timing. The body anticipates sleep and wake, producing the right hormones at the right hour.',
          whatToDo: 'Pick a fixed bed and wake time within 30 minutes, 7 days a week. Avoid weekend sleep-ins of more than an hour — they reset your circadian timing.',
          source: SRC.ouraCumulative
        },
        {
          key: 'sl-cool', name: 'Cool bedroom (65–68°F)', direction: 'positive', impact: 'med',
          plainEnglish: 'Your body has to drop its core temperature about 1°C to initiate deep sleep — and it can\'t do that in a warm room. Most adults sleep best in a 65–68°F room; warmer than that and deep sleep percentage drops measurably.',
          magnitude: 'Increases deep sleep duration in most adults. Effect strongest at the cool end of the range (65–66°F).',
          mechanism: 'Core temperature drop triggers the deep-sleep cascade. A warm bedroom blocks the drop, keeping you in lighter sleep stages longer.',
          whatToDo: 'Set the thermostat 65–68°F. Use breathable bedding. If you can\'t cool the room, a fan helps; cooling mattress pads work too.',
          source: SRC.ouraCumulative
        },
        {
          key: 'sl-exercise', name: 'Regular exercise (not late)', direction: 'positive', impact: 'med',
          plainEnglish: 'Daily exercise improves nearly every sleep metric — but timing matters. Vigorous training within 2 hours of bed delays onset and pushes back deep sleep. Morning or early evening cardio is the sweet spot.',
          magnitude: 'Increases deep sleep percentage and reduces sleep onset latency. Effect strongest with consistent daily exercise.',
          mechanism: 'Physical fatigue promotes sleep drive (adenosine accumulation). Exercise also lowers core body temperature in the hours after, which supports deep-sleep initiation.',
          whatToDo: 'Train earlier in the day if possible. If late training is unavoidable, finish 2+ hours before bed and prioritize a cool-down (shower, slow walk) to drop core temperature.',
          source: SRC.hrvExercise
        },
        {
          key: 'sl-alcohol-bed', name: 'Alcohol before bed', direction: 'negative', impact: 'high',
          plainEnglish: 'Alcohol feels like it helps you fall asleep — and the first half of the night actually shows more slow-wave sleep — but it sabotages REM and fragments the second half of sleep as it metabolizes. Net effect on your wearable\'s sleep score: clearly worse.',
          magnitude: 'Increases SWS in the first half of sleep but decreases REM and disrupts the second half (more wake-ups, lower efficiency). Effect proportional to dose.',
          mechanism: 'Alcohol initially sedates but disrupts the brain\'s normal sleep architecture as it metabolizes through the night. The second half of sleep becomes fragmented.',
          whatToDo: 'Cut off alcohol 3+ hours before bed if you do drink. Hydrate with water alongside. Several alcohol-free nights/week recover the most sleep architecture.',
          source: SRC.alcoholSleep
        },
        {
          key: 'sl-late-caffeine', name: 'Late caffeine (after 2 PM)', direction: 'negative', impact: 'high',
          plainEnglish: 'Caffeine\'s half-life is 5–6 hours — meaning a 3 PM coffee still has half its dose at 9 PM and a quarter at 3 AM. It delays sleep onset, reduces total sleep, and shows up as a worse Oura sleep score even if you don\'t feel wired at bedtime.',
          magnitude: 'Delays onset, reduces total sleep, and reduces deep sleep proportion (Reichert et al., 2022).',
          mechanism: 'Caffeine blocks adenosine receptors — the molecule that builds up sleep pressure. Even when you don\'t feel jittery, the receptors are still partially blocked.',
          whatToDo: 'No caffeine after 2 PM is the cleanest rule. If you\'re sensitive, push it to noon. Cycle off occasionally to reset receptor sensitivity.',
          source: SRC.caffeineSleep
        },
        {
          key: 'sl-late-meals', name: 'Late heavy meals', direction: 'negative', impact: 'med',
          plainEnglish: 'A heavy meal close to bed forces your body to digest while it\'s trying to drop into deep sleep. PSG-measured studies show eating within 30–60 minutes of bed associates with poorer sleep, and meals within 3 hours of bed produce more nocturnal awakenings.',
          magnitude: 'Eating within 30–60 min of bed associated with poorer PSG-measured sleep; eating within 3 hr of bed produces more nocturnal awakenings.',
          mechanism: 'Digestion raises core body temperature and metabolic activity. The temperature drop required for deep sleep is delayed or dampened, and circadian alignment of digestion with sleep is disrupted.',
          whatToDo: 'Last big meal 3+ hours before bed. A small protein-leaning snack (Greek yogurt, cottage cheese) is fine and doesn\'t disrupt sleep.',
          source: SRC.mealsSleep
        },
        {
          key: 'sl-screens', name: 'Screen time before bed', direction: 'negative', impact: 'med',
          plainEnglish: 'Phone, laptop, and TV screens emit blue light that suppresses melatonin — your sleep-onset hormone. Beyond the chemistry, scrolling is mentally activating, which keeps cognitive load (and EDA, if your watch tracks it) elevated past your bedtime.',
          magnitude: 'Dose-dependent melatonin suppression from blue light (Brainard et al.); prolongs sleep latency and reduces total sleep when severe.',
          mechanism: 'Blue-enriched light (460–480 nm) hits the retina\'s melanopsin (ipRGC) cells, which signal the suprachiasmatic nucleus and suppress pineal melatonin.',
          whatToDo: 'No screens 60 minutes before bed is the gold standard. If you can\'t, dim the screen, turn on Night Shift / blue-light filter, and avoid stimulating content (news, work email).',
          source: SRC.screensSleep
        },
        {
          key: 'sl-stress', name: 'Chronic stress / anxiety', direction: 'negative', impact: 'high',
          plainEnglish: 'Stress doesn\'t turn off when you go to bed — it keeps cortisol elevated through the night and fragments your sleep architecture. You\'ll fall asleep, but you\'ll wake more, get less deep sleep, and feel less rested even at the same hours logged.',
          magnitude: 'Fragmented sleep, less deep sleep, more frequent night wake-ups. Effect persists as long as the stressor is unresolved.',
          mechanism: 'Elevated cortisol disrupts the normal nightly drop that supports deep sleep. Hyperarousal keeps the brain in lighter stages and pulls you out of REM.',
          whatToDo: 'Pre-bed wind-down: low light, slow breathing, journaling, no work email. If chronic, address the source — therapy, lifestyle changes. Sleep aids are short-term band-aids only.',
          source: SRC.ouraCumulative
        }
      ]
    };
  }

  _factorsForDevice(deviceKey) {
    const metrics = this._deviceMetrics[deviceKey] || [];
    const out = [];
    for (const m of metrics) {
      for (const f of (this._metricFactors[m] || [])) {
        out.push({ ...f, metric: m, _devKey: `${deviceKey}-${f.key}` });
      }
    }
    return out;
  }

  _icon(name) {
    const icons = {
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>',
      chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      compare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M21 3l-7 7"/><path d="M8 21H3v-5"/><path d="M3 21l7-7"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
      sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 13.7 8.3 19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7Z"/><path d="M19 17v4"/><path d="M17 19h4"/></svg>',
      alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
      brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v13"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
      sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
      droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/></svg>',
      coffee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>',
      thermometer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>',
      bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',
      ghost: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>',
      target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
      trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
      flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
      watch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"/><polyline points="12 10 12 12 13 13"/><path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05"/><path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05"/></svg>'
    };
    return icons[name] || icons.heart;
  }

  _heroWaveSvg() {
    return `
      <svg class="hero-wave" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="kygo-stress-wave-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#22C55E" stop-opacity="0.10"/>
            <stop offset="1" stop-color="#22C55E" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="M0 130 L 80 130 L 95 130 L 105 100 L 115 165 L 130 90 L 145 145 L 160 130 L 240 130 L 255 130 L 265 105 L 275 160 L 290 95 L 305 150 L 320 130 L 400 130 L 415 130 L 425 102 L 435 168 L 450 92 L 465 148 L 480 130 L 600 130" stroke="#22C55E" stroke-width="2" fill="none" opacity="0.75"/>
        <path d="M0 130 L 600 130 L 600 240 L 0 240 Z" fill="url(#kygo-stress-wave-g)"/>
        <g stroke="rgba(30,41,59,0.07)" stroke-width="1">
          <line x1="0" y1="40" x2="600" y2="40"/>
          <line x1="0" y1="200" x2="600" y2="200"/>
        </g>
      </svg>`;
  }


  _impactCfg(impact) {
    const map = {
      high: { label: 'High',   cls: 'imp-high',   weight: 3 },
      med:  { label: 'Medium', cls: 'imp-med',    weight: 2 },
      low:  { label: 'Low',    cls: 'imp-low',    weight: 1 }
    };
    return map[impact] || map.med;
  }


  _deviceImage(key) {
    return ({
      garmin:  'https://static.wixstatic.com/media/273a63_c545c093c04d4ca4ade77e5ca43fd433~mv2.png',
      samsung: 'https://static.wixstatic.com/media/273a63_21fd42e4a5d1459bb6db751a0ea5e161~mv2.png',
      google:  'https://static.wixstatic.com/media/273a63_7b9a43c26540413586d185a889fa853c~mv2.png',
      fitbit:  'https://static.wixstatic.com/media/273a63_c12bab319dc34737a386c7449f5f92c7~mv2.png',
      whoop:   'https://static.wixstatic.com/media/273a63_c52aaaca1f7243f3818cf51d9374dbd4~mv2.png',
      oura:    'https://static.wixstatic.com/media/273a63_722e50e1a554453eb4c71a2e7a58925d~mv2.png',
      polar:   'https://static.wixstatic.com/media/273a63_e7e3c05ed0bc4cec8f456cd7f995e70b~mv2.png'
    })[key] || null;
  }

  _renderComparisonModule() {
    const sensorList = [
      { key: 'hrv',      label: 'HRV',         short: 'HRV' },
      { key: 'hr',       label: 'HR',          short: 'HR' },
      { key: 'eda',      label: 'EDA',         short: 'EDA' },
      { key: 'skinTemp', label: 'Skin Temp',   short: 'Temp' },
      { key: 'spo2',     label: 'SpO₂',        short: 'SpO₂' },
      { key: 'rr',       label: 'Resp. Rate',  short: 'Resp' },
      { key: 'sleep',    label: 'Sleep arch.', short: 'Sleep' }
    ];
    const totalSensors = sensorList.length;

    const ranked = Object.entries(this._devices).map(([key, d]) => {
      const count = Object.values(d.sensors).filter(Boolean).length;
      return { key, d, count };
    }).sort((a, b) => b.count - a.count || a.d.name.localeCompare(b.d.name));

    const tableHead = `
      <thead>
        <tr>
          <th class="dt-th-device" scope="col">Wearable</th>
          ${sensorList.map(s => `
            <th scope="col">
              <span class="dt-th-full">${s.label}</span>
              <span class="dt-th-short" aria-hidden="true">${s.short}</span>
            </th>`).join('')}
          <th class="dt-th-count" scope="col">Signals</th>
        </tr>
      </thead>`;

    const tableBody = ranked.map(({ key, d, count }) => {
      const img = this._deviceImage(key);
      return `
        <tr style="--accent:${d.color}">
          <th class="dt-td-device" scope="row">
            <span class="dt-brand">
              ${img
                ? `<span class="dt-img"><img src="${img}" alt="${d.name}" loading="lazy" /></span>`
                : `<span class="dt-img dt-img--icon" aria-hidden="true">${this._icon('watch')}</span>`}
              <span class="dt-name">${d.name}</span>
            </span>
          </th>
          ${sensorList.map(s => {
            const on = !!d.sensors[s.key];
            return `<td class="dt-cell ${on ? 'on' : 'off'}" aria-label="${s.label} ${on ? 'used' : 'not used'}">
              <span class="dt-mark" aria-hidden="true">${on ? this._icon('check') : '<span class="dt-dash"></span>'}</span>
            </td>`;
          }).join('')}
          <td class="dt-td-count">
            <span class="dt-count-num">${count}</span><span class="dt-count-lbl">/ ${totalSensors}</span>
          </td>
        </tr>`;
    }).join('');

    return `
      <section class="comparison-section section-bg-gray" id="compare">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('compare')}</span>How your device measures stress</span>
            <h2 class="section-h2">Every wearable, <em>side by side</em>.</h2>
            <p class="section-lede">Stress scores aren't comparable across brands. Each device pulls a different mix of HRV, EDA, skin temperature, and breathing rate — and uses a different scale, baseline window, and reference frame. Here's exactly what each one reads, ranked by signal coverage.</p>
          </div>

          <div class="device-chart">
            <div class="dc-head">
              <div>
                <span class="dc-eyebrow">Signal coverage</span>
                <h3 class="dc-title">Sensors fed into stress, by device</h3>
                <p class="dc-sub">Multi-signal devices average ~82% accuracy in lab studies versus ~77% for HRV-only (JMIR 2024 meta-analysis) — and lab numbers degrade meaningfully in real-world daily use.</p>
              </div>
              <div class="dc-meta">${ranked.length} wearables · ${totalSensors} signals</div>
            </div>
            <div class="device-table-wrap">
              <table class="device-table">
                ${tableHead}
                <tbody>${tableBody}</tbody>
              </table>
            </div>
          </div>
        </div>
      </section>`;
  }

  _renderFullBreakdown() {
    const ranked = Object.entries(this._devices).map(([key, d]) => {
      const count = Object.values(d.sensors).filter(Boolean).length;
      return { key, d, count };
    }).sort((a, b) => b.count - a.count || a.d.name.localeCompare(b.d.name));

    const expanded = this._compareExpandedKey;

    const detailRows = ranked.map(({ key, d }, i) => {
      const img = this._deviceImage(key);
      const isOpen = expanded === key;
      return `
        <div class="dd-row ${isOpen ? 'open' : ''}" style="--accent:${d.color};--delay:${i * 30}ms">
          <button class="dd-row-head" type="button" data-device-row="${key}" aria-expanded="${isOpen}">
            ${img
              ? `<span class="dd-img"><img src="${img}" alt="${d.name}" loading="lazy" /></span>`
              : `<span class="dd-img dd-img--icon" aria-hidden="true">${this._icon('watch')}</span>`}
            <span class="dd-text">
              <span class="dd-name">${d.name}</span>
              <span class="dd-line">${d.modelLine}</span>
            </span>
            <span class="dd-chev" aria-hidden="true">${this._icon('chevDown')}</span>
          </button>
          <div class="dd-body" ${isOpen ? '' : 'hidden'}>
            <div class="dd-body-inner">
              <dl class="dd-fields">
                <div><dt>Algorithm</dt><dd>${d.algorithm}</dd></div>
                <div><dt>Scale</dt><dd>${d.scale}</dd></div>
                <div><dt>Baseline</dt><dd>${d.baseline}</dd></div>
                <div><dt>Coverage</dt><dd>${d.coverage}</dd></div>
                ${d.hardware ? `<div><dt>Hardware lineage</dt><dd>${d.hardware}</dd></div>` : ''}
                ${d.validation ? `<div><dt>Validation</dt><dd>${d.validation}</dd></div>` : ''}
              </dl>
              <div class="dd-callouts">
                <div class="dd-callout strong"><span class="dd-callout-head"><span class="dd-callout-icon">${this._icon('sparkle')}</span>Unique strength</span><p>${d.strength}</p></div>
                <div class="dd-callout watch"><span class="dd-callout-head"><span class="dd-callout-icon">${this._icon('alert')}</span>Watch out for</span><p>${d.limitation}</p></div>
              </div>
            </div>
          </div>
        </div>`;
    }).join('');

    return `
      <section class="breakdown-section section-bg-gray" id="full-breakdown">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('sparkle')}</span>Per-device deep dive</span>
            <h2 class="section-h2">How each wearable's stress score <em>actually works</em>.</h2>
            <p class="section-lede">Tap any device for its full algorithm, scale, baseline window, coverage behavior, hardware generation lineage, validation data where available, and the unique tradeoffs of its approach.</p>
          </div>
          <div class="device-details">
            <div class="dd-list">${detailRows}</div>
          </div>
        </div>
      </section>`;
  }

  _topPicks() {
    return [
      { label: 'What wearables actually measure', stat: 'Arousal', answer: 'Not stress directly', icon: 'bolt', note: 'Every device detects sympathetic nervous system activation. EDA fires the same way for anxiety, excitement, fear, or surprise. HRV drops the same way for a stressful email, a cold drink, exercise, or caffeine. "Stress" is an inference layered on arousal detection.', cls: 'myth' },
      { label: 'Most universal mover', stat: '10 / 10', answer: 'Sleep deprivation', icon: 'moon', note: 'Hits every device because all 10 read HRV and sleep deprivation suppresses parasympathetic tone immediately. The next-morning RHR bump and HRV drop show up on Garmin, Samsung, Oura, WHOOP, Apple, Polar, COROS, and Amazfit alike.', cls: '' },
      { label: 'Only-on-EDA signal',   stat: '3 devices', answer: 'Cognitive load', icon: 'brain', note: 'Sustained mental effort raises tonic skin conductance — invisible to HRV-only watches. Samsung Galaxy Watch, Pixel Watch 2/3, and Fitbit Sense 2 only. Pixel Watch 1 had no EDA; Sense Gen 1 was manual spot-check.', cls: '' },
      { label: 'Accuracy ceiling', stat: '~82% vs ~77%', answer: 'Multi-signal beats HRV-only', icon: 'target', note: 'Pooled lab accuracy from the 2024 JMIR meta-analysis: ~82% for HRV + EDA + skin temp combined, ~77% for HRV alone. Real-world daily-life accuracy degrades meaningfully from these lab numbers — the field\'s biggest unsolved problem.', cls: '' },
      { label: 'Oura specialty', stat: '0.3–0.7°C', answer: 'Cycle skin temp', icon: 'thermometer', note: 'Finger-site skin temp catches the luteal-phase rise so cleanly that Oura uses it for period prediction. Cumulative Stress (released Nov 2025 with the University of Southern Denmark) layers this on top of sleep continuity, heart stress-response, sleep micromotions, and activity impact.', cls: '' },
      { label: 'Hot-day false positive', stat: 'cEDA', answer: 'Ambient heat', icon: 'sun', note: 'Continuous EDA reads thermoregulatory sweating as stress. Pixel/Fitbit users: cross-check elevated EDA against HRV before reacting — if HRV is normal but EDA is up, it\'s probably the weather.', cls: 'warn' },
      { label: 'Apple Watch ≠ RMSSD', stat: 'SDNN', answer: 'HealthKit reports SDNN', icon: 'watch', note: 'Apple HealthKit exposes HRV as Standard Deviation of NN intervals, not RMSSD. Default sampling is every ~4 hours (2 hours with IRN, 15 min with AFib History). Sensors 2024 found Apple Watch underestimates SDNN by 8.31 ms vs Polar H10 — RHR was much closer (MAE 3.73 bpm).', cls: 'warn' },
      { label: 'The biggest myth', stat: 'Don\'t', answer: 'Compare scores across brands', icon: 'ghost', note: 'A "55" on Garmin doesn\'t mean a "55" on Samsung. WHOOP\'s Stress Monitor is 0–3, not 0–100. Apple has no native score at all. Each algorithm uses a different sensor mix, scale, and personal baseline — only same-brand longitudinal tracking is defensible.', cls: 'myth' }
    ];
  }

  _renderArticleCta() {
    return `
      <section class="article-section section-bg-white">
        <div class="container">
          <a href="https://www.kygo.app/post/how-wearables-measure-stress-comparison" class="article-card animate-on-scroll" target="_blank" rel="noopener">
            <span class="article-badge">Deep Dive</span>
            <div class="article-body">
              <span class="article-kicker">Read the full article</span>
              <h3 class="article-title">How 10 Brands Actually Measure Stress <span class="article-year">(2026)</span></h3>
              <p class="article-desc">Every signal, algorithm, and cited study in one long-form read.</p>
            </div>
            <span class="article-go" aria-hidden="true">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>`;
  }

  _renderCtaRow() {
    const iosUrl = 'https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589';
    return `
      <section class="app-cta-section section-bg-white">
        <div class="container">
          <div class="app-cta animate-on-scroll">
            <div class="app-cta-glow" aria-hidden="true"></div>
            <div class="app-cta-content">
              <div class="app-cta-badge"><span class="pulse-dot"></span>Free Forever Plan</div>
              <h2>See How Your Food Influences <span class="highlight">Your Sleep, HRV &amp; Recovery</span></h2>
              <p>Kygo Health connects your wearable data with nutrition tracking to pinpoint personal correlations between what you eat, your sleep, your HRV, and how fast you recover from stress.</p>
              <div class="app-cta-buttons">
                <a href="${iosUrl}" class="app-cta-btn" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </a>
                <a href="https://kygo.app/android" target="_blank" rel="noopener" class="app-cta-android">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                  Download for Android
                </a>
              </div>
              <div class="app-cta-tags">
                <span class="app-cta-tags-label">Works with</span>
                <div class="app-cta-tags-logos">
                  <img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura" loading="lazy" />
                  <img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple" loading="lazy" />
                  <img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit" loading="lazy" />
                  <img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin" loading="lazy" />
                  <img src="https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png" alt="Whoop" loading="lazy" />
                  <img src="https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png" alt="Health Connect" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>`;
  }


  _renderTopPicks() {
    return `
      <section class="picks-section section-bg-white">
        <div class="container">
          <div class="picks-card">
            <div class="picks-glow" aria-hidden="true"></div>
            <div class="picks-head animate-on-scroll">
              <span class="picks-eyebrow">Eight headlines from the data</span>
              <h2 class="picks-title">If you only remember <em>eight things</em>.</h2>
            </div>
            <div class="picks-grid">
              ${this._topPicks().map((p, i) => `
                <article class="pick-card ${p.cls || ''} animate-on-scroll" style="--delay:${i * 70}ms">
                  <span class="pick-icon" aria-hidden="true">${this._icon(p.icon)}</span>
                  <span class="pick-label">${p.label}</span>
                  <div class="pick-stat">${p.stat}</div>
                  <h3 class="pick-answer">${p.answer}</h3>
                  <p class="pick-note">${p.note}</p>
                </article>`).join('')}
            </div>
          </div>
        </div>
      </section>`;
  }

  _renderFactorCard(f) {
    const isExp = this._listExpandedKey === f._devKey;
    const impCfg = this._impactCfg(f.impact);
    const metricLbl = (this._metricMeta[f.metric] || {}).label || '';
    const dirCls = f.direction === 'positive' ? 'fact-dir-pos' : f.direction === 'negative' ? 'fact-dir-neg' : 'fact-dir-var';
    const dirArrow = f.direction === 'positive' ? '↓' : f.direction === 'negative' ? '↑' : '↕';
    const dirLbl = f.direction === 'positive' ? 'Improves stress reading' : f.direction === 'negative' ? 'Worsens stress reading' : 'Variable effect';

    let body = '';
    if (isExp) {
      body = `
        <div class="fact-body">
          ${f.plainEnglish ? `<p class="fact-lede">${f.plainEnglish}</p>` : ''}
          <dl class="fact-fields">
            <div><dt>Magnitude</dt><dd>${f.magnitude}</dd></div>
            <div><dt>Mechanism</dt><dd>${f.mechanism}</dd></div>
            ${f.whatToDo ? `<div class="fact-fields--full"><dt>What to do</dt><dd>${f.whatToDo}</dd></div>` : ''}
          </dl>
          <div class="fact-source-row">
            <span class="fact-source-lbl">Source</span>
            <a href="${f.source.url}" target="_blank" rel="noopener" class="source-link">${f.source.label} ${this._icon('externalLink')}</a>
          </div>
        </div>`;
    }

    return `
      <article class="fact-card ${isExp ? 'expanded' : ''}" data-fact-key="${f._devKey}">
        <button class="fact-head" aria-expanded="${isExp}">
          <span class="fact-meta">
            <span class="fact-cat">${metricLbl} <span class="fact-dir ${dirCls}" aria-hidden="true">${dirArrow}</span></span>
            <span class="fact-name">${f.name}</span>
            <span class="fact-effect ${dirCls}">${dirLbl} · ${impCfg.label} impact</span>
          </span>
          <span class="fact-pill ${impCfg.cls}">${impCfg.label}</span>
          <span class="fact-chev" aria-hidden="true">${this._icon('chevDown')}</span>
        </button>
        ${body}
      </article>`;
  }

  _renderFactorList() {
    // Two groups: what helps (improves the metric) vs what hurts (worsens or confounds).
    const all = this._factorsForDevice(this._device1);
    const m = this._categoryFilter;
    const filtered = m ? all.filter(f => f.metric === m) : all;
    if (!filtered.length) return '<p class="dash-empty">No factors match this filter.</p>';

    const byImpact = (a, b) =>
      this._impactCfg(b.impact).weight - this._impactCfg(a.impact).weight ||
      a.name.localeCompare(b.name);
    const helps = filtered.filter(f => f.direction === 'positive').sort(byImpact);
    const hurts = filtered.filter(f => f.direction === 'negative' || f.direction === 'variable').sort(byImpact);

    const group = (cls, label, sub, items) => `
      <div class="fact-group fact-group--${cls}">
        <div class="fact-group-head">
          <span class="fact-group-label"><span class="fact-group-icon" aria-hidden="true"></span>${label}</span>
          <span class="fact-group-meta">${items.length} factor${items.length === 1 ? '' : 's'} · ${sub}</span>
        </div>
        <div class="fact-list">
          ${items.length ? items.map(f => this._renderFactorCard(f)).join('') : '<p class="dash-empty">None in this view.</p>'}
        </div>
      </div>`;

    return `
      <div class="fact-groups">
        ${group('helps', 'What helps', 'Improves your reading', helps)}
        ${group('hurts', 'What hurts', 'Worsens or confounds your reading', hurts)}
      </div>`;
  }

  _renderMetricTiles() {
    const deviceMetrics = this._deviceMetrics[this._device1] || [];
    const tiles = deviceMetrics.map(k => {
      const m = this._metricMeta[k];
      const count = (this._metricFactors[k] || []).length;
      const isActive = this._categoryFilter === k;
      return `
        <button class="picker-tile ${isActive ? 'active' : ''}" data-cat="${k}" aria-pressed="${isActive}">
          <span class="picker-tile-name">${m.label}</span>
          <span class="picker-tile-count">${count}</span>
        </button>`;
    }).join('');
    return `<div class="picker-tiles picker-tiles--metrics" data-metric-count="${deviceMetrics.length}">${tiles}</div>`;
  }

  _renderDevicePicker() {
    const options = Object.entries(this._devices).map(([k, d]) => {
      const selected = this._device1 === k ? ' selected' : '';
      return `<option value="${k}"${selected}>${d.name}</option>`;
    }).join('');
    return `
      <div class="device-picker">
        <label class="device-picker-label" for="device-select">Your wearable</label>
        <div class="device-select-wrap">
          <select class="device-select" id="device-select" data-device-select aria-label="Pick your wearable">${options}</select>
          <span class="device-select-chev" aria-hidden="true">${this._icon('chevDown')}</span>
        </div>
      </div>`;
  }

  _renderFactorsSection() {
    const d1 = this._devices[this._device1];
    const cat = this._categoryFilter;
    const catLabel = cat ? (this._metricMeta[cat] || {}).label : null;
    const total = this._factorsForDevice(this._device1).length;
    const shown = cat
      ? this._factorsForDevice(this._device1).filter(f => f.metric === cat).length
      : total;
    const metricCount = (this._deviceMetrics[this._device1] || []).length;
    return `
      <section class="factors-section section-bg-gray">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('activity')}</span>What moves your score</span>
            <h2 class="section-h2">${total} <em>factors</em> that influence your <em>${d1.name}</em> ${d1.scoreName || 'stress score'}.</h2>
            <p class="section-lede">Pick your wearable to see the metrics it actually reads, then tap a metric to drill in. Each metric splits into what helps your reading and what hurts it, ranked by impact. Remember: these signals reflect autonomic arousal, so "what hurts" includes both stressors and confounders (heat, caffeine, exercise) that move the same physiology.</p>
          </div>
          ${this._renderDevicePicker()}
          <span class="metric-tiles-label">${metricCount} metric${metricCount === 1 ? '' : 's'} ${d1.name} reads</span>
          ${this._renderMetricTiles()}
          <div class="picker-panel">
            <div class="picker-panel-head">
              <h3 class="picker-panel-title">${catLabel ? `${catLabel} factors` : 'All factors'}<span class="picker-panel-meta">${shown} factor${shown === 1 ? '' : 's'}</span></h3>
            </div>
            ${this._renderFactorList()}
          </div>
        </div>
      </section>`;
  }

  _renderSourcesSection() {
    const groups = {
      'HRV, heart rate & autonomic regulation': [
        { label: 'Frontiers in Physiology 2024 — Factors Influencing HRV (PMC11333334)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11333334/' },
        { label: 'PMC8950456 — HRV & Different Factors (Exercise, Sleep, Training Load)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8950456/' },
        { label: 'PMC9974008 — HRV as a Measure of Chronic Stress', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9974008/' },
        { label: 'PMC11439429 — HRV Measurement & Influencing Factors', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11439429/' },
        { label: 'PMC9549087 — Factors Affecting Resting Heart Rate in Free-Living Adults', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9549087/' },
        { label: 'PMC6306777 — Effects of Exercise on Resting Heart Rate (Reimers 2018, meta-analysis)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/' },
        { label: 'PMC8391190 — Sedentary Time, HR & HRV Meta-Analysis', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8391190/' },
        { label: 'PMC6821413 — Acute Psychosocial Stress & HRV', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6821413/' },
        { label: 'PubMed 31345594 — Body Temperature & Heart Rate (Liebermeister)', url: 'https://pubmed.ncbi.nlm.nih.gov/31345594/' }
      ],
      'Alcohol, caffeine, hydration & body weight': [
        { label: 'PMC4971776 — Alcohol Dose-Response on RMSSD (Brunetti)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4971776/' },
        { label: 'PMC5878366 — Real-World Alcohol Effect on Overnight HRV (Pietilä)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5878366/' },
        { label: 'PMC11391823 — Alcohol & Thermoregulation Systematic Review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11391823/' },
        { label: 'PMC5821259 — Alcohol & the Sleeping Brain (Colrain)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5821259/' },
        { label: 'ScienceDirect 2024 — Alcohol & Sleep Meta-Analysis', url: 'https://www.sciencedirect.com/science/article/pii/S1087079224001345' },
        { label: 'PMC11284693 — Caffeine & HRV Meta-Analysis (Costa)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11284693/' },
        { label: 'PMC5537855 — Coffee & HRV in the ELSA-Brasil Cohort', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5537855/' },
        { label: 'PMC11648991 — Caffeine Cardiovascular Response Review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11648991/' },
        { label: 'PubMed 24203773 — Caffeine Effects on BP & HR', url: 'https://pubmed.ncbi.nlm.nih.gov/24203773/' },
        { label: 'PubMed 2312473 — Caffeine & Ventilatory Responses (D\'Urzo)', url: 'https://pubmed.ncbi.nlm.nih.gov/2312473/' },
        { label: 'PMC9541543 — Adenosine, Caffeine & Sleep Regulation (Reichert)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9541543/' },
        { label: 'PMC2343381 — Hydration & Cardiovascular Control (Charkoudian)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2343381/' },
        { label: 'Nature 2019 — Hydration, Autonomic Adaptation & Mood', url: 'https://www.nature.com/articles/s41598-019-52775-5' },
        { label: 'PMC8072942 — Obesity, Nutrition & HRV', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8072942/' },
        { label: 'PMC8260607 — Elevated RHR, Inflammation & CV Risk in Obesity', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8260607/' },
        { label: 'ScienceDirect — Weight Loss & HRV Systematic Review', url: 'https://www.sciencedirect.com/science/article/abs/pii/S026156142200334X' },
        { label: 'ScienceDirect — Cold Exposure & Cardiac Autonomic Control (Bouzigon meta-analysis 2024)', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0306456524000755' }
      ],
      'EDA & skin conductance (peer-reviewed)': [
        { label: 'PMC9333288 — EDA Characterizes Autonomic NS in Real Time', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9333288/' },
        { label: 'PMC9573480 — EDA Features for Mental Effort (Posada-Quintero)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9573480/' },
        { label: 'PMC10575214 — Five Basic Senses Evoke EDA', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10575214/' },
        { label: 'PMC6287044 — Arousal, Pupil, HR & Skin Conductance (Bradley)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6287044/' },
        { label: 'PMC4977170 — Preoptic Activation & Thermal Sweating (Farrell)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4977170/' },
        { label: 'PubMed 32367339 — Mindfulness Predicts SCR to Stress (Lin)', url: 'https://pubmed.ncbi.nlm.nih.gov/32367339/' },
        { label: 'PMC3883934 — EDA Habituation Latent Class Analysis', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3883934/' },
        { label: 'PubMed 39294847 — Dehydration Does Not Alter Sweat Electrolytes (Baker)', url: 'https://pubmed.ncbi.nlm.nih.gov/39294847/' }
      ],
      'Skin temperature, respiratory rate & SpO₂': [
        { label: 'PMC4664114 — Skin Temperature Reveals the Intensity of Acute Stress', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4664114/' },
        { label: 'PMC9690349 — Skin Temp & Ambient Confounds', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9690349/' },
        { label: 'Nature 2026 — Wearable Skin Temperature Dynamics During Sleep', url: 'https://www.nature.com/articles/s41746-026-02633-2' },
        { label: 'ScienceDirect 2025 — EDA & Skin Temp in Stress and Depression', url: 'https://www.sciencedirect.com/science/article/pii/S2666915325000071' },
        { label: 'PMC5356216 — Active Vasodilation in Human Skin', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5356216/' },
        { label: 'PMC9394784 — Human Temperature Regulation Under Heat Stress', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9394784/' },
        { label: 'PMC7575238 — Temperature Regulation Across the Menstrual Cycle (Baker)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7575238/' },
        { label: 'PMC11452339 — Wrist Skin Temp Across the Menstrual Cycle', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11452339/' },
        { label: 'PubMed 31536050 — Fever Raises HR & RR (Prospective Study)', url: 'https://pubmed.ncbi.nlm.nih.gov/31536050/' },
        { label: 'PMC5577533 — Ventilatory Response to Stress (Grassmann)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5577533/' },
        { label: 'PubMed 28240995 — Pain & Respiration Systematic Review (Jafari)', url: 'https://pubmed.ncbi.nlm.nih.gov/28240995/' },
        { label: 'ScienceDirect — RR Most Strongly Reflects Pain Intensity', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0735675719300385' },
        { label: 'PMC10741869 — Breathing Practices for Stress & Anxiety (Hopper)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10741869/' },
        { label: 'PMC6465339 — Pulse-Respiration Quotient', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6465339/' },
        { label: 'PMC5732209 — Respiratory Frequency Review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5732209/' },
        { label: 'PMC5027356 — RR Variability in Healthy Sleep (Lechat)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5027356/' },
        { label: 'PMC11235883 — Monitoring Fatigue with HR & Subjective Measures (Schmitt)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11235883/' },
        { label: 'PMC9697047 — High-Altitude SpO₂ Review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9697047/' },
        { label: 'PMC10250969 — Oxygen Desaturation Index as OSA Marker', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10250969/' },
        { label: 'PMC10044291 — Pulse Oximetry & Pneumonia', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10044291/' },
        { label: 'PMC5531304 — BTS Guideline for Oxygen Use in Adults', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/' },
        { label: 'PMC6013732 — Carboxyhemoglobin in Smokers (Hampson)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6013732/' }
      ],
      'Sleep architecture': [
        { label: 'PMC8131073 — Dinner Timing & Sleep Stages', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8131073/' },
        { label: 'PMC11293727 — Meal Timing & Sleep Quality Review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11293727/' },
        { label: 'PubMed 21164152 — Blue Light, Dose-Dependent Melatonin Suppression (Brainard)', url: 'https://pubmed.ncbi.nlm.nih.gov/21164152/' },
        { label: 'PMC9424753 — Blue Light, Sleep & Wellbeing Systematic Review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9424753/' }
      ],
      'Manufacturer documentation': [
        { label: 'Garmin Support — What Is the Stress Level Feature?', url: 'https://support.garmin.com/en-US/?faq=WT9BmhjacO4ZpxbCc0EKn9' },
        { label: 'Garmin — HRV Stress Test Technology', url: 'https://www.garmin.com/en-US/garmin-technology/cycling-science/physiological-measurements/hrv-stress-test/' },
        { label: 'Garmin Elevate Wiki — Sensor Generations', url: 'https://wiki.garminrumors.com/Garmin_Elevate' },
        { label: 'the5krunner 2023 — New Garmin Elevate Gen 5', url: 'https://the5krunner.com/2023/05/13/new-garmin-elevate-gen-5/' },
        { label: 'Samsung Developer — BioActive Sensor Overview', url: 'https://developer.samsung.com/health/sensor/overview.html' },
        { label: 'Samsung Developer — Galaxy Watch EDA Sensor', url: 'https://developer.samsung.com/health/blog/en/how-the-galaxy-watchs-eda-sensor-enhances-your-health-monitoring' },
        { label: 'Samsung Newsroom — Galaxy Watch 8 Unpacked 2025', url: 'https://news.samsung.com/global/galaxy-unpacked-2025-a-first-look-at-the-galaxy-watch8-series-streamlining-sleep-exercise-and-everything-in-between' },
        { label: 'Samsung IE — Health Features on Galaxy Watch 8 / 8 Classic', url: 'https://www.samsung.com/ie/support/mobile-devices/health-features-on-the-galaxy-watch8-and-watch8-classic/' },
        { label: 'Samsung Community — Antioxidant Index Availability (GW8 Only)', url: 'https://us.community.samsung.com/t5/Galaxy-Watch/Antioxidant-portion-not-available-on-the-Galaxy-watch-Ultra/td-p/3303935' },
        { label: 'Google Research — Pixel Watch / Fitbit Sense 2 EDA', url: 'https://research.google/blog/what-does-electrodermal-sensing-reveal-insights-from-the-pixel-watch-fitbit-sense-2/' },
        { label: 'Google Blog — How We Trained Fitbit Body Response', url: 'https://blog.google/products/fitbit/how-we-trained-fitbits-body-response-feature-to-detect-stress/' },
        { label: 'WHOOP Support — Get to Know the Stress Monitor', url: 'https://support.whoop.com/s/article/Get-to-Know-the-Stress-Monitor' },
        { label: 'WHOOP Support — HRV Insights & WHOOP Metrics', url: 'https://support.whoop.com/s/article/Heart-Rate-Variability-HRV-Insights-WHOOP-Metrics' },
        { label: 'WHOOP Blog — How Does WHOOP Recovery Work 101', url: 'https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/' },
        { label: 'WHOOP — A Look Behind the Data: How WHOOP Measures Heart Rate', url: 'https://www.whoop.com/us/en/thelocker/a-look-behind-the-data-how-whoop-measures-heart-rate/' },
        { label: 'the5krunner Feb 2026 — WHOOP HR Algorithm Update', url: 'https://the5krunner.com/2026/02/28/whoop-heart-rate-accuracy-update/' },
        { label: 'WHOOP Research — How Stress Mindset Shapes Recovery (n=11,000+)', url: 'https://www.whoop.com/us/en/thelocker/new-whoop-research-on-stress-perception/' },
        { label: 'WHOOP Support — Journal Overview (160+ Behaviors)', url: 'https://support.whoop.com/s/article/WHOOP-Journal-Overview' },
        { label: 'WHOOP Support — Recovery Impacts', url: 'https://support.whoop.com/s/article/Recovery-Insights' },
        { label: 'Oura Help — Resilience', url: 'https://support.ouraring.com/hc/en-us/articles/25358829055251-Resilience' },
        { label: 'Oura Help — Cumulative Stress', url: 'https://support.ouraring.com/hc/en-us/articles/45979919957395-Cumulative-Stress' },
        { label: 'Oura Blog 2025 — Introducing Cumulative Stress', url: 'https://ouraring.com/blog/what-is-cumulative-stress/' },
        { label: 'Oura Blog — Discover Oura\'s Daytime Stress Feature', url: 'https://ouraring.com/blog/daytime-stress-feature/' },
        { label: 'Oura — Inside the Ring: Quantifying Chronic Stress', url: 'https://ouraring.com/blog/inside-the-ring-cumulative-stress/' },
        { label: 'Apple Developer — HealthKit heartRateVariabilitySDNN', url: 'https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilitysdnn' },
        { label: 'Apple Nov 2024 — Heart Rate, Calorimetry & Activity on Apple Watch (PDF)', url: 'https://www.apple.com/health/pdf/Heart_Rate_Calorimetry_Activity_on_Apple_Watch_November_2024.pdf' },
        { label: 'Athlytic Help — Understanding Recovery (RMSSD + RHR, 60-day Baseline)', url: 'https://athlyticapp.helpscoutdocs.com/article/20-understanding-recovery' },
        { label: 'Welltory Help — Frequency-Domain HRV Scores (LF / HF / VLF)', url: 'https://help.welltory.com/en/articles/3878862-frequency-domain-scores-of-your-heart-rate-variability' },
        { label: 'Polar Support — Nightly Recharge Recovery Measurement', url: 'https://support.polar.com/us-en/nightly-recharge-recovery-measurement' },
        { label: 'Polar — Vantage V3 Manual: Nightly Recharge', url: 'https://support.polar.com/e_manuals/vantage-v3/polar-vantage-v3-user-manual-english/nightly-recharge.htm' },
        { label: 'COROS Help Center — Daily Stress', url: 'https://support.coros.com/hc/en-us/articles/22933434857108-Daily-Stress' },
        { label: 'Amazfit Support — What Is Stress Monitoring?', url: 'https://support.amazfit.com/en/faq/4133' },
        { label: 'Amazfit — What is Heart Rate Variability (HRV)?', url: 'https://us.amazfit.com/pages/what-is-heart-rate-variability-hrv' }
      ],
      'Wearable accuracy & methodology': [
        { label: 'Frontiers in Computer Science 2024 — Stress Detection Using Wearables (Systematic Review)', url: 'https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2024.1478851/full' },
        { label: 'JMIR 2024 — Wearable AI in Detecting Stress: Systematic Review and Meta-Analysis (~82% multi-signal vs ~77% HRV)', url: 'https://www.jmir.org/2024/1/e52622' },
        { label: 'Springer 2025 — Stress in Action Wearables Database', url: 'https://link.springer.com/article/10.3758/s13428-025-02685-4' },
        { label: 'Nature Communications Medicine 2025 — Wearables for Anxiety Assessment', url: 'https://www.nature.com/articles/s43856-025-01234-6' },
        { label: 'PMC11230864 — Real-Time Stress Prediction Models Using Wearables', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11230864/' },
        { label: 'ScienceDirect 2025 — From Lab to Real-Life: Three-Stage Validation', url: 'https://www.sciencedirect.com/science/article/pii/S2215016125000536' },
        { label: 'ScienceDirect 2025 — Meta-Analysis of 171 TSST Studies (n=8,452)', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0306453025002896' },
        { label: 'ScienceDirect — The Trier Social Stress Test: Principles and Practice', url: 'https://www.sciencedirect.com/science/article/pii/S2352289516300224' },
        { label: 'PMC7739033 — Systematic Review of TSST Methodology', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7739033/' },
        { label: 'arXiv 2025 — Extending Stress Detection Reproducibility to Consumer Wearables', url: 'https://arxiv.org/html/2505.05694v1' },
        { label: 'ScienceDirect — Machine Learning for Predicting Stress Episodes', url: 'https://www.sciencedirect.com/science/article/pii/S0010482525015197' },
        { label: 'MDPI Algorithms 2025 — Smartwatches in Stress Management & Well-Being', url: 'https://www.mdpi.com/1999-4893/18/7/419' },
        { label: 'JMIR mHealth 2026 — Wearables for Stress Measurement in College Students', url: 'https://mhealth.jmir.org/2026/1/e64144' },
        { label: 'Frontiers Digital Health 2022 (PMC9780663) — Apple Watch ECG for Stress Prediction (F1 52–64%)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9780663/' },
        { label: 'Sensors / MDPI 2024 — Apple Watch Series 9 / Ultra 2 HRV Validity vs Polar H10 + Kubios', url: 'https://www.mdpi.com/1424-8220/24/19/6220' },
        { label: 'npj Digital Medicine 2025 — Apple Watch Measurements Living Systematic Review & Meta-Analysis', url: 'https://www.nature.com/articles/s41746-025-02238-1' },
        { label: 'PMC9505647 — WHOOP-Derived lnRMSSD Day-to-Day Variability (Olympic Water Polo)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9505647/' },
        { label: 'PMC8160717 — Wrist PPG Assessment of HR & HRV: WHOOP Validation vs ECG', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8160717/' }
      ]
    };
    const total = Object.values(groups).reduce((s, g) => s + g.length, 0);
    return `
      <section class="sources-section section-bg-gray">
        <div class="container">
          <h2 class="section-title">Sources</h2>
          <p class="section-sub">All claims sourced from peer-reviewed research and official device documentation. Every factor in the breakdown above cites at least one of these.</p>
          <div class="src-accordion">
            <div class="src-count-badge">${total} sources cited</div>
            ${Object.entries(groups).map(([cat, items]) => `
              <div class="src-group">
                <button class="src-group-toggle" aria-expanded="false">
                  <span class="src-group-name">${cat}</span>
                  <span class="src-group-count">${items.length}</span>
                  <span class="src-group-chevron">${this._icon('chevDown')}</span>
                </button>
                <div class="src-group-body">
                  ${items.map(s => `<a href="${s.url}" class="src-item" target="_blank" rel="noopener"><span class="src-dot"></span><span class="src-text">${s.label}</span><span class="src-ext">${this._icon('externalLink')}</span></a>`).join('')}
                </div>
              </div>`).join('')}
          </div>
        </div>
      </section>`;
  }


  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const totalFactors = Object.values(this._metricFactors).reduce((s, arr) => s + arr.length, 0);
    const totalDevices = Object.keys(this._devices).length;

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="header">
        <div class="header-inner">
          <a href="https://kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" />
            Stress Research
          </a>
          <a href="https://kygo.app" class="header-link" target="_blank" rel="noopener">
            Get App ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <section class="hero section-bg-white">
        <div class="container hero-inner">
          <div class="hero-kicker animate-on-scroll"><span class="hero-dot" aria-hidden="true"></span>${totalFactors} Factors · ${totalDevices} Wearables</div>
          <h1 class="hero-title animate-on-scroll">How does <em>your wearable</em> measure stress?</h1>
          <p class="hero-sub animate-on-scroll">Every wearable measures <strong>autonomic arousal</strong>, not stress directly — through HRV, EDA, skin temp, and breathing rate. We compare <strong>10 brands</strong> head-to-head, with hardware-generation context and validation versus the Polar H10 chest-strap reference. Pick your device and the factor list re-sorts around what actually moves <strong>your</strong> score.</p>
          <div class="animate-on-scroll">
            <div class="hero-meta">
              <div class="hero-cell"><span class="hero-num">${totalDevices}</span><span class="hero-lbl">Wearables</span></div>
              <div class="hero-cell"><span class="hero-num">${totalFactors}</span><span class="hero-lbl">Factors tracked</span></div>
              <div class="hero-cell"><span class="hero-num hero-num--pos">82%</span><span class="hero-lbl">Multi-signal accuracy</span></div>
              <div class="hero-cell"><span class="hero-num">77%</span><span class="hero-lbl">HRV-only accuracy</span></div>
            </div>
          </div>
          ${this._heroWaveSvg()}
        </div>
      </section>

      ${this._renderComparisonModule()}
      ${this._renderCtaRow()}
      ${this._renderFactorsSection()}
      ${this._renderArticleCta()}
      ${this._renderFullBreakdown()}
      ${this._renderTopPicks()}
      ${this._renderSourcesSection()}

      <footer class="tool-footer">
        <div class="container">
          <a href="https://kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" loading="lazy" />
            Kygo Health
          </a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Always consult a qualified healthcare provider before changing supplement, exercise, or lifestyle routines.</p>
          <p class="footer-copyright">© ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  _setupEventDelegation() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const shadow = this.shadowRoot;

    // Replace an element with freshly-parsed HTML. Works whether the parent
    // is a regular Element OR a ShadowRoot/DocumentFragment — `outerHTML =`
    // throws on the latter, so we always go through replaceWith().
    const replaceWithHTML = (oldEl, html) => {
      if (!oldEl) return;
      const tmpl = document.createElement('template');
      tmpl.innerHTML = html;
      const newEl = tmpl.content.firstElementChild;
      if (newEl) oldEl.replaceWith(newEl);
    };

    shadow.addEventListener('click', (e) => {
      if (e.target.closest('.source-link, a[href]')) return;

      const srcToggle = e.target.closest('.src-group-toggle');
      if (srcToggle) {
        const group = srcToggle.closest('.src-group');
        if (group) {
          const isOpen = group.classList.toggle('open');
          srcToggle.setAttribute('aria-expanded', isOpen);
        }
        return;
      }

      const dcRow = e.target.closest('[data-device-row]');
      if (dcRow) {
        const k = dcRow.dataset.deviceRow;
        this._compareExpandedKey = this._compareExpandedKey === k ? null : k;
        replaceWithHTML(shadow.querySelector('.breakdown-section'), this._renderFullBreakdown());
        return;
      }

      const tile = e.target.closest('[data-cat]');
      if (tile) {
        const k = tile.dataset.cat;
        this._categoryFilter = this._categoryFilter === k ? null : k;
        this._listExpandedKey = null;
        replaceWithHTML(shadow.querySelector('.factors-section'), this._renderFactorsSection());
        return;
      }

      const factHead = e.target.closest('.fact-head');
      if (factHead) {
        const card = factHead.closest('[data-fact-key]');
        if (card) {
          const k = card.dataset.factKey;
          this._listExpandedKey = this._listExpandedKey === k ? null : k;
          replaceWithHTML(shadow.querySelector('.fact-groups'), this._renderFactorList());
        }
        return;
      }
    });

    shadow.addEventListener('change', (e) => {
      const sel = e.target.closest('[data-device-select]');
      if (sel) {
        const k = sel.value;
        if (k && this._device1 !== k) {
          this._device1 = k;
          this._categoryFilter = null;
          this._listExpandedKey = null;
          replaceWithHTML(shadow.querySelector('.factors-section'), this._renderFactorsSection());
        }
      }
    });
  }

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
      }, { rootMargin: '0px 0px -50px 0px', threshold: 0.2 });
      els.forEach(el => this._observer.observe(el));
      // Safety net: if the IntersectionObserver hasn't revealed an element
      // within 1.5s (slow scroll, missed callback, prefers-reduced-motion
      // edge cases), reveal it anyway so content is never stuck invisible.
      setTimeout(() => {
        this.shadowRoot.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(el => el.classList.add('visible'));
      }, 1500);
    });
  }

  _styles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

      :host {
        --dark: #1E293B;
        --dark-card: #0F172A;
        --dark-surface: #1a2332;
        --light: #F8FAFC;
        --green: #22C55E;
        --green-dark: #16A34A;
        --green-light: rgba(34,197,94,0.10);
        --green-glow: rgba(34,197,94,0.3);
        --amber: #B45309;
        --amber-light: rgba(180,83,9,0.10);
        --yellow: #FBBF24;
        --red: #EF4444;
        --red-light: rgba(239,68,68,0.10);
        --indigo: #6366F1;
        --gray-50: #f9fafb;
        --gray-100: #F1F5F9;
        --gray-200: #E2E8F0;
        --gray-300: #CBD5E1;
        --gray-400: #94A3B8;
        --gray-600: #475569;
        --gray-700: #334155;
        --radius: 20px;
        --radius-sm: 10px;
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
      a { color: var(--green); text-decoration: none; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; min-width: 0; }

      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: var(--delay, 0ms); }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      :focus { outline: none; }
      button:focus-visible, .source-link:focus-visible, select:focus-visible, a:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; border-radius: 6px; }

      /* HEADER */
      .header { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid var(--gray-200); }
      .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 16px; max-width: 1200px; margin: 0 auto; }
      .logo { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); white-space: nowrap; min-width: 0; }
      .logo-img { height: 26px; width: auto; flex-shrink: 0; }
      .header-link { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: #fff; background: var(--green); padding: 7px 12px; border-radius: 50px; transition: background .2s; white-space: nowrap; flex-shrink: 0; }
      .header-link:hover { background: var(--green-dark); }
      .header-link svg { width: 13px; height: 13px; }

      /* HERO */
      .hero { padding: 40px 0 28px; background: #fff; }
      .hero-inner { position: relative; }
      .hero-kicker { display: inline-flex; align-items: center; gap: 7px; font-size: 9.5px; font-weight: 700; color: var(--green-dark); background: var(--green-light); padding: 6px 11px; border-radius: 9999px; letter-spacing: 0.4px; text-transform: uppercase; margin-bottom: 20px; max-width: 100%; line-height: 1.4; text-align: left; }
      .hero-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 0 rgba(34,197,94,0.6); animation: pulse 2.2s infinite; flex-shrink: 0; }
      @media (min-width: 480px) { .hero-kicker { font-size: 10.5px; white-space: nowrap; } }
      @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.6);} 70%{box-shadow:0 0 0 8px rgba(34,197,94,0);} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0);} }
      .hero-title { font-size: clamp(32px, 8.5vw, 76px); line-height: 1.02; letter-spacing: -0.03em; font-weight: 600; margin: 0; color: var(--dark); max-width: 15ch; }
      .hero-title em { font-style: normal; color: var(--green); font-family: inherit; }
      .hero-sub { margin: 20px 0 0; max-width: 56ch; font-size: clamp(15px, 2.2vw, 19px); line-height: 1.5; color: var(--gray-600); }
      .hero-sub strong { color: var(--dark); font-weight: 600; }
      .hero-meta { margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-top: 1px solid var(--gray-200); padding-top: 20px; max-width: 760px; }
      .hero-meta .hero-cell { padding: 8px 14px 8px 0; border-right: 1px solid var(--gray-200); min-width: 0; }
      .hero-meta .hero-cell:nth-child(2n) { border-right: 0; padding-right: 0; padding-left: 16px; }
      .hero-meta .hero-cell:nth-child(-n+2) { border-bottom: 1px solid var(--gray-200); padding-bottom: 16px; }
      .hero-meta .hero-cell:nth-child(n+3) { padding-top: 16px; }
      .hero-num { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: clamp(26px, 6.5vw, 40px); color: var(--dark); letter-spacing: -0.02em; font-feature-settings: "tnum" 1; display: block; line-height: 1; }
      .hero-num--pos { color: var(--green-dark); }
      .hero-num--neg { color: var(--red); }
      .hero-lbl { font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; color: var(--gray-400); font-weight: 600; margin-top: 6px; display: block; }
      .hero-wave { display: none; }
      @media (min-width: 640px) {
        .hero-meta { grid-template-columns: repeat(4, 1fr); }
        .hero-meta .hero-cell { padding: 0 16px; border-right: 1px solid var(--gray-200); border-bottom: 0 !important; }
        .hero-meta .hero-cell:first-child { padding-left: 0; }
        .hero-meta .hero-cell:last-child { border-right: 0; padding-right: 0; }
        .hero-meta .hero-cell:nth-child(n+3), .hero-meta .hero-cell:nth-child(-n+2) { padding-top: 0; padding-bottom: 0; }
      }
      @media (min-width: 768px) { .hero { padding: 72px 0 48px; } }
      @media (min-width: 1000px) {
        .hero-wave { display: block; position: absolute; right: -20px; top: 30px; width: 46%; max-width: 560px; opacity: 0.9; pointer-events: none; }
      }

      /* SECTION BACKGROUNDS */
      .section-bg-white { background: #fff; }
      .section-bg-gray { background: var(--gray-100); }

      .section-header { margin-bottom: 28px; max-width: 760px; }
      .section-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 10.5px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--green-dark); margin-bottom: 12px; }
      .section-eyebrow-icon { width: 22px; height: 22px; border-radius: 7px; background: var(--green-light); color: var(--green-dark); display: inline-flex; align-items: center; justify-content: center; }
      .section-eyebrow-icon svg { width: 13px; height: 13px; }
      .section-eyebrow.amber { color: var(--amber); }
      .section-eyebrow.amber .section-eyebrow-icon { background: rgba(180,83,9,0.10); color: var(--amber); }
      .section-h2 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: clamp(26px, 5.5vw, 40px); letter-spacing: -0.02em; line-height: 1.08; margin: 0 0 12px; color: var(--dark); }
      .section-h2 em { font-style: normal; color: var(--green); font-family: inherit; }
      .section-lede { font-size: 15px; color: var(--gray-600); line-height: 1.55; margin: 0; max-width: 64ch; }
      .section-title { font-size: clamp(24px, 6vw, 36px); text-align: center; margin-bottom: 8px; }
      .section-sub { text-align: center; color: var(--gray-600); font-size: 15px; margin-bottom: 32px; max-width: 560px; margin-left: auto; margin-right: auto; }
      .comparison-section, .breakdown-section, .factors-section, .callout-section, .sources-section, .picks-section, .myths-section { padding: 48px 0 56px; }
      @media (min-width: 768px) {
        .comparison-section, .factors-section, .callout-section, .sources-section, .picks-section, .myths-section { padding: 64px 0 72px; }
      }

      /* ARTICLE CTA */
      .article-card { position: relative; display: grid; grid-template-columns: auto 1fr auto; grid-template-areas: 'badge . arrow' 'body body body'; align-items: center; gap: 14px 12px; max-width: 780px; margin: 0 auto; padding: 18px; background: linear-gradient(135deg, #F6FBF7 0%, #EEF8F1 100%); border: 1px solid rgba(34,197,94,0.25); border-radius: 18px; text-decoration: none; overflow: hidden; transition: transform .2s ease-out, border-color .2s, box-shadow .2s; }
      .article-card::before { content: ''; position: absolute; top: -40%; right: -10%; width: 55%; height: 180%; background: radial-gradient(ellipse at top right, rgba(34,197,94,0.18), transparent 65%); pointer-events: none; }
      .article-card:hover { border-color: var(--green); transform: translateY(-1px); box-shadow: 0 10px 24px rgba(34,197,94,0.14); }
      .article-badge { grid-area: badge; position: relative; z-index: 1; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--green-dark); background: #fff; padding: 5px 10px; border-radius: 9999px; border: 1px solid rgba(34,197,94,0.3); white-space: nowrap; justify-self: start; }
      .article-body { grid-area: body; position: relative; z-index: 1; min-width: 0; }
      .article-kicker { display: block; font-size: 11px; font-weight: 600; color: var(--green-dark); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 4px; }
      .article-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); margin: 0; line-height: 1.3; letter-spacing: -0.01em; overflow-wrap: anywhere; }
      .article-year { color: var(--gray-400); font-weight: 500; }
      .article-desc { display: none; font-size: 13px; color: var(--gray-600); margin: 6px 0 0; line-height: 1.45; }
      .article-go { grid-area: arrow; position: relative; z-index: 2; width: 36px; height: 36px; border-radius: 50%; background: var(--green); color: #fff; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background .2s; justify-self: end; }
      .article-card:hover .article-go { background: var(--green-dark); }
      .article-go svg { width: 16px; height: 16px; }
      @media (min-width: 768px) {
        .article-card { grid-template-columns: auto 1fr auto; grid-template-areas: 'badge body arrow'; padding: 24px 28px; gap: 18px; border-radius: 22px; }
        .article-title { font-size: 19px; }
        .article-desc { display: block; }
        .article-go { width: 40px; height: 40px; }
        .article-go svg { width: 18px; height: 18px; }
      }

      /* MYTH FILTERS — pill row, no empty state */
      .myth-filters { display: flex; gap: 6px; padding: 4px 2px 16px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .myth-filters::-webkit-scrollbar { height: 4px; }
      .myth-filters::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 4px; }
      .myth-filter { display: inline-flex; align-items: center; gap: 7px; padding: 7px 12px; min-height: 34px; flex-shrink: 0; background: #fff; border: 1px solid var(--gray-200); border-radius: 9999px; font-family: inherit; font-weight: 600; font-size: 12.5px; color: var(--gray-700); cursor: pointer; white-space: nowrap; transition: all .15s; }
      .myth-filter:hover { border-color: var(--gray-300); }
      .myth-filter.active { background: var(--dark); color: #fff; border-color: var(--dark); }
      .myth-filter-count { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 10.5px; color: var(--gray-400); background: var(--gray-100); padding: 1px 6px; border-radius: 9999px; }
      .myth-filter.active .myth-filter-count { background: rgba(255,255,255,0.18); color: #fff; }

      /* MYTH CARDS */
      .myth-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
      .myth-card { position: relative; background: #fff; border: 1px solid var(--gray-200); border-left: 3px solid var(--amber); border-radius: 12px; padding: 14px 16px 14px 14px; transition: border-color .15s, box-shadow .15s, transform .15s; }
      .myth-card:hover { border-color: var(--gray-300); border-left-color: var(--amber); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(15,23,42,0.06); }
      .myth-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
      .myth-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14px; color: var(--dark); margin: 0; line-height: 1.3; flex: 1; min-width: 0; letter-spacing: -0.005em; }
      .myth-badge { font-size: 9.5px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--amber); background: rgba(180,83,9,0.08); padding: 3px 8px; border-radius: 9999px; white-space: nowrap; flex-shrink: 0; }
      .myth-why { margin: 6px 0 8px; font-size: 12.5px; color: var(--gray-600); line-height: 1.55; }
      .myth-cat-tag { display: inline-block; font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--gray-400); }
      @media (min-width: 680px) {
        .myth-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (min-width: 1024px) {
        .myth-grid { grid-template-columns: repeat(2, 1fr); }
      }

      /* DEVICE CHART — matrix table */
      .device-chart { background: #fff; border: 1px solid var(--gray-200); border-radius: 18px; padding: 18px 16px 14px; box-shadow: 0 1px 0 rgba(15,23,42,0.03); }
      @media (min-width: 768px) { .device-chart { padding: 26px 28px 22px; border-radius: 22px; } }
      .dc-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding-bottom: 14px; margin-bottom: 6px; border-bottom: 1px dashed var(--gray-200); }
      .dc-eyebrow { display: block; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--green-dark); margin-bottom: 4px; }
      .dc-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 19px; color: var(--dark); margin: 0 0 6px; letter-spacing: -0.01em; line-height: 1.2; }
      .dc-sub { font-size: 13px; color: var(--gray-600); margin: 0; line-height: 1.5; max-width: 60ch; }
      .dc-meta { font-size: 11.5px; color: var(--gray-400); font-weight: 600; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.6px; }

      .device-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0 -16px; padding: 0 16px 4px; }
      @media (min-width: 768px) { .device-table-wrap { margin: 0; padding: 0; overflow-x: visible; } }
      .device-table { width: 100%; border-collapse: separate; border-spacing: 0; font-feature-settings: "tnum" 1; min-width: 520px; }
      .device-table th, .device-table td { padding: 0; vertical-align: middle; }

      .device-table thead th { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 10.5px; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); text-align: center; padding: 12px 4px; vertical-align: middle; border-bottom: 1px solid var(--gray-200); white-space: nowrap; background: #fff; }
      .device-table thead .dt-th-device { text-align: left; padding-left: 4px; }
      .device-table thead .dt-th-count { text-align: right; padding-right: 4px; }
      .dt-th-full { display: none; }
      .dt-th-short { display: inline; }
      @media (min-width: 768px) {
        .dt-th-full { display: inline; }
        .dt-th-short { display: none; }
        .device-table thead th { font-size: 11px; padding: 14px 6px; }
      }

      .device-table tbody tr { transition: background .15s; }
      .device-table tbody tr + tr td, .device-table tbody tr + tr th { border-top: 1px solid var(--gray-100); }
      .device-table tbody tr:hover { background: var(--gray-50); }
      .device-table tbody tr:hover .dt-td-device { background: var(--gray-50); }

      .dt-td-device { padding: 10px 8px 10px 4px; width: 56px; min-width: 56px; text-align: left; background: #fff; position: sticky; left: 0; z-index: 1; transition: background .15s; box-shadow: 1px 0 0 var(--gray-200); }
      .dt-brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
      .dt-img { width: 36px; height: 36px; border-radius: 9px; background: var(--gray-100); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
      .dt-img img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
      .dt-img--icon { background: var(--accent, var(--gray-200)); color: #fff; }
      .dt-img--icon svg { width: 16px; height: 16px; }
      .dt-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13.5px; color: var(--dark); letter-spacing: -0.01em; line-height: 1.2; overflow-wrap: anywhere; display: none; }
      @media (min-width: 768px) {
        .dt-td-device { padding: 14px 14px 14px 4px; width: auto; min-width: 220px; position: static; box-shadow: none; }
        .dt-img { width: 40px; height: 40px; border-radius: 10px; }
        .dt-name { display: inline; font-size: 15px; }
      }

      .device-table tbody td { text-align: center; padding: 10px 6px; }
      @media (min-width: 768px) { .device-table tbody td { padding: 14px 8px; } }
      .dt-mark { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; }
      .device-table tbody td.on .dt-mark { background: var(--green); color: #fff; box-shadow: 0 0 0 3px rgba(34,197,94,0.10); }
      .device-table tbody td.on .dt-mark svg { width: 11px; height: 11px; }
      .device-table tbody td.off .dt-mark { background: var(--gray-100); }
      .dt-dash { display: block; width: 9px; height: 2px; border-radius: 1px; background: var(--gray-300); }
      @media (min-width: 768px) {
        .dt-mark { width: 26px; height: 26px; }
        .device-table tbody td.on .dt-mark svg { width: 12px; height: 12px; }
      }

      .dt-td-count { text-align: right; padding-right: 4px; padding-left: 8px; white-space: nowrap; }
      .dt-count-num { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; color: var(--dark); letter-spacing: -0.02em; }
      .dt-count-lbl { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 11px; color: var(--gray-400); margin-left: 2px; }
      @media (min-width: 768px) {
        .dt-count-num { font-size: 19px; }
        .dt-count-lbl { font-size: 12px; }
      }

      /* DEVICE DETAILS — compact dropdowns below the table */
      .device-details { margin-top: 22px; }
      .dd-section-head { margin-bottom: 12px; }
      .dd-section-eyebrow { display: block; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--green-dark); margin-bottom: 4px; }
      .dd-section-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); margin: 0; letter-spacing: -0.01em; line-height: 1.3; }
      @media (min-width: 768px) { .dd-section-title { font-size: 18px; } }

      .dd-list { display: grid; gap: 10px; grid-template-columns: 1fr; }
      .dd-row { background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; overflow: hidden; transition: border-color .15s, box-shadow .15s; animation: dcGrow .55s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: var(--delay, 0ms); }
      .dd-row:hover { border-color: var(--gray-300); }
      .dd-row.open { box-shadow: 0 8px 24px rgba(15,23,42,0.06); }
      @keyframes dcGrow { from { opacity: 0; transform: translateY(4px); } }

      .dd-row-head { display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px 16px; background: transparent; border: 0; cursor: pointer; font-family: inherit; text-align: left; color: inherit; }
      .dd-row-head:hover { background: var(--gray-50); }
      .dd-img { width: 40px; height: 40px; border-radius: 10px; background: var(--gray-100); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
      .dd-img img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
      .dd-img--icon { background: var(--accent, var(--gray-200)); color: #fff; }
      .dd-img--icon svg { width: 18px; height: 18px; }
      .dd-text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .dd-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15.5px; color: var(--dark); line-height: 1.2; letter-spacing: -0.01em; overflow-wrap: anywhere; }
      .dd-line { display: block; margin-top: 3px; font-size: 12.5px; color: var(--gray-600); line-height: 1.35; overflow-wrap: anywhere; }
      .dd-chev { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 9px; color: var(--gray-400); transition: transform .25s, color .15s, background .15s; flex-shrink: 0; }
      .dd-chev svg { width: 15px; height: 15px; }
      .dd-row-head[aria-expanded="true"] .dd-chev { transform: rotate(180deg); color: var(--green-dark); background: var(--green-light); }

      .dd-body { padding: 0 16px 16px; border-top: 1px dashed var(--gray-200); }
      .dd-body[hidden] { display: none; }
      .dd-body-inner { display: grid; gap: 14px; padding-top: 16px; }
      .dd-fields { display: grid; gap: 12px; margin: 0; }
      .dd-fields > div { display: grid; grid-template-columns: 1fr; gap: 3px; }
      .dd-fields dt { font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); margin: 0; }
      .dd-fields dd { margin: 0; font-size: 13.5px; color: var(--gray-700); line-height: 1.55; }
      .dd-callouts { display: grid; gap: 10px; }
      .dd-callout { padding: 14px 16px; border-radius: 12px; border: 1px solid; }
      .dd-callout.strong { background: rgba(34,197,94,0.06); border-color: rgba(34,197,94,0.22); }
      .dd-callout.watch { background: rgba(180,83,9,0.05); border-color: rgba(180,83,9,0.20); }
      .dd-callout-head { display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 6px; }
      .dd-callout.strong .dd-callout-head { color: var(--green-dark); }
      .dd-callout.watch .dd-callout-head { color: var(--amber); }
      .dd-callout-icon { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; }
      .dd-callout-icon svg { width: 14px; height: 14px; }
      .dd-callout p { margin: 0; font-size: 13.5px; color: var(--gray-700); line-height: 1.55; }
      @media (min-width: 880px) {
        /* Two cards per row on desktop — slightly bigger overall */
        .dd-list { grid-template-columns: 1fr 1fr; gap: 14px; align-items: start; }
        .dd-row { border-radius: 16px; }
        .dd-row-head { padding: 18px 20px; gap: 14px; }
        .dd-img { width: 48px; height: 48px; border-radius: 12px; }
        .dd-img--icon svg { width: 22px; height: 22px; }
        .dd-name { font-size: 17px; letter-spacing: -0.015em; }
        .dd-line { font-size: 13px; margin-top: 4px; }
        .dd-chev { width: 32px; height: 32px; border-radius: 10px; }
        .dd-chev svg { width: 16px; height: 16px; }
        .dd-body { padding: 0 22px 22px; }
        .dd-body-inner { padding-top: 18px; gap: 16px; }
      }

      /* EVIDENCE LEADERBOARD */
      .leaderboard { background: #fff; border: 1px solid var(--gray-200); border-radius: 22px; padding: 22px; box-shadow: 0 1px 0 rgba(15,23,42,0.03); }
      @media (min-width: 768px) { .leaderboard { padding: 28px 30px; } }
      .lb-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding-bottom: 14px; margin-bottom: 14px; border-bottom: 1px dashed var(--gray-200); }
      .lb-head-eyebrow { font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase; color: var(--green-dark); }
      .lb-head-meta { font-size: 12px; color: var(--gray-400); font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase; }
      .lb-rows { display: grid; gap: 6px; }
      .lb-row { display: grid; grid-template-columns: 32px minmax(0, 1.4fr) minmax(0, 2fr) auto; gap: 12px; align-items: center; padding: 10px 12px; background: transparent; border: 0; border-radius: 10px; cursor: pointer; font-family: inherit; text-align: left; transition: background .15s; animation: lbGrow .55s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: var(--delay, 0ms); }
      .lb-row:hover { background: var(--gray-50); }
      .lb-rank { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 700; color: var(--gray-400); font-feature-settings: "tnum" 1; }
      .lb-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14px; color: var(--dark); line-height: 1.2; min-width: 0; overflow-wrap: anywhere; }
      .lb-track { position: relative; height: 10px; background: var(--gray-100); border-radius: 9999px; overflow: hidden; }
      .lb-bar { display: block; height: 100%; border-radius: 9999px; animation: lbBarGrow .7s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: calc(var(--delay, 0ms) + 80ms); }
      .lb-bar.lb-imp-high { background: linear-gradient(90deg, var(--red), #F87171); }
      .lb-bar.lb-imp-med  { background: linear-gradient(90deg, var(--amber), #F59E0B); }
      .lb-bar.lb-imp-low  { background: linear-gradient(90deg, var(--green-dark), #4ADE80); }
      @keyframes lbGrow { from { opacity: 0; transform: translateY(4px); } }
      @keyframes lbBarGrow { from { width: 0 !important; } }
      .lb-impact { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.2px; white-space: nowrap; }
      .lb-impact.lb-imp-high { background: var(--red-light); color: var(--red); }
      .lb-impact.lb-imp-med  { background: var(--amber-light); color: var(--amber); }
      .lb-impact.lb-imp-low  { background: var(--green-light); color: var(--green-dark); }
      .lb-legend { display: flex; gap: 16px; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--gray-100); justify-content: flex-end; flex-wrap: wrap; }
      .lb-legend-item { display: inline-flex; align-items: center; gap: 6px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--gray-400); }
      .lb-sw { width: 12px; height: 6px; border-radius: 3px; }
      .lb-sw.lb-imp-high { background: linear-gradient(90deg, var(--red), #F87171); }
      .lb-sw.lb-imp-med  { background: linear-gradient(90deg, var(--amber), #F59E0B); }
      .lb-sw.lb-imp-low  { background: linear-gradient(90deg, var(--green-dark), #4ADE80); }
      @media (max-width: 540px) {
        .lb-row { grid-template-columns: 28px 1fr auto; gap: 8px; }
        .lb-track { display: none; }
      }

      /* CATEGORY PICKER TILES — RHR style: large white pill cards in a 2 / 4-column grid */
      /* DEVICE PICKER — pick your wearable for the factor list */
      .device-picker { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
      .device-picker-label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase; color: var(--gray-400); }
      .device-select-wrap { position: relative; max-width: 360px; }
      .device-select { width: 100%; appearance: none; -webkit-appearance: none; -moz-appearance: none; padding: 14px 44px 14px 16px; min-height: 52px; background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15.5px; color: var(--dark); letter-spacing: -0.01em; cursor: pointer; transition: border-color .15s, box-shadow .15s; }
      .device-select:hover { border-color: var(--gray-300); }
      .device-select:focus-visible { outline: 0; border-color: var(--green); box-shadow: 0 0 0 3px rgba(34,197,94,0.18); }
      .device-select-chev { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--gray-400); pointer-events: none; display: inline-flex; align-items: center; justify-content: center; }
      .device-select-chev svg { width: 18px; height: 18px; }
      @media (min-width: 880px) {
        .device-picker { flex-direction: row; align-items: center; gap: 14px; }
        .device-select-wrap { max-width: 320px; }
      }

      .picker-tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-bottom: 16px; }
      .picker-tile { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 14px 16px; min-height: 56px; min-width: 0; background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; font-family: inherit; cursor: pointer; transition: border-color .15s, transform .15s, background .15s, box-shadow .15s; text-align: left; color: var(--dark); }
      .picker-tile:hover { border-color: var(--gray-300); transform: translateY(-1px); }
      .picker-tile.active { background: var(--dark); color: #fff; border-color: var(--dark); box-shadow: 0 6px 18px rgba(15,23,42,0.12); }
      .picker-tile-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14.5px; letter-spacing: -0.005em; line-height: 1.2; min-width: 0; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .picker-tile-count { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 12.5px; color: var(--gray-600); background: var(--gray-100); border-radius: 9999px; padding: 3px 9px; min-width: 28px; text-align: center; font-feature-settings: "tnum" 1; flex-shrink: 0; }
      .picker-tile.active .picker-tile-count { background: rgba(255,255,255,0.16); color: #fff; }
      .picker-tiles--metrics { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
      @media (min-width: 560px) { .picker-tiles { grid-template-columns: repeat(3, 1fr); } }
      @media (min-width: 880px) { .picker-tiles { grid-template-columns: repeat(5, 1fr); } }
      @media (min-width: 880px) { .picker-tiles--metrics { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); } }

      /* PICKER PANEL — white card holding the sort bar + factor list */
      .picker-panel { background: #fff; border: 1px solid var(--gray-200); border-radius: 18px; padding: 14px; box-shadow: 0 1px 0 rgba(15,23,42,0.03); min-width: 0; overflow: hidden; }
      .picker-panel-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--gray-100); }
      .picker-panel-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); margin: 0; letter-spacing: -0.01em; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
      .picker-panel-meta { font-size: 11.5px; font-weight: 600; color: var(--gray-400); letter-spacing: 0.5px; text-transform: uppercase; }
      @media (min-width: 768px) { .picker-panel { padding: 24px 26px; border-radius: 22px; } }

      /* SORT BAR — RHR style: count on left, label + pill row on right */
      .list-toolbar { display: flex; flex-direction: column; align-items: stretch; gap: 8px; margin-bottom: 12px; }
      .list-toolbar-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .list-sort-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.7px; color: var(--gray-400); font-weight: 600; }
      .list-result-count { font-size: 12px; font-weight: 500; color: var(--gray-600); font-feature-settings: "tnum" 1; }
      .list-result-count strong { color: var(--dark); font-weight: 700; }
      .list-sort-btns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
      .list-sort-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 38px; padding: 8px 10px; border-radius: 9999px; border: 1px solid var(--gray-200); background: #fff; color: var(--gray-600); font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .15s; }
      .list-sort-btn:hover { border-color: var(--gray-400); }
      .list-sort-btn.active { background: var(--dark); color: #fff; border-color: var(--dark); }
      @media (min-width: 680px) {
        .list-toolbar { flex-direction: row; align-items: center; justify-content: space-between; gap: 14px; }
        .list-toolbar-row { gap: 14px; }
        .list-sort-btns { display: flex; gap: 6px; flex-wrap: wrap; }
        .list-sort-btn { padding: 8px 14px; min-height: 36px; }
      }

      /* FACTOR CARDS — clean RHR pattern: eyebrow + name + sub + value pill + chevron */
      .fact-groups { display: grid; grid-template-columns: 1fr; gap: 18px; min-width: 0; }
      .fact-group { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
      .fact-group-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 0 2px 4px; border-bottom: 1px dashed var(--gray-200); }
      .fact-group-label { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13.5px; letter-spacing: -0.005em; }
      .fact-group-icon { width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; line-height: 1; flex-shrink: 0; }
      .fact-group--helps .fact-group-label { color: var(--green-dark); }
      .fact-group--helps .fact-group-icon { background: var(--green); color: #fff; }
      .fact-group--helps .fact-group-icon::after { content: '↓'; }
      .fact-group--hurts .fact-group-label { color: var(--red); }
      .fact-group--hurts .fact-group-icon { background: var(--red); color: #fff; }
      .fact-group--hurts .fact-group-icon::after { content: '↑'; }
      .fact-group-meta { font-size: 11px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; color: var(--gray-400); white-space: nowrap; }
      @media (min-width: 880px) { .fact-groups { grid-template-columns: 1fr 1fr; gap: 22px; } }
      .fact-list { display: grid; grid-template-columns: 1fr; gap: 8px; }
      .fact-card { background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; overflow: hidden; min-width: 0; transition: border-color .15s, box-shadow .15s; }
      .fact-card:hover { border-color: var(--gray-300); }
      .fact-card.expanded { box-shadow: 0 6px 18px rgba(15,23,42,0.06); border-color: var(--gray-300); }
      .fact-head { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 10px; width: 100%; padding: 12px 14px; background: transparent; border: 0; cursor: pointer; font-family: inherit; text-align: left; }
      .fact-head:hover { background: var(--gray-50); }
      .fact-meta { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .fact-cat { display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-size: 9.5px; font-weight: 700; letter-spacing: 0.9px; text-transform: uppercase; color: var(--gray-400); line-height: 1; margin-bottom: 4px; }
      .fact-dir { font-size: 11px; font-weight: 700; line-height: 1; }
      .fact-dir-pos { color: var(--green-dark); }
      .fact-dir-neg { color: var(--red); }
      .fact-dir-var { color: var(--amber); }
      .fact-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); line-height: 1.25; letter-spacing: -0.005em; overflow-wrap: anywhere; }
      .fact-effect { font-size: 12.5px; color: var(--gray-600); line-height: 1.4; margin-top: 2px; }
      .fact-effect.fact-dir-pos { color: var(--green-dark); }
      .fact-effect.fact-dir-neg { color: var(--red); }
      .fact-effect.fact-dir-var { color: var(--amber); }
      .fact-ev-inline { color: var(--gray-400); font-weight: 500; }
      .fact-lede { margin: 0 0 14px; font-size: 14px; line-height: 1.6; color: var(--dark); font-weight: 500; overflow-wrap: anywhere; }
      .fact-fields { display: grid; gap: 12px; margin: 0 0 4px; min-width: 0; }
      .fact-fields > div { display: grid; grid-template-columns: 1fr; gap: 3px; min-width: 0; }
      .fact-fields dt { font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); margin: 0; }
      .fact-fields dd { margin: 0; font-size: 13.5px; color: var(--gray-700); line-height: 1.55; overflow-wrap: anywhere; }
      @media (min-width: 768px) { .fact-fields { grid-template-columns: 1fr 1fr; gap: 14px 24px; } .fact-fields--full { grid-column: 1 / -1; } }
      .metric-tiles-label { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase; color: var(--gray-400); margin: 6px 0 8px; }
      /* Pills always sit on a neutral grey chip; only the label color shifts. */
      .fact-pill { font-family: 'Space Grotesk', sans-serif; font-size: 12.5px; font-weight: 700; padding: 5px 11px; border-radius: 9px; white-space: nowrap; min-width: 60px; text-align: center; letter-spacing: -0.005em; background: var(--gray-100); color: var(--gray-400); }
      @media (min-width: 480px) { .fact-pill { font-size: 14px; padding: 6px 14px; border-radius: 10px; min-width: 84px; } }
      .fact-pill.imp-med  { color: var(--dark); }
      .fact-pill.imp-low  { color: var(--gray-400); }
      .fact-group--helps .fact-pill.imp-high { color: var(--green-dark); }
      .fact-group--hurts .fact-pill.imp-high { color: var(--red); }
      .fact-chev { width: 18px; height: 18px; color: var(--gray-400); display: inline-flex; align-items: center; justify-content: center; transition: transform .2s; flex-shrink: 0; }
      .fact-chev svg { width: 16px; height: 16px; }
      .fact-card.expanded .fact-chev { transform: rotate(180deg); color: var(--green-dark); }
      @media (min-width: 768px) {
        .fact-list { gap: 10px; }
        .fact-card { border-radius: 16px; }
        .fact-head { padding: 16px 20px; gap: 8px 14px; }
        .fact-name { font-size: 16px; }
        .fact-effect { font-size: 13px; }
      }

      /* IMPACT BADGE & PILL */
      .impact-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 9px; border-radius: 9999px; font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: 0.2px; white-space: nowrap; }
      .impact-dot { width: 6px; height: 6px; border-radius: 50%; }
      .impact-badge.imp-high { background: var(--red-light); color: var(--red); }
      .impact-badge.imp-high .impact-dot { background: var(--red); }
      .impact-badge.imp-med { background: var(--amber-light); color: var(--amber); }
      .impact-badge.imp-med .impact-dot { background: var(--amber); }
      .impact-badge.imp-low { background: var(--green-light); color: var(--green-dark); }
      .impact-badge.imp-low .impact-dot { background: var(--green); }

      .impact-pill { display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px 7px 10px; border-radius: 12px; font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 700; white-space: nowrap; min-width: 130px; justify-content: flex-start; letter-spacing: -0.01em; }
      .impact-pill.imp-high { background: var(--red-light); color: var(--red); }
      .impact-pill.imp-med  { background: var(--amber-light); color: var(--amber); }
      .impact-pill.imp-low  { background: var(--green-light); color: var(--green-dark); }
      .impact-pill-bars { display: inline-flex; align-items: flex-end; gap: 2px; height: 14px; }
      .impact-pill-bars .bar { width: 3px; border-radius: 1px; background: currentColor; opacity: 0.25; }
      .impact-pill-bars .b1 { height: 5px; }
      .impact-pill-bars .b2 { height: 9px; }
      .impact-pill-bars .b3 { height: 13px; }
      .impact-pill.imp-low .b1 { opacity: 1; }
      .impact-pill.imp-med .b1, .impact-pill.imp-med .b2 { opacity: 1; }
      .impact-pill.imp-high .b1, .impact-pill.imp-high .b2, .impact-pill.imp-high .b3 { opacity: 1; }
      .impact-pill-text { font-feature-settings: "tnum" 1; }

      /* HURTS / HELPS BODY */
      .fact-body { padding: 6px 18px 18px; border-top: 1px dashed var(--gray-200); background: var(--gray-50); }
      .device-block { padding-top: 14px; }
      .device-block + .device-block { margin-top: 8px; padding-top: 14px; border-top: 1px dashed var(--gray-200); }
      .device-block-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
      .device-block-name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13.5px; color: var(--dark); padding-left: 10px; border-left: 3px solid var(--accent, var(--green)); letter-spacing: 0.1px; }
      .hh-grid { display: grid; gap: 10px; grid-template-columns: 1fr; }
      @media (min-width: 720px) { .hh-grid { grid-template-columns: 1fr 1fr; } }
      .hh-col { background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; padding: 16px 18px; transition: border-color .2s, box-shadow .2s; }
      .hh-col.hh-hurts { border-left: 4px solid var(--red); }
      .hh-col.hh-helps { border-left: 4px solid var(--green); }
      .hh-col.hh-hurts:hover { border-color: rgba(239,68,68,0.4); border-left-color: var(--red); }
      .hh-col.hh-helps:hover { border-color: rgba(34,197,94,0.4); border-left-color: var(--green); }
      .hh-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
      .hh-eyebrow { font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase; }
      .hh-hurts .hh-eyebrow { color: var(--red); }
      .hh-helps .hh-eyebrow { color: var(--green-dark); }
      .hh-magnitude { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; color: var(--red); background: var(--red-light); padding: 3px 9px; border-radius: 6px; }
      .hh-timeline { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; color: var(--green-dark); background: var(--green-light); padding: 3px 9px; border-radius: 6px; }
      .hh-body { margin: 0 0 10px; font-size: 13.5px; color: var(--gray-700); line-height: 1.55; }
      .hh-tag { display: inline-block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--gray-400); padding: 3px 8px; background: var(--gray-100); border-radius: 6px; }
      .hh-missing { padding: 16px; background: #fff; border: 1px dashed var(--gray-200); border-radius: 12px; font-size: 13px; color: var(--gray-600); text-align: center; line-height: 1.5; }

      .fact-source-row { margin-top: 16px; padding-top: 12px; border-top: 1px dashed var(--gray-200); display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
      .fact-source-lbl { font-size: 10px; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); font-weight: 700; }
      .source-link { display: inline-flex; align-items: center; gap: 4px; color: var(--green-dark); font-weight: 500; font-size: 13px; overflow-wrap: anywhere; min-width: 0; }
      .source-link svg { width: 12px; height: 12px; }
      .source-link:hover { color: var(--green); }

      /* CTA ROW — combined article + app CTA */
      /* APP CTA — centered card on white section, mirrors RHR */
      .app-cta-section { padding: 48px 0; background: #fff; }
      @media (min-width: 768px) { .app-cta-section { padding: 64px 0; } }
      .article-section { padding: 48px 0; background: #fff; }
      @media (min-width: 768px) { .article-section { padding: 64px 0; } }
      .app-cta { position: relative; background: linear-gradient(135deg, var(--dark-card) 0%, var(--gray-700) 100%); border-radius: var(--radius); padding: 32px 24px; text-align: center; max-width: 680px; margin: 0 auto; overflow: hidden; }
      .app-cta-glow { position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%); pointer-events: none; }
      .app-cta-content { position: relative; z-index: 1; }
      .app-cta-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,197,94,0.15); color: var(--green); padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
      .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulseDot 2s infinite; }
      @keyframes pulseDot { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }
      .app-cta h2 { color: #fff; font-size: clamp(22px, 5vw, 30px); margin: 0 0 12px; line-height: 1.2; letter-spacing: -0.01em; }
      .app-cta .highlight { color: var(--green); }
      .app-cta p { color: var(--gray-400); font-size: 14px; margin: 0 auto 20px; max-width: 480px; line-height: 1.55; }
      .app-cta-buttons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
      @media (max-width: 480px) { .app-cta-buttons { flex-direction: column; align-items: stretch; } .app-cta-buttons a { justify-content: center; text-align: center; } }
      .app-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; }
      .app-cta-btn:hover { background: var(--green-dark); }
      .app-cta-btn svg { width: 18px; height: 18px; }
      .app-cta-android { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; }
      .app-cta-android:hover { background: var(--green-dark); color: #fff; }
      .app-cta-android svg { width: 18px; height: 18px; }
      .app-cta-tags { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 20px; flex-wrap: nowrap; }
      .app-cta-tags-label { color: var(--gray-400); font-size: 11px; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
      .app-cta-tags-logos { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; overflow: hidden; }
      .app-cta-tags-logos img { height: 18px; width: auto; opacity: 0.75; flex-shrink: 1; min-width: 0; object-fit: contain; }
      @media (min-width: 480px) { .app-cta-tags-logos img { height: 20px; } .app-cta-tags-label { font-size: 12px; } }
      @media (min-width: 768px) { .app-cta-tags-logos { gap: 8px; } .app-cta-tags-logos img { height: 22px; } }

      /* TOP PICKS */
      .picks-card { position: relative; background: var(--dark-card); color: #fff; border-radius: 24px; padding: 36px 22px; overflow: hidden; }
      .picks-glow { position: absolute; top: 0; right: 0; width: 90%; max-width: 520px; aspect-ratio: 1 / 1; background: radial-gradient(ellipse at top right, rgba(34,197,94,0.22) 0%, rgba(34,197,94,0.08) 35%, transparent 70%); pointer-events: none; }
      .picks-head { position: relative; z-index: 1; margin-bottom: 24px; }
      .picks-eyebrow { display: block; font-size: 11px; letter-spacing: 0.6px; text-transform: uppercase; color: rgba(255,255,255,0.5); font-weight: 600; margin-bottom: 8px; }
      .picks-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; color: #fff; margin: 0; font-size: clamp(26px, 5.5vw, 40px); letter-spacing: -0.02em; line-height: 1.08; }
      .picks-title em { font-style: normal; color: var(--green); font-family: inherit; }
      .picks-grid { display: grid; grid-template-columns: 1fr; gap: 12px; position: relative; z-index: 1; }
      .pick-card { position: relative; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 22px 20px 20px; transition: transform .25s ease-out, background .25s ease-out, border-color .25s ease-out; }
      .pick-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(34,197,94,0.5); transform: translateY(-3px); }
      .pick-card.warn { border-color: rgba(239,68,68,0.35); }
      .pick-card.warn:hover { border-color: rgba(239,68,68,0.6); }
      .pick-card.myth { border-color: rgba(251,191,36,0.32); }
      .pick-card.myth:hover { border-color: rgba(251,191,36,0.55); }
      .pick-icon { position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 9px; background: rgba(34,197,94,0.15); color: var(--green); display: inline-flex; align-items: center; justify-content: center; }
      .pick-card.warn .pick-icon { background: rgba(239,68,68,0.18); color: #FCA5A5; }
      .pick-card.myth .pick-icon { background: rgba(251,191,36,0.16); color: #FCD34D; }
      .pick-icon svg { width: 18px; height: 18px; }
      .pick-label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: rgba(255,255,255,0.42); font-weight: 600; max-width: calc(100% - 44px); }
      .pick-stat { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 28px; color: var(--green); margin: 8px 0 6px; letter-spacing: -0.02em; line-height: 1; }
      .pick-card.warn .pick-stat { color: #FCA5A5; }
      .pick-card.myth .pick-stat { color: #FCD34D; }
      .pick-answer { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 17px; color: #fff; line-height: 1.2; margin: 0; }
      .pick-note { margin: 10px 0 0; font-size: 13px; color: rgba(255,255,255,0.62); line-height: 1.5; }
      @media (min-width: 768px) { .picks-card { padding: 48px 36px; border-radius: 28px; } .picks-grid { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 1024px) { .picks-grid { grid-template-columns: 1fr 1fr 1fr; } }

      /* CALLOUT */
      .callout-card { display: flex; gap: 16px; align-items: flex-start; background: var(--dark-card); color: #fff; padding: 26px 24px; border-radius: 18px; max-width: 880px; margin: 0 auto; }
      .callout-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(34,197,94,0.18); color: var(--green); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .callout-icon svg { width: 20px; height: 20px; }
      .callout-body h3 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 19px; margin-bottom: 8px; letter-spacing: -0.01em; }
      .callout-body p { font-size: 14px; color: rgba(255,255,255,0.78); line-height: 1.6; margin: 0; }
      .callout-body em { color: var(--green); font-style: normal; font-weight: 600; }

      /* SOURCES */
      .src-accordion { max-width: 780px; margin: 0 auto; }
      .src-count-badge { text-align: center; font-size: 13px; font-weight: 600; color: var(--gray-400); margin-bottom: 16px; }
      .src-group { border: 1px solid var(--gray-200); border-radius: var(--radius-sm); margin-bottom: 8px; overflow: hidden; background: #fff; }
      .src-group-toggle { display: flex; align-items: center; width: 100%; padding: 12px 16px; background: none; border: none; cursor: pointer; font-family: inherit; gap: 8px; }
      .src-group-name { flex: 1; text-align: left; font-size: 14px; font-weight: 600; color: var(--dark); }
      .src-group-count { font-size: 11px; font-weight: 600; color: var(--gray-400); background: var(--gray-100); padding: 2px 8px; border-radius: 50px; }
      .src-group-chevron { width: 18px; height: 18px; color: var(--gray-400); transition: transform 0.3s; display: flex; }
      .src-group-chevron svg { width: 18px; height: 18px; }
      .src-group.open .src-group-chevron { transform: rotate(180deg); }
      .src-group-body { max-height: 0; overflow: hidden; transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1); }
      .src-group.open .src-group-body { max-height: 800px; }
      .src-item { display: flex; align-items: center; gap: 8px; padding: 8px 16px; text-decoration: none; color: var(--gray-600); font-size: 13px; transition: background 0.2s; }
      .src-item:last-child { padding-bottom: 12px; }
      .src-item:hover { background: var(--gray-50); }
      .src-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
      .src-text { flex: 1; }
      .src-ext { width: 14px; height: 14px; color: var(--gray-400); flex-shrink: 0; }
      .src-ext svg { width: 14px; height: 14px; }

      /* FOOTER */
      .tool-footer { padding: 48px 0 32px; text-align: center; border-top: 1px solid var(--gray-200); }
      .footer-brand { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); text-decoration: none; margin-bottom: 8px; }
      .footer-logo { height: 24px; width: auto; }
      .footer-tagline { font-size: 13px; color: var(--gray-400); margin-bottom: 16px; }
      .footer-disclaimer { font-size: 11px; color: var(--gray-400); line-height: 1.5; max-width: 560px; margin: 0 auto 12px; }
      .footer-copyright { font-size: 12px; color: var(--gray-400); margin-bottom: 4px; }

      .dash-empty { padding: 24px 18px; text-align: center; color: var(--gray-400); font-size: 14px; background: #fff; border: 1px dashed var(--gray-200); border-radius: 16px; }

      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .pulse-dot, .hero-dot { animation: none; }
        .lb-row, .lb-bar, .pick-card, .fact-card, .device-card { animation: none; transition: none; }
      }
    `;
  }
}

if (!customElements.get('kygo-wearable-stress')) {
  customElements.define('kygo-wearable-stress', KygoWearableStress);
}
