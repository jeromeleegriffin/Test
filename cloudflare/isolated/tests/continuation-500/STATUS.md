# Cloudflare continuation — 2026-10-20 UTC

Continue, do not restart. This is additional evidence after PRIVATE_RELEASE_20261020.md, whose full project preservation and continuity rules remain in force.

## State reconfirmed
- Isolated branch head before this note: d947b9cf2c02bffdba98e21b394a170bb5d3d793.
- Current private Worker version: e765eb3e-2fe7-4444-be27-701d6e731cbf; deployment 6c8da6df-5b51-4915-a991-f46a851f7523.
- Original Worker remains version 7e57f6f5-9524-4456-96d2-379f406b2d01, deployment b55a14ac-10bd-46e1-a6aa-129d27f56e02.
- GitHub main advanced to a10cf91 at inspection, with five documentation files changed since pinned b3f3928. Runtime identity remains 846-complete-repairs-20261019. No runtime merge is required for those changes.
- No Worker redeployment, public game change, production repository change or player-data cleanup was performed in this continuation.

## New executed tests
A native hosted UI run requested target 500, with two simulated human browser identities and two recovered simple server bots. It completed after 3 hands / 74 UI actions. Personally inspected final screenshot shows Griffin -585, Raven 295, Raven Wins (negative-score match-ending threshold). This is one additional completed match, bringing total hosted completed matches to 10. The harness wrote combined results only at the end of both configurations, so the first completed result did not get a JSON receipt when the subsequent four-player attempt failed; the console log and rendered final screenshot are retained. Do not invent missing result metadata.

The first four-player attempt stopped when a tutorial dialog after reload intercepted a bidding click. The harness now dismisses Skip tour after reload. A second attempt stopped at a visible legal-card click timeout after 14 actions. A diagnostic retry completed repeated hands and reached 272 UI actions, then exceeded its 10-second revision-update deadline without a logged response to the last play. These are partial FAILED / INTERRUPTED runs, not passed matches. Their causes are not all established.

A final diagnostic run raised the update allowance to 60 seconds (transport timeout is 45 seconds), used a 15-second card-click allowance and captured state/screenshots on action/update timeouts. It completed one hand (47 actions including next-hand), then a reload failed: verified HTTPS transport logged a terminated download of /cloud-game/assets/game060.js; game-ready wait timed out after 30 seconds. This is a confirmed test-environment transport interruption, not proof the previous timeouts share that cause. No new product repair was inferred or deployed.

Candidate unit checks were also rerun: all six groups passed (negative-score Moon, bid legality, target/options, Moon made/miss, metadata).

## Next work
Preserve these failed runs. Add bounded retries for idempotent asset GETs to the automation transport, retain verified TLS and capture load failures; never automatically retry mutation POSTs. Then continue targeted four-player long-match verification with incremental per-match receipts. Do not claim the diagnostic long-match run passed. Original 9 completed hosted matches remain separately documented and valid. Physical Android, independent cellular networks, background roaming, forced DO recovery, production hardening and X1 server integration remain unverified. Private controlled candidate only; no public promotion authorized by this note.

Evidence in this directory contains no gate or seat credentials. The diagnostic harness reads the existing private key file without printing it. The source game and deployment remain unchanged.
