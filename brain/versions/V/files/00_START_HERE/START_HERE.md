Master Brain V — Read H through V, current coordination, BUILD_NUMBERING.md and BUILD_REGISTRY.json before work. Approved baseline751 remains. Both754archives collide; shuffle variant needs planted rear-edge correction.755reserved for that correction, not delivered. Do not start over or deploy.

# Shared build-number reservation policy

Owner authorization: Jerome requested a Master Brain update and a fix for cross-session numbering collisions on 2026-10-10 (America/New_York). Published date is 2026-10-11 UTC.

One project-wide numbering authority: coordination/BUILD_REGISTRY.json on Test/main.
Three-digit ZIP names remain the owner preference. Numbers identify packages, not approval or source precedence. Never infer the current approved game from the largest number.

Before assigning a number, EVERY work session must:
1. Fetch current Test/main, brain/current.json, this policy, BUILD_REGISTRY.json, and relevant specialist records. Repeat immediately before reserving or delivering; old chat memory is not authority.
2. Reconcile existing delivered packages and active reservations. Never reuse a number, including cancelled/rejected reservations. Older unregistered outputs must be registered before continuing.
3. Choose an unused number and unique reservationId, recording session/workstream, task, exact source SHA-256, status RESERVED and date. In one commit add coordination/build-reservations/NNN.json and update BUILD_REGISTRY.json. Do not change someone else's reservation.
4. Publish that commit with a compare-and-swap branch update: expected_sha MUST equal the exact fetched main head, force=false. GitHub update_ref with expected_sha is the verified available route. Never force-push, omit the lease, or blindly retry. If rejected, fetch the new head, inspect all new entries and regenerate the reservation using a still-free number. Local files or an unreferenced commit are NOT a reservation.
5. Read back main and the reservation. Only a matching successful remote reservation authorizes using the number. If writes are unavailable, continue temporary work under the unique task identifier, but do not issue a numbered deliverable; record the blocker for Master Control. Jerome is not the messenger.
6. Before delivery, re-read current main and verify reservationId ownership; update that record and registry atomically to DELIVERED with archive SHA-256, byte length, exact saved filename/Library ID, source identity, approval status and test limits. Confirm the returned filename; '(1)' is a collision warning, not a new build number. If a collision is discovered, preserve both archives, mark CONFLICT and assign a fresh reserved number to any future rebuilt package. Do not silently overwrite or rename history.
7. Record owner acceptance separately. A reservation, desktop test pass or delivery cannot approve Android appearance.

This protocol serializes cooperating sessions using GitHub's expected-head check. It cannot prevent an already-running chat that has not read it from using a stale number. Each chat must read on resume AND before naming/delivery; no automatic chat notification is claimed. All project ZIPs share this registry; unrelated projects retain their own naming rules.

Brain publication also uses the same expected-head discipline: re-read current.json, choose the next unused Brain version, preserve previous versions, stage successor documents/inventory/current/history in one atomic commit, and reject stale publication rather than overwriting another chat's work.

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
