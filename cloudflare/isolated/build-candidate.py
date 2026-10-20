from pathlib import Path
import json
root=Path(__file__).resolve().parents[2]
s=(root/'cloudflare/isolated/tests/deployed-worker.snapshot.mjs').read_text()
old='''    if (isMoonBid && Number(options.scores?.[team] || 0) < 0) {
      return { accepted: false, reason: "MOON_BID_NOT_ALLOWED", state: input };
    }
'''
assert old in s;s=s.replace(old,'')
s=s.replace('async create(roomId, hostId, displayName)', 'async create(roomId, hostId, displayName, avatar = "cinder", voice = "avatar")')
s=s.replace('playerId: hostId, displayName, token', 'playerId: hostId, displayName, token, avatar: safeAvatar(avatar), voice: safeVoice(voice)')
s=s.replace('async join(roomId, playerId, displayName, resumeToken = null)', 'async join(roomId, playerId, displayName, resumeToken = null, avatar = "dagger", voice = "avatar")')
s=s.replace('{ playerId, displayName, token }','{ playerId, displayName, token, avatar: safeAvatar(avatar), voice: safeVoice(voice) }')
s=s.replace('''        isBot: true
      };''','''        isBot: true,
        avatar: ["cinder", "dagger", "crow", "blaze"][seat]
      };''')
s=s.replace('isBot: entry.isBot === true\n    })), options)', 'isBot: entry.isBot === true,\n      avatar: entry.avatar, voice: entry.voice\n    })), options)')
s=s.replace('isBot: player.isBot === true\n    })),', 'isBot: player.isBot === true,\n      avatar: player.avatar, voice: player.voice\n    })),')
s=s.replace('state.players.map(({ seat: playerSeat, name, team, isBot }) => ({ seat: playerSeat, name, team, isBot: !!isBot }))','state.players.map(({ seat: playerSeat, name, team, isBot, avatar, voice }) => ({ seat: playerSeat, name, team, isBot: !!isBot, avatar, voice }))')
s=s.replace('isBot: player?.isBot === true\n        }))','isBot: player?.isBot === true,\n          avatar: player?.avatar, voice: player?.voice\n        }))')
s=s.replace('body.playerId, body.displayName), 201)', 'body.playerId, body.displayName, body.avatar, body.voice), 201)')
s=s.replace('body.playerId, body.displayName, body.resumeToken), 201)', 'body.playerId, body.displayName, body.resumeToken, body.avatar, body.voice), 201)')
# Allowlist actual approved asset identifiers; no arbitrary URLs in player metadata.
ids=sorted(p.name.removesuffix('-portrait.webp') for p in (root/'assets/characters077').rglob('*-portrait.webp'))
s=s.replace('// ../server/room-service.mjs', '// ../server/room-service.mjs')
s=s.replace('return json(await this.service.startGame(this.roomKey, token));', 'const body = await request.json(); return json(await this.service.startGame(this.roomKey, token, safeOptions(body.options)));')
s=s.replace('targetScore: state.settings.targetScore,', 'targetScore: state.settings.targetScore, rules: state.settings.rules, revealTopNest: state.settings.revealTopNest, shotTheMoon: !!state.shotTheMoon, shootMoonEnabled: state.settings.shootMoonEnabled,')
s=s.replace('(game) => startNextHand(game)', '(game, seat) => seat === 0 ? startNextHand(game) : {accepted:false,reason:"HOST_ONLY"}')
s='function safeVoice(v) { return ["avatar","male","female","silent"].includes(v) ? v : "avatar"; }\nfunction safeOptions(o = {}) { const targetScore = o.targetScore ?? 500; if (!Number.isInteger(targetScore) || targetScore < 1 || targetScore > 2000) throw Error("INVALID_TARGET_SCORE"); const result = {targetScore}; for (const k of ["includeRed2","revealTopNest","shootMoonEnabled"]) { if (o[k] !== undefined) { if (typeof o[k] !== "boolean") throw Error("INVALID_OPTIONS"); result[k] = o[k]; } } return result; }\n'+s
s='const CLOUD_AVATARS = new Set('+json.dumps(ids)+');\nfunction safeAvatar(value) { return typeof value === "string" && CLOUD_AVATARS.has(value) ? value : "cinder"; }\n'+s
start=s.index('var CLOUD_GAME_ADAPTER = ');end=s.index('\n// worker.mjs\nvar IDLE_ROOM_MS',start)
s=s[:start]+'var CLOUD_GAME_ADAPTER = '+json.dumps((root/'cloudflare/isolated/846-cloud-game-adapter-candidate.js').read_text())+';\n'+s[end:]
# Pin the private candidate to the inspected complete game; never follow moving Pages root.
s=s.replace('https://jeromeleegriffin.github.io/Test/', 'https://raw.githubusercontent.com/jeromeleegriffin/Test/b3f3928548bc79df5169165b953e458cc68ddc09/')
s=s.replace('headers.set("cache-control", "public, max-age=300");', 'const mime = {js:"text/javascript",css:"text/css",html:"text/html",json:"application/json",svg:"image/svg+xml",webp:"image/webp",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",mp3:"audio/mpeg",ogg:"audio/ogg",wav:"audio/wav",woff2:"font/woff2",wasm:"application/wasm"}[rawAssetPath.split(".").pop().toLowerCase()]; if (mime) headers.set("content-type", mime); headers.set("cache-control", "public, max-age=300");')
s=s.replace('    "INVALID_BID",\n', '    "INVALID_BID", "INVALID_OPTIONS", "INVALID_TARGET_SCORE",\n')
(root/'cloudflare/isolated/worker-candidate.mjs').write_text(s)
