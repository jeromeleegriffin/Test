# Griffin House of Rooks - Named multiplayer bots live fix
Date: October 21, 2026
Status: LIVE_DEPLOYED_VERIFIED
Issue: Existing Play With Friends Cloudflare rooms exposed "Test Bot 2", "Test Bot 3", and "Test Bot 4" on the actual seated-player table. Owner supplied a screenshot; these labels came from the persistent Cloudflare RoomService, not from the art assets.

## Cause
The fillOpenSeatsWithBots action in cloudflare/live/worker-live.mjs generated isBot=true room seats with displayName "Test Bot ${seat + 1}". This live code was inherited from the private multiplayer proof of concept.
New room creation already left seats 1-3 null and never automatically filled them. The host explicitly adds bots with the Fill Open Seats or bot picker actions; actual humans can join vacant spots or replace a bot before dealing. These semantics must not change.

## Minimal approved fix and safeguards
- In the server's explicit host-driven fill action, generated seats now receive authentic House personas: Dagger, Crow, Blaze. If an occupied human or bot has the same name/avatar, safe alternate personas are Grit, Hearth, Brandy and further fallbacks.
- Preserve internal bot playerId shape 'private-test-bot-*' for compatibility but never expose test-era display names on new seats.
- Existing current game rooms with persisted Test Bot labels get client-only cosmetic mapping to their actual avatar persona during fresh snapshot render. This does NOT rewrite the persisted data, card hands, revisions or human names.
- Host controls Fill Open Seats, individual seat selection and game start. No default bots or automatic seat occupancy added.
- Do not redesign approved table, avatars, room panel, bid dock, cardholder or speed controls.
- Do not clear service workers, change GitHub Pages, close any existing player rooms or change X1 v2 logic.

## Release
Isolated change branch: work/asset-recovery-20261021
Worker source commit (original tested): 2fac081f2a827b4bfe7c94a48396ba326fd93237
Cloudflare Builds live run: bff1c11d-0ac6-42a0-80cc-2ce4f170cd8f - success.
Cloudflare Worker: griffin-house-of-rooks-online
New deployed Worker version: 73aa7be6-9dc0-43ee-a267-20e9fe0f1c62
New deployment ID: 3bfee3a0-9f9c-4fb3-9725-490459c320ee
Traffic: 100%.
Rollback immediately preceding Cloudflare-only version: 8b220d87-1d24-4c13-88ad-368c858445b9 (use a 100% version deployment; no storage reset).
Earlier pre-Cloudflare-only rollback: f9fd3cd5-67a1-49ae-850d-7c2ca60c1ad7.

## Grounded verification
Source and injection unit QA passed: https://github.com/jeromeleegriffin/Test/actions/runs/39692277029
Isolated stage real room QA passed (initial transient test raced deployment and failed correctly, rerun passed): https://github.com/jeromeleegriffin/Test/actions/runs/39692476531
Actual LIVE real Cloudflare API QA success: https://github.com/jeromeleegriffin/Test/actions/runs/39693134706
Live QA created and CLOSED new disposable rooms, never used existing human room codes. It verified:
- A newly created friends room has only host seat occupied and the other three truly empty.
- Fill-bots produces Dagger, Crow, Blaze with isBot=true, X1 online v2 active upon starting.
- Real human guest can replace an unstarted bot without losing identity.
- Collision resolution when the host name/avatar is Dagger produces Grit.
- A one-seat fill leaves other seats empty.
- No existing real player name is modified by the client compatibility alias.
Cloudflare deployed source independently read after release: exact real bot names found, client legacy alias present, "Test Bot ${seat + 1}" seat-generation expression absent, Cloudflare ASSETS present, no raw GitHub fetch.

## Live storage protected
Existing live RoomDO namespace: bb1bf1c32b68451cbe5db6fee3066fa0
Existing ENTRY_LIMIT namespace: 14784620261020
Existing ACTION_LIMIT namespace: 14784620261021
Existing TEST_GATE_KEY secret binding retained
Cloudflare assets binding and original compatibility_date 2026-10-14 retained.
No migration or reset performed.

## Owner phone / browser caveat
An already-open Chrome tab may still contain the older injected adapter JS in memory. Reload that tab normally to obtain the new alias. Do not clear local storage or service worker caches and do not leave/delete an active live room just for this cosmetic update.
For a *new* Play With Friends room, before pressing Fill Open Seats, the other three seats should remain empty. Pressing Fill Open Seats intentionally adds House bots. For an old active room, the legacy names should display the persona after the new page loads, but old saved room state is deliberately not rewritten.

Canonical URL: https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/
