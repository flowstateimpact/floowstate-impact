# NADIR R20b: speed fix finished, one visible change named, faint edge differences left

Model: Opus. Nothing committed or pushed. The three live files hold the final R20b version (the speed line passed). Before = R19 on 8792, after = this worktree on 8791, both rendered after 13:31 and both saying "other firms".

## What caused each pixel difference
- p20 and p30, the big blocks (16k and 20k px): this is R19's own artefact. R19 moves the band layer by translate3d(3s, 4s) px, which is (20, 27) px at p20 and (61, 81) px at p30, so the layer's box edge drops into the frame. The dark band then stops on a flat line and film shows above it. My overscan draws past that edge, so the strokes run to the top of the frame. VISIBLE CHANGE, for Anwar. 1x crops: r20b/crop-p30-before-1x.png against crop-p30-after-1x.png, and crop-p20-before-1x.png against crop-p20-after-1x.png.
- The scattered edge dust: Chrome's anti-aliasing changes with the 4th decimal of the viewBox. R20 wrote 4 decimals over a box larger than the frame. Test: overscan off plus R19's 3-decimal viewBox gave 0 px different. The fix is in.
- What is left: Chrome rasters a layer whose bounds start at (-230, -144) slightly differently from one starting at (0, 0). Tried and failed: 256 px margins (416 px over 8, not 0), dropping will-change at rest (worse, 6,074), the lip back inside the top layer (no change), R19's band rounding (no change).

## Changes
- hero-journey.js:50-51: cutAt writes R19's viewBox to the digit (3 decimals over the frame).
- hero-journey.js:53: lens drops the overscan origin term, because the layer's origin is now the frame's origin.
- hero-journey.js:106: overscan = clip-path inset(-144px -230px) per layer, not a larger box.
- hero-journey.css:18: .cut .lay overflow visible.
- The TEMP HJX probe switch is removed (hero-journey.js has no HJX left).
- hero-cut.js:30: studios to firms (coordinator). "other firms" starts at x 420, WORK's own left edge (420 to 971), at y 504 under it. under:'last' holds.
- wip/mkjob.py: the after job stays on 8791 and takes an output folder.

## Numbers (headed Chrome, M2 Ultra GPU, Lenis on, wheel scroll)
| run | pass 1 (cold) | pass 2 | pass 3 |
|---|---|---|---|
| dpr 2 longest, ms | 32.5 | 17.7 | 32.5 |
| dpr 2 frames over 33 / over 50 | 0 / 0 | 0 / 0 | 0 / 0 |
| dpr 1 longest, ms | 17.7 | 17.7 | 17.7 |
R19 control (P31): dpr 2, 2 to 4 frames over 50, longest 65.8 ms.

## Per-frame diff against R19 (max out of 255, px over 8)
load 2, 0 · p20 182, 19,330 (outside the band-box strip: max 71, 560) · p30 183, 24,791 (outside the strip: max 47, 73) · p42 37, 6 · p92 0, 0 · 390 load 2, 0 · 390 mid 21, 1 · reduce 2, 0.
Reduced motion: Play at (40, 842), mode still, no scroll. docW equals the screen on all eight. 0 console errors.

## Self-grade
- Speed: PASS on every line.
- Pixels: PASS except (1) the named band-edge change at p20 and p30, Anwar's call, and (2) the faint edge dust: 560 px at p20, 73 at p30, 6 at p42, single pixels on curve edges, max 71. Strictly over 8/255, so it is named here, not hidden.
