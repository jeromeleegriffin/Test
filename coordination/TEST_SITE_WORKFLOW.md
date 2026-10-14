# Standing Test website workflow — owner decision 2026-10-14

Owner Jerome Griffin authorized tested development updates directly to https://jeromeleegriffin.github.io/Test/ rather than full game ZIPs after every repair. Exact owner confirmation: “Yeah, let's do that. Then all I got to do is open the website every time and it be updated and we can roll with it that way. That's what I really wanted.”

This supersedes this Work session's earlier no-Test-deployment restriction for reviewed, task-authorized changes. Production at /Griffin-House-of-Rooks/ remains separately protected and requires explicit applicable authorization. No unattended background deployment is implied.

For each update: refresh live brain/current.json, registry and coordination; reconcile overlapping work; preserve the current Test commit as rollback; implement/test only the requested scope in isolation; publish the changed runtime files atomically with an expected-head lease; verify the Pages job, served bytes and browser runtime; record source identity, evidence, limits and rollback. An owner Test-deployment approval is not Android acceptance or production approval.

Use full ZIPs for significant milestones, explicit owner requests or recovery, not every incremental repair. Preserve existing archives and original assets. Continue the authoritative numbering policy for any future numbered package; never infer authority from the largest number. An unnumbered runtime deployment has a unique release ID and exact commit/hash identity.

Never clear player data or require FRESH for an ordinary update. Preserve service-worker compatibility and verify page/script/worker/cache coherence. A tab kept open may need reopening or a normal reload after publication; do not promise every already-open tab changes instantaneously.

Current initial rollout: runtime805-stability / release stability-9a8f4d4242e1-20261014, exact reviewed source HouseStability-9a8f4d4242e1.zip SHA256 ed0edd7e44c6cdc762daa5e0c817b36892a9f13efc04b08c63cb310e10d859e2. No new game package or official build number is assigned by this deployment. Read MAIN_DEVELOPMENT_STABILITY_20261014.md for evidence and status.

The permanent complete-bank reading procedure and both verbatim chat-continuity authorities remain unchanged. Separate chats must read this record explicitly; no automatic notification is claimed.
