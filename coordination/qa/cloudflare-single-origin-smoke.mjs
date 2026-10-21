import assert from 'node:assert/strict';
import { chromium } from 'playwright';

// Read-only acceptance of the *existing* canonical Cloudflare game.
// All room mutations are intercepted BEFORE they reach the live Worker.
const origin='https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try {
  const createPage=async()=>await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const pg=await createPage();
  const errors=[],mutations=[],requests=[];
  pg.on('pageerror',e=>errors.push(e.message));
  pg.on('request',r=>requests.push({url:r.url(),type:r.resourceType(),method:r.method()}));
  await pg.route(/https:\/\/griffin-house-of-rooks-online\.jeromeleegriffin\.workers\.dev\/rooms(?:\/.*)?(?:\?.*)?$/,async r=>{
    if(r.request().method!=='GET'){
      mutations.push({url:r.request().url(),method:r.request().method()});
      await r.fulfill({status:403,contentType:'application/json',body:'{"error":"ISOLATED_QA_MUTATIONS_BLOCKED"}'});
    } else await r.fulfill({status:404,contentType:'application/json',body:'{"error":"ISOLATED_QA_ROOM_LOOKUP_BLOCKED"}'});
  });
  const entry=await pg.goto(origin,{waitUntil:'domcontentloaded',timeout:50000});
  assert(entry?.ok(), 'Cloudflare game entry was unavailable');
  await pg.waitForFunction(()=>!!window.HORAssetLoading772 && window.HOR_CLOUD_TEST_ACTIVE===true &&
     !!document.getElementById('soloPracticeBtn') && !!document.getElementById('friendsToggleBtn'),null,{timeout:40000});
  const before=await pg.evaluate(()=>({
    title:document.title,origin:location.origin,base:document.querySelector('base')?.href,
    nativeLanding:!!document.getElementById('landingMenuButton783'),
    friends:document.getElementById('friendsToggleBtn')?.textContent?.trim(),
    offline:!!document.getElementById('soloPracticeBtn'),
    hasCloudClient:!!window.HORCloudDiagnostics,
    navigationCount:performance.getEntriesByType('navigation').length
  }));
  assert(before.hasCloudClient && before.offline && before.friends && before.navigationCount===1);
  assert(before.base?.startsWith(origin+'cloud-game/assets/'), 'Assets not same-origin on Cloudflare');
  await pg.waitForFunction(()=>{
    const p=window.HORAssetLoading772?.inspect();
    return p?.initialRevealComplete && p.done===p.total &&
       !document.documentElement.classList.contains('house-loading');
  },null,{timeout:85000});
  await pg.locator('#friendsToggleBtn').click({timeout:25000});
  await pg.waitForFunction(()=>!!document.getElementById('lobbyStatus')?.textContent?.includes('ISOLATED_QA_MUTATIONS_BLOCKED'),null,{timeout:15000}).catch(()=>{});
  const after=await pg.evaluate(()=>({
    origin:location.origin,navCount:performance.getEntriesByType('navigation').length,
    status:document.getElementById('lobbyStatus')?.textContent?.slice(0,240),
    hash:location.hash,cardCss:[...document.styleSheets].some(x=>x.href?.includes('asset-loading772.css'))
  }));
  assert.equal(after.origin,before.origin,'Friends unexpectedly changed origin');
  assert.equal(after.navCount,1,'Friends caused a second document load');
  assert(mutations.some(x=>x.method==='POST'&&new URL(x.url).pathname==='/rooms'),'Friends did not call native Cloudflare room create API');
  assert(!requests.some(x=>x.url.startsWith('https://raw.githubusercontent.com/')),'Browser requested GitHub directly');
  assert(!errors.length,'Browser errors: '+JSON.stringify(errors.slice(0,5)));
  console.log(JSON.stringify({pass:true,mode:'friends-same-origin',before,after,roomsAttemptedButIntercepted:mutations.length,assetCount:requests.filter(r=>r.url.includes('/cloud-game/assets/')).length,errors:errors.length},null,2));
  await pg.close();

  const offline=await createPage();
  const offlineMutations=[];
  await offline.route(/\/rooms(?:\/.*)?$/,async r=>{
    offlineMutations.push(r.request().url());
    await r.fulfill({status:403,contentType:'application/json',body:'{"error":"ISOLATED_QA_MUTATIONS_BLOCKED"}'});
  });
  await offline.goto(origin,{waitUntil:'domcontentloaded',timeout:50000});
  await offline.waitForFunction(()=>typeof startSoloPractice==='function'&&!!window.HORAssetLoading772,null,{timeout:40000});
  await offline.waitForFunction(()=>{const p=window.HORAssetLoading772?.inspect();return p?.initialRevealComplete&&p.done===p.total},null,{timeout:85000});
  await offline.locator('#soloPracticeBtn').click({timeout:20000});
  await offline.waitForFunction(()=>document.body.classList.contains('in-game')&&
     document.querySelectorAll('#myHand > .card-face').length===10,null,{timeout:30000});
  const offlineState=await offline.evaluate(()=>({
    origin:location.origin,navCount:performance.getEntriesByType('navigation').length,
    cards:document.querySelectorAll('#myHand > .card-face').length,
    decoded:[...document.querySelectorAll('#myHand > .card-face img')].filter(img=>img.naturalWidth>0).length
  }));
  assert.equal(offlineState.navCount,1);
  assert(offlineState.cards===10&&offlineState.decoded>=9);
  assert.equal(offlineMutations.length,0,'Offline button called hosted rooms');
  console.log(JSON.stringify({pass:true,mode:'offline-same-origin',offlineState},null,2));
  await offline.close();
}finally {await browser.close();}
