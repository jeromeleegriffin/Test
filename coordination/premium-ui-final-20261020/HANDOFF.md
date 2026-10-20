GRIFFIN HOUSE OF ROOKS — PREMIUM PORTRAIT REVIEW
Build: 846-premium-portrait-20261020-rc3

Open this ZIP in your existing ZIP Loader. The playable game is index.html at the ZIP root.
This is one complete game, with the repaired game source, original artwork/sounds,
and the approved premium scoreboard, utility buttons and walnut console.
No live server was deployed.

Completed changes
- Integrated the recovered approved physical PNG artwork into the maintained game.
- Kept Menu/Back at the top during real play using the optional native rail hook.
- Preserved native speed, Last Trick and Full Screen handlers.
- Added the real local 12-hour clock and live points needed to make/set the bid.
- Kept selected button sizes identical, including the Last Trick selected state.
- Fitted long scores/time within their actual rendered fields, and provided a
  compact top-control fallback when a short fullscreen viewport lacks console space.
- Kept the header clear of achievement notices; portrait awards display sequentially
  through the existing queue without removing awards or changing XP/career records.
- Fixed a reproduced startup race: the first Take Your Seat tap now resumes after
  character-art loading rather than being discarded while loading is busy.

Verification
Six independent real UI hands passed at 360x740, 393x852 and 430x932, in regular
browser and simulated installed modes, including a Shoot the Moon hand.
Covered actual bidding/confirmation, kitty, six discards, trump confirmation,
legal card taps, all speeds, Last Trick, Menu/Back cancellation, native fullscreen
enter/exit, scoring/Next Hand, rotation/return and worker-controlled offline reload/deal.
The complete runtime ZIP opened in the unchanged original Loader and dealt a real
hand. Extra 360x640 and long-text checks passed. Actual screenshots and raw results
are in REVIEW_RELEASE; open its index.html for the screenshot gallery.
ZIP CRC, all packaged member hashes and the source inventory were verified.

Limits
Browser/PWA simulation is not physical Android acceptance. Actual Android toolbar
placement, navigation/safe-area behavior, old installed-cache upgrades, subjective
phone audio, and real WAN multiplayer were not newly certified by this UI assignment.
The existing landscape hold remains. The lower console is shown when fullscreen
portrait has sufficient space; the compact header controls remain usable otherwise.
Normal full-match completion and every optional rule/roster combination were not
exhaustively replayed. Existing game rules, scoring and frozen intelligence remain.

Source and recovery
Runtime baseline: 92872799e09a92a9093346345219f6e743e1295f
Test main protected checkpoint: a10cf91d27a9e1b9fa9cf82129c307a4462b11ad
Review source: b94fca0a97378d7215b62fb1c263ae1966a1f48e
Rollback: Test branch rollback/premium-ui-pre-integration-20261020
No player data or service-worker caches were cleared.

CONTINUATION — DO NOT START OVER
Read current Test brain/current.json and foundational H through its current successor.
The completed premium UI is on work/premium-ui-final-integration-20261020.
Use the exact review source and SOURCE_MANIFEST; never replace it with the older
NoThunder review ZIP. The initial browser restriction was resolved using isolated
GitHub browser QA. Browser runs and full evidence are preserved on the review branch.
Initial test failures included a hidden returning-player name field, Tour races,
the native custom leave-confirmation panel, and the Loader's replaced iframe.
Those were harness corrections. The proven product startup race is separately fixed.
The layout's source asset PNGs, matching controls, rail hook, live objective,
clock and original handlers must remain. Never reinterpret or regenerate approved art.
This release is a review candidate, not authorization to promote/deploy it.
Keep all approved gameplay, landscape hold, saved data, original recovery archives
and byte-identical assets. Archive checksum/Library delivery receipt is recorded
in the review branch after packaging; a ZIP cannot contain its own final checksum.

PASS THE FOLLOWING RULES FORWARD VERBATIM IN EVERY SUCCESSOR HANDOFF:

PERMANENT COMPLETE MASTER BRAIN READING RULE

This rule applies to every future Zoey without exception.

Before beginning any Griffin House work:

1. Read the complete foundational Master Bank H, from beginning to end.
2. Read every subsequent published Master Brain version in chronological order, including I, J, K, L, M, and all future versions.
3. Read all relevant authority documents, approved design specifications, original reference materials, project ledgers, and unfinished-work records.
4. Identify which earlier decisions remain approved and which were explicitly superseded.
5. Never substitute a summary, version inventory, or latest delta for reading the actual documents.
6. Verify the current GitHub pointer and distinguish published documentation from playable game builds.
7. Confirm which documents were actually read and identify anything inaccessible or unverified.
8. Do not begin development until the complete project history and current assignment are understood.

PERMANENT SUCCESSOR REQUIREMENT: Every Zoey must include this entire reading rule in the next chat's handoff and startup instructions, and explicitly require her successor to pass it forward again.

PERMANENT, SELF-PERPETUATING CHAT CONTINUITY RULE

This rule applies to Master Control and every Griffin House specialist chat, now and in the future.

1. When a conversation becomes long or difficult to manage, proactively warn me and recommend a fresh continuation chat before important information is lost.

2. Before switching chats, prepare a complete handoff with the current Master Brain version, GitHub locations, approved decisions, locked designs, unfinished work, rejected attempts, verified game baseline, rollback files, ZIP packages, reference screenshots, restrictions, and next steps.

3. Provide one complete, ready-to-paste startup prompt for the next chat.

4. Every handoff and every new startup prompt MUST reproduce this entire continuity rule and explicitly instruct the next assistant to reproduce it again in its own future handoffs and startup prompts.

5. The next assistant must pass this same obligation to its successor, and that successor must pass it to the next, continuing through every future chat generation. Never allow the rule to disappear from the chain.

6. Preserve the continuity rule in every future Master Brain update. Do not shorten, silently omit, or weaken it.

7. Never rely on chat memory alone. Important decisions must be recorded in durable project documentation through the approved process.

8. At the beginning of every replacement chat, verify the current Master Brain and the inherited handoff before starting work.

IMPLEMENTATION REQUIREMENT:

Store this rule verbatim in Master Brain M.

Reproduce the entire rule verbatim in START HERE and in the ready-to-paste replacement-chat startup prompt.

Instruct every successor to reproduce it verbatim again in its own handoffs, startup prompts, and future Master Brain updates.

Do not replace the rule with a summary or a reference such as "same as before."

# PERMANENT UI VISUAL VERIFICATION RULE — Owner directive 2026-10-19

**Scope:** Griffin House of Rooks, every future UI/UX/layout/visual change, every specialist, successor chat, work session, branch, review ZIP, and deployment. This rule is mandatory, not an optional suggestion.

1. **The working screen wins.** Open and render the *actual modified game*, using its real artwork, cards, CSS, JavaScript, and UI at representative target device viewport dimensions. Never replace this with code inspection, syntax checks, generated mockups, or guessed geometry.
2. **Personally inspect before delivery.** Take real rendered screenshots and inspect them for clipped, mismatched, oversized, misaligned, overlapping, hidden or unattractive controls and unintended changes to approved graphics. Inspect until satisfied with the real pixels. Capture at least portrait regular-browser and installed/fullscreen equivalents, with top/bottom browser toolbars where applicable, and small-screen sizes. Include landscape/tablet when the change can affect them.
3. **Exercise the affected states.** For table controls, check bidding (including the Bid Box), active trick/card play, large score/race banner, menu, card hand, nest/discard, score/end-of-hand, selected speed states, and state transitions as applicable. Check that controls respond correctly and touch targets remain usable. Compare screenshots with owner-approved references and actual-pixels geometry.
4. **Fix and retest.** Do not ship while the inspected UI still has obvious defects. Retake screenshots after each repair. Verify no unrelated approved feature, asset, gameplay behavior, or screen has regressed.
5. **No unverified deliveries.** Before sending a ZIP/download or deploying UI changes, report which actual browser/viewport/device states were opened and visually checked, with screenshots/evidence and remaining limits. ZIP-integrity or JavaScript syntax success alone is NOT visual QA and cannot be described as a finished UI review.
6. **Browser blocked? Stop, don't bluff.** If an actual visual test cannot be completed, do not call the UI finished, do not package it as owner-ready or recommend deployment; explain the blocker and work toward obtaining a valid preview/testing route. Clearly distinguish local emulator/browser visual verification from physical Android acceptance.
7. **Owner approval follows verified visuals.** Do not silently overwrite approved artwork, change protected bid dock geometry, or deploy without authorization. Preserve rollback checkpoints.
8. **Permanent handoff obligation.** Record this rule in the current Master Brain and every successor handoff/startup prompt, carrying it forward verbatim or with full meaning intact. Every future agent must read and obey it before any UI task.

Reason: multiple October 19 portrait/fullscreen control ZIPs were delivered after only script/ZIP checks and revealed obvious scoreboard collisions, oversized and unequal controls, hidden utility icons, and missing lower-console elements during owner phone testing. The owner explicitly requires the assistant to catch these problems *before* asking the owner to download anything.

**Authority:** Owner directive of 2026-10-19. Does not indicate that current candidate UI or live sites are verified.

FINAL ARCHIVE: Griffin_House_Premium_Portrait_Review_RC3_20261020.zip
SHA256: 7871a34fe45f622798d1f024e0fd2c650f9ca9c8dba2063323fa26f89fb1dc0c
Library: libfile_5a1bf575abdc819186fe3d1d751d6726
Bytes: 215504982; ZIP CRC/all member hashes PASS; 1635 members.
