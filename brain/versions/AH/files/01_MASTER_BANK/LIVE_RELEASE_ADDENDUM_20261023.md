# Griffin House of Rooks — Live Release Update

**Date:** 2026-10-23  
**Authorization:** The owner said to get all fixes and live updates going. This release is live.  
**Production baseline when first published:** Cloudflare Worker `griffin-house-of-rooks-online`, v61 `4ab1211d-9bc7-4d9e-a5df-f4c81fa5bf06`, deployment `94c18a13-9f17-466f-808b-c4174f0efe2c`, 100%. Current production is v62, recorded below.

## Signup clarity and name limits

The v61 Cloud Career Create account form had a visible, high-contrast player-name input, with the label “Player name (shown in games and leaderboards)” and placeholder “Enter your player name.” The v61 helper allowed letters, numbers, and underscores. v62 below extends this to internal spaces while retaining the 3–12-character limit and bot-name reservations.

Verification used the live game: Menu → My Career & Awards → Cloud career, saves & recovery → Create account. The field appeared between Email and New password, and the screenshot showed clear white input styling against the navy dialog. The Cloud Career page first opens in sign-in mode; “Create account” switches to signup mode.

That paragraph records the v61 UI check only: no form was submitted in that pass, and the single player row was not yet checked. During the later v62 recovery, Rita’s confirmed account was identified and her recovery completed as described below. The live `/career-api/config` returned `emailReady:true`; no separate email-delivery test was performed beyond Rita’s completed registration.

## Ambient defaults

Cabin ambience and rare owl calls now start off for fresh preferences. The individual sound controls remain available, and saved user preferences are preserved. Local default tests passed.

## Supabase

Applied migration history confirms:

- `20261023080817` — `rooks_daily_public_leaderboards`
- `20261023085320` — `player_account_name_limit_12`
- `20261023090736` — `player_account_names_allow_spaces_v1`

Pre-migration account check found no player rows and no names over 12 characters. The account-name rule now limits player names to 3–12. Daily leaderboard snapshots refresh at 04:15 UTC; the player board ranks by level, the combined fixed bot roster by win percentage. Bot display stats are games played, wins, losses and win percentage only. The schedule consolidates public board output once daily while account-level contributions update on save.

## Production integrity

The current v62 Cloudflare deployment is at 100% and has the original runtime bindings: `ACTION_LIMIT`, `ASSETS`, `CAREER_EMAIL_READY=true`, `ENTRY_LIMIT`, `ROOMS` (namespace `bb1bf1c32b68451cbe5db6fee3066fa0`), and `TEST_GATE_KEY`. Static asset package: 1,635 assets / 222,350,178 bytes. No Durable Object storage reset occurred. A temporary deploy hook and temporary KV namespace used during release work were deleted.

## Verification

Passed local suites: progressive daily bonus (level 30→50 in 4,815 bonus-only days); 145 achievement thresholds/50 levels; 1,000 players × 54 bot names contribution stress; 1,000 player snapshots + 54 bots with 5,000 reads; leaderboard layout and ranking; account name API; career client; account/email API, client and hook; ambient defaults. These tests do not verify physical devices or email recipient delivery.

## Remaining owner-facing checks

- Inspect signup and Cloud Career flow on the owner’s phone, including a Facebook in-app browser.
- Verify actual confirmation email delivery with a controlled test account.
- Rita’s recovery is complete; her verified level-16 career and achievement merge are recorded in `HANDOFF.md`. Her raw backup remains excluded from this ZIP.

## v62 — player names with spaces and recovery verification

**Date:** 2026-10-23. The owner had already approved the account-name change and production release.

Player account names now accept internal spaces such as `Jerome Griff`. Leading/trailing whitespace is trimmed, repeated whitespace is collapsed, and names remain 3–12 characters, start with a letter, and otherwise use letters, numbers, underscores, or spaces. The UI, Cloudflare API, signup metadata, and Supabase rule share the same validation. Reserved bot names remain blocked, including punctuation/space variants. Supabase migration `20261023090736 player_account_names_allow_spaces_v1` is applied.

The update was built from the current production Worker module and uploaded through Cloudflare’s content-only endpoint, which the Cloudflare API describes as replacing script content without changing config or metadata. Cloudflare created Worker version `d42a6613-7b4d-4b50-a209-0d04e08b7971` (v62) and deployment `35cba8fa-7184-4d56-b3d0-75bde9459a3a`, active at 100%. Post-upload settings matched all six prior bindings: `ACTION_LIMIT`, `ASSETS`, `CAREER_EMAIL_READY`, `ENTRY_LIMIT`, `ROOMS`, and `TEST_GATE_KEY`. The live `/career-api/config` returned `emailReady:true`; a fresh game page loaded. Durable Object room storage was not reset. The content upload did not alter account data.

Same-account multi-device behavior: two or more devices signed into the same account point to one cloud career record. Career backups are snapshots; local/device histories are not automatically summed. A device can restore the cloud snapshot or deliberately upload its local career, retaining a previous cloud backup. Revision checks reject stale concurrent writes and ask the user to reopen Cloud Career. They prevent silent overwrite but are not a merge of concurrent progress.

Rita’s exact confirmed identity was verified before the authorized recovery. Her legacy lifetime record and the separate human “You” record were combined. The pre-recovery save remains as a previous version; bot ledgers were unchanged. The current career is level 16 with 59,000 points, 348 hands, 70 games played / 42 wins, 986 tricks and 31 human achievements across active/retired records (28 active, 3 retired). Revision 4 is current and revision 3 is the recovery point. Her raw source backup and account identifiers are not included here.

Verification: rebuilt v50 bundle; `node --check cloud-career/main-v50.mjs`; account-name API tests; client autosave/conflict tests; API security/refresh/rate-limit tests all pass. Production version and bindings were read back, config endpoint verified, and live game loaded. The signup form was not submitted during this particular QA pass. Actual email recipient delivery outside the user-completed signup and physical Facebook Android join/reconnect behavior remain unverified.
