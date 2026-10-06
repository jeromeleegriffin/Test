# Runtime Visual Ownership — Rook566

This is the stabilization map. Do not remove a legacy-named file based on age alone.

- Hand theme rotation: `game.js` `HOR_VISUAL_THEMES`, `horSetThemeIndex`, `horApplyHandTheme`.
- Diagnostic preview: `game.js` `horEnsureDiagnosticConsole` / `horDiagPreview`; final presentation CSS at end of `style.css`.
- Premium regular card faces: `cardInnerHTML` / `renderCardHTML`; final typography and progressive detail authority at end of `style.css`.
- Bottom bid marker: created in `renderUI`; positioned only by `positionMoonBidBadge` in bottom seat coordinates.
- Opponent thinking status: `setBotThinking` + `positionBotThinkingAtSeat`.
- Center bid controls: `showBidUI`; theme personality from six `hor-bid-theme-*` classes.
- Stamp-the-Trump selector: `showTrumpUI`; final six-theme shell rules at end of `style.css`.
- Trump animation: `HOR_TRUMP_FX` + existing stamp animation classes.
- Nest/discard: discard overlay renderer in `game.js`; authoritative Premium Raven card inner renderer; final Nest size/animation rules at end of `style.css`; reveal audio through `playNestRevealSequence`.
- Special capture events: existing capture event behavior remains in `game.js`; final premium themed capture shell in `style.css`.
- `rook512-room.js` remains behavior-coupled and dynamically loads room support assets; it is NOT disposable legacy code.
- `polish.js` remains behavior-coupled because it wraps active render/update behavior; do not wholesale-delete it.
