/**
 * Kygo Health - Blog Index Custom Element for Wix
 * Tag name: kygo-blog
 */

/** Escapes a value for safe interpolation into HTML attributes / text */
function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const CATEGORY_CONFIG = [
  {
    slug: 'sleep',
    label: 'Sleep',
    aliases: ['sleep'],
    descriptor: 'Sleep science, metrics, and optimization',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
  },
  {
    slug: 'hrv-recovery',
    label: 'Heart Rate & HRV',
    aliases: ['heart rate & hrv', 'heart rate and hrv', 'hrv & recovery', 'hrv and recovery',
              'hrv', 'heart rate', 'resting heart rate', 'hrv recovery'],
    descriptor: 'HRV, resting heart rate, and how accurate they are',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h3l2-6 4 12 2-6h7"/></svg>'
  },
  {
    slug: 'wearables-data',
    label: 'Devices & Buying Guides',
    aliases: ['devices & buying guides', 'devices and buying guides', 'devices', 'buying guides',
              'wearables data', 'wearables', 'wearable data', 'wearable', 'health tech'],
    descriptor: 'Head to head comparisons and what is worth buying',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2h6v4H9zM9 18h6v4H9z"/><path d="M10 12h4"/></svg>'
  },
  {
    slug: 'stress-recovery',
    label: 'Stress & Recovery',
    aliases: ['stress & recovery', 'stress and recovery', 'stress', 'recovery',
              'recovery score', 'readiness'],
    descriptor: 'What stress and recovery scores are actually built from',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 7v5l3 2"/><path d="M16.5 3.5 21 8"/></svg>'
  },
  {
    slug: 'calories-energy-burn',
    label: 'Calories & Energy Burn',
    aliases: ['calories & energy burn', 'calories and energy burn', 'calories', 'calorie burn',
              'energy burn', 'energy expenditure'],
    descriptor: 'How close your calorie burn is to the lab numbers',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c1.5 3 4.5 4.5 4.5 8a4.5 4.5 0 0 1-9 0c0-1.4.5-2.4 1.2-3.3"/><path d="M12 22a6 6 0 0 0 6-6c0-2-1-3.6-2.4-5"/><path d="M12 22a6 6 0 0 1-6-6c0-1.3.4-2.4 1.1-3.4"/></svg>'
  },
  {
    slug: 'activity-fitness',
    label: 'Activity & Fitness',
    aliases: ['activity & fitness', 'activity and fitness', 'activity', 'fitness',
              'steps', 'step count', 'vo2 max', 'vo2max'],
    descriptor: 'Step count accuracy and what actually moves VO2 max',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20v-5"/><path d="M10 20V9"/><path d="M16 20v-8"/><path d="M22 20V4"/></svg>'
  },
  {
    slug: 'nutrition',
    label: 'Nutrition & Food Logging',
    aliases: ['nutrition & food logging', 'nutrition and food logging', 'nutrition',
              'nutrition insights', 'food logging', 'food'],
    descriptor: 'How food affects your body, sleep, and recovery',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 2 6 5 6 9c0 6 6 13 6 13s6-7 6-13c0-4-2-7-6-7z"/><path d="M12 9v6"/></svg>'
  },
  {
    slug: 'app-updates',
    label: 'Kygo Product & Updates',
    aliases: ['kygo product & updates', 'kygo product and updates', 'app updates', 'app update',
              'updates', 'product updates', 'announcements', 'release notes'],
    descriptor: 'What shipped, what is next, and the story behind Kygo',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M11 18h2"/></svg>'
  }
];

const FALLBACK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9h10M7 13h6"/></svg>';

const ALL_TAB = { slug: 'all', label: 'All Posts' };

const PINNED_FEATURED_SLUG = 'what-s-the-most-accurate-wearable-data-a-2024-2025-study-breakdown-by-device';
const IOS_URL = 'https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy';
const ANDROID_URL = 'https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO';

// "Works with" brand-logo badges for the final CTA card (Wix media)
const CTA_BADGES = {
  oura: 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png',
  apple: 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png',
  fitbit: 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png',
  garmin: 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png',
  whoop: 'https://static.wixstatic.com/media/273a63_21019d0fbe9e4afcbabdb3ca9dcad89d~mv2.png',
  googleHealth: 'https://static.wixstatic.com/media/273a63_3f4fd0ee0a0d42dd9eecbeba00b8493e~mv2.png',
  healthConnect: 'https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png',
};

class KygoBlog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._posts = [];
    this._activeSlug = 'all';
    this._query = '';
    this._cats = [];
    this._catBySlug = new Map();
    this._catForPost = new Map();
    this._counts = new Map();
    this._warnedCats = '';
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._renderSeo();
    this._injectStructuredData();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    if (this._resizeObserver) this._resizeObserver.disconnect();
  }

  _parseWixAttributes() {
    try {
      const wixconfig = this.getAttribute('wixconfig');
      const wixsettings = this.getAttribute('wixsettings');
      const posts = this.getAttribute('posts');

      if (wixconfig) this._config = JSON.parse(wixconfig);
      if (wixsettings) this._settings = JSON.parse(wixsettings);
      if (posts) this._posts = JSON.parse(posts);
    } catch (e) {
      console.warn('KygoBlog: Could not parse attributes', e);
    }
  }

  static get observedAttributes() {
    return ['wixsettings', 'posts'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'posts' && newValue) {
      try {
        this._posts = JSON.parse(newValue);
        this.render();
        this._renderSeo();
      } catch (e) {
        console.error('Failed to parse posts:', e);
      }
    } else if (name === 'wixsettings') {
      this._parseWixAttributes();
      this.render();
    }
  }

  _slugify(str) {
    return String(str || '').toLowerCase().trim()
      .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  /**
   * Builds the category index from the POST DATA, not from CATEGORY_CONFIG.
   * Any categorySlug with no config entry still gets a group (headed by the raw
   * `category` string) plus a console warning, so a category added in Wix can
   * never silently drop its posts off the index again.
   */
  _buildCategoryIndex() {
    this._catBySlug = new Map();
    this._catForPost = new Map();
    this._counts = new Map();
    const unknown = new Set();

    CATEGORY_CONFIG.forEach(cfg => this._catBySlug.set(cfg.slug, cfg));

    const extras = [];
    this._posts.forEach(post => {
      const cfg = this._matchConfig(post);
      if (cfg) {
        this._catForPost.set(post, cfg);
        this._counts.set(cfg.slug, (this._counts.get(cfg.slug) || 0) + 1);
        return;
      }
      const rawSlug = (post.categorySlug || '').toString().trim();
      const rawLabel = (post.category || '').toString().trim();
      const slug = this._slugify(rawSlug || rawLabel) || 'uncategorized';
      unknown.add(rawSlug || rawLabel || 'uncategorized');
      let extra = this._catBySlug.get(slug);
      if (!extra) {
        extra = {
          slug,
          label: rawLabel || rawSlug || 'More Articles',
          aliases: [],
          descriptor: '',
          icon: FALLBACK_ICON,
          unconfigured: true
        };
        this._catBySlug.set(slug, extra);
        extras.push(extra);
      }
      this._catForPost.set(post, extra);
      this._counts.set(slug, (this._counts.get(slug) || 0) + 1);
    });

    const key = Array.from(unknown).sort().join('|');
    if (unknown.size && key !== this._warnedCats) {
      this._warnedCats = key;
      console.warn(
        'KygoBlog: category not in CATEGORY_CONFIG, rendered with its raw label — add it to CATEGORY_CONFIG:',
        Array.from(unknown).join(', ')
      );
    }

    // Config order first (matches Wix displayPosition), then any discovered extras.
    this._cats = [...CATEGORY_CONFIG, ...extras].filter(c => (this._counts.get(c.slug) || 0) > 0);
  }

  _matchConfig(post) {
    const rawSlug = (post.categorySlug || '').toString().toLowerCase().trim();
    const rawLabel = (post.category || '').toString().toLowerCase().trim();
    for (const cfg of CATEGORY_CONFIG) {
      if (rawSlug && rawSlug === cfg.slug) return cfg;
      if (rawLabel && (rawLabel === cfg.label.toLowerCase() || cfg.aliases.includes(rawLabel))) return cfg;
    }
    return null;
  }

  _resolveCategory(post) {
    return this._catForPost.get(post) || null;
  }

  _postUrl(post) {
    if (post && post.url) return post.url;
    const slug = post && post.slug ? post.slug : '';
    return slug ? `/post/${slug}` : '/blog';
  }

  _formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  _estimateReadTime(content) {
    if (!content) return 5;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  _sortByDate(posts) {
    return [...posts].sort((a, b) =>
      new Date(b.publishedDate || 0).getTime() - new Date(a.publishedDate || 0).getTime()
    );
  }

  _matchesQuery(post) {
    const q = (this._query || '').toLowerCase().trim();
    if (!q) return true;
    const cat = this._resolveCategory(post);
    const hay = [post.title, post.excerpt, post.category, cat && cat.label]
      .filter(Boolean).join(' ').toLowerCase();
    return q.split(/\s+/).every(term => hay.includes(term));
  }

  _getFilteredPosts() {
    const sorted = this._sortByDate(this._posts).filter(p => this._matchesQuery(p));
    if (this._activeSlug === 'all') return sorted;
    return sorted.filter(p => {
      const cfg = this._resolveCategory(p);
      return cfg && cfg.slug === this._activeSlug;
    });
  }

  _groupByCategory(posts) {
    const groups = new Map();
    this._cats.forEach(cfg => groups.set(cfg.slug, { cfg, posts: [] }));
    posts.forEach(post => {
      const cfg = this._resolveCategory(post);
      if (!cfg) return;
      if (!groups.has(cfg.slug)) groups.set(cfg.slug, { cfg, posts: [] });
      groups.get(cfg.slug).posts.push(post);
    });
    return Array.from(groups.values()).filter(g => g.posts.length > 0);
  }

  _handleCategoryClick(slug) {
    if (slug === this._activeSlug) return;
    this._activeSlug = slug;
    // The chip row is genuinely sticky now, so a mid-page filter would leave the
    // reader stranded in the middle of a list that just changed under them.
    // Only pull back to the top of the results if they had scrolled past it.
    const nav = this.shadowRoot.querySelector('.category-tabs');
    const past = nav ? nav.getBoundingClientRect().top <= 0 : false;
    this.render();
    if (past) {
      const target = this.shadowRoot.querySelector('.category-tabs');
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }

  _handleSearchInput(value) {
    this._query = value;
    this._restoreSearchFocus = true;
    this.render();
  }

  _handlePostClick(slug) {
    if (!slug) return;
    this.dispatchEvent(new CustomEvent('postClick', {
      detail: { slug },
      bubbles: true,
      composed: true
    }));
  }

  _placeholderSvg() {
    return `
      <svg viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <rect width="120" height="120" fill="#F1F5F9"/>
        <circle cx="60" cy="48" r="22" fill="#E2E8F0"/>
        <circle cx="51" cy="46" r="3.5" fill="#22C55E"/>
        <circle cx="69" cy="46" r="3.5" fill="#3B82F6"/>
        <path d="M48 72 Q60 84 72 72" stroke="#94A3B8" stroke-width="3" fill="none" stroke-linecap="round"/>
      </svg>
    `;
  }

  _renderImage(post, alt) {
    if (post.coverImage) {
      return `
        <img src="${esc(post.coverImage)}" alt="${esc(alt || post.title || '')}" loading="lazy" decoding="async"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="image-fallback" style="display:none;">${this._placeholderSvg()}</div>
      `;
    }
    return `<div class="image-fallback">${this._placeholderSvg()}</div>`;
  }

  _renderFeaturedPost(post, opts = {}) {
    if (!post) return '';
    const title = opts.title || 'Featured Article';
    const descriptor = opts.descriptor || 'Our most-read deep dive on wearable accuracy';
    return `
      <header class="featured-header-row">
        <span class="featured-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.39 6.94H22l-6.18 4.49L18.21 21 12 16.77 5.79 21l2.39-7.57L2 8.94h7.61L12 2z"/></svg>
        </span>
        <div class="featured-heading">
          <h2 class="featured-section-title">${esc(title)}</h2>
          <p class="featured-section-descriptor">${esc(descriptor)}</p>
        </div>
        <span class="featured-rule" aria-hidden="true"></span>
      </header>
      <a class="featured-post" href="${esc(this._postUrl(post))}" data-slug="${esc(post.slug || '')}"
         aria-label="Featured: ${esc(post.title || 'Untitled')}">
        <div class="featured-post-image">
          ${this._renderImage(post, post.title)}
        </div>
        <div class="featured-post-content">
          <span class="featured-label">Featured</span>
          <h2 class="featured-post-title">${esc(post.title || 'Untitled')}</h2>
          <p class="featured-post-excerpt">${esc(post.excerpt || '')}</p>
          <div class="post-meta">
            <span>${this._formatDate(post.publishedDate)}</span>
          </div>
        </div>
      </a>
    `;
  }

  _renderPostCard(post) {
    return `
      <a class="post-card" href="${esc(this._postUrl(post))}" data-slug="${esc(post.slug || '')}"
         aria-label="${esc(post.title || 'Untitled')}">
        <div class="post-card-image">
          ${this._renderImage(post, post.title)}
        </div>
        <div class="post-card-content">
          <h3 class="post-card-title">${esc(post.title || 'Untitled')}</h3>
          <p class="post-card-excerpt">${esc(post.excerpt || '')}</p>
          <div class="post-meta post-card-meta">
            <span>${this._formatDate(post.publishedDate)}</span>
          </div>
        </div>
      </a>
    `;
  }

  _renderCategorySection(group) {
    const { cfg, posts } = group;
    return `
      <section class="category-section" data-category="${esc(cfg.slug)}">
        <header class="category-section-header">
          <span class="category-icon" aria-hidden="true">${cfg.icon}</span>
          <div class="category-heading">
            <h2 class="category-name">${esc(cfg.label)}</h2>
            <p class="category-descriptor">${esc(cfg.descriptor)}</p>
          </div>
          <span class="category-rule" aria-hidden="true"></span>
        </header>
        <div class="post-grid">
          ${posts.map(p => this._renderPostCard(p)).join('')}
        </div>
      </section>
    `;
  }

  _renderFilteredGrid(posts) {
    if (posts.length === 0) {
      return `
        <div class="empty-state">
          <h3>No posts yet</h3>
          <p>Check back soon for new articles in this category.</p>
        </div>
      `;
    }
    return `
      <section class="category-section">
        <div class="post-grid">
          ${posts.map(p => this._renderPostCard(p)).join('')}
        </div>
      </section>
    `;
  }

  render() {
    this._buildCategoryIndex();
    const searching = !!(this._query || '').trim();
    const tabs = [
      { ...ALL_TAB, count: this._posts.length },
      ...this._cats.map(c => ({ ...c, count: this._counts.get(c.slug) || 0 }))
    ];
    // A filter chip whose category vanished under the current search shouldn't stay selected.
    if (this._activeSlug !== 'all' && !this._catBySlug.has(this._activeSlug)) this._activeSlug = 'all';
    const allSorted = this._sortByDate(this._posts);
    const isAll = this._activeSlug === 'all';

    let heroHtml = '';
    let sectionsHtml = '';
    if (this._posts.length === 0) {
      sectionsHtml = `<div class="loading"><div class="loading-spinner"></div></div>`;
    } else if (searching) {
      // Search collapses the grouping: one flat, relevance-neutral, date-sorted list.
      const results = this._getFilteredPosts();
      sectionsHtml = `
        <p class="search-summary" role="status">
          ${results.length} ${results.length === 1 ? 'post' : 'posts'} matching &ldquo;${esc(this._query.trim())}&rdquo;
        </p>
        ${this._renderFilteredGrid(results)}
      `;
    } else if (isAll) {
      const pinned = allSorted.find(p => p.slug === PINNED_FEATURED_SLUG);
      const featured = pinned || allSorted[0];
      const rest = allSorted.filter(p => p !== featured);
      const groups = this._groupByCategory(rest);
      heroHtml = this._renderFeaturedPost(featured);
      sectionsHtml = groups.map(g => this._renderCategorySection(g)).join('');
    } else {
      const filtered = this._getFilteredPosts();
      if (filtered.length === 0) {
        sectionsHtml = this._renderFilteredGrid(filtered);
      } else {
        const cfg = this._catBySlug.get(this._activeSlug);
        const pinned = filtered.find(p => p.slug === PINNED_FEATURED_SLUG);
        const featured = pinned || filtered[0];
        const rest = filtered.filter(p => p !== featured);
        heroHtml = this._renderFeaturedPost(featured, {
          title: cfg ? `Featured in ${cfg.label}` : 'Featured Article',
          descriptor: cfg ? cfg.descriptor : ''
        });
        sectionsHtml = rest.length ? this._renderFilteredGrid(rest) : '';
      }
    }

    const tabsHtml = `
      <nav class="category-tabs" aria-label="Blog categories">
        <div class="container">
          <div class="category-tabs-top">
            <span class="category-tabs-label">Browse by topic</span>
            <div class="search-box">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input class="search-input" type="search" autocomplete="off"
                     placeholder="Search articles" aria-label="Search articles" />
            </div>
          </div>
          <div class="category-tabs-scroller">
            <div class="category-tabs-inner" role="tablist">
              ${tabs.map(t => `
                <button
                  class="category-tab ${t.slug === this._activeSlug ? 'active' : ''}"
                  data-slug="${esc(t.slug)}"
                  role="tab"
                  aria-selected="${t.slug === this._activeSlug ? 'true' : 'false'}">
                  ${esc(t.label)}<span class="tab-count">${t.count}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </nav>
    `;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --dark: #1E293B;
          --light: #F8FAFC;
          --green: #22C55E;
          --green-dark: #16A34A;
          --green-light: rgba(34, 197, 94, 0.12);
          --gray-100: #F1F5F9;
          --gray-200: #E2E8F0;
          --gray-300: #CBD5E1;
          --gray-400: #94A3B8;
          --gray-500: #64748b;
          --gray-600: #475569;

          display: block;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--light);
          color: var(--dark);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        h1, h2, h3 {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        a { color: inherit; text-decoration: none; }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* BLOG HEADER */
        .blog-header {
          text-align: center;
          padding: 28px 0 18px;
          background: #fff;
        }
        .blog-header h1 {
          font-size: 32px;
          color: var(--dark);
          letter-spacing: -0.02em;
        }
        .blog-header h1 .hl { color: var(--green); }
        .kicker-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--green-light);
          color: var(--green-dark);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .kicker-pill svg { width: 14px; height: 14px; }
        .blog-header .subtitle {
          margin-top: 10px;
          color: var(--gray-500);
          font-size: 15px;
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
        }

        /* CATEGORY TABS */
        .category-tabs {
          background: #fff;
          border-bottom: 1px solid var(--gray-200);
          position: sticky;
          top: 0;
          z-index: 30;
        }
        .category-tabs-top {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 14px;
        }
        .search-box {
          position: relative;
          flex: 0 0 auto;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: var(--gray-400);
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 9px 14px 9px 36px;
          border: 1px solid var(--gray-200);
          border-radius: 999px;
          background: #fff;
          font-family: inherit;
          font-size: 14px;
          color: var(--dark);
          -webkit-appearance: none;
          appearance: none;
        }
        .search-input::placeholder { color: var(--gray-400); }
        .search-input:focus {
          outline: none;
          border-color: var(--green);
          box-shadow: 0 0 0 3px var(--green-light);
        }
        .search-input::-webkit-search-cancel-button { cursor: pointer; }
        .search-summary {
          font-size: 14px;
          color: var(--gray-500);
          margin-bottom: 16px;
        }
        /* Nine-plus chips at 375px: bleed to the screen edge and fade out, so
           it reads as scrollable rather than as a row that happens to be clipped. */
        .category-tabs-scroller {
          position: relative;
          margin: 0 -20px;
        }
        .category-tabs-inner { padding-left: 20px; padding-right: 20px; }
        .category-tabs-scroller::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 16px;
          right: 0;
          width: 40px;
          pointer-events: none;
          background: linear-gradient(90deg, rgba(255,255,255,0), #fff 70%);
        }
        .category-tabs-label {
          display: block;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--gray-500);
          margin-bottom: 0;
          /* Hidden below 600px: the sticky bar is 128px there otherwise, and the
             search placeholder plus the chips already say what this row is. */
          display: none;
        }
        .category-tabs-inner {
          display: flex;
          gap: 8px;
          padding: 0 0 16px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          flex-wrap: nowrap;
        }
        .category-tabs-inner::-webkit-scrollbar { display: none; }
        .category-tab {
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-600);
          background: white;
          border: 1px solid var(--gray-200);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          font-family: inherit;
          flex: 0 0 auto;
        }
        .category-tab:hover {
          color: var(--dark);
          background: var(--gray-100);
        }
        .category-tab.active {
          background: var(--green);
          color: white;
          border-color: var(--green);
        }
        .category-tab:focus-visible {
          outline: 2px solid var(--green-dark);
          outline-offset: 2px;
        }
        .tab-count {
          display: inline-block;
          margin-left: 6px;
          font-size: 12px;
          font-weight: 600;
          color: var(--gray-400);
          font-variant-numeric: tabular-nums;
        }
        .category-tab.active .tab-count { color: rgba(255, 255, 255, 0.85); }

        /* HERO BAND (grey — featured card pops here, like the list) */
        .hero-band {
          background: var(--light);
          padding: 24px 0 48px;
        }

        /* FEATURED SECTION HEADER */
        .featured-header-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .featured-badge {
          flex: 0 0 auto;
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: linear-gradient(135deg, var(--green), var(--green-dark));
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 14px rgba(34, 197, 94, 0.3);
        }
        .featured-badge svg { width: 16px; height: 16px; }
        .featured-heading { flex: 0 1 auto; min-width: 0; }
        .featured-section-title {
          font-size: 16.5px;
          color: var(--dark);
        }
        .featured-section-descriptor {
          font-size: 12px;
          color: var(--gray-500);
          margin-top: 2px;
        }
        .featured-rule {
          display: none;
          flex: 1;
          height: 1px;
          background: var(--gray-200);
          margin-left: 4px;
        }

        /* SECTIONS BAND (grey — white cards pop here) */
        .sections-band {
          background: var(--light);
          padding: 32px 0 72px;
          position: relative;
        }

        /* FEATURED POST */
        .featured-post {
          display: flex;
          flex-direction: column;
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
        }
        .featured-post:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 48px rgba(15, 23, 42, 0.12);
          border-color: var(--gray-300);
        }
        .featured-post-image {
          aspect-ratio: 16 / 9;
          background: var(--gray-100);
          overflow: hidden;
          position: relative;
        }
        .featured-post-image img,
        .featured-post-image .image-fallback {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .featured-post-image .image-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .featured-post-image .image-fallback svg {
          width: 100%;
          height: 100%;
        }
        .featured-post-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .featured-label {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          align-self: flex-start;
          padding: 5px 12px;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--green), var(--green-dark));
          color: white;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          box-shadow: 0 4px 10px rgba(34, 197, 94, 0.25);
        }
        .featured-label::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.35);
        }
        .featured-post-title {
          font-size: 22px;
          color: var(--dark);
        }
        .featured-post-excerpt {
          color: var(--gray-600);
          font-size: 15px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* POST META */
        .post-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--gray-500);
          font-size: 13px;
        }
        .post-meta .dot { opacity: 0.6; }

        /* CATEGORY SECTIONS */
        .category-section { margin-bottom: 48px; }
        .category-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          position: sticky;
          top: var(--tabs-h, 104px);
          z-index: 10;
          background: var(--light);
          padding: 10px 0;
        }
        .category-icon {
          flex: 0 0 auto;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--green-light);
          color: var(--green-dark);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .category-icon svg { width: 20px; height: 20px; }
        .category-heading { flex: 0 1 auto; min-width: 0; }
        .category-name {
          font-size: 20px;
          color: var(--dark);
        }
        .category-descriptor {
          font-size: 13px;
          color: var(--gray-500);
          margin-top: 2px;
        }
        .category-rule {
          display: none;
          flex: 1;
          height: 1px;
          background: var(--gray-200);
          margin-left: 4px;
        }

        /* POST GRID (mobile: compact horizontal) */
        .post-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .post-card {
          display: flex;
          gap: 14px;
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: 16px;
          padding: 12px;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
          position: relative;
          overflow: hidden;
        }
        .post-card::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--green), var(--green-dark));
          border-radius: 16px 16px 0 0;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .post-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 32px rgba(15, 23, 42, 0.1);
          border-color: var(--gray-300);
        }
        .post-card:hover::after { opacity: 1; }
        .post-card:focus-visible,
        .featured-post:focus-visible {
          outline: 2px solid var(--green);
          outline-offset: 3px;
        }
        .post-card-image {
          flex: 0 0 86px;
          width: 86px;
          height: 86px;
          border-radius: 10px;
          overflow: hidden;
          background: var(--gray-100);
          position: relative;
        }
        .post-card-image img,
        .post-card-image .image-fallback {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .post-card-image .image-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .post-card-image .image-fallback svg { width: 100%; height: 100%; }
        .post-card-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
        }
        .post-card-title {
          font-size: 13.5px;
          line-height: 1.3;
          color: var(--dark);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .post-card-excerpt {
          font-size: 12px;
          line-height: 1.45;
          color: var(--gray-600);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .post-card-meta {
          font-size: 12px;
          margin-top: 2px;
        }

        /* EMPTY / LOADING */
        .empty-state, .loading {
          text-align: center;
          padding: 64px 16px;
          color: var(--gray-500);
        }
        .empty-state h3 {
          margin-bottom: 6px;
          color: var(--dark);
          font-size: 18px;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--gray-200);
          border-top-color: var(--green);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* TABLET (≥600px) */
        @media (min-width: 600px) {
          .container { padding: 0 28px; }
          .blog-header { padding: 36px 0 22px; }
          .blog-header h1 { font-size: 36px; }
          .blog-header .subtitle { font-size: 16px; }
          .category-tabs-label { display: block; }
          .category-tabs-top {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
          }
          .search-box { width: 260px; }
          .category-tabs-scroller { margin: 0 -28px; }
          .category-tabs-inner { gap: 10px; padding: 0 28px 16px; }
          .category-tab { padding: 9px 18px; font-size: 14px; }
          .hero-band { padding: 28px 0 44px; }
          .sections-band { padding: 40px 0 96px; }

          .featured-header-row { margin-bottom: 24px; gap: 12px; }
          .featured-badge { width: 36px; height: 36px; border-radius: 10px; }
          .featured-badge svg { width: 18px; height: 18px; }
          .featured-section-title { font-size: 20px; }
          .featured-section-descriptor { font-size: 13px; }
          .featured-post-content { padding: 24px 28px; gap: 12px; }
          .featured-post-title { font-size: 24px; }

          .category-section { margin-bottom: 64px; }
          .category-section-header { gap: 14px; margin-bottom: 24px; }
          .category-name { font-size: 22px; }
          .category-descriptor { font-size: 14px; }

          .post-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 22px;
          }
          .post-card {
            flex-direction: column;
            padding: 0;
            gap: 0;
            overflow: hidden;
          }
          .post-card-image {
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            aspect-ratio: 16 / 10;
            border-radius: 0;
          }
          .post-card-content {
            padding: 18px 20px 20px;
            gap: 8px;
          }
          .post-card-title { font-size: 17px; }
          .post-card-excerpt { font-size: 14px; }
          .post-card-meta { font-size: 13px; margin-top: 4px; }
        }

        /* DESKTOP (≥960px) */
        @media (min-width: 960px) {
          .container { padding: 0 40px; }
          .blog-header { padding: 44px 0 26px; }
          .blog-header h1 { font-size: 44px; }
          .hero-band { padding: 28px 0 52px; }
          /* Enough room for every chip: wrap instead of scroll, drop the bleed and fade. */
          .category-tabs-scroller { margin: 0; }
          .category-tabs-inner { flex-wrap: wrap; overflow-x: visible; padding: 0 0 16px; }
          .category-tabs-scroller::after { display: none; }
          .sections-band { padding: 48px 0 120px; }

          .featured-header-row { margin-bottom: 24px; }
          .featured-section-title { font-size: 22px; }
          .featured-section-descriptor { font-size: 14px; }

          .featured-post {
            flex-direction: row;
            align-items: stretch;
          }
          .featured-post-image {
            flex: 0 0 52%;
            aspect-ratio: auto;
            min-height: 280px;
          }
          .featured-post-content {
            flex: 0 0 48%;
            padding: 32px 36px;
            justify-content: center;
          }
          .featured-post-title { font-size: 28px; }

          .category-rule,
          .featured-rule { display: block; }
          .category-section { margin-bottom: 72px; }

          .post-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 26px;
          }
        }

        /* FINAL CTA — dark card (matches tool pages) */
        .final-cta {
          padding: 72px 0;
          background: #fff;
        }
        .kygo-cta-card {
          background: #0F172A;
          border-radius: 24px;
          padding: 40px 24px;
          position: relative;
          overflow: hidden;
          color: #fff;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .kygo-cta-card::before {
          content: '';
          position: absolute;
          top: -160px;
          right: -160px;
          width: 520px;
          height: 520px;
          background: radial-gradient(closest-side, rgba(34, 197, 94, 0.30), transparent);
          pointer-events: none;
        }
        .kygo-cta-card::after {
          content: '';
          position: absolute;
          bottom: -180px;
          left: -180px;
          width: 480px;
          height: 480px;
          background: radial-gradient(closest-side, rgba(34, 197, 94, 0.12), transparent);
          pointer-events: none;
        }
        .kygo-cta-card .cta-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(34, 197, 94, 0.16);
          color: #6EE7A0;
          padding: 6px 14px;
          border-radius: 999px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }
        .kygo-cta-card .cta-pill .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 8px var(--green);
        }
        .kygo-cta-card h2 {
          position: relative;
          color: #fff;
          font-size: clamp(26px, 4.5vw, 42px);
          line-height: 1.05;
          margin: 18px 0 14px;
          max-width: 22ch;
        }
        .kygo-cta-card h2 span { color: var(--green); }
        .kygo-cta-card > p {
          position: relative;
          color: rgba(255, 255, 255, 0.72);
          font-size: clamp(14px, 1.6vw, 16px);
          line-height: 1.6;
          max-width: 56ch;
          margin: 0 auto 24px;
        }
        .kygo-cta-card > p em { font-style: italic; color: #fff; }
        .cta-buttons {
          position: relative;
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          width: 100%;
        }
        .cta-primary,
        .cta-android {
          background: var(--green);
          color: #fff;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          border: none;
          cursor: pointer;
          font-family: inherit;
          -webkit-tap-highlight-color: transparent;
        }
        .cta-primary:hover,
        .cta-android:hover {
          background: var(--green-dark);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(34, 197, 94, 0.30);
        }
        .cta-primary:active,
        .cta-primary:focus,
        .cta-android:active,
        .cta-android:focus {
          outline: none;
          transform: translateY(0);
          box-shadow: 0 4px 15px rgba(34, 197, 94, 0.20);
        }
        .cta-primary svg,
        .cta-android svg {
          width: 18px;
          height: 18px;
        }

        /* Mid-content contextual app CTA (compact green card) */
        .kearly-section { padding: 48px 0; }
        .kband { max-width: 1100px; margin: 0 auto; }
        .kband-inner { position: relative; overflow: hidden; background: #fff; border: 2px solid var(--border-subtle, #E2E8F0); border-radius: 20px; padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; gap: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .kband-glow { position: absolute; top: -120px; right: -80px; width: 360px; height: 360px; background: radial-gradient(circle, rgba(34,197,94,0.14), transparent 65%); pointer-events: none; }
        .kband-copy { position: relative; display: flex; flex-direction: column; gap: 10px; max-width: 560px; }
        .kband-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 12px; letter-spacing: 0.7px; text-transform: uppercase; color: var(--green-dark, #16A34A); }
        .kband-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green, #22C55E); animation: kygoPulse 2s ease-out infinite; }
        .kband-headline { margin: 0; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 28px; line-height: 1.25; color: var(--dark, #1E293B); }
        .kband-actions { position: relative; display: flex; gap: 12px; flex-shrink: 0; }
        .kband-btn { display: inline-flex; align-items: center; gap: 9px; text-decoration: none; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; padding: 15px 24px; border-radius: 12px; white-space: nowrap; transition: transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease; }
        .kband-btn svg { width: 17px; height: 17px; flex-shrink: 0; }
        .kband-btn-ios { background: var(--green, #22C55E); color: #fff; box-shadow: 0 6px 16px rgba(34,197,94,0.28); }
        .kband-btn-ios:hover { background: var(--green-dark, #16A34A); transform: translateY(-2px); box-shadow: 0 10px 20px rgba(34,197,94,0.3); }
        .kband-btn-android { background: #fff; color: var(--green-dark, #16A34A); border: 2px solid var(--border-subtle, #E2E8F0); }
        .kband-btn-android:hover { border-color: var(--green, #22C55E); transform: translateY(-2px); }
        @keyframes kygoPulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.55); } 70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }
        @media (max-width: 640px) {
          .kband-inner { flex-direction: column; align-items: flex-start; gap: 22px; padding: 28px 24px; }
          .kband-actions { width: 100%; flex-direction: column; }
          .kband-btn { width: 100%; justify-content: center; }
          .kband-headline { font-size: 24px; }
        }
        @media (prefers-reduced-motion: reduce) { .kband-dot { animation: none; } }
        .cta-works {
          position: relative;
          margin-top: 26px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
        }
        /* Logo tile + brand label, matching the homepage step-2 chips. Always one line. */
        .cta-badges { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: center; gap: 6px; row-gap: 12px; }
        .cta-chip { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 0 0 auto; }
        .cta-chip-tile { width: 40px; height: 40px; flex-shrink: 0; border-radius: 11px; background: #fff; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .cta-chip-tile img { width: 100%; height: 100%; object-fit: cover; border-radius: 11px; display: block; }
        .cta-chip-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.6); white-space: nowrap; }
        @media (max-width: 420px) { .cta-badges { gap: 4px; } .cta-chip-tile { width: 36px; height: 36px; } .cta-chip-label { font-size: 9.5px; } }
        @media (max-width: 360px) { .cta-badges { gap: 2px; } .cta-chip-tile { width: 28px; height: 28px; } .cta-chip-label { font-size: 7.5px; } }

        @media (max-width: 480px) {
          .cta-buttons { flex-direction: column; align-items: center; }
          .cta-buttons .cta-primary,
          .cta-buttons .cta-android {
            width: 100%;
            max-width: 280px;
          }
        }

        @media (min-width: 768px) {
          .final-cta { padding: 96px 0; }
          .kygo-cta-card { padding: 56px 40px; }
        }

        /* ANIMATIONS */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          opacity: 0;
          transform: translateY(16px);
        }
        .animate-in.visible {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-in, .animate-in.visible {
            opacity: 1;
            transform: none;
            animation: none;
          }
          .featured-post:hover,
          .post-card:hover { transform: none; }
          .loading-spinner { animation: none; }
        }
      </style>

      <header class="blog-header">
        <div class="container">
          <div class="kicker-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg> Research-Based Guides</div>
          <h1>Kygo Health's <span class="hl">Blog</span></h1>
          <p class="subtitle">Research-backed deep dives on sleep, HRV, nutrition, and the accuracy of the wearables that track them.</p>
        </div>
      </header>

      ${tabsHtml}

      ${heroHtml ? `
        <section class="hero-band">
          <div class="container">
            ${heroHtml}
          </div>
        </section>
      ` : ''}

      ${heroHtml ? `
        <section class="kearly-section">
          <div class="container">
            <div class="kband animate-on-scroll">
              <div class="kband-inner">
                <div class="kband-glow"></div>
                <div class="kband-copy">
                  <span class="kband-eyebrow"><span class="kband-dot"></span>From guessing to knowing</span>
                  <h2 class="kband-headline">See how your food affects your sleep, energy &amp; recovery.</h2>
                </div>
                <div class="kband-actions">
                  <a href="${IOS_URL}" class="kband-btn kband-btn-ios" data-track-position="mid" data-track-label="blog-mid-ios" target="_blank" rel="noopener">
                    <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M17.05 12.5c-.02-2.1 1.71-3.11 1.79-3.16-.98-1.43-2.5-1.62-3.03-1.64-1.29-.13-2.52.76-3.17.76-.65 0-1.66-.74-2.73-.72-1.4.02-2.7.82-3.42 2.07-1.46 2.54-.37 6.3 1.05 8.36.7 1.01 1.53 2.14 2.62 2.1 1.05-.04 1.45-.68 2.72-.68 1.27 0 1.63.68 2.74.66 1.13-.02 1.85-1.03 2.54-2.04.8-1.17 1.13-2.3 1.15-2.36-.03-.01-2.2-.84-2.22-3.35zM15.02 5.9c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.53.62-1 1.61-.88 2.56.93.07 1.88-.47 2.46-1.16z"/></svg>
                    Download for iOS
                  </a>
                  <a href="${ANDROID_URL}" class="kband-btn kband-btn-android" data-action="android-download" data-track-position="mid" data-track-label="blog-mid-android" target="_blank" rel="noopener">
                    <svg viewBox="0 0 24 24" fill="#22C55E" aria-hidden="true"><path d="M6 9v7a1 1 0 001 1h1v3a1 1 0 002 0v-3h4v3a1 1 0 002 0v-3h1a1 1 0 001-1V9H6zM4.5 9A1.5 1.5 0 003 10.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 004.5 9zm15 0a1.5 1.5 0 00-1.5 1.5v4a1.5 1.5 0 003 0v-4A1.5 1.5 0 0019.5 9zM15.5 4.2l1-1.4a.3.3 0 00-.5-.35l-1.1 1.53a5.9 5.9 0 00-3.8 0L9.99 2.45a.3.3 0 00-.5.35l1 1.4A5.28 5.28 0 006 8.2h12a5.28 5.28 0 00-2.5-4zM9.5 6.4a.6.6 0 110-1.2.6.6 0 010 1.2zm5 0a.6.6 0 110-1.2.6.6 0 010 1.2z"/></svg>
                    Get Android
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      ` : ''}

      <main class="blog-body sections-band">
        <div class="container">
          ${sectionsHtml}
        </div>
      </main>

      <section class="final-cta">
        <div class="container">
          <div class="kygo-cta-card animate-on-scroll">
            <div class="cta-pill"><span class="dot"></span> Free Forever Plan</div>
            <h2>Research talks averages. <span>Your body doesn't.</span></h2>
            <p>Kygo cross-checks your own wearable data against what you eat, train, and sleep, so you see what's actually true for you.</p>
            <div class="cta-buttons">
              <a href="${IOS_URL}" class="cta-primary" data-track-position="footer-cta" data-track-label="blog-footer-ios" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Download for iOS
              </a>
              <a href="${ANDROID_URL}" target="_blank" rel="noopener" class="cta-android" data-action="android-download" data-track-position="footer-cta" data-track-label="blog-footer-android">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                Download for Android
              </a>
            </div>
            <p style="position:relative;margin:16px 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.72);text-align:center;">Free plan available. Save 58% on yearly. Cancel anytime.</p>
            <div class="cta-works">
              <span>Works with</span>
              <div class="cta-badges">
                <span class="cta-chip"><span class="cta-chip-tile"><img src="${CTA_BADGES.oura}" alt="Oura Ring" title="Oura Ring" loading="lazy" /></span><span class="cta-chip-label">Oura</span></span>
                <span class="cta-chip"><span class="cta-chip-tile"><img src="${CTA_BADGES.apple}" alt="Apple Health" title="Apple Health" loading="lazy" /></span><span class="cta-chip-label">Apple</span></span>
                <span class="cta-chip"><span class="cta-chip-tile"><img src="${CTA_BADGES.fitbit}" alt="Fitbit" title="Fitbit" loading="lazy" /></span><span class="cta-chip-label">Fitbit</span></span>
                <span class="cta-chip"><span class="cta-chip-tile"><img src="${CTA_BADGES.garmin}" alt="Garmin" title="Garmin" loading="lazy" /></span><span class="cta-chip-label">Garmin</span></span>
                <span class="cta-chip"><span class="cta-chip-tile"><img src="${CTA_BADGES.whoop}" alt="WHOOP" title="WHOOP" loading="lazy" /></span><span class="cta-chip-label">WHOOP</span></span>
                <span class="cta-chip"><span class="cta-chip-tile"><img src="${CTA_BADGES.googleHealth}" alt="Google Health" title="Google Health" loading="lazy" /></span><span class="cta-chip-label">Google</span></span>
                <span class="cta-chip"><span class="cta-chip-tile"><img src="${CTA_BADGES.healthConnect}" alt="Health Connect" title="Health Connect" loading="lazy" /></span><span class="cta-chip-label">Health</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    this._bindEvents();
    this._setupScrollAnimations();
  }

  _bindEvents() {
    this.shadowRoot.querySelectorAll('.category-tab').forEach(tab => {
      tab.addEventListener('click', () => this._handleCategoryClick(tab.dataset.slug));
    });

    const search = this.shadowRoot.querySelector('.search-input');
    if (search) {
      search.value = this._query || '';
      search.addEventListener('input', (e) => this._handleSearchInput(e.target.value));
      if (this._restoreSearchFocus) {
        this._restoreSearchFocus = false;
        search.focus();
        const end = search.value.length;
        try { search.setSelectionRange(end, end); } catch (e) { /* type=search may refuse */ }
      }
    }

    // Cards are real <a href="/post/..."> now, so hover-preview, middle-click,
    // cmd-click, "copy link address" and keyboard Enter all work for free.
    // A plain left-click still routes through the Wix Velo `postClick` handler,
    // which is what owns navigation on the live site.
    this.shadowRoot.querySelectorAll('.featured-post, .post-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const slug = card.dataset.slug;
        if (!slug) return;
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button && e.button !== 0)) {
          // Let the browser open it in a new tab/window; still report the click.
          this._handlePostClick(slug);
          return;
        }
        e.preventDefault();
        this._handlePostClick(slug);
      });
      card.addEventListener('auxclick', (e) => {
        if (e.button === 1) this._handlePostClick(card.dataset.slug);
      });
    });

    this._measureStickyOffset();
  }

  /**
   * Category headings pin below the chip row, so the offset has to track the
   * chip row's real height (one line vs. wrapped, mobile vs. desktop).
   */
  _measureStickyOffset() {
    const nav = this.shadowRoot.querySelector('.category-tabs');
    if (!nav) return;
    const apply = () => this.style.setProperty('--tabs-h', `${Math.round(nav.offsetHeight)}px`);
    apply();
    if (this._resizeObserver) this._resizeObserver.disconnect();
    if (typeof ResizeObserver === 'function') {
      this._resizeObserver = new ResizeObserver(apply);
      this._resizeObserver.observe(nav);
    }
  }

  _setupScrollAnimations() {
    requestAnimationFrame(() => {
      const targets = this.shadowRoot.querySelectorAll('.featured-post, .post-card');
      if (!targets.length) return;
      targets.forEach(el => el.classList.add('animate-in'));
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this._observer.unobserve(entry.target);
          }
        });
      }, { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
      targets.forEach(el => this._observer.observe(el));
    });
  }

  /**
   * Light-DOM mirror for crawlers and AI tools. The post cards are real anchors,
   * but they live in the shadow root, which many crawlers don't traverse — so the
   * index's outbound links are repeated here as plain <a> elements.
   */
  _renderSeo() {
    const existing = this.querySelector('[data-seo]');
    if (existing) existing.remove();
    const d = document.createElement('div');
    d.setAttribute('data-seo', '');
    d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';

    const summary = document.createElement('p');
    summary.textContent = 'Kygo Health Blog — Research-backed articles across sleep, heart rate and HRV, devices and buying guides, stress and recovery, calories and energy burn, activity and fitness, nutrition and food logging, and Kygo product updates. Covers Apple Watch, Oura Ring, Garmin, WHOOP, and Fitbit accuracy, sleep optimization, heart rate variability, calorie-burn and step-count accuracy, VO2 max, food-body correlations, and AI-powered nutrition analysis.';
    d.appendChild(summary);

    this._buildCategoryIndex();
    this._cats.forEach(cfg => {
      const posts = this._sortByDate(this._posts).filter(p => this._resolveCategory(p) === cfg);
      if (!posts.length) return;
      const h = document.createElement('h2');
      h.textContent = cfg.label;
      d.appendChild(h);
      const ul = document.createElement('ul');
      posts.forEach(post => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = this._postUrl(post);
        a.textContent = post.title || 'Untitled';
        li.appendChild(a);
        ul.appendChild(li);
      });
      d.appendChild(ul);
    });

    this.appendChild(d);
  }

  _injectStructuredData() {
    if (!document.querySelector('script[data-kygo-blog-ld]')) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': 'Kygo Health Blog',
        'description': 'Articles on wearable accuracy, sleep science, HRV and recovery, nutrition, and app updates from Kygo Health.',
        'url': 'https://www.kygo.app/blog',
        'author': { '@type': 'Organization', 'name': 'Kygo Health', 'url': 'https://www.kygo.app' },
        'publisher': {
          '@type': 'Organization',
          'name': 'Kygo Health',
          'url': 'https://www.kygo.app',
          'logo': { '@type': 'ImageObject', 'url': 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png' }
        },
        'inLanguage': 'en'
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-kygo-blog-ld', '');
      script.textContent = JSON.stringify(ld);
      document.head.appendChild(script);
    }
  }
}

customElements.define('kygo-blog', KygoBlog);
