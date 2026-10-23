# Griffin House of Rooks — v43 guest presence and countdown
Deployed 2026-10-23; continue from this release. Do not rebuild or revert the v10g invitation layer.

## Authoritative deployment
- Main Worker: griffin-house-of-rooks-online
- Version 43: c12cae49-cc5b-4bc3-a067-dc164f6bc4f9
- Deployment: c66a45d0-e3c1-4496-b3aa-70eb7030d782
- Existing RoomDO namespace: bb1bf1c32b68451cbe5db6fee3066fa0. Assets, rate limits, secret binding, compatibility date and sqlite export preserved.
- Exact deployed source matches worker-v43-presence-countdown.mjs.
- UI override remains v10g: 27544ebd-67e6-47ff-a43b-50cd43a5f267, deployment 1322899a-b24e-4d19-8804-e928fb476a98.
- Prior main version for emergency rollback: 1ce5f0cc-0893-4c18-830d-e1dc2652bf55. Reverting loses this feature; forward fix preferred.

## Owner report and approval
Nest card stayed face down, bidding appeared much later at 100. Guest Rosa was not actually present. Explicit Leave should replace guest with a bot. Owner additionally required a visible 20-second countdown so people do not mistake reconnection for a frozen game.

## Behavior
- Authenticated POST /leave permanently hands guest seat to unique house bot with avatar; keeps cards, scores, team, turn and hand. Old token revoked, last32 departed tokens permit safe leave retry. Host still closes whole table.
- Client awaits leave success, clears saved seat and returns to lobby. Confirmation now says bot takes seat.
- POST /presence heartbeat every5s from connected game client only. Invitation preview snapshots never renew presence.
- Socket close starts a full20-second reconnect deadline (unless another same-seat socket remains). Silent missing heartbeats detected after10s, followed by20-second countdown.
- Durable reconnect deadline survives hibernation. Guest temporarily autoPlaying while token retained. Game player gets isBot and name “Rosa (bot)”, original avatar retained. Reconnect restores human/name and cancels pending bot turn without resetting hand.
- Countdown banner: “Rosa disconnected — bot takes over in 20s”, ticks locally using server remainingMs and monotonic clock, then “Bot playing for Rosa — they can reconnect”. Clears on reconnect/leave. Changes update independently of deal/card rendering.
- Host disconnect automatic replacement is not added; host retains authority.
- Legacy clients with an open socket remain human during rollout; newly loaded client uses heartbeat.
- Single DO alarm chooses earliest readiness, animation, bot, presence or cleanup deadline. All-ready opening now wakes at animation minimum rather than25-second maximum.
- Existing game rules, Bid Dock, artwork and seat geometry unchanged.

## Validation
- Node syntax check including extracted client adapter.
- Regression: competing seat moves, freed seat, credentials preserved, reconnect, auth, host restrictions, stale revisions, no movement after start.
- Presence checks: explicit waiting/in-game leave, bot avatar, revoked auth, retry, same cards/scores, readiness minimum, missing guest takeover after object restart, preview cannot fake presence, reconnect hand retention, bot bidding advances, heartbeat cannot postpone bot alarm, legacy socket protection.
- Socket close countdown observed20s then19s; reconnect clears.
- Full simulated hand after guest leave completed bidding, nest discard, trump, all card play and scoring.
- Actual Cloudflare isolated namespace: readiness/nest timing, explicit leave/retry, absence takeover and reconnect all passed.
- Browser native game: countdown visibly decreased, then bot label/takeover; bidding continued.
- Phone390x844 visual check passed; screenshot rooks-countdown-verified.jpg shows9s countdown.
- Production exact source/settings/version readback passed; browser entry shows countdown node/new leave copy. Production smoke room YOU22 created, bots filled, game started; nest revealed and bidding advanced to host; then table closed successfully through host confirmation.
- Physical Facebook Android in-app browser not available; no claim of device-specific verification.

## Cleanup / continuation
All test rooms closed, including production smoke room YOU22 and isolated mobile demo. Temporary QA Worker rooks-presence-qa removed after checks. Only test-owned rooms were used. Owner table untouched. Already-open pages need one reload to receive the new client countdown/leave behavior; server code is deployed.
