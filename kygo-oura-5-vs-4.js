/**
 * Kygo Health — Oura Ring 5 vs Oura Ring 4 Comparison Tool
 * Tag: kygo-oura-5-vs-4
 * Head-to-head comparison of Oura Ring Gen 5 and Gen 4 — differences, upgrade advice,
 * peer-reviewed accuracy, and true 3-year cost with membership.
 *
 * NOTE (intentional deviations from the generic tool template):
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
    this._expandedMetric = 'sleep';
    this._expandedFaq = new Set([0]);
    this._billing = 'yearly'; // 'yearly' | 'monthly'
    this._includeCase = false;
    this._eventsBound = false;
  }

  connectedCallback() {
    this.render();
    this._setupEventDelegation();
    this._setupAnimations();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  // ── Shared assets ──────────────────────────────────────────────────────
  get _logoUrl() { return 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png'; }
  get _ouraImg() { return 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png'; }
  get _ouraAmazon() { return 'https://www.amazon.com/s?k=Oura%20Ring&tag=kygohealthapp-20'; }

  get _rings() {
    return {
      ring5: { name: 'Oura Ring 5', short: 'Ring 5', color: '#B8935E', tag: 'Newest · May 2026' },
      ring4: { name: 'Oura Ring 4', short: 'Ring 4', color: '#64748B', tag: 'Current · Validated' }
    };
  }

  // ── Data: difference table (Gen 5 vs Gen 4 ONLY) ───────────────────────
  get _diffRows() {
    // winner: 'ring5' | 'ring4' | null (tie / not a "win")
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
        icon: 'ring', who: 'Current Ring 4 owner', verdict: 'Don’t upgrade yet',
        tone: 'hold',
        body: 'Ring 5 is a form-factor refinement, not a new-metric leap. Every new software feature (Health Radar, Blood Pressure Signals, Advisor AI) rolls back to your Ring 4 with an active membership. Ring 5 has zero independent validation, drops from 18 signal pathways to 12, and shrinks the size range. If your Ring 4 fits and works, there’s little evidence-based reason to pay again.'
      },
      {
        icon: 'refresh', who: 'Current Gen 3 owner', verdict: 'Upgrade — to the Ring 4',
        tone: 'consider',
        body: 'Gen 3 is discontinued and both newer rings are a real step up in sensor design. The Ring 4 is the safer buy: it’s $50–150 cheaper, independently validated (CCC 0.98 RHR, 0.99 HRV vs ECG), and keeps the wider 4–15 sizing. Choose Ring 5 over Ring 4 only if the smallest, lightest possible ring is your top priority.'
      },
      {
        icon: 'cart', who: 'First-time buyer', verdict: 'Ring 4 for most people',
        tone: 'buy',
        body: 'The Ring 4 is cheaper (~$559 vs ~$609 over 3 years), fully validated, and fits fingers Ring 5 can’t (sizes 4–5, 14–15). Pick the Ring 5 if comfort and near-invisibility matter more than proven accuracy — it’s 40% lighter — and you’re comfortable being an early adopter of unvalidated hardware.'
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
        ring5: { result: 'Inherited claim only', detail: 'The "99% HR accuracy" line on the Ring 5 store page traces to Kinnunen 2020, an Oura-authored paper on pre-Gen-3 hardware — not Ring 5. Oura’s internal study claims +24% workout HR, but it is not peer-reviewed.' },
        insight: 'Ring 4 is the only Oura ring with independent, current-hardware heart-rate validation. Treat every Ring 5 heart-rate number as a manufacturer claim until independent data lands.'
      },
      hrv: {
        name: 'Heart Rate Variability (HRV)',
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
      dial2025: { authors: 'Dial MB, et al.', year: 2025, title: 'Validation of nocturnal resting HR and HRV in consumer wearables', journal: 'Physiological Reports', n: '13 (536 nights)', independent: true, funder: null },
      robbins2024: { authors: 'Robbins R, et al.', year: 2024, title: 'Accuracy of Three Commercial Wearable Devices for Sleep Tracking', journal: 'Sensors', n: 36, independent: false, funder: 'Oura Ring Inc.' },
      kinnunen2020: { authors: 'Kinnunen H, et al.', year: 2020, title: 'Feasibility of the Oura ring for heart-rate estimation', journal: 'Physiological Measurement', n: 49, independent: false, funder: 'Oura (author-affiliated)' }
    };
  }

  // ── Data: 3-year cost ──────────────────────────────────────────────────
  get _costModel() {
    return {
      ring5: { name: 'Oura Ring 5', hardware: 399, caseCost: 99, color: '#B8935E' },
      ring4: { name: 'Oura Ring 4', hardware: 349, caseCost: 0, color: '#64748B' }
    };
  }
  // membership: yearly $69.99/yr, monthly $5.99/mo
  _membership3yr(billing) {
    return billing === 'monthly' ? 5.99 * 36 : 69.99 * 3;
  }

  // ── Data: FAQ (must match FAQPage JSON-LD word-for-word) ────────────────
  get _faqs() {
    return [
      {
        q: 'Is the Oura Ring 5 worth upgrading from the 4?',
        a: 'For most Ring 4 owners, not yet. The Ring 5 is a form-factor and signal-quality refinement — it’s about 40% lighter, slightly thinner, and has marginally longer battery — not a new-metric leap. Every new software feature rolls back to the Ring 4 with an active membership, the Ring 5 has no independent accuracy validation, its size range shrinks to 6–13, and its signal pathways drop from 18 to 12. If your Ring 4 fits and works, there is little evidence-based reason to pay again.'
      },
      {
        q: 'What’s new in the Oura Ring 5?',
        a: 'The headline change is size: the Ring 5 is the world’s smallest smart ring at 2–2.6 g and 2.28 mm thick, roughly 40% lighter than the Ring 4. It adds an optional $99 charging case that extends total time between wall charges to about a month, a 6–9 day battery, redesigned optics (LEDs rotated 180° with a larger photodiode), and a digital temperature sensor. Sensor signal pathways drop from 18 to 12, which Oura describes as fewer but individually stronger.'
      },
      {
        q: 'Does the Oura Ring 5 need a subscription?',
        a: 'Yes. Like every current Oura ring, the Ring 5 requires an Oura Membership ($5.99/month or $69.99/year) for full features. Without it, the app shows only your Sleep, Readiness, and Activity scores. Trends, detailed HRV, temperature deviations, Advisor AI, Health Radar, Blood Pressure Signals, and GLP-1 tools are all gated behind membership. That subscription is why the real 3-year cost of a Ring 5 is roughly $609, not $399.'
      },
      {
        q: 'Is the Oura Ring 5 more accurate than the Ring 4?',
        a: 'There is no peer-reviewed evidence that it is. The Ring 4 is the only Oura ring with an independent head-to-head validation study (Dial 2025), which measured CCC 0.98 for resting heart rate and 0.99 for HRV against an ECG chest strap. The Ring 5 has zero independent studies; Oura’s own internal testing claims about 12% better HRV and 24% better workout heart rate, but those numbers are not peer-reviewed. Until independent data arrives, the validated choice for accuracy is the Ring 4.'
      },
      {
        q: 'How much does the Oura Ring 5 cost over 3 years?',
        a: 'About $609 with the yearly membership: $399 for the hardware plus roughly $210 for three years of Oura Membership at $69.99/year. Paying membership monthly at $5.99 pushes the three-year total closer to $615, and the optional $99 charging case adds to that. The Ring 4 works out to about $559 over the same period because its hardware is $50 cheaper. Subscription-free rivals like RingConn Gen 2 ($299) and Ultrahuman Ring Air ($349) avoid the membership entirely.'
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
  _icon(name) {
    const map = {
      ring: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="6"/><path d="M9 8l1-4h4l1 4"/></svg>',
      refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>',
      cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.4 12.4a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L22 7H6"/></svg>',
      scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M7 7h10M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/></svg>',
      spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/></svg>',
      arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>'
    };
    return map[name] || '';
  }

  // ── Render helpers ─────────────────────────────────────────────────────
  _renderCostTable() {
    const m = this._costModel;
    const mem = this._membership3yr(this._billing);
    const rows = ['ring4', 'ring5'].map(k => {
      const r = m[k];
      const caseAdd = (k === 'ring5' && this._includeCase) ? r.caseCost : 0;
      const total = r.hardware + mem + caseAdd;
      return { k, name: r.name, color: r.color, hardware: r.hardware, mem, caseAdd, total };
    });
    const cheaper = rows[0].total <= rows[1].total ? rows[0] : rows[1];
    return `
      <div class="cost-controls">
        <div class="cost-toggle" role="tablist" aria-label="Membership billing">
          <button class="cost-opt ${this._billing === 'yearly' ? 'active' : ''}" data-billing="yearly" role="tab" aria-selected="${this._billing === 'yearly'}">Yearly · $69.99/yr</button>
          <button class="cost-opt ${this._billing === 'monthly' ? 'active' : ''}" data-billing="monthly" role="tab" aria-selected="${this._billing === 'monthly'}">Monthly · $5.99/mo</button>
        </div>
        <label class="cost-check">
          <input type="checkbox" data-toggle="case" ${this._includeCase ? 'checked' : ''} />
          <span>Add Ring 5 charging case (+$99)</span>
        </label>
      </div>
      <div class="cost-cards">
        ${rows.map(r => `
          <div class="cost-card ${r === cheaper ? 'cost-best' : ''}" style="--accent:${r.color}">
            ${r === cheaper ? '<span class="cost-badge">Lower 3-yr cost</span>' : ''}
            <h3>${r.name}</h3>
            <div class="cost-total">$${r.total.toFixed(0)}<span>over 3 years</span></div>
            <ul class="cost-lines">
              <li><span>Hardware</span><span>$${r.hardware}</span></li>
              <li><span>Membership (3 yr)</span><span>$${r.mem.toFixed(0)}</span></li>
              ${r.caseAdd ? `<li><span>Charging case</span><span>$${r.caseAdd}</span></li>` : ''}
            </ul>
          </div>
        `).join('')}
      </div>
      <p class="cost-note">Sticker price hides the biggest number. Subscription-free rings — <strong>RingConn Gen 2 ($299)</strong> and <strong>Ultrahuman Ring Air ($349)</strong> — skip the ~$210 membership entirely if you only want sleep and HRV.</p>
    `;
  }

  _renderStudyLine(studyId) {
    if (!studyId) return '';
    const s = this._studies[studyId];
    if (!s) return '';
    return `<div class="metric-study">
      <span class="study-badge ${s.independent ? 'independent' : 'funded'}">${s.independent ? 'Independent' : (s.funder ? s.funder.replace(/ Ring Inc\.$/, '').replace(/ Inc\.$/, '') + ' Funded' : 'Funded')}</span>
      <span class="study-cite">${s.authors} (${s.year}). ${s.title}. <em>${s.journal}</em>${s.n ? `, n=${s.n}` : ''}.</span>
    </div>`;
  }

  _renderMetricPanel() {
    const key = this._expandedMetric;
    const m = this._accuracyMetrics[key];
    const rings = this._rings;
    return `
      <div class="metric-head">
        <h3>${m.name}</h3>
        <span class="metric-gold">Gold standard: ${m.goldStandard}</span>
      </div>
      <p class="metric-desc">${m.desc}</p>
      <div class="metric-cols">
        <div class="metric-col" style="--accent:${rings.ring4.color}">
          <div class="metric-col-name">${rings.ring4.name}</div>
          <div class="metric-result">${m.ring4.result}</div>
          <p class="metric-detail">${m.ring4.detail}</p>
          ${this._renderStudyLine(m.ring4.studyId)}
        </div>
        <div class="metric-col" style="--accent:${rings.ring5.color}">
          <div class="metric-col-name">${rings.ring5.name}</div>
          <div class="metric-result metric-result-muted">${m.ring5.result}</div>
          <p class="metric-detail">${m.ring5.detail}</p>
        </div>
      </div>
      <div class="metric-insight">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <p>${m.insight}</p>
      </div>
    `;
  }

  // ── Surgical updates ───────────────────────────────────────────────────
  _updateMetricPanel() {
    const shadow = this.shadowRoot;
    const panel = shadow.querySelector('.metric-panel');
    const tabs = shadow.querySelectorAll('.metric-tab');
    if (panel) panel.innerHTML = this._renderMetricPanel();
    tabs.forEach(t => {
      const on = t.dataset.metric === this._expandedMetric;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  _updateCost() {
    const shadow = this.shadowRoot;
    const wrap = shadow.querySelector('.cost-wrap');
    if (wrap) wrap.innerHTML = this._renderCostTable();
  }

  // ── Main render ────────────────────────────────────────────────────────
  render() {
    const logoUrl = this._logoUrl;
    const ouraImg = this._ouraImg;
    const rings = this._rings;

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>

      <!-- Header -->
      <header class="header">
        <div class="header-inner">
          <a href="https://www.kygo.app" class="logo" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo" class="logo-img" loading="lazy" />
            Oura Ring 5 vs 4
          </a>
          <div class="nav-cta-group">
            <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" class="nav-store-btn nav-store-ios" data-track-label="subnav-get-app-ios" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on the App Store"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 13.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C7.2 7.7 5.5 8.7 4.6 10.3 2.8 13.5 4.1 18.2 5.9 20.8c.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.9-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4zM15.2 5.4c.7-.9 1.2-2.1 1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.5 3.1-1.4z"/></svg><span>iOS</span></a>
            <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" class="nav-store-btn nav-store-android" data-track-label="subnav-get-app-android" data-track-position="subnav" target="_blank" rel="noopener" aria-label="Download Kygo on Google Play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg><span>Android</span></a>
          </div>
        </div>
      </header>

      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge animate-on-scroll">RING 5 vs RING 4 · 2026</div>
          <h1 class="animate-on-scroll">Oura Ring 5 vs Oura Ring 4</h1>
          <p class="hero-sub animate-on-scroll">The two-generation comparison, decided on the numbers: what actually changed, the peer-reviewed accuracy neither reviewer site has, and the real 3-year cost with membership. Just comparing Gen 5 and Gen 4 — <a href="https://www.kygo.app/tools/oura-ring-comparison-tool" class="inline-link">need Gen 3 too?</a></p>
        </div>
      </section>

      <!-- Verdict (answer-first) -->
      <section class="verdict">
        <div class="container">
          <div class="verdict-box animate-on-scroll">
            <span class="verdict-tag">The short answer</span>
            <p class="verdict-lead">The Oura Ring 5 is smaller and lighter — about 40% lighter than the Ring 4 — with a longer battery and an optional charging case. But it costs more, shrinks the size range to 6–13, and has <strong>no independent accuracy validation</strong>. The Ring 4 stays the smarter buy for most people; upgrade only if comfort matters more than proven data.</p>
            <div class="verdict-chips">
              <span class="verdict-chip chip-5">Ring 5: smallest &amp; lightest</span>
              <span class="verdict-chip chip-4">Ring 4: validated &amp; cheaper</span>
              <span class="verdict-chip chip-neutral">Software features: identical (both need membership)</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Difference Table -->
      <section class="diff">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Every Difference, Side by Side</h2>
          <p class="section-sub animate-on-scroll">Swipe the table on mobile. Green marks the generation that wins each row.</p>
          <div class="diff-scroll animate-on-scroll">
            <table class="diff-table">
              <thead>
                <tr>
                  <th class="diff-feature-h">Feature</th>
                  <th style="--accent:${rings.ring4.color}"><img src="${ouraImg}" alt="Oura Ring 4" loading="lazy" /><span>${rings.ring4.name}</span><small>${rings.ring4.tag}</small></th>
                  <th style="--accent:${rings.ring5.color}"><img src="${ouraImg}" alt="Oura Ring 5" loading="lazy" /><span>${rings.ring5.name}</span><small>${rings.ring5.tag}</small></th>
                </tr>
              </thead>
              <tbody>
                ${this._diffRows.map(r => `
                  <tr>
                    <td class="diff-feature">${r.feature}${r.info ? `<span class="diff-info">${r.info}</span>` : ''}</td>
                    <td class="${r.winner === 'ring4' ? 'diff-win' : ''}">${r.ring4}</td>
                    <td class="${r.winner === 'ring5' ? 'diff-win' : ''}">${r.ring5}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Should you upgrade -->
      <section class="upgrade">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Should You Upgrade?</h2>
          <p class="section-sub animate-on-scroll">A direct verdict for where you’re starting from.</p>
          <div class="upgrade-grid">
            ${this._upgradeCards.map((c, i) => `
              <div class="upgrade-card upgrade-${c.tone} animate-on-scroll" style="--delay:${i * 100}ms">
                <div class="upgrade-icon">${this._icon(c.icon)}</div>
                <div class="upgrade-who">${c.who}</div>
                <div class="upgrade-verdict">${c.verdict}</div>
                <p class="upgrade-body">${c.body}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Accuracy deep-dive -->
      <section class="accuracy">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Accuracy: What the Research Actually Shows</h2>
          <p class="section-sub animate-on-scroll">Reviewers publish spec sheets. We add the peer-reviewed validation — with every study’s funding flagged. See our full <a href="https://www.kygo.app/tools/sleep-tracker-accuracy" class="inline-link">sleep tracker accuracy comparison</a>.</p>
          <div class="metric-tabs animate-on-scroll" role="tablist" aria-label="Accuracy metric">
            ${Object.entries(this._accuracyMetrics).map(([k, m]) => `
              <button class="metric-tab ${k === this._expandedMetric ? 'active' : ''}" data-metric="${k}" role="tab" aria-selected="${k === this._expandedMetric ? 'true' : 'false'}" tabindex="0">${m.name}</button>
            `).join('')}
          </div>
          <div class="metric-panel animate-on-scroll">${this._renderMetricPanel()}</div>
          <div class="accuracy-disclosure animate-on-scroll">
            <strong>Bias disclosure:</strong> The Ring 4 figures above come from Dial 2025, an independent study, and Robbins 2024, which was funded by Oura. Every Ring 5 accuracy claim currently originates from Oura’s own unpublished internal testing. No peer-reviewed study has tested Ring 5 hardware as of this writing.
          </div>
        </div>
      </section>

      <!-- Blog CTA -->
      <section class="blog-cta-section">
        <div class="container">
          <div class="blog-cta animate-on-scroll">
            <div class="blog-cta-badge">
              <div class="blog-cta-badge-dot"></div>
              <span>Free Forever Plan</span>
            </div>
            <div class="blog-cta-headline">Whichever ring you wear, see how your food moves your <span class="highlight">sleep, HRV, and recovery</span></div>
            <p class="blog-cta-sub">Kygo connects your Oura data to what you actually eat and train — so you can tell which numbers are genuinely predictive for your body.</p>
            <div class="blog-cta-actions">
              <div class="blog-cta-buttons">
                <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" target="_blank" rel="noopener" class="blog-cta-btn" data-track-position="early" data-track-label="oura-5-vs-4-early-ios">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Try Free for 7 Days
                </a>
                <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" target="_blank" rel="noopener" class="cta-android" data-track-position="early" data-track-label="oura-5-vs-4-early-android">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                  Download for Android
                </a>
              </div>
              <span class="blog-cta-meta">7-day free trial on yearly. Free plan available. Cancel anytime.</span>
            </div>
            <div class="blog-cta-devices">
              <span class="blog-cta-devices-label">Works with</span>
              <div class="blog-cta-device-tags">
                <span class="blog-cta-device-tag"><img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura" loading="lazy">Oura</span>
                <span class="blog-cta-device-tag"><img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple" loading="lazy">Apple</span>
                <span class="blog-cta-device-tag"><img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit" loading="lazy">Fitbit</span>
                <span class="blog-cta-device-tag"><img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin" loading="lazy">Garmin</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <kygo-inline-subscribe source="tool-oura-5-vs-4" variant="comparison"></kygo-inline-subscribe>

      <!-- 3-year cost -->
      <section class="cost">
        <div class="container">
          <h2 class="section-title animate-on-scroll">The Real 3-Year Cost (With Membership)</h2>
          <p class="section-sub animate-on-scroll">Both rings need an Oura Membership for full features. Here’s what each actually costs to own.</p>
          <div class="cost-wrap animate-on-scroll">${this._renderCostTable()}</div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="faq">
        <div class="container">
          <h2 class="section-title animate-on-scroll">Oura Ring 5 vs 4: FAQ</h2>
          <p class="section-sub animate-on-scroll">The questions people actually search.</p>
          <div class="faq-list animate-on-scroll">
            ${this._faqs.map((f, i) => `
              <div class="faq-item ${this._expandedFaq.has(i) ? 'open' : ''}" data-faq="${i}">
                <div class="faq-q" role="button" tabindex="0" aria-expanded="${this._expandedFaq.has(i) ? 'true' : 'false'}">
                  <span>${f.q}</span>
                  <span class="faq-toggle"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></span>
                </div>
                <div class="faq-a"><p>${f.a}</p></div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Cross-link to three-way tool -->
      <section class="crosslink">
        <div class="container">
          <a class="crosslink-card animate-on-scroll" href="https://www.kygo.app/tools/oura-ring-comparison-tool" target="_self" rel="noopener">
            <div class="crosslink-copy">
              <span class="crosslink-eyebrow">Own a Gen 3, or weighing all three?</span>
              <span class="crosslink-title">Compare all three generations</span>
              <span class="crosslink-sub">Oura Ring 5 vs 4 vs 3 — full spec, accuracy, and cost breakdown.</span>
            </div>
            <span class="crosslink-arrow">${this._icon('arrow')}</span>
          </a>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-box animate-on-scroll">
            <div class="cta-box-content">
              <div class="cta-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
              <h2>A better ring won’t tell you why you slept badly. Kygo will.</h2>
              <p>Connect your Oura Ring to Kygo and see which foods and habits actually move your sleep, HRV, and recovery — no guessing.</p>
              <div class="cta-buttons">
                <a href="https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy" class="cta-btn-white" target="_blank" rel="noopener" data-track-position="footer-cta" data-track-label="oura-5-vs-4-footer-ios">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </a>
                <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" target="_blank" rel="noopener" class="cta-android" data-track-position="footer-cta" data-track-label="oura-5-vs-4-footer-android">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                  Download for Android
                </a>
              </div>
              <p class="cta-fineprint">7-day free trial on yearly. Free plan available. Cancel anytime.</p>
              <div class="cta-features">
                <span class="cta-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Free forever plan</span>
                <span class="cta-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Syncs with Oura + 4 more</span>
                <span class="cta-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> AI food logging</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="tool-footer">
        <div class="container">
          <a href="https://www.kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="${logoUrl}" alt="Kygo Health" class="footer-logo" loading="lazy" />
            Kygo Health
          </a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <div class="footer-links">
            <a href="https://www.kygo.app" target="_blank" rel="noopener">Kygo App</a>
            <a href="https://www.kygo.app/tools/oura-ring-comparison-tool" target="_self" rel="noopener">Ring 5 vs 4 vs 3</a>
            <a href="https://www.kygo.app/privacy-policy" target="_blank" rel="noopener">Privacy</a>
            <a href="https://www.kygo.app/terms-conditions" target="_blank" rel="noopener">Terms</a>
          </div>
          <p class="footer-copyright">Spec and pricing reflect Oura’s May 2026 Ring 5 launch materials and the Ring 4. Accuracy claims cite peer-reviewed research (Dial 2025, Robbins 2024) with full funding disclosure. Ring 5 has no independent validation as of publication.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, I earn from qualifying purchases.</p>
          <p class="footer-copyright">© ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  // ── Styles ─────────────────────────────────────────────────────────────
  _styles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
      :host {
        --dark: #1E293B;
        --dark-card: #0F172A;
        --light: #F8FAFC;
        --green: #22C55E;
        --green-dark: #16A34A;
        --green-light: rgba(34,197,94,0.1);
        --yellow: #FBBF24;
        --red: #EF4444;
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
        -moz-osx-font-smoothing: grayscale;
      }
      *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
      h1, h2, h3, h4 { font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 600; line-height: 1.2; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
      .inline-link { color: var(--green-dark); text-decoration: underline; text-underline-offset: 2px; font-weight: 600; }
      .inline-link:hover { color: var(--green); }

      /* Header */
      .header { background: #fff; border-bottom: 1px solid var(--gray-200); padding: 12px 16px; position: sticky; top: 0; z-index: 50; }
      .header-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
      .logo { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; color: var(--dark); text-decoration: none; }
      .logo-img { height: 28px; width: auto; }
      .nav-cta-group { margin-left: auto; display: inline-flex; align-items: center; gap: 8px; }
      .nav-store-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 8px; font-weight: 600; font-size: 13px; text-decoration: none; white-space: nowrap; line-height: 1; }
      .nav-store-btn svg { width: 15px; height: 15px; flex-shrink: 0; }
      .nav-store-ios { background: var(--green); color: #fff; }
      .nav-store-ios:hover { background: var(--green-dark); }
      .nav-store-android { background: #fff; color: var(--green-dark); border: 1.5px solid var(--gray-200); }
      .nav-store-android:hover { border-color: var(--green); }
      @media (max-width: 360px) { .nav-store-btn span { display: none; } .nav-store-btn { padding: 8px 10px; } }

      /* Animations */
      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: var(--delay, 0ms); }
      .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

      /* Hero */
      .hero { padding: 44px 0 32px; text-align: center; }
      .hero-badge { display: inline-block; padding: 8px 16px; border-radius: 50px; background: var(--green-light); color: var(--green-dark); font-size: 12px; font-weight: 700; letter-spacing: 1px; margin-bottom: 16px; }
      .hero h1 { font-size: clamp(28px, 6vw, 42px); margin-bottom: 16px; color: var(--dark); }
      .hero-sub { font-size: clamp(15px, 4vw, 18px); color: var(--gray-600); max-width: 660px; margin: 0 auto; line-height: 1.7; }

      /* Section titles */
      .section-title { font-size: clamp(24px, 6vw, 34px); text-align: center; margin-bottom: 8px; }
      .section-sub { font-size: clamp(14px, 4vw, 16px); color: var(--gray-600); text-align: center; margin: 0 auto 28px; max-width: 620px; }

      /* Verdict */
      .verdict { padding: 8px 0 8px; }
      .verdict-box { max-width: 840px; margin: 0 auto; background: #fff; border: 1px solid var(--gray-200); border-left: 5px solid var(--green); border-radius: var(--radius); padding: 24px 22px; box-shadow: var(--shadow); }
      .verdict-tag { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--green-dark); margin-bottom: 10px; }
      .verdict-lead { font-size: clamp(16px, 4.4vw, 19px); line-height: 1.6; color: var(--dark); }
      .verdict-lead strong { color: var(--green-dark); }
      .verdict-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
      .verdict-chip { font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 50px; }
      .chip-5 { background: rgba(184,147,94,0.12); color: #8a6d3f; }
      .chip-4 { background: rgba(100,116,139,0.14); color: #475569; }
      .chip-neutral { background: var(--gray-100); color: var(--gray-600); }

      /* Difference table */
      .diff { padding: 44px 0; background: #fff; }
      .diff-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1px solid var(--gray-200); border-radius: var(--radius); box-shadow: var(--shadow); }
      .diff-scroll::-webkit-scrollbar { height: 8px; }
      .diff-scroll::-webkit-scrollbar-thumb { background: var(--gray-300); border-radius: 4px; }
      .diff-table { width: 100%; border-collapse: collapse; min-width: 560px; }
      .diff-table th, .diff-table td { padding: 12px 14px; text-align: left; font-size: 13px; border-bottom: 1px solid var(--gray-100); vertical-align: top; }
      .diff-table thead th { position: sticky; top: 0; background: var(--gray-50); border-bottom: 2px solid var(--gray-200); text-align: center; }
      .diff-table thead th img { width: 26px; height: 26px; object-fit: contain; display: block; margin: 0 auto 4px; }
      .diff-table thead th span { display: block; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14px; color: var(--accent); }
      .diff-table thead th small { display: block; font-size: 10px; color: var(--gray-400); font-weight: 500; margin-top: 2px; }
      .diff-feature-h { text-align: left !important; font-family: 'Space Grotesk', sans-serif; font-size: 13px; color: var(--gray-600); }
      .diff-feature { font-weight: 600; color: var(--dark); min-width: 130px; }
      .diff-info { display: block; font-size: 11px; font-weight: 400; color: var(--gray-400); margin-top: 2px; }
      .diff-table td:not(.diff-feature) { text-align: center; color: var(--gray-600); }
      .diff-win { background: var(--green-light); color: var(--green-dark) !important; font-weight: 700; }
      .diff-table tbody tr:last-child td { border-bottom: none; }

      /* Upgrade cards */
      .upgrade { padding: 44px 0; background: var(--gray-50); }
      .upgrade-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
      .upgrade-card { background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius); padding: 22px 20px; box-shadow: var(--shadow); transition: transform 0.2s, box-shadow 0.2s; border-top: 4px solid var(--gray-300); }
      .upgrade-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover); }
      .upgrade-hold { border-top-color: var(--gray-400); }
      .upgrade-consider { border-top-color: var(--yellow); }
      .upgrade-buy { border-top-color: var(--green); }
      .upgrade-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--green-light); color: var(--green-dark); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
      .upgrade-icon svg { width: 22px; height: 22px; }
      .upgrade-who { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-400); margin-bottom: 4px; }
      .upgrade-verdict { font-family: 'Space Grotesk', sans-serif; font-size: 19px; font-weight: 600; color: var(--dark); margin-bottom: 8px; }
      .upgrade-buy .upgrade-verdict { color: var(--green-dark); }
      .upgrade-body { font-size: 13.5px; color: var(--gray-600); line-height: 1.6; }

      /* Accuracy */
      .accuracy { padding: 44px 0; background: #fff; }
      .metric-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 18px; scrollbar-width: none; }
      .metric-tabs::-webkit-scrollbar { display: none; }
      .metric-tab { padding: 8px 15px; border-radius: 50px; border: 2px solid var(--gray-200); background: #fff; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--gray-600); cursor: pointer; white-space: nowrap; transition: all 0.2s; }
      .metric-tab:hover { border-color: var(--gray-300); color: var(--dark); }
      .metric-tab.active { background: var(--green-light); color: var(--green-dark); border-color: var(--green); font-weight: 600; }
      .metric-tab:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; }
      .metric-panel { background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius); padding: 22px; box-shadow: var(--shadow); }
      .metric-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 6px; }
      .metric-head h3 { font-size: 20px; }
      .metric-gold { font-size: 12px; color: var(--gray-400); background: var(--gray-100); padding: 4px 10px; border-radius: 6px; }
      .metric-desc { font-size: 14px; color: var(--gray-600); margin-bottom: 16px; }
      .metric-cols { display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 16px; }
      .metric-col { border: 1px solid var(--gray-200); border-top: 3px solid var(--accent); border-radius: var(--radius-sm); padding: 14px 16px; background: var(--gray-50); }
      .metric-col-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14px; color: var(--accent); margin-bottom: 4px; }
      .metric-result { font-size: 17px; font-weight: 700; color: var(--dark); margin-bottom: 6px; }
      .metric-result-muted { color: var(--gray-400); }
      .metric-detail { font-size: 13px; color: var(--gray-600); line-height: 1.55; }
      .metric-study { display: flex; align-items: flex-start; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--gray-200); }
      .study-badge { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; flex-shrink: 0; margin-top: 1px; }
      .study-badge.independent { background: #DCFCE7; color: #166534; }
      .study-badge.funded { background: #FEF3C7; color: #92400E; }
      .study-cite { font-size: 11.5px; color: var(--gray-400); line-height: 1.5; }
      .metric-insight { display: flex; gap: 10px; padding: 14px 16px; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: var(--radius-sm); }
      .metric-insight svg { flex-shrink: 0; color: #D97706; margin-top: 2px; }
      .metric-insight p { font-size: 13px; color: #92400E; line-height: 1.6; }
      .accuracy-disclosure { margin-top: 16px; font-size: 12.5px; color: var(--gray-600); background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-sm); padding: 14px 16px; line-height: 1.6; }
      .accuracy-disclosure strong { color: var(--dark); }

      /* Cost */
      .cost { padding: 44px 0; background: var(--gray-50); }
      .cost-wrap { max-width: 860px; margin: 0 auto; }
      .cost-controls { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: center; margin-bottom: 20px; }
      .cost-toggle { display: inline-flex; background: var(--gray-100); border-radius: 50px; padding: 4px; gap: 2px; }
      .cost-opt { border: none; background: transparent; padding: 8px 16px; border-radius: 50px; font-family: inherit; font-size: 13px; font-weight: 600; color: var(--gray-600); cursor: pointer; transition: all 0.2s; white-space: nowrap; }
      .cost-opt.active { background: #fff; color: var(--green-dark); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
      .cost-check { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--gray-600); cursor: pointer; }
      .cost-check input { width: 16px; height: 16px; accent-color: var(--green); cursor: pointer; }
      .cost-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .cost-card { position: relative; background: #fff; border: 1px solid var(--gray-200); border-top: 4px solid var(--accent); border-radius: var(--radius); padding: 22px 18px; text-align: center; box-shadow: var(--shadow); }
      .cost-best { border-color: var(--green); box-shadow: 0 8px 24px rgba(34,197,94,0.12); }
      .cost-badge { position: absolute; top: -11px; left: 50%; transform: translateX(-50%); background: var(--green); color: #fff; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; padding: 3px 10px; border-radius: 50px; white-space: nowrap; }
      .cost-card h3 { font-size: 16px; margin-bottom: 8px; }
      .cost-total { font-family: 'Space Grotesk', sans-serif; font-size: 34px; font-weight: 700; color: var(--dark); line-height: 1; margin-bottom: 14px; }
      .cost-total span { display: block; font-size: 12px; font-weight: 500; color: var(--gray-400); margin-top: 4px; }
      .cost-lines { list-style: none; text-align: left; }
      .cost-lines li { display: flex; justify-content: space-between; font-size: 13px; color: var(--gray-600); padding: 6px 0; border-bottom: 1px solid var(--gray-100); }
      .cost-lines li:last-child { border-bottom: none; }
      .cost-note { font-size: 12.5px; color: var(--gray-600); text-align: center; margin-top: 18px; line-height: 1.6; }
      .cost-note strong { color: var(--dark); }

      /* FAQ */
      .faq { padding: 44px 0; background: #fff; }
      .faq-list { max-width: 780px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }
      .faq-item { border: 1px solid var(--gray-200); border-radius: var(--radius-sm); overflow: hidden; background: #fff; transition: border-color 0.2s; }
      .faq-item.open { border-color: var(--green); }
      .faq-q { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 18px; cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--dark); }
      .faq-q:focus-visible { outline: 2px solid var(--green); outline-offset: -2px; }
      .faq-toggle { flex-shrink: 0; color: var(--gray-400); transition: transform 0.3s; }
      .faq-item.open .faq-toggle { transform: rotate(180deg); color: var(--green); }
      .faq-a { max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding 0.35s ease; padding: 0 18px; }
      .faq-item.open .faq-a { max-height: 480px; padding: 0 18px 18px; }
      .faq-a p { font-size: 14px; color: var(--gray-600); line-height: 1.65; }

      /* Cross-link */
      .crosslink { padding: 8px 0 44px; }
      .crosslink-card { display: flex; align-items: center; gap: 16px; max-width: 820px; margin: 0 auto; background: linear-gradient(135deg, var(--dark) 0%, var(--gray-700) 100%); border-radius: var(--radius); padding: 22px 24px; text-decoration: none; box-shadow: 0 12px 32px rgba(30,41,59,0.2); transition: transform 0.2s; }
      .crosslink-card:hover { transform: translateY(-3px); }
      .crosslink-copy { display: flex; flex-direction: column; gap: 3px; flex: 1; }
      .crosslink-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: var(--green); }
      .crosslink-title { font-family: 'Space Grotesk', sans-serif; font-size: 19px; font-weight: 600; color: #fff; }
      .crosslink-sub { font-size: 13px; color: var(--gray-300); }
      .crosslink-arrow { flex-shrink: 0; width: 42px; height: 42px; border-radius: 50%; background: var(--green); color: #fff; display: flex; align-items: center; justify-content: center; }
      .crosslink-arrow svg { width: 20px; height: 20px; }

      /* Blog CTA */
      .blog-cta-section { padding: 44px 0; }
      .blog-cta { width: 100%; max-width: 680px; margin: 0 auto; position: relative; overflow: hidden; border-radius: 16px; background: linear-gradient(135deg, var(--dark) 0%, var(--gray-700) 100%); padding: 24px 20px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 16px 40px rgba(30,41,59,0.25); }
      .blog-cta::before { content: ''; position: absolute; top: -50%; right: -30%; width: 260px; height: 260px; background: radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%); pointer-events: none; }
      .blog-cta-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 16px; padding: 4px 10px; margin-bottom: 16px; position: relative; z-index: 1; }
      .blog-cta-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: blogCtaPulse 2s ease-in-out infinite; }
      @keyframes blogCtaPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      .blog-cta-badge span { font-size: 10px; font-weight: 600; color: var(--green); letter-spacing: 0.5px; text-transform: uppercase; }
      .blog-cta-headline { font-family: 'Space Grotesk', -apple-system, sans-serif; font-size: 20px; font-weight: 600; color: #fff; line-height: 1.25; margin-bottom: 10px; position: relative; z-index: 1; }
      .blog-cta-headline .highlight { color: var(--green); }
      .blog-cta-sub { font-size: 14px; color: #94A3B8; line-height: 1.65; margin-bottom: 20px; position: relative; z-index: 1; }
      .blog-cta-actions { display: flex; flex-direction: column; align-items: center; gap: 12px; position: relative; z-index: 1; }
      .blog-cta-buttons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
      .blog-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; white-space: nowrap; }
      .blog-cta-btn:hover { background: var(--green-dark); }
      .blog-cta-btn svg { width: 18px; height: 18px; }
      .blog-cta-meta { font-size: 12px; color: #94A3B8; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: center; }
      .blog-cta-devices { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08); position: relative; z-index: 1; }
      .blog-cta-devices-label { font-size: 10px; font-weight: 500; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; }
      .blog-cta-device-tags { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; width: 100%; }
      .blog-cta-device-tag { font-size: 11px; font-weight: 500; color: #94A3B8; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 4px 8px; display: flex; align-items: center; gap: 5px; }
      .blog-cta-device-tag img { width: 14px; height: 14px; border-radius: 3px; object-fit: contain; }

      /* CTA */
      .cta-section { padding: 38px 0; }
      .cta-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
      .cta-box { background: linear-gradient(135deg, var(--green), var(--green-dark)); border-radius: var(--radius); padding: 30px 18px; text-align: center; position: relative; overflow: hidden; }
      .cta-box::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%); pointer-events: none; }
      .cta-box-content { position: relative; z-index: 1; }
      .cta-icon { width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #fff; }
      .cta-box h2 { font-size: clamp(20px, 5vw, 26px); margin-bottom: 10px; color: #fff; }
      .cta-box p { font-size: 14px; color: rgba(255,255,255,0.85); margin-bottom: 22px; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.6; }
      .cta-btn-white { display: inline-flex; align-items: center; gap: 8px; background: #fff; color: var(--green-dark); padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; }
      .cta-btn-white:hover { background: var(--gray-100); }
      .cta-android { background: #fff; color: var(--green-dark); padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: background 0.2s; }
      .cta-android:hover { background: var(--gray-100); }
      .cta-android svg { width: 18px; height: 18px; }
      .cta-fineprint { margin: 14px 0 0; font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.85); }
      .cta-features { display: flex; flex-direction: column; justify-content: center; gap: 10px; margin-top: 20px; font-size: 13px; color: rgba(255,255,255,0.8); }
      .cta-feature { display: flex; align-items: center; justify-content: center; gap: 8px; }
      .cta-feature svg { color: #fff; flex-shrink: 0; }
      @media (max-width: 480px) { .cta-buttons { flex-direction: column; align-items: stretch; } .cta-buttons a { width: 100%; justify-content: center; } .blog-cta-buttons { flex-direction: column; align-items: stretch; } .blog-cta-buttons a { width: 100%; justify-content: center; } }

      /* Footer */
      .tool-footer { padding: 32px 0; text-align: center; border-top: 1px solid var(--gray-200); }
      .footer-brand { display: inline-flex; align-items: center; gap: 8px; color: var(--dark); font-weight: 600; text-decoration: none; margin-bottom: 6px; font-size: 14px; }
      .footer-brand:hover { color: var(--green); }
      .footer-logo { height: 24px; width: auto; }
      .footer-tagline { color: var(--gray-600); font-size: 12px; margin-bottom: 12px; }
      .footer-links { display: flex; justify-content: center; gap: 16px; font-size: 12px; margin-bottom: 12px; flex-wrap: wrap; }
      .footer-links a { color: var(--gray-400); text-decoration: none; }
      .footer-links a:hover { color: var(--dark); }
      .footer-copyright { font-size: 11px; color: var(--gray-400); margin-bottom: 4px; line-height: 1.6; max-width: 700px; margin-left: auto; margin-right: auto; }
      .footer-affiliate { font-style: italic; }

      /* Tablet */
      @media (min-width: 768px) {
        .header { padding: 14px 24px; }
        .logo { font-size: 16px; gap: 10px; }
        .logo-img { height: 32px; }
        .hero { padding: 64px 0 40px; }
        .diff, .upgrade, .accuracy, .cost, .faq, .blog-cta-section { padding: 64px 0; }
        .cta-section { padding: 56px 0; }
        .section-title { font-size: 32px; }
        .diff-table th, .diff-table td { padding: 14px 18px; font-size: 14px; }
        .upgrade-grid { grid-template-columns: repeat(3, 1fr); }
        .metric-cols { grid-template-columns: 1fr 1fr; }
        .blog-cta { padding: 32px 28px; }
        .blog-cta-headline { font-size: 24px; }
        .blog-cta-actions { flex-direction: row; align-items: center; gap: 16px; }
        .blog-cta-devices { flex-direction: row; align-items: center; gap: 14px; }
        .blog-cta-device-tags { grid-template-columns: repeat(4, auto); width: auto; }
        .cta-box { padding: 48px 32px; }
        .cta-features { flex-direction: row; gap: 24px; font-size: 14px; }
        .footer-brand { font-size: 16px; gap: 10px; }
        .footer-links { gap: 24px; font-size: 14px; }
      }

      /* Desktop */
      @media (min-width: 1024px) {
        .hero { padding: 80px 0 48px; }
        .diff, .upgrade, .accuracy, .cost, .faq, .blog-cta-section { padding: 80px 0; }
        .metric-panel { padding: 28px; }
        .blog-cta { padding: 40px 36px; }
        .blog-cta-headline { font-size: 26px; }
        .cta-box { padding: 56px 40px; }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .faq-a, .faq-toggle, .blog-cta-badge-dot, .upgrade-card, .cost-card, .crosslink-card { transition: none; animation: none; }
      }
    `;
  }

  // ── Event delegation (bound once) ──────────────────────────────────────
  _setupEventDelegation() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const shadow = this.shadowRoot;

    shadow.addEventListener('click', (e) => {
      // Accuracy metric tabs
      const mtab = e.target.closest('.metric-tab');
      if (mtab) {
        if (mtab.dataset.metric !== this._expandedMetric) {
          this._expandedMetric = mtab.dataset.metric;
          this._updateMetricPanel();
        }
        return;
      }

      // Cost billing toggle
      const billing = e.target.closest('.cost-opt');
      if (billing) {
        if (billing.dataset.billing !== this._billing) {
          this._billing = billing.dataset.billing;
          this._updateCost();
        }
        return;
      }

      // FAQ toggle
      const faqQ = e.target.closest('.faq-q');
      if (faqQ) {
        this._toggleFaq(faqQ.closest('.faq-item'));
        return;
      }
    });

    // Charging-case checkbox
    shadow.addEventListener('change', (e) => {
      if (e.target.matches('input[data-toggle="case"]')) {
        this._includeCase = e.target.checked;
        this._updateCost();
      }
    });

    // Keyboard support for tabs + FAQ
    shadow.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const mtab = e.target.closest('.metric-tab');
      if (mtab) {
        e.preventDefault();
        this._expandedMetric = mtab.dataset.metric;
        this._updateMetricPanel();
        const active = this.shadowRoot.querySelector('.metric-tab.active');
        if (active) active.focus();
        return;
      }
      const faqQ = e.target.closest('.faq-q');
      if (faqQ) {
        e.preventDefault();
        this._toggleFaq(faqQ.closest('.faq-item'));
      }
    });
  }

  _toggleFaq(item) {
    if (!item) return;
    const idx = parseInt(item.dataset.faq, 10);
    const q = item.querySelector('.faq-q');
    if (this._expandedFaq.has(idx)) {
      this._expandedFaq.delete(idx);
      item.classList.remove('open');
      if (q) q.setAttribute('aria-expanded', 'false');
    } else {
      this._expandedFaq.add(idx);
      item.classList.add('open');
      if (q) q.setAttribute('aria-expanded', 'true');
    }
  }

  // ── Animations ─────────────────────────────────────────────────────────
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
      }, { rootMargin: '0px 0px -50px 0px', threshold: 0.15 });
      els.forEach(el => this._observer.observe(el));
    });
  }
}

customElements.define('kygo-oura-5-vs-4', KygoOura5vs4);
