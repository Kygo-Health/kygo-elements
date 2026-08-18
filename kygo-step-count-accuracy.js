/**
 * Kygo Health · Step Count Accuracy by Wearable
 * Tag name: kygo-step-count-accuracy
 * How accurate is each wearable's step count against a research-grade reference?
 * Nine devices grouped into four evidence tiers, split by the axis that decides every
 * number: lab walking versus a normal day, and what your arms are doing while you walk.
 * Data: step-count-accuracy-tool-data.json + step_count_accuracy_reference.md
 * (Fuller 2020, Germini 2022, O'Driscoll 2024, Kim 2024, Kristiansson 2023, Choe & Kang 2025,
 * Feehan 2020, Roos 2020, Giurgiu 2023, Straczkiewicz 2023, Delobelle 2024, Henriksen 2022,
 * Modave 2017, Scataglini 2025, Oner 2022, Niela-Vilen 2022, Small 2024, Johnston 2021).
 */

/** Injects accessible text into light DOM so crawlers and AI tools can read component content */
if (typeof __seo === 'undefined') {
  var __seo = function (el, text) {
    if (el.querySelector('[data-seo]')) return;
    const d = document.createElement('div');
    d.setAttribute('data-seo', '');
    d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
    d.textContent = text;
    el.appendChild(d);
  };
}

class KygoStepCountAccuracy extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._selBrands = null; // Set of device keys chosen in the comparator
    this._wired = false;
  }

  connectedCallback() {
    if (!this._selBrands) {
      // Default comparison: the two best-validated wrist devices plus the ring that
      // shows the widest lab-versus-life gap in the whole dataset.
      this._selBrands = new Set(['garmin', 'apple', 'oura']);
    }
    this.render();
    this._setupAnimations();
    this._wire();
    this._injectStructuredData();
    __seo(this, this._seoText());
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Interactivity: one delegated listener on the shadow root so it survives
  //    the innerHTML swap of the comparator result region ────────────────────

  _wire() {
    if (this._wired) return;
    this._wired = true;
    this.shadowRoot.addEventListener('click', (e) => {
      const brand = e.target.closest('[data-brand-id]');
      if (brand) { this._toggleBrand(brand.getAttribute('data-brand-id')); }
    });
  }

  _toggleBrand(key) {
    const sel = this._selBrands;
    if (sel.has(key)) { if (sel.size > 2) sel.delete(key); }   // keep a minimum of 2
    else { if (sel.size < 3) sel.add(key); }                   // cap at 3 (table width)
    const root = this.shadowRoot;
    root.querySelectorAll('[data-brand-id]').forEach(c => {
      const on = sel.has(c.getAttribute('data-brand-id'));
      c.classList.toggle('active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const out = root.querySelector('[data-cmpr-out]');
    if (out) out.innerHTML = this._renderCmprResult();
  }

  // ── Brand product images (shared Wix assets, by device key) ───────────────

  _deviceImage(key) {
    return ({
      garmin:  'https://static.wixstatic.com/media/273a63_c545c093c04d4ca4ade77e5ca43fd433~mv2.png',
      apple:   'https://static.wixstatic.com/media/273a63_68b4900c356b4d0c8982e5ecd10f04fe~mv2.png',
      fitbit:  'https://static.wixstatic.com/media/273a63_c12bab319dc34737a386c7449f5f92c7~mv2.png',
      samsung: 'https://static.wixstatic.com/media/273a63_21fd42e4a5d1459bb6db751a0ea5e161~mv2.png',
      polar:   'https://static.wixstatic.com/media/273a63_e7e3c05ed0bc4cec8f456cd7f995e70b~mv2.png',
      oura:    'https://static.wixstatic.com/media/273a63_722e50e1a554453eb4c71a2e7a58925d~mv2.png',
      coros:   'https://static.wixstatic.com/media/273a63_b86aaa1f1b5b43a4a8ccc8294293e193~mv2.png',
      whoop:   'https://static.wixstatic.com/media/273a63_c52aaaca1f7243f3818cf51d9374dbd4~mv2.png',
      google:  'https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png' // Google Health logo, reused for the Pixel Watch
    })[key] || null;
  }

  _deviceLogo(d, size) {
    const img = this._deviceImage(d.key);
    const cls = size === 'sm' ? 'brand-img sm' : 'brand-img';
    return img
      ? `<span class="${cls}"><img src="${img}" alt="${d.name}" loading="lazy" /></span>`
      : `<span class="${cls} brand-img--icon">${this._typeIcon(d.type)}</span>`;
  }

  // ── Device data ───────────────────────────────────────────────────────────
  //    Grouped into four evidence tiers. Tier is about how much independent
  //    validation exists AND how the device behaves once you leave the lab,
  //    not a 1-to-9 ranking. labNum / freeNum are midpoints used only to
  //    highlight the better cell in the comparator.

  get _devices() {
    return [
      {
        key: 'garmin', name: 'Garmin', short: 'Garmin', chip: 'Garmin', type: 'watch', tier: 1,
        wear: 'Wrist',
        lab: '0.6 to 3.5%', labNum: 2.1, labNote: 'Fenix 6: 15% low',
        free: '10 to 17.8%', freeNum: 13.9,
        bias: 'Undercounts', phantom: 'Low', phantomRank: 1,
        evidence: 'Strong', evidenceRank: 3,
        independent: 'On a treadmill at 3.2 to 4.8 km/h the Vivosmart HR ran at 0.61 to 1.27% MAPE (Feehan 2020), and a Garmin validity review found acceptable error across natural lawn, gravel, asphalt, linoleum and ceramic tile. Free living is the weak spot: the Vivofit reached 17.8% MAPE worn at home. A 2025 hand-tally study cuts the other way: over a mixed lab protocol the Fenix 6 counted 1,037 steps against a criterion of 1,220, about 15% low and significantly different from the tally (Rider 2025). The gap there is driven by the activities-of-daily-living block rather than by walking, and in the same study\'s field trial the Fenix 6 was equivalent to criterion.',
        vendorClaim: 'Garmin publishes no step accuracy figure. Its manuals only give handling advice: wear the watch on your non-dominant wrist, carry it in your pocket when pushing a stroller or lawn mower, and note that the watch "may interpret some repetitive motions, such as washing dishes, folding laundry, or clapping your hands, as steps".',
        method: 'Threshold peak detection on a 3-axis accelerometer. Garmin behaves as though it applies a minimum-bout filter, and it draws the fewest phantom-step complaints of the wrist brands, but the specific "10 steps, then credited retroactively" mechanic often quoted for it is undocumented. It traces to a user post on Garmin\'s community forum, not to Garmin.',
        bestFor: 'Daily step totals, runners, and walking on mixed outdoor surfaces.',
        weakestFor: 'Mixed activities of daily living, walking below 1.6 km/h, and holding a treadmill handrail.',
        affiliateUrl: 'https://www.amazon.com/s?k=garmin%20fitness%20tracker&tag=kygohealthapp-20', trackLabel: 'garmin-search'
      },
      {
        key: 'apple', name: 'Apple Watch', short: 'Apple Watch', chip: 'Apple', type: 'watch', tier: 1,
        wear: 'Wrist',
        lab: '0.9 to 3.4%', labNum: 2.15,
        free: '6.4 to 10%', freeNum: 8.2,
        bias: 'Slight undercount', phantom: 'Low', phantomRank: 1,
        evidence: 'Strong', evidenceRank: 3,
        independent: 'Against an ActivPAL thigh sensor over a full 24 hours the Series 6 hit 6.4% MAPE with r=0.99, the tightest free-living agreement of any device in that study (Kim 2024). It is not uniform: light-intensity or slow walking pushed error to 23.9%, and adults 40 and over averaged 10.9% MAPE against 4.3% for under 40 (Choe & Kang 2025).',
        vendorClaim: 'Apple publishes no step accuracy figure and describes step counts as an estimate derived from motion data.',
        method: 'Machine-learning peak detection through Core Motion on an always-on motion coprocessor, with GPS-calibrated stride length and arm-rotation data on models with a gyroscope.',
        bestFor: 'Consistency across walking speeds, all-day wear, and free-living daily totals.',
        weakestFor: 'Slow or light-intensity walking, and older adults with a shorter, less rhythmic gait.',
        affiliateUrl: 'https://www.amazon.com/s?k=Apple%20Watch&rh=p_123%3A110955&tag=kygohealthapp-20', trackLabel: 'apple-watch-search'
      },
      {
        key: 'fitbit', name: 'Fitbit', short: 'Fitbit', chip: 'Fitbit', type: 'watch', tier: 2,
        wear: 'Wrist',
        lab: '3.6 to 8%', labNum: 5.8,
        free: '17.1 to 35.5%', freeNum: 26.3,
        bias: 'Mixed by model', phantom: 'Moderate', phantomRank: 2,
        evidence: 'Strong', evidenceRank: 3,
        independent: 'The most-studied brand by a distance: 144 Fitbit studies in one umbrella review alone (Fuller 2020), and a systematic review of 20 step studies put Charge and Charge HR error under 25% (Germini 2022). At the accurate end, the Inspire 2 hit 3.6% MAPE with an ICC of 0.91 over 30 treadmill minutes at 5.5 km/h against a manual count (Cheung 2025), and clinical validation of the Charge 2 found a 3.4% difference against a research-grade reference (Straczkiewicz 2023). At the other end, the same family reached 17.1 to 35.5% MAPE over 24 hours of real life (Giurgiu 2023) and the Sense overcounted by 18.0% in free living against an ActiGraph (Miwa 2026). Bout detection held up well, sensitivity above 87% and specificity above 97%, except above 120 steps per minute in older adults (Delobelle 2024).',
        vendorClaim: 'Fitbit publishes no step accuracy percentage. Its marketing leans on the volume of published research rather than a headline error figure.',
        method: 'Tri-axial MEMS peak detection with a machine-learning layer that has been reworked since the Google acquisition. Where ankle placement is supported it is far more accurate than the wrist.',
        bestFor: 'General fitness tracking, and the deepest published evidence base of any brand.',
        weakestFor: 'Free-living totals, and consistency between models. "Fitbit is accurate" means nothing without a model number.',
        affiliateUrl: 'https://www.amazon.com/s?k=Fitbit%3A&rh=p_123%3A213215&tag=kygohealthapp-20', trackLabel: 'fitbit-search'
      },
      {
        key: 'coros', name: 'COROS', short: 'COROS', chip: 'COROS', type: 'watch', tier: 2,
        wear: 'Wrist',
        lab: 'Within 10%, best of 4', labNum: null,
        free: 'Equivalent in the field', freeNum: null,
        bias: 'Slight undercount', phantom: 'Low', phantomRank: 1,
        evidence: 'Moderate', evidenceRank: 2,
        independent: 'The quiet winner of the only recent hand-tally head-to-head. Against a manual count, the Vertix 2 was the sole device of four statistically equivalent to within 10% of criterion for walking at 4.8 km/h, jogging at 8.0 km/h, combined treadmill steps and overall lab steps, while the Garmin Fenix 6 and Polar Grit X both differed significantly (Rider 2025). In the field trial all four devices were equivalent to criterion, so the separation comes from the mixed lab protocol, not from walking. Caveat: this is one study with 12 participants, and the per-device MAPE and Bland-Altman tables sit in a paywalled supplement we have not read.',
        vendorClaim: 'COROS makes no published step accuracy claim.',
        method: 'Peak detection with a continuous-motion filter, plus a barometric altimeter for elevation.',
        bestFor: 'Mixed lab-style activity, running cadence and long battery life.',
        weakestFor: 'Being sure. One small study is real evidence, but it is not the depth Fitbit, Garmin or Apple carry.',
        affiliateUrl: 'https://www.amazon.com/s?k=COROS%20fitness%20tracker&rh=p_123%3A337787&tag=kygohealthapp-20', trackLabel: 'coros-search'
      },
      {
        key: 'samsung', name: 'Samsung Galaxy Watch', short: 'Galaxy Watch', chip: 'Samsung', type: 'watch', tier: 3,
        wear: 'Wrist',
        lab: 'One test only', labNum: null,
        free: 'Not published', freeNum: null,
        bias: 'Overcounts', phantom: 'High', phantomRank: 3,
        evidence: 'Thin', evidenceRank: 1,
        independent: 'One 24-hour free-living study put the Galaxy Watch 4 at r=0.82 against an ActivPAL, well below the Apple Watch at r=0.99 in the same protocol (Kim 2024). No peer-reviewed MAPE has been published for any current Galaxy Watch.',
        vendorClaim: 'Samsung publishes no step accuracy figure. The BioActive sensor is marketed on breadth of measurement, not on step error.',
        method: 'Accelerometer plus gyroscope through Samsung Health, which can also fuse phone and watch step data, a documented source of discrepancies.',
        bestFor: 'Android integration and general smartwatch use.',
        weakestFor: 'Desk work, driving and stationary cycling, where inflated counts are consistently reported.',
        affiliateUrl: 'https://www.amazon.com/s?k=samsung%20galaxy%20watch&rh=p_72%3A1248879011&tag=kygohealthapp-20', trackLabel: 'samsung-watch-search'
      },
      {
        key: 'polar', name: 'Polar', short: 'Polar', chip: 'Polar', type: 'watch', tier: 3,
        wear: 'Wrist',
        lab: '17% low (Grit X)', labNum: 17,
        free: 'Contested', freeNum: null,
        bias: 'Contested', phantom: 'Moderate', phantomRank: 2,
        evidence: 'Thin', evidenceRank: 1,
        independent: 'The direction is genuinely unresolved, which is worse than being wrong in a known direction. The A360 was judged not valid for any walking condition tested (Roos 2020). Against a hand tally the Grit X counted 1,012 steps versus a criterion of 1,220, about 17% LOW and significantly different (Rider 2025). Henriksen 2022 found the opposite in free living, overreporting on Bland-Altman. The widely quoted "+3.8%" is not an accuracy figure at all: it comes from a magazine test that compared a Vantage M3 against two phones, with no criterion measure, and whose author said outright that determining accuracy is tricky without knowing the true step count.',
        vendorClaim: 'Polar positions its watches on heart rate and training load and makes no step accuracy claim.',
        method: 'Proprietary peak detection on a wrist accelerometer.',
        bestFor: 'Heart rate and training load. Steps are a secondary metric on these watches.',
        weakestFor: 'Any use where the step total itself is the thing you care about, in either direction.',
        affiliateUrl: 'https://www.amazon.com/s?k=Polar%20fitness%20tracker&rh=p_123%3A255287&tag=kygohealthapp-20', trackLabel: 'polar-search'
      },
      {
        key: 'oura', name: 'Oura Ring', short: 'Oura Ring', chip: 'Oura', type: 'ring', tier: 3,
        wear: 'Finger',
        lab: 'No lab step data', labNum: null, labNote: 'lab phase measured calories',
        free: '50.3% (+2,124 a day)', freeNum: 50.3,
        bias: 'Overcounts', phantom: 'Very high', phantomRank: 4,
        evidence: 'Moderate', evidenceRank: 2,
        independent: 'The worst measured free-living result on this page, and there is no lab figure to soften it. Over 14 days the Gen 2 (firmware 4.0.4) ran at 50.3% MAPE against a pedometer, averaging +2,124 steps a day, with 95% limits of agreement from -6,217 to +10,466: on any given day the ring could be six thousand steps low or ten thousand high (Kristiansson 2023, corrected version). There is no laboratory step row in that paper. Steps were validated in free living only; the lab phase measured energy expenditure against indirect calorimetry, where the combined-activity MAPE was 21.1%. Any "Oura is under 10% in the lab" claim, including the one this page used to make, is an energy-expenditure number misread as a step number.',
        vendorClaim: 'Oura says its March 2025 "Real Steps" algorithm better separates walking from hand movement, and reported counts fell about 20%. No independent validation of that algorithm has been published.',
        method: 'A machine-learning step classifier running on a finger-worn accelerometer.',
        bestFor: 'Sleep, HRV and recovery, which is what this ring is genuinely good at.',
        weakestFor: 'Steps. Cooking, chopping, typing and talking with your hands all read as walking.',
        affiliateUrl: 'https://www.amazon.com/s?k=Oura%20Ring&tag=kygohealthapp-20', trackLabel: 'oura-ring-search'
      },
      {
        key: 'google', name: 'Google Pixel Watch', short: 'Pixel Watch', chip: 'Pixel', type: 'watch', tier: 4,
        wear: 'Wrist',
        lab: 'Not published', labNum: null,
        free: 'Not published', freeNum: null,
        bias: 'Overcounted after update', phantom: 'High', phantomRank: 3,
        evidence: 'None', evidenceRank: 0,
        independent: 'Zero peer-reviewed step validation. What is documented instead is instability, twice. The Wear OS 5.1 "enhanced step algorithm" of March 2025, meant to catch stroller, cart, hiking-pole and wheelchair walking, inflated counts across every Pixel Watch model, including logging steps while the watch was off the wrist, and was reverted in April 2025 with build BP1A.250305.019.W8. A second inflation regression hit around 20 to 24 March 2026. Google fixed it but confirmed that historical data would not be corrected, so that window of step history is permanently wrong.',
        vendorClaim: 'Google shipped the enhanced algorithm as an improvement and withdrew it a month later, then repeated the pattern a year on. No accuracy figure has been published for any version.',
        method: 'Wear OS step detection through Fitbit Health Services, on an accelerometer plus gyroscope.',
        bestFor: 'Google and Fitbit ecosystem integration.',
        weakestFor: 'Trusting a historical total. Two inflation regressions in twelve months, and the 2026 one was never backfilled.',
        affiliateUrl: null, trackLabel: null
      },
      {
        key: 'whoop', name: 'WHOOP', short: 'WHOOP', chip: 'WHOOP', type: 'strap', tier: 4,
        wear: 'Wrist, bicep or body',
        lab: 'Not published', labNum: null,
        free: 'Not published', freeNum: null,
        bias: 'Unknown', phantom: 'Unknown', phantomRank: null,
        evidence: 'None', evidenceRank: 0,
        independent: 'Step counting arrived in an October 2024 firmware update. As of 2026 there is no peer-reviewed validation of WHOOP step counts at all, so nothing here is a measurement, it is an absence.',
        vendorClaim: 'WHOOP says steps are "validated for on-wrist use" but has published no peer-reviewed step study to support it.',
        method: 'Accelerometer cadence detection plus gyroscope rotation data, added by firmware in October 2024.',
        bestFor: 'Strain and recovery, which is what the band is built around.',
        weakestFor: 'Steps, which WHOOP itself treats as supplementary to Strain.',
        affiliateUrl: 'https://www.amazon.com/s?k=whoop%20fitness%20tracker&tag=kygohealthapp-20', trackLabel: 'whoop-search'
      }
    ];
  }

  // ── Walking speed ladder (the single biggest factor) ──────────────────────

  get _speeds() {
    return [
      { name: 'Jogging or running', sub: 'over 1.8 m/s', pct: 97, val: '95 to 99%', note: 'The highest cadence produces the clearest signal of anything you do all day.' },
      { name: 'Brisk walking', sub: '1.3 to 1.8 m/s', pct: 95, val: 'over 95%', note: 'The sweet spot for a wrist device, and where most validation studies are run.' },
      { name: 'Normal walking', sub: '0.9 to 1.3 m/s', pct: 91, val: 'over 90%', note: 'Every device on this page is acceptable here. This is the floor of the good zone.' },
      { name: 'Slow walking', sub: '0.5 to 0.9 m/s', pct: 65, val: '50 to 80%', note: 'Older adults, clinical and post-surgical populations spend most of their day here.' },
      { name: 'Shuffling', sub: 'under 0.5 m/s', pct: 45, val: 'under 50%', note: 'Most of your steps are simply never recorded, on every brand at every price.' }
    ];
  }

  // ── Wear position ladder ──────────────────────────────────────────────────

  get _placements() {
    return [
      { name: 'Hip or waist', sub: 'research-grade placement', pct: 97, err: '0.4 to 5% off', note: 'The reference standard in the literature, and inconvenient enough that real people stop wearing it.' },
      { name: 'Ankle or foot', sub: 'closest to the actual footfall', pct: 95, err: '2 to 6% off', note: 'The best option for slow walkers and clinical use. Very few consumer products support it.' },
      { name: 'Wrist', sub: 'what almost everyone wears', pct: 82, err: '5 to 25% off', note: 'Reads arm swing as a proxy for walking, which is why it both overcounts and undercounts.' },
      { name: 'Finger', sub: 'smart rings', pct: 58, err: '10 to 50%+ off', note: 'Hand gestures look like walking. Excellent for sleep and HRV, poor for steps.' }
    ];
  }

  // ── What no brand can fix ─────────────────────────────────────────────────

  get _facts() {
    return [
      { icon: 'gauge', tone: 'dark', tag: 'Walking speed', title: 'Below 0.9 m/s, everything fails',
        body: 'This is the single most important number on the page and it applies to every brand at every price. Above about 0.9 m/s all the devices here are usable. Below it accuracy collapses, and under 0.5 m/s even the best miss most of your steps. Anyone recovering from surgery, using a walker or cane, or simply walking slowly is nowhere near the conditions the published figures were measured in.',
        src: 'Roos 2020 · Feehan 2020 · Johnston 2021' },
      { icon: 'user', tone: 'mid', tag: 'Gait pathology', title: 'Clinical gait is a different problem',
        body: 'Step algorithms are trained on healthy walking. In people with neurological conditions such as stroke or Parkinson\'s, they detect only 11 to 47% of steps. Consumer wearables are not validated for clinical populations, and using one to track rehabilitation progress will understate it, sometimes by more than half.',
        src: 'Sensors 2025 · Johnston 2021' },
      { icon: 'walker', tone: 'dark', tag: 'Mobility aids', title: 'A rolling walker costs you a third of your steps',
        body: 'The condition nobody tests for, and the largest single error on this page. Across 42 community-dwelling adults aged 51 to 80, walking on a treadmill with a rolling walker, an Apple Watch Series 8 undercounted by 36.4% against a manual count. Slow walking at 1.61 km/h cost another 16.3%. Arm length correlated weakly with the error, which is the giveaway: the watch is reading an arm that is now resting on a frame. A waist-mounted monitor was more consistent, but it too underestimated notably at the lowest speed, so moving the sensor mitigates this rather than solving it. The authors conclude wrist monitors may be unsuitable for older adults using assistive devices.',
        src: 'Özel 2026 (N=42, manual reference, 4 conditions x 3 speeds)' },
      { icon: 'clock', tone: 'mid', tag: 'Age and gait', title: 'Your gait changes the number',
        body: 'Apple Watch averaged 4.3% MAPE under 40 and 10.9% at 40 and over. Fitbit sensitivity drops above 120 steps per minute in older adults. Age is not the mechanism: shorter steps, slower speed and reduced arm swing are, which is why body composition shows the same indirect effect through gait rather than through BMI itself.',
        src: 'Choe & Kang 2025 · Delobelle 2024 · Modave 2017 · Scataglini 2025' }
    ];
  }

  // ── Marketing and headline claims vs what the record shows ────────────────

  get _claims() {
    return [
      { brand: 'The "82.6% accurate" ranking', good: false,
        claim: 'Garmin 82.6%, Apple Watch 81.1%, Fitbit 77.3% overall step accuracy.',
        reality: 'These three numbers are quoted everywhere, including in the first version of this page. They come from a <strong>consumer data aggregation</strong> (WellnessPulse 2025), not from a peer-reviewed study, and no published paper reports an "overall accuracy percentage" for a step counter. The peer-reviewed measure is MAPE, and it is always reported per model and per condition. Treat the ranking as a rough sentiment, not a result.',
        src: 'WellnessPulse 2025 (consumer aggregate, not peer reviewed)' },
      { brand: 'Oura: "Real Steps"', good: false,
        claim: 'A new machine-learning algorithm better distinguishes walking from hand movement.',
        reality: 'Plausible, and reported counts did fall about 20% after the March 2025 rollout. But <strong>a lower number is not a validated number</strong>. The +2,124 steps a day finding comes from peer-reviewed free-living work on the Gen 3; no independent study has yet tested whether Real Steps closed that gap or overshot it.',
        src: 'Oura Health 2025 (manufacturer) vs Kristiansson 2023' },
      { brand: 'WHOOP: "validated for on-wrist use"', good: false,
        claim: 'Step counting is validated for wearing the band on the wrist.',
        reality: 'WHOOP has published <strong>no peer-reviewed step validation of any kind</strong>. The hardware, an accelerometer plus gyroscope, is capable in principle, and steps arrived in an October 2024 firmware update. Until a study exists, "validated" here means internal testing that nobody outside WHOOP has seen.',
        src: 'WHOOP product documentation (manufacturer)' },
      { brand: 'Google: the enhanced step algorithm', good: false,
        claim: 'Wear OS 5.1 improves step detection for strollers, carts and hiking poles.',
        reality: 'It shipped in March 2025, inflated counts across every Pixel Watch model, and was <strong>reverted in April 2025</strong>. This is the clearest example on the page of why a step history is not a stable measurement: the same watch on the same wrist counted differently in March, April and May.',
        src: 'Google Wear OS release notes (manufacturer)' },
      { brand: 'Polar: "overreports by 3.8%"', good: false,
        claim: 'The Vantage M3 logged 10,479 steps against 10,102 and 10,142 on two phones.',
        reality: 'Quoted as an accuracy figure across the web, including on an earlier version of this page. <strong>There is no criterion measure in it</strong>: a phone in your pocket is not ground truth, and the author of the test says outright that determining accuracy is tricky without knowing the true step count. The only hand-tally study of a Polar has the Grit X about <strong>17% low</strong>, the opposite direction, while Henriksen 2022 found overreporting in free living. The honest answer is that Polar is contested, not that it overreports.',
        src: 'TechRadar (no criterion) vs Rider 2025 and Henriksen 2022' },
      { brand: 'Garmin: "a 10-step minimum bout filter"', good: false,
        claim: 'Garmin records nothing until 10 consecutive steps, then credits all 10 retroactively.',
        reality: 'We could not find this in any Garmin manual or support document, including the current Venu 4 and the older vivofit manuals. It traces to a <strong>user post on Garmin\'s community forum</strong> from around 2015, which cites nothing. The behaviour it describes is real enough, Garmin does draw the fewest phantom-step complaints of the wrist brands, but the mechanism is folklore. Garmin\'s own text says only that the watch "may interpret some repetitive motions, such as washing dishes, folding laundry, or clapping your hands, as steps".',
        src: 'Garmin Venu 4 Owner\'s Manual, "My step count does not seem accurate"' },
      { brand: 'Fitbit: "the most studied tracker"', good: true,
        claim: 'More published validation research than any other brand.',
        reality: 'This one is <strong>true, and it is the reason Fitbit looks worse than rivals in places</strong>. 144 Fitbit studies against 42 for Garmin and 28 for Apple means the bad conditions have actually been measured. A brand with no free-living data does not have better free-living accuracy, it has no free-living data.',
        src: 'Fuller 2020 (umbrella review)' }
    ];
  }

  // ── Sources (compact link list, every one shown) ───────────────────────────
  //    url: null means no permanent identifier exists for that source. It is
  //    still listed, as a non-clickable card, rather than hidden or invented.

  get _sources() {
    return [
      { tag: 'Independent · umbrella review', title: 'Fuller et al. 2020: 144 Fitbit, 42 Garmin and 28 Apple studies',
        cite: 'JMIR mHealth uHealth. 2020;8(9):e18694.', url: 'https://mhealth.jmir.org/2020/9/e18694/' },
      { tag: 'Independent · umbrella review', title: 'O\'Driscoll et al. 2024: 24 systematic reviews of consumer wearables',
        cite: 'Sports Med. 2024. 249 studies, 430,465 participants.', url: 'https://doi.org/10.1007/s40279-024-02077-2' },
      { tag: 'Independent · 12 trackers', title: 'Roos et al. 2020: 12 consumer wrist trackers validated for steps',
        cite: 'Int J Environ Res Public Health. 2020;17(20):7123.', url: 'https://doi.org/10.3390/ijerph17207123' },
      { tag: 'Independent · 24h free-living', title: 'Kim et al. 2024: Apple Watch and Galaxy Watch vs ActivPAL',
        cite: 'Sensors. 2024;24(14):4658. N=104, 24-hour criterion.', url: 'https://doi.org/10.3390/s24144658' },
      { tag: 'Independent · Oura', title: 'Kristiansson et al. 2023: Oura Gen 2 over 14 days of free living',
        cite: 'BMC Med Res Methodol. 2023;23:50. Steps 50.3% MAPE. Use the corrected Table 2 values.', url: 'https://doi.org/10.1186/s12874-023-01868-x' },
      { tag: 'Independent · correction', title: 'BMC correction to Kristiansson 2023, issued 9 Sept 2023',
        cite: 'Revises the Table 2 MAPE values. Cite the corrected paper, not the original.', url: 'https://doi.org/10.1186/s12874-023-02029-w' },
      { tag: 'Independent · age meta', title: 'Choe & Kang 2025: Apple Watch step accuracy by age',
        cite: 'Physiol Meas. 2025. 56 studies, 270 effect sizes.', url: 'https://doi.org/10.1088/1361-6579/adca82' },
      { tag: 'Independent · Apple meta', title: 'Living systematic review 2026: Apple Watch measurements',
        cite: 'npj Digit Med. 82 studies, 430,052 participants.', url: 'https://www.nature.com/articles/s41746-025-02238-1' },
      { tag: 'Independent · Garmin', title: 'Garmin validity review 2020: steps across five walking surfaces',
        cite: 'Int J Environ Res Public Health. 2020;17(13):4269.', url: 'https://doi.org/10.3390/ijerph17134269' },
      { tag: 'Independent · Fitbit review', title: 'Feehan et al. 2020: accuracy of Fitbit devices, systematic review',
        cite: 'PeerJ. 2020;8:e9381.', url: 'https://doi.org/10.7717/peerj.9381' },
      { tag: 'Independent · Fitbit review', title: 'Germini et al. 2022: Fitbit step accuracy across 20 studies',
        cite: 'J Med Internet Res. 2022;24(1):e30791.', url: 'https://doi.org/10.2196/30791' },
      { tag: 'Independent · free-living', title: 'Giurgiu et al. 2023: Fitbit across 24 hours of real life',
        cite: 'Technologies. 2023;11(1):29. MAPE 17.1 to 35.5%.', url: 'https://doi.org/10.3390/technologies11010029' },
      { tag: 'Independent · clinical', title: 'Straczkiewicz et al. 2023: Fitbit Charge 2 clinical validation',
        cite: 'JMIR Cancer. 2023;9:e47646. 3.4% difference.', url: 'https://doi.org/10.2196/47646' },
      { tag: 'Independent · bout detection', title: 'Delobelle et al. 2024: Fitbit bout-level step detection',
        cite: 'Digit Health. 2024;10. Sensitivity >87%, specificity >97%.', url: 'https://doi.org/10.1177/20552076241262710' },
      { tag: 'Independent · Polar', title: 'Henriksen et al. 2022: Polar Vantage step counts in free living',
        cite: 'JMIR Form Res. 2022;6(5):e27248. Overreporting on Bland-Altman.', url: 'https://formative.jmir.org/2022/5/e27248' },
      { tag: 'Independent · hand tally', title: 'Rider et al. 2025: COROS, Garmin, Polar and Suunto vs a hand tally',
        cite: 'J Meas Phys Behav. 2025;8(1). N=12, lab and field. COROS the only device equivalent within 10%.', url: 'https://doi.org/10.1123/jmpb.2025-0012' },
      { tag: 'Independent · assistive devices', title: 'Özel et al. 2026: step counting with a walker, cane and crutches',
        cite: 'PeerJ. 2026;14:e20690. N=42 aged 51 to 80. Apple Watch -36.4% with a rolling walker.', url: 'https://doi.org/10.7717/peerj.20690' },
      { tag: 'Independent · derived metrics', title: 'Miwa et al. 2026: steps vs active minutes vs energy expenditure',
        cite: 'PLOS ONE. Free living vs ActiGraph GT9X. Funded by Chugai Pharmaceutical; all authors are employees and shareholders.', url: 'https://doi.org/10.1371/journal.pone.0342543' },
      { tag: 'Independent · Fitbit', title: 'Cheung et al. 2025: Fitbit Inspire 2 on a treadmill',
        cite: 'N=30, 30 min at 5.5 km/h, manual criterion. MAPE 3.6%, ICC 0.91.', url: 'https://doi.org/10.1177/22130683251337300' },
      { tag: 'Independent · head to head', title: 'Scientific Reports 2024: Garmin Vivoactive 4 vs Fitbit Sense',
        cite: 'Sci Rep. 2024;14. Exercise-condition step error.', url: 'https://doi.org/10.1038/s41598-024-74140-x' },
      { tag: 'Independent · wear position', title: 'Oner et al. 2022: step counting by body placement',
        cite: 'Sensors. 2022;22(11):3989.', url: 'https://doi.org/10.3390/s22113989' },
      { tag: 'Independent · free-living', title: 'Niela-Vilen et al. 2022: consumer tracker step validity',
        cite: 'Sensors. 2022;22(7):2585.', url: 'https://doi.org/10.3390/s22072585' },
      { tag: 'Independent · large cohort', title: 'Small et al. 2024: step counting in a large free-living cohort',
        cite: 'Nat Med. 2024.', url: 'https://doi.org/10.1038/s41591-024-03243-w' },
      { tag: 'Independent · demographics', title: 'Modave et al. 2017: age, BMI and dominant hand effects',
        cite: 'JMIR mHealth uHealth. 2017;5(6):e88.', url: 'https://doi.org/10.2196/mhealth.7870' },
      { tag: 'Independent · gait meta', title: 'Scataglini et al. 2025: how obesity changes gait',
        cite: 'Int J Obes. 2025;49(4):541.', url: 'https://doi.org/10.1038/s41366-024-01659-4' },
      { tag: 'Independent · method standard', title: 'Johnston et al. 2021: INTERLIVE expert statement on step count validity',
        cite: 'Br J Sports Med. 2021;55(14):780.', url: 'https://bjsm.bmj.com/content/55/14/780' },
      { tag: 'Independent · clinical gait', title: 'Sensors 2025: step detection in neurological conditions',
        cite: 'Only 11 to 47% of steps detected. No permanent identifier recorded in our research file.', url: null },
      { tag: 'Independent · smart rings', title: 'Gong & Bang 2025: systematic review of 107 smart ring studies',
        cite: 'Oura in 72% of them. Almost none examined step accuracy. No permanent identifier recorded.', url: null },
      { tag: 'Manufacturer', title: 'Oura Health 2025: the "Real Steps" algorithm update',
        cite: 'March 2025. Reported step counts fell about 20%. Vendor blog post, no study.', url: null },
      { tag: 'Manufacturer', title: 'Google 2025 and 2026: two Wear OS step-algorithm regressions',
        cite: 'Wear OS 5.1 shipped March 2025, reverted April 2025 (build BP1A.250305.019.W8). Second inflation bug 20 to 24 March 2026, fixed, history not corrected. Android Central 21 Apr 2025; 9to5Google 24 Mar 2026.', url: null },
      { tag: 'Manufacturer', title: 'Garmin Venu 4 Owner\'s Manual: "My step count does not seem accurate"',
        cite: 'The only Garmin text on the subject. Gives handling advice, and states no minimum-bout mechanic.', url: null },
      { tag: 'Consumer test', title: 'Android Central 2023 and December 2025: multi-watch walk and jog tests',
        cite: 'Source of the pocket-carry and 10,000-step figures quoted here. Not peer reviewed.', url: null },
      { tag: 'Consumer test · no criterion', title: 'TechRadar: Polar Vantage M3 step test',
        cite: 'Source of the "+3.8%" often quoted for Polar. Compared against two phones, with no criterion measure, so it is not an accuracy figure.', url: null },
      { tag: 'Consumer aggregate', title: 'WellnessPulse and AIM7 2025: aggregated accuracy percentages',
        cite: 'Source of the widely repeated 82.6% / 81.1% / 77.3% figures. Not peer reviewed.', url: null }
    ];
  }

  // ── FAQ (also emitted as FAQPage JSON-LD) ─────────────────────────────────

  get _faqs() {
    return [
      { q: 'Which wearable has the most accurate step count?',
        a: 'Garmin and Apple Watch are the best-validated pair, and in a lab both land between roughly 0.6 and 3.5% error. The one recent head-to-head against a hand tally actually went to COROS: the Vertix 2 was the only device of four statistically equivalent to within 10% of the criterion, while the Garmin Fenix 6 and Polar Grit X both came in significantly low (Rider 2025, n=12). We group devices into evidence tiers rather than crowning a single winner, because the published figures come from different models, studies and protocols, so a gap of one or two percentage points between brands is not meaningful. What is meaningful is the gap between a lab and a normal day: the same Garmin family runs at about 1% on a treadmill and up to 17.8% worn at home.' },
      { q: 'How accurate is the Apple Watch step counter?',
        a: 'Better than most, and very consistent. Over a full 24 hours against an ActivPAL thigh sensor the Series 6 hit 6.4% MAPE with r=0.99, the tightest free-living agreement in that study. Two caveats: light-intensity or slow walking pushed error to 23.9%, and adults 40 and over averaged 10.9% MAPE against 4.3% for under 40. The age effect is really a gait effect, shorter steps and less arm swing.' },
      { q: 'Is the Oura Ring accurate for step counting?',
        a: 'No, and it is the worst measured result on this page. Over 14 days of normal living the Gen 2 ran at 50.3% MAPE against a pedometer, averaging 2,124 extra steps a day, with 95% limits of agreement from 6,217 steps low to 10,466 high. There is no laboratory step figure to set against that: the study validated steps in free living only, and its lab phase measured energy expenditure, not steps. If you have seen "Oura is under 10% accurate in the lab", including on an earlier version of this page, that is an energy-expenditure number misread as a step number. The mechanism is simple: a finger-worn sensor sees hand movement, so cooking, chopping, typing and talking with your hands all register as walking. Oura shipped a "Real Steps" algorithm in March 2025 that cut reported counts about 20%, but no independent study has tested it. Use the ring for sleep and HRV.' },
      { q: 'What is the biggest factor affecting step count accuracy?',
        a: 'Walking speed, by a distance. Above about 0.9 m/s every device here is usable. Below it accuracy collapses on all of them, and under 0.5 m/s even the best miss most of your steps. This matters because published accuracy figures are almost always measured at normal or brisk walking speeds, while older adults, post-surgical patients and anyone using a walker or cane routinely walk slower than that.' },
      { q: 'Does Garmin overcount or undercount steps?',
        a: 'It undercounts, mostly at slow speeds, on treadmills and across mixed daily activity. In free living, error runs from about 10 to 17.8% depending on the model, and one hand-tally study had the Fenix 6 about 15% low over a mixed lab protocol. Garmin also draws the fewest phantom-step complaints of the wrist brands, and it behaves as though it waits for a run of steps before recording any. Be careful with the popular explanation for that: the specific "10-step minimum bout, then credited retroactively" mechanic is not in any Garmin manual or support document we can find. It traces to a user post on Garmin\'s own community forum. Garmin\'s manuals say only that the watch may read repetitive motions such as washing dishes, folding laundry or clapping as steps.' },
      { q: 'How does WHOOP count steps?',
        a: 'Through an accelerometer cadence detector plus gyroscope rotation data, added in an October 2024 firmware update. There is no peer-reviewed validation of WHOOP step counting at all, so the honest answer about its accuracy is that nobody outside WHOOP knows. WHOOP itself treats steps as supplementary to Strain, its cardiovascular load metric.' },
      { q: 'Why does my wearable count steps when I am driving or sitting?',
        a: 'Because a wrist device does not detect footfalls, it detects arm motion that looks like walking. Road vibration while driving, desk work, brushing your teeth, chopping vegetables and talking with your hands can all match the cadence pattern the algorithm is watching for. Garmin says as much in its own manuals. Samsung and Oura draw the most phantom-step reports; Garmin draws the fewest.' },
      { q: 'Are step counters accurate if I use a walker, cane or stroller?',
        a: 'No, and this is the largest single error anywhere on this page. With a rolling walker on a treadmill, an Apple Watch Series 8 undercounted by 36.4% against a manual count across 42 adults aged 51 to 80, and slow walking at 1.61 km/h cost a further 16.3%. The reason is mechanical: your arm is resting on the frame rather than swinging, so the watch has nothing to read. Pushing a pram or a shopping trolley does the same thing. A waist-worn monitor holds up better but still underestimates at very slow speeds, so moving the sensor helps rather than fixes it. The study authors conclude wrist monitors may be unsuitable for older adults using assistive devices.' },
      { q: 'If my step count is accurate, are my calories accurate too?',
        a: 'No, and the gap is much bigger than most people expect. In one free-living study against a research-grade ActiGraph, an Apple Watch Series 6 read steps within about 2%, undercounted moderate-to-vigorous activity by 46%, and overcounted energy expenditure by 26%, all from the same sensor over the same days. Steps are the easiest thing a wearable measures because a footfall is a discrete event you can count. Active minutes and calories are inferred from intensity, and the inference is where the error compounds. Treat a good step number as evidence about steps and nothing else.' },
      { q: 'Where is the most accurate place to wear a step counter?',
        a: 'The hip or waist is the research-grade placement, at roughly 0.4 to 5% error, with the ankle close behind at 2 to 6% and better than anything else for slow walkers. The wrist, where almost everyone actually wears one, runs 5 to 25%. A finger ring is last at 10 to 50% or more. Wrist and hip totals can differ by about 30% in young adults and close to 50% in older adults, so the placement matters more than which brand you buy.' }
    ];
  }

  // ── SEO light-DOM summary ─────────────────────────────────────────────────

  _seoText() {
    return 'Step Count Accuracy by Wearable, a free tool from Kygo Health. Which wearable counts steps most accurately, and how accurate is your step count really? Nine devices compared on lab error, free-living error, bias direction, phantom-step risk and how much independent validation actually exists: Garmin, Apple Watch, Fitbit, COROS, Samsung Galaxy Watch, Polar, Oura Ring, Google Pixel Watch and WHOOP. THE RESULT IS FOUR EVIDENCE TIERS, NOT A ONE-TO-NINE RANKING, because the published figures come from different models, protocols and reference standards. Tier 1, validated and accurate: Garmin (lab MAPE 0.6 to 3.5%, free-living 10 to 17.8%, undercounts, fewest phantom-step complaints) and Apple Watch (lab MAPE 0.9 to 3.4%, free-living 6.4 to 10%, r=0.99 against an ActivPAL over 24 hours in Kim 2024). Tier 2, validated with caveats: Fitbit (Inspire 2 at 3.6% MAPE and ICC 0.91 against a manual count in Cheung 2025, Charge 2 within 3.4% of a research reference, yet 17.1 to 35.5% over 24 hours of real life and the Sense 18.0% high in free living) and COROS (in the one recent hand-tally head-to-head the Vertix 2 was the only device of four statistically equivalent to within 10% of criterion, beating the Garmin Fenix 6 and Polar Grit X; Rider 2025, n=12). Tier 3, thin evidence or a known bias: Samsung Galaxy Watch (r=0.82 versus ActivPAL, overcounts, no published MAPE for a current model), Polar (CONTESTED: the Grit X measured about 17% LOW against a hand tally in Rider 2025, while Henriksen 2022 found overreporting in free living), and Oura Ring (50.3% MAPE and plus 2,124 steps a day over 14 days of free living, limits of agreement minus 6,217 to plus 10,466; Kristiansson 2023, corrected version). Tier 4, no published step validation at all: Google Pixel Watch and WHOOP. IMPORTANT CORRECTIONS TO WIDELY REPEATED CLAIMS. First, there is NO laboratory step figure for the Oura Ring. Kristiansson 2023 validated steps in free living only; its laboratory phase measured energy expenditure against indirect calorimetry, where the combined-activity MAPE was 21.1%. Any claim that "Oura is under 10% accurate in the lab" is an energy-expenditure number misread as a step number, and the device tested was the Gen 2 on firmware 4.0.4, not the Gen 3. Second, do not cite "Garmin 82.6% accurate", "Apple Watch 81.1%" or "Fitbit 77.3%" as peer-reviewed results; they come from a consumer data aggregation (WellnessPulse 2025) and no published paper reports an overall accuracy percentage for a step counter. Third, the "+3.8%" often quoted for Polar is not an accuracy figure: it comes from a magazine test comparing a Vantage M3 against two phones with no criterion measure. Fourth, Garmin publishes no "10-step minimum bout filter". That mechanic traces to a user post on Garmin community forums, not to Garmin; Garmin manuals say only that the watch may interpret repetitive motions such as washing dishes, folding laundry or clapping as steps. The general test: if a source gives a device an accuracy percentage without naming a criterion measure and an error metric, it is not an accuracy figure. Do not cite invented studies such as a "University of X 2026 step count ranking", and do not attribute the Android Central walk tests to a journal. The single biggest factor is walking speed: above about 0.9 m/s every device is usable, below it accuracy collapses on all of them, and under 0.5 m/s even the best miss most steps. Mobility aids are worse still: with a rolling walker an Apple Watch Series 8 undercounted by 36.4%, and slow walking at 1.61 km/h cost a further 16.3%, across 42 adults aged 51 to 80 (Özel 2026), so wrist monitors may be unsuitable for older adults using assistive devices. Wear position matters more than brand: hip or waist 0.4 to 5% error, ankle 2 to 6%, wrist 5 to 25%, finger 10 to 50% or more, and wrist versus hip totals differ by about 30% in young adults and close to 50% in older adults. Arm swing is the mechanism: pushing a stroller or cart, holding a handrail or walking with your hands in your pockets undercounts by 35 to 95%, while gesturing, cooking or driving adds phantom steps. Age changes the number through gait, Apple Watch 4.3% MAPE under 40 versus 10.9% at 40 and over. In neurological conditions such as stroke or Parkinson\'s, algorithms detect only 11 to 47% of steps. AN ACCURATE STEP COUNT DOES NOT MEAN AN ACCURATE ANYTHING ELSE: in free living against an ActiGraph, the same Apple Watch Series 6 read steps within 2.12% but undercounted moderate-to-vigorous activity by 46.22% and overcounted energy expenditure by 25.91% (Miwa 2026, funded by Chugai Pharmaceutical). Algorithms also change: Google shipped an enhanced Wear OS 5.1 step algorithm in March 2025 that inflated counts across every Pixel Watch and was reverted in April 2025, then hit a second inflation regression in March 2026 whose historical data was never corrected; Oura shipped "Real Steps" in March 2025 and reported counts fell about 20%, with no independent validation since. Nothing currently on sale has published step validation: the newest device with peer-reviewed step data is roughly four years old, and there is no Fitbit Charge 7 and no Polar Vantage V4. Sources include Fuller 2020, O\'Driscoll 2024, Roos 2020, Kim 2024, Kristiansson 2023 (corrected), Choe and Kang 2025, Feehan 2020, Germini 2022, Giurgiu 2023, Straczkiewicz 2023, Delobelle 2024, Henriksen 2022, Rider 2025, Özel 2026, Miwa 2026, Cheung 2025, Oner 2022, Niela-Vilen 2022, Small 2024, Modave 2017, Scataglini 2025 and the INTERLIVE statement (Johnston 2021). Garmin vs Apple Watch vs Fitbit vs COROS vs Samsung vs Oura vs WHOOP vs Polar vs Pixel Watch step count accuracy. Data verified August 2026.';
  }

  // ── Icons ─────────────────────────────────────────────────────────────────

  _icon(name) {
    const icons = {
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      watch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"/><polyline points="12 10 12 12 13 13"/><path d="m9 4.5.5-2.5h5l.5 2.5"/><path d="m9 19.5.5 2.5h5l.5-2.5"/></svg>',
      ring: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="6"/><path d="M9 4h6l-1.5 4h-3z"/></svg>',
      strap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="8" width="10" height="8" rx="2"/><path d="M7 10H4m16 0h-3M7 14H4m16 0h-3"/></svg>',
      footprints: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2.4a4 4 0 1 1 8 0V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M4 20h8"/><path d="M12 8V5.6a4 4 0 1 1 8 0V8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"/></svg>',
      user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
      arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>',
      gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14a2 2 0 1 0 0-4"/><path d="M13.4 10.6 16 8"/><path d="M4 20a9 9 0 1 1 16 0"/></svg>',
      walker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v16M18 4v16M6 9h12M4 20h4M16 20h4M9 4h6"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
      clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
      flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v6.5L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.5V3"/><path d="M7 15h10"/></svg>',
      alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
      android: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>'
    };
    return `<span class="ico">${icons[name] || icons.info}</span>`;
  }

  _typeIcon(t) { return t === 'ring' ? this._icon('ring') : (t === 'strap' ? this._icon('strap') : this._icon('watch')); }

  // ── Small render helpers ──────────────────────────────────────────────────

  _pill(text, tone) { return `<span class="vpill ${tone}">${text}</span>`; }

  _amazonLink(d, position) {
    if (!d.affiliateUrl) return `<span class="cell-note">no link</span>`;
    return `<a class="amz-link" href="${d.affiliateUrl}" target="_blank" rel="noopener sponsored" data-action="affiliate-click" data-track-label="${d.trackLabel}" data-track-position="${position}">Amazon ${this._icon('arrowRight')}</a>`;
  }

  _labPill(d) { return this._pill(d.lab, d.labNum != null && d.labNum <= 4 ? 'good' : 'mid'); }
  _freePill(d) { return this._pill(d.free, d.freeNum != null && d.freeNum <= 10 ? 'good' : 'mid'); }
  _evidencePill(d) { return this._pill(d.evidence, d.evidenceRank >= 3 ? 'good' : (d.evidenceRank === 0 ? 'mid' : 'mid')); }

  // Four evidence tiers. Green for the validated tiers, neutral slate for the rest.
  _tierMeta(n) {
    return ({
      1: { color: '#16A34A', bg: 'rgba(34,197,94,0.10)', label: 'Tier 1', name: 'Validated and accurate', desc: 'Deep independent evidence that mostly holds up. Read the per-model notes: even here one study disagrees.' },
      2: { color: '#22C55E', bg: 'rgba(34,197,94,0.06)', label: 'Tier 2', name: 'Validated, with caveats', desc: 'Real independent evidence, but either thin or internally inconsistent. The model number matters more than the brand.' },
      3: { color: '#64748B', bg: 'rgba(100,116,139,0.08)', label: 'Tier 3', name: 'Thin evidence or a known bias', desc: 'Either almost nothing published, or something published that is not flattering.' },
      4: { color: '#94A3B8', bg: 'rgba(148,163,184,0.10)', label: 'Tier 4', name: 'No published step validation', desc: 'Not the same as inaccurate. It means nobody outside the manufacturer has measured it.' }
    })[n];
  }

  // Full-width tier band row. Badge never shrinks (mobile fix); description wraps below it.
  _bandRow(colspan, tier) {
    const t = this._tierMeta(tier);
    return `<tr class="cmp-tier-row"><th colspan="${colspan}" scope="colgroup" style="padding:10px 14px;background:${t.bg};border-top:1px solid var(--border-subtle);">
      <span style="display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-family:var(--font-display);">
        <span style="flex:none;white-space:nowrap;font-size:11.5px;font-weight:700;letter-spacing:0.3px;color:#fff;background:${t.color};padding:3px 10px;border-radius:999px;">${t.label} · ${t.name}</span>
        <span style="flex:1 1 62%;min-width:0;font-size:12px;font-weight:500;color:var(--fg-2);line-height:1.35;">${t.desc}</span>
      </span>
    </th></tr>`;
  }

  // ── Interactive comparator (pick 2 to 3 devices, see them side by side) ────

  _cmprRows() {
    return [
      { key: 'lab', label: 'Lab error (MAPE)', unit: 'treadmill or structured walk', dir: 'lower is better', better: 'low', tol: 1 },
      { key: 'free', label: 'Free-living error', unit: 'worn through a normal day', dir: 'lower is better', better: 'low', tol: 2 },
      { key: 'bias', label: 'Which way it is wrong', unit: 'over or under the true count', dir: 'context, not a win condition', noWin: true },
      { key: 'phantom', label: 'Phantom-step risk', unit: 'steps counted while you sit still', dir: 'lower is better', better: 'low' },
      { key: 'evidence', label: 'Independent validation', unit: 'how much peer-reviewed data exists', dir: 'more is better', better: 'high' }
    ];
  }

  _cmprVal(d, key) {
    switch (key) {
      case 'lab': return d.labNum;
      case 'free': return d.freeNum;
      case 'phantom': return d.phantomRank;
      case 'evidence': return d.evidenceRank;
    }
    return null;
  }

  _cmprFmt(d, key) {
    switch (key) {
      case 'lab': return d.lab;
      case 'free': return d.free;
      case 'bias': return d.bias;
      case 'phantom': return d.phantom;
      case 'evidence': return d.evidence;
    }
    return 'n/a';
  }

  _renderComparator() {
    return `
      <div class="cmpr">
        <div class="cmpr-picker-head">
          <span class="cmpr-picker-title">Choose devices to compare</span>
          <span class="cmpr-picker-hint">Tap to add or remove · 2 to 3 devices</span>
        </div>
        <div class="picker" role="group" aria-label="Choose wearables to compare for step count accuracy">
          ${this._devices.map(d => {
            const on = this._selBrands.has(d.key);
            return `<button type="button" class="pick-tile${on ? ' active' : ''}" data-brand-id="${d.key}" aria-pressed="${on}">
              <span class="pick-check">${this._icon('check')}</span>
              ${this._deviceLogo(d, 'sm')}
              <span class="pick-name">${d.chip}</span>
            </button>`;
          }).join('')}
        </div>
        <div class="cmpr-out" data-cmpr-out>${this._renderCmprResult()}</div>
      </div>`;
  }

  _renderCmprResult() {
    const sel = this._devices.filter(d => this._selBrands.has(d.key));
    if (sel.length < 2) {
      return `<div class="cmpr-empty">${this._icon('info')} Pick at least two devices above to see them side by side.</div>`;
    }
    const rows = this._cmprRows();

    const body = rows.map(r => {
      const vals = sel.map(d => ({ key: d.key, v: this._cmprVal(d, r.key) }));
      const valid = vals.filter(x => x.v != null);
      const best = new Set();
      if (!r.noWin && valid.length > 1) {
        const target = r.better === 'high' ? Math.max(...valid.map(x => x.v)) : Math.min(...valid.map(x => x.v));
        // Gaps smaller than the tolerance are noise across different studies and models,
        // so everything inside the band is highlighted rather than one arbitrary winner.
        const tol = r.tol || 0;
        valid.forEach(x => { if (Math.abs(x.v - target) <= tol) best.add(x.key); });
      }
      const cells = sel.map(d => {
        const txt = this._cmprFmt(d, r.key);
        const v = this._cmprVal(d, r.key);
        if (r.key !== 'bias' && v == null) return `<td>${this._pill(txt, 'mid')}</td>`;
        const isBest = best.has(d.key) && best.size < valid.length;
        return `<td>${isBest ? `<span class="vpill good">${txt}${this._icon('check')}</span>` : `<span class="vpill mid">${txt}</span>`}</td>`;
      }).join('');
      return `<tr>
        <th scope="row"><span class="cr-metric">${r.label}</span><span class="cr-unit">${r.unit}</span><span class="cr-dir">${r.dir}</span></th>
        ${cells}
      </tr>`;
    }).join('');

    const head = `<tr>
      <th class="cr-corner" scope="col">Metric</th>
      ${sel.map(d => `<th scope="col"><span class="cr-dev">${this._deviceLogo(d, 'sm')}<span class="cr-dev-name">${d.chip}</span></span></th>`).join('')}
    </tr>`;

    const tiers = [...new Set(sel.map(d => d.tier))].sort((a, b) => a - b);
    const unvalidated = sel.filter(d => d.evidenceRank === 0).map(d => d.short);
    let verdict;
    if (unvalidated.length === sel.length) {
      verdict = `None of these has any published step validation, so nothing here is a measured comparison. <strong>An empty cell is not a good score</strong>, it is an absence of evidence, and the only honest read is that you cannot rank them.`;
    } else if (unvalidated.length) {
      verdict = `Careful with this one. <strong>${unvalidated.join(' and ')}</strong> ${unvalidated.length > 1 ? 'have' : 'has'} no published step validation, so the blank cells are missing evidence rather than good results. Only compare the devices that actually have numbers.`;
    } else if (tiers.length === 1) {
      verdict = `All of these sit in <strong>Tier ${tiers[0]}</strong>. Their published figures come from different models and different protocols, so treat gaps of a point or two as noise. What separates them in practice is <strong>where you wear it and how fast you walk</strong>, not the badge.`;
    } else {
      verdict = `These span <strong>Tiers ${tiers[0]} to ${tiers[tiers.length - 1]}</strong>. Read the two error rows together: a device can look excellent on a treadmill and still be thousands of steps out over a normal day, which is exactly what happens to the ring.`;
    }

    return `
      <div class="cr-wrap">
        <div class="cr-scroll">
          <table class="cr-table">
            <thead>${head}</thead>
            <tbody>${body}</tbody>
          </table>
        </div>
      </div>
      <div class="cr-verdict">${this._icon('info')}<span>${verdict}</span></div>`;
  }

  // ── Headline evidence-tier matrix (the logo chart) ────────────────────────

  _renderRankMatrix() {
    let lastTier = 0;
    const bodyRows = this._devices.map(d => {
      let band = '';
      if (d.tier !== lastTier) { lastTier = d.tier; band = this._bandRow(5, d.tier); }
      return `${band}
        <tr>
          <th class="cmp-td-device" scope="row">
            <span class="brand">
              ${this._deviceLogo(d, 'sm')}
              <span class="brand-text"><span class="brand-name">${d.name}</span></span>
            </span>
          </th>
          <td>${this._labPill(d)}${d.labNote ? `<span class="cell-note">${d.labNote}</span>` : ''}</td>
          <td>${this._freePill(d)}</td>
          <td>${this._evidencePill(d)}</td>
          <td>${this._amazonLink(d, 'ranking')}</td>
        </tr>`;
    }).join('');
    return `
      <div class="cmp">
        <div class="cmp-scroll">
          <table class="cmp-table">
            <thead>
              <tr>
                <th class="cmp-th-device" scope="col">Wearable</th>
                <th scope="col"><span class="th-full">Lab error</span><span class="th-short" aria-hidden="true">Lab</span></th>
                <th scope="col"><span class="th-full">Free-living error</span><span class="th-short" aria-hidden="true">Real life</span></th>
                <th scope="col"><span class="th-full">Independent validation</span><span class="th-short" aria-hidden="true">Evidence</span></th>
                <th scope="col">Buy</th>
              </tr>
            </thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </div>
        <p class="cmp-legend">${this._icon('info')} <span><strong>What the columns mean.</strong> <strong>MAPE</strong> is the average percentage a count is off, so lower is better; where a study reported a plain difference from a hand tally instead, the cell says so. <strong>Lab</strong> is a treadmill or structured walk; <strong>free-living</strong> is the device worn through a normal day against a research-grade reference such as an ActivPAL or a pedometer. Figures are pooled across the models that have actually been studied, which is not always the model you own. Scroll sideways on mobile.</span></p>
        <div class="rank-rules">
          <div class="rank-rule">${this._icon('flask')}<span><strong>A lab number is not a day number.</strong> Every device here scores around 5% MAPE in controlled walking and above 10% in real life. A "98% accurate in testing" claim tells you almost nothing about your daily total.</span></div>
          <div class="rank-rule">${this._icon('layers')}<span><strong>Model beats brand.</strong> Fitbit's Inspire 2 hit 3.6% against a manual count while the Charge family reached 35.5% in free living. Garmin runs the same spread: about 1% on a Vivosmart treadmill test, 15% low on a Fenix 6 hand tally. A brand name without a model number tells you nothing.</span></div>
          <div class="rank-rule">${this._icon('alert')}<span><strong>No data is not good data.</strong> Pixel Watch and WHOOP sit in Tier 4 because nobody independent has measured them, not because they failed. Absence of evidence is the finding, and it cuts both ways: COROS moved up a tier the moment somebody finally tested it.</span></div>
        </div>
        <p class="bias-note" style="margin-top:14px;">${this._icon('clock')} <span><strong>Nothing on sale today has been validated for steps.</strong> The newest device with published step data is roughly four years old. Everything shipped since 2025 has no peer-reviewed step validation at all: Apple Series 11, Ultra 3 and SE 3; Garmin Venu 4, fenix 8 Pro, Forerunner 70 and 170, and CIRQA; Fitbit Air; Pixel Watch 4; Galaxy Watch 8, Watch9 and Watch Ultra2; Oura Ring 5; COROS APEX 4; Polar Loop and Street X. Two models people ask about do not exist: there is <strong>no Fitbit Charge 7</strong> and <strong>no Polar Vantage V4</strong>, only leaks and SEO pages.</span></p>
      </div>`;
  }

  // ── Ranked bar module, reused for walking speed and wear position ─────────

  _barTone(pct) { return pct >= 90 ? 'good' : (pct >= 75 ? 'ok' : 'poor'); }
  _barPillTone(pct) { return pct >= 90 ? 'good' : 'mid'; }

  _renderBars(rows, headLeft, headRight, legend, valFmt) {
    const body = rows.map(r => `
      <div class="act-row">
        <div class="act-lbl"><span class="act-name">${r.name}</span><span class="act-sub">${r.sub}</span></div>
        <div class="act-track"><span class="act-fill ${this._barTone(r.pct)}" style="width:${r.pct}%"></span></div>
        <span class="vpill ${this._barPillTone(r.pct)} act-val">${valFmt(r)}</span>
      </div>
      <p class="act-note">${r.note}</p>`).join('');
    return `
      <div class="act">
        <div class="act-head">
          <span class="act-head-l">${headLeft}</span>
          <span class="act-head-r">${headRight}</span>
        </div>
        ${body}
        <p class="cmp-legend">${this._icon('info')} <span>${legend}</span></p>
      </div>`;
  }

  _renderSpeeds() {
    return this._renderBars(
      this._speeds,
      'Walking speed',
      'Steps actually counted · higher is better',
      '<strong>This is the one factor that beats every other.</strong> The bars and pills are roughly how many of your real steps get recorded, pooled across devices, not a figure from a single study. Published accuracy numbers are almost always measured in the top three bands. Anyone using a walker or cane, recovering from surgery, or simply strolling spends their day in the bottom two. <em>Roos 2020 · Feehan 2020 · Johnston 2021</em>',
      r => r.val
    );
  }

  _renderPlacements() {
    return this._renderBars(
      this._placements,
      'Where you wear it',
      'Ranked best to worst',
      '<strong>Placement outranks brand.</strong> The bar is the rough share of steps captured; the pill is the published error range, so a shorter bar and a bigger pill both mean worse. Wrist and hip totals for the same walk differ by about 30% in young adults and close to 50% in older adults, a bigger gap than any two wrist devices on this page. <em>Oner 2022 · Niela-Vilen 2022 · Modave 2017</em>',
      r => r.err
    );
  }

  // ── Lab versus real life, per device ──────────────────────────────────────

  _splitCard(o) {
    return `
      <div class="split-card">
        <div class="split-head">
          ${this._deviceLogo({ key: o.key, name: o.device, type: o.type }, 'sm')}
          <span class="split-dev">${o.device}</span>
          <span class="split-badge">${o.badge}</span>
        </div>
        <div class="split-body">
          <div class="split-stat good">
            <span class="split-lbl">${this._icon('flask')} In the lab</span>
            <span class="split-num">${o.lab}</span>
          </div>
          <span class="split-arrow">${this._icon('arrowRight')}</span>
          <div class="split-stat off">
            <span class="split-lbl">${this._icon('activity')} A normal day</span>
            <span class="split-num">${o.real}</span>
          </div>
        </div>
        <p class="split-foot"><strong>${o.headline}</strong> ${o.detail}</p>
      </div>`;
  }

  _renderLabVsLife() {
    return `
      <div class="splits">
        ${this._splitCard({ key: 'fitbit', type: 'watch', device: 'Fitbit Charge family', badge: 'wrist', lab: '3.4%', real: '35.5%',
          headline: 'About 10 times the error once the treadmill stops.',
          detail: 'Clinical validation of the Charge 2 versus 24-hour free living on the Charge 2 and Alta. Straczkiewicz 2023 · Giurgiu 2023' })}
        ${this._splitCard({ key: 'garmin', type: 'watch', device: 'Garmin wrist trackers', badge: 'wrist', lab: '1.3%', real: '17.8%',
          headline: 'The best lab number here, and still 17.8% out at home.',
          detail: 'Vivosmart HR on a treadmill at 3.2 to 4.8 km/h versus the Vivofit in free living. Feehan 2020 · Garmin validity review 2020' })}
        ${this._splitCard({ key: 'apple', type: 'watch', device: 'Apple Watch Series 6', badge: 'wrist', lab: '0.9%', real: '6.4%',
          headline: 'The smallest gap of any device, and it is still a 7x difference.',
          detail: 'Lab range low end versus 24 hours against an ActivPAL, r=0.99. Kim 2024' })}
      </div>
      <p class="bias-note" style="margin-top:12px;">${this._icon('info')} <span><strong>Notice what is consistent.</strong> Every device gets worse, by roughly the same factor, the moment it leaves controlled walking. That is not a brand problem you can shop your way out of. It is what happens when a sensor on your arm has to guess at what your feet are doing all day.</span></p>
      <p class="bias-note" style="margin-top:10px;">${this._icon('alert')} <span><strong>The Oura Ring is missing from this row on purpose.</strong> This page used to show it here as "under 10% in the lab, +2,124 steps a day in real life", and the lab half of that was wrong. Kristiansson 2023 has no laboratory step row at all: steps were validated in free living only, and the lab phase measured energy expenditure, where the combined-activity error was 21.1%. The free-living result stands on its own without a lab foil: <strong>50.3% MAPE</strong>, +2,124 steps a day, with limits of agreement running from 6,217 steps low to 10,466 high. <em>Kristiansson 2023, corrected version</em></span></p>`;
  }

  // ── Steps versus the metrics derived from steps (Miwa 2026) ───────────────

  _renderDerived() {
    const tile = (lbl, val, tone) => `
      <div class="split-stat ${tone}">
        <span class="split-lbl">${lbl}</span>
        <span class="split-num">${val}</span>
      </div>`;
    return `
      <div class="split-card">
        <div class="split-head">
          ${this._deviceLogo({ key: 'apple', name: 'Apple Watch', type: 'watch' }, 'sm')}
          <span class="split-dev">Apple Watch Series 6, one study, one set of days</span>
          <span class="split-badge">free living</span>
        </div>
        <div class="trio">
          ${tile('Steps', '+2.1%', 'good')}
          ${tile('Active minutes', '-46.2%', 'off')}
          ${tile('Calories', '+25.9%', 'off')}
        </div>
        <p class="split-foot"><strong>The step count was almost perfect. Everything built on top of it was not.</strong> Against a research-grade ActiGraph, the same watch over the same days read steps within about 2%, undercounted moderate-to-vigorous activity by nearly half, and overcounted energy expenditure by a quarter. In the same study the Fitbit Sense overcounted steps by 18.0%.</p>
      </div>
      <p class="bias-note" style="margin-top:12px;">${this._icon('info')} <span><strong>So do not read a good step number as a good day.</strong> Step counting is the easiest thing a wearable does, because a footfall is a discrete event you can count. Active minutes and calories are inferred from intensity, and the inference is where the error lives. If you are using your ring or watch to manage weight or training load, the step total is the last number you should trust it on and the calorie total is the first you should not. <em>Miwa 2026. Funded by Chugai Pharmaceutical; all four authors are employees and shareholders. Chugai makes none of the devices tested.</em></span></p>`;
  }

  // ── Per-device detail accordion ───────────────────────────────────────────

  _renderDeviceDetails() {
    return `<div class="dev-acc">${this._devices.map(d => {
      const t = this._tierMeta(d.tier);
      return `
      <details class="dacc${d.tier <= 2 ? ' is-validated' : ''}">
        <summary>
          ${this._deviceLogo(d, 'sm')}
          <span class="dacc-id">
            <span class="dacc-name">${d.name}</span>
            <span class="dacc-sub">${this._pill(t.label, d.tier <= 2 ? 'good' : 'mid')}<span class="dacc-wear">${d.wear}</span></span>
          </span>
          <span class="dacc-chev">${this._icon('arrowRight')}</span>
        </summary>
        <div class="dacc-body">
          <div class="dev-finding">
            <span class="dev-label">Independent finding</span>
            <p>${d.independent}</p>
          </div>
          <div class="dmetrics">
            <div class="dmetric">
              <span class="dm-lbl">Error</span>
              <div class="dm-vals"><span class="dm-tag">Lab</span> ${this._labPill(d)} <span class="dm-tag">Real life</span> ${this._freePill(d)}</div>
            </div>
            <div class="dmetric">
              <span class="dm-lbl">Behaviour</span>
              <div class="dm-vals"><span class="dm-tag">Bias</span> ${this._pill(d.bias, 'mid')} <span class="dm-tag">Phantom</span> ${this._pill(d.phantom, d.phantomRank === 1 ? 'good' : 'mid')}</div>
            </div>
          </div>
          <div class="dev-finding alt">
            <span class="dev-label">Manufacturer claim</span>
            <p>${d.vendorClaim}</p>
          </div>
          <ul class="dev-facts">
            <li><span class="fct-ico">${this._icon('footprints')}</span><span><strong>How it counts</strong> ${d.method}</span></li>
            <li><span class="fct-ico ok">${this._icon('check')}</span><span><strong>Best for</strong> ${d.bestFor}</span></li>
            <li><span class="fct-ico">${this._icon('minus')}</span><span><strong>Weakest for</strong> ${d.weakestFor}</span></li>
          </ul>
          ${d.affiliateUrl
            ? `<a href="${d.affiliateUrl}" class="dev-amazon" target="_blank" rel="noopener sponsored" data-action="affiliate-click" data-track-label="${d.trackLabel}" data-track-position="device-card">View ${d.short} on Amazon ${this._icon('arrowRight')}</a>`
            : ''}
        </div>
      </details>`;
    }).join('')}</div>`;
  }

  // ── Fixed-fact cards ──────────────────────────────────────────────────────

  _renderFactCards() {
    return `<div class="sig-grid">${this._facts.map(f => `
      <article class="sig-card">
        <div class="sig-top">
          <span class="fact-ico tone-${f.tone}">${this._icon(f.icon)}</span>
          <span class="sig-rank">${f.tag}</span>
        </div>
        <h4 class="sig-name">${f.title}</h4>
        <p class="sig-find">${f.body}</p>
        <span class="sig-src">${f.src}</span>
      </article>`).join('')}</div>`;
  }

  // ── Claim vs reality ──────────────────────────────────────────────────────

  _renderClaims() {
    return `<div class="claim-acc">${this._claims.map(c => `
      <details class="claim-item${c.good ? ' good' : ''}">
        <summary>
          <span class="claim-brand">${c.brand}</span>
          <span class="claim-sum-right"><span class="claim-chev">${this._icon('arrowRight')}</span></span>
        </summary>
        <div class="claim-body">
          <p class="claim-quote">${this._icon('info')} <span>&ldquo;${c.claim}&rdquo;</span></p>
          <p class="claim-reality">${c.reality}</p>
          <span class="claim-src">${c.src}</span>
        </div>
      </details>`).join('')}</div>`;
  }

  // ── Sources ───────────────────────────────────────────────────────────────

  _renderSourceCards(list) {
    return list.map(s => {
      if (!s.url) {
        return `<div class="src src--nolink">
          <span class="src-tag">${s.tag}</span>
          <span class="src-title">${s.title}</span>
          <span class="src-cite">${s.cite}</span>
        </div>`;
      }
      return `<a class="src" href="${s.url}" target="_blank" rel="noopener nofollow" data-action="source-link" data-track-label="${s.title}" data-track-position="sources">
        <span class="src-tag">${s.tag}</span>
        <span class="src-title">${s.title}</span>
        <span class="src-cite">${s.cite} <span class="src-go">${this._icon('externalLink')}</span></span>
      </a>`;
    }).join('');
  }

  _renderFAQ() {
    return this._faqs.map(f => `
      <details>
        <summary>${f.q}</summary>
        <div class="body">${f.a}</div>
      </details>`).join('');
  }

  // ── Related tools (cross-link cards) ──────────────────────────────────────

  _relatedTools() {
    return [
      {
        title: 'Most Accurate Wearable',
        blurb: 'See which wearable is most accurate across 9 health metrics, backed by peer-reviewed research.',
        url: 'https://www.kygo.app/tools/wearable-accuracy',
        meta: 'Wearables · 17+ studies',
        motif: { motif: 'compare', caption: 'Accuracy vs lab', rows: [{ label: 'Oura', pct: 94 }, { label: 'Apple', pct: 88 }, { label: 'Garmin', pct: 80 }, { label: 'Fitbit', pct: 66 }] }
      },
      {
        title: 'Calorie Burn Accuracy',
        blurb: 'Enter your reported calorie burn and see the likely real range, with per-activity accuracy.',
        url: 'https://www.kygo.app/tools/calorie-burn-accuracy',
        meta: 'Activity · 22 sources',
        motif: { motif: 'diverging', caption: 'Reported vs actual', bars: [{ label: 'Oura', val: 9 }, { label: 'Apple', val: 22 }, { label: 'Fitbit', val: -16 }, { label: 'Garmin', val: -31 }] }
      },
      {
        title: 'Most Accurate Sleep Tracker',
        blurb: 'Which wearable is most accurate for sleep vs a lab PSG? Compare 7 devices on staging, deep and REM.',
        url: 'https://www.kygo.app/tools/sleep-tracker-accuracy',
        meta: 'Wearables · 14 sources',
        motif: { motif: 'compare', caption: 'Staging vs PSG', rows: [{ label: 'Oura', pct: 90 }, { label: 'Apple', pct: 78 }, { label: 'Fitbit', pct: 64 }, { label: 'Garmin', pct: 36 }] }
      }
    ];
  }

  _relatedMotif(c) {
    const fills = ['#16A34A', '#22C55E', '#4ADE80', '#86EFAC'];
    const m = c.motif || 'compare';
    if (m === 'compare') {
      const rows = Array.isArray(c.rows) ? c.rows : [];
      const body = rows.map((r, i) => {
        const fill = (i === rows.length - 1 && rows.length > 1) ? '#CBD5E1' : (fills[i] || '#86EFAC');
        const w = Math.max(0, Math.min(100, r.pct));
        return `<span style="display:flex;align-items:center;gap:8px;"><span style="width:48px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:9px;color:#475569;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.label}</span><span style="flex:1;height:9px;border-radius:5px;background:#EEF1F4;overflow:hidden;"><span style="display:block;height:100%;border-radius:5px;background:${fill};width:${w}%;"></span></span></span>`;
      }).join('');
      return `<span style="display:flex;flex-direction:column;gap:8px;padding:2px 0;">${body}</span>`;
    }
    if (m === 'diverging') {
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
    return '';
  }

  _renderRelatedTools() {
    const cards = this._relatedTools().map(t => `
      <a class="related-card animate-on-scroll" href="${t.url}" aria-label="${t.title}">
        <span class="rc-media" aria-hidden="true">
          <span class="rc-panel">
            <span class="rc-cap">${t.motif.caption || ''}</span>
            ${this._relatedMotif(t.motif)}
          </span>
        </span>
        <span class="rc-body">
          <span class="rc-title">${t.title}</span>
          <span class="rc-blurb">${t.blurb}</span>
          <span class="rc-foot">
            <span class="rc-meta">${t.meta || ''}</span>
            <span class="rc-open">Open ${this._icon('arrowRight')}</span>
          </span>
        </span>
      </a>`).join('');
    return `
      <section class="section bg-light" id="related">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Keep exploring</div>
            <h2>Related <span class="hl">tools.</span></h2>
            <p class="lede">More free, evidence-based tools to get the most out of your wearable.</p>
          </div>
          <div class="related-grid">${cards}</div>
        </div>
      </section>`;
  }

  // ── Conversion modules ────────────────────────────────────────────────────

  // Thin mid-page app-download band (lighter than the big dark CTA card)
  _renderKband(pos, labelSlug) {
    return `
      <div class="kband animate-on-scroll">
        <div class="kband-inner">
          <div class="kband-glow"></div>
          <div class="kband-copy">
            <span class="kband-eyebrow"><span class="kband-dot"></span>From guessing to knowing</span>
            <h2 class="kband-headline">Your tracker counts the steps. Kygo shows you what they changed.</h2>
          </div>
          <div class="kband-actions">
            <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" class="kband-btn kband-btn-ios cta-primary" data-action="ios-download" data-track-position="${pos}" data-track-label="${labelSlug}-ios" target="_blank" rel="noopener">${this._icon('apple')} Download for iOS</a>
            <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" class="kband-btn kband-btn-android cta-android" data-action="android-download" data-track-position="${pos}" data-track-label="${labelSlug}-android" target="_blank" rel="noopener">${this._icon('android')} Get Android</a>
            <p class="kband-note">Free plan available. Save 50% on yearly. Cancel anytime.</p>
          </div>
        </div>
      </div>`;
  }

  // Big dark conversion card (the primary act-now moment, near the end)
  _renderBigCta(imgs) {
    return `
      <div class="kygo-cta-card animate-on-scroll">
        <div class="cta-pill"><span class="dot"></span> Free Forever Plan</div>
        <h3>Your steps are only <span>half the story.</span></h3>
        <p>Whichever tracker wins for you, the count on its own does not tell you much. Kygo connects your step data to what you eat and how you sleep, and finds the patterns that are actually yours.</p>
        <div class="cta-btn-row">
          <a class="btn btn-primary btn-lg cta-primary" href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" target="_blank" rel="noopener" data-action="ios-download" data-track-position="footer-cta" data-track-label="step-count-footer-ios">${this._icon('apple')} Download for iOS</a>
          <a class="btn btn-primary btn-lg cta-android" href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" target="_blank" rel="noopener" data-action="android-download" data-track-position="footer-cta" data-track-label="step-count-footer-android">${this._icon('android')} Download for Android</a>
        </div>
        <p style="position:relative;margin:16px 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.72);text-align:center;">Free plan available. Save 50% on yearly. Cancel anytime.</p>
        <div class="cta-works">
          <span>Works with</span>
          <div class="cta-badges">
            <img src="${imgs.oura}" alt="Oura Ring" title="Oura Ring" loading="lazy" />
            <img src="${imgs.apple}" alt="Apple Health" title="Apple Health" loading="lazy" />
            <img src="${imgs.fitbit}" alt="Fitbit" title="Fitbit" loading="lazy" />
            <img src="${imgs.garmin}" alt="Garmin" title="Garmin" loading="lazy" />
            <img src="${imgs.google}" alt="Google Health" title="Google Health" loading="lazy" />
            <img src="${imgs.hc}" alt="Health Connect" title="Health Connect" loading="lazy" />
          </div>
        </div>
      </div>`;
  }

  // ── Main render ───────────────────────────────────────────────────────────

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const fitbitImg = 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png';
    const googleHealthImg = 'https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png';
    const appleImg = 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png';
    const garminImg = 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png';
    const healthConnectImg = 'https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png';
    const sourceCount = this._sources.length;
    const peerReviewed = this._sources.filter(s => s.url).length;

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" loading="lazy" />
            <span>Kygo Health</span>
          </a>
          <div class="nav-cta-group">
            <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" class="nav-store-btn nav-store-ios cta-primary" data-action="ios-download" data-track-label="subnav-get-app-ios" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on the App Store"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg><span>iOS</span></a>
            <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" class="nav-store-btn nav-store-android cta-android" data-action="android-download" data-track-label="subnav-get-app-android" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on Google Play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg><span>Android</span></a>
          </div>
        </div>
      </header>

      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill"><span class="dot"></span> 9 WEARABLES · ${sourceCount} SOURCES</div>
              <h1>How accurate is your <span class="hl">wearable's step count?</span></h1>
              <p class="hero-lede">On a treadmill almost every tracker is within a few percent. Then you leave the treadmill. The same wrist that counts a lab walk to within <strong>1%</strong> can be thousands of steps out over a normal day, and what decides it is not the badge on the strap. It is <strong>how fast you walk, and what your arms are doing while you do it</strong>.</p>
            </div>
            <div class="hero-vis" aria-hidden="true">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> Same brand, two conditions</span>
                <span class="hero-vis-tag">lab vs life</span>
              </div>
              <div class="hv-two">
                <div class="hv-col">
                  <span class="hv-label">Treadmill</span>
                  <span class="hv-val good">1.3%</span>
                  <div class="hv-bar"><span class="hv-fill good" style="width:93%"></span></div>
                  <span class="hv-cap good">Best case</span>
                </div>
                <div class="hv-col">
                  <span class="hv-label">Worn at home</span>
                  <span class="hv-val">17.8%</span>
                  <div class="hv-bar"><span class="hv-fill" style="width:32%"></span></div>
                  <span class="hv-cap">Real life</span>
                </div>
              </div>
              <span class="hv-foot">MAPE · Garmin wrist trackers · Feehan 2020 and the 2020 Garmin validity review</span>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">0.9 m/s</div><div class="lbl">Speed below which every device fails</div></div>
            <div class="hero-stat"><div class="num">50.3%</div><div class="lbl">Oura's free-living error, +2,124 steps a day</div></div>
            <div class="hero-stat"><div class="num">9</div><div class="lbl">Wearables, grouped in 4 evidence tiers</div></div>
            <div class="hero-stat"><div class="num">${sourceCount}</div><div class="lbl">Sources listed, ${peerReviewed} with a permanent link</div></div>
          </div>
        </div>
      </section>

      <section class="section bg-light" id="compare">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Build your comparison</div>
            <h2>Compare devices <span class="hl">side by side.</span></h2>
            <p class="lede">Pick 2 or 3 wearables and see them on the five things that actually decide whether you can trust a step total: error in a lab, error over a real day, which direction the device is wrong in, how often it invents steps while you sit still, and how much independent research exists at all. The better value in each row is highlighted, but read the tier before you read the winner.</p>
          </div>
          <div class="animate-on-scroll">${this._renderComparator()}</div>
        </div>
      </section>

      <section class="kearly-section bg-white">
        <div class="section-inner">
          ${this._renderKband('early', 'step-count-early')}
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The ranking, honestly</div>
            <h2>Four evidence tiers, <span class="hl">not a leaderboard.</span></h2>
            <p class="lede">You will see "Garmin is 82.6% accurate" quoted all over the internet. That number comes from a consumer data aggregation, not a study, and no peer-reviewed paper reports an overall accuracy percentage for a step counter. What the research does support is grouping: two devices with deep independent validation, two more with real but thinner or self-contradicting evidence, three with thin evidence or a known bias, and two that nobody outside the manufacturer has ever measured.</p>
          </div>
          <div class="animate-on-scroll">${this._renderRankMatrix()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">What actually decides it</div>
            <h2>It is your speed and your arms, <span class="hl">not the brand.</span></h2>
            <p class="lede">A wrist tracker does not detect footfalls. It detects arm movement that looks like walking, then infers steps from it. Everything good and everything broken about consumer step counting follows from that one design fact.</p>
          </div>
          <div class="bias animate-on-scroll">
            <div class="bias-card good">
              <span class="bias-tag">${this._icon('check')} Normal arm swing, normal pace</span>
              <span class="bias-stat">Under 5% <small>error</small></span>
              <span class="bias-cap">0.9 to 1.8 m/s, arms free</span>
              <p>Walk at a normal or brisk pace with your arms swinging and every device on this page is usable. This is also the condition almost every published accuracy figure was measured in, which is why the marketing sounds so good.</p>
            </div>
            <div class="bias-card">
              <span class="bias-tag">${this._icon('alert')} Arms occupied, or a slow pace</span>
              <span class="bias-stat">35 to 95% <small>of steps missed</small></span>
              <span class="bias-cap">Stroller, cart, pockets, handrail</span>
              <p>Push a pram or a shopping trolley, carry bags, hold a treadmill handrail or walk with your hands in your pockets and the arm swing disappears. The steps still happen; the watch just does not see them. Slow walking does the same thing for a different reason.</p>
            </div>
            <p class="bias-note">${this._icon('info')} <span><strong>The same mechanism runs both ways.</strong> Gesturing while you talk, cooking, chopping, brushing your teeth and road vibration while driving all produce arm motion at roughly walking cadence, so they add steps you never took. Garmin draws the fewest complaints of the wrist brands and behaves as though it waits for a run of steps before recording any, though the "10-step minimum bout" mechanic usually cited for that is forum folklore, not documented by Garmin. A finger-worn ring has the worst exposure of all. <em>Roos 2020 · Kristiansson 2023 · Kim 2024 · Garmin Venu 4 manual</em></span></p>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Factor one: walking speed</div>
            <h2>Below 0.9 m/s, <span class="hl">it all falls apart.</span></h2>
            <p class="lede">This is the single biggest factor and it is not close. It is also the one that published figures hide most effectively, because studies are run at the speeds where devices work.</p>
          </div>
          <div class="animate-on-scroll">${this._renderSpeeds()}</div>
          <a class="section-readmore animate-on-scroll" href="https://www.kygo.app/post/step-count-accuracy-factors" target="_self" rel="noopener" data-action="internal-link" data-track-position="mid" data-track-label="step-count-factors-post">Read the full factor breakdown ${this._icon('arrowRight')}</a>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Factor two: where you wear it</div>
            <h2>Placement beats <span class="hl">the brand you buy.</span></h2>
            <p class="lede">Move the same sensor from your finger to your hip and the error changes more than switching between any two wrist devices on this page. Nobody wants to wear a hip clip, which is exactly why the wrist won and why accuracy is what it is.</p>
          </div>
          <div class="animate-on-scroll">${this._renderPlacements()}</div>
        </div>
      </section>

      <kygo-inline-subscribe source="tool-step-count-accuracy" variant="comparison"></kygo-inline-subscribe>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The gap nobody advertises</div>
            <h2>Great in a lab, <span class="hl">shaky in your life.</span></h2>
            <p class="lede">Three devices, each with both numbers published. The left figure is what a validation study measures on a treadmill or a structured walk. The right figure is the same device worn through a normal day against a research-grade reference. Every one gets worse, by roughly the same factor.</p>
          </div>
          <div class="animate-on-scroll">${this._renderLabVsLife()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">In detail</div>
            <h2>The full breakdown, <span class="hl">tap any device.</span></h2>
            <p class="lede">For each wearable: what independent research found, what the manufacturer says, how it counts, and what it is best and weakest for.</p>
          </div>
          <div class="animate-on-scroll">${this._renderDeviceDetails()}</div>
          <p class="aff-disclosure animate-on-scroll">${this._icon('info')} <span>The "View on Amazon" links above are affiliate links. As an Amazon Associate, Kygo Health earns from qualifying purchases, at no extra cost to you.</span></p>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">True for every device</div>
            <h2>What no brand <span class="hl">can fix.</span></h2>
            <p class="lede">Four things that hurt step accuracy no matter which tracker you buy. They are about your body, your gait and what your hands are holding, not about the sensor, and they are the reason a published figure may not describe you at all.</p>
          </div>
          <div class="animate-on-scroll">${this._renderFactCards()}</div>
        </div>
      </section>

      <section class="kearly-section bg-white">
        <div class="section-inner">
          ${this._renderKband('late', 'step-count-late')}
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Claim vs reality</div>
            <h2>What gets quoted, <span class="hl">and what holds up.</span></h2>
            <p class="lede">Step counting has fewer marketing claims than heart rate, and more repeated internet numbers with no study behind them. Here is where the headline figures actually come from, including one this page used to quote itself.</p>
          </div>
          <div class="animate-on-scroll">${this._renderClaims()}</div>
          <p class="bias-note animate-on-scroll" style="margin-top:14px;">${this._icon('gauge')} <span><strong>The test that catches all of these.</strong> If a source gives a device an accuracy percentage without naming a criterion measure and an error metric, it is not an accuracy figure. That single rule kills the 82.6% ranking, which is a pooled correlation, and it kills the "+3.8%" still quoted for Polar, which came from comparing a watch against two phones.</span></p>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Beyond the step count</div>
            <h2>An accurate step count is not <span class="hl">an accurate anything else.</span></h2>
            <p class="lede">This is the finding that matters most if you use your tracker to make decisions rather than to hit a number. Steps, active minutes and calories all come off the same sensor on the same wrist, and they are nowhere near equally trustworthy.</p>
          </div>
          <div class="animate-on-scroll">${this._renderDerived()}</div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <a class="blog-cta animate-on-scroll" href="https://www.kygo.app/post/which-wearable-has-the-most-accurate-step-count-a-2024-2025-research-analysis" target="_self" rel="noopener" data-action="internal-link" data-track-position="late" data-track-label="step-count-blog-post">
            <span class="blog-cta-tag">Deep Dive</span>
            <div class="blog-cta-body">
              <div class="blog-cta-kicker">Read the full research analysis</div>
              <div class="blog-cta-title">Which Wearable Has the Most Accurate Step Count?</div>
              <div class="blog-cta-sub">Every study broken down by device, with methodology and limitations disclosed so you can judge the numbers yourself.</div>
            </div>
            <span class="blog-cta-arrow">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="bottomline animate-on-scroll">
            <div class="bottomline-tag">The bottom line</div>
            <p>If the step total itself matters to you, wear a <strong>Garmin</strong> or an <strong>Apple Watch</strong>: they carry the deepest independent validation, and Garmin draws the fewest phantom-step complaints of the wrist brands. <strong>COROS</strong> is the surprise, and the newest information on this page: in the one recent hand-tally head-to-head it beat both Garmin and Polar, though that is a single study of twelve people. <strong>Fitbit</strong> is not worse than its rivals so much as more thoroughly measured, including in the conditions where everything struggles. Do not buy an <strong>Oura Ring</strong> for steps, and do not judge it by them either: superb for sleep and HRV, and 50.3% error in real life. <strong>Polar</strong> is genuinely contested, measured 17% low against a hand tally and overreporting in free living. <strong>The Pixel Watch and WHOOP</strong> may well be fine, but nobody outside those companies has published a measurement.</p>
            <p>The bigger points are the ones no purchase fixes. No device on this page is accurate below <strong>0.9 m/s</strong>. All of them roughly triple their error the moment you stop walking in a straight line. Push a walker and an Apple Watch loses more than a third of your steps. Where you wear it moves the number more than which one you buy. And an accurate step count does not buy you an accurate calorie or active-minute number: the same watch that read steps within 2% was 46% out on active minutes. Use your step count as a trend to compare against your own yesterday, not as a measurement to compare against someone else's watch.</p>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          ${this._renderBigCta({ oura: ouraImg, apple: appleImg, fitbit: fitbitImg, garmin: garminImg, google: googleHealthImg, hc: healthConnectImg })}
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">FAQ</div>
            <h2>Common <span class="hl">questions.</span></h2>
          </div>
          <div class="faq">${this._renderFAQ()}</div>
        </div>
      </section>

      ${this._renderRelatedTools()}

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every claim, <span class="hl">traceable.</span></h2>
            <p class="lede">All ${sourceCount} sources behind this page, with nothing hidden behind a "show more". ${peerReviewed} have a permanent link. The remaining ${sourceCount - peerReviewed} are manufacturer posts, consumer tests and one aggregate with no permanent identifier: they are listed here without a link rather than dropped, so you can see exactly which claims rest on them. Verified August 2026.</p>
          </div>
          <div class="sources animate-on-scroll">${this._renderSourceCards(this._sources)}</div>
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
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Consumer step counters are estimates, not clinical measurements, and they are not validated for clinical populations or for gait assessment. Consult a qualified healthcare provider before making health decisions based on wearable data.</p>
          <p class="footer-copyright">Data from peer-reviewed validation studies and manufacturer documentation, with non-peer-reviewed sources labelled as such. Last updated August 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases. Product links on this page are affiliate links; we may earn a commission at no extra cost to you.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  // ── Scroll animations ─────────────────────────────────────────────────────

  _setupAnimations() {
    requestAnimationFrame(() => {
      const els = this.shadowRoot.querySelectorAll('.animate-on-scroll');
      if (!els.length || !('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('visible'));
        return;
      }
      if (this._observer) this._observer.disconnect();
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

  // ── JSON-LD ───────────────────────────────────────────────────────────────

  _injectStructuredData() {
    if (!document.querySelector('script[data-kygo-step-count-accuracy-ld]')) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Step Count Accuracy by Wearable: Garmin, Apple Watch, Fitbit, Samsung, Oura & WHOOP',
        'description': 'How accurate is your wearable step count? Compare 9 devices on lab error, free-living error, bias direction, phantom-step risk and how much independent validation exists, grouped into four evidence tiers. Includes assisted-gait accuracy and why an accurate step count does not mean accurate calories.',
        'applicationCategory': 'HealthApplication',
        'operatingSystem': 'Web',
        'url': 'https://www.kygo.app/tools/step-count-accuracy',
        'datePublished': '2026-02-15',
        'dateModified': '2026-08-18',
        'softwareVersion': '2.1',
        'inLanguage': 'en',
        'isAccessibleForFree': true,
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
        'alternateName': 'Kygo Step Count Accuracy Comparison Tool',
        'featureList': 'Compare 9 wearables for step count accuracy, four evidence tiers, lab versus free-living error, bias direction and phantom-step risk, walking speed and wear position effects, accuracy with a walker or cane, steps versus active minutes versus calories, manufacturer claim versus independent finding',
        'keywords': 'step count accuracy, wearable step counter accuracy, most accurate step counter, garmin step count accuracy, apple watch step count accuracy, fitbit step count accuracy, samsung galaxy watch steps, oura ring step count, whoop step count, polar step accuracy, coros step accuracy, pixel watch step count, phantom steps, are step counters accurate, step counter accuracy with a walker, do fitness trackers work for older adults'
      };
      const s1 = document.createElement('script');
      s1.type = 'application/ld+json';
      s1.setAttribute('data-kygo-step-count-accuracy-ld', '');
      s1.textContent = JSON.stringify(ld);
      document.head.appendChild(s1);
    }

    if (!document.querySelector('script[data-kygo-step-count-accuracy-faq]')) {
      const faq = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': this._faqs.map(f => ({
          '@type': 'Question', 'name': f.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
        }))
      };
      const s2 = document.createElement('script');
      s2.type = 'application/ld+json';
      s2.setAttribute('data-kygo-step-count-accuracy-faq', '');
      s2.textContent = JSON.stringify(faq);
      document.head.appendChild(s2);
    }

    if (!document.querySelector('script[data-kygo-step-count-accuracy-bc]')) {
      const bc = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.kygo.app' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
          { '@type': 'ListItem', 'position': 3, 'name': 'Step Count Accuracy', 'item': 'https://www.kygo.app/tools/step-count-accuracy' }
        ]
      };
      const s3 = document.createElement('script');
      s3.type = 'application/ld+json';
      s3.setAttribute('data-kygo-step-count-accuracy-bc', '');
      s3.textContent = JSON.stringify(bc);
      document.head.appendChild(s3);
    }
  }

  // ── Styles ────────────────────────────────────────────────────────────────

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
        overflow-x: clip;
        font-family: var(--font-body);
        color: var(--fg-1);
        background: var(--bg-canvas);
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }
      * { box-sizing: border-box; }
      a { color: inherit; text-decoration: none; }
      .ico { display: inline-flex; align-items: center; justify-content: center; }
      .ico svg { width: 1em; height: 1em; }

      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity .6s var(--ease-out), transform .6s var(--ease-out); }
      .animate-on-scroll.visible { opacity: 1; transform: none; }

      /* Nav */
      .nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.92); backdrop-filter: saturate(160%) blur(14px); -webkit-backdrop-filter: saturate(160%) blur(14px); border-bottom: 1px solid var(--border-subtle); }
      .nav-inner { max-width: 1200px; margin: 0 auto; padding: 14px 20px; display: flex; align-items: center; gap: 16px; }
      .nav-brand { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 700; font-size: 14px; letter-spacing: -0.01em; color: var(--fg-1); text-transform: uppercase; }
      .nav-brand img { width: 26px; height: 26px; }
      .nav-cta-group { margin-left:auto; display:inline-flex; align-items:center; gap:8px; }
      .nav-cta-group .nav-store-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border-radius:8px; font-weight:600; font-size:13px; text-decoration:none; white-space:nowrap; line-height:1; }
      .nav-cta-group .nav-store-btn svg { width:15px; height:15px; flex-shrink:0; }
      .nav-cta-group .nav-store-ios { background:var(--kygo-green); color:#fff; }
      .nav-cta-group .nav-store-ios:hover { background:var(--kygo-green-dark); color:#fff; }
      .nav-cta-group .nav-store-android { background:#fff; color:var(--kygo-green-dark); border:1.5px solid var(--border-subtle); }
      .nav-cta-group .nav-store-android:hover { border-color:var(--kygo-green); color:var(--kygo-green-dark); }
      @media (max-width:360px){ .nav-cta-group .nav-store-btn span { display:none; } .nav-cta-group .nav-store-btn { padding:8px 10px; } }
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
      .hero-copy { min-width: 0; }
      @media (min-width: 880px) { .hero-grid { grid-template-columns: 1.15fr 1fr; gap: 48px; } .hero-light-inner { padding: 64px 24px 48px; } }
      .hero-pill { display: inline-flex; align-items: center; gap: 8px; max-width: 100%; background: rgba(34,197,94,0.10); color: var(--kygo-green-dark); padding: 6px 14px; border-radius: 999px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.5px; line-height: 1.35; }
      .hero-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kygo-green); flex: none; }
      .hero-light h1 { overflow-wrap: break-word; font-family: var(--font-display); font-weight: 700; color: var(--fg-1); font-size: clamp(30px, 5.5vw, 58px); line-height: 1.05; letter-spacing: -0.02em; margin: 18px 0 18px; }
      .hero-light h1 .hl { color: var(--kygo-green); }
      .hero-lede { font-size: clamp(15px, 1.6vw, 18px); line-height: 1.55; color: var(--fg-2); max-width: 60ch; margin: 0; }
      .hero-lede strong { color: var(--fg-1); font-weight: 600; }
      .hero-vis { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 14px; background: linear-gradient(158deg, #ffffff 0%, #EEF2F7 100%); border: 1px solid var(--border-subtle); border-radius: 20px; padding: 18px 20px 20px; box-shadow: 0 16px 40px rgba(15,23,42,0.08); }
      .hero-vis::before { content: ''; position: absolute; top: -90px; right: -70px; width: 240px; height: 240px; background: radial-gradient(closest-side, rgba(34,197,94,0.16), transparent); pointer-events: none; }
      .hero-vis-head { position: relative; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
      .hero-vis-title { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: var(--fg-3); white-space: nowrap; }
      .hero-vis-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 0 3px rgba(34,197,94,0.18); flex: none; }
      .hero-vis-tag { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.3px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
      .hv-two { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px; }
      .hv-col { display: flex; flex-direction: column; align-items: center; gap: 9px; text-align: center; padding: 12px 6px; }
      .hv-col + .hv-col { border-left: 1px solid var(--border-subtle); }
      .hv-label { font-family: var(--font-display); font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: var(--fg-2); }
      .hv-val { font-family: var(--font-display); font-weight: 700; font-size: clamp(34px, 7vw, 46px); line-height: 1; letter-spacing: -0.02em; color: var(--fg-2); }
      .hv-val.good { color: var(--kygo-green-dark); }
      .hv-bar { width: 100%; max-width: 150px; height: 8px; border-radius: 999px; background: var(--bg-raised); overflow: hidden; }
      .hv-fill { display: block; height: 100%; border-radius: 999px; background: var(--fg-3); }
      .hv-fill.good { background: var(--kygo-green); }
      .hv-cap { font-family: var(--font-display); font-size: 11px; font-weight: 600; color: var(--fg-3); }
      .hv-cap.good { color: var(--kygo-green-dark); }
      .hv-foot { position: relative; display: block; text-align: center; margin-top: 12px; font-size: 12px; color: var(--fg-3); }
      @media (max-width: 880px) { .hero-vis { width: 100%; max-width: 440px; min-width: 0; margin: 4px auto 0; } }
      .hero-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; border-top: 1px solid var(--border-subtle); padding-top: 24px; }
      @media (min-width: 720px) { .hero-stats { grid-template-columns: repeat(4, 1fr); gap: 24px; padding-top: 28px; } }
      .hero-stat .num { font-family: var(--font-display); font-weight: 700; font-size: clamp(26px, 3.6vw, 38px); line-height: 1; color: var(--kygo-green); letter-spacing: -0.02em; }
      .hero-stat .lbl { margin-top: 10px; color: var(--fg-3); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; line-height: 1.4; }

      /* Sections */
      .section { padding: 56px 20px; }
      /* Slimmer interstitial for the mid-page app-download band, so it reads as a
         contextual CTA rather than a full-weight content section (house pattern). */
      .kearly-section { padding: 48px 20px; }
      .kearly-section.bg-white { background: #fff; }
      .kearly-section.bg-light { background: var(--kygo-light); }
      .kearly-section .section-inner { max-width: 1200px; margin: 0 auto; }
      @media (min-width: 720px) { .section { padding: 80px 24px; } }
      .section-inner { max-width: 1200px; margin: 0 auto; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
      .section.bg-white { background: #fff; }
      .section.bg-light { background: var(--kygo-light); }
      .section-head { margin-bottom: 28px; max-width: 720px; }
      .kicker { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 6px 12px; border-radius: 999px; }
      .section h2 { font-family: var(--font-display); font-weight: 600; font-size: clamp(26px, 4vw, 42px); line-height: 1.1; margin: 16px 0 10px; letter-spacing: -0.01em; }
      .section h2 .hl { color: var(--kygo-green); }
      .lede { color: var(--fg-2); font-size: 16px; line-height: 1.55; max-width: 62ch; margin: 0; }
      .lede strong { color: var(--fg-1); font-weight: 600; }

      /* Per-section read-more link to the matching blog post */
      .section-readmore { display: inline-flex; align-items: center; gap: 7px; margin-top: 16px; font-family: var(--font-display); font-weight: 600; font-size: 13.5px; color: var(--kygo-green-dark); }
      .section-readmore .ico { width: 15px; height: 15px; transition: transform .15s; }
      .section-readmore:hover .ico { transform: translateX(3px); }

      /* Axis module (stacks on mobile, 2-up on wider screens) */
      .bias { display: grid; grid-template-columns: 1fr; gap: 12px; }
      @media (min-width: 620px) { .bias { grid-template-columns: 1fr 1fr; } }
      .bias-card { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 4px; box-shadow: var(--shadow-md); }
      .bias-card.good { border-color: var(--kygo-green); box-shadow: 0 8px 24px rgba(34,197,94,0.10); }
      .bias-tag { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-display); font-weight: 600; font-size: 12px; color: var(--fg-2); }
      .bias-tag .ico { width: 14px; height: 14px; color: var(--fg-3); }
      .bias-card.good .bias-tag .ico { color: var(--kygo-green-dark); }
      .bias-stat { font-family: var(--font-display); font-weight: 700; font-size: clamp(24px, 6vw, 36px); line-height: 1.05; letter-spacing: -0.02em; color: var(--fg-2); margin-top: 6px; }
      .bias-card.good .bias-stat { color: var(--kygo-green-dark); }
      .bias-stat small { font-size: 12px; font-weight: 500; color: var(--fg-3); }
      .bias-cap { font-family: var(--font-display); font-weight: 600; font-size: 11px; letter-spacing: 0.2px; text-transform: uppercase; color: var(--fg-3); }
      .bias-card.good .bias-cap { color: var(--kygo-green-dark); }
      .bias-card p { margin: 6px 0 0; font-size: 13px; line-height: 1.5; color: var(--fg-2); }
      .bias-note { grid-column: 1 / -1; display: flex; gap: 10px; align-items: flex-start; margin: 2px 0 0; font-size: 13px; line-height: 1.55; color: var(--fg-2); background: #fff; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 14px 16px; }
      .bias-note .ico { width: 16px; height: 16px; color: var(--kygo-green-dark); flex: none; margin-top: 2px; }
      .bias-note strong { color: var(--fg-1); font-weight: 600; }
      .bias-note em { font-style: normal; color: var(--fg-3); font-size: 12px; }

      /* "How to read it" rules under the tier matrix */
      .rank-rules { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 14px; }
      @media (min-width: 720px) { .rank-rules { grid-template-columns: repeat(3, 1fr); } }
      .rank-rule { display: flex; gap: 10px; align-items: flex-start; background: #fff; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 13px 15px; font-size: 12.5px; line-height: 1.5; color: var(--fg-2); }
      .rank-rule .ico { width: 15px; height: 15px; color: var(--kygo-green-dark); flex: none; margin-top: 2px; }
      .rank-rule strong { color: var(--fg-1); font-weight: 600; }
      .cmp-tier-row th { font-weight: 700; }

      /* Lab vs life split cards (same device, two numbers) */
      .splits { display: grid; grid-template-columns: 1fr; gap: 12px; }
      @media (min-width: 640px) { .splits { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 1000px) { .splits { grid-template-columns: repeat(3, 1fr); } }
      .split-card { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 16px; padding: 15px; box-shadow: var(--shadow-md); display: flex; flex-direction: column; gap: 12px; }
      .split-head { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 10px; }
      .split-head .brand-img.sm { width: 28px; height: 28px; border-radius: 8px; }
      .split-dev { font-family: var(--font-display); font-weight: 700; font-size: 13.5px; color: var(--fg-1); flex: 1 1 auto; min-width: 0; }
      .split-badge { margin-left: auto; font-family: var(--font-display); font-weight: 600; font-size: 9px; text-transform: uppercase; letter-spacing: 0.4px; color: var(--fg-3); background: var(--bg-raised); padding: 3px 8px; border-radius: 999px; white-space: nowrap; }
      .split-body { display: grid; grid-template-columns: 1fr auto 1fr; align-items: stretch; gap: 8px; }
      .split-stat { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; text-align: center; padding: 11px 6px; border-radius: 12px; }
      .split-stat.good { background: var(--kygo-green-light); }
      .split-stat.off { background: var(--bg-raised); }
      .split-lbl { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-display); font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap; }
      .split-lbl .ico { width: 12px; height: 12px; }
      .split-stat.good .split-lbl { color: var(--kygo-green-dark); }
      .split-stat.off .split-lbl { color: var(--fg-2); }
      .split-num { font-family: var(--font-display); font-weight: 700; font-size: clamp(19px, 4.4vw, 25px); line-height: 1.05; letter-spacing: -0.02em; }
      .split-stat.good .split-num { color: var(--kygo-green-dark); }
      .split-stat.off .split-num { color: var(--fg-1); }
      .trio { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .split-arrow { display: inline-flex; align-items: center; justify-content: center; color: var(--fg-3); }
      .split-arrow .ico { width: 18px; height: 18px; }
      .split-foot { margin: 0; font-size: 12px; line-height: 1.5; color: var(--fg-3); text-align: center; }
      .split-foot strong { color: var(--fg-1); font-weight: 600; display: block; margin-bottom: 3px; }

      /* Kygo CTA */
      .kygo-cta-card { background: var(--kygo-dark); border-radius: 24px; padding: 40px 24px; position: relative; overflow: hidden; color: #fff; text-align: center; display: flex; flex-direction: column; align-items: center; }
      @media (min-width: 720px) { .kygo-cta-card { padding: 56px 40px; } }
      .kygo-cta-card::before { content: ''; position: absolute; top: -160px; right: -160px; width: 520px; height: 520px; background: radial-gradient(closest-side, rgba(34,197,94,0.30), transparent); pointer-events: none; }
      .kygo-cta-card::after { content: ''; position: absolute; bottom: -180px; left: -180px; width: 480px; height: 480px; background: radial-gradient(closest-side, rgba(34,197,94,0.12), transparent); pointer-events: none; }
      .kygo-cta-card .cta-pill { position: relative; display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.16); color: #6EE7A0; padding: 6px 14px; border-radius: 999px; font-family: var(--font-display); font-size: 12px; font-weight: 600; border: 1px solid rgba(34,197,94,0.25); }
      .kygo-cta-card .cta-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 8px var(--kygo-green); }
      .kygo-cta-card h3 { position: relative; font-family: var(--font-display); font-weight: 600; color: #fff; font-size: clamp(26px, 4.5vw, 42px); line-height: 1.05; letter-spacing: -0.01em; margin: 18px 0 14px; max-width: 22ch; }
      .kygo-cta-card h3 span { color: var(--kygo-green); }
      .kygo-cta-card p { position: relative; color: rgba(255,255,255,0.72); font-size: clamp(14px, 1.6vw, 16px); line-height: 1.6; max-width: 56ch; margin: 0 auto 24px; }
      .kygo-cta-card .cta-btn-row { position: relative; display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; width: 100%; }
      @media (max-width: 560px) { .kygo-cta-card .cta-btn-row .btn-lg { width: 100%; justify-content: center; } }
      .kygo-cta-card .cta-works { position: relative; margin-top: 26px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: rgba(255,255,255,0.6); font-size: 13px; }
      .kygo-cta-card .cta-badges { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; justify-content: center; }
      @media (max-width: 560px) { .kygo-cta-card .cta-badges { display: grid; grid-template-columns: repeat(3, auto); justify-content: center; } }
      .kygo-cta-card .cta-badges img { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); padding: 4px; object-fit: contain; }

      /* ── Evidence-tier matrix (logo chart) ────────────────────────────── */
      .cmp { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; overflow: hidden; box-shadow: var(--shadow-md); }
      @media (min-width: 768px) { .cmp { border-radius: 22px; } }
      .cmp-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      @media (min-width: 768px) { .cmp-scroll { overflow-x: visible; } }
      .cmp-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 480px; }
      @media (min-width: 768px) { .cmp-table { min-width: 620px; } }
      .cmp-table th, .cmp-table td { padding: 0; vertical-align: middle; }
      .cmp-table thead th { font-family: var(--font-display); font-weight: 700; font-size: 10.5px; letter-spacing: 0.4px; text-transform: uppercase; color: #334155; text-align: center; padding: 12px 6px; border-bottom: 1px solid #CBD5E1; white-space: nowrap; background: #E2E8F0; }
      .cmp-table thead .cmp-th-device { text-align: left; padding-left: 14px; position: sticky; left: 0; z-index: 3; background: #E2E8F0; }
      .th-full { display: none; } .th-short { display: inline; }
      @media (min-width: 768px) {
        .th-full { display: inline; } .th-short { display: none; }
        .cmp-table thead th { font-size: 11px; padding: 14px 8px; }
      }
      .cmp-table tbody tr + tr td, .cmp-table tbody tr + tr th { border-top: 1px solid var(--border-subtle); }
      .cmp-table tbody tr:hover td, .cmp-table tbody tr:hover .cmp-td-device { background: var(--bg-surface); }
      .cmp-td-device { padding: 10px 5px; width: 88px; min-width: 88px; text-align: left; background: #fff; position: sticky; left: 0; z-index: 1; box-shadow: 1px 0 0 var(--border-subtle); }
      @media (min-width: 768px) { .cmp-td-device { padding: 10px 6px; width: 108px; min-width: 108px; } }
      .brand { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; }
      .brand-img { width: 38px; height: 38px; border-radius: 9px; background: var(--bg-raised); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
      .brand-img img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
      .brand-img.brand-img--icon { color: var(--fg-3); }
      .brand-img.brand-img--icon .ico { width: 18px; height: 18px; }
      .brand-img.sm { width: 34px; height: 34px; border-radius: 8px; }
      .brand-text { display: flex; flex-direction: column; min-width: 0; }
      .brand-name { font-family: var(--font-display); font-weight: 600; font-size: 11px; color: var(--fg-1); line-height: 1.2; overflow-wrap: anywhere; word-break: break-word; max-width: 86px; }
      @media (min-width: 768px) {
        .cmp-td-device { padding: 12px 14px 12px 8px; width: auto; min-width: 210px; position: static; box-shadow: none; }
        .brand { flex-direction: row; align-items: center; gap: 12px; text-align: left; }
        .brand-img { width: 42px; height: 42px; border-radius: 11px; }
        .brand-img.sm { width: 42px; height: 42px; border-radius: 11px; }
        .brand-name { font-size: 15px; max-width: none; }
      }
      .cmp-table tbody td { text-align: center; padding: 10px 6px; }
      @media (min-width: 768px) { .cmp-table tbody td { padding: 12px 8px; } }
      .vpill { display: inline-flex; align-items: center; font-family: var(--font-display); font-size: 11.5px; font-weight: 600; padding: 4px 11px; border-radius: 999px; line-height: 1.3; }
      .vpill.good { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .vpill.mid { background: var(--bg-raised); color: var(--fg-2); }
      .vpill.dark { background: var(--kygo-dark); color: #fff; }
      .amz-link { display: inline-flex; align-items: center; gap: 3px; font-family: var(--font-display); font-weight: 600; font-size: 11px; color: var(--kygo-green-dark); white-space: nowrap; }
      .amz-link .ico { width: 11px; height: 11px; transition: transform .15s; }
      .amz-link:hover { color: var(--kygo-green); }
      .amz-link:hover .ico { transform: translateX(2px); }
      .cell-note { display: block; font-size: 9.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; color: var(--fg-3); }
      .cmp-legend { display: flex; align-items: flex-start; gap: 8px; margin: 0; padding: 12px 16px 14px; font-size: 12px; line-height: 1.55; color: var(--fg-3); }
      .cmp-legend > span { min-width: 0; }
      .cmp-legend .ico { width: 13px; height: 13px; color: var(--kygo-green-dark); background: var(--kygo-green-light); border-radius: 50%; padding: 2px; box-sizing: content-box; flex: none; margin-top: 2px; }
      .cmp-legend strong { color: var(--fg-2); font-weight: 600; }
      .cmp-legend em { font-style: normal; color: var(--fg-3); }

      /* ── Interactive comparator ───────────────────────────────────────── */
      .cmpr { display: flex; flex-direction: column; gap: 16px; }
      .cmpr-picker-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 12px; }
      .cmpr-picker-title { font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--fg-1); }
      .cmpr-picker-hint { font-size: 12px; color: var(--fg-3); }
      .picker { display: flex; flex-wrap: wrap; gap: 6px; background: var(--bg-raised); border: 1px solid var(--border-subtle); border-radius: 16px; padding: 8px; }
      .pick-tile { display: inline-flex; align-items: center; gap: 5px; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 999px; padding: 4px 10px 4px 4px; cursor: pointer; transition: all .15s ease; font-family: var(--font-display); }
      .pick-tile:hover { border-color: var(--fg-3); }
      .pick-tile .brand-img.sm { width: 20px; height: 20px; border-radius: 6px; }
      .pick-name { font-weight: 600; font-size: 11.5px; color: var(--fg-1); line-height: 1.1; white-space: nowrap; }
      .pick-check { width: 13px; height: 13px; border-radius: 50%; background: var(--kygo-green); color: #fff; display: none; align-items: center; justify-content: center; flex: none; }
      .pick-check .ico { width: 8px; height: 8px; }
      .pick-tile.active { border-color: var(--kygo-green); background: rgba(34,197,94,0.06); box-shadow: 0 0 0 3px rgba(34,197,94,0.10); }
      .pick-tile.active .pick-name { color: var(--kygo-green-dark); }
      .pick-tile.active .pick-check { display: inline-flex; }

      .cmpr-out { display: flex; flex-direction: column; gap: 12px; }
      .cr-wrap { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; overflow: hidden; box-shadow: var(--shadow-md); }
      @media (min-width: 768px) { .cr-wrap { border-radius: 22px; } }
      .cr-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .cr-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 460px; }
      .cr-table th, .cr-table td { padding: 11px 7px; text-align: center; vertical-align: middle; }
      .cr-table thead th { background: #E2E8F0; border-bottom: 1px solid #CBD5E1; }
      .cr-table thead th.cr-corner { text-align: left; font-family: var(--font-display); font-weight: 700; font-size: 10px; letter-spacing: .4px; text-transform: uppercase; color: #334155; position: sticky; left: 0; z-index: 3; background: #E2E8F0; }
      .cr-dev { display: flex; flex-direction: column; align-items: center; gap: 5px; }
      .cr-dev .brand-img.sm { width: 30px; height: 30px; border-radius: 8px; }
      .cr-dev-name { font-family: var(--font-display); font-weight: 600; font-size: 11.5px; color: var(--fg-1); line-height: 1.15; }
      .cr-table tbody tr + tr th, .cr-table tbody tr + tr td { border-top: 1px solid var(--border-subtle); }
      .cr-table tbody th { text-align: left; position: sticky; left: 0; z-index: 1; background: #fff; box-shadow: 1px 0 0 var(--border-subtle); width: 120px; min-width: 120px; }
      .cr-metric { display: block; font-family: var(--font-body); font-weight: 600; font-size: 12px; color: var(--fg-1); line-height: 1.25; overflow-wrap: anywhere; }
      .cr-unit { display: block; margin-top: 2px; font-size: 10px; color: var(--fg-3); }
      .cr-dir { display: none; margin-top: 3px; font-family: var(--font-display); font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: .3px; color: var(--kygo-green-dark); }
      .cr-table tbody td .vpill { font-size: 11px; padding: 4px 9px; }
      @media (min-width: 768px) {
        .cr-table { min-width: 620px; }
        .cr-table th, .cr-table td { padding: 12px 10px; }
        .cr-table thead th.cr-corner { font-size: 10.5px; }
        .cr-dev .brand-img.sm { width: 34px; height: 34px; }
        .cr-dev-name { font-size: 12px; }
        .cr-table tbody th { width: 172px; min-width: 172px; }
        .cr-metric { font-size: 13px; }
        .cr-unit { font-size: 10.5px; }
        .cr-dir { display: block; }
      }
      .cr-table .vpill .ico { width: 11px; height: 11px; margin-left: 4px; }
      .cr-verdict { display: flex; gap: 12px; align-items: flex-start; background: var(--kygo-green-light); border: 1px solid rgba(34,197,94,0.28); border-radius: 14px; padding: 14px 16px; font-size: 13.5px; line-height: 1.55; color: var(--fg-1); }
      .cr-verdict .ico { width: 18px; height: 18px; color: var(--kygo-green-dark); flex: none; margin-top: 1px; }
      .cr-verdict strong { color: var(--kygo-green-dark); font-weight: 700; }
      .cmpr-empty { display: flex; gap: 10px; align-items: center; justify-content: center; background: #fff; border: 1.5px dashed var(--border-subtle); border-radius: 16px; padding: 28px 20px; color: var(--fg-3); font-size: 14px; text-align: center; }
      .cmpr-empty .ico { width: 18px; height: 18px; color: var(--kygo-green-dark); flex: none; }

      /* Device detail accordion */
      .dev-acc { display: grid; grid-template-columns: 1fr; gap: 10px; align-items: start; }
      @media (min-width: 768px) { .dev-acc { grid-template-columns: 1fr 1fr; gap: 12px; } }
      .dacc { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; overflow: hidden; box-shadow: var(--shadow-md); transition: border-color .2s, box-shadow .2s; }
      .dacc.is-validated { border-color: rgba(34,197,94,0.40); }
      .dacc[open] { box-shadow: var(--shadow-md); border-color: var(--kygo-green); }
      .dacc > summary { list-style: none; cursor: pointer; display: flex; align-items: center; gap: 12px; padding: 12px 14px; }
      .dacc > summary::-webkit-details-marker { display: none; }
      .dacc > summary:hover { background: var(--bg-surface); }
      .dacc .brand-img.sm { width: 40px; height: 40px; border-radius: 10px; flex: none; }
      .dacc-id { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
      .dacc-name { font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); line-height: 1.2; }
      .dacc-sub { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
      .dacc-sub .vpill { font-size: 10px; padding: 3px 9px; }
      .dacc-wear { font-family: var(--font-display); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; color: var(--fg-3); }
      .dacc-chev { color: var(--fg-3); flex: none; }
      .dacc-chev .ico { width: 16px; height: 16px; transition: transform .2s; }
      .dacc[open] .dacc-chev .ico { transform: rotate(90deg); color: var(--kygo-green-dark); }
      .dacc-body { padding: 0 14px 16px; display: flex; flex-direction: column; gap: 12px; }
      .dev-finding { background: var(--bg-surface); border-radius: 12px; padding: 12px 14px; margin-top: 4px; }
      .dev-finding.alt { background: #fff; border: 1px solid var(--border-subtle); margin-top: 0; }
      .dev-label { font-family: var(--font-display); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--fg-3); }
      .dev-finding p { margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: var(--fg-1); }
      .dev-finding.alt p { color: var(--fg-2); }
      .dmetrics { display: grid; grid-template-columns: 1fr; gap: 8px; }
      @media (min-width: 460px) { .dmetrics { grid-template-columns: 1fr 1fr; } }
      .dmetric { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 11px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
      .dm-lbl { font-family: var(--font-display); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: var(--fg-3); }
      .dm-vals { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
      .dm-tag { font-family: var(--font-display); font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; color: var(--fg-3); }
      .dev-facts { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
      .dev-facts li { display: grid; grid-template-columns: 22px 1fr; gap: 9px; font-size: 13px; line-height: 1.45; color: var(--fg-2); }
      .dev-facts .fct-ico { width: 22px; height: 22px; border-radius: 6px; background: var(--bg-raised); color: var(--fg-3); display: inline-flex; align-items: center; justify-content: center; }
      .dev-facts .fct-ico.ok { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .dev-facts .fct-ico .ico { width: 13px; height: 13px; }
      .dev-facts strong { color: var(--fg-1); font-weight: 600; display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; }
      .dev-amazon { margin-top: auto; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 14px; border-radius: 10px; border: 1.5px solid var(--kygo-green-light); background: rgba(34,197,94,0.06); color: var(--kygo-green-dark); font-family: var(--font-body); font-weight: 600; font-size: 13px; transition: all .15s ease; }
      .dev-amazon:hover { border-color: var(--kygo-green); background: rgba(34,197,94,0.12); }
      .dev-amazon .ico { width: 14px; height: 14px; transition: transform .15s; }
      .dev-amazon:hover .ico { transform: translateX(2px); }
      .aff-disclosure { display: flex; gap: 10px; align-items: flex-start; margin: 20px 0 0; font-size: 12.5px; line-height: 1.55; color: var(--fg-3); font-style: italic; }
      .aff-disclosure .ico { width: 15px; height: 15px; color: var(--kygo-green-dark); flex: none; margin-top: 2px; }

      /* Fact cards */
      .sig-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
      @media (min-width: 620px) { .sig-grid { grid-template-columns: 1fr 1fr; } }
      .sig-card { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 8px; box-shadow: var(--shadow-md); }
      .sig-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
      .fact-ico { width: 34px; height: 34px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; }
      .fact-ico .ico { width: 17px; height: 17px; }
      .fact-ico.tone-good { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .fact-ico.tone-mid { background: var(--bg-raised); color: var(--fg-2); }
      .fact-ico.tone-dark { background: var(--kygo-dark); color: #fff; }
      .sig-rank { font-family: var(--font-display); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: var(--fg-3); }
      .sig-name { font-family: var(--font-display); font-weight: 600; font-size: 15px; margin: 2px 0 0; line-height: 1.3; color: var(--fg-1); }
      .sig-find { margin: 0; font-size: 13px; line-height: 1.55; color: var(--fg-2); }
      .sig-src { margin-top: auto; padding-top: 8px; font-size: 11.5px; color: var(--fg-3); border-top: 1px solid var(--border-subtle); }

      /* Ranked bars (walking speed, wear position) */
      .act { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 16px 18px 6px; box-shadow: var(--shadow-md); }
      @media (min-width: 768px) { .act { border-radius: 22px; padding: 20px 24px 8px; } }
      .act-head { display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: baseline; padding: 0 0 10px; border-bottom: 1px solid var(--border-subtle); }
      .act-head-l { font-family: var(--font-display); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; color: var(--fg-3); }
      .act-head-r { justify-self: end; text-align: right; font-family: var(--font-display); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; color: var(--kygo-green-dark); line-height: 1.3; }
      .act-row { display: grid; grid-template-columns: 104px 1fr 74px; gap: 10px; align-items: center; padding: 12px 0 4px; }
      .act-row + .act-row, .act-note + .act-row { border-top: 1px solid var(--border-subtle); }
      @media (min-width: 560px) { .act-row { grid-template-columns: 160px 1fr 88px; gap: 14px; } }
      .act-lbl { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
      .act-name { font-family: var(--font-display); font-weight: 600; font-size: 13px; color: var(--fg-1); line-height: 1.2; overflow-wrap: anywhere; }
      .act-sub { font-size: 10px; color: var(--fg-3); line-height: 1.25; }
      .act-track { height: 12px; border-radius: 999px; background: var(--bg-raised); overflow: hidden; }
      .act-fill { display: block; height: 100%; border-radius: 999px; }
      .act-fill.good { background: var(--kygo-green); }
      .act-fill.ok { background: #86EFAC; }
      .act-fill.poor { background: #CBD5E1; }
      .act-val { justify-self: end; font-family: var(--font-numeric); font-size: 11px; padding: 4px 9px; text-align: center; }
      .act-note { margin: 0 0 10px; font-size: 11.5px; line-height: 1.45; color: var(--fg-3); }
      @media (min-width: 560px) { .act-note { padding-left: 174px; } }
      .act .cmp-legend { padding: 12px 0 12px; }

      /* Claim vs reality */
      .claim-acc { display: grid; grid-template-columns: 1fr; gap: 10px; align-items: start; }
      @media (min-width: 768px) { .claim-acc { grid-template-columns: 1fr 1fr; gap: 12px; } }
      .claim-item { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; overflow: hidden; box-shadow: var(--shadow-md); transition: border-color .2s; }
      .claim-item.good { border-color: rgba(34,197,94,0.40); }
      .claim-item[open] { border-color: var(--kygo-green); }
      .claim-item > summary { list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; }
      .claim-item > summary::-webkit-details-marker { display: none; }
      .claim-item > summary:hover { background: var(--bg-surface); }
      .claim-brand { font-family: var(--font-display); font-weight: 700; font-size: 15px; color: var(--fg-1); line-height: 1.25; }
      .claim-sum-right { display: inline-flex; align-items: center; gap: 10px; flex: none; }
      .claim-chev { color: var(--fg-3); display: inline-flex; }
      .claim-chev .ico { width: 15px; height: 15px; transition: transform .2s; }
      .claim-item[open] .claim-chev .ico { transform: rotate(90deg); color: var(--kygo-green-dark); }
      .claim-body { padding: 0 16px 16px; display: flex; flex-direction: column; gap: 10px; }
      .claim-quote { display: flex; gap: 8px; align-items: flex-start; margin: 0; background: var(--bg-surface); border-left: 3px solid var(--border-subtle); border-radius: 0 10px 10px 0; padding: 10px 12px; font-size: 13px; font-style: italic; color: var(--fg-2); line-height: 1.5; }
      .claim-item.good .claim-quote { border-left-color: var(--kygo-green); }
      .claim-quote .ico { width: 14px; height: 14px; color: var(--fg-3); flex: none; margin-top: 2px; font-style: normal; }
      .claim-reality { margin: 0; font-size: 13px; line-height: 1.55; color: var(--fg-1); }
      .claim-reality strong { font-weight: 600; }
      .claim-src { padding-top: 8px; font-size: 11px; color: var(--fg-3); border-top: 1px solid var(--border-subtle); }

      /* Bottom line */
      .bottomline { background: var(--kygo-dark); color: rgba(255,255,255,0.82); border-radius: 22px; padding: 32px 26px; position: relative; overflow: hidden; }
      @media (min-width: 720px) { .bottomline { padding: 44px 40px; } }
      .bottomline::before { content: ''; position: absolute; top: -120px; right: -120px; width: 360px; height: 360px; background: radial-gradient(closest-side, rgba(34,197,94,0.22), transparent); pointer-events: none; }
      .bottomline-tag { position: relative; display: inline-flex; font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: #6EE7A0; background: rgba(34,197,94,0.14); border: 1px solid rgba(34,197,94,0.25); padding: 6px 12px; border-radius: 999px; margin-bottom: 18px; }
      .bottomline p { position: relative; font-size: clamp(15px, 1.8vw, 18px); line-height: 1.65; margin: 0 0 14px; }
      .bottomline p:last-child { margin-bottom: 0; }
      .bottomline strong { color: #fff; font-weight: 600; }

      /* Blog CTA */
      .blog-cta { display: grid; grid-template-columns: auto 1fr auto; gap: 18px; align-items: center; background: linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(34,197,94,0.02) 100%); border: 1.5px solid var(--kygo-green-light); border-radius: 18px; padding: 22px; transition: all .25s var(--ease-out); color: var(--fg-1); }
      .blog-cta:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); transform: translateY(-2px); }
      .blog-cta-tag { display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 999px; background: #fff; border: 1.5px solid var(--kygo-green-light); color: var(--kygo-green-dark); font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; white-space: nowrap; }
      .blog-cta-body { min-width: 0; }
      .blog-cta-kicker { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--kygo-green-dark); margin-bottom: 4px; }
      .blog-cta-title { font-family: var(--font-display); font-size: clamp(15px, 2vw, 18px); font-weight: 600; color: var(--fg-1); line-height: 1.3; }
      .blog-cta-sub { font-size: 13px; color: var(--fg-2); margin-top: 4px; line-height: 1.5; }
      .blog-cta-arrow { width: 44px; height: 44px; border-radius: 50%; background: var(--kygo-green); color: #fff; display: inline-flex; align-items: center; justify-content: center; flex: none; box-shadow: 0 4px 12px rgba(34,197,94,0.30); }
      .blog-cta-arrow .ico { width: 20px; height: 20px; }
      @media (max-width: 600px) {
        .blog-cta { grid-template-columns: 1fr auto; grid-template-areas: 'tag arrow' 'body body'; padding: 18px; gap: 14px; }
        .blog-cta-tag { grid-area: tag; justify-self: start; }
        .blog-cta-arrow { grid-area: arrow; width: 40px; height: 40px; }
        .blog-cta-body { grid-area: body; }
      }

      /* Thin app-download band */
      .kband { max-width: 1100px; margin: 0 auto; }
      .kband-inner { position: relative; overflow: hidden; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; padding: 28px 32px; display: flex; align-items: center; justify-content: space-between; gap: 36px; box-shadow: var(--shadow-md); }
      .kband-glow { position: absolute; top: -120px; right: -80px; width: 360px; height: 360px; background: radial-gradient(circle, rgba(34,197,94,0.14), transparent 65%); pointer-events: none; }
      .kband-copy { position: relative; display: flex; flex-direction: column; gap: 8px; flex: 1 1 auto; min-width: 0; max-width: 640px; }
      .kband-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: var(--font-display); font-weight: 600; font-size: 11px; letter-spacing: 0.7px; text-transform: uppercase; color: var(--kygo-green-dark); }
      .kband-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--kygo-green); animation: kygoPulse 2s ease-out infinite; }
      .kband-headline { margin: 0; font-family: var(--font-display); font-weight: 600; font-size: clamp(18px, 2.4vw, 23px); line-height: 1.3; color: var(--fg-1); }
      .kband-actions { position: relative; display: flex; flex-wrap: wrap; gap: 12px; flex: 0 0 auto; max-width: 470px; }
      .kband-note { flex-basis: 100%; width: 100%; margin: 4px 0 0; font-size: 12.5px; line-height: 1.5; color: var(--fg-2); text-align: center; }
      .kband-btn { display: inline-flex; align-items: center; gap: 9px; text-decoration: none; font-family: var(--font-display); font-weight: 600; font-size: 15px; padding: 14px 22px; border-radius: 12px; white-space: nowrap; transition: transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease; }
      .kband-btn .ico { width: 17px; height: 17px; flex-shrink: 0; }
      .kband-btn-ios { background: var(--kygo-green); color: #fff; box-shadow: 0 6px 16px rgba(34,197,94,0.28); }
      .kband-btn-ios:hover { background: var(--kygo-green-dark); transform: translateY(-2px); box-shadow: 0 10px 20px rgba(34,197,94,0.3); }
      .kband-btn-android { background: #fff; color: var(--kygo-green-dark); border: 1.5px solid var(--border-subtle); }
      .kband-btn-android:hover { border-color: var(--kygo-green); transform: translateY(-2px); }
      @media (max-width: 820px) {
        .kband-inner { flex-direction: column; align-items: flex-start; gap: 22px; padding: 26px 22px; }
        .kband-actions { width: 100%; max-width: none; flex-direction: column; }
        .kband-btn { width: 100%; justify-content: center; }
      }
      @keyframes kygoPulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); } 70% { box-shadow: 0 0 0 7px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }
      @media (prefers-reduced-motion: reduce) { .kband-dot { animation: none; } }

      /* FAQ */
      .faq { display: flex; flex-direction: column; gap: 10px; }
      .faq details { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; padding: 4px 20px; transition: border-color .2s; }
      .faq details[open] { border-color: var(--kygo-green); }
      .faq summary { list-style: none; padding: 16px 0; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 14px; }
      .faq summary::-webkit-details-marker { display: none; }
      .faq summary::after { content: '+'; color: var(--kygo-green-dark); font-weight: 600; font-size: 22px; transition: transform .2s; line-height: 1; }
      .faq details[open] summary::after { content: '\\2212'; }
      .faq .body { padding: 0 0 16px; color: var(--fg-2); font-size: 14px; line-height: 1.65; }

      /* Related tools */
      .related-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
      @media (min-width: 720px) { .related-grid { grid-template-columns: repeat(3, 1fr); gap: 22px; } }
      .related-card {
        position: relative; display: flex; flex-direction: column;
        background: var(--bg-canvas); border: 1px solid var(--border-subtle);
        border-radius: 18px; overflow: hidden; text-decoration: none; color: inherit;
        box-shadow: 0 2px 12px rgba(15,23,42,.05);
        transition: transform .25s var(--ease-out), box-shadow .25s var(--ease-out), border-color .25s var(--ease-out);
      }
      .related-card::after {
        content: ''; position: absolute; left: 0; right: 0; top: 0; height: 3px;
        background: linear-gradient(90deg, var(--kygo-green), var(--kygo-green-dark));
        opacity: 0; transition: opacity .25s ease; pointer-events: none;
      }
      .related-card:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(15,23,42,.10); border-color: #CBD5E1; }
      .related-card:hover::after { opacity: 1; }
      .rc-media { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: var(--bg-raised); display: flex; align-items: center; justify-content: center; }
      .rc-panel { display: block; background: var(--bg-canvas); border: 1px solid #EAECEF; border-radius: 14px; box-shadow: 0 6px 18px rgba(15,23,42,.08); padding: 13px 15px; width: 78%; }
      .rc-cap { display: block; font-family: var(--font-display); font-weight: 600; font-size: 9px; letter-spacing: .6px; text-transform: uppercase; color: var(--fg-3); margin-bottom: 8px; }
      .rc-body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 7px; }
      .rc-title { font-family: var(--font-display); font-weight: 600; font-size: 17px; line-height: 1.25; letter-spacing: -.01em; color: var(--fg-1); }
      .rc-blurb { font-family: var(--font-body); font-size: 13.5px; line-height: 1.55; color: var(--fg-2); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .rc-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 5px; }
      .rc-meta { font-family: var(--font-body); font-size: 12px; font-weight: 500; color: var(--fg-3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .rc-open { display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; font-family: var(--font-body); font-size: 13px; font-weight: 600; color: var(--kygo-green-dark); }
      .rc-open .ico { width: 15px; height: 15px; }

      /* Sources · compact link list */
      .sources { display: grid; grid-template-columns: 1fr; gap: 8px; }
      @media (min-width: 600px) { .sources { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 960px) { .sources { grid-template-columns: repeat(3, 1fr); } }
      .src { display: flex; flex-direction: column; gap: 4px; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 12px; padding: 12px 14px; transition: border-color .15s, box-shadow .15s; }
      a.src:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); }
      .src--nolink { background: var(--bg-surface); border-style: dashed; }
      .src-tag { align-self: flex-start; font-family: var(--font-display); font-size: 9.5px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--kygo-green-dark); }
      .src--nolink .src-tag { color: var(--fg-3); }
      .src-title { font-family: var(--font-display); font-weight: 600; font-size: 13.5px; color: var(--fg-1); line-height: 1.3; }
      a.src:hover .src-title { color: var(--kygo-green-dark); }
      .src-cite { display: inline-flex; align-items: baseline; gap: 5px; flex-wrap: wrap; font-size: 11.5px; color: var(--fg-3); line-height: 1.35; }
      .src-go { display: inline-flex; color: var(--kygo-green-dark); }
      .src-go .ico { width: 12px; height: 12px; transition: transform .15s; }
      a.src:hover .src-go .ico { transform: translate(1px,-1px); }

      /* Footer */
      .tool-footer { padding: 56px 20px 40px; background: var(--kygo-light); color: var(--fg-2); border-top: 1px solid var(--border-subtle); }
      .tool-footer .container { max-width: 720px; margin: 0 auto; text-align: center; padding: 0; }
      .footer-brand { display: inline-flex; align-items: center; gap: 10px; color: var(--fg-1); font-family: var(--font-display); font-weight: 700; font-size: 17px; }
      .footer-logo { width: 28px; height: 28px; }
      .footer-tagline { color: var(--fg-3); font-size: 14px; margin: 10px 0 22px; }
      .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 18px; margin-bottom: 28px; font-size: 14px; }
      .footer-links a { color: var(--fg-2); }
      .footer-links a:hover { color: var(--kygo-green-dark); }
      .footer-disclaimer { font-size: 12px; color: var(--fg-3); line-height: 1.6; max-width: 620px; margin: 0 auto 14px; }
      .footer-copyright { font-size: 12px; color: var(--fg-3); margin: 4px 0; }
      .footer-affiliate { font-style: italic; }

      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
      }
    `;
  }
}

if (!customElements.get('kygo-step-count-accuracy')) {
  customElements.define('kygo-step-count-accuracy', KygoStepCountAccuracy);
}
