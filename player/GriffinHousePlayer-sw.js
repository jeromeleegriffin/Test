const PREFIX='gh-rook-player-v3-';
const RUN_MARK='/__ghplayer_run__/';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  const at=u.pathname.indexOf(RUN_MARK);
  if(u.origin!==location.origin || at<0) return;
  e.respondWith((async()=>{
    const tail=u.pathname.slice(at+RUN_MARK.length);
    const slash=tail.indexOf('/');
    if(slash<1) return new Response('Invalid Griffin House Player run URL',{status:400,headers:{'Cache-Control':'no-store'}});
    const token=tail.slice(0,slash);
    if(!/^[a-z0-9-]+$/i.test(token)) return new Response('Invalid run token',{status:400,headers:{'Cache-Control':'no-store'}});
    const cache=await caches.open(PREFIX+token);
    const clean=new URL(e.request.url); clean.search=''; clean.hash='';
    const hit=await cache.match(clean.href);
    if(hit) return hit;
    return new Response('Griffin House Player: file not present in THIS build\n'+clean.pathname,{status:404,headers:{'Content-Type':'text/plain','Cache-Control':'no-store'}});
  })());
});
