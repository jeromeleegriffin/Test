# Current live update — opening pause, shuffle and deal restored

Live game: https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/

Owner reported that Start immediately showed an auction already advanced by bots and requested a brief pause followed by shuffle and deal, not a literal minute. Root cause: RoomService.startGame immediately drove bots in the auction; the Cloudflare adapter bypassed the native runDealPresentation path.

## Exact current source and deployment
- Branch: work/cloudflare-846-native-adapter-20261019
- Code commit: 80e1604dee30456ede21569b3f774b09fe62bfca
- Worker: griffin-house-of-rooks-online
- Version: aa209069-9cb8-4051-820c-c55ca5717eb8
- Deployment: 0ead9dcf-e18f-4062-abf7-0b81315d3b7f
- Existing live RoomDO namespace retained: bb1bf1c32b68451cbe5db6fee3066fa0
- Exact deployed module matched the reviewed source. Session secret and both rate bindings retained. No migrations or room resets.
- Changed implementation: cloudflare/live/adapter-live.js, build-live.py, worker-live.mjs; focused tests in deal-unit.mjs and live/tests.

## New behavior
Start and each next hand show approximately 1.5 seconds of table settling, then the existing approved native shuffle and all-seat card-by-card dealing animation. There is no new artwork or landscape change. The server persists a dealing/opening lock and rejects human bids while it is active; bots cannot bid during it. Each human's browser acknowledges its completed presentation. The auction opens after all human acknowledgments and a minimum 3.5-second opening. At ordinary 1x pace, the complete native sequence takes roughly 13 seconds including shuffle and dealing; faster selected paces shorten the animation while retaining the minimum opening. These are not a minute of waiting.

If a phone disconnects or never acknowledges, a persisted 25-second server deadline releases the lock. Cloudflare's Durable Object alarm drives that recovery and broadcasts the resulting state without any host phone request. A reconnect during the opening retains the original seat/hand and presents the deal; a reconnect after bidding has begun does not replay the opening. A late/reconnected browser keeps its own bid controls hidden while its local deal is still running. Table closure cancels the opening and is never undone by an alarm.

## Executed checks
- Targeted local service/actor checks passed: initial bots and human bids locked; minimum opening; all-human readiness; unauthorized/stale acknowledgments rejected; disconnected-client deadline; persisted actor alarm; next-hand opening alarm; closing during the opening stays closed.
- Repository builder reproduced the exact reviewed Worker bytes.
- Local actual native browser UI at 393x844/360x740 passed default 1x and a MAX-host/3x-guest reload case. Actual settling, approved shuffle, cards in mid-deal and later bidding screenshots personally inspected. The default-paced local timeline finished about 12.9 seconds after Start and bidding followed around 13.2 seconds.
- Exact LIVE URL timing test passed: initial server phase dealing, no bot bids at Start, bid controls hidden during opening, guest reload retained seat/hand, fast host waited for slower guest, no deadline fallback, zero page JavaScript errors. Browser-side stage times: host presentation 1.942s, shuffle 1.978s, flight 2.249s, finish 4.205s, auction 13.605s; guest after reload presentation 8.039s, shuffle 8.066s, flight 9.765s, finish 12.971s, auction 13.310s. These are observed test timings, not guaranteed network latency.
- Exact LIVE API + real WebSocket test passed: no initial bot bids; early human bid returned DEAL_IN_PROGRESS; stale ready rejected. With no human acknowledgment or further room requests, an actor-alarm WebSocket update opened bidding after 25.156s. This is cloud alarm recovery, not proof of forced eviction/crash recovery.
- Exact LIVE native two-human/two-bot match passed: target 500, 3 hands, 74 actions, 9 reload/reconnect checks, Team B, scores [-585,355], zero recorded page JavaScript errors. Repeated Next Hand openings were exercised.
- Exact LIVE native four-human match passed: target 100, 1 hand, 46 actions, 3 reload/reconnect checks, Team B, scores [-195,85], zero recorded page JavaScript errors.
- Hosted total across preserved releases is now 17 completed matches / 51 hands / 1,932 accepted or harness-counted actions. Abandoned closure/alarm tests and partial runs are not counted as completed matches.

Earlier failed harness attempts are preserved as diagnostics: old gameplay script did not recognize native shuffling; a session GET timed out; reload observers attached too late; transient-frame waits expected cards already dealt before a slow screenshot returned. These were test transport/observation problems and not counted as passes. The final recorder installs before scripts and timestamps in-browser transitions; no product UI fix was layered for a screenshot-delay assumption. The normal game/server fixes are the opening lock and restored approved presentation described above.

## Preservation / rollback / limits
Existing live rooms already in progress had no opening record and are not restarted by this deployment. Already-open browser tabs should reload normally to receive the updated inline adapter; no service workers or player careers were cleared. Invite, QR and host Close Table remain implemented. Both private Workers, original secrets/namespaces, public GitHub Pages runtimes, production repository runtime and all approved assets remain unchanged.

The exact prior source is 18a5e303ca7de25a9fe31b465e4407c3c02c3f82, prior version fe5f75c1-c401-43c5-97e9-8694591c9d95 / deployment aa828f27-3ab0-4383-a756-b46bb2877df5. It preserves closed-room tombstone protection but restores the known instant-auction behavior. A rollback to that protocol requires browser reloads; new clients otherwise keep trying the ready endpoint absent from the old server. Preserve SAME live namespace, secret and rate bindings, with no migration or data reset. Prefer the now-verified current 80e1604 source as the rollback checkpoint for future changes. Local exact prior module: public-release/rollback-fe5f75c1.mjs.

Physical Android, phone-camera scanning/OS share UI, independent networks/roaming, subjective sound and production-scale monitoring/load remain unverified as previously authorized/deferred. Server bots are still the simple recovered bots, NOT X1. No concurrent premium UI assets were merged. All permanent project rules in the full historical record below remain binding and must pass forward in full.

---

# Historical live release and prior feature verification (preserved)

# Current live update — Invite, QR and Close Table verified

Live game: https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/

Owner requested functional Invite, QR and host Close Table on October 20, 2026 around 01:10 Eastern. All three are now deployed and verified. Reload an already-open game normally to receive the updated adapter. No service workers or player careers were cleared.

## Current source / deployment
- Source commit: 18a5e303ca7de25a9fe31b465e4407c3c02c3f82
- Branch: work/cloudflare-846-native-adapter-20261019
- Worker version: fe5f75c1-c401-43c5-97e9-8694591c9d95
- Deployment: aa828f27-3ab0-4383-a756-b46bb2877df5
- SAME SQLite namespace: bb1bf1c32b68451cbe5db6fee3066fa0
- Deployed source readback matched reviewed code; secret and rate bindings retained. No migration or room reset.
- Changed implementation: cloudflare/live/adapter-live.js, build-live.py, worker-live.mjs, close-unit.mjs.

## Behavior
Invite uses the game's existing native sharing control to share the live site's room-specific URL and eight-character table code. QR uses the game's existing QR artwork/control and encodes that same room-specific URL. Opening either link pre-fills the Cloudflare Join by Code form. It does not auto-seat or silently replace another human. Existing reserved seats continue to reconnect first. No reconnect/seat token appears in the share URL.

The host's waiting-room Leave control is now Close table. It confirms the action and closes the room on the server for everyone. In-game host leave paths also route to confirmed closure. Guests retain Leave table with their seat reserved. A closed room broadcasts a closure event, clears only that room's saved Cloudflare credential, notifies connected players and returns them to the lobby. Closed codes/tokens cannot join, restart or reopen that room. Repeated close by the authenticated host is idempotent. The server retains a closed tombstone until normal idle cleanup instead of deleting/recreating namespaces. The host can create a new table with a fresh code immediately.

## Actual executed checks
- Unit service: guest and wrong-token close denied; host close/idempotency; closed snapshot/join/start denied; tombstone retained; new table allowed.
- Local native browser UI using a declared isolated HTTPS preview over the local service: native Invite payload captured, QR generated and decoded with jsQR, invitation prefilled, guest joined, host closed, both browsers alerted/returned, room credentials cleared, new table created. Zero page JavaScript errors. The localhost-only attempt correctly hid QR; the first guest-name test paused because the harness had not clicked Change player. These interrupted attempts were not passes or product repairs.
- EXACT live URL: same complete Invite/QR/join/close/new-table UI flow passed with independent mobile-sized browser identities. QR PNG pixels decoded to the same exact URL as Invite; that URL was actually opened and joined by the second browser. Both browsers received the closure message. Zero page JavaScript errors. QR, invite form and fresh-table screenshots personally inspected at 393x844 and 360x740. Automated test QR screenshots show test tables that were subsequently closed, not reusable owner invitations.
- Live API: guest close denied; close after game start passed; repeated host close passed; both previous seat tokens received 410 ROOM_CLOSED; new join on closed code rejected; fresh table create passed.
- Exact current-version native gameplay regression: two humans plus two server bots, target 100, one hand, 24 actions, three reload/reconnect checks, Team A, scores [150,-195], zero recorded page JavaScript errors. This brings hosted completions across preserved versions to 15 matches / 47 hands / 1,812 accepted or harness-counted actions. Closure test games are not counted as completed matches.

Physical phone-camera scanning and Android OS share-sheet interaction remain unverified; the actual QR image was decoded and the shared payload/link were exercised in browsers. This does not reverse the owner's decision to defer physical testing. X1 is still not integrated. All earlier unverified operational limits below remain.

## Exact rollback
Prior live code: 01cc60176ea21d5dc5b65488ce254fa4307f1f12; version 13374624-c1f0-423b-89e1-0c554dc4e590, deployment 21997efa-e187-4abd-bc15-25de467f5fc7. Preserve that exact historical module, but do not blindly redeploy it after tables have been closed: it lacks the new closed-tombstone read guard. To undo sharing UI alone, retain the current closed-state guard, closure protocol and event handling. For future changes, the safe fully verified rollback checkpoint is current commit 18a5e303ca7de25a9fe31b465e4407c3c02c3f82 / version fe5f75c1-c401-43c5-97e9-8694591c9d95, with SAME namespace, secret and rate bindings and no migration. An emergency pause can disable only the live workers.dev route while preserving stored rooms. Never resurrect closed rooms or reset storage. Local preserved exact code: public-release/rollback-13374624.mjs. Original private Workers and both public GitHub Pages runtimes remain untouched.

The following initial launch record is preserved as history; its source/deployment identifiers and invitation limitation are superseded by this current update. Full permanent project rules remain reproduced below and must pass forward.

---

# Griffin House of Rooks — Live Cloudflare beta release

Owner authorization: October 20, 2026, 00:51 Eastern. Jerome instructed: "I want to continue where we're at, even if we haven't ran physical Android network testing. We can do it after we get it live." This explicitly supersedes the earlier physical-device gate on launch. Those tests remain unverified; they were not relabeled as passed.

LIVE GAME: https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/

Open the link on each device. Host selects Play with Friends and shares the table code. Guests select Join by Code. Host may Fill seats with server bots, then Start Game. No private gate key, four-person test team, software installation or manual file transfer is needed. Cloudflare owns rooms and referee state; no phone hosts the server. Native Invite shares the live site's URL and code; invitation auto-prefill was not separately certified, so joining by code is the verified path.

## Exact live release
- Repository: jeromeleegriffin/Test
- Source branch: work/cloudflare-846-native-adapter-20261019
- Live source commit: 01cc60176ea21d5dc5b65488ce254fa4307f1f12
- Source files: cloudflare/live/build-live.py, worker-live.mjs, entry-check.mjs
- Worker: griffin-house-of-rooks-online
- Version: 13374624-c1f0-423b-89e1-0c554dc4e590
- Deployment: 21997efa-e187-4abd-bc15-25de467f5fc7
- New independent SQLite RoomDO namespace: bb1bf1c32b68451cbe5db6fee3066fa0
- workers.dev enabled; version preview URLs disabled.
- Exact deployed source readback matched saved release code. Session signing secret binding retained and never published.
- Native source/assets pinned to b3f3928548bc79df5169165b953e458cc68ddc09, build 846-complete-repairs-20261019. Latest inspected main a10cf91 contained documentation changes only since that runtime.

## Live access and security
The root URL serves the actual game and issues an HttpOnly, Secure, SameSite=Strict HMAC-signed browser session. Sessions last twelve hours; an expired session can be renewed by reopening/reloading the game, then the stored seat token rejoins the reserved seat. The public room API requires a signed browser session. Mutations require same-origin requests. Existing private seat tokens, revision checks, idempotency keys, card privacy and one-use WebSocket tickets remain enforced. No signing secret is returned to players. This is anonymous friends-table access, not a verified-account identity system or trusted cloud career service.

Cloudflare rate bindings: ENTRY_LIMIT namespace 14784620261020, 12 requests/minute per IP and operation for new sessions/create/join; ACTION_LIMIT namespace 14784620261021, 360 room requests/minute per IP. Limits are per Cloudflare location and eventually consistent; they are not exact global accounting or a complete anti-abuse system. Legacy test launch/four-player-check routes return 404. No paid service or account upgrade was enabled.

## Executed verification on this exact LIVE Worker
Targeted entry/security checks passed locally: actual native HTML, no-store, signed cookie flags, missing/forged sessions denied, cross-origin writes denied, rate-limit rejection, legacy test pages hidden.

Actual native hosted matches on the live URL (independent Chromium browser contexts, mobile viewports, verified HTTPS/real WebSocket bridge):
- Two humans plus two server bots: target 100, one hand, 24 UI actions, 3 reload/reconnect checks, Team A, scores [60,-195].
- Four humans: target 100, one hand, 46 UI actions, 3 reload/reconnect checks, Team A, scores [165,-195].
- Zero recorded page JavaScript errors. No asset retry or exhausted-fetch log messages in this run.
- Actual waiting room, bidding and completed-game screenshots personally inspected. Real approved table, portraits and numbered cards rendered. No replacement artwork or landscape changes.
- Ten live security checks passed: missing/forged session, missing/wrong seat token, unauthenticated socket ticket denied, wrong player cannot bid, changed-command action replay denied, single-use socket ticket, cross-origin write denied, legacy harness hidden.

Total across preserved private and live releases: 14 hosted completed matches, 46 hands, 1,788 accepted/harness-counted actions. These are not 14 physical-phone matches or 14 matches all on the final version. Local structured-clone tests are separately documented. Earlier interrupted/failed long-run diagnostics remain preserved and are not counted as passes. See coordination/cloudflare/CURRENT_PRIVATE_STATUS_20261020.md and tests/continuation-500 for complete historical evidence.

## Preservation and rollback
Original Worker griffin-room-local-poc remains version 7e57f6f5-9524-4456-96d2-379f406b2d01, namespace 4a45f65563174df6847cd5576973088a. Private candidate griffin-room-846-private-20261020 remains version 5cfd6814-3b3b-4916-80e6-1633a7d4449a, namespace 5b0de759387647e2b07361c360fa89ff. Both deployment readbacks confirmed unchanged after live launch. Their secrets and stored rooms were not changed, migrated or reset. Both public GitHub Pages games and production repository runtime remain untouched. No careers, achievements, XP, identities, settings or service workers were cleared.

Before every later live change, preserve its exact source and deployment. Roll code back by redeploying exact reviewed worker-live.mjs from 01cc601 against SAME live namespace bb1bf1c32b68451cbe5db6fee3066fa0, keeping secret_text and rate-limit bindings, without new migrations or room resets. For an emergency pause, disable ONLY this new Worker's workers.dev route through its subdomain setting; retain the Worker, namespace, room data and secret. Do not roll live users into a private namespace or remove the existing Workers. This is the initial live deployment, so there is no earlier live deployment to restore.

## Confirmed limits / follow-up
Owner authorized live beta use before physical testing. Real Android/tablet touch, independent Wi-Fi/cellular networks, long background suspension/roaming, subjective audio, forced DO eviction/crash, long expiry, load/cost and operational monitoring remain unverified. This release has the recovered simple server bots, NOT X1. X1 server integration and concurrent premium portrait UI work remain separate. Cloud multiplayer does not award trusted career/XP. Preserve existing offline gameplay and approved graphics. Native invitation auto-prefill and cross-device QR scanning were not separately certified; room-code joining is verified.

Recommendation: owner-authorized LIVE BETA, usable now for friends tables; gather device/network evidence after launch without claiming it already exists. Continue from the exact source/deployment above. Do not restart or repeat bulk tests without a specific change or unresolved risk. The permanent project rules below remain binding and must pass forward in full.


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


---

# Cloudflare speed and gameplay audit — 2026-10-20

Current beta: https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/

Continue this work; do not restart or replace approved assets. Owner authorized continued online beta before physical Android/cellular testing. Original mission and preservation rules remain in force. Master Brain AF history was not changed. Never deploy to the protected original private Workers, Pages games or production repository.

## Exact release

- Repository: jeromeleegriffin/Test; branch work/cloudflare-846-native-adapter-20261019.
- Code commit: 6a6e88d163831d6fbcc6d9785c0d6a461eba0526; parent be18381b0c2ead0e5949526b1602f7f1b298e875 was rechecked before edits.
- Worker: griffin-house-of-rooks-online; version 0ddb4c03-6920-455a-aea5-4b16cd0ba766; deployment 9ddb0b7b-20e5-4ce6-b8c0-bee8b914644e. Exact deployed source readback matched the candidate. All completed hosted runs below used this version, with no intervening code update.
- Existing RoomDO namespace bb1bf1c32b68451cbe5db6fee3066fa0 and signing secret preserved. Rate bindings retained. No migrations or room reset.
- Immutable approved runtime assets remain pinned to b3f3928548bc79df5169165b953e458cc68ddc09 / 846-complete-repairs-20261019. No landscape, artwork, offline source or production changes.

## Reproduced causes and fixes

1. Native pace buttons changed the browser while the server used fixed timers. Host pace now persists in the room and synchronizes to every player. Guests cannot change the shared pace and their personal saved preference is preserved. Delays scale at 1×/3×/MAX, with safety minimums for native stamp and capture. A pace change reschedules a pending bot turn; an already-running presentation finishes without interruption.
2. Skip effect was explicitly removed from the native end-hand effect before first paint. Automatic reveal and completion remain intact.
3. Accepting a guaranteed lay-down skipped the native cards and went directly to score. The server now publishes a temporary claim presentation with the claimant's cards, masks summary/winner and other hands until it ends, rejects early commands, and preserves idempotency. Native approved animation runs. Final summary includes the intended hand reveal.
4. A same-hand redeal reused its earlier animation identity and could wait for the25-second fallback. Each opening now has a UUID. The native deal owner and acknowledgement include it; stale supplied IDs are rejected. Missing IDs remain supported for older clients. Actual all-pass server actions and rendered same-hand redeal were tested.

## Completed evidence on this release

Three hosted rendered full matches: 7 hands, 195 recorded human actions, 15 reload/reconnect checks, zero page JavaScript errors. Native controls drove all actions, including nest pickup/discard, trump, legal play, scoring and next-hand transitions.

```json
{
  "audit-1x-hosted": {
    "results": [
      {
        "humans": 2,
        "target": 100,
        "hands": 1,
        "actions": 24,
        "reconnects": 3,
        "final": "Team A",
        "scores": [
          70,
          -195
        ]
      }
    ],
    "errors": []
  },
  "audit-3x-hosted": {
    "results": [
      {
        "humans": 4,
        "target": 100,
        "hands": 1,
        "actions": 47,
        "reconnects": 3,
        "final": "Team A",
        "scores": [
          190,
          -195
        ]
      }
    ],
    "errors": []
  },
  "audit-max-hosted": {
    "results": [
      {
        "humans": 2,
        "target": 500,
        "hands": 5,
        "actions": 124,
        "reconnects": 9,
        "final": "Team B",
        "scores": [
          -625,
          350
        ]
      }
    ],
    "errors": []
  }
}
```

Separate local rendered matches: 1× two humans/two bots (1hand24actions3reconnects); 3× four humans (1hand46actions3reconnects); MAX two humans/two bots (3hands74actions9reconnects). Total5hands144actions15reconnects. Do not count these as hosted.

Service regression:10matches,2,054actions,351secure reconnect checks, accelerated clock. Twelve targeted service test files passed: bot picker, claim, close, collection, deal, invalid actions, pace, rare rules, redeal, sequence, single seat and trump. Invalid-action follow-suit rejection was added and rerun after the aggregate receipt was produced; it passed. Node-only service tests read the candidate Worker and do not need browsers.

Controlled local actual-rendering scenes: final Black Bird/Red Two capture with bird arriving fourth at1×/3×/MAX, one fight completion/no cancellation and real canvas draws; automatic end-hand effects/no Skip control; accepted lay-down at all3speeds; same-hand redeal; Moon selection requires explicit confirmation, one howl, no replay on reload; Moon success500 and failure from negative scores−500/10 rendered correct winners. Reload during final bird collection preserved seat, own hand and player identities and reached scoring. Manufactured endpoints exist ONLY in the local fixture server and were never deployed.

Moon rules: all counters win even after losing a zero-point trick; lost counter fails; negative scores supported; all-pass redeal and forced-dealer option. Human hands remain disjoint and private. Invalid bid/discard/trump/card, wrong player, stale and duplicated/reused command, unauthorized token and claim/collection locks covered.

Hosted presentation: native stamp1954ms, first card3844ms; two individually paced bot cards; nine nonzero bot voice buffers and actual voice-queue starts; no stale Picking trump status in play. This verifies decoding/queueing, not physical speaker output.

Hosted QR/share/close regression: QR decoded to exact invitation, invitation prefilled room, guest joined, host close notified both, old credentials cleared, a distinct new table created; no page errors. OS share sheet was intercepted in automation; a physical QR camera/Android share sheet was not tested. Hosted security passed11checks including sessions/tokens, four distinct private hands, one-use socket tickets, changed-command ID reuse and cross-origin writes.

## Failed attempts and test limitations

Early hosted MAX/3× runs timed out at the automation30-second full-load navigation deadline or had repeated asset-fetch failures. They are NOT counted as passes. Test transport now waits for DOM plus actual game ready, bounds concurrent asset fetches and caches only successful immutable assets per browser context. No room mutation retry, security bypass or product code change was used to resolve transport load. Completed1× hosted run recovered from one failed snapshot fetch. Early local MAX run was stopped to add tracing and its completed rerun is counted. Full logs retained.

All browser tests used desktop Chromium with mobile viewports and independent contexts. No physical Android, independent cellular, production-scale load or physical audio certification. Bots remain simple server test bots, NOT X1. This is a stronger beta, not exhaustive certification of every possible game state. Recommend continued authorized beta; physical-device/network and broader load checks before broad production promotion.

## Files and reproducibility

Code changes: cloudflare/live/adapter-live.js, build-live.py, worker-live.mjs, pace-unit.mjs, claim-unit.mjs, redeal-unit.mjs, rare-rules-unit.mjs, invalid-actions-unit.mjs, plus cloudflare/rollback/worker-live-before-pace-20261020.mjs. Portable builder reproduced the generated Worker byte for byte.

Run Node-only tests from the repository: `node cloudflare/live/pace-unit.mjs` (and each other `*-unit.mjs`); `node cloudflare/live/protocol-regression.mjs`. Browser harnesses and workspace-relative local fixture are retained under cloudflare/live/tests for recovery. They require Playwright/Chromium, ws, https-proxy-agent, pngjs/jsqr, the pinned runtime checkout and the documented transport setup. Synthetic local fixtures never belong in a deployed Worker. Human identities/tokens and signing secrets must not be printed or committed.

Actual screenshots and all earlier release history are preserved in the comprehensive saved HTML report, retaining its existing identity. New source/evidence is on this branch, not main. Earlier handoffs remain historical; this section is the current state.

## Rollback and protected resources

Rollback only the online beta to Worker0d499a95-f2fc-4a7f-8308-cec8215bda44 at100%. Exact previous source: cloudflare/rollback/worker-live-before-pace-20261020.mjs, preserved byte-for-byte. Preserve namespacebb1bf1c32b68451cbe5db6fee3066fa0, rate bindings and signing secret. Do not reset data or migrate namespace. The additional pace/opening/claim properties are additive; a rollback can abandon an active visual hold, so prefer finishing test tables before rollback.

Protected original griffin-room-local-poc: version7e57f6f5-9524-4456-96d2-379f406b2d01, namespace4a45f65563174df6847cd5576973088a. Protected griffin-room-846-private-20261020: version5cfd6814-3b3b-4916-80e6-1633a7d4449a, namespace5b0de759387647e2b07361c360fa89ff. Neither was changed. Their private gate secrets were not changed. Never use either as the target for this beta's rollback.
