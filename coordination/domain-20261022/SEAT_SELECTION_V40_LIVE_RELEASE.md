# Griffin House of Rooks — LIVE Version 40 Release
2026-10-22 | Cloudflare production release record

## Active production
- Worker: `griffin-house-of-rooks-online`
- **Currently deployed Version 40:** `dd4dbc6c-4640-4d84-a91c-15148de87a49`, deployment `f1c472f5-f5ee-4ed3-b0f4-877d29e95f5b`, 100% traffic.
- **Rollback Version 36:** `3df448a2-83f0-4fd0-be97-665a067848de`. The old v36 deployment had ID `a05c9b90-4f3e-44de-84a2-b0b22e6504f9`.
- Cloudflare owner domain: `rooks.jeromegriffin.com` (branded game) and original `griffin-house-of-rooks-online.jeromeleegriffin.workers.dev` (both route to same game Worker).
- Facebook preview pages: `https://jeromegriffin.com/rooks` and `https://jeromegriffin.com/r/CODE`, preserved approved 1200x630 photograph with Grit, Ember and Sofia.
- Game art/audio asset set was **not** re-uploaded, replaced, duplicated or cleared.

## Deployment sequence and first smoke-test failure
1. Version 39 `aefaafd8-a522-4118-ac53-6b3d982591b3` passed the isolated real-game/DO tests and carried over the required five bindings.
2. Following owner's direction to continue the previously announced controlled live release, v39 was deployed at 100%. A live temporary-room API smoke test immediately discovered `GET /rooms/CODE/seat-options` returned text `Not found`: the top-level request router had not included the new path even though RoomDO implemented it.
3. Production was promptly **rolled back to Version 36** with deployment `a3f3a433-aabe-43fa-a5bd-cb07eb67bf45`. The temporary QA table was successfully closed; no game data deleted.
4. A one-clause production router patch added `seat-options` to the allowed `/rooms/CODE/(...)` action matcher. It did not change seat logic, cards, artwork, settings, assets or bindings.
5. **Version 40** `dd4dbc6c-4640-4d84-a91c-15148de87a49` was created undeployed and confirmed to retain:
   - `ASSETS` binding with unchanged runtime asset routing;
   - `ROOMS` SQLite Durable Object namespace `bb1bf1c32b68451cbe5db6fee3066fa0`, class `RoomDO`, declarative export intact;
   - `TEST_GATE_KEY` secret_text binding intact without accessing or exposing secret;
   - `ENTRY_LIMIT` namespace `14784620261020` at 12/60s;
   - `ACTION_LIMIT` namespace `14784620261021` at 360/60s;
   - compatibility date `2026-10-14`.
6. Version 40 was deployed at 100%, and the exact active deployment was confirmed.

## Production smoke tests PASSED on Version 40
**Executed against live `https://rooks.jeromegriffin.com` using only temporary QA rooms, cleaned up after tests:**

- **Server join and conflict test:** host create HTTP 201; read-only seat-options HTTP 200 returned seats 1, 2, 3 open; guest explicitly claimed seat 2 HTTP 201; another guest competing for seat 2 was rejected with `SEAT_OCCUPIED` HTTP 400; same guest with valid resume token rejoined original seat 2 even when passing a new seat preference; host snapshot HTTP 200 reported phase `waiting`, 2 players seated; QA room closed HTTP 200. Result `pass:true,closed:true`.
- **Realtime WebSocket test:** after joining seat 2 in a distinct QA room, guest requested `/ws-ticket` HTTP 200, opened an authenticated WebSocket connection, received a `snapshot` of phase `waiting`, and host closed the QA room HTTP 200. Result `pass:true,closed:true`.
- **Actual in-game guest UI test:** a third QA host created a temporary room; a separate browser render opened the branded invitation `?room=CODE`; the interface displayed the seat picker, `Take Your Seat` initially disabled, then enabled upon selecting `Host's partner`; guest confirmed name, joined and arrived on the real waiting screen with `2 of 4 seated`; guest credentials contained seat 2 and a seat token; host closed the temporary QA room HTTP 200. Result `pass:true`.
- Branded game page and original workers.dev game page both returned the real House of Rooks game HTML, HTTP 200.
- Room-specific Facebook preview page served approved `https://jeromegriffin.com/images/rooks-v1.jpg` to Facebook user-agent; normal `/rooks` share page still includes approved photo and title.
- Branded `cloudflare-entry.js` share override and pre-join identity confirmation remain in place; no second game asset pack was created.

## Reconnect rules and compatibility
- New invitation guest chooses name/avatar, selects an open seat; backend validates seat atomically and rejects a just-taken seat rather than silently moving the guest.
- Host's original seat 0 is not claimable by an incoming player. Host's partner is seat 2 (logical server indexing); seat 1 or 3 is an opponent seat.
- Existing tokens reclaim a reserved seat; new guests cannot take an occupied or already-started seat.
- Older clients not sending a requested seat are still supported by the legacy first-available fallback.
- Branded invitation `https://jeromegriffin.com/r/CODE` continues to auto-open the correct room; Facebook robots see OG metadata rather than executing the redirect.
- The original workers.dev origin is **still usable** for existing players. Local browser storage, PWA shortcut, offline caches and saved progress do **not** automatically transfer to the new domain; do not auto-redirect existing users or clear service workers.

## Still not certified
- Physical owner Android Facebook in-app invite-to-room flow with the new live v40 release; an actual phone is needed for final visual sign-off.
- Multi-minute/background network suspension, reconnection after Android sleep, different mobile providers/devices, full bidding/nest/trick/scoring match on Version 40; initial WebSocket snapshot and waiting room were verified, not a complete live multiplayer game.
- Do not call the whole game final/release certified based on the focused seat selection tests.

## Recovery and authoritative sources
- **Rollback via Cloudflare Deployments API:** deploy Version 36 `3df448a2-83f0-4fd0-be97-665a067848de` at 100%. Rollback does not erase or rewind Durable Object data.
- Do not deploy v37 `0b8ef900-e73e-4a72-8853-f1c17d43289f` (missing RoomDO export); v38 and v39 are superseded by v40.
- Master Brain AH: `brain/current.json`.
- Branch `work/jeromegriffin-domain-setup-20261022`: `coordination/domain-20261022/ROOM_INVITE_SEAT_SELECTION_HANDOFF.md`, `coordination/domain-20261022/SEAT_SELECTION_V38_RELEASE_GATE.md`, and `cloudflare/isolated/seat-selection-full-game-sandbox-20261022.mjs` document full isolation testing and prior checkpoints.
- Live Cloudflare worker `griffin-house-of-rooks-online` Version 40 is the authoritative exact runtime source. `rooks-seatflow-isolated-20261022` is a separate sandbox Worker with distinct SQLite room namespace and shared read-only game assets, NOT the live Worker.
