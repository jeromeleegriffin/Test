# Atmosphere controls and House Effects finish — 2026-10-14

Baseline 3ab1dd3a8f69024d4613cd66d39127440eb7eb96; Brain AC, runtime 805-ownerreview. Latest owner screenshots identified brown House Effects pages. This completes their blue/gold surfaces, raised rows, selects/buttons; removed Animations screen remains removed. No gameplay animations removed.

Ambient thunderstorm defaults every 12 minutes of visible active play; 75-second existing rain loop with three synthesized distant rumbles. No new recording substituted for an approved asset. Storm and rain volumes separate; zero thunder disables storms. Existing rain/wildlife recordings unchanged. Crickets changed from 3–6 minutes to 2–4 minutes, selectable 4–8 or 1–2. Saved individual volumes for wind, birds, crickets, owl, distant wolf, rain, thunder. Existing fire volume and ambience mixer retained. Backgrounding cancels timers; return starts fresh intervals, without catch-up bursts. Rain avoids overlapping storm rain.

Game & Character Effects retains existing card/turn/tick/raven/haptic controls and adds saved Moon howl volume, using its existing recording and character bus. Sound variations screen exposes all 13 existing natural effect families and saved individual volumes, including card lift/set-down and bid up/down. Defaults preserve existing effect volume. Gameplay/bot/scoring rules unchanged.

Rules/reference paragraphs now split on sentence boundaries, not every42 words; rule section labels preserved, pretty wrapping and readable line-height. No new rule logic. Fixed-page navigation retained; no scrolling introduced.

Changed: cabin-ambience041.js, moon-howl.js, game060.js, menu-approved805.js, menu-approved805.css, index.html, sw060.js. Cache805-atmosphere1, runtime marker unchanged for private Worker compatibility. No Worker writes, ZIP, production, career, or asset changes.

Tests: actual module virtual-clock/audio harness confirms12-minute repeated storms, voice creation/gain, zero suppression, suspension cancellation/restart; not a real24-minute audio/device test. Browser at320x568,393x740,800x1100,800x360: all13 effects reachable, navy surfaces, no overflow, settings/reload, return navigation, rules pages, no page exceptions. Original embedded PCM recordings byte-identical. Physical Android audio balance and active service-worker upgrade remain owner review. No claim of full gameplay regression or perceptual thunder approval.

Rollback: forward restore these7runtime files from 3ab1dd3a8f69024d4613cd66d39127440eb7eb96, fresh cache revision, preserve newer unrelated work/settings. Existing complete-bank/chat-continuity rules remain applicable; this supplement does not replace them.
