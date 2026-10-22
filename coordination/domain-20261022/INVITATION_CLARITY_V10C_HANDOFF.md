# Invitation clarity release — 2026-10-22

User reported duplicate “Choose partner”, seat rotation after joining, mobile keyboard crushing the identity form, and stale “Previous room still open” rejoin claims. Screenshots 84793 / 84791 / 84789 were inspected.

Live override: rooks-branded-entry-only-20261022, marker 20261022-v10c-invitation-clarity. Version 5b7304e5-5d0a-4266-9fec-a82a735b41b9; deployment 156db420-fd82-4071-b2ed-03ebd037ee94. Source read-back matches exactly.

Routes: existing cloudflare-entry.js* plus new rooks.jeromegriffin.com/cloud-game/assets/friends803.js* (3894067fa3a84679ac4bee0b54025d59). Both dispatch by pathname in archived Worker. Rollback requires removing this new friends route as well as restoring v10b entry Worker.

Changes: preview hides native partner captions with sufficient specificity; full-width identity form overrides landscape dock grid, compact horizontal avatar text, separated touch targets; occupied host label explicit. Online waiting renderer uses fixed host-oriented seat map so chosen seat does not rotate after joining. Gameplay perspective unchanged. Saved rejoin box remains hidden until authenticated snapshot confirms open phase; terminal closed/missing/unauthorized clears matching saved credential, network uncertainty preserves credential but hides claim. Closed invitation exits preview, restores original controls and gives readable feedback.

Verification: syntax checks; 8 jsdom regression cases (fresh join, reserved return, failure, cancel, open resume, missing-room resume, unauthorized, network). Browser staging same main Worker service binding, 390x844 portrait and 390x360 keyboard-height iframe. Joined Facebook QA in top seat2; verified remains top and host sees 2/4. Left retaining reservation, closed own test table YOU71 through host UI, reopened guest: rejoin hidden. Live expired YOU71 invitation shows clear closed-table message. A second own table YOU35 used for final screenshot then closed. Temporary staging Worker removed after testing. Physical Facebook Android WebView not directly tested; phone dimensions simulated and user screenshots guide fixes.

Main game Worker v40 dd4dbc6c-4640-4d84-a91c-15148de87a49 and all DO namespaces/bindings/art assets untouched.

Source: coordination/domain-20261022/rooks-branded-entry-v10c-invitation-clarity.js on work/jeromegriffin-domain-setup-20261022; latest archive commit 6a5e5545681bcc9792933704f92acaacb2f9e48e. Do not restart or redeploy older game snapshots.
