# Multiplayer join repair — isolated candidate, October 19, 2026

Owner: Jerome Griffin. Runtime: 846-join-review-20261019. This implements the owner's explicit request to fix the multiplayer join bug. No live Test, production or Cloudflare deployment, no new game ZIP, and no official numbered release.

## Source and preservation

Continue the exact last direct-effects review: Griffin_House_Direct_Effects_Review_20261019.zip, SHA256 2bfb2dac5c06604ef23871c9c44d7a98160e9f44b8cd86feb8487e08ef571101, 164469117 bytes, Library libfile_d2f3afa4eb848191958dcb353a21a7a1. Original archive is immutable. Base Git candidate a253ce8210688fb2e71cb9cc3a5db576fee0888f carries the earlier consolidated recap repairs; this branch also preserves the subsequent two-effect, sound and direct-transition edits from that exact ZIP. Neither live main has received them.

Published Brain remains AF. Both live multiplayer game060.js files were identical 846-source-cleanup (blob 78d7952ddd44a479f39f8c4d5c04cbf5f0def619). Fresh Test main tree query resolves 854b1a452d074f863ceb883545e6dbfa4ce726a9. Production recorded 01e809d5079510fad9fe61a6c73633e94b637460. Refresh before any promotion. Current approved whole-game rollback remains 845; candidate delivery does not change owner approval.

Only game060.js behavior changes in this repair, in joinRoom, setupConn and handleMessage. Index, marker and worker receive coherent unique review labels. All 1375 checked artwork, voice, X1 and vendor runtime files remain byte-identical to the last direct-effects ZIP; bots.js and rules.js are untouched. No saved careers/preferences, card sorting, laydown logic, geometry, bid dock, artwork or audio were altered by the join repair.

## Confirmed causes and correction

An explicit lobby join formerly left rookActiveTable and _horStayInGame stale. A valid welcome then skipped the seating screen. The corrected join clears these two flags only when horClientIsPlaying is false; a live game reconnect keeps its presentation and cards.

The original join declared completion and cancelled all timers as soon as the data channel opened. It now waits for the matching host welcome to be successfully applied. A silent host times out after 10 seconds from channel open, closes the attempt and permits retry. Double taps stay inside the same owned attempt. Host rejection/version mismatch release the handshake promptly. Abandoned connections cannot apply late data or trigger guest close/error recovery against a replacement connection.

Initial join now uses horNetSend, which attaches the room-scoped private host-issued resume credential. Previously raw sending omitted it. Public player snapshots still exclude credentials. Host admission and manual seat claims remain authoritative. Automatic in-game reconnect code is unchanged. The manual Rejoin button remains; removing it was discussed but was not needed for this repair.

## Evidence and limits

verify.cjs runs actual join, host/client handlers, transport wrappers, roster, seat and credential functions in two Node VM clients with deterministic connection/timer/presentation substitutes. RESULTS.json records 16 passing scenarios. The same stale-session scenario fails against the previous unchanged direct-effects game (entry instead of waiting), establishing a regression test.

Scenarios include clean/stale direct/invite joins; matching four-seat rosters; preferred partner seat; spectators; silent host timeout/retry; no channel open with three bounded attempts; double tap; cancellation; wrong welcome recipient; host rejection; version rejection; late connection events; live-screen/card protection; new-peer token reclaim of original host seat/team/hand data. The reclaim test stubs the existing resync sender; it does not claim real private-hand delivery over WAN.

Project static source checker passes: 65 scripts, 4555 local bindings, all entry dependencies and 1454 unique precache paths. All root JavaScript parses. The formatter's first invocation used default settings because this extracted ZIP omitted its configuration. That broad formatting was discarded; original text outside the three repaired functions was restored, and only the scoped source delta remains.

Two actual cloud-browser clients tried same-site and Test-to-production live joins before the repair. Both failed before a data channel opened; this did not reproduce Rita's connected state and does not prove her network failed. Disposable test tables KJZ5 and WRNA were left/closed; user table 7FWW was not touched. Controlled tests reproduce the old-session failure matching the screenshot arrangement, but cannot prove the exact phone incident. Real WAN/mobile roaming, physical Android, full candidate browser gameplay and installed worker upgrade remain unverified.

Earlier sound/effect browser matches and recap fixes belong to their recorded exact ZIPs, not fresh multiplayer acceptance of this candidate. House Bell/Moonrise remain concepts. Trump sorting and guest laydown findings remain pending; no silent fixes in this scope.

## Rollback and next action

Preserve the exact prior direct-effects ZIP and its complete handoff. Restore its four runtime files if reversing only this repair; no data/cache clearing. The Git parent retains earlier consolidated source and this checkpoint records the intervening ZIP lineage. Promote nothing to either live main without applicable owner approval. Cloudflare migration remains a separate transport/deployment assignment.

A successor must refresh current.json and remote heads, read the complete chronological H–current authority plus relevant coordination and original handoff, preserve this candidate and run the regression suite before editing it. Main H–AF documents and current operating/development records were retrieved/read in this continuing task; this is not a new visual audit of every historical attachment or unavailable A/B archive. The full release-846 inherited handoff was not freshly reread in this repair, so do not claim exhaustive historical binary/source verification.

Both complete permanent rules follow verbatim and must be reproduced by every successor in its own handoff, startup and future Brain update, passing the obligation forward again.

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
