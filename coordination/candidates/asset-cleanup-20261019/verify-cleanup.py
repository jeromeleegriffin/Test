"""Verify retained pixels/audio/rules, retired-file removal and static dependencies."""
from pathlib import Path
import json,hashlib,subprocess,re
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'coordination/candidates/asset-cleanup-20261019'
def run():
 removals=json.loads((OUT/'REMOVALS.json').read_text());deleted={x['path'] for x in removals['files']}
 manifest=json.loads((ROOT/'coordination/releases/846-cleanup/SOURCE_MANIFEST.json').read_text())
 protected=[]; css=[]
 base_css=json.loads((OUT/'BASE_CSS.json').read_text())['files']
 for item in manifest:
  path=item['path']; p=ROOT/path
  keep=path.startswith(('assets/','voices/','x1/','vendor/')) or path in ['bots.js','rules.js','career-core.js','qrcode845.js'] or ('/' not in path and path.endswith('.css'))
  if not keep or path in deleted:continue
  assert p.is_file(),path
  assert hashlib.sha256(p.read_bytes()).hexdigest()==base_css.get(path,item['sha256']),path
  protected.append(path)
  if path.endswith('.css') and '/' not in path:css.append(path)
 for path in deleted: assert not (ROOT/path).exists(),path
 scripts=list(ROOT.glob('*.js'))
 for p in scripts:subprocess.run(['node','--check',str(p)],check=True,capture_output=True)
 worker=(ROOT/'sw060.js').read_text(); shell=worker.split('const SHELL = [',1)[1].split('];',1)[0]
 paths=re.findall(r"['\"](\./[^'\"]*)['\"]",shell)
 assert len(paths)==len(set(paths))
 for path in paths:assert (ROOT/(path[2:] or 'index.html')).exists(),path
 for path in deleted:assert './'+path not in paths,path
 html=(ROOT/'index.html').read_text()
 for path in re.findall(r'<(?:script|link)\b[^>]*\b(?:src|href)=[\"\']([^\"\']+)',html):
  if re.match(r'^(https?:|data:|//)',path):continue
  assert (ROOT/path.split('?')[0].split('#')[0]).is_file(),path
 report=dict(status='PASS',removedFiles=len(deleted),removedBytes=removals['bytesRemoved'],protectedRemainingFilesByteEqual=len(protected)-len(css),allRootCssFilesByteEqual=len(css),rootJsSyntaxChecked=len(scripts),precachePaths=len(paths),browserMatchesCompleted=0,deliveryBlockedUntilFiveCompleteMatches=True)
 (OUT/'PRESERVATION_CHECK.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps(report,indent=2))
if __name__=='__main__':run()
