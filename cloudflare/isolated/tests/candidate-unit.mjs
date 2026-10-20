import assert from 'node:assert/strict';import fs from 'node:fs';
import {applyBid,createMatch,finishHand,RoomService,safeOptions,makeDeck} from './load-candidate.mjs';
const checks=[];const test=(name,f)=>{f();checks.push({name,pass:true})};
test('Negative score Moon is allowed',()=>{const input={phase:'bidding',currentPlayer:0,scores:[-195,150]};const r=applyBid(input,0,200,{scores:input.scores});assert(r.accepted);assert(r.state.shotTheMoon);});
test('Non-five and stale turn bids rejected',()=>{assert(!applyBid({phase:'bidding',currentPlayer:0},0,101).accepted);assert(!applyBid({phase:'bidding',currentPlayer:0},1,100).accepted)});
test('Target bounds and boolean options validated',()=>{assert.deepEqual(safeOptions({targetScore:2000,includeRed2:false,revealTopNest:false}),{targetScore:2000,includeRed2:false,revealTopNest:false});assert.equal(safeOptions({targetScore:1}).targetScore,1);assert.throws(()=>safeOptions({targetScore:0}));assert.throws(()=>safeOptions({targetScore:2001}));assert.throws(()=>safeOptions({includeRed2:'false'}));});
test('Moon takes every counter, permits zero-counter lost trick and wins from negative',()=>{
 const seats=Array.from({length:4},(_,i)=>({playerId:'p'+i,name:'P'+i}));const state=createMatch(seats);const deck=makeDeck();const zero=deck.find(c=>c.id==='green-6');
 const r=finishHand({...state,phase:'play',bidder:0,bid:200,shotTheMoon:true,scores:[-100,0],trump:'green',nestCards:[],tricksTaken:[deck.filter(c=>c!==zero),[zero]]},0);
 assert.equal(r.lastSummary.shotMoonResult,'made');assert.equal(r.matchResult,'Team A');assert.equal(r.scores[0],500);
});
test('Moon miss applies ordinary set penalty',()=>{
 const seats=Array.from({length:4},(_,i)=>({playerId:'p'+i,name:'P'+i}));const state=createMatch(seats);const deck=makeDeck();const counter=deck.find(c=>c.id==='green-5');
 const r=finishHand({...state,phase:'play',bidder:0,bid:200,shotTheMoon:true,scores:[0,0],trump:'green',nestCards:[],tricksTaken:[deck.filter(c=>c!==counter),[counter]]},1);
 assert.equal(r.lastSummary.shotMoonResult,'failed');assert.equal(r.scores[0],-200);assert.equal(r.scores[1],5);
});
const m=new Map(),db={async get(k){return structuredClone(m.get(k))},async put(k,v){m.set(k,structuredClone(v))},async delete(k){m.delete(k)}};const room=new RoomService(db);const a=await room.create('test','one','One','hw01','silent'),c=await room.join('test','two','Two',null,'hm01','male');await room.fillOpenSeatsWithBots('test',a.token);let v=await room.snapshot('test',a.token);assert.equal(v.players[0].avatar,'hw01');assert.equal(v.players[1].avatar,'hm01');assert.equal(v.players[0].voice,'silent');await room.startGame('test',a.token,{targetScore:1000,includeRed2:false,revealTopNest:false});v=await room.snapshot('test',a.token);assert.equal(v.targetScore,1000);assert.equal(v.rules.includeRed2,false);assert.equal(v.topNestCard,null);assert.equal(v.players[1].voice,'male');checks.push({name:'Approved avatars, voice and options survive start',pass:true});
fs.writeFileSync('candidate-unit-results.json',JSON.stringify(checks,null,2));console.log(JSON.stringify(checks));
