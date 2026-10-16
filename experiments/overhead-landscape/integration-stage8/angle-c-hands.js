/* Public card counts only. This renderer never accepts cards or card identities. */
(()=>{'use strict';
 const placements=[{offset:1,x:450,y:470,angle:72,width:170},{offset:2,x:836,y:245,angle:180,width:220},{offset:3,x:1222,y:470,angle:-72,width:170}];
 function model(snapshot){
  const {players=[],counts=[],localSeat=-1,phase=''}=snapshot||{};
  if(!Number.isInteger(localSeat)||localSeat<0||localSeat>3||!['bidding','discard','trump','play'].includes(phase))return [];
  return placements.map(p=>{const seat=(localSeat+p.offset)%4,value=counts[seat],count=Number.isInteger(value)&&value>=0&&value<=16?value:null;return {...p,seat,playerId:String(players[seat]?.id||''),name:String(players[seat]?.name||'Player'),count};});
 }
 let root=null,last=null,signature='';
 function sync(snapshot){last=snapshot;const theater=document.getElementById('landscapeTheater');if(!theater)return;if(!root){root=document.createElement('div');root.id='angleCOpponentHands';theater.append(root);}const enabled=window.HORAngleC?.active();root.hidden=!enabled;if(!enabled)return;const rows=model(snapshot),g=window.HORAngleC.frame(),key=JSON.stringify([rows,g]);if(signature===key)return;signature=key;root.replaceChildren();
  for(const row of rows){if(row.count===null)continue;const holder=document.createElement('div');holder.className='angle-c-opponent-hand';holder.dataset.playerId=row.playerId;holder.dataset.seat=String(row.seat);holder.setAttribute('role','img');holder.setAttribute('aria-label',row.name+': '+row.count+' cards remaining');Object.assign(holder.style,{left:g.left+row.x*g.scale+'px',top:g.top+row.y*g.scale+'px',width:row.width*g.scale+'px',height:80*g.scale+'px',transform:'translate(-50%,-50%) rotate('+row.angle+'deg)'});
   for(let i=0;i<row.count;i++){const back=document.createElement('div');back.className='angle-c-card-back';back.setAttribute('aria-hidden','true');const spread=Math.min(row.width-48,Math.max(0,row.count-1)*17);Object.assign(back.style,{left:(row.width/2-24+(row.count===1?0:(i/(row.count-1)-.5)*spread))*g.scale+'px',width:48*g.scale+'px',height:67*g.scale+'px'});holder.append(back);}
   const count=document.createElement('span');count.className='angle-c-count';count.textContent=String(row.count);holder.append(count);root.append(holder);
  }
 }
 window.HORAngleCHands={model,sync,inspect:()=>model(last)};
 addEventListener('resize',()=>sync(last));new MutationObserver(()=>sync(last)).observe(document.body,{attributes:true,attributeFilter:['class']});
})();
