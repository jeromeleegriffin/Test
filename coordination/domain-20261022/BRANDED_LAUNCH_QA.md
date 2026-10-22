# JeromeGriffin.com branded launch QA — 2026-10-22

## OWNER DECISIONS
- Homepage approved for now. Do not redesign without request.
- User purchased JeromeGriffin.com independently, and separately reported purchasing Cloudflare's $5 plan. Cloudflare zone still describes its website plan as Free Website; Workers billing entitlement was not verified. No new billing changes made.
- Preserve the **original** Cloudflare Rooks hostname and its player data. Do not redirect old players automatically.

## VERIFIED CLOUDFARE LIVE
- `https://jeromegriffin.com/` -> `jerome-griffin-site`, HTML and social metadata verified.
- `https://www.jeromegriffin.com/` -> same website with canonical apex redirect.
- `https://jeromegriffin.com/rooks` -> approved original art, OG image `https://jeromegriffin.com/images/rooks-v1.jpg` (1200x630). Link to branded playable game.
- `https://jeromegriffin.com/apps` and `https://apps.jeromegriffin.com/` -> applications section, independent social metadata.
- `https://rooks.jeromegriffin.com/` -> original Worker `griffin-house-of-rooks-online`, no code/assets/DO re-upload. Built-in browser rendering confirmed Rooks HTML.
- Old `https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/` still serves original game and original JS asset. No source modifications.

### Narrow branded-only Workers routes
1. `rooks.jeromegriffin.com/cloud-game/assets/cloudflare-entry.js*` -> `rooks-branded-entry-only-20261022`
   - ID `db48506eb07a4718b5fd80f402fd8a06`
   - Serves exact GitHub `cloudflare-entry.js` release source with only two changes: native online target set to `https://rooks.jeromegriffin.com/` and the `window.HOR_CLOUD_TEST_ACTIVE` guard allowed on the branded host.
   - Live browser simulated click on **Play With Friends** with default form submission blocked verified `hor-online-navigation.action=https://rooks.jeromegriffin.com/#create=1&name=You`. Earlier first patch had falsely shown static success but simulated click failed; corrected v2 passed. Original workers.dev JS remains unchanged.
   - Rollback: delete route ID through Cloudflare zones Workers Routes API; then branded domain transparently falls back to original Worker asset.
2. `rooks.jeromegriffin.com/` -> `griffin-og-game-head-stage-20261022`
   - ID `6010d59a143842a680981bf7ab2aa68e`
   - Module Worker with service binding `GAME` targeting original `griffin-house-of-rooks-online`, streams original HTML and appends only OG/Twitter meta tags in `<head>`.
   - `rooks.jeromegriffin.com/` rendered HTML verified OG title `Griffin House of Rooks`, image `https://jeromegriffin.com/images/rooks-v1.jpg`.
   - WARNING: **query-containing root URLs** like `/?room=JER42` do not match this Cloudflare route. Cloudflare route matching uses full URL including query, and requires trailing wildcard to cover query strings. DO NOT claim Facebook OG coverage for these invitation links. Safer `https://jeromegriffin.com/rooks` social page works.
   - Not safe to replace this route blindly with `rooks.jeromegriffin.com/*`, because that would intercept ALL static assets/room API/WebSocket requests and would require extensive proxy parity testing.
   - Rollback: delete route ID; branded game continues through original Worker with no appended Open Graph tags.

### Browser and HTTP checks
- New branded game origin served HTML, showed `Play Offline` and `Play With Friends`, and 11 selectively fetched assets (JS, CSS, icon, bird/card images, manifest) passed 200 in a test browser.
- Install manifest served valid JSON with `id=/cloud-game/assets/`, `start_url=/`, `scope=/` and `display=fullscreen`, but physical Android install, PWA offline reload, background/resume and legacy profile migration are **NOT VERIFIED**.
- Original Cloudflare game has intentional service worker registration suppression in delivered game HTML, so avoid claiming true network-disconnected offline install functionality on new hostname. `Play Offline` is the game mode label, not proof of network-independent operation.
- Login/room create/join/rejoin full live gameplay and independent-device network roundtrips not certified on the branded origin. No actual user data wiped or transferred.
- Room API and Durable Object namespaces remain the original `griffin-house-of-rooks-online` runtime. Existing rooms maintained.
- Facebook Sharing Debugger (requires user's Meta login) was tested by owner on *separate* test domains previously. Branded production domain Facebook scraper has NOT been personally checked yet.

## ROLLBACK AND SAFETY
- Cloudflare zone ID `00f00fd8284c4bc08cfd762bb7b476c9`. API list: GET `/zones/{zone_id}/workers/routes`.
- Remove ONLY the two zone routes above to revert all branded-only overrides without touching original Worker, assets or secrets. Do not delete domain, DNS or DO.
- Original game Worker deployed version recorded during domain creation `3df448a2-83f0-4fd0-be97-665a067848de`; if a newer game deployment arrives from another chat, re-audit this record rather than assuming no other work.
- Domain registration active, expires **2027-10-22T04:47:05Z** with **auto-renew OFF**.
- Main website Worker source preserved in this branch at `coordination/domain-20261022/jerome-griffin-site-worker.js` (147097 characters), along with setup README.

## REMAINING FOR FULL LAUNCH
1. Owner to test new branded game on actual Android for full single hand, multiplayer create/join/reconnect with a second device, service worker/install behavior and persistent profiles. Avoid clearing old storage.
2. Only publicize `https://jeromegriffin.com/rooks` for Facebook share for now. For in-room invitation link previews, implement a safe separate room-landing route or rigorous all-path proxy test before claiming room OG preview coverage.
3. Keep legacy workers.dev shortcut viable. Plan an explicit user-driven profile export/import or server-side account linking, never silent storage deletion/redirect.
4. Preserve owner-approved homepage and Rooks artwork. Only enhance after explicit new design requests.


## Facebook sharing extension — 2026-10-22 (continuation)
- **Regular game sharing**: \`https://jeromegriffin.com/rooks\` returns \`og:title = Griffin House of Rooks\`, \`og:url = https://jeromegriffin.com/rooks\`, and \`og:image = https://jeromegriffin.com/images/rooks-v1.jpg\`. The existing approved JPG is unchanged, hosted on Cloudflare. The branded game root \`https://rooks.jeromegriffin.com/\` also has that image metadata via its exact-root overlay. The game information page now has a visible **Share Game on Facebook** action targeting its own branded URL.
- **Per-room sharing**: \`https://jeromegriffin.com/r/YOU32\` and another eight-character sample \`https://jeromegriffin.com/r/ABCDEFGH\` return distinct titles and canonical \`og:url\` values for those room links, **the same approved Rooks image**, and a button targeting \`https://rooks.jeromegriffin.com/?room=YOU32\` (or the matching code). This separate branded landing page is not a replacement for the multiplayer engine. The room must still be open for joining.
- Previous \`/r/CODE\` handler initially had a mismatched case check and returned 404. That was fixed and verified; **do not restore the broken first version**.
- **One-link room Invite handler**: \`rooks.jeromegriffin.com/cloud-game/assets/cloudflare-entry.js*\` now serves the version marked \`x-house-rooks-branded-entry: 20261022-v3\`. Only on the new branded origin it handles \`#shareBtn\` and \`#copyCodeBtn\`, reading the validated code from the current room/DOM, and uses the branded \`https://jeromegriffin.com/r/CODE\` URL. Native share payload has \`text: Sit at my House of Rooks table. Code: CODE\` and **only one URL in \`payload.url\`**, not repeated inside \`payload.text\`. Copy button copies this branded link. Old origin's JS and sharing logic were not touched. The original game engine, Durable Objects, assets and original Cloudflare hostname are unchanged. Rollback that single override route ID \`db48506eb07a4718b5fd80f402fd8a06\` if necessary.
- Server/crawler checks: both room sample OG pages, regular-game OG page, game root OG page, share-button presence and modified branded JS were all retrieved and inspected. The browser's native Android share sheet / actual Meta Facebook card on the **new** production domain is not verified yet. Do not state it is.
- **Important old-shortcut caveat**: sharing a room from an *old* \`griffin-house-of-rooks-online.jeromeleegriffin.workers.dev\` shortcut still uses the previous long URL and may duplicate it (the old \`game060.js\` includes the URL in both Web Share text and URL). Only the new branded hostname has the opt-in isolated corrected share handler. Preserve old players and don't auto-redirect or clear storage.
- **Query URL caveat**: \`https://rooks.jeromegriffin.com/?room=CODE\` is used for joining, not Facebook sharing; its Open Graph tags have not been added because exact-root Worker route does not match URLs with query strings. The short \`jeromegriffin.com/r/CODE\` page is the share URL.
- Source artifacts in this branch: full saved website Worker \`jerome-griffin-site-worker.js\` (refreshed after the new game share button and room pages), and \`rooks-branded-entry-v3.js\` (the route override).
- Homepage design previously approved for now; do not redesign.
- Next manual QA: share \`https://jeromegriffin.com/rooks\` and one real, active \`https://jeromegriffin.com/r/ROOMCODE\` link privately to Facebook; compare preview artwork/title; click invite to confirm join on Android and second device. Verify Rooks gameplay and reconnect under new origin before recommending that users replace old shortcuts.

## Branded Play With Friends double-initialization fix — 2026-10-22
- Root cause verified by code inspection: the branded-only `cloudflare-entry.js` v3 override forced a full HTML form navigation for `#friendsToggleBtn` and `#joinConfirmBtn` even when `window.HOR_CLOUD_TEST_ACTIVE === true`. The in-page native Cloudflare adapter already registers a capture-phase click handler that calls `createCloudRoom()` / `joinByCode()`, calls `event.preventDefault()`, and uses the existing loaded game. The branded v3 listener intercepted the click first with `event.stopImmediatePropagation()`, bypassing native action and starting an unnecessary second game document initialization.
- Resolution (deployed **only** on `rooks.jeromegriffin.com`): `rooks-branded-entry-only-20261022` v4 restores the original early return condition `if (window.HOR_CLOUD_TEST_ACTIVE) return;`. This lets the native handler create/join a room without a page navigation. The fallback branded navigation still applies when the native adapter is not active. The separate v3 clean sharing handler for `#shareBtn` / `#copyCodeBtn` is retained unchanged. `griffin-house-of-rooks-online` original Worker and DO version remain untouched.
- The live overridden JS URL returned HTTP 200 and the v4 guard and branded room-sharing URL were verified in source and HTTP response. Browser navigation analysis in earlier v3 confirmed a form-submit-driven second game load. **Full live Android before/after timing and network transfer counts remain unverified**; not all assets necessarily downloaded twice due to caching, but page init repeated. Do not present the code-level fix as a measured Android performance result.
- Recovery source: `coordination/domain-20261022/rooks-branded-entry-v4-single-load.js`. To revert, restore v3 only if knowingly accepting double initialization, or delete route `db48506eb07a4718b5fd80f402fd8a06`.

## Facebook share-post preview correction — 2026-10-22
- Owner screenshot of private Facebook post for branded room `YOU38` showed a **single correct short URL** (`https://jeromegriffin.com/r/YOU38`) but **no image card**. This proves the older duplicate raw workers.dev URLs were fixed for branded shares, but does NOT prove Facebook scraped a preview.
- With a `facebookexternalhit/1.1` user-agent via Cloudflare Browser Rendering, `/r/YOU38` served HTTP 200 and proper title, per-room canonical OG URL and the approved `https://jeromegriffin.com/images/rooks-v1.jpg` picture. The JPG is served at 1200×630. Facebook's own authenticated debugger results remain unavailable.
- Diagnosis: The Android native Web Share flow using a text caption + URL is likely being composed as a plain text status, not a full link preview. Do NOT claim Meta crawling is confirmed or that changing OG metadata alone will solve this.
- **Change deployed, branded-only**: `rooks-branded-entry-only-20261022` v5a serves a minimal `Invite Friends` chooser on `#shareBtn` offering:
  * **Share on Facebook**: a normal `https://www.facebook.com/sharer/sharer.php?u=ENCODED_SHORT_ROOM_URL` hyperlink, target blank; should invoke a link preview based on the real per-room OG page.
  * **Other Apps / Messages**: existing native Web Share payload with one short URL plus caption; still best for Messages/WhatsApp, not Facebook.
  * **Copy Invitation Link**: short room URL only.
- `#copyCodeBtn` continues to copy the short branded room URL immediately. `window.HOR_CLOUD_TEST_ACTIVE` native-adapter early guard remains intact (v4 single-load navigation fix). No gameplay Worker source, Durable Objects, assets or old hostname were changed. No homepage layout/artwork changed.
- Confirmed HTTP 200 and new v5a JS, explicit FB sharer option, short room page OG, general game `/rooks` OG, and approved image. NOT YET confirmed whether Android WebView actually displays the chooser or if Facebook renders the approved preview on a new post; a user's real Facebook post is needed. The prior screenshot is not evidence of v5a success since it preceded this patch.
- Recovery source: `coordination/domain-20261022/rooks-branded-entry-v5a-facebook-share.js`. Roll back just this override Worker to `v4` via `rooks-branded-entry-v4-single-load.js` if it causes issues; never clear player storage.
- User path for test: open `https://rooks.jeromegriffin.com/`, host/join a room, tap `Invite`, tap `Share on Facebook`, post privately. Do not select `Other Apps / Messages` then Facebook when testing rich Facebook preview.

## Room invitation deep link and seat-display investigation — 2026-10-22
- Owner shared a successful Facebook post showing the correct approved image for Table YOU38. They reported the click opened an intermediate "Join Table" landing page and then a waiting-room screen that appeared strange.
- **Implemented direct navigation from the social link**: In the existing `jerome-griffin-site` Worker, the `roomInvite(code)` response still renders full server-side OG metadata, the same approved JPEG and a non-JS fallback Join Table button. A narrowly scoped inline script automatically uses `window.location.replace("https://rooks.jeromegriffin.com/?room=CODE")` for normal human browsers. It does not run for known link-preview bots such as `facebookexternalhit`, `Facebot`, `Twitterbot`, `Slackbot` or `Discordbot`.
- **Tested**: Cloudflare Browser Rendering with `facebookexternalhit/1.1` sees the table-specific OG title and approved `https://jeromegriffin.com/images/rooks-v1.jpg` image, without navigating to the game. With a normal Android Chrome user agent, Browser Rendering follows directly into the game HTML instead of requiring a manual Join Table click. A deliberately nonexistent test code resulted in the game's `ROOM_NOT_FOUND` state, confirming the code made it into the room-join path without opening a real room or changing any game state.
- The deploy changed only `roomInvite(code)` in `jerome-griffin-site`, not the homepage, general `/rooks` share page, game Worker, DO bindings, or approved artwork. The full updated 148767-character site Worker is backed up to `coordination/domain-20261022/jerome-griffin-site-worker.js`.
- **Waiting-room screenshot interpretation**: Guest sees `Waiting for friends, 2 of 4 seated`, top/right `You Host`, and `You ★1` in the bottom HUD. Based on the actual `friends803.js` and Cloudflare `mapPlayers(snap)` code, waiting-room seats rotate relative to the local player, and `2 of 4` can accurately mean one host plus one guest; footer `You` labels the local player, not a second duplicate seat. If both participants have the display name `You`, the labels can appear duplicated and confusing. **Not enough evidence to assert a seating bug**; a test with two distinct display names on two browsers/devices is still required before altering seat UI.
- Final Meta app click behavior still should be verified by the owner on a **new Facebook post**, since old posts may stay cached; external browser-based simulation is not equivalent to physical Android Facebook WebView navigation.
