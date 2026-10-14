# C holder fit study
Continues layer checkpoint add026d1f5fdddf90d59ad4d72035a3c2f0bc184. Owner allowed continuation if holders look right.

Visual judgment: retain current holder artwork. Side holders follow table perspective; front holder is larger naturally. A separate front-lip overlay uses the same raster plate pixels with a CSS clipping boundary (no CSS furniture drawing).

Executed browser visual fixture, not gameplay: 20 cases = 667x375, 844x390, 1024x600, 1280x800, each with 11/10/6/3/1 cards. Copies real card markup after actual offline dealing and loads existing game styles. All source images must decode successfully. Asserts card row stays inside holder and viewport. Inspected 844x390 screenshots for 10 and 3 cards; actual numbers and shrinking-hand growth are visible, and the raster lip covers card bottoms.

Discovered spacing overflow in initial fixture: card gap added outside the available width. Correct formula includes gaps inside 620 scene units and scales gaps with scene. Current visual candidate baseline is scene Y700. These geometry/lip adjustments are NOT yet applied to the playable runtime because local avatar foreground and holder layering must be composed together. Existing stage2 remains intact.

Files: qa/holder-c-fit.cjs; c-holder-fit-results.json; c-holder-10-cards.png; c-holder-3-cards.png. Added local integration/assets/angle-c/room-table-plate-v1.png for test serving only; no runtime reference changed.
No game state edits, no new generated image this stage, no ZIP, no deployment.
Next: compose actual local/avatar layers with this lip, then migrate tested geometry and verify actual card touch targets.
