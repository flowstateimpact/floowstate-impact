# ANWAR: re-read of Nadir's six fixes on the after renders, 25 Oct 2026

## The seven rulings

1. THE SIX FIXES.
- Fix 1, home A at 650: PASS. Street, DARE alone, no plate, no ghost.
- Fix 2, film in the cuts: SEND BACK. Half the headline still reads as holes in steel.
- Fix 3, what we do B, one title: PASS WITH NOTE. At 450 the face title at 13 percent reads under the solid spine; square the curve so the face stays under reading until about 20 degrees.
- Fix 4, the lines off the face: PASS. Readable at rest at x 1054, 46px clear of the slab at 450.
- Fix 5, what we do A open: SEND BACK. Ruling 4.
- Fix 6, nav orange: PASS. Zero orange pixels in the links band on both inner pages at 1440; the phone's "What we do" is white.

2. FIX 2'S MEDIAN: LIFT. A curve cannot lift black: type-a.js line 73 maps 0 to 0, so the film's true shadows stay at plate luma and a cut reads as a hole, not a window. Put a floor under the curve inside the cuts (about 22 percent, curve on top). Measure on three frames two seconds apart: darkest tenth of cut pixels at 60 or above on 0 to 255 (today 10.5 on line one); median 80 or above; every word's own median 70 or above (WORK today 24.7, darker than the steel at 31); 90th percentile under 215; plate mean 28 to 36. Only if the median still misses 80 does "other studios" drop to 70 percent white.

3. DARE AT 300: KEEP. The sheet hinges at its top and recedes below; DARE holds full size in front, so it reads as nearer than the plate, and 650 cashes it: the plate was cut around a word that was never on it. Call it that, not paint. At 650 pass the film's grain over DARE: a title card, not a sticker.

4. FIX 5'S OVERFLOW: MUST FIX before Asif sees it. At rest the picture runs y 114 to 899 in a box ending at 556; at 450 a purple strip at x 1036 to 1400, y 134 to 141, above the first sheet; at 1100 the second sheet fills from y 141 and a third sheet's edge shows at x 925 to 1025; the stack's top drifts 114, 129, 133. Cause (concluded, high): type-a.js lines 212 to 213 move the four anchors out of .duo into .pages, so glow.css lines 223 (overflow hidden) and 224 (the image sizing) stop matching; type-a.css line 63 sizes the anchor only, and the image falls to glow.css line 24 with its HTML height of 1600, so it draws 375 by 1600. The drift (concluded, medium): glow.js line 100 bound a parallax to ".duo .pic img" before the move, and it still runs on a 1600px image. The purple is sheet two. Measure: picture rows equal the anchor's box (88 to 556 at 1440) at scroll 0, 450 and 1100 within 1px; zero non-black pixels in x 1026 to 1400, y 60 to 87; gsap.getTweensOf(img) empty.

5. THE PHONE VOIDS: MUST FIX, same class as the home B veto. 474 CSS px of black between the nav's last row and the title cap on A at 390 by 844, 462 on B. Cause: glow.css line 149 and type-a.css line 35 pin the title to the bottom of a full-screen hero, and the desktop fix sits inside min-width 761px (type-a.css line 59). The rule exists at type-a.css line 53 (cap top at 40 percent of the screen); apply it under max-width 760px on A and B. Measure: first content row at most 200 CSS px under the nav's last row.

6. HOME A PLUS WHAT WE DO B: YES. The home's 650 frame now earns the plate (the street was the point, the plate the stencil), and B is the only inner open where the motion carries the sentence; A's open is text left and picture right, the split hero every studio ships.

7. THE 60, 30, 10 READ: holds on the home (DARE the only orange object at rest and at 650; warm tones counted as accent at 650 are film, not interface). Inner nav clean. Action underlines are orange on the inner pages (55 px under "The audit" at 1440 on B; 75 and 68 px under "See Heritage" and "See Chhaya" at 1100) while the home's "Ask for the audit" underline is white. A 2px orange hairline runs the full width at the bottom of A's phone frame (780 by 2 px at 2x), absent on B: decoration. Ruling: orange on the word plus the underline of the one action per screen, on every page, the home included; the four "See" underlines go white; the hairline goes.

## Observed against concluded
OBSERVED by code: every count, row and column above; the mask lines up with the screenshot (cut bands 331 to 422 and 512 to 606 against letter bands 329 to 421 and 513 to 606) but covers only 6 to 22 percent of each word's box, so per-word medians are samples. OBSERVED by eye: nine after frames, three before. CONCLUDED: every verdict; the causes in rulings 4 and 5 are read from the files, not stepped through live. Not opened: Safari, the other eight renders.
