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
(root/'cloudflare/live/worker-live.mjs').write_text(s)
