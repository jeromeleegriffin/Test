# Rook622 — AUTOMATIC FULL GAME FORENSIC RECORDER

Clean rebuild from Rook618. Rook621 is not used as a base.

AUTO MAP:
- Starts automatically.
- No prompt/accept dialog.
- Watches the game while you play.
- Immediately prioritizes Bid, Trump, Discard, Menu, modal/popup, history transitions.
- Deduplicates identical geometry/state fingerprints.
- Records full element geometry, visibility, computed CSS, pseudo-elements,
  ancestry, stacking, matching CSS rules, data attributes, viewport/build.
- Records DOM/class/style/hidden mutations.
- FLAG NOW forces a snapshot for anything you specifically want marked.
- EXPORT MAP downloads ROOK622_AUTO_GAME_MAP.json.
- HIDE leaves the recorder running.

BOT SPEED:
Source inspection found existing speed-related terms: [('botSpeed', 10), ('instant', 7)]
A fake diagnostic speed control was NOT invented. If the existing game exposes
a verified full-speed control through its missing menu, the exported map will
help identify and recover its real owner safely.

This build is diagnostic-only. It does not intentionally change game UI,
Bid/Trump placement, scoring, rules, AI decisions, dealing, or multiplayer.
