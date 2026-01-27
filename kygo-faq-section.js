/**
 * Kygo Health - FAQ Section Custom Element for Wix
 * Tag name: kygo-faq-section
 */

class KygoFaqSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._setupEventDelegation();
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
    this._setupEventDelegation();
  }

  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }

  _setupEventDelegation() {
    const shadow = this.shadowRoot;
    if (!shadow) return;

    // Use event delegation on shadow root for clicks
    shadow.addEventListener('click', (e) => {
      // Handle FAQ question clicks
      const question = e.target.closest('.faq-question');
      if (question) {
        const item = question.closest('.faq-item');
        const section = item.closest('.faq-section');
        const wasOpen = item.classList.contains('open');
        
        // Close all items in this section
        section.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        
        // Toggle clicked item
        if (!wasOpen) item.classList.add('open');
        return;
      }

      // Handle category button clicks
      const categoryBtn = e.target.closest('.category-btn');
      if (categoryBtn) {
        const category = categoryBtn.dataset.category;
        
        // Update active state
        shadow.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        categoryBtn.classList.add('active');
        
        // Show/hide sections
        shadow.querySelectorAll('.faq-section').forEach(section => {
          if (category === 'all' || section.dataset.category === category) {
            section.style.display = 'block';
          } else {
            section.style.display = 'none';
          }
        });
        
        // Reset all items to visible
        shadow.querySelectorAll('.faq-item').forEach(item => {
          item.style.display = 'block';
        });
        return;
      }
    });

    // Search input listener
    const searchInput = shadow.getElementById('faq-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        // Reset category buttons
        shadow.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        shadow.querySelector('.category-btn[data-category="all"]').classList.add('active');
        
        if (query.length < 2) {
          // Show all
          shadow.querySelectorAll('.faq-section').forEach(s => s.style.display = 'block');
          shadow.querySelectorAll('.faq-item').forEach(i => i.style.display = 'block');
          return;
        }
        
        // Filter items
        shadow.querySelectorAll('.faq-section').forEach(section => {
          let hasVisibleItem = false;
          section.querySelectorAll('.faq-item').forEach(item => {
            const questionText = item.querySelector('.faq-question').textContent.toLowerCase();
            const answerText = item.querySelector('.faq-answer').textContent.toLowerCase();
            if (questionText.includes(query) || answerText.includes(query)) {
              item.style.display = 'block';
              hasVisibleItem = true;
            } else {
              item.style.display = 'none';
            }
          });
          section.style.display = hasVisibleItem ? 'block' : 'none';
        });
      });
    }
  }

  render() {
    const appStoreUrl = this._getSetting('app-store-url', '#');
    const email = this._getSetting('email', 'support@kygohealth.com');

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
        .faq-section { max-width: 800px; margin: 0 auto 60px; }
        .faq-section:last-child { margin-bottom: 0; }
        .faq-section-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid var(--gray-200); }
        .faq-section-icon { width: 48px; height: 48px; background: var(--green-light); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .faq-section-icon svg { width: 24px; height: 24px; color: var(--green); }
        .faq-section-header h2 { font-size: 24px; color: var(--dark); }
        .faq-list { display: flex; flex-direction: column; gap: 12px; }
        .faq-item { background: white; border: 1px solid var(--gray-200); border-radius: 16px; overflow: hidden; transition: all 0.2s; }
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

        .final-cta { padding: 60px 0; background: white; }
        .final-cta-inner { background: linear-gradient(135deg, var(--green), var(--green-dark)); border-radius: 24px; padding: 48px 24px; text-align: center; position: relative; overflow: hidden; }
        .final-cta-inner::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%); pointer-events: none; }
        .final-cta-content { position: relative; z-index: 1; }
        .final-cta h2 { font-size: 32px; color: white; margin-bottom: 12px; }
        .final-cta-content > p { color: rgba(255,255,255,0.85); margin-bottom: 28px; font-size: 17px; }
        .cta-primary { background: white; color: var(--green-dark); padding: 16px 28px; border-radius: 12px; font-weight: 600; font-size: 16px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .cta-primary:hover { background: var(--light); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .cta-primary svg { width: 18px; height: 18px; }
        .risk-reversal { margin-top: 20px; color: rgba(255,255,255,0.7); font-size: 13px; display: flex; align-items: center; gap: 12px; justify-content: center; flex-wrap: wrap; }

        @media (min-width: 768px) {
          .hero { padding: 80px 0 60px; }
          .hero h1 { font-size: 48px; }
          .final-cta-inner { padding: 64px 48px; }
          .final-cta h2 { font-size: 40px; }
        }
      </style>

      <section class="hero">
        <div class="container">
          <h1>Frequently Asked Questions</h1>
          <p class="hero-subtitle">Everything you need to know about Kygo. Can't find what you're looking for? Reach out to us below.</p>
          <div class="search-container">
            <div class="search-bar">
              <input type="text" placeholder="Search for answers..." id="faq-search">
              <div class="search-icon">
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
            <button class="category-btn" data-category="getting-started">Getting Started</button>
            <button class="category-btn" data-category="logging">Food Logging</button>
            <button class="category-btn" data-category="correlations">Correlations</button>
            <button class="category-btn" data-category="devices">Devices</button>
            <button class="category-btn" data-category="pricing">Pricing</button>
            <button class="category-btn" data-category="privacy">Privacy & Data</button>
          </div>
        </div>
      </div>

      <div class="faq-sections">
        <div class="container">

          <section class="faq-section" data-category="getting-started">
            <div class="faq-section-header">
              <div class="faq-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              </div>
              <h2>Getting Started</h2>
            </div>
            <div class="faq-list">
              <div class="faq-item open">
                <div class="faq-question"><span>How is Kygo different from MyFitnessPal?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>MyFitnessPal tracks calories for weight loss. Kygo shows you how food affects your sleep, HRV, energy, and recovery.</strong></p>
                  <p>We automatically correlate your nutrition data with your wearable data to find patterns unique to YOUR body. So instead of generic advice, you get correlations like "Your sleep latency increases 8 minutes when you consume caffeine after 3pm."</p>
                  <div class="answer-highlight"><strong>The key difference:</strong> MFP = calories as the goal. Kygo = correlations as the insight.</div>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>How long does setup take?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>About 2 minutes.</strong> Download the app, connect your wearables (click, sign in, approve), and you're ready to log your first meal.</p>
                  <p>Your historical wearable data syncs automatically in the background—no manual entry needed.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>What do I see before correlations appear?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>You get value from day one.</strong> Before correlations appear (at day 7), you'll have access to:</p>
                  <ul>
                    <li>Unified health trends from all your connected devices</li>
                    <li>Detailed calorie and macro tracking for every meal</li>
                    <li>Full micronutrient breakdown (23+ nutrients)</li>
                    <li>Weight logging and trends</li>
                  </ul>
                  <p>Correlations are the bonus—not the only value.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>I've tried food tracking before and quit. Why would this be different?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Because logging takes seconds, not minutes.</strong> We give you four ways to log—photo, voice, barcode, or natural text—so you can use whatever's fastest in the moment.</p>
                  <p>Plus, our template system learns your eating habits. Your frequent meals become one-tap entries. <strong>Logging gets easier over time, not harder.</strong></p>
                  <div class="answer-highlight">Most people quit tracking because it's tedious. We built Kygo specifically to solve that.</div>
                </div>
              </div>
            </div>
          </section>

          <section class="faq-section" data-category="logging">
            <div class="faq-section-header">
              <div class="faq-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              </div>
              <h2>Food Logging</h2>
            </div>
            <div class="faq-list">
              <div class="faq-item">
                <div class="faq-question"><span>How does photo logging work?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Point, shoot, done.</strong> Take a photo of your meal and we identify every ingredient—including garnishes and toppings like cracked pepper or a drizzle of olive oil.</p>
                  <p>The recognition is detailed enough to catch the small stuff that actually matters for accurate nutrition tracking. You can review and adjust the results if needed, but it's rarely necessary.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Can I use voice to log meals?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Yes.</strong> Just speak naturally: "Two eggs with avocado and whole grain toast" or "chicken salad with ranch dressing for lunch."</p>
                  <p>You can also type the same way—no need to search through databases. We understand natural language and convert it to accurate nutrition data.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>How big is your food database?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Over 5 million foods.</strong> This includes branded products (for barcode scanning), restaurant items, and generic foods. We use the USDA FoodData Central database as our foundation.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>What are meal templates?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Your frequent meals, saved for one-tap logging.</strong> Most people eat similar breakfasts, lunches, or snacks throughout the week.</p>
                  <p>When we notice you logging the same meal repeatedly, we save it as a template. Next time, you can log it with a single tap instead of re-entering everything.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="faq-section" data-category="correlations">
            <div class="faq-section-header">
              <div class="faq-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 5-6"/></svg>
              </div>
              <h2>Correlations</h2>
            </div>
            <div class="faq-list">
              <div class="faq-item">
                <div class="faq-question"><span>How long until I see correlations?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>First correlations typically appear after 7 days</strong> of consistent logging (both nutrition and wearable data). Higher-confidence correlations emerge around day 14 and beyond.</p>
                  <p>The more data you provide, the more correlations we can find and the more confident we can be about them.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>How do you calculate correlation confidence?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p>We use statistical analysis to find patterns, not guesses. Each correlation has two key measures:</p>
                  <ul>
                    <li><strong>Confidence:</strong> How sure we are the pattern is real (not random noise)</li>
                    <li><strong>Strength:</strong> How much impact the food/behavior has on the outcome</li>
                  </ul>
                  <p>We also filter out outliers—one bad night's sleep doesn't skew your data. You only see correlations we're confident about.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>What kinds of correlations can Kygo find?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p>We analyze relationships between your nutrition and biometrics including:</p>
                  <ul>
                    <li>Sleep quality, duration, and latency (time to fall asleep)</li>
                    <li>HRV (heart rate variability)</li>
                    <li>Resting heart rate</li>
                    <li>Recovery scores</li>
                    <li>Energy levels</li>
                  </ul>
                  <p>Example correlations: "Sleep latency +8 min with late caffeine," "HRV +12% on days with no sugar after 6pm," "Deep sleep +23 min with high-protein dinners."</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Do more days of data unlock more correlations?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Yes.</strong> The more you put in, the more you get out. Initial correlations appear at 7 days, but as your dataset grows, we can find more patterns and be more confident about them.</p>
                  <p>Some correlations only become visible with 30+ days of data because they require seeing the pattern repeat multiple times.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="faq-section" data-category="devices">
            <div class="faq-section-header">
              <div class="faq-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
              </div>
              <h2>Devices & Integrations</h2>
            </div>
            <div class="faq-list">
              <div class="faq-item">
                <div class="faq-question"><span>Which wearables do you support?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p>We integrate with:</p>
                  <ul>
                    <li><strong>Oura Ring</strong> – Sleep, HRV, readiness scores</li>
                    <li><strong>Apple Health</strong> – Activity, workouts, steps, and any data your other apps write to Apple Health</li>
                    <li><strong>Fitbit</strong> – Sleep, steps, heart rate</li>
                    <li><strong>Garmin</strong> – Training, recovery, body battery</li>
                  </ul>
                  <p>You can connect one device or multiple—we combine the data to give you the most complete picture.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Can I connect multiple wearables?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Yes, and we recommend it.</strong> Many people use Oura for sleep and Apple Watch or Garmin for workouts. We combine data from all your devices to fill gaps and create a complete health picture.</p>
                  <p>No other app makes it this easy to see all your wearable data in one place.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>How do I connect my wearable?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Three taps:</strong></p>
                  <ul>
                    <li>Go to the Wearables page in the app</li>
                    <li>Tap your device (Oura, Apple Health, Fitbit, or Garmin)</li>
                    <li>Sign in to your account and tap "Approve"</li>
                  </ul>
                  <p>That's it. Your historical data syncs automatically in the background.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Is Kygo available on Android?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Not yet, but it's coming soon.</strong> We're currently iOS only. You can join our Android waitlist on the homepage to be notified when we launch.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="faq-section" data-category="pricing">
            <div class="faq-section-header">
              <div class="faq-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10h8M8 14h8"/></svg>
              </div>
              <h2>Pricing</h2>
            </div>
            <div class="faq-list">
              <div class="faq-item">
                <div class="faq-question"><span>Is Kygo really free?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Yes—there's a free tier that's free forever.</strong> It includes:</p>
                  <ul>
                    <li>Full food logging (photo, voice, barcode, text)</li>
                    <li>All wearable connections and sync</li>
                    <li>Health and nutrition trends</li>
                    <li>Detailed macro and micronutrient tracking</li>
                  </ul>
                  <p>The correlation engine is a premium feature, but you get a <strong>14-day free trial</strong> to try it.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>How much does premium cost?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>$7.99/month or $50/year</strong> (save ~48% with annual).</p>
                  <p>Premium gives you access to the correlation engine—the feature that shows you how your food choices affect your sleep, HRV, and recovery.</p>
                  <div class="answer-highlight">You get a 14-day free trial of premium. No credit card required to start.</div>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Do I need a credit card to start?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>No.</strong> Download the app, start using it immediately. No credit card required. You only pay if you decide to continue with premium after your 14-day trial.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Can I cancel anytime?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Yes.</strong> Cancel anytime through your App Store subscription settings. You'll retain premium access until the end of your billing period.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="faq-section" data-category="privacy">
            <div class="faq-section-header">
              <div class="faq-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h2>Privacy & Data</h2>
            </div>
            <div class="faq-list">
              <div class="faq-item">
                <div class="faq-question"><span>Is my health data secure?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Yes. Your data is encrypted and never sold.</strong></p>
                  <p>We exist to help you understand your health, not to monetize your information. We don't sell your data to third parties, and we don't use it for advertising.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Can I export my data?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Yes.</strong> You can export all your data anytime. It's your data—you should be able to take it with you.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>Can I delete my data?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p><strong>Yes.</strong> You can delete your account and all associated data at any time from within the app. Once deleted, your data is permanently removed from our servers.</p>
                </div>
              </div>
              <div class="faq-item">
                <div class="faq-question"><span>What data do you collect from my wearables?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
                <div class="faq-answer">
                  <p>We collect health and fitness data that you explicitly authorize when connecting your device. This typically includes:</p>
                  <ul>
                    <li>Sleep data (duration, stages, quality)</li>
                    <li>Heart rate and HRV</li>
                    <li>Activity and steps</li>
                    <li>Recovery and readiness scores (where available)</li>
                  </ul>
                  <p>You can see exactly what data we're accessing and revoke access anytime.</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <section class="still-questions">
        <div class="container">
          <div class="still-questions-inner">
            <h2>Still have questions?</h2>
            <p>We're here to help. Reach out and we'll get back to you as soon as possible.</p>
            <div class="contact-options">
              <a href="mailto:${email}" class="contact-option">
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
          <div class="final-cta-inner">
            <div class="final-cta-content">
              <h2>Ready to understand your body?</h2>
              <p>Stop guessing. Start seeing the correlations between what you eat and how you feel.</p>
              <a href="${appStoreUrl}" class="cta-primary" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Download Free on iOS
              </a>
              <p class="risk-reversal">
                <span>Free forever plan</span>
                <span>•</span>
                <span>No credit card required</span>
                <span>•</span>
                <span>Correlations free for 14 days</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('kygo-faq-section', KygoFaqSection);
