# Cloudflare-only R10 staging acceptance checkpoint

Date: 2026-10-21
Status: ISOLATED_STAGE_ACCESSIBLE; AUTOMATED_BOT_ROOM_AND_NATIVE_UI_CHECKS_PASSED; LIVE_UNCHANGED

This document supersedes the earlier staged-migration note that described the access prerequisite as incomplete.

Staging: https://griffin-rooks-cloud-only-stage.jeromeleegriffin.workers.dev/

The access prerequisite is now configured successfully through the connected Cloudflare account. Staging public URL was enabled while version preview URLs remain disabled.

Browser QA: https://github.com/jeromeleegriffin/Test/actions/runs/39686370322
- Original approved R10 landing UI and integrated native game present.
- Both approved bird/card assets and portrait Bid Box CSS served by Cloudflare Static Assets.
- Play With Friends activates same-origin room creation without a second document navigation. QA intercepted room writes.
- Repaired graphics retry system initializes and page emitted zero JS errors.

Isolated stage room QA: https://github.com/jeromeleegriffin/Test/actions/runs/39686677683
- Created a staging-only multiplayer room, filled bots and started a hand.
- Verified X1 online v2, same seat, same hand and private snapshot protection after reconnect.
- Test room closed after QA; no production multiplayer action was made.

Staging and live have distinct Durable Object and rate limiter namespaces. No source changes to original approved landing or game assets. The staged runtime does not fetch files from GitHub.
Physical Android, weak cellular, full multi-device playthrough and voice acceptance remain unverified.

DO NOT promote to the live Worker on the strength of limited tests alone. Maintain exact rollback to the current live deployment until final owner acceptance.
