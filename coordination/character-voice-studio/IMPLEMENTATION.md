# Character studio first implementation
Date: 2026-10-15 ET.
Owner direction: OWNER_DIRECTION.md.
Studio lives under builds/rita-review-20261015/studio/. No root game or production runtime changes.
Implements: guided 31-event recording (20 bids, Pass, Moon, 4 trump, 5 result events), 15-second per-take bound, multiple takes, single-player playback rotation, three uploaded pose previews, human/bot metadata, IndexedDB local draft, JSON backup export/import, deletion and permission checkbox.
All recordings/images remain in the browser; no upload endpoints or generated assets. Nothing private is committed.
Not implemented: automatic image or synthetic voice generation; applying custom assets to game; account storage; sharing; payments.
Checks: node syntax and real backup decoder / event contract fixture pass. No Android microphone, visual layout, real IndexedDB/export roundtrip or live multiplayer certification; owner phone validation pending. Browser QA unavailable in this implementation pass.
Preserves Rita/Jerome review and approved Moon runtime. Prior full reading/continuity rules remain in coordination/jerome-voice-review-20261015/CHECKPOINT.md; this is a scoped supplement, not a replacement or new Brain.
