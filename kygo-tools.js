/**
 * Kygo Health - Tools Page Custom Element
 * Tag: kygo-tools-page
 * Mobile-first tools index: hero, image-led featured card, data-motif tool grid, dark navy app promo.
 * Tools are configurable via the 'tools' attribute (JSON array).
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

class KygoToolsPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._tools = [];
  }

  connectedCallback() {
    this._parseTools();
    this.render();
    this._setupEvents();
    this._setupAnimations();
    __seo(this, 'Kygo Health Free Tools — Free research-backed tools to understand your nutrition and health. Food Scanner, Wearable Accuracy, VO2 Max Accuracy, VO2 Max Factors, HRV Factors, Sleep Factors, Step Count Accuracy, Sleep Metrics, Calorie Burn Accuracy, Sensor Comparison, and more. No signup required.');
    this._injectStructuredData();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  static get observedAttributes() { return ['tools']; }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'tools' && oldValue !== newValue) {
      this._parseTools();
      this.render();
      this._setupEvents();
      this._setupAnimations();
    }
  }

  _parseTools() {
    try {
      const attr = this.getAttribute('tools');
      if (attr) { this._tools = JSON.parse(attr); return; }
    } catch (e) {}
    // No Wix-provided `tools` attribute → use the built-in default list (kept in-repo,
    // version-controlled). Wix can still override by setting the `tools` attribute.
    this._tools = this._defaultTools();
  }

  _defaultTools() {
    return [
      { slug: 'wearable-accuracy', title: 'Most Accurate Wearable', description: 'Compare real accuracy data for Oura, Apple Watch, Garmin, WHOOP, Fitbit & Samsung across 9 health metrics backed by peer-reviewed research.', icon: 'activity', badge: 'Most Popular', url: '/tools/wearable-accuracy', features: ['17+ peer-reviewed studies', 'Head-to-head comparison', 'Full bias disclosure'] },
      { slug: 'recovery-score-explorer', title: 'Recovery Score Explorer', description: 'Compare recovery and readiness scores across 12 wearables — WHOOP, Oura, Garmin, Fitbit, Samsung, Polar, Ultrahuman, Coros, Amazfit, Suunto, Apple & RingConn — see the 35 factors that move yours, and find which scores are actually validated.', icon: 'heart', badge: 'New', url: '/tools/recovery-score-explorer', category: 'recovery', features: ['12 wearables compared', '35 factors ranked', 'Only 2/12 scores validated'] },
      { slug: 'supplements-by-metric', title: 'Supplements by Metric', description: 'Pick a wearable metric — sleep latency, deep sleep, staying asleep, HRV, resting heart rate, or recovery — and see which of 27 supplements the research actually supports, graded by evidence with industry-funding flags and the popular stuff that doesn\'t work.', icon: 'sparkles', badge: 'New', url: '/tools/supplements-by-metric', category: 'nutrition', features: ['6 metrics × 27 supplements', 'Evidence-graded with funding flags', '19 primary sources'] },
      { slug: 'vo2-max-accuracy', title: 'Most Accurate VO2 Max Wearable', description: 'How accurately do Garmin, Apple, Polar, Fitbit, WHOOP, Oura, Samsung & Coros estimate VO2 max vs a lab CPET? Compare 9 devices by method and see which brands are actually independently validated.', icon: 'activity', badge: 'New', url: '/tools/vo2-max-accuracy', category: 'wearables', features: ['9 devices compared', 'Independent vs vendor validation', '13 peer-reviewed sources'] },
      { slug: 'vo2-max-factors', title: 'VO2 Max Factor Explorer', description: 'Explore 39 research-backed factors that raise or lower VO2 max — training, nutrition, environment, lifestyle & clinical — ranked by evidence strength, with doses and sources.', icon: 'zap', badge: 'New', url: '/tools/vo2-max-factors', category: 'recovery', features: ['39 factors ranked', '6 categories', '36 peer-reviewed sources'] },
      { slug: 'oura-ring-comparison-tool', title: 'Oura Ring 5 vs 4 vs 3 Comparison (2026)', description: 'Compare Oura Ring 5, Ring 4, and Gen 3 side-by-side. Size & dimensions, peer-reviewed accuracy data (Dial 2025, Khan 2025), and the real 3-year cost with subscription math included.', icon: 'scale', badge: 'New', url: '/tools/oura-ring-comparison-tool', features: ['3 generations compared', 'Peer-reviewed accuracy data', '3-year TCO calculator'] },
      { slug: 'fitbit-air-vs-whoop-comparison', title: 'Fitbit Air vs WHOOP: Accuracy & Cost (2026)', description: 'Compare Fitbit Air, WHOOP 5.0, and WHOOP MG side by side: heart-rate, sleep, and calorie accuracy with numbers, sensors, battery, price, and 3-year cost of ownership.', icon: 'scale', badge: 'New', url: '/tools/fitbit-air-vs-whoop-comparison', features: ['35 specs across 5 categories', 'HR/sleep/calorie accuracy', '3-year cost calculator'] },
      { slug: 'stress-factors', title: 'Stress Factor Explorer', description: 'What actually moves your wearable stress score? Explore every factor by device — Garmin, WHOOP, Oura, Fitbit, Samsung, Apple Watch — broken down by signal, direction & evidence.', icon: 'brain', badge: 'New', url: '/tools/stress-factors', features: ['10 wearables compared', '5 signal types mapped', '30+ peer-reviewed sources'] },
      { slug: 'staying-asleep-factors', title: 'Staying Asleep Factors', description: 'Explore 27 research-backed factors that affect whether you stay asleep through the night — nutrition, supplements, exercise, environment & demographics ranked by evidence.', icon: 'moon', badge: 'New', url: '/tools/staying-asleep-factors', features: ['27 factors ranked', '40+ peer-reviewed studies', '5 categories'] },
      { slug: 'hrv-factors', title: 'HRV Factor Explorer', description: 'Explore 38 research-backed factors that affect Heart Rate Variability across supplements, lifestyle, exercise, micronutrients & demographics — ranked by evidence strength.', icon: 'heart', badge: 'Trending', url: '/tools/hrv-factors', features: ['38 factors ranked', '5 categories explored', 'Peer-reviewed sources'] },
      { slug: 'resting-heart-rate-factors', title: 'Resting Heart Rate Factors', description: '37 research-backed factors that move your resting heart rate — sorted by exact bpm impact. See what actually lowers, raises, or doesn\'t change your RHR.', icon: 'heart', badge: 'New', url: '/tools/resting-heart-rate-factors', features: ['37 peer-reviewed factors', 'Sortable by bpm impact', '33 myths debunked'] },
      { slug: 'sleep-latency-factors', title: 'Sleep Latency Factors', description: 'Explore 33 research-backed factors that affect how fast you fall asleep — nutrition, supplements, exercise, environment & demographics ranked by evidence.', icon: 'moon', badge: 'Sleep', url: '/tools/sleep-latency-factors', features: ['33 factors ranked', '42+ peer-reviewed studies', '5 categories'] },
      { slug: 'calorie-burn-accuracy', title: 'Calorie Burn Accuracy Calculator', description: 'Enter your wearable\'s reported calorie burn and see the likely actual range — backed by 7+ peer-reviewed studies across Apple Watch, Fitbit, Garmin, WHOOP & Oura.', icon: 'calculator', badge: 'Activity', url: '/tools/calorie-burn-accuracy', features: ['5 devices × 7 activities', 'Confidence range calculator', '14 verified sources'] },
      { slug: 'deep-sleep-factors', title: 'Deep Sleep Factor Explorer', description: 'What affects your deep sleep? 28 factors ranked by research — with evidence strength, doses, and mechanisms from 40+ studies.', icon: 'moon', badge: 'Sleep', url: '/tools/deep-sleep-factors', features: ['28 evidence-based factors', '5 categories', '40+ peer-reviewed sources'] },
      { slug: 'food-scanner', title: 'Food Scanner', description: 'Snap a photo of any meal and get instant calories, macros, health score, and nutrition insights powered by AI.', icon: 'camera', badge: 'Food', url: '/tools/calories-in-anything', features: ['Instant calorie count', 'Macro & vitamin breakdown', 'Health score 1–10'] },
      { slug: 'step-count-accuracy', title: 'Step Count Accuracy', description: 'See which wearable counts steps most accurately — Garmin, Apple Watch, Fitbit, Samsung, Oura & more, ranked by 20+ peer-reviewed studies.', icon: 'steps', badge: 'Activity', url: '/tools/step-count-accuracy', features: ['20+ peer-reviewed studies', 'Head-to-head comparison', '9 devices ranked'] },
      { slug: 'sleep-metrics', title: 'Sleep Metrics Comparison', description: 'Compare 38 sleep metrics tracked by Oura Ring, Fitbit, Apple Watch & Garmin across 10 categories — see exactly what each device measures while you sleep.', icon: 'moon', badge: 'Sleep', url: '/tools/sleep-metrics', features: ['38 metrics compared', '10 sleep categories', '29 verified sources'] },
      { slug: 'sensor-comparison', title: 'Hardware & Software Differences', description: 'See what actually makes Garmin, Whoop, Oura, Apple Watch, and Fitbit different — hardware sensors, health metrics, and proprietary software compared.', icon: 'activity', badge: 'Hardware', url: '/tools/sensor-comparison', features: ['Hardware vs software breakdown', '25 proprietary algorithms', '6 latest-gen devices'] },
      { slug: 'rem-sleep-factors', title: 'REM Sleep Factor Explorer', description: 'What influences your REM (dream) sleep? Explore 23 research-backed factors across nutrition, supplements, exercise, environment & demographics — ranked by evidence strength, with mechanisms and sources.', icon: 'moon', badge: 'Sleep', url: '/tools/rem-sleep-factors', features: ['23 factors ranked', '5 categories', '23 peer-reviewed sources'] }
    ];
  }

  // Slug → category mapping (overridable via tool.category)
  _categoryFor(tool) {
    if (tool.category) return tool.category;
    const map = {
      'wearable-accuracy': 'wearables',
      'sensor-comparison': 'wearables',
      'calorie-burn-accuracy': 'wearables',
      'step-count-accuracy': 'wearables',
      'sleep-metrics': 'sleep',
      'sleep-latency-factors': 'sleep',
      'staying-asleep-factors': 'sleep',
      'deep-sleep-factors': 'sleep',
      'rem-sleep-factors': 'sleep',
      'hrv-factors': 'recovery',
      'resting-heart-rate-factors': 'recovery',
      'food-scanner': 'nutrition'
    };
    return map[tool.slug] || 'other';
  }

  // Per-category presentation data — icon, label, lede. Unknown categories
  // get a humanised label and a default icon.
  _categoryMeta(id) {
    const map = {
      sleep:     { label: 'Sleep',     icon: 'moon',     lede: 'Tools that explore what shapes how fast you fall asleep, how deep you go, and whether you stay there.' },
      recovery:  { label: 'Recovery',  icon: 'heart',    lede: 'Heart rate, HRV, and the lifestyle inputs that move them.' },
      nutrition: { label: 'Nutrition', icon: 'sparkles', lede: 'Understand what\'s actually in your food.' },
      wearables: { label: 'Wearables', icon: 'activity', lede: 'Device accuracy, head-to-head comparisons, and what each one gets right.' },
      other:     { label: 'Other',     icon: 'sparkles', lede: 'Specialty tools.' }
    };
    return map[id] || {
      label: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' '),
      icon: 'sparkles',
      lede: ''
    };
  }

  // Group tools by category, preserving insertion order within each group.
  // Returns an array of { id, meta, tools } in the preferred display order.
  _groupedByCategory() {
    const preferredOrder = ['sleep', 'recovery', 'nutrition', 'wearables', 'other'];
    const buckets = new Map();
    this._tools.forEach(t => {
      const id = this._categoryFor(t);
      if (!buckets.has(id)) buckets.set(id, []);
      buckets.get(id).push(t);
    });
    const order = preferredOrder.filter(id => buckets.has(id));
    buckets.forEach((_, id) => { if (!order.includes(id)) order.push(id); });
    return order.map(id => ({ id, meta: this._categoryMeta(id), tools: buckets.get(id) }));
  }

  // Parse "17+ peer-reviewed studies" → { n: '17+', l: 'peer-reviewed studies' }
  _statsFor(tool) {
    const features = Array.isArray(tool.features) ? tool.features.slice(0, 3) : [];
    return features.map(f => {
      const s = String(f);
      const space = s.indexOf(' ');
      if (space > 0 && /\d/.test(s.slice(0, space))) {
        return { n: s.slice(0, space), l: s.slice(space + 1) };
      }
      return { n: '', l: s };
    });
  }

  // Collapse features to a short "A · B" meta line (first two features).
  _metaFor(tool) {
    if (tool.meta) return tool.meta;
    const f = Array.isArray(tool.features) ? tool.features : [];
    return f.slice(0, 2).join(' · ');
  }

  // Per-tool data-motif config (slug → motif + illustrative params). A tool may
  // override via its own `motif`/`caption`/etc. fields (e.g. from Wix).
  _motifFor(tool) {
    if (tool.motif) {
      return { motif: tool.motif, caption: tool.caption || '', stage: tool.stage, rows: tool.rows,
        ringValue: tool.ringValue, ringNote: tool.ringNote, bpm: tool.bpm,
        gaugePct: tool.gaugePct, gaugeValue: tool.gaugeValue, gaugeUnit: tool.gaugeUnit, rangeLabel: tool.rangeLabel };
    }
    const map = {
      'wearable-accuracy': { motif: 'compare', caption: 'Accuracy vs lab', rows: [{ label: 'Oura', pct: 94 }, { label: 'Apple', pct: 88 }, { label: 'Garmin', pct: 80 }, { label: 'Fitbit', pct: 66 }] },
      'recovery-score-explorer': { motif: 'ring', caption: 'Readiness score', ringValue: 72, ringNote: 'Validated' },
      'supplements-by-metric': { motif: 'ranked', caption: 'Graded by evidence' },
      'vo2-max-accuracy': { motif: 'compare', caption: 'Accuracy vs lab CPET', rows: [{ label: 'Garmin', pct: 92 }, { label: 'Apple', pct: 85 }, { label: 'Polar', pct: 78 }, { label: 'Fitbit', pct: 64 }] },
      'vo2-max-factors': { motif: 'gauge', caption: 'VO2 max estimate', gaugePct: 78, gaugeValue: '48', gaugeUnit: 'VO2 MAX' },
      'oura-ring-comparison-tool': { motif: 'compare', caption: 'Generation vs generation', rows: [{ label: 'Ring 5', pct: 96 }, { label: 'Ring 4', pct: 84 }, { label: 'Gen 3', pct: 68 }] },
      'fitbit-air-vs-whoop-comparison': { motif: 'compare', caption: 'Head-to-head specs', rows: [{ label: 'WHOOP', pct: 90 }, { label: 'Fitbit Air', pct: 72 }] },
      'stress-factors': { motif: 'gauge', caption: 'Stress load', gaugePct: 62, gaugeValue: '62', gaugeUnit: 'STRESS' },
      'staying-asleep-factors': { motif: 'ranked', caption: 'Factors ranked by evidence' },
      'hrv-factors': { motif: 'pulse', caption: 'HRV · beat-to-beat' },
      'resting-heart-rate-factors': { motif: 'pulse', caption: 'Resting heart rate', bpm: '58 bpm' },
      'sleep-latency-factors': { motif: 'decay', caption: 'Time to fall asleep' },
      'calorie-burn-accuracy': { motif: 'range', caption: 'Likely actual range', rangeLabel: '−18%' },
      'deep-sleep-factors': { motif: 'hypno', stage: 'deep', caption: 'Sleep stages overnight' },
      'food-scanner': { motif: 'donut', caption: 'Macros & calories' },
      'step-count-accuracy': { motif: 'steps', caption: 'Daily step counts' },
      'sleep-metrics': { motif: 'compare', caption: 'Metrics tracked per device', rows: [{ label: 'Oura', pct: 96 }, { label: 'Garmin', pct: 84 }, { label: 'Apple', pct: 74 }, { label: 'Fitbit', pct: 60 }] },
      'sensor-comparison': { motif: 'compare', caption: 'Sensors per device', rows: [{ label: 'Garmin', pct: 95 }, { label: 'WHOOP', pct: 82 }, { label: 'Oura', pct: 76 }, { label: 'Apple', pct: 70 }] },
      'rem-sleep-factors': { motif: 'hypno', stage: 'rem', caption: 'Sleep stages overnight' }
    };
    return map[tool.slug] || { motif: 'ranked', caption: 'Ranked by evidence' };
  }

  // The motif graphic (SVG/markup) that goes inside the white data panel.
  // Geometry mirrors ToolCard2.dc.html exactly.
  _motifBody(c) {
    const m = c.motif || 'ranked';
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
      return `<div style="display:flex;align-items:center;justify-content:center;gap:14px;padding:2px 0;"><svg viewBox="0 0 96 96" width="80" height="80"><circle cx="48" cy="48" r="38" fill="none" stroke="#E2E8F0" stroke-width="11"/><circle cx="48" cy="48" r="38" fill="none" stroke="#22C55E" stroke-width="11" stroke-linecap="round" stroke-dasharray="238.8" stroke-dashoffset="${off}" transform="rotate(-90 48 48)"/><text x="48" y="46" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="26" fill="#1E293B">${v}</text><text x="48" y="62" text-anchor="middle" font-family="Space Grotesk" font-weight="600" font-size="8" letter-spacing="0.5" fill="#94A3B8">SCORE</text></svg><div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;color:#16A34A;">↑ ${c.ringNote || 'Validated'}</div></div>`;
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
    // ranked (default)
    return `<svg viewBox="0 0 200 96" width="100%" style="display:block;"><defs><linearGradient id="mtRank" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#22C55E"/><stop offset="1" stop-color="#16A34A"/></linearGradient></defs><rect x="0" y="4" width="186" height="11" rx="5.5" fill="url(#mtRank)"/><rect x="0" y="25" width="150" height="11" rx="5.5" fill="url(#mtRank)" opacity="0.85"/><rect x="0" y="46" width="116" height="11" rx="5.5" fill="url(#mtRank)" opacity="0.7"/><rect x="0" y="67" width="82" height="11" rx="5.5" fill="url(#mtRank)" opacity="0.55"/><rect x="0" y="88" width="54" height="6" rx="3" fill="#CBD5E1"/></svg>`;
  }

  _featured() {
    return this._tools.find(t => t.featured === true)
      || this._tools.find(t => (t.badge || '').toLowerCase() === 'most popular')
      || null;
  }

  _badgeTone(badge) {
    const b = (badge || '').toLowerCase();
    if (b === 'most popular') return 'popular';
    if (b === 'new') return 'new';
    if (b === 'trending') return 'trending';
    return 'soft';
  }

  _getIcon(name) {
    const icons = {
      camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
      calculator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
      brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/></svg>',
      zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
      steps: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.48-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      'arrow-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
      playstore: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
      share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>'
    };
    return icons[name] || icons.sparkles;
  }

  _setupEvents() {
    const root = this.shadowRoot;

    root.querySelectorAll('[data-open-tool]').forEach(el => {
      el.addEventListener('click', (e) => {
        const url = el.getAttribute('data-open-tool');
        if (!url) return;
        e.preventDefault();
        window.location.href = url;
      });
    });

    const shareBtn = root.querySelector('[data-share]');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const url = window.location.href;
        const title = 'Kygo Health — Free Tools';
        if (navigator.share) {
          navigator.share({ title, url }).catch(() => {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(url).catch(() => {});
        }
      });
    }
  }

  _setupAnimations() {
    if (this._observer) this._observer.disconnect();
    requestAnimationFrame(() => {
      const cards = this.shadowRoot.querySelectorAll('.tool-card');
      if (!cards.length) return;
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const idx = Array.from(card.parentElement.children).indexOf(card);
            setTimeout(() => card.classList.add('visible'), Math.min(idx, 6) * 60);
            this._observer.unobserve(card);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      cards.forEach(c => this._observer.observe(c));
    });
  }

  _styles() {
    return `
      :host {
        --dark: #1E293B;
        --dark-card: #0F172A;
        --light: #F8FAFC;
        --green: #22C55E;
        --green-dark: #16A34A;
        --green-light: rgba(34, 197, 94, 0.10);
        --green-glow: rgba(34, 197, 94, 0.30);
        --gray-50: #F9FAFB;
        --gray-100: #F1F5F9;
        --gray-200: #E2E8F0;
        --gray-400: #94A3B8;
        --gray-600: #475569;
        --gray-700: #334155;
        display: block;
        font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: var(--light);
        color: var(--dark);
        line-height: 1.6;
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; min-width: 0; }
      h1, h2, h3 {
        font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 600;
        line-height: 1.15;
        letter-spacing: -0.01em;
      }
      button { font-family: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
      a { color: inherit; text-decoration: none; }

      /* ===== SECTIONS / BANDS ===== */
      .sec { width: 100%; }
      .sec-hero { background: #fff; border-bottom: 1px solid var(--gray-200); }
      .sec-tools { background: var(--light); }
      .sec-promo { background: #fff; }
      .wrap {
        width: 100%;
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 20px;
        box-sizing: border-box;
      }

      /* ===== HEADER ===== */
      .page-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 18px 0 6px;
      }
      .brand { display: flex; align-items: center; gap: 8px; }
      .brand-logo { height: 26px; width: auto; display: block; }
      .brand-name {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 700; font-size: 16px; color: var(--dark);
        letter-spacing: -0.005em;
      }
      .brand-sub {
        font-size: 12px; font-weight: 600;
        color: var(--gray-400); margin-left: 2px;
      }
      .icon-btn {
        border: none; background: transparent; color: var(--dark);
        padding: 6px; display: inline-flex; align-items: center; justify-content: center;
      }
      .icon-btn svg { width: 22px; height: 22px; }

      /* ===== HERO (centered, matches site pattern) ===== */
      .hero { padding: 32px 0 40px; text-align: center; }
      .kicker-pill {
        display: inline-flex; align-items: center; gap: 6px;
        background: var(--green-light); color: var(--green-dark);
        padding: 6px 14px; border-radius: 9999px;
        font-size: 12px; font-weight: 600;
        margin-bottom: 18px;
      }
      .kicker-pill svg { width: 14px; height: 14px; }
      .hero h1 {
        font-size: clamp(28px, 6vw, 40px); color: var(--dark);
        margin: 0 0 14px; letter-spacing: -0.02em;
      }
      .hero h1 .hl { color: var(--green); }
      .hero p {
        font-size: clamp(15px, 2vw, 17px); color: var(--gray-600);
        line-height: 1.6; margin: 0 auto 20px;
        max-width: 560px;
      }
      .mini-stats {
        display: flex; flex-wrap: wrap; gap: 8px;
        font-size: 13px; color: var(--gray-600);
        justify-content: center;
      }
      .mini-stats .dot { color: var(--gray-400); }
      .mini-stats .item { display: inline-flex; align-items: center; gap: 5px; }
      .mini-stats .item svg { width: 13px; height: 13px; color: var(--green); }
      @media (min-width: 768px) {
        .hero { padding: 56px 0 56px; }
      }

      /* ===== CATEGORY SECTION HEADER ===== */
      .cat-section { padding: 28px 0 8px; scroll-margin-top: 24px; }
      .cat-section + .cat-section { border-top: 1px solid var(--gray-100); margin-top: 16px; }
      .cat-head {
        display: grid; grid-template-columns: auto 1fr; gap: 14px;
        align-items: flex-start; margin-bottom: 18px;
      }
      .cat-head-icon {
        width: 42px; height: 42px; border-radius: 12px;
        background: var(--green-light, rgba(34,197,94,0.1));
        color: var(--green-dark, #16A34A);
        display: inline-flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .cat-head-icon svg { width: 22px; height: 22px; }
      .cat-head-text { min-width: 0; }
      .cat-head-row { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
      .cat-head-label {
        font-family: 'Space Grotesk', sans-serif; font-weight: 600;
        font-size: clamp(20px, 4.5vw, 26px); letter-spacing: -0.02em;
        color: var(--dark); margin: 0; line-height: 1.15;
      }
      .cat-head-count {
        font-family: 'Space Grotesk', sans-serif; font-weight: 600;
        font-size: 11px; letter-spacing: 0.7px; text-transform: uppercase;
        color: var(--gray-400);
        background: var(--gray-100); padding: 4px 10px; border-radius: 9999px;
      }
      .cat-head-lede { margin: 4px 0 0; font-size: 13.5px; color: var(--gray-600); line-height: 1.5; max-width: 56ch; }
      @media (min-width: 768px) {
        .cat-section { padding: 40px 0 8px; }
        .cat-head-icon { width: 48px; height: 48px; border-radius: 14px; }
        .cat-head-icon svg { width: 26px; height: 26px; }
        .cat-head-lede { font-size: 14.5px; }
      }
    `;
  }

  _styles2() {
    return `
      /* ===== FEATURED (image-led, light) ===== */
      .featured-wrap { padding: 24px 0 4px; }
      .feat-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
      .feat-star {
        flex: 0 0 auto; width: 36px; height: 36px; border-radius: 10px;
        background: linear-gradient(135deg, #22C55E, #16A34A); color: #fff;
        display: inline-flex; align-items: center; justify-content: center;
        box-shadow: 0 6px 14px rgba(34,197,94,0.3);
      }
      .feat-head-text { min-width: 0; }
      .feat-head-title {
        font-family: 'Space Grotesk', sans-serif; font-weight: 600;
        font-size: 20px; letter-spacing: -0.01em; color: var(--dark); margin: 0;
      }
      .feat-head-sub { font-size: 13px; color: #64748B; margin: 2px 0 0; }
      .feat-rule { flex: 1; height: 1px; background: var(--gray-200); margin-left: 4px; }

      .feat-card {
        display: flex; flex-direction: column; width: 100%; text-align: left;
        background: #fff; border: 1px solid var(--gray-200);
        border-radius: 22px; overflow: hidden;
        box-shadow: 0 4px 16px rgba(15,23,42,0.06);
        transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
      }
      .feat-card:hover {
        transform: translateY(-4px); box-shadow: 0 18px 48px rgba(15,23,42,0.12);
        border-color: #CBD5E1; cursor: pointer;
      }
      .feat-scene {
        position: relative; min-height: 300px; background: var(--gray-100);
        overflow: hidden; display: flex; align-items: center; justify-content: center;
      }
      .feat-panel {
        position: relative; background: #fff; border: 1px solid #EAECEF;
        border-radius: 18px; box-shadow: 0 12px 32px rgba(15,23,42,0.10);
        padding: 20px 22px; width: 74%; max-width: 330px;
      }
      .feat-panel-cap {
        font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 10px;
        letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400); margin-bottom: 14px;
      }
      .feat-rows { display: flex; flex-direction: column; gap: 11px; }
      .feat-row { display: flex; align-items: center; gap: 10px; }
      .feat-row .lab { width: 54px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 11px; color: var(--gray-600); }
      .feat-row .track { flex: 1; height: 10px; border-radius: 5px; background: #EEF1F4; overflow: hidden; }
      .feat-row .fill { display: block; height: 100%; border-radius: 5px; }

      .feat-content { padding: 28px; display: flex; flex-direction: column; gap: 14px; }
      .feat-pop {
        display: inline-flex; align-items: center; gap: 6px; align-self: flex-start;
        padding: 5px 12px; border-radius: 9999px;
        background: linear-gradient(135deg, #22C55E, #16A34A); color: #fff;
        font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
        box-shadow: 0 4px 10px rgba(34,197,94,0.25);
      }
      .feat-content h2 {
        font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 26px;
        line-height: 1.15; letter-spacing: -0.01em; color: var(--dark); margin: 0;
      }
      .feat-blurb { font-size: 15px; color: var(--gray-600); line-height: 1.55; margin: 0; }
      .feat-stats { display: flex; gap: 24px; padding: 14px 0 4px; border-top: 1px solid var(--gray-100); margin-top: 4px; }
      .feat-stats .n { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; color: var(--green); line-height: 1; }
      .feat-stats .l { font-size: 11px; color: var(--gray-400); margin-top: 4px; }
      .feat-open {
        display: inline-flex; align-items: center; gap: 8px; align-self: flex-start;
        background: var(--green); color: #fff; padding: 12px 20px; border-radius: 12px;
        font-weight: 600; font-size: 14px; margin-top: 6px;
      }
      .feat-open svg { width: 16px; height: 16px; }
      @media (min-width: 900px) {
        .feat-card { flex-direction: row; align-items: stretch; }
        .feat-scene { flex: 0 0 52%; min-height: 380px; }
        .feat-content { flex: 1; justify-content: center; }
      }
      @media (max-width: 600px) { .feat-rule { display: none; } }

    `;
  }

  _styles3() {
    return `
      /* ===== TOOL CARDS (data-motif) ===== */
      .grid {
        padding: 0 0 8px;
        display: grid; grid-template-columns: 1fr; gap: 22px;
      }
      .tool-card {
        display: flex; flex-direction: column;
        background: #fff; border: 1px solid var(--gray-200);
        border-radius: 18px; overflow: hidden;
        box-shadow: 0 2px 12px rgba(15,23,42,0.05);
        opacity: 0; transform: translateY(12px);
        transition: opacity 400ms ease, transform 400ms ease,
                    border-color .25s ease, box-shadow .25s ease;
      }
      .tool-card.visible { opacity: 1; transform: translateY(0); }
      .tool-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 18px 40px rgba(15,23,42,0.10);
        border-color: #CBD5E1; cursor: pointer;
      }
      .card-media {
        position: relative; aspect-ratio: 16 / 10; overflow: hidden;
        background: var(--gray-100);
        display: flex; align-items: center; justify-content: center;
      }
      .card-panel {
        position: relative; background: #fff; border: 1px solid #EAECEF;
        border-radius: 14px; box-shadow: 0 6px 18px rgba(15,23,42,0.08);
        padding: 13px 15px; width: 76%;
      }
      .panel-cap {
        font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 9px;
        letter-spacing: 0.6px; text-transform: uppercase; color: var(--gray-400);
        margin-bottom: 8px;
      }
      .card-body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 7px; }
      .card-title {
        font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 17px;
        line-height: 1.25; letter-spacing: -0.01em; color: var(--dark); margin: 0;
      }
      .card-blurb {
        font-family: 'DM Sans', sans-serif; font-size: 13.5px; line-height: 1.55;
        color: var(--gray-600); margin: 0;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
      }
      .card-foot2 {
        display: flex; align-items: center; justify-content: space-between;
        gap: 10px; margin-top: 5px;
      }
      .card-meta {
        font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
        color: var(--gray-400); min-width: 0;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      .card-open {
        display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;
        font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: var(--green-dark);
      }
      .card-open svg { width: 15px; height: 15px; }

      /* ===== EMPTY STATE ===== */
      .empty {
        padding: 48px 0; text-align: center;
      }
      .empty-icon {
        width: 60px; height: 60px; border-radius: 16px;
        background: var(--gray-100); color: var(--gray-400);
        display: inline-flex; align-items: center; justify-content: center;
        margin-bottom: 12px;
      }
      .empty-icon svg { width: 24px; height: 24px; }
      .empty-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 16px; font-weight: 600; color: var(--dark); margin-bottom: 4px;
      }
      .empty-sub { font-size: 13px; color: var(--gray-600); }

      /* ===== APP PROMO ===== */
      .promo-wrap { padding: 48px 0; }
      .promo {
        background: linear-gradient(180deg, #1E293B 0%, #0F172A 100%);
        border-radius: 24px; padding: 40px 24px;
        color: #fff; position: relative; overflow: hidden;
        box-shadow: 0 12px 32px rgba(15,23,42,0.25);
      }
      @media (min-width: 768px) {
        .promo { padding: 56px 40px; }
      }
      .promo::before {
        content: ''; position: absolute; top: -60px; right: -60px;
        width: 220px; height: 220px; border-radius: 50%;
        background: radial-gradient(circle, rgba(34,197,94,0.28) 0%, transparent 65%);
        pointer-events: none;
      }
      .promo-inner { position: relative; text-align: center; }
      .promo-pill {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(34,197,94,0.15);
        color: var(--green);
        border: 1px solid rgba(34,197,94,0.3);
        padding: 5px 12px; border-radius: 9999px;
        font-size: 12px; font-weight: 600;
        margin-bottom: 18px;
      }
      .promo-pill .d {
        width: 6px; height: 6px; border-radius: 9999px;
        background: var(--green); display: inline-block;
      }
      .promo h2 {
        font-size: 26px; color: #fff;
        margin: 0 0 12px; line-height: 1.15;
      }
      .promo h2 .hl { color: var(--green); }
      .promo p {
        font-size: 14px; color: rgba(255,255,255,0.7);
        line-height: 1.55; margin: 0 auto 22px; max-width: 320px;
      }
      .promo-buttons {
        display: flex; flex-direction: column; gap: 10px;
        margin: 0 auto 22px; max-width: 340px;
      }
      @media (min-width: 520px) {
        .promo-buttons { flex-direction: row; justify-content: center; max-width: none; }
        .promo-btn { min-width: 220px; }
      }
      .promo-btn {
        background: var(--green); color: #fff;
        border: none; border-radius: 12px;
        padding: 14px 16px;
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        font-weight: 700; font-size: 15px;
        box-shadow: 0 8px 20px rgba(34,197,94,0.25);
        text-decoration: none;
      }
      .promo-btn svg { width: 18px; height: 18px; }
      .promo-btn:hover { background: var(--green-dark); }
      .works-with {
        display: flex; align-items: center; justify-content: center;
        gap: 10px; flex-wrap: wrap;
      }
      .works-label {
        font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 500;
      }
      .works-dots { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
      .wd {
        width: 32px; height: 32px; border-radius: 8px;
        background: rgba(255,255,255,0.08);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; overflow: hidden;
        transition: background 150ms ease, transform 150ms ease;
      }
      .wd:hover { background: rgba(255,255,255,0.15); transform: scale(1.08); }
      .wd img {
        width: 20px; height: 20px;
        object-fit: contain; border-radius: 4px;
        opacity: 0.85; transition: opacity 150ms ease;
      }
      .wd:hover img { opacity: 1; }

      /* ===== RESPONSIVE ===== */
      @media (min-width: 600px) {
        .grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (min-width: 900px) {
        .grid { grid-template-columns: repeat(3, 1fr); }
      }

      @media (prefers-reduced-motion: reduce) {
        .tool-card { opacity: 1; transform: none; transition: none; }
      }
    `;
  }

  _renderFeatured(tool) {
    if (!tool) return '';
    const motif = this._motifFor(tool);
    const fills = ['#16A34A', '#22C55E', '#4ADE80', '#86EFAC'];
    const rows = Array.isArray(motif.rows) ? motif.rows : [];
    const rowsHtml = rows.map((r, i) => {
      const fill = (i === rows.length - 1 && rows.length > 1) ? '#CBD5E1' : (fills[i] || '#86EFAC');
      const w = Math.max(0, Math.min(100, r.pct));
      return `<div class="feat-row"><span class="lab">${r.label}</span><span class="track"><span class="fill" style="width:${w}%;background:${fill};"></span></span></div>`;
    }).join('');
    const stats = [
      { n: '17+', l: 'peer-reviewed studies' },
      { n: '6', l: 'wearables compared' },
      { n: '9', l: 'health metrics' }
    ];
    return `
      <div class="featured-wrap">
        <header class="feat-head">
          <span class="feat-star"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2l2.39 6.94H22l-6.18 4.49L18.21 21 12 16.77 5.79 21l2.39-7.57L2 8.94h7.61L12 2z"/></svg></span>
          <div class="feat-head-text">
            <h2 class="feat-head-title">Featured Tool</h2>
            <p class="feat-head-sub">Our most-used comparison, backed by peer-reviewed data</p>
          </div>
          <span class="feat-rule"></span>
        </header>
        <div class="feat-card" data-open-tool="${tool.url || '#'}" role="button" tabindex="0" aria-label="${tool.title}">
          <div class="feat-scene">
            <div class="feat-panel">
              <div class="feat-panel-cap">Accuracy vs lab · 9 metrics</div>
              <div class="feat-rows">${rowsHtml}</div>
            </div>
          </div>
          <div class="feat-content">
            <span class="feat-pop">Most Popular</span>
            <h2>${tool.title}</h2>
            <p class="feat-blurb">${tool.description || ''}</p>
            <div class="feat-stats">
              ${stats.map(s => `<div><div class="n">${s.n}</div><div class="l">${s.l}</div></div>`).join('')}
            </div>
            <span class="feat-open">Open tool ${this._getIcon('arrow-right')}</span>
          </div>
        </div>
      </div>
    `;
  }

  _renderCard(tool) {
    const motif = this._motifFor(tool);
    return `
      <div class="tool-card" data-open-tool="${tool.url || '#'}" role="button" tabindex="0" aria-label="${tool.title}">
        <div class="card-media">
          <div class="card-panel">
            <div class="panel-cap">${motif.caption || ''}</div>
            ${this._motifBody(motif)}
          </div>
        </div>
        <div class="card-body">
          <h3 class="card-title">${tool.title}</h3>
          <p class="card-blurb">${tool.description || ''}</p>
          <div class="card-foot2">
            <span class="card-meta">${this._metaFor(tool)}</span>
            <span class="card-open">Open ${this._getIcon('arrow-right')}</span>
          </div>
        </div>
      </div>
    `;
  }

  _renderCategorySection(group) {
    const { id, meta, tools } = group;
    return `
      <section class="cat-section" data-cat-id="${id}" aria-labelledby="cat-${id}-title">
        <div class="cat-head">
          <div class="cat-head-icon">${this._getIcon(meta.icon)}</div>
          <div class="cat-head-text">
            <div class="cat-head-row">
              <h2 class="cat-head-label" id="cat-${id}-title">${meta.label}</h2>
              <span class="cat-head-count">${tools.length} ${tools.length === 1 ? 'tool' : 'tools'}</span>
            </div>
            ${meta.lede ? `<p class="cat-head-lede">${meta.lede}</p>` : ''}
          </div>
        </div>
        <div class="grid">
          ${tools.map(t => this._renderCard(t)).join('')}
        </div>
      </section>
    `;
  }

  render() {
    const logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    const appStoreUrl = 'https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589';
    const playStoreUrl = 'https://www.kygo.app/android';

    const featured = this._featured();
    const grouped = this._groupedByCategory();
    // The featured tool gets its own card up top — strip it from its category bucket
    const groupedNoFeatured = featured
      ? grouped.map(g => ({ ...g, tools: g.tools.filter(t => t !== featured) }))
                .filter(g => g.tools.length > 0)
      : grouped;

    const totalCategories = grouped.length;

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}${this._styles2()}${this._styles3()}</style>

      <section class="sec sec-hero">
        <div class="wrap">
          <header class="page-header">
            <a class="brand" href="https://www.kygo.app">
              <img class="brand-logo" src="${logoUrl}" alt="Kygo Health" />
              <span class="brand-name">Kygo</span>
              <span class="brand-sub">/ Tools</span>
            </a>
            <button class="icon-btn" aria-label="Share" data-share>${this._getIcon('share')}</button>
          </header>

          <div class="hero">
            <div class="kicker-pill">${this._getIcon('sparkles')} Free Health Tools</div>
            <h1>Tools to understand <span class="hl">your well-being.</span></h1>
            <p>Research-backed calculators and factor explorers. No signup. Free forever.</p>
            <div class="mini-stats">
              <span class="item">${this._getIcon('check')} ${this._tools.length} tools</span>
              <span class="dot">•</span>
              <span class="item">${this._getIcon('check')} ${totalCategories} ${totalCategories === 1 ? 'category' : 'categories'}</span>
              <span class="dot">•</span>
              <span class="item">${this._getIcon('check')} No signup</span>
            </div>
          </div>
        </div>
      </section>

      <section class="sec sec-tools">
        <div class="wrap">
          ${featured ? this._renderFeatured(featured) : ''}
          ${groupedNoFeatured.length
            ? groupedNoFeatured.map(g => this._renderCategorySection(g)).join('')
            : `<div class="empty">
                 <div class="empty-icon">${this._getIcon('sparkles')}</div>
                 <div class="empty-title">No tools yet</div>
                 <div class="empty-sub">Check back soon.</div>
               </div>`}
        </div>
      </section>

      <section class="sec sec-promo">
        <div class="wrap">
          <div class="promo-wrap">
            <div class="promo">
              <div class="promo-inner">
                <div class="promo-pill"><span class="d"></span> iOS & Android</div>
                <h2>These tools are a snapshot.<br/><span class="hl">Kygo is the full picture.</span></h2>
                <p>Connect your wearable. Log your meals. See how food affects your sleep, HRV, energy, and recovery.</p>
                <div class="promo-buttons">
                  <a class="promo-btn" href="${appStoreUrl}" target="_blank" rel="noopener">${this._getIcon('apple')} Download for iOS</a>
                  <a class="promo-btn" href="${playStoreUrl}" target="_blank" rel="noopener">${this._getIcon('playstore')} Download for Android</a>
                </div>
                <div class="works-with">
                  <span class="works-label">Works with</span>
                  <div class="works-dots">
                    <span class="wd" title="Oura Ring"><img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura Ring" loading="lazy"/></span>
                    <span class="wd" title="Apple Health"><img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple Health" loading="lazy"/></span>
                    <span class="wd" title="Fitbit"><img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit" loading="lazy"/></span>
                    <span class="wd" title="Garmin"><img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin" loading="lazy"/></span>
                    <span class="wd" title="Whoop"><img src="https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png" alt="Whoop" loading="lazy"/></span>
                    <span class="wd" title="Health Connect"><img src="https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png" alt="Health Connect" loading="lazy"/></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  _injectStructuredData() {
    if (document.querySelector('script[data-kygo-tools-ld]')) return;
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Kygo Health Free Tools',
      'description': 'Free research-backed health tools by Kygo Health. Compare wearable accuracy, explore sleep and HRV factors, analyze calorie burn accuracy, and more.',
      'url': 'https://www.kygo.app/tools',
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': this._tools.map((t, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'name': t.title,
          'description': t.description || '',
          'url': t.url ? (t.url.startsWith('http') ? t.url : `https://www.kygo.app${t.url.startsWith('/') ? '' : '/'}${t.url}`) : 'https://www.kygo.app/tools'
        }))
      },
      'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' }
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-kygo-tools-ld', '');
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }
}

if (!customElements.get('kygo-tools-page')) {
  customElements.define('kygo-tools-page', KygoToolsPage);
}
