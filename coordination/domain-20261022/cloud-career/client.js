(()=>{'use strict';
 let user=null,revision=0,busy=false,linked=false,lastHash='',linkedActor='',panel,status,actions,emailReady=false;
 const P=()=>window.HORProgression,core=()=>P()?.core;
 const hash=()=>core().digest(core().collect());
 const api=async(path,body)=>{const r=await fetch('/career-api/'+path,{method:body?'POST':'GET',headers:body?{'content-type':'application/json'}:{},body:body?JSON.stringify(body):undefined,cache:'no-store',signal:AbortSignal.timeout(30000)});const x=await r.json();if(!r.ok){if(r.status===401||r.status===409)linked=false;throw Error(x.error||'Cloud connection unavailable')}return x};
 const tell=t=>{if(status)status.textContent=t};
 const button=(label,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.style.cssText='display:block;width:100%;padding:12px;margin:9px 0;background:#17334a;color:white;border:1px solid #c8ab68;border-radius:8px;cursor:pointer';b.onclick=async()=>{if(busy)return;busy=true;b.disabled=true;try{await fn()}catch(e){tell(e.message)}finally{busy=false;b.disabled=false}};actions.append(b);return b};
 const summary=b=>{try{const s=JSON.parse(b.data.horCareerStateV2);return `${s.identity.displayName}: ${s.records.human.stats.points||0} points, ${s.records.human.stats.gamesPlayed||0} games`}catch{return 'Saved career'}};
 function remember(){linkedActor=core().read()?.identity.id;localStorage.setItem('horCloudLinkV1',JSON.stringify({user:user.id,actor:core().read()?.identity.id,revision,hash:lastHash}))}
 async function save(){const payload=P().protection.buildBackup(),captured=core().digest(payload.data);const r=await api('save',{payload,revision,userId:user.id});revision=r.revision;lastHash=captured;linked=true;remember();tell('Saved to your account. Changes on this device will save automatically while the game is open.')}
 async function restore(payload){core().validateBackup(payload);const expected=hash();if(!confirm('Use '+summary(payload)+' on this device? Your current career will be preserved as a safety backup.'))return;
 P().protection.restoreBackupObject(payload,{expectedLocalHash:expected});linked=false;localStorage.removeItem('horCloudLinkV1');tell('Career recovered. Reloading…');location.reload()}
 async function signedIn(){actions.replaceChildren();const rows=await api('current'),current=rows[0];if(revision!==(current?.revision||0))linked=false;revision=current?.revision||0;
 tell('Signed in as '+user.email+'. '+(current?'Cloud: '+summary(current.payload)+'.':'No cloud save yet.'));
 button(current?'Save this device’s career to my account':'Start cloud saving from this device',async()=>{if(current&&!confirm('Save '+summary(P().protection.buildBackup())+' to this account? The previous cloud save stays in recovery history.'))return;await save()});
 if(current)button('Use my cloud career on this device',()=>restore(current.payload));
 button('Recover an earlier cloud save',async()=>{const list=await api('versions');actions.replaceChildren();tell(list.length?'Choose a saved version. You will confirm before anything changes.':'No saved versions yet.');for(const v of list)button(`${new Date(v.created_at).toLocaleString()} — ${v.display_name} (save ${v.revision})`,async()=>{const rows=await api('version/'+v.revision);if(!rows[0])throw Error('Saved version unavailable');await restore(rows[0].payload)});button('Back',signedIn)});
 button('Download a backup file',()=>P().protection.downloadBackup());
 if(localStorage.getItem('horBeforeCloudRecoveryV1'))button('Download career preserved before recovery',()=>{const a=document.createElement('a'),u=URL.createObjectURL(new Blob([localStorage.getItem('horBeforeCloudRecoveryV1')],{type:'application/json'}));a.href=u;a.download='Griffin-career-before-recovery.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)});
 button('Sign out of cloud career',async()=>{await api('logout',{});linked=false;user=null;localStorage.removeItem('horCloudLinkV1');login();tell('Signed out. Your career remains on this device.')});
 }
 function login(){actions.replaceChildren();tell('Sign in to save your career and achievements across devices. You can keep playing without an account.');
 const form=document.createElement('form');actions.append(form);const email=document.createElement('input'),password=document.createElement('input');email.setAttribute('aria-label','Email');password.setAttribute('aria-label','Password');email.type='email';email.placeholder='Email';email.autocomplete='username';password.type='password';password.placeholder='Password';password.autocomplete='current-password';for(const input of [email,password]){input.required=true;input.style.cssText='box-sizing:border-box;width:100%;padding:12px;margin:6px 0';form.append(input)}
 const sign=button('Sign in',async()=>{if(!form.reportValidity())return;const r=await api('login',{email:email.value.trim(),password:password.value});password.value='';user=r.user;linked=false;await signedIn()});form.onsubmit=e=>{e.preventDefault();sign.click()};
 if(emailReady){button('Create a cloud account',()=>accountForm('signup',email.value.trim()));button('Forgot password?',()=>accountForm('recover',email.value.trim()));button('I already have an email code',()=>{const address=email.value.trim();actions.replaceChildren();tell('Which code did you request?');button('Confirm my email',()=>accountForm('confirm-email',address));button('Reset my password',()=>accountForm('reset-password',address));button('Back to sign in',login)})}
 else{const note=document.createElement('p');note.textContent='Cloud account signup and email recovery are being prepared. Your career and achievements keep saving on this device.';actions.append(note)}
 }
 function accountForm(mode,address=''){
  actions.replaceChildren();linked=false;
  const verify=mode==='confirm-email'||mode==='reset-password',reset=mode==='reset-password';
  tell(mode==='signup'?'Create an optional cloud account. Your current career stays on this device until you choose to back it up.':mode==='recover'?'Enter your account email to receive a password-reset code.':reset?'Enter the recovery code from your email and choose a new password.':'Enter the confirmation code from your email.');
  const form=document.createElement('form');actions.append(form);
  const field=(label,type,autocomplete)=>{const input=document.createElement('input');input.type=type;input.required=true;input.autocomplete=autocomplete;input.placeholder=label;input.setAttribute('aria-label',label);input.style.cssText='box-sizing:border-box;width:100%;padding:12px;margin:6px 0';form.append(input);return input};
  const email=field('Email','email','username');email.value=address;email.maxLength=254;
  let code,password,repeat;
  if(verify){code=field('Email code','text','one-time-code');code.inputMode='numeric';code.pattern='[0-9]{6,10}';code.maxLength=10}
  if(mode==='signup'||reset){password=field('New password (12+ characters)','password','new-password');password.minLength=12;password.maxLength=128;repeat=field('Repeat new password','password','new-password');repeat.minLength=12;repeat.maxLength=128}
  const submit=button(mode==='signup'?'Send confirmation code':mode==='recover'?'Send recovery code':reset?'Save new password':'Confirm email',async()=>{
   if(!form.reportValidity())return;if(password&&password.value!==repeat.value)throw Error('The passwords do not match.');
   const result=await api(mode,{email:email.value.trim(),...(code?{code:code.value.trim()}:{}),...(password?{password:password.value}:{})});
   if(password){password.value='';repeat.value=''}if(code)code.value='';
   if(mode==='signup')accountForm('confirm-email',email.value.trim());else if(mode==='recover')accountForm('reset-password',email.value.trim());else{if(reset){user=null;localStorage.removeItem('horCloudLinkV1')}login()}
   tell(result.message);
  });form.onsubmit=e=>{e.preventDefault();submit.click()};
  if(verify)button('Request a new code',async()=>{if(!email.reportValidity())return;const result=await api(reset?'recover':'resend-confirmation',{email:email.value.trim()});tell(result.message)});
  button('Back to sign in',login);
 }
 async function open(){if(!core())return alert('Career is still loading. Please try again in a moment.');if(!panel){panel=document.createElement('dialog');panel.style.cssText='position:fixed;inset:0;margin:auto;box-sizing:border-box;max-width:440px;width:94vw;max-height:90vh;overflow:auto;background:#10283c;color:#fff;border:2px solid #c8ab68;border-radius:12px;padding:20px;font:16px system-ui';const title=document.createElement('h2');title.textContent='Cloud Career';panel.append(title);status=document.createElement('p');status.setAttribute('role','status');panel.append(status);actions=document.createElement('div');panel.append(actions);const close=document.createElement('button');close.textContent='Back to game';close.style.cssText='padding:12px;margin-top:10px';close.onclick=()=>panel.close();panel.append(close);document.body.append(panel)}panel.showModal();tell('Connecting…');emailReady=false;try{emailReady=(await api('config')).emailReady===true;user=(await api('session')).user;await signedIn()}catch(e){login();tell(e.message)}}
 window.GHRCloudCareer={open};
 function install(){for(const h of document.querySelectorAll('h1,h2,h3'))if(h.textContent.trim()==='My Career & Awards'){const parent=h.closest('#houseDetails805')?.querySelector('.house-content')||h.parentElement;if(!parent.querySelector('[data-cloud-career]')){const b=document.createElement('button');b.dataset.cloudCareer='1';b.textContent='Cloud career, saves & recovery';b.className='house-action';b.style.cssText='padding:12px;cursor:pointer;color:inherit';b.onclick=open;parent.append(b)}}}
 new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true});install();
 async function resume(){try{if(!core())return;const saved=JSON.parse(localStorage.getItem('horCloudLinkV1')||'null');if(!saved)return;user=(await api('session')).user;const current=(await api('current'))[0];if(saved.user===user.id&&saved.actor===core().read()?.identity.id&&saved.revision===current?.revision){revision=saved.revision;lastHash=saved.hash;linkedActor=saved.actor;linked=true}}catch{linked=false}}
 setTimeout(resume,3000);setInterval(async()=>{if(!linked||busy||!core()||document.hidden)return;try{if(core().read()?.identity.id!==linkedActor){linked=false;tell('This device’s career changed. Review Cloud Career before saving.');return}if(hash()===lastHash)return;busy=true;await save()}catch(e){tell(e.message)}finally{busy=false}},15000);
})();
