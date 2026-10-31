/**
 * Kygo Health - State of Wearable Accuracy 2026 download (thank-you) page Custom Element for Wix
 * Tag name: kygo-report-download
 * Page: https://www.kygo.app/report-download (set to noindex in the Wix page SEO settings)
 *
 * Layout and copy follow the approved "Thank-you page" artboard of the capture designs
 * (2026-10-25). Reached from the landing-page redirect and from the link in nurture email 1.
 *
 * Attributes / Wix settings:
 *   pdf-url  - the report PDF. Until it is set the "Download the PDF" button stays disabled
 *              (a real <button disabled>, never a link to "#"). Set it from page code with
 *              $w('CustomElement').setAttribute('pdf-url', '<url>').
 *
 * Below the download: the shared <kygo-picks-card focus="all"> (kygo-picks-card.js, loaded on
 * demand), then the standard related-tools and related-reading modules, copied verbatim from
 * the tool pages (docs/tool-page-playbook.md section 3).
 *
 * Sizing: Wix gives the custom element a min-height equal to its editor box, so the element
 * clears it inline and sizes to its content. :host uses overflow-x: clip, not hidden, so the
 * element never becomes its own vertical scroll box.
 *
 * Tracking: a click on the download button dispatches `reportDownload` (bubbles + composed,
 * plain-data detail) which kygo-tracking.js mirrors to GA4 as `report_download`. Picks card,
 * tool and post cards carry the standard data-action attributes (related_tool_click,
 * blog_post_click). No JSON-LD: the page is noindex, so structured data would never be used.
 */

/** Injects accessible text into light DOM so crawlers and AI tools can read component content */
function __seo(el, text) {
  if (el.querySelector('[data-seo]')) return;
  const d = document.createElement('div');
  d.setAttribute('data-seo', '');
  d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
  d.textContent = text;
  el.appendChild(d);
}

/** Loads the shared kygo-picks-card element on demand. Wix embeds this file on its
 *  own, so the card script has to come along rather than be assumed present. */
function __ensureKygoPicksCard() {
  if (customElements.get('kygo-picks-card')) return;
  if (document.querySelector('script[data-kygo-picks-card-loader]')) return;
  const s = document.createElement('script');
  s.src = 'https://kygo-health.github.io/kygo-elements/kygo-picks-card.js';
  s.setAttribute('data-kygo-picks-card-loader', '');
  s.async = true;
  document.head.appendChild(s);
}

(function () {
  'use strict';

  const ASSETS = 'https://kygo-health.github.io/kygo-elements/assets/sowa/';

  const DOWNLOAD_ICON = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"></path></svg>';

  class KygoReportDownload extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._settings = {};
    }

    connectedCallback() {
      // Size to the content, not to the Wix editor box (Wix sets min-height from it).
      this.style.minHeight = '0';
      this.style.height = 'auto';
      __ensureKygoPicksCard();
      this._parseWixAttributes();
      this.render();
      this._attachEventListeners();
      __seo(this, 'Your State of Wearable Accuracy 2026 report is ready. The free 78-page report from Kygo Health ranks seven wearable brands on eleven metrics from 71 peer-reviewed studies. ' +
        'Start with the verdict on page 7, find your brand, then go straight to the metrics you care about. ' +
        'Shopping for a wearable? Kygo Picks lists the most accurate pick for each metric, ranked on published studies: ' +
        'Oura Ring 5 for sleep and HRV, Apple Watch Series 12 for workout heart rate, Garmin Forerunner 970 for steps and VO2 max, and Google Pixel Watch 5 for calories.');
    }

    disconnectedCallback() {}

    static get observedAttributes() { return ['wixsettings', 'pdf-url']; }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      if (name === 'wixsettings') this._parseWixAttributes();
      if (this.shadowRoot.innerHTML) this._updateDownload();
    }

    _parseWixAttributes() {
      try {
        const wixconfig = this.getAttribute('wixconfig');
        const wixsettings = this.getAttribute('wixsettings');
        if (wixconfig) this._config = JSON.parse(wixconfig);
        if (wixsettings) this._settings = JSON.parse(wixsettings);
      } catch (e) {
        console.warn('KygoReportDownload: Could not parse Wix attributes', e);
      }
    }

    _getSetting(key, fallback) {
      return this._settings[key] || this.getAttribute(key) || fallback;
    }

    /** A usable PDF URL, or '' (never "#" or a javascript: URL). */
    _pdfUrl() {
      const raw = (this._getSetting('pdf-url', '') || this._getSetting('pdfUrl', '') || '').trim();
      if (!raw || raw === '#') return '';
      try {
        const u = new URL(raw, window.location.href);
        return /^https?:$/.test(u.protocol) ? u.href : '';
      } catch (e) {
        return '';
      }
    }

    _downloadHtml() {
      const url = this._pdfUrl();
      if (url) {
        return `<a class="dl" data-download href="${url.replace(/"/g, '&quot;')}" target="_blank" rel="noopener">${DOWNLOAD_ICON}Download the PDF</a>`;
      }
      return `<button class="dl" data-download type="button" disabled aria-disabled="true" title="The PDF link is not set yet">${DOWNLOAD_ICON}Download the PDF</button>`;
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; min-width: 0; }
          :host {
            --dark: #0F172A;
            --light: #F8FAFC;
            --green: #22C55E;
            --green-dark: #16A34A;
            --green-text: #15803D;
            --green-light: rgba(34, 197, 94, 0.1);
            --gray-200: #E2E8F0;
            --gray-600: #475569;
            display: block;
            width: 100%;
            overflow-x: hidden;
            overflow-x: clip;
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #FFFFFF;
            color: var(--gray-600);
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
          }
          h1, h2, .pill { font-family: 'Space Grotesk', sans-serif; }
          img { display: block; max-width: 100%; height: auto; }

          .sec { padding: 48px 20px; background: #FFFFFF; }
          .sec.gray { background: var(--light); }
          .hero-grid { max-width: 1200px; margin: 0 auto; display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(460px, 100%), 1fr)); gap: 40px; align-items: center; }
          .copy { display: flex; flex-direction: column; align-items: flex-start; gap: 20px; }
          .pill { display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border-radius: 999px;
            background: var(--green-light); font-size: 12px; line-height: normal; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: var(--dark); }
          .pill .dot { width: 7px; height: 7px; border-radius: 999px; background: var(--green); }
          h1 { font-size: 36px; line-height: 1.08; font-weight: 700; letter-spacing: -0.02em; color: var(--dark); }
          h1 span { color: var(--green-dark); }
          .lede { max-width: 52ch; font-size: 16px; line-height: 1.55; color: var(--gray-600); text-wrap: pretty; }
          .dl-wrap { margin-top: 4px; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
          .dl { display: inline-flex; align-items: center; gap: 10px; min-height: 52px; padding: 0 24px; border: 0; border-radius: 12px;
            background: var(--green); box-shadow: 0 8px 20px rgba(34, 197, 94, 0.25); color: var(--dark);
            font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; text-decoration: none; cursor: pointer;
            transition: background 160ms ease, transform 120ms ease; }
          a.dl:hover { background: #2BD167; }
          a.dl:active { transform: translateY(1px); }
          .dl:focus-visible { outline: 3px solid rgba(34, 197, 94, 0.45); outline-offset: 2px; }
          button.dl[disabled] { background: var(--gray-200); color: #64748B; box-shadow: none; cursor: not-allowed; }
          .dl-note { font-size: 13px; line-height: 1.5; color: var(--gray-600); }
          .cover { position: relative; padding: 8px; }
          .cover img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 12px;
            box-shadow: 0 20px 48px rgba(15, 23, 42, 0.22); transform: rotate(-2deg); background: var(--dark); }

          .picks-wrap { max-width: 1100px; margin: 0 auto; }
          .picks-wrap kygo-picks-card { display: block; }

          @media (min-width: 768px) {
            .sec { padding: 72px 24px; }
            .hero-grid { gap: 56px; }
            h1 { font-size: 48px; }
            .lede { font-size: 18px; }
            .cover { padding: 16px; }
          }
          @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
        </style>

        <section class="sec" aria-labelledby="rd-h1">
          <div class="hero-grid">
            <div class="copy">
              <p class="pill"><span class="dot" aria-hidden="true"></span>Also sent to your inbox</p>
              <h1 id="rd-h1">Your report is <span>ready.</span></h1>
              <p class="lede">The State of Wearable Accuracy 2026 is 78 pages. Start with the verdict on page 7, find your brand, then go straight to the metrics you care about.</p>
              <div class="dl-wrap">
                <span data-dl-slot>${this._downloadHtml()}</span>
                <p class="dl-note">We also emailed you this link, so you can come back to it.</p>
              </div>
            </div>
            <div class="cover">
              <img src="${ASSETS}sowa-cover.webp" alt="Report cover: State of Wearable Accuracy 2026" width="1280" height="720" />
            </div>
          </div>
        </section>

        <section class="sec gray">
          <div class="picks-wrap">
            <kygo-picks-card focus="all" slug="report-download"></kygo-picks-card>
          </div>
        </section>

        ${this._renderRelatedTools()}

        ${this._renderRelatedPosts('gray')}
      `;
    }

    // Related tools · Kygo standard module (docs/tool-page-playbook.md section 3).
    // Card copy is the canonical copy for each destination, reused verbatim.
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
          blurb: 'Which wearable is most accurate for sleep vs a lab PSG? Compare 7 devices head to head.',
          url: 'https://www.kygo.app/tools/sleep-tracker-accuracy',
          meta: 'Wearables · 14 sources',
          motif: { motif: 'compare', caption: 'Sleep staging vs PSG', rows: [{ label: 'Oura', pct: 90 }, { label: 'Apple', pct: 78 }, { label: 'Fitbit', pct: 64 }, { label: 'Garmin', pct: 36 }] }
        },
        {
          title: 'Most Accurate Heart Rate Wearable',
          blurb: '10 wearables ranked against an ECG or chest strap, and why arm motion is what breaks them.',
          url: 'https://www.kygo.app/tools/heart-rate-accuracy',
          meta: 'Wearables · 10 devices',
          motif: { motif: 'compare', caption: 'Error vs chest strap', rows: [{ label: 'Fitbit', pct: 92 }, { label: 'Apple', pct: 86 }, { label: 'Oura', pct: 62 }, { label: 'Xiaomi', pct: 44 }] }
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

    // Related reading · the report's companion post first, then the pillar post
    // and a sleep bridge. Copy from docs/blog-cross-links.md.
    _relatedPosts() {
      return [
        { slug: 'are-fitness-trackers-accurate',
          title: 'Are Fitness Trackers Accurate? What 71 Studies Show',
          blurb: 'Seven brands, eleven metrics, 71 peer-reviewed studies. Where your tracker reads close to a lab and where it is only estimating.',
          cat: 'Devices & Buying Guides', min: 9, img: '273a63_1d4de66e8d4a4a29b53a2602d289c130~mv2.png' },
        { slug: 'what-s-the-most-accurate-wearable-data-a-2024-2025-study-breakdown-by-device',
          title: 'What’s the Most Accurate Wearable? 45+ Studies, 7 Brands, Ranked (2026)',
          blurb: '45+ independent studies, seven brands, one podium per metric. Which wearable reads closest to the lab for sleep, HRV, heart rate and steps.',
          cat: 'Wearables & Data', min: 10, img: '273a63_f6d12b66837342a6a552e4e3d9297fef~mv2.png' },
        { slug: 'most-accurate-sleep-tracker-oura-vs-apple-vs-fitbit-2026',
          title: 'Most Accurate Sleep Tracker? Oura vs Apple vs Fitbit vs Garmin vs Whoop (2026)',
          blurb: 'Every tracker calls itself accurate. Measured against lab polysomnography, the ranking changes completely on one thing most reviews ignore.',
          cat: 'Sleep', min: 8, img: '273a63_4c319b0df429425296d15711c577310b~mv2.png' }
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

    _updateDownload() {
      const slot = this.shadowRoot.querySelector('[data-dl-slot]');
      if (slot) { slot.innerHTML = this._downloadHtml(); this._attachEventListeners(); }
    }

    _attachEventListeners() {
      const dl = this.shadowRoot.querySelector('a[data-download]');
      if (!dl || dl._kygoBound) return;
      dl._kygoBound = true;
      dl.addEventListener('click', () => {
        // GA4 report_download via kygo-tracking.js (plain-data detail, no PII).
        this.dispatchEvent(new CustomEvent('reportDownload', {
          detail: { source: 'report-download', component: 'kygo-report-download', report: 'sowa-2026' },
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  if (!customElements.get('kygo-report-download')) {
    customElements.define('kygo-report-download', KygoReportDownload);
  }
})();
