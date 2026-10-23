const CAREER_URL='https://gxojarpfaxloyzbsptqg.supabase.co';
const CAREER_KEY='sb_publishable_pwVFgPlgLGPWtXWARaH6KQ_5dkNv4fv';
const CA='__Host-ghr-career-access', CR='__Host-ghr-career-refresh';
async function careerApi(request,env){
 const url=new URL(request.url), route=url.pathname.slice('/career-api/'.length), headers=new Headers({'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff'});
 const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
 const cookie=(name)=>{const part=(request.headers.get('cookie')||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(name+'='));return part?part.slice(name.length+1):''};
 const set=(name,value,age)=>headers.append('set-cookie',`${name}=${value}; Path=/; Max-Age=${age}; HttpOnly; Secure; SameSite=Strict`);
 const clear=()=>{set(CA,'',0);set(CR,'',0)};
 const upstream=async(path,method='GET',body,token)=>{
  const r=await fetch(CAREER_URL+path,{method,headers:{apikey:CAREER_KEY,...(token?{Authorization:'Bearer '+token}:{}),...(body?{'content-type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(12000)});
  const data=await r.json().catch(()=>({}));return {ok:r.ok,status:r.status,data};
 };
 try{
  if(!['GET','POST'].includes(request.method))return reply({error:'Method not allowed'},405);
  if(request.method==='POST'&&(request.headers.get('origin')!==url.origin||!request.headers.get('content-type')?.startsWith('application/json')))return reply({error:'Open Cloud Career from this game to continue.'},403);
  const emailRoutes=['signup','recover','resend-confirmation','confirm-email','reset-password'];
  if(route==='config'&&request.method==='GET')return reply({emailReady:env.CAREER_EMAIL_READY==='true'});
  if(emailRoutes.includes(route)&&env.CAREER_EMAIL_READY!=='true')return reply({error:'Email signup and password recovery are still being set up. Your career stays on this device.'},503);
  const bucket=route==='login'||emailRoutes.includes(route)?env.ENTRY_LIMIT:env.ACTION_LIMIT;
  if(!bucket||!(await bucket.limit({key:'career:'+route+':'+(request.headers.get('CF-Connecting-IP')||'unknown')})).success)return reply({error:'Please wait a minute and try again.'},429);
  let body={};if(request.method==='POST'){
   if(Number(request.headers.get('content-length')||0)>2200000)return reply({error:'Backup too large'},413);
   const reader=request.body?.getReader();let size=0,parts=[];if(reader){while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>2200000){await reader.cancel();return reply({error:'Backup too large'},413)}parts.push(value)}}
   const bytes=new Uint8Array(size);let at=0;for(const p of parts){bytes.set(p,at);at+=p.length}try{body=JSON.parse(new TextDecoder().decode(bytes))}catch{return reply({error:'Invalid request'},400)}
  }
  const saveSession=(s)=>{set(CA,s.access_token,Math.min(s.expires_in||3600,3600));set(CR,s.refresh_token,2592000)};
  if(emailRoutes.includes(route)&&request.method==='POST'){
   const email=typeof body.email==='string'?body.email.trim():'';
   if(email.length>254||!/^\S+@\S+\.\S+$/.test(email))return reply({error:'Enter a valid email address.'},400);
   const needsPassword=route==='signup'||route==='reset-password';
   if(needsPassword&&(typeof body.password!=='string'||body.password.length<12||body.password.length>128))return reply({error:'Use a password between 12 and 128 characters.'},400);
   if(route==='signup'||route==='recover'||route==='resend-confirmation'){
    const r=await upstream(route==='signup'?'/auth/v1/signup':route==='recover'?'/auth/v1/recover':'/auth/v1/resend','POST',route==='signup'?{email,password:body.password}:route==='resend-confirmation'?{email,type:'signup'}:{email});
    // Never turn an accidentally disabled email-confirmation setting into a login.
    if(r.ok&&r.data.access_token){await upstream('/auth/v1/logout?scope=local','POST',{},r.data.access_token).catch(()=>{});return reply({error:'Account confirmation needs attention. Please try again later.'},503)}
    if(!r.ok&&(r.status===429||r.status>=500))return reply({error:'Email is temporarily unavailable. Please wait a few minutes and try again.'},r.status===429?429:503);
    // Identical response for existing/unknown accounts; no account enumeration.
    return reply({ok:true,message:route==='recover'?'If an account exists for this email, a recovery code will arrive shortly.':'If this email needs confirmation, a code will arrive shortly. Already registered? Sign in or use Forgot password.'});
   }
   if(typeof body.code!=='string'||!/^\d{6,10}$/.test(body.code))return reply({error:'Enter the code from your email.'},400);
   const verified=await upstream('/auth/v1/verify','POST',{email,token:body.code,type:route==='reset-password'?'recovery':'email'});
   if(!verified.ok||!verified.data.access_token)return reply({error:'That code is invalid or expired. Request a new code and try again.'},400);
   const session=verified.data;
   if(route==='reset-password'){
    const changed=await upstream('/auth/v1/user','PUT',{password:body.password},session.access_token);
    await upstream('/auth/v1/logout?scope=global','POST',{},session.access_token).catch(()=>{});
    clear();
    if(!changed.ok)return reply({error:'Password could not be changed. Request a new recovery code and try a different password.'},400);
    return reply({ok:true,message:'Password changed. Sign in with your new password. Your saved career is unchanged.'});
   }
   await upstream('/auth/v1/logout?scope=local','POST',{},session.access_token).catch(()=>{});
   return reply({ok:true,message:'Email confirmed. Sign in to choose which career to back up.'});
  }
  if(route==='login'&&request.method==='POST'){
   if(typeof body.email!=='string'||typeof body.password!=='string'||body.email.length>254||body.password.length>1024)return reply({error:'Enter your email and password.'},400);
   const r=await upstream('/auth/v1/token?grant_type=password','POST',{email:body.email,password:body.password});
   if(!r.ok)return reply({error:'Could not sign in. Check your email, password, and account confirmation.'},401);
   saveSession(r.data);return reply({user:{id:r.data.user.id,email:r.data.user.email}});
  }
  let token=cookie(CA);const refresh=cookie(CR);
  if(route==='logout'&&request.method==='POST'){if(token)await upstream('/auth/v1/logout?scope=local','POST',{},token).catch(()=>{});clear();return reply({ok:true})}
  let auth=token?await upstream('/auth/v1/user','GET',undefined,token):null;
  if((!auth||auth.status===401)&&refresh){const r=await upstream('/auth/v1/token?grant_type=refresh_token','POST',{refresh_token:refresh});if(r.ok){saveSession(r.data);token=r.data.access_token;auth={ok:true,data:r.data.user}}else auth=r;}
  if(!auth?.ok){if(!auth||auth.status===401)clear();return reply({error:'Sign in to use your cloud career.'},auth?.status>=500?503:401)}
  if(!auth.data.email_confirmed_at||auth.data.is_anonymous)return reply({error:'A confirmed player account is required.'},403);
  if(route==='session'&&request.method==='GET')return reply({user:{id:auth.data.id,email:auth.data.email}});
  if(route==='save'&&body.userId!==auth.data.id)return reply({error:'The signed-in account changed. Reopen Cloud Career before saving.'},409);
  let r;
  if(route==='save'&&request.method==='POST')r=await upstream('/rest/v1/rpc/rooks_save_career','POST',{p_payload:body.payload,p_expected_revision:body.revision,p_restore_revision:null},token);
  else if(route==='current'&&request.method==='GET')r=await upstream('/rest/v1/rooks_careers?select=revision,display_name,payload,updated_at','GET',undefined,token);
  else if(route==='versions'&&request.method==='GET')r=await upstream('/rest/v1/rooks_career_versions?select=revision,display_name,created_at,reason&order=revision.desc&limit=100','GET',undefined,token);
  else if(/^version\/[1-9]\d{0,14}$/.test(route)&&request.method==='GET')r=await upstream('/rest/v1/rooks_career_versions?select=revision,payload&revision=eq.'+route.split('/')[1],'GET',undefined,token);
  else return reply({error:'Not found'},404);
  if(!r.ok)return reply({error:r.data.code==='40001'?'Another device saved newer progress. Reopen Cloud Career to review it.':'Cloud save could not be completed. Your local career is unchanged.'},r.data.code==='40001'?409:400);
  return reply(r.data);
 }catch{return reply({error:'Cloud connection unavailable. Your local career is safe; please try again.'},503)}
}
