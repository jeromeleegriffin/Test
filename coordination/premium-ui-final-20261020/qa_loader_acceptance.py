from pathlib import Path
from playwright.sync_api import sync_playwright
import json,zipfile,threading,http.server,functools,tempfile,hashlib
root=Path.cwd();out=root/'coordination/premium-ui-final-20261020/loader-acceptance';out.mkdir(exist_ok=True)
base=json.loads((root/'coordination/releases/complete-repairs-20261019/RUNTIME_MANIFEST.json').read_text())
paths={x['path'] for x in base}|{'house-premium-ui.js','house-premium-ui.css','fullscreen-portrait-review.js','fullscreen-portrait-review.css'}
paths.update(str(p.relative_to(root)) for p in (root/'assets/house-premium-console').iterdir() if p.is_file())
archive=Path(tempfile.gettempdir())/'premium-loader-qa.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=1) as z:
 for n in sorted(paths):z.write(root/n,n)
with zipfile.ZipFile(archive) as z:assert z.testzip() is None
server=http.server.ThreadingHTTPServer(('127.0.0.1',8766),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start();report={'errors':[],'runtimeFiles':len(paths)}
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True);ctx=b.new_context(viewport={'width':393,'height':852},is_mobile=True,has_touch=True)
 page=ctx.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)))
 try:
  page.goto('http://127.0.0.1:8766/GriffinHouseZipReview.html',wait_until='domcontentloaded')
  page.locator('#zipFile').set_input_files(str(archive))
  page.frame_locator('#frame').locator('#soloPracticeBtn').wait_for(state='visible',timeout=120000)
  frame=page.locator('#frame').element_handle().content_frame()
  report['loadedIdentity']=frame.evaluate('window.HOR_BUILD')
  assert report['loadedIdentity']=='846-premium-portrait-20261020-rc1'
  page.screenshot(path=str(out/'loader-entry.png'))
  frame.locator('#soloPracticeBtn').click()
  for _ in range(160):
   if frame.locator('#tutorialSkip').is_visible():frame.locator('#tutorialSkip').click()
   phase=frame.evaluate('game?.phase')
   if phase=='bidding':break
   page.wait_for_timeout(350)
  assert phase=='bidding',phase
  report['realOfflineDealToBidding']=True
  page.screenshot(path=str(out/'loader-bidding.png'))
  frame.locator('#horRailFullscreenReview').click()
  frame.wait_for_function('!!document.fullscreenElement')
  page.wait_for_timeout(350)
  report['assetSizes']=frame.evaluate('''() => ({
   plaque:document.querySelector('#housePremiumMatch1020 img').naturalWidth,
   console:document.querySelector('#housePremiumConsole1020 img').naturalWidth})''')
  assert report['assetSizes']=={'plaque':600,'console':941}
  page.screenshot(path=str(out/'loader-native-fullscreen.png'))
  # Text stress is a labeled visual fixture, never a change to authoritative scores.
  report['textStress']=frame.evaluate('''() => {
   const a=document.querySelector('#scoreA'),b=document.querySelector('#scoreB'),clock=document.querySelector('#houseClock1020');
   window.__qaRestoreText={a:a.textContent,b:b.textContent,clock:clock.textContent};
   a.textContent='-2000';b.textContent='2000';window.HORPremiumUI1020.refresh();clock.textContent='12:59 PM';
   const read=id=>{const el=document.getElementById(id),range=document.createRange();range.selectNodeContents(el);
    const r=range.getBoundingClientRect(),box=el.getBoundingClientRect();return {text:el.textContent,textWidth:r.width,boxWidth:box.width,visible:box.width>0};};
   return [read('houseMatchScoreA1020'),read('houseMatchScoreB1020'),read('houseClock1020')];}''')
  page.screenshot(path=str(out/'loader-text-stress-fixture.png'))
  frame.evaluate('''() => {document.querySelector('#scoreA').textContent=window.__qaRestoreText.a;
    document.querySelector('#scoreB').textContent=window.__qaRestoreText.b;window.HORPremiumUI1020.refresh();}''')
  report['passed']=not report['errors'] and all(x['visible'] and x['textWidth']<=x['boxWidth']+0.5 for x in report['textStress'])
 except Exception as e:
  report['failure']=str(e);report['passed']=False;page.screenshot(path=str(out/'loader-failure.png'))
 finally:
  (out/'RESULTS.json').write_text(json.dumps(report,indent=2));print('LOADER',json.dumps(report),flush=True);b.close()
server.shutdown()
if not report['passed']:raise SystemExit(1)
