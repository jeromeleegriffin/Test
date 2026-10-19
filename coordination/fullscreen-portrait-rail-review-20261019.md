# Full-screen portrait rail alignment (ISOLATED, NOT APPROVED)

Branch: work/fullscreen-portrait-rail-20261019
Base: Test commit 92872799e09a92a9093346345219f6e743e1295f
Production untouched. Test main untouched.

Owner goals (2026-10-19):
- Keep the approved TABLE-003 playing table and people unchanged.
- Put the original cards/holder against the front table rail in *installed full-screen* portrait.
- Do not stretch the lower pedestal to absorb extra height.
- Reserve genuine spare space below for future compact match score and optional local clock.
- Retain browser-mode portrait and the newest sorting/bidding/multiplayer/audio fixes.
- Never silently change production or the working screen.

Review-only implementation:
- coordination/portrait-fullscreen-rail-review.css
- coordination/portrait-fullscreen-rail-review.js
- index.html includes them on this branch; they are inert unless ?railReview=1 is present.
- Calculates background cover from the existing 875 x 1797 TABLE-003 source and reads #hor-room-bg dimensions.
- Moves the complete hand-area as one *paint-only* translation, retaining its flex-space and the current card size.
- Moves the currently visible portrait bidding dock by the same review delta.
- Source-image holderTop=1430 is a PHOTO ESTIMATE, not an approved actual-pixel measurement.
- The review calculation only activates inside portrait installed display modes (fullscreen/standalone/minimal-ui); ordinary browser Chrome layout stays untouched, even if the query switch is present. The bid offset is in the existing approved portrait bid cascade layer. No clock/score UI and no clipping/masking are enabled yet. Do not promote this as a finished repair.

Required validation before further development:
1. Confirm native Chrome viewport, installed PWA fullscreen viewport, small phone and Onn tablet, both orientations.
2. Compare actual rail and HOLDER049 boundary using owner-approved screenshots. Adjust SOURCE coordinate, not arbitrary screen px.
3. Verify bids including Shoot the Moon, nest/discards, trump stamp, card fan, card tapping, turn cues, last trick and scoring. Check overlays anchored to hand.
4. Confirm CSS paint coordinates after resize, browser bars changing, wake/resume, page reload and cache/service-worker handoff.
5. Once actual pixels are owner-approved, consider masking the decorative pedestal below the rail and designing a noninteractive bottom utility strip with compact match score/optional 12-hour local time, without obscuring Android gestures.
6. Do not deploy to either GitHub Pages main or Cloudflare. Keep no-arbitrary-redesign / protected art and Bid Dock rules.

Known limit: There has been NO phone/browser playthrough of this isolated candidate. The review switch requires the non-main branch to be served in a separate preview environment; branch creation alone does not publish a GitHub Pages preview. Exact alignment and Bid Dock behavior are UNVERIFIED.
