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
