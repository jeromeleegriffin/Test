/* Griffin House of Rooks R10 artwork-recovery Android preview.
 * Isolated read-only static proxy. No live room API, player storage or Cloudflare secrets.
 * Every original asset is pinned to the approved native R10 commit.
 * Only asset-loading772.js is sourced from the preserved tested repair branch commit.
 */
const BASE = 'https://raw.githubusercontent.com/jeromeleegriffin/Test/';
const GAME_COMMIT = '90078a710948c7643caafb18986e34dc71ce7cee';
const FIX_COMMIT = '8a9ea83a3e197c48519695181bffcac716ea3cd5';
const FIX_FILE = 'asset-loading772.js';
const MIME = {html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',png:'image/png',webp:'image/webp',jpg:'image/jpeg',jpeg:'image/jpeg',svg:'image/svg+xml',wav:'audio/wav',mp3:'audio/mpeg',ogg:'audio/ogg',json:'application/json',woff:'font/woff',woff2:'font/woff2',txt:'text/plain; charset=utf-8',ico:'image/x-icon',webm:'video/webm'};
addEventListener('fetch', e => e.respondWith(handle(e.request)));
async function handle(req) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Read-only artwork test', {status:405});
  const url = new URL(req.url);
  if (url.pathname === '/__test_status') return new Response(JSON.stringify({mode:'offline-artwork-only',version:'R10 full online X1 unchanged elsewhere',baseCommit:GAME_COMMIT,repairCommit:FIX_COMMIT,rooms:'disabled',serviceWorker:'not registered in test'}),{headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
  let path;
  try {
    path = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
  } catch {return new Response('Not found',{status:404});}
  if (!path || path.length > 280 || path.startsWith('/') || path.split('/').some(part=>!part||part==='.'||part==='..'||/[\\\x00-\x1f]/.test(part))) return new Response('Not found',{status:404});
  if (path === 'rooms' || path.startsWith('rooms/') || path.startsWith('cloud-game/')) return new Response('Test room API disabled',{status:404});
  const ext=(path.split('.').pop()||'').toLowerCase();
  if (!(ext in MIME)) return new Response('Not found',{status:404});
  const rev=path===FIX_FILE ? FIX_COMMIT : GAME_COMMIT;
  const upstream=BASE+rev+'/'+path.split('/').map(encodeURIComponent).join('/');
  let response;
  try {
    response=await fetch(upstream,{redirect:'follow',cf:{cacheEverything:true,cacheTtlByStatus:{'200-299':3600,'300-599':0}}});
  } catch {return new Response('Artwork test connection unavailable',{status:502,headers:{'cache-control':'no-store'}});}
  if(!response.ok) return new Response('Test asset unavailable: '+path,{status:response.status,headers:{'cache-control':'no-store'}});
  const headers=new Headers({'content-type':MIME[ext],'x-content-type-options':'nosniff','cache-control':path==='index.html'?'no-store':'public, max-age=3600','x-robots-tag':'noindex,nofollow'});
  if (path === 'index.html') {
    let html=await response.text();
    // No testing copy installs/pre-caches 1,472 files or modifies the live service worker.
    html=html.replace("if ('serviceWorker' in navigator)", "if (false && 'serviceWorker' in navigator)");
    // Explicit preview identity without altering the table artwork.
    html=html.replace('<title>House of Rooks</title>','<title>ARTWORK TEST - House of Rooks</title>');
    // Keep the native Play With Friends and Join by Code navigation working.
    // These buttons intentionally open the existing online multiplayer Worker.
    // This isolated static artwork preview does not itself host player rooms.
    const guard=`<script>
    // The test copy must not swallow the Play With Friends action during boot.
    // This only navigates to the existing live multiplayer game; no test rooms are created here.
    window.addEventListener('click',function(e){
      const b=e.target.closest?.('#friendsToggleBtn,#createBtn,#joinConfirmBtn,#rejoinBtn,#reconnectBtn,#installAppBtn');
      if(!b)return;
      if(b.id==='installAppBtn'){e.preventDefault();e.stopImmediatePropagation();return;}
      const url=new URL('https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/');
      const name=(document.getElementById('hor-player-name')?.value||'').trim().slice(0,12);
      const code=(document.getElementById('hor-room-code')?.value||'').trim().toUpperCase();
      const intent=new URLSearchParams();
      if(b.id==='joinConfirmBtn'){
        if(!/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/.test(code)){
          e.preventDefault();e.stopImmediatePropagation();
          const msg=document.getElementById('joinFeedback841');
          if(msg){msg.hidden=false;msg.textContent='Enter the 8-character room code.';}
          return;
        }
        intent.set('room',code);url.searchParams.set('room',code);
      } else if(b.id==='friendsToggleBtn'||b.id==='createBtn')intent.set('create','1');
      if(name)intent.set('name',name);
      if(intent.size)url.hash=intent.toString();
      e.preventDefault();e.stopImmediatePropagation();
      try{window.top.location.assign(url.href);}catch{window.location.assign(url.href);}
    },true);
    </script>`;
    html=html.replace('</head>',guard+'</head>');
    headers.set('cache-control','no-store');
    return new Response(req.method==='HEAD'?null:html,{status:200,headers});
  }
  return new Response(req.method==='HEAD'?null:response.body,{status:200,headers});
}
