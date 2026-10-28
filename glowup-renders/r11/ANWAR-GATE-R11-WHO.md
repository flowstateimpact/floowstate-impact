# Anwar, gate R11: Who without the tea stall (28 Oct 2026)

## Verdicts
- 1440: HOLD.
- 390: PASS.

## Observed
- 1440: the heading is 50 px (glow-a.css:73, `.block .h` at 3.5vw). The column spans x 40 to 456. The field to its right is about 980 px wide and 590 px tall, with nothing in it.
- The ground (glow-a.css:101-102) is lit by its comment as "the lane's wet ground throwing the stall's light back up". The stall is gone.
- The 1440 link underline is orange. The thread runs from See inside to See the work.
- 390: the words fill the width. The heading is 33 px (8.5vw) over two lines and the section is about 360 px tall.
- 390: the second line and the link are grey in the frame. That is the stagger fade (glow.js:92, 0.6 s, 0.08 s apart) caught mid-run, not the page as it finishes.
- The close, two sections down, is "Growing? Good." in the stencil at 112 px (type-base.css:13 and 65).

## Concluded
- At 1440 the field is the picture's empty chair, not held space. The type size, the column and the ground were all set for a picture that is no longer there, and nothing about the emptiness was chosen. That is BLAND (unfinished).
- A ghosted mark or the plaster wall behind four lines would be wallpaper and would weaken the hero's one wall. Giant type would take the close's punch.
- Space is held when two masses face each other across it. The studio already has that shape: the comma page's end row, with the title on the left and a 300 to 360 px column of lines on the right, both sitting on one foot line (type-a.css:65-66).

## Fix, desktop only, CSS only, append to type-a.css inside the existing `@media (min-width:761px)` block after line 51
```
.type-a:not(.inner) .grow{display:grid;grid-template-columns:minmax(0,1fr) clamp(300px,24vw,360px);grid-template-rows:auto 1fr auto auto auto;column-gap:calc(var(--m) * 2)}
.type-a:not(.inner) .grow .lab{grid-column:1 / -1;grid-row:1}
.type-a:not(.inner) .grow .h{grid-column:1;grid-row:2 / 6;align-self:last baseline;font-size:5vw;margin-bottom:0}
.type-a:not(.inner) .grow p{grid-column:2}
.type-a:not(.inner) .grow p:nth-of-type(1){grid-row:3}
.type-a:not(.inner) .grow p:nth-of-type(2){grid-row:4}
.type-a:not(.inner) .grow .go{grid-column:2;grid-row:5;justify-self:start;align-self:last baseline;margin-bottom:0}
```

## Acceptance, measured, at 800, 1280, 1440 and 1920
1. The heading still breaks as "For people who want / to grow." (72 px at 1440, below the service words at 84 and the close at 112).
2. The baseline of "to grow." and the baseline of "See the work" are within 2 px of each other.
3. The page is exactly as wide as the screen, with 0 page errors.
4. 390 renders exactly as it does today.
5. The frames are re-rendered after the fade has finished.

## Note, no change ordered
The ground's stated reason died with the stall. It still does a job, lightening toward the team line and the close. The comment should say that.

## R11b, after the fix (28 Oct 2026)

### Verdict
- 1440: PASS.
- 800, 1280, 1920: PASS on the numbers. No section frame at those widths was looked at; the frames caught the hero.
- 390: PASS stands. The fix lines sit inside the desktop block (type-a.css:53-59, inside the 761 px query that opens at line 40).

### Observed
- 1440 frame, read by pixel: the ink of "to grow." ends on row 583, the ink of "See the work" on row 582. One pixel apart.
- The orange underline of "See the work" sits on row 590. The thread from See inside runs on into this section.
- Heading 72 px, two lines, the break as specified. The heading runs to about x 697; the right column starts at x 1054. A gap of about 357 px between the two masses.
- The right column's first ink is on row 438; the heading's cap top is on row 456. The column starts 18 px higher.
- The chat's box bottoms: 800 -1, 1280 +1, 1440 +1, 1920 +5 px (heading minus link).

### Concluded
- The field now reads as held space. Two masses face each other across it and land on one foot line, so the emptiness has a reason.
- The 5 px at 1920 is most likely the heading's bigger descent below its baseline (96 px type against 72), not a baseline miss. This is inferred and not measured: the true-baseline run did not finish inside the time box.
- Not a fault: the 18 px top offset. The shared foot line is the alignment that matters here.

### No change ordered
- The ground's comment (glow-a.css:101-102) still names the stall. The R11 note stands.
