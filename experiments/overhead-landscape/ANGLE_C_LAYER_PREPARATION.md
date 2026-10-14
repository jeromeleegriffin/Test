# Angle C layer preparation checkpoint

Status: isolated artwork preparation; not deployed, not packaged, not owner-approved as a finished implementation.

Continues playable integration checkpoint 8112ca097a503f6721042897b70109c6b8ae2a9f. No existing runtime files changed in this stage. The main fallback and deployment hold remain unchanged.

## Completed
- Inspected the C composite and existing portrait/overhead assets.
- Generated a separate room/table background plate using the built-in image tool. Removed all four people while retaining the C camera and four empty holders. Visual inspection finds no remaining people. Exact pixel alignment still requires composition testing.
- Saved local project asset: landscape-work/assets/angle-c/room-table-plate-v1.png, 1672x941.
- SHA-256: 2676e034930bedc2f47e292ffc1b22d8019643b3413c049ec28078520775eba5.
- Generated output source: generated_images/exec-91c59409-3471-4cee-abf7-612e857a3579.png (image is also retained by the conversation).
- Audited the actual character registry: 117 identities, every referenced existing portrait pose file present, zero registered approved angle-C character layers. JSON inventory: landscape-work/assets/angle-c/character-layer-audit.json.

## Generation specification
Edit clean-scene-v1.png: remove only all four people including hands, heads and sleeves; reconstruct obscured wood/chairs/room; preserve camera, framing, blue felt, table outline, lighting and all four empty holders at their original positions; no cards, text, stamps or UI. Built-in image generation, no CSS artwork substitute.

## Not done
Do not present the blank plate as the completed game. Do not register portrait poses or older overhead poses as approved C layers. The existing runtime still uses its clearly marked fixed-cast integration scene. Real selected identities, local rear-view avatar, layer occlusion and alignment remain unfinished. Do not generate 117 replacement character sets as an uncontrolled batch.

## Next safe work
Prepare matching seat layers from actual identity references, composite and inspect at phone/tablet sizes, then connect existing public avatar IDs without changing game state. Preserve all current controls and gameplay tests. Human-won bid/discard/trump and full device regression still need completion.

Rollback: no runtime replacement occurred. Continue using integration-stage2 unchanged. No new build number or ZIP assigned. No Test or production deployment.
