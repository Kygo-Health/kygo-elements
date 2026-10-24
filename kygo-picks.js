/**
 * Kygo Health - Best Wearables (Kygo Picks) Custom Element for Wix
 * Tag name: kygo-picks
 * Live page: https://www.kygo.app/best-wearables  (page="wearables", the default)
 * Second page, not live yet: page="improve" (Improve your numbers). Links to it stay hidden
 * until the element gets the `improve-live` attribute.
 *
 * Buying guide, not a tool. "Best for you" roll-ups (sleep, training, iPhone, Android, no
 * subscription) then 11 metric sections; each shows a winner card plus 3 runners-up. Cards show
 * the CURRENT model to buy, with "Tested on <older model>" where the study used an older one.
 *
 * Amazon: each product has an ASIN; buy links are amazon.com/dp/<ASIN>?tag=kygohealthapp-20.
 * Live titles/images come from the Wix backend GET /_functions/amazonPicks (Creators API,
 * backend/http-functions.js, secrets AMZ_CREATOR_ID / AMZ_CREATOR_SECRET). Keep the ASIN list
 * there in sync with _products. If the feed fails, brand logos + direct links are shown.
 * Click tracking: none here; kygo-tracking.js logs Amazon clicks (cta_click affiliate_amazon).
 *
 * Sources of truth: every wearable pick restates a finding already shown on
 * kygo-wearable-accuracy (v2, 13 Oct 2026), which cites Kygo Research Library
 * docs 20, 24, 15, 09, 05 and 36. Do not add a pick whose reason is not in
 * that tool or a canonical library doc.
 *
 * Data: embedded in get _groups(). A `picks` attribute holding the same JSON
 * shape overrides it, so Wix page code can feed the CMS collection in later.
 * Sections with status 'draft' render only when the `preview` attribute is set.
 *
 * Affiliate rules: Amazon links carry tag=kygohealthapp-20; no prices are
 * shown (Associates rule); every outbound product link is
 * rel="sponsored nofollow noopener". Sponsored cards sit below the ranked
 * picks of a section, never inside them.
 */

function __seo(el, text) {
  if (el.querySelector('[data-seo]')) return;
  const d = document.createElement('div');
  d.setAttribute('data-seo', '');
  d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
  d.textContent = text;
  el.appendChild(d);
}

function __ensureKygoCta() {
  if (customElements.get('kygo-cta')) return;
  if (document.querySelector('script[data-kygo-cta-loader]')) return;
  const s = document.createElement('script');
  s.src = 'https://kygo-health.github.io/kygo-elements/kygo-cta.js';
  s.setAttribute('data-kygo-cta-loader', '');
  s.async = true;
  document.head.appendChild(s);
}

const KY_AMZ_TAG = 'kygohealthapp-20';

class KygoPicks extends HTMLElement {
  static get observedAttributes() { return ['picks', 'preview', 'page']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._observer = null;
    this._spy = null;
    this._wired = false;
    this._active = null;
  }

  connectedCallback() {
    __ensureKygoCta();
    this.render();
    this._wire();
    this._setupAnimations();
    this._setupScrollSpy();
    this._injectStructuredData();
    __seo(this, this._seoText());
    this._loadAmazon();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    if (this._spy) this._spy.disconnect();
  }

  attributeChangedCallback(name, oldV, newV) {
    if (oldV === newV || !this.isConnected) return;
    this.render();
    this._setupAnimations();
    this._setupScrollSpy();
  }

  // ── Helpers ───────────────────────────────────────────────────────────

  _img(id) {
    return (window.__KY_IMG || {})[id] || 'https://static.wixstatic.com/media/' + id + '~mv2.png';
  }

  // Direct product link. Works with or without the Creators API feed.
  _dp(asin) { return 'https://www.amazon.com/dp/' + asin + '?tag=' + KY_AMZ_TAG; }

  // Live Amazon data from the Wix backend (/_functions/amazonPicks): { ASIN: { title, image, url } }.
  get _feedUrl() { return this.getAttribute('amazon-feed') || '/_functions/amazonPicks'; }

  async _loadAmazon() {
    if (this._amzLoaded || this.hasAttribute('no-feed')) return;
    this._amzLoaded = true;
    try {
      const res = await fetch(this._feedUrl, { credentials: 'omit' });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.items && Object.keys(data.items).length) {
        this._amzData = data.items;
        this.render();
        this._setupAnimations();
        this._setupScrollSpy();
      }
    } catch (e) { /* keep static fallback */ }
  }

  _amz(query, extra) {
    return 'https://www.amazon.com/s?k=' + encodeURIComponent(query) + (extra || '') + '&tag=' + KY_AMZ_TAG;
  }

  _esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  get _preview() { return this.hasAttribute('preview'); }

  get _updated() { return { page: 'Oct 2026', iso: '2026-10-15' }; }

  // ── Data: products ────────────────────────────────────────────────────
  // One entry per product. `img` is a Wix media id. `link` is the outbound
  // URL; `store` says who sells it. Creators API data replaces img and title
  // for Amazon items once the Wix backend job is live.

  get _products() {
    return {
      // current: the model we point buyers to today. Rankings come from the tested model on each pick.
      'apple-watch': { name: 'Apple Watch', current: 'Apple Watch Series 12', asin: 'B0HJ9YNRW7', img: '273a63_68b4900c356b4d0c8982e5ecd10f04fe', store: 'amazon' },
      'apple-ultra': { name: 'Apple Watch', current: 'Apple Watch Ultra 4', asin: 'B0HJB6C34Y', img: '273a63_68b4900c356b4d0c8982e5ecd10f04fe', store: 'amazon' },
      'oura': { name: 'Oura Ring', current: 'Oura Ring 5', asin: 'B0GRJVBPH3', img: '273a63_722e50e1a554453eb4c71a2e7a58925d', store: 'amazon' },
      'garmin': { name: 'Garmin', current: 'Garmin Forerunner 970', asin: 'B0F8QWPVNK', img: '273a63_c545c093c04d4ca4ade77e5ca43fd433', store: 'amazon' },
      'whoop': { name: 'WHOOP', current: 'WHOOP 5.0', asin: 'B0FPML7DJC', img: '273a63_c52aaaca1f7243f3818cf51d9374dbd4', store: 'amazon' },
      'fitbit': { name: 'Fitbit / Google', current: 'Google Pixel Watch 5', asin: 'B0H7X38W5B', img: '273a63_c12bab319dc34737a386c7449f5f92c7', store: 'amazon' },
      'samsung': { name: 'Samsung Galaxy Watch', current: 'Samsung Galaxy Watch 9', asin: 'B0H1DG7XRW', img: '273a63_21fd42e4a5d1459bb6db751a0ea5e161', store: 'amazon' },
      'polar': { name: 'Polar', current: 'Polar Grit X2 Pro', asin: 'B0CXHJRWN9', img: '', store: 'amazon' }
    };
  }

  // ── Data: groups and sections (order = page order) ────────────────────
  // pick: { product, model, badge, reason, catch, source, funded? }
  // noPick: shown instead of cards when no device earns a pick.

  get _groups() {
    const attr = this.getAttribute('picks');
    if (attr) { try { return JSON.parse(attr); } catch (e) { /* fall back to embedded */ } }
    const accTool = { label: 'Full ranking: Most Accurate Wearable', url: 'https://www.kygo.app/tools/wearable-accuracy' };
    const sleepTool = { label: 'Full ranking: Sleep Tracker Accuracy', url: 'https://www.kygo.app/tools/sleep-tracker-accuracy' };
    const hrTool = { label: 'Full ranking: Heart Rate Accuracy', url: 'https://www.kygo.app/tools/heart-rate-accuracy' };
    const amz = q => 'https://www.amazon.com/s?k=' + encodeURIComponent(q) + '&tag=' + KY_AMZ_TAG;
    return [
      { id: 'best-for', page: 'wearables', label: 'Best for you', kicker: 'Best for', pickLabel: 'Our pick', heading: 'Best for you',
        lede: 'Our pick for each kind of buyer, rolled up from the 10 metric rankings below.',
        sections: [
          { id: 'best-sleep', nav: 'Sleep', icon: 'moon', title: 'Sleep and recovery', lede: 'Sleep stages, sleep timing, HRV and resting heart rate.', tool: accTool, picks: [
              { product: 'oura', rank: 1, stat: '4 of 4', statLabel: 'sleep and recovery metrics won', reason: 'First for sleep stages, sleep timing, HRV and resting heart rate.', catch: 'Needs a membership, and has no screen for workouts.', source: 'Kygo roll-up of the rankings below' },
              { product: 'whoop', rank: 2, stat: '2nd', statLabel: 'for HRV, 3rd for resting HR', reason: 'Close behind Oura on overnight recovery numbers.', catch: 'Membership only, no screen.', source: 'Kygo roll-up of the rankings below' },
              { product: 'fitbit', rank: 3, stat: '2nd', statLabel: 'for sleep timing, 3rd for sleep stages', reason: 'The best watch for sleep in our rankings.', catch: 'Needs charging about every day or two.', source: 'Kygo roll-up of the rankings below' },
              { product: 'apple-watch', rank: 4, stat: '2nd', statLabel: 'for sleep stages', reason: 'Strong sleep staging for an all-day watch.', catch: 'Daily charging makes overnight wear harder.', source: 'Kygo roll-up of the rankings below' }
            ] },
          { id: 'best-training', nav: 'Training', icon: 'activity', title: 'Running and training', lede: 'Workout heart rate, VO2 max and steps.', tool: hrTool, picks: [
              { product: 'garmin', rank: 1, stat: '1st', statLabel: 'for VO2 max and steps, 2nd for workout HR', reason: 'Top or near the top on every training metric we rank.', catch: 'Sleep tracking trails Oura and Apple.', source: 'Kygo roll-up of the rankings below' },
              { product: 'apple-ultra', rank: 2, stat: '1st', statLabel: 'for workout heart rate', reason: 'Most accurate heart rate during exercise.', catch: 'iPhone only.', source: 'Kygo roll-up of the rankings below' },
              { product: 'fitbit', rank: 3, stat: '2nd', statLabel: 'for VO2 max', reason: 'Solid fitness estimates on a smartwatch.', catch: 'Fewer training tools than Garmin.', source: 'Kygo roll-up of the rankings below' },
              { product: 'polar', rank: 4, stat: '2nd', statLabel: 'for resting heart rate', reason: 'Training-focused brand with accurate resting HR.', catch: 'Fewer independent tests than the others.', source: 'Kygo roll-up of the rankings below' }
            ] },
          { id: 'best-iphone', nav: 'iPhone', icon: 'heart', title: 'iPhone users', lede: 'The most accurate all-round watch for iPhone.', tool: accTool, picks: [
              { product: 'apple-watch', rank: 1, stat: '7 of 10', statLabel: 'metrics on the podium, the most of any brand', reason: 'First for workout heart rate and blood oxygen, top three on most others.', catch: 'Only works with iPhone. Daily charging.', source: 'Kygo roll-up of the rankings below' },
              { product: 'oura', rank: 2, stat: '4 of 10', statLabel: 'metrics won, the most 1st places', reason: 'Pair with any phone for the best sleep data.', catch: 'Needs a membership.', source: 'Kygo roll-up of the rankings below' },
              { product: 'garmin', rank: 3, stat: '5 of 10', statLabel: 'metrics on the podium', reason: 'Best for training, works with iPhone.', catch: 'Fewer smart features than Apple.', source: 'Kygo roll-up of the rankings below' },
              { product: 'whoop', rank: 4, stat: '3 of 10', statLabel: 'metrics on the podium', reason: 'Screenless recovery strap.', catch: 'Membership only.', source: 'Kygo roll-up of the rankings below' }
            ] },
          { id: 'best-android', nav: 'Android', icon: 'heart', title: 'Android users', lede: 'The most accurate all-round watch for Android.', tool: accTool, picks: [
              { product: 'fitbit', rank: 1, stat: '6 of 10', statLabel: 'metrics on the podium, most of any Android watch', reason: 'First for calories and breathing rate, top three on sleep and VO2 max.', catch: 'Needs charging about every day or two.', source: 'Kygo roll-up of the rankings below' },
              { product: 'garmin', rank: 2, stat: '5 of 10', statLabel: 'metrics on the podium', reason: 'Best for training, works with any phone.', catch: 'Sleep tracking trails the leaders.', source: 'Kygo roll-up of the rankings below' },
              { product: 'oura', rank: 3, stat: '4 of 10', statLabel: 'metrics won, the most 1st places', reason: 'Best sleep data, works with Android.', catch: 'A ring, not a watch. Needs a membership.', source: 'Kygo roll-up of the rankings below' },
              { product: 'samsung', rank: 4, stat: '3 of 10', statLabel: 'metrics on the podium', reason: 'Second for blood oxygen and calories.', catch: 'Some health features need a Samsung phone.', source: 'Kygo roll-up of the rankings below' }
            ] },
          { id: 'best-no-sub', nav: 'No subscription', icon: 'pulse', title: 'No subscription, any phone', lede: 'Full data without a monthly fee.', tool: accTool, picks: [
              { product: 'garmin', rank: 1, stat: '5 of 10', statLabel: 'metrics on the podium, no membership', reason: 'Works with iPhone and Android, and every metric is free.', catch: 'Sleep tracking trails Oura and Apple.', source: 'Kygo roll-up of the rankings below' },
              { product: 'apple-watch', rank: 2, stat: '7 of 10', statLabel: 'metrics on the podium', reason: 'The most accurate overall, with no fee.', catch: 'iPhone only.', source: 'Kygo roll-up of the rankings below' },
              { product: 'fitbit', rank: 3, stat: '6 of 10', statLabel: 'metrics on the podium', reason: 'Strong all-round accuracy on Android.', catch: 'Check which insights need a paid plan.', source: 'Kygo roll-up of the rankings below' },
              { product: 'samsung', rank: 4, stat: '3 of 10', statLabel: 'metrics on the podium', reason: 'No fee for core health tracking.', catch: 'Some features need a Samsung phone.', source: 'Kygo roll-up of the rankings below' }
            ], note: 'Oura and WHOOP need a paid membership.' }
        ] },
      { id: 'wearables', label: 'By metric', kicker: 'Most accurate for', heading: 'Wearables, by metric',
        lede: 'Oura wins what is measured overnight at rest. Apple, Garmin and Fitbit split the daytime metrics. Each section ranks brands on published validation studies.',
        sections: [
          { id: 'sleep-stages', nav: 'Sleep stages', icon: 'moon', title: 'Sleep stages', confidence: 'High for 1st, medium for 2nd and 3rd',
            lede: 'Light, deep and REM, against a lab sleep study.',
            tool: sleepTool,
            picks: [
              { product: 'oura', rank: 1, badge: 'Best for sleep stages', stat: '0.65', statLabel: 'agreement with a sleep lab (0 to 1)',
                reason: 'Best at telling light, deep and REM apart, and caught the most deep sleep (64%).',
                catch: 'The top score is from an Oura-funded study, but an independent test also put Oura first.', source: 'Robbins 2024 (Oura-funded); Svensson 2024', model: 'Ring 3' },
              { product: 'apple-watch', rank: 2, badge: 'Best at catching REM', stat: '0.60', statLabel: 'agreement with a sleep lab (0 to 1)',
                reason: 'Caught the most REM sleep of any device (83%).',
                catch: 'Caught only about half of deep sleep. Ranked in the same Oura-funded study.', source: 'Robbins 2024 (Oura-funded)', model: 'Series 8' },
              { product: 'fitbit', rank: 3, badge: 'Balanced on deep and REM', stat: '0.55', statLabel: 'agreement with a sleep lab (0 to 1)',
                reason: 'Caught 62% of deep sleep and 68% of REM.',
                catch: 'Ranked in the same Oura-funded study as Oura and Apple.', source: 'Robbins 2024 (Oura-funded)', model: 'Sense 2' },
              { product: 'whoop', rank: 4, stat: '0.44', statLabel: 'agreement with a sleep lab (0 to 1)', reason: 'Caught 62% of deep sleep, close to the top three.', catch: 'Older model, and the lab receives WHOOP support.', source: 'Miller 2022', model: '3.0' }
            ] },
          { id: 'sleep-timing', nav: 'Sleep timing', icon: 'moon', title: 'Sleep and wake time', confidence: 'High for 1st, medium for 2nd and 3rd',
            lede: 'Catching the time you lie awake.',
            tool: sleepTool,
            picks: [
              { product: 'oura', rank: 1, badge: 'Best for total sleep', stat: '73%', statLabel: 'of time awake caught',
                reason: 'Total sleep within 2 minutes of the lab, and caught the most time awake.',
                catch: 'From an Oura-funded study of 96 adults.', source: 'Svensson 2024 (Oura-funded)', model: 'Ring 3' },
              { product: 'fitbit', rank: 2, badge: 'Close second', stat: '68%', statLabel: 'of time awake caught',
                reason: 'Total sleep within 3 minutes of the lab. Beat Apple on five of six timing measures.',
                catch: 'From the same Oura-funded study.', source: 'Robbins 2024 (Oura-funded)', model: 'Sense 2' },
              { product: 'apple-watch', rank: 3, badge: 'Third', stat: '52%', statLabel: 'of time awake caught',
                reason: 'Total sleep within 8 minutes of the lab.',
                catch: 'Misses about half the time you lie awake, so it overstates how much you slept.', source: 'Robbins 2024 (Oura-funded)', model: 'Series 8' },
              { product: 'whoop', rank: 4, stat: '56%', statLabel: 'of time awake caught', reason: 'Total sleep 12 minutes under the lab.', catch: 'Older model, and the lab receives WHOOP support.', source: 'Miller 2022', model: '3.0' }
            ] },
          { id: 'hrv', nav: 'HRV', icon: 'pulse', title: 'HRV', confidence: 'High',
            lede: 'Overnight HRV against a chest-strap ECG.',
            tool: accTool,
            picks: [
              { product: 'oura', rank: 1, badge: 'Best for HRV', stat: '0.99', statLabel: 'agreement with ECG (1 is perfect)',
                reason: 'Matched a chest-strap ECG almost perfectly overnight, about 6% error.',
                catch: 'Membership required.', source: 'Dial 2025, independent', model: 'Ring 4' },
              { product: 'whoop', rank: 2, badge: 'Close second', stat: '0.94', statLabel: 'agreement with ECG (1 is perfect)',
                reason: 'About 8% error in the same study.',
                catch: 'Membership required.', source: 'Dial 2025, independent', model: '4.0' },
              { product: 'garmin', rank: 3, badge: 'Third', stat: '0.87', statLabel: 'agreement with ECG (1 is perfect)',
                reason: 'About 11% error in the same study.',
                catch: 'Clearly behind Oura and WHOOP overnight.', source: 'Dial 2025, independent', model: 'Fenix 6' },
              { product: 'polar', rank: 4, stat: '0.82', statLabel: 'agreement with ECG (1 is perfect)', reason: 'About 16% error in the same study.', catch: 'Only the first 4 hours of sleep were tested.', source: 'Dial 2025, independent', model: 'Grit X Pro' }
            ] },
          { id: 'rhr', nav: 'Resting HR', icon: 'heart', title: 'Resting heart rate', confidence: 'Medium',
            lede: 'The easiest number to get right.',
            tool: accTool,
            picks: [
              { product: 'oura', rank: 1, badge: 'Best for resting HR', stat: '1.1 bpm', statLabel: 'typical error overnight',
                reason: 'Closest to a chest-strap ECG overnight, about 2% error.',
                catch: 'Membership required.', source: 'Dial 2025, independent', model: 'Ring 4' },
              { product: 'polar', rank: 2, badge: 'Close second', stat: '2.7%', statLabel: 'error overnight',
                reason: 'Close behind in the same study, over the first 4 hours of sleep.',
                catch: 'Only the first 4 hours of sleep were tested.', source: 'Dial 2025, independent', model: 'Grit X Pro' },
              { product: 'whoop', rank: 3, badge: 'Third', stat: '1.8 bpm', statLabel: 'typical error overnight',
                reason: 'About 3% error in the same study.',
                catch: 'Within noise of Polar. Membership required.', source: 'Dial 2025, independent', model: '4.0' },
              { product: 'apple-watch', rank: 4, stat: '3.7 bpm', statLabel: 'typical error', reason: 'About 6% error.', catch: 'Measured lying down in the morning, not overnight.', source: "O'Grady 2024", model: 'Series 9 / Ultra 2' }
            ] },
          { id: 'exercise-hr', nav: 'Exercise HR', icon: 'activity', title: 'Exercise heart rate', confidence: 'Medium',
            lede: 'Against a chest strap during workouts.',
            tool: hrTool,
            picks: [
              { product: 'apple-watch', rank: 1, badge: 'Best for exercise HR', stat: '2.5 bpm', statLabel: 'typical error, 4-watch cycling test',
                reason: 'Most accurate in a head-to-head cycling test, with near-zero bias across 22 studies.',
                catch: 'Its lead over Garmin and Fitbit is small.', source: 'Kostrna 2026; Lambe 2026', model: 'Series 8' },
              { product: 'garmin', rank: 2, badge: 'Close second', stat: '2.9 bpm', statLabel: 'typical error, 4-watch cycling test',
                reason: 'Close behind in the same cycling test, and top tier in a 10-device test.',
                catch: 'Some models dropped 20 to 50% of readings in other tests.', source: 'Kostrna 2026; Gielen 2026', model: 'Forerunner 955' },
              { product: 'fitbit', rank: 3, badge: 'Third', stat: '3.9 bpm', statLabel: 'typical error, 4-watch cycling test',
                reason: 'Third in the cycling test. The Charge 6 topped a separate 10-device test.',
                catch: 'Model matters: the Inspire 3 was 16.5% off in that same test.', source: 'Kostrna 2026; Gielen 2026', model: 'Sense 2' },
              { product: 'samsung', rank: 4, stat: '3.4 bpm', statLabel: 'typical error, 4-watch cycling test', reason: 'Fourth in the same cycling test.', catch: 'Its best result came from heart patients on a stress test.', source: 'Kostrna 2026', model: 'Galaxy Watch 5' }
            ] },
          { id: 'spo2', nav: 'SpO2', icon: 'drop', title: 'Blood oxygen', confidence: 'High for 1st, medium after',
            lede: 'Against a medical reference.',
            tool: accTool,
            picks: [
              { product: 'apple-watch', rank: 1, badge: 'Best for SpO2', stat: '2.2', statLabel: 'points off, low-oxygen lab test',
                reason: 'Smallest error in a low-oxygen lab test, with near-zero bias across 9 studies.',
                catch: 'Like every watch, it struggles when oxygen is truly low.', source: 'Walzel 2023; Lambe 2026', model: 'Series 8' },
              { product: 'samsung', rank: 2, badge: 'Passes the standard', stat: '3.8', statLabel: 'points off, same lab test',
                reason: 'Passed the standard in the same lab test.',
                catch: 'Read about 2.6 points low.', source: 'Walzel 2023', model: 'Galaxy Watch 5' },
              { product: 'garmin', rank: 3, badge: 'Third', stat: '3.5', statLabel: 'points off arterial blood, hospital patients',
                reason: 'Within the standard against arterial blood in hospital patients.',
                catch: 'Read 2.7 points low, and failed a finger-oximeter comparison.', source: 'Hospital study, 109 patients', model: 'Fenix 6 Pro' }
            ] },
          { id: 'steps', nav: 'Steps', icon: 'steps', title: 'Steps', confidence: 'Medium',
            lede: 'Daily life, against a research step counter.',
            tool: { label: 'Full ranking: Step Count Accuracy', url: 'https://www.kygo.app/tools/step-count-accuracy' },
            picks: [
              { product: 'garmin', rank: 1, badge: 'Best for steps', stat: '+3%', statLabel: 'over, daily life (59 studies pooled)',
                reason: 'Closest step count in daily life across 59 studies.',
                catch: 'Results vary by model in the lab, from 1 to 5%.', source: 'Paluch 2026', model: 'Several models' },
              { product: 'apple-watch', rank: 2, badge: 'Close second', stat: '+7%', statLabel: 'over, daily life (59 studies pooled)',
                reason: 'Second in the same pooled analysis.',
                catch: 'Undercounts very slow walking.', source: 'Paluch 2026; Rowe 2025', model: 'Several models' },
              { product: 'samsung', rank: 3, badge: 'Third', stat: '10.5%', statLabel: 'error, daily life (one study)',
                reason: 'Third, from a single daily-life study.',
                catch: 'Only one daily-life study, so less certain.', source: 'Hong 2024', model: 'Galaxy Watch 4' },
              { product: 'fitbit', rank: 4, stat: '+15%', statLabel: 'over, daily life (59 studies pooled)', reason: 'Overcounts steps in daily life.', catch: 'Single studies found up to 26% off.', source: 'Paluch 2026', model: 'Several models' }
            ] },
          { id: 'vo2max', nav: 'VO2 max', icon: 'lungs', title: 'VO2 max', confidence: 'High for 1st, medium after',
            lede: 'Against a lab treadmill test.',
            tool: accTool,
            picks: [
              { product: 'garmin', rank: 1, badge: 'Best for VO2 max', stat: '6.7%', statLabel: 'error vs a lab test',
                reason: 'Most accurate VO2 max, for runners using a chest strap.',
                catch: 'Wrist-only it was far worse in one study of older women.', source: 'Engel 2026; Carrier 2025', model: 'Forerunner 245' },
              { product: 'fitbit', rank: 2, badge: 'Second', stat: '8.7%', statLabel: 'error vs a lab test',
                reason: 'Second, from a Pixel Watch 3 test.',
                catch: 'That test was linked to Google.', source: 'Pixel Watch 3 study (Google-linked)', model: 'Pixel Watch 3' },
              { product: 'apple-watch', rank: 3, badge: 'Third', stat: '13%', statLabel: 'error vs a lab test',
                reason: 'Third. Reads low in every independent test.',
                catch: 'Underestimates most in fit women.', source: 'Lambe 2026; Caserman 2024', model: 'Series 10' }
            ] },
          { id: 'calories', nav: 'Calories', icon: 'flame', title: 'Calories burned', confidence: 'Medium',
            lede: 'Every brand is 10%+ off. Use it as a trend.',
            tool: { label: 'Check your own: Calorie Burn Accuracy', url: 'https://www.kygo.app/tools/calorie-burn-accuracy' },
            picks: [
              { product: 'fitbit', rank: 1, badge: 'Least wrong on calories', stat: '14%', statLabel: 'error, max treadmill test',
                reason: 'Closest overall across three head-to-head lab tests.',
                catch: 'Still 32 to 42% off on cycling and weights.', source: 'Kostrna 2026; Yun 2026; Lee 2026', model: 'Charge 6' },
              { product: 'samsung', rank: 2, badge: 'Second', stat: '9.4%', statLabel: 'error, max treadmill test',
                reason: 'Best on the treadmill test.',
                catch: 'Read 83% high on weight training.', source: 'Kostrna 2026; Lee 2026', model: 'Galaxy Watch 7' },
              { product: 'apple-watch', rank: 3, badge: 'Third', stat: '26%', statLabel: 'error, max treadmill test',
                reason: 'Third overall.',
                catch: 'Read 112% high on weight training.', source: 'Kostrna 2026; Yun 2026', model: 'Ultra 2' },
              { product: 'garmin', rank: 4, stat: '14.7%', statLabel: 'error, max treadmill test', reason: 'Close on the treadmill test.', catch: 'Read 116% high on weight training.', source: 'Kostrna 2026; Yun 2026', model: 'Forerunner 265S' }
            ] },
          { id: 'breathing', nav: 'Breathing', icon: 'lungs', title: 'Breathing rate', confidence: 'Low',
            lede: 'Few tests, so treat this one loosely.',
            tool: accTool,
            picks: [
              { product: 'fitbit', rank: 1, badge: 'Best for breathing rate', stat: '0.3 to 1.0', statLabel: 'breaths a minute off',
                reason: 'Closest in an independent overnight test.',
                catch: 'Only the older Charge 4 was tested.', source: 'Hermans 2024', model: 'Charge 4' },
              { product: 'whoop', rank: 2, badge: 'Second', stat: '0.1', statLabel: 'breaths a minute off',
                reason: 'Close against sleep-lab belts.',
                catch: 'WHOOP-funded study on the older 2.0 strap.', source: 'Berryhill 2020 (WHOOP-funded)', model: 'Strap 2.0' }
            ],
            note: 'No third place: Garmin failed in hospital patients and Apple gave no readings.' },
          { id: 'skin-temp', nav: 'Skin temp', icon: 'temp', title: 'Skin temperature',
            lede: 'No independent tests yet.',
            tool: accTool,
            picks: [],
            noPick: 'Not ranked. No brand has an independent test of its temperature sensor against a thermometer.' }
        ] },
      { id: 'improve', label: 'Improve your numbers', heading: 'Improve your numbers',
        lede: 'What moves each number, from our factor research. The biggest levers are usually free, so they come first. Then the few things worth buying, and what to skip.',
        sections: [
          { id: 'deep-sleep', nav: 'Deep sleep', icon: 'moon', title: 'Get more deep sleep',
            lede: 'Deep sleep is when most physical repair happens, and it falls with age.',
            tool: { label: 'All factors: Deep Sleep Factor Explorer', url: 'https://www.kygo.app/tools/deep-sleep-factors' },
            levers: [
              { stat: '+33%', label: 'deep sleep the night after moderate cardio', grade: 'Moderate' },
              { stat: '−30 min', label: 'deep sleep from 400 mg caffeine 4 hours before bed', neg: true, grade: 'Strong' },
              { stat: 'No gain', label: 'from alcohol: more deep sleep early, a wrecked second half', neg: true, grade: 'Strong' }
            ],
            buys: [
              { name: 'Cooling mattress topper', icon: 'bed', grade: 'Strong', stat: '+7.5 min', statLabel: 'deep sleep a night',
                reason: 'Helping your body shed heat added deep sleep every night in a 72-person study.',
                catch: 'It did not help people fall asleep faster.', source: 'Herberger 2024; Pasquier 2025', q: 'cooling mattress topper' },
              { name: 'Foam earplugs', icon: 'ear', grade: 'Strong', stat: '23 min', statLabel: 'deep sleep a night lost to noise',
                reason: 'Earplugs prevented nearly all of that loss.',
                catch: 'They stopped working at very loud levels (65 dBA).', source: 'Basner 2026', q: 'foam earplugs sleep' },
              { name: 'Magnesium L-threonate', icon: 'pill', grade: 'Moderate', stat: '2 of 3', statLabel: 'trials raised Oura-tracked deep sleep',
                reason: 'The one magnesium form with deep sleep trials.',
                catch: 'Manufacturer-funded, and one trial found no measured change.', source: 'Hausenblas 2024', q: 'magnesium l-threonate' },
              { name: 'Glycine (3 g)', icon: 'pill', grade: 'Moderate', stat: 'Faster', statLabel: 'into deep sleep',
                reason: 'Taken before bed, it got people into deep sleep sooner.',
                catch: 'It did not add more deep sleep. 11-person study.', source: 'Yamadera 2007', q: 'glycine powder' }
            ],
            skip: [
              { name: 'White or pink noise machines', why: 'cut REM by 19 minutes' },
              { name: 'Tart cherry juice', why: 'one 8-person study, total sleep only' }
            ] },
          { id: 'fall-asleep', nav: 'Fall asleep', icon: 'moon', title: 'Fall asleep faster',
            lede: 'Time from lights out to sleep. A warm shower beats every supplement.',
            tool: { label: 'All factors: Sleep Latency Factors', url: 'https://www.kygo.app/tools/sleep-latency-factors' },
            levers: [
              { stat: '~10 min', label: 'faster after a warm bath or shower 1 to 2 hours before bed', grade: 'Strong' },
              { stat: '~19 min', label: 'faster with insomnia therapy (CBT-I)', grade: 'Strong' },
              { stat: '~9 min', label: 'faster after writing a to-do list at bedtime', grade: 'Moderate' },
              { stat: '+9 min', label: 'slower with caffeine', neg: true, grade: 'Strong' }
            ],
            buys: [
              { name: 'Melatonin', icon: 'pill', grade: 'Strong', stat: '7 min', statLabel: 'faster, across 19 studies',
                reason: 'The most studied sleep supplement. A timing aid, not a sedative.',
                catch: 'More is not better past about 4 mg.', source: 'Ferracioli-Oda 2013', q: 'melatonin' },
              { name: 'Ashwagandha', icon: 'pill', grade: 'Strong', stat: 'Largest', statLabel: 'supplement effect on falling asleep',
                reason: 'Shortened sleep onset across 3 trials, most clearly in insomnia.',
                catch: 'Every trial used a branded extract.', source: 'Cheah 2021', q: 'ashwagandha 600 mg' },
              { name: 'Magnesium', icon: 'pill', grade: 'Moderate', stat: '17 min', statLabel: 'faster in older adults',
                reason: 'Pooled from 3 trials of older adults.',
                catch: 'Low-quality evidence.', source: 'Mah & Pitre 2021', q: 'magnesium glycinate' },
              { name: 'Earplugs and eye mask', icon: 'ear', grade: 'Moderate', stat: '25 min', statLabel: 'faster in a noisy, bright room',
                reason: 'Asleep in 47 minutes vs 71 with no aid.',
                catch: 'Tested in a simulated hospital room, 10 people per group.', source: 'Huang 2015', q: 'earplugs and sleep mask set' },
              { name: 'Bed socks', icon: 'temp', grade: 'Moderate', stat: '3 to 7 min', statLabel: 'faster in a cool room',
                reason: 'Gently warming your feet helps you drift off.',
                catch: 'Small studies.', source: 'Raymann 2005; Ko 2018', q: 'bed socks' }
            ],
            skip: [
              { name: 'Weighted blankets', why: 'no effect on falling asleep' },
              { name: 'Cooling bedding', why: 'no effect on falling asleep' },
              { name: 'Valerian', why: 'no effect in pooled trials' },
              { name: 'L-theanine', why: 'feels faster, devices do not confirm it' }
            ] },
          { id: 'stay-asleep', nav: 'Stay asleep', icon: 'moon', title: 'Wake up less at night',
            lede: 'Time awake after you first fall asleep. The 3 a.m. problem.',
            tool: { label: 'All factors: Staying Asleep Factors', url: 'https://www.kygo.app/tools/staying-asleep-factors' },
            levers: [
              { stat: '+12 min', label: 'awake at night from caffeine', neg: true, grade: 'Strong' },
              { stat: '−10 min', label: 'awake with regular cardio', grade: 'Strong' },
              { stat: '2×', label: 'the odds of waking if you eat within an hour of bed', neg: true, grade: 'Moderate' },
              { stat: '1 hour', label: 'keep hard workouts at least this far from bed', grade: 'Moderate' }
            ],
            buys: [
              { name: 'Sleep mask or blackout curtains', icon: 'moon', grade: 'Strong', stat: '5 to 10 lux', statLabel: 'of light was enough to cause more waking',
                reason: 'Even nightlight-level light fragmented sleep.',
                catch: 'The study tested light, not a specific mask.', source: 'Cho 2016', q: 'contoured sleep mask' },
              { name: 'Foam earplugs', icon: 'ear', grade: 'Strong', stat: '+30 min', statLabel: 'awake from nighttime rail noise',
                reason: 'Noise above 50 dBA reliably adds waking.',
                catch: 'The evidence is for noise; earplugs are the simple fix.', source: 'Basner 2018 (WHO review)', q: 'foam earplugs sleep' },
              { name: 'Bedroom fan', icon: 'temp', grade: 'Strong', stat: '68 to 77°F', statLabel: 'the range with the fewest wakeups',
                reason: 'Too hot or too cold both add waking, and a fan clears stuffy air.',
                catch: 'The evidence is for temperature and airflow, not a device.', source: 'Akiyama 2021; Kang 2024', q: 'quiet bedroom fan' },
              { name: 'Ashwagandha', icon: 'pill', grade: 'Strong', stat: 'Less', statLabel: 'waking across 3 trials',
                reason: 'The best supplement evidence for staying asleep.',
                catch: 'Every trial used a branded extract.', source: 'Cheah 2021', q: 'ashwagandha 600 mg' },
              { name: 'Ecklonia cava', icon: 'pill', grade: 'Moderate', stat: '−24 min', statLabel: 'awake vs placebo',
                reason: 'A seaweed extract cut lab-measured waking in a one-week trial.',
                catch: '24 people, and one author works for a supplement maker.', source: 'Um 2018', q: 'ecklonia cava' }
            ],
            skip: [
              { name: 'Melatonin', why: 'does not help you stay asleep' },
              { name: 'Valerian', why: 'no measured change in waking' },
              { name: 'Almonds', why: 'no measured change' }
            ] },
          { id: 'rem-sleep', nav: 'REM sleep', icon: 'moon', title: 'Protect your REM sleep',
            lede: 'REM is back-loaded into the last hours of the night. Most of what protects it is free.',
            tool: { label: 'All factors: REM Sleep Factors', url: 'https://www.kygo.app/tools/rem-sleep-factors' },
            levers: [
              { stat: 'REM first', label: 'is what an early alarm cuts on a short night', neg: true },
              { stat: '~2 drinks', label: 'are enough to delay REM; each extra drink cuts more', neg: true },
              { stat: '−19 min', label: 'REM from a constant noise machine', neg: true },
              { stat: '4 hours', label: 'of bright screens before bed trimmed REM; 90 minutes did not', neg: true }
            ],
            buys: [
              { name: 'Cooling mattress topper', icon: 'bed', grade: 'Moderate', stat: '21 min', statLabel: 'of sleep restored in a hot room',
                reason: 'In a 90°F bedroom, cooling restored the lost sleep and REM.',
                catch: 'At normal room temperature it adds deep sleep, not REM. 15-person study.', source: 'Pasquier 2025', q: 'cooling mattress topper' },
              { name: 'Melatonin', icon: 'pill', grade: 'Moderate', stat: '15% → 18%', statLabel: 'REM share, only when REM was low',
                reason: 'Nudged REM up in people whose REM was well below normal.',
                catch: 'No change in healthy sleepers. 14 people in total.', source: 'Kunz 2004', q: 'melatonin' }
            ],
            skip: [
              { name: 'Noise machines', why: 'cut REM' },
              { name: 'Vitamin B6', why: 'more vivid dreams, not more REM' },
              { name: 'Glycine, valerian, CBD', why: 'no change in REM' }
            ] },
          { id: 'hrv-up', nav: 'HRV', icon: 'pulse', title: 'Raise your HRV',
            lede: 'Overnight HRV, the number most wearables report. Compare against your own trend, not someone else.',
            tool: { label: 'All factors: HRV Factor Explorer', url: 'https://www.kygo.app/tools/hrv-factors' },
            levers: [
              { stat: '#1', label: 'exercise type for HRV is HIIT, across 29 trials', grade: 'Strong' },
              { stat: '−2 to 13 ms', label: 'HRV from alcohol, more with each drink', neg: true, grade: 'Strong' },
              { stat: '6 a minute', label: 'slow breathing for 20 minutes a day raised HRV in 4 weeks', grade: 'Moderate' }
            ],
            buys: [
              { name: 'Ashwagandha', icon: 'pill', grade: 'Moderate', stat: '+9% vs −19%', statLabel: 'HRV vs placebo over 12 weeks',
                reason: 'Kept HRV from falling while it dropped on placebo.',
                catch: 'One trial of 111 people.', source: 'Smith 2023', q: 'ashwagandha 600 mg' },
              { name: 'Beetroot juice', icon: 'drop', grade: 'Moderate', stat: '+6.7 ms', statLabel: 'HRV after exercise',
                reason: 'Nitrates helped HRV recover faster after workouts.',
                catch: 'Only tested in postmenopausal women.', source: 'Raimundo 2025', q: 'beetroot juice' },
              { name: 'Cold plunge', icon: 'drop', grade: 'Moderate', stat: '+54 to 85%', statLabel: 'HRV after a cold session',
                reason: 'Cold exposure after exercise sharply raised HRV.',
                catch: 'Tested as cryotherapy after running. A short-term rise, not a lasting one.', source: 'Hausswirth 2013', q: 'cold plunge tub' }
            ],
            skip: [
              { name: 'Omega-3 for HRV', why: 'the main HRV measure did not change' },
              { name: 'Magnesium for HRV', why: 'inconsistent results' }
            ] },
          { id: 'rhr-down', nav: 'Resting HR', icon: 'heart', title: 'Lower your resting heart rate',
            lede: 'Lower generally tracks better fitness. Compare against your own baseline.',
            tool: { label: 'All factors: Resting Heart Rate Factors', url: 'https://www.kygo.app/tools/resting-heart-rate-factors' },
            levers: [
              { stat: '−6 bpm', label: 'from regular cardio, more after 30 weeks', grade: 'Strong' },
              { stat: '−3.9 bpm', label: 'from HIIT, across 97 trials', grade: 'Strong' },
              { stat: '−2.4 bpm', label: 'from daily slow breathing', grade: 'Strong' },
              { stat: '+2.4 to 2.8 bpm', label: 'overnight per drink above your usual', neg: true, grade: 'Strong' }
            ],
            buys: [
              { name: 'Omega-3 (DHA)', icon: 'heart', grade: 'Strong', stat: '−2.2 bpm', statLabel: 'across 51 trials',
                reason: 'Fish oil lowered resting heart rate, mostly through DHA.',
                catch: 'EPA alone had no effect. Two authors work for an omega-3 maker.', source: 'Hidayat 2017', q: 'omega 3 DHA' },
              { name: 'Foam earplugs', icon: 'ear', grade: 'Strong', stat: '+9 bpm', statLabel: 'per nighttime noise event, even without waking',
                reason: 'Traffic noise spikes your heart rate while you sleep.',
                catch: 'The study tested noise, not earplugs.', source: 'Griefahn 2008', q: 'foam earplugs sleep' }
            ],
            skip: [
              { name: 'Vitamin D', why: 'no effect at any dose' },
              { name: 'Potassium', why: 'no effect' },
              { name: 'Melatonin', why: 'mixed, mostly animal data' }
            ] },
          { id: 'vo2-up', nav: 'VO2 max', icon: 'lungs', title: 'Raise your VO2 max',
            lede: 'Training does almost all the work here. Very little you can buy moves it.',
            tool: { label: 'All factors: VO2 Max Factors', url: 'https://www.kygo.app/tools/vo2-max-factors' },
            levers: [
              { stat: '#1', label: 'long-interval HIIT, across 53 trials', grade: 'Strong' },
              { stat: '+1.9', label: 'mL/kg/min from lifting alone', grade: 'Moderate' },
              { stat: '−9%', label: 'after more than 30 days off training', neg: true, grade: 'Strong' }
            ],
            buys: [
              { name: 'Iron, if you are low', icon: 'pill', grade: 'Moderate', stat: '+2.35', statLabel: 'mL/kg/min when iron was low',
                reason: 'Correcting a deficiency raised VO2 max across 18 trials.',
                catch: 'Only helps if you are deficient. Get tested first.', source: 'Pasricha 2014', q: 'iron supplement' },
              { name: 'Home sauna', icon: 'temp', grade: 'Moderate', stat: '+2.7', statLabel: 'mL/kg/min in a sauna trial',
                reason: 'A small extra bump on top of training.',
                catch: 'One small trial plus an observational study of men.', source: 'Lee 2022; Kunutsor 2024', q: 'home sauna' }
            ],
            skip: [
              { name: 'Beetroot / nitrate', why: 'no effect on VO2 max' },
              { name: 'Creatine', why: 'slightly lowers VO2 max per kg' },
              { name: 'Caffeine', why: 'no change in VO2 max' }
            ] }
        ] }
    ];
  }

  // Which page this instance renders: page="wearables" (default) or page="improve".
  get _page() { return this.getAttribute('page') === 'improve' ? 'improve' : 'wearables'; }

  get _pages() {
    return {
      wearables: {
        url: this.getAttribute('wearables-href') || 'https://www.kygo.app/best-wearables',
        h1: 'Best wearables, <span class="hl">ranked by research</span>',
        lede: 'The best pick for how you train, sleep and which phone you use, plus the most accurate brand for each metric, ranked on published validation studies.',
        ldName: 'Best wearables 2026, ranked by accuracy',
        ldDesc: 'The most accurate wearable brands for sleep stages, sleep timing, HRV, resting heart rate, exercise heart rate, SpO2, steps, calories, VO2 max and breathing rate, ranked on published validation studies.',
        cross: { kicker: 'Next step', title: 'Improve your numbers', text: 'What actually moves deep sleep, HRV, resting HR and VO2 max, free levers first.' }
      },
      improve: {
        url: this.getAttribute('improve-href') || 'https://www.kygo.app/picks/improve',
        h1: 'Improve your numbers, <span class="hl">backed by research</span>',
        lede: 'What moves each number. Free levers first, then the few things worth buying.',
        ldName: 'How to improve your sleep, HRV, resting heart rate and VO2 max',
        ldDesc: 'Research-graded levers and products for deep sleep, falling asleep, staying asleep, REM, HRV, resting heart rate and VO2 max.',
        cross: { kicker: 'Track it right', title: 'Most accurate wearables, by metric', text: 'See which brand measures each of these numbers best.' }
      }
    };
  }

  // Links between matching sections on the two pages.
  get _bridges() {
    return {
      'sleep-stages': ['deep-sleep', 'How to get more deep sleep'],
      'sleep-timing': ['stay-asleep', 'How to wake up less at night'],
      'hrv': ['hrv-up', 'How to raise your HRV'],
      'rhr': ['rhr-down', 'How to lower your resting heart rate'],
      'vo2max': ['vo2-up', 'How to raise your VO2 max'],
      'deep-sleep': ['sleep-stages', 'Best wearable for tracking sleep stages'],
      'fall-asleep': ['sleep-timing', 'Best wearable for tracking sleep timing'],
      'stay-asleep': ['sleep-timing', 'Best wearable for tracking time awake'],
      'rem-sleep': ['sleep-stages', 'Best wearable for tracking REM'],
      'hrv-up': ['hrv', 'Best wearable for tracking HRV'],
      'rhr-down': ['rhr', 'Best wearable for tracking resting HR'],
      'vo2-up': ['vo2max', 'Best wearable for tracking VO2 max']
    };
  }

  // The Improve page is not live yet. Add the improve-live attribute once it is.
  get _improveLive() { return this.hasAttribute('improve-live') || this._page === 'improve'; }

  _renderBridge(s) {
    const b = this._bridges[s.id];
    if (!b || !this._improveLive) return '';
    const other = this._page === 'wearables' ? 'improve' : 'wearables';
    const anchor = other === 'improve' ? 'x-' + b[0] : b[0];
    return `<a class="bridge" href="${this._esc(this._pages[other].url + '#' + anchor)}">${this._esc(b[1])}${this._icon('arrow')}</a>`;
  }

  _renderCross() {
    if (!this._improveLive) return '';
    const other = this._page === 'wearables' ? 'improve' : 'wearables';
    const c = this._pages[this._page].cross;
    return `<a class="cross" href="${this._esc(this._pages[other].url)}">
        <span class="cross-kicker">${this._esc(c.kicker)}</span>
        <span class="cross-title">${this._esc(c.title)}</span>
        <span class="cross-text">${this._esc(c.text)}</span>
        <span class="cross-go">${this._icon('arrow')}</span>
      </a>`;
  }

  // Groups with draft sections removed unless previewing.
  get _visibleGroups() {
    return this._groups
      .map(g => Object.assign({}, g, { sections: g.sections.filter(s => this._preview || s.status !== 'draft') }))
      .filter(g => (g.page || g.id) === this._page && g.sections.length);
  }

  _anchor(g, s) { return g.id === 'improve' ? 'x-' + s.id : s.id; }

  // ── Render helpers ────────────────────────────────────────────────────

  _icon(name) {
    const p = {
      arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
      ext: '<path d="M7 17L17 7"/><path d="M8 7h9v9"/>',
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
      minus: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
      moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
      pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
      heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
      activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
      drop: '<path d="M12 2.7l5.7 5.7a8 8 0 1 1-11.4 0z"/>',
      steps: '<path d="M4 16v-2.4C4 11.5 3 10.5 3 8c0-2.7 1.5-6 4.5-6C9.4 2 10 3.8 10 5.5c0 3.1-2 5.7-2 8.7V16a2 2 0 1 1-4 0z"/><path d="M20 20v-2.4c0-2.1 1-3.1 1-5.6 0-2.7-1.5-6-4.5-6C14.6 6 14 7.8 14 9.5c0 3.1 2 5.7 2 8.7V20a2 2 0 1 0 4 0z"/>',
      lungs: '<path d="M12 4v8"/><path d="M12 12c-1.5 1.5-3 1-4 0-2-2-5 3-5 7 0 1.5 1 2 2.5 1.5C8 19.5 9 18 9 15"/><path d="M12 12c1.5 1.5 3 1 4 0 2-2 5 3 5 7 0 1.5-1 2-2.5 1.5C16 19.5 15 18 15 15"/>',
      flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.3.3 1.5 1.3 2.8 2.5 2.8z"/>',
      ear: '<path d="M6 8a6 6 0 0 1 12 0c0 7-6 6-6 12"/><path d="M9 9a3 3 0 0 1 6 0"/>',
      bed: '<rect x="3" y="9" width="18" height="8" rx="2"/><path d="M3 13h18"/><path d="M5 17v2M19 17v2"/>',
      temp: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>',
      x: '<path d="M18 6L6 18"/><path d="M6 6l12 12"/>',
      pill: '<rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-45 12 12)"/><path d="M9.5 9.5l5 5"/>'
    }[name];
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  }

  _renderCard(pick, sectionId) {
    const place = ['', '1st', '2nd', '3rd', '4th'][pick.rank] || '';
    return this._card(Object.assign(this._pickData(pick, sectionId), { pill: place, pillCls: 'place-' + pick.rank }));
  }

  // The winner: one wide card with everything visible.
  _feature(c) {
    const e = v => this._esc(v);
    return `
      <article class="feature">
        <div class="f-main">
          ${c.logo}
          <div class="f-id">
            <span class="f-kicker">${e(c.kicker)}</span>
            <h4 class="f-name">${e(c.name)}</h4>
            <p class="f-stat"><strong>${e(c.stat)}</strong> ${e(c.statLabel)}</p>
            ${c.tested ? `<p class="f-tested">${e(c.tested)}</p>` : ''}
          </div>
        </div>
        <div class="f-side">
          <p class="f-reason">${e(c.reason)}</p>
          <details class="why f-why"><summary>Why we picked it</summary>
            <p class="catch"><strong>Catch:</strong> ${e(c.catch)}</p>
            <p class="f-src">${e(c.source)}</p>
          </details>
          <a class="buy buy-primary" href="${e(c.link)}" target="_blank" rel="sponsored nofollow noopener"
             data-pick="${e(c.pickId)}" data-section="${e(c.sectionId)}" data-track-label="${e(c.name)}" data-track-position="${e(c.sectionId)}">${e(c.cta)}${this._icon('ext')}</a>
        </div>
      </article>`;
  }

  _pickData(pick, sectionId) {
    const pr = this._products[pick.product] || {};
    const title = pr.current || pr.name;
    const live = pr.asin && this._amzData ? this._amzData[pr.asin] : null;
    const link = (live && live.url) || pr.link || (pr.asin ? this._dp(pr.asin) : this._amz(title));
    const short = (pr.current || '').replace(/^(Apple Watch|Oura Ring|Garmin|Google|Samsung Galaxy Watch|Polar|WHOOP)\s*/, '');
    const tested = pick.model && pick.model !== short && pick.model !== pr.current
      ? (pick.model === 'Several models' ? 'Tested across several models' : 'Tested on ' + (/^[0-9]/.test(pick.model) ? pr.name + ' ' : '') + pick.model) : '';
    const e = v => this._esc(v);
    const logo = live && live.image
      ? `<a class="card-logo prod-img" href="${e(link)}" target="_blank" rel="sponsored nofollow noopener" data-pick="${e(pr.asin)}" data-section="${e(sectionId)}" data-track-label="${e(title)}" data-track-position="${e(sectionId)}"><img src="${e(live.image)}" alt="${e(title)}" loading="lazy" decoding="async" /></a>`
      : pr.img
      ? `<img class="card-logo" src="${this._img(pr.img)}" alt="" loading="lazy" decoding="async" />`
      : `<span class="card-logo card-logo-txt" aria-hidden="true">${e((pr.name || '?').charAt(0))}</span>`;
    return { logo, name: title, tested, stat: pick.stat, statLabel: pick.statLabel, reason: pick.reason, catch: pick.catch,
      source: pick.source, link, cta: 'Check price on Amazon', pickId: pr.asin || pick.product, sectionId };
  }

  // Shared card: the same five visible parts everywhere, details behind a toggle.
  _card(c) {
    const e = v => this._esc(v);
    return `
      <article class="card">
        <div class="card-top">
          ${c.logo}
          <h4 class="card-title">${e(c.name)}</h4>
          ${c.pill ? `<span class="place ${c.pillCls || ''}">${e(c.pill)}</span>` : ''}
        </div>
        <div class="stat"><span class="stat-num">${e(c.stat)}</span><span class="stat-label">${e(c.statLabel)}</span></div>
        ${c.tested ? `<p class="tested">${e(c.tested)}</p>` : ''}
        <details class="why">
          <summary>Why we picked it</summary>
          <p class="reason">${e(c.reason)}</p>
          <p class="catch"><strong>Catch:</strong> ${e(c.catch)}</p>
          <p class="src">${e(c.source)}</p>
        </details>
        <a class="buy" href="${e(c.link)}" target="_blank" rel="sponsored nofollow noopener"
           data-pick="${e(c.pickId)}" data-section="${e(c.sectionId)}" data-track-label="${e(c.name)}" data-track-position="${e(c.sectionId)}">${e(c.cta)}${this._icon('ext')}</a>
      </article>`;
  }

  _renderGear(s, sectionId) {
    const e = v => this._esc(v);
    const row = g => `
      <li class="gear-row">
        <span class="gear-ico">${this._icon(g.icon)}</span>
        <div class="gear-text">
          <div class="gear-top"><h4>${e(g.name)}</h4>${g.grade ? `<span class="gear-grade${/Strong/.test(g.grade) ? ' strong' : ''}">${e(g.grade)}</span>` : ''}</div>
          <p>${e(g.text)} <span class="gear-src">${e(g.source)}</span> <a class="gear-more" href="${e(g.factorUrl)}">See the research</a></p>
        </div>
        <a class="gear-buy" href="${e(g.link)}" target="_blank" rel="sponsored nofollow noopener" data-pick="${e(g.name)}" data-section="${e(sectionId)}">View on Amazon${this._icon('ext')}</a>
      </li>`;
    const groups = s.gearGroups || [{ label: '', items: s.gear || [] }];
    return `<div class="gear-box">${groups.map(gr => `${gr.label ? `<h4 class="gear-head">${e(gr.label)}</h4>` : ''}<ul class="gear-list">${gr.items.map(row).join('')}</ul>`).join('')}${s.skip ? `<p class="gear-skip"><strong>Skip:</strong> ${e(s.skip)}</p>` : ''}</div>`;
  }

  _renderImprove(s, sectionId) {
    const e = v => this._esc(v);
    const gradeCls = g => /Strong/.test(g || '') ? 'strong' : 'moderate';
    const levers = (s.levers || []).map(l => `
      <div class="lever${l.neg ? ' is-neg' : ''}"><span class="lever-num">${e(l.stat)}</span><span class="lever-label">${e(l.label)}</span></div>`).join('');
    const buyData = b => ({
      logo: `<span class="card-logo buy-ico">${this._icon(b.icon)}</span>`, name: b.name,
      pill: b.grade, pillCls: 'grade-' + gradeCls(b.grade), stat: b.stat, statLabel: b.statLabel,
      reason: b.reason, catch: b.catch, source: b.source,
      link: 'https://www.amazon.com/s?k=' + encodeURIComponent(b.q) + '&tag=' + KY_AMZ_TAG,
      cta: 'View on Amazon', pickId: b.name, sectionId
    });
    const list = s.buys || [];
    const buys = list.length ? this._feature(Object.assign(buyData(list[0]), { kicker: 'Top pick · ' + list[0].grade + ' evidence' }))
      + (list.length > 1 ? `<h4 class="next-h">Also worth buying</h4><div class="cards cards-next">${list.slice(1).map(b => this._card(buyData(b))).join('')}</div>` : '') : '';
    const skip = (s.skip || []).map(k => `<strong>${e(k.name)}</strong> (${e(k.why)})`).join(' · ');
    return `
      <div class="imp">
        <div class="imp-block">
          <h4 class="imp-h">Free levers</h4>
          <div class="levers">${levers}</div>
        </div>
        ${buys ? `<div class="imp-block">
          <h4 class="imp-h">Worth buying</h4>
          ${buys}
        </div>` : ''}
        ${skip ? `<p class="skip-line"><span class="imp-h">Skip</span> ${skip}</p>` : ''}
      </div>`;
  }

  _renderSponsor(sp) {
    if (!sp) return '';
    const e = v => this._esc(v);
    return `
      <aside class="sponsor" aria-label="Sponsored">
        <span class="sp-pill">Sponsored</span>
        <div class="sp-body"><h4>${e(sp.title)}</h4><p>${e(sp.text)}</p></div>
        <a class="sp-btn" href="${e(sp.url)}" target="_blank" rel="sponsored nofollow noopener">Visit ${e(sp.brand)}</a>
      </aside>`;
  }

  _renderSection(g, s) {
    const e = v => this._esc(v);
    const a = this._anchor(g, s);
    const isGear = !!(s.gear || s.gearGroups);
    const body = s.levers ? this._renderImprove(s, a)
      : isGear ? this._renderGear(s, a)
      : s.picks && s.picks.length
      ? `${this._feature(Object.assign(this._pickData(s.picks[0], a), { kicker: g.pickLabel || '1st place' }))}${s.picks.length > 1 ? `<h4 class="next-h">Next closest</h4><div class="cards cards-next">${s.picks.slice(1).map(p => this._renderCard(p, a)).join('')}</div>` : ''}`
      : `<div class="nopick">${this._icon('minus')}<p>${e(s.noPick || '')}</p></div>`;
    return `
      <section class="pick-section animate-on-scroll${isGear ? ' is-gear' : ''}" id="${a}" data-anchor="${a}" aria-labelledby="h-${a}">
        <div class="sec-head">
          ${g.kicker ? '' : `<span class="sec-ico">${this._icon(s.icon || 'bed')}</span>`}
          <div class="sec-copy">
            ${g.kicker ? `<span class="sec-kicker">${e(g.kicker)}</span>` : ''}
            <h3 id="h-${a}">${e(s.title)}</h3>
            <p class="sec-lede">${e(s.lede)}</p>
            ${s.confidence ? `<span class="conf">Confidence: ${e(s.confidence)}</span>` : ''}
          </div>
        </div>
        ${body}
        ${s.note ? `<p class="sec-note">${e(s.note)}</p>` : ''}
        <div class="sec-links"><a class="tool-link" href="${e(s.tool.url)}">${e(s.tool.label)}${this._icon('arrow')}</a>${this._renderBridge(s)}</div>
        ${this._renderSponsor(s.sponsor)}
      </section>`;
  }

  _renderGlance(groups) {
    const e = v => this._esc(v);
    const logoOf = id => {
      const pr = this._products[id] || {};
      return pr.img ? `<img class="g-logo" src="${this._img(pr.img)}" alt="" />` : `<span class="g-logo card-logo-txt">${e((pr.name || '?').charAt(0))}</span>`;
    };
    const short = n => (n || '').replace(' Galaxy Watch', '').replace(' / Google', '').replace(' Ring', '').replace(' Watch', '');
    const rows = groups.map(g => {
      const isWear = g.id === 'wearables';
      const items = g.sections.map(s => {
        const a = this._anchor(g, s);
        let slots;
        if (isWear) {
          slots = (s.picks && s.picks.length)
            ? s.picks.slice(0, 3).map(p => `<span class="g-slot"><span class="g-rank">${p.rank}</span>${logoOf(p.product)}<span class="g-brand">${e(short((this._products[p.product] || {}).name))}</span></span>`).join('')
            : `<span class="g-none">Not ranked: no independent tests</span>`;
        } else {
          const l = (s.levers || [])[0]; const b = (s.buys || [])[0];
          slots = `${l ? `<span class="g-slot g-wide"><span class="g-tag">Free</span><span class="g-brand">${e(l.stat)} ${e(l.label)}</span></span>` : ''}${b ? `<span class="g-slot g-wide"><span class="g-tag g-tag-buy">Buy</span><span class="g-brand">${e(b.name)}</span></span>` : ''}`;
        }
        return `<a class="g-row" href="#${a}" data-jump="${a}"><span class="g-metric"><span class="g-ico">${this._icon(s.icon || 'bed')}</span>${e(s.nav)}</span><span class="g-slots">${slots}</span><span class="g-go">${this._icon('arrow')}</span></a>`;
      }).join('');
      return `<div class="g-group"><h3 class="g-h">${e(g.label)}</h3><div class="g-list">${items}</div></div>`;
    }).join('');
    return `<section class="glance" id="glance" aria-labelledby="h-glance"><h2 id="h-glance">At a glance</h2><p class="glance-lede">Tap any row for the details and where to buy.</p>${rows}</section>`;
  }

  _renderSidebar(groups) {
    const e = v => this._esc(v);
    return `
      <nav class="side" aria-label="On this page">
        <span class="side-label">On this page</span>
        ${groups.map(g => `
          <div class="side-group">
            ${g.sections.length === 1 && (g.sections[0].gear || g.sections[0].gearGroups) ? `<a class="side-g side-solo" href="#${this._anchor(g, g.sections[0])}" data-jump="${this._anchor(g, g.sections[0])}" data-nav="${this._anchor(g, g.sections[0])}">${e(g.label)}</a>` : `<a class="side-g" href="#${g.id}" data-jump="${g.id}">${e(g.label)}<span>${g.sections.length}</span></a>
            ${g.sections.map(s => { const a = this._anchor(g, s); return `<a class="side-s" href="#${a}" data-jump="${a}" data-nav="${a}"><span class="dot"></span>${e(s.nav)}</a>`; }).join('')}`}
          </div>`).join('')}
        <a class="side-top" href="#top" data-jump="top">Back to top</a>
      </nav>`;
  }

  _renderChips(groups) {
    const e = v => this._esc(v);
    return `
      <nav class="chips" aria-label="On this page">
        <div class="chips-row">
          ${groups.map((g, i) => `
            ${i ? '<span class="chips-sep" aria-hidden="true"></span>' : ''}
            ${g.sections.map(s => { const a = this._anchor(g, s); return `<a class="chip" href="#${a}" data-jump="${a}" data-nav="${a}">${e(s.nav)}</a>`; }).join('')}`).join('')}
        </div>
      </nav>`;
  }

  _renderAppCta() {
    return `
      <div class="kc-card animate-on-scroll" id="get-the-app">
        <div class="kc-left">
          <span class="kc-pill"><span class="kc-dot"></span> Free 7-day trial</span>
          <h3 class="kc-h">See which of these actually <span>moves your numbers.</span></h3>
          <p class="kc-p">Kygo connects to your wearable and cross-checks your sleep, HRV and recovery against what you actually eat, take and do.</p>
        </div>
        <div class="kc-right">
          <kygo-cta theme="dark" slug="best-wearables" surface="tool" content="mid" hook="Already wearing one? See what actually moves your sleep and HRV, with your own data behind it."
            note="Start with a free 7-day trial. Save 58% on yearly. Cancel anytime."></kygo-cta>
        </div>
      </div>`;
  }

  // ── Main render ───────────────────────────────────────────────────────

  render() {
    const groups = this._visibleGroups;
    const e = v => this._esc(v);
    const logo = this._img('273a63_7ac49e91323749f49cadfe795ff3680f');
    const nPicks = groups.reduce((n, g) => n + g.sections.reduce((m, s) => m + (s.picks ? s.picks.length : 0), 0), 0);
    const nSecs = groups.reduce((n, g) => n + g.sections.length, 0);

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>
      <div id="top"></div>
      <header class="nav">
        <div class="nav-inner">
          <a href="https://www.kygo.app" class="nav-brand"><img src="${logo}" alt="Kygo" /><span>Kygo Health</span></a>
          <div class="nav-cta-group"><kygo-cta mini slug="best-wearables-subnav" surface="tool"></kygo-cta></div>
        </div>
      </header>

      <section class="hero">
        <div class="container hero-inner">
          ${this._improveLive ? `<nav class="page-tabs" aria-label="Kygo Picks">
            <a href="${e(this._pages.wearables.url)}" class="${this._page === 'wearables' ? 'on' : ''}"${this._page === 'wearables' ? ' aria-current="page"' : ''}>Best wearables</a>
            <a href="${e(this._pages.improve.url)}" class="${this._page === 'improve' ? 'on' : ''}"${this._page === 'improve' ? ' aria-current="page"' : ''}>Improve your numbers</a>
          </nav>` : ''}
          <h1>${this._pages[this._page].h1}</h1>
          <p class="hero-lede">${e(this._pages[this._page].lede)}</p>
          <p class="hero-fine">Updated ${e(this._updated.page)}. Rankings are never paid. As an Amazon Associate, Kygo earns from qualifying purchases.</p>
        </div>
      </section>

      ${this._renderChips(groups)}

      <div class="body">
        <div class="container layout">
          ${this._renderSidebar(groups)}
          <div class="content">
            ${groups.map((g, gi) => `
              <div class="group" id="${g.id}">
                ${g.sections.map(s => this._renderSection(g, s)).join('')}
                ${this._renderCross()}
                ${this._renderAppCta()}
              </div>`).join('')}
          </div>
        </div>
      </div>

      <footer class="tool-footer">
        <div class="container">
          <a href="https://www.kygo.app" class="footer-brand"><img src="${logo}" alt="Kygo Health" class="footer-logo" /><span>Kygo Health</span></a>
          <p class="footer-tagline">Stop Guessing. Start Knowing.</p>
          <div class="footer-links">
            <a href="https://www.kygo.app">Home</a>
            <a href="https://www.kygo.app/tools">Tools</a>
            <a href="https://www.kygo.app/blog">Blog</a>
            <a href="https://www.kygo.app/contact">Contact</a>
            <a href="https://www.kygo.app/privacy-policy">Privacy</a>
            <a href="https://www.kygo.app/terms-conditions">Terms</a>
          </div>
          <p class="footer-disclaimer">This content is for informational purposes only and is not medical advice. Wearable readings are estimates, not clinical measurements. As an Amazon Associate, Kygo earns from qualifying purchases. Last reviewed ${e(this._updated.page)}.</p>
        </div>
      </footer>`;
  }

  // ── Events ────────────────────────────────────────────────────────────

  _wire() {
    if (this._wired) return;
    this._wired = true;
    this.shadowRoot.addEventListener('click', (ev) => {
      if (ev.target.closest('[data-disc]')) {
        const d = this.shadowRoot.querySelector('.hero-disc');
        if (d) d.hidden = !d.hidden;
        return;
      }
      const jump = ev.target.closest('[data-jump]');
      if (jump) {
        const id = jump.getAttribute('data-jump');
        const el = this.shadowRoot.getElementById(id);
        if (el) {
          ev.preventDefault();
          const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const bar = this.shadowRoot.querySelector('.chips');
          const offset = bar && getComputedStyle(bar).display !== 'none' ? bar.offsetHeight + 12 : 16;
          const y = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
          if (history.replaceState && id !== 'top') history.replaceState(null, '', '#' + id);
        }
        return;
      }
      // Amazon clicks are logged by the site-wide kygo-tracking.js listener (cta_click,
      // affiliate_amazon, plus a per-click ascsubtag). data-track-label / -position feed it.
    });
  }

  // Highlights the nav entry for the section nearest the top of the screen.
  _setupScrollSpy() {
    requestAnimationFrame(() => {
      if (this._spy) this._spy.disconnect();
      const secs = this.shadowRoot.querySelectorAll('.pick-section');
      if (!secs.length || !('IntersectionObserver' in window)) return;
      const seen = new Map();
      this._spy = new IntersectionObserver((entries) => {
        entries.forEach(en => seen.set(en.target.id, en.isIntersecting ? en.boundingClientRect.top : null));
        let best = null, bestTop = Infinity;
        seen.forEach((top, id) => { if (top !== null && Math.abs(top) < bestTop) { bestTop = Math.abs(top); best = id; } });
        if (best && best !== this._active) this._setActive(best);
      }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
      secs.forEach(s => this._spy.observe(s));
      this._setActive(secs[0].id);
    });
  }

  _setActive(id) {
    this._active = id;
    this.shadowRoot.querySelectorAll('[data-nav]').forEach(a => {
      const on = a.getAttribute('data-nav') === id;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
    const chip = this.shadowRoot.querySelector('.chip.on');
    const row = this.shadowRoot.querySelector('.chips-row');
    if (chip && row) {
      const l = chip.offsetLeft, r = l + chip.offsetWidth;
      if (l < row.scrollLeft || r > row.scrollLeft + row.clientWidth) row.scrollTo({ left: Math.max(0, l - 60), behavior: 'smooth' });
    }
  }

  _setupAnimations() {
    requestAnimationFrame(() => {
      const els = this.shadowRoot.querySelectorAll('.animate-on-scroll');
      if (!els.length) return;
      if (this._observer) this._observer.disconnect();
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); this._observer.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -50px 0px', threshold: 0.01 });
      els.forEach(el => this._observer.observe(el));
    });
  }

  // ── SEO ───────────────────────────────────────────────────────────────

  _seoText() {
    const parts = [];
    this._visibleGroups.forEach(g => g.sections.forEach(s => {
      if (s.status === 'draft') return;
      const picks = (s.picks || []).map(p => { const pr = this._products[p.product] || {}; return `${p.rank}. ${pr.current || pr.name}: ${p.stat} ${p.statLabel}. ${p.reason} Catch: ${p.catch}${p.model ? ' (tested on ' + p.model + ')' : ''}`; }).join(' ');
      parts.push(`${s.title}. ${s.lede} ${picks || s.noPick || ''}`);
    }));
    return this._pages[this._page].ldName + ', by Kygo Health. ' + parts.join(' ');
  }

  _injectStructuredData() {
    if (document.querySelector('script[data-kygo-picks-ld]')) return;
    const items = [];
    this._visibleGroups.forEach(g => g.sections.forEach(s => {
      if (s.status === 'draft') return;
      items.push({ '@type': 'ListItem', position: items.length + 1, name: s.title, url: this._pages[this._page].url + '#' + this._anchor(g, s) });
    }));
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: this._pages[this._page].ldName,
      description: this._pages[this._page].ldDesc,
      url: this._pages[this._page].url,
      dateModified: this._updated.iso,
      publisher: { '@type': 'Organization', name: 'Kygo Health', url: 'https://www.kygo.app' },
      mainEntity: { '@type': 'ItemList', itemListElement: items }
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-kygo-picks-ld', '');
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }

  // ── Styles ────────────────────────────────────────────────────────────

  _styles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
      :host {
        --fg-1: #0f172a; --fg-2: #475569; --fg-3: #94a3b8;
        --bg-canvas: #ffffff; --bg-surface: #f8fafc; --bg-raised: #f1f5f9;
        --border-subtle: #e2e8f0; --border-hover: #cbd5e1;
        --kygo-green: #22c55e; --kygo-green-dark: #16a34a; --kygo-green-text: #15803d; --kygo-green-light: #dcfce7;
        --kygo-dark: #0f172a; --on-dark-accent: #6ee7a0;
        --shadow-md: 0 8px 24px rgba(15, 23, 42, 0.06);
        --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
        display: block; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: var(--fg-1); background: var(--bg-canvas); line-height: 1.6; -webkit-font-smoothing: antialiased;
      }
      *, *::before, *::after { box-sizing: border-box; }
      a { color: var(--kygo-green-text); }
      a:focus-visible, button:focus-visible { outline: 2px solid var(--kygo-green-dark); outline-offset: 2px; border-radius: 6px; }
      h1, h2, h3, h4 { font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; }
      svg { width: 16px; height: 16px; flex: 0 0 auto; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

      .nav { border-bottom: 1px solid var(--border-subtle); background: #fff; }
      .nav-inner { max-width: 1200px; margin: 0 auto; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--fg-1); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; white-space: nowrap; }
      .nav-brand img { width: 32px; height: 32px; border-radius: 8px; }

      .hero { padding: 48px 0 32px; }
      .hero-inner { display: flex; flex-direction: column; gap: 18px; }
      .hero-pill { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border-radius: 999px; background: rgba(34,197,94,0.1); color: var(--kygo-green-text); font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; }
      .hero-pill .dot { width: 6px; height: 6px; border-radius: 999px; background: var(--kygo-green); }
      h1 { font-size: clamp(30px, 5.5vw, 58px); line-height: 1.05; font-weight: 700; letter-spacing: -0.02em; max-width: 18ch; }
      h1 .hl { color: var(--kygo-green-dark); }
      .hero-lede { margin: 0; max-width: 60ch; font-size: clamp(15px, 1.6vw, 18px); line-height: 1.55; color: var(--fg-2); }
      .hero-lede strong { color: var(--fg-1); }
      .disclosure { display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px; border-radius: 12px; background: var(--bg-raised); max-width: 820px; color: var(--fg-2); }
      .disclosure svg { margin-top: 3px; }
      .disclosure p { margin: 0; font-size: 12.5px; line-height: 1.55; }
      .disclosure strong { color: var(--fg-1); }

      .chips { position: sticky; top: 0; z-index: 10; background: rgba(255,255,255,0.97); border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); padding: 10px 0; }
      .chips-row { display: flex; align-items: center; gap: 8px; overflow-x: auto; padding: 0 20px; scrollbar-width: none; }
      .chips-row::-webkit-scrollbar { display: none; }
      .chip-g { flex: 0 0 auto; color: var(--fg-2); text-decoration: none; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; padding: 0 2px; min-height: 40px; display: flex; align-items: center; white-space: nowrap; }
      .chip { flex: 0 0 auto; display: flex; align-items: center; min-height: 40px; padding: 0 14px; border-radius: 999px; border: 1.5px solid var(--border-subtle); background: #fff; color: var(--fg-1); text-decoration: none; font-size: 13.5px; font-weight: 500; white-space: nowrap; transition: background 0.2s var(--ease-out), color 0.2s var(--ease-out); }
      .chip.on { background: var(--kygo-dark); border-color: var(--kygo-dark); color: #fff; font-weight: 600; }
      .chips-sep { flex: 0 0 1px; height: 24px; background: var(--border-subtle); margin: 0 6px; }

      .body { background: var(--bg-surface); border-top: 1px solid var(--border-subtle); padding: 32px 0 64px; }
      .layout { display: block; }
      .side { display: none; }
      .content { display: flex; flex-direction: column; gap: 56px; min-width: 0; }
      .group { display: flex; flex-direction: column; gap: 48px; scroll-margin-top: 72px; }
      .group-head { display: flex; flex-direction: column; gap: 8px; padding-bottom: 16px; border-bottom: 1.5px solid var(--border-subtle); }
      .group-count { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: var(--fg-2); }
      .group-head h2 { font-size: clamp(28px, 4.6vw, 46px); line-height: 1.05; font-weight: 700; letter-spacing: -0.02em; }
      .group-head p { margin: 0; max-width: 62ch; color: var(--fg-2); font-size: 15.5px; line-height: 1.55; }

      .pick-section { display: flex; flex-direction: column; gap: 18px; scroll-margin-top: 72px; padding-top: 36px; border-top: 1.5px solid var(--border-subtle); }
      .group-head + .pick-section { border-top: 0; padding-top: 0; }
      .sec-head { display: flex; gap: 14px; align-items: flex-start; }
      .sec-ico { flex: 0 0 44px; width: 44px; height: 44px; border-radius: 12px; background: var(--kygo-green-light); color: var(--kygo-green-text); display: flex; align-items: center; justify-content: center; }
      .sec-ico svg { width: 22px; height: 22px; }
      .sec-copy { max-width: 640px; display: flex; flex-direction: column; gap: 4px; }
      .sec-copy h3 { font-size: clamp(22px, 3vw, 28px); line-height: 1.15; font-weight: 600; letter-spacing: -0.01em; padding-top: 6px; }
      .sec-lede { margin: 0; color: var(--fg-2); font-size: 15px; line-height: 1.5; }
      .tool-link { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; text-decoration: none; min-height: 40px; }
      .tool-link:hover { color: var(--kygo-green-dark); }

      .cards { display: flex; gap: 14px; overflow-x: auto; scroll-snap-type: x mandatory; margin: 0 -20px; padding: 2px 20px 8px; scrollbar-width: none; }
      .cards::-webkit-scrollbar { display: none; }
      .card { flex: 0 0 272px; scroll-snap-align: start; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; box-shadow: var(--shadow-md); padding: 18px; display: flex; flex-direction: column; gap: 10px; }
      .card-top { display: flex; align-items: center; gap: 12px; }
      .card-logo { width: 44px; height: 44px; border-radius: 10px; object-fit: contain; background: var(--bg-raised); }
      .card-name { display: flex; flex-direction: column; min-width: 0; }
      .card-name h4 { font-size: 17px; font-weight: 600; line-height: 1.2; }
      .model { font-size: 12px; color: var(--fg-2); }
      .badge { align-self: flex-start; padding: 4px 10px; border-radius: 999px; background: var(--kygo-green-light); color: var(--kygo-green-text); font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
      .stat { display: flex; flex-direction: column; gap: 2px; padding: 4px 0 2px; }
      .stat-num { font-family: 'Space Grotesk', sans-serif; font-size: 34px; font-weight: 700; line-height: 1; letter-spacing: -0.02em; color: var(--fg-1); }
      .stat-label { font-size: 12.5px; color: var(--fg-2); }
      .reason { margin: 0; font-size: 14px; line-height: 1.5; color: var(--fg-1); }
      .catch { margin: 0; font-size: 12.5px; line-height: 1.5; color: var(--fg-2); }
      .catch strong { color: var(--fg-1); font-weight: 600; }
      .src { display: block; margin-top: 2px; font-size: 11.5px; opacity: 0.9; }
      .grow { flex-grow: 1; }
      .buy { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; margin-top: 4px; border-radius: 10px; background: var(--kygo-green); color: var(--fg-1); text-decoration: none; font-size: 14px; font-weight: 600; transition: background 0.2s var(--ease-out); }
      .buy:hover { background: #4ade80; }

      .nopick { display: flex; gap: 12px; align-items: flex-start; padding: 16px 18px; border-radius: 14px; border: 1.5px dashed var(--border-hover); background: #fff; color: var(--fg-2); }
      .nopick svg { width: 20px; height: 20px; margin-top: 2px; }
      .nopick p { margin: 0; font-size: 14.5px; line-height: 1.6; max-width: 70ch; }

      .card-top { position: relative; }
      .card-logo-txt { display: flex; align-items: center; justify-content: center; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; color: var(--fg-2); }
      .badge-text { font-size: 12px; font-weight: 600; color: var(--kygo-green-text); line-height: 1.3; }
      .place { margin-left: auto; align-self: flex-start; padding: 4px 10px; border-radius: 999px; background: var(--bg-raised); color: var(--fg-2); font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 700; }
      .place-1 { background: var(--kygo-dark); color: #fff; }
      .card.is-first { border-color: var(--kygo-green); }
      .conf { align-self: flex-start; margin-top: 4px; font-size: 12px; color: var(--fg-2); background: var(--bg-raised); padding: 3px 10px; border-radius: 999px; }
      .sec-note { margin: 0; font-size: 13px; color: var(--fg-2); }
      .gear-head { margin: 18px 0 2px; font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: var(--fg-2); }
      .gear-grade.strong { background: var(--kygo-green-light); color: var(--kygo-green-text); }
      .imp { display: flex; flex-direction: column; gap: 22px; }
      .imp-block { display: flex; flex-direction: column; gap: 12px; }
      .imp-h { display: flex; align-items: center; gap: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; color: var(--fg-1); }
      .imp-tag { padding: 3px 10px; border-radius: 999px; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; }
      .tag-free { background: var(--kygo-dark); color: #fff; }
      .tag-buy { background: var(--kygo-green-light); color: var(--kygo-green-text); }
      .tag-skip { background: var(--bg-raised); color: var(--fg-2); }
      .levers { display: flex; gap: 12px; overflow-x: auto; margin: 0 -20px; padding: 2px 20px 6px; scroll-snap-type: x mandatory; scrollbar-width: none; }
      .levers::-webkit-scrollbar { display: none; }
      .lever { flex: 0 0 210px; scroll-snap-align: start; display: flex; flex-direction: column; gap: 6px; padding: 16px; border-radius: 14px; background: var(--kygo-dark); color: #fff; }
      .lever-num { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700; line-height: 1.05; letter-spacing: -0.02em; color: var(--on-dark-accent); }
      .lever-label { font-size: 13.5px; line-height: 1.45; color: rgba(255,255,255,0.85); }
      .lever .ev { margin-top: auto; color: rgba(255,255,255,0.65); }
      .ev { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; color: var(--fg-2); }
      .ev i { width: 7px; height: 7px; border-radius: 999px; background: var(--border-hover); }
      .ev-strong i { background: var(--kygo-green); }
      .ev-moderate i { background: #86efac; }
      .buy-ico { display: flex; align-items: center; justify-content: center; color: var(--kygo-green-text); background: var(--kygo-green-light); }
      .buy-ico svg { width: 22px; height: 22px; }
      .buy-card .stat-num { font-size: 28px; }
      .buy-quiet { background: #fff; border: 1.5px solid var(--border-subtle); color: var(--fg-1); }
      .buy-quiet:hover { background: var(--kygo-green-light); border-color: var(--kygo-green); }
      .skip-list { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
      .skip-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: #fff; border: 1.5px dashed var(--border-hover); font-size: 13px; color: var(--fg-2); }
      .skip-chip svg { width: 14px; height: 14px; color: var(--fg-2); }
      .skip-chip strong { color: var(--fg-1); font-weight: 600; }
      .gear-box { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; box-shadow: var(--shadow-md); padding: 4px 20px 16px; }
      .gear-list { list-style: none; margin: 0; padding: 0; }
      .gear-row { display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 6px 14px; padding: 14px 0; border-bottom: 1px solid var(--border-subtle); }
      .gear-ico { width: 40px; height: 40px; border-radius: 10px; background: var(--bg-raised); color: var(--fg-2); display: flex; align-items: center; justify-content: center; grid-row: span 2; }
      .gear-ico svg { width: 20px; height: 20px; }
      .gear-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .gear-top h4 { font-size: 16px; font-weight: 600; }
      .gear-grade { padding: 2px 8px; border-radius: 999px; background: var(--bg-raised); color: var(--fg-2); font-size: 11.5px; font-weight: 600; }
      .gear-text p { margin: 2px 0 0; font-size: 14px; line-height: 1.55; color: var(--fg-2); }
      .gear-src { font-size: 12px; }
      .gear-more { font-size: 12.5px; font-weight: 600; text-decoration: none; white-space: nowrap; }
      .gear-buy { grid-column: 2; justify-self: start; display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 0 14px; border-radius: 10px; background: var(--kygo-green); color: var(--fg-1); text-decoration: none; font-size: 13.5px; font-weight: 600; }
      .gear-buy svg { width: 14px; height: 14px; }
      .gear-skip { margin: 14px 0 0; font-size: 13.5px; line-height: 1.55; color: var(--fg-2); }
      .gear-skip strong { color: var(--fg-1); }

      .sponsor { display: flex; flex-wrap: wrap; gap: 14px 18px; align-items: center; padding: 18px 20px; border-radius: 18px; border: 1.5px solid var(--border-subtle); background: #fff; }
      .sp-pill { padding: 4px 10px; border-radius: 999px; background: var(--bg-raised); color: var(--fg-2); font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; }
      .sp-body { flex: 1 1 300px; }
      .sp-body h4 { font-size: 17px; font-weight: 600; }
      .sp-body p { margin: 4px 0 0; font-size: 14px; color: var(--fg-2); }
      .sp-btn { display: inline-flex; align-items: center; min-height: 46px; padding: 0 20px; border-radius: 10px; border: 1.5px solid var(--fg-1); color: var(--fg-1); text-decoration: none; font-weight: 600; font-size: 14px; }

      .kc-card { display: flex; flex-wrap: wrap; gap: 28px; align-items: center; justify-content: space-between; padding: 32px 24px; border-radius: 24px; background: var(--kygo-dark); color: #fff; }
      .kc-left { flex: 1 1 380px; display: flex; flex-direction: column; gap: 14px; }
      .kc-right { flex: 0 1 320px; }
      .kc-pill { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 999px; background: rgba(110,231,160,0.12); color: var(--on-dark-accent); font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; }
      .kc-dot { width: 6px; height: 6px; border-radius: 999px; background: var(--on-dark-accent); }
      .kc-h { font-size: clamp(24px, 3.6vw, 36px); line-height: 1.08; font-weight: 600; max-width: 22ch; }
      .kc-h span { color: var(--on-dark-accent); }
      .kc-p { margin: 0; font-size: 15.5px; line-height: 1.6; color: rgba(255,255,255,0.72); max-width: 54ch; }

      .tool-footer { padding: 40px 0; background: #fff; border-top: 1px solid var(--border-subtle); text-align: center; }
      .footer-brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; color: var(--fg-1); font-family: 'Space Grotesk', sans-serif; font-weight: 700; }
      .footer-logo { width: 28px; height: 28px; border-radius: 7px; }
      .footer-tagline { margin: 8px 0 14px; color: var(--fg-2); font-size: 14px; }
      .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 18px; margin-bottom: 14px; }
      .footer-links a { color: var(--fg-2); text-decoration: none; font-size: 13.5px; }
      .footer-disclaimer { margin: 0 auto; max-width: 720px; font-size: 12px; line-height: 1.55; color: var(--fg-2); }

      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out); }
      .animate-on-scroll.visible { opacity: 1; transform: none; }

      @media (min-width: 720px) {
        .hero { padding: 72px 0 48px; }
        .kc-card { padding: 48px; }
      }
      @media (min-width: 1000px) {
        .chips { display: none; }
        .body { padding: 48px 0 80px; }
        .layout { display: grid; grid-template-columns: 232px minmax(0, 1fr); gap: 40px; align-items: start; }
        .side { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 24px; padding: 18px; border-radius: 18px; border: 1.5px solid var(--border-subtle); background: #fff; box-shadow: var(--shadow-md); }
        .side-label { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: var(--fg-2); }
        .side-group { display: flex; flex-direction: column; gap: 2px; }
        .side-g { display: flex; justify-content: space-between; align-items: center; min-height: 36px; padding: 0 10px; border-radius: 8px; color: var(--fg-1); text-decoration: none; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; }
        .side-g span { font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 12px; color: var(--fg-2); }
        .side-s { display: flex; align-items: center; gap: 8px; min-height: 34px; padding: 0 10px 0 18px; border-radius: 8px; color: var(--fg-2); text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.2s var(--ease-out); }
        .side-s .dot { width: 6px; height: 6px; border-radius: 999px; background: var(--border-hover); }
        .side-s:hover { background: var(--bg-raised); color: var(--fg-1); }
        .side-s.on { background: var(--kygo-green-light); color: #14532d; font-weight: 600; }
        .side-s.on .dot { background: var(--kygo-green-dark); }
        .side-solo.on { background: var(--kygo-green-light); color: #14532d; }
        .side-top { font-size: 13px; font-weight: 600; text-decoration: none; }
        .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); overflow: visible; margin: 0; padding: 0; gap: 20px; }
        .card { flex: none; }
        .levers { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); overflow: visible; margin: 0; padding: 0; }
        .lever { flex: none; }
        .gear-row { grid-template-columns: 40px minmax(0, 1fr) auto; align-items: center; }
        .gear-ico { grid-row: auto; }
        .gear-buy { grid-column: 3; }
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        .chip, .buy, .side-s { transition: none; }
      }

      /* Unified card system */
      .card { gap: 8px; padding: 18px; box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04); }
      .card-top { gap: 10px; }
      .card-logo { width: 36px; height: 36px; border-radius: 9px; }
      .card-name h4 { font-size: 16px; }
      .place { padding: 3px 9px; font-size: 11.5px; font-weight: 600; background: var(--bg-raised); color: var(--fg-2); white-space: nowrap; }
      .place-1 { background: var(--kygo-dark); color: #fff; }
      .grade-strong { background: var(--kygo-green-light); color: var(--kygo-green-text); }
      .buy-ico { display: flex; align-items: center; justify-content: center; color: var(--fg-2); background: var(--bg-raised); }
      .buy-ico svg { width: 18px; height: 18px; }
      .stat { padding: 6px 0 0; }
      .stat-num { font-size: 30px; }
      .reason { font-size: 14px; }
      .catch { font-size: 12.5px; }
      .src { display: inline; margin: 0; }
      .src::before { content: '· '; }
      .buy { min-height: 42px; background: #fff; border: 1.5px solid var(--border-subtle); color: var(--fg-1); box-shadow: none; }
      .buy:hover { background: var(--kygo-green); border-color: var(--kygo-green); color: var(--fg-1); }
      .conf { background: none; padding: 0; margin-top: 2px; font-size: 12.5px; }
      .imp { gap: 20px; }
      .imp-block { gap: 10px; }
      .imp-h { display: inline; margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: var(--fg-2); }
      .levers { display: flex; flex-direction: column; gap: 0; margin: 0; padding: 4px 18px; overflow: visible; background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 18px; }
      .lever { flex: none; display: grid; grid-template-columns: 96px 1fr; gap: 12px; align-items: baseline; padding: 12px 0; border-top: 1px solid var(--border-subtle); background: none; border-radius: 0; color: var(--fg-1); }
      .lever:first-child { border-top: 0; }
      .lever-num { font-size: 20px; color: var(--kygo-green-dark); }
      .lever-label { font-size: 14px; color: var(--fg-2); }
      .skip-line { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--fg-2); }
      .skip-line strong { color: var(--fg-1); font-weight: 600; }
      .skip-line .imp-h { margin-right: 6px; }
      @media (min-width: 1000px) {
        .levers { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); padding: 0; }
        .lever { display: flex; flex-direction: column; gap: 4px; padding: 16px 18px; border-top: 0; border-left: 1px solid var(--border-subtle); }
        .lever:first-child { border-left: 0; }
        .lever-num { font-size: 24px; }
      }
      .lever.is-neg .lever-num { color: var(--fg-1); }

      /* At a glance */
      .glance { display: flex; flex-direction: column; gap: 14px; scroll-margin-top: 72px; }
      .glance h2 { font-size: clamp(26px, 4vw, 38px); font-weight: 700; letter-spacing: -0.02em; }
      .glance-lede { margin: -8px 0 4px; color: var(--fg-2); font-size: 15px; }
      .g-group { display: flex; flex-direction: column; gap: 8px; margin-top: 6px; }
      .g-h { font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: var(--fg-2); }
      .g-list { display: flex; flex-direction: column; gap: 8px; }
      .g-row { display: grid; grid-template-columns: 1fr auto; gap: 10px 12px; align-items: center; padding: 14px 16px; border-radius: 14px; background: #fff; border: 1.5px solid var(--border-subtle); text-decoration: none; color: var(--fg-1); transition: border-color 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out); }
      .g-row:hover { border-color: var(--kygo-green); box-shadow: 0 6px 18px rgba(15,23,42,0.06); }
      .g-metric { display: flex; align-items: center; gap: 10px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; }
      .g-ico { width: 32px; height: 32px; border-radius: 9px; background: var(--kygo-green-light); color: var(--kygo-green-text); display: flex; align-items: center; justify-content: center; flex: 0 0 32px; }
      .g-slots { grid-column: 1 / -1; grid-row: 2; display: flex; flex-wrap: wrap; gap: 6px 14px; }
      .g-go { color: var(--fg-2); grid-column: 2; grid-row: 1; }
      .g-slot { display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; }
      .g-rank { width: 18px; height: 18px; border-radius: 999px; background: var(--bg-raised); color: var(--fg-2); font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
      .g-slot:first-child .g-rank { background: var(--kygo-dark); color: #fff; }
      .g-logo { width: 22px; height: 22px; border-radius: 6px; object-fit: contain; background: var(--bg-raised); font-size: 12px; }
      .g-brand { font-weight: 500; }
      .g-none { font-size: 13.5px; color: var(--fg-2); }
      .g-tag { padding: 2px 8px; border-radius: 999px; background: var(--kygo-dark); color: #fff; font-size: 11px; font-weight: 700; }
      .g-tag-buy { background: var(--kygo-green-light); color: var(--kygo-green-text); }
      .g-wide .g-brand { color: var(--fg-2); }

      /* Sections as clear blocks */
      .pick-section { background: #fff; border: 1.5px solid var(--border-subtle); border-radius: 24px; padding: 22px 18px; border-top: 1.5px solid var(--border-subtle); box-shadow: 0 2px 10px rgba(15,23,42,0.04); }
      .group-head + .pick-section { border-top: 1.5px solid var(--border-subtle); padding-top: 22px; }
      .group { gap: 20px; }
      .sec-head { margin-bottom: 2px; }
      .sec-copy h3 { font-size: clamp(21px, 2.8vw, 26px); }

      /* Minimal cards inside blocks */
      .card { background: var(--bg-surface); border: 1px solid var(--border-subtle); box-shadow: none; padding: 16px; gap: 10px; flex-basis: 250px; }
      .card-title { font-size: 16px; font-weight: 600; line-height: 1.2; flex: 1; min-width: 0; }
      .card-logo { width: 36px; height: 36px; border-radius: 9px; flex: 0 0 36px; }
      .stat-num { font-size: 30px; }
      .why { font-size: 13px; color: var(--fg-2); }
      .why summary { cursor: pointer; list-style: none; display: inline-flex; align-items: center; gap: 6px; min-height: 32px; font-size: 13px; font-weight: 600; color: var(--kygo-green-text); }
      .why summary::-webkit-details-marker { display: none; }
      .why summary::after { content: '+'; font-size: 15px; line-height: 1; }
      .why[open] summary::after { content: '−'; }
      .why .reason { color: var(--fg-1); margin: 4px 0 6px; font-size: 14px; }
      .why .catch { margin: 0 0 6px; }
      .why .src { display: block; margin: 0; font-size: 12px; }
      .why .src::before { content: none; }
      .levers { background: var(--bg-surface); }
      .grow { display: none; }

      @media (min-width: 720px) {
        .g-row { grid-template-columns: 200px 1fr auto; padding: 12px 18px; }
        .g-slots { grid-column: 2; grid-row: 1; gap: 8px 22px; }
        .g-go { grid-column: 3; }
        .pick-section { padding: 28px 28px 22px; }
      }

      /* Winner card + next closest */
      .feature { display: grid; grid-template-columns: 1fr; gap: 16px; padding: 20px; border-radius: 18px; background: var(--kygo-dark); color: #fff; }
      .f-top { display: flex; align-items: center; gap: 12px; }
      .f-top .card-logo { width: 48px; height: 48px; flex: 0 0 48px; border-radius: 12px; background: #fff; }
      .f-top .buy-ico { background: rgba(110,231,160,0.15); color: var(--on-dark-accent); }
      .f-kicker { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--on-dark-accent); }
      .f-name { font-size: 22px; font-weight: 700; line-height: 1.15; color: #fff; }
      .f-stat { display: flex; flex-direction: column; gap: 2px; margin-top: 14px; }
      .f-num { font-family: 'Space Grotesk', sans-serif; font-size: 52px; font-weight: 700; line-height: 1; letter-spacing: -0.03em; color: #fff; }
      .f-label { font-size: 13.5px; color: rgba(255,255,255,0.72); }
      .f-side { display: flex; flex-direction: column; gap: 8px; }
      .f-reason { margin: 0; font-size: 15px; line-height: 1.5; color: #fff; }
      .feature .catch { margin: 0; font-size: 13px; color: rgba(255,255,255,0.72); }
      .feature .catch strong { color: #fff; }
      .f-src { margin: 0; font-size: 12px; color: rgba(255,255,255,0.55); }
      .buy-primary { margin-top: 6px; background: var(--kygo-green); border-color: var(--kygo-green); color: var(--fg-1); }
      .buy-primary:hover { background: #4ade80; border-color: #4ade80; }
      .next-h { margin: 6px 0 -4px; font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: var(--fg-2); }
      .cards-next .card { flex-basis: 230px; padding: 14px; }
      .cards-next .stat-num { font-size: 24px; }
      .cards-next .card-logo { width: 30px; height: 30px; flex-basis: 30px; }
      .place-4 { background: var(--bg-raised); }
      @media (min-width: 720px) {
        .feature { grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 28px; padding: 26px 28px; align-items: center; }
      }
      @media (min-width: 1000px) {
        .cards-next { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      }

      /* Clean hero */
      .hero { padding: 40px 0 28px; }
      .hero-inner { gap: 12px; }
      .hero-fine { margin: 4px 0 0; font-size: 13px; color: var(--fg-2); }
      .fine-link { padding: 0; border: 0; background: none; font: inherit; color: var(--kygo-green-text); text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
      .hero-disc { margin: 0; max-width: 62ch; font-size: 13px; line-height: 1.5; color: var(--fg-2); }
      @media (min-width: 1000px) { .hero { padding: 56px 0 36px; } }

      /* Cross links between the two pages */
      .sec-links { display: flex; flex-wrap: wrap; gap: 10px 24px; align-items: center; }
      .bridge { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 999px; background: var(--kygo-green-light); color: var(--kygo-green-text); font-size: 14px; font-weight: 600; text-decoration: none; }
      .bridge svg { width: 14px; height: 14px; }
      .bridge:hover { background: #bbf7d0; }
      .cross { position: relative; display: flex; flex-direction: column; gap: 6px; margin-top: 8px; padding: 24px 64px 24px 24px; border-radius: 24px; background: var(--kygo-dark); color: #fff; text-decoration: none; }
      .cross-kicker { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--on-dark-accent); }
      .cross-title { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; line-height: 1.15; }
      .cross-text { font-size: 15px; color: rgba(255,255,255,0.72); }
      .cross-go { position: absolute; right: 24px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 999px; background: var(--kygo-green); color: var(--fg-1); }
      .cross-go svg { width: 18px; height: 18px; }
      .cross:hover .cross-go { background: #4ade80; }

      .page-tabs { align-self: flex-start; display: inline-flex; gap: 4px; padding: 4px; border-radius: 999px; background: var(--bg-raised); margin-bottom: 8px; }
      .page-tabs a { padding: 8px 16px; border-radius: 999px; font-size: 14px; font-weight: 600; color: var(--fg-2); text-decoration: none; }
      .page-tabs a.on { background: var(--kygo-dark); color: #fff; }
      .page-tabs a:not(.on):hover { color: var(--fg-1); }

      /* Title-led sections, brand-led winner */
      .sec-kicker { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--kygo-green-text); margin-bottom: 2px; }
      .sec-copy h3 { font-size: clamp(28px, 4.2vw, 40px); line-height: 1.05; letter-spacing: -0.02em; font-weight: 700; padding-top: 0; }
      .sec-lede { margin-top: 6px; font-size: 15.5px; }
      .sec-copy .conf { display: block; margin-top: 4px; font-size: 12px; color: var(--fg-3); }
      .feature .f-main { display: flex; align-items: center; gap: 18px; }
      .feature .f-main > .card-logo { width: 72px; height: 72px; flex: 0 0 72px; border-radius: 18px; background: #fff; }
      .feature .f-main > .buy-ico { background: rgba(110,231,160,0.15); color: var(--on-dark-accent); }
      .feature .f-main > .buy-ico svg { width: 32px; height: 32px; }
      .feature .f-main > .card-logo-txt { display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 700; color: var(--fg-1); }
      .f-name { font-size: clamp(28px, 3.4vw, 38px); line-height: 1.05; letter-spacing: -0.02em; margin: 2px 0 6px; }
      .feature .f-stat { display: block; margin: 0; font-size: 14px; line-height: 1.4; color: rgba(255,255,255,0.72); }
      .f-stat strong { font-family: 'Space Grotesk', sans-serif; font-size: 20px; color: #fff; margin-right: 4px; }
      .f-reason { font-size: 16px; }
      @media (max-width: 719px) {
        .feature .f-main { gap: 14px; }
        .feature .f-main > .card-logo { width: 52px; height: 52px; flex-basis: 52px; border-radius: 14px; }
      }
      .f-why summary { color: var(--on-dark-accent); }
      .f-why[open] { display: flex; flex-direction: column; gap: 6px; }
      .feature { gap: 20px; }
      .cards-next .card-title { font-size: 18px; font-weight: 700; }

      .f-tested { margin: 4px 0 0; font-size: 12.5px; color: rgba(255,255,255,0.55); }
      .tested { margin: -4px 0 0; font-size: 12px; color: var(--fg-3); }

      /* Amazon product images from the Creators API feed */
      .card-logo.prod-img { display: block; background: #fff; padding: 3px; border: 1px solid var(--border-subtle); }
      .card-logo.prod-img img { display: block; width: 100%; height: 100%; object-fit: contain; color: transparent; font-size: 0; }
      .feature .f-main > .card-logo.prod-img { width: 96px; height: 96px; flex-basis: 96px; padding: 6px; border: 0; }
      .cards-next .card-logo.prod-img { width: 44px; height: 44px; flex-basis: 44px; }
      @media (max-width: 719px) { .feature .f-main > .card-logo.prod-img { width: 72px; height: 72px; flex-basis: 72px; } }
    `;
  }
}

if (!customElements.get('kygo-picks')) customElements.define('kygo-picks', KygoPicks);
