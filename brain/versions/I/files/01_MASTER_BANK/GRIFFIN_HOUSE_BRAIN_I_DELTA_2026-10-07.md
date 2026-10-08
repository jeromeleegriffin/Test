# Griffin House Master Brain I — documentation delta
Date: 2026-10-07 (America/New_York). Owner: Jerome Griffin.
Status: frozen documentation publication. Not a game deployment. Not a visual redesign.

## Pointer facts verified this session
- Brain repository: jeromeleegriffin/Test, main was 71a7ed0f731c32aeaf997dafd29dd002e95522e3 before this publication.
- brain/current.json before this publication: brainVersion H, updated 2026-10-07, checkpoint ROOK037, checkpointStatus AWAITING_PHONE_REVIEW.
- versions present before this publication: C D E F G H. No Brain I existed. I is the next unused version. H was not overwritten.
- Live game repository main HEAD verified: 542d7d5be8a5183b5d759cfcdc15051529d777a1.
- Commit message: "Port ROOK044 room-state cleanup to live 531."
- Files in that commit: game.js and polish.js only. This Brain publication does not modify them.
- Live table: https://jeromeleegriffin.github.io/Griffin-House-of-Rooks/
- On-screen version intentionally remains v531.

## Highest-priority owner confirmation
At approximately 11:01 PM Eastern, October 7, 2026, Jerome explicitly said: "I verified it and it fixed the issue on 5-31 also."
Record: R531 room-state issue is OWNER-VERIFIED FIXED.
Earlier statements that the R531 push was blocked or pending are historical and superseded by Mark's deployment report plus this owner confirmation. Do not ask Jerome to repeat the same confirmation.

What that verification covers: the ROOK044 room-state cleanup on the live 531 table. Leaving an offline game no longer leaves a stale room flag that blocks the next Play with Friends host. It does not convert every visual or audio change inherited into ROOK044 into an accepted phone pass. Multi-device joining, reconnect during play, host migration, long sessions, and every network failure mode were not established by this package.

## R401 network rewrite — HELD
Jerome said R401 worked smoothly and proposed reverting networking to match it if the targeted fix failed. He agreed to try the targeted fix first. It worked in ROOK044 and now in R531. The broad R401 networking replacement was not performed and is not the current next action. Preserve R401 as historical fallback/reference. Do not start a rewrite automatically.

## Baseline discrepancy — do not hide
The compact 046.zip Brain H text snapshot contained no ROOK037 identifier. The live repository Brain H does contain versions/H/files/01_MASTER_BANK/GRIFFIN_HOUSE_ROOK037_CONTINUATION_2026-10-07.md and current.json already pointed at that checkpoint as AWAITING_PHONE_REVIEW. The snapshot is recovery evidence, not permission to downgrade H. ROOK037 remains awaiting phone review for badge, compact Nest pile, and faster dealing. Room-state success does not close that visual review.

Historical H publication identifiers recovered from the handoff, not re-verified as the current pointer commit: candidate d390a06a55f58a4633eea4ddcada0967c56e053f and pointer 490e1bf74121da12e4ae44e338a7fe72a1a38fde. Current main before this publication was 71a7ed0f731c32aeaf997dafd29dd002e95522e3. Do not treat the older SHAs as the live pointer.

## Post-H recovered development ledger
These entries came from recovered conversation summaries, not inspection of the corresponding build ZIPs. A reported code check is not a phone pass.

- ROOK025: documented banked phone-tested Last Trick placement. Actual Android pixels are the placement authority. Do not recenter or reconstruct it from X/Y. Visual checkpoint, not a direction to roll the active line backward.
- ROOK026: reported 44 asset-first numbered card faces, shared normal-hand/discard assets with independent sizing. Jerome reported the cards still messed up. Not an accepted success.
- ROOK027: reported table-plane perspective/landing, clipping corrections, warmer gold. Phone acceptance not recovered.
- ROOK028: reported legacy image inset removal and bottom-avatar centering attempt. Phone acceptance not recovered. Do not promote a centering attempt into a new avatar-design lock.
- ROOK029: reported revised avatar centering, visible Last Trick X and automatic refresh. Phone acceptance not recovered.
- ROOK030: reported Last Trick X and table-plane face-down stack/full-back artwork changes. Phone acceptance not recovered.
- ROOK031: reported table-plane Nest reveal; latest Last Trick retained across deals, X dismissal, updates while open. Phone acceptance not recovered.
- ROOK032: reported X moved to the left of the Last Trick group with cards unchanged. Explicit owner test not recovered.
- ROOK033: reported Nest reveal lowered to Griffin-head alignment, flat dealer-style wash shuffle, approved Griffin back restored. Phone acceptance not recovered.
- ROOK034–ROOK037: build-by-build evidence not recovered in the 046 ledger. An unpackaged 6/9 underline change was mentioned; do not assign it to a build or declare it approved without source evidence. Live H does contain a ROOK037 continuation written October 7; that file is more specific than this gap note and remains AWAITING_PHONE_REVIEW.
- ROOK038: Jerome authorized approximately 40% smaller visible brass controls, separate larger touch targets, faster dealing. Packaging reported without deployment. Authorization is established; a separate final phone pass was not recovered.
- ROOK039–ROOK040: build-by-build evidence not recovered.
- ROOK041: assistant reported 2.55-second crowd reaction, softer audio, hand stabilization, visible card travel, and an avatar-loading fix. Final phone acceptance not recovered.
- ROOK042–ROOK043: build-by-build evidence not recovered.
- ROOK044: targeted room-state cleanup OWNER-VERIFIED WORKING, including offline, Leave, Play with Friends. R531 port now OWNER-VERIFIED FIXED.

Do not manufacture missing build descriptions. Do not equate the successful ROOK044 room test with acceptance of every visual or audio change inherited into that build.

## Last Trick — current lock
Explicit LAST control beside 1× | 3× | MAX. Compact N/W/E/S four-card group with simplified number/color faces, no written color words, no large black panel. X is the close control. Review remains until X under the recovered accepted direction. Later automatic updates and retention are reported implementation details pending source confirmation.
ROOK025 actual phone group placement is locked. Historical target X68/Y389 referred to the center of the whole group, but accepted actual pixels supersede coordinate reconstruction.
The old portrait Last 3 pill and invisible center-table-tap experiment are obsolete. Do not resurrect them.
Repeated mapper failure selected table-felt instead of an independent Last Trick group and moved unrelated elements. Preserve independent grouping. If exact placement repeatedly fails again, remind Jerome early: "Let's get Mark to do the exact placement."

## Card holder — banked plan, not integrated
Brain H MASTER_BANK.md section 6 contains the plan. It is BANKED, NOT YET INTEGRATED. No implementation proof was recovered in this handoff.
A separate shallow physical object: dark polished wood, thin warm aged-brass edge, recessed dark card channel, dimensional bevel/highlight/shadow, rounded form, clean top edge. Cards remain dominant. No protruding Griffin ornament. No bridge, connector, pedestal, or filler joining it to the Bid Box.
Preserve actual card position, spacing, behavior, AUTO MAP, and protected Bid Box geometry. Respect the visible felt gap. Design around real locked responsive gameplay geometry. Avoid one giant fixed tray image if it fights that geometry.
This is the roadmap item to revisit after continuity. Recover the latest actual runtime before implementing. Do not replace newer hand behavior with a reconstructed old baseline. No image generation unless Jerome says Generate.

## Deck and visual authorities carried forward
Image assets stay in Brain H / the existing repository bytes. This delta does not regenerate them.
Normal default numbered deck: warm ivory/cream textured stock, thin bronze/gold border, one large colored number with RED/GREEN/YELLOW/BLACK beneath. Clean no-word deck is an alternate. Compact Last Trick faces are a separate presentation.
Locked base palette: red #E11D2E; green #0E8F3E; yellow #FFD51A; black #0B0B0B.
H's ROOK037 continuation separately records a muted yellow print treatment #B88B18 for numbered faces. Do not blindly restore loud yellow card faces, and do not treat that continuation as phone-approved.
Preserve premium Red 2 and black bird masters. Do not regenerate or place "Rook" on the black bird. ROOK037 continuation says current default runtime birds are clean warm ivory with no gold decoration and no lettering on the black bird; original-art optional mode remains separate. Actual shipped assets outrank prose.
Do not confuse Select 6 cards to discard with the normal hand.
TABLE-003, accepted physical perspective, B Natural Toss landing, and 15%-smaller played-card size remain protected.
Preserve calmer fireplace/room, personas, Bid Dock, gameplay, sorting, speed engine, and accepted geometry.
Landscape remains deferred. Do not revive unfinished landscape work during this sync.

## New operating rule
Every handoff to anyone must be a ZIP containing the complete recipient prompt and all newly required supporting files. Jerome should only have to forward the ZIP. Never require a separate copied message or prompt outside it.

## Evidence preserved, not reapplied
Mark's exact note and patch are in files/04_MARK_EVIDENCE/. The patch is evidence of an already-applied fix. Do not apply it again.

## Known gaps
- ROOK026 through ROOK043 phone acceptance is largely unrecovered, except the ROOK044/R531 room-state path.
- ROOK037 visual/pace/badge review is still open.
- 046.zip omitted the historical image backup. H artifact SHA-256 e5fe4e526d40d4ee8baea74aad06a774e8b74d4fa59b47b764647db43b7b5f4a remains the foundation archive pointer. This publication did not replace that archive.
- This session verified the GitHub commit and pointer. It did not run the live game on a phone.
