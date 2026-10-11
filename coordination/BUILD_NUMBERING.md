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
