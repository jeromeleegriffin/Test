# Remove Animations menu screen — owner correction, 2026-10-14

Baseline: 56fadfeeba75022bf7a3bf6a9d49860dc91df224; Brain AC, runtime 805-ownerreview. Owner requested removal of the Animations screen, explicitly retaining actual animations. Removed House Effects Animations tab, its pane, replay controls and isolated staging/snapshot helpers. Sound variation controls/previews and all gameplay animation implementations/assets remain intact. Shared menu descriptions now describe sound previews only.

Changed runtime: game060.js, menu-approved805.js, index.html, sw060.js. Cache revision 805-menu-finish2; runtime version stays compatible with private Worker. No Worker writes, ZIP, production changes, storage changes, or new Brain version.

Checks: JS syntax; browser 393x740, 800x1100, 800x360: animation tab/pane absent, all nine sound choices present, pagination reachable, Done returns to Sounds & Atmosphere, gameplay animation API present, no page errors. Full in-game animation visual playback and physical Android not retested. Two reported missed brown panels remain unidentified: external screenshots were unavailable in this turn; owner asked to resend.

Rollback: forward-restore only four changed runtime files from 56fadfeeba75022bf7a3bf6a9d49860dc91df224, assign fresh cache revision, preserve newer unrelated work. Full history/continuity rules remain in coordination/OPERATING_RULES.md and existing Master Brain; this is a scoped checkpoint supplement.
