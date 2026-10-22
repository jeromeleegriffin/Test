# Emergency handoff: Cloudflare connector scope failure (October 22, 2026)

## Current blocker

Owner supplied `84783.jpg`: ChatGPT's **Connect Cloudflare** dialog reports **"This app does not provide a browser setup URL right now."** Read-only Cloudflare API checks in the recovery chat failed **HTTP 403**: the connector connection was **not granted a Workers scope** accepted by `/workers/scripts/.../deployments` or `content/v2`. **Do not assume that means the public game is offline.** GitHub tools still work, and the source/handoff is intact. Do not claim that current live Cloudflare deployment was directly verified after this 403.

## Latest accurate state from GitHub (verified this recovery chat)

- Master Brain `brain/current.json` on `main` showed status `BRANDED_V10A_DIRECT_TO_REAL_WAITING_TABLE_LIVE_SMOKE_PASSED; PHYSICAL_FACEBOOK_ANDROID_ACCEPTANCE_PENDING`.
- Branch: `work/jeromegriffin-domain-setup-20261022`.
- Complete notes: `coordination/domain-20261022/ROOM_INVITE_SEAT_SELECTION_HANDOFF.md`, especially the **last section**: `Owner-requested v10a direct-to-existing-table invitation`.
- Latest recorded deployed, browser-tested branded-only Worker JS: `coordination/domain-20261022/rooks-branded-entry-v10a-direct-table-seats.js`. **Do not restore v7/v8/v9 giant invitation forms.**
- Most recently known main game Worker version: `dd4dbc6c-4640-4d84-a91c-15148de87a49` (v40). Verify once Cloudflare access returns; don't redeploy stale copies.
- Separate draft, not authoritative live version: `cloudflare/isolated/invitation-real-table-v10-candidate.js`; latest branch candidate was checked in this recovery turn and contains repaint/click-capture changes, but don't misidentify it as the deployed source.

## Locked owner decision

A Facebook invitation already identifies a table. User flow should be **tap Facebook invite → the ORIGINAL approved friends waiting room/table with the original player name/avatar controls → tap an OPEN 'Sit here' button ON THE TABLE → server atomically seats player → play**. **Do not show/edit room code, do not add separate seats form, extra confirmation UI, partner chooser, old-name prompts, old-room rejoin blocker, or force game assets to reload.** Retain approved 1200×630 Facebook image `https://jeromegriffin.com/images/rooks-v1.jpg` for general `https://jeromegriffin.com/rooks` and room links `https://jeromegriffin.com/r/CODE`.

## QA from latest authoritative handoff

- Isolated full-game v10a stage: typed guest name, tapped existing partner 'Sit here' seat, joined seat 2, waiting UI 2 of 4 seated.
- Branded production scratch-room smoke test in handoff: SMO38 recorded guest joined seat 2, 2/4 waiting; scratch tool Worker deleted. Do **not** claim the test rooms were explicitly closed; cleanup attempt was blocked.
- SMO40 browser check: original name field in waiting-room dock, room-code controls hidden, actual open seat position at top, stable Sit here label.
- Physical Facebook Android acceptance for v10a remains unverified in notes.

## Next safe action

1. Read Master Brain and latest main GitHub handoff **before doing anything**.
2. Restore Cloudflare plugin authorization with relevant Workers permissions through a supported connection flow; the current UI may be unable to provide a browser setup URL. Avoid requesting user secrets. If scopes remain 403, do **not** attempt deployment.
3. Verify live game Worker/version and branded override read-only once access returns.
4. Test real Android Facebook invite without altering production game assets/rooms. Repair only regressions confirmed against the current v10a.
5. Preserve existing DO `ROOMS`, `ASSETS`, `TEST_GATE_KEY`, rate limit bindings, old `workers.dev` shortcuts and player progress. No SW clearing.

This status note supplements the full `ROOM_INVITE_SEAT_SELECTION_HANDOFF.md`. No Cloudflare changes were made during this emergency recovery.
