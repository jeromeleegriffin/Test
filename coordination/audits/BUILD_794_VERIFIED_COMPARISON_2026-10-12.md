# Verified 794 archive comparison — Test repository cleanup

Date: 2026-10-12 owner session. Source: owner-uploaded `794.zip` inspected locally.

## Archive identity
- Bytes: 138347128
- SHA-256: `ff0792b5d66728d0115d7dac033e28f7a44e839822455b75e9fe17afdbc80054`
- 1,333 ZIP entries; integrity check passed (`testzip()` returned no bad member).
- SHA-256 exactly matches `brain/current.json` latestLocalCandidateSha256.

## Verified source facts
- 794 `hor-version.js`: `HOR_BUILD='794'`; runtime truth checks 794 page, script, worker and cache.
- 794 `index.html`: loads 794-tagged scripts and registers `sw060.js?v=794`.
- 794 `sw060.js`: BUILD 794, cache house-of-rooks-v794.
- Test/main root is still runtime 779. This is intentional deployment versus candidate separation, not a renumbering error.
- 794 includes newer active runtime modules absent from Test/main root references, including `holder-cues789.js`, `trump-voices790.js`, `human-avatars.js`, `founder-dev.js`, `holder-identity784.js`, `founder-profile785.js`, and `landing783.js`.
- 794's `progression.js` contains `showCareerCard` with a fitted non-scrolling main card layout, but the current stat grid still displays Rooks, Red 2s, Tricks, Bids, etc. It does not yet implement the owner-approved paginated achievements/best-partner career summary.
- The existing `FAMILIES` array still includes Rook Hunter tied to `rookCaptures`; review game semantics before any achievement definition change.
- 794's READ_ME says it was built from exact 793, preserving gameplay and progression, and changes holder win-cue timing. It explicitly defers career/achievement work.
- Browser tests reported in READ_ME are not equivalent to a physical Android verification of career UI.

## Cleanup consequences
1. Do not copy the 779 Test root over the newer 794 candidate or vice versa as a cleanup shortcut.
2. Do not assume 794 modules are orphaned because they are absent from Test/main's deployed root.
3. Preserve 794 ZIP unchanged as frozen evidence. Its verified SHA is the comparison authority.
4. README cleanup on isolated audit branch is safe; runtime cleanup remains blocked pending comprehensive inbound-reference and loader/archive checks.
5. Implement career/achievement redesign in a separate isolated candidate based on an explicitly selected source, preserving 794's later fixes. Do not combine it with repository file deletion.

No game files, build archives, service workers, main branch, or website were changed by this audit.
