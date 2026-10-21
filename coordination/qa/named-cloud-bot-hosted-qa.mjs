import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
const BASE='https://griffin-rooks-cloud-only-stage.jeromeleegriffin.workers.dev';
const tests=[];
async function run(name, fn){
 const boot=await fetch(BASE+'/',{signal:AbortSignal.timeout(25000)});
 assert.equal(boot.status,200,'Staging entry is not ready');
 const cookie=boot.headers.get('set-cookie')?.split(';')[0];assert(cookie);
 let code=null,token=null;
 const request=async(route,method='GET',body,ownerToken,expected=200)=>{
   const r=await fetch(BASE+route,{method,headers:{Cookie:cookie,Origin:BASE,...(ownerToken?{Authorization:'Bearer '+ownerToken}:{}),...(body===undefined?{}:{'content-type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(25000)});
   const data=await r.json().catch(()=>({}));
   assert.equal(r.status,expected,route+': '+JSON.stringify(data).slice(0,240));
   return data;
 };
 try{
   const id=randomUUID();
   const host=await request('/rooms','POST',{playerId:id,displayName:name,avatar:name==='Dagger'?'dagger':'cinder'},undefined,201);
   token=host.token;code=host.roomCode;
   const path='/rooms/'+code;
   const snap=await request(path+'/snapshot','GET',undefined,token);
   assert.equal(snap.phase,'waiting');
   assert.deepEqual(snap.occupiedSeats,[0],'New friends room seated bots before Fill: '+JSON.stringify(snap.occupiedSeats));
   assert(snap.players.slice(1).every(p=>!p.occupied && p.name==='Open seat'));
   const record=await fn({request,path,token,host,id});
   tests.push({name,...record});
 }finally {
   if(code&&token){try{await request('/rooms/'+code+'/close','POST',{},token)}catch(e){console.warn('Cleanup:',e.message)}}
 }
}
await run('Named host',async({request,path,token})=>{
 const filled=await request(path+'/fill-bots','POST',{},token);
 assert.deepEqual(filled.occupiedSeats,[0,1,2,3]);
 assert.deepEqual(filled.players.slice(1).map(p=>p.name),['Dagger','Crow','Blaze']);
 assert.deepEqual(filled.players.slice(1).map(p=>p.avatar),['dagger','crow','blaze']);
 assert(filled.players.slice(1).every(p=>p.isBot===true));
 const humanId=randomUUID();
 const joined=await request(path+'/join','POST',{playerId:humanId,displayName:'Real Human Guest',avatar:'grit'},undefined,201);
 assert.equal(joined.seat,1,'Human must replace first unstarted bot, not displace host');
 const after=await request(path+'/snapshot','GET',undefined,token);
 assert.equal(after.players[1].name,'Real Human Guest');
 assert.equal(after.players[1].isBot,false);
 assert.deepEqual(after.players.slice(2).map(p=>p.name),['Crow','Blaze']);
 const game=await request(path+'/start','POST',{options:{targetScore:100}},token);
 assert(['dealing','bidding','play'].includes(game.phase));
 const reading=await request(path+'/snapshot','GET',undefined,token);
 assert.equal(reading.botIntelligence?.version,'x1-online-v2');
 return {botNames:['Dagger','Crow','Blaze'],humanReplacedBot:true,realHumanNamePreserved:true,x1:true};
});
await run('Dagger',async({request,path,token})=>{
 const snap=await request(path+'/fill-bots','POST',{},token);
 assert.deepEqual(snap.players.slice(1).map(p=>p.name),['Grit','Crow','Blaze'],'Default bot name duplicated the human host');
 assert.equal(snap.players[0].name,'Dagger');
 return {collisionSafe:true,actual:['Grit','Crow','Blaze']};
});
await run('Second host',async({request,path,token})=>{
 const snap=await request(path+'/fill-bots','POST',{seat:2},token);
 assert.deepEqual(snap.occupiedSeats,[0,2]);
 assert.equal(snap.players[2].name,'Crow');
 assert(snap.players[1].occupied===false && snap.players[3].occupied===false);
 return {singleSeatOnly:true,emptySeatsPreserved:true};
});
console.log(JSON.stringify({pass:true,scope:'Cloudflare-only isolated stage; production rooms not accessed or modified',tests},null,2));
