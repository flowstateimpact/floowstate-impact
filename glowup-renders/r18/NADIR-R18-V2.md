# R18 PART 3: V2 HERO FINISHED, NINE FRAMES LOOKED AT (Nadir, Opus, 31 Oct 2026)
Status: six steps done. Nothing committed or pushed, media/ untouched, no ffmpeg, labels still placeholders.

## What changed
- hero-journey.js 68: band thickness T now follows letter size, `T = clamp(2.5, cap x .06, 8)`: 7.48 at 1440, 2.77 at 390 (was a fixed 12). Proof: crop-work-T12-before.png (slivers) vs crop-work-1x.png (full windows, dark lip, white rim).
- hero-journey.js 49: band fade .35 to .5 became .3 to .38. The half-faded band read as grey veils over the film at p .42; it now clears in one short step.
- hero-journey.js 40 + hero-journey.css 32: class .rev from p .82 moves Pause bottom right as the caption rises (it sat on "Dhaka dressing Dhaka" from .82 to .9).
- type-base.css 34, 37: --plate-etch .5 to 1.5 desktop, .3 to .6 phone; --plate-see kept .22. 1.0 was still quiet (r18-1440-load-etch1.0.png); at 1.5 the comb reads as lit ridges at a glance, plaster stays material. Proof: crop-pattern-0.5-before.png against crop-pattern-1x.png.
- glow.js 75: the section-word drift (3vw to -3vw) skips the journey scene. It pulled FILM 28px left of the caption margin.
- index.html: footer mark3d removed (its link, div and script). glow.css 108: `.foot:not(:has(.mark3d)) .next` drops the negative margin, so the rule under "Next: the work" runs 40 to 1399, margin to margin (measured).

## The nine frames (all 0 console errors, page width = screen)
- r18-1440-load: six cut words as windows onto the reel, the comb sweeping through the plate, DARE alone in orange.
- p30: inside the O; the wall's thickness as two black slabs either side, film in the centre. The doorway reads. Plate face soft at 20x.
- p42: frame centre film (the pavilion domes), no veils; two pale glass-edge arcs at the right are the lip.
- p88: the reel whole, FILM and caption bottom left, Pause right.
- p92: tiger mix, her face at centre, FILM bottom left clear of it.
- 390 load: cuts read as windows (T 2.77); grooves visible at .6.
- 390 mid: film fills the screen, no veil.
- 390 p92: her face top half, FILM and caption at the foot.
- reduce: plate still on the reel's poster, Pause hidden.

## Shares at load (shares-by-hue.py)
1440: rest 28.8, lit 54.8, bone 3.5, picture 9.4, orange 3.5, reads 84/13/4. 390: 84/14/2. Reduce: 83/14/3. MISSES the 60-65 / 25-30 / 5-10 target. Why: the plate is near-opaque by --plate-see .22, and DARE alone is about 3.5 percent of the area. Dark film in the cuts counts as LIT. What would move it, not done (taste call for Anwar): --plate-see up toward .35, or DARE larger.

## mark3d ruling
Yes, wishy washy: a grey metal tile in a fourth colour, floating at an elevation nothing else on the page shares, repeating at postcard size the stencil-plate idea the hero now carries full screen. Removed from the home only.

## The eight standard lines
1. Evaluate first: judged against the V2 pick and Anwar R17, not the old hero.
2. Says what we are: "A strategy and design firm." over the cut, the closing line under it.
3. Graphic material: the combed plaster plate, etched and lit, cut by the words; the film inside.
4. Ten percent as thread: DARE, then the orange call to action at the foot. Under share (above).
5. Figures of speech: "journey" is a camera through the word, not a road drawn.
6. Premium finish: vector cuts at every zoom, lit lip, one control word.
7. Memorable and bold: you enter the work through the O of WORK.
8. Options differ: one build, by his pick (V2).

## The six words, as seen
Dimension: the camera passes through the wall. Depth: thickness band, lip, plate, film behind. Character: a firm that cuts through its own claim. Style: stencil on combed plaster. Signature: the O of WORK as the door. Uniqueness: the film is seen only through the words until you go in.

## Still rough
Plate soft at 20x (p30); shares miss; Lenis smoothness unchecked; aria labels placeholders; reduced motion holds the reel paused (Anwar to rule).

---

# R18 PART 2: STOPPED AT THE LENGTH LINE, WIRED AND RENDERING (fresh Nadir, Opus, 31 Oct 2026)
Status: the journey is wired into the live home and renders with 0 console errors at 1440 load. Stopped at about 150,000 tokens (house wind-down line) before the eight-frame set. Nothing committed, nothing pushed. media/ never touched, no ffmpeg run.

## Done this run (with proof)
- NEXT STEP 1 done. NEW /Users/asiffarid/Documents/apps/flowstateimpact-site-glowup/hero-journey.js (about 110 lines): journey.js plus v2.js merged onto hero-cut.js, findings 1 to 5 built as written. Camera = SVG viewBox flying into hole() and carrying it to the frame centre, ease e (not e squared), S = max(39, 1.2 x half-diagonal / r). Tilt on .cut fades by p .3; band opacity 1 - seg(.35,.5), band offset x s; plate fade .6 to .72. Light spill: reel drawn at 1/16 into a tiny canvas, upscaled into a quarter-res canvas, destination-in spillMask, screen blend at .3, stops at p .72 or off screen. Hand-over: lane preload none and no autoplay, armed (preload auto + load) at p .6, --rev = seg(.82,.9), hard cut at .9 (reel hidden and paused, lane shown and played from 0), reversed below .9. Pause = the word Pause/Play, its own button (not .play, so glow.js does not bind it), pauses whichever film is current; own IntersectionObserver pauses off screen. Lenis only without render=1, html.journey-on kills scroll-snap. Reduced motion and full= renders: plate-still, reel paused on its poster, Pause hidden. Exposes window.__journey {p, mode, past, s, S, hole, check}.
- NEW /Users/asiffarid/Documents/apps/flowstateimpact-site-glowup/hero-journey.css: scene 3sh, reel over the lane, reel hidden until the plate is built (stage shows its wall, never the bare film without words), the spill layer, FILM moved bottom left above the caption (bottom: m + 58px; phone 16vw) on a low fade (::before on .after, 46 percent high, .72 to .28 to 0, the strip's own fade family) so her face stays clear, Pause bottom left at load and bottom right after the cut (.scene.past), reduced motion as built.
- NEW /Users/asiffarid/Documents/apps/flowstateimpact-site-glowup/vendor/lenis.min.js (copied from journey/vendor).
- NEXT STEP 2 done. index.html: hero section replaced (about lines 31 to 55, data-journey, data-plate gone, lane preload none without autoplay, reel video media/reel-loop-phone.mp4 under 760 and media/reel-loop.mp4, poster media/reel-poster.jpg, the .play icon button replaced by button.hj-pause); hero-journey.css linked after ground.css (line 20); type-a.js script removed from the home (it only drove the plate here; the what-we-do comma still loads it on its own page), lenis, hero-cut.js, hero-journey.js added (lines 142 to 144). Before-copy: /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/d049c16f-888d-4d81-8a5d-cca8b0e1bbca/scratchpad/index.before.html
- hero-cut.js, two fixes the render showed (no rebuild): (a) the three SVG layers were classed band, face, top; bar.css's header rule .top (position fixed, padding 18px var(--m), flex) restyled the top layer, so the lip and print sat about 38px right of the cuts (measured: lip text left 78 against cut 40). Renamed hj-band, hj-face, hj-top. (b) the face's rect and wall image each carried opacity .868, stacking to .983 and losing --plate-see; one opacity now on the group.
- Spacing check at 1440 load, SVG text advance minus canvas layout width per cut word: WE 0, MAKE .01, THE .01, WORK .01, WILL .01, NOT 0 px. Inside the one-pixel limit.
- Render 1440 load (before the class fix): 0 errors, docW 1440 = width, reel-loop.mp4 playing (readyState 4), lane hidden with preload none, Pause at left 40, hole at (627.5, 453.5) r 16.4, S 62.1. The ghost lip is the only fault it showed; re-rendered after the fix, look pending (below).
- Render tooling: /Users/asiffarid/Documents/apps/flowstateimpact-site-glowup/glowup-renders/r18/job/mk.py builds the jobs (keys load, p30, p42, p88, p92, m-load, m-mid, m-p92, reduce; scroll = p x 2 x innerHeight; eval reports docW, journey state, both videos, the button). Usage: python3 glowup-renders/r18/job/mk.py load,p30,p42,p88,p92 a > glowup-renders/r18/job/a.json && node glowup-renders/tooling/type-render.mjs glowup-renders/r18/job/a.json

## NOT done (exact next steps for the next helper)
1. LOOKED (after the class fix, glowup-renders/r18/r18-1440-load.png): the lip now sits on the cuts, the strap on the margin, the closing line's right edge on DARE's, Pause bottom left, the mark's grooves faintly visible. One new fault seen: the thickness band (stroke 2T = 24px, T = 12 in hero-journey.js line 15) fills most of each thin stencil stem, so the cuts read mostly dark with only slivers of film; try T = 6 to 8 and compare (Anwar's old ruling: the wall ate 61 percent of the window). Then render the eight: load, p30, p42 (frame centre must be film), p88 (reel whole, FILM and caption over it), p92 (tiger mix, FILM bottom left clear of her face), m-load, m-mid, reduce, plus m-p92 for the 390 framing proof.
2. NEXT STEP 3: raise --plate-etch (type-base.css line 34 .5, line 37 .3 phone). Try 1.0 desktop / .6 phone, crop at 1x from the load frame, pick the value at which the mark's pattern reads at a glance. Keep --plate-see .22.
3. Shares: python3 glowup-renders/tooling/shares-by-hue.py glowup-renders/r18/r18-1440-load.png (target 60 to 65 / 25 to 30 / 5 to 10).
4. NEXT STEP 5: footer mark3d ruling (leaning remove, as written below), then the eight standard lines and six words in this note.
Watch in the frames: the spill's strength (.3 may be too faint or too loud on the ridges), the lip's stroke growing with the zoom (a vector lip scales with the camera; may read as a white band at p .3 to .42), and whether glow.js's .screen .word drift (2c) moves FILM sideways oddly.

## Still rough
- Words for the writing route (placeholders): the reel's aria-label "The studio's highlight reel"; the lane's aria-label still describes the old walking film; the button's "Pause the film / Play the film".
- No visible words without JavaScript (the plate is drawn by script), as on the old live hero.
- A real browser with Lenis needs checking: smoothness of the viewBox camera (SVG mask over a 2880x1800 raster re-rasterised per scroll frame may jank on a laptop GPU), the long etch task at load, and the lane arriving in time on a fast fling past .9 (it shows its poster, the same frame, until data arrives).
- Reduced motion pauses the reel on its poster; the brief said keep as built, which left it playing. Anwar to rule.

---

# NADIR R18: journey V2 on the live home. PARTIAL, STOPPED AT THE WIND-DOWN LINE

Status: stopped at about 155,000 tokens (the house wind-down line). The live page is UNTOUCHED. One new file is written and passes a syntax check; nothing is wired, nothing is rendered. A fresh helper picks up from "NEXT STEPS" below. Nothing committed, nothing pushed. Model: Opus.

## What is on disk
- /Users/asiffarid/Documents/apps/flowstateimpact-site-glowup/hero-cut.js (NEW, not loaded by any page yet). Built from journey/cut.js. Kept unchanged: layout() (composition 3, the right-aligned closing line), holes(), wallCanvas() (the etch), fontsReady(). loadWall() now reads root paths (media/ground/...). New:
  - svgPlate(lay, wallURL, T): the plate as three inline SVGs with the same viewBox. band = wall-ink stroke 2T clipped inside the cuts (id hj-clip-b); face = the etched wall image (blob URL) at opacity 1 - see*.6, masked by the words (id hj-mask); top = lip (wide stroke at .5 plus rim, group opacity --hollow-lip, clip hj-clip-t), the printed lines, DARE in #E27F22, the strap and closing line. Returns {band, face, top, all}.
  - hole(lay): the thickest point of the O's cut stroke in WORK (two-pass chamfer distance on the holes canvas), returns {x, y, r}.
  - spillMask(lay, wallCanvas, q, reach): quarter-res alpha mask, the letters blurred out about 30px (three box passes), the cuts taken out, weighted by the wall's own relief.
- index.html, type-base.css, every CSS file, every media file: NOT edited. media/reel-* and media/lane* never touched.

## Findings that bind the build (observed, read live)
1. Why the frame centre at p .42 was plate (Anwar 5.2): lay.o is the CENTRE of the O, and in a stencil O the centre is the counter, which is plate, not cut. Scaling about it can only ever fill the frame with plate. Fix: scale about hole(lay), the thickest point of the cut stroke, AND translate that point to the frame centre as e grows: screen(X) = P + (C - P)*e + s*(X - P), s = 1 + e*(S - 1), S = max(39, 1.2 * halfDiagonal / r). Ease e, not e squared.
2. Crisp to the end (5.3): do the camera with the SVG viewBox, not a CSS scale: viewBox = (-Tx/s, -Ty/s, W/s, H/s) with T = P + (C - P)*e - s*P. Glyph edges re-render as vectors at any zoom; the wall stays a raster under them. Tilt (rotateX -sy*2.2*tilt, rotateY sx*2.6*tilt, tilt = 1 - seg(p,0,.3)) stays a CSS transform on the container. Band opacity 1 - seg(p,.35,.5); band pointer offset as a CSS translate times s. Plate opacity 1 - seg(p,.6,.72), unchanged.
3. Light spill (section 7): one canvas at q = .25 between face and top, mix-blend-mode screen, opacity .3 times the plate fade. Each video frame: draw the reel at about 1/16 into it (upscale gives the blur), then destination-in the spillMask. Inside the camera it gets the CSS matrix(s,0,0,s,Tx,Ty), origin 0 0. Stop drawing after p .72 or when the scene is off screen.
4. The hand-over (5.4, 5.5): lane gets preload="none" and no autoplay. At p >= .6 the first time: preload auto, load(), stay paused at 0. --rev = seg(p,.82,.9) for FILM and the caption. At p >= .9: reel visibility hidden and paused, lane shown and played from 0 (so the cut always lands on her face). Below .9: lane paused and hidden, reel back. Fit by object-fit cover only, read nothing about length.
5. Pause (5.6): the journey's control must NOT be class .play, or glow.js (lines 14 to 29) binds it and its IntersectionObserver re-plays the lane under the reel. Use a plain button, the word Pause / Play at --small, white, weight 500, driven by the journey script; it pauses whichever film is current, from load (the reel loops 14.5 s, so it needs a pause from the first second). Placement read off the R17 load frame: bottom-left at load (free under WILL; the closing line owns bottom-right), bottom-right after the cut (the caption owns bottom-left). Hidden under reduced motion.
6. Framing of the new tiger mix (observed on media/lane-poster.jpg): her face is dead centre. At 1440 the film covers 2149 wide, cropped 354 each side, so the face runs x 362 to 1078 and the lenses y 257 to 414. FILM at left var(--m), top .30sh, L7 187px lands on her left lens. Must move: proposed bottom-left above the caption with the strip's measured low fade, checked by a render at p .92 and 390. The glow-a.css lines 24 to 27 comments style .heritage, a class no longer on the home, so they do not affect this hero.
7. Lenis: copy journey/vendor/lenis.min.js to vendor/lenis.min.js, start only without render=1, add html.journey-on with scroll-snap-type none (native snap fights Lenis) and Lenis's .lenis-smooth scroll-behavior auto rule.

## NEXT STEPS, in order
1. Write hero-journey.js (journey.js plus v2.js merged, using svgPlate, hole, spillMask and points 1 to 5 above) and hero-journey.css (journey.css's scene rules, scene height 3sh, the Pause word, the spill layer, reduced motion as built).
2. Edit index.html lines 31 to 48 and 132 to 138: section data-journey (drop data-plate so type-a.js skips it, then drop the type-a.js script from the home), add the reel video (media/reel-loop-phone.mp4 under 760, media/reel-loop.mp4, poster media/reel-poster.jpg, autoplay muted loop playsinline preload auto), lane preload none without autoplay, the Pause button, scripts lenis, hero-cut.js, hero-journey.js. Leave the lane's aria-label words alone (writing route). The reel needs an aria-label too: words for the writing route, list it as rough.
3. Raise --plate-etch (type-base.css line 34, .5; line 37, .3 phone) until the pattern reads at a glance; prove it with a 1x crop.
4. Render with glowup-renders/tooling/type-render.mjs (scroll in px = p * 2 * innerHeight, settle about 2500 ms after p .6): 1440 load, p .3, p .42, p .88, p .92, 390 load, 390 mid, reduced; 0 console errors, docW equals width; shares by glowup-renders/tooling/shares-by-hue.py.
5. Footer mark3d: look at it in a render, then rule on "random wishy washy 3D" in one line (leaning remove: the hero is now the plate; a second small plate floating at the end echoes the one Asif already had taken off).
6. Fill this note (eight lines, six words, shares, still rough).

## Still rough, known now
- The lane's aria-label (index.html line 35) still describes the old film; the writing route owns it.
- hero-cut.js has not run in a browser yet: SVG text with letter-spacing must be checked against the canvas layout at load (one pixel at most inside a word).
- The etch loop runs over the full device-pixel wall on the main thread (about 5 million pixels at 1440 on a 2x screen): a long task at load to measure.
