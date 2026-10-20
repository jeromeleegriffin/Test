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
