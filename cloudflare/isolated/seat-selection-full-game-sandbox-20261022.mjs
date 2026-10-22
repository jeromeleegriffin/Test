
import { DurableObject } from "cloudflare:workers";
const __name=(f)=>f;
function validateIdentity(id,name) {if(typeof id!=="string"||!id.trim()||id.length>128)throw Error("INVALID_PLAYER_ID");if(typeof name!=="string"||!name.trim()||name.length>40)throw Error("INVALID_DISPLAY_NAME");}
const safeAvatar=(name)=> typeof name==="string" && /^[a-z0-9_]{2,40}$/.test(name) ? name : "dagger";
const safeVoice=(name)=> ["avatar","male","female","silent"].includes(name) ? name : "avatar";

var RoomService = class {
  static {
    __name(this, "RoomService");
  }
  constructor(storage, { tokenFactory = /* @__PURE__ */ __name(() => crypto.randomUUID(), "tokenFactory") } = {}) {
    this.storage = storage;
    this.tokenFactory = tokenFactory;
  }
  async create(roomId, hostId, displayName, avatar = "cinder", voice = "avatar", pace = 1) {
    if(![1,3,99].includes(pace))throw Error("INVALID_PACE");
    validateIdentity(hostId, displayName);
    if (await this.storage.get(roomId)) throw new Error("ROOM_EXISTS");
    const token = this.tokenFactory();
    const room = {
      id: roomId, pace,
      status: "waiting",
      revision: 0,
      createdAt: Date.now(),
      lastActivityAt: Date.now(),
      seats: [
        { playerId: hostId, displayName, token, avatar: safeAvatar(avatar), voice: safeVoice(voice) },
        null,
        null,
        null
      ],
      hands: null,
      turn: 0,
      plays: [],
      actions: {}
    };
    await this.storage.put(roomId, room);
    return { roomId, seat: 0, token };
  }
  async join(roomId, playerId, displayName, resumeToken = null, avatar = "dagger", voice = "avatar", preferredSeat = undefined) {
    validateIdentity(playerId, displayName);
    const room = await this.#room(roomId);
    const existing = room.seats.findIndex((seat2) => seat2?.playerId === playerId);
    if (existing >= 0) {
      const existingToken = room.seats[existing].token;
      if (typeof resumeToken !== "string" || resumeToken !== existingToken) throw new Error("PLAYER_ALREADY_SEATED");
      return { roomId, seat: existing, token: existingToken };
    }
    if (room.status !== "waiting") throw new Error("ROOM_NOT_JOINABLE");
    // An explicit choice is honored atomically inside this Durable Object.
    // Returning players always reclaim their own seat above, regardless of preference.
    let seat;
    if (preferredSeat !== undefined && preferredSeat !== null) {
      if (!Number.isInteger(preferredSeat) || preferredSeat < 1 || preferredSeat > 3) throw new Error("INVALID_SEAT");
      const occupant = room.seats[preferredSeat];
      const replaceableBot = !!occupant?.isBot && occupant.token === null && !room.gameState && !room.hands;
      if (occupant && !replaceableBot) throw new Error("SEAT_OCCUPIED");
      seat = preferredSeat;
    } else {
      seat = room.seats.findIndex((entry) => entry === null);
      if (seat < 0 && !room.gameState && !room.hands) {
        seat = room.seats.findIndex((entry) => entry?.isBot === true && entry.token === null);
      }
      if (seat < 0) throw new Error("ROOM_FULL");
    }
    const token = this.tokenFactory();
    room.seats[seat] = { playerId, displayName, token, avatar: safeAvatar(avatar), voice: safeVoice(voice) };
    room.lastActivityAt = Date.now();
    room.revision += 1;
    await this.storage.put(roomId, room);
    return { roomId, seat, token };
  }
  async fillOpenSeatsWithBots(roomId, token, requestedSeat) {
    const room = await this.#room(roomId);
    const hostSeat = this.#authorizedSeat(room, token);
    if (hostSeat !== 0) throw new Error("HOST_ONLY");
    if (room.status !== "waiting") throw new Error("ROOM_NOT_JOINABLE");
    
    const open = room.seats.map((entry, seat) => entry === null ? seat : -1).filter((seat) => seat >= 0);
    if (!open.length) return this.snapshot(roomId, token);
    if(requestedSeat!==undefined){if(!Number.isInteger(requestedSeat)||requestedSeat<1||requestedSeat>3)throw Error("INVALID_SEAT");if(room.seats[requestedSeat]!==null)throw Error("SEAT_OCCUPIED");}
    for (const seat of requestedSeat===undefined?open:[requestedSeat]) {
      room.seats[seat] = {
        playerId: `private-test-bot-${seat}`,
        displayName: `Test Bot ${seat + 1}`,
        token: null,
        isBot: true,
        avatar: ["cinder", "dagger", "crow", "blaze"][seat]
      };
    }
    room.lastActivityAt = Date.now();
    room.revision += 1;
    await this.storage.put(roomId, room);
    return this.snapshot(roomId, token);
  }
  // handsBySeat is a controlled test fixture, not a real shuffle/deal.
  async startFixtureGame(roomId, token, handsBySeat) {
    const room = await this.#room(roomId);
    const seat = this.#authorizedSeat(room, token);
    if (seat !== 0) throw new Error("HOST_ONLY");
    if (room.status !== "waiting" || room.seats.some((entry) => entry === null)) {
      throw new Error("FOUR_PLAYERS_REQUIRED");
    }
    if (!Array.isArray(handsBySeat) || handsBySeat.length !== 4 || handsBySeat.some((hand) => !Array.isArray(hand))) {
      throw new Error("INVALID_FIXTURE_HANDS");
    }
    room.hands = clone2(handsBySeat);
    room.status = "playing";
    room.turn = 0;
    room.revision += 1;
    room.lastActivityAt = Date.now();
    await this.storage.put(roomId, room);
    return this.snapshot(roomId, token);
  }
  async startGame(roomId, token, options = {}) {
    const room = await this.#room(roomId);
    const seat = this.#authorizedSeat(room, token);
    if (seat !== 0) throw new Error("HOST_ONLY");
    if (room.status !== "waiting" || room.seats.some((entry) => entry === null)) {
      throw new Error("FOUR_PLAYERS_REQUIRED");
    }
    room.gameState = createMatch(room.seats.map((entry) => ({
      playerId: entry.playerId,
      name: entry.displayName,
      isBot: entry.isBot === true,
      avatar: entry.avatar, voice: entry.voice
    })), options);
    room.status = "playing";
    beginCloudOpening(room);
    room.revision += 1;
    room.lastActivityAt = Date.now();
    await this.storage.put(roomId, room);
    await this.#driveBots(roomId);
    return this.#gameSnapshot(await this.#room(roomId), token);
  }
  async bid(roomId, token, action) {
    return this.#applyGameAction(roomId, token, action, "bid", (game, seat, value) => submitBid(game, seat, value), action?.value);
  }
  async discard(roomId, token, action) {
    return this.#applyGameAction(roomId, token, action, "discard", (game, seat, cardIds) => discardCards(game, seat, cardIds), action?.cardIds);
  }
  async chooseTrump(roomId, token, action) {
    return this.#applyGameAction(roomId, token, action, "trump", (game, seat, color) => chooseTrump(game, seat, color), action?.color);
  }
  async playCard(roomId, token, action) {
    return this.#applyGameAction(roomId, token, action, "play", (game, seat, cardId) => playCard(game, seat, cardId), action?.cardId);
  }
  async claimRemainingCards(roomId, token, action) {
    return this.#applyGameAction(roomId, token, action, "claim", (game, seat) => claimRemainingCards(game, seat), null);
  }
  async declineRemainingClaim(roomId, token, action) {
    return this.#applyGameAction(roomId, token, action, "decline-claim", (game, seat) => declineRemainingClaim(game, seat), null);
  }
  async startNextHand(roomId, token, action) {
    return this.#applyGameAction(roomId, token, action, "next-hand", (game, seat) => seat === 0 ? startNextHand(game) : {accepted:false,reason:"HOST_ONLY"}, null);
  }
  async redeal(roomId, token, action) {
    return this.#applyGameAction(roomId, token, action, "redeal", (game) => redeal(game), null);
  }
  async playFixtureCard(roomId, token, { actionId, expectedRevision, cardId }) {
    const room = await this.#room(roomId);
    const seat = this.#authorizedSeat(room, token);
    if (typeof actionId !== "string" || !actionId) throw new Error("ACTION_ID_REQUIRED");
    const previous = room.actions[actionId];
    if (previous) {
      if (previous.seat !== seat) throw new Error("ACTION_ID_REUSED");
      return { ...clone2(previous.result), duplicate: true };
    }
    if (room.status !== "playing") throw new Error("GAME_NOT_PLAYING");
    if (expectedRevision !== room.revision) throw new Error("STALE_REVISION");
    if (room.turn !== seat) throw new Error("NOT_YOUR_TURN");
    const hand = room.hands[seat];
    const cardIndex = hand.indexOf(cardId);
    if (cardIndex < 0) throw new Error("CARD_NOT_IN_YOUR_HAND");
    hand.splice(cardIndex, 1);
    room.plays.push({ seat, cardId });
    room.turn = (seat + 1) % 4;
    room.revision += 1;
    room.lastActivityAt = Date.now();
    if (room.hands.every((cards) => cards.length === 0)) room.status = "complete";
    const result = { accepted: true, revision: room.revision, status: room.status };
    room.actions[actionId] = { seat, result };
    await this.storage.put(roomId, room);
    return result;
  }
  async seatOptions(roomId) {
    const room = await this.#room(roomId);
    return {
      roomCode: room.id,
      revision: room.revision,
      phase: room.status,
      seats: room.seats.map((p, seat) => ({
        seat,
        team: seat % 2,
        name: p?.displayName || null,
        occupied: !!p,
        isBot: p?.isBot === true,
        joinable: seat > 0 && room.status === "waiting" &&
          (!p || (p.isBot === true && p.token === null && !room.gameState && !room.hands))
      }))
    };
  }
  async snapshot(roomId, token) {
    let room = await this.#room(roomId);
    this.#authorizedSeat(room, token);
    // Resume a persisted bot turn if an earlier request ended after saving it.
    await this.#driveBots(roomId);
    room = await this.#room(roomId);
    if (room.gameState) return this.#gameSnapshot(room, token);
    const seat = this.#authorizedSeat(room, token);
    if (room.status === "waiting") {
      return {
        phase: "waiting",
        pace:room.pace||1,
      roomId: room.id,
        status: room.status,
        revision: room.revision,
        handNumber: 0,
        players: room.seats.map((player, index) => ({
          seat: index,
          name: player?.displayName ?? "Open seat",
          team: index % 2,
          occupied: !!player,
          isBot: player?.isBot === true,
          avatar: player?.avatar, voice: player?.voice
        })),
        occupiedSeats: room.seats.map((player, index) => player ? index : null).filter((index) => index !== null),
        dealer: null,
        currentPlayer: 0,
        hand: [],
        handCounts: [0, 0, 0, 0],
        bid: null,
        highestBid: null,
        bidder: null,
        passCount: 0,
        trump: null,
        trick: [],
        ledColor: null,
        scores: [0, 0],
        targetScore: 500,
        discardCount: null,
        nestCount: 0,
        lastSummary: null,
        matchResult: null,
        canClaimRemaining: false
      };
    }
    return {
      pace:room.pace||1,
      roomId: room.id,
      status: room.status,
      revision: room.revision,
      turn: room.turn,
      players: room.seats.map((player, index) => player && {
        seat: index,
        displayName: player.displayName,
        occupied: true
      }),
      plays: clone2(room.plays),
      hand: room.hands ? clone2(room.hands[seat]) : null
    };
  }
  async seatForToken(roomId, token) {
    const room = await this.#room(roomId);
    return this.#authorizedSeat(room, token);
  }
  async setBotSeat(roomId,token,{seat,name,expectedRevision}){const room=await this.#room(roomId);if(this.#authorizedSeat(room,token)!==0)throw Error("HOST_ONLY");if(room.status!=="waiting")throw Error("ROOM_NOT_JOINABLE");if(expectedRevision!==room.revision)throw Error("STALE_REVISION");if(!Number.isInteger(seat)||seat<1||seat>3)throw Error("INVALID_SEAT");const old=room.seats[seat];if(old&&!old.isBot)throw Error("HUMAN_SEAT_RESERVED");if(name===null){room.seats[seat]=null;}else{const pool={"Crow":"crow","Blaze":"blaze","Nix":"nix","Titan":"titan","Pike":"pike","Drift":"drift","Dice":"dice","Anchor":"anchor","Wager":"wager","Hollow":"hollow","Ember":"ember","Vex":"vex","Frost":"frost","Fang":"fang","Halo":"halo","Quill":"quill","Bramble":"bramble","Moss":"moss","Emberlyn":"emberlyn","Cinder":"cinder","Gable":"gable","Thistle":"thistle","Marrow":"marrow","Pebble":"pebble","Rookery":"rookery","Sable":"sable","Finch":"finch","Dagger":"dagger","Willow":"willow","Hearth":"hearth","Grit":"grit","Copper":"copper","Moth":"moth","Brandy":"brandy","Flint":"flint","Ivy":"ivy","Shade":"shade","Barrel":"barrel","Spark":"spark","Nettle":"nettle","Cobalt":"cobalt","Ash":"ash","Harrier":"harrier","Claire":"claire","June":"june","Tess":"tess","Marcus":"marcus","Owen":"owen","Daniel":"daniel","Sofia":"sofia","Rafael":"rafael","Samir":"samir","Jerome":"jerome_founder","Rita":"rita"};const avatar=pool[name];if(!Object.prototype.hasOwnProperty.call(pool,name))throw Error("INVALID_BOT");if(room.seats.some((p,i)=>i!==seat&&p&&(p.avatar===avatar||p.displayName===name)))throw Error("BOT_ALREADY_SEATED");room.seats[seat]={playerId:`private-test-bot-${seat}`,displayName:name,avatar,isBot:true,token:null};}room.revision++;room.lastActivityAt=Date.now();await this.storage.put(roomId,room);return this.snapshot(roomId,token);}
  async readyForBidding(roomId, token, handNumber, openingId) {const room=await this.#room(roomId);const seat=this.#authorizedSeat(room,token);if(room.gameState?.handNumber!==handNumber)throw Error("STALE_DEAL");if(openingId&&room.opening&&openingId!==room.opening.id)throw Error("STALE_DEAL");if(room.opening&&!room.opening.readySeats.includes(seat)){room.opening.readySeats.push(seat);await this.storage.put(roomId,room);}await this.#driveBots(roomId);return this.#gameSnapshot(await this.#room(roomId),token);}
  async setPace(roomId,token,pace){const room=await this.#room(roomId);if(this.#authorizedSeat(room,token)!==0)throw Error("HOST_ONLY");if(![1,3,99].includes(pace))throw Error("INVALID_PACE");if(room.pace!==pace){room.pace=pace;room.revision++;room.lastActivityAt=Date.now();delete room.botTurn;await this.storage.put(roomId,room);}await this.#driveBots(roomId);return this.snapshot(roomId,token);}
  async closeTable(roomId, token) { const room=await this.storage.get(roomId); if(!room)throw Error("ROOM_NOT_FOUND"); if(this.#authorizedSeat(room,token)!==0)throw Error("HOST_ONLY"); if(room.status!=="closed"){room.status="closed";room.closedAt=Date.now();room.lastActivityAt=Date.now();room.revision++;await this.storage.put(roomId,room);}return {status:"closed"}; }
  async cleanup(roomId, { now = Date.now(), maxIdleMs = 60 * 60 * 1e3 } = {}) {
    const room = await this.storage.get(roomId);
    if (!room) return false;
    const expired = now - room.lastActivityAt >= maxIdleMs;
    if (room.status === "complete" || expired) {
      await this.storage.delete(roomId);
      return true;
    }
    return false;
  }
  async #room(roomId) {
    const room = await this.storage.get(roomId);
    if (!room) throw new Error("ROOM_NOT_FOUND");
    if(room.status==="closed")throw Error("ROOM_CLOSED");
    return room;
  }
  #authorizedSeat(room, token) {
    if (typeof token !== "string" || !token.trim()) throw new Error("UNAUTHORIZED");
    const seat = room.seats.findIndex((entry) => entry && !entry.isBot && entry.token === token);
    if (seat < 0) throw new Error("UNAUTHORIZED");
    return seat;
  }
  #gameSnapshot(room, token) {
    const seat = this.#authorizedSeat(room, token);
    return {
      ...playerView(room.gameState, seat),
      botIntelligence: onlineX1Proof(room),
      phase:room.claimOpening?"play":room.trickOpening?"play":room.opening?"dealing":room.gameState.phase,
      ...(room.trickOpening?{trick:clone2(room.trickOpening.trick),ledColor:room.trickOpening.ledColor,lastTrickWinner:room.trickOpening.winner,currentPlayer:room.trickOpening.winner,resolvingTrick:true,resolvingTrickPoints:room.trickOpening.points,scores:room.trickOpening.scores,lastSummary:null,matchResult:null,nestCards:null,canClaimRemaining:false}:{}),
      ...(room.claimOpening?{claimAnimation:{player:room.claimOpening.player,cards:clone2(room.claimOpening.cards),reason:room.claimOpening.reason},resolvingTrick:true,resolvingTrickPoints:0,canClaimRemaining:false,scores:room.claimOpening.scores,lastSummary:null,matchResult:null,nestCards:null}:{}),
      claimDeclined:!!room.gameState.claimDeclined,
      recentTricks:clone2(room.recentTricks||[]),
      trumpPresentationMs:room.trumpOpening?.durationMs||cloudStampDuration(room),
      trumpOpening:room.trumpOpening?{handNumber:room.trumpOpening.handNumber,remainingMs:Math.max(0,room.trumpOpening.expiresAt-Date.now())}:null,
      opening:room.opening?{id:room.opening.id,handNumber:room.opening.handNumber,minimumRemainingMs:Math.max(0,room.opening.notBefore-Date.now()),deadlineRemainingMs:Math.max(0,room.opening.expiresAt-Date.now())}:null,
      pace:room.pace||1,
      roomId: room.id,
      status: room.status,
      revision: room.revision,
      occupiedSeats: room.seats.map((entry, index) => entry ? index : null).filter((index) => index !== null)
    };
  }
  async #applyGameAction(roomId, token, action, type, transition, value) {
    const room = await this.#room(roomId);
    const seat = this.#authorizedSeat(room, token);
    const actionId = action?.actionId;
    if (typeof actionId !== "string" || !actionId) throw new Error("ACTION_ID_REQUIRED");
    const fingerprint = JSON.stringify({ type, seat, expectedRevision: action.expectedRevision, value });
    const previous = room.actions[actionId];
    if (previous) {
      if (previous.seat !== seat || previous.fingerprint !== fingerprint) throw new Error("ACTION_ID_REUSED");
      return { ...clone2(previous.result), duplicate: true };
    }
    if (room.status !== "playing" || !room.gameState) throw new Error("GAME_NOT_PLAYING");
    if(room.claimOpening&&Date.now()<room.claimOpening.expiresAt)throw Error("CLAIM_IN_PROGRESS");
    if(room.trickOpening&&Date.now()<room.trickOpening.expiresAt)throw Error("TRICK_IN_PROGRESS");
    if(room.opening)throw Error("DEAL_IN_PROGRESS");
    if(room.trumpOpening&&Date.now()<room.trumpOpening.expiresAt)throw Error("TRUMP_IN_PROGRESS");
    if (action.expectedRevision !== room.revision) throw new Error("STALE_REVISION");
    const result = transition(room.gameState, seat, value);
    if (!result.accepted) throw new Error(result.reason || "INVALID_ACTION");
    if(room.gameState.phase==="trump"&&result.state.phase==="play")beginCloudTrump(room);
    beginCloudCollection(room,result);
    beginCloudClaim(room,result);
    observeOnlineX1(room, room.gameState, result);
    room.gameState = result.state;
    if((type==="next-hand"||type==="redeal")&&room.gameState.phase==="bidding")beginCloudOpening(room);
    room.revision += 1;
    room.lastActivityAt = Date.now();
    if (room.gameState.phase === "complete"&&!room.trickOpening&&!room.claimOpening) room.status = "complete";
    const response = { accepted: true, event: result.event, revision: room.revision, status: room.status };
    room.actions[actionId] = { seat, fingerprint, result: response };
    await this.storage.put(roomId, room);
    await this.#driveBots(roomId);
    return { ...response, revision: (await this.#room(roomId)).revision };
  }
  async #driveBots(roomId) {
    for (let steps = 0; steps < 500; steps += 1) {
      const room = await this.#room(roomId);
      if(room.opening){const o=room.opening;const allReady=room.seats.every((seat,index)=>seat.isBot||o.readySeats.includes(index));if(Date.now()<o.notBefore||(!allReady&&Date.now()<o.expiresAt))return;delete room.opening;room.revision++;await this.storage.put(roomId,room);}
      if(room.trumpOpening){if(Date.now()<room.trumpOpening.expiresAt)return;delete room.trumpOpening;room.revision++;await this.storage.put(roomId,room); }
      if(room.trickOpening){if(Date.now()<room.trickOpening.expiresAt)return;delete room.trickOpening;room.revision++;if(room.gameState.phase==="complete")room.status="complete";await this.storage.put(roomId,room); }
      if(room.claimOpening){if(Date.now()<room.claimOpening.expiresAt)return;delete room.claimOpening;room.revision++;if(room.gameState.phase==="complete")room.status="complete";await this.storage.put(roomId,room); }
      const state = room.gameState;
      if (room.status !== "playing" || !state || !["bidding", "discard", "trump", "play"].includes(state.phase)) return;
      const seat = state.currentPlayer;
      if (!room.seats[seat]?.isBot) return;
      if(["bidding","discard","trump","play"].includes(state.phase)){const key=`${state.handNumber}:${room.revision}:${seat}`;if(room.botTurn?.key!==key){room.botTurn={key,due:Date.now()+cloudDelay(room,state.phase==="bidding"?1600:1200,state.phase==="bidding"?160:120)};await this.storage.put(roomId,room);return;}if(Date.now()<room.botTurn.due)return;delete room.botTurn;}
      const decision = chooseOnlineBotAction(room, seat);
      const action = decision.action;
      if (!action) return;
      let result;
      if (action.type === "bid") result = submitBid(state, seat, action.value);
      else if (action.type === "discard") result = discardCards(state, seat, action.cardIds);
      else if (action.type === "trump") result = chooseTrump(state, seat, action.color);
      else if (action.type === "play") result = playCard(state, seat, action.cardId);
      else return;
      if (!result.accepted) throw new Error("TEST_BOT_ACTION_REJECTED");
      if(room.gameState.phase==="trump"&&result.state.phase==="play")beginCloudTrump(room);
    beginCloudCollection(room,result);
    beginCloudClaim(room,result);
    observeOnlineX1(room, state, result, decision);
    room.gameState = result.state;
      room.revision += 1;
      room.lastActivityAt = Date.now();
      if (room.gameState.phase === "complete"&&!room.trickOpening&&!room.claimOpening) room.status = "complete";
      await this.storage.put(roomId, room);
    }
    throw new Error("TEST_BOT_ACTION_LIMIT");
  }
};

export class TestRoom extends DurableObject {
 constructor(ctx,env){super(ctx,env);this.svc=new RoomService(ctx.storage);this.queue=Promise.resolve();}
 fetch(request){
  const job=this.queue.then(async()=>{
   const url=new URL(request.url),code=url.searchParams.get("code");
   if(!/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/.test(code||""))return Response.json({error:"INVALID_ROOM_CODE"},{status:400});
   let b={}; if(request.method==="POST"){try{b=await request.json()}catch{return Response.json({error:"INVALID_JSON"},{status:400})}}
   try{
    if(url.pathname==="/create"&&request.method==="POST")return Response.json(await this.svc.create(code,b.playerId,b.displayName,b.avatar,b.voice,b.pace??1),{status:201});
    if(url.pathname==="/seat-options"&&request.method==="GET")return Response.json(await this.svc.seatOptions(code),{headers:{"cache-control":"no-store"}});
    if(url.pathname==="/join"&&request.method==="POST")return Response.json(await this.svc.join(code,b.playerId,b.displayName,b.resumeToken??null,b.avatar,b.voice,b.preferredSeat),{status:201});
    if(url.pathname==="/snapshot"&&request.method==="GET") {
      const bearer=request.headers.get("authorization")||"";
      return Response.json(await this.svc.snapshot(code,bearer.startsWith("Bearer ")?bearer.slice(7):null));
    }
    return Response.json({error:"NOT_AVAILABLE_IN_SEAT_TEST"},{status:404});
   }catch(e){return Response.json({error:e.message},{status:["SEAT_OCCUPIED","ROOM_FULL","ROOM_NOT_JOINABLE","PLAYER_ALREADY_SEATED"].includes(e.message)?409:400})}
  });
  this.queue=job.catch(()=>{});return job;
 }
}


async function qa(env){
const chars="23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const code="Q"+Array.from(crypto.getRandomValues(new Uint8Array(7)),b=>chars[b%chars.length]).join("");
const stub=env.TEST_ROOMS.getByName(code);
async function request(path,b){
 const url="https://room.test/"+path+"?code="+code;
 const r=await stub.fetch(new Request(url,{method:b?"POST":"GET",headers:b?{"content-type":"application/json"}:undefined,body:b?JSON.stringify(b):undefined}));
 const j=await r.json();if(!r.ok)throw Error(j.error);return j;
}
try{
 const host=await request("create",{playerId:"host",displayName:"Host",avatar:"grit"});
 const choices=await request("seat-options");
 const pair=await Promise.allSettled([
  request("join",{playerId:"a",displayName:"Ember",preferredSeat:2,avatar:"ember"}),
  request("join",{playerId:"b",displayName:"Sofia",preferredSeat:2,avatar:"sofia"})
 ]);
 const win=pair.find(x=>x.status==="fulfilled")?.value;
 const error=pair.find(x=>x.status==="rejected")?.reason?.message;
 const state=await request("seat-options");
 const who=state.seats[2].name==="Ember"?"a":"b";
 const resumed=await request("join",{playerId:who,displayName:"Returning",preferredSeat:1,resumeToken:win.token});
 const other=await request("join",{playerId:"c",displayName:"Grit",preferredSeat:3});
 const legacy=await request("join",{playerId:"d",displayName:"Legacy"});
 const snapResponse=await stub.fetch(new Request('https://room.test/snapshot?code='+code,{method:'GET',headers:{authorization:'Bearer '+win.token}}));const snapJSON=await snapResponse.json();
 return Response.json({pass:host.seat===0&&choices.seats.filter(x=>x.joinable).length===3&&error==="SEAT_OCCUPIED"&&resumed.seat===2&&other.seat===3&&legacy.seat===1,code,roomAvailable:choices.seats.map(x=>x.joinable),racedWinner:win.seat,conflict:error,returnSeat:resumed.seat,other:other.seat,oldClient:legacy.seat,snapshotStatus:snapResponse.status,snapshotPhase:snapJSON.phase,snapshotError:snapJSON.error});
}catch(e){return Response.json({pass:false,error:String(e)},{status:500})}
}

const ALTERNATE_ADAPTER=`/*
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
  if (!["846-r10-ambience-levels-20261021","846-r11-human-moon-20261021","846-r12-moon-default-off-20261021"].includes(window.HOR_SCRIPT_BUILD)) {
    const notice = document.getElementById("lobbyStatus");
    if (notice) notice.textContent = "This game version has not been verified for private cloud play. Please wait for the test adapter update.";
    // Fail closed rather than silently falling back to browser-hosted rooms.
    for (const name of ["createRoom", "joinRoom", "startGameWithToast"]) window[name] = () => {};
    document.addEventListener("click", event => {
      if (event.target.closest?.("#friendsToggleBtn,#createBtn,#joinConfirmBtn,#startBtn,#rejoinBtn,#reconnectBtn")) { event.preventDefault(); event.stopImmediatePropagation(); }
    }, true);
    return;
  }

  const native = {};
  for (const name of ["submitBid", "submitDiscard", "submitTrump", "submitPlay", "startGameWithToast", "clientLeaveReplace", "saveSession", "isBotTurn", "scheduleBot", "runBotAction", "horStartHeartbeat", "horBeginClientReconnect", "horRecordCareerHand", "mergeLifetimeStats", "noteHumanAuction", "noteHumanHandEnd", "hostStartNextHand", "hostProcessAllTrumpsClaim", "hostDeclineClaim", "showAllTrumpsClaimUI", "leaveTableAfterConfirmation043", "leaveTableToLobby043", "onWaitSeatClick"])
    native[name] = window[name];
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
  let queuedAction = null;
  let presented = null;
  let lastScoreSignature = "";
  let redealRevision = -1;
  let cloudDealOwner=null, cloudDealTimer=null;
  let cloudAudio = null;

  const status = (message) => {
    const lobby = document.getElementById("lobby");
    const el = lobby && !lobby.classList.contains("hidden")
      ? document.getElementById("lobbyStatus")
      : (document.getElementById("messageArea") || document.getElementById("lobbyStatus"));
    if (el) el.textContent = message;
  };
  const showBotFillStatus = (message, button) => {
    if (button) button.title = message;
    status(message);
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
    if (!response.ok) { if (data.error === "ROOM_CLOSED" && credentials) finishClosedTable(); throw new Error(data.error || ("HTTP_" + response.status)); }
    return data;
  };
  const roomPath = (action = "") => "/rooms/" + encodeURIComponent(credentials.roomCode) + (action ? "/" + action : "");
  const playerIdForSeat = (seat) => "cloud-seat-" + seat;

  function credentialsFrom(result, playerId) {
    sessionStorage.removeItem("ghr-cloud-disconnected");
    presented = null;
    window._horCloudWinnerShown = false;
    window._cloudKittyHand = null;
    credentials = {
      roomCode: result.roomCode || result.roomId,
      seat: Number(result.seat),
      serverRoomId: result.roomId || null,
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
        // Old active room snapshots can still contain test-era bot names.
        // Render the already-selected character without mutating a saved room.
        name: p.isBot === true && /^Test Bot [234]$/.test(p.name || p.displayName || "")
          ? ({dagger:"Dagger",crow:"Crow",blaze:"Blaze"}[p.avatar] ||
             ({1:"Dagger",2:"Crow",3:"Blaze"}[seat]) || p.name)
          : (p.name || p.displayName || ("Player " + (seat + 1))),
        seat,
        team: Number.isInteger(p.team) ? p.team : seat % 2,
        isHost: seat === 0,
        isBot: p.isBot === true,
        bank: 0,
        avatar: p.avatar || ["cinder", "dagger", "crow", "blaze"][seat],
        voice: p.voice || "avatar",
      };
    });
  }

  function paintCloudPace(pace) {
    const n=[1,3,99].includes(Number(pace))?Number(pace):1;
    horGamePace=n;document.body.dataset.gamePace=n===99?"max":String(n);document.body.style.setProperty("--hor-pace-factor",String(1/(n===99?20:n)));horPaintGamePace();
    document.querySelectorAll('#scoreSpeed701 [data-score-pace]').forEach(button=>{button.disabled=!!credentials&&credentials.seat!==0;button.title=button.disabled?"The host controls table speed":"";});
  }
  let paceSending=false,pendingCloudPace=null;
  async function requestCloudPace(value) {
    if(!credentials||credentials.seat!==0)return;
    pendingCloudPace=Number(value);if(paceSending)return;paceSending=true;const owner=credentials;
    try{while(pendingCloudPace!==null&&credentials===owner){const pace=pendingCloudPace;pendingCloudPace=null;const snap=await api(roomPath("pace"),{method:"POST",body:{pace}});if(credentials!==owner)return;receiveSnapshot(snap);localStorage.setItem("horGamePace",String(snap.pace));}}
    catch(error){pendingCloudPace=null;status("Could not change table speed: "+error.message);await refresh();}finally{paceSending=false;}
  }
  const nativePace=window.horSetGamePace;
  window.horSetGamePace=window.__ghSetGamePace630=function(value){return credentials?requestCloudPace(value):nativePace(value);};
  window.addEventListener("click",event=>{const button=event.target.closest?.('#scoreSpeed701 [data-score-pace]');if(!button||!credentials)return;event.preventDefault();event.stopImmediatePropagation();if(credentials.seat===0)requestCloudPace(button.dataset.scorePace);},true);
  const endEffects=window.HOREndHandEffectsV12;
  if(endEffects){const play=endEffects.play;endEffects.play=function(...args){const result=play.apply(this,args);document.querySelector('#endHandEffectsV12 .end-hand-v12-skip')?.remove();return result;};}

  function enterWaiting(snap) {
    paintCloudPace(snap.pace);
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
    const leaveControl=document.getElementById("leaveBtn"); if(leaveControl) leaveControl.textContent=credentials.seat===0 ? "Close table" : "Leave table";
    const start = document.getElementById("startBtn");
    if (start && credentials.seat === 0) {
      start.classList.remove("hidden");
      start.disabled = snap.occupiedSeats?.length !== 4;
      start.textContent = "Start Game";
    }
  }

  // A restored cloud hand skips the native deal, which normally primes impacts.
  // Retry on trusted interaction too; a network failure must not silence the hand.
  function warmCloudAudio() {
    if (!credentials) return;
    try { preloadCardLandingSounds058().catch(() => {}); } catch (_) {}
  }
  document.addEventListener("pointerdown", warmCloudAudio, { passive: true });

  function presentCloudCardAudio(snap) {
    const cards = (snap.trick || []).filter(entry => entry?.card?.id);
    if (!cloudAudio || cloudAudio.owner !== credentials || cloudAudio.hand !== snap.handNumber) {
      cloudAudio = { owner: credentials, hand: snap.handNumber, seen: new Set(cards.map(entry => entry.card.id)) };
      warmCloudAudio();
      return; // Reconnect/new-hand snapshots describe history, not fresh plays.
    }
    const fresh = cards.filter(entry => !cloudAudio.seen.has(entry.card.id));
    for (const entry of cards) cloudAudio.seen.add(entry.card.id);
    if (snap.phase === "play" && fresh.length) {
      // A catch-up snapshot can contain several cards: sound the latest only.
      // The native dispatcher retains mute, effects levels and bird-sound rules.
      try { notifyCardPlayed(fresh[fresh.length - 1].card); } catch (_) {}
    }
  }

  function gameSnapshot(snap) {
    paintCloudPace(snap.pace);
    if(cloudDealOwner && cloudDealOwner.credentials===credentials && cloudDealOwner.hand===snap.handNumber && (!snap.opening?.id||cloudDealOwner.id===snap.opening.id) && !cloudDealOwner.done) return;
    const restoringCloudView=!presented;
    const beginDeal=snap.phase==="dealing" && (!cloudDealOwner || cloudDealOwner.credentials!==credentials || cloudDealOwner.hand!==snap.handNumber || !!snap.opening?.id && cloudDealOwner.id!==snap.opening.id);

    if (!["score", "complete"].includes(snap.phase)) {
      document.getElementById("scoreModal")?.classList.add("hidden");
      document.body.classList.remove("remaining-open");
    }
    if (typeof snap.shootMoonEnabled === "boolean") shootMoonEnabled = snap.shootMoonEnabled;
    if (snap.rules) {
      includeRed2 = !!snap.rules.includeRed2;
      includeOnes = !!snap.rules.includeOnes;
      includeRook = !!snap.rules.includeRook;
      includeRed1 = !!snap.rules.includeRed1;
      onesHigh = !!snap.rules.onesHigh;
      rookLowest = !!snap.rules.rookLowest;
      specialsAnytime = !!snap.rules.specialsAnytime;
      mustTrumpWhenVoid = !!snap.rules.mustTrumpWhenVoid;
    }
    const tablePlayers = mapPlayers(snap);
    const hand = Array.isArray(snap.hand) ? snap.hand.map((card) => ({ ...card })) : [];
    const viewPhase = snap.phase === "complete" ? "score" : snap.phase === "dealing" ? "dealing" : snap.phase;
    const hands = [[], [], [], []];
    hands[credentials.seat] = hand.map((card) => ({ ...card }));
    players = tablePlayers;
    myIndex = credentials.seat;
    myPeerId = playerIdForSeat(credentials.seat);
    // Host permissions belong to the server credential, not the legacy
    // browser referee. All dealt cloud views use the native client UI path.
    isHost = false;
    const view = {
      phase: viewPhase,
      cloudRevision: snap.revision,
      scores: snap.scores || [0, 0],
      sandbagOverpoints: [0, 0],
      bid: snap.bid || 0,
      highestBid: snap.highestBid,
      shotTheMoon: !!snap.shotTheMoon,
      trumpVoiceEvent790: snap.trump ? "cloud-trump:" + credentials.roomCode + ":" + snap.handNumber + ":" + snap.bidder + ":" + snap.trump : null,
      trumpVoiceRestore790: !presented,
      trumpPresentation833: !!snap.trumpOpening,
      trumpPresentationMs833: snap.trumpPresentationMs || 1950,
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
      trumpPresentation833: !!snap.trumpOpening,
      trumpPresentationMs833: snap.trumpPresentationMs || 1950,
      resolvingTrick: !!snap.resolvingTrick,
      paused: false,
      bidStatus: snap.bidStatus || [null, null, null, null],
      discardCount: snap.discardCount || 0,
      nestAuctionOpen: snap.phase === "bidding",
      revealTopNest: snap.revealTopNest !== false,
      nestFlipped: snap.phase === "bidding",
      topNestCard: snap.topNestCard || null,
      nestFlipStage: 0,
      widowSpread: snap.widowSpread || [],
      handPoints: snap.handPoints || [0, 0],
      recentTricks: snap.recentTricks || [],
      trumpClaimPlayer: snap.canClaimRemaining ? credentials.seat : null,
      claimDeclined: !!snap.claimDeclined,
      claimAnimation: snap.claimAnimation||null,
      claimAnimating: !!snap.claimAnimation,
      resolvingTrickPoints: Number(snap.resolvingTrickPoints)||0,
    };
    const current = game || {};
    Object.assign(current, {
      phase: viewPhase,
      cloudRevision: snap.revision,
      scores: view.scores,
      sandbagOverpoints: view.sandbagOverpoints,
      bid: view.bid,
      highestBid: view.highestBid,
      shotTheMoon: view.shotTheMoon,
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
      trumpPresentation833: !!snap.trumpOpening,
      trumpPresentationMs833: snap.trumpPresentationMs || 1950,
      resolvingTrick: !!snap.resolvingTrick,
      paused: false,
      bidStatus: view.bidStatus,
      discardCount: view.discardCount,
      nestAuctionOpen: snap.phase === "bidding",
      nestFlipped: snap.phase === "bidding",
      topNestCard: view.topNestCard,
      widowSpread: view.widowSpread,
      handPoints: view.handPoints,
      trumpClaimPlayer: view.trumpClaimPlayer,
      claimDeclined: view.claimDeclined,
      claimAnimation: snap.claimAnimation||null,
      claimAnimating: !!snap.claimAnimation,
      resolvingTrickPoints: Number(snap.resolvingTrickPoints)||0,
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
    if(beginDeal) current.myHand=[];
    game = current;
    if (snap.phase === "discard" && snap.bidder === credentials.seat &&
        window._cloudKittyHand !== snap.handNumber) {
      window._cloudKittyHand = snap.handNumber;
      window._discardFlowKey = typeof discardFlowIdentity === "function" ? discardFlowIdentity(hand, snap.bidder) : "";
      window._discardPage = "kitty";
      window.selectedForDiscard = new Set();
      window._discardSubmitting = false;
      window._discardStartReceived = false;
      window._discardKittyShown = false;
    }
    try { applyState(view); if (snap.phase !== "discard") renderHand(false); } catch (error) { status("Could not draw the current table: " + error.message); }

    if(!["bidding","discard","trump"].includes(snap.phase)) {
      try {setBotThinking(snap.phase==="play"&&!snap.resolvingTrick&&!snap.trumpOpening&&!!tablePlayers[snap.currentPlayer]?.isBot);} catch(_){}
    }

    if(beginDeal) {
      const owner={credentials,hand:snap.handNumber,id:snap.opening?.id,done:false};cloudDealOwner=owner;
      status("Preparing the table\u2026");
      cloudDealTimer=setTimeout(()=>{
        if(credentials!==owner.credentials || cloudDealOwner!==owner)return;
        runDealPresentation(hand,()=>{
          if(credentials!==owner.credentials || cloudDealOwner!==owner)return;
          owner.done=true;acknowledgeDeal(owner);
        });
      },solScaledDelay(1500,150));
    }

    presentCloudCardAudio(snap);

    // Presentation observes confirmed public changes; reconnect snapshots are quiet.
    if (presented?.hand === snap.handNumber) {
      for (let seat = 0; seat < 4; seat++) {
        const value = snap.bidStatus?.[seat];
        if (value == null || value === presented.bids?.[seat]) continue;
        const moon = !!snap.shotTheMoon && seat === snap.bidder;
        const action = value === "pass" ? "pass" : moon ? "shootMoon" : "bid";
        window.HORBidVoice801?.receive({event:{id:"cloud-bid:" + credentials.roomCode + ":" + snap.handNumber + ":" + snap.revision + ":" + seat,player:seat,action,amount:Number(value)||0,clip:moon?"moon-"+(snap.handNumber%2+1):undefined}});
      }
      if (snap.shotTheMoon && !presented.moon) window.HORMoonHowl?.play("cloud-moon:" + credentials.roomCode + ":" + snap.handNumber);
      if (snap.phase === "play" && snap.trump && !presented.trump) window.HORTrumpVoice?.chosen(game, playerAvatars);
    }
    presented = {hand:snap.handNumber,bids:[...(snap.bidStatus||[])],trump:snap.trump,moon:!!snap.shotTheMoon};

    if (snap.lastSummary) {
      const signature = credentials.roomCode+":"+snap.handNumber+":"+JSON.stringify(snap.scores);
      if (signature !== lastScoreSignature) {
        lastScoreSignature = signature;
        const nestCards = snap.nestCards || [];
        const nestPts = nestCards.reduce((sum, card) => sum + (typeof cardPoints === "function" ? cardPoints(card) : 0), 0);
        const nestWinnerName = snap.lastSummary.nestTeam != null && typeof teamLabel === "function"
          ? teamLabel(snap.lastSummary.nestTeam)
          : "Winning team";
        const summary={...snap.lastSummary,nestCards,nestPts,nestWinnerName,careerEvent:{matchId:"cloud:"+credentials.roomCode,hand:snap.handNumber}};
        try { if(restoringCloudView||typeof presentCompletedHandV12!=="function")showScoreModal(summary);else presentCompletedHandV12(summary); } catch(_){showScoreModal(summary);}

      }
    }
    if (snap.phase === "redeal" && credentials.seat === 0 && redealRevision !== snap.revision) {
      redealRevision = snap.revision;
      setTimeout(() => sendAction("redeal", {}), 0);
    }
  }

  async function acknowledgeDeal(owner) {
    if(credentials!==owner.credentials || cloudDealOwner!==owner)return;
    try {
      const snap=await api(roomPath("ready"),{method:"POST",body:{handNumber:owner.hand,openingId:owner.id}});
      if(credentials!==owner.credentials || cloudDealOwner!==owner)return;
      if(!latest || snap.revision>=latest.revision) {latest=snap;lastRevision=snap.revision;}
      gameSnapshot(latest);
      if(latest.phase==="dealing")cloudDealTimer=setTimeout(()=>acknowledgeDeal(owner),Math.max(250,Math.min(1000,latest.opening?.minimumRemainingMs||500)));
    } catch(error) {
      if(credentials===owner.credentials && cloudDealOwner===owner && latest?.handNumber===owner.hand) cloudDealTimer=setTimeout(()=>acknowledgeDeal(owner),1000);
    }
  }

  function wireCloudScoreButton(isFinal) {
    const next = document.getElementById("scoreModalNext") || document.querySelector("#scoreModal [data-action='next']") || document.querySelector("#scoreModal button:last-of-type");
    if (!next) return;
    next.textContent = isFinal ? "OK" : credentials.seat === 0 ? "Next Hand" : "Waiting for host";
    next.disabled = !isFinal && credentials.seat !== 0;
    next.onclick = (event) => {
      event.preventDefault();
      document.getElementById("scoreModal")?.classList.add("hidden");
      if (!isFinal) sendAction("next-hand", {});
    };
  }

  async function refresh() {
    if (!credentials || busy) return;
    const owner=credentials;
    try {
      const snap = await api(roomPath("snapshot"));
      if(credentials===owner)receiveSnapshot(snap);
    } catch (error) {
      if(credentials!==owner)return;
      status("Connection issue. Reconnecting\\u2026 (" + error.message + ")");
    }
  }

  function receiveSnapshot(snap) {
    if (!credentials || !snap || (credentials.serverRoomId && snap.roomId !== credentials.serverRoomId) || !Number.isInteger(snap.revision) || snap.revision < lastRevision) return;
    if (!credentials.serverRoomId) { credentials.serverRoomId = snap.roomId; localStorage.setItem(credentialKey, JSON.stringify(credentials)); }
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
    const owner = credentials;
    try {
      const issued = await api(roomPath("ws-ticket"), { method: "POST", body: {} });
      if (credentials !== owner) return;
      const endpoint = new URL(roomPath("ws"), window.location.origin);
      endpoint.protocol = endpoint.protocol === "https:" ? "wss:" : "ws:";
      endpoint.searchParams.set("ticket", issued.ticket);
      const next = new WebSocket(endpoint.toString());
      socket = next;
      next.onopen = () => {
        if(credentials!==owner || socket!==next)return;
        socketRetryCount = 0;
        setFallbackPolling(false);
      };
      next.onmessage = (event) => {
        if (credentials !== owner) return;
        try {
          const message = JSON.parse(event.data);
          if (message.type === "room-closed") { finishClosedTable(); return; }
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
      if(credentials===owner) scheduleSocketReconnect();
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
    const code = (input?.value || "").replace(/[\\s-]/g, "").toUpperCase();
    if (!name || !code) throw new Error("Enter your name and the room code.");
    const playerId = ownId();
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(credentialKey) || "null"); } catch (_) {}
    const resumeToken = saved?.roomCode === code && saved?.playerId === playerId ? saved.token : null;
    const isInvitation=Boolean(window.GHR_CLOUD_INVITE);
    const preferredSeat=isInvitation ? chosenInviteSeat : undefined;
    if(isInvitation && !resumeToken && !Number.isInteger(preferredSeat))
      throw new Error("Choose an available seat first.");
    let result;
    try{
      result=await api("/rooms/" + encodeURIComponent(code) + "/join", {
        method: "POST",
        body: { playerId, displayName: name, resumeToken, avatar: ensurePreferredAvatar(), voice: loadPreferredVoice(), ...(preferredSeat===undefined || preferredSeat===null?{}:{preferredSeat}) },
        token: null,
      });
    }catch(error){
      if(isInvitation && ["SEAT_OCCUPIED","ROOM_NOT_JOINABLE","ROOM_FULL"].includes(error.message)){
        await prepareInvitationSeats(code);
        status("The seat is no longer available. Please select an open seat.");
      }
      throw error;
    }
    if(isInvitation && !resumeToken && result.seat!==preferredSeat)
      throw new Error("The requested seat was not confirmed.");
    credentialsFrom({ ...result, roomCode: code }, playerId);
    startRealtime();
  }

  async function createCloudRoom() {
    const name = (document.getElementById("hor-player-name")?.value || "").trim();
    if (!name) throw new Error("Enter your name first.");
    const playerId = ownId();
    const result = await api("/rooms", {
      method: "POST",
      body: { playerId, displayName: name, avatar: ensurePreferredAvatar(), voice: loadPreferredVoice(), pace:horGamePace },
      token: null,
    });
    credentialsFrom(result, playerId);
    startRealtime();
  }

  async function sendAction(route, data) {
    if (!credentials || !latest) return;
    if(latest.resolvingTrick || latest.trumpOpening || latest.phase==="dealing" || (cloudDealOwner && cloudDealOwner.credentials===credentials && !cloudDealOwner.done))return;
    if (busy) {
      // A pushed next turn may arrive before the previous HTTP refresh finishes.
      // Keep one intention only for that exact authoritative room/hand/revision.
      queuedAction = {route, data, owner: credentials, revision: latest.revision, hand: latest.handNumber};
      return;
    }
    const owner=credentials;
    busy = true;
    const body = {
      actionId: crypto.randomUUID(),
      expectedRevision: latest.revision,
      ...data,
    };
    try {
      await api(roomPath(route), { method: "POST", body });
      if(credentials===owner)await refreshAfterAction();
    } catch (error) {
      if(credentials!==owner)return;
      status("Move not accepted: " + error.message);
      await refreshAfterAction();
    } finally {
      if(credentials!==owner)return;
      busy = false;
      const next = queuedAction;
      queuedAction = null;
      if (next && next.owner === credentials && next.revision === latest?.revision && next.hand === latest?.handNumber)
        queueMicrotask(() => sendAction(next.route, next.data));
    }
  }

  async function refreshAfterAction() {
    if (!credentials) return;
    const owner=credentials;
    try { const snap=await api(roomPath("snapshot"));if(credentials===owner)receiveSnapshot(snap); } catch (_) {}
  }

  async function startCloudGame() {
    if (!credentials || credentials.seat !== 0) return;
    try {
      await api(roomPath("start"), { method: "POST", body: {options: {targetScore: normalizeTargetScore(targetScore), includeRed2, revealTopNest, shootMoonEnabled}}, token: credentials.token });
      await refreshAfterAction();
    } catch (error) { status("Could not start the table: " + error.message); }
  }

  async function reconnectCloudRoom() {
    if (sessionStorage.getItem("ghr-cloud-disconnected") === "1") return false;
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(credentialKey) || "null"); } catch (_) { return false; }
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
        credentials = null;paintCloudPace(Number(localStorage.getItem("horGamePace"))||1);
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
    credentials = null;paintCloudPace(Number(localStorage.getItem("horGamePace"))||1);
    clearTimeout(cloudDealTimer);cloudDealOwner=null;
    clearInterval(timer);
    clearTimeout(socketReconnectTimer);
    socketReconnectTimer = null;
    const previous = socket;
    socket = null;
    try { previous?.close(); } catch (_) {}
    latest=null; queuedAction=null; busy=false; presented=null; lastRevision=-1;
    cloudAudio=null; lastScoreSignature=""; redealRevision=-1;
    returnToLobby043();
  }
  function finishClosedTable(owner = credentials) {
    if (!owner || credentials !== owner) return;
    credentials=null;paintCloudPace(Number(localStorage.getItem("horGamePace"))||1); latest=null; queuedAction=null;
    clearTimeout(cloudDealTimer);cloudDealOwner=null;
    localStorage.removeItem(credentialKey);
    sessionStorage.removeItem("ghr-cloud-disconnected");
    clearInterval(timer);clearTimeout(socketReconnectTimer);socketReconnectTimer=null;
    const previous=socket;socket=null;try{previous?.close();}catch(_){}
    window.houseDismissConfirm?.();
    busy=false; presented=null; lastRevision=-1; cloudAudio=null; lastScoreSignature=""; redealRevision=-1;
    returnToLobby043();
    if(owner.seat!==0)horToast("The host closed this table. You can start or join another.");
  }
  let closingTable=false;
  async function closeCloudTable() {
    if (!credentials || credentials.seat!==0 || closingTable) return;
    const owner=credentials;
    closingTable=true;
    try {
      const accepted=await window.houseConfirm({kind:"table",tableCode:owner.roomCode,title:"Close this table?",body:"This ends the game for everyone. Friends will need a new invitation.",confirmText:"Close table",cancelText:"Keep table",danger:true});
      if(!accepted || credentials!==owner)return;
      await api(roomPath("close"),{method:"POST",body:{}});
      finishClosedTable(owner);
    } catch(error) { if(credentials===owner){status("Could not close table: "+error.message);horToast("Could not close the table. Please try again.");} }
    finally { closingTable=false; }
  }
  window.clientLeaveReplace = async () => {
    if (!credentials) return native.clientLeaveReplace?.();
    if (credentials.seat===0) {await closeCloudTable();return;}
    const owner=credentials;
    const accepted=await window.houseConfirm({kind:"table",tableCode:owner.roomCode,title:"Leave this table?",body:"Your seat stays reserved. Use this table code to rejoin; no bot will replace you.",confirmText:"Leave table",cancelText:"Stay here",danger:false});
    if(accepted && credentials===owner)disconnectCloudRoom();
  };
  window.leaveTableAfterConfirmation043 = (...args) => !credentials ? native.leaveTableAfterConfirmation043?.(...args) : credentials.seat===0 ? closeCloudTable() : disconnectCloudRoom();
  window.leaveTableToLobby043 = (...args) => !credentials ? native.leaveTableToLobby043?.(...args) : credentials.seat===0 ? closeCloudTable() : disconnectCloudRoom();
  // Spectator mode is unsupported by the private room server.
  for (const id of ["spectateBtn", "welcomeWatchBtn"]) {
    const button = document.getElementById(id);
    if (button) { button.disabled = true; button.title = "Watch-only unavailable in cloud test"; }
  }
  // Existing listener registrations may still hold the legacy leave callback.
  document.addEventListener("click", event => {
    const button = event.target.closest?.("#leaveBtn,#leaveReplaceBtn,#rejoinBtn,#reconnectBtn,#friendsToggleBtn,#createBtn,#joinConfirmBtn,#fillSeatsBtn,#startBtn,#spectateBtn,#welcomeWatchBtn,#shareBtn,#showQrBtn");
    if (!button) return;
    if (["shareBtn", "showQrBtn"].includes(button.id)) return;
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
      showBotFillStatus("Adding House bots to the open seats\u2026", button);
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
  window.saveSession = (...args) => credentials ? undefined : native.saveSession?.(...args);
  window.createRoom = function () { return createCloudRoom().catch((error) => status(error.message)); };
  window.joinRoom = function () { return joinByCode().catch((error) => status(error.message)); };
  window.startGameWithToast = function (...args) { return credentials ? startCloudGame() : native.startGameWithToast?.(...args); };
  window.submitBid = function (value, opts) {
    if (!credentials) return native.submitBid?.(value, opts);
    if (Number(value) !== 0 && isShootMoonBid(Number(value)) && !opts?.moonConfirmed) return;
    return sendAction("bid", { value: Number(value) });
  };
  window.submitDiscard = function (cardIds) { if (!credentials) return native.submitDiscard?.(cardIds); return sendAction("discard", { cardIds: [...cardIds] }); };
  window.submitTrump = function (color) { if (!credentials) return native.submitTrump?.(color); return sendAction("trump", { color }); };
  window.submitPlay = function (cardId) {
    if (!credentials) return native.submitPlay?.(cardId);
    if (Date.now() < playLockUntil) return;
    playLockUntil = Date.now() + 450;
    return sendAction("play", { cardId });
  };
  window.hostStartNextHand = function (...args) { return credentials ? sendAction("next-hand", {}) : native.hostStartNextHand?.(...args); };
  // Page the approved chooser with a horizontal finger gesture, preserving taps.
  const botGrid=document.getElementById("botPickerGrid");let botSwipe=null,botSwipeUntil=0,botPaging=false;
  botGrid?.addEventListener("touchstart",event=>{const t=event.touches;if(t.length===1)botSwipe={x:t[0].clientX,y:t[0].clientY};else botSwipe=null;},{passive:true});
  botGrid?.addEventListener("touchend",async event=>{const start=botSwipe;botSwipe=null;const t=event.changedTouches[0];if(!start||!t)return;const dx=t.clientX-start.x,dy=t.clientY-start.y;if(Math.abs(dx)<50||Math.abs(dx)<Math.abs(dy)*1.5)return;const nav=document.querySelector("#botPickerModal .house-legacy-nav"),buttons=nav?.querySelectorAll("button"),button=buttons?.[dx<0?1:0];event.preventDefault();botSwipeUntil=Date.now()+600;if(!button||button.disabled||botPaging)return;botPaging=true;const direction=dx<0?-1:1;try{await botGrid.animate([{transform:"translateX(0)",opacity:1},{transform:\`translateX(\${direction*25}%)\`,opacity:0}],{duration:120,easing:"ease-in",fill:"none"}).finished;button.click();await botGrid.animate([{transform:\`translateX(\${-direction*25}%)\`,opacity:0},{transform:"translateX(0)",opacity:1}],{duration:180,easing:"ease-out",fill:"none"}).finished;}finally{botPaging=false;}},{passive:false});
  botGrid?.addEventListener("touchcancel",()=>{botSwipe=null;},{passive:true});
  botGrid?.addEventListener("click",event=>{if(Date.now()<botSwipeUntil){event.preventDefault();event.stopImmediatePropagation();}},true);
  const nativeShowBidUI=window.showBidUI;
  window.showBidUI=function(...args){
    if(credentials&&(latest?.phase!=="bidding"||game?.phase!=="bidding"||cloudDealOwner?.credentials===credentials&&!cloudDealOwner.done||!document.getElementById("shuffleOverlay")?.classList.contains("hidden")&&document.getElementById("shuffleOverlay")))return;
    return nativeShowBidUI.apply(this,args);
  };
  const nativeCloudScore=window.showScoreModal;
  window.showScoreModal=function(...args){const result=nativeCloudScore.apply(this,args);if(credentials)wireCloudScoreButton(!!latest?.matchResult);return result;};
  const nativeBotPicker=window.openBotPicker;
  async function cloudBotSeat(seat, name) {
    if(busy||!credentials)return;
    busy=true;
    try {const snap=await api(roomPath("bot-seat"),{method:"POST",body:{seat, name, expectedRevision:latest.revision}});receiveSnapshot(snap,credentials);closeBotPicker();}
    catch(error){status("Could not change bot: "+error.message);await refresh(true);}
    finally{busy=false;}
  }
  window.openBotPicker=function(seat,replaceBot=false){
    if(!credentials)return nativeBotPicker(seat,replaceBot);
    if(credentials.seat!==0||latest?.phase!=="waiting")return;
    nativeBotPicker(seat,replaceBot);
    document.querySelectorAll("#botPickerGrid .bot-pick").forEach(button=>{button.onclick=()=>cloudBotSeat(seat,button.getAttribute("data-bot"));});
    const remove=document.getElementById("botPickerRemove830");if(remove)remove.onclick=()=>cloudBotSeat(seat,null);
  };
  window.onWaitSeatClick=function(seat){
    if(!credentials)return native.onWaitSeatClick?.(seat);
    if(credentials.seat!==0||latest?.phase!=="waiting")return;
    const target=latest.players?.find(p=>p.seat===Number(seat));
    if(target?.occupied&&!target.isBot)return;
    window.openBotPicker(Number(seat),!!target?.isBot);
  };
  window.addEventListener("click",event=>{
    if(!credentials||credentials.seat!==0||latest?.phase!=="waiting"||matchMedia("(orientation: landscape)").matches)return;
    const button=event.target.closest?.('[id^="waitSeat"]');if(!button||!/^waitSeat[1-3]$/.test(button.id))return;
    const seat=Number(button.id.slice(-1)),target=latest.players?.find(p=>p.seat===seat);
    if(target?.occupied&&!target.isBot)return;
    event.preventDefault();event.stopImmediatePropagation();window.onWaitSeatClick(seat);
  },true);
  window.hostProcessAllTrumpsClaim = function (...args) { return credentials ? sendAction("claim-remaining", {}) : native.hostProcessAllTrumpsClaim?.(...args); };
  window.hostDeclineClaim = function (...args) { return credentials ? sendAction("decline-claim", {}) : native.hostDeclineClaim?.(...args); };

  // Replace the existing PeerJS-only claim buttons with the same approved copy,
  // routed through the authoritative room service instead.
  window.showAllTrumpsClaimUI = function (...args) {
    if (!credentials) return native.showAllTrumpsClaimUI?.(...args);
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
  try { window.horRecordCareerHand = (...args) => credentials ? ({ ok: true, skipped: "private-cloud-test" }) : native.horRecordCareerHand?.(...args); } catch (_) {}
  try { window.mergeLifetimeStats = (...args) => credentials ? undefined : native.mergeLifetimeStats?.(...args); } catch (_) {}
  try { window.noteHumanAuction = (...args) => credentials ? undefined : native.noteHumanAuction?.(...args); } catch (_) {}
  try { window.noteHumanHandEnd = (...args) => credentials ? undefined : native.noteHumanHandEnd?.(...args); } catch (_) {}
  // PeerJS liveness must never evict or replace a cloud seat.
  clearInterval(horHeartbeatTimer);
  window.horStartHeartbeat = (...args) => credentials ? undefined : native.horStartHeartbeat?.(...args);
  window.horBeginClientReconnect = (...args) => credentials ? undefined : native.horBeginClientReconnect?.(...args);
  window.HOR_CLOUD_TEST_ACTIVE = true;
  window.HORCloudDiagnostics = () => ({busy, queued: !!queuedAction, revision:lastRevision, seat:credentials?.seat ?? null});
  // The Durable Object controls test bots. Prevent the legacy browser bot
  // loop from issuing a second move against the same visible game.
  window.isBotTurn = (...args) => credentials ? false : native.isBotTurn?.(...args);
  window.scheduleBot = (...args) => credentials ? undefined : native.scheduleBot?.(...args);
  window.runBotAction = (...args) => credentials ? undefined : native.runBotAction?.(...args);
  status("Online table ready.");
  const requestedName = String(window.GHR_CLOUD_NAME || "").trim().slice(0, 12);
  const playerNameField = document.getElementById("hor-player-name");
  if (requestedName && playerNameField) playerNameField.value = requestedName;
  // Isolated invite preparation UI: choosing an identity/avatar is not a seat claim.
  // The server's /seat-options is read only; /join must atomically honor preferredSeat.
  let chosenInviteSeat = null;
  async function prepareInvitationSeats(code) {
    const form = document.getElementById("joinForm");
    const confirm = document.getElementById("joinConfirmBtn");
    if (!form || !confirm) return;
    confirm.disabled = true;
    let panel = document.getElementById("horInviteSeatPicker");
    if (!panel) {
      panel = document.createElement("fieldset");
      panel.id = "horInviteSeatPicker";
      panel.style.cssText = "margin:12px 0;border:1px solid #ac8b53;border-radius:10px;padding:12px;color:#efdcb6";
      form.insertBefore(panel,confirm);
    }
    const heading = document.createElement("legend");
    heading.textContent = "Choose your seat";
    panel.replaceChildren(heading);
    const statusEl = document.createElement("div");
    statusEl.textContent = "Checking available seats…";
    panel.append(statusEl);
    try {
      const state = await api("/rooms/" + encodeURIComponent(code) + "/seat-options", {token:null});
      const savedSeatsAvailable = state.phase === "waiting";
      // The saved token belongs to this browser only. Rejoin never allocates a new seat.
      let saved=null;
      try { saved=JSON.parse(localStorage.getItem(credentialKey)||"null"); } catch (_) {}
      if(saved?.token && saved.roomCode===code && saved.playerId===ownId()){
        const resume=document.createElement("button");
        resume.type="button";
        resume.textContent="Rejoin my reserved seat";
        resume.style.cssText="display:block;width:100%;margin:7px 0;padding:11px;border:1px solid #c5a36b;border-radius:8px;background:#24394e;color:#f5dfae";
        resume.addEventListener("click",()=>{
          chosenInviteSeat=null;
          window.GHR_PREFERRED_SEAT=undefined;
          for(const b of panel.querySelectorAll("button"))b.setAttribute("aria-pressed",String(b===resume));
          confirm.disabled=false;
        });
        panel.append(resume);
      }
      if (!savedSeatsAvailable) {
        statusEl.textContent = saved?.token && saved.roomCode === code && saved.playerId === ownId()
          ? "This table has started. Rejoin your reserved seat."
          : "This table is not accepting new players.";
        return;
      }
      const names = {1:"Left opponent",2:"Host's partner",3:"Right opponent"};
      statusEl.textContent = "Choose an open seat. The host always occupies seat 1 of 4.";
      for (const seat of [1,2,3]) {
        const choice = state.seats.find(x=>Number(x.seat)===seat);
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.preferredSeat = String(seat);
        button.textContent = names[seat] + (choice?.joinable ? " · Available" : " · " + (choice?.name || "Unavailable"));
        button.disabled = !choice?.joinable;
        button.style.cssText = "display:block;width:100%;margin:7px 0;padding:11px;border:1px solid #a48b62;border-radius:8px;background:#152739;color:#f5e7cb";
        button.addEventListener("click",()=>{
          chosenInviteSeat=seat;
          window.GHR_PREFERRED_SEAT=seat;
          for (const b of panel.querySelectorAll("button")) b.setAttribute("aria-pressed",String(b===button));
          confirm.disabled = false;
        });
        panel.append(button);
      }
      if (!state.seats.some(x=>x.joinable)) statusEl.textContent = "No seats are currently available. Ask the host to open one.";
    } catch(error) {
      statusEl.textContent = "Could not check seats. " + (error?.message || "Please reload the invitation.");
    }
  }
  async function launchCloudEntry() {
    const invite = String(window.GHR_CLOUD_INVITE || "").replace(/[\\s-]/g, "").toUpperCase();
    if (/^(?:[A-Z]{3}[0-9]{2,4}|[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8})$/.test(invite || "")) {
      const input = document.getElementById("hor-room-code");
      if (input) input.value = invite;
      // A remembered nickname must not auto-reserve the first available seat.
      try { setLobbyJoining(true); } catch (_) {}
      status("Invited to table " + invite + ". Confirm your name, avatar and seat.");
      await prepareInvitationSeats(invite);
      return;
    }
    if (window.GHR_CLOUD_CREATE) {
      if (!(playerNameField?.value || "").trim()) {
        status("Enter your name first, then tap Play With Friends to create a table.");
        return;
      }
      await createCloudRoom();
      return;
    }
    if (!await reconnectCloudRoom()) status("Online table ready. Create a room or join with a code.");
  }
  launchCloudEntry().catch(error => status("Could not open online table: " + error.message));
})();

`;

async function qaCreate(env){
 const alphabet="23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
 const code=Array.from(crypto.getRandomValues(new Uint8Array(8)),b=>alphabet[b%alphabet.length]).join("");
 const host=await env.TEST_ROOMS.getByName(code).fetch(new Request("https://room.test/create?code="+code,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({playerId:"sandbox-host-"+code,displayName:"Host",avatar:"grit"})}));
 if(!host.ok)return Response.json({pass:false,error:await host.text()},{status:500});
 return Response.json({pass:true,room:code,seat:(await host.json()).seat,invite:"/?room="+code});
}
const CODE_RE=/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/;
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname==="/_qa-create")return qaCreate(env);if(url.pathname==="/_seatqa")return qa(env);
 if(url.pathname==="/_healthy")return Response.json({sandbox:true,roomStorage:"separate DO",gameAssets:"proxied existing game, never copied",adapterBytes:ALTERNATE_ADAPTER.length});
 const isCreate=url.pathname==="/rooms"&&request.method==="POST";
 const found=url.pathname.match(/^\/rooms\/([23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8})\/(join|seat-options|snapshot|ws-ticket|ws)$/);
 if(isCreate){
  let payload;try{payload=await request.json()}catch{return Response.json({error:"INVALID_JSON"},{status:400})}
  const alphabet="23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  for(let trial=0;trial<8;trial++){
   const code=Array.from(crypto.getRandomValues(new Uint8Array(8)),b=>alphabet[b%alphabet.length]).join("");
   const stub=env.TEST_ROOMS.getByName(code);
   const response=await stub.fetch(new Request("https://room.test/create?code="+code,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)}));
   if(response.ok) return Response.json({roomCode:code,...await response.json()},{status:201});
  }
  return Response.json({error:"ROOMS_BUSY"},{status:503});
 }
 if(found){
  if(found[2]==="ws-ticket"||found[2]==="ws")return Response.json({error:"WEBSOCKET_DISABLED_IN_ISOLATED_QA",message:"Polling is used for seat selection tests"},{status:503});
  const stub=env.TEST_ROOMS.getByName(found[1]),to="https://room.test/"+found[2]+"?code="+found[1];
  return stub.fetch(new Request(to,request));
 }
 const upstream=await env.GAME.fetch(request);
 if(url.pathname==="/"&&request.method==="GET"&&upstream.ok&&(upstream.headers.get("content-type")||"").includes("text/html")){
  const h=await upstream.text();
  const i=h.indexOf("<script>/*\n * Build-797 screen adapter");
  const e=i>=0?h.indexOf("</script>",i):-1;
  if(i<0||e<0)return Response.json({error:"STAGING_ADAPTER_NOT_FOUND"},{status:502});
  let revised=h.slice(0,i)+"<script>"+ALTERNATE_ADAPTER+"</script>"+h.slice(e+9);
  if(url.searchParams.has("qa_auto"))revised=revised.replace("</body>","<script>"+"\n(function(){\n const result={sandbox:true,errors:[]};\n addEventListener('error',e=>result.errors.push(String(e.message).slice(0,160)));\n setTimeout(()=>{\n  const name=document.getElementById('hor-player-name');\n  const seat=document.querySelector('#horInviteSeatPicker [data-preferred-seat=\"2\"]');\n  const confirm=document.getElementById('joinConfirmBtn');\n  result.before={name:name?.value,seatButton:!!seat,confirmDisabled:confirm?.disabled,formHidden:document.getElementById('joinForm')?.classList.contains('hidden')};\n  if(name){name.value='QA Guest';name.dispatchEvent(new Event('input',{bubbles:true}));}\n  if(seat)seat.click();\n  result.selected={pressed:seat?.getAttribute('aria-pressed'),confirmDisabled:confirm?.disabled};\n  if(confirm)confirm.click();\n  setTimeout(()=>{\n    const code=document.getElementById('displayCode')?.textContent||'';\n    const waiting=document.getElementById('waiting');\n    const lobby=document.getElementById('lobby');\n    result.after={code,waitingVisible:waiting&&!waiting.classList.contains('hidden'),lobbyHidden:lobby?.classList.contains('hidden'),waitingText:waiting?.innerText?.slice(0,350),storedSeat:(()=>{try{const x=JSON.parse(localStorage.getItem('ghr-private-cloud-seat-v1')||'null');return x?{seat:x.seat,roomCode:x.roomCode,hasToken:!!x.token}:null}catch{return null}})(),waitingStatus:document.getElementById('waitingStatus')?.textContent?.slice(0,150),joinFeedback:document.getElementById('joinFeedback841')?.textContent?.slice(0,150),label:document.getElementById('lobbyStatus')?.textContent?.slice(0,150),friendSeats:[...document.querySelectorAll('[id^=\"waitSeat\"]')].slice(0,4).map(x=>({id:x.id,text:x.innerText?.slice(0,35)}))};\n    result.success=result.after.waitingVisible&&result.after.code==='B5VJEUSD';\n    const pre=document.createElement('pre');pre.id='ghrQaSeatResult';pre.textContent=JSON.stringify(result);document.body.appendChild(pre);\n  },2800);\n },1300);\n})();\n"+"</script></body>");
  const headers=new Headers(upstream.headers);
  headers.delete("content-length");headers.set("cache-control","no-store");headers.set("x-ghr-sandbox","seat-selection-qa");
  return new Response(revised,{status:upstream.status,headers});
 }
 return upstream;
}};
