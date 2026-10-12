/* Character Studio077 / build769. Identity follows players; pose follows view-relative seat.
   No rules, teams, turn, dealing, hand or room-state writes. See HANDOFF/BUILD_767. */
(()=>{'use strict';
const NS='http://www.w3.org/2000/svg',W=875,H=1797;
const characters=Object.freeze({
 dagger:{name:'Dagger',design:'Adrian07',voice:'male',poses:{left:'dagger-left.png',top:'dagger-top.png',right:'dagger-right.png'}},
 cinder:{name:'Cinder',design:'Elena02',voice:'female',poses:{left:'cinder-left.png',top:'cinder-top.png',right:'cinder-right.png'}},
 crow:{name:'Crow',design:'Maya01',voice:'female',poses:{left:'crow-left.png',top:'crow-top.png',right:'crow-right.png'},foreground:{right:'crow-right-arm.png'}}
});
// Hard OUTER rail boundary traced from unchanged875x1797 TABLE-003 pixels.
const outside='M0 0H875V797L628 592Q590 563 534 561Q436 554 336 563Q298 565 254 594L0 799Z';
const seats=[
 {slot:'slot-left',pose:'left',offset:1,x:-44.53,y:362.91,w:345.10,label:[110,711],status:[110,357]},
 {slot:'slot-partner',pose:'top',offset:2,x:309.48,y:300.57,w:256.04,label:[437,531],status:[437,289]},
 {slot:'slot-right',pose:'right',offset:3,x:610.05,y:376.27,w:322.84,label:[781,717],status:[781,370]}
];
let root,svg,labels,frame=0,ready=false,enabled=new URLSearchParams(location.search).get('characters')!=='legacy';
const portrait=()=>matchMedia('(orientation:portrait)').matches;
function geom(){const r=document.getElementById('hor-room-bg')?.getBoundingClientRect()||{left:0,top:0,width:innerWidth,height:innerHeight};const s=Math.max(r.width/W,r.height/H);return{s,x:r.left+(r.width-W*s)/2,y:r.top};}
function occupant(seat){if(!enabled||!ready||!portrait()||!document.body.classList.contains('in-game')||typeof game==='undefined'||!game)return null;const base=myIndex>=0?myIndex:0,index=(base+seat.offset)%4,p=game.players?.[index];if(!p)return null;const avatar=(typeof playerAvatars!=='undefined'&&playerAvatars[p.id])||p.avatar||((typeof AVATARS!=='undefined')?AVATARS[index%AVATARS.length]:'');const key=String(avatar).toLowerCase();return characters[key]?{key,index,id:p.id,name:p.name||characters[key].name,character:characters[key]}:null;}
function make(){root=document.createElement('div');root.id='characters077';root.setAttribute('aria-hidden','true');root.innerHTML=`<svg xmlns="${NS}" width="875" height="1797" viewBox="0 0 875 1797"><defs><clipPath id="cs077-outside"><path d="${outside}"/></clipPath></defs><g clip-path="url(#cs077-outside)">${seats.map(s=>`<image data-seat="${s.pose}" x="${s.x}" y="${s.y}" width="${s.w}" height="${s.w*1.5}"/>`).join('')}</g><g>${seats.map(s=>`<image data-foreground="${s.pose}" x="${s.x}" y="${s.y}" width="${s.w}" height="${s.w*1.5}"/>`).join('')}</g></svg>`;(document.getElementById('hor-room-bg')||document.body).appendChild(root);svg=root.querySelector('svg');labels=document.createElement('div');labels.id='characterLabels077';for(const s of seats){const e=document.createElement('div');e.className='cs077-label name';e.dataset.seat=s.slot;labels.appendChild(e);}document.body.appendChild(labels);}
function releasePosition(el){if(el&&el.__cs077PriorStyle!==undefined){el.style.cssText=el.__cs077PriorStyle;delete el.__cs077PriorStyle;}}
function placePill(el,slot,cx,bottom,fit=false){
 if(el.__cs077PriorStyle===undefined)el.__cs077PriorStyle=el.style.cssText;
 if(el.parentNode!==slot)slot.appendChild(el);
 el.style.cssText='position:fixed!important;left:0!important;top:0!important;right:auto!important;bottom:auto!important;transform:none!important;translate:none!important;scale:1!important;margin:0!important;pointer-events:none!important;z-index:300!important;';
 const r=el.getBoundingClientRect(),sx=r.width/Math.max(1,el.offsetWidth),sy=r.height/Math.max(1,el.offsetHeight);
 if(fit)cx=Math.max(r.width/2+6,Math.min(innerWidth-r.width/2-6,cx));
 // Tablet scene extends beyond the 520px app; keep status text inside its hard clip.
 if(innerWidth>428){const a=document.getElementById('app')?.getBoundingClientRect();if(a&&a.width)cx=Math.max(a.left+r.width/2+6,Math.min(a.right-r.width/2-6,cx));}
 el.style.setProperty('translate',`${(cx-r.left-r.width/2)/Math.max(.01,sx)}px ${(bottom-r.top-r.height)/Math.max(.01,sy)}px`,'important');
}
function positionLead(el){
 const slot=el?.parentElement,s=seats.find(s=>s.slot===slot?.id);
 if(!s||!occupant(s)){releasePosition(el);return false;}
 if(el.classList.contains('hidden'))return false;
 const g=geom(),label=labels?.querySelector(`[data-seat="${s.slot}"]`),bottom=(label?.getBoundingClientRect().top??g.y+s.label[1]*g.s)-5;
 placePill(el,slot,g.x+s.label[0]*g.s,bottom,true);return true;
}
function positionStatus(el,index){
 if(!el||el.dataset.humanTurn==='1'||!portrait()){releasePosition(el);return false;}
 // Auction owner supplies explicit actors. Outside auction, follow the live turn/bidder,
 // never the shared pill's previous parent (the767 regression).
 let actor=index;
 if(!Number.isInteger(actor)&&typeof game!=='undefined'&&game){
  actor=game.phase==='bidding'&&el.hasAttribute('data-auction-player')?Number(el.dataset.auctionPlayer):
   (game.phase==='discard'||game.phase==='trump'?game.bidder:game.currentPlayer);
 }
 const sid=Number.isInteger(actor)&&typeof seatSlotIdForIndex==='function'?seatSlotIdForIndex(actor):null,s=seats.find(s=>s.slot===sid);
 if(!s||!occupant(s)){releasePosition(el);return false;}
 const g=geom(),slot=document.getElementById(s.slot);
 if(game.phase==='bidding'){placePill(el,slot,g.x+s.status[0]*g.s,g.y+s.status[1]*g.s);return true;}
 // Gameplay statuses share a compact column above the visible character name.
 const lead=slot.querySelector(':scope>.seat-lead-tag:not(.hidden)');
 let bottom=(labels?.querySelector(`[data-seat="${s.slot}"]`)?.getBoundingClientRect().top??g.y+s.label[1]*g.s)-5;
 if(lead){positionLead(lead);bottom=lead.getBoundingClientRect().top-4;}
 placePill(el,slot,g.x+s.label[0]*g.s,bottom,true);return true;
}
function imageState(el,path){if(path){const href='assets/characters077/'+path;if(el.getAttribute('href')!==href)el.setAttribute('href',href);el.style.display='';}else{el.style.display='none';el.removeAttribute('href');}}
function sync(){frame=0;if(!root)make();const bg=document.getElementById('hor-room-bg');if(bg&&root.parentElement!==bg)bg.appendChild(root);const g=geom();svg.style.cssText=`left:${g.x}px;top:${g.y}px;transform:scale(${g.s});`;if(document.body.classList.contains('cs077-ready')!==(enabled&&ready))document.body.classList.toggle('cs077-ready',enabled&&ready);for(const s of seats){const o=occupant(s),slot=document.getElementById(s.slot);slot?.classList.toggle('cs077-seat',!!o);imageState(root.querySelector(`[data-seat="${s.pose}"]`),o?.character.poses[s.pose]);imageState(root.querySelector(`[data-foreground="${s.pose}"]`),o?.character.foreground?.[s.pose]);const label=labels.querySelector(`[data-seat="${s.slot}"]`);label.style.display=o?'':'none';if(o){const original=slot.querySelector('.seat-identity-copy');if(original&&label.innerHTML!==original.innerHTML){label.innerHTML=original.innerHTML;try{horBindCareerBadges(label);}catch(_){}}label.dataset.botname=slot.querySelector('.name')?.dataset.botname||'';label.style.left=(g.x+s.label[0]*g.s)+'px';label.style.top=(g.y+s.label[1]*g.s)+'px';for(const el of slot.querySelectorAll(':scope>.auction-status,:scope>#botThinking'))positionStatus(el);}}try{positionSeatLeadTags();const pill=document.getElementById('botThinking');if(pill&&!pill.classList.contains('hidden'))positionBotThinkingAtSeat();}catch(_){} }
const schedule=()=>{if(!frame)frame=requestAnimationFrame(sync);};
// Narrow default offline cast pool only: original random selection, empty-seat assignment,
// explicit persona picks and saved favorite-partner priority remain in addBot().
function castPool(pool){if(!enabled)return pool;const selected=pool.filter(p=>characters[p.avatar]);return selected.length?selected:pool;}
function setEnabled(value){enabled=!!value;sync();}
window.HORCharacterStudio077={characters,castPool,sync,positionStatus,positionLead,setEnabled,inspect:()=>({enabled,ready,portrait:portrait(),geometry:geom(),seats:seats.map(s=>({...s,active:!!occupant(s),occupant:occupant(s)})),outside})};
const paths=Object.values(characters).flatMap(c=>[...Object.values(c.poses),...Object.values(c.foreground||{})]);
Promise.all(paths.map(path=>new Promise((resolve,reject)=>{const i=new Image();i.onload=resolve;i.onerror=reject;i.src='assets/characters077/'+path;}))).then(()=>{ready=true;sync();}).catch(()=>{ready=false;sync();console.warn('Character artwork unavailable; original portraits retained.');});
addEventListener('resize',schedule);addEventListener('orientationchange',schedule);document.addEventListener('visibilitychange',schedule);new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});
})();
