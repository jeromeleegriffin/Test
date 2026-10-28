# Griffin House Hold'em — owner video and approved room, 2026-10-28

This is the Unity POKER project at C:/Users/jerom/Griffin Poker, Unity6000.6.1f1. It does not authorize changes to browser Rook, obsolete Unity Rook or live Cloudflare deployment. Continue newer local work; never restore old numbered packages over repairs.

## Owner direction
The owner supplied the October28 screen recording intentionally and requested durable Master Brain memory, several review passes and similar functional polish with original Griffin effects. This is a NEW intentional reference, not the unrelated accidental video mentioned by historical records. Focus on hand play, card/chip motion, controls, timers, result feedback and layout. Bank extra menus and add-ons. Do not copy Zynga artwork, sounds, branding, exact ornamental designs or personal profiles.

Five poker players total, including the bottom human, plus standing blonde dealer centered above table. Approved Rook portraits in thin black/silver Art Deco circles; approved blonde static dealer with hands/deck visible. Existing approved images and separate voice/ambience controls stay. No more unapproved character-model replacements. Poker bots never see opponents' hidden cards.

Room concept explicitly approved: "Use this room concept." Original walnut library arch, dressed shelves, warm antique lanterns, open lounge, left-wall hearth and right stair/gallery. Build real Unity meshes/materials/props, not a room screenshot backdrop or CSS substitute. Keep the architectural room camera level and rug on the room floor, independently from the steeper card-reading table camera. Native implementation is still being refined; concept approval is not approval of the latest Unity pixels.

## Reference preservation
Local source: Videos/Screen Recordings/Screen Recording 2026-10-28 110741.mp4.
Project copy outside Assets: ArtDirection/VideoReferences/2026-10-28/OwnerPokerBehaviorReference.mp4.
SHA256 C10273DFE6AE022264A1E604AB8A567595A0178E49EC1FE6AF09CAEB1E1639A8;242672943bytes;1290x802;30fps;13018frames;433.933seconds.
Keep the video/screenshots local. This documentation does not upload third-party media or visible personal/account information to GitHub or import it into the game.

## Actual review coverage
Pass1: personally inspected all five overview sheets, samples every10seconds across the full recording.
Pass2: personally inspected all14 chronological contact sheets,217samples every2seconds from0 through432seconds.
Pass3: inspected subsecond sheets: deal66.00–69.75 at.25s; flop123.00–125.25 at.15s; bet336.00–339.75 at.25s; side-pot/result363.00–368.25 at.35s.
This is visual frame-based analysis, not a claim of watching every frame in real time or auditing the soundtrack. Timings are approximate and observations do not reveal server logic.
Local proof: StabilityReports/VideoReference-20261028; repeatable extraction Tools/VideoStudy/study_reference.py and study_transitions.py.

## Observed behavior and Griffin adaptations
| Time in recording | Observed | Original Griffin direction |
|---|---|---|
|00:00–00:44|Join/buy-in, lobby, table options and promotions.|Bank lobby/store/event work; no paid economy mimicry.|
|00:44–01:06|Joining player waits for next hand, portrait faded, no active controls.|Clear waiting/sitting-out distinction and disable unavailable actions.|
|01:06.5–01:08|Old board clears, blinds post, small card backs fly sequentially from dealer to seats; local large fan appears.|Existing pooled Griffin backs; synchronize each arrival with engine gates, never reveal opponent faces. No duplicate permanent backs during flight.|
|01:08–01:20|Small off-turn preselection row becomes three large lower-right actions on turn; check/call label changes with owed amount.|Keep Fold/Check-or-Call/Bet-or-Raise location stable. Add safe preactions later, invalidate when call amount/hand changes.|
|01:16–01:20 and05:32–05:39|Active portrait countdown sweeps from green through amber to red, still runs while bet panel open.|Original thin Art Deco perimeter timer; authoritative duration/expiry and pause/menu policy must be designed and tested, not guessed from screenshots.|
|01:26–01:34|Hero folds; own previously seen cards stay visible but heavily dimmed with portrait. Other folded hands remain private.|Strong grayscale/darkening; optionally retain local folded-card memory only. Never expose folded opponent cards.|
|02:03.9–02:04.2|Three flop backs turn nearly together into faces, then settle; pot is above board; action prompt follows.|Native reveal of ONLY new public cards; keep previous streets visible. About.3s visual flip is a starting point, not engine timing authority.|
|02:24–02:38|Bets, folds, river and result; own off-turn controls become unavailable.|Seat-local action badges and public amount labels; smooth bet collection without double-counting numeric pot.|
|04:08–04:14|All-in runout exposes surviving opponents at showdown; winner hole cards and winning community cards glow, unused cards dim.|Use actual engine eligible showdown/result data; winner accent original Griffin gold/blue. No fake winner from visual hand guesses.|
|04:48–04:52|Straight result and winning ranks; result pause then next hand clears cards and rotates dealer/blinds.|A readable result stage; automatic next hand is a design choice still pending, preserve current manual New Hand until safe and accepted.|
|05:32–05:40|Bet panel sits above right actions, amount readout, slider, minus/plus, half-pot/full-pot/all-in presets; right action becomes Confirm. Timer keeps running.|Own navy/brass panel using existing legal min/max and coordinator confirmation. Slider previews only; confirmation commits exactly once. All-in confirmation remains.|
|06:03–06:08|Side-pot award highlighted first with "Paying Side Pots"; pot visibly reduces in stages, then another player's flush wins remaining eligible pot; local stack updates.|Drive separate award flights from actual settlement records. Never treat animation as a second wallet credit. Cover split/side-pot and odd-chip recipients.|
|07:02–07:12|Final showdown, winning five ranks, winner portrait/cards glow, losing cards dim, brief celebration then fresh deal.|Original restrained Griffin particle/pulse, reduced-motion static alternative; no copied hearts/banners/audio.|

Other observations: seat dealer marker moves; all-in badge remains while controls disappear; fold/check/bet indicators are seat-local; large bottom cards overlap lower portion of own circle while face remains visible and bankroll sits across/below card bottoms. Community cards centrally aligned and readable; pot above them. Room eye-level framing is visually independent of tilted felt.

## Banked features, not currently implemented from this study
Lobby/stake selection, auto-rebuy/top-off preferences, shop/currency offers, challenges, timed events, VIP/league/profile/statistics panels, gifts/drinks, emotes/chat/quick replies, cosmetic catalog and hand-strength help. Record them; do not let them displace current hand stability and presentation.

## Implementation and proof checkpoint
Current native scene Assets/Poker/Art/NativeHoldem/GriffinNativeHoldem.unity; existing Editor only. C1 main remains408lines/12companions; shared-state split preserved. Camera13 increases table card readability. Room14 separates room layer30 from table/cards/UI31, room rotation0degrees; both owner rugs are level floor objects. ApprovedLibrary15 adds scene-local real arch meshes/bookcases/lanterns/coffers using existing materials/models; no generated concept mapped onto room. Folded portrait shader dim factor changed. Room native quality is in progress and not equal to concept.
Backup Backups/2026-10-28-ApprovedLibrary-15 before changes. Native room compile receipts and actual stack captures in StabilityReports/CameraReadability.
Existing APK10:31EDT predates these camera/library changes. Do not claim phone delivery includes them until rebuilt. Physical Android performance/touch/notch/rotation unverified.
Fresh live gameplay verification was started after room changes; consult latest LivePlay.txt, AccountGuard.txt, FinalAccountVerification.json and runtime errors before claiming completion. Every test captures current58raw account preferences and restores its own checkpoint; never restore historical bankroll or grant defaults to hide losses. Normal daily/chest rewards are legitimate and test accounting must include them.

## Next work
1. Finish native room visual quality against approved concept with real meshes, level floor and visible depth, preserving current user scene.
2. Thin original rim accent; stronger folded visual reviewed in an actual hand.
3. Implement board reveal/seat action cues; then authoritative timer and legal betting presets with targeted tests.
4. Implement staged chip collection/payout and winning-five/result feedback using actual engine settlement; repeated full hands and cash conservation.
5. Build updated APK only after functional and actual-pixel checks; measure on device when available.

## Permanent continuity and verification obligations
Read brain/current.json and the complete current Master Brain, required chronological predecessors and applicable construction authorities before work; no claim that historical binaries were reopened unless actually inspected. Preserve prior complete reading rules and pass them forward. Continue current cumulative local work, not old packages. Preserve approved assets, voices, identities, saved data and newer repairs. Back up affected sources and GUIDs before changes. The real working screen wins: inspect actual complete Unity pixels in affected portrait/landscape and game states, exercise controls/transitions, compare owner references, and distinguish compilation, engine tests, rendered views and physical-device acceptance. Report failures and unverified limits honestly. Every successor handoff/startup/Master Brain update must preserve these complete reading, continuity and actual-pixels obligations and explicitly pass them forward again.
