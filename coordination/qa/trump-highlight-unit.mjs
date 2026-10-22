import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync(new URL('../../trump714.js', import.meta.url), 'utf8');
const select = source.slice(
  source.indexOf('  function select(color) {'),
  source.indexOf('  function confirmChoice() {')
);
const setup = `let tentativeTrump=null,pending=false,running=false,submitRef=()=>{};const colors=['green','red','yellow','black'];const messages={};const root={querySelector:()=>messages};const calls=[];function playNatural063(...args){calls.push(args)}function updateChoice(){}function log(){};`;
const c = vm.createContext({});
vm.runInContext(setup + select, c);
const read = (expr) => vm.runInContext(expr, c);
for (const color of ['green', 'red', 'yellow', 'black']) {
  read(`select('${color}')`);
  assert.equal(read('tentativeTrump'), color);
  assert.equal(read('calls.at(-1)[0]'), 'bidup735');
  const before = read('calls.length');
  read(`select('${color}')`);
  assert.equal(read('tentativeTrump'), null);
  assert.equal(read('calls.length'), before + 1);
  assert.equal(read('calls.at(-1)[0]'), 'biddown735');
}
read("select('green')");
const before = read('calls.length');
read("select('black')");
assert.equal(read('calls.length'), before + 1);
assert.equal(read('tentativeTrump'), 'black');
assert.equal(read('calls.at(-1)[0]'), 'bidup735');
read('pending=true');
read("select('red')");
assert.equal(read('calls.length'), before + 1);
assert.equal(read('tentativeTrump'), 'black');
assert(source.includes('class="tc-selection-highlight"'));
const css = fs.readFileSync(new URL('../../trump714.css', import.meta.url), 'utf8');
assert(css.includes('.tc-pad-surface[data-selected] .tc-selection-highlight'));
assert(!css.includes('@keyframes'));
console.log(
  JSON.stringify({
    allFourToggle: true,
    distinctSelectDeselectSounds: true,
    oneSoundPerAction: true,
    pendingGuard: true,
    steadyInkHighlight: true,
  })
);
