/**
 * Kygo Health - site footer (global Wix custom code)
 * Loaded by the Body-end embed, which keeps the <style> inline so the
 * bar paints before this file arrives. Editing and pushing this file is the
 * deploy: the embed itself does not need to be re-pasted.
 */
(function(){
// Destinations. The stores keep their Tenjin attribution links; the web app
// carries its own utm set so footer traffic stays separable.
var IOS_URL = 'https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy';
var ANDROID_URL = 'https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO';
var WEB_URL = 'https://app.kygo.app/register?utm_source=kygo.app&utm_medium=footer&utm_campaign=nav';

// Detection only decides which option leads. All three always render, and
// anything unrecognised (or a navigator that throws) falls back to the web
// app, which works everywhere.
var isIOS = false, isAndroid = false;
try {
var ua = (navigator && navigator.userAgent) || '';
var touch = (navigator && navigator.maxTouchPoints) || 0;
isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && touch > 1);
isAndroid = !isIOS && /Android/i.test(ua);
} catch (e) { /* fall back to the web app */ }

var appleIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>';
var androidIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.236a.5.5 0 0 0-.86.508l1.08 1.83a7.504 7.504 0 0 0-11.486 0l1.08-1.83a.5.5 0 0 0-.86-.508L5.28 5.12A7.502 7.502 0 0 0 1.5 11.5h21A7.502 7.502 0 0 0 18.72 5.12l-1.197-2.884zM8.5 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM3.5 13v6.5A2.5 2.5 0 0 0 6 22h1v-9H3.5zm14 0H17v9h1a2.5 2.5 0 0 0 2.5-2.5V13zM7 13v9h4v-9H7zm4 0v9h4v-9h-4zM1 13.5a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5zm19 0a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5z"/></svg>';
var globeIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg>';
var fbIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
var redditIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>';
var xIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';

// One builder for every footer button: the filled one is the visitor's own
// platform, the other two follow as outline buttons.
var TGT = ' target="_blank" rel="noopener"';
function fbtn(href, cls, icon, label, dest, extra) {
return '<a href="' + href + '" class="' + cls + '" data-kygo-dest="' + dest + '" data-track-position="footer" data-track-label="footer-cta-' + dest + '"' + (extra || '') + '>' + icon + label + '</a>';
}
var LEAD = 'kygo-footer-cta-btn', ALT = 'kygo-footer-cta-btn-android';
var AND_EXTRA = ' data-action="android-download"' + TGT;
var web = function (c, l) { return fbtn(WEB_URL, c, globeIcon, l, 'web'); };
var ios = function (c, l) { return fbtn(IOS_URL, c + ' cta-primary', appleIcon, l, 'ios', TGT); };
var and = function (c, l) { return fbtn(ANDROID_URL, c + ' cta-android', androidIcon, l, 'android', AND_EXTRA); };
var ctaPrimary = isIOS ? ios(LEAD, 'Get the iPhone app') : isAndroid ? and(LEAD, 'Get the Android app') : web(LEAD, 'Open web app');
var ctaAlts = isIOS ? and(ALT, 'Android') + web(ALT, 'Web')
: isAndroid ? ios(ALT, 'iPhone') + web(ALT, 'Web')
: ios(ALT, 'iPhone') + and(ALT, 'Android');

var subscribeStrip = '<div class="kygo-footer-sub"><div class="kygo-footer-sub-inner">'
+ '<div class="kygo-footer-sub-copy"><strong>Get research-backed insights, straight to your inbox - 1 email a month</strong></div>'
+ '<form class="kygo-footer-sub-form" id="kygo-footer-sub-form" novalidate>'
+ '<input type="email" required placeholder="you@email.com" aria-label="Email address" autocomplete="email" />'
+ '<button type="submit">Subscribe</button>'
+ '</form></div>'
+ '<div class="kygo-footer-sub-trust"><span>No spam</span><span>Unsubscribe anytime</span></div>'
+ '<div class="kygo-footer-sub-msg" id="kygo-footer-sub-msg" role="status" aria-live="polite"></div></div>';
var footerHTML = '<footer class="kygo-footer"><div class="kygo-footer-inner">' + subscribeStrip + '<div class="kygo-footer-top">'
+ '<div class="kygo-footer-brand"><a href="https://www.kygo.app/" class="kygo-footer-logo"><img src="https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png" alt="Kygo Health" /><span>KYGO</span></a>'
+ '<div class="kygo-footer-socials"><a href="https://www.facebook.com/profile.php?id=61586603470107" target="_blank" rel="noopener" aria-label="Facebook">' + fbIcon + '</a><a href="https://www.reddit.com/user/KygoApp/" target="_blank" rel="noopener" aria-label="Reddit">' + redditIcon + '</a><a href="https://x.com/KygoApp" target="_blank" rel="noopener" aria-label="X (Twitter)">' + xIcon + '</a></div>'
+ '<div class="kygo-footer-contact"><p>Jersey City, NJ</p><p><a href="mailto:info@kygo.app">info@kygo.app</a></p></div></div>'
+ '<div class="kygo-footer-column"><h4>Product</h4><ul><li><a href="https://www.kygo.app/how-it-works">How It Works</a></li><li><a href="https://www.kygo.app/faq">FAQ</a></li><li><a href="' + WEB_URL + '" data-kygo-dest="web" data-track-position="footer" data-track-label="footer-link-web">Web app</a></li><li><a href="' + IOS_URL + '" class="cta-primary" data-kygo-dest="ios" data-track-position="footer" data-track-label="footer-link-ios" target="_blank" rel="noopener">iPhone app</a></li><li><a href="' + ANDROID_URL + '" class="cta-android" data-action="android-download" data-kygo-dest="android" data-track-position="footer" data-track-label="footer-link-android" target="_blank" rel="noopener">Android app</a></li></ul></div>'
+ '<div class="kygo-footer-column"><h4>Resources</h4><ul><li><a href="https://www.kygo.app/blog">Blog</a></li><li><a href="https://www.kygo.app/tools">Tools</a></li><li><a href="https://www.kygo.app/contact">Contact</a></li></ul></div>'
+ '<div class="kygo-footer-column"><div class="kygo-footer-cta"><p>One account covers web, iPhone, and Android</p><div class="kygo-footer-cta-buttons">'
+ ctaPrimary
+ '<div class="kygo-footer-cta-alts">' + ctaAlts + '</div>'
+ '</div></div></div>'
+ '</div><div class="kygo-footer-divider"></div><div class="kygo-footer-bottom"><div class="kygo-footer-legal-links"><a href="https://www.kygo.app/privacy-policy">Privacy Policy</a><a href="https://www.kygo.app/terms-conditions">Terms of Service</a><a href="https://www.kygo.app/consumer-health-data">Consumer Health Data Privacy Policy</a><a href="https://www.kygo.app/accessibility-statement">Accessibility</a></div><div class="kygo-footer-disclaimer"><p>&copy; 2026 by KYGO Health LLC. Kygo Health LLC is not intended to diagnose, treat, cure, or prevent any disease. The information provided is for educational purposes only and is not a substitute for professional medical advice. Consult your physician before making any health decisions.</p></div></div></div></footer>';
var rootEl = document.getElementById('kygo-footer-root');
if (!rootEl) return;
rootEl.innerHTML = footerHTML;

// Same event the in-page CTAs fire, so footer conversions land in one report.
rootEl.addEventListener('click', function (e) {
var link = e.target && e.target.closest ? e.target.closest('[data-kygo-dest]') : null;
if (!link) return;
try {
var mp = window.mixpanel;
if (mp && typeof mp.track === 'function') {
mp.track('cta_clicked', { slug: 'nav', surface: 'footer', destination: link.getAttribute('data-kygo-dest') });
}
} catch (err) { /* analytics never blocks navigation */ }
});

var subForm = document.getElementById('kygo-footer-sub-form');
if (subForm) {
subForm.addEventListener('submit', function (e) {
e.preventDefault();
var input = subForm.querySelector('input');
var btn = subForm.querySelector('button');
var msg = document.getElementById('kygo-footer-sub-msg');
var email = (input.value || '').trim();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.className = 'kygo-footer-sub-msg error'; msg.textContent = 'Please enter a valid email.'; return; }
input.disabled = true; btn.disabled = true; msg.className = 'kygo-footer-sub-msg'; msg.textContent = '';
var settled = false;
var timeout = setTimeout(function () { if (settled) return; settled = true; input.disabled = false; btn.disabled = false; msg.className = 'kygo-footer-sub-msg error'; msg.textContent = "Hmm, that didn't go through. Please try again."; }, 10000);
fetch('/_functions/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, source: 'footer' }) }).then(function (res) {
if (settled) return; settled = true; clearTimeout(timeout);
if (res && res.ok) { subForm.style.display = 'none'; msg.className = 'kygo-footer-sub-msg success'; msg.textContent = "You're in. New insights are on the way."; document.dispatchEvent(new CustomEvent('subscribe', { bubbles: true, composed: true, detail: { email: email, source: 'footer' } })); }
else { input.disabled = false; btn.disabled = false; msg.className = 'kygo-footer-sub-msg error'; msg.textContent = "Hmm, that didn't go through. Please try again."; }
}).catch(function () { if (settled) return; settled = true; clearTimeout(timeout); input.disabled = false; btn.disabled = false; msg.className = 'kygo-footer-sub-msg error'; msg.textContent = "Hmm, that didn't go through. Please try again."; });
});
}
})();
