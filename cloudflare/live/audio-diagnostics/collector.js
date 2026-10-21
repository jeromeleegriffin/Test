/* Opt-in sound check. No cards, names, room IDs, credentials or device IDs. */
(() => {
  'use strict';
  const id = '__GHR_AUDIO_REPORT_ID__';
  if (!/^[a-f0-9]{32}$/.test(id)) return;
  const samples = [];
  let sequence = 0, lastSent = 0, sending = false, lastClock = null, lastAt = null;
  let test = { requested: false, heard: null };
  const panel = document.createElement('aside');
  panel.style.cssText = 'position:fixed;top:4px;left:50%;transform:translateX(-50%);z-index:2147483647;background:#18251f;color:#fff;border:1px solid #c9ad66;border-radius:8px;padding:7px;font:12px system-ui;max-width:95vw;text-align:center';
  panel.innerHTML = '<span>Sound check active</span> <button type="button" data-check="test">Test sound</button> <button type="button" data-check="yes" hidden>I hear it</button> <button type="button" data-check="no" hidden>No sound</button><small style="display:block">Only audio state and sound settings are reported.</small>';
  document.body.appendChild(panel);
  const label = panel.querySelector('span');
  const read = fn => { try { return fn(); } catch (_) { return null; } };
  function sample(reason) {
    const at = performance.now();
    const ctx = read(() => typeof audioCtx === 'undefined' ? null : audioCtx);
    const clock = ctx ? ctx.currentTime : null;
    const cabin = read(() => window.CabinAmbience041?.inspect());
    const mixer = window.HORAudioMixer;
    const voice = read(() => window.HORVoiceQueue?.inspect());
    const trump = read(() => window.HORTrumpVoice?.getState());
    const frame = {
      sequence: ++sequence, reason, elapsedMs: Math.round(at),
      build: read(() => window.HOR_BUILD), pageBuild: read(() => window.HOR_PAGE_BUILD),
      scriptBuild: read(() => window.HOR_SCRIPT_BUILD), hidden: document.hidden,
      inGame: document.body.classList.contains('in-game'),
      phase: read(() => typeof game === 'undefined' ? null : game?.phase),
      muted: read(() => typeof soundMuted === 'undefined' ? null : soundMuted),
      storedMuted: read(() => localStorage.getItem('rookMuted') === '1'),
      soundOptions: { cards: read(() => soundCard), turn: read(() => soundTurn), ticks: read(() => soundTick) },
      main: ctx ? { state: ctx.state, clock, sampleRate: ctx.sampleRate,
        clockDelta: lastClock === null ? null : +(clock - lastClock).toFixed(4),
        wallDeltaMs: lastAt === null ? null : Math.round(at - lastAt) } : null,
      mixer: mixer ? { master: mixer.level('master'), voices: mixer.level('voices'),
        gameplay: mixer.level('gameplay'), atmosphere: mixer.level('atmosphere'),
        character: mixer.level('character'), settings: mixer.settings() } : null,
      cabin: cabin ? { running: cabin.running, contextState: cabin.contextState,
        enabled: cabin.enabled, unlocked: cabin.unlocked, allowed: cabin.allowed,
        volume: cabin.volume, fireVolume: cabin.fireVolume, busGain: cabin.busGain,
        timers: cabin.timers, voices: cabin.voices } : null,
      voiceQueue: voice ? { active: !!voice.active, pending: voice.pending.length, starts: voice.log.filter(e => e.type === 'start').length } : null,
      trump: trump ? { playing: trump.playing, cacheSize: trump.cacheSize, loadFailures: trump.history.filter(e => e.type === 'load-failed').length } : null,
      assets: { cabin: !!window.HORCabinSamples,
        landingBuffers: read(() => typeof cardLandingBuffers058 === 'undefined' ? 0 : cardLandingBuffers058.length) },
      test: { ...test },
    };
    lastClock = clock; lastAt = at;
    samples.push(frame); if (samples.length > 12) samples.shift();
  }
  async function send(reason, force = false) {
    sample(reason);
    if (sending || (!force && Date.now() - lastSent < 10000)) return;
    sending = true; lastSent = Date.now();
    try {
      const response = await fetch('/audio-check/report', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, samples }), cache: 'no-store', keepalive: true,
      });
      label.textContent = response.ok ? 'Sound check received · play normally' : 'Sound check could not send';
    } catch (_) { label.textContent = 'Sound check waiting for connection'; }
    finally { sending = false; }
  }
  panel.querySelector('[data-check="test"]').onclick = async () => {
    test = { requested: true, heard: null };
    let ctx;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx(); await ctx.resume();
      test.state = ctx.state;
      const gain = ctx.createGain(); gain.gain.value = 0.08; gain.connect(ctx.destination);
      for (const [i, frequency] of [440, 660].entries()) {
        const oscillator = ctx.createOscillator(); oscillator.frequency.value = frequency;
        oscillator.connect(gain); oscillator.start(ctx.currentTime + i * 0.3);
        oscillator.stop(ctx.currentTime + i * 0.3 + 0.18);
      }
      setTimeout(() => { test.clock = ctx.currentTime; ctx.close().catch(() => {}); send('test-finished', true); }, 900);
    } catch (_) { test.error = 'test-unavailable'; }
    panel.querySelector('[data-check="yes"]').hidden = false;
    panel.querySelector('[data-check="no"]').hidden = false;
    send('test-requested', true);
  };
  for (const [name, heard] of [['yes', true], ['no', false]]) {
    panel.querySelector('[data-check="' + name + '"]').onclick = () => { test.heard = heard; send('test-answer', true); };
  }
  document.addEventListener('visibilitychange', () => send('visibility', true));
  document.addEventListener('pointerup', () => setTimeout(() => send('interaction'), 350), { passive: true });
  const timer = setInterval(() => send('heartbeat'), 10000);
  setTimeout(() => { clearInterval(timer); send('check-ended', true); }, 15 * 60 * 1000);
  send('opened', true);
})();
