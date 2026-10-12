# RESPONSIVE TABLET REPAIR — NEXT GAME UPDATE
Owner: Jerome Griffin. Authorized 2026-10-11 (America/New_York).
Status: PENDING — owner requests inclusion in the next new game update ZIP.

## Standing instruction for the next build session
Before creating the next updated playable game ZIP, read this record and the current Brain/coordination records. Include the scoped responsiveness investigation and confirmed repairs in that update without requiring Jerome to repeat this assignment. This does not authorize work now in an unrelated chat, a historical ZIP re-download/repackage, production deployment, artwork generation, or a redesign. A later explicit owner scope restriction takes precedence.
First reproduce the findings in the latest verified complete source. Do not blindly patch from the study or revert newer work to 769. Preserve all other sessions' progress. If a finding is a fixture artifact or already corrected, document the evidence instead of changing working code. If safe completion is blocked, report the blocker and leave this item pending; never silently mark it done.

## Required scope
1. Keep approved Bid Box, real graphical connector and cardholder aligned at tablet widths. Preserve approved phone pixels and functional bid controls.
2. Investigate and correct pot-label overlap with hand ranks.
3. Investigate landscape discard clipping/scrolling and selection access. Confirm all cards remain reachable and six selections register; do not assume an automation timeout proves physical touch failure.
4. Review small header/tab touch targets without redesigning approved controls.
5. Recheck portrait/landscape, normal play, bidding, kitty, six-card discard, played cards, LAST and player positions; hand sizes 14, 10, 8, 7, 6, 4, 2, 1.
6. Specifically verify 7–8-card holder clearance and connector visibility only while Bid Box is visible; holder persists through gameplay.

## Protected decisions
TABLE-003, approved characters/cards, phone geometry, seat-facing played-card perspective/size, gameplay, speed engine, ROOK025 LAST placement, and existing artwork remain protected. Scope reopens only necessary responsive positioning/access behavior, including landscape discard access, not landscape art or general design. No generated artwork. Do not change the bot brain. No publish/deploy authorization.

## Evidence and limits
Study: Tablet-Responsiveness-Study.html, Library ID libfile_7721bbf5e5cc819196f4855987c3eab3.
Studied source: PROJECT_CLEANER_001_002_SLIM_GAME_REVIEW.zip, Library ID libfile_790af737eb4481919c73b922e2e48307, identifies as 769.
Cleaner evidence identifies 769.zip SHA-256 8921db4f71c3a404110f9acafd2255a04ade1c3d6c085ad9ee17208fe5456142. This does not promote 769 to owner-approved baseline.
Actual local Chromium renderer and controlled synthetic states, not physical Android or complete match validation.
Target: onn 8.1-inch Core Tablet (2026), approximately $138, Android 16; reported display 1000 x 1524, calculated ~225 PPI. Actual device Chrome DPR/viewport NOT measured.
CSS scenarios: phone 393x693; tablet 667x916, 1016x567, 667x1016, 500x662, 762x400. Main matrix DPR 1.5 / 2; discard interaction captures reverted to 1.5, so do not claim verified DPR-2 discard evidence.
Observed: tablet portrait dock left-biased relative to holder; pot badge crosses hand; small header controls; landscape long-suit row clipped. Portrait six simulated taps selected six cards; landscape six attempts selected four. Need focused scroll/hit-target reproduction to establish cause. Rank faces above holder in sampled 7–8-card fixtures do NOT close the historical clipping issue. All character-seat permutations and physical latency/performance remain untested.
Portrait preserves intended scene better than existing alternate landscape theater. Purchase compatibility remains UNVERIFIED, not a hardware failure claim.

## Completion / packaging gate
Record exact base and new build, changed files, before/after screenshots at phone and tablet CSS sizes, interaction results, remaining limits, source/package hashes and rollback. Reserve the next number via the shared registry; do not guess a ZIP number. Carry this pending item into each Brain successor/handoff until validated or explicitly waived by Jerome. Owner review is still required for changed pixels. Do not describe untested real hardware as passed.
This shared record is read-on-resume coordination; it does not notify or wake another chat.


## Implemented isolated candidate771 — pending owner Android review
See [RESPONSIVE_CATCHUP_771.md](RESPONSIVE_CATCHUP_771.md) and registry. Confirmed scoped fixes implemented on latest verified owner-approved769/Cleaner runtime; seven-view focused browser checks passed. Source769approval is independently recorded in CHARACTERS_AND_CARDS.md. Physical tablet verification and owner approval remain pending. Do not repeat completed implementation or close this task as universally validated. No game deployment or Brain successor publication.
