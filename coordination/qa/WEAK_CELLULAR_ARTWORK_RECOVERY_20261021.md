# R10 weak-cellular artwork recovery: isolated candidate QA
Date: 2026-10-21
Branch: work/asset-recovery-20261021
Production untouched.

## Observed owner-device failure
- On extremely weak cellular during Wi-Fi switch, Black Bird and Red Two displayed text fallback until image loaded.
- Numbered card faces looked unusually tiny and approved bid-box art was incomplete.
- Game continued; reconnecting to Wi-Fi restored visuals.
- Do not treat the accidental MP4 as evidence.

## Source-level root cause
- rules.js / polish.js intentionally show generic text when card image errors and reveal image on successful load.
- asset-loading772.js prior production implementation retries card images twice on errors, then stops; online retry only responds to required-preloader failures, not all existing errored DOM images.
- approved-bid-portrait.js uses the approved artwork in an img with class approved-bid-art; it was not included in the prior inline image retry selector.
- Asset loader runs before polish.js and approved-bid-portrait.js, and installs capture-phase image event handlers.
- Temporary tiny-card sizing may involve CSS late-loading, not merely images; this candidate does not assert it is fixed.

## Candidate
Change ONLY asset-loading772.js. Preserve actual image DOM nodes; retry failed bird/numbered/bid-art images after online/focus/visibility/network changes. On load, remove failed status. Limit repeated focus/network retries to one per image per five seconds, preserve URL if stale retry timer fires, and avoid full page reload, storage clears or substitute art.
No changes to X1, artwork files, UI geometry, bidding, rooms, sw060.js, or live servers.

## Verification
- JavaScript compile test passed.
- Isolated event simulation: recovery on network event, five-second throttle, subsequent retry, successful-load reset, old retry timer guards all passed.
- Branch/main diff: only asset-loading772.js changed.
- Existing renderer classes verified in rules.js and polish.js; bid artwork class in approved-bid-portrait.js.
- This is **not** fresh actual Android/Chrome testing. Weak-network broken CSS and tiny-card face symptom remain separately unverified.

## Release gate
1. Exercise rendered game on portrait and landscape with intentionally rejected bird, card and bid-art requests; confirm dimensions and approved fallback behavior.
2. Restore network and confirm each image recovers in place without game reload or intervention.
3. Test disconnect/reconnect with gameplay and existing offline cached code.
4. Only after passing, owner approves coordinated three-site deployment. Preserve original R10 rollback and do not clear service-worker caches.

## Follow-up static style/asset audit
- index.html explicitly references asset-loading772.css and approved-bid-portrait.css. Both are listed in sw060.js SHELL; polish.js and premium Red Two/Black Bird images are also listed. No missing path found in this focused check.
- Generic BLACK BIRD/RED 2 text is the intentional fallback defined by polish.js. Image load handlers switch back to approved artwork on successful load.
- The image-retry candidate does not reload CSS, and therefore does **not** prove that tiny card faces are repaired. Preserve this as a separate browser/network reproduction gate, not a resolved bug.
- Existing sw060.js network-first stylesheet responses use cached CSS after failed fetch. An actual Android cache population and throttled network replay is still required.
