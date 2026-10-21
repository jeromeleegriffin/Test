import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const server = spawn('python3', ['-m', 'http.server', '8766', '--bind', '127.0.0.1'], {stdio:'ignore'});
let browser;
try {
  browser = await chromium.launch({headless:true, args:['--no-sandbox']});
  const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  let ready = false;
  const url='http://127.0.0.1:8766/';
  for (let i=0;i<30;i++) {
    try { if ((await page.request.get(url,{timeout:1500})).ok()) {ready=true;break;} } catch {}
    await new Promise(r=>setTimeout(r,250));
  }
  assert(ready, 'Test server never became ready');
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(() => typeof startSoloPractice === 'function',null,{timeout:20000});
  const before=await page.evaluate(() => ({buttons:!!document.querySelector('#soloPracticeBtn'),app:!!document.querySelector('#app'),loader:!!window.HORAssetLoading772}));
  assert(before.buttons && before.app && before.loader);
  const start=await page.evaluate(() => {
    try { startSoloPractice(); return {started:true,phase:game?.phase}; }
    catch(e) {return {started:false,error:String(e)}}
  });
  assert(start.started, 'Could not start actual offline game: '+JSON.stringify(start));
  await page.waitForFunction(() => {
    const hand=document.querySelector('#myHand');
    return document.body.classList.contains('in-game') &&
      hand?.querySelectorAll(':scope > .card-face').length >= 9;
  },null,{timeout:25000});
  await page.waitForTimeout(1800);
  const data=await page.evaluate(() => {
    const hand=document.querySelector('#myHand');
    const cards=[...hand.querySelectorAll(':scope > .card-face')];
    const fmt=el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height,left:r.left,top:r.top,display:getComputedStyle(el).display}};
    const imgs=cards.map(el=>el.querySelector('img')).filter(Boolean);
    return {
      phase:game.phase,
      player:myIndex,
      cards:cards.length,
      cardBoxes:cards.map(fmt),
      imageBoxes:imgs.map(fmt),
      loadedImages:imgs.filter(i=>i.naturalWidth>0).length,
      imageCount:imgs.length,
      screen:{width:innerWidth,height:innerHeight},
      inGame:document.body.classList.contains('in-game'),
      gameScreenVisible:!document.querySelector('#gameScreen')?.classList.contains('hidden'),
      bidSurfacePresent:!!document.querySelector('.approved-bid-surface'),
      bodyClass:document.body.className
    };
  });
  assert.equal(data.inGame,true);
  assert(data.cards>=9);
  assert(data.cardBoxes.filter(r=>r.width>=12 && r.height>=20).length>=9,'Actual game card boxes collapsed');
  assert(data.imageBoxes.filter(r=>r.width>0 && r.height>0).length>=8,'Actual in-game card artwork sizes collapsed');
  await page.screenshot({path:'actual-gameplay-geometry.png'});
  console.log(JSON.stringify({pass:true,scope:'Actual offline game startup and rendered portrait 10-card hand, local Chromium. Not hosted multiplayer or physical Android.',data,errors:errors.slice(0,12)},null,2));
} finally {await browser?.close();server.kill();}
