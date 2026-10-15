# Stage 7 — offline cache and explicit X1 verification

Isolated continuation of 80a70666977e360acd9b234a6c61b048f26f6a8e. No deployment, new ZIP, build-number allocation, or Master Brain promotion.

Apply stage6 to a COMPLETE baseline, then replace sw060.js with this stage7 file. The worker adds five new landscape code/artwork URLs to the existing shell. Its internal build/cache labels are angle-c-isolated-stage7 / house-of-rooks-angle-c-isolated-stage7; these are isolated test identifiers, not official build numbers. Registration path and activation policy remain unchanged. Older caches are not deleted. Roll back this stage by restoring baseline sw060.js; roll back the whole experiment using the stage6 instructions.

## Local test-folder integrity finding
The locally assembled test folder was missing ten files present in the preserved GitHub baseline: four voices/jerome/trumps_are_*.ogg clips, five x1/*.js scripts, and vendor/peerjs.min.js. Restored exact files from b551144768084fc81c12de03682eae4e78f8e600; no edits to their code or assets. Hashes accompany this record. These are baseline recovery, not new game modifications. Stage6 earlier gameplay results establish UI/hand progression only and MUST NOT be cited as proof that X1 ran. The first offline test launched while recovery was still in progress timed out; it was rerun after all dependencies were present.

## Executed after full dependency restoration
PASS: all 927 precache entries resolve to local files (including query-string variants).
PASS: real Chromium service worker install/control, new artwork/code and X1 cache entries checked, browser network set offline, page reload, offline Take Your Seat and bidding startup. No missing-file requests and no JavaScript errors.
PASS: complete human-won hand at MAX, bid195 through existing +5 buttons, six discards, green trump, legal card taps through score. X1 status explicitly verified requested=x1, active=x1, worker ready, 30 recorded play decisions, zero fallbacks and no JavaScript errors. Actual roster avatar identities loaded correctly.
The human test now fails if X1 is inactive, not ready, records no decisions, or reports any fallback. Tests are browser emulation, not physical Android. Previous 1x/3x UI tests were not rerun with restored X1; do not claim those were X1-certified. Multiplayer, full match, suspension/reconnect, all local-seat positions and all avatar artwork remain unverified here.

## Files
Runtime modification this stage: sw060.js only. Tests: offline-c.cjs added, human-c.cjs strengthened. Restored baseline dependencies remain byte-identical and should already exist in any complete baseline checkout. Stage6 artwork limitations still apply, especially rear-view local avatars other than Jerome and preliminary table occlusion. Continue from this checkpoint without restarting or publishing.
