// Isolated presentation groundwork. Not loaded by the deployed game.
// No timers, storage, DOM mutation, action dispatch, or access to host hands.
const seatNames = ['bottom', 'left', 'top', 'right'];
const validSeat = n => Number.isInteger(n) && n >= 0 && n < 4;
const card = c => ({id: String(c.id), color: c.color, rank: c.rank});
function freeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
export function relativeSeat(seat, localSeat) {
  if (!validSeat(seat) || !validSeat(localSeat)) throw new Error('Invalid seat');
  return seatNames[(seat - localSeat + 4) % 4];
}
export function project({game, localSeat, spectator = false, publicCounts = [], poses = {}}) {
  if (!game || (!spectator && !validSeat(localSeat))) throw new Error('Missing game/local seat');
  const base = validSeat(localSeat) ? localSeat : 0;
  const myHand = spectator ? [] : (game.myHand || []).map(card);
  const seats = Array.from({length: 4}, (_, seat) => {
    const roster = game.players || [];
    const hasSeatNumbers = roster.some(p => p && validSeat(p.seat));
    const player = (hasSeatNumbers ? roster.find(p => p && p.seat === seat) : roster[seat]) || {};
    const avatar = typeof player.avatar === 'string' ? player.avatar : null;
    const pose = avatar && Object.hasOwn(poses, avatar) ? poses[avatar] : null;
    const count = !spectator && seat === base ? myHand.length : publicCounts[seat];
    return {
      seat, position: relativeSeat(seat, base),
      name: typeof player.name === 'string' ? player.name : '', avatar,
      pose: typeof pose === 'string' ? pose : null,
      missingPose: typeof pose !== 'string',
      count: Number.isInteger(count) && count >= 0 ? count : null,
      isLocal: !spectator && seat === base
    };
  });
  return freeze({
    phase: game.phase, handNumber: game.handNumber, currentPlayer: game.currentPlayer,
    bidder: game.bidder, bid: game.bid, trump: game.trump,
    paused: !!game.paused, resolvingTrick: !!game.resolvingTrick,
    scores: (game.scores || []).slice(), localSeat: spectator ? null : base,
    seats, myHand,
    trick: (game.trick || []).map(t => ({player: t.player, card: card(t.card)}))
  });
}
// Stable presentation variation only; no random calls during render/resize.
// Caller supplies room/match identity so rematches never share animation IDs.
export function playKey(session, handNumber, play) {
  return JSON.stringify([session, handNumber, play.player, String(play.card.id)]);
}
export function tossOffset(key) {
  let h = 2166136261;
  for (const char of key) h = Math.imul(h ^ char.charCodeAt(0), 16777619) >>> 0;
  return Object.freeze({x: ((h & 255) / 255 - .5) * .04,
    y: (((h >>> 8) & 255) / 255 - .5) * .04,
    angle: (((h >>> 16) & 255) / 255 - .5) * 10});
}
// Snapshot attachment (including reconnect) primes existing cards without replay.
// Keep this instance across rotation. It never invokes authoritative callbacks.
export function createPlayLedger() {
  let session = null, hand = null, seen = new Set();
  return {
    observe(nextSession, model, {snapshot = false} = {}) {
      const changed = session !== nextSession || hand !== model.handNumber;
      if (changed) {session = nextSession; hand = model.handNumber; seen = new Set();}
      const keys = model.trick.map(p => playKey(session, hand, p));
      const fresh = keys.filter(k => !seen.has(k));
      keys.forEach(k => seen.add(k));
      return snapshot || changed ? [] : fresh;
    }
  };
}
