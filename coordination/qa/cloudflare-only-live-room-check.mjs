import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
const base='https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev';
let room=null,token=null,creds=null,requests=0;
const start=Date.now();
const response=await fetch(base+'/',{signal:AbortSignal.timeout(35000)});
assert.equal(response.status,200,'Staging game entry failed');
const cookie=response.headers.get('set-cookie')?.split(';')[0];
assert(cookie?.startsWith('GHR-Online-v1='),'Staging private session not issued');
const html=await response.text();
assert(html.includes('soloPracticeBtn')&&html.includes('friendsToggleBtn'),'Original approved landing missing');
async function api(path,method='GET',body,seatToken,expected=200){
 const result=await fetch(base+path,{method,headers:{Cookie:cookie,Origin:base,...(seatToken?{Authorization:'Bearer '+seatToken}:{}),...(body===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(25000)});
 requests++;
 let data={};try{data=await result.json()}catch{}
 assert.equal(result.status,expected,`${method} ${path} returned ${result.status}: ${data.error||''}`);
 return data;
}
try{
 const playerId=randomUUID();
 creds=await api('/rooms','POST',{playerId,displayName:'Cloud Migration QA',pace:99},null,201);
 room=creds.roomCode;
 token=creds.token;
 assert(/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/.test(room));
 const path='/rooms/'+room;
 const waiting=await api(path+'/snapshot','GET',undefined,token);
 assert.equal(waiting.phase,'waiting');
 await api(path+'/fill-bots','POST',{},token);
 const started=await api(path+'/start','POST',{options:{targetScore:100}},token);
 assert(['dealing','bidding','play'].includes(started.phase),'Staging game did not start: '+started.phase);
 let snap=await api(path+'/snapshot','GET',undefined,token);
 assert(snap.botIntelligence?.version==='x1-online-v2','X1 engine missing from stage snapshot');
 const beforeHand=(snap.hand||[]).map(c=>c.id).sort();
 const resumed=await api(path+'/join','POST',{playerId,displayName:'Cloud-only isolated QA',resumeToken:token},null,201);
 assert.equal(resumed.seat,creds.seat);
 assert.equal(resumed.token,token);
 snap=await api(path+'/snapshot','GET',undefined,token);
 assert.deepEqual((snap.hand||[]).map(c=>c.id).sort(),beforeHand,'Rejoin lost hand');
 assert(!('hands' in snap)&&!('x1' in snap),'Server private state leaked in snapshot');
 console.log(JSON.stringify({pass:true,scope:'Dedicated new QA room in existing live namespace only; current user rooms never opened or modified, no physical devices',roomCreated:true,phase:snap.phase,intelligence:snap.botIntelligence.version,rejoinSameSeat:true,rejoinSameHand:true,requests,elapsedMs:Date.now()-start},null,2));
}finally{
 if(room && token){
   try{await api('/rooms/'+room+'/close','POST',{},token);console.log('Dedicated production migration QA room closed')}catch(e){console.warn('Dedicated live migration QA room cleanup:',e.message)}
 }
}
