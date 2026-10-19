// Exercise the actual trump module with simulated image/CDN outcomes.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM } = require(process.env.JSDOM_PATH || 'jsdom');
async function scenario(mode) {
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://example.test/review/', runScripts: 'outside-only', pretendToBeVisual: true,
  });
  const w = dom.window, requests = [], errors = [];
  w.matchMedia = () => ({ matches: true, addEventListener() {} });
  w.HORAssetLoading772 = { image: async () => ({}) };
  w.ImageData = class { constructor(data, width, height) { Object.assign(this, { data, width, height }); } };
  w.HTMLCanvasElement.prototype.getContext = function () {
    return {
      drawImage() {}, putImageData() {},
      getImageData(x, y, width, height) {
        if (mode === 'tainted') throw new w.DOMException('CDN denied canvas read', 'SecurityError');
        return { data: new Uint8ClampedArray(width * height * 4) };
      },
    };
  };
  w.Image = class {
    set src(value) {
      requests.push({ src: value, crossOrigin: this.crossOrigin });
      queueMicrotask(() => {
        if (mode === 'denied' && this.crossOrigin) this.onerror?.();
        else this.onload?.();
      });
    }
  };
  w.addEventListener('error', e => errors.push(String(e.error)));
  w.eval(fs.readFileSync('trump714.js', 'utf8'));
  await new Promise(resolve => setImmediate(resolve));
  const state = w.HORTrump714.inspect();
  for (const path of ['assets/trump714/stamp.png', 'assets/table003/room-table-perspective.png']) {
    const request = requests.find(x => x.src === path);
    assert(request, path); assert.equal(request.crossOrigin, 'anonymous', path);
  }
  assert.equal(errors.length, 0);
  assert.equal(state.ready, mode === 'success');
  assert.equal(state.maskReady, mode === 'success');
  if (mode !== 'success') {
    assert(state.trace.some(x => x.event === 'asset-error'));
    assert(state.trace.some(x => x.event === 'mask-error'));
  }
  dom.window.close();
  return { mode, status: 'PASS', canvasReady: state.maskReady, materialsReady: state.ready, uncaughtErrors: errors.length };
}
(async () => {
  const results = [];
  for (const mode of ['success', 'denied', 'tainted']) results.push(await scenario(mode));
  console.log(JSON.stringify(results, null, 2));
  fs.writeFileSync('coordination/candidates/beginner-audit-20261019/CANVAS_RESULTS.json', JSON.stringify({ environment: 'JSDOM simulation; browser verification recorded separately', results }, null, 2) + '\n');
})().catch(error => { console.error(error); process.exitCode = 1; });
