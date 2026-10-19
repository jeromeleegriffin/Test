const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const acorn = require('acorn');
const walk = require('acorn-walk');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'game060.js'), 'utf8');
const polish = fs.readFileSync(path.join(root, 'polish.js'), 'utf8');
const tree = acorn.parse(source, { ecmaVersion: 'latest' });
const functions = new Map();
walk.simple(tree, {
  FunctionDeclaration(node) {
    functions.set(node.id.name, source.slice(node.start, node.end));
  },
});
const noop = () => {};
const seats = [0, 1, 2, 3].map((seat) => ({ seat, team: seat % 2, name: 'Seat ' + seat }));
let deals = 0;
const context = {
  console,
  crypto,
  isHost: true,
  isSoloPractice: true,
  roomCode: 'OFFLINE',
  players: seats,
  matchStats: {
    hands: 13,
    highBid: 200,
    madeA: 6,
    madeB: 3,
    setsA: 4,
    setsB: 0,
    bidSum: 1700,
    bidCount: 13,
  },
  handHistory: ['old hand'],
  matchTricks: ['old trick'],
  recentTricks: ['old trick'],
  pendingCele: { winner: 'Team B' },
  targetScore: 100,
  botDifficulty: 'extreme',
  includeRed2: true,
  red2Points: 20,
  game: { scores: [-200, 45] },
  $: () => null,
  tourCardOpen: () => false,
  seatedCount: () => 4,
  validateRuleSetup: () => true,
  applyFavoritePartner042: noop,
  packPlayersBySeat: noop,
  publicPlayersSnapshot: () => seats.map((p) => ({ ...p })),
  broadcast: noop,
  readTargetScoreFromUI: () => 100,
  hideCelePage: noop,
  horMarkActiveTable: noop,
  showHostGameTools: noop,
  hostDeal: () => deals++,
};
context.window = context;
vm.createContext(context);
vm.runInContext(
  [
    'freshMatchStats',
    'freshPlayerStat',
    'resetPlayerStats',
    'hostStartGame',
    'winningTeamIndex',
    'pickHighlightTricks',
    'getMatchResult',
  ]
    .map((name) => functions.get(name))
    .join('\n'),
  context
);
context.hostStartGame();
assert.equal(deals, 1);
assert.equal(context.matchStats.hands, 0);
assert.equal(
  Object.values(context.matchStats).reduce((a, b) => a + b, 0),
  0
);
assert.equal(context.handHistory.length, 0);
assert.equal(context.matchTricks.length, 0);
assert.equal(context.pendingCele, null);
context.matchStats.hands = 1;
context.matchStats.setsA = 1;
context.hostStartGame();
assert.equal(deals, 2);
assert.equal(context.matchStats.hands, 0);
assert.equal(context.matchStats.setsA, 0);

const trick = (team, points) => ({ team, points, plays: [], winner: team });
context.matchTricks = [trick(0, 80), trick(1, 25), trick(1, 45), trick(0, 90), trick(1, 15)];
assert.deepEqual(
  Array.from(context.pickHighlightTricks('Team B'), (t) => t.points),
  [25, 45]
);
assert.deepEqual(
  Array.from(context.pickHighlightTricks('Team A'), (t) => t.points),
  [80, 90]
);
assert.deepEqual(
  Array.from(context.pickHighlightTricks('Tie'), (t) => t.points),
  [80, 90]
);
context.matchTricks = [trick(0, 80)];
assert.equal(context.pickHighlightTricks('Team B').length, 0);
assert.equal(context.getMatchResult([-200, 45], 100), 'Team B');
assert.equal(context.getMatchResult([150, 50], 100), 'Team A');

// Exercise the actual presentation wrappers with deliberately different visible team names.
const statements = [];
walk.simple(acorn.parse(polish, { ecmaVersion: 'latest' }), {
  VariableDeclaration(node) {
    if (node.declarations.some((d) => ['_showWin', '_startCele'].includes(d.id.name)))
      statements.push(node);
  },
  ExpressionStatement(node) {
    const e = node.expression;
    if (
      e.type === 'AssignmentExpression' &&
      ['window.showWinCelebration', 'window.startMatchCelebration'].includes(
        polish.slice(e.left.start, e.left.end)
      )
    )
      statements.push(node);
  },
});
const elements = { winTitle: {}, winSub: {}, celeTitle: {} };
context.$ = (id) => elements[id];
context.teamLabel = (team) => ['Falcons', 'Owls'][team];
context.nightRecap = noop;
context.showWinCelebration = (winner, scores) => {
  context.pendingCele = { winner, scores };
};
context.startMatchCelebration = () => {
  elements.celeTitle.textContent = context.pendingCele.winner;
};
vm.runInContext(
  statements
    .sort((a, b) => a.start - b.start)
    .map((n) => polish.slice(n.start, n.end))
    .join('\n'),
  context
);
for (const [winner, title] of [
  ['Team A', 'Falcons Wins!'],
  ['Team B', 'Owls Wins!'],
]) {
  context.showWinCelebration(winner, [150, 50]);
  assert.equal(context.pendingCele.winner, winner);
  assert.equal(elements.winTitle.textContent, title);
  context.startMatchCelebration();
  assert.equal(elements.celeTitle.textContent, title);
}
context.showWinCelebration('Tie', [100, 100]);
assert.equal(context.pendingCele.winner, 'Tie');
assert.equal(elements.winTitle.textContent, "It's a Tie!");
console.log(
  JSON.stringify({
    status: 'PASS',
    consecutiveNewMatchReset: true,
    winnerOnlyHighlights: true,
    noLoserFallback: true,
    canonicalWinnerWithCustomTitles: true,
    negativeTarget: true,
  })
);
