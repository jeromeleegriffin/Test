# v10f bot occupancy fix
User reported two hosted bots appeared as three empty invitation seats; joining displaced one bot.
Cause: seat-options.joinable includes replaceable bots. Preview incorrectly interpreted joinable as empty, and did not pass the public roster into original avatar renderer.

Fix: open invite seat requires joinable AND !occupied. Occupied bots display names/art using server bot persona map and original renderer geometry. Poll roster every 3 seconds until join/cancel; recheck occupancy before join. Do not mutate native players during preview. Stop polling and discard preview roster on exit. Retain identical loaded image href across preview/native transition to prevent blank SVG bot art. Guest bot labels say Bot, not Replace bot.

UI-only source: rooks-branded-entry-v10f-bot-occupancy.js, archive commit 76123f7f394f598e4741897f545bee206e014f9e. Worker rooks-branded-entry-only-20261022, version b2b586fc-86b1-4a08-b67b-ce04a8c7bb66, deployment 333f9df0-7453-4391-8065-486ea951b142, marker 20261022-v10f-bot-occupancy. Exact source readback matched. Main v42 and storage unchanged; legacy backend bot-replacement ability remains, UI only offers empty seats.

QA: jsdom fresh/return/failure/cancel/two-bot preview passes; syntax passes. Live host created YOU21, Crow seat1, Blaze seat3. Independent QA origin 390x844 preview showed both bot names/art, only seat2 available. Guest joined seat2; host and guest showed 4/4 and both bots retained. Return verified and final image showed all three other avatars. Published host reload showed 4/4. Physical Facebook in-app check not performed. YOU21 closed explicitly and lobby verified; QA Worker deleted.

Prejoin endpoint lacks human avatar field; bot artwork derives from current authoritative persona mapping. No game rules/art geometry changes. Prior v10e invitation focus retained.
