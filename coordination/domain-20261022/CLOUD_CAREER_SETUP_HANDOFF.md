# Cloud career setup — 2026-10-23

Continue existing game; do not rebuild. Latest owner request: prepare Supabase cloud careers, achievements and recovery, then teach player-account setup. This release is the private backup/account foundation, NOT a completed public-account rollout.

## Live
- Supabase organization fgvhaeqdfebzbfznqugl; project gxojarpfaxloyzbsptqg, Griffin House of Rooks, us-east-1, ACTIVE_HEALTHY.
- URL https://gxojarpfaxloyzbsptqg.supabase.co. Publishable key embedded in Worker; no service-role key retrieved or exposed.
- Main Worker griffin-house-of-rooks-online version 47: 76f44cbf-1e84-495f-8247-fe30655cae98; deployment 0a1670b1-f9e3-43d4-b434-652cc3776d61. Source file cloud-career/main-v46.mjs (filename v46; actual final Cloudflare version47).
- Branded override rooks-branded-entry-only-20261022 deployment 8e9b6fcdb8694eb8b3342c85dbb401be; source cloud-career/ui-v46.js. Existing friends/invite logic retained; career-core branch updated. Existing career-core route remains.
- Main baseline rollback a9654ccd-71a0-43d2-9834-11d356f0e45b. RoomDO SQLite namespace bb1bf1c32b68451cbe5db6fee3066fa0, static assets, secret, rate limits retained; no room reset.

## Implemented
Private current career and append-only versions (public.rooks_careers / rooks_career_versions), RLS own-account reads. Private SECURITY DEFINER writer with fixed search_path, auth.uid/confirmed nonanonymous account check, CAS revision lock, validated format/identity/nonnegative integer counters. Public invoker wrapper rooks_save_career; no direct client writes. Applied migrations rooks_private_career_saves + career_required_field_validation. schema.sql is cumulative schema, not rerun on existing tables.

Same-origin /career-api routes implement password login, secure HttpOnly session/refresh cookies, logout, current backup, versions, version fetch, save. No secret service key, no tokens in frontend storage. Same-origin POST and rate limiting; fixed Supabase upstream routes and timeout. Save payload is full existing career backup, so existing achievements are included.

Menu > My Career & Awards > Cloud career, saves & recovery. Explicit first upload choice; 15-second automatic saving while open after linking. CAS detects other-device conflicts. Automatic saving resumes only for same account/actor/cloud revision; pauses on conflict or actor changes. Manual restore requires confirmation, validates existing checksum/format and expected local digest, stores safety backup horBeforeCloudRecoveryV1 then uses existing recovery journal; normal file importer keeps conservative protections. Restoring reloads game and unlinks autosave; user must explicitly start cloud saving again. Earlier cloud versions remain accessible. Sign out retains local career.

## Verified
- SQL transaction-only test users rolled back; 0 auth users and 0 careers after tests.
- Real DB tests: own writes, stale rejection, required-format validation, direct-write denial, 3 immutable versions including restore, cross-account read and restore denial.
- Supabase security advisors: no lints.
- API unit tests: CSRF, anonymous denial, sanitized login error, cookie attributes/no token response, conflict409, refresh and rate limiting.
- Core tests: actual old Rita backup restored with33845 points/343hands/69games and all saved awards; nonzero normal career protected; malformed input writes nothing; explicit recovery keeps prior career and rejects changed local state.
- Live HTTP: unauthorized current401, invalid login401 through deployed upstream, JS/core200. Browser checked menu and sign-in fields. Real account authenticated save/recover NOT yet tested.
- Existing multiplayer transport regression test passes; no multiplayer engine changes in this release.

## Remaining / do not overclaim
1. No real player accounts created. Need first owner-controlled player account and end-to-end login/save/second-device/restore validation. Account dashboard is Authentication > Users; game players are NOT Supabase organization/team members. Passwords must not be posted in chat.
2. SMTP sender not configured. No public signup/reset UI enabled. Default Supabase email only supports project-team recipients; do not disable email confirmation or add players as project admins to work around this. Plugin cannot configure Auth SMTP or create Auth users; browser dashboard or explicit authorized admin API needed. Public email signup/reset callback implementation also still required.
3. Existing online adapter still intentionally skips career accrual with private-cloud-test guard (main source around prior line2497), and server snapshots do not carry full career events. This release saves existing/offline/imported career+awards; it does NOT repair multiplayer earnings. Need full authoritative per-player stats/events, idempotent match IDs and reconnect receipts before enabling guard. Previous handoff already identifies this; preserve pending status.
4. Wife's missing level16 progress not recovered from old backup. Manual adjustment59000points minimum (SeasonedPlayerI) remains pending per owner deferral. Do not invent achievements or apply adjustment silently.
5. No physical Android/Facebook/cross-phone authenticated verification.
6. Version history is currently retained without automatic pruning. Personal backups are not a verified competitive leaderboard.

## Source
All files under coordination/domain-20261022/cloud-career on work/jeromegriffin-domain-setup-20261022. Actual final main archive commit c3a85533a8957634bafce0476971de429b26857f. Source api.mjs/client.js/core and cumulative SQL included. Private Rita backup never archived to GitHub.
