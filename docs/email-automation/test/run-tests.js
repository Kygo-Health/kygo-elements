#!/usr/bin/env node
/**
 * Test harness for the SOWA nurture email system.
 *
 * Runs Code.gs (Apps Script) inside a Node vm with mocks for SpreadsheetApp, Gmail (advanced
 * service), Utilities, PropertiesService, LockService, ContentService, HtmlService, ScriptApp
 * and UrlFetchApp, plus the two Wix files (data.js hook, http-functions.js get_go) with mocks
 * for wix-fetch, wix-secrets-backend and wix-http-functions. The Wix fetch mock forwards to the
 * Apps Script doPost, so sign-ups and clicks run end to end.
 *
 * Usage: node test/run-tests.js            (from the email-automation folder)
 * Writes: test/out/email1.html ... email5.html (rendered for the PNG step) and test/results.txt
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const SECRET = 'test-secret-0123456789abcdef0123456789';
const SHEET_ID = 'sheet-123';
const WEBAPP = 'https://script.google.com/macros/s/TESTDEPLOY/exec';
const ET = 'America/New_York';

/* ------------------------------------------------------------------ */
/* Mock Google services                                                */
/* ------------------------------------------------------------------ */

function makeGoogle() {
  const state = {
    sheets: {},              // name -> { rows: [][], frozen, formats }
    props: {},
    sent: [],                // { raw, mime, to, at }
    inbox: [],               // { id, kind, internalDate(ms), raw }
    triggers: [],
    urlFetchCalls: 0,
    lockHeld: false,
    gmailFailNext: 0,
    clock: Date.parse('2026-11-02T15:00:00Z') // 10:00 ET
  };

  class Range {
    constructor(sh, r, c, nr, nc) { Object.assign(this, { sh, r, c, nr, nc }); }
    _ensure() {
      while (this.sh.rows.length < this.r + this.nr - 1) this.sh.rows.push([]);
    }
    getValues() {
      const out = [];
      for (let i = 0; i < this.nr; i++) {
        const row = this.sh.rows[this.r - 1 + i] || [];
        const o = [];
        for (let j = 0; j < this.nc; j++) {
          const v = row[this.c - 1 + j];
          o.push(v === undefined || v === null ? '' : v);
        }
        out.push(o);
      }
      return out;
    }
    setValues(vals) {
      assert.strictEqual(vals.length, this.nr, 'setValues row count');
      this._ensure();
      for (let i = 0; i < this.nr; i++) {
        assert.strictEqual(vals[i].length, this.nc, 'setValues col count');
        for (let j = 0; j < this.nc; j++) this.sh.rows[this.r - 1 + i][this.c - 1 + j] = vals[i][j];
      }
      return this;
    }
    setValue(v) { this._ensure(); this.sh.rows[this.r - 1][this.c - 1] = v; return this; }
    setFormulas(f) { return this.setValues(f); }
    setFormula(f) { return this.setValue(f); }
    setNumberFormat(fmt) { this.sh.formats.push([this.r, this.c, this.nr, this.nc, fmt]); return this; }
  }
  class Sheet {
    constructor(name) { this.name = name; this.rows = []; this.frozen = 0; this.formats = []; }
    getLastRow() {
      let n = this.rows.length;
      while (n > 0 && !(this.rows[n - 1] || []).some((v) => v !== '' && v != null)) n--;
      return n;
    }
    appendRow(arr) { this.rows.length = this.getLastRow(); this.rows.push(arr.slice()); return this; }
    getRange(r, c, nr, nc) { return new Range(this, r, c, nr || 1, nc || 1); }
    setFrozenRows(n) { this.frozen = n; }
    clear() { this.rows = []; this.formats = []; }
  }
  const ss = {
    getSheetByName: (n) => state.sheets[n] || null,
    insertSheet: (n) => (state.sheets[n] = new Sheet(n))
  };

  const b64 = (s) => Buffer.from(s, 'utf8').toString('base64');
  const toBuf = (x) => (Array.isArray(x) ? Buffer.from(x.map((b) => b & 255)) : Buffer.from(String(x), 'utf8'));

  const api = {
    SpreadsheetApp: {
      openById: (id) => { assert.strictEqual(id, SHEET_ID, 'openById with the SHEET_ID property'); return ss; },
      flush: () => {}
    },
    Gmail: {
      Users: {
        Messages: {
          send: (resource, user) => {
            assert.strictEqual(user, 'me');
            if (state.gmailFailNext > 0) { state.gmailFailNext--; throw new Error('Gmail API: simulated failure'); }
            const mime = Buffer.from(resource.raw, 'base64url').toString('utf8');
            const to = (/^To: <([^>]+)>/m.exec(mime) || [])[1];
            state.sent.push({ raw: resource.raw, mime, to, at: state.clock });
            return { id: 'm' + state.sent.length };
          },
          list: (user, opt) => {
            const after = Number((/after:(\d+)/.exec(opt.q) || [])[1] || 0);
            const kind = /mailer-daemon/.test(opt.q) ? 'bounce' : (/subject:unsubscribe/.test(opt.q) ? 'unsub' : 'other');
            const msgs = state.inbox.filter((m) => m.kind === kind && m.internalDate / 1000 > after).map((m) => ({ id: m.id }));
            return msgs.length ? { messages: msgs } : {};
          },
          get: (user, id, opt) => {
            assert.strictEqual(opt.format, 'raw');
            const m = state.inbox.find((x) => x.id === id);
            return { id, raw: Buffer.from(m.raw, 'utf8').toString('base64url') };
          }
        }
      }
    },
    Utilities: {
      Charset: { UTF_8: 'UTF-8' },
      getUuid: () => crypto.randomUUID(),
      base64Encode: (s) => toBuf(s).toString('base64'),
      base64EncodeWebSafe: (s) => toBuf(s).toString('base64url'),
      base64DecodeWebSafe: (s) => Array.from(Buffer.from(s, 'base64url')).map((b) => (b > 127 ? b - 256 : b)),
      newBlob: (data) => ({
        getBytes: () => Array.from(toBuf(data)),
        getDataAsString: () => toBuf(data).toString('utf8')
      }),
      formatDate: (d, tz, fmt) => {
        assert.strictEqual(fmt, 'yyyy-MM-dd');
        const p = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
        return p;
      }
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k) => (k in state.props ? state.props[k] : null),
        setProperty: (k, v) => { state.props[k] = String(v); }
      })
    },
    LockService: {
      getScriptLock: () => ({
        tryLock: () => { if (state.lockHeld) throw new Error('nested lock: would deadlock in Apps Script'); state.lockHeld = true; return true; },
        releaseLock: () => { state.lockHeld = false; }
      })
    },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput: (s) => ({ content: s, mime: 'text/plain', setMimeType(m) { this.mime = m; return this; }, getContent() { return this.content; } })
    },
    HtmlService: {
      createHtmlOutput: (h) => ({ html: h, title: '', setTitle(t) { this.title = t; return this; }, addMetaTag() { return this; }, getContent() { return this.html; } })
    },
    ScriptApp: {
      getProjectTriggers: () => state.triggers.slice(),
      deleteTrigger: (t) => { state.triggers = state.triggers.filter((x) => x !== t); },
      newTrigger: (fn) => {
        const t = { fn, getHandlerFunction: () => fn };
        const b = { timeBased: () => b, everyDays: (n) => { t.everyDays = n; return b; }, atHour: (h) => { t.hour = h; return b; },
          inTimezone: (z) => { t.tz = z; return b; }, create: () => { state.triggers.push(t); return t; } };
        return b;
      },
      getService: () => ({ getUrl: () => WEBAPP })
    },
    UrlFetchApp: { fetch: () => { state.urlFetchCalls++; throw new Error('UrlFetchApp should not be used'); } },
    Logger: { log: () => {} },
    console
  };
  return { state, api, Sheet };
}

function loadAppsScript() {
  const { state, api } = makeGoogle();
  const ctx = vm.createContext(Object.assign({}, api));
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'Code.gs'), 'utf8'), ctx, { filename: 'Code.gs' });
  ctx.now_ = () => new Date(state.clock);
  Object.assign(state.props, { SHARED_SECRET: SECRET, SHEET_ID, WEBAPP_URL: WEBAPP });
  ctx.setup();
  return { ctx, state };
}

/* ------------------------------------------------------------------ */
/* Wix module loader (strips ES imports, injects mocks)                */
/* ------------------------------------------------------------------ */

function loadWix(file, mocks, patch) {
  let src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  src = src.replace(/^import .*$/gm, '').replace(/^export /gm, '');
  if (patch) src = patch(src);
  const exportsNames = [...src.matchAll(/^(?:async )?function (\w+)/gm)].map((m) => m[1]);
  const consts = [...src.matchAll(/^const (NURTURE_LINKS)\b/gm)].map((m) => m[1]);
  src += '\n;__exports = {' + exportsNames.concat(consts).join(',') + '};';
  const ctx = vm.createContext(Object.assign({ console: mocks.console || console, setTimeout, Promise, Buffer, __exports: null }, mocks));
  vm.runInContext(src, ctx, { filename: file });
  return ctx.__exports;
}

/** A wix-fetch mock that forwards to Apps Script doPost, like the real web app would. */
function bridgeFetch(app, log) {
  return async (url, opts) => {
    log.push({ url, opts });
    assert.strictEqual(url, WEBAPP);
    const out = app.ctx.doPost({ parameter: {}, postData: { contents: opts.body, type: 'application/json' } });
    const text = out.getContent();
    return { ok: true, status: 200, json: async () => JSON.parse(text), text: async () => text };
  };
}

const secrets = async (name) => ({ SOWA_NURTURE_URL: WEBAPP, SOWA_NURTURE_SECRET: SECRET })[name];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const DAY = 86400000;
/** deepStrictEqual across vm realms (arrays made in the vm have a different prototype). */
const deq = (a, b, m) => assert.deepStrictEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)), m);
const subs = (st) => st.sheets.Subscribers.rows.slice(1).filter((r) => r.length);
const rowOf = (st, email) => subs(st).find((r) => r[1] === email);
const col = { token: 0, email: 1, source: 2, signup: 3, status: 4, s1: 5, clicks: 10, unsubAt: 11, unsubAfter: 12, bounced: 13, err: 14 };
const sentTo = (st, email) => st.sent.filter((m) => m.to === email);
const subjectOf = (m) => (/^Subject: (.*)$/m.exec(m.mime) || [])[1];

function signup(app, email, source = 'report-landing', secret = SECRET) {
  const out = app.ctx.doPost({ parameter: {}, postData: { contents: JSON.stringify({ secret, email, source, createdAt: new Date(app.state.clock).toISOString() }) } });
  return JSON.parse(out.getContent());
}
function etDateTime(dateStr, hour) {
  // hour in New York time on dateStr (2026-11 is EST, UTC-5)
  return Date.parse(dateStr + 'T00:00:00Z') + (hour + 5) * 3600000;
}
function parts(mime) {
  const boundary = /boundary="([^"]+)"/.exec(mime)[1];
  const segs = mime.split('--' + boundary).slice(1, -1);
  const out = {};
  for (const s of segs) {
    const [h, b] = s.split(/\r\n\r\n/);
    const type = /Content-Type: ([^;\r\n]+)/.exec(h)[1];
    out[type] = Buffer.from(b.replace(/\s+/g, ''), 'base64').toString('utf8');
  }
  return out;
}
function decodeEntities(s) {
  return s.replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (m, d) => String.fromCharCode(+d)).replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
const visibleText = (html) => decodeEntities(html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

/* ------------------------------------------------------------------ */
/* Tests                                                               */
/* ------------------------------------------------------------------ */

const results = [];
async function test(name, fn) {
  try {
    await fn();
    results.push(['PASS', name]);
  } catch (e) {
    results.push(['FAIL', name, e && e.stack ? e.stack.split('\n').slice(0, 4).join(' | ') : String(e)]);
  }
}

(async () => {
  await test('setup builds Subscribers, Clicks and Summary tabs and one daily 9:00 ET trigger (idempotent)', () => {
    const app = loadAppsScript();
    app.ctx.setup();
    const st = app.state;
    deq(st.sheets.Subscribers.rows[0].slice(0, 5), ['token', 'email', 'source', 'signup_at', 'status']);
    assert.strictEqual(st.sheets.Clicks.rows[0][0], 'clicked_at');
    const sum = st.sheets.Summary.rows;
    assert.strictEqual(sum[1][2], '=COUNTA(Subscribers!F2:F)');
    assert.strictEqual(sum[1][3], '=IFERROR(COUNTUNIQUE(FILTER(Clicks!B2:B,Clicks!C2:C=1)),0)');
    assert.ok(String(sum[10][0]).startsWith('=IFERROR(SORT(UNIQUE('), 'source list formula');
    assert.strictEqual(st.triggers.length, 1);
    deq([st.triggers[0].fn, st.triggers[0].everyDays, st.triggers[0].hour, st.triggers[0].tz], ['dailyRun', 1, 9, ET]);
  });

  await test('setup refuses to run without SHARED_SECRET / SHEET_ID', () => {
    const { state, api } = makeGoogle();
    const ctx = vm.createContext(Object.assign({}, api));
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'Code.gs'), 'utf8'), ctx);
    assert.throws(() => ctx.setup(), /SHARED_SECRET/);
    state.props.SHARED_SECRET = 'short';
    state.props.SHEET_ID = SHEET_ID;
    assert.throws(() => ctx.setup(), /24 random/);
  });

  await test('sign-up appends a row, sends email 1 immediately with the right headers and MIME', () => {
    const app = loadAppsScript();
    const r = signup(app, 'Alice@Example.com');
    deq(r, { ok: true, duplicate: false, sent: true });
    const row = rowOf(app.state, 'alice@example.com');
    assert.ok(/^[a-f0-9]{32}$/.test(row[col.token]), 'random 32-hex token');
    assert.strictEqual(row[col.status], 'active');
    assert.ok(row[col.s1] instanceof Date, 'email1_sent stamped');
    const m = sentTo(app.state, 'alice@example.com');
    assert.strictEqual(m.length, 1);
    const mime = m[0].mime;
    assert.match(mime, /^From: "Ryan at Kygo" <ryan@kygo\.app>$/m);
    assert.match(mime, /^Reply-To: ryan@kygo\.app$/m);
    assert.strictEqual(subjectOf(m[0]), 'Your State of Wearable Accuracy 2026 report');
    const t = row[col.token];
    assert.ok(mime.includes('List-Unsubscribe: <mailto:ryan@kygo.app?subject=unsubscribe%20' + t + '>, <' + WEBAPP + '?a=u&id=' + t + '>'), 'List-Unsubscribe mailto + https');
    assert.match(mime, /^List-Unsubscribe-Post: List-Unsubscribe=One-Click$/m);
    assert.match(mime, /Content-Type: multipart\/alternative/);
    const p = parts(mime);
    assert.ok(p['text/plain'] && p['text/html'], 'plain-text alternative and html');
    assert.ok(!/alice@example\.com/i.test(p['text/html'] + p['text/plain']), 'no raw email address in the body or URLs');
    assert.ok(p['text/html'].includes('https://www.kygo.app/_functions/go?id=' + t + '&amp;e=1&amp;l=e1'), 'tracked main link');
    assert.ok(!p['text/html'].includes('href="https://www.kygo.app/report-download'), 'no untracked destination links');
    assert.ok(p['text/plain'].includes('Unsubscribe: ' + WEBAPP + '?a=u&id=' + t));
    assert.ok(p['text/html'].includes('static.wixstatic.com/media/273a63_ea4081473bdf4955bfa6aeb4128346df~mv2.png'), 'cover image');
    assert.strictEqual(app.state.urlFetchCalls, 0);
  });

  await test('rejects a bad secret, a non-report source and an invalid email (nothing written or sent)', () => {
    const app = loadAppsScript();
    deq(signup(app, 'a@b.co', 'report-landing', 'wrong-secret-0123456789abcdef01234'), { ok: false, error: 'unauthorized' });
    deq(signup(app, 'a@b.co', 'footer'), { ok: false, error: 'not_a_report_source' });
    deq(signup(app, 'not-an-email', 'report-landing'), { ok: false, error: 'invalid_email' });
    const bad = app.ctx.doPost({ parameter: {}, postData: { contents: '{nope' } });
    assert.strictEqual(JSON.parse(bad.getContent()).error, 'bad_json');
    assert.strictEqual(subs(app.state).length, 0);
    assert.strictEqual(app.state.sent.length, 0);
  });

  await test('duplicate sign-up (any case) keeps one row and one sequence', () => {
    const app = loadAppsScript();
    signup(app, 'dup@example.com');
    const r2 = signup(app, 'DUP@example.com', 'report-download');
    deq(r2, { ok: true, duplicate: true });
    assert.strictEqual(subs(app.state).filter((r) => r[col.email] === 'dup@example.com').length, 1);
    assert.strictEqual(sentTo(app.state, 'dup@example.com').length, 1);
  });

  await test('day 0 to 16 schedule with a simulated clock: emails go out on days 0, 2, 5, 9, 14 only', () => {
    const app = loadAppsScript();
    const st = app.state;
    st.clock = etDateTime('2026-11-02', 10);
    signup(app, 'early@example.com');
    st.clock = etDateTime('2026-11-02', 23.5); // 11:30 pm ET, still calendar day 0
    signup(app, 'late@example.com');
    const log = { early: [], late: [] };
    for (let d = 0; d <= 16; d++) {
      for (const hour of [9, 15]) { // the 9:00 trigger plus a manual rerun later the same day
        st.clock = etDateTime('2026-11-02', 9) + d * DAY + (hour - 9) * 3600000;
        const before = st.sent.length;
        app.ctx.dailyRun();
        for (const m of st.sent.slice(before)) log[m.to.split('@')[0]].push([d, subjectOf(m)]);
      }
    }
    const days = (k) => log[k].map((x) => x[0]);
    deq(days('early'), [2, 5, 9, 14]);
    deq(days('late'), [2, 5, 9, 14]);
    deq(sentTo(st, 'early@example.com').map(subjectOf), app.ctx.EMAILS.map((e) => e.subject));
    assert.strictEqual(rowOf(st, 'early@example.com')[col.status], 'completed');
    assert.strictEqual(st.sent.length, 10);
  });

  await test('rerunning the daily job (3 times in a row, every day) never double-sends', () => {
    const app = loadAppsScript();
    const st = app.state;
    st.clock = etDateTime('2026-11-02', 10);
    for (let i = 0; i < 4; i++) signup(app, `u${i}@example.com`);
    for (let d = 0; d <= 15; d++) {
      st.clock = etDateTime('2026-11-02', 9) + d * DAY;
      app.ctx.dailyRun(); app.ctx.dailyRun(); app.ctx.dailyRun();
    }
    for (let i = 0; i < 4; i++) {
      const subjects = sentTo(st, `u${i}@example.com`).map(subjectOf);
      assert.strictEqual(subjects.length, 5);
      assert.strictEqual(new Set(subjects).size, 5);
    }
  });

  await test('a stale snapshot cannot double-send (row re-read under the lock)', () => {
    const app = loadAppsScript();
    const st = app.state;
    st.clock = etDateTime('2026-11-02', 10);
    signup(app, 'race@example.com');
    signup(app, 'race2@example.com');
    st.clock = etDateTime('2026-11-04', 9);
    // Simulate a second, overlapping run: it took its snapshot before the first run wrote email2_sent.
    const sh = st.sheets.Subscribers;
    const realGetRange = sh.getRange.bind(sh);
    let snapshot = null;
    sh.getRange = (r, c, nr, nc) => {
      const rg = realGetRange(r, c, nr, nc);
      if (r === 2 && c === 1 && nr > 0 && nr === sh.getLastRow() - 1 && nc === 15 && !snapshot) {
        snapshot = rg.getValues();
        return { getValues: () => snapshot };
      }
      return rg;
    };
    app.ctx.dailyRun();                  // first run sends email 2
    sh.getRange = (r, c, nr, nc) => (r === 2 && c === 1 && nc === 15 && nr === sh.getLastRow() - 1 ? { getValues: () => snapshot } : realGetRange(r, c, nr, nc));
    app.ctx.dailyRun();                  // second run sees the stale snapshot, re-reads, skips
    assert.strictEqual(sentTo(st, 'race@example.com').length, 2);
    assert.strictEqual(sentTo(st, 'race2@example.com').length, 2);
  });

  await test('Gmail failure records last_error and the next run retries; no skipped emails', () => {
    const app = loadAppsScript();
    const st = app.state;
    st.clock = etDateTime('2026-11-02', 10);
    st.gmailFailNext = 1;
    const r = signup(app, 'fail@example.com');
    assert.strictEqual(r.sent, false);
    assert.match(rowOf(st, 'fail@example.com')[col.err], /email 1: Gmail API: simulated failure/);
    st.clock = etDateTime('2026-11-03', 9);
    app.ctx.dailyRun();
    const row = rowOf(st, 'fail@example.com');
    assert.ok(row[col.s1] instanceof Date);
    assert.strictEqual(row[col.err], '');
    st.clock = etDateTime('2026-11-04', 9);
    app.ctx.dailyRun();
    deq(sentTo(st, 'fail@example.com').map(subjectOf), app.ctx.EMAILS.slice(0, 2).map((e) => e.subject));
  });

  await test('unsubscribe mid-sequence via the link stops the sequence and shows a confirmation page', () => {
    const app = loadAppsScript();
    const st = app.state;
    st.clock = etDateTime('2026-11-02', 10);
    signup(app, 'bob@example.com');
    st.clock = etDateTime('2026-11-04', 9);
    app.ctx.dailyRun(); // email 2
    const t = rowOf(st, 'bob@example.com')[col.token];
    const page = app.ctx.doGet({ parameter: { a: 'u', id: t } });
    assert.strictEqual(page.title, 'You are unsubscribed');
    const row = rowOf(st, 'bob@example.com');
    assert.strictEqual(row[col.status], 'unsubscribed');
    assert.strictEqual(row[col.unsubAfter], 2);
    for (let d = 3; d <= 16; d++) { st.clock = etDateTime('2026-11-02', 9) + d * DAY; app.ctx.dailyRun(); }
    assert.strictEqual(sentTo(st, 'bob@example.com').length, 2);
    // second click on the link is harmless
    assert.strictEqual(app.ctx.doGet({ parameter: { a: 'u', id: t } }).title, 'You are unsubscribed');
    assert.strictEqual(app.ctx.doGet({ parameter: { a: 'u', id: 'f'.repeat(32) } }).title, 'Link not recognized');
    assert.strictEqual(app.ctx.doGet({ parameter: { a: 'u', id: 'bob@example.com' } }).title, 'Link not recognized');
  });

  await test('RFC 8058 one-click POST and mailto unsubscribes (token in subject, or plain reply) both stop sends', () => {
    const app = loadAppsScript();
    const st = app.state;
    st.clock = etDateTime('2026-11-02', 10);
    signup(app, 'carol@example.com'); signup(app, 'dan@example.com'); signup(app, 'erin@example.com');
    const tok = (e) => rowOf(st, e)[col.token];
    const out = app.ctx.doPost({ parameter: { a: 'u', id: tok('carol@example.com'), 'List-Unsubscribe': 'One-Click' }, postData: { contents: 'List-Unsubscribe=One-Click', type: 'application/x-www-form-urlencoded' } });
    assert.strictEqual(out.getContent(), 'ok');
    st.inbox.push({ id: 'u1', kind: 'unsub', internalDate: st.clock + 3600000, raw: 'From: dan@example.com\r\nTo: ryan@kygo.app\r\nSubject: unsubscribe ' + tok('dan@example.com') + '\r\n\r\n' });
    st.inbox.push({ id: 'u2', kind: 'unsub', internalDate: st.clock + 3600000, raw: 'From: Erin <ERIN@example.com>\r\nTo: ryan@kygo.app\r\nSubject: Re: Unsubscribe me please\r\n\r\nthanks' });
    st.clock = etDateTime('2026-11-04', 9);
    app.ctx.dailyRun();
    for (const e of ['carol@example.com', 'dan@example.com', 'erin@example.com']) {
      assert.strictEqual(rowOf(st, e)[col.status], 'unsubscribed', e);
      assert.strictEqual(sentTo(st, e).length, 1, e);
    }
  });

  await test('bounce check marks bounced rows (X-Failed-Recipients and DSN body), ignores delays and never-emailed addresses', () => {
    const app = loadAppsScript();
    const st = app.state;
    st.clock = etDateTime('2026-11-02', 10);
    signup(app, 'gone@example.com'); signup(app, 'dsn@example.org'); signup(app, 'slow@example.com'); signup(app, 'ok@example.com');
    st.props.PAUSED = 'true';
    signup(app, 'never@example.com'); // recorded, not emailed
    delete st.props.PAUSED;
    const t = st.clock + 600000;
    st.inbox.push({ id: 'b1', kind: 'bounce', internalDate: t, raw: 'From: Mail Delivery Subsystem <mailer-daemon@googlemail.com>\r\nX-Failed-Recipients: gone@example.com\r\nSubject: Delivery Status Notification (Failure)\r\n\r\nAddress not found' });
    st.inbox.push({ id: 'b2', kind: 'bounce', internalDate: t, raw: 'From: postmaster@example.org\r\nSubject: Undeliverable: Your report\r\n\r\nReporting-MTA: dns; mx.example.org\r\n\r\nFinal-Recipient: rfc822; DSN@example.org\r\nAction: failed\r\n' });
    st.inbox.push({ id: 'b3', kind: 'bounce', internalDate: t, raw: 'From: mailer-daemon@googlemail.com\r\nX-Failed-Recipients: slow@example.com\r\nSubject: Delivery Status Notification (Delay)\r\n\r\nwill retry' });
    st.inbox.push({ id: 'b4', kind: 'bounce', internalDate: t, raw: 'From: mailer-daemon@googlemail.com\r\nX-Failed-Recipients: never@example.com\r\nSubject: Delivery Status Notification (Failure)\r\n\r\n' });
    st.clock = etDateTime('2026-11-03', 9);
    app.ctx.dailyRun();
    assert.strictEqual(rowOf(st, 'gone@example.com')[col.status], 'bounced');
    assert.ok(rowOf(st, 'gone@example.com')[col.bounced] instanceof Date);
    assert.strictEqual(rowOf(st, 'dsn@example.org')[col.status], 'bounced');
    assert.strictEqual(rowOf(st, 'slow@example.com')[col.status], 'active');
    assert.strictEqual(rowOf(st, 'never@example.com')[col.status], 'active');
    for (let d = 2; d <= 16; d++) { st.clock = etDateTime('2026-11-02', 9) + d * DAY; app.ctx.dailyRun(); }
    assert.strictEqual(sentTo(st, 'gone@example.com').length, 1);
    assert.strictEqual(sentTo(st, 'dsn@example.org').length, 1);
    assert.strictEqual(sentTo(st, 'slow@example.com').length, 5);
    assert.strictEqual(sentTo(st, 'never@example.com').length, 5, 'paused sign-up catches up from email 1');
    assert.ok(Number(st.props.LAST_INBOX_CHECK) > 0);
  });

  await test('click via Wix get_go: real 302 to the exact destination (UTMs unchanged), logged in Clicks', async () => {
    const app = loadAppsScript();
    const st = app.state;
    signup(app, 'click@example.com');
    const tok = rowOf(st, 'click@example.com')[col.token];
    const fetchLog = [];
    const mocks = {
      fetch: bridgeFetch(app, fetchLog), getSecret: secrets,
      response: (o) => o, notFound: (o) => Object.assign({ status: 404 }, o), ok: (o) => Object.assign({ status: 200 }, o),
      badRequest: (o) => Object.assign({ status: 400 }, o), serverError: (o) => Object.assign({ status: 500 }, o), wixData: {}
    };
    const wix = loadWix('http-functions.js', mocks);
    const res = await wix.get_go({ query: { id: tok, e: '1', l: 'e1' } });
    assert.strictEqual(res.status, 302);
    assert.strictEqual(res.headers.Location, 'https://www.kygo.app/report-download?utm_source=email&utm_medium=nurture&utm_campaign=sowa-2026&utm_content=email-1');
    await wix.get_go({ query: { id: tok, e: '1', l: 'e1-img' } });
    await wix.get_go({ query: { id: tok, e: '1', l: 'e1' } });
    const clicks = st.sheets.Clicks.rows.slice(1);
    assert.strictEqual(clicks.length, 3);
    deq(clicks[0].slice(1), [tok, 1, 'e1', 'report-landing', 'wix']);
    assert.strictEqual(rowOf(st, 'click@example.com')[col.clicks], 3);
    assert.ok(!JSON.stringify(fetchLog).includes('click@example.com'), 'no email address leaves Wix on a click');
  });

  await test('unknown or mismatched link keys are rejected everywhere (no redirect, no log)', async () => {
    const app = loadAppsScript();
    const st = app.state;
    signup(app, 'evil@example.com');
    const tok = rowOf(st, 'evil@example.com')[col.token];
    const fetchLog = [];
    const wix = loadWix('http-functions.js', {
      fetch: bridgeFetch(app, fetchLog), getSecret: secrets, response: (o) => o,
      notFound: (o) => Object.assign({ status: 404 }, o), ok: (o) => o, badRequest: (o) => o, serverError: (o) => o, wixData: {}
    });
    for (const q of [{ id: tok, e: '1', l: 'https://evil.example/' }, { id: tok, e: '1', l: 'e9' }, { id: tok, e: '2', l: 'e1' },
      { id: tok, e: '1', l: '__proto__' }, { id: tok, e: '1', l: 'constructor' }, { id: tok, l: 'e1' }]) {
      const res = await wix.get_go({ query: q });
      assert.strictEqual(res.status, 404, JSON.stringify(q));
      assert.ok(!res.headers.Location);
    }
    assert.strictEqual(fetchLog.length, 0);
    // Apps Script side: direct POST with a bad key, and the doGet fallback
    const bad = JSON.parse(app.ctx.doPost({ parameter: {}, postData: { contents: JSON.stringify({ secret: SECRET, action: 'click', id: tok, e: '1', l: 'evil' }) } }).getContent());
    deq(bad, { ok: false, error: 'unknown_link' });
    const noAuth = JSON.parse(app.ctx.doPost({ parameter: {}, postData: { contents: JSON.stringify({ secret: 'x', action: 'click', id: tok, e: '1', l: 'e1' }) } }).getContent());
    assert.strictEqual(noAuth.error, 'unauthorized');
    const page = app.ctx.doGet({ parameter: { a: 'c', id: tok, e: '1', l: 'https://evil.example/' } });
    assert.strictEqual(page.title, 'Link not found');
    assert.ok(!page.html.includes('evil.example'));
    assert.strictEqual(st.sheets.Clicks.rows.length, 1, 'header only');
    // valid fallback click logs and offers the exact destination
    const okPage = app.ctx.doGet({ parameter: { a: 'c', id: tok, e: '2', l: 'e2' } });
    assert.ok(okPage.html.includes('href="https://www.kygo.app/tools/wearable-accuracy?utm_source=email&amp;utm_medium=nurture&amp;utm_campaign=sowa-2026&amp;utm_content=email-2"'));
    deq(st.sheets.Clicks.rows[1].slice(2, 6), [2, 'e2', 'report-landing', 'script']);
  });

  await test('Wix data.js hook: report-* sign-ups reach Apps Script end to end; other sources do not', async () => {
    const app = loadAppsScript();
    const fetchLog = [];
    const hook = loadWix('data.js', { fetch: bridgeFetch(app, fetchLog), getSecret: secrets });
    const item = { _id: 'x1', email: 'Hook@Example.com', source: 'report-landing', subscribedAt: new Date(app.state.clock) };
    const back = await hook.Subscribers_afterInsert(item, {});
    assert.strictEqual(back, item);
    assert.strictEqual(fetchLog.length, 1);
    const body = JSON.parse(fetchLog[0].opts.body);
    deq(Object.keys(body).sort(), ['createdAt', 'email', 'secret', 'source']);
    assert.strictEqual(fetchLog[0].opts.method, 'post');
    assert.strictEqual(rowOf(app.state, 'hook@example.com')[col.source], 'report-landing');
    assert.strictEqual(sentTo(app.state, 'hook@example.com').length, 1);
    for (const source of ['footer', 'blog-post', 'tool-wearable-accuracy', '', undefined]) {
      const it = { email: 'n@example.com', source };
      assert.strictEqual(await hook.Subscribers_afterInsert(it, {}), it);
    }
    assert.strictEqual(fetchLog.length, 1);
  });

  await test('Wix data.js hook never fails or blocks the insert (network error, bad reply, hang, missing secret)', async () => {
    const errors = [];
    const quiet = { error: (...a) => errors.push(a.join(' ')), log() {}, warn() {} };
    const item = { email: 'z@example.com', source: 'report-landing', subscribedAt: new Date() };
    const patchWait = (s) => s.replace('const HOOK_WAIT_MS = 2500;', 'const HOOK_WAIT_MS = 50;');
    const h1 = loadWix('data.js', { console: quiet, getSecret: secrets, fetch: async () => { throw new Error('ECONNRESET'); } });
    assert.strictEqual(await h1.Subscribers_afterInsert(item, {}), item);
    const h2 = loadWix('data.js', { console: quiet, getSecret: secrets, fetch: async () => ({ ok: true, status: 200, json: async () => ({ ok: false, error: 'unauthorized' }) }) });
    assert.strictEqual(await h2.Subscribers_afterInsert(item, {}), item);
    const h3 = loadWix('data.js', { console: quiet, getSecret: secrets, fetch: () => new Promise(() => {}) }, patchWait);
    const t0 = Date.now();
    assert.strictEqual(await h3.Subscribers_afterInsert(item, {}), item);
    assert.ok(Date.now() - t0 < 1000, 'returns after the wait cap');
    const h4 = loadWix('data.js', { console: quiet, getSecret: async () => undefined, fetch: async () => { throw new Error('should not fetch'); } });
    assert.strictEqual(await h4.Subscribers_afterInsert(item, {}), item);
    const h5 = loadWix('data.js', { console: quiet, getSecret: secrets, fetch: async () => ({ ok: false, status: 500, json: async () => null }) });
    assert.strictEqual(await h5.Subscribers_afterInsert(item, {}), item);
    await new Promise((r) => setTimeout(r, 20));
    assert.ok(errors.some((e) => /ECONNRESET/.test(e)) && errors.some((e) => /unauthorized/.test(e)) && errors.some((e) => /missing secret/.test(e)) && errors.some((e) => /HTTP 500/.test(e)), 'errors are logged: ' + errors.join(' / '));
  });

  await test('daily cap: sends stop at DAILY_CAP and the rest catch up on the next run; PAUSED stops all sends', () => {
    const app = loadAppsScript();
    const st = app.state;
    st.props.DAILY_CAP = '3';
    st.clock = etDateTime('2026-11-02', 10);
    for (let i = 0; i < 5; i++) signup(app, `q${i}@example.com`);
    assert.strictEqual(st.sent.length, 3);
    st.clock = etDateTime('2026-11-02', 16);
    app.ctx.dailyRun();
    assert.strictEqual(st.sent.length, 3, 'still capped the same day');
    st.clock = etDateTime('2026-11-03', 9);
    app.ctx.dailyRun();
    assert.strictEqual(st.sent.length, 5, 'two pending email 1s sent the next day, within the cap');
    st.props.PAUSED = 'true';
    st.clock = etDateTime('2026-11-04', 9);
    app.ctx.dailyRun();
    assert.strictEqual(st.sent.length, 5);
  });

  await test('copy, subjects, preview text, links and UTMs match the design canvas (Oct 26, 78 pages)', () => {
    const app = loadAppsScript();
    const wixLinks = loadWix('http-functions.js', { fetch() {}, getSecret: secrets, response() {}, notFound() {}, ok() {}, badRequest() {}, serverError() {}, wixData: {} }).NURTURE_LINKS;
    deq(JSON.parse(JSON.stringify(wixLinks)), JSON.parse(JSON.stringify(app.ctx.LINKS)), 'Wix and Apps Script link maps are identical');
    const token = 'a'.repeat(32);
    for (let n = 1; n <= 5; n++) {
      const canvas = fs.readFileSync(path.join(__dirname, 'fixtures', `Email${n}.dc.html`), 'utf8');
      const email = app.ctx.EMAILS[n - 1];
      const ps = [...canvas.matchAll(/<p style="([^"]*)">([\s\S]*?)<\/p>/g)].map((m) => decodeEntities(m[2].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim());
      assert.strictEqual(ps[0], email.subject, `email ${n} subject`);
      assert.strictEqual(ps[1], email.preheader, `email ${n} preview text`);
      const html = app.ctx.renderHtml_(email, token);
      const text = visibleText(html);
      for (const p of ps.slice(2)) assert.ok(text.includes(p), `email ${n} is missing canvas copy: "${p}"`);
      for (const label of [...canvas.matchAll(/min-height: 48px[^>]*>([^<]+)<\/a>/g)].map((m) => m[1].trim())) assert.ok(text.includes(label), `email ${n} button "${label}"`);
      // every canvas destination (except the placeholder unsubscribe) is a tracked key with the same URL
      const hrefs = [...canvas.matchAll(/href="(https:\/\/[^"]+)"/g)].map((m) => decodeEntities(m[1])).filter((h) => !/fonts\.googleapis|\/unsubscribe$/.test(h));
      const keys = [...html.matchAll(/_functions\/go\?id=a{32}&amp;e=(\d)&amp;l=([\w-]+)/g)].map((m) => { assert.strictEqual(m[1], String(n)); return app.ctx.LINKS[m[2]]; });
      deq(keys.sort(), hrefs.sort(), `email ${n} link destinations`);
      for (const src of [...canvas.matchAll(/data-email-src="([^"]+)"/g)].map((m) => m[1])) assert.ok(html.includes(`src="${src}"`), `email ${n} image ${src}`);
      for (const alt of [...canvas.matchAll(/alt="([^"]+)"/g)].map((m) => m[1])) assert.ok(html.includes(`alt="${alt.replace(/'/g, "'")}"`), `email ${n} alt`);
      assert.ok(text.includes('Kygo Health LLC, Jersey City NJ') && text.includes('Unsubscribe'), `email ${n} footer`);
      assert.ok(html.includes(`href="${WEBAPP}?a=u&amp;id=${token}"`), `email ${n} footer unsubscribe link`);
      // style rules: no em or en dashes, no double hyphens, anywhere in the HTML or the plain text
      const plain = app.ctx.renderText_(email, token);
      for (const s of [html, plain]) {
        assert.ok(!/[—–]/.test(s), `email ${n} has an em/en dash`);
        assert.ok(!s.includes('--'), `email ${n} has a double hyphen`);
      }
      assert.ok(!/fonts\.googleapis|@import|<link/i.test(html), `email ${n} must not need web fonts`);
      assert.ok(!/<script/i.test(html), `email ${n} has no script`);
      fs.writeFileSync(path.join(OUT, `email${n}.html`), html);
      fs.writeFileSync(path.join(OUT, `email${n}.txt`), plain);
    }
    assert.ok(app.ctx.EMAILS[0].preheader.startsWith('78 pages'), 'current canvas (78 pages)');
    assert.ok(app.ctx.LINKS.e1.startsWith('https://www.kygo.app/report-download?'), 'email 1 goes to /report-download, not the PDF');
    assert.ok(!Object.values(app.ctx.LINKS).some((u) => /\.pdf/i.test(u)));
  });

  await test('Summary formulas cover per-email sent, unique clickers, click rate, unsubscribes and totals by source', () => {
    const app = loadAppsScript();
    const sum = app.state.sheets.Summary.rows;
    deq(sum[0], ['Email', 'Subject', 'Sent', 'Unique clickers', 'Click rate', 'Unsubscribes']);
    for (let n = 1; n <= 5; n++) {
      assert.strictEqual(sum[n][0], n);
      assert.strictEqual(sum[n][4], `=IF(C${n + 1}=0,0,D${n + 1}/C${n + 1})`);
      assert.strictEqual(sum[n][5], `=COUNTIF(Subscribers!M2:M,${n})`);
    }
    assert.strictEqual(sum[6][0], 'Total');
    deq(sum[9], ['By signup source', 'Sign-ups', 'Active', 'Completed', 'Unsubscribed', 'Bounced', 'Clickers', 'Click rate']);
    assert.ok(sum[10].every((f) => String(f).startsWith('=')));
  });

  // ---- report ----
  const pass = results.filter((r) => r[0] === 'PASS').length;
  const lines = results.map((r) => r.join('  '));
  lines.push('', `${pass}/${results.length} passed`, 'Run at ' + new Date().toISOString() + ' on Node ' + process.version);
  fs.writeFileSync(path.join(__dirname, 'results.txt'), lines.join('\n') + '\n');
  console.log(lines.join('\n'));
  process.exit(pass === results.length ? 0 : 1);
})();
