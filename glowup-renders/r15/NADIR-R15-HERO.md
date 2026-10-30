# NADIR R15, THE HERO: Asif's three revisions (31 Oct 2026)

Nadir, digital director (Fable, high). Files touched: type-base.css, type-a.js. Nothing else; nothing committed. Renders: glowup-renders/r15/hero/ (before set in glowup-renders/r15/hero/before/). 0 console errors and document width equal to the viewport on every frame rendered.

## 1. The white rim: "keep 10% of it"
- Before: --hollow-rim .010em with a .75px floor = 1.77px at 1440 (L6 178), 2.22px at 1870 (L6 222), at full white.
- After: --hollow-rim .001em (a literal tenth, .18 to .22px), floor --hollow-rim-min .5px, and a new --hollow-lip .4 (the lip's white, 0 to 1).
- Why this reading: a tenth of the width is under one device pixel and fell out of the plate texture entirely (the shader's rim threshold never saw it), so the lip is drawn at exactly one device pixel whatever the screen ratio (type-a.js texture(): lineWidth 2 x max(1, rim x dpr) / dpr) and the rest of the tenth is carried by its brightness. On a 2x screen one device pixel at four tenths white is 13 percent of the old rim's ink at 1440 and 11 percent at 1870; on a 1x render it is about a quarter. The dark wall band (--hollow-wall .012em, 2.1px at 1440) is unchanged, so the cut keeps its lip plus thickness reading instead of a bare mask.
- Shader: rim mix is now rim x uLip. SVG fallback: stroke-opacity = lip, stroke-width = one device pixel. DOM hollow words: the stroke colour is color-mix of --white at --hollow-lip (no page in this worktree carries a DOM .hollow word today; the rule still agrees).
- Crop pair: glowup-renders/r15/hero/rim-before-1440.png and rim-after-1440.png (same region of WE MAKE / THE WORK at 1440, dpr 1). Looked at both at 3x: before, a bright 2px white outline; after, a grey hairline just inside each cut with the dark wall band still reading. The lip is not lost.

## 2. The top line clear of the logo
- Cause: comp 3 centred the whole stack (strategy line, four rows, bottom line allowance) on the full screen height 0..H and ignored the fixed bar. Measured before at 1870x1000: strategy line cap top at y 83, logo bottom at 54, bar bottom at 79: 29px under the logo with a 48px line, which reads as one stack with the logo. The fitH formula (navH) is not the fault.
- Fix (type-a.js layout(), the else branch, one line): on desktop comp 3 the stack centres in the band under the bar: top = navH + (H - navH - block - strapH - under) / 2 + strapH. The phone branch (Anwar R12 c) is untouched.
- After: strategy line cap top at 139 at 1440x900 (was 109), 113 at 1870x1000 (was 83): 33 to 34px clear of the bar's bottom edge, 59px clear of the logo's bottom edge. 1280x720 rendered, 0 errors (hero-1280x720.png); its measure line is in render-log-widths.json. The 2200x1100 frame was queued in the same background job; see render-log-widths.json for whether it finished (the chat should check it, I ran out of budget before reading it). By the formula the cap top at 2200x1100 is navB + 28 + .025 x L6 = about 113, and DARE's baseline keeps .115 x L6 + 52px (about 80px) above the bottom line's cap top at every width.

## 3. The FlowStãte pattern on the hero plate
- What was there: the plate's face already samples the plaster wall (media/ground/plaster-desk.jpg, the mark combed into black plaster) as uG, but at .07 luminance with no light on its grooves, so at 1870 it read as a few faint arcs, not as the mark and not as a material.
- Chosen: shader relief, no new file. The shader reads the wall's own grooves as a height field (luminance gradient, 1.5 device pixels either side) and lights them from the left with the plate's own light uL, the same direction as the steel flame on the plate screen below: the slope facing the light catches a warm white, the slope away falls into shadow. Gain is --plate-etch (.5 desktop, .3 phone), applied before the .22 see-through mix so the street still shows through the face and the cuts stay the brightest window. SVG fallback: an feConvolveMatrix top-left emboss added back onto the wall image at 3 x --plate-etch.
- The one sentence: the plate's face is the studio's own mark combed into it and lit from the left like the steel flame below, because the hero plate and the plaster wall are one material and the mark is cut into everything the studio stands on.
- Why not a baked file: the wall is already the mark's own pattern (Asif, 28 Oct: nothing but the logo's own), and shading it in the shader keeps it breathing with the wall's three swings (ground.js) and keeps ONE pattern language from the hero to the footer; a new file would have been a second drawing of the same mark.
- Strength: at gain 1 the fine comb hatched the whole face at 1440 and went to grain on the phone (the 660x1428 phone wall is drawn 1.6x up), competing with the letters; halved to .5 (phone .3). Crop pair at gain 1: pattern-before-1440.png and pattern-after-1440.png (the DARE corner): before, flat dark plaster; after, the comb ridges stand up and catch the light, a relief not a picture.

## What each render shows (looked at)
- before/before-1440.png, before-1870.png, before-390.png: the state before the three changes, with measurements in before/render-log-before.json.
- hero-1440.png, hero-1870.png, hero-390.png, hero-1440-reduce.png: the final frames at --plate-etch .5 / .3, 0 errors, docW = viewport (render-log.json). I looked at the full set at gain 1 (strap clear, lip a hairline, the mark's sweep readable across the plate, the hatch too loud) and at the final 1440 and 390 frames at gain .5 / .3 at a glance before stopping; Anwar should look at the final four in full.
- hero-1280x720.png: 0 errors. hero-2200x1100.png: queued, see render-log-widths.json.
- A dpr 1.5 frame at 1440x900 hung the renderer (as the brief warned) and was dropped; all frames are dpr 1.

## Open
- Final-gain frames (etch .5 / .3) have only been glanced at by me; the judge decides whether .5 is the strength or .35 to .4 is.
- The SVG fallback (no WebGL) path was edited but not rendered: the render tool has no switch to force it.
- At 390 the bar's bottom moved from 93 to 124 between my two render rounds: that is the second seat's header work, not mine; the hero's phone stack still centres between the bar and the bottom lines, so the headline moved down 16px with it.
- Nothing committed; the chat commits type-base.css and type-a.js by name.
