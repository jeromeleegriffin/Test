# Invite/share icon identity refresh — 2026-10-14

Owner screenshot1791976772659.jpeg showed Bed Time icon next to House of Rooks in Android's native share preview on Test. Owner authorized the repair under the standing direct-Test workflow. This is a longstanding issue, not established as a regression.

Investigation: existing Test favicon, apple icon and manifest icons are already correct Griffin assets; no Bed Time asset/reference was found in the invite path. Existing app id/start/scope are ./ under /Test/. Cached browser/Android site identity is a hypothesis, not a reproduced root cause. The native share preview is browser/OS controlled; no unsupported icon parameter or attachment workaround is introduced.

Scoped correction: copy the five existing approved app icons byte-for-byte to distinct house-of-rooks filenames; explicit PNG type/192 size and180 Apple size; versioned manifest/icon references; matching offline shell coverage and805-shareicon markers. Preserve ./ app identity, installation scope, invite title/text/URL and room code. No new artwork or gameplay/audio/AI changes. No data/cache reset and no new ZIP.

Targeted fixture loaded every declared icon, checked dimensions/app identity/scope, intercepted the real shareRoom call and asserted original plain clickable room URL/code with no image/file attachment. Desktop cannot certify the Samsung native share panel or erase its cached identity. Owner Android acceptance remains pending; do not claim this definitively resolves an OS/browser-owned icon if it persists. The first call to share remains within the original handler.

Source: reviewed deployed805-stability at731fe47ffb0616413b42272e1311ce164a11673e, coordination headbecd56778eee2e758ef581e21e67b360176861c5. That exact head is the rollback checkpoint. Restore the five changed text files with a forward commit; additional icon aliases are harmless and may remain. Preserve later coordination and all player storage. Production protected.

Pages/live served-file verification is required after this atomic publication; see SHARE_ICON_RECEIPT.json. Brain remains AC; current runtime fields may be refreshed without changing immutable Brain history. Both permanent full-history/chat-continuity rules remain unchanged; separate conversations must read this record. No new official build number is assigned to this small unnumbered Test update.
