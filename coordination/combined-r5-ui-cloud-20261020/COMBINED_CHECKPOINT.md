# Combined R5 UI and multiplayer checkpoint — no deployment

Owner requested combining the premium UI repairs, R5 fullscreen/package cleanup and current multiplayer. This isolated branch contains the exact native R5 runtime and current online source from 9b2258f632041fb7263586d1fe37dce26792844d. Native immutable source is eae0889b06b3ea39f4ed406fdf5a7b2a25831827. Root index remains native R5 and works in the original ZIP Loader; the online Worker injects its current adapter. Offline bots remain X1; server test bots retain their existing simpler policy.

## Actual integration changes

Both native entry and asset origins are pinned to R5 in both builders and generated Workers. The live builder had its own separate entry pin; changing only the isolated builder would mix old HTML and R5 assets. Both online adapter build guards now accept only the exact R5 build. Keeping the old guard caused a reproduced fail-closed refusal. After normalizing these pins and guard, generated Workers are byte-identical to the existing cloud checkpoint. No room protocol, reducer, timing, rule, privacy or deployment configuration was changed.

R5 preserves the repaired approved raster surfaces, complete borders, equal-height aligned scoreboard and utilities, solid walnut connector, centered time without the clock icon, immediate winning-trick cue and turn cue. All 1,508 runtime files match the R5 manifest. The approved original composition and owner's rejection evidence remain authority; RC3's earlier success claims remain superseded. No image generation or CSS material replacement. No table, avatar, cards, Bid Box, sorting, scoring or native AI redesign.

## Evidence and limits

Preservation/edge review: exact runtime hash comparison, original approved and owner images compared with final native render; source pixel provenance is retained in assets/house-premium-console/ASSET_PROVENANCE.json. All existing R4 asset and gameplay checks remain relevant because R5 has unchanged assets/cues.
Registration: 16 phone/tablet layouts, browser and explicitly labeled installed-mode simulation, equal top row, equal control faces, no opaque field backgrounds, long negative/positive score and 12:59 PM ink bounds, safe-area resolved-inset simulation. No native Android safe-area certification.
Real game: local combined Worker browser matches with two humans/two bots and four humans, target-100 test fixture, one hand each, 24/46 actions and three reconnects each; no page errors. All 12 local service unit scripts pass. Ten local service matches, 2,378 actions and 410 rejoins pass with accelerated test clock; those are not browser or hosted tests. Controlled valid final-trick Black Bird/Red Two scenes at 1x/3x/MAX paint real canvas frames, hold all four cards, finish once without cancellation and reveal score afterward. No skip control.
Timing: sampled real two-human match records 8/9 turn cues and four human win cues. Every captured win starts during play with resolvingTrick=true and four cards present; 0–0.3ms from local win-ready detection. This is local launch latency, not network latency. Five repeated native rotation windows sample 20 frames each; no parent/geometry flashing. The native code is exact R5. Real browser fullscreen and ordinary-tap/dismissal R5 evidence remains in the native source coordination.
Exact final ZIP Loader smoke passed decompression, full shuffle/deal, artwork load, real fullscreen entry and row alignment. Full exact-ZIP Loader hand passed with six discards, trump, legal card play, scoring, Last/Menu/Back, all speeds and real fullscreen; no page errors. See LOADER_FULL_HAND.json. Prior full native hand matrix is preserved in R4 recovery and R5 evidence, not repackaged into the player ZIP.

No combined hosted verification or physical Android Chrome-notice acceptance. Existing live beta is unchanged. No deploy, main update, secret/binding/namespace change, player reset or service-worker unregister/cache purge. Do not infer permission to deploy from this source merge.

## Cumulative delivery

Griffin_House_Combined_R5_UI_Multiplayer_Candidate_20261020.zip
Bytes 165198795; SHA256 be539242322642d1eaaaea062b4c43361f9906429653102d66de5bea14a7d257.
1,508 native runtime files + 154 cloud source files + two compact root notes/manifests; no duplicate complete game or historical QA recordings. The backend still needs a separately authorized future deployment to update hosted multiplayer. This source candidate combines all published work available at the recorded heads; unpublished edits in another chat are not automatically visible.

## Continue safely

Use this branch over stale separate R4/fullscreen-unresolved handoffs. Preserve the exact R5 native pin and online base; do not substitute native files for the Worker or drop pace, collection, voice/trump, claim/redeal, Invite/QR/Close, reconnect/private-hand protections. Recheck the online branch before any later merge/deploy. Read foundational Master Brain H section 3, chronological authorities and recovery FOUR_PASS_REPAIR_BRIEF in full. Earlier positive RC3 QA is superseded by owner rejection. Protected Test main is a10cf91d27a9e1b9fa9cf82129c307a4462b11ad; preserve original Loader and all rollback archives. This isolated publication has only source-check CI and does not deploy.

## Verification attempts retained

Initial old guard refused R5 as designed; fixed exact guard and retested. One draft local checkout was not R5 and was discarded before acceptance. Original browser card-center click was unstable on animated overlapping cards; QA now uses an exposed, DOM hit-tested physical click, with no forced click or game logic mutation. Bird QA changed load-event wait to DOM readiness because lazy asset loading outlasted load timeout. First full Loader harness attempted pace during dealing; it now waits for a visible bidding control. No product code was changed for these harness timings. Failed captures/logs remain in the local QA directory. Syntax checks pass for 13 changed JS/MJS files; full npm check was not run locally because acorn/developer dependencies were unavailable.
