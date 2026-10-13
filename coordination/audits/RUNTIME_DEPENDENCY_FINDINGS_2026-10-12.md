# Runtime dependency findings — Griffin House Test cleanup

Branch: audit/repository-cleanup-20261012. Read-only inspection of Test/main; no runtime changes.

## Verified active entry points
- Root `index.html` loads `hor-version.js?v=779`, `game060.js?v=779`, `progression.js?v=779`, and other current scripts. It explicitly registers `sw060.js?v=779`.
- Root `hor-version.js` identifies 779 and checks page, script, worker and cache coherence.
- `sw060.js` identifies build/cache 779. Root `sw.js` identifies 712, but no root `index.html` registration of `sw.js` was found. KEEP pending other entry-point/reference checks.
- Root `GriffinHousePlayer.html` contains a ZIP-preview mechanism and blocks service-worker registration inside the preview.
- `player/GriffinHousePlayer.html` separately registers `player/GriffinHousePlayer-sw.js`; do not merge or delete the two loader entry points without verifying consumers.

## Career/progression correction
The RookGame450 comment and initial `CONFIG.enabled=false` in `progression.js` are not sufficient evidence that the file is unused. The same file defines a later local-career layer whose `applyMode()` toggles the configuration based on local mode. The active `game060.js` invokes `HORProgression.localCareer.publicProfile()`, `botPublicProfile()`, and `showCareerCard()`. Therefore `progression.js` is an ACTIVE dependency, and its older historical header must not prompt deletion/replacement.

The present `showCareerCard` implementation uses an element with `max-height:78vh` and `overflow:auto`. This confirms that the owner's no-scroll paginated card request requires a dedicated future runtime change on the verified working build, not a cosmetic README edit.

The `FAMILIES` array includes `rook_hunter` bound to `rookCaptures`; preserve the stored history and review achievement semantics separately before changing definitions.

## Classification
- KEEP ACTIVE: `index.html`, `hor-version.js`, `game060.js`, `progression.js`, `sw060.js`, active imported JS/CSS/assets.
- KEEP INFRASTRUCTURE: root/player loaders, `player/GriffinHousePlayer-sw.js`, `brain/`, `coordination/`, `builds/`.
- KEEP PENDING FULL GRAPH: `game.js`, `sw.js`, older CSS/JS with numeric suffixes, alternate loader files. Old name is not proof of disuse.
- DOCUMENTATION FIX: root README updated only on audit branch.
- DELETE: none authorized or sufficiently proven safe.

## Remaining verification
Trace every runtime asset, dynamic reference and historical preview route, inspect current local build 794 versus deployed 779 and approved 783, and perform browser/Android regression checks before any source relocation. Do not merge, deploy, publish Brain, or package a game ZIP without authorization.
