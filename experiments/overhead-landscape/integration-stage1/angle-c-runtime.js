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
 function fit(){if(!active())return;const g=frame(),n=document.querySelectorAll('#ltHand>.card-face').length||10,cw=Math.min(125,620/n)*g.scale,ch=cw*1.4,hw=n*cw+Math.max(0,n-1)*2,y=g.top+675*g.scale-ch;
 const vars={'hand-x':innerWidth/2-hw/2,'hand-y':y,'hand-w':hw,'card-w':cw,'card-h':ch,'bid-y':Math.max(48,y-140),'plays-x':g.left+600*g.scale,'plays-y':g.top+460*g.scale,'plays-w':472*g.scale,'plays-h':170*g.scale,'play-w':90*g.scale,'play-h':126*g.scale};
 for(const [k,v] of Object.entries(vars))document.body.style.setProperty('--c-'+k,v+'px');}
 const hand=document.getElementById('ltHand');if(hand)new MutationObserver(fit).observe(hand,{childList:true});
 new MutationObserver(fit).observe(document.body,{attributes:true,attributeFilter:['class']});
 addEventListener('resize',fit);fit();
})();
