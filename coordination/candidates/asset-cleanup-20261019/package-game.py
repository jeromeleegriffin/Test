"""Build one deterministic game ZIP; exclude archives, development tools and evidence."""
from pathlib import Path
import json,hashlib,zipfile
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'coordination/candidates/asset-cleanup-20261019'
DEST=ROOT.parent/'delivery'
DEST.mkdir(exist_ok=True)
paths=[]
for p in ROOT.iterdir():
 if p.is_file() and (p.suffix in {'.js','.css','.html','.png'} or p.name=='manifest.json') and p.name!='GriffinHousePlayer.html':paths.append(p)
for folder in ['assets','voices','vendor','x1']:
 paths += [p for p in (ROOT/folder).rglob('*') if p.is_file()]
files={str(p.relative_to(ROOT)):p.read_bytes() for p in sorted(set(paths))}
files['READ_FIRST.txt']=('GRIFFIN HOUSE OF ROOKS — CLEANED REVIEW CANDIDATE\n\nRuntime: asset-cleanup-review-20261019\nSource branch: JeromeLeeGriffin/Test candidate/asset-cleanup-20261019\n\nThis package retains the beginner-experience repairs and removes reviewed unused scene variants, mockups and older voice packs. Active artwork, card sizes, current voices, game rules, AI and career data are preserved.\n\nOpen index.html from a local HTTP server, or open GriffinHouseZipReview.html and select this ZIP. The review loader does not clear careers, service workers or caches. A hosted server is required for normal service-worker installation; a ZIP preview skips registration.\n\nNeither live site is updated by opening this package. It is an owner-review candidate. Physical Android appearance, native sharing and real WAN multiplayer are separate acceptance checks. The owner-reported portrait difference remains unresolved; no portrait resize was applied.\n\nRemoval evidence, complete handoff and match-test receipt are retained under coordination/candidates/asset-cleanup-20261019 in the source branch. Before promoting, review the latest receipt and obtain explicit deployment approval.\n').encode()
manifest=[dict(path=p,bytes=len(data),sha256=hashlib.sha256(data).hexdigest()) for p,data in sorted(files.items())]
files['PACKAGE_MANIFEST.json']=(json.dumps(manifest,indent=2)+'\n').encode()
archive=DEST/'Griffin_House_Cleaned_Review_20261019.zip'
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for path,data in sorted(files.items()):
  item=zipfile.ZipInfo(path,(2026,10,19,0,0,0));item.compress_type=zipfile.ZIP_DEFLATED;item.external_attr=0o100644<<16
  z.writestr(item,data,compresslevel=9)
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 assert z.namelist()[0] and 'index.html' in z.namelist()
 for item in manifest:assert hashlib.sha256(z.read(item['path'])).hexdigest()==item['sha256'],item['path']
receipt=dict(filename=archive.name,localPath=str(archive),bytes=archive.stat().st_size,sha256=hashlib.sha256(archive.read_bytes()).hexdigest(),files=len(files),uncompressedBytes=sum(len(b) for b in files.values()),gameManifestSha256=hashlib.sha256(files['PACKAGE_MANIFEST.json']).hexdigest(),zipCrcAndEveryFileHashVerified=True,matchesRequired=5,matchesCompleted=0,deliveryStatus='HELD_PENDING_EXACT_ZIP_GAMEPLAY_TEST',liveDeployed=False)
(OUT/'ZIP_CHECKPOINT.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps(receipt,indent=2))
