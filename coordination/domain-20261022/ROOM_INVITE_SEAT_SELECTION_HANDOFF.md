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
