from pathlib import Path
import re, sys
root=Path(__file__).resolve().parent
idx=(root/'index.html').read_text(encoding='utf-8')
game=(root/'game.js').read_text(encoding='utf-8')
sw=(root/'sw.js').read_text(encoding='utf-8')
hv=(root/'hor-version.js').read_text(encoding='utf-8')
def one(pat,text,label):
    m=re.search(pat,text)
    if not m: raise SystemExit('FAIL: missing '+label)
    return m.group(1)
build=one(r"var BUILD = '(\d+)'",idx,'index BUILD')
checks={
 'index game.js query': one(r'game\.js\?v=(\d+)',idx,'game query'),
 'index style.css query': one(r'style\.css\?v=(\d+)',idx,'style query'),
 'index sw query': one(r"sw\.js\?v=(\d+)",idx,'sw query'),
 'sw cache': one(r"house-of-rooks-v(\d+)",sw,'sw cache'),
 'hor live': one(r'HOR_LIVE_VERSION\s*=\s*(\d+)',hv,'HOR_LIVE_VERSION'),
 'hor build': one(r'HOR_BUILD\s*=\s*(\d+)',hv,'HOR_BUILD'),
}
for label,v in checks.items():
    if v != build: raise SystemExit(f'FAIL: {label}={v}, expected {build}')
if "const APP_VERSION = String(window.HOR_PAGE_BUILD || '"+build+"');" not in game:
    raise SystemExit('FAIL: game APP_VERSION is not bound to page build authority')
if "dock.classList.add('decision-mode-trump');" not in game:
    raise SystemExit('FAIL: live trump selector is not bound to decision console')
print('PASS: authoritative build', build, 'is consistent and live trump selector ownership is wired')
