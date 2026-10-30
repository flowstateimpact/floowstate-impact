# NADIR R16 FIX: Anwar's round-15 list, the stacking fault, re-rendered and looked at

Nadir, digital director, 31 Oct 2026 (this chat's account had Fable out, so the seat ran on Opus, effort high). A fix round, no redesign: no sentence changed on any page, no new words, the nine unlinked drafts untouched. Nothing committed; the chat commits by named paths after a look and a judge.

## Files touched
- bar.css (rewritten; the round-15 copy is in this chat's scratchpad as bar.css.r15)
- bar.js (rewritten; round-15 copy bar.js.r15 beside it)
- type-a.css lines 86 to 94 (the bar size and the ask moved out to bar.css; the orange block kept behind a switch)
- type-a.js line 66 (the phone stack share)
- site.js line 51 (the back-to-top arrow is not added on pages that carry the one bar)
No HTML file changed. No draft page changed. site.css untouched (its line 824 still lifts .first and .pagehead to 53 for the drafts).

## Anwar's fixes, in his order
- 5.1 Stations keep their order: DONE. bar.css line 71, `.knav .k[aria-current]{opacity:1}`, the `order:-1` gone. Seen on films-1440.png: 01 Websites above 02 Films above 03 Pictures, with 02 orange.
- 5.2 Orange scroll meter off: DONE. The `.knav::after` rule and its phone twin are gone from bar.css; the `--p` block is gone from bar.js. Seen on websites-1440-mid.png: a hairline at --hair, no orange run.
- 5.3 Rest opacity .7: DONE. bar.css line 67, `.knav .k{...opacity:.7}`; current at 1, the case page's own kind (.kin) at .85.
- 5.4 The rail never stands on a photograph: DONE. bar.js line 17: while `.pagehead .hero.pic .bed` or `.film-hero .bed` has its bottom below the middle of the screen the rail carries `.wait`; bar.css lines 76 and 77 hide it (opacity 0, .3s, no pointer). Seen on work-1440.png (no rail over PRESS PLAY), chhaya-1440.png and heritage-1440.png (no rail over the banner), and work-1440-mid.png (the rail arrived on the wall once the film had gone).
- 5.5 Back-to-top circle off everywhere: DONE. site.js line 51: the arrow is appended only when there is no `header.top`, so the eleven linked pages lose it and the drafts keep theirs. Every log line says `totop:false`.
- 5.6 Phone strip grounded and riding the bar: DONE. bar.css lines 81 to 85: `background:var(--black)`, the hairline on the top edge, stations left-aligned at the 20px wrap margin, `.knav.away{transform:translateY(100%)}`; bar.js line 10 puts the same away and back classes on `.knav` as on `.top`. Seen on websites-390-mid.png (strip gone while reading down) and websites-390-back.png (strip back on black at the foot, 01 orange).
- 4.2 Phone bar to two decks: DONE. bar.css line 45, `.top .kinds{display:none}` under 760. Bar bottom measured 88px at 390 (was 124). Seen on home-390.png and chhaya-390.png.
- 4.1 One bar size: DONE. bar.css lines 20 and 21: the links at --L1 (defined in bar.css :root, the same clamp as type-base.css) and full opacity on all eleven pages; type-a.css lines 88 and 89 and the phone 14px rule removed, the phone 14px now in bar.css line 44. Measured 16.44px at 1440 on home, websites, films, work, chhaya, heritage; 14px at 390.
- 6 One ask: DONE. bar.css line 24, `.top .ask{font-size:var(--L1);font-weight:600;border-bottom:1px solid currentColor}` on all eleven; type-a.css lines 90, 91, 94 as they were are gone. Measured background transparent on every frame.
- 2 Phone stack share .42: DONE. type-a.js line 66, `/2` is now `*.42`. Measured by pixel on home-390.png: bar bottom 88, the strategy line's cap top 249 (Anwar's window 225 to 250), air above the line 161, air from DARE's bottom (537) to the bottom line's cap top (766) 229, so the larger air sits under DARE.
- 7 pagehead 96 to 60 and the top scrim: DONE in bar.css, not site.css, so the drafts keep their 96. bar.css lines 53 to 58: desktop `.pagehead{padding-top:60px}`, the bed and its gradient re-anchored to -60, `[id]{scroll-margin-top:60px}`; the phone keeps site.css's 80px, which is the two-deck bar's height. Line 59: `.pagehead .hero.pic::before`, black .5 to 0 over the 110px under the bar, baked into the picture banner; line 25 puts the ask in normal blend over a picture banner. "All work" clearance: 30px under the bar at 1440 on films and websites (link top 96, bar bottom 66), 20px at 390 on films (108 against 88); on chhaya and heritage the link sits at the foot of the banner, far clear.
- Section 5 also asked that V1 and V2 go once V3 is right: DONE. The counter and switch blocks are out of bar.css, the `?nav=` reader out of bar.js, the room-dim `peek` with it. No page carries data-nav. One navigator, the rail.

## The stacking fault
- Cause: site.css line 824 `.first,.pagehead{z-index:53}` over the bar at 40 and the rail at 30. Fix: bar.css line 13 `.top{z-index:60}`, line 66 `.knav{z-index:58}`. Nothing else in the stack moves: the arrow (50) no longer exists on these pages, the docked button (54, 55) and the open phone menu (60) exist only on draft pages, which do not load bar.css, and site.css is untouched.
- Proof by toggle, by code and by eye: in chhaya-1440-zoff.png and heritage-1440-zoff.png the render forced the old 40 and 30 before the shot; the element under the bar's logo was the banner (IMG.bed on chhaya, VIDEO.bed on heritage) and the element at the rail's centre was DIV.hero pic. With the fix (chhaya-1440.png, heritage-1440.png) the element at the logo is the logo image itself, and with the rail forced visible (chhaya-1440-railforced.png) the element at its centre is the rail's own word. By eye: the fix-off frame has no bar at all; the fixed frames show the logo, Work in orange with its line, the three kinds, the four pages and the underlined ask standing on the banner's top scrim.
- Why films showed the bar at load while chhaya did not: ground.css line 37 sets the page header's background to none over the fixed wall, so on films, whose banner has no picture, the bar showed through the see-through header even while stacked under it; chhaya's banner picture is opaque and covered it.

## The two switches, each a two-line change
- (a) The ask. Built: the underlined word on all eleven pages (bar.css line 24). To return the home's orange block: index.html line 21, `<body class="type-a">` becomes `<body class="type-a ask-block">`; type-a.css lines 90 to 94 already carry the block and its phone outline behind that class. One look either way, per Anwar: if the block comes back, the other ten pages should get it too, which is then one more rule in bar.css.
- (b) The case pages' kind on the rail. Built as marked in round 15: chhaya.html line 20 carries `class="k kin"` on the Websites station; heritage-in-motion.html line 20 carries it on the Films station. To change either, move `kin` to the other station on that one line.

## Renders, all in glowup-renders/r16/fix/ (dpr 1; 0 console errors and document width equal to the viewport on every frame, per log-a to log-f.json)
- websites-1440.png: the bar at the text size, Websites orange with its line, the kinds after Work behind the hairline, the ask underlined; the rail on the wall at x 30, 01 orange, clear of WEBSITES and of the button. Re-shot at a 2.6 second wait because the first shot caught the headline's clip flood at WEBSIT; the flood is site.js round 6 and nothing in this round touches it.
- websites-1440-mid.png: bar away, the rail three words at .7 on the plaster, no orange run, no arrow.
- websites-390-mid.png: bar and strip both away while reading down. websites-390-back.png: bar back on black, the strip back on black at the foot, hairline on its top edge, stations from the left margin.
- films-1440.png: the stations in order with 02 orange; the bar with Films orange.
- work-1440.png: the bar on the film, the rail hidden while PRESS PLAY is in view. work-1440-mid.png: the rail arrived.
- home-390.png: two decks, the ask underlined, the strategy line as the start of the page, DARE the one orange mass with the larger air under it.
- chhaya-1440.png, chhaya-390.png, heritage-1440.png, heritage-390.png: the bar standing on the banner over the soft top scrim, the rail waiting. Plus the three proof frames named above.

## Open
- The scrim adds to the banner's existing top gradient (site.css line 326, .62 at the top), so the first 60px of a picture banner now sit near .8 black; it reads as a soft band in the frames, Anwar's re-look decides whether .5 is right or .35 is.
- The bar is 66px tall at the text size against the header's 60px padding; the 6px overlap lands in the header's own padding, never on a word.
- The two switches wait on Asif.
