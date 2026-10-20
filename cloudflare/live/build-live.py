from pathlib import Path
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
(root/'cloudflare/live/worker-live.mjs').write_text(s)
