# Griffin House of Rooks — consolidated release, 2026-10-20

CURRENT PLAYER ENTRY — ONE GAME
https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/
Use this one entry for Play Offline and Play With Friends. This is the authorized online beta, not a promotion to the public GitHub Pages games. Earlier separate R4/R5/R6/R7 and combined-R5 ZIPs remain rollback/history inputs; do not present them as the current combined online game. No new competing game ZIP was created.

CURRENT SOURCE
Repository: jeromeleegriffin/Test
Single integration branch: work/consolidated-r7-cloudflare-20261020
Native immutable runtime: 18cf361be26dd5d65b3c8aa384c2a5434f730a93
Adapter/server code commit: 93e881c0c3fd61762dd24ffe58b8d8b60d5d44d3
Formatting closeout: a608fa963c989fb7f73b939fc5653ff3d0782934
Native identity: 846-premium-owner-repair-20261020-r7
The branch continues combined-R5 head f9cd510db4af707aca15ac06a9b13a105c088a38, incorporates exact saved R7 runtime, and preserves Cloudflare code from 9b2258f632041fb7263586d1fe37dce26792844d. Do not restart from main or deploy the older roots of the R5/R6/R7 evidence branches.

LIVE CLOUDFLARE
Worker: griffin-house-of-rooks-online
Version: b579fde0-d6e1-4a42-b40f-aa85cd3ec7d3
Deployment: be6f5882-8a58-42ac-bc14-3ca82a56f8a6, 100 percent
Existing RoomDO SQLite namespace: bb1bf1c32b68451cbe5db6fee3066fa0
Existing TEST_GATE_KEY secret retained without reading its value; existing ENTRY_LIMIT and ACTION_LIMIT bindings retained. Compatibility date 2026-10-14 and migration tag v1 retained. No namespace migration or room reset. Version was staged first, then the beta updated with a check that its active version was still the expected rollback. Deployment and bindings rechecked afterward.

WHAT WAS COMBINED
Premium photographic UI/console, aligned controls, immediate trick-win cue, R7 real native fullscreen and separate Android Fit screen; server-authoritative room/turn/card/scoring/Moon handling, private hands and secure original-seat reconnect; QR invitations and close-table tombstones; bot selection/removal/swipe; shuffle/deal/nest reveal gates; paced bot decisions and voice queue; trump stamp hold; full fourth-card collection and bird fight; host-shared 1x/3x/MAX; lay-down presentation; unique opening IDs on redeals; no end-effect Skip button in the cloud entry.

REPRODUCED NEW BUG AND FIX
The injected Cloudflare adapter unconditionally replaced native claim/next-hand/leave handlers. An offline X1 bot reached a valid remaining-cards claim, its timer and pending decision cleared, but the cloud-only handler had no cloud credentials and the hand stopped. Local trace and actual screenshot preserved. Both adapters now call the original native handlers when no Cloudflare seat is active; cloud seats continue to send authoritative server actions. Native claim display/decline, next hand, leave and native waiting-seat fallbacks were restored. No intelligence or card-rule rewrite. A hosted offline hand then completed, reached the next deal and left through the actual confirmed menu action.

EXACT NET CODE FILES CHANGED FROM COMBINED R5
cloudflare/isolated/846-cloud-game-adapter-candidate.js
cloudflare/isolated/build-candidate.py
cloudflare/isolated/worker-candidate.mjs
cloudflare/live/adapter-live.js
cloudflare/live/build-live.py
cloudflare/live/worker-live.mjs
fullscreen-portrait-review.js
game060.js
hor-version.js
house-premium-ui.js
index.html
menu-approved805.js
room831.js
sw060.js
No asset, voice, X1, bots.js, rules.js or qrcode845.js net changes. Nine root files were restored for exact native-source construction, including the original holder-cues789.js bytes; formatting later returns that file to the combined branch's prior equivalent format, so it is absent from the net diff above.

PRESERVATION AND SOURCE CHECKS
All 1,508 native runtime files match the saved R7 ZIP at the immutable native commit, including unchanged approved artwork/audio/intelligence. Both builders and both adapter guards use that exact native identity and pin. Eight changed served runtime files were fetched from the new Worker and matched the tested native bytes. Generated server code outside the injected adapter and immutable asset pins is identical to the previous combined candidate.
The development branch formats seven root files for the existing source checks; JavaScript and inline-script ASTs, and normalized HTML markup, were verified equivalent. The live Worker still serves exact unformatted native commit 18cf361, not that formatting closeout. No redeployment or new behavior resulted from formatting.
npm run check passed locally: 67 scripts, 4,678 local bindings, entry dependencies, 1,471 precache paths, and full Prettier check. This is an executed local check, not an assertion about unqueried GitHub Actions status.

EXECUTED CURRENT HOSTED TESTS
1x: 2 simulated humans, target 100; 1 hands, 24 human actions, 3 reload/reconnect checks; winner Team B, scores [-195, 50].
3x: 4 simulated humans, target 100; 1 hands, 46 human actions, 3 reload/reconnect checks; winner Team B, scores [-195, 155].
MAX: 2 simulated humans, target 500; 3 hands, 74 human actions, 9 reload/reconnect checks; winner Team B, scores [-585, 360].
Total: 3 completed hosted matches, 5 hands, 144 recorded human actions, 15 reconnect checks; zero page JavaScript errors. Reconnect checks compare original seat and own hand during bidding, discard and play. Native visible controls drove game actions. Four-human mobile viewports included 320/393/430/768 widths and menu inspection.
Hosted security: 11 checks passed (missing/forged sessions, missing/wrong seat token, unauthenticated socket ticket, wrong-player bid, changed-command ID reuse, four disjoint own hands, single-use socket ticket, cross-origin write and hidden legacy route).
Hosted QR/share/close: QR decoded to exact invitation, guest joined through invite, both saw closure, old table credentials cleared, and a new distinct table was created. Test share sheets were intercepted; no physical camera/share-sheet certification.
Hosted offline: full native hand completed, four human card plays before the bots' native lay-down finished the hand; next deal reached and confirmed Leave returned to lobby; zero page errors. This verifies the earlier offline claim freeze is fixed.

LOCAL AND CONTROLLED TESTS — DO NOT COUNT AS HOSTED
Final post-fallback two-human/bot and four-human matches: one hand each, 24/46 actions, three reconnects each, no page errors. Earlier R7 integration runs also completed two short matches and a 5-hand target-500 match at 3x before the offline-only fallback correction; preserve these as earlier evidence, not extra current hosted passes.
Current generated service: 12 unit suites passed. Ten full accelerated-clock service matches: 2456 actions, 410 secure rejoins; these are reducer/storage tests, not browsers.
Controlled native bird-fight final-card scenes at 1x/3x/MAX show all four cards, real raven canvas draws, one finish/no cancellation, then scoring. Those bird scenes preceded the offline-only handler correction; cloud presentation code was unchanged. Current post-correction cloud lay-down scenes passed again at all three speeds. Current Moon confirmation emitted one bid/one howl and did not replay on reload. Moon success/failure, negative scores, zero-point lost-trick success, missed-counter failure, all-pass redeal, stale/duplicate/illegal actions and private-hand locks are covered by current service suites and prior retained rendered evidence.
Android-UA Chromium phone393/tablet600 tests: three actual native fullscreen entries and exits per context, labels, rotation, separate Fit screen exit and no automatic reentry; no page errors. Pending request/exit unit regression passed. These are desktop Chromium simulations, not physical Android tests.

FAILED/INCOMPLETE ATTEMPTS RETAINED
Normal Playwright CDN installation failed with truncated downloads. A packaged Chromium runtime was recovered; its unpack helper hit a chown limitation, resolved by extracting its supplied Brotli/tar files without ownership changes. Some initial QA imports still referenced the previous workspace; paths were corrected. A separately launched local server was unreachable across tool network environments; server and browser clients were then launched in the same process environment. These are test-environment repairs, not game fixes.
Offline pre-fix hand attempts stalled at a native claim. Later test-script failures incorrectly expected a native handNumber, selected a hidden paginated Leave button, omitted the game's visible Yes confirmation, and dereferenced the lobby during reload. Each was corrected to the actual visible flow and the complete hosted rerun passed. Formatting-proof setup initially treated wrapped HTML script closing tags as JavaScript and did not honor ignore rules; originals were restored, the proof parser corrected, frozen files byte-verified, and the full source check passed. No failed attempt is counted as a pass.

LIMITATIONS AND RECOMMENDATION
Ready for the owner's continued private/online beta using the one player link. Physical Android, independent cellular networks, real device speakers/share sheets/QR cameras, broad load and production-scale certification remain unverified. Chrome's browser-owned fullscreen warning may still persist on a physical phone; the real fullscreen button remains explicit, with Fit screen as the separate top-menu fallback. Do not claim that warning is fixed. Online bots remain simple server test bots, NOT X1; offline X1 source remains preserved. No broad public launch or production Pages promotion is recommended until physical-device/network checks and further beta feedback. Do not require the owner to repeat the automated match workload.

ROLLBACK
Only for the online beta, deploy previous version 0ddb4c03-6920-455a-aea5-4b16cd0ba766 at 100 percent through the existing Worker deployments API. Keep existing namespace bb1bf1c32b68451cbe5db6fee3066fa0, signing secret and rate bindings; do not reset data. Prefer finishing active beta tables first. Earlier rollback 0d499a95-f2fc-4a7f-8308-cec8215bda44 and original source rollback file remain historical.
Protected original griffin-room-local-poc remains version 7e57f6f5-9524-4456-96d2-379f406b2d01, namespace 4a45f65563174df6847cd5576973088a. Protected griffin-room-846-private-20261020 remains version 5cfd6814-3b3b-4916-80e6-1633a7d4449a. Their deployments were rechecked unchanged. Neither is a rollback target for the online beta.

CONTINUITY
Master Brain pointer remains AF; foundational H and published history remain intact. This consolidated release supplement is the current Cloudflare/UI continuation authority. Source/evidence is on the single consolidated branch; shared continuity pointer/document only were published to Test main, with no runtime/asset/Pages/production changes. Do not confuse documentation-only main commits with a game promotion. No careers, achievements, XP, settings, identities, browser service workers or caches were cleared. No secrets were published, no paid services activated, and no replacement art generated.

Source handoff/evidence commit: ebc38a37f001b18946df20a524f70f7d361dd841.
