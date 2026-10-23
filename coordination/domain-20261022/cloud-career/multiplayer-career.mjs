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
