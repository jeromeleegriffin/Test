# Griffin House of Rooks | CURRENT HANDOFF | 2026-10-22

**CONTINUE, DO NOT RESTART.** The owner reached a chat limit and requested this handoff. As of the latest Cloudflare check, live game Worker `griffin-house-of-rooks-online` has version `dd4dbc6c-4640-4d84-a91c-15148de87a49` (v40). Branded invitation override Worker `rooks-branded-entry-only-20261022` has marker **`20261022-v10a-direct-table-seats`**, not the old v9 giant form. DO NOT DEPLOY an older candidate over v10a.

## Owner's LOCKED requirement
Facebook room invitation → the **existing approved waiting-room/table** (no extra homepage, no giant join form, no visible editable room code) → guest chooses name/avatar in a small accessible area → guest taps **Sit here** on a real available seat → authoritative server reserves precisely that seat → native waiting room resumes, same HTML document and assets.

The user emphatically rejected former giant forms, duplicate seat lists, confusing `last name` prompt, redundant room-code input, old reconnect messages, overlapping controls and moving/cutoff fields. Keep approved blue-felt/wood/fireplace table artwork, layout, game avatars/asset sizes and original Bid Dock intact. Never generate/reinterpret that art, clear SW, reset DOs, or redirect existing `workers.dev` players. No automatic asset duplication.

## Verified today
- Production Worker unchanged by handoff task, active game version `dd4dbc6c-4640-4d84-a91c-15148de87a49`.
- Active custom hostname `rooks.jeromegriffin.com`; short social invitation URL `jeromegriffin.com/r/CODE` directs human guest to it.
- v10a current override confirmed through Cloudflare, backed up at `coordination/domain-20261022/rooks-branded-entry-v10a-direct-table-seats.js`. Its direct prejoin flow uses the original `#waiting` table and `#waitSeat0..3`, read-only `/rooms/CODE/seat-options`, real `#hor-player-name` and `.identity-choice` controls. Guest seat tap claims `preferredSeat` through native Cloudflare `window.joinRoom()` and uses actual server result; no second HTML load.
- Saved full QA already reports isolated full-game guest join and live branded smoke: guest tapped partner seat, got seat 2, real waiting screen showed 2/4, normal game art loaded and name field was visible. **Physical Android Facebook WebView acceptance still pending.** Do not present browser simulation as owner phone testing.
- Game's DO binding `ROOMS`, `ASSETS`, `TEST_GATE_KEY`, `ENTRY_LIMIT`, `ACTION_LIMIT` retained.
- Facebook OG for both `https://jeromegriffin.com/rooks` and `https://jeromegriffin.com/r/CODE` returns approved 1200×630 JPEG: `https://jeromegriffin.com/images/rooks-v1.jpg`. Do not post publicly for owner.
- v10a isolated test Worker was deleted. Prior QA mentioned two scratch production rooms that were **not explicitly closed**; rely on idle expiry and do not claim otherwise.

## DO NEXT (not already completed)
1. **Owner's actual Android Facebook WebView:** host fresh real table, share newly created room link via Invite→Share on Facebook, click from Facebook. Confirm no room-code field or duplicate seat list; name field focuses and keyboard works; avatar chooser works; only available real table seats say Sit here; tap partner/opponent seat, correct name/seat and waiting count appear. Capture any failure and fix only on current code, with no new mockups.
2. Verify second device and reconnection after background/resume or network switch, seat conflict handling and expired-room messages.
3. Plan explicit, opt-in old `workers.dev` localStorage/XP migration later. Do not force redirect, uninstall shortcuts, clear browser state or overwrite rooms.
4. Keep Master Brain handoff updated after actual device acceptance.

## RECOVERY FILES
- Repo: `JeromeLeeGriffin/Test`, active branch `work/jeromegriffin-domain-setup-20261022`.
- Main coordination pointer: `brain/current.json`, Master Brain AH and customDomainSetup.
- Long authoritative chronological handoff: `coordination/domain-20261022/ROOM_INVITE_SEAT_SELECTION_HANDOFF.md` (read **latest v10a tail**, older earlier statuses are historical).
- Current branded v10a source: `coordination/domain-20261022/rooks-branded-entry-v10a-direct-table-seats.js`.
- Live v40 main Worker backup: `cloudflare/isolated/live-v40-worker-20261022.mjs`.
- Reliability report: `coordination/domain-20261022/V40_LIVE_RELIABILITY_QA_20261022.md`.
- General domain notes: `coordination/domain-20261022/BRANDED_LAUNCH_QA.md`.
- Earlier v10 prototype `cloudflare/isolated/invitation-real-table-v10-candidate.js` is NOT the live source and must not replace v10a.

## Immediate next-chat instruction
First read this file, `brain/current.json`, and last section of `ROOM_INVITE_SEAT_SELECTION_HANDOFF.md`. Check Cloudflare current deployment and branded override marker in case another chat moved forward. If still v40/v10a, prioritize only real Android Facebook invite and reconnect acceptance; do not restart project. Stay coordinated with concurrent project work.

All status claims are as-of 2026-10-22.