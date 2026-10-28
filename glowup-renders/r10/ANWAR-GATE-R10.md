# Anwar: gate on the home page with the mark wall baked in (r10, 28 Oct 2026)

PASS WITH NOTE. Desktop clears the bar and commits. The phone does not yet show the mark, and has one crop fix before Asif judges the phone.

## OBSERVED

- 1440 first screen: combed grooves, pinholes and a hairline crack read as trowelled plaster at true brightness. The hump crest arcs over "WE MAKE", the swell sweeps down the left third, and the tail rises under "WILL NOT" into DARE.
- Computed from the bake numbers and CSS: the tail's knot lands near screen (1268, 525), inside DARE's box. DARE's counters (the closed spaces inside letters) are solid orange, so nothing shows through.
- The film inside the stencil letters and the orange DARE are the brightest things on screen. The brightest 1 percent of the plaster sits at 35 of 255.
- 1x checks: no knot behind DARE; the "WE MA" grooves resolve as single lines in both still frames, flat and tilted.
- 390 phone: the tail's point lands near (354, 455), behind the T of "NOT". What stays visible is combed band at the lower left (y 540 to 650) and the extra arc at top right. Brightened 1.8 times, it is a tail; at true level it is diagonal combing.
- Phone full page: two cascade cards show captions with no picture, and "For people who want to grow" shows a black square. r9's phone full page shows the same.
- Reduced-motion frame matches the standard frame.

## CONCLUDED (my eye; no panel)

1. Stranger test. Desktop: plaster first, mark second, and ours to anyone who has seen the top-bar flame. The flame's tip burning as DARE is the move this hero lacked. Phone: plaster yes, ours no. Not a smear; the combing is crisp. But the narrowing point that identifies the mark is hidden, which is the crescent's failure again at phone size.
2. Light: the letters own it. The ribbon is drawn by texture, not brightness, so it never competes.
3. Phone tail: reads as a combed sweep, not the mark. Fix below.
4. Both checks pass. No 40 px shift, no 60 px shift. Motion shimmer during the tilt is NOT checked.
5. Below the hero: nothing in this change blocks a commit. The orange stays on DARE and the audit asks; the top-bar flame stays bone. The empty phone frames predate this round; most likely the full-page capture skipped lazy pictures (unverified).

## THE FIX FOR THE PHONE (a crop change, no credits)

- Re-bake media/ground/plaster-phone.jpg and .webp from G2 window x 2140 to 2549, y 650 to 1536 (409 x 886, the same tall shape). Same recipe, output 660 x 1428.
- Predicted, by arithmetic: the knot lands near screen (333, 205), in open plaster between the menu and "A strategy and design firm". The tail rises from the lower left, behind the headline, to that point.
- Why: the point's height is fixed by the source, so on the current crop it always lands on the "WILL NOT" line. Only a closer crop lifts it into open air.
- Cost to watch: the bake now upscales 1.6 times, so the grit softens. If the grooves turn mushy at 3x phone density, fall back to x 2119 to 2551, y 600 to 1536 (point near y 239, a tighter fit above the first line).
- Update the comment on glow.css line 41 to say the point sits above the headline.
- My overlay preview of this window was muddied by the old wall underneath. The prediction is arithmetic, not a look. Render it at 390 and bring it back to me.

## BEFORE ASIF SEES THE PHONE

- Scroll the phone page for real and confirm the cascade pictures and the black square load.
- Record two seconds through the tilt at 1440 and look at "WE MA" for shimmer.

Commit the desktop now. Asif sees desktop first; the phone goes to him after the re-crop passes me.

## PHONE RE-CROP (a-390-p2.png, same day)

PASS. Keep this window; the fallback is not needed.

OBSERVED
- At true brightness, a combed band enters from the left edge (about y 95 to 250) and narrows to a torn point near (345, 210). That puts it in open plaster above "A strategy and design firm", with about 60 px clear.
- The grooves in the band resolve as single lines. Below DARE the wall is open plaster with pinholes, visibly softer.
- The render is 390 px wide, so it is a 1x frame. The 3x screen was not looked at.

CONCLUDED
- Stranger test, phone: plaster first, then a stroke that ends in a point, directly under the bone flame in the top bar. That narrowing point is the mark's signature, and now it is in the open. Ours.
- Softness: acceptable. The relief is drawn by the grooves, which survive the enlargement. The soft part is grit in the lower half, at a brightness close to black. The calm below DARE also gives the headline room.
- The fallback would move the point to y 239, 30 px from the first line. That is tighter and gains only 5 percent sharpness. Rejected.

Before Asif sees it (does not block the commit): one 3x render of the top 300 px, to confirm the grooves stay crisp on a real phone screen. Update glow.css line 41 to name the new window.
