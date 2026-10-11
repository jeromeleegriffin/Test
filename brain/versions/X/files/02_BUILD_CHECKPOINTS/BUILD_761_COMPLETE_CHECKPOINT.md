GRIFFIN HOUSE OF ROOKS — 761 GENTLE RAVEN FIGHT AUDIO
2026-10-11 | Jerome Griffin | Continue760; no restart

OWNER DIRECTION
“I need some sound for the Raven fight.” Owner agreed to wings, call at contact and light separating flutter, then specified: “Just don't make it too sharp or anything. Just calm like the room is now.” This reopens Raven fight AUDIO only; original741art, movement, duration, Black Bird captures Red Two trigger, award and gameplay systems remain locked.

SOURCE AND AUTHORITY
Exact760.zip,334723146bytes, SHA256c6c12815184fec2f074b1fb59b3a410ad486bc61638f91baedbd4265d542bfd4, Library libfile_07b8aefd5efc8191962001fc020658bf. Full archive and all2069payloads compared before edits. Live Test/main Brain W, BUILD_REGISTRY.json, BUILD_NUMBERING.md and HOUSE_EFFECTS.md refreshed.751 remains fully owner-approved;760/761 await Android review. Published Brain W remains current. This is a complete Brain-ready task checkpoint, not a new published Brain.

IMPLEMENTATION
New raven-audio761.js owns only audio. Three short PCM derivatives of existing recorded owner-supplied CC0 wing/corvid assets: soft approach wing at timeline350ms, single subdued call at contact1120ms, light flutter at return2350ms. Their onset times scale with actual launch duration, not the preceding settle delay. Native playbackRate1 always; no stretching or pitch slowdown. At1x existing2254ms animation after496ms settle remains exact. At3x only one softer wing cue avoids compressed overlapping calls. MAX/reduced motion are silent. No extra controls or persistent preferences.

Gentle processing:120Hz highpass,1500–1800Hz lowpass,60ms edge fades, PCM24kHz mono, bounded peak0.018approach/0.045call/0.012flutter before runtime gain. Call is an existing crow/corvid recording, not species-verified Common Raven; do not claim a newly recorded Raven fight. Exact source excerpts, measured peaks and attribution in assets/audio/raven-fight761/PROCESSING.json/SOURCES.txt. Original source files and approved ordinary bird-card sounds unchanged.

LIFECYCLE
Fetch starts without delaying gameplay; decode is warmed after first user gesture. Audio starts only when fight canvas actually launches. Late fetch/decode over150ms skips all audio rather than catch-up bursts; expired cue onsets also skipped. Audio failure cannot delay animation/awards or advance game state. Respect global mute, card sounds, Rook sounds and gameplay volume including zero; a40ms bounded monitor updates gain and stop on disabled controls. All completion/cancel/replacement/hidden/pagehide/resize/motion-change/leave cleanup flows terminate sources with20ms fade. Async generation tokens prevent cancelled work from starting later. Preview cancellation uses same lifecycle. Sound has no award/state/timer dependencies and introduces no RNG.

PRESERVATION
game060.js changes ONLY APP_VERSION760->761; index.html, hor-version.js, sw060.js update coherent cache/version tags and load/precache the new module/three clips. raven-fight741.js adds two optional audio lifecycle calls: clear and actual launch. Its timeline/art/geometry/state gating/clock handling are untouched. signature-shuffle.js remains identical760: original5600ms1x normal speed and native original shuffle recording. All759visual atlases/poster/approvedcardback preserved. cabin-ambience041.js identical: faint adjustable fireplace and15–30min rare real-time owl scheduler/preferences remain intact. Table/layout/bidding/rail/kitty/discard/voices/bots/rules/network/scoring untouched. Exact SOURCE_DIFF.patch, rollback originals and PRESERVATION.json enumerate every delta.

VERIFICATION AND LIMITS
Read evidence/RAVEN_RESULTS.json and REGRESSION.json in full for actual results. Actual production capture fixture,1x/3x/MAX audio counts/native pitch/timeline offsets and unchanged game state; mute/Rook/card/zero/half volume, hidden/pagehide/leave/replacement/cancel before launch/reduced-motion cleanups. Production opening deal at all speeds,46flights/one completion and unchanged hand identity; preserved normal5600/1867/280ms timing/native shuffle pitch, minimal mode and pagehide; coherent761worker/page/script/marker and offline new audio/module plus original shuffle/atlas/trump assets; preserved defaultfire10/owlsenabled. Chromium153 mobile/touch emulation. No physical Android/speaker listening, owner cache upgrade, live multiplayer or full scored-match verification. Quietness and tonal taste require Jerome's actual phone review; processing measurements do not imply listening acceptance. No new screenshots or video claimed. Initial mute/control test exposed control monitoring sensitivity to a delayed render frame. The frame hook was removed and replaced with a40ms audio-only monitor; final lifecycle rerun passed. No conflicting patches retained.

ROLLBACK AND COORDINATION
Complete rollback is immutable760.zip with hash above. Isolated partial rollback: restore every rollback/ file at its root-relative path, remove new raven-audio761.js and assets/audio/raven-fight761 directory. No owner storage clearing. Shared761atomically reserved/read back with reservationId raven-calm-audio-20261011-6565ad6cab12. Final archiveSHA/bytes/Library identity recorded outside archive and in live registry/reservation/HOUSE_EFFECTS.md after delivery; do not fabricate an archive containing its own hash. No deployment/production/Player staging/X1 integration or new human voices/art. Brain publication unchanged.

CONTINUITY AND NEXT ACTION
FoundationalH and principalI–W fully read earlier in this continuing conversation; current live authority refreshed for this task. Successor must actually read full foundationalH and every published successor; checkpoint is not a substitute. Continue761, preserve normal shuffle and retained759graphics plus faint fireplace/rare owls. Jerome reviews gentle fight audio on Android; record actual feedback and scoped approval without assuming whole-game acceptance. Any future ZIP requires fresh shared atomic reservation. Pass BOTH permanent rules below verbatim into every successor handoff/startup/Brain update.

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
