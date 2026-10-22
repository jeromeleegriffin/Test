# Branded Rooks invitation: identity consent + real seat selection (2026-10-22)

## Owner requirement
An invited person should open the room with no extra general company landing page, then choose or confirm their name and avatar and explicitly choose an **available** seat before any seat reservation. The host's seat cannot be claimed, two guests cannot claim the same seat, and reconnect must return a player to the already-reserved original seat. The approved Facebook photo and correct room code must remain in social previews.

## What is LIVE now
- Branded game only: `rooks.jeromegriffin.com/cloud-game/assets/cloudflare-entry.js*` serves version `20261022-v6-prejoin-consent`.
- Its final IIFE runs after the game's name restoration but before the native Cloudflare multiplayer adapter. For `GHR_CLOUD_INVITE`, the name input is cleared and the previous nickname retained as a *placeholder/suggestion*, so the existing adapter does **not** silently call `joinByCode()`. It instead displays `Invited to table CODE. Enter your name and take your seat.` and reveals the native join form.
- Verified via Cloudflare Browser Rendering on `https://rooks.jeromegriffin.com/?room=QZX987`: name input has `placeholder="Confirm name (last: You)"`, join form is visible, status is invitation prompt. No seat was reserved in this test; QZX987 was a deliberately nonexistent code.
- Existing native game UI already allows choosing an avatar before joining. This live mitigation **does not allow selecting a specific seat**. The current DO automatically picks first available seat.
- The approved Facebook image, `/rooks` general share page, branded `/r/CODE` deep-link behavior, no-double-load navigation guard, and v5a Facebook-specific share menu were retained.
- Original `workers.dev` game and its player data/storage not touched, nor was the production multiplayer engine modified.

## Staged but NOT deployed
The following are on branch `work/jeromegriffin-domain-setup-20261022`:
1. `cloudflare/isolated/seat-selection-worker-candidate-20261022.mjs`: extends RoomService.join with optional `preferredSeat`, read-only `seatOptions` response for awaiting guests, atomic chosen-seat rejection when occupied, preserves token-protected reconnect and optional legacy first-available behavior; DO `/join` forwards preferredSeat and `/seat-options` reads room availability.
2. `cloudflare/isolated/seat-selection-adapter-candidate-20261022.js`: renders seat 1 (opponent), seat 2 (host's partner), seat 3 (opponent), each with availability, plus name/avatar confirmation and `preferredSeat` in Join POST. It removes the saved-name autojoin path. Guests select a seat before confirming.
3. `cloudflare/isolated/seat-selection-unit-20261022.mjs`: Node regression suite covering chosen partner seat, occupied seat conflict, invalid seats, resume token, fallback legacy allocation and predeal bot replacement.

**Crucial release warning:** both staged candidate sources are derived from GitHub's `cloudflare/live/worker-live.mjs` and `cloudflare/live/adapter-live.js`, which reference earlier Build 846-r10. Live Cloudflare worker is Build 846-r12 with protected bindings/assets. DO NOT DEPLOY these source candidates as replacements without rebasing/integrating the precise changes onto the current runtime, preserving all secret/asset/DO/rate-limit bindings and testing separately. A whole-Worker upload would risk breaking multiplayer and cannot be considered safe just because a unit passes.

## Verified isolated test
A temporary test-only Cloudflare Worker used ONLY the staged RoomService class and in-memory storage (no active rooms, no shared Durable Object namespace), checked the following:
`{"pass":true,"host":0,"seatOptions":4,"chosenPartner":2,"conflictRejected":true,"resume":2,"opponent":3,"legacy":1}`
This passed when fetched through Cloudflare Browser Rendering. The disposable Worker `griffin-seat-choice-unit-20261022` was deleted afterward.

## Remaining tests before rollout
1. Rebase the seat-selection DO and UI changes onto Build 846-r12 and create a **separate** namespace/deployment to avoid modifying saved rooms.
2. Integration test two independent browsers selecting the same seat; one must get `SEAT_OCCUPIED` and a refreshed seat list, never silently be moved.
3. Verify choosing the host's partner seat 2, an opponent seat 1 or 3, a bot seat before deal, and reconnect reclaiming the original seat.
4. Verify room code / display name / avatar correctly assigned; room preview reveals no hand or token; expired and already-started rooms fail clearly.
5. Verify Android Facebook invite click goes directly into the branded join/seat-selection screen, preserving the approved OG picture and no unnecessary game asset reload.
6. Do not clear service-worker state or redirect original `workers.dev` shortcuts.

## Rollback
Live prejoin consent resides ONLY in override Worker `rooks-branded-entry-only-20261022` on the existing single-asset route. Prior source `coordination/domain-20261022/rooks-branded-entry-v5a-facebook-share.js` and `v4-single-load.js` are available if regression requires rollback. DO NOT modify original game Worker or Durable Object storage as rollback.

## Recovery and additional verified work after interrupted session — 2026-10-22
- Re-checked authoritative Cloudflare: live Rooks Worker `griffin-house-of-rooks-online` remains deployed version `3df448a2-83f0-4fd0-be97-665a067848de`, with unchanged bindings `ROOMS`, `ASSETS`, `ACTION_LIMIT`, `ENTRY_LIMIT` and `TEST_GATE_KEY`. Existing room storage and secret were not touched. Branded entry override v6 pre-join consent is live and its exact source is archived as `rooks-branded-entry-v6-prejoin-consent.js`.
- Rechecked actual game invitation `?room=QZX987` (deliberately nonexistent test code). Browser showed invited-room status and name confirmation placeholder instead of silently allocating a seat.
- **Real isolated Durable Object integration test**: created a **separate, SQLite-backed** `SeatSandbox` Durable Object namespace and temporary Worker `griffin-seat-selection-integration-stage-20261022`. It used the *actual staged RoomService class* and HTTP requests, not only an in-memory unit simulation. Built-in test endpoint returned:
`{"pass":true,"hostSeat":0,"choiceSeats":[1,2,3],"invalidSeatRejected":true,"concurrentWinners":1,"loserError":"SEAT_OCCUPIED","resumeSeat":2,"opponentSeat":3,"legacySeat":1}`
  This proves atomic seat choice, protection against simultaneous claims, original-seat resume, input validation, and legacy fallback at the test backend layer.
- Saved an exact **44,547-character copy of the *currently deployed* 846-r12 Cloudflare adapter** in `cloudflare/isolated/current-live-cloud-adapter-20261022.js`. Compared against older staged source and created the rebased `cloudflare/isolated/seat-selection-adapter-r12-candidate-20261022.js` (48,852 raw template characters). Changes: read-only availability picker, host/partner/opponent mapping, visible name/avatar confirmation, guest must pick a seat before POST /join, explicit preferredSeat forwarded, refresh on occupied-seat conflict, reserved-seat reconnect button for browser with valid saved token. Branded identity remains independent of any old workers.dev saved data.
- **Browser JavaScript syntax test passed:** isolated HTML sandbox compiled and parsed the decoded rebased adapter with zero script errors: `{"pass":true,"errors":[],"adapterBytes":48833}`. Unlike a standalone Node parse of the raw Worker template, this test correctly decoded escaped template delimiters first.
- Both disposable Workers (`griffin-seat-selection-integration-stage-20261022`, `griffin-seat-ui-r12-syntax-check-20261022`) were **deleted after verification**. No guest data, production rooms or original Worker were touched. The candidate source and test results remain recoverable in GitHub.

## Still not shipped
- Full chosen-seat integration is **NOT live**; only confirmation-before-join is live. The server still uses first-available-seat allocation. The safe backend patch must be rebased onto the exact current deployed bundle without overwriting Cloudflare assets, production DO namespace, rate-limit bindings or secret. Verify a complete web gameplay/test-server handshake and UI/DO schema parity before promoting.
- Facebook OG picture and direct-room deep link are still intact and unchanged. Old player shortcuts must remain operational; there is no forced migration.

## Actual Rooks game UI + isolated Durable Object integration — 2026-10-22

**Do not restart from scratch.** Continuing the saved work after an interrupted connection, we created a full-browser integration staging Worker `rooks-seatflow-isolated-20261022` with a separate SQLite-backed `TestRoom` DO namespace. The Worker:
- Uses a read-only Cloudflare service binding `GAME` to serve the *actual deployed House of Rooks HTML and assets*. It does **not** copy card, table or audio files and does **not** forward `/rooms` requests to live ROOMS.
- Replaces only the embedded Cloudflare adapter at response time using the rebased 846-r12 adapter from `cloudflare/isolated/seat-selection-adapter-r12-candidate-20261022.js`.
- Routes create, join, read-only `seat-options`, and snapshot calls to its own `TEST_ROOMS` namespace. WebSockets are intentionally disabled in this test, which uses the existing fallback polling.
- Keeps the public game Worker `griffin-house-of-rooks-online`, its DO namespace `bb1bf1c32b68451cbe5db6fee3066fa0`, all assets, secrets and active rooms unchanged.

### Test results (Cloudflare Browser Rendering, actual game page)
- Worker probe: real game HTML returned, existing `Play With Friends` and `Join by Code` buttons present, 48,833 decoded characters in tested Cloudflare adapter.
- `/_seatqa` created its own random sandbox room and passed concurrency: exactly one of two guests claiming seat 2 succeeded, other got `SEAT_OCCUPIED`, explicit opponent seat 3 and old-client default seat 1 worked, and token-protected resume stayed in seat 2.
- Snapshot regression: after seat claims, authorized `GET /snapshot` returned HTTP 200 with `phase:"waiting"`.
- Real invited browser session at `/?room=B5VJEUSD`: rendered `Choose your seat`, 3 seat buttons, and disabled `Take Your Seat` prior to selection. Browser automation clicked `Host's partner` (seat 2) and the backend reserved that exact seat.
- A fresh room `C39ZDJRM`: browser selected seat 2, confirmed name `QA Guest`, submitted `Take Your Seat`, and reached the **actual waiting-room screen** (waiting visible, lobby hidden, `TABLE C39ZDJRM`, `2 of 4 seated`). The browser's stored credential seat was 2, and the server's seat state matched.
- First browser probe saw the reservation but did not capture the waiting-room transition within its earlier short sampling window. The next room did capture successful transition. This is sufficient for isolated proof, **not** proof of reliable Android lifecycle/long suspension behavior.
- Source is archived at `cloudflare/isolated/seat-selection-full-game-sandbox-20261022.mjs`. The staging URL is `https://rooks-seatflow-isolated-20261022.jeromeleegriffin.workers.dev/` and is **NOT** the real game; staging rooms are disposable.

### Production integration still pending
- DO methods `join(preferredSeat)`, `seatOptions`, and the client adapter UI are now tested in isolation, but the **live Worker still uses first-available-seat assignment**. Never call seat selection "live" until the original Worker is updated and verified.
- In the exact *deployed* `worker-cloud-only.js`, all required patch anchors were unique (join signature, seat resolution, snapshot method, join forwarding, DO endpoint, error list, and embedded adapter). The current compiled Worker has 262,729 JS module characters plus a separate source map; a byte-for-byte source audit is preferable to replacing the whole build.
- Any production upload must use Cloudflare Workers versioning/rollback and preserve `ASSETS` (`keep_assets:true`), the current `ROOMS` namespace/class, `TEST_GATE_KEY` secret, `ENTRY_LIMIT`, `ACTION_LIMIT`, compatibility settings, and original game assets. DO NOT deploy an older GitHub worker source or unverified multipart metadata.
- Current live branded-only JS override `rooks-branded-entry-only-20261022` version `20261022-v6b-prejoin-consent` keeps name confirmation + approved Facebook sharing. Do not remove it before a safe full integration.
- Owner's approved Facebook room and regular-game preview imagery still remain on `jeromegriffin.com`; no artwork changes or duplicate asset upload.
