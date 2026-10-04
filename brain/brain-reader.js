/* Read-only Project Brain. No storage, authentication, or repository writes. */
window.Brain = (() => {
  'use strict';
  const base = new URL('./', document.currentScript.src);
  const el = id => document.getElementById(id);
  async function json(path) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(new URL(path, base), {cache:'no-store', credentials:'omit', signal:controller.signal});
      if (!response.ok) throw Error('HTTP ' + response.status);
      return await response.json();
    } finally { clearTimeout(timer); }
  }
  function path(value) {
    if (typeof value !== 'string' || !value || /[?#\\]/.test(value)) throw Error('Invalid Brain path');
    const url = new URL(value, base);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) throw Error('Brain path outside its published area');
    if (/%(?:2f|5c|2e|25)/i.test(url.pathname)) throw Error('Invalid encoded Brain path');
    return url.href;
  }
  async function current() {
    const m = await json('current.json');
    if (!m || m.project !== 'Griffin House of Rooks' || typeof m.brainVersion !== 'string' || !/^[A-Za-z0-9_-]+$/.test(m.brainVersion) || m.status !== 'CURRENT' || typeof m.updated !== 'string' || !/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(m.updated) || !/^[a-f0-9]{64}$/i.test(m.sha256 || '')) throw Error('Invalid current Brain manifest');
    const browse = path(m.browse), artifact = path(m.artifact);
    if (m.browse !== 'versions/' + m.brainVersion + '/index.html' || !m.artifact.startsWith('artifacts/') || !m.artifact.endsWith('.zip')) throw Error('Manifest version/path mismatch');
    return {...m, browse, artifact, history:path(m.history)};
  }
  function failure(error) {
    const s = el('brainStatus');
    if (s) s.textContent = 'CURRENT BRAIN UNAVAILABLE — could not verify the current pointer. Retry when connected. ' + (error.name === 'AbortError' ? 'Request timed out.' : error.message);
  }
  async function player() {
    const actions = el('brainActions'), retry = el('brainRetry');
    actions.hidden = true; actions.style.display = 'none'; retry.hidden = true;
    ['brainOpen','brainHistory','brainBackup'].forEach(id => el(id).removeAttribute('href'));
    el('brainStatus').textContent = 'Checking current Brain…';
    try {
      const m = await current();
      el('brainStatus').textContent = 'MASTER BANK ' + m.brainVersion + '\nCURRENT\nLast updated: ' + m.updated;
      el('brainOpen').href = m.browse; el('brainHistory').href = m.history; el('brainBackup').href = m.artifact;
      actions.hidden = false; actions.style.display = 'block';
    } catch (e) { failure(e); retry.hidden = false; }
    retry.onclick = player;
  }
  async function status(version) {
    try {
      const m = await current();
      el('brainStatus').textContent = m.brainVersion === version ? 'MASTER BANK ' + version + ' — CURRENT · Updated ' + m.updated : 'MASTER BANK ' + version + ' — HISTORICAL / SUPERSEDED · Current Brain: ' + m.brainVersion;
    } catch (e) { failure(e); }
  }
  async function openCurrent() { try { location.replace((await current()).browse); } catch(e) { failure(e); } }
  async function history() {
    const host = el('history'); host.replaceChildren();
    try {
      const m = await current(), h = await json('versions.json');
      if (!h || !Array.isArray(h.versions)) throw Error('Invalid history index');
      if (!h.versions.some(v => v.brainVersion === m.brainVersion && path(v.browse) === m.browse && v.sha256 === m.sha256)) throw Error('Current version missing or mismatched in history');
      const entries = h.versions.map(v => {
        if (!v || typeof v.brainVersion !== 'string' || !/^[A-Za-z0-9_-]+$/.test(v.brainVersion) || v.browse !== 'versions/' + v.brainVersion + '/index.html') throw Error('Invalid historical version');
        return {...v, browse:path(v.browse)};
      });
      el('brainStatus').textContent = 'Current Brain: MASTER BANK ' + m.brainVersion;
      for (const v of entries) {
        const p = document.createElement('p'), a = document.createElement('a');
        a.href = v.browse; a.textContent = 'MASTER BANK ' + v.brainVersion + ' — ' + (v.brainVersion === m.brainVersion ? 'CURRENT' : 'HISTORICAL / SUPERSEDED') + ' · ' + v.updated;
        p.append(a); host.append(p);
      }
      if (Array.isArray(h.unavailablePreviousVersions) && h.unavailablePreviousVersions.length) {
        const p = document.createElement('p');
        p.textContent = 'Earlier checkpoints ' + h.unavailablePreviousVersions.join(', ') + ' are recorded in C’s changelog. Their frozen packages are not included here.'; host.append(p);
      }
    } catch(e) { host.replaceChildren(); failure(e); }
  }
  return {player,status,openCurrent,history};
})();
