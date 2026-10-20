# R6 — Android fullscreen notice blocks controls: physical evidence and repair

Continue R6, not R4/R5. No Pages, production, Cloudflare or main-branch deployment.
Complete player ZIP: Griffin_House_Android_Control_Access_Clean_Game_20261020_R6.zip
Library ID: libfile_851e02f127508191af72b2ed5e450cd4
164,744,257 bytes; SHA256 0bf809c317136b1443e90f9ee876236cfa819acf68b43f9aad0a29fcac110981
Build: 846-premium-owner-repair-20261020-r6. Root index.html, complete Loader-compatible runtime, no test-evidence folder. Original R4/R5 preserved.

## Owner evidence overrides prior tests

Physical Android recording Screen_Recording_20261020_043202_Chrome.mp4, Library ID libfile_42abd732378c8191817fbd3b624d62c1, duration26.921s,1080x2340. Chrome's own native fullscreen notice with jeromeleegriffin.github.io remains over the bottom controls at2,12 and24seconds. It covers bidding and then the six-card discard confirmation. This is an accessibility/blocking defect. The recording does not show an authoritative build ID, so do not claim it proves which candidate was loaded. R5's repeated-request fix did not establish physical resolution of this browser notice.

## Repair and tradeoff

Android now uses browser-fit mode instead of requestFullscreen, including the premium screen button, menu/lobby controls and the premium fallback when the main controller is unavailable. Fit screen / Restore view labels accurately describe it. Android native fullscreen API requests are zero in the tested paths. Default Android fit mode uses the actual available viewport; Chrome's browser bars may remain visible. This avoids triggering the native security warning, rather than trying to hide or bypass Chrome's security UI.

If an accessible same-origin Loader parent is already fullscreen, the Android child exits that native fullscreen before fitting. Cross-origin parent access is caught; no attempt to bypass origin restrictions. Installed-app display mode itself is not removed. Non-Android native fullscreen remains through the guarded explicit button. R5's passive legacy viewport hooks/no ordinary-tap entry remain.

Premium console and portrait rail integration recognize fit mode, retaining approved assets/layout decisions. No artwork, CSS material replacement, avatar-size change, Bid Dock change, rules/network change or landscape camera redesign. Runtime version/query/service-worker identities advance toR6; no unregister, storage clear or career/XP/settings reset. Prior caches retained.

## Executed final checks

- Android-user-agent desktop Chromium393x740 and600x900: zero native requests even when the screen button is toggled, human Moon bid confirmation, six selected discards, real Confirm Discard click and entry to trump. Phone discard button(x86.5,y690,w220,h42) fits740px; tablet(x190,y850,w220,h42) fits900px. Zero page errors.
- Real Chromium native fullscreen of a test Loader parent: Android child exits it, reaches native game bidding, rotates landscape and back without re-entering native fullscreen. Zero page errors.
- Desktop-UA native entry/exit, external browser dismissal and orientation/device metrics at393 and768widths passed. Exactly two entries/two exits each; no extra requests. Synthetic ordinary-pointer events also exercised passive hooks.
- Android-UA full offline hand atMAX:10human card plays, visible scoreboard, zero page errors. Not a full match and not physical Android acceptance.
- Actual screenshots inspected, including phone discard control, tablet and final score. Source syntax checks passed.
- All1386files in assets/,voices/,x1/ are byte-identical toR5. Inherited R5 audit confirmed those unchanged fromR4. ZIP integrity passed;1510runtime files, index atroot, no REPAIR_VERIFICATION payload.

Failures retained: first local candidate had a new helper-name collision with the existing partner label, corrected before release; first control harness waited for the human turn before dismissing a tour that could pause bot turns; corrected harness dismisses tour first. A desktop pointer test opened a valid avatar stat modal and then blocked its own fullscreen click; corrected event test avoids that unintended action. These failed attempts are not counted as passes. No additional gameplay patch was layered for those harness failures.

## Preservation / coordination

Do not ship R5 as the final Android notice remedy. R6 is the latest UI/fullscreen candidate, including the earlier R4 console/header/clock/connector/immediate-win-flash changes and R5 packaging reduction. The owner wants UI and multiplayer combined eventually; use R6 as the UI input, not older R4/R5. Do not blindly replace the Cloudflare adapter/runtime pin: it currently checks the older846 build identity. Integration needs its own compatibility edits and complete hosted multiplayer tests. No such merge or deployment was performed here.

The Cloudflare beta branch remains work/cloudflare-846-native-adapter-20261019 at9b2258f632041fb7263586d1fe37dce26792844d, Worker0ddb4c03-6920-455a-aea5-4b16cd0ba766. Preserve its rooms, signing secret, namespace and passing fixes. Do not overwrite protected private Workers.

R6 patch is against the exact delivered R5 source. The isolated Git evidence branch preserves a patch and handoff, NOT a claim that its older root game is the R6 runtime. The complete saved R6 ZIP is source authority. Original R5 Library ID libfile_1ad71b8ddee8819195b2758537cb991a; SHA256 e2238fd2034a656d89a94febff085ed7889f364889010555a341e79a202f71a4. Original R4 ID libfile_307eb24be414819187e0b0f3441e6fda; SHA256 d9883684ccb5b7b6b30a5b83a10f5edcb05503e52eeb5865991f8a646232c996.

Still unverified: physical R6 on the owner's Android Chrome, physical OS warning disappearance if Chrome has retained an already-stuck overlay, and independent cellular testing. Do not claim those passed. The confirmed mechanism is avoidance of native requests plus reachable controls in rendered simulations. No need to have the owner repeat hundreds of hands.

New R6 screenshots and test receipts: Griffin_House_R6_Control_Access_Verification_20261020.zip; Library ID libfile_625c774f3b3881918bea99ee470d35ae. Player download remains the single clean R6 game ZIP.
