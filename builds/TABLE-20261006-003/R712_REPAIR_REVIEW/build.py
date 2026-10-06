from pathlib import Path
import shutil,re
b=Path('repair712/baseline');c=Path('repair712/Rook712');shutil.copytree(b,c,dirs_exist_ok=True)
Path('repair712/evidence/PREFLIGHT.txt').write_text('GOAL: R711-only runtime identity/cache coherence, portrait bottom-seat ownership removal, preserve proven menu. BOUNDARIES: no gameplay/card/back/avatar/table/landscape redesign or data reset. EXECUTION: baseline hashed; asset present; identity 706; new portrait assets absent from shell; install failures suppressed; cache lookup falls back to leaf name; cache retirement unscoped; portrait seat CSS and human-top calculation located; protected hamburger patch confirmed. No browser available; actual phone failure cause and geometry coexistence pending runtime.\n')
p=c/'index.html';s=p.read_text().replace("var BUILD = '706';","var BUILD = '712';")
s=re.sub(r'([?&]v=)(706|650)(?=[\"\'])',r'\g<1>712',s)
s=s.replace('<link href="style.css?v=712"','<script src="hor-version.js?v=712"></script>\n<link href="style.css?v=712"')
s=s.replace('href="approved-bid-portrait.css"','href="approved-bid-portrait.css?v=712"').replace('src="approved-bid-portrait.js"','src="approved-bid-portrait.js?v=712"');p.write_text(s)
p=c/'game.js';s=p.read_text().replace("const APP_VERSION = String(window.HOR_PAGE_BUILD || '706');","const APP_VERSION = '712';\nwindow.HOR_SCRIPT_BUILD = APP_VERSION;")
a=s.index("        // Containment and translated avatar/name descendants")
z=s.index("        try{positionSeatBidBadges();",a)
old=s[a:z]
s=s[:a]+"        // Portrait bidding never owns the locked human seat position.\n        // Preserve the inherited landscape measurement path.\n        if(!matchMedia('(orientation:portrait)').matches){\n"+''.join('  '+line+'\n' for line in old.rstrip().splitlines())+"        }\n"+s[z:];p.write_text(s)
p=c/'style.css';s=p.read_text();rule="@media(orientation:portrait){\n body.r706-bid-open #slot-me{position:fixed!important;top:var(--r706-human-top)!important;bottom:auto!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;margin:0!important}\n}\n";assert s.count(rule)==1;s=s.replace(rule,'');p.write_text(s)
p=c/'approved-bid-portrait.js';s=p.read_text().replace("art.src = 'assets/bidbox-approved/bidbox_complete_blank.png';","art.src = 'assets/bidbox-approved/bidbox_complete_blank.png?v=712';");p.write_text(s)
p=c/'hor-version.js';p.write_text('''// Griffin House of Rooks — R712 runtime marker, no gameplay ownership.
window.HOR_LIVE_VERSION = 712;
window.HOR_BUILD = 712;
window.GHR_BUILD = "Rook712";
window.HORRuntimeTruth = async function () {
  const controller = navigator.serviceWorker && navigator.serviceWorker.controller;
  const worker = controller ? await new Promise(resolve => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve(null), 2000);
    channel.port1.onmessage = e => { clearTimeout(timer); channel.port1.close(); resolve(e.data); };
    controller.postMessage({type:'HOR_BUILD_QUERY'}, [channel.port2]);
  }) : null;
  return {page:window.HOR_PAGE_BUILD, script:window.HOR_SCRIPT_BUILD,
    marker:window.HOR_BUILD, worker, controller:controller && controller.scriptURL,
    coherent:window.HOR_PAGE_BUILD === '712' && window.HOR_SCRIPT_BUILD === '712' &&
      window.HOR_BUILD === 712 && !!worker && worker.build === '712' &&
      worker.cache === 'house-of-rooks-v712'};
};
''')
p=c/'sw.js';s=p.read_text().replace("const CACHE = 'house-of-rooks-v706';","const BUILD = '712';\nconst CACHE = 'house-of-rooks-v712';")
s=re.sub(r'\?v=(706|599)', '?v=712',s)
s=s.replace("  './hor-version.js',","  './hor-version.js',\n  './hor-version.js?v=712',\n  './approved-bid-portrait.js?v=712',\n  './approved-bid-portrait.css?v=712',\n  './assets/bidbox-approved/bidbox_complete_blank.png?v=712',\n  './assets/bidbox-approved/asset_map.json',\n  './assets/images/wait-nest-portrait.jpg?v=712',\n  './assets/images/wait-trump-portrait.jpg?v=712',\n  './assets/images/wait-nest-landscape.jpg?v=712',\n  './assets/images/wait-trump-landscape.jpg?v=712',")
s=s.replace("c.addAll(SHELL).catch(() => {})","c.addAll(SHELL)")
s=s.replace("keys.filter((k) => k !== CACHE)","keys.filter((k) => /^house-of-rooks-v\\d+$/.test(k) && k !== CACHE)")
# Preserve full relative paths on query-stripped cache fallback: never cross-match equal filenames.
a=s.index('  const leaf =');z=s.index("\nself.addEventListener('fetch'",a)
s=s[:a]+'''  url.search = '';
  url.hash = '';
  return caches.open(CACHE).then(async c => {
    const hit = await c.match(request);
    if (hit) return hit;
    if (url.pathname.endsWith('/')) return c.match(new URL('index.html', url).href);
    return c.match(url.href);
  });
}
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'HOR_BUILD_QUERY' && e.ports[0]) {
    e.ports[0].postMessage({build:BUILD, cache:CACHE});
  }
});
''' +s[z:]
p.write_text(s)
print('Created Rook712 from supplied R711')
