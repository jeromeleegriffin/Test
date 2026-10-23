import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
let calls=[],replies=[];const ctx={URL,Headers,Response,Uint8Array,TextDecoder,AbortSignal,fetch:async(url,options)=>{calls.push({url,options});const [status,data]=replies.shift()||[200,{}];return new Response(JSON.stringify(data),{status})}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('cloud-career/api.mjs','utf8')+';globalThis.api=careerApi',ctx);
const env={ENTRY_LIMIT:{limit:async()=>({success:true})},ACTION_LIMIT:{limit:async()=>({success:true})}};
const req=(path,body,cookie='',origin='https://rooks.test')=>new Request('https://rooks.test/career-api/'+path,{method:body?'POST':'GET',headers:{'content-type':'application/json',origin,cookie},body:body?JSON.stringify(body):undefined});
assert.equal((await ctx.api(req('save',{},'','https://attacker.test'),env)).status,403);assert.equal(calls.length,0);
assert.equal((await ctx.api(req('current'),env)).status,401);
replies=[[400,{error:'secret upstream details'}]];let r=await ctx.api(req('login',{email:'test@example.invalid',password:'x'}),env);assert.equal(r.status,401);assert.ok(!(await r.text()).includes('secret'));
replies=[[200,{access_token:'access',refresh_token:'refresh',expires_in:3600,user:{id:'one',email:'a'}}]];r=await ctx.api(req('login',{email:'a',password:'p'}),env);assert.equal(r.status,200);assert.match(r.headers.get('set-cookie'),/HttpOnly; Secure; SameSite=Strict/);assert.ok(!(await r.text()).includes('access_token'));
replies=[[200,{id:'one',email_confirmed_at:'today'}],[409,{code:'40001'}]];r=await ctx.api(req('save',{payload:{},revision:2,userId:'one'},'__Host-ghr-career-access=access'),env);assert.equal(r.status,409);
replies=[[200,{access_token:'renewed',refresh_token:'new-refresh',user:{id:'one',email_confirmed_at:'today'}}],[200,[]]];r=await ctx.api(req('current',null,'__Host-ghr-career-refresh=refresh'),env);assert.equal(r.status,200);assert.equal(calls.at(-1).options.headers.Authorization,'Bearer renewed');
assert.equal((await ctx.api(req('login',{email:'a',password:'p'}),{ENTRY_LIMIT:{limit:async()=>({success:false})}})).status,429);
console.log('PASS CSRF denial, anonymous denial, private auth errors, secure cookies, conflict status, refresh, rate limiting');

replies=[[200,{id:'two',email_confirmed_at:'today'}]];r=await ctx.api(req('save',{payload:{},revision:1,userId:'one'},'__Host-ghr-career-access=access'),env);assert.equal(r.status,409);console.log('PASS account switch blocks wrong-account save');
