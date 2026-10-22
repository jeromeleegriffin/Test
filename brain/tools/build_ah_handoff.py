#!/usr/bin/env python3
"""Build verified DOCS/CONTINUITY ONLY Griffin House of Rooks Master Brain AH handoff ZIP.
All game assets and active deployment remain in source repo / Cloudflare, unchanged."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from hashlib import sha256
from datetime import datetime, timezone
import html, json, os, sys

main = Path(sys.argv[1]).resolve()
work = Path(sys.argv[2]).resolve()
out = Path(sys.argv[3]).resolve()
out.mkdir(parents=True, exist_ok=True)
version = "AH"
zip_path = out / "Griffin_House_Master_Brain_AH_Complete_Handoff_20261021.zip"
pending = {}
def add(path, name):
    p = Path(path)
    if not p.is_file():
        raise RuntimeError(f"REQUIRED file missing: {p}")
    b = p.read_bytes()
    if name in pending:
        if pending[name] != b: raise RuntimeError("Duplicate different content: " + name)
        return
    pending[name] = b
def add_bytes(name, value):
    pending[name] = value if isinstance(value, bytes) else str(value).encode("utf-8")
def add_main(rel, dest=None):
    add(main / rel, dest or rel)
def add_work(rel, dest=None):
    add(work / rel, dest or "SOURCE_CODE_AND_RELEASE_EVIDENCE/" + rel)

# All versioned Master Brain TEXT, not just disconnected snippets. Most binary
# reference artwork stays on GitHub; selected actual-pixel authorities bundled below.
for root in sorted((main / "brain" / "versions").iterdir()):
    if not root.is_dir(): continue
    for p in sorted(root.rglob("*")):
        if p.is_file() and p.suffix.lower() in {".md",".txt",".json",".html",".js",".css",".csv",".xml"}:
            add(p, "HISTORICAL_MASTER_BRAINS/" + p.relative_to(main / "brain").as_posix())
# Master Brain entry/structure
for rel in [
 "brain/current.json", "brain/versions.json", "brain/brain-reader.js",
 "brain/brain.css", "brain/current/index.html", "brain/history.html"
]:
    add_main(rel, "CURRENT_PUBLISHED_BRAIN/" + rel)
# Owner-approved actual visual evidence, including the canonical H construction authorities.
hbase="brain/versions/H/files/02_VISUAL_REFERENCES/"
for filename in [
 "SCENE_INTEGRATED_SEATED_PLAYER_MASTER_REFERENCE_2026-10-05.png",
 "TABLE003_MASTER_TABLE_DESIGN_AUTHORITY_2026-10-05.png",
 "02_PREMIUM_BID_BOX_AUTHORITY.png",
 "11_CURRENT_REAL_PORTRAIT_BIDBOX_ACTIVE_AUTHORITY.jpg",
 "DEFAULT_NUMBERED_DECK_WORDS_2026-10-06.png",
 "ALT_NUMBERED_DECK_NO_WORDS_2026-10-06.png",
 "TABLE003_FINAL_CALIBRATION_VS_AUTHORITY_SOURCE_2026-10-05.png"
]:
    add_main(hbase + filename, "SELECTED_APPROVED_VISUAL_AUTHORITIES/" + filename)
for f in sorted((main / "brain/versions/AG/files/03_ACTUAL_SCREENS").glob("*")):
    if f.is_file():
        add(f,"ACTUAL_HISTORICAL_GAME_SCREENS/"+f.name)
# Comprehensive reference code, current source, QA and receipts
for rel in [
 "coordination/qa/CLOUDFLARE_ONLY_LIVE_RELEASE_20261021.md",
 "coordination/qa/NAMED_CLOUD_BOTS_LIVE_RECEIPT_20261021.md",
 "coordination/qa/CLOUDFLARE_STAGE_VERIFIED_20261021.md",
 "coordination/qa/CLOUDFLARE_LIVE_CUTOVER_PRECHECK_20261021.md",
 "coordination/qa/WEAK_CELLULAR_ARTWORK_RECOVERY_20261021.md",
 "coordination/qa/CLOUDFLARE_ONLY_MIGRATION_20261021.md",
 "coordination/qa/CLOUDFLARE_SINGLE_ORIGIN_ACCEPTANCE_20261021.md",
 "coordination/qa/ANDROID_ARTWORK_PREVIEW_LIVE_RECEIPT_20261021.md",
 "coordination/qa/CLOUDFLARE_STAGE_VERIFIED_20261021.md",
 "coordination/qa/CLOUDFLARE_ONLY_LIVE_RELEASE_20261021.md",
 "coordination/qa/cloudflare-native-build.sh",
 "coordination/qa/build-cloudflare-static.mjs",
 "coordination/qa/cloudflare-only-full-match-qa.mjs",
 "coordination/qa/named-cloud-bot-hosted-qa.mjs",
 "coordination/qa/named-cloud-bot-live-qa.mjs",
 "coordination/qa/named-cloud-bot-qa.mjs",
 "wrangler.cloudflare-only-live.jsonc",
 "wrangler.cloudflare-only-stage.jsonc",
 "cloudflare/live/worker-live.mjs",
 "asset-loading772.js",
]:
    add_work(rel)
# Historical full-online R10 records and governance
for rel in ["coordination/THREE_SITE_RELEASE_POLICY.md",
            "coordination/releases/full-online-x1-20261021/LIVE_RECEIPT.json",
            "coordination/BANKED_IDEAS_STATUS_20261021.md"]:
    add_main(rel,"INHERITED_RELEASE_POLICY/" + rel)
ahroot = main / "brain/versions/AH/files"
add(ahroot / "01_MASTER_BANK/MASTER_BRAIN_AH.md","MASTER_BRAIN_AH.md")
add(ahroot / "01_MASTER_BANK/MASTER_BRAIN_AH_ADDENDUM.md","MASTER_BRAIN_AH_ADDENDUM.md")
add(ahroot / "00_START_HERE/REPLACEMENT_CHAT_STARTUP_PROMPT.txt","REPLACEMENT_CHAT_STARTUP_PROMPT.txt")
add(ahroot / "00_START_HERE/START_HERE.md","START_HERE_AH.md")
add_main("brain/current.json","CURRENT_BRAIN_POINTER.json")
for filename in ["CHAT_CONTINUITY_RULE.md","COMPLETE_BANK_READING_RULE.md","PERMANENT_UI_VISUAL_VERIFICATION_RULE.md"]:
    add(ahroot / "01_MASTER_BANK"/filename,"PERMANENT_RULES/"+filename)

readfirst = """GRIFFIN HOUSE OF ROOKS — MASTER BRAIN AH COMPLETE HANDOFF
2026-10-21 — DOCUMENTATION / CONTINUATION ZIP, NOT A PLAYABLE GAME ZIP.

OPEN index.html AT ZIP ROOT to browse this collection.
For a fresh chat, paste the ENTIRE REPLACEMENT_CHAT_STARTUP_PROMPT.txt.
Read MASTER_BRAIN_AH.md FIRST, in FULL. It contains current AH decisions plus the FULL unchanged inherited AG Master Brain.
Follow PERMANENT_RULES verbatim and consult historical version docs, H visual authorities and recent Cloudflare release receipts.

LIVE GAME: https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/
LIVE WORKER: griffin-house-of-rooks-online, version 73aa7be6-9dc0-43ee-a267-20e9fe0f1c62.
LIVE ROOMDO NAMESPACE: bb1bf1c32b68451cbe5db6fee3066fa0 (unchanged).
FULL ONLINE X1: x1-online-v2. The live and staged code remain in Github Test branch work/asset-recovery-20261021.
APPROVED GAME ART PIN: 90078a710948c7643caafb18986e34dc71ce7cee.

CRITICAL NEW UNRESOLVED ISSUE: The owner observes Bots Shooting the Moon frequently.
This was NOT fixed. The online X1 v2 bidding path includes moon sampling and power >= 90 candidate logic.
Measure natural frequency and outcomes, compare online and offline, do NOT arbitrarily change AI/scoring.

Bot label FIX DEPLOYED: live Play With Friends no longer generates 'Test Bot 2/3/4' for new fills;
Dagger/Crow/Blaze used, collision avoiding, older room aliases client-side.
QA https://github.com/jeromeleegriffin/Test/actions/runs/39693134706 PASS.

Old GitHub Pages links NOT redirected; XP, achievements and PWA-origin offline-safe transfer PENDING.
Do not clear caches, delete rooms, regenerate visuals, or deploy old ZIPs to Cloudflare.
GitHub remains build/source-control backup; live browser runtime game assets are Cloudflare Static Assets.
Some production build source includes immutable GitHub URLs which are rewritten to ASSETS.fetch by
coordination/qa/build-cloudflare-static.mjs. SOURCE_CODE.../worker-live.mjs is PRE-BUILD source, not
the exact Cloudflare runtime JS output. Do not confuse them.

WHAT IS INSIDE:
- MASTER_BRAIN_AH.md, complete current plus inherited AG history
- AH addendum, exact permanent continuity/reading/actual-pixels rules and ready-to-paste chat prompt
- All historical readable Master Brain version documents H–AG (selected also A–G if present)
- Selected approved actual-pixel original reference images and AG screenshot evidence
- Native/Cloudflare runtime source and deployment scripts from active isolated branch (documentation/reference)
- Actual release receipts, CI evidence references, worker config and rollback
- All included files hashed and listed in MANIFEST.json / SHA256SUMS.txt
- CURRENT_BRAIN_POINTER.json from GitHub
This file intentionally does NOT contain the 211 MiB playable game assets. The complete immutable
native runtime and original artwork remain in the protected GitHub source and deployed Cloudflare.
DO NOT USE THIS ZIP IN GAME LOADER; root index.html is a documentation navigator, not playable index.
The pictured user-reported Test Bot screenshot can be additionally supplied in the chat; do not
reinterpret it as proof the current live version is still broken after testing.

IMPORTANT SOURCE HIERARCHY: Current AH addendum first for recent statuses, AG inside Master Brain
for inherited history, H founding/actual-asset authority for protected visuals. Every next chat
must obey all three rules verbatim and update the next Brain without destroying AG/AH.
"""
add_bytes("READ_FIRST.txt",readfirst)
links=[
 ("Master Brain AH — complete","MASTER_BRAIN_AH.md","AH current plus full AG"),
 ("Current AH addendum","MASTER_BRAIN_AH_ADDENDUM.md","Latest Cloudflare and outstanding issues"),
 ("Paste into next ChatGPT chat","REPLACEMENT_CHAT_STARTUP_PROMPT.txt","Self-contained replacement chat prompt"),
 ("README","READ_FIRST.txt","ZIP scope and restrictions"),
 ("Current pointer","CURRENT_BRAIN_POINTER.json","Current verified brain version"),
 ("Visual authority","SELECTED_APPROVED_VISUAL_AUTHORITIES/SCENE_INTEGRATED_SEATED_PLAYER_MASTER_REFERENCE_2026-10-05.png","Approved scene"),
 ("Latest named-bot receipt","SOURCE_CODE_AND_RELEASE_EVIDENCE/coordination/qa/NAMED_CLOUD_BOTS_LIVE_RECEIPT_20261021.md","Live successful patch"),
 ("All previous Master Brains","HISTORICAL_MASTER_BRAINS/versions/AG/files/01_MASTER_BANK/MASTER_BRAIN_AG.md","Full source AG"),
 ("Permanent chat continuity","PERMANENT_RULES/CHAT_CONTINUITY_RULE.md","Verbatim inherited rule")
]
parts=['<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
'<title>Griffin House of Rooks - Master Brain AH Handoff</title>',
'<style>body{background:#0b1726;color:#e8e0d1;font:17px/1.55 system-ui,sans-serif;max-width:830px;margin:auto;padding:22px}a{color:#e8bc6d}h1{font:36px Georgia,serif}h2{color:#d5b57c}li{margin:14px 0}small{color:#b7c5cb}.notice{border:1px solid #b6995e;padding:16px;border-radius:12px}strong{color:#f7da96}</style>',
'</head><body><h1>Griffin House of Rooks</h1><h2>Master Brain AH · October 21, 2026</h2>',
'<p class="notice"><strong>CONTINUATION HANDOFF ONLY.</strong> This ZIP is a document package with a root index.html navigator, NOT a playable game ZIP. Read the full Master Brain AH and paste the replacement-chat prompt into a new chat. The existing game and live rooms were not changed by this package.</p>',
'<p><strong>Current live Cloudflare game:</strong> <a href="https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/">Open game</a>.</p>',
'<p><strong>Open investigation:</strong> X1 bots have recently been Shooting the Moon unusually often; analyze frequency, not yet fixed.</p>',
'<h2>Start here</h2><ul>']
for label,href,description in links:
    parts.append(f'<li><a href="{html.escape(href,quote=True)}">{html.escape(label)}</a><br><small>{html.escape(description)}</small></li>')
parts.append('</ul><p>This archive includes a checksum manifest and historical Brain text. Approved game artwork and previous images are referenced and selected originals are included.</p></body></html>')
add_bytes("index.html","\n".join(parts))
manifest = {"project":"Griffin House of Rooks","brainVersion":"AH",
  "archiveType":"DOCUMENTATION_AND_SOURCE_HANDOFF_NOT_PLAYABLE",
  "created":"2026-10-21","currentLiveWorkerVersion":"73aa7be6-9dc0-43ee-a267-20e9fe0f1c62",
  "fileCount":len(pending),"files":[{"path":n,"bytes":len(b),"sha256":sha256(b).hexdigest()} for n,b in sorted(pending.items())],
  "verifiedSourceCommit":"90078a710948c7643caafb18986e34dc71ce7cee",
  "notIncluded":"Full playable game binary assets, private tokens and unlisted binary history."
}
add_bytes("MANIFEST.json",json.dumps(manifest,indent=2,ensure_ascii=False)+"\n")
checks="".join(f"{sha256(data).hexdigest()}  {name}\n" for name,data in sorted(pending.items()))
add_bytes("SHA256SUMS.txt",checks)
with ZipFile(zip_path,"w",ZIP_DEFLATED,compresslevel=7,allowZip64=True) as z:
    for name,data in sorted(pending.items()):
        z.writestr(name,data)
with ZipFile(zip_path) as z:
    names=set(z.namelist())
    assert "index.html" in names and "MASTER_BRAIN_AH.md" in names and "REPLACEMENT_CHAT_STARTUP_PROMPT.txt" in names
    assert "MANIFEST.json" in names and "READ_FIRST.txt" in names
    assert z.testzip() is None
    assert len(names)==len(pending)
print("OUTPUT_FILE="+str(zip_path))
print("ARCHIVE_FILES="+str(len(pending)))
print("ARCHIVE_BYTES="+str(zip_path.stat().st_size))
print("MASTER_BRAIN_AH_SHA256="+sha256(pending['MASTER_BRAIN_AH.md']).hexdigest())
print("MASTER_BRAIN_AH_BYTES="+str(len(pending['MASTER_BRAIN_AH.md'])))
print("PROMPT_BYTES="+str(len(pending['REPLACEMENT_CHAT_STARTUP_PROMPT.txt'])))
print("DOC_ARCHIVE_VERIFIED=PASS")
