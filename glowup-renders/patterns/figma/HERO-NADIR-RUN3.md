# Nadir, hero run 3 (28 Oct 2026): the work is the only lamp, bone flame in the nav

Motion language, named first: THE ROOM WAKES WITH THE WORK. Until the film comes up the wall is dark and has no relief. At b4 the film rises in the letters and the plaster around each word wakes with it. At b8 DARE lands and throws the warmest pool. The light is never a halo. It shows in the relief: groove walls and plaster tooth facing the word catch it, and the flat land catches less.

## Files changed (none committed; the chat commits after the judge)
- glowup-renders/tooling/hero-reveal-board.html
  - :24-25 DESK and :32-33 PHONE: both off-frame lamps deleted (`lamp:[-0.10,0.32,...]`, `lamp:[-0.30,...]`). Replaced by `land:4, gdepth, tooth` and `emit:{cell, lz, d0, film, dare, peak}`.
  - :49 `ground()` rewritten. Grooves are now cut into flat land, about 4 to 1 land to groove, at a pitch of 96 (phone 58), each varied ±10%. Each groove has its own width and depth, a rounded floor, crisp walls and the small burr the comb pushes up. The edges are ragged (never ruled), the comb pressure changes along the stroke, and in places the comb lifts out. The land carries plaster tooth at three scales and a slow mottle. Normals come from the height map. This matches Ava's new profile in plates/d1/d1_plate.py (line 7: "grooves cut into flat land, land to groove about 4 to 1", comb lifted, tooth). I matched it from the brief's spec while she was cutting; at the end I read her header and the two agree.
  - :78 TINT: light comes back in the black pigment's own warmth, so the film spill lands warm.
  - :83 `lightField()`: every 8px block of each lit letter is an emitter, coloured by the film inside it. DARE's blocks are orange and the hottest. The light is summed as a per-channel irradiance vector on a 4px grid, with falloff d0 100 at 1440 and 62 at 390, and dotted with each pixel's normal.
  - :103 `lightPower()` and :181: the light's power is set once per screen, on the finished frame, so the 99.5th percentile of lit plaster lands at red 74 (phone 70). Every beat uses that same power, so the light rises honestly with the film.
  - :149 chrome(): the flame mark is drawn bone E8E2D6 (source-in fill).
  - :222 `probe()`, plus a rim-contrast count inside beat() and a half-size PNG per beat.
  - Inside the letters is untouched: the film is unblurred and undimmed, the rim is unchanged, "other studios" stays at .66, the strap line is as before, and there is no Dhaka/London. DARE's paint takes the groove AO at ±4% at most.
- glowup-renders/tooling/hero-reveal-render.mjs :7 takes an output folder as its second argument. :28 writes `-half.png` beside each full JPEG.
- glow.css:45 is the one nav rule. `.top .logo img:first-child` now paints #E8E2D6 through the mark's own shape (mask, plus object-position to hide the orange file). The favicon, the footer and media/fsi-mark.svg itself are untouched, so they stay orange. Computed on index-type-a.html: background rgb(232, 226, 214), 28.7 by 24px.

## Screenshots
- Beats, full (2880 by 1800 device, JPEG) and half (720 by 450, PNG): glowup-renders/r7/hero/b1-0.20s … b9-4.20s, f10-phone-still (phone full 780 by 1688, half 195 by 422), plus the bridge PNGs. Numbers: glowup-renders/r7/hero/report.json.
- Live site with the bone nav mark: glowup-renders/r7/hero/site/site-1440.png and site-390.png (job: site/job-nav.json, log: site/render-log-nav.json).
- Baseline (old lamp, same probe): scratchpad only, numbers below.

## What I saw (looked at each myself)
- b9 at half: DARE stands in a warm amber pool that runs under and around it to the right edge, so the right third is alive. WE MAKE and WILL throw a dimmer, warm-grey spill. The top band near the nav and the lower-left fall back to warm black.
- Full-size crops under DARE and under WE MAKE: they read as plaster, with tooth grain, narrow combed grooves and broken lines where the comb lifted.
- Honest risk: at half size the upper-left still shows three or four lit groove edges running long. They read as a combed wall to me, but they are the place a stranger might still say "slats".
- b4: the wall wakes only where the film is brightest (around WILL, WE). That is the story beat.
- f10 phone: a warm pool under DARE, plaster grooves, bone flame.
- The live site renders clean with the bone flame. Its ground is still the old brushed look until the site is rebuilt from this board.

## Measures (b9, 1440, red channel down empty ground, y 620 to 820)
| column | before (old lamp) min / max / swing | after min / max / swing |
|---|---|---|
| x 120 | 13.3 / 27.8 / 14.5 | 13.0 / 27.5 / 14.5 |
| x 700 | 13.3 / 20.3 / 7.0 | 14.0 / 27.5 / 13.5 |
| x 1100 | 13.3 / 19.0 / 5.8 | 13.8 / 47.3 / 33.5 |
| x 1380 | 13.3 / 17.8 / 4.5 | 13.3 / 52.3 / 39.0 |

- Falloff, band means at x 1080 to 1320 (rest is about 14.5). Above WORK: 50px 19.9, 150px 16.9, 250px 15.4. Below DARE: 30px 17.8, 100px 26.5, 200px 17.7, 250px 16.2. The light is within two levels of rest by 250px, so it fades inside 350px.
- Phone f10 (y 560 to 760): swings of 2.8, 16.8 and 24.3 at x 40, 195 and 350. Below DARE: 30px 30.5, 100px 17.7, 200px 14.9.
- Rim contrast (WCAG) at b9: 15.4 to 1 against the film median, 17.3 to 1 against the dark wall, 2.2 to 1 against the brightest 5% of film. That last figure is unchanged from before, because the film is untouched.
- Shares at b9, by the board's counter: black 94.0 / bone and film 4.6 / orange 1.39. Before: 95.3 / 3.4 / 1.37. The warm plaster light stays under the counter's orange threshold, so it counts as black. That is the counting fault Anwar named; the re-count by layer and hue is still not done.
- Page errors: board 0, live site 0 at 1440 and 390.

## Self-grade (once)
- Zero off-frame lamps: YES (both deleted; the only emitters are letter blocks).
- Right-third swing: x 1380 went from 4.5 to 39.0, and x 1100 from 5.8 to 33.5. The brief quoted 3 points as last run's figure; it was measured differently.
- DARE in light at 0.5x: YES.
- Nav flame bone: board :149, site glow.css:45. Favicon and footer stay orange.
- Page errors: 0.

## Not done / open
- Figma page "Hero Reveal 4.2s" (41:2) NOT updated. Its ten frames still show the old lamp. The board and the r7 renders are now the truth. Next helper: upload r7 b1 to f10 into frames 41:3 to 41:21, and rewrite the b2 and b4 captions ("wall dark, no relief" / "the wall wakes with the film").
- The live nav's "Ask for the audit" underline is currentColor with difference blend (white), not orange as the board draws it. That is outside this brief, so I flagged it and left it alone.
- Whether the upper-left groove edges read as slats to a stranger at half size: Anwar's call.
