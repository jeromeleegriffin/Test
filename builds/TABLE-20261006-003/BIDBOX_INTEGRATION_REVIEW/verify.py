from pathlib import Path
import hashlib,json,re,subprocess
import tinycss2
b=Path('bidbox_integration/baseline_package/clean-R706');c=Path('candidate/Rook710');sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
expected_new={'approved-bid-portrait.css','approved-bid-portrait.js','assets/bidbox-approved/bidbox_complete_blank.png','assets/bidbox-approved/asset_map.json'}
changed=[];new=[]
for p in b.rglob('*'):
 if p.is_file():
  q=c/p.relative_to(b);assert q.exists()
  if sha(p)!=sha(q):changed.append(str(p.relative_to(b)))
for p in c.rglob('*'):
 if p.is_file() and not (b/p.relative_to(c)).exists():new.append(str(p.relative_to(c)))
assert changed==['index.html'],changed
assert set(new)==expected_new,new
original=(b/'index.html').read_text();after=(c/'index.html').read_text();assert after==original.replace('</head>','<link rel="stylesheet" href="approved-bid-portrait.css">\n</head>').replace('</body>','<script src="approved-bid-portrait.js"></script>\n</body>')
for name in ['game.js','style.css','rules.js','sw.js','hor-version.js']:assert sha(b/name)==sha(c/name)
assert sha(c/'assets/bidbox-approved/bidbox_complete_blank.png')==sha(Path('bidbox_integration/frozen_asset/assets/bidbox_complete_blank.png'))
assert sha(c/'assets/bidbox-approved/asset_map.json')==sha(Path('bidbox_integration/frozen_asset/asset_map.json'))
css=(c/'approved-bid-portrait.css').read_text();rules=tinycss2.parse_stylesheet(css,skip_comments=True,skip_whitespace=True);assert len(rules)==1 and rules[0].lower_at_keyword=='layer'
layer=tinycss2.parse_rule_list(rules[0].content,skip_comments=True,skip_whitespace=True);assert len(layer)==1 and layer[0].lower_at_keyword=='media' and tinycss2.serialize(layer[0].prelude).strip()=='(orientation: portrait)'
for r in tinycss2.parse_rule_list(layer[0].content,skip_comments=True,skip_whitespace=True):
 assert r.type=='qualified-rule'
 sel=tinycss2.serialize(r.prelude).strip()
 for d in tinycss2.parse_declaration_list(r.content,skip_comments=True,skip_whitespace=True):
  assert d.type!='error'
  if d.type=='declaration' and sel=='body #decisionConsole.approved-bid-portrait.decision-mode-bid:not(.hidden)':assert d.name in ['background','box-shadow','pointer-events'],d.name
assert 'cloneNode' not in (c/'approved-bid-portrait.js').read_text()
geometry=[]
for vw in [320,360,390,430,600]:
 dw=min(420,vw-8);dh=dw*557/1614;s=dh/290;cw=701*s;assert cw<=dw;assert abs(cw/dh-701/290)<1e-10
 targets={}
 for id,x,y,w,h in [('minus',35,73,149,100),('plus',516,73,147,100),('amount',269,98,166,55),('bid',35,176,316,100),('pass',378,176,285,100)]:targets[id]={'left':(dw-cw)/2+x*s,'top':y*s,'width':w*s,'height':h*s}
 assert targets['minus']['height']>=37
 assert targets['minus']['top']+targets['minus']['height']<targets['bid']['top']
 geometry.append({'viewportWidth':vw,'inheritedDock':[dw,dh],'containedArt':[cw,dh],'uniformScale':s,'touchHeight':100*s,'targets':targets})
report={'status':'PENDING_WINDOWS_PHONE_RUNTIME_VERIFICATION','changedExistingFiles':changed,'newRuntimeFiles':new,'allOtherBaselineFiles':'byte-for-byte identical','frozenArtAndMap':'exact supplied bytes','portraitOnlyCSS':'all rules enclosed in single orientation:portrait media query','dockGeometry':'no new declaration for dimensions, position, margins, border, padding, aspect ratio or transforms','geometryChecks':geometry,'runtimeBrowserTests':'not executed; no installed browser available','botHandsOrGames':'not executed'}
Path('bidbox_integration/evidence/VERIFICATION.json').write_text(json.dumps(report,indent=2));Path('bidbox_integration/evidence/CANDIDATE_RUNTIME_SHA256.json').write_text(json.dumps({str(p.relative_to(c)):sha(p)for p in c.rglob('*')if p.is_file()},indent=2))
subprocess.run(['diff','-ruN',str(b),str(c)],stdout=open('bidbox_integration/evidence/ACTUAL_DIFF.patch','w'))
print('Expected file set, frozen asset hashes, protected source hashes, portrait-only CSS and 5 uniform scaling fixtures: passed')
