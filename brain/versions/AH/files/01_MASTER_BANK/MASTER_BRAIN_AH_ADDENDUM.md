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



## Career, achievement, bot leaderboard, and Rita recovery checkpoint — 2026-10-23

The current live R12 game and Worker are unchanged. All career/leaderboard modifications below remain staged; no Supabase migration or Worker deployment was applied.

- First verified sign-in automatically uploads the existing local career. An older handoff sentence saying signup does not upload was stale and has been corrected.
- Daily XP is staged at 50 plus 0.5% of remaining points to next level, rounded. The consecutive-day multiplier adds 5% per day to a cap of 1.25×; missing a day resets streak, whose count caps at seven. Offline/cloud cores match. Daily-only play from level 30 to 50 takes 4,815 claims (13.19 years).
- Daily public leaderboard snapshots are staged at 04:15 UTC. Per-account career and bot contributions remain current; public boards can lag one day. The refresh aggregates directly from private career/account/bot-contribution tables and does not call the public snapshot RPCs. A local stress model passed 1,000 accounts/players, 54 bot names, and 5,000 public reads without reaggregation. The SQL has not run in production.
- Automated local checks passed for 145 achievement thresholds/50 levels; 1,000-account × 54-name bot aggregation; daily player/bot snapshots; legacy restore and safeguards; no-scroll leaderboard rendering; player-account/client/API/signup/recovery/email-hook flows; and Worker v50 build.
- Rita’s supplied recovery source combines her Rita lifetime record with the local human You ledger, which the owner identified as the same player. Add counters, keep maximum high bid, merge/deduplicate human awards from both records, preserve all bot data, and floor points to 59,000 only if needed for level 16. Combined totals pre-floor: hands 348; bids won 64; high bid 130; bid sum 6,815; bids made 61; bids set 3; points 34,175; tricks 986; trick points 32,170; rook captures 92; Red 2 captures 86; big tricks 181; nest wins 71; nest points 3,175; games played 70; wins 42. No matching verified Rita auth account existed at the checkpoint; no cloud data changed. Preserve current cloud state before any future account-specific import; do not include or share the source backup recovery code.
- Full career handoff: brain/versions/AH/files/01_MASTER_BANK/CAREER_QA_HANDOFF_20261023.md. The local review ZIP opens at root index.html; it is not the playable game archive.

The full continuity rule follows and remains mandatory in all future handoffs, startup prompts, and Master Brain updates:

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
