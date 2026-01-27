console.log('Calories In Anything custom element loaded!');

// SVG Icons
const Icons = {
  flame: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  arrowRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  sparkles: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
  salad: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1"/><path d="m13 12 4-4"/><path d="M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2"/></svg>`,
  camera: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  utensils: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
  upload: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>`,
  flask: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`,
  alertTriangle: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  armchair: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>`,
  footprints: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>`,
  smartphone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`,
  zap: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  wheat: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"/><path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/><path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/><path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/></svg>`,
  droplet: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`,
  leaf: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  share: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>`,
  refresh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
  chevronDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  activity: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  twitter: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  copy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  info: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`
};

class CaloriesInAnything extends HTMLElement {
  constructor() {
    super();
    this.mode = 'anything';
    this.result = null;
    this.analyzing = false;
    this.error = null;
    this.openFaq = null;
    this.dailyLimit = 20;
    this.supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
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

  handleModeChange(mode) {
    this.mode = mode;
    this.result = null;
    this.error = null;
    this.uploadedImageData = null;
    this.render();
  }

  handleError(message) {
    this.analyzing = false;
    this.error = message;
    this.render();
  }

  validateFile(file) {
    if (!file) return { valid: false, error: 'No file selected' };
    if (!this.supportedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
      return { valid: false, error: 'Please upload a JPG, PNG, or WebP image' };
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > this.maxFileSizeMB) {
      return { valid: false, error: `Image too large. Max size is ${this.maxFileSizeMB}MB` };
    }
    return { valid: true };
  }

// Helper to shrink the image to a web-friendly size
  async compressImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimension of 1200px is plenty for AI analysis
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
          
          // Quality 0.7 keeps the file small but clear
          resolve(canvas.toDataURL('image/jpeg', 0.7).split(',')[1]);
        };
      };
    });
  }

  // Updated handleUpload
  async handleUpload(file) {
    if (this.isRateLimited()) {
      this.handleError(`Limit reached. Try again tomorrow!`);
      return;
    }
    
    try {
      // 1. Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => { this.uploadedImageData = e.target.result; this.render(); };
      reader.readAsDataURL(file);

      // 2. Compress and Send
      const compressedBase64 = await this.compressImage(file);
      
      this.dispatchEvent(new CustomEvent('imageUploaded', {
        detail: { base64: compressedBase64, mode: this.mode }
      }));
    } catch (err) {
      this.handleError("Failed to process image.");
    }
  }

  reset() {
    this.result = null;
    this.error = null;
    this.uploadedImageData = null;
    this.render();
  }

  toggleFaq(index) {
    this.openFaq = this.openFaq === index ? null : index;
    this.render();
  }

  shareResult() {
    const text = `🔥 I just scanned "${this.result.item}" and it has ${this.result.calories} calories!\n\n"${this.result.verdict}"\n\nTry it yourself:`;
    const url = 'https://kygo.app/tools/calories-in-anything';
    
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
        setTimeout(() => {
          btn.innerHTML = `${Icons.share}`;
        }, 2000);
      }
    }).catch(() => {});
  }

  render() {
    const remaining = this.getRemainingUses();

    this.innerHTML = `
      <style>
        /* =============================================
           MOBILE-FIRST RESPONSIVE STYLES
           Base styles = mobile, then scale up via min-width
           ============================================= */

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .calories-app {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(180deg, #0a0f1a 0%, #111827 50%, #0a0f1a 100%);
          min-height: 100%;
          color: #e2e8f0;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* HEADER - Mobile First */
        .header {
          background: rgba(10, 15, 26, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(16, 185, 129, 0.1);
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
          color: #f1f5f9;
          text-decoration: none;
        }
        .logo-img { height: 28px; width: auto; }
        .header-link {
          color: #10b981;
          text-decoration: none;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }
        .header-link:hover { color: #34d399; }
        .header-link svg { stroke: currentColor; }

        /* MAIN CONTAINER - Mobile First */
        .main {
          max-width: 768px;
          margin: 0 auto;
          padding: 24px 16px;
        }

        /* HERO - Mobile First */
        .hero { text-align: center; margin-bottom: 24px; }
        .hero h1 {
          font-size: 28px;
          font-weight: 800;
          color: #f8fafc;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
          line-height: 1.15;
        }
        .hero h1 span {
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero p {
          font-size: 15px;
          color: #94a3b8;
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* MODE TOGGLE - Mobile First */
        .toggle-container { display: flex; justify-content: center; margin-bottom: 20px; }
        .toggle {
          background: rgba(17, 24, 39, 0.8);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50px;
          padding: 4px;
          display: flex;
          gap: 4px;
        }
        .toggle-btn {
          padding: 10px 16px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.3s;
          background: transparent;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
        }
        .toggle-btn:hover { color: #e2e8f0; }
        .toggle-btn.active {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
        }
        .toggle-btn svg { stroke: currentColor; }

        /* CARD - Mobile First */
        .card {
          background: rgba(17, 24, 39, 0.6);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }

        /* UPLOAD SECTION - Mobile First */
        .upload-section { padding: 24px 16px; }
        .upload-zone {
          border: 2px dashed rgba(100, 116, 139, 0.3);
          border-radius: 16px;
          padding: 32px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          background: rgba(255,255,255,0.02);
        }
        .upload-zone:hover {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }
        .upload-zone.drag-over {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          transform: scale(1.02);
        }
        .upload-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          transition: all 0.3s;
          color: #10b981;
        }
        .upload-icon svg { width: 28px; height: 28px; stroke: currentColor; }
        .upload-zone:hover .upload-icon {
          transform: scale(1.1);
          box-shadow: 0 0 40px rgba(16, 185, 129, 0.3);
        }
        .upload-text { font-size: 18px; font-weight: 700; color: #f1f5f9; margin-bottom: 6px; }
        .upload-hint { color: #64748b; font-size: 14px; margin-bottom: 20px; }
        .upload-formats { color: #475569; font-size: 12px; margin-top: 20px; }

        /* BUTTONS - Mobile First */
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
        .btn svg { stroke: currentColor; }
        .btn-primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }
        .btn-primary:active { transform: translateY(0); }
        .btn-secondary {
          background: rgba(255,255,255,0.08);
          color: #e2e8f0;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.12);
        }
        .btn-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .btn-icon { display: flex; align-items: center; }
        .hidden-input { display: none; }

        /* RATE NOTICE - Mobile First */
        .rate-notice {
          text-align: center;
          padding: 14px;
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: 12px;
          font-size: 13px;
          color: #fbbf24;
          margin-top: 16px;
        }
        .rate-notice a { color: #fbbf24; font-weight: 600; text-decoration: underline; }

        /* ERROR BOX - Mobile First */
        .error-box {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 16px;
          padding: 32px 20px;
          text-align: center;
          margin: 20px;
        }
        .error-icon { color: #ef4444; margin-bottom: 12px; display: flex; justify-content: center; }
        .error-icon svg { stroke: currentColor; }
        .error-text { color: #ef4444; font-weight: 600; font-size: 16px; margin-bottom: 6px; }
        .error-hint { color: #94a3b8; font-size: 14px; margin-bottom: 20px; }

        /* ANALYZING STATE - Mobile First */
        .analyzing { padding: 48px 20px; text-align: center; }
        .analyzing-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #10b981;
          animation: pulse 2s infinite;
        }
        .analyzing-icon svg { stroke: currentColor; width: 32px; height: 32px; }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 25px rgba(16, 185, 129, 0); }
        }
        .analyzing-text { font-size: 18px; font-weight: 700; color: #f1f5f9; margin-bottom: 6px; }
        .analyzing-hint { color: #64748b; font-size: 14px; }
        .progress-bar {
          width: 100%;
          max-width: 240px;
          height: 5px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          margin: 24px auto 0;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399, #10b981);
          background-size: 200% 100%;
          border-radius: 3px;
          animation: loading 1.5s ease-in-out infinite;
          width: 60%;
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        /* RESULT SECTION - Mobile First */
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
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 10;
          -webkit-tap-highlight-color: transparent;
        }
        .result-share-btn:hover { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .result-share-btn svg { stroke: currentColor; }

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
          border: 2px solid rgba(16, 185, 129, 0.3);
          flex-shrink: 0;
        }
        .result-header-info { flex: 1; min-width: 0; }
        .result-item-name {
          font-size: 16px;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .result-intro-text {
          font-size: 12px;
          color: #64748b;
          font-style: italic;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .result-calories-row {
          background: rgba(16, 185, 129, 0.1);
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .result-cal-number {
          font-size: 32px;
          font-weight: 800;
          color: #10b981;
          line-height: 1;
        }
        .result-cal-unit { font-size: 14px; color: #64748b; font-weight: 400; margin-left: 2px; }
        .result-digest-badge {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #10b981;
          font-size: 11px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 20px;
        }

        /* MACROS GRID - Mobile First (2 columns) */
        .result-macros-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }
        .result-macro {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 10px 8px;
          text-align: center;
        }
        .result-macro-value { font-size: 15px; font-weight: 700; color: #10b981; }
        .result-macro-label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

        .result-verdict-box {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 16px;
        }
        .result-verdict-label {
          font-size: 10px;
          font-weight: 700;
          color: #10b981;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .result-verdict-label svg { width: 14px; height: 14px; stroke: currentColor; }
        .result-verdict-text {
          font-size: 13px;
          color: #d1fae5;
          line-height: 1.5;
        }

        .result-action-btn {
          width: 100%;
          justify-content: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #e2e8f0;
        }
        .result-action-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        /* DISCLAIMER - Mobile First */
        .disclaimer {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(17, 24, 39, 0.8);
          border-top: 1px solid rgba(255,255,255,0.05);
          font-size: 10px;
          color: #64748b;
          line-height: 1.4;
        }
        .disclaimer svg { stroke: currentColor; flex-shrink: 0; margin-top: 1px; }

        /* CTA SECTION - Mobile First */
        .cta-section {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 20px;
          padding: 32px 20px;
          text-align: center;
          margin-top: 32px;
        }
        .cta-icon {
          width: 56px;
          height: 56px;
          background: rgba(16, 185, 129, 0.15);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #10b981;
        }
        .cta-icon svg { stroke: currentColor; }
        .cta-section h2 {
          font-size: 22px;
          font-weight: 800;
          color: #f8fafc;
          margin-bottom: 10px;
          line-height: 1.2;
        }
        .cta-section > p {
          color: #94a3b8;
          margin-bottom: 24px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
          font-size: 14px;
          line-height: 1.6;
        }
        .cta-features {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
          margin-top: 20px;
          font-size: 13px;
          color: #64748b;
        }
        .cta-feature { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .cta-check { color: #10b981; display: flex; }
        .cta-check svg { stroke: currentColor; }

        /* EXAMPLES SECTION - Mobile First (single column) */
        .examples-section { margin-top: 32px; }
        .examples-title {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
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
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid rgba(255,255,255,0.05);
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
          border-color: rgba(16, 185, 129, 0.3);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }
        .example-icon {
          width: 48px;
          height: 48px;
          background: rgba(255,255,255,0.05);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .example-card:hover .example-icon {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        .example-icon svg { stroke: currentColor; }
        .example-info { text-align: left; }
        .example-label { font-weight: 600; color: #f1f5f9; margin-bottom: 2px; font-size: 14px; }
        .example-calories { color: #10b981; font-weight: 800; font-size: 18px; }

        /* FAQ SECTION - Mobile First */
        .faq-section { margin-top: 32px; }
        .faq-title {
          font-size: 22px;
          font-weight: 800;
          color: #f8fafc;
          text-align: center;
          margin-bottom: 20px;
        }
        .faq-list { display: flex; flex-direction: column; gap: 10px; }
        .faq-item {
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid rgba(255,255,255,0.05);
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
          color: #f1f5f9;
          font-family: inherit;
          transition: background 0.2s;
          gap: 12px;
          -webkit-tap-highlight-color: transparent;
        }
        .faq-question:hover { background: rgba(255,255,255,0.02); }
        .faq-arrow { color: #64748b; transition: transform 0.3s; display: flex; flex-shrink: 0; }
        .faq-arrow svg { stroke: currentColor; }
        .faq-arrow.open { transform: rotate(180deg); }
        .faq-answer {
          padding: 0 16px 18px;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.7;
        }
        .faq-answer a { color: #10b981; text-decoration: none; }
        .faq-answer a:hover { text-decoration: underline; }

        /* FOOTER - Mobile First */
        .footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
          text-align: center;
        }
        .footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #f1f5f9;
          font-weight: 600;
          text-decoration: none;
          margin-bottom: 6px;
          font-size: 14px;
        }
        .footer-brand:hover { color: #10b981; }
        .footer-logo { height: 24px; }
        .footer-tagline { color: #64748b; font-size: 12px; margin-bottom: 12px; }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 16px;
          font-size: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .footer-links a { color: #64748b; text-decoration: none; }
        .footer-links a:hover { color: #f1f5f9; }
        .footer-copyright { color: #475569; font-size: 11px; }

        /* =============================================
           TABLET BREAKPOINT (min-width: 480px)
           ============================================= */
        @media (min-width: 480px) {
          .main { padding: 32px 20px; }

          .hero { margin-bottom: 28px; }
          .hero h1 { font-size: 32px; }
          .hero p { font-size: 16px; }

          .toggle-btn { padding: 10px 20px; font-size: 14px; }

          .upload-section { padding: 32px 24px; }
          .upload-zone { padding: 40px 28px; }
          .upload-icon { width: 72px; height: 72px; }
          .upload-icon svg { width: 32px; height: 32px; }
          .upload-text { font-size: 20px; }

          .result-compact { padding: 24px; }
          .result-img { width: 68px; height: 68px; }
          .result-item-name { font-size: 18px; }
          .result-cal-number { font-size: 34px; }

          /* 4-column macros on larger phones */
          .result-macros-grid { grid-template-columns: repeat(4, 1fr); }

          .analyzing { padding: 64px 24px; }
          .analyzing-icon { width: 80px; height: 80px; }
          .analyzing-icon svg { width: 36px; height: 36px; }
          .analyzing-text { font-size: 20px; }

          .error-box { padding: 40px 28px; margin: 24px; }
          .error-text { font-size: 17px; }
        }

        /* =============================================
           SMALL TABLET BREAKPOINT (min-width: 600px)
           ============================================= */
        @media (min-width: 600px) {
          /* Examples grid becomes 3 columns */
          .examples-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
          .example-card {
            flex-direction: column;
            padding: 24px;
            gap: 12px;
          }
          .example-info { text-align: center; }
          .example-icon { width: 52px; height: 52px; margin: 0; }
          .example-label { font-size: 15px; }
          .example-calories { font-size: 20px; }

          .cta-features {
            flex-direction: row;
            gap: 24px;
          }
        }

        /* =============================================
           TABLET/DESKTOP BREAKPOINT (min-width: 768px)
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

          .toggle-container { margin-bottom: 32px; }
          .toggle-btn { padding: 12px 24px; }

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
          .btn-row { gap: 12px; }

          .result-compact { padding: 32px; }
          .result-share-btn { top: 24px; right: 24px; }
          .result-top-row { gap: 16px; margin-bottom: 20px; padding-right: 48px; }
          .result-img { width: 72px; height: 72px; border-radius: 16px; }
          .result-item-name { font-size: 20px; margin-bottom: 4px; }
          .result-intro-text { font-size: 13px; }
          .result-calories-row { padding: 16px 20px; border-radius: 14px; margin-bottom: 16px; }
          .result-cal-number { font-size: 36px; }
          .result-cal-unit { font-size: 16px; margin-left: 4px; }
          .result-digest-badge { font-size: 12px; padding: 6px 12px; }
          .result-macros-grid { margin-bottom: 16px; }
          .result-macro { padding: 12px 8px; }
          .result-macro-value { font-size: 16px; }
          .result-macro-label { font-size: 10px; }
          .result-verdict-box { padding: 14px 16px; margin-bottom: 20px; }
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
          .cta-section > p { font-size: 16px; margin-bottom: 32px; }
          .cta-features { gap: 32px; margin-top: 24px; font-size: 14px; }

          .examples-section { margin-top: 48px; }
          .examples-title { margin-bottom: 24px; }
          .example-card { border-radius: 20px; padding: 28px; }
          .example-card:hover { transform: translateY(-4px); }
          .example-icon { width: 56px; height: 56px; border-radius: 16px; }

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
           REDUCED MOTION
           ============================================= */
        @media (prefers-reduced-motion: reduce) {
          .upload-zone, .btn, .example-card, .faq-arrow { transition: none; }
          .upload-zone:hover, .example-card:hover { transform: none; }
          .btn-primary:hover { transform: none; }
          .analyzing-icon, .progress-fill { animation: none; }
        }
      </style>
      
      <div class="calories-app">
        <header class="header">
          <div class="header-inner">
            <a href="https://kygo.app" class="logo" target="_blank">
              <img src="${this.logoUrl}" alt="Kygo" class="logo-img" />
              Calories In Anything
            </a>
            <a href="https://kygo.app" class="header-link" target="_blank">
              by Kygo ${Icons.arrowRight}
            </a>
          </div>
        </header>
        
        <main class="main">
          <div class="hero">
            <h1>How many calories are in <span>anything</span>?</h1>
            <p>Upload a photo of any object — food or not — and our AI calculates its caloric content. No signup required.</p>
          </div>
          
          <div class="toggle-container">
            <div class="toggle">
              <button class="toggle-btn ${this.mode === 'anything' ? 'active' : ''}" data-mode="anything">
                ${Icons.sparkles} Anything Mode
              </button>
              <button class="toggle-btn ${this.mode === 'food' ? 'active' : ''}" data-mode="food">
                ${Icons.salad} Food Mode
              </button>
            </div>
          </div>
          
          <div class="card">
            ${this.error ? this.renderError() : 
              this.analyzing ? this.renderAnalyzing() : 
              this.result ? this.renderResult() : 
              this.renderUpload()}
            <div class="disclaimer">
              ${Icons.info}
              <span>For entertainment only. Not nutritional advice. Results are AI-generated estimates.</span>
            </div>
          </div>
          ${!this.result && !this.error && !this.analyzing && remaining <= 5 ? `
            <div class="rate-notice">
              ${Icons.zap} ${remaining} free scan${remaining !== 1 ? 's' : ''} remaining today. <a href="https://kygo.app" target="_blank">Get unlimited with Kygo →</a>
            </div>
          ` : ''}
          
          <div class="cta-section">
            <div class="cta-icon">${Icons.activity}</div>
            <h2>${this.mode === 'anything' ? 'Want to track what you actually eat?' : 'See how food affects your body'}</h2>
            <p>Kygo connects your nutrition with sleep, HRV, and recovery data from Oura, Fitbit, Garmin & Apple Watch.</p>
            <a href="https://kygo.app" class="btn btn-primary" target="_blank" style="padding: 18px 36px; font-size: 16px;">
              Try Kygo Free ${Icons.arrowRight}
            </a>
            <div class="cta-features">
              <span class="cta-feature"><span class="cta-check">${Icons.check}</span> No credit card</span>
              <span class="cta-feature"><span class="cta-check">${Icons.check}</span> Syncs with wearables</span>
            </div>
          </div>
          
          <div class="examples-section">
            <h3 class="examples-title">Popular Scans</h3>
            <div class="examples-grid">
              <div class="example-card">
                <div class="example-icon">${Icons.armchair}</div>
                <div class="example-info">
                  <div class="example-label">KALLAX Shelf</div>
                  <div class="example-calories">12,847 cal</div>
                </div>
              </div>
              <div class="example-card">
                <div class="example-icon">${Icons.footprints}</div>
                <div class="example-info">
                  <div class="example-label">Running Shoe</div>
                  <div class="example-calories">3,200 cal</div>
                </div>
              </div>
              <div class="example-card">
                <div class="example-icon">${Icons.smartphone}</div>
                <div class="example-info">
                  <div class="example-label">iPhone 15 Pro</div>
                  <div class="example-calories">847 cal</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="faq-section">
            <h2 class="faq-title">Frequently Asked Questions</h2>
            <div class="faq-list">
              ${this.renderFaqItem(0, "Do inedible objects have calories?", "Technically, yes! A calorie is just a unit of energy. Anything that can burn contains calories. A wooden chair? Thousands of calories if you set it on fire. But for humans? Zero digestible calories. We calculate both the theoretical (combustion) value and what your body could actually use.")}
              ${this.renderFaqItem(1, "How does the AI calorie scanner work?", "Our AI identifies objects in your photo, estimates their material composition and mass, then calculates caloric content based on chemical energy. For actual food, we tap into nutritional databases and use computer vision to estimate portion sizes. Science meets fun!")}
              ${this.renderFaqItem(2, "Can I use this for actual food tracking?", "Absolutely! Switch to Food Mode for real nutritional analysis. For comprehensive tracking that shows how your meals affect sleep, HRV, and recovery, check out <a href=\"https://kygo.app\" target=\"_blank\">Kygo</a> — our full app that syncs with your wearables.")}
              ${this.renderFaqItem(3, "Is this free? Do I need to sign up?", "100% free, no sign-up required. You get ${this.dailyLimit} scans per day. We built this to be genuinely useful (and entertaining) — not to harvest your email.")}
            </div>
          </div>
          
          <footer class="footer">
            <a href="https://kygo.app" class="footer-brand" target="_blank">
              <img src="${this.logoUrl}" alt="Kygo" class="footer-logo" />
              Kygo
            </a>
            <p class="footer-tagline">Nutrition tracking that connects to your body</p>
            <div class="footer-links">
              <a href="https://kygo.app" target="_blank">Kygo App</a>
              <a href="https://kygo.app/privacy" target="_blank">Privacy</a>
              <a href="https://kygo.app/terms" target="_blank">Terms</a>
            </div>
            <p class="footer-copyright">© 2025 Kygo Health LLC</p>
          </footer>
        </main>
      </div>
    `;
    
    this.attachEventListeners();
  }

  renderUpload() {
    const uploadIcon = this.mode === 'anything' ? Icons.camera : Icons.utensils;
    return `
      <div class="upload-section">
        <div class="upload-zone" id="dropZone">
          <div class="upload-icon">${uploadIcon}</div>
          <p class="upload-text">${this.mode === 'anything' ? 'Drop any object here' : 'Drop your meal here'}</p>
          <p class="upload-hint">Drag and drop or click to browse</p>
          <div class="btn-row">
            <button class="btn btn-primary" id="uploadBtn">
              <span class="btn-icon">${Icons.upload}</span> Upload Photo
            </button>
            <button class="btn btn-secondary" id="cameraBtn">
              <span class="btn-icon">${Icons.camera}</span> Take Photo
            </button>
          </div>
          <input type="file" id="fileInput" class="hidden-input" accept="image/jpeg,image/png,image/webp,image/heic">
          <input type="file" id="cameraInput" class="hidden-input" accept="image/*" capture="environment">
          <p class="upload-formats">JPG, PNG, WebP • Max ${this.maxFileSizeMB}MB</p>
        </div>
      </div>
    `;
  }

  renderAnalyzing() {
    return `
      <div class="analyzing">
        <div class="analyzing-icon">${Icons.flask}</div>
        <p class="analyzing-text">Analyzing your ${this.mode === 'anything' ? 'object' : 'meal'}...</p>
        <p class="analyzing-hint">Our AI is doing some serious science here</p>
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

  // COMPACT RESULT - fits in same card space as upload zone
  renderResult() {
    const r = this.result;
    const macroLabels = { 'Protein': 'Protein', 'Carbohydrates': 'Carbs', 'Fat': 'Fat', 'Fiber': 'Fiber' };
    
    return `
      <div class="result-compact">
        <button class="result-share-btn" id="shareBtn" title="Share result">${Icons.share}</button>
        
        <div class="result-top-row">
          ${this.uploadedImageData ? `<img src="${this.uploadedImageData}" alt="Scanned item" class="result-img" />` : ''}
          <div class="result-header-info">
            <p class="result-item-name">${r.item}</p>
            <p class="result-intro-text">${r.intro}</p>
          </div>
        </div>
        
        <div class="result-calories-row">
          <div>
            <span class="result-cal-number">${r.calories}</span>
            <span class="result-cal-unit">cal</span>
          </div>
          <span class="result-digest-badge">${r.digestibility} digestible</span>
        </div>
        
        <div class="result-macros-grid">
          ${r.breakdown.map(b => `
            <div class="result-macro">
              <div class="result-macro-value">${b.value}</div>
              <div class="result-macro-label">${macroLabels[b.nutrient] || b.nutrient}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="result-verdict-box">
          <div class="result-verdict-label">${Icons.sparkles} AI Verdict</div>
          <p class="result-verdict-text">${r.verdict}</p>
        </div>
        
        <button class="btn result-action-btn" id="resetBtn">
          <span class="btn-icon">${Icons.refresh}</span> Scan Another
        </button>
      </div>
    `;
  }

  renderFaqItem(index, question, answer) {
    const isOpen = this.openFaq === index;
    return `
      <div class="faq-item">
        <button class="faq-question" data-faq="${index}">
          ${question}
          <span class="faq-arrow ${isOpen ? 'open' : ''}">${Icons.chevronDown}</span>
        </button>
        ${isOpen ? `<div class="faq-answer">${answer}</div>` : ''}
      </div>
    `;
  }

  attachEventListeners() {
    this.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleModeChange(btn.dataset.mode));
    });
    
    const uploadBtn = this.querySelector('#uploadBtn');
    const cameraBtn = this.querySelector('#cameraBtn');
    const fileInput = this.querySelector('#fileInput');
    const cameraInput = this.querySelector('#cameraInput');
    const dropZone = this.querySelector('#dropZone');
    
    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', (e) => { e.stopPropagation(); fileInput.click(); });
      fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) { this.analyzing = true; this.render(); this.handleUpload(e.target.files[0]); }
      });
    }
    
    if (cameraBtn && cameraInput) {
      cameraBtn.addEventListener('click', (e) => { e.stopPropagation(); cameraInput.click(); });
      cameraInput.addEventListener('change', (e) => {
        if (e.target.files[0]) { this.analyzing = true; this.render(); this.handleUpload(e.target.files[0]); }
      });
    }
    
    if (dropZone) {
      dropZone.addEventListener('click', () => fileInput?.click());
      dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files[0]) { this.analyzing = true; this.render(); this.handleUpload(e.dataTransfer.files[0]); }
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
  }
}

customElements.define('calories-in-anything', CaloriesInAnything);
