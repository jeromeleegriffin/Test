import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {api,players} from '../../cloudflare/live/x1-full/test-harness.mjs';
const {createMatch,makeDeck,freshOnlineX1,chooseOnlineBotAction,submitBid,finishHand,cardPoints,X1_RULES,x1ExtendedView}=api;
let checks=0;
function random(seed){let x=seed>>>0;return n=>{x=(x+0x6d2b79f5)>>>0;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)%n;};}
function state(seed,options={},roster=players){const rng=random(seed);return createMatch(roster,{misdealOnNoCounters:false,shootMoonEnabled:true,...options},{dealer:0,shuffle:deck=>{deck=deck.slice();for(let i=deck.length-1;i>0;i--){const j=rng(i+1);[deck[i],deck[j]]=[deck[j],deck[i]];}return deck;}});}
function room(s,version='v2'){return{gameState:s,x1:version==='none'?null:{...freshOnlineX1(s),...(version==='v1'?{version:'x1-online-v1'}:{})},seats:s.players.map(p=>({playerId:p.playerId,isBot:p.isBot}))};}

// Default-off does not remove the explicit opt-in or alter existing match settings.
{const s=createMatch(players,{}, {dealer:0});assert.equal(s.settings.shootMoonEnabled,false);const on=createMatch(players,{shootMoonEnabled:true},{dealer:0});assert.equal(on.settings.shootMoonEnabled,true);const snap=structuredClone(on);assert.equal(snap.settings.shootMoonEnabled,true);checks+=3;}

// Bot prohibition at reducer authority, independent of brain, names or stale code.
for(const includeRed2 of [true,false])for(const seat of [0,1,2,3]){
 const roster=players.map(p=>({...p,isBot:true}));const s=state(2,{includeRed2},roster);s.currentPlayer=seat;
 const max=makeDeck(s.settings.rules).reduce((n,c)=>n+cardPoints(c,s.settings.rules),0);
 const result=submitBid(s,seat,max);assert.equal(result.accepted,false);assert.equal(result.reason,'BOT_MOON_FORBIDDEN');assert.equal(s.shotTheMoon,false);checks++;
 s.players[seat].isBot=false;s.scores[seat%2]=-125;const human=submitBid(s,seat,max);assert(human.accepted);assert.equal(human.state.shotTheMoon,true);checks++;
}
// All engine/fallback paths must produce a legal pass or ordinary bid at the Moon boundary.
for(const version of ['v2','v1','none'])for(const includeRed2 of [true,false])for(const seat of [1,2,3]){
 const s=state(11,{includeRed2});s.currentPlayer=seat;s.highestBid=makeDeck(s.settings.rules).reduce((n,c)=>n+cardPoints(c,s.settings.rules),0)-5;s.bidder=0;s.bidStatus[0]=s.highestBid;
 const d=chooseOnlineBotAction(room(s,version),seat);assert.equal(d.action.value,0);assert(submitBid(s,seat,d.action.value).accepted);checks++;
}
// Moon settles the match independently of score, target, nest variant or bidder's team.
const native=fs.readFileSync(new URL('../../game060.js',import.meta.url),'utf8');
assert(native.includes('let shootMoonEnabled = false;'));
assert(!/checked[^>]*id="opt-shoot-moon"/.test(fs.readFileSync(new URL('../../index.html',import.meta.url),'utf8')));
{const prefs=fs.readFileSync(new URL('../../polish.js',import.meta.url),'utf8');const start=prefs.indexOf('    if (p.moonPreferenceVersion === 12');const end=prefs.indexOf('    houseTeamA',start);assert(start>=0&&end>start);for(const [p,expected]of [[{shootMoonEnabled:true},false],[{moonPreferenceVersion:12,shootMoonEnabled:true},true],[{moonPreferenceVersion:12,shootMoonEnabled:false},false]]){const c={p,shootMoonEnabled:false};vm.createContext(c);vm.runInContext(prefs.slice(start,end),c);assert.equal(c.shootMoonEnabled,expected);checks++;}}
const fn=name=>{const start=native.indexOf('function '+name+'('),end=native.indexOf('\nfunction ',start+1);return native.slice(start,end);};
const endStart=native.indexOf('function hostEndHand()'),endCut=native.indexOf('  handHistory.push(summary);',endStart);
const scoring=native.slice(endStart,endCut)+' return summary;\n}';
let outcomes=0;
for(const targetScore of [100,500,1000,2000])for(const bidderTeam of [0,1])for(const made of [false,true])for(const scores of [[0,0],[1750,1800],[-150,-250]]){
 let s=state(1,{targetScore});const deck=makeDeck(s.settings.rules);s.bidder=bidderTeam;s.bid=200;s.shotTheMoon=true;s.nestCards=[];s.hands=[[],[],[],[]];s.scores=scores.slice();
 const lost=made?[]:[deck.find(c=>cardPoints(c,s.settings.rules)===5)];const taken=deck.filter(c=>!lost.includes(c));s.tricksTaken=bidderTeam===0?[taken,lost]:[lost,taken];
 const done=finishHand(s,0),expected=(made?bidderTeam:1-bidderTeam)===0?'Team A':'Team B';assert.equal(done.matchResult,expected);assert.equal(done.phase,'complete');assert.equal(done.lastSummary.shotMoonResult,made?'made':'failed');
 const v=x1ExtendedView(s,0,freshOnlineX1(s)),points=[done.lastSummary.pointsA,done.lastSummary.pointsB];assert.equal(X1_RULES.utility(v,points),expected==='Team A'?10000:-10000);
 const context={game:{...s,currentPlayer:0},players:s.players,handHistory:[],targetScore,bidOnlyScoring:false,nestGoesTo:'lastTrick',cardPoints:c=>cardPoints(c,s.settings.rules),totalCountersInDeck:()=>200,$:()=>null,console};context.game.targetScore=targetScore;vm.createContext(context);
 vm.runInContext(fn('getMatchResult')+'\n'+fn('isMatchOver')+'\n'+scoring,context);
 const summary=vm.runInContext('hostEndHand()',context);assert.equal(summary.shotMoonResult,made?'made':'failed');assert.equal(summary.matchResult,expected);assert.equal(vm.runInContext('getMatchResult(game.scores, targetScore)',context),expected);assert.equal(context.isMatchOver(summary.scores,targetScore,summary),true);outcomes++;checks+=6;
}
// Offline permission works for every seat, and Moon-disabled tables retain normal max bids.
{const c={shootMoonEnabled:true,players:[{isBot:false},{isBot:true},{isBot:true},{isBot:true}],game:{},maxBid:()=>200,minBid:100};vm.createContext(c);vm.runInContext(fn('moonBidAllowed')+'\n'+fn('bidCeilingFor'),c);assert.equal(c.moonBidAllowed(0),true);for(const seat of [1,2,3]){assert.equal(c.moonBidAllowed(seat),false);assert.equal(c.bidCeilingFor(seat),195);}c.shootMoonEnabled=false;assert.equal(c.bidCeilingFor(1),200);checks+=8;}
// Reproducible natural auctions: one simulated human always passes; three actual bots.
let auctions=0,decisions=0,moonBids=0;
for(let seed=1;seed<=500;seed++){
 const s=state(seed,{includeRed2:seed%2===0}),r=room(s);let steps=0;
 while(r.gameState.phase==='bidding'){
  const before=r.gameState,seat=before.currentPlayer,d=seat===0?{action:{type:'bid',value:0},engine:'human-simulation'}:chooseOnlineBotAction(r,seat);
  const total=makeDeck(before.settings.rules).reduce((n,c)=>n+cardPoints(c,before.settings.rules),0);if(d.action.value===total)moonBids++;
  assert(d.action.value!==total);const next=submitBid(before,seat,d.action.value);assert(next.accepted,next.reason);api.observeOnlineX1(r,before,next,d);r.gameState=next.state;decisions++;if(++steps>100)throw Error('AUCTION_LOOP');
 }assert(!r.gameState.shotTheMoon);auctions++;
}
assert.equal(moonBids,0);
// Player-facing rules and both result renderers have no obsolete failure wording.
for(const p of ['game060.js','index.html','polish.js']){const text=fs.readFileSync(new URL('../../'+p,import.meta.url),'utf8');assert(!/go set as usual|or lose '\s*\+\s*value|missed the Moon: −|points and opponents score only/.test(text),p);}
const result={checks,outcomeCases:outcomes,naturalAuctions:auctions,decisions,botMoonBids:moonBids,scope:'Actual online reducer/engines and extracted actual native scoring/permissions; local simulation, not physical-device acceptance'};
console.log(JSON.stringify(result));
fs.writeFileSync(new URL('./HUMAN_MOON_POLICY_TEST_RESULTS.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
