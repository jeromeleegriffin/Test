/* Isolated integration: presentation only; existing game nodes retain handlers. */
(()=>{
 const active=()=>document.body.classList.contains('in-game')&&matchMedia('(orientation:landscape)').matches;
 const frame=()=>{const w=innerWidth,h=innerHeight,s=Math.min(w/1672,h/941);return {scale:s,left:(w-1672*s)/2,top:(h-941*s)/2};};
 window.HORAngleC={active};
 document.body.classList.add('angle-c-runtime');
 const note=document.createElement('div');note.id='angleCNotice';note.textContent='Internal integration • cast artwork not connected';document.body.append(note);
 window.HORLandscapeTrumpGeometry={active,frame,
 geometry(){const g=frame();return {...g,x:g.left+836*g.scale,y:g.top+540*g.scale};},
 position(root){const g=frame(),w=Math.min(400,innerWidth-24);root.style.width=w+'px';root.style.left=innerWidth/2+'px';root.style.top=Math.max(48,g.top+500*g.scale-w/2.86-8)+'px';},
 paint(ctx,image){const g=this.geometry(),w=260*g.scale,h=145*g.scale;ctx.drawImage(image,g.x-w/2,g.y-h/2,w,h);}};
 function placePlays(){if(!active())return;const g=frame();
 const seats={'slot-me':[788,440,-10],'slot-left':[710,412,100],'slot-partner':[840,375,175],'slot-right':[945,430,-75]};
 for(const el of document.querySelectorAll('#ltPlays .lt-play')){const seat=seats[el.dataset.cSeat];if(!seat)continue;let hash=2166136261;for(const ch of el.dataset.cPlay||'')hash=Math.imul(hash^ch.charCodeAt(0),16777619)>>>0;
 const x=seat[0]+((hash&255)/255-.5)*14,y=seat[1]+(((hash>>>8)&255)/255-.5)*10;
 el.style.setProperty('--c-toss-x',g.left+x*g.scale+'px');el.style.setProperty('--c-toss-y',g.top+y*g.scale+'px');el.style.setProperty('--c-toss-angle',seat[2]+'deg');
 }}
 function fit(){if(!active())return;const g=frame(),n=document.querySelectorAll('#ltHand>.card-face').length||10,gap=2*g.scale,cw=Math.min(125,(620-2*Math.max(0,n-1))/n)*g.scale,ch=cw*1.4,hw=n*cw+Math.max(0,n-1)*gap,y=g.top+675*g.scale-ch;
 const vars={'hand-x':innerWidth/2-hw/2,'hand-y':y,'hand-w':hw,'card-w':cw,'card-h':ch,'card-gap':gap,'bid-y':Math.max(48,y-140),'plays-x':g.left+600*g.scale,'plays-y':g.top+460*g.scale,'plays-w':472*g.scale,'plays-h':170*g.scale,'play-w':110*g.scale,'play-h':154*g.scale};
 for(const [k,v] of Object.entries(vars))document.body.style.setProperty('--c-'+k,v+'px');placePlays();}
 const plays=document.getElementById('ltPlays');if(plays)new MutationObserver(placePlays).observe(plays,{childList:true});
 const hand=document.getElementById('ltHand');if(hand)new MutationObserver(fit).observe(hand,{childList:true});
 new MutationObserver(fit).observe(document.body,{attributes:true,attributeFilter:['class']});
 addEventListener('resize',fit);fit();
})();
