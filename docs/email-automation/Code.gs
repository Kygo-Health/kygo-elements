/**
 * Kygo Health: State of Wearable Accuracy 2026 nurture emails
 * Google Apps Script, run from ryan@kygo.app. One file, no libraries.
 *
 * Flow
 *   Wix Subscribers_afterInsert hook (backend/data.js) POSTs {secret, email, source, createdAt}
 *   to this web app for every source starting "report-".
 *   doPost      : checks the secret, dedupes on email, appends a Sheet row, sends email 1.
 *   dailyRun    : (time trigger) bounce + mailto-unsubscribe check, then sends emails 2 to 5
 *                 when due (day 2, 5, 9, 14). Idempotent: a sent cell is never sent again.
 *   Clicks      : email links point at https://www.kygo.app/_functions/go?id=&e=&l= (Wix
 *                 http-functions.js), which 302-redirects to the fixed destination and POSTs
 *                 {action:'click'} here. Apps Script itself cannot send a 302, so doGet?a=c is
 *                 only a fallback that logs and shows a one-tap "Continue" page.
 *   Unsubscribe : doGet?a=u&id=<token> (link), doPost?a=u&id=<token> (RFC 8058 one-click),
 *                 and mail to ryan@kygo.app with subject "unsubscribe <token>".
 *
 * Script Properties (Project Settings > Script Properties)
 *   SHARED_SECRET  required. Same value as the Wix secret SOWA_NURTURE_SECRET.
 *   SHEET_ID       required. The tracking Sheet's ID.
 *   WEBAPP_URL     required after deploying. The web app /exec URL (used for unsubscribe links).
 *   LINK_BASE      optional. Click-redirect base. Default https://www.kygo.app/_functions/go.
 *                  Set it to the WEBAPP_URL to use the Apps Script fallback instead.
 *   DAILY_CAP      optional. Max emails per day across sign-ups and the daily job. Default 1400.
 *   PAUSED         optional. "true" stops all sending (sign-ups are still recorded).
 *
 * Gmail Advanced Service (Gmail API v1) must be enabled as "Gmail".
 */

var CONFIG = {
  FROM_NAME: 'Ryan at Kygo',
  FROM_EMAIL: 'ryan@kygo.app',
  TIMEZONE: 'America/New_York',
  SOURCE_PREFIX: 'report-',
  SCHEDULE_DAYS: [0, 2, 5, 9, 14],
  DEFAULT_DAILY_CAP: 1400,
  DEFAULT_LINK_BASE: 'https://www.kygo.app/_functions/go',
  DAILY_HOUR: 9,
  MAX_RUN_MS: 270000,
  ADDRESS_LINE: 'Kygo Health LLC, Jersey City NJ',
  SHEET_SUBSCRIBERS: 'Subscribers',
  SHEET_CLICKS: 'Clicks',
  SHEET_SUMMARY: 'Summary'
};

var HEADERS = ['token', 'email', 'source', 'signup_at', 'status',
  'email1_sent', 'email2_sent', 'email3_sent', 'email4_sent', 'email5_sent',
  'clicks', 'unsubscribed_at', 'unsub_after_email', 'bounced_at', 'last_error'];
var COL = { token: 1, email: 2, source: 3, signupAt: 4, status: 5, sent1: 6, clicks: 11,
  unsubscribedAt: 12, unsubAfter: 13, bouncedAt: 14, lastError: 15 };
var NCOLS = HEADERS.length;
var CLICK_HEADERS = ['clicked_at', 'token', 'email_no', 'link_key', 'source', 'via'];

var UTM = '?utm_source=email&utm_medium=nurture&utm_campaign=sowa-2026&utm_content=';

/** The only destinations a tracked link can reach. Mirrored in Wix http-functions.js (get_go). */
var LINKS = {
  'e1-img': 'https://www.kygo.app/report-download' + UTM + 'email-1-image',
  'e1': 'https://www.kygo.app/report-download' + UTM + 'email-1',
  'e2-img': 'https://www.kygo.app/tools/wearable-accuracy' + UTM + 'email-2-image',
  'e2': 'https://www.kygo.app/tools/wearable-accuracy' + UTM + 'email-2',
  'e3-img': 'https://www.kygo.app/best-wearables' + UTM + 'email-3-image',
  'e3': 'https://www.kygo.app/best-wearables' + UTM + 'email-3',
  'e4-img': 'https://app.kygo.app' + UTM + 'email-4-image',
  'e4': 'https://app.kygo.app' + UTM + 'email-4',
  'e5-img': 'https://app.kygo.app' + UTM + 'email-5-image',
  'e5-ios': 'https://kygo.app/iOSemail' + UTM + 'email-5-ios',
  'e5-android': 'https://kygo.app/androidemail' + UTM + 'email-5-android',
  'e5-web': 'https://app.kygo.app' + UTM + 'email-5-web'
};

var IMG = 'https://static.wixstatic.com/media/';

/** Approved copy from the design canvas (Email1.dc.html to Email5.dc.html, Oct 26 version). */
var EMAILS = [
  {
    n: 1,
    subject: 'Your State of Wearable Accuracy 2026 report',
    preheader: '78 pages, seven brands, one rule: the numbers decide.',
    blocks: [
      { p: 'Hi,' },
      { p: 'Here\'s the report you asked for.' },
      { img: IMG + '273a63_ea4081473bdf4955bfa6aeb4128346df~mv2.png', alt: 'State of Wearable Accuracy 2026 report cover', link: 'e1-img', wide: true },
      { btn: 'Download the State of Wearable Accuracy 2026', link: 'e1' },
      { p: 'A quick way to read it: start with the verdict on page 7, find your own brand, then jump to the metrics you actually use. Every figure comes from the study\'s own tables, and studies a brand paid for are marked †.' },
      { p: 'The finding I keep coming back to is how much sleep trackers miss when you\'re awake in bed. Apple Watch Series 8 placed 2nd on sleep stages, yet caught 52.4% of awake time in a lab study (Robbins 2024, Oura-funded). Garmin Forerunner 245 Music caught 27% and counted 43.8 extra minutes of sleep. If your sleep total looks generous, that\'s a likely reason.' },
      { p: 'Over the next two weeks I\'ll send four short follow-ups: the full medal table, a pick by goal if you\'re shopping, why an accurate number is only half the answer, and what Kygo does with yours.' },
      { p: 'Ryan' }
    ]
  },
  {
    n: 2,
    subject: 'No wearable won more than 4 of the 10 golds',
    preheader: 'The full podium, metric by metric, in one email.',
    blocks: [
      { p: 'Hi,' },
      { p: 'Most people buy a wearable for one reason, then trust it for everything. The rankings show why that doesn\'t hold up. Here\'s the podium for the ten ranked metrics:' },
      { img: IMG + '273a63_cd7028c3c28249178f28a7096850e64e~mv2.png', alt: 'Medal table: podium places by metric and brand', link: 'e2-img', wide: true },
      { list: [
        ['Sleep stages:', 'Oura, Apple Watch, Fitbit / Google'],
        ['Sleep timing:', 'Oura, Fitbit / Google, Apple Watch'],
        ['HRV:', 'Oura, WHOOP, Garmin'],
        ['Resting heart rate:', 'Oura, Polar, WHOOP'],
        ['Exercise heart rate:', 'Apple Watch, Garmin, Fitbit / Google'],
        ['Blood oxygen:', 'Apple Watch, Samsung, Garmin'],
        ['Steps:', 'Garmin, Apple Watch, Samsung'],
        ['Calories:', 'Fitbit / Google, Samsung, Apple Watch (no brand came within 9% on the max treadmill test)'],
        ['VO2 max:', 'Garmin, Fitbit / Google, Apple Watch'],
        ['Breathing rate:', 'Fitbit / Google, WHOOP, no qualifying third']
      ], gap: 6 },
      { p: 'Skin temperature isn\'t ranked, because no brand\'s sensor has an independent test against a thermometer.' },
      { p: 'Oura takes all four overnight golds and places on nothing else. Apple places on seven metrics, more than any brand, without a sleep gold.' },
      { p: 'No brand wins every metric. Kygo connects them all and uses the most accurate source for each.' },
      { btn: 'See the figures behind every placing', link: 'e2' },
      { p: 'Ryan' }
    ]
  },
  {
    n: 3,
    subject: 'Buying a wearable? Start with what you want to measure',
    preheader: 'The most accurate pick for sleep, recovery, training and more.',
    blocks: [
      { p: 'Hi,' },
      { p: 'If you\'re shopping for a wearable, the hard part is knowing which one measures the thing you care about. The most popular device isn\'t always the most accurate one for your goal.' },
      { img: IMG + '273a63_035cb6474776470a849f08eafdc352c8~mv2.png', alt: 'Buyer\'s guide: top wearable picks by goal', link: 'e3-img', wide: true },
      { p: 'The report\'s buyer\'s guide scores each brand by goal:' },
      { list: [
        ['Sleep:', 'Oura, 1st on sleep stages and sleep timing.'],
        ['Recovery:', 'Oura again, 1st on HRV and resting heart rate, with WHOOP next.'],
        ['Training:', 'Garmin, 1st on steps and VO2 max. One catch: its 6.7% VO2 max error was a Forerunner 245 with a chest strap. Wrist only, a Vivoactive 4S was 56% off (median, 207 mostly older women).'],
        ['Health checks:', 'Apple Watch for blood oxygen, Fitbit / Google for breathing rate.'],
        ['Calorie tracking:', 'Fitbit / Google, though no brand came within 9% on the max treadmill test.']
      ], gap: 10 },
      { p: 'The guide doesn\'t weigh price, comfort, battery life or subscriptions, so add those yourself.' },
      { btn: 'Find the best wearable for your goal', link: 'e3' },
      { p: 'Ryan' }
    ]
  },
  {
    n: 4,
    subject: 'Your HRV dropped. Was it the coffee?',
    preheader: 'Even the most accurate ring can\'t tell you why a number moved.',
    blocks: [
      { p: 'Hi,' },
      { p: 'Say your HRV drops three nights in a row. Even on the most accurate HRV tracker in the report, Oura Ring 4 at 5.96% off a chest-strap ECG (Dial 2025, independent, 13 adults over 139 nights), the number only tells you it dropped. It can\'t tell you whether it was the afternoon coffee, the second glass of wine, or the short night before.' },
      { img: IMG + '273a63_41a3d623479d413291e8aa7a44d6cdc5~mv2.png', alt: 'Kygo app showing late caffeine as the biggest drag on HRV', link: 'e4-img', wide: false },
      { p: 'That\'s where most people get stuck. You suspect something in your diet is affecting how you feel, but you can\'t figure out what.' },
      { p: 'The report makes one point that helps here. A device that\'s a little off still shows you what changed, because you compare the same sensor with itself, night after night. Trends work even when single readings don\'t.' },
      { p: 'Kygo lines up what you eat with your sleep, HRV and resting heart rate, and shows which foods and habits move your numbers. Food logging is free.' },
      { btn: 'Start logging on the web', link: 'e4' },
      { p: 'Ryan' }
    ]
  },
  {
    n: 5,
    subject: 'Use each wearable for what it\'s best at',
    preheader: 'Kygo Pro, free for 7 days.',
    blocks: [
      { p: 'Hi,' },
      { p: 'If you read the medal table and realized your device is strong on some metrics and weak on others, you\'re reading it right. Oura Ring wins HRV. Garmin wins steps. Apple Watch wins exercise heart rate.' },
      { img: IMG + '273a63_ff0ebaf660ad419290ca28a0a12132f0~mv2.png', alt: 'Kygo app logging a meal with Oura and Apple Health connected', link: 'e5-img', wide: false },
      { p: 'No brand wins every metric. Kygo connects them all and uses the most accurate source for each.' },
      { p: 'It connects Oura, Apple Health, Health Connect, Fitbit, Garmin, WHOOP and Polar at the same time, picks the most accurate source for each metric automatically, then correlates those numbers with what you eat. If you only wear one device, you still get the food side.' },
      { p: 'Food logging is free, and Kygo Pro comes with a 7-day free trial.' },
      { stores: 'Start your free trial:', buttons: [['iPhone', 'e5-ios'], ['Android', 'e5-android'], ['Web', 'e5-web']] },
      { p: 'Thanks for reading the report.' },
      { p: 'Ryan' }
    ]
  }
];

/* ------------------------------------------------------------------ */
/* Web app entry points                                                */
/* ------------------------------------------------------------------ */

function doPost(e) {
  var p = (e && e.parameter) || {};
  // RFC 8058 one-click unsubscribe: Gmail POSTs "List-Unsubscribe=One-Click" to the https URL.
  if (p.a === 'u') {
    if (isToken_(p.id)) withLock_(function () { return unsubscribe_(p.id, 'one-click'); });
    return ContentService.createTextOutput('ok');
  }
  var body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '');
  } catch (err) {
    return json_({ ok: false, error: 'bad_json' });
  }
  if (!body || !secretOk_(body.secret)) return json_({ ok: false, error: 'unauthorized' });
  if (body.action === 'click') {
    var r = withLock_(function () { return logClick_(String(body.id || ''), String(body.e || ''), String(body.l || ''), 'wix'); });
    return json_(r || { ok: false, error: 'busy' });
  }
  var res = withLock_(function () { return handleSignup_(body); });
  return json_(res || { ok: false, error: 'busy' });
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.a === 'u') {
    var r = isToken_(p.id) ? withLock_(function () { return unsubscribe_(p.id, 'link'); }) : null;
    if (r && r.ok) {
      return page_('You are unsubscribed',
        '<p>You will not get any more State of Wearable Accuracy emails from Kygo.</p>' +
        '<p><a href="https://www.kygo.app/" target="_top">Back to kygo.app</a></p>');
    }
    return page_('Link not recognized',
      '<p>We could not find that subscription. To be removed, reply to any of our emails with the word unsubscribe and we will take you off the list.</p>');
  }
  if (p.a === 'c') {
    var key = String(p.l || '');
    var dest = linkDest_(key, String(p.e || ''));
    if (!dest) return page_('Link not found', '<p><a href="https://www.kygo.app/" target="_top">Go to kygo.app</a></p>');
    if (isToken_(p.id)) withLock_(function () { return logClick_(p.id, String(p.e), key, 'script'); });
    // Apps Script web apps cannot return a 302 and may not auto-navigate the top window,
    // so the fallback is a one-tap link. The Wix /_functions/go route does the real redirect.
    return page_('Continue to Kygo',
      '<p><a href="' + esc_(dest) + '" target="_top" style="display:inline-block;padding:14px 22px;border-radius:10px;background:#22c55e;color:#0f172a;font-weight:600;text-decoration:none">Continue</a></p>');
  }
  return page_('Kygo', '<p><a href="https://www.kygo.app/" target="_top">kygo.app</a></p>');
}

/* ------------------------------------------------------------------ */
/* Sign-up                                                             */
/* ------------------------------------------------------------------ */

function handleSignup_(body) {
  var email = String(body.email || '').trim().toLowerCase();
  var source = String(body.source || '').trim().slice(0, 60);
  if (!/^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/.test(email) || email.length > 254) {
    return { ok: false, error: 'invalid_email' };
  }
  if (source.indexOf(CONFIG.SOURCE_PREFIX) !== 0) return { ok: false, error: 'not_a_report_source' };

  var sh = sheet_(CONFIG.SHEET_SUBSCRIBERS);
  if (findRow_(sh, COL.email, email)) return { ok: true, duplicate: true };

  var now = now_();
  var signupAt = now;
  if (body.createdAt) {
    var d = new Date(body.createdAt);
    if (!isNaN(d.getTime()) && d.getTime() <= now.getTime() && now.getTime() - d.getTime() < 86400000) signupAt = d;
  }
  var row = [newToken_(), email, source, signupAt, 'active', '', '', '', '', '', 0, '', '', '', ''];
  sh.appendRow(row);
  SpreadsheetApp.flush();
  var rowIndex = sh.getLastRow();
  var sent = sendEmailToRow_(sh, rowIndex, 1);
  return { ok: true, duplicate: false, sent: sent };
}

/* ------------------------------------------------------------------ */
/* Daily job                                                           */
/* ------------------------------------------------------------------ */

/** Run by the daily time-driven trigger. Safe to run again at any time. */
function dailyRun() {
  var started = Date.now();
  checkInbox_();
  sendDue_(started);
}

function sendDue_(started) {
  var sh = sheet_(CONFIG.SHEET_SUBSCRIBERS);
  var last = sh.getLastRow();
  if (last < 2) return { sent: 0 };
  var values = sh.getRange(2, 1, last - 1, NCOLS).getValues();
  var sent = 0;
  for (var i = 0; i < values.length; i++) {
    if (Date.now() - started > CONFIG.MAX_RUN_MS) break; // the next run picks up the rest
    var n = nextDue_(values[i], now_());
    if (!n) continue;
    if (sentToday_() >= dailyCap_() || isPaused_()) break;
    var rowIndex = i + 2;
    var token = values[i][COL.token - 1];
    var ok = withLock_(function () {
      var fresh = sh.getRange(rowIndex, 1, 1, NCOLS).getValues()[0];
      if (fresh[COL.token - 1] !== token || nextDue_(fresh, now_()) !== n) return false; // changed since the snapshot
      return sendEmailToRow_(sh, rowIndex, n);
    });
    if (ok) sent++;
  }
  return { sent: sent };
}

/**
 * The lowest unsent email number that is due for this row, or 0. At most one per run per row.
 * Due counts calendar days in New York time: a day-2 email goes out on the daily run two
 * calendar days after the sign-up date, whatever hour the person signed up.
 */
function nextDue_(r, now) {
  if (r[COL.status - 1] !== 'active') return 0;
  var signup = toDate_(r[COL.signupAt - 1]);
  if (!signup) return 0;
  var age = daysBetween_(signup, now);
  for (var n = 1; n <= 5; n++) {
    if (r[COL.sent1 + n - 2] !== '' && r[COL.sent1 + n - 2] != null) continue;
    return age >= CONFIG.SCHEDULE_DAYS[n - 1] ? n : 0;
  }
  return 0;
}

/** Whole calendar days from a to b in CONFIG.TIMEZONE (DST safe). */
function daysBetween_(a, b) {
  var fa = Utilities.formatDate(a, CONFIG.TIMEZONE, 'yyyy-MM-dd');
  var fb = Utilities.formatDate(b, CONFIG.TIMEZONE, 'yyyy-MM-dd');
  return Math.round((Date.parse(fb + 'T00:00:00Z') - Date.parse(fa + 'T00:00:00Z')) / 86400000);
}

/* ------------------------------------------------------------------ */
/* Sending                                                             */
/* ------------------------------------------------------------------ */

/** Sends email n to the row if it is still unsent and allowed. Caller holds the lock. */
function sendEmailToRow_(sh, rowIndex, n) {
  var r = sh.getRange(rowIndex, 1, 1, NCOLS).getValues()[0];
  if (r[COL.status - 1] !== 'active') return false;
  var sentCell = r[COL.sent1 + n - 2];
  if (sentCell !== '' && sentCell != null) return false;
  for (var k = 1; k < n; k++) {
    var prev = r[COL.sent1 + k - 2];
    if (prev === '' || prev == null) return false;
  }
  if (isPaused_() || sentToday_() >= dailyCap_()) return false;

  var token = r[COL.token - 1];
  var email = EMAILS[n - 1];
  try {
    var raw = buildMime_(r[COL.email - 1], email, token);
    Gmail.Users.Messages.send({ raw: Utilities.base64EncodeWebSafe(raw, Utilities.Charset.UTF_8) }, 'me');
  } catch (err) {
    sh.getRange(rowIndex, COL.lastError).setValue('email ' + n + ': ' + String(err && err.message || err).slice(0, 300));
    return false;
  }
  sh.getRange(rowIndex, COL.sent1 + n - 1).setValue(now_());
  if (n === 5) sh.getRange(rowIndex, COL.status).setValue('completed');
  if (r[COL.lastError - 1]) sh.getRange(rowIndex, COL.lastError).setValue('');
  SpreadsheetApp.flush();
  bumpSentToday_();
  return true;
}

function buildMime_(to, email, token) {
  var html = renderHtml_(email, token);
  var text = renderText_(email, token);
  var boundary = 'kygo_' + Utilities.getUuid().replace(/-/g, '');
  var lines = [
    'From: "' + CONFIG.FROM_NAME + '" <' + CONFIG.FROM_EMAIL + '>',
    'To: <' + to + '>',
    'Reply-To: ' + CONFIG.FROM_EMAIL,
    'Subject: ' + encodeHeader_(email.subject),
    'MIME-Version: 1.0',
    'List-Unsubscribe: <mailto:' + CONFIG.FROM_EMAIL + '?subject=unsubscribe%20' + token + '>, <' + unsubUrl_(token) + '>',
    'List-Unsubscribe-Post: List-Unsubscribe=One-Click',
    'Content-Type: multipart/alternative; boundary="' + boundary + '"',
    '',
    '--' + boundary,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrap76_(Utilities.base64Encode(text, Utilities.Charset.UTF_8)),
    '--' + boundary,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrap76_(Utilities.base64Encode(html, Utilities.Charset.UTF_8)),
    '--' + boundary + '--',
    ''
  ];
  return lines.join('\r\n');
}

function encodeHeader_(s) {
  if (/^[\x20-\x7e]*$/.test(s)) return s;
  return '=?UTF-8?B?' + Utilities.base64Encode(s, Utilities.Charset.UTF_8) + '?=';
}

function wrap76_(s) {
  return (s.match(/.{1,76}/g) || ['']).join('\r\n');
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

var FONT = "'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
var HEAD_FONT = "'Space Grotesk','DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

function trackUrl_(token, n, key) {
  return linkBase_() + '?id=' + encodeURIComponent(token) + '&e=' + n + '&l=' + encodeURIComponent(key);
}

function unsubUrl_(token) {
  return webAppUrl_() + '?a=u&id=' + encodeURIComponent(token);
}

function renderHtml_(email, token) {
  var n = email.n;
  var body = '';
  var blocks = email.blocks;
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    var mb = i === blocks.length - 1 ? 0 : 18;
    if (b.p != null) {
      body += '<p style="margin:0 0 ' + mb + 'px 0;font-family:' + FONT + ';font-size:16px;line-height:26px;color:#475569;">' + esc_(b.p) + '</p>';
    } else if (b.list) {
      for (var j = 0; j < b.list.length; j++) {
        var gap = j === b.list.length - 1 ? mb : b.gap;
        body += '<p style="margin:0 0 ' + gap + 'px 0;font-family:' + FONT + ';font-size:16px;line-height:26px;color:#475569;">' +
          '<strong style="color:#0f172a;font-weight:700;">' + esc_(b.list[j][0]) + '</strong> ' + esc_(b.list[j][1]) + '</p>';
      }
    } else if (b.img) {
      var w = b.wide ? 496 : 280;
      var h = b.wide ? 279 : 399;
      var imgStyle = b.wide
        ? 'display:block;width:100%;max-width:496px;height:auto;border:1px solid #e2e8f0;border-radius:12px;'
        : 'display:block;width:280px;max-width:100%;height:auto;border:0;';
      body += '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 ' + mb + 'px 0;"><tr><td align="center">' +
        '<a href="' + esc_(trackUrl_(token, n, b.link)) + '" target="_blank" style="text-decoration:none;">' +
        '<img src="' + esc_(b.img) + '" alt="' + esc_(b.alt) + '" width="' + w + '" height="' + h + '" style="' + imgStyle + '"></a>' +
        '</td></tr></table>';
    } else if (b.btn) {
      body += '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 ' + mb + 'px 0;"><tr>' +
        '<td bgcolor="#22c55e" style="border-radius:10px;background:#22c55e;">' +
        '<a href="' + esc_(trackUrl_(token, n, b.link)) + '" target="_blank" style="display:inline-block;padding:14px 22px;font-family:' + FONT + ';font-size:15px;font-weight:600;line-height:20px;color:#0f172a;text-decoration:none;border-radius:10px;">' +
        esc_(b.btn) + '</a></td></tr></table>';
    } else if (b.stores) {
      body += '<p style="margin:0 0 12px 0;font-family:' + FONT + ';font-size:16px;line-height:26px;color:#475569;"><strong style="color:#0f172a;font-weight:700;">' + esc_(b.stores) + '</strong></p>';
      body += '<table role="presentation" class="k-stores" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 ' + mb + 'px 0;"><tr>';
      for (var s = 0; s < b.buttons.length; s++) {
        if (s > 0) body += '<td class="k-gap" width="12" style="width:12px;font-size:0;line-height:0;">&nbsp;</td>';
        body += '<td class="k-store" width="33%" align="center" bgcolor="#22c55e" style="border-radius:10px;background:#22c55e;">' +
          '<a href="' + esc_(trackUrl_(token, n, b.buttons[s][1])) + '" target="_blank" style="display:block;padding:14px 0;font-family:' + FONT + ';font-size:15px;font-weight:600;line-height:20px;color:#0f172a;text-decoration:none;text-align:center;border-radius:10px;">' +
          esc_(b.buttons[s][0]) + '</a></td>';
      }
      body += '</tr></table>';
    }
  }

  return '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="x-apple-disable-message-reformatting">' +
    '<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">' +
    '<title>' + esc_(email.subject) + '</title>' +
    '<style>a{color:#15803d}@media (max-width:620px){.k-wrap{padding:16px 10px!important}.k-pad{padding:22px 18px!important}.k-hdr{padding:16px 18px!important}' +
    '.k-store{display:block!important;width:100%!important;margin:0 0 10px 0!important}.k-gap{display:none!important}}</style>' +
    '</head><body style="margin:0;padding:0;background:#f8fafc;">' +
    '<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:#f8fafc;">' +
    esc_(email.preheader) + new Array(40).join('&#8199;&#847; ') + '</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="background:#f8fafc;"><tr>' +
    '<td align="center" class="k-wrap" style="padding:28px 24px;">' +
    '<table role="presentation" width="552" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:552px;background:#ffffff;border:1.5px solid #e2e8f0;border-radius:18px;border-collapse:separate;">' +
    '<tr><td class="k-hdr" style="padding:18px 28px;border-bottom:1px solid #e2e8f0;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td align="left" style="font-family:' + HEAD_FONT + ';font-size:20px;line-height:26px;font-weight:700;letter-spacing:-0.4px;color:#0f172a;">Kygo</td>' +
    '<td align="right" style="font-family:' + FONT + ';font-size:13px;line-height:20px;color:#475569;">From Ryan at Kygo</td>' +
    '</tr></table></td></tr>' +
    '<tr><td class="k-pad" style="padding:28px;">' + body + '</td></tr>' +
    '</table>' +
    '<table role="presentation" width="552" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:552px;"><tr>' +
    '<td align="center" style="padding:18px 0 0 0;font-family:' + FONT + ';font-size:12px;line-height:18px;color:#475569;">' +
    esc_(CONFIG.ADDRESS_LINE) + '<br>' +
    '<a href="' + esc_(unsubUrl_(token)) + '" target="_blank" style="color:#15803d;text-decoration:underline;">Unsubscribe</a>' +
    '</td></tr></table>' +
    '</td></tr></table></body></html>';
}

function renderText_(email, token) {
  var out = [];
  var n = email.n;
  email.blocks.forEach(function (b) {
    if (b.p != null) out.push(b.p);
    else if (b.list) out.push(b.list.map(function (it) { return it[0] + ' ' + it[1]; }).join('\n'));
    else if (b.btn) out.push(b.btn + ':\n' + trackUrl_(token, n, b.link));
    else if (b.stores) out.push(b.stores + '\n' + b.buttons.map(function (x) { return x[0] + ': ' + trackUrl_(token, n, x[1]); }).join('\n'));
  });
  out.push('________');
  out.push(CONFIG.ADDRESS_LINE + '\nUnsubscribe: ' + unsubUrl_(token));
  return out.join('\n\n') + '\n';
}

/* ------------------------------------------------------------------ */
/* Clicks and unsubscribes                                             */
/* ------------------------------------------------------------------ */

/** Destination for a link key, or null. The email number must match the key's own email. */
function linkDest_(key, e) {
  if (!Object.prototype.hasOwnProperty.call(LINKS, key)) return null;
  if (!/^[1-5]$/.test(e) || key.charAt(1) !== e) return null;
  return LINKS[key];
}

function logClick_(token, e, key, via) {
  if (!linkDest_(key, e)) return { ok: false, error: 'unknown_link' };
  if (!isToken_(token)) return { ok: false, error: 'bad_token' };
  var sh = sheet_(CONFIG.SHEET_SUBSCRIBERS);
  var rowIndex = findRow_(sh, COL.token, token);
  if (!rowIndex) return { ok: false, error: 'unknown_token' };
  var r = sh.getRange(rowIndex, 1, 1, NCOLS).getValues()[0];
  sheet_(CONFIG.SHEET_CLICKS).appendRow([now_(), token, Number(e), key, r[COL.source - 1], via]);
  sh.getRange(rowIndex, COL.clicks).setValue((Number(r[COL.clicks - 1]) || 0) + 1);
  SpreadsheetApp.flush();
  return { ok: true };
}

function unsubscribe_(token, via) {
  var sh = sheet_(CONFIG.SHEET_SUBSCRIBERS);
  var rowIndex = findRow_(sh, COL.token, token);
  if (!rowIndex) return { ok: false, error: 'unknown_token' };
  return markUnsubscribed_(sh, rowIndex, via);
}

function markUnsubscribed_(sh, rowIndex, via) {
  var r = sh.getRange(rowIndex, 1, 1, NCOLS).getValues()[0];
  if (r[COL.unsubscribedAt - 1]) return { ok: true, already: true };
  var lastSent = 0;
  for (var n = 1; n <= 5; n++) if (r[COL.sent1 + n - 2]) lastSent = n;
  sh.getRange(rowIndex, COL.unsubscribedAt).setValue(now_());
  sh.getRange(rowIndex, COL.unsubAfter).setValue(lastSent);
  if (r[COL.status - 1] !== 'bounced') sh.getRange(rowIndex, COL.status).setValue('unsubscribed');
  SpreadsheetApp.flush();
  return { ok: true, via: via };
}

/* ------------------------------------------------------------------ */
/* Inbox: bounces and mailto unsubscribes                              */
/* ------------------------------------------------------------------ */

function checkInbox_() {
  var props = PropertiesService.getScriptProperties();
  var nowSec = Math.floor(now_().getTime() / 1000);
  var last = Number(props.getProperty('LAST_INBOX_CHECK')) || (nowSec - 3 * 86400);
  var after = last - 3600; // one hour of overlap; marking is idempotent
  var bounced = 0, unsubscribed = 0;

  var bounceQ = 'in:anywhere {from:mailer-daemon from:postmaster subject:"delivery status notification" subject:undeliverable subject:"mail delivery failed" subject:"delivery failure" subject:"returned mail"} after:' + after;
  listMessageIds_(bounceQ).forEach(function (id) {
    var msg = readRaw_(id);
    if (!msg) return;
    var subject = header_(msg.head, 'Subject');
    if (/delay|delayed|will retry/i.test(subject)) return; // temporary, not a bounce
    failedRecipients_(msg).forEach(function (addr) {
      withLock_(function () {
        var sh = sheet_(CONFIG.SHEET_SUBSCRIBERS);
        var rowIndex = findRow_(sh, COL.email, addr);
        if (!rowIndex) return;
        var r = sh.getRange(rowIndex, 1, 1, NCOLS).getValues()[0];
        if (r[COL.bouncedAt - 1] || !r[COL.sent1 - 1]) return; // already marked, or never emailed
        sh.getRange(rowIndex, COL.bouncedAt).setValue(now_());
        sh.getRange(rowIndex, COL.status).setValue('bounced');
        SpreadsheetApp.flush();
        bounced++;
      });
    });
  });

  var unsubQ = 'in:anywhere to:' + CONFIG.FROM_EMAIL + ' subject:unsubscribe -from:' + CONFIG.FROM_EMAIL + ' after:' + after;
  listMessageIds_(unsubQ).forEach(function (id) {
    var msg = readRaw_(id);
    if (!msg) return;
    var subject = header_(msg.head, 'Subject');
    var m = /unsubscribe[\s_-]*([a-f0-9]{32})/i.exec(subject);
    var from = (/<([^>]+)>/.exec(header_(msg.head, 'From')) || [null, header_(msg.head, 'From')])[1];
    withLock_(function () {
      var sh = sheet_(CONFIG.SHEET_SUBSCRIBERS);
      var rowIndex = m ? findRow_(sh, COL.token, m[1].toLowerCase()) : 0;
      if (!rowIndex && from) rowIndex = findRow_(sh, COL.email, String(from).trim().toLowerCase());
      if (!rowIndex) return;
      var res = markUnsubscribed_(sh, rowIndex, 'mailto');
      if (res.ok && !res.already) unsubscribed++;
    });
  });

  props.setProperty('LAST_INBOX_CHECK', String(nowSec));
  return { bounced: bounced, unsubscribed: unsubscribed };
}

function listMessageIds_(q) {
  var ids = [], pageToken = null, pages = 0;
  do {
    var opt = { q: q, maxResults: 100 };
    if (pageToken) opt.pageToken = pageToken;
    var res = Gmail.Users.Messages.list('me', opt) || {};
    (res.messages || []).forEach(function (m) { ids.push(m.id); });
    pageToken = res.nextPageToken;
    pages++;
  } while (pageToken && pages < 10);
  return ids;
}

function readRaw_(id) {
  try {
    var res = Gmail.Users.Messages.get('me', id, { format: 'raw' });
    var text = Utilities.newBlob(Utilities.base64DecodeWebSafe(res.raw)).getDataAsString();
    var split = text.search(/\r?\n\r?\n/);
    return { head: split < 0 ? text : text.slice(0, split), body: split < 0 ? '' : text.slice(split) };
  } catch (err) {
    return null;
  }
}

function header_(head, name) {
  var unfolded = head.replace(/\r?\n[ \t]+/g, ' ');
  var m = new RegExp('^' + name + ':[ \\t]*(.*)$', 'im').exec(unfolded);
  return m ? m[1].trim() : '';
}

/** Addresses a bounce message says failed: X-Failed-Recipients, then DSN recipient fields, then any address in it. */
function failedRecipients_(msg) {
  var self = CONFIG.FROM_EMAIL.toLowerCase();
  var found = {};
  var add = function (s) {
    String(s || '').split(/[,\s;]+/).forEach(function (a) {
      a = a.replace(/^rfc822;?/i, '').replace(/[<>]/g, '').trim().toLowerCase();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a) && a !== self && !/^(mailer-daemon|postmaster)@/.test(a)) found[a] = true;
    });
  };
  add(header_(msg.head, 'X-Failed-Recipients'));
  var re = /^(?:Final|Original)-Recipient:\s*(?:rfc822;)?\s*(\S+)/gim, m;
  while ((m = re.exec(msg.body))) add(m[1]);
  if (!Object.keys(found).length) {
    var all = msg.body.match(/[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || [];
    all.forEach(add);
  }
  return Object.keys(found);
}

/* ------------------------------------------------------------------ */
/* Setup, trigger, Sheet                                               */
/* ------------------------------------------------------------------ */

/** Run once from the editor: builds the tabs and the Summary, and installs the daily trigger. */
function setup() {
  var props = PropertiesService.getScriptProperties();
  ['SHARED_SECRET', 'SHEET_ID'].forEach(function (k) {
    if (!props.getProperty(k)) throw new Error('Set the Script Property ' + k + ' first.');
  });
  if (String(props.getProperty('SHARED_SECRET')).length < 24) throw new Error('SHARED_SECRET should be at least 24 random characters.');
  var ss = SpreadsheetApp.openById(props.getProperty('SHEET_ID'));
  ensureSheet_(ss, CONFIG.SHEET_SUBSCRIBERS, HEADERS);
  ensureSheet_(ss, CONFIG.SHEET_CLICKS, CLICK_HEADERS);
  buildSummary_(ss);
  installDailyTrigger();
  if (!props.getProperty('LAST_INBOX_CHECK')) props.setProperty('LAST_INBOX_CHECK', String(Math.floor(now_().getTime() / 1000)));
  return 'ok';
}

function installDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'dailyRun') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('dailyRun').timeBased().everyDays(1).atHour(CONFIG.DAILY_HOUR).inTimezone(CONFIG.TIMEZONE).create();
}

/** Switch-off: removes the daily trigger. Also set PAUSED=true to stop sign-up sends. */
function removeDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'dailyRun') ScriptApp.deleteTrigger(t);
  });
}

function ensureSheet_(ss, name, headers) {
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  return sh;
}

function buildSummary_(ss) {
  var sh = ss.getSheetByName(CONFIG.SHEET_SUMMARY) || ss.insertSheet(CONFIG.SHEET_SUMMARY);
  sh.clear();
  var S = CONFIG.SHEET_SUBSCRIBERS, C = CONFIG.SHEET_CLICKS;
  var rows = [['Email', 'Subject', 'Sent', 'Unique clickers', 'Click rate', 'Unsubscribes']];
  var sentCols = ['F', 'G', 'H', 'I', 'J'];
  for (var n = 1; n <= 5; n++) {
    var r = n + 1;
    rows.push([n, EMAILS[n - 1].subject,
      '=COUNTA(' + S + '!' + sentCols[n - 1] + '2:' + sentCols[n - 1] + ')',
      '=IFERROR(COUNTUNIQUE(FILTER(' + C + '!B2:B,' + C + '!C2:C=' + n + ')),0)',
      '=IF(C' + r + '=0,0,D' + r + '/C' + r + ')',
      '=COUNTIF(' + S + '!M2:M,' + n + ')']);
  }
  rows.push(['Total', 'All emails', '=SUM(C2:C6)',
    '=IFERROR(COUNTUNIQUE(FILTER(' + C + '!B2:B,' + C + '!B2:B<>"")),0)',
    '=IF(COUNTA(' + S + '!A2:A)=0,0,D7/COUNTA(' + S + '!A2:A))',
    '=COUNTIF(' + S + '!E2:E,"unsubscribed")']);
  sh.getRange(1, 1, rows.length, 6).setValues(rows);
  sh.getRange(2, 5, 6, 1).setNumberFormat('0.0%');
  sh.getRange(8, 1).setValue('Row 7 click rate is unique clickers over all sign-ups. Unsubscribes per email count the last email received before unsubscribing (0 = before email 1 arrived).');

  var top = 10;
  sh.getRange(top, 1, 1, 8).setValues([['By signup source', 'Sign-ups', 'Active', 'Completed', 'Unsubscribed', 'Bounced', 'Clickers', 'Click rate']]);
  var a = 'A' + (top + 1) + ':A';
  var crit = function (col, val) { return 'COUNTIFS(' + S + '!C2:C,' + a + ',' + S + '!' + col + '2:' + col + ',' + val + ')'; };
  sh.getRange(top + 1, 1, 1, 8).setFormulas([[
    '=IFERROR(SORT(UNIQUE(FILTER(' + S + '!C2:C,' + S + '!C2:C<>""))),"")',
    '=ARRAYFORMULA(IF(' + a + '="","",COUNTIF(' + S + '!C2:C,' + a + ')))',
    '=ARRAYFORMULA(IF(' + a + '="","",' + crit('E', '"active"') + '))',
    '=ARRAYFORMULA(IF(' + a + '="","",' + crit('E', '"completed"') + '))',
    '=ARRAYFORMULA(IF(' + a + '="","",' + crit('E', '"unsubscribed"') + '))',
    '=ARRAYFORMULA(IF(' + a + '="","",' + crit('E', '"bounced"') + '))',
    '=ARRAYFORMULA(IF(' + a + '="","",' + crit('K', '">0"') + '))',
    '=ARRAYFORMULA(IF(' + a + '="","",IF(B' + (top + 1) + ':B=0,0,G' + (top + 1) + ':G/B' + (top + 1) + ':B)))'
  ]]);
  sh.getRange(top + 1, 8, 200, 1).setNumberFormat('0.0%');
  sh.setFrozenRows(1);
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function now_() { return new Date(); }

function prop_(k) { return PropertiesService.getScriptProperties().getProperty(k); }

function sheet_(name) {
  var ss = SpreadsheetApp.openById(prop_('SHEET_ID'));
  var sh = ss.getSheetByName(name);
  if (!sh) {
    ensureSheet_(ss, CONFIG.SHEET_SUBSCRIBERS, HEADERS);
    ensureSheet_(ss, CONFIG.SHEET_CLICKS, CLICK_HEADERS);
    sh = ss.getSheetByName(name);
  }
  return sh;
}

/** 1-based row index of the first row whose column equals value, or 0. */
function findRow_(sh, col, value) {
  var last = sh.getLastRow();
  if (last < 2) return 0;
  var vals = sh.getRange(2, col, last - 1, 1).getValues();
  var v = String(value).toLowerCase();
  for (var i = 0; i < vals.length; i++) if (String(vals[i][0]).toLowerCase() === v) return i + 2;
  return 0;
}

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return null;
  try { return fn(); } finally { lock.releaseLock(); }
}

function secretOk_(given) {
  var want = prop_('SHARED_SECRET');
  if (!want || typeof given !== 'string' || given.length !== want.length) return false;
  var diff = 0;
  for (var i = 0; i < want.length; i++) diff |= want.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}

function newToken_() { return Utilities.getUuid().replace(/-/g, '').toLowerCase(); }
function isToken_(t) { return typeof t === 'string' && /^[a-f0-9]{32}$/.test(t); }

function toDate_(v) {
  if (!v) return null;
  var d = v instanceof Date ? v : new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function dayKey_() { return 'SENT_' + Utilities.formatDate(now_(), CONFIG.TIMEZONE, 'yyyy-MM-dd'); }
function sentToday_() { return Number(prop_(dayKey_())) || 0; }
function bumpSentToday_() {
  PropertiesService.getScriptProperties().setProperty(dayKey_(), String(sentToday_() + 1));
}
function dailyCap_() { return Number(prop_('DAILY_CAP')) || CONFIG.DEFAULT_DAILY_CAP; }
function isPaused_() { return String(prop_('PAUSED') || '').toLowerCase() === 'true'; }
function linkBase_() { return prop_('LINK_BASE') || CONFIG.DEFAULT_LINK_BASE; }
function webAppUrl_() { return prop_('WEBAPP_URL') || ScriptApp.getService().getUrl(); }

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function page_(title, html) {
  return HtmlService.createHtmlOutput(
    '<base target="_top"><div style="max-width:520px;margin:48px auto;padding:0 20px;font-family:' + FONT + ';color:#0f172a;line-height:1.6">' +
    '<p style="font-family:' + HEAD_FONT + ';font-size:20px;font-weight:700;margin:0 0 16px">Kygo</p>' +
    '<h1 style="font-size:22px;margin:0 0 12px">' + esc_(title) + '</h1>' + html + '</div>')
    .setTitle(title)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function esc_(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Editor helper: logs a fresh 64-character secret to paste into SHARED_SECRET and Wix. */
function makeSecret() {
  var s = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
  Logger.log(s);
  return s;
}

/** Editor helper: sends all five emails to ryan@kygo.app with a dummy token, for a visual check. */
function sendTestEmailsToMe() {
  var token = '0'.repeat(32);
  EMAILS.forEach(function (email) {
    Gmail.Users.Messages.send({ raw: Utilities.base64EncodeWebSafe(buildMime_(CONFIG.FROM_EMAIL, email, token), Utilities.Charset.UTF_8) }, 'me');
  });
}
