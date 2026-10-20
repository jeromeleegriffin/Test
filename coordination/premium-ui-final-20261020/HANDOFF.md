# Premium portrait integration checkpoint — 2026-10-20

Status: RECOVERED AND INTEGRATED LOCALLY. BROWSER QA BLOCKED. NOT RELEASE READY.
No final game ZIP, deployment, or physical Android acceptance. Do not start over.

Source: Test/main a10cf91 (full SHA in INTEGRATION_MANIFEST.json); current runtime
matches 92872799e09a92a9093346345219f6e743e1295f. No reset of shared main.
Local rollback: rollback/premium-ui-pre-integration-20261020.
Local integration commit: 553f17e758fca804e77c517b25de7930a87687d5.
Local work branch: work/premium-ui-final-integration-20261020.
Its initial remote push was rejected by automatic approval review, so remote
existence is NOT claimed. Do not retry another publication route without approval.

Recovered four immutable Library archives: original assets, diagnostic supplement,
verified rail fix, and the additional continuation archive named by Brain AF.
All four CRC checks pass. Exact hashes in STATIC_VERIFICATION.json.
The integrated assets come from the verified rail fix, with its referenced
score-number-inset.png recovered from the continuation archive. All existing
artwork remains unchanged. No artwork generated or redesigned.

Changes: optional native rail ownership hook (only two lines in game060.js),
four recovered UI overlay source files, twelve asset/provenance files, four
entrypoint tags, and sixteen offline precache paths. Clock explicitly requests
12-hour output; removed an unused recovered variable. Original runtime version
remains 846-complete-repairs-20261019 while this incomplete integration is held.
Do not publish using that existing cache identity; assign coherent candidate
page/script/worker/cache identity before final integrated offline QA.

Source checks: 67 root scripts parse; 124 entry dependencies exist; 1470 unique
precache paths exist; all new CSS asset references exist. Protected modules in
STATIC_VERIFICATION.json match the repaired runtime byte-for-byte. These are
STATIC checks, never browser or visual acceptance. npm check could not execute:
acorn is absent in this runtime. Dependencies have not been installed locally.

Browser blockers: no local Chromium installed. Official Playwright Chromium
download returned HTTP403 'Domain not in allowlist' from cdn.playwright.dev.
The available cloud browser rejected http://127.0.0.1:8080 with
ERR_BLOCKED_BY_CLIENT. No combined-game browser test or new screenshot exists.
Previous archives' screenshots and hand completions apply to their older base.

Prepared alternative: .github/workflows/premium-ui-browser-qa.yml and
qa_integrated.py run actual UI hands at 360/393/430 in normal and simulated
installed modes, collect phase screenshots and settled scoring. This workflow
has NOT been pushed, run or debugged. It has no deploy step and read-only repo
permissions. Owner approval is needed for the rejected branch-push action.
Do not describe the prepared runner as passing. Additional interaction cases
remain necessary: Moon confirmation/outcomes, menu/back/fullscreen and all speed
buttons, Last Trick, score/banner transitions, next hand, landscape restoration,
toolbar/safe areas, upgrade/offline/Loader, and visual inspection of all captures.

Review the recovered objective calculation against actual point granularity:
the raw 'total-bid-own+1' threshold may display an unattainable number such as21
when only increments of5 are possible. Verify the rules and fix with focused
tests before final browser acceptance. Do not change rules or scoring to fit UI.
Last selected appearance, safe areas and optical centering also need final pixels.

Next: obtain authorization to push the isolated review branch and execute the
prepared browser CI, or continue in a browser-capable development workspace.
Inspect source and run actual gameplay; fix/rerun affected tests; then create
ONE descriptive complete playable ZIP with root index.html, exact manifest,
CRC/SHA256, screenshots and notes. No live deployment without explicit approval.

Permanent authorities: foundational Bank H section3 in full; chronological
H-through-current Brain reading; owner-approved artwork and protected gameplay;
actual rendered game screenshots before UI delivery; no CSS material substitutes;
no browser/service-worker data clearing; rollback preservation; successor rules
are copied verbatim in SUCCESSOR_RULES.txt and must be passed forward again.
