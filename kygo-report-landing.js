/**
 * Kygo Health - State of Wearable Accuracy 2026 landing page Custom Element for Wix
 * Tag name: kygo-report-landing
 * Page: https://www.kygo.app/state-of-wearable-accuracy
 *
 * The email gate for the free report. Layout and copy follow the approved capture designs
 * (Design canvas "State of Wearable Accuracy Capture", artboards Main + Mobile, 2026-10-25).
 *
 * Form contract (the kygo-contact.js pattern):
 *   1. On submit the component dispatches `reportSubscribe` (bubbles + composed) with a
 *      plain-data detail { email, source: 'report-landing' }.
 *   2. Wix page code POSTs that to /_functions/subscribe (post_subscribe, Subscribers
 *      collection) and reports back with setAttribute('data-form-result', 'success' | 'error:<msg>').
 *   3. On success the component fires the site-wide `subscribe` event (GA4 email_subscribe,
 *      source=report-landing, no email in the detail) and redirects to redirect-url
 *      (default https://www.kygo.app/report-download).
 *   4. If the host never answers within 10 s the visitor sees a real error, never a fake success.
 *
 * Attributes / Wix settings:
 *   redirect-url  - where to go after a confirmed subscribe (default /report-download).
 *   source        - Subscribers.source + GA4 source (default "report-landing").
 *
 * No Amazon or affiliate links on this page. No FAQ schema and no "most accurate" headings:
 * the wearable-accuracy hub owns those queries.
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
  const PAGE_URL = 'https://www.kygo.app/state-of-wearable-accuracy';
  const DEFAULT_REDIRECT = 'https://www.kygo.app/report-download';
  const ERROR_MSG = "Hmm, that didn't go through. Please try again, or email support@kygo.app.";

  const STATS = [
    { n: '77', label: 'Pages of findings' },
    { n: '71', label: 'Peer-reviewed studies' },
    { n: '7', label: 'Wearable brands ranked' },
    { n: '11', label: 'Metrics compared' }
  ];

  const INSIDE = [
    { img: 'sowa-metric-chart.webp', alt: 'Report page: sleep stages agreement with a lab sleep study, by brand',
      title: 'Metric charts.', text: 'Every brand on one chart, ranked by its error.' },
    { img: 'sowa-brand-profile.webp', alt: 'Report page: Oura Ring brand analysis across every metric',
      title: 'Brand profiles.', text: 'Where each brand is best, worst and untested.' },
    { img: 'sowa-buyers-guide.webp', alt: "Report page: buyer's guide, top picks by goal",
      title: "Buyer's guide.", text: 'The pick for sleep, recovery, training and more.' }
  ];

  // Every figure here must match the Finalized tab of the "Wearable Accuracy by Metric" doc.
  const NUMBERS = [
    { n: '5.96%', text: 'Oura Ring 4 overnight HRV error vs chest-strap ECG (Dial 2025).' },
    { n: '52.4%', text: 'Share of awake time Apple Watch Series 8 caught in a lab sleep study (Robbins 2024, Oura-funded).' },
    { n: '+43.8 min', text: 'Extra sleep Garmin Forerunner 245 Music counted per night vs a sleep lab.' },
    { n: 'Over 9%', text: 'Calories: no brand came within 9% on the max treadmill test, and weight training errors ran from 41.7% to 114.9%.' },
    { n: '6.7% vs 56%', text: 'Garmin VO2 max error with a chest strap vs wrist only.' }
  ];

  const RULES = [
    { b: 'Numbers decide;', t: ' each sub-measure is ranked and ranks combine with equal weight.' },
    { b: 'Brand-funded studies are marked', t: ' and count unless independent tests disagree.' },
    { b: 'Only the feature a buyer gets,', t: ' and only peer-reviewed tests.' },
    { b: 'Newest model', t: ' with a published number.' },
    { b: 'Head-to-head studies beat single-brand studies', t: ' when they disagree.' },
    { b: 'Healthy adults decide the order;', t: ' clinical samples check it.' }
  ];

  const NOTE = 'One email with the PDF, then four short follow-ups. Unsubscribe anytime.';

  class KygoReportLanding extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._settings = {};
      this._activeForm = null;
    }

    connectedCallback() {
      this._parseWixAttributes();
      this.render();
      this._attachEventListeners();
      __seo(this, 'State of Wearable Accuracy 2026: a free 77-page report from Kygo Health. ' +
        'Seven wearable brands (Oura, Apple Watch, Fitbit / Google, Garmin, Samsung, WHOOP and Polar) ranked on eleven metrics ' +
        'using only the numbers from 71 peer-reviewed validation studies. Inside: metric charts with every brand on one chart ranked by its error, ' +
        "brand profiles showing where each brand is best, worst and untested, and a buyer's guide with the pick for sleep, recovery, training and more. " +
        'Five numbers from the report: Oura Ring 4 overnight HRV error was 5.96% vs chest-strap ECG (Dial 2025). ' +
        'Apple Watch Series 8 caught 52.4% of awake time in a lab sleep study (Robbins 2024, Oura-funded). ' +
        'Garmin Forerunner 245 Music counted 43.8 extra minutes of sleep per night vs a sleep lab. ' +
        'Calories: no brand came within 9% on the max treadmill test, and weight training errors ran from 41.7% to 114.9%. ' +
        'Garmin VO2 max error was 6.7% with a chest strap vs 56% wrist only. ' +
        'How the medals were decided: numbers decide, brand-funded studies are marked, only the feature a buyer gets and only peer-reviewed tests, ' +
        'newest model with a published number, head-to-head studies beat single-brand studies, healthy adults decide the order. ' +
        "No brand paid for this report or saw it before publication. Every figure comes from the paper's own tables. " +
        'No brand wins every metric. Kygo connects them all and uses the most accurate source for each. Get the PDF free by email. Updated October 2026.');
      this._injectStructuredData();
    }

    disconnectedCallback() {
      clearTimeout(this._submitTimeout);
      clearTimeout(this._redirectTimeout);
    }

    static get observedAttributes() { return ['wixsettings', 'redirect-url', 'source', 'data-form-result']; }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      if (name === 'wixsettings') { this._parseWixAttributes(); }
      // Result from the Wix page code (never a callback: Wix bridges events by structured clone).
      if (name === 'data-form-result' && newValue) {
        clearTimeout(this._submitTimeout);
        if (newValue === 'success') this._onSuccess();
        else this._showError(newValue.startsWith('error:') ? (newValue.substring(6) || ERROR_MSG) : ERROR_MSG);
        this.removeAttribute('data-form-result');
      }
    }

    _parseWixAttributes() {
      try {
        const wixconfig = this.getAttribute('wixconfig');
        const wixsettings = this.getAttribute('wixsettings');
        if (wixconfig) this._config = JSON.parse(wixconfig);
        if (wixsettings) this._settings = JSON.parse(wixsettings);
      } catch (e) {
        console.warn('KygoReportLanding: Could not parse Wix attributes', e);
      }
    }

    _getSetting(key, fallback) {
      return this._settings[key] || this.getAttribute(key) || fallback;
    }

    _form(id, dark) {
      return `
        <form class="form${dark ? ' form-dark' : ''}" data-form novalidate aria-label="Get the free report">
          <label for="${id}">Email address</label>
          <div class="field-row">
            <input id="${id}" type="email" name="email" required placeholder="you@email.com" autocomplete="email" />
            <button type="submit">Send me the report</button>
          </div>
          <p class="form-error" role="alert" hidden></p>
          <p class="form-note">${NOTE}</p>
        </form>`;
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
            --green-tint: #DCFCE7;
            --gray-200: #E2E8F0;
            --gray-400: #94A3B8;
            --gray-500: #64748B;
            --gray-600: #475569;
            --shadow-md: 0 8px 24px rgba(15, 23, 42, 0.06);
            display: block;
            width: 100%;
            overflow-x: hidden;
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #FFFFFF;
            color: var(--gray-600);
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
          }
          h1, h2, .stat-n, .num-n, .pill, .rule-n { font-family: 'Space Grotesk', sans-serif; }
          img { display: block; max-width: 100%; height: auto; }

          /* Sections: mobile first (Mobile artboard), desktop at 768px (Main artboard) */
          .sec { padding: 48px 20px; background: #FFFFFF; }
          .sec.gray { background: var(--light); }
          .wrap { max-width: 1200px; margin: 0 auto; }
          .sec h2 { font-size: 26px; line-height: 1.15; font-weight: 600; letter-spacing: -0.01em; color: var(--dark); }

          /* Hero */
          .hero { padding: 36px 20px 40px; }
          .hero-grid { display: grid; grid-template-columns: minmax(0, 1fr); row-gap: 20px;
            grid-template-areas: "pill" "h1" "vis" "form" "lead" "stats"; }
          .pill { grid-area: pill; justify-self: start; display: inline-flex; align-items: center; gap: 8px;
            padding: 7px 12px; border-radius: 999px; background: var(--green-light); line-height: normal;
            font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: var(--dark); }
          .pill .dot { width: 7px; height: 7px; border-radius: 999px; background: var(--green); }
          h1 { grid-area: h1; font-size: 30px; line-height: 1.12; font-weight: 700; letter-spacing: -0.02em; color: var(--dark); text-wrap: balance; }
          h1 .br { display: none; }
          .lead { grid-area: lead; display: flex; flex-direction: column; gap: 8px; }
          .lead p { text-wrap: pretty; }
          .lead .l1 { font-size: 16px; line-height: 1.55; max-width: 56ch; }
          .lead .l2 { font-size: 14px; line-height: 1.55; max-width: 60ch; }
          .hero .form { grid-area: form; }
          .vis { grid-area: vis; position: relative; height: 220px; margin: 4px 0; }
          .vis img { position: absolute; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 10px; }
          .vis .back { top: 0; right: 0; width: 80%; border: 1.5px solid var(--gray-200);
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08); transform: rotate(4deg); background: #FFFFFF; }
          .vis .front { bottom: 6px; left: 0; width: 86%; box-shadow: 0 16px 36px rgba(15, 23, 42, 0.22);
            transform: rotate(-3deg); background: var(--dark); }
          .stats { grid-area: stats; list-style: none; margin-top: 12px; padding-top: 24px; border-top: 1px solid var(--gray-200);
            display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 16px; }
          .stat-n { font-size: 34px; line-height: 1; font-weight: 700; letter-spacing: -0.68px; color: var(--green-dark); }
          .stat-l { margin-top: 8px; font-size: 11px; line-height: 1.4; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: var(--gray-500); }

          /* Form */
          .form { display: flex; flex-direction: column; gap: 8px; width: 100%; }
          .form label { font-size: 14px; line-height: normal; font-weight: 600; color: var(--dark); }
          .field-row { display: flex; flex-direction: column; gap: 10px; }
          .form input { width: 100%; height: 52px; padding: 0 16px; border: 1.5px solid var(--gray-400); border-radius: 12px;
            background: #FFFFFF; font-family: 'DM Sans', sans-serif; font-size: 16px; color: var(--dark); outline: none;
            transition: border-color 160ms ease, box-shadow 160ms ease; }
          .form input::placeholder { color: var(--gray-500); }
          .form input:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.18); }
          .form button { width: 100%; height: 52px; padding: 0 24px; border: 0; border-radius: 12px; background: var(--green);
            box-shadow: 0 8px 20px rgba(34, 197, 94, 0.25); color: var(--dark); font-family: 'DM Sans', sans-serif;
            font-size: 15px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: background 160ms ease, transform 120ms ease; }
          .form button:hover { background: #2BD167; }
          .form button:active { transform: translateY(1px); }
          .form button:focus-visible, .form input:focus-visible { outline: 3px solid rgba(34, 197, 94, 0.45); outline-offset: 2px; }
          .form button[disabled] { opacity: 0.7; cursor: progress; }
          .form-note { font-size: 13px; line-height: 1.5; color: var(--gray-600); }
          .form-error { font-size: 13px; line-height: 1.5; font-weight: 600; color: #B91C1C; }
          .form-dark .form-error { color: #FCA5A5; }

          /* Inside the report */
          .inside { display: flex; flex-direction: column; gap: 20px; }
          .figs { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; }
          figure { background: #FFFFFF; border: 1.5px solid var(--gray-200); border-radius: 18px; box-shadow: var(--shadow-md);
            overflow: hidden; display: flex; flex-direction: column; }
          figure img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-bottom: 1.5px solid var(--gray-200); }
          figcaption { padding: 14px 16px; font-size: 14px; line-height: 1.5; color: var(--gray-600); }
          figcaption strong, .rule strong { color: var(--dark); font-weight: 600; }

          /* Five numbers */
          .numbers { display: flex; flex-direction: column; gap: 16px; }
          .numbers h2 { margin-bottom: 4px; }
          .num-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; }
          .num { background: #FFFFFF; border: 1.5px solid var(--gray-200); border-radius: 18px; box-shadow: var(--shadow-md);
            padding: 18px 20px; display: flex; flex-direction: column; gap: 6px; }
          .num-n { font-size: 30px; line-height: 1.05; font-weight: 700; letter-spacing: -0.02em; color: var(--green-dark); }
          .num-t { font-size: 14px; line-height: 1.5; color: var(--gray-600); }

          /* Rules */
          .rules-sec { display: flex; flex-direction: column; gap: 12px; }
          .rules-sec h2 { margin-bottom: 4px; }
          .rules { list-style: none; display: grid; grid-template-columns: minmax(0, 1fr); }
          .rule { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--gray-200); }
          .rule-n { flex: 0 0 auto; width: 28px; height: 28px; border-radius: 999px; background: var(--green-tint);
            display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--dark); }
          .rule-t { font-size: 14px; line-height: 1.5; color: var(--gray-600); padding-top: 3px; }

          /* Bottom CTA */
          .cta-wrap { max-width: 1100px; margin: 0 auto; }
          .cta { position: relative; overflow: hidden; background: var(--dark); border-radius: 24px; padding: 40px 22px;
            display: flex; flex-direction: column; align-items: center; text-align: center; }
          .glow { position: absolute; width: 320px; height: 320px; pointer-events: none; }
          .glow-a { top: -140px; right: -140px; background: radial-gradient(closest-side, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0)); }
          .glow-b { bottom: -160px; left: -140px; background: radial-gradient(closest-side, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0)); }
          .cta-pill { position: relative; display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px;
            border: 1px solid rgba(34, 197, 94, 0.25); border-radius: 999px; background: rgba(34, 197, 94, 0.16);
            font-family: 'Space Grotesk', sans-serif; font-size: 12px; line-height: 1.5; font-weight: 600; color: #6EE7A0; }
          .cta-pill .dot { width: 6px; height: 6px; border-radius: 999px; background: var(--green); box-shadow: 0 0 8px var(--green); }
          .cta h2 { position: relative; margin: 16px 0 12px; font-size: 30px; line-height: 1.08; font-weight: 600;
            letter-spacing: -0.3px; color: #FFFFFF; text-wrap: balance; }
          .cta h2 span { color: var(--green); }
          .cta-sub { position: relative; margin-bottom: 24px; font-size: 15px; line-height: 1.6; color: rgba(255, 255, 255, 0.72); text-wrap: pretty; }
          .cta .form { position: relative; text-align: left; }
          .form-dark label { color: #FFFFFF; }
          .form-dark input { border: 1px solid rgba(255, 255, 255, 0.22); }
          .form-dark .form-note { margin-top: 4px; color: rgba(255, 255, 255, 0.72); text-align: center; }
          .form-dark button { margin-top: 4px; }
          .fine { margin-top: 18px; font-size: 13px; line-height: 1.5; color: var(--gray-600); text-align: center; }

          @media (min-width: 768px) {
            .sec { padding: 72px 24px; }
            .sec h2 { font-size: 36px; line-height: 1.1; }
            .hero { padding: 64px 24px 48px; }
            .pill { padding: 7px 14px; }
            h1 { font-size: 40px; text-wrap: initial; }
            h1 .br { display: inline; }
            .lead .l1 { font-size: 18px; }
            .lead .l2 { font-size: 15px; }
            .hero .form { max-width: 560px; margin-top: 8px; }
            .field-row { flex-direction: row; flex-wrap: wrap; gap: 10px; }
            .form input { flex: 1 1 240px; width: auto; }
            .form button { flex: 0 0 auto; width: auto; }
            .vis { height: 360px; margin: 0; }
            .vis img { border-radius: 12px; }
            .vis .back { width: 82%; }
            .vis .front { bottom: 8px; width: 88%; box-shadow: 0 20px 48px rgba(15, 23, 42, 0.22); }
            .stats { margin-top: 36px; padding-top: 28px; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
            .stat-n { font-size: 40px; letter-spacing: -0.8px; }
            .stat-l { margin-top: 10px; }
            .inside { gap: 32px; }
            .figs { grid-template-columns: repeat(auto-fit, minmax(min(340px, 100%), 1fr)); gap: 24px; }
            figcaption { padding: 16px 20px; font-size: 15px; }
            .numbers { gap: 32px; }
            .numbers h2, .rules-sec h2 { margin-bottom: 0; }
            .num-grid { grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr)); }
            .num { padding: 22px; gap: 10px; }
            .num-n { font-size: 32px; }
            .rules-sec { gap: 28px; }
            .rules { grid-template-columns: repeat(auto-fit, minmax(min(480px, 100%), 1fr)); column-gap: 48px; }
            .rule { gap: 14px; padding: 14px 0; }
            .rule-n { width: 30px; height: 30px; font-size: 14px; }
            .rule-t { font-size: 15px; padding-top: 4px; }
            .cta { padding: 56px 40px; }
            .glow { width: 520px; height: 520px; }
            .glow-a { top: -160px; right: -160px; }
            .glow-b { bottom: -200px; left: -160px; }
            .cta h2 { margin: 18px 0 14px; max-width: 18ch; font-size: 42px; line-height: 1.05; letter-spacing: -0.42px; }
            .cta-sub { margin-bottom: 28px; max-width: 48ch; font-size: 16px; }
            .cta .form { max-width: 560px; }
            .form-dark .field-row { gap: 12px; }
            .form-dark button { margin-top: 0; }
            .fine { margin-top: 20px; }
          }
          /* Two-column hero once the copy column and the visual both fit (Main artboard). */
          @media (min-width: 1024px) {
            .hero-grid { grid-template-columns: minmax(0, 680fr) minmax(0, 420fr); column-gap: 56px; row-gap: 0;
              grid-template-areas: "pill vis" "h1 vis" "lead vis" "form vis" "stats stats"; align-items: start; }
            .pill { margin-bottom: 20px; }
            h1 { margin-bottom: 20px; }
            .lead { margin-bottom: 20px; }
            .hero .form { margin-top: 8px; }
            .vis { align-self: center; }
            .stats { margin-top: 56px; }
          }
          @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
        </style>

        <section class="sec hero" aria-labelledby="rl-h1">
          <div class="wrap hero-grid">
            <p class="pill"><span class="dot" aria-hidden="true"></span>Free 77-page report</p>
            <h1 id="rl-h1">Your wearable gives you a number.<br class="br"> This report shows how far off it is.</h1>
            <div class="lead">
              <p class="l1">Seven brands ranked on eleven metrics, using only the numbers from 71 peer-reviewed validation studies.</p>
              <p class="l2">No brand wins every metric. Kygo connects them all and uses the most accurate source for each.</p>
            </div>
            ${this._form('rl-email-top', false)}
            <div class="vis">
              <img class="back" src="${ASSETS}sowa-medal-table.webp" alt="Report page: medal table of podium places by metric and brand" width="1280" height="720" />
              <img class="front" src="${ASSETS}sowa-cover.webp" alt="Report cover: State of Wearable Accuracy 2026" width="1280" height="720" />
            </div>
            <ul class="stats" aria-label="Report at a glance">
              ${STATS.map(s => `<li><p class="stat-n">${s.n}</p><p class="stat-l">${s.label}</p></li>`).join('')}
            </ul>
          </div>
        </section>

        <section class="sec" aria-labelledby="rl-inside">
          <div class="wrap inside">
            <h2 id="rl-inside">Inside the report</h2>
            <div class="figs">
              ${INSIDE.map(f => `
                <figure>
                  <img src="${ASSETS}${f.img}" alt="${f.alt}" width="1280" height="720" loading="lazy" />
                  <figcaption><strong>${f.title}</strong> ${f.text}</figcaption>
                </figure>`).join('')}
            </div>
          </div>
        </section>

        <section class="sec gray" aria-labelledby="rl-numbers">
          <div class="wrap numbers">
            <h2 id="rl-numbers">Five numbers from the report</h2>
            <div class="num-grid">
              ${NUMBERS.map(c => `<div class="num"><p class="num-n">${c.n}</p><p class="num-t">${c.text}</p></div>`).join('')}
            </div>
          </div>
        </section>

        <section class="sec" aria-labelledby="rl-rules">
          <div class="wrap rules-sec">
            <h2 id="rl-rules">How the medals were decided</h2>
            <ol class="rules">
              ${RULES.map((r, i) => `<li class="rule"><span class="rule-n" aria-hidden="true">${i + 1}</span><span class="rule-t"><strong>${r.b}</strong>${r.t}</span></li>`).join('')}
            </ol>
          </div>
        </section>

        <section class="sec gray" aria-labelledby="rl-cta">
          <div class="cta-wrap">
            <div class="cta">
              <div class="glow glow-a" aria-hidden="true"></div>
              <div class="glow glow-b" aria-hidden="true"></div>
              <p class="cta-pill"><span class="dot" aria-hidden="true"></span>Free 77-page report</p>
              <h2 id="rl-cta">77 pages, seven brands, one rule: <span>the numbers decide.</span></h2>
              <p class="cta-sub">Get the full ranking, every brand profile and the buyer's guide in one PDF.</p>
              ${this._form('rl-email-bottom', true)}
            </div>
            <p class="fine">No brand paid for this report or saw it before publication. Every figure comes from the paper's own tables.</p>
          </div>
        </section>
      `;
    }

    _attachEventListeners() {
      this.shadowRoot.querySelectorAll('[data-form]').forEach((form) => {
        form.addEventListener('submit', (e) => this._handleSubmit(e, form));
      });
    }

    _handleSubmit(e, form) {
      e.preventDefault();
      if (this._busy) return;
      const input = form.querySelector('input');
      const email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this._activeForm = form;
        this._showError('Please enter a valid email address.');
        input.focus();
        return;
      }
      this._activeForm = form;
      this._busy = true;
      this._setLoading(true, 'Sending...');
      const err = form.querySelector('.form-error');
      err.hidden = true;

      // Plain-data detail only: Wix bridges this to Velo over structured clone. The page code
      // answers with setAttribute('data-form-result', ...), never a callback.
      this.dispatchEvent(new CustomEvent('reportSubscribe', {
        detail: { email, source: this._getSetting('source', 'report-landing') },
        bubbles: true,
        composed: true
      }));

      // Safety timeout: if the host never answers, say so instead of faking success.
      clearTimeout(this._submitTimeout);
      this._submitTimeout = setTimeout(() => this._showError(ERROR_MSG), 10000);
    }

    _setLoading(on, label) {
      this.shadowRoot.querySelectorAll('[data-form]').forEach((f) => {
        const b = f.querySelector('button');
        const i = f.querySelector('input');
        b.disabled = on;
        i.disabled = on;
        b.textContent = on && f === this._activeForm ? label : 'Send me the report';
      });
    }

    _onSuccess() {
      this._setLoading(true, 'Sent. Opening your report...');
      // GA4 email_subscribe via kygo-tracking.js. No email in the detail: GA4 never gets PII.
      this.dispatchEvent(new CustomEvent('subscribe', {
        detail: { source: this._getSetting('source', 'report-landing'), component: 'kygo-report-landing' },
        bubbles: true,
        composed: true
      }));
      const to = this._getSetting('redirect-url', DEFAULT_REDIRECT);
      // A short pause lets the GA4 hit leave before the page unloads.
      clearTimeout(this._redirectTimeout);
      this._redirectTimeout = setTimeout(() => { window.location.assign(to); }, 400);
    }

    _showError(message) {
      this._busy = false;
      this._setLoading(false);
      const form = this._activeForm || this.shadowRoot.querySelector('[data-form]');
      const err = form && form.querySelector('.form-error');
      if (err) { err.textContent = message; err.hidden = false; }
    }

    _injectStructuredData() {
      if (!document.querySelector('script[data-kygo-report-landing-ld]')) {
        const ld = document.createElement('script');
        ld.type = 'application/ld+json';
        ld.setAttribute('data-kygo-report-landing-ld', '');
        ld.textContent = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': PAGE_URL,
          url: PAGE_URL,
          name: 'State of Wearable Accuracy 2026 | Free Kygo Report',
          description: 'A free 77-page report ranking Oura, Apple Watch, Fitbit, Garmin, Samsung, WHOOP and Polar on 11 metrics. 71 peer-reviewed studies, no brand funding.',
          inLanguage: 'en',
          isPartOf: { '@type': 'WebSite', name: 'Kygo Health', url: 'https://www.kygo.app/' },
          primaryImageOfPage: ASSETS + 'sowa-cover.webp',
          mainEntity: {
            '@type': 'Report',
            name: 'State of Wearable Accuracy 2026',
            about: 'Accuracy of consumer wearables (Oura, Apple Watch, Fitbit / Google, Garmin, Samsung, WHOOP, Polar) on eleven metrics, from 71 peer-reviewed validation studies',
            numberOfPages: 77,
            datePublished: '2026-10-25',
            dateModified: '2026-10-25',
            inLanguage: 'en',
            isAccessibleForFree: true,
            encodingFormat: 'application/pdf',
            image: ASSETS + 'sowa-cover.webp',
            author: { '@type': 'Organization', name: 'Kygo Health', url: 'https://www.kygo.app/' },
            publisher: {
              '@type': 'Organization',
              name: 'Kygo Health',
              url: 'https://www.kygo.app/',
              logo: { '@type': 'ImageObject', url: 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png' }
            }
          }
        });
        document.head.appendChild(ld);
      }
      if (!document.querySelector('script[data-kygo-report-landing-bc]')) {
        const bc = document.createElement('script');
        bc.type = 'application/ld+json';
        bc.setAttribute('data-kygo-report-landing-bc', '');
        bc.textContent = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.kygo.app/' },
            { '@type': 'ListItem', position: 2, name: 'State of Wearable Accuracy 2026', item: PAGE_URL }
          ]
        });
        document.head.appendChild(bc);
      }
    }
  }

  if (!customElements.get('kygo-report-landing')) {
    customElements.define('kygo-report-landing', KygoReportLanding);
  }
})();
