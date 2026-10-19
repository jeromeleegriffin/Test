const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
let clock=0,seq=0;const timers=new Map(),events={},decoded=[];
const preferences=new Map([['horAmbientSoundsV1',JSON.stringify({thunder:100,stormMinutes:6,rain:43,cricketRate:2,crickets:71})]]);
const later=(fn,delay)=>{const id=++seq;timers.set(id,{at:clock+delay,fn});return id;};
const param=()=>({value:1,setValueAtTime(){},linearRampToValueAtTime(){},setTargetAtTime(){},cancelScheduledValues(){}});
class AudioContext {
  constructor(){this.state='running';}
  get currentTime(){return clock/1000;}
  resume(){this.state='running';return Promise.resolve();}
  suspend(){this.state='suspended';return Promise.resolve();}
  createGain(){return {gain:param(),connect(){},disconnect(){}};}
  createBuffer(channels,length,rate){return {duration:length/rate,getChannelData:()=>new Float32Array(length)};}
  createBufferSource(){let ending;const source={connect(){},disconnect(){},start(){},stop(at=clock/1000){timers.delete(ending);ending=later(()=>source.onended?.(),Math.max(0,at*1000-clock));}};return source;}
}
const document={hidden:false,readyState:'complete',body:{classList:{contains:()=>true}},getElementById:()=>null,addEventListener:(name,fn)=>events[name]=fn};
const context={window:{AudioContext,HORAudioMixer:{output:()=>({})},HORCabinSamples:new Proxy({},{get:(o,name)=>{decoded.push(name);return Buffer.alloc(24).toString('base64');}}),addEventListener:(n,f)=>events[n]=f},document,
  localStorage:{getItem:k=>preferences.get(k)||null,setItem:(k,v)=>preferences.set(k,v)},
  atob:s=>Buffer.from(s,'base64').toString('binary'),Math:Object.assign(Object.create(Math),{random:()=>0.5}),Date:{now:()=>clock},setTimeout:later,clearTimeout:id=>timers.delete(id),MutationObserver:class{observe(){}},console};
vm.runInNewContext(fs.readFileSync(process.argv[2]||'no-thunder-review-game/cabin-ambience041.js','utf8'),context);
(async()=>{
 const api=context.window.CabinAmbience041;assert(!('thunder' in api.settings()));assert(!('stormMinutes' in api.settings()));
 assert.equal(api.settings().rain,43);assert.equal(api.settings().crickets,71);assert.equal(api.settings().cricketRate,2);
 api.setSound('thunder',100);api.setSound('stormMinutes',6);assert(!('thunder' in api.settings()));
 events.pointerdown();await Promise.resolve();await api.sync();
 let callbacks=0;const names=new Set();
 while(true){const next=[...timers].filter(([,v])=>v.at<=3600000).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;
   assert(callbacks++<2000);clock=next[1].at;timers.delete(next[0]);next[1].fn();await Promise.resolve();
   for(const v of api.inspect().voices)names.add(v.name);assert(!names.has('thunder'));
 }
 assert(decoded.includes('rain'));assert(decoded.includes('crickets'));assert(decoded.includes('wind'));assert(decoded.includes('fire'));assert(!decoded.includes('thunder'));
 document.hidden=true;await api.sync();assert.equal(api.inspect().running,false);
 document.hidden=false;await api.sync();assert.equal(api.inspect().running,true);assert(!('stormDue' in api.inspect()));
 api.stop();assert.equal(api.inspect().running,false);
 const result={status:'PASS',simulatedVisiblePlayMinutes:60,timerCallbacks:callbacks,legacyThunderPreferencesIgnored:true,remainingPreferencesPreserved:true,obsoleteControlsRejected:true,thunderVoiceOrBufferPlayed:false,decodedRemainingSounds:[...new Set(decoded)],hiddenStopAndVisibleResume:true,scope:'Actual ambience module with deterministic clock, audio and DOM substitutes; not subjective listening.'};
 console.log(JSON.stringify(result,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
