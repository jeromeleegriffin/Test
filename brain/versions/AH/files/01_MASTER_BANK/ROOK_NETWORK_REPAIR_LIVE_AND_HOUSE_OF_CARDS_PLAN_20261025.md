# Rook live repair and Griffin House of Cards plan — October 25, 2026

## Current live authority
Jerome explicitly authorized repairing live Rook in this conversation. The exact tested candidate was uploaded at 2026-10-25T23:04:16Z.
Worker version: 537ee828-33be-4071-997e-f8efad11348e.
Deployment: d3e73c2d-4779-4e4f-92f8-01b6bcdb7b68, 100%.
Previous version: a825e1d5-301a-4490-9e15-6ec7273fc4f2.
Read back all 21 modules: every SHA-256 equals the tested candidate.
Only worker-cloud-only.js and audit-delivery.mjs changed. Other 19 modules, static assets, rules, Rook intelligence and frozen Spades X1 remain unchanged.
Existing room namespace, eight bindings, rate limits, secret binding, career config, music KV, directory binding and compatibility date 2026-10-14 retained.
Cloudflare required the already-existing RoomDO export to be declared as sqlite; reconciliation created/updated/deleted/renamed/transferred zero namespaces. No migration or storage reset occurred.
Both Workers.dev and rooks.jeromegriffin.com returned repaired HTML. The formerly failing entry script now returns 200 with its exact original bytes.

## Repairs
- Private persisted create/join attempt receipts and single-flight creation recover a committed room/seat after lost replies or reloads; existing UUID clients remain supported.
- An interrupted cosmetic deal cannot permanently block authoritative bidding. Native cancellation, phase advancement, resize/visibility and a bounded deadline release it.
- Failed drawing does not permanently mark a revision rendered; retry the same current snapshot.
- A stable fallback for unbound landscape card clones calls the existing native turn/legal-play validator; cards with their normal handler are left alone.
- SHA-256-pinned preservation of the exact current portable entry script avoids an obsolete cleanup throwing a startup error.

## Existing validation
12 targeted regression tests pass. The exact repaired service completed 200 accelerated hands, 6,001 actions and 703 rejoins, cycling 1–4 human seats with existing bots.
Separate isolated four-human browser hand: all 40 cards, 4 bids, nest/trump, next-hand advance, 8 viewport orientation changes, 2 reloads, intentionally lost create/join replies, lost deal finish and one render exception; zero JavaScript errors.
These are not 200 browser hands, a geographic load test, or physical Android/cellular/audio certification.
Private source and complete original rollback modules are in Rook_Network_Repair_TESTED_NOT_DEPLOYED_20261025.tar.gz, Library libfile_ba63a4151700819197648d343d4ede58. The filename describes the pre-publication checkpoint; the exact candidate in it is now live.
Public GitHub receives this documentation, not the protected complete Worker source.

## Owner direction: bring Rook and Spades together
Jerome wants a neat, unobtrusive Try Spades option on Rook's landing page, a Play Rook option on Spades, and reopening the preferred game. Proposed umbrella name: Griffin House of Cards. This name is a working proposal, not permission to generate or replace approved logos.
This turn authorizes the Rook repair and integration planning, not publication of Spades or a combined launcher.

## Proposed implementation
1. Keep each familiar game landing page. Add one small secondary link, beneath the main play choices, using the existing house styling. Avoid a large new chooser or repeated launch popup. Keep the current table/holder/avatar/name treatments.
2. Use a shared same-origin launch route. Default existing/new users to Rook unless they deliberately choose Spades. A local preferred-game value opens the chosen game on later shortcut launches. Remember only a successfully opened explicit choice; provide a working fallback if a game is unavailable.
3. Explicit game routes and table invitations take priority over remembered preference. Rook invitations always open Rook and Spades invitations always open Spades. Following a friend's invitation need not replace the saved preference. Never redirect an active match because another tab changes the preference.
4. Keep backend state separate: Rook's existing room API/namespace remains; Spades already uses /api/tables and SPADES_ROOMS/SPADES_DIRECTORY. A small route/service-binding layer can serve Spades under /spades/ while retaining Rook's routes. Audit all asset paths, redirects, WebSocket URLs and API paths before publishing. Do not merge game reducers or bot logic.
5. Keep both games on the same browser origin for a shared preference and installed shortcut. Initially preserve the existing address/manifest identity. A new cards domain can be a later migration; changing origin cannot transparently preserve the installed app or browser storage.
6. Umbrella manifest name Griffin House of Cards; short_name Griffin Cards. The current Rook manifest has id /cloud-game/assets/, start_url /, scope /. Keep this id and manifest URL stable on each existing origin, and keep the launch URL as the preference dispatcher. Do not simply adopt Spades' standalone manifest as a second installed app.
7. Audit service-worker scope/cache rules. Keep API/socket/career traffic network-only. Load the chosen game first; share only assets verified identical and use canonical URLs so opening Spades does not force a second complete Rook asset load.
8. Preference is per browser/device initially. Do not promise account-synced selection without adding and testing a separate account preference. Never reset career data or room credentials.
9. Test first launch, each switch direction, close/reopen, browser back, invalid/blocked storage, offline launch, missing Spades, direct invite with opposite preference, two tabs, rotation, existing PWA update and cache migration on Windows/Android/tablet. Preserve room rejoin semantics.
10. Stage the combined landing and preference routing for owner review before public launch. No branding or shared navigation was changed by this Rook repair.

## Shortcut behavior sources
Chrome's installed PWA name/short_name update asynchronously; changing manifest identity or origin can create a different installed app.
https://web.dev/articles/manifest-updates
https://developer.chrome.com/docs/capabilities/pwa-manifest-id

## Spades status carried forward
The complete Spades game remains separate and not deployed. Frozen X1 strategy preserved. Prior measured tests: 1,000 authoritative hands, 12 real-browser hands, 75 rotations and 20 integration/fault tests.
Artifact: Griffin_Spades_Full_Game_Cloudflare.zip, Library libfile_a783733e80e08191912768ced8db7c6d, version 1.
Do not restart bot work or reopen the three owner-accepted deferred visual issues.

## Post-deployment live check
PASS: one fresh unlisted four-human production QA table completed all 40 plays, 4 bids, nest/trump, next-hand advancement, 8 viewport changes and 2 reloads. One create reply, two join replies, one deal-finish callback and one render were deliberately dropped in this disposable test. All recovered. Zero JavaScript errors, zero failed HTTP resources; test table explicitly closed. No owner game or account was used. Because direct Chromium egress is blocked in this runtime, browser HTTP requests were forwarded through Node to the real live origin. Live WebSocket delivery is not separately certified by this check; the earlier isolated browser check exercised the actual room broadcast code over local WebSockets. Physical phone, audible and independent cellular checks remain unverified.
