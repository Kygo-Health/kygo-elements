/**
 * Kygo Health - site header (global Wix custom code)
 * Loaded by the Body-start embed, which keeps the <style> inline so the
 * bar paints before this file arrives. Editing and pushing this file is the
 * deploy: the embed itself does not need to be re-pasted.
 */
(function() {
  // Destinations. The stores keep their Tenjin attribution links; the web app
  // carries its own utm set so header traffic stays separable.
  var IOS_URL = 'https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy';
  var ANDROID_URL = 'https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO';
  var WEB_URL = 'https://app.kygo.app/register?utm_source=kygo.app&utm_medium=header&utm_campaign=nav';

  // Detection only decides which option leads. Every platform stays reachable
  // on every device, and anything unrecognised (or a navigator that throws)
  // falls back to the web app, which works everywhere.
  var isIOS = false, isAndroid = false;
  try {
    var ua = (navigator && navigator.userAgent) || '';
    var touch = (navigator && navigator.maxTouchPoints) || 0;
    isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && touch > 1);
    isAndroid = !isIOS && /Android/i.test(ua);
  } catch (e) { /* fall back to the web app */ }

  var appleIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>';
  var androidIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.236a.5.5 0 0 0-.86.508l1.08 1.83a7.504 7.504 0 0 0-11.486 0l1.08-1.83a.5.5 0 0 0-.86-.508L5.28 5.12A7.502 7.502 0 0 0 1.5 11.5h21A7.502 7.502 0 0 0 18.72 5.12l-1.197-2.884zM8.5 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM3.5 13v6.5A2.5 2.5 0 0 0 6 22h1v-9H3.5zm14 0H17v9h1a2.5 2.5 0 0 0 2.5-2.5V13zM7 13v9h4v-9H7zm4 0v9h4v-9h-4zM1 13.5a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5zm19 0a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5z"/></svg>';
  var phoneIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10.5 18.5h3"/></svg>';
  var globeIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg>';

  // The one button the phone bar shows, matched to the device.
  var mobileCta = isIOS
    ? { href: IOS_URL, label: 'iPhone app', icon: phoneIcon, dest: 'ios', track: 'header-mobile-ios' }
    : isAndroid
      ? { href: ANDROID_URL, label: 'Android app', icon: androidIcon, dest: 'android', track: 'header-mobile-android' }
      : { href: WEB_URL, label: 'Open web app', icon: globeIcon, dest: 'web', track: 'header-mobile-web' };

  // Store buttons for the menu, the device's own one first.
  var iosMenuBtn = '<a href="' + IOS_URL + '" class="kygo-mobile-cta-android cta-primary" data-kygo-dest="ios" data-track-position="header" data-track-label="header-menu-ios" target="_blank" rel="noopener">' + appleIcon + 'iPhone app</a>';
  var androidMenuBtn = '<a href="' + ANDROID_URL + '" class="kygo-mobile-cta-android cta-android" data-action="android-download" data-kygo-dest="android" data-track-position="header" data-track-label="header-menu-android" target="_blank" rel="noopener">' + androidIcon + 'Android app</a>';
  var menuStores = isAndroid ? androidMenuBtn + iosMenuBtn : iosMenuBtn + androidMenuBtn;

  var headerHTML = '<nav class="kygo-nav" id="kygo-nav"><div class="kygo-nav-inner">'
    + '<a href="https://www.kygo.app/" class="kygo-nav-logo"><img src="https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png" alt="Kygo Health" /><span class="kygo-nav-word-lg">KYGO HEALTH</span><span class="kygo-nav-word-sm">KYGO</span></a>'
    + '<div class="kygo-nav-links"><a href="https://www.kygo.app/how-it-works">How It Works</a><a href="https://www.kygo.app/faq">FAQ</a><a href="https://www.kygo.app/blog">Blog</a><a href="https://www.kygo.app/tools">Tools</a><a href="https://www.kygo.app/contact">Contact</a></div>'
    + '<div class="kygo-nav-cta-group desktop-only">'
    + '<div class="kygo-nav-stores">'
    + '<a href="' + IOS_URL + '" class="kygo-nav-store cta-primary" data-kygo-dest="ios" data-track-position="header" data-track-label="header-ios" target="_blank" rel="noopener">' + phoneIcon + 'iOS</a>'
    + '<a href="' + ANDROID_URL + '" class="kygo-nav-store cta-android" data-action="android-download" data-kygo-dest="android" data-track-position="header" data-track-label="header-android" target="_blank" rel="noopener">' + androidIcon + 'Android</a>'
    + '</div>'
    + '<a href="' + WEB_URL + '" class="kygo-nav-cta" data-kygo-dest="web" data-track-position="header" data-track-label="header-web">' + globeIcon + 'Open web app</a>'
    + '</div>'
    + '<a href="' + mobileCta.href + '" class="kygo-nav-mobile-cta' + (mobileCta.dest === 'android' ? ' cta-android' : mobileCta.dest === 'ios' ? ' cta-primary' : '') + '"' + (mobileCta.dest === 'android' ? ' data-action="android-download"' : '') + ' data-kygo-dest="' + mobileCta.dest + '" data-track-position="header" data-track-label="' + mobileCta.track + '"' + (mobileCta.dest === 'web' ? '' : ' target="_blank" rel="noopener"') + '>' + mobileCta.icon + mobileCta.label + '</a>'
    + '<div class="kygo-hamburger" id="kygo-hamburger" onclick="toggleKygoMobile()"><span></span><span></span><span></span></div>'
    + '</div></nav>'
    + '<div class="kygo-mobile-menu" id="kygo-mobile-menu">'
    + '<a href="https://www.kygo.app/how-it-works" onclick="closeKygoMobile()">How It Works</a>'
    + '<a href="https://www.kygo.app/faq" onclick="closeKygoMobile()">FAQ</a>'
    + '<a href="https://www.kygo.app/blog" onclick="closeKygoMobile()">Blog</a>'
    + '<a href="https://www.kygo.app/tools" onclick="closeKygoMobile()">Tools</a>'
    + '<a href="https://www.kygo.app/contact" onclick="closeKygoMobile()">Contact</a>'
    + '<div class="kygo-mobile-cta-group">'
    + '<a href="' + WEB_URL + '" class="kygo-mobile-cta" data-kygo-dest="web" data-track-position="header" data-track-label="header-menu-web">' + globeIcon + 'Open web app</a>'
    + menuStores
    + '</div></div>'
    + '<div class="kygo-nav-spacer"></div>';
  var rootEl = document.getElementById('kygo-header-root');
  if (!rootEl) return;
  rootEl.innerHTML = headerHTML;

  // Same event the in-page <kygo-cta> buttons fire, so header and in-page
  // conversions sit in one report. Never let analytics block a click.
  rootEl.addEventListener('click', function (e) {
    var link = e.target && e.target.closest ? e.target.closest('[data-kygo-dest]') : null;
    if (!link) return;
    try {
      var mp = window.mixpanel;
      if (mp && typeof mp.track === 'function') {
        mp.track('cta_clicked', { slug: 'nav', surface: 'header', destination: link.getAttribute('data-kygo-dest') });
      }
    } catch (err) { /* analytics never blocks navigation */ }
  });
  function syncKygoNavHeight() {
    var nav = document.getElementById('kygo-nav');
    if (!nav) return;
    document.documentElement.style.setProperty('--kygo-nav-h', nav.getBoundingClientRect().height + 'px');
  }
  window.syncKygoNavHeight = syncKygoNavHeight;
  syncKygoNavHeight();
  window.addEventListener('load', syncKygoNavHeight);
  window.addEventListener('resize', syncKygoNavHeight);
  window.addEventListener('orientationchange', syncKygoNavHeight);
  var kygoNavEl = document.getElementById('kygo-nav');
  if (kygoNavEl) kygoNavEl.addEventListener('transitionend', syncKygoNavHeight);
  window.addEventListener('scroll', function() {
    var nav = document.getElementById('kygo-nav');
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    syncKygoNavHeight();
  });
})();
function toggleKygoMobile() {
  if (window.syncKygoNavHeight) window.syncKygoNavHeight();
  var menu = document.getElementById('kygo-mobile-menu');
  var hamburger = document.getElementById('kygo-hamburger');
  menu.classList.toggle('open');
  hamburger.classList.toggle('active');
}
function closeKygoMobile() {
  var menu = document.getElementById('kygo-mobile-menu');
  var hamburger = document.getElementById('kygo-hamburger');
  menu.classList.remove('open');
  hamburger.classList.remove('active');
}
