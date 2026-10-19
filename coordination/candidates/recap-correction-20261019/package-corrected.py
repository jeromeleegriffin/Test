"""Package the consolidated runtime without overwriting an earlier delivered archive."""
from pathlib import Path
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parents[3]
EVIDENCE = ROOT / "coordination/candidates/house-effects-v12-20261019"
DEST = ROOT.parent / "delivery/Griffin_House_Consolidated_Corrected_20261019.zip"
RUNTIME = "e46eddf2a11a887b2f1eaf891b3b6028c8ab2c38"
files = {}
for path in ROOT.iterdir():
    if (path.is_file() and path.suffix in {".js", ".css", ".html", ".png"}
            and path.name != "GriffinHousePlayer.html") or path.name == "manifest.json":
        files[path.name] = path.read_bytes()
for folder in ["assets", "voices", "vendor", "x1"]:
    for path in (ROOT / folder).rglob("*"):
        relative = path.relative_to(ROOT)
        if path.is_file() and not any(part.startswith(".") for part in relative.parts):
            files[str(relative)] = path.read_bytes()

files["READ_FIRST.txt"] = ("""GRIFFIN HOUSE OF ROOKS — CONSOLIDATED GAME REVIEW

This is the consolidated October 19, 2026 game: recovered Build 845 lineage,
professional source cleanup, beginner-experience repairs, reviewed unused-asset
removal, preview canvas repair, and the supplied approved House Effects v12.
It is an unnumbered owner-review candidate, not a deployment or new visual approval.

Runtime source: e46eddf2a11a887b2f1eaf891b3b6028c8ab2c38
Repository: JeromeLeeGriffin/Test
Branch: candidate/house-effects-v12-consolidation-20261019
Runtime identity: consolidated-recap-review-20261019

OPEN THE GAME
Use this ZIP with your game ZIP loader. Root index.html is the complete game.
On a computer, it can also be served from a local HTTP server. The included
GriffinHouseZipReview.html is a safe review loader: open it through a local
HTTP server, choose OPEN ONE ZIP, and select this archive. It does not clear
careers, preferences, caches or service workers. Browser ZIP previews skip
service-worker registration; normal hosted offline upgrades are separate tests.

WHAT IS PRESERVED
Approved room/table/avatars/cards/Bid Dock/Moon/trump artwork, existing card sizes,
current voices, rules, X1 intelligence and career evaluation remain intact.
The three end-of-hand effects rotate in a shuffled bag and use the provided
art/sounds; Final Trick uses recorded cards rather than the preview sample hand.
Skip is available, reduced-motion is respected, and the scoreboard has a bounded
completion path even if audio cannot play.

DOCUMENTATION AND VERIFICATION
HANDOFF contains the complete continuity file, actual Master Brain AF, a current
consolidation supplement, source/input manifests, and earlier acceptance evidence.
Those documents are the source checkpoint frozen when this archive was packaged.
The recap totals and winning-team highlight selection are corrected in this archive.
The final test receipt for this exact archive is recorded separately on the source
branch at coordination/candidates/recap-correction-20261019/FINAL_PACKAGE_CHECKPOINT.json.
Delivery requires five completed matches on these unchanged ZIP bytes. No previous
source-preview match or earlier cleanup ZIP match is substituted for that gate.
PACKAGE_MANIFEST.json records every payload file's SHA-256 and size.

OPEN ITEMS
Physical Android appearance/audio/fullscreen/share and real WAN multiplayer are
separate acceptance checks. The owner's reported portrait card-size difference
remains open; no guessed resizing was applied. Current audio provenance is supplied
as historical source records, not a new legal clearance certification. Automatic
claim/guest final-card position registration requires further acceptance.
Neither live server is updated by opening this ZIP. Deployment requires explicit
owner approval. Historical archives and previously delivered ZIPs remain preserved.
""").encode()

handoff = ROOT / "brain/candidates/house-effects-v12-20261019/COMPREHENSIVE_HANDOFF.txt"
files["HANDOFF/COMPREHENSIVE_HANDOFF.txt"] = handoff.read_bytes()
files["HANDOFF/MASTER_BRAIN_AF.md"] = (ROOT / "brain/versions/AF/files/01_MASTER_BANK/MASTER_BRAIN_AF.md").read_bytes()
files["HANDOFF/CONSOLIDATED_MASTER_BRAIN_CHECKPOINT.md"] = (ROOT / "coordination/candidates/recap-correction-20261019/MASTER_BRAIN_CHECKPOINT.md").read_bytes()
for name in ["INPUT_ASSETS.json", "CONSOLIDATION_RESULTS.json", "LIFECYCLE_RESULTS.json"]:
    files["HANDOFF/" + name] = (EVIDENCE / name).read_bytes()
files["HANDOFF/UNUSED_ASSET_REMOVALS.json"] = (ROOT / "coordination/candidates/asset-cleanup-20261019/REMOVALS.json").read_bytes()

files["HANDOFF/RECAP_CORRECTIONS.json"] = (ROOT / "coordination/candidates/recap-correction-20261019/SOURCE_RESULTS.json").read_bytes()
files["HANDOFF/PREVIOUS_CONSOLIDATED_ZIP_TESTS.json"] = (EVIDENCE / "FINAL_ZIP_BROWSER_RESULTS.json").read_bytes()

manifest = [{"path": name, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}
            for name, data in sorted(files.items())]
manifest_bytes = (json.dumps(manifest, indent=2) + "\n").encode()
files["PACKAGE_MANIFEST.json"] = manifest_bytes
DEST.parent.mkdir(exist_ok=True)
assert not DEST.exists(), "Preserve the existing package; do not overwrite tested bytes."
with zipfile.ZipFile(DEST, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for name, data in sorted(files.items()):
        entry = zipfile.ZipInfo(name, (2026, 10, 19, 0, 0, 0))
        entry.compress_type = zipfile.ZIP_DEFLATED
        entry.external_attr = 0o100644 << 16
        archive.writestr(entry, data, compresslevel=9)
with zipfile.ZipFile(DEST) as archive:
    assert archive.testzip() is None
    assert "index.html" in archive.namelist()
    for entry in manifest:
        assert hashlib.sha256(archive.read(entry["path"])).hexdigest() == entry["sha256"], entry["path"]
receipt = {"filename": DEST.name, "bytes": DEST.stat().st_size,
           "sha256": hashlib.sha256(DEST.read_bytes()).hexdigest(), "entries": len(files),
           "uncompressedBytes": sum(map(len, files.values())), "runtimeCommit": RUNTIME,
           "manifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
           "zipCrcAndEveryEntryHashVerified": True, "requiredMatches": 5,
           "completedMatches": 0, "status": "FROZEN_PENDING_EXACT_ZIP_TESTS",
           "liveDeployed": False}
(ROOT / "coordination/candidates/recap-correction-20261019/FINAL_PACKAGE_CHECKPOINT.json").write_text(json.dumps(receipt, indent=2) + "\n")
print(json.dumps(receipt, indent=2))
