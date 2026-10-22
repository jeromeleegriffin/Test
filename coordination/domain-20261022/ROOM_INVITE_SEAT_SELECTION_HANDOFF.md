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

## Live production v40 reconciliation — October 22, 2026
A concurrent work stream deployed the seat-choice feature while this isolated-work chat was testing it. **Do not redeploy the old staged candidate.** Authoritative Cloudflare GET deployments showed:

- Worker: `griffin-house-of-rooks-online`
- Deployed v40 version ID: `dd4dbc6c-4640-4d84-a91c-15148de87a49` at 100% traffic
- Deployment ID: `f1c472f5-f5ee-4ed3-b0f4-877d29e95f5b`
- Deployment annotation: `v40 seat selection with top-level options route; v36 rollback if critical QA fails.`
- Full **268,275-character deployed JavaScript module** was fetched in 16 guarded pieces and archived at `cloudflare/isolated/live-v40-worker-20261022.mjs`. This is a source recovery snapshot, not an uploaded ZIP or a second Worker.
- Current bindings verified intact: `ASSETS` asset binding, `ROOMS` namespace `bb1bf1c32b68451cbe5db6fee3066fa0` (RoomDO), `ENTRY_LIMIT` limit 12/min in namespace `14784620261020`, `ACTION_LIMIT` 360/min in namespace `14784620261021`, and existing `TEST_GATE_KEY` secret_text.
- The active source contains `preferredSeat` in RoomService.join, read-only seatOptions, atomic `SEAT_OCCUPIED` validation, and an embedded current adapter with `prepareInvitationSeats`. The old source-upload attempt stopped at its extraction guard and did not deploy another version.
- Browser rendering of `https://rooks.jeromegriffin.com/?room=ABC23456` showed the name/avatar/seat-picker UI, with unavailable room `ROOM_NOT_FOUND` and disabled Take Your Seat. Browser rendering of `https://jeromegriffin.com/r/ABC23456` followed the branded direct-link into that join UI; `https://jeromegriffin.com/rooks` still had the approved OG art.
- The original sandbox prior to v40 had already passed real game-interface partner-seat join and 2-of-4 waiting room state, isolated simultaneous seat racing, token-protected reconnect, and real DO snapshot read. The live production version includes matching functionality, but **no new two-device physical Android timing/network test was run in this turn**.
- Do not infer a room exists from its shareable preview. Unknown/expired room codes correctly give ROOM_NOT_FOUND without reserving a seat.
- The Facebook approved photograph stays at `https://jeromegriffin.com/images/rooks-v1.jpg`. The branded-domain invitation script `rooks-branded-entry-only-20261022` v6b and original workers.dev address remain available.
- **Stop deploying competing copies from other chats** until current Cloudflare deployment ID is compared. Recover by Cloudflare version rollout rather than clearing players' storage, resetting DOs or reuploading artwork.

Outstanding: real two-device Android join via fresh Facebook post and background/resume validation, old origin saved-progress transfer strategy, documentation finalization. Owner has approved homepage appearance for now.

## Production v40 atomic seat test — 2026-10-22
- After independently discovering production v40 was already deployed, executed one controlled end-to-end **server-side QA against the real production Worker and ROOMS namespace**, not the isolated test namespace. A temporary service-binding Worker was used only to create a fresh QA table, request seat options, race two guest joins for the same partner seat, and close the table.
- Result: `{"test":"live-v40-explicit-seat","pass":true,"actual":{"roomCreated":true,"roomCodeLength":5,"readOnlyOptions":true,"choiceSeats":[1,2,3],"competingSuccesses":1,"otherError":"SEAT_OCCUPIED","partnerChosen":2,"seatShowsOccupied":true},"cleanedUp":true,"closeStatus":200}`
- The generated QA table used an automatically allocated short 5-character code, not an owner's existing table; the host explicitly closed it (HTTP 200). No existing room or player storage was changed.
- Temporary Worker `rooks-live-v40-seat-qa-temporary-20261022` was **deleted** immediately after the passing test. No permanent extra Worker or asset duplication was left behind.
- The active Worker remained `griffin-house-of-rooks-online` v40 `dd4dbc6c-4640-4d84-a91c-15148de87a49`; no production deployment was made in this task.
- Approved Facebook Rooks OG picture, normal game sharing link, room-specific short links, domain, game assets, DO namespace, secret and rate limit settings preserved.
- Remaining physical QA: Android Facebook in-app browser link into a real active table, name/voice/avatar confirmation, choosing seat, device suspend/resume, saved data migration from workers.dev shortcuts. These were not simulated by the server-side seat test.

## Facebook Android invitation field bug and branded-only v7 repair — 2026-10-22
Owner supplied the 25.98-second Android Facebook screen recording `Screen_Recording_20261022_105206_Facebook.mp4`, showing the invite `YOU21`. In the Facebook in-app browser the player-name field was grey/unresponsive, while tapping the `YOU21` room code opened the keyboard and highlighted that code. The small `Change Partner` control also overlapped the `Choose your seat` heading. **This was a client-side invitation layout/focus defect, not failed server-side seat reservation.**

### Cause
The actual `landing783.js` places name label, `#hor-player-name`, and `.identity-choice` as direct children of `#landingPanel783`. `room830.css` has a joining-mode rule:
`body #lobby.joining #landingPanel783 > :not(#joinForm):not(#lobbyStatus) {display:none!important}`.
The room code `#hor-room-code` was still an editable text input. A concurrent branded v6c patch only removed `landing-returning` and was not sufficient to provide a reliable editable name field inside the joining UI.

### Change
Applied *only* to the branded asset-route Worker `rooks-branded-entry-only-20261022`, currently **v7 `20261022-v7-invite-name-field`**. For invite URLs, it:
- Reparents **the existing original** name label, input and avatar/voice controls into the active `#joinForm` as `#ghInviteIdentityV7`, preserving their existing game listeners and saved identity behavior rather than creating duplicate inputs.
- Makes the prefilled room code `#hor-room-code` `readOnly`, `inputmode=none`, `tabindex=-1`, labels it **TABLE CODE · Filled in for you**, and retains the actual room code value for the authoritative join API.
- Adds narrowly scoped high-contrast accessible name styling, blocks the obsolete Change Partner control from overlapping the invitation screen, and **restores** the original name/avatar controls and room input when Back leaves joining mode.
- Preserves the v40 seat picker and multiplayer server, original room storage, original `workers.dev` address, Facebook approved JPG, v5a Facebook share chooser, and v4 native in-page no-second-asset-load guard.
- Full isolated source backup: `coordination/domain-20261022/rooks-branded-entry-v7-invite-name-field.js`.

### Verification
- Cloudflare Browser Rendering at `https://rooks.jeromegriffin.com/?room=ABC23456` confirmed the original `#hor-player-name` parent is now `#ghInviteIdentityV7`, inside `#joinForm`, with name field accepting focus and a test value. Room input correctly returns `readOnly=true`, `inputmode=none`, holds the untouched invite code.
- Browser-triggered Back restored `#hor-player-name` to `#landingPanel783`, room input `readOnly=false`, original `inputmode=text`, and removed the temporary invitation group. Normal game launch did not gain any new invitation elements.
- QA used an intentionally nonexistent room code. Nothing was written to any real room. Live v40 worker still `dd4dbc6c-4640-4d84-a91c-15148de87a49` with `ASSETS, ROOMS, TEST_GATE_KEY, ENTRY_LIMIT, ACTION_LIMIT` bindings.
- Physical Android keyboard activation inside *Facebook's actual WebView* is NOT YET independently verified after v7. Browser DOM verification cannot replace the owner's next actual tap test. Do not claim the physical Android bug is definitively resolved until the owner confirms.

### Rollback
Restore `rooks-branded-entry-v6c` if available or the archived `rooks-branded-entry-v6b-prejoin-consent.js` on this isolated override Worker only. Do not redeploy the main game, clear browser storage, modify DO rooms, or touch the approved Facebook art.

## v8 selected-seat clarity and player name wording — 2026-10-22
- Owner said an available seat did not visibly show selection and `Confirm name (last: You)` looked as though the form asked for a last name.
- Fixed only the **branded** `rooks.jeromegriffin.com/cloud-game/assets/cloudflare-entry.js*` route override, new marker `20261022-v8-seat-selected`. The live game Worker v40, DO room storage, all other gameplay/console/approved assets, old workers.dev game, and general homepage were not changed.
- Replaced the misleading input placeholder with **`Enter your player name`**, label with **`Your player name`**, and removed the previous-name hint from the displayed input/data attribute. An explicit name is still required before joining.
- Improved invitation seat selection UI: open seat buttons show **TAP TO SELECT**. When selected (`aria-pressed=true` from the existing game UI), the chosen seat gains a strong gold fill, 3px light-gold border, warm glow, bold readable dark text and **✓ SELECTED**. The new live-region status displays the name/team meaning, e.g. `✓ SELECTED: Host's partner. You will be on the host’s team.`. The existing Take Your Seat control changes to **✓ Confirm Host's partner ›** and the accessible label names that seat. Unavailable seats remain disabled; reduced-motion preferences honored.
- This is presentation only: uses the original UI's authoritative `aria-pressed` state; does not auto-select, change `preferredSeat`, double-load the game, reserve rooms early or modify the game server.
- Cloudflare Browser Rendering UI check with a temporary synthetic seat button on an intentionally nonexistent invitation verified `Enter your player name`, no "last" wording, editable name, locked room code, pre-selection disabled confirm, selected `aria-pressed=true`, computed selected CSS gold `rgb(177,138,68)`, border `3px rgb(255,223,138)`, `✓ SELECTED` pseudo-label, live confirmation text, and seat-specific button label. The test made no real room reservations.
- Normal `rooks.jeromegriffin.com/` entry has no invitation UI inserted. Facebook's crawler still saw the approved OG JPEG at both `jeromegriffin.com/rooks` and `jeromegriffin.com/r/YOU21`, with distinct titles and valid canonical URLs.
- Exact deployed source saved at `coordination/domain-20261022/rooks-branded-entry-v8-seat-selected.js`, previous v7 at `rooks-branded-entry-v7-invite-name-field.js`. Physical Android Facebook in-app browser selected-seat visibility still needs the owner's confirmation after rollout.
