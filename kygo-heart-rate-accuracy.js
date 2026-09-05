/**
 * Kygo Health · Most Accurate Heart Rate Wearable Comparison Tool
 * Tag name: kygo-heart-rate-accuracy
 * Which consumer wearable is most accurate for heart rate vs a criterion standard (ECG / chest strap)?
 * Groups 10 devices into four tiers from Gielen 2026 (45-participant rotation, ~10 sessions per
 * device — ordering within a tier is not meaningful) by median MAPE, MAE, bias, limits of agreement
 * and CCC, with the axis that decides every number: steady/rest vs irregular arm movement.
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
    this._selBrands = null; // Set of brand keys chosen in the comparator
    this._board = 'day';    // 'day' | 'night' toggle for the accuracy chart
    this._wired = false;
  }

  connectedCallback() {
    if (!this._selBrands) {
      // Default comparison: Fitbit (2 devices), Apple, Oura — shows the multi-device case
      this._selBrands = new Set(['fitbit', 'apple', 'oura']);
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
      const tgl = e.target.closest('[data-src-toggle]');
      if (tgl) { this._toggleSources(); return; }
      const brand = e.target.closest('[data-brand-id]');
      if (brand) { this._toggleBrand(brand.getAttribute('data-brand-id')); return; }
      const board = e.target.closest('[data-board]');
      if (board) { this._setBoard(board.getAttribute('data-board')); return; }
    });
  }

  _toggleBrand(key) {
    const sel = this._selBrands;
    if (sel.has(key)) { if (sel.size > 2) sel.delete(key); }    // keep a minimum of 2 brands
    else { if (sel.size < 3) sel.add(key); }                    // cap at 3 brands (table width)
    const root = this.shadowRoot;
    root.querySelectorAll('[data-brand-id]').forEach(c => {
      const on = sel.has(c.getAttribute('data-brand-id'));
      c.classList.toggle('active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const out = root.querySelector('[data-cmpr-out]');
    if (out) out.innerHTML = this._renderCmprResult();
  }

  _setBoard(board) {
    if (board !== 'day' && board !== 'night') return;
    if (this._board === board) return;
    this._board = board;
    const out = this.shadowRoot.querySelector('[data-rank-out]');
    if (out) out.innerHTML = this._renderRankMatrix(); // toggle re-renders with correct active state
  }

  // Nocturnal board — a DIFFERENT device set from the daytime tiers. Only the devices
  // with genuine overnight validation exist here (Dial 2025 vs single-lead ECG).
  get _nightDevices() {
    return [
      { key: 'oura', name: 'Oura Ring Gen 3', mape: 1.67, ccc: 0.97 },
      { key: 'oura', name: 'Oura Ring Gen 4', mape: 1.94, ccc: 0.98 },
      { key: 'polar', name: 'Polar Grit X Pro', mape: 2.71, ccc: 0.86, caveat: true },
      { key: 'whoop', name: 'WHOOP 4.0', mape: 3.00, ccc: 0.91 }
    ];
  }

  // Full-width tier band row. Badge never shrinks (mobile fix); description wraps below it.
  _bandRow(colspan, bg, color, label, desc) {
    return `<tr class="cmp-tier-row"><th colspan="${colspan}" scope="colgroup" style="padding:10px 14px;background:${bg};border-top:1px solid var(--border-subtle);">
      <span style="display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-family:var(--font-display);">
        <span style="flex:none;white-space:nowrap;font-size:11.5px;font-weight:700;letter-spacing:0.3px;color:#fff;background:${color};padding:3px 10px;border-radius:999px;">${label}</span>
        <span style="flex:1 1 62%;min-width:0;font-size:12px;font-weight:500;color:var(--fg-2);line-height:1.35;">${desc}</span>
      </span>
    </th></tr>`;
  }

  // Group devices by brand key, in first-seen (tier) order
  _brands() {
    const order = [];
    const byKey = {};
    this._devices.forEach(d => {
      if (!byKey[d.key]) { byKey[d.key] = { key: d.key, name: this._brandName(d.key), devices: [] }; order.push(byKey[d.key]); }
      byKey[d.key].devices.push(d);
    });
    return order;
  }

  _brandName(key) {
    return ({ fitbit: 'Fitbit', garmin: 'Garmin', google: 'Google', apple: 'Apple', polar: 'Polar', oura: 'Oura', xiaomi: 'Xiaomi' })[key] || key;
  }

  // ── Brand product images (shared Wix assets, by device key) ─────────────

  _deviceImage(key) {
    return ({
      garmin:  'https://static.wixstatic.com/media/273a63_c545c093c04d4ca4ade77e5ca43fd433~mv2.png',
      apple:   'https://static.wixstatic.com/media/273a63_68b4900c356b4d0c8982e5ecd10f04fe~mv2.png',
      polar:   'https://static.wixstatic.com/media/273a63_e7e3c05ed0bc4cec8f456cd7f995e70b~mv2.png',
      fitbit:  'https://static.wixstatic.com/media/273a63_c12bab319dc34737a386c7449f5f92c7~mv2.png',
      oura:    'https://static.wixstatic.com/media/273a63_722e50e1a554453eb4c71a2e7a58925d~mv2.png',
      google:  'https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png', // Google Health logo, reused for the Pixel Watch
      xiaomi:  'https://static.wixstatic.com/media/273a63_cff7a128923a403fb37676d14ca8e623~mv2.png',
      whoop:   'https://static.wixstatic.com/media/273a63_21019d0fbe9e4afcbabdb3ca9dcad89d~mv2.png',
      samsung: 'https://static.wixstatic.com/media/273a63_83875b85add04ebd818a01ee8fc8c088~mv2.png'
    })[key] || null;
  }

  _deviceLogo(d, size) {
    const img = this._deviceImage(d.key);
    const cls = size === 'sm' ? 'brand-img sm' : 'brand-img';
    return img
      ? `<span class="${cls}"><img src="${img}" alt="${d.name}" loading="lazy" /></span>`
      : `<span class="${cls} brand-img--icon">${this._typeIcon(d.type)}</span>`;
  }

  // ── Device data (Gielen 2026: 10 devices, 45-participant rotation, Zephyr strap) ──
  //    Grouped into four tiers; within-tier order is not meaningful. MAPE and MAE are MEDIANS.

  get _devices() {
    return [
      {
        key: 'fitbit', name: 'Fitbit Charge 6', short: 'Fitbit Charge 6', chip: 'Charge 6', type: 'watch', tier: 1,
        method: 'Wrist band, optical PPG plus motion; Fitbit HR algorithm.',
        mape: 5.5, mae: 4.5, bias: 0.7, loLo: -11.2, loHi: 12.7, ccc: 0.93,
        independent: 'Top tier in the Gielen daytime protocol: median MAPE 5.5%, the tightest limits of agreement in the study (-11.2 to +12.7) and the only CCC above 0.90. It still does not clear the 5% acceptability line cleanly, and this is a daytime-motion figure, not a marketing sleep number. Devices were rotated (about 10 of the 45 people each), so read this as a tier, not a rank.',
        vendorClaim: 'Google says a 2023 update made HR tracking "40% more accurate" for vigorous activity, but that claim attaches to the Pixel Watch 2, not the Charge 6, and cites no baseline, reference standard or study.',
        bestFor: 'Top-tier daytime accuracy in the Gielen protocol',
        weakestFor: 'Still above the 5% line; racquet sport and rowing degrade it like any wrist PPG',
        affiliateUrl: 'https://www.amazon.com/s?k=Fitbit%3A&rh=p_123%3A213215&tag=kygohealthapp-20', trackLabel: 'fitbit-search'
      },
      {
        key: 'garmin', name: 'Garmin Vivoactive 5', short: 'Garmin Vivoactive 5', chip: 'Vivoactive 5', type: 'watch', tier: 1,
        method: 'Wrist watch, optical HR (Elevate) plus motion.',
        mape: 6.3, mae: 5.1, bias: -1.0, loLo: -18.6, loHi: 16.7, ccc: 0.83,
        independent: 'Top tier in the Gielen protocol (6.3% MAPE, CCC 0.83). Garmin is inconsistent rather than uniformly bad: strong here and in some resting data, weaker in others. It is also the only major brand that publishes no wrist-HR accuracy figure of its own.',
        vendorClaim: 'Garmin publishes no numerical wrist-HR accuracy figure at all, alone among the major brands. Device manuals redirect to a general accuracy page with no number.',
        bestFor: 'A strong all-round daytime result and reliable steady-cardio tracking',
        weakestFor: 'No published accuracy data to check a claim against; wide agreement limits',
        affiliateUrl: 'https://www.amazon.com/s?k=garmin%20fitness%20tracker&tag=kygohealthapp-20', trackLabel: 'garmin-search'
      },
      {
        key: 'google', name: 'Google Pixel Watch 2', short: 'Pixel Watch 2', chip: 'Pixel Watch 2', type: 'watch', tier: 1,
        method: 'Wrist watch, multi-path optical HR sensor plus motion.',
        mape: 6.7, mae: 4.9, bias: -0.4, loLo: -15.0, loHi: 14.2, ccc: 0.87,
        independent: 'Top tier in the Gielen protocol (6.7% MAPE) with tight limits of agreement (-15.0 to +14.2) and CCC 0.87. Independently validated by Gielen 2026, which corrected earlier lists that had called it unvalidated.',
        vendorClaim: 'Google\'s "40% more accurate for vigorous activity" claim is specifically for this device, but it gives no baseline, no reference standard and no supporting study.',
        bestFor: 'Tight, well-centered readings across a mixed daytime protocol',
        weakestFor: 'Vendor claim is unquantified; motion still degrades it like any watch',
        affiliateUrl: 'https://www.amazon.com/s?k=google%20pixel%20watch&tag=kygohealthapp-20', trackLabel: 'google-pixel-watch-search'
      },
      {
        key: 'apple', name: 'Apple Watch SE', short: 'Apple Watch SE', chip: 'Apple SE', type: 'watch', tier: 2,
        method: 'Wrist watch, second-gen optical HR sensor plus motion.',
        mape: 7.3, mae: 5.0, bias: 0.9, loLo: -21.4, loHi: 23.0, ccc: 0.70,
        independent: 'A textbook Rule 1 row: one of the smallest biases in the table (+0.9 bpm) sitting next to some of its widest limits of agreement (-21.4 to +23.0) and a CCC of only 0.70. The average looks excellent while individual readings swing hard. Note the tested device is the budget SE, not a flagship.',
        vendorClaim: 'Apple\'s own white paper (Nov 2024, 100,000+ workouts) is the most transparent disclosure in the category: within 5 bpm 98% sedentary, 96% cycling, down to 87% walking. Its background algorithm reads 89% within 5 bpm on Series 6+ versus 72% on the SE and Series 4-5.',
        bestFor: 'A tiny mean bias and strong transparency from Apple\'s own data',
        weakestFor: 'Wide swings (low CCC 0.70); the flagship sensor was not the one tested',
        affiliateUrl: 'https://www.amazon.com/s?k=Apple%20Watch&rh=p_123%3A110955&tag=kygohealthapp-20', trackLabel: 'apple-watch-search'
      },
      {
        key: 'garmin', name: 'Garmin Vivosmart 5', short: 'Garmin Vivosmart 5', chip: 'Vivosmart 5', type: 'watch', tier: 2,
        method: 'Wrist band, optical HR (Elevate) plus motion.',
        mape: 8.1, mae: 7.0, bias: 4.8, loLo: -15.8, loHi: 25.4, ccc: 0.78,
        independent: 'Second tier in the Gielen protocol (8.1% MAPE) but a +4.8 bpm over-read, the largest positive bias in the table. It posts strong correlations elsewhere (r 0.96 to 0.97 in Lee 2026 resistance testing), so the story is a consistent upward offset rather than noise.',
        vendorClaim: 'As with all Garmin hardware, no numerical wrist-HR accuracy figure is published.',
        bestFor: 'Consistent, predictable behavior (a steady over-read you can mentally adjust)',
        weakestFor: 'Systematically reads about 5 bpm high; no vendor figure to verify',
        affiliateUrl: 'https://www.amazon.com/s?k=garmin%20fitness%20tracker&tag=kygohealthapp-20', trackLabel: 'garmin-search'
      },
      {
        key: 'polar', name: 'Polar Ignite 3', short: 'Polar Ignite 3', chip: 'Ignite 3', type: 'watch', tier: 3,
        method: 'Wrist watch, Polar Precision Prime optical sensor.',
        mape: 11.2, mae: 9.5, bias: -4.3, loLo: -31.4, loHi: 22.9, ccc: 0.63,
        independent: 'Third tier in the Gielen protocol (11.2% MAPE, CCC 0.63) and notably heat-sensitive: its error roughly doubled in a hot climate chamber (9.5% to 18.2%). Polar is unusual in publishing its own weak numbers for strength and team sport.',
        vendorClaim: 'Polar is the only brand publishing its own bad numbers: overall MAE 4.4 bpm (3.7%), but strength training 5.8 bpm and floorball 12.6 bpm in its Precision Prime and Elixir white papers.',
        bestFor: 'An honest manufacturer that publishes its weak cases',
        weakestFor: 'Below the acceptability line, and heat degrades it sharply',
        affiliateUrl: 'https://www.amazon.com/s?k=Polar%20fitness%20tracker&rh=p_123%3A255287&tag=kygohealthapp-20', trackLabel: 'polar-search'
      },
      {
        key: 'xiaomi', name: 'Xiaomi Watch 2', short: 'Xiaomi Watch 2', chip: 'Xiaomi 2', type: 'watch', tier: 3,
        method: 'Wrist watch, optical HR sensor plus motion.',
        mape: 11.9, mae: 9.1, bias: -3.0, loLo: -33.3, loHi: 27.2, ccc: 0.69,
        independent: 'Third tier in the Gielen protocol (11.9% MAPE) with some of the widest limits of agreement in the table (-33.3 to +27.2). Beyond this single study there is no independent or manufacturer HR validation to check it against.',
        vendorClaim: 'No independent or manufacturer HR-accuracy figure is published for the Watch 2.',
        bestFor: 'Budget option; acceptable at rest like most wrist PPG',
        weakestFor: 'Wide swings under motion and no validation record',
        affiliateUrl: 'https://www.amazon.com/s?k=xiaomi%20smart%20watch&tag=kygohealthapp-20', trackLabel: 'xiaomi-watch-search'
      },
      {
        key: 'polar', name: 'Polar Pacer', short: 'Polar Pacer', chip: 'Polar Pacer', type: 'watch', tier: 3,
        method: 'Wrist watch, Polar Precision Prime optical sensor.',
        mape: 13.1, mae: 9.7, bias: -3.9, loLo: -29.7, loHi: 21.8, ccc: 0.66,
        independent: 'Third tier in the Gielen protocol (13.1% MAPE, CCC 0.66), below the acceptability line on this mixed daytime protocol. Like the Ignite 3, it under-reads on average, so it tends to tell you that you worked less hard than you did.',
        vendorClaim: 'Covered by Polar\'s Precision Prime white-paper figures (overall MAE 4.4 bpm), which are far better than this independent mixed-protocol result.',
        bestFor: 'Running-focused watch; steady cardio is its easy case',
        weakestFor: 'Above the error line on mixed movement; tends to under-read',
        affiliateUrl: 'https://www.amazon.com/s?k=Polar%20fitness%20tracker&rh=p_123%3A255287&tag=kygohealthapp-20', trackLabel: 'polar-search'
      },
      {
        key: 'oura', name: 'Oura Ring Gen 3', short: 'Oura Ring Gen 3', chip: 'Oura Gen 3', type: 'ring', tier: 4,
        method: 'Finger ring, optical PPG plus temperature.',
        mape: 15.0, mae: 11.0, bias: -7.1, loLo: -35.5, loHi: 21.3, ccc: 0.61,
        nightNote: '1.67% at night',
        independent: 'The split-personality device: excellent at night (1.67% MAPE against ECG, Dial 2025) but bottom tier by day (15.0% MAPE), because a finger sensor is not motion-artifact resistant. It is the clearest proof that "rings are more accurate" is marketing, not data: placement is not the variable that decides accuracy, motion is.',
        vendorClaim: 'Oura markets resting-HR r-squared of 0.996, but that traces to a study whose authors are all Oura-affiliated, and it is a nightly-average figure; for 5-minute segments it falls to about 0.87.',
        bestFor: 'Nocturnal resting heart rate and the vitals measured while you sleep',
        weakestFor: 'Daytime and any movement; bottom tier by day despite leading at night',
        affiliateUrl: 'https://www.amazon.com/dp/B0CSRF3Y2F?tag=kygohealthapp-20&th=1', trackLabel: 'oura-ring-gen3'
      },
      {
        key: 'fitbit', name: 'Fitbit Inspire 3', short: 'Fitbit Inspire 3', chip: 'Inspire 3', type: 'watch', tier: 4,
        method: 'Wrist band, optical PPG plus motion; Fitbit HR algorithm.',
        mape: 16.5, mae: 14.3, bias: -14.4, loLo: -51.3, loHi: 22.5, ccc: 0.45,
        nightNote: '5.4% in patients',
        independent: 'Bottom tier in the Gielen protocol (16.5% MAPE, under-reading by 14 bpm, CCC 0.45). But do not over-read it: the same device measured 5.40% MAPE against ECG in cardiac patients during exercise testing (Kitagaki 2025). Protocol and population, not the device alone, drive the number — the clearest illustration that model and protocol beat brand.',
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
      { icon: 'heart', tone: 'dark', tag: 'Irregular rhythm', title: 'Atrial fibrillation breaks it further',
        body: 'During peak exercise in AF the average error jumps to about 29 bpm, versus 14 bpm in normal rhythm, and devices under-read far more often than they over-read (61% vs 25% of readings). It is the rhythm during the reading that matters, not the diagnosis on your chart.',
        src: 'Quinn 2024 (12-lead ECG, N=81)' },
      { icon: 'user', tone: 'mid', tag: 'Skin tone', title: 'Fine at rest, off under load',
        body: 'Pooled data shows no significant pulse-rate bias by skin pigmentation at rest. Under exercise the picture changes: above ~60% effort, medium and dark skin ran about 11.8 bpm off while light skin stayed accurate. On current hardware (Apple Series 9) the limits of agreement widened 4.6-fold from the lightest to the darkest group. The fixes are the same for everyone.',
        src: 'Singh 2024 · Hung 2025 · Chase 2024' },
      { icon: 'alert', tone: 'dark', tag: 'Tattoos', title: 'Ink over the sensor attenuates the signal',
        body: 'A tattoo directly under the sensor scatters the light the optics rely on, and the penalty is largest at rest, where the pulse signal is smallest — one study saw resting error climb from ~3% on clear skin to 23% over ink (much of it dropped readings). Movement masks it, rest exposes it. Keep the sensor on bare, unmarked skin.',
        src: 'Navalta 2025 (within-subject, N=25)' }
    ];
  }

  // ── Accuracy by activity (Ceugniez, one device/one sample = comparable) ──

  get _activities() {
    // Fitbit Charge 4 vs Polar H10, MAPE and signed bias. Ordered best to worst.
    return [
      { name: 'Running', sub: 'steady, best case', mape: 1.2, dir: 'reads true (+0.1 bpm)' },
      { name: 'Cycling', sub: 'some wrist flex', mape: 8.1, dir: 'over-reads +4.8 bpm' },
      { name: 'Tennis', sub: 'sharp arm rotation', mape: 8.9, dir: 'under-reads 6.2 bpm' },
      { name: 'Orienteering', sub: 'run + map handling', mape: 9.5, dir: 'under-reads 8.6 bpm' },
      { name: 'Badminton', sub: 'sharp arm whips', mape: 16.2, dir: 'under-reads 16.5 bpm' },
      { name: 'Soccer', sub: 'random arm actions', mape: 17.5, dir: 'under-reads 16.5 bpm' }
    ];
  }

  _actTone(m) { return m <= 5 ? 'good' : (m <= 10 ? 'ok' : 'poor'); }
  _actPillTone(m) { return m <= 5 ? 'good' : (m <= 10 ? 'mid' : 'dark'); }

  _renderActivities() {
    const max = 18;
    const rows = this._activities.map(a => {
      const w = Math.max(6, Math.min(100, a.mape / max * 100));
      return `<div class="act-row">
        <div class="act-lbl"><span class="act-name">${a.name}</span><span class="act-sub">${a.sub}</span></div>
        <div class="act-track"><span class="act-fill ${this._actTone(a.mape)}" style="width:${w.toFixed(0)}%"></span></div>
        <span class="vpill ${this._actPillTone(a.mape)} act-val">${a.mape.toFixed(1)}%</span>
      </div>`;
    }).join('');
    return `
      <div class="act">
        <div class="act-head">
          <span class="act-head-l">Activity</span>
          <span class="act-head-r">Heart-rate error (MAPE) · lower is better</span>
        </div>
        ${rows}
        <p class="cmp-legend">${this._icon('info')} <strong>These are error rates, not accuracy:</strong> the number is how far the watch is off (median MAPE), so a smaller bar is better. Fitbit Charge 4 vs a Polar H10 chest strap, same 26 people (Ceugniez 2025). <strong>Badminton produces about 13x the error of steady running on the same watch.</strong> During racquet and field sport the watch under-reads, telling you that you worked less hard than you did. Rowing lands the same way (13.4% MAPE, Vermunicht 2025).</p>
      </div>`;
  }

  // ── Day vs night: the same sensor, two completely different numbers ──────

  _splitLogo(key, fallback) {
    const img = this._deviceImage(key);
    return img
      ? `<span class="brand-img sm"><img src="${img}" alt="" loading="lazy" /></span>`
      : `<span class="brand-img sm brand-img--icon">${this._icon(fallback)}</span>`;
  }

  _splitCard(o) {
    const num = v => `<span class="split-num">${v}<span class="split-unit">${o.unit}</span></span>`;
    return `
      <div class="split-card">
        <div class="split-head">
          ${this._splitLogo(o.key, o.icon)}
          <span class="split-dev">${o.device}</span>
          <span class="split-badge">${o.badge}</span>
        </div>
        <div class="split-body">
          <div class="split-stat good">
            <span class="split-lbl">${this._icon('moon')} At night</span>
            ${num(o.night)}
          </div>
          <span class="split-arrow">${this._icon('arrowRight')}</span>
          <div class="split-stat bad">
            <span class="split-lbl">${this._icon('activity')} By day</span>
            ${num(o.day)}
          </div>
        </div>
        <p class="split-foot"><strong>${o.multiplier}</strong> ${o.detail}</p>
      </div>`;
  }

  _renderDayNight() {
    return `
      <div class="splits">
        ${this._splitCard({
          key: 'oura', icon: 'ring', device: 'Oura Ring Gen 3', badge: 'finger ring', unit: '%',
          night: '1.67', day: '15.0', multiplier: 'About 9× the error once you move.',
          detail: 'Same finger sensor, median MAPE. Dial 2025 · Gielen 2026'
        })}
        ${this._splitCard({
          key: 'samsung', icon: 'watch', device: 'Samsung Gear Sport', badge: '24h recording', unit: ' bpm',
          night: '1.06', day: '11.10', multiplier: 'About 10× worse the moment they woke up.',
          detail: 'Same device, one night, asleep vs awake (MAE). Sarhaddi 2022'
        })}
      </div>
      <p class="dn-note">${this._icon('info')} <span><strong>This is the whole story in two devices.</strong> Same sensor, same person — just add movement, and the number falls apart. For the full list of what has actually been validated overnight, flip the chart above to <em>At night, resting</em>. <em>Dial 2025 · Sarhaddi 2022</em></span></p>`;
  }

  // ── How to improve your reading (the free levers) ───────────────────────

  get _levers() {
    return [
      { icon: 'arrowUp', tone: 'good', tag: 'Biggest lever', title: 'Wear it higher up your arm',
        body: 'Moving a watch from one finger-width to three finger-widths above the wrist bone cut error by about 11 points and raised agreement from 0.59 to 0.92. The wrist bone is the worst possible spot for a sensor.',
        src: 'Vermunicht 2025' },
      { icon: 'arrowUp', tone: 'good', tag: 'Free', title: 'Tighten the band (snug, not cutting off)',
        body: 'Contact pressure changes signal quality as much as, or more than, exercise intensity. A loose watch that slides lets in light and motion. Snug it up before a workout, then loosen it after.',
        src: 'Scardulla 2020' },
      { icon: 'arrowUp', tone: 'good', tag: 'For hard sessions', title: 'Use an armband or strap for racquet & rowing',
        body: 'An optical band on the upper arm hit 1.35% error versus 6.82% on the wrist (same-brand comparison), and a chest strap is better still. For badminton, tennis, soccer, rowing and weights, an upper-arm band or chest strap beats any wrist device — the forearm moves far less than the wrist.',
        src: 'Schweizer 2025' },
      { icon: 'arrowUp', tone: 'good', tag: 'Sensor contact', title: 'Keep the sensor on bare, unmarked skin',
        body: 'Tattoos directly under the sensor attenuate the signal, worst at rest. A shirt sleeve, a grimy sensor window or a gap over ink all cost you accuracy. Clean skin, direct contact.',
        src: 'Navalta 2025' },
      { icon: 'arrowUp', tone: 'good', tag: 'Know its limits', title: 'Trust it for the right activities',
        body: 'Believe your wrist HR for running, walking, cycling and sleep, where error is a few percent. Distrust it for racquet sport, rowing and weightlifting, where it can be 13 to 17% off and usually reads low.',
        src: 'Ceugniez 2025 · Zhang 2020' }
    ];
  }

  _renderLevers() {
    return `<div class="sig-grid">${this._levers.map(f => `
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

  // ── Marketing claims vs reality ─────────────────────────────────────────

  get _claims() {
    return [
      { brand: 'WHOOP', verdict: 'Misleading', good: false,
        claim: 'WHOOP is 99.7% accurate in measuring heart rate.',
        reality: 'Traces to one study that measured <strong>nocturnal HR only, one night, on the WHOOP 3.0</strong>. The scope is silently dropped, and the page is still live while WHOOP sells the 5.0 and MG. Against a real exercise ECG, WHOOP 4.0 was second worst of five.',
        src: 'WHOOP marketing page vs Miller 2022 / Van Oost 2025' },
      { brand: 'Oura', verdict: 'Misleading', good: false,
        claim: 'Resting heart rate r-squared of 0.996.',
        reality: 'All four authors of the source study carry an <strong>Oura affiliation</strong>, and it is a nightly-average figure (an r-squared is not an accuracy percentage). For 5-minute segments the same relationship falls to about 0.87, and by day the Gen 3 is bottom tier.',
        src: 'Oura blog vs Kinnunen 2020' },
      { brand: 'Samsung', verdict: 'Misleading', good: false,
        claim: '30% more accurate; 90% correlation while running.',
        reality: 'The 30% baseline is <strong>Samsung’s own previous watch</strong>, so it is a relative claim with no absolute figure and no reference standard. The supporting university work is Samsung-commissioned, unpublished, with no model or sample size disclosed.',
        src: 'Samsung Newsroom' },
      { brand: 'Google / Fitbit', verdict: 'Misleading', good: false,
        claim: '40% more accurate for vigorous activity like HIIT and rowing.',
        reality: 'Applies to the <strong>Pixel Watch 2 specifically</strong> and is frequently misapplied to the Charge 6. There is no baseline, no reference standard and no study; the Fitbit support page lists no numerical HR figure at all.',
        src: 'Google blog 2023' },
      { brand: 'Garmin', verdict: 'No figure', good: false,
        claim: 'None. Manuals redirect to a general accuracy page.',
        reality: 'Garmin publishes <strong>no numerical wrist-HR accuracy figure</strong> in its technology pages, manuals or support docs, alone among the major brands. Independent testing is the only way to judge it.',
        src: 'garmin.com/ataccuracy' },
      { brand: 'Ultrahuman', verdict: 'Not validation', good: false,
        claim: 'Ring HR accurate to a mean error of 2.4–2.6 bpm.',
        reality: 'Based on <strong>n=6</strong>, and the comparison is against an Apple Watch and a SleepImage ring, <strong>not an ECG or chest strap</strong>. Agreement between two optical estimators is not validation against a truth source.',
        src: 'Ultrahuman self-published, Apr 2024' },
      { brand: 'Apple', verdict: 'Transparent', good: true,
        claim: 'Within 5 bpm: 98% sedentary down to 87% walking; background 89% (Series 6+) vs 72% (SE).',
        reality: '<strong>Nothing wrong.</strong> The most transparent disclosure in the category, across 100,000+ workouts, and the 72% background figure is the most useful number any brand publishes. Not peer reviewed, but honest about its own limits.',
        src: 'Apple white paper, Nov 2024' }
    ];
  }

  _renderClaims() {
    return `<div class="claim-acc">${this._claims.map(c => `
      <details class="claim-item${c.good ? ' good' : ''}">
        <summary>
          <span class="claim-brand">${c.brand}</span>
          <span class="claim-sum-right">
            <span class="vpill ${c.good ? 'good' : (/No figure|Not validation/.test(c.verdict) ? 'mid' : 'dark')}">${c.verdict}</span>
            <span class="claim-chev">${this._icon('arrowRight')}</span>
          </span>
        </summary>
        <div class="claim-body">
          <p class="claim-quote">${this._icon('info')} <span>&ldquo;${c.claim}&rdquo;</span></p>
          <p class="claim-reality">${c.reality}</p>
          <span class="claim-src">${c.src}</span>
        </div>
      </details>`).join('')}</div>`;
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
      { tag: 'Independent · intervals', title: 'Reddy et al. 2018: intervals vs maximal effort',
        cite: 'JMIR mHealth uHealth. 2018;6(12):e10338. N=20, Polar H7.', url: 'https://mhealth.jmir.org/2018/12/e10338/' },
      { tag: 'Independent · intervals', title: 'Merrigan et al. 2023: rucking, cycling & circuits',
        cite: 'Meas Phys Educ Exerc Sci. 2023;27(3):234. N=8, Holter ECG.', url: 'https://www.tandfonline.com/doi/full/10.1080/1091367X.2022.2161820' },
      { tag: 'Independent · day vs night', title: 'Sarhaddi et al. 2022: 24-hour sleep vs wake split',
        cite: 'PLOS ONE. 2022;17(12):e0268361. N=28, Shimmer3 ECG.', url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0268361' },
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
      { tag: 'Independent · skin tone', title: 'Chase et al. 2024: skin tone on current hardware',
        cite: 'J Funct Morphol Kinesiol. 2024;9(4):275. Apple Series 9, N=30.', url: 'https://www.mdpi.com/2411-5142/9/4/275' },
      { tag: 'Independent · pigmentation meta', title: 'Singh et al. 2024: skin pigmentation meta-analysis',
        cite: 'J Med Internet Res. 2024;26:e62769. Pulse-rate arm n=176.', url: 'https://www.jmir.org/2024/1/e62769' },
      { tag: 'Independent · contradiction', title: 'Kitagaki et al. 2025: Fitbit Inspire 3 in patients',
        cite: 'JMIR Cardio. 2025;9:e77911. N=30, ECG, MAPE 5.40%.', url: 'https://cardio.jmir.org/2025/1/e77911' },
      { tag: 'Manufacturer', title: 'Apple: Heart rate on Apple Watch white paper',
        cite: 'Apple Inc. Nov 2024. 100,000+ workout sessions.', url: 'https://www.apple.com/health/pdf/Heart_Rate_Calorimetry_Activity_on_Apple_Watch_November_2024.pdf' },
      { tag: 'Manufacturer', title: 'WHOOP: 99.7% accuracy claim page',
        cite: 'Traces to Miller 2022 (nocturnal, one night, WHOOP 3.0).', url: 'https://www.whoop.com/us/en/thelocker/whoop-proven-most-accurate-wearable-in-heart-rate-heart-rate-variability-measurements/' },
      { tag: 'Manufacturer', title: 'Oura: resting-HR r-squared 0.996 claim',
        cite: 'Kinnunen et al. 2020, all authors Oura-affiliated.', url: 'https://ouraring.com/blog/how-accurate-is-oura/' },
      { tag: 'Independent · wear position', title: 'Schweizer & Gilgen-Ammann 2025: upper arm vs wrist',
        cite: 'JMIR Cardio. 2025;9:e67110. Upper-arm 1.35% vs wrist 6.82%.', url: 'https://cardio.jmir.org/2025/1/e67110/' },
      { tag: 'Independent · contact pressure', title: 'Scardulla et al. 2020: sensor contact pressure & PPG',
        cite: 'Sensors. 2020;20(18):5052. N=17 (research prototype).', url: 'https://www.mdpi.com/1424-8220/20/18/5052' },
      { tag: 'Manufacturer', title: 'Samsung: "30% more accurate" Galaxy Watch claim',
        cite: 'Samsung Newsroom, Jul & Sep 2024. Baseline is prior watch.', url: 'https://news.samsung.com/us/samsung-new-galaxy-watch-bioactive-sensor-unlocking-new-possibilities-for-preventative-wellness/' },
      { tag: 'Manufacturer', title: 'Google: Pixel Watch 2 "40% more accurate" claim',
        cite: 'Google blog, Oct 2023. No baseline or study cited.', url: 'https://blog.google/products/pixel/pixel-watch-2-fitbit-charge-6-heart-rate/' }
    ];
  }

  // ── FAQ (also emitted as FAQPage JSON-LD) ────────────────────────────────

  get _faqs() {
    return [
      { q: 'Which wearable is the most accurate for heart rate?',
        a: 'On the largest daytime study, the top tier was the Fitbit Charge 6, Garmin Vivoactive 5 and Google Pixel Watch 2 (median MAPE 5.5 to 6.7%). We say "tier" rather than a strict ranking because the devices were rotated across different people and the reference strap carries its own 2 to 4% error, so the small gaps between them are not meaningful. And "most accurate" depends entirely on what you are doing: at rest almost every device is within a few percent, while during racquet sport, rowing, weights or intervals even the best can be 13 to 26% off. No wrist wearable clears the 5% acceptability line cleanly across a full protocol.' },
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
    return 'Most Accurate Heart Rate Wearable comparison by Kygo Health. Interactive tool: pick 2 to 4 wearables and compare them side by side on five metrics (median MAPE, mean absolute error in bpm, mean bias, limits of agreement spread, and CCC agreement). Which wearable is most accurate for heart rate versus a criterion standard (ECG or chest strap)? The one axis that decides every number is steady versus irregular arm movement, not intensity. Running is one of the easiest conditions for a wrist sensor (Fitbit Charge 4 median MAPE 1.2%), while badminton, tennis, soccer, rowing and weightlifting are the hard ones (badminton 16.2% on the same watch, same wrist). Intervals are worse than maximal effort: on the same bike, error was 11.8% at maximal steady effort but 26.0% on intervals, because changing exercise breaks the sensor, not hard exercise. At night, resting heart rate error drops to about 1.7 to 3%, which is where most manufacturer accuracy claims come from; one Samsung recording went from 1.06 bpm error asleep to 11.10 bpm awake, same device, same night. THE DAYTIME RESULT IS FOUR TIERS, NOT A 1-TO-10 RANKING (Gielen 2026, N=45, Zephyr chest strap, median MAPE). Important caveat: the devices were ROTATED, each tested on about 10 of the 45 participants, NOT worn head-to-head by all 45, and the chest strap carries its own 2.28 to 3.86% error, so gaps smaller than that are not meaningful and ordinal ranking (for example "second of ten" or "9th of 10") should not be used. Tier 1: Fitbit Charge 6 5.5% (CCC 0.93), Garmin Vivoactive 5 6.3% (0.83), Google Pixel Watch 2 6.7% (0.87). Tier 2: Apple Watch SE 7.3% (0.70), Garmin Vivosmart 5 8.1% (0.78). Tier 3: Polar Ignite 3 11.2% (0.63), Xiaomi Watch 2 11.9% (0.69), Polar Pacer 13.1% (0.66). Tier 4 by day: Oura Ring Gen 3 15.0% (0.61), Fitbit Inspire 3 16.5% (0.45). None clears the 5% acceptability line cleanly. How to read it: mean bias is misleading (Apple pooled bias -0.27 bpm but limits of agreement -7.2 to +6.6 bpm), read MAPE and limits of agreement instead; and model matters more than brand (the best and worst devices in the study are both Fitbits, 5.5% and 16.5%). Nocturnal resting HR is superb and every device is good at night: Oura Ring Gen 3 1.67% MAPE (Dial 2025), Oura Ring Gen 4 1.94%, WHOOP 4.0 3.00% (the Polar Grit X Pro 2.71% uses a 4-hour window and is not directly comparable). Best device by purpose: for sleep and resting HR almost any wearable is excellent (rings included); for steady cardio (running, walking, cycling) a Tier 1 or Tier 2 wrist watch is within a few percent; for racquet sport, rowing, weights or intervals no wrist device is trustworthy and a chest strap or upper-arm band is the honest choice. What hurts accuracy regardless of brand: atrial fibrillation raises error to about 29 bpm at peak exercise and devices under-read 61% of the time; skin pigmentation shows no bias at rest but about 11.8 bpm error under load for medium and dark skin, with limits of agreement widening 4.6-fold on current hardware; tattoos over the sensor attenuate the signal, worst at rest. What helps: wear it higher up the arm (cuts error about 11 points, agreement 0.59 to 0.92), tighten the band, and use an armband or strap for hard sessions. Manufacturer claims to distrust: WHOOP 99.7% (sleep only, one night, WHOOP 3.0), Oura r-squared 0.996 (Oura-affiliated authors, nightly average, and an r-squared is not an accuracy percentage), Samsung 30% more accurate (relative to its own prior watch, no absolute figure), Pixel Watch 2 / Fitbit Charge 6 40% more accurate (Pixel Watch 2 only, no study), Garmin publishes no figure at all, Ultrahuman 2.4 to 2.6 bpm (n=6, compared to another optical device not an ECG). Do not cite the common misquote "Apple Watch is 90% accurate": it comes from Wang 2017, where Apple scored a concordance coefficient of 0.91 (not 90% accuracy, and it tied with the Mio Fuse) on 2016-era hardware. Do not cite fabricated figures like "Device 84.6% accurate" or a "University of X 2026 heart rate ranking" that trace to no real study. Sources: Gielen 2026, Van Oost 2025, Dial 2025, Miller 2022, Zhang 2020, Ceugniez 2025, Vermunicht 2025, Reddy 2018, Merrigan 2023, Sarhaddi 2022, Lee 2026, Lambe 2026, Chevance 2022, Fuller 2020, Quinn 2024, Moghaddam 2026, Navalta 2025, Hung 2025, Chase 2024, Singh 2024, Kitagaki 2025. Fitbit vs Garmin vs Apple Watch vs Google Pixel vs Polar vs Oura vs Xiaomi heart rate accuracy. Data verified August 2026.';
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
      arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
      gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14a2 2 0 1 0 0-4"/><path d="M13.4 10.6 16 8"/><path d="M4 20a9 9 0 1 1 16 0"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
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

  // Four tiers from Gielen 2026. Within a tier, and for any gap smaller than the
  // reference strap's own ~2–4% error, the ordering is not meaningful.
  _tierMeta(n) {
    return ({
      1: { color: '#16A34A', bg: 'rgba(34,197,94,0.10)', desc: 'Closest to the 5% line — but the gaps between these three are smaller than the strap\'s own error' },
      2: { color: '#22C55E', bg: 'rgba(34,197,94,0.06)', desc: 'Accurate on average, but individual readings swing wider' },
      3: { color: '#D97706', bg: 'rgba(217,119,6,0.08)', desc: 'Below the acceptability line on mixed daytime movement' },
      4: { color: '#64748B', bg: 'rgba(100,116,139,0.08)', desc: 'Bottom tier by day (the Oura ring is superb at night — see below)' }
    })[n];
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
      { key: 'bias', label: 'Mean bias', unit: 'bpm — read alongside the spread', better: 'zero', noWin: true },
      { key: 'loa', label: 'Limits of agreement', unit: 'bpm spread, tighter is better', better: 'low' },
      { key: 'ccc', label: 'Agreement (CCC)', unit: 'concordance 0–1', better: 'high' }
    ];
  }

  _renderComparator() {
    return `
      <div class="cmpr">
        <div class="cmpr-picker-head">
          <span class="cmpr-picker-title">Choose brands to compare</span>
          <span class="cmpr-picker-hint">Tap to add or remove · 2–3 brands · every model tested is shown</span>
        </div>
        <div class="picker" role="group" aria-label="Choose heart rate brands to compare">
          ${this._brands().map(b => {
            const on = this._selBrands.has(b.key);
            return `<button type="button" class="pick-tile${on ? ' active' : ''}" data-brand-id="${b.key}" aria-pressed="${on}">
              <span class="pick-check">${this._icon('check')}</span>
              ${this._deviceLogo(b.devices[0], 'sm')}
              <span class="pick-name">${b.name}</span>
            </button>`;
          }).join('')}
        </div>
        <div class="cmpr-out" data-cmpr-out>${this._renderCmprResult()}</div>
      </div>`;
  }

  _renderCmprResult() {
    const sel = this._devices.filter(d => this._selBrands.has(d.key));
    if (this._selBrands.size < 2 || sel.length < 2) {
      return `<div class="cmpr-empty">${this._icon('info')} Pick at least two brands above to see their devices side by side.</div>`;
    }
    const rows = this._cmprRows();

    const body = rows.map(r => {
      const vals = sel.map(d => ({ id: this._did(d), v: this._cmprVal(d, r.key) }));
      const valid = vals.filter(x => x.v != null);
      const best = new Set();
      // Highlight the best value per row for genuine metrics only — never for bias,
      // where a near-zero average is misleading (Rule 1). No overall winner is summed.
      if (!r.noWin && valid.length > 1) {
        const metric = x => x.v;
        const target = r.better === 'high' ? Math.max(...valid.map(metric)) : Math.min(...valid.map(metric));
        valid.forEach(x => { if (metric(x) === target) best.add(x.id); });
      }
      const cells = sel.map(d => {
        const id = this._did(d), v = this._cmprVal(d, r.key);
        if (v == null) return `<td><span class="vpill mid">n/a</span></td>`;
        const isBest = best.has(id) && best.size < valid.length;
        const txt = this._cmprFmt(d, r.key);
        return `<td>${isBest ? `<span class="vpill good">${txt}${this._icon('check')}</span>` : `<span class="vpill mid">${txt}</span>`}</td>`;
      }).join('');
      const dir = r.noWin ? 'context, not a win condition' : (r.better === 'high' ? 'higher is better' : 'lower is better');
      return `<tr>
        <th scope="row"><span class="cr-metric">${r.label}</span><span class="cr-unit">${r.unit}</span><span class="cr-dir">${dir}</span></th>
        ${cells}
      </tr>`;
    }).join('');

    const head = `<tr>
      <th class="cr-corner" scope="col">Metric</th>
      ${sel.map(d => `<th scope="col"><span class="cr-dev">${this._deviceLogo(d, 'sm')}<span class="cr-dev-name">${d.chip}</span></span></th>`).join('')}
    </tr>`;

    const tiers = [...new Set(sel.map(d => d.tier))].sort((a, b) => a - b);
    const verdict = tiers.length === 1
      ? `All of these sit in <strong>Tier ${tiers[0]}</strong> of the daytime study. The gaps between them are smaller than the reference strap's own ~2–4% error, so treat them as equivalent by day — what really separates them is the activity you'll use them for. Steady cardio and sleep are easy for all of them; racquet sport, rowing and intervals are hard for all of them.`
      : `These span <strong>Tiers ${tiers[0]}–${tiers[tiers.length - 1]}</strong> by day. Even so, this is one rotated protocol against a chest strap: every device here is far more accurate at rest and far worse during racquet sport, rowing or intervals. Read MAPE and the limits of agreement, not the bias.`;

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
    const toggle = `
      <div class="board-switch">
        <div class="board-toggle" role="group" aria-label="Switch between daytime and nighttime accuracy">
          <button type="button" class="board-btn${this._board === 'day' ? ' active' : ''}" data-board="day" aria-pressed="${this._board === 'day'}">${this._icon('activity')} By day, moving</button>
          <button type="button" class="board-btn${this._board === 'night' ? ' active' : ''}" data-board="night" aria-pressed="${this._board === 'night'}">${this._icon('moon')} At night, resting</button>
        </div>
        <span class="board-hint">${this._board === 'day' ? 'Mixed daytime movement vs a chest strap (Gielen 2026)' : 'Resting heart rate while asleep vs ECG (Dial 2025)'}</span>
      </div>`;
    return toggle + (this._board === 'night' ? this._renderNightBoardTable() : this._renderDayBoardTable());
  }

  _renderNightBoardTable() {
    const rows = this._nightDevices.map(d => {
      const img = this._deviceImage(d.key);
      const logo = img
        ? `<span class="brand-img sm"><img src="${img}" alt="${d.name}" loading="lazy" /></span>`
        : `<span class="brand-img sm brand-img--icon">${this._icon(d.name.includes('Ring') ? 'ring' : (d.name.includes('WHOOP') ? 'strap' : 'watch'))}</span>`;
      return `
        <tr>
          <th class="cmp-td-device" scope="row">
            <span class="brand">${logo}<span class="brand-text"><span class="brand-name">${d.name}${d.caveat ? '<sup>†</sup>' : ''}</span></span></span>
          </th>
          <td>${this._pill(d.mape.toFixed(2) + '%', 'good')}</td>
          <td>${this._pill(d.ccc.toFixed(2), d.ccc >= 0.80 ? 'good' : 'mid')}</td>
        </tr>`;
    }).join('');
    return `
      <div class="cmp">
        <div class="cmp-scroll">
          <table class="cmp-table">
            <thead>
              <tr>
                <th class="cmp-th-device" scope="col">Wearable</th>
                <th scope="col"><span class="th-full">Nocturnal error (MAPE)</span><span class="th-short" aria-hidden="true">MAPE</span></th>
                <th scope="col"><span class="th-full">Agreement (CCC)</span><span class="th-short" aria-hidden="true">CCC</span></th>
              </tr>
            </thead>
            <tbody>
              ${this._bandRow(3, 'rgba(34,197,94,0.10)', '#16A34A', 'All excellent', 'Still body, steady blood flow — at night there is really only one tier')}
              ${rows}
            </tbody>
          </table>
        </div>
        <p class="cmp-legend">${this._icon('info')} <strong>A different, smaller device set.</strong> Overnight validation exists only for these models (Dial 2025, 536 nights vs single-lead ECG) — most watches in the daytime chart have simply never been tested at night, so we cannot re-rank the same ten here. Every device measured overnight lands near 1–3% error: the still body is the easy case, and it is where nearly every "99% accurate" marketing claim is actually taken. <sup>†</sup>Polar reports a 4-hour window, so it is not directly comparable to the others.</p>
      </div>`;
  }

  _renderDayBoardTable() {
    const rows = this._devices;
    let lastTier = 0;
    const bodyRows = rows.map(d => {
      let band = '';
      if (d.tier !== lastTier) {
        lastTier = d.tier;
        const t = this._tierMeta(d.tier);
        band = this._bandRow(4, t.bg, t.color, 'Tier ' + d.tier, t.desc);
      }
      return `${band}
        <tr>
          <th class="cmp-td-device" scope="row">
            <span class="brand">
              ${this._deviceLogo(d, 'sm')}
              <span class="brand-text"><span class="brand-name">${d.name}</span></span>
            </span>
          </th>
          <td>${this._mapePill(d)}${d.nightNote ? `<span class="cell-note">${d.nightNote}</span>` : ''}</td>
          <td>${this._cccPill(d)}</td>
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
                <th scope="col"><span class="th-full">Overall error (MAPE)</span><span class="th-short" aria-hidden="true">MAPE</span></th>
                <th scope="col"><span class="th-full">Agreement (CCC)</span><span class="th-short" aria-hidden="true">CCC</span></th>
                <th scope="col">Buy</th>
              </tr>
            </thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </div>
        <p class="cmp-legend">${this._icon('info')} <strong>What was measured:</strong> each device against a Zephyr chest strap across one daytime protocol (seated rest, a stress task, treadmill and intermittent walking; Gielen 2026). <strong>MAPE</strong> is the average percent a reading is off, so lower is better; <strong>CCC</strong> is agreement with the reference from 0 to 1, where 1.00 is perfect. No device cleanly clears the &lt;5% MAPE line.</p>
        <div class="rank-rules">
          <div class="rank-rule">${this._icon('alert')}<span><strong>Read the tier, not the rank.</strong> Devices were rotated — each was tested on about 10 of the 45 people, not all 45 — and the chest strap carries its own ~2–4% error. Gaps smaller than that are noise, so we group into four tiers rather than a 1-to-10 list.</span></div>
          <div class="rank-rule">${this._icon('gauge')}<span><strong>Bias can lie.</strong> A near-zero average bias just means over-reads and under-reads cancelled out. Read MAPE and the limits of agreement, never the single bias figure a brand quotes.</span></div>
          <div class="rank-rule">${this._icon('layers')}<span><strong>Model beats brand.</strong> The best and worst devices here are both Fitbits (5.5% and 16.5%). "Brand X is accurate" without a model number means nothing.</span></div>
        </div>
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

  _renderFAQ() {
    return this._faqs.map(f => `
      <details>
        <summary>${f.q}</summary>
        <div class="body">${f.a}</div>
      </details>`).join('');
  }

  // ── Related tools (cross-link cards) ────────────────────────────────────
  // Related tools · Kygo standard module ────────────────────────────────
  // Exactly 3 cards: a near neighbour, a bridge between accuracy and
  // physiology, and one from another family. Never links this page to
  // itself, and never links the Food Scanner.

  _relatedTools() {
    return [
      {
        title: 'Resting Heart Rate Factors',
        blurb: '37 factors that move your resting heart rate, sorted by their exact impact in bpm.',
        url: 'https://www.kygo.app/tools/resting-heart-rate-factors',
        meta: 'Recovery · 37 factors',
        motif: { motif: 'range', caption: 'Impact in bpm', rangeLabel: 'Typical shift' }
      },
      {
        title: 'Wearable Accuracy Factor Explorer',
        blurb: '51 tested factors that change how accurate your wearable is, and which ones you can fix tonight.',
        url: 'https://www.kygo.app/tools/accuracy-factors',
        meta: 'Wearables · 51 factors',
        motif: { motif: 'tiers', caption: 'What moves accuracy', tiers: [{ label: 'Minor', h: 0.35 }, { label: 'Moderate', h: 0.62 }, { label: 'Major', h: 1 }] }
      },
      {
        title: 'Fitbit Air vs WHOOP',
        blurb: 'Heart-rate, sleep and calorie accuracy with numbers attached, plus the 3-year cost.',
        url: 'https://www.kygo.app/tools/fitbit-air-vs-whoop-comparison',
        meta: 'Wearables · head-to-head',
        motif: { motif: 'versus', caption: 'Fitbit Air vs WHOOP', versusA: 'Fitbit', versusB: 'WHOOP', versus: [{ a: 84, b: 70 }, { a: 62, b: 88 }, { a: 76, b: 74 }] }
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
      { slug: 'how-accurate-is-your-heart-rate-monitor',
        title: 'How Accurate Is Your Heart Rate Monitor? 10 Devices Ranked',
        blurb: 'Ten wearables, the same 45 wrists, the same day, and error running from 5.5% to 16.5%. Which device you own matters less than you think.',
        cat: 'Wearables & Data', min: 12, img: '273a63_0160a65e547b4b539b2b8be66e2749cf~mv2.png' },
      { slug: 'heart-rate-accuracy-by-activity-type',
        title: 'Heart Rate Accuracy by Activity Type: What Breaks Your Watch',
        blurb: '1.2% error during a run and 16.2% during badminton, on the same watch. What breaks wrist heart rate is not how hard you work.',
        cat: 'HRV & Recovery', min: 13, img: '273a63_9cf51f2ccc2b492fb52f1e15958fe3e1~mv2.png' },
      { slug: 'why-is-my-resting-heart-rate-suddenly-higher-a-data-driven-breakdown',
        title: 'Why Is My Resting Heart Rate Suddenly Higher? A Data-Driven Breakdown',
        blurb: 'Your resting heart rate jumped overnight and your wearable cannot say why. The ten most common causes, from late meals to overtraining.',
        cat: 'HRV & Recovery', min: 7, img: '273a63_03df52034a544018aef1e44af7e6afa7~mv2.png' }
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




  // ── Conversion modules ──────────────────────────────────────────────────

  // Thin mid-page app-download band (lighter than the big dark CTA card)

  // Big dark conversion card (the primary "act now" moment, near the end)

  // ── Main render ─────────────────────────────────────────────────────────

  // Copy for the standard app CTA card. Headline carries one <span> for the
  // green phrase; everything else about the card is shared.
  _appCta() {
    return {
      slug: 'heart-rate-accuracy',
      headline: `See what your <span>heart data</span> is really telling you.`,
      sub: `Your watch estimates your heart rate. Kygo connects your HR, recovery, sleep and nutrition so you can act on the trend, not chase a single reading.`
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
      ['273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7', 'WHOOP'],
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
      /* 7 badges: keep the "Works with" row on one line down to small phones */
      @media(max-width:560px){.kc-badges{gap:8px}.kc-badges img{width:28px;height:28px;padding:3px}}
      @media(max-width:380px){.kc-badges{gap:6px}.kc-badges img{width:26px;height:26px}}
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
    return { source: 'tool-heart-rate-accuracy', variant: 'comparison' };
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
              <div class="hero-pill"><span class="dot"></span> 10 WEARABLES · LAB-VALIDATED</div>
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
            <div class="hero-stat"><div class="num">10</div><div class="lbl">Wearables tested, grouped in 4 tiers</div></div>
          </div>
        </div>
      </section>

      <section class="section bg-light" id="compare">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Build your comparison · daytime</div>
            <h2>Compare brands <span class="hl">side by side.</span></h2>
            <p class="lede">Pick 2–3 brands and every model we have daytime data for appears as its own column, on the five metrics that matter: overall error (MAPE), mean absolute error, bias, limits of agreement, and CCC agreement. All from the same daytime study against a chest strap (Gielen 2026). The better value in each row is highlighted — but small gaps sit inside the strap's own error, so we tell you the tier rather than crown a winner. Where a brand has two models, you will see how far apart they can be.</p>
          </div>
          <div class="animate-on-scroll">${this._renderComparator()}</div>
        </div>
      </section>
      ${this._renderAppCta()}


      <section class="section bg-light">
        <div class="section-inner">
        </div>
      </section>
      ${this._renderEmailCta()}


      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Accuracy by device · day vs night</div>
            <h2>Great at night, <span class="hl">grouped in tiers by day.</span></h2>
            <p class="lede">Use the toggle to switch the chart between daytime and nighttime accuracy. <strong>By day</strong>, the largest study (Gielen 2026) puts ten devices against a chest strap — but they were rotated (each tested on about ten people, not all 45) and the strap carries its own error, so we read it as four tiers, not a 1-to-10 list. <strong>At night</strong>, resting heart rate is the easy case and every validated device is excellent. Scroll sideways on mobile.</p>
          </div>
          <div class="animate-on-scroll" data-rank-out>${this._renderRankMatrix()}</div>
        </div>
      </section>


      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">What actually decides accuracy</div>
            <h2>It is your arm, <span class="hl">not the brand.</span></h2>
            <p class="lede">Accuracy is not decided by the brand or by how hard you work. It is decided by whether your arm is <strong>steady or jerking around</strong>. The same device is near-perfect at rest and during steady running, then falls apart the moment the wrist whips or flexes — which is why the tiers above are a mixed-daytime average, not a verdict on any one activity.</p>
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
            <p class="bias-note">${this._icon('info')} <span><strong>The failure mode is irregular arm movement, not intensity.</strong> High-intensity running is one of the easiest cases; picking things up and racquet sport are the hard ones. <em>Ceugniez 2025 · Vermunicht 2025 · Zhang 2020</em></span></p>
          </div>

          <div class="animate-on-scroll" style="margin-top:28px;">${this._renderActivities()}</div>

          <div class="bias-note animate-on-scroll" style="margin-top:16px;">${this._icon('alert')} <span><strong>Intervals are worse than all-out effort.</strong> Same bike, same people: error was 11.8% at maximal steady effort but jumped to <strong>26.0% on intervals</strong> — the single worst number in the research. It is <em>changing</em> exercise that breaks the sensor, not hard exercise, which is why HIIT and stop-start sport read so poorly. <em>Reddy 2018 · Merrigan 2023</em></span></div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The same sensor, two worlds</div>
            <h2>Great at night, <span class="hl">shaky by day.</span></h2>
            <p class="lede">Wearables look their best when you are asleep, because a still body and steady blood flow are the easy case. That is also where nearly every manufacturer accuracy claim is measured, then quoted as if it held all day.</p>
          </div>
          <div class="animate-on-scroll">${this._renderDayNight()}</div>
        </div>
      </section>

      <section class="section bg-white">
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

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Make yours more accurate</div>
            <h2>Five ways to get a <span class="hl">better reading.</span></h2>
            <p class="lede">You cannot change the sensor, but you control more than you think. These five levers move accuracy more than upgrading to a newer watch does, and four of them are free.</p>
          </div>
          <div class="animate-on-scroll">${this._renderLevers()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">True for every device</div>
            <h2>What no brand <span class="hl">can fix.</span></h2>
            <p class="lede">Three things that hurt accuracy no matter which wearable you buy — they are about your body and your rhythm, not the sensor. Read these before you trust any single number a spec sheet gives you.</p>
          </div>
          <div class="animate-on-scroll">${this._renderFactCards()}</div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Claim vs reality</div>
            <h2>What the marketing says, <span class="hl">and what the studies show.</span></h2>
            <p class="lede">Every big HR accuracy claim traces back to a study. When you read the study, the scope is almost always narrower than the ad. Here is each brand's headline claim next to what the research actually supports.</p>
          </div>
          <div class="animate-on-scroll">${this._renderClaims()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="bottomline animate-on-scroll">
            <div class="bottomline-tag">The bottom line</div>
            <p>If you are buying for daytime tracking, the <strong>top tier</strong> is the <strong>Fitbit Charge 6, Garmin Vivoactive 5 and Google Pixel Watch 2</strong> — and the gaps between them are too small to call a winner. <strong>Oura Gen 3</strong> is superb at night but bottom tier by day, because a finger sensor is not motion-proof. But the honest headline is not a device at all: at rest almost everything is accurate, and during racquet sport, rowing, weights or intervals almost everything is not. Pick for the job — a top-tier watch for steady cardio and sleep, and a chest strap or upper-arm band for stop-start sport. Read MAPE and the limits of agreement, not the bias a brand quotes, and treat any figure from a single night as a best case, not your day.</p>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
        </div>
      </section>

      ${this._renderRelatedTools()}

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">FAQ</div>
            <h2>Common <span class="hl">questions.</span></h2>
          </div>
          <div class="faq">${this._renderFAQ()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every claim, <span class="hl">traceable.</span></h2>
            <p class="lede">Each figure checked against the primary record (journal, PMC or manufacturer paper). ${this._sources.length} sources. Verified August 2026.</p>
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
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Optical wrist and ring heart rate is an estimate, not a clinical measurement, and can be inaccurate during exercise or with an irregular heart rhythm. Consult a qualified healthcare provider before making health decisions based on wearable data.</p>
          <p class="footer-copyright">Data from peer-reviewed validation studies and manufacturer documentation. Last updated August 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases. Product links on this page are affiliate links; we may earn a commission at no extra cost to you.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>

      ${this._renderRelatedPosts()}
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
        'dateModified': '2026-08-08',
        'softwareVersion': '2.0',
        'inLanguage': 'en',
        'isAccessibleForFree': true,
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
        'alternateName': 'Kygo Heart Rate Accuracy Comparison Tool',
        'featureList': 'Compare 10 wearables for heart rate, four daytime accuracy tiers by median MAPE and CCC, mean absolute error, bias and limits of agreement, steady vs irregular arm movement, day vs night, manufacturer vs independent validation',
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
      .hero-light h1 { overflow-wrap: break-word; }
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
      @media (max-width: 880px) { .hero-vis { width: 100%; max-width: 440px; min-width: 0; margin: 4px auto 0; } }
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

      /* Ranking "how to read" rules under the tier matrix */
      .rank-rules { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 14px; }
      @media (min-width: 720px) { .rank-rules { grid-template-columns: repeat(3, 1fr); } }
      .rank-rule { display: flex; gap: 10px; align-items: flex-start; background: #fff; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 13px 15px; font-size: 12.5px; line-height: 1.5; color: var(--fg-2); }
      .rank-rule .ico { width: 15px; height: 15px; color: var(--kygo-green-dark); flex: none; margin-top: 2px; }
      .rank-rule strong { color: var(--fg-1); font-weight: 600; }
      .cmp-tier-row th { font-weight: 700; }

      /* Day/night board toggle above the accuracy chart */
      .board-switch { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px; margin-bottom: 14px; }
      .board-toggle { display: inline-flex; gap: 4px; background: var(--bg-raised); border: 1px solid var(--border-subtle); border-radius: 999px; padding: 4px; }
      .board-btn { display: inline-flex; align-items: center; gap: 6px; border: 0; background: transparent; cursor: pointer; font-family: var(--font-display); font-weight: 600; font-size: 12.5px; color: var(--fg-2); padding: 8px 15px; border-radius: 999px; transition: all .15s ease; white-space: nowrap; }
      .board-btn .ico { width: 14px; height: 14px; }
      .board-btn:hover { color: var(--fg-1); }
      .board-btn.active { background: #fff; color: var(--kygo-green-dark); box-shadow: 0 1px 3px rgba(15,23,42,0.10); }
      .board-hint { font-size: 12px; color: var(--fg-3); }


      /* Day-vs-night split cards (same sensor, two numbers) */
      .splits { display: grid; grid-template-columns: 1fr; gap: 12px; }
      @media (min-width: 640px) { .splits { grid-template-columns: 1fr 1fr; } }
      .split-card { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 16px; padding: 15px; box-shadow: var(--shadow-md); display: flex; flex-direction: column; gap: 12px; }
      .split-head { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 10px; }
      .split-head .brand-img.sm { width: 28px; height: 28px; border-radius: 8px; }
      .split-dev { font-family: var(--font-display); font-weight: 700; font-size: 13.5px; color: var(--fg-1); flex: 1 1 auto; min-width: 0; }
      .split-badge { margin-left: auto; font-family: var(--font-display); font-weight: 600; font-size: 9px; text-transform: uppercase; letter-spacing: 0.4px; color: var(--fg-3); background: var(--bg-raised); padding: 3px 8px; border-radius: 999px; white-space: nowrap; }
      .split-body { display: grid; grid-template-columns: 1fr auto 1fr; align-items: stretch; gap: 8px; }
      .split-stat { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; text-align: center; padding: 11px 6px; border-radius: 12px; }
      .split-stat.good { background: var(--kygo-green-light); }
      .split-stat.bad { background: rgba(239,68,68,0.08); }
      .split-lbl { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-display); font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap; }
      .split-lbl .ico { width: 12px; height: 12px; }
      .split-stat.good .split-lbl { color: var(--kygo-green-dark); }
      .split-stat.bad .split-lbl { color: #DC2626; }
      .split-num { font-family: var(--font-display); font-weight: 700; font-size: clamp(21px, 4.8vw, 27px); line-height: 1; letter-spacing: -0.02em; white-space: nowrap; }
      .split-unit { font-size: 0.46em; font-weight: 600; letter-spacing: 0; }
      .split-stat.good .split-num { color: var(--kygo-green-dark); }
      .split-stat.bad .split-num { color: #DC2626; }
      .split-arrow { display: inline-flex; align-items: center; justify-content: center; color: var(--fg-3); }
      .split-arrow .ico { width: 18px; height: 18px; }
      .split-foot { margin: 0; font-size: 12px; line-height: 1.5; color: var(--fg-3); text-align: center; }
      .split-foot strong { color: var(--fg-1); font-weight: 600; }

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
      .cmp-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 340px; }
      @media (min-width: 768px) { .cmp-table { min-width: 560px; } }
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

      /* Accuracy-by-activity ranked bars */
      .act { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 16px 18px 6px; box-shadow: var(--shadow-md); }
      @media (min-width: 768px) { .act { border-radius: 22px; padding: 20px 24px 8px; } }
      .act-head { display: grid; grid-template-columns: 96px 1fr auto; gap: 10px; align-items: baseline; padding: 0 0 10px; border-bottom: 1px solid var(--border-subtle); }
      @media (min-width: 560px) { .act-head { grid-template-columns: 140px 1fr auto; gap: 14px; } }
      .act-head-l { font-family: var(--font-display); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; color: var(--fg-3); }
      .act-head-r { grid-column: 2 / -1; justify-self: end; text-align: right; font-family: var(--font-display); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; color: var(--kygo-green-dark); line-height: 1.3; }
      .act-row { display: grid; grid-template-columns: 96px 1fr 58px; gap: 10px; align-items: center; padding: 9px 0; }
      .act-row + .act-row { border-top: 1px solid var(--border-subtle); }
      @media (min-width: 560px) { .act-row { grid-template-columns: 140px 1fr 64px; gap: 14px; } }
      .act-lbl { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
      .act-name { font-family: var(--font-display); font-weight: 600; font-size: 13px; color: var(--fg-1); line-height: 1.2; }
      .act-sub { font-size: 10px; color: var(--fg-3); line-height: 1.25; }
      .act-track { height: 12px; border-radius: 999px; background: var(--bg-raised); overflow: hidden; }
      .act-fill { display: block; height: 100%; border-radius: 999px; }
      .act-fill.good { background: var(--kygo-green); }
      .act-fill.ok { background: #86EFAC; }
      .act-fill.poor { background: #CBD5E1; }
      .act-val { justify-self: end; font-family: var(--font-numeric, var(--font-display)); }
      .act .cmp-legend { padding: 12px 0 12px; }

      /* Day vs night boards */
      .dn { display: grid; grid-template-columns: 1fr; gap: 12px; }
      @media (min-width: 720px) { .dn { grid-template-columns: 1fr 1fr; } }
      .dn-col { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 16px; padding: 16px 18px; box-shadow: var(--shadow-md); }
      .dn-col.night { border-color: var(--kygo-green); box-shadow: 0 8px 24px rgba(34,197,94,0.10); }
      .dn-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 6px; }
      .dn-ico { width: 30px; height: 30px; border-radius: 9px; background: var(--bg-raised); color: var(--fg-2); display: inline-flex; align-items: center; justify-content: center; flex: none; }
      .dn-ico.good { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .dn-ico .ico { width: 15px; height: 15px; }
      .dn-title { font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--fg-1); }
      .dn-tag { margin-left: auto; font-family: var(--font-display); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; color: var(--fg-3); background: var(--bg-raised); padding: 3px 9px; border-radius: 999px; }
      .dn-tag.good { color: var(--kygo-green-dark); background: var(--kygo-green-light); }
      .dn-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 0; border-top: 1px solid var(--border-subtle); }
      .dn-row.flag { margin: 0 -10px; padding: 10px; border-radius: 10px; background: var(--kygo-green-light); border-top-color: transparent; }
      .dn-dev { font-size: 13px; font-weight: 500; color: var(--fg-1); }
      .dn-row.flag .dn-dev { font-weight: 700; color: var(--kygo-green-dark); }
      .dn-val { font-family: var(--font-display); font-weight: 700; font-size: 15px; color: var(--fg-2); letter-spacing: -0.01em; }
      .dn-row.flag .dn-val { color: var(--kygo-green-dark); }
      .dn-foot { margin: 10px 0 0; font-size: 11px; color: var(--fg-3); }
      .dn-note { grid-column: 1 / -1; display: flex; gap: 10px; align-items: flex-start; margin: 2px 0 0; font-size: 13px; line-height: 1.55; color: var(--fg-2); background: #fff; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 14px 16px; }
      .dn-note .ico { width: 16px; height: 16px; color: var(--kygo-green-dark); flex: none; margin-top: 2px; }
      .dn-note strong { color: var(--fg-1); font-weight: 600; }
      .dn-note em { font-style: normal; color: var(--fg-3); font-size: 12px; }

      /* Marketing claims vs reality (expandable list) */
      .claim-acc { display: grid; grid-template-columns: 1fr; gap: 10px; align-items: start; }
      @media (min-width: 768px) { .claim-acc { grid-template-columns: 1fr 1fr; gap: 12px; } }
      .claim-item { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; overflow: hidden; box-shadow: var(--shadow-md); transition: border-color .2s; }
      .claim-item.good { border-color: rgba(34,197,94,0.40); }
      .claim-item[open] { border-color: var(--kygo-green); }
      .claim-item > summary { list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; }
      .claim-item > summary::-webkit-details-marker { display: none; }
      .claim-item > summary:hover { background: var(--bg-surface); }
      .claim-brand { font-family: var(--font-display); font-weight: 700; font-size: 15px; color: var(--fg-1); }
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
      .bottomline strong { color: #fff; font-weight: 600; }
      .bottomline em { font-style: italic; color: #fff; }

      /* Blog CTA */

      /* Thin app-download band (lighter than the big dark CTA card) */
      .kband { max-width: 1100px; margin: 0 auto; }
      .kband-inner { position: relative; overflow: hidden; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; padding: 28px 32px; display: flex; align-items: center; justify-content: space-between; gap: 36px; box-shadow: var(--shadow-md); }
      .kband-glow { position: absolute; top: -120px; right: -80px; width: 360px; height: 360px; background: radial-gradient(circle, rgba(34,197,94,0.14), transparent 65%); pointer-events: none; }
      .kband-copy { position: relative; display: flex; flex-direction: column; gap: 8px; flex: 1 1 auto; min-width: 0; max-width: 640px; }
      .kband-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: var(--font-display); font-weight: 600; font-size: 11px; letter-spacing: 0.7px; text-transform: uppercase; color: var(--kygo-green-dark); }
      .kband-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--kygo-green); animation: kygoPulse 2s ease-out infinite; }
      .kband-headline { margin: 0; font-family: var(--font-display); font-weight: 600; font-size: clamp(18px, 2.4vw, 23px); line-height: 1.3; color: var(--fg-1); }
      .kband-actions { position: relative; display: flex; flex-wrap: wrap; gap: 12px; flex-shrink: 0; max-width: 420px; }
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
