from pathlib import Path
import json
root=Path(__file__).resolve().parents[2]
s=(root/'cloudflare/isolated/worker-candidate.mjs').read_text()
s=s.replace('GHR-Private-Test','GHR-Online-v1').replace('var PRIVATE_SESSION_MS = 60 * 60 * 1e3;', 'var PRIVATE_SESSION_MS = 12 * 60 * 60 * 1e3;')
s=s.replace('Private cloud room test ready.', 'Online table ready.').replace('Private cloud room test ready. Create a room or join with a code.', 'Online table ready. Create a room or join with a code.')
start=s.index('    if (request.method === "GET" && url.pathname === "/cloud-game/index.html")')
end=s.index('    if ((request.method === "GET" || request.method === "HEAD")',start)
s=s[:start]+'''    const isEntry = ["/", "/index.html", "/cloud-game/index.html", "/cloud-game/game"].includes(url.pathname);
    const isRoom = url.pathname === "/rooms" || url.pathname.startsWith("/rooms/");
    if (["/cloud-game/launch", "/four-player-check"].includes(url.pathname)) return new Response("Not found", {status:404});
    if (isRoom) {
      if (request.method !== "GET" && request.headers.get("origin") !== url.origin) return json({error:"SAME_ORIGIN_REQUIRED"},403);
      if (!await verifyPrivateSession(cookieValue(request, PRIVATE_SESSION_COOKIE), env.TEST_GATE_KEY)) return json({error:"SESSION_REQUIRED"},401);
      const bucket = url.pathname === "/rooms" || url.pathname.endsWith("/join") ? env.ENTRY_LIMIT : env.ACTION_LIMIT;
      if (!bucket) return json({error:"SERVER_CONFIGURATION_REQUIRED"},503);
      const {success} = await bucket.limit({key: (request.headers.get("CF-Connecting-IP") || "unknown") + ":" + (bucket === env.ENTRY_LIMIT ? url.pathname === "/rooms" ? "create" : "join" : "action")});
      if (!success) return new Response(JSON.stringify({error:"TOO_MANY_REQUESTS"}),{status:429,headers:{"content-type":"application/json","cache-control":"no-store","retry-after":"60"}});
    }
    if (isEntry && request.method === "GET") {
      let session = null;
      if (!await verifyPrivateSession(cookieValue(request, PRIVATE_SESSION_COOKIE),env.TEST_GATE_KEY)) {
        if (!env.ENTRY_LIMIT) return new Response("Temporarily unavailable",{status:503});
        const {success}=await env.ENTRY_LIMIT.limit({key:(request.headers.get("CF-Connecting-IP")||"unknown")+":session"});
        if (!success) return new Response("Please try again shortly.",{status:429,headers:{"retry-after":"60","cache-control":"no-store"}});
        session=await issuePrivateSession(env.TEST_GATE_KEY);
      }
      try {
        const upstream=await fetch("https://raw.githubusercontent.com/jeromeleegriffin/Test/b3f3928548bc79df5169165b953e458cc68ddc09/index.html",{redirect:"follow",cf:{cacheEverything:true,cacheTtlByStatus:{"200-299":86400,"300-599":-1}}});
        if (!upstream.ok) return new Response("The game is temporarily unavailable. Please reload shortly.",{status:502,headers:{"cache-control":"no-store"}});
        const response=secureIntegratedGameHtml(injectCloudGameAdapter(await upstream.text()));
        if (session) response.headers.set("Set-Cookie",`${PRIVATE_SESSION_COOKIE}=${session.token}; Path=/; Max-Age=${Math.floor(PRIVATE_SESSION_MS/1000)}; HttpOnly; Secure; SameSite=Strict`);
        return response;
      } catch { return new Response("The game is temporarily unavailable. Please reload shortly.",{status:502,headers:{"cache-control":"no-store"}}); }
    }
'''+s[end:]
# Root must always serve the actual game; hide legacy PoC UI on unknown routes.
s=s.replace('if (!match) return serveClient(request, env);','if (!match) return new Response("Not found", {status:404});')
s=s.replace('if (!action) return serveClient(request, env);','if (!action) return new Response("Not found", {status:404});')
# Native sharing + explicit server closure are live-only; private checkpoints stay unchanged.
a=(root/'cloudflare/live/adapter-live.js').read_text()
start=s.index('var CLOUD_GAME_ADAPTER = ');end=s.index('\n// worker.mjs\nvar IDLE_ROOM_MS',start)
s=s[:start]+'var CLOUD_GAME_ADAPTER = '+json.dumps(a)+';\n'+s[end:]
s=s.replace('history.replaceState(null,"",location.pathname+"?cloud=1");', 'window.GHR_CLOUD_INVITE=new URLSearchParams(location.search).get("room")||"";history.replaceState(null,"",location.pathname+"?cloud=1");')
s=s.replace('async cleanup(roomId, { now', 'async closeTable(roomId, token) { const room=await this.storage.get(roomId); if(!room)throw Error("ROOM_NOT_FOUND"); if(this.#authorizedSeat(room,token)!==0)throw Error("HOST_ONLY"); if(room.status!=="closed"){room.status="closed";room.closedAt=Date.now();room.lastActivityAt=Date.now();room.revision++;await this.storage.put(roomId,room);}return {status:"closed"}; }\n  async cleanup(roomId, { now')
s=s.replace('if (!room) throw new Error("ROOM_NOT_FOUND");\n    return room;', 'if (!room) throw new Error("ROOM_NOT_FOUND");\n    if(room.status==="closed")throw Error("ROOM_CLOSED");\n    return room;')
s=s.replace('var fail = /* @__PURE__ */ __name((error) => {', 'var fail = /* @__PURE__ */ __name((error) => {\n  if(error?.message==="ROOM_CLOSED")return json({error:"ROOM_CLOSED"},410);')
s=s.replace('      if (request.method === "POST" && url.pathname === "/fill-bots") {', '      if (request.method === "POST" && url.pathname === "/close") return json(await this.service.closeTable(this.roomKey,token));\n      if (request.method === "POST" && url.pathname === "/fill-bots") {')
s=s.replace('join|snapshot|ws-ticket|ws|fill-bots|', 'join|snapshot|ws-ticket|ws|close|fill-bots|')
s=s.replace('      } catch {\n        try {\n          socket.close(1008, "Seat session expired");', '      } catch (error) {\n        if(error?.message==="ROOM_CLOSED") { try{socket.send(JSON.stringify({type:"room-closed"}));socket.close(1000,"Table closed");}catch(_){}continue; }\n        try {\n          socket.close(1008, "Seat session expired");')
# A single native seat tap adds only that bot; bulk fill retains the existing API.
s=s.replace('async fillOpenSeatsWithBots(roomId, token) {', 'async fillOpenSeatsWithBots(roomId, token, requestedSeat) {')
s=s.replace('    for (const seat of open) {', '    if(requestedSeat!==undefined){if(!Number.isInteger(requestedSeat)||requestedSeat<1||requestedSeat>3)throw Error("INVALID_SEAT");if(room.seats[requestedSeat]!==null)throw Error("SEAT_OCCUPIED");}\n    for (const seat of requestedSeat===undefined?open:[requestedSeat]) {')
s=s.replace('return json(await this.service.fillOpenSeatsWithBots(this.roomKey, token));', 'const body=await request.json();return json(await this.service.fillOpenSeatsWithBots(this.roomKey, token,body.seat));')
s=s.replace('async closeTable(roomId, token)', 'async setBotSeat(roomId,token,{seat,name,expectedRevision}){const room=await this.#room(roomId);if(this.#authorizedSeat(room,token)!==0)throw Error("HOST_ONLY");if(room.status!=="waiting")throw Error("ROOM_NOT_JOINABLE");if(expectedRevision!==room.revision)throw Error("STALE_REVISION");if(!Number.isInteger(seat)||seat<1||seat>3)throw Error("INVALID_SEAT");const old=room.seats[seat];if(old&&!old.isBot)throw Error("HUMAN_SEAT_RESERVED");if(name===null){room.seats[seat]=null;}else{const pool={"Crow":"crow","Blaze":"blaze","Nix":"nix","Titan":"titan","Pike":"pike","Drift":"drift","Dice":"dice","Anchor":"anchor","Wager":"wager","Hollow":"hollow","Ember":"ember","Vex":"vex","Frost":"frost","Fang":"fang","Halo":"halo","Quill":"quill","Bramble":"bramble","Moss":"moss","Emberlyn":"emberlyn","Cinder":"cinder","Gable":"gable","Thistle":"thistle","Marrow":"marrow","Pebble":"pebble","Rookery":"rookery","Sable":"sable","Finch":"finch","Dagger":"dagger","Willow":"willow","Hearth":"hearth","Grit":"grit","Copper":"copper","Moth":"moth","Brandy":"brandy","Flint":"flint","Ivy":"ivy","Shade":"shade","Barrel":"barrel","Spark":"spark","Nettle":"nettle","Cobalt":"cobalt","Ash":"ash","Harrier":"harrier","Claire":"claire","June":"june","Tess":"tess","Marcus":"marcus","Owen":"owen","Daniel":"daniel","Sofia":"sofia","Rafael":"rafael","Samir":"samir","Jerome":"jerome_founder","Rita":"rita"};const avatar=pool[name];if(!Object.prototype.hasOwnProperty.call(pool,name))throw Error("INVALID_BOT");if(room.seats.some((p,i)=>i!==seat&&p&&(p.avatar===avatar||p.displayName===name)))throw Error("BOT_ALREADY_SEATED");room.seats[seat]={playerId:`private-test-bot-${seat}`,displayName:name,avatar,isBot:true,token:null};}room.revision++;room.lastActivityAt=Date.now();await this.storage.put(roomId,room);return this.snapshot(roomId,token);}\n  async closeTable(roomId, token)')
s=s.replace('join|snapshot|ws-ticket|ws|close|', 'join|snapshot|ws-ticket|ws|close|bot-seat|')
s=s.replace('      if (request.method === "POST" && url.pathname === "/close")', '      if(request.method==="POST"&&url.pathname==="/bot-seat")return json(await this.service.setBotSeat(this.roomKey,token,await request.json()));\n      if (request.method === "POST" && url.pathname === "/close")')
# Persist opening acknowledgments so bots/humans cannot bid ahead of the native presentation.
s='function beginCloudOpening(room) {room.opening={handNumber:room.gameState.handNumber,notBefore:Date.now()+3500,expiresAt:Date.now()+25000,readySeats:[]};}\n'+s
s=s.replace('room.status = "playing";\n    room.revision += 1;', 'room.status = "playing";\n    beginCloudOpening(room);\n    room.revision += 1;')
s=s.replace('async closeTable(roomId, token)', 'async readyForBidding(roomId, token, handNumber) {const room=await this.#room(roomId);const seat=this.#authorizedSeat(room,token);if(room.gameState?.handNumber!==handNumber)throw Error("STALE_DEAL");if(room.opening&&!room.opening.readySeats.includes(seat)){room.opening.readySeats.push(seat);await this.storage.put(roomId,room);}await this.#driveBots(roomId);return this.#gameSnapshot(await this.#room(roomId),token);}\n  async closeTable(roomId, token)')
s=s.replace('      ...playerView(room.gameState, seat),', '      ...playerView(room.gameState, seat),\n      phase:room.opening?"dealing":room.gameState.phase,\n      opening:room.opening?{handNumber:room.opening.handNumber,minimumRemainingMs:Math.max(0,room.opening.notBefore-Date.now()),deadlineRemainingMs:Math.max(0,room.opening.expiresAt-Date.now())}:null,')
s=s.replace('    if (action.expectedRevision !== room.revision)', '    if(room.opening)throw Error("DEAL_IN_PROGRESS");\n    if (action.expectedRevision !== room.revision)')
s=s.replace('    room.gameState = result.state;\n    room.revision += 1;', '    room.gameState = result.state;\n    if((type==="next-hand"||type==="redeal")&&room.gameState.phase==="bidding")beginCloudOpening(room);\n    room.revision += 1;',1)
s=s.replace('      const state = room.gameState;\n      if (room.status', '      if(room.opening){const o=room.opening;const allReady=room.seats.every((seat,index)=>seat.isBot||o.readySeats.includes(index));if(Date.now()<o.notBefore||(!allReady&&Date.now()<o.expiresAt))return;delete room.opening;room.revision++;await this.storage.put(roomId,room);}\n      const state = room.gameState;\n      if (room.status')
s=s.replace('    "ROOM_EXISTS",', '    "ROOM_EXISTS", "DEAL_IN_PROGRESS", "STALE_DEAL",')
s=s.replace('      if (request.method === "POST" && url.pathname === "/close")', '      if(request.method==="POST"&&url.pathname==="/ready"){const body=await request.json();return json(await this.service.readyForBidding(this.roomKey,token,body.handNumber));}\n      if (request.method === "POST" && url.pathname === "/close")')
s=s.replace('join|snapshot|ws-ticket|ws|close|', 'join|snapshot|ws-ticket|ws|close|ready|')
s=s.replace('        let status;\n        try {\n          status = (await response.clone().json()).status;', '        let status, opening;\n        try {\n          const view=await response.clone().json();status=view.status;opening=view.opening;')
s=s.replace('const delay = status === "complete" ? COMPLETED_ROOM_GRACE_MS : IDLE_ROOM_MS;', 'const savedRoom=await this.ctx.storage.get(this.roomKey);const pendingOpening=savedRoom?.status==="playing"?savedRoom.opening:null;const delay = pendingOpening?Math.max(1,pendingOpening.expiresAt-Date.now()):status === "complete" ? COMPLETED_ROOM_GRACE_MS : IDLE_ROOM_MS;')
s=s.replace('      const room = await this.ctx.storage.get(this.roomKey);\n      if (!room) {', '      let room = await this.ctx.storage.get(this.roomKey);\n      if(room?.status==="playing"&&room.opening){await this.service.snapshot(this.roomKey,room.seats.find(p=>p&&!p.isBot).token);await this.#broadcastSnapshots();room=await this.ctx.storage.get(this.roomKey);}\n      if (!room) {')
# Server-clock pacing: each bot auction decision gets its own alarm-backed turn.
s=s.replace('      const action = chooseTestBotAction(state, seat);', '      if(state.phase==="bidding"){const key=`${state.handNumber}:${room.revision}:${seat}`;if(room.botTurn?.key!==key){room.botTurn={key,due:Date.now()+1600};await this.storage.put(roomId,room);return;}if(Date.now()<room.botTurn.due)return;delete room.botTurn;}\n      const action = chooseTestBotAction(state, seat);')
s=s.replace('const delay = pendingOpening?Math.max(1,pendingOpening.expiresAt-Date.now()):status === "complete"', 'const pendingBot=savedRoom?.status==="playing"&&savedRoom.gameState?.phase==="bidding"?savedRoom.botTurn:null;const delay = pendingOpening?Math.max(1,pendingOpening.expiresAt-Date.now()):pendingBot?Math.max(1,pendingBot.due-Date.now()):status === "complete"')
s=s.replace('room?.status==="playing"&&room.opening', 'room?.status==="playing"&&(room.opening||room.botTurn)')
s=s.replace('await this.ctx.storage.setAlarm(Math.max(Date.now() + 6e4, room.lastActivityAt + IDLE_ROOM_MS));', 'const due=room.status==="playing"?(room.opening?.expiresAt||room.botTurn?.due):null;await this.ctx.storage.setAlarm(due?Math.max(Date.now()+1,due):Math.max(Date.now()+6e4,room.lastActivityAt+IDLE_ROOM_MS));')
# Trump ceremony is a persisted server hold; bot decisions never batch past it.
s='function beginCloudTrump(room){room.trumpOpening={handNumber:room.gameState.handNumber,expiresAt:Date.now()+2800};}\n'+s
s=s.replace('    if(room.opening)throw Error("DEAL_IN_PROGRESS");', '    if(room.opening)throw Error("DEAL_IN_PROGRESS");\n    if(room.trumpOpening&&Date.now()<room.trumpOpening.expiresAt)throw Error("TRUMP_IN_PROGRESS");')
s=s.replace('    room.gameState = result.state;', '    if(room.gameState.phase==="trump"&&result.state.phase==="play")beginCloudTrump(room);\n    room.gameState = result.state;')
s=s.replace('      const state = room.gameState;', '      if(room.trumpOpening){if(Date.now()<room.trumpOpening.expiresAt)return;delete room.trumpOpening;room.revision++;await this.storage.put(roomId,room); }\n      const state = room.gameState;')
s=s.replace('if(state.phase==="bidding"){const key=', 'if(["bidding","discard","trump","play"].includes(state.phase)){const key=')
s=s.replace('due:Date.now()+1600', 'due:Date.now()+(state.phase==="bidding"?1600:1200)')
s=s.replace('      opening:room.opening?', '      trumpOpening:room.trumpOpening?{handNumber:room.trumpOpening.handNumber,remainingMs:Math.max(0,room.trumpOpening.expiresAt-Date.now())}:null,\n      opening:room.opening?')
s=s.replace('savedRoom.gameState?.phase==="bidding"?', 'savedRoom.gameState?')
s=s.replace('const delay = pendingOpening?', 'const pendingTrump=savedRoom?.status==="playing"?savedRoom.trumpOpening:null;const delay = pendingTrump?Math.max(1,pendingTrump.expiresAt-Date.now()):pendingOpening?')
s=s.replace('(room.opening||room.botTurn)', '(room.opening||room.trumpOpening||room.botTurn)')
s=s.replace('(room.opening?.expiresAt||room.botTurn?.due)', '(room.opening?.expiresAt||room.trumpOpening?.expiresAt||room.botTurn?.due)')
s=s.replace('"ROOM_EXISTS", "DEAL_IN_PROGRESS", "STALE_DEAL",', '"ROOM_EXISTS", "DEAL_IN_PROGRESS", "STALE_DEAL", "TRUMP_IN_PROGRESS",')
s='function beginCloudCollection(room,result){const before=room.gameState,after=result.state;if(!["trick-complete","hand-complete"].includes(result.event)||before.trick?.length!==3)return;const seat=before.currentPlayer,removed=before.hands[seat].filter(c=>!after.hands[seat].some(x=>x.id===c.id));if(removed.length!==1)return;const trick=[...before.trick,{player:seat,card:removed[0]}],winner=after.lastTrickWinner,winning=trick.find(p=>p.player===winner)?.card,bird=winning?.id==="rook"&&trick.some(p=>p.card.id==="red-2"),points=trick.reduce((n,p)=>n+cardPoints(p.card,before.settings.rules),0);room.trickOpening={trick,winner,ledColor:before.ledColor,points,scores:before.scores,bird,expiresAt:Date.now()+(bird?6200:3600)};room.recentTricks=[{plays:trick,winner,ledColor:before.ledColor,trump:before.trump,points,team:winner%2,winnerName:before.players[winner]?.name,hand:before.handNumber},...(room.recentTricks||[])].slice(0,3);}\n'+s
s=s.replace('    room.gameState = result.state;', '    beginCloudCollection(room,result);\n    room.gameState = result.state;')
s=s.replace('if (room.gameState.phase === "complete") room.status = "complete";', 'if (room.gameState.phase === "complete"&&!room.trickOpening) room.status = "complete";')
s=s.replace('    if(room.opening)throw Error("DEAL_IN_PROGRESS");', '    if(room.trickOpening&&Date.now()<room.trickOpening.expiresAt)throw Error("TRICK_IN_PROGRESS");\n    if(room.opening)throw Error("DEAL_IN_PROGRESS");')
s=s.replace('      const state = room.gameState;', '      if(room.trickOpening){if(Date.now()<room.trickOpening.expiresAt)return;delete room.trickOpening;room.revision++;if(room.gameState.phase==="complete")room.status="complete";await this.storage.put(roomId,room); }\n      const state = room.gameState;')
s=s.replace('phase:room.opening?"dealing":room.gameState.phase,', 'phase:room.trickOpening?"play":room.opening?"dealing":room.gameState.phase,\n      ...(room.trickOpening?{trick:clone2(room.trickOpening.trick),ledColor:room.trickOpening.ledColor,lastTrickWinner:room.trickOpening.winner,currentPlayer:room.trickOpening.winner,resolvingTrick:true,resolvingTrickPoints:room.trickOpening.points,scores:room.trickOpening.scores,lastSummary:null,matchResult:null,nestCards:null,canClaimRemaining:false}:{}),\n      recentTricks:clone2(room.recentTricks||[]),')
s=s.replace('const delay = pendingTrump?', 'const pendingTrick=savedRoom?.trickOpening;const delay = pendingTrick?Math.max(1,pendingTrick.expiresAt-Date.now()):pendingTrump?')
s=s.replace('(room.opening||room.trumpOpening||room.botTurn)', '(room.opening||room.trumpOpening||room.trickOpening||room.botTurn)')
s=s.replace('(room.opening?.expiresAt||room.trumpOpening?.expiresAt||room.botTurn?.due)', '(room.trickOpening?.expiresAt||room.opening?.expiresAt||room.trumpOpening?.expiresAt||room.botTurn?.due)')
s=s.replace('"TRUMP_IN_PROGRESS",','"TRUMP_IN_PROGRESS", "TRICK_IN_PROGRESS",')
(root/'cloudflare/live/worker-live.mjs').write_text(s)
