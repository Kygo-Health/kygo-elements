/**
 * Kygo Health — Calorie Burn Accuracy Calculator
 * Tag: kygo-calorie-burn-accuracy
 * Interactive calculator showing how accurate your wearable's calorie burn estimate really is
 */

/** SEO helper — injects visible text outside Shadow DOM for crawlers */
function __seo(el, text) {
  if (el.querySelector('[data-seo]')) return;
  const d = document.createElement('div');
  d.setAttribute('data-seo', '');
  d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
  d.textContent = text;
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
    this._showAndroidModal = false;
    this._androidEmail = '';
  }

  connectedCallback() {
    this._render();
    this._setupEventDelegation();
    this._setupIntersectionObserver();
    this._injectStructuredData();
    __seo(this, 'Calorie Burn Accuracy Calculator by Kygo Health. How accurate is your wearable\\'s calorie burn estimate? Compare calorie burn accuracy of Apple Watch, Fitbit, Garmin, WHOOP, and Oura Ring across 7 activity types: steady-state cardio, running, walking, cycling, HIIT, strength training, and swimming. Enter your reported calorie burn and see the likely actual range based on peer-reviewed research. Apple Watch has 71% overall calorie accuracy with 27.96% MAPE. Fitbit averages 50-66% accuracy with consistent bias. Garmin uses Firstbeat Analytics with 6.7% MAPE at medium-hard intensity but 48% overall accuracy. WHOOP uses ACSM equations extended by heart rate analysis with variable accuracy. Oura Ring achieves 87% lab accuracy with r=0.93 correlation. Strength training and cycling are the least accurate activities across all devices (29-52% error). Steady-state cardio is most accurate (10-20% error). Factors affecting accuracy include skin tone, body composition, medications, tattoos, device fit, and caffeine. Data sourced from Choe & Kang 2025 Physiological Measurement meta-analysis, Chevance et al. 2022 JMIR, Kristiansson et al. 2023 BMC, Bellenger et al. 2021 Sensors, Murakami et al. 2019 JMIR, Stanford 2017, and Firstbeat IEEE EMBC 2016.');
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
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
          font-family: 'DM Sans', system-ui, sans-serif;
          overflow-x: hidden;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-weight: 600;
          line-height: 1.2;
        }

        h1 {
          font-size: clamp(26px, 7vw, 36px);
          margin-bottom: 16px;
        }

        h2 {
          font-size: clamp(22px, 5.5vw, 32px);
          margin-bottom: 20px;
          margin-top: 40px;
        }

        h3 {
          font-size: clamp(18px, 4vw, 24px);
          margin-bottom: 12px;
        }

        p, li {
          font-size: 16px;
          line-height: 1.6;
          color: var(--gray-600);
        }

        a {
          color: var(--green);
          text-decoration: none;
          transition: color 0.2s;
        }

        a:hover {
          color: var(--green-dark);
          text-decoration: underline;
        }

        button {
          cursor: pointer;
          border: none;
          font-family: inherit;
          transition: all 0.3s;
          font-weight: 600;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }

        /* ==================== HEADER ==================== */
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--light);
          border-bottom: 1px solid var(--gray-200);
          backdrop-filter: blur(10px);
          background-color: rgba(248, 250, 252, 0.95);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
        }

        .header-logo {
          width: 48px;
          height: auto;
          display: block;
        }

        .header-cta {
          background: var(--green);
          color: white;
          padding: 10px 20px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
          transition: all 0.3s;
        }

        .header-cta:hover {
          background: var(--green-dark);
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
          transform: translateY(-2px);
        }

        /* ==================== HERO ==================== */
        .hero {
          padding: 60px 20px;
          text-align: center;
          background: linear-gradient(135deg, var(--light) 0%, var(--gray-100) 100%);
        }

        .hero-badge {
          display: inline-block;
          background: var(--green-light);
          color: var(--green-dark);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .hero h1 {
          color: var(--dark);
          margin-bottom: 16px;
        }

        .hero-subtitle {
          font-size: 18px;
          color: var(--gray-600);
          max-width: 600px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 40px 20px;
          }

          .hero h1 {
            font-size: 28px;
          }
        }

        /* ==================== CALCULATOR SECTION ==================== */
        .calculator-section {
          padding: 60px 20px;
          background: white;
          margin: 40px 0;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          animation-name: fadeInUp;
          animation-duration: 0.6s;
          animation-fill-mode: both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .calculator-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .calculator-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-group label {
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--gray-700);
        }

        .device-selector {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .device-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }

        .device-button {
          background: var(--gray-100);
          border: 2px solid transparent;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 13px;
          font-weight: 600;
          color: var(--gray-600);
        }

        .device-button img {
          width: 32px;
          height: 32px;
          object-fit: contain;
        }

        .device-button.active {
          background: var(--green-light);
          border-color: var(--green);
          color: var(--green-dark);
        }

        .device-button:hover {
          background: var(--gray-200);
          border-color: var(--gray-300);
        }

        .device-button.active:hover {
          background: var(--green-light);
          border-color: var(--green-dark);
        }

        .activity-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
        }

        .activity-button {
          background: var(--gray-100);
          border: 2px solid transparent;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.3s;
          font-size: 13px;
          font-weight: 600;
          text-align: left;
          color: var(--gray-600);
        }

        .activity-button.active {
          background: var(--green-light);
          border-color: var(--green);
          color: var(--green-dark);
        }

        .activity-button:hover {
          background: var(--gray-200);
          border-color: var(--gray-300);
        }

        .activity-button.active:hover {
          background: var(--green-light);
          border-color: var(--green-dark);
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--gray-100);
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          transition: all 0.3s;
        }

        .input-wrapper:focus-within {
          border-color: var(--green);
          background: white;
        }

        .input-wrapper input {
          flex: 1;
          background: transparent;
          border: none;
          font-size: 16px;
          font-weight: 600;
          color: var(--dark);
          outline: none;
        }

        .input-wrapper input::placeholder {
          color: var(--gray-400);
        }

        .input-unit {
          font-size: 14px;
          color: var(--gray-600);
          font-weight: 600;
        }

        .calculate-button {
          background: var(--green);
          color: white;
          padding: 16px 32px;
          border-radius: var(--radius-sm);
          font-size: 16px;
          font-weight: 600;
          width: 100%;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
          margin-top: 20px;
          transition: all 0.3s;
        }

        .calculate-button:hover:not(:disabled) {
          background: var(--green-dark);
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
          transform: translateY(-2px);
        }

        .calculate-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ==================== RESULTS PANEL ==================== */
        .results-panel {
          background: linear-gradient(135deg, var(--dark-card) 0%, var(--dark) 100%);
          color: var(--light);
          padding: 40px;
          border-radius: var(--radius);
          margin-top: 40px;
          display: none;
          animation: fadeInUp 0.6s ease-out;
        }

        .results-panel.show {
          display: block;
        }

        .results-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .results-label {
          font-size: 14px;
          color: var(--gray-200);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .results-best-estimate {
          font-size: 56px;
          font-weight: 700;
          color: var(--green);
          margin-bottom: 8px;
        }

        .results-subtext {
          font-size: 16px;
          color: var(--gray-200);
        }

        .results-confidence {
          display: inline-block;
          background: var(--green-light);
          color: var(--green-dark);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 16px;
        }

        .results-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 40px;
        }

        @media (max-width: 768px) {
          .results-grid {
            grid-template-columns: 1fr;
          }
        }

        .results-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: var(--radius-sm);
        }

        .results-card-label {
          font-size: 13px;
          color: var(--gray-200);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .results-card-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--green);
        }

        .results-tendency {
          display: inline-block;
          background: rgba(251, 191, 36, 0.2);
          border: 1px solid var(--yellow);
          color: var(--yellow);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 20px;
        }

        .results-range-bar {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          height: 40px;
          position: relative;
          margin-top: 20px;
          overflow: hidden;
        }

        .range-fill {
          background: linear-gradient(90deg, var(--green-dark), var(--green));
          height: 100%;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 12px;
          position: relative;
          transition: width 0.4s ease-out;
        }

        .range-marker {
          position: absolute;
          top: 0;
          width: 2px;
          height: 100%;
          background: var(--yellow);
          z-index: 10;
        }

        .range-label {
          position: absolute;
          top: -24px;
          font-size: 12px;
          color: var(--gray-200);
          font-weight: 600;
        }

        .results-expandable {
          margin-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 30px;
        }

        .expandable-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          user-select: none;
          font-weight: 600;
          color: var(--light);
          transition: color 0.2s;
        }

        .expandable-header:hover {
          color: var(--green);
        }

        .expandable-toggle {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s;
        }

        .expandable-toggle.open {
          transform: rotate(180deg);
        }

        .expandable-content {
          display: none;
          margin-top: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-sm);
          font-size: 14px;
          line-height: 1.6;
          color: var(--gray-200);
        }

        .expandable-content.open {
          display: block;
        }

        .insight-box {
          background: rgba(251, 191, 36, 0.1);
          border-left: 4px solid var(--yellow);
          padding: 16px;
          border-radius: var(--radius-sm);
          margin-top: 20px;
          font-size: 14px;
          color: var(--gray-200);
          line-height: 1.6;
        }

        /* ==================== ACCURACY TABLE ==================== */
        .accuracy-section {
          padding: 60px 20px;
          background: white;
          margin: 40px 0;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }

        .accuracy-section h2 {
          text-align: center;
          margin-bottom: 40px;
        }

        .accuracy-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }

        .accuracy-table th {
          background: var(--gray-100);
          padding: 16px;
          text-align: left;
          font-weight: 600;
          color: var(--dark);
          border-bottom: 2px solid var(--gray-200);
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .accuracy-table td {
          padding: 20px 16px;
          border-bottom: 1px solid var(--gray-200);
          vertical-align: middle;
        }

        .accuracy-table tbody tr:hover {
          background: var(--gray-50);
        }

        .activity-name {
          font-weight: 600;
          color: var(--dark);
          min-width: 140px;
        }

        .accuracy-bar-container {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 300px;
        }

        .accuracy-bar {
          position: relative;
          height: 24px;
          background: var(--gray-100);
          border-radius: 4px;
          overflow: hidden;
          flex: 1;
        }

        .accuracy-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--green-dark), var(--green));
          border-radius: 4px;
          transition: width 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 11px;
          font-weight: 600;
        }

        .accuracy-label {
          font-size: 12px;
          color: var(--gray-600);
          min-width: 50px;
          text-align: right;
        }

        .accuracy-insight {
          background: rgba(251, 191, 36, 0.1);
          border-left: 4px solid var(--yellow);
          padding: 20px;
          border-radius: var(--radius-sm);
          margin-top: 30px;
          color: var(--dark);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .accuracy-table {
            font-size: 13px;
          }

          .accuracy-table th,
          .accuracy-table td {
            padding: 12px 8px;
          }

          .accuracy-bar-container {
            flex-direction: column;
            gap: 12px;
            min-width: auto;
          }

          .accuracy-bar {
            width: 100%;
          }

          .activity-name {
            min-width: auto;
          }
        }

        /* ==================== BRAND CARDS ==================== */
        .brands-section {
          padding: 60px 20px;
          background: white;
          margin: 40px 0;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }

        .brands-section h2 {
          text-align: center;
          margin-bottom: 40px;
        }

        .brands-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .brand-card {
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          overflow: hidden;
          transition: all 0.3s;
          cursor: pointer;
        }

        .brand-card:hover {
          border-color: var(--green);
          box-shadow: var(--shadow-hover);
          transform: translateY(-4px);
        }

        .brand-header {
          background: linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .brand-image {
          width: 48px;
          height: 48px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .brand-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--dark);
          margin: 0;
        }

        .brand-content {
          padding: 24px;
        }

        .brand-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--gray-200);
        }

        .brand-stat:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .brand-stat-label {
          font-size: 13px;
          color: var(--gray-600);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .brand-stat-value {
          font-size: 18px;
          font-weight: 700;
          color: var(--green);
        }

        .brand-accuracy {
          font-size: 24px;
          font-weight: 700;
          color: var(--green);
        }

        .brand-expandable {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--gray-200);
        }

        .brand-expand-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          user-select: none;
          font-weight: 600;
          color: var(--dark);
          transition: color 0.2s;
        }

        .brand-expand-header:hover {
          color: var(--green);
        }

        .brand-expand-toggle {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s;
        }

        .brand-expand-toggle.open {
          transform: rotate(180deg);
        }

        .brand-expand-content {
          display: none;
          margin-top: 16px;
          padding: 16px;
          background: white;
          border-radius: var(--radius-sm);
          border: 1px solid var(--gray-200);
        }

        .brand-expand-content.open {
          display: block;
        }

        .brand-desc {
          font-size: 14px;
          color: var(--gray-600);
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .brand-list {
          font-size: 13px;
          color: var(--gray-600);
          list-style: none;
          margin: 12px 0;
        }

        .brand-list li {
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
        }

        .brand-list li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--green);
          font-weight: 600;
        }

        /* ==================== POPULATION FACTORS ==================== */
        .factors-section {
          padding: 60px 20px;
          background: white;
          margin: 40px 0;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }

        .factors-section h2 {
          text-align: center;
          margin-bottom: 40px;
        }

        .factors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .factor-card {
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-sm);
          padding: 24px;
          transition: all 0.3s;
        }

        .factor-card:hover {
          border-color: var(--green);
          box-shadow: var(--shadow-hover);
        }

        .factor-title {
          font-weight: 600;
          color: var(--dark);
          margin-bottom: 8px;
          font-size: 16px;
        }

        .factor-desc {
          font-size: 14px;
          color: var(--gray-600);
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .factor-impact {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .factor-impact.high {
          background: rgba(239, 68, 68, 0.1);
          color: var(--red);
        }

        .factor-impact.moderate {
          background: rgba(251, 191, 36, 0.1);
          color: var(--yellow);
        }

        /* ==================== BLOG CTA ==================== */
        .blog-cta {
          position: relative;
          background: linear-gradient(135deg, var(--dark) 0%, var(--gray-700) 100%);
          padding: 60px 40px;
          border-radius: var(--radius);
          color: white;
          margin: 60px 0;
          overflow: hidden;
        }

        .blog-cta::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.15), transparent);
          border-radius: 50%;
          pointer-events: none;
        }

        .blog-cta-content {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .blog-cta-content {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .blog-cta-left h3 {
          color: white;
          margin-bottom: 16px;
        }

        .blog-cta-badge {
          display: inline-block;
          background: var(--green);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
          position: relative;
        }

        .blog-cta-badge::before {
          content: '';
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .blog-cta-desc {
          color: var(--gray-200);
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .blog-cta-brands {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .blog-cta-brands-label {
          font-size: 13px;
          color: var(--gray-300);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .blog-cta-logos {
          display: flex;
          gap: 12px;
        }

        .blog-cta-logo {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
        }

        .blog-cta-logo img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .blog-cta-button {
          background: var(--green);
          color: white;
          padding: 12px 24px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        }

        .blog-cta-button:hover {
          background: var(--green-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
        }

        /* ==================== SOURCES ==================== */
        .sources-section {
          padding: 60px 20px;
          background: white;
          margin: 40px 0;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }

        .sources-section h2 {
          text-align: center;
          margin-bottom: 40px;
        }

        .sources-accordion {
          max-width: 800px;
          margin: 0 auto;
        }

        .accordion-item {
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-sm);
          margin-bottom: 12px;
          overflow: hidden;
        }

        .accordion-header {
          background: var(--gray-100);
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          user-select: none;
          transition: background 0.2s;
          font-weight: 600;
          color: var(--dark);
        }

        .accordion-header:hover {
          background: var(--gray-200);
        }

        .accordion-toggle {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s;
          flex-shrink: 0;
        }

        .accordion-toggle.open {
          transform: rotate(180deg);
        }

        .accordion-content {
          display: none;
          padding: 20px;
          background: white;
          border-top: 1px solid var(--gray-200);
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .accordion-content.open {
          display: block;
          max-height: 1000px;
        }

        .accordion-content p {
          margin-bottom: 12px;
          font-size: 14px;
          color: var(--gray-600);
        }

        .sources-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .source-link {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: var(--gray-50);
          border-radius: var(--radius-sm);
          border: 1px solid var(--gray-200);
          transition: all 0.3s;
          cursor: pointer;
        }

        .source-link:hover {
          border-color: var(--green);
          background: white;
          box-shadow: var(--shadow);
        }

        .source-icon {
          width: 20px;
          height: 20px;
          color: var(--green);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .source-link-text {
          font-size: 13px;
          color: var(--green);
          font-weight: 600;
          line-height: 1.4;
        }

        /* ==================== CTA SECTION ==================== */
        .cta-section {
          background: linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);
          color: white;
          padding: 80px 40px;
          border-radius: var(--radius);
          text-align: center;
          margin: 60px 0;
        }

        .cta-section h2 {
          color: white;
          margin-bottom: 20px;
        }

        .cta-section p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 18px;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-button-primary {
          background: white;
          color: var(--green);
          padding: 14px 32px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .cta-button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .cta-button-secondary {
          background: transparent;
          color: white;
          padding: 14px 32px;
          border: 2px solid white;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .cta-button-secondary:hover {
          background: white;
          color: var(--green);
        }

        /* ==================== ANDROID MODAL ==================== */
        .modal-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1000;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-overlay.show {
          display: flex;
        }

        .modal {
          background: white;
          border-radius: var(--radius);
          padding: 40px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gray-100);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 20px;
          color: var(--gray-600);
        }

        .modal-close:hover {
          background: var(--gray-200);
          color: var(--dark);
        }

        .modal h3 {
          color: var(--dark);
          margin-bottom: 12px;
        }

        .modal p {
          color: var(--gray-600);
          margin-bottom: 24px;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .modal-input {
          padding: 12px 16px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-sm);
          font-size: 16px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .modal-input:focus {
          outline: none;
          border-color: var(--green);
        }

        .modal-submit {
          background: var(--green);
          color: white;
          padding: 12px 24px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        }

        .modal-submit:hover {
          background: var(--green-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
        }

        /* ==================== FOOTER ==================== */
        .footer {
          background: var(--dark);
          color: var(--gray-300);
          padding: 60px 20px;
          border-top: 1px solid var(--gray-700);
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-section h4 {
          color: white;
          margin-bottom: 16px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
          list-style: none;
        }

        .footer-links a {
          color: var(--gray-300);
          font-size: 14px;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: var(--green);
        }

        .footer-bottom {
          border-top: 1px solid var(--gray-700);
          padding-top: 20px;
          text-align: center;
          font-size: 13px;
          color: var(--gray-400);
        }

        .footer-disclosure {
          font-size: 12px;
          color: var(--gray-500);
          margin-top: 12px;
          line-height: 1.5;
        }

        /* ==================== ANIMATIONS ==================== */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
        }

        .animate-on-scroll.visible {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 16px;
          }

          .calculator-section,
          .accuracy-section,
          .brands-section,
          .factors-section,
          .sources-section {
            padding: 40px 20px;
            margin: 30px 0;
          }

          .blog-cta {
            padding: 40px 20px;
            margin: 40px 0;
          }

          .cta-section {
            padding: 40px 20px;
            margin: 40px 0;
          }

          .modal {
            padding: 32px 20px;
          }
        }
      </style>

      <!-- HEADER -->
      <header class="header">
        <div class="header-content">
          <img src="https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png" alt="Kygo Health" class="header-logo">
          <button class="header-cta" data-action="ios-download">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 5.5h-3V2h-4v3.5h-3a1.5 1.5 0 0 0-1.5 1.5v6a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-6a1.5 1.5 0 0 0-1.5-1.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
            Download
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
                <div class="device-buttons" data-control="device-selector">
                  ${this._renderDeviceButtons()}
                </div>
              </div>

              <div class="form-group">
                <label>Select Your Activity Type</label>
                <div class="activity-buttons" data-control="activity-selector">
                  ${this._renderActivityButtons()}
                </div>
              </div>

              <div class="form-group">
                <label>Your Device Reported</label>
                <div class="input-wrapper">
                  <input type="number" placeholder="0" min="0" data-input="reported-calories">
                  <span class="input-unit">kcal</span>
                </div>
              </div>

              <button class="calculate-button" data-action="calculate">Calculate Actual Burn</button>
            </div>

            <div>
              <div class="results-panel" data-section="results">
                ${this._renderResultsPanel()}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ACCURACY BY ACTIVITY -->
      <section class="accuracy-section animate-on-scroll">
        <div class="container">
          <h2>Accuracy Varies Dramatically by Activity</h2>
          <div class="accuracy-table-wrapper">
            <table class="accuracy-table">
              <thead>
                <tr>
                  <th>Activity Type</th>
                  <th colspan="5" style="text-align: center;">Device Accuracy (↓ = underestimates, ↑ = overestimates)</th>
                </tr>
              </thead>
              <tbody>
                ${this._renderAccuracyTable()}
              </tbody>
            </table>
          </div>
          <div class="accuracy-insight">
            💡 <strong>Key Insight:</strong> Steady-state cardio is the most accurate activity type across all devices. Cycling and strength training are the least accurate regardless of device, with errors ranging from 30–60%.
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
        </div>
      </section>

      <!-- POPULATION FACTORS -->
      <section class="factors-section animate-on-scroll">
        <div class="container">
          <h2>Factors That Affect All Devices</h2>
          <div class="factors-grid">
            ${this._renderPopulationFactors()}
          </div>
        </div>
      </section>

      <!-- BLOG CTA -->
      <section class="blog-cta animate-on-scroll">
        <div class="container">
          <div class="blog-cta-content">
            <div class="blog-cta-left">
              <div class="blog-cta-badge">Free on iOS</div>
              <h3>Track calories with science-backed recommendations.</h3>
              <p class="blog-cta-desc">
                Kygo corrects for wearable inaccuracies in real-time, giving you the confidence to trust your nutrition data.
              </p>
              <div class="blog-cta-brands">
                <span class="blog-cta-brands-label">Works with:</span>
                <div class="blog-cta-logos">
                  <div class="blog-cta-logo">
                    <img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura">
                  </div>
                  <div class="blog-cta-logo">
                    <img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple">
                  </div>
                  <div class="blog-cta-logo">
                    <img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit">
                  </div>
                  <div class="blog-cta-logo">
                    <img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin">
                  </div>
                </div>
              </div>
            </div>
            <div class="blog-cta-right">
              <button class="blog-cta-button" data-action="ios-download">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h8m0 0l-3-3m3 3l-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Get App on iOS
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- SOURCES -->
      <section class="sources-section animate-on-scroll">
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
          <h2>Ready to Fix Your Calorie Data?</h2>
          <p>Get science-backed adjustments for your wearable device. Available now on iOS, coming soon to Android.</p>
          <div class="cta-buttons">
            <button class="cta-button-primary" data-action="ios-download">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h8m0 0l-3-3m3 3l-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Download on iOS
            </button>
            <button class="cta-button-secondary" data-action="android-beta">Join Android Beta</button>
          </div>
        </div>
      </section>

      <!-- ANDROID MODAL -->
      <div class="modal-overlay" data-section="android-modal">
        <div class="modal">
          <button class="modal-close" data-action="close-modal">×</button>
          <h3>Join the Android Beta</h3>
          <p>Be the first to try Kygo on Android. We'll send you exclusive access and early features.</p>
          <form class="modal-form" data-form="android-beta">
            <input type="email" class="modal-input" placeholder="your@email.com" required>
            <button type="submit" class="modal-submit">Send Me Beta Access</button>
          </form>
        </div>
      </div>

      <!-- FOOTER -->
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <h4>About</h4>
              <ul class="footer-links">
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Resources</h4>
              <ul class="footer-links">
                <li><a href="#blog">Blog</a></li>
                <li><a href="#research">Research</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Connect</h4>
              <ul class="footer-links">
                <li><a href="#instagram">Instagram</a></li>
                <li><a href="#twitter">Twitter</a></li>
                <li><a href="#linkedin">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2026 Kygo Health. All rights reserved.</p>
            <p class="footer-disclosure">
              This calculator is for educational purposes only and does not replace professional medical advice.
              Wearable device accuracy varies by individual, environmental factors, and algorithm updates.
              We may earn affiliate commissions through linked products.
            </p>
          </div>
        </div>
      </footer>
    `;
  }

  _renderDeviceButtons() {
    return Object.entries(this._devices)
      .map(([key, device]) => `
        <button class="device-button ${key === this._selectedDevice ? 'active' : ''}" data-device="${key}">
          <img src="${device.imageUrl}" alt="${device.name}">
          ${device.short}
        </button>
      `)
      .join('');
  }

  _renderActivityButtons() {
    return Object.entries(this._activities)
      .map(([key, activity]) => `
        <button class="activity-button ${key === this._selectedActivity ? 'active' : ''}" data-activity="${key}">
          ${activity.name}
        </button>
      `)
      .join('');
  }

  _renderResultsPanel() {
    if (!this._calculationResult) {
      return '<p style="text-align: center; color: var(--gray-400); padding: 40px;">Select device, activity, and enter calories to see results</p>';
    }

    const r = this._calculationResult;
    const device = this._devices[this._selectedDevice];
    const activity = this._activities[this._selectedActivity];
    const markerPercent = ((r.best - r.low) / (r.high - r.low)) * 100;

    return `
      <div class="results-header">
        <div class="results-label">Likely Actual Burn (${device.name})</div>
        <div class="results-best-estimate">${r.best}</div>
        <div class="results-subtext">kcal</div>
        <div class="results-confidence">
          ${r.confidence}% Confidence
        </div>
      </div>

      <div class="results-range-bar">
        <div class="range-fill" style="width: ${markerPercent}%;">
          ${r.best}
        </div>
        <div class="range-marker" style="left: ${markerPercent}%;"></div>
        <div class="range-label" style="left: 2px;">Low: ${r.low}</div>
        <div class="range-label" style="right: 2px;">High: ${r.high}</div>
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

      <div class="results-tendency">
        ${r.tendency === 'overestimate' ? '⬆ Usually Overestimates' : r.tendency === 'underestimate' ? '⬇ Usually Underestimates' : '⟷ Highly Variable'}
      </div>

      <div class="results-expandable">
        <div class="expandable-header" data-expandable="how-calculated">
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
        <div class="expandable-header" data-expandable="activity-insight">
          <span>Why ${activity.name} Is ${r.error < 20 ? 'Accurate' : r.error > 40 ? 'Unreliable' : 'Mixed'} for Accuracy</span>
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
    return Object.entries(this._activities)
      .map(([actKey, activity]) => {
        const cols = Object.entries(this._devices)
          .map(([devKey, device]) => {
            const actData = device.accuracyByActivity[actKey];
            const accuracy = 100 - actData.error;
            return { device, accuracy, error: actData.error, tendency: actData.tendency };
          })
          .sort((a, b) => b.accuracy - a.accuracy);

        return `
          <tr>
            <td class="activity-name">${activity.name}</td>
            ${cols.map(col => `
              <td style="width: 20%;">
                <div class="accuracy-bar-container">
                  <div class="accuracy-bar">
                    <div class="accuracy-bar-fill" style="width: ${col.accuracy}%;">
                      ${col.accuracy}%
                    </div>
                  </div>
                  <div class="accuracy-label">${col.error}% err</div>
                </div>
              </td>
            `).join('')}
          </tr>
        `;
      })
      .join('');
  }

  _renderBrandCards() {
    return Object.entries(this._devices)
      .map(([key, device]) => `
        <div class="brand-card">
          <div class="brand-header">
            <img src="${device.imageUrl}" alt="${device.name}" class="brand-image">
            <h3 class="brand-title">${device.name}</h3>
          </div>
          <div class="brand-content">
            <div class="brand-stat">
              <span class="brand-stat-label">Overall Accuracy</span>
              <span class="brand-accuracy">${device.overallAccuracy}%</span>
            </div>
            <div class="brand-stat">
              <span class="brand-stat-label">Tendency</span>
              <span class="brand-stat-value">${device.tendency === 'overestimate' ? '⬆ Overestimates' : device.tendency === 'underestimate' ? '⬇ Underestimates' : '⟷ Variable'}</span>
            </div>

            <div class="brand-expandable">
              <div class="brand-expand-header" data-expandable="brand-${key}">
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
                <a href="${device.sourceUrl}" target="_blank" style="margin-top: 12px; display: inline-block;">
                  Read Study →
                </a>
              </div>
            </div>
          </div>
        </div>
      `)
      .join('');
  }

  _renderPopulationFactors() {
    return this._populationFactors
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
          <div class="accordion-header" data-accordion="study-${idx}">
            <span>${study.label}</span>
            <div class="accordion-toggle">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="accordion-content" data-accordion-content="study-${idx}">
            <p>Research study: <a href="${study.url}" target="_blank">${study.label}</a></p>
            <p style="margin-top: 12px; font-size: 12px; color: var(--gray-500);">
              External link. Please verify current availability and citation details.
            </p>
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
        } else if (action === 'android-beta') {
          this._showAndroidModal = true;
          this._updateModalState();
        } else if (action === 'close-modal') {
          this._showAndroidModal = false;
          this._updateModalState();
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

      // Expandable headers
      const expandableHeader = e.target.closest('[data-expandable]');
      if (expandableHeader) {
        const id = expandableHeader.getAttribute('data-expandable');
        const content = this.shadowRoot.querySelector(`[data-expandable-content="${id}"]`);
        const toggle = expandableHeader.querySelector('.expandable-toggle');
        if (content && toggle) {
          content.classList.toggle('open');
          toggle.classList.toggle('open');
        }
      }

      // Brand expandable
      const brandHeader = e.target.closest('[data-expandable]');
      if (brandHeader && brandHeader.closest('.brand-card')) {
        const id = brandHeader.getAttribute('data-expandable');
        const content = this.shadowRoot.querySelector(`[data-expandable-content="${id}"]`);
        const toggle = brandHeader.querySelector('.brand-expand-toggle');
        if (content && toggle) {
          content.classList.toggle('open');
          toggle.classList.toggle('open');
        }
      }

      // Accordion
      const accordionHeader = e.target.closest('[data-accordion]');
      if (accordionHeader) {
        const id = accordionHeader.getAttribute('data-accordion');
        const content = this.shadowRoot.querySelector(`[data-accordion-content="${id}"]`);
        const toggle = accordionHeader.querySelector('.accordion-toggle');
        if (content && toggle) {
          content.classList.toggle('open');
          toggle.classList.toggle('open');
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

    // Android modal form
    const form = this.shadowRoot.querySelector('[data-form="android-beta"]');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        this.dispatchEvent(new CustomEvent('kygo-android-beta', { detail: { email }, bubbles: true }));
        this._showAndroidModal = false;
        this._updateModalState();
        form.reset();
      });
    }

    // Modal overlay click
    const modal = this.shadowRoot.querySelector('[data-section="android-modal"]');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this._showAndroidModal = false;
          this._updateModalState();
        }
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
      panel.innerHTML = this._renderResultsPanel();
      panel.classList.add('show');
    }
  }

  _hideResults() {
    const panel = this.shadowRoot.querySelector('[data-section="results"]');
    if (panel) {
      panel.classList.remove('show');
    }
  }

  _updateModalState() {
    const modal = this.shadowRoot.querySelector('[data-section="android-modal"]');
    if (modal) {
      modal.classList.toggle('show', this._showAndroidModal);
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
    if (document.querySelector('script[data-kygo-calorie-burn-ld]')) return;
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Calorie Burn Accuracy Calculator',
      description: 'Enter your wearable\'s reported calorie burn and see the likely actual range. Compares Apple Watch, Fitbit, Garmin, WHOOP, and Oura Ring calorie burn accuracy across 7 activity types using peer-reviewed research.',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      url: 'https://www.kygo.app/tools/calorie-burn-accuracy',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@type': 'Organization', name: 'Kygo Health', url: 'https://www.kygo.app' },
      keywords: 'calorie burn accuracy, wearable calorie burn, Apple Watch calorie burn accuracy, Fitbit calorie burn accuracy, Garmin calorie burn accuracy, WHOOP calorie burn accuracy, Oura Ring calorie burn accuracy, fitness tracker energy expenditure error'
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-kygo-calorie-burn-ld', '');
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
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
          'steady-cardio': { error: 12, range: [7, 17], tendency: 'underestimate' },
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
        imageUrl: 'https://static.wixstatic.com/media/273a63_2e6b13f1ed8b4569b5e5b55e77c75cc1~mv2.png',
        affiliateUrl: 'https://join.whoop.com/',
        algorithm: 'ACSM metabolic equations extended by a 2005 South African HR-based energy expenditure study. Formula: Calories = BMR + f(Heart Rate). Activates when HR exceeds threshold above resting baseline. Recovery status affects calorie estimates — identical workouts show 80-120 kcal variance.',
        bmrMethod: 'Age, gender, height, weight; 5.0 adds 30-day personalized calibration',
        sensors: 'Advanced PPG (Maxim MAX86171 on 4.0), accelerometer, skin temperature, SpO2; 5.0 adds ~26 Hz sampling + respiratory rate',
        strengths: ['Transparent about limitations', 'Best for relative trend tracking', 'Recovery-aware calorie adjustment'],
        weaknesses: ['HIIT accuracy: -13.2% to +75%', 'Resistance training: ±29% error', 'WHOOP 5.0 users report calorie drops vs 4.0'],
        overallAccuracy: 55,
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
        overallAccuracy: 72,
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
      { label: 'WellnessPulse — Accuracy of Fitness Trackers (2025)', url: 'https://wellnesspulse.com/research/accuracy-of-fitness-trackers/' }
    ];
  }
}

// Register the custom element
if (!customElements.get('kygo-calorie-burn-accuracy')) {
  customElements.define('kygo-calorie-burn-accuracy', KygoCalorieBurnAccuracy);
}

// Usage: <kygo-calorie-burn-accuracy></kygo-calorie-burn-accuracy>
