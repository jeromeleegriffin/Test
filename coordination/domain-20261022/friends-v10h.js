/* Owner reference 71148.jpg without chairs: use the actual room art and existing authoritative seat operations. */
(() => {
  'use strict';
  const root = document.getElementById('waiting');
  if (!root) return;
  const scene = document.getElementById('friendsScene803');
  const setup = document.createElement('section');
  setup.hidden = true;
  setup.className = 'gh-menu-section';
  setup.id = 'friendsSetup803';
  setup.innerHTML = '<div class="gh-menu-section-title">Table setup</div>';
  for (const node of [root.querySelector('.team-name-row'), root.querySelector('.bot-count-row')])
    if (node) setup.append(node);
  document.getElementById('hostOptionsModal').append(setup);
  const previewBotAvatars={ "Crow": "crow", "Blaze": "blaze", "Nix": "nix", "Titan": "titan", "Pike": "pike", "Drift": "drift", "Dice": "dice", "Anchor": "anchor", "Wager": "wager", "Hollow": "hollow", "Ember": "ember", "Vex": "vex", "Frost": "frost", "Fang": "fang", "Halo": "halo", "Quill": "quill", "Bramble": "bramble", "Moss": "moss", "Emberlyn": "emberlyn", "Cinder": "cinder", "Gable": "gable", "Thistle": "thistle", "Marrow": "marrow", "Pebble": "pebble", "Rookery": "rookery", "Sable": "sable", "Finch": "finch", "Dagger": "dagger", "Willow": "willow", "Hearth": "hearth", "Grit": "grit", "Copper": "copper", "Moth": "moth", "Brandy": "brandy", "Flint": "flint", "Ivy": "ivy", "Shade": "shade", "Barrel": "barrel", "Spark": "spark", "Nettle": "nettle", "Cobalt": "cobalt", "Ash": "ash", "Harrier": "harrier", "Claire": "claire", "June": "june", "Tess": "tess", "Marcus": "marcus", "Owen": "owen", "Daniel": "daniel", "Sofia": "sofia", "Rafael": "rafael", "Samir": "samir", "Jerome": "jerome_founder", "Rita": "rita" };
  let svg,
    renderKey = '';
  function refresh() {
    setup.hidden = !isHost || root.classList.contains('hidden');
    if (root.classList.contains('hidden')) return;
    const studio = window.HORCharacterStudio077,
      original = document.querySelector('#characters077 svg');
    if (!studio || !original) return;
    if (!svg) {
      svg = original.cloneNode(true);
      svg.removeAttribute('style');
      svg.setAttribute('aria-hidden', 'true');
      svg.querySelectorAll('[id]').forEach((e) => (e.id = 'friends-' + e.id));
      svg
        .querySelectorAll('[clip-path]')
        .forEach((e) =>
          e.setAttribute(
            'clip-path',
            e.getAttribute('clip-path').replace('#cs077', '#friends-cs077')
          )
        );
      scene.append(svg);
    }
    const preview = window.GHR_INVITE_PREVIEW_SEATS;
    const roster = preview ? preview.filter(p=>p.occupied).map(p=>({
      id:'preview-'+p.seat,seat:Number(p.seat),name:p.name,isBot:p.isBot,isHost:Number(p.seat)===0,
      avatar:p.avatar || (p.isBot ? previewBotAvatars[p.name] : null)
    })) : players.map(p=>window.HOR_CLOUD_TEST_ACTIVE && p.seat===0 && p.id!==myPeerId && /^you$/i.test(p.name||'') ? {...p,name:'Host'} : p);
    const me = players.find((p) => p && p.id === myPeerId),
      base = window.HOR_CLOUD_TEST_ACTIVE ? 0 : (me && me.seat >= 0 ? me.seat : 0);
    const key = JSON.stringify([
      base,
      isHost,
      roomCode,
      matchMedia('(orientation: landscape)').matches,
      roster.map((p) => [p.id, p.name, p.seat, p.avatar, p.careerPublic]),
    ]);
    if (key === renderKey) return;
    renderKey = key;
    root.dataset.cloudGuest=String(!!window.HOR_CLOUD_TEST_ACTIVE && !isHost);
    const specs = studio.inspect().seats;
    for (let off = 0; off < 4; off++) {
      const seat = (base + off) % 4,
        p = roster.find(p=>p.seat===seat),
        button = document.getElementById('waitSeat' + seat),
        position = ['me', 'left', 'top', 'right'][off];
      button.dataset.position = position;
      button.toggleAttribute('data-host-placeholder',seat===0 && p?.name==='Host' && p.id!==myPeerId);
      button.classList.toggle('friends-empty', !p);
      button.classList.toggle('friends-person', !!p);
      if (!p) {
        button.innerHTML =
          (off === 2 ? '<span class="friends-seat-role804">Partner</span>' : '') +
          '<span class="friends-seat-choice804">+ ' +
          (isHost ? 'Choose bot' : 'Sit here') +
          '</span><small>Open for a friend</small>';
        button.setAttribute(
          'aria-label',
          (off === 2 ? 'Partner' : 'Open') +
            ' seat. ' +
            (isHost ? 'Choose a bot' : 'Join this seat')
        );
      } else {
        button.innerHTML =
          '<strong>' +
          escapeHtmlSafe(p.name) +
          horCareerBadgeHtml(p) +
          '</strong><small>' +
          (p.id === myPeerId
            ? 'You' + (p.isHost ? ' · Host' : '')
            : p.isBot
              ? matchMedia('(orientation: landscape)').matches
                ? 'Bot · view career'
                : isHost
                  ? 'Remove bot'
                  : 'Bot'
              : p.isHost
                ? 'Host'
                : 'Friend') +
          '</small>';
        button.setAttribute(
          'aria-label',
          p.name +
            (p.isBot
              ? matchMedia('(orientation: landscape)').matches
                ? ', view career'
                : isHost
                  ? ', remove bot'
                  : ', seated bot'
              : ', seated')
        );
      }
      if(preview && p) button.setAttribute('aria-label', p.isBot && button.dataset.previewJoinable==='true' ? 'Take '+p.name+'’s seat' : p.name+', seated'+(p.isBot?' bot':''));
      button.onclick = (e) => {
        if (p && p.id === myPeerId) {
          e.preventDefault();
          e.stopPropagation();
          horShowCareerForPlayer(p);
        } else onWaitSeatClick(seat);
      };
      if (p && p.id === myPeerId) button.setAttribute('aria-label', p.name + ', view stat card');
      if (!off) continue;
      const spec = specs[off - 1],
        body = svg.querySelector('[data-seat="' + spec.pose + '"]'),
        fg = svg.querySelector('[data-foreground="' + spec.pose + '"]'),
        avatar = p && ((typeof playerAvatars !== 'undefined' && playerAvatars[p.id]) || p.avatar),
        c = studio.characters[avatar];
      body.style.display = p ? '' : 'none';
      fg.style.display = 'none';
      if (!p) {
        body.removeAttribute('href');
        continue;
      }
      const special = avatar === 'cobalt' && spec.pose === 'top',
        g = special ? { x: 272.5, y: 295, w: 330 } : spec;
      for (const [k, v] of Object.entries({ x: g.x, y: g.y, width: g.w, height: g.w * 1.5 }))
        body.setAttribute(k, v);
      body.setAttribute(
        'clip-path',
        'url(#friends-cs077-' +
          (special ? 'cobalt-top' : spec.pose === 'top' ? 'far-outside' : 'outside') +
          ')'
      );
      const bodyPath = c ? 'assets/characters077/' + c.poses[spec.pose] : avatarSrc(avatar),
        armPath = c?.foreground?.[spec.pose]
          ? 'assets/characters077/' + c.foreground[spec.pose]
          : null;
      if(body.getAttribute('href')!==bodyPath) body.removeAttribute('href');
      if(fg.getAttribute('href')!==armPath) fg.removeAttribute('href');
      window.HORAssetLoading772.requireImages([bodyPath, armPath].filter(Boolean))
        .then(() => {
          if (renderKey !== key || !body.isConnected) return;
          body.setAttribute('href', bodyPath);
          if (armPath) {
            fg.setAttribute('href', armPath);
            fg.style.display = '';
          }
        })
        .catch(() => {});
    }
    horBindCareerBadges(root);
    document.getElementById('friendsHeading803').textContent =
      seatedCount() === 4 ? 'Your table is ready' : 'Waiting for friends';
    document.getElementById('friendsSeatHint803').textContent =
      seatedCount() === 4
        ? isHost
          ? 'Ready when you are'
          : 'Waiting for the host to start'
        : isHost
          ? 'Tap an open seat to choose a bot'
          : 'Tap an open seat to move before the host starts.';
    document.getElementById('waitingStatus').textContent = seatedCount() + ' of 4 seated';
    document
      .getElementById('fillSeatsBtn')
      .classList.toggle('hidden', !isHost || seatedCount() === 4);
    document.getElementById('displayCode').textContent = roomCode;
    document.getElementById('shareBtn').textContent = 'Invite';
    document.getElementById('showQrBtn').textContent = 'QR';
    // Practice has no joinable room, including after a completed solo match.
    const offline = isSoloPractice || roomCode === 'OFFLINE';
    for (const id of ['shareBtn', 'showQrBtn', 'copyCodeBtn']) {
      const button = document.getElementById(id);
      button.disabled = offline;
      button.toggleAttribute('data-offline-invitation', offline);
    }
    document.getElementById('fillSeatsBtn').textContent = 'Fill seats';
    const copy = document.getElementById('copyCodeBtn');
    copy.classList.remove('hidden');
    copy.removeAttribute('aria-hidden');
    copy.tabIndex = 0;
    copy.textContent = '';
    const title = document.getElementById('friendsTableOptions804');
    title.tabIndex = isHost ? 0 : -1;
    title.setAttribute('role', isHost ? 'button' : 'text');
    title.onclick = () => {
      if (isHost) openHostOptionsModal();
    };
    title.onkeydown = (e) => {
      if (isHost && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        openHostOptionsModal();
      }
    };
  }
  document.addEventListener('hor-artwork-retry', () => {
    renderKey = '';
    refresh();
  });
  window.HORFriends803 = {
    refresh: () => {
      renderKey = '';
      refresh();
    },
  };
  new MutationObserver(() => {
    renderKey = '';
    refresh();
  }).observe(root, { attributes: true, attributeFilter: ['class'] });
  addEventListener('resize', refresh);
  refresh();
})();
