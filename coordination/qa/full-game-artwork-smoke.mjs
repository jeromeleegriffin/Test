import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn('python3',['-m','http.server','8765','--bind','127.0.0.1'],{stdio:'ignore'});
let browser;
try {
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const failures=[];
  page.on('pageerror',e=>failures.push(String(e)));
  const url='http://127.0.0.1:8765/';
  let loaded=false;
  for(let i=0;i<20;i++){try{const r=await page.request.get(url,{timeout:1000});if(r.ok()){loaded=true;break}}catch{}await new Promise(r=>setTimeout(r,250))}
  assert(loaded,'Local game server failed to boot');
  await page.route('**/assets/images/RookPremium.png**',r=>r.abort('failed'));
  await page.route('**/assets/images/Red2Premium.png**',r=>r.abort('failed'));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(3000);
  const data=await page.evaluate(()=>({
    title:document.title,
    loader:!!window.HORAssetLoading772,
    birdSelector:!!document.querySelector('#app'),
    bid:!!document.querySelector('#decisionConsole'),
    birdAssetInCss:[...document.styleSheets].some(x=>x.href?.includes('asset-loading772.css')),
    bidAssetInCss:[...document.styleSheets].some(x=>x.href?.includes('approved-bid-portrait.css')),
    htmlBuild:document.querySelector('script[src*="asset-loading772.js"]')?.src
  }));
  assert(data.loader,'Actual game did not initialize asset loader');
  assert(data.birdSelector && data.bid,'Actual game DOM is incomplete');
  assert(data.birdAssetInCss && data.bidAssetInCss,'Critical stylesheets missing');
  await page.screenshot({path:'full-game-artwork-smoke.png',fullPage:false});
  console.log(JSON.stringify({pass:true,scope:'Full game bootstrap/DOM/CSS smoke, portrait Chromium with failed bird requests; not a complete gameplay test',data,errors:failures.slice(0,10)},null,2));
}finally {await browser?.close();server.kill();}
