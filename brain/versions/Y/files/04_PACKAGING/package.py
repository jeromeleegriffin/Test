#!/usr/bin/env python3
"""Fail-closed, byte-preserving isolated packager. No source writes, no network."""
import argparse,pathlib,json,hashlib,zipfile,sys,tempfile,os

def digest(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
def main():
 a=argparse.ArgumentParser();a.add_argument('--source',required=True);a.add_argument('--manifest',required=True);a.add_argument('--output',required=True);a.add_argument('--validate-only',action='store_true');args=a.parse_args()
 root=pathlib.Path(args.source).resolve();out=pathlib.Path(args.output).resolve();m=json.loads(pathlib.Path(args.manifest).read_text());records=m['files'];expected={r['path']:r for r in records}
 if len(expected)!=len(records):raise ValueError('Duplicate manifest paths')
 actual=set()
 for p in root.rglob('*'):
  if p.is_symlink():raise ValueError('Symlink not allowed: '+str(p))
  if p.is_file():actual.add(p.relative_to(root).as_posix())
 if actual!=set(expected):raise ValueError('Unreviewed or missing source files: '+str({'unexpected':sorted(actual-set(expected)),'missing':sorted(set(expected)-actual)}))
 for n,r in expected.items():
  p=pathlib.PurePosixPath(n)
  if p.is_absolute() or '..' in p.parts or '\\' in n:raise ValueError('Unsafe path '+n)
  if r['classification'] not in 'ABCDEF' or not isinstance(r['include'],bool):raise ValueError('Invalid disposition '+n)
  if r['classification'] in 'AF' and not r['include']:raise ValueError('Runtime/unknown cannot be excluded '+n)
  if digest(root/n)!=r['sha256'] or (root/n).stat().st_size!=r['size']:raise ValueError('Unreviewed content change '+n)
 keep=[r for r in records if r['include']]
 # All approved dependency edges must remain in the retained set.
 kn={r['path'] for r in keep}
 for n in m.get('required_paths',[]):
  if n not in kn:raise ValueError('Missing required dependency '+n)
 if args.validate_only:print(json.dumps({'validated':True,'files':len(records),'retained':len(keep)}));return
 if out.exists() or out.with_suffix('.manifest.json').exists():raise ValueError('Output already exists; originals are never overwritten')
 out.parent.mkdir(parents=True,exist_ok=True)
 fd,tmp=tempfile.mkstemp(prefix=out.name+'.',suffix='.partial',dir=out.parent);os.close(fd)
 try:
  with zipfile.ZipFile(tmp,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
   for r in sorted(keep,key=lambda x:x['path']):
    info=zipfile.ZipInfo(r['path'],(2026,10,12,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,(root/r['path']).read_bytes(),compresslevel=9)
  with zipfile.ZipFile(tmp) as z:
   if z.testzip() is not None:raise ValueError('ZIP CRC failure')
   for r in keep:
    if hashlib.sha256(z.read(r['path'])).hexdigest()!=r['sha256']:raise ValueError('ZIP content mismatch')
  os.rename(tmp,out)
 except Exception:
  if os.path.exists(tmp):os.unlink(tmp)
  raise
 receipt={'filename':out.name,'sha256':digest(out),'zip_bytes':out.stat().st_size,'uncompressed_bytes':sum(r['size'] for r in keep),'entry_count':len(keep),'baseline_sha256':m['baseline_zip_sha256'],'manifest_sha256':digest(pathlib.Path(args.manifest)),'files':keep}
 out.with_suffix('.manifest.json').write_text(json.dumps(receipt,indent=2));print(json.dumps({k:v for k,v in receipt.items() if k!='files'}))
if __name__=='__main__':
 try:main()
 except Exception as e:print('STOP: '+str(e),file=sys.stderr);sys.exit(1)
