const fs=require('fs'),vm=require('vm'),assert=require('assert');
const base='repair712/baseline/',cand='repair712/Rook712/';
const a=fs.readFileSync(base+'game.js','utf8'),b=fs.readFileSync(cand+'game.js','utf8');
function handler(s){const x=s.indexOf("bindClick('btnToggleTopOpts', () => {");return s.slice(x,s.indexOf('\n(function restoreTopOpts()',x)).trim()}
function menu(s,portrait){let cb,opens=0,closes=0;const set=new Set(['hidden']),bar=new Set(['opts-collapsed','score-collapsed']);const btn={};vm.runInNewContext(handler(s),{bindClick:(id,f)=>cb=f,$:id=>({hostOptionsModal:{classList:{contains:n=>set.has(n)}},topBar:{classList:{toggle(n){if(bar.has(n)){bar.delete(n);return false}bar.add(n);return true}}},btnToggleTopOpts:btn})[id],window:{matchMedia:()=>({matches:portrait})},openHostOptionsModal(){opens++;set.delete('hidden')},closeHostOptionsModal(){closes++;set.add('hidden')},localStorage:{setItem(){}}});cb();cb();cb();return {opens,closes,bar:[...bar],btn}}
assert.deepStrictEqual(menu(a,false),menu(b,false));assert.equal(menu(b,true).opens,2);assert.equal(menu(b,true).closes,1);
for(const name of ['openHostOptionsModal','closeHostOptionsModal']){function f(s){const x=s.indexOf('function '+name+'(');let n=0,end=s.indexOf('{',x);for(let i=end;i<s.length;i++){if(s[i]==='{')n++;if(s[i]==='}'&&!--n)return s.slice(x,i+1)}}assert.equal(f(a),f(b))}
function seatBlock(s){const x=s.indexOf('        // Containment and translated avatar/name descendants');return s.slice(x,s.indexOf('        try{positionSeatBidBadges();',x))}
const old=seatBlock(a);assert(b.includes(old.trim().split('\n').map((line,i)=>i?'  '+line:line).join('\n')));
// Execute the actual relocation region with matchMedia fixtures.
const start=b.indexOf('        // Portrait bidding never owns');const end=b.indexOf('        try{positionSeatBidBadges();',start);const code=b.slice(start,end);
function relocation(code,portrait){let writes=[];vm.runInNewContext(code,{matchMedia:()=>({matches:portrait}),seat:{getBoundingClientRect:()=>({bottom:400}),querySelectorAll:()=>[]},box:{top:300},document:{body:{style:{setProperty:(k,v)=>writes.push([k,v])}}},getComputedStyle:()=>({display:'block'})});return writes}
assert.deepStrictEqual(relocation(code,true),[]);assert.deepStrictEqual(relocation(code,false),relocation(old,false));
(async()=>{
let events={},store=new Map(),deleted=[],offline=false,scope='https://test.invalid/rook/';
function key(r){return typeof r==='string'?new URL(r,scope).href:r.url}
const cache={async addAll(paths){for(const p of paths)store.set(key(p),{ok:true,url:key(p),clone(){return this}})},async match(r){return store.get(key(r))},async put(r,res){store.set(key(r),res)}};
const caches={async open(){return cache},async keys(){return ['house-of-rooks-v706','house-of-rooks-v712','unrelated-cache']},async delete(k){deleted.push(k)}};
const ctx={URL,Promise,location:{origin:'https://test.invalid'},caches,fetch:async r=>{if(offline)throw Error('offline');return {ok:true,url:key(r),clone(){return this}}},self:{addEventListener:(n,f)=>events[n]=f,skipWaiting:async()=>{},clients:{claim:async()=>{}}}};
vm.runInNewContext(fs.readFileSync(cand+'sw.js','utf8'),ctx);let waiting;events.install({waitUntil:p=>waiting=p});await waiting;events.activate({waitUntil:p=>waiting=p});await waiting;assert.deepStrictEqual(deleted,['house-of-rooks-v706']);
function request(path){let response;events.fetch({request:{url:new URL(path,scope).href,method:'GET'},respondWith:p=>response=p});return response}
offline=true;for(const p of ['index.html','game.js?v=712','style.css?v=712','approved-bid-portrait.js?v=712','approved-bid-portrait.css?v=712','assets/bidbox-approved/bidbox_complete_blank.png?v=712']){assert((await request(p)).ok,p)}
assert.equal(await request('other/game.js?v=712'),undefined);let identity;events.message({data:{type:'HOR_BUILD_QUERY'},ports:[{postMessage:x=>identity=x}]});assert.equal(identity.build,'712');assert.equal(identity.cache,'house-of-rooks-v712');
// The new worker must fail installation if precaching fails, rather than promote a partial shell.
cache.addAll=async()=>{throw Error('missing asset')};events.install({waitUntil:p=>waiting=p});await assert.rejects(waiting,/missing asset/);
console.log('PASS real source VM: menu open/close/reopen, settings owner unchanged, landscape menu/relocation parity, portrait no seat writes; SW install/activation, scoped retirement, offline shell/art, full-path fallback, identity reply, precache failure rejection. No browser/phone rendering tested.');
})().catch(e=>{console.error(e);process.exit(1)});
