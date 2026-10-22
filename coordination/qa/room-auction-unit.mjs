import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { api, database, players } from '../../cloudflare/live/x1-full/test-harness.mjs';
let checks = 0;
// Maximum legal bid ends immediately; it does not turn a normal bid into Moon.
for (const includeRed2 of [true, false])
  for (const enabled of [true, false])
    for (let seat = 0; seat < 4; seat++)
      for (const bot of [false, true]) {
        const roster = players.map((p, i) => ({ ...p, isBot: i === seat ? bot : false }));
        const s = api.createMatch(
          roster,
          { includeRed2, shootMoonEnabled: enabled, misdealOnNoCounters: false },
          { dealer: (seat + 3) % 4 }
        );
        s.currentPlayer = seat;
        const cap = api
          .makeDeck(s.settings.rules)
          .reduce((n, c) => n + api.cardPoints(c, s.settings.rules), 0);
        const before = s.hands[seat].length + s.nest.length,
          result = api.submitBid(s, seat, cap);
        if (enabled && bot) {
          assert.equal(result.accepted, false);
          assert.equal(result.reason, 'BOT_MOON_FORBIDDEN');
          checks += 2;
          continue;
        }
        assert(result.accepted);
        assert.equal(result.state.phase, 'discard');
        assert.equal(result.state.currentPlayer, seat);
        assert.equal(result.state.shotTheMoon, enabled);
        assert.equal(result.state.hands[seat].length, before);
        assert.equal(result.state.matchResult, null);
        assert.equal(api.submitBid(result.state, (seat + 1) % 4, 0).reason, 'NOT_BIDDING');
        checks += 7;
        const lower = api.submitBid(s, seat, cap - 5);
        assert(lower.accepted);
        assert.equal(lower.state.phase, 'bidding');
        checks += 2;
      }
// Run the actual native reducer with side effects stubbed; no further prompt/pass after cap.
const native = fs.readFileSync(new URL('../../game060.js', import.meta.url), 'utf8');
const start = native.indexOf('function hostProcessBid('),
  end = native.indexOf('\n/** Plain-text card name', start);
assert(start > 0 && end > start);
for (const cap of [180, 200])
  for (const enabled of [false, true])
    for (let seat = 0; seat < 4; seat++) {
      let finished = 0,
        prompts = 0,
        advanced = 0;
      const game = {
        phase: 'bidding',
        currentPlayer: seat,
        highestBid: 95,
        bidder: -1,
        careerMatchId: 'unit',
        scores: [0, 0],
      };
      const context = {
        game,
        players: players.map((p) => ({ ...p, isBot: false })),
        minBid: 100,
        shootMoonEnabled: enabled,
        handHistory: [],
        nestAuctionLocked: () => false,
        horRememberAction: () => false,
        hasPassedBid: () => false,
        auctionHigh: () => game.highestBid,
        maxBid: () => cap,
        isShootMoonBid: (v) => enabled && v === cap,
        moonBidAllowed: () => true,
        clearTurnTimer() {},
        $: () => null,
        broadcast() {},
        playSfx() {},
        botMaybeTableTalk() {},
        noteHumanAuction() {},
        window: { HORMoonHowl: { play() {} } },
        countPassedBids: () => 0,
        finishBidding() {
          game.phase = 'discard';
          finished++;
        },
        hostPromptBid() {
          prompts++;
        },
        nextActiveBidder() {
          advanced++;
          return true;
        },
        broadcastState() {},
      };
      vm.createContext(context);
      vm.runInContext(native.slice(start, end), context);
      context.hostProcessBid({ player: seat, value: cap });
      assert.equal(game.phase, 'discard');
      assert.equal(game.shotTheMoon, enabled);
      assert.equal(finished, 1);
      assert.equal(prompts, 0);
      assert.equal(advanced, 0);
      context.hostProcessBid({ player: seat, value: 0 });
      assert.equal(finished, 1);
      checks += 6;
    }
// Deterministic sampling exercises different pool positions, uniqueness and idempotency.
const rosters = new Set();
for (let seed = 0; seed < 12; seed++) {
  const db = database();
  let sampled = 0;
  const service = new api.RoomService(db, {
    tokenFactory: () => 'host-token',
    randomIndex: (n) => {
      sampled++;
      return seed % n;
    },
  });
  await service.create('fill-' + seed, 'host', 'Host', 'jerome_founder');
  await service.fillOpenSeatsWithBots('fill-' + seed, 'host-token');
  const r = await db.get('fill-' + seed);
  assert.equal(sampled, 3);
  assert.equal(new Set(r.seats.map((p) => p.avatar)).size, 4);
  assert.equal(new Set(r.seats.map((p) => p.displayName)).size, 4);
  assert(r.seats.slice(1).every((p) => p.isBot));
  rosters.add(
    r.seats
      .slice(1)
      .map((p) => p.displayName)
      .join('|')
  );
  const revision = r.revision;
  await service.fillOpenSeatsWithBots('fill-' + seed, 'host-token');
  assert.equal((await db.get('fill-' + seed)).revision, revision);
  checks += 5;
}
assert.equal(rosters.size, 12);
checks++;
{
  const db = database();
  let id = 0;
  const service = new api.RoomService(db, {
    tokenFactory: () => 'token-' + ++id,
    randomIndex: (n) => n - 1,
  });
  const host = await service.create('partial', 'host', 'Host', 'jerome_founder');
  const guest = await service.join('partial', 'guest', 'Guest', null, 'rita');
  let room = await db.get('partial');
  await service.setBotSeat('partial', host.token, {
    seat: 2,
    name: 'Ember',
    expectedRevision: room.revision,
  });
  room = await db.get('partial');
  const kept = structuredClone(room.seats.slice(0, 3));
  await service.fillOpenSeatsWithBots('partial', host.token);
  const filled = await db.get('partial');
  assert.deepEqual(filled.seats.slice(0, 3), kept);
  assert.equal(new Set(filled.seats.map((p) => p.avatar)).size, 4);
  await assert.rejects(service.fillOpenSeatsWithBots('partial', guest.token), /HOST_ONLY/);
  checks += 3;
}
const css = fs.readFileSync(new URL('../../trump714.css', import.meta.url), 'utf8');
assert(!css.includes('@keyframes tc-ink-press'));
assert(!css.includes('--ink-glow'));
assert(css.includes('brightness(var(--ink-shade))'));
checks += 3;
console.log(
  JSON.stringify({
    checks,
    maximumBidEndsAuction: true,
    normalMaximumIsNotMoon: true,
    distinctDeterministicRosters: rosters.size,
    humansAndManualChoicesRetained: true,
    pulseAndGlowRemoved: true,
  })
);
