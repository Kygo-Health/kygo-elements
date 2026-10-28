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
 *   focus     which app screen the phone mockup shows, matched to the page's
 *             topic. A metric screen (factor cards): hrv (default), deep, rem,
 *             latency, awake, rhr, sleep, food, supplement, training, steps,
 *             nutrition, readiness, stress (VISUALS). Another screen: advisor,
 *             body, overview, devices, devicesring, devicesduo, meal, exercise,
 *             daily, week, sleepchart, trendsleep, trendmix, trendvitals (SCREENS).
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

  /** Phone mockup, part 1: the app's metric screen (Helping / Hurting /
   *  Developing tabs, the "What we see" summary and factor cards). One per
   *  focus, so each page shows an insight on its own topic. Sample data in the
   *  app's own phrasing, pointing the same way as the research on the page that
   *  uses it. counts = [helping, hurting, developing]. Each card: name, delta
   *  pill, the sentence (cond, change, when), the two compared groups as
   *  [label, value, bar width %] (base first), and the evidence line. */
  const VISUALS = {
    hrv: {
      metric: 'HRV', tab: 'hurting', counts: [4, 6, 9], avg: '48 ms', range: '31–67',
      cards: [
        { name: 'Caffeine after 2 PM', delta: '−8', unit: 'ms', cond: 'go over <b>95 mg</b> after 2 PM', change: '−8 ms lower', when: 'the next day',
          rows: [['Under 95mg', '52 ms', 82], ['Over 95mg', '44 ms', 58]], ev: '41 days · r −0.61' },
        { name: 'Alcohol', delta: '−6', unit: 'ms', cond: 'go over <b>31.2 g</b>', change: '−6 ms lower', when: 'the next day',
          rows: [['Under 31.2g', '51 ms', 80], ['Over 31.2g', '45 ms', 60]], ev: '44 days · r −0.52' }
      ]
    },
    deep: {
      metric: 'Deep Sleep', tab: 'hurting', counts: [3, 7, 38], avg: '66 min', range: '50–104',
      cards: [
        { name: 'Caffeine after 2 PM', delta: '−18', unit: 'min', cond: 'have caffeine <b>after 2 PM</b>', change: '−18 min lower', when: 'that night',
          rows: [['Before 2 PM', '72 min', 82], ['After 2 PM', '54 min', 58]], ev: '42 days · r −0.58' },
        { name: 'Alcohol', delta: '−11', unit: 'min', cond: 'go over <b>31.2 g</b>', change: '−11 min lower', when: 'that night',
          rows: [['Under 31.2g', '70 min', 80], ['Over 31.2g', '59 min', 62]], ev: '44 days · r −0.47' }
      ]
    },
    rem: {
      metric: 'REM Sleep', tab: 'hurting', counts: [3, 8, 36], avg: '91 min', range: '62–118',
      cards: [
        { name: 'Alcohol', delta: '−20', unit: 'min', cond: 'go over <b>31.2 g</b>', change: '−20 min lower', when: 'that night',
          rows: [['Under 31.2g', '98 min', 84], ['Over 31.2g', '78 min', 60]], ev: '44 days · r −0.76' },
        { name: 'Last meal timing', delta: '−9', unit: 'min', cond: 'eat within <b>2 hours</b> of bed', change: '−9 min lower', when: 'that night',
          rows: [['Earlier', '93 min', 82], ['Within 2h', '84 min', 66]], ev: '44 days · r −0.42' }
      ]
    },
    latency: {
      metric: 'Sleep Latency', tab: 'hurting', counts: [2, 6, 11], avg: '17 min', range: '6–38',
      cards: [
        { name: 'Last meal timing', delta: '+12', unit: 'min', cond: 'eat within <b>2 hours</b> of bed', change: '+12 min longer', when: 'to fall asleep',
          rows: [['Earlier', '14 min', 46], ['Within 2h', '26 min', 84]], ev: '44 days · r 0.57' },
        { name: 'Caffeine after 2 PM', delta: '+7', unit: 'min', cond: 'have caffeine <b>after 2 PM</b>', change: '+7 min longer', when: 'to fall asleep',
          rows: [['Before 2 PM', '15 min', 50], ['After 2 PM', '22 min', 72]], ev: '42 days · r 0.41' }
      ]
    },
    awake: {
      metric: 'Awake Time', tab: 'hurting', counts: [2, 7, 14], avg: '29 min', range: '12–52',
      cards: [
        { name: 'Alcohol', delta: '+18', unit: 'min', cond: 'go over <b>31.2 g</b>', change: '+18 min more awake', when: 'that night',
          rows: [['Under 31.2g', '24 min', 44], ['Over 31.2g', '42 min', 80]], ev: '44 days · r 0.63' },
        { name: 'Caffeine after 2 PM', delta: '+9', unit: 'min', cond: 'have caffeine <b>after 2 PM</b>', change: '+9 min more awake', when: 'that night',
          rows: [['Before 2 PM', '26 min', 48], ['After 2 PM', '35 min', 66]], ev: '42 days · r 0.41' }
      ]
    },
    rhr: {
      metric: 'Resting HR', tab: 'helping', counts: [3, 6, 10], avg: '56 bpm', range: '51–62',
      cards: [
        { name: 'Aerobic activity', icon: 'run', delta: '−2', unit: 'bpm', cond: 'log <b>30+ min</b> of aerobic activity', change: '−2 bpm lower', when: 'the next day',
          rows: [['Under 30min', '57 bpm', 76], ['Over 30min', '55 bpm', 64]], ev: '45 days · r −0.46' },
        { name: 'Daily steps', icon: 'run', delta: '−1', unit: 'bpm', cond: 'walk <b>9,000+ steps</b>', change: '−1 bpm lower', when: 'the next day',
          rows: [['Under 9,000', '57 bpm', 74], ['Over 9,000', '56 bpm', 68]], ev: '45 days · r −0.33' }
      ]
    },
    sleep: {
      metric: 'Sleep Score', tab: 'hurting', counts: [3, 8, 12], avg: '74 pts', range: '55–91',
      cards: [
        { name: 'Alcohol', delta: '−12', unit: 'pts', cond: 'go over <b>31.2 g</b>', change: '−12 pts lower', when: 'the next day',
          rows: [['Under 31.2g', '81 pts', 82], ['Over 31.2g', '69 pts', 52]], ev: '44 days · r −0.76' },
        { name: 'Last meal timing', delta: '−8', unit: 'pts', cond: 'eat within <b>2 hours</b> of bed', change: '−8 pts lower', when: 'the next day',
          rows: [['Earlier', '82 pts', 82], ['Within 2h', '74 pts', 60]], ev: '44 days · r −0.42' }
      ]
    },
    food: {
      metric: 'Sleep Score', tab: 'hurting', counts: [4, 8, 12], avg: '74 pts', range: '55–91',
      cards: [
        { name: 'Last meal timing', delta: '−8', unit: 'pts', cond: 'eat within <b>2 hours</b> of bed', change: '−8 pts lower', when: 'the next day',
          rows: [['Earlier', '82 pts', 82], ['Within 2h', '74 pts', 60]], ev: '44 days · r −0.42' },
        { name: 'Added sugar', delta: '−5', unit: 'pts', cond: 'go over <b>50 g</b>', change: '−5 pts lower', when: 'the next day',
          rows: [['Under 50g', '80 pts', 80], ['Over 50g', '75 pts', 64]], ev: '43 days · r −0.36' }
      ]
    },
    supplement: {
      metric: 'Sleep Score', tab: 'helping', counts: [3, 8, 12], avg: '74 pts', range: '55–91',
      cards: [
        { name: 'Magnesium Glycinate', icon: 'supp', delta: '+9', unit: 'pts', cond: 'take <b>Magnesium Glycinate</b>', change: '+9 pts higher', when: 'the next day',
          rows: [['Not taken', '71 pts', 52], ['Taken', '80 pts', 82]], ev: '43 days · r 0.56' },
        { name: 'Strength training', icon: 'lift', delta: '+6', unit: 'pts', cond: 'lift <b>53+ min</b>', change: '+6 pts higher', when: 'that day',
          rows: [['Under 53min', '76 pts', 60], ['Over 53min', '82 pts', 82]], ev: '45 days · r 0.48' }
      ]
    },
    training: {
      metric: 'Sleep Score', tab: 'helping', counts: [3, 8, 12], avg: '74 pts', range: '55–91',
      cards: [
        { name: 'Strength training', icon: 'lift', delta: '+6', unit: 'pts', cond: 'lift <b>53+ min</b>', change: '+6 pts higher', when: 'that day',
          rows: [['Under 53min', '76 pts', 60], ['Over 53min', '82 pts', 82]], ev: '45 days · r 0.48' },
        { name: 'Protein', delta: '+4', unit: 'pts', cond: 'eat <b>120 g+</b> protein', change: '+4 pts higher', when: 'the next day',
          rows: [['Under 120g', '75 pts', 62], ['Over 120g', '79 pts', 76]], ev: '44 days · r 0.37' }
      ]
    },
    readiness: {
      metric: 'Readiness', tab: 'hurting', counts: [4, 7, 10], avg: '78 pts', range: '61–92',
      cards: [
        { name: 'Alcohol', delta: '−9', unit: 'pts', cond: 'go over <b>31.2 g</b>', change: '−9 pts lower', when: 'the next day',
          rows: [['Under 31.2g', '82 pts', 82], ['Over 31.2g', '73 pts', 58]], ev: '44 days · r −0.64' },
        { name: 'Last meal timing', delta: '−5', unit: 'pts', cond: 'eat within <b>2 hours</b> of bed', change: '−5 pts lower', when: 'the next day',
          rows: [['Earlier', '81 pts', 80], ['Within 2h', '76 pts', 64]], ev: '44 days · r −0.38' }
      ]
    },
    steps: {
      metric: 'Sleep Score', tab: 'helping', counts: [4, 7, 12], avg: '74 pts', range: '55–91',
      cards: [
        { name: 'Daily steps', delta: '+5', unit: 'pts', cond: 'walk <b>9,000+ steps</b>', change: '+5 pts higher', when: 'that night',
          rows: [['Under 9,000', '75 pts', 62], ['Over 9,000', '80 pts', 80]], ev: '45 days · r 0.44' },
        { name: 'Strength training', icon: 'lift', delta: '+6', unit: 'pts', cond: 'lift <b>53+ min</b>', change: '+6 pts higher', when: 'that day',
          rows: [['Under 53min', '76 pts', 60], ['Over 53min', '82 pts', 82]], ev: '45 days · r 0.48' }
      ]
    },
    nutrition: {
      metric: 'Readiness', tab: 'helping', counts: [4, 7, 10], avg: '78 pts', range: '61–92',
      cards: [
        { name: 'Protein', delta: '+5', unit: 'pts', cond: 'eat <b>120 g+</b> protein', change: '+5 pts higher', when: 'the next day',
          rows: [['Under 120g', '76 pts', 62], ['Over 120g', '81 pts', 80]], ev: '44 days · r 0.41' },
        { name: 'Water', delta: '+3', unit: 'pts', cond: 'drink <b>2.5 L+</b>', change: '+3 pts higher', when: 'the next day',
          rows: [['Under 2.5L', '77 pts', 66], ['Over 2.5L', '80 pts', 76]], ev: '42 days · r 0.33' }
      ]
    },
    stress: {
      metric: 'Stress', tab: 'hurting', counts: [3, 6, 9], avg: '35 pts', range: '18–58',
      cards: [
        { name: 'Alcohol', delta: '+9', unit: 'pts', cond: 'go over <b>31.2 g</b>', change: '+9 pts higher', when: 'the next day',
          rows: [['Under 31.2g', '32 pts', 50], ['Over 31.2g', '41 pts', 74]], ev: '44 days · r 0.59' },
        { name: 'Caffeine', delta: '+6', unit: 'pts', cond: 'go over <b>300 mg</b>', change: '+6 pts higher', when: 'that day',
          rows: [['Under 300mg', '33 pts', 52], ['Over 300mg', '39 pts', 68]], ev: '41 days · r 0.44' }
      ]
    }
  };

  /** Phone mockup, part 2: the app's other screens, each copied from a real
   *  screen so a page can show the one closest to its topic (Trends for the
   *  accuracy tools, device connections for the ring comparisons, the
   *  exercise log for steps, and so on). Same sample-data rule as VISUALS.
   *  Bars in a Trends card: [height %, colour] with g grey, d dark, r red,
   *  G green; dot = position on the min-max range in %. */
  const SCREENS = {
    advisor: { type: 'advisor', title: 'Alcohol is stealing your REM Sleep',
      text: 'Consuming more than 31.2g of alcohol consistently lowers your REM sleep by 20 minutes.' },
    body: { type: 'body' },
    overview: { type: 'overview' },
    devices: { type: 'devices', on: ['oura', 'apple', 'garmin'] },
    devicesring: { type: 'devices', on: ['oura', 'apple'] },
    devicesduo: { type: 'devices', on: ['fitbit', 'whoop', 'apple'] },
    meal: { type: 'meal' },
    exercise: { type: 'exercise' },
    daily: { type: 'daily' },
    week: { type: 'week' },
    sleepchart: { type: 'trends', chart: true },
    trendsleep: { type: 'trends', section: 'Sleep', cards: [
      { label: 'Sleep Score', dev: 'oura', value: '77', unit: 'pts', min: '61', max: '86', dot: 64, bars: [[80, 'g'], [76, 'g'], [96, 'G'], [62, 'r'], [66, 'r'], [94, 'g'], [72, 'd']] },
      { label: 'Awake Time', dev: 'oura', value: '13', unit: 'min', note: '↓6min below baseline', min: '12min', max: '32min', dot: 5, bars: [[50, 'g'], [86, 'r'], [54, 'g'], [72, 'r'], [100, 'r'], [50, 'g'], [42, 'G']] },
      { label: 'Deep Sleep', dev: 'oura', value: '1h 17m', min: '0h 50m', max: '1h 44m', dot: 50, bars: [[86, 'g'], [86, 'g'], [100, 'G'], [76, 'g'], [56, 'r'], [94, 'g'], [84, 'd']] }
    ] },
    trendmix: { type: 'trends', section: 'Best source for each metric', cards: [
      { label: 'Sleep Score', dev: 'oura', value: '77', unit: 'pts', min: '61', max: '86', dot: 64, bars: [[80, 'g'], [76, 'g'], [96, 'G'], [62, 'r'], [66, 'r'], [94, 'g'], [72, 'd']] },
      { label: 'Aerobic Activity', dev: 'garmin', value: '74', unit: 'min', min: '24min', max: '129min', dot: 47, bars: [[92, 'g'], [100, 'g'], [82, 'g'], [30, 'r'], [60, 'g'], [86, 'g'], [96, 'd']] },
      { label: 'Resting HR', dev: 'oura', value: '56', unit: 'bpm', min: '51', max: '62', dot: 45, bars: [[60, 'g'], [70, 'g'], [56, 'G'], [86, 'r'], [76, 'g'], [62, 'g'], [66, 'd']] }
    ] },
    trendvitals: { type: 'trends', section: 'Vitals', cards: [
      { label: 'VO₂ Max', dev: 'garmin', value: '47', unit: 'ml/kg/min', min: '46', max: '47', dot: 85, bars: [[100, 'G'], [100, 'g'], [100, 'G'], [100, 'g'], [100, 'G'], [100, 'g'], [100, 'd']] },
      { label: 'SpO₂', dev: 'oura', value: '97', unit: '%', min: '96', max: '98', dot: 50, bars: [[100, 'g'], [100, 'g'], [100, 'g'], [100, 'g'], [100, 'r'], [100, 'g'], [100, 'd']] },
      { label: 'High Stress Time', dev: 'garmin', value: '19', unit: 'min', min: '11min', max: '30min', dot: 42, bars: [[54, 'g'], [86, 'r'], [54, 'g'], [100, 'r'], [86, 'r'], [64, 'g'], [70, 'd']] }
    ] }
  };

  /** Device badges, as the app shows them beside a metric or connection. */
  const DEVICES = {
    oura: { name: 'Oura Ring', sub: 'Sleep, recovery & readiness' },
    apple: { name: 'Apple Health', sub: 'Health & activity data' },
    fitbit: { name: 'Fitbit', sub: 'Activity & health tracking' },
    garmin: { name: 'Garmin', sub: 'Sports & fitness tracking' },
    polar: { name: 'Polar', sub: 'Polar watch, Loop or 360' },
    whoop: { name: 'WHOOP', sub: 'Recovery & strain tracking' }
  };
  const badge = (d) => `<span class="dv dv-${d}"><i></i></span>`;

  /** Bottom tab bar icons. */
  const TAB_ICONS = {
    Today: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="currentColor"/><rect x="6" y="11" width="5" height="4" rx="1" fill="#fff"/><path d="M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    Food: '<svg viewBox="0 0 24 24"><path d="M12 7c-2-2-7-1.5-7 4.5 0 4 2.5 9.5 5 9.5 1 0 1.3-.5 2-.5s1 .5 2 .5c2.5 0 5-5.5 5-9.5C19 5.5 14 5 12 7z" fill="currentColor"/><path d="M12 7c0-2 1-3.5 3-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>',
    Trends: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16l5-5 4 3 5-6 4 3"/></svg>',
    Correlation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><path d="M6 7c0 5 6 5 6 10M18 7c0 5-6 5-6 10"/></svg>'
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

    /** The phone: status bar, the app's header, one screen, the tab bar. */
    _phone() {
      const key = clean(this._getSetting('focus', 'hrv'), 12);
      const sc = SCREENS[key] || Object.assign({ type: 'factors' }, VISUALS[key] || VISUALS.hrv);
      const icons = '<span class="p-ib"><i class="ic-chat"></i></span><span class="p-ib"><i class="ic-gear"></i></span>';
      const day = '<span class="p-day">Day 45</span>';
      const back = '<span class="p-back"></span>';
      let head, body, tab = 'Correlation', bar = true;
      switch (sc.type) {
        case 'advisor': head = ['', 'Correlations', day]; body = this._advisor(sc); break;
        case 'body': head = ['', 'Correlations', day]; body = this._body(); break;
        case 'overview': head = ['', 'Correlations', day]; body = this._overview(); break;
        case 'devices': head = [back, 'Settings', '<span class="p-ib"><i class="ic-chat"></i></span>']; body = this._devices(sc); tab = 'Today'; break;
        case 'meal': head = null; body = this._meal(); bar = false; break;
        case 'exercise': head = ['', 'Food', icons]; body = this._exercise(); tab = 'Food'; break;
        case 'daily': head = ['', 'Food', icons]; body = this._daily(); tab = 'Food'; break;
        case 'week': head = ['', 'Trends', icons]; body = this._week(); tab = 'Trends'; break;
        case 'trends': head = ['', 'Trends', icons]; body = sc.chart ? this._sleepChart() : this._trends(sc); tab = 'Trends'; break;
        default: head = [back, sc.metric, day]; body = this._factors(sc);
      }
      const tabs = ['Today', 'Food', '+', 'Trends', 'Correlation'].map((t) => t === '+'
        ? '<span class="p-plus">+</span>'
        : `<span class="${t === tab ? 'on' : ''}">${TAB_ICONS[t]}${t}</span>`).join('');
      return `
        <div class="phone" aria-hidden="true"><div class="screen">
          <div class="island"></div>
          <div class="status"><span>9:41</span><span class="sig"><i></i><i></i><i></i><i></i><span class="batt"></span></span></div>
          ${head ? `<div class="p-nav">${head[0]}<span class="p-title">${esc(head[1])}</span><span class="p-right">${head[2]}</span></div>` : ''}
          ${body}
          ${bar ? `<div class="p-bar">${tabs}</div>` : ''}
        </div></div>`;
    }

    _factors(v) {
      const neg = v.tab === 'hurting';
      const c0 = v.cards[0];
      const card = (c, i) => `
              <div class="p-card">
                <div class="p-ct"><span class="p-name">${c.icon ? `<i class="fi fi-${c.icon}"></i>` : ''}${esc(c.name)}</span><span class="p-pill ${neg ? 'neg' : 'pos'}">${esc(c.delta)}<small>${esc(c.unit)}</small></span></div>
                <p class="p-txt">Days you ${c.cond}, your ${esc(v.metric)} runs <b class="${neg ? 'neg' : 'pos'}">${esc(c.change)}</b> ${esc(c.when)}.</p>
                <div class="p-cmp">${c.rows.map((r, j) => `
                  <div class="p-row"><span class="p-lbl">${esc(r[0])}</span><span class="p-track"><span class="${j ? (neg ? 'neg' : 'pos') : 'base'}" style="width:${Number(r[2])}%"></span></span><span class="p-val">${esc(r[1])}</span></div>`).join('')}
                </div>
                <div class="p-ev"><span class="p-rank">#${i + 1}</span><b>Strong evidence</b><span> · ${esc(c.ev)}</span></div>
              </div>`;
      return `
          <div class="p-tabs"><span class="${neg ? '' : 'on pos'}">Helping <em>${v.counts[0]}</em></span><span class="${neg ? 'on neg' : ''}">Hurting <em>${v.counts[1]}</em></span><span>Developing <em>${v.counts[2]}</em></span></div>
          <div class="p-body">
            <p class="p-src"><i class="ic-watch"></i>Data from Oura · Apple Health · Garmin</p>
            <div class="p-card p-see">
              <p class="p-cap">What we see</p>
              <p class="p-big">${esc(c0.name)} is your <span class="${neg ? 'neg' : 'pos'}">biggest ${neg ? 'drag' : 'lift'} on</span> ${esc(v.metric)}.</p>
              <div class="p-stats"><span><small>Tracking</small>45 days</span><span><small>Average</small>${esc(v.avg)}</span><span><small>Range</small>${esc(v.range)}</span></div>
            </div>
            <p class="p-cap p-cnt">${v.counts[neg ? 1 : 0]} factors<span>Sort by <b>Impact</b></span></p>${v.cards.map(card).join('')}
          </div>`;
    }

    _advisor(v) {
      return `
          <div class="p-body">
            <div class="p-card p-adv">
              <p class="p-kygo"><i class="ic-kygo"></i>Kygo Advisor</p>
              <p class="p-cap2">Today’s insight · Day 45</p>
              <p class="p-big">${esc(v.title)}</p>
              <p class="p-lede">${esc(v.text)}</p>
              <div class="p-thumbs"><span>👍</span><span>👎</span></div>
            </div>
            <div class="p-card">
              <div class="p-sec"><span class="p-sq">🚀</span><span><b>Your progress</b><small>Overlap days unlock insights</small></span></div>
              <div class="p-steps"><i></i><i></i><i></i><i></i></div>
              <p class="p-live">Your insights are live</p>
              <div class="p-tiles"><span><b>45</b> days<small>Food logged</small></span><span><b>45</b> days<small>Wearable data</small></span></div>
            </div>
          </div>`;
    }

    _body() {
      return `
          <div class="p-body">
            <div class="p-card">
              <div class="p-sec"><span class="p-sq"><i class="ic-watch g"></i></span><span><b>Wearable insights</b><small>Patterns from your wearable’s data</small></span></div>
              <div class="p-card p-inner">
                <p class="p-name">Body signals</p>
                <p class="p-txt">Your skin temperature and resting heart rate moved together across 45 nights. This is the pattern illness, alcohol and hard days leave behind.</p>
                <div class="p-cmp">
                  <div class="p-row"><span class="p-lbl">Cool nights</span><span class="p-track"><span class="base" style="width:48%"></span></span><span class="p-val">54.3 bpm</span></div>
                  <div class="p-row"><span class="p-lbl">Warm nights</span><span class="p-track"><span class="ink" style="width:84%"></span></span><span class="p-val">59.6 bpm</span></div>
                </div>
                <div class="p-ev"><b>Strong pattern</b><span> · 45 nights</span></div>
              </div>
            </div>
          </div>`;
    }

    _overview() {
      const rows = [['moon', 'Sleep Score', 'What’s influencing your sleep score', 11, 12], ['bed', 'Deep Sleep', 'What drives deep sleep', 19, 38], ['eye', 'REM Sleep', 'What shapes your REM sleep', 18, 36]];
      return `
          <div class="p-body">
            <div class="p-card p-flush">
              <div class="p-sech"><b>Sleep</b><small>5 metrics · 70 found · 166 developing</small></div>${rows.map((r) => `
              <div class="p-met">
                <div class="p-sec"><span class="p-sq"><i class="ic-${r[0]}"></i></span><span><b class="p-mt">${r[1]}</b><small>${r[2]}</small></span><span class="p-new">${r[3]} NEW</span></div>
                <div class="p-tiles"><span><b class="g">${r[3]}</b><small>Found</small></span><span><b>${r[4]}</b><small>Developing</small></span></div>
              </div>`).join('')}
            </div>
          </div>`;
    }

    _devices(v) {
      return `
          <div class="p-body">
            <p class="p-cap p-gap">Device connections</p>
            <div class="p-card p-flush">${Object.keys(DEVICES).map((d) => {
              const on = v.on.indexOf(d) >= 0;
              return `
              <div class="p-dev">${badge(d)}<span class="p-dt"><b>${DEVICES[d].name}</b><small>${DEVICES[d].sub}</small></span><span class="p-st ${on ? 'ok' : 'no'}">${on ? 'Connected' : 'Not Connected'}</span></div>`;
            }).join('')}
            </div>
          </div>`;
    }

    _meal() {
      const foods = [['Grilled Salmon', '458', '37P · 5C · 32F', 'Serving'], ['Cooked Quinoa', '222', '8P · 39C · 4F', 'Cup'], ['Roasted Asparagus', '105', '4P · 7C · 8F', 'Serving']];
      return `
          <div class="p-mnav"><span class="p-back"></span><span class="p-chip">Dinner ▾</span><span class="p-chip">7:12 PM</span><span class="p-chip sq">+</span></div>
          <p class="p-pow">Powered by <b>Nutritionix</b></p>
          <div class="p-body">
            <p class="p-kygo"><i class="ic-kygo"></i>Kygo Advisor</p>
            <div class="p-card p-flush">${foods.map((f) => `
              <div class="p-food"><div class="p-ft"><b>${f[0]}</b><span><b>${f[1]}</b> cal<small>${f[2]}</small></span></div>
                <div class="p-ctl"><span class="p-step">−&nbsp;&nbsp;1&nbsp;&nbsp;+</span><span class="p-sel">${f[3]} ▾</span><span class="p-sel r">3 options ▾</span></div></div>`).join('')}
            </div>
            <div class="p-log"><span><b>785 cal</b> · 3 foods</span><span class="p-save">Save</span><span class="p-btn">Log Meal</span></div>
            <div class="p-ask">What do you want to track?<i></i></div>
          </div>`;
    }

    _exerciseCard(rows, earned, head) {
      return `
            <div class="p-card p-flush">
              <div class="p-sech row"><span><b>Exercise</b><small>${head}</small></span><span class="p-add">+</span></div>${rows.map((r) => `
              <div class="p-ex"><span class="p-sq g">${r[0]}</span><span class="p-dt"><b>${r[1]}</b><small>${r[2]}</small></span><span class="p-cal">${r[3]}</span>${r[4] ? badge(r[4]) : ''}</div>`).join('')}
              <div class="p-earn"><b>${earned[0]}</b><span>${earned[1]} ›</span></div>
            </div>`;
    }

    _exercise() {
      return `
          <div class="p-body">${this._exerciseCard([
            ['🧘', 'Vinyasa yoga', '9:53 AM · 45 min', '+168 cal', ''],
            ['🚶', 'Walking', '3:36 PM · 32 min', '+160 cal', 'oura'],
            ['👟', 'Other activity', 'Steps and movement', '+324 cal', '']
          ], ['Earned', '+518 cal'], '2 workouts · 1 h 17 min · 328 cal')}
            <div class="p-card">
              <div class="p-sech row bare"><b>Hydration</b><span class="p-add">+</span></div>
              <p class="p-num"><b>100.5</b> / 68 oz<span>+32.9 oz over</span></p>
              <div class="p-full"></div>
            </div>
          </div>`;
    }

    _daily() {
      const m = [['Protein', '87g', '108g', 80], ['Carbs', '150g', '271g', 55], ['Fats', '59g', '72g', 82]];
      return `
          <div class="p-body">
            <div class="p-card">
              <p class="p-cap">Daily totals</p>
              <div class="p-dt2"><span class="p-ring"><b>1,404</b><small>CAL</small></span>
                <span class="p-rem"><small>Remaining</small><b>772</b> cal<span class="p-goal"><span>Goal<small>1,875 base <em>+ 301 earned</em></small></span><b>2,176</b></span></span></div>
              ${m.map((x) => `<div class="p-mac"><span>${x[0]}</span><span><b>${x[1]}</b> / ${x[2]}</span></div><div class="p-mb"><i style="width:${x[3]}%"></i></div>`).join('')}
            </div>${this._exerciseCard([
              ['🏃', 'Morning Run', '6:41 AM · 36 min', '+438 cal', 'garmin'],
              ['👟', 'Other activity', 'Steps and movement so far', '+165 cal', '']
            ], ['Earned so far', '+301 cal'], '1 workout · 36 min · 438 cal')}
          </div>`;
    }

    _week() {
      const rows = [
        ['♡', 'Resting heart rate', '↑ 2%', '', '56 bpm daily average', '7/7 days recorded · Similar to the previous week'],
        ['👣', 'Steps', '↓ 19%', 'neg', '2,569 steps lower on average', '10,804 steps vs 13,373 steps the previous week'],
        ['🍎', 'Food logging', '– Same', '', 'Food logged on 7 of 7 days', '122 g protein per logged day']
      ];
      return `
          <div class="p-body">
            <div class="p-card p-flush">
              <div class="p-sec pad"><span class="p-sq"><i class="ic-cal"></i></span><span><b>Your week</b><small>Oct 20 – Oct 26 · Excludes today</small></span></div>${rows.map((r) => `
              <div class="p-wk"><span class="p-wi">${r[0]}</span><span class="p-dt"><span class="p-wh"><small>${r[1]}</small><em class="${r[3]}">${r[2]}</em></span><b>${r[4]}</b><small>${r[5]}</small></span></div>`).join('')}
            </div>
          </div>`;
    }

    _trendCard(c) {
      return `
            <div class="p-card p-tr">
              <div class="p-trt"><span><small>${esc(c.label)} ${c.dev ? badge(c.dev) : ''}</small><b>${esc(c.value)}</b>${c.unit ? ` <em>${esc(c.unit)}</em>` : ''}${c.note ? `<span class="p-note">${esc(c.note)}</span>` : ''}</span>
                <span class="p-mini">${c.bars.map((x) => `<i class="${x[1]}" style="height:${x[0]}%"></i>`).join('')}</span></div>
              <div class="p-rng"><span>${esc(c.min)}</span><span class="p-line"><i style="left:${Number(c.dot)}%"></i></span><span>${esc(c.max)}</span></div>
            </div>`;
    }

    _trends(v) {
      return `
          <div class="p-body">
            <p class="p-cap p-gap">${esc(v.section)}</p>${v.cards.map((c) => this._trendCard(c)).join('')}
          </div>`;
    }

    _sleepChart() {
      const d = [['W', 82, 'g'], ['T', 79, 'g'], ['F', 86, 'G'], ['S', 67, 'r'], ['S', 71, 'r'], ['M', 84, 'g'], ['Today', 77, 'd']];
      return `
          <div class="p-body">
            <p class="p-cap p-gap">Sleep</p>
            <div class="p-card p-tr">
              <div class="p-trt"><span><small>Sleep Score ${badge('oura')}</small><b>77</b> <em>pts</em></span>
                <span class="p-mini">${d.map((x) => `<i class="${x[2]}" style="height:${(x[1] - 55) * 3}%"></i>`).join('')}</span></div>
              <div class="p-rng"><span>61</span><span class="p-line"><i style="left:64%"></i></span><span>86</span></div>
              <p class="p-base">Baseline 80 pts · 30-day average</p>
              <div class="p-chart"><span class="p-bl"></span>${d.map((x) => `<span class="p-col"><small>${x[1]}</small><i class="${x[2]}" style="height:${(x[1] - 50) * 1.9}px"></i><em>${x[0]}</em></span>`).join('')}</div>
              <p class="p-leg"><i class="G"></i>Above baseline <i class="g"></i>Within range <i class="r"></i>Below baseline</p>
              <div class="p-stats box"><span><small>30-day avg</small>80 pts</span><span><small>Range</small>61–86</span><span><small>Vs yesterday</small><em>−7</em></span></div>
            </div>
          </div>`;
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
          .screen i { font-style: normal; }
          .island { position: absolute; top: 8px; left: 50%; margin-left: -38px; width: 76px; height: 22px; border-radius: 12px; background: #0B1220; z-index: 3; }
          .status { display: flex; justify-content: space-between; align-items: center; padding: 11px 20px 0; height: 30px; font-size: 11px; font-weight: 700; background: #fff; }
          .sig { display: inline-flex; align-items: flex-end; gap: 1.5px; }
          .sig i { display: block; width: 2.5px; border-radius: 1px; background: #0F172A; }
          .sig i:nth-child(1) { height: 4px; } .sig i:nth-child(2) { height: 5.5px; } .sig i:nth-child(3) { height: 7px; } .sig i:nth-child(4) { height: 8.5px; }
          .batt { width: 15px; height: 7.5px; margin-left: 4px; border-radius: 2.5px; border: 1.2px solid #22C55E; background: linear-gradient(90deg, #22C55E 70%, transparent 70%); }
          .p-nav { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; height: 32px; background: #fff; box-shadow: 0 4px 8px -6px rgba(15,23,42,.16); }
          .p-back { position: absolute; left: 14px; width: 7px; height: 7px; border-left: 1.6px solid #0F172A; border-bottom: 1.6px solid #0F172A; transform: rotate(45deg); }
          .p-title { font-family: 'Space Grotesk', sans-serif; font-size: 12.5px; font-weight: 600; letter-spacing: .2px; }
          .p-right { position: absolute; right: 9px; display: flex; gap: 4px; }
          .p-day { padding: 3px 8px; border-radius: 99px; background: #22C55E; color: #fff; font-size: 9px; font-weight: 700; }
          .p-ib { width: 17px; height: 17px; border-radius: 5px; background: #F1F5F9; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: center; }
          .p-ib i { position: relative; width: 9px; height: 8px; border: 1.2px solid #0F172A; border-radius: 4px 4px 4px 1px; }
          .p-ib .ic-chat::after { content: '···'; position: absolute; left: 0; right: 0; top: -4.5px; text-align: center; font-size: 7px; font-weight: 700; letter-spacing: -.5px; }
          .p-ib .ic-gear { width: 8px; height: 8px; border-radius: 50%; border: 2px dotted #0F172A; }
          .p-tabs { display: flex; background: #fff; box-shadow: 0 4px 8px -6px rgba(15,23,42,.18); position: relative; z-index: 1; }
          .p-tabs span { flex: 1; display: flex; align-items: center; justify-content: center; gap: 3px; padding: 6px 0 7px; font-size: 8.5px; font-weight: 600; color: #64748B; border-bottom: 2px solid transparent; white-space: nowrap; }
          .p-tabs em { font-style: normal; font-size: 7.5px; padding: 0 4px; border-radius: 99px; background: #EEF2F6; color: #475569; }
          .p-tabs .on { color: #0F172A; }
          .p-tabs .on.pos { border-color: #22C55E; } .p-tabs .on.pos em { background: #DCFCE7; color: #16A34A; }
          .p-tabs .on.neg { border-color: #EF4444; } .p-tabs .on.neg em { background: #FEE2E2; color: #EF4444; }
          .p-body { padding: 8px 9px 60px; }
          .p-src { display: flex; align-items: center; gap: 4px; font-size: 8px; color: #64748B; margin: 0 2px 7px; }
          .ic-watch { display: inline-block; width: 5px; height: 8px; border: 1.1px solid #64748B; border-radius: 2px; }
          .ic-watch.g { border-color: #22C55E; width: 7px; height: 10px; border-width: 1.5px; }
          .p-card { padding: 9px 9px 7px; margin-bottom: 8px; border-radius: 13px; background: #fff; border: 1px solid #E8EDF3; box-shadow: 0 4px 12px -8px rgba(15,23,42,.22); }
          .p-card.p-flush { padding: 0; overflow: hidden; }
          .p-cap { font-size: 7.5px; font-weight: 600; letter-spacing: .6px; text-transform: uppercase; color: #64748B; margin-bottom: 3px; }
          .p-cap.p-gap { margin: 4px 3px 6px; font-size: 8.5px; }
          .p-cnt { display: flex; justify-content: space-between; margin: 10px 2px 6px; }
          .p-cnt span { text-transform: none; letter-spacing: 0; font-weight: 500; } .p-cnt b { color: #0F172A; }
          .p-big { font-family: 'Space Grotesk', sans-serif; font-size: 12.5px; line-height: 1.25; font-weight: 600; }
          .p-big .neg { color: #EF4444; } .p-big .pos { color: #16A34A; }
          .p-stats { display: flex; margin-top: 7px; padding-top: 6px; border-top: 1px solid #EEF2F6; }
          .p-stats span { flex: 1; font-size: 9.5px; font-weight: 600; }
          .p-stats small { display: block; font-size: 6.5px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; color: #64748B; }
          .p-stats em { font-style: normal; color: #EF4444; }
          .p-stats.box { margin-top: 6px; padding: 5px 4px; border: 0; border-radius: 7px; background: #F1F4F8; text-align: center; }
          .p-ct { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
          .p-name { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 600; line-height: 1.2; }
          .fi { display: inline-block; position: relative; width: 9px; height: 8px; margin-right: 4px; vertical-align: -0.5px; }
          .fi-supp { border: 1.1px solid #475569; border-radius: 2px; }
          .fi-supp::after { content: '+'; position: absolute; inset: 0; font-size: 7px; line-height: 6px; text-align: center; font-weight: 700; color: #475569; }
          .fi-lift { height: 2px; vertical-align: 2px; background: #475569; box-shadow: -1px 0 0 1px #475569, 1px 0 0 1px #475569; border-radius: 1px; }
          .fi-run { width: 8px; height: 8px; border-radius: 50%; border: 1.3px solid #475569; }
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
          .p-track .base { background: #64748B; } .p-track .neg { background: #EF4444; } .p-track .pos { background: #22C55E; } .p-track .ink { background: #0F172A; }
          .p-val { width: 38px; text-align: right; font-size: 8.5px; font-weight: 600; white-space: nowrap; }
          .p-ev { display: flex; align-items: center; gap: 4px; margin-top: 6px; padding-top: 5px; border-top: 1px solid #EEF2F6; font-size: 7.5px; color: #64748B; white-space: nowrap; overflow: hidden; }
          .p-ev b { color: #0F172A; font-weight: 600; }
          .p-rank { padding: 1px 4px; border-radius: 4px; background: #0F172A; color: #fff; font-weight: 700; }
          .p-kygo { display: flex; align-items: center; gap: 5px; font-size: 9.5px; font-weight: 500; color: #475569; margin: 0 2px 5px; }
          .ic-kygo { width: 9px; height: 9px; border: 1.8px solid #22C55E; border-radius: 3px; transform: rotate(45deg); }
          .p-adv { padding: 11px 11px 9px; }
          .p-cap2 { font-size: 8.5px; color: #64748B; margin-bottom: 5px; }
          .p-adv .p-big { font-size: 15px; margin-bottom: 6px; }
          .p-lede { font-size: 9.5px; line-height: 1.45; color: #64748B; }
          .p-thumbs { display: flex; justify-content: flex-end; gap: 5px; margin-top: 7px; }
          .p-thumbs span { width: 17px; height: 17px; border-radius: 5px; background: #EEF2F6; font-size: 8px; display: flex; align-items: center; justify-content: center; filter: grayscale(1); }
          .p-sec { display: flex; align-items: center; gap: 7px; }
          .p-sec.pad { padding: 9px; border-bottom: 1px solid #EEF2F6; }
          .p-sec b { display: block; font-size: 9px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; }
          .p-sec small { display: block; font-size: 8px; color: #64748B; }
          .p-sq { flex: none; width: 21px; height: 21px; border-radius: 6px; background: #F1F5F9; display: flex; align-items: center; justify-content: center; font-size: 10px; }
          .p-steps { position: relative; display: flex; justify-content: space-between; margin: 10px 10px 6px; }
          .p-steps::before { content: ''; position: absolute; left: 4px; right: 4px; top: 50%; height: 2px; margin-top: -1px; background: #22C55E; }
          .p-steps i { position: relative; width: 12px; height: 12px; border-radius: 50%; background: #22C55E; }
          .p-steps i::after { content: ''; position: absolute; left: 4px; top: 2.5px; width: 3px; height: 5px; border-right: 1.3px solid #fff; border-bottom: 1.3px solid #fff; transform: rotate(45deg); }
          .p-live { text-align: center; font-size: 9.5px; font-weight: 500; margin-bottom: 6px; }
          .p-tiles { display: flex; gap: 6px; }
          .p-tiles span { flex: 1; padding: 6px 7px; border-radius: 8px; background: #F1F4F8; border: 1px solid #E5EAF0; font-size: 8px; color: #64748B; }
          .p-tiles b { font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 700; color: #0F172A; }
          .p-tiles b.g { color: #22C55E; }
          .p-tiles small { display: block; font-size: 7.5px; font-weight: 600; letter-spacing: .4px; text-transform: uppercase; }
          .p-inner { margin: 8px 0 0; box-shadow: none; }
          .p-inner .p-txt { font-size: 8.5px; }
          .p-sech { padding: 9px 10px; border-bottom: 1px solid #EEF2F6; }
          .p-sech b { display: block; font-size: 8.5px; font-weight: 600; letter-spacing: .6px; text-transform: uppercase; color: #475569; }
          .p-sech small { font-size: 8px; color: #64748B; }
          .p-sech.row { display: flex; justify-content: space-between; align-items: center; }
          .p-sech.bare { border: 0; padding: 0 0 4px; }
          .p-add { width: 17px; height: 17px; border-radius: 5px; border: 1px solid #E2E8F0; background: #F8FAFC; font-size: 12px; line-height: 15px; text-align: center; }
          .p-met { padding: 8px 10px; border-bottom: 1px solid #EEF2F6; }
          .p-met .p-sec { margin-bottom: 6px; }
          .p-met .p-mt { font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; letter-spacing: 0; text-transform: none; }
          .p-new { margin-left: auto; padding: 1px 5px; border-radius: 5px; border: 1px solid #86EFAC; background: #F0FDF4; color: #16A34A; font-size: 7px; font-weight: 700; white-space: nowrap; }
          .ic-moon { width: 9px; height: 9px; border-radius: 50%; box-shadow: -2.5px 1.5px 0 0 #22C55E; transform: translateX(2px); }
          .ic-bed { width: 11px; height: 6px; border-radius: 2px 2px 1px 1px; background: #22C55E; }
          .ic-eye { width: 11px; height: 7px; border-radius: 50%; border: 1.5px solid #22C55E; }
          .ic-cal { width: 10px; height: 9px; border-radius: 2px; background: #22C55E; }
          .p-dev, .p-ex { display: flex; align-items: center; gap: 7px; padding: 7px 9px; border-bottom: 1px solid #EEF2F6; }
          .p-dt { flex: 1; min-width: 0; }
          .p-dt b { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 600; }
          .p-dt small { display: block; font-size: 7.5px; color: #64748B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .p-st { flex: none; padding: 2px 5px; border-radius: 99px; font-size: 7px; font-weight: 600; white-space: nowrap; }
          .p-st.ok { background: #DCFCE7; color: #16A34A; } .p-st.no { background: #FEE2E2; color: #EF4444; }
          .p-st::before { content: '●'; margin-right: 2px; font-size: 6px; }
          .dv { flex: none; position: relative; display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 5px; vertical-align: middle; }
          .p-trt .dv, .p-ex .dv { width: 11px; height: 11px; border-radius: 3px; }
          .dv i { display: block; }
          .dv-oura { background: #2B3A55; } .dv-oura i { width: 45%; height: 45%; border: 1.3px solid #fff; border-radius: 50%; }
          .dv-apple { background: #fff; border: 1px solid #E2E8F0; } .dv-apple i { width: 40%; height: 40%; background: #EF4444; transform: rotate(45deg); border-radius: 50% 50% 0 50%; }
          .dv-fitbit { background: #00B0B9; } .dv-fitbit i { width: 45%; height: 45%; background: radial-gradient(circle, #fff 22%, transparent 26%) 0 0 / 33% 33%; }
          .dv-garmin { background: #1E293B; } .dv-garmin i { width: 50%; height: 50%; border: 1.6px solid #38BDF8; border-right-color: transparent; border-radius: 50%; }
          .dv-polar { background: #fff; border: 1px solid #E2E8F0; } .dv-polar i { width: 50%; height: 50%; border-radius: 50%; background: linear-gradient(#DC2626 45%, #fff 45%, #fff 58%, #DC2626 58%); }
          .dv-whoop { background: #000; } .dv-whoop i { width: 55%; height: 55%; border: 1.2px solid #fff; border-radius: 50%; }
          .p-mnav { display: flex; align-items: center; gap: 4px; height: 32px; padding: 0 9px 0 26px; position: relative; background: #F4F6F9; }
          .p-mnav .p-back { left: 12px; top: 12px; }
          .p-chip { padding: 3px 6px; border-radius: 6px; border: 1px solid #E2E8F0; background: #fff; font-size: 8.5px; font-weight: 500; }
          .p-chip.sq { margin-left: auto; }
          .p-pow { text-align: center; font-size: 7.5px; color: #64748B; }
          .p-pow b { color: #475569; }
          .p-food { padding: 7px 9px; border-bottom: 1px solid #EEF2F6; border-left: 2px solid #22C55E; }
          .p-ft { display: flex; justify-content: space-between; }
          .p-ft > b { font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 600; }
          .p-ft span { text-align: right; font-size: 7.5px; color: #64748B; }
          .p-ft span b { font-size: 10.5px; color: #0F172A; }
          .p-ft small { display: block; font-size: 7px; }
          .p-ctl { display: flex; gap: 4px; margin-top: 4px; }
          .p-step, .p-sel { padding: 2px 5px; border-radius: 5px; border: 1px solid #E2E8F0; font-size: 7.5px; color: #475569; }
          .p-sel.r { margin-left: auto; }
          .p-log { display: flex; align-items: center; gap: 7px; margin: 0 0 7px; padding: 6px 8px; border-radius: 10px; background: #fff; box-shadow: 0 4px 12px -8px rgba(15,23,42,.3); font-size: 8.5px; color: #64748B; }
          .p-log b { color: #0F172A; }
          .p-save { margin-left: auto; color: #22C55E; font-weight: 700; }
          .p-btn { padding: 4px 8px; border-radius: 6px; background: #22C55E; color: #fff; font-weight: 700; }
          .p-ask { display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; border-radius: 8px; border: 1px solid #E2E8F0; background: #fff; font-size: 8.5px; color: #64748B; }
          .p-ask i { width: 16px; height: 16px; border-radius: 5px; background: #94A3B8; }
          .p-sq.g { background: #F1F5F9; font-size: 9px; }
          .p-cal { font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 600; white-space: nowrap; }
          .p-earn { display: flex; justify-content: space-between; padding: 7px 9px; font-size: 9.5px; }
          .p-earn b { font-weight: 600; } .p-earn span { color: #16A34A; font-weight: 700; }
          .p-num { display: flex; align-items: baseline; gap: 3px; font-size: 8.5px; color: #64748B; }
          .p-num b { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; color: #0F172A; }
          .p-num span { margin-left: auto; }
          .p-full { height: 4px; margin-top: 5px; border-radius: 99px; background: #22C55E; }
          .p-dt2 { display: flex; align-items: center; gap: 10px; margin: 6px 0 8px; padding-bottom: 8px; border-bottom: 1px solid #EEF2F6; }
          .p-ring { flex: none; width: 62px; height: 62px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center;
            background: radial-gradient(closest-side, #fff 80%, transparent 82%), conic-gradient(#22C55E 0 64%, #E2E8F0 64% 100%); }
          .p-ring b { font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 700; line-height: 1; }
          .p-ring small { font-size: 6.5px; color: #64748B; letter-spacing: .5px; }
          .p-rem { flex: 1; font-size: 8px; color: #64748B; }
          .p-rem > small { display: block; font-size: 6.5px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; }
          .p-rem > b { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; color: #0F172A; }
          .p-goal { display: flex; justify-content: space-between; margin-top: 3px; padding-top: 3px; border-top: 1px solid #EEF2F6; }
          .p-goal small { display: block; font-size: 6.5px; } .p-goal em { font-style: normal; color: #16A34A; }
          .p-goal b { font-size: 9.5px; color: #0F172A; }
          .p-mac { display: flex; justify-content: space-between; font-size: 8.5px; margin-top: 4px; }
          .p-mac span:last-child { color: #64748B; } .p-mac b { color: #0F172A; font-weight: 600; }
          .p-mb { height: 3px; margin-top: 2px; border-radius: 99px; background: #E2E8F0; }
          .p-mb i { display: block; height: 100%; border-radius: 99px; background: #22C55E; }
          .p-wk { display: flex; gap: 7px; padding: 7px 9px; border-bottom: 1px solid #EEF2F6; }
          .p-wi { width: 12px; font-size: 9px; color: #64748B; }
          .p-wh { display: flex; justify-content: space-between; align-items: center; }
          .p-wh small { font-size: 7px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; color: #475569; }
          .p-wh em { font-style: normal; padding: 1px 4px; border-radius: 4px; border: 1px solid #E2E8F0; font-size: 7px; font-weight: 600; color: #64748B; }
          .p-wh em.neg { color: #EF4444; }
          .p-wk .p-dt b { margin: 2px 0 1px; font-size: 9.5px; font-weight: 500; }
          .p-wk .p-dt > small { white-space: normal; }
          .p-tr { padding: 8px 10px; }
          .p-trt { display: flex; justify-content: space-between; align-items: flex-start; }
          .p-trt small { display: flex; align-items: center; gap: 4px; font-size: 7.5px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; color: #475569; }
          .p-trt b { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; line-height: 1.15; }
          .p-trt em { font-style: normal; font-size: 9px; color: #64748B; }
          .p-note { display: block; font-size: 8px; font-weight: 600; color: #16A34A; }
          .p-mini { display: flex; align-items: flex-end; gap: 2px; height: 22px; padding-top: 2px; border-top: 1px dashed #CBD5E1; }
          .p-mini i, .p-col i, .p-leg i { display: block; width: 4px; border-radius: 1px; }
          :is(.p-mini, .p-col, .p-leg) .g { background: #94A3B8; } :is(.p-mini, .p-col, .p-leg) .d { background: #64748B; }
          :is(.p-mini, .p-col, .p-leg) .r { background: #F08080; } :is(.p-mini, .p-col, .p-leg) .G { background: #4ADE80; }
          .p-rng { display: flex; align-items: center; gap: 6px; margin-top: 5px; font-size: 7.5px; color: #64748B; }
          .p-line { position: relative; flex: 1; height: 2px; border-radius: 99px; background: #E2E8F0; }
          .p-line i { position: absolute; top: -3px; width: 7px; height: 7px; margin-left: -3.5px; border-radius: 50%; background: #64748B; }
          .p-base { margin: 8px 0 6px; text-align: center; font-size: 8px; color: #64748B; }
          .p-chart { position: relative; display: flex; justify-content: space-between; align-items: flex-end; height: 92px; padding: 0 4px; }
          .p-bl { position: absolute; left: 4px; right: 4px; bottom: 68px; border-top: 1px dashed #94A3B8; }
          .p-col { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 7px; }
          .p-col i { width: 14px; border-radius: 3px; }
          .p-col em { font-style: normal; font-size: 7px; color: #475569; }
          .p-leg { display: flex; align-items: center; justify-content: center; gap: 3px; margin-top: 4px; font-size: 6.5px; color: #64748B; white-space: nowrap; }
          .p-leg i { width: 4px; height: 4px; border-radius: 50%; margin-left: 3px; }
          .p-bar { position: absolute; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: space-around; height: 44px; padding: 0 4px 6px; background: #fff; border-top: 1px solid #E8EDF3; z-index: 2; }
          .p-bar > span { display: flex; flex-direction: column; align-items: center; gap: 1px; padding: 3px 4px; border-radius: 7px; font-size: 7px; font-weight: 500; color: #0F172A; }
          .p-bar svg { width: 11px; height: 11px; }
          .p-bar .on { background: #F1F5F9; color: #16A34A; font-weight: 600; }
          .p-bar .p-plus { width: 30px; height: 30px; border-radius: 9px; background: #22C55E; color: #fff; justify-content: center; font-size: 18px; font-weight: 300; padding: 0; }

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
