#!/usr/bin/env bash
set -euo pipefail
# Cloudflare Builds checks out only the isolated development branch.
# Rehydrate exactly the approved R10 source from immutable SHA before packaging.
SOURCE_COMMIT=90078a710948c7643caafb18986e34dc71ce7cee
node coordination/qa/human-moon-policy-unit.mjs
node coordination/qa/room-auction-unit.mjs
mkdir -p cloudflare-approved-src
git -C cloudflare-approved-src init -q
git -C cloudflare-approved-src remote add origin https://github.com/JeromeLeeGriffin/Test.git
git -C cloudflare-approved-src -c protocol.version=2 fetch -q --depth=1 origin "$SOURCE_COMMIT"
git -C cloudflare-approved-src checkout -q --detach FETCH_HEAD
test "$(git -C cloudflare-approved-src rev-parse HEAD)" = "$SOURCE_COMMIT"
node coordination/qa/build-cloudflare-static.mjs cloudflare-approved-src . cloudflare-dist
node --check cloudflare-dist/worker-cloud-only.mjs
node -e "const fs=require('fs');const m=JSON.parse(fs.readFileSync('cloudflare-dist/audit/release-manifest.json','utf8'));if(m.assetCount<1600||m.checkedShellDependencies!==1472||m.fetchedFromGitHubAtRuntime||!m.noLiveDeploy)process.exit(1);console.log('APPROVED R10 CLOUDFLARE-ONLY PREPARED',m.assetCount,m.assetBytes)"

