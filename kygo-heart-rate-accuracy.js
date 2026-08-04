/**
 * Kygo Health · Most Accurate Heart Rate Wearable Comparison Tool
 * Tag name: kygo-heart-rate-accuracy
 * Which consumer wearable is most accurate for heart rate vs a criterion standard (ECG / chest strap)?
 * Ranks 10 devices on one 45-person protocol (Gielen 2026) by median MAPE, MAE, bias, limits of
 * agreement and CCC, with the axis that decides every number: steady/rest vs irregular arm movement.
 * Data: Heart-Rate-Accuracy research v2.1 (Gielen 2026, Van Oost 2025, Dial 2025, Miller 2022,
 * Zhang 2020, Ceugniez 2025, Vermunicht 2025, Lee 2026, Lambe 2026, Chevance 2022, Fuller 2020,
 * Quinn 2024, Moghaddam 2026, Navalta 2025, Hung 2025, Singh 2024, Kitagaki 2025).
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

class KygoHeartRateAccuracy extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._selected = null; // Set of device ids chosen in the comparator
    this._wired = false;
  }

  connectedCallback() {
    if (!this._selected) {
      // Default to the top three by daytime MAPE (Fitbit Charge 6, Garmin Vivoactive 5, Pixel Watch 2)
      this._selected = new Set(this._devices.slice(0, 3).map(d => this._did(d)));
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

  // ── Interactivity: one delegated listener on the shadow root so it
  //    survives the innerHTML swap of the comparator result region ─────────
  _wire() {
    if (this._wired) return;
    this._wired = true;
    this.shadowRoot.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-cmpr-id]');
      if (chip) { this._toggleDevice(chip.getAttribute('data-cmpr-id')); return; }
    });
  }

  _toggleDevice(id) {
    const sel = this._selected;
    if (sel.has(id)) { if (sel.size > 2) sel.delete(id); }      // keep a minimum of 2
    else { if (sel.size < 4) sel.add(id); }                     // cap at 4
    const root = this.shadowRoot;
    root.querySelectorAll('[data-cmpr-id]').forEach(c => {
      const on = sel.has(c.getAttribute('data-cmpr-id'));
      c.classList.toggle('active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const out = root.querySelector('[data-cmpr-out]');
    if (out) out.innerHTML = this._renderCmprResult();
  }

  // ── Brand product images (shared Wix assets, by device key) ─────────────

  _deviceImage(key) {
    return ({
      garmin:  'https://static.wixstatic.com/media/273a63_c545c093c04d4ca4ade77e5ca43fd433~mv2.png',
      apple:   'https://static.wixstatic.com/media/273a63_68b4900c356b4d0c8982e5ecd10f04fe~mv2.png',
      polar:   'https://static.wixstatic.com/media/273a63_e7e3c05ed0bc4cec8f456cd7f995e70b~mv2.png',
      fitbit:  'https://static.wixstatic.com/media/273a63_c12bab319dc34737a386c7449f5f92c7~mv2.png',
      oura:    'https://static.wixstatic.com/media/273a63_722e50e1a554453eb4c71a2e7a58925d~mv2.png'
    })[key] || null; // google (Pixel) and xiaomi fall back to a neutral type icon
  }

  _deviceLogo(d, size) {
    const img = this._deviceImage(d.key);
    const cls = size === 'sm' ? 'brand-img sm' : 'brand-img';
    return img
      ? `<span class="${cls}"><img src="${img}" alt="${d.name}" loading="lazy" /></span>`
      : `<span class="${cls} brand-img--icon">${this._typeIcon(d.type)}</span>`;
  }

  // ── Device data (Gielen 2026: 10 devices, one 45-person protocol, Zephyr strap) ──
  //    Ordered best to worst by median MAPE. MAPE and MAE are MEDIANS.

  get _devices() {
    return [
      {
        key: 'fitbit', name: 'Fitbit Charge 6', short: 'Fitbit Charge 6', chip: 'Charge 6', type: 'watch',
        method: 'Wrist band, optical PPG plus motion; Fitbit HR algorithm.',
        mape: 5.5, mae: 4.5, bias: 0.7, loLo: -11.2, loHi: 12.7, ccc: 0.93,
        independent: 'The single most accurate of ten devices on one 45-person protocol: median MAPE 5.5%, the tightest limits of agreement in the table (-11.2 to +12.7) and the only CCC above 0.90. It still does not clear the 5% acceptability line cleanly, and this is a daytime-motion figure, not a marketing sleep number.',
        vendorClaim: 'Google says a 2023 update made HR tracking "40% more accurate" for vigorous activity, but that claim attaches to the Pixel Watch 2, not the Charge 6, and cites no baseline, reference standard or study.',
        bestFor: 'The most accurate wrist device in the only clean 10-device head-to-head',
        weakestFor: 'Still above the 5% line; racquet sport and rowing degrade it like any wrist PPG',
        affiliateUrl: 'https://www.amazon.com/s?k=Fitbit%3A&rh=p_123%3A213215&tag=kygohealthapp-20', trackLabel: 'fitbit-search'
      },
      {
        key: 'garmin', name: 'Garmin Vivoactive 5', short: 'Garmin Vivoactive 5', chip: 'Vivoactive 5', type: 'watch',
        method: 'Wrist watch, optical HR (Elevate) plus motion.',
        mape: 6.3, mae: 5.1, bias: -1.0, loLo: -18.6, loHi: 16.7, ccc: 0.83,
        independent: 'Second of ten (6.3% MAPE, CCC 0.83). Garmin is inconsistent rather than uniformly bad: strong here and in some resting data, weaker in others. It is also the only major brand that publishes no wrist-HR accuracy figure of its own.',
        vendorClaim: 'Garmin publishes no numerical wrist-HR accuracy figure at all, alone among the major brands. Device manuals redirect to a general accuracy page with no number.',
        bestFor: 'A strong all-round daytime result and reliable steady-cardio tracking',
        weakestFor: 'No published accuracy data to check a claim against; wide agreement limits',
        affiliateUrl: 'https://www.amazon.com/s?k=garmin%20fitness%20tracker&tag=kygohealthapp-20', trackLabel: 'garmin-search'
      },
      {
        key: 'google', name: 'Google Pixel Watch 2', short: 'Pixel Watch 2', chip: 'Pixel Watch 2', type: 'watch',
        method: 'Wrist watch, multi-path optical HR sensor plus motion.',
        mape: 6.7, mae: 4.9, bias: -0.4, loLo: -15.0, loHi: 14.2, ccc: 0.87,
        independent: 'Third of ten (6.7% MAPE) with the second-tightest limits of agreement (-15.0 to +14.2) and CCC 0.87. Independently validated by Gielen 2026, which corrected earlier lists that had called it unvalidated.',
        vendorClaim: 'Google\'s "40% more accurate for vigorous activity" claim is specifically for this device, but it gives no baseline, no reference standard and no supporting study.',
        bestFor: 'Tight, well-centered readings across a mixed daytime protocol',
        weakestFor: 'Vendor claim is unquantified; motion still degrades it like any watch',
        affiliateUrl: 'https://www.amazon.com/s?k=google%20pixel%20watch&tag=kygohealthapp-20', trackLabel: 'google-pixel-watch-search'
      },
      {
        key: 'apple', name: 'Apple Watch SE', short: 'Apple Watch SE', chip: 'Apple SE', type: 'watch',
        method: 'Wrist watch, second-gen optical HR sensor plus motion.',
        mape: 7.3, mae: 5.0, bias: 0.9, loLo: -21.4, loHi: 23.0, ccc: 0.70,
        independent: 'A textbook Rule 1 row: near-zero bias (+0.9 bpm) but the sixth-widest limits of agreement of ten (-21.4 to +23.0) and a CCC of only 0.70. The average looks excellent while individual readings swing hard. Note the tested device is the budget SE, not a flagship.',
        vendorClaim: 'Apple\'s own white paper (Nov 2024, 100,000+ workouts) is the most transparent disclosure in the category: within 5 bpm 98% sedentary, 96% cycling, down to 87% walking. Its background algorithm reads 89% within 5 bpm on Series 6+ versus 72% on the SE and Series 4-5.',
        bestFor: 'A tiny mean bias and strong transparency from Apple\'s own data',
        weakestFor: 'Wide swings (low CCC 0.70); the flagship sensor was not the one tested',
        affiliateUrl: 'https://www.amazon.com/s?k=Apple%20Watch&rh=p_123%3A110955&tag=kygohealthapp-20', trackLabel: 'apple-watch-search'
      },
      {
        key: 'garmin', name: 'Garmin Vivosmart 5', short: 'Garmin Vivosmart 5', chip: 'Vivosmart 5', type: 'watch',
        method: 'Wrist band, optical HR (Elevate) plus motion.',
        mape: 8.1, mae: 7.0, bias: 4.8, loLo: -15.8, loHi: 25.4, ccc: 0.78,
        independent: 'Fifth of ten (8.1% MAPE) but a +4.8 bpm over-read, the largest positive bias in the table. It posts strong correlations elsewhere (r 0.96 to 0.97 in Lee 2026 resistance testing), so the story is a consistent upward offset rather than noise.',
        vendorClaim: 'As with all Garmin hardware, no numerical wrist-HR accuracy figure is published.',
        bestFor: 'Consistent, predictable behavior (a steady over-read you can mentally adjust)',
        weakestFor: 'Systematically reads about 5 bpm high; no vendor figure to verify',
        affiliateUrl: 'https://www.amazon.com/s?k=garmin%20fitness%20tracker&tag=kygohealthapp-20', trackLabel: 'garmin-search'
      },
      {
        key: 'polar', name: 'Polar Ignite 3', short: 'Polar Ignite 3', chip: 'Ignite 3', type: 'watch',
        method: 'Wrist watch, Polar Precision Prime optical sensor.',
        mape: 11.2, mae: 9.5, bias: -4.3, loLo: -31.4, loHi: 22.9, ccc: 0.63,
        independent: 'Mid-pack (11.2% MAPE, CCC 0.63) and notably heat-sensitive: its error roughly doubled in a hot climate chamber (9.5% to 18.2%). Polar is unusual in publishing its own weak numbers for strength and team sport.',
        vendorClaim: 'Polar is the only brand publishing its own bad numbers: overall MAE 4.4 bpm (3.7%), but strength training 5.8 bpm and floorball 12.6 bpm in its Precision Prime and Elixir white papers.',
        bestFor: 'An honest manufacturer that publishes its weak cases',
        weakestFor: 'Below the acceptability line, and heat degrades it sharply',
        affiliateUrl: 'https://www.amazon.com/s?k=Polar%20fitness%20tracker&rh=p_123%3A255287&tag=kygohealthapp-20', trackLabel: 'polar-search'
      },
      {
        key: 'xiaomi', name: 'Xiaomi Watch 2', short: 'Xiaomi Watch 2', chip: 'Xiaomi 2', type: 'watch',
        method: 'Wrist watch, optical HR sensor plus motion.',
        mape: 11.9, mae: 9.1, bias: -3.0, loLo: -33.3, loHi: 27.2, ccc: 0.69,
        independent: '11.9% MAPE with the second-widest limits of agreement in the table (-33.3 to +27.2). Beyond this single study there is no independent or manufacturer HR validation to check it against.',
        vendorClaim: 'No independent or manufacturer HR-accuracy figure is published for the Watch 2.',
        bestFor: 'Budget option; acceptable at rest like most wrist PPG',
        weakestFor: 'Wide swings under motion and no validation record',
        affiliateUrl: 'https://www.amazon.com/s?k=xiaomi%20smart%20watch&tag=kygohealthapp-20', trackLabel: 'xiaomi-watch-search'
      },
      {
        key: 'polar', name: 'Polar Pacer', short: 'Polar Pacer', chip: 'Polar Pacer', type: 'watch',
        method: 'Wrist watch, Polar Precision Prime optical sensor.',
        mape: 13.1, mae: 9.7, bias: -3.9, loLo: -29.7, loHi: 21.8, ccc: 0.66,
        independent: '13.1% MAPE and CCC 0.66, below the acceptability line on this mixed daytime protocol. Like the Ignite 3, it under-reads on average, so it tends to tell you that you worked less hard than you did.',
        vendorClaim: 'Covered by Polar\'s Precision Prime white-paper figures (overall MAE 4.4 bpm), which are far better than this independent mixed-protocol result.',
        bestFor: 'Running-focused watch; steady cardio is its easy case',
        weakestFor: 'Above the error line on mixed movement; tends to under-read',
        affiliateUrl: 'https://www.amazon.com/s?k=Polar%20fitness%20tracker&rh=p_123%3A255287&tag=kygohealthapp-20', trackLabel: 'polar-search'
      },
      {
        key: 'oura', name: 'Oura Ring Gen 3', short: 'Oura Ring Gen 3', chip: 'Oura Gen 3', type: 'ring',
        method: 'Finger ring, optical PPG plus temperature.',
        mape: 15.0, mae: 11.0, bias: -7.1, loLo: -35.5, loHi: 21.3, ccc: 0.61,
        nightNote: '1.67% at night',
        independent: 'The split-personality device: best in the field at night (1.67% MAPE against ECG, Dial 2025) but 9th of 10 by day (15.0% MAPE), because a finger sensor is not motion-artifact resistant. It is the clearest proof that "rings are more accurate" is marketing, not data.',
        vendorClaim: 'Oura markets resting-HR r-squared of 0.996, but that traces to a study whose authors are all Oura-affiliated, and it is a nightly-average figure; for 5-minute segments it falls to about 0.87.',
        bestFor: 'Nocturnal resting heart rate and the vitals measured while you sleep',
        weakestFor: 'Daytime and any movement; 9th of 10 by day despite topping night',
        affiliateUrl: 'https://www.amazon.com/dp/B0CSRF3Y2F?tag=kygohealthapp-20&th=1', trackLabel: 'oura-ring-gen3'
      },
      {
        key: 'fitbit', name: 'Fitbit Inspire 3', short: 'Fitbit Inspire 3', chip: 'Inspire 3', type: 'watch',
        method: 'Wrist band, optical PPG plus motion; Fitbit HR algorithm.',
        mape: 16.5, mae: 14.3, bias: -14.4, loLo: -51.3, loHi: 22.5, ccc: 0.45,
        nightNote: '5.4% in patients',
        independent: 'Worst of ten here (16.5% MAPE, under-reading by 14 bpm, CCC 0.45). But do not over-read it: the same device measured 5.40% MAPE against ECG in cardiac patients during exercise testing (Kitagaki 2025). Protocol and population, not the device alone, drive the number.',
        vendorClaim: 'Google\'s 2023 "40% more accurate" line is often misapplied to the Inspire and Charge; it was specific to the Pixel Watch 2 and carries no study.',
        bestFor: 'A cheap tracker that is far more accurate at rest than this row suggests',
        weakestFor: 'Worst mixed-motion result of the ten; large under-read',
        affiliateUrl: 'https://www.amazon.com/s?k=Fitbit%3A&rh=p_123%3A213215&tag=kygohealthapp-20', trackLabel: 'fitbit-search'
      }
    ];
  }

  // ── Fixed facts (true regardless of device) ─────────────────────────────

  get _facts() {
    return [
      { icon: 'alert', tone: 'dark', tag: 'Rule 1', title: 'Mean bias hides the real error',
        body: 'Apple\'s pooled bias across 22 studies is -0.27 bpm, which sounds near perfect. The limits of agreement on the same data are -7.2 to +6.6 bpm. A bias near zero just means over-reads and under-reads cancelled out. Always read MAPE and the limits of agreement, never the bias figure a brand quotes.',
        src: 'Lambe 2026 (Apple Watch meta-analysis)' },
      { icon: 'moon', tone: 'good', tag: 'The easy case', title: 'Every device is accurate at night',
        body: 'A still body and steady blood flow make resting heart rate the easy case: nocturnal error is about 1.7 to 3% for Oura, WHOOP and Polar. Almost every manufacturer accuracy claim is built on sleep or resting data, then quoted as if it held all day.',
        src: 'Dial 2025 · Miller 2022' },
      { icon: 'layers', tone: 'mid', tag: 'Rule 3', title: 'The model matters more than the brand',
        body: 'On one sample, the Fitbit Charge 6 was the single most accurate of ten devices (5.5% MAPE) and the Fitbit Inspire 3 the single worst (16.5%). Any claim of the form "Fitbit is accurate" without a model number is meaningless. Generation, protocol and population all move the number more than brand does.',
        src: 'Gielen 2026' },
      { icon: 'heart', tone: 'dark', tag: 'Irregular rhythm', title: 'Atrial fibrillation breaks it further',
        body: 'During peak exercise in AF the average error jumps to about 29 bpm, versus 14 bpm in normal rhythm, and devices under-read far more often than they over-read (61% vs 25% of readings). It is the rhythm during the reading that matters, not the diagnosis on your chart.',
        src: 'Quinn 2024' },
      { icon: 'user', tone: 'mid', tag: 'Skin & ink', title: 'Skin tone is fine at rest, off under load',
        body: 'Pooled data shows no significant pulse-rate bias by skin pigmentation at rest. Above roughly 60% effort, one study found medium and dark skin about 11.8 bpm off while light skin stayed accurate. Tattoos directly over the sensor also attenuate the signal, worst at rest.',
        src: 'Singh 2024 · Hung 2025 · Navalta 2025' },
      { icon: 'watch', tone: 'good', tag: 'Free levers', title: 'Where you wear it changes the number',
        body: 'Moving a watch from one finger-width to three finger-widths above the wrist bone cut error by about 11 points and raised agreement from 0.59 to 0.92. A snug band, worn higher on the arm on bare unmarked skin, is the cheapest accuracy upgrade there is.',
        src: 'Vermunicht 2025' }
    ];
  }

  // ── Sources (compact link list, all shown) ──────────────────────────────

  get _sources() {
    return [
      { tag: 'Independent · 10 devices', title: 'Gielen et al. 2026: 10 wearables vs chest strap',
        cite: 'JMIR Formative Res. 2026;10:e85186. N=45, 3 climates.', url: 'https://formative.jmir.org/2026/1/e85186' },
      { tag: 'Independent · 12-lead ECG', title: 'Van Oost et al. 2025: 5 devices vs 12-lead ECG',
        cite: 'Sensors. 2025;25(20):6319. N=24, missingness disclosed.', url: 'https://www.mdpi.com/1424-8220/25/20/6319' },
      { tag: 'Independent · nocturnal', title: 'Dial et al. 2025: Oura, Polar & WHOOP overnight',
        cite: 'Physiological Reports. 2025;13:e70527. 536 nights (AFRL).', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12367097/' },
      { tag: 'Independent · nocturnal', title: 'Miller et al. 2022: sleep/wake HR across 6 devices',
        cite: 'Sensors. 2022;22(16):6317. N=53, II-lead ECG.', url: 'https://www.mdpi.com/1424-8220/22/16/6317' },
      { tag: 'Independent · meta', title: 'Zhang et al. 2020: HR by activity, 15 brands',
        cite: 'J Sports Sci. 2020;38(17):2021. 44 articles, 738 effects.', url: 'https://www.tandfonline.com/doi/full/10.1080/02640414.2020.1767348' },
      { tag: 'Independent · by activity', title: 'Ceugniez et al. 2025: Fitbit by sport (run vs badminton)',
        cite: 'JMIR mHealth uHealth. 2025;13:e54871. N=26, Polar H10.', url: 'https://mhealth.jmir.org/2025/1/e54871' },
      { tag: 'Independent · rowing & position', title: 'Vermunicht et al. 2025: wear position & rowing',
        cite: 'Eur Heart J Digital Health. 2025;6(5):1024. N=50.', url: 'https://academic.oup.com/ehjdh/article/6/5/1024/8210517' },
      { tag: 'Independent · resistance', title: 'Lee et al. 2026: endurance vs resistance, 4 watches',
        cite: 'Sensors. 2026;26(8):2526. N=62 men, ECG (SOLUM-funded).', url: 'https://www.mdpi.com/1424-8220/26/8/2526' },
      { tag: 'Independent · Apple meta', title: 'Lambe et al. 2026: Apple Watch living meta-analysis',
        cite: 'npj Digital Medicine. 2026;9:63. HR 22 studies, n=1,247.', url: 'https://www.nature.com/articles/s41746-025-02238-1' },
      { tag: 'Independent · Fitbit meta', title: 'Chevance et al. 2022: Fitbit meta-analysis',
        cite: 'JMIR mHealth uHealth. 2022;10(4):e35626. 32 HR studies.', url: 'https://mhealth.jmir.org/2022/4/e35626/' },
      { tag: 'Independent · review', title: 'Fuller et al. 2020: within-tolerance across brands',
        cite: 'JMIR mHealth uHealth. 2020;8(9):e18694. 177 comparisons.', url: 'https://mhealth.jmir.org/2020/9/e18694/' },
      { tag: 'Independent · atrial fibrillation', title: 'Quinn et al. 2024: AF vs sinus rhythm on exertion',
        cite: 'J Am Coll Cardiol. 2024;83(12):1177. N=81, 12-lead ECG.', url: 'https://www.jacc.org/doi/10.1016/j.jacc.2024.01.024' },
      { tag: 'Independent · ballistic', title: 'Moghaddam et al. 2026: placement during burpees',
        cite: 'Sensors. 2026;26(1):176. N=28, Polar H10.', url: 'https://www.mdpi.com/1424-8220/26/1/176' },
      { tag: 'Independent · tattoos', title: 'Navalta et al. 2025: PPG over tattooed skin',
        cite: 'Sensors. 2025;25(22):6896. N=25, within-subject.', url: 'https://www.mdpi.com/1424-8220/25/22/6896' },
      { tag: 'Independent · skin tone', title: 'Hung et al. 2025: skin tone by exercise intensity',
        cite: 'PLOS ONE. 2025;20(2):e0318724. N=25, Fitbit vs Polar H10.', url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0318724' },
      { tag: 'Independent · pigmentation meta', title: 'Singh et al. 2024: skin pigmentation meta-analysis',
        cite: 'J Med Internet Res. 2024;26:e62769. Pulse-rate arm n=176.', url: 'https://www.jmir.org/2024/1/e62769' },
      { tag: 'Independent · contradiction', title: 'Kitagaki et al. 2025: Fitbit Inspire 3 in patients',
        cite: 'JMIR Cardio. 2025;9:e77911. N=30, ECG, MAPE 5.40%.', url: 'https://cardio.jmir.org/2025/1/e77911' },
      { tag: 'Manufacturer', title: 'Apple: Heart rate on Apple Watch white paper',
        cite: 'Apple Inc. Nov 2024. 100,000+ workout sessions.', url: 'https://www.apple.com/health/pdf/Heart_Rate_Calorimetry_Activity_on_Apple_Watch_November_2024.pdf' },
      { tag: 'Manufacturer', title: 'WHOOP: 99.7% accuracy claim page',
        cite: 'Traces to Miller 2022 (nocturnal, one night, WHOOP 3.0).', url: 'https://www.whoop.com/us/en/thelocker/whoop-proven-most-accurate-wearable-in-heart-rate-heart-rate-variability-measurements/' },
      { tag: 'Manufacturer', title: 'Oura: resting-HR r-squared 0.996 claim',
        cite: 'Kinnunen et al. 2020, all authors Oura-affiliated.', url: 'https://ouraring.com/blog/how-accurate-is-oura/' }
    ];
  }

  // ── FAQ (also emitted as FAQPage JSON-LD) ────────────────────────────────

  get _faqs() {
    return [
      { q: 'Which wearable is the most accurate for heart rate?',
        a: 'In the only clean 10-device head-to-head on one sample, the Fitbit Charge 6 led (median MAPE 5.5%), then the Garmin Vivoactive 5 (6.3%) and the Google Pixel Watch 2 (6.7%). But "most accurate" depends entirely on what you are doing: at rest almost every device is within a few percent, while during racquet sport, rowing or weights even the best can be 13 to 17% off. No wrist wearable clears the 5% acceptability line cleanly across a full protocol.' },
      { q: 'Are wrist heart rate monitors accurate during exercise?',
        a: 'For steady exercise like running or walking, yes, often within 1 to 4% error. The problem is irregular arm movement. Badminton, tennis, soccer, rowing and weightlifting whip or flex the wrist, so the optical sensor loses your pulse and error climbs to 13 to 17%, usually under-reading. For those activities a chest strap is still the honest choice.' },
      { q: 'Why is my watch accurate at night but not during workouts?',
        a: 'Because night is the easy case: your body is still and blood flow is steady, so resting heart rate error drops to about 1.7 to 3%. Motion is what breaks optical sensors. This also matters because most manufacturer "99% accurate" style claims come from sleep or resting data and do not describe workout accuracy.' },
      { q: 'Is the average heart-rate number the one I should trust?',
        a: 'No. A near-zero average bias (Apple\'s pooled figure is -0.27 bpm) just means over-reads and under-reads cancelled out. The same data has limits of agreement of about -7 to +7 bpm. Look at MAPE (mean absolute percentage error) and the limits of agreement, which do not cancel, rather than the bias a brand quotes.' },
      { q: 'Does skin tone or a tattoo affect heart-rate accuracy?',
        a: 'At rest, pooled data shows no significant bias by skin pigmentation. Under hard exercise the picture changes: one study found medium and dark skin about 11.8 bpm off above 60% effort while light skin stayed accurate. Tattoos directly over the sensor attenuate the signal, worst at rest. The fixes are the same for everyone: wear it snug, higher on the arm, on unmarked skin.' },
      { q: 'Are the newest watches (Apple Series 11, Galaxy Watch 7, WHOOP 5) more accurate?',
        a: 'Unknown independently. Peer-reviewed HR validation lags new hardware by about 2 to 4 years, so most current flagships carry manufacturer-only claims. The devices with independent testing are mostly a generation or two back, and firmware updates change results even on identical hardware.' }
    ];
  }

  // ── SEO light-DOM summary ───────────────────────────────────────────────

  _seoText() {
    return 'Most Accurate Heart Rate Wearable comparison by Kygo Health. Interactive tool: pick 2 to 4 wearables and compare them side by side on five metrics (median MAPE, mean absolute error in bpm, mean bias, limits of agreement spread, and CCC agreement), with the best value in each row highlighted. Which wearable is most accurate for heart rate versus a criterion standard (ECG or chest strap)? The one axis that decides every number is steady versus irregular arm movement, not intensity. Running is one of the easiest conditions for a wrist sensor (Fitbit Charge 4 median MAPE 1.2%), while badminton, tennis, soccer, rowing and weightlifting are the hard ones (badminton 16.2% on the same watch, same wrist). At night, resting heart rate error drops to about 1.7 to 3%, which is where most manufacturer accuracy claims come from. THE HEADLINE 10-DEVICE RANKING (Gielen 2026, N=45, Zephyr chest strap, median MAPE): Fitbit Charge 6 5.5% (CCC 0.93), Garmin Vivoactive 5 6.3% (0.83), Google Pixel Watch 2 6.7% (0.87), Apple Watch SE 7.3% (0.70), Garmin Vivosmart 5 8.1% (0.78), Polar Ignite 3 11.2% (0.63), Xiaomi Watch 2 11.9% (0.69), Polar Pacer 13.1% (0.66), Oura Ring Gen 3 15.0% (0.61), Fitbit Inspire 3 16.5% (0.45). None clears the 5% acceptability line cleanly. Three rules: Rule 1, mean bias is misleading (Apple pooled bias -0.27 bpm but limits of agreement -7.2 to +6.6 bpm), read MAPE and limits of agreement instead. Rule 2, the criterion standard and data completeness vary; a chest strap carries its own 2 to 4% error. Rule 3, model matters more than brand (Fitbit Charge 6 best and Fitbit Inspire 3 worst in the same study). Nocturnal resting HR is superb: Oura Ring Gen 3 1.67% MAPE (Dial 2025), Oura Ring Gen 4 1.94%, Polar Grit X Pro 2.71%, WHOOP 4.0 3.00%. Fixed facts: the failure mode is irregular arm movement, not intensity; atrial fibrillation raises error to about 29 bpm at peak exercise; skin pigmentation shows no bias at rest but about 11.8 bpm error under load for medium and dark skin; tattoos attenuate the signal; wear position matters (moving a watch higher up the arm cut error about 11 points). Manufacturer claims to distrust: WHOOP 99.7% (sleep only, one night, WHOOP 3.0), Oura r-squared 0.996 (Oura-affiliated authors, nightly average), Samsung 30% more accurate (no absolute figure), Pixel Watch 2 / Fitbit Charge 6 40% more accurate (Pixel only, no study), Garmin publishes no figure at all. Do not cite fabricated figures like "Device 84.6% accurate" or a "University of X 2026 heart rate ranking" that trace to no real study. Sources: Gielen 2026, Van Oost 2025, Dial 2025, Miller 2022, Zhang 2020, Ceugniez 2025, Vermunicht 2025, Lee 2026, Lambe 2026, Chevance 2022, Fuller 2020, Quinn 2024, Moghaddam 2026, Navalta 2025, Hung 2025, Singh 2024, Kitagaki 2025. Fitbit vs Garmin vs Apple Watch vs Google Pixel vs Polar vs Oura vs Xiaomi heart rate accuracy. Data verified July 2026.';
  }

  // ── Icons ───────────────────────────────────────────────────────────────

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
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
      clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
      alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg>',
      android: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>'
    };
    return `<span class="ico">${icons[name] || icons.info}</span>`;
  }

  _typeIcon(t) { return t === 'ring' ? this._icon('ring') : (t === 'strap' ? this._icon('strap') : this._icon('watch')); }

  // ── Small render helpers ────────────────────────────────────────────────

  _pill(text, tone) { return `<span class="vpill ${tone}">${text}</span>`; }
  _amazonLink(d, position) {
    if (!d.affiliateUrl) return '';
    return `<a class="amz-link" href="${d.affiliateUrl}" target="_blank" rel="noopener sponsored" data-action="affiliate-click" data-track-label="${d.trackLabel}" data-track-position="${position}">Amazon ${this._icon('arrowRight')}</a>`;
  }

  _biasStr(v) { return (v >= 0 ? '+' : '') + v.toFixed(1) + ' bpm'; }
  _loaWidth(d) { return d.loHi - d.loLo; }
  _mapePill(d) { return this._pill(d.mape.toFixed(1) + '%', d.mape <= 7.5 ? 'good' : 'mid'); }
  _cccPill(d) { return this._pill(d.ccc.toFixed(2), d.ccc >= 0.80 ? 'good' : 'mid'); }
  _gradePill(d) {
    if (d.mape <= 7.5 && d.ccc >= 0.80) return `<span class="vpill good">Good</span>`;
    if (d.mape <= 12) return `<span class="vpill mid">Fair</span>`;
    return `<span class="vpill dark">Poor</span>`;
  }

  // ── Interactive comparator (pick 2–4 devices → side-by-side) ────────────

  _did(d) { return d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  _cmprVal(d, key) {
    switch (key) {
      case 'mape': return d.mape;
      case 'mae': return d.mae;
      case 'bias': return d.bias;
      case 'loa': return this._loaWidth(d);
      case 'ccc': return d.ccc;
    }
    return null;
  }
  _cmprFmt(d, key) {
    switch (key) {
      case 'mape': return d.mape.toFixed(1) + '%';
      case 'mae': return d.mae.toFixed(1) + ' bpm';
      case 'bias': return this._biasStr(d.bias);
      case 'loa': return this._loaWidth(d).toFixed(1) + ' bpm';
      case 'ccc': return d.ccc.toFixed(2);
    }
    return 'n/a';
  }
  _cmprRows() {
    return [
      { key: 'mape', label: 'Overall error (MAPE)', unit: 'median % vs strap', better: 'low' },
      { key: 'mae', label: 'Mean absolute error', unit: 'bpm off, median', better: 'low' },
      { key: 'bias', label: 'Mean bias', unit: 'bpm (0 = none)', better: 'zero' },
      { key: 'loa', label: 'Limits of agreement', unit: 'bpm spread, tighter wins', better: 'low' },
      { key: 'ccc', label: 'Agreement (CCC)', unit: 'concordance 0–1', better: 'high' }
    ];
  }

  _renderComparator() {
    return `
      <div class="cmpr">
        <div class="cmpr-picker-head">
          <span class="cmpr-picker-title">Choose devices to compare</span>
          <span class="cmpr-picker-hint">Tap to add or remove · 2–4 at a time</span>
        </div>
        <div class="picker" role="group" aria-label="Choose heart rate wearables to compare">
          ${this._devices.map(d => {
            const id = this._did(d), on = this._selected.has(id);
            return `<button type="button" class="pick-tile${on ? ' active' : ''}" data-cmpr-id="${id}" aria-pressed="${on}">
              ${this._deviceLogo(d, 'sm')}
              <span class="pick-name">${d.chip}</span>
              <span class="pick-check">${this._icon('check')}</span>
            </button>`;
          }).join('')}
        </div>
        <div class="cmpr-out" data-cmpr-out>${this._renderCmprResult()}</div>
      </div>`;
  }

  _renderCmprResult() {
    const sel = this._devices.filter(d => this._selected.has(this._did(d)));
    if (sel.length < 2) {
      return `<div class="cmpr-empty">${this._icon('info')} Pick at least two devices above to see them side by side.</div>`;
    }
    const rows = this._cmprRows();
    const wins = {}; sel.forEach(d => { wins[this._did(d)] = 0; });
    let scored = 0;

    const body = rows.map(r => {
      const vals = sel.map(d => ({ id: this._did(d), v: this._cmprVal(d, r.key) }));
      const valid = vals.filter(x => x.v != null);
      const best = new Set();
      if (valid.length > 1) {
        const metric = x => r.better === 'zero' ? Math.abs(x.v) : x.v;
        const target = r.better === 'high'
          ? Math.max(...valid.map(metric))
          : Math.min(...valid.map(metric));
        valid.forEach(x => { if (metric(x) === target) best.add(x.id); });
        if (best.size < valid.length) { scored++; best.forEach(id => { wins[id]++; }); }
      }
      const cells = sel.map(d => {
        const id = this._did(d), v = this._cmprVal(d, r.key);
        if (v == null) return `<td><span class="vpill mid">n/a</span></td>`;
        const isBest = best.has(id) && best.size < valid.length;
        const txt = this._cmprFmt(d, r.key);
        return `<td>${isBest ? `<span class="vpill good">${txt}${this._icon('check')}</span>` : `<span class="vpill mid">${txt}</span>`}</td>`;
      }).join('');
      const dir = r.better === 'zero' ? 'closest to 0 wins' : (r.better === 'high' ? 'higher wins' : 'lower wins');
      return `<tr>
        <th scope="row"><span class="cr-metric">${r.label}</span><span class="cr-unit">${r.unit}</span><span class="cr-dir">${dir}</span></th>
        ${cells}
      </tr>`;
    }).join('');

    const head = `<tr>
      <th class="cr-corner" scope="col">Metric</th>
      ${sel.map(d => `<th scope="col"><span class="cr-dev">${this._deviceLogo(d, 'sm')}<span class="cr-dev-name">${d.chip}</span></span></th>`).join('')}
    </tr>`;

    const entries = Object.entries(wins);
    const max = Math.max(...entries.map(([, w]) => w));
    let verdict;
    if (max === 0) {
      verdict = `These devices are too close to separate on the metrics they share. Remember these are mixed-daytime figures, so all of them get far more accurate at rest and far worse during racquet sport or rowing.`;
    } else {
      const leaders = entries.filter(([, w]) => w === max).map(([id]) => sel.find(d => this._did(d) === id).chip);
      verdict = leaders.length === 1
        ? `<strong>${leaders[0]}</strong> wins the most metrics here (${max} of ${scored}). These are one protocol's daytime numbers against a chest strap; every device is far more accurate at rest and far worse during irregular arm movement.`
        : `It's a tie: <strong>${leaders.join('</strong> and <strong>')}</strong> each lead on ${max} of ${scored} metrics. All are mixed-daytime figures, so accuracy climbs at rest and collapses during racquet sport, rowing and weights.`;
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

  // ── Section: headline ranking matrix (logo chart) ───────────────────────

  _renderRankMatrix() {
    const rows = this._devices;
    return `
      <div class="cmp">
        <div class="cmp-scroll">
          <table class="cmp-table">
            <thead>
              <tr>
                <th class="cmp-th-device" scope="col">Wearable</th>
                <th scope="col"><span class="th-full">Overall error (MAPE)</span><span class="th-short" aria-hidden="true">MAPE</span></th>
                <th scope="col"><span class="th-full">Agreement (CCC)</span><span class="th-short" aria-hidden="true">CCC</span></th>
                <th scope="col">Grade</th>
                <th scope="col">Buy</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(d => `
                <tr>
                  <th class="cmp-td-device" scope="row">
                    <span class="brand">
                      ${this._deviceLogo(d, 'sm')}
                      <span class="brand-text"><span class="brand-name">${d.name}</span></span>
                    </span>
                  </th>
                  <td>${this._mapePill(d)}${d.nightNote ? `<span class="cell-note">${d.nightNote}</span>` : ''}</td>
                  <td>${this._cccPill(d)}</td>
                  <td>${this._gradePill(d)}</td>
                  <td>${this._amazonLink(d, 'ranking')}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <p class="cmp-legend">${this._icon('info')} Median MAPE and CCC vs a Zephyr chest strap, one 45-person protocol (Gielen 2026). <strong>&lt;5% MAPE is the acceptability line</strong> and none clears it cleanly. Ranked best to worst. <span class="lg-good">green</span> ≤ 7.5% MAPE / CCC ≥ 0.80.</p>
      </div>`;
  }

  // ── Section: per-device detail accordion ────────────────────────────────

  _renderDeviceDetails() {
    return `<div class="dev-acc">${this._devices.map(d => {
      const metrics = [];
      metrics.push(`
        <div class="dmetric">
          <span class="dm-lbl">Error vs strap</span>
          <div class="dm-vals">
            <span class="dm-tag">MAPE</span> ${this._mapePill(d)}
            <span class="dm-tag">MAE</span> ${this._pill(d.mae.toFixed(1) + ' bpm', d.mae <= 5.5 ? 'good' : 'mid')}
          </div>
          ${d.nightNote ? `<span class="dm-note">also ${d.nightNote}</span>` : ''}
        </div>`);
      metrics.push(`
        <div class="dmetric">
          <span class="dm-lbl">Bias &amp; agreement</span>
          <div class="dm-vals">
            <span class="dm-tag">Bias</span> ${this._pill(this._biasStr(d.bias), Math.abs(d.bias) <= 2 ? 'good' : 'mid')}
            <span class="dm-tag">CCC</span> ${this._cccPill(d)}
          </div>
          <span class="dm-note">limits of agreement ${d.loLo.toFixed(1)} to +${d.loHi.toFixed(1)} bpm</span>
        </div>`);
      return `
      <details class="dacc${d.mape <= 7.5 ? ' is-validated' : ''}">
        <summary>
          ${this._deviceLogo(d, 'sm')}
          <span class="dacc-id">
            <span class="dacc-name">${d.name}</span>
            <span class="dacc-sub"><span class="vpill ${d.mape <= 7.5 ? 'good' : (d.mape <= 12 ? 'mid' : 'dark')}">MAPE ${d.mape.toFixed(1)}%</span></span>
          </span>
          <span class="dacc-chev">${this._icon('arrowRight')}</span>
        </summary>
        <div class="dacc-body">
          <div class="dev-finding">
            <span class="dev-label">Independent finding vs a criterion standard</span>
            <p>${d.independent}</p>
          </div>
          <div class="dmetrics">${metrics.join('')}</div>
          <div class="dev-finding alt">
            <span class="dev-label">Manufacturer claim</span>
            <p>${d.vendorClaim}</p>
          </div>
          <ul class="dev-facts">
            <li><span class="fct-ico">${this._icon('heart')}</span><span><strong>How it tracks</strong> ${d.method}</span></li>
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

  // ── Section: fixed-fact cards ────────────────────────────────────────────

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

  // ── Section: sources (compact link list, all shown) ─────────────────────

  _renderSourceCards(list) {
    return list.map(s => `
      <a class="src" href="${s.url}" target="_blank" rel="noopener nofollow" data-action="source-link" data-track-label="${s.title}" data-track-position="sources">
        <span class="src-tag">${s.tag}</span>
        <span class="src-title">${s.title}</span>
        <span class="src-cite">${s.cite} <span class="src-go">${this._icon('externalLink')}</span></span>
      </a>`).join('');
  }

  _renderFAQ() {
    return this._faqs.map(f => `
      <details>
        <summary>${f.q}</summary>
        <div class="body">${f.a}</div>
      </details>`).join('');
  }

  // ── Related tools (cross-link cards) ────────────────────────────────────
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
        title: 'Most Accurate Sleep Tracker',
        blurb: 'Which wearable is most accurate for sleep vs a lab PSG? Compare 7 devices on staging, deep and REM.',
        url: 'https://www.kygo.app/tools/sleep-tracker-accuracy',
        meta: 'Wearables · 14 sources',
        motif: { motif: 'compare', caption: 'Staging vs PSG', rows: [{ label: 'Oura', pct: 90 }, { label: 'Apple', pct: 78 }, { label: 'Fitbit', pct: 64 }, { label: 'Garmin', pct: 36 }] }
      },
      {
        title: 'Calorie Burn Accuracy',
        blurb: 'Enter your reported calorie burn and see the likely real range, with per-activity accuracy.',
        url: 'https://www.kygo.app/tools/calorie-burn-accuracy',
        meta: 'Activity · 22 sources',
        motif: { motif: 'diverging', caption: 'Reported vs actual', bars: [{ label: 'Oura', val: 9 }, { label: 'Apple', val: 22 }, { label: 'Fitbit', val: -16 }, { label: 'Garmin', val: -31 }] }
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
        return `<span style="display:flex;align-items:center;gap:8px;"><span style="width:48px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:9px;color:#475569;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.label}</span><span style="flex:1;height:9px;border-radius:5px;background:#EEF1F4;overflow:hidden;"><span style="display:block;height:100%;border-radius:5px;background:${fill};width:${w}%;"></span></span></span>`;
      }).join('');
      return `<span style="display:flex;flex-direction:column;gap:8px;padding:2px 0;">${body}</span>`;
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
    return '';
  }

  _renderRelatedTools() {
    const cards = this._relatedTools().map(t => `
      <a class="related-card animate-on-scroll" href="${t.url}" aria-label="${t.title}">
        <span class="rc-media">
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
      <section class="section bg-white" id="related">
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

  // ── Main render ─────────────────────────────────────────────────────────

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const ouraImg = 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png';
    const fitbitImg = 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png';
    const googleHealthImg = 'https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png';
    const appleImg = 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png';
    const garminImg = 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png';
    const healthConnectImg = 'https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png';

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" loading="lazy" />
            <span>Kygo Health</span>
          </a>
          <div class="nav-cta-group">
            <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" class="nav-store-btn nav-store-ios cta-primary" data-track-label="subnav-get-app-ios" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on the App Store"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg><span>iOS</span></a>
            <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" class="nav-store-btn nav-store-android cta-android" data-action="android-download" data-track-label="subnav-get-app-android" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on Google Play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg><span>Android</span></a>
          </div>
        </div>
      </header>

      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill"><span class="dot"></span> 10 WEARABLES · ECG &amp; CHEST-STRAP VALIDATED</div>
              <h1>Which wearable is <span class="hl">actually accurate for heart rate?</span></h1>
              <p class="hero-lede">At rest, your watch is nearly flawless. Then you move. The same wrist sensor that <strong>nails steady running</strong> can be 13x further off during racquet sport or weights. Here's how 10 devices really compare, and why <strong>arm motion, not intensity</strong>, is what breaks them.</p>
            </div>
            <div class="hero-vis" aria-hidden="true">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> Same watch, two activities</span>
                <span class="hero-vis-tag">motion &gt; intensity</span>
              </div>
              <div class="hv-two">
                <div class="hv-col">
                  <span class="hv-label">Steady running</span>
                  <span class="hv-val good">1.2%</span>
                  <div class="hv-bar"><span class="hv-fill good" style="width:94%"></span></div>
                  <span class="hv-cap good">Best case</span>
                </div>
                <div class="hv-col">
                  <span class="hv-label">Badminton</span>
                  <span class="hv-val">16.2%</span>
                  <div class="hv-bar"><span class="hv-fill" style="width:40%"></span></div>
                  <span class="hv-cap">Arm motion</span>
                </div>
              </div>
              <span class="hv-foot">Median MAPE · Fitbit Charge 4 · one watch, one wrist, two activities (Ceugniez 2025)</span>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">5.5%</div><div class="lbl">Best daytime error (Fitbit Charge 6)</div></div>
            <div class="hero-stat"><div class="num">1.67%</div><div class="lbl">Best at night (Oura Gen 3, resting)</div></div>
            <div class="hero-stat"><div class="num">13x</div><div class="lbl">Error swing, running vs badminton</div></div>
            <div class="hero-stat"><div class="num">10</div><div class="lbl">Wearables ranked on one protocol</div></div>
          </div>
        </div>
      </section>

      <section class="section bg-light" id="compare">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Build your comparison</div>
            <h2>Compare heart rate wearables <span class="hl">head-to-head.</span></h2>
            <p class="lede">Pick 2–4 devices and see them side by side on the five metrics that matter: overall error (MAPE), mean absolute error, bias, limits of agreement, and CCC agreement. All from one 45-person protocol against a chest strap, so it is a like-for-like comparison. The best value in each row is highlighted.</p>
          </div>
          <div class="animate-on-scroll">${this._renderComparator()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="kygo-cta-card animate-on-scroll">
            <div class="cta-pill"><span class="dot"></span> Free Forever Plan</div>
            <h3>See what your <span>heart data</span> is really telling you.</h3>
            <p>Your watch estimates your heart rate. Kygo connects your HR, recovery, sleep and nutrition so you can act on the trend, not chase a single noisy reading.</p>
            <div class="cta-btn-row">
              <a class="btn btn-primary btn-lg cta-primary" href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" target="_blank" rel="noopener" data-track-position="early" data-track-label="hr-accuracy-early-ios">${this._icon('apple')} Try Free for 7 Days</a>
              <a class="btn btn-primary btn-lg cta-android" href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" target="_blank" rel="noopener" data-action="android-download" data-track-position="early" data-track-label="hr-accuracy-early-android">${this._icon('android')} Download for Android</a>
            </div>
            <p style="position:relative;margin:16px 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.72);text-align:center;">7-day free trial on yearly. Free plan available. Cancel anytime.</p>
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

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The full ranking</div>
            <h2>All ten, ranked on <span class="hl">one clean protocol.</span></h2>
            <p class="lede">The best single ranking study available: all ten devices on the same 45 participants, same protocol, same chest-strap reference (Gielen 2026). Ranked best to worst by median error. Note that only four come close to the 5% line and none clears it cleanly. Scroll sideways on mobile.</p>
          </div>
          <div class="animate-on-scroll">${this._renderRankMatrix()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Read this before you trust a number</div>
            <h2>The one thing that <span class="hl">decides accuracy.</span></h2>
            <p class="lede">It is not the brand and it is not how hard you are working. It is whether your arm is <strong>steady or jerking around</strong>. The same device is near-perfect at rest and during steady running, then falls apart the moment the wrist whips or flexes, which is why the ranking above is a mixed-daytime average, not a verdict on any one activity.</p>
          </div>
          <div class="bias animate-on-scroll">
            <div class="bias-card good">
              <span class="bias-tag">${this._icon('check')} Steady &amp; still</span>
              <span class="bias-stat">MAPE 1–5% <small>best case</small></span>
              <span class="bias-cap">Rest, sleep, running</span>
              <p>Rest, sleep and steady running are the easy conditions. Running is one of the easiest of all: a Fitbit hit 1.2% MAPE. At night, resting heart rate error drops to about 1.7 to 3%. This is where every "99% accurate" claim comes from.</p>
            </div>
            <div class="bias-card">
              <span class="bias-tag">${this._icon('alert')} Irregular arm movement</span>
              <span class="bias-stat">MAPE 13–17% <small>where it breaks</small></span>
              <span class="bias-cap">Racquet, rowing, weights</span>
              <p>Badminton, tennis, soccer, rowing and weightlifting whip or flex the wrist, so the optical sensor loses the pulse. The same Fitbit that ran at 1.2% hit 16.2% at badminton, under-reading by about 16 bpm, telling you that you worked less hard than you did.</p>
            </div>
            <p class="bias-note">${this._icon('info')} <span><strong>The failure mode is arm movement, not intensity.</strong> High-intensity running is one of the easiest cases; picking things up and racquet sport are the hard ones. Moving a watch higher on the forearm can cut error by about 11 points. <em>Ceugniez 2025 · Vermunicht 2025 · Zhang 2020</em></span></p>
          </div>
        </div>
      </section>

      <kygo-inline-subscribe source="tool-heart-rate-accuracy" variant="comparison"></kygo-inline-subscribe>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">In detail</div>
            <h2>The full breakdown, <span class="hl">tap any device.</span></h2>
            <p class="lede">Every wearable's independent finding versus a criterion standard, the manufacturer's claim, its error, bias and agreement numbers, and what it is best and weakest for.</p>
          </div>
          <div class="animate-on-scroll">${this._renderDeviceDetails()}</div>
          <p class="aff-disclosure animate-on-scroll">${this._icon('info')} <span>The "View on Amazon" links above are affiliate links. As an Amazon Associate, Kygo Health earns from qualifying purchases, at no extra cost to you.</span></p>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">True for every device</div>
            <h2>What no brand <span class="hl">can fix.</span></h2>
            <p class="lede">Six findings that hold across every wearable in the research. Read these before you trust any single number a spec sheet gives you.</p>
          </div>
          <div class="animate-on-scroll">${this._renderFactCards()}</div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <a class="blog-cta animate-on-scroll" href="https://www.kygo.app/post/most-accurate-heart-rate-wearable-2026" target="_self" rel="noopener">
            <span class="blog-cta-tag">Deep Dive</span>
            <div class="blog-cta-body">
              <div class="blog-cta-kicker">Read the full breakdown</div>
              <div class="blog-cta-title">The Most Accurate Heart Rate Wearable (2026): Fitbit vs Garmin vs Apple vs Oura</div>
              <div class="blog-cta-sub">Why the "best" watch depends on the activity, how to read the numbers a brand quotes, and when a chest strap is still the honest choice, all evidence-based.</div>
            </div>
            <span class="blog-cta-arrow">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="bottomline animate-on-scroll">
            <div class="bottomline-tag">The bottom line</div>
            <p><strong>Fitbit Charge 6</strong> tops the only clean 10-device head-to-head (5.5% MAPE), with <strong>Garmin Vivoactive 5</strong> and <strong>Google Pixel Watch 2</strong> just behind. <strong>Apple Watch SE</strong> sits mid-pack with the widest swings (near-zero bias, low CCC), and <strong>Oura Gen 3</strong>, superb at night, drops to 9th by day because a finger sensor is not motion-proof. But the honest headline is not a winner: at rest almost everything is accurate, and during racquet sport, rowing or weights almost everything is not. Read MAPE and the limits of agreement, not the bias a brand quotes, and treat any figure from a single night as a best case, not your day.</p>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">FAQ</div>
            <h2>Common <span class="hl">questions.</span></h2>
          </div>
          <div class="faq">${this._renderFAQ()}</div>
        </div>
      </section>

      ${this._renderRelatedTools()}

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every claim, <span class="hl">traceable.</span></h2>
            <p class="lede">Each figure checked against the primary record (journal, PMC or manufacturer paper). ${this._sources.length} sources. Verified July 2026.</p>
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
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Optical wrist and ring heart rate is an estimate, not a clinical measurement, and can be inaccurate during exercise or with an irregular heart rhythm. Consult a qualified healthcare provider before making health decisions based on wearable data.</p>
          <p class="footer-copyright">Data from peer-reviewed validation studies and manufacturer documentation. Last updated July 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases. Product links on this page are affiliate links; we may earn a commission at no extra cost to you.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  // ── Scroll animations ───────────────────────────────────────────────────

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

  // ── JSON-LD ─────────────────────────────────────────────────────────────

  _injectStructuredData() {
    if (!document.querySelector('script[data-kygo-heart-rate-accuracy-ld]')) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Most Accurate Heart Rate Wearable: Fitbit, Garmin, Apple Watch, Oura & Polar',
        'description': 'Which wearable is most accurate for heart rate vs an ECG or chest strap? Compare 10 devices on median MAPE, mean absolute error, bias, limits of agreement and CCC, with the axis that decides every number: steady vs irregular arm movement.',
        'applicationCategory': 'HealthApplication',
        'operatingSystem': 'Web',
        'url': 'https://www.kygo.app/tools/heart-rate-accuracy',
        'datePublished': '2026-08-04',
        'dateModified': '2026-08-04',
        'softwareVersion': '1.0',
        'inLanguage': 'en',
        'isAccessibleForFree': true,
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
        'alternateName': 'Kygo Heart Rate Accuracy Comparison Tool',
        'featureList': 'Compare 10 wearables for heart rate, median MAPE and CCC ranking, mean absolute error, bias and limits of agreement, steady vs irregular arm movement, manufacturer vs independent validation',
        'keywords': 'most accurate heart rate wearable, heart rate monitor accuracy, fitbit heart rate accuracy, garmin heart rate accuracy, apple watch heart rate accuracy, oura heart rate accuracy, polar heart rate accuracy, are wrist heart rate monitors accurate, wearable ppg accuracy, best heart rate watch 2026'
      };
      const s1 = document.createElement('script');
      s1.type = 'application/ld+json';
      s1.setAttribute('data-kygo-heart-rate-accuracy-ld', '');
      s1.textContent = JSON.stringify(ld);
      document.head.appendChild(s1);
    }

    if (!document.querySelector('script[data-kygo-heart-rate-accuracy-faq]')) {
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
      s2.setAttribute('data-kygo-heart-rate-accuracy-faq', '');
      s2.textContent = JSON.stringify(faq);
      document.head.appendChild(s2);
    }

    if (!document.querySelector('script[data-kygo-heart-rate-accuracy-bc]')) {
      const bc = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.kygo.app' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
          { '@type': 'ListItem', 'position': 3, 'name': 'Most Accurate Heart Rate Wearable', 'item': 'https://www.kygo.app/tools/heart-rate-accuracy' }
        ]
      };
      const s3 = document.createElement('script');
      s3.type = 'application/ld+json';
      s3.setAttribute('data-kygo-heart-rate-accuracy-bc', '');
      s3.textContent = JSON.stringify(bc);
      document.head.appendChild(s3);
    }
  }

  // ── Styles ──────────────────────────────────────────────────────────────

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
        --ease-out: cubic-bezier(.16,1,.3,1);
        display: block;
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
      @media (min-width: 880px) { .hero-grid { grid-template-columns: 1.15fr 1fr; gap: 48px; } .hero-light-inner { padding: 64px 24px 48px; } }
      .hero-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.10); color: var(--kygo-green-dark); padding: 6px 14px; border-radius: 999px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.5px; white-space: nowrap; }
      .hero-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kygo-green); flex: none; }
      .hero-light h1 { font-family: var(--font-display); font-weight: 700; color: var(--fg-1); font-size: clamp(30px, 5.5vw, 58px); line-height: 1.05; letter-spacing: -0.02em; margin: 18px 0 18px; }
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
      @media (max-width: 880px) { .hero-vis { width: 100%; max-width: 440px; margin: 4px auto 0; } }
      .hero-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; border-top: 1px solid var(--border-subtle); padding-top: 24px; }
      @media (min-width: 720px) { .hero-stats { grid-template-columns: repeat(4, 1fr); gap: 24px; padding-top: 28px; } }
      .hero-stat .num { font-family: var(--font-display); font-weight: 700; font-size: clamp(28px, 4vw, 40px); line-height: 1; color: var(--kygo-green); letter-spacing: -0.02em; }
      .hero-stat .lbl { margin-top: 10px; color: var(--fg-3); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; line-height: 1.4; }

      /* Sections */
      .section { padding: 56px 20px; }
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

      /* ── Comparison matrix (logo chart) ───────────────────────────────── */
      .cmp { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; overflow: hidden; box-shadow: var(--shadow-md); }
      @media (min-width: 768px) { .cmp { border-radius: 22px; } }
      .cmp-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      @media (min-width: 768px) { .cmp-scroll { overflow-x: visible; } }
      .cmp-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 560px; }
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
      .cmp-td-device { padding: 10px 6px; width: 108px; min-width: 108px; text-align: left; background: #fff; position: sticky; left: 0; z-index: 1; box-shadow: 1px 0 0 var(--border-subtle); }
      .brand { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; }
      .brand-img { width: 38px; height: 38px; border-radius: 9px; background: var(--bg-raised); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
      .brand-img img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
      .brand-img.brand-img--icon { color: var(--fg-3); }
      .brand-img.brand-img--icon .ico { width: 18px; height: 18px; }
      .brand-img.sm { width: 34px; height: 34px; border-radius: 8px; }
      .brand-text { display: flex; flex-direction: column; min-width: 0; }
      .brand-name { font-family: var(--font-display); font-weight: 600; font-size: 11px; color: var(--fg-1); line-height: 1.2; overflow-wrap: anywhere; word-break: break-word; max-width: 92px; }
      @media (min-width: 768px) {
        .cmp-td-device { padding: 12px 14px 12px 8px; width: auto; min-width: 210px; position: static; box-shadow: none; }
        .brand { flex-direction: row; align-items: center; gap: 12px; text-align: left; }
        .brand-img { width: 42px; height: 42px; border-radius: 11px; }
        .brand-img.sm { width: 42px; height: 42px; border-radius: 11px; }
        .brand-name { font-size: 15px; max-width: none; }
      }
      .cmp-table tbody td { text-align: center; padding: 10px 6px; }
      @media (min-width: 768px) { .cmp-table tbody td { padding: 12px 8px; } }
      .vpill { display: inline-flex; align-items: center; font-family: var(--font-display); font-size: 11.5px; font-weight: 600; padding: 4px 11px; border-radius: 999px; white-space: nowrap; }
      .vpill.good { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .vpill.mid { background: var(--bg-raised); color: var(--fg-2); }
      .vpill.dark { background: var(--kygo-dark); color: #fff; }
      .amz-link { display: inline-flex; align-items: center; gap: 3px; font-family: var(--font-display); font-weight: 600; font-size: 11px; color: var(--kygo-green-dark); white-space: nowrap; }
      .amz-link .ico { width: 11px; height: 11px; transition: transform .15s; }
      .amz-link:hover { color: var(--kygo-green); }
      .amz-link:hover .ico { transform: translateX(2px); }
      .cell-note { display: block; margin-top: 4px; font-size: 9.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; color: var(--fg-3); }
      .cmp-legend { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; margin: 0; padding: 12px 16px 14px; font-size: 12px; line-height: 1.55; color: var(--fg-3); }
      .cmp-legend .ico { width: 13px; height: 13px; color: var(--kygo-green-dark); background: var(--kygo-green-light); border-radius: 50%; padding: 2px; box-sizing: content-box; flex: none; }
      .cmp-legend strong { color: var(--fg-2); font-weight: 600; }
      .cmp-legend .lg-good { color: var(--kygo-green-dark); font-weight: 600; }

      /* ── Interactive comparator ──────────────────────────────────────── */
      .cmpr { display: flex; flex-direction: column; gap: 16px; }
      .cmpr-picker-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 12px; }
      .cmpr-picker-title { font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--fg-1); }
      .cmpr-picker-hint { font-size: 12px; color: var(--fg-3); }
      /* Compact wrapping chip row so 10 devices don't build a tall block on mobile */
      .picker { display: flex; flex-wrap: wrap; gap: 8px; background: var(--bg-raised); border: 1px solid var(--border-subtle); border-radius: 16px; padding: 10px; }
      .pick-tile { display: inline-flex; align-items: center; gap: 7px; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 999px; padding: 6px 13px 6px 7px; cursor: pointer; transition: all .15s ease; font-family: var(--font-display); }
      .pick-tile:hover { border-color: var(--fg-3); }
      .pick-tile .brand-img.sm { width: 26px; height: 26px; border-radius: 7px; }
      .pick-name { font-weight: 600; font-size: 12.5px; color: var(--fg-1); line-height: 1.1; white-space: nowrap; }
      .pick-check { width: 15px; height: 15px; border-radius: 50%; background: var(--kygo-green); color: #fff; display: none; align-items: center; justify-content: center; flex: none; }
      .pick-check .ico { width: 9px; height: 9px; }
      .pick-tile.active { border-color: var(--kygo-green); background: rgba(34,197,94,0.06); box-shadow: 0 0 0 3px rgba(34,197,94,0.10); }
      .pick-tile.active .pick-name { color: var(--kygo-green-dark); }
      .pick-tile.active .pick-check { display: inline-flex; }
      @media (max-width: 400px) { .pick-tile .brand-img.sm { width: 22px; height: 22px; } .pick-name { font-size: 12px; } }

      .cr-wrap { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; overflow: hidden; box-shadow: var(--shadow-md); }
      @media (min-width: 768px) { .cr-wrap { border-radius: 22px; } }
      .cr-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .cr-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 440px; }
      .cr-table th, .cr-table td { padding: 11px 7px; text-align: center; vertical-align: middle; }
      .cr-table thead th { background: #E2E8F0; border-bottom: 1px solid #CBD5E1; }
      .cr-table thead th.cr-corner { text-align: left; font-family: var(--font-display); font-weight: 700; font-size: 10px; letter-spacing: .4px; text-transform: uppercase; color: #334155; position: sticky; left: 0; z-index: 3; background: #E2E8F0; }
      .cr-dev { display: flex; flex-direction: column; align-items: center; gap: 5px; }
      .cr-dev .brand-img.sm { width: 30px; height: 30px; border-radius: 8px; }
      .cr-dev-name { font-family: var(--font-display); font-weight: 600; font-size: 11.5px; color: var(--fg-1); line-height: 1.15; }
      .cr-table tbody tr + tr th, .cr-table tbody tr + tr td { border-top: 1px solid var(--border-subtle); }
      .cr-table tbody th { text-align: left; position: sticky; left: 0; z-index: 1; background: #fff; box-shadow: 1px 0 0 var(--border-subtle); width: 116px; min-width: 116px; }
      .cr-metric { display: block; font-family: var(--font-body); font-weight: 600; font-size: 12px; color: var(--fg-1); line-height: 1.25; }
      .cr-unit { display: block; margin-top: 2px; font-size: 10px; color: var(--fg-3); }
      .cr-dir { display: none; margin-top: 3px; font-family: var(--font-display); font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: .3px; color: var(--kygo-green-dark); }
      .cr-table tbody td .vpill { font-size: 11px; padding: 4px 9px; }
      @media (min-width: 768px) {
        .cr-table { min-width: 560px; }
        .cr-table th, .cr-table td { padding: 12px 10px; }
        .cr-table thead th.cr-corner { font-size: 10.5px; }
        .cr-dev .brand-img.sm { width: 34px; height: 34px; }
        .cr-dev-name { font-size: 12px; }
        .cr-table tbody th { width: 168px; min-width: 168px; }
        .cr-metric { font-size: 13px; }
        .cr-unit { font-size: 10.5px; }
        .cr-dir { display: block; }
      }
      .cr-table tbody td .vpill { min-width: 0; }
      .cr-table .vpill .ico { width: 11px; height: 11px; margin-left: 4px; }
      .cr-verdict { display: flex; gap: 12px; align-items: flex-start; background: var(--kygo-green-light); border: 1px solid rgba(34,197,94,0.28); border-radius: 14px; padding: 14px 16px; font-size: 13.5px; line-height: 1.55; color: var(--fg-1); }
      .cr-verdict .ico { width: 18px; height: 18px; color: var(--kygo-green-dark); flex: none; margin-top: 1px; }
      .cr-verdict strong { color: var(--kygo-green-dark); font-weight: 700; }
      .cmpr-empty { display: flex; gap: 10px; align-items: center; justify-content: center; background: #fff; border: 1.5px dashed var(--border-subtle); border-radius: 16px; padding: 28px 20px; color: var(--fg-3); font-size: 14px; text-align: center; }
      .cmpr-empty .ico { width: 18px; height: 18px; color: var(--kygo-green-dark); flex: none; }

      /* Device detail accordion (one row per wearable, click to expand) */
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
      .dm-note { font-size: 10.5px; line-height: 1.4; color: var(--fg-3); }
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

      /* Fact cards (fixed facts) */
      .sig-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
      @media (min-width: 620px) { .sig-grid { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 1000px) { .sig-grid { grid-template-columns: repeat(3, 1fr); } }
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

      /* Bottom line */
      .bottomline { background: var(--kygo-dark); color: rgba(255,255,255,0.82); border-radius: 22px; padding: 32px 26px; position: relative; overflow: hidden; }
      @media (min-width: 720px) { .bottomline { padding: 44px 40px; } }
      .bottomline::before { content: ''; position: absolute; top: -120px; right: -120px; width: 360px; height: 360px; background: radial-gradient(closest-side, rgba(34,197,94,0.22), transparent); pointer-events: none; }
      .bottomline-tag { position: relative; display: inline-flex; font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: #6EE7A0; background: rgba(34,197,94,0.14); border: 1px solid rgba(34,197,94,0.25); padding: 6px 12px; border-radius: 999px; margin-bottom: 18px; }
      .bottomline p { position: relative; font-size: clamp(15px, 1.8vw, 18px); line-height: 1.65; margin: 0 0 14px; }
      .bottomline strong { color: #fff; font-weight: 600; }
      .bottomline em { font-style: italic; color: #fff; }

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

      /* FAQ */
      .faq { display: flex; flex-direction: column; gap: 10px; }
      .faq details { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; padding: 4px 20px; transition: border-color .2s; }
      .faq details[open] { border-color: var(--kygo-green); }
      .faq summary { list-style: none; padding: 16px 0; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 14px; }
      .faq summary::-webkit-details-marker { display: none; }
      .faq summary::after { content: '+'; color: var(--kygo-green-dark); font-weight: 600; font-size: 22px; transition: transform .2s; line-height: 1; }
      .faq details[open] summary::after { content: '\\2212'; }
      .faq .body { padding: 0 0 16px; color: var(--fg-2); font-size: 14px; line-height: 1.65; }

      /* ===== RELATED TOOLS (cross-link cards) ===== */
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
      .rc-media {
        position: relative; aspect-ratio: 16 / 10; overflow: hidden;
        background: var(--bg-raised); display: flex; align-items: center; justify-content: center;
      }
      .rc-panel {
        display: block; background: var(--bg-canvas); border: 1px solid #EAECEF;
        border-radius: 14px; box-shadow: 0 6px 18px rgba(15,23,42,.08);
        padding: 13px 15px; width: 78%;
      }
      .rc-cap {
        display: block; font-family: var(--font-display); font-weight: 600; font-size: 9px;
        letter-spacing: .6px; text-transform: uppercase; color: var(--fg-3); margin-bottom: 8px;
      }
      .rc-body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 7px; }
      .rc-title { font-family: var(--font-display); font-weight: 600; font-size: 17px; line-height: 1.25; letter-spacing: -.01em; color: var(--fg-1); }
      .rc-blurb {
        font-family: var(--font-body); font-size: 13.5px; line-height: 1.55; color: var(--fg-2);
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
      }
      .rc-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 5px; }
      .rc-meta { font-family: var(--font-body); font-size: 12px; font-weight: 500; color: var(--fg-3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .rc-open { display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; font-family: var(--font-body); font-size: 13px; font-weight: 600; color: var(--kygo-green-dark); }
      .rc-open svg { width: 15px; height: 15px; }

      /* Sources · compact link list */
      .sources { display: grid; grid-template-columns: 1fr; gap: 8px; }
      @media (min-width: 600px) { .sources { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 960px) { .sources { grid-template-columns: repeat(3, 1fr); } }
      .src { display: flex; flex-direction: column; gap: 4px; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 12px; padding: 12px 14px; transition: border-color .15s, box-shadow .15s; }
      .src:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); }
      .src-tag { align-self: flex-start; font-family: var(--font-display); font-size: 9.5px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--kygo-green-dark); }
      .src-title { font-family: var(--font-display); font-weight: 600; font-size: 13.5px; color: var(--fg-1); line-height: 1.3; }
      .src:hover .src-title { color: var(--kygo-green-dark); }
      .src-cite { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; color: var(--fg-3); line-height: 1.35; }
      .src-go { display: inline-flex; color: var(--kygo-green-dark); }
      .src-go .ico { width: 12px; height: 12px; transition: transform .15s; }
      .src:hover .src-go .ico { transform: translate(1px,-1px); }

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

if (!customElements.get('kygo-heart-rate-accuracy')) {
  customElements.define('kygo-heart-rate-accuracy', KygoHeartRateAccuracy);
}
