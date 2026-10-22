// Build the immutable R10 Cloudflare Static Assets candidate without a
// browser, GitHub at runtime, service-worker resets or UI edits.
// This script runs only in isolated CI against two checked-out source trees.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const source=path.resolve(process.argv[2]||'source');
const work=path.resolve(process.argv[3]||'work');
const output=path.resolve(process.argv[4]||'cloudflare-dist');
const assets=path.join(output,'public','cloud-game','assets');
const preflight=path.join(output,'audit');
const frozen='90078a710948c7643caafb18986e34dc71ce7cee';
const raw='https://raw.githubusercontent.com/jeromeleegriffin/Test/'+frozen+'/';
const runtimeFolders=['assets','voices','vendor','player','x1'];
const rootExtensions=new Set(['.html','.js','.css','.json','.webmanifest','.png','.svg','.webp','.jpg','.jpeg','.woff','.woff2','.ttf','.wav','.mp3','.ogg','.ico','.txt','.wasm']);
const limit=25*1024*1024;
const list=[];
function addFolder(folder){
  const root=path.join(source,folder);
  if(!fs.existsSync(root))return;
  for(const entry of fs.readdirSync(root,{withFileTypes:true})){
    const target=path.join(root,entry.name);
    if(entry.isDirectory())walk(target);
    else if(entry.isFile())add(target);
  }
}
function walk(folder){
  for(const entry of fs.readdirSync(folder,{withFileTypes:true})){
    const dest=path.join(folder,entry.name);
    if(entry.isDirectory())walk(dest);
    else if(entry.isFile())add(dest);
  }
}
function add(src){
  const rel=path.relative(source,src).replaceAll(path.sep,'/');
  if(rel.startsWith('../')||rel.startsWith('.'))throw Error('Unsafe asset '+rel);
  const size=fs.statSync(src).size;
  if(size>limit)throw Error('Cloudflare 25-MiB per-file limit exceeded: '+rel+' ('+size+')');
  const to=path.join(assets,rel);
  fs.mkdirSync(path.dirname(to),{recursive:true});
  fs.copyFileSync(src,to);
  const sha256=crypto.createHash('sha256').update(fs.readFileSync(to)).digest('hex');
  list.push({path:rel,bytes:size,sha256});
}
for(const entry of fs.readdirSync(source,{withFileTypes:true})){
  if(entry.isFile() && !entry.name.startsWith('.') && !/^package(?:-lock)?\.json$/.test(entry.name) && rootExtensions.has(path.extname(entry.name).toLowerCase()))add(path.join(source,entry.name));
}
for(const folder of runtimeFolders)addFolder(folder);
if(!list.some(e=>e.path==='index.html'))throw Error('Missing approved root index.html');
if(!list.some(e=>e.path==='cloudflare-entry.js'))throw Error('Missing Cloudflare-native entry script');
const patchFrom=path.join(work,'asset-loading772.js');
if(!fs.existsSync(patchFrom))throw Error('Missing isolated artwork recovery patch');
const repair=fs.readFileSync(patchFrom);
if(!repair.toString().includes('restoreUnloadedStylesheets'))throw Error('Repair not present');
fs.copyFileSync(patchFrom,path.join(assets,'asset-loading772.js'));
const repaired=list.find(e=>e.path==='asset-loading772.js');
if(!repaired)throw Error('Missing base asset loader');
repaired.bytes=repair.length;repaired.sha256=crypto.createHash('sha256').update(repair).digest('hex');repaired.patch='work/asset-recovery-20261021';
// Owner-authorized R11 policy overlays; every other original R10 asset stays pinned.
const policyFiles=['game060.js','index.html','polish.js','bots.js','x1/integration.js','progression.js','hor-version.js','sw060.js'];
for(const rel of policyFiles){
  const bytes=fs.readFileSync(path.join(work,rel));
  const item=list.find(e=>e.path===rel);
  if(!item)throw Error('Missing Moon policy base asset: '+rel);
  fs.copyFileSync(path.join(work,rel),path.join(assets,rel));
  item.bytes=bytes.length;item.sha256=crypto.createHash('sha256').update(bytes).digest('hex');item.patch='human-only-moon-r11';
}
if(!fs.readFileSync(path.join(assets,'game060.js'),'utf8').includes('or lose the match'))throw Error('Moon UI overlay absent');
if(!fs.readFileSync(path.join(work,'cloudflare/live/worker-live.mjs'),'utf8').includes('BOT_MOON_FORBIDDEN'))throw Error('Moon reducer authority absent');
const originalSW=fs.readFileSync(path.join(source,'sw060.js'),'utf8');
const shellRegion=originalSW.match(/const SHELL\s*=\s*\[([\s\S]*?)\];/);
if(!shellRegion)throw Error('Source has no auditable service-worker shell');
const referenced=[...shellRegion[1].matchAll(/['"]\.\/([^'"]*)['"]/g)].map(x=>x[1]).filter(Boolean);
const existing=new Set(list.map(e=>e.path));
const missing=[...new Set(referenced.filter(p=>!existing.has(p)))];
if(missing.length)throw Error('Service-worker dependencies absent: '+missing.slice(0,20).join(', '));
const workerFile=path.join(work,'cloudflare','live','worker-live.mjs');
let worker=fs.readFileSync(workerFile,'utf8');
const commonJSOnly="typeof module!=='undefined'?require('./core.js'):root.X1Core";
if(worker.split(commonJSOnly).length!==2)throw Error('Unexpected X1 runtime CommonJS selection');
worker=worker.replace(commonJSOnly,'root.X1Core'); // Workers module runtime uses the original global X1 core.

const escapeReg=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
// Replace only the THREE known pinned GitHub runtime fetches, not any API logic.
const htmlPattern=/fetch\("https:\/\/raw\.githubusercontent\.com\/jeromeleegriffin\/Test\/90078a710948c7643caafb18986e34dc71ce7cee\/index\.html",\s*\{\s*redirect:\s*"follow",\s*cf:\s*\{\s*cacheEverything:\s*true,\s*cacheTtlByStatus:\s*\{\s*"200-299":\s*86400,\s*"300-599":\s*-1\s*\}\s*\}\s*\}\)/g;
let htmlCount=0;
worker=worker.replace(htmlPattern,()=>{htmlCount++;return 'env.ASSETS.fetch(new Request(new URL("/cloud-game/assets/index.html", request.url)))';});
if(htmlCount!==2)throw Error('Expected two index GitHub fetches; got '+htmlCount);
const assetPattern=/fetch\(`https:\/\/raw\.githubusercontent\.com\/jeromeleegriffin\/Test\/90078a710948c7643caafb18986e34dc71ce7cee\/\$\{assetPath\}`,\s*\{\s*method:\s*request\.method,\s*headers:\s*\{\s*"accept":\s*request\.headers\.get\("accept"\)\s*\|\|\s*"\*\/\*"\s*\},\s*redirect:\s*"follow",\s*cf:\s*\{\s*cacheEverything:\s*true,\s*cacheTtlByStatus:\s*\{\s*"200-299":\s*86400,\s*"300-599":\s*-1\s*\}\s*\}\s*\}\)/g;
let assetCount=0;
worker=worker.replace(assetPattern,()=>{assetCount++;return 'env.ASSETS.fetch(new Request(new URL("/cloud-game/assets/" + assetPath,request.url), { method:request.method }))';});
if(assetCount!==1)throw Error('Expected one GitHub asset proxy; got '+assetCount);
if(worker.includes(raw)||worker.includes('raw.githubusercontent.com'))throw Error('Runtime worker retains GitHub fetch');
if(!worker.includes('CLOUD_GAME_ADAPTER')||!worker.includes('var RoomDO = class extends DurableObject'))throw Error('Worker/game intelligence unintentionally stripped');
const resultFile=path.join(output,'worker-cloud-only.mjs');
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(resultFile,worker);
list.sort((a,b)=>a.path.localeCompare(b.path));
const meta={
  project:'Griffin House of Rooks',
  frozenGameCommit:frozen,
  patchBranch:'work/asset-recovery-20261021',
  workerOrigin:'cloudflare/live/worker-live.mjs',
  workerSha256:crypto.createHash('sha256').update(worker).digest('hex'),
  assetCount:list.length,assetBytes:list.reduce((n,x)=>n+x.bytes,0),
  checkedShellDependencies:referenced.length,
  fetchedFromGitHubAtRuntime:false,
  noLiveDeploy:true,
  paths:list
};
fs.mkdirSync(preflight,{recursive:true});
fs.writeFileSync(path.join(preflight,'release-manifest.json'),JSON.stringify(meta,null,2)+'\n');
fs.writeFileSync(path.join(preflight,'SHA256SUMS'),list.map(x=>x.sha256+'  '+x.path).join('\n')+'\n');
console.log(JSON.stringify({success:true,assetCount:meta.assetCount,assetMiB:+(meta.assetBytes/1048576).toFixed(2),workerBytes:worker.length,shellValidated:meta.checkedShellDependencies,htmlFetchRewrites:htmlCount,assetFetchRewrites:assetCount,noGitHubRuntime:true,artifact:output},null,2));

