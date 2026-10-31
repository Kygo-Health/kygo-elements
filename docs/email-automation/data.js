// backend/data.js
// Wix Data hooks for kygo.app.
//
// Subscribers_afterInsert: when a sign-up comes from the State of Wearable Accuracy report
// (source starts with "report-"), tell the Apps Script nurture web app so it can send email 1
// and schedule emails 2 to 5. The row is already saved when this runs. Nothing here can fail
// or undo the insert: every error is caught and logged, and the hook always returns the item.
//
// Secrets (Wix Dashboard > Developer Tools > Secrets Manager):
//   SOWA_NURTURE_URL     the Apps Script web app /exec URL
//   SOWA_NURTURE_SECRET  the shared secret (same as SHARED_SECRET in the Apps Script)

import { fetch } from 'wix-fetch';
import { getSecret } from 'wix-secrets-backend';

// Longest the hook waits before letting the save finish. The request keeps going in the
// background after that; the Apps Script daily run also sends any email 1 still pending.
const HOOK_WAIT_MS = 2500;

export function Subscribers_afterInsert(item, context) {
  try {
    const source = String((item && item.source) || '');
    if (!source.startsWith('report-')) return item;
    const send = notifyNurture(item).catch((err) => {
      console.error('SOWA nurture hook failed:', err && err.message ? err.message : String(err));
    });
    const wait = new Promise((resolve) => setTimeout(resolve, HOOK_WAIT_MS));
    return Promise.race([send, wait]).then(() => item, () => item);
  } catch (err) {
    console.error('SOWA nurture hook error:', err && err.message ? err.message : String(err));
    return item;
  }
}

async function notifyNurture(item) {
  const url = await getSecret('SOWA_NURTURE_URL');
  const secret = await getSecret('SOWA_NURTURE_SECRET');
  if (!url || !secret) throw new Error('missing secret SOWA_NURTURE_URL or SOWA_NURTURE_SECRET');
  const when = item.subscribedAt || item._createdDate || new Date();
  const res = await fetch(url, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret,
      email: String(item.email || '').trim().toLowerCase(),
      source: String(item.source || ''),
      createdAt: new Date(when).toISOString()
    })
  });
  if (!res.ok) throw new Error('Apps Script HTTP ' + res.status);
  const data = await res.json().catch(() => null);
  if (!data || data.ok !== true) throw new Error('Apps Script replied ' + JSON.stringify(data));
  return data;
}
