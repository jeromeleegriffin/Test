GRIFFIN HOUSE PLAYER v6 — DIRECT TEST + EXACT-BUILD APPROVAL

NORMAL FLOW
1. Grok builds a unique candidate directly from protected Test root R712.
2. Grok stages it under /builds/<unique-id>/ and updates /player/latest.json LAST.
3. Jerome opens Player and taps LOAD LATEST TEST BUILD.
4. Player visibly identifies the exact build ID from latest.json and opens that unique build.
5. After physical-phone testing passes, Jerome returns HOME and taps APPROVE THIS BUILD.
6. Player re-fetches latest.json with no-store. If the ID changed, approval is BLOCKED.
7. If identity still matches, Player copies a Grok promotion handoff for that exact tested ID.
8. APPROVE never writes to GitHub and never deploys production itself.

PROMOTION PRINCIPLE
Promote the exact tested candidate. Do not recreate/rebuild an approved candidate from instructions.
The Grok handoff requires identity verification, rollback protection, exact-artifact promotion, production verification, and STOP on unexpected differences.

SINGLE-ACTIVE-BUILD RULE
Root /Test/ = protected clean R712 baseline.
/player/ = permanent Player.
/builds/ = at most one active candidate after successful replacement cleanup.
A new candidate is fully staged and verified before latest.json changes. The previous working candidate is retained until the new pointer is proven. Then obsolete candidate directories are deleted. Failed replacement never destroys the current working candidate.

PERMANENT PLAYER URL
https://jeromeleegriffin.github.io/Test/player/GriffinHousePlayer.html
