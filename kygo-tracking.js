/**
 * Kygo Health - GA4 Button Click Tracking
 * Automatically tracks CTA clicks across all Web Components (pierces Shadow DOM)
 *
 * Usage:
 *   <script src="kygo-tracking.js" data-ga-id="G-XXXXXXXXXX"></script>
 *
 * Events sent to GA4:
 *   - cta_click        (category, label, url, component, position)
 *   - android_signup    (component)
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

    // Android beta signup (opens modal)
    if (action === 'android-beta' ||
        classList.indexOf('cta-android') !== -1 ||
        (classList.indexOf('cta-button-secondary') !== -1 && getLabel(el).toLowerCase().indexOf('android') !== -1)) {
      return { category: 'android_beta', label: getLabel(el) };
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

    // Any other data-action button
    if (action) {
      return { category: 'other_action', label: getLabel(el), action_type: action };
    }

    return null;
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
      track('cta_click', {
        cta_category: info.category,
        cta_label: info.label,
        cta_url: info.url || '',
        component: component,
        position: position,
        page_path: window.location.pathname
      });
    }
  }, true); // capture phase to fire before any stopPropagation

  // Android signup form submission tracking
  document.addEventListener('android-signup', function (e) {
    var component = 'unknown';
    if (e.target && e.target.tagName) {
      component = e.target.tagName.toLowerCase();
    }
    track('android_signup', {
      component: component,
      page_path: window.location.pathname
    });
  });

  // Track page visibility for engagement
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      track('page_exit', {
        page_path: window.location.pathname
      });
    }
  });

})();
