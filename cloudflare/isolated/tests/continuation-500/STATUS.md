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

## Follow-up: bounded asset retries and completed four-player match

The next continuation added verified-asset-fetch.cjs to the AUTOMATION transport only. It retries GETs under /cloud-game/assets/ up to three times, including terminated response bodies and selected transient HTTP statuses. It never retries action POSTs. Injected checks passed: response-body termination retries successfully, failed mutation POST is attempted once, persistent asset failure stops after three attempts. TLS verification remains enabled.

The actual hosted native 500-point four-player match then completed: 14 hands, 660 UI actions, 9 reload/reconnect checks, Team B winner, final scores [-595,-280], zero recorded page JavaScript errors. The existing server rule ends a match when a team reaches the positive OR negative target; the final native screen correctly rendered Raven Wins. Combined hosted completed match total is now 11 (9 initial + 1 prior two-human continuation + this four-human match). Receipt: completed-matches.json; full log: four-player-asset-retry.log.

This run experienced an execution-tool process-connection interruption and many asset transport errors: 170 logged retry events and 75 exhausted GET fetches. Subsequent separate verified HTTPS probes returned 200 for both the Worker and immutable GitHub game source. The match continued and completed despite that interruption. This is a gameplay completion pass WITH A DEGRADED-ASSET TRANSPORT LIMIT, not a clean asset-loading or physical-device certification. Final score screenshot and final discard selection screenshot were personally inspected. The latter shows real numbered cards, complete discard panel and usable confirm button.

No Worker, game runtime, artwork, original namespace, secret, public repository runtime or player data was changed. This does not resolve the cause of all earlier click/update timeouts, and is not evidence of successful forced DO eviction or real cellular roaming. Keep the private candidate; public release remains held. Further work should prioritize real deployment hardening and controlled device/network access, rather than repeating hundreds of identical test hands. Preserve all original project authority and continuity rules in PRIVATE_RELEASE_20261020.md.
