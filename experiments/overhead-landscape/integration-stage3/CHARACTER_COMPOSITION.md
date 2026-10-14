# Existing character artwork at C: composition checkpoint
No deployment, ZIP or live runtime replacement. Continues d7d4ad9ef056adf90e533912220e14ac79cd0b0b.

Reused existing transparent Jerome rear artwork without image generation or file editing. Positioned scene x336 y510 width1000 (original 1672x941 aspect). Partial cap/head and hands visible below holder; card faces remain clear. Source copied to integration/assets/angle-c/jerome-rear-source-v1.png for local test serving.

Tested real current character pose files Anchor left, Copper top, Barrel right over the C empty table. Existing portraits can form an upright-seated alternative to the mockup's forward-leaning cast. No identity re-generation or substitutions. This is an unapproved composition study, not proof the pose matches the approved C reference perfectly.

Raster table plate masks lower bodies using a preliminary polygon, not final pixel-tight rail occlusion. Corrected initial Copper head crop and side images bleeding into scene letterboxes. Current placements in 1672x941 coordinates: left(-80,100,600 wide), top(666,-30,340 wide), right(1152,100,600 wide). Crops restrict source images to scene bounds.

Browser checks: local-avatar fixture and three-character fixture each pass 20 holder/viewport fit cases (4 viewport sizes times 5 card counts). These assertions cover card fitting only, not avatar geometry, identity routing or gameplay. Visual inspection at844x390 performed for 10 cards; local-avatar 3-card frame also saved. No new full-game regression claimed.
Files: qa/holder-c-avatar-fit.cjs, qa/cast-c-fit.cjs; c-avatar-holder-fit-results.json, c-cast-fit-results.json; screenshots c-avatar-holder-10-cards.png, c-avatar-holder-3-cards.png, c-cast-fit-10-cards.png, c-cast-fit-3-cards.png.

Next implementation must map opponent IDs through existing playerAvatars/roster to relative-seat poses, never hard-code study cast. Bottom rear support currently only Jerome; missing other identities must remain explicit, not use Jerome universally. Final edge occlusion and live interaction tests needed before replacing stage2. Preserve original stage2 as rollback.
