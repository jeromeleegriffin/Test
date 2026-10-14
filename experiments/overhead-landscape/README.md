# Overhead landscape: isolated preparation checkpoint

Branch: work/overhead-landscape-20261014. Base runtime b551144768084fc81c12de03682eae4e78f8e600; inherited documentation6de8cd159c67177a307335b235f5ed327abb57ba. Master BrainAC and owner fallback verified unchanged. No main/runtime edits. No website deployment, ZIP number, artwork generation or playable-integration claim.

## Completed here
Recovered exact index.html/game060.js from fallback and inspected real rendering/action functions. Created a pure presentation projection and event ledger; neither is loaded in the game. The module excludes host hands, exposes only local hand and public plays, retains actual avatar identity, explicitly marks unavailable poses/counts, maps all four local seats, freezes its copied output, and gives stable event-derived toss offsets. Ledger primes reconnect/initial snapshots without replay and retains played-event identities across rotation. It owns no engine callbacks, game timers or action handlers.

Node regression tests pass for all seat mappings, sparse roster seat ownership, hidden-hand getter trap, spectator privacy, source immutability, missing-pose behavior, repeated renders/rotation ledger observations, snapshot priming and stable offsets. These are preparatory unit tests only; no browser/gameplay integration verified.

## Confirmed integration points in fallback game060.js
- renderUI at11015 reads authoritative game/myIndex; currently also performs career/audio work. Do NOT invoke an extra renderUI merely to rotate the scene.
- renderHand at11870 sorts the authoritative hand and copies markup into ltHand. New view must reuse the existing action binding, not independently sort or duplicate hand controls.
- submitPlay at9204 invokes hostProcessPlay or existing client action queue with action identity; use this route, never send raw network plays from the renderer.
- Existing submitBid/Trump/Discard/Play exported at13551. Reuse approved controls, +/-5 interaction and legality checks.
- updateLandscapeTheater at13670 is the obsolete theater presentation to replace only in the isolated candidate.
- animatePlayedTravel041 at15180 is portrait-gated. New overhead travel needs separate origin/destination geometry while preserving authoritative collection timing. It must not mutate shared portrait seen-event flags.
- publicPlayersSnapshot at5040 exposes explicit seat/avatar identity but no public hand-count field. Derive a safe count-only adapter from authoritative host and received client lifecycle evidence before claiming multiplayer support. Missing counts remain null, never invented or filled with private values.
- Portrait collect/reveal/claim/deal callbacks retain engine ownership. Overhead event ledger is presentation-only and has not been wired to them.

## Artwork gate
809.zip verified SHA2563fc14fa02bc54423a9d2d84cb392d08c61c227969c844b622bb9c9264ec1e432. CURRENT_FOUR_HOLDERS.png inspected: all four holders contain baked cards; central plays and red crest are baked; people/table are a single flat picture. Original805 reference files are frontal/far-seat views, not overhead layers.

Required asset batch after explicit Generate: clean room/table plate with no people/cards/active stamp; four separate matching overhead people with no held cards; four empty holder back/front-lip layers aligned to the same scene. Keep table long axis vertical in widescreen. Genuine current card art and live trump are rendered separately. Preserve chosen identities; unsupported cast cannot silently use reference people. No character animation rigs required in phase1. No CSS substitute artwork and no flat-reference-as-playable-background shortcut.

## Next steps
Owner's explicit Generate remains required by809 and standing image rule. Once authorized, prepare and inspect actual layers, then connect this presentation model to a real landscape renderer using existing game actions. Complete phone-fit, full-hand, rotation-mid-action, privacy and portrait-diff checks before making a numbered isolated test ZIP. Never publish landscape to Test or production. The owner-reported tablet Menu/Leave Room and player-name/card touch issues remain recorded and unfinished; not fixed by this preparation.

Full current continuity/reading rules and handoff constraints are preserved verbatim in coordination/PRE_LANDSCAPE_FALLBACK_20261014.md in this branch. Every successor startup/handoff must reproduce them verbatim, not substitute this short checkpoint.
