import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {webcrypto} from 'node:crypto';
const exports='export {createMatch,submitBid,discardCards,chooseTrump,playCard,claimRemainingCards,getRemainingClaim,startNextHand,redeal,chooseTestBotAction,playerView,cardPoints,cloudCareerCapture,cloudCareerFinish};';
const source=fs.readFileSync('cloud-career/main-v48.mjs','utf8').replace('import { DurableObject } from "cloudflare:workers";','class DurableObject {}');fs.writeFileSync('cloud-career/engine-test.mjs',source+'\n'+exports);const e=await import('./engine-test.mjs');
const baseline=fs.readFileSync('cloud-career/main-v46.mjs','utf8').replace('import { DurableObject } from \"cloudflare:workers\";','class DurableObject {}');fs.writeFileSync('cloud-career/baseline-test.mjs',baseline+'\nexport {submitBid,discardCards,chooseTrump,playCard,claimRemainingCards};');const old=await import('./baseline-test.mjs');
function career(){const map=new Map();const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k),key:i=>[...map.keys()][i],get length(){return map.size}};const ctx={localStorage:storage,crypto:webcrypto,console,TextEncoder};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('cloud-career/career-core-v46.js','utf8'),ctx);vm.runInContext(fs.readFileSync('career-audit-progression.js','utf8').split('/* RookGame452')[0],ctx);return ctx.HORProgression.core;}
let hands=0,actions=0,claims=0;const ids=new Set();
for(let run=0;run<24;run++){
 const players=Array.from({length:4},(_,i)=>({playerId:'player-'+i,name:'Player '+i,isBot:run%3===0?false:i!==run%4}));
 const cores=players.map(()=>career());
 let state=e.createMatch(players,{targetScore:run%2?500:100,nestGoesTo:run%2?'lastTrick':'bidder',bidOnlyScoring:run%4===0,shootMoonEnabled:false});
 assert.ok(!ids.has(state.career.id));ids.add(state.career.id);
 let steps=0;
 while(state.phase!=='complete'&&steps++<10000){
  if(state.phase==='score'){state=e.startNextHand(state).state;continue}
  if(state.phase==='redeal'){state=e.redeal(state).state;continue}
  const action=e.chooseTestBotAction(state,state.currentPlayer);let r;
  const claim=run%2===0&&e.getRemainingClaim(state);
  if(claim&&claim.seat===state.currentPlayer){r=e.claimRemainingCards(state,claim.seat);claims++}
  else if(action.type==='bid')r=e.submitBid(state,state.currentPlayer,action.value);
  else if(action.type==='discard')r=e.discardCards(state,state.currentPlayer,action.cardIds);
  else if(action.type==='trump')r=e.chooseTrump(state,state.currentPlayer,action.color);
  else if(action.type==='play')r=e.playCard(state,state.currentPlayer,action.cardId);
  assert.ok(r.accepted);
  const original=structuredClone(state);delete original.career;
  let priorResult;if(claim&&claim.seat===state.currentPlayer)priorResult=old.claimRemainingCards(original,claim.seat);
  else if(action.type==='bid')priorResult=old.submitBid(original,state.currentPlayer,action.value);
  else if(action.type==='discard')priorResult=old.discardCards(original,state.currentPlayer,action.cardIds);
  else if(action.type==='trump')priorResult=old.chooseTrump(original,state.currentPlayer,action.color);
  else priorResult=old.playCard(original,state.currentPlayer,action.cardId);
  const normalized=structuredClone(r);delete normalized.state.career;assert.deepEqual(normalized,priorResult);
  state=r.state;actions++;
  if(['score','complete'].includes(state.phase)){
   hands++;const ev=state.career.events.at(-1),prior=state.career.events.at(-2);
   for(let i=0;i<4;i++){
    const delta=(ev.stats[i].points||0)-(prior?.stats[i]?.points||0);assert.equal(delta,i%2?ev.summary.pointsB:ev.summary.pointsA);
    assert.equal(ev.stats[i].hands,ev.hand);
    if(!players[i].isBot&&i!==3){const x=cores[i].recordHand({...ev,localPeerId:'career-seat-'+i,isHost:i===0});assert.ok(x.ok);const before=cores[i].stable(cores[i].read());cores[i].recordHand({...ev,localPeerId:'career-seat-'+i,isHost:i===0});assert.equal(cores[i].stable(cores[i].read()),before)}
   }
   const won=ev.stats.reduce((n,s,i)=>n+(s.tricksWon||0)-(prior?.stats[i]?.tricksWon||0),0);assert.equal(won,state.settings.handSize);
   assert.ok(!JSON.stringify(ev).includes('cardId'));assert.ok(!('hands' in ev));
  }
 }
 assert.equal(state.phase,'complete');
 // Guest seat 3 missed every hand: replay the complete history once, then replay it again.
 if(!players[3].isBot){for(const ev of state.career.events)cores[3].recordHand({...ev,localPeerId:'career-seat-3',isHost:false});const first=cores[3].stable(cores[3].read());for(const ev of state.career.events)cores[3].recordHand({...ev,localPeerId:'career-seat-3',isHost:false});assert.equal(cores[3].stable(cores[3].read()),first);assert.equal(cores[3].read().records.human.stats.gamesPlayed,1)}
 for(let i=0;i<4;i++)if(!players[i].isBot)assert.equal(cores[i].read().records.human.stats.gamesPlayed,1);
}
// Capture-specific receipts: specials, enemy rescue, big trick, personal/partner credit, nest, and Moon.
let s=e.createMatch(Array.from({length:4},(_,i)=>({playerId:''+i,name:'P'+i})),{});s.trump='black';const cards=[{color:'rook',id:'rook'},{color:'red',rank:2,id:'red-2'},{color:'black',rank:10,id:'b10'},{color:'green',rank:5,id:'g5'}];
let c=e.cloudCareerCapture(s,0,cards,{plays:cards.map((card,i)=>({player:i,card}))});assert.equal(c.stats[0].rookCaptures,1);assert.equal(c.stats[0].red2Captures,1);assert.equal(c.extras[0].red2Rescues,1);assert.equal(c.stats[0].points,c.stats[2].points);assert.equal(c.stats[0].bigTricks,1);assert.equal(c.stats[2].tricksWon,undefined);
console.log(JSON.stringify({pass:true,matches:24,hands,actions,claims,checks:'point conservation, all seat owners, unique IDs, claims, personal tricks, immutable event replay, missed-hand catchup, once-only match wins, special captures, partner credit'}));
s.bidder=0;s.bid=200;s.shotTheMoon=true;s.nestCards=[];
for(const made of [true,false]){const result={made,shotMoonResult:made?'made':'failed',matchResult:made?'Team A':'Team B',pointsA:made?200:100,pointsB:made?0:100,scores:made?[500,0]:[-100,100]};const c=e.cloudCareerFinish(s,result,0);assert.equal(c.stats[0].moonAttempts,1);assert.equal(c.stats[0].moonMade||0,Number(made));assert.equal(c.events[0].completed,true);assert.equal(c.events[0].winnerTeam,made?0:1)}
console.log('PASS Moon made/failed accounting and match completion');
