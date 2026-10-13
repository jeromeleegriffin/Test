# Griffin House of Rooks — Test repository

This repository contains the **Test-site runtime**, historical snapshots, project coordination, and the browsable Master Brain. These are separate version tracks; do not renumber them to match.

## Current state (audit checkpoint, 2026-10-12 owner session)
- **Test root runtime:** build 779 (`index.html`, `hor-version.js`, `sw060.js`).
- **Approved working game:** build 783, as recorded by `brain/current.json`.
- **Latest local candidate recorded:** build 794, owner phone-approved, not deployed.
- **Master Brain:** AA, per `brain/current.json`. Brain versions are documentation versions, not game builds.
- **Build-number authority:** `coordination/BUILD_REGISTRY.json` and `coordination/BUILD_NUMBERING.md`.

These statements reflect the repository's recorded status at the audit checkpoint, not a fresh Android runtime test. Check the live pointers and registry before new work.

## Repository landmarks
- `index.html` and root runtime JS/CSS: Test-site game.
- `sw060.js`: 779 service-worker implementation. Older `sw.js` is retained pending dependency verification.
- `progression.js`: historically labeled RookGame450, with disabled configuration in the inspected root. Do not equate its header with the current game build.
- `brain/current.json`: published documentation pointer; `brain/versions/` contains historical and current Brain material.
- `coordination/`: shared build registry, numbering rules, and workstream records.
- `builds/`: historical build snapshots, not automatically the deployed game.
- `player/`: test player/loader infrastructure.

## Historical origin
This repository was initially prepared from a protected R712 staging archive (SHA-256 `fb36cb316802aafd81b64e6acb23e208894225277d58b83664e008f307d1584c`). The original R712 cleanup preserved runtime assets and game behavior at that time. Subsequent development advanced beyond R712; the old README headline was therefore stale.

## Cleanup policy
Never delete, rename, or archive files solely because their names carry older build numbers. First trace imports, service-worker registration, loader dependencies, asset references, and historical checkpoint ownership. Preserve frozen evidence. Use isolated branches and owner review before merge/deployment.

See `coordination/audits/REPOSITORY_CLEANUP_2026-10-12.md` for the audit findings and remaining verification gates.
