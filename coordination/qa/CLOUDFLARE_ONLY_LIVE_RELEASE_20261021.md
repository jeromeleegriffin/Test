# Griffin House of Rooks — Cloudflare-only LIVE release receipt
Date: Wednesday, 2026-10-21
STATUS: LIVE_DEPLOYED_AND_HOSTED_QA_PASSED (physical Android testing on new live delivery not yet completed)

## Definitive live
**Canonical URL:** https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/
Live Cloudflare script: griffin-house-of-rooks-online
Cloudflare Builds build UUID: 90580151-e1a5-4993-8e83-bc80376f6efc
Live version: 8b220d87-1d24-4c13-88ad-368c858445b9
Live deployment: 47148f9e-8ad2-443f-b871-72536dc4b13a
Traffic: 100%
Source development commit deployed: f6c8e34179694648cbd7da8c6b8e7ef2ce79e463 on work/asset-recovery-20261021
Cloudflare native build command: bash coordination/qa/cloudflare-native-build.sh
Cloudflare manual deploy command: npx --yes wrangler@4 deploy --config wrangler.cloudflare-only-live.jsonc
No public change to the original approved landing, physical card or Bid Box artwork, voice and ambient assets, or full X1 v2 code. The separate Android preview and GitHub Pages sites were not redeployed.

## Static assets
Runtime package: 1634 approved files, 211.05 MiB, all 1472 originally referenced service-worker dependencies confirmed.
Native game approved source SHA: 90078a710948c7643caafb18986e34dc71ce7cee.
Isolated weak-cellular image/CSS recovery asset-loading772.js packaged from work/asset-recovery-20261021, original non-UI design retained.
Two index.html GitHub runtime reads plus one GitHub asset proxy rewritten to env.ASSETS.fetch, no GitHub runtime fetch. Direct GET of actual live Worker source after deployment confirmed 'raw.githubusercontent.com' ABSENT, ASSETS.fetch PRESENT, RoomDO and CLOUD_GAME_ADAPTER PRESENT.
GitHub remains source-control backup and source of future deployment builds, not the runtime file origin.
No new landing chooser, game HTML from original source, same-origin offline and multiplayer.

## PROTECTED LIVE ROOM NAMESPACE (independently compared before/after)
Before AND AFTER: namespace bb1bf1c32b68451cbe5db6fee3066fa0, class RoomDO, backend SQLite true.
ENTRY_LIMIT namespace 14784620261020 unchanged.
ACTION_LIMIT namespace 14784620261021 unchanged.
TEST_GATE_KEY secret binding preserved; secret value not accessed.
Compatibility date 2026-10-14 unchanged.
Current Worker has ASSETS binding in addition to preserved settings.
Original prior live version remains available for rollback, including existing room-state namespace.
No rooms or player data were reset or migrated.
The production config moved RoomDO to declarative exports type durable-object/storage sqlite, mapping existing class without new SQLite namespace creation.

## Exact rollback target
Previous stable version: f9fd3cd5-67a1-49ae-850d-7c2ca60c1ad7
Previous deployment: a319e805-c76c-462b-a18b-c59498a188d9
Manual Cloudflare API: POST /accounts/{accountId}/workers/scripts/griffin-house-of-rooks-online/deployments
Body: {"strategy":"percentage","versions":[{"version_id":"f9fd3cd5-67a1-49ae-850d-7c2ca60c1ad7","percentage":100}]}
Rollback route POST was rehearsed successfully by redeploying same current version inside staging at 100%, without state change.
Production release trigger is MANUAL-ONLY with unreachable path filter; future GitHub commits do not automatically deploy production.
Release build trigger ID: ab50e26c-4a2b-4782-9372-2f29a7009199.

## Verified QA
- Full Cloudflare-only staging X1 game through completion, 3 bots, 1 human simulated, full score, 14 partner decisions, 0 bot fallbacks: https://github.com/jeromeleegriffin/Test/actions/runs/39689357218
- Stage native approved landing, premium art and audio, same-document friends route no JS errors: https://github.com/jeromeleegriffin/Test/actions/runs/39686370322
- Stage real room creation, start, X1 v2, same seat/hand on rejoin and room closure: https://github.com/jeromeleegriffin/Test/actions/runs/39686677683
- Production-config Wrangler dry-run with existing SQLite RoomDO mapping and identical rate limiter IDs passed cleanly: https://github.com/jeromeleegriffin/Test/actions/runs/39689819023
- **Actual live after promotion** premium Black Bird / Red Two / red-10 / Bid Box portrait CSS / voices all returned correct bytes and MIME; native R10 landing and friends same-document navigation passed, zero JS errors: https://github.com/jeromeleegriffin/Test/actions/runs/39690549207
- **Actual live after promotion** created a dedicated new QA room, filled bots, started a hand, confirmed X1-online-v2, rejoined same seat and identical hand, closed QA room; existing user rooms never accessed: https://github.com/jeromeleegriffin/Test/actions/runs/39690622516
- Queried actual deployed Worker source directly: no GitHub raw fetch link exists, Cloudflare ASSETS binding used.
- Exact prior DO namespace / existing TEST_GATE_KEY / original rate-limit IDs compared and confirmed preserved with new release at 100%.

## Owner check still valuable
Play directly at the single canonical Cloudflare URL, ideally on Android Chrome and tablet, with approved artwork, bird faces, sounds, and Play With Friends. Test weak Wi-Fi and cellular return without clearing service worker or reloading. If the old installed app points to GitHub Pages, it continues serving the protected GitHub version and has not been automatically migrated. This is an intentionally separate follow-up.
Do not claim physical real-network suspension or four-human multiplayer completed based only on hosted test.

## Persistent source of truth
Keep brain/current.json AG untouched unless a complete master-brain update is intentionally prepared from all existing authorities. This signed-off additive receipt lives in isolated branch as handoff/provenance. No direct GitHub Test main or production GitHub Pages deployment was performed.
