GRIFFIN HOUSE OF ROOKS — 765 COMPLETE RIFFLE / BRIDGE SOUND SYNCHRONIZATION
2026-10-11 | Jerome Griffin | Continue764, no restart

OWNER ASSIGNMENT AND REJECTED FIXES
Owner: “Now you have the audio out of sync on the second part of the arched part.” He requested a corrective self-prompt, then explicitly issued it as the work assignment: inspect every phase, preserve normal visual speed/native audio pitch, align both releases, avoid clipping/repeats/filler and verify actual game plus encoded video.763 aligned first onset but cut through the riffle at source3.30, inserting622ms silence.764 removed that gap by shifting the whole remaining recording, making the bridge too early. Owner's listening rejects both partial solutions. Earlier onset-only/continuity-only passes are not approval of whole-sequence sync.765 removes those assumptions and identifies the actual source phase boundary.

EXACT SOURCE AND LIVE AUTHORITY
764.zip337707804bytes SHA2560220440e6bb0ed10d4cc0cab5c5d12126dbea5ee6b88dade54b90a418ea708bc, Library libfile_c587d49dcb148191bc473c86f709268d. Scratch was cleared between sessions; exact saved archive recovered viaLibrary, hash/CRC verified, all2195payloads compared before changes. Complete764handoff read. Test/main HEAD45060f63b4a73df8673e4988e08ee637ca29795d initially refreshed with current.json, registry, numbering, shuffle coordination, OPERATING_RULES and HOUSE_EFFECTS. Full currentW main document refreshed. Actual foundationalH and principalI–W full reading recorded earlier in this same continuing conversation; this turn did not pretend to repeat all history. Successors must actually read fullH/allpublishedsuccessors. BrainW remains current;751 remains fully owner-approved. No newBrain publication/game deployment.765 was atomically reserved/read back before naming: shuffle-full-phase-sync-20261011-6565ad6cab12. Exact final outputhash/Library IDs outsidearchive/live registry.

PRIMARY DIAGNOSIS — ONE SHARED TIMELINE
Inspected original759Blender pose() and the actual immutable atlas pixels, not guessed labels. Native asset first release2.40 but first visibly changed frame73 at2.433333. Bridge rises3.65–4.03, release cascade starts4.20, first visibly changed frame127 at4.233333; last card release4.74 and settling ends4.88. Squaring4.96–5.45. Existing762cut omits567ms stationaryhold: first visible riffle1.866333, arch rise3.083–3.463, first visible bridge3.666333, lastrelease/settle4.173–4.313, finalsquare4.393–4.883. Original atlas30fps; preview omits17frames, creating only+.333ms frame quantization. No geometry/tempo changes.

Read original1.wav correctly as44100Hz stereo. Provenance explicitly identifies separate recorded riffle/bridge sequence; second sequence belongs to bridge release, not squaring. Waveform shows complete riffle3.024–about3.75, near-digital silence around3.80, bridge preparation rustle3.93–4.22, strong bridge flaps4.237–about4.70 with decaying tail. The old3.30split was INSIDE active riffle. Around new3.80boundary,20mspeak is at most1PCMunit(-90dBFS); exact boundary/following samples zero. This is a genuine quiet boundary. Source recording's pause is shorter than locked visual push/arch preparation, so one constant offset cannot match both events at native speed. Do not claim a continuous single offset can solve it.

FINAL AUDIO EDIT
Three excerpts from unchanged approved source: paper.18–.76 at originalphase.18; complete riffle3.014–3.80 at originalvisualphase73/30 with8ms attacklead; complete bridge3.80–5.10 at originalvisualphase3.80. After567mscut: riffle schedules1.858333–2.644333; bridge3.233–4.533. Every source sample3.014–5.10 is retained once, in order, no clipped release or duplicate sound. Quiet waiting between whole phases corresponds to pushing/arching the deck, not a missing portion of an active release. No filler, loop, new sound, normalization or time-stretch. Native playbackrate1.0 at1x, inherited approximately1 at3x. Original outer8ms fade envelopes and sourcefiles unchanged. Final squaring/rotation intentionally quiet; originalbridge tail decays as cards settle. No invented impact for rotation. Individual46card microimpacts are not claimed sample-perfect; two complete recorded gestures align with their corresponding visual gestures.

COMMON OUTPUT CLOCK
Initial live AudioWorklet check found BOTH gestures about63–65ms late, a common browser output-buffer delay, not another relative phase mismatch. Added one bounded audioEpoch mapping: when getOutputTimestamp is present/recent and measured output lag0–250ms, map the visual startedAt epoch directly to the output sample clock. Otherwise retain established currentTime-elapsed fallback. No speculative extra fixed delay. Late playback trims the unavoidable passed samples and skips exhausted cues; generation/mute/card guards retained. Existing per-source volume smoothing retained. This replaces earlier unvalidated abandoned helper, based on corrected stereo/fullphase/livegraph evidence. OfflineAudioContext lacks output timestamp and exercises fallback. inspect() adds startedAt and sourceEnd for timing/audit; no gameplay effect.

MEASURED RESULTS AND WHAT THEY MEAN
AUDIO_PHASES.json: actual production sound() executed through stereo OfflineAudioContext, its performance epoch pinned only during scheduling; same real cue loop, original buffers/rates/fades. Riffle onset~+2.125ms against first changed frame73; bridge strongflap~+3.599ms against first changed frame127. Pre-bridge rustle belongs to arch preparation and is not mislabelled as release. LIVE_SYNC.json: real production playback tapped with AudioWorklet, zero calibration correction, actual atlas frames observed; final measured riffle-0.716ms and bridge+0.781ms against visible release frames. Browser output timestamps estimate presentation, not a physical speaker/microphone measurement. Earlier run63.302/64.689ms documented before commonclock correction. No claim every device shares these exact numbers.

Production regression checks5033/1678/252ms,3nativecues/offsets, originalnativepitch,46dealflights/onecompletion/unchangedhandidentity at1x/3x/MAX, direct54->72visualcut, reduced/pagehide, original landscape5600, fresh765worker/offlineapprovedaudio/atlases/Raven/voices, firedefault10/owlsenabled. Live controls exercise gameplayvolume.2/zero, mute andcarddisable. Final encodedAACMP4 is decoded again: both onsets within20ms of corresponding video frames;50ms energywindows across each active release exclude an artificial cutout. Complete testresults/logs retained.

FAILED TESTS / RECOVERY
Initial byte-zero assertion for20ms around boundary failed because preceding tail contains one16-bit PCMunit; corrected criterion to measured near-digital silence, no edit inside audible waveform. No runtime change needed. Initial volume assertion after70ms failed during existing15ms smoothing/render update; allowed250ms settling, then verified. No volume implementation change. Chromium archive installer chown failed in transient container; restored test browser binaries with ordinary owner-preserving extraction, no game/owner environment mutation. No failed intermediate runtime/preview ships. Runtime tests also retain historical wording “offline760” in a log line; assertions inspect actual765markers/assets and RESULTS.json is authority.

PROTECTED AND EXACT SCOPE
Runtime changed only signature-shuffle.js audio cue boundary/phase/outputclock/diagnostics and coherent765cache/version tags in game060(APP_VERSIONonly),index,hor-version,sw. All original assets unchanged; shuffle-asset/standalonevisualpreview,759geometry/cardart/atlases,762prefetch/timing, Raven761audio/modules, cabin ambience byte-identical764. Portrait5033/3x1678/MAX252 and legacylandscape5600 preserved. Approved Raven sound preview remains scoped acceptance (“That works for me. Let's go ahead and implement it.”), already integrated761. Faint adjustablefire/15–30minrareowls savedkeys retained. Table/cards/portraits/BidDock/LAST/holder/connector/rail/trumpvoices/kitty/discard/personas/bots/RNG/rules/scoring/network unchanged. No production/Playerstaging/storageclearing/X1merge/newart/voice/agents.

VIDEO AND LIMITS
Shuffle-sound-765-preview.mp4: all original atlasframes0–54 then72–167 atnative30fps, plainfelt background; AUDIO exported directly from actual production sound function. No separate hand-reconstructed cue list. Full5.033s stereoH264/AACclip, finalAACdecoded/checked. Constructed timing preview, not physicalspeaker/fullroomcapture. Actualphasecontactsheet/waveform/timeline are analysis/evidence, not newly designed gameart. This assistant inspected pixels/waveforms/rendered graph and did not subjectively listen as a human. No physicalAndroid/speaker/cacheupgrade/livePeerJS/fullscoredmatchtest. Jerome's phone listening overrides automated assertions. Laterbridge tail/individualcardperception remain reviewable; do not label whole765approved.

ROLLBACK AND CONTINUATION
Complete exact764source above is immutable rollback, with known bridge-too-early defect. Partial restore each rollbackfile at originalrootpath; no newruntimeasset deletion or ownerstorageclearing. Archive includes exactdiff/preservation/manifest, productioncode/tests/preview/fullcheckpoint and bothpermanentrules. FinalarchiveSHA/bytes/Library identity and atomicdeliveryreadback recorded outsideZIP and live registry/reservation/shufflecoordination. Number765consumed; future ZIP requires freshglobalreservation/readback. Do not notify otherchats automatically or imply BrainW advanced. Continue765withoutrestart. NextJerome checks fullclip/gameonAndroid; recordactualacceptance/correctionwithoutpromotingfullapproval. Successorrefresh liveauthorityandreadactualfullhistory; reproduce both rules verbatim forever.

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
