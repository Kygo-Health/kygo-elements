console.log('Kygo Food Scanner custom element loaded!');

// SVG Icons
const Icons = {
  flame: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  arrowRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  sparkles: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
  salad: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1"/><path d="m13 12 4-4"/><path d="M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2"/></svg>`,
  camera: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  utensils: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
  upload: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>`,
  alertTriangle: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  zap: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  share: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>`,
  refresh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
  chevronDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  activity: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  heart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
  leaf: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  info: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  apple: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>`
};

class CaloriesInAnything extends HTMLElement {
  constructor() {
    super();
    this.mode = 'food';
    this.result = null;
    this.analyzing = false;
    this.error = null;
    this.openFaq = null;
    this.dailyLimit = 20;
    this.supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    this.maxFileSizeMB = 10;
    this.logoUrl = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
    this.uploadedImageData = null;
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['result', 'analyzing', 'error'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'result' && newValue) {
      try {
        this.result = JSON.parse(newValue);
        this.analyzing = false;
        this.error = null;
        this.incrementUsage();
        this.render();
      } catch (e) {
        this.handleError('Failed to parse results');
      }
    }
    if (name === 'analyzing') {
      this.analyzing = newValue === 'true';
      this.error = null;
      this.render();
    }
    if (name === 'error' && newValue) {
      this.handleError(newValue);
    }
  }

  getUsageKey() {
    const today = new Date().toISOString().split('T')[0];
    return `calories-usage-${today}`;
  }

  getUsageCount() {
    try {
      return parseInt(localStorage.getItem(this.getUsageKey()) || '0', 10);
    } catch { return 0; }
  }

  incrementUsage() {
    try {
      const count = this.getUsageCount() + 1;
      localStorage.setItem(this.getUsageKey(), count.toString());
    } catch {}
  }

  isRateLimited() { return this.getUsageCount() >= this.dailyLimit; }
  getRemainingUses() { return Math.max(0, this.dailyLimit - this.getUsageCount()); }

  handleError(message) {
    this.analyzing = false;
    this.error = message;
    this.render();
  }

  validateFile(file) {
    if (!file) return { valid: false, error: 'No file selected' };
    const fileName = file.name.toLowerCase();
    if (!this.supportedTypes.includes(file.type) && !fileName.endsWith('.heic') && !fileName.endsWith('.heif')) {
      return { valid: false, error: 'Please upload a JPG, PNG, WebP, or HEIC image' };
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > this.maxFileSizeMB) {
      return { valid: false, error: `Image too large. Max size is ${this.maxFileSizeMB}MB` };
    }
    return { valid: true };
  }

  async compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        const rawBase64 = dataUrl.split(',')[1];

        // HEIC/HEIF: browsers (Chrome, Firefox) can't decode via canvas
        // Send raw base64 directly — Gemini handles HEIC natively
        const lowerName = file.name.toLowerCase();
        if (lowerName.endsWith('.heic') || lowerName.endsWith('.heif') ||
            file.type === 'image/heic' || file.type === 'image/heif') {
          resolve(rawBase64);
          return;
        }

        const img = new Image();
        img.src = dataUrl;
        img.onerror = () => resolve(rawBase64); // fallback if decode fails
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 1200;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7).split(',')[1]);
        };
      };
    });
  }

  async handleUpload(file) {
    if (this.isRateLimited()) {
      this.handleError('Daily limit reached. Try again tomorrow!');
      return;
    }
    try {
      const reader = new FileReader();
      reader.onload = (e) => { this.uploadedImageData = e.target.result; this.render(); };
      reader.readAsDataURL(file);
      const compressedBase64 = await this.compressImage(file);
      this.dispatchEvent(new CustomEvent('imageUploaded', {
        detail: { base64: compressedBase64, mode: this.mode }
      }));
    } catch (err) {
      this.handleError('Failed to process image.');
    }
  }

  reset() {
    this.result = null;
    this.error = null;
    this.uploadedImageData = null;
    this.render();
  }

  toggleFaq(index) {
    const prevIndex = this.openFaq;
    this.openFaq = this.openFaq === index ? null : index;

    // Close previously open FAQ
    if (prevIndex !== null && prevIndex !== index) {
      const prevItem = this.querySelector(`.faq-item[data-index="${prevIndex}"]`);
      if (prevItem) {
        const prevAnswer = prevItem.querySelector('.faq-answer');
        const prevArrow = prevItem.querySelector('.faq-arrow');
        if (prevAnswer) prevAnswer.remove();
        if (prevArrow) prevArrow.classList.remove('open');
      }
    }

    // Toggle current FAQ
    const item = this.querySelector(`.faq-item[data-index="${index}"]`);
    if (!item) return;
    const arrow = item.querySelector('.faq-arrow');
    const existingAnswer = item.querySelector('.faq-answer');

    if (existingAnswer) {
      existingAnswer.remove();
      if (arrow) arrow.classList.remove('open');
    } else {
      const answerText = item.getAttribute('data-answer');
      const answerDiv = document.createElement('div');
      answerDiv.className = 'faq-answer';
      answerDiv.innerHTML = answerText;
      item.appendChild(answerDiv);
      if (arrow) arrow.classList.add('open');
    }
  }

  shareResult() {
    const r = this.result;
    const score = r.healthScore ? ` | Health Score: ${r.healthScore}/10` : '';
    const text = `I just scanned "${r.item}" with Kygo Food Scanner — ${r.calories} calories${score}!\n\n"${r.verdict}"\n\nTry it yourself:`;
    const url = 'https://kygo.app/tools/food-scanner';
    if (navigator.share) {
      navigator.share({ text, url }).catch(() => this.copyToClipboard(text + ' ' + url));
    } else {
      this.copyToClipboard(text + ' ' + url);
    }
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = this.querySelector('#shareBtn');
      if (btn) {
        btn.innerHTML = `${Icons.check}`;
        setTimeout(() => { btn.innerHTML = `${Icons.share}`; }, 2000);
      }
    }).catch(() => {});
  }

  _getHealthScoreColor(score) {
    if (score >= 8) return '#22C55E';
    if (score >= 6) return '#84CC16';
    if (score >= 4) return '#FBBF24';
    if (score >= 2) return '#F97316';
    return '#EF4444';
  }

  render() {
    const remaining = this.getRemainingUses();

    this.innerHTML = `
      <style>
        /* =============================================
           KYGO FOOD SCANNER - LIGHT THEME
           Mobile-first responsive design
           ============================================= */

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .calories-app {
          --dark: #1E293B;
          --light: #F8FAFC;
          --green: #22C55E;
          --green-dark: #16A34A;
          --green-light: rgba(34, 197, 94, 0.1);
          --green-glow: rgba(34, 197, 94, 0.3);
          --gray-50: #f9fafb;
          --gray-100: #F1F5F9;
          --gray-200: #E2E8F0;
          --gray-400: #94A3B8;
          --gray-600: #475569;
          --gray-700: #334155;

          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--light);
          min-height: 100%;
          color: var(--dark);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .calories-app h1, .calories-app h2, .calories-app h3 {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          line-height: 1.2;
        }

        /* HEADER */
        .header {
          background: white;
          border-bottom: 1px solid var(--gray-200);
          padding: 12px 16px;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .header-inner {
          max-width: 768px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 14px;
          color: var(--dark);
          text-decoration: none;
        }
        .logo-img { height: 28px; width: auto; }
        .header-link {
          color: var(--green);
          text-decoration: none;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .header-link:hover { color: var(--green-dark); }

        /* MAIN CONTAINER */
        .main {
          max-width: 768px;
          margin: 0 auto;
          padding: 24px 16px;
        }

        /* HERO */
        .hero { text-align: center; margin-bottom: 24px; }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--green-light);
          color: var(--green-dark);
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .hero-badge svg { width: 14px; height: 14px; }
        .hero h1 {
          font-size: 28px;
          color: var(--dark);
          margin-bottom: 12px;
          letter-spacing: -0.5px;
          line-height: 1.15;
        }
        .hero h1 span { color: var(--green); }
        .hero p {
          font-size: 15px;
          color: var(--gray-600);
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* CARD */
        .card {
          background: white;
          border-radius: 20px;
          border: 1px solid var(--gray-200);
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }

        /* UPLOAD SECTION */
        .upload-section { padding: 24px 16px; }
        .upload-zone {
          border: 2px dashed var(--gray-200);
          border-radius: 16px;
          padding: 32px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          background: var(--gray-50);
        }
        .upload-zone:hover {
          border-color: var(--green);
          background: var(--green-light);
        }
        .upload-zone.drag-over {
          border-color: var(--green);
          background: rgba(34, 197, 94, 0.08);
          transform: scale(1.02);
        }
        .upload-icon {
          width: 64px;
          height: 64px;
          background: var(--green-light);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          transition: all 0.3s;
          color: var(--green);
        }
        .upload-icon svg { width: 28px; height: 28px; stroke: currentColor; }
        .upload-zone:hover .upload-icon {
          transform: scale(1.1);
          box-shadow: 0 0 30px var(--green-glow);
        }
        .upload-text { font-size: 18px; font-weight: 700; color: var(--dark); margin-bottom: 6px; }
        .upload-hint { color: var(--gray-600); font-size: 14px; margin-bottom: 20px; }
        .upload-formats { color: var(--gray-400); font-size: 12px; margin-top: 20px; }

        /* BUTTONS */
        .btn {
          padding: 12px 20px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: inherit;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-primary {
          background: var(--green);
          color: white;
        }
        .btn-primary:hover {
          background: var(--green-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px var(--green-glow);
        }
        .btn-primary:active { transform: translateY(0); }
        .btn-secondary {
          background: var(--gray-100);
          color: var(--dark);
          border: 1px solid var(--gray-200);
        }
        .btn-secondary:hover { background: var(--gray-200); }
        .btn-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .btn-icon { display: flex; align-items: center; }
        .hidden-input { display: none; }

        /* RATE NOTICE */
        .rate-notice {
          text-align: center;
          padding: 14px;
          background: rgba(251, 191, 36, 0.08);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: 12px;
          font-size: 13px;
          color: #92400E;
          margin-top: 16px;
        }
        .rate-notice a { color: var(--green-dark); font-weight: 600; text-decoration: underline; }

        /* ERROR BOX */
        .error-box {
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.15);
          border-radius: 16px;
          padding: 32px 20px;
          text-align: center;
          margin: 20px;
        }
        .error-icon { color: #ef4444; margin-bottom: 12px; display: flex; justify-content: center; }
        .error-text { color: #DC2626; font-weight: 600; font-size: 16px; margin-bottom: 6px; }
        .error-hint { color: var(--gray-600); font-size: 14px; margin-bottom: 20px; }

        /* ANALYZING STATE */
        .analyzing { padding: 48px 20px; text-align: center; }
        .analyzing-icon {
          width: 72px;
          height: 72px;
          background: var(--green-light);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: var(--green);
          animation: pulse 2s infinite;
        }
        .analyzing-icon svg { stroke: currentColor; width: 32px; height: 32px; }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 var(--green-glow); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 25px rgba(34, 197, 94, 0); }
        }
        .analyzing-text { font-size: 18px; font-weight: 700; color: var(--dark); margin-bottom: 6px; }
        .analyzing-hint { color: var(--gray-600); font-size: 14px; }
        .progress-bar {
          width: 100%;
          max-width: 240px;
          height: 5px;
          background: var(--gray-200);
          border-radius: 3px;
          margin: 24px auto 0;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--green), #4ade80, var(--green));
          background-size: 200% 100%;
          border-radius: 3px;
          animation: loading 1.5s ease-in-out infinite;
          width: 60%;
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        /* =============================================
           RESULT SECTION
           ============================================= */
        .result-compact {
          padding: 20px 16px;
          position: relative;
        }
        .result-share-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--gray-100);
          border: 1px solid var(--gray-200);
          color: var(--gray-600);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 10;
        }
        .result-share-btn:hover { background: var(--green-light); color: var(--green); border-color: var(--green); }

        .result-top-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-right: 44px;
        }
        .result-img {
          width: 60px;
          height: 60px;
          border-radius: 14px;
          object-fit: cover;
          border: 2px solid var(--green-light);
          flex-shrink: 0;
        }
        .result-header-info { flex: 1; min-width: 0; }
        .result-item-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: var(--dark);
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .result-intro-text {
          font-size: 12px;
          color: var(--gray-600);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Not food banner */
        .not-food-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(251, 191, 36, 0.08);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: 12px;
          padding: 10px 14px;
          margin-bottom: 12px;
          font-size: 13px;
          color: #92400E;
        }
        .not-food-banner svg { flex-shrink: 0; color: #F59E0B; }

        /* Health Score */
        .health-score-row {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: 14px;
          padding: 14px 16px;
          margin-bottom: 12px;
        }
        .health-score-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
        }
        .health-score-circle svg { position: absolute; top: 0; left: 0; transform: rotate(-90deg); }
        .health-score-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        .health-score-info { flex: 1; }
        .health-score-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--gray-400);
          margin-bottom: 2px;
        }
        .health-score-text { font-size: 13px; color: var(--gray-600); }

        /* Calories row */
        .result-calories-row {
          background: var(--green-light);
          border: 1px solid rgba(34, 197, 94, 0.15);
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .result-cal-number {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: var(--green-dark);
          line-height: 1;
        }
        .result-cal-unit { font-size: 14px; color: var(--gray-600); font-weight: 400; margin-left: 2px; }
        .result-serving-badge {
          background: white;
          border: 1px solid var(--gray-200);
          color: var(--gray-600);
          font-size: 12px;
          font-weight: 500;
          padding: 5px 12px;
          border-radius: 20px;
        }

        /* Macros grid */
        .result-macros-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }
        .result-macro {
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: 10px;
          padding: 10px 8px;
          text-align: center;
        }
        .result-macro-value { font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 700; color: var(--dark); }
        .result-macro-label { font-size: 9px; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

        /* Dietary tags */
        .dietary-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }
        .dietary-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: var(--green-light);
          color: var(--green-dark);
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        .dietary-tag svg { width: 12px; height: 12px; }

        /* Health insights */
        .health-insights {
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 12px;
        }
        .health-insights-title {
          font-size: 11px;
          font-weight: 700;
          color: var(--green-dark);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .health-insights-title svg { width: 14px; height: 14px; stroke: currentColor; }
        .health-insight-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: var(--gray-600);
          line-height: 1.5;
          margin-bottom: 8px;
        }
        .health-insight-item:last-child { margin-bottom: 0; }
        .health-insight-item svg { width: 16px; height: 16px; color: var(--green); flex-shrink: 0; margin-top: 2px; }

        /* Vitamins grid */
        .vitamins-section {
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 12px;
        }
        .vitamins-title {
          font-size: 11px;
          font-weight: 700;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
        }
        .vitamin-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid var(--gray-200);
        }
        .vitamin-item:last-child { border-bottom: none; }
        .vitamin-name { font-size: 13px; color: var(--dark); font-weight: 500; }
        .vitamin-amount { font-size: 12px; color: var(--gray-600); }
        .vitamin-dv {
          font-size: 11px;
          font-weight: 600;
          color: var(--green-dark);
          background: var(--green-light);
          padding: 2px 8px;
          border-radius: 10px;
        }

        /* Verdict box */
        .result-verdict-box {
          background: var(--green-light);
          border: 1px solid rgba(34, 197, 94, 0.15);
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 16px;
        }
        .result-verdict-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--green-dark);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .result-verdict-label svg { width: 14px; height: 14px; stroke: currentColor; }
        .result-verdict-text {
          font-size: 13px;
          color: var(--gray-700);
          line-height: 1.6;
        }

        .result-action-btn {
          width: 100%;
          justify-content: center;
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          color: var(--dark);
        }
        .result-action-btn:hover { background: var(--gray-100); }

        /* DISCLAIMER */
        .disclaimer {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 10px 16px;
          background: var(--gray-50);
          border-top: 1px solid var(--gray-200);
          font-size: 10px;
          color: var(--gray-400);
          line-height: 1.4;
        }
        .disclaimer svg { stroke: currentColor; flex-shrink: 0; margin-top: 1px; }

        /* CTA SECTION */
        .cta-section {
          background: linear-gradient(135deg, var(--green), var(--green-dark));
          border-radius: 20px;
          padding: 32px 20px;
          text-align: center;
          margin-top: 32px;
          position: relative;
          overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        .cta-section-content { position: relative; z-index: 1; }
        .cta-icon {
          width: 56px;
          height: 56px;
          background: rgba(255,255,255,0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
        }
        .cta-icon svg { stroke: currentColor; }
        .cta-section h2 {
          font-size: 22px;
          color: white;
          margin-bottom: 10px;
          line-height: 1.2;
        }
        .cta-section > .cta-section-content > p {
          color: rgba(255,255,255,0.85);
          margin-bottom: 24px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
          font-size: 14px;
          line-height: 1.6;
        }
        .cta-btn-white {
          background: white;
          color: var(--green-dark);
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }
        .cta-btn-white:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .cta-btn-white svg { width: 18px; height: 18px; }
        .cta-features {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
          font-size: 13px;
          color: rgba(255,255,255,0.8);
        }
        .cta-feature { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .cta-check { color: white; display: flex; }

        /* EXAMPLES SECTION */
        .examples-section { margin-top: 32px; }
        .examples-title {
          font-size: 11px;
          font-weight: 700;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 2px;
          text-align: center;
          margin-bottom: 20px;
        }
        .examples-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .example-card {
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .example-card:hover {
          border-color: var(--green);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          transform: translateY(-2px);
        }
        .example-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--green), var(--green-dark));
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.3s;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25);
        }
        .example-icon svg { width: 22px; height: 22px; stroke: currentColor; }
        .example-info { text-align: left; }
        .example-label { font-weight: 600; color: var(--dark); margin-bottom: 2px; font-size: 14px; }
        .example-calories { color: var(--green-dark); font-weight: 700; font-size: 16px; }
        .example-health { color: var(--gray-400); font-size: 11px; margin-top: 2px; }

        /* FAQ SECTION */
        .faq-section { margin-top: 32px; }
        .faq-title {
          font-size: 22px;
          color: var(--dark);
          text-align: center;
          margin-bottom: 20px;
        }
        .faq-list { display: flex; flex-direction: column; gap: 10px; }
        .faq-item {
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: 14px;
          overflow: hidden;
        }
        .faq-question {
          width: 100%;
          padding: 18px 16px;
          background: none;
          border: none;
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: var(--dark);
          font-family: inherit;
          transition: background 0.2s;
          gap: 12px;
          -webkit-tap-highlight-color: transparent;
        }
        .faq-question:hover { background: var(--gray-50); }
        .faq-arrow { color: var(--gray-400); transition: transform 0.3s; display: flex; flex-shrink: 0; }
        .faq-arrow.open { transform: rotate(180deg); }
        .faq-answer {
          padding: 0 16px 18px;
          color: var(--gray-600);
          font-size: 13px;
          line-height: 1.7;
        }
        .faq-answer a { color: var(--green); text-decoration: none; font-weight: 500; }
        .faq-answer a:hover { text-decoration: underline; }

        /* FOOTER */
        .footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--gray-200);
          text-align: center;
        }
        .footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--dark);
          font-weight: 600;
          text-decoration: none;
          margin-bottom: 6px;
          font-size: 14px;
        }
        .footer-brand:hover { color: var(--green); }
        .footer-logo { height: 24px; }
        .footer-tagline { color: var(--gray-600); font-size: 12px; margin-bottom: 12px; }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 16px;
          font-size: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .footer-links a { color: var(--gray-400); text-decoration: none; }
        .footer-links a:hover { color: var(--dark); }
        .footer-copyright { color: var(--gray-400); font-size: 11px; }

        /* =============================================
           TABLET BREAKPOINT (min-width: 480px)
           ============================================= */
        @media (min-width: 480px) {
          .main { padding: 32px 20px; }
          .hero { margin-bottom: 28px; }
          .hero h1 { font-size: 32px; }
          .hero p { font-size: 16px; }
          .upload-section { padding: 32px 24px; }
          .upload-zone { padding: 40px 28px; }
          .upload-icon { width: 72px; height: 72px; }
          .upload-icon svg { width: 32px; height: 32px; }
          .upload-text { font-size: 20px; }
          .result-compact { padding: 24px; }
          .result-img { width: 68px; height: 68px; }
          .result-item-name { font-size: 18px; }
          .result-cal-number { font-size: 34px; }
          .result-macros-grid { grid-template-columns: repeat(3, 1fr); }
          .analyzing { padding: 64px 24px; }
          .analyzing-icon { width: 80px; height: 80px; }
          .analyzing-icon svg { width: 36px; height: 36px; }
          .analyzing-text { font-size: 20px; }
          .error-box { padding: 40px 28px; margin: 24px; }
          .error-text { font-size: 17px; }
        }

        /* =============================================
           SMALL TABLET (min-width: 600px)
           ============================================= */
        @media (min-width: 600px) {
          .examples-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
          .example-card { flex-direction: column; padding: 24px; gap: 12px; }
          .example-info { text-align: center; }
          .example-icon { width: 52px; height: 52px; margin: 0; }
          .example-icon svg { width: 24px; height: 24px; }
          .example-label { font-size: 15px; }
          .example-calories { font-size: 18px; }
          .cta-features { flex-direction: row; gap: 24px; }
          .result-macros-grid { grid-template-columns: repeat(6, 1fr); }
        }

        /* =============================================
           TABLET/DESKTOP (min-width: 768px)
           ============================================= */
        @media (min-width: 768px) {
          .header { padding: 14px 24px; }
          .logo { font-size: 18px; gap: 12px; }
          .logo-img { height: 36px; }
          .header-link { font-size: 14px; gap: 6px; }
          .main { padding: 48px 24px; }
          .hero { margin-bottom: 40px; }
          .hero h1 { font-size: 40px; letter-spacing: -1px; margin-bottom: 16px; }
          .hero p { font-size: 18px; }
          .card { border-radius: 24px; }
          .upload-section { padding: 48px; }
          .upload-zone { padding: 56px 32px; border-radius: 20px; }
          .upload-zone:hover { transform: translateY(-2px); }
          .upload-icon { width: 80px; height: 80px; border-radius: 24px; margin-bottom: 24px; }
          .upload-icon svg { width: 36px; height: 36px; }
          .upload-text { font-size: 22px; margin-bottom: 8px; }
          .upload-hint { font-size: 15px; margin-bottom: 28px; }
          .upload-formats { font-size: 13px; margin-top: 24px; }
          .btn { padding: 14px 28px; border-radius: 14px; font-size: 15px; gap: 10px; }
          .result-compact { padding: 32px; }
          .result-share-btn { top: 24px; right: 24px; }
          .result-top-row { gap: 16px; margin-bottom: 20px; padding-right: 48px; }
          .result-img { width: 72px; height: 72px; border-radius: 16px; }
          .result-item-name { font-size: 20px; margin-bottom: 4px; }
          .result-intro-text { font-size: 13px; }
          .result-calories-row { padding: 16px 20px; margin-bottom: 16px; }
          .result-cal-number { font-size: 36px; }
          .result-cal-unit { font-size: 16px; margin-left: 4px; }
          .result-macros-grid { margin-bottom: 16px; }
          .result-macro { padding: 12px 8px; }
          .result-macro-value { font-size: 16px; }
          .result-macro-label { font-size: 10px; }
          .result-verdict-box { padding: 16px; margin-bottom: 20px; }
          .result-verdict-text { font-size: 14px; }
          .disclaimer { padding: 12px 24px; font-size: 11px; }
          .analyzing { padding: 80px 32px; }
          .analyzing-icon { width: 88px; height: 88px; border-radius: 28px; margin-bottom: 28px; }
          .analyzing-icon svg { width: 40px; height: 40px; }
          .analyzing-text { font-size: 22px; margin-bottom: 8px; }
          .analyzing-hint { font-size: 15px; }
          .progress-bar { max-width: 280px; height: 6px; margin-top: 28px; }
          .error-box { border-radius: 20px; padding: 48px; margin: 32px; }
          .error-text { font-size: 18px; margin-bottom: 8px; }
          .error-hint { font-size: 15px; margin-bottom: 24px; }
          .cta-section { border-radius: 24px; padding: 56px 40px; margin-top: 48px; }
          .cta-icon { width: 64px; height: 64px; border-radius: 20px; margin-bottom: 24px; }
          .cta-section h2 { font-size: 28px; margin-bottom: 12px; }
          .cta-section > .cta-section-content > p { font-size: 16px; margin-bottom: 32px; }
          .cta-features { gap: 32px; margin-top: 24px; font-size: 14px; }
          .examples-section { margin-top: 48px; }
          .examples-title { margin-bottom: 24px; }
          .example-card { border-radius: 20px; padding: 28px; }
          .example-card:hover { transform: translateY(-4px); }
          .example-icon { width: 56px; height: 56px; border-radius: 16px; }
          .example-icon svg { width: 26px; height: 26px; }
          .faq-section { margin-top: 48px; }
          .faq-title { font-size: 28px; margin-bottom: 28px; }
          .faq-list { gap: 12px; }
          .faq-item { border-radius: 16px; }
          .faq-question { padding: 24px; font-size: 16px; gap: 16px; }
          .faq-answer { padding: 0 24px 24px; font-size: 15px; }
          .footer { margin-top: 48px; padding-top: 32px; }
          .footer-brand { gap: 10px; font-size: 16px; margin-bottom: 8px; }
          .footer-logo { height: 28px; }
          .footer-tagline { font-size: 14px; margin-bottom: 16px; }
          .footer-links { gap: 24px; font-size: 14px; margin-bottom: 16px; }
          .footer-copyright { font-size: 13px; }
        }

        /* =============================================
           ANIMATIONS
           ============================================= */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero { opacity: 0; animation: fadeInUp 0.6s ease-out forwards; }
        .card { opacity: 0; animation: fadeInUp 0.6s ease-out 0.15s forwards; }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

        .example-card { opacity: 0; transform: translateY(20px); }
        .example-card.visible {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out, border-color 0.3s, box-shadow 0.3s;
        }

        .faq-item { opacity: 0; transform: translateY(15px); }
        .faq-item.visible {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .upload-zone, .btn, .example-card, .faq-arrow { transition: none; }
          .upload-zone:hover, .example-card:hover { transform: none; }
          .btn-primary:hover { transform: none; }
          .analyzing-icon, .progress-fill { animation: none; }
          .hero, .card, .example-card, .faq-item, .animate-on-scroll {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      </style>

      <div class="calories-app">
        <header class="header">
          <div class="header-inner">
            <a href="https://kygo.app" class="logo" target="_blank">
              <img src="${this.logoUrl}" alt="Kygo" class="logo-img" />
              Food Scanner
            </a>
            <a href="https://kygo.app" class="header-link" target="_blank">
              Get Kygo App ${Icons.arrowRight}
            </a>
          </div>
        </header>

        <main class="main">
          <div class="hero">
            <div class="hero-badge">
              ${Icons.salad} AI-Powered Nutrition Analysis
            </div>
            <h1>Scan your food. <span>Know your nutrition.</span></h1>
            <p>Snap a photo of any meal and get instant calories, macros, vitamins, and health insights. Free, no signup required.</p>
          </div>

          <div class="card">
            ${this.error ? this.renderError() :
              this.analyzing ? this.renderAnalyzing() :
              this.result ? this.renderResult() :
              this.renderUpload()}
            <div class="disclaimer">
              ${Icons.info}
              <span>AI-generated estimates for informational purposes. Not a substitute for professional nutritional advice.</span>
            </div>
          </div>
          ${!this.result && !this.error && !this.analyzing && remaining <= 5 ? `
            <div class="rate-notice">
              ${Icons.zap} ${remaining} free scan${remaining !== 1 ? 's' : ''} remaining today. <a href="https://kygo.app" target="_blank">Get unlimited with Kygo app</a>
            </div>
          ` : ''}

          <div class="cta-section animate-on-scroll">
            <div class="cta-section-content">
              <div class="cta-icon">${Icons.activity}</div>
              <h2>Go beyond calories. See cause and effect.</h2>
              <p>Kygo connects your meals with sleep, HRV, and recovery data from Oura, Fitbit, Garmin & Apple Watch to reveal which foods help you perform best.</p>
              <a href="https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589" class="cta-btn-white" target="_blank">
                ${Icons.apple}
                Download Free on iOS
              </a>
              <div class="cta-features">
                <span class="cta-feature"><span class="cta-check">${Icons.check}</span> Free forever plan</span>
                <span class="cta-feature"><span class="cta-check">${Icons.check}</span> Syncs with 4+ wearables</span>
                <span class="cta-feature"><span class="cta-check">${Icons.check}</span> AI food logging</span>
              </div>
            </div>
          </div>

          <div class="examples-section animate-on-scroll">
            <h3 class="examples-title">Popular Scans</h3>
            <div class="examples-grid">
              <div class="example-card">
                <div class="example-icon">${Icons.salad}</div>
                <div class="example-info">
                  <div class="example-label">Avocado Toast</div>
                  <div class="example-calories">420 cal</div>
                  <div class="example-health">Heart healthy fats</div>
                </div>
              </div>
              <div class="example-card">
                <div class="example-icon">${Icons.utensils}</div>
                <div class="example-info">
                  <div class="example-label">Chicken Salad</div>
                  <div class="example-calories">380 cal</div>
                  <div class="example-health">High protein</div>
                </div>
              </div>
              <div class="example-card">
                <div class="example-icon">${Icons.leaf}</div>
                <div class="example-info">
                  <div class="example-label">Acai Bowl</div>
                  <div class="example-calories">510 cal</div>
                  <div class="example-health">Antioxidant rich</div>
                </div>
              </div>
            </div>
          </div>

          <div class="faq-section">
            <h2 class="faq-title">Questions & Answers</h2>
            <div class="faq-list">
              ${this.renderFaqItem(0, "How accurate are the nutrition estimates?", "Our AI identifies ingredients and estimates portion sizes using visual analysis. Results are reliable for everyday tracking and meal awareness. For clinical dietary planning, we recommend pairing this with a registered dietitian. Accuracy improves with well-lit, overhead photos of plated meals.")}
              ${this.renderFaqItem(1, "What info does each scan include?", "Every scan returns calories, six macronutrients (protein, carbs, fat, fiber, sugar, sodium), a 1\u201310 health score, key vitamins and minerals with % daily value, dietary tags like <strong>High Protein</strong> or <strong>Heart Healthy</strong>, and actionable health insights specific to that food.")}
              ${this.renderFaqItem(2, "What photo formats are supported?", "JPG, PNG, WebP, and HEIC (iPhone photos). You can upload from your camera roll, take a photo directly, or drag and drop. Images are compressed client-side before analysis\u2014your original photo never leaves your device.")}
              ${this.renderFaqItem(3, "How does this connect to the Kygo app?", "This scanner gives you instant one-off nutrition checks. The <a href=\"https://kygo.app\" target=\"_blank\">Kygo app</a> takes it further\u2014log meals daily and connect your wearable (Oura, Apple Watch, Fitbit, Garmin) to discover how specific foods affect your sleep, HRV, energy, and recovery over time.")}
              ${this.renderFaqItem(4, "Is there a daily limit?", "You get ${this.dailyLimit} free scans per day with no sign-up required. The Kygo app includes unlimited AI-powered food logging along with wearable correlations and a free forever plan.")}
              ${this.renderFaqItem(5, "What if I scan something that isn't food?", "The AI will detect non-food items and let you know. You'll see a notice that the image doesn't appear to be food, along with a prompt to try again with a meal photo.")}
            </div>
          </div>

          <footer class="footer">
            <a href="https://kygo.app" class="footer-brand" target="_blank">
              <img src="${this.logoUrl}" alt="Kygo Health" class="footer-logo" />
              Kygo Health
            </a>
            <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
            <div class="footer-links">
              <a href="https://kygo.app" target="_blank">Kygo App</a>
              <a href="https://kygo.app/privacy" target="_blank">Privacy</a>
              <a href="https://kygo.app/terms" target="_blank">Terms</a>
            </div>
            <p class="footer-copyright">&copy; ${new Date().getFullYear()} Kygo Health LLC</p>
          </footer>
        </main>
      </div>
    `;

    this.attachEventListeners();
  }

  renderUpload() {
    return `
      <div class="upload-section">
        <div class="upload-zone" id="dropZone">
          <div class="upload-icon">${Icons.camera}</div>
          <p class="upload-text">Snap or upload your meal</p>
          <p class="upload-hint">Take a photo or drag and drop to get instant nutrition info</p>
          <div class="btn-row">
            <button class="btn btn-primary" id="uploadBtn">
              <span class="btn-icon">${Icons.upload}</span> Upload Photo
            </button>
            <button class="btn btn-secondary" id="cameraBtn">
              <span class="btn-icon">${Icons.camera}</span> Take Photo
            </button>
          </div>
          <input type="file" id="fileInput" class="hidden-input" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif">
          <input type="file" id="cameraInput" class="hidden-input" accept="image/*" capture="environment">
          <p class="upload-formats">JPG, PNG, WebP, HEIC &bull; iPhone photos supported &bull; Max ${this.maxFileSizeMB}MB</p>
        </div>
      </div>
    `;
  }

  renderAnalyzing() {
    return `
      <div class="analyzing">
        <div class="analyzing-icon">${Icons.salad}</div>
        <p class="analyzing-text">Analyzing your meal...</p>
        <p class="analyzing-hint">Identifying ingredients and calculating nutrition</p>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
    `;
  }

  renderError() {
    return `
      <div class="error-box">
        <div class="error-icon">${Icons.alertTriangle}</div>
        <p class="error-text">${this.error}</p>
        <p class="error-hint">Let's try that again</p>
        <button class="btn btn-primary" id="retryBtn">Try Again</button>
      </div>
    `;
  }

  renderResult() {
    const r = this.result;
    const macroLabels = { 'Protein': 'Protein', 'Carbohydrates': 'Carbs', 'Fat': 'Fat', 'Fiber': 'Fiber', 'Sugar': 'Sugar', 'Sodium': 'Sodium' };
    const isFood = r.isFood !== false;
    const hasHealthScore = typeof r.healthScore === 'number';
    const hasVitamins = Array.isArray(r.vitamins) && r.vitamins.length > 0;
    const hasInsights = Array.isArray(r.healthInsights) && r.healthInsights.length > 0;
    const hasTags = Array.isArray(r.dietaryTags) && r.dietaryTags.length > 0;
    const scoreColor = hasHealthScore ? this._getHealthScoreColor(r.healthScore) : '#22C55E';
    const scorePercent = hasHealthScore ? (r.healthScore / 10) * 100 : 0;
    const circumference = 2 * Math.PI * 22;
    const strokeDash = (scorePercent / 100) * circumference;

    return `
      <div class="result-compact">
        <button class="result-share-btn" id="shareBtn" title="Share result">${Icons.share}</button>

        <div class="result-top-row">
          ${this.uploadedImageData ? `<img src="${this.uploadedImageData}" alt="${r.item}" class="result-img" />` : ''}
          <div class="result-header-info">
            <p class="result-item-name">${r.item}</p>
            <p class="result-intro-text">${r.intro}</p>
          </div>
        </div>

        ${!isFood ? `
          <div class="not-food-banner">
            ${Icons.info}
            <span>This doesn't appear to be food. Nutritional values shown are theoretical estimates.</span>
          </div>
        ` : ''}

        ${hasHealthScore && isFood ? `
          <div class="health-score-row">
            <div class="health-score-circle">
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="22" fill="none" stroke="#E2E8F0" stroke-width="4"/>
                <circle cx="26" cy="26" r="22" fill="none" stroke="${scoreColor}" stroke-width="4" stroke-linecap="round"
                  stroke-dasharray="${strokeDash} ${circumference}" />
              </svg>
              <span class="health-score-value" style="color: ${scoreColor}">${r.healthScore}</span>
            </div>
            <div class="health-score-info">
              <div class="health-score-label">Health Score</div>
              <div class="health-score-text">${r.healthScore >= 8 ? 'Excellent nutritional value' : r.healthScore >= 6 ? 'Good nutritional choice' : r.healthScore >= 4 ? 'Moderate nutritional value' : 'Consider healthier alternatives'}</div>
            </div>
          </div>
        ` : ''}

        <div class="result-calories-row">
          <div>
            <span class="result-cal-number">${r.calories}</span>
            <span class="result-cal-unit">cal</span>
          </div>
          ${r.servingSize ? `<span class="result-serving-badge">${r.servingSize}</span>` :
            r.digestibility ? `<span class="result-serving-badge">${r.digestibility} digestible</span>` : ''}
        </div>

        <div class="result-macros-grid">
          ${r.breakdown.map(b => `
            <div class="result-macro">
              <div class="result-macro-value">${b.value}</div>
              <div class="result-macro-label">${macroLabels[b.nutrient] || b.nutrient}</div>
            </div>
          `).join('')}
        </div>

        ${hasTags ? `
          <div class="dietary-tags">
            ${r.dietaryTags.map(tag => `<span class="dietary-tag">${Icons.check} ${tag}</span>`).join('')}
          </div>
        ` : ''}

        ${hasInsights ? `
          <div class="health-insights">
            <div class="health-insights-title">${Icons.heart} Health Insights</div>
            ${r.healthInsights.map(insight => `
              <div class="health-insight-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                <span>${insight}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${hasVitamins ? `
          <div class="vitamins-section">
            <div class="vitamins-title">Key Vitamins & Minerals</div>
            ${r.vitamins.map(v => `
              <div class="vitamin-item">
                <span class="vitamin-name">${v.name}</span>
                <span class="vitamin-amount">${v.amount}</span>
                ${v.dv ? `<span class="vitamin-dv">${v.dv} DV</span>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="result-verdict-box">
          <div class="result-verdict-label">${Icons.sparkles} AI Nutritional Summary</div>
          <p class="result-verdict-text">${r.verdict}</p>
        </div>

        <button class="btn result-action-btn" id="resetBtn">
          <span class="btn-icon">${Icons.refresh}</span> Scan Another Food
        </button>
      </div>
    `;
  }

  renderFaqItem(index, question, answer) {
    const isOpen = this.openFaq === index;
    const escapedAnswer = answer.replace(/"/g, '&quot;');
    return `
      <div class="faq-item" data-index="${index}" data-answer="${escapedAnswer}">
        <button class="faq-question" data-faq="${index}">
          ${question}
          <span class="faq-arrow ${isOpen ? 'open' : ''}">${Icons.chevronDown}</span>
        </button>
        ${isOpen ? `<div class="faq-answer">${answer}</div>` : ''}
      </div>
    `;
  }

  _setupScrollAnimations() {
    requestAnimationFrame(() => {
      const elements = this.querySelectorAll('.animate-on-scroll');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
      elements.forEach(el => observer.observe(el));

      const exampleCards = this.querySelectorAll('.example-card');
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const index = Array.from(card.parentElement.children).indexOf(card);
            setTimeout(() => card.classList.add('visible'), index * 100);
            cardObserver.unobserve(card);
          }
        });
      }, { threshold: 0.1 });
      exampleCards.forEach(card => cardObserver.observe(card));

      const faqItems = this.querySelectorAll('.faq-item');
      const faqObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const item = entry.target;
            const index = Array.from(item.parentElement.children).indexOf(item);
            setTimeout(() => item.classList.add('visible'), index * 80);
            faqObserver.unobserve(item);
          }
        });
      }, { threshold: 0.1 });
      faqItems.forEach(item => faqObserver.observe(item));
    });
  }

  attachEventListeners() {
    const uploadBtn = this.querySelector('#uploadBtn');
    const cameraBtn = this.querySelector('#cameraBtn');
    const fileInput = this.querySelector('#fileInput');
    const cameraInput = this.querySelector('#cameraInput');
    const dropZone = this.querySelector('#dropZone');

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const validation = this.validateFile(file);
        if (!validation.valid) { this.handleError(validation.error); return; }
        this.analyzing = true;
        this.render();
        this.handleUpload(file);
      });
    }

    if (cameraBtn && cameraInput) {
      cameraBtn.addEventListener('click', () => cameraInput.click());
      cameraInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        this.analyzing = true;
        this.render();
        this.handleUpload(file);
      });
    }

    if (dropZone) {
      ['dragenter', 'dragover'].forEach(evt => {
        dropZone.addEventListener(evt, (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
      });
      ['dragleave', 'drop'].forEach(evt => {
        dropZone.addEventListener(evt, (e) => { e.preventDefault(); dropZone.classList.remove('drag-over'); });
      });
      dropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        if (!file) return;
        const validation = this.validateFile(file);
        if (!validation.valid) { this.handleError(validation.error); return; }
        this.analyzing = true;
        this.render();
        this.handleUpload(file);
      });
      dropZone.addEventListener('click', (e) => {
        if (e.target.closest('.btn')) return;
        if (fileInput) fileInput.click();
      });
    }

    const resetBtn = this.querySelector('#resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

    const retryBtn = this.querySelector('#retryBtn');
    if (retryBtn) retryBtn.addEventListener('click', () => this.reset());

    const shareBtn = this.querySelector('#shareBtn');
    if (shareBtn) shareBtn.addEventListener('click', () => this.shareResult());

    this.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => this.toggleFaq(parseInt(btn.dataset.faq, 10)));
    });

    this._setupScrollAnimations();
  }
}

customElements.define('calories-in-anything', CaloriesInAnything);
