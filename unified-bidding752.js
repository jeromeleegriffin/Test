/* Auction presentation uses the original compact Thinking component.
   No bid actions, engine timers, game-state writes or network ownership. */
(() => {
  'use strict';
  let snapshot=null,frame=0;
  const portrait=()=>matchMedia('(orientation:portrait)').matches;
  function state(g,index,local,spectator) {
    if(!g||g.phase!=='bidding')return {label:'',previous:''};
    const bid=g.bidStatus?.[index];
    if(bid==='pass')return {label:'PASSED',previous:''};
    const previous=typeof bid==='number'&&bid>0?'BID '+bid:'';
    const active=index===g.currentPlayer&&!g.paused&&!g.resolvingTrick;
    if(active){
      if(index===local&&!spectator&&g.players?.[index]?.isBot)return {label:previous,previous:''};
      return {label:index===local&&!spectator?'YOUR BID':'THINKING...',previous};
    }
    return {label:previous,previous:''};
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;position();});}
  function renderSeat(slot,g,index,local,spectator) {
    if(!slot)return;
    slot.dataset.auctionPlayer=String(index);
    let old=slot.querySelector(':scope > .bid-badge');
    if(old)old.remove();
    let retained=slot.querySelector(':scope > .auction-status');
    const active=g?.phase==='bidding'&&index===g.currentPlayer;
    const shared=document.getElementById('botThinking');
    const s=state(g,index,local,spectator);
    if(!portrait()||g?.phase!=='bidding') {retained?.remove();return;}
    // Keep the original element for the current actor; settled bids/pass use
    // instances of that same small component, never a parallel panel layer.
    if(active)retained?.remove();
    let el=active?shared:retained;
    if(!el&&s.label){el=document.createElement('div');el.className='bot-thinking auction-status hidden';slot.appendChild(el);}
    if(!el)return;
    if(el.parentNode!==slot)slot.appendChild(el);
    el.dataset.auctionPlayer=String(index);
    el.dataset.humanTurn=active&&index===local&&!spectator&&!g.players?.[index]?.isBot?'1':'0';
    const text=s.label==='THINKING...'?'Thinking…':s.label;
    if(el.textContent!==text)el.textContent=text;
    el.classList.toggle('hidden',!text);
    el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.setAttribute('aria-atomic','true');
  }
  function position(){
    if(!snapshot||snapshot.g?.phase!=='bidding'||!portrait())return;
    for(const slot of document.querySelectorAll('.player-slot[data-auction-player]')) {
      renderSeat(slot,snapshot.g,Number(slot.dataset.auctionPlayer),snapshot.local,snapshot.spectator);
      const el=slot.querySelector(':scope > .auction-status,:scope > #botThinking');
      if(el&&!el.classList.contains('hidden'))positionBotThinkingAtSeat(el,Number(slot.dataset.auctionPlayer));
    }
  }
  function sync(g,local,spectator){
    snapshot={g,local,spectator};
    document.body.classList.remove('unified-bidding752');
    if(g?.phase!=='bidding'||!portrait()){
      document.querySelectorAll('.auction-status').forEach(e=>e.remove());
      const shared=document.getElementById('botThinking');
      if(shared?.hasAttribute('data-auction-player')){
        shared.removeAttribute('data-auction-player');shared.classList.add('hidden');shared.dataset.humanTurn='0';
      }
      return;
    }
    position();schedule();
  }
  addEventListener('resize',()=>{if(snapshot)sync(snapshot.g,snapshot.local,snapshot.spectator);});
  addEventListener('orientationchange',schedule);
  const dock=document.getElementById('decisionConsole');
  if(dock){new MutationObserver(schedule).observe(dock,{attributes:true,childList:true,subtree:true,attributeFilter:['class']});new ResizeObserver(schedule).observe(dock);}
  window.HORUnifiedBidding752={state,renderSeat,position,sync};
})();
