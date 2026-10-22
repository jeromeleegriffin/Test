import fs from 'node:fs';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
if (!globalThis.crypto) globalThis.crypto=webcrypto;
const file=new URL('./seat-selection-worker-candidate-20261022.mjs', import.meta.url);
const source=fs.readFileSync(file,'utf8')
  .replace('import { DurableObject } from "cloudflare:workers";',
    'class DurableObject {constructor(ctx){this.ctx=ctx}}')
  +'\nexport {RoomService};';
const {RoomService}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
let counter=0;
const store=new Map();
const storage={
 get:async key=>structuredClone(store.get(key)),
 put:async (key,value)=>store.set(key,structuredClone(value))
};
const svc=new RoomService(storage, {tokenFactory:()=> 'token-'+(++counter)});

const host=await svc.create('t1','host','Host','hm01');
assert.equal(host.seat,0);
let preview=await svc.seatOptions('t1');
assert.deepEqual(preview.seats.filter(s=>s.joinable).map(s=>s.seat),[1,2,3]);
assert.equal(preview.seats[0].joinable,false);

// Guest deliberately chooses host's partner seat, not first empty seat.
const partner=await svc.join('t1','guest1','Ember',null,'ember','avatar',2);
assert.equal(partner.seat,2);
preview=await svc.seatOptions('t1');
assert.equal(preview.seats[2].occupied,true);
assert.equal(preview.seats[2].joinable,false);
assert.equal(preview.seats[2].name,'Ember');
assert.deepEqual(preview.seats.filter(s=>s.joinable).map(s=>s.seat),[1,3]);

// A stale guest request for the partner seat fails without stealing it.
await assert.rejects(svc.join('t1','guest2','Crow',null,'crow','avatar',2),/SEAT_OCCUPIED/);
assert.equal((await svc.seatOptions('t1')).seats[2].name,'Ember');

// Invalid seat and host seat must not be claimable.
for (const seat of [0,4,-1,1.5,'2']) {
 await assert.rejects(svc.join('t1','bad-'+seat,'Bad',null,'crow','avatar',seat),/INVALID_SEAT/);
}
const opponent=await svc.join('t1','guest2','Crow',null,'crow','avatar',3);
assert.equal(opponent.seat,3);
// Reconnect must always return the reserved seat, ignoring a new preference.
const restored=await svc.join('t1','guest1','Ember',partner.token,'ember','avatar',1);
assert.equal(restored.seat,2);
assert.equal(restored.token,partner.token);
await assert.rejects(svc.join('t1','guest1','Ember','wrong-token','ember','avatar',1),/PLAYER_ALREADY_SEATED/);
const last=await svc.join('t1','guest3','Grit',null,'grit','avatar',1);
assert.equal(last.seat,1);
assert.deepEqual((await svc.seatOptions('t1')).seats.filter(s=>s.joinable),[]);
await assert.rejects(svc.join('t1','guest4','NewGuest',null,'hm01','avatar',3),/SEAT_OCCUPIED/);

// Backwards compatibility: old guest path with no requestedSeat still gets next empty.
await svc.create('t2','h2','Host2');
const legacy=await svc.join('t2','l1','LegacyGuest');
assert.equal(legacy.seat,1);

// Existing host-owned bot seat can be replaced predeal, but not a human.
const firstPreview=await svc.seatOptions('t2');
await svc.setBotSeat('t2',(await svc.join('t2','l2','Partner',null,'ember','avatar',2)).token,{seat:3,name:'Crow',expectedRevision:firstPreview.revision+1})
  .then(()=>assert.fail('Guest must not set bot'),err=>assert.match(err.message,/HOST_ONLY/));
const current=(await svc.seatOptions('t2')).revision;
await svc.setBotSeat('t2',(await svc.join('t2','l3','Other',null,'grit','avatar',3)).token,{seat:3,name:'Crow',expectedRevision:current+1})
  .then(()=>assert.fail('Guest must not replace human'),err=>assert.match(err.message,/HOST_ONLY/));

console.log('PASS: seat selection, availability, occupied-seat rejection, return-seat token safety, invalid seats, legacy join');