GRIFFIN HOUSE OF ROOKS — BUILD 757 ANDROID REVIEW CANDIDATE
2026-10-11 | Owner: Jerome Griffin | Main development continuation

757 is a complete isolated game candidate built from verified 755. Owner Android approval is PENDING. 751 remains the owner-approved working baseline. Brain W remains the published documentation authority; this package contains a publication-ready completion checkpoint, not a newly published Brain version. Production 531 and Player staging were not changed.

Open the ZIP-root index.html through the existing isolated game-review method, preserving every folder. HTTP/HTTPS serving is required for normal browser fetch/service-worker support. The new module and all eight WAVs are included in the offline shell. No owner browser data or service worker was cleared. Historical reports elsewhere in this ZIP describe their numbered builds, not 757.

NUMBERING CONFLICT RESOLVED BEFORE DELIVERY
The first tested integration was reserved as 756 and saved as 756(2).zip. This exposed two older, previously unregistered X1/X2 research archives named 756.zip and 756(1).zip. Both were recovered and have identical bytes: 9232568 bytes, SHA256 8242b13a51e4b304cf24076a2ef95962882da57f18a8f807db19140900750892. They contain research, not a runnable game, and were not merged. Their Library IDs are libfile_98c7c149ba288191953158e28818b27e and libfile_54d4fd6a35848191bcda9ad277553b2e. The saved main-game 756(2).zip is preserved as libfile_5136943126ac8191a125082d2e9de9e2, 290870045 bytes, SHA256 9f80bec7902f17b20e3ce3b842619aa206dd6ec1b43155bfb6feffab24aeeadf; it was NOT delivered as the selected review candidate.
Under the shared BUILD_NUMBERING policy, 756 is now CONFLICT_DO_NOT_REUSE. A fresh 757 reservation was committed and read back atomically. 757 has the exact tested runtime changes of the main-game 756 candidate; only build/cache/version labels differ. The detailed fixture screenshots/results retain their original 756 identity, and RENUMBER_RESULTS.json records the final 757 worker/offline check. No old research archive or saved 756 candidate was overwritten or silently renamed. Read reference/NUMBER_756_CONFLICT.json and reference/RESERVATION_757.json. Final deliverable is 757.zip.

COMPLETED SCOPE
1. Integrated the exact eight owner-approved TTSMaker clips. Chooser is game.bidder; avatar priority is playerAvatars[player.id], then player.avatar, then the existing fallback. Male fictional portraits retain the recovered casting set; female portraits and animal avatars use the female clips. Trigger is confirmed trump -> play, independent of stamp-contact timing. Existing stamp animation and sound remain intact.
2. Applied the recovered rail correction byte-for-byte: no idle lettering, clearance based on actual visible hand-card bounds, at least 8 CSS px above cards, and safe suppression when geometry leaves no room. Cards, table, avatar, holder and artwork were not moved.
3. Removed the rejected 104 x 30 bidding panels and reused the original compact .bot-thinking component, original CSS appearance and placement. The current actor uses the existing #botThinking element; other seats retain their bid or PASSED state in instances of the same small component. Portrait labels are Thinking…, YOUR BID, BID n, PASSED. No duplicate status layer or secondary bid line. Existing landscape auction state logic is preserved. No bid engine, rules, turn timing, bot strategy or network logic changed.
4. Added immediate cancellation for the real mute control, the existing host-waiting card-sound handler, the House Effects gameplay-volume-zero input and pagehide. The voice module reads the explicit gameplay volume so zero is not converted to one by the inherited generic gain helper. These changes are scoped to the new voice; no general House Effects rewrite.

SOURCE AND AUTHORITY
Repository: jeromeleegriffin/Test, branch main.
Full handoff: HANDOFF/BUILD_757/reference/INHERITED_W_STARTUP.txt.
Initial main SHA: a8a8fd2d9994c7b58465d19a4a1004100dace103.
Initial 756 reservation commit: 520c4c1d39bb9aac793f99d98e4f9eee722430c7.
Fresh 757 reservation/conflict-registration commit: dbf514ea55d53cebe1d473db358a98e7991e43dd.
Reservation ID: main-voice-small-status-20261011-6565ad6cab12-757.
Live main, brain/current.json and registry were rechecked before packaging. Brain W and 751 approval remain unchanged; 755 is pending and own 757 reservation was read back at commit dbf514ea55d53cebe1d473db358a98e7991e43dd. Delivery is recorded atomically in coordination/BUILD_REGISTRY.json and coordination/build-reservations/757.json. Read their live values for the final archive hash, byte count and Library identity; these cannot be embedded in the archive without changing its own hash. Never reuse 754, 755, conflicted 756 or 757. A next-number hint is not a reservation.

755 source: Library libfile_f911325210948191a590c5d70692d73e; 273390568 bytes; SHA256 b66c6861abd5439b752d31fb59ebb21f068295f4f46bd2ad1c678fb85a991867. Downloaded, hashed, CRC tested, then kept immutable. 1508 original files retained. 1499 original files were byte-identical before the latest HANDOFF entrypoints were updated; nine existing runtime files changed. Existing artwork/audio/shuffle assets are byte-identical to 755. The corrected 755 shuffle loader, source, CSS and atlases are unchanged; only their version queries advance to 757.
751 approved baseline SHA256: 986e027f24c8fc6ec75f2c56504b8b447e80425ef3b208833198aac0adcd8591.
TRUMP-VOICE-REVIEW.html: libfile_5c43ca8ca7088191af96e6fa6e980e55; 4014878 bytes; SHA256 264a717807dc9ef39718494891d37876207a5786d8bcc3c7dc65fc14fab56944. All 18 embedded hashes verified. Only the module/WAV delta was merged, never its older complete game060.js/index.html.
RAIL-CLEARANCE-REVIEW.html: libfile_265a22f1e0048191a5d161568f76f34e; 698187 bytes; SHA256 38622a777cbc3311027af6081690725c8e6382b1e0aefd8ddd4666f1db2a28eb. Both recovered rail files match the candidate exactly.
Two conflicting historical 754 archives remain distinct; their exact identities and rejected shuffle issue are in inherited W and registry. 755 already reconciled them; 757 did not revert to either old full archive.

READING RECEIPT
Read the full attached startup prompt directly, foundational H MASTER_BANK including appended ROOK037 continuation, subsequent principal Brain I–W documents in chronological order, relevant START_HERE/startup instructions, operating rules, design authorities, ledgers and coordination records, W full main-development handoff, and the actual 755 package instructions. A frozen text authority snapshot is included under reference/authority. Relevant owner screenshots and original compact-status evidence were viewed. Historical appendix files and every historical binary image were not independently re-audited; the authority snapshot is not a claim that every file was visually inspected. No relevant required text source was inaccessible. Brain publication and playable-game approval were treated separately. Existing portraits, LAST and other later approved decisions supersede older plans; seated-character redesign is not authorized.

CHANGED FILES
Existing runtime: game060.js, index.html, hor-version.js, sw060.js, style057.css, unified-bidding752.js, unified-bidding752.css, rail-trick752.js, rail-trick752.css.
Added runtime: trump-voice.js and assets/trump-voice/{female,male}-{black,green,red,yellow}.wav.
Documentation: latest HANDOFF entrypoints, README_757_FIRST.txt, and this BUILD_757 checkpoint/evidence/rollback directory. All previous entrypoints have exact rollback copies. SOURCE_DIFF.patch records the runtime delta; RECOVERED_VOICE_DELTA.patch explains the small cancellation/volume improvements over the recovered module. CHANGED_FILES.json and SHA256SUMS.txt are the package inventory.

VERIFICATION COMPLETED
- Syntax checks for every modified JavaScript runtime file.
- 48 portrait auction state combinations (four local seats, four current actors, 1x/3x/MAX): one compact status per player, original approx. 16.4px height, pointer-events none, no rejected large nodes. Four viewport widths: 320, 360, 393, 412. Real Bid Box hit targets and plus/minus/BID accepted by the existing host handler.
- 48 real decoded AudioBufferSource playback/routing cases across four colors, four chooser seats and 1x/3x/MAX, avatar-map override, duplicate prevention and unchanged input state. Module tests use explicit fixtures in the loaded game.
- Actual offline application lifecycle: worker install; module and eight clips cached; offline page reload reports coherent page/script/marker/worker 756 during full lifecycle tests; 757 metadata/offline coherence rechecked after renumbering; two successive hands through real bot bidding, discard and trump to normal play; correct male and female chooser voices; local Pass control; real next-hand function; saved mute retained across offline reload. These tests did not substitute a fake game engine.
- Real mute control stops current voice. Zero gameplay volume, hidden page, pagehide, new hand, leaving table, reduced motion and landscape voice checks. Reconnect snapshot does not replay. Existing host-waiting sound-card handler and actual House Effects gameplay slider stop playback.
- Audio failure returns quietly; a >750ms delayed response is not played; later event retries a failed asset successfully. No accepted audio bytes altered or resynthesized. The owner's listening approval remains the sound-quality authority; automation confirms decoding/source starts, not subjective listening quality.
- 36 rail fixtures: six viewports x hand sizes 1,2,4,6,9,10; idle invisible; no overlapping protected bounds; visible cases meet 8px card clearance; unavailable cases suppressed. Duplicate, normal completion, reduced motion, rotation, hidden page, phase reset and leave-table cleanup passed.
- Existing assets and protected module identity checks, scoped diff inspection, screenshots reviewed and actual rendered rail animation frames/video captured. Source checks confirm no deleted source files.
- Final successful scripts recorded zero JavaScript page errors. Test harness corrections: button capitalization selector, original settings function name, and initializing the inherited host-waiting setting binding. These were harness issues; no stacked product fixes were added for them.

MEASURED RAIL LIMITATION — NOT OWNER APPROVED YET
At 393x693 and 393x646 with four enlarged cards, there is no safe space; TRICK WON stays hidden even on a win. It also suppresses all tested hand sizes at 393x560. It was visible for 6/9/10 cards at 320x568, 360x610, 393x646, 393x693 and 412x740; for one card it was visible only at 412x740. Two/four-card fixtures suppressed at every tested size. The exact per-case geometry is in RAIL_RESULTS.json. Do not describe this as visible for every hand size or successfully moved upward. If Jerome wants an announcement in suppressed states, present measured alternatives before touching locked geometry.

LIMITS AND OWNER REVIEW
No physical Android/WebView, owner-installed cache upgrade, or live PeerJS multiplayer session was tested. Browser evidence uses Chromium 153 with touch/mobile viewport emulation and a disposable localhost origin. Real audio hardware/Android autoplay and subjective voice level still require owner's phone review. Engine/reconnect fixtures are not live network acceptance. The existing card-sound settings binding is created in the host waiting UI; this work does not redesign unrelated inherited menu wiring. No new approval is implied for 755 shuffle, 757 status appearance, rail suppression or the combined package. 751 remains approved.

Please review on Android: compact statuses during bidding; four trump phrases with male/female/animal chooser portraits; mute and 1x/3x/MAX; normal play through short hands; no idle rail lettering; corrected inherited shuffle and unchanged cards/table. Stop for that feedback after delivery. Do not deploy, publish runtime, stage Player, clear owner storage/SW, bank acceptance or broaden the design.

ROLLBACK
Safest: use the immutable complete 755.zip with its verified hash above in an isolated review folder. The rollback/ directory contains the exact nine original runtime files and original HANDOFF entrypoints. To revert a disposable 757 copy to the 755 runtime, restore those nine files, then remove the new trump-voice.js and assets/trump-voice directory. Do not patch a running production origin or clear owner caches. RESTORE_755_RUNTIME.md explains the scope; historical 751/754 identities remain in W. No deployment occurred, so production needs no rollback.

NEXT CHECKPOINT / PUBLICATION
This complete completion report plus START_HERE and NEXT_CHAT_STARTUP are publication-ready Brain/specialist material. The published pointer remains W under its current authorization. Future documentation publication must be explicitly authorized; this delivery only updates the mandatory number reservation/registry. Publication never automatically notifies another active chat. Every successor must verify the live pointer and registry, read the complete inherited authority, recover the exact latest archive and owner's subsequent Android feedback, and pass both permanent rules verbatim forward again. Do not lose the source/reference/rollback identities or mistake browser tests for owner approval.

FAILED FIX RULE: REMOVE, RESTORE, REDIAGNOSE, REPLACE. NEVER STACK CONFLICTING PATCHES.
THE WORKING SCREEN WINS. IF THE PIXELS EXIST, USE THE PIXELS.
PLAY FIRST -> DISCOVER LATER.

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

Explicit successor requirement: Pass both permanent rules verbatim to every future replacement chat.
