# Griffin House of Rooks — Master Brain J Delta

**Date:** 2026-10-08 (America/New_York)  
**Owner:** Jerome Griffin  
**Baseline:** External Project Brain I, current pointer observed in `jeromeleegriffin/Test/brain/current.json` on 2026-10-08. Brain I remains frozen historical authority.  
**Status:** Documentation current; candidate builds 054–058 are not owner-approved. Build 058 ZIP integrity passed; browser-render and Android audio/visual review remain open. This update is being delivered in an owner-requested Grok prompt ZIP; that ZIP contains no game build.

## Read first

Read Brain I for the preceding project history and protected authorities, then this Brain J delta for the October 8 Rook-game candidate work and current process rule. Brain H/I archives and visual authorities remain historical/frozen. Do not reinterpret any candidate report as owner approval.

## New hard workflow rule: game-build ZIPs require explicit authorization

**Do not create, rebuild, replace, or package a game-build ZIP until Jerome explicitly tells you to create/package that game ZIP.**

- “Continue,” “fix it,” “update the Master Bank,” “work on it,” or similar instructions authorize the described game work, but do not by themselves authorize packaging a game build ZIP.
- An explicit instruction such as “make 059.zip” or “package this game build” authorizes that specific game package. Authorization for an earlier game ZIP does not automatically authorize the next one.
- Source-code work and text documentation may continue while a game ZIP is held. Keep the working candidate reviewable; do not create a game archive as a convenience.
- Grok-to-GitHub prompt packages are a separate deliverable. When Jerome asks for a prompt for Grok to send to GitHub, package the complete prompt and its required supporting files in a ZIP as requested. That ZIP is not a game build and does not authorize a game ZIP.
- This rule supersedes the older Brain I handoff wording that every handoff must be a ZIP: follow Jerome's current per-deliverable instruction. When he asks for a Grok prompt ZIP, include the complete prompt and required source files. When he asks for a game build ZIP, include the complete runnable game and evidence. Keep chat delivery concise.

## Preserve global project authority

- THE WORKING SCREEN WINS. Actual Android screenshots and rendered pixels outrank code, measurements, mockups, and reports.
- Do not start over, redesign the game, replace approved art, change protected gameplay, or infer card geometry from CSS alone.
- Keep TABLE-003, the locked four-color palette, card faces, approved played-card presentation, Bid Dock, speed controls, Last Trick, scoring, dealing, sorting, and gameplay protected.
- No production deployment is authorized. Do not clear Jerome's phone/browser/service-worker state.
- A static or desktop test is not equivalent to Jerome's Android Chrome review.
- Keep this Rookxxx/053–058 candidate sequence distinct from the live v531/Brain I room-state record.

## Build 054–058 continuity ledger

### Build 054 — rejected

Jerome's Android review confirmed card art clipping into the physical cardholder at larger hand counts, especially seven and eight cards. The interference becomes less noticeable as cards are played and the hand reflows. Build 054 was rejected. Do not claim the tray is correct merely because the values remain readable or later low-count hands look better.

The Bid Box/cardholder connector was missing or visually incorrect in the tested state. The Bid Box's visibility and interactivity must be tested in actual bidding states.

### Build 055 / 055-2 — corrective candidate and owner observations

- The Bid Box was restored and later appeared during active bidding. One initial phone screen showed no Bid Box when Jerome expected to act first; Jerome was unsure whether it was his turn or whether he could play a card. The cause remains unconfirmed. Do not record this as either a proven bidding defect or a proven fix; test turn state, Bid Box appearance, and actual controls together.
- Jerome later observed the connector during an active Bid Box screenshot and said it showed how the connector works. Preserve the connector as a physical image asset, visually subordinate to the Bid Box, and bound to the same live Bid Box visibility state. The cardholder remains visible when bidding ends. Open/close/reopen behavior still requires deliberate verification.
- When cards were made larger, Jerome saw the top of the cards clipped. The ten-card tray should use the largest natural card size that fits the holder, but enlargement is not acceptable if it clips card tops, readable faces, or unintended portions at the side walls. Preserve intended front-lip occlusion.
- Jerome reported that the ordinary played-card sound thumped at the touch/acceptance point instead of landing. Correct timing must align with the visible card travel and table contact.

### Build 056 — owner-reported deal-time movement

Jerome observed that the bottom avatar, and possibly other seat avatars, moved downward during the deal as the cards shrank/reflowed. Seat/avatar anchors must remain stable while card sizes and hand layout change. This remains an open phone-observed defect unless later verified by actual before/after screenshots; no 057/058 report establishes that it was fixed.

### Remaining winning cards

Jerome explicitly requires cards laid down by “Sol lays down the remaining winning cards” to land on the same physical table plane and perspective as normally played cards. Build 057 reports a table-plane correction, but neither the prior restricted-browser test nor Jerome's phone has verified its final appearance. Keep the requirement open until actual rendered/phone evidence is reviewed.

### Build 057 — candidate, not visual approval

Build 057 carried a tray paint-containment correction, the remaining-winning-card plane correction, and a softer/timed interim sound. Browser startup/render was blocked by workspace EPERM. Its report explicitly did not claim fresh rendered pixels or Android approval. Treat those corrections as candidate implementation only.

### Build 058 — audio landing variations

The owner supplied the Freesound recording “card placed on table.wav” by filmfan87 (Freesound ID 108395; supplied page screenshot identified CC0). Five distinct 0.305-second impacts were isolated and cleaned into 48 kHz mono PCM16 WAVs. They were normalized to about -14 dBFS peak, included in a listenable montage, and added to candidate 058. Ordinary card-play playback randomly chooses among the five and excludes immediate repetition. The mock runtime test passed for five loads and scheduled delays of 445 ms at 1×, 125 ms at 3×, and 0 ms at MAX, intended to align the recorded impact with the card's arrival.

**Important correction from Jerome after Build 058:** the required full card-play sound is a sequence with (1) a soft card peel/lift leaving the hand, (2) a subtle in-flight card sound, then (3) a soft table landing. Build 058 contains the five varied landing impacts only; it does NOT contain confirmed peel/lift or in-flight sounds. Do not claim the complete sound requirement is met. The prior harsh thump at initial touch must not return. Align each audible phase with the actual animation at 1×, 3×, and MAX. Preserve five varied soft landing impacts where they sound natural. The owner's latest spoken message ended with “and also”; do not invent an additional sound requirement beyond the three confirmed phases until Jerome completes it.

The Build 058 ZIP passes ZIP test and CRC checks, and the audio runtime mock passes. Browser rendered gameplay was not verified due the workspace's localhost/Chromium EPERM restriction. The package and extracted clips do not constitute an Android listening or appearance pass.

## Physical Bid Box / connector authority

- The connector is an actual raster/approved graphical asset, not CSS-drawn artwork.
- Bid Box visible → connector visible and physically joins Bid Box to cardholder.
- Bid Box hidden → connector fully hidden with no residue or touch interception.
- If bidding reopens, connector returns in alignment without duplicates.
- Cardholder stays visible throughout gameplay.
- Do not independently move approved Bid Box or holder to make the connector fit.

## Cardholder and dealing acceptance criteria

Use real phone screenshots at matching viewport and hand counts. Inspect the visible artwork, not just DOM rectangles. Test 10 through 1 cards, including the initial deal and dynamic deal/play transitions. Measure/observe total hand bounds, holder usable inner width, side walls, card top edge, front lip, transparent asset margins, transforms, stacking contexts, and touch hit regions. Keep cards as large as reasonably possible and preserve their responsive growth as cards leave. Do not solve clipping by shrinking every card, lifting all cards above the holder, or removing the holder's depth. Avatars must remain anchored during deal/reflow.

## Audio implementation acceptance criteria

For a future authorized source change:

1. Soft peel/lift transient begins when the card leaves the hand.
2. Quiet in-flight flutter/slide accompanies visible travel; avoid a loud generic whoosh.
3. One of the five cleaned landing samples aligns its impact with the card touching the table, followed by its short natural settle.
4. No sharp thump on the first touch or early sound before visible motion.
5. Timing and level are checked at 1×, 3×, and MAX, with user mute/preferences respected and no interaction/gameplay regression.
6. Listen in a real mobile browser/Android phone; mock Web Audio timing alone is insufficient.

Do not use an unverified sound source. If new source audio is needed, inspect its license and listen to it before integrating. The current 058 samples are landing-only.

## Current status and next work

- Current last external Brain pointer before this delta: Brain I, dated 2026-10-07. Brain I remains unchanged.
- Build 054: rejected.
- Builds 055–058: candidates; no full phone approval for the newly discussed tray/avatar/claim-plane/audio details.
- Build 058: archive integrity and isolated audio runtime checks pass; browser render and Android review are pending.
- Known open issues: larger-hand top/side clipping; deal-time avatar drift; uncertain initial Bid Box state vs turn state; confirm connector hide/show; visually verify remaining-winning-card table plane; add peel and in-flight audio stages and listen on Android.
- Next implementation should start from the existing complete 058 candidate/source, not rebuild the game. Do not create 059.zip or any other game-build ZIP until Jerome explicitly authorizes that package. A separately requested Grok prompt ZIP does not authorize it.

## Evidence and limitation notes

Phone screenshots supplied by Jerome for builds 055/056 and the Freesound page remain primary visual/audio references from the conversation. Build 055/056 screenshots bundled in 058 are historical and are not fresh Build 058 render captures. The owner must review current Android screenshots before any cardholder or sound treatment is called approved. Do not publish/deploy a game build.

## End of Brain J delta
