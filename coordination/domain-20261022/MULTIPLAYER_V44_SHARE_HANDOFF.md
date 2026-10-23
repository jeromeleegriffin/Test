# Continue here — multiplayer v44 and Griffin sharing, 2026-10-23
Do not restart. Cloudflare is live; GitHub archives recovery. Existing artwork, rules, Bid Dock and DO namespace preserved.

## Live release
- Main griffin-house-of-rooks-online version44 a9654ccd-71a0-43d2-9834-11d356f0e45b; deployment589d4d43-4b1d-401c-9a43-ef4276d71ba5.
- UI rooks-branded-entry-only-20261022 marker20261023-v10h-multiplayer-share; versionc69064cd-52cc-4b69-bf6b-f24668421487; deploymenta25daf5a-8f01-4517-a7f7-0d0de39815e3.
- Root OG overlay griffin-og-game-head-stage-20261022 versiondcbd7d4e-b72f-43a0-af83-db1a2f0dc64a.
- jerome-griffin-site versionb8ed07d1-1ad4-4f1b-afb3-cddeace3ef12. Bounded site-share-branding-patch.mjs preserves original embedded JPEG and hero art.
- Main namespace bb1bf1c32b68451cbe5db6fee3066fa0, assets, secret binding, rate limits, SQLite export, compatibility2026-10-14 unchanged. Exact source readback passed.
- Main rollback v43 c12cae49-cc5b-4bc3-a067-dc164f6bc4f9; UI rollback27544ebd-67e6-47ff-a43b-50cd43a5f267.

## Fixed
Host disconnect now has same20-second countdown/temporary bot recovery as guests. Host returns with authority and seat retained; next hand still host-controlled. Requests time out12seconds including JSON body. Expired browser sessions renew once with concurrent renewals coalesced and original action ID preserved. Terminal room/token failures clean saved credentials and exit.
Waiting invitation shows occupied bots with actual avatars and explicit Take this seat action when backend permits. CSS pointer-event conflict fixed and accessible label added. Returned names use original seat identity rather than temporary '(bot)' name.
Confirmed leave exits directly without second invitation dialog. Late/closed/unavailable invitations provide a usable main-menu exit instead of trapping guest on hidden controls.
Share dialog uses existing192 Griffin logo. Public game /rooks, table /r/CODE, and exact root game OG/Twitter metadata use existing512 logo, PNG dimensions512, alt/favicon. Native Android sharesheet globe cannot be assigned via Web Share API; do not promise that exact system icon changed. Clickable invitation remains intact.

## Verification
- Baseline v43 stress36/36 matches136hands5507actions.
- Candidate v44 stress36/36 matches121hands4819actions. Combined72matches257hands10326human API actions. Simulated engine/DO tests, not72physical device games.
- Edge suite6/6, includes40simultaneous seat races,40start-vs-join races,40leave/rejoin cycles, dual sockets, auth. Host recovery reproduced failing v43 then passing v44.
- Transport tests: bounded timeout, single-flight session renewal, retry once, terminal cleanup and unrelated token protection.
- Invite mocked DOM5/5 plus actual browser sessions. Mock missed CSS pointer-events bug, caught and fixed in browser.
- Three isolated origins: Audit Host, Rosa, Sam (polling-only). Join bot seats, leave/replacement Crow, rejoin, no duplicate leave prompt, host countdown14s observed, takeover and nest/bid110, host return restores same hand, late invite clear exit, host close polling guest returns lobby.
- Live production table YOU12 created, Griffin share dialog visually verified with image naturalWidth192, closed afterward. No stale rejoin offered.
- HTTP facebookexternalhit checks public root, /rooks, /r/AUD05 all200 with logo OG/Twitter; public512 PNG200 with dimensions512.
- Temporary table AUD05 closed. rooks-guest-a-qa, rooks-guest-b-qa, rooks-multiplayer-qa removed.
- Actual Android Facebook app/native sharesheet and independent mobile networks unverified; no Facebook post sent. Browser session cannot reproduce OS thumbnail. Existing tabs need reload to receive client changes.

Source files main-v44.mjs, invite-v10h.js, friends-v10h.js, og-v44.mjs, site-share-branding-patch.mjs and qa44 tests/results are in this directory on branch work/jeromegriffin-domain-setup-20261022. Current pointer on main updated separately.