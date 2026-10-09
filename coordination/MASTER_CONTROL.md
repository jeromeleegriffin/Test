# Master Control: Assignment and Decision Ledger

Owner: Jerome Griffin. Coordination owner: Master Control. Published source of truth: `brain/current.json` and complete Master Brain.

## Initial authorized coordination task
Create and verify only this `coordination/` folder and its six text files. Stop for owner review after commit verification. No game changes, deployment, or new Master Brain publication.

## Specialist initial assignments (read-only)
- **Game Repairs:** Audit `074.zip` against `071.zip`; identify source-level differences, blockers, and required Android testing. No patches.
- **House Effects:** Audit House Effects menu, sound, fireplace, lantern, and banked bird-fight design. Distinguish preview from live integration.
- **Character Studio:** Audit original seated-character reference and hard rail occlusion, beginning with Dagger's left rail. No art generation.
- **Cards & Trump:** Audit approved card assets, original pixels, trump-case construction, and trump hand-marking specifications. No art generation.

These are documentation of previously scoped read-only specialist work, not new permissions to modify assets.

## Coordination protocol
Each specialist reads this file and its own status at start/resume. Master Control reads all specialist status files before new cross-specialist assignments. Changes to assignments require owner authorization; publishing specialist status requires the applicable authorization. Record dates, commit identifiers, evidence, and blockers. No automatic chat-to-chat messaging is implied.

## Build safeguards
`074.zip`: game repair candidate, source repairs reported, **not Android-approved**. `075.zip`: bird-fight documentation-only recovery, **not playable Build 075**. `071.zip`: reported rollback checkpoint. Verify original archives and hashes before claiming binary verification. Preserve TABLE-003, ROOK025 LAST, Bid Dock and physical connector requirements, rail occlusion, landscape, and working gameplay.
