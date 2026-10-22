import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const native = fs.readFileSync(new URL('../../game060.js', import.meta.url), 'utf8');
const worker = fs.readFileSync(
  new URL('../../cloudflare/live/worker-live.mjs', import.meta.url),
  'utf8'
);
const adapter = JSON.parse(worker.match(/var CLOUD_GAME_ADAPTER = ("(?:[^"\\]|\\.)*");/)[1]);
function extract(s, name, next) {
  return s.slice(s.indexOf('function ' + name), s.indexOf(next, s.indexOf('function ' + name)));
}
const calls = [];
const nodes = new Map();
function node(id) {
  if (!nodes.has(id)) {
    const classes = new Set(['hidden']);
    nodes.set(id, {
      textContent: '',
      innerHTML: '',
      classList: {
        add: (...xs) => xs.forEach((x) => classes.add(x)),
        remove: (...xs) => xs.forEach((x) => classes.delete(x)),
        contains: (x) => classes.has(x),
      },
    });
  }
  return nodes.get(id);
}
const c = vm.createContext({
  window: {},
  document: { body: node('body') },
  $: (id) => node(id),
  lobby: node('lobby'),
  clearTimeout: (x) => calls.push(['timer', x]),
  clearInterval: (x) => calls.push(['interval', x]),
});
const helpers = [
  'clearTurnTimer',
  'forgetRoomSession043',
  'stopPresentationSounds035',
  'stopDealFlights036',
  'stopDiscardReturn040',
  'hideCelePage',
  'hideDiscardOverlay',
  'hideShuffleOverlay',
  'hideWelcomeScreen',
  'hideNoServiceModal',
  'hideInviteSplash',
  'hideBotStyleTip',
  'clearClaimOverlays',
  'clearTrickFlightLayers',
  'clearTrumpBanners',
  'clearTableForShuffle',
  'closeBotPicker',
  'closeHostOptionsModal',
  'setLobbyJoining',
  'setLobbyPortraitOrientation',
  'updatePracticeBadge',
  'syncLandscapeFullscreen',
];
for (const name of helpers) c[name] = () => calls.push([name]);
c.teardownMultiplayerBeforeLobby = () => vm.runInContext('game=null;players=[]', c);
vm.runInContext(
  'let game={phase:"play"},players=[1,2,3,4],dealAnimToken=7,botTimer=1,botDue063=8,horHeartbeatTimer=2,horReconnectTimer=3,disconnectTimers={a:4},biddingIntroTimer=5,yourTurnNotifyTimer=6,captureOverlayTimer=7,captureCelebrationQueue=[1],pendingCele={};',
  c
);
const artwork = { cached: true };
c.window.artwork = artwork;
vm.runInContext(extract(native, 'returnToLobby043()', '\n/** Sole holder'), c);
for (let i = 0; i < 3; i++) {
  vm.runInContext('returnToLobby043()', c);
  assert.equal(vm.runInContext('game', c), null);
  assert(!node('lobby').classList.contains('hidden'));
  assert(node('game').classList.contains('hidden'));
  assert.equal(c.window.artwork, artwork);
}
assert(calls.some((x) => x[0] === 'timer' && x[1] === 1));
assert(calls.some((x) => x[0] === 'stopDealFlights036'));
// Run the actual cloud detach and close functions, retaining guest credentials but dropping host credentials.
const storage = () => {
  const m = new Map();
  return {
    setItem: (k, v) => m.set(k, v),
    getItem: (k) => m.get(k),
    removeItem: (k) => m.delete(k),
  };
};
c.sessionStorage = storage();
c.localStorage = storage();
c.paintCloudPace = () => {};
c.returnToLobby043 = () => calls.push(['cloudLobby']);
c.alert = () => {};
vm.runInContext(
  'let credentials={token:"saved",seat:1},cloudDealTimer=8,cloudDealOwner={},timer=9,socketReconnectTimer=10,socket={close(){}},latest={},queuedAction={},busy=true,presented={},lastRevision=99,cloudAudio={},lastScoreSignature="old",redealRevision=4;',
  c
);
vm.runInContext(extract(adapter, 'disconnectCloudRoom()', '\n  async function closeCloudTable'), c);
c.localStorage.setItem('seat', 'saved');
c.credentialKey = 'seat';
vm.runInContext('disconnectCloudRoom()', c);
assert.equal(c.localStorage.getItem('seat'), 'saved');
assert.equal(c.sessionStorage.getItem('ghr-cloud-disconnected'), '1');
assert.equal(vm.runInContext('credentials', c), null);
assert.equal(vm.runInContext('busy', c), false);
vm.runInContext('credentials={token:"new"};const old={token:"old"};finishClosedTable(old)', c);
assert.equal(vm.runInContext('credentials.token', c), 'new');
vm.runInContext('finishClosedTable()', c);
assert.equal(c.localStorage.getItem('seat'), undefined);
assert.equal(vm.runInContext('credentials', c), null);
// A snapshot completing after leave/new table cannot repaint the new session.
let resolve;
c.api = () => new Promise((r) => (resolve = r));
c.roomPath = () => '/snapshot';
c.receiveSnapshot = () => calls.push(['snapshot']);
c.status = () => {};
vm.runInContext('credentials={token:"first"};busy=false;', c);
vm.runInContext('async ' + extract(adapter, 'refresh()', '\n  function receiveSnapshot'), c);
const pending = vm.runInContext('refresh()', c);
vm.runInContext('credentials={token:"second"}', c);
resolve({ revision: 500 });
await pending;
assert(!calls.some((x) => x[0] === 'snapshot'));
assert(!extract(native, 'leaveTableToLobby043()', '\n/** Sole holder').includes('location.reload'));
assert(
  !extract(adapter, 'disconnectCloudRoom()', '\n  async function closeCloudTable').includes(
    'location.'
  )
);
let delayed;
c.setTimeout = fn => { delayed = fn; };
c.waiting = node('waiting');
c.document.querySelector = () => null;
c.playToastClink = () => {};
vm.runInContext('let tableEpoch043=1;', c);
vm.runInContext(extract(native, 'playTableToast(done)', '\nfunction startGameWithToast'), c);
c.done = () => calls.push(['oldToast']);
vm.runInContext('playTableToast(done);tableEpoch043++;', c);
delayed();
assert(!calls.some(x => x[0] === 'oldToast'));
console.log(
  JSON.stringify({
    sameDocumentReturn: true,
    repeatedCleanup: true,
    cachedArtworkRetained: true,
    guestCredentialRetained: true,
    closedCredentialRemoved: true,
    staleSnapshotIgnored: true,
    oldCloseIgnored: true,
    oldStartDelayIgnored: true,
  })
);
