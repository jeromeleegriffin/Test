var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// cloudflare-dist/worker-cloud-only.mjs
import { DurableObject } from "cloudflare:workers";
const GUEST_RECONNECT_MS = 20000;
const GUEST_HEARTBEAT_TIMEOUT_MS = 10000;
function botControls(entry) { return !!(entry?.isBot || entry?.autoPlaying); }
function openingDue(room) {
  const o = room.opening;
  if (!o) return null;
  const ready = room.seats.every((p, i) => botControls(p) || o.readySeats.includes(i));
  return ready ? o.notBefore : Math.max(o.notBefore, o.expiresAt);
}
function beginCloudClaim(room, result) {
  if (result.event !== "remaining-cards-claimed") return;
  const before = room.gameState, player = before.currentPlayer, cards = clone2(before.hands[player]);
  room.claimOpening = { player, cards, reason: result.reason, scores: before.scores, expiresAt: Date.now() + cloudDelay(room, 4400, 600) };
  result.state.lastSummary = { ...result.state.lastSummary, claimer: player, claimerName: before.players[player]?.name, claimReason: result.reason, claimRevealHands: before.hands.map((cards2, seat) => ({ player: seat, name: before.players[seat]?.name, team: seat % 2, laidDown: seat === player, cards: clone2(cards2) })), lastTricks: clone2(room.recentTricks || []) };
}
__name(beginCloudClaim, "beginCloudClaim");
function cloudDelay(room, base, floor = 0) {
  const divisor = room.pace === 99 ? 20 : room.pace === 3 ? 3 : 1;
  return Math.max(floor, Math.round(base / divisor));
}
__name(cloudDelay, "cloudDelay");
function cloudStampDuration(room) {
  return cloudDelay(room, 1950, 950);
}
__name(cloudStampDuration, "cloudStampDuration");
function beginCloudCollection(room, result) {
  const before = room.gameState, after = result.state;
  if (!["trick-complete", "hand-complete"].includes(result.event) || before.trick?.length !== 3) return;
  const seat = before.currentPlayer, removed = before.hands[seat].filter((c) => !after.hands[seat].some((x) => x.id === c.id));
  if (removed.length !== 1) return;
  const trick = [...before.trick, { player: seat, card: removed[0] }], winner = after.lastTrickWinner, winning = trick.find((p) => p.player === winner)?.card, bird = winning?.id === "rook" && trick.some((p) => p.card.id === "red-2"), points = trick.reduce((n, p) => n + cardPoints(p.card, before.settings.rules), 0);
  room.trickOpening = { trick, winner, ledColor: before.ledColor, points, scores: before.scores, bird, expiresAt: Date.now() + (bird ? cloudDelay(room, 6200, room.pace === 99 ? 2700 : room.pace === 3 ? 3400 : 0) : cloudDelay(room, 3600, 600)) };
  room.recentTricks = [{ plays: trick, winner, ledColor: before.ledColor, trump: before.trump, points, team: winner % 2, winnerName: before.players[winner]?.name, hand: before.handNumber }, ...room.recentTricks || []].slice(0, 3);
}
__name(beginCloudCollection, "beginCloudCollection");
function beginCloudTrump(room) {
  room.trumpOpening = { handNumber: room.gameState.handNumber, durationMs: cloudStampDuration(room), expiresAt: Date.now() + cloudStampDuration(room) + 850 };
}
__name(beginCloudTrump, "beginCloudTrump");
function beginCloudOpening(room) {
  room.x1 = freshOnlineX1(room.gameState);
  room.opening = { id: crypto.randomUUID(), handNumber: room.gameState.handNumber, notBefore: Date.now() + cloudDelay(room, 3500, 350), expiresAt: Date.now() + 25e3, readySeats: [] };
}
__name(beginCloudOpening, "beginCloudOpening");
var CLOUD_AVATARS = /* @__PURE__ */ new Set(["anchor", "ash", "barrel", "blaze", "bramble", "brandy", "cobalt", "copper", "dice", "drift", "ember", "emberlyn", "fang", "finch", "flint", "frost", "gable", "grit", "halo", "harrier", "hearth", "hm01", "hm02", "hm03", "hm04", "hm05", "hm06", "hm07", "hm08", "hm09", "hm10", "hm11", "hm12", "hm13", "hm14", "hm15", "hm16", "hm17", "hm18", "hm19", "hm20", "hm21", "hm22", "hm23", "hm24", "hm25", "hm26", "hm27", "hm28", "hm29", "hm30", "hm31", "hm32", "hollow", "hw01", "hw02", "hw03", "hw04", "hw05", "hw06", "hw07", "hw08", "hw09", "hw10", "hw11", "hw12", "hw13", "hw14", "hw15", "hw16", "hw17", "hw18", "hw19", "hw20", "hw21", "hw22", "hw23", "hw24", "hw25", "hw26", "hw27", "hw28", "hw29", "hw30", "hw31", "hw32", "ivy", "jerome_founder", "marrow", "moss", "moth", "nettle", "nix", "pebble", "pike", "quill", "rita", "rookery", "sable", "shade", "spark", "thistle", "titan", "vex", "wager", "willow"]);
function safeAvatar(value) {
  return typeof value === "string" && CLOUD_AVATARS.has(value) ? value : "cinder";
}
__name(safeAvatar, "safeAvatar");
function safeVoice(v) {
  return ["avatar", "male", "female", "silent"].includes(v) ? v : "avatar";
}
__name(safeVoice, "safeVoice");
function safeOptions(o = {}) {
  const targetScore = o.targetScore ?? 500;
  if (!Number.isInteger(targetScore) || targetScore < 1 || targetScore > 2e3) throw Error("INVALID_TARGET_SCORE");
  const result = { targetScore };
  for (const k of ["includeRed2", "revealTopNest", "shootMoonEnabled"]) {
    if (o[k] !== void 0) {
      if (typeof o[k] !== "boolean") throw Error("INVALID_OPTIONS");
      result[k] = o[k];
    }
  }
  return result;
}
__name(safeOptions, "safeOptions");
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var COLORS = Object.freeze(["green", "red", "yellow", "black"]);
var RANKS = Object.freeze([5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
var POINT_VALUES = Object.freeze({ 5: 5, 10: 10, 14: 10, rook: 20 });
var DEFAULT_RULES = Object.freeze({
  includeOnes: true,
  includeRed2: true,
  red2Points: 20,
  includeRed1: false,
  includeRook: true,
  onesHigh: true,
  rookLowest: false,
  specialsAnytime: false,
  mustTrumpWhenVoid: false
});
function resolveRules(options = {}) {
  return { ...DEFAULT_RULES, ...options };
}
__name(resolveRules, "resolveRules");
__name2(resolveRules, "resolveRules");
function isRed2(card) {
  return !!card && card.id === "red-2";
}
__name(isRed2, "isRed2");
__name2(isRed2, "isRed2");
function isRed1(card) {
  return !!card && (card.id === "red1-special" || card.specialRed1 === true);
}
__name(isRed1, "isRed1");
__name2(isRed1, "isRed1");
function effectiveRank(card, options = DEFAULT_RULES) {
  const rules = resolveRules(options);
  if (!card) return 0;
  if (card.color === "rook") return rules.rookLowest ? -1 : 1e3;
  if (isRed1(card)) return 1001;
  if (isRed2(card)) return 999;
  if (rules.onesHigh && card.rank === 1) return 15;
  return card.rank;
}
__name(effectiveRank, "effectiveRank");
__name2(effectiveRank, "effectiveRank");
function makeDeck(options = DEFAULT_RULES) {
  const rules = resolveRules(options);
  const deck = [];
  for (const color of COLORS) {
    for (const rank of RANKS) deck.push({ color, rank, id: `${color}-${rank}` });
    if (rules.includeOnes) deck.push({ color, rank: 1, id: `${color}-1` });
  }
  if (rules.includeRed2) deck.push({ color: "red", rank: 2, id: "red-2" });
  if (rules.includeRed1) {
    deck.push({ color: "red", rank: 1, id: "red1-special", specialRed1: true });
  }
  if (rules.includeRook) deck.push({ color: "rook", rank: 99, id: "rook" });
  return deck;
}
__name(makeDeck, "makeDeck");
__name2(makeDeck, "makeDeck");
function cardPoints(card, options = DEFAULT_RULES) {
  const rules = resolveRules(options);
  if (!card) return 0;
  if (card.color === "rook" || card.id === "rook") return 20;
  if (isRed1(card)) return 30;
  if (isRed2(card) || card.id === "red-2") return parseInt(rules.red2Points, 10) || 20;
  if (card.rank === 1 || card.rank === "1") return rules.includeOnes ? 15 : 0;
  const rank = parseInt(card.rank, 10);
  return POINT_VALUES[rank] || 0;
}
__name(cardPoints, "cardPoints");
__name2(cardPoints, "cardPoints");
function isPermanentTrump(card, options = DEFAULT_RULES) {
  const rules = resolveRules(options);
  if (!card) return false;
  if (card.color === "rook" || card.id === "rook") return !!rules.includeRook;
  if (isRed2(card)) return !!rules.includeRed2;
  if (isRed1(card)) return !!rules.includeRed1;
  return false;
}
__name(isPermanentTrump, "isPermanentTrump");
__name2(isPermanentTrump, "isPermanentTrump");
function compareCards(a, b, ledColor, trump, options = DEFAULT_RULES) {
  const rules = resolveRules(options);
  const aIsTrump = isPermanentTrump(a, rules) || a.color === trump;
  const bIsTrump = isPermanentTrump(b, rules) || b.color === trump;
  if (aIsTrump && !bIsTrump) return 1;
  if (!aIsTrump && bIsTrump) return -1;
  if (aIsTrump && bIsTrump) {
    if (rules.rookLowest) {
      if (isRed1(a) && !isRed1(b)) return 1;
      if (isRed1(b) && !isRed1(a)) return -1;
      if (isRed2(a) && !isRed2(b) && b.color !== "rook") return 1;
      if (isRed2(b) && !isRed2(a) && a.color !== "rook") return -1;
      if (a.color === "rook") return -1;
      if (b.color === "rook") return 1;
      return effectiveRank(a, rules) - effectiveRank(b, rules);
    }
    if (isRed1(a)) return 1;
    if (isRed1(b)) return -1;
    if (a.color === "rook") return 1;
    if (b.color === "rook") return -1;
    if (isRed2(a)) return 1;
    if (isRed2(b)) return -1;
    return effectiveRank(a, rules) - effectiveRank(b, rules);
  }
  if (a.color === ledColor && b.color !== ledColor) return 1;
  if (a.color !== ledColor && b.color === ledColor) return -1;
  if (a.color === ledColor && b.color === ledColor) {
    return effectiveRank(a, rules) - effectiveRank(b, rules);
  }
  return 0;
}
__name(compareCards, "compareCards");
__name2(compareCards, "compareCards");
function isSpecialCard(card, options = DEFAULT_RULES) {
  const rules = resolveRules(options);
  if (!card) return false;
  if (card.color === "rook" || card.id === "rook") return !!rules.includeRook;
  if (isRed2(card)) return !!rules.includeRed2;
  if (isRed1(card)) return !!rules.includeRed1;
  return false;
}
__name(isSpecialCard, "isSpecialCard");
__name2(isSpecialCard, "isSpecialCard");
function isTrumpCard(card, trump, options = DEFAULT_RULES) {
  if (!card) return false;
  if (isSpecialCard(card, options)) return true;
  return trump && card.color === trump;
}
__name(isTrumpCard, "isTrumpCard");
__name2(isTrumpCard, "isTrumpCard");
function followsLedSuit(card, ledColor, trump, options = DEFAULT_RULES) {
  if (!card || !ledColor) return false;
  if (isSpecialCard(card, options)) return !!(trump && ledColor === trump);
  return card.color === ledColor;
}
__name(followsLedSuit, "followsLedSuit");
__name2(followsLedSuit, "followsLedSuit");
function canPlay(card, hand, ledColor, trump, options = DEFAULT_RULES) {
  const rules = resolveRules(options);
  if (!ledColor) return true;
  if (rules.specialsAnytime && isSpecialCard(card, rules)) return true;
  const hasLedColor = hand.some((c) => followsLedSuit(c, ledColor, trump, rules));
  if (hasLedColor) return followsLedSuit(card, ledColor, trump, rules);
  const hasTrump = hand.some((c) => isTrumpCard(c, trump, rules));
  if (rules.mustTrumpWhenVoid && hasTrump) return isTrumpCard(card, trump, rules);
  return true;
}
__name(canPlay, "canPlay");
__name2(canPlay, "canPlay");
var SEATS = 4;
var DEFAULT_HAND_SIZE = 10;
var DEFAULT_NEST_SIZE = 6;
var MAX_DEAL_ATTEMPTS = 12;
function secureRandomIndex(length) {
  if (!Number.isInteger(length) || length < 1 || length > 4294967296) {
    throw new RangeError("Invalid random index range");
  }
  const range = 4294967296;
  const limit = Math.floor(range / length) * length;
  const sample = new Uint32Array(1);
  do {
    globalThis.crypto.getRandomValues(sample);
  } while (sample[0] >= limit);
  return sample[0] % length;
}
__name(secureRandomIndex, "secureRandomIndex");
__name2(secureRandomIndex, "secureRandomIndex");
function secureShuffle(cards) {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = secureRandomIndex(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
__name(secureShuffle, "secureShuffle");
__name2(secureShuffle, "secureShuffle");
function randomDealerSeat() {
  return secureRandomIndex(SEATS);
}
__name(randomDealerSeat, "randomDealerSeat");
__name2(randomDealerSeat, "randomDealerSeat");
function splitDeal(deck, handSize, nestSize) {
  const needed = handSize * SEATS;
  if (deck.length < needed) throw new Error("DECK_TOO_SMALL");
  let nestCount = Math.max(0, deck.length - needed);
  if (nestCount < 1 && deck.length > needed) nestCount = deck.length - needed;
  if (deck.length >= needed + nestSize) nestCount = nestSize;
  const nest = deck.splice(0, nestCount);
  while (deck.length > needed) nest.push(deck.pop());
  const hands = [];
  for (let seat = 0; seat < SEATS; seat++) hands.push(deck.splice(0, handSize));
  return { hands, nest };
}
__name(splitDeal, "splitDeal");
__name2(splitDeal, "splitDeal");
function dealHand({
  rules: ruleOptions = {},
  handSize = DEFAULT_HAND_SIZE,
  nestSize = DEFAULT_NEST_SIZE,
  misdealOnNoCounters = true,
  deckFactory = makeDeck,
  shuffle = secureShuffle
} = {}) {
  if (!Number.isInteger(handSize) || handSize < 1) throw new Error("INVALID_HAND_SIZE");
  if (!Number.isInteger(nestSize) || nestSize < 0) throw new Error("INVALID_NEST_SIZE");
  const rules = resolveRules(ruleOptions);
  const maxAttempts = misdealOnNoCounters ? MAX_DEAL_ATTEMPTS : 1;
  let deal;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const deck = shuffle(deckFactory(rules));
    deal = splitDeal(deck, handSize, nestSize);
    deal.attempts = attempt;
    const anyEmptyCounterHand = deal.hands.some((hand) => !hand.some((card) => cardPoints(card, rules) > 0));
    if (!misdealOnNoCounters || !anyEmptyCounterHand || attempt === maxAttempts) return deal;
  }
  return deal;
}
__name(dealHand, "dealHand");
__name2(dealHand, "dealHand");
function firstActorSeat(dealer) {
  const value = Number(dealer);
  return (Number.isFinite(value) ? value + 1 : 0) % SEATS;
}
__name(firstActorSeat, "firstActorSeat");
__name2(firstActorSeat, "firstActorSeat");
var SEATS2 = 4;
function passedCount(status) {
  return status.filter((value) => value === "pass").length;
}
__name(passedCount, "passedCount");
__name2(passedCount, "passedCount");
function nextActiveSeat(currentPlayer, status) {
  for (let step = 1; step <= SEATS2; step++) {
    const seat = (currentPlayer + step) % SEATS2;
    if (status[seat] !== "pass") return seat;
  }
  return null;
}
__name(nextActiveSeat, "nextActiveSeat");
__name2(nextActiveSeat, "nextActiveSeat");
function finish(state, event) {
  return { accepted: true, event, state: { ...state, phase: "discard" } };
}
__name(finish, "finish");
__name2(finish, "finish");
function allPassed(state, options) {
  if (options.screwTheDealer && !(state.players?.[state.dealer]?.isBot && options.shootMoonEnabled && options.minBid === options.maxBid)) {
    const bid = options.minBid;
    const bidStatus = [...state.bidStatus];
    bidStatus[state.dealer] = bid;
    return {
      accepted: true,
      event: "dealer-forced-bid",
      state: {
        ...state,
        phase: "discard",
        bidder: state.dealer,
        bid,
        highestBid: bid,
        bidStatus,
        passCount: passedCount(state.bidStatus)
      }
    };
  }
  return {
    accepted: true,
    event: "all-passed-redeal",
    state: { ...state, phase: "redeal" }
  };
}
__name(allPassed, "allPassed");
__name2(allPassed, "allPassed");
function applyBid(input, seat, submittedValue, rawOptions = {}) {
  const rules = rawOptions.rules || {};
  const derivedMaxBid = makeDeck(rules).reduce((sum, card) => sum + cardPoints(card, rules), 0);
  const options = {
    minBid: 100,
    shootMoonEnabled: false,
    screwTheDealer: false,
    scores: rawOptions.scores ?? input?.scores ?? [0, 0],
    ...rawOptions,
    maxBid: Number.isInteger(rawOptions.maxBid) ? rawOptions.maxBid : derivedMaxBid
  };
  const state = {
    bidStatus: [null, null, null, null],
    highestBid: options.minBid - 5,
    bid: 0,
    bidder: -1,
    shotTheMoon: false,
    ...input
  };
  if (!state || state.phase !== "bidding") return { accepted: false, reason: "NOT_BIDDING", state: input };
  if (state.paused) return { accepted: false, reason: "PAUSED", state: input };
  if ((options.auctionOpen ?? state.auctionOpen) === false) return { accepted: false, reason: "AUCTION_NOT_OPEN", state: input };
  if (!Number.isInteger(seat) || seat < 0 || seat >= SEATS2) return { accepted: false, reason: "INVALID_SEAT", state: input };
  if (seat !== state.currentPlayer) return { accepted: false, reason: "NOT_YOUR_TURN", state: input };
  if (state.bidStatus[seat] === "pass") return { accepted: false, reason: "ALREADY_PASSED", state: input };
  const value = submittedValue === 0 ? 0 : typeof submittedValue === "number" || typeof submittedValue === "string" ? Number(submittedValue) : NaN;
  if (!Number.isInteger(value)) return { accepted: false, reason: "INVALID_BID", state: input };
  if (value !== 0) {
    const high = Number.parseInt(state.highestBid ?? state.bid, 10);
    if (value <= high || value > options.maxBid || value % 5 !== 0) {
      return { accepted: false, reason: "ILLEGAL_BID", state: input };
    }
    const isMoonBid = !!options.shootMoonEnabled && value === options.maxBid;
    if (isMoonBid && state.players?.[seat]?.isBot) return { accepted: false, reason: "BOT_MOON_FORBIDDEN", state: input };
    const team = seat % 2;
    const next2 = {
      ...state,
      highestBid: value,
      bid: value,
      bidder: seat,
      bidStatus: [...state.bidStatus],
      shotTheMoon: isMoonBid
    };
    next2.bidStatus[seat] = value;
    if (isMoonBid) return finish(next2, "moon-bid-won-auction");
    if (value === options.maxBid) return finish(next2, "maximum-bid-won-auction");
    return advanceOrFinish(next2, options, "bid-accepted");
  }
  const next = {
    ...state,
    bidStatus: [...state.bidStatus]
  };
  next.bidStatus[seat] = "pass";
  const passes = passedCount(next.bidStatus);
  next.passCount = passes;
  if (next.bidder >= 0 && passes >= 3) return finish(next, "auction-won-by-high-bidder");
  if (passes >= 4) return allPassed(next, options);
  return advanceOrFinish(next, options, "player-passed");
}
__name(applyBid, "applyBid");
__name2(applyBid, "applyBid");
function advanceOrFinish(state, options, event) {
  const passed = passedCount(state.bidStatus);
  if (state.bidder >= 0 && passed >= 3) return finish(state, "auction-won-by-high-bidder");
  if (passed >= 4) return allPassed(state, options);
  const nextSeat = nextActiveSeat(state.currentPlayer, state.bidStatus);
  if (nextSeat === null) {
    return state.bidder >= 0 ? finish(state, "auction-won-by-high-bidder") : allPassed(state, options);
  }
  const next = { ...state, currentPlayer: nextSeat };
  if (next.bidder >= 0 && next.bidStatus.every((status, index) => index === next.bidder || status === "pass")) {
    return finish(next, "auction-won-by-high-bidder");
  }
  return { accepted: true, event, state: next };
}
__name(advanceOrFinish, "advanceOrFinish");
__name2(advanceOrFinish, "advanceOrFinish");
var clone = /* @__PURE__ */ __name2((value) => structuredClone(value), "clone");
var teamForSeat = /* @__PURE__ */ __name2((seat) => seat % 2, "teamForSeat");
var DEFAULT_GAME_OPTIONS = Object.freeze({
  targetScore: 500,
  handSize: 10,
  nestSize: 6,
  minBid: 100,
  includeOnes: DEFAULT_RULES.includeOnes,
  revealTopNest: true,
  openWidow: false,
  shootMoonEnabled: false,
  screwTheDealer: false,
  leadOrder: "bidder",
  nestGoesTo: "lastTrick",
  bidOnlyScoring: false,
  sandbagging: false,
  misdealOnNoCounters: true,
  layDownWinningCards: true
});
function normalizeOptions(options = {}) {
  const ruleOptions = { ...options.rules || {} };
  for (const key of [
    "includeOnes",
    "includeRed2",
    "red2Points",
    "includeRed1",
    "includeRook",
    "onesHigh",
    "rookLowest",
    "specialsAnytime",
    "mustTrumpWhenVoid"
  ]) {
    if (options[key] !== void 0) ruleOptions[key] = options[key];
  }
  return {
    ...DEFAULT_GAME_OPTIONS,
    ...options,
    rules: resolveRules(ruleOptions)
  };
}
__name(normalizeOptions, "normalizeOptions");
__name2(normalizeOptions, "normalizeOptions");
function dealState(state, dealer, handNumber, shuffleOverride) {
  const deal = dealHand({
    rules: state.settings.rules,
    handSize: state.settings.handSize,
    nestSize: state.settings.nestSize,
    misdealOnNoCounters: state.settings.misdealOnNoCounters,
    shuffle: shuffleOverride
  });
  return {
    ...state,
    handNumber,
    dealer,
    phase: "bidding",
    hands: deal.hands,
    nest: deal.nest,
    nestPreview: null,
    nestCards: null,
    nestRevealCards: null,
    widowSpread: [],
    discardCount: 0,
    bidder: -1,
    bid: 0,
    highestBid: state.settings.minBid - 5,
    bidStatus: [null, null, null, null],
    passCount: 0,
    shotTheMoon: false,
    claimDeclined: false,
    trump: null,
    currentPlayer: firstActorSeat(dealer),
    trick: [],
    ledColor: null,
    tricksTaken: [[], []],
    topNestCard: state.settings.revealTopNest ? deal.nest[0] || null : null,
    dealAttempts: deal.attempts,
    lastSummary: null,
    lastTrickWinner: null
  };
}
__name(dealState, "dealState");
__name2(dealState, "dealState");
function createMatch(seats, options = {}, testHooks = {}) {
  if (!Array.isArray(seats) || seats.length !== 4 || seats.some((s) => !s || typeof s.playerId !== "string" || !s.playerId || typeof s.name !== "string" || !s.name.trim())) {
    throw new Error("FOUR_PLAYERS_REQUIRED");
  }
  if (new Set(seats.map((s) => s.playerId)).size !== 4) throw new Error("DUPLICATE_PLAYER_ID");
  const settings = normalizeOptions(options);
  if (!Number.isInteger(settings.targetScore) || settings.targetScore < 1) throw new Error("INVALID_TARGET_SCORE");
  if (!Number.isInteger(settings.minBid) || settings.minBid < 1 || settings.minBid % 5 !== 0) throw new Error("INVALID_MIN_BID");
  if (!(/* @__PURE__ */ new Set(["bidder", "leftOfBidder", "rightOfBidder"])).has(settings.leadOrder)) throw new Error("INVALID_LEAD_ORDER");
  if (!(/* @__PURE__ */ new Set(["lastTrick", "bidder"])).has(settings.nestGoesTo)) throw new Error("INVALID_NEST_DESTINATION");
  const state = {
    settings,
    players: seats.map((player, seat) => ({
      seat,
      playerId: String(player.playerId),
      name: player.name.trim().slice(0, 40),
      team: teamForSeat(seat),
      isBot: player.isBot === true,
      avatar: player.avatar,
      voice: player.voice
    })),
    scores: [0, 0],
    sandbagOverpoints: [0, 0],
    matchResult: null,
    handNumber: 1
  };
  state.career = freshCloudCareer(state.players);
  const dealer = Number.isInteger(testHooks.dealer) ? testHooks.dealer : randomDealerSeat();
  return dealState(state, dealer, 1, testHooks.shuffle);
}
__name(createMatch, "createMatch");
__name2(createMatch, "createMatch");
function prepareDiscard(state) {
  const hand = state.hands[state.bidder];
  const nest = state.nest;
  if (!hand || state.bidder < 0) throw new Error("INVALID_BIDDER");
  const hands = state.hands.map((cards, seat) => seat === state.bidder ? [...cards, ...nest] : cards);
  return {
    ...state,
    phase: "discard",
    hands,
    nestPreview: clone(nest),
    nest: [],
    nestCards: null,
    nestRevealCards: null,
    topNestCard: null,
    widowSpread: state.settings.openWidow ? clone(nest) : [],
    discardCount: nest.length,
    currentPlayer: state.bidder
  };
}
__name(prepareDiscard, "prepareDiscard");
__name2(prepareDiscard, "prepareDiscard");
function submitBid(state, seat, value) {
  const result = applyBid(state, seat, value, {
    minBid: state.settings.minBid,
    shootMoonEnabled: state.settings.shootMoonEnabled,
    screwTheDealer: state.settings.screwTheDealer,
    scores: state.scores,
    rules: state.settings.rules
  });
  if (!result.accepted) return result;
  if (result.state.phase === "discard") return { ...result, state: prepareDiscard(result.state) };
  return result;
}
__name(submitBid, "submitBid");
__name2(submitBid, "submitBid");
function discardCards(state, seat, requestedIds) {
  if (state.phase !== "discard") return { accepted: false, reason: "NOT_DISCARDING", state };
  if (seat !== state.bidder) return { accepted: false, reason: "NOT_BIDDER", state };
  if (!Array.isArray(requestedIds)) return { accepted: false, reason: "INVALID_DISCARD", state };
  const ids = [...new Set(requestedIds.map((value) => String(value)))];
  if (ids.length !== state.discardCount) return { accepted: false, reason: "WRONG_DISCARD_COUNT", state };
  const requested = new Set(ids);
  const hand = state.hands[seat];
  const discarded = hand.filter((card) => requested.has(String(card.id)));
  if (discarded.length !== state.discardCount) return { accepted: false, reason: "CARD_NOT_IN_HAND", state };
  const remaining = hand.filter((card) => !requested.has(String(card.id)));
  const hands = state.hands.map((cards, index) => index === seat ? remaining : cards);
  const snapshot = clone(discarded);
  return {
    accepted: true,
    event: "discard-complete",
    state: {
      ...state,
      phase: "trump",
      hands,
      nestCards: snapshot,
      nestRevealCards: clone(snapshot),
      nestDiscardCount: snapshot.length,
      currentPlayer: seat
    }
  };
}
__name(discardCards, "discardCards");
__name2(discardCards, "discardCards");
function chooseTrump(state, seat, color) {
  if (state.phase !== "trump") return { accepted: false, reason: "NOT_CHOOSING_TRUMP", state };
  if (seat !== state.bidder) return { accepted: false, reason: "NOT_BIDDER", state };
  if (!COLORS.includes(color)) return { accepted: false, reason: "INVALID_TRUMP", state };
  let currentPlayer;
  if (state.settings.leadOrder === "bidder") currentPlayer = state.bidder;
  else if (state.settings.leadOrder === "rightOfBidder") currentPlayer = (state.bidder + 3) % 4;
  else currentPlayer = (state.bidder + 1) % 4;
  return {
    accepted: true,
    event: "trump-chosen",
    state: {
      ...state,
      phase: "play",
      trump: color,
      currentPlayer,
      trick: [],
      ledColor: null,
      tricksTaken: [[], []]
    }
  };
}
__name(chooseTrump, "chooseTrump");
__name2(chooseTrump, "chooseTrump");
function matchResult(scores, target) {
  const [a, b] = scores;
  if (a >= target || b >= target) {
    if (a >= target && b >= target) return a === b ? "Tie" : a > b ? "Team A" : "Team B";
    return a >= target ? "Team A" : "Team B";
  }
  if (a <= -target || b <= -target) {
    if (a <= -target && b <= -target) return a === b ? "Tie" : a > b ? "Team A" : "Team B";
    return a <= -target ? "Team B" : "Team A";
  }
  return null;
}
__name(matchResult, "matchResult");
__name2(matchResult, "matchResult");
function finishHand(state, lastWinner) {
  const settings = state.settings;
  const nestTeam = settings.nestGoesTo === "bidder" ? state.bidder % 2 : lastWinner % 2;
  const tricksTaken = state.tricksTaken.map((cards) => [...cards]);
  if (state.nestCards?.length) tricksTaken[nestTeam].push(...state.nestCards);
  const pointsA = tricksTaken[0].reduce((sum, card) => sum + cardPoints(card, settings.rules), 0);
  const pointsB = tricksTaken[1].reduce((sum, card) => sum + cardPoints(card, settings.rules), 0);
  const expected = makeDeck(settings.rules).reduce((sum, card) => sum + cardPoints(card, settings.rules), 0);
  if (pointsA + pointsB !== expected) throw new Error("COUNTER_TOTAL_MISMATCH");
  const bidderTeam = state.bidder % 2;
  const makerPoints = bidderTeam === 0 ? pointsA : pointsB;
  const opponentPoints = bidderTeam === 0 ? pointsB : pointsA;
  const scores = [...state.scores];
  const sandbagOverpoints = [...state.sandbagOverpoints];
  let made = makerPoints >= state.bid;
  let makerDelta = -state.bid;
  let sandbagOverAdded = 0;
  let sandbagDeduction = 0;
  if (made) {
    makerDelta = makerPoints;
    if (settings.bidOnlyScoring) makerDelta = state.bid;
    else if (settings.sandbagging && makerPoints > state.bid) {
      sandbagOverAdded = Math.floor((makerPoints - state.bid) / 10) * 10;
      sandbagOverpoints[bidderTeam] += sandbagOverAdded;
      const wholePenalties = Math.floor(sandbagOverpoints[bidderTeam] / 100);
      if (wholePenalties > 0) {
        sandbagDeduction = wholePenalties * 100;
        sandbagOverpoints[bidderTeam] %= 100;
      }
      makerDelta -= sandbagDeduction;
    }
  }
  scores[bidderTeam] += makerDelta;
  scores[1 - bidderTeam] += opponentPoints;
  let shotMoonResult = null;
  if (state.shotTheMoon) {
    shotMoonResult = made ? "made" : "failed";
    if (made) {
      const bonus = Math.max(0, settings.targetScore - scores[bidderTeam]);
      scores[bidderTeam] += bonus;
      makerDelta += bonus;
    }
  }
  const moonWinner = made ? bidderTeam : 1 - bidderTeam;
  const result = state.shotTheMoon ? moonWinner === 0 ? "Team A" : "Team B" : matchResult(scores, settings.targetScore);
  const summary = {
    pointsA,
    pointsB,
    bid: state.bid,
    bidderTeam,
    made,
    trump: state.trump,
    scores,
    scoreDeltaA: bidderTeam === 0 ? makerDelta : opponentPoints,
    scoreDeltaB: bidderTeam === 1 ? makerDelta : opponentPoints,
    shotTheMoon: !!state.shotTheMoon,
    shotMoonResult,
    sandbagOverAdded,
    sandbagDeduction,
    nestTeam,
    matchResult: result
  };
  return {
    ...state,
    phase: result ? "complete" : "score",
    scores,
    sandbagOverpoints,
    tricksTaken,
    nestTeam,
    lastTrickWinner: lastWinner,
    matchResult: result,
    lastSummary: summary,
    career: cloudCareerFinish(state, summary, lastWinner)
  };
}
__name(finishHand, "finishHand");
__name2(finishHand, "finishHand");
function cardIsDefiniteWinner(state, card, seat) {
  if (!state?.hands || !card) return false;
  const { trump, settings } = state;
  const ledColor = isTrumpCard(card, trump, settings.rules) ? trump || card.color : card.color;
  if (!ledColor) return false;
  for (let opponentSeat = 0; opponentSeat < 4; opponentSeat++) {
    if (opponentSeat === seat) continue;
    const opponentHand = state.hands[opponentSeat] || [];
    const mustFollow = opponentHand.some((candidate) => followsLedSuit(candidate, ledColor, trump, settings.rules));
    for (const opponentCard of opponentHand) {
      if (!opponentCard) continue;
      if (isTrumpCard(card, trump, settings.rules)) {
        if (isTrumpCard(opponentCard, trump, settings.rules) && compareCards(opponentCard, card, trump, trump, settings.rules) > 0) return false;
        continue;
      }
      if (opponentCard.color === card.color && compareCards(opponentCard, card, card.color, trump, settings.rules) > 0) return false;
      if (!mustFollow && isTrumpCard(opponentCard, trump, settings.rules)) return false;
    }
  }
  return true;
}
__name(cardIsDefiniteWinner, "cardIsDefiniteWinner");
__name2(cardIsDefiniteWinner, "cardIsDefiniteWinner");
function getRemainingClaim(state) {
  if (!state || !state.settings.layDownWinningCards || state.phase !== "play" || state.claimDeclined || state.trick?.length || !state.hands) return null;
  const remaining = state.hands.reduce((sum, hand) => sum + (hand?.length || 0), 0);
  if (remaining < 2 || Math.max(...state.hands.map((hand) => hand?.length || 0)) <= 1) return null;
  const force = [];
  for (let seat = 0; seat < 4; seat++) {
    const hand = state.hands[seat] || [];
    const opponentsHaveCards = state.hands.reduce((sum, other, index) => sum + (index === seat ? 0 : other?.length || 0), 0);
    if (hand.length && (!opponentsHaveCards || hand.every((card) => cardIsDefiniteWinner(state, card, seat)))) {
      force.push(seat);
    }
  }
  const trumpHolders = [];
  for (let seat = 0; seat < 4; seat++) {
    if ((state.hands[seat] || []).some((card) => isTrumpCard(card, state.trump, state.settings.rules))) trumpHolders.push(seat);
  }
  const trumpHolder = trumpHolders.length === 1 ? trumpHolders[0] : null;
  if (force.length === 1) {
    const seat = force[0];
    return { seat, reason: trumpHolder === seat ? "trumps" : "rest" };
  }
  if (trumpHolder !== null && force.includes(trumpHolder)) return { seat: trumpHolder, reason: "trumps" };
  return null;
}
__name(getRemainingClaim, "getRemainingClaim");
__name2(getRemainingClaim, "getRemainingClaim");
function claimRemainingCards(state, seat) {
  const claim = getRemainingClaim(state);
  if (!claim || claim.seat !== seat || state.currentPlayer !== seat) {
    return { accepted: false, reason: "CLAIM_NOT_AVAILABLE", state };
  }
  const claimCards = [
    ...(state.trick || []).map((entry) => clone(entry.card)),
    ...state.hands.flat().map(clone)
  ];
  const tricksTaken = state.tricksTaken.map((cards) => [...cards]);
  tricksTaken[state.players[seat].team].push(...claimCards);
  const claimed = {
    ...state,
    career: cloudCareerCapture(state,seat,claimCards,{tricks:state.hands[seat].length,claim:true,plays:[...(state.trick||[]),...state.hands.flatMap((cards,player)=>cards.map(card=>({player,card})))]}),
    hands: [[], [], [], []],
    trick: [],
    ledColor: null,
    currentPlayer: seat,
    tricksTaken,
    lastTrickWinner: seat
  };
  return {
    accepted: true,
    event: "remaining-cards-claimed",
    reason: claim.reason,
    state: finishHand(claimed, seat)
  };
}
__name(claimRemainingCards, "claimRemainingCards");
__name2(claimRemainingCards, "claimRemainingCards");
function declineRemainingClaim(state, seat) {
  const claim = getRemainingClaim(state);
  if (!claim || claim.seat !== seat || state.currentPlayer !== seat) {
    return { accepted: false, reason: "CLAIM_NOT_AVAILABLE", state };
  }
  return {
    accepted: true,
    event: "remaining-claim-declined",
    state: { ...state, claimDeclined: true }
  };
}
__name(declineRemainingClaim, "declineRemainingClaim");
__name2(declineRemainingClaim, "declineRemainingClaim");
function playCard(state, seat, cardId) {
  if (state.phase !== "play") return { accepted: false, reason: "NOT_PLAYING", state };
  if (seat !== state.currentPlayer) return { accepted: false, reason: "NOT_YOUR_TURN", state };
  const hand = state.hands[seat];
  const index = hand.findIndex((card2) => String(card2.id) === String(cardId));
  if (index < 0) return { accepted: false, reason: "CARD_NOT_IN_HAND", state };
  const card = hand[index];
  if (!canPlay(card, hand, state.ledColor, state.trump, state.settings.rules)) {
    return { accepted: false, reason: "ILLEGAL_CARD", state };
  }
  const hands = state.hands.map((cards) => [...cards]);
  hands[seat].splice(index, 1);
  const trick = [...state.trick, { player: seat, card: clone(card) }];
  let ledColor = state.ledColor;
  if (!ledColor) {
    ledColor = card.color === "rook" || isRed2(card) || isRed1(card) ? state.trump : card.color;
  }
  if (trick.length < 4) {
    return {
      accepted: true,
      event: "card-played",
      state: { ...state, hands, trick, ledColor, currentPlayer: (seat + 1) % 4 }
    };
  }
  let winner = trick[0];
  for (let i = 1; i < trick.length; i++) {
    if (compareCards(trick[i].card, winner.card, ledColor, state.trump, state.settings.rules) > 0) winner = trick[i];
  }
  const winnerTeam = winner.player % 2;
  const tricksTaken = state.tricksTaken.map((cards) => [...cards]);
  tricksTaken[winnerTeam].push(...trick.map((entry) => clone(entry.card)));
  const next = {
    ...state,
    career: cloudCareerCapture(state,winner.player,trick.map(p=>p.card),{plays:trick}),
    hands,
    trick: [],
    ledColor: null,
    currentPlayer: winner.player,
    tricksTaken,
    lastTrickWinner: winner.player
  };
  if (hands.every((cards) => cards.length === 0)) {
    return { accepted: true, event: "hand-complete", state: finishHand(next, winner.player) };
  }
  return { accepted: true, event: "trick-complete", state: next };
}
__name(playCard, "playCard");
__name2(playCard, "playCard");
function redeal(state) {
  if (state.phase !== "redeal") return { accepted: false, reason: "NOT_REDEALING", state };
  return { accepted: true, event: "redeal-started", state: dealState(state, state.dealer, state.handNumber) };
}
__name(redeal, "redeal");
__name2(redeal, "redeal");
function startNextHand(state) {
  if (state.phase !== "score") return { accepted: false, reason: "NOT_READY_FOR_NEXT_HAND", state };
  if (state.matchResult) return { accepted: false, reason: "MATCH_COMPLETE", state };
  return {
    accepted: true,
    event: "next-hand-started",
    state: dealState(state, (state.dealer + 3) % 4, state.handNumber + 1)
  };
}
__name(startNextHand, "startNextHand");
__name2(startNextHand, "startNextHand");
function playerView(state, seat) {
  if (!Number.isInteger(seat) || seat < 0 || seat >= 4) throw new Error("INVALID_SEAT");
  const bidderView = seat === state.bidder;
  const remainingClaim = getRemainingClaim(state);
  return {
    phase: state.phase,
    revision: state.revision,
    handNumber: state.handNumber,
    players: state.players.map(({ seat: playerSeat, name, team, isBot, avatar, voice }) => ({ seat: playerSeat, name, team, isBot: !!isBot, avatar, voice })),
    dealer: state.dealer,
    currentPlayer: state.currentPlayer,
    hand: clone(state.hands[seat]),
    handCounts: state.hands.map((hand) => hand.length),
    bid: state.bid,
    highestBid: state.highestBid,
    bidder: state.bidder,
    bidStatus: clone(state.bidStatus),
    passCount: state.passCount,
    trump: state.trump,
    trick: clone(state.trick),
    ledColor: state.ledColor,
    // Captured card values are public, so expose only the two team totals.
    // The approved game's bidding dock needs these to show live bid progress.
    handPoints: state.tricksTaken.map(
      (cards) => cards.reduce((sum, card) => sum + cardPoints(card, state.settings.rules), 0)
    ),
    scores: [...state.scores],
    targetScore: state.settings.targetScore,
    rules: state.settings.rules,
    revealTopNest: state.settings.revealTopNest,
    shotTheMoon: !!state.shotTheMoon,
    shootMoonEnabled: state.settings.shootMoonEnabled,
    nestCount: state.nest.length,
    discardCount: bidderView && state.phase === "discard" ? state.discardCount : null,
    topNestCard: state.phase === "bidding" && state.settings.revealTopNest ? clone(state.topNestCard) : null,
    nestPreview: bidderView && state.phase === "discard" ? clone(state.nestPreview) : null,
    widowSpread: state.settings.openWidow && state.phase === "discard" ? clone(state.widowSpread) : [],
    nestCards: ["score", "complete"].includes(state.phase) ? clone(state.nestCards) : null,
    lastSummary: ["score", "complete"].includes(state.phase) ? clone(state.lastSummary) : null,
    matchResult: state.matchResult,
    canClaimRemaining: !!remainingClaim && remainingClaim.seat === seat && state.currentPlayer === seat,
    remainingClaimReason: remainingClaim?.seat === seat && state.currentPlayer === seat ? remainingClaim.reason : null
  };
}
__name(playerView, "playerView");
__name2(playerView, "playerView");
function chooseTestBotAction(state, seat) {
  const hand = state.hands[seat] || [];
  if (state.phase === "bidding") {
    const partner = (seat + 2) % 4;
    if (state.bidder === partner) return { type: "bid", value: 0 };
    const total = makeDeck(state.settings.rules).reduce((sum, card) => sum + cardPoints(card, state.settings.rules), 0);
    const deckCap = total - (state.settings.shootMoonEnabled ? 5 : 0);
    const next = state.highestBid < state.settings.minBid ? state.settings.minBid : state.highestBid + 5;
    const points = hand.reduce((sum, card) => sum + cardPoints(card, state.settings.rules), 0);
    const honors = hand.reduce((sum, card) => sum + (effectiveRank(card, state.settings.rules) >= 13 ? 1 : 0), 0);
    const trumpLength = COLORS.reduce((best, color) => Math.max(
      best,
      hand.filter((card) => card.color === color && !isPermanentTrump(card, state.settings.rules)).length
    ), 0);
    const estimate = points + honors * 7 + trumpLength * 5;
    return { type: "bid", value: next <= deckCap && estimate >= next * 0.72 ? next : 0 };
  }
  if (state.phase === "discard") {
    if (seat !== state.bidder) return null;
    const trump = state.trump || COLORS[0];
    const count = state.discardCount || 0;
    const ordered = [...hand].sort((a, b) => {
      const score = /* @__PURE__ */ __name2((card) => cardPoints(card, state.settings.rules) * 100 + (isTrumpCard(card, trump, state.settings.rules) ? 1e4 : 0) + effectiveRank(card, state.settings.rules), "score");
      return score(a) - score(b);
    });
    return { type: "discard", cardIds: ordered.slice(0, count).map((card) => card.id) };
  }
  if (state.phase === "trump") {
    if (seat !== state.bidder) return null;
    const color = [...COLORS].sort((a, b) => {
      const value = /* @__PURE__ */ __name2((color2) => hand.filter((card) => card.color === color2 && !isPermanentTrump(card, state.settings.rules)).length * 10 + hand.filter((card) => card.color === color2).reduce((sum, card) => sum + effectiveRank(card, state.settings.rules), 0), "value");
      return value(b) - value(a);
    })[0];
    return { type: "trump", color };
  }
  if (state.phase === "play") {
    const legal = hand.filter((card) => canPlay(card, hand, state.ledColor, state.trump, state.settings.rules));
    if (!legal.length) return null;
    if (!state.trick.length) {
      legal.sort((a, b) => cardPoints(a, state.settings.rules) - cardPoints(b, state.settings.rules) || effectiveRank(a, state.settings.rules) - effectiveRank(b, state.settings.rules));
      return { type: "play", cardId: legal[0].id };
    }
    let winner = state.trick[0];
    for (const entry of state.trick.slice(1)) {
      if (compareCards(entry.card, winner.card, state.ledColor, state.trump, state.settings.rules) > 0) winner = entry;
    }
    const partnerWinning = winner.player % 2 === seat % 2;
    const ranked = legal.map((card) => ({
      card,
      beats: compareCards(card, winner.card, state.ledColor, state.trump, state.settings.rules) > 0
    })).sort((a, b) => effectiveRank(a.card, state.settings.rules) - effectiveRank(b.card, state.settings.rules));
    const pick = partnerWinning ? ranked.find((item) => !item.beats) || ranked[0] : ranked.find((item) => item.beats) || ranked[0];
    return { type: "play", cardId: pick.card.id };
  }
  return null;
}
__name(chooseTestBotAction, "chooseTestBotAction");
__name2(chooseTestBotAction, "chooseTestBotAction");
var clone2 = /* @__PURE__ */ __name2((value) => structuredClone(value), "clone");
function validateIdentity(playerId, displayName) {
  if (typeof playerId !== "string" || !playerId.trim() || playerId.length > 128) throw new Error("INVALID_PLAYER_ID");
  if (typeof displayName !== "string" || !displayName.trim() || displayName.length > 40) throw new Error("INVALID_DISPLAY_NAME");
}
__name(validateIdentity, "validateIdentity");
__name2(validateIdentity, "validateIdentity");
var HOUSE_BOT_PERSONAS = Object.freeze({ "Crow": "crow", "Blaze": "blaze", "Nix": "nix", "Titan": "titan", "Pike": "pike", "Drift": "drift", "Dice": "dice", "Anchor": "anchor", "Wager": "wager", "Hollow": "hollow", "Ember": "ember", "Vex": "vex", "Frost": "frost", "Fang": "fang", "Halo": "halo", "Quill": "quill", "Bramble": "bramble", "Moss": "moss", "Emberlyn": "emberlyn", "Cinder": "cinder", "Gable": "gable", "Thistle": "thistle", "Marrow": "marrow", "Pebble": "pebble", "Rookery": "rookery", "Sable": "sable", "Finch": "finch", "Dagger": "dagger", "Willow": "willow", "Hearth": "hearth", "Grit": "grit", "Copper": "copper", "Moth": "moth", "Brandy": "brandy", "Flint": "flint", "Ivy": "ivy", "Shade": "shade", "Barrel": "barrel", "Spark": "spark", "Nettle": "nettle", "Cobalt": "cobalt", "Ash": "ash", "Harrier": "harrier", "Claire": "claire", "June": "june", "Tess": "tess", "Marcus": "marcus", "Owen": "owen", "Daniel": "daniel", "Sofia": "sofia", "Rafael": "rafael", "Samir": "samir", "Jerome": "jerome_founder", "Rita": "rita" });
var RoomService = class {
  static {
    __name(this, "RoomService");
  }
  static {
    __name2(this, "RoomService");
  }
  constructor(storage, { tokenFactory = /* @__PURE__ */ __name2(() => crypto.randomUUID(), "tokenFactory"), randomIndex = secureRandomIndex } = {}) {
    this.storage = storage;
    this.tokenFactory = tokenFactory;
    this.randomIndex = randomIndex;
  }
  async create(roomId, hostId, displayName, avatar = "cinder", voice = "avatar", pace = 1) {
    if (![1, 3, 99].includes(pace)) throw Error("INVALID_PACE");
    validateIdentity(hostId, displayName);
    if (await this.storage.get(roomId)) throw new Error("ROOM_EXISTS");
    const token = this.tokenFactory();
    const room = {
      id: roomId,
      pace,
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
  async moveSeat(roomId, token, { seat, expectedRevision }) {
    const room = await this.#room(roomId);
    const current = this.#authorizedSeat(room, token);
    if (room.status !== "waiting" || room.gameState || room.hands) throw Error("ROOM_NOT_JOINABLE");
    if (current === 0) throw Error("HOST_SEAT_FIXED");
    if (!Number.isInteger(seat) || seat < 1 || seat > 3) throw Error("INVALID_SEAT");
    if (seat === current) return this.snapshot(roomId, token);
    if (room.seats[seat] !== null) throw Error("SEAT_OCCUPIED");
    if (expectedRevision !== room.revision) throw Error("STALE_REVISION");
    room.seats[seat] = room.seats[current];
    room.seats[current] = null;
    room.revision += 1;
    room.lastActivityAt = Date.now();
    await this.storage.put(roomId, room);
    return this.snapshot(roomId, token);
  }
  async fillOpenSeatsWithBots(roomId, token, requestedSeat) {
    const room = await this.#room(roomId);
    const hostSeat = this.#authorizedSeat(room, token);
    if (hostSeat !== 0) throw new Error("HOST_ONLY");
    if (room.status !== "waiting") throw new Error("ROOM_NOT_JOINABLE");
    const open = room.seats.map((entry, seat) => entry === null ? seat : -1).filter((seat) => seat >= 0);
    if (!open.length) return this.snapshot(roomId, token);
    if (requestedSeat !== void 0) {
      if (!Number.isInteger(requestedSeat) || requestedSeat < 1 || requestedSeat > 3) throw Error("INVALID_SEAT");
      if (room.seats[requestedSeat] !== null) throw Error("SEAT_OCCUPIED");
    }
    for (const seat of requestedSeat === void 0 ? open : [requestedSeat]) {
      const available = Object.entries(HOUSE_BOT_PERSONAS).filter(([name2, avatar2]) => !room.seats.some((p) => p && (p.avatar === avatar2 || p.displayName?.toLowerCase() === name2.toLowerCase())));
      if (!available.length) throw Error("NO_UNIQUE_BOT");
      const selected = available[this.randomIndex(available.length)];
      const [name, avatar] = selected;
      room.seats[seat] = {
        playerId: `private-test-bot-${seat}`,
        // Retain existing internal bot identity.
        displayName: name,
        token: null,
        isBot: true,
        avatar
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
      avatar: entry.avatar,
      voice: entry.voice
    })), options);
    room.status = "playing";
    for (const entry of room.seats) if (entry && !entry.isBot && !Number.isFinite(entry.lastSeenAt)) entry.lastSeenAt = Date.now();
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
    return this.#applyGameAction(roomId, token, action, "next-hand", (game, seat) => seat === 0 ? startNextHand(game) : { accepted: false, reason: "HOST_ONLY" }, null);
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
    return {roomCode:room.id,revision:room.revision,phase:room.status,
      seats:room.seats.map((p,seat)=>({seat,team:seat%2,name:p?.displayName||null,occupied:!!p,isBot:p?.isBot===true,
        joinable:seat>0&&room.status==="waiting"&&(!p||(p.isBot===true&&p.token===null&&!room.gameState&&!room.hands))}))};
  }
  async snapshot(roomId, token) {
    let room = await this.#room(roomId);
    this.#authorizedSeat(room, token);
    await this.#driveBots(roomId);
    room = await this.#room(roomId);
    if (room.gameState) return this.#gameSnapshot(room, token);
    const seat = this.#authorizedSeat(room, token);
    if (room.status === "waiting") {
      return {
        phase: "waiting",
        viewerSeat: seat,
        pace: room.pace || 1,
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
          avatar: player?.avatar,
          voice: player?.voice
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
      pace: room.pace || 1,
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
  async setBotSeat(roomId, token, { seat, name, expectedRevision }) {
    const room = await this.#room(roomId);
    if (this.#authorizedSeat(room, token) !== 0) throw Error("HOST_ONLY");
    if (room.status !== "waiting") throw Error("ROOM_NOT_JOINABLE");
    if (expectedRevision !== room.revision) throw Error("STALE_REVISION");
    if (!Number.isInteger(seat) || seat < 1 || seat > 3) throw Error("INVALID_SEAT");
    const old = room.seats[seat];
    if (old && !old.isBot) throw Error("HUMAN_SEAT_RESERVED");
    if (name === null) {
      room.seats[seat] = null;
    } else {
      const pool = HOUSE_BOT_PERSONAS;
      const avatar = pool[name];
      if (!Object.prototype.hasOwnProperty.call(pool, name)) throw Error("INVALID_BOT");
      if (room.seats.some((p, i) => i !== seat && p && (p.avatar === avatar || p.displayName === name))) throw Error("BOT_ALREADY_SEATED");
      room.seats[seat] = { playerId: `private-test-bot-${seat}`, displayName: name, avatar, isBot: true, token: null };
    }
    room.revision++;
    room.lastActivityAt = Date.now();
    await this.storage.put(roomId, room);
    return this.snapshot(roomId, token);
  }
  async presence(roomId, token, heartbeat = true) {
    const room = await this.#room(roomId);
    const seat = this.#authorizedSeat(room, token), entry = room.seats[seat];
    entry.lastSeenAt = Date.now();
    if (entry.reconnectBy) { delete entry.reconnectBy; room.revision++; }
    if (heartbeat) entry.presenceProtocol = true;
    if (entry.autoPlaying) {
      delete entry.autoPlaying;
      const player = room.gameState?.players[seat];
      if (player) { player.isBot = false; player.name = entry.displayName; }
      delete room.botTurn;
      room.revision++;
    }
    await this.storage.put(roomId, room);
  }
  async reconcilePresence(roomId, connectedTokens = []) {
    const room = await this.#room(roomId);
    if (room.status !== "playing") return;
    let changed = false;
    for (let seat = 0; seat < 4; seat++) {
      const entry = room.seats[seat];
      if (!entry || entry.isBot || entry.autoPlaying) continue;
      // Legacy clients use their open socket until they load the heartbeat client.
      if (!entry.presenceProtocol && connectedTokens.includes(entry.token)) continue;
      if (!Number.isFinite(entry.lastSeenAt)) { entry.lastSeenAt = Date.now(); changed = true; }
      if (!entry.reconnectBy && Date.now() >= entry.lastSeenAt + GUEST_HEARTBEAT_TIMEOUT_MS) {
        entry.reconnectBy = entry.lastSeenAt + GUEST_HEARTBEAT_TIMEOUT_MS + GUEST_RECONNECT_MS;
        room.revision++;
        changed = true;
      }
      if (!entry.reconnectBy || Date.now() < entry.reconnectBy) continue;
      entry.autoPlaying = true;
      const player = room.gameState.players[seat];
      player.isBot = true;
      player.name = (seat === 0 && /^you$/i.test(entry.displayName) ? "Host" : entry.displayName) + " (bot)";
      room.revision++;
      delete room.botTurn;
      changed = true;
    }
    if (changed) await this.storage.put(roomId, room);
    await this.#driveBots(roomId);
  }
  async leave(roomId, token) {
    const room = await this.#room(roomId);
    if (typeof token === "string" && room.departed?.includes(token)) return { status: "left" };
    const seat = this.#authorizedSeat(room, token);
    if (seat === 0) throw Error("HOST_MUST_CLOSE_TABLE");
    const used = room.seats.filter((p, i) => p && i !== seat);
    const [name, avatar] = Object.entries(HOUSE_BOT_PERSONAS).find(([name, avatar]) =>
      !used.some(p => p.avatar === avatar || p.displayName === name));
    const bot = { playerId: "replacement-bot-" + crypto.randomUUID(), displayName: name, avatar, voice: "avatar", isBot: true, token: null };
    room.departed = [...(room.departed || []), token].slice(-32);
    room.seats[seat] = bot;
    if (room.gameState) Object.assign(room.gameState.players[seat], {
      playerId: bot.playerId, name, avatar, voice: bot.voice, isBot: true
    });
    delete room.botTurn;
    room.revision++;
    room.lastActivityAt = Date.now();
    await this.storage.put(roomId, room);
    await this.#driveBots(roomId);
    return { status: "left", seat };
  }
  async readyForBidding(roomId, token, handNumber, openingId) {
    const room = await this.#room(roomId);
    const seat = this.#authorizedSeat(room, token);
    if (room.gameState?.handNumber !== handNumber) throw Error("STALE_DEAL");
    if (openingId && room.opening && openingId !== room.opening.id) throw Error("STALE_DEAL");
    if (room.opening && !room.opening.readySeats.includes(seat)) {
      room.opening.readySeats.push(seat);
      await this.storage.put(roomId, room);
    }
    await this.#driveBots(roomId);
    return this.#gameSnapshot(await this.#room(roomId), token);
  }
  async setPace(roomId, token, pace) {
    const room = await this.#room(roomId);
    if (this.#authorizedSeat(room, token) !== 0) throw Error("HOST_ONLY");
    if (![1, 3, 99].includes(pace)) throw Error("INVALID_PACE");
    if (room.pace !== pace) {
      room.pace = pace;
      room.revision++;
      room.lastActivityAt = Date.now();
      delete room.botTurn;
      await this.storage.put(roomId, room);
    }
    await this.#driveBots(roomId);
    return this.snapshot(roomId, token);
  }
  async closeTable(roomId, token) {
    const room = await this.storage.get(roomId);
    if (!room) throw Error("ROOM_NOT_FOUND");
    if (this.#authorizedSeat(room, token) !== 0) throw Error("HOST_ONLY");
    if (room.status !== "closed") {
      room.status = "closed";
      room.closedAt = Date.now();
      room.lastActivityAt = Date.now();
      room.revision++;
      await this.storage.put(roomId, room);
    }
    return { status: "closed" };
  }
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
    if (room.status === "closed") throw Error("ROOM_CLOSED");
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
      viewerSeat: seat,
      careerEvents: clone2((room.gameState.career?.events||[]).filter(e=>!room.trickOpening&&!room.claimOpening||e.hand<(room.gameState.career?.events?.length||0))),
      connections: room.seats.flatMap((p, index) => p && !p.isBot && (p.reconnectBy || p.autoPlaying)
        ? [{seat:index, name:index === 0 && /^you$/i.test(p.displayName) ? "Host" : p.displayName, state:p.autoPlaying ? "bot" : "reconnecting", remainingMs:p.autoPlaying ? 0 : Math.max(0,p.reconnectBy-Date.now())}] : []),
      botIntelligence: onlineX1Proof(room),
      phase: room.claimOpening ? "play" : room.trickOpening ? "play" : room.opening ? "dealing" : room.gameState.phase,
      ...room.trickOpening ? { trick: clone2(room.trickOpening.trick), ledColor: room.trickOpening.ledColor, lastTrickWinner: room.trickOpening.winner, currentPlayer: room.trickOpening.winner, resolvingTrick: true, resolvingTrickPoints: room.trickOpening.points, scores: room.trickOpening.scores, lastSummary: null, matchResult: null, nestCards: null, canClaimRemaining: false } : {},
      ...room.claimOpening ? { claimAnimation: { player: room.claimOpening.player, cards: clone2(room.claimOpening.cards), reason: room.claimOpening.reason }, resolvingTrick: true, resolvingTrickPoints: 0, canClaimRemaining: false, scores: room.claimOpening.scores, lastSummary: null, matchResult: null, nestCards: null } : {},
      claimDeclined: !!room.gameState.claimDeclined,
      recentTricks: clone2(room.recentTricks || []),
      trumpPresentationMs: room.trumpOpening?.durationMs || cloudStampDuration(room),
      trumpOpening: room.trumpOpening ? { handNumber: room.trumpOpening.handNumber, remainingMs: Math.max(0, room.trumpOpening.expiresAt - Date.now()) } : null,
      opening: room.opening ? { id: room.opening.id, handNumber: room.opening.handNumber, minimumRemainingMs: Math.max(0, room.opening.notBefore - Date.now()), deadlineRemainingMs: Math.max(0, room.opening.expiresAt - Date.now()) } : null,
      pace: room.pace || 1,
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
    if (room.claimOpening && Date.now() < room.claimOpening.expiresAt) throw Error("CLAIM_IN_PROGRESS");
    if (room.trickOpening && Date.now() < room.trickOpening.expiresAt) throw Error("TRICK_IN_PROGRESS");
    if (room.opening) throw Error("DEAL_IN_PROGRESS");
    if (room.trumpOpening && Date.now() < room.trumpOpening.expiresAt) throw Error("TRUMP_IN_PROGRESS");
    if (action.expectedRevision !== room.revision) throw new Error("STALE_REVISION");
    const result = transition(room.gameState, seat, value);
    if (!result.accepted) throw new Error(result.reason || "INVALID_ACTION");
    if (room.gameState.phase === "trump" && result.state.phase === "play") beginCloudTrump(room);
    beginCloudCollection(room, result);
    beginCloudClaim(room, result);
    observeOnlineX1(room, room.gameState, result);
    room.gameState = result.state;
    if ((type === "next-hand" || type === "redeal") && room.gameState.phase === "bidding") beginCloudOpening(room);
    room.revision += 1;
    room.lastActivityAt = Date.now();
    if (room.gameState.phase === "complete" && !room.trickOpening && !room.claimOpening) room.status = "complete";
    const response = { accepted: true, event: result.event, revision: room.revision, status: room.status };
    room.actions[actionId] = { seat, fingerprint, result: response };
    await this.storage.put(roomId, room);
    await this.#driveBots(roomId);
    return { ...response, revision: (await this.#room(roomId)).revision };
  }
  async #driveBots(roomId) {
    for (let steps = 0; steps < 500; steps += 1) {
      const room = await this.#room(roomId);
      if (room.opening) {
        const o = room.opening;
        const allReady = room.seats.every((seat2, index) => botControls(seat2) || o.readySeats.includes(index));
        if (Date.now() < o.notBefore || !allReady && Date.now() < o.expiresAt) return;
        delete room.opening;
        room.revision++;
        await this.storage.put(roomId, room);
      }
      if (room.trumpOpening) {
        if (Date.now() < room.trumpOpening.expiresAt) return;
        delete room.trumpOpening;
        room.revision++;
        await this.storage.put(roomId, room);
      }
      if (room.trickOpening) {
        if (Date.now() < room.trickOpening.expiresAt) return;
        delete room.trickOpening;
        room.revision++;
        if (room.gameState.phase === "complete") room.status = "complete";
        await this.storage.put(roomId, room);
      }
      if (room.claimOpening) {
        if (Date.now() < room.claimOpening.expiresAt) return;
        delete room.claimOpening;
        room.revision++;
        if (room.gameState.phase === "complete") room.status = "complete";
        await this.storage.put(roomId, room);
      }
      const state = room.gameState;
      if (room.status !== "playing" || !state || !["bidding", "discard", "trump", "play"].includes(state.phase)) return;
      const seat = state.currentPlayer;
      if (!botControls(room.seats[seat])) return;
      if (["bidding", "discard", "trump", "play"].includes(state.phase)) {
        const key = `${state.handNumber}:${room.revision}:${seat}`;
        if (room.botTurn?.key !== key) {
          room.botTurn = { key, due: Date.now() + cloudDelay(room, state.phase === "bidding" ? 1600 : 1200, state.phase === "bidding" ? 160 : 120) };
          await this.storage.put(roomId, room);
          return;
        }
        if (Date.now() < room.botTurn.due) return;
        delete room.botTurn;
      }
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
      if (room.gameState.phase === "trump" && result.state.phase === "play") beginCloudTrump(room);
      beginCloudCollection(room, result);
      beginCloudClaim(room, result);
      observeOnlineX1(room, state, result, decision);
      room.gameState = result.state;
      room.revision += 1;
      room.lastActivityAt = Date.now();
      if (room.gameState.phase === "complete" && !room.trickOpening && !room.claimOpening) room.status = "complete";
      await this.storage.put(roomId, room);
    }
    throw new Error("TEST_BOT_ACTION_LIMIT");
  }
};
var CLIENT_HTML = '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <meta name="color-scheme" content="dark">\n  <title>Griffin House of Rooks \u2014 Private Room Test</title>\n  <style>\n    :root { color-scheme: dark; font: 16px/1.45 system-ui, sans-serif; background: #151310; color: #f5eee2; }\n    * { box-sizing: border-box; }\n    body { margin: 0 auto; max-width: 760px; padding: 20px 14px 48px; }\n    h1 { font-size: 1.4rem; margin: 0; }\n    h2 { font-size: 1.12rem; margin: 0 0 10px; }\n    p { margin: 8px 0; }\n    .muted { color: #c5b9a6; }\n    .note, .panel { padding: 14px; border: 1px solid #514532; border-radius: 12px; background: #211e19; margin: 12px 0; }\n    .note { border-color: #99773d; background: #282116; }\n    label { display: block; margin: 10px 0 5px; color: #e0d4c1; }\n    input, button, select { font: inherit; color: inherit; padding: 10px 11px; border-radius: 8px; border: 1px solid #7c6948; background: #171613; }\n    input { width: 100%; }\n    button { background: #332b1f; cursor: pointer; }\n    button:disabled { opacity: .45; cursor: default; }\n    .row { display: flex; flex-wrap: wrap; gap: 9px; align-items: center; }\n    .row > * { flex: 1 1 140px; }\n    .seats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }\n    .seat { background: #171613; border: 1px solid #514532; border-radius: 9px; padding: 10px; }\n    .active { border-color: #e2bb62; box-shadow: inset 0 0 0 1px #e2bb62; }\n    .badge { color: #e6c677; }\n    .cards { display: flex; flex-wrap: wrap; gap: 7px; }\n    .card { min-width: 60px; min-height: 78px; padding: 8px; border-radius: 8px; background: #f1e8d6; color: #211e19; border: 2px solid #b8975b; font-weight: 700; }\n    .card.selected { outline: 3px solid #e2bb62; transform: translateY(-3px); }\n    .red { color: #b32628; }\n    .green { color: #267348; }\n    .yellow { color: #8c7018; }\n    .black, .rook { color: #282828; }\n    .feed { min-height: 42px; padding: 10px; background: #171613; border-radius: 8px; color: #d8c9ac; }\n    #table { display: none; }\n    @media (max-width: 420px) { body { padding: 16px 10px 36px; } .panel { padding: 12px; } }\n  </style>\n</head>\n<body>\n  <h1>Griffin House of Rooks</h1>\n  <div class="muted">Private four-player online room test</div>\n  <div class="note"><b>Private test only.</b> This page connects to an isolated test server. It is not the live 5:31 game. The access key is held only in this browser tab; never share it publicly.</div>\n\n  <section class="panel" id="setup">\n    <h2>Connect to the private test</h2>\n    <label for="server">Test server address</label><input id="server" type="url" placeholder="https://your-private-test.workers.dev" autocomplete="url">\n    <label for="gate">Private test access key</label><input id="gate" type="password" autocomplete="off">\n    <label for="name">Your name at the table</label><input id="name" maxlength="40" autocomplete="nickname" placeholder="Name">\n    <div class="row" style="margin-top:12px"><button id="create">Create a private room</button></div>\n    <label for="roomCode">Or enter a room code</label><input id="roomCode" maxlength="8" autocapitalize="characters" placeholder="8-character code">\n    <div class="row" style="margin-top:12px"><button id="join">Join room</button><button id="resume" hidden>Reconnect to my room</button></div>\n    <p id="setupMessage" class="feed" role="status">Enter your name and the room code from the host phone.</p>\n    <p class="muted">Your room code and a private reconnect token are saved on this phone so a refresh can reconnect you. Career records are not stored.</p>\n  </section>\n\n  <section id="table">\n    <div class="panel row"><div><b>Room <span id="roomLabel"></span></b><div id="phase" class="badge"></div></div><button id="leave">Disconnect this phone</button></div>\n    <section class="panel"><h2>Players</h2><div id="seats" class="seats"></div></section>\n    <section class="panel"><h2>Score</h2><div id="scores"></div><div id="round" class="muted"></div><p id="summary"></p></section>\n    <section class="panel"><h2>Cards on the table</h2><div id="trick" class="feed"></div></section>\n    <section class="panel"><h2>Your private hand</h2><div id="hand" class="cards"></div><div id="handHint" class="muted" style="margin:8px 0"></div><div id="controls" class="row"></div></section>\n    <p id="message" class="feed" role="status"></p>\n  </section>\n  <script>\n    const $ = (selector) => document.querySelector(selector);\n    const credKey = "griffin-rooks-private-test-seat-v1";\n    let creds = null, snapshot = null, selected = new Set(), busy = false, timer = null;\n    let pollJob = null, minimumRevision = -1, connecting = false;\n    const esc = (value) => String(value ?? "").replace(/[&<>"\']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",\'"\':"&quot;", "\'":"&#39;"}[char]));\n    const roomPath = (action = "") => `/rooms/${encodeURIComponent(creds.roomCode)}${action ? `/${action}` : ""}`;\n    function server() {\n      const value = $("#server").value.trim().replace(/\\/$/, "");\n      if (!value) return "";\n      const parsed = new URL(value);\n      if (parsed.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(parsed.hostname)) {\n        throw new Error("Use a secure https:// test server address.");\n      }\n      return parsed.origin;\n    }\n    function gate() { return $("#gate").value; }\n    async function request(path, { method = "GET", body, token = creds?.token } = {}) {\n      const headers = { "X-Test-Gate-UTF8": encodeURIComponent(gate()) };\n      if (token) headers.Authorization = `Bearer ${token}`;\n      if (body !== undefined) headers["Content-Type"] = "application/json";\n      const url = new URL(`${server()}${path}`);\n      // Each private snapshot must reach the authoritative room, never an old cache entry.\n      if (method === "GET") url.searchParams.set("_fresh", crypto.randomUUID());\n      const controller = new AbortController();\n      const timeout = setTimeout(() => controller.abort(), 12000);\n      try {\n        const response = await fetch(url.toString(), { method, headers, cache: "no-store", signal: controller.signal, body: body === undefined ? undefined : JSON.stringify(body) });\n        const data = await response.json().catch(() => ({}));\n        if (!response.ok) throw new Error(data.error || `HTTP_${response.status}`);\n        return data;\n      } catch (error) {\n        if (error.name === "AbortError") throw new Error("Connection timed out. Your saved seat is safe. Try again.");\n        throw error;\n      } finally { clearTimeout(timeout); }\n    }\n    function explain(error) {\n      const messages = {\n        ROOM_FULL: "All four seats are held by people. Check the room code on the host phone.",\n        ROOM_NOT_JOINABLE: "This game has already started. Only players with a saved seat can reconnect.",\n        ROOM_NOT_FOUND: "This room has expired or the code is incorrect. Check the host phone for its current room code.",\n        PLAYER_ALREADY_SEATED: "This player already has a reserved seat. Use the same browser that originally joined, then tap Reconnect to my room.",\n        TEST_ACCESS_REQUIRED: "Private access was not accepted. Enter the existing private test access key on this device.",\n        UNAUTHORIZED: "This saved seat could not be verified. Keep your saved data and check that you are using the original browser.",\n        HOST_ONLY: "Only the phone that created this room can do that."\n      };\n      return messages[error.message] || error.message;\n    }\n    function saveCredentials() {\n      localStorage.setItem(credKey, JSON.stringify({ roomCode: creds.roomCode, seat: creds.seat, token: creds.token, playerId: creds.playerId, server: server() }));\n      $("#resume").hidden = false;\n    }\n    function say(message) {\n      $("#message").textContent = message;\n      $("#setupMessage").textContent = message;\n      const botMessage = $("#botMessage");\n      if (botMessage) botMessage.textContent = message;\n    }\n    function setConnected() { $("#setup").style.display = "none"; $("#table").style.display = "block"; $("#roomLabel").textContent = creds.roomCode; }\n    function savedSeat() {\n      try { return JSON.parse(localStorage.getItem(credKey) || "null"); } catch { return null; }\n    }\n    function adoptCredentials(value) {\n      clearInterval(timer);\n      creds = value; snapshot = null; minimumRevision = -1; pollJob = null; busy = false; selected.clear();\n    }\n    function receiveSnapshot(incoming, owner = creds) {\n      if (!owner || creds !== owner || !incoming?.phase || !Number.isInteger(incoming.revision)) return false;\n      if (incoming.revision < minimumRevision || (snapshot && incoming.revision < snapshot.revision)) return false;\n      minimumRevision = Math.max(minimumRevision, incoming.revision);\n      if (snapshot?.revision === incoming.revision) return true;\n      snapshot = incoming; render(); return true;\n    }\n    async function finishConnection(message) {\n      const owner = creds;\n      const incoming = await request(roomPath("snapshot"), { token: owner.token });\n      if (!receiveSnapshot(incoming, owner)) return;\n      setConnected(); startPolling(); say(message);\n    }\n    async function createRoom() {\n      const name = $("#name").value.trim();\n      if (!server() || !gate() || !name) throw new Error("Enter the test server, access key, and your table name first.");\n      const playerId = localStorage.getItem("griffin-rooks-private-test-player-v1") || crypto.randomUUID();\n      localStorage.setItem("griffin-rooks-private-test-player-v1", playerId);\n      const result = await request("/rooms", { method: "POST", body: { playerId, displayName: name }, token: null });\n      adoptCredentials({ roomCode: result.roomCode, seat: result.seat, token: result.token, playerId });\n      saveCredentials();\n      await finishConnection("Room created. Share this room code. Another phone can join a test bot\'s seat until you start the game.");\n    }\n    async function joinRoom() {\n      const name = $("#name").value.trim(), code = $("#roomCode").value.replace(/\\s/g, "").toUpperCase();\n      if (!server() || !gate() || !name || !/^(?:[A-Z]{3}[0-9]{2,4}|[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8})$/.test(code)) throw new Error("Enter the test server, access key, your name, and the table code from the host phone.");\n      const saved = savedSeat();\n      const resume = saved?.roomCode === code && saved.server === server() && typeof saved.token === "string" && saved.token && typeof saved.playerId === "string" ? saved : null;\n      const playerId = resume?.playerId || localStorage.getItem("griffin-rooks-private-test-player-v1") || crypto.randomUUID();\n      localStorage.setItem("griffin-rooks-private-test-player-v1", playerId);\n      const result = await request(`/rooms/${encodeURIComponent(code)}/join`, { method: "POST", token: null, body: { playerId, displayName: name, ...(resume ? { resumeToken: resume.token } : {}) } });\n      adoptCredentials({ roomCode: code, seat: result.seat, token: result.token, playerId });\n      saveCredentials(); await finishConnection(resume ? "Reconnected to your reserved seat." : "You joined the room.");\n    }\n    async function reconnect() {\n      const saved = savedSeat();\n      if (!saved) throw new Error("No saved room is available on this phone.");\n      $("#server").value = saved.server || "";\n      if (!gate()) throw new Error("Enter the private access key to reconnect.");\n      adoptCredentials(saved);\n      await finishConnection("Reconnected to your reserved seat.");\n    }\n    async function refresh(force = false) {\n      const owner = creds;\n      if (!owner) return false;\n      if (!force && pollJob?.owner === owner) return pollJob.promise;\n      const job = { owner, promise: null };\n      pollJob = job;\n      job.promise = (async () => {\n        try { return receiveSnapshot(await request(roomPath("snapshot"), { token: owner.token }), owner); }\n        catch (error) { if (creds === owner) say(`Connection issue: ${explain(error)}`); return false; }\n        finally { if (pollJob === job) pollJob = null; }\n      })();\n      return job.promise;\n    }\n    function startPolling() { clearInterval(timer); timer = setInterval(() => refresh(), 1400); }\n    async function connect(action) {\n      if (connecting) return;\n      connecting = true;\n      ["#create", "#join", "#resume"].forEach(id => { $(id).disabled = true; });\n      say("Connecting to the private room\u2026");\n      try { await action(); } catch (error) { say(explain(error)); }\n      finally { connecting = false; ["#create", "#join", "#resume"].forEach(id => { $(id).disabled = false; }); }\n    }\n    function cardName(card) {\n      if (!card) return "?";\n      if (card.id === "rook" || card.color === "rook") return "ROOK";\n      if (card.specialRed1 || card.id === "red1-special") return "RED 1";\n      if (card.id === "red-2") return "RED 2";\n      return `${card.color.toUpperCase()} ${card.rank === 14 ? "14" : card.rank}`;\n    }\n    function cardMarkup(card, index, isSelectable) {\n      const color = card.color === "rook" ? "rook" : card.color;\n      const chosen = selected.has(String(card.id));\n      return `<button class="card ${color} ${chosen ? "selected" : ""}" ${isSelectable ? `data-card="${esc(card.id)}"` : "disabled"}>${esc(cardName(card))}</button>`;\n    }\n    function actionControls() {\n      const s = snapshot, mine = creds.seat, isTurn = s.currentPlayer === mine, isBidder = s.bidder === mine;\n      const out = [];\n      const button = (label, action, disabled = false) => `<button data-action="${action}" ${disabled ? "disabled" : ""}>${label}</button>`;\n      if (s.phase === "waiting") out.push(button("Start game", "start", s.occupiedSeats.length !== 4 || mine !== 0));\n      if (s.phase === "bidding" && isTurn) {\n        out.push(`<label>Bid (enter 0 to pass)<input id="bidValue" type="number" min="0" step="5" value="${Math.max(0, Number(s.highestBid) + 5)}"></label>${button("Submit bid / pass", "bid")}`);\n      }\n      if (s.phase === "discard" && isBidder) out.push(button(`Discard selected cards (${selected.size}/${s.discardCount})`, "discard", selected.size !== s.discardCount));\n      if (s.phase === "trump" && isBidder) out.push(`<label>Choose trump<select id="trumpValue"><option value="green">Green</option><option value="red">Red</option><option value="yellow">Yellow</option><option value="black">Black</option></select></label>${button("Set trump", "trump")}`);\n      if (s.phase === "play" && isTurn) {\n        out.push(button("Play selected card", "play", selected.size !== 1));\n        if (s.canClaimRemaining) { out.push(button("Claim the remaining cards", "claim")); out.push(button("Keep playing", "decline")); }\n      }\n      if (s.phase === "redeal") out.push(button("Deal again", "redeal", mine !== 0));\n      if (s.phase === "score") out.push(button(s.matchResult ? "Match complete" : "Next hand", "next", !!s.matchResult));\n      return out.join("");\n    }\n    function render() {\n      if (!snapshot) return;\n      const s = snapshot;\n      $("#phase").textContent = `${s.phase.toUpperCase()} \xB7 Hand ${s.handNumber} \xB7 revision ${s.revision}`;\n      $("#seats").innerHTML = s.players.map(p => `<div class="seat ${p.seat === s.currentPlayer && ["bidding","play"].includes(s.phase) ? "active" : ""}"><b>Seat ${p.seat + 1}</b><br>${esc(p.name)}<br><span class="muted">Team ${p.team === 0 ? "A" : "B"} \xB7 ${s.handCounts[p.seat]} cards${p.seat === s.dealer ? " \xB7 dealer" : ""}${p.seat === s.bidder ? " \xB7 bidder" : ""}</span></div>`).join("");\n      let fillButton = document.getElementById("fillBotsBtn");\n      if (!fillButton) {\n        fillButton = document.createElement("button");\n        fillButton.id = "fillBotsBtn";\n        fillButton.type = "button";\n        fillButton.style.width = "100%";\n        fillButton.style.marginTop = "10px";\n        fillButton.addEventListener("click", () => takeAction("fillBots"));\n        $("#seats").insertAdjacentElement("afterend", fillButton);\n      }\n      const humanCount = s.players.filter(p => p.occupied && !p.isBot).length;\n      const openCount = 4 - s.occupiedSeats.length;\n      fillButton.hidden = creds.seat !== 0 || s.phase !== "waiting" || openCount < 1;\n      fillButton.disabled = busy;\n      fillButton.textContent = busy ? "Please wait\u2026" : "Fill open seats with bots";\n      let botMessage = $("#botMessage");\n      if (!botMessage) {\n        botMessage = document.createElement("p");\n        botMessage.id = "botMessage";\n        botMessage.setAttribute("role", "status");\n        botMessage.className = "muted";\n        fillButton.insertAdjacentElement("afterend", botMessage);\n      }\n      botMessage.hidden = creds.seat !== 0 || s.phase !== "waiting";\n      $("#scores").textContent = `Team A: ${s.scores[0]}  \xB7  Team B: ${s.scores[1]}  \xB7  First to ${s.targetScore}`;\n      $("#round").textContent = `Bid ${s.bid || "\u2014"} \xB7 Trump ${s.trump || "not chosen"} \xB7 ${s.passCount} passes`;\n      $("#summary").textContent = s.matchResult ? `Result: ${s.matchResult}` : (s.lastSummary ? JSON.stringify(s.lastSummary) : "");\n      $("#trick").textContent = s.trick.length ? s.trick.map(t => `Seat ${t.player + 1}: ${cardName(t.card)}`).join("  \xB7  ") : "No cards on the table right now.";\n      const hand = s.hand || [];\n      const canSelect = (s.phase === "discard" && s.bidder === creds.seat) || (s.phase === "play" && s.currentPlayer === creds.seat);\n      if (!canSelect) selected.clear();\n      $("#hand").innerHTML = hand.length ? hand.map((card, index) => cardMarkup(card, index, canSelect)).join("") : "<span class=\'muted\'>No cards to show.</span>";\n      $("#handHint").textContent = s.phase === "discard" ? (s.bidder === creds.seat ? `Choose exactly ${s.discardCount} cards to put in the nest.` : `Waiting for ${esc(s.players[s.bidder]?.name || "the bidder")} to discard the nest.`) : s.phase === "play" ? (s.currentPlayer === creds.seat ? `It is your turn. Led color: ${s.ledColor || "none"}.` : `Waiting for ${esc(s.players[s.currentPlayer]?.name || "the next player")} to play.`) : s.phase === "bidding" ? `Highest bid: ${s.highestBid}. ${s.currentPlayer === creds.seat ? "It is your turn to bid or pass." : `Waiting for ${esc(s.players[s.currentPlayer]?.name || "the next player")} to bid or pass.`}` : "";\n      $("#controls").innerHTML = actionControls();\n      $("#hand").querySelectorAll("[data-card]").forEach(el => el.addEventListener("click", () => {\n        const id = el.dataset.card;\n        if (selected.has(id)) selected.delete(id);\n        else if (snapshot.phase === "discard" && selected.size >= snapshot.discardCount) {\n          say(`You have selected ${snapshot.discardCount} cards. Tap a selected card to deselect it before choosing another.`);\n          return;\n        } else selected.add(id);\n        render();\n      }));\n      $("#controls").querySelectorAll("[data-action]").forEach(el => el.addEventListener("click", () => takeAction(el.dataset.action)));\n    }\n    async function takeAction(type) {\n      if (busy || !snapshot) return;\n      busy = true;\n      const owner = creds;\n      try {\n        // Read only the controls belonging to this action. Other phases have\n        // no bid/trump inputs; reading them used to throw before the request.\n        const routes = { fillBots: "fill-bots", start: "start", bid: "bid", discard: "discard", trump: "trump", play: "play", claim: "claim-remaining", decline: "decline-claim", redeal: "redeal", next: "next-hand" };\n        const route = routes[type];\n        if (!route) throw new Error("Unknown table action.");\n        let data = {};\n        if (type === "bid") data = { value: Number($("#bidValue").value) };\n        else if (type === "discard") data = { cardIds: [...selected] };\n        else if (type === "trump") data = { color: $("#trumpValue").value };\n        else if (type === "play") data = { cardId: [...selected][0] };\n        const payload = { actionId: crypto.randomUUID(), expectedRevision: snapshot.revision, ...data };\n        const fillButton = $("#fillBotsBtn");\n        if (fillButton) { fillButton.disabled = true; fillButton.textContent = "Please wait\u2026"; }\n        say(type === "fillBots" ? "Adding House bots to the open seats\u2026" : "Sending your action\u2026");\n        const result = await request(roomPath(route), { method: "POST", body: payload, token: owner.token });\n        if (creds !== owner) return;\n        if (Number.isInteger(result.revision)) minimumRevision = Math.max(minimumRevision, result.revision);\n        // Fill returns the fresh table itself; show it immediately even if a poll is in flight.\n        receiveSnapshot(result, owner);\n        selected.clear();\n        say(type === "fillBots" ? "Test bots added. Tap Start game below your hand." : "Action accepted.");\n        await refresh(true);\n      } catch (error) {\n        if (creds !== owner) return;\n        say(`Action not accepted: ${explain(error)}. Refreshing the table\u2026`);\n        await refresh(true);\n      } finally {\n        if (creds !== owner) return;\n        busy = false;\n        const fillButton = $("#fillBotsBtn");\n        if (fillButton) { fillButton.disabled = false; fillButton.textContent = "Fill open seats with bots"; }\n      }\n    }\n    $("#create").addEventListener("click", () => connect(createRoom));\n    $("#join").addEventListener("click", () => connect(joinRoom));\n    $("#resume").addEventListener("click", () => connect(reconnect));\n    $("#leave").addEventListener("click", () => { adoptCredentials(null); $("#table").style.display = "none"; $("#setup").style.display = "block"; say("Disconnected. Your seat is saved on this phone for reconnecting."); });\n    try {\n      const saved = JSON.parse(localStorage.getItem(credKey) || "null");\n      if (saved) { $("#server").value = saved.server || ""; $("#roomCode").value = saved.roomCode || ""; $("#resume").hidden = false; }\n    } catch { localStorage.removeItem(credKey); }\n    if (!$("#server").value && ["http:", "https:"].includes(location.protocol)) $("#server").value = location.origin;\n  <\/script>\n</body>\n</html>\n';
var FOUR_PLAYER_CHECK_HTML = '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1">\n  <meta name="color-scheme" content="dark">\n  <title>Griffin House of Rooks \u2014 Four player test</title>\n  <style>\n    :root { color-scheme: dark; font: 16px/1.5 system-ui,sans-serif; background:#151310; color:#f5eee2 }\n    * { box-sizing:border-box } body { max-width:760px; margin:0 auto; padding:22px 14px 48px }\n    h1 { font: bold 1.45rem/1.2 system-ui,sans-serif; margin:0 0 6px }\n    .panel { margin:14px 0; padding:14px; border:1px solid #514532; border-radius:12px; background:#211e19 }\n    .note { border-color:#99773d; background:#282116 }\n    label { display:block; margin:10px 0 5px }\n    input,button { width:100%; padding:11px; border-radius:8px; border:1px solid #7c6948; background:#171613; color:inherit; font:inherit }\n    button { margin-top:12px; background:#332b1f; cursor:pointer }\n    button:disabled { opacity:.5; cursor:wait }\n    #status { color:#e6c677; font-weight:700 }\n    #log { white-space:pre-wrap; overflow-wrap:anywhere; min-height:8em; padding:12px; border-radius:8px; background:#171613; color:#d8c9ac }\n    .small { color:#c5b9a6; font-size:.92rem }\n  </style>\n</head>\n<body>\n  <h1>Four player room check</h1>\n  <div class="small">A private test that runs four separate player identities and live connections from this one browser.</div>\n  <section class="panel note">\n    <b>Private test only.</b> This creates a test room, checks four live connections, plays it automatically, and leaves the room to expire. It does not touch the live game or save careers. If your private test session is already active, leave the key blank. Otherwise, enter the key; it is sent once over HTTPS and cleared from this page.\n  </section>\n  <section class="panel">\n    <label for="gate">Private test access key</label>\n    <input id="gate" type="password" autocomplete="off" autocapitalize="off">\n    <button id="run">Run four player test</button>\n    <p id="status" role="status">Ready</p>\n    <div id="log" aria-live="polite">The test will connect four live sockets, check synchronized private views and reconnect, then play through a complete match.</div>\n  </section>\n  <p class="small">This checks four simultaneous live connections to the deployed private room server from one browser. It does not prove four different phones, networks, or human players.</p>\n<script>\n(() => {\n  const $ = (s) => document.querySelector(s);\n  const logBox = $("#log"), statusBox = $("#status"), button = $("#run");\n  let actionNumber = 0;\n  let activeSockets = [];\n  const say = (line) => { logBox.textContent += `\\n${line}`; logBox.scrollTop = logBox.scrollHeight; };\n  const setStatus = (value) => { statusBox.textContent = value; };\n  async function api(path, { method = "GET", token, body } = {}) {\n    const headers = {};\n    if ($("#gate").value) headers["X-Test-Gate"] = $("#gate").value;\n    if (token) headers.Authorization = `Bearer ${token}`;\n    if (body !== undefined) headers["Content-Type"] = "application/json";\n    const response = await fetch(path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), cache:"no-store" });\n    const data = await response.json().catch(() => ({}));\n    if (!response.ok) throw new Error(data.error || `HTTP_${response.status}`);\n    return data;\n  }\n  const snap = (room, token) => api(`/rooms/${room}/snapshot`, { token });\n  const action = (room, seat, path, view, extra = {}, actionId = `poc-${++actionNumber}`) => api(`/rooms/${room}/${path}`, {\n    method:"POST", token:seat.token,\n    body:{ actionId, expectedRevision:view.revision, ...extra }\n  });\n  function isSpecial(card) { return card?.color === "rook" || card?.id === "rook" || card?.id === "red-2"; }\n  function isTrump(card, trump) { return isSpecial(card) || card?.color === trump; }\n  function follows(card, ledColor, trump) { return isSpecial(card) ? ledColor === trump : card?.color === ledColor; }\n  function canPlay(card, hand, ledColor, trump) {\n    if (!ledColor) return true;\n    const hasLed = hand.some(item => follows(item, ledColor, trump));\n    if (hasLed) return follows(card, ledColor, trump);\n    return true;\n  }\n  function collectStrings(value, found = []) {\n    if (typeof value === "string") found.push(value);\n    else if (Array.isArray(value)) value.forEach(item=>collectStrings(item,found));\n    else if (value && typeof value === "object") Object.values(value).forEach(item=>collectStrings(item,found));\n    return found;\n  }\n  async function postAction(room, seat, path, view, extra = {}) {\n    await action(room, seat, path, view, extra);\n    return snap(room, seat.token);\n  }\n  function waitForOpen(socket) {\n    return new Promise((resolve, reject) => {\n      const timer = setTimeout(() => reject(new Error("WebSocket open timed out.")), 8000);\n      socket.addEventListener("open", () => { clearTimeout(timer); resolve(); }, { once:true });\n      socket.addEventListener("error", () => { clearTimeout(timer); reject(new Error("WebSocket connection failed.")); }, { once:true });\n    });\n  }\n  async function openSeatSocket(room, seat) {\n    const {ticket} = await api(`/rooms/${room}/ws-ticket`, { method:"POST", token:seat.token, body:{} });\n    const url = new URL(`/rooms/${room}/ws`, location.href);\n    url.protocol = location.protocol === "https:" ? "wss:" : "ws:";\n    url.searchParams.set("ticket", ticket);\n    const socket = new WebSocket(url);\n    const buffered = [], waiting = [];\n    let closed = false;\n    socket.addEventListener("message", event => {\n      let message;\n      try { message = JSON.parse(event.data); } catch { return; }\n      const waiter = waiting.shift();\n      if (waiter) { clearTimeout(waiter.timer); waiter.resolve(message); }\n      else buffered.push(message);\n    });\n    socket.addEventListener("close", () => {\n      closed = true;\n      while (waiting.length) { const waiter = waiting.shift(); clearTimeout(waiter.timer); waiter.reject(new Error("WebSocket closed before the expected update.")); }\n    });\n    await waitForOpen(socket);\n    const nextSnapshot = () => new Promise((resolve, reject) => {\n      if (buffered.length) return resolve(buffered.shift());\n      if (closed) return reject(new Error("WebSocket is closed."));\n      const waiter = { resolve, reject, timer:setTimeout(() => {\n        const index = waiting.indexOf(waiter);\n        if (index >= 0) waiting.splice(index, 1);\n        reject(new Error("Timed out waiting for a WebSocket snapshot."));\n      }, 8000) };\n      waiting.push(waiter);\n    });\n    const first = await nextSnapshot();\n    if (first.type !== "snapshot" || !first.snapshot) throw new Error("WebSocket did not send its initial player snapshot.");\n    return { socket, nextSnapshot, first:first.snapshot };\n  }\n  function assertPrivateSnapshots(views) {\n    const hands = views.map(view => view.hand.map(card => card.id));\n    for (let i=0;i<4;i++) for (let j=0;j<4;j++) if (i!==j) {\n      const strings = collectStrings(views[i]);\n      for (const cardId of hands[j]) if (strings.includes(cardId)) throw new Error(`Seat ${i+1} live snapshot exposed another seat\'s card.`);\n    }\n  }\n  async function run() {\n    const gate = $("#gate").value;\n    if (gate) {\n      const session = await fetch("/cloud-game/launch", {\n        method:"POST", headers:{"Content-Type":"application/json"},\n        body:JSON.stringify({key:gate}), cache:"no-store", credentials:"same-origin"\n      });\n      if (!session.ok) throw new Error("Private test access was not accepted.");\n      $("#gate").value = "";\n    }\n    actionNumber = 0;\n    logBox.textContent = "Starting the isolated four player check\u2026";\n    setStatus("Connecting");\n    const playerIds = Array.from({length:4}, () => `auto-${crypto.randomUUID()}`);\n    const names = ["Test Player 1","Test Player 2","Test Player 3","Test Player 4"];\n    const created = await api("/rooms", { method:"POST", body:{ playerId:playerIds[0], displayName:names[0] } });\n    const room = created.roomCode;\n    const seats = [{ playerId:playerIds[0], seat:created.seat, token:created.token }];\n    say(`Room created: ${room}`);\n    for (let i=1;i<4;i++) {\n      const joined = await api(`/rooms/${room}/join`, { method:"POST", body:{playerId:playerIds[i],displayName:names[i]} });\n      seats.push({playerId:playerIds[i],seat:joined.seat,token:joined.token});\n    }\n    if (seats.map(s=>s.seat).join(",") !== "0,1,2,3") throw new Error("Seats were not assigned in order.");\n    say("PASS \u2014 four different identities received seats 1\u20134.");\n\n    const duplicateWithoutToken = await fetch(`/rooms/${room}/join`, {\n      method:"POST", headers:{"X-Test-Gate":$("#gate").value,"Content-Type":"application/json"},\n      body:JSON.stringify({playerId:playerIds[0],displayName:"Test Player 1"})\n    });\n    const duplicateBody = await duplicateWithoutToken.json().catch(()=>({}));\n    if (duplicateWithoutToken.ok || duplicateBody.error !== "PLAYER_ALREADY_SEATED") throw new Error("Duplicate seat claim was not rejected.");\n    say("PASS \u2014 a duplicate seat claim without the private resume token was rejected.");\n\n    const resumed = await api(`/rooms/${room}/join`, { method:"POST", body:{playerId:playerIds[0],displayName:names[0],resumeToken:seats[0].token} });\n    if (resumed.seat !== 0 || resumed.token !== seats[0].token) throw new Error("Reconnect did not return the same seat.");\n    say("PASS \u2014 reconnect credentials returned the original seat.");\n\n    const sockets = [];\n    for (const seat of seats) {\n      const client = await openSeatSocket(room,seat);\n      sockets.push(client);\n      activeSockets.push(client.socket);\n    }\n    const initialSocketViews = sockets.map(client=>client.first);\n    if (initialSocketViews.some((view,seat)=>view.phase!=="waiting" || view.players?.[seat]?.name!==names[seat])) {\n      throw new Error("Live connections did not receive the correct waiting-room seat views.");\n    }\n    say("PASS \u2014 four simultaneous WebSockets connected and each received its own seat view.");\n\n    await api(`/rooms/${room}/start`, { method:"POST", token:seats[0].token, body:{} });\n    let pushedViews = await Promise.all(sockets.map(client=>client.nextSnapshot()));\n    pushedViews = pushedViews.map(message=>message.snapshot);\n    if (pushedViews.some((view,index)=>view.phase!=="bidding" || view.hand.length!==10 || view.revision<=initialSocketViews[index].revision)) {\n      throw new Error("A live WebSocket did not receive the new dealt game state.");\n    }\n    assertPrivateSnapshots(pushedViews);\n    say("PASS \u2014 starting the deal pushed the updated state to every connection without exposing other hands.");\n\n    const interruptedSeat = 2;\n    await new Promise((resolve,reject)=>{\n      const socket=sockets[interruptedSeat].socket;\n      if (socket.readyState===WebSocket.CLOSED) return resolve();\n      const timer=setTimeout(()=>reject(new Error("The test connection did not close cleanly.")),3000);\n      socket.addEventListener("close",()=>{clearTimeout(timer);resolve();},{once:true});\n      socket.close(1000,"POC reconnect check");\n    });\n    const reconnected = await openSeatSocket(room,seats[interruptedSeat]);\n    const reconnectedView = reconnected.first;\n    if (reconnectedView.phase!==pushedViews[interruptedSeat].phase ||\n        reconnectedView.revision!==pushedViews[interruptedSeat].revision ||\n        JSON.stringify(reconnectedView.hand)!==JSON.stringify(pushedViews[interruptedSeat].hand)) {\n      throw new Error("A reconnected socket did not restore the same seat\'s current private view.");\n    }\n    sockets[interruptedSeat]=reconnected;\n    activeSockets[interruptedSeat]=reconnected.socket;\n    say("PASS \u2014 a closed connection rejoined the same seat and received its current private hand.");\n    for (const client of sockets) { try { client.socket.close(1000,"POC socket check complete"); } catch {} }\n    activeSockets = [];\n\n    let views = await Promise.all(seats.map(s=>snap(room,s.token)));\n    if (views.some(v=>v.phase!=="bidding" || v.hand.length!==10)) throw new Error("The room did not deal four private 10-card hands.");\n    const hands = views.map(v=>v.hand.map(card=>card.id));\n    if (new Set(hands.flat()).size !== 40 || views.some(v=>v.nestCount!==6)) throw new Error("The four hands and six-card nest were not dealt correctly.");\n    for (let i=0;i<4;i++) for (let j=0;j<4;j++) if (i!==j) {\n      const strings = collectStrings(views[i]);\n      for (const cardId of hands[j]) if (strings.includes(cardId)) throw new Error(`Seat ${i+1} snapshot exposed another seat\'s card.`);\n    }\n    say("PASS \u2014 server dealt 10 cards per player and each snapshot hid the other three hands.");\n\n    let completedHands = 0;\n    let totalPlays = 0;\n    const maxHands = 20;\n    while (true) {\n      setStatus(`Playing hand ${completedHands+1}`);\n      let view = await snap(room,seats[0].token);\n      if (view.phase === "bidding") {\n        let firstBid = true;\n        let guard = 0;\n        while (view.phase === "bidding" && guard++ < 8) {\n          const seat = seats[view.currentPlayer];\n          const own = await snap(room,seat.token);\n          if (firstBid) {\n            const id = `poc-${++actionNumber}`;\n            const [one,two] = await Promise.all([\n              action(room,seat,"bid",own,{value:100},id),\n              action(room,seat,"bid",own,{value:100},id)\n            ]);\n            if (!!one.duplicate === !!two.duplicate) throw new Error("A repeated simultaneous action was not handled exactly once.");\n            say("PASS \u2014 a simultaneous duplicate bid was recorded once.");\n            view = await snap(room,seat.token);\n          } else view = await postAction(room,seat,"bid",own,{value:0});\n          firstBid = false;\n        }\n      }\n      if (view.phase !== "discard") throw new Error(`Expected discard phase; got ${view.phase}.`);\n      const bidder = seats[view.bidder];\n      let own = await snap(room,bidder.token);\n      view = await postAction(room,bidder,"discard",own,{cardIds:own.hand.slice(0,own.discardCount).map(card=>card.id)});\n      if (view.phase !== "trump") throw new Error(`Expected trump phase; got ${view.phase}.`);\n      own = await snap(room,bidder.token);\n      view = await postAction(room,bidder,"trump",own,{color:"yellow"});\n\n      let handPlays = 0, guard = 0;\n      while (view.phase === "play" && guard++ < 48) {\n        const seat = seats[view.currentPlayer];\n        own = await snap(room,seat.token);\n        if (own.canClaimRemaining) {\n          view = await postAction(room,seat,"decline-claim",own);\n          continue;\n        }\n        const legal = own.hand.find(card=>canPlay(card,own.hand,own.ledColor,own.trump));\n        if (!legal) throw new Error(`No legal test move found for seat ${seat.seat+1}.`);\n        view = await postAction(room,seat,"play",own,{cardId:legal.id});\n        handPlays++; totalPlays++;\n      }\n      if (!["score","complete"].includes(view.phase) || handPlays !== 40) throw new Error(`Hand did not finish cleanly (phase ${view.phase}, plays ${handPlays}).`);\n      completedHands++;\n      say(`PASS \u2014 hand ${completedHands} finished; score ${view.scores[0]}\u2013${view.scores[1]}.`);\n      if (view.phase === "complete") {\n        if (!view.matchResult || Math.max(...view.scores) < view.targetScore) throw new Error("Match completion did not match the target score.");\n        say(`PASS \u2014 full match completed in ${completedHands} hands and ${totalPlays} card plays.`);\n        break;\n      }\n      if (completedHands >= maxHands) throw new Error(`Match was still active after ${maxHands} hands; stopped safely.`);\n      const next = await snap(room,seats[0].token);\n      view = await postAction(room,seats[0],"next-hand",next);\n      if (view.phase !== "bidding") throw new Error("Next hand did not begin after scoring.");\n    }\n\n    const finalViews = await Promise.all(seats.map(s=>snap(room,s.token)));\n    if (finalViews.some(v=>v.phase!=="complete" || v.hand.length!==0)) throw new Error("Final room state did not match for all four seats.");\n    say("PASS \u2014 all four seat views agree on the completed match; room will expire through normal cleanup.");\n    setStatus("PASS \u2014 automated four player match complete");\n  }\n  button.addEventListener("click", async () => {\n    button.disabled = true;\n    try { await run(); }\n    catch (error) { say(`BLOCKED \u2014 ${error.message}`); setStatus("Test stopped"); }\n    finally {\n      for (const socket of activeSockets) { try { socket.close(1000,"POC test cleanup"); } catch {} }\n      activeSockets = [];\n      button.disabled = false;\n    }\n  });\n})();\n<\/script>\n</body>\n</html>\n';
var CLOUD_GAME_LAUNCH_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark"><title>Private Griffin House game test</title>
<style>
  :root{color-scheme:dark;font:16px/1.5 system-ui,sans-serif;background:#151310;color:#f5eee2}
  *{box-sizing:border-box}body{max-width:620px;margin:0 auto;padding:28px 16px}
  main{background:#211e19;border:1px solid #80683e;border-radius:14px;padding:20px}
  h1{font:700 1.35rem Georgia,serif;color:#e6c677;margin:0 0 12px}
  p{color:#d4c8b5}label{display:block;margin:18px 0 6px}
  input,button{font:inherit;color:inherit;border:1px solid #80683e;border-radius:8px;padding:12px;background:#171613;width:100%}
  button{margin-top:16px;background:#332b1f;cursor:pointer;font-weight:700}
  #status{min-height:28px;margin-top:12px;color:#e6c677}
</style></head><body><main>
<h1>Private Griffin House test</h1>
<p>This opens a separate copy of the current game screen. It uses the private test server and does not save career records.</p>
<label for="key">Private test access key</label><input id="key" type="password" autocomplete="off">
<button id="open" type="button">Open private game test</button><div id="status" role="status"></div>
</main><script>
const button=document.getElementById('open'),key=document.getElementById('key'),status=document.getElementById('status');
button.addEventListener('click',async()=>{
  if(!key.value){status.textContent='Enter the private test key.';return;}
  button.disabled=true;status.textContent='Opening the isolated game screen\u2026';
  try{
    const response=await fetch('/cloud-game/launch',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:key.value}),cache:'no-store'});
    if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.error||'The private test key was not accepted.');}
    key.value='';
    location.replace('/cloud-game/game');
  }catch(error){status.textContent=error.message;button.disabled=false;}
});
<\/script></body></html>`;
var CLOUD_GAME_ADAPTER = `/*
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
  let timer = null, presenceTimer = null, presenceBusy = false;
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
  let renewingSession = null;
  async function boundedFetch(url, options = {}, parseJson = false) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(url, {...options, signal:controller.signal});
      if (!parseJson) return response;
      const data = await response.json().catch(error => { if (error.name === "AbortError") throw error; return {}; });
      return {response, data};
    }
    catch (error) {
      if (error.name === "AbortError") throw new Error("Connection timed out. Reconnecting to your table…");
      throw error;
    } finally { clearTimeout(timeout); }
  }
  const api = async (path, { method = "GET", body, token = credentials?.token, retried = false } = {}) => {
    const headers = {};
    if (token) headers.Authorization = "Bearer " + token;
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const {response, data} = await boundedFetch(new URL(path, window.location.origin), {
      method, headers, body: body === undefined ? undefined : JSON.stringify(body), cache: "no-store"
    }, true);
    if (!response.ok && data.error === "SESSION_REQUIRED" && !retried) {
      if (!renewingSession) renewingSession = boundedFetch(new URL("/?session-refresh=1", window.location.origin), {cache:"no-store"})
        .then(response => { if (!response.ok) throw new Error("Could not reconnect. Please try again."); })
        .finally(() => { renewingSession = null; });
      await renewingSession;
      return api(path, {method, body, token, retried:true});
    }
    if (!response.ok) {
      const error = new Error(data.error || ("HTTP_" + response.status));
      if (credentials && token === credentials.token) handleEndedRoom(error, credentials);
      throw error;
    }
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

  function syncCloudSeat(snap) {
    if (!credentials || !Number.isInteger(snap.viewerSeat) || snap.viewerSeat < 0 || snap.viewerSeat > 3) return;
    if (credentials.seat !== snap.viewerSeat) {
      credentials.seat = snap.viewerSeat;
      localStorage.setItem(credentialKey, JSON.stringify(credentials));
    }
    myIndex = credentials.seat;
    myPeerId = playerIdForSeat(credentials.seat);
    isHost = credentials.seat === 0;
  }
  function enterWaiting(snap) {
    syncCloudSeat(snap);
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

  function recordCloudCareer(snap) {
    if(!credentials||!window.HORProgression?.core||!snap?.careerEvents?.length)return;
    const core=window.HORProgression.core;
    try{
      const events=snap.careerEvents;
      for(const event of events){
        const receipt='hand:'+event.matchId+':'+event.hand;
        if(core.read()?.receipts?.[receipt])continue;
        core.recordHand({...event,localPeerId:'career-seat-'+credentials.seat,isHost:credentials.seat===0});
      }
      window.__horCareerSaveError=null;
    }catch(error){window.__horCareerSaveError=error.message;status('Career save needs attention: '+error.message);}
  }
  function gameSnapshot(snap) {
    syncCloudSeat(snap);
    recordCloudCareer(snap);
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
        const summary={...snap.lastSummary,nestCards,nestPts,nestWinnerName,careerEvent:snap.careerEvents?.at(-1)||null};
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

  function handleEndedRoom(error, owner = credentials) {
    if (!owner || credentials !== owner || !["ROOM_CLOSED", "ROOM_NOT_FOUND", "UNAUTHORIZED"].includes(error?.message)) return false;
    finishClosedTable(owner, error.message);
    return true;
  }
  async function refresh() {
    if (!credentials || busy) return;
    const owner=credentials;
    try {
      const snap = await api(roomPath("snapshot"));
      if(credentials===owner)receiveSnapshot(snap);
    } catch (error) {
      if(credentials!==owner || handleEndedRoom(error, owner))return;
      status("Connection issue. Reconnecting\\u2026 (" + error.message + ")");
    }
  }

  let reconnectViews = [], reconnectClock = 0;
  const reconnectNotice = document.createElement("div");
  reconnectNotice.id = "cloudReconnectNotice";
  reconnectNotice.setAttribute("role", "status");
  reconnectNotice.setAttribute("aria-live", "polite");
  reconnectNotice.hidden = true;
  reconnectNotice.style.cssText = "position:fixed;z-index:1000000;top:calc(env(safe-area-inset-top,0px) + 76px);left:50%;transform:translateX(-50%);width:max-content;max-width:min(92vw,440px);box-sizing:border-box;padding:9px 14px;border:1px solid #c7a65d;border-radius:10px;background:rgba(25,20,12,.96);color:#ffe7ad;font:600 14px/1.35 system-ui;text-align:center;box-shadow:0 3px 14px #0009;pointer-events:none;text-shadow:none";
  document.body.append(reconnectNotice);
  function paintReconnectNotice() {
    if (!credentials || !reconnectViews.length) { reconnectNotice.hidden = true; return; }
    const elapsed = performance.now() - reconnectClock;
    const text = reconnectViews.map(p => {
      if (p.state === "bot") return "Bot playing for " + p.name + " — they can reconnect";
      const seconds = Math.max(0, Math.ceil((p.remainingMs - elapsed) / 1000));
      return seconds ? p.name + " disconnected — bot takes over in " + seconds + "s" : "Connecting a bot for " + p.name + "…";
    }).join(" · ");
    if (reconnectNotice.textContent !== text) reconnectNotice.textContent = text;
    reconnectNotice.hidden = false;
  }
  setInterval(paintReconnectNotice, 250);
  function receiveSnapshot(snap) {
    if (!credentials || !snap || (credentials.serverRoomId && snap.roomId !== credentials.serverRoomId) || !Number.isInteger(snap.revision) || snap.revision < lastRevision) return;
    if (!credentials.serverRoomId) { credentials.serverRoomId = snap.roomId; localStorage.setItem(credentialKey, JSON.stringify(credentials)); }
    reconnectViews = Array.isArray(snap.connections) ? snap.connections : [];
    reconnectClock = performance.now();
    paintReconnectNotice();
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
    } catch (error) {
      if(credentials===owner && !handleEndedRoom(error, owner)) scheduleSocketReconnect();
    }
  }

  async function sendPresence() {
    if (!credentials || presenceBusy) return;
    const owner = credentials;
    presenceBusy = true;
    try {
      const snap = await api(roomPath("presence"), {method:"POST", body:{}});
      if (credentials === owner) receiveSnapshot(snap);
    } catch (error) { handleEndedRoom(error, owner); } finally { presenceBusy = false; }
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) sendPresence(); });
  window.addEventListener("online", sendPresence);
  function startRealtime() {
    clearInterval(presenceTimer);
    sendPresence();
    presenceTimer = setInterval(sendPresence, 5000);
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
      if (["ROOM_CLOSED", "ROOM_NOT_FOUND", "UNAUTHORIZED"].includes(error.message)) {
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
    clearInterval(presenceTimer); presenceTimer = null;
    reconnectViews = []; reconnectNotice.hidden = true;
    // Called only after the server confirms an explicit leave.
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
  function finishClosedTable(owner = credentials, reason = "ROOM_CLOSED") {
    if (!owner || credentials !== owner) return;
    clearInterval(presenceTimer); presenceTimer = null;
    reconnectViews = []; reconnectNotice.hidden = true;
    credentials=null;paintCloudPace(Number(localStorage.getItem("horGamePace"))||1); latest=null; queuedAction=null;
    clearTimeout(cloudDealTimer);cloudDealOwner=null;
    localStorage.removeItem(credentialKey);
    sessionStorage.removeItem("ghr-cloud-disconnected");
    clearInterval(timer);clearTimeout(socketReconnectTimer);socketReconnectTimer=null;
    const previous=socket;socket=null;try{previous?.close();}catch(_){}
    window.houseDismissConfirm?.();
    busy=false; presented=null; lastRevision=-1; cloudAudio=null; lastScoreSignature=""; redealRevision=-1;
    window.dispatchEvent(new CustomEvent("ghr-table-exited"));
    returnToLobby043();
    if(reason === "UNAUTHORIZED") horToast("This seat is no longer reserved. You can join an available table.");
    else if(reason === "ROOM_NOT_FOUND") horToast("This table has expired. You can start or join another.");
    else if(owner.seat!==0)horToast("The host closed this table. You can start or join another.");
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
  let leavingTable = false;
  async function leaveCloudTable() {
    if (!credentials || credentials.seat === 0 || leavingTable) return;
    const owner = credentials;
    leavingTable = true;
    try {
      await api(roomPath("leave"), {method:"POST", body:{}});
      if (credentials !== owner) return;
      localStorage.removeItem(credentialKey);
      window.dispatchEvent(new CustomEvent("ghr-table-exited"));
      disconnectCloudRoom();
      horToast("You left the table. A bot has taken your seat.");
    } catch (error) {
      if (credentials === owner) horToast("Could not leave the table. Please try again.");
    } finally { leavingTable = false; }
  }
  window.clientLeaveReplace = async () => {
    if (!credentials) return native.clientLeaveReplace?.();
    if (credentials.seat===0) {await closeCloudTable();return;}
    const owner=credentials;
    const accepted=await window.houseConfirm({kind:"table",tableCode:owner.roomCode,title:"Leave this table?",body:"A bot will take your seat so the game can continue.",confirmText:"Leave table",cancelText:"Stay here",danger:false});
    if(accepted && credentials===owner)await leaveCloudTable();
  };
  window.leaveTableAfterConfirmation043 = (...args) => !credentials ? native.leaveTableAfterConfirmation043?.(...args) : credentials.seat===0 ? closeCloudTable() : leaveCloudTable();
  window.leaveTableToLobby043 = (...args) => !credentials ? native.leaveTableToLobby043?.(...args) : credentials.seat===0 ? closeCloudTable() : leaveCloudTable();
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
  let movingCloudSeat = false;
  async function moveCloudSeat(seat) {
    if (!credentials || credentials.seat === 0 || latest?.phase !== "waiting" || movingCloudSeat) return;
    const owner = credentials;
    movingCloudSeat = true;
    try {
      const snap = await api(roomPath("move-seat"), {method:"POST", body:{seat,expectedRevision:latest.revision}});
      if (credentials !== owner) return;
      receiveSnapshot(snap);
      horToast("You moved to the selected seat.");
    } catch (error) {
      if (credentials !== owner) return;
      await refreshAfterAction();
      horToast(error.message === "ROOM_NOT_JOINABLE" ? "The game has started. Seats are now locked." : "That seat is no longer available. Choose an open seat.");
    } finally { movingCloudSeat = false; }
  }
  window.onWaitSeatClick=function(seat){
    if(!credentials)return native.onWaitSeatClick?.(seat);
    if(latest?.phase!=="waiting")return;
    if(credentials.seat!==0){
      const target=latest.players?.find(p=>p.seat===Number(seat));
      if(Number(seat)>0 && target && !target.occupied) return moveCloudSeat(Number(seat));
      return;
    }
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
  window.addEventListener("click",event=>{
    if(!credentials || credentials.seat===0 || latest?.phase!=="waiting" || document.getElementById("waiting")?.hasAttribute("data-guest-preview"))return;
    const button=event.target.closest?.('[id^="waitSeat"]');
    if(!button || !/^waitSeat[1-3]$/.test(button.id))return;
    const seat=Number(button.id.slice(-1));
    if(latest.players?.find(p=>p.seat===seat)?.occupied)return;
    event.preventDefault();event.stopImmediatePropagation();moveCloudSeat(seat);
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
  // Cloud careers consume authoritative completed-hand history; legacy writers stay disabled.
  // Private-test bots are controlled only by the server room reducer.
  try { window.horRecordCareerHand = (...args) => credentials ? recordCloudCareer(latest) : native.horRecordCareerHand?.(...args); } catch (_) {}
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
var IDLE_ROOM_MS = 60 * 60 * 1e3;
var COMPLETED_ROOM_GRACE_MS = 5 * 60 * 1e3;
var PRIVATE_SESSION_COOKIE = "GHR-Online-v1";
var PRIVATE_SESSION_MS = 12 * 60 * 60 * 1e3;
var WS_TICKET_TTL_MS = 15e3;
var json = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "private, no-store, max-age=0", "pragma": "no-cache", "expires": "0", "vary": "Authorization, Cookie, X-Test-Gate, X-Test-Gate-UTF8" }
}), "json");
var fail = /* @__PURE__ */ __name2((error) => {
  if (error?.message === "ROOM_CLOSED") return json({ error: "ROOM_CLOSED" }, 410);
  const known = /* @__PURE__ */ new Set([
    "ROOM_EXISTS",
    "DEAL_IN_PROGRESS",
    "STALE_DEAL",
    "TRUMP_IN_PROGRESS",
    "TRICK_IN_PROGRESS",
    "CLAIM_IN_PROGRESS",
    "INVALID_PACE",
    "ROOM_NOT_FOUND",
    "ROOM_FULL",
    "SEAT_OCCUPIED",
    "ROOM_NOT_JOINABLE",
    "HOST_ONLY",
    "HOST_SEAT_FIXED",
    "HOST_MUST_CLOSE_TABLE",
    "FOUR_PLAYERS_REQUIRED",
    "INVALID_FIXTURE_HANDS",
    "ACTION_ID_REQUIRED",
    "ACTION_ID_REUSED",
    "GAME_NOT_PLAYING",
    "STALE_REVISION",
    "NOT_YOUR_TURN",
    "CARD_NOT_IN_YOUR_HAND",
    "CARD_NOT_IN_HAND",
    "UNAUTHORIZED",
    "PLAYER_ALREADY_SEATED",
    "INVALID_PLAYER_ID",
    "INVALID_DISPLAY_NAME",
    "NOT_BIDDING",
    "PAUSED",
    "AUCTION_NOT_OPEN",
    "INVALID_SEAT",
    "ALREADY_PASSED",
    "TWO_HUMANS_REQUIRED",
    "NO_OPEN_SEATS",
    "INVALID_BID",
    "INVALID_OPTIONS",
    "INVALID_TARGET_SCORE",
    "ILLEGAL_BID",
    "MOON_BID_NOT_ALLOWED",
    "INVALID_BIDDER",
    "NOT_DISCARDING",
    "NOT_BIDDER",
    "INVALID_DISCARD",
    "WRONG_DISCARD_COUNT",
    "NOT_CHOOSING_TRUMP",
    "INVALID_TRUMP",
    "NOT_PLAYING",
    "ILLEGAL_CARD",
    "COUNTER_TOTAL_MISMATCH",
    "INVALID_HAND_SIZE",
    "INVALID_NEST_SIZE",
    "DECK_TOO_SMALL",
    "INVALID_TARGET_SCORE",
    "INVALID_MIN_BID",
    "INVALID_LEAD_ORDER",
    "INVALID_NEST_DESTINATION",
    "DUPLICATE_PLAYER_ID",
    "NOT_REDEALING",
    "NOT_READY_FOR_NEXT_HAND",
    "MATCH_COMPLETE",
    "CLAIM_NOT_AVAILABLE"
  ]);
  return json(
    { error: known.has(error?.message) ? error.message : "INTERNAL_ERROR" },
    known.has(error?.message) ? 400 : 500
  );
}, "fail");
async function serveClient(request, env) {
  const response = env.ASSETS ? await env.ASSETS.fetch(request) : new Response(CLIENT_HTML, { headers: { "content-type": "text/html; charset=utf-8" } });
  if (!response.ok) return response;
  const headers = new Headers(response.headers);
  headers.set("Content-Security-Policy", "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  if (headers.get("content-type")?.includes("text/html")) headers.set("Cache-Control", "no-store");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
__name(serveClient, "serveClient");
__name2(serveClient, "serveClient");
function secureHtml(html) {
  return new Response(html, { headers: {
    "content-type": "text/html; charset=utf-8",
    "content-security-policy": "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self' wss://griffin-room-local-poc.jeromeleegriffin.workers.dev; form-action 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "cache-control": "no-store"
  } });
}
__name(secureHtml, "secureHtml");
__name2(secureHtml, "secureHtml");
function secureCloudGameHtml() {
  return new Response(CLOUD_GAME_LAUNCH_HTML, { headers: {
    "content-type": "text/html; charset=utf-8",
    "content-security-policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "cache-control": "no-store"
  } });
}
__name(secureCloudGameHtml, "secureCloudGameHtml");
__name2(secureCloudGameHtml, "secureCloudGameHtml");
function injectCloudGameAdapter(html) {
  if (typeof html !== "string" || !html.includes("</head>") || !html.includes("</body>")) {
    throw new Error("UPSTREAM_GAME_HTML_UNEXPECTED");
  }
  const prelude = `<base href="/cloud-game/assets/"><script>(()=>{const q=new URLSearchParams(location.hash.slice(1)),p=new URLSearchParams(location.search);window.GHR_CLOUD_INVITE=q.get("room")||p.get("room")||"";window.GHR_CLOUD_CREATE=(q.get("create")||p.get("create"))==="1";window.GHR_CLOUD_NAME=(q.get("name")||p.get("name")||"").slice(0,12);history.replaceState(null,"",location.pathname+"?cloud=1")})();try{if(navigator.serviceWorker&&navigator.serviceWorker.register)navigator.serviceWorker.register=()=>Promise.resolve(null)}catch(_){}<\/script>`;
  const adapter = `<script>${CLOUD_GAME_ADAPTER}<\/script><script src="/cloud-career.js"></script>`;
  return html.replace(/<head([^>]*)>/i, (_whole, attrs) => `<head${attrs}>${prelude}`).replace(/<\/body>/i, `${adapter}</body>`).replace(/id="hor-room-code"([^>]*?)maxlength="6"/i, 'id="hor-room-code"$1maxlength="8"');
}
__name(injectCloudGameAdapter, "injectCloudGameAdapter");
__name2(injectCloudGameAdapter, "injectCloudGameAdapter");
function secureIntegratedGameHtml(html) {
  return new Response(html, { headers: {
    "content-type": "text/html; charset=utf-8",
    "content-security-policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob:; media-src 'self' data: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' wss: https://0.peerjs.com wss://0.peerjs.com https://cdn.jsdelivr.net https://unpkg.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "cache-control": "no-store"
  } });
}
__name(secureIntegratedGameHtml, "secureIntegratedGameHtml");
__name2(secureIntegratedGameHtml, "secureIntegratedGameHtml");
function sameSecret(actual, expected) {
  if (typeof actual !== "string" || typeof expected !== "string") return false;
  const encoder = new TextEncoder();
  const left = encoder.encode(actual);
  const right = encoder.encode(expected);
  let mismatch = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i++) mismatch |= (left[i] ?? 0) ^ (right[i] ?? 0);
  return mismatch === 0;
}
__name(sameSecret, "sameSecret");
__name2(sameSecret, "sameSecret");
function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
__name(bytesToHex, "bytesToHex");
__name2(bytesToHex, "bytesToHex");
async function digestHex(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}
__name(digestHex, "digestHex");
__name2(digestHex, "digestHex");
async function issueRoomSocketTicket(storage, roomId, seat, seatToken, now = Date.now()) {
  const ticket = bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
  const key = `ws-ticket:${await digestHex(ticket)}`;
  await storage.put(key, { roomId, seat, seatToken, expiresAt: now + WS_TICKET_TTL_MS });
  return { ticket, expiresAt: now + WS_TICKET_TTL_MS };
}
__name(issueRoomSocketTicket, "issueRoomSocketTicket");
__name2(issueRoomSocketTicket, "issueRoomSocketTicket");
async function consumeRoomSocketTicket(storage, ticket, roomId, now = Date.now()) {
  if (typeof ticket !== "string" || !/^[0-9a-f]{64}$/.test(ticket)) return null;
  const key = `ws-ticket:${await digestHex(ticket)}`;
  const record = await storage.get(key);
  if (!record) return null;
  if (record.roomId !== roomId) return null;
  await storage.delete(key);
  if (record.expiresAt <= now) return null;
  return record;
}
__name(consumeRoomSocketTicket, "consumeRoomSocketTicket");
__name2(consumeRoomSocketTicket, "consumeRoomSocketTicket");
async function signPrivateSession(secret, expiresAt, nonce) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const payload = `${expiresAt}.${nonce}`;
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`GHR-Online-v1|${payload}`));
  return `${payload}.${bytesToHex(new Uint8Array(signature))}`;
}
__name(signPrivateSession, "signPrivateSession");
__name2(signPrivateSession, "signPrivateSession");
async function issuePrivateSession(secret, now = Date.now()) {
  const expiresAt = now + PRIVATE_SESSION_MS;
  const nonce = crypto.randomUUID();
  return { token: await signPrivateSession(secret, expiresAt, nonce), expiresAt };
}
__name(issuePrivateSession, "issuePrivateSession");
__name2(issuePrivateSession, "issuePrivateSession");
async function verifyPrivateSession(token, secret, now = Date.now()) {
  if (typeof token !== "string" || typeof secret !== "string") return false;
  const match = token.match(/^(\d{13})\.([0-9a-f-]{36})\.([0-9a-f]{64})$/);
  if (!match) return false;
  const expiresAt = Number(match[1]);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now || expiresAt > now + PRIVATE_SESSION_MS + 5e3) return false;
  const expected = await signPrivateSession(secret, expiresAt, match[2]);
  return sameSecret(token, expected);
}
__name(verifyPrivateSession, "verifyPrivateSession");
__name2(verifyPrivateSession, "verifyPrivateSession");
function cookieValue(request, name) {
  const cookieHeader = request.headers.get("cookie") || "";
  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === name) return part.slice(separator + 1).trim();
  }
  return null;
}
__name(cookieValue, "cookieValue");
__name2(cookieValue, "cookieValue");
async function authorizedTestRequest(request, expected) {
  const session = cookieValue(request, PRIVATE_SESSION_COOKIE);
  if (await verifyPrivateSession(session, expected)) return true;
  return sameSecret(requestGate(request), expected);
}
__name(authorizedTestRequest, "authorizedTestRequest");
__name2(authorizedTestRequest, "authorizedTestRequest");
function requestGate(request) {
  const encoded = request.headers.get("x-test-gate-utf8");
  if (encoded !== null) {
    try {
      return decodeURIComponent(encoded);
    } catch {
      return null;
    }
  }
  return request.headers.get("x-test-gate");
}
__name(requestGate, "requestGate");
__name2(requestGate, "requestGate");
var RoomDO = class extends DurableObject {
  static {
    __name(this, "RoomDO");
  }
  static {
    __name2(this, "RoomDO");
  }
  constructor(ctx, env) {
    super(ctx, env);
    this.allowTestFixtures = env.ALLOW_TEST_FIXTURES === "1";
    this.service = new RoomService(ctx.storage);
    this.roomKey = ctx.id.toString();
    this.serial = Promise.resolve();
  }
  fetch(request) {
    const task = this.serial.then(async () => {
      const url = new URL(request.url);
      const isSocketUpgrade = request.headers.get("upgrade")?.toLowerCase() === "websocket";
      const previousRevision = (await this.ctx.storage.get(this.roomKey))?.revision;
      const response = isSocketUpgrade ? await this.#connectSocket(request, url) : await this.#dispatch(request);
      if (response.ok) {
        const saved = await this.ctx.storage.get(this.roomKey);
        if (saved?.status === "playing") await this.service.reconcilePresence(this.roomKey, this.#connectedTokens());
        const revision = (await this.ctx.storage.get(this.roomKey))?.revision;
        if (revision !== previousRevision || request.method === "POST" && url.pathname !== "/ws-ticket" && url.pathname !== "/presence") await this.#broadcastSnapshots();
        await this.#scheduleAlarm();
      }
      return response;
    });
    this.serial = task.catch(() => {
    });
    return task;
  }
  #connectedTokens() {
    return (this.ctx.getWebSockets?.() || []).filter(s => s.readyState === 1)
      .map(s => s.deserializeAttachment()?.seatToken).filter(Boolean);
  }
  async #scheduleAlarm() {
    if (await this.ctx.storage.get("__audio_report_only")) {
      await this.ctx.storage.setAlarm(Date.now() + 60 * 60 * 1000); return;
    }
    const room = await this.ctx.storage.get(this.roomKey);
    if (!room) { await this.ctx.storage.deleteAlarm(); return; }
    const deadlines = [room.lastActivityAt + IDLE_ROOM_MS];
    if (room.status === "complete") deadlines.push(Date.now() + COMPLETED_ROOM_GRACE_MS);
    if (room.status === "playing") {
      deadlines.push(openingDue(room), room.botTurn?.due, room.trumpOpening?.expiresAt,
        room.trickOpening?.expiresAt, room.claimOpening?.expiresAt);
      const connected = this.#connectedTokens();
      for (let i = 0; i < 4; i++) {
        const p = room.seats[i];
        if (p && !botControls(p) && (p.presenceProtocol || !connected.includes(p.token)))
          deadlines.push(p.reconnectBy || (p.lastSeenAt ?? Date.now()) + GUEST_HEARTBEAT_TIMEOUT_MS);
      }
    }
    await this.ctx.storage.setAlarm(Math.max(Date.now() + 1, Math.min(...deadlines.filter(Number.isFinite))));
  }
  async #connectSocket(request, url) {
    if (request.method !== "GET" || url.pathname !== "/ws" || request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      return json({ error: "WEBSOCKET_UPGRADE_REQUIRED" }, 426);
    }
    const record = await consumeRoomSocketTicket(this.ctx.storage, url.searchParams.get("ticket"), this.roomKey);
    if (!record) return json({ error: "INVALID_OR_EXPIRED_SOCKET_TICKET" }, 401);
    try {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      this.ctx.acceptWebSocket(server, [`seat:${record.seat}`]);
      server.serializeAttachment({ seat: record.seat, seatToken: record.seatToken });
      await this.service.presence(this.roomKey, record.seatToken, false);
      const snapshot = await this.service.snapshot(this.roomKey, record.seatToken);
      server.send(JSON.stringify({ type: "snapshot", snapshot }));
      await this.#broadcastSnapshots();
      await this.#scheduleAlarm();
      return new Response(null, { status: 101, webSocket: client });
    } catch {
      return json({ error: "WEBSOCKET_SETUP_FAILED" }, 500);
    }
  }
  async #broadcastSnapshots() {
    for (const socket of this.ctx.getWebSockets?.() || []) {
      if (socket.readyState !== 1) continue;
      const attachment = socket.deserializeAttachment();
      if (!attachment || !Number.isInteger(attachment.seat) || typeof attachment.seatToken !== "string") {
        try {
          socket.close(1008, "Invalid seat session");
        } catch {
        }
        continue;
      }
      try {
        const snapshot = await this.service.snapshot(this.roomKey, attachment.seatToken);
        socket.send(JSON.stringify({ type: "snapshot", snapshot }));
      } catch (error) {
        if (error?.message === "ROOM_CLOSED") {
          try {
            socket.send(JSON.stringify({ type: "room-closed" }));
            socket.close(1e3, "Table closed");
          } catch (_) {
          }
          continue;
        }
        try {
          socket.close(1008, "Seat session expired");
        } catch {
        }
      }
    }
  }
  async webSocketMessage(socket) {
    try {
      socket.close(1008, "Use the room action API");
    } catch {
    }
  }
  async webSocketClose(socket) {
    const task = this.serial.then(async () => {
      const token = socket?.deserializeAttachment()?.seatToken;
      const room = await this.ctx.storage.get(this.roomKey);
      const p = room?.seats.find(p => p && !p.isBot && p.token === token);
      if (p && !p.autoPlaying && !this.#connectedTokens().includes(token)) {
        p.lastSeenAt = Date.now();
        if (!p.reconnectBy) { p.reconnectBy = Date.now() + GUEST_RECONNECT_MS; room.revision++; }
        await this.ctx.storage.put(this.roomKey, room);
      }
      await this.#broadcastSnapshots();
      await this.#scheduleAlarm();
    });
    this.serial = task.catch(() => {});
    return task;
  }
  async webSocketError(socket) {
    try {
      socket.close(1011, "Socket error");
    } catch {
    }
  }
  async alarm() {
    const task = this.serial.then(async () => {
      if (await this.ctx.storage.get("__audio_report_only")) {
        this.ctx.storage.sql.exec("DELETE FROM audio_reports WHERE updated <= ?", Date.now() - 60 * 60 * 1e3);
        const count = this.ctx.storage.sql.exec("SELECT COUNT(*) AS count FROM audio_reports").toArray()[0].count;
        if (count) await this.ctx.storage.setAlarm(Date.now() + 60 * 60 * 1e3);
        else await this.ctx.storage.deleteAlarm();
        return;
      }
      await this.service.cleanup(this.roomKey, { maxIdleMs: IDLE_ROOM_MS });
      const room = await this.ctx.storage.get(this.roomKey);
      if (room?.status === "playing") {
        await this.service.reconcilePresence(this.roomKey, this.#connectedTokens());
        await this.#broadcastSnapshots();
      }
      await this.#scheduleAlarm();
    });
    this.serial = task.catch(() => {
    });
    return task;
  }
  async #dispatch(request) {
    const url = new URL(request.url);
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null;
    try {
      if (request.method === "POST" && url.pathname === "/audio-report") {
        const report = sanitizeAudioReport(await request.json());
        if (!report) return json({ error: "INVALID_REPORT" }, 400);
        this.ctx.storage.sql.exec("CREATE TABLE IF NOT EXISTS audio_reports(id TEXT PRIMARY KEY,updated INTEGER NOT NULL,payload TEXT NOT NULL)");
        this.ctx.storage.sql.exec("INSERT INTO audio_reports(id,updated,payload) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET updated=excluded.updated,payload=excluded.payload", report.id, Date.now(), JSON.stringify(report));
        this.ctx.storage.sql.exec("DELETE FROM audio_reports WHERE id NOT IN (SELECT id FROM audio_reports ORDER BY updated DESC LIMIT 64)");
        await this.ctx.storage.put("__audio_report_only", true);
        return json({ ok: true });
      }
      if (request.method === "POST" && url.pathname === "/create") {
        const body = await request.json();
        return json(await this.service.create(this.roomKey, body.playerId, body.displayName, body.avatar, body.voice, body.pace ?? 1), 201);
      }
      if (request.method === "GET" && url.pathname === "/seat-options") return json(await this.service.seatOptions(this.roomKey));
      if (request.method === "POST" && url.pathname === "/join") {
        const body = await request.json();
        return json(await this.service.join(this.roomKey, body.playerId, body.displayName, body.resumeToken, body.avatar, body.voice, body.preferredSeat), 201);
      }
      if (request.method === "POST" && url.pathname === "/leave") return json(await this.service.leave(this.roomKey, token));
      if (request.method === "POST" && url.pathname === "/presence") {
        const before = (await this.ctx.storage.get(this.roomKey))?.revision;
        await this.service.presence(this.roomKey, token);
        const snapshot = await this.service.snapshot(this.roomKey, token);
        if (snapshot.revision !== before) await this.#broadcastSnapshots();
        return json(snapshot);
      }
      if (request.method === "POST" && url.pathname === "/move-seat") return json(await this.service.moveSeat(this.roomKey, token, await request.json()));
      if (request.method === "POST" && url.pathname === "/bot-seat") return json(await this.service.setBotSeat(this.roomKey, token, await request.json()));
      if (request.method === "POST" && url.pathname === "/ready") {
        const body = await request.json();
        return json(await this.service.readyForBidding(this.roomKey, token, body.handNumber, body.openingId));
      }
      if (request.method === "POST" && url.pathname === "/pace") return json(await this.service.setPace(this.roomKey, token, (await request.json()).pace));
      if (request.method === "POST" && url.pathname === "/close") return json(await this.service.closeTable(this.roomKey, token));
      if (request.method === "POST" && url.pathname === "/fill-bots") {
        const body = await request.json();
        return json(await this.service.fillOpenSeatsWithBots(this.roomKey, token, body.seat));
      }
      if (request.method === "GET" && url.pathname === "/snapshot") {
        return json(await this.service.snapshot(this.roomKey, token));
      }
      if (request.method === "POST" && url.pathname === "/ws-ticket") {
        const seat = await this.service.seatForToken(this.roomKey, token);
        return json(await issueRoomSocketTicket(this.ctx.storage, this.roomKey, seat, token));
      }
      if (this.allowTestFixtures && request.method === "POST" && url.pathname === "/start-fixture") {
        const body = await request.json();
        return json(await this.service.startFixtureGame(this.roomKey, token, body.handsBySeat));
      }
      if (request.method === "POST" && url.pathname === "/start") {
        const body = await request.json();
        return json(await this.service.startGame(this.roomKey, token, safeOptions(body.options)));
      }
      if (request.method === "POST" && url.pathname === "/bid") {
        return json(await this.service.bid(this.roomKey, token, await request.json()));
      }
      if (request.method === "POST" && url.pathname === "/discard") {
        return json(await this.service.discard(this.roomKey, token, await request.json()));
      }
      if (request.method === "POST" && url.pathname === "/trump") {
        return json(await this.service.chooseTrump(this.roomKey, token, await request.json()));
      }
      if (request.method === "POST" && url.pathname === "/play") {
        return json(await this.service.playCard(this.roomKey, token, await request.json()));
      }
      if (request.method === "POST" && url.pathname === "/claim-remaining") {
        return json(await this.service.claimRemainingCards(this.roomKey, token, await request.json()));
      }
      if (request.method === "POST" && url.pathname === "/decline-claim") {
        return json(await this.service.declineRemainingClaim(this.roomKey, token, await request.json()));
      }
      if (request.method === "POST" && url.pathname === "/next-hand") {
        return json(await this.service.startNextHand(this.roomKey, token, await request.json()));
      }
      if (request.method === "POST" && url.pathname === "/redeal") {
        return json(await this.service.redeal(this.roomKey, token, await request.json()));
      }
      if (this.allowTestFixtures && request.method === "POST" && url.pathname === "/play-fixture") {
        const body = await request.json();
        return json(await this.service.playFixtureCard(this.roomKey, token, body));
      }
      return json({ error: "NOT_FOUND" }, 404);
    } catch (error) {
      return fail(error);
    }
  }
};
function roomNamePrefix(displayName) {
  const letters = String(displayName).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z]/g, "");
  return letters ? letters.slice(0, 3).padEnd(3, "X") : "TAB";
}
__name(roomNamePrefix, "roomNamePrefix");
function* namedRoomCodes(displayName, randomIndex = secureRandomIndex) {
  const prefix = roomNamePrefix(displayName);
  for (let digits = 2; digits <= 4; digits++) {
    const range = 10 ** digits, start = randomIndex(range);
    for (let i = 0; i < 8; i++) yield prefix + String((start + i * 37) % range).padStart(digits, "0");
  }
}
__name(namedRoomCodes, "namedRoomCodes");
async function createNamedRoom(env, body, candidates = namedRoomCodes(body.displayName)) {
  validateIdentity(body.playerId, body.displayName);
  for (const code of candidates) {
    const response = await env.ROOMS.getByName(code).fetch("https://room.local/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    if (response.ok) return json({ roomCode: code, ...await response.json() }, 201);
    const error = await response.clone().json().catch(() => null);
    if (error?.error !== "ROOM_EXISTS") return response;
  }
  return json({ error: "TABLE_NAMES_BUSY", message: "Could not reserve a table name. Please try again." }, 503);
}
__name(createNamedRoom, "createNamedRoom");
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if(url.pathname.startsWith('/career-api/')) return careerApi(request,env);
    if(url.pathname==='/cloud-career.js') return new Response(CLOUD_CAREER_CLIENT,{headers:{'content-type':'application/javascript','cache-control':'no-store'}});
    if(url.pathname==='/cloud-game/assets/career-core.js') return new Response(CLOUD_CAREER_CORE,{headers:{'content-type':'application/javascript','cache-control':'no-store'}});

    if (url.pathname === "/audio-check/report") return handleAudioReport(request, env);
    if ((request.method === "GET" || request.method === "HEAD") && ["/cloud-game/assets/", "/cloud-game/assets/index.html"].includes(url.pathname)) {
      const entry = new URL(request.url);
      entry.pathname = "/";
      return new Response(null, { status: 302, headers: { location: entry.href, "cache-control": "no-store" } });
    }
    const isEntry = ["/", "/index.html", "/cloud-game/index.html", "/cloud-game/game"].includes(url.pathname);
    const isRoom = url.pathname === "/rooms" || url.pathname.startsWith("/rooms/");
    if (["/cloud-game/launch", "/four-player-check"].includes(url.pathname)) return new Response("Not found", { status: 404 });
    if (isRoom) {
      if (request.method !== "GET" && request.headers.get("origin") !== url.origin) return json({ error: "SAME_ORIGIN_REQUIRED" }, 403);
      if (!await verifyPrivateSession(cookieValue(request, PRIVATE_SESSION_COOKIE), env.TEST_GATE_KEY)) return json({ error: "SESSION_REQUIRED" }, 401);
      const bucket = url.pathname === "/rooms" || url.pathname.endsWith("/join") ? env.ENTRY_LIMIT : env.ACTION_LIMIT;
      if (!bucket) return json({ error: "SERVER_CONFIGURATION_REQUIRED" }, 503);
      const { success } = await bucket.limit({ key: (request.headers.get("CF-Connecting-IP") || "unknown") + ":" + (bucket === env.ENTRY_LIMIT ? url.pathname === "/rooms" ? "create" : "join" : "action") });
      if (!success) return new Response(JSON.stringify({ error: "TOO_MANY_REQUESTS" }), { status: 429, headers: { "content-type": "application/json", "cache-control": "no-store", "retry-after": "60" } });
    }
    if (isEntry && request.method === "GET") {
      let session = null;
      if (!await verifyPrivateSession(cookieValue(request, PRIVATE_SESSION_COOKIE), env.TEST_GATE_KEY)) {
        if (!env.ENTRY_LIMIT) return new Response("Temporarily unavailable", { status: 503 });
        const { success } = await env.ENTRY_LIMIT.limit({ key: (request.headers.get("CF-Connecting-IP") || "unknown") + ":session" });
        if (!success) return new Response("Please try again shortly.", { status: 429, headers: { "retry-after": "60", "cache-control": "no-store" } });
        session = await issuePrivateSession(env.TEST_GATE_KEY);
      }
      try {
        const upstream = await env.ASSETS.fetch(new Request(new URL("/cloud-game/assets/index.html", request.url)));
        if (!upstream.ok) return new Response("The game is temporarily unavailable. Please reload shortly.", { status: 502, headers: { "cache-control": "no-store" } });
        const response = secureIntegratedGameHtml(injectAudioDiagnostics(injectCloudGameAdapter(await upstream.text()), url));
        if (session) response.headers.set("Set-Cookie", `${PRIVATE_SESSION_COOKIE}=${session.token}; Path=/; Max-Age=${Math.floor(PRIVATE_SESSION_MS / 1e3)}; HttpOnly; Secure; SameSite=Strict`);
        return response;
      } catch {
        return new Response("The game is temporarily unavailable. Please reload shortly.", { status: 502, headers: { "cache-control": "no-store" } });
      }
    }
    if ((request.method === "GET" || request.method === "HEAD") && url.pathname.startsWith("/cloud-game/assets/")) {
      const rawAssetPath = url.pathname.slice("/cloud-game/assets/".length);
      let assetParts;
      try {
        assetParts = rawAssetPath.split("/").map(decodeURIComponent);
      } catch {
        assetParts = [];
      }
      if (!assetParts.length || assetParts.some((part) => !part || part === "." || part === ".." || /[\\/\u0000]/.test(part) || /%[0-9a-f]{2}/i.test(part))) {
        return new Response("Not found", { status: 404 });
      }
      try {
        const assetPath = assetParts.map(encodeURIComponent).join("/");
        const upstream = await env.ASSETS.fetch(new Request(new URL("/cloud-game/assets/" + assetPath, request.url), { method: request.method }));
        const headers = new Headers();
        for (const name of ["content-type", "etag", "last-modified"]) {
          const value = upstream.headers.get(name);
          if (value) headers.set(name, value);
        }
        const mime = { js: "text/javascript", css: "text/css", html: "text/html", json: "application/json", svg: "image/svg+xml", webp: "image/webp", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", mp3: "audio/mpeg", ogg: "audio/ogg", wav: "audio/wav", woff2: "font/woff2", wasm: "application/wasm" }[rawAssetPath.split(".").pop().toLowerCase()];
        if (mime) headers.set("content-type", mime);
        headers.set("cache-control", upstream.ok ? "public, max-age=300" : "no-store");
        headers.set("x-ghr-origin-cache", upstream.headers.get("cf-cache-status") || "UNKNOWN");
        headers.set("x-content-type-options", "nosniff");
        return new Response(request.method === "HEAD" ? null : upstream.body, {
          status: upstream.status,
          headers
        });
      } catch {
        return new Response("Game asset temporarily unavailable", { status: 502 });
      }
    }
    if (request.method === "POST" && url.pathname === "/cloud-game/launch") {
      let suppliedGate = null;
      try {
        suppliedGate = (await request.json())?.key;
      } catch {
      }
      if (!sameSecret(suppliedGate, env.TEST_GATE_KEY)) {
        return json({ error: "TEST_ACCESS_REQUIRED" }, 401);
      }
      const session = await issuePrivateSession(env.TEST_GATE_KEY);
      return new Response(null, { status: 204, headers: {
        "Set-Cookie": `${PRIVATE_SESSION_COOKIE}=${session.token}; Path=/; Max-Age=${Math.floor(PRIVATE_SESSION_MS / 1e3)}; HttpOnly; Secure; SameSite=Strict`,
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer"
      } });
    }
    if (request.method === "GET" && url.pathname === "/cloud-game/game") {
      if (!await verifyPrivateSession(cookieValue(request, PRIVATE_SESSION_COOKIE), env.TEST_GATE_KEY)) {
        return new Response("The private test session expired. Open the private test page and enter the key again.", {
          status: 401,
          headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "referrer-policy": "no-referrer" }
        });
      }
      try {
        const upstream = await env.ASSETS.fetch(new Request(new URL("/cloud-game/assets/index.html", request.url)));
        if (!upstream.ok) return new Response("The private game copy is temporarily unavailable.", { status: 502 });
        const integrated = injectAudioDiagnostics(injectCloudGameAdapter(await upstream.text()), url);
        return secureIntegratedGameHtml(integrated);
      } catch {
        return new Response("The private game copy is temporarily unavailable.", { status: 502 });
      }
    }
    if (url.pathname === "/four-player-check") return secureHtml(FOUR_PLAYER_CHECK_HTML);
    if (url.pathname.startsWith("/rooms/") || url.pathname === "/rooms") {
      if (!await authorizedTestRequest(request, env.TEST_GATE_KEY)) {
        return json({ error: "TEST_ACCESS_REQUIRED" }, 401);
      }
    }
    const match = url.pathname.match(/^\/rooms\/([A-Z]{3}[0-9]{2,4}|[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8})(?:\/(join|snapshot|seat-options|ws-ticket|ws|close|leave|presence|pace|ready|move-seat|bot-seat|fill-bots|start-fixture|play-fixture|start|bid|discard|trump|play|claim-remaining|decline-claim|next-hand|redeal))?$/i);
    if (request.method === "POST" && url.pathname === "/rooms") {
      try {
        const body = await request.json();
        if (typeof body.playerId !== "string" || typeof body.displayName !== "string") {
          return json({ error: "PLAYER_ID_AND_DISPLAY_NAME_REQUIRED" }, 400);
        }
        return await createNamedRoom(env, body);
      } catch {
        return json({ error: "INVALID_REQUEST" }, 400);
      }
    }
    if (!match) return new Response("Not found", { status: 404 });
    const [, rawCode, action] = match;
    const code = rawCode.toUpperCase();
    if (!action) return new Response("Not found", { status: 404 });
    const stub = env.ROOMS.getByName(code);
    const target = new URL(request.url);
    target.hostname = "room.local";
    target.pathname = action === "join" ? "/join" : `/${action}`;
    return stub.fetch(new Request(target, request));
  }
};
var AUDIO_DIAGNOSTIC_COLLECTOR = `/* Opt-in sound check. No cards, names, room IDs, credentials or device IDs. */
(() => {
  'use strict';
  const id = '__GHR_AUDIO_REPORT_ID__';
  if (!/^[a-f0-9]{32}$/.test(id)) return;
  const samples = [];
  let sequence = 0, lastSent = 0, sending = false, lastClock = null, lastAt = null;
  let test = { requested: false, heard: null };
  const panel = document.createElement('aside');
  panel.style.cssText = 'position:fixed;top:4px;left:50%;transform:translateX(-50%);z-index:2147483647;background:#18251f;color:#fff;border:1px solid #c9ad66;border-radius:8px;padding:7px;font:12px system-ui;max-width:95vw;text-align:center';
  panel.innerHTML = '<span>Sound check active</span> <button type="button" data-check="test">Test sound</button> <button type="button" data-check="yes" hidden>I hear it</button> <button type="button" data-check="no" hidden>No sound</button><small style="display:block">Only audio state and sound settings are reported.</small>';
  document.body.appendChild(panel);
  const label = panel.querySelector('span');
  const read = fn => { try { return fn(); } catch (_) { return null; } };
  function sample(reason) {
    const at = performance.now();
    const ctx = read(() => typeof audioCtx === 'undefined' ? null : audioCtx);
    const clock = ctx ? ctx.currentTime : null;
    const cabin = read(() => window.CabinAmbience041?.inspect());
    const mixer = window.HORAudioMixer;
    const voice = read(() => window.HORVoiceQueue?.inspect());
    const trump = read(() => window.HORTrumpVoice?.getState());
    const frame = {
      sequence: ++sequence, reason, elapsedMs: Math.round(at),
      build: read(() => window.HOR_BUILD), pageBuild: read(() => window.HOR_PAGE_BUILD),
      scriptBuild: read(() => window.HOR_SCRIPT_BUILD), hidden: document.hidden,
      inGame: document.body.classList.contains('in-game'),
      phase: read(() => typeof game === 'undefined' ? null : game?.phase),
      muted: read(() => typeof soundMuted === 'undefined' ? null : soundMuted),
      storedMuted: read(() => localStorage.getItem('rookMuted') === '1'),
      soundOptions: { cards: read(() => soundCard), turn: read(() => soundTurn), ticks: read(() => soundTick) },
      main: ctx ? { state: ctx.state, clock, sampleRate: ctx.sampleRate,
        clockDelta: lastClock === null ? null : +(clock - lastClock).toFixed(4),
        wallDeltaMs: lastAt === null ? null : Math.round(at - lastAt) } : null,
      mixer: mixer ? { master: mixer.level('master'), voices: mixer.level('voices'),
        gameplay: mixer.level('gameplay'), atmosphere: mixer.level('atmosphere'),
        character: mixer.level('character'), settings: mixer.settings() } : null,
      cabin: cabin ? { running: cabin.running, contextState: cabin.contextState,
        enabled: cabin.enabled, unlocked: cabin.unlocked, allowed: cabin.allowed,
        volume: cabin.volume, fireVolume: cabin.fireVolume, busGain: cabin.busGain,
        timers: cabin.timers, voices: cabin.voices } : null,
      voiceQueue: voice ? { active: !!voice.active, pending: voice.pending.length, starts: voice.log.filter(e => e.type === 'start').length } : null,
      trump: trump ? { playing: trump.playing, cacheSize: trump.cacheSize, loadFailures: trump.history.filter(e => e.type === 'load-failed').length } : null,
      assets: { cabin: !!window.HORCabinSamples,
        landingBuffers: read(() => typeof cardLandingBuffers058 === 'undefined' ? 0 : cardLandingBuffers058.length) },
      test: { ...test },
    };
    lastClock = clock; lastAt = at;
    samples.push(frame); if (samples.length > 12) samples.shift();
  }
  async function send(reason, force = false) {
    sample(reason);
    if (sending || (!force && Date.now() - lastSent < 10000)) return;
    sending = true; lastSent = Date.now();
    try {
      const response = await fetch('/audio-check/report', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, samples }), cache: 'no-store', keepalive: true,
      });
      label.textContent = response.ok ? 'Sound check received \xB7 play normally' : 'Sound check could not send';
    } catch (_) { label.textContent = 'Sound check waiting for connection'; }
    finally { sending = false; }
  }
  panel.querySelector('[data-check="test"]').onclick = async () => {
    test = { requested: true, heard: null };
    let ctx;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx(); await ctx.resume();
      test.state = ctx.state;
      const gain = ctx.createGain(); gain.gain.value = 0.08; gain.connect(ctx.destination);
      for (const [i, frequency] of [440, 660].entries()) {
        const oscillator = ctx.createOscillator(); oscillator.frequency.value = frequency;
        oscillator.connect(gain); oscillator.start(ctx.currentTime + i * 0.3);
        oscillator.stop(ctx.currentTime + i * 0.3 + 0.18);
      }
      setTimeout(() => { test.clock = ctx.currentTime; ctx.close().catch(() => {}); send('test-finished', true); }, 900);
    } catch (_) { test.error = 'test-unavailable'; }
    panel.querySelector('[data-check="yes"]').hidden = false;
    panel.querySelector('[data-check="no"]').hidden = false;
    send('test-requested', true);
  };
  for (const [name, heard] of [['yes', true], ['no', false]]) {
    panel.querySelector('[data-check="' + name + '"]').onclick = () => { test.heard = heard; send('test-answer', true); };
  }
  document.addEventListener('visibilitychange', () => send('visibility', true));
  document.addEventListener('pointerup', () => setTimeout(() => send('interaction'), 350), { passive: true });
  const timer = setInterval(() => send('heartbeat'), 10000);
  setTimeout(() => { clearInterval(timer); send('check-ended', true); }, 15 * 60 * 1000);
  send('opened', true);
})();
`;
function sanitizeAudioReport(body) {
  if (!body || !/^[a-f0-9]{32}$/.test(body.id || "") || !Array.isArray(body.samples)) return null;
  const n = /* @__PURE__ */ __name((v, max = 1e9) => typeof v === "number" && Number.isFinite(v) ? Math.max(-max, Math.min(max, v)) : null, "n");
  const b = /* @__PURE__ */ __name((v) => typeof v === "boolean" ? v : null, "b");
  const state = /* @__PURE__ */ __name((v) => ["running", "suspended", "interrupted", "closed", "not-created"].includes(v) ? v : null, "state");
  const build = /* @__PURE__ */ __name((v) => typeof v === "string" && /^[a-zA-Z0-9-]{1,80}$/.test(v) ? v : null, "build");
  const level = /* @__PURE__ */ __name((v) => typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : null, "level");
  const levels = /* @__PURE__ */ __name((obj) => Object.fromEntries(["master", "voices", "gameplay", "atmosphere", "character"].map((key) => [key, level(obj?.[key])])), "levels");
  const samples = body.samples.slice(-12).map((s) => ({
    sequence: n(s?.sequence),
    elapsedMs: n(s?.elapsedMs),
    reason: ["opened", "heartbeat", "interaction", "visibility", "test-requested", "test-finished", "test-answer", "check-ended"].includes(s?.reason) ? s.reason : null,
    build: build(s?.build),
    pageBuild: build(s?.pageBuild),
    scriptBuild: build(s?.scriptBuild),
    hidden: b(s?.hidden),
    inGame: b(s?.inGame),
    phase: ["bidding", "dealing", "discard", "trump", "play", "score", "complete", "redeal"].includes(s?.phase) ? s.phase : null,
    muted: b(s?.muted),
    storedMuted: b(s?.storedMuted),
    soundOptions: { cards: b(s?.soundOptions?.cards), turn: b(s?.soundOptions?.turn), ticks: b(s?.soundOptions?.ticks) },
    main: s?.main ? { state: state(s.main.state), clock: n(s.main.clock), clockDelta: n(s.main.clockDelta), wallDeltaMs: n(s.main.wallDeltaMs), sampleRate: n(s.main.sampleRate, 384e3) } : null,
    mixer: s?.mixer ? { ...levels(s.mixer), settings: { ...levels(s.mixer.settings), voicesMuted: b(s.mixer.settings?.voicesMuted) } } : null,
    cabin: s?.cabin ? { running: b(s.cabin.running), contextState: state(s.cabin.contextState), enabled: b(s.cabin.enabled), unlocked: b(s.cabin.unlocked), allowed: b(s.cabin.allowed), volume: n(s.cabin.volume, 100), fireVolume: n(s.cabin.fireVolume, 100), busGain: n(s.cabin.busGain, 10), timers: n(s.cabin.timers, 100), voices: Array.isArray(s.cabin.voices) ? s.cabin.voices.slice(0, 12).filter((v) => ["fire", "wind", "bird", "crickets", "owl", "wolf", "rain"].includes(v?.name)).map((v) => ({ name: v.name, level: level(v.level) })) : [] } : null,
    voiceQueue: s?.voiceQueue ? { active: b(s.voiceQueue.active), pending: n(s.voiceQueue.pending, 100), starts: n(s.voiceQueue.starts, 100) } : null,
    trump: s?.trump ? { playing: b(s.trump.playing), cacheSize: n(s.trump.cacheSize, 100), loadFailures: n(s.trump.loadFailures, 100) } : null,
    assets: { cabin: b(s?.assets?.cabin), landingBuffers: n(s?.assets?.landingBuffers, 20) },
    test: { requested: b(s?.test?.requested), heard: b(s?.test?.heard), state: state(s?.test?.state), clock: n(s?.test?.clock), error: s?.test?.error === "test-unavailable" ? "test-unavailable" : null }
  }));
  return { id: body.id, samples };
}
__name(sanitizeAudioReport, "sanitizeAudioReport");
async function handleAudioReport(request, env) {
  const url = new URL(request.url);
  if (request.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, 405);
  if (request.headers.get("origin") !== url.origin) return json({ error: "SAME_ORIGIN_REQUIRED" }, 403);
  if (!await verifyPrivateSession(cookieValue(request, PRIVATE_SESSION_COOKIE), env.TEST_GATE_KEY)) return json({ error: "SESSION_REQUIRED" }, 401);
  const rate = env.ACTION_LIMIT;
  if (!rate) return json({ error: "SERVER_CONFIGURATION_REQUIRED" }, 503);
  if (!(await rate.limit({ key: (request.headers.get("CF-Connecting-IP") || "unknown") + ":audio-check" })).success) return json({ error: "TOO_MANY_REQUESTS" }, 429);
  const text = await request.text();
  if (text.length > 32768) return json({ error: "REPORT_TOO_LARGE" }, 413);
  let report;
  try {
    report = sanitizeAudioReport(JSON.parse(text));
  } catch (_) {
  }
  if (!report) return json({ error: "INVALID_REPORT" }, 400);
  return env.ROOMS.getByName("__ghr_audio_diagnostics_v1").fetch("https://room.local/audio-report", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(report) });
}
__name(handleAudioReport, "handleAudioReport");
function injectAudioDiagnostics(html, url) {
  const id = url.searchParams.get("audioCheck");
  if (!/^[a-f0-9]{32}$/.test(id || "")) return html;
  const source = AUDIO_DIAGNOSTIC_COLLECTOR.replace("__GHR_AUDIO_REPORT_ID__", id);
  return html.replace(/<\/body>/i, "<script>" + source + "<\/script></body>");
}
__name(injectAudioDiagnostics, "injectAudioDiagnostics");
var ONLINE_X1 = (() => {
  const module = void 0;
  const globalThis2 = {};
  (function(root) {
    "use strict";
    const colors = ["green", "red", "yellow", "black"], FULL = (1n << 46n) - 1n, U = (1n << 64n) - 1n;
    const col = /* @__PURE__ */ __name((c) => c < 40 ? Math.floor(c / 10) : c < 44 ? c - 40 : c === 44 ? 1 : 4, "col");
    const rank = /* @__PURE__ */ __name((c) => c < 40 ? c % 10 + 5 : c < 44 ? 15 : c === 44 ? 999 : 1e3, "rank");
    const point = /* @__PURE__ */ __name((c) => c >= 44 ? 20 : c >= 40 ? 15 : c % 10 + 5 === 5 ? 5 : [10, 14].includes(c % 10 + 5) ? 10 : 0, "point");
    const cat = /* @__PURE__ */ __name((c, tr) => c >= 44 ? tr : col(c), "cat");
    const mask = /* @__PURE__ */ __name((a) => a.reduce((m, c) => m | 1n << BigInt(c), 0n), "mask");
    const bits = /* @__PURE__ */ __name((m) => {
      let a = [];
      for (let c = 0; c < 46; c++) if (m & 1n << BigInt(c)) a.push(c);
      return a;
    }, "bits");
    const pop = /* @__PURE__ */ __name((x) => {
      let n = 0;
      while (x) {
        x &= x - 1;
        n++;
      }
      return n;
    }, "pop");
    const beat = /* @__PURE__ */ __name((a, b, led, tr) => cat(a, tr) !== cat(b, tr) ? cat(a, tr) === tr || cat(b, tr) !== tr && cat(a, tr) === led : rank(a) > rank(b), "beat");
    const legal = /* @__PURE__ */ __name((h, t, tr) => {
      if (!t.c.length) return h.slice();
      let q = h.filter((c) => cat(c, tr) === cat(t.c[0], tr));
      return q.length ? q : h.slice();
    }, "legal");
    const win = /* @__PURE__ */ __name((t, tr) => {
      let w = 0;
      for (let i = 1; i < t.c.length; i++) if (beat(t.c[i], t.c[w], cat(t.c[0], tr), tr)) w = i;
      return w;
    }, "win");
    const low = /* @__PURE__ */ __name((a, tr) => a.reduce((a2, b) => (cat(b, tr) === tr ? 1e6 : 0) + point(b) * 2e3 + rank(b) < (cat(a2, tr) === tr ? 1e6 : 0) + point(a2) * 2e3 + rank(a2) ? b : a2), "low");
    const nonperm = /* @__PURE__ */ __name((a) => {
      let q = a.filter((c) => c < 44);
      return q.length ? q : a;
    }, "nonperm");
    function solmove(h, t, tr, played, nest, seat) {
      const L = legal(h, t, tr), partner = (seat + 2) % 4, unseen = bits(FULL & ~(mask(h) | played | nest | mask(t.c)));
      const top = /* @__PURE__ */ __name((c, led2) => !unseen.some((x) => beat(x, c, led2, tr)), "top");
      if (!t.c.length) {
        const ts = L.filter((c) => cat(c, tr) === tr), plain = ts.filter((c) => c < 44), side = L.filter((c) => cat(c, tr) !== tr);
        if (ts.length >= 4 && unseen.filter((c) => cat(c, tr) === tr).length >= 2 && plain.length) return low(plain, tr);
        if (side.length) {
          let best = -1, bn = -1, br = -1, groups = colors.map((_, i) => side.filter((c) => col(c) === i));
          for (let c = 0; c < 4; c++) {
            let g = groups[c];
            if (c === tr || !g.length) continue;
            let r = Math.max(...g.map(rank));
            if (g.length > bn || g.length === bn && r > br) {
              best = c;
              bn = g.length;
              br = r;
            }
          }
          if (best >= 0) {
            let g = groups[best], tops = g.filter((c) => top(c, best)), zeros2 = g.filter((c) => !point(c));
            return low(tops.length ? tops : zeros2.length ? zeros2 : g, tr);
          }
        }
        return low(nonperm(L), tr);
      }
      const wi = win(t, tr), w = t.s[wi], val = t.c.reduce((a, c) => a + point(c), 0), led = cat(t.c[0], tr), winners = L.filter((c) => beat(c, t.c[wi], led, tr)), zeros = L.filter((c) => !point(c));
      if (w === partner) {
        if (t.c.length === 3) {
          let f = L.filter((c) => point(c) && c < 44 && !beat(c, t.c[wi], led, tr));
          if (f.length) return f.reduce((a, b) => point(b) > point(a) || point(b) === point(a) && rank(b) < rank(a) ? b : a);
        }
        return low(nonperm(zeros.length ? zeros : L), tr);
      }
      if (winners.length) {
        if (t.c.length === 3 || val >= 10) return low(nonperm(winners), tr);
        let cheap = winners.filter((c) => cat(c, tr) !== tr && !point(c));
        if (cheap.length) return cheap.reduce((a, b) => rank(b) < rank(a) ? b : a);
      }
      return low(nonperm(zeros.length ? zeros : L), tr);
    }
    __name(solmove, "solmove");
    class RNG {
      static {
        __name(this, "RNG");
      }
      constructor(x) {
        this.x = x;
      }
      next() {
        this.x = this.x + 0x9e3779b97f4a7c15n & U;
        let z = this.x;
        z = (z ^ z >> 30n) * 0xbf58476d1ce4e5b9n & U;
        z = (z ^ z >> 27n) * 0x94d049bb133111ebn & U;
        return (z ^ z >> 31n) & U;
      }
      n(k) {
        return Number(this.next() % BigInt(k));
      }
    }
    class Sampler {
      static {
        __name(this, "Sampler");
      }
      constructor(seed) {
        this.rng = new RNG(seed);
        this.seats = [];
        this.sizes = [];
        this.slots = [];
        this.groups = [];
        this.allow = Array(46).fill(0);
        this.accepted = 0;
        this.proposed = 0;
      }
      feasible(remain, counts) {
        let G = this.seats.length;
        for (let m = 1; m < 1 << G; m++) {
          let need = 0, cap = 0;
          for (let x = 1; x < 1 << G; x++) if ((x & m) === x) need += counts[x];
          for (let g = 0; g < G; g++) if (m & 1 << g) cap += remain[g];
          if (need > cap) return false;
        }
        return true;
      }
      init(unseen, seat, lengths, voids, tr, hidden, partnerMask = null) {
        for (let s = 0; s < 4; s++) if (s !== seat) {
          this.seats.push(s);
          this.sizes.push(lengths[s]);
        }
        if (hidden) {
          this.seats.push(4);
          this.sizes.push(6);
        }
        let cards = bits(unseen), counts = Array(16).fill(0), remain = this.sizes.slice();
        for (let c of cards) {
          let m = 0;
          for (let g = 0; g < this.seats.length; g++) if (partnerMask === null ? this.seats[g] === 4 || !(voids[this.seats[g]] & 1 << cat(c, tr)) : this.seats[g] === 4 ? !(partnerMask & 1n << BigInt(c)) : this.seats[g] === (seat + 2) % 4 === !!(partnerMask & 1n << BigInt(c)) && !(voids[this.seats[g]] & 1 << cat(c, tr))) m |= 1 << g;
          this.allow[c] = m;
          if (!m) return false;
          counts[m]++;
        }
        if (!this.feasible(remain, counts)) return false;
        for (let i = cards.length - 1; i > 0; i--) {
          let j = this.rng.n(i + 1);
          [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        cards.sort((a, b) => pop(this.allow[a]) - pop(this.allow[b]));
        let grouped = this.seats.map(() => []);
        for (let c of cards) {
          let m = this.allow[c];
          counts[m]--;
          let opts = [], weights = [], total = 0;
          for (let g2 = 0; g2 < this.seats.length; g2++) if (remain[g2] && m & 1 << g2) {
            remain[g2]--;
            let ok = this.feasible(remain, counts);
            remain[g2]++;
            if (ok) {
              opts.push(g2);
              weights.push(remain[g2]);
              total += remain[g2];
            }
          }
          if (!opts.length) return false;
          let q = this.rng.n(total), j = 0;
          while (q >= weights[j]) q -= weights[j++];
          let g = opts[j];
          remain[g]--;
          grouped[g].push(c);
        }
        grouped.forEach((a, g) => a.forEach((c) => {
          this.slots.push(c);
          this.groups.push(g);
        }));
        this.mix(512);
        return this.slots.length === cards.length;
      }
      mix(steps) {
        let N = this.slots.length;
        if (N < 2) return;
        for (let z = 0; z < steps; z++) {
          this.proposed++;
          let k = 2;
          if (N >= 3 && this.rng.n(4) === 0) k = Math.min(N, 3 + this.rng.n(2));
          let ix = [];
          for (let j = 0; j < k; j++) {
            let q;
            do {
              q = this.rng.n(N);
            } while (ix.includes(q));
            ix.push(q);
          }
          let ok = ix.every((i, j) => !!(this.allow[this.slots[i]] & 1 << this.groups[ix[(j + 1) % k]]));
          if (!ok) continue;
          let last = this.slots[ix[k - 1]];
          for (let j = k - 1; j > 0; j--) this.slots[ix[j]] = this.slots[ix[j - 1]];
          this.slots[ix[0]] = last;
          this.accepted++;
        }
      }
      fill(s) {
        this.seats.forEach((g) => {
          if (g < 4) s.h[g] = [];
        });
        if (this.seats.length === 4) {
          s.nest = 0n;
          s.nestpts = 0;
        }
        this.slots.forEach((c, i) => {
          let seat = this.seats[this.groups[i]];
          if (seat === 4) {
            s.nest |= 1n << BigInt(c);
            s.nestpts += point(c);
          } else s.h[seat].push(c);
        });
        for (let seat of this.seats) {
          if (seat === 4) continue;
          let h = s.h[seat];
          for (let i = h.length - 1; i > 0; i--) {
            let j = this.rng.n(i + 1);
            [h[i], h[j]] = [h[j], h[i]];
          }
        }
      }
    }
    function copy(s) {
      return { ...s, h: s.h.map((a) => a.slice()), t: { c: s.t.c.slice(), s: s.t.s.slice() }, points: s.points.slice() };
    }
    __name(copy, "copy");
    function complete(world, seat, first) {
      let s = copy(world), rootteam = seat % 2, c = first;
      while (true) {
        let at = s.h[seat].indexOf(c);
        if (at < 0) throw Error("simulation card absent");
        s.h[seat].splice(at, 1);
        s.t.c.push(c);
        s.t.s.push(seat);
        s.played |= 1n << BigInt(c);
        if (s.t.c.length === 4) {
          let w = s.t.s[win(s.t, s.tr)];
          s.points[w % 2] += s.t.c.reduce((a, c2) => a + point(c2), 0);
          s.t = { c: [], s: [] };
          seat = w;
          if (s.h.every((h) => !h.length)) {
            s.points[w % 2] += s.nestpts;
            break;
          }
        } else seat = (seat + 1) % 4;
        c = solmove(s.h[seat], s.t, s.tr, s.played, seat === s.bidder ? s.nest : 0n, seat);
      }
      let b = s.bidder % 2;
      if (s.points[b] < s.bid) s.points[b] = -s.bid;
      return s.points[rootteam] - s.points[1 - rootteam];
    }
    __name(complete, "complete");
    function choose(v) {
      let { h, tc, ts, tr, seat, bidder, bid, points, voids } = v, played = BigInt(v.played), nest = BigInt(v.nest), seed = BigInt(v.seed), samples = h.length <= 3 ? 256 : 128;
      let partnerMask = Object.prototype.hasOwnProperty.call(v, "partnerMask") ? BigInt(v.partnerMask) : null;
      if (partnerMask !== null) {
        let n = (bits(played).length - tc.length) / 4, expected = 10 - n - (ts.includes((seat + 2) % 4) ? 1 : 0);
        if (partnerMask < 0n || partnerMask & ~FULL || partnerMask & (played | nest | mask(h)) || bits(partnerMask).length !== expected || bits(partnerMask).some((c) => voids[(seat + 2) % 4] & 1 << cat(c, tr))) return { card: -8, out: Array(12).fill(0) };
      }
      let base = { h: [[], [], [], []], t: { c: tc.slice(), s: ts.slice() }, tr, bidder, bid, points: points.slice(), played, nest, nestpts: bits(nest).reduce((a, c) => a + point(c), 0) };
      base.h[seat] = h.slice();
      let L = legal(h, base.t, tr), reference = solmove(h, base.t, tr, played, nest, seat), out = Array(12).fill(0);
      if (L.length === 1) return { card: L[0], out };
      let completed = (bits(played).length - tc.length) / 4, lengths = Array(4).fill(10 - completed);
      ts.forEach((s) => lengths[s]--);
      if (lengths[seat] !== h.length) return { card: -2, out };
      let sampler = new Sampler(seed);
      if (!sampler.init(FULL & ~(played | nest | mask(h)), seat, lengths, voids, tr, seat !== bidder, partnerMask)) return { card: -3, out };
      let sum = L.map(() => 0), dsq = L.map(() => 0), ri = L.indexOf(reference);
      for (let i = 0; i < samples; i++) {
        sampler.mix(64);
        let world = copy(base);
        sampler.fill(world);
        let all = played;
        if (bits(world.nest).length !== 6 || all & world.nest) return { card: -4, out };
        all |= world.nest;
        for (let s = 0; s < 4; s++) {
          let hm = mask(world.h[s]);
          if (world.h[s].length !== lengths[s] || bits(hm).length !== lengths[s] || all & hm) return { card: -5, out };
          all |= hm;
          if (world.h[s].some((c) => voids[s] & 1 << cat(c, tr))) return { card: -6, out };
        }
        if (all !== FULL) return { card: -7, out };
        let vals = L.map((c, j) => {
          let n = complete(world, seat, c);
          sum[j] += n;
          return n;
        });
        vals.forEach((n, j) => {
          let d = n - vals[ri];
          dsq[j] += d * d;
        });
      }
      let best = ri, bestadv = 0;
      L.forEach((c, j) => {
        let d = (sum[j] - sum[ri]) / samples, se = Math.sqrt(Math.max(0, dsq[j] / samples - d * d) / Math.max(1, samples - 1)), adjusted = d - 0.5 - 0.5 * se;
        if (adjusted > bestadv) {
          bestadv = adjusted;
          best = j;
        }
      });
      out.splice(0, 8, samples, L.length, reference, sum[ri] / samples, sum[best] / samples, sampler.accepted, sampler.proposed, Number(L[best] !== reference));
      return { card: L[best], out };
    }
    __name(choose, "choose");
    function trump(h) {
      let scores = colors.map((_, c) => {
        let suited = h.filter((x) => col(x) === c && x !== 44), n = suited.length, ranks = new Set(suited.map(rank));
        let controls = (ranks.has(15) ? 5 : 0) + (ranks.has(14) ? 4 : 0) + (ranks.has(13) ? 2.5 : 0) + (ranks.has(12) ? 1.5 : 0);
        return n * 10 + Math.max(0, n - 4) * 4 + controls * 4 + suited.reduce((a, x) => a + point(x), 0) * 0.55;
      });
      let best = 0;
      for (let c = 1; c < 4; c++) if (scores[c] > scores[best] || scores[c] === scores[best] && h.filter((x) => col(x) === c).length > h.filter((x) => col(x) === best).length) best = c;
      return best;
    }
    __name(trump, "trump");
    function ceiling(h, ctx) {
      let lens = colors.map((_, c) => h.filter((x) => col(x) === c).length), honors = colors.map((_, c) => h.filter((x) => col(x) === c && [15, 14, 13, 12, 10].includes(rank(x))).length), t = trump(h), v = h.reduce((a, c) => a + point(c), 0) * 0.62 + lens[t] * 8 + honors[t] * 7 + lens.filter((n) => !n).length * 10 + lens.filter((n) => n <= 1).length * 3 + (h.includes(45) ? 20 : 0) + (h.includes(44) ? 10 : 0);
      if (v < 62) return 0;
      let cap = 70 + Math.floor(Math.max(0, v - 62) * 1.35 / 5) * 5, high = ctx.high ?? 65, partner = (ctx.seat + 2) % 4;
      if (high <= 90 && v >= 68) cap = Math.max(cap, high + 5);
      if (high <= 110 && v >= 76) cap = Math.max(cap, high + 5);
      if (ctx.history.some(([s, b]) => s === partner && b > 0)) cap += 5;
      let mine = ctx.scores[ctx.seat % 2], theirs = ctx.scores[1 - ctx.seat % 2];
      if (theirs - mine >= 100) cap += 5;
      if (mine >= 425 && mine > theirs) cap -= 5;
      return Math.max(0, Math.min(200, Math.floor(cap / 5) * 5));
    }
    __name(ceiling, "ceiling");
    function discard(h, n, tr) {
      let lens = colors.map((_, c) => h.filter((x) => col(x) === c && x !== 44).length), strong = h.filter((x) => cat(x, tr) === tr).length >= 6 || h.includes(45) || h.includes(44);
      let keep = /* @__PURE__ */ __name((x) => {
        if (x === 45) return 2e4;
        if (x === 44) return 18e3;
        if (cat(x, tr) === tr) return 5e3 + rank(x) * 8 + point(x) * 20;
        let ln = lens[col(x)] || 0, r = rank(x), p = point(x), control = r === 15 ? 1800 : r === 14 ? 1150 : r === 13 ? 550 : r === 12 ? 260 : 0, counter = p * 28;
        if (p && ln <= 2 && ![15, 14].includes(r)) counter -= strong ? 260 : 120;
        let vp = p === 0 ? ln === 1 ? 900 : ln === 2 ? 520 : ln === 3 ? 140 : 0 : 0;
        return control + counter + r * 2 + ln * 45 - vp;
      }, "keep");
      return h.slice().sort((a, b) => keep(b) - keep(a)).slice(0, h.length - n);
    }
    __name(discard, "discard");
    const api = { choose, solmove, legal, mask, colors, point, rank, col, cat, trump, ceiling, discard, RNG };
    if (typeof module !== "undefined") module.exports = api;
    root.X1Core = api;
  })(globalThis2);
  (function(r) {
    r.x1SHA256 = function(input) {
      const bytes = new TextEncoder().encode(input), K = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
      let H = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], len = Math.ceil((bytes.length + 9) / 64) * 64, b = new Uint8Array(len);
      b.set(bytes);
      b[bytes.length] = 128;
      let dv = new DataView(b.buffer);
      dv.setUint32(len - 8, Math.floor(bytes.length * 8 / 4294967296));
      dv.setUint32(len - 4, bytes.length * 8);
      let ro = /* @__PURE__ */ __name((x, n) => x >>> n | x << 32 - n, "ro");
      for (let off = 0; off < len; off += 64) {
        let w = new Uint32Array(64);
        for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
        for (let i = 16; i < 64; i++) {
          let x = w[i - 15], y = w[i - 2];
          w[i] = (ro(x, 7) ^ ro(x, 18) ^ x >>> 3) + w[i - 16] + (ro(y, 17) ^ ro(y, 19) ^ y >>> 10) + w[i - 7];
        }
        let [a, c, d, e, f, g, h, j] = H;
        for (let i = 0; i < 64; i++) {
          let t1 = j + (ro(f, 6) ^ ro(f, 11) ^ ro(f, 25)) + (f & g ^ ~f & h) + K[i] + w[i] >>> 0, t2 = (ro(a, 2) ^ ro(a, 13) ^ ro(a, 22)) + (a & c ^ a & d ^ c & d) >>> 0;
          j = h;
          h = g;
          g = f;
          f = e + t1 >>> 0;
          e = d;
          d = c;
          c = a;
          a = t1 + t2 >>> 0;
        }
        [a, c, d, e, f, g, h, j].forEach((v2, i) => H[i] = H[i] + v2 >>> 0);
      }
      let out = new Uint8Array(32), v = new DataView(out.buffer);
      H.forEach((x, i) => v.setUint32(i * 4, x));
      return out;
    };
  })(globalThis2);
  (function(root) {
    "use strict";
    const C = root.X1Core;
    const ALL = Array.from({ length: 46 }, (_, i) => i), R = ALL.map(C.rank), P = ALL.map(C.point), COL = ALL.map(C.col);
    const cat = /* @__PURE__ */ __name((c, t) => c >= 44 ? t : COL[c], "cat");
    const beat = /* @__PURE__ */ __name((a, b, l, t) => cat(a, t) !== cat(b, t) ? cat(a, t) === t || cat(b, t) !== t && cat(a, t) === l : R[a] > R[b], "beat");
    function move(h, tc, ts, tr, seen, nest, seat) {
      const led = tc.length ? cat(tc[0], tr) : -1, follow = h.filter((c) => cat(c, tr) === led), L = follow.length ? follow : h;
      const unknown = ALL.filter((c) => !h.includes(c) && !seen[c] && !nest.includes(c) && !tc.includes(c));
      const low = /* @__PURE__ */ __name((a) => a.reduce((a2, b) => (cat(b, tr) === tr ? 1e6 : 0) + P[b] * 2e3 + R[b] < (cat(a2, tr) === tr ? 1e6 : 0) + P[a2] * 2e3 + R[a2] ? b : a2), "low");
      const np = /* @__PURE__ */ __name((a) => {
        const b = a.filter((c) => c < 44);
        return b.length ? b : a;
      }, "np");
      if (!tc.length) {
        const trump = L.filter((c) => cat(c, tr) === tr), plain = trump.filter((c) => c < 44), side = L.filter((c) => cat(c, tr) !== tr);
        if (trump.length >= 4 && unknown.filter((c) => cat(c, tr) === tr).length >= 2 && plain.length) return low(plain);
        if (side.length) {
          let best = [], br = -1;
          for (let color = 0; color < 4; color++) {
            const g = side.filter((c) => COL[c] === color), r = Math.max(...g.map((c) => R[c]));
            if (g.length > best.length || g.length === best.length && r > br) {
              best = g;
              br = r;
            }
          }
          const top = best.filter((c) => !unknown.some((x) => beat(x, c, COL[c], tr))), zero2 = best.filter((c) => !P[c]);
          return low(top.length ? top : zero2.length ? zero2 : best);
        }
        return low(np(L));
      }
      let wi = 0;
      for (let i = 1; i < tc.length; i++) if (beat(tc[i], tc[wi], led, tr)) wi = i;
      const val = tc.reduce((a, c) => a + P[c], 0), wins = L.filter((c) => beat(c, tc[wi], led, tr)), zero = L.filter((c) => !P[c]);
      if (ts[wi] === (seat + 2) % 4) {
        if (tc.length === 3) {
          const f = L.filter((c) => P[c] && c < 44 && !beat(c, tc[wi], led, tr));
          if (f.length) return f.reduce((a, b) => P[b] > P[a] || P[b] === P[a] && R[b] < R[a] ? b : a);
        }
        return low(np(zero.length ? zero : L));
      }
      if (wins.length) {
        if (tc.length === 3 || val >= 10) return low(np(wins));
        const cheap = wins.filter((c) => cat(c, tr) !== tr && !P[c]);
        if (cheap.length) return cheap.reduce((a, b) => R[b] < R[a] ? b : a);
      }
      return low(np(zero.length ? zero : L));
    }
    __name(move, "move");
    function contract(hands, nest, bidder) {
      const hs = hands.map((h) => h.slice()), all = hs[bidder].concat(nest), tr = C.trump(all);
      hs[bidder] = C.discard(all, 6, tr);
      const buried = all.filter((c) => !hs[bidder].includes(c)), seen = Array(46).fill(false), points = [0, 0];
      let lead = bidder;
      for (let k = 0; k < 10; k++) {
        const tc = [], ts = [];
        for (let j = 0; j < 4; j++) {
          const s = (lead + j) % 4, c = move(hs[s], tc, ts, tr, seen, s === bidder ? buried : [], s);
          hs[s].splice(hs[s].indexOf(c), 1);
          tc.push(c);
          ts.push(s);
          seen[c] = true;
        }
        let wi = 0;
        for (let j = 1; j < 4; j++) if (beat(tc[j], tc[wi], cat(tc[0], tr), tr)) wi = j;
        lead = ts[wi];
        points[lead % 2] += tc.reduce((a, c) => a + P[c], 0);
      }
      points[lead % 2] += buried.reduce((a, c) => a + P[c], 0);
      return points;
    }
    __name(contract, "contract");
    function validate(v) {
      const keys = ["h", "seat", "dealer", "high", "bidder", "history", "scores", "passed", "limit", "target", "revealed", "moon"];
      if (Object.keys(v).some((k) => !keys.includes(k))) throw Error("unauthorized bidding input");
      if (v.h.length !== 10 || new Set(v.h).size !== 10 || v.h.some((c) => !Number.isInteger(c) || c < 0 || c > 45)) throw Error("invalid own hand");
      if (![v.seat, v.dealer].every((s) => Number.isInteger(s) && s >= 0 && s < 4) || !Number.isInteger(v.bidder) || v.bidder < -1 || v.bidder > 3) throw Error("invalid seats");
      if (!Array.isArray(v.passed) || v.passed.length !== 4 || v.passed.some((p) => typeof p !== "boolean") || v.scores.length !== 2 || v.scores.some((x) => !Number.isFinite(x))) throw Error("invalid public state");
      if (!Number.isFinite(v.high) || v.high % 5 || v.high < 65 || v.high > 200 || !Number.isFinite(v.limit) || v.limit > 200 || !Number.isFinite(v.target) || v.target <= 0) throw Error("invalid contract");
      if (v.revealed !== null && (!Number.isInteger(v.revealed) || v.revealed < 0 || v.revealed > 45 || v.h.includes(v.revealed))) throw Error("invalid public reveal");
      if (typeof v.moon !== "boolean") throw Error("invalid moon setting");
      if (!Array.isArray(v.history) || v.history.some((x) => !Array.isArray(x) || x.length !== 2 || !Number.isInteger(x[0]) || x[0] < 0 || x[0] > 3 || !Number.isFinite(x[1]) || x[1] < 0 || x[1] > 200)) throw Error("invalid public history");
    }
    __name(validate, "validate");
    function rngFor(v) {
      let x = 2166136261;
      for (const c of JSON.stringify([v.h, v.seat, v.dealer, v.high, v.bidder, v.history, v.scores, v.passed, v.limit, v.target, v.revealed, v.moon])) x = Math.imul(x ^ c.charCodeAt(0), 16777619) >>> 0;
      return (n) => {
        x = x + 1831565813 >>> 0;
        let t = x;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) % n;
      };
    }
    __name(rngFor, "rngFor");
    function auction(hands, v, raise, shifts) {
      const active = v.passed.map((x) => !x), hist = v.history.filter((x) => x[1] > 0).map((x) => x.slice());
      let high = v.high, bidder = v.bidder;
      if (raise) {
        high = typeof raise === "number" ? raise : high + 5;
        bidder = v.seat;
        hist.push([v.seat, high]);
        if (v.moon && high === 200) return { bidder, bid: high };
      } else active[v.seat] = false;
      for (let cur = (v.seat + 1) % 4, guard = 0; guard < 160; guard++, cur = (cur + 1) % 4) {
        if (bidder >= 0 && active.filter(Boolean).length <= 1) return { bidder, bid: high };
        if (!active[cur]) continue;
        const cap = Math.min(v.moon && v.scores[cur % 2] < 0 ? 195 : v.limit, C.ceiling(hands[cur], { seat: cur, high, history: hist, scores: v.scores }) + shifts[cur]);
        if (cap >= high + 5 && high + 5 <= v.limit) {
          high += 5;
          bidder = cur;
          hist.push([cur, high]);
          if (v.moon && high === 200) return { bidder, bid: high };
        } else active[cur] = false;
      }
      throw Error("hypothetical auction did not terminate");
    }
    __name(auction, "auction");
    function utility(points, a, v) {
      const delta = points.slice();
      if (points[a.bidder % 2] < a.bid) delta[a.bidder % 2] = -a.bid;
      const team = v.seat % 2, s = v.scores.map((n, i) => n + delta[i]);
      if (v.moon && a.bid === 200 && points[a.bidder % 2] === 200) s[a.bidder % 2] = Math.max(s[a.bidder % 2], v.target);
      const terminal = Math.max(...s) >= v.target || Math.min(...s) <= -v.target;
      if (terminal) return s[team] === s[1 - team] ? 0 : s[team] > s[1 - team] ? 400 : -400;
      return Math.max(-399, Math.min(399, s[team] - s[1 - team]));
    }
    __name(utility, "utility");
    function decideJump(v) {
      validate(v);
      const cap = C.ceiling(v.h, { seat: v.seat, high: v.high, history: v.history, scores: v.scores }), ask = v.high + 5;
      if (cap < ask || ask > v.limit) return { bid: 0, cap, reason: "original ceiling", samples: 0 };
      if (v.bidder < 0 || v.bidder % 2 === v.seat % 2) return { bid: ask, cap, reason: "minimum raise", samples: 0 };
      const candidates = [ask, ...[10, 15, 20, 25].map((n) => v.high + n).filter((n) => n <= Math.min(cap - 10, v.limit, 195))];
      if (candidates.length === 1) return { bid: ask, cap, reason: "minimum raise; insufficient jump reserve", samples: 0 };
      const rng = rngFor(v), unknown = ALL.filter((c) => !v.h.includes(c) && c !== v.revealed), maxima = Array(4).fill(0), rows = [];
      for (const [seat, bid] of v.history) maxima[seat] = Math.max(maxima[seat], bid);
      for (let i = 0; i < 128; i++) {
        const cards = unknown.slice();
        for (let j = cards.length - 1; j > 0; j--) {
          const k = rng(j + 1);
          [cards[j], cards[k]] = [cards[k], cards[j]];
        }
        const n = v.revealed === null ? 6 : 5, nest = cards.slice(0, n);
        if (v.revealed !== null) nest.unshift(v.revealed);
        const hs = [];
        let offset = n;
        for (let seat = 0; seat < 4; seat++) {
          hs[seat] = seat === v.seat ? v.h.slice() : cards.slice(offset, offset + 10);
          if (seat !== v.seat) offset += 10;
        }
        const shifts = Array.from({ length: 4 }, (_, seat) => seat === v.seat ? 0 : [-20, 0, 20][rng(3)]);
        let w = 1;
        for (let seat = 0; seat < 4; seat++) if (seat !== v.seat && maxima[seat]) {
          const c = C.ceiling(hs[seat], { seat, high: maxima[seat] - 5, history: [], scores: v.scores }) + shifts[seat];
          w *= Math.max(0.02, 1 / (1 + Math.exp(Math.max(-40, Math.min(40, (maxima[seat] - c) / 10)))));
        }
        const cache = {}, values = candidates.map((bid) => {
          const a = auction(hs, v, bid, shifts), pts = cache[a.bidder] || (cache[a.bidder] = contract(hs, nest, a.bidder));
          return utility(pts, a, v);
        });
        rows.push({ w, values });
      }
      const sw = rows.reduce((n, r) => n + r.w, 0), neff = sw * sw / rows.reduce((n, r) => n + r.w * r.w, 0);
      const evaluations = candidates.map((bid, j) => {
        const gain = rows.reduce((n, r) => n + r.w * (r.values[j] - r.values[0]), 0) / sw, variance = rows.reduce((n, r) => n + r.w * (r.values[j] - r.values[0] - gain) ** 2, 0) / sw, se = Math.sqrt(variance / Math.max(1, neff - 1));
        return { bid, gain, se };
      });
      let best = evaluations[0];
      for (const e of evaluations.slice(1)) if (e.gain > 2 + 0.5 * e.se && e.gain - 0.5 * e.se > best.gain - 0.5 * best.se) best = e;
      return { bid: best.bid, cap, reason: best.bid === ask ? "minimum raise preferred" : "evaluated pressure jump", samples: 128, evaluations, effectiveSamples: neff };
    }
    __name(decideJump, "decideJump");
    function decide(v) {
      validate(v);
      const cap = C.ceiling(v.h, { seat: v.seat, high: v.high, history: v.history, scores: v.scores }), ask = v.high + 5;
      const baseline = cap >= ask && ask <= v.limit;
      if (v.bidder !== (v.seat + 2) % 4 || !baseline) return { bid: baseline ? ask : 0, cap, reason: "original ceiling", samples: 0 };
      const rng = rngFor(v), unknown = ALL.filter((c) => !v.h.includes(c) && c !== v.revealed), maxima = Array(4).fill(0);
      for (const [s, b] of v.history) maxima[s] = Math.max(maxima[s], b);
      const rows = [];
      for (let i = 0; i < 256; i++) {
        const cards = unknown.slice();
        for (let j = cards.length - 1; j > 0; j--) {
          const k = rng(j + 1);
          [cards[j], cards[k]] = [cards[k], cards[j]];
        }
        const n = v.revealed === null ? 6 : 5, nest = cards.slice(0, n);
        if (v.revealed !== null) nest.unshift(v.revealed);
        const hs = [];
        let offset = n;
        for (let s = 0; s < 4; s++) {
          hs[s] = s === v.seat ? v.h.slice() : cards.slice(offset, offset + 10);
          if (s !== v.seat) offset += 10;
        }
        const shifts = Array.from({ length: 4 }, (_, s) => s === v.seat ? 0 : [-20, 0, 20][rng(3)]);
        let w = 1;
        for (let s = 0; s < 4; s++) if (s !== v.seat && maxima[s]) {
          const c = C.ceiling(hs[s], { seat: s, high: maxima[s] - 5, history: [], scores: v.scores }) + shifts[s];
          w *= Math.max(0.02, 1 / (1 + Math.exp(Math.max(-40, Math.min(40, (maxima[s] - c) / 10)))));
        }
        const pass = auction(hs, v, false, shifts), raise = auction(hs, v, true, shifts), cache = {};
        const pts = /* @__PURE__ */ __name((a) => cache[a.bidder] || (cache[a.bidder] = contract(hs, nest, a.bidder)), "pts");
        const p0 = pts(pass), p1 = pts(raise);
        rows.push({ w, d: utility(p1, raise, v) - utility(p0, pass, v), made: p1[raise.bidder % 2] >= raise.bid, own: raise.bidder === v.seat });
      }
      const sw = rows.reduce((a, r) => a + r.w, 0), avg = /* @__PURE__ */ __name((f) => rows.reduce((a, r) => a + r.w * f(r), 0) / sw, "avg"), gain = avg((r) => r.d), neff = sw * sw / rows.reduce((a, r) => a + r.w * r.w, 0), se = Math.sqrt(avg((r) => (r.d - gain) ** 2) / Math.max(1, neff - 1));
      const take = gain > 2 + 0.5 * se;
      return { bid: take ? ask : 0, cap, reason: take ? "team-value takeover" : "support partner", samples: 256, gain, se, effectiveSamples: neff, pMake: avg((r) => r.made ? 1 : 0), pControl: avg((r) => r.own ? 1 : 0) };
    }
    __name(decide, "decide");
    const api = { decide, decideJump, contract, move, validate };
    if (typeof module !== "undefined") module.exports = api;
    root.X1Bidding = api;
  })(globalThis2);
  return Object.freeze({ core: globalThis2.X1Core, bidding: globalThis2.X1Bidding, sha256: globalThis2.x1SHA256 });
})();
var X1_RULES = /* @__PURE__ */ (() => {
  function rng(seed2) {
    let x = seed2 >>> 0;
    return (n) => {
      x = x + 1831565813 >>> 0;
      let t = x;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) % n;
    };
  }
  __name(rng, "rng");
  function seed(v) {
    let x = 2166136261;
    for (const c of JSON.stringify(v)) x = Math.imul(x ^ c.charCodeAt(0), 16777619) >>> 0;
    return x;
  }
  __name(seed, "seed");
  function rules(v, tr = v.tr) {
    const { cards, settings } = v, n = cards.length;
    const p = cards.map((c) => c.points), rank = cards.map((c) => c.rank);
    const cat = cards.map((c) => c.special ? tr : c.color);
    function legal(h, tc) {
      if (!tc.length) return h.slice();
      const led = cat[tc[0]], follows = h.filter((c) => cat[c] === led);
      let result = follows.length ? follows : settings.rules.mustTrumpWhenVoid && h.some((c) => cat[c] === tr) ? h.filter((c) => cat[c] === tr) : h.slice();
      if (settings.rules.specialsAnytime) result = [.../* @__PURE__ */ new Set([...result, ...h.filter((c) => cards[c].special)])];
      return result;
    }
    __name(legal, "legal");
    const beats = /* @__PURE__ */ __name((a, b, led) => cat[a] !== cat[b] ? cat[a] === tr || cat[b] !== tr && cat[a] === led : (cat[a] === tr || cat[a] === led) && rank[a] > rank[b], "beats");
    function winner(tc) {
      let w = 0;
      for (let i = 1; i < tc.length; i++) if (beats(tc[i], tc[w], cat[tc[0]])) w = i;
      return w;
    }
    __name(winner, "winner");
    function move(h, tc, ts, seen, knownNest, seat) {
      const L = legal(h, tc), low = /* @__PURE__ */ __name((a) => a.reduce((a2, b) => (cat[b] === tr ? 1e6 : 0) + p[b] * 2e3 + rank[b] < (cat[a2] === tr ? 1e6 : 0) + p[a2] * 2e3 + rank[a2] ? b : a2), "low");
      const np = /* @__PURE__ */ __name((a) => {
        const q = a.filter((c) => !cards[c].special);
        return q.length ? q : a;
      }, "np");
      if (!tc.length) {
        const unknown = cards.map((_, i) => i).filter((c) => !seen[c] && !h.includes(c) && !knownNest.includes(c));
        const trump = L.filter((c) => cat[c] === tr), plain = trump.filter((c) => !cards[c].special), side = L.filter((c) => cat[c] !== tr);
        if (trump.length >= 4 && unknown.filter((c) => cat[c] === tr).length >= 2 && plain.length) return low(plain);
        if (side.length) {
          let group = [], high = -Infinity;
          for (let col = 0; col < 4; col++) {
            const q = side.filter((c) => cat[c] === col), r = Math.max(...q.map((c) => rank[c]));
            if (q.length > group.length || q.length === group.length && r > high) {
              group = q;
              high = r;
            }
          }
          const top = group.filter((c) => !unknown.some((x) => beats(x, c, cat[c]))), zero2 = group.filter((c) => !p[c]);
          return low(top.length ? top : zero2.length ? zero2 : group);
        }
        return low(np(L));
      }
      const wi = winner(tc), val = tc.reduce((a, c) => a + p[c], 0), wins = L.filter((c) => beats(c, tc[wi], cat[tc[0]])), zero = L.filter((c) => !p[c]);
      if (ts[wi] === (seat + 2) % 4) {
        if (tc.length === 3) {
          const feed = L.filter((c) => p[c] && !cards[c].special && !beats(c, tc[wi], cat[tc[0]]));
          if (feed.length) return feed.reduce((a, b) => p[b] > p[a] || p[b] === p[a] && rank[b] < rank[a] ? b : a);
        }
        return low(np(zero.length ? zero : L));
      }
      if (wins.length) {
        if (tc.length === 3 || val >= 10) return low(np(wins));
        const cheap = wins.filter((c) => cat[c] !== tr && !p[c]);
        if (cheap.length) return cheap.reduce((a, b) => rank[b] < rank[a] ? b : a);
      }
      return low(np(zero.length ? zero : L));
    }
    __name(move, "move");
    function discard(h, count) {
      const lens = Array.from({ length: 4 }, (_, i) => h.filter((c) => cat[c] === i && !cards[c].special).length);
      const strong = h.filter((c) => cat[c] === tr).length >= 6;
      const value = /* @__PURE__ */ __name((c) => {
        if (cat[c] === tr) return 5e3 + rank[c] * 8 + p[c] * 20;
        const len = lens[cat[c]], r = rank[c];
        return (r >= 15 ? 1800 : r >= 14 ? 1150 : r >= 13 ? 550 : r >= 12 ? 260 : 0) + p[c] * 28 + r * 2 + len * 45 - (p[c] && len <= 2 && r < 14 ? strong ? 260 : 120 : 0) - (p[c] === 0 ? len === 1 ? 900 : len === 2 ? 520 : len === 3 ? 140 : 0 : 0);
      }, "value");
      return h.slice().sort((a, b) => value(b) - value(a) || a - b).slice(0, h.length - count);
    }
    __name(discard, "discard");
    return { p, rank, cat, legal, beats, winner, move, discard, n };
  }
  __name(rules, "rules");
  function sampler(v, random) {
    const own = new Set(v.h), played = new Set(v.played || []), known = new Set(v.nest || []), partner = v.partner ?? null;
    const partnerCards = new Set(v.partnerHand || []), widow = new Set(v.publicWidow || []);
    const seats = [], sizes = [];
    for (let s = 0; s < 4; s++) if (s !== v.seat) {
      seats.push(s);
      sizes.push(v.lengths[s]);
    }
    if (v.hiddenNest) {
      seats.push(4);
      sizes.push(v.hiddenNest);
    }
    const unknown = v.cards.map((_, i) => i).filter((c) => !own.has(c) && !played.has(c) && !known.has(c));
    if (sizes.reduce((a, b) => a + b, 0) !== unknown.length) throw Error("X1_WORLD_SIZE");
    const R = rules(v), allow = [];
    for (const c of unknown) {
      let bits = 0;
      for (let g = 0; g < seats.length; g++) {
        const s = seats[g];
        if (s < 4 && (v.voids[s] || 0) & 1 << R.cat[c]) continue;
        if (partner !== null && s === partner !== partnerCards.has(c)) continue;
        if (c === v.revealed && s !== 4) continue;
        if (widow.has(c) && s !== v.bidder && s !== 4) continue;
        bits |= 1 << g;
      }
      if (!bits) throw Error("X1_WORLD_CONSTRAINT");
      allow[c] = bits;
    }
    const G = seats.length, counts = Array(1 << G).fill(0), remain = sizes.slice();
    for (const c of unknown) counts[allow[c]]++;
    function feasible() {
      for (let m = 1; m < 1 << G; m++) {
        let need = 0, capacity = 0;
        for (let x = 1; x < 1 << G; x++) if ((x & m) === x) need += counts[x];
        for (let g = 0; g < G; g++) if (m & 1 << g) capacity += remain[g];
        if (need > capacity) return false;
      }
      return true;
    }
    __name(feasible, "feasible");
    if (!feasible()) throw Error("X1_INFEASIBLE_WORLD");
    const order = unknown.slice();
    for (let i = order.length - 1; i > 0; i--) {
      const j = random(i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }
    const pop = /* @__PURE__ */ __name((n) => {
      let p = 0;
      while (n) {
        n &= n - 1;
        p++;
      }
      return p;
    }, "pop");
    order.sort((a, b) => pop(allow[a]) - pop(allow[b]));
    const slots = [], groups = [];
    for (const c of order) {
      counts[allow[c]]--;
      const choices = [];
      let total = 0;
      for (let g2 = 0; g2 < G; g2++) if (remain[g2] && allow[c] & 1 << g2) {
        remain[g2]--;
        const ok = feasible();
        remain[g2]++;
        if (ok) {
          choices.push(g2);
          total += remain[g2];
        }
      }
      if (!choices.length) throw Error("X1_ALLOCATE");
      let roll = random(total), g = choices[0];
      for (const q of choices) {
        g = q;
        if (roll < remain[q]) break;
        roll -= remain[q];
      }
      remain[g]--;
      slots.push(c);
      groups.push(g);
    }
    function mix(steps) {
      if (slots.length < 2) return;
      for (let z = 0; z < steps; z++) {
        const count = slots.length >= 3 && random(4) === 0 ? Math.min(slots.length, 3 + random(2)) : 2, ix = [];
        while (ix.length < count) {
          const i = random(slots.length);
          if (!ix.includes(i)) ix.push(i);
        }
        if (!ix.every((i, j) => allow[slots[i]] & 1 << groups[ix[(j + 1) % count]])) continue;
        const last = slots[ix[count - 1]];
        for (let i = count - 1; i > 0; i--) slots[ix[i]] = slots[ix[i - 1]];
        slots[ix[0]] = last;
      }
    }
    __name(mix, "mix");
    mix(512);
    return () => {
      mix(64);
      const h = [[], [], [], []], nest = (v.nest || []).slice();
      h[v.seat] = v.h.slice();
      slots.forEach((c, i) => {
        const s = seats[groups[i]];
        if (s === 4) nest.push(c);
        else h[s].push(c);
      });
      return { h, nest };
    };
  }
  __name(sampler, "sampler");
  function utility(v, points) {
    const b = v.bidder % 2, delta = points.slice(), made = points[b] >= v.bid;
    delta[b] = made ? v.settings.bidOnlyScoring ? v.bid : points[b] : -v.bid;
    if (made && !v.settings.bidOnlyScoring && v.settings.sandbagging) {
      const added = Math.floor(Math.max(0, points[b] - v.bid) / 10) * 10;
      delta[b] -= Math.floor(((v.sandbagOverpoints?.[b] || 0) + added) / 100) * 100;
    }
    const scores = v.scores.map((s, i) => s + delta[i]);
    if (v.moon && made) scores[b] = Math.max(scores[b], v.settings.targetScore);
    const moonWinner = made ? b : 1 - b;
    const result = v.moon ? moonWinner === 0 ? "Team A" : "Team B" : matchResult(scores, v.settings.targetScore), team = v.seat % 2;
    if (result) return result === "Tie" ? 0 : result === (team === 0 ? "Team A" : "Team B") ? 1e4 : -1e4;
    return Math.max(-9999, Math.min(9999, scores[team] - scores[1 - team]));
  }
  __name(utility, "utility");
  function rollout(v, world, first = null, config = {}) {
    const tr = config.tr ?? v.tr, R = rules(v, tr), h = world.h.map((a) => a.slice()), nest = world.nest.slice();
    let tc = (config.tc ?? v.tc ?? []).slice(), ts = (config.ts ?? v.ts ?? []).slice(), seat = config.lead ?? v.seat, c = first;
    const seen = Array(v.cards.length).fill(false);
    for (const x of v.played || []) seen[x] = true;
    const points = (config.points ?? v.points ?? [0, 0]).slice();
    let last = v.bidder, steps = 0;
    while (h.some((a) => a.length)) {
      if (++steps > v.cards.length + 4) throw Error("X1_ROLLOUT_LIMIT");
      if (c === null) c = R.move(h[seat], tc, ts, seen, seat === v.bidder ? nest : [], seat);
      const at = h[seat].indexOf(c);
      if (at < 0 || !R.legal(h[seat], tc).includes(c)) throw Error("X1_ROLLOUT_LEGALITY");
      h[seat].splice(at, 1);
      tc.push(c);
      ts.push(seat);
      seen[c] = true;
      if (tc.length === 4) {
        last = ts[R.winner(tc)];
        points[last % 2] += tc.reduce((n, c2) => n + R.p[c2], 0);
        tc = [];
        ts = [];
        seat = last;
      } else seat = (seat + 1) % 4;
      c = null;
    }
    if (tc.length) throw Error("X1_INCOMPLETE_TRICK");
    points[(v.settings.nestGoesTo === "bidder" ? v.bidder : last) % 2] += nest.reduce((n, c2) => n + R.p[c2], 0);
    return { points, value: utility(v, points) };
  }
  __name(rollout, "rollout");
  function choose(v) {
    const R = rules(v), L = R.legal(v.h, v.tc), seen = Array(v.cards.length).fill(false);
    for (const c of v.played) seen[c] = true;
    const reference = R.move(v.h, v.tc, v.ts, seen, v.nest, v.seat), ri = L.indexOf(reference);
    if (L.length === 1) return { card: L[0], samples: 0 };
    const draw = sampler(v, rng(seed(v))), samples = v.h.length <= 3 ? 256 : 128, sum = L.map(() => 0), squares = L.map(() => 0);
    for (let i = 0; i < samples; i++) {
      const world = draw(), values = L.map((c, j) => {
        const n = rollout(v, world, c).value;
        sum[j] += n;
        return n;
      });
      for (let j = 0; j < L.length; j++) {
        const d = values[j] - values[ri];
        squares[j] += d * d;
      }
    }
    let best = ri, adv = 0;
    for (let j = 0; j < L.length; j++) {
      const d = (sum[j] - sum[ri]) / samples, se = Math.sqrt(Math.max(0, squares[j] / samples - d * d) / (samples - 1)), adjusted = d - 0.5 - 0.5 * se;
      if (adjusted > adv) {
        adv = adjusted;
        best = j;
      }
    }
    return { card: L[best], samples, reference };
  }
  __name(choose, "choose");
  function strength(v, h, tr) {
    const R = rules(v, tr), suited = h.filter((c) => R.cat[c] === tr), side = h.filter((c) => R.cat[c] !== tr), high = suited.reduce((n, c) => n + (R.rank[c] >= 14 ? 4 : R.rank[c] >= 12 ? 2 : 0), 0);
    return suited.length * 10 + Math.max(0, suited.length - 4) * 4 + high * 4 + side.reduce((n, c) => n + (R.rank[c] >= 14 ? 12 : R.rank[c] >= 13 ? 4 : 0), 0) + h.reduce((n, c) => n + R.p[c], 0) * 0.55;
  }
  __name(strength, "strength");
  function plan(v, count, search = true) {
    const candidates = Array.from({ length: 4 }, (_, tr) => {
      const keep = rules(v, tr).discard(v.h, count);
      return { tr, keep, score: strength(v, keep, tr) };
    }).sort((a, b) => b.score - a.score || a.tr - b.tr);
    if (!search) return candidates[0];
    const input = { ...v, lengths: Array(4).fill(v.settings.handSize), hiddenNest: 0, nest: [], played: [], tc: [], ts: [], voids: [0, 0, 0, 0] };
    const draw = sampler(input, rng(seed(input))), sum = candidates.map(() => 0), sq = candidates.map(() => 0), samples = 128;
    for (let i = 0; i < samples; i++) {
      const w = draw(), values = candidates.map((p, j) => {
        const h = w.h.map((a) => a.slice());
        h[v.seat] = p.keep.slice();
        const nest = v.h.filter((c) => !p.keep.includes(c));
        const lead = v.settings.leadOrder === "leftOfBidder" ? (v.bidder + 1) % 4 : v.settings.leadOrder === "rightOfBidder" ? (v.bidder + 3) % 4 : v.bidder;
        const out = rollout({ ...v, tr: p.tr, tc: [], ts: [], played: [], points: [0, 0] }, { h, nest }, null, { lead }).value;
        sum[j] += out;
        return out;
      });
      for (let j = 0; j < candidates.length; j++) {
        const d = values[j] - values[0];
        sq[j] += d * d;
      }
    }
    let best = 0, adv = 0;
    for (let j = 1; j < candidates.length; j++) {
      const d = (sum[j] - sum[0]) / samples, se = Math.sqrt(Math.max(0, sq[j] / samples - d * d) / (samples - 1));
      if (d - 0.5 - 0.5 * se > adv) {
        adv = d - 0.5 - 0.5 * se;
        best = j;
      }
    }
    return candidates[best];
  }
  __name(plan, "plan");
  function bid(v, allowedCandidates = null) {
    const total = v.cards.reduce((n, c) => n + c.points, 0), limit = Math.floor(total / 5) * 5, ask = v.high + 5;
    if (ask > limit) return { bid: 0, samples: 0 };
    const initialPlan = plan(v, 0, false), power = strength(v, v.h, initialPlan.tr), cap = Math.min(limit, Math.max(0, Math.floor((power * 0.8 + v.h.reduce((n, c) => n + v.cards[c].points, 0) * 0.4) / 5) * 5));
    let candidates = [0];
    if (cap >= ask) candidates.push(ask, ...[10, 15, 20].map((n) => v.high + n).filter((n) => n > ask && n <= Math.min(cap - 10, limit)));
    if (allowedCandidates) candidates = [...new Set(allowedCandidates)];
    if (v.settings.shootMoonEnabled) candidates = candidates.filter((c) => c !== total);
    if (!candidates.includes(0)) candidates.unshift(0);
    if (candidates.length === 1) return { bid: 0, samples: 0 };
    const input = { ...v, lengths: Array(4).fill(v.settings.handSize), hiddenNest: v.cards.length - 4 * v.settings.handSize, nest: [], tc: [], ts: [], played: [], voids: [0, 0, 0, 0] }, draw = sampler(input, rng(seed(input)));
    const sums = candidates.map(() => 0), squares = candidates.map(() => 0), samples = 128;
    function auction(w, offer) {
      const active = v.passed.map((p) => !p), history = v.history.slice();
      let high = v.high, bidder = v.bidder;
      if (offer) {
        high = offer;
        bidder = v.seat;
        history.push([v.seat, offer]);
      } else active[v.seat] = false;
      if (offer === total && v.settings.shootMoonEnabled) return { bidder, bid: high };
      for (let s = (v.seat + 1) % 4, k = 0; k < 200; k++, s = (s + 1) % 4) {
        if (bidder >= 0 && active.filter(Boolean).length <= 1) return { bidder, bid: high };
        if (!active[s]) continue;
        const view = { ...v, seat: s, h: w.h[s] }, p = plan(view, 0, false), ability = Math.min(limit, Math.floor((strength(view, w.h[s], p.tr) * 0.8 + w.h[s].reduce((n, c) => n + v.cards[c].points, 0) * 0.4) / 5) * 5);
        if (ability >= high + 5 && high + 5 <= limit - (v.settings.shootMoonEnabled ? 5 : 0)) {
          high += 5;
          bidder = s;
        } else active[s] = false;
      }
      return bidder >= 0 ? { bidder, bid: high } : v.settings.screwTheDealer ? { bidder: v.dealer, bid: v.settings.minBid } : null;
    }
    __name(auction, "auction");
    for (let i = 0; i < samples; i++) {
      const w = draw(), cache = /* @__PURE__ */ new Map(), values = candidates.map((offer, j) => {
        const a = auction(w, offer);
        if (!a) return 0;
        const key = a.bidder + ":" + a.bid;
        let out = cache.get(key);
        if (out === void 0) {
          const h = w.h.map((a2) => a2.slice()), all = h[a.bidder].concat(w.nest), base = { ...v, seat: a.bidder, h: all, bidder: a.bidder, bid: a.bid, moon: !!v.settings.shootMoonEnabled && a.bid === total };
          const p = plan(base, w.nest.length, false);
          h[a.bidder] = p.keep;
          const nest = all.filter((c) => !p.keep.includes(c)), lead = v.settings.leadOrder === "leftOfBidder" ? (a.bidder + 1) % 4 : v.settings.leadOrder === "rightOfBidder" ? (a.bidder + 3) % 4 : a.bidder;
          out = rollout({ ...base, seat: v.seat, tr: p.tr, played: [], tc: [], ts: [], points: [0, 0] }, { h, nest }, null, { lead }).value;
          cache.set(key, out);
        }
        sums[j] += out;
        return out;
      });
      for (let j = 0; j < values.length; j++) {
        const d = values[j] - values[0];
        squares[j] += d * d;
      }
    }
    let best = 0, adv = 0;
    for (let j = 1; j < candidates.length; j++) {
      const d = (sums[j] - sums[0]) / samples, se = Math.sqrt(Math.max(0, squares[j] / samples - d * d) / (samples - 1));
      if (d - 2 - 0.5 * se > adv) {
        adv = d - 2 - 0.5 * se;
        best = j;
      }
    }
    return { bid: candidates[best], samples };
  }
  __name(bid, "bid");
  return { rules, sampler, utility, rollout, choose, plan, bid, seed };
})();
function x1EligiblePartner(room, seat) {
  const s = room.gameState, p = s.players, roster = room.seats;
  if (!["bidding", "discard", "trump", "play"].includes(s.phase) || s.paused || !Array.isArray(p) || p.length !== 4 || !Array.isArray(roster) || roster.length !== 4) return null;
  if (p.some((a, i) => !a || a.seat !== i || a.team !== i % 2 || typeof a.isBot !== "boolean" || !a.playerId || !roster[i] || roster[i].playerId !== a.playerId || botControls(roster[i]) !== a.isBot)) return null;
  if (new Set(p.map((a) => a.playerId)).size !== 4 || p.filter((a) => !a.isBot).length !== 1) return null;
  const partner = (seat + 2) % 4;
  return p[seat]?.isBot && !p[partner].isBot ? partner : null;
}
__name(x1EligiblePartner, "x1EligiblePartner");
function x1ExtendedView(state, seat, memory, partner = null) {
  const deck = makeDeck(state.settings.rules), ids = new Map(deck.map((c, i) => [c.id, i]));
  const index = /* @__PURE__ */ __name((c) => {
    const n = ids.get(c.id);
    if (n === void 0) throw Error("X1_UNKNOWN_CARD");
    return n;
  }, "index");
  const cards = deck.map((c) => ({ id: c.id, color: COLORS.indexOf(c.color), rank: effectiveRank(c, state.settings.rules), points: cardPoints(c, state.settings.rules), special: isPermanentTrump(c, state.settings.rules) }));
  const played = [...state.tricksTaken[0], ...state.tricksTaken[1], ...state.trick.map((p) => p.card)].map(index);
  const tc = state.trick.map((p) => index(p.card)), ts = state.trick.map((p) => p.player), completed = (played.length - tc.length) / 4;
  const lengths = Array(4).fill(state.settings.handSize - completed);
  for (const s of ts) lengths[s]--;
  const knownNest = seat === state.bidder && state.phase === "play" ? (state.nestCards || []).map(index) : [];
  const v = {
    cards,
    h: state.hands[seat].map(index),
    seat,
    tr: COLORS.indexOf(state.trump),
    tc,
    ts,
    played,
    nest: knownNest,
    hiddenNest: state.phase === "play" && seat !== state.bidder ? deck.length - 4 * state.settings.handSize : 0,
    lengths,
    voids: memory.voids.slice(),
    points: state.tricksTaken.map((a) => a.reduce((n, c) => n + cardPoints(c, state.settings.rules), 0)),
    settings: { handSize: state.settings.handSize, nestGoesTo: state.settings.nestGoesTo, leadOrder: state.settings.leadOrder, bidOnlyScoring: state.settings.bidOnlyScoring, sandbagging: state.settings.sandbagging, screwTheDealer: state.settings.screwTheDealer, minBid: state.settings.minBid, targetScore: state.settings.targetScore, shootMoonEnabled: state.settings.shootMoonEnabled, rules: { ...state.settings.rules } },
    sandbagOverpoints: state.sandbagOverpoints.slice(),
    scores: state.scores.slice(),
    bidder: state.bidder,
    bid: state.bid,
    moon: !!state.shotTheMoon,
    dealer: state.dealer,
    high: state.highestBid,
    passed: state.bidStatus.map((b) => b === "pass"),
    history: memory.history.map((r) => r.slice()),
    publicWidow: state.settings.openWidow ? (state.widowSpread || []).map(index) : [],
    revealed: state.phase === "bidding" && state.settings.revealTopNest && state.topNestCard ? index(state.topNestCard) : null
  };
  if (partner !== null) {
    v.partner = partner;
    v.partnerHand = state.hands[partner].map(index);
  }
  return v;
}
__name(x1ExtendedView, "x1ExtendedView");
function chooseExtendedX1(room, seat, partner) {
  const s = room.gameState, m = room.x1, v = x1ExtendedView(s, seat, m, partner);
  let action, plan = null, samples = 0;
  if (s.phase === "bidding") {
    const d = X1_RULES.bid(v);
    action = { type: "bid", value: d.bid };
    samples = d.samples;
  } else if (s.phase === "discard") {
    const p = X1_RULES.plan(v, s.discardCount);
    plan = { seat, trump: p.tr, keep: p.keep, extended: true };
    const keep = new Set(p.keep.map((i) => v.cards[i].id));
    action = { type: "discard", cardIds: s.hands[seat].filter((c) => !keep.has(c.id)).map((c) => c.id) };
    samples = 128;
  } else if (s.phase === "trump") {
    const tr = m.plan?.seat === seat ? m.plan.trump : X1_RULES.plan(v, 0, false).tr;
    action = { type: "trump", color: COLORS[tr] };
  } else if (s.phase === "play") {
    const d = X1_RULES.choose(v);
    action = { type: "play", cardId: v.cards[d.card].id };
    samples = d.samples;
  } else throw Error("X1_UNSUPPORTED_PHASE");
  return { action, plan, engine: "x1-rules", reason: null, partnerAssist: partner !== null, samples };
}
__name(chooseExtendedX1, "chooseExtendedX1");
function x1AnchorRoute(state, seat, partner) {
  const actor = state.players[seat];
  if (partner === null || !(actor.avatar === "anchor" || actor.name === "Anchor" || actor.name === "Rita" && actor.avatar === "rita")) return null;
  const r = state.settings.rules, trump = state.trump, hand = state.hands[partner], legal = state.hands[seat].filter((c) => canPlay(c, state.hands[seat], state.ledColor, trump, r));
  const rank = /* @__PURE__ */ __name((c) => effectiveRank(c, r), "rank"), points = /* @__PURE__ */ __name((c) => cardPoints(c, r), "points"), permanent = /* @__PURE__ */ __name((c) => isPermanentTrump(c, r), "permanent"), isTrump = /* @__PURE__ */ __name((c) => isTrumpCard(c, trump, r), "isTrump");
  const cheap = /* @__PURE__ */ __name((a) => a.slice().sort((a2, b) => rank(a2) - rank(b))[0], "cheap"), pointy = /* @__PURE__ */ __name((a) => a.slice().sort((a2, b) => points(b) - points(a2) || rank(b) - rank(a2))[0], "pointy");
  const team = seat % 2, bidTeam = state.bidder % 2, captured = state.tricksTaken.map((a) => a.reduce((n, c) => n + points(c), 0)), protecting = bidTeam === team && captured[team] < state.bid, setting = bidTeam !== team && captured[bidTeam] < state.bid, partnerTrump = hand.filter(isTrump);
  if (!state.ledColor) {
    for (const col of COLORS.filter((col2) => col2 !== trump && !hand.some((c) => c.color === col2 && !permanent(c)))) {
      const a = legal.filter((c) => c.color === col && !permanent(c));
      if (a.length) return cheap(a);
    }
    if (partnerTrump.length <= 2 && protecting) {
      const a = legal.filter((c) => !isTrump(c) && points(c) === 0);
      if (a.length) return cheap(a);
    }
    if (setting && partnerTrump.some((c) => permanent(c) || rank(c) >= 14)) {
      const a = legal.filter((c) => !isTrump(c));
      if (a.length) return cheap(a);
    }
    return null;
  }
  let winner = state.trick[0];
  for (const p of state.trick.slice(1)) if (compareCards(p.card, winner.card, state.ledColor, trump, r) > 0) winner = p;
  const pts = state.trick.reduce((n, p) => n + points(p.card), 0);
  if (winner?.player === partner && pts > 0) {
    const a = legal.filter((c) => points(c) > 0 && !permanent(c));
    if (a.length) return pointy(a);
    const zero = legal.filter((c) => points(c) === 0 && !permanent(c));
    if (zero.length) return cheap(zero);
  }
  if (winner && winner.player % 2 !== team && pts >= 5 && setting) {
    const a = legal.filter((c) => compareCards(c, winner.card, state.ledColor, trump, r) > 0);
    if (a.length) return a.slice().sort((a2, b) => (permanent(a2) ? 100 : 0) - (permanent(b) ? 100 : 0) || rank(a2) - rank(b))[0];
  }
  if (protecting && partnerTrump.length <= 2 && pts < 10) {
    const a = legal.filter((c) => !permanent(c) && points(c) === 0);
    if (a.length) return cheap(a);
  }
  return null;
}
__name(x1AnchorRoute, "x1AnchorRoute");
var ONLINE_X1_VERSION = "x1-online-v2";
function freshOnlineX1(state) {
  return {
    version: ONLINE_X1_VERSION,
    hand: state.handNumber,
    voids: [0, 0, 0, 0],
    history: [],
    plan: null,
    decisions: { bid: 0, discard: 0, trump: 0, play: 0 },
    fallbacks: 0,
    lastEngine: null,
    lastFallback: null,
    lastDecisionMs: 0,
    maxDecisionMs: 0
  };
}
__name(freshOnlineX1, "freshOnlineX1");
function x1CardId(card) {
  if (card?.id === "rook") return 45;
  if (card?.id === "red-2") return 44;
  const color = ONLINE_X1.core.colors.indexOf(card?.color), rank = Number(card?.rank);
  if (color < 0 || card.id === "red1-special") throw Error("X1_UNSUPPORTED_CARD");
  if (rank === 1) return 40 + color;
  if (!Number.isInteger(rank) || rank < 5 || rank > 14) throw Error("X1_UNSUPPORTED_CARD");
  return color * 10 + rank - 5;
}
__name(x1CardId, "x1CardId");
function x1Compatible(state) {
  const s = state.settings, r = s.rules;
  return Number(s.minBid) >= 70 && Number(s.minBid) <= 200 && Number(s.minBid) % 5 === 0 && s.handSize === 10 && s.nestSize === 6 && s.nestGoesTo === "lastTrick" && !s.bidOnlyScoring && !s.openWidow && r.includeOnes && r.onesHigh && r.includeRed2 && r.includeRook && !r.includeRed1 && !r.rookLowest && !r.specialsAnytime && !r.mustTrumpWhenVoid && Number(r.red2Points) === 20;
}
__name(x1Compatible, "x1Compatible");
function x1OrderedHand(state, seat, memory) {
  const own = state.hands[seat];
  if (memory?.plan?.seat !== seat || !Array.isArray(memory.plan.keep)) return own;
  const byId = new Map(own.map((card) => [x1CardId(card), card]));
  const ordered = memory.plan.keep.filter((id) => byId.has(id)).map((id) => byId.get(id));
  return ordered.length === own.length ? ordered : own;
}
__name(x1OrderedHand, "x1OrderedHand");
function x1PlayInput(state, seat, memory, partner = null) {
  const C = ONLINE_X1.core;
  const h = x1OrderedHand(state, seat, memory).map(x1CardId);
  const tc = state.trick.map((p) => x1CardId(p.card)), ts = state.trick.map((p) => p.player);
  const playedCards = [
    ...state.tricksTaken[0],
    ...state.tricksTaken[1],
    ...state.trick.map((p) => p.card)
  ];
  const played = C.mask(playedCards.map(x1CardId));
  const nest = seat === state.bidder ? C.mask((state.nestCards || []).map(x1CardId)) : 0n;
  const points = state.tricksTaken.map(
    (cards) => cards.reduce((n, card) => n + cardPoints(card, state.settings.rules), 0)
  );
  const voids = memory.voids.slice();
  const payload = "[" + [
    JSON.stringify(h),
    JSON.stringify(tc),
    JSON.stringify(ts),
    JSON.stringify(state.trump),
    seat,
    state.bidder,
    state.bid,
    JSON.stringify(points),
    String(played),
    String(nest),
    JSON.stringify(voids)
  ].join(",") + "]";
  const bytes = ONLINE_X1.sha256(payload);
  let seed = 0n;
  for (let i = 7; i >= 0; i--) seed = seed << 8n | BigInt(bytes[i]);
  const privilege = partner === null ? {} : { partnerMask: String(C.mask(state.hands[partner].map(x1CardId))) };
  return {
    ...privilege,
    h,
    tc,
    ts,
    tr: C.colors.indexOf(state.trump),
    seat,
    bidder: state.bidder,
    bid: state.bid,
    points,
    played: String(played),
    nest: String(nest),
    voids,
    seed: String(seed)
  };
}
__name(x1PlayInput, "x1PlayInput");
function x1BidInput(state, seat, memory) {
  return {
    h: state.hands[seat].map(x1CardId),
    seat,
    dealer: state.dealer,
    high: state.highestBid,
    bidder: state.bidder,
    history: memory.history.map((row) => row.slice()),
    scores: state.scores.slice(),
    passed: state.bidStatus.map((x) => x === "pass"),
    limit: state.settings.shootMoonEnabled && state.players[seat]?.isBot ? 195 : 200,
    target: state.settings.targetScore,
    revealed: state.settings.revealTopNest && state.topNestCard ? x1CardId(state.topNestCard) : null,
    moon: !!state.settings.shootMoonEnabled
  };
}
__name(x1BidInput, "x1BidInput");
function x1ActionLegal(state, seat, action) {
  if (!action || seat !== state.currentPlayer) return false;
  const hand = state.hands[seat];
  if (state.phase === "bidding")
    return action.type === "bid" && Number.isInteger(action.value) && (action.value === 0 || action.value % 5 === 0 && action.value >= state.highestBid + 5 && action.value <= makeDeck(state.settings.rules).reduce((n, c) => n + cardPoints(c, state.settings.rules), 0));
  if (state.phase === "discard")
    return action.type === "discard" && seat === state.bidder && Array.isArray(action.cardIds) && action.cardIds.length === state.discardCount && new Set(action.cardIds).size === action.cardIds.length && action.cardIds.every((id) => hand.some((c) => c.id === id));
  if (state.phase === "trump")
    return action.type === "trump" && seat === state.bidder && COLORS.includes(action.color);
  if (state.phase === "play") {
    const card = hand.find((c) => c.id === action.cardId);
    return action.type === "play" && !!card && canPlay(card, hand, state.ledColor, state.trump, state.settings.rules);
  }
  return false;
}
__name(x1ActionLegal, "x1ActionLegal");
function choosePreviousOnlineBotAction(room, seat) {
  const state = room.gameState, memory = room.x1;
  const fallback = /* @__PURE__ */ __name((reason2) => ({
    action: chooseTestBotAction(state, seat),
    engine: "legacy",
    reason: reason2
  }), "fallback");
  if (!memory || memory.hand !== state.handNumber) return fallback("existing-hand");
  if (!x1Compatible(state)) return fallback("unsupported-rules");
  if (state.shotTheMoon) return fallback("moon-contract");
  const started = performance.now(), C = ONLINE_X1.core;
  let action, plan = null, engine = "x1", reason = null;
  try {
    if (state.phase === "bidding") {
      const v = x1BidInput(state, seat, memory), ask = v.high + 5;
      const cap = C.ceiling(v.h, { seat, high: v.high, history: v.history, scores: v.scores });
      let value = cap >= ask && ask <= v.limit ? ask : 0;
      if (value && v.bidder >= 0 && v.bidder % 2 !== seat % 2 && cap >= ask + 15) {
        try {
          const decision = ONLINE_X1.bidding.decideJump(v), bid = decision.bid;
          if (Number.isSafeInteger(bid) && bid % 5 === 0 && bid >= ask && bid <= Math.min(cap - 10, v.limit, 195) && bid <= v.high + 25)
            value = bid;
          else reason = "bid-jump-baseline";
        } catch (_) {
          reason = "bid-jump-baseline";
        }
      }
      action = { type: "bid", value };
    } else if (state.phase === "discard") {
      const hand = state.hands[seat], ids = hand.map(x1CardId), trump = C.trump(ids), keep = C.discard(ids, state.discardCount, trump);
      plan = { seat, trump, keep };
      const selected = new Set(keep);
      action = {
        type: "discard",
        cardIds: hand.filter((card) => !selected.has(x1CardId(card))).map((card) => card.id)
      };
    } else if (state.phase === "trump") {
      const trump = memory.plan?.seat === seat ? memory.plan.trump : C.trump(state.hands[seat].map(x1CardId));
      action = { type: "trump", color: C.colors[trump] };
    } else if (state.phase === "play") {
      const view = x1PlayInput(state, seat, memory);
      let id;
      if (!memory.sol7) {
        try {
          const result = C.choose(view);
          id = result.card;
        } catch (_) {
        }
      }
      let card = state.hands[seat].find((card2) => x1CardId(card2) === id);
      if (!card || !canPlay(card, state.hands[seat], state.ledColor, state.trump, state.settings.rules)) {
        id = C.solmove(
          view.h,
          { c: view.tc, s: view.ts },
          view.tr,
          BigInt(view.played),
          BigInt(view.nest),
          seat
        );
        card = state.hands[seat].find((card2) => x1CardId(card2) === id);
        engine = "sol7";
        reason = memory.sol7 ? "sol7-hand" : "sampling-fallback";
      }
      action = { type: "play", cardId: card?.id };
    }
    if (!x1ActionLegal(state, seat, action)) return fallback("invalid-x1-action");
    return {
      action,
      plan,
      engine,
      reason,
      ms: Math.round((performance.now() - started) * 100) / 100
    };
  } catch (_) {
    return fallback("x1-error");
  }
}
__name(choosePreviousOnlineBotAction, "choosePreviousOnlineBotAction");
function observeOnlineX1(room, before, result, decision = null) {
  const memory = room.x1;
  if (!memory || memory.hand !== before.handNumber || !result.accepted) return;
  const seat = before.currentPlayer;
  if (before.phase === "bidding" && result.state.highestBid > before.highestBid)
    memory.history.push([seat, result.state.highestBid]);
  if (before.phase === "play" && before.ledColor) {
    const remaining = new Set(result.state.hands[seat].map((c) => c.id));
    const card = before.hands[seat].find((c) => !remaining.has(c.id));
    if (card && !(before.settings.rules.specialsAnytime && isSpecialCard(card, before.settings.rules)) && !followsLedSuit(card, before.ledColor, before.trump, before.settings.rules))
      memory.voids[seat] |= 1 << COLORS.indexOf(before.ledColor);
  }
  if (!decision) return;
  memory.decisions[decision.action.type]++;
  memory.lastEngine = decision.engine;
  memory.lastPartnerAssist = !!decision.partnerAssist;
  memory.partnerDecisions = (memory.partnerDecisions || 0) + Number(!!decision.partnerAssist);
  memory.ruleDecisions = (memory.ruleDecisions || 0) + Number(decision.engine === "x1-rules");
  memory.lastDecisionMs = decision.ms || 0;
  memory.maxDecisionMs = Math.max(memory.maxDecisionMs || 0, memory.lastDecisionMs);
  if (decision.plan) memory.plan = decision.plan;
  if (decision.engine === "sol7") memory.sol7 = true;
  if (decision.reason) {
    memory.fallbacks++;
    memory.lastFallback = decision.reason;
  }
}
__name(observeOnlineX1, "observeOnlineX1");
function onlineX1Proof(room) {
  const m = room.x1;
  return {
    version: ONLINE_X1_VERSION,
    active: m?.lastEngine || (m ? "x1" : "legacy"),
    decisions: m ? { ...m.decisions } : { bid: 0, discard: 0, trump: 0, play: 0 },
    fallbacks: m?.fallbacks || 0,
    lastFallback: m?.lastFallback || null,
    lastDecisionMs: m?.lastDecisionMs || 0,
    maxDecisionMs: m?.maxDecisionMs || 0,
    partnerAssist: !!m?.lastPartnerAssist,
    partnerDecisions: m?.partnerDecisions || 0,
    ruleDecisions: m?.ruleDecisions || 0,
    handEngineVersion: m?.version || "legacy"
  };
}
__name(onlineX1Proof, "onlineX1Proof");
function chooseOnlineBotAction(room, seat) {
  const s = room.gameState, m = room.x1;
  if (!m || m.hand !== s.handNumber || m.version !== ONLINE_X1_VERSION) return choosePreviousOnlineBotAction(room, seat);
  const partner = x1EligiblePartner(room, seat), started = performance.now();
  try {
    let d;
    if (!x1Compatible(s) || s.shotTheMoon) d = chooseExtendedX1(room, seat, partner);
    else {
      d = choosePreviousOnlineBotAction(room, seat);
      if (d.engine !== "x1") return d;
      if (s.phase === "bidding") {
        if (partner !== null && s.bidder === partner) {
          const v = x1BidInput(s, seat, m), ask = v.high + 5, cap = ONLINE_X1.core.ceiling(v.h, { seat, high: v.high, history: v.history, scores: v.scores });
          if (cap >= ask) {
            const p = ONLINE_X1.bidding.decide(v);
            if (![0, ask].includes(p.bid)) throw Error("X1_BAD_TAKEOVER");
            d.action = { type: "bid", value: p.bid };
          }
        }
      }
      if (s.phase === "play" && partner !== null) {
        const v = x1PlayInput(s, seat, m, partner), p = ONLINE_X1.core.choose(v);
        const card = s.hands[seat].find((c) => x1CardId(c) === p.card);
        if (!card) throw Error("X1_PARTNER_SAMPLE");
        d.action = { type: "play", cardId: card.id };
      }
      d.partnerAssist = partner !== null;
    }
    if (s.phase === "bidding" && s.settings.shootMoonEnabled && d.action.value === makeDeck(s.settings.rules).reduce((n, c) => n + cardPoints(c, s.settings.rules), 0)) d.action = { type: "bid", value: 0 };
    if (s.phase === "play" && !s.shotTheMoon) {
      const card = x1AnchorRoute(s, seat, partner);
      if (card) d.action = { type: "play", cardId: card.id };
    }
    if (!x1ActionLegal(s, seat, d.action)) throw Error("X1_RULE_ACTION_ILLEGAL");
    return { ...d, ms: Math.round((performance.now() - started) * 100) / 100 };
  } catch (e) {
    return { action: chooseTestBotAction(s, seat), engine: "legacy", reason: "x1-extension-error:" + e.message, partnerAssist: false };
  }
}
__name(chooseOnlineBotAction, "chooseOnlineBotAction");
export {
  RoomDO,
  consumeRoomSocketTicket,
  worker_default as default,
  injectCloudGameAdapter,
  issueRoomSocketTicket
};


const CAREER_URL='https://gxojarpfaxloyzbsptqg.supabase.co';
const CAREER_KEY='sb_publishable_pwVFgPlgLGPWtXWARaH6KQ_5dkNv4fv';
const CA='__Host-ghr-career-access', CR='__Host-ghr-career-refresh';
const ROOKS_BOT_ACCOUNT_NAMES='Crow Blaze Nix Titan Pike Drift Dice Anchor Wager Hollow Ember Vex Frost Fang Halo Quill Bramble Moss Emberlyn Cinder Gable Thistle Marrow Pebble Rookery Sable Finch Dagger Willow Hearth Grit Copper Moth Brandy Flint Ivy Shade Barrel Spark Nettle Cobalt Ash Harrier Claire June Tess Marcus Owen Daniel Sofia Rafael Samir Jerome Rita'.split(' ');
const rooksNameKey=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const isReservedBotName=value=>ROOKS_BOT_ACCOUNT_NAMES.some(name=>rooksNameKey(name)===rooksNameKey(value));
async function careerApi(request,env){
 const url=new URL(request.url), route=url.pathname.slice('/career-api/'.length), headers=new Headers({'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff'});
 const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
 const cookie=(name)=>{const part=(request.headers.get('cookie')||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(name+'='));return part?part.slice(name.length+1):''};
 const set=(name,value,age)=>headers.append('set-cookie',`${name}=${value}; Path=/; Max-Age=${age}; HttpOnly; Secure; SameSite=Strict`);
 const clear=()=>{set(CA,'',0);set(CR,'',0)};
 const upstream=async(path,method='GET',body,token)=>{
  const r=await fetch(CAREER_URL+path,{method,headers:{apikey:CAREER_KEY,...(token?{Authorization:'Bearer '+token}:{}),...(body?{'content-type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(12000)});
  const data=await r.json().catch(()=>({}));return {ok:r.ok,status:r.status,data};
 };
 try{
  if(!['GET','POST'].includes(request.method))return reply({error:'Method not allowed'},405);
  if(request.method==='POST'&&(request.headers.get('origin')!==url.origin||!request.headers.get('content-type')?.startsWith('application/json')))return reply({error:'Open Cloud Career from this game to continue.'},403);
  const emailRoutes=['signup','recover','resend-confirmation','confirm-email','reset-password'];
  if(route==='config'&&request.method==='GET')return reply({emailReady:env.CAREER_EMAIL_READY==='true'});
  if(emailRoutes.includes(route)&&env.CAREER_EMAIL_READY!=='true')return reply({error:'Email signup and password recovery are still being set up. Your career stays on this device.'},503);
  const bucket=route==='login'||emailRoutes.includes(route)?env.ENTRY_LIMIT:env.ACTION_LIMIT;
  if(!bucket||!(await bucket.limit({key:'career:'+route+':'+(request.headers.get('CF-Connecting-IP')||'unknown')})).success)return reply({error:'Please wait a minute and try again.'},429);
  if(route==='bot-stats'&&request.method==='GET'){
   const r=await upstream('/rest/v1/rpc/rooks_get_bot_stats','POST',{});
   if(!r.ok)return reply({error:'Shared bot results are temporarily unavailable.'},503);
   return reply(r.data);
  }
  if(route==='leaderboard'&&request.method==='GET'){
   const r=await upstream('/rest/v1/rpc/rooks_get_leaderboard','POST',{});
   if(!r.ok)return reply({error:'The leaderboard is temporarily unavailable.'},503);
   return reply(r.data);
  }
  let body={};if(request.method==='POST'){
   if(Number(request.headers.get('content-length')||0)>2200000)return reply({error:'Backup too large'},413);
   const reader=request.body?.getReader();let size=0,parts=[];if(reader){while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>2200000){await reader.cancel();return reply({error:'Backup too large'},413)}parts.push(value)}}
   const bytes=new Uint8Array(size);let at=0;for(const p of parts){bytes.set(p,at);at+=p.length}try{body=JSON.parse(new TextDecoder().decode(bytes))}catch{return reply({error:'Invalid request'},400)}
  }
  const saveSession=(s)=>{set(CA,s.access_token,Math.min(s.expires_in||3600,3600));set(CR,s.refresh_token,2592000)};
  if(emailRoutes.includes(route)&&request.method==='POST'){
   const email=typeof body.email==='string'?body.email.trim():'';
   if(email.length>254||!/^\S+@\S+\.\S+$/.test(email))return reply({error:'Enter a valid email address.'},400);
   if(route==='signup'&&(typeof body.playerName!=='string'||!/^([A-Za-z][A-Za-z0-9_]{2,11})$/.test(body.playerName)))return reply({error:'Choose a player account name with 3–12 characters: start with a letter, then use letters, numbers, or underscores.'},400);
   if(route==='signup'&&isReservedBotName(body.playerName))return reply({error:'That name belongs to a game bot. Choose a different player account name.'},400);
   const needsPassword=route==='signup'||route==='reset-password';
   if(needsPassword&&(typeof body.password!=='string'||body.password.length<12||body.password.length>128))return reply({error:'Use a password between 12 and 128 characters.'},400);
   if(route==='signup'||route==='recover'||route==='resend-confirmation'){
    const r=await upstream(route==='signup'?'/auth/v1/signup':route==='recover'?'/auth/v1/recover':'/auth/v1/resend','POST',route==='signup'?{email,password:body.password,data:{player_name:body.playerName}}:route==='resend-confirmation'?{email,type:'signup'}:{email});
    // Never turn an accidentally disabled email-confirmation setting into a login.
    if(r.ok&&r.data.access_token){await upstream('/auth/v1/logout?scope=local','POST',{},r.data.access_token).catch(()=>{});return reply({error:'Account confirmation needs attention. Please try again later.'},503)}
    if(!r.ok&&(r.status===429||r.status>=500))return reply({error:route==='signup'?'Could not finish creating the account. The player name may already be taken; try another one. Your local career is safe.':'Email is temporarily unavailable. Please wait a few minutes and try again.'},r.status===429?429:503);
    // Identical response for existing/unknown accounts; no account enumeration.
    return reply({ok:true,message:route==='recover'?'If an account exists for this email, a recovery code will arrive shortly.':'If this email needs confirmation, a code will arrive shortly. Already registered? Sign in or use Forgot password.'});
   }
   if(typeof body.code!=='string'||!/^\d{6,10}$/.test(body.code))return reply({error:'Enter the code from your email.'},400);
   const verified=await upstream('/auth/v1/verify','POST',{email,token:body.code,type:route==='reset-password'?'recovery':'email'});
   if(!verified.ok||!verified.data.access_token)return reply({error:'That code is invalid or expired. Request a new code and try again.'},400);
   const session=verified.data;
   if(route==='reset-password'){
    const changed=await upstream('/auth/v1/user','PUT',{password:body.password},session.access_token);
    await upstream('/auth/v1/logout?scope=global','POST',{},session.access_token).catch(()=>{});
    clear();
    if(!changed.ok)return reply({error:'Password could not be changed. Request a new recovery code and try a different password.'},400);
    return reply({ok:true,message:'Password changed. Sign in with your new password. Your saved career is unchanged.'});
   }
   await upstream('/auth/v1/logout?scope=local','POST',{},session.access_token).catch(()=>{});
   return reply({ok:true,message:'Email confirmed. Sign in to choose which career to back up.'});
  }
  if(route==='login'&&request.method==='POST'){
   if(typeof body.email!=='string'||typeof body.password!=='string'||body.email.length>254||body.password.length>1024)return reply({error:'Enter your email and password.'},400);
   const r=await upstream('/auth/v1/token?grant_type=password','POST',{email:body.email,password:body.password});
   if(!r.ok)return reply({error:'Could not sign in. Check your email, password, and account confirmation.'},401);
   saveSession(r.data);return reply({user:{id:r.data.user.id,email:r.data.user.email}});
  }
  let token=cookie(CA);const refresh=cookie(CR);
  if(route==='logout'&&request.method==='POST'){if(token)await upstream('/auth/v1/logout?scope=local','POST',{},token).catch(()=>{});clear();return reply({ok:true})}
  let auth=token?await upstream('/auth/v1/user','GET',undefined,token):null;
  if((!auth||auth.status===401)&&refresh){const r=await upstream('/auth/v1/token?grant_type=refresh_token','POST',{refresh_token:refresh});if(r.ok){saveSession(r.data);token=r.data.access_token;auth={ok:true,data:r.data.user}}else auth=r;}
  if(!auth?.ok){if(!auth||auth.status===401)clear();return reply({error:'Sign in to use your cloud career.'},auth?.status>=500?503:401)}
  if(!auth.data.email_confirmed_at||auth.data.is_anonymous)return reply({error:'A confirmed player account is required.'},403);
  let r;
  if(route==='session'&&request.method==='GET')return reply({user:{id:auth.data.id,email:auth.data.email}});
  if(route==='player-account'&&request.method==='GET'){
   r=await upstream('/rest/v1/rooks_player_accounts?select=player_name&user_id=eq.'+encodeURIComponent(auth.data.id),'GET',undefined,token);
   if(!r.ok)return reply({error:'Player account details could not be loaded.'},400);
   return reply({playerName:r.data[0]?.player_name||null});
  }
  if(route==='player-account'&&request.method==='POST'){
   if(typeof body.playerName!=='string'||!/^([A-Za-z][A-Za-z0-9_]{2,11})$/.test(body.playerName))return reply({error:'Choose a player account name with 3–12 characters: start with a letter, then use letters, numbers, or underscores.'},400);
   if(isReservedBotName(body.playerName))return reply({error:'That name belongs to a game bot. Choose a different player account name.'},400);
   r=await upstream('/rest/v1/rpc/rooks_set_player_name','POST',{p_player_name:body.playerName},token);
   if(!r.ok)return reply({error:r.data.code==='23505'?'That player account name is already taken. Choose another one.':r.data.code==='23514'?'That name belongs to a game bot. Choose a different player account name.':'Player account name could not be saved. Your career is safe.'},r.data.code==='23505'?409:400);
   return reply({playerName:r.data.player_name||body.playerName});
  }
  if(route==='save'&&body.userId!==auth.data.id)return reply({error:'The signed-in account changed. Reopen Cloud Career before saving.'},409);
  if(route==='save'&&request.method==='POST')r=await upstream('/rest/v1/rpc/rooks_save_career','POST',{p_payload:body.payload,p_expected_revision:body.revision,p_restore_revision:null},token);
  else if(route==='current'&&request.method==='GET')r=await upstream('/rest/v1/rooks_careers?select=revision,display_name,payload,updated_at','GET',undefined,token);
  else if(route==='versions'&&request.method==='GET')r=await upstream('/rest/v1/rooks_career_versions?select=revision,display_name,created_at,reason&order=revision.desc&limit=100','GET',undefined,token);
  else if(/^version\/[1-9]\d{0,14}$/.test(route)&&request.method==='GET')r=await upstream('/rest/v1/rooks_career_versions?select=revision,payload&revision=eq.'+route.split('/')[1],'GET',undefined,token);
  else return reply({error:'Not found'},404);
  if(!r.ok)return reply({error:r.data.code==='40001'?'Another device saved newer progress. Reopen Cloud Career to review it.':'Cloud save could not be completed. Your local career is unchanged.'},r.data.code==='40001'?409:400);
  return reply(r.data);
 }catch{return reply({error:'Cloud connection unavailable. Your local career is safe; please try again.'},503)}
}
const CLOUD_CAREER_CLIENT="(()=>{'use strict';\n let user=null,revision=0,busy=false,linked=false,lastHash='',linkedActor='',panel,status,actions,emailReady=false,boardDialog=null,boardContent=null,boardStatus=null,boardPage=0,boardView='players',boardCache={};\n const P=()=>window.HORProgression,core=()=>P()?.core;\n const ROOKS_BOT_ACCOUNT_NAMES='Crow Blaze Nix Titan Pike Drift Dice Anchor Wager Hollow Ember Vex Frost Fang Halo Quill Bramble Moss Emberlyn Cinder Gable Thistle Marrow Pebble Rookery Sable Finch Dagger Willow Hearth Grit Copper Moth Brandy Flint Ivy Shade Barrel Spark Nettle Cobalt Ash Harrier Claire June Tess Marcus Owen Daniel Sofia Rafael Samir Jerome Rita'.split(' ');\n const botNameKey=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]/g,'');\n function protectBotName(input){const check=()=>input.setCustomValidity(ROOKS_BOT_ACCOUNT_NAMES.some(name=>botNameKey(name)===botNameKey(input.value))?'That name belongs to a game bot. Choose a different player account name.':'');input.addEventListener('input',check);check()}\n const hash=()=>core().digest(core().collect());\n const api=async(path,body)=>{const r=await fetch('/career-api/'+path,{method:body?'POST':'GET',headers:body?{'content-type':'application/json'}:{},body:body?JSON.stringify(body):undefined,cache:'no-store',signal:AbortSignal.timeout(30000)});const x=await r.json();if(!r.ok){if(r.status===401||r.status===409)linked=false;throw Error(x.error||'Cloud connection unavailable')}return x};\n const tell=t=>{if(status)status.textContent=t};\n const button=(label,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.style.cssText='display:block;width:100%;padding:12px;margin:9px 0;background:#17334a;color:white;border:1px solid #41687a;border-radius:9px;cursor:pointer';b.onclick=async()=>{if(busy)return;busy=true;b.disabled=true;try{await fn()}catch(e){tell(e.message)}finally{busy=false;b.disabled=false}};actions.append(b);return b};\n const summary=b=>{try{const s=JSON.parse(b.data.horCareerStateV2);return `${s.identity.displayName}: ${s.records.human.stats.points||0} points, ${s.records.human.stats.gamesPlayed||0} games`}catch{return 'Saved career'}};\n const boardPageSize=()=>window.matchMedia('(max-height: 650px)').matches?5:6;\n const boardStyle='box-sizing:border-box;font:14px/1.35 system-ui,-apple-system,Segoe UI,sans-serif';\n const el=(tag,css,text='')=>{const n=document.createElement(tag);n.style.cssText=css;if(text)n.textContent=text;return n};\n function boardButton(label,handler,active=false){const b=el('button','border:1px solid '+(active?'#74c4c0':'#355064')+';background:'+(active?'#1e414f':'#14283a')+';color:#f4f7f8;border-radius:10px;padding:9px 14px;min-height:40px;font-weight:650;cursor:pointer',label);b.type='button';b.onclick=handler;return b}\n async function showBoard(view=boardView){boardView=view;boardPage=0;if(!boardDialog){boardDialog=document.createElement('dialog');boardDialog.setAttribute('aria-label','Griffin House leaderboards');boardDialog.style.cssText='position:fixed;inset:0;margin:auto;box-sizing:border-box;width:min(720px,94vw);height:min(700px,88dvh);max-height:88dvh;overflow:hidden;padding:0;border:1px solid #708a91;border-radius:20px;background:#0c1b29;color:#edf3f6;box-shadow:0 24px 80px #0009,inset 0 0 0 1px #3a5667,inset 0 0 0 3px #78b8ae16;font:14px/1.35 system-ui,-apple-system,Segoe UI,sans-serif';boardDialog.addEventListener('click',e=>{if(e.target===boardDialog)boardDialog.close()});const style=el('style','');style.textContent='dialog[data-ghr-board]::backdrop{background:#030b12cc;backdrop-filter:blur(5px)} @media(max-width:480px){.ghr-board-shell{padding:16px!important}.ghr-board-row{grid-template-columns:30px 36px minmax(0,1fr) auto!important}.ghr-board-rank{font-size:13px!important}.ghr-board-avatar{width:32px!important;height:32px!important}.ghr-board-detail{grid-column:3/5!important;margin-top:-4px!important}.ghr-board-wins{display:none!important}.ghr-board-side{grid-column:4;grid-row:1;font-size:15px!important}.ghr-board-foot{gap:6px!important}.ghr-board-tab{flex:1;padding:8px 6px!important}}';boardDialog.append(style);boardDialog.dataset.ghrBoard='';const shell=el('section','height:100%;display:flex;flex-direction:column;overflow:hidden;padding:18px 26px 16px;border:1px solid #93a7aa22;border-radius:16px;'+boardStyle);shell.className='ghr-board-shell';const head=el('div','display:flex;align-items:flex-start;justify-content:space-between;gap:12px');const intro=el('div','min-width:0');intro.append(el('div','font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#8ab9c4;font-weight:750','GRIFFIN HOUSE OF ROOKS'));intro.append(el('h2','margin:4px 0 0;font-size:20px;line-height:1.1;font-weight:750;letter-spacing:-.02em','Leaderboards'));head.append(intro);const close=boardButton('Close',()=>boardDialog.close());close.setAttribute('aria-label','Close leaderboards');head.append(close);shell.append(head);const tabs=el('nav','display:flex;gap:8px;margin-top:11px');tabs.setAttribute('aria-label','Leaderboard type');const players=boardButton('Players',()=>showBoard('players'));players.className='ghr-board-tab';players.dataset.tab='players';const bots=boardButton('Bots',()=>showBoard('bots'));bots.className='ghr-board-tab';bots.dataset.tab='bots';tabs.append(players,bots);shell.append(tabs);boardStatus=el('div','min-height:31px;display:flex;align-items:center;color:#a8bbc6;font-size:12px;margin:5px 2px');boardStatus.setAttribute('role','status');shell.append(boardStatus);boardContent=el('div','display:flex;flex:1;min-height:0;flex-direction:column;gap:7px;overflow:hidden');shell.append(boardContent);const footer=el('footer','display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px;padding-top:10px;border-top:1px solid #263d50');footer.className='ghr-board-foot';const pager=el('div','display:flex;align-items:center;gap:8px');pager.dataset.pager='';const account=boardButton('Cloud career',()=>window.GHRCloudCareer?.open());account.style.cssText+=';font-size:12px;padding:8px 10px';footer.append(pager,account);shell.append(footer);boardDialog.append(shell);document.body.append(boardDialog)}\n  if(!boardDialog.open)boardDialog.showModal();const pageSize=boardPageSize();boardContent.replaceChildren();boardStatus.textContent=boardView==='players'?'Ranked by level. Games played breaks ties.':'Ranked by win percentage. Games played breaks ties.';boardDialog.querySelectorAll('[data-tab]').forEach(b=>{const active=b.dataset.tab===boardView;b.style.borderColor=active?'#74c4c0':'#355064';b.style.background=active?'#1e414f':'#14283a';b.setAttribute('aria-pressed',String(active))});\n  let rows=boardCache[boardView]?.until>Date.now()?boardCache[boardView].rows:null;if(!rows){boardStatus.textContent='Loading current results…';try{rows=await api(boardView==='players'?'leaderboard':'bot-stats');if(!Array.isArray(rows))throw Error('Results could not be loaded.');boardCache[boardView]={rows,until:Date.now()+30000}}catch(e){boardStatus.textContent=e.message;boardContent.replaceChildren();return}}\n  rows=[...rows];if(boardView==='bots')rows.sort((a,b)=>(Number(b.winPercentage)||0)-(Number(a.winPercentage)||0)||(Number(b.gamesPlayed)||0)-(Number(a.gamesPlayed)||0)||String(a.name).localeCompare(String(b.name)));const pages=Math.max(1,Math.ceil(rows.length/pageSize));boardPage=Math.max(0,Math.min(boardPage,pages-1));const start=boardPage*pageSize;const slice=rows.slice(start,start+pageSize);\n  if(!slice.length)boardContent.append(el('div','flex:1;display:grid;place-items:center;text-align:center;color:#a8bbc6;border:1px solid #22394b;border-radius:14px;background:#102334;padding:20px','No cloud-backed players yet. Sign up to back up your career and appear here.'));\n  else slice.forEach((row,i)=>{\n   const index=start+i;\n   const card=el('article','display:grid;grid-template-columns:34px 42px minmax(0,1fr) auto;align-items:center;gap:9px;min-height:48px;padding:5px 10px;border:1px solid '+(index===0?'#416877':'#243b4c')+';border-radius:12px;background:'+(index===0?'linear-gradient(100deg,#163544,#122637)':'#102334'));\n   card.className='ghr-board-row';\n   const rank=el('div','width:29px;height:29px;display:grid;place-items:center;border-radius:9px;background:'+(index===0?'#244c56':'#1b3041')+';color:'+(index===0?'#a7e2d7':'#a7b9c4')+';font-weight:750;font-variant-numeric:tabular-nums',String(index+1).padStart(2,'0'));\n   rank.className='ghr-board-rank';rank.style.gridRow='1 / 3';card.append(rank);\n   const avatar=el('div','width:36px;height:36px;grid-row:1 / 3;display:grid;place-items:center;overflow:hidden;border:1px solid #456477;border-radius:10px;background:#203a4a;color:#d7e5e8;font-size:11px;font-weight:750',String(row.name||'R').slice(0,1).toUpperCase());\n   avatar.className='ghr-board-avatar';avatar.setAttribute('role','img');avatar.setAttribute('aria-label',String(row.name||'Player')+' avatar');\n   if(typeof window.avatarSrc==='function'){const img=document.createElement('img');img.src=window.avatarSrc(row.avatar||(boardView==='bots'?row.name:'rookling'));img.alt='';img.loading='lazy';img.style.cssText='width:100%;height:100%;object-fit:cover';img.onerror=()=>{avatar.replaceChildren();avatar.textContent=String(row.name||'R').slice(0,1).toUpperCase()};avatar.replaceChildren(img)}\n   card.append(avatar);\n   const name=el('div','font-size:14px;font-weight:700;color:#f2f6f8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap',String(row.name||'Player'));card.append(name);\n   const side=el('div','font-size:14px;color:#a7e2d7;font-weight:750;white-space:nowrap;font-variant-numeric:tabular-nums',boardView==='players'?'Lv '+(Number(row.level)||1):(Number(row.winPercentage)||0)+'%');side.className='ghr-board-side';card.append(side);\n   const detail=el('div','grid-column:3/5;margin-top:-7px;display:flex;gap:6px;min-width:0;font-size:11px;color:#9eb0bb;overflow:hidden;white-space:nowrap');detail.className='ghr-board-detail';\n   if(boardView==='players'){\n    const earned=Math.max(0,Number(row.achievementsEarned)||0),total=Math.max(1,Number(row.achievementsTotal)||145);\n    const achievement=el('span','color:#c4d9dc;flex:0 0 auto',`${earned}/${total} achievements`);achievement.className='ghr-board-achievements';detail.append(achievement);\n    const games=el('span','overflow:hidden;text-overflow:ellipsis',`${Number(row.gamesPlayed)||0} games`);detail.append(games);\n    const wins=el('span','flex:0 0 auto',`${Number(row.gamesWon)||0} wins`);wins.className='ghr-board-wins';detail.append(wins)\n   }else detail.textContent=`${Number(row.gamesPlayed)||0} games  ·  ${Number(row.gamesWon)||0} wins  ·  ${Number(row.gamesLost)||0} losses`;\n   card.append(detail);boardContent.append(card)\n  });\n  boardStatus.textContent=boardView==='players'?'Level leads · games played breaks ties': 'Bot win rate · games played breaks ties';const pager=boardDialog.querySelector('[data-pager]');pager.replaceChildren();const prev=boardButton('‹ Previous',()=>{if(boardPage>0){boardPage--;showBoard(boardView)}});prev.disabled=boardPage===0;prev.style.opacity=prev.disabled?'.45':'1';const label=el('span','min-width:58px;text-align:center;color:#b9c8d0;font-size:12px;font-variant-numeric:tabular-nums',`${pages?boardPage+1:1} / ${pages}`);const next=boardButton('Next ›',()=>{if(boardPage<pages-1){boardPage++;showBoard(boardView)}});next.disabled=boardPage>=pages-1;next.style.opacity=next.disabled?'.45':'1';pager.append(prev,label,next);\n }\n function remember(){linkedActor=core().read()?.identity.id;localStorage.setItem('horCloudLinkV1',JSON.stringify({user:user.id,actor:core().read()?.identity.id,revision,hash:lastHash}))}\n async function save(){const payload=P().protection.buildBackup(),captured=core().digest(payload.data);const r=await api('save',{payload,revision,userId:user.id});revision=r.revision;lastHash=captured;linked=true;remember();tell('Back up complete. New progress saves automatically while the game is open.')}\n async function restore(payload){core().validateBackup(payload);const expected=hash();if(!confirm('Restore '+summary(payload)+' to this device? A safety copy of current progress will be kept first.'))return;\n P().protection.restoreBackupObject(payload,{expectedLocalHash:expected});linked=false;localStorage.removeItem('horCloudLinkV1');tell('Career recovered. Reloading…');location.reload()}\n function accountNameForm(){actions.replaceChildren();tell('Choose a unique player account name. Bot names are reserved for the game bots.');const form=document.createElement('form');actions.append(form);const input=document.createElement('input');input.type='text';input.required=true;input.minLength=3;input.maxLength=12;input.pattern='[A-Za-z][A-Za-z0-9_]{2,11}';input.autocomplete='nickname';input.autocapitalize='off';input.spellcheck=false;input.placeholder='Enter your player name';input.setAttribute('aria-label','Player name shown in games and leaderboards');input.style.cssText='box-sizing:border-box;width:100%;padding:12px;margin:6px 0;background:#fff;color:#10283c;border:2px solid #79b8b2;border-radius:9px;font:inherit';const label=document.createElement('label');label.textContent='Player name (shown in games and leaderboards)';label.style.cssText='display:block;margin-top:10px;font-weight:700';form.append(label);protectBotName(input);form.append(input);const hint=document.createElement('p');hint.textContent='3–12 characters. Start with a letter; use letters, numbers, or _. Game bot names are reserved.';form.append(hint);form.onsubmit=e=>{e.preventDefault();actions.querySelector('button')?.click()};button('Save player account name',async()=>{if(!form.reportValidity())return;await api('player-account',{playerName:input.value.trim()});await signedIn()})}\n async function signedIn(){const account=await api('player-account');if(!account.playerName){accountNameForm();return}actions.replaceChildren();const rows=await api('current'),current=rows[0];if(revision!==(current?.revision||0))linked=false;revision=current?.revision||0;\n const pending=JSON.parse(localStorage.getItem('horPendingCareerSignupV1')||'null');\n const pendingMatches=pending&&pending.email===String(user.email||'').toLowerCase()&&pending.actor===core().read()?.identity.id;\n if(pendingMatches&&!current){\n  tell('Account ready. Backing up your existing career and achievements…');\n  try{await save();localStorage.removeItem('horPendingCareerSignupV1');tell('Your existing career and achievements are backed up to your account. New progress saves automatically while the game is open.')}\n  catch(e){tell('Your account is ready, but the first backup did not finish: '+e.message+' Your progress is still on this device. Reopen Cloud Career to retry.')}\n  if(linked){await signedIn();tell('Your existing career and achievements are backed up to your account. New progress saves automatically while the game is open.');return}\n }else{\n  if(pending) localStorage.removeItem('horPendingCareerSignupV1');\n  tell(pendingMatches&&current?'An existing cloud career is already on this account, so it was kept safe. Choose whether to use it or back up this device.':current?'Signed in. Cloud backup found: '+summary(current.payload)+'.':'Signed in. No cloud backup yet. Your progress is still on this device.');\n }\n button(current?'Back up this device':'Back up my career and achievements',async()=>{if(current&&!confirm('Replace the cloud backup with progress from this device? The previous backup will remain available under older backups.'))return;await save()});\n if(current)button('Restore cloud backup to this device',()=>restore(current.payload));\n button('View previous backup',async()=>{const list=(await api('versions')).filter(v=>Number(v.revision)<revision).slice(0,1);actions.replaceChildren();tell(list.length?'Choose the previous backup to restore. Your current progress will be kept as a safety copy first.':'No previous backup yet. Your current cloud backup is safe.');for(const v of list)button(`Restore backup from ${new Date(v.created_at).toLocaleString()} — ${v.display_name}`,async()=>{const rows=await api('version/'+v.revision);if(!rows[0])throw Error('Saved version unavailable');await restore(rows[0].payload)});button('Back',signedIn)});\n button('Download a backup file',()=>P().protection.downloadBackup());\n button('View leaderboards',()=>showBoard('players'));\n if(localStorage.getItem('horBeforeCloudRecoveryV1'))button('Download career preserved before recovery',()=>{const a=document.createElement('a'),u=URL.createObjectURL(new Blob([localStorage.getItem('horBeforeCloudRecoveryV1')],{type:'application/json'}));a.href=u;a.download='Griffin-career-before-recovery.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)});\n button('Sign out of cloud career',async()=>{await api('logout',{});linked=false;user=null;localStorage.removeItem('horCloudLinkV1');login();tell('Signed out. Your career remains on this device.')});\n }\n function login(address=''){actions.replaceChildren();tell('Your career saves on this device either way. A free account backs up your stats and puts your player name on the leaderboard.');\n const form=document.createElement('form');actions.append(form);const email=document.createElement('input'),password=document.createElement('input');email.setAttribute('aria-label','Email');password.setAttribute('aria-label','Password');email.type='email';email.placeholder='Email';email.autocomplete='username';email.value=address;password.type='password';password.placeholder='Password';password.autocomplete='current-password';for(const input of [email,password]){input.required=true;input.style.cssText='box-sizing:border-box;width:100%;padding:12px;margin:6px 0';form.append(input)}\n const sign=button('Sign in',async()=>{if(!form.reportValidity())return;const r=await api('login',{email:email.value.trim(),password:password.value});password.value='';user=r.user;linked=false;await signedIn()});form.onsubmit=e=>{e.preventDefault();sign.click()};\n if(emailReady){button('Create account',()=>accountForm('signup',email.value.trim()));button('Forgot password?',()=>accountForm('recover',email.value.trim()));button('I have a code',()=>{const savedEmail=email.value.trim();actions.replaceChildren();tell('Choose what you want to do with your email code.');button('Confirm my email',()=>accountForm('confirm-email',savedEmail));button('Reset my password',()=>accountForm('reset-password',savedEmail));button('Back to sign in',()=>login(savedEmail))})}\n else{const note=document.createElement('p');note.textContent='Cloud account signup and email recovery are being prepared. Your career and achievements keep saving on this device.';actions.append(note)}\n button('View leaderboards',()=>showBoard('players'));\n }\n function accountForm(mode,address=''){\n  actions.replaceChildren();linked=false;\n  const verify=mode==='confirm-email'||mode==='reset-password',reset=mode==='reset-password';\n  tell(mode==='signup'?'Choose the unique player name that appears in games and on leaderboards. After you confirm your email, your existing career backs up automatically. You can keep playing without an account.':mode==='recover'?'Enter your email and we will send a password reset code.':reset?'Enter the recovery code from your email and choose a new password.':'Enter the confirmation code from your email to finish creating your account.');\n  const form=document.createElement('form');actions.append(form);\n  const field=(label,type,autocomplete)=>{const input=document.createElement('input');input.type=type;input.required=true;input.autocomplete=autocomplete;input.placeholder=label;input.setAttribute('aria-label',label);input.style.cssText='box-sizing:border-box;width:100%;padding:12px;margin:6px 0';form.append(input);return input};\n  const email=field('Email','email','username');email.value=address;email.maxLength=254;\n  let code,password,repeat,playerName;\n  if(verify){code=field(reset?'Recovery code':'Confirmation code','text','one-time-code');code.inputMode='numeric';code.pattern='[0-9]{6,10}';code.maxLength=10}\n  if(mode==='signup'){const label=document.createElement('label');label.textContent='Player name (shown in games and leaderboards)';label.htmlFor='ghr-player-account-name';label.style.cssText='display:block;margin-top:10px;font-weight:700';form.append(label);playerName=field('Enter your player name','text','nickname');playerName.id='ghr-player-account-name';playerName.setAttribute('aria-label','Player name shown in games and leaderboards');playerName.minLength=3;playerName.maxLength=12;playerName.pattern='[A-Za-z][A-Za-z0-9_]{2,11}';playerName.autocapitalize='off';playerName.spellcheck=false;playerName.style.cssText='box-sizing:border-box;width:100%;padding:12px;margin:6px 0;background:#fff;color:#10283c;border:2px solid #79b8b2;border-radius:9px;font:inherit';protectBotName(playerName);const hint=document.createElement('p');hint.textContent='3–12 characters. Start with a letter; use letters, numbers, or _. Game bot names are reserved.';form.append(hint)}\n  if(mode==='signup'||reset){password=field('New password (12+ characters)','password','new-password');password.minLength=12;password.maxLength=128;repeat=field('Repeat new password','password','new-password');repeat.minLength=12;repeat.maxLength=128}\n  const submit=button(mode==='signup'?'Create account':mode==='recover'?'Send reset code':reset?'Save new password':'Confirm email',async()=>{\n   if(!form.reportValidity())return;if(password&&password.value!==repeat.value)throw Error('The passwords do not match.');\n   const result=await api(mode,{email:email.value.trim(),...(code?{code:code.value.trim()}:{}),...(password?{password:password.value}:{}),...(playerName?{playerName:playerName.value.trim()}:{})});\n   if(password){password.value='';repeat.value=''}if(code)code.value='';\n   if(mode==='signup'){const address=email.value.trim().toLowerCase();localStorage.setItem('horPendingCareerSignupV1',JSON.stringify({email:address,actor:core().read()?.identity.id,playerName:playerName.value.trim()}));accountForm('confirm-email',address);tell('Check your email for a confirmation code. After confirming and signing in, your current career will back up automatically.')}\n   else if(mode==='recover'){const address=email.value.trim();accountForm('reset-password',address);tell('Check your email for a reset code, then enter it below.')}\n   else if(reset){user=null;localStorage.removeItem('horCloudLinkV1');login(email.value.trim());tell(result.message)}\n   else{const address=email.value.trim();login(address);tell('Email confirmed. Sign in below to back up this device’s career.')}\n  });form.onsubmit=e=>{e.preventDefault();submit.click()};\n  if(verify)button('Request a new code',async()=>{if(!email.reportValidity())return;const result=await api(reset?'recover':'resend-confirmation',{email:email.value.trim()});tell(result.message)});\n  button('Back to sign in',()=>login(email.value.trim()));\n }\n async function open(){if(!core())return alert('Career is still loading. Please try again in a moment.');if(!panel){panel=document.createElement('dialog');panel.style.cssText='position:fixed;inset:0;margin:auto;box-sizing:border-box;max-width:440px;width:94vw;max-height:90vh;overflow:auto;background:#10283c;color:#fff;border:1px solid #41687a;border-radius:14px;padding:20px;font:16px system-ui';const title=document.createElement('h2');title.textContent='Cloud Career';panel.append(title);status=document.createElement('p');status.setAttribute('role','status');panel.append(status);actions=document.createElement('div');panel.append(actions);const close=document.createElement('button');close.textContent='Back to game';close.style.cssText='padding:12px;margin-top:10px;color:#edf3f6;background:#17334a;border:1px solid #41687a;border-radius:9px';close.onclick=()=>panel.close();panel.append(close);document.body.append(panel)}panel.showModal();tell('Connecting…');emailReady=false;try{emailReady=(await api('config')).emailReady===true;user=(await api('session')).user;await signedIn()}catch(e){login();if(e.message!=='Sign in to use your cloud career.')tell(e.message)}}\n window.GHRCloudCareer={open};window.GHRLeaderboards={open:()=>showBoard('players'),players:()=>showBoard('players'),bots:()=>showBoard('bots')};\n function install(){for(const h of document.querySelectorAll('h1,h2,h3'))if(h.textContent.trim()==='My Career & Awards'){const parent=h.closest('#houseDetails805')?.querySelector('.house-content')||h.parentElement;if(!parent.querySelector('[data-ghr-leaderboards]')){const b=document.createElement('button');b.dataset.ghrLeaderboards='1';b.textContent='Leaderboards';b.className='house-action';b.style.cssText='padding:12px;cursor:pointer;color:#edf3f6;background:#163143;border:1px solid #35566a;border-radius:10px';b.onclick=()=>showBoard('players');parent.append(b)}if(!parent.querySelector('[data-cloud-career]')){const b=document.createElement('button');b.dataset.cloudCareer='1';b.textContent='Cloud career, saves & recovery';b.className='house-action';b.style.cssText='padding:12px;cursor:pointer;color:inherit';b.onclick=open;parent.append(b)}}}\n new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true});install();\n async function resume(){try{if(!core())return;const saved=JSON.parse(localStorage.getItem('horCloudLinkV1')||'null');if(!saved)return;user=(await api('session')).user;const current=(await api('current'))[0];if(saved.user===user.id&&saved.actor===core().read()?.identity.id&&saved.revision===current?.revision){revision=saved.revision;lastHash=saved.hash;linkedActor=saved.actor;linked=true}}catch{linked=false}}\n setTimeout(resume,3000);setInterval(async()=>{if(!linked||busy||!core()||document.hidden)return;try{if(core().read()?.identity.id!==linkedActor){linked=false;tell('This device’s career changed. Review Cloud Career before saving.');return}if(hash()===lastHash)return;busy=true;await save()}catch(e){tell(e.message)}finally{busy=false}},15000);\n})();";
const CLOUD_CAREER_CORE="/* Local Career v2. Single-key canonical commits; validated, journaled recovery.\n * No server, telemetry or credentials. Existing career points remain the level currency.\n */\n(function (root) {\n  'use strict';\n  const KEY = 'horCareerStateV2',\n    JOURNAL = 'horCareerRestoreV2',\n    ACTOR = 'horLocalCareerActorV1',\n    MODE = 'horProgressModeV1';\n  const RETIRED = /^(rook_hunter_[1-5]|bird_two_[1-5]|first_rook|bird_two_one)$/;\n  const EXACT = new Set([\n    'horAudioMixerV1',\n    'rookLifetimeStats',\n    ACTOR,\n    MODE,\n    'horProgressHumanNameV1',\n    'horProgressMigrationV1',\n    'horProgressPresentationV1',\n    'horFriendlyRecoveryCodeV1',\n    'horLastCareerBackupV1',\n    KEY,\n    'griffinHousePlayerName',\n    'griffinHousePlayerAvatar',\n    'griffinHousePlayerVoice',\n    'horFavoritePartner042',\n    'horHolderCueVibrationV1',\n    'horLandingIdentityV1',\n    'horFavoritePartnersV1',\n    'horFounderPreviousHumanV1',\n    'horFounderVoiceV1',\n    'horLegacyAvatarBefore783',\n    'rookMuted',\n    'rookSoundTurn',\n    'rookTurnSoundChoice',\n    'rookReduceMotion',\n    'rookHighContrast',\n    'horCardStyle',\n    'horGamePace',\n    'horAvatarMotion',\n    'horHandSortMode',\n    'horPlaqueA',\n    'horPlaqueB',\n    'horOtherCareerPopups',\n    'horPrefs',\n    'rookCabinVolume041',\n    'rookCabinAmbience041',\n    'rookFireVolume758',\n    'rookOwls758',\n    'rookTheme',\n    'rookCardBack',\n    'rookTopOptsCollapsed',\n    'horLobbyHero',\n  ]);\n  const PREFIX = ['horCareerLedgerV1:', 'horProgressV1:', 'horBotRelationshipV1:'];\n  const copy = (x) => JSON.parse(JSON.stringify(x));\n  const plain = (x) => !!x && typeof x === 'object' && !Array.isArray(x);\n  function validDayKey(value) {\n    if (typeof value !== 'string' || !/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) return false;\n    const date = new Date(value + 'T00:00:00Z');\n    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;\n  }\n  const now = () => new Date().toISOString();\n  const uuid = () =>\n    root.crypto.randomUUID\n      ? root.crypto.randomUUID()\n      : Array.from(root.crypto.getRandomValues(new Uint32Array(4)), (n) =>\n          n.toString(16).padStart(8, '0')\n        ).join('');\n  function stable(x) {\n    if (Array.isArray(x)) return '[' + x.map(stable).join(',') + ']';\n    if (plain(x))\n      return (\n        '{' +\n        Object.keys(x)\n          .sort()\n          .map((k) => JSON.stringify(k) + ':' + stable(x[k]))\n          .join(',') +\n        '}'\n      );\n    return JSON.stringify(x);\n  }\n  function digest(value) {\n    // SHA-256; UTF-8; corruption detection, not authentication.\n    const bytes = new TextEncoder().encode(typeof value === 'string' ? value : stable(value));\n    const len = bytes.length;\n    const data = new Uint8Array(Math.ceil((len + 9) / 64) * 64);\n    data.set(bytes);\n    data[len] = 128;\n    const view = new DataView(data.buffer);\n    view.setUint32(data.length - 4, (len * 8) >>> 0);\n    view.setUint32(data.length - 8, Math.floor(len / 0x20000000));\n    const h = [\n      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab,\n      0x5be0cd19,\n    ];\n    const k = [\n      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4,\n      0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe,\n      0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f,\n      0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,\n      0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,\n      0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,\n      0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116,\n      0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,\n      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,\n      0xc67178f2,\n    ];\n    const rr = (x, n) => (x >>> n) | (x << (32 - n)),\n      w = new Uint32Array(64);\n    for (let off = 0; off < data.length; off += 64) {\n      for (let i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4);\n      for (let i = 16; i < 64; i++) {\n        let x = w[i - 15],\n          y = w[i - 2];\n        w[i] =\n          (w[i - 16] +\n            (rr(x, 7) ^ rr(x, 18) ^ (x >>> 3)) +\n            w[i - 7] +\n            (rr(y, 17) ^ rr(y, 19) ^ (y >>> 10))) >>>\n          0;\n      }\n      let [a, b, c, d, e, f, g, t] = h;\n      for (let i = 0; i < 64; i++) {\n        let u = (t + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & f) ^ (~e & g)) + k[i] + w[i]) >>> 0;\n        let v = ((rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;\n        t = g;\n        g = f;\n        f = e;\n        e = (d + u) >>> 0;\n        d = c;\n        c = b;\n        b = a;\n        a = (u + v) >>> 0;\n      }\n      [a, b, c, d, e, f, g, t].forEach((x, i) => (h[i] = (h[i] + x) >>> 0));\n    }\n    return h.map((x) => x.toString(16).padStart(8, '0')).join('');\n  }\n  function install(P) {\n    const storage = root.localStorage;\n    function parse(raw, fallback) {\n      return raw == null ? fallback : JSON.parse(raw);\n    }\n    function get(k, fallback) {\n      return parse(storage.getItem(k), fallback);\n    }\n    function allowed(k) {\n      return EXACT.has(k) || PREFIX.some((p) => k.startsWith(p));\n    }\n    function collect() {\n      const out = {};\n      for (let i = 0; i < storage.length; i++) {\n        const k = storage.key(i);\n        if (allowed(k)) out[k] = storage.getItem(k);\n      }\n      return out;\n    }\n    function numeric(stats) {\n      const s = {};\n      for (const [k, v] of Object.entries(stats || {}))\n        if (typeof v === 'number') {\n          if (!Number.isSafeInteger(v) || v < 0) throw Error('Invalid career counter: ' + k);\n          s[k] = v;\n        }\n      return s;\n    }\n    function checkStats(s) {\n      if (!plain(s)) throw Error('Missing career statistics');\n      for (const [k, v] of Object.entries(s))\n        if (typeof v !== 'number' || !Number.isSafeInteger(v) || v < 0)\n          throw Error('Invalid career counter: ' + k);\n      if (\n        (s.gamesWon || 0) > (s.gamesPlayed || 0) ||\n        (s.bidsMade || 0) + (s.bidsSet || 0) > (s.bidsWon || 0)\n      )\n        throw Error('Inconsistent career counters');\n      return s;\n    }\n    function checkState(s) {\n      const int = (n) => Number.isSafeInteger(n) && n >= 0,\n        str = (n) => typeof n === 'string' && n.length > 0;\n      if (\n        !plain(s) ||\n        s.schemaVersion !== 2 ||\n        s.migrationVersion !== 2 ||\n        !plain(s.identity) ||\n        !str(s.identity.id) ||\n        !Array.isArray(s.identity.aliases) ||\n        s.identity.aliases.some((n) => !str(n)) ||\n        !str(s.identity.displayName) ||\n        !plain(s.records) ||\n        !s.records.human ||\n        !plain(s.receipts) ||\n        !plain(s.matches) ||\n        !plain(s.sources) ||\n        !Array.isArray(s.conflicts) ||\n        !int(s.revision) ||\n        s.revision < 1 ||\n        !plain(s.migration) ||\n        s.migration.completed !== true ||\n        !Number.isFinite(Date.parse(s.updatedAt))\n      )\n        throw Error('Invalid Career v2 state');\n      if (\n        s.dailyLoginBonus !== undefined &&\n        (!plain(s.dailyLoginBonus) ||\n          !validDayKey(s.dailyLoginBonus.date) ||\n          !int(s.dailyLoginBonus.amount) ||\n          s.dailyLoginBonus.amount < 50 ||\n          (s.dailyLoginBonus.streak !== undefined &&\n            (!int(s.dailyLoginBonus.streak) ||\n              s.dailyLoginBonus.streak < 1 ||\n              s.dailyLoginBonus.streak > 7)))\n      )\n        throw Error('Invalid daily login bonus');\n      for (const [key, r] of Object.entries(s.records)) {\n        if (\n          !plain(r) ||\n          !str(r.displayName) ||\n          typeof r.isBot !== 'boolean' ||\n          (key === 'human' ? r.isBot : !key.startsWith('bot:') || !r.isBot)\n        )\n          throw Error('Invalid career owner');\n        checkStats(r.stats);\n        for (const key of [\n          'achievements',\n          'retiredAchievements',\n          'rewardReceipts',\n          'partners',\n          'trumpWins',\n        ])\n          if (!plain(r[key])) throw Error('Incomplete career record');\n        for (const [id, a] of Object.entries({ ...r.achievements, ...r.retiredAchievements })) {\n          if (!plain(a) || !plain(r.rewardReceipts[id])) throw Error('Missing achievement receipt');\n        }\n        for (const reward of Object.values(r.rewardReceipts))\n          if (!plain(reward) || reward.xp !== 0) throw Error('Invalid achievement reward');\n        for (const p of Object.values(r.partners))\n          if (!plain(p) || !str(p.name) || !int(p.wins) || !int(p.games) || p.wins > p.games)\n            throw Error('Invalid partnership history');\n        for (const color of ['black', 'red', 'green', 'yellow'])\n          if (!int(r.trumpWins[color])) throw Error('Invalid trump history');\n      }\n      for (const [id, r] of Object.entries(s.receipts))\n        if (\n          !id.startsWith('hand:') ||\n          !plain(r) ||\n          typeof r.hash !== 'string' ||\n          !/^[a-f0-9]{64}$/.test(r.hash)\n        )\n          throw Error('Invalid hand receipt');\n      for (const [id, m] of Object.entries(s.matches)) {\n        if (\n          !str(id) ||\n          !plain(m) ||\n          !int(m.hand) ||\n          !Array.isArray(m.stats) ||\n          m.stats.length !== 4 ||\n          !Array.isArray(m.extras) ||\n          m.extras.length !== 4 ||\n          !Array.isArray(m.lowScoreGap) ||\n          m.lowScoreGap.length !== 2 ||\n          m.lowScoreGap.some((n) => !int(n)) ||\n          typeof m.completed !== 'boolean'\n        )\n          throw Error('Invalid match history');\n        for (const stats of m.stats) checkStats(stats);\n      }\n      return s;\n    }\n    function read() {\n      const s = get(KEY, null);\n      if (s && storage.getItem(ACTOR) && storage.getItem(ACTOR) !== s.identity?.id)\n        throw Error('Career identity conflict');\n      return s ? checkState(s) : null;\n    }\n    function put(s) {\n      checkState(s);\n      const value = JSON.stringify(s);\n      storage.setItem(KEY, value);\n      if (storage.getItem(KEY) !== value) throw Error('Career save verification failed');\n      return s;\n    }\n    function commit(s) {\n      s.revision++;\n      s.updatedAt = now();\n      return put(s);\n    }\n    function actorId() {\n      const s = read();\n      const old = storage.getItem(ACTOR);\n      if (s) {\n        if (old && old !== s.identity.id) throw Error('Career identity conflict');\n        if (!old) storage.setItem(ACTOR, s.identity.id);\n        return s.identity.id;\n      }\n      if (old) return old;\n      const id = 'local-' + uuid();\n      storage.setItem(ACTOR, id);\n      return id;\n    }\n    function botId(name) {\n      return (\n        'bot-' +\n        String(name || 'bot')\n          .trim()\n          .toLowerCase()\n          .replace(/[^a-z0-9]+/g, '-')\n          .replace(/^-|-$/g, '')\n      );\n    }\n    function blank(name, isBot = false) {\n      return {\n        displayName: name,\n        isBot,\n        stats: {},\n        achievements: {},\n        retiredAchievements: {},\n        rewardReceipts: {},\n        partners: {},\n        trumpWins: { black: 0, red: 0, green: 0, yellow: 0 },\n        avatar: null,\n      };\n    }\n    function award(r, origin) {\n      if (r.isBot) return [];\n      const unlocked = P.evaluate(r.stats, r.achievements);\n      for (const a of unlocked) {\n        r.achievements[a.id] = { unlockedAt: now(), type: a.type, tier: a.tier || null, origin };\n        r.rewardReceipts[a.id] = {\n          xp: 0,\n          reason: 'Achievements have no separate point bonus in the approved level system',\n          origin,\n        };\n      }\n      return unlocked;\n    }\n    function preserveAwards(r, old) {\n      for (const [id, a] of Object.entries(old || {})) {\n        if (RETIRED.test(id)) r.retiredAchievements[id] = copy(a);\n        else r.achievements[id] = copy(a);\n        r.rewardReceipts[id] = { xp: 0, origin: 'legacy-import', previousRewardUnknown: true };\n      }\n    }\n    function dominates(a, b) {\n      return Object.entries(b).every(\n        ([k, v]) => ['currentWinStreak', 'currentMadeBidStreak'].includes(k) || (a[k] || 0) >= v\n      );\n    }\n    function migrate(opts = {}) {\n      const existing = read();\n      if (existing) return existing;\n      const store = get('rookLifetimeStats', {});\n      if (!plain(store)) throw Error('Invalid legacy store');\n      const id = actorId(),\n        ledger = get('horCareerLedgerV1:human:' + id, null);\n      const humans = Object.entries(store).filter(([, r]) => r && !r.isBot);\n      const named = humans.filter(\n        ([n]) => !['you', 'host', 'player'].includes(n.trim().toLowerCase())\n      );\n      const selected = get('horLandingIdentityV1', null)?.name;\n      const preferred =\n        opts.displayName ||\n        selected ||\n        (named.length === 1\n          ? named[0][0]\n          : ledger?.displayName || storage.getItem('horProgressHumanNameV1')) ||\n        opts.newPlayerName ||\n        'You';\n      const aliases = new Set(opts.aliases || [preferred]);\n      // A default-name row is considered an overlapping local snapshot, never an additive career.\n      if (named.length <= 1) for (const [n] of humans) aliases.add(n);\n      const s = {\n        schemaVersion: 2,\n        migrationVersion: 2,\n        identity: { id, displayName: preferred, aliases: [...aliases].sort() },\n        revision: 1,\n        updatedAt: now(),\n        records: { human: blank(preferred) },\n        receipts: {},\n        matches: {},\n        sources: {},\n        conflicts: [],\n        migration: {\n          completed: true,\n          at: now(),\n          policy: 'whole-snapshot-baseline; ambiguous increments quarantined; no sums',\n        },\n        restores: {},\n      };\n      const candidates = [];\n      for (const [name, rec] of humans) {\n        checkStats(numeric(rec));\n        s.sources['legacy:' + name] = copy(rec);\n        if (aliases.has(name)) candidates.push({ name, stats: numeric(rec), record: rec });\n        else s.conflicts.push({ kind: 'unbound-human', source: name });\n      }\n      if (ledger) {\n        checkStats(numeric(ledger.stats));\n        candidates.push({\n          name: ledger.displayName || preferred,\n          stats: numeric(ledger.stats),\n          record: ledger,\n          ledger: true,\n        });\n        s.sources['human-ledger'] = copy(ledger);\n      }\n      const ordered = candidates.sort(\n        (a, b) =>\n          Number(b.name === preferred) - Number(a.name === preferred) ||\n          Number(a.ledger) - Number(b.ledger) ||\n          a.name.localeCompare(b.name)\n      );\n      let chosen =\n        ordered.find((a) => ordered.every((b) => dominates(a.stats, b.stats))) || ordered[0];\n      if (chosen) {\n        s.records.human.stats = copy(chosen.stats);\n        s.records.human.avatar =\n          storage.getItem('griffinHousePlayerAvatar') ||\n          chosen.record.avatar ||\n          ledger?.avatar ||\n          null;\n        s.migration.baselineSource = chosen.ledger ? 'human-ledger' : 'legacy:' + chosen.name;\n      }\n      for (const c of ordered)\n        if (c !== chosen && stable(c.stats) !== stable(chosen.stats))\n          s.conflicts.push({\n            kind: 'overlapping-legacy-snapshot',\n            source: c.ledger ? 'human-ledger' : 'legacy:' + c.name,\n            disposition: 'preserved-not-added',\n          });\n      if (ledger) preserveAwards(s.records.human, ledger.achievements);\n      for (const [name, rec] of Object.entries(store)) {\n        if (!rec?.isBot) continue;\n        const key = 'bot:' + botId(name),\n          r = blank(name, true);\n        r.stats = numeric(rec);\n        r.avatar = rec.avatar || null;\n        const old = get('horCareerLedgerV1:bot:' + botId(name), null);\n        if (old) {\n          const prior = numeric(old.stats);\n          checkStats(prior);\n          if (dominates(prior, r.stats)) r.stats = prior;\n          else if (!dominates(r.stats, prior))\n            s.conflicts.push({\n              kind: 'overlapping-bot-snapshot',\n              source: 'bot-ledger:' + botId(name),\n              disposition: 'preserved-not-added',\n            });\n          preserveAwards(r, old.achievements);\n          s.sources['bot-ledger:' + botId(name)] = copy(old);\n        }\n        s.records[key] = r;\n      }\n      for (let i = 0; i < storage.length; i++) {\n        const key = storage.key(i);\n        if (key.startsWith('horProgressV1:')) s.sources[key] = get(key, {});\n      }\n      // Relationship records have their own cumulative semantics; do not turn aggregate wins into streaks.\n      for (let i = 0; i < storage.length; i++) {\n        const key = storage.key(i);\n        if (!key.startsWith('horBotRelationshipV1:')) continue;\n        const rel = get(key, {}),\n          name = key.slice('horBotRelationshipV1:'.length);\n        const wins = rel.partnerWins || 0,\n          games = rel.partnerGames || 0;\n        if (!Number.isSafeInteger(wins) || !Number.isSafeInteger(games) || wins < 0 || wins > games)\n          throw Error('Invalid partnership history');\n        s.records.human.partners[botId(name)] = { name, games, wins };\n      }\n      for (const r of Object.values(s.records)) {\n        const wins = Math.max(0, ...Object.values(r.partners).map((p) => p.wins));\n        if (wins) {\n          r.stats.bestPartnerWins = Math.max(r.stats.bestPartnerWins || 0, wins);\n          r.stats.samePartnerWins = Math.max(r.stats.samePartnerWins || 0, wins);\n        }\n        award(r, 'verified-cumulative-baseline');\n      }\n      put(s);\n      return s;\n    }\n    function mode() {\n      return storage.getItem(MODE) === 'local' ? 'local' : 'preview';\n    }\n    function activate(opts) {\n      const s = migrate(opts);\n      storage.setItem(MODE, 'local');\n      P.CONFIG.enabled =\n        P.CONFIG.uiEnabled =\n        P.CONFIG.notificationsEnabled =\n        P.CONFIG.botProgressionEnabled =\n          true;\n      return {\n        ok: true,\n        mode: 'local',\n        migration: { rows: Object.values(s.records) },\n        recoveryCode: storage.getItem('horFriendlyRecoveryCodeV1') || null,\n      };\n    }\n    function rename(name, avatar) {\n      if (typeof name !== 'string' || !name.trim()) throw Error('Player name is required');\n      const s = migrate();\n      name = name.trim();\n      if (!s.identity.aliases.includes(name)) s.identity.aliases.push(name);\n      s.identity.displayName = name;\n      s.records.human.displayName = name;\n      if (avatar !== undefined) s.records.human.avatar = avatar;\n      commit(s);\n      return s;\n    }\n    function applyDailyLoginBonus(date) {\n      if (!validDayKey(date)) throw Error('Invalid daily bonus date');\n      const s = migrate();\n      if (s.dailyLoginBonus?.date >= date)\n        return {\n          awarded: false,\n          alreadyAwarded: true,\n          amount: s.dailyLoginBonus.amount,\n          date,\n          streak: s.dailyLoginBonus.streak || 1,\n        };\n      const previous = s.dailyLoginBonus;\n      const elapsedDays = previous\n        ? (Date.parse(date + 'T00:00:00Z') - Date.parse(previous.date + 'T00:00:00Z')) /\n          86400000\n        : 0;\n      const missedDay = elapsedDays > 1;\n      const streak = elapsedDays === 1 ? Math.min(7, (previous.streak || 1) + 1) : 1;\n      const human = s.records.human,\n        before = P.levelFor(human.stats.points || 0),\n        gap =\n          before.nextThreshold == null\n            ? 0\n            : Math.max(0, before.nextThreshold - (human.stats.points || 0)),\n        baseAmount = 50 + Math.round(gap * 0.005),\n        multiplier = Math.min(1.25, 1 + (streak - 1) * 0.05),\n        amount = Math.round(baseAmount * multiplier);\n      human.stats.points = (human.stats.points || 0) + amount;\n      s.dailyLoginBonus = { date, amount, streak };\n      commit(s);\n      const after = P.levelFor(human.stats.points);\n      return {\n        awarded: true,\n        alreadyAwarded: false,\n        amount,\n        date,\n        streak,\n        missedDay,\n        multiplier,\n        points: human.stats.points,\n        level: after.level,\n        previousLevel: before.level,\n        leveledUp: after.level > before.level,\n        title: after.title,\n      };\n    }\n    function ledgerRead(type, id) {\n      const s = read();\n      if (s) {\n        if (type === 'human' && id !== s.identity.id) throw Error('Career identity conflict');\n        return copy(s.records[type === 'human' ? 'human' : 'bot:' + id] || blank('Bot', true));\n      }\n      return get('horCareerLedgerV1:' + type + ':' + id, { stats: {}, achievements: {} });\n    }\n    function sync(store) {\n      if (mode() !== 'local') return { ok: false, reason: 'preview-mode' };\n      const s = migrate();\n      return {\n        ok: true,\n        rows: Object.values(s.records),\n        source: 'canonical-v2',\n        legacySnapshotsIgnored: true,\n      };\n    }\n    function profile(type = 'human', id, displayName) {\n      const s = read();\n      if (mode() !== 'local' || !s) return null;\n      /* A new bot has a zero-point career before its first recorded hand. Project it without writing or replacing saved history. */ const r =\n        s.records[type === 'human' ? 'human' : 'bot:' + id] ||\n        (type === 'bot' &&\n        typeof displayName === 'string' &&\n        displayName.trim() &&\n        botId(displayName) === id\n          ? blank(displayName.trim(), true)\n          : null);\n      if (!r) return null;\n      const stats = r.stats;\n      if (type === 'bot') {\n        const gamesPlayed = stats.gamesPlayed || 0;\n        const gamesWon = stats.gamesWon || 0;\n        return {\n          enabled: true,\n          isBot: true,\n          displayName: r.displayName,\n          gamesPlayed,\n          gamesWon,\n          gamesLost: Math.max(0, gamesPlayed - gamesWon),\n          winPercentage: gamesPlayed ? Math.round((100 * gamesWon) / gamesPlayed) : 0,\n        };\n      }\n      const lv = P.levelFor(stats.points || 0);\n      return {\n        ...copy(stats),\n        enabled: true,\n        isBot: !!r.isBot,\n        displayName: r.displayName,\n        avatar:\n          type === 'human' ? storage.getItem('griffinHousePlayerAvatar') || r.avatar : r.avatar,\n        careerRef: digest(s.identity.id).slice(0, 16),\n        level: lv.level,\n        title: lv.title,\n        points: stats.points || 0,\n        xp: stats.points || 0,\n        nextThreshold: lv.nextThreshold,\n        gamesPlayed: stats.gamesPlayed || 0,\n        gamesWon: stats.gamesWon || 0,\n        achievementCount: Object.keys(r.achievements).length,\n        retiredAchievementCount: Object.keys(r.retiredAchievements).length,\n        achievements: Object.keys(r.achievements),\n        partners: copy(r.partners),\n        retiredAchievements: copy(r.retiredAchievements),\n      };\n    }\n    function applyDelta(r, delta) {\n      for (const [k, v] of Object.entries(delta)) {\n        if (!Number.isSafeInteger(v) || v < 0) throw Error('Invalid event delta: ' + k);\n        if (k === 'highBid' || k.startsWith('best') || k.startsWith('longest'))\n          r.stats[k] = Math.max(r.stats[k] || 0, v);\n        else r.stats[k] = (r.stats[k] || 0) + v;\n      }\n    }\n    function recordHand(ev) {\n      // Lifetime accounting is independent of the optional Career display switch.\n      if (\n        !plain(ev) ||\n        typeof ev.matchId !== 'string' ||\n        !ev.matchId ||\n        !Number.isInteger(ev.hand) ||\n        ev.hand < 1 ||\n        !Array.isArray(ev.players) ||\n        ev.players.length !== 4 ||\n        !Array.isArray(ev.stats) ||\n        ev.stats.length !== 4 ||\n        !plain(ev.summary)\n      )\n        throw Error('Invalid hand event');\n      if (\n        !Number.isInteger(ev.bidder) ||\n        ev.bidder < 0 ||\n        ev.bidder > 3 ||\n        !Number.isInteger(ev.tricksPerHand) ||\n        ev.tricksPerHand < 1 ||\n        !['black', 'red', 'green', 'yellow'].includes(ev.summary.trump) ||\n        !Array.isArray(ev.summary.scores) ||\n        ev.summary.scores.length !== 2 ||\n        ev.summary.scores.some((n) => !Number.isSafeInteger(n)) ||\n        ['pointsA', 'pointsB', 'bid'].some(\n          (k) => !Number.isSafeInteger(ev.summary[k]) || ev.summary[k] < 0\n        ) ||\n        typeof ev.summary.made !== 'boolean' ||\n        (ev.winnerTeam != null && ![0, 1].includes(ev.winnerTeam))\n      )\n        throw Error('Invalid hand outcome');\n      const s = migrate({\n          newPlayerName: ev.players.find((p) => p && !p.isBot && p.id === ev.localPeerId)?.name,\n        }),\n        receipt = 'hand:' + ev.matchId + ':' + ev.hand,\n        fingerprint = digest({ ...ev, localPeerId: undefined, isHost: undefined }),\n        oldReceipt = s.receipts[receipt];\n      if (oldReceipt) {\n        if (oldReceipt.hash !== fingerprint) throw Error('Conflicting duplicate hand event');\n        return { ok: true, duplicate: true };\n      }\n      const match = s.matches[ev.matchId] || {\n        hand: 0,\n        stats: [{}, {}, {}, {}],\n        extras: [{}, {}, {}, {}],\n        lowScoreGap: [0, 0],\n        completed: false,\n      };\n      if (match.completed || ev.hand <= match.hand) throw Error('Stale hand event');\n      if (ev.hand !== match.hand + 1)\n        throw Error('Missing hand history: refusing incomplete statistics');\n      const humans = ev.players.filter((p) => p && !p.isBot && p.id === ev.localPeerId);\n      if (humans.length !== 1) throw Error('Local human identity unresolved');\n      const unlocks = [],\n        notifications = [];\n      for (let i = 0; i < 4; i++) {\n        const p = ev.players[i];\n        if (!p || (!p.isBot && p.id !== ev.localPeerId) || (p.isBot && !ev.isHost)) continue;\n        const key = p.isBot ? 'bot:' + botId(p.name) : 'human',\n          r = s.records[key] || (s.records[key] = blank(p.name, true));\n        if (!p.isBot) {\n          if (!s.identity.aliases.includes(p.name)) s.identity.aliases.push(p.name);\n          r.displayName =\n            s.identity.displayName; /* Game's generic You must not rename the selected career. */\n        } else r.displayName = p.name;\n        r.avatar = p.avatar || r.avatar;\n        if (p.isBot) {\n          // Bot records are intentionally limited to match outcomes. This also\n          // prevents older bots from earning new career points or achievements.\n          if (ev.completed || ev.winnerTeam != null) {\n            r.stats.gamesPlayed = (r.stats.gamesPlayed || 0) + 1;\n            r.stats.gamesWon = (r.stats.gamesWon || 0) + Number(p.team === ev.winnerTeam);\n          }\n          continue;\n        }\n        const oldLevel = P.levelFor(r.stats.points || 0);\n        const current = checkStats(ev.stats[i]),\n          previous = match.stats[i] || {},\n          delta = {};\n        for (const [k, v] of Object.entries(current)) {\n          if (k === 'gamesPlayed' || k === 'gamesWon') continue;\n          if (k === 'highBid') delta[k] = v;\n          else {\n            delta[k] = v - (previous[k] || 0);\n            if (delta[k] < 0) throw Error('Match counter rollback');\n          }\n        }\n        applyDelta(r, delta);\n        const extra = ev.extras?.[i] || {};\n        for (const [k, v] of Object.entries(extra)) {\n          if (k === 'trumpWins') continue;\n          if (typeof v === 'number') {\n            const before = match.extras[i]?.[k] || 0;\n            applyDelta(r, { [k]: k.startsWith('best') ? v : v - before });\n          }\n        }\n        if (i === ev.bidder) {\n          const made = !!ev.summary.made;\n          r.stats.currentMadeBidStreak = made ? (r.stats.currentMadeBidStreak || 0) + 1 : 0;\n          r.stats.longestMadeBidStreak = Math.max(\n            r.stats.longestMadeBidStreak || 0,\n            r.stats.currentMadeBidStreak\n          );\n          if (made) {\n            const pts = p.team === 0 ? ev.summary.pointsA : ev.summary.pointsB;\n            if (pts === ev.summary.bid) r.stats.exactBidMakes = (r.stats.exactBidMakes || 0) + 1;\n            if (ev.summary.bid >= 180) r.stats.highRollerMade = (r.stats.highRollerMade || 0) + 1;\n            const color = ev.summary.trump;\n            if (Object.hasOwn(r.trumpWins, color)) r.trumpWins[color]++;\n            r.stats.allTrumpColorWins = Math.min(...Object.values(r.trumpWins));\n          }\n        }\n        const handPoints = p.team === 0 ? ev.summary.pointsA : ev.summary.pointsB;\n        r.stats.bestHandPoints = Math.max(r.stats.bestHandPoints || 0, handPoints);\n        // Solo sweeps use actual personal trick victories, not team counter totals.\n        if (delta.tricksWon === ev.tricksPerHand)\n          r.stats.sweepHands = (r.stats.sweepHands || 0) + 1;\n        if (ev.completed || ev.winnerTeam != null) {\n          const won = p.team === ev.winnerTeam;\n          r.stats.gamesPlayed = (r.stats.gamesPlayed || 0) + 1;\n          r.stats.gamesWon = (r.stats.gamesWon || 0) + Number(won);\n          r.stats.currentWinStreak = won ? (r.stats.currentWinStreak || 0) + 1 : 0;\n          r.stats.longestWinStreak = Math.max(\n            r.stats.longestWinStreak || 0,\n            r.stats.currentWinStreak\n          );\n          const margin = Math.abs(ev.summary.scores[0] - ev.summary.scores[1]);\n          if (won) {\n            if (margin <= 5) r.stats.closeWins = (r.stats.closeWins || 0) + 1;\n            if (margin >= 200) r.stats.routWins = (r.stats.routWins || 0) + 1;\n            if (match.lowScoreGap[p.team] >= 100)\n              r.stats.comebackWins = (r.stats.comebackWins || 0) + 1;\n          }\n          const partner = ev.players.find((q, j) => j !== i && q.team === p.team);\n          if (partner?.isBot) {\n            const pid = botId(partner.name),\n              rel =\n                r.partners[pid] || (r.partners[pid] = { name: partner.name, games: 0, wins: 0 });\n            rel.games++;\n            rel.wins += Number(won);\n            const max = Math.max(0, ...Object.values(r.partners).map((p) => p.wins));\n            r.stats.bestPartnerWins = Math.max(r.stats.bestPartnerWins || 0, max);\n            r.stats.samePartnerWins = Math.max(r.stats.samePartnerWins || 0, max);\n          }\n        }\n        const earned = award(r, receipt);\n        unlocks.push(...earned);\n        const level = P.levelFor(r.stats.points || 0);\n        if (level.level > oldLevel.level)\n          notifications.push({\n            human: !p.isBot,\n            careerRef: digest(s.identity.id).slice(0, 16),\n            kind: 'level',\n            icon: '\u2605',\n            kicker: 'Level Up',\n            title: 'Level ' + level.level + ' \u2014 ' + level.title,\n            subtitle:\n              r.displayName + ' reached ' + r.stats.points.toLocaleString() + ' career points.',\n            major: level.level % 5 === 0,\n          });\n        for (const a of earned)\n          notifications.push({\n            human: !p.isBot,\n            careerRef: digest(s.identity.id).slice(0, 16),\n            icon: a.medal === 'Griffin' ? '\ud83e\udd85' : '\ud83c\udfc6',\n            kicker:\n              a.type === 'feat'\n                ? 'Rare Feat'\n                : a.medal === 'Griffin'\n                  ? 'Griffin Medal Earned'\n                  : 'Achievement Unlocked',\n            title: a.name + (a.medal ? ' \u2014 ' + a.medal : ''),\n            subtitle: r.displayName,\n            major: a.type === 'feat' || a.medal === 'Griffin',\n          });\n        checkStats(r.stats);\n      }\n      match.hand = ev.hand;\n      match.stats = copy(ev.stats);\n      match.extras = copy(ev.extras || [{}, {}, {}, {}]);\n      match.completed = !!ev.completed || ev.winnerTeam != null;\n      for (let t = 0; t < 2; t++)\n        match.lowScoreGap[t] = Math.max(\n          match.lowScoreGap[t],\n          ev.summary.scores[1 - t] - ev.summary.scores[t]\n        );\n      s.matches[ev.matchId] = match;\n      s.receipts[receipt] = { hash: fingerprint, pointsCurrency: 'career-points', at: now() };\n      commit(s);\n      if (P.CONFIG.notificationsEnabled)\n        for (const n of notifications)\n          try {\n            if (n.human) {\n              P.presentation?.enqueue(n);\n              root.horCareerLocalAnnouncement?.(n);\n            }\n          } catch (_) {}\n      return { ok: true, unlocks };\n    }\n    function validateBackup(x) {\n      if (\n        !plain(x) ||\n        x.format !== 'GriffinHouseOfRooksCareerBackup' ||\n        ![1, 2].includes(x.version) ||\n        !plain(x.data) ||\n        typeof x.createdAt !== 'string' ||\n        !Number.isFinite(Date.parse(x.createdAt))\n      )\n        throw Error('Invalid or unsupported career backup');\n      if (\n        x.version === 2 &&\n        (!plain(x.integrity) ||\n          x.integrity.algorithm !== 'SHA-256' ||\n          x.integrity.value !==\n            digest({ format: x.format, version: x.version, createdAt: x.createdAt, data: x.data }))\n      )\n        throw Error('Backup integrity mismatch');\n      if (!Object.hasOwn(x.data, 'rookLifetimeStats') && !Object.hasOwn(x.data, KEY))\n        throw Error('Backup is missing career statistics');\n      for (const [k, v] of Object.entries(x.data)) {\n        if (!allowed(k) || typeof v !== 'string') throw Error('Invalid backup storage field');\n        if (k === KEY) checkState(parse(v));\n        else if (k === 'rookLifetimeStats') {\n          const rows = parse(v);\n          if (!plain(rows)) throw Error('Invalid lifetime statistics');\n          for (const r of Object.values(rows)) {\n            if (!plain(r) || typeof r.isBot !== 'boolean') throw Error('Invalid legacy player');\n            checkStats(numeric(r));\n            for (const [n, value] of Object.entries(r))\n              if (!['isBot', 'avatar', 'botStyle'].includes(n) && typeof value !== 'number')\n                throw Error('Invalid legacy counter type');\n          }\n        } else if (k.startsWith('horCareerLedgerV1:')) {\n          const r = parse(v);\n          if (!plain(r) || !plain(r.stats) || !plain(r.achievements) || r.schemaVersion !== 1)\n            throw Error('Invalid legacy ledger');\n          checkStats(r.stats);\n        } else if (\n          k.startsWith('horProgressV1:') ||\n          k.startsWith('horBotRelationshipV1:') ||\n          k === 'horProgressPresentationV1' ||\n          [\n            'horPrefs',\n            'horLandingIdentityV1',\n            'horFounderPreviousHumanV1',\n            'horFavoritePartnersV1',\n          ].includes(k)\n        ) {\n          if (!plain(parse(v))) throw Error('Invalid career preferences');\n        }\n      }\n      if (\n        x.data.horLandingIdentityV1 &&\n        typeof parse(x.data.horLandingIdentityV1).name !== 'string'\n      )\n        throw Error('Invalid saved player name');\n      const state = x.data[KEY] ? parse(x.data[KEY]) : null;\n      if (state && x.data[ACTOR] && state.identity.id !== x.data[ACTOR])\n        throw Error('Backup identity mismatch');\n      if (\n        (state || Object.keys(x.data).some((k) => k.startsWith('horCareerLedgerV1:human:'))) &&\n        !x.data[ACTOR]\n      )\n        throw Error('Missing human identity');\n      if (x.data[MODE] && !['local', 'preview'].includes(x.data[MODE]))\n        throw Error('Invalid career mode');\n      return x;\n    }\n    function buildBackup() {\n      const data = collect();\n      if (!data.rookLifetimeStats && !data[KEY]) data.rookLifetimeStats = '{}';\n      const x = {\n        format: 'GriffinHouseOfRooksCareerBackup',\n        version: 2,\n        createdAt: now(),\n        data,\n        recoveryCode: storage.getItem('horFriendlyRecoveryCodeV1') || null,\n      };\n      x.integrity = {\n        algorithm: 'SHA-256',\n        value: digest({ format: x.format, version: x.version, createdAt: x.createdAt, data }),\n      };\n      validateBackup(x);\n      return x;\n    }\n    function recover() {\n      const raw = storage.getItem(JOURNAL);\n      if (!raw) return { pending: false };\n      const j = parse(raw);\n      if (\n        !plain(j) ||\n        j.version !== 2 ||\n        !plain(j.before) ||\n        !plain(j.after) ||\n        j.hash !== digest(j.after) ||\n        j.beforeHash !== digest(j.before) ||\n        !['prepared', 'committed'].includes(j.phase)\n      )\n        throw Error('Recovery journal damaged; saved data retained');\n      const target = j.phase === 'committed' ? j.after : j.before;\n      const keys = new Set([...Object.keys(j.before), ...Object.keys(j.after)]);\n      for (const k of keys) {\n        if (!allowed(k)) throw Error('Invalid recovery journal');\n        if (Object.hasOwn(target, k)) storage.setItem(k, target[k]);\n        else storage.removeItem(k);\n      }\n      storage.removeItem(JOURNAL);\n      return { pending: false, recovered: j.phase === 'committed' ? 'completed' : 'rolled-back' };\n    }\n    // Always-on careers initialize a blank identity before the owner can choose Restore.\n    // Only this receipt-free, source-free starter may adopt an explicitly selected backup.\n    function emptyStarter(s) {\n      return (\n        !!s &&\n        !Object.keys(s.receipts).length &&\n        !Object.keys(s.matches).length &&\n        Object.entries(s.sources).every(([key, row]) =>\n          key.startsWith(\"legacy:\") && plain(row) &&\n          Object.entries(row).every(([k, v]) =>\n            typeof v === \"number\" ? v === 0 : [\"isBot\", \"avatar\", \"botStyle\"].includes(k)\n          )\n        ) &&\n        !s.conflicts.length &&\n        Object.values(s.records).every(\n          (r) =>\n            Object.values(r.stats).every((v) => v === 0) &&\n            !Object.keys(r.achievements).length &&\n            !Object.keys(r.retiredAchievements).length &&\n            !Object.keys(r.rewardReceipts).length &&\n            !Object.keys(r.partners).length &&\n            Object.values(r.trumpWins).every((v) => v === 0)\n        )\n      );\n    }\n    function restoreBackupObject(input, cloudRecovery = null) {\n      recover();\n      const x = validateBackup(copy(input)),\n        before = collect(),\n        after = { ...before, ...x.data };\n      const explicitCloud = cloudRecovery && cloudRecovery.expectedLocalHash === digest(before);\n      if (cloudRecovery && !explicitCloud) throw Error('Local career changed; review recovery again');\n      if (explicitCloud) {\n        for (const key of Object.keys(after)) if (!(key in x.data)) delete after[key];\n        const safety = JSON.stringify(buildBackup());\n        storage.setItem('horBeforeCloudRecoveryV1', safety);\n        if (storage.getItem('horBeforeCloudRecoveryV1') !== safety) throw Error('Could not preserve current career');\n      }\n      let current = explicitCloud ? null : read();\n      const incoming = x.data[KEY] ? parse(x.data[KEY]) : null,\n        starter = emptyStarter(current);\n      if (starter) current = null;\n      if (starter && !incoming) {\n        delete after[KEY];\n        if (!x.data[ACTOR]) delete after[ACTOR];\n      }\n      const ownId = current?.identity.id || storage.getItem(ACTOR),\n        newId = incoming?.identity.id || x.data[ACTOR];\n      if (!explicitCloud && !starter && ownId && newId && ownId !== newId)\n        throw Error('Identity conflict: this backup belongs to a different local career');\n      if (current) {\n        if (!incoming)\n          throw Error('Legacy restore would replace a migrated career; preserved without changes');\n        if (stable(incoming) === stable(current) && stable(after) === stable(before))\n          return { ok: true, duplicate: true, restored: 0 };\n        if (\n          current.identity.aliases.some((a) => !incoming.identity.aliases.includes(a)) ||\n          Object.entries(current.sources).some(\n            ([k, v]) => stable(incoming.sources[k]) !== stable(v)\n          )\n        )\n          throw Error('Backup would roll back migration history');\n        const missing = Object.keys(current.receipts).filter(\n          (k) => !incoming.receipts[k] || incoming.receipts[k].hash !== current.receipts[k].hash\n        );\n        if (missing.length || incoming.revision < current.revision)\n          throw Error('Older or divergent backup: current progress preserved');\n        for (const [key, r] of Object.entries(current.records)) {\n          const n = incoming.records[key];\n          if (\n            !n ||\n            Object.entries(r.partners).some(\n              ([id, p]) =>\n                !n.partners[id] || n.partners[id].games < p.games || n.partners[id].wins < p.wins\n            ) ||\n            Object.entries(r.trumpWins).some(([c, v]) => n.trumpWins[c] < v) ||\n            !dominates(n.stats, r.stats) ||\n            Object.keys(r.achievements).some((id) => !n.achievements[id]) ||\n            Object.keys(r.retiredAchievements).some((id) => !n.retiredAchievements[id])\n          )\n            throw Error('Backup would roll back career history');\n        }\n      } else if (!explicitCloud && !starter && before.rookLifetimeStats) {\n        const a = parse(before.rookLifetimeStats),\n          b = parse(x.data.rookLifetimeStats || '{}');\n        for (const [name, r] of Object.entries(a))\n          if (!b[name] || !dominates(numeric(b[name]), numeric(r)))\n            throw Error('Older legacy backup: current progress preserved');\n      }\n      // Old exports omit the selected name. Do not bind Rita's history to a new\n      // destination's default You identity when exactly one named human exists.\n      if (!incoming && !x.data.horLandingIdentityV1 && !x.data.griffinHousePlayerName) {\n        const humans = Object.entries(parse(x.data.rookLifetimeStats || '{}'))\n          .filter(([name, row]) => !row.isBot && !['you','host','player'].includes(name.trim().toLowerCase()));\n        if (humans.length === 1) {\n          const [name, row] = humans[0];\n          after.griffinHousePlayerName = name;\n          after.horLandingIdentityV1 = JSON.stringify({ ...parse(after.horLandingIdentityV1 || '{}'), name });\n          if (typeof row.avatar === 'string') after.griffinHousePlayerAvatar = row.avatar;\n        }\n      }\n      validateBackup({ ...x, data: after, version: 1 });\n      const j = {\n        version: 2,\n        phase: 'prepared',\n        before,\n        after,\n        beforeHash: digest(before),\n        hash: digest(after),\n        at: now(),\n      };\n      storage.setItem(JOURNAL, JSON.stringify(j));\n      try {\n        for (const k of Object.keys(before)) if (!(k in after)) storage.removeItem(k);\n        for (const [k, v] of Object.entries(after)) storage.setItem(k, v);\n        for (const k of Object.keys(before))\n          if (!(k in after) && storage.getItem(k) !== null)\n            throw Error('Restore removal verification failed');\n        for (const [k, v] of Object.entries(after))\n          if (storage.getItem(k) !== v) throw Error('Restore verification failed');\n        j.phase = 'committed';\n        storage.setItem(JOURNAL, JSON.stringify(j));\n        storage.removeItem(JOURNAL);\n      } catch (e) {\n        try {\n          recover();\n        } catch (_) {}\n        throw Error('Restore interrupted; recovery journal retained or rolled back: ' + e.message);\n      }\n      return { ok: true, restored: Object.keys(x.data).length, createdAt: x.createdAt };\n    }\n    function download(payload, name, type) {\n      const blob = new Blob(\n        [typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2)],\n        { type }\n      );\n      const a = document.createElement('a'),\n        url = URL.createObjectURL(blob);\n      a.href = url;\n      a.download = name;\n      a.setAttribute('data-hor-career-export', '1');\n      document.body.appendChild(a);\n      a.click();\n      a.remove();\n      setTimeout(() => URL.revokeObjectURL(url), 1500);\n    }\n    function friendlyCode() {\n      return storage.getItem('horFriendlyRecoveryCodeV1') || null;\n    }\n    function protectionStatus() {\n      return {\n        recoveryCode: friendlyCode(),\n        lastBackupAt: storage.getItem('horLastCareerBackupV1'),\n        localProgressionEnabled: mode() === 'local',\n        recovery: 'Recover from your exported backup file, or sign in through Cloud Career to use an existing cloud save',\n      };\n    }\n    function downloadBackup() {\n      const b = buildBackup(),\n        test = root.HORCareerPhoneTest?.active,\n        payload = test ? root.HORCareerPhoneTest.wrapBackup(b) : b;\n      download(\n        payload,\n        (test ? 'Griffin-Rook-Test-Backup-' : 'Griffin-Rook-Career-Backup-') +\n          b.createdAt.replace(/[:.]/g, '-') +\n          '.json',\n        'application/json'\n      );\n      return payload;\n    }\n    function downloadRecoveryCode() {\n      const s = protectionStatus();\n      download(\n        'GRIFFIN HOUSE OF ROOKS\\n' +\n          (s.recoveryCode || 'No local reference code assigned.') +\n          '\\nThis local reference code cannot retrieve erased browser data. Use an exported Career Backup file, or sign in through Cloud Career to recover an existing cloud save.',\n        'Griffin-Rook-Recovery-Information.txt',\n        'text/plain'\n      );\n      return s;\n    }\n    function restoreBackupFile(file) {\n      return file.text().then((t) => {\n        const payload = JSON.parse(t);\n        if (payload?.format === 'GriffinHouseOfRooksCareerTestBackup') {\n          if (!root.HORCareerPhoneTest)\n            throw Error('This test backup needs the game version with isolated test restore.');\n          return root.HORCareerPhoneTest.start(payload);\n        }\n        return restoreBackupObject(payload);\n      });\n    }\n    recover();\n    P.core = {\n      KEY,\n      JOURNAL,\n      digest,\n      stable,\n      read,\n      migrate,\n      activate,\n      rename,\n      recordHand,\n      applyDailyLoginBonus,\n      collect,\n      validateBackup,\n      recover,\n      checkState,\n      profile,\n      mode,\n    };\n    P.offline = {\n      humanActorId: actorId,\n      localActorId: actorId,\n      botActorId: botId,\n      actorKey: (t, id) => t + ':' + id,\n      ledgerRead,\n      ledgerWrite() {\n        throw Error('Use event-based Career v2 commits');\n      },\n      localLeaderboard(stat = 'points', type = null) {\n        const s = read();\n        return Object.values(s?.records || {})\n          .filter((r) => !type || !!r.isBot === (type === 'bot'))\n          .map((r) => ({ value: r.stats[stat] || 0, record: r }))\n          .sort((a, b) => b.value - a.value);\n      },\n    };\n    P.protection = {\n      friendlyCode,\n      protectionStatus,\n      buildBackup,\n      downloadBackup,\n      downloadRecoveryCode,\n      validateBackup,\n      restoreBackupObject,\n      restoreBackupFile,\n      showRecoveryKit() {\n        alert(protectionStatus().recovery);\n      },\n    };\n    P.careerAdapters = {\n      sync,\n      profile,\n      mode,\n      activate,\n      rename,\n      relationshipRead(name) {\n        const s = read(),\n          p = s?.records.human.partners[botId(name)];\n        return { partnerGames: p?.games || 0, partnerWins: p?.wins || 0 };\n      },\n    };\n  }\n  root.HORCareerCore = { install, digest, stable };\n})(typeof window !== 'undefined' ? window : globalThis);\n";

// Public, completed-hand career accounting. No hands or credentials enter these events.
function freshCloudCareer(players){return {id:crypto.randomUUID(),players:players.map((p,i)=>({id:'career-seat-'+i,name:p.name,isBot:!!p.isBot,team:i%2,avatar:p.avatar||null})),stats:[{},{},{},{}],extras:[{},{},{},{}],events:[]}}
function cloudCareerCapture(state,seat,cards,{tricks=1,nest=false,plays=[],claim=false}={}){
 if(!state.career)return undefined;
 const c=structuredClone(state.career),s=c.stats[seat],partner=c.stats[(seat+2)%4],e=c.extras[seat];
 const add=(obj,k,n=1)=>obj[k]=(obj[k]||0)+n;
 const points=cards.reduce((n,card)=>n+cardPoints(card,state.settings.rules),0);
 add(s,'points',points);add(partner,'points',points);
 if(nest){add(s,'nestWins');add(s,'nestPts',points);add(partner,'nestPts',points)}
 else{add(s,'tricksWon',tricks);add(s,'trickPtsSum',points);add(partner,'trickPtsSum',points);if(!claim){if(points>=30)add(s,'bigTricks');e.bestTrickPoints=Math.max(e.bestTrickPoints||0,points)}}
 if(cards.some(card=>card.color==='rook'||card.id==='rook'))add(s,'rookCaptures');
 if(cards.some(isRed2))add(s,'red2Captures');
 if(!nest&&plays.some(p=>p.player%2!==seat%2&&isRed2(p.card)))add(e,'red2Rescues');
 return c;
}
function cloudCareerFinish(state,summary,lastWinner){
 if(!state.career)return undefined; // A pre-release match has no reliable historical counters.
 const nestSeat=state.settings.nestGoesTo==='bidder'?state.bidder:lastWinner;
 const c=state.nestCards?.length?cloudCareerCapture(state,nestSeat,state.nestCards,{nest:true}):structuredClone(state.career);
 for(const s of c.stats)s.hands=(s.hands||0)+1;
 const b=c.stats[state.bidder];b.bidsWon=(b.bidsWon||0)+1;b.bidSum=(b.bidSum||0)+state.bid;b.highBid=Math.max(b.highBid||0,state.bid);
 const outcome=summary.made?'bidsMade':'bidsSet';b[outcome]=(b[outcome]||0)+1;
 if(state.shotTheMoon){b.moonAttempts=(b.moonAttempts||0)+1;if(summary.shotMoonResult==='made')b.moonMade=(b.moonMade||0)+1}
 const event={matchId:'cloud:'+c.id,hand:c.events.length+1,players:structuredClone(c.players),stats:structuredClone(c.stats),extras:structuredClone(c.extras),bidder:state.bidder,tricksPerHand:state.settings.handSize,completed:!!summary.matchResult,winnerTeam:summary.matchResult==='Team A'?0:summary.matchResult==='Team B'?1:null,summary:{pointsA:summary.pointsA,pointsB:summary.pointsB,bid:state.bid,made:summary.made,trump:state.trump,scores:[...summary.scores]}};
 c.events.push(event);return c;
}
