from pathlib import Path
from playwright.sync_api import sync_playwright
import json,threading,http.server,functools
root=Path.cwd();out=root/'coordination/premium-ui-final-20261020/startup-probe';out.mkdir(exist_ok=True)
server=http.server.ThreadingHTTPServer(('127.0.0.1',8765),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start()
events=[];states=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True);page=b.new_page(viewport={'width':393,'height':852},is_mobile=True,has_touch=True)
 page.on('console',lambda m:events.append({'type':m.type,'text':m.text}) if m.type in ['error','warning'] or m.text.startswith('ENTRY_TRACE') else None)
 page.on('dialog',lambda d:(events.append({'type':'dialog','text':d.message}),d.dismiss()))
 page.on('pageerror',lambda e:events.append({'type':'pageerror','text':str(e)}))
 page.goto('http://127.0.0.1:8765/',wait_until='domcontentloaded')
 if not page.locator('#hor-player-name').is_visible():page.locator('#landingGreeting783 button').click()
 page.locator('#hor-player-name').fill('Premium QA')
 def state(label):
  r=page.evaluate('''() => {const a=window.HORAssetLoading772?.inspect();return {
   phase:game?.phase,body:document.body.className,host:isHost,solo:isSoloPractice,players:players?.length,
   tour:tourCardOpen(),blocking:window.horTourBlocking,pin:!!window.horPinTip,afterTour:window.horAfterTour?.length,
   tutorial:document.querySelector('#tutorialOverlay')?.outerHTML.slice(0,500),
   loader:a&&{busy:a.busy,pending:a.pending,loaded:a.loaded,total:a.total,failed:a.failed,initialRevealComplete:a.initialRevealComplete},
   gameText:document.querySelector('#messageArea')?.textContent,
   button:document.querySelector('#soloPracticeBtn')?.outerHTML,
   name:document.querySelector('#hor-player-name')?.value};}''')
  r['label']=label;states.append(r);print('PROBE',json.dumps(r),flush=True);page.screenshot(path=str(out/f'{label}.png'))
 page.evaluate('''() => window.addEventListener('click',e=>{if(e.target.closest?.('#soloPracticeBtn')){
  const a=window.HORAssetLoading772.inspect();console.log('ENTRY_TRACE '+JSON.stringify({busy:a.busy,pending:a.pending,loaded:a.loaded,total:a.total}));}},true)''')
 state('before-entry');page.locator('#soloPracticeBtn').click();state('first-tap')
 for n in range(4):
  page.wait_for_timeout(2000)
  if page.locator('#tutorialSkip').is_visible():page.locator('#tutorialSkip').click()
 state('after-eight-seconds')
 if page.locator('#soloPracticeBtn').is_visible():page.locator('#soloPracticeBtn').click()
 page.wait_for_timeout(2000)
 if page.locator('#tutorialSkip').is_visible():page.locator('#tutorialSkip').click()
 page.wait_for_timeout(3000);state('after-second-tap')
 (out/'PROBE.json').write_text(json.dumps({'states':states,'events':events},indent=2));b.close()
server.shutdown()
