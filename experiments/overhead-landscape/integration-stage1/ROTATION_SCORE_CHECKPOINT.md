# C rotation and score detail checkpoint

October14,2026. Owner said continue. No deployment or ZIP. Previous integration work retained.

Changed only angle-c-runtime.css in isolated runtime: each opened score detail occupies its own screen; other summary sections hide while open; its summary says Back to score and closes it. Existing native details and game actions remain. Portrait scope unchanged.

Found and corrected: expanded Nest caused403px content in370px panel; opening Hand Details too caused609px content. Final test opened and closed each detail by touch at667x375,740x360,844x390,1024x600. Each had equal scrollHeight/clientHeight (202px Nest;227px Hand Details in final fixture), within viewport. A previous844x390 fixture with Show remaining cards visible measured284px and fit. Smaller-width remaining-card-detail fixture is not separately certified.

Rotation: while human bidding, landscape→portrait→landscape retained exact hand IDs, selected bid, phase and current player. Portrait screenshot inspected; original table, identities, hand and Bid Box returned. No baseline pixel-diff certification claimed.

Actual offline hand progressed through bidding/discard/trump/play/score; final Next Hand touch returned to dealing. Zero captured page errors. Final automation made48 raw card taps; not48 accepted plays. Existing engine locks remained in control.

Automation limitation: game requests fullscreen on gestures; Chromium setViewportSize cannot resize fullscreen window. Test exits fullscreen before viewport changes. These are normal-window simulated orientation checks, not physical Android fullscreen rotation evidence.

Known remaining: fixed cast backdrop lacks dynamic identity art; played-card placement unfinished; achievement toasts can cover part of score detail view temporarily; all-human trump/discard and full match regression, score remaining/history pages, smallest devices, service worker/offline, physical phone/tablet checks remain. Do not deploy this work. Continue artwork separation and final landscape presentation from current checkpoint, not from an older study.
