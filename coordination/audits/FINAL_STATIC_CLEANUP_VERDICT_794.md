# Build 794 full static dependency review and cleanup decision

Audit branch: `audit/repository-cleanup-20261012`. Owner-uploaded `794.zip` inspected without modifying archive. This document supersedes any implication that older-numbered files can be deleted based on their names.

## ZIP structural checks
- 1,333 archive entries, SHA-256 `ff0792b5d66728d0115d7dac033e28f7a44e839822455b75e9fe17afdbc80054` (previously verified).
- 69 root JS/CSS files.
- HTML scan identified 68 local external `script src` or `link href` references (including non-JS/CSS link targets). **Zero unresolved direct references.** Earlier breakdown of 41 JS and 24 CSS was narrower.
- The archive includes `game.js` and `game060.js` as DIFFERENT files (981,638 versus 1,009,051 bytes), and `style.css` and `style057.css` as DIFFERENT files (2,233,186 versus 2,259,265 bytes). Never treat these as byte-identical duplicates.
- `sw.js` and `sw060.js` are DIFFERENT files (9,046 versus 16,487 bytes).
- Main HTML registers `sw060.js?v=794` and direct loads include `progression.js`. Do not change registered worker without offline-cache and Android regression tests.
- A static scan of HTML attribute links, CSS `url()`, and quoted JS import/register patterns found no missing direct HTML references. Its 38 *candidate* missing references include clearly non-path tokens such as `location.href`, `blob`, `%23n`, and generated HTML snippets, plus directory-based dynamically constructed paths. These are not 38 verified missing assets. Full dynamic path execution is outside this static check.
- `game.js`, `style.css`, and `sw.js` have inbound textual references (including historical worker precache lists, version comments and manifests); textual references do not prove runtime execution, but they disqualify deletion by filename heuristic.
- Some modules reference directories rather than enumerating filenames (`assets/raven-fight/`, `assets/characters077/`), so a complete dynamic asset audit requires runtime execution.

## Keep / change / delete decision
**KEEP:** All root game and style files, both service workers, both loader entry points, `progression.js`, assets, Brain history, builds, and coordination ledger. No candidate has passed a full inbound-dependency plus Android test sufficient to delete anything.

**CHANGE (documentation only, isolated branch):** Root README now distinguishes deployed Test root 779, approved working 783, local 794 and Brain AA. Audit reports document the source and test limitations.

**DELETE / MOVE:** NONE recommended or authorized.

## Version normalization verdict
Do not force 779, 783, 794, 712, 450, and AA to match. They describe distinct deployment, approval, historical source and documentation states. Historic labels in comments, names, archived files and checkpoint documents are legitimate. The only confirmed misleading CURRENT label was the root README, corrected on this audit branch.

## Career card finding
The Build 794 progression file contains career-card code and achievements. The owner-approved no-scroll main summary, paginated achievement cards, exact remaining requirements, and best bot partner should be implemented as a **separate isolated game candidate** based on the verified latest approved source, not bundled into this repository hygiene branch. Preserve lifetime records. Do not substitute Rook trick wins for removed Rook captures on main card.

## Completion status and outstanding test limits
The documentation/version hygiene phase is complete on the isolated branch. No game source was modified, no ZIP packaged, no deployment, no Brain publication and no main merge.

A full runtime dynamic asset graph, cross-version diff against all original 783 and 794 files, browser execution and physical Android test are **not certified** by this static review. Therefore destructive cleanup and merging remain blocked. This is a deliberate NO-DELETION result, not an incomplete request to delete files.

## Recommended owner review
Review the isolated documentation-only branch. If approved, merge documentation separately from any later game implementation. Keep every legacy runtime file until a specific file has independent deletion evidence.
