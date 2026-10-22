/* Portable cumulative release: online rooms run on Cloudflare, never this phone. */
(() => {
  const online = 'https://rooks.jeromegriffin.com/';
  const field = document.getElementById('hor-room-code');
  if (field) field.maxLength = 8;
  window.addEventListener(
    'click',
    (event) => {
      if (window.HOR_CLOUD_TEST_ACTIVE) return;
      const button = event.target.closest?.(
        '#friendsToggleBtn,#createBtn,#joinConfirmBtn,#rejoinBtn,#reconnectBtn'
      );
      if (!button) return;
      event.stopImmediatePropagation();
      const url = new URL(online);
      const code = (field?.value || '').replace(/[\s-]/g, '').toUpperCase();
      const intent = new URLSearchParams();
      if (
        button.id === 'joinConfirmBtn' &&
        !/^(?:[A-Z]{3}[0-9]{2,4}|[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8})$/.test(code)
      ) {
        event.preventDefault();
        const feedback = document.getElementById('joinFeedback841');
        if (feedback) {
          feedback.hidden = false;
          feedback.textContent = 'Enter the table code, such as JER42.';
        }
        return;
      }
      if (
        button.id === 'joinConfirmBtn' &&
        /^(?:[A-Z]{3}[0-9]{2,4}|[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8})$/.test(code)
      ) {
        url.searchParams.set('room', code); // Current deployed Worker invite compatibility.
        intent.set('room', code);
        const name = (document.getElementById('hor-player-name')?.value || '').trim().slice(0, 12);
        if (name) intent.set('name', name);
      } else if (button.id === 'friendsToggleBtn' || button.id === 'createBtn') {
        const name = (document.getElementById('hor-player-name')?.value || '').trim().slice(0, 12);
        intent.set('create', '1');
        if (name) intent.set('name', name);
      }
      if (intent.size) url.hash = intent.toString();
      // Keep the browser's native submit action and its trusted user activation.
      // A form-associated button survives the existing lobby DOM rearrangement.
      if (button.form?.id === 'hor-online-navigation') {
        const legacyRoom = document.getElementById('hor-online-room');
        if (legacyRoom) {
          legacyRoom.disabled = button.id !== 'joinConfirmBtn';
          legacyRoom.value = legacyRoom.disabled ? '' : code;
        }
        button.form.action = url.href;
        return;
      }
      event.preventDefault();
      // Leave preview iframes: the Worker correctly denies being framed.
      // In a standalone PWA this stays in the same app window; in a preview it
      // navigates the top-level browser instead of replacing the embedded game.
      try {
        const topWindow = window.top || window;
        topWindow.location.href = url.href;
      } catch (_) {
        try {
          window.open(url.href, '_blank', 'noopener');
        } catch (openError) {
          const status = document.getElementById('lobbyStatus');
          if (status)
            status.textContent =
              'This preview blocks online rooms. Open the game in a browser tab to play with friends.';
        }
      }
    },
    true
  );
})();



/* Branded House of Rooks invitation flow v5. Isolated from legacy workers.dev. */
(() => {
  if (location.hostname !== 'rooks.jeromegriffin.com') return;
  const roomPattern = /^(?:[A-Z]{3}[0-9]{2,4}|[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8})$/;
  function currentRoomCode() {
    const candidates = [
      document.getElementById('displayCode')?.textContent,
      document.getElementById('welcomeCode')?.textContent,
      typeof roomCode !== 'undefined' ? roomCode : ''
    ];
    for (const value of candidates) {
      const code = String(value || '').trim().replace(/[\s-]/g, '').toUpperCase();
      if (roomPattern.test(code)) return code;
    }
    return '';
  }
  function setStatus(s) {
    const label = document.getElementById('waitingStatus');
    if (label) label.textContent = s;
  }
  async function copyLink(link) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
        setStatus('Invitation link copied.');
        return true;
      }
    } catch (_) {}
    const field = document.createElement('textarea');
    field.value = link;
    field.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(field);
    field.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) {}
    field.remove();
    setStatus(ok ? 'Invitation link copied.' : 'Copy this link: ' + link);
    return ok;
  }
  function openInviteMenu(code, link) {
    document.getElementById('hor-share-modal')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'hor-share-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.72);';
    overlay.innerHTML = '<section role="dialog" aria-modal="true" aria-label="Share House of Rooks table" style="width:min(100%,360px);max-height:calc(100dvh - 32px);overflow:auto;padding:22px;border:1px solid #c6a367;border-radius:15px;background:#142337;color:#fff0d6;box-shadow:0 20px 55px #000b;text-align:center;font:16px system-ui,sans-serif;">'
      + '<div style="font:26px Georgia,serif;color:#edcf90;margin-bottom:8px;">Invite Friends</div>'
      + '<p style="margin:0 0 14px;color:#e8dbbd;">House of Rooks · Table <strong>' + code + '</strong></p>'
      + '<a id="hor-facebook-invite" target="_blank" rel="noopener noreferrer" style="display:block;text-decoration:none;background:#d6b16f;color:#171924;font-weight:800;padding:13px 12px;border-radius:9px;margin:9px 0;" href="#">Share on Facebook</a>'
      + '<button id="hor-more-invite" type="button" style="display:block;width:100%;background:#253b55;color:#f6e8c6;border:1px solid #8d7957;border-radius:9px;padding:12px;margin:9px 0;font:600 16px system-ui;">Other Apps / Messages</button>'
      + '<button id="hor-copy-invite" type="button" style="display:block;width:100%;background:#253b55;color:#f6e8c6;border:1px solid #8d7957;border-radius:9px;padding:12px;margin:9px 0;font:600 16px system-ui;">Copy Invitation Link</button>'
      + '<button id="hor-close-invite" type="button" style="display:block;width:100%;background:transparent;color:#c3c9d0;border:0;padding:9px;margin-top:9px;font:500 14px system-ui;">Cancel</button>'
      + '</section>';
    document.body.appendChild(overlay);
    const dismiss = () => { overlay.remove(); document.removeEventListener('keydown', onKey, true); };
    const onKey = e => { if (e.key === 'Escape') dismiss(); };
    document.addEventListener('keydown', onKey, true);
    overlay.addEventListener('click', e => { if (e.target === overlay) dismiss(); });
    const fb = overlay.querySelector('#hor-facebook-invite');
    fb.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(link);
    fb.addEventListener('click', () => setTimeout(dismiss, 150));
    overlay.querySelector('#hor-close-invite').addEventListener('click', dismiss);
    overlay.querySelector('#hor-copy-invite').addEventListener('click', () => {
      copyLink(link);
      dismiss();
    });
    overlay.querySelector('#hor-more-invite').addEventListener('click', () => {
      dismiss();
      if (typeof navigator.share === 'function') {
        navigator.share({
          title: 'Griffin House of Rooks',
          text: 'Sit at my House of Rooks table. Code: ' + code,
          url: link
        }).catch(err => {
          if (err?.name !== 'AbortError') copyLink(link);
        });
      } else {
        copyLink(link);
      }
    });
    overlay.querySelector('#hor-facebook-invite').focus();
  }
  document.addEventListener('click', event => {
    const button = event.target.closest?.('#shareBtn,#copyCodeBtn');
    if (!button || button.disabled) return;
    const code = currentRoomCode();
    if (!code) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const link = 'https://jeromegriffin.com/r/' + encodeURIComponent(code);
    if (button.id === 'copyCodeBtn') copyLink(link);
    else openInviteMenu(code, link);
  }, true);
})();


/* Brand-only invitation consent gate, before the embedded Cloudflare adapter executes.
   Reusing a saved nickname does not count as consent to reserve a seat. */
(() => {
  if (location.hostname !== 'rooks.jeromegriffin.com') return;
  const invitation = String(window.GHR_CLOUD_INVITE || '').trim().toUpperCase();
  if (!/^(?:[A-Z]{3}[0-9]{2,4}|[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8})$/.test(invitation)) return;
  const name = document.getElementById('hor-player-name');
  if (!name) return;
  window.GHR_CLOUD_NAME = ''; // An invite URL cannot auto-confirm the guest's name.
  const previous = name.value.trim();
  name.removeAttribute('data-invite-suggested-name');
  // The deployed Cloudflare adapter automatically calls joinByCode() if this
  // value is already populated. Require the guest to explicitly confirm first.
  name.value = '';
  // The normal returning-player screen hides identity controls. Invited guests must confirm both.
  document.getElementById('lobby')?.classList.remove('landing-returning');
  name.placeholder = 'Enter your player name';
})();


/* Branded invitation input repair v7: keep the real name control within the active form. */
(() => {
  if (location.hostname !== 'rooks.jeromegriffin.com') return;
  const code = String(window.GHR_CLOUD_INVITE || '').trim().toUpperCase();
  if (!/^(?:[A-Z]{3}[0-9]{2,4}|[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8})$/.test(code)) return;
  const lobby = document.getElementById('lobby');
  const panel = document.getElementById('landingPanel783');
  const join = document.getElementById('joinForm');
  const name = document.getElementById('hor-player-name');
  const room = document.getElementById('hor-room-code');
  const label = panel?.querySelector('label[for="hor-player-name"]');
  const identity = panel?.querySelector('.identity-choice');
  if (!lobby || !panel || !join || !name || !room || !label || !identity) return;
  const nodes = [label, name, identity];
  const markers = nodes.map(node => {
    const marker = document.createComment('original-identity-slot');
    node.parentNode.insertBefore(marker, node);
    return marker;
  });
  const group = document.createElement('section');
  group.id = 'ghInviteIdentityV7';
  group.setAttribute('aria-label', 'Your player name and avatar');
  const roomLabel = document.createElement('label');
  roomLabel.id = 'ghInviteRoomLabelV7';
  roomLabel.htmlFor = 'hor-room-code';
  roomLabel.textContent = 'TABLE CODE · Filled in for you';
  const css = document.createElement('style');
  css.id = 'ghInviteStyleV7';
  css.textContent = [
    'body #lobby.joining #landingPanel783 #ghInviteIdentityV7{display:grid!important;width:100%;gap:5px;margin:0 0 8px;position:relative;z-index:20}',
    'body #lobby.joining #ghInviteIdentityV7 .identity-name-label{display:block!important;visibility:visible!important;opacity:1!important;text-align:left;color:#efd9af;font-size:15px;margin:0}',
    'body #lobby.joining #ghInviteIdentityV7 #hor-player-name{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;user-select:text!important;-webkit-user-select:text!important;position:relative!important;z-index:20;width:100%!important;min-height:42px;background:#112933!important;color:#fff5e3!important;-webkit-text-fill-color:#fff5e3!important;border:1px solid #c4a76d!important;border-radius:7px;font:17px system-ui!important;padding:9px 12px!important}',
    'body #lobby.joining #ghInviteIdentityV7 #hor-player-name::placeholder{color:#c8c4b8!important;opacity:1}',
    'body #lobby.joining #ghInviteIdentityV7 .identity-choice{display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;width:100%;flex-wrap:wrap;gap:5px}',
    'body #lobby.joining #landingPanel783 #ghInviteRoomLabelV7{display:block!important;text-align:left;margin:2px 0 0;font:600 11px system-ui;letter-spacing:.06em;color:#e1c994}',
    'body #lobby.joining #landingPanel783 #hor-room-code[readonly]{cursor:default;caret-color:transparent;color:#eeddb4!important;-webkit-text-fill-color:#eeddb4!important;background:#071925!important}',
    'body #lobby.joining #landingPartner783{display:none!important}'
  ].join('\n');
  document.head.append(css);
  name.setAttribute('autocomplete', 'nickname');
  name.setAttribute('autocapitalize', 'words');
  const original = {readonly:room.readOnly,inputmode:room.getAttribute('inputmode'),tabindex:room.getAttribute('tabindex')};
  function sync() {
    // The table preview temporarily owns these ORIGINAL controls.
    if (document.getElementById('ghGuestIdentityV10')?.isConnected) return;
    if (lobby.classList.contains('joining')) {
      if (!group.isConnected) {
        join.insertBefore(group,room);
        join.insertBefore(roomLabel,room);
      }
      nodes.forEach(node=>group.appendChild(node));
      room.readOnly=true;
      room.setAttribute('inputmode','none');
      room.setAttribute('tabindex','-1');
      room.setAttribute('aria-label','Table code ' + code + ', selected automatically');
      room.value=code;
    } else {
      nodes.forEach((node,i)=>{if(markers[i].parentNode)markers[i].parentNode.insertBefore(node,markers[i].nextSibling);});
      group.remove();
      roomLabel.remove();
      room.readOnly=original.readonly;
      if(original.inputmode===null)room.removeAttribute('inputmode');else room.setAttribute('inputmode',original.inputmode);
      if(original.tabindex===null)room.removeAttribute('tabindex');else room.setAttribute('tabindex',original.tabindex);
    }
  }
  document.addEventListener('gh-invite-controls-released', sync);
  sync();
  new MutationObserver(sync).observe(lobby,{attributes:true,attributeFilter:['class']});
})();


/* Branded invite v8: clear player-name prompt and unmistakable chosen-seat feedback. */
(() => {
  if (location.hostname !== 'rooks.jeromegriffin.com') return;
  const invite = String(window.GHR_CLOUD_INVITE || '').trim().toUpperCase();
  if (!/^(?:[A-Z]{3}[0-9]{2,4}|[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8})$/.test(invite)) return;
  const join = document.getElementById('joinForm');
  const lobby = document.getElementById('lobby');
  const name = document.getElementById('hor-player-name');
  const confirm = document.getElementById('joinConfirmBtn');
  if (!join || !lobby || !name || !confirm) return;
  name.placeholder = 'Enter your player name';
  name.removeAttribute('data-invite-suggested-name');
  const nameLabel = document.querySelector('label[for="hor-player-name"]');
  if (nameLabel) nameLabel.textContent = 'Your player name';
  const style = document.createElement('style');
  style.id = 'ghInviteSeatSelectedV8';
  style.textContent = [
    'body #lobby.joining #horInviteSeatPicker{border:1px solid #bda16e!important;border-radius:10px!important;background:rgba(5,19,32,.38)!important;padding:12px!important}',
    'body #lobby.joining #horInviteSeatPicker legend{color:#f7e3b1!important;font:700 19px Georgia,serif!important;padding:0 8px!important}',
    'body #lobby.joining #horInviteSeatPicker button[data-preferred-seat]{box-sizing:border-box;min-height:48px!important;border:2px solid #816f52!important;background:#172a3b!important;color:#f4e8cf!important;border-radius:9px!important;text-align:left!important;padding:10px 12px!important;transition:background .15s,border-color .15s,box-shadow .15s}',
    'body #lobby.joining #horInviteSeatPicker button[data-preferred-seat]:not([disabled])::after{content:"  · TAP TO SELECT";font:700 10px system-ui;letter-spacing:.035em;color:#e8d09d}',
    'body #lobby.joining #horInviteSeatPicker button[data-preferred-seat][aria-pressed="true"]{border:3px solid #ffdf8a!important;background:#b18a44!important;color:#111b2a!important;box-shadow:0 0 0 2px #183650,0 0 16px rgba(255,213,121,.52)!important;font-weight:800!important}',
    'body #lobby.joining #horInviteSeatPicker button[data-preferred-seat][aria-pressed="true"]::after{content:"  ✓ SELECTED";color:#14212d!important;font:900 12px system-ui}',
    'body #lobby.joining #horInviteSeatPicker button[data-preferred-seat]:disabled{opacity:.55!important;cursor:not-allowed!important}',
    'body #lobby.joining #horInviteSeatPicker button[data-preferred-seat]:disabled::after{content:"";display:none}',
    'body #lobby.joining #horInviteSeatPicker button[data-preferred-seat]:focus-visible{outline:3px solid #fbe5aa!important;outline-offset:3px!important}',
    'body #lobby.joining #ghInviteSeatSummaryV8{display:block!important;visibility:visible!important;box-sizing:border-box;width:100%;border:1px solid #7f8f8c;border-radius:9px;background:#0d2334;color:#f1e3c5;padding:10px 12px;margin:8px 0!important;font:600 14px/1.35 system-ui!important;text-align:center}',
    'body #lobby.joining #ghInviteSeatSummaryV8[data-selected="true"]{border:2px solid #f1ca70!important;background:#223a42!important;color:#ffe5a2!important;box-shadow:0 0 10px rgba(212,169,86,.16)!important}',
    'body #lobby.joining #joinConfirmBtn:not([disabled]){box-shadow:0 0 0 2px rgba(246,204,121,.25)!important}',
    '@media(prefers-reduced-motion:reduce){body #lobby.joining #horInviteSeatPicker button[data-preferred-seat]{transition:none!important}}'
  ].join('\n');
  document.head.append(style);
  const summary = document.createElement('div');
  summary.id = 'ghInviteSeatSummaryV8';
  summary.setAttribute('role','status');
  summary.setAttribute('aria-live','polite');
  const originalLabel = confirm.textContent;
  summary.textContent = 'Choose one of the open seats above.';
  confirm.before(summary);
  const descriptions = {
    1: ['Left opponent', 'You will play against the host.'],
    2: ["Host's partner", 'You will be on the host’s team.'],
    3: ['Right opponent', 'You will play against the host.']
  };
  function displayChoice() {
    if (!lobby.classList.contains('joining')) return;
    const picker = document.getElementById('horInviteSeatPicker');
    const chosen = picker?.querySelector('button[data-preferred-seat][aria-pressed="true"]:not([disabled])');
    if (chosen) {
      const selectedSeat = Number(chosen.getAttribute('data-preferred-seat'));
      const [label,detail] = descriptions[selectedSeat] || ['Chosen seat',''];
      summary.dataset.selected = 'true';
      summary.textContent = '✓ SELECTED: ' + label + '. ' + detail;
      confirm.textContent = '✓ Confirm ' + label + ' ›';
      confirm.setAttribute('aria-label','Confirm '+label+' and join this table');
    } else {
      summary.dataset.selected = 'false';
      summary.textContent = 'Choose one of the open seats above.';
      confirm.textContent = originalLabel;
      confirm.removeAttribute('aria-label');
    }
  }
  join.addEventListener('click',event=>{
    if (!event.target.closest?.('button[data-preferred-seat]')) return;
    queueMicrotask(displayChoice);
  });
  const observer = new MutationObserver(()=>{
    if (lobby.classList.contains('joining')) displayChoice();
  });
  observer.observe(join,{childList:true,subtree:false});
  displayChoice();
})();


/* Branded invitation v9: top-anchored, scroll-safe join panel for Facebook mobile WebView. */
(() => {
  if (location.hostname !== 'rooks.jeromegriffin.com') return;
  const code = String(window.GHR_CLOUD_INVITE || '').trim().toUpperCase();
  if (!/^(?:[A-Z]{3}[0-9]{2,4}|[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8})$/.test(code)) return;
  const lobby=document.getElementById('lobby');
  const panel=document.getElementById('landingPanel783');
  const join=document.getElementById('joinForm');
  const name=document.getElementById('hor-player-name');
  if(!lobby||!panel||!join||!name)return;
  name.placeholder='Enter your player name';
  const styles=document.createElement('style');
  styles.id='ghInviteViewportFixV9';
  styles.textContent=[
    'body #lobby.joining #landingPanel783{top:max(8px,env(safe-area-inset-top))!important;bottom:auto!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;width:min(460px,calc(100vw - 16px))!important;max-height:calc(100dvh - 16px - env(safe-area-inset-top))!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain!important;touch-action:pan-y!important;scrollbar-width:thin!important;border-radius:17px!important;padding:10px 12px!important;scroll-padding-top:12px!important;box-sizing:border-box!important}',
    'body #lobby.joining #landingPanel783 #joinForm{display:flex!important;flex-direction:column!important;gap:5px!important;overflow:visible!important;min-width:0!important;width:100%!important;box-sizing:border-box!important}',
    'body #lobby.joining #joinForm #ghInviteIdentityV7{order:0!important;gap:3px!important;margin:0 0 4px!important}',
    'body #lobby.joining #ghInviteIdentityV7 .identity-choice{gap:5px!important;min-height:50px!important}',
    'body #lobby.joining #ghInviteIdentityV7 .identity-avatar{min-height:48px!important}',
    'body #lobby.joining #joinForm #ghInviteRoomLabelV7{order:1!important;margin:1px 0!important}',
    'body #lobby.joining #joinForm #hor-room-code{order:2!important;min-height:42px!important;height:44px!important;font-size:22px!important;letter-spacing:.12em!important;margin:0 0 4px!important;padding:6px 12px!important}',
    'body #lobby.joining #joinForm #joinFeedback841{order:3!important;margin:0!important}',
    'body #lobby.joining #joinForm #horInviteSeatPicker{order:4!important;margin:5px 0 0!important;padding:8px!important;border-radius:9px!important;min-width:0!important;width:100%!important;box-sizing:border-box!important}',
    'body #lobby.joining #horInviteSeatPicker legend{font-size:18px!important}',
    'body #lobby.joining #horInviteSeatPicker button[data-preferred-seat]{min-height:42px!important;padding:7px 10px!important;margin:4px 0!important;font-size:14px!important;line-height:1.25!important;white-space:normal!important}',
    'body #lobby.joining #horInviteSeatPicker button[data-preferred-seat]::after{font-size:10px!important}',
    'body #lobby.joining #joinForm #ghInviteSeatSummaryV8{order:5!important;margin:5px 0!important;padding:7px 9px!important;font-size:13px!important;min-height:0!important}',
    'body #lobby.joining #joinForm #joinConfirmBtn{order:6!important;min-height:43px!important;margin:4px 0!important;font-size:19px!important}',
    'body #lobby.joining #joinForm #joinCancelBtn{order:7!important;min-height:36px!important;margin:3px 0!important}',
    'body #lobby.joining #landingPanel783 #lobbyStatus{font-size:12px!important;line-height:1.3!important;margin:3px 0!important;padding:0!important}',
    'body #lobby.joining #landingPanel783 #ghInviteIdentityV7 #hor-player-name{scroll-margin-top:18px!important}',
    '@media(max-height:620px){body #lobby.joining #landingPanel783{padding:8px!important}body #lobby.joining #horInviteSeatPicker button[data-preferred-seat]{min-height:39px!important;padding:6px 8px!important}body #lobby.joining #ghInviteIdentityV7 .identity-choice{min-height:43px!important}}'
  ].join('\n');
  document.head.append(styles);
  function resetScroll(){
    if(lobby.classList.contains('joining')){
      panel.scrollTop=0;
      const label=join.querySelector('legend');
      if(label)label.textContent='Choose your seat';
    }
  }
  if(lobby.classList.contains('joining'))requestAnimationFrame(resetScroll);
  new MutationObserver(resetScroll).observe(lobby,{attributes:true,attributeFilter:['class']});
})();

(function poll(n){if(document.getElementById('horInviteSeatPicker')){

/* Branded invite v10: reuse existing waiting-room table before reserving any seat. */
(() => {
  if (location.hostname !== 'rooks.jeromegriffin.com' &&
      location.hostname !== 'rooks-invite-v10-stage.jeromeleegriffin.workers.dev') return;
  const code = String(window.GHR_CLOUD_INVITE || '').trim().toUpperCase();
  if (!/^(?:[A-Z]{3}[0-9]{2,4}|[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8})$/.test(code)) return;
  const lobby = document.getElementById('lobby');
  const waiting = document.getElementById('waiting');
  const name = document.getElementById('hor-player-name');
  const picker = document.getElementById('horInviteSeatPicker');
  const options = document.querySelector('#ghInviteIdentityV7 .identity-choice') || document.querySelector('#landingPanel783 .identity-choice');
  const dock = document.getElementById('friendsDock803');
  if (!lobby || !waiting || !name || !picker || !dock || !options) return;
  const css = document.createElement('style');
  css.id = 'ghInviteTableFlowV10';
  css.textContent = [
    '#waiting[data-guest-preview="true"] #friendsDock803{z-index:40!important}',
    '#waiting[data-guest-preview="true"] #friendsDock803> :not(#ghGuestIdentityV10){display:none!important}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10{box-sizing:border-box;display:flex;flex-direction:column;gap:7px;align-items:stretch;padding:9px 11px;background:linear-gradient(180deg,#193041,#0d1e2d);border:1px solid #c3a267;border-radius:11px;max-width:100%;color:#fff2d6}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 label{font:700 15px Georgia,serif;color:#f7dca4;display:block!important;margin:0!important}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 #hor-player-name{font:16px system-ui!important;display:block!important;visibility:visible!important;opacity:1!important;box-sizing:border-box;width:100%!important;height:43px!important;min-height:43px!important;padding:8px 10px!important;color:#fff!important;-webkit-text-fill-color:#fff!important;background:#102331!important;border:1px solid #c1a16a!important;border-radius:7px!important;pointer-events:auto!important}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 .identity-choice{display:flex!important;visibility:visible!important;opacity:1!important;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px!important;padding:0!important;min-width:0!important}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 .identity-avatar{display:flex!important;flex:1 1 165px!important;max-width:100%!important;min-width:0!important;min-height:45px!important;font:14px system-ui!important}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 .identity-avatar img{width:38px!important;height:38px!important}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 .identity-voice{display:none!important}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 #ghPreviewMessageV10{font:12px/1.3 system-ui;color:#f6dba6;min-height:0;max-width:100%;text-align:center}',
    '#waiting[data-guest-preview="true"] #ghGuestIdentityV10 #ghPreviewCancelV10{font:12px system-ui;color:#e0d2b3;background:none;border:0;padding:1px 6px;min-height:20px;align-self:center}',
    '#waiting[data-guest-preview="true"] .wait-seat[data-preview-free="true"]{cursor:pointer!important;pointer-events:auto!important;z-index:12!important}',
    '#waiting[data-guest-preview="true"] .wait-seat[data-preview-free="true"] .friends-seat-choice804{border:2px solid #f2cd77!important;background:#132538e8!important;color:#ffebbc!important;font:700 12px Georgia,serif!important;min-height:36px;display:flex;justify-content:center;align-items:center;box-shadow:0 0 15px #d8ad5866!important}',
    '#waiting[data-guest-preview="true"] .wait-seat[data-preview-free="false"]{pointer-events:none!important;opacity:.9}',
    '#waiting[data-guest-preview="true"] #friendsHeading803{font-size:21px!important}',
    '#waiting[data-guest-preview="true"] #waitingStatus{font-size:13px!important}',
    '@media(max-height:680px){#waiting[data-guest-preview="true"] #ghGuestIdentityV10{padding:6px 8px;gap:4px}#waiting[data-guest-preview="true"] #ghGuestIdentityV10 #hor-player-name{height:39px!important;min-height:39px!important}}'
  ].join('\n');
  document.head.append(css);
  const seatControls=[0,1,2,3].map(seat=>document.getElementById('waitSeat'+seat)).filter(Boolean).map(button=>[button,button.disabled]);
  const holders = [];
  const move = (node,destination) => {
    const marker = document.createComment('guest-seat-flow-orig');
    node.parentNode.insertBefore(marker,node);
    holders.push([node,marker]);
    destination.append(node);
  };
  const strip=document.createElement('section');
  strip.id='ghGuestIdentityV10';
  strip.setAttribute('aria-label','Your player details');
  const label=document.createElement('label');
  label.htmlFor='hor-player-name';
  label.textContent='Your player name';
  const message=document.createElement('div');
  message.id='ghPreviewMessageV10';
  message.setAttribute('role','status');
  message.setAttribute('aria-live','polite');
  const cancel=document.createElement('button');
  cancel.id='ghPreviewCancelV10';
  cancel.type='button';
  cancel.textContent='Back to game';
  strip.append(label);
  move(name,strip);
  move(options,strip);
  strip.append(message,cancel);
  dock.prepend(strip);
  name.placeholder='Enter your player name';
  window.GHR_CLOUD_NAME='';
  name.value='';
  let active=true,joining=false,latest=null,reservedSeat=null;
  function savedSeat(){
    try {
      const saved=JSON.parse(localStorage.getItem('ghr-private-cloud-seat-v1')||'null');
      return saved?.token && saved.roomCode===code && saved.playerId===localStorage.getItem('ghr-private-cloud-player-v1') && Number.isInteger(saved.seat) && saved.seat>=0 && saved.seat<4 ? saved : null;
    } catch (_) { return null; }
  }
  const names={1:'Left opponent',2:"Host's partner",3:'Right opponent'};
  function restore(){
    active=false;
    clearInterval(painter);
    document.removeEventListener('pointerdown',takeTap,true);
    document.removeEventListener('click',takeTap,true);
    waiting.removeAttribute('data-guest-preview');
    seatControls.forEach(([button,disabled])=>{button.disabled=disabled;delete button.dataset.previewFree;delete button.dataset.previewReserved;});
    holders.forEach(([node,marker])=>{if(marker.parentNode)marker.parentNode.insertBefore(node,marker);marker.remove()});
    strip.remove();
    document.dispatchEvent(new Event('gh-invite-controls-released'));
  }
  function cancelPreview(){
    if(!active)return;
    restore();
    waiting.classList.add('hidden');
    lobby.style.display='';
    document.body.classList.remove('at-table');
    const roomForm=document.getElementById('joinForm');
    if(roomForm)roomForm.classList.add('hidden');
    lobby.classList.remove('joining');
  }
  cancel.addEventListener('click',cancelPreview);
  function showError(text){message.textContent=text;}
  async function showTable(){
    const response=await fetch('/rooms/'+encodeURIComponent(code)+'/seat-options',{cache:'no-store'});
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw Error(data.error||'Table unavailable');
    reservedSeat=null;
    const saved=savedSeat();
    if(saved){
      const check=await fetch('/rooms/'+encodeURIComponent(code)+'/snapshot',{cache:'no-store',headers:{Authorization:'Bearer '+saved.token}});
      if(check.ok)reservedSeat=saved.seat;
    }
    if(data.phase!=='waiting' && reservedSeat===null)throw Error('This table already started playing.');
    if(!active)return;
    latest=data;
    lobby.style.display='none';
    waiting.classList.remove('hidden');
    waiting.setAttribute('data-guest-preview','true');
    document.body.classList.add('at-table');
    document.getElementById('friendsHeading803').textContent=reservedSeat===null?'Choose your seat':'Return to your seat';
    document.getElementById('waitingStatus').textContent=reservedSeat===null?'Tap an open seat to join':'Your seat is saved';
    // Present the existing table in a fixed host-oriented seating view.
    const positions={0:'me',1:'left',2:'top',3:'right'};
    for(const seat of [0,1,2,3]){
      const button=document.getElementById('waitSeat'+seat);
      const state=data.seats.find(x=>Number(x.seat)===seat);
      if(!button||!state)continue;
      button.dataset.position=positions[seat];
      button.dataset.previewReserved=String(seat===reservedSeat);
      button.dataset.previewFree=String(reservedSeat===null ? !!state.joinable : seat===reservedSeat);
      button.classList.toggle('friends-empty',!!state.joinable);
      button.classList.toggle('friends-person',!state.joinable);
      if(reservedSeat===null ? state.joinable : seat===reservedSeat){
        button.innerHTML='<span class="friends-seat-choice804">'+(seat===reservedSeat?'Return to seat':'Sit here')+'</span>';
        button.disabled=false;
      }else{
        const span=document.createElement('strong');
        span.textContent=state.name||(state.occupied?'Occupied':'Open seat');
        button.replaceChildren(span);
        button.disabled=true;
      }
    }
    message.textContent='Enter your name, then tap a seat.';
  }
  async function refresh(){
    if(!active||joining)return;
    try{await showTable()}catch(e){showError('Cannot open this table: '+e.message);}
  }
  async function sit(seat){
    if(!active||joining)return;
    const newName=name.value.trim();
    if(!newName){showError('Enter your name before choosing a seat.');name.focus();return;}
    const returning=reservedSeat===seat;
    const choice=returning ? picker.querySelector('button:not([data-preferred-seat]):not([disabled])') : picker.querySelector('button[data-preferred-seat="'+seat+'"]:not([disabled])');
    if(!choice){await refresh();showError('That seat is no longer available. Tap another.');return;}
    joining=true;
    showError('Taking your seat…');
    try{
      // Existing adapter owns chosenInviteSeat and the authoritative server join.
      choice.click();
      const before=localStorage.getItem('ghr-private-cloud-seat-v1');
      let prior=null;
      try{prior=before?JSON.parse(before):null;}catch(_){}
      if(typeof window.joinRoom!=='function')throw Error('Table is still loading');
      await window.joinRoom();
      const after=localStorage.getItem('ghr-private-cloud-seat-v1');
      const result=after?JSON.parse(after):null;
      const confirmedReturn=returning && savedSeat()?.seat===seat && result?.token===prior?.token;
      if(!result?.token || result.roomCode!==code || Number(result.seat)!==seat || (result.token===prior?.token && !confirmedReturn)){
        throw Error('The seat was not confirmed. Please try again.');
      }
      restore();
      // The native Cloudflare adapter enters the genuine waiting room.
      lobby.style.display='';
    }catch(e){
      joining=false;
      await refresh();
      showError(e.message||'Could not take seat.');
    }
  }
  for(const seat of [0,1,2,3]){
    const b=document.getElementById('waitSeat'+seat);
    if(!b)continue;
    b.addEventListener('click',event=>{
      if(!active||!waiting.hasAttribute('data-guest-preview'))return;
      event.preventDefault();
      event.stopImmediatePropagation();
      sit(seat);
    },true);
  }

  // The original waiting-screen controller also refreshes seat markup.
  // Keep the guest view in sync with the server snapshot, without redrawing art.
  function repaint(){
    if(!active||joining||!latest||waiting.dataset.guestPreview!=='true')return;
    const positions={0:'me',1:'left',2:'top',3:'right'};
    for(const seat of [0,1,2,3]){
      const b=document.getElementById('waitSeat'+seat);
      const info=latest.seats?.find(x=>Number(x.seat)===seat);
      if(!b||!info)continue;
      const free=reservedSeat===null ? !!info.joinable : seat===reservedSeat;
      b.dataset.previewReserved=String(seat===reservedSeat);
      if(b.dataset.position!==positions[seat])b.dataset.position=positions[seat];
      if(b.dataset.previewFree!==String(free))b.dataset.previewFree=String(free);
      if(b.disabled===free)b.disabled=!free;
      if(b.classList.contains('friends-empty')!==free)b.classList.toggle('friends-empty',free);
      if(b.classList.contains('friends-person')===free)b.classList.toggle('friends-person',!free);
      if(free) {
        const caption=seat===reservedSeat?'Return to seat':'Sit here';
        if(b.textContent?.trim()!==caption){const label=document.createElement('span');label.className='friends-seat-choice804';label.textContent=caption;b.replaceChildren(label);}
      }else{
        if(b.textContent?.trim()!==(info.name||(info.occupied?'Occupied':'Open seat'))){
          const label=document.createElement('strong');label.textContent=info.name||(info.occupied?'Occupied':'Open seat');
          b.replaceChildren(label);
        }
      }
    }
    const title=document.getElementById('friendsHeading803');
    const heading=reservedSeat===null?'Choose your seat':'Return to your seat';
    if(title&&title.textContent!==heading)title.textContent=heading;
    const status=document.getElementById('waitingStatus');
    const hint=reservedSeat===null?'Tap an open seat to join':'Your seat is saved';
    if(status&&status.textContent!==hint)status.textContent=hint;
  }
  const painter=setInterval(repaint,300);
  const takeTap=(e)=>{
    if(!active||joining||waiting.dataset.guestPreview!=='true')return;
    const seat=e.target.closest?.('#waitSeat0,#waitSeat1,#waitSeat2,#waitSeat3');
    if(!seat||seat.dataset.previewFree!=='true')return;
    e.preventDefault();
    e.stopImmediatePropagation();
    sit(Number(seat.id.slice(-1)));
  };
  // Native room listeners own click events after a person has joined.
  // Before reservation, capture both touchscreen presses and keyboard clicks.
  document.addEventListener('pointerdown',takeTap,true);
  document.addEventListener('click',takeTap,true);

  // Reuse the original room-art, rather than rendering another seat list.
  const start=()=>{if(!active)return;refresh()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else setTimeout(start,0);
})();

}else if(n<80)setTimeout(()=>poll(n+1),100)})(0);

/* Stable prejoin labels even when the native waiting renderer refreshes seats. */
(() => {
  if (location.hostname !== 'rooks.jeromegriffin.com') return;
  const style=document.createElement('style');
  style.id='ghGuestSeatLabelStableV10a';
  style.textContent=[
    '#waiting[data-guest-preview="true"] .wait-seat[data-preview-free="true"] > * {display:none!important}',
    '#waiting[data-guest-preview="true"] .wait-seat[data-preview-free="true"]::after {content:"Sit here";box-sizing:border-box;display:flex!important;align-items:center;justify-content:center;width:100%;min-height:38px;padding:6px 9px;border:2px solid #ebc674;border-radius:8px;background:#10263ce8;color:#f7e6b8;font:700 13px Georgia,serif!important;box-shadow:0 0 13px #c49b5266}',
    '#waiting[data-guest-preview="true"] .wait-seat[data-preview-reserved="true"]::after {content:"Return to seat"}',
    '#waiting[data-guest-preview="true"] .wait-seat[data-preview-free="true"]:focus-visible::after {outline:3px solid #ffdf9d;outline-offset:2px}'
  ].join('\n');
  document.head.append(style);
})();
