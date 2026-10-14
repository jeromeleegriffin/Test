# Angle C trump placement checkpoint — 2026-10-14

Owner selected the low-angle C camera. This is an isolated presentation study, not a playable game or deployment.

## Changes
- angle-c-trump-geometry.js: positions the existing case and real stamp mask on C's visible felt.
- trump714-angle-c-study.js: isolated copy of fallback trump714.js with adapter hooks for activation, placement, geometry and mask painting. Existing selection, confirmation and ceremony remain.
- trump714-angle-c-study.css: isolated landscape presentation of the original asset-based case.
- angle-c-trump-fit.html: preview integration. Dedicated trump container prevents choose() from clearing Bid Box controls.
- qa/trump-c.cjs: touch-driven browser checks.

## Executed
PASS Chromium mobile/touch 740x360: red selection, single callback, stamped red mask, rotation to portrait and back without duplicate callback, return to bidding and +5 from105 to110, repeated green selection.
PASS confirmation bounds and submission at667x375,844x390,1024x600,1280x800.
PASS zero captured JavaScript page errors.
Visual inspection at740x360 identified case obscuring stamp contact; moved case upward and stamp to visible felt and reran checks.

## Limits and next action
This is not authoritative game integration. Sample hand repeats card faces. C scene uses a fixed cast; player identity selection and separated artwork remain unfinished.
Portrait in this harness is not a portrait-game acceptance test.
No full game, bot, network or Android device test was performed here.
Preserve actual portrait renderer and original trump714.js; integrate adapter only into isolated landscape branch after validating the public-view state boundary.
Re-test real bidding-to-trump transition, remote bidder ceremony, all colors and speed settings after integration.
Study depends on local artwork in assets/angle-c and reference-cards plus original source assets. It is not a standalone HTML deliverable.

## Baseline and rollback
Official fallback b551144768084fc81c12de03682eae4e78f8e600 remains unchanged.
Source trump714 assets and source code are from that pinned fallback.
Working branch work/overhead-landscape-20261014 only.
Revert this study's commits or use previous checkpoint5e7076ab904f2b0a0f5d4f2e992ede269c70913e.
No build number, ZIP, deployment, Master Brain publication or production change.
