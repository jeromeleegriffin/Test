import assert from 'node:assert/strict';
import {project, relativeSeat, tossOffset, createPlayLedger} from './overhead-model.mjs';
const game = {phase:'play',handNumber:1,currentPlayer:2,bidder:0,bid:130,
  scores:[0,0],players:[0,1,2,3].map(i=>({name:'P'+i,avatar:'avatar'+i})),
  myHand:[{id:'green14',color:'green',rank:14}],trick:[]};
Object.defineProperty(game,'hands',{get(){throw new Error('Private hands read');}});
const before = JSON.stringify(game);
for (let localSeat=0;localSeat<4;localSeat++) {
  const m=project({game,localSeat,publicCounts:[10,9,8,7]});
  assert.equal(m.seats[localSeat].position,'bottom');
  assert.equal(relativeSeat((localSeat+1)%4,localSeat),'left');
  assert.equal(relativeSeat((localSeat+2)%4,localSeat),'top');
  assert.equal(relativeSeat((localSeat+3)%4,localSeat),'right');
  assert.ok(m.seats.every(s=>s.missingPose));
  assert.ok(!JSON.stringify(m).includes('hands'));
}
const spectator=project({game,localSeat:-1,spectator:true});
assert.deepEqual(spectator.myHand,[]);
assert.ok(spectator.seats.every(s=>s.count===null));
const m=project({game,localSeat:0,poses:{avatar0:'jerome.png'}});
assert.throws(()=>{m.myHand[0].rank=1;},TypeError);
assert.equal(JSON.stringify(game),before);
assert.equal(m.seats[0].pose,'jerome.png');
assert.equal(m.seats[1].pose,null);
const sparse=project({game:{...game,players:[{seat:3,name:'Actual right',avatar:'crow'}]},localSeat:0});
assert.equal(sparse.seats[3].name,'Actual right');
assert.equal(sparse.seats[0].name,'');
const ledger=createPlayLedger();
assert.deepEqual(ledger.observe('room/match',m),[]);
game.trick.push({player:1,card:{id:'red5',color:'red',rank:5}});
const played=project({game,localSeat:0});
const fresh=ledger.observe('room/match',played);
assert.equal(fresh.length,1);
for(let i=0;i<20;i++) {
  assert.deepEqual(ledger.observe('room/match',played),[]);
  assert.deepEqual(tossOffset(fresh[0]),tossOffset(fresh[0]));
}
assert.deepEqual(createPlayLedger().observe('room/match',played,{snapshot:true}),[]);
assert.deepEqual(ledger.observe('new-match',played),[]);
console.log('PASS: seat mapping; private-hand exclusion; spectator privacy; immutable projection; identity mapping; rotation/render deduplication; snapshot priming; stable toss offsets. Not a gameplay/browser test.');
