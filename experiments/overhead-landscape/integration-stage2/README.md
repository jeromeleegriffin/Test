# C played-card placement checkpoint

October14,2026. Isolated development only. No Test deployment, ZIP or build number. Owner's publication hold remains.

## Changes since stage1
- game060.js: add two presentation data attributes to existing landscape played-card wrapper: actual relative seat slot and existing horCurrentHandVisualIndex/player/card identifier. No engine state or action logic changed.
- angle-c-runtime.js: position existing played-card nodes on C felt with deterministic small offsets and seat-facing rotations: bottom-10,left100,top175,right-75. Real existing card pixels preserved. Card width110 scene units; projected vertical flattening0.62. Bottom placement moved from465 to440 sceneY to clear enlarged hand.
- angle-c-runtime.css: scope absolute played-card placement to C landscape; hide obsolete order/badge decorations. Prior no-scroll score-detail corrections included.
- integration-c-trick.cjs: browser regression using actual offline engine and UI taps.

Recovery: use pinned fallback b551144768084fc81c12de03682eae4e78f8e600, apply this directory's cumulative91-line angle-c-integration.patch (NOT on top of stage1 patch), copy its runtime JS/CSS, and use existing clean C artwork path from stage1 README. Stage1 remains a rollback checkpoint. Full current runtime remains local landscape-work/integration.

## Tests and findings
Initial four-card screenshot inspected; all four relative seats rendered and hand completed. Found undefined game.handNumber in new key and changed it to existing horCurrentHandVisualIndex(). Found bottom played card nearly overlapping enlarged local hand and moved it upward.
Final844x390 mobile/touch run: four distinct seats, all four positions/angles present, valid hand keys, card rectangles within viewport; real card artwork including red2 rendered. Same-size resize event while waiting on human preserved exact keys/x/y/angles. Real hand reached score and Next Hand entered dealing. Zero captured JS errors.42 raw tap attempts include engine-rejected taps during existing lock, not42 accepted plays.
An earlier test incorrectly compared pre-collection nodes with an empty post-collection DOM after20ms at MAX. Corrected test measures redraw synchronously during a human decision; did NOT alter trick timers to pass it. Another fast run did not capture a four-card frame and is not a four-card verification. Final run did capture all four.

## Remaining
Geometry is implemented and internally checked, not owner-accepted pixels. Full device matrix and orientation during capture remain unverified. Fixed cast backdrop still not actual selectable characters; artwork separation and roster identities are the main unfinished visual integration. Do not ship generic cast as final. Score detail/history/remaining pages, achievement-toast overlap, menu/status/seat touch layout, human trump/discard paths, full-match/physical-device/offline-service-worker tests remain. No new artwork generated in this stage. Portrait styles remain scoped out; previous rotation test evidence retained.
