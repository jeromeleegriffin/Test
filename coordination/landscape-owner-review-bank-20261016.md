# Landscape review bank and shared trump-selection request
Banked 2026-10-16 America/New_York (2026-10-17 UTC).
Owner requested: "bank everything you found and all the ideas we're going to fix" while checking for more.
Status: documentation checkpoint only. Repairs paused; landscape deployment on hold. No new game ZIP or runtime deployment authorized by this bank.

## Approved artwork
Owner approved the final pose image: "Yep, I think we have it."
Generated source: exec-9fc07e27-1fe9-4b9d-a60f-c21d6761e7db.png
SHA256: 7c3b00d788400d40940e6bc69148e18fce31b04d2e3bc34f30f6f8bb5af22b30
1848 x 851, 1913508 bytes; generated image preserved in conversation.
Approval covers artwork only; not integrated or gameplay-approved.
All three adults need abdominal clearance from the table; top woman upright and sitting back, hands withdrawn for bidding room; one continuous rail, no doubled rear rail. Eyes open, naturally directed toward play without an intense direct stare. Standing direction: friendly, approachable, even lightly flirty. Earlier hunched, embedded, double-rail, direct-stare and nearly-closed-eye variants rejected. Preserve final approved image rather than regenerate casually.

## Source and prepared local fixes
Baseline 021(2).zip: 164403126 bytes.
SHA256 fc7b06add1ff2ccb3b68ff9b9225845ff7d5029a3a9e2977e7e09988cfec15bd
Library libfile_22e68bbcb5788191ba0c4a5768da86f2.
Existing record: landscape-repair-021-20261017.md.
Prepared locally only: larger felt trump mark with matched stamping contact; bid/Moon assembly enlarged 20% and positioned above hand; hidden captured-card wrapper/pseudo-element cleanup to remove residual glow.
Files: angle-c-runtime.js, angle-c-runtime.css, trump714.js.
Durable complete source/diff checkpoint: Landscape_Repair_Source_Checkpoint.json, Library libfile_e4c8e5a1e9dc819182514b54420b70ba.
JS syntax and controlled browser geometry/ghost checks passed. No final Android animation certification. Do not represent these as deployed.

## Findings and repair queue
1. Restore opponent Thinking, bid amounts and Passed statuses. Landscape CSS hides bid-board/grid and status elements. Human interactive bid controls do appear; not all bidding is absent.
2. Restore full dealing presentation. Landscape routes to legacy local-hand deal and bypasses all-seat/nest flights.
3. Restore approved signature shuffle. Landscape currently selects legacy wash rather than approved 168-frame presentation.
4. Register player names/levels to the approved scene: top label obscures face/chest, side labels sit low by rail.
5. Resolve static illustrated cast versus dynamic roster names/voices. Never silently change selected player identities.
6. Achievements are present: actual First Trick notice observed. Fix placement: toast covers top player face/name and remains above persona stat card. Level labels present; natural level-up not reached. Missing trophy glyph observed in headless Chromium only, not confirmed on Android.
7. Improve cramped kitty-received strip at top of discard: near-clipped label and tiny previews. Selection of six from sixteen and confirmation worked.
8. Integrate approved pose artwork; preserve locked 017/018 hand/grip approvals and established portrait behavior.
9. Recheck larger trump ink, bid/Moon assembly and capture cleanup through full animation sequences after integration.
10. Preserve banked local Lead pill and earlier pose-variant ideas in existing records; no new scope implementation in this bank.

## Three-hand evidence
Isolated 021-based candidate with three prepared fixes, older scene (approved artwork not integrated).
Chromium 844 x 390, fresh profile, service workers blocked; real UI clicks.
Hand 1 at 1x: human passed, bot bid120 yellow; scoreboard Griffin100 / Raven-120.
Hand 2 at 3x: human bid195, discarded6 of16, chosegreen; scoreboard Griffin-95 / Raven-40.
Hand 3 at MAX: human passed; scoreboard Griffin-95 / Raven160.
All three scoreboards reached in about209seconds, zero captured page errors, no freeze. NextHand and human controls worked. Top name tap opened correct persona/career card.
Durable report with results and harness: Landscape_Three_Hand_Audit.html, Library libfile_49bd5341a3f08191b4d5709ffafe414b.
Limitations: no physical Android, multiplayer, full-match, offline-cache or exhaustive animation certification. No natural level-up threshold reached. No additional defect should be claimed from untested states.

## NEW shared portrait AND landscape requirement: hand order for trump choice
Owner: "This is something that has nothing to do with just landscape. I need this on both landscape and portrait. When you get ready to choose trumps, I need you to arrange the cards in the hand. Of course, the black bird, red two first, and then in order of the most colors. That way they know real quick what to choose as trumps."
Status: BANKED_NOT_IMPLEMENTED.
At trump-selection time, arrange visible hand:
- Black bird first.
- Red two second.
- Remaining cards grouped by color, descending by number of cards in each color group.
Purpose: make the most numerous color immediately obvious before choosing trump.
Apply in BOTH portrait and landscape. Preserve existing within-color rank order; use existing color order as stable tie-break when groups have equal counts unless owner later specifies otherwise. Special cards shown first are excluded from remaining color-group counts. Presentation ordering only; preserve card identities, legal choices, rules, AI and selection state. Owner did not request a general permanent change to play-phase sorting.

## Next session
Collect additional owner observations into this queue before repairs resume. Then implement queued presentation restorations using existing approved sources, integrate approved art and validate complete hand transitions plus owner device review. Landscape remains isolated; this record does not approve deployment or whole-build acceptance. Shared trump-choice sorting is explicitly cross-orientation.
