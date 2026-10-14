BUILD 803 — FRIENDS TABLE, AUDIO LEVELS, MONEY RETIREMENT

Continues Build 802 and all subsequent pending source changes. Download-only test package; no deployment. Production 531 protected. Open index.html through the existing ZIP loader.

Changes:
- Approved Option 1 friends table: existing room/table art, gold Open seat buttons, Invite/QR, Fill empty seats, Start Game, Game options and Leave Table. No physical chairs. Existing host/guest seat operations are reused. Occupants use existing character art and rail masks. Options retain team names and bot difficulty. QR/link sharing is available on a hosted website; local/ZIP copies retain the existing share-code fallback.
- Retired money earning, balances, purchase operations, dollar displays, and money tutorial copy from the active runtime. No career, XP, achievement, migration, or score records are reset. An obsolete unused game.js entry point is retired; prior numbered ZIPs retain the original source and archived release evidence remains historical documentation.
- Voices default to 70% of their previous level; independent Mute voices and persisted Master, Voices, Game effects, Character effects, and Ambience sliders. Audio files unchanged from 802.
- Shoot the Moon is allowed at a negative score; existing terminal negative match-score rule preserved.
- Old landing decoration and page content removed; reused controls hidden from first paint.
- Preserves 801 bot bid/pass/Moon queue and wolf howl (6.75 seconds with 1.9-second fade), and 802 starting bot career level fix. Approved male/female voice clips unmodified.

Verification:
- Local headless Chromium: startup, bot picker/removal, fill preserving humans, guest seat rotation/claim dispatch, human replacing a bot, QR/options, phone and landscape control bounds, start into real game, negative-score Moon, and no active bank functions/displays. No page JavaScript errors. Multiplayer state tests used local simulated peers, not two live remote devices.
- Active script syntax, index resource references, assets against 802, and ZIP integrity checked. Entry index.html at ZIP root.

Still unverified: owner Android pixels/audio, real cross-device multiplayer connection, active service-worker control, and offline reload. Prior loader Failed to fetch issue was not remotely repaired. This package is not a production release.
