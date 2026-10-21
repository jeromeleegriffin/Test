import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const source = fs.readFileSync('asset-loading772.js','utf8');
const start = source.indexOf('  // Recover approved artwork in existing DOM nodes');
const end = source.indexOf('  window.HORAssetLoading772 =', start);
assert(start >= 0 && end > start, 'Expected production recovery source missing');
const handler = source.slice(start,end);
const browser = await chromium.launch({headless:true, args:['--no-sandbox']});
const page = await browser.newPage({viewport:{width:390,height:844}});
const errors = [];
page.on('pageerror', e => errors.push(e.message));
const images = new Map([\n ['rook.png', fs.readFileSync('assets/images/RookPremium.png')],\n ['red.png', fs.readFileSync('assets/images/Red2Premium.png')],\n ['card.png', fs.readFileSync('assets/cards/numbered/red-10.png')],\n ['bid.png', fs.readFileSync('assets/bidbox-moon-review/bidbox-approved-scrollwork.png')],\n]);
const paths = [
 {cls:'rook-bird-img', path:'/rook.png'},
 {cls:'red2-img', path:'/red.png'},
 {cls:'numbered-card-img', path:'/card.png'},
 {cls:'approved-bid-art', path:'/bid.png'},
];
let connected = false;
await page.route('https://artwork.qa.test/**', route => connected
 ? route.fulfill({status:200, contentType:'image/png', body:images.get(new URL(route.request().url()).pathname.split('/').at(-1))})
 : route.abort('failed'));
await page.setContent('<html><head><style>.card-face{width:100px;height:145px}.card-face img{width:100%;height:100%;object-fit:contain}</style></head><body></body></html>');
await page.evaluate(handler => { new Function(handler)(); }, handler);
await page.evaluate(paths => {
 for (const {cls,path} of paths) {
   const d=document.createElement('div');
   d.className='card-face';
   const img=document.createElement('img');
   img.className=cls;
   img.src='https://artwork.qa.test'+path;
   d.append(img);
   document.body.append(d);
 }
}, paths);
await page.waitForFunction(() => [...document.querySelectorAll('img')].every(x => x.dataset.loadRetry772==='2'), {timeout:10000}).catch(()=>{});
connected = true;
await page.evaluate(()=>window.dispatchEvent(new Event('online')));
await page.waitForFunction(() => [...document.querySelectorAll('img')].every(x=>x.naturalWidth>0),{timeout:12000});
const result=await page.evaluate(() => [...document.querySelectorAll('img')].map(img=>({cls:img.className,loaded:img.naturalWidth>0,box:img.getBoundingClientRect().toJSON(),hasRecovery:img.src.includes('fresh='),retryCleared:!img.dataset.loadRetry772})));
assert(result.length===4 && result.every(x=>x.loaded && x.retryCleared));
assert(result.every(x=>x.box.width>=90 && x.box.height>=140));
assert.deepEqual(errors,[]);
await page.screenshot({path:'artwork-recovery-browser.png'});
console.log(JSON.stringify({pass:true,scope:'Actual Chromium DOM/image request failure/recovery, isolated renderer fixture; not full game and not Android',result},null,2));
await browser.close();