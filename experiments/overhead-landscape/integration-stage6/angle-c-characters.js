/* Isolated C presentation. Reads public identities only; never game actions or hands. */
(()=>{'use strict';
 const theater=document.getElementById('landscapeTheater');if(!theater)return;
 const root=document.createElement('div');root.id='angleCCharacters';root.setAttribute('aria-hidden','true');
 const placements=[{pose:'left',offset:1,x:-80,y:100,w:600},{pose:'top',offset:2,x:666,y:60,w:340},{pose:'right',offset:3,x:1152,y:100,w:600}];
 const actors=placements.map(p=>{const img=document.createElement('img');img.className='angle-c-person';img.alt='';img.hidden=true;img.dataset.pose=p.pose;root.append(img);return img;});
 const table=document.createElement('img');table.className='angle-c-table-mask';table.alt='';table.src='assets/angle-c/room-table-plate-v1.png';root.append(table);theater.prepend(root);
 const lip=document.createElement('img');lip.id='angleCHolderLip';lip.alt='';lip.setAttribute('aria-hidden','true');lip.src=table.src;theater.append(lip);
 const local=document.createElement('img');local.id='angleCLocalAvatar';local.alt='';local.hidden=true;local.setAttribute('aria-hidden','true');theater.append(local);
 const names=document.createElement('div');names.id='angleCNames';theater.append(names);
 const namePlaces=[[0,836,884],[1,180,610],[2,836,180],[3,1492,610]];
 const nameButtons=namePlaces.map(([offset])=>{const button=document.createElement('button');button.type='button';button.className='angle-c-player-name';button.dataset.offset=offset;button.onclick=e=>{e.preventDefault();e.stopPropagation();if(typeof game==='undefined')return;const player=game.players?.find(p=>p?.id===button.dataset.playerId);if(player&&typeof horShowCareerForPlayer==='function')horShowCareerForPlayer(player);};names.append(button);return button;});
 let scheduled=0;
 function identity(index){if(typeof game==='undefined'||!game)return null;const p=game.players?.[index];if(!p)return null;const chosen=(typeof playerAvatars!=='undefined'&&playerAvatars[p.id])||p.avatar;return {id:p.id,key:typeof chosen==='string'?chosen.toLowerCase():null};}
 function source(img,url,who){const signature=JSON.stringify([url,who?.id,who?.key]);if(img.dataset.signature===signature)return;img.dataset.signature=signature;img.dataset.playerId=who?.id||'';img.dataset.avatar=who?.key||'';img.hidden=true;img.dataset.state=url?'loading':'missing';img.onload=null;img.onerror=null;if(!url){img.removeAttribute('src');return;}img.onload=()=>{if(img.dataset.signature!==signature)return;img.hidden=false;img.dataset.state='ready';};img.onerror=()=>{if(img.dataset.signature!==signature)return;img.hidden=true;img.dataset.state='failed';};img.src=url;}
 function position(img,g,x,y,w,h){Object.assign(img.style,{left:g.left+x*g.scale+'px',top:g.top+y*g.scale+'px',width:w*g.scale+'px',height:h*g.scale+'px'});}
 function sync(){scheduled=0;const enabled=window.HORAngleC?.active();const ink=document.getElementById('trumpInk714');if(ink&&ink.parentNode!==(enabled?theater:document.body))(enabled?theater:document.body).append(ink);root.hidden=!enabled;lip.hidden=!enabled;names.hidden=!enabled;if(!enabled){local.hidden=true;return;}const g=window.HORAngleC.frame(),base=typeof myIndex==='number'&&myIndex>=0?myIndex:0,registry=window.HORCharacterStudio077?.characters||{};
 namePlaces.forEach(([offset,x,y],i)=>{const player=game.players?.[(base+offset)%4],button=nameButtons[i];button.hidden=!player;if(!player)return;button.dataset.playerId=player.id;const slot=document.getElementById(['slot-me','slot-left','slot-partner','slot-right'][offset]);const level=slot?.querySelector('.hor-career-badge')?.textContent||'';button.textContent=(player.name||'Player')+' '+level;button.setAttribute('aria-label','View player stats: '+(player.name||'Player'));button.style.left=(g.left+x*g.scale)+'px';button.style.top=Math.max(24,Math.min(innerHeight-24,g.top+y*g.scale))+'px';});
 placements.forEach((p,i)=>{const who=identity((base+p.offset)%4),path=who?.key&&registry[who.key]?.poses?.[p.pose];source(actors[i],path?'assets/characters077/'+path:null,who);position(actors[i],g,p.x,p.y,p.w,p.w*1.5);actors[i].style.clipPath=`inset(${Math.max(0,-p.y)*g.scale}px ${Math.max(0,p.x+p.w-1672)*g.scale}px ${Math.max(0,p.y+p.w*1.5-941)*g.scale}px ${Math.max(0,-p.x)*g.scale}px)`;});
 for(const img of [table,lip])position(img,g,0,0,1672,941);
 const who=typeof myIndex==='number'&&myIndex>=0?identity(myIndex):null;source(local,who?.key==='jerome_founder'?'assets/angle-c/jerome-rear-source-v1.png':null,who);position(local,g,336,510,1000,1000*941/1672);if(local.dataset.state==='ready')local.hidden=false;
 const note=document.getElementById('angleCNotice');if(note)note.textContent=who?.key==='jerome_founder'?'Internal landscape integration':'Internal landscape integration • local rear artwork pending';
 }
 function schedule(){if(!scheduled)scheduled=requestAnimationFrame(sync);}
 for(const id of ['slot-me','slot-left','slot-partner','slot-right','ltHand']){const node=document.getElementById(id);if(node)new MutationObserver(schedule).observe(node,{childList:true,subtree:true,characterData:true});}
 new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});addEventListener('resize',schedule);addEventListener('orientationchange',schedule);
 window.HORAngleCCharacters={sync,inspect:()=>[...actors,local].map(i=>({pose:i.dataset.pose||'local',playerId:i.dataset.playerId,avatar:i.dataset.avatar,state:i.dataset.state,hidden:i.hidden,src:i.getAttribute('src')}))};sync();
})();
