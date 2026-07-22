/**
 * Kygo Health - How It Works (single-embed page)
 * Tag name: kygo-hiw
 *
 * The whole "How It Works" page rendered by ONE Wix custom-element embed, so the
 * page needs only a single script URL to bump on each push. Everything lives in
 * one shadow root; the crawlable summary is copied into the LIGHT DOM via
 * __seo(), and the page's structured data (HowTo + FAQPage) is injected into
 * <head>, each guarded by a unique data-kygo-*-ld marker.
 *
 * Preserved from the previous version (do not drop on redesign):
 *  - Store CTAs use the Tenjin attribution links (iOS …/cD7zgIPLuiZMMWmWkXLsvy,
 *    Android …/eMjS3ZkseCvs2lO9AVESkO) with class cta-primary / cta-android,
 *    data-action="android-download", and data-track-position / data-track-label.
 *    kygo-tracking.js classifies these clicks across the shadow boundary.
 *  - __seo() light-DOM summary for SEO / LLM crawlers (GEO).
 *  - HowTo JSON-LD under the data-kygo-hiw-ld marker.
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

class KygoHiw extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._settings = {};
  }

  connectedCallback() {
    this._parseWixAttributes();
    this.render();
    this._setupFeatureReveal();
    __seo(this, 'How Kygo Health works. Kygo connects your wearables with nutrition tracking to reveal personalized correlations between what you eat and how your body performs — sleep, HRV, resting heart rate, energy, and recovery. Step 1: log your food in seconds with photo AI, chat, barcode, voice, search, or saved meals, or import nutrition automatically from Apple Health and Health Connect. Step 2: connect a wearable in a tap — Oura Ring, Garmin, Fitbit, Apple Health, or Health Connect — and Kygo pulls in sleep, HRV, resting heart rate, recovery, and activity on its own, picking the most accurate source for each metric. Step 3: after about seven days, Kygo grades every food and supplement against your metrics and shows what helps and what hurts, with evidence strength and same-day and next-day lag checks. Setup takes about two minutes. Free forever plan; correlations and Kygo Advisor are included with Pro at $9.99/month or $39.99/year (a 7-day free trial and 67% savings on the yearly plan). Your data is protected end to end: all traffic is encrypted with modern TLS, data is encrypted at rest with AES-256, accounts use bcrypt hashing and token-based authentication, every request is scoped so only you can reach your own data, and Kygo never sells your data. Wearable connections use official OAuth you can revoke anytime, and deleting your account permanently purges your data.');
    this._injectStructuredData();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  static get observedAttributes() { return ['wixsettings', 'wixconfig']; }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'wixsettings' || name === 'wixconfig') {
      this._parseWixAttributes();
      this.render();
      this._setupFeatureReveal();
    }
  }

  _parseWixAttributes() {
    try {
      const wixconfig = this.getAttribute('wixconfig');
      const wixsettings = this.getAttribute('wixsettings');
      if (wixconfig) this._config = JSON.parse(wixconfig);
      if (wixsettings) this._settings = JSON.parse(wixsettings);
    } catch (e) {
      console.warn('KygoHiw: Could not parse Wix attributes', e);
    }
  }

  _getSetting(key, fallback) {
    return this._settings[key] || this.getAttribute(key) || fallback;
  }

  /** Boolean flag that honors an explicit `false` from Wix settings or attribute. */
  _getFlag(key, fallback) {
    if (this._settings && Object.prototype.hasOwnProperty.call(this._settings, key)) {
      return String(this._settings[key]) !== 'false';
    }
    if (this.hasAttribute(key)) return this.getAttribute(key) !== 'false';
    return fallback;
  }

  // ── Data ──────────────────────────────────────────────────────────────

  _data() {
    return {
      iosLink: this._getSetting('ios-link', 'https://track.tenjin.com/v0/click/cD7zgIPLuiZMMWmWkXLsvy'),
      androidLink: this._getSetting('android-link', 'https://track.tenjin.com/v0/click/eMjS3ZkseCvs2lO9AVESkO'),
      logos: {
        oura: 'https://static.wixstatic.com/media/273a63_56ac2eb53faf43fab1903643b29c0bce~mv2.png',
        apple: 'https://static.wixstatic.com/media/273a63_1a1ba0e735ea4d4d865c04f7c9540e69~mv2.png',
        fitbit: 'https://static.wixstatic.com/media/273a63_c451e954ff8740338204915f904d8798~mv2.png',
        garmin: 'https://static.wixstatic.com/media/273a63_0a60d1d6c15b421e9f0eca5c4c9e592b~mv2.png',
        healthConnect: 'https://static.wixstatic.com/media/273a63_46b3b6ce5b4e4b0c9c1e0a681a79f9e7~mv2.png'
      },
      testimonials: [
        { quote: '"I’ve boosted my deep sleep after making changes to stop the age-related slow-wave decline."', name: 'Oura user' },
        { quote: '"I love the experiments and the insights, like seeing how fat impacts my sleep."', name: 'Kygo user' },
        { quote: '"I always get excited when I see your posts. The research is truly valued, and the app is amazing."', name: 'Oura user' },
        { quote: '"Insights into how different nutrients impact my sleep and resting heart rate keep me engaged."', name: 'App Store review' },
        { quote: '"Very interesting. I noticed not getting enough time in bed was the biggest impact for me. Once I fixed that, my stats improved."', name: 'Oura user' }
      ],
      features: [
        'Insights on which foods move your sleep, energy, and recovery',
        'Image logging: snap or upload and we identify the ingredients and log it',
        'Supplement tracking with reminders and insights',
        'Quick add: frequent, favorites, and saved meals for one-tap logging',
        'Write-back to Apple Health and Health Connect'
      ],
      faqs: [
        {
          q: 'Is my health data secure?',
          a: 'Yes, protected end to end. All traffic is encrypted with modern TLS and your data is encrypted at rest with AES-256, on accounts secured with bcrypt hashing and token-based authentication, with every request scoped so only you can reach your own data. We never sell your data. Your wearable connections use official OAuth you can revoke anytime, and deleting your account permanently purges your data. ',
          link: { href: 'https://www.kygo.app/privacy-policy', text: 'Read our privacy policy →' }
        },
        { q: 'What is Kygo?', a: 'Most apps show you a sleep or HRV score and stop there. Kygo, available on iPhone and Android, connects your wearable data to your food and supplements so you can see why your numbers move, not just what they are. Logging is effortless: snap a photo, use your voice, type it, or scan, with no manual database searching. Connect Garmin, Fitbit, Oura, Apple Health, and Health Connect to pull the most accurate metrics from each device.' },
        { q: 'How is Kygo different from MyFitnessPal?', a: 'MyFitnessPal tracks calories for weight loss. Kygo shows you how food affects your sleep, HRV, energy, and recovery by correlating your nutrition with your wearable data. It’s not about dieting, it’s about understanding your body’s unique responses.' },
        { q: 'Which devices do you support?', a: 'We integrate with Oura Ring, Garmin, Fitbit, Apple Health, and Health Connect. You can connect one device or multiple, we’ll combine the data to fill gaps and give you the most complete picture.' },
        { q: 'How long until I see correlations?', a: 'Basic trends show immediately. Meaningful correlations typically appear after about seven days of consistent logging. The more data you provide, the better and more accurate your insights become.' },
        { q: 'Is it really free?', a: 'Yes! Food logging, wearable sync, and trend tracking are free forever. The correlation engine is premium, $9.99/month or $39.99/year to unlock personalized insights.' }
      ],
      showTimeline: this._getFlag('show-timeline', true),
      showFreeVsPro: this._getFlag('show-free-vs-pro', true)
    };
  }

  // ── Reusable snippets ─────────────────────────────────────────────────

  _appleIcon() {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.5 1.8c0 1.2-.5 2.4-1.3 3.2-.9.9-2.3 1.6-3.5 1.5-.1-1.2.5-2.4 1.3-3.2.9-.9 2.4-1.5 3.5-1.5zM20.6 17c-.6 1.4-.9 2-1.7 3.2-1.1 1.7-2.6 3.8-4.5 3.8-1.7 0-2.1-1.1-4.4-1.1-2.3 0-2.8 1.1-4.4 1.1-1.9 0-3.4-1.9-4.5-3.6C-.5 16.9-.9 11 1.3 7.9 2.8 5.8 5 4.6 7.1 4.6c2.1 0 3.1 1.1 4.7 1.1 1.5 0 2.4-1.1 4.7-1.1 1.7 0 3.6 1 4.9 2.6-4.3 2.4-3.6 8.5.9 9.8z"/></svg>';
  }

  _androidIcon() {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 9.5l2-3.4c.1-.2 0-.5-.2-.6-.2-.1-.5 0-.6.2l-2 3.5C15.3 8.1 13.7 7.7 12 7.7s-3.3.4-4.8 1l-2-3.5c-.1-.2-.4-.3-.6-.2-.2.1-.3.4-.2.6l2 3.4C3 11.2 1.3 14 1 17.3h22c-.3-3.3-2-6.1-5.4-7.8zM7 14.8c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm10 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/></svg>';
  }

  /** iOS store CTA (Tenjin iOS link + tracking hooks). */
  _iosBtn(d, cls, position, label, text) {
    return `<a href="${d.iosLink}" class="${cls} cta-primary" data-track-position="${position}" data-track-label="${label}" target="_blank" rel="noopener">${this._appleIcon()}${text}</a>`;
  }

  /** Android store CTA (Tenjin Android link + tracking hooks). */
  _androidBtn(d, cls, position, label, text) {
    return `<a href="${d.androidLink}" class="${cls} cta-android" data-action="android-download" data-track-position="${position}" data-track-label="${label}" target="_blank" rel="noopener">${this._androidIcon()}${text}</a>`;
  }

  _stars() {
    const p = 'M12 2.5l2.6 5.7 6.2.6-4.7 4.2 1.4 6.1L12 19.9 6.5 19.1l1.4-6.1L3.2 8.8l6.2-.6z';
    let s = '';
    for (let i = 0; i < 5; i++) s += `<svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;"><path d="${p}"/></svg>`;
    return s;
  }

  // ── Render ────────────────────────────────────────────────────────────

  render() {
    const d = this._data();

    const ticker = [
      ['Caffeine after 3pm', 'HRV ↓ 8 ms', '#EF4444'],
      ['Dinner before 7pm', 'Deep sleep ↑ 23 min', '#22C55E'],
      ['High sodium day', 'Resting HR ↑ 4 bpm', '#EF4444'],
      ['Magnesium before bed', 'HRV ↑ 6 ms', '#22C55E'],
      ['Hit fiber target', 'Readiness ↑ 11 pts', '#22C55E']
    ];
    const tickerItems = [...ticker, ...ticker].map(t =>
      `<span style="display:inline-flex;align-items:center;gap:8px;white-space:nowrap;font-size:14px;color:#E2E8F0;font-weight:500;">${t[0]} <span style="color:${t[2]};font-family:'Space Grotesk',sans-serif;font-weight:700;">${t[1]}</span></span><span style="color:#334155;">•</span>`
    ).join('');

    const wearableTiles = [
      ['oura', 'Oura', 'cover'],
      ['garmin', 'Garmin', 'cover'],
      ['fitbit', 'Fitbit', 'cover'],
      ['apple', 'Apple Health', 'contain'],
      ['healthConnect', 'Health Connect', 'contain']
    ].map(([k, alt, fit]) =>
      `<span style="width:52px;height:52px;border-radius:14px;border:2px solid #E2E8F0;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#fff;${fit === 'contain' ? 'padding:8px;' : ''}"><img src="${d.logos[k]}" alt="${alt}" loading="lazy" style="width:100%;height:100%;object-fit:${fit};"></span>`
    ).join('');

    const features = d.features.map(f =>
      `<div class="hiwfeat" style="display:flex;align-items:flex-start;gap:10px;"><svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2.5" style="width:18px;height:18px;flex-shrink:0;margin-top:2px;"><path d="M20 6L9 17l-5-5"/></svg><span style="font-size:14.5px;color:#334155;font-weight:500;">${f}</span></div>`
    ).join('');

    const testimonials = [...d.testimonials, ...d.testimonials].map(t => {
      const initial = t.name.charAt(0);
      return `<figure style="flex:0 0 auto;width:clamp(300px,80vw,360px);margin-right:16px;background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:24px 22px;box-shadow:0 4px 16px rgba(15,23,42,.05);display:flex;flex-direction:column;gap:16px;">
        <blockquote style="border:0;display:flex;flex-direction:column;gap:12px;flex:1;margin:0;">
          <div style="display:flex;gap:3px;color:#22C55E;">${this._stars()}</div>
          <p style="color:#1E293B;font-size:15px;line-height:1.6;font-weight:500;">${t.quote}</p>
        </blockquote>
        <figcaption style="display:flex;align-items:center;gap:11px;padding-top:14px;border-top:1px solid #F1F5F9;">
          <span style="width:36px;height:36px;flex-shrink:0;border-radius:50%;background:rgba(34,197,94,.12);color:#16A34A;display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:15px;">${initial}</span>
          <span style="color:#1E293B;font-size:13.5px;font-weight:600;">${t.name}</span>
        </figcaption>
      </figure>`;
    }).join('');

    const faqs = d.faqs.map(f => {
      const answer = f.link
        ? `${f.a}<a href="${f.link.href}" target="_blank" rel="noopener" style="color:#16A34A;font-weight:600;white-space:nowrap;">${f.link.text}</a>`
        : f.a;
      return `<details class="hiwfaq" style="background:#fff;border:2px solid #E2E8F0;border-radius:20px;overflow:hidden;box-shadow:0 4px 12px rgba(15,23,42,.04);">
        <summary style="padding:20px 24px;font-weight:600;font-size:16px;color:#1E293B;display:flex;justify-content:space-between;align-items:center;gap:16px;cursor:pointer;">
          <span>${f.q}</span>
          <svg class="hiwchev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;width:20px;height:20px;color:#94A3B8;"><path d="M6 9l6 6 6-6"/></svg>
        </summary>
        <div style="padding:0 24px 20px;color:#475569;font-size:15px;line-height:1.7;">${answer}</div>
      </details>`;
    }).join('');

    const timeline = !d.showTimeline ? '' : `
    <section style="position:relative;padding:clamp(56px,7vw,92px) 20px;background:#fff;border-bottom:1px solid #F1F5F9;">
      <div style="max-width:960px;margin:0 auto;text-align:center;">
        <span style="font-weight:700;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#16A34A;">Your first two weeks</span>
        <h2 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(30px,4vw,42px);line-height:1.08;letter-spacing:-0.03em;margin:12px 0 14px;color:#0F172A;">Answers in days, not months</h2>
        <p style="font-size:clamp(16px,2.2vw,18px);color:#475569;max-width:520px;margin:0 auto 56px;">Log a little each day. The picture sharpens fast.</p>
        <div style="position:relative;">
          <div style="position:absolute;top:22px;left:8%;right:8%;height:3px;background:#E2E8F0;border-radius:99px;"></div>
          <div style="position:absolute;top:22px;left:8%;right:8%;height:3px;background:#22C55E;border-radius:99px;transform-origin:left;animation:hiwFillLoop 5.5s ease-in-out infinite;"></div>
          <div style="position:relative;display:flex;flex-wrap:wrap;justify-content:center;gap:32px 20px;">
            <div style="flex:1 1 220px;max-width:250px;">
              <div style="width:46px;height:46px;border-radius:999px;background:#fff;border:3px solid #22C55E;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;animation:hiwPopLoop 5.5s ease-in-out .2s infinite;"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" style="width:20px;height:20px;"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></div>
              <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;color:#16A34A;margin-bottom:4px;">Day 1</div>
              <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:18px;margin-bottom:6px;">Log and sync</div>
              <p style="font-size:14px;color:#64748B;">Log your meals and connect your wearable. Kygo starts building your baseline.</p>
            </div>
            <div style="flex:1 1 220px;max-width:250px;">
              <div style="width:46px;height:46px;border-radius:999px;background:#22C55E;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;animation:hiwPopLoop 5.5s ease-in-out .55s infinite,hiwGlow 2.4s ease-out 1.6s infinite;"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" style="width:20px;height:20px;"><path d="M12 3l1.9 5.2L19 10l-5.1 1.8L12 17l-1.9-5.2L5 10l5.1-1.8z"/></svg></div>
              <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;color:#16A34A;margin-bottom:4px;">Day 7</div>
              <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:18px;margin-bottom:6px;">Patterns emerge</div>
              <p style="font-size:14px;color:#64748B;">Your first correlations unlock. Kygo Advisor starts calling out what helps and hurts.</p>
            </div>
            <div style="flex:1 1 220px;max-width:250px;">
              <div style="width:46px;height:46px;border-radius:999px;background:#fff;border:3px solid #22C55E;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;animation:hiwPopLoop 5.5s ease-in-out .9s infinite;"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" style="width:20px;height:20px;"><path d="M3 3v18h18M7 15l4-4 3 3 5-6"/></svg></div>
              <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;color:#16A34A;margin-bottom:4px;">Day 14</div>
              <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:18px;margin-bottom:6px;">The full picture</div>
              <p style="font-size:14px;color:#64748B;">More metrics dial in. Pin experiments and watch the evidence grow stronger.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`;

    const pricing = !d.showFreeVsPro ? '' : `
    <section style="position:relative;padding:clamp(56px,7vw,92px) 20px;background:#F8FAFC;border-bottom:1px solid #E2E8F0;">
      <div style="max-width:940px;margin:0 auto;text-align:center;">
        <span style="font-weight:700;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#16A34A;">One plan. Pick your billing.</span>
        <h2 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(30px,4vw,42px);line-height:1.08;letter-spacing:-0.03em;margin:12px 0 14px;color:#0F172A;">Same Kygo. Better yearly.</h2>
        <p style="font-size:clamp(16px,2.2vw,18px);color:#475569;max-width:540px;margin:0 auto 48px;">Same full feature set either way. Go yearly to save 67% and start with a 7-day free trial.</p>
        <div style="display:flex;flex-wrap:wrap;gap:22px;justify-content:center;text-align:left;">
          <div style="flex:1 1 320px;max-width:400px;background:#fff;border:2px solid #E2E8F0;border-radius:20px;padding:30px 26px;box-shadow:0 4px 12px rgba(15,23,42,.04);">
            <div style="font-weight:700;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#94A3B8;margin-bottom:6px;">Monthly</div>
            <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:2px;"><span style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:36px;color:#0F172A;">$9.99</span><span style="font-size:14px;color:#94A3B8;font-weight:500;">/mo</span></div>
            <p style="font-size:13px;color:#94A3B8;font-weight:500;margin-bottom:14px;">Billed monthly. Cancel anytime.</p>
            <p style="font-size:14px;color:#64748B;margin-bottom:22px;">The full Kygo feature set, month to month.</p>
            <div class="hiwplan" style="display:flex;flex-direction:column;gap:12px;margin-bottom:26px;">${features}</div>
            <a href="${d.iosLink}" class="hiw-outline cta-primary" data-track-position="pricing" data-track-label="how-it-works-pricing-monthly" target="_blank" rel="noopener">Choose monthly</a>
          </div>
          <div style="flex:1 1 320px;max-width:400px;position:relative;background:#fff;border:2px solid #22C55E;border-radius:20px;padding:30px 26px;box-shadow:0 20px 48px -24px rgba(34,197,94,.45);">
            <span style="position:absolute;top:-13px;left:26px;background:#22C55E;color:#fff;font-weight:700;font-size:11px;letter-spacing:.6px;text-transform:uppercase;padding:5px 12px;border-radius:999px;box-shadow:0 8px 18px -6px rgba(34,197,94,.6);">Save 67% &middot; 7-day free trial</span>
            <div style="font-weight:700;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#16A34A;margin-bottom:6px;">Yearly</div>
            <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:2px;"><span style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:36px;color:#0F172A;">$3.33</span><span style="font-size:14px;color:#94A3B8;font-weight:500;">/mo</span></div>
            <p style="font-size:13px;color:#94A3B8;font-weight:500;margin-bottom:14px;">$39.99 billed yearly&nbsp;&nbsp;•&nbsp;&nbsp;7-day free trial</p>
            <p style="font-size:14px;color:#64748B;margin-bottom:22px;">The same full feature set at a third of the price.</p>
            <div class="hiwplan" style="display:flex;flex-direction:column;gap:12px;margin-bottom:26px;">${features}</div>
            <a href="${d.iosLink}" class="hiw-greenblock cta-primary" data-track-position="pricing" data-track-label="how-it-works-pricing-yearly" target="_blank" rel="noopener">Start your free trial</a>
          </div>
        </div>
        <p style="font-size:14px;color:#94A3B8;font-weight:500;margin-top:28px;">7-day free trial on the yearly plan. Cancel anytime.</p>
      </div>
    </section>`;

    this.shadowRoot.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
      *,*::before,*::after { margin:0; padding:0; box-sizing:border-box; }
      :host {
        display:block;
        font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
        background:#fff;
        color:#1E293B;
        line-height:1.6;
        -webkit-font-smoothing:antialiased;
        overflow-x:hidden;
      }
      .hiw-root { overflow-x:hidden; }
      a { color:#16A34A; text-decoration:none; }
      a:hover { color:#15803d; }

      /* Store CTA buttons */
      .hiw-ios,.hiw-android,.hiw-ghost { display:inline-flex;align-items:center;gap:9px;font-weight:600;font-size:16px;border-radius:12px;white-space:nowrap; }
      .hiw-ios svg,.hiw-android svg,.hiw-ghost svg { width:20px;height:20px; }
      .hiw-ios { background:#22C55E;color:#fff;padding:15px 26px;box-shadow:0 10px 24px -8px rgba(34,197,94,0.5);transition:transform .2s,background .2s; }
      .hiw-ios:hover { transform:translateY(-2px);background:#16A34A;color:#fff; }
      .hiw-android { background:#1E293B;color:#fff;padding:15px 26px;transition:transform .2s; }
      .hiw-android:hover { transform:translateY(-2px);color:#fff; }
      .hiw-ghost { background:rgba(255,255,255,.08);color:#fff;border:2px solid rgba(255,255,255,.16);padding:13px 24px;transition:background .2s,border-color .2s; }
      .hiw-ghost:hover { background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.3);color:#fff; }
      .hiw-outline { display:flex;align-items:center;justify-content:center;background:#fff;color:#16A34A;border:2px solid #E2E8F0;font-weight:600;font-size:15px;padding:13px;border-radius:12px;transition:border-color .2s,color .2s; }
      .hiw-outline:hover { border-color:#22C55E;color:#16A34A; }
      .hiw-greenblock { display:flex;align-items:center;justify-content:center;background:#22C55E;color:#fff;font-weight:600;font-size:15px;padding:13px;border-radius:12px;box-shadow:0 10px 24px -8px rgba(34,197,94,.5);transition:transform .2s,background .2s; }
      .hiw-greenblock:hover { transform:translateY(-2px);background:#16A34A;color:#fff; }

      /* Keyframes */
      @keyframes hiwUp { from { opacity:0; transform:translateY(22px);} to { opacity:1; transform:translateY(0);} }
      @keyframes hiwBar { 0%{transform:scaleX(0);} 24%{transform:scaleX(1);} 86%{transform:scaleX(1);} 100%{transform:scaleX(0);} }
      @keyframes hiwFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
      @keyframes hiwFloatB { 0%,100%{transform:translateY(0);} 50%{transform:translateY(8px);} }
      @keyframes hiwRing { 0%{stroke-dashoffset:326.7;} 32%{stroke-dashoffset:79;} 86%{stroke-dashoffset:79;} 100%{stroke-dashoffset:326.7;} }
      @keyframes hiwRowUp { 0%{opacity:0;transform:translateY(12px);} 16%{opacity:1;transform:translateY(0);} 88%{opacity:1;transform:translateY(0);} 100%{opacity:0;transform:translateY(12px);} }
      @keyframes hiwCount { 0%{opacity:0;} 30%{opacity:1;} 86%{opacity:1;} 100%{opacity:0;} }
      @keyframes hiwPulse { 0%,100%{opacity:.35;transform:scale(1);} 50%{opacity:1;transform:scale(1.12);} }
      @keyframes hiwGlow { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.5);} 70%{box-shadow:0 0 0 12px rgba(34,197,94,0);} }
      @keyframes hiwFillLoop { 0%{transform:scaleX(0);} 24%{transform:scaleX(1);} 88%{transform:scaleX(1);} 100%{transform:scaleX(0);} }
      @keyframes hiwPopLoop { 0%{opacity:0;transform:scale(.4);} 9%{opacity:1;transform:scale(1.14);} 15%{transform:scale(1);} 88%{opacity:1;transform:scale(1);} 100%{opacity:0;transform:scale(.4);} }
      @keyframes hiwMarquee { from{transform:translateX(0);} to{transform:translateX(-50%);} }
      @keyframes hiwFeat { from{opacity:0;transform:translateY(-10px);} to{opacity:1;transform:translateY(0);} }

      /* Pricing feature reveal on scroll */
      .hiwplan .hiwfeat { opacity:0; }
      .hiwplan.hiwseen .hiwfeat { animation:hiwFeat .5s ease-out both; }
      .hiwplan.hiwseen .hiwfeat:nth-child(1){ animation-delay:.05s; }
      .hiwplan.hiwseen .hiwfeat:nth-child(2){ animation-delay:.15s; }
      .hiwplan.hiwseen .hiwfeat:nth-child(3){ animation-delay:.25s; }
      .hiwplan.hiwseen .hiwfeat:nth-child(4){ animation-delay:.35s; }
      .hiwplan.hiwseen .hiwfeat:nth-child(5){ animation-delay:.45s; }

      /* Marquees pause on hover */
      .hiwmarquee:hover .hiwtrack { animation-play-state:paused; }

      /* FAQ accordion */
      details.hiwfaq summary { list-style:none; }
      details.hiwfaq summary::-webkit-details-marker { display:none; }
      details.hiwfaq summary .hiwchev { transition:transform .25s ease; }
      details.hiwfaq[open] summary .hiwchev { transform:rotate(180deg); color:#22C55E; }
      details.hiwfaq[open] { border-color:#22C55E !important; box-shadow:0 4px 20px rgba(34,197,94,.1); }
      details.hiwfaq[open] summary { color:#16A34A; }
      details.hiwfaq:hover { border-color:#94A3B8; }
      details.hiwfaq[open]:hover { border-color:#22C55E; }

      @media (prefers-reduced-motion: reduce){
        *{ animation:none !important; }
        .hiwtrack{ animation:none !important; }
        .hiwplan .hiwfeat{ opacity:1 !important; }
      }
    </style>

    <div class="hiw-root">

      <!-- HERO -->
      <section style="position:relative;padding:clamp(48px,6vw,84px) 20px clamp(52px,6vw,80px);background:#fff;border-bottom:1px solid #F1F5F9;overflow:hidden;">
        <div style="position:absolute;top:-160px;right:-80px;width:640px;height:640px;max-width:120vw;background:radial-gradient(circle,rgba(34,197,94,0.12) 0%,transparent 62%);pointer-events:none;"></div>
        <div style="max-width:1180px;margin:0 auto;position:relative;">
          <div style="display:flex;flex-wrap:wrap;gap:clamp(40px,5vw,64px);align-items:center;">
            <div style="flex:1 1 420px;">
              <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(34,197,94,0.1);color:#16A34A;padding:8px 15px;border-radius:999px;font-weight:600;font-size:13px;margin-bottom:22px;animation:hiwUp .6s ease-out both;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Setup in minutes. Answers in days.</div>
              <h1 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(34px,5.4vw,52px);line-height:1.05;letter-spacing:-0.03em;margin-bottom:20px;animation:hiwUp .6s ease-out .06s both;">See how your food affects your <span style="color:#22C55E;">sleep, energy, and recovery</span></h1>
              <p style="font-size:clamp(16px,2.2vw,19px);color:#475569;max-width:440px;margin-bottom:30px;line-height:1.6;animation:hiwUp .6s ease-out .12s both;">Kygo pairs your wearables with effortless food logging to reveal the personal patterns a calorie counter never could.</p>
              <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px;animation:hiwUp .6s ease-out .18s both;">
                ${this._iosBtn(d, 'hiw-ios', 'hero', 'how-it-works-hero-ios', 'Download for iOS')}
                ${this._androidBtn(d, 'hiw-android', 'hero', 'how-it-works-hero-android', 'Get it on Android')}
              </div>
              <p style="font-size:14px;color:#94A3B8;font-weight:500;animation:hiwUp .6s ease-out .24s both;">Two minute setup&nbsp;&nbsp;•&nbsp;&nbsp;Free forever plan&nbsp;&nbsp;•&nbsp;&nbsp;No credit card</p>
            </div>
            <div style="flex:1 1 380px;position:relative;animation:hiwUp .7s ease-out .2s both;">
              <div style="position:relative;max-width:430px;margin:0 auto;">
                <div style="position:relative;z-index:2;background:#fff;border:2px solid #E2E8F0;border-radius:20px;overflow:hidden;box-shadow:0 34px 70px -30px rgba(15,23,42,.42);animation:hiwFloat 6s ease-in-out infinite;">
                  <div style="padding:24px 24px 18px;">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;"><div style="width:30px;height:30px;border-radius:9px;background:rgba(34,197,94,.12);display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" style="width:16px;height:16px;"><path d="M12 3l1.9 5.2L19 10l-5.1 1.8L12 17l-1.9-5.2L5 10l5.1-1.8z"/></svg></div><span style="font-weight:600;font-size:11px;letter-spacing:.6px;text-transform:uppercase;color:#94A3B8;">Kygo Advisor</span></div>
                    <div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:22px;line-height:1.25;margin-bottom:8px;">Late caffeine is costing you <span style="color:#EF4444;">8 ms</span> of HRV</div>
                    <p style="font-size:14px;color:#475569;margin-bottom:18px;">On days you go over 95mg, your HRV runs lower the next morning.</p>
                    <div style="display:flex;align-items:center;gap:10px;"><span style="font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:#94A3B8;width:78px;flex-shrink:0;">Confidence</span><div style="flex:1;height:9px;background:#F1F5F9;border-radius:99px;overflow:hidden;"><div style="width:80%;height:100%;background:#22C55E;border-radius:99px;transform-origin:left;animation:hiwBar 6s ease-in-out infinite;"></div></div></div>
                  </div>
                  <div style="display:flex;background:#F8FAFC;border-top:1px solid #E2E8F0;">
                    <div style="flex:1;padding:13px 20px;border-right:1px solid #E2E8F0;"><div style="font-size:10px;color:#94A3B8;text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-bottom:2px;">Oura · HRV</div><div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:18px;">42<span style="font-size:11px;color:#94A3B8;font-weight:600;"> ms</span></div></div>
                    <div style="flex:1;padding:13px 20px;"><div style="font-size:10px;color:#94A3B8;text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-bottom:2px;">Lunch logged</div><div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:18px;">690<span style="font-size:11px;color:#94A3B8;font-weight:600;"> kcal</span></div></div>
                  </div>
                </div>
                <div style="position:absolute;top:-24px;right:-24px;z-index:3;background:#1E293B;color:#fff;border-radius:16px;padding:12px 17px 12px 14px;box-shadow:0 20px 40px -16px rgba(15,23,42,.5);animation:hiwFloatB 5s ease-in-out infinite;"><div style="display:flex;align-items:center;gap:10px;"><span style="display:flex;"><span style="width:26px;height:26px;border-radius:7px;overflow:hidden;border:1.5px solid #1E293B;background:#fff;"><img src="${d.logos.oura}" alt="Oura" loading="lazy" style="width:100%;height:100%;object-fit:cover;"></span><span style="width:26px;height:26px;border-radius:7px;overflow:hidden;border:1.5px solid #1E293B;background:#fff;margin-left:-9px;padding:4px;"><img src="${d.logos.apple}" alt="Apple Health" loading="lazy" style="width:100%;height:100%;object-fit:contain;"></span></span><span style="display:flex;align-items:center;gap:7px;"><span style="width:8px;height:8px;border-radius:99px;background:#22C55E;animation:hiwPulse 2.2s ease-in-out infinite;"></span><span style="font-size:13px;color:#fff;font-weight:600;letter-spacing:.3px;">Synced</span></span></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CORRELATION TICKER -->
      <section style="background:#0F172A;padding:15px 0;overflow:hidden;">
        <div style="max-width:1180px;margin:0 auto;padding:0 20px;display:flex;align-items:center;overflow:hidden;">
          <span style="flex-shrink:0;padding-right:20px;margin-right:4px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:11px;letter-spacing:.6px;text-transform:uppercase;color:#fff;line-height:1.25;border-right:1px solid rgba(255,255,255,.1);">Patterns<br>users found</span>
          <div class="hiwmarquee" style="flex:1;min-width:0;overflow:hidden;position:relative;-webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);">
            <div class="hiwtrack" style="display:flex;align-items:center;width:max-content;gap:26px;padding-left:26px;animation:hiwMarquee 34s linear infinite;">${tickerItems}</div>
          </div>
        </div>
      </section>

      <!-- STEP 1: LOG -->
      <section style="position:relative;padding:clamp(56px,7vw,92px) 20px;background:#F8FAFC;border-bottom:1px solid #E2E8F0;overflow:hidden;">
        <div style="max-width:1180px;margin:0 auto;display:flex;flex-wrap:wrap-reverse;gap:clamp(36px,5vw,80px);align-items:center;">
          <div style="flex:1 1 360px;display:flex;justify-content:center;">
            <div style="width:100%;max-width:400px;background:#fff;border:2px solid #E2E8F0;border-radius:20px;padding:22px;box-shadow:0 28px 60px -30px rgba(15,23,42,.4);animation:hiwUp .7s ease-out .1s both,hiwFloat 6s ease-in-out 1s infinite;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
                <div>
                  <div style="font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:#94A3B8;">Lunch</div>
                  <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;">Today, 12:40 PM</div>
                </div>
                <div style="position:relative;width:78px;height:78px;flex-shrink:0;">
                  <svg viewBox="0 0 120 120" style="width:78px;height:78px;transform:rotate(-90deg);"><circle cx="60" cy="60" r="52" fill="none" stroke="#F1F5F9" stroke-width="11"/><circle cx="60" cy="60" r="52" fill="none" stroke="#22C55E" stroke-width="11" stroke-linecap="round" stroke-dasharray="326.7" stroke-dashoffset="79" style="animation:hiwRing 6s ease-in-out infinite;"/></svg>
                  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:hiwCount 6s ease-in-out infinite;"><span style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:19px;line-height:1;">690</span><span style="font-size:10px;color:#94A3B8;font-weight:600;">kcal</span></div>
                </div>
              </div>
              <div style="display:flex;flex-direction:column;gap:2px;margin-bottom:16px;">
                <div style="display:flex;align-items:center;gap:11px;padding:8px 0;border-top:1px solid #F1F5F9;animation:hiwRowUp 6s ease-in-out infinite;"><span style="font-size:18px;">🍚</span><span style="flex:1;font-weight:500;font-size:14.5px;">White rice</span><span style="font-family:'Space Grotesk',sans-serif;font-weight:600;color:#64748B;font-size:14px;">260</span></div>
                <div style="display:flex;align-items:center;gap:11px;padding:8px 0;border-top:1px solid #F1F5F9;animation:hiwRowUp 6s ease-in-out .5s infinite;"><span style="font-size:18px;">🥩</span><span style="flex:1;font-weight:500;font-size:14.5px;">Cooked beef strips</span><span style="font-family:'Space Grotesk',sans-serif;font-weight:600;color:#64748B;font-size:14px;">375</span></div>
                <div style="display:flex;align-items:center;gap:11px;padding:8px 0;border-top:1px solid #F1F5F9;border-bottom:1px solid #F1F5F9;animation:hiwRowUp 6s ease-in-out 1s infinite;"><span style="font-size:18px;">🍊</span><span style="flex:1;font-weight:500;font-size:14.5px;">Clementine</span><span style="font-family:'Space Grotesk',sans-serif;font-weight:600;color:#64748B;font-size:14px;">55</span></div>
              </div>
              <div style="display:flex;gap:14px;">
                <div style="flex:1;"><div style="display:flex;justify-content:space-between;font-size:11.5px;font-weight:600;margin-bottom:5px;"><span style="color:#94A3B8;text-transform:uppercase;letter-spacing:.4px;">Protein</span><span>44g</span></div><div style="height:7px;background:#F1F5F9;border-radius:99px;overflow:hidden;"><div style="width:72%;height:100%;background:#22C55E;border-radius:99px;transform-origin:left;animation:hiwBar 6s ease-in-out infinite;"></div></div></div>
                <div style="flex:1;"><div style="display:flex;justify-content:space-between;font-size:11.5px;font-weight:600;margin-bottom:5px;"><span style="color:#94A3B8;text-transform:uppercase;letter-spacing:.4px;">Carbs</span><span>61g</span></div><div style="height:7px;background:#F1F5F9;border-radius:99px;overflow:hidden;"><div style="width:100%;height:100%;background:#22C55E;border-radius:99px;transform-origin:left;animation:hiwBar 6s ease-in-out .15s infinite;"></div></div></div>
                <div style="flex:1;"><div style="display:flex;justify-content:space-between;font-size:11.5px;font-weight:600;margin-bottom:5px;"><span style="color:#94A3B8;text-transform:uppercase;letter-spacing:.4px;">Fats</span><span>19g</span></div><div style="height:7px;background:#F1F5F9;border-radius:99px;overflow:hidden;"><div style="width:31%;height:100%;background:#22C55E;border-radius:99px;transform-origin:left;animation:hiwBar 6s ease-in-out .3s infinite;"></div></div></div>
              </div>
            </div>
          </div>
          <div style="flex:1 1 380px;">
            <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:76px;line-height:1;color:#E2E8F0;animation:hiwUp .6s ease-out both;">01</div>
            <div style="font-weight:700;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#16A34A;margin:8px 0 12px;animation:hiwUp .6s ease-out .04s both;">Step 01 · Log your food</div>
            <h2 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(28px,3.6vw,40px);line-height:1.08;letter-spacing:-0.03em;margin-bottom:14px;color:#0F172A;animation:hiwUp .6s ease-out .08s both;">Log a meal in seconds</h2>
            <p style="font-size:clamp(16px,2.2vw,18px);color:#475569;max-width:440px;margin-bottom:22px;animation:hiwUp .6s ease-out .12s both;">Snap a photo. Say it out loud. Scan a barcode. However you log, Kygo does the math.</p>
            <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:22px;max-width:460px;animation:hiwUp .6s ease-out .16s both;">
              <span style="display:inline-flex;align-items:center;gap:7px;background:#fff;border:2px solid #E2E8F0;border-radius:999px;padding:9px 15px;font-weight:600;font-size:13.5px;color:#334155;"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" style="width:15px;height:15px;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>Photo AI</span>
              <span style="display:inline-flex;align-items:center;gap:7px;background:#fff;border:2px solid #E2E8F0;border-radius:999px;padding:9px 15px;font-weight:600;font-size:13.5px;color:#334155;"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" style="width:15px;height:15px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Chat</span>
              <span style="display:inline-flex;align-items:center;gap:7px;background:#fff;border:2px solid #E2E8F0;border-radius:999px;padding:9px 15px;font-weight:600;font-size:13.5px;color:#334155;"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" style="width:15px;height:15px;"><path d="M3 5v14M7 5v14M11 5v14M15 5v14M19 5v14M21 5v14"/></svg>Barcode</span>
              <span style="display:inline-flex;align-items:center;gap:7px;background:#fff;border:2px solid #E2E8F0;border-radius:999px;padding:9px 15px;font-weight:600;font-size:13.5px;color:#334155;"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" style="width:15px;height:15px;"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4"/></svg>Voice</span>
              <span style="display:inline-flex;align-items:center;gap:7px;background:#fff;border:2px solid #E2E8F0;border-radius:999px;padding:9px 15px;font-weight:600;font-size:13.5px;color:#334155;"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" style="width:15px;height:15px;"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>Search</span>
              <span style="display:inline-flex;align-items:center;gap:7px;background:#fff;border:2px solid #E2E8F0;border-radius:999px;padding:9px 15px;font-weight:600;font-size:13.5px;color:#334155;"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" style="width:15px;height:15px;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>Saved meals</span>
            </div>
            <p style="font-size:14px;color:#94A3B8;font-weight:500;max-width:440px;animation:hiwUp .6s ease-out .2s both;">Already tracking elsewhere? Kygo imports nutrition automatically from Apple Health and Health Connect.</p>
          </div>
        </div>
      </section>

      <!-- STEP 2: CONNECT -->
      <section style="position:relative;padding:clamp(56px,7vw,92px) 20px;background:#fff;border-bottom:1px solid #F1F5F9;overflow:hidden;">
        <div style="max-width:1180px;margin:0 auto;display:flex;flex-wrap:wrap;gap:clamp(36px,5vw,80px);align-items:center;">
          <div style="flex:1 1 380px;">
            <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:76px;line-height:1;color:#EEF2F6;animation:hiwUp .6s ease-out both;">02</div>
            <div style="font-weight:700;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#16A34A;margin:8px 0 12px;animation:hiwUp .6s ease-out .04s both;">Step 02 · Connect your wearable</div>
            <h2 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(28px,3.6vw,40px);line-height:1.08;letter-spacing:-0.03em;margin-bottom:14px;color:#0F172A;animation:hiwUp .6s ease-out .08s both;">Connect your wearable in a tap</h2>
            <p style="font-size:clamp(16px,2.2vw,18px);color:#475569;max-width:440px;margin-bottom:22px;animation:hiwUp .6s ease-out .12s both;">Link what you already wear. Kygo pulls in sleep, HRV, resting heart rate, recovery, and activity on its own.</p>
            <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:22px;animation:hiwUp .6s ease-out .16s both;">${wearableTiles}</div>
            <p style="font-size:14px;color:#94A3B8;font-weight:500;max-width:440px;animation:hiwUp .6s ease-out .2s both;">Wear more than one? Kygo picks the most accurate source for each metric automatically.</p>
          </div>
          <div style="flex:1 1 360px;display:flex;justify-content:center;">
            <div style="width:100%;max-width:430px;background:#0F172A;border-radius:20px;padding:22px;box-shadow:0 30px 64px -30px rgba(15,23,42,.6);animation:hiwUp .7s ease-out .1s both,hiwFloat 6s ease-in-out 1s infinite;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="width:8px;height:8px;border-radius:99px;background:#22C55E;animation:hiwPulse 2.2s ease-in-out infinite;"></span>
                  <span style="font-weight:600;font-size:11px;letter-spacing:.6px;text-transform:uppercase;color:#94A3B8;">Auto synced today</span>
                </div>
                <span style="font-weight:600;font-size:10px;letter-spacing:.5px;text-transform:uppercase;color:#22C55E;">Best source</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:2px;">
                <div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-top:1px solid rgba(255,255,255,.08);animation:hiwRowUp 7s ease-in-out infinite;"><span style="width:32px;height:32px;border-radius:8px;overflow:hidden;flex-shrink:0;"><img src="${d.logos.oura}" alt="Oura Ring" loading="lazy" style="width:100%;height:100%;object-fit:cover;"></span><span style="flex:1;"><span style="display:block;color:#E2E8F0;font-weight:500;font-size:14.5px;line-height:1.2;">Sleep</span><span style="color:#94A3B8;font-size:11.5px;">Oura Ring</span></span><span style="font-family:'Space Grotesk',sans-serif;font-weight:700;color:#fff;font-size:15px;">7h 42m</span></div>
                <div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-top:1px solid rgba(255,255,255,.08);animation:hiwRowUp 7s ease-in-out .45s infinite;"><span style="width:32px;height:32px;border-radius:8px;overflow:hidden;flex-shrink:0;"><img src="${d.logos.oura}" alt="Oura Ring" loading="lazy" style="width:100%;height:100%;object-fit:cover;"></span><span style="flex:1;"><span style="display:block;color:#E2E8F0;font-weight:500;font-size:14.5px;line-height:1.2;">HRV</span><span style="color:#94A3B8;font-size:11.5px;">Oura Ring</span></span><span style="font-family:'Space Grotesk',sans-serif;font-weight:700;color:#22C55E;font-size:15px;">42 ms</span></div>
                <div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-top:1px solid rgba(255,255,255,.08);animation:hiwRowUp 7s ease-in-out .9s infinite;"><span style="width:32px;height:32px;border-radius:8px;overflow:hidden;flex-shrink:0;background:#fff;padding:5px;"><img src="${d.logos.apple}" alt="Apple Health" loading="lazy" style="width:100%;height:100%;object-fit:contain;"></span><span style="flex:1;"><span style="display:block;color:#E2E8F0;font-weight:500;font-size:14.5px;line-height:1.2;">Resting HR</span><span style="color:#94A3B8;font-size:11.5px;">Apple Watch</span></span><span style="font-family:'Space Grotesk',sans-serif;font-weight:700;color:#fff;font-size:15px;">54 bpm</span></div>
                <div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-top:1px solid rgba(255,255,255,.08);animation:hiwRowUp 7s ease-in-out 1.35s infinite;"><span style="width:32px;height:32px;border-radius:8px;overflow:hidden;flex-shrink:0;"><img src="${d.logos.garmin}" alt="Garmin" loading="lazy" style="width:100%;height:100%;object-fit:cover;"></span><span style="flex:1;"><span style="display:block;color:#E2E8F0;font-weight:500;font-size:14.5px;line-height:1.2;">Recovery</span><span style="color:#94A3B8;font-size:11.5px;">Garmin</span></span><span style="font-family:'Space Grotesk',sans-serif;font-weight:700;color:#22C55E;font-size:15px;">88%</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- STEP 3: DISCOVER -->
      <section style="position:relative;padding:clamp(56px,7vw,92px) 20px;background:#0F172A;overflow:hidden;">
        <div style="position:absolute;top:-160px;right:-60px;width:640px;height:560px;max-width:120vw;background:radial-gradient(circle,rgba(34,197,94,0.16) 0%,transparent 60%);pointer-events:none;"></div>
        <div style="max-width:1180px;margin:0 auto;position:relative;display:flex;flex-wrap:wrap-reverse;gap:clamp(36px,5vw,80px);align-items:center;">
          <div style="flex:1 1 360px;display:flex;justify-content:center;">
            <div style="width:100%;max-width:440px;background:#fff;border-radius:20px;padding:22px;box-shadow:0 34px 70px -30px rgba(0,0,0,.7);animation:hiwUp .7s ease-out .1s both,hiwFloat 6s ease-in-out 1s infinite;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
                <div style="display:flex;align-items:center;gap:9px;"><svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" style="width:18px;height:18px;"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg><span style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:19px;color:#0F172A;">HRV</span></div>
                <span style="font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:#94A3B8;">Pattern over 29 days</span>
              </div>
              <div style="font-size:10.5px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:#16A34A;margin-bottom:8px;">Helping</div>
              <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:18px;">
                <div style="display:flex;align-items:center;gap:11px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:11px;padding:11px 13px;animation:hiwRowUp 7s ease-in-out infinite;"><span style="font-size:16px;">🥗</span><span style="flex:1;color:#1E293B;font-weight:500;font-size:14px;">Dinner before 7pm</span><span style="display:inline-flex;align-items:center;gap:4px;font-size:10.5px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#16A34A;background:#F0FDF4;border:1px solid #BBF7D0;padding:3px 9px;border-radius:999px;">↑ Strong</span></div>
                <div style="display:flex;align-items:center;gap:11px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:11px;padding:11px 13px;animation:hiwRowUp 7s ease-in-out .4s infinite;"><span style="font-size:16px;">💊</span><span style="flex:1;color:#1E293B;font-weight:500;font-size:14px;">Magnesium before bed</span><span style="display:inline-flex;align-items:center;gap:4px;font-size:10.5px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#16A34A;background:#F0FDF4;border:1px solid #BBF7D0;padding:3px 9px;border-radius:999px;">↑ Likely</span></div>
              </div>
              <div style="font-size:10.5px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:#EF4444;margin-bottom:8px;">Hurting</div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                <div style="display:flex;align-items:center;gap:11px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:11px;padding:11px 13px;animation:hiwRowUp 7s ease-in-out .8s infinite;"><span style="font-size:16px;">☕</span><span style="flex:1;color:#1E293B;font-weight:500;font-size:14px;">Caffeine after 3pm</span><span style="display:inline-flex;align-items:center;gap:4px;font-size:10.5px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#EF4444;background:#FEF2F2;border:1px solid #FECACA;padding:3px 9px;border-radius:999px;">↓ Strong</span></div>
              </div>
              <div style="display:flex;align-items:center;gap:8px;margin-top:16px;padding-top:14px;border-top:1px solid #F1F5F9;">
                <span style="font-size:11px;color:#94A3B8;">Lags checked:</span>
                <span style="font-size:11px;font-weight:600;color:#475569;background:#F1F5F9;padding:3px 9px;border-radius:999px;white-space:nowrap;">Same day</span>
                <span style="font-size:11px;font-weight:600;color:#475569;background:#F1F5F9;padding:3px 9px;border-radius:999px;white-space:nowrap;">Next day</span>
              </div>
            </div>
          </div>
          <div style="flex:1 1 380px;">
            <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:76px;line-height:1;color:rgba(255,255,255,.09);animation:hiwUp .6s ease-out both;">03</div>
            <div style="font-weight:700;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#22C55E;margin:8px 0 12px;animation:hiwUp .6s ease-out .04s both;">Step 03 · Discover your patterns</div>
            <h2 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(28px,3.6vw,40px);line-height:1.08;letter-spacing:-0.03em;margin-bottom:14px;color:#fff;animation:hiwUp .6s ease-out .08s both;">See what helps. See what hurts.</h2>
            <p style="font-size:clamp(16px,2.2vw,18px);color:#94A3B8;max-width:440px;margin-bottom:28px;animation:hiwUp .6s ease-out .12s both;">After about seven days, Kygo grades every food against your metrics and shows the ones that actually move the needle.</p>
            <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px;animation:hiwUp .6s ease-out .18s both;">
              ${this._iosBtn(d, 'hiw-ios', 'step-3', 'how-it-works-step3-ios', 'Download for iOS')}
              ${this._androidBtn(d, 'hiw-ghost', 'step-3', 'how-it-works-step3-android', 'Get it on Android')}
            </div>
            <p style="font-size:14px;color:#64748B;font-weight:500;max-width:440px;animation:hiwUp .6s ease-out .24s both;">Correlations unlock after about seven days of logging. Included with Pro.</p>
          </div>
        </div>
      </section>

      ${timeline}

      ${pricing}

      <!-- CTA -->
      <section style="padding:clamp(56px,7vw,96px) 20px;background:#fff;">
        <div style="max-width:1000px;margin:0 auto;">
          <div style="position:relative;overflow:hidden;background:#0F172A;border-radius:24px;padding:clamp(40px,5.5vw,68px) clamp(28px,4vw,56px);text-align:center;box-shadow:0 40px 80px -36px rgba(15,23,42,.5);">
            <div style="position:absolute;top:-150px;right:-70px;width:560px;height:480px;max-width:120vw;background:radial-gradient(circle,rgba(34,197,94,0.18) 0%,transparent 60%);pointer-events:none;"></div>
            <div style="position:relative;">
              <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(34,197,94,0.12);color:#22C55E;padding:7px 14px;border-radius:999px;font-weight:600;font-size:13px;margin-bottom:20px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;"><path d="M12 3l1.9 5.2L19 10l-5.1 1.8L12 17l-1.9-5.2L5 10l5.1-1.8z"/></svg>Stop guessing. Start knowing.</div>
              <h2 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(28px,4.2vw,46px);line-height:1.06;letter-spacing:-0.03em;color:#fff;margin-bottom:16px;">Your body is already talking.<br><span style="color:#22C55E;">Kygo helps you listen.</span></h2>
              <p style="font-size:clamp(16px,2.2vw,18px);color:#94A3B8;max-width:460px;margin:0 auto 30px;">Log your food. Connect your wearable. See what actually moves your sleep, energy, and recovery.</p>
              <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:22px;">
                ${this._iosBtn(d, 'hiw-ios', 'footer-cta', 'how-it-works-footer-ios', 'Download for iOS')}
                ${this._androidBtn(d, 'hiw-ghost', 'footer-cta', 'how-it-works-footer-android', 'Get it on Android')}
              </div>
              <p style="font-size:14px;color:#64748B;font-weight:500;">Two minute setup&nbsp;&nbsp;•&nbsp;&nbsp;Free forever plan&nbsp;&nbsp;•&nbsp;&nbsp;No credit card</p>
            </div>
          </div>
        </div>
      </section>

      <!-- TESTIMONIALS -->
      <section style="padding:clamp(52px,7vw,80px) 0;background:#F8FAFC;border-top:1px solid #E2E8F0;overflow:hidden;">
        <div style="max-width:560px;margin:0 auto 34px;padding:0 20px;text-align:center;">
          <div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:11px;letter-spacing:.9px;text-transform:uppercase;color:#16A34A;margin-bottom:8px;">Testimonials</div>
          <h2 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(26px,4vw,34px);line-height:1.1;letter-spacing:-0.02em;color:#0F172A;margin-bottom:10px;">What our users say</h2>
          <p style="font-size:15px;color:#64748B;">Real reviews from people who connected a wearable and started seeing their own patterns.</p>
        </div>
        <div style="max-width:1040px;margin:0 auto;">
          <div class="hiwmarquee" style="overflow:hidden;position:relative;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);">
            <div class="hiwtrack" style="display:flex;width:max-content;padding:8px 0 12px;animation:hiwMarquee 52s linear infinite;">${testimonials}</div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section style="padding:clamp(56px,7vw,88px) 20px;background:#fff;">
        <div style="max-width:760px;margin:0 auto;">
          <div style="text-align:center;margin-bottom:36px;">
            <div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:11px;letter-spacing:.9px;text-transform:uppercase;color:#16A34A;margin-bottom:8px;">Questions &amp; answers</div>
            <h2 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(28px,4vw,40px);line-height:1.08;letter-spacing:-0.03em;color:#0F172A;margin-bottom:12px;">Frequently asked questions</h2>
            <p style="font-size:clamp(16px,2.2vw,18px);color:#475569;">Everything you need to know before you start. <a href="https://www.kygo.app/faq">See the full help center</a>.</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;">${faqs}</div>
        </div>
      </section>

    </div>`;
  }

  // ── Scroll reveal for pricing feature rows ────────────────────────────

  _setupFeatureReveal() {
    if (this._observer) this._observer.disconnect();
    const plans = this.shadowRoot.querySelectorAll('.hiwplan');
    if (!plans.length) return;
    if (!('IntersectionObserver' in window)) {
      plans.forEach(p => p.classList.add('hiwseen'));
      return;
    }
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('hiwseen');
          this._observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    plans.forEach(p => this._observer.observe(p));
  }

  // ── Structured Data (SEO / GEO) ───────────────────────────────────────

  _injectStructuredData() {
    // HowTo (preserved marker: data-kygo-hiw-ld)
    if (!document.querySelector('script[data-kygo-hiw-ld]')) {
      const howTo = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        'name': 'How Kygo Health Works: From Meal Logging to Personalized Correlations',
        'description': 'Kygo Health connects your nutrition data with your wearable health data to find personalized food-body correlations in 3 steps.',
        'totalTime': 'P7D',
        'step': [
          { '@type': 'HowToStep', 'position': 1, 'name': 'Log your food', 'text': 'Log a meal in seconds with photo AI, chat, barcode scanning, voice, search, or saved meals. Kygo does the macro and micronutrient math, and can import nutrition automatically from Apple Health and Health Connect.' },
          { '@type': 'HowToStep', 'position': 2, 'name': 'Connect your wearable', 'text': 'Link a wearable in a tap: Oura Ring, Garmin, Fitbit, Apple Health, or Health Connect. Kygo pulls in sleep, HRV, resting heart rate, recovery, and activity automatically, and picks the most accurate source for each metric.' },
          { '@type': 'HowToStep', 'position': 3, 'name': 'Discover your patterns', 'text': 'After about seven days, Kygo grades every food and supplement against your metrics and shows what helps and what hurts by evidence strength, checking same-day and next-day lags. For example, "Dinner before 7pm raises deep sleep 23 minutes" or "Caffeine after 3pm lowers HRV 8 ms."' }
        ]
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-hiw-ld', '');
      s.textContent = JSON.stringify(howTo);
      document.head.appendChild(s);
    }

    // FAQPage (matches the on-page FAQ section — improves SEO / GEO)
    if (!document.querySelector('script[data-kygo-hiw-faq-ld]')) {
      const d = this._data();
      const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': d.faqs.map(f => ({
          '@type': 'Question',
          'name': f.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.link ? (f.a + f.link.text.replace(/\s*→\s*$/, '') + ': ' + f.link.href).trim() : f.a
          }
        }))
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-kygo-hiw-faq-ld', '');
      s.textContent = JSON.stringify(faqLd);
      document.head.appendChild(s);
    }
  }
}

customElements.define('kygo-hiw', KygoHiw);
