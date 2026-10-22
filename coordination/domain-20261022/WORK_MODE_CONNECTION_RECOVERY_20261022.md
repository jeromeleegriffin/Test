# Work Mode connection recovery — October 22, 2026

The full owner-uploaded recovery ZIP was read; all six manifest hashes and byte counts passed. Continue existing v40/v10a. No game rebuild or deployment occurred.

## Cloudflare access restored
Cloudflare whoami and GET /accounts succeeded. The first Workers-list call requested authentication; the connection reported authentication accepted and instructed a retry. The retry GET /accounts/0538bb3699997fa27a701684074b1126/workers/scripts returned HTTP 200 success. Deployments, settings, and branded Worker source reads then also returned 200. This verifies restored Workers read access, not an untested write operation. No token was requested in chat, created, or exposed. No billing change was made. Upgrade causation is not proven. Dashboard login was unnecessary and was not attempted.

## Verified live state
- Main Worker griffin-house-of-rooks-online: deployment f1c472f5-f5ee-4ed3-b0f4-877d29e95f5b; version dd4dbc6c-4640-4d84-a91c-15148de87a49, 100% traffic (v40).
- Branded Worker rooks-branded-entry-only-20261022: deployment 166a4ffb-e98a-4649-9490-d4204a546ce2; version 8371a14e-e174-40ea-b48e-257ea42c42eb, 100%. Downloaded source length 37,701 characters and marker 20261022-v10a-direct-table-seats, matching the archived source length/marker.
- Main settings: compatibility date 2026-10-14; ASSETS present; ROOMS class RoomDO namespace bb1bf1c32b68451cbe5db6fee3066fa0; ENTRY_LIMIT 12/60 seconds namespace 14784620261020; ACTION_LIMIT 360/60 seconds namespace 14784620261021; TEST_GATE_KEY secret binding present (value never read).
- brain/current.json on main remains AH. Current invitation handoff ends at v10a. No prior experimental UI restored.

## Browser checks and limitation
The real browser loaded https://rooks.jeromegriffin.com/ and reached the lobby at ?cloud=1. Play With Friends created disposable table YOU18 and showed 1 of 4 seated. Opening https://jeromegriffin.com/r/YOU18 in a second tab reached the real waiting-table guest preview, with original name field, avatar control and three Sit here seats; no large room-code form.

Attempted name entry Recovery Guest and partner-seat click. This did NOT verify an independent guest join: tabs shared the same browser origin/session and the host's existing credentials. UI remained 1 of 4 and the name/avatar controls disappeared from the preview after the attempt. Treat this as an unresolved same-profile invitation/rejoin observation; do not infer a fresh-device defect or mark guest seating passed. Next work should reproduce with independent browser storage without wiping user storage, and inspect same-room saved-token handling if reproducible. Physical Android/Facebook keyboard, independent guest seating, race, reconnect and full-match acceptance remain pending.

Cleanup: closed the guest tab, used host Close table, confirmed the branded Close this table dialog, and observed return to ordinary lobby. No existing owner table was used. No service worker/storage clearing, gameplay/source changes, image changes, Facebook posts, secret changes or deployment.

## Next
Continue from restored API access. Preserve v40 and v10a. Resolve the shared-session observation in an isolated reproduction and complete independent guest/mobile checks before claiming approval. A write/deploy should occur only for a verified defect with rollback and preservation of existing bindings.
