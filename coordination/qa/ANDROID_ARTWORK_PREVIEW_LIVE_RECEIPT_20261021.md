# Griffin House of Rooks — Isolated Android Artwork Recovery Preview
Date: 2026-10-21
Status: PUBLISHED_ISOLATED_TEST_ONLY — AWAITING_PHYSICAL_ANDROID_ACCEPTANCE

## Test link
https://griffin-rooks-art-recovery-test.jeromeleegriffin.workers.dev/

Cloudflare Worker: griffin-rooks-art-recovery-test
Worker deployment: 2653aea3-eca1-4322-82db-982f7872cf0c
Worker version: ecb7b405-5340-4d03-96b1-58bedcfa783f
Worker source: coordination/qa/android-artwork-preview-worker.js (isolated branch)
Workers.dev: enabled; preview-version routes: disabled

## Exact sources
Original game assets + scripts: immutable Test commit 90078a710948c7643caafb18986e34dc71ce7cee
ONLY asset-loading772.js: repaired, reviewed branch commit 8a9ea83a3e197c48519695181bffcac716ea3cd5
HTML has a test-only title, the original live Friends-form action is disabled, and only in the test clone service worker registration is disabled to prevent a new 1472-item cache install. Original approved game files and physical card assets remain untouched.
No private credentials, rate-limit or room bindings. Room API disabled; Play Now offline against three bots only. Test and production sites unaffected.

## Hosted tests
- Latest hosted GitHub Actions check: https://github.com/jeromeleegriffin/Test/actions/runs/39659987165 (SUCCESS)
- Verified direct isolated Cloudflare test status endpoint, immutable SHA pins, repaired loader file, approved Bid Box CSS, preview HTML, no service-worker control, zero browser errors.
- An automated normal user Play Now click (after Preparing the House finished) reached a real bidding phase with 10 cards and 10 decoded card faces in mobile-width Chromium.
- The prior direct offline-hosted smoke test also reached 9 cards during the deal with 9 decoded assets, consistent card widths and no worker control.
- Previous isolated local Chromium tests: https://github.com/jeromeleegriffin/Test/actions/runs/39655606641 (SUCCESS), including original text-bird fallback then recovery, both critical CSS recoveries and actual 10-card sizing.

## Non-destruction confirmation
Live online Worker griffin-house-of-rooks-online latest deployment a319e805-c76c-462b-a18b-c59498a188d9; version f9fd3cd5-67a1-49ae-850d-7c2ca60c1ad7 at 100%, UNCHANGED after test deployment.
Neither GitHub live Test main nor Production repository or other current sites were modified by this Worker publication.
Saved live multiplayer rooms untouched; no service worker cache cleared.

## Owner validation needed
Open the test link on Android while on strong Wi-Fi. Wait for Preparing the House to finish, then press Take Your Seat / Play Now. Play a few tricks, optionally turn Wi-Fi off then back on, and verify real bird art/card faces and the full Bid Box recover normally without reload or losing play. This copy is offline-play-only, not a multiplayer or installed-PWA cache test.
If any problem, send a screenshot and say the step. Do not clear Chrome cache.
No three-site deployment should occur until owner acceptance and coordinated rollback planning.
