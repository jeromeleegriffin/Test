# Griffin House of Rooks — Cloudflare-only runtime migration
Date: 2026-10-21
Status: FULL ASSETS DEPLOYED IN ISOLATED CLOUDFLARE STAGING; STATIC RESPONSES VERIFIED; PRIVATE SESSION GATE MISSING; NOT PROMOTED LIVE

## Owner-approved scope
Run the complete R10 game and existing Online X1 v2 directly from Cloudflare Workers Static Assets with zero GitHub runtime fetches. Preserve 1:1 approved landing screen, artwork, numbered cards, premium birds, sounds/voices, game rules, saved room behavior and rollback. Keep GitHub as version-controlled source only.

## Immutable source and prepared bundle
- Pinned approved native source: 90078a710948c7643caafb18986e34dc71ce7cee
- Repair branch: work/asset-recovery-20261021, `asset-loading772.js` weak-cellular recovery from preserved candidate
- Cloudflare staging build entry: coordination/qa/cloudflare-native-build.sh
- Source staging/package builder: coordination/qa/build-cloudflare-static.mjs
- Stage Wrangler config: wrangler.cloudflare-only-stage.jsonc
- Runtime package: 1,634 immutable approved files, 211.05 MiB. Existing 1,472 service worker dependency paths verified. Public static-asset directory holds assets only; private manifest and Worker bundle stay outside web root.
- Compiled X1 v2 Worker: cloudflare/live/worker-live.mjs, precisely two pinned index-html GitHub fetches and one asset fetch substituted with env.ASSETS.fetch, preserving all other HTTP/rooms/AI logic. Unreachable CommonJS require('./core.js') guard resolved to the existing Worker global X1 core. No raw.githubusercontent.com reference in staged Worker.
- Wrangler 4.151.3 dry-run on complete Worker/static bundle PASSED; 1,805 assets discovered, Durable Object ROOMS stage binding, stage rate limit bindings, Static Assets binding all valid.
- CI evidence for full bundle/dry-run: https://github.com/jeromeleegriffin/Test/actions/runs/39680928523

## Cloudflare-native staging deployment COMPLETED
No GitHub Actions API token secret needed after all: the account already had a Cloudflare Builds token.
- Connected Cloudflare Builds repository: JeromeLeeGriffin/Test public repository, repo connection UUID 3539cef8-e3cb-457d-9603-58e30953d0ed
- Native Cloudflare Builds token reference (UUID, not secret text): 35032769-b76e-4044-856d-0ccb1de70c5b
- Stage script: griffin-rooks-cloud-only-stage (tag 3831f5ceef1b411283717ef15c4498a9), not the live script
- Cloudflare-native build trigger a13fb065-ee22-4873-ad38-e6ac89e09891, limited to isolated work branch
- First full native build 28060e65-1598-4213-aaf7-3a1ca804df4e completed successfully and uploaded assets, staging worker version c2f303fd-7970-4abe-ba07-bc7bdbcc7966
- Second native build 01458bc3-09ad-41e5-a233-000d44e1d3a2 successful with security config `workers_dev:false, preview_urls:false`
- Current isolated stage deployment ID 0a460826-85b4-4ef8-a651-c19814ff0464 and version 1c1505b2-c6b1-4914-bd0b-aa50c7f2cd9b at 100% internally
- Stage workers.dev hostname and preview URLs are both DISABLED. No public access until gate/QA.
- Stage ROOMS Durable Object namespace 73951bbcd9264dd2b5ca1db9b0ac67f7, separate from live namespace bb1bf1c32b68451cbe5db6fee3066fa0. Separate rate-limiter namespaces also.
- GitHub Actions is now package/dry-run only, with obsolete manual-deploy-token steps removed. Cloudflare Builds deploys staging; this preserves one staging deployment authority.

## Real hosted static asset tests PASSED
https://github.com/jeromeleegriffin/Test/actions/runs/39685077430
Real GET requests to deployed stage served:
- asset-loading772.js (16250 bytes, text/javascript, repaired CSS recovery code present)
- approved-bid-portrait.css (7144 bytes, text/css)
- premium Black Bird RookPremium.png (860782 bytes, image/png)
- premium Red Two Red2Premium.png (705411 bytes, image/png)
- numbered red-10 card.png (379378 bytes, image/png)
- original index.html (109629 bytes, text/html, original solo button)
- cloudflare-entry.js (3051 bytes, text/javascript)
- Jerome trump voice .ogg (12074 bytes, audio/ogg)
- No game room/API mutations made by staging static QA.
- Stage root `/` currently returns HTTP 500 because TEST_GATE_KEY (needed by the existing private-session path) is not installed. Never call complete game QA passed; root, offline play and multiplayer await this gate.

## One remaining user-controlled security action
The authorized Cloudflare tool blocked an attempt to set the needed Worker secret. A subsequent read of staging secrets showed no secrets and no TEST_GATE_KEY. Do NOT claim we can silently set this.

User must open Cloudflare dashboard > Workers & Pages > **griffin-rooks-cloud-only-stage** > Settings > Variables and Secrets > Add. Select **Secret**, name exactly `TEST_GATE_KEY`, generate a unique cryptographically random long value (at least 32 random bytes / 64 hex chars using a trusted password manager/generator), and select Deploy. Do NOT copy any production secret. Do NOT paste secret into ChatGPT, GitHub or project files.

After user says this is saved, assistant should verify secrets list (name only), then enable only stage Workers.dev address through Cloudflare API and test:
- stage root 200 with original R10 landing; no duplicate navigation/asset fetch and no GitHub runtime dependence
- offline 10-card hand and images/audio/Bid Box native UI
- guarded multiplayer Cloudflare-native POST /rooms / invite/reconnect/X1 v2 using isolated stage namespace, without modifying production
- weak cellular image and stylesheet recovery on real Android
- rollback exact original production Worker version; do NOT deploy live before acceptance.

## Live release still untouched
Production online Worker griffin-house-of-rooks-online version f9fd3cd5-67a1-49ae-850d-7c2ca60c1ad7, deployment a319e805-c76c-462b-a18b-c59498a188d9 at 100%, subdomain enabled.
Live GitHub game sites, user rooms, caches, and Cloudflare X1 v2 remain unchanged. Prior isolated artwork preview site also unchanged.
