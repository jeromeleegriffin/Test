# 811 — two full matches and UI parity audit

Status: ISSUES FOUND — NOT A RELEASE APPROVAL. Runtime and delivered 811.zip unchanged. No deployment or new artwork.

Owner requested two complete matches, different inspection focus each hand, no scrolling/overlap, landscape feature parity, and independent edge-case checks.

## Actual playthrough

Chromium through actual game UI, served from the exact candidate used to package 811. Default target 500; no fabricated scores, forced wins, state shortcuts, or lowered target in these two matches. Human inputs: pass normally, win one 195 bid each match, discard six cards, choose/confirm green trump, click enabled legal cards. First hand at 1×, following hands at MAX. Separate contexts.

| Match | Viewport | Hands | Running scores: Griffin / Raven | Final |
|---|---|---|---|---|
| Landscape | 844 × 390 | 4 | 70/130 → −125/300 → −75/450 → 50/525 | Raven wins |
| Portrait | 390 × 680 | 5 | 115/85 → −80/250 → −45/415 → 95/475 → 260/510 | Raven wins |

Nine completed hands; zero uncaught page errors; no gameplay stall. Native match-over check true in both terminal score states. Durations 201.566 s / 193.962 s. Scripts stopped at terminal scoreboard; celebration layout tested separately as a fixture, not part of uninterrupted playthrough.

## Hand review focus

Phase screenshots and state logs captured each hand; visual review focus changed:

| Hand | Focus | Result |
|---|---|---|
| Landscape 1 | Shuffle/deal, names, thinking/lead status | Advanced; cast mismatch remains; header over top face. |
| Landscape 2 | Human bidding, 16-card discard, six-card confirmation, trump sorting/selection | Completed without rotation; stale prior-hand contract points. |
| Landscape 3 | Played cards, legal cue, achievement placement/effects | Bold Bid toast covers played card. Original isolated winner-card ghost not established by phase snapshots; not exhaustive frame certification. |
| Landscape 4 | Compact bid layout, negative totals, scoring, completion | Controls fit; score fields present; target reached. |
| Portrait 1 | HUD, labels, hand clearance, stamp transition | Hand completed; no table scrolling observed. |
| Portrait 2 | Human discard and trump chooser | Chooser/confirmation worked; stale contract points reproduced. |
| Portrait 3 | Red trump visibility, grouping and hand fit | Hand fits; red emblem readable. |
| Portrait 4 | Black trump contrast, score progression | Play completed; dark stamp merits contrast review. |
| Portrait 5 | Yellow stamp, turn/status, final score | Normal match end at 260/510. |

Supplemental menu routes, short-height views, score details, real rotation into portrait trump, history and final-screen fixtures.

## Confirmed defects

1. **High: landscape History broken.** Scoreboard History hides scoreboard then opens nothing; old landscape end-hand panel appears. wireScoreModalActions hides score before openHandHistory, which immediately returns in landscape. Reproduced after a real additional hand and controlled four-hand fixture. Menu history adapter also depends on blocked function and may read stale/unpopulated contents. Use shared paginated history and correct Back destination.
2. **High: Last Trick unavailable in landscape.** style057.css hides portraitLastTrickButton/popover; angle-c-runtime.css hides lt-hand-controls tabs including Last 3. Portrait popover handlers also reject landscape. Needs functional shared responsive control, not CSS-only unhide.
3. **High: post-match landscape overlap.** At 844×290 terminal-result fixture, ordinary totals cover Copy night's scores, speed buttons cover Rematch, rail controls cover celebration. HUD suppression only covers score/discard, not celePage. No scrolling does not establish no overlap. Retest final screen with actual highlights after repair.
4. **Medium: achievements cover played cards.** Landscape hand 3 Bold Bid notice on center felt obscures a card. 45%-height placement is not a safe region. Queue for safe moment or reserve dedicated space.
5. **Medium: stale contract progress, both orientations.** Landscape hand 2 says Griffin 70 of 195 before any new trick; portrait hand 2 says Griffin 115 of 195. updateBidProgress reads prior tricksTaken; reset occurs in hostBeginPlay, after discard/trump already display progress. Reset presentation at new-hand boundary or show zero until play; preserve scoring/history.
6. **Medium: top player cropped/covered.** 844×390 header covers top woman's face; 844×290 centered cover crop removes head. frame() uses cover scale. Repair responsive composition/safe areas without replacing approved pose or generating art.
7. **Known unresolved: fixed scene cast mismatches selected roster.** Copper/Sable/Finch labels/thumbnails over fixed woman/two-men scene. Small real-player thumbnails do not make large identities match. Never silently change roster/voices to conceal it.

Visual concern, not a new functional failure: landscape trump ink 132 scene units (~61 CSS px wide at844×390), versus roughly150px portrait emblem. Black/blue contrast lower. Owner's811 review should guide scale/contrast.

## Passing checks and limits

- Both default500 matches complete. Nine main scoreboards retain goal, contract, trump, hand number, totals/deltas, Nest, Hand details, History, Copy, continuation/OK in DOM; sampled scoreboard overflow checks find no scroll containers.
- Human bid/discard/trump works both orientations. Additional real-hand landscape→portrait trump rotation reached score. Prior portrait lockup not reproduced.
- Active shared midnight-blue menu works; old btnToggleTopOpts code alone is misleading because menu-approved805 intercepts. Six routes each orientation;19 paginated screens at844×290 /390×680: no detected scrolling or controls beyond dialog. Routes Match Score, Profile, Career landing, Sounds landing, Game Setup, How to Play.
- Four recorded hand summaries replayed into history fixture: portrait two pages fit without scrolling; landscape does not open.
- Supplemental scoreboard summary/Nest/Hand details checked390×680,844×290,1280×650.
- Final celebration fixture has no scroll container but fails overlap. No recorded highlights in that fixture, so highlight-rich final layouts unverified.

Local Chromium, not physical Android touch/listening certification, network multiplayer or full offline matches. These matches use blocked service workers/localHTTP. Prior offline bootstrap evidence separate. Rare successful Moon, all claims/long names/career pages/audio events not exhaustively covered.

Evidence: 811-two-match-audit-evidence-20261017.json. Internal screenshots local only. Failed exploratory harness attempts excluded from counts; History failure independently isolated. Runtime unmodified.

Next work: History/Last Trick/celebration parity; toast and progress reset; responsive face clearance and stamp readability. Preserve approved art, rules/AI, loader and live sites. Do not mark811 approved/deployed from these tests.
