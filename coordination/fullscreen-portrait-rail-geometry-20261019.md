# Deterministic geometry review, not a browser acceptance test
Source image: 875x1797 pixels. Candidate holder rail anchor: image y=1430 (provisional).
cover = max(viewport_width/875, viewport_height/1797)
target = background_top + 1430 * cover
candidateShift = max(-floor(background_height * .4), min(0, round(target - unshiftedHolderTop)))
In ordinary Chrome/browser display mode: shift = 0.

Computed cases:
- Installed screenshot approximation, 709x1536, holder top=1415 => cover .8548, target 1222, shift -193, holder 1222.
- Chrome screenshot approximation, viewport 709x1260, background top 70, holder top 1225 => target 1229, but shift = 0.
- Small installed 360x740, holder top 683 => cover .4118, target 589, shift -94.
- Portrait tablet installed 800x1280, holder top 1190 => target 1307, shift 0; never push hand down.

NOTE: Approximation uses screenshot pixel coordinates, NOT live DOM or tested actual device geometry.
Constraints: PWA only, opt in by ?railReview=1, portrait only, preserve approved assets. Full-screen utility/clock and pedestal crop not implemented.
Acceptance blocker: need real screenshot/interaction test for holder-to-rail alignment, bird/nest/table positions, bid dock, short/fullscreen phone, tablet, and service worker.
