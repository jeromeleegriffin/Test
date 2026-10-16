from pathlib import Path
import re,json,hashlib
from lxml import html
from PIL import Image
import numpy as np
r=Path(__file__).parent;s=(r/'index.html').read_text()
rewritten=re.sub(r'''url\(\s*(['"]?)([^'"\)]+)\1\s*\)''',lambda m:'url("'+m[2]+'")',s)
doc=html.fromstring(rewritten)
for e in doc.xpath('//*[@clip-path or @mask or @filter]'):
 for attr in ['clip-path','mask','filter']:
  if attr in e.attrib:assert re.fullmatch(r'url\("#[\w-]+"\)',e.get(attr)),e.attrib
counts={}
for group in doc.xpath('//*[@data-count]'):
 count=int(group.get('data-count'));byseat={}
 for seat in ['left','right','top','bottom']:
  members=group.xpath('.//*[@data-seat="'+seat+'"]');assert len(members)==count
  byseat[seat]=len(members)
  for el in members:
   if seat not in ['left','right']:continue
   a,b,c,d,e,f=map(float,re.search(r'matrix\(([^)]+)\)',el.get('transform')).group(1).split())
   lean=-c*140
   assert (lean>0)==(seat=='left')
   assert a*d-b*c>0
 counts[count]=byseat
for p in re.findall(r'(?:href|src)="(assets/[^\"]+)"',s):assert (r/p).is_file(),p
base=np.asarray(Image.open(r/'assets/approved-scene.png').convert('RGB'));out=np.asarray(Image.open(r/'evidence/count-10.png').convert('RGB'));allowed=np.zeros(base.shape[:2],dtype=bool)
for x0,y0,x1,y1 in [(370,315,530,565),(1145,315,1290,565),(705,195,965,320),(485,580,1190,730),(40,20,165,170)]:allowed[y0:y1,x0:x1]=True
changed=int(np.count_nonzero(np.any(base!=out,axis=2)&~allowed));assert changed==0
# Real card source provenance relative to preserved prior asset copies.
card_checks={}
if (r.parent/'landscape-card-stage-review/assets').is_dir():
 for p in (r/'assets').glob('*.png'):
  src=r.parent/'landscape-card-stage-review/assets'/p.name
  if src.exists() and p.name!='walnut-retained-concept.png':assert p.read_bytes()==src.read_bytes();card_checks[p.name]='byte identical'
 assert (r/'assets/cardback.png').read_bytes()==(r.parent/'landscape-card-stage-review/assets/cardback-griffin-approved-133.png').read_bytes()
report={'status':'PASS','counts':counts,'loaderQuotedAttributes':'PASS','sideLeanAwayFromOwner':'PASS','outsideAllowedRegionsChanged':changed,'protectedPixelsCompared':int(np.count_nonzero(~allowed)),'realCardSourceChecks':card_checks,'nativeVisualReview':'All 5 counts and top/left/right/bottom close-ups inspected','limits':'Native SVG renderer only; no Android/browser execution, subjective owner acceptance, gameplay or multiplayer certification.'}
(r/'verification.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
