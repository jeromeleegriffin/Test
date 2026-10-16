const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root='landscape-candidate/';const tick=async()=>{for(let i=0;i<8;i++)await new Promise(r=>setImmediate(r));};
async function main(){
 let sources=[],active=0,maxActive=0,requested=[],store={},callbacks={};
 const ctx={decodeAudioData:async b=>({tag:b}),createBufferSource(){const s={connect(){},disconnect(){},start(){this.playing=true;active++;maxActive=Math.max(maxActive,active);sources.push(this);},stop(){if(this.playing){this.playing=false;active--;this.onended?.();}}};return s;},createGain:()=>({gain:{value:1},connect(){},disconnect(){}})};
 const c=vm.createContext({window:{HORAudioMixer:{voicesAllowed:()=>true,output:()=>({})}},document:{hidden:false,addEventListener:(n,f)=>{callbacks[n]=f},body:{classList:{contains:()=>true}}},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=v},sessionStorage:{getItem:()=>null,setItem(){}},addEventListener(){},MutationObserver:class{observe(){}},crypto:{randomUUID:()=>String(Math.random())},queueMicrotask,setTimeout,clearTimeout,performance,Set,Map,console,
  players:[{id:'jerome',name:'Jerome',avatar:'jerome_founder',isBot:false,team:0,voice:'male'},{id:'other',name:'Other',avatar:'hw01',team:1,isBot:true}],playerAvatars:{},game:{phase:'bidding',careerMatchId:'match'},handHistory:[],isHost:true,myIndex:0,soundMuted:false,ensureAudio:()=>ctx,whenAudioReady:f=>f(ctx),broadcast(){},fetch:async path=>{assert(fs.existsSync(root+path.split('?')[0]),path);requested.push(path);return{ok:true,arrayBuffer:async()=>path}}});
 for(const file of ['voice-queue.js','jerome-voice-lines.js','trump-voice.js','human-bid-voices801.js'])vm.runInContext(fs.readFileSync(root+file,'utf8'),c);
 const api=c.window.HORBidVoice801,lines=c.window.HORJeromeVoiceLines,queue=c.window.HORVoiceQueue;
 const drain=async()=>{await tick();while(sources.some(s=>s.playing)){sources.find(s=>s.playing).stop();await tick();}};
 assert.equal(api.genderFor(c.players[0]),'jerome');c.players[0].isBot=true;assert.equal(api.genderFor(c.players[0]),'jerome');c.players[0].isBot=false;
 api.announce(0,'bid',180);api.announce(0,'bid',185);await tick();assert.equal(active,1);await drain();assert(requested.some(x=>x.endsWith('/180.mp3')));assert(requested.some(x=>x.endsWith('/185.mp3')));
 for(let i=0;i<3;i++){api.announce(0,'pass',0);await drain();}assert.deepEqual(requested.filter(x=>/pass-/.test(x)),['voices/jerome/events/pass-1.mp3','voices/jerome/events/pass-2.mp3']);
 // Repeat declarations with fresh packet IDs stay silent for the same hand.
 for(let i=0;i<3;i++){c.game={phase:'bidding',careerMatchId:'match'};api.announce(0,'shootMoon',200);api.announce(0,'shootMoon',200);await drain();}
 assert.deepEqual(requested.filter(x=>/events\/moon/.test(x)),[1,2,3].map(n=>'voices/jerome/events/moon-'+n+'.mp3'));
 c.game={phase:'bidding',careerMatchId:'match'};api.announce(0,'bid',100);await tick();
 const preview=c.window.HORTrumpVoice.preview('jerome_founder','male');await tick();assert.equal(active,1);sources.find(s=>s.playing).stop();await tick();assert.equal(await preview,true);assert.equal(active,1);await drain();assert.equal(maxActive,1);
 // Three real trump takes rotate; a silent selection does not announce.
 const red=[lines.resolve('jerome','trump','red'),lines.resolve('jerome','trump','red'),lines.resolve('jerome','trump','red')];assert.equal(new Set(red).size,3);
 c.players[0].voice='silent';const count=requested.length;api.announce(0,'pass');await drain();assert.equal(requested.length,count);c.players[0].voice='male';
 // Stale decode is discarded when hand/identity changes.
 c.game={phase:'bidding',careerMatchId:'match'};api.announce(0,'bid',195);c.game={phase:'score',careerMatchId:'match'};await drain();assert.equal(active,0);
 c.game={phase:'score',careerMatchId:'match'};let summary={made:false,bidderTeam:0,careerEvent:{matchId:'match',hand:1,completed:false}};c.handHistory.push(summary);lines.result(summary);lines.result(summary);await drain();assert.equal(requested.filter(x=>/got-set/.test(x)).length,1);
 const categories=[['setOpponent',true,false],['matchWin',true,true],['matchLose',false,true]];
 for(const [category,won,completed] of categories){summary={made:false,bidderTeam:1,careerEvent:{matchId:'match',hand:c.handHistory.length+1,completed,winnerTeam:won?0:1}};c.handHistory.push(summary);lines.result(summary);await drain();}
 assert.equal(maxActive,1);assert.equal(active,0);
 assert.equal(c.window.HORTrumpVoice.voiceFor('jerome_founder'),'jerome');
 for(const gender of ['male','female']){const seq=[lines.resolve(gender,'shootMoon'),lines.resolve(gender,'shootMoon'),lines.resolve(gender,'shootMoon')];assert(seq[0].includes('moon-1'));assert(seq[1].includes('moon-2'));assert.equal(seq[0],seq[2]);}
 c.game={phase:'bidding',careerMatchId:'match'};c.players[1].avatar='rita';api.announce(1,'bid',100);api.announce(0,'pass');await drain();assert(requested.some(x=>x.includes('female/100.mp3')));assert.equal(maxActive,1);
 assert(Object.keys(JSON.parse(store.horVoiceRotationV1)).length>0);
 // A denied audio unlock must release the shared queue rather than pin it forever.
 let deadline=null,ended=false;const qctx=vm.createContext({window:{HORAudioMixer:{output:()=>({})}},document:{hidden:false,addEventListener(){}},queueMicrotask,setTimeout:f=>{deadline=f;return 1},clearTimeout(){},whenAudioReady(){}});
 vm.runInContext(fs.readFileSync(root+'voice-queue.js','utf8'),qctx);qctx.window.HORVoiceQueue.enqueueBuffer({}, {id:'blocked',owner:'test',valid:()=>true,onEnd:()=>ended=true});await tick();assert.equal(qctx.window.HORVoiceQueue.inspect().active,'blocked');deadline();await tick();assert(ended);assert.equal(qctx.window.HORVoiceQueue.inspect().active,null);
 console.log(JSON.stringify({status:'PASS',maxSimultaneousSpokenSources:maxActive,started:sources.length,checks:['Jerome bot/human authentic bank','180/185 separate paths','Pass rotation','Three Moon takes','Duplicate Moon suppression','Bid/trump serialization','Three trump takes','Silent','Stale hand cancellation','Result deduplication','Result categories','Other voices retain two Moon takes','Rotation persisted']}));
}
main().catch(e=>{console.error(e);process.exitCode=1});
