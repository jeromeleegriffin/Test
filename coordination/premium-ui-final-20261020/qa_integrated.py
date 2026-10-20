"""Actual UI hand runner, prepared but NOT executed in the restricted workspace.
Run from repository root after pip install playwright; playwright install chromium.
No game state is mutated by the runner; legal cards are selected through native UI.
Installed mode is explicitly a display-mode simulation, not physical Android.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, time, threading, http.server, functools

ROOT = Path.cwd()
OUT = ROOT / 'coordination/premium-ui-final-20261020/browser-results'
OUT.mkdir(parents=True, exist_ok=True)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
server = http.server.ThreadingHTTPServer(('127.0.0.1', 8765), handler)
threading.Thread(target=server.serve_forever, daemon=True).start()
results = []
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    for width, height in [(360, 740), (393, 852), (430, 932)]:
        for installed in [False, True]:
            label = f'{width}-' + ('installed-simulation' if installed else 'browser')
            ctx = browser.new_context(viewport={'width': width, 'height': height}, is_mobile=True, has_touch=True)
            if installed:
                ctx.add_init_script("""const original = window.matchMedia.bind(window);
                window.matchMedia = q => q.includes('display-mode:') ? {
                  matches:q.includes('fullscreen'),media:q,addEventListener(){},removeEventListener(){}
                }:original(q);""")
            page = ctx.new_page()
            errors = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.on('dialog', lambda d: d.dismiss())
            record = {'label': label, 'errors': errors, 'phases': [], 'actions': [], 'passed': False}
            results.append(record)
            try:
                page.goto('http://127.0.0.1:8765/', wait_until='domcontentloaded')
                page.locator('#hor-player-name').fill('Premium QA')
                page.locator('#soloPracticeBtn').click(timeout=60000)
                start = time.monotonic()
                shot = set()
                pace_set = False
                while time.monotonic() - start < 180:
                    tour = page.locator('#tutorialSkip')
                    if tour.is_visible():
                        tour.click()
                    if not pace_set and page.locator('#scoreSpeed701 [data-score-pace="99"]').is_visible():
                        page.locator('#scoreSpeed701 [data-score-pace="99"]').click()
                        pace_set = True
                    state = page.evaluate("""() => ({phase:game?.phase, current:game?.currentPlayer,
                        mine:myIndex,bidder:game?.bidder,goal:document.querySelector('#houseGoal1020')?.textContent,
                        utility:[...document.querySelectorAll('.in-game-leave > button')].map(b=>({id:b.id,y:b.getBoundingClientRect().y})),
                        speed:[...document.querySelectorAll('#scoreSpeed701 button,#portraitLastTrickButton')].map(b=>({w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height}))})""")
                    phase = state['phase']
                    if phase not in shot and phase:
                        record['phases'].append(state)
                        page.screenshot(path=str(OUT / f'{label}-{phase}.png'))
                        shot.add(phase)
                    if phase == 'bidding' and state['current'] == state['mine']:
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
                    if phase == 'play' and state['current'] == state['mine']:
                        card_id = page.evaluate("""() => [...document.querySelectorAll('#myHand .card-face[data-id]')]
                          .find(e=>{const c=game.myHand.find(c=>String(c.id)===e.dataset.id);
                            return c&&canPlay(c,game.myHand,game.ledColor,game.trump)})?.dataset.id""")
                        if card_id:
                            page.locator(f'#myHand .card-face[data-id="{card_id}"]').click()
                            record['actions'].append('legal card tap')
                    if phase == 'score':
                        page.locator('#scoreModal:not(.hidden)').wait_for(state='visible', timeout=30000)
                        page.wait_for_timeout(1200)
                        page.screenshot(path=str(OUT / f'{label}-score-settled.png'))
                        record['passed'] = not errors
                        break
                    page.wait_for_timeout(450)
                record['seconds'] = round(time.monotonic() - start, 2)
            except Exception as exc:
                record['failure'] = str(exc)
                page.screenshot(path=str(OUT / f'{label}-failure.png'))
            finally:
                ctx.close()
                (OUT / 'RESULTS.json').write_text(json.dumps(results, indent=2))
    browser.close()
server.shutdown()
if not all(r['passed'] for r in results):
    raise SystemExit('One or more real-hand runs failed; inspect screenshots and logs. No release certification.')
