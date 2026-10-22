# Facebook sharing preview: isolated draft

Status: REVIEW ONLY. Do not deploy until the final approved original-artwork banner is ready and the Facebook Sharing Debugger confirms the scrape.

## Current state
- Source baseline: work/asset-recovery-20261021; main branch brain/current.json indicates AH/R12 Cloudflare-only canonical at time of task.
- The game index previously contained only <title>House of Rooks</title>, with no static Open Graph tags.
- This branch adds static Open Graph, canonical, description and X/Twitter metadata to index.html. Facebook should receive metadata from raw HTML without executing JavaScript.
- The image path currently points to the existing assets/images/splash-battle.png as a **temporary draft**, NOT the final approved 1200x630 banner. Its exact pixel dimensions and social-crawler accessibility must be tested before launch.

## Required pre-publication gate
1. Obtain the owner's actual approved table, card art and wordmark from project's asset authority.
2. Build and visually approve a 1200x630 original-artwork banner, ideally JPG/PNG with legible safe-center text and no CSS reconstruction.
3. Ship the final banner as a static Cloudflare-served image (e.g. /assets/social/house-of-rooks-facebook-v1.jpg), ensuring HTTP 200, correct content type, no login, no redirects.
4. Replace both og:image and twitter:image URLs in index.html with the absolute production URL; add og:image:width=1200, og:image:height=630 only after checking actual dimensions.
5. Test raw HTML with curl and FB Sharing Debugger (https://developers.facebook.com/tools/debug/), then scrape again and inspect image/title/description and clickthrough.
6. Test share copy and single canonical link on Facebook mobile, Messenger and desktop; confirm link opens game and does not lead to a blank PWA/install page.
7. Do not publish a promotional Facebook post before all tests pass. Sharing Debugger refresh does not guarantee changes to existing posts.

## Deployment policy
- This branch does not change gameplay, Worker logic, game assets, service workers, or deployed runtime.
- Do not deploy from this branch as-is: baseline may be behind R12 current live source, and the preview image is a placeholder.
- Rebase or cherry-pick only the reviewed metadata onto the current Cloudflare canonical source once owner approves the banner.

## Copy
Title: Griffin House of Rooks | Play Free Online
Description: Pull up a chair and play Rook! Challenge computer opponents or invite friends to your own table. Free to play, no download required.
Canonical: https://griffin-house-of-rooks-online.jeromeleegriffin.workers.dev/
