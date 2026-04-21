/** Injects accessible text into light DOM so crawlers and AI tools can read component content */
function __seo(el, text) {
  if (el.querySelector('[data-seo]')) return;
  const d = document.createElement('div');
  d.setAttribute('data-seo', '');
  d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
  d.textContent = text;
  el.appendChild(d);
}

const CATEGORY_CONFIG = [
  {
    slug: 'wearables-data',
    label: 'Wearables Data',
    aliases: ['wearables data', 'wearables', 'wearable data', 'wearable', 'health tech'],
    descriptor: 'Accuracy and insights from Apple Watch, Oura, Garmin & more',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2h6v4H9zM9 18h6v4H9z"/><path d="M10 12h4"/></svg>'
  },
  {
    slug: 'sleep',
    label: 'Sleep',
    aliases: ['sleep'],
    descriptor: 'Sleep science, metrics, and optimization',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
  },
  {
    slug: 'hrv-recovery',
    label: 'HRV & Recovery',
    aliases: ['hrv & recovery', 'hrv and recovery', 'hrv', 'recovery', 'hrv recovery'],
    descriptor: 'Heart rate variability and recovery insights',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h3l2-6 4 12 2-6h7"/></svg>'
  },
  {
    slug: 'nutrition',
    label: 'Nutrition',
    aliases: ['nutrition', 'nutrition insights', 'food'],
    descriptor: 'How food affects your body, sleep, and recovery',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 2 6 5 6 9c0 6 6 13 6 13s6-7 6-13c0-4-2-7-6-7z"/><path d="M12 9v6"/></svg>'
  },
  {
    slug: 'app-updates',
    label: 'App Updates',
    aliases: ['app updates', 'app update', 'updates', 'release notes'],
    descriptor: 'New features, improvements, and release notes',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M11 18h2"/></svg>'
  }
];

const ALL_TAB = { slug: 'all', label: 'All Posts' };

const PINNED_FEATURED_SLUG = 'what-s-the-most-accurate-wearable-data-a-2024-2025-study-breakdown-by-device';
const IOS_URL = 'https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589';
const ANDROID_URL = 'https://kygo.app/android';

class KygoBlog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._posts = [];
    this._activeSlug = 'all';
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    __seo(this, 'Kygo Health Blog — Research-backed articles on wearable accuracy, sleep science, HRV and recovery, nutrition, and app updates. Covers Apple Watch, Oura Ring, Garmin, WHOOP, and Fitbit accuracy, sleep optimization, heart rate variability, food-body correlations, and AI-powered nutrition analysis.');
    this._injectStructuredData();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
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
      } catch (e) {
        console.error('Failed to parse posts:', e);
      }
    } else if (name === 'wixsettings') {
      this._parseWixAttributes();
      this.render();
    }
  }

  _resolveCategory(post) {
    const rawSlug = (post.categorySlug || '').toString().toLowerCase().trim();
    const rawLabel = (post.category || '').toString().toLowerCase().trim();
    for (const cfg of CATEGORY_CONFIG) {
      if (rawSlug && rawSlug === cfg.slug) return cfg;
      if (rawLabel && (rawLabel === cfg.label.toLowerCase() || cfg.aliases.includes(rawLabel))) return cfg;
    }
    return null;
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

  _getFilteredPosts() {
    const sorted = this._sortByDate(this._posts);
    if (this._activeSlug === 'all') return sorted;
    return sorted.filter(p => {
      const cfg = this._resolveCategory(p);
      return cfg && cfg.slug === this._activeSlug;
    });
  }

  _groupByCategory(posts) {
    const groups = new Map();
    CATEGORY_CONFIG.forEach(cfg => groups.set(cfg.slug, { cfg, posts: [] }));
    posts.forEach(post => {
      const cfg = this._resolveCategory(post);
      if (cfg) groups.get(cfg.slug).posts.push(post);
    });
    return Array.from(groups.values()).filter(g => g.posts.length > 0);
  }

  _handleCategoryClick(slug) {
    this._activeSlug = slug;
    this.render();
    const top = this.shadowRoot.querySelector('.blog-body');
    if (top && typeof top.scrollIntoView === 'function') {
      top.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
        <img src="${post.coverImage}" alt="${alt || post.title || ''}" loading="lazy"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="image-fallback" style="display:none;">${this._placeholderSvg()}</div>
      `;
    }
    return `<div class="image-fallback">${this._placeholderSvg()}</div>`;
  }

  _renderFeaturedPost(post) {
    if (!post) return '';
    return `
      <article class="featured-post" data-slug="${post.slug || ''}" role="button" tabindex="0"
               aria-label="Featured: ${post.title || 'Untitled'}">
        <div class="featured-post-image">
          ${this._renderImage(post, post.title)}
        </div>
        <div class="featured-post-content">
          <span class="featured-label">Featured</span>
          <h2 class="featured-post-title">${post.title || 'Untitled'}</h2>
          <p class="featured-post-excerpt">${post.excerpt || ''}</p>
          <div class="post-meta">
            <span>${this._estimateReadTime(post.excerpt)} min read</span>
            <span class="dot">•</span>
            <span>${this._formatDate(post.publishedDate)}</span>
          </div>
        </div>
      </article>
    `;
  }

  _renderPostCard(post) {
    return `
      <article class="post-card" data-slug="${post.slug || ''}" role="button" tabindex="0"
               aria-label="${post.title || 'Untitled'}">
        <div class="post-card-image">
          ${this._renderImage(post, post.title)}
        </div>
        <div class="post-card-content">
          <h3 class="post-card-title">${post.title || 'Untitled'}</h3>
          <p class="post-card-excerpt">${post.excerpt || ''}</p>
          <div class="post-meta post-card-meta">
            <span>${this._estimateReadTime(post.excerpt)} min read</span>
            <span class="dot">•</span>
            <span>${this._formatDate(post.publishedDate)}</span>
          </div>
        </div>
      </article>
    `;
  }

  _renderCategorySection(group) {
    const { cfg, posts } = group;
    return `
      <section class="category-section" data-category="${cfg.slug}">
        <header class="category-section-header">
          <span class="category-icon" aria-hidden="true">${cfg.icon}</span>
          <div class="category-heading">
            <h2 class="category-name">${cfg.label}</h2>
            <p class="category-descriptor">${cfg.descriptor}</p>
          </div>
          <span class="category-rule" aria-hidden="true"></span>
        </header>
        <div class="post-grid">
          ${posts.slice(0, 6).map(p => this._renderPostCard(p)).join('')}
        </div>
        <div class="view-all-row">
          <a class="view-all" href="/blog/categories/${cfg.slug}">
            View all ${cfg.label}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6"/>
            </svg>
          </a>
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
    const tabs = [ALL_TAB, ...CATEGORY_CONFIG];
    const allSorted = this._sortByDate(this._posts);
    const isAll = this._activeSlug === 'all';

    let bodyHtml = '';
    if (this._posts.length === 0) {
      bodyHtml = `<div class="loading"><div class="loading-spinner"></div></div>`;
    } else if (isAll) {
      const pinned = allSorted.find(p => p.slug === PINNED_FEATURED_SLUG);
      const featured = pinned || allSorted[0];
      const rest = allSorted.filter(p => p !== featured);
      const groups = this._groupByCategory(rest);
      bodyHtml = `
        ${this._renderFeaturedPost(featured)}
        ${groups.map(g => this._renderCategorySection(g)).join('')}
      `;
    } else {
      const filtered = this._getFilteredPosts();
      bodyHtml = this._renderFilteredGrid(filtered);
    }

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
          padding: 40px 0 20px;
        }
        .blog-header h1 {
          font-size: 32px;
          color: var(--dark);
        }
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
          position: sticky;
          top: 0;
          z-index: 5;
          background: var(--light);
          border-bottom: 1px solid var(--gray-200);
        }
        .category-tabs-inner {
          display: flex;
          gap: 8px;
          padding: 14px 0;
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

        /* BODY */
        .blog-body {
          padding: 40px 0 80px;
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
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          margin-bottom: 56px;
        }
        .featured-post:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(15, 23, 42, 0.08);
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
          align-self: flex-start;
          padding: 4px 10px;
          border-radius: 999px;
          background: var(--green-light);
          color: var(--green-dark);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
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
          border-radius: 14px;
          padding: 12px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .post-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
          border-color: var(--gray-300);
        }
        .post-card-image {
          flex: 0 0 110px;
          width: 110px;
          height: 110px;
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
          font-size: 15px;
          color: var(--dark);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .post-card-excerpt {
          font-size: 13px;
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

        /* VIEW ALL */
        .view-all-row {
          margin-top: 18px;
          display: flex;
          justify-content: flex-end;
        }
        .view-all {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 600;
          color: var(--green-dark);
          padding: 6px 0;
          transition: gap 0.2s ease, color 0.2s ease;
        }
        .view-all svg { width: 16px; height: 16px; }
        .view-all:hover {
          color: var(--dark);
          gap: 8px;
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
          .blog-header { padding: 56px 0 24px; }
          .blog-header h1 { font-size: 40px; }
          .blog-header .subtitle { font-size: 16px; }
          .category-tabs-inner { gap: 10px; padding: 16px 0; }
          .category-tab { padding: 9px 18px; font-size: 14px; }
          .blog-body { padding: 48px 0 96px; }

          .featured-post-content { padding: 32px; gap: 14px; }
          .featured-post-title { font-size: 26px; }

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
          .blog-header { padding: 72px 0 28px; }
          .blog-header h1 { font-size: 48px; }
          .blog-body { padding: 56px 0 120px; }

          .featured-post {
            flex-direction: row;
            align-items: stretch;
            margin-bottom: 72px;
          }
          .featured-post-image {
            flex: 0 0 55%;
            aspect-ratio: auto;
            min-height: 380px;
          }
          .featured-post-content {
            flex: 0 0 45%;
            padding: 48px;
            justify-content: center;
          }
          .featured-post-title { font-size: 30px; }

          .category-rule { display: block; }
          .category-section { margin-bottom: 72px; }

          .post-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 26px;
          }
        }

        /* FINAL CTA */
        .final-cta {
          padding: 48px 0 72px;
          background: var(--light);
        }
        .final-cta-inner {
          background: linear-gradient(135deg, var(--green), var(--green-dark));
          border-radius: 24px;
          padding: 36px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .final-cta-inner::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        .final-cta-content {
          position: relative;
          z-index: 1;
        }
        .final-cta h2 {
          font-size: 28px;
          color: white;
          margin-bottom: 12px;
        }
        .final-cta-content > p {
          color: rgba(255, 255, 255, 0.88);
          margin-bottom: 20px;
          font-size: 16px;
        }
        .cta-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-primary,
        .cta-android {
          background: white;
          color: var(--green-dark);
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: none;
          cursor: pointer;
          font-family: inherit;
          -webkit-tap-highlight-color: transparent;
        }
        .cta-primary:hover,
        .cta-android:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        .cta-primary:active,
        .cta-primary:focus,
        .cta-android:active,
        .cta-android:focus {
          outline: none;
          transform: translateY(0);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }
        .cta-primary svg,
        .cta-android svg {
          width: 18px;
          height: 18px;
        }
        .risk-reversal {
          margin-top: 16px;
          color: rgba(255, 255, 255, 0.75);
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          font-size: 13px;
        }
        .risk-reversal span {
          display: inline-flex;
          align-items: center;
        }

        @media (max-width: 480px) {
          .cta-buttons { flex-direction: column; align-items: center; }
          .cta-buttons .cta-primary,
          .cta-buttons .cta-android {
            width: 100%;
            max-width: 280px;
          }
        }

        @media (min-width: 768px) {
          .final-cta { padding: 64px 0 96px; }
          .final-cta-inner { padding: 48px 40px; }
          .final-cta h2 { font-size: 36px; }
          .final-cta-content > p { font-size: 17px; }
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
          <h1>The Kygo Blog</h1>
          <p class="subtitle">Research-backed articles on sleep, HRV, nutrition, and the wearables that measure it all.</p>
        </div>
      </header>

      <nav class="category-tabs" aria-label="Blog categories">
        <div class="container">
          <div class="category-tabs-inner" role="tablist">
            ${tabs.map(t => `
              <button
                class="category-tab ${t.slug === this._activeSlug ? 'active' : ''}"
                data-slug="${t.slug}"
                role="tab"
                aria-selected="${t.slug === this._activeSlug ? 'true' : 'false'}">
                ${t.label}
              </button>
            `).join('')}
          </div>
        </div>
      </nav>

      <main class="blog-body">
        <div class="container">
          ${bodyHtml}
        </div>
      </main>

      <section class="final-cta">
        <div class="container">
          <div class="final-cta-inner animate-in">
            <div class="final-cta-content">
              <h2>Ready to understand your body?</h2>
              <p>Stop guessing. Start discovering what actually works for you.</p>
              <div class="cta-buttons">
                <a href="${IOS_URL}" class="cta-primary" data-track-position="blog-footer-cta" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </a>
                <a href="${ANDROID_URL}" target="_blank" rel="noopener" class="cta-android" data-action="android-download" data-track-position="blog-footer-cta">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.523 2.246a.75.75 0 0 0-1.046 0l-1.817 1.818a8.212 8.212 0 0 0-5.32 0L7.523 2.246a.75.75 0 1 0-1.046 1.078L8.088 4.92A8.25 8.25 0 0 0 3.75 12v.75a8.25 8.25 0 0 0 16.5 0V12a8.25 8.25 0 0 0-4.338-7.08l1.611-1.596a.75.75 0 0 0 0-1.078zM9 10.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm6 0a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>
                  Download for Android
                </a>
              </div>
              <p class="risk-reversal"><span>Free forever plan</span><span>•</span><span>No credit card required</span><span>•</span><span>Cancel anytime</span></p>
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

    this.shadowRoot.querySelectorAll('.featured-post, .post-card').forEach(card => {
      card.addEventListener('click', () => this._handlePostClick(card.dataset.slug));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this._handlePostClick(card.dataset.slug);
        }
      });
    });
  }

  _setupScrollAnimations() {
    requestAnimationFrame(() => {
      const targets = this.shadowRoot.querySelectorAll('.featured-post, .post-card, .category-section-header');
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
