const {chromium}=require('playwright');
const fs=require('fs');const assert=require('node:assert/strict');
(async()=>{
const b=await chromium.launch({executablePath:process.cwd()+'/landscape-work/qa/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];const p=await b.newPage({viewport:{width:360,height:740},isMobile:true,hasTouch:true,deviceScaleFactor:3});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('file://'+process.cwd()+'/landscape-work/Overhead-Artwork-Preview.html');await p.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));
for(const [width,height] of [[360,740],[740,360],[393,760],[760,393],[800,1100],[1100,800],[360,740]]){
 await p.setViewportSize({width,height});await p.waitForTimeout(100);
 for(const n of ['10','11','6','1','0']){
 await p.selectOption('#count',n);
 const r=await p.evaluate(()=>({innerWidth,innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight,vw:visualViewport.width,rect:document.querySelector('#stage').getBoundingClientRect().toJSON(),count:document.querySelectorAll('.card').length}));
 assert.equal(r.innerWidth,width);assert.ok(r.sw<=width);assert.ok(r.sh<=height);assert.equal(r.count,+n*4);assert.ok(r.rect.left>=-.1&&r.rect.top>=-.1&&r.rect.right<=width+.1&&r.rect.bottom<=height+.1);results.push({width,height,n,...r});
 }
 await p.selectOption('#count','10');await p.locator('#cards').tap();assert.equal(await p.locator('#cards').textContent(),'Show cards');await p.locator('#cards').tap();
 if(width===740)await p.screenshot({path:'landscape-work/mobile-fit-landscape.png'});
 if(width===360)await p.screenshot({path:'landscape-work/mobile-fit-portrait.png'});
}
assert.deepEqual(errors,[]);fs.writeFileSync('landscape-work/mobile-fit-results.json',JSON.stringify({status:'PASS',cases:results.length,errors,results},null,2));console.log('PASS: '+results.length+' mobile layout/count cases, rotation sequence and touch toggle');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
