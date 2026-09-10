/**
 * Kygo Health - Inline Subscribe (compact) Custom Element for Wix
 * Tag name: kygo-inline-subscribe
 *
 * A compact, single-row email-capture strip meant to be rendered INSIDE a tool
 * component (in its shadow DOM) after the results/answer section — roughly 50%
 * page depth, below the early app-download CTA. Native capture, no third party.
 *
 * Mechanics (identical contract to <kygo-blog-subscribe>):
 *   1. On submit it POSTs { email, source } as JSON to the same-origin Velo
 *      endpoint /_functions/subscribe and drives its own success / error / idle
 *      UI from the HTTP response (200 → success). No Wix element binding, no
 *      `state` round-trip — the tool forms are not standalone Wix elements.
 *   2. It ALSO dispatches a `subscribe` CustomEvent (bubbles + composed,
 *      detail { email, source }) so kygo-tracking.js keeps mirroring
 *      email_subscribe → GA4 (with the source param). No new GA4 event names.
 *
 * Attributes:
 *   source   - conversion source string written to CMS + GA4 (e.g.
 *              "tool-wearable-accuracy"). Default "tool".
 *   variant  - "factors" | "comparison" — selects the family pitch copy.
 *   pitch    - explicit pitch override (wins over `variant`).
 *   heading  - optional short lead-in shown bold before the pitch.
 *   success-message
 *   endpoint - override the POST url (default "/_functions/subscribe").
 */

(function () {
  'use strict';

  /** Injects accessible text into light DOM so crawlers/LLMs can read it */
  function __seo(el, text) {
    if (el.querySelector('[data-seo]')) return;
    const d = document.createElement('div');
    d.setAttribute('data-seo', '');
    d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
    d.textContent = text;
    el.appendChild(d);
  }

  const ENDPOINT = '/_functions/subscribe';

  const PITCH = {
    factors: 'Want more insights like these? Get the ranked factors and what actually moves each metric, straight to your inbox.',
    comparison: 'Want more insights like these? Get new accuracy studies and wearable breakdowns, straight to your inbox.'
  };

  const MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  const CHECK_CIRCLE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>';
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

  class KygoInlineSubscribe extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._state = 'idle';
      this._error = '';
    }

    static get observedAttributes() { return ['source', 'variant', 'pitch', 'heading', 'success-message', 'endpoint', 'state']; }

    connectedCallback() {
      this._state = this.getAttribute('state') || 'idle';
      this.render();
      __seo(this, 'Subscribe to Kygo Health — research-backed insights on sleep, HRV, and the wearables that track them, straight to your inbox.');
    }

    disconnectedCallback() {
      clearTimeout(this._submitTimeout);
    }

    attributeChangedCallback(name, oldV, newV) {
      if (oldV === newV) return;
      if (name === 'state' && newV) {
        clearTimeout(this._submitTimeout);
        this._state = newV;
        if (newV !== 'idle') this._error = '';
      }
      this.render();
    }

    _pitch() {
      const explicit = this.getAttribute('pitch');
      if (explicit) return explicit;
      const variant = (this.getAttribute('variant') || 'comparison').toLowerCase();
      return PITCH[variant] || PITCH.comparison;
    }

    _source() {
      return this.getAttribute('source') || 'tool';
    }

    render() {
      const heading = this.getAttribute('heading') || '';
      const pitch = this._pitch();
      const successMsg = this.getAttribute('success-message') || "You're in — new insights are on the way.";

      this.shadowRoot.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; min-width: 0; }
          :host {
            --dark: #1E293B;
            --light: #F8FAFC;
            --green: #22C55E;
            --green-dark: #16A34A;
            --green-light: rgba(34, 197, 94, 0.10);
            --gray-200: #E2E8F0;
            --gray-400: #94A3B8;
            --gray-600: #475569;
            display: block;
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: var(--dark);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
          }
          .wrap { max-width: 1000px; margin: 0 auto; padding: 28px 20px; }
          @media (min-width: 768px) { .wrap { padding: 36px 24px; } }

          .band {
            background: linear-gradient(135deg, var(--green-light) 0%, rgba(34,197,94,0.04) 100%);
            border: 1.5px solid rgba(34,197,94,0.3);
            border-radius: 16px;
            padding: 20px;
          }
          @media (min-width: 768px) { .band { padding: 22px 26px; } }

          .row {
            display: flex; flex-direction: column;
            gap: 14px;
            align-items: stretch;
          }
          @media (min-width: 860px) {
            .row { flex-direction: row; align-items: center; gap: 20px; }
          }

          .pitch {
            display: flex; align-items: flex-start; gap: 10px;
            flex: 1 1 auto; min-width: 0;
          }
          .pitch .ic {
            flex: 0 0 auto;
            width: 34px; height: 34px; border-radius: 9px;
            background: var(--green); color: #fff;
            display: flex; align-items: center; justify-content: center;
          }
          .pitch .ic svg { width: 18px; height: 18px; }
          .pitch p { font-size: 14.5px; line-height: 1.45; color: var(--dark); }
          .pitch p strong { display: block; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15.5px; }
          @media (min-width: 768px) { .pitch p { font-size: 15px; } }

          form {
            display: flex; flex-direction: column; gap: 8px;
            flex: 0 0 auto; width: 100%;
          }
          @media (min-width: 520px) { form { flex-direction: row; } }
          @media (min-width: 860px) { form { width: auto; min-width: 380px; } }

          input {
            flex: 1 1 auto; min-width: 0; width: 100%;
            border: 1.5px solid var(--gray-200);
            outline: none;
            background: #fff;
            border-radius: 10px;
            padding: 13px 14px;
            font-family: inherit; font-size: 15px;
            color: var(--dark);
            transition: border-color 180ms ease, box-shadow 180ms ease;
          }
          input::placeholder { color: var(--gray-400); }
          input:focus { border-color: var(--green); box-shadow: 0 0 0 3px var(--green-light); }

          button {
            flex: 0 0 auto; width: 100%;
            border: 0; cursor: pointer;
            min-height: 48px;
            padding: 0 22px;
            border-radius: 10px;
            background: var(--green);
            color: #fff;
            font-family: inherit; font-weight: 600; font-size: 15px;
            display: inline-flex; align-items: center; justify-content: center; gap: 6px;
            transition: background 180ms ease, box-shadow 180ms ease, transform 120ms ease;
            white-space: nowrap;
            -webkit-tap-highlight-color: transparent;
          }
          @media (min-width: 520px) { button { width: auto; } }
          button:hover { background: var(--green-dark); box-shadow: 0 8px 20px rgba(34,197,94,0.28); }
          button:active { transform: translateY(1px); }
          button[disabled] { opacity: 0.6; cursor: not-allowed; }
          button svg { width: 14px; height: 14px; }

          .trust {
            display: flex; gap: 8px 14px; flex-wrap: wrap;
            margin-top: 14px;
            font-size: 12px; color: var(--gray-600);
          }
          .trust span { display: inline-flex; align-items: center; gap: 5px; }
          .trust svg { width: 12px; height: 12px; color: var(--green); }

          .error { margin-top: 10px; font-size: 13px; color: #DC2626; }

          .success {
            display: flex; align-items: center; gap: 12px;
            color: var(--dark); font-weight: 500;
          }
          .success .ic {
            flex: 0 0 auto;
            width: 40px; height: 40px; border-radius: 10px;
            background: var(--green); color: #fff;
            display: flex; align-items: center; justify-content: center;
          }
          .success .ic svg { width: 22px; height: 22px; }
          .success .title { font-size: 15px; }
        </style>
        <section class="wrap" aria-label="Subscribe for more insights">
          <div class="band">
            ${this._state === 'success' ? `
              <div class="success" role="status" aria-live="polite">
                <span class="ic">${CHECK_CIRCLE}</span>
                <span class="title">${successMsg}</span>
              </div>
            ` : `
              <div class="row">
                <div class="pitch">
                  <span class="ic">${MAIL}</span>
                  <p>${heading ? `<strong>${heading}</strong>` : ''}${pitch}</p>
                </div>
                <form novalidate data-form>
                  <input type="email" required placeholder="you@email.com"
                         aria-label="Email address" autocomplete="email"
                         ${this._state === 'loading' ? 'disabled' : ''} />
                  <button type="submit" ${this._state === 'loading' ? 'disabled' : ''}>
                    ${this._state === 'loading' ? 'Subscribing…' : `Subscribe ${ARROW}`}
                  </button>
                </form>
              </div>
              ${this._error ? `<div class="error">${this._error}</div>` : ''}
              <div class="trust">
                <span>${CHECK} No spam</span>
                <span>${CHECK} Unsubscribe anytime</span>
                <span>${CHECK} Research-backed only</span>
              </div>
            `}
          </div>
        </section>
      `;

      const form = this.shadowRoot.querySelector('[data-form]');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = form.querySelector('input').value.trim();
          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this._error = 'Please enter a valid email.';
            this.render();
            return;
          }
          this._subscribe(email);
        });
      }
    }

    _subscribe(email) {
      const source = this._source();
      const endpoint = this.getAttribute('endpoint') || ENDPOINT;
      this._error = '';
      this._state = 'loading';
      this.render();

      // Safety timeout — if the network hangs, surface a real error instead of
      // spinning forever. Cleared as soon as the fetch settles.
      clearTimeout(this._submitTimeout);
      this._submitTimeout = setTimeout(() => {
        if (this._state === 'loading') {
          this._state = 'idle';
          this._error = "Hmm — that didn't go through. Please try again, or email support@kygo.app.";
          this.render();
        }
      }, 10000);

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
      })
        .then((res) => {
          clearTimeout(this._submitTimeout);
          if (res && res.ok) {
            this._state = 'success';
            this._error = '';
            this.render();
            // Mirror to GA4 (email_subscribe) only on a confirmed subscribe.
            // detail is plain-data only; bubbles + composed so it reaches
            // document through the host tool's shadow boundary.
            this.dispatchEvent(new CustomEvent('subscribe', {
              bubbles: true, composed: true,
              detail: { email, source }
            }));
          } else {
            this._state = 'idle';
            this._error = "Hmm — that didn't go through. Please try again, or email support@kygo.app.";
            this.render();
          }
        })
        .catch(() => {
          clearTimeout(this._submitTimeout);
          this._state = 'idle';
          this._error = "Hmm — that didn't go through. Please try again, or email support@kygo.app.";
          this.render();
        });
    }
  }

  if (!customElements.get('kygo-inline-subscribe')) {
    customElements.define('kygo-inline-subscribe', KygoInlineSubscribe);
  }
})();
