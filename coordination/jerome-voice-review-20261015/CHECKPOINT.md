# Jerome original voice integration and rotation

Owner requested his complete original voice in both bot Jerome and playable human Jerome, then explicitly requested alternate sayings to rotate while only one plays at a time. This supersedes historical four-trump-only deferral for the mapped event categories in this release.

Original master Voice 261012_034339.m4a was recovered from Library libfile_cc50cf117d208191b731421fb14ee816. SHA2561fd90c4a8794993515c7af2e0930cfedb7b45d45e311a8e038dce34bd51fe9c7; unchanged163.752-second master. No synthetic substitute or new recording. Full Library transcript and local Whisper base.en transcription with word timing were inspected. Silence detection alone merged180/185 and I'm shooting the moon/Let's win this; independent word alignment split those correctly. Final ASR rechecked180,185,three Moon takes and both Pass takes. This is automated speech verification, not subjective listening. 44 derived MP3s have normalized speech level, small edge fades and one-phrase boundaries. Existing four authentic trump OGGs remain byte-identical. Raw master stays in Library rather than becoming a public game asset.

## Runtime behavior
Canonical avatar jerome_founder selects authentic speech for bot and human roles, with Silent honored. Numeric bids100–195 use the correct20 original clips;200 uses Moon instead. Moon rotates3 takes, Pass2, each trump color3 (original Trumps are color, color is trump, I'm calling color). Each accepted event selects one take. Existing male/female Moon options rotate their2 original takes with the same persistent per-bank rotation. No alternate speech is fabricated where no matching recording exists.

Mapped scored-hand reactions rotate within made-bid, got-set and set-opponent banks. Match-end chooses one appropriate win/loss line from its own bank, rather than stacking an extra hand reaction plus multiple good-game lines. Result IDs deduplicate repeated score updates. Authoritative host/client result observations do not change scoring, legality, timing, decisions, state or rules. No ordinary winning-trick speech was added. No I have the rest trigger is invented: that exact phrase was not in the recovered master. Remaining unassigned general lines stay banked in the original recording, not assigned indiscriminately.

All spoken bids/Pass/Moon/trump/result lines share voice-queue.js. One buffer source at a time; pending stale events are validated, Moon retains existing duplicate/late-bid flush guards, and blocked audio unlock has an8-second bound so the speech queue can recover. Mute/Voices gain/visibility cancellation and existing mixer are preserved. Wolf howl is a separate character effect with its existing confirmation timing, length and fade unchanged. Persistent rotation counters use horVoiceRotationV1; no player data reset.

Rita's previous bot/human/female integration remains intact. This is the combined isolated review under builds/rita-review-20261015. The approved Moon game at Test root and actual Rook production are unchanged. No new ZIP or official number. Rollback/pre-jerome-voice-review-20261015 preserves the prior Test main, plus the prior Rita runtime tree.

## Verification and limits
Changed JavaScript parses. Deterministic actual-module tests started16 speech sources with max simultaneous1. Cases: bot/human authentic Jerome routing;180/185 paths; pass/Moon/trump rotation; duplicate Moon with fresh packet IDs suppressed; bid/trump serialization; Silent; stale decode; result dedup/categories; ordinary female (including Rita) retained; generic male/female Moon rotation; persistent counters; blocked unlock queue recovery.44 MP3s decode with bounded lengths; four original trump OGGs unchanged. All982SW dependencies resolve. Game source differs only in runtime labels and two guarded audio-observer calls; rules,bots,X1core/worker/bidding,character renderer,mixer,howl and original art remain unchanged from Rita review.

All uploaded blob hashes match local bytes. Runtime tree verified all1554 game paths before adding the standalone voice-review.html (1555 total). See STATUS.json for final commit, Pages run and live-file/browser results. The voice-review page uses one HTML audio player; repeated Moon clicks visibly rotate moon-1,moon-2,moon-3 and load media in the cloud browser. Cloud-browser playback state is not subjective listening, physical Android audio timing or a complete played Moon hand/match. Live cross-device multiplayer and installed-device service-worker/offline upgrade are not newly certified.

Review game: https://jeromeleegriffin.github.io/Test/builds/rita-review-20261015/
Voice audition: https://jeromeleegriffin.github.io/Test/builds/rita-review-20261015/voice-review.html

Successors must fetch current.json and these records before resuming. Publication does not notify other chats. Preserve exact assets, source master, all approved game systems, paused landscape and permanent continuity rules. No production promotion implied.

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




The fresh-repair rule in coordination/GAME_REPAIRS.md remains mandatory; carry it along with both complete rules in successor handoffs. No Brain letter advancement by this supplement.
