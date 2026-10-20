# Griffin House Premium Asset UI — Tested Rail Fix (2026-10-20)

**Status: isolated, source/visual QA passed on older test base. Not merged, not deployed, not owner-approved on Android.**

Persistent Library archive:
`/Griffin House of Rooks Recovery/GRIFFIN_HOUSE_PREMIUM_UI_VERIFIED_RAIL_FIX_20261020.zip`
`libfile_404202fcba1881919079fcddaba03088`.

This archive includes the exact verified `house-premium-ui.js`, `house-premium-ui.css`, PNG physical assets, screen photos, QA logs, scripts and manifest. No full old game archive included: never replace newest source with historical NoThunder version.

Root cause: latest game `game060.js` has the old `positionRailControls035` which repositions Menu/Back rail buttons; old UI WIP scheduled layout on every native call. The active updated source adds an optional ownership hook (`window.HORRailControlsReview?.position?.(controls)`) immediately inside that function, preserving legacy behavior when UI is absent. The recovered asset UI now returns true for its portrait-owned rail controls WITHOUT scheduling redraw on every call.

Actual-game automated browser QA with original game logic on isolated older WIP source:
- simulated installed/fullscreen 393×852: real offline bidding→6 discard→trump→all tricks→scoring 32.9s, zero JS errors, all utility buttons top Y 4 throughout.
- simulated ordinary Chrome 393×852: same sequence in 40.5s, zero JS errors, utility buttons top Y 39, lower console hidden when no clearance.
- narrow simulated installed/fullscreen 360×740: same sequence 67.6s, zero JS errors, console visible, utility buttons Y 4 throughout.
- direct call to old native positionRailControls035 and portrait↔landscape↔Chrome transitions: checks pass, legacy control restoration in landscape preserved.
- Both score plaque and walnut physical console are real authored PNG assets; dynamic labels are HTML only. Top displays Griffin/Raven totals; lower console displays time, matched pace/Last buttons and points needed for making/setting the bid.
- Both full hand screenshots and screen geometry logs are in the Library archive.

**Remaining hold:** Merge premium assets and JS/CSS on the newest game from `Test/main` *without copying old `game060.js`, `index.html`, `sw060.js`, `hand-order838.js`*; verify real gameplay again on that combined source; physical Android installed PWA, browser top/bottom bars and service worker remain unverified. No live server changes permitted without owner approval.

Read `brain/versions/H/files/01_MASTER_BANK/MASTER_BANK.md` §3, `brain/coordination/PERMANENT_UI_VISUAL_VERIFICATION_RULE_20261019.md`, `brain/coordination/QA_PREMIUM_UI_FAILING_RUN_RECOVERY_20261020.md`. Do not generate new image concepts, restart project, or ship a full-game ZIP until the actual latest integration has been visually verified.
