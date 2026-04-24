/**
 * Kygo Health - Blog Post Template (Wix Custom Elements)
 *
 * This bundle frames Wix's native Blog Post widget with Kygo-branded sections:
 *   <kygo-blog-post-categories>  → category pill bar (above the post)
 *   <kygo-blog-post-related>     → related / recent posts grid (below the post)
 *   <kygo-blog-subscribe>        → inline-styled subscribe form
 *   <kygo-blog-post-cta>         → big dark app-download CTA (blog-specific copy)
 *   <kygo-blog-post-inline-cta>  → optional dark mid-article app CTA
 *
 * The Wix Blog Post widget itself renders the article body (title, meta, content,
 * tags, share, views) — we don't touch that. Header + footer are already sitewide.
 *
 * In the Wix page editor:
 *   1. Add a Custom Element widget for each tag above, between/around the Post widget.
 *   2. Point each Custom Element's "Server URL" at this file.
 *   3. Set the "Tag Name" to the element above.
 *   4. Wire up the Velo page code at the bottom of this file to feed the
 *      categories + related posts from the Wix Blog collection.
 *
 * Mobile-first, accessible, no dependencies.
 */

(function () {
  'use strict';

  // ──────────────────────────────────────────────────────────────────────
  // Shared constants
  // ──────────────────────────────────────────────────────────────────────
  const BRAND_LOGO = 'https://static.wixstatic.com/media/273a63_7ac49e91323749f49cadfe795ff3680f~mv2.png';
  const APP_IOS    = 'https://apps.apple.com/us/app/kygo-nutrition-wearables/id6749870589';
  const APP_ANDROID = 'https://play.google.com/store/apps/details?id=app.kygo';
  const WEARABLE_BADGES = [
    { name: 'Oura Ring',     src: 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png' },
    { name: 'Apple Health',  src: 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png' },
    { name: 'Fitbit',        src: 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png' },
    { name: 'Garmin',        src: 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png' },
    { name: 'Whoop',         src: 'https://static.wixstatic.com/media/273a63_0c0e48cc065d4ee3bf506f6d47440518~mv2.png' },
    { name: 'Health Connect',src: 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png' }
  ];

  const CORE_TOKENS = `
    --dark: #1E293B;
    --dark-card: #0F172A;
    --light: #F8FAFC;
    --green: #22C55E;
    --green-dark: #16A34A;
    --green-light: rgba(34, 197, 94, 0.10);
    --green-glow: rgba(34, 197, 94, 0.30);
    --green-border: rgba(34, 197, 94, 0.30);
    --gray-50: #F9FAFB;
    --gray-100: #F1F5F9;
    --gray-200: #E2E8F0;
    --gray-400: #94A3B8;
    --gray-600: #475569;
    --gray-700: #334155;
  `;

  const BASE_RESET = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; min-width: 0; }
    :host {
      display: block;
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: var(--dark);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    h1, h2, h3, h4 {
      font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 600; line-height: 1.15; letter-spacing: -0.01em;
    }
    button { font-family: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; display: block; }
  `;

  // Tiny SEO helper — mirrors pattern used across kygo-*.js
  function seoText(host, text) {
    if (host.querySelector('[data-seo]')) return;
    const d = document.createElement('div');
    d.setAttribute('data-seo', '');
    d.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
    d.textContent = text;
    host.appendChild(d);
  }

  const ICONS = {
    chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    eye:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    mail:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    check:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    checkCircle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>',
    apple:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>',
    playstore:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186c-.324-.227-.609-.664-.609-1.186V3c0-.522.285-.96.609-1.186zm10.89 10.186l2.733-2.733 3.061 1.777c.943.548.943 1.912 0 2.46l-3.061 1.777L14.5 12zM5.864 1.5l9.414 5.464L12.5 9.742 5.864 1.5zm0 21L12.5 14.258l2.778 2.778-9.414 5.464z"/></svg>',
    facebook:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>',
    twitter:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    linkedin:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.339 18.338V9.75H5.666v8.588h2.673zm-1.337-9.75a1.548 1.548 0 1 0 0-3.096 1.548 1.548 0 0 0 0 3.096zm11.336 9.75v-4.7c0-2.474-1.338-3.625-3.124-3.625-1.44 0-2.086.792-2.449 1.349V9.75H9.75c.036.753 0 8.588 0 8.588h2.674v-4.797c0-.24.017-.48.088-.653.194-.48.633-.976 1.371-.976.968 0 1.355.738 1.355 1.82v4.606h2.674z"/></svg>',
    link:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
  };

  const svg = (name, size) => {
    const s = size ? ` style="width:${size}px;height:${size}px"` : '';
    return (ICONS[name] || '').replace('<svg ', `<svg${s} `);
  };

  // ══════════════════════════════════════════════════════════════════════
  // 1. <kygo-blog-post-categories>
  // ──────────────────────────────────────────────────────────────────────
  // Horizontal scroll pill bar for topic filtering. Sits above the Wix
  // Blog Post widget. Clicking a pill dispatches `categoryClick` with
  // { label, slug } — Wix page code routes to /blog?category=slug.
  //
  // Attributes:
  //   categories – JSON array of { label, slug, active? }
  //   active     – slug of currently-active category (optional)
  // ══════════════════════════════════════════════════════════════════════
  class KygoBlogPostCategories extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._cats = [];
      this._active = 'all';
    }

    static get observedAttributes() { return ['categories', 'active']; }

    connectedCallback() {
      this._parse();
      this.render();
      seoText(this, 'Kygo Health Blog categories — filter articles by topic: nutrition, sleep, HRV, wearables, recovery, health tech.');
    }

    attributeChangedCallback(name, oldV, newV) {
      if (oldV === newV) return;
      this._parse();
      this.render();
    }

    _parse() {
      try {
        const raw = this.getAttribute('categories');
        const parsed = raw ? JSON.parse(raw) : null;
        this._cats = Array.isArray(parsed) && parsed.length
          ? parsed
          : [
              { label: 'All Posts',          slug: 'all' },
              { label: 'Nutrition Insights', slug: 'nutrition-insights' },
              { label: 'Health Tech',        slug: 'health-tech' },
              { label: 'Wearables & Data',   slug: 'wearables-data' },
              { label: 'HRV & Recovery',     slug: 'hrv-recovery' },
              { label: 'Sleep',              slug: 'sleep' }
            ];
      } catch (e) {
        this._cats = [{ label: 'All Posts', slug: 'all' }];
      }
      this._active = this.getAttribute('active') || this._active;
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          ${BASE_RESET}
          :host { ${CORE_TOKENS} background: #fff; border-bottom: 1px solid var(--gray-200); }
          .bar { width: 100%; max-width: 1200px; margin: 0 auto; padding: 12px 16px; }
          .scroll {
            display: flex; gap: 8px;
            overflow-x: auto; overflow-y: hidden;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            padding: 2px 0;
          }
          .scroll::-webkit-scrollbar { display: none; }
          .pill {
            flex: 0 0 auto;
            padding: 8px 14px;
            border-radius: 9999px;
            font-size: 13px; font-weight: 600;
            color: var(--gray-600);
            background: #fff;
            border: 1.5px solid var(--gray-200);
            white-space: nowrap;
            transition: all 160ms ease;
          }
          .pill:hover { border-color: var(--gray-400); color: var(--dark); }
          .pill.active {
            background: var(--green);
            color: #fff;
            border-color: var(--green);
          }
          @media (min-width: 768px) {
            .bar { padding: 14px 24px; }
            .pill { padding: 9px 16px; font-size: 14px; }
          }
        </style>
        <nav class="bar" aria-label="Blog categories">
          <div class="scroll">
            ${this._cats.map(c => `
              <button class="pill ${c.slug === this._active ? 'active' : ''}"
                      data-slug="${c.slug}" data-label="${c.label}">
                ${c.label}
              </button>
            `).join('')}
          </div>
        </nav>
      `;
      this.shadowRoot.querySelectorAll('.pill').forEach(btn => {
        btn.addEventListener('click', () => {
          this._active = btn.dataset.slug;
          this.render();
          this.dispatchEvent(new CustomEvent('categoryClick', {
            bubbles: true, composed: true,
            detail: { slug: btn.dataset.slug, label: btn.dataset.label }
          }));
        });
      });
    }
  }

  if (!customElements.get('kygo-blog-post-categories')) {
    customElements.define('kygo-blog-post-categories', KygoBlogPostCategories);
  }

  // ══════════════════════════════════════════════════════════════════════
  // 2. <kygo-blog-post-related>
  // ──────────────────────────────────────────────────────────────────────
  // 3-up (1-up mobile) card grid of related / recent posts. Sits below
  // the Wix Blog Post widget. Wix page code feeds `posts` JSON.
  //
  // Attributes:
  //   posts      – JSON array of { title, excerpt, slug, coverImage,
  //                  category, publishedDate, readTime, views }
  //   heading    – section heading (default: "Recent Posts")
  //   subheading – under heading (default: "More research-backed deep dives")
  // ══════════════════════════════════════════════════════════════════════
  class KygoBlogPostRelated extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._posts = [];
    }

    static get observedAttributes() { return ['posts', 'heading', 'subheading']; }

    connectedCallback() {
      this._parse();
      this.render();
      seoText(this, 'Related Kygo Health articles — evidence-first guides on nutrition, sleep, HRV, and wearable accuracy.');
    }

    attributeChangedCallback(name, oldV, newV) {
      if (oldV === newV) return;
      this._parse();
      this.render();
    }

    _parse() {
      try {
        const raw = this.getAttribute('posts');
        this._posts = raw ? JSON.parse(raw) : [];
      } catch (e) { this._posts = []; }
      // Cap at 3 for grid layout
      this._posts = this._posts.slice(0, 3);
    }

    _formatDate(d) {
      if (!d) return '';
      const dt = new Date(d);
      if (isNaN(dt)) return '';
      return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    _thumb(post) {
      if (post.coverImage) {
        return `<img src="${post.coverImage}" alt="${(post.title || '').replace(/"/g, '&quot;')}" loading="lazy" />`;
      }
      // Fallback: emoji + gradient by category
      const emoji = post.emoji || '📊';
      return `<span class="emoji">${emoji}</span>`;
    }

    render() {
      const heading = this.getAttribute('heading') || 'Recent Posts';
      const sub     = this.getAttribute('subheading') || 'More research-backed deep dives';

      this.shadowRoot.innerHTML = `
        <style>
          ${BASE_RESET}
          :host { ${CORE_TOKENS} background: #fff; display: block; }
          .wrap { max-width: 1200px; margin: 0 auto; padding: 48px 20px 56px; }
          @media (min-width: 768px) { .wrap { padding: 64px 24px 72px; } }

          .head {
            display: flex; align-items: flex-end; justify-content: space-between;
            gap: 16px; margin-bottom: 24px;
          }
          .head h2 {
            font-size: clamp(22px, 4vw, 28px);
            color: var(--dark); margin: 0 0 4px;
          }
          .head .sub { font-size: 14px; color: var(--gray-600); }
          .see-all {
            display: inline-flex; align-items: center; gap: 6px;
            font-size: 14px; font-weight: 600;
            color: var(--green-dark);
            white-space: nowrap;
          }
          .see-all:hover { color: var(--green); }
          .see-all svg { width: 14px; height: 14px; }

          .grid {
            display: grid; grid-template-columns: 1fr; gap: 16px;
          }
          @media (min-width: 640px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 18px; } }
          @media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } }

          .card {
            display: flex; flex-direction: column;
            background: #fff;
            border: 1.5px solid var(--gray-200);
            border-radius: 16px;
            overflow: hidden;
            text-align: left;
            transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
            cursor: pointer;
          }
          .card:hover {
            border-color: var(--green);
            transform: translateY(-3px);
            box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          }
          .thumb {
            aspect-ratio: 16 / 10;
            background: linear-gradient(135deg, #eef2f6, #e6edf3);
            display: flex; align-items: center; justify-content: center;
            overflow: hidden;
            position: relative;
          }
          .thumb img { width: 100%; height: 100%; object-fit: cover; }
          .thumb .emoji {
            font-size: 56px;
            filter: drop-shadow(0 6px 10px rgba(30,41,59,0.15));
          }
          .cat-badge {
            position: absolute; top: 12px; left: 12px;
            background: rgba(15,23,42,0.85);
            color: #fff;
            font-size: 11px; font-weight: 600;
            letter-spacing: 0.04em; text-transform: uppercase;
            padding: 5px 10px; border-radius: 999px;
            backdrop-filter: blur(4px);
          }
          .body { padding: 18px 18px 14px; display: flex; flex-direction: column; flex: 1; }
          .card h3 {
            font-size: 16px; line-height: 1.3;
            color: var(--dark); margin: 0 0 8px;
            transition: color 180ms ease;
          }
          .card:hover h3 { color: var(--green-dark); }
          @media (min-width: 768px) { .card h3 { font-size: 17px; } }
          .excerpt {
            font-size: 13.5px; line-height: 1.55;
            color: var(--gray-600); margin: 0 0 14px;
            flex: 1;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .meta {
            display: flex; align-items: center; justify-content: space-between;
            padding-top: 12px;
            border-top: 1px solid var(--gray-200);
            font-size: 12px; color: var(--gray-600);
          }
          .views { display: inline-flex; align-items: center; gap: 5px; }
          .views svg { width: 12px; height: 12px; }

          .empty {
            padding: 32px 16px;
            text-align: center;
            color: var(--gray-600);
            font-size: 14px;
          }
        </style>
        <section class="wrap" aria-labelledby="related-heading">
          <div class="head">
            <div>
              <h2 id="related-heading">${heading}</h2>
              <div class="sub">${sub}</div>
            </div>
            <a href="/blog" class="see-all" data-seeall>
              See All ${svg('arrowRight', 14)}
            </a>
          </div>
          ${this._posts.length ? `
            <div class="grid">
              ${this._posts.map(p => `
                <article class="card" data-slug="${p.slug || ''}">
                  <div class="thumb">
                    ${this._thumb(p)}
                    ${p.category ? `<span class="cat-badge">${p.category}</span>` : ''}
                  </div>
                  <div class="body">
                    <h3>${p.title || 'Untitled'}</h3>
                    <p class="excerpt">${p.excerpt || ''}</p>
                    <div class="meta">
                      <span class="views">
                        ${p.views ? `${svg('eye', 12)} ${p.views}` : (this._formatDate(p.publishedDate) || '')}
                      </span>
                      <span>${p.readTime ? `${p.readTime} min read` : ''}</span>
                    </div>
                  </div>
                </article>
              `).join('')}
            </div>
          ` : `
            <div class="empty">No related posts yet — check back soon.</div>
          `}
        </section>
      `;

      this.shadowRoot.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
          const slug = card.dataset.slug;
          if (!slug) return;
          this.dispatchEvent(new CustomEvent('postClick', {
            bubbles: true, composed: true, detail: { slug }
          }));
        });
      });

      const seeAll = this.shadowRoot.querySelector('[data-seeall]');
      if (seeAll) {
        seeAll.addEventListener('click', (e) => {
          e.preventDefault();
          this.dispatchEvent(new CustomEvent('seeAllClick', { bubbles: true, composed: true }));
        });
      }
    }
  }

  if (!customElements.get('kygo-blog-post-related')) {
    customElements.define('kygo-blog-post-related', KygoBlogPostRelated);
  }

  // ══════════════════════════════════════════════════════════════════════
  // 3. <kygo-blog-subscribe>
  // ──────────────────────────────────────────────────────────────────────
  // Newsletter signup. Sits between related posts and big app CTA, on a
  // grey band so it breaks from the white sections above/below. Dispatches
  // a `subscribe` event with { email }. Wix page code wires that up to
  // the Blog Subscribers collection via wix-data.
  //
  // Attributes:
  //   heading       – default "Stop Guessing. Start Knowing."
  //   subheading    – default subhead copy
  //   success-message – text shown after submit (default set below)
  //   state         – "success" to pre-render the success view (e.g. after
  //                    Wix confirms the insert)
  // ══════════════════════════════════════════════════════════════════════
  class KygoBlogSubscribe extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._state = 'idle';
      this._error = '';
    }

    static get observedAttributes() { return ['heading', 'subheading', 'success-message', 'state']; }

    connectedCallback() {
      this._state = this.getAttribute('state') || 'idle';
      this.render();
      seoText(this, 'Subscribe to Kygo Health research digest — weekly evidence-first guides on sleep, HRV, nutrition, and wearable accuracy.');
    }

    attributeChangedCallback(name, oldV, newV) {
      if (oldV === newV) return;
      if (name === 'state' && newV) this._state = newV;
      this.render();
    }

    render() {
      const heading = this.getAttribute('heading') || 'Stop Guessing. <span class="hl">Start Knowing.</span>';
      const sub     = this.getAttribute('subheading') ||
        'Evidence-first guides on sleep, HRV, nutrition, and the wearables that track them — delivered when we publish, never more.';
      const successMsg = this.getAttribute('success-message') ||
        "You're in. Next issue lands in your inbox.";

      this.shadowRoot.innerHTML = `
        <style>
          ${BASE_RESET}
          :host { ${CORE_TOKENS} background: var(--light); display: block; }
          .wrap {
            max-width: 720px; margin: 0 auto;
            padding: 56px 20px;
            text-align: center;
          }
          @media (min-width: 768px) { .wrap { padding: 72px 24px; } }

          .kicker {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 6px 14px;
            background: var(--green-light);
            color: var(--green-dark);
            font-size: 11.5px; font-weight: 600;
            letter-spacing: 0.06em; text-transform: uppercase;
            border-radius: 9999px;
            margin-bottom: 16px;
          }
          .kicker svg { width: 14px; height: 14px; }

          h2 {
            font-size: clamp(24px, 5vw, 34px);
            color: var(--dark);
            line-height: 1.2;
            margin: 0 0 12px;
          }
          h2 .hl { color: var(--green); }

          .lead {
            font-size: 15px; line-height: 1.6;
            color: var(--gray-600);
            max-width: 500px; margin: 0 auto 24px;
          }
          @media (min-width: 768px) { .lead { font-size: 16px; } }

          form {
            display: flex; flex-direction: column; gap: 10px;
            max-width: 520px; margin: 0 auto;
            background: #fff;
            padding: 10px;
            border-radius: 14px;
            border: 1.5px solid var(--gray-200);
            box-shadow: 0 4px 12px rgba(0,0,0,0.04);
            transition: border-color 200ms ease, box-shadow 200ms ease;
          }
          form:focus-within {
            border-color: var(--green);
            box-shadow: 0 0 0 4px var(--green-light);
          }
          input {
            flex: 1; min-width: 0;
            border: 0; outline: none;
            background: transparent;
            padding: 14px;
            font-family: inherit; font-size: 15px;
            color: var(--dark);
          }
          input::placeholder { color: var(--gray-400); }
          button {
            border: 0;
            height: 48px;
            padding: 0 22px;
            border-radius: 10px;
            background: var(--green);
            color: #fff;
            font-weight: 600; font-size: 15px;
            display: inline-flex; align-items: center; justify-content: center; gap: 6px;
            transition: background 180ms ease, box-shadow 180ms ease, transform 180ms ease;
            white-space: nowrap;
          }
          button:hover { background: var(--green-dark); box-shadow: 0 8px 20px rgba(34,197,94,0.3); }
          button:active { transform: translateY(1px); }
          button[disabled] { opacity: 0.6; cursor: not-allowed; }
          button svg { width: 14px; height: 14px; }

          @media (min-width: 520px) {
            form { flex-direction: row; gap: 6px; padding: 6px; }
            input { padding: 12px 14px; }
          }

          .trust {
            display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
            margin-top: 18px;
            font-size: 12px; color: var(--gray-600);
          }
          .trust span { display: inline-flex; align-items: center; gap: 6px; }
          .trust svg { width: 12px; height: 12px; color: var(--green); }

          .error {
            margin-top: 10px;
            font-size: 13px; color: #DC2626;
          }

          .success {
            max-width: 520px; margin: 0 auto;
            padding: 22px 24px;
            background: #fff;
            border: 2px solid var(--green);
            border-radius: 14px;
            color: var(--dark);
            font-weight: 500;
            display: flex; flex-direction: column; align-items: center; gap: 10px;
          }
          .success svg { width: 32px; height: 32px; color: var(--green); }
          .success .title { font-size: 16px; font-weight: 600; }
        </style>
        <section class="wrap" aria-labelledby="subscribe-heading">
          <div class="kicker">${svg('mail', 14)} Weekly research digest</div>
          <h2 id="subscribe-heading">${heading}</h2>
          <p class="lead">${sub}</p>

          ${this._state === 'success' ? `
            <div class="success" role="status" aria-live="polite">
              ${svg('checkCircle', 32)}
              <div class="title">${successMsg}</div>
            </div>
          ` : `
            <form novalidate data-form>
              <input type="email" required placeholder="you@email.com"
                     aria-label="Email address" autocomplete="email"
                     ${this._state === 'loading' ? 'disabled' : ''} />
              <button type="submit" ${this._state === 'loading' ? 'disabled' : ''}>
                ${this._state === 'loading' ? 'Subscribing…' : `Subscribe ${svg('arrowRight', 14)}`}
              </button>
            </form>
            ${this._error ? `<div class="error">${this._error}</div>` : ''}
            <div class="trust">
              <span>${svg('check', 12)} No spam</span>
              <span>${svg('check', 12)} Unsubscribe anytime</span>
              <span>${svg('check', 12)} Research-backed only</span>
            </div>
          `}
        </section>
      `;

      const form = this.shadowRoot.querySelector('[data-form]');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = form.querySelector('input').value.trim();
          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this._error = 'Please enter a valid email.';
            this.render();
            return;
          }
          this._error = '';
          this._state = 'loading';
          this.render();
          this.dispatchEvent(new CustomEvent('subscribe', {
            bubbles: true, composed: true,
            detail: {
              email,
              onSuccess: () => { this._state = 'success'; this.render(); },
              onError:   (msg) => {
                this._state = 'idle';
                this._error = msg || 'Something went wrong. Please try again.';
                this.render();
              }
            }
          }));
          // Fallback: if no one handles the event within 2s, show success
          setTimeout(() => {
            if (this._state === 'loading') { this._state = 'success'; this.render(); }
          }, 2000);
        });
      }
    }
  }

  if (!customElements.get('kygo-blog-subscribe')) {
    customElements.define('kygo-blog-subscribe', KygoBlogSubscribe);
  }

  // ══════════════════════════════════════════════════════════════════════
  // 4. <kygo-blog-post-cta>
  // ──────────────────────────────────────────────────────────────────────
  // Big dark app-download CTA. Mirrors the Tools page "promo" design 1:1
  // (same visuals, spacing, buttons, wearable badges) so the site stays
  // consistent. Only the copy differs — blog-focused rather than tool-focused.
  //
  // Attributes:
  //   heading    – override default headline (HTML allowed, use <span class="hl">
  //                  for green highlight)
  //   subheading – override default body copy
  //   ios-url    – App Store URL
  //   android-url – Play Store URL
  //   pill-text  – platform pill text (default "iOS & Android")
  // ══════════════════════════════════════════════════════════════════════
  class KygoBlogPostCta extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }

    connectedCallback() {
      this.render();
      seoText(this, 'Download Kygo Health — evidence-first nutrition tracking connected to every wearable. Available free on iOS and Android. Works with Oura, Apple Health, Fitbit, Garmin, Whoop, and Health Connect.');
    }

    render() {
      const heading = this.getAttribute('heading') ||
        'Read the research.<br/><span class="hl">Live the results.</span>';
      const sub = this.getAttribute('subheading') ||
        'Articles show you what the science says. Kygo shows you what your body says. Connect your wearable, log your meals, and see the personal correlations hiding in your own data.';
      const iosUrl     = this.getAttribute('ios-url')     || APP_IOS;
      const androidUrl = this.getAttribute('android-url') || APP_ANDROID;
      const pill       = this.getAttribute('pill-text')   || 'iOS & Android';

      this.shadowRoot.innerHTML = `
        <style>
          ${BASE_RESET}
          :host { ${CORE_TOKENS} background: #fff; display: block; }
          .wrap { max-width: 1100px; margin: 0 auto; padding: 48px 20px; }
          @media (min-width: 768px) { .wrap { padding: 72px 24px; } }

          .promo {
            background: linear-gradient(180deg, #1E293B 0%, #0F172A 100%);
            border-radius: 24px;
            padding: 40px 24px;
            color: #fff;
            position: relative;
            overflow: hidden;
            box-shadow: 0 12px 32px rgba(15,23,42,0.25);
          }
          @media (min-width: 768px) { .promo { padding: 56px 40px; } }

          .promo::before {
            content: '';
            position: absolute; top: -60px; right: -60px;
            width: 220px; height: 220px; border-radius: 50%;
            background: radial-gradient(circle, rgba(34,197,94,0.28) 0%, transparent 65%);
            pointer-events: none;
          }
          .inner { position: relative; text-align: center; }

          .platform-pill {
            display: inline-flex; align-items: center; gap: 6px;
            background: rgba(34,197,94,0.15);
            color: var(--green);
            border: 1px solid rgba(34,197,94,0.3);
            padding: 5px 12px; border-radius: 9999px;
            font-size: 12px; font-weight: 600;
            margin-bottom: 18px;
          }
          .platform-pill .d {
            width: 6px; height: 6px; border-radius: 9999px;
            background: var(--green); display: inline-block;
          }

          h2 {
            font-size: 26px;
            color: #fff; margin: 0 0 12px; line-height: 1.15;
          }
          @media (min-width: 768px) { h2 { font-size: 34px; } }
          h2 .hl { color: var(--green); }

          p {
            font-size: 14px; line-height: 1.55;
            color: rgba(255,255,255,0.7);
            max-width: 420px; margin: 0 auto 22px;
          }
          @media (min-width: 768px) { p { font-size: 15px; max-width: 500px; } }

          .btns {
            display: flex; flex-direction: column; gap: 10px;
            max-width: 340px; margin: 0 auto 22px;
          }
          @media (min-width: 520px) {
            .btns { flex-direction: row; justify-content: center; max-width: none; }
            .btn { min-width: 220px; }
          }
          .btn {
            background: var(--green); color: #fff;
            border: none; border-radius: 12px;
            padding: 14px 16px;
            display: inline-flex; align-items: center; justify-content: center; gap: 8px;
            font-weight: 700; font-size: 15px;
            box-shadow: 0 8px 20px rgba(34,197,94,0.25);
            transition: background 180ms ease, transform 180ms ease;
          }
          .btn:hover { background: var(--green-dark); transform: translateY(-1px); }
          .btn svg { width: 18px; height: 18px; }

          .works {
            display: flex; align-items: center; justify-content: center;
            gap: 10px; flex-wrap: wrap;
          }
          .works-label {
            font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 500;
          }
          .dots { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
          .wd {
            width: 32px; height: 32px; border-radius: 8px;
            background: rgba(255,255,255,0.08);
            display: flex; align-items: center; justify-content: center;
            overflow: hidden; flex-shrink: 0;
            transition: background 150ms ease, transform 150ms ease;
          }
          .wd:hover { background: rgba(255,255,255,0.15); transform: scale(1.08); }
          .wd img { width: 20px; height: 20px; object-fit: contain; border-radius: 4px; opacity: 0.85; }
          .wd:hover img { opacity: 1; }
        </style>
        <section class="wrap" aria-labelledby="cta-heading">
          <div class="promo">
            <div class="inner">
              <div class="platform-pill"><span class="d"></span> ${pill}</div>
              <h2 id="cta-heading">${heading}</h2>
              <p>${sub}</p>
              <div class="btns">
                <a class="btn" href="${iosUrl}" target="_blank" rel="noopener">
                  ${svg('apple', 18)} Download for iOS
                </a>
                <a class="btn" href="${androidUrl}" target="_blank" rel="noopener">
                  ${svg('playstore', 18)} Download for Android
                </a>
              </div>
              <div class="works">
                <span class="works-label">Works with</span>
                <div class="dots">
                  ${WEARABLE_BADGES.map(w => `
                    <span class="wd" title="${w.name}">
                      <img src="${w.src}" alt="${w.name}" loading="lazy" />
                    </span>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    }
  }

  if (!customElements.get('kygo-blog-post-cta')) {
    customElements.define('kygo-blog-post-cta', KygoBlogPostCta);
  }

  // ══════════════════════════════════════════════════════════════════════
  // 5. <kygo-blog-post-inline-cta>
  // ──────────────────────────────────────────────────────────────────────
  // Optional smaller dark CTA designed to be dropped mid-article inside
  // the Wix Rich Content editor (via Wix's HTML iframe block). Narrower
  // and tighter than the big CTA. Copy skews product-forward ("Free
  // Forever Plan") since it sits inside the post.
  // ══════════════════════════════════════════════════════════════════════
  class KygoBlogPostInlineCta extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }

    connectedCallback() { this.render(); }

    render() {
      const heading = this.getAttribute('heading') ||
        'See how your food affects your <span class="hl">sleep, energy, and recovery</span>';
      const sub = this.getAttribute('subheading') ||
        'Kygo connects your wearable data with AI-powered nutrition tracking—then surfaces the personal correlations between what you eat and how you sleep, recover, and perform.';
      const pill       = this.getAttribute('pill-text')   || 'Free Forever Plan';
      const iosUrl     = this.getAttribute('ios-url')     || APP_IOS;
      const androidUrl = this.getAttribute('android-url') || APP_ANDROID;

      this.shadowRoot.innerHTML = `
        <style>
          ${BASE_RESET}
          :host { ${CORE_TOKENS} display: block; margin: 24px 0; }
          .card {
            background: var(--dark);
            border-radius: 20px;
            padding: 28px 22px;
            color: #fff;
            position: relative;
            overflow: hidden;
          }
          @media (min-width: 640px) { .card { padding: 32px 28px; } }
          .card::before {
            content: '';
            position: absolute; top: -80px; right: -80px;
            width: 240px; height: 240px;
            background: radial-gradient(circle, var(--green-glow), transparent 70%);
            pointer-events: none;
          }
          .pill {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 5px 12px;
            border: 1px solid var(--green-border);
            background: rgba(34,197,94,0.08);
            color: var(--green);
            font-size: 11.5px; font-weight: 600;
            border-radius: 9999px;
            margin-bottom: 14px;
          }
          .pill::before {
            content: ''; width: 6px; height: 6px;
            border-radius: 50%; background: var(--green);
          }
          h3 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 20px; font-weight: 600;
            color: #fff; line-height: 1.2;
            margin: 0 0 10px;
          }
          @media (min-width: 640px) { h3 { font-size: 22px; } }
          h3 .hl { color: var(--green); }
          p {
            font-size: 14px; line-height: 1.55;
            color: rgba(255,255,255,0.7);
            margin: 0 0 18px;
          }
          .btns { display: flex; flex-direction: column; gap: 10px; }
          @media (min-width: 520px) { .btns { flex-direction: row; } }
          .btn {
            display: inline-flex; align-items: center; justify-content: center;
            gap: 8px;
            height: 46px; padding: 0 18px;
            border-radius: 12px;
            font-weight: 600; font-size: 14.5px;
            transition: background 180ms, transform 180ms, box-shadow 180ms;
            border: 1.5px solid transparent;
            flex: 1;
          }
          .btn.ios { background: var(--green); color: #fff; }
          .btn.ios:hover { background: var(--green-dark); transform: translateY(-1px); box-shadow: 0 8px 20px rgba(34,197,94,0.3); }
          .btn.android { background: transparent; color: var(--green); border-color: var(--green); }
          .btn.android:hover { background: rgba(34,197,94,0.08); }
          .btn svg { width: 16px; height: 16px; }

          .trust {
            display: flex; flex-wrap: wrap; gap: 8px 14px;
            margin-top: 14px;
            font-size: 12px; color: rgba(255,255,255,0.55);
            justify-content: center;
          }
          .trust span { display: inline-flex; align-items: center; gap: 4px; }
          .trust svg { width: 11px; height: 11px; color: var(--green); }
        </style>
        <aside class="card" role="complementary" aria-label="Download the Kygo app">
          <span class="pill">${pill}</span>
          <h3>${heading}</h3>
          <p>${sub}</p>
          <div class="btns">
            <a class="btn ios" href="${iosUrl}" target="_blank" rel="noopener">
              ${svg('apple', 16)} Download for iOS
            </a>
            <a class="btn android" href="${androidUrl}" target="_blank" rel="noopener">
              ${svg('playstore', 16)} Download for Android
            </a>
          </div>
          <div class="trust">
            <span>${svg('check', 11)} 2-min setup</span>
            <span>${svg('check', 11)} Free forever plan</span>
            <span>${svg('check', 11)} No credit card</span>
          </div>
        </aside>
      `;
    }
  }

  if (!customElements.get('kygo-blog-post-inline-cta')) {
    customElements.define('kygo-blog-post-inline-cta', KygoBlogPostInlineCta);
  }

})();

/*
 * ============================================================
 *  WIX VELO PAGE CODE — Blog Post Template
 * ============================================================
 *
 * Drop this into the Page Code panel for your Blog Post page in Wix
 * (the page that uses the Wix Blog Post widget). It assumes you've
 * placed four Custom Element widgets on the page, with these IDs:
 *
 *   #kygoCats        → tag: kygo-blog-post-categories
 *   #kygoRelated     → tag: kygo-blog-post-related
 *   #kygoSubscribe   → tag: kygo-blog-subscribe
 *   #kygoCta         → tag: kygo-blog-post-cta    (optional — static,
 *                       no data wiring needed)
 *
 * The inline mid-article CTA (<kygo-blog-post-inline-cta>) is static
 * and doesn't need any page code.
 *
 * ------------------------------------------------------------
 *  import wixData from 'wix-data';
 *  import wixLocationFrontend from 'wix-location-frontend';
 *  import { currentPost } from 'wix-blog-frontend';
 *
 *  $w.onReady(async function () {
 *    // ------------------------------------------------------
 *    // 1. Category pill bar
 *    // ------------------------------------------------------
 *    try {
 *      const catRes = await wixData.query('Blog/Categories').find();
 *      const cats = [{ label: 'All Posts', slug: 'all' }].concat(
 *        catRes.items.map(c => ({ label: c.label || c.title, slug: c.slug }))
 *      );
 *      $w('#kygoCats').setAttribute('categories', JSON.stringify(cats));
 *    } catch (e) { console.warn('Categories load failed', e); }
 *
 *    $w('#kygoCats').on('categoryClick', (event) => {
 *      const { slug } = event.detail;
 *      if (slug === 'all') wixLocationFrontend.to('/blog');
 *      else wixLocationFrontend.to(`/blog/category/${slug}`);
 *    });
 *
 *    // ------------------------------------------------------
 *    // 2. Related / recent posts (3-up)
 *    //    Pulls latest 4, strips the one currently being viewed,
 *    //    keeps 3.
 *    // ------------------------------------------------------
 *    try {
 *      const post = await currentPost.getPost();           // current blog post
 *      const currentSlug = post && post.slug;
 *      const res = await wixData.query('Blog/Posts')
 *        .include('categories')
 *        .limit(4)
 *        .descending('firstPublishedDate')
 *        .find();
 *
 *      const posts = res.items
 *        .filter(p => p.slug !== currentSlug)
 *        .slice(0, 3)
 *        .map(p => {
 *          let img = '';
 *          if (p.coverImage) {
 *            img = typeof p.coverImage === 'string'
 *              ? p.coverImage
 *              : (p.coverImage.src || p.coverImage.url || '');
 *          }
 *          const cat = (p.categories && p.categories[0] &&
 *                       (p.categories[0].label || p.categories[0].name)) || '';
 *          const wordCount = (p.plainContent || p.excerpt || '').split(/\s+/).length;
 *          return {
 *            title: p.title,
 *            slug: p.slug,
 *            excerpt: p.excerpt || '',
 *            coverImage: img,
 *            publishedDate: p.firstPublishedDate,
 *            category: cat,
 *            readTime: Math.max(1, Math.ceil(wordCount / 200)),
 *            views: p.viewCount || null
 *          };
 *        });
 *      $w('#kygoRelated').setAttribute('posts', JSON.stringify(posts));
 *    } catch (e) { console.warn('Related posts load failed', e); }
 *
 *    $w('#kygoRelated').on('postClick', (event) => {
 *      wixLocationFrontend.to(`/post/${event.detail.slug}`);
 *    });
 *    $w('#kygoRelated').on('seeAllClick', () => {
 *      wixLocationFrontend.to('/blog');
 *    });
 *
 *    // ------------------------------------------------------
 *    // 3. Subscribe form → Blog/Subscribers collection
 *    //    (Blog/Subscribers isn't a default Wix collection; create
 *    //     one with at least an `email` field, or switch to your
 *    //     email-platform of choice via fetch.)
 *    // ------------------------------------------------------
 *    $w('#kygoSubscribe').on('subscribe', async (event) => {
 *      const { email, onSuccess, onError } = event.detail;
 *      try {
 *        await wixData.insert('Emails/Subscribers', {
 *          email,
 *          source: 'blog-post',
 *          subscribedAt: new Date()
 *        });
 *        onSuccess && onSuccess();
 *      } catch (err) {
 *        console.error('Subscribe failed', err);
 *        onError && onError('Could not subscribe. Please try again.');
 *      }
 *    });
 *  });
 *
 * ============================================================
 *  PLACEMENT INSIDE THE WIX BLOG POST PAGE (top to bottom)
 * ============================================================
 *   1. Sitewide HEADER (already on every page)
 *   2. <kygo-blog-post-categories>  — sticky-ish pill bar
 *   3. WIX BLOG POST WIDGET         — Wix renders the article here
 *        (title, meta, featured image, tags, share, views all come
 *         from Wix — we don't touch them)
 *      -- OPTIONAL: inside the post Rich Content, drop an HTML iframe
 *         block with <kygo-blog-post-inline-cta> for mid-article CTAs
 *   4. <kygo-blog-post-related>     — 3 recent posts on white
 *   5. <kygo-blog-subscribe>        — grey band, keeps rhythm
 *   6. <kygo-blog-post-cta>         — big dark app CTA on white
 *   7. Sitewide FOOTER
 *
 *  Section rhythm (alternating): white → white → grey → white → dark footer
 * ============================================================
 */

