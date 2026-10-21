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
const ONLINE_GAME = 'https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/';
function lightweightEntry() {
  // No CSS, JS, audio, or artwork fetched before the player chooses a mode.
  // The actual R10 artwork test is at /game; multiplayer launches directly
  // into the authoritative live Worker. This eliminates redundant preloading.
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Griffin House of Rooks | Test Entry</title>
<style>
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;min-height:100svh;display:grid;place-items:center;padding:22px;background:#091827;color:#f3e6ca;font-family:Georgia,"Times New Roman",serif}
main{width:min(100%,420px);text-align:center}
h1{font-weight:normal;letter-spacing:.075em;font-size:clamp(25px,7vw,35px);margin:0 0 14px;color:#ead19b}
p{line-height:1.55;color:#d4c3a9;margin:12px 0 23px}
.actions{display:grid;gap:12px}
a,.action{display:block;width:100%;padding:17px 15px;border:1px solid #b99a63;border-radius:10px;background:#1c2e43;color:#f8ecd7;text-align:center;text-decoration:none;font:600 19px Georgia,"Times New Roman",serif;cursor:pointer}
a:first-child{background:#654522}
small{display:block;font:13px/1.5 system-ui,sans-serif;color:#bbb0a0;margin-top:5px}
fieldset{border:0;padding:0;margin:12px 0 0}
label{display:block;margin:12px 0 8px}
input{width:100%;padding:12px 14px;font:18px system-ui,sans-serif;background:#122338;border:1px solid #b99a63;border-radius:9px;color:#fff;text-transform:uppercase;letter-spacing:.13em}
.status{min-height:24px;margin-top:8px;color:#f2c3a6;font:13px system-ui,sans-serif}
.note{font:12px/1.5 system-ui,sans-serif;opacity:.8;margin-top:25px}
</style></head><body><main>
<h1>GRIFFIN HOUSE OF ROOKS</h1>
<p>Choose how to play. Artwork downloads only after your choice.</p>
<div class="actions">
<a id="choose-friends" href="${ONLINE_GAME}#create=1">Play With Friends<small>Open multiplayer directly. One game load.</small></a>
<a id="choose-offline" href="/game">Play Offline<small>Test repaired Black Bird, Red Two, cards and Bid Box.</small></a>
</div>
<fieldset><label for="roomCode">Join a friend's table</label>
<input id="roomCode" maxlength="8" autocomplete="off" autocapitalize="characters" placeholder="8-character code" aria-label="Room code">
<button class="action" id="joinByCode" type="button">Join by Code</button>
<div class="status" role="status" id="feedback"></div></fieldset>
<p class="note">Separate test entry. Your production game and saved multiplayer rooms are unchanged.</p>
</main>
<script>
document.getElementById('joinByCode').addEventListener('click',()=>{
 const code=document.getElementById('roomCode').value.trim().toUpperCase();
 if(!/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/.test(code)){
   document.getElementById('feedback').textContent='Enter a valid 8-character room code.';return;
 }
 const url=new URL('${ONLINE_GAME}');
 url.searchParams.set('room',code);
 url.hash=new URLSearchParams({room:code}).toString();
 window.location.assign(url.href);
});
</script></body></html>`;
}
addEventListener('fetch', e => e.respondWith(handle(e.request)));
async function handle(req) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Read-only artwork test', {status:405});
  const url = new URL(req.url);
  if (url.pathname === '/__test_status') return new Response(JSON.stringify({mode:'offline-artwork-only',version:'R10 full online X1 unchanged elsewhere',baseCommit:GAME_COMMIT,repairCommit:FIX_COMMIT,rooms:'disabled',serviceWorker:'not registered in test'}),{headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
  if (url.pathname === '/' || url.pathname === '/index.html') {
    const headers = { 'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-robots-tag':'noindex,nofollow','x-content-type-options':'nosniff' };
    return new Response(req.method === 'HEAD' ? null : lightweightEntry(), {status:200,headers});
  }
  let path;
  try {
    path = url.pathname === '/game' || url.pathname === '/game/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
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
