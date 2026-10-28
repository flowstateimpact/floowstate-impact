# Nadir, hero run 4 (28 Oct 2026): comb strokes, arm's reach by arm's reach

Motion language unchanged: THE ROOM WAKES WITH THE WORK. Only the wall's geometry moved. The light model, type, colours, rim, button and bone flame are exactly as run 3.

## What the wall is now
A hand set a five-tooth comb into wet plaster, dragged it one arm's reach left to right, and lifted it out. The next reach set down inside the last one's tail, a little up or down. Sets of five grooves sit apart from each other, so the wall groups in bands of strokes, not an even ladder.

## Files changed (not committed; the chat commits after the judge)
- glowup-renders/tooling/hero-reveal-board.html (one file, about 75 lines in, 24 out)
  - :25 DESK and :34 PHONE: `pitch:96` / `pitch:58` replaced by `comb:{t, n, L, ov, jog, tilt, bow, gap}`. Desk: tooth spacing 30, 5 teeth, reach 500 to 900, overlap 40 to 120, jog 4 to 14, tilt 0.6 deg, bow 6 to 10, set gap 1.6 to 2.2 x tooth. Phone: 17, 5, 220 to 320, 40 to 80, 4 to 10, 0.6, 6 to 8, 1.6 to 2.2.
  - :56 new `combPasses()`: lays the rows and chains the passes. Restart points in neighbouring rows are kept at least 12 percent of the width apart, so no break column lines up down the wall (that would read as board butt joints). Tilt and jog steer back toward each row's line so sets never collide.
  - :78 `ground()` rewritten to cut pass by pass: set-down mark (groove 60 percent wider and 35 percent deeper for the first 6 percent of the reach, plaster piled round each tooth where it landed), lift-out tail (last 18 to 28 percent, each tooth leaves at its own moment), the comb held at a lean so its teeth land on a diagonal (never in a column), each tooth flexing and its width varying along the stroke, torn edges at a scale that survives half size, and each new reach smearing the last one's grooves where it passes over them. Normals, AO, albedo and plaster tooth are built as before.
  - :115 geometry stats returned in report.json (b1 and f10). :281 a 10px scan for where the pool under DARE peaks; phone scan stops 110px above the bottom line so it does not read the footer text.
- Untouched: lightField, lightPower, shade, TINT, beat(), chrome, film, render script. Run 3 board kept at the chat's scratchpad as board-run3.html.

## Screenshots (looked at each myself)
glowup-renders/r8/hero/: b1 to b9 full (2880 x 1800 JPEG) and half (720 x 450 PNG), f10-phone-still full and half, bridge PNGs, report.json.

## References (looked at, addresses)
- clay-works.com/wp-content/uploads/2024/11/Raked-rustic-819x1024.jpg: horizontal raked clay. Lines stop every hand-length, taper out, and a new line starts a few millimetres off; edges torn with crumbs. The main model.
- clay-works.com/wp-content/uploads/2024/11/Raked-Tad-768x960.jpg: vertical raked. Lines wander, merge and stop mid-wall.
- kamism.co.jp/en/wp-content/themes/kamism_en/img/technique/img_kushibiki_01.jpg: kushibiki, a hand comb in the material. One pass is one set of fixed-spaced teeth; the next pass crosses the last one's ends.
- i.pinimg.com/originals/0b/49/3f/0b493fb43ec655e794d34d7f74a76f0e.jpg: raked concrete in a dark room; uneven groove depth, the mood.
- Counter-example: i.pinimg.com/originals/8a/25/2a/8a252aa1c1519a8193672ec9de333f6e.jpg (Aesop fluting). Even, unbroken, edge to edge: the board family we are leaving.

## Measures (report.json)
| | desk 1440 | phone 390 |
|---|---|---|
| Pass length, visible passes | 500.4 to 837.1 (15 passes) | 231.8 to 317.6 (22) |
| Overlap | 49.8 to 119.3 | 40.7 to 77.8 |
| Jog | 4.8 to 13.9 | 4.2 to 9.8 |
| Tilt max / bow | 0.59 deg / 6.5 to 9.9 | 0.60 deg / 6.1 to 7.9 |
| Gap between sets, x tooth | 1.78 to 2.15 | 1.64 to 2.18 |
| Pool under DARE peaks | 10px below the baseline, red 46.8 (run 3: about 100px, 26.5) | 10px, red 32.1 |
| Right-third swing | x 1380: 43.8 (run 3: 39); x 1100: 45.3 | x 350: 35.8 |

- Longest unbroken groove at 1440: 837px (geometric, the longest reach). Every line breaks with an overlap and a jog.
- Shares at b9: black 94.1 / bone and film 4.5 / orange 1.38 (run 3: 94.0 / 4.6 / 1.39).
- Rim contrast unchanged: 15.4 to 1 vs film median, 17.3 to 1 vs wall.
- Page errors: 0.

## What I saw
- Try 1 (removed): the breaks were real, but every set started on one crisp vertical edge. At half size that read as stacked shingle or board ends. Not shipped.
- Try 2 (on the board now), b9 at half: the bands break and restart with diagonal set-downs; the lines wander and tear. Under DARE and to its right, the full-size crop reads as raked render: torn edges, tapering tails, a fresh pass starting inside the old one.
- Weakest place: the upper-left band above the strapline, lit by WE MAKE. The lines there are thinner and longer-looking, and the diagonal step-ends could read to a stranger as layered slate or ledgestone. Not boards.
- Phone f10: short broken reaches round DARE and NOT; reads as worked plaster.
- b2 and b4 keep the story beat: wall dark, then waking only round the brightest film.

## Self-grade (once)
- Pass length range: desk 500 to 837, phone 232 to 318. In spec.
- No lit line unbroken more than 900px at 1440: YES (837 max).
- DARE in light at 0.5x: YES. Pool peak 10px below (was about 100).
- Right-third swing: 43.8.
- Page errors: 0.
- My honest half-size answer: plaster, a raked or combed wall. Upper-left is the soft spot (could read as stone strata), not boards. Anwar's stranger test decides.

## Not done / open
- Ava's plate (plates/d1/d1_plate.py) not touched: her lane, same spec.
- Figma page "Hero Reveal 4.2s" (41:2) still shows the run 2 lamp; this brief asked for code renders only.
- The live site still carries the old ground; it loads this as a swappable layer after the gate.
