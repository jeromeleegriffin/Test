# Human-only Moon — owner rule change, October 21, 2026

The owner explicitly directs: no bot may Shoot the Moon; a human's failed Moon loses the match; all player-facing Moon rules must reflect this. This supersedes the earlier AH Moon-frequency tuning investigation.

## Cause established before policy change

The deployed Worker version 73aa7be6-9dc0-43ee-a267-20e9fe0f1c62 was downloaded through Cloudflare and its relevant functions inspected directly. X1 v2's extended utility assigns terminal wins +10,000 while most nonterminal failed Moons cost only a few hundred. Its broad power>=90 gate offers Moon frequently. This produces an actual behavioral regression; the named-bot patch was cosmetic and did not introduce it.

A deterministic A/B of 500 identical deals, fresh 0–0 scores, 500 target, one simulated human using the previous engine and three bots, produced 365 Moon hands under v2 versus 0 under the preserved v1 chooser. At target 100: 17/500 versus 0/500. These are synthetic sampled auctions, not measured owner-room statistics. Forty naturally selected v2 Moon hands completed under the current engine: 7 made, 33 failed. No real player's room or cards were read.

## Implementation

- Runtime 846-r11-human-moon-20261021. Offline/native and online/server bot prohibition; authoritative server rejects bot Moon requests independently of intelligence version. Native host turns stale queued bot Moon bids into passes. Both 200-point and 180-point deck variants covered. Moon-disabled tables keep ordinary max bids.
- Normal standard X1 bidding, partner assistance and play remain. Removed v2's Moon promotion; rule-aware bot candidates and hypothetical bot auction raises exclude Moon; legacy server fallback capped below Moon. Existing saved rooms are not reset or redealt.
- Human Moon remains available below zero when enabled. Selecting the amount alone does not submit it; the approved confirmation button still submits it.
- A declared Moon awards the match to the bidding team when made and to its opponents when failed, independently of numerical totals, including scores already above the goal. Scores/deltas still record the played hand; explicit matchResult decides the winner. No fabricated point penalty is used to force a result.
- Native career completion, portrait scoreboard, landscape final banner, next-hand controls, winner highlighting and celebration follow the explicit result. Network snapshots preserve matchResult. The server's rule-aware continuation utility models the new terminal failure rule.
- Updated settings, dynamic House Rules, Moon plaque and accessibility description, both result recaps and bot persona claims. Plaque says “Win the match / or lose the match.” Approved photo assets, dock geometry and artwork are unchanged.
- Static packaging overlays the named changed native files on immutable R10 source 90078a710948c7643caafb18986e34dc71ce7cee; artwork recovery remains. New normal version/cache identity; no service-worker clearing or player-data reset.

## Verification

- Local: 330 checks, 48 scoring cases against both actual server reducer and actual extracted native scoring, targets 100/500/1000/2000, positive/negative scores and both teams. 500 complete natural auctions, 2,572 decisions, zero bot Moon bids. Direct rejection, legacy hand/fallback, Red Two off and human negative-score Moon acceptance verified.
- Final modified root scripts parse; six changed formatted native files pass the repository's Prettier settings. The preserved bots.js edit is a one-line prohibition guard; no art files changed.
- Staging build 20e67af9-eb3c-4ed8-beae-aea3f031aabe succeeded; Worker 3381a4cf-e16f-412e-a74a-45e94970357b, deployment 8f66f254-515b-42ee-a2f9-358549d21d59. Build reran the 500-auction suite before packaging.
- Two real hosted staging matches: 1 human/3 bots, Red Two on, and 2 humans/2 bots, Red Two off. Both target 1,000 and both failed human Moons correctly ended complete below target, scores -200/140 and -180/80. 11 rejoins, 4 duplicate retries, zero fallbacks. Only disposable rooms created by this test were closed.
- Cloud-browser actual offline interaction reached human bidding, increased 110 to Moon 200, observed no submission until confirm, inspected approved plaque render with all warning text fitting, then confirmed into Kitty Received. This is desktop landscape rendered acceptance, not physical Android portrait acceptance.
- Physical-device suspension/network/cache gray checks remain separate. No new claim of exhaustive Android or installed-PWA acceptance.

## Release and rollback

Production is Cloudflare-only; do not copy an older main/ZIP Worker over this patch. Deployment uses the existing manual Cloudflare Build trigger and unchanged live RoomDO namespace bb1bf1c32b68451cbe5db6fee3066fa0, existing limits and secret. Previous live rollback version 73aa7be6-9dc0-43ee-a267-20e9fe0f1c62; restoring it also restores the old bot-Moon policy, so do so only deliberately. Old GitHub Pages links remain historical and redirects remain pending profile/PWA migration.

This report initially records staged success; consult LIVE_RECEIPT_HUMAN_MOON_R11.json for final production deployment and acceptance. No playable ZIP was created.
