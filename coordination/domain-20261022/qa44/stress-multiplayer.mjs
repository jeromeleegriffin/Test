import fs from 'node:fs';import assert from 'node:assert/strict';
const file=process.argv[2]||'main-v43.mjs';
fs.writeFileSync('stress-runtime.mjs',fs.readFileSync(file,'utf8').replace('import { DurableObject } from "cloudflare:workers";','class DurableObject {constructor(ctx,env){this.ctx=ctx;this.env=env}}')+'\nexport {chooseTestBotAction};');
const {RoomDO,chooseTestBotAction}=await import('./stress-runtime.mjs?'+Date.now());let now=Date.now();Date.now=()=>now;
let totalActions=0,totalHands=0;const failures=[];const coverage={};
function table(){const data=new Map();let due;const ctx={id:{toString:()=> 'room'},storage:{get:async k=>structuredClone(data.get(k)),put:async(k,v)=>data.set(k,structuredClone(v)),delete:async k=>data.delete(k),setAlarm:async n=>{due=n},deleteAlarm:async()=>{due=null}},getWebSockets:()=>[]};let obj=new RoomDO(ctx,{});return {data,state:()=>data.get('room'),due:()=>due,restart:()=>obj=new RoomDO(ctx,{}),alarm:()=>obj.alarm(),close:token=>obj.webSocketClose({deserializeAttachment:()=>({seatToken:token})}),async req(path,body,token){const r=await obj.fetch(new Request('https://qa/'+path,{method:body===undefined?'GET':'POST',headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})}));return {status:r.status,...await r.json()}}};}
async function run(index){const t=table(),clients=[];clients[0]=await t.req('create',{playerId:'host-'+index,displayName:'Host',pace:[1,3,99][index%3]});for(let i=1;i<4;i++)clients[i]=await t.req('join',{playerId:'person-'+index+'-'+i,displayName:'Guest '+i,preferredSeat:i});
// Every run includes explicit leave/rejoin before the deal, without leaking the prior token.
const old=clients[3];assert.equal((await t.req('leave',{},old.token)).status,'left');clients[3]=await t.req('join',{playerId:'person-'+index+'-3',displayName:'Guest 3',preferredSeat:3});assert.notEqual(clients[3].token,old.token);assert.equal((await t.req('snapshot',undefined,old.token)).error,'UNAUTHORIZED');
await t.req('start',{options:{targetScore:300,includeRed2:index%2===0,shootMoonEnabled:index%3===0,revealTopNest:index%2===0}},clients[0].token);
let nextPulse=now,changed=false,offline=null,returned=false,steps=0;const mode=index%6,trigger=['bidding','discard','trump','play','play','bidding'][mode];
while(steps++<7000){let s=t.state();if(s.status==='complete'){totalHands+=s.gameState.handNumber;break;}
if(now>=nextPulse){for(let seat=0;seat<4;seat++)if(clients[seat]&&offline?.seat!==seat)await t.req('presence',{},clients[seat].token);nextPulse=now+5000;}
s=t.state();coverage[s.gameState.phase]=(coverage[s.gameState.phase]||0)+1;
if(!changed&&!s.opening&&s.gameState.phase===trigger){let seat=s.gameState.currentPlayer;if(mode===5)seat=0;if(mode===4&&seat===0)seat=1;
if(mode===0||mode===1||mode===2||mode===3){if(seat===0)seat=1;const hands=JSON.stringify(s.gameState.hands),scores=JSON.stringify(s.gameState.scores);const result=await t.req('leave',{},clients[seat].token);assert.equal(result.status,'left');clients[seat]=null;assert.equal(JSON.stringify(t.state().gameState.hands),hands);assert.equal(JSON.stringify(t.state().gameState.scores),scores);}
else{await t.close(clients[seat].token);offline={seat,until:now+42000};}changed=true;s=t.state();}
if(offline&&!returned&&now>=offline.until){const seat=offline.seat;const hand=JSON.stringify(t.state().gameState.hands[seat]);const restored=await t.req('presence',{},clients[seat].token);assert.equal(restored.viewerSeat,seat);assert.equal(JSON.stringify(t.state().gameState.hands[seat]),hand);assert.equal(t.state().gameState.players[seat].isBot,false);offline=null;returned=true;}
s=t.state();if(steps%19===0)t.restart();
if(s.opening){for(let i=0;i<4;i++)if(clients[i]&&offline?.seat!==i)await t.req('ready',{handNumber:s.gameState.handNumber,openingId:s.opening.id},clients[i].token);s=t.state();}
if(s.opening||s.botTurn||s.trumpOpening||s.trickOpening||s.claimOpening){const advance=Math.min(t.due()||now+1000,nextPulse,offline?.until||Infinity);now=Math.max(now+1,advance);if(now>=t.due())await t.alarm();continue;}
if(s.gameState.phase==='score'){const a=await t.req('next-hand',{actionId:'next-'+steps,expectedRevision:s.revision},clients[0].token);assert.equal(a.accepted,true);continue;}
const seat=s.gameState.currentPlayer;
if(offline?.seat===seat){now=Math.min(nextPulse,t.due()||now+1000,offline.until);if(now>=t.due())await t.alarm();continue;}
if(!clients[seat])throw Error('Bot has no scheduled move at '+s.gameState.phase);
const v=await t.req('snapshot',undefined,clients[seat].token);assert.equal(v.viewerSeat,seat);assert.deepEqual(v.hand,s.gameState.hands[seat]);assert.equal(v.hands,undefined,'private hands exposed');
const action=chooseTestBotAction(s.gameState,seat);assert.ok(action,'No legal human move');const body={...action,actionId:'a-'+steps,expectedRevision:s.revision};const result=await t.req(action.type,body,clients[seat].token);assert.equal(result.accepted,true,JSON.stringify(result));totalActions++;
if(steps%13===0){const duplicate=await t.req(action.type,body,clients[seat].token);assert.equal(duplicate.duplicate,true);const reused=await t.req(action.type,{...body,expectedRevision:-1},clients[seat].token);assert.equal(reused.error,'ACTION_ID_REUSED');}
now+=100;
}
assert.ok(steps<7000,'match stalled');assert.ok(changed,'scenario not reached');const close=await t.req('close',{},clients[0].token);assert.equal(close.status,'closed');assert.equal((await t.req('snapshot',undefined,clients[0].token)).error,'ROOM_CLOSED');return {index,mode,hands:t.state().gameState.handNumber,steps,returned};}
for(let i=0;i<36;i++){try{const r=await run(i);console.log('PASS '+JSON.stringify(r));}catch(e){failures.push({index:i,error:e.stack});console.log('FAIL '+i+' '+e.message);}}
const result={matches:36,passed:36-failures.length,totalActions,totalHands,coverage,failures};fs.writeFileSync('stress-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(failures.length)process.exitCode=1;
