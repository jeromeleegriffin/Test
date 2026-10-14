/* Isolated presentation adapter; no bidding, card or scoring authority. */
window.HORLandscapeTrumpGeometry={
 active:()=>document.body.classList.contains('angle-c-study')&&matchMedia('(orientation:landscape)').matches,
 frame(){const v=document.querySelector('#viewport'),w=v.clientWidth,h=v.clientHeight,s=Math.min(w/1672,h/941);return {scale:s,left:(w-1672*s)/2,top:(h-941*s)/2};},
 geometry(){const g=this.frame();return {...g,x:g.left+836*g.scale,y:g.top+540*g.scale};},
 position(root){const g=this.frame(),width=Math.min(400,innerWidth-24);root.style.width=width+'px';root.style.left=innerWidth/2+'px';root.style.top=Math.max(48,g.top+500*g.scale-width/2.86-8)+'px';},
 paint(ctx,image){const g=this.geometry(),w=260*g.scale,h=145*g.scale;ctx.drawImage(image,g.x-w/2,g.y-h/2,w,h);}
};
