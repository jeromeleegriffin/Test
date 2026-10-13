# Griffin House of Rooks — Test Repository Cleanup Audit (isolated branch)

Date: 2026-10-12 owner session (GitHub Master Brain AA is dated 2026-10-13 UTC).
Branch: `audit/repository-cleanup-20261012`.
Base main commit: `2c99857d21113271c77a4a570523e21fa9509c45`.
Status: READ-ONLY INVENTORY AND PROPOSED CLEANUP. No runtime changes or deletion.

## Verified inventory
- Git tree: 2,022 entries, 1,793 blobs, recursive tree not truncated.
- Under `brain/`: 690 blobs; under `builds/`: 425 blobs; under `coordination/`: 69 blobs.
- Repository root: 38 JavaScript files and 24 CSS files. These counts do not prove redundancy.
- Test root `index.html` script references and `hor-version.js` identify runtime 779.
- Active referenced `sw060.js` declares build/cache 779; older `sw.js` declares 712. Verify service worker registration paths before changing either.
- `README.md` says R712 staging source, which no longer describes the active Test root.
- `progression.js` retains RookGame450 header and disabled feature switches. Do not infer this file is the active career UI implementation without tracing its consumers.
- `brain/current.json` identifies Brain AA; approved working build 783, Test root observed 779, latest local owner-phone-approved candidate 794 not deployed.
- Build 788 and 789 are documented as isolated checkpoints under Brain AA; do not mistake those for the deployed root.
- `coordination/BUILD_REGISTRY.json` is the project-wide build-number authority. Known collisions 754 and 756 are historical and must not be renumbered.

## Safe changes proposed
1. Update root README to describe deployed Test root 779, separately approved 783 and isolated 794, and link to live Brain pointer and build registry.
2. Create a machine-readable runtime dependency map by tracing `index.html`, service worker registration, dynamic imports, asset paths, loader references, and build archive manifests.
3. Identify genuinely unused files only after complete inbound-reference checks, including archived loaders and historical snapshots.
4. Preserve old version labels in historical code; correct misleading *current* documentation, not historical evidence.
5. Review achievement/stat tracking separately on the exact approved source, not by merging dormant RookGame450 into current runtime.

## Do not do without separate verification/approval
- Delete, move, or rename runtime files, historical build snapshots, Master Brain versions, or artifacts.
- Modify service worker cache names or registered worker paths.
- Replace game source from an older archive.
- Deploy Test or production, advance Master Brain website, or package a game ZIP.
- Merge this branch into main without owner review.

## Next verification gates
- Inspect actual script/CSS imports and registered worker path.
- Compare root file hashes with documented deployed 779.
- Confirm 783 and 794 archive identities and exact source differences.
- Run loader and Android regression checks after any eventual changes.
- Deliver an explicit keep/archive/delete proposal with dependency evidence; default to KEEP when uncertain.
