# Griffin House of Rooks — Private Cloudflare Multiplayer Verification

October 20, 2026 UTC / October 19 Eastern. Owner: Jerome Griffin.

STATUS: PRIVATE FUNCTIONAL CANDIDATE VERIFIED IN AUTOMATED SERVER AND NATIVE BROWSER MATCHES. NOT PUBLICLY PROMOTED.

The original missing-browser blocker is resolved. The earlier IMPLEMENTATION_CHECKPOINT_20261020.txt remains an accurate historical checkpoint, not the current outcome. Do not restart the project or repeat that obsolete blocker.

## What is verified

The actual 846 game can create a Cloudflare room, accept independent browser identities by code, fill open seats with server bots, start, bid, show the Kitty, discard six, choose trump, accept legal native card taps, score and reach match completion. Browser reloads during bidding, discard and play restored the same seat and cards. Cloudflare owns the room and referee state; a player's phone does not host it.

## Exact source and hosting

Repository: https://github.com/jeromeleegriffin/Test
Branch: work/cloudflare-846-native-adapter-20261019
Implementation commit: fc879db9bc83cf31ca06aaef3e432c7770ab5575
Original candidate: 02ba0151bf37f59164583c00731ea33ddbcd3073.
Earlier preserved-source/tests commit: 7ccd193823a8061637bbaab681e141784164ba9e.
Earlier blocker documentation commit: 97783ef2e94d5aef4fb472c1d4244adc70068b2a.
Game assets/source pinned to b3f3928548bc79df5169165b953e458cc68ddc09, build 846-complete-repairs-20261019. The private Worker does not follow a moving GitHub Pages root.
Worker: griffin-room-846-private-20261020
Current version: e765eb3e-2fe7-4444-be27-701d6e731cbf
Deployment: 6c8da6df-5b51-4915-a991-f46a851f7523
Separate SQLite namespace: 5b0de759387647e2b07361c360fa89ff
Worker module SHA256: c06b800e1e76f7b3384f54846768a95bb37a86ca58515f4540ec0072200c89ec
Cloudflare source readback matched the candidate source exactly, ignoring terminal whitespace.
Private entry: https://griffin-room-846-private-20261020.jeromeleegriffin.workers.dev/cloud-game/index.html
This remains gated. The new candidate gate is held as a Cloudflare secret and was not put into GitHub, this report or a public URL. The entry link alone does not grant access. No owner testing is required to establish the automated results below.

Hosted total: **9 completed matches, 26 hands and 938 accepted actions**. This excludes the 20 older local baseline matches. Explicit server credential rejoins: 95; explicit server socket reconnects: 22; native browser reloads: 9.

## Executed acceptance evidence

1. Four real Cloudflare 500-point server matches on version 4e08dc8f-9f3c-4264-88eb-89c92a42bbf0: two with two simulated humans/two server bots; two with four simulated humans. Total 21 hands, 754 accepted client actions, 87 explicit credential rejoins, 16 explicit real WebSocket reconnects. All reached final scoring and match completion. Private hands were checked; stale actions and duplicate submissions were exercised repeatedly; wrong discard count was rejected.
2. Two full hosted native-game browser matches on version 113bf0b9-9da1-44d3-afa9-5f2b2557bce6 at the approved 100-point test target: two humans/two bots and four humans. Total 70 native button/card actions; six reloads across bidding/discard/play; final winner screens reached; zero recorded page JavaScript errors. The 100-point target was supplied as a declared start-request test fixture; bids, six-card discards, trump and plays used real native controls.
3. A further four-human hosted native match completed during visual QA at 320×568, 393×844, 430×932 and 768×1024 portrait content viewports. It used the 100-point fixture, 46 native actions and three reloads, with zero page errors. The normal runs also exercised 360×680 and 393×740. Menu, live trick and discard screenshots were personally inspected. These emulate content area/fullscreen equivalents; they do not certify real Chrome toolbar or installed-PWA behavior.
4. The final version changed only the start-option lower bound from 100 to the native game's existing 1. It has the identical verified frontend/reducer and separately completed two actual hosted 50-point server matches: one two-human/two-bot match (22 actions) and one four-human match (46 actions). Both reached match completion. Target 1, 0 rejection and 2001 rejection were unit-checked.
5. Eight focused hosted security checks passed: missing/wrong gate, missing/wrong seat credential, unauthenticated socket ticket, wrong player's bid, changed command reusing an action ID, and socket-ticket replay.
6. Six focused candidate unit checks passed: negative-score Moon, legal-five/turn guards, option validation, Moon success after losing a zero-counter trick, ordinary set penalty on Moon failure, and approved avatar/voice/options metadata through start.
7. Native Moon UI: selecting 200 sent no bid; explicit confirmation sent one bid; one existing approved howl played; reload replayed none; zero page errors. This verifies dispatch, not subjective phone-speaker balance.
8. Local delayed-HTTP native match: 1.5-second delayed play responses, 16 clicks made while earlier HTTP work was pending, final match reached with zero page errors. A queued intent is accepted only while room, hand and authoritative revision still match.
9. Local native two-human/two-bot and four-human acceptance matches and offline smoke passed. Offline retained native host authority, bot responses and menu access. Earlier local 500-point native full-match evidence is retained, alongside partial failed runs which exposed real fixes; partial runs are not counted as passes.
10. The original preserved server also passed 20 local structured-clone-storage matches / 115 hands. Those are historical baseline reducer tests, distinct from current cloud acceptance. They do not certify SQLite, WebSockets or UI.

The hosted browser runs are actual Chromium-rendered native game screens connected to the real Worker. The browser transport is bridged through Node's verified HTTPS and real upstream WebSockets because this Chromium lacks the execution proxy's CA. TLS validation and the Worker's CSP remain enabled. This is a declared test transport, not a direct physical Android connection or independent cellular networks.

## Repairs in this isolated candidate

- Existing native Play With Friends, code join, fill, start and leave callbacks route to Cloudflare only in private cloud mode.
- The cloud host's permissions stay server-side. Every dealt browser uses the native client rendering path; legacy PeerJS heartbeats and bot authority cannot evict or replace cloud humans.
- Removed the duplicate test fill button; reused the approved native control.
- Opened the already-completed nest auction in the native view, restored visible hands and bidder controls, and retained the native Kitty/discard/trump screens.
- Preserved validated avatar and voice metadata in public seat views.
- Cleared stale six-card selections between hands; retired old score windows on all devices when the host starts the next hand.
- Retained host-only next-hand control and the native Moon confirmation boundary.
- Reconciled player room codes with Cloudflare internal Durable Object IDs; old socket snapshots cannot silently switch rooms.
- Kept HTTP refreshes monotonic. One next-turn intention can wait for an earlier HTTP response, but cannot replay across a changed room, hand or revision.
- Corrected the recovered server's prohibition on Moon from negative scores. Existing counter-based success and ordinary set-penalty failure scoring remain.
- Validated target 1–2000 and Red Two/nest reveal/Moon toggles passed through the private start options.
- Confirmed public human bid/Moon and trump presentation events use existing approved audio; reconnects stay quiet.
- Kept ordinary offline authority, handlers, saved-data behavior and bot scheduling when no cloud seat is active.
- Pinned upstream assets and supplied correct MIME types; retained the private gate, personalized views and secure single-use socket tickets.

## Changed files and reproduction

Runtime changes are contained in cloudflare/isolated/846-cloud-game-adapter-candidate.js and cloudflare/isolated/worker-candidate.mjs. build-candidate.py derives the latter from the preserved deployed source plus the scoped adapter and compatibility changes.
Supporting tests, loaders, README and JSON receipts are under cloudflare/isolated/tests. Read tests/README.md for exact commands, browser setup and declared transport/target fixtures. All new credentials must be supplied privately through GHR_PRIVATE_GATE or GHR_PRIVATE_GATE_FILE; never commit them.
The current shared continuation record is coordination/cloudflare/PRIVATE_RELEASE_20261020.md. Historical Master Brain AF and its predecessors remain intact. This work does not advance the main Brain pointer or publish a public game.

Exact branch paths added/modified since the inherited adapter checkpoint (33):

```
cloudflare/isolated/846-cloud-game-adapter-candidate.js
cloudflare/isolated/build-candidate.py
cloudflare/isolated/tests/DEPLOYMENT_RECEIPT_20261020.json
cloudflare/isolated/tests/README.md
cloudflare/isolated/tests/browser-base.cjs
cloudflare/isolated/tests/candidate-unit-results.json
cloudflare/isolated/tests/candidate-unit.mjs
cloudflare/isolated/tests/cloud-native-ui-results.json
cloudflare/isolated/tests/cloud-ui-full.cjs
cloudflare/isolated/tests/cloud-visual-results.json
cloudflare/isolated/tests/delayed-http-results.json
cloudflare/isolated/tests/deployed-worker.snapshot.mjs
cloudflare/isolated/tests/final-candidate-protocol-results.json
cloudflare/isolated/tests/live-browser-transport.cjs
cloudflare/isolated/tests/live-protocol-results.json
cloudflare/isolated/tests/live-protocol.mjs
cloudflare/isolated/tests/live-security-results.json
cloudflare/isolated/tests/live-security.mjs
cloudflare/isolated/tests/load-candidate.mjs
cloudflare/isolated/tests/load-deployed-service.mjs
cloudflare/isolated/tests/local-server.mjs
cloudflare/isolated/tests/moon-ui-results.json
cloudflare/isolated/tests/moon-ui.cjs
cloudflare/isolated/tests/native-ui-results.json
cloudflare/isolated/tests/offline-smoke-results.json
cloudflare/isolated/tests/protocol-results-initial.json
cloudflare/isolated/tests/protocol-results.json
cloudflare/isolated/tests/protocol-tests.mjs
cloudflare/isolated/tests/ui-full.cjs
cloudflare/isolated/tests/ui-offline-smoke.cjs
cloudflare/isolated/worker-candidate.mjs
coordination/cloudflare/IMPLEMENTATION_CHECKPOINT_20261020.txt
coordination/cloudflare/PRIVATE_RELEASE_20261020.md
```

## Preservation and rollback

Original griffin-room-local-poc remains on version 7e57f6f5-9524-4456-96d2-379f406b2d01, deployment b55a14ac-10bd-46e1-a6aa-129d27f56e02, namespace 4a45f65563174df6847cd5576973088a. Its gate value was never read or changed. Its rooms were never reset or migrated. Both public GitHub Pages games and the production repository were left untouched. No player careers, XP, achievements, identities, settings, caches or service workers were cleared. No paid account upgrade was made.

For private candidate rollback, retain its namespace and secret. Earlier candidate versions are 4e08dc8f-9f3c-4264-88eb-89c92a42bbf0 and 337772e0-fb26-451d-bfd3-90fda2bf8aaa. The first two have known native integration defects. The directly preceding verified native-UI version is 113bf0b9-9da1-44d3-afa9-5f2b2557bce6; the final version restores the native custom-target lower bound only. Prefer the verified current version. If a new repair fails, restore exact reviewed source with a new deployment against the SAME candidate namespace and keep the secret binding. Do not delete/recreate namespaces or force-reset Git history. No public promotion or rollback was performed.

## Remaining limits and public readiness

- Server bots are the recovered simple test policy, not X1. X1 worker/integration sources were investigated: browser importScripts/postMessage and the existing offline-only EPA boundary need a separate verified server port. No partner or opponent hand access was added online.
- Physical Android, four separate devices/networks, cellular/Wi-Fi roaming, prolonged background suspension and subjective audio balance remain unverified.
- Forced cloud Durable Object eviction/crash recovery, long real-time room expiry, load/cost testing and production monitoring remain unverified. Local service reconstruction is not equivalent.
- Host configuration remains scoped to the private adapter's supported options; no redesigned public lobby, accounts, permanent cloud career awards, or trusted cross-device XP migration is introduced.
- The native UI and its artwork remain the pinned 846 source. This is not permission to replace approved graphics or merge concurrent design work.

Recommendation: retain this as a verified private multiplayer candidate for controlled next steps. Do not publicly promote it yet. Complete deployment hardening and device/network validation before an owner-approved public release. The owner is not being asked to repeat hundreds of test hands.

## Successor startup

Continue from the implementation commit, deployed version, namespace and evidence above. Refresh GitHub main, the isolated branch and Cloudflare deployment before changes. Read the complete foundational H and chronological I-through-current Brain plus original relevant authorities. Preserve the original Worker, both private namespaces/gates, approved art, public games and all player data. The browser blocker is resolved: use the documented npm Chromium fallback and verified transport harness. Do not restart, blindly layer fixes, re-run completed bulk tests without a reason, relabel server bots X1, or claim physical-device testing. Pass the full permanent rules below forward again.

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
