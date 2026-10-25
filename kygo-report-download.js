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
 * Tracking: a click on the download button dispatches `reportDownload` (bubbles + composed,
 * plain-data detail) which kygo-tracking.js mirrors to GA4 as `report_download`.
 * No JSON-LD: the page is noindex, so structured data would never be used.
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

(function () {
  'use strict';

  const ASSETS = 'https://kygo-health.github.io/kygo-elements/assets/sowa/';
  const PICKS_URL = 'https://www.kygo.app/best-wearables';

  const PICKS = [
    { letter: 'O', goal: 'Sleep and HRV', name: 'Oura Ring 5', anchor: 'best-sleep', slug: 'sleep' },
    { letter: 'A', goal: 'Workout heart rate', name: 'Apple Watch Series 12', anchor: 'exercise-hr', slug: 'exercise-hr' },
    { letter: 'G', goal: 'Steps and VO2 max', name: 'Garmin Forerunner 970', anchor: 'best-training', slug: 'training' },
    { letter: 'G', goal: 'Calories', name: 'Google Pixel Watch 5', anchor: 'calories', slug: 'calories' }
  ];

  const DOWNLOAD_ICON = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"></path></svg>';
  const ARROW = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>';
  const CHEVRON = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>';

  class KygoReportDownload extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._settings = {};
    }

    connectedCallback() {
      this._parseWixAttributes();
      this.render();
      this._attachEventListeners();
      __seo(this, 'Your State of Wearable Accuracy 2026 report is ready. The free 77-page report from Kygo Health ranks seven wearable brands on eleven metrics from 71 peer-reviewed studies. ' +
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
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #FFFFFF;
            color: var(--gray-600);
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
          }
          h1, h2, .pill, .eyebrow, .pick-letter, .pick-name { font-family: 'Space Grotesk', sans-serif; }
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
          .dl:focus-visible, .picks a:focus-visible { outline: 3px solid rgba(34, 197, 94, 0.45); outline-offset: 2px; }
          button.dl[disabled] { background: var(--gray-200); color: #64748B; box-shadow: none; cursor: not-allowed; }
          .dl-note { font-size: 13px; line-height: 1.5; color: var(--gray-600); }
          .cover { position: relative; padding: 8px; }
          .cover img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 12px;
            box-shadow: 0 20px 48px rgba(15, 23, 42, 0.22); transform: rotate(-2deg); background: var(--dark); }

          .picks-wrap { max-width: 1100px; margin: 0 auto; }
          .picks { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(380px, 100%), 1fr)); gap: 24px; align-items: center;
            padding: 24px 20px; border-radius: 20px; background: var(--dark); color: #FFFFFF; }
          .picks-copy { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
          .eyebrow { font-size: 11.5px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: #6EE7A0; }
          .picks h2 { font-size: 24px; line-height: 1.15; font-weight: 700; letter-spacing: -0.01em; color: #FFFFFF; }
          .picks-sub { max-width: 40ch; font-size: 15px; line-height: 1.5; color: rgba(255, 255, 255, 0.75); }
          .all { margin-top: 8px; display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 18px; border-radius: 10px;
            background: var(--green); color: var(--dark); font-size: 15px; font-weight: 700; text-decoration: none; }
          .all:hover { background: #2BD167; }
          .pick-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr)); gap: 10px; }
          .pick { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 12px; background: #FFFFFF;
            color: var(--dark); text-decoration: none; transition: transform 140ms ease, box-shadow 140ms ease; }
          .pick:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25); }
          .pick-letter { flex: 0 0 48px; width: 48px; height: 48px; border-radius: 10px; background: #F1F5F9;
            display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; color: var(--dark); }
          .pick-text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
          .pick-goal { font-size: 12px; line-height: 1.5; font-weight: 600; color: var(--green-text); }
          .pick-name { font-size: 15px; line-height: 1.2; font-weight: 700; }

          @media (min-width: 768px) {
            .sec { padding: 72px 24px; }
            .hero-grid { gap: 56px; }
            h1 { font-size: 48px; }
            .lede { font-size: 18px; }
            .cover { padding: 16px; }
            .picks { gap: 28px; padding: 28px; }
            .picks h2 { font-size: 28px; }
          }
          @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
        </style>

        <section class="sec" aria-labelledby="rd-h1">
          <div class="hero-grid">
            <div class="copy">
              <p class="pill"><span class="dot" aria-hidden="true"></span>Also sent to your inbox</p>
              <h1 id="rd-h1">Your report is <span>ready.</span></h1>
              <p class="lede">The State of Wearable Accuracy 2026 is 77 pages. Start with the verdict on page 7, find your brand, then go straight to the metrics you care about.</p>
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
            <aside class="picks" aria-label="Kygo Picks">
              <div class="picks-copy">
                <p class="eyebrow">Kygo Picks</p>
                <h2>Shopping for a wearable?</h2>
                <p class="picks-sub">The most accurate pick for each metric, ranked on published studies.</p>
                <a class="all" href="${PICKS_URL}" data-action="picks-link" data-track-position="report-download" data-track-label="report-download-picks-all">See all picks${ARROW}</a>
              </div>
              <div class="pick-grid">
                ${PICKS.map(p => `
                  <a class="pick" href="${PICKS_URL}#${p.anchor}" data-action="picks-link" data-track-position="report-download" data-track-label="report-download-picks-${p.slug}">
                    <span class="pick-letter" aria-hidden="true">${p.letter}</span>
                    <span class="pick-text"><span class="pick-goal">${p.goal}</span><span class="pick-name">${p.name}</span></span>
                    ${CHEVRON}
                  </a>`).join('')}
              </div>
            </aside>
          </div>
        </section>
      `;
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
