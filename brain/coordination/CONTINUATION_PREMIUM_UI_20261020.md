# PREMIUM PORTRAIT ASSET UI — VERIFIED CONTINUATION (2026-10-20)

**Status: ISOLATED WORKING PATCH, NOT DEPLOYABLE; DO NOT START OVER.** This extends `brain/coordination/RECOVERY_PREMIUM_PORTRAIT_ASSET_UI_20261020.md`. Master Bank H §3 and permanent actual-rendered-UI QA rule still govern all work.

## NEW persistent exact artifact
Library: `/Griffin House of Rooks Recovery/GRIFFIN_HOUSE_PREMIUM_UI_CONTINUATION_20261020.zip`
Library ID: `libfile_cccae8712ddc8191a6e576afa882eb9b`
SHA-256: `f00d075042f831fdc97602bc87bbe568e3606874a1b4384c39a4bd58321110c6`
Size: 13,968,553 bytes; 71 ZIP members, passed ZIP integrity. **This is a 14 MB UI recovery/overlay, NOT a complete playable game ZIP.** Contains a reproducible earlier-source index.html for reference only; never overwrite current index.html/game files wholesale.

## Approved visual, not to reinterpret
Photo-authored top Griffin/Raven match-only plaque, proper raven image, same small photo-finished utility buttons, and first cleaner walnut bottom asset console with subtle ornamentation only, no big lower Griffin. Bottom panel alone owns optically centered local clock / four equal 1x,3x,MAX,LAST buttons / current-hand points to make own bid or set opponents. All materials in actual PNG artwork from approved `cinematic_griffin_and_raven_cardroom.png`. Code positions assets and provides live content; no faux CSS-drawn wood/brass.

## What was DONE after recovery, with actual-game QA
- Fixed `house-premium-ui.js` for reversible scene transitions: store original DOM parents and utility button interiors; on leaving portrait, restore scoreSpeed701 and LAST into original scoreRow and utility buttons into original game rail container, keeping their event listeners.
- Critical active-play repair: original game `positionRailControls035()` was moving the new utility icon group back down onto the wooden table during actual play, despite static previews looking good. Connected the photo-asset UI through the game's **already-supported** `window.HORRailControlsReview.position` hook. Calls to native rail positioning now preserve top-right icon placement during portrait play and let original landscape code run when leaving portrait.
- Real offline browser hand: completed deal, original bid buttons, kitty six received, clicked and confirmed six discard cards, clicked actual trump pad AND confirmation, played 10 tricks through original card click handlers, reached score modal with negative and positive match totals, **zero page JS errors**. Scoring status decremented as counters were won.
- Real offline simulated installed-fullscreen browser hand: repeated same entire ten-trick path and reached scoring, with console visible throughout and status decremented, zero JS errors.
- Responsive QA 360/393/430 CSS px browser and installed-simulated, four equal button rectangles per mode; score alone at top; cardholder anchored to original table; panel only occupies extra fullscreen space.
- Successful browser transition test: portrait installed -> landscape -> installed portrait -> regular Chrome, restores/relocates original button nodes. Directly invoked native rail reposition and measured no displacement; all 5 checks passed, no JS errors.
- Test-only Playwright uses routed local real assets and local storage/UUID browser shims; **not actual installed Android PWA**. Logs/screenshots and full scripts in `EVIDENCE/`.

## Release blockers
1. The source WIP is based on earlier `Griffin_House_Completed_Fixes_No_Thunder_20261019.zip`. Latest playable Test repair is `92872799e09a92a9093346345219f6e743e1295f`, production `c8e78769e1f723e0a01196e28b2f00841928a1f6`. Source blob hashes of game060.js, hand-order838.js, sw060.js differ; DO NOT OVERWRITE them. Merge only photo-asset UI files into the newest game files before publishing a whole game ZIP.
2. Test actual Android installed PWA / Chrome top- and bottom-address-bar variants, service-worker upgrade, full screen system back behavior, tablet and landscape after the merge.
3. Keep current UI approved; verify top match labels for potential custom team names. The raster photo currently has fixed Griffin/Raven labels.
4. Re-run actual playable UI and visual QA on final merged candidate and obtain owner authorization before either live site changes.

NO current user-ready game ZIP, NO server deployments, NO regression of approved cards/Bid Dock/portraits. See exact archive README and the permanent owner QA/asset rules for complete instructions.