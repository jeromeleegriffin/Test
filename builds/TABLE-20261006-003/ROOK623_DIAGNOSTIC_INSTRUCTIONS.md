# Rook623 — LIGHT AUTO MAP + BOT SPEED + ELEMENT FINDER
Clean rebuild from Rook618. Rook622 performance-heavy recorder was discarded.

- Lightweight automatic geometry/state timeline; no whole-DOM CSS-rule scans.
- Deep details only for targeted important UI owners.
- Uses the game's EXISTING botSpeed variable and existing modes: blitz / normal / slow.
- Diagnostic strip exposes BLITZ / NORMAL / SLOW even while Game Menu is missing.
- FIND ELEMENT searches visible element IDs/classes/text and selects by list — no need to catch a moving spinner.
- Search defaults to `spin`; try `spinner`, `stamp`, `moon`, `anim`, etc.
- Selecting a result outlines it and displays exact selector + X/Y/W/H.
- EXPORT creates ROOK623_AUTO_GAME_MAP.json.
- No intended changes to gameplay rules, AI decision logic, scoring, dealing, Bid/Trump geometry, or menu styling.
