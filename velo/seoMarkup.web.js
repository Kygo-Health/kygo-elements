// Wix Velo backend file: backend/seoMarkup.web.js (paste into the Wix editor; this repo copy is the
// reference). Serves each component page's generated SEO markup (seo/<tag>.html, rebuilt by the
// "Build SEO markup" GitHub Action) to the page code, which sets it as the custom element's
// seoMarkup during the server render. See docs/seo-markup-poc.md.
import { Permissions, webMethod } from 'wix-web-module';
import { fetch } from 'wix-fetch';

const BASE = 'https://kygo-health.github.io/kygo-elements/seo/';

// page path -> component tag. Regenerate with: node scripts/build-seo-markup.js --map
const PAGES = {
  "/": "kygo-home",
  "/how-it-works": "kygo-hiw",
  "/faq": "kygo-faq-section",
  "/tools": "kygo-tools-page",
  "/contact": "kygo-contact-section",
  "/tools/accuracy-factors": "kygo-accuracy-factors",
  "/tools/calorie-burn-accuracy": "kygo-calorie-burn-accuracy",
  "/tools/calories-in-anything": "calories-in-anything",
  "/tools/deep-sleep-factors": "kygo-deep-sleep-factors",
  "/tools/fitbit-air-vs-whoop-comparison": "kygo-fitbit-air-vs-whoop",
  "/tools/heart-rate-accuracy": "kygo-heart-rate-accuracy",
  "/tools/hrv-factors": "kygo-hrv-factors",
  "/tools/oura-ring-5-vs-4": "kygo-oura-5-vs-4",
  "/tools/oura-ring-comparison-tool": "kygo-oura-ring-comparison",
  "/tools/oura-vs-ringconn": "kygo-oura-vs-ringconn",
  "/tools/recovery-score-explorer": "kygo-recovery-scores",
  "/tools/rem-sleep-factors": "kygo-rem-sleep",
  "/tools/resting-heart-rate-factors": "kygo-rhr-factors",
  "/tools/sensor-comparison": "kygo-sensor-comparison",
  "/tools/sleep-latency-factors": "kygo-sleep-latency-factors",
  "/tools/sleep-metrics": "kygo-sleep-metrics",
  "/tools/sleep-tracker-accuracy": "kygo-sleep-tracker-accuracy",
  "/tools/smart-ring-comparison": "kygo-smart-ring-comparison",
  "/tools/staying-asleep-factors": "kygo-staying-asleep-factors",
  "/tools/step-count-accuracy": "kygo-step-count-accuracy",
  "/tools/stress-factors": "kygo-wearable-stress",
  "/tools/supplements-by-metric": "kygo-supplements-by-metric",
  "/tools/vo2-max-accuracy": "kygo-vo2max-accuracy",
  "/tools/vo2-max-factors": "kygo-vo2max-factors",
  "/tools/wearable-accuracy": "kygo-wearable-accuracy"
  };

export const getSeoMarkup = webMethod(Permissions.Anyone, async (pathOrTag) => {
  // Accepts a page path ('/tools/hrv-factors') or a tag ('kygo-hrv-factors').
  const tag = PAGES[pathOrTag] || (Object.values(PAGES).includes(pathOrTag) ? pathOrTag : null);
  if (!tag) return '';
  try {
    // Never hold the page render hostage: give up after 2 s and serve the page without markup.
    const res = await Promise.race([
      fetch(BASE + tag + '.html', { method: 'get' }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000)),
    ]);
    return res.ok ? await res.text() : '';
  } catch (e) {
    console.error('getSeoMarkup', pathOrTag, e);
    return '';
  }
});
