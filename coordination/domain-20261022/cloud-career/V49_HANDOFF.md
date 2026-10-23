# Griffin cloud accounts preparation v49 — 2026-10-23

Continue, do not rebuild. Owner defers individual player account creation. No players created, no auth emails sent, no Rita points changed.

## Production
- Main Worker griffin-house-of-rooks-online: version efc50ff0-0333-48b1-9ac5-acdc8b7f5cc9, deployment 5aebe45f-6e18-4165-8663-c37b60e7745a (100%). Rollback v48 d9e0e952-eff9-4ab9-a9c4-da62bf657f82.
- CAREER_EMAIL_READY plain-text binding is false. Keep it false until real delivery is configured and tested.
- Same RoomDO namespace bb1bf1c32b68451cbe5db6fee3066fa0, assets, secret and rate limits. Game/DO/core/accounting byte-identical to v48; build-v49.py asserts this. UI override ui-v48.js unchanged.
- New Worker griffin-career-email, deployment cf5c4b3c02dd4bb08c7c670f0e6df525. Endpoint https://griffin-career-email.jeromeleegriffin.workers.dev/auth-email. Native EMAIL binding restricted to noreply@accounts.jeromegriffin.com, MAIL_LIMIT 3/60 seconds per signed user ID, namespace14784620261023. No hook secret set: fails closed503; no mail sent.
- Cloudflare sending subdomain accounts.jeromegriffin.com created ID740aef6e2aa945659db6ce65bc62d736. DNS fix returned ready with no errors (SPF, DKIM, DMARC reject, bounce MX). Email activity content previews disabled to keep codes out of previews. Existing site and apex mail unaffected.

## Account flow implemented, gated
- GET /career-api/config exposes only emailReady boolean.
- POST signup, recover, resend-confirmation, confirm-email, reset-password. Same-origin JSON, body limits, auth-rate bucket. 12–128 char new passwords. Generic existing/unknown account responses; 429/5xx surfaced safely.
- Supabase verification uses email OTP, recovery OTP then PUT password. Auth/recovery tokens never enter browser storage, response JSON or URL. Confirmation signs out temporary verification session; recovery invalidates refresh sessions and clears browser auth cookies, then requires explicit sign-in. No auto-link/upload of phone career.
- Email-based code entry avoids link scanners consuming tokens and game join URL/prelude conflicts. Existing-code screen offers Confirm my email / Reset my password; opening reset screen does NOT request another code.
- Hook checks Standard Webhooks HMAC-SHA256 with WebCrypto, signed raw body and ±5min timestamp, max64KiB body. Only signup/recovery supported (other actions fail explicitly; account-email-change etc. not part of this rollout). Static official game URL, code-only templating, HTML+text, Griffin logo. No credential/user logging. No exact-once dedup guarantee; valid retries can deliver duplicate same-code emails.

## Verified
- Existing API, autosave/account-switch tests pass.
- New test-email-api.mjs: feature gate, CSRF, validation, privacy, throttling, provider errors, accidental auto-confirm guard, expired code, recovery-only update, session cleanup, no leaked tokens, explicit sign-in.
- New test-email-client.cjs: gated UI, password match, signup/confirm, existing recovery code without resend, autosave unlink after reset, forgot-password flow.
- New test-email-hook.mjs: fail-closed, signature/timestamp/tamper rejection, fixed origin, code-only template, unsupported actions, throttling and delivery failure.
- Main syntax/build checks pass. Actual public config reports emailReady:false; email worker POST returns expected503 before secret.
- Tests use mocks; no actual recipient delivery, real account or cross-device authenticated cloud round trip tested.

## Exact remaining blocker / continuation
Supabase plugin is connected but has no Auth configuration API. Opened project Auth Hooks in cloud browser; redirected to Supabase sign-in. Need secure browserAuth sign-in (never password in chat), then configure project gxojarpfaxloyzbsptqg Send Email Hook to the above endpoint with matching secret stored as Worker secret; inspect settings/confirmation/expiry/rates. Keep email provider enabled and email confirmation ON. Do not disable confirmation or add public players to org. Use browser credential policy for machine-secret creation/entry if applicable; do not expose secret in GitHub or chat.
Sender domain and Worker are prepared. Cloudflare accepted onboarding. Billing read endpoint unavailable to OAuth; no plan changed. Official pricing currently includes3000/month on Workers Paid, then$0.35/1000; do not upgrade without owner approval. No sends this task.
Before opening public signup: test actual delivery with owner-authorized address/account, test signup, confirm, reset and cloud backup/restore. Owner has deferred player accounts, so coordinate that test later. Turn CAREER_EMAIL_READY true only when delivery and flow are verified.

Supersedes v48 note that account UI/API are unimplemented: they are now deployed but disabled. Prior cloud career DB and multiplayer tests remain in CLOUD_CAREER_V48_HANDOFF.md. Manual Rita level16 adjustment remains deferred.
