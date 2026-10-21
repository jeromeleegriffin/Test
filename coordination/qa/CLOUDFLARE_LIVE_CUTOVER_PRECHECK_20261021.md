# Griffin House of Rooks — Cloudflare-only live migration precheck
Date 2026-10-21
Status: LIVE PRECHECK PASSED; PROMOTION PENDING (this record contains no live deployment claim)

## User approval and protected game
Owner authorized full Cloudflare move, confirmed original approved landing and staging feel working, and instructed continue.
Existing live Worker: griffin-house-of-rooks-online
Protected current Worker version: f9fd3cd5-67a1-49ae-850d-7c2ca60c1ad7
Protected deployment: a319e805-c76c-462b-a18b-c59498a188d9
Original live RoomDO namespace: bb1bf1c32b68451cbe5db6fee3066fa0, class RoomDO, backend use_sqlite=true
Live rate limit namespaces ENTRY_LIMIT=14784620261020, ACTION_LIMIT=14784620261021
Private session secret name TEST_GATE_KEY exists on live Worker; secret value never inspected.
Preserve both GitHub Pages game hosts and installed SW caches completely unchanged.
Pinned original source for game HTML/images/sounds: 90078a710948c7643caafb18986e34dc71ce7cee

## Ready staging evidence
Staged Cloudflare Worker griffin-rooks-cloud-only-stage is separate; verified old staging DO namespace 73951bbcd9264dd2b5ca1db9b0ac67f7; no live rooms touched.
211.05 MiB, 1,634 original source files, SHA-256 manifest and 1,472 cached dependency paths audited.
Static asset API 200 correct MIME / original premium Black Bird Red Two Bid Box CSS audio.
Staging X1 full match success: https://github.com/jeromeleegriffin/Test/actions/runs/39689357218
Staging UI/landing/friends same-origin success: https://github.com/jeromeleegriffin/Test/actions/runs/39686370322
Staging room/reconnect X1 v2 success: https://github.com/jeromeleegriffin/Test/actions/runs/39686677683
Wrangler production-config dry run with 1,805 assets, exact original Worker name, existing rate limiter namespaces, REQUIRED TEST_GATE_KEY and SQLite RoomDO export passed without warnings: https://github.com/jeromeleegriffin/Test/actions/runs/39689819023
Production config: wrangler.cloudflare-only-live.jsonc
No legacy migration array or namespace creation requested; exports.RoomDO explicitly maps type durable-object/storage sqlite. Cloudflare docs say this change from old migration configuration does not change existing namespace data. Existing live DO binding class is preserved.
Keep compatibility date 2026-10-14 same as currently live; keep workers_dev true; keep_vars true; keep required existing TEST_GATE_KEY.
Worker runtime: full X1 v2 source with only three pinned GitHub source reads changed to env.ASSETS.fetch. No browser/backend runtime GitHub fetch remains.
Cloudflare stage rollback-route rehearsal: POST /accounts/.../workers/scripts/griffin-rooks-cloud-only-stage/deployments specifying the **same already-live staging version** at 100% succeeded, returned deployment 6a1a4b1d-9dde-4532-8e83-8d861860cc5a. No state change.

## Live rollout procedure and gates
1. Manually deploy pinned isolated-branch build via account's existing Cloudflare Builds token, not GitHub Actions. Do NOT configure push auto deploy to live; manual trigger only and path filters that never match regular commits.
2. Read live Worker deployment/room namespace/secret binding immediately after deploy; require identical namespace ID, rate-limit namespaces and existing TEST_GATE_KEY; if missing/different, immediately roll back to f9fd3cd5-67a1-49ae-850d-7c2ca60c1ad7 at 100% and stop.
3. Hosted mobile-sized actual native landing and Play With Friends same-page navigation, one offline hand, exact approved Black Bird/Red Two/Bid Box/audio, no browser errors.
4. Real live service should still support existing room code and seat continuity; test separate fresh isolated live room only if warranted; NEVER close or reset user's existing rooms.
5. Rollback POST /accounts/{accountId}/workers/scripts/griffin-house-of-rooks-online/deployments {strategy:'percentage',versions:[{version_id:'f9fd3cd5-67a1-49ae-850d-7c2ca60c1ad7',percentage:100}]}.
6. Do NOT alter GitHub production/Test main or service worker code during this migration.

## Unverified after automated checks
Physical Android weak-cellular recovery / long suspension / 4 actual humans on distinct networks, uninterrupted ambient sound on phone, installed PWA cache upgrade, performance benchmark on user’s network. Preserve these as follow-up QA, not claims.

Never disclose a secret value or treat tests against staging namespace as verification of old user rooms.
