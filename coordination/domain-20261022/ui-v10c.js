/* Invitation UI: one seat map, keyboard-safe identity form, verified resume. */
(() => {
  if (location.hostname !== 'rooks.jeromegriffin.com') return;
  const style=document.createElement('style');
  style.id='ghInvitationClarityV10c';
  style.textContent=`
    body #waiting.friends803[data-guest-preview="true"] #friendsDock803{display:block!important;grid-template-columns:none!important;box-sizing:border-box!important;width:calc(100% - 24px)!important;max-width:560px!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;bottom:12px!important;padding:0!important}
    body #waiting.friends803[data-guest-preview="true"] #ghGuestIdentityV10{width:100%!important;min-width:0!important;grid-column:1/-1!important;max-height:calc(100dvh - 24px);overflow:auto}
    body #waiting.friends803[data-guest-preview="true"] :is(#waitSeat0,#waitSeat1,#waitSeat2,#waitSeat3).wait-seat[data-preview-free="true"] > *{display:none!important}
    body #waiting.friends803[data-cloud-guest="true"]:not([data-guest-preview]) :is(#waitSeat0,#waitSeat1,#waitSeat2,#waitSeat3).wait-seat.friends-empty > *{display:none!important}
    body #waiting.friends803[data-cloud-guest="true"]:not([data-guest-preview]) .wait-seat.friends-empty::after{content:"Open seat";font:600 13px Georgia;color:#f7e6b8}
    body #waiting.friends803[data-cloud-guest="true"]:not([data-guest-preview]) .wait-seat.friends-empty{pointer-events:none!important}
    body #waiting.friends803[data-guest-preview="true"] .wait-seat::before{display:none!important;content:none!important}
    body #waiting.friends803[data-guest-preview="true"] #friendsSeatHint803{display:none!important}
    body #waiting.friends803[data-guest-preview="true"] #friendsCenter804{bottom:255px!important;top:auto!important}
    body #waiting.friends803[data-guest-preview="true"] .wait-seat[data-position="me"]{bottom:230px!important}
    body #waiting.friends803[data-guest-preview="true"][data-name-editing="true"] #friendsCenter804{display:none!important}
    body #waiting.friends803[data-guest-preview="true"] #ghGuestIdentityV10 .identity-avatar{flex-basis:auto!important;white-space:normal!important;margin:0!important;height:48px!important;min-height:48px!important}
    body #waiting.friends803[data-guest-preview="true"] #ghGuestIdentityV10 .identity-choice{margin:0!important}
    body #waiting.friends803[data-guest-preview="true"] #ghGuestIdentityV10 .identity-avatar span{display:flex!important;align-items:center!important;gap:7px!important;flex-wrap:wrap!important;line-height:20px!important}
    body #waiting.friends803[data-guest-preview="true"] #ghGuestIdentityV10 .identity-avatar span small{font:12px/20px system-ui!important;margin:0!important}
    body #waiting.friends803[data-guest-preview="true"] #ghGuestIdentityV10 .identity-avatar span strong{font:700 14px/20px system-ui!important;margin:0!important}
    body #waiting.friends803[data-guest-preview="true"] :is(#waitSeat1,#waitSeat2,#waitSeat3).wait-seat{border:0!important;background:transparent!important;box-shadow:none!important;padding:0!important;width:90px!important;max-width:25%!important}
    body #waiting.friends803[data-guest-preview="true"] #waitSeat1[data-position="left"]{left:15%!important}
    body #waiting.friends803[data-guest-preview="true"] #waitSeat3[data-position="right"]{left:85%!important}
    body #reconnectBox:not([data-verified-open="true"]){display:none!important}
    @media(max-height:500px){
      body #waiting.friends803[data-guest-preview="true"] #friendsCenter804{display:none!important}
      body #waiting.friends803[data-guest-preview="true"] #ghGuestIdentityV10{gap:4px!important;padding:6px 10px!important}
      body #waiting.friends803[data-guest-preview="true"] #ghGuestIdentityV10 .identity-avatar{min-height:34px!important}
      body #waiting.friends803[data-guest-preview="true"] #ghGuestIdentityV10 .identity-avatar img{width:28px!important;height:28px!important}
      body #waiting.friends803[data-guest-preview="true"] .wait-seat[data-position="me"]{display:none!important}
    }
  `;
  document.head.append(style);
  document.addEventListener('focusin',e=>{if(e.target.id==='hor-player-name')document.getElementById('waiting')?.setAttribute('data-name-editing','true')});
  document.addEventListener('focusout',e=>{if(e.target.id==='hor-player-name')document.getElementById('waiting')?.removeAttribute('data-name-editing')});

  const key='ghr-private-cloud-seat-v1';
  let checking=false,verified=null,lastCheck=0;
  function read(){try{return localStorage.getItem(key)}catch(_){return null}}
  function paint(){
    const box=document.getElementById('reconnectBox');
    if(!box)return;
    const open=!!verified&&read()===verified;
    box.toggleAttribute('data-verified-open',open);
    if(open)box.setAttribute('data-verified-open','true');
    box.classList.toggle('hidden',!open);
  }
  async function check(force=false){
    const raw=read();
    if(!raw){verified=null;paint();return;}
    if(checking)return;
    if(!force&&raw===verified&&Date.now()-lastCheck<15000){paint();return;}
    let saved;try{saved=JSON.parse(raw)}catch(_){verified=null;paint();return;}
    if(!saved?.roomCode||!saved?.token){verified=null;paint();return;}
    checking=true;verified=null;paint();
    try{
      const response=await fetch('/rooms/'+encodeURIComponent(saved.roomCode)+'/snapshot',{cache:'no-store',headers:{Authorization:'Bearer '+saved.token}});
      const data=await response.json().catch(()=>({}));
      if(read()!==raw)return;
      if(response.ok&&data.phase&&data.phase!=='closed')verified=raw;
      else if(['ROOM_NOT_FOUND','UNAUTHORIZED','ROOM_CLOSED'].includes(data.error)||data.phase==='closed'){
        localStorage.removeItem(key);
        const status=document.getElementById('lobbyStatus');
        if(status&&/ROOM_NOT_FOUND|UNAUTHORIZED|table speed/.test(status.textContent))status.textContent='That table has closed. Start a new table or join with a new invitation.';
      }
    }catch(_){/* Unconfirmed availability never claims that a table is open. */}
    finally{checking=false;lastCheck=Date.now();paint();}
  }
  const start=()=>{
    check(true);
    const lobby=document.getElementById('lobby');
    if(lobby)new MutationObserver(()=>{paint();if(!lobby.classList.contains('hidden'))check()}).observe(lobby,{attributes:true,attributeFilter:['class']});
    setInterval(()=>{if(lobby&&!lobby.classList.contains('hidden'))check()},15000);
  };
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)check(true)});
  window.addEventListener('focus',()=>check(true));
  window.addEventListener('storage',()=>check(true));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
