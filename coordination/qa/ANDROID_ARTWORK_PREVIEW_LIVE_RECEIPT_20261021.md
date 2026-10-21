# Griffin House of Rooks — Isolated Android Artwork Recovery Preview
Date: 2026-10-21
Status: PUBLISHED_ISOLATED_TEST_ONLY — AWAITING_PHYSICAL_ANDROID_ACCEPTANCE

## Test link
https://griffin-rooks-art-recovery-test.jeromeleegriffin.workers.dev/

Cloudflare Worker: griffin-rooks-art-recovery-test
Worker deployment: 2653aea3-eca1-4322-82db-982f7872cf0c
Worker version: ecb7b405-5340-4d03-96b1-58bedcfa783f
Worker source: coordination/qa/android-artwork-preview-worker.js (isolated branch)
Workers.dev: enabled; preview-version routes: disabled

## Exact sources
Original game assets + scripts: immutable Test commit 90078a710948c7643caafb18986e34dc71ce7cee
ONLY asset-loading772.js: repaired, reviewed branch commit 8a9ea83a3e197c48519695181bffcac716ea3cd5
HTML has a test-only title and test-only disabled service-worker registration to prevent a new 1472-item cache install. The initially disabled Friends-form action was repaired on this test-only Worker: Play With Friends now explicitly navigates to the existing working online multiplayer Worker, preserving create-room intent. This does NOT run multiplayer inside the artwork-preview Worker. Original approved game files and physical card assets remain untouched.
No private credentials, rate-limit or room bindings. The preview's own room API stays disabled; Play Now operates offline with three bots, while Play With Friends opens the separate existing live online Worker. Test and production sites unaffected.

## Hosted tests
- Latest hosted GitHub Actions check: https://github.com/jeromeleegriffin/Test/actions/runs/39659987165 (SUCCESS)
- Verified direct isolated Cloudflare test status endpoint, immutable SHA pins, repaired loader file, approved Bid Box CSS, preview HTML, no service-worker control, zero browser errors.
- An automated normal user Play Now click (after Preparing the House finished) reached a real bidding phase with 10 cards and 10 decoded card faces in mobile-width Chromium.
- The prior direct offline-hosted smoke test also reached 9 cards during the deal with 9 decoded assets, consistent card widths and no worker control.
- Previous isolated local Chromium tests: https://github.com/jeromeleegriffin/Test/actions/runs/39655606641 (SUCCESS), including original text-bird fallback then recovery, both critical CSS recoveries and actual 10-card sizing.

## Non-destruction confirmation
Live online Worker griffin-house-of-rooks-online latest deployment a319e805-c76c-462b-a18b-c59498a188d9; version f9fd3cd5-67a1-49ae-850d-7c2ca60c1ad7 at 100%, UNCHANGED after test deployment.
Neither GitHub live Test main nor Production repository or other current sites were modified by this Worker publication.
Saved live multiplayer rooms untouched; no service worker cache cleared.

## Owner validation needed
Open the test link on Android while on strong Wi-Fi. Wait for Preparing the House to finish, then press Take Your Seat / Play Now. Play a few tricks, optionally turn Wi-Fi off then back on, and verify real bird art/card faces and the full Bid Box recover normally without reload or losing play. The preview's game is offline-play-only; the Play With Friends button now leads to the existing live multiplayer site, where preview artwork-recovery changes do not yet apply. This is not a multiplayer artwork-recovery or installed-PWA cache test.
If any problem, send a screenshot and say the step. Do not clear Chrome cache.
No three-site deployment should occur until owner acceptance and coordinated rollback planning.

## Friends button regression repaired in isolated preview
- Root cause: First preview version deliberately replaced the native Friends form action with '#', and a capture-phase click blocker prevented Play With Friends from doing anything. That was incorrect UX for this test copy.
- Initial restoration of form action alone did not make early clicks reliable. An explicit capture-phase action on the test-only HTML routes Play With Friends and join-confirm actions to the existing online Cloudflare Worker. It preserves #create=1 or room-code intent and normal player name, while keeping the test room API disabled.
- Cloudflare test Worker deployment: b5f63794-65ed-45d2-89f6-706412b250e3; worker version d491ab29-0bb8-4b92-a783-49d7c9d16d35, updated 2026-10-21. Live multiplayer Worker was not redeployed.
- Verified the actual Android-preview Play With Friends click in hosted Chromium: https://github.com/jeromeleegriffin/Test/actions/runs/39664668498 — SUCCESS. The test waited until Preparing the House finished, clicked the real button, intercepted navigation before it could reach the live service, and verified the online Worker destination plus #create=1 intent. Zero live room requests occurred in the test.
- Normal Play Now also continued to pass: 10 cards decoded and bidding phase reached.
- This fixes the unresponsive preview button, not the independent in-game multiplayer artwork test. Do not claim the repaired preview image loader was deployed to the live online Worker.

## Single-loading entry correction, 2026-10-21

The previous artwork-preview URL first loaded 100+ native artwork files, then Play With Friends navigated to the real multiplayer Worker which loaded its own assets again. This duplicated downloads because the hosts differ and cannot simply reuse each other's in-memory loading state.

Solution deployed ONLY to `griffin-rooks-art-recovery-test`: root `/` and `/index.html` now serve a lightweight no-artwork choice screen. Play With Friends opens the existing multiplayer Worker directly with `#create=1`; Join by Code preserves the 8-character room code and opens the online Worker; Play Offline opens `/game`, the full native R10 artwork test with repaired `asset-loading772.js`. The choice screen loads zero artwork, external JavaScript, or stylesheets and registers no service worker.

Only one game-loading sequence occurs on each initial path after mode selection. This does not unify the two separate website origins or make artwork downloaded during a later cross-mode switch reusable. That deeper architectural change would require a planned integrated site release.

Cloudflare test-only script deployment `4106e659a14240a88fefe17ab7182274`, unchanged live game assets and room namespace. Hosted end-to-end smoke https://github.com/jeromeleegriffin/Test/actions/runs/39672564477 SUCCESS: normal Play Now on `/game` produced 10 decoded cards, root Play With Friends made only one preview document request then navigated directly to the live multiplayer destination (navigation intercepted in test; no room created), and root Play Offline reached `/game` with the repaired loader initialized. No additional game-artwork requests before choosing Friends.

Physical Android acceptance remains necessary; no real-cellular claim.
