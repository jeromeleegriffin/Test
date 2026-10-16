const fs=require('fs'),vm=require('vm'),assert=require('assert');
class Node{constructor(){this.children=[];this.style={};this.dataset={};this.attrs={};}append(n){this.children.push(n)}replaceChildren(){this.children=[]}setAttribute(k,v){this.attrs[k]=v}}
const theater=new Node(),ctx={window:{HORAngleC:{active:()=>true,frame:()=>({left:0,top:0,scale:1})}},document:{body:new Node(),getElementById:id=>id==='landscapeTheater'?theater:null,createElement:()=>new Node()},addEventListener(){},MutationObserver:class{observe(){}}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('landscape-candidate/angle-c-hands.js','utf8'),ctx);const api=ctx.window.HORAngleCHands;
const players=Array.from({length:4},(_,i)=>({id:'id'+i,name:'Player '+i}));let checks=0;
for(let local=0;local<4;local++)for(const counts of [[10,10,10,10],[0,1,5,16],[9,10,9,10]]){const rows=api.model({players,counts,localSeat:local,phase:'play'});assert.deepEqual(Array.from(rows,r=>r.seat),[1,2,3].map(n=>(local+n)%4));for(const r of rows){assert.equal(r.count,counts[r.seat]);assert(!('cards'in r));}api.sync({players,counts,localSeat:local,phase:'play'});const root=theater.children[0];assert.equal(root.children.length,3);for(let i=0;i<3;i++)assert.equal(root.children[i].children.length,rows[i].count+1);checks++;}
api.sync({players,counts:[10,undefined,-1,17],localSeat:0,phase:'play'});assert.equal(theater.children[0].children.length,0);
for(const phase of ['score','dealing','lobby'])assert.equal(api.model({players,counts:[10,10,10,10],localSeat:0,phase}).length,0);
assert.equal(api.model({players,counts:[10,10,10,10],localSeat:-1,phase:'play'}).length,0);
const snapshot={players,counts:[10,10,10,10],localSeat:0,phase:'bidding',get hands(){throw Error('Private hands accessed')}};api.sync(snapshot);
ctx.window.HORAngleC.active=()=>false;api.sync(snapshot);assert.equal(theater.children[0].hidden,true);
console.log(checks+' seat/count render cases passed; private hands never read; invalid counts hidden; score/deal/spectator empty; portrait hidden.');
