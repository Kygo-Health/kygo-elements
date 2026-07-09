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

  function classifyClick(el) {
    var action = el.getAttribute('data-action');
    var href = el.getAttribute('href') || '';
    var classList = el.className || '';

    // iOS App Store download
    if (action === 'ios-download' ||
        href.indexOf('apps.apple.com') !== -1 ||
        (classList.indexOf('cta-primary') !== -1 && href.indexOf('apple') !== -1)) {
      return { category: 'ios_download', label: getLabel(el), url: href || 'button-redirect' };
    }

    // Android download (Google Play via kygo.app/android)
    if (action === 'android-download' ||
        classList.indexOf('cta-android') !== -1 ||
        href.indexOf('kygo.app/android') !== -1) {
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

    var info = classifyClick(clickable);
    if (!info) return;

    var component = getComponentName(path);
    var position = clickable.getAttribute('data-track-position') || 'body';

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
      if (info.affiliate) ctaParams.affiliate = info.affiliate;
      if (info.affiliate_marketplace) ctaParams.affiliate_marketplace = info.affiliate_marketplace;
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
    contactSubmit: { ga: 'contact_submit',  lead: 'contact_form' }
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
      // Only the subscribe form ever carries a `source`; contact detail is PII
      // (firstName/lastName/email/subject/message) and is deliberately ignored.
      if (detail.source) params.source = detail.source;
      track(cfg.ga, params);
    }, true);
  });

  // Optional (non-key): calculator completion on the calorie-burn tool.
  // The component dispatches 'kygo-calorie-calculation' (not 'kygo-calculation').
  document.addEventListener('kygo-calorie-calculation', function (e) {
    track('tool_result', {
      tool_name: (e.target && e.target.tagName ? e.target.tagName.toLowerCase() : 'unknown'),
      page_path: window.location.pathname
    });
  }, true);

})();
