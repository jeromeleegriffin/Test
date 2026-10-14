# Welcome panels — 805-welcome, 2026-10-14

Owner requested both entrance and Join by Code panels styled closer to supplied ornate green/gold reference. Standing Test-only update authorization applies. No new ZIP or production changes. Cloudflare lifecycle testing remains deferred by owner.

Source: Test runtime805-ownerfix2, cb3fc725f835b66badc55bdda26e41a8e81d454e; metadata main b40c1163b95f3ab8f97f06ef06c94892e4e75cb4. Master Brain AC unchanged. Original archives and previous source retained.

Changes: landing783.css adds layered embossed gold border, fine corner ornaments, existing gold griffin crest, dark green texture, gold primary and navy secondary raised buttons. Same simplified actions and shared entrance panel. Decorative pseudo-elements ignore touches. Compact styles preserve small-screen fit. game060.js changes join-field focus to preventScroll and skips legacy scrollIntoView on fixed landing783; reproduced old call shifting the entrance away from the viewport. No join transport or rules changed. index.html, manifest.json, hor-version.js, sw060.js and game060.js runtime markers coherently change to805-welcome.

Validation: local results.json and before/after screenshots accompany this handoff. Returning home/join and Change player tested at393x647,320x480,600x840,800x1100,800x360. Field input, primary visibility, Back, button hit targets, viewport bounds and non-scrolling panels checked. Full games/audio/X1 tests from805-ownerfix2 retained, not repeated for styling/focus changes. Physical Android keyboard/tablet appearance and owner acceptance remain pending. Final deployment receipt records Pages/served bytes/browser verification separately.

Rollback: restore ONLY the six changed runtime paths from b40c1163b95f3ab8f97f06ef06c94892e4e75cb4 in a new reviewed Test commit; do not reset main or player data. Preserve concurrent coordination records. Exact changed hashes are in deployment receipt. Keep current number registry; this runtime suffix is not a new numbered archive.

Continue deferred repairs only from verified latest source. No automatic notification to another conversation is claimed.

## Permanent reading and successor obligations

On resume verify brain/current.json directly, read the foundational H Master Bank and every subsequent published version through the current pointer, complete START HERE, authorities, supersessions and original references; then coordination/START_HERE.md, OPERATING_RULES.md, MASTER_CONTROL.md, BUILD_REGISTRY.json, BUILD_NUMBERING.md and relevant specialist/pending records. The H–AC reading was completed earlier in this continuing session; AC is still current. Do not substitute this handoff for primary sources. Reproduce the following rules verbatim in future handoffs and startup prompts.

PERMANENT, SELF-PERPETUATING CHAT CONTINUITY RULE

This rule applies to Master Control and every Griffin House specialist chat, now and in the future.

1. When a conversation becomes long or difficult to manage, proactively warn me and recommend a fresh continuation chat before important information is lost.

2. Before switching chats, prepare a complete handoff with the current Master Brain version, GitHub locations, approved decisions, locked designs, unfinished work, rejected attempts, verified game baseline, rollback files, ZIP packages, reference screenshots, restrictions, and next steps.

3. Provide one complete, ready-to-paste startup prompt for the next chat.

4. Every handoff and every new startup prompt MUST reproduce this entire continuity rule and explicitly instruct the next assistant to reproduce it again in its own future handoffs and startup prompts.

5. The next assistant must pass this same obligation to its successor, and that successor must pass it to the next, continuing through every future chat generation. Never allow the rule to disappear from the chain.

6. Preserve the continuity rule in every future Master Brain update. Do not shorten, silently omit, or weaken it.

7. Never rely on chat memory alone. Important decisions must be recorded in durable project documentation through the approved process.

8. At the beginning of every replacement chat, verify the current Master Brain and the inherited handoff before starting work.

IMPLEMENTATION REQUIREMENT:

Store this rule verbatim in Master Brain M.

Reproduce the entire rule verbatim in START HERE and in the ready-to-paste replacement-chat startup prompt.

Instruct every successor to reproduce it verbatim again in its own handoffs, startup prompts, and future Master Brain updates.

Do not replace the rule with a summary or a reference such as "same as before."



# Griffin House of Rooks — Permanent Proactive Chat Continuity Rule

Owner approval: 2026-10-09. Documentation-only coordination update.

Applies to Master Control and all current and future specialist chats.

1. Each chat is responsible for monitoring its own context and continuity risk. Since exact remaining context capacity may not be visible, warn proactively based on conversation length, complexity, repeated context loss, or approaching limits. Do not promise an exact threshold or automatic background monitoring.
2. Warn the owner early, before the conversation becomes difficult to continue. Do not wait for the owner to ask for a replacement.
3. Prepare a complete successor handoff containing: specialist scope and role, authoritative Master Brain pointer and mandatory full-history reading procedure, all relevant approved design locks, tested/untested implementations, latest verified source/build identifiers and hashes, original references, rejected/failed attempts and why, open blockers, unfinished tasks, owner approvals and restrictions, and exact next safe action.
4. Supply ONE complete replacement-chat startup prompt and all necessary handoff files in one package. Include verbatim any mandatory continuity language in the currently published Master Brain M; do not invent or paraphrase text claimed to be verbatim. If unavailable, explicitly identify the missing source and request it before claiming compliance.
5. The successor must verify the current brain/current.json, read the foundational H Master Bank and all subsequent versions through the then-current version, and inspect relevant primary evidence. Do not assume handoff summaries supersede originals.
6. Owner's 'Bank it' is a separate command for a finished, owner-approved checkpoint and a Grok publication package. Preparing a continuity handoff is not permission to publish, deploy, alter game files, generate artwork, or advance Master Brain.
7. Avoid asking the owner to copy routine progress between chats. Keep one clear next action. Do not claim that publishing to GitHub wakes or notifies existing chats; they must read updates on resume.
8. The working Android screen wins. Preserve approved work, source authority, and the rule that design approval alone is not approval of a finished implementation.


Runtime marker follow-up: intermediate commit7b24a3453d0a73bbff047759feb1eb75c335d002 was superseded before delivery to align stale APP_VERSION805-bidpopup with805-welcome. Final receipt is authoritative. No owner acceptance claimed.
