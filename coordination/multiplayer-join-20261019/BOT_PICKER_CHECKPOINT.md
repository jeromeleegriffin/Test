# Bot picker layout repair — October 19, 2026

Owner request: “All right, we need to clean up this mess too.” Inline phone screenshots 71915.jpg and 71913.jpg show descriptions spilling beyond card borders, adjacent rows overlapping, and partial rows clipped behind the footer. Supplied local attachment paths were unavailable; the inline originals were visually inspected, not retrieved through Library.

Status: implemented and browser-tested isolated candidate; NOT deployed to Test/main, production or Cloudflare. No new game ZIP. Runtime 846-picker-review-20261019. Exact tested source commit 3c8599441806bfffab10d9a6ab054c2b15002617; parent 7379fb992e099906fb76319b96e606291cae8c12 preserves the join repair and all prior effects/recap changes. Original delivered ZIPs remain immutable. Published Brain AF and all existing pixel authorities remain unchanged. This record supersedes the prior join-only candidate runtime marker, not its test results or preservation requirements.

## Cause and scoped change

menu-approved805.js bypassed its complete-page algorithm for botPickerModal, sending Previous/Next into the shared continuous-scroll row helper. review839.css restored a scroll list while other style layers assigned fixed row/card heights. Text could grow beyond the card and scroll could stop mid-row.

The picker now uses the existing measured page algorithm with search filtering, showing only complete cards that fit the list area. Previous/Next changes actual pages. ui-audit841.css contains the picker-specific containment/layout rule: natural card height, compact portrait/name/style header, fully wrapping description, no line clamp, explicit hidden-item behavior and no scrolling list. Its short-landscape row constraint also uses natural height. The shared identity chooser, partner selector and history logic remain otherwise intact.

Runtime changes: menu-approved805.js and ui-audit841.css. game060.js changes only APP_VERSION relative to the verified join candidate; index.html, hor-version.js and sw060.js receive the coherent new candidate marker. No bot strategy, roster, sorting/ranking, career data, selection handler, availability protection, artwork, table geometry, Bid Dock or sounds changed.

## Executed verification

The actual game was opened from its pinned Git source in a purpose-built iframe with real CSS viewport dimensions. A real disposable PeerJS host table PNMQ was created. Its real partner picker was exercised, with 52 available choices in this synthetic profile.

- 393 × 740: nine pages, all 52 choices reached, no card/list overflow.
- 320 × 568: thirteen pages, all 52 choices reached, no card/list overflow.
- 430 × 740: nine pages, all 52 choices reached, no card/list overflow.
- 740 × 320: eighteen pages, all 52 choices reached, no card/list overflow.
- 768 × 900: nine settled pages, all 52 choices reached, no card/list overflow.

58 complete pages verified across the final five-size results. Metrics inspect actual visible DOM bounds, scroll width/height and every available name; screenshots visually verify the actual 393-pixel result, including the Fang/Halo/Quill/Bramble/Cinder/Gable description page matching the owner's reported problem. No game-state injection or style injection was used. Original browser JSON preserves all observations.

Initial tablet sweep read the previous 18-page landscape layout before the resize callback ran, then clicked Next on the new nine-page layout, so only 49 names were recorded. This was a test timing discrepancy, not a demonstrated missing-bot defect. Repeating after resize settled reached all 52 with zero overflow; both results remain preserved.

Empty search visibly shows “No matching bots. Try another name or style.” Search for Moss showed the one actual matching choice. Selecting it closed the picker and placed Moss in the intended partner seat; host showed 2 of 4 seated. Reopening another seat and navigating to a full-description page worked. Cancel and Leave returned to the landing page; disposable PNMQ was closed.

All 16 prior actual-function join regressions pass against this candidate. Project source check passes: 65 scripts, 4554 local bindings, entry dependencies and 1454 unique precache paths. All other game code remains unchanged except the runtime string. No fresh full match, physical Android, assistive text scaling, installed-service-worker upgrade or WAN guest connection acceptance is claimed.

## Durable evidence and rollback

BROWSER_PICKER_RESULTS.json preserves the raw initial sweep, settled tablet retry and search/selection checks. picker-fixed-393.jpg and picker-descriptions-fixed-393.jpg are the exact captured JPEG bytes. picker-review.html is a diagnostic frame, not part of the production menu.

Rollback for only the picker repair is parent 7379fb992e099906fb76319b96e606291cae8c12's six changed runtime files, preserving later documentation and player data; never force-reset shared main or clear caches. Revert source through a new reviewed commit if authorized. The previous join-only candidate stays preserved in history.

Next: owner visual review and any requested refinement in isolation. Publishing the live sites or moving the transport to Cloudflare remains a separately scoped action. Sorting and laydown findings from this conversation remain pending and were not silently modified here. Refresh the current Brain and repository heads before publication.

Pass both complete permanent rules below verbatim to each successor's handoff, startup and future Brain update, requiring the obligation to continue again.

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
