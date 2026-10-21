# R9 failed audio fix: opt-in evidence collection

Owner confirms sounds still fail after R9. Treat R9 as a failed symptom fix; exact phone cause remains unknown. Do not publish another guessed audio repair.

This Worker-only diagnostic keeps immutable R9 assets, game rules, approved art/audio and preferences unchanged. Only an entry URL with a valid 32-hex audioCheck parameter activates a small Sound check banner. It reads build markers, audio context state/clock movement, mute and volume settings, ambience state and queue counts. It never reports cards, player names, room codes, credentials, device identifiers or browsing information. A separate two-tone Test sound bypasses the game mixer; the owner can report heard/silent.

Reports use same-origin signed-session POST, rate and size limits, a strict field allowlist, and a separate Durable Object name __ghr_audio_diagnostics_v1 in the existing SQLite namespace. SQL audio_reports is bounded to 64 reports; inactive report storage is cleaned by its own alarm after approximately an hour. No existing game room storage is changed. Private report reads use the connected Cloudflare query/v2 API, not a public report URL.

Local diagnostics tests pass: normal entry has no diagnostic injection, invalid IDs rejected, collector parses, private extras removed, CSRF and missing-session POST denied, request size bounded, separate object writes only. Existing entry security regression passes. Actual Cloud Browser UI remains unavailable due native credential state restriction; source and SQL access are verified, not the owner phone.

Next: owner opens the per-session sound-check link, taps Test sound, chooses heard/no sound and plays until failure. Read that report by its ID using the Cloudflare DO SQL query API, identify the observed failure, then implement a targeted repair. Preserve the failed-fix record and do not claim resolution until the symptom is verified.
