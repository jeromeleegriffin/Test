# Build 810 — complete loading integration review game

Owner: Jerome Griffin. Date: 2026-10-15. Status: delivered for Android review; not owner-approved and not deployed. Landscape remains separate at work/overhead-landscape-20261014, checkpoint 073457d875a93d2a9b73e434e05d233b924c2f4e.

## Source reconciliation
Source: Test/main f487af34130adc91f90ce542fee8b826969120a0. Its last change is documentation; runtime matches the loading package's intended 0b65ec4c11e4ef021c100257a19e62d6cff5fbc7 baseline. All ten supplied rollback hashes matched exactly before applying the reviewed changes. This preserves newer current-main repairs rather than replacing them with an older full ZIP.

808-local-playable.zip SHA-256 c22e19719963d1d26aa15a99606280d5a2d919d5514fd6bbe932089db2390a22 was independently read. It differs from current main in 32 shared files, including menus, rules wording, careers, audio, game and X1 files. Higher package number did not mean newer complete source. The supplied Loading-87101e-review(2).zip SHA-256 ecf9464a4b41271ffa9e058fab86403a7ddde916596b545bae22e8b95dc2ef63 contains 49 source/evidence entries, not a complete game. Its ten-file loading delta was integrated into the exact matching current-main runtime.

## Changes
Eleven runtime files changed relative to source: asset-loading772.js, characters077.js, friends803.js, hor-version.js, index.html, landing783.js, polish.js, rules.js, sw060.js, trump714.js, game060.js. game060.js changes only APP_VERSION to 810; engine behavior is byte-identical after normalizing that marker. No X1, bot intelligence, artwork files, gameplay rules, saved-data schema, career engine or landscape geometry edits.

Original supplied two-bird inline artwork and thin gold borders retained, with existing smooth motion/fade and genuine asset readiness. Selected artwork decoding, premium-card image recovery and cache reuse from the supplied integration are preserved. Build/page/script/worker identifiers now consistently identify 810; cache is house-of-rooks-810-loading.

Confirmed loader defect: requireImages/prepare could reopen the full-screen blocking overlay after startup when gameplay added new image URLs. Added a one-way initial-reveal latch: initial essential failures still gate startup and offer Retry; after the first complete reveal, subsequent artwork requests continue loading without hiding the running game. The exact Android first-card freeze reported on 808-loading-review was NOT reproduced or proven to have this cause. Do not label it conclusively fixed solely from this source defect.

## Executed tests
PASS: human controls in portrait at 1x, 3x and MAX: bid195 using +5, Kitty Continue, select six of sixteen discards, green trump confirmation, legal card taps and completed scored hand. X1 explicitly active/ready; 30/30/24 recorded decisions respectively, zero fallbacks, zero JavaScript errors. No diagnostic SOL takeover used. Random deals, not a replay of the reported Black Bird first-card Android hand.
PASS: real service-worker install, required code/X1 cache checks, offline reload and offline startup, coherent page/script/worker version, no missing local requests or JavaScript errors.
PASS: injected essential-image HTTP503 holds initial progress below100 and displays Retry; successful Retry reaches100 and hides overlay.
PASS: delayed image added after initial reveal never restores overlay or html.house-loading; request resolves normally.
PASS: all changed JavaScript parses; cumulative patch reconstructs all eleven files byte-for-byte; engine differs only by version marker. Full ZIP CRC and runtime manifest verified when packaged.

Test harness corrections: initial local server omitted SVG MIME type, so lantern decode failed; corrected test server and reran. Initial portrait test inherited landscape's combined discard assumption; corrected it to click the actual Kitty Continue button. These were test-environment/harness failures, not game fixes. Supplied package's 23 earlier test claims are retained as third-party evidence, not counted as newly executed here.

## Limits and Android checklist
No physical Android verification, full match, live multiplayer, private Cloudflare, Android background/resume, or exhaustive avatar/saved-career migration test in this stage. Preserve original files and real saves. The earlier reported first-card stall remains an Android acceptance focus.
1. Open 810.zip in the existing game loader and confirm the supplied loading design appears and finishes.
2. Win a bid, Continue from Kitty, discard six, choose trump and play the first card; check bots respond, including when leading Black Bird if dealt.
3. Finish a hand at your normal speed; confirm menus, career/levels and sound remain present.
4. After initial caching, reopen offline; try leaving the browser and returning during play.
5. Report any stall with the last action, speed, visible card and screenshot. Do not clear your player data.

## Rollback and coordination
Original archives are untouched. Use the previous game package or complete source f487af34130adc91f90ce542fee8b826969120a0 in a separate folder; reverse 810.patch only after checking the exact candidate hashes. Do not reset current shared main, erase caches or overwrite another specialist's work. Official pre-landscape rollback b551144768084fc81c12de03682eae4e78f8e600 remains unchanged and is not falsely promoted to newer source.

810 was atomically reserved in coordination/build-reservations/810.json. Historical 806–809 packages were reconciled as unavailable/conflicting/reference packages. Master Brain successor will record the exact delivered ZIP identity, source, tests and limits; separate chats must read it on resume. No automatic notification is claimed. No Test or production runtime deployment authorized or performed by this task.
