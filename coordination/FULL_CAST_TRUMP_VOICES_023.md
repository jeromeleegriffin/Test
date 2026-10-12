# Griffin House of Rooks — approved full-cast trump voice checkpoint

Owner: Jerome Griffin. Decision date: 2026-10-12.
Status: AUDIO OWNER-APPROVED; GAME INTEGRATION PENDING.
This is an authorized specialist supplement to Master Brain Z, not a new game release or baseline promotion. Preserve frozen Brain versions. Owner requested: “Okay, now get the master brain updated so we don't forget anything.”

## Approval and scope
Owner explicitly stated: “I approve all the recordings. They're good.”
This supersedes pending/unapproved audio wording in the earlier package README and reports. Preserve those original artifacts unchanged. Approval covers the recordings; it does not establish verified perceptual uniqueness of 116 voices or approve an untested integrated game.

Latest scope: the FOUR trump lines for every character first. Other reactions and long samples are deferred. Do not restart generation or regenerate accepted clips.

## Approved delivery and recovery
- 023.zip; Library ID libfile_25682ceb2d4c81919546ac624ee3119d; file ID file_000000005d50820eb13ef6f80fcbac66; 39,281,383 bytes.
- Root Full_Cast_Trumps_023/.
- 116 bot/human avatar sets, four MP3s each: 464 MP3s.
- Exact texts: “Trumps are red.” “Trumps are green.” “Trumps are black.” “Trumps are yellow.”
- 52 fixed bots plus 64 humans (hw01–hw32, hm01–hm32); 58 male and 58 female voice presentations in this package.
- 28 existing base voices / 112 approved recordings reused byte-identically.
- 88 additional 50/50 blended recipes / 352 new recordings.
- Jerome (jerome_founder) is separate: preserve his four real recorded announcements; NEVER synthesize or replace his voice.
- Characters/<exact avatar id>/<id>_Trumps_<Color>.mp3 and character Listen.html; root Listen.html.
- Voice_Inventory.json: 464 rows with avatar IDs/names, voice keys, component IDs/weights, settings/text/files/hashes/status.
- Voice_Recipes.json: 116 recipes. Exact_Source_Roster.json includes Jerome (117 identities).
- Originals contains source WAVs; Voices contains receipts; produce.py, package.py, README.txt, Sources.txt and Model_Hashes.json preserve reproducibility.
- Whole-ZIP SHA-256 is not recorded in this handoff; do not invent it. Recover exact Library bytes and calculate it before integration. Use packaged per-file hashes.
- Scratch paths may have expired. Recover from Library before requesting owner uploads.

## Casting status and actual coverage
Mapping is provisional: exact source roster IDs/names from Build782; name-equal voice matches first, remaining assignments deterministic by roster gender. This was not artistic/ethnic casting. Do not infer ethnicity from avatar appearance, names or voice accents.
116 assigned recipes is NOT proof of 116 perceptually distinct natural voices. No independent cast-wide perceptual uniqueness validation was completed. The owner accepts the delivered recordings.
Reconcile against the latest active roster; do not restore Build782 over newer development.

Build782 recovery only:
- Human-Avatar-782-Integration.json: libfile_8dc344082a908191b91bcc0fca205394.
- Human-Avatar-782-Review.html: libfile_02add492036c8191a5c6783e5ce01087.
- 782.zip: libfile_49b8849dd5c481919e1d1892528cbb96.
- SHA256 849982ca154c255c533169a3682abcc67c37ab0b971b8efb563401352efe6b12.
Retrieve bot IDs and names from the actual roster; never invent them.

## Pronunciation decisions and preservation
Some short “red” samples sounded like “ready.” Punctuation alone did not resolve it. Generating with following context then trimming did. Owner approved Cut A and later accepted the corrected set.
Flagged review voices: Eric am_eric, Liam am_liam, George bm_george, Daniel bm_daniel, Alice bf_alice, Isabella bf_isabella, Emma bf_emma, Jessica af_jessica.
Jessica initially retained following speech; Jessica Cut A (1.075 seconds) was selected and approved. Preserve final accepted cuts, not rejected earlier trims. Do not apply blanket new cuts to originals that were already correct.
014(1).zip Jessica cuts: libfile_b9761812263c819196ac744f479c36b7.
015(1).zip eight approved red corrections: libfile_bd2c13322adc81919c7c2d1da40349b1.
018(1).zip all 28 base voices /112 trumps: libfile_6d27eadecea08191abdc627afd50639e.

## Exact production route
Final scalable workflow: Kokoro ONNX on ChatGPT cloud workspace CPU. No owner Windows PC, subscription, purchase or production-game changes.
kokoro-onnx 0.6.1; onnxruntime 1.31.0; model kokoro-v1.0.onnx and voices-v1.0.bin from thewh1teagle/kokoro-onnx release model-files-v1.1. Model Apache-2.0; runtime MIT; preserve bundled provenance/license references.
CPU two threads, speed 1, equal 50/50 voice-pack blends; en-gb when both components British, en-us otherwise. No artificial pitch shifting. WAV 24kHz PCM16; ffmpeg MP3 at -3dB, 128kbps.
Recipe selection maximized minimum distance of mean voice-pack vectors; this is not an acoustic or listening proof of distinctness.
Earlier free Pendrokar/Kokoro-TTS public Gradio CPU /generate_first produced base clips. TTSMaker automation prohibited/API paid; original hexgrad demo API disabled. Remsky ZeroGPU generated three trial clips then explicit quota stopped work. No bypass, paid fallback or silent service substitution. Final CPU generation avoided a hosted-demo bulk-production dependency.
Model/runtime binaries were not bundled; exact source and model hashes are in 023. Preserve working scripts and recipes.

## Deferred material — preserve, do not integrate now
020(1).zip: libfile_96723365caa48191bbe8b1a6360a60e7; 14,158,285 bytes; Eric/Jessica 92 MP3s (46 each: 38 game lines and eight long samples).
021(1).zip: libfile_a19b35831d70819191357535bdfb6220; 12,419,284 bytes; George/Emma partial expansion 88 MP3s; four Emma long samples remained when owner narrowed scope.
022(1).zip: libfile_25a95b0245a481918f78d8e2f2a83773; three experimental blended male clips, incomplete quota-limited trial; do not substitute for approved 023.
Original expanded 002: libfile_01443b8d13c481918bafbd82e296f482; preserve earlier Michael/Puck/Heart work.
All original artwork, recordings and intermediate packages remain preserved. Long sentences are audition/personality samples, never automatic in-game reactions.
RULE: “I have the rest” and “The rest are mine” play ONLY immediately before a player actually lays down their remaining winning cards, never merely because they hold winning cards.

## Next authorized implementation handoff
Owner requested a prompt for the active development session and approved the recordings. No voice integration was performed in this voice-production chat.
1. Read current Brain, registry and current active-session source. Recover 023, verify all files, build explicit avatar/color mapping from real inventory; preserve approved audio bytes.
2. Integrate only the four trump announcements into an isolated candidate using the existing authoritative trump-selection event. Play the actual chooser's voice and selected color once; preserve duplicate/reconnect suppression, cancellation, mute, gain, audio unlock and failed-load behavior.
3. Preserve human Male/Female/Silent preferences independent of appearance, persistence and preview/game consistency. Document stable opposite-presentation fallback; never override Silent.
4. Preserve Jerome's real recordings and latest approved identity policy. Registry787 revoked owner-only restriction;788 adds Jerome bot support. Do not reintroduce obsolete782 founder restrictions.
5. Keep source WAVs, model binaries, scripts, reports and audition HTML outside runtime packaging. Include required MP3s/mapping and coherent offline assets only; avoid unnecessary full-cast preload.
6. Test every avatar/color route, missing files, duplicate events, mute/volume, preferences, reset/reconnect and offline/cache behavior. Distinguish browser simulation from real Android/live multiplayer checks.
7. Preserve all current game logic, bidding/scoring, bot intelligence, TABLE-003, Bid Dock, cardholder, LAST/speed, landscape, duplicate-avatar protection, Cobalt correction, compact career cards, name-side achievements and newer approved UI changes.
8. Reserve any future game build under the current shared numbering procedure. No deployment or baseline promotion authorized by this voice handoff.

## Current coordination and verification limits
At documentation readback preparation, main was 16c21f53c1cf6b6e7aeeb66c6dd9f212fa5e8b40. Published Brain Z/Test baseline remains779. Registry separately records approved development checkpoint783, delivered788 and reserved789; read fresh before integration. This supplement does not alter those classifications, existing EPA policy or any other workstream.
Prior production record reports all464 MP3s decoded and reused112 compared byte-for-byte. Owner listening approval is recorded above. This documentation turn did not redownload/redecode the audio, certify an integrated game, perform physical Android tests or independently prove cast-wide perceptual uniqueness.
Read this supplement with current pointer, Z START HERE, MAIN_DEVELOPMENT_VOICE_HANDOFF.md and current registry. Older shared-voice notes remain historical for779; they do not negate approval of023.
No runtime files, original assets, build numbers or deployment pointers are changed. Rollback for documentation is a new scoped revert commit preserving concurrent work, never a force reset.
Publishing does not notify or wake other chats; active sessions must read this record on resume.
This scoped status publication refreshed current pointer, Z START HERE, Master Control, operating rules, older voice handoff and registry; it does not claim a new complete H–Z historical audit.

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

