# Cloudflare speed and gameplay audit — 2026-10-20

Current beta: https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/

Continue this work; do not restart or replace approved assets. Owner authorized continued online beta before physical Android/cellular testing. Original mission and preservation rules remain in force. Master Brain AF history was not changed. Never deploy to the protected original private Workers, Pages games or production repository.

## Exact release

- Repository: jeromeleegriffin/Test; branch work/cloudflare-846-native-adapter-20261019.
- Code commit: 6a6e88d163831d6fbcc6d9785c0d6a461eba0526; parent be18381b0c2ead0e5949526b1602f7f1b298e875 was rechecked before edits.
- Worker: griffin-house-of-rooks-online; version 0ddb4c03-6920-455a-aea5-4b16cd0ba766; deployment 9ddb0b7b-20e5-4ce6-b8c0-bee8b914644e. Exact deployed source readback matched the candidate. All completed hosted runs below used this version, with no intervening code update.
- Existing RoomDO namespace bb1bf1c32b68451cbe5db6fee3066fa0 and signing secret preserved. Rate bindings retained. No migrations or room reset.
- Immutable approved runtime assets remain pinned to b3f3928548bc79df5169165b953e458cc68ddc09 / 846-complete-repairs-20261019. No landscape, artwork, offline source or production changes.

## Reproduced causes and fixes

1. Native pace buttons changed the browser while the server used fixed timers. Host pace now persists in the room and synchronizes to every player. Guests cannot change the shared pace and their personal saved preference is preserved. Delays scale at 1×/3×/MAX, with safety minimums for native stamp and capture. A pace change reschedules a pending bot turn; an already-running presentation finishes without interruption.
2. Skip effect was explicitly removed from the native end-hand effect before first paint. Automatic reveal and completion remain intact.
3. Accepting a guaranteed lay-down skipped the native cards and went directly to score. The server now publishes a temporary claim presentation with the claimant's cards, masks summary/winner and other hands until it ends, rejects early commands, and preserves idempotency. Native approved animation runs. Final summary includes the intended hand reveal.
4. A same-hand redeal reused its earlier animation identity and could wait for the25-second fallback. Each opening now has a UUID. The native deal owner and acknowledgement include it; stale supplied IDs are rejected. Missing IDs remain supported for older clients. Actual all-pass server actions and rendered same-hand redeal were tested.

## Completed evidence on this release

Three hosted rendered full matches: 7 hands, 195 recorded human actions, 15 reload/reconnect checks, zero page JavaScript errors. Native controls drove all actions, including nest pickup/discard, trump, legal play, scoring and next-hand transitions.

```json
{
  "audit-1x-hosted": {
    "results": [
      {
        "humans": 2,
        "target": 100,
        "hands": 1,
        "actions": 24,
        "reconnects": 3,
        "final": "Team A",
        "scores": [
          70,
          -195
        ]
      }
    ],
    "errors": []
  },
  "audit-3x-hosted": {
    "results": [
      {
        "humans": 4,
        "target": 100,
        "hands": 1,
        "actions": 47,
        "reconnects": 3,
        "final": "Team A",
        "scores": [
          190,
          -195
        ]
      }
    ],
    "errors": []
  },
  "audit-max-hosted": {
    "results": [
      {
        "humans": 2,
        "target": 500,
        "hands": 5,
        "actions": 124,
        "reconnects": 9,
        "final": "Team B",
        "scores": [
          -625,
          350
        ]
      }
    ],
    "errors": []
  }
}
```

Separate local rendered matches: 1× two humans/two bots (1hand24actions3reconnects); 3× four humans (1hand46actions3reconnects); MAX two humans/two bots (3hands74actions9reconnects). Total5hands144actions15reconnects. Do not count these as hosted.

Service regression:10matches,2,054actions,351secure reconnect checks, accelerated clock. Twelve targeted service test files passed: bot picker, claim, close, collection, deal, invalid actions, pace, rare rules, redeal, sequence, single seat and trump. Invalid-action follow-suit rejection was added and rerun after the aggregate receipt was produced; it passed. Node-only service tests read the candidate Worker and do not need browsers.

Controlled local actual-rendering scenes: final Black Bird/Red Two capture with bird arriving fourth at1×/3×/MAX, one fight completion/no cancellation and real canvas draws; automatic end-hand effects/no Skip control; accepted lay-down at all3speeds; same-hand redeal; Moon selection requires explicit confirmation, one howl, no replay on reload; Moon success500 and failure from negative scores−500/10 rendered correct winners. Reload during final bird collection preserved seat, own hand and player identities and reached scoring. Manufactured endpoints exist ONLY in the local fixture server and were never deployed.

Moon rules: all counters win even after losing a zero-point trick; lost counter fails; negative scores supported; all-pass redeal and forced-dealer option. Human hands remain disjoint and private. Invalid bid/discard/trump/card, wrong player, stale and duplicated/reused command, unauthorized token and claim/collection locks covered.

Hosted presentation: native stamp1954ms, first card3844ms; two individually paced bot cards; nine nonzero bot voice buffers and actual voice-queue starts; no stale Picking trump status in play. This verifies decoding/queueing, not physical speaker output.

Hosted QR/share/close regression: QR decoded to exact invitation, invitation prefilled room, guest joined, host close notified both, old credentials cleared, a distinct new table created; no page errors. OS share sheet was intercepted in automation; a physical QR camera/Android share sheet was not tested. Hosted security passed11checks including sessions/tokens, four distinct private hands, one-use socket tickets, changed-command ID reuse and cross-origin writes.

## Failed attempts and test limitations

Early hosted MAX/3× runs timed out at the automation30-second full-load navigation deadline or had repeated asset-fetch failures. They are NOT counted as passes. Test transport now waits for DOM plus actual game ready, bounds concurrent asset fetches and caches only successful immutable assets per browser context. No room mutation retry, security bypass or product code change was used to resolve transport load. Completed1× hosted run recovered from one failed snapshot fetch. Early local MAX run was stopped to add tracing and its completed rerun is counted. Full logs retained.

All browser tests used desktop Chromium with mobile viewports and independent contexts. No physical Android, independent cellular, production-scale load or physical audio certification. Bots remain simple server test bots, NOT X1. This is a stronger beta, not exhaustive certification of every possible game state. Recommend continued authorized beta; physical-device/network and broader load checks before broad production promotion.

## Files and reproducibility

Code changes: cloudflare/live/adapter-live.js, build-live.py, worker-live.mjs, pace-unit.mjs, claim-unit.mjs, redeal-unit.mjs, rare-rules-unit.mjs, invalid-actions-unit.mjs, plus cloudflare/rollback/worker-live-before-pace-20261020.mjs. Portable builder reproduced the generated Worker byte for byte.

Run Node-only tests from the repository: `node cloudflare/live/pace-unit.mjs` (and each other `*-unit.mjs`); `node cloudflare/live/protocol-regression.mjs`. Browser harnesses and workspace-relative local fixture are retained under cloudflare/live/tests for recovery. They require Playwright/Chromium, ws, https-proxy-agent, pngjs/jsqr, the pinned runtime checkout and the documented transport setup. Synthetic local fixtures never belong in a deployed Worker. Human identities/tokens and signing secrets must not be printed or committed.

Actual screenshots and all earlier release history are preserved in the comprehensive saved HTML report, retaining its existing identity. New source/evidence is on this branch, not main. Earlier handoffs remain historical; this section is the current state.

## Rollback and protected resources

Rollback only the online beta to Worker0d499a95-f2fc-4a7f-8308-cec8215bda44 at100%. Exact previous source: cloudflare/rollback/worker-live-before-pace-20261020.mjs, preserved byte-for-byte. Preserve namespacebb1bf1c32b68451cbe5db6fee3066fa0, rate bindings and signing secret. Do not reset data or migrate namespace. The additional pace/opening/claim properties are additive; a rollback can abandon an active visual hold, so prefer finishing test tables before rollback.

Protected original griffin-room-local-poc: version7e57f6f5-9524-4456-96d2-379f406b2d01, namespace4a45f65563174df6847cd5576973088a. Protected griffin-room-846-private-20261020: version5cfd6814-3b3b-4916-80e6-1633a7d4449a, namespace5b0de759387647e2b07361c360fa89ff. Neither was changed. Their private gate secrets were not changed. Never use either as the target for this beta's rollback.
