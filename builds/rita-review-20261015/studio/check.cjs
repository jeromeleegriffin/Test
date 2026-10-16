const fs=require('fs'),vm=require('vm'),assert=require('assert');
let js=fs.readFileSync('studio/studio.js','utf8');
const ids=new Set([...fs.readFileSync('studio/index.html','utf8').matchAll(/id="([^"]+)"/g)].map(m=>m[1]));
for(const m of js.matchAll(/\$\('([^']+)'\)/g))assert(ids.has(m[1]),'Missing element '+m[1]);
// Execute the real backup decoder and event contract without starting the UI.
js=js.slice(0,js.indexOf('for(const e of events)$(\'event\')'));
const context={document:{getElementById(){}},Blob,Uint8Array,atob,console};vm.createContext(context);vm.runInContext(js,context);
assert.equal(vm.runInContext('events.length',context),31);
assert.equal(vm.runInContext('new Set(events.map(e=>e.id)).size',context),31);
assert.equal(vm.runInContext('events.some(e=>e.id==="bid-200")',context),false);
assert.equal(vm.runInContext('decodeData("data:audio/webm;base64,YWJj", "audio").size',context),3);
assert.throws(()=>vm.runInContext('decodeData("data:text/html;base64,YWJj", "audio")',context));
assert.throws(()=>vm.runInContext('decodeData("data:image/svg+xml;base64,YWJj", "image")',context));
assert.throws(()=>vm.runInContext('decodeData("data:audio/webm;bad", "audio")',context));
console.log('31 unique events; no numeric 200; all UI IDs present; valid backup media decoded; invalid types rejected.');
