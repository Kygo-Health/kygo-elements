/**
 * Kygo Health — Oura Ring 5 vs Oura Ring 4 Comparison Tool
 * Tag: kygo-oura-5-vs-4
 * Head-to-head comparison of Oura Ring Gen 5 and Gen 4 — differences, upgrade advice,
 * peer-reviewed accuracy, and true 3-year cost with membership.
 *
 * Design system intentionally mirrors kygo-oura-ring-comparison.js (the sibling Oura tool)
 * so the two Oura pages read as one family: green + slate palette (no amber/yellow), clean
 * bordered cards with no per-card accent color, a dark navy Kygo CTA card, native <details>
 * FAQ, and the shared cost-calculator layout.
 *
 * NOTE (intentional deviations from the generic tool template, per build spec):
 *  - No runtime JSON-LD injection. Structured data is served from the Wix per-page SEO panel.
 *  - No __seo() hidden light-DOM block. Crawler text is handled by the Wix GEO static-text embed.
 *  - App CTAs use Tenjin deep links only (iOS + Android). No raw App Store / Play links and no
 *    android-signup beta modal (that waitlist is retired site-wide).
 */

class KygoOura5vs4 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._activeMetric = 'sleep';
    this._billing = 'yearly'; // 'yearly' | 'monthly'
    this._tier = 'base'; // 'base' ($399: Silver, Black) | 'premium' ($499: Gold, Stealth, Brushed Silver, Deep Rose)
    this._includeCase = false;
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
    this._setupAnimations();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Shared assets ──────────────────────────────────────────────────────
  get _logoUrl() { return 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png'; }
  get _ouraImg() { return 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png'; }
  get _appleImg() { return 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png'; }
  get _fitbitImg() { return 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png'; }
  get _garminImg() { return 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png'; }
  get _googleHealthImg() { return 'https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png'; }
  get _healthConnectImg() { return 'https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png'; }
  get _ring4Amazon() { return 'https://www.amazon.com/dp/B0D9WT1S2T?tag=kygohealthapp-20&th=1'; }
  get _ring5Amazon() { return 'https://www.amazon.com/dp/B0GRK1N94H?tag=kygohealthapp-20&th=1'; }

  // ── Data: difference table (Gen 5 vs Gen 4 ONLY) ───────────────────────
  // winner: 'ring5' | 'ring4' | null (tie / not a "win")
  get _diffRows() {
    return [
      { feature: 'Released', ring4: 'Oct 2024', ring5: 'May 28, 2026 (ships June 4)', winner: null },
      { feature: 'Launch price (hardware)', info: 'Before membership', ring4: '$349', ring5: '$399–499', winner: 'ring4' },
      { feature: 'Weight', info: 'Varies by size', ring4: '3.3–5.2 g', ring5: '2–2.6 g', winner: 'ring5' },
      { feature: 'Thickness', info: 'At thinnest point', ring4: '2.88 mm', ring5: '2.28 mm', winner: 'ring5' },
      { feature: 'Band width', ring4: '7.90 mm', ring5: '6.09 mm', winner: 'ring5' },
      { feature: 'Size range', info: 'US ring sizes', ring4: '4–15', ring5: '6–13 (launch)', winner: 'ring4' },
      { feature: 'Battery (claimed)', ring4: 'Up to 8 days (~6 observed)', ring5: '6–9 days', winner: 'ring5' },
      { feature: 'Charging case', info: 'Extends time between wall charges', ring4: 'None', ring5: 'Optional · $99 · ~1 month total', winner: 'ring5' },
      { feature: 'Signal pathways', info: 'More pathways = more redundancy', ring4: 'Up to 18 (Smart Sensing)', ring5: '12 ("stronger" per Oura)', winner: 'ring4' },
      { feature: 'Materials', info: 'Shell + finish', ring4: 'Titanium · DLC / PVD', ring5: 'Titanium · PVD', winner: null },
      { feature: 'Water resistance', ring4: '100 m', ring5: '100 m / IP68', winner: null },
      { feature: 'Membership required', info: 'For full features', ring4: 'Yes · $5.99/mo', ring5: 'Yes · $5.99/mo', winner: null },
      { feature: 'Independent accuracy data', info: 'Peer-reviewed, non-Oura', ring4: 'Yes (Dial 2025)', ring5: 'None yet', winner: 'ring4' }
    ];
  }

  // ── Data: should you upgrade cards ─────────────────────────────────────
  get _upgradeCards() {
    return [
      {
        icon: 'shield', who: 'Current Ring 4 owner', verdict: 'Don’t upgrade yet',
        body: 'Ring 5 is a form-factor refinement, not a new-metric leap. Every new software feature (Health Radar, Blood Pressure Signals, Advisor AI) rolls back to your Ring 4 with an active membership. Ring 5 has zero independent validation, drops from 18 signal pathways to 12, and shrinks the size range. If your Ring 4 fits and works, there’s little evidence-based reason to pay again.',
        tagLabel: 'Save your money'
      },
      {
        icon: 'arrowRight', who: 'Current Gen 3 owner', verdict: 'Upgrade — to the Ring 4',
        body: 'Gen 3 is discontinued and both newer rings are a real step up in sensor design. The Ring 4 is the safer buy: it’s $50–150 cheaper, independently validated (CCC 0.98 RHR, 0.99 HRV vs ECG), and keeps the wider 4–15 sizing. Choose Ring 5 over Ring 4 only if the smallest, lightest possible ring is your top priority.',
        tagLabel: 'Best value'
      },
      {
        icon: 'wallet', who: 'First-time buyer', verdict: 'Ring 4 for most people',
        body: 'The Ring 4 is cheaper (~$559 vs ~$609 over 3 years), fully validated, and fits fingers Ring 5 can’t (sizes 4–5, 14–15). Pick the Ring 5 if comfort and near-invisibility matter more than proven accuracy — it’s about 40% smaller and lighter (2–2.6 g vs 3.3–5.2 g) — and you’re comfortable being an early adopter of unvalidated hardware.',
        tagLabel: 'Start here'
      }
    ];
  }

  // ── Data: accuracy deep-dive ───────────────────────────────────────────
  get _accuracyMetrics() {
    return {
      sleep: {
        name: 'Sleep Staging',
        goldStandard: 'Polysomnography (PSG)',
        desc: 'How accurately the ring classifies Wake, Light, Deep, and REM against an in-lab sleep study.',
        ring4: { result: 'Inferred from Gen 3', detail: '76.3% overall 4-stage agreement; ~92–95% sleep/wake. Ring 4 shares the Gen 3/4 PPG pipeline, so validated Gen 3 figures are the best available.', studyId: 'robbins2024' },
        ring5: { result: 'Not tested', detail: 'No peer-reviewed sleep-staging study exists for Ring 5. Oura has published no independent sleep validation for the new hardware.' },
        insight: 'Since PSG inter-rater reliability is only ~80%, mid-70s 4-stage agreement is near the practical ceiling. Neither ring beats the other on any published sleep test — because Ring 5 has none.'
      },
      hr: {
        name: 'Heart Rate',
        goldStandard: 'ECG chest strap',
        desc: 'Overnight and resting heart-rate accuracy versus a medical ECG reference.',
        ring4: { result: 'CCC 0.98 · MAPE 1.94%', detail: 'Independently validated head-to-head vs ECG in Dial 2025 — the best resting-HR agreement of any ring tested, ahead of Gen 3, WHOOP 4.0, Garmin, and Polar.', studyId: 'dial2025' },
        ring5: { result: 'Inherited claim only', detail: 'The “99% HR accuracy” line on the Ring 5 store page traces to Kinnunen 2020, an Oura-authored paper on pre-Gen-3 hardware — not Ring 5. Oura’s internal study claims +24% workout HR, but it is not peer-reviewed.' },
        insight: 'Ring 4 is the only Oura ring with independent, current-hardware heart-rate validation. Treat every Ring 5 heart-rate number as a manufacturer claim until independent data lands.'
      },
      hrv: {
        name: 'Heart Rate Variability',
        goldStandard: 'ECG chest strap',
        desc: 'Nocturnal HRV — a core recovery and stress signal — measured against ECG.',
        ring4: { result: 'CCC 0.99 · MAPE 5.96%', detail: 'Near-perfect agreement with ECG in Dial 2025 (independent), edging out Gen 3 (CCC 0.97). This is the strongest evidence-backed reason to trust Ring 4 for recovery.', studyId: 'dial2025' },
        ring5: { result: 'Not tested', detail: 'Oura’s internal study claims +12% overnight HRV vs Ring 4, but the 60-percentage-point figure is not independently verified and Ring 5 has no published HRV validation.' },
        insight: 'For HRV, the validated ring is the Ring 4. Ring 5’s HRV improvement is plausible but unproven — exactly the kind of claim independent studies routinely trim.'
      },
      energy: {
        name: 'Energy Expenditure',
        goldStandard: 'Indirect calorimetry',
        desc: 'How well the ring estimates calories burned, especially during activity.',
        ring4: { result: 'Weak (all finger rings)', detail: 'Finger placement is poor for motion and active-calorie estimation; Oura, like every ring, should be treated as a trend indicator, not a precise calorie counter. No strong peer-reviewed EE validation exists for either generation.', studyId: null },
        ring5: { result: 'Not tested', detail: 'Ring 5’s smaller battery and accelerometer carry the same finger-placement limitation. No independent energy-expenditure study has been published.' },
        insight: 'Neither ring is a reliable calorie tracker. If active-energy accuracy matters to you, a wrist wearable or chest strap beats both rings regardless of generation.'
      }
    };
  }

  get _studies() {
    return {
      dial2025: { authors: 'Dial MB, et al.', year: 2025, title: 'Validation of nocturnal resting HR and HRV in consumer wearables', journal: 'Physiological Reports', n: '13 (536 nights)', independent: true },
      robbins2024: { authors: 'Robbins R, et al.', year: 2024, title: 'Accuracy of Three Commercial Wearable Devices for Sleep Tracking', journal: 'Sensors', n: 36, independent: false, funder: 'Oura' }
    };
  }

  // ── Data: 3-year cost ──────────────────────────────────────────────────
  get _costModel() {
    return {
      ring4: { name: 'Oura Ring 4', hardware: 349, caseCost: 0 },
      ring5: { name: 'Oura Ring 5', hardware: this._tier === 'premium' ? 499 : 399, caseCost: 99 }
    };
  }
  _membership3yr(billing) { return billing === 'monthly' ? 5.99 * 36 : 69.99 * 3; }

  // ── Data: FAQ (must match FAQPage JSON-LD word-for-word) ────────────────
  get _faqs() {
    return [
      {
        q: 'Is the Oura Ring 5 worth upgrading from the 4?',
        a: 'For most Ring 4 owners, not yet. The Ring 5 is a form-factor and signal-quality refinement — Oura’s claim is that it’s about 40% smaller (thinner and narrower), and it’s also lighter at 2–2.6 g versus the Ring 4’s 3.3–5.2 g, with a marginally longer battery — not a new-metric leap. Every new software feature rolls back to the Ring 4 with an active membership, the Ring 5 has no independent accuracy validation, its size range shrinks to 6–13, and its signal pathways drop from 18 to 12. If your Ring 4 fits and works, there is little evidence-based reason to pay again.'
      },
      {
        q: 'What’s new in the Oura Ring 5?',
        a: 'The headline change is size: the Ring 5 is the world’s smallest smart ring at 2–2.6 g and 2.28 mm thick — Oura says it’s roughly 40% smaller than the Ring 4, which is 3.3–5.2 g and 2.88 mm thick. It adds an optional $99 charging case that extends total time between wall charges to about a month, a 6–9 day battery, redesigned optics (LEDs rotated 180° with a larger photodiode), and a digital temperature sensor. Sensor signal pathways drop from 18 to 12, which Oura describes as fewer but individually stronger.'
      },
      {
        q: 'Does the Oura Ring 5 need a subscription?',
        a: 'Yes. Like every current Oura ring, the Ring 5 requires an Oura Membership ($5.99/month or $69.99/year) for full features. Without it, the app shows only your Sleep, Readiness, and Activity scores. Trends, detailed HRV, temperature deviations, Advisor AI, Health Radar, Blood Pressure Signals, and GLP-1 tools are all gated behind membership. That subscription is why the real 3-year cost of a Ring 5 is roughly $609 for a base finish — or about $709 for the $499 premium finishes — not $399.'
      },
      {
        q: 'Is the Oura Ring 5 more accurate than the Ring 4?',
        a: 'There is no peer-reviewed evidence that it is. The Ring 4 is the only Oura ring with an independent head-to-head validation study (Dial 2025), which measured CCC 0.98 for resting heart rate and 0.99 for HRV against an ECG chest strap. The Ring 5 has zero independent studies; Oura’s own internal testing claims about 12% better HRV and 24% better workout heart rate, but those numbers are not peer-reviewed. Until independent data arrives, the validated choice for accuracy is the Ring 4.'
      },
      {
        q: 'How much does the Oura Ring 5 cost over 3 years?',
        a: 'It depends on the finish. A base Ring 5 (Silver or Black, $399) runs about $609 over three years with the yearly membership: $399 for the hardware plus roughly $210 for three years of Oura Membership at $69.99/year. The four premium finishes (Gold, Stealth, Brushed Silver, Deep Rose) start at $499, which brings the three-year total to about $709. Paying membership monthly at $5.99 instead adds about $6, and the optional $99 charging case adds to either total. The Ring 4 works out to about $559 over the same period because its hardware is $50 cheaper. Subscription-free rivals like RingConn Gen 2 ($299) and Ultrahuman Ring Air ($349) avoid the membership entirely.'
      },
      {
        q: 'What sizes does the Oura Ring 5 come in?',
        a: 'At launch the Ring 5 covers US ring sizes 6 to 13. That is narrower than the Ring 4, which spans sizes 4 to 15. If you have very small or very large fingers, the Ring 4 is currently the only Oura ring that fits, so check your size before choosing the Ring 5.'
      },
      {
        q: 'Should a first-time buyer get the Ring 4 or Ring 5?',
        a: 'For most first-time buyers, the Ring 4 is the better pick: it is cheaper over three years, independently validated for heart rate and HRV, and fits the widest range of fingers. Choose the Ring 5 if all-day comfort and a nearly invisible ring matter more to you than proven accuracy — it is noticeably lighter and thinner — and you are comfortable buying hardware that has not yet been independently tested.'
      }
    ];
  }

  // ── Icons ──────────────────────────────────────────────────────────────
  _icon(k) {
    const map = {
      arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
      shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>',
      wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h16v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7"/><circle cx="17" cy="13" r="1.2"/></svg>',
      spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/></svg>',
      apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg>',
      android: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 10v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-2 0zm10 0v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-2 0zM5 17v3a1 1 0 1 0 2 0v-3H5zm12 0v3a1 1 0 1 0 2 0v-3h-2zm-9.5-9c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5H7.5zm.5 1h8a1 1 0 0 1 1 1v6H7v-6a1 1 0 0 1 1-1zM9 5.5a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zm6 0a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1z"/></svg>'
    };
    return `<span class="ico">${map[k] || ''}</span>`;
  }

  // ── Render helpers ─────────────────────────────────────────────────────
  _renderDiffTable() {
    const ouraImg = this._ouraImg;
    const cell = (val, win) => win ? `<span class="y">${val}</span>` : val;
    return `
      <table class="tbl">
        <thead>
          <tr>
            <th>Spec</th>
            <th><div class="head-prod"><img src="${ouraImg}" alt="" loading="lazy" /> <span>Oura Ring 4</span></div><span class="head-tag">Current · Validated</span></th>
            <th><div class="head-prod"><img src="${ouraImg}" alt="" loading="lazy" /> <span>Oura Ring 5</span></div><span class="head-tag">Newest · May 2026</span></th>
          </tr>
        </thead>
        <tbody>
          ${this._diffRows.map(r => `
            <tr>
              <td class="spec-name" data-label="Spec">${r.feature}${r.info ? `<div class="info">${r.info}</div>` : ''}</td>
              <td class="cell" data-label="Oura Ring 4">${cell(r.ring4, r.winner === 'ring4')}</td>
              <td class="cell" data-label="Oura Ring 5">${cell(r.ring5, r.winner === 'ring5')}</td>
            </tr>
          `).join('')}
          <tr class="aff-row">
            <td colspan="3">
              <div class="aff-row-inner">
                <a class="aff-btn" href="${this._ring4Amazon}" target="_blank" rel="noopener sponsored" data-track-label="oura-ring-4"><img src="${ouraImg}" alt="" /> Ring 4 on Amazon ${this._icon('arrowRight')}</a>
                <a class="aff-btn" href="${this._ring5Amazon}" target="_blank" rel="noopener sponsored" data-track-label="oura-ring-5"><img src="${ouraImg}" alt="" /> Ring 5 on Amazon ${this._icon('arrowRight')}</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="tbl-note">Green marks the generation that wins each row. Specs reflect Oura’s Ring 5 launch materials (May 2026) and the Ring 4. CCC scores of 0.97–0.99 are statistically equivalent in everyday use; Ring 5 has no independent validation, so its accuracy row is “none yet,” not a measured result.</p>
    `;
  }

  _renderUpgrade() {
    return this._upgradeCards.map(c => `
      <div class="bestfor">
        <div class="for-icon">${this._icon(c.icon)}</div>
        <h3>${c.who}</h3>
        <div class="pick">${c.verdict}</div>
        <p class="reason">${c.body}</p>
        <div class="footer-row"><span class="tag-chip">${c.tagLabel}</span></div>
      </div>
    `).join('');
  }

  _renderMetricTabs() {
    return Object.entries(this._accuracyMetrics).map(([k, m]) =>
      `<button data-metric="${k}" class="${k === this._activeMetric ? 'active' : ''}" role="tab" aria-selected="${k === this._activeMetric}">${m.name}</button>`
    ).join('');
  }

  _renderMetricPanel() {
    const m = this._accuracyMetrics[this._activeMetric];
    const study = m.ring4.studyId ? this._studies[m.ring4.studyId] : null;
    const badge = study
      ? `<span class="sbadge ${study.independent ? 'independent' : 'funded'}">${study.independent ? 'Independent' : (study.funder || 'Industry') + ' Funded'}</span><span class="scite">${study.authors} (${study.year}). <em>${study.journal}</em>${study.n ? `, n=${study.n}` : ''}.</span>`
      : '';
    return `
      <div class="acc-head">
        <h3>${m.name}</h3>
        <span class="acc-gold">Gold standard: ${m.goldStandard}</span>
      </div>
      <p class="acc-desc">${m.desc}</p>
      <div class="acc-cols">
        <div class="acc-col acc-col-ring4">
          <div class="acc-col-name">Oura Ring 4</div>
          <div class="acc-result">${m.ring4.result}</div>
          <p class="acc-detail">${m.ring4.detail}</p>
          ${badge ? `<div class="acc-study">${badge}</div>` : ''}
        </div>
        <div class="acc-col acc-col-ring5">
          <div class="acc-col-name">Oura Ring 5</div>
          <div class="acc-result acc-result-muted">${m.ring5.result}</div>
          <p class="acc-detail">${m.ring5.detail}</p>
        </div>
      </div>
      <div class="acc-insight">${m.insight}</div>
    `;
  }

  _renderCost() {
    const model = this._costModel;
    const mem = this._membership3yr(this._billing);
    const rows = ['ring4', 'ring5'].map(k => {
      const r = model[k];
      const caseAdd = (k === 'ring5' && this._includeCase) ? r.caseCost : 0;
      return { k, name: r.name, hardware: r.hardware, mem, caseAdd, total: r.hardware + mem + caseAdd };
    });
    const cheaper = rows[0].total <= rows[1].total ? rows[0].k : rows[1].k;
    const gap = Math.abs(rows[0].total - rows[1].total);
    const fmt = n => '$' + Math.round(n).toLocaleString();
    const ouraImg = this._ouraImg;
    return `
      <div class="calc-controls">
        <div class="calc-block">
          <div class="label"><span>Ring 5 finish</span></div>
          <div class="seg" data-seg="tier">
            <button data-tier="base" class="${this._tier === 'base' ? 'active' : ''}">Base <span class="px">$399 · Silver, Black</span></button>
            <button data-tier="premium" class="${this._tier === 'premium' ? 'active' : ''}">Premium <span class="px">$499 · Gold, Stealth, Rose…</span></button>
          </div>
        </div>
        <div class="calc-block">
          <div class="label"><span>Oura Membership billing</span></div>
          <div class="seg" data-seg="billing">
            <button data-val="yearly" class="${this._billing === 'yearly' ? 'active' : ''}">Yearly <span class="px">$69.99/yr</span></button>
            <button data-val="monthly" class="${this._billing === 'monthly' ? 'active' : ''}">Monthly <span class="px">$5.99/mo</span></button>
          </div>
        </div>
        <div class="calc-block">
          <div class="label"><span>Add-on</span></div>
          <label class="calc-check">
            <input type="checkbox" data-toggle="case" ${this._includeCase ? 'checked' : ''} />
            <span>Ring 5 charging case (+$99, optional)</span>
          </label>
        </div>
        <p class="calc-foot">Two of the six Ring 5 finishes (Silver, Black) launch at $399; the other four (Gold, Stealth, Brushed Silver, Deep Rose) are $499. The Oura Membership is required for trends, HRV detail, temperature, Advisor AI, Health Radar, and most insights on both rings. Hardware is a one-time cost; membership repeats every year. Subscription-free rivals RingConn Gen 2 ($299) and Ultrahuman Ring Air ($349) skip the membership entirely.</p>
      </div>
      <div class="calc-result">
        <h4>3-year total cost of ownership</h4>
        ${rows.map(r => `
          <div class="calc-row ${r.k === cheaper ? 'win' : ''}">
            <div class="who"><img src="${ouraImg}" alt="" />
              <div>${r.name}<span class="sub">${r.k === cheaper ? 'Lower 3-year cost' : 'Hardware + membership'}</span></div>
            </div>
            <div class="total">${fmt(r.total)}</div>
            <div class="breakdown">$${r.hardware} hardware + ${fmt(r.mem)} membership${r.caseAdd ? ` + $${r.caseAdd} case` : ''}</div>
          </div>
        `).join('')}
        <div class="calc-savings">The <strong>Ring 4</strong> costs <strong>${fmt(gap)} less</strong> over 3 years than the Ring 5 at this setup — and it’s the only Oura ring with independent accuracy validation. The Ring 5 buys you a smaller, lighter body, not proven data.</div>
        <a class="calc-amazon" href="${this._ring4Amazon}" target="_blank" rel="noopener sponsored" data-track-label="oura-ring-4">View Oura Ring 4 on Amazon ${this._icon('arrowRight')}</a>
      </div>
    `;
  }

  _renderFAQ() {
    return this._faqs.map(f => `
      <details>
        <summary>${f.q}</summary>
        <div class="body">${f.a}</div>
      </details>
    `).join('');
  }

  // ── Main render ────────────────────────────────────────────────────────
  // Related tools · Kygo standard module ────────────────────────────────
  // Exactly 3 cards: a near neighbour, a bridge between accuracy and
  // physiology, and one from another family. Never links this page to
  // itself, and never links the Food Scanner.

  _relatedTools() {
    return [
      {
        title: 'Oura Ring 5 vs 4 vs 3',
        blurb: 'Every spec across three Oura generations, peer-reviewed accuracy, and the real 3-year cost.',
        url: 'https://www.kygo.app/tools/oura-ring-comparison-tool',
        meta: 'Wearables · 3 generations',
        motif: { motif: 'rings', caption: 'Relative thickness', rings: [{ label: 'Gen 3' }, { label: 'Ring 4' }, { label: 'Ring 5' }] }
      },
      {
        title: 'Oura Ring vs RingConn',
        blurb: 'Five smart rings side by side, with the no-subscription cost math over three years.',
        url: 'https://www.kygo.app/tools/oura-vs-ringconn',
        meta: 'Wearables · 5 models',
        motif: { motif: 'versus', caption: 'Oura vs RingConn', versusA: 'Oura', versusB: 'RingConn', versus: [{ a: 88, b: 72 }, { a: 70, b: 84 }, { a: 82, b: 66 }] }
      },
      {
        title: 'Recovery Score Explorer',
        blurb: 'Compare readiness and recovery scores across 12 wearables, and see which are actually validated.',
        url: 'https://www.kygo.app/tools/recovery-score-explorer',
        meta: 'Recovery · 12 wearables',
        motif: { motif: 'ring', caption: 'Readiness score', ringValue: 72, ringNote: 'Validated' }
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
      { slug: 'oura-ring-stress-tracking-explained',
        title: 'Oura Ring Stress Tracking: How 3 Layers of Stress Data Actually Work (2026)',
        blurb: 'Oura is the only wearable that splits stress into three layers, including a 31-day cumulative scan built with university researchers.',
        cat: 'HRV & Recovery', min: 8, img: '273a63_10d7664086de4f1d8f3991f5ce7a60c5~mv2.png' }
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




  // Copy for the standard app CTA card. Headline carries one <span> for the
  // green phrase; everything else about the card is shared.
  _appCta() {
    return {
      slug: 'oura-ring-5-vs-4',
      headline: `Your ring tracks the data. <span>Kygo tells you what moves it.</span>`,
      sub: `A better ring won't tell you <em>why</em> you slept badly. Kygo connects your Oura data to what you actually eat and train.`
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
  _emailCta() {
    return { source: 'tool-oura-5-vs-4', variant: 'comparison' };
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
    const logoUrl = this._logoUrl;
    const ouraImg = this._ouraImg;

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <!-- Nav -->
      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" loading="lazy" />
            <span>Oura Ring 5 vs 4</span>
          </a>
          <div class="nav-cta-group">
            <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" class="nav-store-btn nav-store-ios" data-track-label="subnav-get-app-ios" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on the App Store"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg><span>iOS</span></a>
            <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" class="nav-store-btn nav-store-android" data-track-label="subnav-get-app-android" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on Google Play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg><span>Android</span></a>
          </div>
        </div>
      </header>

      <!-- Hero -->
      <section class="hero-light">
        <div class="hero-light-inner">
          <div class="hero-grid">
            <div class="hero-copy">
              <div class="hero-pill"><span class="dot"></span> RING 5 vs RING 4 · 2026</div>
              <h1>Oura Ring 5 vs Oura Ring 4 <span class="hl">(2026)</span></h1>
              <p class="hero-lede">The two-generation comparison, decided on the numbers: what actually changed, the peer-reviewed accuracy neither reviewer site has, and the real 3-year cost with membership. Just comparing Gen 5 and Gen 4 — <a class="hero-link" href="https://www.kygo.app/tools/oura-ring-comparison-tool" target="_self" rel="noopener">need Gen 3 too?</a></p>
            </div>
            <div class="hero-vis">
              <div class="hero-vis-head">
                <span class="hero-vis-title"><span class="hero-vis-dot"></span> Three years, both rings</span>
                <span class="hero-vis-tag">membership included</span>
              </div>
              <div class="hv-two">
                <div class="hv-col">
                  <span class="hv-label">Ring 5</span>
                  <span class="hv-val">$609</span>
                  <div class="hv-bar"><span class="hv-fill" style="width:100%"></span></div>
                  <span class="hv-cap">Smaller, unvalidated</span>
                </div>
                <div class="hv-col">
                  <span class="hv-label">Ring 4</span>
                  <span class="hv-val good">$559</span>
                  <div class="hv-bar"><span class="hv-fill good" style="width:92%"></span></div>
                  <span class="hv-cap good">Cheaper, validated</span>
                </div>
              </div>
              <span class="hv-foot">Base finish + 3 years of Oura Membership at $69.99/yr · premium finishes add $100</span>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">40<span class="unit">%</span></div><div class="lbl">Smaller than Ring 4 (Oura's claim)</div></div>
            <div class="hero-stat"><div class="num">2<span class="unit">g</span></div><div class="lbl">Ring 5 — world's smallest smart ring</div></div>
            <div class="hero-stat"><div class="num">$609</div><div class="lbl">Real 3-yr Ring 5 cost, base finish</div></div>
            <div class="hero-stat"><div class="num">0</div><div class="lbl">Independent Ring 5 validation studies</div></div>
          </div>
        </div>
      </section>

      <!-- Verdict (answer-first) -->
      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">The short answer</div>
            <h2>Is the Ring 5 worth it over the Ring 4? <span class="hl">For most people, no.</span></h2>
          </div>
          <p class="tldr-lead animate-on-scroll">The <strong>Oura Ring 5</strong> is smaller and lighter — Oura’s headline claim is about 40% smaller than the Ring 4, and it drops to 2–2.6 g (from 3.3–5.2 g) — with a longer battery and an optional charging case. But it costs more, shrinks the size range to 6–13, and has <strong>no independent accuracy validation</strong>. The Ring 4 stays the smarter buy for most people; upgrade only if comfort matters more than proven data.</p>
          <div class="gaps">
            <div class="gap animate-on-scroll">
              <h4>What Ring 5 gains</h4>
              <ul>
                <li><span class="num-tag">1</span><span><strong>Smaller and lighter.</strong> 2–2.6 g and 2.28 mm thick — Oura’s smallest ring, ~40% smaller than Ring 4 (down from 3.3–5.2 g).</span></li>
                <li><span class="num-tag">2</span><span><strong>Longer battery + case.</strong> 6–9 days claimed, plus an optional $99 charging case (~1 month between wall charges).</span></li>
                <li><span class="num-tag">3</span><span><strong>Refined optics.</strong> LEDs rotated 180° with a larger photodiode and a digital temperature sensor.</span></li>
              </ul>
            </div>
            <div class="gap animate-on-scroll">
              <h4>What Ring 5 gives up</h4>
              <ul>
                <li><span class="num-tag">1</span><span><strong>Proven accuracy.</strong> Zero independent studies; Ring 4 has the only peer-reviewed head-to-head (Dial 2025).</span></li>
                <li><span class="num-tag">2</span><span><strong>Fit + redundancy.</strong> Size range shrinks to 6–13, and signal pathways drop from 18 to 12.</span></li>
                <li><span class="num-tag">3</span><span><strong>Value.</strong> ~$50 more hardware and the same required membership push the 3-year cost to ~$609.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      ${this._renderAppCta()}


      <!-- Difference table -->
      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Side by side</div>
            <h2>Every difference, <span class="hl">organized.</span></h2>
            <p class="lede">Two generations, spec by spec. Swipe the table on mobile. Green marks the generation that wins each row.</p>
          </div>
          <div class="tbl-wrap animate-on-scroll">${this._renderDiffTable()}</div>
        </div>
      </section>
      ${this._renderEmailCta()}


      <!-- Early app CTA band -->


      <!-- Should you upgrade -->
      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Should you upgrade?</div>
            <h2>A direct verdict for <span class="hl">where you're starting from.</span></h2>
            <p class="lede">Three buyer profiles, decided on the evidence — not the marketing.</p>
          </div>
          <div class="bestfor-grid animate-on-scroll">${this._renderUpgrade()}</div>
        </div>
      </section>

      <!-- Accuracy deep-dive -->
      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">Accuracy</div>
            <h2>What the research <span class="hl">actually shows.</span></h2>
            <p class="lede">Reviewers publish spec sheets. We add the peer-reviewed validation — with every study’s funding flagged. See our full <a class="lede-link" href="https://www.kygo.app/tools/sleep-tracker-accuracy" target="_self" rel="noopener">sleep tracker accuracy comparison</a>.</p>
          </div>
          <div class="acc-wrap animate-on-scroll">
            <div class="acc-tabs" data-metric-tabs role="tablist">${this._renderMetricTabs()}</div>
            <div class="acc-panel" data-metric-panel>${this._renderMetricPanel()}</div>
          </div>
          <p class="acc-disclosure animate-on-scroll"><strong>Bias disclosure:</strong> The Ring 4 figures above come from Dial 2025, an independent study, and Robbins 2024, which was funded by Oura. Every Ring 5 accuracy claim currently originates from Oura’s own unpublished internal testing. No peer-reviewed study has tested Ring 5 hardware as of publication.</p>
        </div>
      </section>

      <!-- 3-year cost -->
      <section class="section bg-light">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">3-year cost</div>
            <h2>What you'll <span class="hl">actually spend.</span></h2>
            <p class="lede">Both rings need an Oura Membership for full features. Most comparisons quote sticker price only — here’s the real total to own each.</p>
          </div>
          <div class="calc animate-on-scroll" data-calc>${this._renderCost()}</div>
        </div>
      </section>

      <!-- Kygo app CTA -->

      <!-- Cross-link to three-way tool -->
      <section class="section bg-white">
        <div class="section-inner">
          <a class="blog-cta animate-on-scroll" href="https://www.kygo.app/tools/oura-ring-comparison-tool" target="_self" rel="noopener">
            <span class="blog-cta-tag">All 3 gens</span>
            <div class="blog-cta-body">
              <div class="blog-cta-kicker">Own a Gen 3, or weighing all three?</div>
              <div class="blog-cta-title">Compare all three generations <span class="yr">— Ring 5 vs 4 vs 3</span></div>
              <div class="blog-cta-sub">Full spec table, peer-reviewed accuracy, and a 3-year cost calculator across every current Oura generation.</div>
            </div>
            <span class="blog-cta-arrow">${this._icon('arrowRight')}</span>
          </a>
        </div>
      </section>

      <!-- FAQ -->
      ${this._renderRelatedTools('gray')}

      <section class="section bg-white">
        <div class="section-inner">
          <div class="section-head animate-on-scroll">
            <div class="kicker">FAQ</div>
            <h2>Oura Ring 5 vs 4, <span class="hl">answered.</span></h2>
            <p class="lede">The questions people actually search.</p>
          </div>
          <div class="faq animate-on-scroll">${this._renderFAQ()}</div>
        </div>
      </section>

      ${this._renderRelatedPosts('gray')}

      <!-- Footer -->
      <footer class="tool-footer">
        <div class="container">
          <a href="https://www.kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" loading="lazy" />
            <span>Kygo Health</span>
          </a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <div class="footer-links">
            <a href="https://www.kygo.app" target="_blank" rel="noopener">Kygo App</a>
            <a href="https://www.kygo.app/tools/oura-ring-comparison-tool" target="_self" rel="noopener">Ring 5 vs 4 vs 3</a>
            <a href="https://www.kygo.app/privacy-policy" target="_blank" rel="noopener">Privacy</a>
            <a href="https://www.kygo.app/terms-conditions" target="_blank" rel="noopener">Terms</a>
          </div>
          <p class="footer-disclaimer">Spec and pricing reflect Oura’s May 2026 Ring 5 launch materials and the Ring 4. Accuracy claims cite peer-reviewed research (Dial 2025, Robbins 2024) with funding disclosed. Ring 5 has no independent validation as of publication. Kygo is an informational tool, not medical advice.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, I earn from qualifying purchases.</p>
          <p class="footer-copyright">© ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  // ── Styles (mirrors kygo-oura-ring-comparison.js) ──────────────────────
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
      .animate-on-scroll.in { opacity: 1; transform: none; }
      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .kband-dot { animation: none; }
      }

      /* Nav */
      .nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.92); backdrop-filter: saturate(160%) blur(14px); -webkit-backdrop-filter: saturate(160%) blur(14px); border-bottom: 1px solid var(--border-subtle); }
      .nav-inner { max-width: 1200px; margin: 0 auto; padding: 14px 20px; display: flex; align-items: center; gap: 16px; }
      .nav-brand { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 700; font-size: 14px; letter-spacing: -0.01em; color: var(--fg-1); text-transform: uppercase; }
      .nav-brand img { width: 26px; height: 26px; }
      .nav-cta-group { margin-left: auto; display: inline-flex; align-items: center; gap: 8px; }
      .nav-cta-group .nav-store-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 8px; font-weight: 600; font-size: 13px; text-decoration: none; white-space: nowrap; line-height: 1; }
      .nav-cta-group .nav-store-btn svg { width: 15px; height: 15px; flex-shrink: 0; }
      .nav-cta-group .nav-store-ios { background: var(--kygo-green); color: #fff; }
      .nav-cta-group .nav-store-ios:hover { background: var(--kygo-green-dark); color: #fff; }
      .nav-cta-group .nav-store-android { background: #fff; color: var(--kygo-green-dark); border: 1.5px solid var(--border-subtle); }
      .nav-cta-group .nav-store-android:hover { border-color: var(--kygo-green); color: var(--kygo-green-dark); }
      @media (max-width: 360px) { .nav-cta-group .nav-store-btn span { display: none; } .nav-cta-group .nav-store-btn { padding: 8px 10px; } }
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
      @media (min-width: 880px) { .hero-light-inner { padding: 64px 24px 48px; } }
      .hero-copy { max-width: 760px; }
      .hero-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.10); color: var(--kygo-green-dark); padding: 6px 14px; border-radius: 999px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.5px; white-space: nowrap; }
      .hero-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kygo-green); flex: none; }
      .hero-light h1 { font-family: var(--font-display); font-weight: 700; color: var(--fg-1); font-size: clamp(30px, 5.5vw, 56px); line-height: 1.05; letter-spacing: -0.02em; margin: 18px 0 18px; }
      .hero-light h1 .hl { color: var(--kygo-green); }
      .hero-lede { font-size: clamp(15px, 1.6vw, 18px); line-height: 1.55; color: var(--fg-2); max-width: 68ch; margin: 0; }
      .hero-lede strong { color: var(--fg-1); font-weight: 600; }
      .hero-link { color: var(--kygo-green-dark); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
      .hero-link:hover { color: var(--kygo-green); }
      .hero-grid { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: center; margin-bottom: 32px; }
      @media (min-width: 880px) { .hero-grid { grid-template-columns: 1.15fr 1fr; gap: 48px; } .hero-light-inner { padding: 64px 24px 48px; } }
      .hero-vis { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 14px; background: linear-gradient(158deg, #ffffff 0%, #EEF2F7 100%); border: 1px solid var(--border-subtle); border-radius: 20px; padding: 18px 20px 20px; box-shadow: 0 16px 40px rgba(15,23,42,0.08); }
      .hero-vis::before { content: ''; position: absolute; top: -90px; right: -70px; width: 240px; height: 240px; background: radial-gradient(closest-side, rgba(34,197,94,0.16), transparent); pointer-events: none; }
      .hero-vis-head { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
      .hero-vis-title { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: var(--fg-3); }
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
      .hero-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; border-top: 1px solid var(--border-subtle); padding-top: 24px; margin-top: 32px; }
      @media (min-width: 720px) { .hero-stats { grid-template-columns: repeat(4, 1fr); gap: 24px; padding-top: 28px; } }
      .hero-stat .num { font-family: var(--font-display); font-weight: 700; font-size: clamp(30px, 4vw, 42px); line-height: 1; color: var(--kygo-green); letter-spacing: -0.02em; display: inline-flex; align-items: baseline; gap: 2px; }
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
      .lede { color: var(--fg-2); font-size: 16px; line-height: 1.55; max-width: 64ch; margin: 0; }
      .lede-link { color: var(--kygo-green-dark); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
      .lede-link:hover { color: var(--kygo-green); }

      /* Verdict lead + gaps */
      .tldr-lead { font-size: clamp(16px, 1.9vw, 19px); line-height: 1.6; color: var(--fg-2); max-width: 80ch; margin: 0 0 24px; }
      .tldr-lead strong { color: var(--fg-1); font-weight: 600; }
      .gaps { display: grid; grid-template-columns: 1fr; gap: 16px; }
      @media (min-width: 720px) { .gaps { grid-template-columns: 1fr 1fr; } }
      .gap { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 22px; }
      .gap h4 { font-family: var(--font-display); font-weight: 600; font-size: 12px; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 14px; }
      .gap ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
      .gap li { display: grid; grid-template-columns: 28px 1fr; gap: 12px; font-size: 14px; line-height: 1.55; color: var(--fg-2); }
      .gap li .num-tag { font-family: var(--font-display); font-weight: 700; font-size: 13px; color: var(--kygo-green-dark); background: var(--kygo-green-light); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
      .gap li strong { color: var(--fg-1); font-weight: 600; }

      /* Difference table */
      .tbl-wrap { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .tbl-note { color: var(--fg-3); font-size: 12.5px; line-height: 1.55; margin: 0; padding: 14px 18px 16px; border-top: 1px solid var(--border-subtle); background: var(--bg-surface); }
      .tbl { width: 100%; border-collapse: collapse; font-family: var(--font-body); min-width: 560px; }
      .tbl thead th { text-align: left; padding: 16px 18px; font-family: var(--font-display); font-weight: 600; font-size: 13px; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.4px; background: var(--bg-raised); vertical-align: top; }
      .tbl thead th .head-prod { display: flex; align-items: center; gap: 10px; color: var(--fg-1); text-transform: none; letter-spacing: 0; font-size: 14px; }
      .tbl thead th .head-prod img { width: 22px; height: 22px; border-radius: 5px; background: #fff; padding: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); object-fit: contain; }
      .tbl thead th .head-tag { display: inline-block; margin-top: 5px; font-family: var(--font-body); font-size: 10px; font-weight: 600; color: var(--fg-3); text-transform: none; letter-spacing: 0; }
      .tbl tbody td { padding: 14px 18px; border-top: 1px solid var(--border-subtle); vertical-align: top; font-size: 14px; line-height: 1.5; color: var(--fg-2); }
      .tbl tbody tr:hover { background: var(--bg-raised); }
      .tbl .spec-name { font-weight: 600; color: var(--fg-1); width: 34%; }
      .tbl .spec-name .info { font-size: 12px; font-weight: 400; color: var(--fg-3); margin-top: 2px; line-height: 1.4; }
      .tbl .y { color: var(--kygo-green-dark); font-weight: 700; }
      .aff-row { display: none; }
      .aff-row-inner { display: flex; flex-direction: column; gap: 8px; }
      .aff-btn { display: inline-flex; align-items: center; gap: 8px; justify-content: center; padding: 11px 14px; border-radius: 10px; border: 1.5px solid var(--kygo-green-light); background: rgba(34,197,94,0.06); color: var(--kygo-green-dark); font-family: var(--font-body); font-weight: 600; font-size: 13px; transition: all .15s ease; }
      .aff-btn:hover { border-color: var(--kygo-green); background: rgba(34,197,94,0.1); }
      .aff-btn img { width: 18px; height: 18px; border-radius: 4px; background: #fff; padding: 2px; object-fit: contain; }
      .aff-btn .ico { width: 13px; height: 13px; }
      @media (max-width: 720px) {
        .tbl { min-width: 0; }
        .tbl thead { display: none; }
        .tbl tbody td { display: block; padding: 6px 16px; border-top: 0; }
        .tbl tbody tr { display: block; padding: 14px 0; border-top: 1px solid var(--border-subtle); }
        .tbl .spec-name { width: auto; padding-top: 14px; }
        .tbl tbody td.cell::before { content: attr(data-label); display: block; font-size: 10px; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; font-weight: 600; }
        .tbl tbody tr.aff-row { display: block; padding: 16px; background: var(--bg-surface); }
        .tbl tbody tr.aff-row td { display: block; padding: 0; }
      }

      /* Should-you-upgrade cards (bestfor pattern) */
      .bestfor-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
      @media (min-width: 720px) { .bestfor-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; } }
      .bestfor { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; padding: 22px; display: flex; flex-direction: column; gap: 12px; transition: all .25s var(--ease-out); }
      .bestfor:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); transform: translateY(-3px); }
      .bestfor .for-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--kygo-green-light); color: var(--kygo-green-dark); display: flex; align-items: center; justify-content: center; font-size: 20px; }
      .bestfor h3 { font-family: var(--font-display); font-weight: 600; font-size: 14px; margin: 0; color: var(--fg-2); }
      .bestfor .pick { font-family: var(--font-display); font-weight: 600; font-size: 22px; line-height: 1.15; color: var(--fg-1); margin: -4px 0 0; }
      .bestfor .reason { font-size: 14px; color: var(--fg-2); line-height: 1.55; margin: 0; }
      .bestfor .footer-row { display: flex; align-items: center; gap: 10px; margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border-subtle); }
      .bestfor .tag-chip { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: var(--kygo-green-dark); background: var(--kygo-green-light); padding: 5px 11px; border-radius: 999px; }

      /* Accuracy deep-dive */
      .acc-wrap { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; overflow: hidden; }
      .acc-tabs { display: flex; gap: 4px; padding: 12px; border-bottom: 1px solid var(--border-subtle); overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
      .acc-tabs::-webkit-scrollbar { display: none; }
      .acc-tabs button { font-family: var(--font-body); font-size: 13px; font-weight: 600; padding: 9px 14px; border-radius: 10px; border: 0; background: transparent; color: var(--fg-2); cursor: pointer; white-space: nowrap; transition: all .15s ease; }
      .acc-tabs button:hover { background: var(--bg-raised); color: var(--fg-1); }
      .acc-tabs button.active { background: var(--kygo-dark); color: #fff; }
      .acc-tabs button:focus-visible { outline: 2px solid var(--kygo-green); outline-offset: 2px; }
      .acc-panel { padding: 22px; }
      @media (min-width: 720px) { .acc-panel { padding: 28px; } }
      .acc-head { display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 6px; }
      .acc-head h3 { font-family: var(--font-display); font-weight: 600; font-size: 20px; margin: 0; }
      .acc-gold { font-size: 12px; color: var(--fg-3); background: var(--bg-raised); padding: 4px 10px; border-radius: 999px; }
      .acc-desc { font-size: 14px; color: var(--fg-2); line-height: 1.55; margin: 0 0 18px; }
      .acc-cols { display: grid; grid-template-columns: 1fr; gap: 14px; margin-bottom: 18px; }
      @media (min-width: 720px) { .acc-cols { grid-template-columns: 1fr 1fr; } }
      .acc-col { border: 1.5px solid var(--border-subtle); border-radius: 16px; padding: 18px; background: var(--bg-surface); }
      .acc-col-ring4 { border-color: var(--kygo-green-light); background: rgba(34,197,94,0.04); }
      .acc-col-name { font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--fg-1); margin-bottom: 6px; }
      .acc-result { font-family: var(--font-numeric); font-weight: 700; font-size: 20px; line-height: 1.1; color: var(--kygo-green-dark); margin-bottom: 8px; letter-spacing: -0.01em; }
      .acc-result-muted { color: var(--fg-3); }
      .acc-detail { font-size: 13px; color: var(--fg-2); line-height: 1.55; margin: 0; }
      .acc-study { display: flex; align-items: flex-start; gap: 8px; flex-wrap: wrap; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-subtle); }
      .sbadge { font-family: var(--font-display); font-size: 10px; font-weight: 700; letter-spacing: 0.3px; padding: 3px 8px; border-radius: 999px; white-space: nowrap; }
      .sbadge.independent { background: var(--kygo-green-light); color: var(--kygo-green-dark); }
      .sbadge.funded { background: var(--bg-raised); color: var(--fg-2); }
      .scite { font-size: 11.5px; color: var(--fg-3); line-height: 1.5; }
      .acc-insight { position: relative; padding: 14px 16px; border-radius: 12px; background: rgba(34,197,94,0.08); border: 1px solid var(--kygo-green-light); color: var(--fg-2); font-size: 13.5px; line-height: 1.6; }
      .acc-disclosure { margin: 16px 0 0; font-size: 12.5px; color: var(--fg-3); line-height: 1.6; max-width: 80ch; }
      .acc-disclosure strong { color: var(--fg-2); }

      /* Cost calculator */
      .calc { display: grid; grid-template-columns: 1fr; gap: 18px; align-items: stretch; }
      @media (min-width: 880px) { .calc { grid-template-columns: 1.1fr 1fr; gap: 24px; } }
      .calc-controls { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 20px; padding: 22px; display: flex; flex-direction: column; gap: 20px; }
      @media (min-width: 720px) { .calc-controls { padding: 28px; } }
      .calc-block { display: flex; flex-direction: column; gap: 10px; }
      .calc-block .label { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); }
      .seg { display: flex; gap: 4px; background: var(--bg-raised); padding: 4px; border-radius: 10px; }
      .seg button { flex: 1; font-family: var(--font-body); font-size: 13px; font-weight: 600; padding: 10px 10px; border-radius: 8px; border: 0; background: transparent; color: var(--fg-2); cursor: pointer; transition: all .15s; display: flex; flex-direction: column; align-items: center; gap: 2px; line-height: 1.2; }
      .seg button .px { font-size: 10px; color: var(--fg-3); font-weight: 500; }
      .seg button.active { background: #fff; color: var(--fg-1); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
      .seg button.active .px { color: var(--kygo-green-dark); }
      .calc-check { display: inline-flex; align-items: center; gap: 10px; font-size: 13.5px; color: var(--fg-2); cursor: pointer; padding: 12px 14px; border: 1.5px solid var(--border-subtle); border-radius: 10px; background: var(--bg-surface); }
      .calc-check input { width: 16px; height: 16px; accent-color: var(--kygo-green); cursor: pointer; flex: none; }
      .calc-foot { margin: 0; color: var(--fg-3); font-size: 12px; line-height: 1.5; }
      .calc-result { background: var(--kygo-dark); color: #fff; border-radius: 20px; padding: 22px; display: flex; flex-direction: column; gap: 16px; position: relative; overflow: hidden; }
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
      .calc-row.win .who .sub { color: #6EE7A0; }
      .calc-row .breakdown { grid-column: 1 / -1; color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 2px; line-height: 1.4; }
      .calc-savings { margin-top: auto; position: relative; padding: 12px 14px; border-radius: 12px; background: rgba(34,197,94,0.12); color: #6EE7A0; font-size: 13px; font-weight: 500; line-height: 1.5; }
      .calc-savings strong { color: #fff; }
      .calc-amazon { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 6px; align-self: flex-start; padding: 11px 18px; border-radius: 10px; background: var(--kygo-green); color: #fff; font-family: var(--font-body); font-weight: 600; font-size: 13px; text-decoration: none; transition: all .15s ease; }
      .calc-amazon:hover { background: var(--kygo-green-dark); transform: translateY(-1px); }
      .calc-amazon .ico { width: 14px; height: 14px; transition: transform .15s; }
      .calc-amazon:hover .ico { transform: translateX(2px); }

      /* Kygo CTA card (dark) */
      .kygo-cta-card { background: var(--kygo-dark); border-radius: 20px; padding: 40px 24px; position: relative; overflow: hidden; color: #fff; text-align: center; display: flex; flex-direction: column; align-items: center; }
      @media (min-width: 720px) { .kygo-cta-card { padding: 56px 40px; border-radius: 24px; } }
      .kygo-cta-card::before { content: ''; position: absolute; top: -160px; right: -160px; width: 520px; height: 520px; background: radial-gradient(closest-side, rgba(34,197,94,0.30), transparent); pointer-events: none; }
      .kygo-cta-card::after { content: ''; position: absolute; bottom: -180px; left: -180px; width: 480px; height: 480px; background: radial-gradient(closest-side, rgba(34,197,94,0.12), transparent); pointer-events: none; }
      .kygo-cta-card .cta-pill { position: relative; display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.16); color: #6EE7A0; padding: 6px 14px; border-radius: 999px; font-family: var(--font-display); font-size: 12px; font-weight: 600; border: 1px solid rgba(34,197,94,0.25); }
      .kygo-cta-card .cta-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kygo-green); box-shadow: 0 0 8px var(--kygo-green); }
      .kygo-cta-card h3 { position: relative; font-family: var(--font-display); font-weight: 600; color: #fff; font-size: clamp(26px, 4.5vw, 42px); line-height: 1.05; letter-spacing: -0.01em; margin: 18px 0 14px; max-width: 22ch; }
      .kygo-cta-card h3 span { color: var(--kygo-green); }
      .kygo-cta-card p { position: relative; color: rgba(255,255,255,0.72); font-size: clamp(14px, 1.6vw, 16px); line-height: 1.6; max-width: 56ch; margin: 0 auto 24px; }
      .kygo-cta-card p em { font-style: italic; color: #fff; }
      .kygo-cta-card .cta-btn-row { position: relative; display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; width: 100%; }
      @media (max-width: 560px) { .kygo-cta-card .cta-btn-row .btn-lg { width: 100%; justify-content: center; } }
      .kygo-cta-card .cta-fine { position: relative; margin: 16px 0 0; font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.72); }
      .kygo-cta-card .cta-works { position: relative; margin-top: 26px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: rgba(255,255,255,0.6); font-size: 13px; }
      .kygo-cta-card .cta-badges { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; justify-content: center; }
      .kygo-cta-card .cta-badges img { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); padding: 4px; object-fit: contain; }

      /* FAQ */
      .faq { display: flex; flex-direction: column; gap: 10px; max-width: 820px; }
      .faq details { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 14px; padding: 4px 20px; transition: border-color .2s; }
      .faq details[open] { border-color: var(--kygo-green); }
      .faq summary { list-style: none; padding: 16px 0; font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--fg-1); display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 14px; }
      .faq summary::-webkit-details-marker { display: none; }
      .faq summary::after { content: '+'; color: var(--kygo-green-dark); font-weight: 600; font-size: 22px; transition: transform .2s; line-height: 1; }
      .faq details[open] summary::after { content: '\\2212'; }
      .faq .body { padding: 0 0 16px; color: var(--fg-2); font-size: 14px; line-height: 1.65; }

      /* Blog / cross-link cards */
      .blog-cta { display: grid; grid-template-columns: auto 1fr auto; gap: 18px; align-items: center; background: linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(34,197,94,0.02) 100%); border: 1.5px solid var(--kygo-green-light); border-radius: 18px; padding: 22px; transition: all .25s var(--ease-out); color: var(--fg-1); }
      .blog-cta:hover { border-color: var(--kygo-green); box-shadow: var(--shadow-md); transform: translateY(-2px); }
      .blog-cta-tag { display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 999px; background: #fff; border: 1.5px solid var(--kygo-green-light); color: var(--kygo-green-dark); font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; white-space: nowrap; }
      .blog-cta-body { min-width: 0; }
      .blog-cta-kicker { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--kygo-green-dark); margin-bottom: 4px; }
      .blog-cta-title { font-family: var(--font-display); font-size: clamp(15px, 2vw, 18px); font-weight: 600; color: var(--fg-1); line-height: 1.3; }
      .blog-cta-title .yr { color: var(--fg-3); font-weight: 500; }
      .blog-cta-sub { font-size: 13px; color: var(--fg-2); margin-top: 4px; line-height: 1.5; }
      .blog-cta-arrow { width: 44px; height: 44px; border-radius: 50%; background: var(--kygo-green); color: #fff; display: inline-flex; align-items: center; justify-content: center; flex: none; box-shadow: 0 4px 12px rgba(34,197,94,0.30); }
      @media (max-width: 600px) {
        .blog-cta { grid-template-columns: 1fr auto; grid-template-areas: 'tag arrow' 'body body'; padding: 18px; gap: 14px; }
        .blog-cta-tag { grid-area: tag; justify-self: start; }
        .blog-cta-arrow { grid-area: arrow; width: 40px; height: 40px; }
        .blog-cta-body { grid-area: body; }
      }

      /* App CTA band */
      .kearly-section { padding: 48px 20px; }
      .kearly-section .section-inner { max-width: 1200px; margin: 0 auto; }
      .kband { max-width: 1100px; margin: 0 auto; }
      .kband-inner { position: relative; overflow: hidden; background: #fff; border: 2px solid #E2E8F0; border-radius: 20px; padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; gap: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
      .kband-glow { position: absolute; top: -120px; right: -80px; width: 360px; height: 360px; background: radial-gradient(circle, rgba(34,197,94,0.14), transparent 65%); pointer-events: none; }
      .kband-copy { position: relative; display: flex; flex-direction: column; gap: 10px; flex: 1 1 auto; min-width: 0; max-width: 640px; }
      .kband-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: var(--font-display); font-weight: 600; font-size: 12px; letter-spacing: 0.7px; text-transform: uppercase; color: var(--kygo-green-dark); }
      .kband-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--kygo-green); animation: kygoPulse 2s ease-out infinite; }
      .kband-headline { margin: 0; font-family: var(--font-display); font-weight: 600; font-size: clamp(18px, 2.4vw, 24px); line-height: 1.3; color: var(--fg-1); }
      .kband-actions { position: relative; display: flex; flex-direction: column; align-items: stretch; gap: 12px; flex: 0 0 auto; width: 300px; }
      .kband-actions .kband-btn { width: 100%; justify-content: center; }
      .kband-note { flex-basis: 100%; width: 100%; margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: var(--fg-2); text-align: center; }
      .kband-btn { display: inline-flex; align-items: center; gap: 9px; text-decoration: none; font-family: var(--font-display); font-weight: 600; font-size: 15px; padding: 15px 24px; border-radius: 12px; white-space: nowrap; transition: transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease; }
      .kband-btn svg { width: 17px; height: 17px; flex-shrink: 0; }
      .kband-btn-ios { background: var(--kygo-green); color: #fff; box-shadow: 0 6px 16px rgba(34,197,94,0.28); }
      .kband-btn-ios:hover { background: var(--kygo-green-dark); transform: translateY(-2px); box-shadow: 0 10px 20px rgba(34,197,94,0.3); }
      .kband-btn-android { background: #fff; color: var(--kygo-green-dark); border: 2px solid #E2E8F0; }
      .kband-btn-android:hover { border-color: var(--kygo-green); transform: translateY(-2px); }
      @keyframes kygoPulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.55); } 70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }
      @media (max-width: 720px) {
        .kband-inner { flex-direction: column; align-items: flex-start; gap: 22px; padding: 28px 24px; }
        .kband-actions { width: 100%; flex-direction: column; }
        .kband-btn { width: 100%; justify-content: center; }
      }

      /* Footer */
      .tool-footer { padding: 56px 20px 40px; background: var(--kygo-light); color: var(--fg-2); border-top: 1px solid var(--border-subtle); }
      .tool-footer .container { max-width: 720px; margin: 0 auto; text-align: center; }
      .footer-brand { display: inline-flex; align-items: center; gap: 10px; color: var(--fg-1); font-family: var(--font-display); font-weight: 700; font-size: 17px; }
      .footer-logo { width: 28px; height: 28px; }
      .footer-tagline { color: var(--fg-3); font-size: 14px; margin: 10px 0 22px; }
      .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 18px; margin-bottom: 28px; font-size: 14px; }
      .footer-links a { color: var(--fg-2); }
      .footer-links a:hover { color: var(--kygo-green-dark); }
      .footer-disclaimer { font-size: 12px; color: var(--fg-3); line-height: 1.6; max-width: 620px; margin: 0 auto 14px; }
      .footer-copyright { font-size: 12px; color: var(--fg-3); margin: 4px 0; }
      .footer-affiliate { font-style: italic; }
    `;
  }

  // ── Events ─────────────────────────────────────────────────────────────
  _bindEvents() {
    const root = this.shadowRoot;

    // Accuracy metric tabs
    const tabs = root.querySelector('[data-metric-tabs]');
    if (tabs) {
      tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-metric]');
        if (!btn || btn.dataset.metric === this._activeMetric) return;
        this._activeMetric = btn.dataset.metric;
        tabs.innerHTML = this._renderMetricTabs();
        root.querySelector('[data-metric-panel]').innerHTML = this._renderMetricPanel();
      });
    }

    // Cost calculator (billing seg + charging-case checkbox)
    const calc = root.querySelector('[data-calc]');
    if (calc) {
      calc.addEventListener('click', (e) => {
        const billBtn = e.target.closest('button[data-val]');
        if (billBtn) {
          if (billBtn.dataset.val === this._billing) return;
          this._billing = billBtn.dataset.val;
          calc.innerHTML = this._renderCost();
          return;
        }
        const tierBtn = e.target.closest('button[data-tier]');
        if (tierBtn) {
          if (tierBtn.dataset.tier === this._tier) return;
          this._tier = tierBtn.dataset.tier;
          calc.innerHTML = this._renderCost();
        }
      });
      calc.addEventListener('change', (e) => {
        if (e.target.matches('input[data-toggle="case"]')) {
          this._includeCase = e.target.checked;
          calc.innerHTML = this._renderCost();
        }
      });
    }
  }

  // ── Animations ─────────────────────────────────────────────────────────
  _setupAnimations() {
    const els = this.shadowRoot.querySelectorAll('.animate-on-scroll');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in'));
      return;
    }
    if (this._observer) this._observer.disconnect();
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); this._observer.unobserve(e.target); }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => this._observer.observe(el));
  }
}

if (!customElements.get('kygo-oura-5-vs-4')) {
  customElements.define('kygo-oura-5-vs-4', KygoOura5vs4);
}
