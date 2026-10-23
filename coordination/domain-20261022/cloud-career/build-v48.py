from pathlib import Path
s=Path('cloud-career/main-v46.mjs').read_text()
s=s.replace('  const dealer = Number.isInteger(testHooks.dealer)', '  state.career = freshCloudCareer(state.players);\n  const dealer = Number.isInteger(testHooks.dealer)',1)
s=s.replace('    lastSummary: summary\n', '    lastSummary: summary,\n    career: cloudCareerFinish(state, summary, lastWinner)\n',1)
s=s.replace('    hands: [[], [], [], []],\n    trick: [],', '''    career: cloudCareerCapture(state,seat,claimCards,{tricks:state.hands[seat].length,claim:true,plays:[...(state.trick||[]),...state.hands.flatMap((cards,player)=>cards.map(card=>({player,card})))]}),
    hands: [[], [], [], []],
    trick: [],''',1)
needle='''  const next = {
    ...state,
    hands,
    trick: [],'''
assert needle in s
s=s.replace(needle,'''  const next = {
    ...state,
    career: cloudCareerCapture(state,winner.player,trick.map(p=>p.card),{plays:trick}),
    hands,
    trick: [],''',1)
s=s.replace('      viewerSeat: seat,\n      connections:', '''      viewerSeat: seat,
      careerEvents: clone2((room.gameState.career?.events||[]).filter(e=>!room.trickOpening&&!room.claimOpening||e.hand<(room.gameState.career?.events?.length||0))),
      connections:''',1)
# Consume full history even on a reconnect directly into the next hand.
s=s.replace('  function gameSnapshot(snap) {\n    syncCloudSeat(snap);','''  function recordCloudCareer(snap) {
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
    recordCloudCareer(snap);''',1)
s=s.replace('careerEvent:{matchId:"cloud:"+credentials.roomCode,hand:snap.handNumber}', 'careerEvent:snap.careerEvents?.at(-1)||null',1)
s=s.replace('// The cloud branch has no careers, local award writes, or PeerJS seats.','// Cloud careers consume authoritative completed-hand history; legacy writers stay disabled.')
s=s.replace('credentials ? ({ ok: true, skipped: "private-cloud-test" }) : native.horRecordCareerHand?.(...args)', 'credentials ? recordCloudCareer(latest) : native.horRecordCareerHand?.(...args)',1)
s+='\n'+Path('cloud-career/multiplayer-career.mjs').read_text()
Path('cloud-career/main-v48.mjs').write_text(s)
