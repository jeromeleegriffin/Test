import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const polish = fs.readFileSync(new URL('../../polish.js', import.meta.url), 'utf8');
const nodes = new Map();
function el(id) {
  if (!nodes.has(id)) {
    const classes = new Set();
    nodes.set(id, {
      textContent: '',
      isConnected: true,
      classList: {
        toggle(k, v) {
          v ? classes.add(k) : classes.delete(k);
        },
        add(...ks) {
          ks.forEach((k) => classes.add(k));
        },
        remove(...ks) {
          ks.forEach((k) => classes.delete(k));
        },
        contains: (k) => classes.has(k),
      },
      focus() {},
      showModal() {
        this.open = true;
      },
      close() {
        this.open = false;
      },
    });
  }
  return nodes.get(id);
}
let restored = 0;
const window = {
  confirm() {
    throw Error('Browser confirm forbidden');
  },
};
const c = vm.createContext({
  window,
  document: {
    activeElement: {
      isConnected: true,
      focus() {
        restored++;
      },
    },
  },
  $: el,
});
const start = polish.indexOf('  let confirmBusy = false;'),
  end = polish.indexOf('\n  const PLAY_TIPS', start);
vm.runInContext(polish.slice(start, end), c);
const options = {
  kind: 'table',
  title: 'Close this table?',
  body: 'Ends the game.',
  tableCode: 'JER42',
  confirmText: 'Close table',
  cancelText: 'Keep table',
};
let result = window.houseConfirm(options);
assert(el('confirmSheet').open);
assert.equal(el('confirmContext').textContent, 'TABLE JER42');
assert.equal(el('confirmOk').textContent, 'Close table');
assert.equal(el('confirmCancel').textContent, 'Keep table');
assert(el('confirmSheet').classList.contains('table-close-confirm'));
assert.equal(await window.houseConfirm(options), false);
el('confirmCancel').onclick();
assert.equal(await result, false);
assert.equal(el('confirmSheet').open, false);
result = window.houseConfirm(options);
el('confirmOk').onclick();
assert.equal(await result, true);
result = window.houseConfirm(options);
let prevented = false;
el('confirmSheet').oncancel({
  preventDefault() {
    prevented = true;
  },
});
assert.equal(await result, false);
assert(prevented);
result = window.houseConfirm(options);
window.houseDismissConfirm();
assert.equal(await result, false);
assert.equal(restored, 4);
const worker = fs.readFileSync(
  new URL('../../cloudflare/live/worker-live.mjs', import.meta.url),
  'utf8'
);
const adapter = JSON.parse(worker.match(/var CLOUD_GAME_ADAPTER = ("(?:[^"\\]|\\.)*");/)[1]);
const a = adapter.slice(
  adapter.indexOf('  let closingTable=false;'),
  adapter.indexOf('  window.leaveTableAfterConfirmation043')
);
const events = [];
let resolve;
const w = { houseConfirm: () => new Promise((r) => (resolve = r)) };
const x = vm.createContext({
  window: w,
  api: async () => events.push('request'),
  finishClosedTable: () => events.push('finish'),
  status: () => events.push('error'),
  horToast: () => events.push('notice'),
  roomPath: () => '/close',
  native: {},
  disconnectCloudRoom: () => events.push('disconnect'),
});
vm.runInContext('let credentials={seat:0,roomCode:"JER42"};' + a, x);
let pending = vm.runInContext('closeCloudTable()', x);
await vm.runInContext('closeCloudTable()', x);
resolve(false);
await pending;
assert.deepEqual(events, []);
pending = vm.runInContext('closeCloudTable()', x);
await vm.runInContext('closeCloudTable()', x);
resolve(true);
await pending;
assert.deepEqual(events, ['request', 'finish']);
events.length = 0;
pending = vm.runInContext('closeCloudTable()', x);
vm.runInContext('credentials={seat:0,roomCode:"NEW42"}', x);
resolve(true);
await pending;
assert.deepEqual(events, []);
vm.runInContext('credentials={seat:1,roomCode:"JER42"}', x);
pending = w.clientLeaveReplace();
resolve(true);
await pending;
assert.deepEqual(events, ['disconnect']);
assert(!a.includes('confirm('));
const finish = adapter.slice(
  adapter.indexOf('  function finishClosedTable'),
  adapter.indexOf('  let closingTable')
);
assert(!finish.includes('alert('));
assert(finish.includes('if(owner.seat!==0)horToast('));
console.log(
  JSON.stringify({
    customLabels: true,
    cancelSafe: true,
    escapeSafe: true,
    focusRestored: true,
    duplicateConfirmBlocked: true,
    oneCloseRequest: true,
    staleConfirmIgnored: true,
    guestCustomConfirm: true,
    noBrowserDialogs: true,
    noSecondHostPopup: true,
  })
);
