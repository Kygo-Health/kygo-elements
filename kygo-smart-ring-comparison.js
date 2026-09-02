/**
 * Kygo Health, Smart Ring Comparison and Picker (2026)
 * Tag: kygo-smart-ring-comparison
 * URL: /tools/smart-ring-comparison
 * Mobile-first comparison of every current smart ring across four brands,
 * Oura (Ring 5 / Ring 4), RingConn (Gen 3 / Gen 2 / Gen 2 Air), Ultrahuman
 * (Ring PRO / Ring AIR) and CUDIS (002 Classic / 002 Sporty): a priority-based
 * ring finder, model-by-model specs, a feature matrix, the validation record,
 * and the real multi-year cost with subscriptions and paid add-ons included.
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

class KygoSmartRingComparison extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._activeTab = 'Overview';
    this._featTab = 'Daily scores';
    // Ring finder: the priorities the reader has switched on. Empty = all
    // criteria weighted equally (the "all-round" ranking).
    this._priorities = new Set();
    // Spec table: which models are shown as columns (min 2, max 4).
    this._cols = ['ring5', 'gen3', 'uhpro', 'cudisc'];
    // Cost calculator state.
    this._calcA = 'ring5';
    this._calcB = 'gen3';
    this._years = 3;
    this._plugs = false;
    this._observer = null;
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
    this._setupAnimations();
    __seo(this, this._seoText());
    this._injectStructuredData();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // -- Data: brands ------------------------------------------------------
  // `img` is the Wix-hosted brand image where one exists. CUDIS has no
  // brand asset in the library, so it falls back to a lettered tile rather
  // than borrowing another brand's image.

  get _brands() {
    return {
      oura:       { name: 'Oura',       img: 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png' },
      ringconn:   { name: 'RingConn',   img: 'https://static.wixstatic.com/media/273a63_fc0ed00ac88441138f7b4c7e398f7aa8~mv2.png' },
      ultrahuman: { name: 'Ultrahuman', img: 'https://static.wixstatic.com/media/273a63_810650aa12fe4ae59ce7e22c25c312fc~mv2.png' },
      cudis:      { name: 'CUDIS',      img: '' },
    };
  }

  _brandMark(brandKey, cls) {
    const b = this._brands[brandKey];
    if (!b) return '';
    if (b.img) return `<img class="${cls || ''}" src="${b.img}" alt="" loading="lazy" />`;
    return `<span class="${cls || ''} brand-fb" aria-hidden="true">${b.name.charAt(0)}</span>`;
  }

  // -- Data: the nine current models -------------------------------------
  // `hw` is the verified US price. `sub` is the required annual fee (Oura
  // only). `addon` is the optional annual add-on cost a brand publishes for
  // its full software set (Ultrahuman's PowerPlugs bundle, valued at $133/yr
  // on Ultrahuman's own Ring Rare page). `s` holds the ring-finder scores
  // that are judgements rather than arithmetic; every other score is
  // computed from this data so a number can never drift from the table.

  get _models() {
    return [
      { key: 'ring5', brand: 'oura', name: 'Oura Ring 5', short: 'Ring 5', hw: 399, sub: 69.99, addon: 0, battery: 9,
        buy: { label: 'Amazon', url: 'https://www.amazon.com/dp/B0GRK1N94H?tag=kygohealthapp-20&th=1', slug: 'oura-ring-5', aff: true },
        why: 'The deepest published feature set of any ring here and the only lineup with independent peer-reviewed validation behind it. The membership is the price of entry.',
        s: { nosub: 15, evidence: 100, apnea: 25, women: 100, usnow: 100 } },
      { key: 'ring4', brand: 'oura', name: 'Oura Ring 4', short: 'Ring 4', hw: 349, sub: 69.99, addon: 0, battery: 8,
        buy: { label: 'Amazon', url: 'https://www.amazon.com/dp/B0D9WT1S2T?tag=kygohealthapp-20&th=1', slug: 'oura-ring-4', aff: true },
        why: 'The cheapest way into the Oura app and the same software as the Ring 5, including the metabolic suite and Natural Cycles pairing. Membership still applies.',
        s: { nosub: 15, evidence: 100, apnea: 25, women: 100, usnow: 100 } },
      { key: 'gen3', brand: 'ringconn', name: 'RingConn Gen 3', short: 'Gen 3', hw: 349, sub: 0, addon: 0, battery: 14,
        buy: { label: 'Amazon', url: 'https://www.amazon.com/dp/B0GVSB66ZY?tag=kygohealthapp-20&th=1', slug: 'ringconn-gen3', aff: true },
        why: 'Everything unlocked at purchase, 14-day rated battery, the charging case in the box, plus sleep apnea pattern monitoring and nighttime vascular trends.',
        s: { nosub: 100, evidence: 55, apnea: 100, women: 85, usnow: 100 } },
      { key: 'gen2', brand: 'ringconn', name: 'RingConn Gen 2', short: 'Gen 2', hw: 299, sub: 0, addon: 0, battery: 12,
        buy: { label: 'Amazon', url: 'https://www.amazon.com/dp/B0DG2S6GC1?tag=kygohealthapp-20&th=1', slug: 'ringconn-gen2', aff: true },
        why: 'Apnea pattern monitoring, SpO2, HRV and cycle tracking at $299 with no subscription. The thinnest wall here at 2.0 mm.',
        s: { nosub: 100, evidence: 55, apnea: 100, women: 85, usnow: 100 } },
      { key: 'gen2air', brand: 'ringconn', name: 'RingConn Gen 2 Air', short: 'Gen 2 Air', hw: 199, sub: 0, addon: 0, battery: 10,
        buy: { label: 'Amazon', url: 'https://www.amazon.com/dp/B0DWJR7F6T?tag=kygohealthapp-20&th=1', slug: 'ringconn-gen2-air', aff: true },
        why: 'The lowest-cost ring in this comparison at $199 flat. It drops apnea monitoring and swaps titanium for stainless steel, but keeps the core sensing.',
        s: { nosub: 100, evidence: 55, apnea: 0, women: 85, usnow: 100 } },
      { key: 'uhpro', brand: 'ultrahuman', name: 'Ultrahuman Ring PRO', short: 'Ring PRO', hw: 479, sub: 0, addon: 133, battery: 15,
        buy: { label: 'ultrahuman.com', url: 'https://www.ultrahuman.com/us/ring-pro/buy/', slug: 'ultrahuman-ring-pro', aff: false },
        why: 'The longest rated battery here (15 days, up to 45 with the case) and the widest first-party ecosystem: CGM, blood panels, a home sleep monitor. It is still a US pre-order.',
        s: { nosub: 80, evidence: 25, apnea: 0, women: 90, usnow: 40 } },
      { key: 'uhair', brand: 'ultrahuman', name: 'Ultrahuman Ring AIR', short: 'Ring AIR', hw: 349, sub: 0, addon: 133, battery: 6,
        buy: { label: 'ultrahuman.com', url: 'https://www.ultrahuman.com/global/ring/buy/', slug: 'ultrahuman-ring-air', aff: false },
        why: 'The lightest ring here at 2.4 g and the same software as the PRO, but it cannot be sold or shipped to a US address under the ITC exclusion order.',
        s: { nosub: 80, evidence: 25, apnea: 0, women: 90, usnow: 0 } },
      { key: 'cudisc', brand: 'cudis', name: 'CUDIS 002 Classic', short: '002 Classic', hw: 349, sub: 0, addon: 0, battery: 10,
        buy: { label: 'cudis.xyz', url: 'https://www.cudis.xyz/products/cudis-002-classic-ring', slug: 'cudis-002-classic', aff: false },
        why: 'No subscription, a 10-day battery that reviewers beat, and the strongest sleep agreement of the four brands in one hands-on test. It has no temperature sensor and no published validation.',
        s: { nosub: 100, evidence: 5, apnea: 0, women: 20, usnow: 100 } },
      { key: 'cudiss', brand: 'cudis', name: 'CUDIS 002 Sporty', short: '002 Sporty', hw: 399, sub: 0, addon: 0, battery: 10,
        buy: { label: 'cudis.xyz', url: 'https://www.cudis.xyz/products/cudis-002-sporty-ring', slug: 'cudis-002-sporty', aff: false },
        why: 'The Classic plus 12 interchangeable silicone bands and a Sports Mode, at $50 more. Same sensor set as the Classic, so the same missing temperature sensor and the same lack of any published accuracy data.',
        s: { nosub: 100, evidence: 5, apnea: 0, women: 20, usnow: 100 } },
    ];
  }

  _model(key) { return this._models.find(m => m.key === key); }

  // Total cost of ownership. Oura bills $69.99/yr with the first month free
  // for new members, which is why a 3-year Ring 5 lands at ~$603 and not the
  // naive $609. `plugs` adds Ultrahuman's full PowerPlugs bundle.
  _cost(m, years, plugs) {
    const firstMonthFree = m.sub ? m.sub / 12 : 0;
    const recurring = m.sub * years - firstMonthFree;
    const addon = (plugs && m.addon) ? m.addon * years : 0;
    return m.hw + recurring + addon;
  }

  _fmt(n) { return '$' + Math.round(n).toLocaleString(); }

  // -- Data: spec comparison ---------------------------------------------
  // Every value is the manufacturer's own published figure, verified
  // September 2, 2026. "not published" is used literally: it means the brand
  // publishes no number, not that the number is unknown to reviewers.

  get _specs() {
    const y = (t) => `<span class="y">${t}</span>`;
    const n = (t) => `<span class="n">${t}</span>`;
    const num = (t, win) => `<span class="num${win ? ' y' : ''}">${t}</span>`;
    return {
      Overview: [
        { name: 'Brand', ring5: 'Oura', ring4: 'Oura', gen3: 'RingConn', gen2: 'RingConn', gen2air: 'RingConn', uhpro: 'Ultrahuman', uhair: 'Ultrahuman', cudisc: 'CUDIS', cudiss: 'CUDIS' },
        { name: 'Released', ring5: 'May 28, 2026', ring4: 'Oct 3, 2024', gen3: 'CES 2026', gen2: 'Current', gen2air: 'Current', uhpro: 'Announced Feb 2026', uhair: '2023', cudisc: '2024', cudiss: 'Kickstarter Feb 2026' },
        { name: 'US price', info: 'Before any subscription or add-on', ring5: '$399', ring4: '$349', gen3: '$349', gen2: '$299', gen2air: y('$199'), uhpro: '$479', uhair: '$349 (global store)', cudisc: '$349', cudiss: '$399' },
        { name: 'Required subscription', info: 'For the full feature set', ring5: n('$5.99/mo · $69.99/yr'), ring4: n('$5.99/mo · $69.99/yr'), gen3: y('None'), gen2: y('None'), gen2air: y('None'), uhpro: y('None for ring data'), uhair: y('None for ring data'), cudisc: y('None'), cudiss: y('None') },
        { name: 'Optional paid add-ons', ring5: 'n/a', ring4: 'n/a', gen3: 'n/a', gen2: 'n/a', gen2air: 'n/a', uhpro: n('PowerPlugs, $133/yr for all'), uhair: n('PowerPlugs, $133/yr for all'), cudisc: 'n/a', cudiss: 'n/a' },
        { name: 'US availability', info: 'Verified Sept 2, 2026', ring5: y('Shipping'), ring4: y('Shipping'), gen3: y('Shipping'), gen2: y('Shipping'), gen2air: y('Shipping'), uhpro: n('Pre-order, "shipping Sept 15 onwards"'), uhair: n('Blocked. US buy page redirects to the PRO'), cudisc: y('Shipping'), cudiss: y('Shipping, some sizes sold out') },
        { name: 'Finishes', ring5: '6 finishes', ring4: '3 finishes', gen3: '5 finishes', gen2: '4 finishes', gen2air: '2 finishes', uhpro: '4 finishes', uhair: '6 finishes', cudisc: '4 finishes', cudiss: '1 body + 12 bands' },
        { name: 'HSA/FSA eligible', ring5: y('Yes'), ring4: y('Yes'), gen3: y('Yes (via Flex)'), gen2: y('Yes'), gen2air: y('Yes'), uhpro: y('Yes (via Flex)'), uhair: y('Yes (via Flex)'), cudisc: y('Yes'), cudiss: y('Yes') },
        { name: 'Water resistance', ring5: '100 m + IP68', ring4: '100 m', gen3: 'IP68 / 10 ATM, 100 m', gen2: '100 m', gen2air: '100 m', uhpro: '100 m', uhair: '100 m, stated "up to 12 hours"', cudisc: '5 ATM / 50 m', cudiss: '5 ATM / 50 m' },
      ],
      Hardware: [
        { name: 'Band width', info: 'Three brands do not publish width', ring5: y('6.09 mm'), ring4: '7.90 mm', gen3: 'not published', gen2: 'not published', gen2air: 'not published', uhpro: 'not published', uhair: '8.1 mm', cudisc: 'not published', cudiss: 'not published' },
        { name: 'Wall thickness', info: 'Ultrahuman publishes two conflicting AIR figures', ring5: '2.28 mm', ring4: '2.88 mm', gen3: '2.3 mm', gen2: y('2.0 mm'), gen2air: y('2.0 mm'), uhpro: '2.65 mm', uhair: '2.45–2.8 mm', cudisc: 'not published', cudiss: 'not published' },
        { name: 'Weight', info: 'Varies by size', ring5: y('from 2 g'), ring4: '3.3–5.2 g', gen3: '2.5–3.5 g', gen2: y('2–3 g'), gen2air: '2.5–4 g', uhpro: '3.3–4.8 g', uhair: y('2.4–3.6 g'), cudisc: '3 g', cudiss: '3 g' },
        { name: 'Material', ring5: 'Titanium', ring4: 'Titanium', gen3: 'Titanium + epoxy, PVD', gen2: 'Aerospace titanium + epoxy', gen2air: 'Stainless steel + epoxy', uhpro: 'Titanium unibody, PVD + polycarbonate', uhair: 'Titanium + tungsten carbide coating', cudisc: '"Full titanium construction"', cudiss: 'Titanium core + silicone band' },
        { name: 'Size range', info: 'US ring sizes', ring5: '6–13', ring4: y('4–15'), gen3: '6–15', gen2: '6–14', gen2air: '6–14', uhpro: '5–14', uhair: '5–14', cudisc: '6–14', cudiss: '6–14' },
        { name: 'Skin temperature sensor', info: 'Drives cycle and illness features', ring5: y('Yes'), ring4: y('Yes'), gen3: y('Yes'), gen2: y('Yes'), gen2air: y('Yes'), uhpro: y('Yes'), uhair: y('Yes, non-contact'), cudisc: n('No'), cudiss: n('No') },
        { name: 'Sensors', ring5: '2 photodetectors, dual triple LEDs, 12 pathways, temp, accel', ring4: 'Red/green/IR LEDs, 3 photodiodes, temp, accel', gen3: 'Optical HR, temp, 3-axis accel, vibration motor', gen2: 'Optical HR, temp, accel', gen2air: 'Optical HR, temp, accel', uhpro: 'Redesigned PPG, temp, 6-axis IMU', uhair: 'Infrared PPG, red + green + IR LEDs, temp, 6-axis', cudisc: 'Optical PPG (HR, HRV, SpO2) + motion', cudiss: 'Optical PPG (HR, HRV, SpO2) + motion' },
        { name: 'On-ring offline storage', ring5: 'not published', ring4: 'not published', gen3: '10 days', gen2: '7 days', gen2air: '7 days', uhpro: y('Up to 250 days'), uhair: '4 days', cudisc: 'not published', cudiss: 'not published' },
        { name: 'Processor', ring5: 'not published', ring4: 'not published', gen3: 'not published', gen2: 'not published', gen2air: 'not published', uhpro: y('Dual-core, on-chip machine learning'), uhair: 'Single-core', cudisc: 'not published', cudiss: 'not published' },
        { name: 'Connectivity', ring5: 'BLE', ring4: 'BLE', gen3: 'Bluetooth 5.0', gen2: 'Bluetooth', gen2air: 'Bluetooth', uhpro: 'BLE 5.3', uhair: 'BLE5, 2.4 GHz', cudisc: 'BLE, version not published', cudiss: 'BLE, version not published' },
      ],
      Battery: [
        { name: 'Rated battery', info: 'Manufacturer ratings, not cross-comparable', ring5: '6–9 days', ring4: '5–8 days', gen3: 'Up to 14 days', gen2: 'Up to 12 days', gen2air: 'Up to 10 days', uhpro: y('Up to 15 days'), uhair: n('4–6 days'), cudisc: 'Up to 10 days', cudiss: 'Up to 10 days' },
        { name: 'Total with case', ring5: 'n/a', ring4: 'n/a', gen3: 'Up to 150 days with case', gen2: 'Up to 150 days with case', gen2air: 'n/a', uhpro: y('Up to 45 days with case'), uhair: 'n/a', cudisc: 'n/a', cudiss: 'n/a' },
        { name: 'Ring charge time', ring5: '~80 min', ring4: '20–80 min', gen3: '~90 min', gen2: '~90 min', gen2air: '~90 min', uhpro: 'not published', uhair: n('180 min'), cudisc: 'not published', cudiss: 'not published' },
        { name: 'Charger in box', ring5: n('Pad only · $99 case add-on'), ring4: n('Size-specific charger'), gen3: y('Wireless case'), gen2: y('Wireless case'), gen2air: y('Wired dock'), uhpro: y('PRO Charging Case, currently free'), uhair: n('Wireless pad only'), cudisc: y('USB-C charging pod'), cudiss: y('Charging pod + bands') },
        { name: 'Extra-cost charger', ring5: '$99 case (holds ~5 charges)', ring4: 'n/a', gen3: 'n/a', gen2: 'n/a', gen2air: '$39.90 case option', uhpro: 'n/a', uhair: 'Voyager charger $45', cudisc: 'Charging Pod $50 (sold out)', cudiss: 'Charging Pod $50 (sold out)' },
      ],
      Cost: [
        { name: 'Hardware price', ring5: num('$399'), ring4: num('$349'), gen3: num('$349'), gen2: num('$299'), gen2air: num('$199', true), uhpro: num('$479'), uhair: num('$349'), cudisc: num('$349'), cudiss: num('$399') },
        { name: 'Required over 3 years', info: 'Subscription only', ring5: num('$204'), ring4: num('$204'), gen3: num('$0', true), gen2: num('$0', true), gen2air: num('$0', true), uhpro: num('$0', true), uhair: num('$0', true), cudisc: num('$0', true), cudiss: num('$0', true) },
        { name: '3-year total cost', info: 'Hardware + required subscription', ring5: num('~$603'), ring4: num('~$553'), gen3: num('$349'), gen2: num('$299'), gen2air: num('$199', true), uhpro: num('$479'), uhair: num('$349'), cudisc: num('$349'), cudiss: num('$399') },
        { name: '5-year total cost', ring5: num('~$743'), ring4: num('~$693'), gen3: num('$349'), gen2: num('$299'), gen2air: num('$199', true), uhpro: num('$479'), uhair: num('$349'), cudisc: num('$349'), cudiss: num('$399') },
        { name: '3-year with all add-ons', info: 'Ultrahuman PowerPlugs at $133/yr', ring5: num('~$603'), ring4: num('~$553'), gen3: num('$349'), gen2: num('$299'), gen2air: num('$199', true), uhpro: num('~$878'), uhair: num('~$748'), cudisc: num('$349'), cudiss: num('$399') },
        { name: 'What you get without paying more', ring5: n('3 daily scores only'), ring4: n('3 daily scores only'), gen3: y('Everything'), gen2: y('Everything'), gen2air: y('Everything'), uhpro: 'All ring data, no AFib or ovulation confirmation', uhair: 'All ring data, no AFib or ovulation confirmation', cudisc: y('Everything'), cudiss: y('Everything') },
      ],
      Validation: [
        { name: 'Independent peer-reviewed validation', info: 'PSG or ECG referenced, not company-run', ring5: y('Yes, Oura lineup'), ring4: y('Yes, Oura lineup'), gen3: n('None found'), gen2: n('None found'), gen2air: n('None found'), uhpro: n('None found'), uhair: n('None found'), cudisc: n('None found'), cudiss: n('None found') },
        { name: 'Company-published accuracy figures', ring5: 'Research program + advisory board', ring4: 'Research program + advisory board', gen3: 'HR >98%, SpO2 <1.9% MAE, sleep >99%, steps >95%. No method published', gen2: 'Apnea 90.7% (product page)', gen2air: 'Not itemised', uhpro: 'Sleep HR pilot, n=6, vs other consumer devices', uhair: 'Sleep HR pilot, n=6, vs other consumer devices', cudisc: n('None published'), cudiss: n('None published') },
        { name: 'Strongest external evidence', ring5: 'Multiple peer-reviewed studies', ring4: 'Multiple peer-reviewed studies', gen3: 'Ruijin Hospital OSAHS feasibility study, 230 volunteers, r=0.93', gen2: 'Same Ruijin study', gen2air: 'None specific', uhpro: 'Frontiers 2026 cohort, n=442, all 7 authors are employees, no CPET comparison', uhair: 'Same Frontiers cohort', cudisc: 'One hands-on review using an Oura Ring 5 as control', cudiss: 'One hands-on review using an Oura Ring 5 as control' },
        { name: 'FDA clearance held by the brand', ring5: n('None'), ring4: n('None'), gen3: n('None'), gen2: n('None'), gen2air: n('None'), uhpro: n('None. AFib runs on FibriCheck K173872'), uhair: n('None. AFib runs on FibriCheck K173872'), cudisc: n('No FDA record of any kind'), cudiss: n('No FDA record of any kind') },
        { name: 'Legal or regulatory constraint', ring5: 'None', ring4: 'None', gen3: 'Settled the Oura ITC case with a royalty licence', gen2: 'Same settlement', gen2air: 'Same settlement', uhpro: n('Enters the US only under CBP ruling HQ H354023'), uhair: n('Barred by the ITC exclusion order in 337-TA-1398'), cudisc: 'None found', cudiss: 'None found' },
      ],
      Warranty: [
        { name: 'Standard warranty', ring5: '1 yr US (2 yr some regions)', ring4: '1 yr US (2 yr some regions)', gen3: '1 yr (2 yr EEA)', gen2: '1 yr (2 yr EEA)', gen2air: '1 yr (2 yr EEA)', uhpro: n('1 yr, country of purchase only'), uhair: n('1 yr, country of purchase only'), cudisc: '1 yr', cudiss: '1 yr' },
        { name: 'Return window', ring5: y('30 days'), ring4: y('30 days'), gen3: '14 days', gen2: '14 days', gen2air: '14 days', uhpro: n('Not documented for the PRO'), uhair: y('30 days'), cudisc: y('30 days'), cudiss: y('30 days') },
        { name: 'Extended protection', ring5: '2-yr $45 / 3-yr $60', ring4: '2-yr $45 / 3-yr $60', gen3: 'Care+ 2-yr $40.99 / 3-yr $51.99', gen2: 'Care+ 2-yr $35.99', gen2air: 'Care+ 2-yr $28.99', uhpro: 'UltrahumanX $36/1 yr, $54/2 yr', uhair: 'UltrahumanX $36/1 yr, $54/2 yr', cudisc: '2-yr upgrade $50', cudiss: '2-yr upgrade $50' },
        { name: 'Insurer-backed protection', ring5: 'not stated', ring4: 'not stated', gen3: 'not stated', gen2: 'not stated', gen2air: 'not stated', uhpro: n('No. "Backed by Ultrahuman, not by an insurer"'), uhair: n('No. "Backed by Ultrahuman, not by an insurer"'), cudisc: 'not stated', cudiss: 'not stated' },
        { name: 'Trade-in program', ring5: n('None found'), ring4: n('None found'), gen3: y('Up to $70'), gen2: y('Listed per model'), gen2air: y('Listed per model'), uhpro: y('Up to $115'), uhair: n('None found'), cudisc: n('None found'), cudiss: n('None found') },
      ],
    };
  }

  // -- Data: feature comparison (brand level) ----------------------------
  // Each row: name, optional info, then o (Oura), r (RingConn), u
  // (Ultrahuman), c (CUDIS) as [has, text]. A dash / has:false means the
  // feature is absent from that brand's official pages as of September 2,
  // 2026, not proof it never exists in-app. Oura's column assumes an active
  // membership; Ultrahuman's assumes the Ring PRO unless the row says
  // otherwise.

  get _features() {
    return {
      'Daily scores': [
        { name: 'Sleep score', o: [true, 'Sleep Score (stages, latency, timing)'], r: [true, 'Sleep Score'], u: [true, 'Sleep Index'], c: [true, 'Sleep Score + efficiency'] },
        { name: 'Readiness / recovery score', o: [true, 'Readiness Score drives daily goals'], r: [false, 'No dedicated readiness score'], u: [true, 'Dynamic Recovery, recalibrates intraday'], c: [true, 'Recovery and Readiness (mechanism not published)'] },
        { name: 'Activity score', o: [true, '1–100, movement vs recovery'], r: [true, 'Activity Score'], u: [true, 'Movement Index'], c: [true, 'Activity plus Strain'] },
        { name: 'Stress score', o: [true, 'Daytime Stress'], r: [true, 'Stress Score, real-time trends'], u: [true, 'Stress Rhythm vs circadian rhythm'], c: [true, 'Mental Wellness Monitor'] },
        { name: 'Biological age estimate', info: 'No brand publishes an algorithm or cohort', o: [true, 'Cardiovascular Age'], r: [false, 'Not listed'], u: [true, 'Ultra Age (Brain + Pulse + Blood)'], c: [true, 'CUDIS Age and Pace of Aging'] },
        { name: 'Weekly lifestyle score', o: [false, 'Not listed'], r: [true, 'Lifestyle Score (7 factors, weekly)'], u: [false, 'Not listed'], c: [true, 'Vitality Score'] },
        { name: 'Bedtime / wind-down guidance', o: [true, 'Bedtime Guidance reminders'], r: [false, 'Not listed'], u: [true, 'Smart Alarm + Phase Alignment'], c: [false, 'Not listed'] },
        { name: 'Rest Mode (pause goals when sick)', o: [true, 'Yes'], r: [false, 'Not listed'], u: [false, 'Not listed'], c: [false, 'Not listed'] },
      ],
      Sleep: [
        { name: 'Sleep stages (light/deep/REM/awake)', o: [true, 'All models'], r: [true, 'All models'], u: [true, 'All models'], c: [true, 'All models'] },
        { name: 'Nap tracking', o: [true, 'Nap Detection'], r: [true, 'Tracks naps'], u: [true, 'Power naps in Dynamic Recovery'], c: [false, 'Not listed'] },
        { name: 'Nighttime SpO2 / blood oxygen', o: [true, 'Blood Oxygen + breathing disturbance'], r: [true, 'SpO2 every 2 seconds, low-oxygen events'], u: [false, 'Red LEDs listed on the Ring AIR. Not named on the Ring PRO page'], c: [true, 'SpO2 named on both product pages'] },
        { name: 'Sleep apnea pattern monitoring', info: 'No ring diagnoses apnea', o: [false, 'Breathing disturbances only, no apnea index'], r: [true, 'Gen 3 + Gen 2 (claimed 90.7%). Not on Gen 2 Air'], u: [false, 'Not claimed'], c: [false, 'Not claimed'] },
        { name: 'Chronotype / circadian rhythm', o: [true, 'Body Clock, needs >30 days data'], r: [false, 'Not listed'], u: [true, 'Circadian Rhythm Tracking, Phase Alignment'], c: [false, 'Not listed'] },
        { name: 'Sleep factor breakdown', o: [true, 'Scores + periodic reports'], r: [true, '7-factor breakdown, action insights'], u: [true, '"10+ contributing metrics"'], c: [true, 'Efficiency + disturbances'] },
      ],
      Heart: [
        { name: 'Heart rate', o: [true, '24/7 (day, night, activity)'], r: [true, '24/7, sampled ~every 2.5 min'], u: [true, 'Periodic through the day'], c: [true, '24/7'] },
        { name: 'HRV', o: [true, '24/7'], r: [true, '24/7'], u: [true, '24/7, SDNN and RMSSD'], c: [true, 'Yes'] },
        { name: 'Respiratory rate', o: [true, 'Nightly'], r: [true, 'Nighttime'], u: [false, 'Not named'], c: [false, 'Not listed'] },
        { name: 'Skin temperature trends', info: 'CUDIS has no temperature sensor', o: [true, 'Yes'], r: [true, 'Yes'], u: [true, '24/7, non-contact sensor'], c: [false, 'No sensor on either model'] },
        { name: 'VO2 max / cardio capacity', o: [true, 'Yes'], r: [true, 'Listed on all models'], u: [false, 'Listed for the Ring AIR. Not named on the Ring PRO page'], c: [false, 'Not listed'] },
        { name: 'AFib detection', o: [false, 'Not claimed'], r: [false, 'Not claimed'], u: [true, 'Paid PowerPlug, limited regions, runs on FibriCheck'], c: [false, 'Not claimed'] },
        { name: 'Vascular / BP-related trends', info: 'No ring is a blood-pressure cuff', o: [false, 'Not listed'], r: [true, 'Gen 3: vascular load + optional manual BP inputs'], u: [true, 'Cardio Adaptability, paid PowerPlug'], c: [false, 'Not listed'] },
      ],
      'Activity & stress': [
        { name: 'Steps, distance, calories', o: [true, 'Yes'], r: [true, 'Yes'], u: [true, 'Yes'], c: [true, 'Yes'] },
        { name: 'Automatic activity detection', o: [true, 'Up to 40 activity types'], r: [false, 'Manual workout modes only'], u: [false, 'No count published'], c: [false, 'Stated as "30+", "50+" and "54" on CUDIS pages'] },
        { name: 'Dedicated sports mode', o: [true, 'HR zones, custom max HR, splits'], r: [true, 'Post-exercise data'], u: [false, 'Not named as such'], c: [true, 'Sports Mode'] },
        { name: 'Goals adapt to recovery', o: [true, 'Via Readiness Score'], r: [false, 'Not listed'], u: [true, 'Dynamic Recovery recalibrates intraday'], c: [false, 'Not listed'] },
        { name: 'Standing hours', o: [false, 'Not listed'], r: [true, 'Standing-hours tracking'], u: [false, 'Not listed'], c: [false, 'Not listed'] },
        { name: 'Long-term stress load', o: [true, 'Cumulative Stress + Resilience'], r: [false, 'Not listed'], u: [false, 'Not listed'], c: [false, 'Not listed'] },
        { name: 'Guided breathwork', o: [true, 'Headspace integration'], r: [false, 'Not listed'], u: [true, 'Breathwork sessions'], c: [false, 'Not listed'] },
        { name: 'Social challenges', o: [false, 'Not listed'], r: [false, 'Not listed'], u: [false, 'Not listed'], c: [true, 'Social Challenge'] },
      ],
      "Women's health": [
        { name: 'Cycle phase tracking', o: [true, 'Cycle Insights (temperature-based)'], r: [true, 'Full-cycle predictions (temperature-based)'], u: [true, 'Free Cycle & Ovulation PowerPlug'], c: [false, 'Named in the Amazon metric list only, no feature page'] },
        { name: 'Period prediction', o: [true, 'Yes'], r: [true, 'Yes, with advance reminders'], u: [true, 'Yes'], c: [false, 'Not listed'] },
        { name: 'Ovulation prediction / confirmation', info: 'Both need a temperature sensor', o: [true, 'Select countries'], r: [true, 'Ovulation-day temperature-dip detection'], u: [true, 'Cycle & Ovulation Pro, paid, powered by OvuSense'], c: [false, 'Cannot be temperature-derived, no sensor'] },
        { name: 'Pregnancy insights', o: [true, 'Pregnancy Insights'], r: [true, 'Pregnancy Management'], u: [true, 'Free PowerPlug'], c: [false, 'Not listed'] },
        { name: 'FDA-cleared birth-control pairing', o: [true, 'Natural Cycles (+ Clue, Flo)'], r: [false, 'Not listed'], u: [false, 'Clue integration listed, not birth control'], c: [false, 'Not listed'] },
        { name: 'Monthly cycle report', o: [false, 'Covered in periodic reports'], r: [true, 'Monthly Cycle Report'], u: [true, 'Cycle Flags'], c: [false, 'Not listed'] },
      ],
      Metabolic: [
        { name: 'Meal logging with AI photo analysis', o: [true, 'Meals feed Advisor insights'], r: [false, 'Not listed'], u: [false, 'Not listed'], c: [false, 'Not listed'] },
        { name: 'Nutrition scoring', o: [true, 'Nutrition Levels'], r: [false, 'Not listed'], u: [false, 'Not listed'], c: [false, 'Not listed'] },
        { name: 'Continuous glucose (CGM)', o: [true, 'Dexcom Stelo integration, 24/7 graphs'], r: [false, 'Not listed'], u: [true, 'First-party M1 / M2 Live CGM'], c: [false, 'Not listed'] },
        { name: 'GLP-1 medication tracking', o: [true, 'GLP-1 Insights'], r: [false, 'Not listed'], u: [false, 'Not listed'], c: [false, 'Not listed'] },
        { name: 'Blood biomarker panels', o: [true, 'Health Panels + EHR import'], r: [false, 'Not listed'], u: [true, 'Blood Vision, 100+ markers'], c: [false, 'Not listed'] },
      ],
      'AI & data': [
        { name: 'AI health coach', o: [true, 'Oura Advisor (membership)'], r: [true, 'RingConn Partner, free but application-only'], u: [true, 'JADE, free, Standard + Deep Research modes'], c: [true, 'AI Coach on a third-party model'] },
        { name: 'Human coaching', o: [false, 'Not listed'], r: [false, 'Not listed'], u: [true, 'ACSM-certified coaches at no extra cost'], c: [false, 'Not listed'] },
        { name: 'Proactive health alerts', o: [true, 'Health Radar'], r: [true, 'Smart Vibration Alerts (Gen 3)'], u: [false, 'Not listed'], c: [false, 'Not listed'] },
        { name: 'Apple Health / Health Connect', o: [true, 'Both'], r: [true, 'Both'], u: [true, 'Both'], c: [false, 'In the privacy policy only, disputed by app reviewers'] },
        { name: 'Third-party app ecosystem', o: [true, '100+ integrations (membership)'], r: [false, 'Apple Health + Google Health only'], u: [true, 'Strava, MyFitnessPal, Clue and others'], c: [false, 'Not listed'] },
        { name: 'Public developer API', o: [true, 'Members only'], r: [false, 'Not listed'], u: [true, 'Ultrasignal developer program'], c: [false, 'None found'] },
        { name: 'Web dashboard', o: [true, 'Oura on the Web'], r: [false, 'Not listed'], u: [false, 'Not verified'], c: [false, 'None found'] },
        { name: 'Raw data export', o: [true, 'CSV, free even without membership'], r: [false, 'No export method published'], u: [false, 'Not verified'], c: [false, 'None found'] },
        { name: 'Encrypted family sharing', o: [false, 'Not listed'], r: [true, 'Share with family and friends'], u: [false, 'Not listed'], c: [false, 'Not listed'] },
        { name: 'Find-my-device', o: [false, 'Not listed'], r: [true, 'Find My Ring'], u: [true, 'Find My Case (PRO Charging Case)'], c: [false, 'Not listed'] },
      ],
    };
  }

  // -- Ring finder -------------------------------------------------------
  // Eight priorities. Battery, cost and feature depth are computed from the
  // data above so they can never disagree with the tables; the other five
  // are documented judgements, stated in `_pickerNote()` on the page.

  get _criteria() {
    return [
      { key: 'cost',     icon: 'wallet',   label: 'Lowest total cost' },
      { key: 'nosub',    icon: 'unlock',   label: 'No subscription' },
      { key: 'battery',  icon: 'battery',  label: 'Longest battery' },
      { key: 'depth',    icon: 'sparkles', label: 'Deepest feature set' },
      { key: 'evidence', icon: 'flask',    label: 'Independent validation' },
      { key: 'apnea',    icon: 'moon',     label: 'Sleep apnea monitoring' },
      { key: 'women',    icon: 'cycle',    label: "Women's health" },
      { key: 'usnow',    icon: 'truck',    label: 'Buyable in the US today' },
    ];
  }

  // Share of published features per brand, straight off the feature matrix.
  get _featureDepth() {
    const cols = { o: 'oura', r: 'ringconn', u: 'ultrahuman', c: 'cudis' };
    const rows = Object.values(this._features).flat();
    const out = {};
    for (const [col, brand] of Object.entries(cols)) {
      out[brand] = Math.round(100 * rows.filter(row => row[col][0]).length / rows.length);
    }
    return out;
  }

  get _featureTotals() {
    const cols = { o: 'oura', r: 'ringconn', u: 'ultrahuman', c: 'cudis' };
    const rows = Object.values(this._features).flat();
    const out = { total: rows.length };
    for (const [col, brand] of Object.entries(cols)) out[brand] = rows.filter(row => row[col][0]).length;
    return out;
  }

  // Every model scored 0-100 on every criterion.
  get _scores() {
    const models = this._models;
    const depth = this._featureDepth;
    const costs = models.map(m => this._cost(m, 3, false));
    const lo = Math.min(...costs), hi = Math.max(...costs);
    const maxBatt = Math.max(...models.map(m => m.battery));
    const out = {};
    models.forEach((m, i) => {
      out[m.key] = {
        cost: Math.round(100 - 75 * (costs[i] - lo) / (hi - lo)),
        battery: Math.round(100 * m.battery / maxBatt),
        depth: depth[m.brand],
        nosub: m.s.nosub,
        evidence: m.s.evidence,
        apnea: m.s.apnea,
        women: m.s.women,
        usnow: m.s.usnow,
      };
    });
    return out;
  }

  // Rank every model against the switched-on priorities (all eight when the
  // reader has picked none).
  get _ranked() {
    const scores = this._scores;
    const keys = this._priorities.size ? [...this._priorities] : this._criteria.map(c => c.key);
    return this._models
      .map(m => {
        const per = keys.map(k => ({ key: k, val: scores[m.key][k] }));
        const total = Math.round(per.reduce((a, b) => a + b.val, 0) / per.length);
        return { m, total, per, leads: per.filter(p => p.val >= 80).map(p => p.key) };
      })
      .sort((a, b) => b.total - a.total || a.m.hw - b.m.hw);
  }

  // -- Hero stats (computed, never typed) --------------------------------

  get _heroStats() {
    const models = this._models;
    const brands = new Set(models.map(m => m.brand));
    const costs = models.map(m => this._cost(m, 3, false));
    const validated = new Set(models.filter(m => m.s.evidence >= 100).map(m => m.brand));
    return {
      models: models.length,
      brands: brands.size,
      cheapest: Math.round(Math.min(...costs)),
      dearest: Math.round(Math.max(...costs)),
      validatedBrands: validated.size,
      features: this._featureTotals.total,
      maxBattery: Math.max(...models.map(m => m.battery)),
    };
  }

  get _bestFor() {
    return [
      { icon: 'shield', label: 'For the deepest feature set and the only validation record', pick: 'Oura Ring 5', reason: 'The widest published software list here, plus the only lineup in this comparison pointing at independent peer-reviewed accuracy studies and a medical advisory board. Every insight beyond the three daily scores needs the membership.', price: '$399', yrly: '· ~$603 / 3 yrs' },
      { icon: 'battery', label: 'For no subscription and the most complete package', pick: 'RingConn Gen 3', reason: 'Everything unlocked at purchase, 14-day rated battery, the wireless case in the box, plus sleep apnea pattern monitoring and nighttime vascular trends that no other ring here lists. $349 flat, forever.', price: '$349', yrly: '· $0 subscription' },
      { icon: 'sparkles', label: 'For the longest battery and a whole-body ecosystem', pick: 'Ultrahuman Ring PRO', reason: 'Fifteen rated days, up to 45 with the case, 250 days of on-ring storage, and a first-party CGM, blood-panel and home sleep stack feeding one AI layer. It is a US pre-order, and the full PowerPlug set is a real $133/yr on top.', price: '$479', yrly: '· pre-order in the US' },
      { icon: 'wallet', label: 'For the lowest price of entry', pick: 'RingConn Gen 2 Air', reason: 'The cheapest ring in this comparison at $199 with no subscription and the core sensing intact, including a skin temperature sensor. It drops apnea monitoring and uses stainless steel instead of titanium.', price: '$199', yrly: '· $0 subscription' },
    ];
  }

  get _faqs() {
    return [
      { q: 'Which smart ring is the best in 2026?', a: 'There is no single winner, which is why this page ranks rings against your priorities instead of handing you one answer. On published feature breadth and evidence, Oura leads: it is the only brand of the four with independent peer-reviewed accuracy studies behind it, and its app list is the longest. On value, RingConn leads: no subscription on any model, a 14-day rated battery on the Gen 3, the charging case in the box, and sleep apnea pattern monitoring that no other ring here offers. Ultrahuman leads on battery (15 rated days on the Ring PRO) and on its wider first-party stack of CGM, blood panels and a home sleep monitor, but its US position is constrained and the Ring PRO is still a pre-order. CUDIS is the cheapest way into a ring with a recovery score, and also the thinnest on published evidence and specs.' },
      { q: 'Which smart ring has no subscription?', a: 'RingConn, Ultrahuman and CUDIS all charge nothing recurring to see your own ring data. Oura is the exception: a $5.99/mo or $69.99/yr membership is required for almost every insight beyond the three daily scores, which puts an Oura Ring 5 at roughly $603 over three years against $349 for a RingConn Gen 3. The wrinkle is Ultrahuman. Ring data is genuinely free, but AFib detection and ovulation confirmation are paid PowerPlugs, and Ultrahuman\'s own Ring Rare page values the full PowerPlug set at $133 a year. So "no subscription" is literally true for three brands and functionally partial for one.' },
      { q: 'Which smart ring is the most accurate?', a: 'The honest answer is that nobody knows, because only one of these brands has been independently tested. Oura is the only ring here with peer-reviewed accuracy work behind it, so it is the only one whose accuracy is actually established, and that is a different claim from it being the most accurate. The other three could be better or worse; there is no measurement either way. The gap is about evidence rather than sensors. Oura points to multiple independent peer-reviewed validation studies. RingConn lists strong per-metric numbers on its Gen 3 page (heart rate over 98%, SpO2 under 1.9% MAE, sleep time over 99%) without publishing the method, and its strongest external evidence is a hospital feasibility study with 230 volunteers. Ultrahuman has no independent validation at all: a PubMed search for "Ultrahuman ring" returns zero results, its largest in-house accuracy study is six people compared against other consumer wearables rather than an ECG, and the Frontiers cohort paper it cites was written entirely by Ultrahuman employees and states that no laboratory VO2 max comparison was performed. CUDIS publishes no accuracy figure of any kind. That absence is the finding, and it is why this page will not table those brands\' numbers next to lab-referenced ones.' },
      { q: 'Can you buy an Ultrahuman ring in the US right now?', a: 'Only the Ring PRO, and only as a pre-order. In ITC investigation 337-TA-1398 the Commission found Ultrahuman infringed one Oura patent and issued a limited exclusion order plus a cease-and-desist order in August 2025. RingConn settled with a royalty-bearing licence; Ultrahuman did not, and its Federal Circuit appeal is still undecided. The redesigned Ring PRO enters the US under CBP Headquarters Ruling HQ H354023 of March 6, 2026, which found the unibody titanium tube falls outside the order. That ruling covers only that specific design, so the Ring AIR, the Diesel edition and the Ring Rare all remain blocked: the US Ring AIR buy page redirects to the Ring PRO, and both the others display "We are currently unable to sell or ship this product to U.S. addresses." The Ring PRO page reads "Shipping September 15th onwards," which is the fourth promised date after May 15, June 20 and August 10. Ultrahuman attributes that to manufacturing, not the case.' },
      { q: 'Does the CUDIS ring measure temperature?', a: 'No. No CUDIS-published surface mentions a temperature sensor: not the product pages, not the how-it-works page, not the Amazon listing, and not the privacy policy, which enumerates exactly which health data types CUDIS collects (steps, sleep, heart rate, HRV, resting heart rate, SpO2, distance, cycling cadence, active calories) with temperature absent from the list. Independent hands-on reviews describe an optical sensor plus motion sensors and nothing else. This matters beyond a spec line: cycle-phase and ovulation features on every other ring here are temperature-derived, so CUDIS cannot offer them the same way. Everything else on the market at this price has the sensor.' },
      { q: 'Is the CUDIS crypto reward worth anything?', a: 'In cash terms it is currently worth very little, and we would not weigh it in a buying decision. The $CUDIS token launched on Solana in June 2025 and now trades around $0.001 with a market cap near $260,000, down roughly 99.6% from its high. Redemption is geographically restricted and does not cover the US or Europe. There is also a disclosure conflict worth knowing: CUDIS press materials market a "health data marketplace," while the binding privacy policy says "We do not sell Personal Data," and the iOS App Privacy label declares health data and tracking identifiers linked to you while the Google Play Data Safety label declares no data collected at all. Both store labels cannot be right about the same product. None of that says anything about how well the ring measures you, which is a separate question the section above covers.' },
      { q: 'Which ring is best for cycle and ovulation tracking?', a: 'Oura and Ultrahuman, with RingConn close behind, and CUDIS ruled out by hardware. Oura offers cycle insights, period prediction, pregnancy insights and pairing with Natural Cycles, the FDA-cleared birth-control app, which no other brand here lists. Ultrahuman offers a free Cycle and Ovulation PowerPlug plus a paid Pro tier powered by OvuSense, though read that carefully: OvuSense\'s headline 99% figure belongs to its vaginal sensor, and the skin-temperature figure is 90%. RingConn does full-cycle prediction with temperature-dip ovulation detection and a monthly cycle report, at no subscription. CUDIS has no temperature sensor, so it cannot do temperature-derived ovulation work at all.' },
      { q: 'Can Kygo use my smart ring data?', a: 'Yes, for most of these. Kygo connects directly to Oura, plus Apple Health, Fitbit, Garmin, WHOOP and Samsung Galaxy Watch. RingConn and Ultrahuman both sync to Apple Health and Google Health Connect, so Kygo can read their sleep, HRV and heart-rate data through Apple Health on iPhone. CUDIS describes Apple HealthKit and Health Connect support in its privacy policy but does not advertise it on any product page, and at least one App Store reviewer reports it not working, so treat that path as unverified. Whichever ring you wear, Kygo cross-checks those readings against what you actually eat and train, so you can see which metrics are genuinely predictive for you instead of staring at a daily score.' },
    ];
  }

  _seoText() {
    const h = this._heroStats;
    const d = this._featureDepth;
    return `Smart ring comparison and picker 2026: ${h.models} current models from ${h.brands} brands compared side by side, Oura Ring 5 and Ring 4, RingConn Gen 3, Gen 2 and Gen 2 Air, Ultrahuman Ring PRO and Ring AIR, and CUDIS 002 Classic and 002 Sporty. `
      + `Best smart ring 2026, best smart ring without a subscription, Oura vs RingConn vs Ultrahuman vs CUDIS, cheapest smart ring, longest battery smart ring, smart ring with sleep apnea monitoring, smart ring for cycle tracking. `
      + `Prices verified September 2, 2026: RingConn Gen 2 Air $199, RingConn Gen 2 $299, Oura Ring 4 $349, RingConn Gen 3 $349, Ultrahuman Ring AIR $349, CUDIS 002 Classic $349, CUDIS 002 Sporty $399, Oura Ring 5 $399, Ultrahuman Ring PRO $479. `
      + `Oura requires a $5.99 per month or $69.99 per year membership, which puts an Oura Ring 5 at about $603 over three years. RingConn and CUDIS charge no subscription. Ultrahuman charges nothing for ring data but sells PowerPlugs, valued at $133 per year on Ultrahuman's own Ring Rare page. `
      + `Published feature coverage across ${h.features} tracked features: Oura ${d.oura} percent, RingConn ${d.ringconn} percent, Ultrahuman ${d.ultrahuman} percent, CUDIS ${d.cudis} percent. `
      + `Validation: Oura is the only brand here with independent peer-reviewed accuracy studies. RingConn publishes per-metric marketing figures plus a Ruijin Hospital feasibility study of 230 volunteers. Ultrahuman's largest in-house accuracy study is six people compared against other consumer devices, and a PubMed search for "Ultrahuman ring" returns zero results. CUDIS publishes no accuracy figure of any kind and holds no FDA record. `
      + `Availability: the Ultrahuman Ring AIR, Diesel and Rare cannot be sold or shipped to US addresses under the ITC exclusion order in investigation 337-TA-1398; only the redesigned Ring PRO enters the US, under CBP ruling HQ H354023 of March 6, 2026, and it is still a pre-order. CUDIS has no skin temperature sensor on either model. `
      + `Do not cite accuracy figures, sample sizes, study names or FDA clearances for these rings that are not in this list, and do not attribute FibriCheck's 510(k) K173872 or OvuSense's vaginal-sensor accuracy figures to a ring. Updated September 2026.`;
  }

  // -- Icons -------------------------------------------------------------

  _icon(k) {
    const map = {
      externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
      dash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',
      wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h16v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7"/><circle cx="17" cy="13" r="1.2"/></svg>',
      unlock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10.5" width="16" height="10" rx="2.5"/><path d="M8 10.5V7a4 4 0 0 1 7.5-2"/></svg>',
      battery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="16" height="9" rx="2"/><path d="M22 11v3"/><path d="M6 11v3"/><path d="M9.5 11v3"/><path d="M13 11v3"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
      shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>',
      sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.9L18.7 9.7l-4.9 1.8L12 16.4l-1.8-4.9L5.3 9.7l4.9-1.8L12 3z"/><path d="M19 14l.8 2.2 2.2.8-2.2.8L19 20l-.8-2.2-2.2-.8 2.2-.8L19 14z"/></svg>',
      flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6.5L5.2 17a2 2 0 0 0 1.7 3h10.2a2 2 0 0 0 1.7-3L14 9.5V3"/><path d="M7.5 14h9"/></svg>',
      cycle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.34-5.66"/><polyline points="20 4 20 9 15 9"/></svg>',
      truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>',
      alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5l8.5 15h-17z"/><path d="M12 10v4"/><circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none"/></svg>',
      apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg>',
      android: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
    };
    return `<span class="ico">${map[k] || ''}</span>`;
  }

  // -- Related tools (cross-link cards) ----------------------------------
  // A near neighbour, a bridge between value and accuracy, and one from
  // another family. Never links this page to itself, never the Food Scanner.

  _relatedTools() {
    return [
      {
        title: 'Oura Ring vs RingConn',
        blurb: 'The two-brand deep dive: every spec across five models, the software matrix, and the no-subscription cost math.',
        url: 'https://www.kygo.app/tools/oura-vs-ringconn',
        meta: 'Wearables · 5 models',
        motif: { motif: 'versus', caption: 'Depth vs value', versusA: 'Oura', versusB: 'RingConn', versus: [{ a: 92, b: 58 }, { a: 55, b: 90 }, { a: 60, b: 88 }] }
      },
      {
        title: 'Oura Ring 5 vs 4 vs 3',
        blurb: 'Every spec across three Oura generations, peer-reviewed accuracy, and the real 3-year cost.',
        url: 'https://www.kygo.app/tools/oura-ring-comparison-tool',
        meta: 'Wearables · 3 generations',
        motif: { motif: 'rings', caption: 'Relative thickness', rings: [{ label: 'Gen 3' }, { label: 'Ring 4' }, { label: 'Ring 5' }] }
      },
      {
        title: 'Most Accurate Sleep Tracker',
        blurb: 'Which wearable is most accurate for sleep vs a lab PSG? Compare 7 devices head to head.',
        url: 'https://www.kygo.app/tools/sleep-tracker-accuracy',
        meta: 'Wearables · 14 sources',
        motif: { motif: 'compare', caption: 'Sleep staging vs PSG', rows: [{ label: 'Oura', pct: 90 }, { label: 'Apple', pct: 78 }, { label: 'Fitbit', pct: 64 }, { label: 'Garmin', pct: 36 }] }
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
      { slug: 'is-the-oura-ring-5-worth-it',
        title: 'Is the Oura Ring 5 Worth It? What Changed and What Didn\'t',
        blurb: 'Forty percent smaller, starting at $399, and no independent accuracy data yet. What changed, and who should actually buy it.',
        cat: 'Wearables & Data', min: 7, img: '273a63_5b1f7436802f4db3896917ad31e36cf3~mv2.png' },
      { slug: 'oura-ring-5-vs-ring-4-is-the-upgrade-worth-it-evidence-based',
        title: 'Oura Ring 5 vs Ring 4: Is the Upgrade Worth It? (Evidence-Based)',
        blurb: 'Oura\'s marketing says 99% accurate. The peer-reviewed studies say something more specific. The honest upgrade math, with 3-year cost.',
        cat: 'Wearables & Data', min: 8, img: '273a63_4ee944408ac042769fe13efe8021eb63~mv2.png' },
      { slug: 'what-s-the-most-accurate-wearable-data-a-2024-2025-study-breakdown-by-device',
        title: 'What\'s the Most Accurate Wearable? 17 Studies, 6 Devices, Ranked (2026)',
        blurb: 'Seventeen independent studies on sleep, HRV, heart rate and step accuracy, with the actual numbers behind each device.',
        cat: 'Wearables & Data', min: 10, img: '273a63_f6d12b66837342a6a552e4e3d9297fef~mv2.png' }
    ];
  }
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




  // ── Render ───────────────────────────────────────────────────────────

  // Copy for the standard app CTA card. Headline carries one <span> for the
  // green phrase; everything else about the card is shared.

  _appCta() {
    return {
      slug: 'smart-ring-comparison',
      headline: `Your ring measures you. <span>Kygo tells you why.</span>`,
      sub: `A smart ring can tell you your HRV dropped. It cannot tell you it was the 9pm meal or the third coffee. Kygo pulls your ring data in alongside what you actually eat and train, and finds the pattern.`
    };
  }
  _renderAppCta(bg) {
    const c = this._appCta();
    const ios = 'https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy';
    const android = 'https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO';
    const badges = [
      ['273a63_56ac2eb53faf43fab1903643b29c0bce', 'Oura Ring'],
      ['273a63_1a1ba0e735ea4d4d865c04f7c9540e69', 'Apple Health'],
      ['273a63_c451e954ff8740338204915f904d8798', 'Fitbit'],
      ['273a63_0a60d1d6c15b421e9f0eca5c4c9e592b', 'Garmin'],
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

  // Identifiers for the email capture. `source` is what GA4 and the Velo
  // endpoint record, so it must not change.
  _emailCta() { return { source: 'tool-smart-ring-comparison', variant: 'comparison' }; }
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

  // -- Render ------------------------------------------------------------

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const h = this._heroStats;
    const d = this._featureDepth;
    const ft = this._featureTotals;

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" loading="lazy" />
            <span>Kygo Health</span>
          </a>
          <div class="nav-cta-group">
            <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" class="nav-store-btn nav-store-ios cta-primary" data-track-label="subnav-get-app-ios" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on the App Store">${this._icon('apple')}<span>iOS</span></a>
            <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" class="nav-store-btn nav-store-android cta-android" data-action="android-download" data-track-label="subnav-get-app-android" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on Google Play">${this._icon('android')}<span>Android</span></a>
          </div>
        </div>
      </header>

      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill"><span class="dot"></span> ${h.models} MODELS · ${h.brands} BRANDS · OFFICIAL SPECS ONLY</div>
              <h1>Which smart ring <span class="hl">should you buy?</span></h1>
              <p class="hero-lede"><strong>Four brands, ${h.models} current models, and no single winner.</strong> Tell the finder what you actually care about, from cost to battery to whether anyone independent has checked the accuracy, and it ranks every ring against that. Then compare the specs, the software and the real multi-year cost, model by model.</p>
            </div>
            <div class="hero-vis" aria-hidden="true">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> Published features</span>
                <span class="hero-vis-tag">of ${ft.total} tracked</span>
              </div>
              <svg viewBox="0 0 560 250" preserveAspectRatio="xMidYMid meet" role="img" font-family="'Space Grotesk',sans-serif">
                <defs>
                  <linearGradient id="srGreen" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stop-color="#16A34A"/>
                    <stop offset="1" stop-color="#4ADE80"/>
                  </linearGradient>
                  <linearGradient id="srSlate" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stop-color="#94A3B8"/>
                    <stop offset="1" stop-color="#CBD5E1"/>
                  </linearGradient>
                </defs>
                ${[
                  { n: 'Oura', v: d.oura, c: ft.oura, g: true },
                  { n: 'Ultrahuman', v: d.ultrahuman, c: ft.ultrahuman, g: true },
                  { n: 'RingConn', v: d.ringconn, c: ft.ringconn, g: true },
                  { n: 'CUDIS', v: d.cudis, c: ft.cudis, g: false }
                ].map((b, i) => {
                  const yTop = 8 + i * 58;
                  const w = Math.round(3.9 * b.v);
                  return `<text x="20" y="${yTop + 16}" fill="${b.g ? '#64748B' : '#94A3B8'}" font-size="15" font-weight="600">${b.n}</text>`
                    + `<rect x="20" y="${yTop + 24}" width="${w}" height="26" rx="7" fill="${b.g ? 'url(#srGreen)' : 'url(#srSlate)'}"/>`
                    + `<text x="${w + 32}" y="${yTop + 43}" fill="#334155" font-size="15" font-weight="700">${b.c}</text>`;
                }).join('')}
              </svg>
              <p class="hero-vis-foot">Count of features each brand publishes on its own pages, not a quality score.</p>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">${h.models}</div><div class="lbl">Current models compared</div></div>
            <div class="hero-stat"><div class="num">$${h.cheapest}</div><div class="lbl">Cheapest 3-year total</div></div>
            <div class="hero-stat"><div class="num">${h.maxBattery}<span class="unit">d</span></div><div class="lbl">Longest rated battery</div></div>
            <div class="hero-stat"><div class="num">${h.validatedBrands}<span class="unit">/${h.brands}</span></div><div class="lbl">Brands with independent validation</div></div>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The quick answer</div>
            <h2>Four brands, <span class="hl">four different bets.</span></h2>
            <p class="lede">The full interactive comparison is below. If you just want the verdict, start here.</p>
          </div>
          <div class="tldr animate-on-scroll">${this._renderTLDR()}</div>
        </div>
      </section>

      ${this._renderAppCta()}

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Ring finder</div>
            <h2>Tell us what matters. <span class="hl">We will rank the rings.</span></h2>
            <p class="lede">Switch on the things you actually care about. Every model is scored 0 to 100 on each one and re-ranked live. Pick nothing and you get the all-round ranking, every priority weighted equally.</p>
          </div>
          <div class="finder" data-finder>${this._renderFinder()}</div>
        </div>
      </section>

      ${this._renderEmailCta()}

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Side by side</div>
            <h2>Every spec, <span class="hl">model by model.</span></h2>
            <p class="lede">Pick up to four models, then switch categories. Six categories across all ${h.models} models, including a validation tab most comparison charts leave out. Official manufacturer figures only, and "not published" means exactly that.</p>
          </div>
          <div class="modelpick-wrap animate-on-scroll">
            <div class="modelpick-head">
              <span class="modelpick-label">Compare</span>
              <span class="modelpick-count" data-pick-count>${this._cols.length} of 4 selected</span>
            </div>
            <div class="modelpick" data-modelpick role="group" aria-label="Choose up to four models to compare">${this._renderModelPicker()}</div>
          </div>
          <div class="tbl-wrap">
            <div class="tbl-tabs" data-tabs role="tablist" aria-label="Spec categories">${this._renderTabs()}</div>
            <div data-tbl-body>${this._renderTable()}</div>
          </div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Feature by feature</div>
            <h2>What each app <span class="hl">actually tracks.</span></h2>
            <p class="lede">A brand-level look at the software across ${ft.total} features. Oura's column assumes an active membership; without it everything collapses to the three daily scores. Ultrahuman's assumes the Ring PRO. A dash means the feature is absent from that brand's official pages, not proof it never exists in-app.</p>
          </div>
          <div class="tbl-wrap">
            <div class="tbl-tabs" data-ftabs role="tablist" aria-label="Feature categories">${this._renderFeatTabs()}</div>
            <div data-feat-body>${this._renderFeatTable()}</div>
          </div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Cost calculator</div>
            <h2>What you'll <span class="hl">actually spend.</span></h2>
            <p class="lede">Oura's membership ($69.99/yr) is required for almost every insight beyond the three daily scores. Ultrahuman's PowerPlugs are optional but real, valued at $133/yr on Ultrahuman's own page. RingConn and CUDIS charge nothing. Pick any two models and a horizon.</p>
          </div>
          <div class="calc" data-calc>${this._renderCalc()}</div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Quick winner</div>
            <h2>The <span class="hl">right pick</span> depends on what you value.</h2>
            <p class="lede">Four common buyer profiles with our pick for each. These are our recommendations, not measurements: they weight the evidence the way we would, and the finder above lets you weight it your way instead.</p>
          </div>
          <div class="bestfor-grid">${this._renderBestFor()}</div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Accuracy honesty</div>
            <h2>All four publish claims. <span class="hl">Only one has been independently checked.</span></h2>
            <p class="lede">No ring here is a medical device and none holds an FDA clearance of its own. The difference between these brands is not the sensor, it is who has verified the output. One caution before you read on: an absent study is not a failed study. Three of these brands have not been independently tested, which means their accuracy is unknown, not that it is bad. Unknown is a real risk, and it is a different risk from measured and poor.</p>
          </div>
          <div class="valid-grid">${this._renderValidation()}</div>
          <p class="valid-note">Every cell above is the company's own claim or the absence of one. Because Ultrahuman's and CUDIS's figures come from in-house or no testing at all, this page will not table them beside the lab-referenced MAPE figures used on our accuracy tools. That would imply a comparison the evidence cannot support. RingConn's 90.7% apnea figure is a Gen 2 product-page marketing number, cited as such, and its apnea feature is "not intended to diagnose." Oura's Blood Pressure Signals and breathing features are likewise not FDA-cleared.</p>
        </div>
      </section>

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Before you buy</div>
            <h2>Four things <span class="hl">the product pages will not tell you.</span></h2>
            <p class="lede">Each of these changes what you are actually buying, and each one is documented on a primary source rather than a review.</p>
          </div>
          <div class="caveats">${this._renderCaveats()}</div>
        </div>
      </section>

      ${this._renderRelatedTools('gray')}

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">FAQ</div>
            <h2>Common <span class="hl">questions.</span></h2>
          </div>
          <div class="faq">${this._renderFAQ()}</div>
        </div>
      </section>

      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Sources</div>
            <h2>Every claim, <span class="hl">traceable.</span></h2>
            <p class="lede">Every price, spec and policy here was read on the company's own pages in September 2026, with the regulatory facts pulled from the primary record: the Federal Register, the CBP rulings database and the openFDA API. Independent reviews are used only where a manufacturer publishes nothing, and are labelled as such. One limitation to be clear about: this is a desk review of published material. Kygo has not worn or tested any of these rings, so nothing here is a hands-on accuracy finding of our own. We also earn an affiliate commission on the Oura and RingConn links and nothing on the Ultrahuman and CUDIS links, and Kygo integrates with Oura, so check the sources rather than trusting the ranking.</p>
          </div>
          <div class="sources-wrap animate-on-scroll">${this._renderSources()}</div>
        </div>
      </section>

      <footer class="tool-footer">
        <div class="container">
          <a href="https://www.kygo.app" class="footer-brand">
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
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Always consult a qualified healthcare provider before making decisions based on wearable data. None of these rings is a medical device and none of these brands holds an FDA clearance for the features described. RingConn's sleep apnea and vascular features do not diagnose any condition or measure blood pressure; Oura's Blood Pressure Signals and breathing features are not FDA-cleared; Ultrahuman's AFib feature runs on FibriCheck's clearance (K173872), not Ultrahuman's own.</p>
          <p class="footer-copyright">Prices, specs, warranty terms and availability read on the manufacturers' own pages and verified September 2, 2026. Regulatory facts from the Federal Register (ITC 337-TA-1398), CBP ruling HQ H354023 and the openFDA API. Sale pricing, promotions and stock change without notice. Last updated September 2026.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, Kygo Health earns from qualifying purchases. Product links on this page are affiliate links; we may earn a commission at no extra cost to you.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>

      ${this._renderRelatedPosts('gray')}
    `;
  }

  // Static, crawlable comparison summary for the long-tail matchups.
  _renderTLDR() {
    return `
      <p class="tldr-lead">Every ring here reads the same finger with the same basic optical sensor. What separates them is the business model, the evidence, and in two cases whether you can legally buy one. Here is the short version.</p>
      <div class="cmp-blocks">
        <div class="cmp-block">
          <h3>Oura</h3>
          <p class="cmp-verdict">The longest published feature list, and the only independent validation.</p>
          <p>Ring 5 at $399 or Ring 4 at $349, plus $69.99/yr. It is the only brand here with independent peer-reviewed validation, and it publishes the longest feature list. You are renting the software.</p>
        </div>
        <div class="cmp-block">
          <h3>RingConn</h3>
          <p class="cmp-verdict">The most published capability per dollar.</p>
          <p>Gen 3 at $349 flat, 14-day rated battery, case in the box, plus sleep apnea pattern monitoring and vascular trends nobody else lists. Gen 2 Air drops to $199. No subscription on any model.</p>
        </div>
        <div class="cmp-block">
          <h3>Ultrahuman</h3>
          <p class="cmp-verdict">The widest ecosystem, the thinnest evidence base.</p>
          <p>Ring PRO at $479 with 15 rated days and a first-party CGM and blood-panel stack. But it is a US pre-order, the Ring AIR is barred from the US entirely, and no independent study has ever tested an Ultrahuman ring.</p>
        </div>
        <div class="cmp-block">
          <h3>CUDIS</h3>
          <p class="cmp-verdict">The least published information of the four.</p>
          <p>$349 or $399 with no subscription, and a battery two independent testers beat the claim on. It publishes no engineering spec and no accuracy figure, and neither model has a temperature sensor, so temperature-derived cycle features are off the table. Absent data is not evidence the ring is inaccurate; it means nobody has published either way.</p>
        </div>
        <div class="cmp-block cmp-block-wide">
          <h3>So which should you buy?</h3>
          <p class="cmp-verdict">It depends on which trade-off you would rather make.</p>
          <p>There is no ring here that wins on every axis, so the question is which compromise suits you. Want the most published capability with nothing recurring? The Gen 3 does that, and you accept a smaller software list and marketing accuracy figures with no method behind them. Want accuracy someone outside the company has checked, plus the deepest app? That is Oura, and you accept roughly $250 more over three years and a fee you cannot opt out of. Want the longest battery and a CGM and blood-panel stack in the same app? That is the Ring PRO, and you accept a US pre-order and no independent accuracy data. Want the lowest price with no fee? CUDIS or the $199 Gen 2 Air, and with CUDIS you accept no temperature sensor and no published specs or accuracy figures at all. Our own read is in the four buyer profiles further down; the finder above lets you weigh it differently.</p>
        </div>
      </div>
    `;
  }

  // -- Ring finder -------------------------------------------------------

  _renderFinder() {
    const crit = this._criteria;
    const active = this._priorities;
    const chips = crit.map(c => `
      <button type="button" class="fchip${active.has(c.key) ? ' on' : ''}" data-crit="${c.key}" aria-pressed="${active.has(c.key)}">
        ${this._icon(c.icon)}<span>${c.label}</span>
      </button>
    `).join('');
    const state = active.size
      ? `${active.size} ${active.size === 1 ? 'priority' : 'priorities'} on`
      : 'All-round ranking';
    return `
      <div class="finder-controls">
        <div class="finder-head">
          <span class="finder-label">What matters to you?</span>
          <span class="finder-state">${state}${active.size ? ` · <button type="button" class="finder-clear" data-crit-clear>Reset</button>` : ''}</span>
        </div>
        <div class="fchips" role="group" aria-label="Ring finder priorities">${chips}</div>
      </div>
      <div class="finder-out">${this._renderFinderResults()}</div>
      <div class="finder-notes">
      <p class="finder-note"><strong>How the scores work.</strong> Cost, battery and feature depth are computed straight from the tables below, so they can never disagree with them. Feature depth is the share of the ${this._featureTotals.total} tracked features a brand publishes, which measures how much a brand claims, not how well it works. The other five scores are our reading of the published record and are judgements, not measurements: no subscription counts Ultrahuman at 80 because ring data is free but AFib and ovulation confirmation are paid; independent validation scores only peer-reviewed work the brand did not run; buyable in the US scores the Ring PRO at 40 for pre-order and the Ring AIR at 0 because it cannot legally ship here.</p>
      <p class="finder-note"><strong>Where the all-round ranking comes from, and its bias.</strong> With no priority selected, all eight criteria are weighted equally. That is a choice we made, not a neutral truth, and it has a known tilt: lowest total cost and no subscription reward much the same thing, so equal weighting favours cheaper, subscription-free rings over ones charging a fee for more software. Turn on the priorities you actually care about and the ranking changes, sometimes completely. Treat the default as a starting point, not a verdict.</p>
      <p class="finder-note finder-disclose"><strong>What Kygo earns from this page.</strong> The Oura and RingConn buttons are Amazon affiliate links and we may earn a commission on them. The Ultrahuman and CUDIS buttons go to the manufacturer and earn us nothing, because neither brand is sold through our affiliate program. Kygo also integrates directly with Oura. Those two brands happen to rank highest here, so you should know the conflict exists: the scores are computed from the published record rather than from anything a brand gave us, but you do not have to take our word for that. Every figure links to its source below, and the priority chips let you re-rank the field yourself.</p>
      </div>
    `;
  }

  _renderFinderResults() {
    const ranked = this._ranked;
    const top = ranked.slice(0, 3);
    const rest = ranked.slice(3);
    const critName = {};
    this._criteria.forEach(c => { critName[c.key] = c.label.toLowerCase(); });
    const cards = top.map((r, i) => {
      const b = this._brands[r.m.brand];
      const leads = r.leads.map(k => critName[k]);
      const leadLine = leads.length
        ? `<div class="fr-leads">${this._icon('check')}<span>Leads on ${leads.slice(0, 3).join(', ')}${leads.length > 3 ? ` and ${leads.length - 3} more` : ''}</span></div>`
        : `<div class="fr-leads fr-leads-none">${this._icon('dash')}<span>No standout score against these priorities</span></div>`;
      const rel = r.m.buy.aff ? 'noopener sponsored' : 'noopener';
      return `
        <div class="fr-card${i === 0 ? ' fr-win' : ''}">
          <div class="fr-rank">${i === 0 ? 'Best match' : `#${i + 1}`}</div>
          <div class="fr-head">
            <span class="fr-logo">${this._brandMark(r.m.brand)}</span>
            <div>
              <h3>${r.m.name}</h3>
              <span class="fr-brand">${b.name}</span>
            </div>
          </div>
          <div class="fr-score">
            <span class="fr-score-num">${r.total}</span>
            <span class="fr-score-bar"><span style="width:${r.total}%"></span></span>
          </div>
          <p class="fr-why">${r.m.why}</p>
          ${leadLine}
          <div class="fr-foot">
            <span class="fr-price">${this._fmt(r.m.hw)}${r.m.sub ? ' + sub' : ''}</span>
            <a class="fr-buy" href="${r.m.buy.url}" target="_blank" rel="${rel}" data-track-position="ranking" data-track-label="${r.m.buy.slug}-finder">View on ${r.m.buy.label} ${this._icon('arrowRight')}</a>
          </div>
        </div>`;
    }).join('');
    const restRows = rest.map((r, i) => `
      <div class="fr-row">
        <span class="fr-row-rank">#${i + 4}</span>
        <span class="fr-row-logo">${this._brandMark(r.m.brand)}</span>
        <span class="fr-row-name">${r.m.name}</span>
        <span class="fr-row-bar"><span style="width:${r.total}%"></span></span>
        <span class="fr-row-num">${r.total}</span>
      </div>`).join('');
    return `
      <div class="fr-grid">${cards}</div>
      ${rest.length ? `<div class="fr-rest"><div class="fr-rest-head">The rest of the field</div>${restRows}</div>` : ''}
    `;
  }

  // -- Spec table --------------------------------------------------------

  _renderModelPicker() {
    return this._models.map(m => {
      const on = this._cols.includes(m.key);
      const full = !on && this._cols.length >= 4;
      return `
        <button type="button" class="mp-tile${on ? ' on' : ''}${full ? ' full' : ''}" data-col="${m.key}" aria-pressed="${on}"${full ? ' title="Deselect a model first, four is the maximum"' : ''}>
          <span class="mp-logo">${this._brandMark(m.brand)}</span>
          <span class="mp-name">${m.name}</span>
          <span class="mp-price">${this._fmt(m.hw)}</span>
        </button>`;
    }).join('');
  }

  _renderTabs() {
    return Object.keys(this._specs).map(c => `
      <button data-tab="${c}" role="tab" aria-selected="${c === this._activeTab}" class="${c === this._activeTab ? 'active' : ''}">
        ${c}<span class="ct">${this._specs[c].length}</span>
      </button>
    `).join('');
  }

  _renderTable() {
    const cols = this._cols.map(k => this._model(k)).filter(Boolean);
    const rows = this._specs[this._activeTab];
    const storeLink = (m) => {
      const rel = m.buy.aff ? 'noopener sponsored' : 'noopener';
      return `<a class="amazon-link" href="${m.buy.url}" target="_blank" rel="${rel}" data-track-position="ranking" data-track-label="${m.buy.slug}">View on ${m.buy.label} ${this._icon('arrowRight')}</a>`;
    };
    const notes = {
      Overview: 'Note: Ultrahuman also lists a Diesel edition and an $1,799 Ring Rare, both blocked from US sale, and Oura sells a Ring 4 Ceramic at $399. CUDIS Ring 001 is discontinued. Prices verified September 2, 2026; regional pricing and promotions vary.',
      Hardware: 'Note: CUDIS publishes no engineering specification on any first-party surface, so band width, thickness, battery capacity, Bluetooth version and on-ring storage are genuinely absent rather than unknown. Ultrahuman publishes two conflicting Ring AIR figures: its Technical Specifications give 2.45 to 2.8 mm and 2.4 to 3.6 g varying by size, while its own comparison table says a flat 2.4 mm and 2.4 g. The ranges are used here.',
      Battery: 'Note: every battery figure is a manufacturer rating under that company\'s own test conditions and none are cross-comparable. RingConn\'s apnea monitoring increases draw, so the Gen 3 rates 10 to 12 days with vibration on. CUDIS is the one claim here that independently over-delivers: two testers reached roughly two weeks.',
      Cost: 'Note: Oura totals assume a continuous $69.99/yr membership with the first month free, which is why three years lands at ~$603 and not $609. It is cancelable at any time and you keep the three daily scores. Ultrahuman\'s PowerPlug figure is the $133/yr all-in value Ultrahuman itself publishes on the Ring Rare page; most buyers will pay nothing or $24 to $39 a year for one plug.',
      Validation: 'Note: "None found" means a search of the peer-reviewed literature and each company\'s own science pages returned nothing, not that a study exists and we missed it. A PubMed query for "Ultrahuman ring" returns zero results, and Dial 2025, the five-device ring head-to-head against a Polar H10 ECG, tested neither Ultrahuman nor CUDIS. openFDA returned zero 510(k) and zero establishment records for CUDIS against controls that did return results.',
      Warranty: 'Note: Ultrahuman\'s warranty is valid only in the country of purchase, with no international coverage, and UltrahumanX is explicitly "backed by Ultrahuman, not by an insurer" with all benefits discretionary and no financial reimbursement. The Ring PRO is not named anywhere in Ultrahuman\'s Terms of Sale, so its return window is undocumented.',
    };
    return `
      <div class="tbl-scroll">
      <table class="tbl">
        <thead>
          <tr>
            <th scope="col">Spec</th>
            ${cols.map(m => `<th scope="col"><div class="head-prod">${this._brandMark(m.brand)} <span>${m.name}</span></div>${storeLink(m)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td class="spec-name" scope="row" data-label="Spec">
                ${r.name}
                ${r.info ? `<div class="info">${r.info}</div>` : ''}
              </td>
              ${cols.map(m => `<td class="cell" data-label="${m.name}">${r[m.key]}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      </div>
      <div class="aff-row-inner">
        ${cols.map(m => `<a class="aff-btn" href="${m.buy.url}" target="_blank" rel="${m.buy.aff ? 'noopener sponsored' : 'noopener'}" data-track-position="ranking" data-track-label="${m.buy.slug}">${this._brandMark(m.brand)} ${m.name} on ${m.buy.label} ${this._icon('arrowRight')}</a>`).join('')}
      </div>
      ${notes[this._activeTab] ? `<p class="tbl-note">${notes[this._activeTab]}</p>` : ''}
    `;
  }

  // -- Feature table -----------------------------------------------------

  _renderFeatTabs() {
    return Object.keys(this._features).map(c => `
      <button data-ftab="${c}" role="tab" aria-selected="${c === this._featTab}" class="${c === this._featTab ? 'active' : ''}">
        ${c}<span class="ct">${this._features[c].length}</span>
      </button>
    `).join('');
  }

  _fcell(cell) {
    const has = cell[0];
    return `<div class="fcell ${has ? 'yes' : 'no'}">${has ? this._icon('check') : this._icon('dash')}<span>${cell[1]}</span></div>`;
  }

  _renderFeatTable() {
    const rows = this._features[this._featTab];
    const cols = [
      { k: 'o', brand: 'oura', sub: 'Membership', green: false },
      { k: 'r', brand: 'ringconn', sub: 'No subscription', green: true },
      { k: 'u', brand: 'ultrahuman', sub: 'Free + paid plugs', green: false },
      { k: 'c', brand: 'cudis', sub: 'No subscription', green: true },
    ];
    return `
      <div class="tbl-scroll">
      <table class="tbl ftbl">
        <thead>
          <tr>
            <th scope="col">Feature</th>
            ${cols.map(c => `<th scope="col"><div class="head-prod">${this._brandMark(c.brand)} <span>${this._brands[c.brand].name}</span></div><span class="head-sub${c.green ? ' head-sub-green' : ''}">${c.sub}</span></th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td class="spec-name" scope="row" data-label="Feature">
                ${r.name}
                ${r.info ? `<div class="info">${r.info}</div>` : ''}
              </td>
              ${cols.map(c => `<td class="cell fcol" data-label="${this._brands[c.brand].name}">${this._fcell(r[c.k])}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      </div>
    `;
  }

  // -- Cost calculator ---------------------------------------------------

  _renderCalc() {
    const years = this._years;
    const a = this._model(this._calcA);
    const b = this._model(this._calcB);
    const plugsRelevant = !!(a.addon || b.addon);
    const plugs = plugsRelevant && this._plugs;
    const aTotal = this._cost(a, years, plugs);
    const bTotal = this._cost(b, years, plugs);
    const fmt = this._fmt.bind(this);

    const breakdown = (m, total) => {
      const bits = [`${fmt(m.hw)} hardware`];
      if (m.sub) bits.push(`${years} × $69.99/yr membership (first month free)`);
      else bits.push('$0 required subscription');
      if (plugs && m.addon) bits.push(`${years} × $133/yr PowerPlugs`);
      return bits.join(' + ');
    };
    const subLabel = (m) => {
      if (m.sub) return 'Membership required';
      if (plugs && m.addon) return 'All PowerPlugs added';
      if (m.addon) return 'Free ring data, plugs optional';
      return 'No subscription';
    };

    const seg = (which, sel) => this._models.map(m => `
      <button data-seg-val="${m.key}" data-seg-which="${which}" aria-pressed="${sel === m.key}" class="${sel === m.key ? 'active' : ''}">${m.name} <span class="px">${fmt(m.hw)}${m.sub ? ' + sub' : ''}</span></button>
    `).join('');

    const gap = aTotal - bTotal;
    const dearer = gap > 0 ? a : b;
    const cheaper = gap > 0 ? b : a;
    const gapMsg = gap === 0
      ? `Both options total <strong>${fmt(aTotal)}</strong> over ${years} ${years === 1 ? 'year' : 'years'}.`
      : `<strong>${dearer.name}</strong> costs <strong>${fmt(Math.abs(gap))} more</strong> than ${cheaper.name} over ${years} ${years === 1 ? 'year' : 'years'}.`
        + (dearer.sub ? ` About ${fmt(dearer.sub * years - dearer.sub / 12)} of that is membership, which is what funds the deeper feature set and the validation program.` : '')
        + (plugs && dearer.addon ? ` ${fmt(dearer.addon * years)} of that is the full PowerPlug set, which most buyers will not take.` : '')
        + ` Cost is one input, and the cheaper option is not automatically the better buy: check what each side actually publishes in the feature and validation tables above before letting the dollar gap decide.`;

    return `
      <div class="calc-controls">
        <div class="calc-block">
          <div class="label"><span>First ring</span></div>
          <div class="seg seg-wrap" role="group" aria-label="First ring">${seg('a', this._calcA)}</div>
        </div>
        <div class="calc-block">
          <div class="label"><span>Compared with</span></div>
          <div class="seg seg-wrap" role="group" aria-label="Second ring">${seg('b', this._calcB)}</div>
        </div>
        <div class="calc-block">
          <div class="label"><span>Time horizon</span></div>
          <div class="calc-slider">
            <input type="range" min="1" max="5" step="1" value="${years}" data-years aria-label="Years of ownership" />
            <div class="yrs">${years} <span>${years === 1 ? 'year' : 'years'}</span></div>
          </div>
        </div>
        ${plugsRelevant ? `
        <div class="calc-block">
          <div class="label"><span>Ultrahuman add-ons</span></div>
          <button type="button" class="calc-toggle${plugs ? ' on' : ''}" data-plugs aria-pressed="${plugs}">
            <span class="calc-toggle-box">${plugs ? this._icon('check') : ''}</span>
            <span>Add every PowerPlug ($133/yr, Ultrahuman's own valuation)</span>
          </button>
        </div>` : ''}
        <p class="calc-foot">Oura Membership is $5.99/mo or $69.99/yr, first month free for new members, and is required for trends, HRV detail, the metabolic suite and most insights. RingConn and CUDIS require nothing. Ultrahuman charges nothing for ring data; AFib detection and ovulation confirmation are paid PowerPlugs. Hardware and Oura membership are HSA/FSA eligible.</p>
      </div>
      <div class="calc-result">
        <h4>${years}-year total cost of ownership</h4>
        <div class="calc-row ${aTotal <= bTotal ? 'win' : ''}">
          <div class="who">${this._brandMark(a.brand)}<div>${a.name}<span class="sub">${subLabel(a)}</span></div></div>
          <div class="total">${fmt(aTotal)}</div>
          <div class="breakdown">${breakdown(a, aTotal)}</div>
        </div>
        <div class="calc-row ${bTotal <= aTotal ? 'win' : ''}">
          <div class="who">${this._brandMark(b.brand)}<div>${b.name}<span class="sub">${subLabel(b)}</span></div></div>
          <div class="total">${fmt(bTotal)}</div>
          <div class="breakdown">${breakdown(b, bTotal)}</div>
        </div>
        <div class="calc-savings">${gapMsg}</div>
      </div>
    `;
  }

  _renderBestFor() {
    return this._bestFor.map(b => `
      <div class="bestfor">
        <div class="for-icon">${this._icon(b.icon)}</div>
        <h3>${b.label}</h3>
        <div class="pick"><em>${b.pick}</em></div>
        <p class="reason">${b.reason}</p>
        <div class="footer-row">
          <span class="price">${b.price}</span>
          <span class="yrly">${b.yrly}</span>
        </div>
      </div>
    `).join('');
  }

  // -- Validation + caveats ---------------------------------------------

  get _validation() {
    return [
      { brand: 'oura', title: "Oura's posture", tag: 'Independent peer-reviewed studies', body: 'The only brand here that points to peer-reviewed validation studies it did not run, plus a medical advisory board. That is a real difference in kind, and it is also the strongest evidence base, not proof of accuracy: validation studies vary in quality, several report Oura doing poorly on specific metrics, and having been measured is not the same as having scored well. Its own marketing is marketing like anyone else\'s. "Research-grade" and a pulse signal "up to 100x stronger" than a wrist device are unverified company claims, and roughly 5M paid members and a 2026 IPO filing are scale, not evidence.' },
      { brand: 'ringconn', title: "RingConn's posture", tag: 'Marketing stats + one feasibility study', body: 'Lists strong per-metric figures on the Gen 3 page (HR over 98%, SpO2 under 1.9% MAE, sleep time over 99%, steps over 95%) with no method published alongside them. Its strongest external evidence is a Ruijin Hospital feasibility study presented at IEEE AICAS 2024: 230 volunteers, r=0.93 against a sleep lab for apnea patterns.' },
      { brand: 'ultrahuman', title: "Ultrahuman's posture", tag: 'In-house only, largest study n=6', body: 'PubMed returns zero results for "Ultrahuman ring," and Dial 2025, the five-device head-to-head against a Polar H10 ECG, did not test it. Its published heart-rate work is six volunteers over six days compared against an Apple Watch and another consumer ring, which is device-to-device agreement, not validation. Its flagship Frontiers paper (n=442) was written by seven Ultrahuman employees including the CEO and states outright that no laboratory VO2 max comparison was performed.' },
      { brand: 'cudis', title: "CUDIS's posture", tag: 'No accuracy figure of any kind', body: 'No study, no third-party lab testing, and not a single per-metric number on any CUDIS surface. openFDA holds no 510(k) and no establishment registration for the company, against control queries that returned results. Its marketing statistics ("15 more hours of deep sleep per month," "30% less chance of getting injury") come from internal data with no sample definition, no control group and no stated method, so there is no way to verify them or compare them against anything.' },
    ];
  }

  _renderValidation() {
    return this._validation.map(v => `
      <div class="valid-card animate-on-scroll">
        <div class="valid-head"><span class="valid-ico">${this._brandMark(v.brand)}</span><h3>${v.title}</h3></div>
        <p>${v.body}</p>
        <div class="valid-tag">${v.tag}</div>
      </div>
    `).join('');
  }

  get _caveats() {
    return [
      { icon: 'alert', title: 'Two Ultrahuman rings cannot legally ship to a US address', body: 'Oura brought ITC investigation 337-TA-1398 as complainant. The Commission found Ultrahuman infringed Oura\'s US Patent 11,868,178 and issued a limited exclusion order plus a cease-and-desist order in August 2025, with the bond set at zero percent. RingConn settled and took a royalty-bearing licence; Ultrahuman did not, and its Federal Circuit appeal is consolidated, briefed and still undecided, so the finding is not final. Only the redesigned Ring PRO enters the US, under CBP ruling HQ H354023 of March 6, 2026, because its unibody titanium tube falls outside the patent claims. The Ring AIR, the Diesel edition and the $1,799 Ring Rare are all blocked. Read this as a commercial and legal fact about what you can buy, not as a judgement on the ring: a patent finding says nothing about whether a sensor is accurate, and the enforcement benefits a competitor we earn a commission on.', src: 'Federal Register · CBP CROSS ruling HQ H354023 · Fed. Cir. 26-1083' },
      { icon: 'truck', title: 'The Ring PRO has now missed four US ship dates', body: 'The live page reads "Shipping September 15th onwards," after May 15 announced in March, June 20 announced as "shipping begins today," and August 10 given in a July Kickstarter update. Ultrahuman attributes the slip to per-unit finishing and the difficulty of scaling a titanium unibody with a cutaway safety feature, not to the legal case. Whether any US units actually shipped in June 2026 is not verified, and the continued pre-order language argues against it.', src: 'ultrahuman.com · Kickstarter updates · TechRadar' },
      { icon: 'moon', title: 'CUDIS has no skin temperature sensor', body: 'No CUDIS-published surface mentions one: not the product pages, not the how-it-works page, not the Amazon listing, and not the privacy policy, which enumerates exactly what CUDIS collects (steps, sleep, heart rate, HRV, resting heart rate, SpO2, distance, cycling cadence, active calories) with temperature absent. Independent hands-on reviews describe an optical sensor and motion sensors only. Every other ring on this page has the sensor, and it is what drives cycle-phase, ovulation and illness-onset features.', src: 'cudis.xyz privacy policy · Wareable hands-on' },
      { icon: 'wallet', title: '"No subscription" means different things', body: 'RingConn and CUDIS charge nothing recurring and sell nothing recurring. Ultrahuman charges nothing to see your ring data but sells PowerPlugs: Cardio Adaptability at $2.90/mo, Cycle & Ovulation Pro at $3.99/mo, Tesla Sync at $6.90/mo, plus AFib detection, and Ultrahuman\'s own Ring Rare page values the full set at $133 a year. Oura is the only brand where the fee is not optional: without it you keep three daily scores and nothing else. Note too that RingConn markets its policy as permanent, but only Oura\'s membership terms are contractual per purchase.', src: 'Each brand\'s own pricing pages' },
    ];
  }

  _renderCaveats() {
    return this._caveats.map(c => `
      <div class="caveat animate-on-scroll">
        <div class="caveat-ico">${this._icon(c.icon)}</div>
        <div class="caveat-body">
          <h3>${c.title}</h3>
          <p>${c.body}</p>
          <div class="caveat-src">${c.src}</div>
        </div>
      </div>
    `).join('');
  }

  _renderFAQ() {
    return this._faqs.map(f => `
      <details>
        <summary>${f.q}</summary>
        <div class="body">${f.a}</div>
      </details>
    `).join('');
  }

  // -- Sources -----------------------------------------------------------

  get _srcGroups() {
    return [
      {
        group: 'Oura official',
        links: [
          { t: 'Oura Store', u: 'https://ouraring.com/store' },
          { t: 'Oura Ring 5 product + specs', u: 'https://ouraring.com/store/rings/oura-ring-5/silver' },
          { t: 'Oura Ring 4 product + specs', u: 'https://ouraring.com/store/rings/oura-ring-4/silver' },
          { t: 'Oura Membership', u: 'https://ouraring.com/membership' },
          { t: 'Membership support article', u: 'https://support.ouraring.com/hc/en-us/articles/4409086524819-Oura-Membership' },
          { t: 'Sleep & Rest', u: 'https://ouraring.com/sleep-and-rest' },
          { t: 'Heart Health', u: 'https://ouraring.com/heart-health' },
          { t: "Women's Health", u: 'https://ouraring.com/womens-health' },
          { t: 'Metabolic Health', u: 'https://ouraring.com/metabolic-health' },
        ],
      },
      {
        group: 'RingConn official',
        links: [
          { t: 'Gen 3 product + specs + FAQ', u: 'https://ringconn.com/products/ringconn-gen-3' },
          { t: 'Gen 3 landing (accuracy + vascular)', u: 'https://ringconn.com/pages/ringconn-gen-3' },
          { t: 'Gen 2 product', u: 'https://ringconn.com/products/ringconn-gen-2' },
          { t: 'Gen 2 Air product', u: 'https://ringconn.com/products/ringconn-gen-2-air' },
          { t: 'Official compare table', u: 'https://ringconn.com/pages/product-compare' },
          { t: 'App features', u: 'https://ringconn.com/pages/app-features' },
          { t: 'Ruijin Hospital OSAHS study (IEEE AICAS 2024)', u: 'https://ringconn.com/blogs/newsroom/ringconn-appeared-at-ieee-aicas-2024-in-the-uae-and-announced-its-research-results-osahs-for-the-first-time' },
        ],
      },
      {
        group: 'Ultrahuman official',
        links: [
          { t: 'Ring PRO buy page + Compare PRO vs AIR', u: 'https://www.ultrahuman.com/us/ring-pro/buy/' },
          { t: 'Ring AIR global buy page + Technical Specifications', u: 'https://www.ultrahuman.com/global/ring/buy/' },
          { t: 'Diesel Ultrahuman Ring buy page', u: 'https://www.ultrahuman.com/us/diesel-ultrahuman-ring/buy/' },
          { t: 'Ring Rare buy page (US sale blocked)', u: 'https://www.ultrahuman.com/us/rare/buy/' },
          { t: 'PowerPlugs catalogue and pricing', u: 'https://www.ultrahuman.com/us/powerplugs/' },
          { t: 'Smart Rings Terms of Sale (warranty, returns, UltrahumanX)', u: 'https://www.ultrahuman.com/us/termsOfSale/UltrahumanRing/' },
        ],
      },
      {
        group: 'Ultrahuman validation',
        links: [
          { t: 'Ultrahuman Science hub', u: 'https://www.ultrahuman.com/science/studies/' },
          { t: 'Sleep heart-rate pilot study (n=6, in-house)', u: 'https://www.ultrahuman.com/science/studies/sleep-heart-rate-sensing/' },
          { t: 'Frontiers in Digital Health, fitness age, n=442 (all authors Ultrahuman employees)', u: 'https://www.frontiersin.org/journals/digital-health/articles/10.3389/fdgth.2026.1842633/full' },
          { t: 'PubMed search "Ultrahuman ring" (0 results)', u: 'https://pubmed.ncbi.nlm.nih.gov/?term=Ultrahuman+ring' },
          { t: 'Dial 2025, Physiological Reports (Ultrahuman and CUDIS not tested)', u: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12367097' },
          { t: 'FibriCheck 510(k) K173872, the clearance behind Ultrahuman AFib', u: 'https://www.accessdata.fda.gov/cdrh_docs/pdf17/K173872.pdf' },
        ],
      },
      {
        group: 'Ultrahuman US legal record',
        links: [
          { t: 'Federal Register: ITC final determination, 337-TA-1398', u: 'https://www.federalregister.gov/documents/2025/08/26/2025-16316/certain-smart-wearable-devices-systems-and-components-thereof-notice-of-the-commissions-final' },
          { t: 'CBP Headquarters Ruling HQ H354023 (Mar 6, 2026)', u: 'https://rulings.cbp.gov/docs/hq/2026/h354023' },
          { t: 'Fed. Cir. docket 26-1083, Ultrahuman v. ITC', u: 'https://dockets.justia.com/docket/circuit-courts/cafc/26-1083' },
          { t: 'TechRadar: Ring PRO backers still waiting after production issues', u: 'https://www.techradar.com/health-fitness/fitness-trackers/ultrahuman-ring-pro-kickstarter-backers-are-still-left-waiting-after-production-issues-plague-the-oura-rival' },
        ],
      },
      {
        group: 'CUDIS official',
        links: [
          { t: '002 Classic product page', u: 'https://www.cudis.xyz/products/cudis-002-classic-ring' },
          { t: '002 Sporty product page', u: 'https://www.cudis.xyz/products/cudis-002-sporty-ring' },
          { t: 'How CUDIS Works', u: 'https://www.cudis.xyz/pages/how-cudis-works' },
          { t: 'Warranty policy', u: 'https://www.cudis.xyz/pages/warranty-policy' },
          { t: 'Aftersales / returns policy', u: 'https://www.cudis.xyz/pages/aftersales-policy' },
          { t: 'Privacy policy (health data types, "we do not sell Personal Data")', u: 'https://www.cudis.xyz/policies/privacy-policy' },
          { t: 'Sporty Kickstarter campaign', u: 'https://www.kickstarter.com/projects/cudis/cudis-sporty-ring-1st-smart-ring-you-can-style-and-earn-with' },
          { t: '$CUDIS price and market cap (CoinGecko)', u: 'https://www.coingecko.com/en/coins/cudis' },
        ],
      },
      {
        group: 'CUDIS independent hands-on',
        links: [
          { t: 'Wareable review, using an Oura Ring 5 as control', u: 'https://www.wareable.com/wearable-tech/cudis-002-sporty-smart-ring-review' },
          { t: 'Techloy hands-on (connectivity and step-count problems)', u: 'https://www.techloy.com/is-the-cudis-ring-worth-399-a-hands-on-review-of-the-ai-smart-ring/' },
          { t: 'New Edge Times review', u: 'https://www.newedgetimes.com/cudis-002-sporty-ring-review/' },
          { t: 'openFDA 510(k) and registration queries for CUDIS (0 records, controls returned results)', u: 'https://open.fda.gov/apis/device/510k/' },
        ],
      },
    ];
  }

  // Flat source list for the standard sources module: the group name becomes
  // the card's tag.
  get _sources() {
    const out = [];
    for (const g of this._srcGroups) {
      for (const l of g.links) out.push({ tag: g.group, title: l.t, cite: '', url: l.u });
    }
    return out;
  }
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

  // ── Events ───────────────────────────────────────────────────────────

  // -- Events ------------------------------------------------------------

  _bindEvents() {
    const root = this.shadowRoot;

    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-src-toggle]')) this._toggleSources();
    });

    // Ring finder: priority chips + reset.
    const finder = root.querySelector('[data-finder]');
    finder.addEventListener('click', (e) => {
      if (e.target.closest('[data-crit-clear]')) {
        this._priorities.clear();
        finder.innerHTML = this._renderFinder();
        return;
      }
      const chip = e.target.closest('button[data-crit]');
      if (!chip) return;
      const k = chip.dataset.crit;
      if (this._priorities.has(k)) this._priorities.delete(k); else this._priorities.add(k);
      finder.innerHTML = this._renderFinder();
    });

    // Spec table: model columns (min 2, max 4).
    root.querySelector('[data-modelpick]').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-col]');
      if (!btn) return;
      const k = btn.dataset.col;
      const i = this._cols.indexOf(k);
      if (i > -1) {
        if (this._cols.length <= 2) return; // keep at least two columns
        this._cols.splice(i, 1);
      } else {
        if (this._cols.length >= 4) return; // four columns is the mobile limit
        this._cols.push(k);
      }
      // Keep the columns in lineup order rather than click order.
      const order = this._models.map(m => m.key);
      this._cols.sort((x, y) => order.indexOf(x) - order.indexOf(y));
      root.querySelector('[data-modelpick]').innerHTML = this._renderModelPicker();
      root.querySelector('[data-pick-count]').textContent = `${this._cols.length} of 4 selected`;
      root.querySelector('[data-tbl-body]').innerHTML = this._renderTable();
    });

    root.querySelector('[data-tabs]').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-tab]');
      if (!btn) return;
      this._activeTab = btn.dataset.tab;
      root.querySelector('[data-tabs]').innerHTML = this._renderTabs();
      root.querySelector('[data-tbl-body]').innerHTML = this._renderTable();
    });

    root.querySelector('[data-ftabs]').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-ftab]');
      if (!btn) return;
      this._featTab = btn.dataset.ftab;
      root.querySelector('[data-ftabs]').innerHTML = this._renderFeatTabs();
      root.querySelector('[data-feat-body]').innerHTML = this._renderFeatTable();
    });

    const calc = root.querySelector('[data-calc]');
    calc.addEventListener('click', (e) => {
      if (e.target.closest('[data-plugs]')) { this._plugs = !this._plugs; this._updateCalc(); return; }
      const btn = e.target.closest('button[data-seg-val]');
      if (!btn) return;
      if (btn.dataset.segWhich === 'a') this._calcA = btn.dataset.segVal;
      else this._calcB = btn.dataset.segVal;
      this._updateCalc();
    });
    calc.addEventListener('input', (e) => {
      if (e.target.matches('[data-years]')) {
        this._years = +e.target.value;
        this._updateCalc();
      }
    });
  }

  _updateCalc() {
    this.shadowRoot.querySelector('[data-calc]').innerHTML = this._renderCalc();
  }

  _setupAnimations() {
    const els = this.shadowRoot.querySelectorAll('.animate-on-scroll');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); this._observer.unobserve(e.target); } });
    }, { threshold: 0.01 });
    els.forEach(el => this._observer.observe(el));
  }

  // -- Structured Data ---------------------------------------------------

  _injectStructuredData() {
    const h = this._heroStats;
    if (!document.querySelector('script[data-kygo-smartring-ld]')) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Smart Ring Comparison and Picker (2026)',
        'description': `Compare ${h.models} current smart rings from ${h.brands} brands side by side: Oura (Ring 5, Ring 4), RingConn (Gen 3, Gen 2, Gen 2 Air), Ultrahuman (Ring PRO, Ring AIR) and CUDIS (002 Classic, 002 Sporty). A priority-based ring finder, model-by-model specs, a feature matrix, the validation record for each brand, and the real multi-year cost with subscriptions and paid add-ons included. Official manufacturer figures only.`,
        'url': 'https://www.kygo.app/tools/smart-ring-comparison',
        'applicationCategory': 'HealthApplication',
        'operatingSystem': 'Web',
        'inLanguage': 'en',
        'isAccessibleForFree': true,
        'datePublished': '2026-09-02',
        'dateModified': '2026-09-02',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
        'publisher': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app', 'logo': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        'featureList': `Priority-based ring finder ranking ${h.models} models on eight criteria, model-by-model spec comparison across six categories including validation, brand-level feature matrix across ${this._featureTotals.total} features, interactive multi-year cost calculator covering subscriptions and paid add-ons, per-brand accuracy and validation breakdown, US availability and regulatory caveats, mobile-first responsive design`,
        'keywords': 'smart ring comparison 2026, best smart ring, smart ring without subscription, oura vs ringconn vs ultrahuman, cudis vs oura, ultrahuman ring pro vs oura ring 5, cheapest smart ring, longest battery smart ring, smart ring sleep apnea, smart ring picker, which smart ring should i buy'
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-smartring-ld', '');
      s.textContent = JSON.stringify(ld);
      document.head.appendChild(s);
    }

    if (!document.querySelector('script[data-kygo-smartring-faq]')) {
      const faq = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': this._faqs.map(f => ({
          '@type': 'Question',
          'name': f.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
        }))
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-smartring-faq', '');
      s.textContent = JSON.stringify(faq);
      document.head.appendChild(s);
    }

    if (!document.querySelector('script[data-kygo-smartring-bc]')) {
      const bc = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.kygo.app' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
          { '@type': 'ListItem', 'position': 3, 'name': 'Smart Ring Comparison', 'item': 'https://www.kygo.app/tools/smart-ring-comparison' }
        ]
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-smartring-bc', '');
      s.textContent = JSON.stringify(bc);
      document.head.appendChild(s);
    }
  }
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
        font-family: var(--font-body);
        color: var(--fg-1);
        background: var(--bg-canvas);
        line-height: 1.5;
      }
      * { box-sizing: border-box; }
      a { color: inherit; text-decoration: none; }
      .ico { display: inline-flex; align-items: center; justify-content: center; }
      .ico svg { width: 1em; height: 1em; }

      /* Animate */
      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity .6s var(--ease-out), transform .6s var(--ease-out); }
      .animate-on-scroll.visible { opacity: 1; transform: none; }
      @media (prefers-reduced-motion: reduce) { .animate-on-scroll { opacity: 1; transform: none; transition: none; } }

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
      .hero-light h1 { font-family: var(--font-display); font-weight: 700; color: var(--fg-1); font-size: clamp(30px, 5.5vw, 60px); line-height: 1.05; letter-spacing: -0.02em; margin: 18px 0 18px; }
      .hero-light h1 .hl { color: var(--kygo-green); }
      .hero-lede { font-size: clamp(15px, 1.6vw, 18px); line-height: 1.55; color: var(--fg-2); max-width: 60ch; margin: 0; }
      .hero-lede strong { color: var(--fg-1); font-weight: 600; }
      .hero-vis { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 6px; background: linear-gradient(158deg, #ffffff 0%, #EEF2F7 100%); border: 1px solid var(--border-subtle); border-radius: 20px; padding: 16px 18px; aspect-ratio: 5 / 3; box-shadow: 0 16px 40px rgba(15,23,42,0.08); }
      .hero-vis::before { content: ''; position: absolute; top: -90px; right: -70px; width: 240px; height: 240px; background: radial-gradient(closest-side, rgba(34,197,94,0.16), transparent); pointer-events: none; }
      .hero-vis::after { content: ''; position: absolute; bottom: -110px; left: -70px; width: 230px; height: 230px; background: radial-gradient(closest-side, rgba(148,163,184,0.16), transparent); pointer-events: none; }
      .hero-vis-head { position: relative; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; }
      .hero-vis-title { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: var(--fg-3); white-space: nowrap; }
      .hero-vis-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 0 3px rgba(34,197,94,0.18); flex: none; }
      .hero-vis-tag { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.3px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
      .hero-vis svg { position: relative; width: 100%; flex: 1; min-height: 0; display: block; }
      @media (max-width: 880px) { .hero-vis { width: 100%; max-width: 460px; margin: 4px auto 0; padding: 14px 16px; } }
      .hero-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; border-top: 1px solid var(--border-subtle); padding-top: 24px; }
      @media (min-width: 720px) { .hero-stats { grid-template-columns: repeat(4, 1fr); gap: 24px; padding-top: 28px; } }
      .hero-stat .num { font-family: var(--font-display); font-weight: 700; font-size: clamp(30px, 4.2vw, 44px); line-height: 1; color: var(--kygo-green); letter-spacing: -0.02em; display: inline-flex; align-items: baseline; gap: 2px; }
      .hero-stat .num .unit { color: var(--kygo-green); font-size: 0.55em; font-weight: 600; }
      .hero-stat .lbl { margin-top: 10px; color: var(--fg-3); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; line-height: 1.4; }

      /* Sections */
      .section { padding: 56px 20px; }
      @media (min-width: 720px) { .section { padding: 80px 24px; } }
      .section-inner { max-width: 1200px; margin: 0 auto; }
      .section.bg-white { background: #fff; }
      .section.bg-light { background: var(--kygo-light); }
      .section-head { margin-bottom: 28px; max-width: 760px; }
      .kicker { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 6px 12px; border-radius: 999px; }
      .section h2 { font-family: var(--font-display); font-weight: 600; font-size: clamp(26px, 4vw, 42px); line-height: 1.1; margin: 16px 0 10px; letter-spacing: -0.01em; }
      .section h2 .hl { color: var(--kygo-green); }
      .lede { color: var(--fg-2); font-size: 16px; line-height: 1.55; max-width: 66ch; margin: 0; }

      /* Quick-answer summary (crawlable prose) */
      .tldr { margin-bottom: 8px; }
      .tldr-lead { font-size: clamp(15px, 1.7vw, 17px); line-height: 1.6; color: var(--fg-2); max-width: 78ch; margin: 0 0 22px; }
      .tldr-lead strong { color: var(--fg-1); font-weight: 600; }
      .cmp-blocks { display: grid; grid-template-columns: 1fr; gap: 16px; }
      @media (min-width: 760px) { .cmp-blocks { grid-template-columns: 1fr 1fr; } }
      .cmp-block { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 24px; box-shadow: var(--shadow-md); }
      .cmp-block.cmp-block-wide { grid-column: 1 / -1; }
      .cmp-block h3 { font-family: var(--font-display); font-weight: 600; font-size: clamp(17px, 2vw, 20px); line-height: 1.2; margin: 0 0 6px; color: var(--fg-1); }
      .cmp-verdict { font-family: var(--font-display); font-weight: 600; font-size: 14px; line-height: 1.4; color: var(--kygo-green-dark); margin: 0 0 12px; }
      .cmp-block p { font-size: 14.5px; line-height: 1.65; color: var(--fg-2); margin: 0; }
      .cmp-block p strong { color: var(--fg-1); font-weight: 600; }

      /* Verdict gaps / trade-off cards */
      .gaps { display: grid; grid-template-columns: 1fr; gap: 16px; }
      @media (min-width: 720px) { .gaps { grid-template-columns: 1fr 1fr; } }
      .gap { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 24px; box-shadow: var(--shadow-md); }
      .gap h4 { font-family: var(--font-display); font-weight: 600; font-size: 12px; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 16px; }
      .gap ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
      .gap li { display: grid; grid-template-columns: 28px 1fr; gap: 12px; font-size: 14px; line-height: 1.55; color: var(--fg-2); }
      .gap li .num-tag { color: var(--kygo-green-dark); background: var(--kygo-green-light); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
      .gap li .num-tag .ico { width: 15px; height: 15px; }
      .gap li strong { color: var(--fg-1); font-weight: 600; }

      /* Best-for */
      .bestfor-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
      @media (min-width: 560px) { .bestfor-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (min-width: 1000px) { .bestfor-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; } }
      .bestfor { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 22px; display: flex; flex-direction: column; gap: 14px; box-shadow: var(--shadow-md); transition: all .25s var(--ease-out); }
      .bestfor:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); transform: translateY(-3px); }
      .bestfor .for-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--kygo-green-light); color: var(--kygo-green-dark); display: flex; align-items: center; justify-content: center; font-size: 20px; }
      .bestfor .for-icon .ico { width: 22px; height: 22px; }
      .bestfor h3 { font-family: var(--font-display); font-weight: 600; font-size: 14px; margin: 0; color: var(--fg-2); line-height: 1.35; }
      .bestfor .pick { font-family: var(--font-display); font-weight: 600; font-size: 22px; line-height: 1.15; color: var(--fg-1); margin: -4px 0 0; }
      .bestfor .pick em { color: var(--kygo-green-dark); font-style: normal; }
      .bestfor .reason { font-size: 13.5px; color: var(--fg-2); line-height: 1.55; margin: 0; }
      .bestfor .footer-row { display: flex; align-items: center; gap: 10px; margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border-subtle); }
      .bestfor .price { font-family: var(--font-display); font-weight: 700; font-size: 15px; color: var(--fg-1); }
      .bestfor .yrly { color: var(--fg-3); font-size: 12px; }

      /* Spec + feature tables */
      .tbl-wrap { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-md); }
      .tbl-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      @media (min-width: 768px) { .tbl-scroll { overflow-x: visible; } }
      .tbl-note { color: var(--fg-3); font-size: 12.5px; line-height: 1.55; margin: 0; padding: 14px 18px 16px; border-top: 1px solid var(--border-subtle); background: var(--bg-surface); }
      .tbl-tabs { display: flex; gap: 4px; padding: 12px; border-bottom: 1px solid var(--border-subtle); overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .tbl-tabs button { font-family: var(--font-body); font-size: 13px; font-weight: 600; padding: 9px 14px; border-radius: 10px; border: 0; background: transparent; color: var(--fg-2); cursor: pointer; white-space: nowrap; transition: all .15s ease; display: inline-flex; align-items: center; gap: 8px; }
      .tbl-tabs button:hover { background: var(--bg-raised); color: var(--fg-1); }
      .tbl-tabs button.active { background: var(--kygo-dark); color: #fff; }
      .tbl-tabs button .ct { font-size: 11px; padding: 2px 7px; border-radius: 999px; background: rgba(0,0,0,0.06); }
      .tbl-tabs button.active .ct { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.85); }
      .tbl { width: 100%; border-collapse: separate; border-spacing: 0; font-family: var(--font-body); min-width: 760px; }
      .tbl.ftbl { min-width: 480px; }
      /* Mobile: a fixed, narrow, sticky first column keeps the row label pinned and readable while the data columns scroll (unsticks on desktop) */
      .tbl th:first-child, .tbl td:first-child { position: sticky; left: 0; z-index: 2; box-shadow: 1px 0 0 var(--border-subtle); }
      .tbl thead th:first-child { z-index: 3; background: var(--bg-raised); }
      .tbl tbody td:first-child { background: #fff; }
      .tbl tbody tr:hover td:first-child { background: var(--bg-raised); }
      .tbl thead th { text-align: left; padding: 16px 18px; font-family: var(--font-display); font-weight: 600; font-size: 13px; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.4px; background: var(--bg-raised); vertical-align: top; }
      .tbl thead th .head-prod { display: flex; align-items: center; gap: 10px; color: var(--fg-1); text-transform: none; letter-spacing: 0; font-size: 14px; }
      .tbl thead th .head-prod img { width: 22px; height: 22px; border-radius: 5px; background: #fff; padding: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); object-fit: contain; }
      .tbl thead th .head-sub { display: block; margin-top: 5px; font-family: var(--font-body); font-size: 11px; font-weight: 500; color: var(--fg-3); text-transform: none; letter-spacing: 0; }
      .tbl thead th .head-sub-green { color: var(--kygo-green-dark); font-weight: 600; }
      .tbl thead th .amazon-link { display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; font-family: var(--font-body); font-size: 11px; font-weight: 600; color: var(--kygo-green-dark); text-transform: none; letter-spacing: 0; text-decoration: none; transition: color .15s; }
      .tbl thead th .amazon-link:hover { color: var(--kygo-green); }
      .tbl thead th .amazon-link .ico { width: 12px; height: 12px; transition: transform .15s; }
      .tbl thead th .amazon-link:hover .ico { transform: translateX(2px); }
      .tbl tbody td { padding: 14px 18px; border-top: 1px solid var(--border-subtle); vertical-align: top; font-size: 14px; line-height: 1.5; }
      .tbl tbody tr:hover { background: var(--bg-raised); }
      .tbl .spec-name { font-weight: 600; color: var(--fg-1); overflow-wrap: anywhere; }
      .tbl .spec-name .info { font-size: 12px; font-weight: 400; color: var(--fg-3); margin-top: 2px; line-height: 1.4; }
      .tbl .y { color: var(--kygo-green-dark); font-weight: 600; }
      .tbl .n { color: var(--fg-2); }
      .tbl .num { font-family: var(--font-numeric); font-weight: 600; font-size: 15px; color: var(--fg-1); }
      .tbl .num.y { color: var(--kygo-green-dark); }
      .fcell { display: flex; align-items: flex-start; gap: 8px; }
      .fcell .ico { flex: none; width: 18px; height: 18px; border-radius: 5px; display: inline-flex; align-items: center; justify-content: center; margin-top: 1px; }
      .fcell .ico svg { width: 12px; height: 12px; }
      .fcell.yes .ico { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .fcell.no .ico { background: var(--bg-raised); color: var(--fg-3); }
      .fcell.yes span { color: var(--fg-1); }
      .fcell.no span { color: var(--fg-3); }
      .aff-row-inner { display: none; flex-direction: column; gap: 8px; padding: 14px 14px 2px; }
      @media (max-width: 767px) { .aff-row-inner { display: flex; } }
      .aff-btn { display: inline-flex; align-items: center; gap: 8px; justify-content: center; padding: 11px 14px; border-radius: 10px; border: 1.5px solid var(--kygo-green-light); background: rgba(34,197,94,0.06); color: var(--kygo-green-dark); font-family: var(--font-body); font-weight: 600; font-size: 13px; transition: all .15s ease; }
      .aff-btn:hover { border-color: var(--kygo-green); background: rgba(34,197,94,0.1); }
      .aff-btn img { width: 18px; height: 18px; border-radius: 4px; background: #fff; padding: 2px; object-fit: contain; }
      .aff-btn .ico { width: 13px; height: 13px; }
      @media (max-width: 767px) {
        .tbl thead th, .tbl tbody td { padding: 12px 12px; font-size: 13px; }
        .tbl thead th .head-prod { font-size: 13px; gap: 7px; }
        .tbl th:first-child, .tbl td:first-child { width: 124px; min-width: 124px; max-width: 124px; }
      }
      @media (min-width: 768px) {
        .tbl { min-width: 0; }
        .tbl.ftbl { min-width: 0; }
        .tbl th:first-child, .tbl td:first-child { position: static; box-shadow: none; }
        .tbl .spec-name { width: 26%; }
        .tbl.ftbl .spec-name { width: 44%; }
      }

      /* Cost calculator */
      .calc { display: grid; grid-template-columns: 1fr; gap: 18px; align-items: stretch; }
      @media (min-width: 880px) { .calc { grid-template-columns: 1.1fr 1fr; gap: 24px; } }
      .calc-controls { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; padding: 22px; display: flex; flex-direction: column; gap: 20px; box-shadow: var(--shadow-md); }
      @media (min-width: 720px) { .calc-controls { padding: 28px; } }
      .calc-block { display: flex; flex-direction: column; gap: 10px; }
      .calc-block .label { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); }
      .calc-block .label img { width: 22px; height: 22px; border-radius: 5px; background: #fff; padding: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); object-fit: contain; }
      .seg { display: flex; gap: 4px; background: var(--bg-raised); padding: 4px; border-radius: 10px; }
      .seg button { flex: 1; font-family: var(--font-body); font-size: 12px; font-weight: 600; padding: 9px 10px; border-radius: 8px; border: 0; background: transparent; color: var(--fg-2); cursor: pointer; transition: all .15s; display: flex; flex-direction: column; align-items: center; gap: 2px; line-height: 1.2; }
      .seg button .px { font-size: 10px; color: var(--fg-3); font-weight: 500; }
      .seg button.active { background: #fff; color: var(--fg-1); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
      .seg button.active .px { color: var(--kygo-green-dark); }
      .calc-slider { display: flex; align-items: center; gap: 14px; }
      .calc-slider input[type=range] { flex: 1; accent-color: var(--kygo-green); }
      .calc-slider .yrs { font-family: var(--font-display); font-weight: 700; font-size: 22px; min-width: 80px; text-align: right; }
      .calc-slider .yrs span { color: var(--fg-3); font-size: 13px; font-weight: 500; }
      .calc-foot { margin: 0; color: var(--fg-3); font-size: 12px; line-height: 1.5; }

      .calc-result { background: var(--kygo-dark); color: #fff; border-radius: 20px; padding: 22px; display: flex; flex-direction: column; gap: 18px; position: relative; overflow: hidden; }
      @media (min-width: 720px) { .calc-result { padding: 28px; } }
      .calc-result::before { content: ''; position: absolute; top: -100px; right: -100px; width: 320px; height: 320px; background: radial-gradient(closest-side, rgba(34,197,94,0.25), transparent); pointer-events: none; }
      .calc-result h4 { font-family: var(--font-display); font-weight: 600; font-size: 13px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.5px; margin: 0; position: relative; }
      .calc-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; padding: 14px 0; border-top: 1px solid rgba(255,255,255,0.10); position: relative; }
      .calc-row:first-of-type { border-top: 0; }
      .calc-row .who { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 600; font-size: 15px; }
      .calc-row .who img { width: 22px; height: 22px; border-radius: 5px; background: #fff; padding: 2px; object-fit: contain; }
      .calc-row .who .sub { display: block; font-weight: 400; font-size: 12px; color: rgba(255,255,255,0.55); }
      .calc-row .total { font-family: var(--font-display); font-weight: 700; font-size: 28px; line-height: 1; color: #fff; text-align: right; letter-spacing: -0.02em; }
      @media (min-width: 720px) { .calc-row .total { font-size: 32px; } }
      .calc-row.win .total { color: var(--kygo-green); }
      .calc-row .breakdown { grid-column: 1 / -1; color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 2px; line-height: 1.4; }
      .calc-savings { margin-top: auto; position: relative; padding: 12px 14px; border-radius: 12px; background: rgba(34,197,94,0.12); color: #6EE7A0; font-size: 13px; font-weight: 500; line-height: 1.5; }
      .calc-savings strong { color: #fff; }

      /* Validation cards */
      .valid-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
      @media (min-width: 720px) { .valid-grid { grid-template-columns: 1fr 1fr; align-items: start; } }
      .valid-card { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 24px; box-shadow: var(--shadow-md); }
      .valid-head { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
      .valid-ico { width: 44px; height: 44px; border-radius: 11px; background: #fff; border: 1.5px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; flex: none; box-shadow: 0 1px 3px rgba(15,23,42,0.06); }
      .valid-ico img { width: 28px; height: 28px; object-fit: contain; }
      .valid-head h3 { font-family: var(--font-display); font-weight: 600; font-size: 19px; margin: 0; color: var(--fg-1); }
      .valid-card p { font-size: 14px; line-height: 1.6; color: var(--fg-2); margin: 0 0 14px; }
      .valid-tag { display: inline-block; font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 6px 12px; border-radius: 999px; }
      .valid-note { margin: 20px 0 0; font-size: 13px; line-height: 1.6; color: var(--fg-3); max-width: 90ch; }

      /* Kygo CTA */
      .kygo-cta-card { background: var(--kygo-dark); border-radius: 20px; padding: 40px 24px; position: relative; overflow: hidden; color: #fff; text-align: center; display: flex; flex-direction: column; align-items: center; }
      @media (min-width: 720px) { .kygo-cta-card { padding: 56px 40px; border-radius: 24px; } }
      .kygo-cta-card::before { content: ''; position: absolute; top: -160px; right: -160px; width: 520px; height: 520px; background: radial-gradient(closest-side, rgba(34,197,94,0.30), transparent); pointer-events: none; }
      .kygo-cta-card::after { content: ''; position: absolute; bottom: -180px; left: -180px; width: 480px; height: 480px; background: radial-gradient(closest-side, rgba(34,197,94,0.12), transparent); pointer-events: none; }
      .kygo-cta-card .cta-pill { position: relative; display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.16); color: #6EE7A0; padding: 6px 14px; border-radius: 999px; font-family: var(--font-display); font-size: 12px; font-weight: 600; border: 1px solid rgba(34,197,94,0.25); }
      .kygo-cta-card .cta-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 8px var(--kygo-green); }
      .kygo-cta-card h3 { position: relative; font-family: var(--font-display); font-weight: 600; color: #fff; font-size: clamp(26px, 4.5vw, 42px); line-height: 1.05; letter-spacing: -0.01em; margin: 18px 0 14px; max-width: 22ch; }
      .kygo-cta-card h3 span { color: var(--kygo-green); }
      .kygo-cta-card p { position: relative; color: rgba(255,255,255,0.72); font-size: clamp(14px, 1.6vw, 16px); line-height: 1.6; max-width: 58ch; margin: 0 auto 24px; }
      .kygo-cta-card p em { font-style: italic; color: #fff; }
      .kygo-cta-card .cta-btn-row { position: relative; display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; width: 100%; }
      @media (max-width: 560px) { .kygo-cta-card .cta-btn-row .btn-lg { width: 100%; justify-content: center; } }
      .kygo-cta-card .cta-works { position: relative; margin-top: 26px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: rgba(255,255,255,0.6); font-size: 13px; }
      .kygo-cta-card .cta-badges { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; justify-content: center; }
      @media (max-width: 560px) { .kygo-cta-card .cta-badges { display: grid; grid-template-columns: repeat(3, auto); justify-content: center; } }
      .kygo-cta-card .cta-badges img { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); padding: 4px; object-fit: contain; }

      /* Sources */
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

      /* FAQ */
      .faq { display: flex; flex-direction: column; gap: 10px; }
      .faq details { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; padding: 4px 20px; box-shadow: var(--shadow-md); transition: border-color .2s, box-shadow .2s; }
      .faq details[open] { border-color: var(--kygo-green); }
      .faq summary { list-style: none; padding: 16px 0; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 14px; }
      .faq summary::-webkit-details-marker { display: none; }
      .faq summary::after { content: '+'; color: var(--kygo-green-dark); font-weight: 600; font-size: 22px; transition: transform .2s; line-height: 1; }
      .faq details[open] summary::after { content: '\\2212'; }
      .faq .body { padding: 0 0 16px; color: var(--fg-2); font-size: 14px; line-height: 1.65; }


      /* Footer */
      .tool-footer { padding: 56px 20px 40px; background: #fff; color: var(--fg-2); border-top: 1px solid var(--border-subtle); }
      .tool-footer .container { max-width: 720px; margin: 0 auto; text-align: center; }
      .footer-brand { display: inline-flex; align-items: center; gap: 10px; color: var(--fg-1); font-family: var(--font-display); font-weight: 700; font-size: 17px; }
      .footer-logo { width: 28px; height: 28px; }
      .footer-tagline { color: var(--fg-3); font-size: 14px; margin: 10px 0 22px; }
      .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 18px; margin-bottom: 28px; font-size: 14px; }
      .footer-links a { color: var(--fg-2); }
      .footer-links a:hover { color: var(--kygo-green-dark); }
      .footer-disclaimer { font-size: 12px; color: var(--fg-3); line-height: 1.6; max-width: 640px; margin: 0 auto 14px; }
      .footer-copyright { font-size: 12px; color: var(--fg-3); margin: 4px 0; }
      .footer-affiliate { font-style: italic; }

      /* Brand mark fallback (CUDIS has no brand asset in the library) */
      .brand-fb { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 5px; background: var(--bg-raised); color: var(--fg-2); font-family: var(--font-display); font-weight: 700; font-size: 12px; line-height: 1; flex: none; }

      /* Hero visual footnote */
      .hero-vis-foot { margin: 10px 0 0; font-size: 11px; line-height: 1.45; color: var(--fg-3); }

      /* Ring finder */
      .finder { display: flex; flex-direction: column; gap: 20px; }
      .finder-controls { background: var(--bg-raised); border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 18px; }
      @media (min-width: 720px) { .finder-controls { padding: 22px; } }
      .finder-head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 14px; }
      .finder-label { font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); }
      .finder-state { font-size: 12.5px; color: var(--fg-3); font-weight: 500; }
      .finder-clear { border: 0; background: none; padding: 0; font-family: var(--font-body); font-size: 12.5px; font-weight: 600; color: var(--kygo-green-dark); cursor: pointer; text-decoration: underline; }
      .fchips { display: flex; flex-wrap: wrap; gap: 8px; }
      .fchip { display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 999px; border: 1.5px solid var(--border-subtle); background: #fff; color: var(--fg-2); font-family: var(--font-body); font-weight: 600; font-size: 13px; cursor: pointer; transition: all .15s ease; }
      .fchip .ico { width: 15px; height: 15px; color: var(--fg-3); }
      .fchip:hover { border-color: var(--kygo-green); }
      .fchip.on { background: var(--kygo-dark); border-color: var(--kygo-dark); color: #fff; }
      .fchip.on .ico { color: var(--kygo-green); }
      .finder-notes { display: grid; grid-template-columns: 1fr; gap: 14px; margin-top: 4px; }
      @media (min-width: 880px) { .finder-notes { grid-template-columns: 1fr 1fr; align-items: start; } }
      .finder-note { margin: 0; font-size: 12.5px; line-height: 1.6; color: var(--fg-3); }
      .finder-note strong { color: var(--fg-2); font-weight: 600; }
      .finder-disclose { grid-column: 1 / -1; background: var(--bg-raised); border: 1.5px solid var(--border-subtle); border-radius: 12px; padding: 14px 16px; color: var(--fg-2); }
      .finder-disclose strong { color: var(--fg-1); }

      .fr-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
      @media (min-width: 720px) { .fr-grid { grid-template-columns: repeat(3, 1fr); align-items: stretch; } }
      .fr-card { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 20px; display: flex; flex-direction: column; gap: 12px; box-shadow: var(--shadow-md); }
      .fr-card.fr-win { border-color: var(--kygo-green); box-shadow: 0 8px 24px rgba(34,197,94,0.16); }
      .fr-rank { align-self: flex-start; font-family: var(--font-display); font-size: 10.5px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--fg-3); background: var(--bg-raised); padding: 5px 11px; border-radius: 999px; }
      .fr-card.fr-win .fr-rank { color: var(--kygo-green-dark); background: var(--kygo-green-light); }
      .fr-head { display: flex; align-items: center; gap: 11px; }
      .fr-logo { width: 40px; height: 40px; border-radius: 10px; background: #fff; border: 1.5px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; flex: none; }
      .fr-logo img { width: 26px; height: 26px; object-fit: contain; }
      .fr-logo .brand-fb { width: 26px; height: 26px; font-size: 14px; background: transparent; }
      .fr-head h3 { font-family: var(--font-display); font-weight: 600; font-size: 17px; line-height: 1.2; margin: 0; color: var(--fg-1); }
      .fr-brand { font-size: 12px; color: var(--fg-3); }
      .fr-score { display: flex; align-items: center; gap: 10px; }
      .fr-score-num { font-family: var(--font-numeric); font-weight: 700; font-size: 24px; line-height: 1; color: var(--fg-1); min-width: 38px; }
      .fr-card.fr-win .fr-score-num { color: var(--kygo-green-dark); }
      .fr-score-bar { flex: 1; height: 8px; border-radius: 5px; background: var(--bg-raised); overflow: hidden; }
      .fr-score-bar span { display: block; height: 100%; border-radius: 5px; background: var(--kygo-green); }
      .fr-why { margin: 0; font-size: 13.5px; line-height: 1.55; color: var(--fg-2); }
      .fr-leads { display: flex; align-items: flex-start; gap: 8px; font-size: 12.5px; line-height: 1.45; color: var(--kygo-green-dark); font-weight: 600; }
      .fr-leads .ico { flex: none; width: 16px; height: 16px; border-radius: 5px; background: var(--kygo-green-light); display: inline-flex; align-items: center; justify-content: center; margin-top: 1px; }
      .fr-leads .ico svg { width: 11px; height: 11px; }
      .fr-leads-none { color: var(--fg-3); }
      .fr-leads-none .ico { background: var(--bg-raised); color: var(--fg-3); }
      .fr-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-subtle); }
      .fr-price { font-family: var(--font-display); font-weight: 700; font-size: 15px; color: var(--fg-1); }
      .fr-buy { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-body); font-size: 12.5px; font-weight: 600; color: var(--kygo-green-dark); }
      .fr-buy .ico { width: 13px; height: 13px; transition: transform .15s; }
      .fr-buy:hover .ico { transform: translateX(2px); }

      .fr-rest { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 6px 18px 14px; box-shadow: var(--shadow-md); }
      .fr-rest-head { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--fg-3); padding: 14px 0 10px; }
      .fr-row { display: grid; grid-template-columns: 30px 26px minmax(0,1fr) 34px; align-items: center; gap: 10px; padding: 9px 0; border-top: 1px solid var(--border-subtle); }
      @media (min-width: 560px) { .fr-row { grid-template-columns: 30px 26px minmax(0,1fr) 110px 34px; } }
      .fr-row-rank { font-family: var(--font-numeric); font-size: 12px; font-weight: 600; color: var(--fg-3); }
      .fr-row-logo { height: 22px; display: flex; align-items: center; justify-content: center; }
      .fr-row-logo img { width: 22px; height: 22px; object-fit: contain; display: block; }
      .fr-row-name { font-size: 13.5px; font-weight: 600; color: var(--fg-1); overflow-wrap: anywhere; }
      .fr-row-bar { display: none; height: 7px; border-radius: 4px; background: var(--bg-raised); overflow: hidden; }
      .fr-row-bar span { display: block; height: 100%; border-radius: 4px; background: var(--fg-3); }
      .fr-row-num { font-family: var(--font-numeric); font-size: 13px; font-weight: 600; color: var(--fg-2); text-align: right; }
      @media (min-width: 560px) { .fr-row-bar { display: block; } }

      /* Spec-table model picker */
      .modelpick-wrap { background: var(--bg-raised); border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 16px; margin-bottom: 16px; }
      .modelpick-head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
      .modelpick-label { font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); }
      .modelpick-count { font-size: 12.5px; color: var(--fg-3); font-weight: 500; }
      .modelpick { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
      @media (min-width: 560px) { .modelpick { grid-template-columns: repeat(3, 1fr); } }
      @media (min-width: 880px) { .modelpick { grid-template-columns: repeat(5, 1fr); } }
      .mp-tile { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 12px 8px; border-radius: 12px; border: 1.5px solid var(--border-subtle); background: #fff; cursor: pointer; transition: all .15s ease; text-align: center; }
      .mp-tile:hover { border-color: var(--kygo-green); }
      .mp-tile.on { border-color: var(--kygo-green); background: rgba(34,197,94,0.07); box-shadow: 0 2px 8px rgba(34,197,94,0.12); }
      .mp-tile.full { opacity: .45; cursor: not-allowed; }
      .mp-tile.full:hover { border-color: var(--border-subtle); }
      .mp-logo { height: 24px; display: flex; align-items: center; justify-content: center; }
      .mp-logo img { width: 24px; height: 24px; object-fit: contain; display: block; }
      .mp-logo .brand-fb { width: 24px; height: 24px; font-size: 13px; }
      .mp-name { font-family: var(--font-display); font-weight: 600; font-size: 12px; line-height: 1.25; color: var(--fg-1); }
      .mp-tile.on .mp-name { color: var(--kygo-green-dark); }
      .mp-price { font-family: var(--font-numeric); font-size: 11px; font-weight: 600; color: var(--fg-3); }

      /* Calculator: a wrapping segmented control for nine models, plus the
         PowerPlugs toggle */
      .seg.seg-wrap { flex-wrap: wrap; }
      .seg.seg-wrap button { flex: 1 1 30%; min-width: 96px; }
      .calc-toggle { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; padding: 12px 14px; border-radius: 10px; border: 1.5px solid var(--border-subtle); background: #fff; color: var(--fg-2); font-family: var(--font-body); font-size: 13px; font-weight: 500; line-height: 1.4; cursor: pointer; transition: all .15s ease; }
      .calc-toggle:hover { border-color: var(--kygo-green); }
      .calc-toggle.on { border-color: var(--kygo-green); background: rgba(34,197,94,0.06); color: var(--fg-1); }
      .calc-toggle-box { flex: none; width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid var(--border-subtle); background: #fff; display: inline-flex; align-items: center; justify-content: center; color: #fff; }
      .calc-toggle.on .calc-toggle-box { background: var(--kygo-green); border-color: var(--kygo-green); }
      .calc-toggle-box .ico { width: 12px; height: 12px; }
      .calc-row .who .brand-fb { width: 22px; height: 22px; background: rgba(255,255,255,0.12); color: #fff; }

      /* Validation cards go 4-up on wide screens */
      @media (min-width: 1000px) { .valid-grid { grid-template-columns: repeat(2, 1fr); } }
      .valid-ico .brand-fb { width: 28px; height: 28px; font-size: 15px; background: transparent; }

      /* Before-you-buy caveats */
      .caveats { display: grid; grid-template-columns: 1fr; gap: 14px; }
      @media (min-width: 880px) { .caveats { grid-template-columns: 1fr 1fr; align-items: start; } }
      .caveat { display: flex; gap: 16px; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 22px; box-shadow: var(--shadow-md); }
      @media (max-width: 600px) { .caveat { flex-direction: column; gap: 12px; } }
      .caveat-ico { flex: none; width: 40px; height: 40px; border-radius: 10px; background: var(--kygo-green-light); color: var(--kygo-green-dark); display: flex; align-items: center; justify-content: center; }
      .caveat-ico .ico { width: 21px; height: 21px; }
      .caveat-body { min-width: 0; }
      .caveat-body h3 { font-family: var(--font-display); font-weight: 600; font-size: 17px; line-height: 1.25; margin: 0 0 8px; color: var(--fg-1); }
      .caveat-body p { margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: var(--fg-2); }
      .caveat-src { font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.3px; color: var(--fg-3); padding-top: 10px; border-top: 1px solid var(--border-subtle); }

      /* Table: the brand-mark fallback inside header cells and buy buttons */
      .tbl thead th .head-prod .brand-fb { width: 22px; height: 22px; }
      .aff-btn .brand-fb { width: 18px; height: 18px; font-size: 10px; }

    `;
  }
}

if (!customElements.get('kygo-smart-ring-comparison')) {
  customElements.define('kygo-smart-ring-comparison', KygoSmartRingComparison);
}
