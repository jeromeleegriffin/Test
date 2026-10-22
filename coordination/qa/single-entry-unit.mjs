import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root=new URL('../../',import.meta.url);
const router=fs.readFileSync(new URL('coordination/qa/legacy-entry-head.html',root),'utf8').match(/<script[^>]*>([\s\S]*)<\/script>/)[1];
let checks=0;
for(const [url,online,redirect] of [
  ['https://jeromeleegriffin.github.io/Test/',true,true],
  ['https://jeromeleegriffin.github.io/Griffin-House-of-Rooks/?room=ABCDEFGH#name=Player',true,true],
  ['https://jeromeleegriffin.github.io/Test/?offline=1',true,false],
  ['https://jeromeleegriffin.github.io/Test/',false,false],
  ['https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/',true,false],
  ['http://localhost/',true,false],
]) {
  const original=new URL(url);let destination=null;
  vm.runInNewContext(router,{location:{hostname:original.hostname,search:original.search,hash:original.hash,replace:v=>destination=v},navigator:{onLine:online},URL,URLSearchParams});
  assert.equal(!!destination,redirect);checks++;
  if(redirect){const d=new URL(destination);assert.equal(d.origin,'https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev');assert.equal(d.pathname,'/');assert.equal(d.search,original.search);assert.equal(d.hash,original.hash);checks+=4;}
}
// Execute the actual redirect branch: it runs before either HTML delivery path.
const worker=fs.readFileSync(new URL('cloudflare/live/worker-live.mjs',root),'utf8');
const begin=worker.indexOf('    // Old shortcuts and raw index links');
const end=worker.indexOf('    const isEntry',begin);
assert(begin>0&&end>begin);
const route=vm.runInNewContext('(request)=>{const url=new URL(request.url);'+worker.slice(begin,end)+'return null}',{URL,Response});
for(const pathname of ['/cloud-game/assets/','/cloud-game/assets/index.html'])for(const method of ['GET','HEAD']){
 const response=route(new Request('https://game.example'+pathname+'?room=ABCDEFGH&name=Player',{method}));
 assert.equal(response.status,302);assert.equal(response.headers.get('location'),'https://game.example/?room=ABCDEFGH&name=Player');assert.equal(response.headers.get('cache-control'),'no-store');checks+=3;
}
for(const pathname of ['/','/rooms','/cloud-game/assets/game060.js']){assert.equal(route(new Request('https://game.example'+pathname)),null);checks++;}
assert.equal(route(new Request('https://game.example/cloud-game/assets/index.html',{method:'POST'})),null);checks++;
assert(!router.includes('localStorage')&&!router.includes('unregister')&&!router.includes('caches.delete'));checks++;
console.log(JSON.stringify({checks,result:'PASS'}));
