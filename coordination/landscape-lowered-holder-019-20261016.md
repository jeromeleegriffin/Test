# Landscape 019 — lowered local holder review (2026-10-16)
Status: DELIVERED_PENDING_OWNER_REVIEW. No live deployment.

## Owner steering
Continue existing wide static playable work; do not restart. Move bottom player's head and shoulders down out of view, optionally retaining resting hands. Owner explicitly corrected "move card table down" to "move bottom player's CARD HOLDER down". Do not move the table itself down. Preserve current hand-card size initially. Cards-in-hands 017/018 remain approved and paused.

## Audit
Prior wide build: three complete Chromium hands at3x (pass,180bid,Moon), not three full matches. Examined screenshots and sampled trump animation. Found vertical played-card flattening, Moon artwork/text escaping bid box, chooser obscuring top player, stamp crossing/hidden behind hand, discard navigation overlap. Recommendations remain banked; do not claim all animation coverage.

## Candidate
Local archive019.zip; Library canonical filename019(2).zip
Library libfile_332f90bd82fc819192d8b67c62b57d15
File file_00000000acd081f58081edff8c3f2e05
Bytes160658866
SHA2561dc3bf5cd4fa65893554512c0008cdac8284f92ae03041310122aad41022965f
1569entries; rootindex.html; CRC and full manifest verified.
Base wide archive SHA256fe9526764b428b56cfe07232e69a60b9bf003f1a50669cf298257efa40c1ed6c.
Underlying Stage9 source9bd8debf48e69e42a6c5764869526a4800dc280a.
Build019-landscape-lowered-holder-20261016.

Finished image editing removes bottom head/shoulders and retains resting hands clear of lower holder. Holder moved about80 scene pixels, not requested target120; final source bounds roughlyy638–736. Hand bottoms y700 versus620; original card86x129 unchanged. Foreground lip derives from same scene, clipped81.55–87percent height. First artwork pass rejected for insufficient lowering, second retained as review candidate. Original lamp SVG remains separate.

Trump chooser width min(400,42vw,90vh), positioned above y571 hand top. Existing trump animation/rules remain unchanged. Moon root cause: broad landscape all:unset!important reset overrode attachment positioning. Exempted Moon subtree; restored original finished assets/connectors with landscape typography. Older #bidOverlayHost selector overrode intended root geometry; corrected selector specificity, positioned bid box above lowered hand. No new Moon art.

## Verification
Direct Chromium Moon hand to score, no script errors. Phone844x390 and tablet1280x800 Moon fit inspected after repair. Original unchanged ZIP loader complete hand to scoreboard, no script errors. Package includes QA_RESULT and per-file hashes. Final packaging after loader check added QA documentation only; runtime unchanged.
Gameplay game060 unchanged except build label; original card assets, bots/rules/voices, portrait modules preserved.

## Honest limits / next
Not owner-approved; not physical Android tested; no full match/multiplayer certification. Fixed artwork cast remains independent of actual roster. Opponent holders remain interim. Played-card scaleY(.62) unchanged; header/scoreboard/discard navigation overlaps and special-animation coverage remain pending. Next owner reviews lowered holder and controls; then improve played-card projection and remaining UI while preserving selected scene. No deployment, service-worker clearing, saved-data reset or hand-grip work.
