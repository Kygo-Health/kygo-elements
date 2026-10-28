/**
 * Kygo Health - Blog app card (shared) Custom Element
 * Tag name: kygo-app-card
 *
 * The app download card that sits inside blog post copy, in a Wix Blog
 * "HTML code" block. One hosted file, so a design change ships to every post
 * at once; each post's block only carries its own words and labels:
 *
 *   <style>html,body{margin:0;background:transparent}</style>
 *   <kygo-app-card post="how-accurate-is-your-heart-rate-monitor" position="mid"
 *     slug="hr-monitor-mid" focus="hrv" variant="v1"
 *     headline="Separate real patterns from noise."
 *     sub="Kygo matches your heart rate, HRV and sleep to what you actually ate.">
 *     <a href="https://www.kygo.app" target="_top">Get the Kygo app</a>
 *   </kygo-app-card>
 *   <script src="https://kygo-health.github.io/kygo-elements/kygo-app-card.js"></script>
 *
 * Attributes:
 *   post      the blog post's URL slug. Goes to Tenjin as site_id, so installs
 *             can be read per post (Tenjin reporting group_by=site).
 *   position  mid | end (where the card sits in the post).
 *   slug      unique per placement, max 30 chars. The GA4 cta_label (and the
 *             cta_view label). Keep it short: <post-short>-<position>.
 *   variant   design/copy variant id, default "v1". Goes to GA4 as cta_content
 *             and to Tenjin as part of creative_name (<variant>-<position>), so
 *             designs can be compared once more than one exists.
 *   focus     which insight the phone mockup shows, matched to the page's
 *             topic: hrv (default), deep, rem, latency, awake, rhr, sleep, food,
 *             supplement, training, steps, nutrition, readiness, stress. See VISUALS below.
 *   headline  the post's own hook. Never reused across posts.
 *   sub       one sentence under the headline.
 *   surface   blog (default) | tool. Goes to GA4 as the click position and to
 *             the web link's utm_medium.
 *   web       boolean. Adds an "Or start on the web" link under the store
 *             buttons (tool pages, where all three platforms stay on screen).
 *
 * On a tool page the card is not in an iframe: there are no messages to post,
 * and kygo-tracking.js reads the clicks straight from the page (it treats this
 * element like <kygo-cta>: cta_label = slug, cta_content = variant).
 *
 * The light-DOM <a> inside the element is a fallback: it shows only if this
 * file fails to load, so a post never shows an empty box.
 *
 * Tracking (the block is a sandboxed iframe, so the page's GA4 listener cannot
 * see inside it). This file posts to the top window, where kygo-tracking.js
 * files them:
 *   {kygo:'embed', type:'click', destination, slug, content, url} -> GA4 cta_click
 *       (ios_download / android_download, cta_label = slug, cta_content = variant,
 *       page_path = the post)
 *   {kygo:'embed', type:'view', slug, content}  -> GA4 cta_view, once per card
 *   {kygo:'embed', type:'height', height}       -> the page sizes the iframe
 * The store buttons use the standard Tenjin links owned by kygo-cta.js (loaded first)
 * Website-channel links with site_id and creative_name appended.
 */

(function () {
  if (customElements.get('kygo-app-card')) return;

  const CTA_SRC = 'https://kygo-health.github.io/kygo-elements/kygo-cta.js';

  /** Loads the shared <kygo-cta> element once and resolves when it is defined. */
  function ensureKygoCta() {
    if (customElements.get('kygo-cta')) return Promise.resolve();
    if (!document.querySelector('script[data-kygo-cta-loader]')) {
      const s = document.createElement('script');
      s.src = CTA_SRC;
      s.setAttribute('data-kygo-cta-loader', '');
      document.head.appendChild(s);
    }
    return customElements.whenDefined('kygo-cta');
  }

  /** Keeps a label to the characters kygo-tracking.js accepts. */
  function clean(v, max) {
    return String(v == null ? '' : v).toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, max);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /** The phone mockup: the app's metric screen (Helping / Hurting tabs and
   *  factor cards), one per focus so each page shows an insight on its own
   *  topic. Sample data in the app's own phrasing, pointing the same way as the
   *  research on the page that uses it. Each card: name, delta pill, the
   *  sentence (cond, change, when), the two compared groups as [label, value,
   *  bar width %] (base first), and the evidence line. */
  const VISUALS = {
    hrv: {
      metric: 'HRV', tab: 'hurting', counts: [4, 6],
      cards: [
        { name: 'Caffeine after 2 PM', delta: '−8', unit: 'ms', cond: 'go over <b>95 mg</b> after 2 PM', change: '−8 ms lower', when: 'the next day',
          rows: [['Under 95mg', '52 ms', 82], ['Over 95mg', '44 ms', 58]], ev: '41 days · r −0.61' },
        { name: 'Alcohol', delta: '−6', unit: 'ms', cond: 'go over <b>31.2 g</b>', change: '−6 ms lower', when: 'the next day',
          rows: [['Under 31.2g', '51 ms', 80], ['Over 31.2g', '45 ms', 60]], ev: '44 days · r −0.52' }
      ]
    },
    deep: {
      metric: 'Deep Sleep', tab: 'hurting', counts: [3, 7],
      cards: [
        { name: 'Caffeine after 2 PM', delta: '−18', unit: 'min', cond: 'have caffeine <b>after 2 PM</b>', change: '−18 min lower', when: 'that night',
          rows: [['Before 2 PM', '72 min', 82], ['After 2 PM', '54 min', 58]], ev: '42 days · r −0.58' },
        { name: 'Alcohol', delta: '−11', unit: 'min', cond: 'go over <b>31.2 g</b>', change: '−11 min lower', when: 'that night',
          rows: [['Under 31.2g', '70 min', 80], ['Over 31.2g', '59 min', 62]], ev: '44 days · r −0.47' }
      ]
    },
    rem: {
      metric: 'REM Sleep', tab: 'hurting', counts: [3, 8],
      cards: [
        { name: 'Alcohol', delta: '−20', unit: 'min', cond: 'go over <b>31.2 g</b>', change: '−20 min lower', when: 'that night',
          rows: [['Under 31.2g', '96 min', 84], ['Over 31.2g', '76 min', 60]], ev: '44 days · r −0.76' },
        { name: 'Last meal timing', delta: '−9', unit: 'min', cond: 'eat within <b>2 hours</b> of bed', change: '−9 min lower', when: 'that night',
          rows: [['Earlier', '93 min', 82], ['Within 2h', '84 min', 66]], ev: '44 days · r −0.42' }
      ]
    },
    latency: {
      metric: 'Sleep Latency', tab: 'hurting', counts: [2, 6],
      cards: [
        { name: 'Caffeine after 2 PM', delta: '+11', unit: 'min', cond: 'have caffeine <b>after 2 PM</b>', change: '+11 min longer', when: 'to fall asleep',
          rows: [['Before 2 PM', '14 min', 46], ['After 2 PM', '25 min', 82]], ev: '42 days · r 0.55' },
        { name: 'Last meal timing', delta: '+6', unit: 'min', cond: 'eat within <b>2 hours</b> of bed', change: '+6 min longer', when: 'to fall asleep',
          rows: [['Earlier', '15 min', 50], ['Within 2h', '21 min', 70]], ev: '44 days · r 0.39' }
      ]
    },
    awake: {
      metric: 'Awake Time', tab: 'hurting', counts: [2, 7],
      cards: [
        { name: 'Alcohol', delta: '+18', unit: 'min', cond: 'go over <b>31.2 g</b>', change: '+18 min more awake', when: 'that night',
          rows: [['Under 31.2g', '24 min', 44], ['Over 31.2g', '42 min', 80]], ev: '44 days · r 0.63' },
        { name: 'Caffeine after 2 PM', delta: '+9', unit: 'min', cond: 'have caffeine <b>after 2 PM</b>', change: '+9 min more awake', when: 'that night',
          rows: [['Before 2 PM', '26 min', 48], ['After 2 PM', '35 min', 66]], ev: '42 days · r 0.41' }
      ]
    },
    rhr: {
      metric: 'Resting HR', tab: 'hurting', counts: [3, 6],
      cards: [
        { name: 'Alcohol', delta: '+4', unit: 'bpm', cond: 'go over <b>31.2 g</b>', change: '+4 bpm higher', when: 'the next day',
          rows: [['Under 31.2g', '54 bpm', 62], ['Over 31.2g', '58 bpm', 80]], ev: '44 days · r 0.68' },
        { name: 'Last meal timing', delta: '+2', unit: 'bpm', cond: 'eat within <b>2 hours</b> of bed', change: '+2 bpm higher', when: 'that night',
          rows: [['Earlier', '55 bpm', 66], ['Within 2h', '57 bpm', 76]], ev: '44 days · r 0.40' }
      ]
    },
    sleep: {
      metric: 'Sleep Score', tab: 'hurting', counts: [3, 8],
      cards: [
        { name: 'Alcohol', delta: '−12', unit: 'pts', cond: 'go over <b>31.2 g</b>', change: '−12 pts lower', when: 'the next day',
          rows: [['Under 31.2g', '81 pts', 82], ['Over 31.2g', '69 pts', 52]], ev: '44 days · r −0.76' },
        { name: 'Last meal timing', delta: '−8', unit: 'pts', cond: 'eat within <b>2 hours</b> of bed', change: '−8 pts lower', when: 'the next day',
          rows: [['Earlier', '82 pts', 82], ['Within 2h', '74 pts', 60]], ev: '44 days · r −0.42' }
      ]
    },
    food: {
      metric: 'Sleep Score', tab: 'hurting', counts: [4, 8],
      cards: [
        { name: 'Last meal timing', delta: '−8', unit: 'pts', cond: 'eat within <b>2 hours</b> of bed', change: '−8 pts lower', when: 'the next day',
          rows: [['Earlier', '82 pts', 82], ['Within 2h', '74 pts', 60]], ev: '44 days · r −0.42' },
        { name: 'Added sugar', delta: '−5', unit: 'pts', cond: 'go over <b>50 g</b>', change: '−5 pts lower', when: 'the next day',
          rows: [['Under 50g', '80 pts', 80], ['Over 50g', '75 pts', 64]], ev: '43 days · r −0.36' }
      ]
    },
    supplement: {
      metric: 'Sleep Score', tab: 'helping', counts: [3, 8],
      cards: [
        { name: 'Magnesium Glycinate', delta: '+9', unit: 'pts', cond: 'take <b>Magnesium Glycinate</b>', change: '+9 pts higher', when: 'the next day',
          rows: [['Not taken', '71 pts', 52], ['Taken', '80 pts', 82]], ev: '43 days · r 0.56' },
        { name: 'Strength training', delta: '+6', unit: 'pts', cond: 'lift <b>53+ min</b>', change: '+6 pts higher', when: 'that day',
          rows: [['Under 53min', '76 pts', 60], ['Over 53min', '82 pts', 82]], ev: '45 days · r 0.48' }
      ]
    },
    training: {
      metric: 'Sleep Score', tab: 'helping', counts: [3, 8],
      cards: [
        { name: 'Strength training', delta: '+6', unit: 'pts', cond: 'lift <b>53+ min</b>', change: '+6 pts higher', when: 'that day',
          rows: [['Under 53min', '76 pts', 60], ['Over 53min', '82 pts', 82]], ev: '45 days · r 0.48' },
        { name: 'Protein', delta: '+4', unit: 'pts', cond: 'eat <b>120 g+</b> protein', change: '+4 pts higher', when: 'the next day',
          rows: [['Under 120g', '75 pts', 62], ['Over 120g', '79 pts', 76]], ev: '44 days · r 0.37' }
      ]
    },
    readiness: {
      metric: 'Readiness', tab: 'hurting', counts: [4, 7],
      cards: [
        { name: 'Alcohol', delta: '−9', unit: 'pts', cond: 'go over <b>31.2 g</b>', change: '−9 pts lower', when: 'the next day',
          rows: [['Under 31.2g', '82 pts', 82], ['Over 31.2g', '73 pts', 58]], ev: '44 days · r −0.64' },
        { name: 'Last meal timing', delta: '−5', unit: 'pts', cond: 'eat within <b>2 hours</b> of bed', change: '−5 pts lower', when: 'the next day',
          rows: [['Earlier', '81 pts', 80], ['Within 2h', '76 pts', 64]], ev: '44 days · r −0.38' }
      ]
    },
    steps: {
      metric: 'Sleep Score', tab: 'helping', counts: [4, 7],
      cards: [
        { name: 'Daily steps', delta: '+5', unit: 'pts', cond: 'walk <b>9,000+ steps</b>', change: '+5 pts higher', when: 'that night',
          rows: [['Under 9,000', '75 pts', 62], ['Over 9,000', '80 pts', 80]], ev: '45 days · r 0.44' },
        { name: 'Strength training', delta: '+6', unit: 'pts', cond: 'lift <b>53+ min</b>', change: '+6 pts higher', when: 'that day',
          rows: [['Under 53min', '76 pts', 60], ['Over 53min', '82 pts', 82]], ev: '45 days · r 0.48' }
      ]
    },
    nutrition: {
      metric: 'Readiness', tab: 'helping', counts: [4, 7],
      cards: [
        { name: 'Protein', delta: '+5', unit: 'pts', cond: 'eat <b>120 g+</b> protein', change: '+5 pts higher', when: 'the next day',
          rows: [['Under 120g', '76 pts', 62], ['Over 120g', '81 pts', 80]], ev: '44 days · r 0.41' },
        { name: 'Water', delta: '+3', unit: 'pts', cond: 'drink <b>2.5 L+</b>', change: '+3 pts higher', when: 'the next day',
          rows: [['Under 2.5L', '77 pts', 66], ['Over 2.5L', '80 pts', 76]], ev: '42 days · r 0.33' }
      ]
    },
    stress: {
      metric: 'Stress', tab: 'hurting', counts: [3, 6],
      cards: [
        { name: 'Alcohol', delta: '+9', unit: 'pts', cond: 'go over <b>31.2 g</b>', change: '+9 pts higher', when: 'the next day',
          rows: [['Under 31.2g', '32 pts', 50], ['Over 31.2g', '41 pts', 74]], ev: '44 days · r 0.59' },
        { name: 'Caffeine', delta: '+6', unit: 'pts', cond: 'go over <b>300 mg</b>', change: '+6 pts higher', when: 'that day',
          rows: [['Under 300mg', '33 pts', 52], ['Over 300mg', '39 pts', 68]], ev: '41 days · r 0.44' }
      ]
    }
  };

  const APPLE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 12.5c-.02-2.1 1.71-3.11 1.79-3.16-.98-1.43-2.5-1.62-3.03-1.64-1.29-.13-2.52.76-3.17.76-.65 0-1.66-.74-2.73-.72-1.4.02-2.7.82-3.42 2.07-1.46 2.54-.37 6.3 1.05 8.36.7 1.01 1.53 2.14 2.62 2.1 1.05-.04 1.45-.68 2.72-.68 1.27 0 1.63.68 2.74.66 1.13-.02 1.85-1.03 2.54-2.04.8-1.17 1.13-2.3 1.15-2.36-.03-.01-2.2-.84-2.22-3.35zM15.02 5.9c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.53.62-1 1.61-.88 2.56.93.07 1.88-.47 2.46-1.16z"/></svg>';
  const ANDROID = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 9v7a1 1 0 001 1h1v3a1 1 0 002 0v-3h4v3a1 1 0 002 0v-3h1a1 1 0 001-1V9H6zM4.5 9A1.5 1.5 0 003 10.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 004.5 9zm15 0a1.5 1.5 0 00-1.5 1.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 0019.5 9zM15.5 4.2l1-1.4a.3.3 0 00-.5-.35l-1.1 1.53a5.9 5.9 0 00-3.8 0L9.99 2.45a.3.3 0 00-.5.35l1 1.4A5.28 5.28 0 006 8.2h12a5.28 5.28 0 00-2.5-4zM9.5 6.4a.6.6 0 110-1.2.6.6 0 010 1.2zm5 0a.6.6 0 110-1.2.6.6 0 010 1.2z"/></svg>';

  /** One real App Store review, shown under the buttons on wider cards. */
  const REVIEW = 'Strikes the balance of seamlessness and data analytics perfectly.';

    class KygoAppCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._settings = {};
      this._onClick = this._onClick.bind(this);
    }

    static get observedAttributes() { return ['wixsettings', 'post', 'position', 'slug', 'variant', 'focus', 'headline', 'sub', 'surface', 'web']; }

    connectedCallback() {
      this._parseWixAttributes();
      this.render();
      this.shadowRoot.addEventListener('click', this._onClick, true);
      this._watchHeight();
      this._watchView();
      ensureKygoCta().then(() => this._wireStoreLinks());
    }

    disconnectedCallback() {
      this.shadowRoot.removeEventListener('click', this._onClick, true);
      if (this._ro) this._ro.disconnect();
      if (this._io) this._io.disconnect();
    }

    attributeChangedCallback(name, oldV, newV) {
      if (oldV === newV || !this.isConnected) return;
      if (name === 'wixsettings') this._parseWixAttributes();
      this.render();
      if (customElements.get('kygo-cta')) this._wireStoreLinks();
    }

    _parseWixAttributes() {
      try {
        const s = this.getAttribute('wixsettings');
        if (s) this._settings = JSON.parse(s);
      } catch (e) {
        console.warn('KygoAppCard: Could not parse Wix attributes', e);
      }
    }

    _getSetting(key, fallback) { return this._settings[key] || this.getAttribute(key) || fallback; }

    get _post() { return clean(this._getSetting('post', 'unknown'), 100) || 'unknown'; }
    get _position() { return clean(this._getSetting('position', 'mid'), 10) || 'mid'; }
    get _slug() { return clean(this._getSetting('slug', this._post.slice(0, 25) + '-' + this._position), 30); }
    get _variant() { return clean(this._getSetting('variant', 'v1'), 20) || 'v1'; }
    get _surface() { return clean(this._getSetting('surface', 'blog'), 10) || 'blog'; }

    /* ── Tracking ─────────────────────────────────────────────────────── */

    _top() { return window.top && window.top !== window ? window.top : null; }

    _send(msg) {
      const top = this._top();
      if (!top) return;
      msg.kygo = 'embed';
      try { top.postMessage(msg, '*'); } catch (e) { /* no page to report to */ }
    }

    /** ios | android | desktop, the same test kygo-cta.js uses. */
    _platform() {
      try {
        const ua = navigator.userAgent || '';
        if (/iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
        if (/Android/i.test(ua)) return 'android';
      } catch (e) { /* desktop */ }
      return 'desktop';
    }

    /** Store buttons. The Tenjin Website-channel links are owned by kygo-cta.js
     *  (loaded first, read here as TENJIN_IOS / TENJIN_ANDROID); this adds the
     *  post as site_id and variant-position as creative_name, so installs read
     *  per post and per design in Tenjin. A phone gets its own store alone,
     *  desktop gets iPhone filled plus Android. */
    _wireStoreLinks() {
      const box = this.shadowRoot.querySelector('.btns');
      if (!box || typeof TENJIN_IOS === 'undefined' || typeof TENJIN_ANDROID === 'undefined') return;
      const q = '?site_id=' + encodeURIComponent(this._post) +
        '&creative_name=' + encodeURIComponent('app-card-' + this._variant + '-' + this._position);
      const ios = (cls) => `<a class="btn ${cls}" href="${esc(TENJIN_IOS + q)}" data-destination="ios" target="_blank" rel="noopener" aria-label="Start your free trial on the App Store">${APPLE}<span>${cls === 'primary' ? 'Start your free trial' : 'iPhone'}</span></a>`;
      const android = (cls) => `<a class="btn ${cls}" href="${esc(TENJIN_ANDROID + q)}" data-destination="android" target="_blank" rel="noopener" aria-label="Start your free trial on Google Play">${ANDROID}<span>${cls === 'primary' ? 'Start your free trial' : 'Android'}</span></a>`;
      const pf = this._platform();
      box.classList.toggle('solo', pf !== 'desktop');
      box.innerHTML = pf === 'ios' ? ios('primary') : pf === 'android' ? android('primary') : ios('primary') + android('secondary');
    }

    _onClick(e) {
      const path = e.composedPath ? e.composedPath() : [e.target];
      const link = path.filter((n) => n && n.tagName === 'A' && n.getAttribute && n.getAttribute('data-destination'))[0];
      if (!link) return;
      this._send({ type: 'click', destination: link.getAttribute('data-destination'), slug: this._slug, content: this._variant, url: link.href });
    }

    _watchView() {
      if (typeof IntersectionObserver === 'undefined') return;
      this._io = new IntersectionObserver((entries) => {
        if (!entries.some((x) => x.isIntersecting)) return;
        this._io.disconnect();
        this._send({ type: 'view', slug: this._slug, content: this._variant });
      }, { threshold: 0.5 });
      this._io.observe(this);
    }

    _watchHeight() {
      const report = () => {
        const h = Math.ceil(this.getBoundingClientRect().bottom + (window.scrollY || 0)) + 2;
        if (h < 40) return;
        this._send({ type: 'height', height: h });
        const top = this._top();
        // The HLTH bridge on the page listens for this older shape as well.
        if (top) { try { top.postMessage({ type: 'kygo-embed-height', height: h }, '*'); } catch (e) { /* ignore */ } }
      };
      if (typeof ResizeObserver !== 'undefined') {
        this._ro = new ResizeObserver(report);
        this._ro.observe(this);
      }
      window.addEventListener('load', report);
      setTimeout(report, 0);
    }

    /* ── Render ───────────────────────────────────────────────────────── */

    _phone() {
      const v = VISUALS[clean(this._getSetting('focus', 'hrv'), 12)] || VISUALS.hrv;
      const neg = v.tab === 'hurting';
      const card = (c, i) => `
              <div class="p-card">
                <div class="p-ct"><span class="p-name">${esc(c.name)}</span><span class="p-pill ${neg ? 'neg' : 'pos'}">${esc(c.delta)}<small>${esc(c.unit)}</small></span></div>
                <p class="p-txt">Days you ${c.cond}, your ${esc(v.metric)} runs <b class="${neg ? 'neg' : 'pos'}">${esc(c.change)}</b> ${esc(c.when)}.</p>
                <div class="p-cmp">${c.rows.map((r, j) => `
                  <div class="p-row"><span class="p-lbl">${esc(r[0])}</span><span class="p-track"><span class="${j ? (neg ? 'neg' : 'pos') : 'base'}" style="width:${Number(r[2])}%"></span></span><span class="p-val">${esc(r[1])}</span></div>`).join('')}
                </div>
                <div class="p-ev"><span class="p-rank">#${i + 1}</span><b>Strong evidence</b><span> · ${esc(c.ev)}</span></div>
              </div>`;
      return `
        <div class="phone" aria-hidden="true"><div class="screen">
          <div class="island"></div>
          <div class="status"><span>9:41</span><span class="sig"><i></i><i></i><i></i><i></i><span class="batt"></span></span></div>
          <div class="p-nav"><span class="p-back"></span><span class="p-title">${esc(v.metric)}</span><span class="p-day">Day 45</span></div>
          <div class="p-tabs"><span class="${neg ? '' : 'on pos'}">Helping <em>${v.counts[0]}</em></span><span class="${neg ? 'on neg' : ''}">Hurting <em>${v.counts[1]}</em></span></div>
          <div class="p-body">
            <p class="p-src">Data from Oura · Apple Health · Garmin</p>${v.cards.map(card).join('')}
          </div>
          <div class="p-bar"><span>Today</span><span>Food</span><span class="p-plus">+</span><span>Trends</span><span class="on">Correlation</span></div>
        </div></div>`;
    }

    render() {
      const headline = this._getSetting('headline', 'See what your food does to your sleep and HRV.');
      const sub = this._getSetting('sub', 'Kygo matches what you eat to the data your wearable already collects.');
      this.shadowRoot.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
          :host { display: block; padding: 24px 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: #0F172A; line-height: 1.5; }
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          .card { position: relative; overflow: hidden; border-radius: 18px; padding: 22px 20px 0; color: #fff;
            background: radial-gradient(300px 200px at 100% 100%, rgba(34,197,94,.22), transparent 70%), #0F172A; }
          .kicker { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #6EE7A0; margin-bottom: 8px; }
          .title { font-family: 'Space Grotesk', sans-serif; font-size: 22px; line-height: 1.2; font-weight: 700; letter-spacing: -.01em; color: #fff; margin-bottom: 6px; }
          .sub { font-size: 14px; line-height: 1.45; color: rgba(255,255,255,.72); }
          .btns { margin-top: 16px; display: flex; gap: 10px; min-height: 48px; }
          .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 0 18px; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; white-space: nowrap; transition: background .2s, border-color .2s; }
          .btn svg { width: 16px; height: 16px; flex: none; }
          .btn.primary { background: #22C55E; color: #0F172A; }
          .btn.primary:hover { background: #4ADE80; }
          .btn.secondary { color: #fff; border: 1px solid rgba(255,255,255,.22); font-weight: 600; }
          .btn.secondary:hover { border-color: #22C55E; }
          .btns.solo .btn { flex: 1; }
          .review { display: none; }
          .web { margin-top: 10px; font-size: 13px; color: rgba(255,255,255,.6); }
          .web a { color: #fff; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
          .web a:hover { color: #6EE7A0; }

          .phone { position: relative; width: 236px; height: 400px; margin: 20px auto -210px; padding: 7px; border-radius: 40px;
            background: linear-gradient(160deg, #334155, #0B1220); box-shadow: 0 0 0 1px rgba(255,255,255,.10), 0 40px 70px -24px rgba(0,0,0,.75); }
          .screen { position: relative; height: 100%; border-radius: 33px; background: #F4F6F9; overflow: hidden; color: #0F172A; }
          .island { position: absolute; top: 8px; left: 50%; margin-left: -38px; width: 76px; height: 22px; border-radius: 12px; background: #0B1220; z-index: 2; }
          .status { display: flex; justify-content: space-between; align-items: center; padding: 11px 20px 0; height: 30px; font-size: 11px; font-weight: 700; background: #fff; }
          .sig { display: inline-flex; align-items: flex-end; gap: 1.5px; }
          .sig i { display: block; width: 2.5px; border-radius: 1px; background: #0F172A; }
          .sig i:nth-child(1) { height: 4px; } .sig i:nth-child(2) { height: 5.5px; } .sig i:nth-child(3) { height: 7px; } .sig i:nth-child(4) { height: 8.5px; }
          .batt { width: 15px; height: 7.5px; margin-left: 4px; border-radius: 2.5px; border: 1.2px solid #22C55E; background: linear-gradient(90deg, #22C55E 70%, transparent 70%); }
          .p-nav { position: relative; display: flex; align-items: center; justify-content: center; height: 32px; background: #fff; }
          .p-back { position: absolute; left: 14px; width: 7px; height: 7px; border-left: 1.6px solid #0F172A; border-bottom: 1.6px solid #0F172A; transform: rotate(45deg); }
          .p-title { font-family: 'Space Grotesk', sans-serif; font-size: 12.5px; font-weight: 600; letter-spacing: .2px; }
          .p-day { position: absolute; right: 10px; padding: 3px 8px; border-radius: 99px; background: #22C55E; color: #fff; font-size: 9px; font-weight: 700; }
          .p-tabs { display: flex; background: #fff; box-shadow: 0 4px 8px -6px rgba(15,23,42,.18); }
          .p-tabs span { flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; padding: 6px 0 7px; font-size: 10px; font-weight: 600; color: #64748B; border-bottom: 2px solid transparent; }
          .p-tabs em { font-style: normal; font-size: 8.5px; padding: 0 5px; border-radius: 99px; background: #EEF2F6; color: #475569; }
          .p-tabs .on { color: #0F172A; }
          .p-tabs .on.pos { border-color: #22C55E; } .p-tabs .on.pos em { background: #DCFCE7; color: #16A34A; }
          .p-tabs .on.neg { border-color: #EF4444; } .p-tabs .on.neg em { background: #FEE2E2; color: #EF4444; }
          .p-body { padding: 8px 9px 60px; }
          .p-src { font-size: 8.5px; color: #64748B; margin: 0 2px 7px; }
          .p-card { padding: 9px 9px 7px; margin-bottom: 8px; border-radius: 13px; background: #fff; border: 1px solid #E8EDF3; box-shadow: 0 4px 12px -8px rgba(15,23,42,.22); }
          .p-ct { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
          .p-name { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 600; line-height: 1.2; }
          .p-pill { flex: none; padding: 2px 7px; border-radius: 99px; font-size: 10px; font-weight: 700; }
          .p-pill small { font-size: 8px; font-weight: 600; margin-left: 1px; }
          .p-pill.neg { background: #FEE2E2; color: #EF4444; } .p-pill.pos { background: #DCFCE7; color: #16A34A; }
          .p-txt { margin: 4px 0 6px; font-size: 9px; line-height: 1.4; color: #1E293B; }
          .p-txt b { font-weight: 600; } .p-txt b.neg { color: #EF4444; } .p-txt b.pos { color: #16A34A; }
          .p-cmp { padding: 5px 7px; border-radius: 9px; background: #F1F4F8; border: 1px solid #E5EAF0; }
          .p-row { display: flex; align-items: center; gap: 6px; margin: 2px 0; }
          .p-lbl { width: 54px; font-size: 8.5px; color: #1E293B; white-space: nowrap; }
          .p-track { flex: 1; height: 5px; border-radius: 99px; background: #fff; overflow: hidden; }
          .p-track span { display: block; height: 100%; border-radius: 99px; }
          .p-track .base { background: #64748B; } .p-track .neg { background: #EF4444; } .p-track .pos { background: #22C55E; }
          .p-val { width: 38px; text-align: right; font-size: 8.5px; font-weight: 600; white-space: nowrap; }
          .p-ev { display: flex; align-items: center; gap: 4px; margin-top: 6px; padding-top: 5px; border-top: 1px solid #EEF2F6; font-size: 7.5px; color: #64748B; white-space: nowrap; overflow: hidden; }
          .p-ev b { color: #0F172A; font-weight: 600; }
          .p-rank { padding: 1px 4px; border-radius: 4px; background: #0F172A; color: #fff; font-weight: 700; }
          .p-bar { position: absolute; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: space-around; height: 44px; padding: 0 6px 6px; background: #fff; border-top: 1px solid #E8EDF3; font-size: 7.5px; font-weight: 500; color: #0F172A; }
          .p-bar .p-plus { width: 30px; height: 30px; border-radius: 9px; background: #22C55E; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 300; }
          .p-bar .on { padding: 4px 5px; border-radius: 8px; background: #F1F5F9; color: #16A34A; font-weight: 600; }

          @media (min-width: 600px) {
            .card { padding: 28px 286px 28px 32px; border-radius: 20px;
              background: radial-gradient(420px 300px at 85% 110%, rgba(34,197,94,.28), transparent 70%), #0F172A; }
            .title { font-size: 26px; line-height: 1.15; }
            .sub { font-size: 15px; line-height: 1.5; }
            .btns { margin-top: 18px; }
            .btn { min-height: 44px; }
            .phone { position: absolute; right: 32px; top: 28px; height: 460px; margin: 0; }
            .review { display: block; margin-top: 16px; padding: 10px 12px; border-radius: 12px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); }
            .r-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
            .stars { color: #FBBF24; font-size: 12px; letter-spacing: 1px; }
            .review figcaption { font-size: 11.5px; color: rgba(255,255,255,.5); }
            .review blockquote { font-size: 13px; line-height: 1.4; color: rgba(255,255,255,.88); }
          }
        </style>
        <aside class="card" aria-label="Kygo app">
          <p class="kicker">Kygo app</p>
          <h3 class="title">${esc(headline)}</h3>
          <p class="sub">${esc(sub)}</p>
          <div class="btns">
          </div>
          ${this.hasAttribute('web') ? `<p class="web">Or start on the <a href="https://app.kygo.app/start?utm_source=kygo.app&amp;utm_medium=${esc(this._surface)}&amp;utm_campaign=${esc(this._slug)}" data-destination="web" target="_blank" rel="noopener">web</a></p>` : ''}
          <figure class="review">
            <div class="r-top"><span class="stars" aria-label="5 out of 5 stars">★★★★★</span><figcaption>App Store review</figcaption></div>
            <blockquote>“${esc(REVIEW)}”</blockquote>
          </figure>
          ${this._phone()}
        </aside>`;
    }
  }

  customElements.define('kygo-app-card', KygoAppCard);
})();
