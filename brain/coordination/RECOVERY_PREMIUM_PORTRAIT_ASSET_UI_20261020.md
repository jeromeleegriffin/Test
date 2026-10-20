# Griffin House of Rooks — Premium Portrait UI RECOVERY (2026-10-20)

**RECOVER AND CONTINUE. NEVER RESTART OR SUBSTITUTE NEW ARTWORK. NOT DEPLOYED; NOT AN OWNER-READY GAME ZIP.**

## Exact source recovery
Persistent Library: `/Griffin House of Rooks Recovery/GRIFFIN_HOUSE_PREMIUM_ASSET_UI_RECOVERY_20261020.zip`, ID `libfile_a565e28a181481919a02eafbfdb630a0`; SHA-256 `78e05af563bbdddaec1f3061d009774ff7222cb2d2f5892a1a761aa2d7e9e5be`. Contains source modifications, PHOTO ASSET PNGs, QA scripts and actual browser screenshots, asset manifest and approved concept image. Archive is NOT a Loader/playable game package.

Approved design image: `cinematic_griffin_and_raven_cardroom.png`, SHA-256 `ba614af1e8d5b7d233e61e30e8a5e0fc6d4e19452a2e19ef4eaab96fbaeb397b`. Smaller premium photographed brass/black top plaque with Griffin 0 | Raven 0 and clear raven artwork, small matching utility buttons. Neater first walnut/metal bottom console attached under playing cards in installed fullscreen portrait: left visually centered local clock, four equal 1x/3x/MAX/LAST controls center, right visually centered current-hand goal. **NO bottom Griffin badge; only subtle scrollwork. No duplicated need-to-bid text at top.**

Master Bank H Section 3 mandates true authored physical artwork assets; CSS only positions, masks, registers or animates actual asset artwork. UI changes MUST be visually opened in real game before any ZIP (see `brain/coordination/PERMANENT_UI_VISUAL_VERIFICATION_RULE_20261019.md`).

Source base (not newest): `Griffin_House_Completed_Fixes_No_Thunder_20261019.zip`, SHA `45fcc06ef4b8a3e697f702a393b1a8991901f2e3059f6e8cc5464ffc2f5e1517`. The latest Test playable repair commit was `92872799e09a92a9093346345219f6e743e1295f` and production current `c8e78769e1f723e0a01196e28b2f00841928a1f6`; do NOT overwrite newer gameplay fixes while merging this UI WIP.

## Recovered exact progress
Local `house_asset_wip`: `house-premium-ui.js/css`, `fullscreen-portrait-review.js/css`, modified `index.html`, 15+ `assets/house-premium-console/*.png`; exact original source saved in separate `HOUSE_RECOVERY_PRESERVED_20261020` before edits. Photo state button art repaired to remove demo text while retaining bevel. Actual game reached offline dealing and bidding with full room/players/cards rendered in Chromium; House Tour must be dismissed via actual `#tutorialSkip` button. Chrome 393x852 and simulated installed 393x852 and 360x740 rendered the walnut console; geometry tests at additional sizes. Status uses `totalCountersInDeck()` so our bid shows `Need N to make bid`; opponent bid shows `Need N to set them`, refreshed at 750ms. No page exceptions seen in those actual tests.

**Still unverified:** full bidding→nest→play→score sequence, actual installed Android/PWA fullscreen behavior and service-worker update, complete control tapping, responsive landscape/tablet, integration onto NEWEST repaired Test source. Earlier local URL navigation was browser-blocked; test uses Playwright `set_content`, local-route assets, and TEST-ONLY storage/crypto shims. Simulated PWA ≠ physical phone certification.

**RELEASE HOLD:** No owner-ready game ZIP or deployment until those steps and real pixel inspection pass. Keep both live servers unchanged. Read the complete source archive `READ_FIRST_RECOVERY_NOT_GAME.txt` before continuing.

## QA FOLLOW-UP — 2026-10-20 (latest)
See `brain/coordination/QA_PREMIUM_UI_FAILING_RUN_RECOVERY_20261020.md` and its newer Library diagnostic supplement (ID `libfile_19c851801e348191939f55e351ca135d`). This preserves evidence that full offline hands did reach scoring, while documenting unresolved utility-control repositioning and the unsuccessful test-hook attempts. An unverified hook was rolled back; no release or deployment authorized.
