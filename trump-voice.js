/* Owner-provided TTSMaker recordings. Presentation only: never writes game state. */
(function(){
 'use strict';
 const colors=['black','green','red','yellow'];
 // Voice casting for the existing fictional portrait assets, not player identity.
 const male=new Set('barrel cobalt copper dice drift fang finch flint frost gable grit halo harrier hearth hollow marrow moss pike quill titan jerome'.split(' '));
 const cache=new Map();let previous=null,event=null,serial=0,source=null;const history=[];
 function record(type,detail){history.push({type,...detail});if(history.length>80)history.shift();}
 // Explicit owner-authorized Character Studio casting; existing chooser/trigger untouched.
 const characterVoices=Object.freeze({dagger:'male',cinder:'female',crow:'female',sofia:'female',rafael:'male',samir:'male',claire:'female',june:'female',tess:'female',marcus:'male',owen:'male',daniel:'male'});
 function voiceFor(avatar){if(characterVoices[String(avatar||'').toLowerCase()])return characterVoices[String(avatar).toLowerCase()];return male.has(String(avatar||'').toLowerCase())?'male':'female';}
 function volume(){const v=window.he064Volumes?.gameplay;return Math.max(0,Math.min(1,Number.isFinite(v)?v:(window.he064Gain?window.he064Gain('card'):1)));}
 function allowed(){return !document.hidden && document.body.classList.contains('in-game') && typeof soundMuted!=='undefined' && !soundMuted && soundCard && volume()>0;}
 function stop(reason){serial++;event=null;if(source){try{source.stop();}catch(_){}source=null;}record('stop',{reason});}
 function load(voice,color){const key=voice+'-'+color;if(!cache.has(key))cache.set(key,fetch('assets/trump-voice/'+key+'.wav').then(r=>{if(!r.ok)throw Error('voice asset '+r.status);return r.arrayBuffer();}).then(b=>ensureAudio().decodeAudioData(b)).catch(()=>{cache.delete(key);return null;}));return cache.get(key);}
 function preload(){for(const voice of ['female','male'])for(const color of colors)load(voice,color);}
 function announce(e){
  const token=serial,requested=performance.now();
  if(!allowed()){record('suppressed',{color:e.color});return;}
  load(e.voice,e.color).then(buffer=>{
   if(!buffer||token!==serial||event!==e||!allowed()||performance.now()-requested>750)return;
   whenAudioReady(ctx=>{
    if(token!==serial||event!==e||!allowed()||performance.now()-requested>750)return;
    const s=ctx.createBufferSource(),gain=ctx.createGain();s.buffer=buffer;
    gain.gain.value=.8*volume();
    s.connect(gain);gain.connect(ctx.destination);source=s;
    if(typeof presentationSounds035!=='undefined')presentationSounds035.add(s);
    s.onended=()=>{if(source===s)source=null;if(typeof presentationSounds035!=='undefined')presentationSounds035.delete(s);s.disconnect();gain.disconnect();};
    s.start();record('played',{color:e.color,voice:e.voice,avatar:e.avatar,chooser:e.chooser});
   });
  });
 }
 function sync(g,avatars){
  if(!g||!document.body.classList.contains('in-game')){stop('no-game');previous=null;return;}
  const now={phase:g.phase,hand:g.handNumber,color:g.trump};
  if(previous&&previous.hand!==now.hand){stop('new-hand');previous=null;}
  if(g.phase!=='play'&&event)stop('phase-change');
  if(previous&&previous.phase==='trump'&&g.phase==='play'&&colors.includes(g.trump)&&Number.isInteger(g.bidder)&&g.players?.[g.bidder]){
   stop('new-choice');const p=g.players[g.bidder];
   const avatar=avatars?.[p.id]||p.avatar||((typeof AVATARS!=='undefined')?AVATARS[g.bidder%AVATARS.length]:'rookling');
   const choice=!p.isBot&&['male','female','silent'].includes(p.voice)?p.voice:voiceFor(avatar);
   event={color:g.trump,chooser:g.bidder,avatar,voice:choice};if(choice!=='silent')announce(event);else record('suppressed',{reason:'player-silent',color:g.trump});
  }
  if(!allowed()&&source)stop('muted-or-hidden');
  previous=now;
 }
 addEventListener('pagehide',()=>{stop('pagehide');previous=null;});
 document.addEventListener('input',e=>{if(e.target?.matches('[data-vol=gameplay]')&&Number(e.target.value)===0)stop('zero-volume');});
 document.addEventListener('pointerdown',preload,{once:true,passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop('hidden');});
 new MutationObserver(()=>{if(!document.body.classList.contains('in-game')){stop('left-table');previous=null;}}).observe(document.body,{attributes:true,attributeFilter:['class']});
 window.HORTrumpVoice={sync,stop,preload,voiceFor,getState:()=>({event,playing:!!source,history:history.slice()})};
})();
