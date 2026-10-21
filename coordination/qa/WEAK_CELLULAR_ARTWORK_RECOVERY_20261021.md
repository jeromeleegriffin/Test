# R10 weak-cellular artwork recovery: isolated candidate QA
Date: 2026-10-21
Branch: work/asset-recovery-20261021
Production untouched.

## Observed owner-device failure
- On extremely weak cellular during Wi-Fi switch, Black Bird and Red Two displayed text fallback until image loaded.
- Numbered card faces looked unusually tiny and approved bid-box art was incomplete.
- Game continued; reconnecting to Wi-Fi restored visuals.
- Do not treat the accidental MP4 as evidence.

## Source-level root cause
- rules.js / polish.js intentionally show generic text when card image errors and reveal image on successful load.
- asset-loading772.js prior production implementation retries card images twice on errors, then stops; online retry only responds to required-preloader failures, not all existing errored DOM images.
- approved-bid-portrait.js uses the approved artwork in an img with class approved-bid-art; it was not included in the prior inline image retry selector.
- Asset loader runs before polish.js and approved-bid-portrait.js, and installs capture-phase image event handlers.
- Temporary tiny-card sizing may involve CSS late-loading, not merely images; this candidate does not assert it is fixed.

## Candidate
Change ONLY asset-loading772.js. Preserve actual image DOM nodes; retry failed bird/numbered/bid-art images after online/focus/visibility/network changes. On load, remove failed status. Limit repeated focus/network retries to one per image per five seconds, preserve URL if stale retry timer fires, and avoid full page reload, storage clears or substitute art.
No changes to X1, artwork files, UI geometry, bidding, rooms, sw060.js, or live servers.

## Verification
- JavaScript compile test passed.
- Isolated event simulation: recovery on network event, five-second throttle, subsequent retry, successful-load reset, old retry timer guards all passed.
- Branch/main diff: only asset-loading772.js changed.
- Existing renderer classes verified in rules.js and polish.js; bid artwork class in approved-bid-portrait.js.
- This is **not** fresh actual Android/Chrome testing. Weak-network broken CSS and tiny-card face symptom remain separately unverified.

## Release gate
1. Exercise rendered game on portrait and landscape with intentionally rejected bird, card and bid-art requests; confirm dimensions and approved fallback behavior.
2. Restore network and confirm each image recovers in place without game reload or intervention.
3. Test disconnect/reconnect with gameplay and existing offline cached code.
4. Only after passing, owner approves coordinated three-site deployment. Preserve original R10 rollback and do not clear service-worker caches.

## Follow-up static style/asset audit
- index.html explicitly references asset-loading772.css and approved-bid-portrait.css. Both are listed in sw060.js SHELL; polish.js and premium Red Two/Black Bird images are also listed. No missing path found in this focused check.
- Generic BLACK BIRD/RED 2 text is the intentional fallback defined by polish.js. Image load handlers switch back to approved artwork on successful load.
- The image-retry candidate does not reload CSS, and therefore does **not** prove that tiny card faces are repaired. Preserve this as a separate browser/network reproduction gate, not a resolved bug.
- Existing sw060.js network-first stylesheet responses use cached CSS after failed fetch. An actual Android cache population and throttled network replay is still required.

## Chromium browser regression, verified 2026-10-21
- Github Actions workflow: https://github.com/jeromeleegriffin/Test/actions/runs/39642713997
- Run completed SUCCESS; Chromium installation, browser test, screenshot artifact upload all succeeded.
- Test uses source-extracted artwork-recovery event handlers, four real DOM img elements, and deliberately aborted image requests followed by fulfilled approved source image responses.
- All four recovered in place; successful-load state cleared; minimum image box dimensions remained stable; zero page errors.
- Limit: isolated Chromium fixture, not the full game UI and not Android. Delayed CSS loading / tiny-card symptoms still need true full-game throttle test. No production deployment authorized by this isolated result alone.

## Final isolated candidate checks (current branch commit 547f6d3)
- Source checks: https://github.com/jeromeleegriffin/Test/actions/runs/39643345741 — SUCCESS, including source bindings and Prettier format check.
- Chromium browser test: https://github.com/jeromeleegriffin/Test/actions/runs/39643345774 — SUCCESS, now using the four real source images independently (RookPremium.png, Red2Premium.png, numbered red-10.png, bidbox-approved-scrollwork.png).
- These checks validate isolated real Chromium image failures and recovery, not the complete game-renderer integration nor weak-cellular Android OS.
- Next prerequisite for publication: final full-game/Android visual acceptance, especially tiny numbered-card sizing and any CSS partial load. Live R10 and X1 remain unchanged.

## Full-game Chromium smoke (2026-10-21)
- Workflow https://github.com/jeromeleegriffin/Test/actions/runs/39652005815 concluded SUCCESS.
- The isolated four-real-artwork image recovery regression passed, followed by a full native game HTML/DOM/critical CSS bootstrap smoke under failed premium bird request conditions.
- This improves confidence that the recovery code coexists with the real game. It is not a complete playthrough, does not establish tiny-card geometry under loaded/unloaded CSS, and does not represent physical Android network conditions.
- No live deployment. Device acceptance remains the final requirement before release.

## Verified production-renderer recovery candidate (2026-10-21, final isolated scope)

- Code change confined to `asset-loading772.js`. The approved artwork, dimensions, card rules, menus, rooms, X1 online v2 and service worker remain unchanged.
- Real observed failure: on near-zero cellular service when changing from Wi-Fi, premium Red Two and Black Bird showed their existing generic fallback, card faces looked tiny, and the approved Bid Box art loaded incompletely. Returning to Wi-Fi restored the original visuals. The accidental MP4 is not evidence.
- Root cause found in Chromium: a failed same-origin stylesheet may still expose `link.sheet` while `cssRules` throws a SecurityError. Merely checking `link.sheet` incorrectly marks the failed stylesheet as loaded. The candidate checks usable CSS rules safely and retries the original stylesheet URL in the same DOM position, without new CSS artwork or a page reload.
- The original native image DOM nodes retry with five-second throttling; success clears failure state, and repeatedly returning to Chrome causes no new image requests after recovery.
- Isolated source CI: https://github.com/jeromeleegriffin/Test/actions/runs/39654703092 — SUCCESS.
- Final Chromium QA: https://github.com/jeromeleegriffin/Test/actions/runs/39655606641 — SUCCESS. All three separate browser scripts passed.
- Final full-game browser evidence:
  - Both critical native CSS URLs were intentionally aborted; recovery restored 7 rules (approved Bid Box CSS) and 12 rules (card/loader CSS) with navigation count still 1.
  - Native Black Bird and Red Two text fallbacks appeared on deliberately failed image loads; their real approved artwork loaded later and hid fallback text.
  - Repeated online, focus and visibility events did not refetch already restored CSS or bird art.
  - Genuine offline game was started on 390×844 portrait Chromium AFTER the CSS and image disruptions. The actual 10-card hand rendered 32–33 CSS-pixel widths and 46 CSS-pixel heights, all 10 card images decoded, and navigation count remained 1.
  - A second independent real-hand run verified 10 visible card images and normal dimensions under standard connectivity.
- Scope limitation: not physical Android, not independent real cellular hardware/OS suspension and not the hosted X1 multiplayer hand. Do not claim those certified. Nothing was deployed or cache-cleared.
- Release gate: owner review and Android acceptance using a safe owner-accessible candidate. Coordinate all three site updates only with authorization and rollback plan, retaining R10 live until then.
