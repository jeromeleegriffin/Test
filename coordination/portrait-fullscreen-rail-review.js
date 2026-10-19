/* Opt-in test harness. Append ?railReview=1 in a development preview. */
(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('railReview') !== '1') return;
  const originalSource = Object.freeze({ width: 875, height: 1797, holderTop: 1330 });
  document.body.classList.add('hor-rail-review');
  let previousDy = 0;
  const measure = () => {
    if (!matchMedia('(orientation: portrait)').matches) {
      document.body.style.removeProperty('--hor-rail-review-dy');
      document.body.classList.remove('hor-rail-review');
      previousDy = 0;
      return;
    }
    document.body.classList.add('hor-rail-review');
    const bg = document.getElementById('hor-room-bg');
    const holder = document.querySelector('body.in-game .game-room > .hand-area');
    if (!bg || !holder) return;
    const bgBox = bg.getBoundingClientRect();
    const hBox = holder.getBoundingClientRect();
    if (!bgBox.height || !hBox.height) return;
    const cover = Math.max(bgBox.width / originalSource.width, bgBox.height / originalSource.height);
    // TABLE-003 original image coordinate, *not* a viewport percentage.
    // 1330 is a screenshot-derived REVIEW estimate, subject to actual-pixel approval.
    const desiredTop = bgBox.top + originalSource.holderTop * cover;
    const unshiftedTop = hBox.top - previousDy;
    const candidate = Math.min(0, Math.round(desiredTop - unshiftedTop));
    // The established Chrome layout must not be pushed down or redrawn.
    const dy = Math.max(-Math.floor(bgBox.height * 0.4), candidate);
    previousDy = dy;
    document.body.style.setProperty('--hor-rail-review-dy', dy + 'px');
    document.body.dataset.railReviewDelta = String(dy);
    document.body.dataset.railReviewCover = cover.toFixed(4);
  };
  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; measure(); });
  };
  addEventListener('resize', schedule);
  addEventListener('orientationchange', schedule);
  document.addEventListener('visibilitychange', schedule);
  document.addEventListener('click', schedule, true);
  document.addEventListener('DOMContentLoaded', schedule);
  schedule();
})();
