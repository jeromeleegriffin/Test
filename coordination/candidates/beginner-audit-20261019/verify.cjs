// Behavioral regression checks. Run from the repository root with JSDOM 26.1.0.
// No browser, user save, game rule, AI, or network is controlled by this script.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const cp = require('node:child_process');
const acorn = require('acorn');
const walk = require('acorn-walk');
const { JSDOM } = require(process.env.JSDOM_PATH || 'jsdom');
const results = [];
const record = (name, extra = {}) => results.push({ name, status: 'PASS', ...extra });
const source = (file) => fs.readFileSync(file, 'utf8');
function nodeSource(file, name) {
  const code = source(file);
  const ast = acorn.parse(code, { ecmaVersion: 'latest' });
  let hit;
  walk.full(ast, (n) => {
    if ((n.type === 'FunctionDeclaration' || n.type === 'VariableDeclarator') && n.id?.name === name) hit = n;
  });
  assert(hit, name);
  return hit.type === 'VariableDeclarator' ? 'const ' + code.slice(hit.start, hit.end) + ';' : code.slice(hit.start, hit.end);
}
function dom(html = source('index.html')) {
  return new JSDOM(html, { url: 'https://example.test/candidate/', runScripts: 'outside-only', pretendToBeVisual: true });
}
(async () => {
  // Use the real mounted controls and reproduce both menu reparenting steps.
  const d = dom(), w = d.window;
  w.eval(source('audio-mixer.js'));
  w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
  const field = w.document.getElementById('horAudioLevels');
  assert(field);
  const storage = w.document.createElement('div'), page = w.document.createElement('section');
  w.document.body.append(storage, page);
  for (const n of [...field.children]) if (n.matches('.hor-audio-row,.hor-audio-mute')) storage.append(n);
  field.remove();
  page.append(...storage.children);
  const channels = ['master','voices','gameplay','character','atmosphere'];
  channels.forEach((key, i) => {
    const input = w.document.querySelector('[data-audio-level="' + key + '"]');
    const value = i * 17;
    input.value = String(value);
    input.dispatchEvent(new w.Event('input', { bubbles: true }));
    assert.equal(w.HORAudioMixer.settings()[key], value / 100);
    assert.equal(w.document.querySelector('[data-audio-value="' + key + '"]').textContent, value + '%');
  });
  const mute = w.document.querySelector('[data-audio-mute]');
  mute.checked = true; mute.dispatchEvent(new w.Event('change', { bubbles: true }));
  const saved = w.localStorage.getItem('horAudioMixerV1');
  const fresh = dom();
  fresh.window.localStorage.setItem('horAudioMixerV1', saved);
  fresh.window.eval(source('audio-mixer.js'));
  fresh.window.document.dispatchEvent(new fresh.window.Event('DOMContentLoaded'));
  assert.deepEqual(JSON.parse(JSON.stringify(fresh.window.HORAudioMixer.settings())), JSON.parse(saved));
  assert.equal(fresh.window.document.querySelector('[data-audio-mute]').checked, true);
  record('All five moved mixer rows and mute update readouts, save and restore on a fresh load');
  w.close(); fresh.window.close();

  let variants = 0;
  const tipsCode = nodeSource('polish.js', 'PLAY_TIPS') + '\nthis.tips = PLAY_TIPS;';
  for (let flags = 0; flags < 1024; flags++) {
    const keys = ['includeRook','includeRed2','includeRed1','rookLowest','includeOnes','onesHigh','specialsAnytime','mustTrumpWhenVoid','bidOnlyScoring','bidderNest'];
    const c = { minBid:100, red2Points:20, nestSizeDefault:6, handSize:10, game:null };
    keys.forEach((key,i) => c[key] = !!(flags & (1 << i)));
    c.nestGoesTo = c.bidderNest ? 'bidder' : 'lastTrick';
    vm.runInNewContext(tipsCode, c);
    const t = c.tips.trump.html(), f = c.tips.follow.html(), score = c.tips.score.html(), bid = c.tips.bidding.html();
    assert.equal(t.includes('Blackbird'), c.includeRook);
    assert.equal(t.includes('lowest trump'), c.includeRook && c.rookLowest);
    assert.equal(t.includes('Red Two'), c.includeRed2);
    assert.equal(t.includes('Special Red One'), c.includeRed1);
    assert.equal(t.includes('1 is highest'), c.includeOnes && c.onesHigh);
    assert.equal(f.includes('must play trump'), c.mustTrumpWhenVoid);
    assert.equal(f.includes('at any time'), c.specialsAnytime);
    assert.equal(score.includes('Make it: score the bid amount.'), c.bidOnlyScoring);
    assert.equal(score.includes('Nest points go to the bidding team'), c.bidderNest);
    assert(bid.includes('Passing takes you out'));
    variants++;
  }
  for (const [count, hand] of [[6,10],[9,9],[5,10]]) {
    const c = {game:{phase:'discard',discardCount:count}, nestSizeDefault:6,handSize:hand};
    vm.runInNewContext(tipsCode,c);
    assert(c.tips.nest.html().includes('Put ' + count + ' cards'));
    assert(c.tips.nest.html().includes('keep ' + hand));
  }
  record('Selected-rule tutorial and adaptive nest instructions', {variants, nestCases:3});

  // Exercise actual target-control lifecycle: first invalid draft, programmatic
  // sync, valid custom commit, a reset by hosting, then another menu reopen.
  const scores = dom(), s = scores.window;
  s.targetScore=500; s.$=(id)=>s.document.getElementById(id);
  for (const name of ['normalizeTargetScore','readTargetScoreFromUI','setCustomScoreVisible','syncTargetScoreUI','wireTargetScoreUI']) s.eval(nodeSource('game060.js',name));
  s.wireTargetScoreUI();
  let input=s.$('opt-target-score-custom'), select=s.$('opt-target-score');
  input.value=''; input.dispatchEvent(new s.Event('input',{bubbles:true}));
  s.syncTargetScoreUI();
  assert.equal(s.$('opt-target-score-custom-confirm').disabled,false);
  select.value='custom'; select.dispatchEvent(new s.Event('change',{bubbles:true}));
  input.value='250'; input.dispatchEvent(new s.Event('input',{bubbles:true}));
  s.$('opt-target-score-custom-confirm').click(); assert.equal(s.targetScore,250);
  s.targetScore=500; s.syncTargetScoreUI();
  assert.equal(input.value,'500');
  assert.equal(select.value,'500');
  assert.equal(s.$('opt-target-score-custom-confirm').disabled,false);
  assert(s.$('customScoreFeedback836').textContent.includes('Current target: 500'));
  select.value='custom'; select.dispatchEvent(new s.Event('change',{bubbles:true}));
  assert.equal(input.value,'500');
  assert.equal(input.getAttribute('aria-invalid'),'false');
  record('Custom target validation stays synchronized across resets and reopens');
  scores.window.close();

  const hands = dom('<div id="myHand"></div><div id="ltHand"></div><div id="illegalWhy" class="hidden"></div>');
  const h = hands.window;
  Object.assign(h, {game:{phase:'play',currentPlayer:0,myHand:[{id:'black-5',color:'black',rank:5},{id:'green-13',color:'green',rank:13}],ledColor:'black',trump:'yellow'}, myIndex:0, includeRook:true, includeRed2:true,includeRed1:false,rookLowest:false,mustTrumpWhenVoid:false,specialsAnytime:false,reduceMotion:true});
  h.$ = id=>h.document.getElementById(id);
  h.COLOR_NAMES={black:'Black',green:'Green'};
  h.isRookCard=c=>c?.color==='rook'; h.isRed2=c=>c?.id==='red-2';h.isRed1=()=>false;
  h.eval(source('rules.js'));
  h.eval(['colorLabel','illegalReason','showWhy','tapHaptic','bindWhyOnCards'].map(n=>nodeSource('polish.js',n)).join('\n') + '\nconst boundHandRoots = new WeakSet(); bindWhyOnCards($("myHand")); bindWhyOnCards($("ltHand"));');
  let legalPlays=0;
  const markup='<div class="card-face playable" data-id="black-5"></div><div class="card-face dim" data-id="green-13" data-why-bound="1"></div>';
  for(const id of ['myHand','ltHand']) {
    const root=h.$(id); root.innerHTML=markup;
    await new Promise(resolve=>setImmediate(resolve));
    const legal=root.querySelector('[data-id="black-5"]'),illegal=root.querySelector('[data-id="green-13"]');
    assert.equal(legal.getAttribute('role'),'button');
    assert.equal(illegal.getAttribute('aria-disabled'),'true');
    assert(illegal.getAttribute('aria-label').includes('Must follow Black'));
    legal.onclick=()=>legalPlays++;
    illegal.onclick=()=>{throw Error('Illegal card reached the play handler');};
    illegal.click(); assert.equal(h.$('illegalWhy').textContent,'Must follow Black');
    legal.dispatchEvent(new h.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
    root.innerHTML=markup; // Repaint again with copied attributes, as landscape does.
    await new Promise(resolve=>setImmediate(resolve));
    root.lastElementChild.click(); assert.equal(h.$('illegalWhy').textContent,'Must follow Black');
    root.lastElementChild.dispatchEvent(new h.MouseEvent('pointerdown',{bubbles:true,clientX:100,clientY:150}));
    await new Promise(resolve=>setTimeout(resolve,450));
    assert.equal(h.$('illegalWhy').classList.contains('hidden'),false);
  }
  assert.equal(legalPlays,2);
  record('Both hand roots survive repaints: accessible cards, rejected tap, held explanation and keyboard legal play');
  hands.window.close();

  const discard = dom(), n = discard.window;
  n.includeRed2=false;n.isRookCard=()=>false;n.isRed2=()=>false;n.isRed1=()=>false;
  n.HORHandOrder838={ordered:h=>h,preset:h=>h}; n.selectedForDiscard=new Set();
  n.eval(source('nest-manual838.js'));
  let confirmed;
  const hand=Array.from({length:18},(_,i)=>({id:'green-'+(i+1),color:'green',rank:i+1}));
  n.HORManualNest838.show({ov:n.document.getElementById('discardOverlay'),flowKey:'nine',hand,kitty:hand.slice(9),count:9,confirm:(...args)=>confirmed=args});
  const q=id=>n.document.getElementById(id);
  assert.equal(q('confirmDiscard').disabled,true);
  for(let i=0;i<9;i++) q('nest838Hand').querySelector('.nest838-card').click();
  assert(q('nest838Status').textContent.includes('9 kept cards'));
  assert.equal(q('confirmDiscard').disabled,false);
  q('nest838Hand').querySelector('.nest838-card').click();
  assert.equal(n.selectedForDiscard.size,9);
  assert(q('nest838Status').textContent.includes('full'));
  q('nest838Nest').querySelector('.nest838-card').click(); assert.equal(n.selectedForDiscard.size,8);
  assert.equal(q('confirmDiscard').disabled,true);
  q('nest838Hand').querySelector('.nest838-card').click(); q('confirmDiscard').click();
  assert.equal(confirmed[0].length,9);assert.equal(confirmed[1].length,9);
  record('Nine-card discard flow: exact wording/count, excess rejection, return and original confirm path');
  discard.window.close();

  const guards = { isSoloPractice:true,roomCode:'OFFLINE',location:{protocol:'https:',hostname:'example.test'} };
  vm.runInNewContext(nodeSource('game060.js','canShareJoinQr') + nodeSource('game060.js','copyRoomCode') + nodeSource('game060.js','shareRoom') + nodeSource('game060.js','setQrOpen'), guards);
  assert.equal(guards.canShareJoinQr(),false);
  // Missing DOM/clipboard/share stubs deliberately throw if either guard leaks.
  guards.copyRoomCode(); guards.shareRoom();
  guards.isSoloPractice=false; guards.roomCode='ABCD'; guards.isPrivateOrLocalHost=()=>false;
  assert.equal(guards.canShareJoinQr(),true);
  record('Offline invitations cannot copy or share; real hosted rooms remain eligible');

  // Achievement requirements/thresholds and frozen code are unchanged.
  for (const name of ['FAMILIES','FEATS']) {
    const old = cp.execFileSync('git',['show','HEAD:progression.js'],{encoding:'utf8'});
    const ast=acorn.parse(old,{ecmaVersion:'latest'}); let n;
    walk.full(ast,x=>{if(x.type==='VariableDeclarator'&&x.id.name===name)n=x;});
    const a=vm.runInNewContext('('+old.slice(n.init.start,n.init.end)+')');
    const b={}; vm.runInNewContext(nodeSource('progression.js',name)+'this.rows='+name,b);
    assert.deepEqual(JSON.parse(JSON.stringify(b.rows, (k,v)=>k==='description'?undefined:v)),JSON.parse(JSON.stringify(a,(k,v)=>k==='description'?undefined:v)));
    if(name==='FAMILIES') assert(b.rows.every(x=>x.description));
  }
  const manifest=JSON.parse(source('coordination/releases/846-cleanup/SOURCE_MANIFEST.json'));
  const hash=require('node:crypto'); let protectedFiles=0;
  for(const item of manifest.filter(x=>/^(assets\/|voices\/|x1\/)|^(bots|rules|qrcode845|career-core)\.js$/.test(x.path))) {
    assert.equal(hash.createHash('sha256').update(fs.readFileSync(item.path)).digest('hex'),item.sha256,item.path); protectedFiles++;
  }
  record('Approved assets, voices, AI, rules and career core retained byte for byte; award IDs and thresholds unchanged',{protectedFiles});

  fs.writeFileSync('coordination/candidates/beginner-audit-20261019/UNIT_RESULTS.json',JSON.stringify({status:'PASS',environment:'Node + JSDOM 26.1.0; DOM simulation, not a real browser',results},null,2)+'\n');
  console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
