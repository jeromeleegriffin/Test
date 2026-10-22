# JeromeGriffin.com live setup (2026-10-22)

Status: Cloudflare DNS active; custom domains attached; live Rooks Worker code **unchanged**. Owner purchased the domain independently and said they also purchased a $5 Cloudflare plan. Billing access was not available via this connector; do not assume specific plan entitlements. Cloudflare zone reported "Free Website", which is separate from Workers billing.

## Addresses and routing

- https://jeromegriffin.com/ -> standalone Worker `jerome-griffin-site`, homepage (live, rendered HTML verified)
- https://www.jeromegriffin.com/ -> `jerome-griffin-site`, redirects to apex (Cloudflare browser landed at apex)
- https://jeromegriffin.com/rooks -> branded social landing page with approved exact Rooks JPEG and direct play link (rendered HTML and OG checked)
- https://jeromegriffin.com/apps -> app listing (same homepage Worker)
- https://apps.jeromegriffin.com/ -> app listing through same site Worker
- https://rooks.jeromegriffin.com/ -> original `griffin-house-of-rooks-online` Worker, same deployed game, assets and Durable Object bindings as original Cloudflare game (page rendered)
- https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/ -> legacy original address kept active and unchanged
- `holdem.jeromegriffin.com` NOT assigned or launched; Hold'em is advertised only as a future project.

DNS auto-created by Cloudflare: proxied AAAA entries for apex, www, apps, and rooks. All four Custom Domains enabled. Free Website zone active; TLS certificates provisioned/attached by Cloudflare.

## Social metadata

- Homepage OG title `Jerome Griffin | Apps & Games`, OG URL `https://jeromegriffin.com/`, distinct generated brand image `https://jeromegriffin.com/images/jerome-griffin-v1.png` at 1200x630.
- Rooks landing OG title `Griffin House of Rooks`, OG URL `https://jeromegriffin.com/rooks`, image `https://jeromegriffin.com/images/rooks-v1.jpg` at 1200x630. The approved artwork JPEG is identical to the successful separate Facebook test worker's embedded JPEG bytes, verified by source comparison. It is **not** newly generated.
- Apps directory OG title `Applications | Jerome Griffin`, brand image distinct from Rooks, canonical/OG URL `https://jeromegriffin.com/apps`.
- The game root `rooks.jeromegriffin.com` is the existing game Worker and does **not** yet have the approved Open Graph tags. Share `https://jeromegriffin.com/rooks` on Facebook until direct-game social unfurls are separately integrated and verified.
- Do not publicly post production game URL to Facebook or scrape it with the Facebook debugger until owner approves the actual production preview. A multi-page separate-worker test passed previously, but Facebook debugger on the new production domain has not yet been run.

## Browser origin/installation caveat

Browser localStorage, service-worker registrations, installed PWA shortcuts and offline caches are origin-scoped. They do not automatically migrate from the old workers.dev hostname to rooks.jeromegriffin.com. Existing player data were not erased or moved; the original address continues to work. Do not force redirects or clear service workers; plan a careful legacy profile/install migration before advising existing players to move.

## Runtime integrity

Custom domain attachment only: no edits to active Rooks Worker code, Durable Objects, assets, audio, bids, X1, room data, secrets or rate limit settings. `rooks.jeromegriffin.com` rendered the game's House of Rooks HTML, but a physical Android gameplay/reconnect/suspension roundtrip on the new hostname remains unverified. Check before broad promotion.

## Cloudflare service and source recovery

Standalone homepage Worker name: `jerome-griffin-site`.
Its **complete** Worker source, including the preserved Rooks share JPEG (147097 characters), is saved in this folder at `jerome-griffin-site-worker.js`. This is an isolated documentation/development branch, not a deployed game commit.

Cloudflare API to read authoritative deployed source: GET `/accounts/{account_id}/workers/scripts/jerome-griffin-site/content/v2`.

The domain registration is active, expiry `2027-10-22T04:47:05Z`; auto-renew was OFF at last check. No changes to billing or auto-renew were made.

Follow-up: review owner's opinion of homepage branding and page design, fully test new hostname gameplay, plan migration, then optionally wire direct-game `og:image` without damaging multiplayer. Keep Rooks' approved artwork unmodified. 
