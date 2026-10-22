# Moon defaults OFF — owner request, October 21, 2026

R12 changes only default selection and its persistence/wording, retaining the R11 human-only Moon and failed-Moon match-loss policy.

- Native initial settings and reset-to-standard settings use false.
- The checkbox starts unchecked and its hint says Off by default.
- Server normalized defaults and raw-auction defaults use false; an explicit shootMoonEnabled:true still enables human Moon.
- Former saved true values are not assumed to be explicit opt-ins. Only a newly selected setting marked moonPreferenceVersion:12 is restored as a preference. The checkbox persists that version with the owner's explicit choice. Other preferences and active game state are preserved.
- Existing online rooms keep their stored settings. No room or service-worker storage is cleared.
- Runtime 846-r12-moon-default-off-20261021. Cloudflare static packaging, original assets, bindings and rate limits remain the same.
- Unit fixtures explicitly enable Moon when testing its opt-in rules, and independently verify omitted/default false, explicit true, checkbox unchecked and old/new preference restoration. The full 500-auction no-bot-Moon and native/server outcome suite remains.

See LIVE_RECEIPT_MOON_DEFAULT_OFF_R12.json for final deployment and hosted verification. Previous live rollback version is 14ecabff-e4f7-431f-b5bf-1b9fff011143 (R11, Moon default ON).
