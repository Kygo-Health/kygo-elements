/**
 * Kygo Health - GA4 Button Click Tracking
 * Automatically tracks CTA clicks across all Web Components (pierces Shadow DOM)
 *
 * Usage:
 *   <script src="kygo-tracking.js" data-ga-id="G-XXXXXXXXXX"></script>
 *
 * Events sent to GA4:
 *   - cta_click        (category, label, url, component, position)
 *   - android_download  (component via cta_click)
 *   - tool_interaction  (tool_name, action; for declared controls also
 *                        tool_control, tool_value, visit_campaign, visit_content:
 *                        data-tool-control attributes or KygoTrack.toolInteraction)
 *   - cta_view         (one per CTA seen: blog HTML-embed cards via postMessage;
 *                       <kygo-app-card> / <kygo-cta> in the page send their own)
 *   - gate_blog        (blog report card click, via postMessage from its Wix HTML iframe)
 *   - gate_companion   (the same card on the State of Wearable Accuracy companion post)
 *   - gate_tool        (report card on a tool page, data-gate attribute)
 *
 * Reddit Pixel (a2_ivf5p0ctl2fn), only with Wix advertising consent, top page only:
 *   - PageVisit  (load, and each new pathname on Wix's SPA navigation)
 *   - Lead       (cta_click of ios_download / android_download / web_signup)
 *   - SignUp     (email_subscribe)
 */
(function () {
  'use strict';

  /* ── GA4 Bootstrap ────────────────────────────────── */

  const scriptTag = document.querySelector('script[data-ga-id]');
  const GA_ID = scriptTag && scriptTag.getAttribute('data-ga-id');

  if (!GA_ID) {
    console.warn('[kygo-tracking] Missing data-ga-id attribute on script tag. Tracking will log to console only.');
  }

  // Load gtag.js
  if (GA_ID) {
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { send_page_view: true });
  }

  /* ── Reddit Pixel (advertising, consent-gated) ────── */

  // Reddit Ads pixel a2_ivf5p0ctl2fn. Advertising, so it loads and fires only
  // while Wix's consent policy allows advertising (the cookie banner's "Accept
  // all"). Top page only: never inside a frame. No PII and no advanced
  // matching: init takes the id alone, and events carry a conversionId only.
  // Shared state lives on window.__kygoRdt so a second copy of this script
  // cannot init twice or fire a second PageVisit / Lead for the same event.
  var RDT_ID = 'a2_ivf5p0ctl2fn';
  var RDT_LEAD_CATEGORIES = { ios_download: 1, android_download: 1, web_signup: 1 };
  var rdtState = window.__kygoRdt || (window.__kygoRdt = { started: false, loaded: false, path: null });

  function rdtTopPage() {
    try { return window.top === window; } catch (e) { return false; }
  }

  /** true when advertising consent is allowed now. Off Wix (no
   *  consentPolicyManager and no Wix markup) the pixel is allowed. On a Wix
   *  page whose consentPolicyManager is not there yet, it waits. */
  function rdtConsent() {
    try {
      var cpm = window.consentPolicyManager;
      if (cpm && typeof cpm.getCurrentConsentPolicy === 'function') {
        var cur = cpm.getCurrentConsentPolicy();
        return !!(cur && cur.policy && cur.policy.advertising === true);
      }
      return !rdtOnWix();
    } catch (e) { return false; }
  }

  function rdtOnWix() {
    try {
      var gen = document.querySelector('meta[name="generator"]');
      return !!((gen && /wix/i.test(gen.getAttribute('content') || '')) || window.viewerModel || window.wixBiSession);
    } catch (e) { return false; }
  }

  function rdtCall() {
    try {
      if (!rdtState.loaded || !window.rdt || !rdtConsent()) return;
      window.rdt.apply(window, arguments);
    } catch (e) { /* analytics must never break the page */ }
  }

  function rdtConversionId() {
    return 'k' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  /** Lead / SignUp, once per DOM event even if this script is on the page twice. */
  function rdtConversion(name, evt) {
    try {
      if (evt) {
        if (evt.__kygoRdt) return;
        evt.__kygoRdt = true;
      }
      rdtCall('track', name, { conversionId: rdtConversionId() });
    } catch (e) { /* never break clicks */ }
  }

  function rdtLoad() {
    try {
      if (rdtState.loaded || !rdtTopPage() || !rdtConsent()) return;
      rdtState.loaded = true;
      if (!window.rdt) {
        // Reddit's standard base code (queue stub + async pixel.js).
        var p = window.rdt = function () {
          p.sendEvent ? p.sendEvent.apply(p, arguments) : p.callQueue.push(arguments);
        };
        p.callQueue = [];
        var t = document.createElement('script');
        t.src = 'https://www.redditstatic.com/ads/pixel.js';
        t.async = true;
        var s = document.getElementsByTagName('script')[0];
        if (s && s.parentNode) s.parentNode.insertBefore(t, s);
        else (document.head || document.documentElement).appendChild(t);
      }
      window.rdt('init', RDT_ID);
      rdtState.path = window.location.pathname;
      window.rdt('track', 'PageVisit');
    } catch (e) { /* never break the page */ }
  }

  /** Wix navigates without reloads: one PageVisit per new pathname. */
  function rdtPathCheck() {
    try {
      if (!rdtState.loaded) return;
      var path = window.location.pathname;
      if (path === rdtState.path) return;
      rdtState.path = path;
      rdtCall('track', 'PageVisit');
    } catch (e) { /* ignore */ }
  }

  if (!rdtState.started && rdtTopPage()) {
    rdtState.started = true;
    rdtLoad();
    // A later "Accept all" loads it then. Wix dispatches consentPolicyChanged
    // on document; its detail is the new policy, but rdtConsent() re-reads
    // getCurrentConsentPolicy() so the manager stays the one source of truth.
    document.addEventListener('consentPolicyChanged', function () { rdtLoad(); });
    // Backstop in case the event is missed or consentPolicyManager arrives late.
    [2000, 5000, 10000, 15000].forEach(function (ms) { setTimeout(rdtLoad, ms); });
    try {
      ['pushState', 'replaceState'].forEach(function (m) {
        var orig = history[m];
        if (typeof orig !== 'function') return;
        history[m] = function () {
          var r = orig.apply(this, arguments);
          setTimeout(rdtPathCheck, 0);
          return r;
        };
      });
    } catch (e) { /* history not writable: the poll below covers it */ }
    window.addEventListener('popstate', function () { setTimeout(rdtPathCheck, 0); });
    setInterval(rdtPathCheck, 1000);
  }

  /* ── Helpers ──────────────────────────────────────── */

  function track(eventName, params) {
    if (window.gtag) {
      window.gtag('event', eventName, params);
    }
    if (!GA_ID) {
      console.log('[kygo-tracking]', eventName, params);
    }
  }

  /** Walk composedPath to find the first element matching a test fn */
  function findInPath(path, testFn) {
    for (var i = 0; i < path.length; i++) {
      if (path[i].nodeType === 1 && testFn(path[i])) return path[i];
    }
    return null;
  }

  /** Identify which custom element host contains the click */
  function getComponentName(path) {
    for (var i = 0; i < path.length; i++) {
      var el = path[i];
      if (el.tagName && el.tagName.indexOf('-') > 0 && customElements.get(el.tagName.toLowerCase())) {
        return el.tagName.toLowerCase();
      }
    }
    return 'unknown';
  }

  /** Derive a human-readable label from a button/link */
  function getLabel(el) {
    return (el.getAttribute('data-track-label') ||
            el.textContent || '').replace(/\s+/g, ' ').trim().substring(0, 80);
  }

  /* ── Classification Logic ─────────────────────────── */

  // Amazon marketplaces + amzn.to short links. Matched against the link
  // hostname so affiliate clicks get their own cta_category instead of
  // falling through to other_action / null (they carry no Kygo class).
  const AMAZON_HOST = /(^|\.)amazon\.(com|de|co\.uk|ca|fr|it|es|com\.au|co\.jp)$|(^|\.)amzn\.to$/;

  /** The <kygo-cta> element that owns this anchor, if any. Its buttons live in
   *  the element's own shadow root, so the host is one getRootNode() away. */
  function ctaHost(el) {
    try {
      var root = el.getRootNode && el.getRootNode();
      var host = root && root.host;
      return host && (host.tagName === 'KYGO-CTA' || host.tagName === 'KYGO-APP-CARD') ? host : null;
    } catch (e) { return null; }
  }

  /** Tenjin click ids by platform, a fallback for pages where kygo-cta.js
   *  (window.KygoAttribution.platformOf) has not loaded. Keep in sync with the
   *  link tables in kygo-cta.js (TENJIN_*, CAMPAIGN_STORE_LINKS,
   *  REDDIT_ORGANIC_STORE_LINKS) and docs/internal-and-app-store-links.md. */
  const TENJIN_PLATFORM = {
    cD7zgIPLuiZMMWmWkXLsvy: 'ios',     eMjS3ZkseCvs2lO9AVESkO: 'android', // Website (default)
    gFqSqqW0D7o69kO5yaV7k1: 'ios',     eQRLQj5018oTQjwGo72WqW: 'android', // deep-sleep-post
    cn5sS5sp0r3LtQ65D8ihiR: 'ios',     fd2h8tIhLyB3h0fwIWYElA: 'android', // apple-watch-sleep-post
    TEmyDcRQIVRM8VUAxfh4: 'ios',       heO9OuoP6tG8lENadDof4n: 'android', // Reddit Organic
    cGxLgiFXo568zuRagtaj4P: 'ios',     dqOjxxwQjbt0R8i6TJRLpO: 'android'  // Email (e5)
  };

  /** 'ios' | 'android' | null for a track.tenjin.com/v0/click/ link. */
  function tenjinPlatform(href) {
    try {
      var ka = window.KygoAttribution;
      if (ka && typeof ka.platformOf === 'function') {
        var p = ka.platformOf(href);
        if (p === 'ios' || p === 'android') return p;
      }
    } catch (e) { /* fall back to the local table */ }
    var m = /track\.tenjin\.com\/v0\/click\/([A-Za-z0-9]+)/.exec(href);
    return m && Object.prototype.hasOwnProperty.call(TENJIN_PLATFORM, m[1]) ? TENJIN_PLATFORM[m[1]] : null;
  }

  function classifyClick(el) {
    var action = el.getAttribute('data-action');
    var href = el.getAttribute('href') || '';
    var classList = el.className || '';

    // The shared <kygo-cta> labels every button with its destination, which is
    // more reliable than sniffing the href — and it is the only CTA on the site
    // that offers a web destination alongside the two stores.
    var destination = el.getAttribute('data-destination');
    if (destination === 'ios' || destination === 'android' || destination === 'web') {
      var host = ctaHost(el);
      return {
        category: destination === 'web' ? 'web_signup' : destination + '_download',
        label: (host && host.getAttribute('slug')) || getLabel(el),
        url: href,
        position: host && host.getAttribute('surface'),
        // <kygo-app-card> carries a design variant; GA4 custom dimension cta_content.
        content: host && host.tagName === 'KYGO-APP-CARD' ? (host.getAttribute('variant') || '') : ''
      };
    }

    // Any Tenjin store link the site knows (default, per-campaign, Reddit
    // Organic, email). kygo-cta.js swaps a campaign link into the header /
    // footer buttons on pointerdown, before this click handler sees it, and
    // those buttons carry no data-destination.
    if (href.indexOf('track.tenjin.com/v0/click/') !== -1) {
      var plat = tenjinPlatform(href);
      if (plat) return { category: plat + '_download', label: getLabel(el), url: href };
    }

    // Any link into the web app (the header "Open web app" button, the footer
    // web links) is a web signup, ahead of the class-based buckets below
    // (the footer's kygo-footer-cta-btn would otherwise match 'cta-btn').
    if (/^https:\/\/app\.kygo\.app([\/?#]|$)/i.test(href)) {
      return { category: 'web_signup', label: getLabel(el), url: href };
    }

    // iOS App Store download (direct App Store link, or the Tenjin
    // attribution link that resolves to the iOS store —
    // track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy)
    if (action === 'ios-download' ||
        href.indexOf('apps.apple.com') !== -1 ||
        href.indexOf('track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy') !== -1 ||
        (classList.indexOf('cta-primary') !== -1 && href.indexOf('apple') !== -1) ||
        // A paid session's per-campaign Tenjin iOS link (kygo-cta.js
        // CAMPAIGN_STORE_LINKS) on a header/footer iOS button.
        (classList.indexOf('cta-primary') !== -1 && href.indexOf('track.tenjin.com/') !== -1)) {
      return { category: 'ios_download', label: getLabel(el), url: href || 'button-redirect' };
    }

    // Android download (Google Play directly, via kygo.app/android, or the Tenjin
    // attribution link that resolves to the Play store —
    // track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO)
    if (action === 'android-download' ||
        classList.indexOf('cta-android') !== -1 ||
        href.indexOf('play.google.com') !== -1 ||
        href.indexOf('kygo.app/android') !== -1 ||
        href.indexOf('track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO') !== -1) {
      return { category: 'android_download', label: getLabel(el), url: href || 'button-redirect' };
    }

    // "See how it works" / scroll CTA. Only the .cta-secondary button: a nav
    // or footer link that reads "How it works" is navigation, not this CTA.
    if (classList.indexOf('cta-secondary') !== -1) {
      return { category: 'see_how_it_works', label: getLabel(el) };
    }

    // Tool interaction buttons (calculate, compare, etc.)
    if (action === 'calculate' || action === 'compare' || action === 'analyze' ||
        classList.indexOf('calculate-button') !== -1) {
      return { category: 'tool_interaction', label: getLabel(el), action_type: action || 'calculate' };
    }

    // Header CTA (Get Kygo App in nav)
    if (classList.indexOf('header-cta') !== -1) {
      return { category: 'header_cta', label: getLabel(el), url: href || 'button-redirect' };
    }

    // Blog/article CTA
    if (classList.indexOf('blog-cta-btn') !== -1) {
      return { category: 'blog_cta', label: getLabel(el), url: href || 'button-redirect' };
    }

    // Generic CTA with primary styling
    if (classList.indexOf('cta-primary') !== -1 ||
        classList.indexOf('cta-button-primary') !== -1 ||
        classList.indexOf('cta-btn') !== -1) {
      return { category: 'primary_cta', label: getLabel(el), url: href };
    }

    // Amazon affiliate link (amzn.to short link or full amazon.<tld> URL).
    // No Kygo class/data-action, so classify by hostname before the fallback.
    try {
      var amazonUrl = new URL(el.href);
      if (AMAZON_HOST.test(amazonUrl.hostname)) {
        return {
          category: 'affiliate_amazon',
          label: el.getAttribute('data-track-label') ||
                 (amazonUrl.pathname.split('/').filter(Boolean)[0] || 'unknown'),
          url: el.href,
          affiliate: 'amazon',
          affiliate_marketplace: amazonUrl.hostname.replace(/^www\./, '')
        };
      }
    } catch (e) { /* el has no parseable href (e.g. a <button>) — ignore */ }

    // Related-tools card: internal tool-to-tool navigation. Gets its own
    // category (rather than falling through to other_action) so the
    // cross-link section can be measured as a retention surface.
    if (action === 'related-tool') {
      return {
        category: 'related_tool_click',
        label: getLabel(el),
        url: href,
        to_tool: el.getAttribute('data-tool-slug') || ''
      };
    }

    // Related-reading card: tool-to-blog navigation. Gets its own category
    // (rather than falling through to other_action) so the blog cross-link
    // section can be measured as a retention surface alongside related_tool_click.
    if (action === 'blog-post') {
      return {
        category: 'blog_post_click',
        label: getLabel(el),
        url: href,
        to_post: el.getAttribute('data-post-slug') || ''
      };
    }

    // Any other data-action button
    if (action) {
      return { category: 'other_action', label: getLabel(el), url: href, action_type: action };
    }

    return null;
  }

  /** Rewrite an Amazon link's href with a per-click `ascsubtag` so Associates
   *  order/earnings reports can attribute revenue to the page + component.
   *  Keeps the existing `tag=` param; runs in the capture-phase click handler
   *  before navigation. Returns the (possibly rewritten) href. */
  function addAmazonSubtag(el, component) {
    try {
      var u = new URL(el.href);
      var sub = (window.location.pathname.replace(/\//g, '-').replace(/^-|-$/g, '') || 'home') +
                '_' + (component || 'page');
      u.searchParams.set('ascsubtag', sub.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 90));
      el.href = u.toString();
      return el.href;
    } catch (e) {
      return el.href;
    }
  }

  /* ── Tool interactions (shared by every tool) ─────── */

  /** The visit's campaign, carried on tool_interaction so engagement can be
   *  split by ad vs organic: utm_campaign / utm_content (lowercase) when the
   *  session has them, 'reddit-organic' for a Reddit-referrer visit with no
   *  utm_*, else 'none'. Read from kygo-cta.js's session record when loaded. */
  function visitCampaign() {
    var a = embedAttribution() || {};
    var utm = a.utm || {};
    var clip = function (v) { return String(v || '').toLowerCase().replace(/[^\w\-.]/g, '').slice(0, 60); };
    return {
      visit_campaign: utm.utm_campaign ? clip(utm.utm_campaign) : (a.reddit ? 'reddit-organic' : 'none'),
      visit_content: utm.utm_content ? clip(utm.utm_content) : ''
    };
  }

  function toolStr(v, max) {
    return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max);
  }

  /** GA4 tool_interaction for one use of a tool control. p = {tool, control,
   *  value, action, label}; tool defaults to the component tag. Public as
   *  window.KygoTrack.toolInteraction for controls that are not clicks or
   *  form fields (a drag, a custom slider). */
  function toolInteraction(p) {
    p = p || {};
    var params = {
      tool_name: toolStr(p.tool, 60) || 'unknown',
      action: toolStr(p.action, 30) || 'use',
      page_path: window.location.pathname
    };
    if (p.control) params.tool_control = toolStr(p.control, 60);
    if (p.value != null && p.value !== '') params.tool_value = toolStr(p.value, 100);
    if (p.label != null) params.button_label = toolStr(p.label, 80);
    var vc = visitCampaign();
    params.visit_campaign = vc.visit_campaign;
    if (vc.visit_content) params.visit_content = vc.visit_content;
    track('tool_interaction', params);
  }

  window.KygoTrack = window.KygoTrack || {};
  window.KygoTrack.toolInteraction = toolInteraction;

  /** A control declared with data-tool-control (any tool, any element: a
   *  button, a tab, a select, a range input). Read here so no tool wires its
   *  own GA4 call:
   *    data-tool-control  what the control is, e.g. device-picker, metric-tab
   *    data-tool-value    what was chosen (else the element's value, else its label)
   *    data-tool-action   optional verb; otherwise read from the state before
   *                       the click: aria-pressed gives select / deselect,
   *                       aria-expanded (or the open state of the <details>
   *                       a <summary> belongs to) gives expand / collapse, a tab
   *                       (aria-selected) gives select; else click / change
   *    data-tool-name     optional; defaults to the component's tag */
  function toolAction(el, action) {
    var pressed = el.getAttribute('aria-pressed');
    var expanded = el.getAttribute('aria-expanded');
    var details = el.tagName === 'SUMMARY' && el.parentElement && el.parentElement.tagName === 'DETAILS' ? el.parentElement : null;
    if (details && expanded == null) expanded = details.open ? 'true' : 'false';
    return el.getAttribute('data-tool-action') ||
           (pressed === 'true' ? 'deselect' : pressed === 'false' ? 'select' :
            expanded === 'true' ? 'collapse' : expanded === 'false' ? 'expand' :
            el.hasAttribute('aria-selected') ? 'select' : action);
  }

  function declaredTool(el, path, action, verb) {
    toolInteraction({
      tool: el.getAttribute('data-tool-name') || getComponentName(path),
      control: el.getAttribute('data-tool-control'),
      value: el.getAttribute('data-tool-value') ||
             (el.type === 'checkbox' ? String(!!el.checked) : (el.value != null && el.value !== '' ? el.value : getLabel(el))),
      action: verb || toolAction(el, action),
      label: getLabel(el)
    });
  }

  /* ── Event Listeners ──────────────────────────────── */

  var toolClicks = 0; // declared-control clicks so far (see the key handler)

  function onClick(e) {
    var path = e.composedPath();

    // Find the closest clickable element (button, a, [data-action])
    var clickable = findInPath(path, function (el) {
      var tag = el.tagName;
      return tag === 'A' || tag === 'BUTTON' || el.hasAttribute('data-action') ||
             el.hasAttribute('data-tool-control');
    });

    if (!clickable) return;

    var component = getComponentName(path);

    // A declared tool control. Form fields report on change (below), not on
    // the click that focuses them, and a middle click is not a use. A link or
    // data-action element inside a control (a buy link in an accordion
    // header) is that link's click, not a use of the control.
    if (e.type === 'click') {
      var ctl = findInPath(path, function (el) { return el.hasAttribute('data-tool-control'); });
      var inner = ctl && clickable !== ctl && path.indexOf(clickable) < path.indexOf(ctl) &&
                  (clickable.tagName === 'A' || clickable.hasAttribute('data-action'));
      if (ctl && !inner && !/^(INPUT|SELECT|TEXTAREA)$/.test(ctl.tagName)) {
        toolClicks++;
        declaredTool(ctl, path, 'click');
        return;
      }
    }

    // Report gate links on tool pages carry data-gate="gate_tool". Filed as their own event, like gate_blog.
    var gate = clickable.getAttribute('data-gate');
    if (gate && /^gate_[a-z_]{2,20}$/.test(gate)) {
      track(gate, {
        cta_label: (clickable.getAttribute('data-track-label') || '').slice(0, 60),
        cta_url: clickable.getAttribute('href') || '',
        component: component,
        position: clickable.getAttribute('data-track-position') || 'body',
        page_path: window.location.pathname
      });
      return;
    }

    var info = classifyClick(clickable);
    if (!info) return;

    var position = clickable.getAttribute('data-track-position') || info.position || 'body';

    if (info.category === 'tool_interaction') {
      // Legacy calculate / compare / analyze buttons: same event and the
      // same campaign fields as declared controls.
      toolInteraction({ tool: component, action: info.action_type, label: info.label });
    } else {
      // Per-click Amazon attribution: rewrite the href (adds ascsubtag) before
      // the browser navigates, so cta_url reflects the tagged link we report.
      if (info.category === 'affiliate_amazon') {
        info.url = addAmazonSubtag(clickable, component);
      }
      var ctaParams = {
        cta_category: info.category,
        cta_label: info.label,
        cta_url: info.url || '',
        component: component,
        position: position,
        page_path: window.location.pathname
      };
      if (info.content) ctaParams.cta_content = info.content;
      if (info.affiliate) ctaParams.affiliate = info.affiliate;
      if (info.affiliate_marketplace) ctaParams.affiliate_marketplace = info.affiliate_marketplace;
      if (info.to_tool) ctaParams.to_tool = info.to_tool;
      if (info.to_post) ctaParams.to_post = info.to_post;
      if (info.action_type) ctaParams.action_type = info.action_type;
      track('cta_click', ctaParams);
      if (RDT_LEAD_CATEGORIES[info.category]) rdtConversion('Lead', e);
    }
  }

  // Click tracking — uses composedPath to pierce Shadow DOM.
  // capture phase to fire before any stopPropagation.
  document.addEventListener('click', onClick, true);
  // Middle click (open in new tab) fires auxclick, not click, so it gets the
  // same handling (event + Amazon ascsubtag). Only button 1: a right click
  // also fires auxclick and is not a click on the link. A left click never
  // fires auxclick, so nothing is counted twice.
  document.addEventListener('auxclick', function (e) {
    if (e.button === 1) onClick(e);
  }, true);

  // Declared form fields report the value they were changed to. A change
  // event is not composed, so inside a component's shadow root it never
  // reaches the document; the input event is (composedPath()[0] is the field):
  //   select, checkbox, radio  each input is one choice, sent at once
  //   range                    sent once the slider has rested 700 ms
  //   text, search, number     sent on the field's own change (Enter or
  //                            leaving the field), never per keystroke: the
  //                            first input puts a change listener on the field
  //                            (focusin is no help: it stops at the shadow host
  //                            when focus moves inside one component)
  var rangeTimers = typeof WeakMap === 'function' ? new WeakMap() : null;
  var boundFields = typeof WeakSet === 'function' ? new WeakSet() : null;
  function declaredField(e) {
    var path = e.composedPath ? e.composedPath() : [e.target];
    var el = path[0];
    if (!el || el.nodeType !== 1 || !el.hasAttribute('data-tool-control')) return null;
    return { el: el, path: path };
  }
  document.addEventListener('input', function (e) {
    var f = declaredField(e);
    if (!f) return;
    var el = f.el, type = (el.type || '').toLowerCase();
    if (el.tagName === 'SELECT' || type === 'checkbox' || type === 'radio') {
      declaredTool(el, f.path, 'change');
    } else if (type === 'range' && rangeTimers) {
      clearTimeout(rangeTimers.get(el));
      rangeTimers.set(el, setTimeout(function () { declaredTool(el, f.path, 'change'); }, 700));
    } else if (boundFields && !boundFields.has(el)) {
      boundFields.add(el);
      el.addEventListener('change', function () { declaredTool(el, f.path, 'change'); });
    }
  }, true);

  // Enter / Space on a declared control that is not a native button, link or
  // field (a div with role="button", an accordion header) fires no click, so
  // the key press is the use. The state is read before the tool handles the
  // key (capture), and the event is sent only if the tool did handle it
  // (preventDefault, seen in the bubble phase), so a key the tool ignores
  // counts nothing. Native buttons and links are left to their click, and a
  // tool that answers the key with el.click() is counted by that click.
  var pendingKey = null;
  document.addEventListener('keydown', function (e) {
    pendingKey = null;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var path = e.composedPath ? e.composedPath() : [e.target];
    var el = findInPath(path, function (n) { return n.hasAttribute('data-tool-control'); });
    if (!el || /^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(el.tagName)) return;
    pendingKey = { e: e, el: el, path: path, verb: toolAction(el, 'click'), clicks: toolClicks };
  }, true);
  document.addEventListener('keydown', function (e) {
    var p = pendingKey;
    pendingKey = null;
    if (p && p.e === e && e.defaultPrevented && toolClicks === p.clicks) declaredTool(p.el, p.path, 'click', p.verb);
  });

  // Track page visibility for engagement
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      track('page_exit', {
        page_path: window.location.pathname
      });
    }
  });

  /* ── Conversion CustomEvents → GA4 ────────────────── */

  // Components dispatch these for the Wix Velo host (bubbles + composed, so
  // they reach document). Mirror them into GA4 as key events. NEVER read the
  // email or any other PII out of e.detail — only non-identifying context.
  const CONVERSION_EVENTS = {
    subscribe:     { ga: 'email_subscribe', lead: 'newsletter' },
    // kygo-contact.js fires contactSubmitted once the host confirms the send
    // (data-form-result="success"), so contact_submit counts delivered
    // messages, not attempts. contactSubmit (the attempt) is Velo's cue to send.
    contactSubmitted: { ga: 'contact_submit', lead: 'contact_form' },
    // kygo-report-download.js: a click on "Download the PDF" (State of Wearable Accuracy 2026).
    reportDownload: { ga: 'report_download', lead: 'report' }
  };

  Object.keys(CONVERSION_EVENTS).forEach(function (domEvent) {
    var cfg = CONVERSION_EVENTS[domEvent];
    document.addEventListener(domEvent, function (e) {
      var detail = e.detail || {};
      var params = {
        lead_type: cfg.lead,
        // e.target is retargeted to the shadow host (e.g. <kygo-contact>).
        component: detail.component ||
                   (e.target && e.target.tagName ? e.target.tagName.toLowerCase() : 'unknown'),
        page_path: window.location.pathname
      };
      // Only the subscribe form and reportDownload carry a `source`; the contact
      // form's contactSubmitted carries {component} only, and its contactSubmit
      // detail (PII: name/email/subject/message) is never listened to here.
      if (detail.source) params.source = detail.source;
      if (domEvent === 'subscribe' && /^report-/.test(detail.source || '')) params.lead_type = 'report';
      track(cfg.ga, params);
      if (domEvent === 'subscribe') rdtConversion('SignUp', e);
    }, true);
  });

  /* ── Blog HTML-embed CTA cards → GA4 ──────────────── */

  // A Wix Blog "HTML code" block is a sandboxed iframe on a Wix domain, so the
  // click listener above never sees it. The card snippet
  // (docs/wix-snippets/blog-cta-card.html) posts {kygo:'embed', type, ...}
  // up instead. Only plain strings from a fixed set are read out of it.
  var EMBED_DEST = { ios: 'ios_download', android: 'android_download', web: 'web_signup' };

  function embedStr(v, max) {
    return typeof v === 'string' ? v.replace(/[^\w\-:\/.?=&%+~#@]/g, '').slice(0, max) : '';
  }

  function embedFrame(source) {
    var frames = document.getElementsByTagName('iframe');
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].contentWindow === source) return frames[i];
    }
    return null;
  }

  /** The visitor's inbound utm_* and click ids (and, from kygo-cta.js, the
   *  Reddit-organic landing path): kygo-cta.js's session record when it is on
   *  the page, else this URL's own. */
  function embedAttribution() {
    try {
      if (window.KygoAttribution) return window.KygoAttribution.capture();
    } catch (e) { /* fall back to the URL */ }
    var out = { utm: null, click: {} };
    try {
      var params = new URLSearchParams(window.location.search);
      params.forEach(function (v, k) {
        if (/^utm_/.test(k) && v) (out.utm = out.utm || {})[k] = v;
      });
      ['fbclid', 'gclid'].forEach(function (k) { if (params.get(k)) out.click[k] = params.get(k); });
    } catch (e) { /* no attribution to pass on */ }
    return out;
  }

  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || typeof d !== 'object' || d.kygo !== 'embed' || !e.source) return;

    if (d.type === 'hello') {
      var a = embedAttribution();
      var reply = { kygo: 'embed', type: 'attr', utm: a.utm || null, click: a.click || {} };
      // A Reddit-organic visit's landing path (kygo-cta.js capture, set only
      // when the session has no utm_*), so a blog app card in the frame swaps
      // to the Reddit Organic Tenjin links too. A path, never a utm_* value.
      var reddit = !a.utm && typeof a.reddit === 'string' ? embedStr(a.reddit, 100).replace(/[?#&=].*$/, '') : '';
      if (reddit && reddit.charAt(0) === '/') reply.reddit = reddit;
      try {
        e.source.postMessage(reply, '*');
      } catch (err) { /* frame went away */ }
      return;
    }

    if (d.type === 'height') {
      var frame = embedFrame(e.source);
      var h = Number(d.height);
      if (frame && h > 0 && h < 3000) frame.style.height = h + 'px';
      return;
    }

    var slug = embedStr(d.slug, 60) || 'unknown';
    var base = {
      cta_label: slug,
      component: 'kygo-blog-embed',
      position: 'blog-embed',
      page_path: window.location.pathname
    };
    var content = embedStr(d.content, 60);
    if (content) base.cta_content = content;

    if (d.type === 'click' && EMBED_DEST[d.destination]) {
      base.cta_category = EMBED_DEST[d.destination];
      base.cta_url = embedStr(d.url, 300);
      track('cta_click', base);
      rdtConversion('Lead', e);
    } else if (d.type === 'view') {
      track('cta_view', base);
    } else if (d.type === 'subscribe') {
      // kygo-report-card in a blog iframe: the email went to /_functions/subscribe
      // from the frame; only the source string comes up here, never the address.
      track('email_subscribe', {
        lead_type: 'report',
        source: embedStr(d.source, 60),
        component: 'kygo-report-card',
        page_path: window.location.pathname
      });
      rdtConversion('SignUp', e);
    }
  });

  /* ── Blog promo cards (Kygo Picks, report) → GA4 ─── */

  // The blog promo cards (docs/wix-snippets/blog-picks-card-*.html and
  // blog-report-card.html) sit in Wix "HTML code" iframes and post
  // {kygo:'promo', card, type:'click', slug, label, url} to the top window.
  // Report card -> gate_blog, or gate_companion when its data-slug is the SOWA
  // companion post's (GATE_COMPANION_SLUGS); Picks card -> cta_click as related_tool_click to
  // best-wearables (the same shape the picks card gets on tool pages). Height
  // messages are handled by the "Kygo Promo Card Sizing" custom embed, not here.
  // Guarded so a second copy of this script cannot register it twice.
  // data-slug values (post slug cut to 40 chars) whose report card is the companion gate.
  var GATE_COMPANION_SLUGS = ['state-of-wearable-accuracy-2026-medal-ta'];
  if (!window.__kygoPromoClicks) {
    window.__kygoPromoClicks = true;
    window.addEventListener('message', function (e) {
      var d = e.data;
      if (!d || typeof d !== 'object' || d.kygo !== 'promo' || d.type !== 'click' || !e.source) return;
      var card = d.card === 'report' ? 'report' : d.card === 'picks' ? 'picks' : '';
      if (!card) return;
      var slug = embedStr(d.slug, 60) || 'unknown';
      var url = embedStr(d.url, 300);
      if (card === 'report') {
        track(GATE_COMPANION_SLUGS.indexOf(slug) !== -1 ? 'gate_companion' : 'gate_blog', {
          cta_label: slug,
          cta_url: url,
          component: 'kygo-blog-embed',
          position: 'blog-embed',
          page_path: window.location.pathname
        });
      } else {
        track('cta_click', {
          cta_category: 'related_tool_click',
          cta_label: typeof d.label === 'string' ? d.label.replace(/[^\w\-. ]/g, '').slice(0, 60) : '',
          cta_url: url,
          to_tool: 'best-wearables',
          component: 'kygo-blog-embed',
          position: 'picks-card-' + slug,
          page_path: window.location.pathname
        });
      }
    });
  }

  // Optional (non-key): calculator completion on the calorie-burn tool.
  // The component dispatches 'kygo-calorie-calculation' (not 'kygo-calculation').
  document.addEventListener('kygo-calorie-calculation', function (e) {
    track('tool_result', {
      tool_name: (e.target && e.target.tagName ? e.target.tagName.toLowerCase() : 'unknown'),
      page_path: window.location.pathname
    });
  }, true);

})();
