#!/usr/bin/env bash
set -euo pipefail
set +x
: "${GHR_TEST_GATE_KEY:?Cloudflare build secret GHR_TEST_GATE_KEY is required}"
secret_file="$(mktemp)"
cleanup(){ rm -f "$secret_file"; }
trap cleanup EXIT
chmod 600 "$secret_file"
node - "$secret_file" <<'NODE'
const fs = require('node:fs');
const target = process.argv[2];
const value = process.env.GHR_TEST_GATE_KEY;
if (typeof value !== 'string' || value.length < 32) throw new Error('Build test gate secret is unavailable or too short');
fs.writeFileSync(target, JSON.stringify({ TEST_GATE_KEY: value }), { mode: 0o600 });
NODE
npx --yes wrangler@4 deploy --config wrangler.cloudflare-only-live.jsonc --secrets-file "$secret_file"
