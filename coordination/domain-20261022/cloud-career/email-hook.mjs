// Supabase Send Email Hook → Cloudflare Email Service.
// Fail closed until the matching hook secret is configured on both services.
const FROM='noreply@accounts.jeromegriffin.com';
const GAME='https://rooks.jeromegriffin.com/';
const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function verifyHook(request,raw,secret){
 const id=request.headers.get('webhook-id')||'',timestamp=request.headers.get('webhook-timestamp')||'';
 if(!id||id.length>256||!/^\d{10}$/.test(timestamp)||Math.abs(Date.now()/1000-Number(timestamp))>300)return false;
 const keyBytes=bytes(secret.replace(/^v1,/, '').replace(/^whsec_/,''));
 if(keyBytes.length<24||keyBytes.length>64)return false;
 const key=await crypto.subtle.importKey('raw',keyBytes,{name:'HMAC',hash:'SHA-256'},false,['verify']);
 const signed=new TextEncoder().encode(`${id}.${timestamp}.${raw}`);
 for(const entry of (request.headers.get('webhook-signature')||'').split(' ').slice(0,8)){
  const [version,signature]=entry.split(',');if(version!=='v1'||!signature)continue;
  try{if(await crypto.subtle.verify('HMAC',key,bytes(signature),signed))return true}catch{}
 }
 return false;
}
export default {async fetch(request,env){
 const reply=(status,message)=>Response.json(status===200?{}:{error:{http_code:status,message}},{status,headers:{'cache-control':'no-store'}});
 if(request.method!=='POST'||new URL(request.url).pathname!=='/auth-email')return reply(404,'Not found');
 if(!env.SEND_EMAIL_HOOK_SECRET||!env.EMAIL)return reply(503,'Email service is not configured');
 try{
  const reader=request.body?.getReader();let size=0,parts=[];
  if(reader)while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>65536){await reader.cancel();return reply(413,'Request too large')}parts.push(value)}
  const rawBytes=new Uint8Array(size);let offset=0;for(const part of parts){rawBytes.set(part,offset);offset+=part.length}
  const raw=new TextDecoder('utf-8',{fatal:true}).decode(rawBytes);
  if(!await verifyHook(request,raw,env.SEND_EMAIL_HOOK_SECRET))return reply(401,'Invalid signature');
  const {user,email_data:data}=JSON.parse(raw);
  if(!user||!data||typeof user.email!=='string'||user.email.length>254||!/^\S+@\S+\.\S+$/.test(user.email))return reply(400,'Invalid email request');
  const descriptions={signup:['Confirm your Griffin cloud account','Confirm email'],recovery:['Reset your Griffin cloud password','Password recovery']};
  const entry=descriptions[data.email_action_type];
  if(!entry||typeof data.token!=='string'||!/^\d{6,10}$/.test(data.token))return reply(400,'Unsupported email action');
  if(!env.MAIL_LIMIT||!(await env.MAIL_LIMIT.limit({key:'auth:'+user.id})).success)return reply(429,'Please request another code later');
  const [subject,heading]=entry;
  const instruction=data.email_action_type==='signup'?'Choose “I already have an email code”, then “Confirm my email”.':'Choose “I already have an email code”, then “Reset my password”. Enter this code and your new password.';
  const text=`Griffin House of Rooks\n${heading}\n\nYour code: ${data.token}\n\nOpen the game: ${GAME}\nMenu → My Career & Awards → Cloud career, saves & recovery. ${instruction}\n\nUse your most recent code. If it has expired, request a new one. Never share this code. If you did not request this, ignore this email. Your career and achievements are unchanged.`;
  const html=`<!doctype html><html><body style="margin:0;background:#10283c;color:#fff;font:16px Arial,sans-serif"><div style="max-width:480px;margin:auto;padding:28px"><img src="${GAME}cloud-game/assets/assets/images/house-of-rooks-192.png?v=805-ownerreview" width="80" height="80" alt="Griffin House of Rooks"><h1 style="font-size:24px;color:#e4c77f">${heading}</h1><p>Your code:</p><p style="font-size:32px;letter-spacing:5px;font-weight:bold">${data.token}</p><p>Open <a style="color:#e4c77f" href="${GAME}">Griffin House of Rooks</a>, then Menu → My Career &amp; Awards → Cloud career, saves &amp; recovery.</p><p>${instruction}</p><p>Use your most recent code. If it has expired, request a new one. Never share this code.</p><p>If you did not request this, ignore this email. Your career and achievements are unchanged.</p></div></body></html>`;
  await env.EMAIL.send({to:user.email,from:{email:FROM,name:'Griffin House of Rooks'},subject,text,html});
  return reply(200);
 }catch{return reply(503,'Email delivery could not be completed')}
}};
