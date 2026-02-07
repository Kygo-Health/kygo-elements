class KygoBlog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._posts = [];
    this._categories = ['All Posts'];
    this._activeCategory = 'All Posts';
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
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
      if (posts) {
        this._posts = JSON.parse(posts);
        this._extractCategories();
      }
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
        this._extractCategories();
        this.render();
      } catch (e) {
        console.error('Failed to parse posts:', e);
      }
    } else if (name === 'wixsettings') {
      this._parseWixAttributes();
      this.render();
    }
  }

  _extractCategories() {
    const cats = new Set(['All Posts']);
    this._posts.forEach(post => {
      if (post.category) cats.add(post.category);
    });
    this._categories = Array.from(cats);
  }

  _formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'TODAY';
    if (diffDays === 1) return 'YESTERDAY';
    if (diffDays < 7) return `${diffDays} DAYS AGO`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  }

  _estimateReadTime(content) {
    if (!content) return 5;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  _getFilteredPosts() {
    if (this._activeCategory === 'All Posts') return this._posts;
    return this._posts.filter(p => p.category === this._activeCategory);
  }

  _handleCategoryClick(category) {
    this._activeCategory = category;
    this.render();
  }

  _handlePostClick(slug) {
    this.dispatchEvent(new CustomEvent('postClick', { 
      detail: { slug },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const filteredPosts = this._getFilteredPosts();
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --dark: #1E293B;
          --light: #F8FAFC;
          --green: #22C55E;
          --green-dark: #16A34A;
          --green-light: rgba(34, 197, 94, 0.1);
          --gray-100: #F1F5F9;
          --gray-200: #E2E8F0;
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

        h1, h3 {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          line-height: 1.2;
        }

        .container { 
          max-width: 1000px; 
          margin: 0 auto; 
          padding: 0 24px; 
        }

        /* Category Tabs */
        .category-tabs {
          background: white;
          border-bottom: 1px solid var(--gray-200);
        }

        .category-tabs-inner {
          display: flex;
          gap: 12px;
          padding: 20px 0;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .category-tabs-inner::-webkit-scrollbar { display: none; }

        .category-tab {
          padding: 10px 20px;
          border-radius: 24px;
          font-size: 15px;
          font-weight: 500;
          color: var(--gray-600);
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          font-family: inherit;
        }

        .category-tab:hover {
          color: var(--dark);
          background: var(--gray-100);
        }

        .category-tab.active {
          background: var(--green-light);
          color: var(--green-dark);
          border-color: var(--green);
        }

        /* Blog Section */
        .blog-section { 
          padding: 48px 0 100px; 
        }

        .blog-header { 
          margin-bottom: 40px; 
        }

        .blog-header h1 {
          font-size: 32px;
          color: var(--dark);
        }

        /* Blog Posts List */
        .blog-posts {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .blog-card {
          display: flex;
          gap: 28px;
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.2s;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }

        .blog-card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        .blog-card-image {
          width: 160px;
          height: 160px;
          border-radius: 14px;
          background: var(--gray-100);
          flex-shrink: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .blog-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .blog-card-image svg {
          width: 70%;
          height: 70%;
        }

        .blog-card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
          padding: 4px 0;
        }

        .blog-card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--gray-500);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .blog-card-category {
          display: block;
          background: var(--green);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .blog-card-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--dark);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 10px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-card-excerpt {
          font-size: 14px;
          color: var(--gray-600);
          font-style: italic;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Empty/Loading States */
        .empty-state, .loading {
          text-align: center;
          padding: 80px 20px;
          color: var(--gray-500);
        }

        .empty-state h3 {
          margin-bottom: 8px;
          color: var(--dark);
        }

        .loading-spinner {
          width: 44px;
          height: 44px;
          border: 3px solid var(--gray-200);
          border-top-color: var(--green);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Tablet */
        @media (min-width: 768px) {
          .container { padding: 0 40px; }
          .blog-section { padding: 56px 0 120px; }
          .blog-header { margin-bottom: 48px; }
          .blog-header h1 { font-size: 36px; }
          .blog-posts { gap: 32px; }
          .blog-card { padding: 28px; gap: 32px; }
          .blog-card-image { width: 180px; height: 180px; }
          .blog-card-title { font-size: 20px; }
          .blog-card-excerpt { font-size: 15px; }
        }

        /* Mobile */
        @media (max-width: 600px) {
          .container { padding: 0 16px; }
          .category-tabs-inner { padding: 16px 0; gap: 8px; }
          .category-tab { padding: 8px 16px; font-size: 14px; }
          .blog-section { padding: 32px 0 60px; }
          .blog-header { margin-bottom: 24px; }
          .blog-header h1 { font-size: 26px; }
          .blog-posts { gap: 20px; }
          
          .blog-card {
            flex-direction: column;
            gap: 20px;
            padding: 20px;
          }

          .blog-card-image {
            width: 100%;
            height: 200px;
          }
          
          .blog-card-content { padding: 0; }
          .blog-card-meta { margin-bottom: 10px; }
          .blog-card-category { margin-bottom: 10px; }
          .blog-card-title { font-size: 16px; margin-bottom: 8px; }
          .blog-card-excerpt { font-size: 13px; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .blog-header {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        /* Category tabs stagger entrance */
        .category-tab {
          opacity: 0;
          animation: slideInDown 0.4s ease-out forwards;
        }
        .category-tab:nth-child(1) { animation-delay: 0.05s; }
        .category-tab:nth-child(2) { animation-delay: 0.1s; }
        .category-tab:nth-child(3) { animation-delay: 0.15s; }
        .category-tab:nth-child(4) { animation-delay: 0.2s; }
        .category-tab:nth-child(5) { animation-delay: 0.25s; }
        .category-tab:nth-child(6) { animation-delay: 0.3s; }
        .category-tab:nth-child(7) { animation-delay: 0.35s; }
        .category-tab:nth-child(8) { animation-delay: 0.4s; }

        /* Blog card - container animation */
        .blog-card {
          opacity: 0;
          transform: translateY(20px);
        }
        .blog-card.visible {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.2s, border-color 0.2s;
        }

        /* Blog card children - cascade within each card */
        .blog-card .blog-card-image,
        .blog-card .blog-card-meta,
        .blog-card .blog-card-category,
        .blog-card .blog-card-title,
        .blog-card .blog-card-excerpt {
          opacity: 0;
          transform: translateY(10px);
        }

        .blog-card.visible .blog-card-image {
          animation: fadeInUp 0.4s ease-out 0.1s forwards;
        }
        .blog-card.visible .blog-card-meta {
          animation: fadeInUp 0.4s ease-out 0.15s forwards;
        }
        .blog-card.visible .blog-card-category {
          animation: fadeInUp 0.4s ease-out 0.2s forwards;
        }
        .blog-card.visible .blog-card-title {
          animation: fadeInUp 0.4s ease-out 0.25s forwards;
        }
        .blog-card.visible .blog-card-excerpt {
          animation: fadeInUp 0.4s ease-out 0.3s forwards;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .category-tab {
            opacity: 1;
            animation: none;
          }
          .blog-card {
            opacity: 1;
            transform: none;
            transition: none;
          }
          .blog-card:hover { transform: none; }
          .blog-card .blog-card-image,
          .blog-card .blog-card-meta,
          .blog-card .blog-card-category,
          .blog-card .blog-card-title,
          .blog-card .blog-card-excerpt {
            opacity: 1;
            transform: none;
            animation: none;
          }
          .loading-spinner { animation: none; }
        }
      </style>

      <!-- Category Tabs -->
      <div class="category-tabs">
        <div class="container">
          <div class="category-tabs-inner">
            ${this._categories.map(cat => `
              <button class="category-tab ${cat === this._activeCategory ? 'active' : ''}" data-category="${cat}">
                ${cat}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Blog Content -->
      <section class="blog-section">
        <div class="container">
          <div class="blog-header">
            <h1>${this._activeCategory}</h1>
          </div>

          ${this._posts.length === 0 ? `
            <div class="loading">
              <div class="loading-spinner"></div>
            </div>
          ` : filteredPosts.length === 0 ? `
            <div class="empty-state">
              <h3>No posts found</h3>
              <p>No posts in this category yet.</p>
            </div>
          ` : `
            <div class="blog-posts">
              ${filteredPosts.map(post => `
                <div class="blog-card" data-slug="${post.slug || ''}">
                  <div class="blog-card-image">
                    ${post.coverImage ? `
                      <img src="${post.coverImage}" alt="${post.title || ''}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                      <svg viewBox="0 0 120 120" fill="none" style="display:none;">
                        <circle cx="60" cy="45" r="25" fill="#E2E8F0"/>
                        <circle cx="50" cy="42" r="4" fill="#22C55E"/>
                        <circle cx="70" cy="42" r="4" fill="#3B82F6"/>
                        <circle cx="60" cy="55" r="3" fill="#EF4444"/>
                        <path d="M45 75 Q60 90 75 75" stroke="#94A3B8" stroke-width="3" fill="none"/>
                      </svg>
                    ` : `
                      <svg viewBox="0 0 120 120" fill="none">
                        <circle cx="60" cy="45" r="25" fill="#E2E8F0"/>
                        <circle cx="50" cy="42" r="4" fill="#22C55E"/>
                        <circle cx="70" cy="42" r="4" fill="#3B82F6"/>
                        <circle cx="60" cy="55" r="3" fill="#EF4444"/>
                        <path d="M45 75 Q60 90 75 75" stroke="#94A3B8" stroke-width="3" fill="none"/>
                      </svg>
                    `}
                  </div>
                  <div class="blog-card-content">
                    <div class="blog-card-meta">
                      <span>${this._formatDate(post.publishedDate)}</span>
                      <span>•</span>
                      <span>${this._estimateReadTime(post.excerpt)} MIN READ</span>
                    </div>
                    <span class="blog-card-category">${post.category || 'General'}</span>
                    <h3 class="blog-card-title">${post.title || 'Untitled'}...</h3>
                    <p class="blog-card-excerpt">${post.excerpt || ''}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </section>
    `;

    // Event listeners
    this.shadowRoot.querySelectorAll('.category-tab').forEach(tab => {
      tab.addEventListener('click', () => this._handleCategoryClick(tab.dataset.category));
    });

    this.shadowRoot.querySelectorAll('.blog-card').forEach(card => {
      card.addEventListener('click', () => this._handlePostClick(card.dataset.slug));
    });

    this._setupScrollAnimations();
  }

  _setupScrollAnimations() {
    requestAnimationFrame(() => {
      const cards = this.shadowRoot.querySelectorAll('.blog-card');
      if (!cards.length) return;
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const index = Array.from(card.parentElement.children).indexOf(card);
            setTimeout(() => card.classList.add('visible'), index * 100);
            this._observer.unobserve(card);
          }
        });
      }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
      cards.forEach(card => this._observer.observe(card));
    });
  }
}

customElements.define('kygo-blog', KygoBlog);
