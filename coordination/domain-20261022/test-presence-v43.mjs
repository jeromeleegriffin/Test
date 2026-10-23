import fs from 'node:fs';
import assert from 'node:assert/strict';
const source=fs.readFileSync('main-v43.mjs','utf8').replace('import { DurableObject } from "cloudflare:workers";', 'class DurableObject {constructor(ctx,env){this.ctx=ctx;this.env=env;}}');
fs.writeFileSync('main-v43-test.mjs',source+'\nexport { CLOUD_GAME_ADAPTER, chooseTestBotAction };');
const {RoomDO,CLOUD_GAME_ADAPTER,chooseTestBotAction}=await import('./main-v43-test.mjs');
new Function(CLOUD_GAME_ADAPTER);
let now=Date.now();Date.now=()=>now;
function setup(){
 const data=new Map();let alarm;
 const sockets=[];
 const storage={get:async k=>structuredClone(data.get(k)),put:async(k,v)=>data.set(k,structuredClone(v)),delete:async k=>data.delete(k),setAlarm:async due=>{alarm=due},deleteAlarm:async()=>{alarm=null}};
 const ctx={storage,id:{toString:()=> 'test-room'},getWebSockets:()=>sockets};
 let room=new RoomDO(ctx,{});
 const api=async(path,body,token)=>{
 const r=await room.fetch(new Request('https://test/'+path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})}));
 return {status:r.status,body:await r.json()};};
 return {data,api,sockets,close:socket=>room.webSocketClose(socket),alarm:()=>alarm,fire:async()=>{now=alarm;await room.alarm()},restart:()=>{room=new RoomDO(ctx,{})}};
}
async function table(){const t=setup();t.host=(await t.api('create',{playerId:'host-test-id',displayName:'Host'})).body;t.guest=(await t.api('join',{playerId:'guest-test-id',displayName:'Rosa',preferredSeat:2,avatar:'crow'})).body;await t.api('fill-bots',{},t.host.token);return t;}
let t=await table();
assert.equal((await t.api('leave',{},'bad')).body.error,'UNAUTHORIZED');
assert.equal((await t.api('leave',{},t.host.token)).body.error,'HOST_MUST_CLOSE_TABLE');
assert.equal((await t.api('leave',{},t.guest.token)).status,200);
let state=t.data.get('test-room');assert.equal(state.seats[2].isBot,true);assert.ok(state.seats[2].avatar);assert.equal(state.seats[2].token,null);
assert.equal((await t.api('snapshot',undefined,t.guest.token)).body.error,'UNAUTHORIZED');
assert.equal((await t.api('join',{playerId:'new-guest',displayName:'New',preferredSeat:2})).body.seat,2);
console.log('PASS explicit waiting leave, avatar, revoked credential, replaceable bot, host/auth protection');
t=await table();await t.api('presence',{},t.guest.token);await t.api('start',{},t.host.token);
state=t.data.get('test-room');const opening=state.opening;
await t.api('ready',{handNumber:1,openingId:opening.id},t.host.token);await t.api('ready',{handNumber:1,openingId:opening.id},t.guest.token);
assert.equal(t.alarm(),opening.notBefore,'all-ready alarm must use minimum animation deadline, not 25-second maximum');
await t.fire();assert.equal(t.data.get('test-room').opening,undefined);
const hands=structuredClone(t.data.get('test-room').gameState.hands),scores=structuredClone(t.data.get('test-room').gameState.scores);
await t.api('leave',{},t.guest.token);
state=t.data.get('test-room');assert.deepEqual(state.gameState.hands,hands);assert.deepEqual(state.gameState.scores,scores);assert.equal(state.gameState.players[2].isBot,true);assert.equal(state.gameState.players[2].avatar,state.seats[2].avatar);
console.log('PASS nest revealed at animation completion, active leave preserves cards/scores and changes bot identity');
t=await table();await t.api('presence',{},t.guest.token);await t.api('start',{},t.host.token);
state=t.data.get('test-room');await t.api('ready',{handNumber:1,openingId:state.opening.id},t.host.token);
const grace=state.seats[2].lastSeenAt+30000;assert.equal(t.alarm(),grace-20000);
now+=10000;await t.api('snapshot',undefined,t.guest.token);assert.equal(t.alarm(),grace-5000,'opening deadline remains earlier than reconnect deadline');
assert.equal(t.data.get('test-room').seats[2].reconnectBy,grace);
const countdown=(await t.api('snapshot',undefined,t.host.token)).body.connections[0];assert.equal(countdown.state,'reconnecting');assert.equal(countdown.remainingMs,20000);
t.restart();await t.fire();await t.fire();state=t.data.get('test-room');assert.equal(state.seats[2].autoPlaying,true);assert.equal(state.opening,undefined);assert.equal(state.gameState.players[2].name,'Rosa (bot)');
const savedHand=structuredClone(state.gameState.hands[2]);
await t.api('presence',{},t.guest.token);state=t.data.get('test-room');assert.equal(state.seats[2].autoPlaying,undefined);assert.equal(state.gameState.players[2].isBot,false);assert.equal(state.gameState.players[2].name,'Rosa');assert.deepEqual(state.gameState.hands[2],savedHand);
console.log('PASS absent guest takeover survives object restart, preview cannot fake presence, reconnect keeps hand/seat');
// Takeover of a player whose bid is due must actually advance, including after next object activation.
state.gameState.currentPlayer=2;state.gameState.phase='bidding';delete state.opening;state.seats[2].lastSeenAt=now-30000;t.data.set('test-room',state);
await t.api('snapshot',undefined,t.host.token);state=t.data.get('test-room');assert.ok(state.botTurn);const botDue=state.botTurn.due;
now+=100;await t.api('presence',{},t.host.token);assert.equal(t.alarm(),botDue,'heartbeat must not postpone bot turn');
t.restart();await t.fire();assert.notEqual(t.data.get('test-room').gameState.currentPlayer,2);
console.log('PASS absent bidder acts automatically, heartbeat cannot postpone bot alarm');
// Old clients with an open socket are not falsely replaced during rollout.
t=await table();t.sockets.push({readyState:1,deserializeAttachment:()=>({seat:2,seatToken:t.guest.token}),send:()=>{}});await t.api('start',{},t.host.token);now+=30000;await t.api('snapshot',undefined,t.host.token);assert.equal(t.data.get('test-room').seats[2].autoPlaying,undefined);
console.log('PASS legacy connected client remains human');

t=await table();await t.api('presence',{},t.guest.token);await t.api('start',{},t.host.token);
await t.close({deserializeAttachment:()=>({seatToken:t.guest.token})});
let connection=(await t.api('snapshot',undefined,t.host.token)).body.connections[0];assert.equal(connection.remainingMs,20000);assert.equal(connection.state,'reconnecting');
now+=1000;connection=(await t.api('snapshot',undefined,t.host.token)).body.connections[0];assert.equal(connection.remainingMs,19000);
await t.api('presence',{},t.guest.token);assert.deepEqual((await t.api('snapshot',undefined,t.host.token)).body.connections,[]);
console.log('PASS socket close starts full 20-second countdown, time decreases, reconnect clears notice');

t=await table();await t.api('start',{},t.host.token);await t.api('leave',{},t.guest.token);
state=t.data.get('test-room');await t.api('ready',{handNumber:1,openingId:state.opening.id},t.host.token);
const phases=new Set();let steps=0;
while(steps++<200){
 state=t.data.get('test-room');phases.add(state.gameState.phase);
 if(['score','complete'].includes(state.gameState.phase))break;
 if(state.opening||state.botTurn||state.trumpOpening||state.trickOpening||state.claimOpening){await t.fire();continue;}
 assert.equal(state.gameState.currentPlayer,0,'server must schedule every bot turn');
 const action=chooseTestBotAction(state.gameState,0);
 const response=await t.api(action.type,{...action,actionId:'full-hand-'+steps,expectedRevision:state.revision},t.host.token);
 assert.equal(response.status,200,JSON.stringify(response.body));
}
assert.ok(steps<200,'hand must finish');assert.ok(phases.has('bidding')&&phases.has('discard')&&phases.has('trump')&&phases.has('play'));
console.log('PASS full hand after guest leaves: bidding, nest discard, trump, card play and scoring complete');
