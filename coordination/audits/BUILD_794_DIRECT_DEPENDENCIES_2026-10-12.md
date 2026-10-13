# Build 794 direct dependency audit — continuation

Source: owner-uploaded verified `794.zip`; no archive modification.

## Direct HTML references
- 41 external script tags; all 41 target paths exist in ZIP.
- 24 external CSS link targets; all 24 target paths exist in ZIP.
- `index.html` registers `sw060.js?v=794`, and `sw060.js` exists.
- `progression.js` is a direct active script dependency.
- The root ZIP contains 69 JS/CSS files, seven of which are not referenced as direct script/link entries in the HTML: `game.js`, `rail-trick752.css`, `rail-trick752.js`, `rook514.css`, `style.css`, `sw.js`, `sw060.js`.
- **Not referenced directly does NOT mean unused.** `sw060.js` is explicitly registered dynamically; `style.css` may be referenced through imports or other CSS. The remaining paths require inbound reference tracing, worker caching and loader checks.
- The build's READ_ME confirms source 793 and describes win-cue timing changes, with career/achievements deferred.

## Disposition
- KEEP all seven pending full graph, asset and historical-entry-point analysis.
- No deletions or renaming authorized by this evidence.
- Do not transplant deployed 779 root over 794; no runtime modifications on cleanup branch.
- Do not interpret matching direct links as a full browser/Android regression pass.

## Verification limits
This is an archive static-analysis check. Dynamic imports, CSS @imports, service-worker precache references, generated asset paths, in-game runtime flows and Android rendering require separate checks.
