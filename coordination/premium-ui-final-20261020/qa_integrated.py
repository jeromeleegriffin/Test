"""Actual UI hand runner, prepared but NOT executed in the restricted workspace.
Run from repository root after pip install playwright; playwright install chromium.
No game state is mutated by the runner; legal cards are selected through native UI.
Installed mode is explicitly a display-mode simulation, not physical Android.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, time, threading, http.server, functools, os

ROOT = Path.cwd()
OUT = ROOT / 'coordination/premium-ui-final-20261020/browser-results'
OUT.mkdir(parents=True, exist_ok=True)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
server = http.server.ThreadingHTTPServer(('127.0.0.1', 8765), handler)
threading.Thread(target=server.serve_forever, daemon=True).start()
results = []
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    sizes = [(360,740),(393,852),(430,932)]
    if os.getenv('QA_WIDTH'):
        sizes = [p for p in sizes if p[0] == int(os.environ['QA_WIDTH'])]
    modes = [False,True] if 'QA_INSTALLED' not in os.environ else [os.environ['QA_INSTALLED']=='true']
    for width, height in sizes:
        for installed in modes:
            label = f'{width}-' + ('installed-simulation' if installed else 'browser')
            ctx = browser.new_context(viewport={'width': width, 'height': height}, is_mobile=True, has_touch=True)
            if installed:
                ctx.add_init_script("""const original = window.matchMedia.bind(window);
                window.matchMedia = q => q.includes('display-mode:') ? {
                  matches:q.includes('fullscreen'),media:q,addEventListener(){},removeEventListener(){}
                }:original(q);""")
            page = ctx.new_page()
            page.set_default_timeout(7000)
            errors = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.on('dialog', lambda d: d.dismiss())
            record = {'label': label, 'errors': errors, 'phases': [], 'actions': [], 'passed': False}
            results.append(record)
            try:
                page.goto('http://127.0.0.1:8765/', wait_until='domcontentloaded')
                if not page.locator('#hor-player-name').is_visible():
                    page.locator('#landingGreeting783 button').click()
                page.locator('#hor-player-name').fill('Premium QA')
                page.locator('#soloPracticeBtn').click(timeout=60000)
                start = time.monotonic()
                shot = set()
                pace_set = False
                tools_tested = False
                last_tested = False
                previous_phase = None
                moon_declared = False
                while time.monotonic() - start < 180:
                    tour = page.locator('#tutorialSkip')
                    if tour.is_visible():
                        tour.click()
                        page.wait_for_timeout(150)
                        continue
                    if page.evaluate('tourCardOpen()'):
                        page.wait_for_timeout(150)
                        continue
                    if not pace_set and page.locator('#scoreSpeed701 [data-score-pace="99"]').is_visible():
                        try:
                            page.locator('#scoreSpeed701 [data-score-pace="99"]').click(timeout=1200)
                            pace_set = True
                        except Exception:
                            if page.locator('#tutorialSkip').is_visible():
                                page.locator('#tutorialSkip').click()
                                continue
                            raise
                    state = page.evaluate("""() => ({phase:game?.phase, current:game?.currentPlayer,
                        mine:myIndex,bidder:game?.bidder,goal:document.querySelector('#houseGoal1020')?.textContent,
                        utility:[...document.querySelectorAll('.in-game-leave > button')].map(b=>({id:b.id,y:b.getBoundingClientRect().y})),
                        speed:[...document.querySelectorAll('#scoreSpeed701 button,#portraitLastTrickButton')].map(b=>({w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height}))})""")
                    phase = state['phase']
                    if phase != previous_phase:
                        print(label, json.dumps(state), flush=True)
                        previous_phase = phase
                    if phase in ['bidding','discard','trump','play']:
                        assert all(-1 <= b['y'] <= 90 for b in state['utility']), 'Utility controls moved off top'
                        dims = state['speed']
                        if len(dims)==4 and all(b['w']>0 for b in dims):
                            assert max(b['w'] for b in dims)-min(b['w'] for b in dims)<0.4, 'Unequal control widths'
                            assert max(b['h'] for b in dims)-min(b['h'] for b in dims)<0.4, 'Unequal control heights'
                    if phase not in shot and phase:
                        record['phases'].append(state)
                        page.screenshot(path=str(OUT / f'{label}-{phase}.png'))
                        shot.add(phase)
                    if phase == 'bidding' and state['current'] == state['mine']:
                        if os.getenv('QA_MOON')=='true' and not moon_declared:
                            target=page.evaluate('maxBid()')
                            for _ in range(50):
                                value=page.locator('#bidValue').evaluate('e=>Number(e.value||e.textContent)')
                                if value>=target: break
                                page.locator('#bidPlus').click()
                            assert page.locator('#moonBidPlaque').is_visible()
                            assert page.evaluate('game.phase')=='bidding', 'Selecting Moon submitted without confirmation'
                            page.locator('#btnToggleTopOpts').click()
                            page.locator('#houseMenu805').wait_for(state='visible')
                            page.locator('#houseMenu805 .visual-close805').click()
                            page.locator('#leaveReplaceBtn').click()
                            page.locator('#confirmCancel').click()
                            page.locator('#confirmSheet').wait_for(state='hidden')
                            page.screenshot(path=str(OUT / f'{label}-moon-before-confirm.png'))
                            moon_declared=True
                            record['actions'].append('Moon selected without submitting; bidding Menu and Back tested')
                        bid = page.locator('#bidConfirm')
                        if bid.is_visible() and bid.is_enabled():
                            bid.click()
                            record['actions'].append('native bid')
                    if phase == 'discard' and state['bidder'] == state['mine']:
                        proceed = page.locator('#discardOverlay button').filter(has_text='Continue')
                        confirm = page.locator('#confirmDiscard')
                        if proceed.is_visible():
                            proceed.click()
                        elif confirm.is_visible() and confirm.is_enabled():
                            confirm.click()
                            record['actions'].append('six-card discard confirmed')
                        else:
                            choice = page.locator('#discardOverlay button.discard-pick:not([aria-pressed="true"])').first
                            if choice.is_visible():
                                choice.click()
                    if phase == 'trump' and state['bidder'] == state['mine']:
                        confirm = page.locator('#trumpCase714 .tc-confirm[aria-disabled="false"]')
                        pad = page.locator('#trumpCase714 .tc-pad').first
                        if confirm.is_visible():
                            confirm.click()
                            record['actions'].append('trump confirmed')
                        elif pad.is_visible():
                            pad.click()
                    if phase == 'play' and not tools_tested:
                        for pace in ['1','3','99']:
                            page.locator(f'#scoreSpeed701 [data-score-pace="{pace}"]').click()
                            assert page.locator(f'#scoreSpeed701 [data-score-pace="{pace}"]').get_attribute('aria-pressed')=='true'
                            page.screenshot(path=str(OUT / f'{label}-speed-{pace}.png'))
                        page.locator('#btnToggleTopOpts').click()
                        page.locator('#houseMenu805').wait_for(state='visible')
                        page.screenshot(path=str(OUT / f'{label}-menu.png'))
                        page.locator('#houseMenu805 .visual-close805').click()
                        page.locator('#houseMenu805').wait_for(state='hidden')
                        page.locator('#leaveReplaceBtn').click()
                        page.locator('#confirmCancel').wait_for(state='visible')
                        page.screenshot(path=str(OUT / f'{label}-leave-confirm.png'))
                        page.locator('#confirmCancel').click()
                        page.locator('#confirmSheet').wait_for(state='hidden')
                        assert page.evaluate('document.body.classList.contains("in-game")')
                        page.locator('#horRailFullscreenReview').click()
                        page.wait_for_function('!!document.fullscreenElement')
                        page.screenshot(path=str(OUT / f'{label}-native-fullscreen.png'))
                        page.locator('#horRailFullscreenReview').click()
                        page.wait_for_function('!document.fullscreenElement')
                        record['actions'].append('all speeds, menu return, Back cancel, native fullscreen enter/exit')
                        tools_tested=True
                    if phase == 'play' and not last_tested and page.evaluate('!!getPortraitPreviousTrick()'):
                        page.locator('#portraitLastTrickButton').click()
                        assert page.locator('#portraitLastTrickButton').get_attribute('aria-expanded')=='true'
                        page.screenshot(path=str(OUT / f'{label}-last.png'))
                        page.locator('#portraitLastTrickClose').click()
                        assert page.locator('#portraitLastTrickButton').get_attribute('aria-expanded')=='false'
                        last_tested=True
                        record['actions'].append('Last Trick open and close')
                    if phase == 'play' and state['current'] == state['mine']:
                        card_id = page.evaluate("""() => [...document.querySelectorAll('#myHand .card-face[data-id]')]
                          .find(e=>{const c=game.myHand.find(c=>String(c.id)===e.dataset.id);
                            return c&&canPlay(c,game.myHand,game.ledColor,game.trump)})?.dataset.id""")
                        if card_id:
                            card = page.locator(f'#myHand .card-face[data-id="{card_id}"]')
                            point = card.evaluate('''e => {const r=e.getBoundingClientRect();
                              for(const fy of [.2,.35,.5,.65,.8]) for(const fx of [.08,.2,.4,.6,.8,.92]){
                                const x=r.left+r.width*fx,y=r.top+r.height*fy,hit=document.elementFromPoint(x,y);
                                if(hit&&(hit===e||e.contains(hit)))return {x,y};
                              }return null;}''')
                            assert point, 'No exposed legal-card touch surface'
                            page.mouse.click(point['x'],point['y'])
                            record['actions'].append('legal card tap')
                    if phase == 'score':
                        page.locator('#scoreModal:not(.hidden)').wait_for(state='visible', timeout=30000)
                        page.wait_for_timeout(1200)
                        page.screenshot(path=str(OUT / f'{label}-score-settled.png'))
                        record['intelligence']=page.evaluate('''() => ({status:window.HORX1Integration?.status(),decisions:window.HORX1Integration?.metrics.decisions.length,fallbacks:window.HORX1Integration?.metrics.fallbacks})''')
                        record['toolsTested']=tools_tested
                        record['lastTested']=last_tested
                        # Reversible viewport switch keeps the native frozen landscape behavior.
                        page.set_viewport_size({'width':height,'height':width})
                        page.wait_for_timeout(500)
                        page.screenshot(path=str(OUT / f'{label}-landscape.png'))
                        page.set_viewport_size({'width':width,'height':height})
                        page.wait_for_timeout(500)
                        page.screenshot(path=str(OUT / f'{label}-portrait-return.png'))
                        page.locator('#scoreModalNext').click()
                        page.wait_for_timeout(600)
                        page.screenshot(path=str(OUT / f'{label}-after-score.png'))
                        record['awardClearance']=page.evaluate('''() => {const h=document.getElementById('horProgressToastHost');
                          if(!h?.children.length)return null;return {top:h.getBoundingClientRect().top,
                          headerBottom:Math.max(document.getElementById('housePremiumMatch1020').getBoundingClientRect().bottom,document.querySelector('.house-utility-group').getBoundingClientRect().bottom)};}''')
                        if record['awardClearance']:assert record['awardClearance']['top']>=record['awardClearance']['headerBottom']+7
                        page.wait_for_function('!!navigator.serviceWorker.controller', timeout=60000)
                        truth=page.evaluate('window.HORRuntimeTruth()')
                        assert truth['coherent'], json.dumps(truth)
                        record['runtimeTruth']=truth
                        ctx.set_offline(True)
                        page.reload(wait_until='domcontentloaded')
                        page.locator('#soloPracticeBtn').click(timeout=60000)
                        if page.locator('#tutorialSkip').is_visible(): page.locator('#tutorialSkip').click()
                        page.wait_for_function('game && game.phase==="bidding"',timeout=60000)
                        page.screenshot(path=str(OUT / f'{label}-offline-bidding.png'))
                        record['offlineReloadAndDeal']=True
                        ctx.set_offline(False)
                        record['passed'] = not errors and tools_tested and last_tested
                        break
                    page.wait_for_timeout(450)
                record['seconds'] = round(time.monotonic() - start, 2)
                if not record['passed']:
                    record['timeoutState']=page.evaluate('''() => ({phase:game?.phase,loader:window.HORAssetLoading772?.inspect(),tour:tourCardOpen(),text:document.body.innerText.slice(-2500)})''')
                    page.screenshot(path=str(OUT / f'{label}-timeout.png'))
            except Exception as exc:
                record['failure'] = str(exc)
                print(label, 'FAIL', str(exc), flush=True)
                page.screenshot(path=str(OUT / f'{label}-failure.png'))
            finally:
                ctx.close()
                (OUT / f'RESULTS-{label}.json').write_text(json.dumps(results, indent=2))
                print(label, 'RESULT', record['passed'], flush=True)
    browser.close()
server.shutdown()
if not all(r['passed'] for r in results):
    raise SystemExit('One or more real-hand runs failed; inspect screenshots and logs. No release certification.')
