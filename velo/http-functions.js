import { ok, badRequest, serverError } from 'wix-http-functions';
import wixData from 'wix-data';
import { getSecret } from 'wix-secrets-backend';
import { fetch } from 'wix-fetch';

// POST https://www.kygo.app/_functions/subscribe
// body: { "email": "...", "source": "blog-post" | "tool-<name>" | "footer" }
export async function post_subscribe(request) {
  let body;
  try {
    body = await request.body.json();
  } catch (e) {
    return badRequest({ headers: cors(), body: { error: 'bad json' } });
  }

  const email = (body.email || '').trim().toLowerCase();
  const source = body.source || 'unknown';

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return badRequest({ headers: cors(), body: { error: 'invalid email' } });
  }

  try {
    const inserted = await wixData.insert('Subscribers', {
      email,
      source,
      subscribedAt: new Date()
    }, { suppressAuth: true });
    return ok({ headers: cors(), body: { ok: true, id: inserted._id } });
  } catch (err) {
    return serverError({ headers: cors(), body: { error: String(err) } });
  }
}

export function options_subscribe() {
  return ok({ headers: cors() });
}

function cors() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

// ── Kygo Picks: live Amazon product data ────────────────────────────────
// GET https://www.kygo.app/_functions/amazonPicks
// Uses Wix secrets AMZ_CREATOR_ID and AMZ_CREATOR_SECRET (optional AMZ_CREATOR_VERSION).

const PARTNER_TAG = 'kygohealthapp-20';
const MARKETPLACE = 'www.amazon.com';
const API = 'https://creatorsapi.amazon/catalog/v1/getItems';

// Keep in sync with the asin fields in kygo-picks.js (_products).
const ASINS = [
  'B0HJ9YNRW7', // Apple Watch Series 12
  'B0HJB6C34Y', // Apple Watch Ultra 4
  'B0GRJVBPH3', // Oura Ring 5
  'B0F8QWPVNK', // Garmin Forerunner 970
  'B0FPML7DJC', // WHOOP 5.0 (One bundle, 12-month membership)
  'B0H7X38W5B', // Google Pixel Watch 5
  'B0H1DG7XRW', // Samsung Galaxy Watch 9
  'B0CXHJRWN9'  // Polar Grit X2 Pro
];

// Amazon allows product data to be cached for up to 24 hours. We refresh hourly.
const TTL_MS = 60 * 60 * 1000;
let cache = { at: 0, items: null };
let tokenCache = { at: 0, token: null, version: null };

// Credential versions: 3.x use Login with Amazon, 2.x use Cognito.
const AUTH = {
  '3.1': { url: 'https://api.amazon.com/auth/o2/token', scope: 'creatorsapi::default', lwa: true },
  '2.1': { url: 'https://creatorsapi.auth.us-east-1.amazoncognito.com/oauth2/token', scope: 'creatorsapi/default', lwa: false }
};

async function optionalSecret(name) {
  try { return await getSecret(name); } catch (e) { return null; }
}

async function getToken() {
  if (tokenCache.token && Date.now() - tokenCache.at < 50 * 60 * 1000) return tokenCache;
  const id = await getSecret('AMZ_CREATOR_ID');
  const secret = await getSecret('AMZ_CREATOR_SECRET');
  const pinned = await optionalSecret('AMZ_CREATOR_VERSION');
  const versions = pinned ? [pinned.trim()] : ['3.1', '2.1'];
  let lastErr = '';
  for (const v of versions) {
    const a = AUTH[v] || (v.startsWith('3') ? AUTH['3.1'] : AUTH['2.1']);
    const body = 'grant_type=client_credentials&scope=' + encodeURIComponent(a.scope)
      + (a.lwa ? '&client_id=' + encodeURIComponent(id) + '&client_secret=' + encodeURIComponent(secret) : '');
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    if (!a.lwa) headers.Authorization = 'Basic ' + Buffer.from(id + ':' + secret).toString('base64');
    const res = await fetch(a.url, { method: 'post', headers, body });
    if (res.ok) {
      const json = await res.json();
      tokenCache = { at: Date.now(), token: json.access_token, version: v };
      return tokenCache;
    }
    lastErr = v + ': ' + res.status + ' ' + (await res.text()).slice(0, 200);
  }
  throw new Error('Token request failed. ' + lastErr);
}

// Field names are lowerCamelCase in the Creators API; tolerate PA-API casing too.
const pick = (o, ...keys) => { for (const k of keys) if (o && o[k] != null) return o[k]; return null; };

async function fetchItems() {
  const t = await getToken();
  const auth = t.version.startsWith('2') ? 'Bearer ' + t.token + ', Version ' + t.version : 'Bearer ' + t.token;
  const res = await fetch(API, {
    method: 'post',
    headers: { 'Content-Type': 'application/json', 'Authorization': auth, 'x-marketplace': MARKETPLACE },
    body: JSON.stringify({
      itemIds: ASINS,
      itemIdType: 'ASIN',
      partnerTag: PARTNER_TAG,
      marketplace: MARKETPLACE,
      resources: ['images.primary.large', 'itemInfo.title', 'offersV2.listings.price']
    })
  });
  const text = await res.text();
  if (!res.ok) throw new Error('getItems ' + res.status + ' ' + text.slice(0, 300));
  const json = JSON.parse(text);
  const list = pick(pick(json, 'itemsResult', 'ItemsResult') || {}, 'items', 'Items') || [];
  const items = {};
  for (const it of list) {
    const asin = pick(it, 'asin', 'ASIN');
    const img = pick(pick(pick(it, 'images', 'Images') || {}, 'primary', 'Primary') || {}, 'large', 'Large') || {};
    const title = pick(pick(pick(it, 'itemInfo', 'ItemInfo') || {}, 'title', 'Title') || {}, 'displayValue', 'DisplayValue');
    // Price: first listing's display amount (Creators API offersV2). Amazon allows showing it only
    // when it comes from the API and is refreshed within 24 h; we refresh hourly.
    const listings = pick(pick(it, 'offersV2', 'OffersV2') || {}, 'listings', 'Listings') || [];
    const pr = listings.length ? pick(listings[0], 'price', 'Price') : null;
    let price = '';
    if (pr) {
      const money = pick(pr, 'money', 'Money') || pr;
      price = pick(money, 'displayAmount', 'DisplayAmount') || '';
      const amt = pick(money, 'amount', 'Amount');
      if (!price && amt != null) price = '$' + Number(amt).toFixed(2);
      price = String(price).replace(/\.00$/, '');
    }
    items[asin] = {
      title: title || '',
      price,
      image: pick(img, 'url', 'URL') || '',
      url: pick(it, 'detailPageURL', 'detailPageUrl', 'DetailPageURL') || ('https://www.amazon.com/dp/' + asin + '?tag=' + PARTNER_TAG)
    };
  }
  const errors = pick(json, 'errors', 'Errors') || [];
  return { items, errors };
}

export async function get_amazonPicks(request) {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' };
  try {
    if (!cache.items || Date.now() - cache.at > TTL_MS) {
      const { items, errors } = await fetchItems();
      cache = { at: Date.now(), items, errors };
    }
    return ok({ headers, body: { updated: new Date(cache.at).toISOString(), items: cache.items, errors: cache.errors } });
  } catch (err) {
    console.error('amazonPicks', err.message);
    // Serve stale data if we have it; the page falls back to static links otherwise.
    if (cache.items) return ok({ headers, body: { updated: new Date(cache.at).toISOString(), items: cache.items, stale: true } });
    return serverError({ headers, body: { error: 'amazon_unavailable' } });
  }
}
