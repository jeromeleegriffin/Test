# Career restore repair — 2026-10-23

Main gameplay remains v44. UI asset worker now also serves career-core.js through route ad85421534d84dd291e8e225f361a03c, pattern rooks.jeromegriffin.com/cloud-game/assets/career-core.js*. UI worker upload version238ab7fe-49b4-4d5e-ac2e-52babe8e9ad5. Existing invitation/friends script contents unchanged.

Cause reproduced using owner-supplied valid version1 backup: a newly migrated zero-valued legacy human row produces sources metadata, so emptyStarter rejected it as an established identity. Fix permits only zero legacy row sources with known metadata and otherwise retains all receipt/match/conflict/stats/award guards. Nonzero existing career still protected.

Older exports omit selected name. On accepted legacy restore, exactly one non-placeholder human name is selected from incoming lifetime rows when explicit incoming identity preferences are absent. Destination default You no longer takes precedence over that named history.

Exact uploaded backup validated. Baseline reproduced identity conflict; candidate restored expected named human points/hands/games and every existing achievement (including retired archival awards). Current evaluator recalculates eligible achievements. Nonzero destination refusal and malformed backup no-write tests passed. Uploaded private backup NOT committed. Original backup unchanged. This repairs import; it does not remotely change phone localStorage. Owner must reload and select original backup on wife's device.

Separate finding still pending: main v44 cloud adapter skips career hand writes under private-cloud-test legacy guards. Do not claim online career accrual repaired by this importer patch. Preserve deduplication before enabling multiplayer recording.
