# Welcome panels — 805-welcome, 2026-10-14

Owner requested both entrance and Join by Code panels styled closer to supplied ornate green/gold reference. Standing Test-only update authorization applies. No new ZIP or production changes. Cloudflare lifecycle testing remains deferred by owner.

Source: Test runtime805-ownerfix2, cb3fc725f835b66badc55bdda26e41a8e81d454e; metadata main b40c1163b95f3ab8f97f06ef06c94892e4e75cb4. Master Brain AC unchanged. Original archives and previous source retained.

Changes: landing783.css adds layered embossed gold border, fine corner ornaments, existing gold griffin crest, dark green texture, gold primary and navy secondary raised buttons. Same simplified actions and shared entrance panel. Decorative pseudo-elements ignore touches. Compact styles preserve small-screen fit. game060.js changes join-field focus to preventScroll and skips legacy scrollIntoView on fixed landing783; reproduced old call shifting the entrance away from the viewport. No join transport or rules changed. index.html, manifest.json, hor-version.js, sw060.js and game060.js runtime markers coherently change to805-welcome.

Validation: local results.json and before/after screenshots accompany this handoff. Returning home/join and Change player tested at393x647,320x480,600x840,800x1100,800x360. Field input, primary visibility, Back, button hit targets, viewport bounds and non-scrolling panels checked. Full games/audio/X1 tests from805-ownerfix2 retained, not repeated for styling/focus changes. Physical Android keyboard/tablet appearance and owner acceptance remain pending. Final deployment receipt records Pages/served bytes/browser verification separately.

Rollback: restore ONLY the six changed runtime paths from b40c1163b95f3ab8f97f06ef06c94892e4e75cb4 in a new reviewed Test commit; do not reset main or player data. Preserve concurrent coordination records. Exact changed hashes are in deployment receipt. Keep current number registry; this runtime suffix is not a new numbered archive.

Continue deferred repairs only from verified latest source. No automatic notification to another conversation is claimed.
