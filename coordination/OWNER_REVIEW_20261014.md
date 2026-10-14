# Owner review repairs — 2026-10-14

Runtime: 805-ownerreview. Source: de3b6e4be922398b4898a5505d548ad2e54ddfb3 (805-welcome). Rollback before release: b912530bcffe9b5de733721c7fd710b9aa492acf (same runtime; isolated review only). Authorized by owner: “All right, let’s try to get all this fixed. Continue.” Standing TEST_SITE_WORKFLOW.md applies; production untouched; no new ZIP/build number.

Changes: bid-required toast anchored above decision controls; personas integrated into stat card; own waiting-seat name opens stats; simpler end-hand scoreboard with collapsed nest/details and dominant Next Hand; existing approved black raven; saved sound family variation/rotation preferences now also drive gameplay. Four active 801 Moon clips trimmed to one saying each. Other audio and frozen card-play intelligence unchanged. Moon asset URL versions updated to avoid old HTTP cache content.

Evidence: Node syntax and diff whitespace checks; actual-function VM/jsdom checks passed sound preference reload, fixed playback, no-repeat rotation, preview independence, invalid-choice rejection, persona display, card close/bid guard, collapsed scoreboard and remaining-card handler, own waiting-name vs other-seat actions. Whisper base.en first transcribed all four original Moon clips with multiple sayings; trimmed clips retranscribed as only “I'm shooting the moon” or “Let's shoot the moon.” Browser rendered actual scripts in isolated 393x790 frame: scoreboard/raven/actions visible; nested details accessible. No complete new offline hand, physical Android listening, native Android share sheet or tablet certification claimed.

OPEN: Android native share icon remains reported wrong. Current favicon/manifest assets are House assets. Web Share cannot explicitly set native preview icon; root cause on device remains unverified. Do not claim resolved or ask owner to clear player data.

Historical instructions/records remain preserved. Full foundational H-through-AC reread was not completed in this repair session; current source, owner scope and current coordination workflow were used. Release metadata will record served-byte/Pages evidence after publication.

Publication checkpoint: commit 4906beda73eca044d44af1e222971aed2b111b05 is on Test main. All 17 uploaded blobs matched local git hashes before the atomic leased ref update. At 14:57 UTC Pages had not created a run for this commit and live HTML still referenced 805-welcome. Deployment verification is pending; do not describe the repair as live until served bytes match.
