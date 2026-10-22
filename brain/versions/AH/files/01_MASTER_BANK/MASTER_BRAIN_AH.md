# Griffin House of Rooks — MASTER BRAIN AH
## Authoritative current checkpoint: 2026-10-21, after Cloudflare-only cutover and live bot-label repair

**AH supersedes AG only for the newer facts explicitly recorded here.** The entire AG Master Brain is reproduced after this AH checkpoint as historical/inherited context. Never interpret older statements that Cloudflare still needs GitHub at runtime, online bots are simple non-X1 bots, or the three game servers were updated together as the *current* status. Those statements applied to earlier releases. Brain H through AG, the protected original art, previous releases and permanent continuity rules remain intact.

### Single highest-priority current status
- **LIVE GAME:** https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/
- **Current authoritative runtime:** native 846-r10-ambience-levels-20261021, same approved R10 table, cards, avatars, sounds, original landing, landscape/portrait and game mechanics. Cloudflare-only runtime asset delivery, full online X1 v2 and native offline play on the same Cloudflare origin.
- **Latest live Cloudflare Worker:** griffin-house-of-rooks-online; VERSION 73aa7be6-9dc0-43ee-a267-20e9fe0f1c62; DEPLOYMENT 3bfee3a0-9f9c-4fb3-9725-490459c320ee, 100% traffic. Verified directly through Cloudflare API after bot-name deployment and a successful live hosted test.
- **Live RoomDO SQLite namespace:** bb1bf1c32b68451cbe5db6fee3066fa0, preserved; **ENTRY_LIMIT** 14784620261020 and **ACTION_LIMIT** 14784620261021 preserved; secret TEST_GATE_KEY retained. Compatibility date 2026-10-14. Do not reset/rename/transfer rooms or private tokens.
- **Most recent rollback:** previous Cloudflare-only version 8b220d87-1d24-4c13-88ad-368c858445b9, deployment 47148f9e-8ad2-443f-b871-72536dc4b13a. Pre-Cloudflare-asset rollback f9fd3cd5-67a1-49ae-850d-7c2ca60c1ad7. Rollback = deploy existing historical version to 100% via the same live Worker, NEVER reset its Durable Object storage.
- **Latest named-bot source branch:** JeromeLeeGriffin/Test, work/asset-recovery-20261021, fix commit 2fac081f2a827b4bfe7c94a48396ba326fd93237, full branch subsequently includes extensive QA documentation. The actual LIVE Cloudflare deployment source in use has the named-bot patch. Test/main and Griffin-House-of-Rooks/main were NOT redeployed for this change. Do not blindly build from main or older ZIP.
- **Current Brain update is documentation-only.** Do not infer a new game binary has been deployed merely from updating this Brain.

### Owner-authorized hosting direction, and why historical three-site policy is no longer literal
Owner authorized moving the game to Cloudflare directly, and confirmed Cloudflare gameplay appears to work. Cloudflare Static Assets now physically host the game files. The browser no longer goes from one GitHub host into a second multiplayer host to load the same game twice. Source/version control and future build preparation still use GitHub; game delivery at runtime does not require raw GitHub requests.
The old three-site release policy in coordination/THREE_SITE_RELEASE_POLICY.md was genuine historical authority. However, on October 21 the owner explicitly elected Cloudflare-only primary hosting and later asked to forward people with OLD GitHub URLs. For now the old GitHub Pages URLs are preserved and serve their old offline-capable R10 versions:
- https://jeromeleegriffin.github.io/Test/
- https://jeromeleegriffin.github.io/Griffin-House-of-Rooks/
DO NOT claim these are now identical to the Cloudflare-only live Worker. Before modifying GitHub Pages, make a migration/redirect plan preserving local XP, achievements, profiles, settings, offline cache and installed shortcuts. An existing Android installed PWA cannot have its origin silently changed; ordinary online bookmarks/links can redirect. Do not clear/delete existing service workers or switch offline-only players to a page that requires internet. Cross-origin localStorage does NOT transfer through a 302/JS redirect. Owner was advised to build export/transfer and rollback before activating redirects; no redirect currently deployed.

### Cloudflare-only static migration, successfully completed
- 1,634 approved native runtime files, about 211.05 MiB, packaged in Cloudflare Workers Static Assets; 1,472 service-worker shell paths fully accounted for in build audit. Wrangler enumerated 1,805 asset entries, not a claim about original unique game assets.
- Approved immutable source pin for original artwork/HTML: JeromeLeeGriffin/Test SHA 90078a710948c7643caafb18986e34dc71ce7cee. The isolated artwork retry repair in asset-loading772.js was included. Original static artwork was not regenerated or replaced by CSS. High-DPI Black Bird, Red Two, numbered cards, Bid Box graphics, physical table art, voices and audio returned correct types/bytes from Cloudflare.
- Cloudflare worker script includes full X1 online v2. Exactly TWO original pinned GitHub index fetches and ONE GitHub asset proxy were changed to env.ASSETS.fetch. Direct inspection of deployed live Worker confirmed ASSETS.fetch present, no raw.githubusercontent.com reference, X1 and RoomDO still present. Cloudflare Builds itself accesses GitHub at BUILD time; no claim GitHub can be deleted as source control.
- Build source: coordination/qa/cloudflare-native-build.sh and coordination/qa/build-cloudflare-static.mjs; Worker: cloudflare/live/worker-live.mjs; protected live Wrangler config: wrangler.cloudflare-only-live.jsonc; isolated stage config: wrangler.cloudflare-only-stage.jsonc. Build uses immutable base plus isolated branch, and Cloudflare's existing native Builds token and manually initiated build trigger; NO GitHub Actions API token required.
- Live cutover Cloudflare Builds run 90580151-e1a5-4993-8e83-bc80376f6efc; original Cloudflare-only version 8b220d87-1d24-4c13-88ad-368c858445b9 at 100%; later named-bot version 73aa7be6-9dc0-43ee-a267-20e9fe0f1c62 at 100%.
- The production RoomDO was declared as an existing durable-object export with storage sqlite, without a new migration or namespace; exact rate limiter IDs/secret compared before and after. Production deploy is through MANUAL-ONLY Cloudflare Build trigger ab50e26c-4a2b-4782-9372-2f29a7009199, filtered against a deliberately nonexistent file so routine pushes do not deploy live.
- AUTHORITATIVE CLOUDFARE RELEASE RECEIPT: coordination/qa/CLOUDFLARE_ONLY_LIVE_RELEASE_20261021.md in work/asset-recovery-20261021.
- Stage: https://griffin-rooks-cloud-only-stage.jeromeleegriffin.workers.dev/ with separate RoomDO namespace 73951bbcd9264dd2b5ca1db9b0ac67f7, separate limits and separate secret. Stage currently serves R10 and named-bot patch; never confuse stage game codes with live codes.
- Isolated legacy artwork preview: https://griffin-rooks-art-recovery-test.jeromeleegriffin.workers.dev/, retained only as QA history; this old test site is NOT the canonical game or a required first hop. Its experimental one-page chooser was reverted after owner rejection. Original approved landing is untouchable.

### Weak-connection graphics investigation and repair
Owner switched Android Chrome from Wi-Fi to very weak cellular (nearly zero signal): original Red Two and Black Bird artwork was replaced by text until image recovered; numbered faces looked tiny; original photo-art Bid Box did not finish loading. Returning to Wi-Fi recovered art. An attached MP4 was accidental, IGNORE it; owner's still screenshots and description are genuine. A repair was developed and tested in work/asset-recovery-20261021, changing only asset-loading772.js, retrying native images and CSS after connectivity/focus/visibility changes with throttling; no reload, service-worker reset, or substitute card art. Chromium deliberate network-abort tests restored Black Bird, Red Two and original CSS, verified 10 hand-card images and a single page navigation. A Cloudflare independent stage and then live package included the repaired script.
**LIMITATION:** owner did not certify all physical Android weak-cellular, long suspension and installed-PWA offline-upgrade combinations. Do not claim those gray checks finished. No accidental MP4 analysis.

### Latest Play With Friends: named bot seats and recovery from interrupted chat
Owner supplied actual Android screen capture showing "Test Bot 2", "Test Bot 3", "Test Bot 4" at the multiplayer table even though all art was real. Root cause was not a CSS art issue or phantom name overlay: the original server fillOpenSeatsWithBots generated these names for server-side isBot seats.
- New room creation already starts with host + 3 REAL EMPTY seats; keep this. Bots only enter when host explicitly selects Fill Open Seats / an individual bot. Start Game requires four occupied seats.
- Server patch assigns real House character names with matching existing photo/character assets: Dagger, Crow, Blaze; avoids collisions with human/avatar names using alternatives Grit, Hearth, Brandy etc. Retains internal private-test-bot-{seat} identifiers for persistence compatibility.
- Old saved rooms whose bot labels still contain "Test Bot N" receive a client-side cosmetic name alias on fresh page load, keyed ONLY to isBot=true and the avatar, without touching room state, hands, revisions, human names or storage. No legacy XP, offline runtime or portrait redesign.
- Before deployment, isolated stage hosted QA passed new empty seats, Fill Open Seats, authentic names, host persona collision handling, human taking bot seat before deal, X1 start, one-seat-only fill and room cleanup.
- Then the LIVE version 73aa7be6-9dc0-43ee-a267-20e9fe0f1c62 was deployed. Direct Cloudflare code inspection confirmed new names, client alias and no old displayName generator. The same RoomDO/limits/secret were preserved.
- LIVE regression https://github.com/jeromeleegriffin/Test/actions/runs/39693134706 PASSED; unit https://github.com/jeromeleegriffin/Test/actions/runs/39692277029; stage https://github.com/jeromeleegriffin/Test/actions/runs/39692476531 (first test raced the stage deployment and failed before upload, rerun passed). Live QA created CLOSED only its disposable rooms, did not touch user rooms.
- Receipt: coordination/qa/NAMED_CLOUD_BOTS_LIVE_RECEIPT_20261021.md on the work branch.
- Owner said "connection interrupted"; work did not roll back or restart. Live version and regression were verified after reconnect. Owner should normally refresh an already-open Chrome tab to load new client adapter and see aliases; DO NOT clear app storage/cache. This does not force changes to in-progress server-held names, by design.

### X1 intelligence and very latest UNSOLVED issue: bots Shoot the Moon too often
Owner reported after named-bot fix: "Here lately ... bots are all of a sudden shooting the moon all the time. Have you changed something to make them do that?"
THIS IS OPEN, NOT FIXED OR CLEARED. No bot Moon adjustment was made in the name-only repair. Previous full online X1 v2 promotion DID add rule-aware sampled Moon bidding; thus there is a credible actual behavior change relative to earlier simpler bots. The current Worker chooses online X1 action in chooseOnlineBotAction. With s.settings.shootMoonEnabled, the bidding path computes:
power = Math.max(...Array.from({length:4},(_,tr)=>X1_RULES.plan({...v,tr},0,false).score))
and if power >= 90 OR current decision value is 200, runs X1_RULES.bid(v,[ordinaryOrZero,200]); underlying extended rule AI includes the Moon offer and evaluates sampled terminal utility. This might be too aggressive; **DO NOT assert confirmed root cause or blindly change thresholds.** Investigate recorded real match incidence, strength, false positives, team win/loss and variants. Compare before/after X1 v2 and human vs bot moon bidding. Run a deterministic 500+ deal A/B simulation if possible, track Moon attempts/success by X1 route, and consult owner before policy change. Do NOT change scoring or legitimate Shoot the Moon rule to hide the issue. Need distinguish offline bot moon decisions from online server decisions; report both separately.
Some QA purposely ran Moon-on sample and observed failed-Moon scores (for example -180); these were scenario tests, NOT evidence of natural incidence/frequency.
Latest full online X1 archived reference: coordination/releases/full-online-x1-20261021/LIVE_RECEIPT.json, full original Brain AG final section, and cloudflare/live/x1-full/.
X1 privacy: only the bot partnered with the sole human in a three-bot game is eligible to sample the human partner's remaining cards. Other bots use own/public knowledge; never leak full hidden hands or buried cards. Dynamic room bot names do not alter the X1 math.

### Confirmed QA (distinguish automated from user-phone testing)
- R10 canonical Cloudflare origin both Play Offline and Play With Friends no second document load: GitHub Actions 39673979516.
- Isolated artwork recovery hosted QA: 39659987165, 39664668498 and native artwork abort recovery tests.
- Cloudflare-only package/1,472 dependencies: 39680190239; Wrangler with Static Assets and new stage bindings: 39680928523; live config dry-run with exact existing RoomDO mapping: 39689819023.
- Cloudflare stage original R10 loaded no browser errors: 39686370322. Stage room/rejoin and X1: 39686677683. Stage full X1 complete match: 39689357218 (1 simulated human, three X1 bots, finished scores, 14 partner-assisted decisions, zero fallback).
- AFTER LIVE Cloudflare-only promotion, host R10 assets/Black Bird/Red Two/Bid Box CSS/voice and same-origin friend click 39690549207 PASSED with zero JS errors; real fresh live room X1 v2 + seat/hand reconnect and close 39690622516 PASSED.
- Post-name patch live tests: 39693134706 PASS; verified direct source, exact preserved RoomDO and secret. These hosted tests DO NOT certify four separate physical users, independent cellular WAN, actual phone audio, installed PWA cache migration or old GitHub-link redirect.
- Owner personally said Cloudflare game "everything seems to be working" before the name/Moon findings. Treat that as owner observation, not exhaustive acceptance.
- All historical AG R10 audio work remains valid; owner previously confirmed other sound effects returned and ambience heard.

### Protected visual/gameplay authority, owner workflow
PLAY FIRST, DISCOVER LATER; phone-first offline Play Now instant deal. THE WORKING SCREEN WINS over unreviewed mockups. Original premium realistic blue felt, walnut/brass table, seated portrait characters, approved numbered card art, original premium Red Two and Black Bird. Never substitute CSS drawings for approved photo-art. Preserve locked TABLE-003 seat-facing cards and avatar rectangles, Bid Dock and approved integrated Shoot the Moon attachment, landscape approved Angle C, trick/win flashes and score/navigation hierarchy. Any requested render/image generation only on explicit owner's "Generate." Do not alter existing successful geometry or service worker without cause. User requires handoff ZIP links with a root index.html whenever a game ZIP is supplied; differentiate "documentation-only handoff ZIP" from "playable full-game ZIP". Do not ship mockup as playable game. Preserve source rollback. Provide occasional useful progress updates but do not interrupt repeatedly, and never restart work when owner says Continue.

### PENDING TASKS, prioritized
1. **Moon overshoot audit (urgent new owner concern):** measure whether X1 v2 promotes 200/Shoot Moon too often, root cause, report proposed tuning before deployment. No Moon code fix has been made during this brain update.
2. **Android screenshot/actual waiting-room acceptance** after named-bot live patch, including whether bot avatars/names remain as expected on portrait phone. Chrome existing tab may need normal refresh.
3. **GitHub old links migration**: design opt-in local profile export/import/transfer for XP, achievements, avatars, volume prefs and PWA installation, keep offline fallback. Only after data-safety tests redirect both old public GitHub Pages URLs to canonical Cloudflare. Installed shortcut origin cannot be silently rewritten; guide user through new add-to-home-screen.
4. **Physical connectivity**: Wi-Fi↔weak cellular, long suspension, real Android/tablet, audio continuity and cross-network four-human room membership. No service-worker clearing.
5. **Other banked concepts** in historical AG/H documents; only tackle explicitly requested next work. Current bots X1 v2 should not be redesigned as part of a cosmetic fix.
6. **Future routine releases**: isolated staging, source pin and static package + Cloudflare-native Builds MANUAL-ONLY promotion, current live namespace preservation, rollback. Do not silently treat old three-site synchronization policy as already achieved after Cloudflare-only hosting was approved.

### Current evidence and source locations
- Repo source: https://github.com/JeromeLeeGriffin/Test
- Active release/code QA branch: work/asset-recovery-20261021. Base original source game SHA 90078a710948c7643caafb18986e34dc71ce7cee.
- AH current pointer path: brain/current.json. This AH update is documentation only on Test/main; the preserved working code remains on the isolated work branch until explicitly merged/released.
- Cloudflare receipts: coordination/qa/CLOUDFLARE_ONLY_LIVE_RELEASE_20261021.md; coordination/qa/NAMED_CLOUD_BOTS_LIVE_RECEIPT_20261021.md; coordination/qa/CLOUDFLARE_STAGE_VERIFIED_20261021.md; coordination/qa/WEAK_CELLULAR_ARTWORK_RECOVERY_20261021.md, all on work branch.
- Important exact old GitHub release commits, original three-site audio/X1 v2 evidence and Master Bank locked geometry appear verbatim in the retained AG section below. Their status fields are historical only wherever AH overrides them.
- Do not copy/upload API tokens, TEST_GATE_KEY values or private player cards in documentation. Only nonsecret binding NAMES/namespace IDs are recorded.

---

# FULL INHERITED MASTER BRAIN AG (verbatim historical context)
The following document is deliberately preserved without editing. Its initial status statements are HISTORICAL and were superseded by the above authoritative AH checkpoint. Read it in full and then consult all older foundational authorities and historical version records required by the permanent reading rules.

# Griffin House of Rooks — Master Brain AG

**Latest verified checkpoint — 2026-10-21:** full ONLINE `x1-online-v2` now supports Moon and rule variants plus sole-human/three-bot partner assistance. Native R10, approved UI/Lead pill, voices, portraits and owner-confirmed working audio are unchanged. Read the final Full Online X1 section and `coordination/releases/full-online-x1-20261021/LIVE_RECEIPT.json`. Earlier standard-only/fallback statements below are dated history. The native offline engine is unchanged.

Owner: Jerome Griffin. Published October 20, 2026, America/New_York. Successor to AF. This is the consolidated three-site bug-checking checkpoint. Continue this release; do not restart, restore an older convenient ZIP, or redo completed integrations. All older H–AF documents, archives and branches remain preserved. Historical deployment holds in AF and the R7 beta handoff are superseded only by the owner's explicit current authorization below.

## Current player links — one cumulative game version

- Main game: https://jeromeleegriffin.github.io/Griffin-House-of-Rooks/
- Test game: https://jeromeleegriffin.github.io/Test/
- Cloudflare multiplayer/game: https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/

All three use native runtime `846-premium-owner-repair-20261020-r7-cumulative`. Both GitHub runtime trees match every one of the 1,509 manifest files. Cloudflare pins those same native files at immutable Test commit `2ef90e8264c4f0e887b8df118a563f61e6d47098` and injects its existing verified server-authoritative adapter. This is the same cumulative native game, not identical server wrappers. On GitHub, Play With Friends and an eight-character join code open the Cloudflare site in a new tab; online rooms are never hosted by a player's phone. Offline play remains native with X1. Online bots remain the simple server bots, NOT X1. Cross-origin saved profiles do not automatically synchronize between GitHub and Cloudflare.

## Current owner authority and release policy

Jerome explicitly requested: “I want to update all three each time we update from now until I say something different. So they all stay the same.” He then authorized checking the full project state and updating all three now, followed by updating/organizing the Master Brain for brand-new debugging chats. `coordination/THREE_SITE_RELEASE_POLICY.md` is the standing release policy. Future authorized releases must update all three, preserve rollback and verify each result. Do not silently leave a site behind. No new feature or unrelated redesign is implied by this synchronization.

The owner deferred physical Android/cellular testing until after the playable release. Record those tests as unverified; do not block this expressly authorized deployment solely to repeat that approval question. Remain on the Free plan; do not activate paid services without separate owner approval. The current subscription/invoice is not visible through this connection; no plan change was performed. No repository was deleted or made private. Full Cloudflare-native asset-hosting migration remains a discussion, NOT implemented by this release. Game files still come from pinned GitHub source through the Cloudflare Worker.

## Exact deployments and rollback

Integration branch (both repositories): `work/all-three-sync-20261020`.

- Test runtime/source commit: `2ef90e8264c4f0e887b8df118a563f61e6d47098`; Pages run `39492944270` succeeded; source-check run `39492946214` succeeded.
- Production runtime commit: `972a381196259a58016122c3e365e2208a874755`; Pages run `39493451844` succeeded; source-check run `39493453459` succeeded.
- Cloudflare Worker `griffin-house-of-rooks-online`: version `48f6f945-e54c-4200-bfbd-52bb3e9928b6`, deployment `a8e5ec49-818e-436e-9291-5267b0cc105a`, 100 percent. Existing RoomDO SQLite namespace `bb1bf1c32b68451cbe5db6fee3066fa0`, signing secret TEST_GATE_KEY, ENTRY_LIMIT/ACTION_LIMIT bindings, compatibility date 2026-10-14 and migration tag v1 retained. No namespace migration or stored-room reset.

Both repositories retain branch `rollback/pre-all-three-r7-20261020`: Test `5f0ea0d9a4803fa39caa0a2f5e154c07d0fda911`, production `c8e78769e1f723e0a01196e28b2f00841928a1f6`. Roll back only with a NEW reviewed restore commit over runtime manifest paths, preserving later Brain/coordination/history and player data; never force-reset main. Cloudflare rollback is previous version `b579fde0-d6e1-4a42-b40f-aa85cd3ec7d3` at 100 percent on the existing Worker, retaining namespace/secret/rate bindings. Coordinate with active tables. Earlier rollback `0ddb4c03-6920-455a-aea5-4b16cd0ba766` remains historical.

Protected original `griffin-room-local-poc`, version `7e57f6f5-9524-4456-96d2-379f406b2d01`, namespace `4a45f65563174df6847cd5576973088a`, and `griffin-room-846-private-20261020`, version `5cfd6814-3b3b-4916-80e6-1633a7d4449a`, remain historical/private resources. They are not one of the three player release sites. Do not overwrite or reset them.

## Cumulative work included — do not reimplement

The October 19 complete repairs remain: trump/bird grouping while retaining manual non-trump order; conservative safe laydown proof and host revalidation; previous joins/picker fixes; removed thunder, House Bell, Moonrise and Final Trick effect. Offline rules, approved art/audio/X1 are preserved.

R7 includes photographic premium portrait plaque/controls/lower console; immediate holder trick-win cue; actual native fullscreen plus separate Fit screen; correct reversible portrait/landscape control placement; no artwork regeneration. The inherited Chrome browser-owned fullscreen message has NOT been certified fixed on physical Android. Fit screen is the separate fallback; never hide or impersonate browser security UI.

Cloudflare integration includes room create/code/invite/QR, synchronized seats, selected/removable bots and swipe picker, table closure/new table, secure original-seat reconnect/private hands, legal turns/bids/discard/trump/scoring/Moon, opening shuffle/deal/nest reveal readiness, paced bot decisions and voice queue, trump stamp hold, visible fourth card and bird-fight/collection hold, shared 1x/3x/MAX, laydown presentation and unique redeal IDs. The prior adapter's offline claim/next-hand/leave overrides were repaired to delegate to native handlers when no cloud seat is active. Do not resurrect that offline freeze.

This release promotes the previously delivered cumulative ZIP's runtime, with eight formatting-only files proven equivalent by JavaScript/inline-script syntax trees and normalized HTML. The Cloudflare server/adapter changes are ONLY its native immutable source pin and cumulative-build guard; normalizing those two strings reproduces the prior deployed server exactly. No new game-rule, AI, artwork, scoring or animation rewrite was made during synchronization.

Net runtime changes versus the previously live GitHub roots: asset-loading772.js; game060.js; holder-cues789.js; hor-version.js; index.html; menu-approved805.js; progression.js; room831.js; sw060.js; new cloudflare-entry.js, house-premium-ui.js/css, fullscreen-portrait-review.js/css and 13 preserved photographic-console/provenance files. Exact runtime manifest and source checks live in `coordination/releases/all-three-r7-cumulative-20261020/`.

## Executed verification for THIS synchronization

- Local source checks passed: 68 scripts, 4,684 local bindings, entry dependencies and 1,472 unique precache paths; all configured formatting checks passed. Eight formatting-only files passed equivalent AST/markup proof. Rules, bots and X1 source match the prior live source; approved artwork remains unchanged apart from importing the already-approved premium console assets.
- Local actual-browser offline hand completed with seven human plays, scoring, next hand and confirmed leave; Friends/new-tab and eight-character invitation dispatch passed with no page errors.
- Actual rendered Chromium phone/touch/Android-UA screens at 320x568, 393x740, actual native-fullscreen 393x844, tablet 768x1024 and landscape 844x393; bidding/menu screenshots personally inspected, no page errors. Desktop fullscreen is not physical Android certification.
- Test live site: one full native offline hand, ten human plays, scored correctly, next hand and confirmed leave; zero page errors.
- Production live site: one full native offline hand, eight human plays before native bot completion, scoring, next hand and confirmed leave; zero page errors.
- Updated Cloudflare: FOUR independent simulated human clients, target 100, 3x, one complete match/one hand, 46 human actions and THREE same-seat/same-hand reload/reconnect checks during bidding, discard and play; final Griffin 80 / Raven -195, Team A, zero page errors. Completion is according to the approved terminal negative-score rule, not a fabricated positive-target finish. Real visible native controls drove actions. No physical players/networks were used.
- All 1,509 Git runtime blobs match on both sites. Live HTTP: 16/16 selected entry/code/UI/art files match on each GitHub site; 15/15 selected Cloudflare native assets match; Cloudflare entry reports cumulative version with the adapter injected. Successful deployment and preserved binding/namespace metadata were rechecked.

Prior-version evidence remains separate: preceding consolidated Cloudflare R7 completed THREE hosted matches/FIVE hands/144 human actions/15 reconnect checks, including two-human/two-server-bot and four-human play; 11 security checks and QR/invite/close/new-table checks passed. Twelve service suites and ten accelerated reducer/storage matches (2,456 actions/410 rejoins) are inherited evidence, not new browser matches. Existing special-rule/Moon/bird-fight/pacing fixtures remain preserved on `work/consolidated-r7-cloudflare-20261020` and its source/evidence commit `ebc38a37f001b18946df20a524f70f7d361dd841`. Do not claim hundreds of hosted matches. HTTP request counts are NOT games or players.

Fresh hosted GitHub tests route actual fetched HTTP bytes through the automation transport because direct browser networking returned ERR_EMPTY_RESPONSE. Service workers were blocked for those fresh live smoke contexts; installed-old-cache upgrade/offline reload is NOT recertified by this release. An initial unbounded transport run had an asset fetch failure; concurrency was bounded and both final hands passed. One viewport harness attempted fullscreen without a trusted click and stalled; it was replaced by clicking the actual fullscreen control, and all five final viewport cases passed. Command-line git push lacked authentication; exact blobs/trees/commits were published through the connected GitHub API with expected-head leases. Cross-repository blob reuse was rejected before any production mutation; exact bytes were uploaded and verified before production promotion. Preserve failed logs; do not count failed attempts as passes.

## Known limits, pending bugs and next work

This is the owner's consistent bug-checking baseline, not proof the game is bug-free or certified for unrestricted public scale. Physical Android/fullscreen warning, real QR camera/share sheet, device audio, cellular/WAN/roaming, long suspension and installed-device cache upgrades remain unverified. Online X1 migration remains deferred; server test bots are preserved. GitHub entry navigation and Cloudflare origin keep separate saved profiles; do not promise cross-site XP/account sync. The long 766 intelligence audit remains paused at 38 hands/seven matches unless explicitly reopened; no reason to rerun old tournaments for a UI bug.

Treat new owner bug reports against this exact runtime and site. Reproduce the actual visible state, identify cause, isolate a fix, inspect actual pixels at affected sizes, rerun relevant checks, then publish the same cumulative update to ALL THREE under the standing policy. Do not restart completed work, stack failed patches, regenerate approved art, clear saved data, or silently expand scope. Keep brief progress updates roughly every minute during work; explicitly say when a provider deployment/test is waiting or blocked. Fresh chats must check current.json and this exact handoff first.

Free-plan discussion: measured October 20 account analytics before this synchronization reported about 98,146 Worker requests across TWO test Workers, 9,560 room requests, 32 GB-seconds room duration, 66,332 rows read and 5,704 rows written. This is a dated analytics snapshot, not proof of current billing plan, player capacity or hundreds of matches. Repeated asset loads/testing contribute; the current proxy architecture still consumes Worker requests. The game has 1,509 runtime files/about 182 MB; its files fit native static-hosting limits, but that migration was not performed. If multiplayer fails, inspect actual HTTP/error codes and account quotas before diagnosing a game bug. A Free quota failure can require waiting for reset; no paid upgrade without owner approval.

## Source, ZIP, historical authority and organization

Latest delivered cumulative ZIP remains `Griffin_House_Complete_Cumulative_Final_20261020.zip`, 166,774,839 bytes, 1,670 entries, SHA-256 `3264c8c1ec3ebca83e87d2aa8eebe97c7b7e4a04e52a8d8c27f3c6aff3316cbf`, Library `libfile_31c70b5c390481919f5ab8eff6ecc05c`. No new game ZIP was requested or created during synchronization. Its eight equivalent formatting changes are documented; the ZIP and published source have the same behavior/runtime identity. No older R4/R5/R6/R7-only package should be presented as current cumulative release.

Full deployment receipt: `coordination/releases/all-three-r7-cumulative-20261020/LIVE_RECEIPT.json`. Runtime SHA-256 inventory, Git and HTTP verifications, browser receipts, viewport checks, formatting proof and logs are beside it. The exact previous AF pointer is preserved as PREVIOUS_AF_POINTER.json. Full current handoff: `brain/releases/all-three-r7-cumulative-20261020/COMPREHENSIVE_HANDOFF.txt`; ready-to-paste startup is in this AG's START HERE. Both include permanent rules below. Prior AF, its 845/846 handoffs, all historical references, banked ideas and rejected attempts remain intact; this successor supersedes deployment status, not unrelated approved design decisions.

The current session refreshed GitHub main/production/integration branches and Library's latest cumulative artifact/report, read H MASTER_BANK and operating rules, chronological I–AF principal documents (including repeated embedded predecessors), current release/preservation/numbering/visual-QA authorities and relevant UI/multiplayer recovery records. This is not a fresh visual audit of every historical binary attachment. Historical A/B unavailable-package gaps remain gaps. Do not claim an attachment was re-opened simply because an earlier report names it. Actual approved pixels and exact source remain authority.

No careers, achievements, XP, identities, settings, browser caches or service workers were cleared. No paid services, public launch campaign, new art, legacy Worker reset or repository removal was performed. Original loader remains preserved. The owner may start fresh bug checking from any of the three links above.

## Permanent rules — reproduce in every successor

PERMANENT COMPLETE MASTER BRAIN READING RULE

This rule applies to every future Zoey without exception.

Before beginning any Griffin House work:

1. Read the complete foundational Master Bank H, from beginning to end.
2. Read every subsequent published Master Brain version in chronological order, including I, J, K, L, M, and all future versions.
3. Read all relevant authority documents, approved design specifications, original reference materials, project ledgers, and unfinished-work records.
4. Identify which earlier decisions remain approved and which were explicitly superseded.
5. Never substitute a summary, version inventory, or latest delta for reading the actual documents.
6. Verify the current GitHub pointer and distinguish published documentation from playable game builds.
7. Confirm which documents were actually read and identify anything inaccessible or unverified.
8. Do not begin development until the complete project history and current assignment are understood.

PERMANENT SUCCESSOR REQUIREMENT: Every Zoey must include this entire reading rule in the next chat's handoff and startup instructions, and explicitly require her successor to pass it forward again.

PERMANENT, SELF-PERPETUATING CHAT CONTINUITY RULE

This rule applies to Master Control and every Griffin House specialist chat, now and in the future.

1. When a conversation becomes long or difficult to manage, proactively warn me and recommend a fresh continuation chat before important information is lost.

2. Before switching chats, prepare a complete handoff with the current Master Brain version, GitHub locations, approved decisions, locked designs, unfinished work, rejected attempts, verified game baseline, rollback files, ZIP packages, reference screenshots, restrictions, and next steps.

3. Provide one complete, ready-to-paste startup prompt for the next chat.

4. Every handoff and every new startup prompt MUST reproduce this entire continuity rule and explicitly instruct the next assistant to reproduce it again in its own future handoffs and startup prompts.

5. The next assistant must pass this same obligation to its successor, and that successor must pass it to the next, continuing through every future chat generation. Never allow the rule to disappear from the chain.

6. Preserve the continuity rule in every future Master Brain update. Do not shorten, silently omit, or weaken it.

7. Never rely on chat memory alone. Important decisions must be recorded in durable project documentation through the approved process.

8. At the beginning of every replacement chat, verify the current Master Brain and the inherited handoff before starting work.

IMPLEMENTATION REQUIREMENT:

Store this rule verbatim in Master Brain M.

Reproduce the entire rule verbatim in START HERE and in the ready-to-paste replacement-chat startup prompt.

Instruct every successor to reproduce it verbatim again in its own handoffs, startup prompts, and future Master Brain updates.

Do not replace the rule with a summary or a reference such as "same as before."


# PERMANENT UI VISUAL VERIFICATION RULE — Owner directive 2026-10-19

**Scope:** Griffin House of Rooks, every future UI/UX/layout/visual change, every specialist, successor chat, work session, branch, review ZIP, and deployment. This rule is mandatory, not an optional suggestion.

1. **The working screen wins.** Open and render the *actual modified game*, using its real artwork, cards, CSS, JavaScript, and UI at representative target device viewport dimensions. Never replace this with code inspection, syntax checks, generated mockups, or guessed geometry.
2. **Personally inspect before delivery.** Take real rendered screenshots and inspect them for clipped, mismatched, oversized, misaligned, overlapping, hidden or unattractive controls and unintended changes to approved graphics. Inspect until satisfied with the real pixels. Capture at least portrait regular-browser and installed/fullscreen equivalents, with top/bottom browser toolbars where applicable, and small-screen sizes. Include landscape/tablet when the change can affect them.
3. **Exercise the affected states.** For table controls, check bidding (including the Bid Box), active trick/card play, large score/race banner, menu, card hand, nest/discard, score/end-of-hand, selected speed states, and state transitions as applicable. Check that controls respond correctly and touch targets remain usable. Compare screenshots with owner-approved references and actual-pixels geometry.
4. **Fix and retest.** Do not ship while the inspected UI still has obvious defects. Retake screenshots after each repair. Verify no unrelated approved feature, asset, gameplay behavior, or screen has regressed.
5. **No unverified deliveries.** Before sending a ZIP/download or deploying UI changes, report which actual browser/viewport/device states were opened and visually checked, with screenshots/evidence and remaining limits. ZIP-integrity or JavaScript syntax success alone is NOT visual QA and cannot be described as a finished UI review.
6. **Browser blocked? Stop, don't bluff.** If an actual visual test cannot be completed, do not call the UI finished, do not package it as owner-ready or recommend deployment; explain the blocker and work toward obtaining a valid preview/testing route. Clearly distinguish local emulator/browser visual verification from physical Android acceptance.
7. **Owner approval follows verified visuals.** Do not silently overwrite approved artwork, change protected bid dock geometry, or deploy without authorization. Preserve rollback checkpoints.
8. **Permanent handoff obligation.** Record this rule in the current Master Brain and every successor handoff/startup prompt, carrying it forward verbatim or with full meaning intact. Every future agent must read and obey it before any UI task.

Reason: multiple October 19 portrait/fullscreen control ZIPs were delivered after only script/ZIP checks and revealed obvious scoreboard collisions, oversized and unequal controls, hidden utility icons, and missing lower-console elements during owner phone testing. The owner explicitly requires the assistant to catch these problems *before* asking the owner to download anything.

**Authority:** Owner directive of 2026-10-19. Does not indicate that current candidate UI or live sites are verified.


Explicit successor obligation: reproduce these complete reading, continuity and actual-pixels rules again in your next handoff, startup prompt and Master Brain update; pass the obligation forward forever.


## R8 hosted verification and release — 2026-10-21

This section supersedes the R7 runtime status above. Continue from this release; do not restart. The historical R7 ZIP and staging receipts remain preserved evidence, not current deployment instructions.

- Runtime: 846-r8-friends-voices-portrait-20261021.
- Test runtime commit: 47a3c83b61fd9a927195cf429a9acfe0a0e4e443. Production runtime commit: 0330bcdde34b4fe47587adeda9f6379ce53b1459.
- Immutable Cloudflare asset source: 7c7eab3c9e1c6e6124da28e403a0d7405ac7c967 in Test.
- Cloudflare Worker: griffin-house-of-rooks-online. Version 2b037d2a-7232-4a0b-9784-6ccb8fb118d1; deployment f0cdcf6a-75f4-4673-98dc-55d22aed2a9c.
- Worker SHA-256: 47b07501fd45c952215c324f45f9a73623bc434d2ca714817a3808ddaf920986.
- Existing namespace bb1bf1c32b68451cbe5db6fee3066fa0, TEST_GATE_KEY secret, ACTION_LIMIT and ENTRY_LIMIT bindings retained. No room storage reset, no paid upgrade, no service-worker clear/unregister.
- Rollback Cloudflare version: 48f6f945-e54c-4200-bfbd-52bb3e9928b6. Both GitHub repositories have rollback/pre-r8-20261021.

### Repairs preserved

Native associated form submissions with target=_top replace popup/script-only Friends navigation. Explicit create and invite intent takes priority over saved reconnect state. Both index.html and cloudflare-entry.js carry the entry fix. The Worker injects its cloud adapter and uses the matching R8 runtime guard and immutable asset pin. Approved male voice MP3s and cumulative portrait repairs are preserved; no portrait/Bid Dock redesign. X1 files remain intact; this release does not newly integrate X1 into online server bot decisions.

### Actual verification

Before production deployment, an owner-approved Cloudflare Preview ran R8 with separate storage (17f11ebca0d64cac97196089e2f28c24) and an independent test secret. Native browser checks passed: Play With Friends created 42J8LH3Q; Fill seats seated three bots; Start Game, bid 110, received nest, selected six discards, confirmed black trump, played cards, and reloaded/reconnected with the same seat and remaining hand. Native invitation joined a distinct API-created host in HXBW6W7Y, showing 2 of 4 seated.

A temporary preview-only browser test page used the real room HTTP API with distinct generated player identities: four humans completed all 40 card plays to score in EJZZXE7Q; two humans and two bots completed a hand to score in WHYCT377 (20 human card plays). Both tested reconnect with unchanged seat/token/hand and rejected non-host Start Game. Total 255 real network requests. These are simulated clients, not four physical phones. The game/reducer/adapter were unchanged by the temporary test-page route. The route was removed and exact release source restored before production deployment.

After deployment, the live Worker reopened the pre-existing R7 test room and accepted another legal card, proving saved room/hand continuity across this upgrade. Preview URLs were turned OFF again after testing, as authorized. The preview resource is retained but no longer publicly routed.

Local checks: 13 unit suites and 3 entry/routing suites passed; 10 full simulated local matches, 2259 actions, 391 rejoins. Test source checks 39546930668 and 39549227923 passed; Test Pages 39549226534 passed. Production branch source check 39549445116 passed; consult LIVE_RECEIPT.json for final main publication runs.

### Limits and browser failure

Physical Android, independent cellular networks, and listening to every male voice were not verified in this session. The actual ZIP Loader navigation had passed earlier using the preserved native-entry QA ZIP against the prior Worker; the final post-release ZIP replay could not finish because the Cloud Browser's native credential protection stopped browser operations and runtime recovery failed. Do not claim that last replay passed. Static Loader inspection confirms a root index.html requirement and an iframe with no sandbox restriction. Do not clear caches to work around it.

Cloudflare connector access finally succeeded after one accepted authentication request and a direct retry. Prior failures included missing workers-scripts.read scopes; Cloud Browser dashboard login separately returned 403. No quota exhaustion was established. Do not resume repeated Gmail/login/reconnect loops.

### Continuity obligation

Read brain/current.json, this complete Master Brain, its construction authorities, and the release receipt before edits. The working screen wins: inspect the real complete screen and controls at target portrait/landscape sizes; source checks alone are not visual acceptance. Preserve approved art, voices, portrait geometry and Bid Dock. Distinguish Cloud Browser verification from physical Android acceptance, keep rollback checkpoints, and pass these complete reading, continuity and actual-pixels obligations forward in every successor handoff and Master Brain update.


## R9 audio recovery publication — 2026-10-21

This section supersedes the R8 runtime markers above; all R8 repairs and hosted multiplayer evidence remain preserved.

The owner reported that all sounds initially worked and then stopped, including ambience, at normal 1x as well as after trying 3x/MAX. Speed change is not a necessary trigger. The exact state of the owner's phone has not been observed. Source inspection found two independently reproducible recovery defects: main effects/voices recovered suspended contexts but skipped interrupted state and reused closed contexts; ambience trusted its running intent flag even when its actual AudioContext was suspended/interrupted.

R9 changes game060.js to resume non-running open contexts, recreate a closed context, and run whenAudioReady callbacks only after actual running state. cabin-ambience041.js resumes an interrupted/suspended context even if running intent is already true, safely recreates a closed context, and adds context state to its existing inspect diagnostic. Saved sound mute and per-sound volumes are retained. Approved recordings, portrait repairs, Friends navigation, Bid Dock, geometry and gameplay rules are untouched. No audio assets were replaced and no cache/service-worker clear or unregister was performed. Normal build/cache identity is 846-r9-audio-recovery-20261021, including versioned game and cabin script URLs.

The original published code fails the deterministic main interrupted-context test and separately fails the ambience suspended-context test. The repaired candidate passes suspension, interruption, closed-context replacement, rejected-resume retry, background return, stale stop timer protection, no duplicated ambience loops, and preserved mute/volume settings. Entry security, Friends form navigation and entry-intent checks also pass. These are mocked AudioContext regression checks, not audible playback verification.

The owner explicitly instructed publication after being informed that Cloud Browser could not safely resume its native credential state and audible verification was blocked. Do not claim that the owner's sound issue is confirmed resolved. Status: recovery repair deployed; audible/physical Android verification remains pending.

R9 immutable assets: 374bf70223a9df7113d83786cd55f2ee6c25f4ae (Test). Test runtime source: 5ba5b53031bd355875ff36101ec4f7ef9449963b. Production runtime source: 54342d814c7063f808a0e8614b23b9b6f9bbc763. Cloudflare version: 45a7b80b-1f57-43f3-a077-0bb9ee8cac6e; deployment: 1413c173-61f1-4621-8c58-c0d16b92d57a. Worker SHA-256: 8f8693003169c0438c2fe378810ef2f81cfd961adad42a96f12319b38711ca41. Server source is byte-identical to R8 after normalizing only the immutable asset pin and accepted build marker. Production room namespace bb1bf1c32b68451cbe5db6fee3066fa0, secret and rate limits retained; preview URLs remain OFF. No paid upgrade.

Rollback: Cloudflare R8 version 2b037d2a-7232-4a0b-9784-6ccb8fb118d1; GitHub rollback/pre-r9-audio-20261021 in both repositories. The isolated original candidate b0fa6c835090f262e1f468440c528ccf9d981846 remains in work/r8-audio-recovery-20261021. See coordination/releases/r9-audio-recovery-20261021/LIVE_RECEIPT.json for publication checks and current limitations.

Normal online refresh fetches the new scripts; users must reload/reopen the game once to load R9 code. Existing live rooms and saved hands were not reset. Do not reset volume settings to force sound on, and do not substitute new voice recordings for an audio-context recovery issue.

All complete reading, continuity, actual-pixels and permanent successor handoff obligations in this Master Brain remain in force. Preserve this owner authorization, actual test scope, unverified audible playback, rollout identity and rollback references in every successor handoff.


## Owner-confirmed R9 failure and targeted online card audio repair — 2026-10-21

This checkpoint supersedes the preceding R9 pending-verification status. The owner confirmed R9 did not resolve the sound symptom. Preserve the failed-fix record. An opt-in diagnostic wrapper was activated without changing native R9 game files; owner phone data was received and preserved in Test commit ded87ce8e9142553e4e808f8616ecb08aec62316, coordination/releases/r9-audio-diagnostics-20261021/OWNER_PHONE_REPORT.json. The owner heard the independent test tone. Main and cabin contexts were running, main clock advancing, mute off and channels enabled. Card-impact buffer count was zero during a restored hand; voice queue starts were zero, which alone does not prove failed speech because restore snapshots intentionally remain quiet.

Actual-source regression reproduced the card-impact failure: reconnect skips the native deal, so impact samples were never preloaded; the cloud adapter bypasses legacy notifyCardPlayed. The targeted adapter repair warms the original loader on first/new-hand snapshot and trusted tap, retries a failed load, and dispatches the original native cue once for the latest newly confirmed public card. Restored, duplicate, cleanup, new-hand/new-room and catch-up history never burst old sounds. No optimistic cue for a rejected move. Existing mute/effects settings and special bird rules remain native. No voice recording, portrait, Bid Dock, gameplay rule or native R9 file changed.

Published Test server-source commit c13c6c45b085d46c54c7aea6f7c3a2804876b886 and production server-source commit 70cc652f0a425f2b3428aa3f7db17f1dc36ef0a8. All three keep native runtime846-r9-audio-recovery-20261021 and immutable asset source374bf70223a9df7113d83786cd55f2ee6c25f4ae. Both GitHub Friends paths use this shared repaired server. Cloudflare version60c2b7e7-3787-4b09-be10-d232f988b6d9, deploymentc9e04e07-d161-49c8-9be6-977c03b139c4; exact downloaded Worker equals locally tested source, SHA256 d5a98946ed196c14f4335dcac2c89de096314f277392ed5cbc53e17827c5d5db. All non-adapter Worker source equals prior diagnostic Worker byte-for-byte. Existing namespace, secret and rate limits retained; no room reset, preview activation, paid change or service-worker clear. Both repositories preserve rollback/pre-card-audio-20261021. Cloudflare rollback2f2dc7d6-90bb-4f99-9443-76041bd6829d. No new ZIP.

Tests: actual gameSnapshot/native loader/native notify/native impact functions with mocked AudioContext pass reconnect load, source.start on confirmed card, duplicate/restore/cleanup quietness, new-hand/room isolation, catch-up no burst, muted/disabled effects and failed-load retry. All five unchanged WAVs decode with FFmpeg. Worker asset-route, entry-security, collection/reconnect, diagnostic-privacy and R9 context-recovery tests pass. These are not actual audible/browser acceptance. Cloud Browser remains blocked by native credential state; do not resume repeated Gmail/Cloudflare sign-in/reconnect loops. Owner authorizes continued repair; do not claim the overall sound issue fixed until verified.

Ambience is still unresolved. Embedded PCM matches preserved WAVs. Fire source RMS−61.2dBFS and wind−70.4dBFS; at reported cabin6%, fire10% and bus0.2, estimated fire output−95.2dBFS and wind−84.3dBFS. Provenance says deliberately low levels. This establishes very quiet source/gain staging, not corruption or a stalled phone context. No ambience level/recording changed by this card repair. Next work: separately verify a calibrated ambience correction with clipping/headroom and saved-slider preservation; inspect remaining voice/other cues without inferring failure from a quiet reconnect. Keep approved male recordings and portrait repairs. See coordination/releases/online-card-audio-20261021/README.md and LIVE_RECEIPT.json.

All complete reading, continuity, permanent actual-pixels and successor handoff obligations above remain in force. Every next handoff must preserve this failed-fix record, phone evidence, exact card repair scope, active/rollback versions, tests and remaining ambience/audible-verification limits. Continue this checkpoint; do not restart.


## R10 ambience repair and owner confirmation of card sounds — 2026-10-21

This checkpoint supersedes the preceding unresolved-ambience status. The owner explicitly confirms other sounds are back on the phone after the confirmed-card dispatch/reconnect preload repair; ambience remains inaudible before R10. Preserve that owner-confirmed success and do not replace/rework working audio paths.

Cause: the same preserved ambient PCM is already deliberately attenuated to RMS fire−61.2dBFS and wind−70.4dBFS. Saved cabin6% (bus0.2) and fire10% compound this to fire−95.2dBFS / wind−84.3dBFS at output, although the phone reports running contexts and sources. R10 adds one fixed recording gain100 and a shared smooth output ceiling only to the cabin path before the unchanged atmosphere mixer. The original PCM, all approved voice/character recordings, preferences, mute/zero behavior, ambience schedules/fades, portrait repairs, Bid Dock and game rules remain unchanged. The ceiling is0.45*tanh(x/0.45), 2x oversampled; it bounds the combined ambient waveform at extreme sliders rather than multiplying every source independently. Lifecycle cleanup disconnects old output nodes; stale stop timers cannot affect a restarted chain.

Native runtime846-r10-ambience-levels-20261021. Test runtime/sourcea5804a9035b3a2f56b38231cec4ff44da686655f; immutable native assets90078a710948c7643caafb18986e34dc71ce7cee; production runtime/sourcec52c097473c2476957306c6492c695c4bb6946b7. Both GitHub native files have identical blob SHAs. Only cabin-ambience041.js has a behavioral native change. game060.js, index.html, hor-version.js, sw060.js change release/cache identity only. Normal versioned load/cache identity is updated; never clear/unregister service workers. Worker accepted build and immutable asset pin match R10; after normalizing those two strings it equals the owner-confirmed card-repair Worker byte-for-byte. No new ZIP.

Cloudflare Worker versiond4d2ed21-45da-4652-bd09-95ce85b41c12; deployment0567f9b0-2512-43f9-aaa3-a64d0ef42e52. Downloaded Worker source exactly matches the tested candidate, SHA256 a8cb41c717bf1178373e559cc6b36263d45e172474870849f8b0af4e88672eae. Existing namespacebb1bf1c32b68451cbe5db6fee3066fa0, signing secret and both rate limits retained. Preview URLs remain OFF; no paid change or room reset.

Source checks39557639452 (immutable Test asset branch) and39557744220 (production candidate) passed before publication. Final main source checks39557812112 (Test) and39557815019 (production) passed. Final Pages results live in coordination/releases/r10-ambience-20261021/LIVE_RECEIPT.json; verify those rather than assuming synchronization. Source and page publication do not establish physical Android audible acceptance.

The real-PCM graph regression fails against R9 at wind−84.3dBFS and passes against R10 with estimated steady-state wind−44.3 / fire−55.2dBFS at saved defaults. It evaluates the actual module-created graph with simulated AudioContext/curve processing, checks original PCM, existing atmosphere mixer, saved settings, zero/mute, high sliders, shared ceiling, no repeated-gain/loop stacking, and stale-stop cleanup. Context recovery, confirmed card-sound dispatch, Friends/create/invite/security, collection/reconnect, diagnostic privacy and changed-file formatting regressions also pass. No new real-browser or physical phone listening test is claimed: Cloud Browser native credential state remains unavailable. Prior user authorization expressly permits repair publication despite that limitation; do not repeat approval/authentication loops.

Rollback/pre-r10-ambience-20261021 in both repositories preserves Test517c308a9aa21e518908344020835a3a00ff8a68 and production70cc652f0a425f2b3428aa3f7db17f1dc36ef0a8. Cloudflare rollback is owner-confirmed card-audio version60c2b7e7-3787-4b09-be10-d232f988b6d9. Preserve room bindings and data if rolling back. Owner should refresh/reopen once to load R10, tap normally to unlock audio and allow five seconds for the existing wind/fire fade. Await explicit phone ambience confirmation before marking the overall sound symptom resolved.

All complete reading, continuity, actual-pixels and successor handoff obligations above remain permanent. Carry forward the owner-confirmed card-sound repair, R9 failed-fix evidence, phone diagnostic report, R10 gain/ceiling scope, all exact active/rollback references and audible-verification limits. Continue this cumulative checkpoint; do not restart or restore an older ZIP.


## Owner phone audio acceptance and banked-work status — 2026-10-21

Owner confirms after the card repair: “the other sounds are back.” After R10 ambience publication and refresh instructions, owner states: “I hear it.” The current-phone reported sound symptom is now owner-confirmed resolved. Preserve this as the working audio checkpoint; do not keep asking for the same sound test. Scope is the owner's current phone/session, not every rare ambient event, browser, device or suspension case. Active R10 runtime/rollback references above are unchanged. No runtime or asset edits accompany this confirmation.

The owner asks whether all banked ideas and completed work are fully caught up. Current cumulative repairs are published across all three; banked/future work is not all complete. Read coordination/BANKED_IDEAS_STATUS_20261021.md for reconciled statuses. Concrete remaining/deferred items include visible bottom-local Lead pill (current source creates tag but current CSS hides it), online X1 migration, broader device/WAN/cache acceptance and any requested fresh cumulative R10 ZIP. Cloudflare asset migration and Unity/other future concepts remain deferred. Old pending holder CSS must not overwrite the newer integrated cue source. Trump-choice sort source exists but exact phase/manual-discard behavior needs acceptance reconciliation; do not infer full completion solely from presence of fallback code or an old NOT_IMPLEMENTED ledger. This review is not an exhaustive fresh visual audit of all historical artifacts.

All complete reading, permanent actual-pixels, continuity and successor handoff rules remain in force and must pass forward. Continue this R10 checkpoint; preserve owner-confirmed working audio, approved male recordings, portrait repairs, saved settings and room data.


## Online X1 integration — 2026-10-21

Owner reopened online X1 intelligence and requested relevant reconnect/suspension checks. UI and the bottom Lead pill were explicitly left alone. Native runtime stays `846-r10-ambience-levels-20261021`, pinned assets `90078a710948c7643caafb18986e34dc71ce7cee`; preserve owner-confirmed working card/game sounds and ambience, approved male voices, portraits, Bid Dock, saved settings, rooms and service workers.

The server integration `x1-online-v1` uses the exact approved core/bidding/SHA engines, not a rewritten approximation. New standard 46-card hands use X1 for bidding, discard, trump and sampled play. Only the acting bot's own hand and confirmed public information enter the engine; only a bidder can use its own buried nest. No private partner-mask, Anchor route or other hidden hand enters online decisions. Seeds are deterministic from the own/public view. Unsupported rule variants and Moon contracts retain the existing server bot. Sampling failure falls back to legal Sol7 for that hand; adapter failure retains a legal legacy move. Persisted pre-X1 hands stay legacy until the next deal, avoiding mid-hand strategy reconstruction.

Privacy boundary tests, public bid/void history, hidden-deal invariance, replay determinism and explicit fallback cases passed. Six local complete matches passed with 161 human actions, 24 rejoins and 100 X1 card plays. Actual RoomDO with simulated time/storage passed actor recreation, ten-minute detach, exactly-once lost-response retry, stale/unauthorized rejection and the existing deliberate one-hour idle expiry. Relevant collection/fourth-card, pace1x/3x/MAX, trump hold, readiness/alarm and rare-rule/Moon regressions passed. Native audio suspension/recovery regression passed; unchanged native R10 source and audio asset pin preserve the owner's audible acceptance.

Isolated real Cloudflare QA (run39562960314, commitbf0e112f3fd284b7211733065beea2437e6f1c2e) passed three complete matches: 1human/3bots/MAX, 2humans/2bots/3x, 4humans/0bots/1x. Totals82 human actions,21 rejoins,6 duplicate-action retries and50 X1 card plays, zero bot fallback. Bot discard and trump were exercised. One transient rate-limit retry recovered in the four-human case; no paid upgrade or limit change. The hosted in-request time diagnostic remained zero and is not CPU measurement. See the release receipt for the separate real ten-minute detached-client result and final production acceptance.

This is server/API verification from one GitHub runner with distinct simulated identities. It is not fresh rendered UI, four physical devices, Android OS suspension, independent WAN/cellular roaming, share-sheet/QR-camera acceptance, installed-cache upgrade or fully offline asset-cache acceptance. Those gray checks remain honestly unverified. Cloud Browser's native credential runtime remains unavailable; do not repeat Gmail/Cloudflare reconnect loops or ask the owner to redo resolved audio tests. No UI change or new downloadable ZIP was made. Complete Cloudflare-native asset hosting, Unity and unrelated future ideas remain banked.

Authoritative implementation, source hashes, exact deployment/rollback and evidence: `coordination/releases/online-x1-20261021/LIVE_RECEIPT.json`, `HOSTED_QA.json`, `TEN_MINUTE_DISCONNECT.json`, `LIVE_ACCEPTANCE.json`, and `cloudflare/live/x1/README.md`. Retain all permanent reading, continuity, actual-pixels and successor obligations above verbatim in successors.

Final server source: Test `9b63d8d9791c7b8d7d9766aaae065c675e03d10b`; production `a1b73405f1905bd92685c77a6fd0a1d640ddcb24`. Cloudflare version `3c0339df-3396-4784-b50b-05a0b41166ab`, deployment `8bb4c652-3133-4480-a1f3-b09bf69159b3`, Worker SHA-256 `313ed667456754003a054b6506c9c5579d98d16ecb179b9d8465fa954152e6c1`, original room namespace retained. Rollback Worker `d4d2ed21-45da-4652-bd09-95ce85b41c12`; both source rollback branches `rollback/pre-online-x1-20261021`. Minimum bids outside 70–200 retain legacy, matching native X1's compatibility contract. Actual ten-minute disconnect passed for600309ms with unchanged seat token/original own cards and bot catch-up on resume, across the isolated server update. The initial long-test fixture failed an unproven bot-progress assumption; its failure and correction are preserved, not counted as a complete pass.

Fresh production acceptance: GitHub Actions39564067285 (job119101991507, commit900247eac1179579494c89698c61843ee36868fd) passed a complete1human/3bot/MAX match,12 human actions,3 rejoins,2 duplicate retries,30 X1 card plays, bot discard/trump, no fallback and no rate-limit retry. Final score10/190. This is automated live server API acceptance from one runner, not physical Android or an audible listening test. Test routing was disabled after QA; no real player room was closed or reset.

Timing scope: the real ten-minute test observes progress after joining and fetching the resumed snapshot; it does not independently timestamp each alarm before the resume requests. Local RoomDO tests separately exercise alarm invocation and actor recreation. Do not turn this evidence into physical-device, cellular or exact background-execution certification.


## Full online X1 completion — 2026-10-21

Owner requested completion of the remaining X1 integration after the standard-only release. This release completes the ONLINE server modes; the native offline integration is preserved. No UI/Lead pill, Bid Dock, voice, portrait, audio, settings, room data or service-worker repair was reopened.

The approved frozen core/SHA/bidding sources remain unchanged. Standard normal play retains the original engine. A rule-aware X1 sampled extension supports Moon, Red Two disabled and other supported deck/rank/legal-play/scoring/hand/nest/widow configurations. It compares candidate plays on shared sampled worlds with128 samples (256 late), paired uncertainty margins and actual terminal Moon/scoring utility. Moon requires all counters, not every zero-point trick, and can be selected below zero. Emergency fallbacks remain diagnosed; zero occurred in final checked fixtures/games. No claim that new variants inherit historical champion tournament win rates.

Private assistance is authorized only for the active bot partnered with the sole human among three bots, checking current authoritative IDs, roster, roles, seats and teams on every decision. Only that human's remaining cards enter detached server sampling; no opposing hand or partner's buried nest is read or serialized to another player. With two or more seated humans, every bot uses own/public input. Own/public partner bid takeover and the approved Anchor/Rita partner-first route are included under that sole-human eligibility gate; Moon uses its contract objective rather than the Anchor override. Current v1 hands retain their existing logic until the next deal. Never reset stored tables to activate v2.

Local verification:256 independent rule-flag configurations,1024 legality comparisons,1897984 ranking comparisons against authoritative game helpers;128 scoring cases against the hand-finishing reducer;18 complete hands/712 card plays; hidden-hand/nest poisoning, deterministic own/public replay, exact eligibility/Anchor route and strong Moon decisions including the acting team's negative score. Eight v1 in-progress hands and eight non-assisted standard card decisions matched the prior engine exactly. Actor recreation, simulated ten-minute detach, exactly-once retry and stale/unauthorized rejection passed. Collection/fourth-card, speed, trump hold, readiness/alarm and rare Moon/rule regressions passed. An extra scoring interaction found during review was corrected before publication; initial and final hosted evidence remain distinct.

Final isolated Cloudflare run39568499209 passed six complete matches:1human/3bots MAX standard;2humans/2bots 3x;4humans/0bots 1x;1human/3bots MAX without Red Two; standard Moon; and Moon without Red Two. Totals119 human actions,32 rejoins,12 duplicate retries,140 X1 card plays, zero fallback. Sole-human assistance was exercised and multi-human private-assistance counts stayed zero. The initial six-match run39567187965 is historical evidence, not substituted for final source verification.

Fresh live acceptance39569158287 passed Moon with Red Two disabled:30 X1 rule-aware card plays,10 partner-assisted decisions,5 rejoins,2 duplicate retries,zero fallback; final score-180/75 correctly handles a failed Moon. These are one-runner server/API tests with simulated human identities, not physical players or rendered browser acceptance. New physical Android OS suspension, WAN/cellular roaming, installed-cache/offline upgrades and QR/share-sheet checks remain unverified. The actual real ten-minute v1 disconnect is inherited evidence; v2's local simulated-time/actor checks and unchanged HTTP/DO/alarm wrapper do not constitute a newly run real ten-minute test. Hosted clocks stayed zero and are not CPU benchmarks. Preserve owner-confirmed audible R10 acceptance without inventing a new listening test.

Native846-r10-ambience-levels-20261021 and immutable assets90078a710948c7643caafb18986e34dc71ce7cee remain. Test server source539a710617f0114ebdd7ec7dfaccd17956468501; production sourceffbcba8ff311d8680d8a28d8da6e3f6a51d5d752; Cloudflare versionf9fd3cd5-67a1-49ae-850d-7c2ca60c1ad7, deploymenta319e805-c76c-462b-a18b-c59498a188d9, SHA-25678b9cbe754895bbab04b153c9f5a71a380f948837d5dba82e3ab6915635b99f9,100 percent on original room namespacebb1bf1c32b68451cbe5db6fee3066fa0. Original secret, rate limits and compatibility date retained. No paid upgrade. Temporary QA public routing and preview URLs disabled; its separate namespace retained without resetting/deleting it. All test rooms closed only by their own generated credentials.

Rollback is Worker3c0339df-3396-4784-b50b-05a0b41166ab and both source branches rollback/pre-full-online-x1-20261021 (Test95ef3ae2825e69eb9cf3727ac48c368960e836da; productionfca7a5506c51f18e36de14977d652827994566b2). Restore through reviewed new source commits, never force-reset main or reset storage. Historical build helpers now refuse to overwrite v2; reproduce with cloudflare/live/x1-full/build.py using the exact immutable v1 base and bridge described in its README. Do not deploy an older ZIP's bundled Worker. No new ZIP was requested or created.

Authoritative receipt/evidence:coordination/releases/full-online-x1-20261021/ and cloudflare/live/x1-full/. Preserve the complete permanent reading, continuity and actual-pixels obligations above verbatim in every successor. Continue from this checkpoint; do not restart or repeat blocked Cloud Browser/Gmail/Cloudflare authorization loops. Remaining future banked concepts and physical-device/cache gray checks are separate from this completed online intelligence expansion.
