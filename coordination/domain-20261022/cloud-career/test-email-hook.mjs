import worker from './email-hook.mjs';import assert from 'node:assert/strict';import {webcrypto as crypto,createHmac} from 'node:crypto';

// Nonsecret deterministic fixture; never used in deployment.
const key=Buffer.alloc(32,7),secret='v1,whsec_'+key.toString('base64');let sent=[];
const env={SEND_EMAIL_HOOK_SECRET:secret,EMAIL:{send:async x=>{sent.push(x)}},MAIL_LIMIT:{limit:async()=>({success:true})}};
const payload={user:{id:'fixture-user',email:'fixture@example.invalid'},email_data:{email_action_type:'signup',token:'123456',redirect_to:'https://attacker.invalid'}};
function req(data=payload,age=0,change=false){const body=JSON.stringify(data),time=String(Math.floor(Date.now()/1000)+age),id='fixture-event';const signature=createHmac('sha256',key).update(`${id}.${time}.${body}`).digest('base64');return new Request('https://hook.test/auth-email',{method:'POST',headers:{'webhook-id':id,'webhook-timestamp':time,'webhook-signature':'v1,'+signature},body:change?body+' ':body})}
assert.equal((await worker.fetch(req(),{})).status,503);
assert.equal((await worker.fetch(req(payload,-301),env)).status,401);
assert.equal((await worker.fetch(req(payload,301),env)).status,401);
assert.equal((await worker.fetch(req(payload,0,true),env)).status,401);
assert.equal(sent.length,0);
assert.equal((await worker.fetch(req(),env)).status,200);assert.equal(sent.length,1);assert.match(sent[0].text,/123456/);assert.ok(!sent[0].html.includes('attacker.invalid'));
assert.equal((await worker.fetch(req({...payload,email_data:{email_action_type:'signup',token:'<script>'}}),env)).status,400);
assert.equal((await worker.fetch(req({...payload,email_data:{email_action_type:'magiclink',token:'123456'}}),env)).status,400);
assert.equal((await worker.fetch(req(),{...env,MAIL_LIMIT:{limit:async()=>({success:false})}})).status,429);
assert.equal((await worker.fetch(req(),{...env,EMAIL:{send:async()=>{throw Error('private provider response')}}})).status,503);
assert.equal((await worker.fetch(req({...payload,email_data:{email_action_type:'recovery',token:'654321'}}),env)).status,200);assert.match(sent.at(-1).subject,/Reset/);
console.log('PASS fail-closed hook, signature/body integrity, expired/future timestamps, code-only templates, fixed origin, unsupported action denial, delivery errors, mail throttle');
