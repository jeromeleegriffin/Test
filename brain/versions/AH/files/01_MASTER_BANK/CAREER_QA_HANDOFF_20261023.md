# Griffin House of Rooks — Career & Leaderboard Handoff

Prepared: 2026-10-23
Master Brain: AH
Scope: Career progression, cloud backup/recovery, account identity, and public player/bot leaderboard work.
Release status: Review/staging only. Nothing here was deployed to Cloudflare or applied to Supabase. The approved Cloudflare R12 runtime and Worker remain unchanged.

## Current approved decisions

- Account signup stays optional for play. On first verified sign-in, the existing local career is automatically uploaded; returning-account safeguards protect a newer cloud career from stale local data.
- The player leaderboard is opt-in and ranked by level first. The fixed page design uses player avatars, achievement count out of 145, compact rows and page-by-page navigation without scrolling.
- The bot leaderboard is separate, ranked by win percentage, and exposes only bot name, games played, wins, losses, and win percentage.
- Bot names are reserved from player accounts. Bots do not earn levels or achievements. Their combined public stats are limited to the five fields above. Per-account contributions are replaced on save so retries do not double count.
- Daily bonus is modest: 50 XP plus 0.5% of the remaining gap to the next level, rounded to a whole XP. Streak adds 5% per day, capped at 1.25×; missing a day resets the streak. The seven-day counter remains capped.
- Public player and bot aggregates refresh daily at 04:15 UTC. Career saves and per-account bot contributions remain current; public board data can be up to 24 hours old.
- Rita’s supplied backup is the recovery source. Her Rita lifetime record and the local human You ledger refer to the same player and must be merged after a verified account exists. Preserve all earned human achievements and bot data. Set points to at least 59,000 only if the merged total is below that level-16 threshold.
- Do not deploy or apply the migration until the owner says “go live with everything.” Do not make account changes until Rita’s exact registered account is verified; never expose the backup’s recovery code.

## Staged files

- cloud-career/career-core-v46.js and career-audit-career-core.js: same new daily bonus policy in cloud and offline career cores.
- cloud-career/daily-leaderboard-rollups-v1.sql: private player and bot snapshot tables, private source aggregators, sanitized read RPCs, and 04:15 UTC Cron schedule. Refresh reads career/account/contribution source tables directly and never calls its own public snapshot readers.
- cloud-career/test-daily-leaderboard-rollups.cjs: 1,000-player and fixed 54-bot-rank snapshot model.
- cloud-career/main-v50.mjs: rebuilt Worker bundle with the staged career core; it is not deployed.
- cloud-career/V49_HANDOFF.md: corrected first-sign-in auto-upload behavior plus the staged career status.
- test-daily-login-bonus.cjs: formula, streak, reset, backup and level-30-to-50 simulation.

The handoff ZIP is a career review package, not the 211 MiB playable game. It includes an index.html at the archive root so the loader opens the summary first. It excludes the raw Rita backup and all recovery codes.

## Test evidence

All passed locally on 2026-10-23:

- Daily bonus formula parity in offline/cloud cores, duplicate-date protection, missed-day reset, backup persistence, and daily-only level-30-to-50 simulation: 4,815 days / 13.19 years.
- Achievement threshold and progression stress: 145 achievements, exact boundaries, duplicate prevention, 50 levels.
- Per-account bot-rollup stress: 1,000 accounts × 54 bot names, repeated saves, replacements, updates, deletions, bounded bot output, win/loss invariants.
- Daily public board model: 1,000 player rows + 54 bot rows, 5,000 reads without reaggregation, public-field sanitization, and next-day snapshot replacement.
- Legacy recovery against the provided backup: restores Rita identity and source values, preserves every saved award and bot entry, protects nonzero local careers, rejects malformed or stale recovery, and preserves a pre-recovery backup.
- Player/bot board rendering: no scrolling, avatars, achievements/145, pagination, and bot win-rate ordering.
- Player account API; cloud client/API; email signup, confirmation, automatic existing-career upload, reset/recovery, and send-email hook suites.
- python3 cloud-career/build-v50.py completed successfully.

These are local deterministic tests; the daily snapshot SQL has not been run against production. Live Supabase advisors and migration status must be rechecked before any authorized release.

## Rita merge plan for the verified future account

Additive counters before applying the level-16 floor: 348 hands, 64 bids won, high bid 130, bid sum 6,815, 61 bids made, 3 bids set, 34,175 points, 986 tricks, 32,170 trick points, 92 rook captures, 86 Red 2 captures, 181 big tricks, 71 nest wins, 3,175 nest points, 70 games played, 42 games won. High bid uses the maximum; other numeric counts are summed. If points are still below 59,000, use 59,000 as the restored human point total so the UI reports level 16. Do not change any bot row.

The 25 IDs found in the local human You ledger are: career_points_1, career_points_2, hands_1, hands_2, games_1, wins_1, tricks_1, tricks_2, rook_hunter_1, rook_hunter_2, red2_hunter_1, red2_hunter_2, big_tricks_1, big_tricks_2, nest_raider_1, nest_points_1, bids_won_1, bids_made_1, first_trick, first_win, first_rook, first_red2, first_nest, first_bid, first_contract. Preserve these plus all human awards in the Rita source record, deduplicating by achievement ID. Supabase lookup at this checkpoint found no matching registered Rita account, so no live account row was altered.

## Next steps

1. Owner reviews the career QA ZIP and tests the revised login reward and leaderboard designs.
2. After approval to go live, verify career/account/bot contribution tables, pg_cron availability and current RLS/advisors; apply the daily snapshot migration in a controlled deployment, then verify the scheduled job and returned snapshot payloads.
3. Deploy Worker v50 only after the owner explicitly authorizes going live. Preserve current R12 runtime/rollback and do not reset the RoomDO namespace.
4. When Rita registers, verify the account by the exact supplied email and auth identity, preserve the current cloud save as a recovery version, then import the merged backup into only that account. Verify level 16, all achievements and bot stats before confirming completion.
5. Keep player stats ordered by level; keep bot stats ranked by win percentage. Check the public pages at phone and desktop sizes with no vertical scrolling.

## Master Brain and source locations

- Current pointer: brain/current.json
- Current Brain: AH at brain/versions/AH/files/01_MASTER_BANK/MASTER_BRAIN_AH.md
- Current addendum: brain/versions/AH/files/01_MASTER_BANK/MASTER_BRAIN_AH_ADDENDUM.md
- Continuity authority: brain/versions/AH/files/01_MASTER_BANK/CHAT_CONTINUITY_RULE.md
- Career code and SQL: cloud-career/ in the supplied local recovery workspace; this is not assumed to be a GitHub runtime source checkout.

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

Successor instruction: Verify the live Master Brain pointer and this handoff before doing more work. Reproduce the entire continuity rule above verbatim in every successor handoff, startup prompt, and future Master Brain update. Do not deploy until the owner explicitly says “go live with everything.”
