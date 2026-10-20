# Isolated Cloudflare 846 verification

This directory preserves executable checks and their actual receipts. No public runtime uses these files.

Node 24 is used. Browser harnesses require Playwright; live WebSockets use ws and https-proxy-agent. Use an installed Chromium or set CHROMIUM_EXECUTABLE. In the original environment, Playwright browser archives were unavailable; @sparticuz/chromium 153.0.0 from npm supplied a working binary. Its Brotli payloads were unpacked with Node zlib and tar --no-same-owner because archive ownership operations are unsupported here.

Run from a writable temporary output directory with the harness files copied together (or change cwd to this folder). Do not commit private access keys. Live checks accept GHR_PRIVATE_GATE or GHR_PRIVATE_GATE_FILE. They target only griffin-room-846-private-20261020, never the original Worker.

- `node candidate-unit.mjs`: rules, negative-score Moon, Moon made/miss scoring, metadata and rule options.
- `node protocol-tests.mjs`: original preserved server regression. This tests the old deployed RoomService in structured-clone storage, not a Cloudflare instance.
- `node local-server.mjs` and `UI_TARGET=100 node ui-full.cjs`: native rendered game against the candidate service. Server and browser must share a network namespace in the restricted execution environment. The local server deliberately uses a different internal room ID from the user-facing code.
- `UI_TARGET=100 UI_DELAY=1500 node ui-full.cjs`: delay accepted play HTTP responses while real-time snapshots continue. This verifies the pending-input queue.
- `node ui-offline-smoke.cjs`: the private game copy retains ordinary offline authority, working bot responses and the native menu.
- `node moon-ui.cjs`: selecting the ceiling does not submit; explicit confirmation submits once; howl occurs once and stays quiet after reload.
- `node live-protocol.mjs`: repeated real Cloudflare 500-point matches, credential rejoins, private-hand checks, stale/duplicate actions and real WebSocket reconnects.
- `node live-security.mjs`: gate/seat authorization, wrong player, changed action replay and one-use socket ticket checks.
- `UI_TARGET=100 node cloud-ui-full.cjs`: same real native UI against the hosted Worker. The test target is set through the start request as a declared test fixture; other actions use native buttons and cards.

The hosted browser harness uses Node's verified HTTPS transport and real upstream WebSockets because this Chromium does not have the execution environment's proxy CA installed. It retains TLS verification, Worker headers and CSP; no ignore-HTTPS-errors or certificate bypass is used. This bridge is a test transport, not a claim of physical Android or independent cellular networks.

Private bots remain the recovered simple test policy. X1/Sol7 browser integration and offline-only EPA were inspected but not ported into RoomDO. No X1 server claim is made.

The Worker source is generated from deployed-worker.snapshot.mjs plus the isolated adapter by ../build-candidate.py. It pins approved game assets to b3f3928548bc79df5169165b953e458cc68ddc09. No runtime files or artwork at the public root are changed.
