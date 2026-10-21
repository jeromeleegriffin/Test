# Griffin House of Rooks — canonical single-origin Cloudflare checkpoint
Date: 2026-10-21
Status: ALREADY_WORKING_ON_EXISTING_LIVE_CLOUDFLARE_HOST; NO DEPLOYMENT PERFORMED
Original landing art and geometry must remain unchanged. Do not replace with a lightweight chooser.

## Canonical address
https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/

This existing Worker already serves the R10 native game from its original approved index.html, injects the Cloudflare room adapter into that same document, and proxies each native asset under /cloud-game/assets/ on the **same browser origin**. The Worker points to immutable GitHub source SHA 90078a710948c7643caafb18986e34dc71ce7cee, with the online X1 v2 Worker deployed separately. The asset bytes are NOT yet independently stored wholly inside Cloudflare: the edge currently fetches the pinned GitHub source as origin and caches it.

## Confirmed independent smoke QA
Workflow: https://github.com/jeromeleegriffin/Test/actions/runs/39673979516
Status SUCCESS

In hosted Chromium at 390x844:
- Native approved "House of Rooks" screen present and native landing menu/button present.
- Cloud client injected; asset base is https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/cloud-game/assets/.
- Opening the canonical Worker loads ONE page document.
- Tap Play With Friends: native Cloudflare create-room action invoked by POST /rooms (request intercepted before reaching Worker, so no live room was created), same origin, navigation count remains ONE, zero page JS errors.
- Native offline Play Now started an actual 10-card hand at the very same Cloudflare origin. Navigation count remained ONE; at least 9/10 images decoded at the measurement point. No hosted room action from the offline mode.
- No direct browser fetch to raw.githubusercontent.com; Worker handles source proxying at the edge.

This demonstrates *no second full-game page navigation when selecting a mode from the canonical Worker*. It does not promise zero re-fetches across new sessions/tabs and does not establish first-load performance, cold Android offline readiness or physical mobile cellular roaming.

## Active deployment verified (read-only)
Live Worker griffin-house-of-rooks-online:
Deployment a319e805-c76c-462b-a18b-c59498a188d9
Version f9fd3cd5-67a1-49ae-850d-7c2ca60c1ad7, traffic 100%.
No live changes needed or made to prove single-origin behavior. The separate artwork recovery Worker remains a QA-only prototype.

## Preservation and next stage
- Do NOT redirect GitHub Pages to the live Worker without testing and owner approval: that can break protected native installed/offline PWA behavior.
- The work/asset-recovery-20261021 fix to asset-loading772.js has **not** been integrated into the live Worker. Do not imply the canonical multiplayer Worker has the repair before a coordinated release.
- Source of truth brain/current.json remains AG R10 X1 v2; do not rewrite old release receipts.
- To host **all binaries physically** on Cloudflare (not just proxy through Cloudflare), plan a separate audited static-assets/R2 migration with exact source manifest/hashes, cache strategy, correct MIME, large asset sizing and quota check, and rollback. Store assets under same Cloudflare origin and keep /rooms and auth/DO logic intact.
- Cloudflare Worker currently disables SW registration on the integrated page, therefore cold-start offline and installed app cache migration are distinct release gates.
- Owner-approved visuals including loading art, geometry, sound and bid controls are locked. Never redesign the landing merely to reduce downloads.

## Owner use
Enter directly at the canonical Worker URL, not the extra artwork-preview hostname or GitHub Pages first. This gets the proven same-page Play With Friends and offline Play Now paths. The QA-only separate test remains for the unreleased weak-network art fix. This is the safe immediate single-load solution.
