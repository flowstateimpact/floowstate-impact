# Anwar, round 13: the plaster wall under the ten inner pages

Packet: WHY, THE BAR, renders and attack list present; MEMORY and TASTE golden pairs absent. Judged from 15 r13 renders opened (the sheet, home 1440 and 390, the DARE pair, about, audit, websites, photography, chhaya late and the AI system late at 1440; websites, about and audit at 390), the source behind them (ground.css, site.css lines 332 to 1000, site.js lines 1 to 28, the audit's and about's markup), my round 12 verdict and the taste file. No site file edited. Contrast and motion numbers are Nadir's; I measured none.

PASS WITH NOTES. One reason: the wall is the mark, so the ground says whose house this is on every page, and the type stands on it like letters stencilled on plaster. Three small moves and one thing not to do.

## By page group
- The eight site.css pages (about, chhaya, heritage, films, photography, AI system, audit, websites): PASS WITH NOTES.
- Work and what we do: PASS. The film still is the pagehead on work; the wall shows only where it should.
- Home: PASS. The rest view under DARE is pixel for pixel round 12 (dare-r12-vs-r13.png); the phone stamp is the outline I asked for.

## 1. One wall, every page: richer, not wallpaper
Observed: the same crop on all ten pages at 1440, the comb crest rising from the left edge near y 700 to the right near y 480, the knot at the right edge. Cream stencil letters keep their cloth fill (site.css line 398); paper sections keep their paper; the 12 percent gloss flame is hidden.
Concluded: it reads as the house's own wall because the picture IS the mark and the crest sits in every first screen. One building has one wall; a crop per page would make it a background again. The drift (1.4vw, 0.9vh, 1.2 percent over 52, 73, 61 s) is felt, not seen: the right register. Dark texture under stencil type is a current look, but this texture has its reason in the content, the mark combed by hand, so it earns it. Condition: the crest stays in every first screen; move the anchor and the wall goes generic.

## 2. Question (a): home on flat black. Coherent, with one seam
Observed: the home hero wears the wall as the plate's face with letters cut through to film; under it, film, the hollow-row ledger and the footer on flat black (index.html line 119, `<footer class="foot">`). Every inner page ends its footer on the wall.
Concluded: wall, then what is cut through it, is a reading, and it holds; do not extend the wall under the film scenes or the ledger, the windows would fight the drift. The seam is the footer, the one piece of furniture every page shares: plaster on ten pages, black on the home, met within two clicks.
Fix: index.html gets `class="has-wall"` on `<html>` and ground.css after its last stylesheet; ground.js drops its `[data-plate]` exclusion so the layer is inserted on the home too; every home section between the plate and the footer gets its own paint (`background:` the home's current body black, read from the body rule in the stylesheet the home loads), so only the footer opens through the existing `html.has-wall .foot{background:none}`. Check first: ground.css `html.has-wall #top` and `.pagehead` must not touch the plate's container; if the home hero carries either, exclude it with `:not([data-plate])`.

## 3. Question (b): three cloths stay cleared, one returns as an object
Observed in site.css: warp (`.pagehead`), jamdani (`.pg-work main>section.dark`, `.pg-about #s3`, the film pages), the selvedge twill (`.foot`) and the audit's pattern card with its orange pencil line (`.pg-audit #s3`, lines 976 to 987) are all cleared by ground.css `background:none`.
Concluded: warp, jamdani and selvedge were grounds, and a site has one ground now; two cloth grounds under a plaster site would be two houses. Rightly cleared, selvedge included: a wall needs no hem. The pattern card is not a ground. It is a drawn object carrying the audit's own idea, measured before the cut; without it the audit page is the same page as every other. It returns, laid on the wall, not painted into it.
Fix, the-audit.html: first child of `<section class="sec dark" id="s3">` becomes `<div class="card" aria-hidden="true"></div>`. site.css: `html.has-wall .pg-audit #s3{position:relative}` and `html.has-wall .pg-audit #s3 .card{position:absolute;left:0;top:var(--at);width:var(--aw);height:calc(var(--aw) * .5582);background:url(media/textures/final/audit.jpg) left top/100% auto no-repeat;mix-blend-mode:lighten;pointer-events:none}`, the existing `--aw` and `--at` kept. Lighten drops the picture's own near-black (#040303) into the wall and keeps the card and the line; if the card's paper reads grey, change lighten to screen. Phone: the same element at `left:0;bottom:0;width:100vw;height:55.82vw;background-size:100vw auto`, the section's `padding-bottom:calc(64px + 40vw)` kept. Render both widths: the card must read as a thing on the wall, no flat patch around it.

## 4. 60, 30, 10: the thread holds, the phone stamp still competes
Observed at 1440 (by eye, not measured): websites, films, photography and the AI system carry a whole orange headline near 10 percent of the first screen, plus the stamp near 1 percent and the mark. The wall replaced black only; the flame's white gloss went, so the accent is purer. At 390 every inner page keeps the SOLID orange stamp above an orange word on the same screen, the stamp met first; the home phone has the outline since round 12.
Concluded: the shares hold; the phone stamp is the round 12 fault on ten more pages.
Fix, site.css, inside its `@media (max-width:760px)` block, on the selector that paints the menu's orange button: `background:transparent;color:var(--cream);box-shadow:inset 0 0 0 1.5px var(--accent)`, the move type-a.css carries for the home.

## 5. Legibility at 390
Observed: cream stencil over the ridges (audit-390 "EVERYTHING," sits on the comb lines) reads whole; body lines and buttons clean; Nadir's cream-on-wall figures 13.5 to 15.1 to 1.
Concluded: PASS. Not a fault: at 1.5 s the sheet catches the clip flood mid-flight (chhaya "SM", AI system "REMEM", websites-390 a wedge of W, about-1440 no headline yet); site.js line 1 says headings arrive once by a clip flood. Future sheets at wait 6000.

## 6. The six words
Dimension and depth: type on a wall with real relief, paper in front of it. Character: a hand combed this. Signature: the crest. Uniqueness: nobody else's wall. Style: plaster, paper, cut cloth, no fourth surface. Bland no; trying too hard no; derivative no, for the reason in section 1.

Receipt: 15 renders opened, source read at the lines named, nothing measured by code, no site file edited, no render taken.

## R13 FIXES RE-LOOK (30 Oct: eight r13b renders, three 2x crops, the last three ground.css blocks, glow.css lines 11, 26 and 112, index.html lines 2, 28, 118 and 120)
Packet: WHY and THE BAR present; MEMORY and TASTE absent.

1. Home footer on the wall: PASS. Observed: the hero, film and ledger sit on #0B0B0B, the black glow.css line 26 gave the body before (measure: main rgb(11,11,11)); the footer opens onto the plaster at 1440 and 390 (footBg transparent). The seam is three things in order: flat black, the footer's own one-pixel hairline (glow.css line 112, there before this round), plaster. Concluded: the footer reads as a slab laid at the bottom, the same hard cut the paper sections make against the wall on every inner page. Nothing added, nothing glowing.

2. Audit card: PASS at 1440; at 390 PASS on the part seen. Observed at 1440 (card 0, 80.5, 605 by 338): a dark pattern card with its punched hole, straight top, angled corner, the curved cut and the orange pencil line along it; the wall runs at full texture to its edge, no rectangle of the picture's black. The comb crests show faintly through the card, lighten letting the brighter ridges pass. Concluded: thin card stock on a raked wall, an object, not a patch. The faint show-through is the one tell; opaque is not reachable from this picture (keying its black is what lighten does; a luminance mask would leave the dark card near ten percent opaque). Door out, later: a cut-out PNG with alpha, normal blend. At 390 the render sat at scroll 1250, so the pinned bar hides the card's top 100px; the lower corner and a fragment of the line show bottom-left where the rule puts them. Not a block: the phone rule changes size and position only.

3. Phone stamp outline: PASS. about and websites at 390: ASK FOR THE AUDIT as a cream word in an orange outline; the orange mass on each screen is one word, AND and WEBSITES.

Ready to push: YES.

Receipt: eight renders opened, three crops made with sips in the scratchpad, source read at the lines named, no site file edited, no render taken.

Pictures tile re-look (30 Oct, home-1440-pic-c and home-390-pic-d, index.html line 63, the last two type-a.css rules): PASS. The wide 3 to 2 tile holds the strip's scatter at 1440 and sits full width on the phone; the low fade reads as shadow under the caption, not a band, and the white words sit clean at both widths. Ready to push still stands.
Note, a pick not a CSS fix: of the three tiles this is the one captured rather than made (office coverage, the subject small, the out-of-focus red back the loudest thing and a near neighbour of the orange thread); CSS cannot crop it out, since cover trims top and bottom at 1440 and the phone shows the full frame. If the series holds a frame where the seated subject carries the picture alone, prefer it; otherwise this one ships.
