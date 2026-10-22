import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = process.env.GHR_ENTRY_BASE;
assert(base);
const rows = [];
for (const path of ['/cloud-game/assets/', '/cloud-game/assets/index.html']) {
  const r = await fetch(base + path + '?room=ABCDEFGH&name=QA', { redirect: 'manual' });
  assert.equal(r.status, 302);
  assert.equal(r.headers.get('location'), base + '/?room=ABCDEFGH&name=QA');
  assert.equal((await r.text()).length, 0);
  rows.push({ path, status: r.status, redirectBeforeArtwork: true, inviteRetained: true });
}
const m = await (await fetch(base + '/cloud-game/assets/manifest.json')).json();
assert.equal(m.id, '/cloud-game/assets/');
assert.equal(m.start_url, '/');
assert.equal(m.scope, '/');
for (const icon of m.icons) {
  assert(icon.src.startsWith('/cloud-game/assets/assets/'));
  const r = await fetch(base + icon.src);
  assert.equal(r.status, 200);
  assert(r.headers.get('content-type').startsWith('image/'));
  await r.arrayBuffer();
}
const r = await fetch(new URL(m.start_url, base));
assert.equal(r.status, 200);
const html = await r.text();
assert(html.includes('window.HOR_CLOUD_TEST_ACTIVE = true'));
assert(html.includes('846-r12-moon-default-off-20261021'));
assert.equal((html.match(/id="houseLoading"/g) || []).length, 1);
const result = {
  base,
  rows,
  manifest: { id: m.id, start_url: m.start_url, scope: m.scope, icons: m.icons.length },
  installedStartIntegrated: true,
  nativePolicy: 'R12 retained',
};
console.log(JSON.stringify(result));
if (process.env.GHR_ENTRY_RESULT)
  fs.writeFileSync(process.env.GHR_ENTRY_RESULT, JSON.stringify(result, null, 2) + '\n');
