/**
 * Kygo Health - Contact Section Custom Element for Wix
 * Tag name: kygo-contact-section
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

class KygoContactSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._attachEventListeners();
    this._setupScrollAnimations();
    __seo(this, 'Contact Kygo Health \u2014 Get in touch with our team for questions about nutrition tracking, wearable integration, or the Kygo app.');
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    if (this._cardObserver) this._cardObserver.disconnect();
  }

  _setupScrollAnimations() {
    requestAnimationFrame(() => {
      const elements = this.shadowRoot.querySelectorAll('.animate-on-scroll');
      if (!elements.length) return;
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this._observer.unobserve(entry.target);
          }
        });
      }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
      elements.forEach(el => this._observer.observe(el));

      // Stagger response cards
      const cards = this.shadowRoot.querySelectorAll('.response-card');
      if (cards.length) {
        const cardObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const card = entry.target;
              const index = Array.from(card.parentElement.children).indexOf(card);
              setTimeout(() => card.classList.add('visible'), index * 150);
              cardObserver.unobserve(card);
            }
          });
        }, { threshold: 0.1 });
        cards.forEach(card => cardObserver.observe(card));
        this._cardObserver = cardObserver;
      }
    });
  }

  _parseWixAttributes() {
    try {
      const wixconfig = this.getAttribute('wixconfig');
      const wixsettings = this.getAttribute('wixsettings');
      if (wixconfig) this._config = JSON.parse(wixconfig);
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {
      console.warn('KygoContactSection: Could not parse Wix attributes', e);
    }
  }

  static get observedAttributes() {
    return ['wixsettings', 'headline', 'subheadline', 'data-form-result'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    if (name === 'wixsettings') {
      this._parseWixAttributes();
      this.render();
      this._attachEventListeners();
    }

    // Handle response from Wix page code
    if (name === 'data-form-result' && newValue) {
      clearTimeout(this._submitTimeout);
      
      if (newValue === 'success') {
        this._showSuccess();
      } else if (newValue.startsWith('error:')) {
        const errorMsg = newValue.substring(6);
        const submitBtn = this.shadowRoot.querySelector('#submit-btn');
        const formError = this.shadowRoot.querySelector('#form-error');
        this._showError(submitBtn, formError, errorMsg);
      }
      
      // Clear the attribute
      this.removeAttribute('data-form-result');
    }
  }

  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }

  _attachEventListeners() {
    const form = this.shadowRoot.querySelector('#contact-form');
    if (form) {
      form.addEventListener('submit', (e) => this._handleSubmit(e));
    }

    const faqItems = this.shadowRoot.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  async _handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = this.shadowRoot.querySelector('#submit-btn');
    const formError = this.shadowRoot.querySelector('#form-error');
    
    // Basic validation
    const formData = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value,
      message: form.message.value.trim()
    };

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      this._showError(submitBtn, formError, 'Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      this._showError(submitBtn, formError, 'Please enter a valid email address.');
      return;
    }

    // Show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';
    formError.classList.remove('show');

    // Dispatch event for Wix page code
    this.dispatchEvent(new CustomEvent('contactSubmit', {
      detail: formData,
      bubbles: true,
      composed: true
    }));

    // Fallback: show success after 8 seconds if no response
    this._submitTimeout = setTimeout(() => {
      this._showSuccess();
    }, 8000);
  }

  _showSuccess() {
    const form = this.shadowRoot.querySelector('#contact-form');
    const formSuccess = this.shadowRoot.querySelector('#form-success');
    const submitBtn = this.shadowRoot.querySelector('#submit-btn');
    
    form.style.display = 'none';
    formSuccess.classList.add('show');
    submitBtn.disabled = false;
    submitBtn.innerHTML = `Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9 22 2z"/></svg>`;
  }

  _showError(submitBtn, formError, message) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9 22 2z"/></svg>`;
    formError.textContent = message;
    formError.classList.add('show');
  }

  render() {
    const headline = this._getSetting('headline', 'Get in Touch');
    const subheadline = this._getSetting('subheadline', "Have a question, feedback, or just want to say hello? We'd love to hear from you.");
    const faqUrl = this._getSetting('faq-url', '/faq');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --dark: #1E293B;
          --light: #F8FAFC;
          --green: #22C55E;
          --green-dark: #16A34A;
          --green-light: rgba(34, 197, 94, 0.1);
          --gray-50: #f9fafb;
          --gray-200: #E2E8F0;
          --gray-400: #94A3B8;
          --gray-600: #475569;
          --red: #EF4444;
          display: block;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--light);
          color: var(--dark);
          line-height: 1.6;
        }
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        h1, h2, h3, h4 { font-family: 'Space Grotesk', -apple-system, sans-serif; font-weight: 600; line-height: 1.2; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        .hero {
          padding: 60px 0 40px;
          background: linear-gradient(180deg, var(--gray-50) 0%, var(--light) 100%);
          text-align: center;
        }
        .hero h1 { font-size: clamp(32px, 8vw, 48px); margin-bottom: 16px; }
        .hero-subtitle { font-size: clamp(16px, 4vw, 18px); color: var(--gray-600); max-width: 500px; margin: 0 auto; }
        @media (min-width: 768px) { .hero { padding: 80px 0 60px; } }

        .contact-section { padding: 60px 0; }
        .contact-grid { display: grid; gap: 48px; max-width: 1000px; margin: 0 auto; }
        @media (min-width: 768px) { .contact-grid { grid-template-columns: 1fr 1.2fr; gap: 64px; } }

        .contact-info { order: 2; }
        @media (min-width: 768px) { .contact-info { order: 1; } }
        .contact-info h2 { font-size: 24px; margin-bottom: 16px; }
        .contact-info > p { color: var(--gray-600); margin-bottom: 32px; }

        .contact-methods { display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px; }
        .contact-method {
          display: flex; align-items: flex-start; gap: 16px; padding: 20px;
          background: white; border: 1px solid var(--gray-200); border-radius: 16px;
          text-decoration: none; color: var(--dark); transition: all 0.2s;
        }
        .contact-method:hover { border-color: var(--green); box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-2px); }
        .contact-method-icon {
          width: 52px; height: 52px; background: var(--green-light); border-radius: 14px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .contact-method-icon svg { width: 26px; height: 26px; color: var(--green); }
        .contact-method-text h3 { font-size: 16px; margin-bottom: 4px; }
        .contact-method-text p { color: var(--gray-600); font-size: 14px; margin-bottom: 6px; }
        .contact-method-text span { color: var(--green); font-size: 14px; font-weight: 500; }

        .quick-answers { background: var(--gray-50); border-radius: 16px; padding: 24px; }
        .quick-answers-header { font-size: 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .quick-answers-header svg { width: 20px; height: 20px; color: var(--green); }
        .faq-list { display: flex; flex-direction: column; gap: 10px; }
        .faq-item { background: white; border-radius: 10px; overflow: hidden; }
        .faq-question {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 14px 16px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s;
        }
        .faq-question:hover { color: var(--green); background: var(--green-light); }
        .faq-question svg { width: 18px; height: 18px; flex-shrink: 0; transition: transform 0.2s; color: var(--gray-400); }
        .faq-item.open .faq-question svg { transform: rotate(180deg); color: var(--green); }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
        .faq-item.open .faq-answer { max-height: 500px; }
        .faq-answer-content { padding: 0 16px 16px; font-size: 14px; color: var(--gray-600); line-height: 1.7; }
        .faq-answer-content ul { margin: 8px 0; padding-left: 20px; }
        .faq-answer-content li { margin-bottom: 4px; }
        .faq-answer-content p { margin-bottom: 8px; }
        .faq-answer-content p:last-child { margin-bottom: 0; }
        .view-all-faqs {
          display: flex; align-items: center; gap: 8px; margin-top: 12px; padding: 12px 16px;
          background: white; border-radius: 10px; text-decoration: none; font-size: 14px;
          font-weight: 500; color: var(--green); transition: all 0.2s;
        }
        .view-all-faqs:hover { background: var(--green-light); }
        .view-all-faqs svg { width: 16px; height: 16px; }

        .contact-form-container { order: 1; }
        @media (min-width: 768px) { .contact-form-container { order: 2; } }
        .contact-form { background: white; border: 1px solid var(--gray-200); border-radius: 20px; padding: 24px; }
        @media (min-width: 480px) { .contact-form { padding: 32px; } }
        .contact-form h2 { font-size: 22px; margin-bottom: 24px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-weight: 500; font-size: 14px; margin-bottom: 8px; }
        .form-group label span { color: var(--red); }
        .form-group input, .form-group select, .form-group textarea {
          width: 100%; padding: 14px 16px; border: 1px solid var(--gray-200); border-radius: 10px;
          font-size: 15px; font-family: inherit; background: var(--gray-50); transition: all 0.2s;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none; border-color: var(--green); background: white; box-shadow: 0 0 0 4px var(--green-light);
        }
        .form-group input::placeholder, .form-group textarea::placeholder { color: var(--gray-400); }
        .form-group select {
          cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center; padding-right: 44px;
        }
        .form-group textarea { min-height: 140px; resize: vertical; }
        .form-row { display: grid; gap: 16px; }
        @media (min-width: 480px) { .form-row { grid-template-columns: 1fr 1fr; } }
        .form-submit {
          width: 100%; background: var(--green); color: white; border: none; padding: 16px 28px;
          border-radius: 12px; font-size: 16px; font-weight: 600; font-family: inherit; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
        }
        .form-submit:hover:not(:disabled) { background: var(--green-dark); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(34,197,94,0.3); }
        .form-submit:disabled { background: var(--gray-400); cursor: not-allowed; }
        .form-submit svg { width: 20px; height: 20px; }
        .form-note { margin-top: 16px; font-size: 13px; color: var(--gray-400); text-align: center; }
        .error-message { color: var(--red); font-size: 14px; margin-bottom: 16px; display: none; padding: 12px; background: rgba(239,68,68,0.1); border-radius: 8px; }
        .error-message.show { display: block; }

        .form-success { display: none; text-align: center; padding: 40px 20px; }
        .form-success.show { display: block; }
        .form-success-icon {
          width: 72px; height: 72px; background: var(--green-light); border-radius: 50%;
          display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
        }
        .form-success-icon svg { width: 36px; height: 36px; color: var(--green); }
        .form-success h3 { font-size: 22px; margin-bottom: 8px; }
        .form-success p { color: var(--gray-600); font-size: 15px; }

        .response-section { padding: 60px 0; background: var(--gray-50); }
        .response-inner { max-width: 700px; margin: 0 auto; text-align: center; }
        .response-inner h2 { font-size: clamp(24px, 6vw, 28px); margin-bottom: 16px; }
        .response-inner > p { color: var(--gray-600); font-size: 16px; margin-bottom: 32px; }
        .response-cards { display: grid; gap: 16px; }
        @media (min-width: 600px) { .response-cards { grid-template-columns: repeat(3, 1fr); } }
        .response-card {
          background: white; border: 1px solid var(--gray-200); border-radius: 16px;
          padding: 24px 20px; text-align: center; transition: all 0.2s;
        }
        .response-card:hover { border-color: var(--green); box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-2px); }
        .response-card-icon {
          width: 48px; height: 48px; background: var(--green-light); border-radius: 12px;
          display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;
        }
        .response-card-icon svg { width: 24px; height: 24px; color: var(--green); }
        .response-card h3 { font-size: 15px; margin-bottom: 4px; }
        .response-card p { color: var(--gray-600); font-size: 13px; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero h1 {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .hero-subtitle {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out 0.15s forwards;
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-on-scroll.delay-1 { transition-delay: 0.1s; }
        .animate-on-scroll.delay-2 { transition-delay: 0.2s; }
        .animate-on-scroll.delay-3 { transition-delay: 0.3s; }

        /* ===== Granular Cascading Animations ===== */

        /* Override contact-info container - children cascade individually */
        .contact-info.animate-on-scroll {
          opacity: 1;
          transform: none;
          transition: none;
        }

        /* Contact info children - start hidden */
        .contact-info h2,
        .contact-info > p,
        .contact-info .contact-method,
        .contact-info .quick-answers {
          opacity: 0;
          transform: translateY(20px);
        }

        /* Contact info children - cascade on scroll */
        .contact-info.visible h2 {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .contact-info.visible > p {
          animation: fadeInUp 0.5s ease-out 0.1s forwards;
        }
        .contact-info.visible .contact-method:nth-child(1) {
          animation: fadeInUp 0.5s ease-out 0.2s forwards;
        }
        .contact-info.visible .contact-method:nth-child(2) {
          animation: fadeInUp 0.5s ease-out 0.3s forwards;
        }
        .contact-info.visible .quick-answers {
          animation: fadeInUp 0.5s ease-out 0.4s forwards;
        }

        /* Contact method icon pulse */
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .contact-info.visible .contact-method-icon {
          animation: iconPulse 2s ease-in-out 1s infinite;
        }

        /* Override contact form container - children cascade */
        .contact-form-container.animate-on-scroll {
          opacity: 1;
          transform: none;
          transition: none;
        }

        /* Form children - start hidden */
        .contact-form h2,
        .contact-form .form-row,
        .contact-form > form > .form-group,
        .contact-form .form-submit,
        .contact-form .form-note {
          opacity: 0;
          transform: translateY(15px);
        }

        /* Form children - cascade on scroll */
        .contact-form-container.visible .contact-form h2 {
          animation: fadeInUp 0.5s ease-out 0.1s forwards;
        }
        .contact-form-container.visible .contact-form .form-row {
          animation: fadeInUp 0.5s ease-out 0.2s forwards;
        }
        .contact-form-container.visible .contact-form > form > .form-group:nth-of-type(2) {
          animation: fadeInUp 0.5s ease-out 0.3s forwards;
        }
        .contact-form-container.visible .contact-form > form > .form-group:nth-of-type(3) {
          animation: fadeInUp 0.5s ease-out 0.35s forwards;
        }
        .contact-form-container.visible .contact-form > form > .form-group:nth-of-type(4) {
          animation: fadeInUp 0.5s ease-out 0.4s forwards;
        }
        .contact-form-container.visible .contact-form .form-submit {
          animation: fadeInUp 0.5s ease-out 0.5s forwards;
        }
        .contact-form-container.visible .contact-form .form-note {
          animation: fadeInUp 0.4s ease-out 0.6s forwards;
        }

        /* Override response cards - children cascade within each */
        .response-card.animate-on-scroll {
          opacity: 1;
          transform: none;
          transition: none;
        }

        .response-card .response-card-icon,
        .response-card h3,
        .response-card p {
          opacity: 0;
          transform: translateY(15px);
        }

        .response-card.visible .response-card-icon {
          animation: fadeInUp 0.4s ease-out forwards, iconPulse 2s ease-in-out 0.8s infinite;
        }
        .response-card.visible h3 {
          animation: fadeInUp 0.4s ease-out 0.1s forwards;
        }
        .response-card.visible p {
          animation: fadeInUp 0.4s ease-out 0.15s forwards;
        }

        /* Second and third response cards have existing delays via delay-1/delay-2.
           Since we overrode .animate-on-scroll on these, we need the observer
           to still trigger .visible. Add stagger via the observer instead. */

        /* CTA-like form submit button glow */
        @keyframes submitGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 15px 3px rgba(34, 197, 94, 0.15); }
        }
        .contact-form-container.visible .form-submit {
          animation: fadeInUp 0.5s ease-out 0.5s forwards, submitGlow 2.5s ease-in-out 1.2s infinite;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .contact-info h2,
          .contact-info > p,
          .contact-info .contact-method,
          .contact-info .quick-answers,
          .contact-form h2,
          .contact-form .form-row,
          .contact-form > form > .form-group,
          .contact-form .form-submit,
          .contact-form .form-note,
          .response-card .response-card-icon,
          .response-card h3,
          .response-card p {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      </style>

      <section class="hero">
        <div class="container">
          <h1>${headline}</h1>
          <p class="hero-subtitle">${subheadline}</p>
        </div>
      </section>

      <section class="contact-section">
        <div class="container">
          <div class="contact-grid">
            <div class="contact-info animate-on-scroll">
              <h2>Let's talk</h2>
              <p>Whether you have a question about features, ideas, or anything else, I'm here to chat.</p>
              <div class="contact-methods">
                <a href="mailto:support@kygo.app" class="contact-method">
                  <div class="contact-method-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <path d="M22 6l-10 7L2 6"/>
                    </svg>
                  </div>
                  <div class="contact-method-text">
                    <h3>Email</h3>
                    <p>For general inquiries and support</p>
                    <span>support@kygo.app</span>
                  </div>
                </a>
                <a href="mailto:partnerships@kygo.app" class="contact-method">
                  <div class="contact-method-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div class="contact-method-text">
                    <h3>Partnerships</h3>
                    <p>Corporate wellness & business inquiries</p>
                    <span>partnerships@kygo.app</span>
                  </div>
                </a>
              </div>
              <div class="quick-answers">
                <h3 class="quick-answers-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
                  </svg>
                  Quick answers
                </h3>
                <div class="faq-list">
                  <div class="faq-item">
                    <div class="faq-question">Is Kygo really free?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                    <div class="faq-answer"><div class="faq-answer-content"><p>Yes—there's a free tier that's free forever. It includes full food logging, all wearable connections, health trends, and macro/micronutrient tracking.</p><p>The correlation engine is premium, but you get a 14-day free trial.</p></div></div>
                  </div>
                  <div class="faq-item">
                    <div class="faq-question">How is Kygo different from MyFitnessPal?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                    <div class="faq-answer"><div class="faq-answer-content"><p>MyFitnessPal tracks calories for weight loss. Kygo shows you how food affects your sleep, HRV, energy, and recovery.</p><p>We correlate your nutrition with wearable data to find patterns unique to YOUR body.</p></div></div>
                  </div>
                  <div class="faq-item">
                    <div class="faq-question">Which wearables do you support?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                    <div class="faq-answer"><div class="faq-answer-content"><p>Oura Ring, Apple Health, Fitbit, and Garmin. Connect one or multiple..</p></div></div>
                  </div>
                </div>
                <a href="${faqUrl}" class="view-all-faqs">View all FAQs<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></a>
              </div>
            </div>
            <div class="contact-form-container animate-on-scroll delay-1">
              <div class="contact-form">
                <h2>Send a message</h2>
                <form id="contact-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label for="first-name">First name <span>*</span></label>
                      <input type="text" id="first-name" name="firstName" placeholder="John" required>
                    </div>
                    <div class="form-group">
                      <label for="last-name">Last name <span>*</span></label>
                      <input type="text" id="last-name" name="lastName" placeholder="Doe" required>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="email">Email <span>*</span></label>
                    <input type="email" id="email" name="email" placeholder="john@example.com" required>
                  </div>
                  <div class="form-group">
                    <label for="subject">What can I help with? <span>*</span></label>
                    <select id="subject" name="subject" required>
                      <option value="" disabled selected>Select a topic</option>
                      <option value="general">General question</option>
                      <option value="support">Technical support</option>
                      <option value="feedback">Product feedback</option>
                      <option value="billing">Billing & subscription</option>
                      <option value="partnership">Partnership inquiry</option>
                      <option value="press">Press & media</option>
                      <option value="other">Something else</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="message">Message <span>*</span></label>
                    <textarea id="message" name="message" placeholder="Tell me how I can help..." required></textarea>
                  </div>
                  <div class="error-message" id="form-error"></div>
                  <button type="submit" class="form-submit" id="submit-btn">
                    Send Message
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9 22 2z"/></svg>
                  </button>
                  <p class="form-note">I typically respond within 24 hours.</p>
                </form>
                <div class="form-success" id="form-success">
                  <div class="form-success-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                  </div>
                  <h3>Message sent!</h3>
                  <p>Thanks for reaching out. I'll get back to you as soon as possible.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="response-section">
        <div class="container">
          <div class="response-inner">
            <h2>What to expect</h2>
            <p>I read every message and do our best to respond quickly.</p>
            <div class="response-cards">
              <div class="response-card animate-on-scroll">
                <div class="response-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
                <h3>Response time</h3><p>Usually within 24 hours</p>
              </div>
              <div class="response-card animate-on-scroll delay-1">
                <div class="response-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <h3>Real human</h3><p>It's just me. Maybe 48 hours</p>
              </div>
              <div class="response-card animate-on-scroll delay-2">
                <div class="response-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg></div>
                <h3>Feedback</h3><p>Seriously I might add it</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('kygo-contact-section', KygoContactSection);
