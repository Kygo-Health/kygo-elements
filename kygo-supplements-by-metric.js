/**
 * Kygo Health — Supplements by Metric Explorer
 * Tag: kygo-supplements-by-metric
 * Pick the wearable metric you care about — sleep latency, deep sleep, staying
 * asleep, HRV, resting heart rate, or recovery/readiness — and see which
 * supplements the research actually supports, graded by evidence strength, with
 * the funding flags and the popular stuff that doesn't work. Plus an
 * at-a-glance supplement × metric master matrix and the honest myth-busts.
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

class KygoSupplementsByMetric extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._metricFilter = 'hrv';
    this._supExpandedKey = null;
    this._eventsBound = false;
  }

  connectedCallback() {
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
    this._injectStructuredData();
    __seo(this, 'Supplements by Metric Explorer by Kygo Health. The metrics your wearable tracks — sleep latency (falling asleep faster), deep sleep (N3 / slow-wave), staying asleep (lower WASO), HRV (higher RMSSD / HF power), resting heart rate (lower RHR), and recovery/readiness scores — mapped to what 27 supplements actually do to them, graded by evidence (Strong / Moderate / Weak / tested-no-effect) with industry-funding flags. What is genuinely backed: omega-3 (RHR −2.23 bpm and HRV, Hidayat 2018 + PMC5882295), ashwagandha (sleep latency, WASO and HRV, Cheah 2021 + Witholytin 2023, industry-funded), glycine 3g (latency, deep sleep, WASO, Yamadera 2007), magnesium (latency −17 min, Mah & Pitre 2021), saffron (sleep quality PSQI −2.14), tart cherry (WASO, recovery), L-theanine (acute-stress HRV), melatonin (latency −7 min). The honest myth-busts: the magnesium "27 RCTs / 2,496 people" figure is really 3 small trials (n=151); standard melatonin does nothing for staying asleep (Moon 2022); CBD shows no meaningful recovery change on WHOOP; apigenin has zero human sleep RCTs (use whole chamomile extract); passionflower evidence was subjective and industry-funded; L-theanine HRV is acute-stress only, not a resting gain. Nearly every supplement-specific RCT here is industry-funded — flagged openly. Effect sizes are small relative to night-to-night wearable noise and most were measured on Oura, so treat as "research shows X affects this metric," never "take X to fix your number." Not medical advice.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  /* ---------------------------------------------------------------- DATA */

  get _metrics() {
    // `tool` deep-links each metric to its sibling factor explorer on kygo.app
    // (URLs verified against docs/site-url-index.md so internal links never 404).
    const T = 'https://www.kygo.app/tools/';
    return [
      { key: 'latency',  label: 'Sleep Latency',        short: 'Latency',  icon: 'moon',     benefit: 'Benefit = you fall asleep faster (shorter sleep onset).', tool: T + 'sleep-latency-factors',      toolName: 'Sleep Latency Factors' },
      { key: 'deep',     label: 'Deep Sleep',           short: 'Deep',     icon: 'moon',     benefit: 'Benefit = more N3 / slow-wave sleep or delta power.',     tool: T + 'deep-sleep-factors',         toolName: 'Deep Sleep Factor Explorer' },
      { key: 'waso',     label: 'Staying Asleep',       short: 'WASO',     icon: 'moon',     benefit: 'Benefit = less wake after sleep onset (lower WASO).',     tool: T + 'staying-asleep-factors',     toolName: 'Staying Asleep Factors' },
      { key: 'hrv',      label: 'HRV',                  short: 'HRV',      icon: 'activity', benefit: 'Benefit = higher HRV (RMSSD / HF power).',                tool: T + 'hrv-factors',                toolName: 'HRV Factor Explorer' },
      { key: 'rhr',      label: 'Resting HR',           short: 'RHR',      icon: 'heart',    benefit: 'Benefit = lower resting heart rate.',                     tool: T + 'resting-heart-rate-factors', toolName: 'Resting Heart Rate Factors' },
      { key: 'recovery', label: 'Recovery / Readiness', tileLabel: 'Recovery', short: 'Recovery', icon: 'shield',   benefit: 'Benefit = higher wearable recovery/readiness score (driven by HRV + RHR + sleep vs your baseline).', tool: T + 'recovery-score-explorer', toolName: 'Recovery Score Explorer' }
    ];
  }

  _readMore(url, label) {
    return `<a class="section-readmore" href="${url}" target="_blank" rel="noopener">${label} <span aria-hidden="true">${this._icon('arrowRight')}</span></a>`;
  }

  get _src() {
    return {
      omega3hrv:    { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5882295/', label: 'Omega-3 & HRV: meta-analysis (PMC5882295)' },
      omega3rhr:    { url: 'https://www.nature.com/articles/s41430-017-0052-3', label: 'Omega-3 & resting heart rate: 51-RCT meta-analysis (Hidayat 2018)' },
      mag:          { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8053283/', label: 'Magnesium for insomnia: systematic review & meta-analysis (Mah & Pitre 2021)' },
      mgt:          { url: 'https://www.tandfonline.com/doi/full/10.2147/NSS.S524348', label: 'Magnesium (L-threonate) HRV/RHR: Oura RCT (Lopresti 2025)' },
      glycine:      { url: 'https://onlinelibrary.wiley.com/doi/10.1111/j.1479-8425.2007.00262.x', label: 'Glycine improves sleep quality: PSG evidence (Yamadera 2007)' },
      cheah:        { url: 'https://pubmed.ncbi.nlm.nih.gov/34559859/', label: 'Ashwagandha & sleep: systematic review & meta-analysis (Cheah 2021)' },
      ashhrv:       { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10647917/', label: 'Ashwagandha (Witholytin) & HRV / cortisol: RCT, n=111 (2023)' },
      mela:         { url: 'https://pubmed.ncbi.nlm.nih.gov/23691095/', label: 'Melatonin for primary sleep disorders: meta-analysis (Ferracioli-Oda 2013)' },
      melacv:       { url: 'https://www.nature.com/articles/s44323-024-00007-z', label: 'Melatonin in the cardiovascular system: dose-dependent effects (npj Biol Timing & Sleep 2024)' },
      gaba:         { url: 'https://www.mdpi.com/2304-8158/14/22/3856', label: 'GABA mechanism in improving sleep: review (MDPI Foods 2025)' },
      theanine:     { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6836118/', label: 'L-theanine reduces stress responses & improves sleep: RCT' },
      tart:         { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12438961/', label: 'Montmorency tart cherry & sleep: systematic review' },
      pigeon:       { url: 'https://pubmed.ncbi.nlm.nih.gov/21075238/', label: 'Tart cherry juice & insomnia (Pigeon 2010, RCT crossover)' },
      saffron:      { url: 'https://pubmed.ncbi.nlm.nih.gov/35325766/', label: 'Saffron & sleep quality: meta-analysis (Sleep Medicine 2022)' },
      chamomile:    { url: 'https://onlinelibrary.wiley.com/doi/10.1002/ptr.6349', label: 'Chamomile for sleep & anxiety: systematic review & meta-analysis (Phytotherapy Research)' },
      nitrate:      { url: 'https://journals.physiology.org/doi/full/10.1152/ajpheart.00163.2017', label: 'Beetroot nitrate decreases central sympathetic outflow: RCT (Notay 2017)' },
      valerian:     { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4394901/', label: 'Valerian for sleep: systematic review & meta-analysis' },
      micronutrient:{ url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7231600/', label: 'Micronutrients & HRV: review (Advances in Nutrition 2022)' },
      apigenin:     { url: 'https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2024.1359176/full', label: 'Apigenin at the sleep/aging intersection — notes NO human sleep RCT (Frontiers 2024)' }
    };
  }

  // direction is always "helps the metric" here, so we encode benefit strength
  // as the evidence grade. g: 'S' strong, 'M' moderate, 'W' weak, '~' mixed,
  // 'X' tested-no-effect. flag = industry-funded / not-peer-reviewed / preclinical.
  get _supplements() {
    return [
      { key: 'omega3', name: 'Omega-3 (EPA/DHA)', amazon: { url: 'https://amzn.to/4cVnvGt', label: 'Omega-3 Fish Oil' }, m: {
        deep:     { g: 'W', effect: 'Improves sleep efficiency (+1.88 pp pooled); no isolated deep-sleep (N3) gain.', study: 'DHA/EPA RCT (n=84, 26 wks) + meta-analysis (PMC11579846).' },
        hrv:      { g: 'S', effect: 'Consistently raises HF power — the most-studied dietary HRV factor.', study: 'Multiple meta-analyses.', src: 'omega3hrv' },
        rhr:      { g: 'S', effect: 'Lowers resting HR ~2.23 bpm overall; DHA alone −2.47 bpm, EPA no effect. The only Strong RHR supplement.', study: 'Hidayat 2018 meta, 51 RCTs, ~3,000 people.', src: 'omega3rhr' },
        recovery: { g: 'M', effect: 'Lowers RHR ~2.2 bpm (DHA, not EPA), which feeds the recovery score; HRV evidence mixed.', study: 'Hidayat 2018 meta, 51 RCTs.', src: 'omega3rhr' }
      } },
      { key: 'magnesium', name: 'Magnesium (oral)', amazon: { url: 'https://amzn.to/3Nbjq6C', label: 'Magnesium Glycinate' }, m: {
        latency:  { g: 'M', effect: 'Sleep onset ~17 min faster (−17.36 min, p=0.0006).', study: 'Mah & Pitre 2021 meta, 3 RCTs, n=151 older adults — low-quality-evidence caveat.', src: 'mag' },
        deep:     { g: 'W', effect: 'Slow-wave sleep ~+6 min; raises delta + sigma power — in older adults.', study: 'Held 2002, n=12, ages 60–80, 20-day crossover.' },
        waso:     { g: 'W', effect: 'Improves sleep efficiency in the elderly; WASO not directly measured.', study: 'Abbasi 2012 RCT, n=46, age 65+.' },
        hrv:      { g: '~', effect: 'One small RCT showed an increase (n=36); results vary by form — hype is ahead of the data.', study: 'Micronutrient review (PMC7231600).', src: 'micronutrient' },
        rhr:      { g: 'X', effect: 'No magnesium-specific RHR meta-analysis exists; no reliable resting-rate effect.', study: 'No RHR meta located.' },
        recovery: { g: 'W', effect: 'Faster onset plus a small readiness / deep-sleep gain on Oura.', study: 'Mah & Pitre 2021 (n=151) + Breus 2024 Oura (n=31).', src: 'mag' }
      } },
      { key: 'mag-threonate', name: 'Magnesium L-threonate', flag: true, amazon: { url: 'https://www.amazon.com/dp/B01M4GM9R1?linkCode=tr1&tag=kygohealthapp-20&linkId=amzn1.campaign.1T536CG5MXACL_1781448054715', label: 'Magnesium L-Threonate' }, m: {
        deep:     { g: 'M', flag: true, effect: 'Raises deep sleep, REM and readiness on Oura.', study: 'Hausenblas 2024 (n=80) + Breus 2024 (n=31).', flagNote: 'All manufacturer-funded; Lopresti 2025 found NO sleep effect.' },
        hrv:      { g: 'M', flag: true, effect: 'RMSSD +1.45 ms, RHR −1.32 bpm (p=0.036 / 0.030) on Oura.', study: 'Lopresti 2025, Oura, n=100.', src: 'mgt', flagNote: 'Manufacturer-funded; sleep was null in this same trial.' },
        recovery: { g: 'M', flag: true, effect: 'Better deep sleep, REM and readiness scores.', study: 'Hausenblas 2024 + Breus 2024.', flagNote: 'All manufacturer-funded.' }
      } },
      { key: 'glycine', name: 'Glycine (3 g)', amazon: { url: 'https://amzn.to/3PWfatc', label: 'Glycine Powder' }, m: {
        latency:  { g: 'M', effect: 'Shortened sleep onset and slow-wave-sleep latency (p=0.01).', study: 'Yamadera 2007, PSG, n=11.', src: 'glycine' },
        deep:     { g: 'M', effect: 'Faster slow-wave-sleep onset; stage proportions unchanged.', study: 'Yamadera 2007, PSG, n=11.', src: 'glycine' },
        waso:     { g: 'M', effect: 'Reduced night-time waking alongside faster SWS onset.', study: 'Yamadera 2007, PSG, n=11.', src: 'glycine' },
        recovery: { g: 'M', effect: 'Faster onset, better sleep quality; lowers core temperature ~0.28°C.', study: 'Yamadera 2007 + Inagawa 2006.', src: 'glycine' }
      } },
      { key: 'ashwagandha', name: 'Ashwagandha', flag: true, amazon: { url: 'https://amzn.to/403ZgOP', label: 'Ashwagandha Extract' }, m: {
        latency:  { g: 'S', flag: true, effect: 'Sleep onset SMD −0.53 (p<0.001); 600 mg most effective.', study: 'Cheah 2021 meta, 5 RCTs, n=400.', src: 'cheah', flagNote: 'Underlying RCTs industry-funded.' },
        deep:     { g: 'W', flag: true, effect: 'Raises delta power + GABA-A expression — in vitro / animal only.', study: 'Prev Nutr Food Sci 2022 (PMC9007714).', flagNote: 'Preclinical, not human PSG.' },
        waso:     { g: 'S', flag: true, effect: 'WASO SMD −0.39 (3 trials, n=281).', study: 'Cheah 2021 meta.', src: 'cheah', flagNote: 'Underlying RCTs industry-funded.' },
        hrv:      { g: 'S', flag: true, effect: 'RMSSD rose vs a decline in placebo (time×group p=0.003).', study: 'Smith/Lopresti 2023 (Witholytin) RCT, n=111, 12 wks.', src: 'ashhrv', flagNote: 'Single proprietary-extract RCT in overweight adults.' },
        rhr:      { g: 'X', effect: 'There is an HRV effect, but no resting-heart-rate change.', study: 'Cheah / Witholytin trials (HRV side, not RHR).' },
        recovery: { g: 'M', flag: true, effect: 'Lowers cortisol & anxiety, improves sleep; some HRV gain.', study: 'Witholytin RCT (n=111) + cortisol RCTs.', src: 'ashhrv', flagNote: 'Proprietary-extract trials; HRV evidence thinner than cortisol.' }
      } },
      { key: 'melatonin', name: 'Melatonin', amazon: { url: 'https://amzn.to/4szGon9', label: 'Melatonin Supplement' }, m: {
        latency:  { g: 'S', effect: 'Sleep onset −7.06 min (p<0.001); peaks around 4 mg.', study: 'Ferracioli-Oda 2013 meta, 19 studies, n=1,683.', src: 'mela' },
        deep:     { g: 'M', effect: 'MT2 activation in the reticular thalamus raises NREM + delta power.', study: 'Comai 2024, J Pineal Research (mechanism).' },
        waso:     { g: 'X', effect: 'No significant effect on wake after sleep onset — the most-bought form does NOT aid maintenance.', study: 'Moon 2022 meta, Neuropsychopharmacology 47:1523-1536.' },
        rhr:      { g: '~', effect: 'Mixed: some lower nocturnal HR; one CAD trial raised 24-h HR. Emerging heart-failure safety signal.', study: 'Tobeiha 2022 review.' },
        recovery: { g: 'W', effect: 'A timing aid, not a recovery booster: 2 mg modestly raises HRV / lowers overnight HR, peaks ~day 3–5 then fades.', study: 'npj Biological Timing & Sleep 2024.', src: 'melacv' }
      } },
      { key: 'gaba', name: 'GABA', flag: true, amazon: { url: 'https://amzn.to/3OyDz7c', label: 'GABA Supplement' }, m: {
        latency:  { g: 'M', effect: 'Sleep onset 13.4 → 5.7 min (p=0.001).', study: 'Byun 2018, PSG, n=40.', src: 'gaba' },
        hrv:      { g: 'M', flag: true, effect: 'Raises HRV via parasympathetic predominance.', study: 'Guimarães 2024 RCT, n=30, 200 mg / 90 d.', flagNote: 'All-female sample + exercise co-intervention.' },
        recovery: { g: 'X', effect: 'Poor oral absorption — no reliable recovery-score effect.', study: 'Per recovery-factor review.' }
      } },
      { key: 'l-theanine', name: 'L-Theanine', amazon: { url: 'https://amzn.to/3OEoHEh', label: 'L-Theanine 200mg' }, m: {
        latency:  { g: 'M', effect: 'Subjective sleep onset SMD 0.15 (p=0.04); no objective effect.', study: 'Bulman 2025 meta, 10 RCTs, n=897 — subjective only.' },
        deep:     { g: 'W', effect: 'Raises delta and reverses caffeine’s delta suppression — animal ECoG model.', study: 'Frontiers Nutr 2022 (PMC9017334) — preclinical.' },
        waso:     { g: '~', effect: 'Mixed WASO results when used alone.', study: 'Systematic review 2025.' },
        hrv:      { g: 'M', effect: 'Attenuates sympathetic activation during acute stress.', study: 'Kimura 2007 (PubMed 16930802).', src: 'theanine' },
        rhr:      { g: 'X', effect: 'Acute-stress effect only — not a baseline resting-rate change.', study: 'Kimura 2007 (acute stress, not resting).' },
        recovery: { g: 'M', effect: 'Lowers HR + cortisol under acute stress; improves sleep.', study: 'Kimura 2007.', src: 'theanine' }
      } },
      { key: 'tart-cherry', name: 'Tart Cherry (Montmorency)', amazon: { url: 'https://amzn.to/3PXqKEh', label: 'Tart Cherry Juice' }, m: {
        latency:  { g: 'X', effect: 'No sleep-onset benefit.', study: 'Stretton 2023 meta, p>0.05.' },
        deep:     { g: 'W', effect: '+84 min total sleep time on PSG (p=0.0182).', study: 'Losso 2018, n=8 insomnia.', src: 'tart' },
        waso:     { g: 'M', effect: 'Cuts WASO ~17 min vs placebo.', study: 'Pigeon 2010, RCT crossover, n=15 insomnia.', src: 'pigeon' },
        recovery: { g: 'M', effect: '+34 to 84 min sleep, raises melatonin, eases muscle soreness — double-duty training aid.', study: 'Losso 2018 (n=8) + Pigeon 2010 (n=15).', src: 'tart' }
      } },
      { key: 'saffron', name: 'Saffron', amazon: { url: 'https://www.amazon.com/dp/B097TKQSQD?tag=kygohealthapp-20', label: 'Saffron Extract' }, m: {
        recovery: { g: 'M', effect: 'Sleep quality PSQI −2.14 (95% CI −2.86 to −1.42, p<0.01).', study: 'Sleep Medicine 2022 meta (PubMed 35325766).', src: 'saffron' }
      } },
      { key: 'chamomile', name: 'Chamomile (whole extract)', amazon: { url: 'https://amzn.to/3S5tosv', label: 'Chamomile Extract' }, m: {
        recovery: { g: 'W', effect: 'Improves sleep quality + GAD; NO effect on insomnia (ISI). Use whole extract, not isolated apigenin.', study: 'Phytotherapy Research meta (ptr.6349, 12 RCTs).', src: 'chamomile' }
      } },
      { key: 'nitrate', name: 'Dietary nitrate / beetroot', amazon: { url: 'https://amzn.to/406okEX', label: 'Beetroot Juice Shots' }, m: {
        hrv:      { g: '~', effect: 'Raises SDNN acutely; lowers sympathetic outflow.', study: 'Notay 2017 + SDNN RCTs.', src: 'nitrate' },
        rhr:      { g: 'X', effect: 'No resting-rate change — the effect is autonomic/HRV-side, not a resting-rate drop.', study: '6 RCTs, n=181, null for RHR.' },
        recovery: { g: '~', effect: 'Raises SDNN, lowers sympathetic outflow + BP — acute and population-dependent.', study: 'Notay 2017 (Am J Physiol).', src: 'nitrate' }
      } },
      { key: 'passionflower', name: 'Passionflower', flag: true, m: {
        deep:     { g: 'W', flag: true, effect: 'Raises self-reported total sleep time; no PSG, N3 never measured.', study: 'Harit 2024, Cureus, n=65, 30-day.', flagNote: 'Subjective + industry-funded (JK Botanicals).' }
      } },
      { key: 'valerian', name: 'Valerian', m: {
        latency:  { g: 'X', effect: 'Pooled sleep-onset difference 0.70 min (NS).', study: 'Shinjyo 2020 meta, 60 studies.', src: 'valerian' },
        waso:     { g: 'X', effect: 'No consistent objective WASO benefit (subjective only; raised WASO in older women).', study: 'Shinjyo 2020 meta, n=6,894.', src: 'valerian' },
        recovery: { g: 'X', effect: 'Subjective improvement only — objective measures unconvincing.', study: 'Shinjyo 2020 meta.', src: 'valerian' }
      } },
      { key: 'tryptophan', name: 'Tryptophan (≥1 g)', m: {
        latency:  { g: 'W', effect: 'Shortens sleep onset in older trials.', study: 'Hartmann 1979 + Sutanto 2021.' }
      } },
      { key: '5htp', name: '5-HTP', m: {
        latency:  { g: 'W', effect: 'Possible faster onset — only tiny RCTs.', study: 'Small pilot RCTs.' }
      } },
      { key: 'cbd', name: 'CBD', flag: true, m: {
        latency:  { g: 'X', effect: 'CBD isolate 150 mg: no effect on sleep onset.', study: 'Narayan 2024, null.' },
        waso:     { g: '~', effect: 'Inconsistent effect on staying asleep.', study: 'Mixed small trials.' },
        recovery: { g: 'X', flag: true, effect: 'WHOOP data: no meaningful recovery change.', study: 'WHOOP cohort analysis.' }
      } },
      { key: 'vitamin-d', name: 'Vitamin D', amazon: { url: 'https://amzn.to/4cm6d5m', label: 'Vitamin D3' }, m: {
        deep:     { g: 'X', effect: 'Supplementation gives no clear deep-sleep (N3) gain; subjective PSQI only.', study: 'Mason 2021 null RCT (n=189); Abboud 2022 meta.' },
        hrv:      { g: 'M', effect: 'Deficiency is associated with lower HRV (a deficiency-correction effect, not a booster).', study: 'Micronutrient review (PMC7231600).', src: 'micronutrient' },
        rhr:      { g: 'X', effect: 'No heart-rate effect at any dose.', study: 'BEST-D RCT, n=305, 12 mo.' }
      } },
      { key: 'vitamin-b12', name: 'Vitamin B12', amazon: { url: 'https://amzn.to/4lbwIg3', label: 'Vitamin B12' }, m: {
        hrv:      { g: 'M', effect: 'Deficiency reduces LF power (correction effect in deficiency).', study: 'Micronutrient review (PMC7231600).', src: 'micronutrient' }
      } },
      { key: 'zinc', name: 'Zinc', amazon: { url: 'https://amzn.to/4760BIN', label: 'Zinc Picolinate' }, m: {
        hrv:      { g: 'W', effect: 'Prenatal zinc linked to better offspring HRV; adult data limited.', study: 'Micronutrient review (PMC7231600).', src: 'micronutrient' }
      } },
      { key: 'multivitamin', name: 'Multivitamin', amazon: { url: 'https://amzn.to/4rM2eDY', label: 'Daily Multivitamin' }, m: {
        hrv:      { g: 'M', effect: 'One RCT prevented HRV decline — a buffer, not a booster.', study: 'Micronutrient review (PMC7231600).', src: 'micronutrient' }
      } },
      { key: 'potassium', name: 'Potassium', m: {
        rhr:      { g: 'X', effect: '+0.2 bpm (95% CI −0.4, 0.8), NS.', study: 'Gijsbers 2016 meta, 22 RCTs, n=1,086.' }
      } },
      { key: 'l-arginine', name: 'L-Arginine', m: {
        rhr:      { g: 'X', effect: 'No consistent resting-rate change.', study: 'Rector 1996 + multiple RCTs.' }
      } },
      { key: 'chromium', name: 'Chromium', flag: true, m: {
        rhr:      { g: 'W', flag: true, effect: 'RHR reduced — but only in metabolic-syndrome / IGT patients.', study: 'Single RCT (PubMed 28856601).', flagNote: 'Specific population only.' }
      } },
      { key: 'oat-bran', name: 'Oat bran fiber', m: {
        rhr:      { g: 'W', effect: '24-h heart-rate reduction vs DASH control — hypertensive patients only.', study: 'Single RCT, n=70, 3 mo (PMC9370281).' }
      } },
      { key: 'creatine', name: 'Creatine', flag: true, m: {
        recovery: { g: 'X', flag: true, effect: 'A cognitive buffer when underslept — not an HRV / recovery aid.', study: 'Recovery review; Oura n=21 sleep-duration only.', flagNote: 'Small / female-only sleep data.' }
      } },
      { key: 'peptisleep', name: 'PeptiSleep', flag: true, m: {
        latency:  { g: 'W', flag: true, effect: 'Claimed faster onset — manufacturer data only.', study: 'Nuritas NCT06267586.', flagNote: 'Not peer-reviewed.' },
        deep:     { g: 'W', flag: true, effect: 'Claimed deep-sleep gain — manufacturer data only.', study: 'Nuritas NCT06267586.', flagNote: 'Not peer-reviewed.' },
        hrv:      { g: 'W', flag: true, effect: '+32% HRV claim (Oura).', study: 'Nuritas NCT06267586.', flagNote: 'Not peer-reviewed; conflicting 32% vs 350% claims.' }
      } }
    ];
  }

  _gradeMeta(g) {
    return ({
      S:   { full: 'Strong',    short: 'S',  cls: 'g-s',   w: 4 },
      M:   { full: 'Moderate',  short: 'M',  cls: 'g-m',   w: 3 },
      W:   { full: 'Weak',      short: 'W',  cls: 'g-w',   w: 2 },
      '~': { full: 'Mixed',     short: '~',  cls: 'g-mix', w: 1 },
      X:   { full: 'No effect', short: '✗',  cls: 'g-x',   w: 0 }
    })[g] || { full: '—', short: '—', cls: 'g-none', w: -1 };
  }

  _suppScore(s) {
    return Object.values(s.m).reduce((t, c) => t + Math.max(0, this._gradeMeta(c.g).w), 0);
  }

  _faqs() {
    return [
      { q: 'Which supplements are actually backed for wearable metrics?', a: 'The defensible ones, by evidence: omega-3 (resting heart rate −2.23 bpm and HRV), ashwagandha (sleep latency, staying asleep and HRV — though the trials are industry-funded), glycine 3 g (latency, deep sleep and staying asleep), magnesium (latency ~17 min faster), saffron (sleep quality, PSQI −2.14), and tart cherry (less waking, recovery). L-theanine helps HRV under acute stress, and melatonin speeds sleep onset by about 7 minutes. Everything else is weaker, mixed, or tested-with-no-effect. Doses cited are study doses, not recommendations, and this is not medical advice.' },
      { q: 'What is the biggest supplement myth here?', a: 'The magnesium "27 RCTs / 2,496 people" figure that circulates on blogs. The actual meta-analysis (Mah & Pitre 2021) is just 3 small trials totalling 151 older adults, rated low-quality evidence. Magnesium does help sleep onset modestly — but nowhere near as strongly as the marketing number implies.' },
      { q: 'Does melatonin help you stay asleep?', a: 'No. Standard immediate-release melatonin — the most-bought form — shows no significant effect on wake after sleep onset (WASO) in meta-analysis (Moon 2022). Melatonin is a circadian timing aid that helps you fall asleep faster (about 7 minutes), not a sleep-maintenance aid. For staying asleep, the better-supported options are ashwagandha, tart cherry and glycine.' },
      { q: 'What actually lowers resting heart rate (RHR)?', a: 'Omega-3 is the only supplement with strong RHR evidence: roughly −2.23 bpm overall, and −2.47 bpm for DHA specifically (EPA alone does nothing), across a 51-RCT meta-analysis. Potassium, vitamin D, L-arginine and dietary nitrate all came out null for resting heart rate. Chromium and oat-bran fiber only helped in specific patient groups.' },
      { q: 'What raises HRV?', a: 'Omega-3 (raises HF power — the most-studied dietary HRV factor) and ashwagandha (RMSSD rose vs a placebo decline, though it is a single proprietary-extract trial). GABA and magnesium L-threonate have moderate but industry-funded evidence. L-theanine helps during acute stress but is not a resting-HRV gain, and the magnesium-for-HRV story is hype ahead of the data.' },
      { q: 'Can I trust these supplement studies — who funds them?', a: 'Be skeptical. Nearly every supplement-specific RCT in this data is industry-funded, including every magnesium L-threonate, ashwagandha and PeptiSleep trial — they are flagged with a funding marker throughout. Industry funding does not automatically make a result wrong, but independent replication is the single biggest evidence gap across the whole category. Saying so openly is the point.' },
      { q: 'Will a supplement noticeably change the number on my ring or watch?', a: 'Maybe not visibly. Many of these effect sizes — RHR −2.2 bpm, HRV +1.45 ms — are small relative to a wearable\'s night-to-night noise, and most were measured on Oura specifically. Read every claim as "research shows X affects this metric," never "take X to fix your number." Pair any change with the device-detectability caveat and check our wearable-accuracy tools.' },
      { q: 'What about saffron and chamomile for recovery?', a: 'Saffron is surprisingly solid for a botanical — a meaningful sleep-quality improvement (PSQI −2.14) across a large meta-analysis. Whole-extract chamomile improves sleep quality and anxiety but does NOT fix clinical insomnia, and the trendy isolated apigenin version has zero human sleep RCTs — so use whole extract if you use it at all.' }
    ];
  }

  get _posts() {
    const base = 'https://www.kygo.app/post/';
    return {
      backed: base + 'supplements-for-wearable-metrics-what-works-what-s-hype'
    };
  }

  /* ------------------------------------------------------------- ICONS */

  _icon(name) {
    const icons = {
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
      sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 13.7 8.3 19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7Z"/><path d="M19 17v4"/><path d="M17 19h4"/></svg>',
      alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
      pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>',
      flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.58 16.5h12.85"/></svg>',
      cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
      target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
      ban: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>'
    };
    return icons[name] || icons.pill;
  }

  /* ------------------------------------------------------------- EXPLORER */

  _cellsForMetric(mKey) {
    return this._supplements
      .filter(s => s.m[mKey])
      .map(s => ({ s, c: s.m[mKey] }));
  }

  _renderMetricTiles() {
    const tiles = this._metrics.map(mt => {
      const count = this._cellsForMetric(mt.key).length;
      const active = this._metricFilter === mt.key;
      return `
        <button class="picker-tile ${active ? 'active' : ''}" data-metric="${mt.key}" aria-pressed="${active}">
          <span class="picker-tile-main"><span class="picker-tile-ic" aria-hidden="true">${this._icon(mt.icon)}</span><span class="picker-tile-name">${mt.tileLabel || mt.label}</span></span>
          <span class="picker-tile-count">${count}</span>
        </button>`;
    }).join('');
    return `<div class="picker-tiles" data-metric-count="${this._metrics.length}">${tiles}</div>`;
  }

  _renderSupCard(s, c) {
    const isExp = this._supExpandedKey === s.key;
    const gm = this._gradeMeta(c.g);
    const flag = c.flag || s.flag;
    const src = c.src ? this._src[c.src] : null;
    const canBuy = s.amazon && (c.g === 'S' || c.g === 'M' || c.g === 'W');

    let body = '';
    if (isExp) {
      body = `
        <div class="fact-body">
          <dl class="fact-fields">
            <div class="fact-fields--full"><dt>What the research found</dt><dd>${c.effect}</dd></div>
            <div><dt>Study</dt><dd>${c.study}</dd></div>
            <div><dt>Evidence grade</dt><dd>${gm.full}${c.g === 'X' ? ' (a useful null)' : ''}</dd></div>
            ${flag ? `<div class="fact-fields--full"><dt>Funding / quality flag</dt><dd>${c.flagNote || 'Industry-funded, not peer-reviewed, preclinical, or very small N — read with caution.'}</dd></div>` : ''}
          </dl>
          ${src ? `<div class="fact-source-row"><span class="fact-source-lbl">Source</span><a href="${src.url}" target="_blank" rel="noopener" class="source-link">${src.label} ${this._icon('externalLink')}</a></div>` : ''}
          ${canBuy ? `<div class="fact-buy-row"><a class="dd-buy dd-buy--sm" href="${s.amazon.url}" target="_blank" rel="noopener sponsored"><span class="dd-buy-cart" aria-hidden="true">${this._icon('cart')}</span>${s.amazon.label} on Amazon<span class="dd-buy-go" aria-hidden="true">${this._icon('externalLink')}</span></a><span class="dd-buy-aff">Affiliate link — we may earn a commission. Not an endorsement or medical advice.</span></div>` : ''}
        </div>`;
    }

    return `
      <article class="fact-card ${isExp ? 'expanded' : ''}" data-sup-key="${s.key}">
        <button class="fact-head" aria-expanded="${isExp}">
          <span class="fact-top">
            ${flag ? `<span class="fact-flag">${this._icon('alert')} Industry-funded</span>` : ''}
            <span class="grade-badge ${gm.cls}" title="${gm.full} evidence">${gm.full}</span>
            <span class="fact-chev" aria-hidden="true">${this._icon('chevDown')}</span>
          </span>
          <span class="fact-name">${s.name}</span>
          <span class="fact-effect">${c.effect}</span>
        </button>
        ${body}
      </article>`;
  }

  _renderSupList() {
    const cells = this._cellsForMetric(this._metricFilter);
    if (!cells.length) return '<p class="dash-empty">No supplements mapped to this metric.</p>';

    const byGrade = (a, b) => this._gradeMeta(b.c.g).w - this._gradeMeta(a.c.g).w || a.s.name.localeCompare(b.s.name);
    const backed = cells.filter(x => x.c.g === 'S' || x.c.g === 'M').sort(byGrade);
    const weak   = cells.filter(x => x.c.g === 'W' || x.c.g === '~').sort(byGrade);
    const nul    = cells.filter(x => x.c.g === 'X').sort(byGrade);

    const group = (cls, label, sub, items) => items.length ? `
      <div class="fact-group fact-group--${cls}">
        <div class="fact-group-head">
          <span class="fact-group-label"><span class="fact-group-icon" aria-hidden="true"></span>${label}</span>
          <span class="fact-group-meta">${items.length} supplement${items.length === 1 ? '' : 's'} · ${sub}</span>
        </div>
        <div class="fact-list">${items.map(x => this._renderSupCard(x.s, x.c)).join('')}</div>
      </div>` : '';

    return `
      <div class="fact-groups">
        ${group('backed', 'What\'s backed', 'Strong & moderate evidence', backed)}
        ${group('weak', 'Weaker or mixed', 'Limited or inconsistent', weak)}
        ${group('nul', 'Tested — no effect', 'Useful nulls', nul)}
      </div>`;
  }

  _renderExplorerSection() {
    const mt = this._metrics.find(m => m.key === this._metricFilter) || this._metrics[0];
    const shown = this._cellsForMetric(mt.key).length;
    return `
      <section class="factors-section section-bg-gray" id="explorer">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('flask')}</span>The metric-filtered explorer</span>
            <h2 class="section-h2">Pick a metric. See what <em>actually moves it</em>.</h2>
            <p class="section-lede">Choose the number you stare at every morning, and get the supplements ranked by evidence — what's backed, what's weak, and what's been tested with no effect. Funding flags included.</p>
          </div>
          <span class="metric-tiles-label">Choose your metric — ${this._metrics.length} to explore</span>
          ${this._renderMetricTiles()}
          <div class="picker-panel">
            <div class="picker-panel-head">
              <h3 class="picker-panel-title">${mt.label}<span class="picker-panel-meta">${shown} supplement${shown === 1 ? '' : 's'}</span></h3>
            </div>
            <p class="picker-benefit">${mt.benefit}</p>
            ${this._renderSupList()}
            <div class="picker-foot">
              ${this._readMore(mt.tool, `Explore the full ${mt.toolName} (lifestyle, food & more)`)}
            </div>
          </div>
        </div>
      </section>`;
  }

  /* ------------------------------------------------------------- MATRIX */

  _renderMatrixSection() {
    const metrics = this._metrics;
    const ranked = this._supplements
      .map(s => ({ s, score: this._suppScore(s) }))
      .sort((a, b) => b.score - a.score || a.s.name.localeCompare(b.s.name));

    const head = `
      <thead>
        <tr>
          <th class="dt-th-device" scope="col">Supplement</th>
          ${metrics.map(m => `<th scope="col"><span class="dt-th-full">${m.short}</span><span class="dt-th-short" aria-hidden="true">${m.short}</span></th>`).join('')}
        </tr>
      </thead>`;

    const body = ranked.map(({ s }) => `
      <tr>
        <th class="dt-td-device" scope="row">
          <span class="mx-name">${s.name}${s.flag ? ` <span class="mx-flag" title="Industry-funded / quality flag" aria-label="funding flag">${this._icon('alert')}</span>` : ''}</span>
        </th>
        ${metrics.map(m => {
          const c = s.m[m.key];
          if (!c) return `<td class="mx-cell"><span class="mx-dash" aria-label="no metric-specific evidence">–</span></td>`;
          const gm = this._gradeMeta(c.g);
          return `<td class="mx-cell"><span class="gpill gpill--mx ${gm.cls}" title="${gm.full}${(c.flag || s.flag) ? ' · funding flag' : ''}">${gm.short}</span></td>`;
        }).join('')}
      </tr>`).join('');

    return `
      <section class="comparison-section section-bg-gray" id="matrix">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('target')}</span>The master matrix</span>
            <h2 class="section-h2">Every supplement, <em>every metric</em>, at a glance.</h2>
            <p class="section-lede">One grade per cell: how good the evidence is that this supplement moves that metric in the right direction. Ranked strongest-overall first.</p>
          </div>
          <div class="device-chart">
            <div class="dc-head">
              <div>
                <span class="dc-eyebrow">Evidence grades</span>
                <h3 class="dc-title">Supplement × metric, graded by evidence</h3>
                <p class="dc-sub">Blank = no metric-specific evidence found. Use the explorer above to read the studies behind any cell.</p>
              </div>
              <div class="dc-meta">${ranked.length} supplements · ${metrics.length} metrics</div>
            </div>
            <div class="device-table-wrap">
              <table class="device-table mxtable">
                ${head}
                <tbody>${body}</tbody>
              </table>
            </div>
            <div class="mx-legend">
              <span class="mx-legend-item"><span class="gpill gpill--mx g-s">S</span> Strong</span>
              <span class="mx-legend-item"><span class="gpill gpill--mx g-m">M</span> Moderate</span>
              <span class="mx-legend-item"><span class="gpill gpill--mx g-w">W</span> Weak</span>
              <span class="mx-legend-item"><span class="gpill gpill--mx g-mix">~</span> Mixed</span>
              <span class="mx-legend-item"><span class="gpill gpill--mx g-x">✗</span> Tested, no effect</span>
              <span class="mx-legend-item"><span class="mx-flag-sw" aria-hidden="true">${this._icon('alert')}</span> Funding flag</span>
            </div>
          </div>
        </div>
      </section>`;
  }

  /* ------------------------------------------------------------- MYTHS */

  _mythPicks() {
    return [
      { label: 'Magnesium\'s "27 RCTs"', stat: '3 trials', answer: 'Really just n=151', icon: 'ban', note: 'The viral "27 RCTs / 2,496 people" figure is actually 3 small trials totalling 151 older adults, rated low-quality. Magnesium does help sleep onset — just nowhere near the marketing number.' },
      { label: 'Melatonin & staying asleep', stat: 'No effect', answer: 'It won\'t keep you asleep', icon: 'moon', note: 'Standard immediate-release melatonin shows no significant effect on wake after sleep onset (Moon 2022). It\'s a timing aid for falling asleep, not a maintenance aid.' },
      { label: 'CBD & recovery', stat: 'No change', answer: 'WHOOP saw nothing', icon: 'flask', note: 'CBD shows no meaningful recovery change on WHOOP, and CBD isolate 150 mg was null for sleep onset (Narayan 2024). Don\'t rely on it for your score.' },
      { label: 'Apigenin (the trendy one)', stat: '0 RCTs', answer: 'No human sleep trial exists', icon: 'ban', note: 'Isolated apigenin — the trendy ~50 mg version — has zero human sleep RCTs. The evidence people cite is for whole chamomile extract. Use the extract, not the isolate.' },
      { label: 'Passionflower', stat: 'Subjective', answer: 'Self-report, industry-funded', icon: 'alert', note: 'The "evidence" was self-reported total sleep time with no PSG, in an industry-funded trial (JK Botanicals). Deep sleep was never actually measured.' },
      { label: 'L-theanine & resting HRV', stat: 'Acute only', answer: 'Not a baseline gain', icon: 'activity', note: 'L-theanine blunts sympathetic activation during acute stress (Kimura 2007) — it is not a resting-HRV or baseline resting-heart-rate improvement.' }
    ];
  }

  _renderMythSection() {
    return `
      <section class="picks-section section-bg-gray">
        <div class="container">
          <div class="picks-card">
            <div class="picks-glow" aria-hidden="true"></div>
            <div class="picks-head animate-on-scroll">
              <span class="picks-eyebrow">The honesty layer</span>
              <h2 class="picks-title">The popular stuff that <em>doesn't work</em>.</h2>
            </div>
            <div class="picks-grid">
              ${this._mythPicks().map((p, i) => `
                <article class="pick-card animate-on-scroll" style="--delay:${i * 70}ms">
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

  _renderCalloutSection() {
    return `
      <section class="callout-section section-bg-white">
        <div class="container">
          <div class="callout-card animate-on-scroll">
            <span class="callout-icon" aria-hidden="true">${this._icon('info')}</span>
            <div class="callout-body">
              <h3>Read this before you buy anything</h3>
              <p>Frame every row as <em>"research shows X affects this metric,"</em> never <em>"take X to fix your number."</em> Many of these effect sizes — RHR −2.2 bpm, HRV +1.45 ms — are small next to a wearable's night-to-night noise, and most were measured on Oura specifically (see <a href="https://www.kygo.app/tools/wearable-accuracy" target="_blank" rel="noopener">how accurate your wearable is</a> and the <a href="https://www.kygo.app/tools/sensor-comparison" target="_blank" rel="noopener">sensor comparison</a>). Nearly every supplement-specific trial here is industry-funded. Doses are study doses, not recommendations. This is not medical advice — talk to a clinician before changing your routine.</p>
            </div>
          </div>
        </div>
      </section>`;
  }

  /* ------------------------------------------------------------- CTAs */

  _renderArticleCta() {
    return `
      <section class="article-section section-bg-white">
        <div class="container">
          <a href="${this._posts.backed}" class="article-card animate-on-scroll" target="_blank" rel="noopener">
            <span class="article-badge">Read the guide</span>
            <div class="article-body">
              <span class="article-kicker">What's backed vs what's hype</span>
              <h3 class="article-title">Supplements That Actually Move Your Wearable Metrics <span class="article-year">(2026)</span></h3>
              <p class="article-desc">The six that hold up, the myths that don't, and who funded the studies — pulled straight from this matrix.</p>
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
              <h2>See If A Supplement Actually <span class="highlight">Moves Your Numbers</span></h2>
              <p>Kygo Health connects your wearable data with what you take and eat, so you can test whether magnesium, omega-3 or anything else actually shifts your own HRV, sleep, and recovery trend.</p>
              <div class="app-cta-buttons">
                <a href="${iosUrl}" class="app-cta-btn" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </a>
                <a href="https://www.kygo.app/android" target="_blank" rel="noopener" class="app-cta-android">
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

  _renderFaqSection() {
    const faqs = this._faqs();
    return `
      <section class="faq-section section-bg-gray" id="faq">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow"><span class="section-eyebrow-icon" aria-hidden="true">${this._icon('info')}</span>Common questions</span>
            <h2 class="section-h2">Supplements & your metrics, <em>answered</em>.</h2>
          </div>
          <div class="faq-list">
            ${faqs.map(f => `
              <details class="faq-item">
                <summary class="faq-q"><span>${f.q}</span><span class="faq-chev" aria-hidden="true">${this._icon('chevDown')}</span></summary>
                <div class="faq-a"><p>${f.a}</p></div>
              </details>`).join('')}
          </div>
        </div>
      </section>`;
  }

  _renderSourcesSection() {
    const S = this._src;
    const groups = {
      'Sleep onset, deep sleep & staying asleep': [S.mela, S.cheah, S.mag, S.glycine, S.gaba, S.theanine, S.tart, S.pigeon, S.valerian],
      'HRV, RHR & recovery / readiness': [S.omega3hrv, S.omega3rhr, S.ashhrv, S.mgt, S.nitrate, S.micronutrient, S.saffron, S.chamomile, S.melacv],
      'Excluded / myth-busts': [S.apigenin]
    };
    const total = Object.values(groups).reduce((s, g) => s + g.length, 0);
    return `
      <section class="sources-section section-bg-white">
        <div class="container">
          <h2 class="section-title">Sources</h2>
          <p class="section-sub">Every supplement claim verified against primary research (2026-06-12 pass). Funding flags are part of the data — they travel with each claim.</p>
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

  /* ------------------------------------------------------------- STRUCTURED DATA */

  _injectStructuredData() {
    if (document.querySelector('script[data-kygo-supplements-by-metric-ld]')) return;

    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Supplements by Metric Explorer',
      'alternateName': 'Kygo Supplement × Wearable Metric Evidence Tool',
      'description': 'Pick a wearable metric — sleep latency, deep sleep, staying asleep, HRV, resting heart rate, or recovery/readiness — and see which of 27 supplements the research actually supports, graded by evidence with industry-funding flags and the popular options that do not work.',
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'Web',
      'url': 'https://www.kygo.app/tools/supplements-by-metric',
      'datePublished': '2026-06-13',
      'dateModified': '2026-06-13',
      'softwareVersion': '1.0',
      'inLanguage': 'en',
      'isAccessibleForFree': true,
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
      'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
      'featureList': 'Metric-filtered supplement explorer across 6 wearable metrics, supplements ranked by evidence grade (Strong/Moderate/Weak/no-effect) with industry-funding flags, an at-a-glance supplement × metric master matrix, honest myth-busts, and primary-source citations.',
      'keywords': 'supplements by metric, supplements for HRV, supplements to lower resting heart rate, supplements for deep sleep, supplements for sleep latency, supplements for recovery score, omega-3 HRV RHR, ashwagandha HRV sleep, glycine sleep, magnesium myth 27 RCTs, melatonin does not help staying asleep, CBD recovery WHOOP, apigenin no human sleep RCT, saffron PSQI, tart cherry WASO, evidence-graded supplements, industry-funded supplement trials'
    };

    const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': this._faqs().map(f => ({ '@type': 'Question', 'name': f.q, 'acceptedAnswer': { '@type': 'Answer', 'text': f.a } })) };

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Kygo Health', 'item': 'https://www.kygo.app' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
        { '@type': 'ListItem', 'position': 3, 'name': 'Supplements by Metric', 'item': 'https://www.kygo.app/tools/supplements-by-metric' }
      ]
    };

    [ld, faq, breadcrumb].forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-kygo-supplements-by-metric-ld', '');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });
  }

  /* ------------------------------------------------------------- RENDER */

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const supCount = this._supplements.length;
    const metricCount = this._metrics.length;
    const backedCount = this._supplements.filter(s => Object.values(s.m).some(c => c.g === 'S' || c.g === 'M')).length;
    const nullCount = this._supplements.reduce((n, s) => n + Object.values(s.m).filter(c => c.g === 'X').length, 0);

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="header">
        <div class="header-inner">
          <a href="https://www.kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" />
            Supplements by Metric
          </a>
          <a href="https://www.kygo.app" class="header-link" target="_blank" rel="noopener">
            Get Kygo Health ${this._icon('arrowRight')}
          </a>
        </div>
      </header>

      <section class="hero section-bg-white">
        <div class="container hero-inner">
          <div class="hero-kicker animate-on-scroll"><span class="hero-dot" aria-hidden="true"></span>${metricCount} Metrics · ${supCount} Supplements</div>
          <h1 class="hero-title animate-on-scroll">What supplements actually move <em>the numbers on your wearable</em>.</h1>
          <p class="hero-sub animate-on-scroll">Sleep latency, deep sleep, staying asleep, HRV, resting heart rate, recovery — graded by real evidence, with the <strong>funding flags</strong> and the popular stuff that <strong>doesn't work</strong>.</p>
          <div class="animate-on-scroll">
            <div class="hero-meta">
              <div class="hero-cell"><span class="hero-num">${metricCount}</span><span class="hero-lbl">Wearable metrics</span></div>
              <div class="hero-cell"><span class="hero-num">${supCount}</span><span class="hero-lbl">Supplements graded</span></div>
              <div class="hero-cell"><span class="hero-num">${backedCount}</span><span class="hero-lbl">Backed for a metric</span></div>
              <div class="hero-cell"><span class="hero-num">${nullCount}</span><span class="hero-lbl">Tested — no effect</span></div>
            </div>
          </div>
        </div>
      </section>

      ${this._renderExplorerSection()}
      ${this._renderCtaRow()}
      ${this._renderMatrixSection()}
      ${this._renderArticleCta()}
      ${this._renderMythSection()}
      ${this._renderCalloutSection()}
      ${this._renderFaqSection()}
      ${this._renderSourcesSection()}

      <footer class="tool-footer">
        <div class="container">
          <a href="https://www.kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" loading="lazy" />
            Kygo Health
          </a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Effect sizes are study findings under specific conditions, often small relative to wearable night-to-night noise; doses cited are study doses, not recommendations. Always consult a qualified healthcare provider before starting or changing any supplement.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases. Product links on this page are affiliate links — we may earn a commission at no extra cost to you.</p>
          <p class="footer-copyright">© ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  /* ------------------------------------------------------------- EVENTS */

  _setupEventDelegation() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const shadow = this.shadowRoot;

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

      const tile = e.target.closest('[data-metric]');
      if (tile) {
        const k = tile.dataset.metric;
        if (k && k !== this._metricFilter) {
          this._metricFilter = k;
          this._supExpandedKey = null;
          replaceWithHTML(shadow.querySelector('.factors-section'), this._renderExplorerSection());
        }
        return;
      }

      const head = e.target.closest('.fact-head');
      if (head) {
        const card = head.closest('[data-sup-key]');
        if (card) {
          const k = card.dataset.supKey;
          this._supExpandedKey = this._supExpandedKey === k ? null : k;
          replaceWithHTML(shadow.querySelector('.fact-groups'), this._renderSupList());
        }
        return;
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
      }, { rootMargin: '0px 0px -50px 0px', threshold: 0.01 });
      els.forEach(el => this._observer.observe(el));
      setTimeout(() => {
        this.shadowRoot.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(el => el.classList.add('visible'));
      }, 1500);
    });
  }

  /* ------------------------------------------------------------- STYLES */

  _styles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

      :host {
        --dark: #1E293B;
        --dark-card: #0F172A;
        --light: #F8FAFC;
        --green: #22C55E;
        --green-dark: #16A34A;
        --green-light: rgba(34,197,94,0.10);
        --gray-50: #f9fafb;
        --gray-100: #F1F5F9;
        --gray-200: #E2E8F0;
        --gray-300: #CBD5E1;
        --gray-400: #94A3B8;
        --gray-600: #475569;
        --gray-700: #334155;
        --radius: 20px;
        --radius-sm: 10px;
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
      button:focus-visible, .source-link:focus-visible, a:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; border-radius: 6px; }

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
      .hero-title { font-size: clamp(32px, 8.5vw, 76px); line-height: 1.02; letter-spacing: -0.03em; font-weight: 600; margin: 0; color: var(--dark); max-width: 16ch; }
      .hero-title em { font-style: normal; color: var(--green); font-family: inherit; }
      .hero-sub { margin: 20px 0 0; max-width: 58ch; font-size: clamp(15px, 2.2vw, 19px); line-height: 1.5; color: var(--gray-600); }
      .hero-sub strong { color: var(--dark); font-weight: 600; }
      .hero-meta { margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-top: 1px solid var(--gray-200); padding-top: 20px; max-width: 760px; }
      .hero-meta .hero-cell { padding: 8px 14px 8px 0; border-right: 1px solid var(--gray-200); min-width: 0; }
      .hero-meta .hero-cell:nth-child(2n) { border-right: 0; padding-right: 0; padding-left: 16px; }
      .hero-meta .hero-cell:nth-child(-n+2) { border-bottom: 1px solid var(--gray-200); padding-bottom: 16px; }
      .hero-meta .hero-cell:nth-child(n+3) { padding-top: 16px; }
      .hero-num { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: clamp(26px, 6.5vw, 40px); color: var(--dark); letter-spacing: -0.02em; font-feature-settings: "tnum" 1; display: block; line-height: 1; }
      .hero-lbl { font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; color: var(--gray-400); font-weight: 600; margin-top: 6px; display: block; }
      @media (min-width: 640px) {
        .hero-meta { grid-template-columns: repeat(4, 1fr); }
        .hero-meta .hero-cell { padding: 0 16px; border-right: 1px solid var(--gray-200); border-bottom: 0 !important; }
        .hero-meta .hero-cell:first-child { padding-left: 0; }
        .hero-meta .hero-cell:last-child { border-right: 0; padding-right: 0; }
        .hero-meta .hero-cell:nth-child(n+3), .hero-meta .hero-cell:nth-child(-n+2) { padding-top: 0; padding-bottom: 0; }
      }
      @media (min-width: 768px) { .hero { padding: 72px 0 48px; } }

      /* SECTION BACKGROUNDS */
      .section-bg-white { background: #fff; }
      .section-bg-gray { background: var(--gray-100); }

      .section-header { margin-bottom: 28px; max-width: 760px; }
      .section-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 10.5px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--green-dark); margin-bottom: 12px; }
      .section-eyebrow-icon { width: 22px; height: 22px; border-radius: 7px; background: var(--green-light); color: var(--green-dark); display: inline-flex; align-items: center; justify-content: center; }
      .section-eyebrow-icon svg { width: 13px; height: 13px; }
      .section-h2 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: clamp(26px, 5.5vw, 40px); letter-spacing: -0.02em; line-height: 1.08; margin: 0 0 12px; color: var(--dark); }
      .section-h2 em { font-style: normal; color: var(--green); font-family: inherit; }
      .section-lede { font-size: 15px; color: var(--gray-600); line-height: 1.55; margin: 0; max-width: 64ch; }
      .section-title { font-size: clamp(24px, 6vw, 36px); text-align: center; margin-bottom: 8px; }
      .section-sub { text-align: center; color: var(--gray-600); font-size: 15px; margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto; }
      .comparison-section, .factors-section, .callout-section, .sources-section, .picks-section { padding: 48px 0 56px; }
      @media (min-width: 768px) {
        .comparison-section, .factors-section, .callout-section, .sources-section, .picks-section { padding: 64px 0 72px; }
      }

      /* ARTICLE CTA */
      .article-section { padding: 48px 0; background: #fff; }
      @media (min-width: 768px) { .article-section { padding: 64px 0; } }
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

      /* MATRIX CHART */
      .device-chart { background: #fff; border: 1px solid var(--gray-200); border-radius: 18px; padding: 18px 16px 16px; box-shadow: 0 1px 0 rgba(15,23,42,0.03); }
      @media (min-width: 768px) { .device-chart { padding: 26px 28px 22px; border-radius: 22px; } }
      .dc-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding-bottom: 14px; margin-bottom: 6px; border-bottom: 1px dashed var(--gray-200); }
      .dc-eyebrow { display: block; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--green-dark); margin-bottom: 4px; }
      .dc-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 19px; color: var(--dark); margin: 0 0 6px; letter-spacing: -0.01em; line-height: 1.2; }
      .dc-sub { font-size: 13px; color: var(--gray-600); margin: 0; line-height: 1.5; max-width: 60ch; }
      .dc-meta { font-size: 11.5px; color: var(--gray-400); font-weight: 600; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.6px; }

      .device-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0 -16px; padding: 0 16px 4px; }
      @media (min-width: 768px) { .device-table-wrap { margin: 0; padding: 0; } }
      .device-table { width: 100%; border-collapse: separate; border-spacing: 0; font-feature-settings: "tnum" 1; }
      .mxtable { min-width: 600px; }
      .device-table th, .device-table td { padding: 0; vertical-align: middle; }
      .device-table thead th { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 10.5px; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); text-align: center; padding: 12px 4px; vertical-align: middle; border-bottom: 1px solid var(--gray-200); white-space: nowrap; background: #fff; }
      .device-table thead .dt-th-device { text-align: left; padding-left: 4px; }
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

      .dt-td-device { padding: 10px 10px 10px 4px; width: 150px; min-width: 150px; text-align: left; background: #fff; position: sticky; left: 0; z-index: 1; transition: background .15s; box-shadow: 1px 0 0 var(--gray-200); }
      .mx-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 12.5px; color: var(--dark); line-height: 1.2; overflow-wrap: anywhere; display: inline-flex; align-items: center; gap: 5px; flex-wrap: wrap; }
      .mx-flag { display: inline-flex; align-items: center; color: var(--gray-400); }
      .mx-flag svg { width: 12px; height: 12px; }
      @media (min-width: 768px) {
        .dt-td-device { width: 230px; min-width: 230px; position: static; box-shadow: none; padding: 14px 14px 14px 4px; }
        .mx-name { font-size: 14.5px; }
      }
      .device-table tbody td.mx-cell { text-align: center; padding: 10px 6px; }
      @media (min-width: 768px) { .device-table tbody td.mx-cell { padding: 12px 8px; } }
      .mx-dash { display: inline-block; color: var(--gray-300); font-weight: 700; }

      .mx-legend { display: flex; flex-wrap: wrap; gap: 10px 16px; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--gray-100); }
      .mx-legend-item { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 600; color: var(--gray-600); }
      .mx-flag-sw { display: inline-flex; color: var(--gray-400); }
      .mx-flag-sw svg { width: 14px; height: 14px; }

      /* GRADE PILLS */
      .gpill { display: inline-flex; align-items: center; justify-content: center; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; min-width: 60px; padding: 5px 11px; border-radius: 9px; white-space: nowrap; letter-spacing: -0.005em; background: var(--gray-100); color: var(--gray-400); }
      @media (min-width: 480px) { .gpill { font-size: 14px; min-width: 78px; padding: 6px 14px; border-radius: 10px; } }
      .gpill--mx { min-width: 30px; width: 30px; height: 30px; padding: 0; border-radius: 8px; font-size: 13px; }
      @media (min-width: 480px) { .gpill--mx { min-width: 32px; width: 32px; height: 32px; font-size: 13px; padding: 0; } }
      .gpill.g-s { background: var(--green); color: #fff; }
      .gpill.g-m { background: var(--green-light); color: var(--green-dark); }
      .gpill.g-w { background: var(--gray-100); color: var(--gray-600); }
      .gpill.g-mix { background: var(--gray-100); color: var(--gray-400); }
      .gpill.g-x { background: var(--dark); color: #fff; }

      /* GRADE BADGE — small word chip in the card top-right (replaces the big letter pill) */
      .grade-badge { display: inline-flex; align-items: center; flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 9.5px; letter-spacing: 0.4px; text-transform: uppercase; padding: 4px 9px; border-radius: 9999px; white-space: nowrap; background: var(--gray-100); color: var(--gray-400); }
      @media (min-width: 480px) { .grade-badge { font-size: 10px; padding: 4px 10px; } }
      .grade-badge.g-s { background: var(--green); color: #fff; }
      .grade-badge.g-m { background: var(--green-light); color: var(--green-dark); }
      .grade-badge.g-w { background: var(--gray-100); color: var(--gray-600); }
      .grade-badge.g-mix { background: var(--gray-100); color: var(--gray-400); }
      .grade-badge.g-x { background: var(--dark); color: #fff; }

      /* METRIC PICKER TILES */
      .metric-tiles-label { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase; color: var(--gray-400); margin: 6px 0 8px; }
      .picker-tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-bottom: 16px; }
      .picker-tile { display: flex; align-items: center; justify-content: space-between; gap: 7px; padding: 11px 12px; min-height: 56px; min-width: 0; background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; font-family: inherit; cursor: pointer; transition: border-color .15s, transform .15s, background .15s, box-shadow .15s; text-align: left; color: var(--dark); }
      .picker-tile:hover { border-color: var(--gray-300); transform: translateY(-1px); }
      .picker-tile.active { background: var(--dark); color: #fff; border-color: var(--dark); box-shadow: 0 6px 18px rgba(15,23,42,0.12); }
      .picker-tile-main { display: inline-flex; align-items: center; gap: 7px; min-width: 0; flex: 1; }
      .picker-tile-ic { width: 24px; height: 24px; border-radius: 7px; background: var(--green-light); color: var(--green-dark); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background .15s, color .15s; }
      .picker-tile-ic svg { width: 14px; height: 14px; }
      .picker-tile.active .picker-tile-ic { background: rgba(255,255,255,0.16); color: #fff; }
      .picker-tile-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 12.5px; letter-spacing: -0.01em; line-height: 1.12; min-width: 0; flex: 1; white-space: normal; overflow-wrap: break-word; word-break: normal; hyphens: none; }
      @media (min-width: 400px) { .picker-tile-name { font-size: 13.5px; } }
      @media (min-width: 560px) { .picker-tile-name { font-size: 14px; } }
      .picker-tile-count { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 11.5px; color: var(--gray-600); background: var(--gray-100); border-radius: 9999px; padding: 2px 7px; min-width: 24px; text-align: center; font-feature-settings: "tnum" 1; flex-shrink: 0; }
      .picker-tile.active .picker-tile-count { background: rgba(255,255,255,0.16); color: #fff; }
      @media (min-width: 560px) { .picker-tiles { grid-template-columns: repeat(3, 1fr); } }
      @media (min-width: 880px) { .picker-tiles { grid-template-columns: repeat(6, 1fr); } }

      /* PICKER PANEL */
      .picker-panel { background: #fff; border: 1px solid var(--gray-200); border-radius: 18px; padding: 14px; box-shadow: 0 1px 0 rgba(15,23,42,0.03); min-width: 0; overflow: hidden; }
      .picker-panel-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-bottom: 6px; }
      .picker-panel-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 17px; color: var(--dark); margin: 0; letter-spacing: -0.01em; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
      .picker-panel-meta { font-size: 11.5px; font-weight: 600; color: var(--gray-400); letter-spacing: 0.5px; text-transform: uppercase; }
      .picker-benefit { font-size: 13px; color: var(--gray-600); line-height: 1.5; margin: 0 0 14px; padding-bottom: 14px; border-bottom: 1px solid var(--gray-100); }
      .picker-foot { margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--gray-100); }
      @media (min-width: 768px) { .picker-panel { padding: 24px 26px; border-radius: 22px; } }

      /* SECTION DEEP-LINK — read-more to a sibling tool/post */
      .section-readmore { display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; color: var(--green-dark); letter-spacing: -0.005em; transition: gap .15s, color .15s; }
      .section-readmore:hover { color: var(--green); gap: 9px; }
      .section-readmore span { display: inline-flex; }
      .section-readmore svg { width: 15px; height: 15px; }
      .callout-body a { color: var(--green); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
      .callout-body a:hover { color: #fff; }

      /* SUPPLEMENT CARDS */
      .fact-groups { display: grid; grid-template-columns: 1fr; gap: 18px; min-width: 0; }
      .fact-group { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
      .fact-group-head { display: flex; align-items: baseline; justify-content: space-between; gap: 2px 12px; flex-wrap: wrap; padding: 0 2px 4px; border-bottom: 1px dashed var(--gray-200); }
      .fact-group-label { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13.5px; letter-spacing: -0.005em; }
      .fact-group-icon { width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; line-height: 1; flex-shrink: 0; color: #fff; }
      .fact-group-meta { font-size: 11px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; color: var(--gray-400); white-space: normal; }
      .fact-group--backed .fact-group-label { color: var(--green-dark); }
      .fact-group--backed .fact-group-icon { background: var(--green); }
      .fact-group--backed .fact-group-icon::after { content: '✓'; }
      .fact-group--weak .fact-group-label { color: var(--gray-600); }
      .fact-group--weak .fact-group-icon { background: var(--gray-400); }
      .fact-group--weak .fact-group-icon::after { content: '~'; }
      .fact-group--nul .fact-group-label { color: var(--dark); }
      .fact-group--nul .fact-group-icon { background: var(--dark); }
      .fact-group--nul .fact-group-icon::after { content: '✗'; }
      @media (min-width: 980px) { .fact-groups { grid-template-columns: 1fr 1fr; gap: 22px; } }

      .fact-list { display: grid; grid-template-columns: 1fr; gap: 8px; }
      .fact-card { background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; overflow: hidden; min-width: 0; transition: border-color .15s, box-shadow .15s; }
      .fact-card:hover { border-color: var(--gray-300); }
      .fact-card.expanded { box-shadow: 0 6px 18px rgba(15,23,42,0.06); border-color: var(--gray-300); }
      .fact-head { display: flex; flex-direction: column; align-items: stretch; gap: 6px; width: 100%; padding: 13px 15px; background: transparent; border: 0; cursor: pointer; font-family: inherit; text-align: left; }
      .fact-head:hover { background: var(--gray-50); }
      .fact-top { display: flex; align-items: center; gap: 8px; justify-content: flex-end; min-height: 22px; }
      .fact-flag { display: inline-flex; align-items: center; gap: 4px; margin-right: auto; font-family: 'Space Grotesk', sans-serif; font-size: 9.5px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--gray-600); line-height: 1; }
      .fact-flag svg { width: 11px; height: 11px; flex-shrink: 0; }
      .fact-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); line-height: 1.25; letter-spacing: -0.005em; overflow-wrap: break-word; }
      .fact-effect { font-size: 12.5px; color: var(--gray-600); line-height: 1.45; }
      .fact-chev { width: 18px; height: 18px; color: var(--gray-400); display: inline-flex; align-items: center; justify-content: center; transition: transform .2s; flex-shrink: 0; }
      .fact-chev svg { width: 16px; height: 16px; }
      .fact-card.expanded .fact-chev { transform: rotate(180deg); color: var(--green-dark); }
      @media (min-width: 768px) {
        .fact-list { gap: 10px; }
        .fact-card { border-radius: 16px; }
        .fact-head { padding: 16px 18px; }
        .fact-name { font-size: 16px; }
        .fact-effect { font-size: 13px; }
      }

      .fact-body { padding: 6px 18px 18px; border-top: 1px dashed var(--gray-200); background: var(--gray-50); }
      .fact-fields { display: grid; gap: 12px; margin: 14px 0 4px; min-width: 0; }
      .fact-fields > div { display: grid; grid-template-columns: 1fr; gap: 3px; min-width: 0; }
      .fact-fields dt { font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); margin: 0; }
      .fact-fields dd { margin: 0; font-size: 13.5px; color: var(--gray-700); line-height: 1.55; overflow-wrap: anywhere; }
      @media (min-width: 768px) { .fact-fields { grid-template-columns: 1fr 1fr; gap: 14px 24px; } .fact-fields--full { grid-column: 1 / -1; } }

      .fact-source-row { margin-top: 16px; padding-top: 12px; border-top: 1px dashed var(--gray-200); display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
      .fact-source-lbl { font-size: 10px; letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); font-weight: 700; }
      .source-link { display: inline-flex; align-items: center; gap: 4px; color: var(--green-dark); font-weight: 500; font-size: 13px; overflow-wrap: anywhere; min-width: 0; }
      .source-link svg { width: 12px; height: 12px; }
      .source-link:hover { color: var(--green); }

      /* AMAZON BUY LINK */
      .fact-buy-row { display: flex; flex-direction: column; gap: 6px; margin-top: 14px; padding-top: 12px; border-top: 1px dashed var(--gray-200); }
      .dd-buy { display: inline-flex; align-items: center; justify-content: center; gap: 8px; align-self: flex-start; padding: 11px 18px; border-radius: 10px; background: var(--green); color: #fff; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13.5px; letter-spacing: -0.005em; transition: background .2s; }
      .dd-buy:hover { background: var(--green-dark); color: #fff; }
      .dd-buy--sm { padding: 9px 14px; font-size: 12.5px; }
      .dd-buy-cart { width: 15px; height: 15px; display: inline-flex; }
      .dd-buy-cart svg { width: 15px; height: 15px; }
      .dd-buy-go { width: 13px; height: 13px; opacity: 0.85; display: inline-flex; }
      .dd-buy-go svg { width: 13px; height: 13px; }
      .dd-buy-aff { font-size: 10.5px; color: var(--gray-400); letter-spacing: 0.2px; line-height: 1.4; }

      /* APP CTA */
      .app-cta-section { padding: 48px 0; background: #fff; }
      @media (min-width: 768px) { .app-cta-section { padding: 64px 0; } }
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
      .app-cta-btn, .app-cta-android { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; }
      .app-cta-btn:hover, .app-cta-android:hover { background: var(--green-dark); color: #fff; }
      .app-cta-btn svg, .app-cta-android svg { width: 18px; height: 18px; }
      .app-cta-tags { display: flex; align-items: center; justify-content: center; gap: 10px 12px; margin-top: 20px; flex-wrap: wrap; }
      .app-cta-tags-label { color: var(--gray-400); font-size: 11px; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
      .app-cta-tags-logos { display: flex; align-items: center; gap: 6px; justify-content: center; min-width: 0; }
      .app-cta-tags-logos img { height: 18px; width: auto; opacity: 0.75; object-fit: contain; }
      @media (min-width: 480px) { .app-cta-tags-logos img { height: 20px; } .app-cta-tags-label { font-size: 12px; } }
      @media (min-width: 768px) { .app-cta-tags-logos { gap: 8px; } .app-cta-tags-logos img { height: 22px; } }

      /* MYTHS — dark picks card */
      .picks-card { position: relative; background: var(--dark-card); color: #fff; border-radius: 24px; padding: 36px 22px; overflow: hidden; }
      .picks-glow { position: absolute; top: 0; right: 0; width: 90%; max-width: 520px; aspect-ratio: 1 / 1; background: radial-gradient(ellipse at top right, rgba(34,197,94,0.22) 0%, rgba(34,197,94,0.08) 35%, transparent 70%); pointer-events: none; }
      .picks-head { position: relative; z-index: 1; margin-bottom: 24px; }
      .picks-eyebrow { display: block; font-size: 11px; letter-spacing: 0.6px; text-transform: uppercase; color: rgba(255,255,255,0.5); font-weight: 600; margin-bottom: 8px; }
      .picks-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; color: #fff; margin: 0; font-size: clamp(26px, 5.5vw, 40px); letter-spacing: -0.02em; line-height: 1.08; }
      .picks-title em { font-style: normal; color: var(--green); font-family: inherit; }
      .picks-grid { display: grid; grid-template-columns: 1fr; gap: 12px; position: relative; z-index: 1; }
      .pick-card { position: relative; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 22px 20px 20px; transition: transform .25s ease-out, background .25s ease-out, border-color .25s ease-out; }
      .pick-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(34,197,94,0.5); transform: translateY(-3px); }
      .pick-icon { position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 9px; background: rgba(34,197,94,0.15); color: var(--green); display: inline-flex; align-items: center; justify-content: center; }
      .pick-icon svg { width: 18px; height: 18px; }
      .pick-label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: rgba(255,255,255,0.42); font-weight: 600; max-width: calc(100% - 44px); }
      .pick-stat { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 28px; color: var(--green); margin: 8px 0 6px; letter-spacing: -0.02em; line-height: 1; }
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
      @media (max-width: 600px) { .callout-card { flex-direction: column; gap: 12px; padding: 22px 20px; } }

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
      .src-group.open .src-group-body { max-height: 900px; }
      .src-item { display: flex; align-items: center; gap: 8px; padding: 8px 16px; text-decoration: none; color: var(--gray-600); font-size: 13px; transition: background 0.2s; }
      .src-item:last-child { padding-bottom: 12px; }
      .src-item:hover { background: var(--gray-50); }
      .src-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
      .src-text { flex: 1; }
      .src-ext { width: 14px; height: 14px; color: var(--gray-400); flex-shrink: 0; }
      .src-ext svg { width: 14px; height: 14px; }

      /* FAQ */
      .faq-section { padding: 48px 0 56px; }
      @media (min-width: 768px) { .faq-section { padding: 64px 0 72px; } }
      .faq-list { max-width: 820px; margin: 0; display: grid; gap: 10px; }
      .faq-item { background: #fff; border: 1px solid var(--gray-200); border-radius: 14px; overflow: hidden; transition: border-color .15s, box-shadow .15s; }
      .faq-item[open] { border-color: var(--gray-300); box-shadow: 0 6px 18px rgba(15,23,42,0.06); }
      .faq-item:hover { border-color: var(--gray-300); }
      .faq-q { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 16px 18px; cursor: pointer; list-style: none; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); line-height: 1.3; letter-spacing: -0.005em; }
      .faq-q::-webkit-details-marker { display: none; }
      .faq-chev { width: 20px; height: 20px; color: var(--gray-400); flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; transition: transform .25s, color .15s; }
      .faq-chev svg { width: 18px; height: 18px; }
      .faq-item[open] .faq-chev { transform: rotate(180deg); color: var(--green-dark); }
      .faq-a { padding: 0 18px 18px; border-top: 1px dashed var(--gray-200); }
      .faq-a p { margin: 14px 0 0; font-size: 14px; color: var(--gray-700); line-height: 1.6; }

      /* FOOTER */
      .tool-footer { padding: 48px 0 32px; text-align: center; border-top: 1px solid var(--gray-200); background: #fff; }
      .footer-brand { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); text-decoration: none; margin-bottom: 8px; }
      .footer-logo { height: 24px; width: auto; }
      .footer-tagline { font-size: 13px; color: var(--gray-400); margin-bottom: 16px; }
      .footer-disclaimer { font-size: 11px; color: var(--gray-400); line-height: 1.5; max-width: 600px; margin: 0 auto 12px; }
      .footer-affiliate { max-width: 560px; margin: 0 auto 10px; line-height: 1.5; font-size: 11px; }
      .footer-copyright { font-size: 12px; color: var(--gray-400); margin-bottom: 4px; }

      .dash-empty { padding: 24px 18px; text-align: center; color: var(--gray-400); font-size: 14px; background: #fff; border: 1px dashed var(--gray-200); border-radius: 16px; }

      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .pulse-dot, .hero-dot { animation: none; }
        .pick-card, .fact-card { transition: none; }
      }
    `;
  }
}

if (!customElements.get('kygo-supplements-by-metric')) {
  customElements.define('kygo-supplements-by-metric', KygoSupplementsByMetric);
}
