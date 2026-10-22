const {JSDOM}=require('jsdom');
const assert=require('node:assert/strict');
const fs=require('fs');
const source=fs.readFileSync('ui-v10c.js','utf8');
async function test(kind){
 const dom=new JSDOM('<!doctype html><body><div id="lobby"><div id="reconnectBox">Previous room still open<button>Rejoin</button></div><div id="lobbyStatus">Could not change table speed: ROOM_NOT_FOUND</div></div>',{url:'https://rooks.jeromegriffin.com',runScripts:'outside-only'});
 const w=dom.window,key='ghr-private-cloud-seat-v1',saved=JSON.stringify({roomCode:'TST42',token:'test-only'});
 w.localStorage.setItem(key,saved);
 w.fetch=async()=>{if(kind==='network')throw Error('offline');return {ok:kind==='open',json:async()=>kind==='open'?{phase:'waiting'}:{error:kind==='closed'?'ROOM_NOT_FOUND':'UNAUTHORIZED'}}};
 w.eval(source);await new Promise(r=>setTimeout(r,30));
 const box=w.document.getElementById('reconnectBox');
 assert.equal(box.dataset.verifiedOpen==='true',kind==='open');
 assert.equal(w.localStorage.getItem(key)!==null,kind==='open'||kind==='network');
 if(kind==='closed')assert.match(w.document.getElementById('lobbyStatus').textContent,/That table has closed/);
 if(kind==='open'){w.localStorage.removeItem(key);w.dispatchEvent(new w.Event('storage'));assert.equal(box.hasAttribute('data-verified-open'),false)}
 w.close();console.log('PASS resume',kind);
}
(async()=>{for(const kind of ['open','closed','unauthorized','network'])await test(kind)})().catch(e=>{console.error(e);process.exitCode=1});
