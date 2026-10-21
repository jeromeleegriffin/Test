import assert from 'node:assert/strict';
const origin='https://griffin-rooks-cloud-only-stage.jeromeleegriffin.workers.dev';
const items=[
 ['/cloud-game/assets/asset-loading772.js','javascript','restoreUnloadedStylesheets'],
 ['/cloud-game/assets/approved-bid-portrait.css','css',''],
 ['/cloud-game/assets/assets/images/RookPremium.png','png',''],
 ['/cloud-game/assets/assets/images/Red2Premium.png','png',''],
 ['/cloud-game/assets/assets/cards/numbered/red-10.png','png',''],
 ['/cloud-game/assets/index.html','html','soloPracticeBtn'],
 ['/cloud-game/assets/cloudflare-entry.js','javascript','friendsToggleBtn'],
 ['/cloud-game/assets/voices/jerome/trumps_are_green.ogg','ogg','']
];
const out=[];
for(const [path,type,marker] of items){
 let r;
 try{r=await fetch(origin+path,{redirect:'manual',signal:AbortSignal.timeout(22000)})}
 catch(e){throw Error('Staging GET failed '+path+': '+e.message)}
 const buffer=Buffer.from(await r.arrayBuffer());
 const contentType=r.headers.get('content-type')||'';
 const text=['javascript','css','html'].includes(type)?buffer.toString('utf8'):'';
 out.push({path,status:r.status,bytes:buffer.length,type:contentType,marker:!!(marker&&text.includes(marker)),firstText:r.ok?'':text.slice(0,120)});
 assert(r.ok(),'Non-200 staging response: '+JSON.stringify(out.at(-1)));
 assert(contentType.includes(type),'Incorrect Cloudflare MIME: '+JSON.stringify(out.at(-1)));
 assert(buffer.length>300,'Unexpectedly empty asset: '+path);
 if(marker)assert(text.includes(marker),'Expected native game source missing: '+path);
}
const root=await fetch(origin+'/',{signal:AbortSignal.timeout(12000)}).catch(e=>({status:-1,text:()=>Promise.resolve(e.message)}));
out.push({path:'/',status:root.status,firstText:(await root.text()).slice(0,180)});
console.log(JSON.stringify({pass:true,scope:'Real deployed Cloudflare-only staging asset responses; no credentials or room mutations',results:out},null,2));
