# Master Brain supplement — isolated House Effects 845 asset checkpoint
Date: 2026-10-19 UTC / October 18–19 Eastern.
Owner: Jerome Griffin. Current published Brain read: AF, October 18, 2026.
Documentation branch: work/house-effects-assets845-20261019.
This supplement does not replace AF or move brain/current.json. No live deployment.

## Exact foundation
Preserved 845.zip: 193187658 bytes; SHA-256 6dfd28b2d8dadbb0390b051bcaffa4c7138698045f992c8388af1a2eb45b9d2f.
Library libfile_14b9911e71788191993b618bf2336fcb.
Pinned source Test 26cf989cedfc6e7bde269f1b22690afeaa558a45, builds/845.
All 1642 original ZIP files are copied unchanged under baseline845/ in the review.
846-source-cleanup remains the separately published live release per AF. No 846 work was modified.

## Authority and reading scope
Current AF primary document and current GitHub pointer were read. Master Bank H Section 3 and Section 5 establish finished physical assets, with programmatic positioning/animation only. The actual-pixels rule forbids regenerating approved game art. The foundational H archive and primary I–AE text records were retrieved; their text snapshots are retained in the review. This is not a new exhaustive visual inspection of every historical binary attachment. Some large combined historical read output was truncated; do not claim this session completed an uninterrupted end-to-end review of every historical document.
The requested new artwork is explicitly authorized by this assignment. The three concepts are already selected; no new concept selection is required.
No screenshot-cropped shield, generated card or invented table is used as new production artwork.

## Created assets
- assets/griffin/griffin-seal-master.png: original independent generated shield; 1159x1358 RGBA, complete perimeter/tip. One master reused for all frames.
- assets/raven/raven-up.png, raven-mid.png, raven-down.png: individual 1536x1024 RGBA character pose images, generated separately and edited from the same master. No poster/sprite-sheet cropping. No playing card attached.
- assets/effects/gold-glow.png, gold-ripple.png, gold-flourish.png: independent procedural transparent light layers; no physical artwork is replaced by gradients.
- audio/seal.wav, raven.wav, trick.wav: separate 2.5 s stereo 48 kHz PCM16 mixes.
- Final Trick uses exact original red-10, black-13, green-5 and yellow-14 numbered card assets. Original 580x840 proportions are preserved. The quartet is a standalone demonstration, not a claim that these were the final four cards of a newly played hand.
- All original table, backs, characters and UI are retained through the untouched baseline845 game context.

## Review implementation
Root index.html; review.css; core.js; review.js. Individual buttons, shuffle next, auto three-effect sequence, pause/resume/stop, portrait/landscape/follow-device/rotate controls, mute/volume, reduced motion, safe-area overlay and transparent asset stage.
Actual-table context is an iframe using the unchanged original game. Open actual 845 table invokes its own offline entry. Freeze changes only the disposable in-memory review session (pause and mute), not its files. Effects are drawn in the separate parent overlay. No gameplay event hook/integration is installed.
Portrait and landscape use separate dimensions, shared assets and safe rectangles derived from the actual renderer when accessible. Timeline state is preserved on mode change/resize. Visibility loss cancels the effect/audio.
Original game context is large, so this review is intentionally not a small asset-only ZIP. The original approved 845.zip is not overwritten or re-created.

## Verification actually performed
- Exact source ZIP SHA-256 confirmed.
- Every included baseline file is compared byte-for-byte to the preserved ZIP.
- PNG RGBA inspection, dimensions, zero-alpha pixels, and border-alpha inspection. No significant subject pixels (>16 alpha) touch an image border.
- 1000 seeded shuffle bags x 100 cycles: all three once per cycle; no boundary repeat.
- Synthetic Node DOM/canvas tests: three timelines in both orientations; completion/cleanup; pause; rotate while paused; resume; automatic three-effect sequence; replacement; Stop; reduced motion; rapid sound replacement and mute. These are NOT actual browser/UI tests.
- WAV headers, duration, peak and RMS measured. No clipped samples. Actual listening/mobile acoustic balance remains unverified.
- Final ZIP CRC and included file inventory/hashes checked when packaged.

## Unfinished — do not promote to integration-ready
1. Raven body/head position and posture drift across the separately edited poses is still visible. Registration/crossfades reduce jumps but do not establish anatomical continuity. Final character cleanup or a rigid-body rig is required before production approval. First downstroke attempt is retained only as rejected evidence.
2. Existing inherited call is a recorded crow/corvid (qubodup/nigelcoop), not a species-verified Common Raven. Wing source is a natural pigeon flap. Preserve accurate provenance; replace the call if a literal raven recording is required. Do not invent source clearance or species identity.
3. Musical flourishes/chords and metallic impact are newly synthesized design candidates, not recorded orchestral performances or owner-approved sound. Prior synthetic-sound rejection is not overridden by this new candidate.
4. Actual portrait/landscape game-screen collision inspection, real playback, rotation during active playback, mobile controls, original ZIP Loader nested-iframe behavior, subjective sound and physical Android validation remain UNVERIFIED.
5. Actual prototype screenshots are NOT supplied. The browser's local file navigation was rejected by its security policy, local server was inaccessible to that browser, and preserved hosted /Test/builds/845/ returned 404. A local Playwright browser download also failed. No alternate browser bypass was attempted. Do not substitute a composited image for an actual screenshot.
6. No newly completed full hand, final-trick live-state adapter or integration is claimed.
7. Complete uninterrupted historical H-through-current reading remains a successor requirement; the current document and relevant asset authorities were read, but truncated combined historical output must not be mislabeled full review.

## Next work
Continue from these exact files; do not restart concepts or regenerate shield/cards/table. Refine raven continuity, approve/replace sound sources, run the review in a permitted browser, capture genuine portrait/landscape screenshots, test active rotation and phone/Loader behavior, then obtain owner asset acceptance before eventual integration. All three concepts remain approved.
Retain AF and live source untouched. No game build number was consumed.

## Rollback
Delete/close only this isolated review copy; original archive, current live runtimes, frozen historical Brain versions and player data remain unchanged. Documentation supplement is on its own branch, not merged. The ZIP contains status, source prompts, generated masters, source provenance, test evidence and the full unchanged 845 context.


Every successor must reproduce both complete rules below and pass this obligation forward.

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
