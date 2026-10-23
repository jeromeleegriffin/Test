# Griffin House of Rooks — Live Release Update

**Date:** 2026-10-23  
**Authorization:** The owner said to get all fixes and live updates going. This release is live.  
**Production:** Cloudflare Worker `griffin-house-of-rooks-online`, v61 `4ab1211d-9bc7-4d9e-a5df-f4c81fa5bf06`, deployment `94c18a13-9f17-466f-808b-c4174f0efe2c`, 100%.

## Signup clarity and name limits

The live Cloud Career Create account form now has a visible, high-contrast player-name input, with the label “Player name (shown in games and leaderboards)” and placeholder “Enter your player name.” Helper text says: “3–12 characters. Start with a letter; use letters, numbers, or _. Game bot names are reserved.” The HTML field and client validation cap names at 12; API validation, Auth metadata, signup trigger, and the Supabase account-name rule also enforce 3–12. This matches the existing game display-name input’s 12-character cap.

Verification used the live game: Menu → My Career & Awards → Cloud career, saves & recovery → Create account. The field appeared between Email and New password, and the screenshot showed clear white input styling against the navy dialog. The Cloud Career page first opens in sign-in mode; “Create account” switches to signup mode.

No registration form was submitted. No account was created. Live `/career-api/config` returned `emailReady:true`; actual email recipient delivery and end-to-end confirmed signup/login remain unverified.

## Ambient defaults

Cabin ambience and rare owl calls now start off for fresh preferences. The individual sound controls remain available, and saved user preferences are preserved. Local default tests passed.

## Supabase

Applied migration history confirms:

- `20261023080817` — `rooks_daily_public_leaderboards`
- `20261023085320` — `player_account_name_limit_12`

Pre-migration account check found no player rows and no names over 12 characters. The account-name rule now limits player names to 3–12. Daily leaderboard snapshots refresh at 04:15 UTC; the player board ranks by level, the combined fixed bot roster by win percentage. Bot display stats are games played, wins, losses and win percentage only. The schedule consolidates public board output once daily while account-level contributions update on save.

## Production integrity

The v61 Cloudflare deployment is at 100% and has the original runtime bindings: `ACTION_LIMIT`, `ASSETS`, `CAREER_EMAIL_READY=true`, `ENTRY_LIMIT`, `ROOMS` (namespace `bb1bf1c32b68451cbe5db6fee3066fa0`), and `TEST_GATE_KEY`. Static asset package: 1,635 assets / 222,350,178 bytes. No Durable Object storage reset occurred. A temporary deploy hook and temporary KV namespace used during release work were deleted.

## Verification

Passed local suites: progressive daily bonus (level 30→50 in 4,815 bonus-only days); 145 achievement thresholds/50 levels; 1,000 players × 54 bot names contribution stress; 1,000 player snapshots + 54 bots with 5,000 reads; leaderboard layout and ranking; account name API; career client; account/email API, client and hook; ambient defaults. These tests do not verify physical devices or email recipient delivery.

## Remaining owner-facing checks

- Inspect signup and Cloud Career flow on the owner’s phone, including a Facebook in-app browser.
- Verify actual confirmation email delivery with a controlled test account.
- Complete Rita’s verified recovery after her account exists. Her level 16 and human achievement merge procedure is in `HANDOFF.md`; her raw backup is excluded from this ZIP.

## Permanent continuity rule

PERMANENT, SELF-PERPETUATING CHAT CONTINUITY RULE

This rule applies to Master Control and every Griffin House specialist chat, now and in the future.

1. When a conversation becomes long or difficult to manage, proactively warn me and recommend a fresh continuation chat before important information is lost.

2. Before switching chats, prepare a complete handoff with the current Master Brain version, GitHub locations, approved decisions, locked designs, unfinished work, rejected attempts, verified game baseline, rollback files, ZIP packages, reference screenshots, restrictions, and next steps.

3. Provide one complete, ready-to-paste startup prompt for the next chat.

4. Every handoff and every new startup prompt MUST reproduce this entire continuity rule and explicitly instruct the next assistant to reproduce it again in its own future handoffs and startup prompts.

5. The next assistant must pass this same obligation to its successor, and that successor must pass it to the next, continuing through every future chat generation. Never allow the rule to disappear from the chain.

6. Preserve the continuity rule in every future Master Brain update. Do not shorten, silently omit, or weaken it.

7. Never rely on chat memory alone. Important decisions must be recorded in durable project documentation through the approved process.

8. At the beginning of every replacement chat, verify the current Master Brain and the inherited handoff before starting work.

IMPLEMENTATION REQUIREMENT:

Store this rule verbatim in Master Brain M.

Reproduce the entire rule verbatim in START HERE and in the ready-to-paste replacement-chat startup prompt.

Instruct every successor to reproduce it verbatim again in its own handoffs, startup prompts, and future Master Brain updates.

Do not replace the rule with a summary or a reference such as "same as before."


Successor requirement: preserve this complete rule verbatim in every future handoff, startup prompt, and Master Brain update. Continue from live Worker v61; do not restart.

