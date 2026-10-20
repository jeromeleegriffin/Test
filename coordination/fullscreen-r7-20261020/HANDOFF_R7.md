# R7: restore the real fullscreen button; keep Fit screen separate

R7 replaces R6 for the owner's requested button behavior. Owner feedback: "Now full screen button does nothing." Cause established: R6 intentionally replaced native fullscreen on Android with a page-fit class toggle. A page already fitting looked unchanged, and this did not meet the expected function. R7 restores actual native fullscreen for Android through the existing explicit-button controller.

Complete ZIP: Griffin_House_Real_Fullscreen_Restored_Clean_Game_20261020_R7.zip
Library ID: libfile_af0f7234e798819185227838e9218415
Bytes164,744,140; SHA256 f1ca32460516706539e21a25044e9dce05a27b5af47b32fdec4610a9b3234820
Runtime846-premium-owner-repair-20261020-r7. index.html atroot, original Loader arrangement, approved assets retained, no deployment.

The top fullscreen icon and Full screen menu action enter/exit REAL native fullscreen. Labels follow actual native state, including accessible same-origin parent ownership. Pending entry/exit requests remain guarded; resize, rotation and ordinary pointers do not automatically re-enter. Fit screen is now its own Android menu item: it exits native fullscreen and fits the game to browser space. R6's Android-only direct-native suppression in the premium fallback is removed. Other user interface and gameplay repairs remain intact.

Do not claim the physical Chrome notice is fixed: the owner's26.9-second Android recording shows that browser-owned security overlay blocking bottom controls. Native fullscreen may trigger it again. Web code cannot reliably dismiss the browser overlay. Fit screen remains an explicit fallback through the accessible top menu, with browser bars potentially visible. No CSS attempt to hide/bypass Chrome's security notice. Physical R7 acceptance remains unverified.

EXECUTED
- Android-UA desktop Chromium phone393px/tablet600px: actual native entry/exit through lobby menu and game button, correct labels, orientation/device-metric changes, separate Fit screen menu exit. Three native entries and exits per context; zero page errors. Native screenshot pixels inspected.
- Deterministic pending-native-entry/exit regression: no repeated requests, passive legacy hooks, external dismissal stays exited.
- Initial test tried a hidden landscape-only lobby button in portrait and timed out; corrected test uses the actually visible hamburger menu. This was a harness failure, not a passing case.
- All1386asset/audio/bot files compared byte-for-byte with R6; unchanged. No card engine or network changes except runtime identity. R6 full-hand/discard tests remain historical and are not claimed as R7 full-match tests.
- ZIP integrity passed. Test evidence remains separate, keeping the player ZIP about165MB. Main, premium integration branch, Pages/production and Cloudflare beta remain unchanged. No storage/XP/career/settings clear or service-worker unregister/reset.

COORDINATION
Use R7 as the latest UI input for the eventual UI+Cloudflare integration, replacing R4/R5/R6. Do not blindly deploy this runtime to the existing beta: its adapter pins/checks the older846identity. Integration still requires compatibility work and hosted multiplayer regression. The separate Cloudflare beta is unchanged here.

This isolated branch stores the R6-to-R7 patch and evidence; its older root game is NOT the complete R7 runtime. The saved complete ZIP is source authority. R6 Library ID libfile_851e02f127508191af72b2ed5e450cd4, SHA2560bf809c317136b1443e90f9ee876236cfa819acf68b43f9aad0a29fcac110981 remains rollback. Prior R4/R5 and physical recording histories are preserved. Do not restart or redesign approved art, Bid Dock, avatar geometry, portrait or landscape camera.

Separate verification archive Library ID: libfile_d8a4f68562a48191972bde48a373816c.
