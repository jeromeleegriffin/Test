# Griffin House of Rooks — Seat Choice Release Candidate 38 (2026-10-22)

## Current status
- Cloudflare **production deployment remains Version 36**: `3df448a2-83f0-4fd0-be97-665a067848de` at **100%**. No production deployment or state mutation was performed during this work.
- A **non-deployed** Version 37 (`0b8ef900-e73e-4a72-8853-f1c17d43289f`) was uploaded successfully but **must not be deployed**: inspection found `RoomDO` missing from `resources.script_runtime.exports`. Even though its binding pointed at the correct namespace, do not promote Version 37.
- The corrected **non-deployed Version 38** is `ef9d9b8d-2657-4f5e-ac8d-aca4686bb2ff` (same exact patched module as Version 37, but the necessary explicit declarative Durable Object export restored). It was uploaded via Cloudflare Workers Version Upload API with `bindings_inherit=strict`, `keep_assets:true`, `exports:{RoomDO:{type:"durable-object",storage:"sqlite"}}`, compatibility date `2026-10-14`. This is the **only acceptable candidate** among these two.

## Binding and metadata comparison verified (36 vs 38)
- `ROOMS`: `durable_object_namespace`, class `RoomDO`, namespace `bb1bf1c32b68451cbe5db6fee3066fa0` unchanged.
- `TEST_GATE_KEY`: `secret_text` binding inherited (the secret value was neither read nor exposed).
- `ASSETS`: existing assets binding retained; no image, audio or card assets uploaded again. Asset runtime settings match: `html_handling:none`, `not_found_handling:none`, `serve_directly:false`, `raw_run_worker_first:true`, `base_path:/`.
- `ENTRY_LIMIT`: namespace `14784620261020`, 12 per 60 seconds, unchanged.
- `ACTION_LIMIT`: namespace `14784620261021`, 360 per 60 seconds, unchanged.
- `resources.script_runtime.exports.RoomDO`: **present** with `type:durable-object,storage:sqlite` in Version 38, matching live Version 36.
- `compatibility_date`: `2026-10-14`, unchanged. Named exports include `RoomDO`.
- This was a version upload only, not a new deployment; no service-worker storage was cleared and old shortcuts were not redirected.

## Code content
- Based on **exact currently deployed Version 36 module** (`worker-cloud-only.js`) extracted from Cloudflare multipart source, not a stale GitHub Worker.
- Six guarded source changes (each matched exactly one occurrence): optional chosen-seat argument, atomic backend allocator, read-only `seatOptions`, DO endpoint, join forwarding, `SEAT_OCCUPIED` error.
- Replaced the embedded Cloudflare adapter with the saved **actual-r12-rebased** candidate at `cloudflare/isolated/seat-selection-adapter-r12-candidate-20261022.js`. The full patched JS module is 268,061 characters before packaging. The source map reference was deliberately removed rather than pointing at outdated line locations.
- Existing active room state and secrets untouched; approved Facebook artwork and `jeromegriffin.com` share pages unchanged.

## Full-game sandbox QA already completed
The distinct `rooks-seatflow-isolated-20261022` Worker served the real game HTML/assets through a Cloudflare service binding without duplicating assets; its own isolated SQLite Durable Object namespace handled testing. The actual game screen showed name/avatar, available seat choice, disabled `Take Your Seat` before selection; selected host's partner seat 2; server reserved that exact seat; game entered waiting with `2 of 4 seated`. Concurrent requests to same seat had one winner and `SEAT_OCCUPIED` for the other; reconnect retained seat 2, legacy join fallback worked, snapshot returned waiting state.

## Do not deploy automatically
Version 38 has matching binding/runtime metadata and passed the *isolated* functionality tests. However, Version URLs are **not generated for Workers implementing Durable Objects**, so this exact non-deployed version cannot be exercised with a normal version URL. Before owner-approved promotion: confirm no other game chat has deployed a newer version, verify real device join/rejoin and full WebSocket gameplay after staging, and compare exact active version ID. If the live version changes, stop and rebase instead of deploying 38.

Rollback if promoted: deploy recorded v36 ID back at 100% (Worker deployment rollback **does not** roll back Durable Object stored data). Do not erase data or clear service workers.

## Source of truth
- Source branch: `work/jeromegriffin-domain-setup-20261022`
- Prior QA: `coordination/domain-20261022/ROOM_INVITE_SEAT_SELECTION_HANDOFF.md`
- Full sandbox: `cloudflare/isolated/seat-selection-full-game-sandbox-20261022.mjs`
- Current adapter used: `cloudflare/isolated/seat-selection-adapter-r12-candidate-20261022.js`
- Live branded single-asset override: `rooks-branded-entry-only-20261022`, Version `20261022-v6b-prejoin-consent`; keep until production integration is verified.

## Version 39 improvement and release gate — 2026-10-22

**Do not deploy Version 37 or Version 38.** Both remain undeployed, and **Version 39** is the latest validated candidate. The production Worker continues to run Version 36.

- **Version 39 ID:** `aefaafd8-a522-4118-ac53-6b3d982591b3`. Successfully uploaded via the non-deploying Cloudflare Version API, with `keep_assets:true`, strict inheritance of all five existing bindings, and `exports.RoomDO = {type:"durable-object",storage:"sqlite"}`.
- Configuration inspection confirms the current production `ROOMS` namespace, asset runtime configuration, rate limits, secret text binding, compatibility date, and Durable Object class metadata remain present.
- One important reconnection edge was corrected: a returning player with a saved seat token can now tap **Rejoin my reserved seat** even if the table's phase is no longer `waiting`. New players continue to be blocked from claiming seats after the game starts.
- The corrected actual-r12 client adapter is preserved at `cloudflare/isolated/seat-selection-adapter-r12-reconnect-20261022.js`.
- Focused UI simulation using the *real extracted* `prepareInvitationSeats()` function passed three cases: started game with valid saved token offers an enabled rejoin; started game without token offers no join; waiting game without token offers three seat choices with no automatic reservation.
- The isolated full-game sandbox `rooks-seatflow-isolated-20261022` was updated to the corrected adapter; its backend concurrency test and actual waiting-room invitation flow remained working. Its current source is archived at `cloudflare/isolated/seat-selection-full-game-sandbox-20261022.mjs`.
- Disposable focused test Worker was deleted after the test. The full-game sandbox stays isolated with a separate `TestRoom` SQLite DO namespace and original game assets proxied rather than copied.
- **Owner approval and final live/Android verification are still required before Version 39 can be promoted.** Do not mistake creating an undeployed version for modifying the live game. The rollback target remains Version 36 ID `3df448a2-83f0-4fd0-be97-665a067848de`.

The high-priority code and server tests now pass. Remaining release validation includes a controlled cross-device session and a post-deploy verification of full gameplay, WebSocket reconnect, player identity, approved social share, and actual Android storage/origin behavior.
