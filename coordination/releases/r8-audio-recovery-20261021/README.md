# R8 audio recovery candidate — NOT DEPLOYED

Owner reports that all sounds, including ambience, initially play and then stop at normal 1x as well as after trying 3x/MAX. Speed is not a necessary trigger. This session does not establish the exact audio-context state on the owner's phone.

Base live R8: Test main 6ac326ea67924c46bc5388e267aa79a6a7b799d6; runtime source 47a3c83b61fd9a927195cf429a9acfe0a0e4e443. All three live hosts remain R8; this branch is an isolated candidate only.

Confirmed code defects reproduced with deterministic AudioContext mocks:
- Main ensureAudio/whenAudioReady handle suspended but fail to recover interrupted state and reuse a closed context.
- CabinAmbience041.sync trusts its running intent flag after the actual context becomes suspended/interrupted, so subsequent gestures do not resume ambience.

Candidate changes only game060.js and cabin-ambience041.js. Resume any non-running open context; recreate closed contexts; run effects/voice callbacks only after actual running state; resume ambience even while its intent flag remains true; expose ambience context state in its existing inspect() diagnostic. Saved mute/volume choices, approved recordings, artwork, rules and geometry are preserved.

Regression command from repo root: node cloudflare/live/audio-recovery-unit.mjs .
Tests pass for suspended/interrupted/closed contexts, rejected resume retry, background return, stale stop timers, no duplicated ambient loops, and preservation of mute and volume preferences. The original published code fails separately for main interrupted recovery and ambience suspended recovery. Local JavaScript syntax and repo Prettier formatting pass.

LIMIT: Actual browser playback not verified. Cloud Browser remains unavailable with native credential state cannot be safely resumed, including after documented runtime reset. Do not claim the owner's phone is fixed, and do not deploy this candidate until actual browser verification is possible. No volume reset, service-worker clear, new voice recordings, or deploy occurred for this audio candidate.

Before any later release, assign a new runtime/cache identity and a new immutable Cloudflare asset pin/build guard, preserving the current R8 release and rollback. The current candidate intentionally retains R8 markers because it has not been approved as a live release.
