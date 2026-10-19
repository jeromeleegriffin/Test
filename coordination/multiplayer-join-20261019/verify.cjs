const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');
const { EventEmitter } = require('events');
const sourcePath = process.argv[2] || 'join-review-game/game060.js';
const source = fs.readFileSync(sourcePath, 'utf8');
const names = ['joinRoom','setupConn','handleMessage','horNetSendRaw','horNetSend',
  'horAuthorizeIncoming844','horResumeToken844','horEnsureResume844','peerRoomId',
  'publicPlayersSnapshot','applyPlayersSnapshot','ensurePlayerSeats','seatedCount',
  'playerAtSeat','packPlayersBySeat','balanceTeams','hostAdmitAndClaim','hostClaimSeat',
  'hostTryReclaimSeat','horHasActiveTable','horClientIsPlaying','horMarkActiveTable',
  'sendTo','broadcast'];
const code = names.map(name => {
  const start = source.indexOf('function '+name+'(');
  assert(start >= 0, name);
  const next = source.slice(start+1).search(/\nfunction \w+\(/);
  return source.slice(start, next < 0 ? undefined : start+1+next);
}).join('\n');
let total = 0;
const results = [];
function test(name, fn) { if(process.env.CASE&&!name.includes(process.env.CASE))return; fn(); total++; results.push(name); }
function fixture(options={}) {
  const bus=[], errors=[], packets=[], timers=new Map(), storage=new Map();
  if(options.stale) storage.set('rookActiveTable','1');
  storage.set('horResume844:ABCD','known-resume');
  let now=0, timerId=0, guest, host, latest;
  class Wire extends EventEmitter {
    constructor(peer) { super(); this.peer=peer; this.open=true; }
    send(msg) { packets.push({from:this.side,msg:structuredClone(msg)}); bus.push(()=> {
      if(this.remote.open && !(options.dropWelcome && msg.type==='welcome'))
        this.remote.emit('data',structuredClone(msg));
    }); }
    close() { if(!this.open)return; this.open=false; this.emit('close');
      if(this.remote.open){this.remote.open=false;this.remote.emit('close');} }
  }
  function context(isHost) {
    const noop=()=>{};
    const ctx={console:{log:noop,warn:noop,error:(...e)=>errors.push(e.map(String).join(' '))},
      Date,JSON,Math,Set,crypto:require('crypto').webcrypto,window:{},
      document:{body:{classList:{contains:()=>!!options.playing&&!isHost}}},
      sessionStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
      APP_VERSION:'846-source-cleanup',isHost,game:options.playing&&!isHost?{phase:'play',myHand:[{id:'kept-card'}]}:null,
      players:isHost?[{id:'host',name:'Host',seat:0,isHost:true},{id:'b1',seat:1,isBot:true},{id:'b3',seat:3,isBot:true}]:[],
      myPeerId:isHost?'host':null,myName:isHost?'Host':'Audit Guest',myIndex:isHost?0:-1,
      roomCode:isHost?'ABCD':'',playerAvatars:{},beerSeats:[],
      pendingPreviewJoin:false,pendingWelcomeSeat:options.preferredSeat??null,joinedFromWelcome:!!options.welcome,
      isSpectator:!!options.spectator,isSoloPractice:false,peer:null,hostConnection:null,
      connMap:{},horPeerLastSeen:{},horLastHostSeenAt:0,horLobbyOperation043:0,
      joinInProgress:false,horHostCreateInProgress:false,horJoinConn:null,
      horTurnActions844:new Set(['bid','discard','trump','play','claimAllTrumps','declineClaim']),
      horExpOn:key=>key==='netSameIdResync',horDebugLog:noop,
      includeRed2:true,red2Points:20,targetScore:500,botDifficulty:'normal',revealTopNest:true,layDownWinningCards:true,
      ensurePreferredAvatar:()=> 'test',loadPreferredVoice:()=> 'silent',AVATARS:['test'],
      humanAvatarAllowed783:()=>true,avatarKey:x=>x,validHumanVoice:x=>x,
      horMyCareerProfile:()=>null,reconcileAvatarIdentities777:noop,refreshHumanPersona:noop,
      updateWaitingUI:noop,showWaiting:()=>ctx.route='waiting',showWelcomeScreen:()=>ctx.route='welcome',
      updateWelcomeSeats:noop,welcomeVisible:()=>false,route:options.playing?'game':'entry',
      saveSession:noop,horFlushOutbox:noop,horToast:noop,playSitSound:noop,
      hostCancelDisconnectGrace:noop,hostResyncClient:()=>ctx.resynced=true,broadcastState:noop,
      alert:noop,horVersionNum:v=>parseInt(v)||0,horForceUpdate:noop,normalizeTargetScore:x=>x,
      phoneLooksOffline:()=>false,peerOptions:()=>({}),statuses:[],
      setJoinStatus:s=>ctx.statuses.push(s),
      $:id=>id==='hor-room-code'?{value:'ABCD',removeAttribute:noop}:id==='hor-player-name'?{value:'Audit Guest'}:id==='joinFeedback841'?{hidden:false}:id==='messageArea'?{textContent:''}:null,
      setTimeout:(f,d)=>{timers.set(++timerId,{f,at:now+d});return timerId},
      clearTimeout:id=>timers.delete(id)};
    ctx.window._horStayInGame=!!options.stale || !!options.playing;
    vm.createContext(ctx);vm.runInContext(code,ctx);return ctx;
  }
  host=context(true);guest=context(false);
  const peers=[];
  guest.Peer=class extends EventEmitter {
    constructor(){super();peers.push(this);this.open=true;this.destroyed=false;}
    destroy(){this.destroyed=true;this.open=false;}
    reconnect(){}
    connect(){const c=new Wire('host'),h=new Wire(guest.myPeerId);
      c.side='guest';h.side='host';c.remote=h;h.remote=c;latest={c,h};
      if(options.noOpen){c.open=false;h.open=false;}
      vm.runInContext('setupConn(incoming)',Object.assign(host,{incoming:h}));
      bus.push(()=>{if(c.open)c.emit('open')});return c;}
  };
  const run=(ctx,js)=>vm.runInContext(js,ctx);
  const flush=()=>{let n=0;while(bus.length){assert(n++<200,'bounded bus');bus.shift()();}};
  const tick=ms=>{const end=now+ms;let n=0;while(true){const next=[...timers].filter(([,v])=>v.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;assert(n++<200,'bounded timers');now=next[1].at;timers.delete(next[0]);next[1].f();flush();}now=end;};
  const start=()=>{run(guest,'joinRoom()');peers.at(-1).emit('open','guest-'+peers.length);};
  return {guest,host,packets,errors,timers,storage,run,flush,tick,start,get wire(){return latest},get peers(){return peers}};
}

for(const stale of [false,true])for(const welcome of [false,true]) {
  test(`fresh join, stale=${stale}, invite screen=${welcome}`,()=>{
    const f=fixture({stale,welcome});f.start();f.flush();
    assert.equal(f.guest.route,welcome?'welcome':'waiting');
    assert.equal(f.guest.joinInProgress,false);assert.equal(f.timers.size,0);
    assert.equal(f.storage.has('rookActiveTable'),false);
    assert.equal(f.guest.window._horStayInGame,false);
    assert.equal(f.packets.find(p=>p.msg.type==='join').msg.reconnectToken844,'known-resume');
    f.run(f.guest,"hostConnection.send({type:'claimSeat',seat:2,id:myPeerId,name:myName})");f.flush();
    assert.equal(f.host.players.filter(p=>p.seat>=0).length,4);
    assert.equal(f.guest.players.filter(p=>p.seat>=0).length,4);
    assert.equal(f.guest.players.find(p=>p.id===f.guest.myPeerId).seat,2);
    assert(!f.packets.some(p=>p.msg.type==='players'&&p.msg.players.some(x=>x.reconnectToken844)));
    assert.deepEqual(f.errors,[]);
  });
}
test('silent host times out, releases attempt, ignores late welcome and permits retry',()=>{
  const f=fixture({stale:true,dropWelcome:true});f.start();f.flush();
  const old=f.wire.c;assert.equal(f.guest.joinInProgress,true);assert.equal(f.guest.route,'entry');
  f.tick(10000);assert.equal(f.guest.joinInProgress,false);assert.equal(f.guest.hostConnection,null);
  assert.match(f.guest.statuses.at(-1),/did not confirm/);assert.equal(f.guest.horLobbyCancel043,null);
  old.emit('data',{type:'welcome',yourId:'guest-1',hostVersion:'846-source-cleanup',players:[]});
  assert.equal(f.guest.route,'entry');f.start();assert.equal(f.peers.length,2);
  assert.deepEqual(f.errors,[]);
});
test('double tap does not destroy handshake',()=>{
  const f=fixture();f.start();f.run(f.guest,'joinRoom()');assert.equal(f.peers.length,1);
  f.flush();assert.equal(f.guest.route,'waiting');assert.deepEqual(f.errors,[]);
});
test('cancellation ignores queued and late packets',()=>{
  const f=fixture();f.start();const old=f.wire.c;
  f.run(f.guest,'horLobbyCancel043()');f.flush();
  old.emit('data',{type:'welcome',yourId:'guest-1',players:[]});
  assert.equal(f.guest.route,'entry');assert.equal(f.timers.size,0);assert.deepEqual(f.errors,[]);
});
test('wrong recipient welcome does not count as admission',()=>{
  const f=fixture({dropWelcome:true});f.start();f.flush();
  f.wire.c.emit('data',{type:'welcome',yourId:'someone-else',players:[]});
  assert.equal(f.guest.joinInProgress,true);f.tick(10000);
  assert.match(f.guest.statuses.at(-1),/did not confirm/);assert.deepEqual(f.errors,[]);
});
test('preferred partner seat appears identically at both ends',()=>{
  const f=fixture({stale:true,preferredSeat:2});f.start();f.flush();
  for(const ctx of [f.host,f.guest])assert.equal(ctx.players.find(p=>p.id===f.guest.myPeerId).seat,2);
  assert.deepEqual(f.errors,[]);
});
test('spectator admission does not claim a seat',()=>{
  const f=fixture({stale:true,spectator:true});f.start();f.flush();
  assert.equal(f.guest.route,'waiting');assert.equal(f.guest.myIndex,-1);
  assert.equal(f.host.players.length,3);assert.equal(f.guest.joinInProgress,false);assert.deepEqual(f.errors,[]);
});
test('in-game welcome preserves screen, cards and active flags',()=>{
  const f=fixture({playing:true,stale:true});f.start();f.flush();
  assert.equal(f.guest.route,'game');assert.equal(f.storage.get('rookActiveTable'),'1');
  assert.equal(f.guest.window._horStayInGame,true);assert.equal(f.guest.game.myHand[0].id,'kept-card');
  assert.deepEqual(f.errors,[]);
});
test('new peer uses saved credential to reclaim exact seat and hand',()=>{
  const f=fixture();f.host.game={phase:'play',hands:[['a'],['b'],['original-hand'],['d']]};
  f.host.players.push({id:'old-guest',name:'Audit Guest',seat:2,team:0,disconnected:true,reconnectToken844:'known-resume'});
  const before=JSON.stringify(f.host.game.hands);f.start();f.flush();
  const p=f.host.players.find(p=>p.id==='guest-1');assert.equal(p.seat,2);assert.equal(p.team,0);
  assert.equal(JSON.stringify(f.host.game.hands),before);assert.equal(f.host.resynced,true);assert.deepEqual(f.errors,[]);
});
test('host rejection releases join immediately',()=>{
  const f=fixture();f.host.game={phase:'play'};
  f.host.players.push({id:'other-human',seat:2});f.start();f.flush();
  assert.equal(f.guest.joinInProgress,false);assert.equal(f.guest.hostConnection,null);
  assert.match(f.guest.statuses.at(-1),/Room full/);assert.deepEqual(f.errors,[]);
});
test('transport never opens: bounded retries release the join',()=>{
  const f=fixture({noOpen:true});f.start();f.flush();f.tick(30000);
  assert.equal(f.guest.joinInProgress,false);assert.equal(f.guest.hostConnection,null);
  assert.equal(f.timers.size,0);assert.equal(f.peers[0].destroyed,true);
  assert.match(f.guest.statuses.at(-1),/Could not link/);
  assert.deepEqual(f.errors,[]);
});
test('version rejection cancels acknowledgement wait',()=>{
  const f=fixture({dropWelcome:true});f.start();f.flush();
  f.wire.c.emit('data',{type:'versionMismatch',hostVersion:'845',hostIsStale:false});
  assert.equal(f.guest.joinInProgress,false);assert.equal(f.guest.hostConnection,null);
  assert.equal(f.guest.horLobbyCancel043,null);assert.deepEqual(f.errors,[]);
});
test('abandoned transport cannot apply data or trigger reconnect',()=>{
  const f=fixture();f.start();f.flush();const old=f.wire.c;
  f.guest.hostConnection={open:true};
  old.emit('data',{type:'players',players:[]});old.emit('error',{type:'network'});old.emit('close');
  assert(f.guest.players.length>0);assert.equal(f.guest.hostConnection.open,true);assert.deepEqual(f.errors,[]);
});
console.log(JSON.stringify({source:sourcePath,passed:total,tests:results,scope:'Actual application functions in two VM clients; deterministic transport, time and presentation substitutes. Not real WAN or physical Android.'},null,2));
