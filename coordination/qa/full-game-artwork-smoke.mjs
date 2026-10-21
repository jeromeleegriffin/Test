import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn('python3',['-m','http.server','8765','--bind','127.0.0.1'],{stdio:'ignore'});
let browser;
try {
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'});
  const failures=[];
  page.on('pageerror',e=>failures.push(String(e)));
  const url='http://127.0.0.1:8765/';
  let loaded=false;
  for(let i=0;i<20;i++){try{const r=await page.request.get(url,{timeout:1000});if(r.ok()){loaded=true;break}}catch{}await new Promise(r=>setTimeout(r,250))}
  assert(loaded,'Local game server failed to boot');
  let stylesRestored=false;
  let cssFailures=0;
  await page.route('**/approved-bid-portrait.css**',r=>stylesRestored?r.continue():(cssFailures++,r.abort('failed')));
  await page.route('**/asset-loading772.css**',r=>stylesRestored?r.continue():(cssFailures++,r.abort('failed')));
  let artworkRestored=false;
  await page.route('**/assets/images/RookPremium.png**',r=>artworkRestored?r.continue():r.abort('failed'));
  await page.route('**/assets/images/Red2Premium.png**',r=>artworkRestored?r.continue():r.abort('failed'));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(3000);
  assert(cssFailures >= 2,'Failed-stylesheet test did not actually block both CSS files');
  const beforeStyleRecovery=await page.evaluate(()=>({
    loaderCss:!![...document.styleSheets].find(x=>x.href?.includes('asset-loading772.css')),
    bidCss:!![...document.styleSheets].find(x=>x.href?.includes('approved-bid-portrait.css')),
    links:[...document.querySelectorAll('link[rel~=stylesheet]')].filter(x=>/asset-loading772|approved-bid-portrait/.test(x.href)).map(x=>({href:x.href,sheet:!!x.sheet,rules:(()=>{try{return x.sheet?.cssRules?.length ?? -1}catch{return -2}})()})),
  }));
  assert(beforeStyleRecovery.links.length===2 && beforeStyleRecovery.links.every(x=>x.rules<=0),'Critical CSS was actually available before recovery: '+JSON.stringify({beforeStyleRecovery,cssFailures}));
  stylesRestored=true;
  await page.evaluate(()=>window.dispatchEvent(new Event('online')));
  await page.waitForFunction(()=>[...document.querySelectorAll('link[rel~=stylesheet]')].filter(x=>/asset-loading772|approved-bid-portrait/.test(x.href)).every(x=>{try{return x.sheet?.cssRules?.length>0}catch{return false}}),null,{timeout:12000});
  const afterStyleRecovery=await page.evaluate(()=>({
    loaderCss:!![...document.styleSheets].find(x=>x.href?.includes('asset-loading772.css')),
    bidCss:!![...document.styleSheets].find(x=>x.href?.includes('approved-bid-portrait.css')),
    navigationCount:performance.getEntriesByType('navigation').length,
    links:[...document.querySelectorAll('link[rel~=stylesheet]')].filter(x=>/asset-loading772|approved-bid-portrait/.test(x.href)).map(x=>({href:x.href,rules:(()=>{try{return x.sheet?.cssRules?.length??-1}catch{return -2}})()})),
  }));
  assert(afterStyleRecovery.loaderCss && afterStyleRecovery.bidCss && afterStyleRecovery.links.every(x=>x.rules>0));
  assert.equal(afterStyleRecovery.navigationCount,1,'Game unexpectedly reloaded on CSS recovery');
  // Exercise the game's real render function and its built-in text fallbacks.
  await page.evaluate(() => {
    const root=document.createElement('div');
    root.id='qa-real-bird-cards';
    root.style.cssText='position:fixed;left:10px;top:10px;display:flex;z-index:1000';
    for(const c of [{id:'rook',color:'rook',rank:0},{id:'red-2',color:'red',rank:2}]) {
      const item=document.createElement('div');
      item.className='card-face';
      item.style.cssText='width:70px;height:100px;position:relative';
      item.innerHTML=cardInnerHTML(c);
      root.append(item);
    }
    document.body.append(root);
  });
  await page.waitForFunction(()=>[...document.querySelectorAll('#qa-real-bird-cards img')].length===2 &&
    [...document.querySelectorAll('#qa-real-bird-cards img')].every(img=>img.dataset.loadRetry772==='2'),null,{timeout:12000});
  const fallbackBefore=await page.evaluate(()=>[...document.querySelectorAll('#qa-real-bird-cards img')].map(img=>({
    cls:img.className,naturalWidth:img.naturalWidth,fallback:getComputedStyle(img.nextElementSibling).display
  })));
  assert(fallbackBefore.every(x=>x.naturalWidth===0 && x.fallback!=='none'),'Native bird fallback did not appear');
  artworkRestored=true;
  await page.evaluate(()=>window.dispatchEvent(new Event('online')));
  await page.waitForFunction(()=>[...document.querySelectorAll('#qa-real-bird-cards img')].every(img=>img.naturalWidth>0 &&
    getComputedStyle(img.nextElementSibling).display==='none'),null,{timeout:12000});
  const fallbackAfter=await page.evaluate(()=>[...document.querySelectorAll('#qa-real-bird-cards img')].map(img=>({
    cls:img.className,naturalWidth:img.naturalWidth,fallback:getComputedStyle(img.nextElementSibling).display
  })));

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
  // The card-size check compares the exact same image nodes across forced
  // fail/recover. Never infer that this tests the complete bidding UI.
  await page.evaluate(() => {
    const holder=document.createElement('div');
    holder.id='recovery-geometry-fixture';
    holder.style.cssText='position:fixed;left:8px;top:8px;z-index:1000;width:110px;height:155px';
    holder.innerHTML='<div class="card-face" style="position:relative;width:110px;height:155px"><div class="c-stack numbered-asset-stack"><img class="numbered-card-img" src="assets/cards/numbered/red-10.png" style="display:block;width:100%;height:100%;object-fit:contain" /></div></div>';
    document.body.append(holder);
  });
  await page.locator('#recovery-geometry-fixture img').waitFor({state:'attached'});
  const geometry=await page.locator('#recovery-geometry-fixture img').evaluate(img=>({
    width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height,naturalWidth:img.naturalWidth
  }));
  assert(geometry.naturalWidth > 0,'Numbered card asset was not decoded');
  data.geometryVisible = geometry.width > 50 && geometry.height > 80;
  data.geometryLimitation = data.geometryVisible ? 'Fixture visible' : 'Fixture hidden by native pre-game/loading rules; actual gameplay size not certified';
  data.geometry=geometry;
  // Now start a genuine offline game after both stylesheet/image recoveries.
  await page.evaluate(()=>startSoloPractice());
  await page.waitForFunction(()=>document.body.classList.contains('in-game') &&
    document.querySelectorAll('#myHand > .card-face').length>=9,null,{timeout:25000});
  await page.waitForTimeout(700);
  const afterRecoveredGameplay=await page.evaluate(()=>{
    const cards=[...document.querySelectorAll('#myHand > .card-face')];
    const imgs=cards.map(c=>c.querySelector('img')).filter(Boolean);
    return {
      phase:game.phase,
      count:cards.length,
      widths:cards.map(c=>Math.round(c.getBoundingClientRect().width)),
      heights:cards.map(c=>Math.round(c.getBoundingClientRect().height)),
      loadedImages:imgs.filter(img=>img.naturalWidth>0).length,
      totalImages:imgs.length,
      navigationCount:performance.getEntriesByType('navigation').length
    };
  });
  assert(afterRecoveredGameplay.count>=9 && afterRecoveredGameplay.widths.every(w=>w>=20 && w<80),
    'Real in-game hand sizing failed after CSS restoration: '+JSON.stringify(afterRecoveredGameplay));
  assert(afterRecoveredGameplay.loadedImages>=8,'Real game hand images did not recover');
  assert.equal(afterRecoveredGameplay.navigationCount,1,'Reconnection caused a game reload');
  await page.screenshot({path:'full-game-artwork-smoke.png',fullPage:false});
  console.log(JSON.stringify({pass:true,scope:'Actual game bootstrap; both real critical stylesheets aborted then recovered on online event without reload; not Android',beforeStyleRecovery,afterStyleRecovery,fallbackBefore,fallbackAfter,afterRecoveredGameplay,data,errors:failures.slice(0,10)},null,2));
}finally {await browser?.close();server.kill();}
