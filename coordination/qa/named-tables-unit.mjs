import fs from 'node:fs';
import assert from 'node:assert/strict';
import { database } from '../../cloudflare/live/x1-full/test-harness.mjs';
process.on('uncaughtException', (e) => {
  console.error(e.name, e.message);
  console.error(
    String(e.stack)
      .replace(/data:text[^\s]+/g, '[worker module]')
      .slice(0, 1800)
  );
  process.exit(1);
});
const source =
  fs
    .readFileSync(new URL('../../cloudflare/live/worker-live.mjs', import.meta.url), 'utf8')
    .replace(
      'import { DurableObject } from "cloudflare:workers";',
      'class DurableObject {constructor(ctx,env){this.ctx=ctx;this.env=env;}}'
    ) + '\nexport {roomNamePrefix,namedRoomCodes,createNamedRoom,issuePrivateSession};';
const api = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
for (const [name, prefix] of [
  ['Jerome Griffin', 'JER'],
  ['Rita', 'RIT'],
  ['José', 'JOS'],
  ['Al', 'ALX'],
  ['Q', 'QXX'],
  ['123', 'TAB'],
  ['李', 'TAB'],
])
  assert.equal(api.roomNamePrefix(name), prefix);
const candidates = [...api.namedRoomCodes('Jerome', () => 42)];
assert.equal(candidates[0], 'JER42');
assert.equal(candidates.length, 24);
assert.equal(new Set(candidates).size, 24);
assert(candidates.every((x) => /^JER\d{2,4}$/.test(x)));
const rooms = new Map(),
  stores = new Map();
const namespace = {
  getByName(name) {
    if (!rooms.has(name)) {
      const storage = database();
      stores.set(name, storage);
      rooms.set(
        name,
        new api.RoomDO({ id: { toString: () => name }, storage, getWebSockets: () => [] }, {})
      );
    }
    return { fetch: (input, init) => rooms.get(name).fetch(new Request(input, init)) };
  },
};
const env = {
  ROOMS: namespace,
  TEST_GATE_KEY: 'test-named-tables-secret',
  ENTRY_LIMIT: { limit: async () => ({ success: true }) },
  ACTION_LIMIT: { limit: async () => ({ success: true }) },
};
const body = (i) => ({ playerId: 'named-tables-host-' + i, displayName: 'Jerome', pace: 99 });
// Real RoomDO serializes competing reservations; loser retries a new number.
const created = await Promise.all([
  api.createNamedRoom(env, body(1), ['JER42', 'JER79']),
  api.createNamedRoom(env, body(2), ['JER42', 'JER79']),
]);
assert(created.every((r) => r.status === 201));
const hosts = await Promise.all(created.map((r) => r.json()));
assert.equal(new Set(hosts.map((h) => h.roomCode)).size, 2);
assert.deepEqual(new Set(hosts.map((h) => h.roomCode)), new Set(['JER42', 'JER79']));
const original = structuredClone(await stores.get('JER42').get('JER42'));
const next = await (await api.createNamedRoom(env, body(3), ['JER42', 'JER79', 'JER16'])).json();
assert.equal(next.roomCode, 'JER16');
assert.deepEqual(await stores.get('JER42').get('JER42'), original);
const cookie = 'GHR-Online-v1=' + (await api.issuePrivateSession(env.TEST_GATE_KEY)).token;
const host42 = hosts.find((h) => h.roomCode === 'JER42');
async function request(path, method = 'GET', body, token) {
  return api.default.fetch(
    new Request('https://unit.invalid' + path, {
      method,
      headers: {
        Origin: 'https://unit.invalid',
        Cookie: cookie,
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    }),
    env
  );
}
let r = await request('/rooms/jer42/snapshot', 'GET', undefined, host42.token);
assert.equal(r.status, 200);
assert.equal((await r.json()).players[0].name, 'Jerome');
r = await request('/rooms/JER42/join', 'POST', {
  playerId: 'named-tables-guest',
  displayName: 'Guest',
});
assert.equal(r.status, 201);
const guest = await r.json();
assert.equal(guest.seat, 1);
r = await request('/rooms/JER42/join', 'POST', {
  playerId: 'named-tables-guest',
  displayName: 'Guest',
  resumeToken: guest.token,
});
assert.equal((await r.json()).token, guest.token);
const legacy = await (
  await namespace
    .getByName('ABCDEFGH')
    .fetch(
      new Request('https://room.local/create', { method: 'POST', body: JSON.stringify(body(4)) })
    )
).json();
r = await request('/rooms/ABCDEFGH/snapshot', 'GET', undefined, legacy.token);
assert.equal(r.status, 200);
r = await request('/rooms/JER42/close', 'POST', {}, host42.token);
assert.equal(r.status, 200);
const afterClosed = await (await api.createNamedRoom(env, body(5), ['JER42', 'JER53'])).json();
assert.equal(afterClosed.roomCode, 'JER53');
assert.equal((await stores.get('JER42').get('JER42')).status, 'closed');
let tries = 0;
const congested = {
  ROOMS: {
    getByName(code) {
      return {
        fetch: async () => {
          tries++;
          return /^JER\d{2}$/.test(code)
            ? Response.json({ error: 'ROOM_EXISTS' }, { status: 409 })
            : Response.json({ roomId: code, seat: 0, token: 'ok' }, { status: 201 });
        },
      };
    },
  },
};
r = await api.createNamedRoom(
  congested,
  body(6),
  api.namedRoomCodes('Jerome', () => 0)
);
assert.equal((await r.json()).roomCode, 'JER000');
assert.equal(tries, 9);
tries = 0;
const full = {
  ROOMS: {
    getByName() {
      return {
        fetch: async () => {
          tries++;
          return Response.json({ error: 'ROOM_EXISTS' }, { status: 409 });
        },
      };
    },
  },
};
r = await api.createNamedRoom(
  full,
  body(7),
  api.namedRoomCodes('Jerome', () => 0)
);
assert.equal(r.status, 503);
assert.equal(tries, 24);
let failures = 0;
r = await api.createNamedRoom(
  {
    ROOMS: {
      getByName() {
        return {
          fetch: async () => {
            failures++;
            return Response.json({ error: 'INVALID_PACE' }, { status: 400 });
          },
        };
      },
    },
  },
  body(8),
  ['JER42', 'JER79']
);
assert.equal(r.status, 400);
assert.equal(failures, 1);
console.log(
  JSON.stringify({
    namePrefixes: true,
    uniqueBoundedCandidates: 24,
    atomicConcurrentReservation: true,
    collisionRetries: true,
    existingRoomsUnchanged: true,
    closedCodesProtected: true,
    shortAndLegacyRoutes: true,
    caseInsensitive: true,
    guestRejoin: true,
    congestionFallback: true,
    boundedExhaustion: true,
  })
);
