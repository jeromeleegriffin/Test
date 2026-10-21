function sanitizeAudioReport(body) {
  if (!body || !/^[a-f0-9]{32}$/.test(body.id || '') || !Array.isArray(body.samples)) return null;
  const n = (v, max = 1e9) => typeof v === 'number' && Number.isFinite(v) ? Math.max(-max, Math.min(max, v)) : null;
  const b = v => typeof v === 'boolean' ? v : null;
  const state = v => ['running', 'suspended', 'interrupted', 'closed', 'not-created'].includes(v) ? v : null;
  const build = v => typeof v === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(v) ? v : null;
  const level = v => typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : null;
  const levels = obj => Object.fromEntries(['master', 'voices', 'gameplay', 'atmosphere', 'character'].map(key => [key, level(obj?.[key])]));
  const samples = body.samples.slice(-12).map(s => ({
    sequence: n(s?.sequence), elapsedMs: n(s?.elapsedMs),
    reason: ['opened', 'heartbeat', 'interaction', 'visibility', 'test-requested', 'test-finished', 'test-answer', 'check-ended'].includes(s?.reason) ? s.reason : null,
    build: build(s?.build), pageBuild: build(s?.pageBuild), scriptBuild: build(s?.scriptBuild),
    hidden: b(s?.hidden), inGame: b(s?.inGame),
    phase: ['bidding','dealing','discard','trump','play','score','complete','redeal'].includes(s?.phase) ? s.phase : null,
    muted: b(s?.muted), storedMuted: b(s?.storedMuted),
    main: s?.main ? {state:state(s.main.state),clock:n(s.main.clock),clockDelta:n(s.main.clockDelta),wallDeltaMs:n(s.main.wallDeltaMs),sampleRate:n(s.main.sampleRate,384000)} : null,
    mixer: s?.mixer ? {...levels(s.mixer),settings:{...levels(s.mixer.settings),voicesMuted:b(s.mixer.settings?.voicesMuted)}} : null,
    cabin: s?.cabin ? {running:b(s.cabin.running),contextState:state(s.cabin.contextState),enabled:b(s.cabin.enabled),unlocked:b(s.cabin.unlocked),allowed:b(s.cabin.allowed),volume:n(s.cabin.volume,100),fireVolume:n(s.cabin.fireVolume,100),busGain:n(s.cabin.busGain,10),timers:n(s.cabin.timers,100),voices:Array.isArray(s.cabin.voices)?s.cabin.voices.slice(0,12).filter(v=>['fire','wind','bird','crickets','owl','wolf','rain'].includes(v?.name)).map(v=>({name:v.name,level:level(v.level)})):[]} : null,
    voiceQueue: s?.voiceQueue ? {active:b(s.voiceQueue.active),pending:n(s.voiceQueue.pending,100)} : null,
    assets: {cabin:b(s?.assets?.cabin),landingBuffers:n(s?.assets?.landingBuffers,20)},
    test: {requested:b(s?.test?.requested),heard:b(s?.test?.heard),state:state(s?.test?.state),clock:n(s?.test?.clock),error:s?.test?.error==='test-unavailable'?'test-unavailable':null},
  }));
  return {id:body.id,samples};
}

async function handleAudioReport(request, env) {
  const url = new URL(request.url);
  if (request.method !== 'POST') return json({error:'METHOD_NOT_ALLOWED'},405);
  if (request.headers.get('origin') !== url.origin) return json({error:'SAME_ORIGIN_REQUIRED'},403);
  if (!await verifyPrivateSession(cookieValue(request, PRIVATE_SESSION_COOKIE),env.TEST_GATE_KEY)) return json({error:'SESSION_REQUIRED'},401);
  const rate = env.ACTION_LIMIT;
  if (!rate) return json({error:'SERVER_CONFIGURATION_REQUIRED'},503);
  if (!(await rate.limit({key:(request.headers.get('CF-Connecting-IP')||'unknown')+':audio-check'})).success) return json({error:'TOO_MANY_REQUESTS'},429);
  const text = await request.text();
  if (text.length > 32768) return json({error:'REPORT_TOO_LARGE'},413);
  let report;
  try { report=sanitizeAudioReport(JSON.parse(text)); } catch (_) {}
  if (!report) return json({error:'INVALID_REPORT'},400);
  return env.ROOMS.getByName('__ghr_audio_diagnostics_v1').fetch('https://room.local/audio-report',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(report)});
}

function injectAudioDiagnostics(html, url) {
  const id=url.searchParams.get('audioCheck');
  if (!/^[a-f0-9]{32}$/.test(id||'')) return html;
  const source=AUDIO_DIAGNOSTIC_COLLECTOR.replace('__GHR_AUDIO_REPORT_ID__',id);
  return html.replace(/<\/body>/i,'<script>'+source+'<\/script></body>');
}
