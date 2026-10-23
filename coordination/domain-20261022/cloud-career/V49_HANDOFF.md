# Griffin cloud accounts preparation v49 — 2026-10-23

Continue, do not rebuild. Owner defers individual player account creation. No players created, no auth emails sent, no Rita points changed.

## Production
- Main Worker griffin-house-of-rooks-online: version efc50ff0-0333-48b1-9ac5-acdc8b7f5cc9, deployment 5aebe45f-6e18-4165-8663-c37b60e7745a (100%). Rollback v48 d9e0e952-eff9-4ab9-a9c4-da62bf657f82.
- CAREER_EMAIL_READY plain-text binding is false. Keep it false until real delivery is configured and tested.
- Same RoomDO namespace bb1bf1c32b68451cbe5db6fee3066fa0, assets, secret and rate limits. Game/DO/core/accounting byte-identical to v48; build-v49.py asserts this. UI override ui-v48.js unchanged.
- New Worker griffin-career-email. Endpoint https://griffin-career-email.jeromeleegriffin.workers.dev/auth-email. Latest deployment 6c875359-33f2-4941-a836-db3510a83b9f (100%), version 998ff471-5b7c-410b-85ef-68de2130d223; created by secret update. Native EMAIL binding restricted to noreply@accounts.jeromegriffin.com, MAIL_LIMIT 3/60 seconds per signed user ID, namespace14784620261023. SEND_EMAIL_HOOK_SECRET is configured in Cloudflare and active on the deployed version. Secret value is intentionally not recorded here.
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
- 2026-10-23 prelaunch rerun: API, email API, email client, email hook, client, and v49 build/preservation checks all pass. Live Cloudflare read confirms main Worker CAREER_EMAIL_READY=false at 100%; email Worker SEND_EMAIL_HOOK_SECRET binding is present and its latest deployment is at 100%. Supabase dashboard screenshots on 2026-10-23 confirm the Send Email hook is saved and ENABLED; new-user signups are allowed; Confirm email is ON; anonymous sign-ins are OFF. No email or player account has been created.

## Exact remaining blocker / continuation
Supabase Send Email Auth Hook is now saved and ENABLED for project gxojarpfaxloyzbsptqg, pointing to the above endpoint. Cloudflare secret is active in 100% of the email Worker deployment. Email provider is enabled, email confirmation is ON, new-user signups are allowed, and anonymous sign-ins are OFF (owner screenshots 2026-10-23). Do not create public player accounts or add players to the organization. The endpoint configuration is complete, but actual recipient delivery remains unverified; do not set CAREER_EMAIL_READY true yet.
Sender domain and Worker are prepared. Cloudflare accepted onboarding. Billing read endpoint unavailable to OAuth; no plan changed. No sends this task.
Before opening public signup: test actual delivery with owner-authorized address/account, test signup, confirm, reset and cloud backup/restore. Owner has deferred player accounts, so coordinate that test later. Turn CAREER_EMAIL_READY true only when delivery and flow are verified.

Supersedes v48 note that account UI/API are unimplemented: they are now deployed but disabled. Prior cloud career DB and multiplayer tests remain in CLOUD_CAREER_V48_HANDOFF.md. Manual Rita level16 adjustment remains deferred.
