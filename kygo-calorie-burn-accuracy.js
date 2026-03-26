/**
 * Kygo Health — Calorie Burn Accuracy Calculator
 * Tag: kygo-calorie-burn-accuracy
 * Interactive calculator showing how accurate your wearable's calorie burn estimate really is
 */

/** SEO helper — injects semantic HTML outside Shadow DOM for crawlers and AI */
function __seo(el, html) {
  if (el.querySelector('[data-seo]')) return;
  const d = document.createElement('article');
  d.setAttribute('data-seo', '');
  d.setAttribute('aria-hidden', 'true');
  d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
  d.innerHTML = html;
  el.appendChild(d);
}

class KygoCalorieBurnAccuracy extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._selectedDevice = 'apple-watch';
    this._selectedActivity = 'steady-cardio';
    this._reportedCalories = null;
    this._calculationResult = null;
    this._expandedAccordion = null;
    this._expandedDeviceCard = null;
  }

  connectedCallback() {
    this._render();
    this._setupEventDelegation();
    this._setupIntersectionObserver();
    this._injectStructuredData();
    __seo(this, `
      <h1>Calorie Burn Accuracy Calculator by Kygo Health</h1>
      <p>How accurate is your wearable&rsquo;s calorie burn estimate? Compare calorie burn accuracy of Apple Watch, Fitbit, Garmin, WHOOP, and Oura Ring across 7 activity types using peer-reviewed research.</p>

      <h2>Wearable Calorie Burn Accuracy Rankings</h2>
      <ol>
        <li><strong>Oura Ring</strong> &mdash; 87% lab accuracy, r=0.93 correlation. Best for resting metabolic rate. Limited active exercise tracking.</li>
        <li><strong>WHOOP</strong> &mdash; 82% overall accuracy. Uses ACSM equations extended by HR analysis. Variable bias direction depending on activity.</li>
        <li><strong>Apple Watch</strong> &mdash; 71% overall accuracy, 27.96% MAPE. Overestimates 58% of the time. Best consumer device for steady-state cardio.</li>
        <li><strong>Fitbit</strong> &mdash; 50&ndash;66% accuracy. Consistent overestimate bias (27.4% average). Reliable for trend tracking.</li>
        <li><strong>Garmin</strong> &mdash; 48% overall accuracy but Firstbeat Analytics achieves 6.7% MAPE at medium-hard intensity. Wide variance between activities.</li>
      </ol>

      <h2>Accuracy by Activity Type</h2>
      <ul>
        <li><strong>Steady-state cardio</strong> &mdash; Most accurate across all devices (10&ndash;20% error)</li>
        <li><strong>Running</strong> &mdash; 15&ndash;25% error, Apple Watch and Garmin perform best</li>
        <li><strong>Walking</strong> &mdash; High overestimate risk (Apple Watch: 26&ndash;61% overestimate)</li>
        <li><strong>Cycling</strong> &mdash; 30&ndash;52% error, wrist-based sensors struggle without arm motion</li>
        <li><strong>HIIT</strong> &mdash; 25&ndash;40% error, rapid HR changes confuse algorithms</li>
        <li><strong>Strength training</strong> &mdash; Least accurate across all devices (29&ndash;52% error)</li>
        <li><strong>Swimming</strong> &mdash; 20&ndash;35% error, water interferes with optical HR sensors</li>
      </ul>

      <h2>Factors Affecting Wearable Calorie Accuracy</h2>
      <ul>
        <li>Skin tone &mdash; darker pigmentation can reduce PPG sensor signal quality</li>
        <li>Body composition &mdash; muscle-to-fat ratio affects metabolic rate but most devices cannot measure it</li>
        <li>Medications &mdash; beta-blockers and stimulants alter heart rate response</li>
        <li>Tattoos &mdash; ink can interfere with optical sensor readings</li>
        <li>Device fit &mdash; loose bands create motion artifacts and signal noise</li>
        <li>Caffeine &mdash; elevates resting heart rate, potentially inflating calorie estimates</li>
        <li>Age, sex, and BMI &mdash; demographic factors affect baseline metabolic calculations</li>
      </ul>

      <h2>How to Use This Calculator</h2>
      <ol>
        <li>Select your wearable brand (Apple Watch, Fitbit, Garmin, WHOOP, or Oura Ring)</li>
        <li>Choose your activity type from 7 categories</li>
        <li>Enter the calorie burn your device reported</li>
        <li>View your likely actual calorie range, best estimate, and bias direction</li>
      </ol>

      <h2>Research Sources</h2>
      <ul>
        <li>Choe &amp; Kang 2025 &mdash; Physiological Measurement meta-analysis of wearable energy expenditure accuracy</li>
        <li>Chevance et al. 2022 &mdash; JMIR systematic review of consumer wearable accuracy</li>
        <li>Kristiansson et al. 2023 &mdash; BMC Sports Science systematic review</li>
        <li>Bellenger et al. 2021 &mdash; Sensors, WHOOP PPG HR/HRV validation</li>
        <li>Murakami et al. 2019 &mdash; JMIR Fitbit validity meta-analysis</li>
        <li>Stanford 2017 &mdash; Apple Watch energy expenditure accuracy study</li>
        <li>Firstbeat IEEE EMBC 2016 &mdash; Garmin calorie algorithm validation</li>
      </ul>
    `);
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

        /* ==================== BASE (MOBILE-FIRST) ==================== */
        :host {
          --dark: #1E293B;
          --dark-card: #0F172A;
          --light: #F8FAFC;
          --green: #22C55E;
          --green-dark: #16A34A;
          --green-light: rgba(34, 197, 94, 0.1);
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
          --shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          --shadow-hover: 0 12px 32px rgba(0, 0, 0, 0.08);

          display: block;
          background: var(--light);
          color: var(--dark);
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        h1, h2, h3, h4 { font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 600; line-height: 1.2; }
        h1 { font-size: clamp(26px, 7vw, 42px); margin-bottom: 16px; color: var(--dark); }
        h2 { font-size: clamp(22px, 5.5vw, 32px); margin-bottom: 8px; text-align: center; }
        h3 { font-size: clamp(18px, 4vw, 24px); margin-bottom: 12px; }
        p, li { font-size: 16px; line-height: 1.6; color: var(--gray-600); }
        a { color: var(--green); text-decoration: none; transition: color 0.2s; }
        a:hover { color: var(--green-dark); }
        button { cursor: pointer; border: none; font-family: inherit; font-weight: 600; transition: all 0.2s; }

        /* ==================== ANIMATIONS ==================== */
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

        @media (prefers-reduced-motion: reduce) {
          .animate-on-scroll { opacity: 1; transform: none; transition: none; }
          .expandable-content, .brand-expand-content, .accordion-content { transition: none; }
          .pulse-dot { animation: none; }
          * { animation-duration: 0s !important; }
        }

        /* ==================== HEADER ==================== */
        .header { position: sticky; top: 0; z-index: 100; background: #fff; border-bottom: 1px solid var(--gray-200); }
        .header-inner { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; max-width: 1200px; margin: 0 auto; }
        .header-brand { display: flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); text-decoration: none; }
        .header-brand img { height: 28px; width: auto; }
        .header-cta { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #fff; background: var(--green); padding: 8px 16px; border-radius: 50px; text-decoration: none; transition: background 0.2s; white-space: nowrap; }
        .header-cta:hover { background: var(--green-dark); }
        .header-cta svg { width: 14px; height: 14px; }

        /* ==================== HERO ==================== */
        .hero { padding: 40px 0 20px; text-align: center; }
        .hero-badge { display: inline-block; padding: 6px 16px; border-radius: 50px; background: var(--green-light); color: var(--green-dark); font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 16px; }
        .hero-subtitle { font-size: 16px; color: var(--gray-600); max-width: 640px; margin: 0 auto; }

        /* ==================== SECTION BACKGROUNDS ==================== */
        .section-alt { background: #fff; }

        /* ==================== SECTION TITLES ==================== */
        .section-sub { text-align: center; color: var(--gray-600); font-size: 15px; margin-bottom: 32px; max-width: 560px; margin-left: auto; margin-right: auto; }

        /* ==================== CALCULATOR ==================== */
        .calculator-section { padding: 32px 0; }
        .calculator-section h2 { margin-bottom: 32px; }
        .calculator-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        .form-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
        .form-group label { font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-600); }

        .device-buttons { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .device-button { background: #fff; border: 2px solid var(--gray-200); padding: 10px 8px; border-radius: var(--radius-sm); display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: var(--gray-600); transition: all 0.2s; }
        .device-button img { width: 28px; height: 28px; object-fit: contain; }
        .device-button.active { background: var(--green-light); border-color: var(--green); color: var(--green-dark); }
        .device-button:hover:not(.active) { border-color: var(--gray-300); background: var(--gray-50); }

        .activity-buttons { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .activity-button { background: #fff; border: 2px solid var(--gray-200); padding: 10px 12px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; color: var(--gray-600); text-align: center; transition: all 0.2s; }
        .activity-button.active { background: var(--green-light); border-color: var(--green); color: var(--green-dark); }
        .activity-button:hover:not(.active) { border-color: var(--gray-300); background: var(--gray-50); }

        .input-wrapper { display: flex; align-items: center; gap: 8px; background: #fff; border: 2px solid var(--gray-200); border-radius: var(--radius-sm); padding: 12px 16px; transition: border-color 0.2s; }
        .input-wrapper:focus-within { border-color: var(--green); }
        .input-wrapper input { flex: 1; background: transparent; border: none; font-size: 16px; font-weight: 600; color: var(--dark); outline: none; font-family: inherit; }
        .input-wrapper input::placeholder { color: var(--gray-400); }
        .input-unit { font-size: 14px; color: var(--gray-600); font-weight: 600; }

        .calculate-button { background: var(--green); color: white; padding: 14px 24px; border-radius: var(--radius-sm); font-size: 16px; width: 100%; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); margin-top: 8px; }
        .calculate-button:hover { background: var(--green-dark); }

        /* ==================== RESULTS PANEL ==================== */
        .results-panel { background: #fff; border: 1px solid var(--gray-200); color: var(--dark); padding: 28px 20px; border-radius: var(--radius); box-shadow: var(--shadow); }
        .results-panel.show .results-placeholder { display: none; }
        .results-panel .results-live { display: none; }
        .results-panel.show .results-live { display: block; animation: fadeInUp 0.4s ease-out; }
        .results-header { text-align: center; margin-bottom: 24px; }
        .results-label { font-size: 13px; color: var(--gray-600); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .results-best-estimate { font-size: clamp(40px, 10vw, 56px); font-weight: 700; color: var(--green); line-height: 1; margin-bottom: 4px; font-family: 'Space Grotesk', sans-serif; }
        .results-subtext { font-size: 14px; color: var(--gray-600); }
        .results-confidence { display: inline-flex; align-items: center; gap: 6px; background: var(--green-light); color: var(--green-dark); padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600; margin-top: 12px; cursor: help; position: relative; }
        .results-confidence-tip { display: none; position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: var(--dark); color: #fff; padding: 10px 14px; border-radius: 8px; font-size: 12px; font-weight: 400; line-height: 1.4; width: 240px; text-align: left; z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .results-confidence-tip::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 6px solid transparent; border-top-color: var(--dark); }
        .results-confidence:hover .results-confidence-tip { display: block; }

        .results-range-bar { background: var(--gray-100); border-radius: 8px; height: 36px; position: relative; margin-top: 20px; overflow: visible; }
        .range-fill { background: linear-gradient(90deg, var(--green-dark), var(--green)); height: 100%; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 12px; min-width: 40px; transition: width 0.4s ease-out; }
        .range-labels { display: flex; justify-content: space-between; margin-top: 6px; font-size: 12px; color: var(--gray-600); font-weight: 600; }

        .results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; }
        .results-card { background: var(--gray-50); border: 1px solid var(--gray-200); padding: 16px; border-radius: var(--radius-sm); }
        .results-card-label { font-size: 11px; color: var(--gray-600); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .results-card-value { font-size: 22px; font-weight: 700; color: var(--dark); font-family: 'Space Grotesk', sans-serif; }

        .results-tendency { display: inline-block; padding: 6px 14px; border-radius: 50px; font-size: 13px; font-weight: 600; margin-top: 16px; }
        .results-tendency.overestimate { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: var(--red); }
        .results-tendency.underestimate { background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); color: var(--green-dark); }
        .results-tendency.variable { background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.2); color: #D97706; }

        .results-expandable { margin-top: 20px; border-top: 1px solid var(--gray-200); padding-top: 20px; }
        .expandable-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; font-weight: 600; font-size: 14px; color: var(--dark); transition: color 0.2s; gap: 12px; }
        .expandable-header:hover { color: var(--green); }
        .expandable-toggle { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s; flex-shrink: 0; color: var(--gray-400); }
        .expandable-toggle.open { transform: rotate(180deg); }
        .expandable-content { display: none; margin-top: 12px; padding: 16px; background: var(--gray-50); border-radius: var(--radius-sm); font-size: 14px; line-height: 1.6; color: var(--gray-600); }
        .expandable-content.open { display: block; }
        .insight-box { background: #fff; border-left: 4px solid var(--green); padding: 14px; border-radius: var(--radius-sm); margin-top: 16px; font-size: 13px; color: var(--gray-600); line-height: 1.5; }

        .results-placeholder { text-align: center; padding: 48px 24px; }
        .results-placeholder-icon { margin-bottom: 16px; }
        .results-placeholder-title { font-size: 16px; font-weight: 600; color: var(--dark); margin-bottom: 8px; }
        .results-placeholder-desc { font-size: 14px; color: var(--gray-400); line-height: 1.5; }

        /* ==================== ACCURACY TABLE ==================== */
        .accuracy-section { padding: 32px 0; }
        .accuracy-section h2 { margin-bottom: 12px; }
        .accuracy-table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0 -20px; padding: 0 20px; position: relative; }
        .accuracy-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 700px; }
        .accuracy-table th { background: var(--gray-100); padding: 12px 10px; text-align: center; font-weight: 600; color: var(--dark); border-bottom: 2px solid var(--gray-200); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
        .accuracy-table th:first-child { text-align: left; position: sticky; left: 0; z-index: 2; background: var(--gray-100); }
        .accuracy-table td { padding: 14px 10px; border-bottom: 1px solid var(--gray-100); vertical-align: middle; }
        .accuracy-table td:first-child { position: sticky; left: 0; z-index: 1; background: #fff; }
        .accuracy-table tbody tr:hover td { background: var(--gray-50); }
        .accuracy-table tbody tr:hover td:first-child { background: var(--gray-50); }
        .activity-name { font-weight: 600; color: var(--dark); font-size: 13px; white-space: nowrap; }
        .th-device { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .th-device img { width: 22px; height: 22px; object-fit: contain; border-radius: 4px; }
        .th-device span { font-size: 10px; }

        .accuracy-bar-container { display: flex; align-items: center; gap: 8px; }
        .accuracy-bar { position: relative; height: 22px; background: var(--gray-100); border-radius: 4px; overflow: hidden; flex: 1; min-width: 80px; }
        .accuracy-bar-fill { height: 100%; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 600; min-width: 32px; }
        .accuracy-label { font-size: 11px; color: var(--gray-400); white-space: nowrap; }

        .accuracy-insight { background: #fff; border-left: 4px solid var(--green); padding: 16px; border-radius: var(--radius-sm); margin-top: 24px; color: var(--dark); font-size: 14px; line-height: 1.6; }

        /* ==================== BRAND CARDS ==================== */
        .brands-section { padding: 32px 0; }
        .brands-section h2 { margin-bottom: 32px; }
        .brands-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        .brand-card { width: 100%; }
        .brand-card { background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: box-shadow 0.3s, border-color 0.3s; }
        .brand-card:hover { box-shadow: var(--shadow-hover); border-color: var(--gray-300); }

        .brand-header { background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%); padding: 16px 20px; display: flex; align-items: center; gap: 12px; }
        .brand-image { width: 40px; height: 40px; object-fit: contain; flex-shrink: 0; }
        .brand-title { font-size: 16px; font-weight: 600; color: var(--dark); margin: 0; flex: 1; }
        .brand-amazon { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 500; color: var(--gray-400); text-decoration: none; transition: color 0.2s; white-space: nowrap; }
        .brand-amazon:hover { color: var(--dark); }
        .brand-amazon svg { color: var(--green-dark); }
        .brand-content { padding: 20px; }

        .brand-stat { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--gray-100); }
        .brand-stat:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
        .brand-stat-label { font-size: 12px; color: var(--gray-600); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .brand-stat-value { font-size: 14px; font-weight: 700; color: var(--dark); }
        .brand-best { color: var(--green-dark); }
        .brand-worst { color: var(--red); }

        .brand-expandable { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--gray-100); }
        .brand-expand-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; font-weight: 600; font-size: 14px; color: var(--dark); transition: color 0.2s; }
        .brand-expand-header:hover { color: var(--green); }
        .brand-expand-toggle { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s; flex-shrink: 0; color: var(--gray-400); }
        .brand-expand-toggle.open { transform: rotate(180deg); }
        .brand-expand-content { display: none; margin-top: 12px; padding: 16px; background: var(--gray-50); border-radius: var(--radius-sm); }
        .brand-expand-content.open { display: block; }
        .brand-desc { font-size: 14px; color: var(--gray-600); line-height: 1.6; margin-bottom: 10px; }
        .brand-list { font-size: 13px; color: var(--gray-600); list-style: none; margin: 8px 0; }
        .brand-list li { margin-bottom: 6px; padding-left: 20px; position: relative; line-height: 1.5; }
        .brand-list li:before { content: '✓'; position: absolute; left: 0; color: var(--green); font-weight: 600; }
        .amazon-link { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500; color: var(--gray-600); text-decoration: none; transition: color 0.2s; }
        .amazon-link:hover { color: var(--dark); }
        .amazon-link svg { color: var(--green-dark); }

        /* ==================== POPULATION FACTORS ==================== */
        .factors-section { padding: 32px 0; }
        .factors-section h2 { margin-bottom: 32px; }
        .factors-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .factor-card { background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius-sm); padding: 20px; transition: box-shadow 0.3s, border-color 0.3s; }
        .factor-card:hover { border-color: var(--gray-300); box-shadow: var(--shadow-hover); }
        .factor-title { font-weight: 600; color: var(--dark); margin-bottom: 6px; font-size: 15px; }
        .factor-desc { font-size: 14px; color: var(--gray-600); line-height: 1.5; margin-bottom: 10px; }
        .factor-impact { display: inline-block; padding: 4px 10px; border-radius: 50px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .factor-impact.high { background: rgba(234, 88, 12, 0.1); color: #EA580C; }
        .factor-impact.moderate { background: rgba(202, 138, 4, 0.1); color: #CA8A04; }

        /* ==================== BLOG LINK ==================== */
        .blog-link-wrap { max-width: 720px; margin: 32px auto 0; }
        .blog-link-card { display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: var(--green-light); border: 2px solid var(--green); border-radius: var(--radius); text-decoration: none; transition: box-shadow 0.3s; }
        .blog-link-card:hover { box-shadow: var(--shadow-hover); }
        .blog-link-logo { width: 36px; height: 36px; object-fit: contain; flex-shrink: 0; border-radius: 6px; }
        .blog-link-text { flex: 1; }
        .blog-link-title { display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--green-dark); letter-spacing: 0.3px; }
        .blog-link-desc { display: block; font-size: 14px; font-weight: 500; color: var(--dark); margin-top: 2px; }
        .blog-link-arrow { width: 20px; height: 20px; color: var(--green-dark); flex-shrink: 0; }
        .blog-link-arrow svg { width: 20px; height: 20px; }

        /* ==================== BLOG CTA ==================== */
        .blog-cta-section { padding: 32px 0; }
        .blog-cta { position: relative; background: linear-gradient(135deg, var(--dark-card) 0%, var(--gray-700) 100%); border-radius: var(--radius); padding: 32px 24px; text-align: center; max-width: 680px; margin: 0 auto; overflow: hidden; }
        .blog-cta-glow { position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, transparent 70%); pointer-events: none; }
        .blog-cta-inner { position: relative; z-index: 1; }
        .blog-cta-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34, 197, 94, 0.15); color: var(--green); padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
        .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }
        .blog-cta h3 { color: #fff; font-size: clamp(20px, 5vw, 28px); margin-bottom: 12px; }
        .blog-cta-desc { color: var(--gray-400); font-size: 14px; margin-bottom: 24px; max-width: 480px; margin-left: auto; margin-right: auto; }
        .blog-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; }
        .blog-cta-btn:hover { background: var(--green-dark); color: #fff; }
        .blog-cta-btn svg { width: 18px; height: 18px; }
        .blog-cta-buttons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        @media (max-width: 480px) { .blog-cta-buttons { flex-direction: column; align-items: stretch; } .blog-cta-buttons a, .blog-cta-buttons button { justify-content: center; text-align: center; } .cta-buttons { flex-direction: column; align-items: stretch; } .cta-buttons a, .cta-buttons button { justify-content: center; text-align: center; } }
        .cta-android { display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #fff; padding: 12px 24px; border-radius: var(--radius-sm, 10px); font-weight: 600; font-size: 15px; text-decoration: none; transition: background 0.2s; border: none; cursor: pointer; }
        .cta-android:hover { background: var(--green-dark); color: #fff; }
        .cta-android svg { width: 18px; height: 18px; }
        .blog-cta-tags { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 20px; flex-wrap: wrap; }
        .blog-cta-tags span { color: var(--gray-400); font-size: 12px; }
        .blog-cta-tags img { height: 22px; width: auto; opacity: 0.7; }

        /* ==================== SOURCES ==================== */
        .sources-section { padding: 32px 0; }
        .sources-section h2 { margin-bottom: 32px; }
        .sources-accordion { max-width: 900px; margin: 0 auto; }
        .accordion-item { border: 1px solid var(--gray-200); border-radius: var(--radius-sm); margin-bottom: 8px; overflow: hidden; }
        .accordion-header { background: var(--gray-50); padding: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; font-weight: 600; font-size: 14px; color: var(--dark); transition: background 0.2s; gap: 12px; }
        .accordion-header:hover { background: var(--gray-100); }
        .accordion-header span { flex: 1; }
        .accordion-toggle { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s; flex-shrink: 0; color: var(--gray-400); }
        .accordion-toggle.open { transform: rotate(180deg); }
        .accordion-content { display: none; padding: 16px; background: white; border-top: 1px solid var(--gray-100); }
        .accordion-content.open { display: block; }
        .accordion-content p { margin-bottom: 8px; font-size: 14px; color: var(--gray-600); }

        /* ==================== CTA SECTION ==================== */
        .cta-section { background: linear-gradient(135deg, var(--dark-card) 0%, var(--dark) 100%); color: white; padding: 32px 24px; border-radius: var(--radius); text-align: center; margin: 0 20px 32px; }
        .cta-section h2 { color: white; margin-bottom: 12px; }
        .cta-section p { color: var(--gray-300); font-size: 16px; margin-bottom: 28px; max-width: 520px; margin-left: auto; margin-right: auto; }
        .cta-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .cta-button-primary { background: var(--green); color: white; padding: 12px 28px; border-radius: var(--radius-sm); font-size: 15px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); display: inline-flex; align-items: center; gap: 8px; }
        .cta-button-primary:hover { background: var(--green-dark); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4); }
        .cta-button-secondary { background:var(--green);color:white;padding:12px 28px;border-radius:var(--radius-sm, 10px);font-size:15px;box-shadow:0 4px 12px rgba(34,197,94,0.3);display:inline-flex;align-items:center;gap:8px;text-decoration:none;border:none;cursor:pointer;font-weight:600; }
        .cta-button-secondary:hover { background:var(--green-dark);transform:translateY(-2px);box-shadow:0 8px 20px rgba(34,197,94,0.4);color:white; }

        /* ==================== ANDROID MODAL ==================== */

        /* ==================== FOOTER ==================== */
        .footer { padding: 48px 0 32px; text-align: center; border-top: 1px solid var(--gray-200); }
        .footer-brand { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); text-decoration: none; margin-bottom: 8px; }
        .footer-brand img { height: 24px; width: auto; }
        .footer-tagline { font-size: 13px; color: var(--gray-400); margin-bottom: 16px; }
        .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 16px; margin-bottom: 16px; padding: 0 16px; }
        .footer-links a { font-size: 13px; color: var(--gray-600); text-decoration: none; white-space: nowrap; }
        .footer-links a:hover { color: var(--green); }
        .footer-disclaimer { font-size: 11px; color: var(--gray-400); line-height: 1.5; max-width: 560px; margin: 0 auto 12px; }
        .footer-copyright { font-size: 12px; color: var(--gray-400); margin-bottom: 4px; }
        .footer-affiliate { font-style: italic; }

        /* ==================== TABLET (min-width: 768px) ==================== */
        @media (min-width: 768px) {
          .header-inner { padding: 14px 24px; }
          .hero { padding: 48px 0 24px; }
          .hero-subtitle { font-size: 17px; }
          .calculator-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
          .device-buttons { grid-template-columns: repeat(5, 1fr); }
          .activity-buttons { grid-template-columns: repeat(4, 1fr); }
          .results-panel { padding: 36px; }
          .brands-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
          .brand-card { width: calc(50% - 10px); }
          .factors-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; }
          .factor-card { width: calc(50% - 8px); }
          .blog-cta { padding: 48px 40px; }
          .calculator-section, .accuracy-section, .brands-section, .factors-section, .sources-section { padding: 48px 0; }
          .cta-section { padding: 48px 40px; }
        }

        /* ==================== DESKTOP (min-width: 1024px) ==================== */
        @media (min-width: 1024px) {
          .brand-card { width: calc(33.333% - 14px); }
          .factor-card { width: calc(33.333% - 11px); }
          .sources-accordion { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; max-width: 1100px; }
          .calculator-section, .accuracy-section, .brands-section, .factors-section, .sources-section { padding: 56px 0; }
          .cta-section { padding: 56px 40px; }
        }
      </style>

      <!-- HEADER -->
      <header class="header">
        <div class="header-inner">
          <a href="https://kygo.app" class="header-brand" target="_blank" rel="noopener">
            <img src="https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png" alt="Kygo">
            Calorie Burn
          </a>
          <button class="header-cta" data-action="ios-download" data-track-position="header">
            Get Kygo App
            <svg viewBox="0 0 20 20" fill="none" width="14" height="14"><path d="M5 10h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </header>

      <!-- HERO -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge">Wearable Accuracy Analysis</div>
          <h1>How Accurate Is Your Calorie Burn?</h1>
          <p class="hero-subtitle">
            Your smartwatch might be underestimating—or overestimating—your actual calorie burn. Learn which wearable devices are most accurate for your activity, and discover the hidden factors that affect all of them.
          </p>
        </div>
      </section>

      <!-- CALCULATOR -->
      <section class="calculator-section animate-on-scroll">
        <div class="container">
          <h2>Calculate Your Actual Calorie Burn</h2>
          <div class="calculator-grid">
            <div>
              <div class="form-group">
                <label>Select Your Wearable Device</label>
                <div class="device-buttons" data-control="device-selector" role="tablist">
                  ${this._renderDeviceButtons()}
                </div>
              </div>

              <div class="form-group">
                <label>Select Your Activity Type</label>
                <div class="activity-buttons" data-control="activity-selector" role="tablist">
                  ${this._renderActivityButtons()}
                </div>
              </div>

              <div class="form-group">
                <label>Your Device Reported</label>
                <div class="input-wrapper">
                  <input type="number" placeholder="e.g. 400" min="0" data-input="reported-calories">
                  <span class="input-unit">kcal</span>
                </div>
              </div>

              <button class="calculate-button" data-action="calculate">Calculate Actual Burn</button>
            </div>

            <div>
              <div class="results-panel${this._calculationResult ? ' show' : ''}" data-section="results">
                <div class="results-placeholder">
                  <div class="results-placeholder-icon">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <rect x="6" y="24" width="8" height="18" rx="2" fill="var(--green)" opacity="0.3"/>
                      <rect x="17" y="16" width="8" height="26" rx="2" fill="var(--green)" opacity="0.5"/>
                      <rect x="28" y="20" width="8" height="22" rx="2" fill="var(--green)" opacity="0.7"/>
                      <rect x="39" y="10" width="8" height="32" rx="2" fill="var(--green)" opacity="0.15"/>
                      <path d="M4 42h44" stroke="var(--gray-300)" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div class="results-placeholder-title">Your Results Will Appear Here</div>
                  <div class="results-placeholder-desc">Select your wearable, choose an activity, enter calories, and tap calculate to see your likely actual burn.</div>
                </div>
                <div class="results-live">
                  ${this._renderResultsPanel()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ACCURACY BY ACTIVITY -->
      <section class="accuracy-section section-alt animate-on-scroll">
        <div class="container">
          <h2>Accuracy Varies Dramatically by Activity</h2>
          <p class="section-sub">How each device performs across 7 common activity types, ranked by accuracy.</p>
          <div class="accuracy-table-wrapper">
            <table class="accuracy-table">
              <thead>
                <tr>
                  <th>Activity Type</th>
                  ${Object.values(this._devices).map(d => `<th><div class="th-device"><img src="${d.imageUrl}" alt="${d.short}"><span>${d.short}</span></div></th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${this._renderAccuracyTable()}
              </tbody>
            </table>
          </div>
          <div class="accuracy-insight">
            <strong>Key Insight:</strong> Steady-state cardio is the most accurate activity type across all devices. Cycling and strength training are the least accurate regardless of device, with errors ranging from 30–60%.
          </div>
        </div>
      </section>

      <!-- BRAND DETAILS -->
      <section class="brands-section animate-on-scroll">
        <div class="container">
          <h2>How Each Brand Calculates Calories</h2>
          <div class="brands-grid">
            ${this._renderBrandCards()}
          </div>
          <div class="blog-link-wrap animate-on-scroll">
            <a href="https://www.kygo.app/blog/how-accurate-is-your-wearable-calorie-burn" class="blog-link-card" target="_blank" rel="noopener">
              <img src="https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png" alt="Kygo" class="blog-link-logo" />
              <div class="blog-link-text">
                <span class="blog-link-title">Read the Full Article</span>
                <span class="blog-link-desc">How Accurate Is Your Wearable's Calorie Burn?</span>
              </div>
              <span class="blog-link-arrow"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 10h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            </a>
          </div>
        </div>
      </section>

      <!-- POPULATION FACTORS -->
      <section class="factors-section section-alt animate-on-scroll">
        <div class="container">
          <h2>Factors That Affect All Devices</h2>
          <div class="factors-grid">
            ${this._renderPopulationFactors()}
          </div>
        </div>
      </section>

      <!-- BLOG CTA -->
      <section class="blog-cta-section animate-on-scroll">
        <div class="container">
          <div class="blog-cta">
            <div class="blog-cta-glow"></div>
            <div class="blog-cta-inner">
              <div class="blog-cta-badge"><span class="pulse-dot"></span>Free Forever Plan</div>
              <h3>Track Your <span style="color: var(--green);">Health Trends</span> Automatically</h3>
              <p class="blog-cta-desc">
                Kygo syncs with your wearable and food log to show which habits actually move your health — correlations personalized to your data.
              </p>
              <div class="blog-cta-buttons">
                <button class="blog-cta-btn" data-action="ios-download" data-track-position="article-cta">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </button>
                <a href="https://kygo.app/android" target="_blank" rel="noopener" class="cta-android" data-action="android-download" data-track-position="article-cta">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                  Download for Android
                </a>
              </div>
              <div class="blog-cta-tags">
                <span>Works with</span>
                <img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura" loading="lazy">
                <img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple" loading="lazy">
                <img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit" loading="lazy">
                <img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin" loading="lazy">
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SOURCES -->
      <section class="sources-section section-alt animate-on-scroll">
        <div class="container">
          <h2>Research & Sources</h2>
          <div class="sources-accordion">
            ${this._renderSourcesAccordion()}
          </div>
        </div>
      </section>

      <!-- CTA SECTION -->
      <section class="cta-section animate-on-scroll">
        <div class="container">
          <h2>Stop Guessing. Start Knowing.</h2>
          <p>Kygo syncs with your wearable and food log to track your nutrition and health trends — personalized insights based on your data. Free on iOS.</p>
          <div class="cta-buttons">
            <button class="blog-cta-btn" data-action="ios-download" data-track-position="footer-cta">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Download for iOS
            </button>
            <a href="https://kygo.app/android" target="_blank" rel="noopener" class="cta-android" data-action="android-download" data-track-position="footer-cta">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
              Download for Android
            </a>
          </div>
        </div>
      </section>


      <!-- FOOTER -->
      <footer class="footer">
        <div class="container">
          <a href="https://kygo.app" class="footer-brand" target="_blank" rel="noopener">
            <img src="https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png" alt="Kygo Health" loading="lazy">
            Kygo Health
          </a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <div class="footer-links">
            <a href="https://kygo.app">Home</a>
            <a href="https://kygo.app/how-it-works">How It Works</a>
            <a href="https://kygo.app/blog">Blog</a>
            <a href="https://kygo.app/contact">Contact</a>
            <a href="https://kygo.app/privacy">Privacy</a>
            <a href="https://kygo.app/terms">Terms</a>
          </div>
          <p class="footer-disclaimer">This calculator is for educational purposes only and does not replace professional medical advice. Wearable device accuracy varies by individual, environmental factors, and algorithm updates.</p>
          <p class="footer-copyright">Data sourced from peer-reviewed studies and meta-analyses.</p>
          <p class="footer-copyright footer-affiliate">As an Amazon Associate, I earn from qualifying purchases.</p>
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  _renderDeviceButtons() {
    return Object.entries(this._devices)
      .map(([key, device]) => `
        <button class="device-button ${key === this._selectedDevice ? 'active' : ''}" data-device="${key}" role="tab" aria-selected="${key === this._selectedDevice}">
          <img src="${device.imageUrl}" alt="${device.name}">
          ${device.short}
        </button>
      `)
      .join('');
  }

  _renderActivityButtons() {
    return Object.entries(this._activities)
      .map(([key, activity]) => `
        <button class="activity-button ${key === this._selectedActivity ? 'active' : ''}" data-activity="${key}" role="tab" aria-selected="${key === this._selectedActivity}">
          ${activity.name}
        </button>
      `)
      .join('');
  }

  _renderResultsPanel() {
    if (!this._calculationResult) return '';

    const r = this._calculationResult;
    const device = this._devices[this._selectedDevice];
    const activity = this._activities[this._selectedActivity];
    const markerPercent = ((r.best - r.low) / (r.high - r.low)) * 100;
    const tendencyClass = r.tendency === 'overestimate' ? 'overestimate' : r.tendency === 'underestimate' ? 'underestimate' : 'variable';
    const activityVerdict = r.error < 20 ? 'the Most Accurate Activity' : r.error > 40 ? 'One of the Least Accurate Activities' : 'a Mixed-Accuracy Activity';

    return `
      <div class="results-header">
        <div class="results-label">Likely Actual Burn (${device.name})</div>
        <div class="results-best-estimate">${r.best}</div>
        <div class="results-subtext">kcal</div>
        <div class="results-confidence">
          ${r.confidence}% Confidence
          <div class="results-confidence-tip">Based on ${device.name}'s overall ${device.overallAccuracy}% accuracy rating from peer-reviewed research. Higher confidence = narrower error range for this activity.</div>
        </div>
      </div>

      <div class="results-range-bar">
        <div class="range-fill" style="width: ${Math.max(10, markerPercent)}%;">
          ${r.best}
        </div>
      </div>
      <div class="range-labels">
        <span>Low: ${r.low}</span>
        <span>High: ${r.high}</span>
      </div>

      <div class="results-grid" style="margin-top: 30px;">
        <div class="results-card">
          <div class="results-card-label">Your Device Reported</div>
          <div class="results-card-value">${this._reportedCalories}</div>
        </div>
        <div class="results-card">
          <div class="results-card-label">Typical Error</div>
          <div class="results-card-value">±${r.error}%</div>
        </div>
      </div>

      <div class="results-tendency ${tendencyClass}">
        ${r.tendency === 'overestimate' ? '↑ Usually Overestimates' : r.tendency === 'underestimate' ? '↓ Usually Underestimates' : '⟷ Highly Variable'}
      </div>

      <div class="results-expandable">
        <div class="expandable-header" data-expandable="how-calculated" role="button" tabindex="0" aria-expanded="false">
          <span>How ${device.short} Calculated This</span>
          <div class="expandable-toggle">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="expandable-content" data-expandable-content="how-calculated">
          <p><strong>Algorithm:</strong> ${device.algorithm}</p>
          <p style="margin-top: 12px;"><strong>Sensors:</strong> ${device.sensors}</p>
          <p style="margin-top: 12px;"><strong>BMR Method:</strong> ${device.bmrMethod}</p>
          <div class="insight-box">
            This calculation is based on peer-reviewed research. Accuracy varies per individual based on body composition, fitness level, and other factors listed in the "Population Factors" section.
          </div>
        </div>
      </div>

      <div class="results-expandable">
        <div class="expandable-header" data-expandable="activity-insight" role="button" tabindex="0" aria-expanded="false">
          <span>Why ${activity.name} Is ${activityVerdict}</span>
          <div class="expandable-toggle">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="expandable-content" data-expandable-content="activity-insight">
          <p><strong>Description:</strong> ${activity.desc}</p>
          <p style="margin-top: 12px;">This activity typically shows <strong>±${r.error}% error</strong> for ${device.name} across all users. The range of ${r.range[0]}–${r.range[1]}% reflects natural variation based on individual factors like body composition, fitness level, and device fit.</p>
          <p style="margin-top: 12px;">
            ${r.tendency === 'overestimate' ? 'Most users report that ' + device.short + ' overestimates this activity, so your actual burn is likely lower than reported.' : r.tendency === 'underestimate' ? 'Most users report that ' + device.short + ' underestimates this activity, so your actual burn is likely higher than reported.' : device.short + ' shows highly variable accuracy for this activity. Your actual burn could be higher or lower depending on individual factors.'}
          </p>
        </div>
      </div>
    `;
  }

  _renderAccuracyTable() {
    const deviceKeys = Object.keys(this._devices);
    return Object.entries(this._activities)
      .map(([actKey, activity]) => {
        return `
          <tr>
            <td class="activity-name">${activity.name}</td>
            ${deviceKeys.map(devKey => {
              const device = this._devices[devKey];
              const actData = device.accuracyByActivity[actKey];
              const accuracy = 100 - actData.error;
              const color = accuracy >= 80 ? 'var(--green)' : accuracy >= 65 ? 'var(--yellow)' : 'var(--red)';
              return `
              <td>
                <div class="accuracy-bar-container">
                  <div class="accuracy-bar">
                    <div class="accuracy-bar-fill" style="width: ${accuracy}%; background: ${color};">
                      ${accuracy}%
                    </div>
                  </div>
                  <div class="accuracy-label">${actData.tendency === 'overestimate' ? '↑' : actData.tendency === 'underestimate' ? '↓' : '⟷'} ${actData.error}%</div>
                </div>
              </td>`;
            }).join('')}
          </tr>
        `;
      })
      .join('');
  }

  _renderBrandCards() {
    const actNames = this._activities;
    return Object.entries(this._devices)
      .map(([key, device]) => {
        const acts = Object.entries(device.accuracyByActivity);
        const sorted = [...acts].sort((a, b) => a[1].error - b[1].error);
        const best = sorted[0];
        const worst = sorted[sorted.length - 1];
        const minErr = best[1].error;
        const maxErr = worst[1].error;
        const bestName = actNames[best[0]]?.name || best[0];
        const worstName = actNames[worst[0]]?.name || worst[0];
        return `
        <div class="brand-card">
          <div class="brand-header">
            <img src="${device.imageUrl}" alt="${device.name}" class="brand-image">
            <h3 class="brand-title">${device.name}</h3>
            <a href="${device.affiliateUrl}" class="brand-amazon" target="_blank" rel="noopener sponsored">View on Amazon <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M5 10h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          </div>
          <div class="brand-content">
            <div class="brand-stat">
              <span class="brand-stat-label">Typical Error Range</span>
              <span class="brand-stat-value">${minErr}–${maxErr}% MAPE</span>
            </div>
            <div class="brand-stat">
              <span class="brand-stat-label">Best Activity</span>
              <span class="brand-stat-value brand-best">${bestName} (~${minErr}%)</span>
            </div>
            <div class="brand-stat">
              <span class="brand-stat-label">Worst Activity</span>
              <span class="brand-stat-value brand-worst">${worstName} (~${maxErr}%)</span>
            </div>

            <div class="brand-expandable">
              <div class="brand-expand-header" data-expandable="brand-${key}" role="button" tabindex="0" aria-expanded="false">
                <span>How It Works</span>
                <div class="brand-expand-toggle">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <div class="brand-expand-content" data-expandable-content="brand-${key}">
                <p class="brand-desc"><strong>Algorithm:</strong> ${device.algorithm}</p>
                <p class="brand-desc"><strong>Sensors:</strong> ${device.sensors}</p>
                <p class="brand-desc"><strong>Strengths:</strong></p>
                <ul class="brand-list">
                  ${device.strengths.map(s => `<li>${s}</li>`).join('')}
                </ul>
                <p class="brand-desc"><strong>Weaknesses:</strong></p>
                <ul class="brand-list">
                  ${device.weaknesses.map(w => `<li>${w}</li>`).join('')}
                </ul>
                <div style="display: flex; gap: 16px; align-items: center; margin-top: 12px; flex-wrap: wrap;">
                  <a href="${device.sourceUrl}" target="_blank" rel="noopener">Read Study →</a>
                  <a href="${device.affiliateUrl}" class="amazon-link" target="_blank" rel="noopener sponsored">View on Amazon <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M5 10h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      })
      .join('');
  }

  _renderPopulationFactors() {
    const order = { high: 0, moderate: 1, low: 2 };
    return [...this._populationFactors]
      .sort((a, b) => (order[a.impact] ?? 9) - (order[b.impact] ?? 9))
      .map(factor => `
        <div class="factor-card">
          <h4 class="factor-title">${factor.title}</h4>
          <p class="factor-desc">${factor.desc}</p>
          <span class="factor-impact ${factor.impact}">Impact: ${factor.impact}</span>
        </div>
      `)
      .join('');
  }

  _renderSourcesAccordion() {
    return this._studies
      .map((study, idx) => `
        <div class="accordion-item">
          <div class="accordion-header" data-accordion="study-${idx}" role="button" tabindex="0" aria-expanded="false">
            <span>${study.label}</span>
            <div class="accordion-toggle">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="accordion-content" data-accordion-content="study-${idx}">
            <p><a href="${study.url}" target="_blank" rel="noopener">${study.label}</a></p>
          </div>
        </div>
      `)
      .join('');
  }

  _setupEventDelegation() {
    this.shadowRoot.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (target) {
        const action = target.getAttribute('data-action');
        if (action === 'ios-download') {
          this._openLink('https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589');
        } else if (action === 'calculate') {
          this._performCalculation();
        }
      }

      // Device selector
      const deviceBtn = e.target.closest('[data-device]');
      if (deviceBtn) {
        this.shadowRoot.querySelectorAll('[data-device]').forEach(btn => btn.classList.remove('active'));
        deviceBtn.classList.add('active');
        this._selectedDevice = deviceBtn.getAttribute('data-device');
        this._calculationResult = null;
        this._hideResults();
      }

      // Activity selector
      const activityBtn = e.target.closest('[data-activity]');
      if (activityBtn) {
        this.shadowRoot.querySelectorAll('[data-activity]').forEach(btn => btn.classList.remove('active'));
        activityBtn.classList.add('active');
        this._selectedActivity = activityBtn.getAttribute('data-activity');
        this._calculationResult = null;
        this._hideResults();
      }

      // Expandable headers (results panel + brand cards)
      const expandableHeader = e.target.closest('[data-expandable]');
      if (expandableHeader) {
        const id = expandableHeader.getAttribute('data-expandable');
        const content = this.shadowRoot.querySelector(`[data-expandable-content="${id}"]`);
        const toggle = expandableHeader.querySelector('.expandable-toggle') || expandableHeader.querySelector('.brand-expand-toggle');
        if (content && toggle) {
          const isOpen = content.classList.toggle('open');
          toggle.classList.toggle('open');
          expandableHeader.setAttribute('aria-expanded', isOpen);
        }
      }

      // Accordion
      const accordionHeader = e.target.closest('[data-accordion]');
      if (accordionHeader) {
        const id = accordionHeader.getAttribute('data-accordion');
        const content = this.shadowRoot.querySelector(`[data-accordion-content="${id}"]`);
        const toggle = accordionHeader.querySelector('.accordion-toggle');
        if (content && toggle) {
          const isOpen = content.classList.toggle('open');
          toggle.classList.toggle('open');
          accordionHeader.setAttribute('aria-expanded', isOpen);
        }
      }
    });

    // Keyboard navigation for expandables and accordions
    this.shadowRoot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const expandable = e.target.closest('[data-expandable]');
        if (expandable) {
          e.preventDefault();
          expandable.click();
          return;
        }
        const accordion = e.target.closest('[data-accordion]');
        if (accordion) {
          e.preventDefault();
          accordion.click();
        }
      }
    });

    // Calorie input change
    const calorieInput = this.shadowRoot.querySelector('[data-input="reported-calories"]');
    if (calorieInput) {
      calorieInput.addEventListener('input', (e) => {
        this._reportedCalories = parseInt(e.target.value) || null;
        this._calculationResult = null;
        this._hideResults();
      });
    }

  }

  _performCalculation() {
    const result = this._calculateRange();
    if (result) {
      this._calculationResult = result;
      this._showResults();
      this.dispatchEvent(new CustomEvent('kygo-calculation', { detail: result, bubbles: true }));
    }
  }

  _calculateRange() {
    const device = this._devices[this._selectedDevice];
    const activityData = device.accuracyByActivity[this._selectedActivity];
    const reported = this._reportedCalories;

    if (!device || !activityData || !reported || reported <= 0) return null;

    const errorLow = activityData.range[0] / 100;
    const errorHigh = activityData.range[1] / 100;

    let lowBound, highBound, bestEstimate;

    if (activityData.tendency === 'overestimate') {
      lowBound = Math.round(reported * (1 - errorHigh));
      highBound = Math.round(reported * (1 - errorLow));
      bestEstimate = Math.round(reported * (1 - activityData.error / 100));
    } else if (activityData.tendency === 'underestimate') {
      lowBound = Math.round(reported * (1 + errorLow));
      highBound = Math.round(reported * (1 + errorHigh));
      bestEstimate = Math.round(reported * (1 + activityData.error / 100));
    } else {
      lowBound = Math.round(reported * (1 - errorHigh));
      highBound = Math.round(reported * (1 + errorHigh));
      bestEstimate = reported;
    }

    return {
      low: Math.max(0, lowBound),
      high: highBound,
      best: Math.max(0, bestEstimate),
      error: activityData.error,
      range: activityData.range,
      tendency: activityData.tendency,
      confidence: 100 - activityData.error
    };
  }

  _showResults() {
    const panel = this.shadowRoot.querySelector('[data-section="results"]');
    if (panel) {
      const live = panel.querySelector('.results-live');
      if (live) live.innerHTML = this._renderResultsPanel();
      panel.classList.add('show');
    }
  }

  _hideResults() {
    const panel = this.shadowRoot.querySelector('[data-section="results"]');
    if (panel) {
      panel.classList.remove('show');
    }
  }

  _openLink(url) {
    window.open(url, '_blank');
  }

  _setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    this.shadowRoot.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  _injectStructuredData() {
    // WebApplication schema
    if (!document.querySelector('script[data-kygo-calorie-burn-ld]')) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Calorie Burn Accuracy Calculator',
        alternateName: 'Kygo Calorie Burn Accuracy Tool',
        description: 'Enter your wearable\'s reported calorie burn and see the likely actual range. Compares Apple Watch, Fitbit, Garmin, WHOOP, and Oura Ring calorie burn accuracy across 7 activity types using peer-reviewed research from Choe & Kang 2025, Chevance et al. 2022, and Kristiansson et al. 2023.',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        url: 'https://www.kygo.app/tools/calorie-burn-accuracy',
        datePublished: '2026-03-01',
        dateModified: '2026-03-16',
        softwareVersion: '1.0',
        inLanguage: 'en',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        author: { '@type': 'Organization', name: 'Kygo Health', url: 'https://www.kygo.app', logo: 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' },
        publisher: { '@type': 'Organization', name: 'Kygo Health', url: 'https://www.kygo.app' },
        featureList: 'Compare 5 wearable brands, 7 activity types, peer-reviewed accuracy data, personalized calorie range calculator, population factor adjustments',
        keywords: 'calorie burn accuracy, wearable calorie burn, Apple Watch calorie burn accuracy, Fitbit calorie burn accuracy, Garmin calorie burn accuracy, WHOOP calorie burn accuracy, Oura Ring calorie burn accuracy, fitness tracker energy expenditure error, how accurate is Apple Watch calories, wearable calorie overestimate',
        citation: [
          { '@type': 'ScholarlyArticle', name: 'Choe & Kang 2025 — Physiological Measurement meta-analysis of wearable EE accuracy' },
          { '@type': 'ScholarlyArticle', name: 'Chevance et al. 2022 — JMIR systematic review of consumer wearable accuracy' },
          { '@type': 'ScholarlyArticle', name: 'Kristiansson et al. 2023 — BMC Sports Science systematic review' },
          { '@type': 'ScholarlyArticle', name: 'Bellenger et al. 2021 — Sensors WHOOP PPG HR/HRV validation' },
          { '@type': 'ScholarlyArticle', name: 'Stanford 2017 — Apple Watch energy expenditure accuracy study' }
        ]
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-kygo-calorie-burn-ld', '');
      script.textContent = JSON.stringify(ld);
      document.head.appendChild(script);
    }

    // FAQPage schema for Google rich snippets
    if (!document.querySelector('script[data-kygo-calorie-burn-faq]')) {
      const faq = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How accurate is Apple Watch calorie burn?',
            acceptedAnswer: { '@type': 'Answer', text: 'Apple Watch has approximately 71% overall calorie burn accuracy with a 27.96% Mean Absolute Percentage Error (MAPE). It tends to overestimate calories 58% of the time. It is most accurate during steady-state cardio (15% error) and least accurate during walking (26-61% overestimate) and strength training (40% error). Data from Stanford 2017 and Choe & Kang 2025 meta-analysis.' }
          },
          {
            '@type': 'Question',
            name: 'How accurate is Fitbit calorie burn?',
            acceptedAnswer: { '@type': 'Answer', text: 'Fitbit has approximately 50-66% overall calorie burn accuracy. Fitbit consistently overestimates calories burned, with a 27.4% average overestimate during controlled activities. It is most accurate during steady-state cardio (15-20% error) and least accurate during cycling (30% error) and HIIT (35% error). Data from Chevance et al. 2022 JMIR and Murakami et al. 2019.' }
          },
          {
            '@type': 'Question',
            name: 'Which wearable is most accurate for calorie burn tracking?',
            acceptedAnswer: { '@type': 'Answer', text: 'Oura Ring has the highest lab accuracy at 87% with r=0.93 correlation, but it has limited exercise tracking capabilities. For active calorie tracking, Apple Watch leads at 71% overall accuracy. WHOOP averages 82% accuracy. Garmin uses Firstbeat Analytics achieving 6.7% MAPE at medium-hard intensity. Accuracy varies significantly by activity type — steady-state cardio is most accurate across all devices (10-20% error), while strength training and cycling have the highest error rates (29-52%).' }
          },
          {
            '@type': 'Question',
            name: 'Why does my wearable overestimate or underestimate calories?',
            acceptedAnswer: { '@type': 'Answer', text: 'Wearables calculate calories using heart rate, motion data, and personal metrics, but several factors affect accuracy: (1) Skin tone — darker pigmentation can reduce PPG sensor accuracy; (2) Body composition — muscle-to-fat ratio affects metabolic rate but most devices cannot measure it; (3) Wrist vs finger placement — Oura Ring gets better PPG signals from the finger; (4) Activity type — arm-dominant exercises confuse wrist-based accelerometers; (5) Device fit — loose bands create signal noise. Most devices overestimate during low-intensity activities and underestimate during high-intensity exercise.' }
          },
          {
            '@type': 'Question',
            name: 'How do I calculate my actual calories burned from my wearable?',
            acceptedAnswer: { '@type': 'Answer', text: 'Use the Kygo Calorie Burn Accuracy Calculator: (1) Select your wearable brand (Apple Watch, Fitbit, Garmin, WHOOP, or Oura Ring), (2) Choose your activity type, (3) Enter the calorie burn your device reported. The tool applies peer-reviewed error rates from published studies to show your likely actual calorie range, best estimate, and the direction of bias (overestimate vs underestimate) specific to your device and activity combination.' }
          }
        ]
      };
      const faqScript = document.createElement('script');
      faqScript.type = 'application/ld+json';
      faqScript.setAttribute('data-kygo-calorie-burn-faq', '');
      faqScript.textContent = JSON.stringify(faq);
      document.head.appendChild(faqScript);
    }

    // HowTo schema for calculator steps
    if (!document.querySelector('script[data-kygo-calorie-burn-howto]')) {
      const howTo = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to Check Your Wearable\'s Calorie Burn Accuracy',
        description: 'Use peer-reviewed research data to find out how accurate your wearable\'s calorie burn estimate really is.',
        totalTime: 'PT1M',
        tool: { '@type': 'HowToTool', name: 'A wearable fitness tracker (Apple Watch, Fitbit, Garmin, WHOOP, or Oura Ring)' },
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Select your wearable', text: 'Choose your wearable device brand from Apple Watch, Fitbit, Garmin, WHOOP, or Oura Ring.' },
          { '@type': 'HowToStep', position: 2, name: 'Choose your activity', text: 'Select the activity type: steady-state cardio, running, walking, cycling, HIIT, strength training, or swimming.' },
          { '@type': 'HowToStep', position: 3, name: 'Enter reported calories', text: 'Enter the calorie burn number your wearable reported for the activity.' },
          { '@type': 'HowToStep', position: 4, name: 'View your actual range', text: 'The calculator shows your likely actual calorie burn range, best estimate, and whether your device tends to overestimate or underestimate for that activity.' }
        ]
      };
      const howToScript = document.createElement('script');
      howToScript.type = 'application/ld+json';
      howToScript.setAttribute('data-kygo-calorie-burn-howto', '');
      howToScript.textContent = JSON.stringify(howTo);
      document.head.appendChild(howToScript);
    }

    // BreadcrumbList schema
    if (!document.querySelector('script[data-kygo-calorie-burn-breadcrumb]')) {
      const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Kygo Health', 'item': 'https://www.kygo.app' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.kygo.app/tools' },
          { '@type': 'ListItem', 'position': 3, 'name': 'Calorie Burn Accuracy', 'item': 'https://www.kygo.app/tools/calorie-burn-accuracy' }
        ]
      };
      const bcScript = document.createElement('script');
      bcScript.type = 'application/ld+json';
      bcScript.setAttribute('data-kygo-calorie-burn-breadcrumb', '');
      bcScript.textContent = JSON.stringify(breadcrumb);
      document.head.appendChild(bcScript);
    }
  }

  get _devices() {
    return {
      'apple-watch': {
        name: 'Apple Watch',
        short: 'Apple Watch',
        color: '#A2AAAD',
        imageUrl: 'https://static.wixstatic.com/media/273a63_68b4900c356b4d0c8982e5ecd10f04fe~mv2.png',
        affiliateUrl: 'https://amzn.to/4rUcGst',
        algorithm: 'Proprietary ML neural networks trained on metabolic chamber studies. Combines heart rate, accelerometer motion, GPS, elevation, and personal data (age, weight, height, sex).',
        bmrMethod: 'Harris-Benedict equation',
        sensors: 'Optical HR (green LED PPG), 3-axis accelerometer, gyroscope, GPS, barometric altimeter',
        strengths: ['Highest calorie burn accuracy (~71%)', 'Best for steady-state cardio', 'ML-based personalization improves over time'],
        weaknesses: ['Overestimates 58% of the time', 'Walking calories overestimated by 26-61%', 'Cannot account for body composition'],
        overallAccuracy: 71,
        tendency: 'overestimate',
        accuracyByActivity: {
          'steady-cardio': { error: 18, range: [15, 22], tendency: 'overestimate' },
          'running': { error: 20, range: [15, 30], tendency: 'overestimate' },
          'walking': { error: 40, range: [26, 61], tendency: 'overestimate' },
          'cycling': { error: 52, range: [40, 60], tendency: 'mixed' },
          'hiit': { error: 30, range: [20, 45], tendency: 'mixed' },
          'strength': { error: 35, range: [29, 40], tendency: 'overestimate' },
          'swimming': { error: 40, range: [30, 50], tendency: 'mixed' }
        },
        source: 'Choe & Kang 2025, Physiological Measurement (56-study meta-analysis)',
        sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/40199339/'
      },
      'fitbit': {
        name: 'Fitbit',
        short: 'Fitbit',
        color: '#00B0B9',
        imageUrl: 'https://static.wixstatic.com/media/273a63_c12bab319dc34737a386c7449f5f92c7~mv2.png',
        affiliateUrl: 'https://amzn.to/3ZPkHDc',
        algorithm: 'Heart rate is the primary driver. Each minute in a HR zone is converted to METs, then METs to calories using body weight. Steps affect calories only indirectly via HR increase.',
        bmrMethod: 'Standard metabolic equation (likely Mifflin-St Jeor)',
        sensors: '3-axis accelerometer, optical HR, altimeter, gyroscope; Charge 6 adds ECG, SpO2, EDA, temperature',
        strengths: ['Active Zone Minutes gamification', 'SmartTrack auto-detects 6 activity types', 'Consistent error (predictable bias)'],
        weaknesses: ['Walking overestimated by >50%', 'Average 50-66% accuracy range', 'Steps underestimated by ~3.11 steps/min'],
        overallAccuracy: 58,
        tendency: 'mixed',
        accuracyByActivity: {
          'steady-cardio': { error: 20, range: [15, 28], tendency: 'underestimate' },
          'running': { error: 15, range: [10, 20], tendency: 'underestimate' },
          'walking': { error: 50, range: [40, 61], tendency: 'overestimate' },
          'cycling': { error: 52, range: [40, 60], tendency: 'mixed' },
          'hiit': { error: 35, range: [25, 50], tendency: 'mixed' },
          'strength': { error: 40, range: [30, 50], tendency: 'mixed' },
          'swimming': { error: 45, range: [35, 55], tendency: 'mixed' }
        },
        source: 'Chevance et al. 2022, JMIR mHealth (52-study meta-analysis)',
        sourceUrl: 'https://mhealth.jmir.org/2022/4/e35626'
      },
      'garmin': {
        name: 'Garmin',
        short: 'Garmin',
        color: '#007CC3',
        imageUrl: 'https://static.wixstatic.com/media/273a63_c545c093c04d4ca4ade77e5ca43fd433~mv2.png',
        affiliateUrl: 'https://amzn.to/4aF8l5D',
        algorithm: 'Firstbeat Analytics engine: Beat-by-beat R-R interval analysis derives respiration rate from HRV, estimates VO2 from HR/HRV data, then converts to METs → calories. Adding respiration rate improves accuracy ~48% over HR-only methods.',
        bmrMethod: 'Harris-Benedict or Mifflin-St Jeor (unspecified)',
        sensors: 'PPG optical HR (Elevate Gen 4/5 with green + red + infrared LEDs), accelerometer, GPS, ANT+/BLE chest strap compatible',
        strengths: ['Most sophisticated algorithm (Firstbeat)', 'Best medium/hard intensity accuracy (6.7% MAPE)', 'Chest strap pairing dramatically improves accuracy'],
        weaknesses: ['Worst overall accuracy (~48%)', 'Resting calories 15-20% too high', 'Underestimates 69% of the time'],
        overallAccuracy: 48,
        tendency: 'underestimate',
        accuracyByActivity: {
          'steady-cardio': { error: 10, range: [6, 17], tendency: 'underestimate' },
          'running': { error: 15, range: [10, 22], tendency: 'underestimate' },
          'walking': { error: 30, range: [20, 43], tendency: 'underestimate' },
          'cycling': { error: 40, range: [30, 52], tendency: 'underestimate' },
          'hiit': { error: 25, range: [15, 35], tendency: 'underestimate' },
          'strength': { error: 35, range: [25, 43], tendency: 'underestimate' },
          'swimming': { error: 35, range: [25, 45], tendency: 'underestimate' }
        },
        source: 'Firstbeat EE White Paper + IEEE EMBC 2016',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5548984/'
      },
      'whoop': {
        name: 'WHOOP',
        short: 'WHOOP',
        color: '#44B4A6',
        imageUrl: 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png',
        affiliateUrl: 'https://join.whoop.com/',
        algorithm: 'ACSM metabolic equations extended by a 2005 South African HR-based energy expenditure study. Formula: Calories = BMR + f(Heart Rate). Activates when HR exceeds threshold above resting baseline. Recovery status affects calorie estimates — identical workouts show 80-120 kcal variance.',
        bmrMethod: 'Age, gender, height, weight; 5.0 adds 30-day personalized calibration',
        sensors: 'Advanced PPG (Maxim MAX86171 on 4.0), accelerometer, skin temperature, SpO2; 5.0 adds ~26 Hz sampling + respiratory rate',
        strengths: ['Transparent about limitations', 'Best for relative trend tracking', 'Recovery-aware calorie adjustment'],
        weaknesses: ['HIIT accuracy: -13.2% to +75%', 'Resistance training: ±29% error', 'WHOOP 5.0 users report calorie drops vs 4.0'],
        overallAccuracy: 82,
        tendency: 'variable',
        accuracyByActivity: {
          'steady-cardio': { error: 12, range: [8, 18], tendency: 'mixed' },
          'running': { error: 18, range: [12, 25], tendency: 'mixed' },
          'walking': { error: 25, range: [18, 35], tendency: 'underestimate' },
          'cycling': { error: 35, range: [25, 45], tendency: 'mixed' },
          'hiit': { error: 40, range: [13, 75], tendency: 'variable' },
          'strength': { error: 29, range: [20, 40], tendency: 'underestimate' },
          'swimming': { error: 40, range: [30, 50], tendency: 'mixed' }
        },
        source: 'WHOOP PPG Validation (Bellenger 2021, Sensors) + CQU/AIS',
        sourceUrl: 'https://www.mdpi.com/1424-8220/21/10/3571'
      },
      'oura': {
        name: 'Oura Ring',
        short: 'Oura',
        color: '#C4A97D',
        imageUrl: 'https://static.wixstatic.com/media/273a63_722e50e1a554453eb4c71a2e7a58925d~mv2.png',
        affiliateUrl: 'https://amzn.to/4aF93jj',
        algorithm: 'BMR + activity calories via METs throughout the day (resets at 4 AM). November 2024 update incorporated HR intensity data, reducing median active calorie error by 53%. ML model recognizes 40+ activity types at 89% accuracy.',
        bmrMethod: 'Standard metabolic equation using age, weight, height',
        sensors: '18-path multi-wavelength PPG (6 sensors, red/infrared/green LEDs), 3D accelerometer, 2 precision thermistors',
        strengths: ['Best lab correlation (r=0.93)', 'Finger PPG = stronger signal at rest', '2024 HR integration cut error by 53%'],
        weaknesses: ['No GPS', 'Poor for cycling/elliptical (no hand movement)', 'Ring form factor limits exercise tracking'],
        overallAccuracy: 87,
        tendency: 'underestimate',
        accuracyByActivity: {
          'steady-cardio': { error: 13, range: [8, 18], tendency: 'underestimate' },
          'running': { error: 18, range: [13, 25], tendency: 'underestimate' },
          'walking': { error: 20, range: [13, 28], tendency: 'underestimate' },
          'cycling': { error: 55, range: [40, 65], tendency: 'underestimate' },
          'hiit': { error: 30, range: [20, 40], tendency: 'underestimate' },
          'strength': { error: 35, range: [25, 45], tendency: 'underestimate' },
          'swimming': { error: 45, range: [35, 55], tendency: 'underestimate' }
        },
        source: 'Kristiansson et al. 2023, BMC Medical Research Methodology',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9950693/'
      }
    };
  }

  get _activities() {
    return {
      'steady-cardio': { name: 'Steady-State Cardio', desc: 'Elliptical, stair master, rowing at consistent pace', icon: 'heart' },
      'running': { name: 'Running', desc: 'Outdoor or treadmill running', icon: 'activity' },
      'walking': { name: 'Walking', desc: 'Outdoor or treadmill walking', icon: 'steps' },
      'cycling': { name: 'Cycling', desc: 'Indoor or outdoor cycling', icon: 'activity' },
      'hiit': { name: 'HIIT', desc: 'High-intensity interval training', icon: 'zap' },
      'strength': { name: 'Strength Training', desc: 'Weight lifting, resistance exercises', icon: 'dumbbell' },
      'swimming': { name: 'Swimming', desc: 'Pool or open water swimming', icon: 'activity' }
    };
  }

  get _populationFactors() {
    return [
      { title: 'Skin Tone', desc: 'LED-based optical sensors are less effective with darker skin tones. Garmin Elevate Gen 5 and Apple Watch Series 9+ have improved this with multi-wavelength LEDs.', impact: 'moderate' },
      { title: 'Body Composition / BMI', desc: 'Algorithms are trained on average body composition. Higher BMI or unusually lean/muscular builds skew calorie estimates because the HR-to-calorie relationship differs.', impact: 'high' },
      { title: 'Medications (Beta Blockers, Stimulants)', desc: 'Beta blockers cap heart rate artificially, causing massive underestimation. Stimulants elevate resting HR, causing overestimation. Devices cannot detect medication effects.', impact: 'high' },
      { title: 'Age', desc: 'Older adults have reduced optical signal quality from skin changes. Max HR formula (220-age) becomes increasingly inaccurate with age.', impact: 'moderate' },
      { title: 'Tattoos', desc: 'Ink interferes with light transmission for optical sensors. Dark, dense tattoos on the wrist can render PPG sensors unreliable.', impact: 'high' },
      { title: 'Device Fit & Placement', desc: 'Loose bands, excessive wrist hair, and incorrect placement all degrade optical sensor accuracy. Devices should sit snug 1-2 finger widths above the wrist bone.', impact: 'high' },
      { title: 'Caffeine & Hormonal State', desc: 'Caffeine elevates HR independently of activity, inflating calorie counts. Menstrual cycle, thyroid conditions, and hormonal changes affect metabolic rate in ways devices cannot detect.', impact: 'moderate' }
    ];
  }

  get _studies() {
    return [
      { label: 'Apple Watch Meta-Analysis (2025) — Choe & Kang, Physiological Measurement', url: 'https://pubmed.ncbi.nlm.nih.gov/40199339/' },
      { label: 'Fitbit Meta-Analysis (2022) — Chevance et al., JMIR mHealth and uHealth', url: 'https://mhealth.jmir.org/2022/4/e35626' },
      { label: 'Oura Ring EE Validation (2023) — Kristiansson et al., BMC Medical Research Methodology', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9950693/' },
      { label: 'WHOOP PPG HR/HRV Validation (2021) — Bellenger et al., Sensors', url: 'https://www.mdpi.com/1424-8220/21/10/3571' },
      { label: '12-Device DLW Validation (2019) — Murakami et al., JMIR mHealth and uHealth', url: 'https://mhealth.jmir.org/2019/8/e13938' },
      { label: 'Stanford Wearable Study (2017) — Shcherbina et al.', url: 'https://med.stanford.edu/news/all-news/2017/05/fitness-trackers-accurately-measure-heart-rate-but-not-calories-burned' },
      { label: 'Garmin/Firstbeat EE Validation (2016) — IEEE EMBC', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5548984/' },
      { label: 'Fitbit — How Calorie Burn Is Calculated', url: 'https://support.google.com/fitbit/answer/14237111' },
      { label: 'Garmin — Calorie Terminology FAQ', url: 'https://support.garmin.com/en-US/?faq=lkl4cwCLlK7ox362uGQEV7' },
      { label: 'Firstbeat — Energy Expenditure White Paper (PDF)', url: 'https://assets.firstbeat.com/firstbeat/uploads/2015/10/white_paper_energy_expenditure_estimation.pdf' },
      { label: 'WHOOP — How Calories Are Calculated', url: 'https://support.whoop.com/hc/en-us/articles/360033775513-How-does-WHOOP-calculate-calories-burned-' },
      { label: 'Oura — Activity Improvements (Nov 2024)', url: 'https://ouraring.com/blog/activity-improvements/' },
      { label: 'Apple — Heart Rate & Calorimetry White Paper', url: 'https://www.apple.com/health/pdf/Heart_Rate_Calorimetry_Activity_on_Apple_Watch_November_2024.pdf' },
      { label: 'WHOOP — Strain Explained', url: 'https://www.whoop.com/thelocker/understanding-strain/' },
      { label: 'WHOOP — Calorie Tracking Science', url: 'https://www.whoop.com/thelocker/calorie-tracking-science/' },
      { label: 'Oura — Ring 4 Technology', url: 'https://ouraring.com/blog/ring-4-technology/' },
      { label: 'Oura — Finger-Worn Wearable Accuracy', url: 'https://ouraring.com/blog/finger-worn-wearable-accuracy/' },
      { label: 'Firstbeat — Calorie Accuracy Blog', url: 'https://www.firstbeat.com/en/blog/how-accurate-are-calorie-counters/' },
      { label: 'WellnessPulse — Accuracy of Fitness Trackers (2025)', url: 'https://wellnesspulse.com/research/accuracy-of-fitness-trackers/' }
    ];
  }
}

// Register the custom element
if (!customElements.get('kygo-calorie-burn-accuracy')) {
  customElements.define('kygo-calorie-burn-accuracy', KygoCalorieBurnAccuracy);
}

// Usage: <kygo-calorie-burn-accuracy></kygo-calorie-burn-accuracy>
