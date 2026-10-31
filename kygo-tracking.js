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
 *   - tool_interaction  (tool_name, action)
 *   - cta_view         (blog HTML-embed cards only: one per card seen)
 *   - gate_blog        (blog report card click, via postMessage from its Wix HTML iframe)
 *   - gate_companion   (the same card on the State of Wearable Accuracy companion post)
 *   - gate_tool        (report card on a tool page, data-gate attribute)
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

    // "See how it works" / scroll CTA
    if (classList.indexOf('cta-secondary') !== -1 ||
        getLabel(el).toLowerCase().indexOf('how it works') !== -1) {
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
      return { category: 'other_action', label: getLabel(el), action_type: action };
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

  /* ── Event Listeners ──────────────────────────────── */

  // Click tracking — uses composedPath to pierce Shadow DOM
  document.addEventListener('click', function (e) {
    var path = e.composedPath();

    // Find the closest clickable element (button, a, [data-action])
    var clickable = findInPath(path, function (el) {
      var tag = el.tagName;
      return tag === 'A' || tag === 'BUTTON' || el.hasAttribute('data-action');
    });

    if (!clickable) return;

    var component = getComponentName(path);

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
      track('tool_interaction', {
        tool_name: component,
        action: info.action_type,
        button_label: info.label
      });
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
      track('cta_click', ctaParams);
    }
  }, true); // capture phase to fire before any stopPropagation

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
    contactSubmit: { ga: 'contact_submit',  lead: 'contact_form' },
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
      // Only the subscribe form and reportDownload carry a `source`; contact detail is PII
      // (firstName/lastName/email/subject/message) and is deliberately ignored.
      if (detail.source) params.source = detail.source;
      if (domEvent === 'subscribe' && /^report-/.test(detail.source || '')) params.lead_type = 'report';
      track(cfg.ga, params);
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

  /** The visitor's inbound utm_* and click ids: kygo-cta.js's session record
   *  when it is on the page, else this URL's own. */
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
      try {
        e.source.postMessage({ kygo: 'embed', type: 'attr', utm: a.utm || null, click: a.click || {} }, '*');
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
