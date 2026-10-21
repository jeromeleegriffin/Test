import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base='https://griffin-rooks-art-recovery-test.jeromeleegriffin.workers.dev/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const status=await page.request.get(base+'__test_status',{timeout:20000});
 assert(status.ok(),'Test Worker status unreachable: '+status.status());
 const record=await status.json();
 assert.equal(record.mode,'offline-artwork-only');
 assert.equal(record.repairCommit,'8a9ea83a3e197c48519695181bffcac716ea3cd5');
 assert.equal(record.baseCommit,'90078a710948c7643caafb18986e34dc71ce7cee');
 const repaired=await page.request.get(base+'asset-loading772.js',{timeout:25000});
 assert(repaired.ok(),'Candidate JavaScript unavailable '+repaired.status());
 const body=await repaired.text();
 assert(body.includes('restoreUnloadedStylesheets')&&body.includes('failedVisibleImages'));
 const css=await page.request.get(base+'approved-bid-portrait.css',{timeout:25000});
 assert(css.ok(),'Original approved Bid Box CSS missing');
 const html=await page.request.get(base,{timeout:25000});
 assert(html.ok(),'Game entry unavailable');
 const index=await html.text();
 assert(index.includes('false && \'serviceWorker\' in navigator'),'Preview unexpectedly enables game service worker');
 assert(index.includes('action="#"'),'Preview would send Friends to live host');
 await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForFunction(()=>typeof startSoloPractice==='function' && !!window.HORAssetLoading772,null,{timeout:45000});
 const before=await page.evaluate(()=>({ready:!!window.HORAssetLoading772,buttons:!!document.getElementById('soloPracticeBtn'),art:window.HORAssetLoading772.inspect(),serviceWorkerControlled:!!navigator.serviceWorker?.controller}));
 assert(before.ready && before.buttons && !before.serviceWorkerControlled);
 // Start a genuine standalone offline game; do not contact any live room API.
 await page.evaluate(()=>startSoloPractice());
 await page.waitForFunction(()=>document.body.classList.contains('in-game') && document.querySelectorAll('#myHand > .card-face').length>=9,null,{timeout:35000});
 const hand=await page.evaluate(()=>{
   const cards=[...document.querySelectorAll('#myHand > .card-face')];
   return {phase:game.phase,cards:cards.length,widths:cards.map(c=>Math.round(c.getBoundingClientRect().width)),images:cards.map(c=>c.querySelector('img')).filter(Boolean).map(i=>i.naturalWidth>0),serviceWorkerControlled:!!navigator.serviceWorker?.controller};
 });
 assert(hand.cards>=9 && hand.widths.every(w=>w>=18),'Hosted offline cards failed geometry');
 assert(!hand.serviceWorkerControlled,'Host preview mistakenly controlled by service worker');
 console.log(JSON.stringify({pass:true,scope:'Actual isolated Cloudflare artwork preview tested on hosted Chromium/mobile viewport, NOT physical Android.',record,hand,errors:errors.slice(0,12)},null,2));
 await page.screenshot({path:'android-preview-hosted.png'});
 const clickPage=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await clickPage.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
 await clickPage.locator('#soloPracticeBtn').click({timeout:20000,force:true});
 let clickSucceeded=false;
 try {
   await clickPage.waitForFunction(()=>document.body.classList.contains('in-game') && document.querySelectorAll('#myHand > .card-face').length===10 && game?.phase!=='dealing',null,{timeout:22000});
   clickSucceeded=true;
 } catch {}
 const clickDiagnostics=await clickPage.evaluate(()=>({
   inGame:document.body.classList.contains('in-game'),
   houseLoading:document.documentElement.classList.contains('house-loading'),
   gamePhase:typeof game!=='undefined' ? game?.phase:null,
   visibleCards:document.querySelectorAll('#myHand > .card-face').length,
   loadingInfo:window.HORAssetLoading772?.inspect(),
   loadingPanel:document.getElementById('houseLoading')?.textContent?.slice(0,700),
   lobbyHidden:document.getElementById('lobby')?.classList.contains('hidden'),
   btnText:document.getElementById('soloPracticeBtn')?.textContent?.slice(0,90)
 }));
 console.log(JSON.stringify({clickSucceeded,clickDiagnostics},null,2));
 if (!clickSucceeded) await clickPage.screenshot({path:'android-preview-click-failure.png'});
 const buttonHand=await clickPage.evaluate(()=>({
   phase:game.phase,
   cards:document.querySelectorAll('#myHand > .card-face').length,
   decoded:[...document.querySelectorAll('#myHand > .card-face img')].filter(x=>x.naturalWidth>0).length
 }));
 assert.equal(buttonHand.cards,10);
 assert(buttonHand.decoded>=9,'Play Now art failed to load');
 console.log(JSON.stringify({playNowButton:true,buttonHand}));
 await clickPage.close();
}finally{await browser.close()}
