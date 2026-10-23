# ISA partner-first bot — live release, October 23, 2026

Jerome approved the regenerated Isa artwork (white button-up shirt, natural face) and explicitly requested: “Let's get him in the game as a bot. Partner first bot. ISA is his name.”

ISA is now a selectable bot, display name **ISA**, avatar ID **isa**, style **partnerFirst**, using the existing favorite-partner system. Other bots and the default favorite are preserved. Kev has not been added by this release.

## Live identity

- Game: https://rooks.jeromegriffin.com/
- Worker: griffin-house-of-rooks-online.
- Version: 085f65d1-adb8-4119-b62f-e83de4a9790b.
- Deployment: 1a604d7a-36c4-498e-8555-e0efcd198780, 100%.
- Prior rollback version: d42a6613-7b4d-4b50-a209-0d04e08b7971.
- Current live module was read back and matched the tested candidate, ignoring one multipart transport trailing newline.
- Content-only upload preserved every original binding, secret, asset package, Durable Object namespace, room and career snapshot. No cache/service-worker reset.

The existing offline and online Anchor-style partner-first identity guard includes ISA. Existing eligibility remains: private partner assistance is confined to one human plus three bots. Multiple-human games do not grant that private assistance. Bot Moon prohibition is unchanged. The explicit male voice fallback uses existing recordings.

## Artwork and table fit

Three 512×768 transparent delivery views and a portrait were exported from the owner-approved master. ISA uses existing actor sizes, seat positions and rail masks. White shirt/body remain opaque, lower body stays behind wood, no fabric lies on felt. Portrait 390×844 and landscape 844×390 were actually rendered and personally inspected with a synthetic three-ISA fixture to see all poses at once. Normal preferred-partner start and ten real hand-card renderings were verified. The fixture does not mean duplicates are permitted at a real table.

Current bot profiles intentionally omit level; the existing landscape label now checks for a finite level instead of displaying “Level undefined.” No label or control geometry changed.

## Verification and limits

Local current-worker tests passed six served-script syntax checks, idempotent roster registration, reserved account name, partner-first feed behavior, poisoned opposing-hand checks, multi-human assistance rejection and one complete legal 40-card hand with zero X1 fallback.

Isolated hosted room: selected ISA in partner seat 2, filled remaining bots, started X1 v2 game, verified snapshot privacy and same-seat/same-hand resume, then closed the test room. Production branded page: roster, artwork HTTP200, favorite option and male voice resolver verified. A disposable production room also selected ISA in seat2 and was closed successfully. Original room namespace was retained.

The temporary staging Worker has its own room storage; public route and preview URLs are now disabled. Physical Android and a new real four-person network match remain unverified. A pre-existing duplicate-bot endpoint returns generic INTERNAL_ERROR while safely rejecting duplicates; error wording was not redesigned.

The private reserved-name roster received only (isa,ISA), after a no-collision check. This reserves the bot name consistently and includes future real contributions in the daily shared bot snapshot. No existing user/career/stat data or daily schedule was changed; no invented history.

## Source recovery and concurrent work

Private source/art backup: **ISA_Partner_First_Bot_Release_Source_20261023.zip**, saved successfully; contains root index.html artwork/source viewer, complete tested candidate, baseline, builder, six scoped asset patches, approved master, exports, tests and release record. It is not a full offline game ZIP.

Automatic approval review blocked the attempted additional GitHub upload of portrait and production-derived source. It was not retried or bypassed. Those payloads are retained in the private backup; this public Brain update contains documentation only. Do not claim the local work/isa-partner-first-20261023 source branch was pushed.

ISA's four delivery images are in an explicit small Worker asset map; the original immutable ASSETS package was preserved. Six existing scripts receive scoped ISA patches and a cache query tag. Any later whole-Worker release MUST rebase on this live version or port all ISA additions; deploying the earlier v62 module would remove ISA. Preserve the concurrent landscape work rather than replacing its source with the old static bundle. The private backup's builder documents exact patch anchors and rejects an unexpected baseline.

## Prompt corrections retained

Use the original face photo for every view, with additional references assigned explicit roles. A clothing reference must not transfer another person's features or cosmetic processing. Natural eyebrows, eye definition, lips and skin texture take priority over beautification. Gentle friendly expressions are allowed while facial structure, age, hairline, facial hair, body and clothing stay fixed. Owner accepted Kev's gentle smile and Isa's natural regeneration. Table fitting still requires an actual render.

Existing H construction authority, older character evidence, approvals and all permanent reading, continuity and actual-pixels verification rules in the full Master Brain remain intact. This is a scoped release addendum, not a substitute project handoff.
