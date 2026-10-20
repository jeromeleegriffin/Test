# Individual multiplayer bot-seat repair

Owner observed one seat tap filling all three bots. Confirmed adapter onWaitSeatClick invoked bulk fill with empty body. Repair passes requested seat to authenticated room service; host only, waiting rooms only, rejects occupied/invalid seats. Existing Fill seats retains bulk behavior. No namespace migration or data reset.

Live Worker griffin-house-of-rooks-online; version 62b524aa-6488-46db-8847-337b42cda4bc; deployment 9b6f2daa-8db7-4070-bce8-675474834528. Exact deployed source readback matches. Prior rollback version aa209069-9cb8-4051-820c-c55ca5717eb8; source also preserved in scratch rollback-aa209069.mjs and prior Git code commit 80e1604dee30456ede21569b3f774b09fe62bfca. Preserve namespace bb1bf1c32b68451cbe5db6fee3066fa0 and all secret bindings on rollback.

Executed: local and hosted native Chromium mobile viewport: click actual #waitSeat1, verify exactly one bot/two occupied, two seats open, Start disabled. Actual screenshots captured. Unit: human seat cannot be replaced, unauthorized guest denied, invalid/duplicate seat denied, bulk fill preserved. Opening regression unit also passes.

Hosted one human + three bots native Start at regular pace: presentation, shuffle, card flight observed; bidding after 13.064s, no early bid control at initial shuffling phase. Owner remains uncertain whether multiplayer shuffle worked on their device; this automated browser result is not physical Android proof. Bot bids still batch immediately when opening finishes; that timing has not been changed. No additional full matches in this targeted repair. Existing broader results in LIVE_RELEASE_20261020.md remain historical, not rerun on this version.

Continue investigation of owner's multiplayer opening report without attributing it to cache. No new shuffle repair deployed here. Simple test bots are not X1. Existing approved artwork/offline/landscape unchanged; no careers/settings cleared. Protected original/private Workers unchanged. Follow complete permanent preservation/continuity rules reproduced in LIVE_RELEASE_20261020.md. Master Brain history untouched.
