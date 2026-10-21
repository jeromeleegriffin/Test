# Griffin House of Rooks — FULL CLOUDFLARE STATIC ASSETS MIGRATION CHECKPOINT
Date: 2026-10-21
Status: STATIC_PACKAGE_AND_WRANGLER_DRY_RUN_PASS; ISOLATED_PLACEHOLDER_CREATED; CI_DEPLOY_AUTH_NOT_CONFIGURED
Authority: original approved native R10 assets from immutable commit 90078a710948c7643caafb18986e34dc71ce7cee; preserved full online X1 v2 Worker source; approved weak-cellular asset-loading772.js repair retained only in candidate.

## Goal / non-negotiables
- Fully Cloudflare-hosted R10, including 1:1 approved game entry HTML, images, sprites, high-DPI cards, all audio and voices, CSS, JS, and Cloudflare Durable Objects/X1. Avoid all GitHub runtime fetches.
- One Cloudflare address, original approved landing, no double game load, no iframe/new chooser, no CSS fake artwork.
- Existing live workers, GitHub Pages, rooms, X1 behavior, rate limit state and service workers remain protected.
- Keep GitHub as source/version-control backup, *not* a runtime asset origin.

## Completed work
1. Added pinned immutable package builder: coordination/qa/build-cloudflare-static.mjs
2. Added exact static-assets Worker stage config: wrangler.cloudflare-only-stage.jsonc
3. Added guarded same-origin stage Chromium smoke: coordination/qa/cloudflare-only-stage-smoke.mjs
4. Added audited staged/dry-run GitHub Action: .github/workflows/cloudflare-static-package.yml
5. Exact self-contained cloudflare-dist/public/cloud-game/assets package in CI: **1,634 files / 211.05 MiB**. Every one of 1,472 native SW SHELL paths matched. All files under 25 MiB; root index.html intact; original visual assets unchanged.
6. The candidate Worker is the preserved full online X1 v2 worker with exactly two pinned GitHub index.html fetches and the single pinned GitHub asset proxy replaced by env.ASSETS.fetch. An unreachable CommonJS require('./core.js') branch was normalized to its existing Worker-global X1Core path to enable Wrangler bundling; no AI algorithm changed. Candidate worker has **no raw.githubusercontent.com reference**, passes node --check.
7. Cloudflare Wrangler v4.151.3 full dry-run SUCCESS. Detects 1,805 entries from public directory, packs Worker 252.62 KiB (gzip 65.24 KiB), confirms separate staging bindings ROOMS (RoomDO), ENTRY_LIMIT, ACTION_LIMIT, ASSETS, ALLOW_TEST_FIXTURES.
8. Verified GitHub Actions:
   - Initial package success: https://github.com/jeromeleegriffin/Test/actions/runs/39680190239
   - Full Static Assets plus isolated Durable Object Wrangler dry-run success: https://github.com/jeromeleegriffin/Test/actions/runs/39680928523
   - Gated stage attempt, all preflight checks success and deployment skipped for missing GitHub secret: https://github.com/jeromeleegriffin/Test/actions/runs/39681686573
9. Created a separate, inert Cloudflare Worker name **griffin-rooks-cloud-only-stage** for future deployment; workers.dev route and preview URLs are both DISABLED; no room namespace, game, or assets deployed to it. This makes it possible to scope a future upload token narrowly to a staging Worker.
10. The GitHub Action automatically installs an independently randomly generated TEST_GATE_KEY when staging deployment is authorized. User needs only one GitHub Actions secret: CLOUDFLARE_API_TOKEN.

## Verified blocker and precise next user action
The GitHub Actions job does not have the required CLOUDFLARE_API_TOKEN repository secret. The current authorized Cloudflare ChatGPT connection can deploy JS via the Cloudflare API, but cannot transfer the 211-MiB CI-generated static asset bundle into Wrangler. Do not claim the full migration has occurred.

The repository owner must, **outside this chat**, create a scoped Cloudflare API token with permission to edit/deploy the staging Worker 'griffin-rooks-cloud-only-stage' (plus static assets as required), and add that value as a GitHub Actions repository secret exactly named 'CLOUDFLARE_API_TOKEN' in JeromeLeeGriffin/Test > Settings > Secrets and variables > Actions. NEVER paste the token into chat, files, commits, or screenshots. The Cloudflare account ID is configured in workflow (non-secret); account 0538bb3699997fa27a701684074b1126.

When user confirms token is configured, trigger work/asset-recovery-20261021 workflow and verify the isolated stage deployment end to end: indexed assets, actual premium art bytes / proper MIME, original landing, 1x network/URL, regular offline R10 hand, guarded Play With Friends same-origin request, X1 private room state/reconnect, no GitHub runtime dependence, production untouched. Then only with owner approval prepare controlled promotion to original live Worker and rollback plan.

## Explicit current live and staging status
Current production multiplayer Worker griffin-house-of-rooks-online version f9fd3cd5-67a1-49ae-850d-7c2ca60c1ad7, deployment a319e805-c76c-462b-a18b-c59498a188d9 at 100%, retained unchanged.
Prior Android isolated artwork-recovery test Worker griffin-rooks-art-recovery-test untouched and retains approved landing.
R2 is not enabled for Cloudflare account (API GET returned 403 with 'Please enable R2'); R2 is NOT required for this migration, use Workers Static Assets.
No new game live deployment occurred in this work. The user mentioned unrelated dictated text after 'continue'; not part of the game requirements.

## Audit cautions
The staging Worker initially has no TEST_GATE_KEY, so public endpoints should remain disabled until the safe gated deploy/secret-install sequence. The config has separate stage-rate-limit namespace IDs and a newly declared stage RoomDO, not the live namespace. Wrangler dry-run proves build/config shape, NOT operational multiplayer functionality or first-load speed, and the isolated stage must be tested before any promotion.
