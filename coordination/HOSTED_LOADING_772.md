GRIFFIN HOUSE OF ROOKS — 772 LOADING REPAIR REVIEW
Owner Jerome Griffin. October12 UTC / October11,2026 Eastern. ISOLATED, NOT DEPLOYED, NOT OWNER APPROVED.

Continue from approved771. BrainY remains current. User confirmed771ZIP works in loader but hosted /Test/ showed missing card faces, old avatars and old shuffle during startup. Owner video libfile_ab338fed4768819180e6f86c31c934a6 shows green blank hand card at about8.5seconds, followed by its artwork; new characters/shuffle present. Exact hosted files matched771. Local delayed/failed-request tests reproduced the symptoms without old service workers. Phone cache state remains unmeasured; do not claim all symptoms exclusively explained.

SOURCE / OUTPUT
771.zip SHA256 c342f1e67db3f62a0fe69b1ecf71a309ca85e5fddda5603202c77a0239f28b8c, untouched.
772.zip SHA256 1bbba202c01718678e45ad881183f969e38b4bf55ab3e559c9d39b90307ae6c0; 87150590bytes; 392files; 99865546uncompressedbytes. Only2981compressedbytes larger than771.
Shared reservation772: hosted-loading-fa72cc1b4ad4-20261012. Approval remains771. Production and hosted771 remain unchanged. Long766audit remains paused. No artwork generation or recompression. All12concepts and prior Cleaner archives remain protected.

IMPLEMENTATION
New asset-loading772.js/css: bounded four-lane startup warming plus existing character requests;71images (44numbered faces,10character PNGs,2premium bird faces,1poster,14shuffle atlases). Wait for image load/decode; retry each up to3times with12second timeout perattempt. Offline Play capture gate joins preparation; no original game handler executes until ready. Progress appears on existing Play button; persistent failure leaves lobby with a retry message; tapping Play retries without storage reset. No matches/deals/scores/room-state written by loader. Existing original Play handler resumes once. Joining/hosting multiplayer is NOT gated by this change and has not been certified; module warming still occurs.
Numbered cards have a readable suit-colored rank/color fallback while images load; premium birds have plain identity labels. Fallback disappears on successful image load, and rendered card errors get bounded retries. Approved complete face image remains identical. The first visual fallback attempt inherited legacy gold typography; replaced fallback child classes with dedicated selectors, final red8/color screenshot verified.
Characters retry failed loads via shared loader on later interaction/online/visibility; startup gate avoids the old portraits during normal offline entry. Existing seat positions, masks, identities, status pills and voice mapping unchanged.
Shuffle first-sheet promise resets afterfailure; missing page retries have1second cooldown. Portrait transient failure holds the approved poster/last frame and retries instead of starting the obsolete shuffle. Landscape and explicit legacy switch remain unchanged; audio timing and geometry unchanged. No added gameplay delay after startup.
Serviceworker772 explicitly precaches all44numbered faces, previously dynamically cached only. This matters during upgrades when early image requests are served by the old worker. Existing install/activate/fetch behavior remains; no cache deletion added. New module/style included; version metadata772. Workerinstallation still requires complete SHELL; first visit must download assets. This is reliability work, not smaller assets or a measured hosting-speed improvement.
Changed: characters077.js, rules.js, shuffle-asset.js, signature-shuffle.js, index.html, game060.js(version only), hor-version.js, sw060.js. Added2loading files. Artwork/audio/X1/bot logic/Table003/cardholder/BidDock/geometry byte-preserved.

TESTS / EVIDENCE
Chromium153 Linux mobile/touch simulation; physical Android NOT run by assistant.
Normal startup, held card-image response, one transient failure, persistent3-attempt failure and subsequent Play retry: passed;71/71images ready, no missing hand faces, characters ready, saved-data sentinel intact, zero JS errors.
Delayed face after boot: fallback readable while image pending, hidden after success. Actual screenshot inspected. Fully loaded cards retain source artwork.
ActualBid and controlled winning-bid -> Kitty -> six taps ->Confirm -> trump passed. Tablet status clipping, LAST and offline worker772 coherence passed.
771->772 same-origin update: after complete worker activation, page/script/worker772 coherent, prior771cache retained, localStorage sentinel unchanged; offline reload prepares71/71images; repeatonlinevisit71/71 passed.
First upgrade test went offline before workertransition settled and failed; revised test explicitly awaits settled new worker. Then uncovered missing explicit numbered-card precache; fixed and retested successfully. Initial failures retained, not reported as passes.
Shuffle first-fetchfailure plus later-sheetfailure and samepage recovery passed; no legacy fallback. First later-sheet test targetedwrongatlas10 instead of11 for mappedframe137; corrected fixture and final assertion passed. Preliminary evidence retained.
No long tournament/fullmatch, physical device bandwidth/timing, real owner's old712worker migration, live PeerJS, audio-hardware or performance benchmark claimed. Offline tested after installation completes, not while assets are still downloading. First visit can show Loading table until requiredart is ready; no claim of instant start on weak networks.

REVIEW / ROLLBACK
Open772ZIP using the same isolated loader as771. Verify marker772, unchanged loaded artwork, bid/pass/kitty/discard and normal play. Loader review cannot establish hosted cold-network acceptance. Hosted staging requires separate approval; no new hostedcandidate published by this task. For a local browser test serve extractedfolder via python -m http.server8002; use proper spacing: python -m http.server 8002. LAN HTTP generally does not support serviceworkers, so offline/update acceptance needs approved secure/localhost setup. Do not clear user data/caches or use FRESH as a repair.
Rollback: close772, return untouched771ZIP/current Test. Do not downgrade live runtime automatically. Strict allowlistpackager remains; evidence/docs stay outside playableZIP. Proposed future hosting choice deferred until measured after loading correction.

NEXT
Owner review isolated772, then authorize scoped hosted test if desired. Keep771accepted ZIP separate from unresolved hosted acceptance. Do not promote772automatically. Publish complete Brain successor only within authorization; currentBrainY frozen. Coordination checkpoint supplementsY. Preserve full rules below in successor handoffs.

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

Explicit successor requirement: Pass both permanent rules verbatim to every future replacement chat.



SAVED DELIVERY
772.zip Library libfile_977e5ff38f108191a0cd9319764c732e
772-Review.html Library libfile_cff0be8649308191ae4753cd3182b699
772-Evidence.tar.gz Library libfile_5bf2422aa35c81919e187810f15fc4da
All three saves succeeded with local metadata applied. No runtime deployed. Master Brain Y remains current; full checkpoint ready for future authorized successor.


CURRENT UPDATE — October12 UTC / October11 Eastern
Jerome confirmed: “Okay, 772 works in a loader.” He answered “Yes” to publishing this exact772 to the TEST SITE ONLY, production untouched. This supersedes the pre-publication status above. Runtime commit f9334187d84a2d0ee503807232cef419efe4c99d; GitHub Pages run38198112595 succeeded. All392runtime Git blobs match the approved test ZIP; ten changed/new served files match exact SHA256bytes. See HOSTED_772_DEPLOYMENT.json. URL https://jeromeleegriffin.github.io/Test/. Hosted Android acceptance remains PENDING; loader acceptance is not proof network behavior is resolved. Production and user data/caches untouched. BrainY frozen; this coordination record is the current772deployment supplement. Rollback runtime source is parent c5d95c958ea927ee603c140204260be2b7e8baad; restore only runtime in a new commit if authorized, preserving newer coordination. No automatic rollback or cache reset.
