from pathlib import Path
import hashlib,json,difflib,re,subprocess
b=Path('repair712/baseline');c=Path('repair712/Rook712');e=Path('repair712/evidence')
changed=[];patch=''
for p in b.rglob('*'):
 if not p.is_file():continue
 rel=p.relative_to(b);q=c/rel;assert q.exists()
 if p.read_bytes()!=q.read_bytes():
  changed.append(str(rel));patch+=''.join(difflib.unified_diff(p.read_text().splitlines(True),q.read_text().splitlines(True),fromfile='R711/'+str(rel),tofile='R712/'+str(rel)))
assert sorted(changed)==sorted(['index.html','game.js','style.css','sw.js','hor-version.js','approved-bid-portrait.js'])
(e/'EXACT_DIFF.patch').write_text(patch)
for p in c.glob('*.js'):subprocess.run(['node','--check',str(p)],check=True,capture_output=True)
html=(c/'index.html').read_text();sw=(c/'sw.js').read_text();g=(c/'game.js').read_text();old=(b/'game.js').read_text()
refs=re.findall(r'(?:src|href)="([^"#]+)"',html);local=[s for s in refs if not re.match(r'(https?:|data:|mailto:)',s)];missing=[s for s in local if not(c/s.split('?')[0]).exists()];assert not missing,missing
shell=re.findall(r"'\./([^']*)'",sw[:sw.index("self.addEventListener")]);assert all(not s or (c/s.split('?')[0]).exists() for s in shell)
assert all(s in shell for s in ['approved-bid-portrait.js?v=712','approved-bid-portrait.css?v=712','assets/bidbox-approved/bidbox_complete_blank.png?v=712'])
for s in local:
 if s.split('?')[0].endswith(('.js','.css')):assert '?v=712' in s,s
assert "var BUILD = '712'" in html and "sw.js?v=712" in html and "const APP_VERSION = '712'" in g
assert '--r706-human-top' not in (c/'style.css').read_text()
a=old.index("bindClick('btnToggleTopOpts', () => {");z=old.index('\n(function restoreTopOpts()',a);assert old[a:z] in g
# Verify only the targeted style deletion; therefore every landscape CSS byte retained.
removed="@media(orientation:portrait){\n body.r706-bid-open #slot-me{position:fixed!important;top:var(--r706-human-top)!important;bottom:auto!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;margin:0!important}\n}\n"
assert (b/'style.css').read_text().replace(removed,'')==(c/'style.css').read_text()
results={'changed_files':changed,'syntax':'PASS all root JS','local_html_references':'PASS','shell_paths':'PASS','runtime_versions':'PASS','menu_handler_byte_identical':True,'landscape_css_unchanged':True,'approved_artwork_byte_identical':True,'all_other_baseline_files_byte_identical':True,'browser_runtime':'NOT AVAILABLE','physical_phone':'PENDING','geometry_coexistence':'PENDING runtime inspection'}
(e/'VERIFICATION.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
