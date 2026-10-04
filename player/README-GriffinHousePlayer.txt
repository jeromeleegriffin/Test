GRIFFIN HOUSE PLAYER v5 — DIRECT-TO-TEST / ONE TAP

NORMAL WORKFLOW — NO BUILD ZIP PASSES THROUGH JEROME'S PHONE
1. Jerome gives Grok the task prompt/specification only.
2. Grok starts from the proven clean R712 baseline in JeromeLeeGriffin/Test.
3. Grok creates a NEW unique /builds/<id>/ candidate directory.
4. Grok applies ONLY the authorized change inside that new directory.
5. Grok verifies scope/diff and candidate completeness.
6. Grok updates /player/latest.json LAST.
7. Jerome opens the bookmarked Player and taps LOAD LATEST TEST BUILD.

Jerome does NOT normally download a candidate ZIP, find it in Downloads, or upload it to Grok.
The ZIP button remains emergency fallback only for candidates that exist only as files.

HARD RUNTIME-TRUTH RULES
- Root /Test/ remains the clean R712 baseline.
- Every candidate gets a never-reused unique /builds/<id>/ URL.
- latest.json points to exactly one candidate and is changed LAST.
- No missing file may be borrowed from root or another candidate.
- No candidate may be repaired by mixing versions.
- If an authorized one-file job changes another runtime file: STOP.
- Production is never touched.
- Landscape remains frozen unless explicitly authorized.
- Bid Box/gameplay remain frozen unless explicitly authorized.
- Candidate URL is a preview/verification lane; acceptance still depends on actual phone runtime evidence.

PERMANENT PLAYER URL
https://jeromeleegriffin.github.io/Test/player/GriffinHousePlayer.html

GROK ROLE
Grok is the GitHub deployment/build hand. ChatGPT remains the design/control/review side.
For normal jobs Jerome pastes a compact task prompt into Grok; Grok makes the candidate directly
from the proven Test baseline, stages it, verifies it, and updates latest.json. No candidate ZIP
handoff is required unless the task depends on a unique binary asset Grok does not already have.
