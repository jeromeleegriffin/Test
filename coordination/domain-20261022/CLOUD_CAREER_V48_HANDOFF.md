# Career v48 release — 2026-10-23

Latest owner steering: do not create any player accounts yet; finish setup first, discuss accounts later. No accounts created, no emails sent, no Rita level adjustment.

## Current production
Main Worker griffin-house-of-rooks-online version48 d9e0e952-eff9-4ab9-a9c4-da62bf657f82; deployment d7b2886e-28d0-4d0e-9359-ef2be2f3726a. Rollback version47 76f44cbf-1e84-495f-8247-fe30655cae98. Source main-v48.mjs in cloud-career folder on work/jeromegriffin-domain-setup-20261022 (initial source archive commit055dcd6b0021d5274b972c0a3c88173ec03feed6).
Branded override deployment99ef2bcf55274f649d7900920bceac7d; ui-v48.js. Namespace bb1bf1c32b68451cbe5db6fee3066fa0, assets, secret, rate bindings unchanged. Supabase project gxojarpfaxloyzbsptqg unchanged.

## Changes
- New matches get unique career UUIDs, frozen participant ownership, cumulative player counters, extras, and immutable completed-hand events stored with the server match.
- Standard tricks and legal claims credit both partners' captured points, personal trick wins, special captures and appropriate extras. Nest accounting follows selected destination. End-hand tracks bids, hands, Moon attempts/results; canonical career core evaluates achievements, streaks, partner wins and match wins using existing rules.
- Server snapshots expose completed career events only; no private hands or seat tokens added. Current event is held during final trick/claim animation.
- Client replays missed completed events on any reconnect snapshot, with local receipt deduplication. Host records existing bot careers, every human records only their own career. Legacy double-writing functions remain disabled online; removed old private-cloud-test no-career guard.
- Crucial rollout: matches created BEFORE v48 lack reliable prior counters and remain unmodified. Reload clients and START A NEW TABLE for multiplayer career recording. Do not synthesize historical missing earnings.
- Save POST now binds expected account ID to authenticated user; cross-tab account switches cannot save to the wrong account. Opening menu with newer remote revision pauses automatic saving instead of silently adopting revision. Local actor changes pause autosave. Client requests time out; refresh upstream failures retain retryable behavior.
- Explicit cloud restore now replaces only the allowed backup data exactly, rather than carrying stray old career keys into restored data. Prior local backup preserved; ordinary file-import protection unchanged. Recovery copy no longer incorrectly says cloud recovery does not exist.

## Verification
- Final career reducer run24 complete simulated matches,88hands,4393actions,2claims; point conservation, all seat owners, unique match IDs, complete missed-history replay, duplicate protection, match counting, special captures, partner credit. Every reducer action compared to pre-career engine after removing accounting field, with unchanged gameplay outcome. Additional Moon-made/failed accounting cases passed.
- Earlier targeted run24matches98hands4894actions6claims also passed; do NOT add repeated runs to unique coverage claims.
- Existing reconnection/stress suite36/36,131hands,5168human API actions, across bidding/discard/trump/play leave and host/guest disconnect, object restarts and duplicate actions.
- Edge suite6/6, including40race cycles per concurrency case.
- Client mock tests: automatic save, unchanged suppression, newer-cloud menu guard, actor-switch pause. API tests: origin checks, account-switch guard, refresh, secure cookies, auth failures,409 conflicts, rate limits.
- Actual hosted isolated Cloudflare Durable Object table: four simulated human seats, completed one-hand100point target match; browser career core received100points,1game,1achievement; missed replay/double replay stable; valid cloud backup built. Table explicitly closed. Temporary rooks-career-qa-20261023 Worker deleted successfully.
- Screenshot /workspace/scratch/griffin-career-v48-proof.jpg. No actual Supabase user authenticated or physical phone used.
- Earlier DB isolation/security/restore tests still valid; no DB schema changes this release.

## Still deferred / blocked
User intentionally deferred player accounts. Public signup and email password recovery are not enabled; SMTP/provider and auth redirect/callback setup remain. Plugin has no direct Auth user or SMTP management operation; use appropriate authorized dashboard/admin path later, never ask for passwords in chat. Do not claim an authenticated cross-device cloud round trip was tested. Existing careers and awards can be saved by the prepared authenticated system once first account is provisioned and tested. Wife level16 manual recovery still pending; old backup has33845points, level16 threshold59000.

## Continuity
Prior details: CLOUD_CAREER_SETUP_HANDOFF.md, CAREER_RESTORE_V45_HANDOFF.md, MULTIPLAYER_V44_SHARE_HANDOFF.md. This file supersedes their statement that online accrual is still disabled, for NEW v48 matches only. Existing art, Bid Dock, game rules, X1 decision code and reconnect behavior retained.
