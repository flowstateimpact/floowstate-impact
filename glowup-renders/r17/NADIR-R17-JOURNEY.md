# NADIR R17 JOURNEY: three prototypes of the home, the reel behind the hero

Nadir, digital director, 31 Oct 2026 (this chat's account had Fable out, so the seat ran on Opus, effort high). Prototypes in journey/, never published (.vercelignore). Nothing committed. Rendered and looked at: glowup-renders/r17/journey/ (19 frames, sheet.png is all of them on one sheet, log.json has every frame's console errors, document width and reel state).

## What each variant is, one sentence each
- V1 THE PLATE IS A WINDOW (journey/v1.html, v1.js): one Three.js plate wearing the combed wall as a real relief, the hero words true holes with a thickness found by parallax along the view ray, the reel a video texture behind lighting the cut walls, and the camera moving in on scroll through the O of WORK (we enter the work through the word) until the film fills the frame and hands over to Heritage in Motion.
- V2 THE WINDOW, LIGHT (v2.html, v2.js): no WebGL camera; the reel full frame, the plate one picture with the letters punched out over a thickness band the pointer slides against the face, the cut widened by scroll (the plate scales 1 to 39 about the O of WORK) until the film fills the frame; the phone route and every fallback.
- V3 HOLD TO DARE (v3.html, v3.js): the same plate sliced into 18 louvres (14 on the phone); press and hold DARE, an orange line fills under the word for 450 ms (the pressure), then the louvres part from DARE outward and the reel plays full frame WITH sound while held; release closes them and the sound goes; scroll opens them too.

## Files
- journey/cut.js: the shared cut: the live plate's composition 3 ported from type-a.js (same stack, sizes, the closing line right-aligned to the same margin as WILL NOT DARE), the shader texture (R holes, G DARE, B print, A lip), the plate picture, the thickness band, the etched wall.
- journey/journey.js, journey.css: Lenis-weighted scroll (vendor/lenis.min.js, the studio's own copy), GSAP ScrollTrigger progress over a three-screen scene, the hand-over (reel out .80 to .96, FILM word and caption in .82 to 1), pointer, the CSS plate builder.
- journey/vendor/: three.module.min.js + three.core.min.js (r184, the studio's own copy from the October look exports), lenis.min.js. No CDN, no new service.
- journey/media/: reel-loop.mp4 (1280x720, 18.5 s, AAC), reel-loop-phone.mp4 (540x960), reel-poster.jpg, reel-poster-phone.jpg.
- glowup-renders/tooling/journey-render.mjs: the render script (headless Chrome, SwiftShader).
- The three pages reuse the live home's body below the hero (plate screen, Chhaya, strip, services, audit, AI, who, team, close, footer) so the journey continues into the real site. index.html and every live page untouched.

## The reel
- Preview loop: IN 1:28.5, OUT 1:47.0 of Highlight Reel 2025 (18.5 s): the pianist under one window light, the shop, the face, the chocolate, the garden, the Pavilion, the dancer at the window. Chosen because faces and one light carry through letter-shaped windows; the party run (3:56 to 4:20) is the alternative if Asif wants heat over poise.
- Grade: near-mono with the orange kept, done by hue in YUV (chroma kept between red-orange and yellow-orange, so warm skin and tungsten stay warm, everything else goes to 12 percent saturation), contrast 1.06. Poster = frame 1:28.5. The shipping loop is a Resolve timeline from these in and out points; these files are previews only.
- Full reel: "Watch the full reel" link in the hand-over block to Vimeo 1100442300 (a click, never the hero file).

## The eight standard lines
1. Evaluated against the brand now: the same plate, wall, stencil and three roles as the live R16 home; what changes is the reel behind it and the passage through it.
2. A stranger reads "A strategy and design firm." above the cut and the closing line under DARE on every variant's first frame (seen on the 1440 and 390 load frames of V2 and V3).
3. Something made is on it: the combed plate, the cut, the film; flat type nowhere.
4. Orange is DARE, the hold line, the sound mark, the film's own warmth on the cut walls (V1 shader); never decoration. Measured 2.4 percent at load on V2 and V3.
5. Figures of speech never literal: no map, no stickers, no neon; the journey is a camera passing through a word.
6. Premium finish: one light, one material, black plaster, the lip at one device pixel, Lenis weight.
7. Memorable and bold: the reel seen first through the letters, the hold with sound (V3), the pass through the O (V1, V2).
8. The three differ in idea and structure: a 3D camera, a scaled window, a louvred gate with sound.

## Shares (shares-by-hue.py, rough), weights, frames
- V2 and V3 at load: 93 base / 5 secondary / 2 orange. Too black: the first frame of the loop is a dark room, so the windows read dark; a brighter in-point (1:35 the shop, or 1:37 the face) or a lift inside the cuts fixes it. V3 held: 48 / 51 / 0.5. V1 load: 65 / 35 / 0 (see the fault below).
- First HTML: v1 12,119 bytes, v2 12,106, v3 12,305. Document width equal to the viewport on every frame (log.json). Console errors: 0 on V2 and V3 and on the re-rendered V1; the first V1 run threw a missing uniform every frame (uTime), fixed.
- What I looked at: V2 1440 load: the plate stands, letters cut with the lip and the film in them, "other studios" tucked under WORK, DARE orange, the closing line's right edge under DARE's right edge; mid: the camera inside the O, a soft blur of plate and band (rough, see below); hand-over: the lane film, FILM, the caption and the full-reel link. V3 1440 load: as V2 plus "press and hold" under DARE; held: louvres open to thin lines over the chocolate shot, the orange line under DARE full, the sound mark on, reel unmuted (log: muted false); mid on scroll: louvres opening over the pianist. Phones: V2 and V3 at 390 stack correctly with the two-line closing line. V1 reduced motion: the CSS plate at rest, correct.

## Still rough, in honesty
- V1 FAULT, OPEN: in the headless render the Three.js plate does not draw at all; the frames show the reel full frame at load and a blur mid-journey, with no console error. The CSS fallback (reduced frame) proves the composition; the 3D plate is unproven. Suspects, in order: the DataTexture of the cut reading as all-hole (every fragment discarded), the texture2DLodEXT relief sample in the vertex shader under Three r184's GLSL 3 path, or SwiftShader itself. Needs one real-browser look and a debug uniform before Asif sees V1 as a candidate. Mark V1 NOT FOR CHOOSING YET.
- V2 mid-journey: scaling a raster plate 39 times goes soft and shows the thickness band as a blur; a vector mask (SVG text) for the last stretch, or fading the plate earlier (.5 instead of .6), is the fix.
- V3 louvres are horizontal strips; the comb's own curve as the louvre line is the next step. The hold on touch is untested on a device.
- The first frame is dark on all three (in-point); re-cut at 1:35 or lift the cuts.
- Lenis is off in the renders (render=1) so scroll positions are exact; untested by hand in a real browser this round.
- Sound on V3 starts at the reel's current time, not from a cue; a Resolve cut with a sound in-point decides that.
