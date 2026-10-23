const {JSDOM}=require('jsdom');
const fs=require('fs');const assert=require('node:assert/strict');
const source=fs.readFileSync(process.argv[2]||'invite-v10b.js','utf8');
const tick=()=>new Promise(r=>setTimeout(r,30));
async function run(mode){
 const dom=new JSDOM(`<!doctype html><body><div id="lobby" class="joining"><div id="landingPanel783"><label for="hor-player-name">Name</label><input id="hor-player-name"><div class="identity-choice"><button class="identity-avatar">Avatar</button></div><form id="joinForm"><input id="hor-room-code"><div id="horInviteSeatPicker">${mode==='return'?'<button type="button" id="resume">Rejoin my reserved seat</button>':''}${[1,2,3].map(s=>`<button type="button" data-preferred-seat="${s}">${s}</button>`).join('')}</div><button id="joinConfirmBtn" type="button">Join</button></form><div id="lobbyStatus"></div></div></div><div id="waiting" class="hidden">${[0,1,2,3].map(s=>`<button class="wait-seat" id="waitSeat${s}"></button>`).join('')}<h2 id="friendsHeading803"></h2><div id="waitingStatus"></div><div id="friendsDock803"></div></div></body>`,{url:'https://rooks.jeromegriffin.com/?room=TST42',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,d=w.document;w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};w.GHR_CLOUD_INVITE='TST42';w.HOR_CLOUD_TEST_ACTIVE=true;
 w.localStorage.setItem('ghr-private-cloud-player-v1','guest');
 const saved={roomCode:'TST42',seat:0,playerId:'guest',token:'test-only-resume'};
 if(mode==='return')w.localStorage.setItem('ghr-private-cloud-seat-v1',JSON.stringify(saved));
 let selected=null,calls=0;
 d.querySelectorAll('[data-preferred-seat]').forEach(b=>b.onclick=()=>selected=Number(b.dataset.preferredSeat));
 if(d.getElementById('resume'))d.getElementById('resume').onclick=()=>selected=0;
 w.fetch=async (url,opts)=>({ok:true,json:async()=>({phase:'waiting',seats:[0,1,2,3].map(seat=>({seat,joinable:seat>0,occupied:seat===0 || (mode==='bots' && [1,3].includes(seat)),isBot:mode==='bots' && [1,3].includes(seat),name:seat===0?'Host':mode==='bots'&&seat!==2?'Crow':null}))})});
 w.joinRoom=async()=>{calls++;d.getElementById('lobby').classList.remove('joining');await tick();if(mode==='fail')return;
 w.localStorage.setItem('ghr-private-cloud-seat-v1',JSON.stringify(mode==='return'?saved:{roomCode:'TST42',seat:selected,playerId:'guest',token:'test-only-new'}));};
 try{
 w.eval(source);await tick();
 const field=d.getElementById('hor-player-name');
 assert.equal(field.parentElement.id,'ghGuestIdentityV10','preview owns original name');
 field.value='Guest';
 d.getElementById('lobby').classList.add('native-repaint');await tick();
 assert.equal(field.parentElement.id,'ghGuestIdentityV10','lobby repaint must not steal controls');
 if(mode==='cancel'){
 d.getElementById('ghPreviewCancelV10').click();await tick();assert.equal(field.parentElement.id,'landingPanel783');assert.equal(d.querySelectorAll('#hor-player-name').length,1);assert.equal(calls,0);
 }else{
 const seat=mode==='return'?0:mode==='bots'?1:2;
 if(mode==='bots'){
 for(const n of [1,3]) {assert.equal(d.getElementById('waitSeat'+n).disabled,false);assert.equal(d.getElementById('waitSeat'+n).dataset.previewFree,'false');assert.equal(d.getElementById('waitSeat'+n).textContent,'CrowTake this seat');assert.equal(d.getElementById('waitSeat'+n).dataset.previewJoinable,'true');}
 assert.equal(calls,0);assert.equal(d.getElementById('waitSeat2').dataset.previewFree,'true');
 assert.equal(w.GHR_INVITE_PREVIEW_SEATS.filter(p=>p.occupied).length,3);
 }
 if(mode==='return'){assert.equal(d.getElementById('waitSeat0').disabled,true);assert.equal(d.getElementById('ghPreviewResumeV10g').hidden,false);assert.match(d.getElementById('friendsHeading803').textContent,/Welcome back/);assert.equal(field.hidden,true);assert.equal(d.getElementById('waitSeat2').disabled,true);}
 d.getElementById(mode==='return'?'ghPreviewResumeV10g':'waitSeat'+seat).click();await tick();await tick();assert.equal(calls,1);
 if(mode==='fail') {assert.equal(field.parentElement.id,'ghGuestIdentityV10');assert.match(d.getElementById('ghPreviewMessageV10').textContent,/not confirmed/);assert.equal(field.value,'Guest');}
 else {assert.equal(d.getElementById('waiting').hasAttribute('data-guest-preview'),false);assert.equal(d.getElementById('ghGuestIdentityV10'),null);assert.equal(field.parentElement.id,'landingPanel783');assert.equal(JSON.parse(w.localStorage.getItem('ghr-private-cloud-seat-v1')).seat,seat);}
 }
 console.log('PASS',mode);
 }finally{w.close();}
}
(async()=>{for(const mode of ['fresh','return','fail','cancel','bots'])await run(mode);})().catch(e=>{console.error(e);process.exitCode=1;});
