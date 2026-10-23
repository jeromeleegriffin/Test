const fs = require('fs');
const vm = require('vm');
const crypto = require('crypto');
const assert = require('assert/strict');

function create(points = 0) {
  const map = new Map();
  const storage = {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    key: (index) => [...map.keys()][index],
    get length() {
      return map.size;
    },
  };
  const ctx = { localStorage: storage, crypto: crypto.webcrypto, console, TextEncoder };
  ctx.window = ctx;
  vm.createContext(ctx);
  const corePath = fs.existsSync('career-core.js') ? 'career-core.js' : 'career-audit-career-core.js';
  const progressionPath = fs.existsSync('progression.js')
    ? 'progression.js'
    : 'career-audit-progression.js';
  vm.runInContext(fs.readFileSync(corePath, 'utf8'), ctx);
  vm.runInContext(
    fs.readFileSync(progressionPath, 'utf8').split('/* RookGame452')[0],
    ctx
  );
  if (points) {
    storage.setItem(
      'rookLifetimeStats',
      JSON.stringify({ You: { isBot: false, points } })
    );
  }
  ctx.HORProgression.core.activate();
  return { P: ctx.HORProgression, storage };
}

const early = create();
const first = early.P.core.applyDailyLoginBonus('2026-10-23');
assert.equal(first.awarded, true);
assert.equal(first.amount, 125);
assert.equal(early.P.core.profile().points, 125);
const repeated = early.P.core.applyDailyLoginBonus('2026-10-23');
assert.equal(repeated.awarded, false);
assert.equal(repeated.alreadyAwarded, true);
assert.equal(repeated.amount, 125);
assert.equal(early.P.core.profile().points, 125);
assert.equal(early.P.core.applyDailyLoginBonus('2026-10-24').awarded, true);
assert.equal(early.P.core.applyDailyLoginBonus('2026-10-23').awarded, false);

const level16 = create(59000).P.core.applyDailyLoginBonus('2026-10-23');
assert.equal(level16.amount, 575);
const level49 = create(950000).P.core.applyDailyLoginBonus('2026-10-23');
assert.equal(level49.amount, 2600);
const maxLevel = create(1000000).P.core.applyDailyLoginBonus('2026-10-23');
assert.equal(maxLevel.amount, 100);
assert.throws(() => early.P.core.applyDailyLoginBonus('2026-02-30'), /Invalid daily bonus date/);

const backup = early.P.protection.buildBackup();
assert.equal(early.P.core.validateBackup(backup).data.horCareerStateV2 !== undefined, true);
assert.equal(JSON.parse(backup.data.horCareerStateV2).dailyLoginBonus.date, '2026-10-24');
console.log('PASS daily bonus scaling, same-day idempotency, persistence, max-level fallback, and input validation');
