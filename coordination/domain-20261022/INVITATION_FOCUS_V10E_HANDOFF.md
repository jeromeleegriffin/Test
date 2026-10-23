# Invitation focus v10e
Published 2026-10-23 UTC (Oct 22 Eastern), user authorized.

UI Worker rooks-branded-entry-only-20261022 version 78186dd8-d108-41db-97dd-2247d2d3e3ad, deployment 29ab83a0-5d44-4577-bb3c-a73fabd354d7. Marker 20261022-v10e-invitation-focus. Exact deployed source readback matched archive rooks-branded-entry-v10e-invitation-focus.js, commit 1377a4eccf2ba16538e3fceee177074775a0a0d6.

Persistent Host’s partner label above seat2 and Host above seat0, before and after joining. Keep existing seat orientation, Sit here/Move here, artwork and native leave confirmation. Invitation context stays focused on host table until explicit Go to main menu; leaving preview or seated table presents native modal Return to table / Go to main menu. Closed/missing table shows closed explanation and main menu. Session context cleared only on explicit main menu choice. Original guest reserved-seat semantics retained.

Browser QA at 390x844: preview role, joined role, Leave invitation, Return to table, seated Leave table confirmation, centered exit choice, explicit main menu restores single-player/Host a Table/Join a Table all passed. Live branded host reload showed both new role labels. Production source exact readback passed. Physical Facebook app was not tested.

Disposable room YOU65 explicitly closed and lobby verified. Temporary rooks-invitation-qa Worker deleted successfully. Main game Worker v42 1ce5f0cc-0893-4c18-830d-e1dc2652bf55 and existing ROOMS namespace unchanged. Prior v10d seat-move and rejoin fixes retained. Rollback UI source rooks-branded-entry-v10d-host-join-seat-moves.js (see v10d handoff for authoritative archive filename).
