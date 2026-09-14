/**
 * Kygo Health - FAQ Section Custom Element for Wix
 * Tag name: kygo-faq-section
 */

/** Injects accessible text into light DOM so crawlers and AI tools can read component content */
function __seo(el, text) {
  if (el.querySelector('[data-seo]')) return;
  const d = document.createElement('div');
  d.setAttribute('data-seo', '');
  d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
  d.textContent = text;
  el.appendChild(d);
}

class KygoFaqSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
    this._searchIndex = []; // Cached search data
    this._domCache = {};    // Cached DOM references
    this._searchDebounceTimer = null;
    this._eventsBound = false;
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._buildSearchIndex();
    this._setupEventDelegation();
    this._setupScrollAnimations();
    __seo(this, 'Kygo Health FAQ. What is Kygo Health? Kygo is a food logging app that connects what you eat to what your wearable measures. You log meals by photo, voice, barcode or text, Kygo pulls sleep, HRV, resting heart rate and recovery from your Oura, Apple Watch, Fitbit, Garmin, WHOOP or Android Health Connect device, and after about a week it starts showing you which foods and nutrients are helping or hurting each metric. It runs on iOS and Android. See how it works at https://www.kygo.app/how-it-works. How is Kygo different from MyFitnessPal, Cronometer, or my wearable\'s own app? Calorie counters stop at what went in. Wearable apps stop at what your body did. Neither connects the two. Kygo logs food the way a calorie counter does, then correlates it against your wearable data to find patterns that are specific to you, like your sleep latency rising after afternoon caffeine or your HRV dropping for two nights after alcohol. The calorie tracking is the input. The correlations are the product. What does a Kygo insight actually look like? Each health metric (sleep, HRV, resting heart rate, readiness, stress) has its own screen showing the foods and nutrients that are helping it and hurting it, ranked by how strong and how confident the pattern is. Tap one and you get a plain-English summary, the time lag it shows up in (same day, next day, two days later), a ranked list of the specific foods driving it, and a suggested action to try. Do I need a wearable to use Kygo? No. Food logging, calorie and macro targets, micronutrient tracking, water and weight all work with nothing connected. The correlations need a wearable, because they need something to correlate against. If you are wearable-shopping, the free wearable accuracy tool at https://www.kygo.app/tools/wearable-accuracy compares the major devices against clinical studies. Which wearables and apps work with Kygo? Six integrations: Oura Ring, Apple Health (iOS), Health Connect (Android), Fitbit, Garmin and WHOOP. Oura, Fitbit, Garmin and WHOOP connect directly to their cloud accounts, so you get everything the device records. Health Connect covers Samsung Health, Google Fit, Pixel Watch and any other Android app that writes to it. You can connect several at once; Kygo uses the most reliable source for each metric rather than double counting. Does Kygo work on Android and iPhone? Both. Food logging, every direct wearable integration and the correlation engine work identically on iOS and Android. Two things are iPhone only because of Apple\'s rules: Apple Health sync and Sign in with Apple. Android users get Health Connect instead. I\'ve tried food logging before and quit. Why would this be different? Most people quit because logging is slow and the payoff is a number they already knew. Kygo attacks both. Logging takes seconds (say it, snap it, scan it, or tap a saved meal), and the payoff is not a calorie total but a pattern you did not know about your own body. People stay for the second thing. How do I log food, and how long does it take? Six ways: describe it in plain language, say it out loud, photograph the plate or the nutrition label, scan a barcode, tap a saved meal or recent food, or let it import automatically from other apps through Apple Health or Health Connect. A typical entry takes around 20 seconds. You can fix a portion or swap a food match before saving, and log to past days. How accurate is the nutrition data? Kygo does not trust one database. For each food it weighs the dietitian verified database from Nutritionix, Edamam, USDA FoodData Central, Open Food Facts (for barcodes) and the AI\'s own estimate from your photo or description, then picks the most reliable calorie and nutrient values. Where a source leaves vitamins and minerals blank, USDA data backfills them, so micronutrient tracking is not full of gaps. It also sanity-checks serving sizes against what the food actually comes in. What if I miss days or log imperfectly? The correlation engine works on the days you have, not on a perfect streak. Gaps slow it down rather than break it. Imperfect entries still count, and the outlier filtering means one odd night does not skew a pattern. Log most days and the patterns come. How long until I see something useful? Day one: unified trends from every connected device, full calorie, macro and micronutrient tracking, weight and water. Around day 7: the first correlations, once Kygo has a week of food and wearable data side by side. Around day 14: higher-confidence patterns and Experiments. Day 30 and beyond: slower patterns that need to repeat several times before they show, like a nutrient that only affects deep sleep. What kinds of patterns can Kygo find? Relationships between anything you log (foods, nutrients, caffeine, alcohol, meal timing, supplements) and anything your wearable measures (sleep duration and stages, sleep latency, HRV, resting heart rate, readiness, recovery, stress). Kygo checks same-day, next-day and two-day lags, because dinner carbs show up in tomorrow morning\'s readiness and heavy alcohol drags HRV for two nights. The free HRV factors tool at https://www.kygo.app/tools/hrv-factors and deep sleep factors tool at https://www.kygo.app/tools/deep-sleep-factors rank what the research says. How do I know a pattern is real and not noise? Every correlation carries two scores: confidence (how likely the pattern is real rather than chance) and strength (how much the food actually moves the metric). Outliers are filtered so one bad night does not create a pattern. Weak or noisy correlations are hidden, so what you see is what survived the filter. What are Experiments? A way to test one change on your own body. Pick something, like no caffeine after 2 pm or magnesium at dinner, and Kygo tracks whether you did it each day alongside the metrics it should affect. After enough days you see whether the change moved the needle, in your data rather than in a study of other people. Do my insights change over time? Yes. Kygo recalculates as new data comes in, so a new training block, a stressful month, travel or a season change all shift what matters. The pattern that dominated three months ago may not be the one now, and Kygo keeps up instead of handing you a fixed list. Can I use more than one wearable at once? Yes, and it is worth doing. Many people wear a ring for sleep and a watch for workouts. Kygo combines them and, for each metric, pulls from the device that is most trustworthy for that measurement, so you get a complete picture without duplicate or conflicting numbers. What exactly is free? Voice, text and barcode logging with no limit, plus your first 5 AI photo logs. All six wearable connections and sync. Calorie, macro and micronutrient tracking, water and weight, and every trend screen. No card, no time limit. The free plan is a real food tracker, not a demo. What does Pro cost and what does it add? Pro is $9.99 a month, $49.99 a year (about 58% less than paying monthly), or $99.99 once for lifetime access. Pro unlocks the correlation engine and every metric\'s helping and hurting foods, Experiments, the daily factor spotlight, supplement tracking, unlimited AI photo logging, and nutrition write-back to Apple Health and Health Connect. Introductory offers on the yearly plan vary; the app shows you the current one before you commit. Full breakdown at https://www.kygo.app/post/what-is-kygo-health-app-features-pricing. Is there a free trial, and do I need a card to start? No card is needed to download and use the free plan. Pro offers on the yearly plan rotate (a free trial period or a reduced first payment), and whatever is running is shown in the app before you subscribe. Nothing is charged until you confirm through the App Store or Google Play. Can I cancel anytime? Yes. Billing runs through the App Store or Google Play, so you cancel from your store subscriptions page in either one. You keep Pro until the end of the period you paid for. Is my health data secure, and do you sell it? Kygo does not sell your data and does not use it for advertising. Data is encrypted in transit and at rest. Wearable access goes through each platform\'s own permission system (Apple HealthKit, Android Health Connect, or the device maker\'s OAuth), so you choose exactly what Kygo can read and can revoke it at any time. Who sees my data? Only the services that make the app work: the nutrition databases queried when you log (Nutritionix, Edamam, USDA, Open Food Facts), the AI model that reads your photos and descriptions, your connected wearable accounts, and the cloud hosting that runs the app. No advertisers, no data brokers. Details are in the privacy policy at https://www.kygo.app/privacy-policy. Can I export or delete my data? Both, from inside the app. Export everything at any time. Delete your account from Settings and all associated data is permanently removed from Kygo\'s servers. Is Kygo a medical device? No. Kygo is a general wellness product for educational and informational purposes. It does not diagnose, treat, cure or prevent any disease, and it is not a substitute for advice from your physician. Who makes Kygo? Kygo Health LLC, a one-person company based in the New York area, built by a founder who wanted to know why his own sleep and HRV moved and could not get the answer from any existing app. Questions go straight to him at support@kygo.app. The story is in why I built Kygo at https://www.kygo.app/post/why-i-built-kygo-health-app. Where do I download Kygo, and what are the free tools? Kygo Health is on the App Store at https://kygo.app/iOS and Google Play at https://kygo.app/android. Separately, kygo.app hosts 25 free research tools, no signup required, covering wearable accuracy, sleep, HRV and more at https://www.kygo.app/tools.');
    this._injectStructuredData();
  }

  disconnectedCallback() {
    // Clean up timers
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
    }
    if (this._observer) this._observer.disconnect();
    if (this._faqObserver) this._faqObserver.disconnect();
  }

  _parseWixAttributes() {
    try {
      const wixconfig = this.getAttribute('wixconfig');
      const wixsettings = this.getAttribute('wixsettings');
      if (wixconfig) this._config = JSON.parse(wixconfig);
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {
      console.warn('KygoFaqSection: Could not parse Wix attributes', e);
    }
  }

  static get observedAttributes() {
    return ['wixsettings', 'app-store-url', 'email'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'wixsettings') this._parseWixAttributes();
    this.render();
    this._buildSearchIndex();
    // Only setup events once (they use delegation so survive re-renders)
    if (!this._eventsBound) {
      this._setupEventDelegation();
    }
  }

  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }

  _buildSearchIndex() {
    const shadow = this.shadowRoot;
    if (!shadow) return;

    // Cache DOM references
    this._domCache.categoryBtns = shadow.querySelectorAll('.category-btn');
    this._domCache.allCategoryBtn = shadow.querySelector('.category-btn[data-category="all"]');
    this._domCache.faqSections = shadow.querySelectorAll('.faq-section');
    this._domCache.faqItems = shadow.querySelectorAll('.faq-item');

    // Pre-compute search index (lowercase text for each item)
    this._searchIndex = [];
    this._domCache.faqSections.forEach(section => {
      const sectionData = {
        element: section,
        category: section.dataset.category,
        items: []
      };
      section.querySelectorAll('.faq-item').forEach(item => {
        sectionData.items.push({
          element: item,
          searchText: (
            item.querySelector('.faq-question').textContent + ' ' +
            item.querySelector('.faq-answer').textContent
          ).toLowerCase()
        });
      });
      this._searchIndex.push(sectionData);
    });
  }

  _setupEventDelegation() {
    const shadow = this.shadowRoot;
    if (!shadow || this._eventsBound) return;
    this._eventsBound = true;

    // Use event delegation on shadow root for clicks
    shadow.addEventListener('click', (e) => {
      // Handle FAQ question clicks
      const question = e.target.closest('.faq-question');
      if (question) {
        const item = question.closest('.faq-item');
        const section = item.closest('.faq-section');
        const wasOpen = item.classList.contains('open');

        // Close all items in this section (use cached section items)
        const sectionItems = section.querySelectorAll('.faq-item');
        for (let i = 0; i < sectionItems.length; i++) {
          sectionItems[i].classList.remove('open');
        }

        // Toggle clicked item
        if (!wasOpen) item.classList.add('open');
        return;
      }

      // Handle category button clicks
      const categoryBtn = e.target.closest('.category-btn');
      if (categoryBtn) {
        const category = categoryBtn.dataset.category;

        // Update active state using cached buttons
        const btns = this._domCache.categoryBtns;
        for (let i = 0; i < btns.length; i++) {
          btns[i].classList.remove('active');
        }
        categoryBtn.classList.add('active');

        // Show/hide sections using cached data
        for (let i = 0; i < this._searchIndex.length; i++) {
          const section = this._searchIndex[i];
          const show = category === 'all' || section.category === category;
          section.element.style.display = show ? 'block' : 'none';

          // Reset all items to visible
          for (let j = 0; j < section.items.length; j++) {
            section.items[j].element.style.display = 'block';
          }
        }
        return;
      }

      // Handle search clear (×) button clicks
      const clearBtn = e.target.closest('.search-clear');
      if (clearBtn) {
        const input = shadow.getElementById('faq-search');
        if (input) {
          input.value = '';
          input.focus();
        }
        clearBtn.hidden = true;
        if (this._searchDebounceTimer) clearTimeout(this._searchDebounceTimer);
        this._performSearch('');
        return;
      }

    });

    // Search input listener with debouncing.
    // Delegate on the shadow root (not the input element) so it survives
    // re-renders: render() replaces the shadow DOM innerHTML, destroying the
    // #faq-search element, but this listener lives on the persistent shadow
    // root — same reason the click handler above is robust.
    shadow.addEventListener('input', (e) => {
      if (!e.target.matches('#faq-search')) return;

      // Capture the value synchronously — reading e.target inside the debounced
      // callback is unreliable because the browser detaches the event target
      // after dispatch, leaving e.target null/undefined by the time it fires.
      const query = e.target.value;

      // Show the clear (×) button only when there's something to clear
      const clearBtn = shadow.getElementById('faq-search-clear');
      if (clearBtn) clearBtn.hidden = query.length === 0;

      // Clear existing debounce timer
      if (this._searchDebounceTimer) {
        clearTimeout(this._searchDebounceTimer);
      }

      // Debounce search by 150ms
      this._searchDebounceTimer = setTimeout(() => {
        this._performSearch(query);
      }, 150);
    });
  }

  _setupScrollAnimations() {
    requestAnimationFrame(() => {
      // Reveal elements a bit BEFORE they scroll into view (positive bottom
      // rootMargin) with threshold 0, so the fade finishes by the time they're
      // on screen. The old settings triggered late and left blank space when
      // scrolling quickly.
      const revealOptions = { root: null, rootMargin: '0px 0px 20% 0px', threshold: 0 };

      const elements = this.shadowRoot.querySelectorAll('.animate-on-scroll');
      if (elements.length) {
        this._observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              this._observer.unobserve(entry.target);
            }
          });
        }, revealOptions);
        elements.forEach(el => this._observer.observe(el));
      }

      // FAQ items reveal as soon as they approach the viewport. No per-item
      // stagger: the old index-based setTimeout delayed later items by up to
      // ~1.4s, so on a fast scroll they showed up blank and popped in late.
      const faqItems = this.shadowRoot.querySelectorAll('.faq-item');
      if (faqItems.length) {
        const faqObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              faqObserver.unobserve(entry.target);
            }
          });
        }, revealOptions);
        faqItems.forEach(item => faqObserver.observe(item));
        this._faqObserver = faqObserver;
      }
    });
  }

  _performSearch(value) {
    const query = value.toLowerCase().trim();

    // Reset category buttons using cached references
    const btns = this._domCache.categoryBtns;
    for (let i = 0; i < btns.length; i++) {
      btns[i].classList.remove('active');
    }
    if (this._domCache.allCategoryBtn) {
      this._domCache.allCategoryBtn.classList.add('active');
    }

    if (query.length < 2) {
      // Show all using cached data
      for (let i = 0; i < this._searchIndex.length; i++) {
        const section = this._searchIndex[i];
        section.element.style.display = 'block';
        for (let j = 0; j < section.items.length; j++) {
          section.items[j].element.style.display = 'block';
        }
      }
      return;
    }

    // Filter items using pre-computed search index
    for (let i = 0; i < this._searchIndex.length; i++) {
      const section = this._searchIndex[i];
      let hasVisibleItem = false;

      for (let j = 0; j < section.items.length; j++) {
        const item = section.items[j];
        // Use pre-computed lowercase text
        if (item.searchText.includes(query)) {
          item.element.style.display = 'block';
          hasVisibleItem = true;
        } else {
          item.element.style.display = 'none';
        }
      }
      section.element.style.display = hasVisibleItem ? 'block' : 'none';
    }
  }

  render() {
    const appStoreUrl = this._getSetting('app-store-url', 'https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy');
    const email = this._getSetting('email', 'support@kygo.app');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --dark: #1E293B;
          --light: #F8FAFC;
          --green: #22C55E;
          --green-dark: #16A34A;
          --green-light: rgba(34, 197, 94, 0.1);
          --gray-50: #f9fafb;
          --gray-100: #F1F5F9;
          --gray-200: #E2E8F0;
          --gray-400: #94A3B8;
          --gray-600: #475569;
          display: block;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--light);
          color: var(--dark);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        h1, h2, h3 { font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 600; line-height: 1.2; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        .hero { padding: 60px 0 40px; background: linear-gradient(180deg, var(--gray-50) 0%, var(--light) 100%); text-align: center; }
        .hero h1 { font-size: 40px; margin-bottom: 16px; color: var(--dark); }
        .hero-subtitle { font-size: 18px; color: var(--gray-600); max-width: 500px; margin: 0 auto 32px; line-height: 1.7; }
        .search-container { max-width: 500px; margin: 0 auto; }
        .search-bar { display: flex; align-items: center; background: white; border: 2px solid var(--gray-200); border-radius: 14px; padding: 4px; transition: all 0.2s; }
        .search-bar:focus-within { border-color: var(--green); box-shadow: 0 0 0 4px var(--green-light); }
        .search-bar input { flex: 1; border: none; outline: none; padding: 14px 16px; font-size: 16px; font-family: inherit; background: transparent; }
        .search-bar input::placeholder { color: var(--gray-400); }
        .search-bar .search-clear { flex-shrink: 0; background: transparent; border: none; border-radius: 50%; width: 32px; height: 32px; margin-right: 4px; color: var(--gray-400); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .search-bar .search-clear:hover { background: var(--gray-100); color: var(--gray-600); }
        .search-bar .search-clear[hidden] { display: none; }
        .search-bar .search-clear svg { width: 16px; height: 16px; }
        .search-bar .search-icon { background: var(--green); border: none; border-radius: 10px; padding: 12px 20px; color: white; display: flex; align-items: center; justify-content: center; }
        .search-bar .search-icon svg { width: 18px; height: 18px; }

        .category-nav { background: white; border-bottom: 1px solid var(--gray-200); padding: 16px 0; position: sticky; top: 0; z-index: 90; }
        .category-nav .container { display: flex; justify-content: center; }
        .category-nav-inner { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch; justify-content: center; flex-wrap: wrap; }
        .category-nav-inner::-webkit-scrollbar { display: none; }
        .category-btn { background: var(--gray-100); border: 1px solid var(--gray-200); border-radius: 10px; padding: 10px 18px; font-size: 14px; font-weight: 500; color: var(--gray-600); cursor: pointer; white-space: nowrap; transition: all 0.2s; font-family: inherit; }
        .category-btn:hover { background: var(--gray-200); color: var(--dark); }
        .category-btn.active { background: var(--green); border-color: var(--green); color: white; }

        .faq-sections { padding: 60px 0; }
        .faq-section { max-width: 800px; margin: 0 auto 60px; contain: content; }
        .faq-section:last-child { margin-bottom: 0; }
        .faq-section-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid var(--gray-200); }
        .faq-section-icon { width: 48px; height: 48px; background: var(--green-light); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .faq-section-icon svg { width: 24px; height: 24px; color: var(--green); }
        .faq-section-header h2 { font-size: 24px; color: var(--dark); }
        .faq-list { display: flex; flex-direction: column; gap: 12px; }
        .faq-item { background: white; border: 1px solid var(--gray-200); border-radius: 16px; overflow: hidden; transition: all 0.2s; contain: layout style; }
        .faq-item:hover { border-color: var(--gray-400); }
        .faq-item.open { border-color: var(--green); box-shadow: 0 4px 20px rgba(34, 197, 94, 0.1); }
        .faq-question { padding: 20px 24px; font-weight: 600; font-size: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.2s; gap: 16px; user-select: none; }
        .faq-question:hover { color: var(--green); }
        .faq-item.open .faq-question { color: var(--green); }
        .faq-question svg { flex-shrink: 0; transition: transform 0.2s; color: var(--gray-400); width: 20px; height: 20px; pointer-events: none; }
        .faq-item.open .faq-question svg { transform: rotate(180deg); color: var(--green); }
        .faq-answer { padding: 0 24px 20px; color: var(--gray-600); font-size: 15px; line-height: 1.7; display: none; }
        .faq-item.open .faq-answer { display: block; }
        .faq-answer p { margin-bottom: 12px; }
        .faq-answer p:last-child { margin-bottom: 0; }
        .faq-answer strong { color: var(--dark); }
        .faq-answer ul { margin: 12px 0; padding-left: 20px; }
        .faq-answer li { margin-bottom: 8px; }
        .faq-answer a { color: var(--green); text-decoration: none; font-weight: 500; }
        .faq-answer a:hover { text-decoration: underline; }
        .answer-highlight { background: var(--green-light); border-left: 3px solid var(--green); padding: 14px 18px; border-radius: 0 10px 10px 0; margin: 16px 0; font-size: 14px; }
        .answer-highlight strong { color: var(--green-dark); }
        .faq-answer h4 { font-size: 14px; font-weight: 600; color: var(--dark); margin: 16px 0 8px; font-family: 'Space Grotesk', sans-serif; }
        .faq-answer h4:first-child { margin-top: 0; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero h1 {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .hero-subtitle {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out 0.15s forwards;
        }
        .search-container {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out 0.3s forwards;
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-on-scroll.delay-1 { transition-delay: 0.1s; }
        .animate-on-scroll.delay-2 { transition-delay: 0.2s; }
        .animate-on-scroll.delay-3 { transition-delay: 0.3s; }

        .faq-item {
          opacity: 0;
          transform: translateY(15px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .faq-item.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ===== Granular Cascading Animations ===== */

        /* Category nav buttons - stagger on load */
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .category-btn {
          opacity: 0;
          animation: slideInDown 0.4s ease-out forwards;
        }
        .category-btn:nth-child(1) { animation-delay: 0.1s; }
        .category-btn:nth-child(2) { animation-delay: 0.15s; }
        .category-btn:nth-child(3) { animation-delay: 0.2s; }
        .category-btn:nth-child(4) { animation-delay: 0.25s; }
        .category-btn:nth-child(5) { animation-delay: 0.3s; }
        .category-btn:nth-child(6) { animation-delay: 0.35s; }
        .category-btn:nth-child(7) { animation-delay: 0.4s; }
        .category-btn:nth-child(8) { animation-delay: 0.45s; }
        .category-btn:nth-child(9) { animation-delay: 0.5s; }

        /* Override FAQ section containers - children cascade individually */
        .faq-section.animate-on-scroll {
          opacity: 1;
          transform: none;
          transition: none;
        }

        /* Section header children - start hidden */
        .faq-section .faq-section-icon,
        .faq-section .faq-section-header h2 {
          opacity: 0;
          transform: translateY(15px);
        }

        /* Section header children - cascade when section visible */
        .faq-section.visible .faq-section-icon {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .faq-section.visible .faq-section-header h2 {
          animation: fadeInUp 0.5s ease-out 0.1s forwards;
        }

        /* Section icon pulse after appearing */
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .faq-section.visible .faq-section-icon {
          animation: fadeInUp 0.5s ease-out forwards, iconPulse 2s ease-in-out 0.8s infinite;
        }

        /* Override still-questions container - children cascade */
        .still-questions-inner.animate-on-scroll {
          opacity: 1;
          transform: none;
          transition: none;
        }
        .still-questions-inner h2,
        .still-questions-inner > p,
        .still-questions-inner .contact-options {
          opacity: 0;
          transform: translateY(20px);
        }
        .still-questions-inner.visible h2 {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .still-questions-inner.visible > p {
          animation: fadeInUp 0.5s ease-out 0.1s forwards;
        }
        .still-questions-inner.visible .contact-options {
          animation: fadeInUp 0.5s ease-out 0.2s forwards;
        }

        /* Contact option hover lift enhancement */
        .still-questions-inner.visible .contact-option {
          opacity: 0;
          animation: fadeInUp 0.5s ease-out 0.3s forwards;
        }

        /* Override final CTA container - children cascade */
        .final-cta-inner.animate-on-scroll {
          opacity: 1;
          transform: none;
          transition: none;
        }

        @keyframes ctaSlideUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ctaScaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .final-cta-content .cta-pill,
        .final-cta-content h2,
        .final-cta-content > p,
        .final-cta-content .cta-primary,
        .final-cta-content .cta-android,
        .final-cta-content .cta-works {
          opacity: 0;
        }
        .final-cta-inner.visible .final-cta-content .cta-pill {
          animation: ctaSlideUp 0.5s ease-out forwards;
        }
        .final-cta-inner.visible .final-cta-content h2 {
          animation: ctaSlideUp 0.6s ease-out 0.1s forwards;
        }
        .final-cta-inner.visible .final-cta-content > p {
          animation: ctaSlideUp 0.6s ease-out 0.25s forwards;
        }
        .final-cta-inner.visible .final-cta-content .cta-primary {
          animation: ctaScaleIn 0.5s ease-out 0.4s forwards;
        }
        .final-cta-inner.visible .final-cta-content .cta-android {
          animation: ctaScaleIn 0.5s ease-out 0.4s forwards;
        }
        .final-cta-inner.visible .final-cta-content .cta-works {
          animation: fadeInUp 0.5s ease-out 0.55s forwards;
        }

        /* Reduced motion for all new animations */
        @media (prefers-reduced-motion: reduce) {
          .category-btn {
            opacity: 1;
            animation: none;
          }
          .faq-section .faq-section-icon,
          .faq-section .faq-section-header h2,
          .still-questions-inner h2,
          .still-questions-inner > p,
          .still-questions-inner .contact-options,
          .still-questions-inner .contact-option,
          .final-cta-content .cta-pill,
          .final-cta-content h2,
          .final-cta-content > p,
          .final-cta-content .cta-primary,
          .final-cta-content .cta-android,
          .final-cta-content .cta-works {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }

        .still-questions { padding: 60px 0; background: var(--gray-50); }
        .still-questions-inner { max-width: 600px; margin: 0 auto; text-align: center; }
        .still-questions h2 { font-size: 28px; margin-bottom: 12px; }
        .still-questions p { color: var(--gray-600); margin-bottom: 24px; font-size: 16px; }
        .contact-options { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .contact-option { background: white; border: 1px solid var(--gray-200); border-radius: 14px; padding: 20px 28px; display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--dark); transition: all 0.2s; }
        .contact-option:hover { border-color: var(--green); box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-2px); }
        .contact-option-icon { width: 44px; height: 44px; background: var(--green-light); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .contact-option-icon svg { width: 22px; height: 22px; color: var(--green); }
        .contact-option-text strong { display: block; font-size: 15px; margin-bottom: 2px; }
        .contact-option-text span { font-size: 13px; color: var(--gray-600); }

        .final-cta { padding: 72px 0; background: white; }
        .final-cta-inner { background: #0F172A; border-radius: 24px; padding: 40px 24px; text-align: center; position: relative; overflow: hidden; color: #fff; }
        .final-cta-inner::before { content: ''; position: absolute; top: -160px; right: -160px; width: 520px; height: 520px; background: radial-gradient(closest-side, rgba(34,197,94,0.30), transparent); pointer-events: none; }
        .final-cta-inner::after { content: ''; position: absolute; bottom: -180px; left: -180px; width: 480px; height: 480px; background: radial-gradient(closest-side, rgba(34,197,94,0.12), transparent); pointer-events: none; }
        .final-cta-content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
        .cta-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.16); color: #6EE7A0; padding: 6px 14px; border-radius: 999px; font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 600; border: 1px solid rgba(34,197,94,0.25); margin-bottom: 18px; }
        .cta-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 8px var(--green); }
        .final-cta h2 { font-size: clamp(26px, 4.5vw, 42px); line-height: 1.05; color: #fff; margin-bottom: 14px; max-width: 22ch; }
        .final-cta h2 span { color: var(--green); }
        .final-cta-content > p { color: rgba(255,255,255,0.72); margin-bottom: 24px; font-size: clamp(15px, 1.6vw, 17px); max-width: 56ch; line-height: 1.6; }
        .cta-buttons{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .cta-primary, .cta-android { background: var(--green); color: #fff; padding: 14px 24px; border-radius: 12px; font-weight: 600; font-size: 15px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px; transition: transform .2s ease, box-shadow .2s ease, background .2s ease; border: none; cursor: pointer; font-family: inherit; -webkit-tap-highlight-color: transparent; }
        .cta-primary:hover, .cta-android:hover { background: var(--green-dark); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(34,197,94,0.30); }
        .cta-primary svg, .cta-android svg { width: 18px; height: 18px; }
        .cta-works { margin-top: 26px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: rgba(255,255,255,0.6); font-size: 13px; }
        /* Logo tile + brand label, matching the homepage step-2 chips. Always one line. */
        .cta-badges{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:center;gap:6px;row-gap:12px}
        .cta-chip{display:flex;flex-direction:column;align-items:center;gap:6px;flex:0 0 auto}
        .cta-chip-tile{width:40px;height:40px;flex-shrink:0;border-radius:11px;background:#fff;overflow:hidden;display:flex;align-items:center;justify-content:center}
        .cta-chip-tile img{width:100%;height:100%;object-fit:cover;border-radius:11px;display:block}
        .cta-chip-label{font-size:10px;font-weight:600;color:rgba(255,255,255,.6);white-space:nowrap}
        @media(max-width:420px){.cta-badges{gap:4px}.cta-chip-tile{width:36px;height:36px}.cta-chip-label{font-size:9.5px}}
        @media(max-width:360px){.cta-badges{gap:2px}.cta-chip-tile{width:28px;height:28px}.cta-chip-label{font-size:7.5px}}
        @media(max-width:480px){.cta-buttons{flex-direction:column;align-items:center}.cta-buttons .cta-primary,.cta-buttons .cta-android{width:100%;max-width:280px;justify-content:center}}

        /* Mid-content contextual app CTA (compact green card) */
        .kearly-section { max-width: 800px; margin: 48px auto; padding: 0 20px; }
        .kband { max-width: 1100px; margin: 0 auto; }
        .kband-inner { position: relative; overflow: hidden; background: #fff; border: 2px solid #E2E8F0; border-radius: 20px; padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; gap: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .kband-glow { position: absolute; top: -120px; right: -80px; width: 360px; height: 360px; background: radial-gradient(circle, rgba(34,197,94,0.14), transparent 65%); pointer-events: none; }
        .kband-copy { position: relative; display: flex; flex-direction: column; gap: 10px; flex: 1 1 300px; min-width: 0; max-width: 620px; }
        .kband-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 12px; letter-spacing: 0.7px; text-transform: uppercase; color: #16A34A; }
        .kband-dot { width: 7px; height: 7px; border-radius: 50%; background: #22C55E; animation: kygoPulse 2s ease-out infinite; }
        .kband-headline { margin: 0; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 24px; line-height: 1.3; color: #1E293B; }
        .kband-actions { position: relative; display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 12px; flex: 0 1 400px; }
        .kband-note { flex-basis: 100%; width: 100%; margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: #475569; text-align: center; }
        .kband-btn { display: inline-flex; align-items: center; gap: 9px; text-decoration: none; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; padding: 15px 24px; border-radius: 12px; white-space: nowrap; transition: transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease; }
        .kband-btn svg { width: 17px; height: 17px; flex-shrink: 0; }
        .kband-btn-ios { background: #22C55E; color: #fff; box-shadow: 0 6px 16px rgba(34,197,94,0.28); }
        .kband-btn-ios:hover { background: #16A34A; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(34,197,94,0.3); }
        .kband-btn-android { background: #fff; color: #16A34A; border: 2px solid #E2E8F0; }
        .kband-btn-android:hover { border-color: #22C55E; transform: translateY(-2px); }
        @keyframes kygoPulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.55); } 70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }
        @media (max-width: 720px) {
          .kband-inner { flex-direction: column; align-items: flex-start; gap: 22px; padding: 28px 24px; }
          .kband-copy { flex: none; max-width: 100%; }
          .kband-actions { flex: none; width: 100%; flex-direction: column; justify-content: flex-start; }
          .kband-btn { width: 100%; justify-content: center; }
        }
        @media (prefers-reduced-motion: reduce) { .kband-dot { animation: none; } }
        .kearly { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.3); border-radius: 16px; padding: 24px 20px; text-align: center; }
        .kearly-copy { font-size: 16px; line-height: 1.5; font-weight: 500; color: var(--dark); margin: 0 0 16px; }
        .kearly-btns { display: flex; flex-direction: column; gap: 10px; align-items: center; }
        .kearly-btns > a { width: 100%; max-width: 320px; justify-content: center; min-height: 48px; }
        @media (min-width: 520px) { .kearly-btns { flex-direction: row; justify-content: center; } .kearly-btns > a { width: auto; } }

        @media (min-width: 768px) {
          .hero { padding: 80px 0 60px; }
          .hero h1 { font-size: 48px; }
          .final-cta { padding: 96px 0; }
          .final-cta-inner { padding: 56px 40px; }
        }
      </style>

      <section class="hero">
        <div class="container">
          <h1>Frequently Asked Questions</h1>
          <p class="hero-subtitle">Everything you need to know about Kygo. Can't find what you're looking for? Reach out to us below.</p>
          <div class="search-container">
            <div class="search-bar">
              <input type="text" placeholder="Search for answers..." id="faq-search" aria-label="Search frequently asked questions">
              <button type="button" class="search-clear" id="faq-search-clear" aria-label="Clear search" hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
              </button>
              <div class="search-icon" role="img" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="category-nav">
        <div class="container">
          <div class="category-nav-inner">
            <button class="category-btn active" data-category="all">All Questions</button>
            <button class="category-btn" data-category="what-kygo-is">What Kygo Is</button>
            <button class="category-btn" data-category="will-it-stick">Will It Stick</button>
            <button class="category-btn" data-category="the-payoff">The Payoff</button>
            <button class="category-btn" data-category="pricing">Pricing</button>
            <button class="category-btn" data-category="trust">Trust</button>
          </div>
        </div>
      </div>

      <div class="faq-sections">
        <div class="container">

          <section class="faq-section animate-on-scroll" data-category="what-kygo-is">
            <div class="faq-section-header">
              <div class="faq-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              </div>
              <h2>What Kygo Is</h2>
            </div>
            <div class="faq-list">
              <div class="faq-item open">
                <div class="faq-question"><span>What is Kygo Health?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Kygo is a food logging app that connects what you eat to what your wearable measures.</strong> You log meals by photo, voice, barcode or text, Kygo pulls sleep, HRV, resting heart rate and recovery from your Oura, Apple Watch, Fitbit, Garmin, WHOOP or Android Health Connect device, and after about a week it starts showing you which foods and nutrients are helping or hurting each metric.</p><p>It runs on iOS and Android. See <a href="https://www.kygo.app/how-it-works">how it works</a>.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>How is Kygo different from MyFitnessPal, Cronometer, or my wearable's own app?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Calorie counters stop at what went in. Wearable apps stop at what your body did. Neither connects the two.</strong></p><p>Kygo logs food the way a calorie counter does, then correlates it against your wearable data to find patterns that are specific to you, like your sleep latency rising after afternoon caffeine or your HRV dropping for two nights after alcohol.</p><div class="answer-highlight">The calorie tracking is the input. The correlations are the product.</div>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>What does a Kygo insight actually look like?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p>Each health metric (sleep, HRV, resting heart rate, readiness, stress) has its own screen showing the foods and nutrients that are <strong>helping</strong> it and <strong>hurting</strong> it, ranked by how strong and how confident the pattern is.</p><p>Tap one and you get a plain-English summary, the time lag it shows up in (same day, next day, two days later), a ranked list of the specific foods driving it, and a suggested action to try.</p>
                  <!-- TODO: screenshot of one correlation card goes here -->
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Do I need a wearable to use Kygo?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>No.</strong> Food logging, calorie and macro targets, micronutrient tracking, water and weight all work with nothing connected.</p><p>The correlations need a wearable, because they need something to correlate against. If you are wearable-shopping, our free <a href="https://www.kygo.app/tools/wearable-accuracy">wearable accuracy tool</a> compares the major devices against clinical studies.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Which wearables and apps work with Kygo?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Six integrations:</strong> Oura Ring, Apple Health (iOS), Health Connect (Android), Fitbit, Garmin and WHOOP.</p><p>Oura, Fitbit, Garmin and WHOOP connect directly to their cloud accounts, so you get everything the device records. Health Connect covers Samsung Health, Google Fit, Pixel Watch and any other Android app that writes to it.</p><p>You can connect several at once; Kygo uses the most reliable source for each metric rather than double counting.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Does Kygo work on Android and iPhone?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Both.</strong> Food logging, every direct wearable integration and the correlation engine work identically on iOS and Android.</p><p>Two things are iPhone only because of Apple's rules: Apple Health sync and Sign in with Apple. Android users get Health Connect instead.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="kearly-section animate-on-scroll">
            <div class="kband">
              <div class="kband-inner">
                <div class="kband-glow"></div>
                <div class="kband-copy">
                  <span class="kband-eyebrow"><span class="kband-dot"></span>From guessing to knowing</span>
                  <h2 class="kband-headline">See how your food affects your sleep, recovery &amp; HRV.</h2>
                </div>
                <div class="kband-actions">
                  <a href="${appStoreUrl}" class="kband-btn kband-btn-ios" data-track-position="mid" data-track-label="faq-mid-ios" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M17.05 12.5c-.02-2.1 1.71-3.11 1.79-3.16-.98-1.43-2.5-1.62-3.03-1.64-1.29-.13-2.52.76-3.17.76-.65 0-1.66-.74-2.73-.72-1.4.02-2.7.82-3.42 2.07-1.46 2.54-.37 6.3 1.05 8.36.7 1.01 1.53 2.14 2.62 2.1 1.05-.04 1.45-.68 2.72-.68 1.27 0 1.63.68 2.74.66 1.13-.02 1.85-1.03 2.54-2.04.8-1.17 1.13-2.3 1.15-2.36-.03-.01-2.2-.84-2.22-3.35zM15.02 5.9c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.53.62-1 1.61-.88 2.56.93.07 1.88-.47 2.46-1.16z"/></svg> Download for iOS</a>
                  <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" class="kband-btn kband-btn-android" data-action="android-download" data-track-position="mid" data-track-label="faq-mid-android" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="#22C55E" aria-hidden="true"><path d="M6 9v7a1 1 0 001 1h1v3a1 1 0 002 0v-3h4v3a1 1 0 002 0v-3h1a1 1 0 001-1V9H6zM4.5 9A1.5 1.5 0 003 10.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 004.5 9zm15 0a1.5 1.5 0 00-1.5 1.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 0019.5 9zM15.5 4.2l1-1.4a.3.3 0 00-.5-.35l-1.1 1.53a5.9 5.9 0 00-3.8 0L9.99 2.45a.3.3 0 00-.5.35l1 1.4A5.28 5.28 0 006 8.2h12a5.28 5.28 0 00-2.5-4zM9.5 6.4a.6.6 0 110-1.2.6.6 0 010 1.2zm5 0a.6.6 0 110-1.2.6.6 0 010 1.2z"/></svg> Get Android</a><p class="kband-note">Free plan available. Pro is $9.99 a month, $49.99 a year, or $99.99 for lifetime. Cancel anytime.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="faq-section animate-on-scroll" data-category="will-it-stick">
            <div class="faq-section-header">
              <div class="faq-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              </div>
              <h2>Will It Stick</h2>
            </div>
            <div class="faq-list">
              <div class="faq-item">
                <div class="faq-question"><span>I've tried food logging before and quit. Why would this be different?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p>Most people quit because logging is slow and the payoff is a number they already knew. <strong>Kygo attacks both.</strong></p><p>Logging takes seconds (say it, snap it, scan it, or tap a saved meal), and the payoff is not a calorie total but a pattern you did not know about your own body.</p><div class="answer-highlight">People stay for the second thing.</div>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>How do I log food, and how long does it take?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Six ways:</strong></p><ul><li>Describe it in plain language</li><li>Say it out loud</li><li>Photograph the plate or the nutrition label</li><li>Scan a barcode</li><li>Tap a saved meal or recent food</li><li>Let it import automatically from other apps through Apple Health or Health Connect</li></ul><p>A typical entry takes around 20 seconds. You can fix a portion or swap a food match before saving, and log to past days.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>How accurate is the nutrition data?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Kygo does not trust one database.</strong> For each food it weighs the dietitian verified database from Nutritionix, Edamam, USDA FoodData Central, Open Food Facts (for barcodes) and the AI's own estimate from your photo or description, then picks the most reliable calorie and nutrient values.</p><p>Where a source leaves vitamins and minerals blank, USDA data backfills them, so micronutrient tracking is not full of gaps. It also sanity-checks serving sizes against what the food actually comes in.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>What if I miss days or log imperfectly?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p>The correlation engine works on the days you have, not on a perfect streak. <strong>Gaps slow it down rather than break it.</strong></p><p>Imperfect entries still count, and the outlier filtering means one odd night does not skew a pattern. Log most days and the patterns come.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="faq-section animate-on-scroll" data-category="the-payoff">
            <div class="faq-section-header">
              <div class="faq-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 5-6"/></svg>
              </div>
              <h2>The Payoff</h2>
            </div>
            <div class="faq-list">
              <div class="faq-item">
                <div class="faq-question"><span>How long until I see something useful?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <ul><li><strong>Day one:</strong> unified trends from every connected device, full calorie, macro and micronutrient tracking, weight and water.</li><li><strong>Around day 7:</strong> the first correlations, once Kygo has a week of food and wearable data side by side.</li><li><strong>Around day 14:</strong> higher-confidence patterns and Experiments.</li><li><strong>Day 30 and beyond:</strong> slower patterns that need to repeat several times before they show, like a nutrient that only affects deep sleep.</li></ul>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>What kinds of patterns can Kygo find?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p>Relationships between anything you log (foods, nutrients, caffeine, alcohol, meal timing, supplements) and anything your wearable measures (sleep duration and stages, sleep latency, HRV, resting heart rate, readiness, recovery, stress).</p><p>Kygo checks same-day, next-day and two-day lags, because dinner carbs show up in tomorrow morning's readiness and heavy alcohol drags HRV for two nights.</p><p>Curious what the research says affects a metric? Our free <a href="https://www.kygo.app/tools/hrv-factors">HRV factors</a> and <a href="https://www.kygo.app/tools/deep-sleep-factors">deep sleep factors</a> tools rank the evidence.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>How do I know a pattern is real and not noise?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p>Every correlation carries two scores: <strong>confidence</strong> (how likely the pattern is real rather than chance) and <strong>strength</strong> (how much the food actually moves the metric).</p><p>Outliers are filtered so one bad night does not create a pattern. Weak or noisy correlations are hidden, so what you see is what survived the filter.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>What are Experiments?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>A way to test one change on your own body.</strong> Pick something, like no caffeine after 2 pm or magnesium at dinner, and Kygo tracks whether you did it each day alongside the metrics it should affect.</p><p>After enough days you see whether the change moved the needle, in your data rather than in a study of other people.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Do my insights change over time?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Yes.</strong> Kygo recalculates as new data comes in, so a new training block, a stressful month, travel or a season change all shift what matters.</p><p>The pattern that dominated three months ago may not be the one now, and Kygo keeps up instead of handing you a fixed list.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Can I use more than one wearable at once?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Yes, and it is worth doing.</strong> Many people wear a ring for sleep and a watch for workouts.</p><p>Kygo combines them and, for each metric, pulls from the device that is most trustworthy for that measurement, so you get a complete picture without duplicate or conflicting numbers.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="faq-section animate-on-scroll" data-category="pricing">
            <div class="faq-section-header">
              <div class="faq-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10h8M8 14h8"/></svg>
              </div>
              <h2>Pricing</h2>
            </div>
            <div class="faq-list">
              <div class="faq-item">
                <div class="faq-question"><span>What exactly is free?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <ul><li>Voice, text and barcode logging with no limit, plus your first 5 AI photo logs</li><li>All six wearable connections and sync</li><li>Calorie, macro and micronutrient tracking, water and weight, and every trend screen</li></ul><p>No card, no time limit.</p><div class="answer-highlight">The free plan is a real food tracker, not a demo.</div>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>What does Pro cost and what does it add?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Pro is $9.99 a month, $49.99 a year (about 58% less than paying monthly), or $99.99 once for lifetime access.</strong></p><p>Pro unlocks the correlation engine and every metric's helping and hurting foods, Experiments, the daily factor spotlight, supplement tracking, unlimited AI photo logging, and nutrition write-back to Apple Health and Health Connect.</p><p>Introductory offers on the yearly plan vary; the app shows you the current one before you commit. Full breakdown in <a href="https://www.kygo.app/post/what-is-kygo-health-app-features-pricing">what Kygo costs</a>.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Is there a free trial, and do I need a card to start?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>No card is needed to download and use the free plan.</strong></p><p>Pro offers on the yearly plan rotate (a free trial period or a reduced first payment), and whatever is running is shown in the app before you subscribe. Nothing is charged until you confirm through the App Store or Google Play.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Can I cancel anytime?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Yes.</strong> Billing runs through the App Store or Google Play, so you cancel from your store subscriptions page in either one.</p><p>You keep Pro until the end of the period you paid for.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="faq-section animate-on-scroll" data-category="trust">
            <div class="faq-section-header">
              <div class="faq-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h2>Trust</h2>
            </div>
            <div class="faq-list">
              <div class="faq-item">
                <div class="faq-question"><span>Is my health data secure, and do you sell it?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Kygo does not sell your data and does not use it for advertising.</strong> Data is encrypted in transit and at rest.</p><p>Wearable access goes through each platform's own permission system (Apple HealthKit, Android Health Connect, or the device maker's OAuth), so you choose exactly what Kygo can read and can revoke it at any time.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Who sees my data?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p>Only the services that make the app work:</p><ul><li>The nutrition databases queried when you log (Nutritionix, Edamam, USDA, Open Food Facts)</li><li>The AI model that reads your photos and descriptions</li><li>Your connected wearable accounts</li><li>The cloud hosting that runs the app</li></ul><p>No advertisers, no data brokers. Details are in the <a href="https://www.kygo.app/privacy-policy">privacy policy</a>.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Can I export or delete my data?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Both, from inside the app.</strong> Export everything at any time.</p><p>Delete your account from Settings and all associated data is permanently removed from Kygo's servers.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Is Kygo a medical device?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>No.</strong> Kygo is a general wellness product for educational and informational purposes.</p><p>It does not diagnose, treat, cure or prevent any disease, and it is not a substitute for advice from your physician.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Who makes Kygo?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Kygo Health LLC</strong>, a one-person company based in the New York area, built by a founder who wanted to know why his own sleep and HRV moved and could not get the answer from any existing app.</p><p>Questions go straight to him at <a href="mailto:support@kygo.app">support@kygo.app</a>. The story is in <a href="https://www.kygo.app/post/why-i-built-kygo-health-app">why I built Kygo</a>.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Where do I download Kygo, and what are the free tools?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p>Kygo Health is on the <a href="https://kygo.app/iOS" target="_blank" rel="noopener">App Store</a> and <a href="https://kygo.app/android" target="_blank" rel="noopener">Google Play</a>.</p><p>Separately, kygo.app hosts <strong>25 free research tools</strong>, no signup required, covering wearable accuracy, sleep, HRV and more at <a href="https://www.kygo.app/tools">kygo.app/tools</a>.</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <section class="still-questions">
        <div class="container">
          <div class="still-questions-inner animate-on-scroll">
            <h2>Still have questions?</h2>
            <p>We're here to help. Reach out and we'll get back to you as soon as possible.</p>
            <div class="contact-options">
              <a href="mailto:${email}" class="contact-option animate-on-scroll">
                <div class="contact-option-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                </div>
                <div class="contact-option-text">
                  <strong>Email Us</strong>
                  <span>${email}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="final-cta">
        <div class="container">
          <div class="final-cta-inner animate-on-scroll">
            <div class="final-cta-content">
              <div class="cta-pill"><span class="dot"></span> Free Forever Plan</div>
              <h2>No more questions? <span>Try it free.</span></h2>
              <p>Logging and wearable syncing are free forever. See your meals line up against how you actually sleep, recover, and feel.</p>
              <div class="cta-buttons">
                <a href="${appStoreUrl}" class="cta-primary" target="_blank" rel="noopener" data-track-position="footer-cta" data-track-label="faq-footer-ios">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </a>
                <a href="https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO" target="_blank" rel="noopener" class="cta-android" data-action="android-download" data-track-position="footer-cta" data-track-label="faq-footer-android">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                  Download for Android
                </a>
              </div>
              <p style="position:relative;margin:16px 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.72);text-align:center;">Free plan available. Pro is $9.99 a month, $49.99 a year, or $99.99 for lifetime. Cancel anytime.</p>
              <div class="cta-works">
                <span>Works with</span>
                <div class="cta-badges">
                  <span class="cta-chip"><span class="cta-chip-tile"><img src="https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png" alt="Oura Ring" title="Oura Ring" loading="lazy" /></span><span class="cta-chip-label">Oura</span></span>
                  <span class="cta-chip"><span class="cta-chip-tile"><img src="https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png" alt="Apple Health" title="Apple Health" loading="lazy" /></span><span class="cta-chip-label">Apple</span></span>
                  <span class="cta-chip"><span class="cta-chip-tile"><img src="https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png" alt="Fitbit" title="Fitbit" loading="lazy" /></span><span class="cta-chip-label">Fitbit</span></span>
                  <span class="cta-chip"><span class="cta-chip-tile"><img src="https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png" alt="Garmin" title="Garmin" loading="lazy" /></span><span class="cta-chip-label">Garmin</span></span>
                  <span class="cta-chip"><span class="cta-chip-tile"><img src="https://static.wixstatic.com/media/273a63_21019d0fbe9e4afcbabdb3ca9dcad89d~mv2.png" alt="WHOOP" title="WHOOP" loading="lazy" /></span><span class="cta-chip-label">WHOOP</span></span>
                  <span class="cta-chip"><span class="cta-chip-tile"><img src="https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png" alt="Google Health" title="Google Health" loading="lazy" /></span><span class="cta-chip-label">Google</span></span>
                  <span class="cta-chip"><span class="cta-chip-tile"><img src="https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png" alt="Health Connect" title="Health Connect" loading="lazy" /></span><span class="cta-chip-label">Health</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
  // ── Structured Data ───────────────────────────────────────────────────

  // FAQPage structured data is managed via Wix site-level LD+JSON to avoid duplicate schema errors
  _injectStructuredData() {}
}

customElements.define('kygo-faq-section', KygoFaqSection);
