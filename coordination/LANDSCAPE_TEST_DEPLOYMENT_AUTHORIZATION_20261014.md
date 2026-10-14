# Landscape Test deployment authorization

Owner Jerome Griffin, October 14, 2026, 17:33 EDT:

> You can go ahead and deploy. You don't have to make a zip. You can go ahead and deploy to the test server.

This explicitly supersedes the landscape-only ZIP/no-Test-publication restriction in PRE_LANDSCAPE_FALLBACK_20261014.md, MASTER_CONTROL.md and the registry's preLandscapeFallback.landscapePolicy. Test deployment is authorized; a ZIP is not required. Production remains protected. Preserve rollback/pre-landscape-20261014 and portrait behavior.

Current isolated C checkpoint: afb22bf5fd95afc92cfef124029963edd19e8ad7 on work/overhead-landscape-20261014. It is a placement study, NOT a complete playable integration. Five landscape-size trump checks passed. Real game state, selectable character artwork, and full-game regression integration remain unfinished. Authorization does not establish release readiness. No runtime deployment was performed by this documentation commit.

Next: finish isolated playable integration, run targeted regression checks, then deploy to Test and verify served files. Do not replace the playable root with the placement-study harness. No further routine deployment approval is required for this authorized scope.
