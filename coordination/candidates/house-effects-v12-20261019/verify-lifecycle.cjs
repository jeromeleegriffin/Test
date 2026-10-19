/* Presentation lifecycle tests. No game state or scoring is simulated. */
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const code = fs.readFileSync(path.resolve(__dirname, '../../../end-hand-effects-v12.js'), 'utf8');
let now = 0, nextId = 1;
const frames = new Map(), timers = new Map(), listeners = {};
const classes = new Set(['in-game']);
let latestRoot;
class Element {
  constructor() { this.style = {}; this.dataset = {}; this.children = []; this.attrs = {}; }
  appendChild(e) { this.children.push(e); return e; }
  querySelector(selector) { return this.parts?.[selector] || (this.parts[selector] = new Element()); }
  set innerHTML(html) { this.html = html; this.parts = {}; }
  getAttribute(key) { return key === 'src' ? this.src : this.attrs[key]; }
  removeAttribute(key) { delete this[key]; }
  remove() { this.removed = true; }
}
class Media extends Element {
  constructor(src) { super(); this.src = src; }
  play() { return Promise.resolve(); }
  pause() { this.paused = true; }
  load() {}
}
const document = {
  hidden: false,
  body: { classList: { add: k => classes.add(k), remove: k => classes.delete(k), contains: k => classes.has(k) }, appendChild(e) { latestRoot = e; } },
  createElement() { return new Element(); }, querySelector() { return null; }, querySelectorAll() { return []; },
  addEventListener(name, fn) { listeners[name] = fn; },
};
const context = {
  document, console, Image: Element, Audio: Media, MutationObserver: class { observe() {} }, innerWidth: 393, innerHeight: 740,
  performance: { now: () => now }, cardInnerHTML: c => '<img data-test-card="' + c.id + '">',
  setTimeout(fn) { const id = nextId++; timers.set(id, fn); return id; }, clearTimeout: id => timers.delete(id),
  setInterval() { return nextId++; }, clearInterval() {},
  requestAnimationFrame(fn) { const id = nextId++; frames.set(id, fn); return id; }, cancelAnimationFrame: id => frames.delete(id),
  addEventListener(name, fn) { listeners[name] = fn; },
};
context.window = context;
vm.runInNewContext(code, context);
const fx = context.HOREndHandEffectsV12;
function tick(ms) { now += ms; const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn(now)); }
let reveals = 0, completes = 0;
function play(key, cards = []) { return fx.play({ key, cards, onReveal() { reveals++; }, onComplete() { completes++; } }); }
const order = [];
for (let i = 0; i < 30; i++) {
  assert.equal(play('hand-' + i), true);
  order.push(latestRoot.dataset.effect);
  assert(classes.has('end-hand-v12-running'));
  const before = reveals;
  tick(2149); assert.equal(reveals, before);
  tick(1); assert.equal(reveals, before + 1);
  tick(1050); assert(latestRoot.removed); assert(!classes.has('end-hand-v12-running'));
  assert.equal(play('hand-' + i), false);
}
for (let i = 0; i < order.length; i += 3) assert.equal(new Set(order.slice(i, i + 3)).size, 3);
for (let i = 1; i < order.length; i++) assert.notEqual(order[i], order[i - 1]);
assert.equal(reveals, 30); assert.equal(completes, 30);
let resumed = 0;
play('skip'); assert.equal(fx.deferCelebration(() => resumed++), true);
latestRoot.querySelector('button').onclick(); assert.equal(resumed, 1); assert.equal(completes, 31);
play('cancel'); fx.cancel(); assert.equal(completes, 31); assert.equal(frames.size, 0);
play('hidden'); document.hidden = true; listeners.visibilitychange(); assert.equal(completes, 32); document.hidden = false;
play('deadline'); [...timers.values()].forEach(fn => fn()); assert.equal(completes, 33);
for (let i = 0; i < 3; i++) {
  play('cards-' + i, ['red-10', 'rook', 'green-5', 'red-2'].map(id => ({ card: { id } })));
  if (latestRoot.dataset.effect === 'trick') {
    assert.equal(latestRoot.dataset.realCards, '4');
    assert.deepEqual(latestRoot.querySelector('.end-hand-v12-cards').children.map(e => e.dataset.cardId), ['red-10', 'rook', 'green-5', 'red-2']);
  }
  fx.cancel();
}
assert.equal(frames.size, 0); assert.equal(timers.size, 0);
console.log(JSON.stringify({ status: 'PASS', shuffledHands: 30, uniquePerCycle: true, boundaryRepeats: 0, revealAtMs: 2150, finishAtMs: 3200, skipCancelHiddenDeadline: 'PASS', actualCardIdsIncludingBirds: 'PASS' }, null, 2));
