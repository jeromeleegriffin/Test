# Premium Portrait UI — 2026-10-20 QA Failure Diagnosis and Continuation
Status: **BLOCKED for owner-ready ZIP / deploy**. Continue existing UI asset WIP; **do not restart or replace artwork**.

## Preserved exact working sources
- Original UI asset recovery: Library `/Griffin House of Rooks Recovery/GRIFFIN_HOUSE_PREMIUM_ASSET_UI_RECOVERY_20261020.zip`, ID `libfile_a565e28a181481919a02eafbfdb630a0`.
- New diagnostic supplement: Library `/Griffin House of Rooks Recovery/GRIFFIN_HOUSE_UI_TEST_DIAGNOSTIC_SUPPLEMENT_20261020.zip`, ID `libfile_19c851801e348191939f55e351ca135d`, SHA-256 `9a612eeac7bf6339eb394a29d8679c283c32404ab3938d34e581e50a5328adb0`.
- Supplement includes original UI scripts, **rejected hook experiment**, browser logs/results, actual screenshots, exact README and runner scripts. It is NOT a playable game build or release.

## Verified observations
1. Two actual-game offline Chromium runs progressed through dealing, bidding, six-card discard, trump selection, full trick play and scoring, finishing in about 52.7s and 32.7s, both with zero JavaScript page errors.
2. One additional **simulated installed-fullscreen** run reached score in about 31.3s, with lower premium console present in the test. This does NOT certify physical Android/PWA behavior.
3. Portrait→landscape→portrait→Chrome simulated transitions reported all checks true and zero page errors.
4. Screenshots from another run revealed a **real UI control regression**: old `positionRailControls035` repositions Menu/Back from the top into the right wooden rail during gameplay. This is not yet fixed.
5. Attempts to intercept that callback produced intermittent automated test hangs around discard/trump and failed owner-ready verification. Duplicate/reentrant hooks and synchronous layout recalculation were removed/rejected, **but a stable finished repair is not proven**. Do not claim every hang is necessarily caused by that change.
6. The isolated source file `house-premium-ui.js` was rolled back byte-for-byte to the last version that had passed a real offline complete hand: SHA-256 `a1149df3a187b657b0351d2a584f64511677c81028af5bce75ddbc990c16f5e2`.

## Next exact steps
- Recover both archives and their READ_FIRST notes. Preserve all approved PNG assets, table, Bid Box and numbered cards.
- Isolate the old rail coordinator conflict without on-every-frame layout, reparenting or read/write churn.
- Test bidding→discard→trump→play→score with a controlled screenshot and position assertion on each phase in **simulated installed fullscreen** plus Chrome; inspect actual rendered pixels, not static mocks.
- Verify top Griffin/Raven match scores only; bottom photographed walnut console with centered clock, four matching speed/Last controls and current hand goal (making/setting bid). Test selected states and pointer actions.
- Do not deliver a game ZIP until visual and interaction checks succeed. No deployment or change to production or Test live Pages.

Authority: `brain/versions/H/files/01_MASTER_BANK/MASTER_BANK.md` §3 and `brain/coordination/PERMANENT_UI_VISUAL_VERIFICATION_RULE_20261019.md`.
