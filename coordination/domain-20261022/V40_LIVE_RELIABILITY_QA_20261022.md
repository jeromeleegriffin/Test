# Griffin House of Rooks | Version 40 Live Reliability QA
Date: 2026-10-22

## Verified production state
- Worker `griffin-house-of-rooks-online` Version 40, ID `dd4dbc6c-4640-4d84-a91c-15148de87a49`, deployment `f1c472f5-f5ee-4ed3-b0f4-877d29e95f5b` (last checked at 100%).
- Tested on `https://rooks.jeromegriffin.com/`. All tests created temporary QA rooms and closed them. No original game asset, secret, player profile, or production Durable Object namespace was cleared or replaced.
- Rollback version remains 36, ID `3df448a2-83f0-4fd0-be97-665a067848de`; rollback does not revert persisted room data.

## LIVE real-Worker gameplay QA
### Two human identities and two server bots
- Created room, selected guest preferred seat 2, filled remaining seats with bots, started a one-hand match with 100-point target at MAX pace.
- Completed all bidding, discard, trump, card play, and scoring. Match state `complete`, `matchResult` present; scores `[0,200]`, 23 accepted user actions over 69 steps, ~18 seconds.
- Compared private 10-card hands: no overlapping card IDs between human players.
- Resumed guest via existing token, same seat and identical private hand.
- Temporary room closed. `pass:true`.

### Four independent human identities (one hosted browser controller, no bots)
- Reserved host seat 0, guest seats 1, 2, 3, used 100-point target at MAX pace.
- Full match through bidding, discard, trump, card play, tricks, and game completion: phase `complete`, match result present, scores `[-100,105]`, 46 accepted actions over 83 steps, ~21 seconds.
- All four identities reclaimed their exact reserved seats and same hands during gameplay. No hand data cross-exposure among participants.
- Duplicate bid and play actions accepted idempotently with duplicate flags, not executed twice.
- Temporary room closed. `pass:true`.

### Live authenticated WebSocket reconnect
- In a separate temporary room, 2 human identities + 2 bots started a hand.
- Guest joined preferred seat 2; host and guest each had 10 separate cards.
- Original guest token rejoined seat 2 without changing hand or token.
- Guest obtained WebSocket ticket; first WebSocket received phase `dealing` snapshot. Closed the connection, obtained new ticket, opened a new WebSocket and received equivalent snapshot with 10-card guest hand.
- Temporary room closed. `pass:true`.

## Mobile layout QA and subsequent repair
- In 360×780 Chromium mobile emulation, approved join layout fit the viewport and `Take Your Seat` was reachable.
- Discovered genuine issue: when user had a remembered identity, `landing-returning` CSS hid the `#hor-player-name` field and avatar control on incoming invitations, even after the invite consent script cleared the input.
- Applied *branded-only* override `rooks-branded-entry-only-20261022` revision **`20261022-v6c-invite-identity-visible`**. It removes `landing-returning` **only on an invitation**, revealing the existing identity inputs instead of creating different artwork or modifying the core game. Retains the native cloud create/join handler guard, Facebook share chooser, and no-full-page-reload fix.
- Verified after 18-second asset preload at 360×780: `htmlClass=""`, `landing-returning=false`, name input visible and located y295–332, join form y441–719, `Take Your Seat` y623–671, root scroll height 780. The page does not require scrolling to reach the action button. `pass:true`.
- Source backup: `coordination/domain-20261022/rooks-branded-entry-v6c-invite-identity-visible.js`.

## Facebook share preservation
- `https://jeromegriffin.com/rooks` and `https://jeromegriffin.com/r/CODE` still serve the owner-approved 1200×630 House of Rooks promotional photograph (Grit, Ember, Sofia). The `/r/CODE` page redirects human browsers into the specified room while Facebook preview robots receive its OG metadata.
- The branded in-game Invite menu offers Facebook-specific link sharing, Other Apps / Messages, and Copy Invitation Link.
- Do not claim this constitutes a fresh, real Android Facebook app click-through verification after this rollout. Owner confirmation remains useful.

## Outstanding release QA
- Four actual physical phones/devices across different networks, including extended suspend/recovery from Android Chrome / Facebook WebView.
- True network-disconnected/offline reload and PWA shortcut migration remain unverified. Do not clear service workers or old browser storage.
- Quantified asset transfer/cache speed after entering Play With Friends was not measured on the owner's physical Android device. Native Cloudflare multiplayer handler remains in-page.
- Longer many-hand matches and rare rule combinations on the newest live Version 40 are not exhaustively tested by these short matches.

## Source control and rollback
- Master Brain `brain/current.json` remains the global release authority. Record Version 40 as active and the v6c branded-only UI override separately.
- Keep the original old `workers.dev` game address functional; its origin-specific localStorage does not automatically transfer to `rooks.jeromegriffin.com`.
- To roll back the core game, redeploy v36 by version ID at 100% if confirmed necessary. To revert just the invitation UI visibility change, restore archived branded-only v6b script `coordination/domain-20261022/rooks-branded-entry-v6b-prejoin-consent.js`. Avoid touching core room state.
