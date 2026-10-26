# SOWA nurture emails: setup

Status: built and tested (19/19 tests pass), not yet deployed. Nothing sends until you finish step 13.

What it does: a report sign-up on kygo.app (any `Subscribers` row whose `source` starts with `report-`) gets email 1 at once, then emails 2 to 5 on calendar days 2, 5, 9 and 14 (New York time), sent from ryan@kygo.app through the Gmail API. A Google Sheet holds one row per address, a click log and a Summary tab. Wix Automations for this list stay off, so nothing sends twice.

## Files in this folder

- `Code.gs`: the whole Apps Script.
- `appsscript.json`: the Apps Script manifest (time zone, Gmail service, web app settings).
- `data.js`: the whole Wix file `backend/data.js` (the sign-up hook).
- `http-functions.js`: the whole Wix file `backend/http-functions.js` (your current file plus the new `get_go` click redirect at the bottom).
- `test/`: the test harness (`run-tests.js`, `render-png.js`), canvas fixtures, `results.txt`, `render-results.txt`.
- `png/`: each email rendered at desktop and phone width.
- `PRIVACY-DRAFT.md`: the policy wording this needs. Publish it before step 13.

## One design change you should know about

Apps Script web apps cannot send a 302 redirect, and Google blocks them from moving the browser to another site without a tap. So the tracked links in the emails point at `https://www.kygo.app/_functions/go?id=...&e=...&l=...` (a new Wix HTTP function). It looks up the link key in a fixed list, logs the click to the Apps Script (no email address is sent, only the random row token), and does a real 302 to the destination with its UTMs unchanged. Unknown keys get a 404. The Apps Script `doGet?a=c` route still exists as a fallback: it logs the click and shows a one-tap Continue button. Unsubscribe stays on the Apps Script URL as designed.

## Steps

1. **Publish the privacy policy update first.** Your policy section 7.4 says "We do not send marketing email" and promises to update that section before any marketing email starts. Paste the wording from `PRIVACY-DRAFT.md` into the policy page and publish.

2. **Create the Sheet.** Signed in as ryan@kygo.app, open sheets.new. Name it "SOWA nurture emails". Copy its ID from the address bar (the long part between `/d/` and `/edit`).

3. **Open Extensions > Apps Script** from that Sheet. Rename the project "SOWA nurture emails".

4. **Paste the code.** In `Code.gs`, select all, delete, paste the whole of this folder's `Code.gs`. Save.

5. **Paste the manifest (turns on the Gmail Advanced Service).** Project Settings (gear icon) > tick "Show appsscript.json manifest file in editor". Back in the Editor, open `appsscript.json`, select all, delete, paste this folder's `appsscript.json`. Save. Check the left sidebar now shows Services > Gmail. (Without the manifest: Services > + > Gmail API > v1 > identifier `Gmail` > Add.)

6. **Make the secret.** In the editor, choose the function `makeSecret` in the toolbar and click Run. Approve the permission prompts (Advanced > Go to SOWA nurture emails). Copy the 64-character value from the Execution log.

7. **Set the Script Properties.** Project Settings > Script Properties > Add:
   - `SHARED_SECRET` = the value from step 6
   - `SHEET_ID` = the ID from step 2
   - Optional: `DAILY_CAP` (default 1400 emails a day), `PAUSED` (`true` stops all sending).

8. **Run `setup` once.** Pick `setup` in the toolbar, Run. It builds the Subscribers, Clicks and Summary tabs and installs the daily trigger (dailyRun, every day 9 to 10 am New York). Check Triggers (clock icon): exactly one `dailyRun` trigger.

9. **Deploy as a web app.** Deploy > New deployment > gear > Web app. Description "v1". Execute as: **Me (ryan@kygo.app)**. Who has access: **Anyone**. Deploy, authorize if asked, and copy the Web app URL (ends in `/exec`).

10. **Add `WEBAPP_URL`.** Script Properties > Add `WEBAPP_URL` = the `/exec` URL. (Unsubscribe links are built from it.) Later code changes: Deploy > Manage deployments > edit (pencil) > Version: New version, so the URL stays the same.

11. **Add the Wix secrets (Secrets Manager, not code).** Wix dashboard > Developer Tools > Secrets Manager > Store Secret:
    - `SOWA_NURTURE_URL` = the `/exec` URL
    - `SOWA_NURTURE_SECRET` = the same value as `SHARED_SECRET`

12. **Paste the Wix backend files.** Wix editor > Dev Mode on > `{ }` Code sidebar > Backend.
    - `data.js`: if it does not exist, + > New .js file > `data.js`. Select all, delete, paste this folder's `data.js`. The kygo-elements docs record no existing data hooks; if your `data.js` already has code, send it to me first and I will merge it into one file.
    - `http-functions.js`: select all, delete, paste this folder's `http-functions.js`. It is your current file (post_subscribe, options_subscribe, get_amazonPicks, as mirrored in kygo-elements `velo/http-functions.js`) with `notFound, response` added to the first import line and the `get_go` section added at the end. If your live file differs from that mirror, send it to me first.

13. **Publish the Wix site.** (Preview does not run backend hooks against the live collection.)

14. **Send yourself a test sign-up.** Open https://www.kygo.app/state-of-wearable-accuracy in a private window and submit an address you can read (for example a Gmail address that is not ryan@kygo.app).

15. **What to check.**
    - Within a minute: email 1 arrives from "Ryan at Kygo", inbox not spam, images show, preview text reads "78 pages, seven brands...".
    - Gmail shows an Unsubscribe link next to the sender name (this needs DKIM on for kygo.app in Google Admin > Apps > Gmail > Authenticate email).
    - Sheet > Subscribers: one row, status `active`, `email1_sent` filled, a 32-character token.
    - Click the Download button: you land on /report-download with `utm_content=email-1` in the address bar, and the Clicks tab gets a row; Summary shows 1 sent and 1 unique clicker for email 1.
    - Submit the same address again: no second row, no second email.
    - Click Unsubscribe in the email footer: a "You are unsubscribed" page, the row turns `unsubscribed`.
    - Wix > Developer Tools > Logging: no "SOWA nurture hook failed" lines. Apps Script > Executions: doPost succeeded.
    - Optional preview of all five: run `sendTestEmailsToMe` in the editor (sends emails 1 to 5 to ryan@kygo.app with a dummy token; their links work but are not logged).

## Day to day

- The Summary tab updates by itself: per email sent, unique clickers, click rate, unsubscribes; then totals by signup source.
- The daily run also marks bounces (mailer-daemon messages since the last run) and processes unsubscribe replies (subject "unsubscribe <token>", or any reply with "unsubscribe" in the subject from a subscriber).
- If Gmail rejects a send, the row's `last_error` says why and the next daily run retries.
- Rerunning `dailyRun` by hand is safe: a filled send cell is never sent again.

## How to switch it off

- Pause everything at once: Script Property `PAUSED` = `true` (sign-ups are still recorded; delete the property to resume, and pending emails catch up on the next daily run).
- Stop the schedule: run `removeDailyTrigger` (or delete the trigger under Triggers).
- Stop new sign-ups reaching it: delete the Wix secret `SOWA_NURTURE_URL` (the hook logs an error and the Wix insert still works), or remove `Subscribers_afterInsert` from `data.js` and publish.
- Full stop: Deploy > Manage deployments > Archive. Tracked links in emails already sent still redirect through Wix (they only stop being logged).
- Roll back Wix: restore the previous `http-functions.js`, delete `data.js`, publish.

## Tests (run here, not in Apps Script)

`node test/run-tests.js` then `NODE_PATH=$(npm root -g) IMG_DIR=<folder with the canvas images> node test/render-png.js`. Covered: sign-up, the day 0 to 16 schedule on a simulated clock (including an 11:30 pm sign-up), duplicate sign-up, unsubscribe mid-sequence (link, one-click POST, mailto), bounces (including delay notices, which are ignored), click redirect and logging, unknown and mismatched link keys rejected, daily-job reruns and a stale-snapshot race with no double sends, Gmail failure and retry, the daily cap, the Wix hook never failing the insert, and the copy, subjects, preview text, links, UTMs and images checked against the canvas files. Not testable here: the Sheet formulas themselves and real Gmail delivery; step 15 covers both.

## Open items

- Emails 4 and 5 link to the bare `https://app.kygo.app` (as on the canvas). The kygo-elements rule for web CTAs is `app.kygo.app/start`. Say the word and I will change the four `app.kygo.app` links in both link maps.
- Retention: `PRIVACY-DRAFT.md` promises click records are deleted 12 months after the last email or on unsubscribe. Nothing deletes them automatically: once a quarter, delete Clicks rows older than that and clear the `clicks` cell of unsubscribed rows (or ask me to add a cleanup function).
- Unsubscribe by link happens on the first GET. Some corporate link scanners open every link in an email, which could unsubscribe a reader without a click. Watch for unsubscribes with no clicks from company domains.
