# R5 fullscreen / clean player-package handoff — 2026-10-20

Continue from the preserved R4 complete-game ZIP. This is separate from Cloudflare multiplayer and has NOT been deployed to Pages, production or Cloudflare. No root game files on main or the premium-integration branch were modified by this repair. The isolated branch stores this R4-to-R5 patch and evidence, not a claim that its base RC3 root is the full R5 runtime. Use the complete R5 ZIP as source authority.

Playable ZIP: Griffin_House_Fullscreen_Repair_Clean_Game_20261020_R5.zip
Library ID: libfile_1ad71b8ddee8819195b2758537cb991a
Bytes: 164743496; SHA256: e2238fd2034a656d89a94febff085ed7889f364889010555a341e79a202f71a4
Original R4 Library ID: libfile_307eb24be414819187e0b0f3441e6fda
Original R4 SHA256: d9883684ccb5b7b6b30a5b83a10f5edcb05503e52eeb5865991f8a646232c996

## Cause established before modification

R4's room controller set HORManualFullscreen831=true before native requestFullscreen resolved. Legacy resize/orientation/game hooks and an ordinary-pointerdown hook could call requestFullscreen again while fullscreenElement was still null. A controlled pending-native-entry reproduction issued three requests from three legacy sync calls. The controller also lacked an in-flight entry/exit guard. This proves a repeat-request race, not that it conclusively caused the owner's persistent Android Chrome notice. The browser's own security overlay cannot be inspected in desktop mobile emulation.

## Repair

Legacy game/viewport fullscreen hooks now repaint only; the ordinary-tap entry hook is removed. Native entry/exit remains in the explicit fullscreen button controller, which rejects overlapping operations and synchronizes intent to the actual browser state on success, error and fullscreenchange. Browser dismissal stays dismissed. Orientation unlock is retained after successful explicit entry. No approved visual assets, geometry, bidding, network code or trick-win flash were redesigned.

APP_VERSION, index asset-query versions, hor-version and service-worker build/cache identity advance to R5. Service-worker activation retains previous caches; no unregister, storage clear, XP/career/settings reset or physical-device clearing was performed.

## Executed verification

- Reproduced R4 repeated requests with native entry held pending.
- R5 deterministic regression: passive layout hooks; one pending entry; one pending exit; external dismissal does not auto-enter.
- Real desktop Chromium native fullscreen API, mobile touch viewport393x844 and tablet768x1024: explicit entry, exit, external browser exit, landscape/portrait metrics and ordinary taps. Two entries/two exits per context, no unintended extra requests, zero page errors. Actual rendered screenshots inspected.
- One complete native offline hand at MAX,10human card plays, visible scoreboard, zero page errors. Native score: Griffin5 /Raven195, Raven made100, red trump. This is a hand, not a full match.
- Initial browser automation tried desktop window resizing while truly fullscreen; Chromium rejected Browser.setWindowBounds. Corrected test uses device-metric/orientation emulation without resizing the native fullscreen window. This was a harness failure, not a passing test or gameplay patch.
- All R4 assets/, voices/ and x1/ entries checked byte-for-byte unchanged. Existing aliases preserved.
- ZIP integrity passed; index.html at root;1510files; no REPAIR_VERIFICATION folder. Manifest rebuilt for shipped files.

## Packaging cause and result

Earlier Four_Pass ZIP339,300,400bytes; R4 ZIP415,622,447bytes. Compressed REPAIR_VERIFICATION grew from174,360,964 to250,607,706bytes; that explains almost all the increase. Runtime compressed size remained about164.7MB. Confirmed identical asset aliases account for only1,405,005compressed excess bytes and were not deleted because references may depend on their paths.

R5 player ZIP164,743,496bytes, down250,878,951bytes(60.4%). Original R4 remains the comprehensive archive preserving all prior tests and approved checkpoints. New R5 screenshots/receipts are preserved separately as a verification archive, not packed into the player game. README is included inside the player ZIP. This ZIP remains compatible with the original Loader entry arrangement.

## Limits / next step

No physical Android Chrome security-notice acceptance. Do not claim that the owner's stuck browser notice was physically reproduced or dismissed. This removes the confirmed game-side repeated-entry path while preserving deliberate native fullscreen. No deployment authorized in this repair; owner approval remains necessary before publishing this UI candidate. Do not merge it into the separately functioning Cloudflare beta. Keep all permanent actual-pixels, preservation and failed-fix rules.

Rollback: original R4 ZIP unchanged, with its exact checksum above. Do not delete its evidence or substitute older RC3 root files for R4.
