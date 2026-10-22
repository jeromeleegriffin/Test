
/* Branded invite v10: reuse existing waiting-room table before reserving any seat. */
(() => {
  if (location.hostname !== 'rooks.jeromegriffin.com' &&
      location.hostname !== 'rooks-invite-v10-stage.jeromeleegriffin.workers.dev') return;
  const code = String(window.GHR_CLOUD_INVITE || '').trim().toUpperCase();
  if (!/^(?:[A-Z]{3}[0-9]{2,4}|[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8})$/.test(code)) return;
  const lobby = document.getElementById('lobby');
  const waiting = document.getElementById('waiting');
  const name = document.getElementById('hor-player-name');
  const picker = document.getElementById('horInviteSeatPicker');
  const options = document.querySelector('#ghInviteIdentityV7 .identity-choice') || document.querySelector('#landingPanel783 .identity-choice');
  const dock = document.getElementById('friendsDock803');
  if (!lobby || !waiting || !name || !picker || !dock || !options) return;
  const css = document.createElement('style');
  css.id = 'ghInviteTableFlowV10';
  css.textContent = [
    '#waiting[data-guest-preview="true"] #friendsDock803{z-index:40!important}',
    '#waiting[data-guest-preview="true"] #friendsDock803> :not(#ghGuestIdentityV10){display:none!important}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10{box-sizing:border-box;display:flex;flex-direction:column;gap:7px;align-items:stretch;padding:9px 11px;background:linear-gradient(180deg,#193041,#0d1e2d);border:1px solid #c3a267;border-radius:11px;max-width:100%;color:#fff2d6}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 label{font:700 15px Georgia,serif;color:#f7dca4;display:block!important;margin:0!important}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 #hor-player-name{font:16px system-ui!important;display:block!important;visibility:visible!important;opacity:1!important;box-sizing:border-box;width:100%!important;height:43px!important;min-height:43px!important;padding:8px 10px!important;color:#fff!important;-webkit-text-fill-color:#fff!important;background:#102331!important;border:1px solid #c1a16a!important;border-radius:7px!important;pointer-events:auto!important}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 .identity-choice{display:flex!important;visibility:visible!important;opacity:1!important;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px!important;padding:0!important;min-width:0!important}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 .identity-avatar{display:flex!important;flex:1 1 165px!important;max-width:100%!important;min-width:0!important;min-height:45px!important;font:14px system-ui!important}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 .identity-avatar img{width:38px!important;height:38px!important}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 .identity-voice{display:none!important}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 #ghPreviewMessageV10{font:12px/1.3 system-ui;color:#f6dba6;min-height:0;max-width:100%;text-align:center}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 #ghPreviewCancelV10{font:12px system-ui;color:#e0d2b3;background:none;border:0;padding:1px 6px;min-height:20px;align-self:center}',
    '#waiting[data-guest-preview="true"] .wait-seat[data-preview-free="true"]{cursor:pointer!important;pointer-events:auto!important;z-index:12!important}',
    '#waiting[data-guest-preview="true"] .wait-seat[data-preview-free="true"] .friends-seat-choice804{border:2px solid #f2cd77!important;background:#132538e8!important;color:#ffebbc!important;font:700 12px Georgia,serif!important;min-height:36px;display:flex;justify-content:center;align-items:center;box-shadow:0 0 15px #d8ad5866!important}',
    '#waiting[data-guest-preview="true"] .wait-seat[data-preview-free="false"]{pointer-events:none!important;opacity:.9}',
    '#waiting[data-guest-preview="true"] #friendsHeading803{font-size:21px!important}',
    '#waiting[data-guest-preview="true"] #waitingStatus{font-size:13px!important}',
    '@media(max-height:680px){#waiting[data-guest-preview="true"] #ghGuestIdentityV10{padding:6px 8px;gap:4px}#waiting[data-guest-preview="true"] #ghGuestIdentityV10 #hor-player-name{height:39px!important;min-height:39px!important}}'
  ].join('\n');
  document.head.append(css);
  const holders = [];
  const move = (node,destination) => {
    const marker = document.createComment('guest-seat-flow-orig');
    node.parentNode.insertBefore(marker,node);
    holders.push([node,marker]);
    destination.append(node);
  };
  const strip=document.createElement('section');
  strip.id='ghGuestIdentityV10';
  strip.setAttribute('aria-label','Your player details');
  const label=document.createElement('label');
  label.htmlFor='hor-player-name';
  label.textContent='Your player name';
  const message=document.createElement('div');
  message.id='ghPreviewMessageV10';
  message.setAttribute('role','status');
  message.setAttribute('aria-live','polite');
  const cancel=document.createElement('button');
  cancel.id='ghPreviewCancelV10';
  cancel.type='button';
  cancel.textContent='Back to game';
  strip.append(label);
  move(name,strip);
  move(options,strip);
  strip.append(message,cancel);
  dock.prepend(strip);
  name.placeholder='Enter your player name';
  window.GHR_CLOUD_NAME='';
  name.value='';
  let active=true,joining=false,latest=null;
  const names={1:'Left opponent',2:"Host's partner",3:'Right opponent'};
  function restore(){
    active=false;
    clearInterval(painter);
    document.removeEventListener('pointerdown',takeTap,true);
    document.removeEventListener('click',takeTap,true);
    waiting.removeAttribute('data-guest-preview');
    strip.remove();
    holders.forEach(([node,marker])=>{if(marker.parentNode)marker.parentNode.insertBefore(node,marker);marker.remove()});
  }
  function cancelPreview(){
    if(!active)return;
    restore();
    waiting.classList.add('hidden');
    lobby.style.display='';
    document.body.classList.remove('at-table');
    const roomForm=document.getElementById('joinForm');
    if(roomForm)roomForm.classList.add('hidden');
    lobby.classList.remove('joining');
  }
  cancel.addEventListener('click',cancelPreview);
  function showError(text){message.textContent=text;}
  async function showTable(){
    const response=await fetch('/rooms/'+encodeURIComponent(code)+'/seat-options',{cache:'no-store'});
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw Error(data.error||'Table unavailable');
    if(data.phase!=='waiting')throw Error('This table already started playing.');
    latest=data;
    lobby.style.display='none';
    waiting.classList.remove('hidden');
    waiting.setAttribute('data-guest-preview','true');
    document.body.classList.add('at-table');
    document.getElementById('friendsHeading803').textContent='Choose your seat';
    document.getElementById('waitingStatus').textContent='Tap an open seat to join';
    // Present the existing table in a fixed host-oriented seating view.
    const positions={0:'top',1:'left',2:'me',3:'right'};
    for(const seat of [0,1,2,3]){
      const button=document.getElementById('waitSeat'+seat);
      const state=data.seats.find(x=>Number(x.seat)===seat);
      if(!button||!state)continue;
      button.dataset.position=positions[seat];
      button.dataset.previewFree=String(!!state.joinable);
      button.classList.toggle('friends-empty',!!state.joinable);
      button.classList.toggle('friends-person',!state.joinable);
      if(state.joinable){
        button.innerHTML='<span class="friends-seat-choice804">Sit here</span>';
        button.disabled=false;
      }else{
        const span=document.createElement('strong');
        span.textContent=state.name||'Occupied';
        button.replaceChildren(span);
        button.disabled=true;
      }
    }
    message.textContent='Enter your name, then tap a seat.';
  }
  async function refresh(){
    if(!active||joining)return;
    try{await showTable()}catch(e){showError('Cannot open this table: '+e.message);}
  }
  async function sit(seat){
    if(!active||joining)return;
    const newName=name.value.trim();
    if(!newName){showError('Enter your name before choosing a seat.');name.focus();return;}
    const choice=picker.querySelector('button[data-preferred-seat="'+seat+'"]:not([disabled])');
    if(!choice){await refresh();showError('That seat is no longer available. Tap another.');return;}
    joining=true;
    showError('Taking your seat…');
    try{
      // Existing adapter owns chosenInviteSeat and the authoritative server join.
      choice.click();
      const before=localStorage.getItem('ghr-private-cloud-seat-v1');
      const prior=before?JSON.parse(before):null;
      if(typeof window.joinRoom!=='function')throw Error('Table is still loading');
      await window.joinRoom();
      const after=localStorage.getItem('ghr-private-cloud-seat-v1');
      const result=after?JSON.parse(after):null;
      if(!result || result.roomCode!==code || Number(result.seat)!==seat || result.token===prior?.token){
        throw Error('The seat was not confirmed. Please try again.');
      }
      restore();
      // The native Cloudflare adapter enters the genuine waiting room.
      lobby.style.display='';
    }catch(e){
      joining=false;
      showError(e.message||'Could not take seat.');
      await refresh();
    }
  }
  for(const seat of [1,2,3]){
    const b=document.getElementById('waitSeat'+seat);
    if(!b)continue;
    b.addEventListener('click',event=>{
      if(!active||!waiting.hasAttribute('data-guest-preview'))return;
      event.preventDefault();
      event.stopImmediatePropagation();
      sit(seat);
    },true);
  }

  // The original waiting-screen controller also refreshes seat markup.
  // Keep the guest view in sync with the server snapshot, without redrawing art.
  function repaint(){
    if(!active||joining||!latest||waiting.dataset.guestPreview!=='true')return;
    const positions={0:'top',1:'left',2:'me',3:'right'};
    for(const seat of [0,1,2,3]){
      const b=document.getElementById('waitSeat'+seat);
      const info=latest.seats?.find(x=>Number(x.seat)===seat);
      if(!b||!info)continue;
      const free=!!info.joinable;
      if(b.dataset.position!==positions[seat])b.dataset.position=positions[seat];
      if(b.dataset.previewFree!==String(free))b.dataset.previewFree=String(free);
      if(b.disabled===free)b.disabled=!free;
      if(b.classList.contains('friends-empty')!==free)b.classList.toggle('friends-empty',free);
      if(b.classList.contains('friends-person')===free)b.classList.toggle('friends-person',!free);
      if(free) {
        if(b.textContent?.trim()!=='Sit here')b.innerHTML='<span class="friends-seat-choice804">Sit here</span>';
      }else{
        if(b.textContent?.trim()!==(info.name||'Occupied')){
          const label=document.createElement('strong');label.textContent=info.name||'Occupied';
          b.replaceChildren(label);
        }
      }
    }
    const title=document.getElementById('friendsHeading803');
    if(title&&title.textContent!=='Choose your seat')title.textContent='Choose your seat';
    const status=document.getElementById('waitingStatus');
    if(status&&status.textContent!=='Tap an open seat to join')status.textContent='Tap an open seat to join';
  }
  const painter=setInterval(repaint,300);
  const takeTap=(e)=>{
    if(!active||joining||waiting.dataset.guestPreview!=='true')return;
    const seat=e.target.closest?.('#waitSeat1,#waitSeat2,#waitSeat3');
    if(!seat||seat.dataset.previewFree!=='true')return;
    e.preventDefault();
    e.stopImmediatePropagation();
    sit(Number(seat.id.slice(-1)));
  };
  // Native room listeners own click events after a person has joined.
  // Before reservation, capture both touchscreen presses and keyboard clicks.
  document.addEventListener('pointerdown',takeTap,true);
  document.addEventListener('click',takeTap,true);

  // Reuse the original room-art, rather than rendering another seat list.
  const start=()=>{if(!active)return;refresh()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else setTimeout(start,0);
})();
