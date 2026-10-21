import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const origin='https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev';
// Production: never create a room from this rendered browser test.
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try {
 const pg=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
 const errors=[],reqs=[],mutations=[];
 pg.on('pageerror',e=>errors.push(e.message));
 pg.on('request',r=>reqs.push(r.url()));
 await pg.route(origin+'/rooms**',async route=>{
  mutations.push(route.request().method()+' '+route.request().url());
  await route.fulfill({status:403,contentType:'application/json',body:'{"error":"QA_SAFETY_INTERCEPT"}'});
 });
 const css=await pg.request.get(origin+'/cloud-game/assets/approved-bid-portrait.css',{timeout:25000});
 assert(css.ok()&&css.headers()['content-type']?.includes('text/css'),'Cloudflare approved Bid Box CSS not present');
 const bird=await pg.request.get(origin+'/cloud-game/assets/assets/images/RookPremium.png',{timeout:25000});
 assert(bird.ok()&&bird.headers()['content-type']?.includes('image/png'),'Cloudflare premium bird not present');
 const recovery=await pg.request.get(origin+'/cloud-game/assets/asset-loading772.js',{timeout:25000});
 assert(recovery.ok()&&(await recovery.text()).includes('restoreUnloadedStylesheets'),'Weak cellular repair absent');
 const resp=await pg.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:55000});
 assert(resp?.ok(),'Staging game failed to load');
 await pg.waitForFunction(()=>!!document.getElementById('friendsToggleBtn')&&!!window.HORAssetLoading772&&window.HOR_CLOUD_TEST_ACTIVE===true,null,{timeout:50000});
 await pg.waitForFunction(()=>{const x=window.HORAssetLoading772?.inspect();return x?.initialRevealComplete && x.done===x.total},null,{timeout:60000});
 const before=await pg.evaluate(()=>({landing:!!document.getElementById('landingMenuButton783'),cloud:window.HOR_CLOUD_TEST_ACTIVE,navs:performance.getEntriesByType('navigation').length}));
 assert(before.landing && before.cloud && before.navs===1);
 await pg.locator('#friendsToggleBtn').click({timeout:22000});
 await pg.waitForFunction(()=>document.getElementById('lobbyStatus')?.textContent?.includes('QA_SAFETY_INTERCEPT'),null,{timeout:13000});
 const after=await pg.evaluate(()=>({navs:performance.getEntriesByType('navigation').length,url:location.origin}));
 assert(after.navs===1&&after.url===origin);
 assert(mutations.some(x=>x.startsWith('POST '+origin+'/rooms')),'Cloud room action not triggered');
 assert(!reqs.some(u=>u.includes('raw.githubusercontent.com')),'Browser reached GitHub');
 assert(!errors.length,'Browser errors: '+errors.slice(0,3));
 console.log(JSON.stringify({pass:true,site:'Cloudflare-only LIVE hosted browser QA; room mutations intercepted',originalLanding:true,sameOriginFriends:true,offlineAssets:true,roomsIntercepted:mutations.length,requests: reqs.length,errorCount:errors.length},null,2));
 await pg.close();
}finally{await browser.close()}
