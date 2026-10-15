# Stage 6 — angled C live cast and human bidding path

Isolated development checkpoint, 2026-10-15. Not deployed, owner-approved, or release-ready. No numbered game ZIP created. Parent checkpoint: 96bc11011ddc1ee57d7eae584d46d0cefbdb475f. Continue existing work; do not rebuild or overwrite a newer branch.

## Assemble and roll back
Start with the preserved runtime b551144768084fc81c12de03682eae4e78f8e600 (805-ownerreview / 805-atmosphere1) in a separate directory. Apply integration.patch to that original runtime, not to an already patched stage. Copy the three angle-c files and assets directory beside index.html. sha256.json lists the exact nine resulting runtime files. All other baseline files and existing character artwork remain required. The cumulative patch was applied to original copies and all four outputs compared byte-for-byte successfully.

Rollback: retain the original runtime and prior branch checkpoint; discard only this separate assembled candidate. Do not reset main or another specialist's work. The original rollback/pre-landscape-20261014 remains protected. Complete-bank and chat-continuity rules remain in coordination/PRE_LANDSCAPE_FALLBACK_20261014.md; read that authority in full on recovery.

## Exact runtime changes
Modified: index.html, game060.js, trump714.js, approved-bid-portrait.js.
Added: angle-c-runtime.js, angle-c-runtime.css, angle-c-characters.js, assets/angle-c/room-table-plate-v1.png, assets/angle-c/jerome-rear-source-v1.png.
The character layer reads actual public roster and existing avatar assignments. It does not alter hands, game actions, bot strategy, audio, career data, or rules. Existing handlers own bidding, discarding, trump, card play, menus, leave, and career cards. Existing character PNGs are reused; no generated replacement identities.

## Confirmed corrections
The human discard sheet extended outside landscape: sixteen cards now fit eight columns by two rows, with confirmation visible. The trump selection panel was behind the landscape theater and unable to receive touches: landscape stacking corrected. Trump stamp canvas was hidden behind the table: moved into landscape rendering layer and restored to body in portrait. Full player-name targets open the actual player's career card and remain visible until dismissal. Front holder lip and live hand alignment adjusted. Scene occlusion uses existing raster artwork with a preliminary polygon mask.

## Executed tests
PASS: patch reconstruction and byte comparison of all four modified original files.
PASS: human bid 195 through existing +/-5 controls, select six of sixteen discards, green trump selection and play, at 1x 740x360, 3x 1024x600, MAX 844x390. MAX also completed the hand through score. Actual opponent identities and loaded avatar assets verified. No JavaScript errors.
PASS: navigation test at 844x390, 667x375, 740x360, 1024x600, 1280x800; 48px Menu/Leave targets, human bidding navigation lock, menu dismissal preserves hand, cancel leave preserves hand, confirmed leave returns to lobby.
PASS: all four full-name targets open the correct persistent career card; closing preserves hand.
PASS: portrait/landscape transition during human bidding preserves exact cards, selected bid, phase and turn; complete hand to score, score details fit without scrolling, next hand starts.
Tests use Chromium touch emulation with service workers blocked and normal-window viewport transitions. These do not prove Android fullscreen behavior. Test scripts accompany this checkpoint; install Playwright and supply qa/chromium before running from the workspace whose landscape-work/integration directory contains the assembled game.

## Remaining work and release limits
Only Jerome has a rear-view local artwork asset. Other local identities intentionally show an artwork-pending notice rather than the wrong person. No new generation was authorized in this stage. Existing frontal poses and preliminary occlusion require owner visual review; special poses such as Cobalt may need individual fitting. Opponent card counts/backs are not integrated. Local-seat rotation and multiplayer privacy need runtime verification beyond earlier presentation-model tests. Physical Android, full match, live multiplayer, browser suspension and service-worker installation/cache update are NOT TESTED in this stage. New asset precaching is not yet release-integrated. This is source preservation, not proof of a complete landscape overhaul. No Test or production deployment and no Master Brain promotion.
