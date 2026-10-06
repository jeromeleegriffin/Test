# Rook621 — FULL GAME FORENSIC MAP (DIAGNOSTIC BUILD)

Clean source: Rook618 confirmed shared Bid/Trump placement baseline.
This build intentionally does NOT include rejected Rook619/Rook620 presentation work.

Purpose:
Give ChatGPT a forensic map of the entire running game instead of guessing.

FULL MAP controls:
- CAPTURE STATE: captures every DOM element in the current screen/state.
- PICK POINT: tap any visible location and exports the full elementsFromPoint stack.
- EXPORT ALL: downloads ROOK621_FULL_GAME_MAP.json containing every captured state.
- HIDE: collapses the mapper to a tiny MAP button.

Each element record includes:
- id, classes, text and data attributes
- exact getBoundingClientRect X/Y/width/height
- visible/hidden state
- computed positioning, transform, overflow, z-index, background, border, font
- inline style
- parent + ancestor chain
- ::before and ::after computed content/style
- stacking-context chain
- every readable matching CSS rule and stylesheet
- viewport/build information

The build also records DOM/attribute mutations between captures.

Recommended captures:
START TABLE, BID, STAMP THE TRUMP, DISCARD, PLAYING/TRICK,
HAND END, GAME MENU, HAND HISTORY, and any broken popup/state.
Then press EXPORT ALL and send the JSON file back to ChatGPT.

No game mechanics, scoring, AI, dealing, multiplayer, Bid geometry,
Trump geometry, or existing UI styling are intentionally changed.
