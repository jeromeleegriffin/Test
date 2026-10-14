# Mobile fitting correction

Owner recording Screen_Recording_20261014_160358_Chrome.mp4 showed cropped artwork, scrolling and black regions in locally opened preview. Reproduced with Chromium mobile emulation: a 360x740 viewport reported innerWidth=1440, document scrollWidth=1440, stage width=1440 and top=1074.78. Earlier desktop viewport-only checks missed mobile layout expansion.

Correction: fixed viewport wrapper with strict layout/paint/size containment; stage initially hidden until fit; measure wrapper clientWidth/clientHeight rather than expanded window.innerWidth; ResizeObserver and pageshow/resize update fitting. Original image bytes and game source untouched.

Verified 35 cases across 7 viewport/rotation steps and 5 hand counts, including mobile emulation with touch and DPR3. No horizontal/vertical document overflow, stage contained, counts correct, touch Show/Hide works, zero page errors. Landscape and portrait screenshots inspected. Physical Android content:// acceptance remains pending; not claimed fully verified.

Updated existing Overhead-Artwork-Preview.html Library libfile_86e72b7425c88191ab9ae417b3d30df8 to version1. Prior version0 retained. Preview remains artwork-only. No new game ZIP, build number, Test or production deployment. Isolated branch only; fallback untouched. Next is authoritative gameplay integration after this fitting correction, retaining protected portrait and shared game state.
