# Character and Voice Studio — owner direction, 2026-10-15 ET

Status: saved product direction; studio implementation and production promotion are not completed by this note.

Preserve the current Rita and Jerome voice work exactly. Existing review game:
https://jeromeleegriffin.github.io/Test/builds/rita-review-20261015/
Existing voice preview:
https://jeromeleegriffin.github.io/Test/builds/rita-review-20261015/voice-review.html
Verified source commit: f4b02417d579a4702af6234b4802b8aba00cfec8
Full continuity, provenance, tests and limits: coordination/jerome-voice-review-20261015/CHECKPOINT.md and STATUS.json. Rita records: coordination/rita-review-20261015/. Approved production Moon release remains separate.

Owner direction:
Make the preview concept available to owner and players as a character and voice creation studio, linked from character selection / voice recording in Griffin House of Rooks. Free initially, potentially charge later. Repository placement undecided by owner.

Recommended implementation:
Develop a separate studio directory in Test first, then an approved /studio/ section in Griffin-House-of-Rooks, sharing a versioned character/voice package contract with the game. A new repository is unnecessary initially; retain a clean boundary so it can be split later.
Flow: name and appearance -> read prompted lines and record or retake each -> audition individual clips and alternate takes -> preview front/left/right seated character poses -> choose human or bot (and bot persona) -> validate -> explicitly save/apply to game.
Prompt coverage: bids 100–195, Pass, Shoot the Moon, four trump colors, made bid, got set, set opponents, match win/loss. Moon remains semantic event, not numeric 200. Allow multiple takes per event with rotating selection, only one spoken line at a time, using existing shared voice queue.
Start with real recordings. Synthetic voice generation is a separate optional capability, not already available in the preview. Character generation needs an actual service integration; do not present placeholders as functioning generation.
Personal draft recording/preview can begin locally; multiplayer synchronization and durable account-backed assets require private authenticated storage and server-side validation. Do not commit player photos or recordings to a public Git repository. Let players review before publishing or sharing; provide deletion controls and own-voice / authorized-photo confirmation.
Keep free access initially. Isolate future entitlement checks from game rules and package format; no payment collection or paid restriction requested now.

Acceptance before release:
Recording/retake/replay on owner's Android Chrome; bounded mic failures; alternate rotation and no overlap; correct event and actor binding; transparent three-pose seated fit; human and bot identity consistency; save/reload and delete; multiplayer ownership/access tests when implemented. Preserve approved gameplay, geometry, audio mix/howl behavior, player data and service worker migration safety.

This note changes no runtime files, production deployment, build number or frozen Brain AE. Carry forward existing full reading/continuity requirements from the referenced checkpoint.
