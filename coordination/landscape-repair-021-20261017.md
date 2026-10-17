# Landscape repair 021 — 2026-10-17

Status: delivered review candidate; no deployment or owner approval. 020 artwork is OWNER_REJECTED_VISUALS, not approved art. Latest scope retains wide open felt, no bottom body/hands/near rail, no opponent holders/cards. Locked017/018 grip work remains untouched.

## Source and package
Base020 SHA256 7d5e996f2360f71146891b314ff7a1343730307f2facd3785c57815da817ce8b; earlier source9bd8debf48e69e42a6c5764869526a4800dc280a.
Runtime021-landscape-repair-20261017.
021.zip, 164403126 bytes, SHA256 fc7b06add1ff2ccb3b68ff9b9225845ff7d5029a3a9e2977e7e09988cfec15bd.
Library ID libfile_22e68bbcb5788191ba0c4a5768da86f2; canonical021(2).zip; file_000000009d7c81f88f269f3838391bdc.
1571 entries, root index.html, CRC and every manifest hash pass. Full exact source in ZIP and REVIEW_MANIFEST.json.

## Diagnosis and changes
Inherited waiting-card opacity.88 and disabled.36 caused holder-through-card rendering. Landscape overrides opacity1; disabled uses brightness/saturation. Card artwork bytes unchanged.
Hand94x141 instead86x129 (+9.3%), original2:3 aspect, overlap within868-unit width, bottom y760 and same-scene lip mask88.8–93.2%.
Trump case clears after inking; target source925,460, stamp-sized ink, remote origins from actual seats. Exact1x contact frame confirms face centre and ink at422,211.06 in844x390 viewport. Initial asynchronous screenshot/pose comparison misleadingly suggested30px offset; synchronized contact capture disproved it. Do not add compensating offset.
Level labels read existing career profiles. Achievement presentation one-at-time in landscape and deferred during score/discard; existing award validation untouched.
Fire/wick use registered scene pixels and exact original lantern SVG, subtle brightness/height animation, reduced-motion guard. Not newly authored flame frame animation.
Clean earlier1672x941 reference used for image-generation recovery of1850x850 open-felt composition. First candidate retained top holder and was rejected; second removed it. Final assets/angle-c/restored-scene-021.png SHA256 b90512fa10fdd2618e01d6a7eb27ed27a312ab2d09ad5bf61ffd9bd80c27d81b. Generated recovery requires owner review, not exact original pixels.

## Verification
Ordinary180-bid hand through discard/trump/play/score, no page errors. Moon chooser/contact inspected; Moon full hand did not reach score in bounded test, not claimed.
Phone844x390/tablet1280x800 visual checks. Opaque cards and full hand fit; tableau remains uniformly scaled and cropped.
Fire/wick running clocks advanced9349→9899ms.
Existing read-only achievement preview: zero during score overlay, one after dismissal, queued level notice next. No test medals awarded.
Actual unchanged original ZIP loader: dealing/bidding/play/score, ten legal card clicks, zero page errors. Score screen visually inspected.
No physical Samsung/Onn, multiplayer, full match or exhaustive special animation verification. Chromium emoji font rendered one medal icon as missing glyph in preview; original icon system unchanged.

## Protection and next
No live runtime deployment. Portrait assets/service worker/original loader/rules/bot/card files unchanged. game060 only build label. Shared trump/progression changes landscape-guarded.
Static image cast does not track roster identities, labels/voices do. Narrower tablets crop side people and far-left lamp. Artwork quality needs owner review; do not claim final approval.
Next: owner021 phone review, continue layout/animation issues against stable checkpoint; integrate approved hand studies separately later. Never restart or replace017/018, and do not stack patches over rejected020 art.
