# Stage5: landscape navigation and leave confirmation
Continues stage4 1ecb094c47608d7fe3b2675a5b99843c25690c8e. Isolated, no deployment or ZIP.
Changed runtime file: angle-c-runtime.css only. Keep stage4 JS and existing integration patch.
Both original navigation buttons now48x48 with8px gap, original icons30px; existing button nodes, handlers, positions and authoritative human bidding lock retained.
Confirmed defect: landscapeTheater intercepted taps on #confirmCancel because existing #confirmSheet was stacked behind it. Reproduced with actual touch action. Corrected C-landscape-only confirmation stacking via z-index210000. No leave logic change.
Executed navigation-c.cjs: actual offline startup, human +/-5 bid controls, both nav buttons hidden during human decision, pass, play; Menu open/close preserves exact hand;48px bounds and center-point hit checks at844x390,667x375,740x360,1024x600,1280x800; Cancel returns safely with exact hand; confirm Leave returns to lobby; no JS errors.
Simulated viewport changes run in normal Chromium window, not physical Android fullscreen rotation. Portrait and multiplayer leave not newly tested. Earlier test mistakenly expected native confirm; corrected to actual houseConfirm panel before identifying stacking defect.
Save screenshot c-navigation.png. This still uses fixed-cast stage2 scene; actual-avatar study remains isolated/unconnected. Rollback by restoring stage4 CSS. Main and production unchanged.
