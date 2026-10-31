/**
 * Kygo Health - HLTH Code partner card (shared) Custom Element
 * Tag name: kygo-hlth-card
 *
 * The HLTH Code affiliate card inside blog post copy (Wix Blog "HTML code"
 * block). One hosted file, so the design ships to every post at once:
 *
 *   <style>html,body{margin:0;background:transparent}</style>
 *   <kygo-hlth-card slug="hlth-which-foods-affect-your-sleep">
 *     <a href="https://gethlth.com/?rfsn=9131461.c81405e&utm_source=refersion&utm_medium=affiliate" target="_blank" rel="sponsored noopener">Shop HLTH Code</a>
 *   </kygo-hlth-card>
 *   <script src="https://kygo-health.github.io/kygo-elements/kygo-hlth-card.js"></script>
 *
 * Attributes:
 *   slug      GA4 label for this placement (cta_click affiliate_hlth), one per post.
 *   code      optional override of the discount code (default KYGO, 15% off first order).
 *   headline  optional copy override (default: the standard card's headline).
 *   text      optional copy override for the paragraph.
 *
 * Attribution is by the Refersion link click, so every placement uses LINK.
 * Tracking: posts {type:'kygo-cta-click', action:'affiliate_hlth', position,
 * label} and the card height to the page, the same messages the pasted card
 * sent, picked up by the "HLTH affiliate bridge" site embed.
 */

(function () {
  if (customElements.get('kygo-hlth-card')) return;

  const LINK = 'https://gethlth.com/?rfsn=9131461.c81405e&utm_source=refersion&utm_medium=affiliate';
  const IMG = 'https://static.wixstatic.com/media/273a63_88de0509547e4435a88bfb0c4c94d92b~mv2.png/v1/crop/x_0,y_390,w_780,h_810/hlth.png';
  const CODE = 'KYGO';
  const HEADLINE = 'A complete meal in a shake, not a protein powder';
  const TEXT = "One scoop is a 400-calorie meal: 27g protein, 27g healthy fats, 9g fiber and 25 vitamins and minerals, on 4g net carbs. We drink the chocolate macadamia at breakfast, the meal where most people's protein target quietly goes missing.";

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  class KygoHlthCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() { return ['slug', 'code', 'headline', 'text']; }

    connectedCallback() {
      this.render();
      this._wire();
    }

    disconnectedCallback() { if (this._ro) this._ro.disconnect(); }

    attributeChangedCallback(n, a, b) { if (a !== b && this.isConnected) this.render(); }

    get _slug() { return String(this.getAttribute('slug') || 'hlth-card').toLowerCase().replace(/[^a-z0-9\-]/g, '-').slice(0, 60); }

    _post(msg) {
      try { if (window.top && window.top !== window) window.top.postMessage(msg, '*'); } catch (e) { /* no page */ }
    }

    _wire() {
      this.shadowRoot.addEventListener('click', (ev) => {
        const path = ev.composedPath();
        if (path.some((n) => n.classList && n.classList.contains('btn'))) {
          this._post({ type: 'kygo-cta-click', action: 'affiliate_hlth', position: 'post-partner-card', label: this._slug });
        }
        const coupon = path.find((n) => n.classList && n.classList.contains('coupon'));
        if (coupon) {
          const code = this.getAttribute('code') || CODE;
          const done = () => { const t = coupon.querySelector('.c-txt'); if (t) { t.textContent = 'Copied'; setTimeout(() => { t.textContent = '15% off first order'; }, 1600); } };
          try { navigator.clipboard.writeText(code).then(done, done); } catch (e) { done(); }
        }
      }, true);
      const report = () => {
        const h = Math.ceil(this.getBoundingClientRect().bottom + (window.scrollY || 0)) + 2;
        if (h < 40) return;
        this._post({ type: 'kygo-embed-height', height: h });
        this._post({ kygo: 'embed', type: 'height', height: h });
      };
      if (typeof ResizeObserver !== 'undefined') { this._ro = new ResizeObserver(report); this._ro.observe(this); }
      window.addEventListener('load', report);
      setTimeout(report, 0);
    }

    render() {
      const code = this.getAttribute('code') || CODE;
      const headline = this.getAttribute('headline') || HEADLINE;
      const text = this.getAttribute('text') || TEXT;
      this.shadowRoot.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
          :host { display: block; padding: 24px 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: #0F172A; }
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          .hc { max-width: 680px; margin: 0 auto; background: #fff; border: 2px solid #E2E8F0; border-radius: 18px; padding: 16px; box-shadow: 0 4px 12px rgba(15,23,42,.04);
            display: grid; grid-template-columns: 96px 1fr; column-gap: 14px; row-gap: 12px;
            grid-template-areas: "shot head" "copy copy" "stats stats" "cta cta" "disc disc"; transition: border-color .2s, box-shadow .2s; }
          .hc:hover { border-color: #22C55E; box-shadow: 0 12px 32px rgba(0,0,0,.08); }
          .shot { grid-area: shot; height: 96px; border-radius: 12px; overflow: hidden; background: #DCEBE4; }
          .shot img { width: 100%; height: 100%; object-fit: cover; object-position: 32% 42%; display: block; }
          .head { grid-area: head; display: flex; flex-direction: column; gap: 7px; min-width: 0; }
          .eyebrow { display: flex; align-items: center; gap: 7px; font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: #15803D; }
          .eyebrow::before { content: ""; width: 6px; height: 6px; border-radius: 99px; background: #22C55E; }
          h3 { font-family: 'Space Grotesk', sans-serif; font-size: 17px; line-height: 1.24; font-weight: 600; letter-spacing: -.01em; }
          .copy { grid-area: copy; font-size: 13px; line-height: 1.6; color: #475569; }
          .stats { grid-area: stats; display: flex; flex-wrap: wrap; gap: 5px 10px; font-size: 12px; color: #475569; border-top: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0; padding: 9px 0; }
          .stats strong { font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 700; color: #0F172A; }
          .cta { grid-area: cta; display: flex; flex-direction: column; gap: 9px; }
          .btn { display: flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 24px; background: #22C55E; color: #fff; text-decoration: none;
            font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 700; border-radius: 12px; box-shadow: 0 6px 14px rgba(34,197,94,.28); transition: background .2s, transform .2s; }
          .btn:hover { background: #16A34A; transform: translateY(-2px); }
          .coupon { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: #fff; border: 1px dashed #22C55E; border-radius: 9px; padding: 7px 10px; cursor: pointer; font: inherit; }
          .coupon:hover { background: #F0FDF4; }
          .c-txt { font-size: 11.5px; font-weight: 600; color: #15803D; }
          .c-code { font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: .08em; }
          .disc { grid-area: disc; font-size: 10.5px; line-height: 1.5; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 10px; }
          @media (min-width: 620px) {
            .hc { grid-template-columns: 190px 1fr; column-gap: 22px; row-gap: 11px; padding: 20px; align-items: start;
              grid-template-areas: "shot head" "shot copy" "shot stats" "shot cta" "shot disc"; }
            .shot { height: auto; align-self: stretch; min-height: 280px; }
            h3 { font-size: 20px; }
            .copy { font-size: 13.5px; }
            .stats { border: 0; padding: 0; gap: 6px; }
            .stats span { background: #F1F5F9; color: #334155; padding: 5px 9px; border-radius: 6px; font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 600; }
            .stats strong { font-size: 11.5px; font-weight: 600; color: #334155; }
            .cta { flex-direction: row; align-items: stretch; gap: 12px; margin-top: 5px; }
            .btn { flex: 1 1 0; min-height: 58px; font-size: 17px; }
            .coupon { flex: 0 0 auto; width: auto; flex-direction: column; gap: 2px; border-width: 2px; border-radius: 12px; padding: 8px 18px; }
            .c-txt { font-family: 'Space Grotesk', sans-serif; font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; }
            .c-code { font-size: 22px; letter-spacing: .1em; line-height: 1.1; }
          }
        </style>
        <aside class="hc" aria-label="Partner product">
          <div class="shot"><img src="${IMG}" alt="HLTH Code Complete Meal, Chocolate Macadamia" loading="lazy"></div>
          <div class="head"><p class="eyebrow">What we use</p><h3>${esc(headline)}</h3></div>
          <p class="copy">${esc(text)}</p>
          <div class="stats"><span><strong>27g</strong> protein</span><span><strong>27g</strong> healthy fats</span><span><strong>9g</strong> fiber</span><span><strong>4g</strong> net carbs</span></div>
          <div class="cta">
            <a class="btn" href="${LINK}" target="_blank" rel="sponsored noopener noreferrer">Shop HLTH Code</a>
            ${code ? `<button class="coupon" type="button" aria-label="Copy discount code ${esc(code)}"><span class="c-txt">15% off first order</span><span class="c-code">${esc(code)}</span></button>` : ''}
          </div>
          <p class="disc">Kygo earns a commission if you buy through this link, at no extra cost to you. HLTH Code sent us the product to try.</p>
        </aside>`;
    }
  }

  customElements.define('kygo-hlth-card', KygoHlthCard);
})();
