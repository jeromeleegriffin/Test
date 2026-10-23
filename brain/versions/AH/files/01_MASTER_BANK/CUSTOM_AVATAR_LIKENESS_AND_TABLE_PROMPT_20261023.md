# Griffin House of Rooks — custom avatar master prompt

Owner: Jerome Griffin. Recorded October 23, 2026, America/New_York.
Status: reusable manual creation procedure; likeness and table fit must be reviewed for each new person. A prompt is an instruction, not an identity guarantee.

## Current owner direction

Automatic customer-facing paid image generation is shelved because repeated corrections could create unpredictable cost and frustration. The proposed alternative is an owner-managed request by email with a reference photo; Jerome creates/reviews the artwork here and separately authorizes adding it to the game. Donation/payment wording, request intake, private account assignment, and distribution are proposals, not implemented features. This document does not authorize new billing, automatic generation, publishing or live game changes. Generate only when Jerome explicitly requests generation. Saving this prompt does not trigger generation.

## Existing authorities recovered

- `brain/versions/H/files/01_MASTER_BANK/SCENE_INTEGRATED_SEATED_PLAYER_MASTER_CONSTRUCTION_AUTHORITY_2026-10-05.txt`: approved seating, body/rail layering and protected game geometry. Preserve it unchanged.
- `brain/versions/H/files/02_VISUAL_REFERENCES/SCENE_INTEGRATED_SEATED_PLAYER_MASTER_REFERENCE_2026-10-05.png`: seating/depth concept, not literal game/UI/card pixels.
- `coordination/CHARACTERS_AND_CARDS.md`, `coordination/CHARACTER_EXPANSION_774.txt`, `coordination/CHARACTER_COMPLETE_775.txt`, `coordination/CHARACTER_BASELINE_779.md`: established independent left/top/right views, 512×768 body exports, inward side directions, hands low in lap, actual renderer review, and the historical Crow arm failure.
- `brain/versions/Z/files/04_CAST/SHIRT_CORRECTION_PROMPTS.json`: existing identity-preserving three-panel repair prompts. These explicitly change shirt colors for two old repairs; that exception MUST NOT carry over to new photo-based avatars.

These are construction and repair instructions, not a previously located universal selfie-to-avatar prompt. This file consolidates those lessons into the reusable default. Read current `brain/current.json` before later integration; archived checkpoint runtime numbers are not instructions to roll back the game.

## Before generating: prepare once, avoid repeated guessing

1. Use the highest-quality original photograph available. A clear face, complete hair silhouette and visible shoulders are preferable. A screenshot with a tiny embedded face is a preliminary reference only; request the original before promising a close match. Do not infer unseen facial details from a low-resolution thumbnail.
2. Identify each attached image's role: ORIGINAL IDENTITY PHOTO; optional SAME-PERSON supporting photos; optional APPROVED COSTUME; CURRENT GAME/POSE TEMPLATE for geometry only. Never blend the faces of people in layout samples into the subject. Failed generated examples are exclusion references, never identity authority.
3. Record a short identity checklist from visible evidence: hairline and hair color, apparent age, facial hair, glasses, face shape, distinctive visible marks, expression, clothing colors and accessories. Uncertain details stay uncertain. For a fictional character, record the supplied design's exact features, species, proportions and materials instead.
4. Use the original identity photo on EVERY pose request. An accepted first pose can be a secondary consistency guide; it must never replace the original or outrank it. Do not chain generated-only identities from one pose to the next.
5. Retrieve a current approved character's seat assets and actual table screenshot before production integration. Use the real game's current asset/rendering contract, not guessed coordinates. No changes to approved avatar display size, positions, table, masks, Bid Dock or other controls to accommodate new artwork.

## READY-TO-PASTE GENERATION PROMPT

Attach the original identity photograph. Fill in the two bracketed fields. This prompt is for the image tool, not the project startup instructions.

```text
USE CASE: identity-preserving photographic pose edit.
PROJECT: Griffin House of Rooks custom seated partner avatar.
SUBJECT/OUTPUT NAME: [NAME OR ASSET ID].
VISIBLE IDENTITY AND CLOTHING NOTES: [ONLY FEATURES ACTUALLY VISIBLE IN THE ORIGINAL; NO INVENTED DETAILS].

REFERENCE PRIORITY
The image labeled ORIGINAL IDENTITY PHOTO is the sole primary authority for the person's appearance. Supporting original photos show that same person only. Any approved table/pose template is authority for pose, framing and perspective only, never for another person's face, hair or clothing. Ignore failed generated portraits and all screenshot controls. This is the same real person placed into three seated viewing angles, not a new actor inspired by the person.

IDENTITY — HIGHEST PRIORITY
Preserve apparent age, natural face shape, forehead height, receding or uneven hairline, hair density, hair length/style, gray hairs, eyebrows, eye shape and spacing, visible eye color, nose shape/width, cheeks, jawline, chin, ears, skin tone, natural wrinkles, visible facial hair and distinguishing features. Keep glasses and jewelry when present. Preserve natural asymmetry. Do not make the person younger or older, beautify, smooth away age, fill in thinning hair, remove a mustache/beard, sharpen the jaw, slim the face/body, enlarge eyes, whiten features or substitute a generic attractive face. Do not invent details that conflict with the original. Retain the reference expression; do not add a broad smile or change the personality conveyed by the face.

CLOTHING AND BODY
Keep the same garment types, visible cut, collar, neckline, sleeves, tie, original colors, fabric appearance, jewelry and accessories. Preserve body proportions, shoulder width and build. Gray stays gray, burgundy stays burgundy, and white stays white. Do not add a costume, recolor the suit, replace a shirt, expose more skin or make opaque clothing translucent. Do not invent logos or decorations.

DELIVERABLE
One clean landscape 2:1 master sheet with three equal-width portrait regions, ordered LEFT SEAT / TOP PARTNER SEAT / RIGHT SEAT. There must be no visible dividers or written labels. All three depict the exact same person in the exact same clothes, with consistent photographic detail, lighting and anatomical scale. Leave a transparent gap between figures so each can be exported separately without cutting arms or shoulders. Use genuine transparent alpha, not a drawn checkerboard or a painted black/white background.

SEAT VIEWS
LEFT REGION: naturally seated, torso and face gently turned approximately 20–30 degrees toward the RIGHT edge of the image, looking inward toward the table. Both eyes remain visible. Anatomically render the new view; do not mirror text, jewelry or facial asymmetry.
CENTER REGION: naturally seated directly across from the human player, torso facing camera, shoulders relaxed and level, face looking toward the viewer.
RIGHT REGION: naturally seated, torso and face gently turned approximately 20–30 degrees toward the LEFT edge of the image, looking inward toward the table. Both eyes remain visible. This is an independent view of the same person, not a flipped copy of the left view.

POSTURE AND FRAMING
Sit upright in a relaxed, believable posture. Show the entire head and hair, both shoulders, chest and enough lower torso/lap for clean table-rail masking. Extra lower torso is working crop material; the final game will reveal only the approved head/shoulders/upper-chest crop above its rail. Keep the same head scale and baseline across the sheet for export; the game applies its existing seat-specific perspective scale. Leave around 8 percent clear space above the hair and safe clear space beside both shoulders and elbows. Never crop the hair, ears, shoulders or outer arms at panel boundaries. Keep arms close to the sides and hands naturally low in the lap below the eventual table rail. No hand reaches toward the camera or into gameplay space. No visible chair, table, cards or props. No standing pose or floating isolated head.

ANATOMY AND MATERIALS
One continuous natural shoulder-to-upper-arm-to-elbow-to-wrist-to-hand chain per arm. No duplicate limbs, extra fingers, severed cuff, floating hands or impossible elbow turns. Clothing and body interiors are fully opaque; transparency belongs outside the silhouette and in real gaps only. Keep fingers and clothing edges clean without white fringes, colored residue, ghost faces, halos, glows or shadows painted onto the transparent background.

PHOTOGRAPHIC APPEARANCE
Photorealistic, natural skin and fabric texture, neutral color balance, gentle plausible illumination. Any warm room influence must remain restrained and must not recolor skin or clothes. No cartoon, caricature, stylized 3D game render, waxy skin, beauty filter, neon rim or gold halo.

PROTECTED GAME
Generate character artwork only. Do not paint, redesign or include the game table, room, rails, felt, chairs, cards, cardholders, nameplates, scores, controls, Bid Box or Bid Dock. No border, badge, medallion, lettering, watermark or UI. No fourth/bottom character. The existing game determines occlusion and seat placement.

PRIORITY ORDER
Original likeness and clothing first; correct seat direction and natural anatomy second; clean transparent framing third; decorative styling last. If an angle requires guessing, retain visible identifying traits rather than substituting a different face. Do not treat this instruction as permission to change identity for a prettier result.
```

## One-pose alternative

If a sheet cannot meet the required face resolution, generate each view separately using the SAME original photo and full identity/clothing/photographic constraints above. Replace only DELIVERABLE and SEAT VIEWS with: “One vertical 2:3 transparent seated body asset for [LEFT/TOP/RIGHT] using the corresponding direction above. Match the approved template's head size, baseline and shoulder/lap framing.” Do not automatically regenerate an entire accepted set to repair one pose. Never treat a provider safety refusal as an invitation to modify the request to bypass it.

## Table integration contract — enforced by renderer, not by prompt

- Master rule: THE TABLE MUST BLOCK THE PEOPLE. THE TABLE MUST NOT BLOCK THE GAME.
- Keep body/torso/clothing behind the authoritative rail occlusion boundary. Zero body/fabric pixels inside the felt. No alpha fade used to disguise a body crossing the rail. Do not make the clothing transparent to show wood through the torso.
- Default new custom avatar: hands in lap, behind rail; NO foreground arm asset. This avoids the old Crow cuff/elbow/disconnection failure.
- Only if separately requested: a deliberately exposed forearm/hand is a separate matching layer, with continuous anatomy and believable contact ON TOP of the wood; never emerging through it or intruding into felt. Review body and limb together.
- Export three genuine RGBA PNGs, normally 512×768 to match the established body contract: `<id>-left.png`, `<id>-top.png`, `<id>-right.png`. Preserve the original full-resolution master. A transparent WebP conversion may follow only if current runtime supports it and quality/alpha are checked.
- Fit artwork within its canvas against an approved current asset template. Preserve head scale, shoulder margins and baseline across exports. Do not enlarge the approved runtime avatar wrappers or move the table to fix a badly framed image.
- Far/top is perceptually smaller through the existing renderer. The side actors face inward. Never add a human/bottom body. Keep the table dominant and the card play area clear.
- Use current portrait and landscape masks/coordinates from the actual runtime. Do not assume a new universal prompt can supply pixel-exact rail occlusion or camera parity.

## Acceptance checklist — do before asking Jerome to review

1. Compare original photo and every generated face side by side, including age, hairline, facial hair, eyes/nose/jaw, expression, build, garment type and exact colors. A more attractive different person is a failure. Admit uncertainty when source resolution is inadequate.
2. Verify genuine alpha, fully opaque body/clothes, clean hair/garment edges, no missing head/shoulders, and correct inward directions. Inspect on dark and light backgrounds. Alpha coverage alone does not prove likeness or anatomy.
3. Place all three exports in an isolated preview using the actual current game artwork, existing avatar display sizes and real masks. Inspect portrait and landscape, regular-browser and fullscreen-equivalent phone spaces, especially the left rail. No torso/fabric inside felt, no table showing through body, no cut-off/duplicated arm or ghost remnants.
4. Check cards, names/status, scores and Bid Dock remain legible/uncovered. Character generation cannot replace an actual table-fit check. If preview access is blocked, mark TABLE FIT UNVERIFIED, never “ready for the game.”
5. Preserve accepted poses. Correct one demonstrated defect at a time; do not repeatedly redesign the whole person. Keep reference, master, exports, exact prompt, revision notes and review result together. Never silently loop generation or incur open-ended API charges.
6. Present a concise honest opinion with the comparison. A generated comparison sheet is not a production-ready integrated game asset or proof of exact identity. Integration and publishing require the owner's authorization.

## Targeted repair prompt

```text
Edit only [PRECISE DEFECT] in [POSE]. The attached ORIGINAL IDENTITY PHOTO remains the identity authority; the accepted artwork is the edit target. Preserve all accepted facial features, apparent age, hairline, facial hair, expression, clothing colors, body proportions, framing, other poses and genuine alpha. Do not beautify, restyle, recolor or replace the person. Keep the existing seat direction and complete anatomy. Return only the corrected asset. Do not redraw the table or change the game geometry.
```

## Recall

When Jerome says “our character prompt,” “make a custom avatar,” “put this person in the game,” “three poses,” or “donation avatar,” read this file plus the preserved H seated-player construction authority. Reuse the template and current approved runtime references; do not restart the design exercise. This is a manual owner workflow. The hosted automatic prototype and its earlier short prompt are not the authority for future creation.
