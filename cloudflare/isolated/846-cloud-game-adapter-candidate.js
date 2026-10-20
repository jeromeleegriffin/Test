/*
 * Build-797 screen adapter for the isolated Cloudflare room server.
 * This source is injected only by the private test Worker when ?cloud=1 is
 * present. It is never added to the live Test site or production game.
 */
(() => {
  const query = new URLSearchParams(location.search);
  if (!query.has("cloud")) return;
  // Private 846 adapter, eight-character Cloudflare room codes.
  const codeField = document.getElementById("hor-room-code");
  if (codeField) codeField.maxLength = 8;
  if (!["797", "805-ownerreview", "846-complete-repairs-20261019"].includes(window.HOR_SCRIPT_BUILD)) {
    const notice = document.getElementById("lobbyStatus");
    if (notice) notice.textContent = "This game version has not been verified for private cloud play. Please wait for the test adapter update.";
    // Fail closed rather than silently falling back to browser-hosted rooms.
    for (const name of ["createRoom", "joinRoom", "startGameWithToast"]) window[name] = () => {};
    document.addEventListener("click", event => {
      if (event.target.closest?.("#createBtn,#joinConfirmBtn,#startBtn")) { event.preventDefault(); event.stopImmediatePropagation(); }
    }, true);
    return;
  }

  const credentialKey = "ghr-private-cloud-seat-v1";
  const playerIdKey = "ghr-private-cloud-player-v1";
  let credentials = null;
  let latest = null;
  let lastRevision = -1;
  let timer = null;
  let socket = null;
  let socketReconnectTimer = null;
  let socketRetryCount = 0;
  let busy = false;
  let lastScoreSignature = "";
  let redealRevision = -1;

  const status = (message) => {
    const lobby = document.getElementById("lobby");
    const el = lobby && !lobby.classList.contains("hidden")
      ? document.getElementById("lobbyStatus")
      : (document.getElementById("messageArea") || document.getElementById("lobbyStatus"));
    if (el) el.textContent = message;
  };
  const showBotFillStatus = (message, button) => {
    let el = document.getElementById("ghrBotFillStatus");
    if (!el) {
      el = document.createElement("div");
      el.id = "ghrBotFillStatus";
      el.setAttribute("role", "status");
      el.style.cssText = "margin:8px 0;padding:10px 12px;border:1px solid #9b7d42;border-radius:8px;color:#f0dfb6;background:#211a12;font-size:16px;";
      (button || document.getElementById("cloudFillBotsBtn") || document.getElementById("fillSeatsBtn"))?.insertAdjacentElement("afterend", el);
    }
    el.textContent = message;
  };
  const ownId = () => {
    let id = localStorage.getItem(playerIdKey);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(playerIdKey, id);
    }
    return id;
  };
  const api = async (path, { method = "GET", body, token = credentials?.token } = {}) => {
    const headers = {};
    if (token) headers.Authorization = "Bearer " + token;
    if (body !== undefined) headers["Content-Type"] = "application/json";
    // The legacy game assets need a GitHub Pages <base>, but API routes belong
    // to the private Worker. Resolve them explicitly against the current origin.
    const response = await fetch(new URL(path, window.location.origin), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || ("HTTP_" + response.status));
    return data;
  };
  const roomPath = (action = "") => "/rooms/" + encodeURIComponent(credentials.roomCode) + (action ? "/" + action : "");
  const playerIdForSeat = (seat) => "cloud-seat-" + seat;

  function credentialsFrom(result, playerId) {
    sessionStorage.removeItem("ghr-cloud-disconnected");
    credentials = {
      roomCode: result.roomCode || result.roomId,
      seat: Number(result.seat),
      token: result.token,
      playerId,
    };
    localStorage.setItem(credentialKey, JSON.stringify(credentials));
    roomCode = credentials.roomCode;
    myIndex = credentials.seat;
    myPeerId = playerIdForSeat(credentials.seat);
    myName = (document.getElementById("hor-player-name")?.value || "Player").trim() || "Player";
    isSpectator = false;
  }

  function mapPlayers(snap) {
    return Array.from({ length: 4 }, (_, seat) => {
      const p = snap.players?.find((entry) => entry && Number(entry.seat) === seat);
      if (!p || p.occupied === false) return null;
      return {
        id: playerIdForSeat(seat),
        name: p.name || p.displayName || ("Player " + (seat + 1)),
        seat,
        team: Number.isInteger(p.team) ? p.team : seat % 2,
        isHost: seat === 0,
        isBot: p.isBot === true,
        bank: 0,
        avatar: p.avatar || "",
        voice: p.voice || "silent",
      };
    });
  }

  function enterWaiting(snap) {
    latest = snap;
    const tablePlayers = mapPlayers(snap);
    players = tablePlayers.filter(Boolean);
    game = {
      phase: "waiting",
      players: tablePlayers,
      scores: [0, 0],
      hands: [[], [], [], []],
      myHand: [],
      handNumber: 0,
      targetScore: 500,
    };
    isHost = credentials.seat === 0;
    myIndex = credentials.seat;
    myPeerId = playerIdForSeat(credentials.seat);
    window._horStayInGame = false;
    try { horMarkActiveTable(false); } catch (_) {}
    try { showWaiting(); } catch (_) {
      document.getElementById("lobby")?.classList.add("hidden");
      document.getElementById("waiting")?.classList.remove("hidden");
    }
    const hostOptions = document.getElementById("hostOptions");
    const hostOptionsButton = document.getElementById("openHostOptionsBtn");
    if (hostOptions) hostOptions.classList.add("hidden");
    if (hostOptionsButton) hostOptionsButton.classList.add("hidden");
    const code = document.getElementById("displayCode");
    if (code) code.textContent = credentials.roomCode;
    try { updateWaitingUI(); } catch (_) {}
    const start = document.getElementById("startBtn");
    let botsButton = document.getElementById("cloudFillBotsBtn");
    if (!botsButton && start?.parentElement) {
      botsButton = document.createElement("button");
      botsButton.id = "cloudFillBotsBtn";
      botsButton.type = "button";
      botsButton.className = "btn";
      botsButton.textContent = "Fill open seats with test bots";
      start.parentElement.insertBefore(botsButton, start);
      botsButton.addEventListener("click", async () => {
        if (!credentials || credentials.seat !== 0) { showBotFillStatus("This phone is not connected as the host. Rejoin the host seat, then try again.", botsButton); return; }
        if (busy) { showBotFillStatus("The table is finishing another action. Wait a moment, then tap again.", botsButton); return; }
        busy = true;
        botsButton.disabled = true;
        botsButton.textContent = "Adding bots…";
        showBotFillStatus("Adding test bots to the open seats…", botsButton);
        try {
          const snap = await api(roomPath("fill-bots"), { method: "POST", body: {} });
          latest = snap;
          lastRevision = snap.revision;
          enterWaiting(snap);
          showBotFillStatus("Bots added. The table is ready to start.", botsButton);
        } catch (error) {
          showBotFillStatus("Could not add bots: " + error.message, botsButton);
        } finally {
          busy = false;
          botsButton.disabled = false;
          botsButton.textContent = "Fill open seats with test bots";
        }
      });
    }
    if (botsButton) {
      const humanCount = (snap.players || []).filter(player => player?.occupied && !player.isBot).length;
      const openCount = 4 - (snap.occupiedSeats || []).length;
      botsButton.classList.toggle("hidden", credentials.seat !== 0 || openCount < 1);
      botsButton.disabled = openCount < 1;
    }
    if (start && credentials.seat === 0) {
      start.classList.remove("hidden");
      start.disabled = snap.occupiedSeats?.length !== 4;
      start.textContent = "Start Game";
    }
  }

  function gameSnapshot(snap) {
    const tablePlayers = mapPlayers(snap);
    const hand = Array.isArray(snap.hand) ? snap.hand.map((card) => ({ ...card })) : [];
    const viewPhase = snap.phase === "complete" ? "score" : snap.phase;
    const hands = [[], [], [], []];
    hands[credentials.seat] = hand.map((card) => ({ ...card }));
    players = tablePlayers;
    myIndex = credentials.seat;
    myPeerId = playerIdForSeat(credentials.seat);
    // The cloud room still has a real host seat. Treating every client as a
    // guest after dealing hides host controls and reports a false wait state.
    isHost = credentials.seat === 0;
    const view = {
      phase: viewPhase,
      scores: snap.scores || [0, 0],
      sandbagOverpoints: [0, 0],
      bid: snap.bid || 0,
      highestBid: snap.highestBid,
      minBid: 100,
      passCount: snap.passCount || 0,
      bidder: snap.bidder,
      trump: snap.trump,
      currentPlayer: snap.currentPlayer,
      trick: (snap.trick || []).map((entry) => ({ player: entry.player, card: { ...entry.card } })),
      ledColor: snap.ledColor,
      players: tablePlayers,
      dealer: snap.dealer,
      handsCount: snap.handCounts || [0, 0, 0, 0],
      targetScore: snap.targetScore || 500,
      lastTrickWinner: snap.lastTrickWinner,
      resolvingTrick: false,
      paused: false,
      bidStatus: snap.bidStatus || [null, null, null, null],
      discardCount: snap.discardCount || 0,
      nestAuctionOpen: false,
      revealTopNest: true,
      nestFlipped: false,
      topNestCard: snap.topNestCard || null,
      nestFlipStage: 0,
      widowSpread: snap.widowSpread || [],
      handPoints: snap.handPoints || [0, 0],
      trumpClaimPlayer: snap.canClaimRemaining ? credentials.seat : null,
      claimDeclined: !!snap.claimDeclined,
      claimAnimation: null,
      claimAnimating: false,
      resolvingTrickPoints: 0,
    };
    const current = game || {};
    Object.assign(current, {
      phase: viewPhase,
      scores: view.scores,
      sandbagOverpoints: view.sandbagOverpoints,
      bid: view.bid,
      highestBid: view.highestBid,
      passCount: view.passCount,
      bidder: view.bidder,
      trump: view.trump,
      currentPlayer: view.currentPlayer,
      trick: view.trick,
      ledColor: view.ledColor,
      players: tablePlayers,
      dealer: view.dealer,
      handsCount: view.handsCount,
      handNumber: snap.handNumber,
      targetScore: view.targetScore,
      lastTrickWinner: view.lastTrickWinner,
      resolvingTrick: false,
      paused: false,
      bidStatus: view.bidStatus,
      discardCount: view.discardCount,
      nestAuctionOpen: false,
      nestFlipped: false,
      topNestCard: view.topNestCard,
      widowSpread: view.widowSpread,
      handPoints: view.handPoints,
      trumpClaimPlayer: view.trumpClaimPlayer,
      claimDeclined: view.claimDeclined,
      claimAnimation: null,
      claimAnimating: false,
      resolvingTrickPoints: 0,
      hands,
      myHand: hand,
      nest: Array.from({ length: Number(snap.nestCount) || 0 }, () => null),
      nestPreview: Array.isArray(snap.nestPreview) ? snap.nestPreview : [],
      kittyTaken: Array.isArray(snap.nestPreview) ? snap.nestPreview : [],
      nestCards: Array.isArray(snap.nestCards) ? snap.nestCards : [],
      nestRevealCards: Array.isArray(snap.nestCards) ? snap.nestCards : [],
      lastSummary: snap.lastSummary || null,
      matchResult: snap.matchResult || null,
    });
    game = current;
    try { applyState(view); } catch (error) { status("Could not draw the current table: " + error.message); }

    if (snap.lastSummary) {
      const signature = String(snap.handNumber) + ":" + String(snap.revision);
      if (signature !== lastScoreSignature) {
        lastScoreSignature = signature;
        const nestCards = snap.nestCards || [];
        const nestPts = nestCards.reduce((sum, card) => sum + (typeof cardPoints === "function" ? cardPoints(card) : 0), 0);
        const nestWinnerName = snap.lastSummary.nestTeam != null && typeof teamLabel === "function"
          ? teamLabel(snap.lastSummary.nestTeam)
          : "Winning team";
        try { showScoreModal({ ...snap.lastSummary, nestCards, nestPts, nestWinnerName }); } catch (_) {}
        wireCloudScoreButton(!!snap.matchResult);
        if (snap.matchResult && !window._horCloudWinnerShown) {
          window._horCloudWinnerShown = true;
          try { showWinCelebration(snap.matchResult, snap.scores); } catch (_) {}
        }
      }
    }
    if (snap.phase === "redeal" && credentials.seat === 0 && redealRevision !== snap.revision) {
      redealRevision = snap.revision;
      setTimeout(() => sendAction("redeal", {}), 0);
    }
  }

  function wireCloudScoreButton(isFinal) {
    const next = document.getElementById("scoreModalNext") || document.querySelector("#scoreModal [data-action='next']") || document.querySelector("#scoreModal button:last-of-type");
    if (!next) return;
    next.textContent = isFinal ? "OK" : "Next Hand";
    next.onclick = (event) => {
      event.preventDefault();
      document.getElementById("scoreModal")?.classList.add("hidden");
      if (!isFinal) sendAction("next-hand", {});
    };
  }

  async function refresh() {
    if (!credentials || busy) return;
    try {
      const snap = await api(roomPath("snapshot"));
      receiveSnapshot(snap);
    } catch (error) {
      status("Connection issue. Reconnecting\u2026 (" + error.message + ")");
    }
  }

  function receiveSnapshot(snap) {
    if (!snap || !Number.isInteger(snap.revision) || snap.revision < lastRevision) return;
    latest = snap;
    if (snap.revision !== lastRevision || lastRevision < 0) {
      lastRevision = snap.revision;
      if (snap.phase === "waiting") enterWaiting(snap);
      else gameSnapshot(snap);
    }
  }

  function setFallbackPolling(enabled) {
    clearInterval(timer);
    timer = enabled ? setInterval(refresh, 15000) : null;
  }

  function scheduleSocketReconnect() {
    if (socketReconnectTimer || !credentials) return;
    setFallbackPolling(true);
    const delay = Math.min(30000, 1000 * (2 ** Math.min(socketRetryCount++, 5)));
    socketReconnectTimer = setTimeout(() => {
      socketReconnectTimer = null;
      connectSocket();
    }, delay);
  }

  async function connectSocket() {
    if (!credentials || socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) return;
    try {
      const issued = await api(roomPath("ws-ticket"), { method: "POST", body: {} });
      const endpoint = new URL(roomPath("ws"), window.location.origin);
      endpoint.protocol = endpoint.protocol === "https:" ? "wss:" : "ws:";
      endpoint.searchParams.set("ticket", issued.ticket);
      const next = new WebSocket(endpoint.toString());
      socket = next;
      next.onopen = () => {
        socketRetryCount = 0;
        setFallbackPolling(false);
      };
      next.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "snapshot") receiveSnapshot(message.snapshot);
        } catch (_) {}
      };
      next.onerror = () => {};
      next.onclose = () => {
        if (socket === next) {
          socket = null;
          scheduleSocketReconnect();
        }
      };
    } catch (_) {
      scheduleSocketReconnect();
    }
  }

  function startRealtime() {
    clearInterval(timer);
    clearTimeout(socketReconnectTimer);
    socketReconnectTimer = null;
    try { socket?.close(); } catch (_) {}
    socket = null;
    socketRetryCount = 0;
    lastRevision = -1;
    refresh();
    setFallbackPolling(true);
    connectSocket();
  }

  async function joinByCode() {
    const input = document.getElementById("hor-room-code");
    const name = (document.getElementById("hor-player-name")?.value || "").trim();
    const code = (input?.value || "").trim().toUpperCase();
    if (!name || !code) throw new Error("Enter your name and the room code.");
    const playerId = ownId();
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(credentialKey) || "null"); } catch (_) {}
    const resumeToken = saved?.roomCode === code && saved?.playerId === playerId ? saved.token : null;
    const result = await api("/rooms/" + encodeURIComponent(code) + "/join", {
      method: "POST",
      body: { playerId, displayName: name, resumeToken },
      token: null,
    });
    credentialsFrom({ ...result, roomCode: code }, playerId);
    startRealtime();
  }

  async function createCloudRoom() {
    const name = (document.getElementById("hor-player-name")?.value || "").trim();
    if (!name) throw new Error("Enter your name first.");
    const playerId = ownId();
    const result = await api("/rooms", {
      method: "POST",
      body: { playerId, displayName: name },
      token: null,
    });
    credentialsFrom(result, playerId);
    startRealtime();
  }

  async function sendAction(route, data) {
    if (!credentials || !latest || busy) return;
    busy = true;
    const body = {
      actionId: crypto.randomUUID(),
      expectedRevision: latest.revision,
      ...data,
    };
    try {
      await api(roomPath(route), { method: "POST", body });
      await refreshAfterAction();
    } catch (error) {
      status("Move not accepted: " + error.message);
      await refreshAfterAction();
    } finally {
      busy = false;
    }
  }

  async function refreshAfterAction() {
    if (!credentials) return;
    try {
      const snap = await api(roomPath("snapshot"));
      latest = snap;
      lastRevision = snap.revision;
      if (snap.phase === "waiting") enterWaiting(snap);
      else gameSnapshot(snap);
    } catch (_) {}
  }

  async function startCloudGame() {
    if (!credentials || credentials.seat !== 0) return;
    try {
      await api(roomPath("start"), { method: "POST", body: {}, token: credentials.token });
      await refreshAfterAction();
    } catch (error) { status("Could not start the table: " + error.message); }
  }

  async function reconnectCloudRoom() {
    if (sessionStorage.getItem("ghr-cloud-disconnected") === "1") return false;
    const saved = JSON.parse(localStorage.getItem(credentialKey) || "null");
    if (!saved || !saved.roomCode || !saved.token) return false;
    credentials = saved;
    roomCode = saved.roomCode;
    myIndex = saved.seat;
    myPeerId = playerIdForSeat(saved.seat);
    myName = (document.getElementById("hor-player-name")?.value || "Player").trim() || "Player";
    try {
      const snap = await api(roomPath("snapshot"));
      latest = snap;
      if (snap.phase === "waiting") enterWaiting(snap);
      else gameSnapshot(snap);
      startRealtime();
      return true;
    } catch (error) {
      if (["ROOM_NOT_FOUND", "UNAUTHORIZED"].includes(error.message)) {
        localStorage.removeItem(credentialKey);
        credentials = null;
        return false;
      }
      status("Connection interrupted. Your seat is saved; retrying.");
      startRealtime();
      return true;
    }
  }

  function disconnectCloudRoom() {
    // Disconnect is reversible: keep the server seat and its reconnect credential.
    sessionStorage.setItem("ghr-cloud-disconnected", "1");
    credentials = null;
    clearInterval(timer);
    clearTimeout(socketReconnectTimer);
    socketReconnectTimer = null;
    const previous = socket;
    socket = null;
    try { previous?.close(); } catch (_) {}
    location.reload();
  }
  window.clientLeaveReplace = () => {
    if (confirm("Leave this screen? Your seat stays reserved so you can rejoin. No bot will replace you.")) disconnectCloudRoom();
  };
  window.leaveTableAfterConfirmation043 = disconnectCloudRoom;
  window.leaveTableToLobby043 = disconnectCloudRoom;
  // Spectator mode is unsupported by the private room server.
  for (const id of ["spectateBtn", "welcomeWatchBtn"]) {
    const button = document.getElementById(id);
    if (button) { button.disabled = true; button.title = "Watch-only unavailable in cloud test"; }
  }
  // Existing listener registrations may still hold the legacy leave callback.
  document.addEventListener("click", event => {
    const button = event.target.closest?.("#leaveBtn,#leaveReplaceBtn,#rejoinBtn,#reconnectBtn,#friendsToggleBtn,#createBtn,#joinConfirmBtn,#fillSeatsBtn,#startBtn,#spectateBtn,#welcomeWatchBtn,#shareBtn,#showQrBtn");
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (["spectateBtn", "welcomeWatchBtn"].includes(button.id)) {
      status("Watch-only is unavailable in the private Cloudflare test.");
      return;
    }
    if (["shareBtn", "showQrBtn"].includes(button.id)) {
      status("Open this private Cloudflare page separately and enter room code " + (credentials?.roomCode || ""));
      return;
    }
    if (["friendsToggleBtn", "createBtn"].includes(button.id)) {
      createCloudRoom().catch(error => status(error.message));
    } else if (button.id === "joinConfirmBtn") {
      joinByCode().catch(error => status(error.message));
    } else if (button.id === "fillSeatsBtn") {
      if (credentials?.seat !== 0) { showBotFillStatus("This phone is not connected as the host. Rejoin the host seat, then try again.", button); return; }
      if (busy) { showBotFillStatus("The table is finishing another action. Wait a moment, then tap again.", button); return; }
      busy = true;
      button.disabled = true;
      showBotFillStatus("Adding test bots to the open seats…", button);
      api(roomPath("fill-bots"), { method: "POST", body: {} })
        .then(snap => { receiveSnapshot(snap); showBotFillStatus("Bots added. The table is ready to start.", button); })
        .catch(error => showBotFillStatus("Could not add bots: " + error.message, button))
        .finally(() => { busy = false; button.disabled = false; });
    } else if (button.id === "startBtn") {
      startCloudGame();
    } else if (["rejoinBtn", "reconnectBtn"].includes(button.id)) {
      sessionStorage.removeItem("ghr-cloud-disconnected");
      reconnectCloudRoom();
    } else window.clientLeaveReplace();
  }, true);
  let cloudSeat = null;
  try { cloudSeat = JSON.parse(localStorage.getItem(credentialKey) || "null"); } catch (_) {}
  document.getElementById("reconnectBox")?.classList.toggle("hidden", !cloudSeat?.token || !cloudSeat?.roomCode);
  if (cloudSeat?.token && cloudSeat?.roomCode) {
    const codeEl = document.getElementById("reconnectCode");
    if (codeEl) codeEl.textContent = cloudSeat.roomCode;
    const resume = document.getElementById("reconnectBtn");
    if (resume) { resume.classList.remove("hidden"); resume.textContent = "Rejoin your reserved seat"; }
  }
  window.saveSession = () => {};
  window.createRoom = function () { return createCloudRoom().catch((error) => status(error.message)); };
  window.joinRoom = function () { return joinByCode().catch((error) => status(error.message)); };
  window.startGameWithToast = function () { return startCloudGame(); };
  window.submitBid = function (value) { return sendAction("bid", { value: Number(value) }); };
  window.submitDiscard = function (cardIds) { return sendAction("discard", { cardIds: [...cardIds] }); };
  window.submitTrump = function (color) { return sendAction("trump", { color }); };
  window.submitPlay = function (cardId) {
    if (Date.now() < playLockUntil) return;
    playLockUntil = Date.now() + 450;
    return sendAction("play", { cardId });
  };
  window.hostStartNextHand = function () { return sendAction("next-hand", {}); };
  window.onWaitSeatClick = async function (seat) {
    if (!credentials) { status("Join the room before adding test bots."); return; }
    if (credentials.seat !== 0) { status("Only the host can add test bots."); return; }
    const target = (latest?.players || []).find(player => Number(player?.seat) === Number(seat));
    if (target?.occupied) { status("That seat is already occupied."); return; }
    const humanCount = (latest?.players || []).filter(player => player?.occupied && !player.isBot).length;
    
    if (busy) return;
    busy = true;
    try {
      const snap = await api(roomPath("fill-bots"), { method: "POST", body: {} });
      latest = snap;
      lastRevision = snap.revision;
      enterWaiting(snap);
    } catch (error) {
      status("Could not add test bots: " + error.message);
    } finally {
      busy = false;
    }
  };
  window.hostProcessAllTrumpsClaim = function () { return sendAction("claim-remaining", {}); };
  window.hostDeclineClaim = function () { return sendAction("decline-claim", {}); };

  // Replace the existing PeerJS-only claim buttons with the same approved copy,
  // routed through the authoritative room service instead.
  window.showAllTrumpsClaimUI = function () {
    if (!latest?.canClaimRemaining || latest.currentPlayer !== credentials?.seat) return;
    const panel = document.getElementById("actionPanel");
    if (!panel) return;
    const reason = latest.remainingClaimReason === "trumps"
      ? "controls every remaining winning card"
      : "can take the rest of the tricks";
    panel.className = "action-panel trump-claim-panel lt-floating-panel";
    panel.classList.remove("hidden", "bid-panel");
    panel.innerHTML = "<span><strong>" + String(myName).replace(/[&<>"']/g, "") + "</strong> " + reason + ".</span>"
      + '<button type="button" id="layDownClaimBtn" class="btn primary">Lay Down &amp; End Hand</button>'
      + '<button type="button" id="continueClaimBtn" class="btn">Continue Playing</button>';
    document.getElementById("layDownClaimBtn")?.addEventListener("click", () => sendAction("claim-remaining", {}));
    document.getElementById("continueClaimBtn")?.addEventListener("click", () => sendAction("decline-claim", {}));
  };

  // Keep ordinary offline play in this copy available when cloud=1 is absent.
  // The cloud branch has no careers, local award writes, or PeerJS seats.
  // Private-test bots are controlled only by the server room reducer.
  try { window.horRecordCareerHand = () => ({ ok: true, skipped: "private-cloud-test" }); } catch (_) {}
  try { window.mergeLifetimeStats = () => {}; } catch (_) {}
  try { window.noteHumanAuction = () => {}; } catch (_) {}
  try { window.noteHumanHandEnd = () => {}; } catch (_) {}
  window.HOR_CLOUD_TEST_ACTIVE = true;
  // The Durable Object controls test bots. Prevent the legacy browser bot
  // loop from issuing a second move against the same visible game.
  window.isBotTurn = () => false;
  window.scheduleBot = () => {};
  window.runBotAction = () => {};
  status("Private cloud room test ready.");
  reconnectCloudRoom().then((resumed) => {
    if (!resumed) status("Private cloud room test ready. Create a room or join with a code.");
  });
})();

