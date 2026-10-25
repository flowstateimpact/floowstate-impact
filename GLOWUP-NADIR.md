# GLOWUP-NADIR: three home page directions for flowstateimpact.com

Status: round five rolled work.html and what-we-do.html onto glow.css, rendered once; three fixes after the look are unrendered (see ROUND FIVE STATUS)

Nadir, 24 October 2026. Branch glowup-2026-10-24, worktree /Users/asiffarid/Documents/apps/flowstateimpact-site-glowup only.
Nothing committed. No pictures generated. No texture anywhere.

## ROUND FIVE STATUS (25 Oct, Nadir): WORK AND WHAT-WE-DO ROLLED ONTO glow.css, RENDERED ONCE, THREE FIXES WRITTEN AFTER THE LOOK AND NOT RE-RENDERED.

Status: stopped at the wind-down line. Both pages are rebuilt and were rendered at 1440 and 390 once; the what-we-do shots were looked at in full, the work shots at 1440 only (top, both rows, the shelf, the close). Three fixes were then written to disk and NOT re-rendered. Nothing committed. No word changed (see the text check). Home A untouched: glow-a.css and index-a.html were not edited by this helper (both changed on disk from another chat during the run; not read).

WHAT CHANGED
- glow.css gained the inner-page layer, appended before the motion block: .inner (the current nav word in orange, the bar links no longer invert over pictures), .duo .h / .pair .h / .tl .h (the text heading role, 3.5vw 500 sentence case, Anwar 3), .wrow (the work rows: street behind at 54vw, the object in front at 40 percent width hung over the lower inner corner by 24 percent of its width and 15 percent of its height, the name beside in the C paragraph system, mirrored on .flip), .duo (text one side, picture the other, each picture hung 2.2 margins past the next hairline, the following row's text padded to clear it; .tall 26x32vw, .flip .tall 22x30vw, .wide 44x27vw, .last 50x28vw running off the left edge), .pair (consultancy and the AI system side by side, one 14vw square of taant-hands at the far right of the AI block: the loom, every department one thread and the cloth is yours), .wwd .close .st at 10.4vw so TAKE ONLY / WHAT YOU NEED. sits in two lines. Phone rules for each.
- glow.js is NEW: the index-a.html script generalised for inner pages (bar away/back, play controls, the six button lines on one clock, pictures rising once, blocks settling 18px, the hero line a tenth slower, the film holding while the page lifts off it, the small picture in front moving faster than the street behind). index-a.html still carries its own inline copy; linking it to glow.js is the chat's call.
- work.html rebuilt: film hero (lane, poster, NOT autoplaying: the line is an instruction and the orange control is the thing you press), .wrow Heritage (camp-6-lane big, coat-walk small), .wrow.flip Chhaya (billboard big, objects small), the team line as .block.tl, the three doors as A's .strip (eleven-tower / houses-02 / eye-poster, labels only), close, footer from index-a with Next: What we do, mark3d live.
- what-we-do.html rebuilt: .page-hero (Your whole business, read. at 11vw, the two slot lines and The audit bottom right), four .duo rows (Branding heritage-box-lid, Images sim-starter, Website chhaya-web-hero, Videos heritage-film-04, service names as the picture's .lab), .pair, close, footer Next: the audit.
- Dropped from both: site.css, site.js, cloth, .grain, the map iframe, the burger, color-scheme light, target=_blank.

MEASURED (first render, before the three fixes)
- what-we-do 1440: page 4870px; console errors 0; HTTP errors 0; overflow-x 357px, CAUSE FOUND: glow-a.css .ai .pic (home A's AI block rule) matched my .blk.ai figure and pushed it to x 1595; FIXED by renaming the class to .sys (written, not re-rendered; expect 0). Hero h1 40 to 1107 wide, lines at 1187 to 1400. Row 1 picture bottom 1450 crosses the row 2 hairline (1362) by 88px; row 2 text content starts 65px under it. Bar: away at the bottom, back on black after 200px up.
- what-we-do 390: page 4858px; overflow 0; errors 0. The flipped wide picture bleeds LEFT (x 0 to 370) and the plain wide bleeds right; kept, it mirrors.
- work 1440: shots taken and looked at; the numbers (height, overflow, errors) were in the background run's output which had not printed by the wind-down: read /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/e7285497-960d-4985-94fb-47b1d8717cfc/tasks/bg51uwhyp.output. work 390: rendered by that run if it finished; NOT looked at.
- Text check: the before-text of both pages is saved at .../e7285497-960d-4985-94fb-47b1d8717cfc/scratchpad/before/work_html.txt and what_we_do_html.txt (innerText at 1440). Every sentence is carried verbatim in the new markup; two differences are case only, from the old CSS uppercasing (HERITAGE IN MOTION / CHHAYA now sentence case in the C paragraph; WEBSITES / PHOTOGRAPHY / FILMS still caps via .lab). The after-text diff was not run.

SEEN IN THE LOOK
- work hero: the woman mid-lane, PRESS PLAY. bottom left, the one orange control bottom right; the orange nav word Work sits over the sky and reads dim (consider .inner .top .links .hot with no blend, it has none now; it is the film's brightness).
- work Heritage row: the coat hangs over the lower right corner into the text column, real depth, the name heavy and the line light. Chhaya row mirrors it with the cards in front of the billboard. Shelf: three sizes, the eye film still running off the right. Close: YOURS NEXT? and the plate with the flame.
- what-we-do: hero one thing lit; the four rows alternate and the pictures cross the hairlines; the pair was text only (the picture was off screen, fixed above); the close ran to three lines (fixed above to two).

RENDERS: glowup-renders/r5/ (work-1440-*.png, wwd-1440-*.png, wwd-390-*.png, wwd-*-full.png; work-390-* and work-*-full if the background run finished).

NEXT THREE STEPS
1. Re-render both pages with the chat's scratchpad shoot2.js (node shoot2.js <ud> glowup-renders/r5 what-we-do.html wwd ".duo,.duo.flip,.pair,.close" "" and the same for work.html) and confirm overflow 0 on what-we-do 1440, the taant-hands square at the far right of the AI block, the close in two lines, the last wide picture off the left edge.
2. Look at work-390-* and both -full renders; check the phone work rows (the small picture hangs 18 percent below the big, the paragraph is padded 30vw to clear it).
3. Run the after-text diff (scratchpad text.js against the before files), then hand both pages to Anwar with the six renders.

## STATUS (read this first)

Status: round two stopped at the wind-down line with A and C built, B not built.

FINISHED (round two, 24 Oct, evening)
- index-a.html + glow-a.css: THE LINE, whole page, rendered four ways and looked at. Fixes made after looking: hero size 13vw to 12.6vw (the measured width of "WILL NOT DARE" is 7.37em with tracking, so 13vw overran a 1440 margin); on phones the tagline breaks to five lines at 17vw so DARE stands alone and is cut by the fold (at 11.5vw it was 45px and the sheet was two thirds empty); WORK moved to the lower half of the lane screen so the woman's face is clear; BRAND moved to the top 3 percent of the Chhaya screen so it clears the billboard's own Bangla line; every vh height tied to the one-screen token --sh.
- index-c.html + glow-c.css: THE SENTENCE, whole page, rendered four ways and looked at once. After the look, two fixes were written to glow-c.css but NOT yet re-rendered: the two work pictures were running full width (the <a> wrappers were inline, now display:block, so 48vw applies and HERITAGE and CHHAYA can cross their edges), and the People row cropped the woman's face out (object-position added to rows one and two). The final render call for C is in the chat's hands: run the render script (below) for c and look at c-1440-full.png around y 1200 to 3400 and c-390-full.png around y 1000 to 2400.
- glow.css additions: the who-this-is block (.who), the section padding (.sec, .rule), the .ph phone-only line break, the --sh token, and the orange logo mark taken out of the difference blend (only the links and the ask invert over pictures now).
- Render tooling (scratch, not in the worktree): headless Chrome will not open a window under 500px wide, so the first 390 shots were a 500 viewport cropped to 390 and were thrown away; phones now render through a 390px iframe in a 500px window and are cropped to it. Full pages pin --sh to the first-screen height through ?full=900 (or 844) and force lazy images eager in that mode only. The script and the pure-Python PNG reader live in the helper scratchpad: /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/38f9abc2-201d-4159-a26f-f0ade5f1e64e/scratchpad/render.sh and png.py (copy them beside the worktree before the scratchpad is cleared).

NOT FINISHED
- index-b.html + glow-b.css: NOT WRITTEN. The spec below stands, with one measured correction: at 9vw the line "WILL NOT DARE" is 958px wide at 1440, so with the film at 68vw (edge 979px) it never crosses the edge; set the film at 60vw (edge 864px) and accept that DARE straddles the edge, half on the film and half on black, which is the sharper version of move 9 anyway.
- Renders for B: none. MEASURED for B: none.
- The next three steps, in order: (1) re-render C and look at the two regions named above; (2) write B from its spec with the 60vw correction, using the head snippet and the shared markup of index-a.html (top bar, who block, footer, play control script) so the three pages match; (3) render B, look, measure, fill its MEASURED lines.

## ROUND FOUR (25 Oct, P140 helper): HOME A LOWER HALF, CODE WRITTEN, NOT RENDERED. INNER PAGES NOT ROLLED.

Status: stopped at the wind-down line with the four lower-half fixes WRITTEN TO DISK AND NOT YET RENDERED OR LOOKED AT. work.html and what-we-do.html are UNTOUCHED (still site.css, cloth, map footer). Nothing committed.

WRITTEN (glow.css, glow-a.css, index-a.html)
- 1a + 1b, the empty right halves and the same flat black: each reading block now carries one studio picture on its right half, three shapes in three positions, with the block classes .audit / .ai / .who added in index-a.html. Audit: work/heritage-coat-walk.jpg, 26vw x 34vw, far right, in front (z 2): the coat from behind with the eye on its lining, because the audit reads the part of you that you cannot see yourself. AI system: media/worlds/eleven-tower.webp, from 58vw running off the right edge, 26vw tall, pulled up 1 margin so the coat picture overlaps its top corner (one picture in front of another): one building, every window lit, every department one memory. Who: media/worlds/borsha-stall.webp, 20vw square, set back 18vw from the edge: a tea stall open in the rain, the people who want to grow. Phones: the pictures sit under each heading in flow at 72 percent right-set (4:5), full width bleeding right (16:10), and 56 percent left (square). Motion: the pictures rise from their bottom edge with the shelf batch (reveal 5) and drift 5 percent inside their frames on scrub (new 6b). Pictures are in <figure class="pic"> directly after each h2.
- 1c, the loose phone rule: on phones the service row rule is one unbroken hairline (the 24px cut is a desktop two-column device).
- 1d, the see-through bar: glow.css .top gains .away (slides up while scrolling down) and .back (returns on black ground, blend off, when scrolling up); under 120px of scroll it is see-through again, one sheet with the first screen; reduced motion drops the transition only. The scroll logic is in the index-a.html script (barState), skipped in ?full= still renders. Not a solid bar at the top of the page; black only when it comes back mid-page.
- Extra, seen in the look: the phone shelf's WEBSITES tile showed only black because the centred crop lost the gold ring; .strip .s3 img now object-position 18 percent on phones.
- The shared layer for the roll, ported into glow.css ahead of the roll: .para/.n (from glow-c.css), .page-hero (type-only first screen for inner pages, line whole, never cropped, lines + .go at the bottom right on desktop), .film-hero (a film screen with the page's line bottom left). NOT yet written into glow-a.css (the call was refused at the wind-down line): .wrow (work page: two pictures one in front of the other, 54vw, small one 40 percent overlapping the lower outer corner, heavy-name sentence beside), .duo (what-we-do: text one side, picture the other, .tall 26x32vw and .wide 44x27vw crossing the hairline into the next row by 4.4 margins), .pair (consultancy + AI system side by side).

NOT DONE, and exactly where it stopped
- No render of the fixes. Run the render for a (glowup-renders/tooling/render.sh with the SP paths fixed) and LOOK at a-1440-full.png from y 4400 to 6400 (the three blocks) and a-390-full.png around the same region; check the coat picture does not touch the audit paragraph (paragraph max 44ch, about 450px; coat starts at 1440 - 40 - 374 = 1026px) and that the tower's top-left corner sits under the coat.
- The top bar proof needs a SCROLLED still: a scratch iframe page that scrolls the page to the bottom, and one that scrolls down then up 200px, at 390 and 1440; the hook that refused the glow-a.css call means no probe was written. Expected: at the bottom after scrolling down the bar is off screen; after scrolling up it sits on black.
- Console errors and overflow at 1440/390: not checked.
- Colour shares after the pictures: not measured (expect pictures up from 11.4 toward 16 percent at 1440; orange unchanged at about 2.8).
- work.html and what-we-do.html: not started. Plan held: work = film hero (lane, h1 Press play. bottom left, play control, slot line) then two .wrow rows (Heritage: heritage-camp-6-lane big + heritage-coat-walk small; Chhaya flipped: chhaya-billboard big + chhaya-objects small), the line "Your business gets the team that made all of this." as a .block heading, the three doors as A's .strip (eleven-tower / houses-02 / eye-poster, labels only), close "Yours next?" .st 12vw + btn-row + the empty p.under kept; footer from index-a with "Next: What we do". what-we-do = .page-hero with "Your whole business, read." whole at 11vw, the two slot lines + .go "The audit" bottom right; four .duo rows alternating (Branding heritage-box-lid tall, Images chhaya-photo-pack-1-sim-starter tall, Website chhaya-web-hero wide, Videos heritage-film-04 wide, each row's existing h2 and slot and link kept word for word, the service name as the picture's .lab); Consultancy + AI system as a .pair of .blocks; close "Take only what you need."; footer "Next: the audit". Both pages: glow.css + glow-a.css + mark3d.css, the index-a.html script generalised (bar, play, swaps, reveals; .screen .word drift has nothing to grab), current nav word in .hot, no orange on "play." or "read." (accent only on the nav word, the play control and the one .btn). Open question for the chat: ten inline copies of the script will drift; a shared glow.js was outside this helper's allowed files.

## ROUND THREE (24 Oct, night): A FIXED, MOTION ON, RENDERED. INNER PAGES NOT ROLLED.

Status: stopped at the inner-page roll. The helper hit its token wind-down right after rendering A; the ten inner pages (work, what-we-do, about, the-ai-system, the-audit, films, photography, websites, chhaya, heritage-in-motion) are UNTOUCHED. A fresh helper starts at step 7 of the brief with the shared layer below.

FINISHED ON A (index-a.html, glow-a.css, glow.css)
- Anwar 1: BRAND at 10vw, left edge 34vw, top 8 percent of the screen (top is mine: 3 percent put it under the fixed nav). At that size the whole word shows; nothing runs off, which is what his numbers give.
- Anwar 2: .heritage has margin-top of -0.07 screen, stacked under the hero (hero z 3, screen z 1), so DARE lands about 120px into the street.
- Anwar 3: Read first. / An AI system you keep. / For people who want to grow. are General Sans 500 at 3.5vw, sentence case, all left (the AI block's right alignment is gone). Stencil stays on the tagline, WORK, BRAND, the six service words, GROWING? GOOD.
- Anwar 4: on phones the hero is a bottom-anchored column: who-block, 24px, then the tagline; the void sits under the nav.
- Anwar 5: team is one line, names separated by dots, 2.2vw; on phones 18px and it wraps (2.2vw is 8px there).
- Anwar 6: the page measures 7,858px at 1440 with the last lit row at 7,819: no tail. Nothing to zero on body.
- Twin a: the lane film is anchored to its right edge (object-position 100 percent): the source is 1920x804 so 700px of width is cropped at 1440, and anchoring right puts the woman in the left third. WORK stays 30vw and never touches her or the bag. Phones keep the portrait film centred.
- Twin b: billboard object-position 20 percent 40 percent, SIM at 22vw, BRAND up top: clear of the Bangla line.
- Twin c: the orange recurrence mid-page is the FILMS tile on the shelf, now the eye film (eye.mp4, poster, preload none) with its own play control: the control is one of the three allowed orange things. Accent rows measured 27 to 7118, 1,242 rows.
- Twin d: the full-page render now reads the bottom of .foot after fonts and an 800ms settle.
- Mount point: the exact div in the footer beside "Next: the work"; .mark3d 26vw square (60vw on phones); mark3d.css in the head, mark3d.js deferred before </body>; both 404 harmlessly today.
- The card's type roles in glow.css: .lab is Medium caps at .0124em; .sm, the who-block and the footer address are Regular at .027em with ligatures off.

MOTION (GSAP + ScrollTrigger, vendor/, no Lenis; all off under reduced motion, which also removes autoplay, the swaps and the snap)
1 hero line yPercent 10 scrub, DARE arrives on the street · 2 lane film settles 1.06 to 1 as the screen arrives (you walk into the lane) · 3 WORK and BRAND drift 6vw against the scroll · 4 six service words flood in through the cut, once, batch stagger .07 · 5 the shelf's three pictures rise from their own bottom edge, once · 6 each reading block's heading, paragraph and link settle 18px, once · 7 captions lift as their picture arrives · soft snap: scroll-snap proximity on the three screens, desktop only · buttons: the two orange buttons carry the site.js letter swaps (shuffle on the audit, settle on the close) on ONE clock that alternates, so no two change in a beat; lines are the site's own six; the top-bar link does not swap (its underline would outgrow the line).

SUBTLE ELEMENTS, one sentence each: the rule between service rows has one 24px gap because a stencil letter is held together by its bridges · the play control grows a soft orange ring on hover because the eye opens when you come close · the lane film settles as you arrive because the studio's pictures are walked into, not looked at · the stencil words arrive through the cut because paint through the gap is the mark.

MEASURED (a2 renders): first screen 1440: black 84.9, white 12.2, orange 1.3, picture 1.7 (the film now shows under DARE). Whole page 1440: black 80.3, white 5.5, orange 2.8, pictures 11.4. Phone first screen: black 85.8, white 8.9, orange .8. Phone whole: black 82.9, white 6.0, orange 1.2, pictures 10.0. Type ratio unchanged (hero untouched): 181px to 11px = 16.5 to 1 at 1440. Texture grep over glow.css, glow-a.css, index-a.html: zero. Stand-ins: one, "portraits to come".

OPEN FAULTS SEEN IN THE LOOK (fix before Anwar): (1) with Anwar 2 as typed the tagline's lower edge sits about 120px into the film, and the woman's head in the poster frame is at film y 53 to 173, so the bottom of WILL NOT crosses the top of her face (she is now at x 340, left third; the right-anchoring cleared WORK but no horizontal position clears the first-row letters, the only gaps are the two 50px word spaces). Options for the next helper: anchor the film about 86 percent so her head sits under the NOT/DARE space, or trim the pull to 0.045 screen so only DARE's cap bottom touches the street and the row clears her face, said to Anwar as the change to his number. (2) Chhaya: object-position 20 percent exposes a sliver of another Bangla word at the billboard's right edge beside the SIM; 30 percent should hide it. Not looked at: the shelf, the blocks, the team line and the footer with the flame fallback on a2-1440-full.png (y 2600 onward) and a2-390-full.png.

RENDERS: glowup-renders/a2-1440.png, a2-1440-reduce.png (reduced motion forced), a2-1440-full.png (7858), a2-390.png, a2-390-full.png (6894). LOOKED AT by the helper: first screens and the lane/DARE and Chhaya regions only (see the return); the shelf, blocks and footer regions were rendered but not looked at before the wind-down. Render tools: the helper scratchpad render.sh, _phone.html, png.py (copy to /Users/asiffarid/web/glowup-render-tools/ before it is cleared).

THE SHARED LAYER FOR THE ROLL (next helper, step 7 of the brief): glow.css linked after fonts; the .top bar and .foot from index-a.html verbatim, the current page's nav word in .hot; .lab/.sm roles; black ground, white type, --accent only on the current nav word, play controls and the one .btn; site.css and lower-r6.css dropped from the page (every cloth/grain/letter fill lives there); the motion script from index-a.html (reveals 4 to 7 generalised to the page's headings); C's heavy-name light-connective paragraph (glow-c.css .para .n .k) on the work page. Order: work, what-we-do, about, the-ai-system, the-audit, films, photography, websites, chhaya, heritage-in-motion. Render each at 1440 and 390 and look before the next.

## THE WRITTEN PERSON

Who FlowStãte Impact is as a person. It speaks in short declaratives and lets the first line earn the second; it never explains its own mechanics. It sits forward, elbows on the table, not back in the chair. It uses space like a stage: one thing lit, everything else dark and quiet, and the lit thing is large. With bad news it says the news first, plainly, then what to do about it ("Leave it alone is an answer"; "We won't sell you what already works"). It is two cities in one body, Dhaka and London, and treats that as range, never as a price.

Root metaphors. THE STENCIL: a letter cut with a blade, paint through the gap; what survives the cut is the mark. That is why the display face is a stencil and why every surface is a solid, never a fill. THE LANE: the Heritage film's woman walking down an old Dhaka street without slowing; the studio's pictures are walked into, not looked at. THE EYE: the red-thread eye Heritage signs with; looking closely is the service (the audit is called reading on every page). THE DARE: standing where other studios stop; the only place on the page allowed to be orange.

Gen Z, for this brand: scale and nerve. One word allowed to fill the screen, a sentence cut by the fold so you have to move, motion that answers the hand. Never slang, stickers, neon, emoji or meme shapes. Luxury, for this brand: black, white, one orange; vast empty ground; type set to the pixel; film grade on every picture; nothing decorative. The thread, for this brand: the orange recurs on exactly the things you must see or touch (DARE, the play control, the one ask button; on inner pages the current nav word) and nowhere else; it is the one loud note, everything else holds still.

## THE THREE IDEAS, ONE SENTENCE EACH

A. THE LINE: the tagline is the entire first screen at poster scale, DARE cut by the fold in orange, and the work then arrives as whole screens of film and photograph with section words running off the right edge.
B. THE WORK FIRST, THE LINE ON IT: the Heritage film owns the first screen and the tagline is set across its right edge onto black, then every piece of work is one full-width row with its own stencil word crossing its picture's edge.
C. THE SENTENCE: the navigation is the headline (five words at 7vw on the left), the tagline stands opposite with DARE cut by the fold, and the whole page below is set paragraphs where names are heavy and connectives light, with photographs as four full-width rows.

My ranking before rendering: A first (the tagline is his Main Idea and A gives it the Söhne treatment; nothing else on the first screen competes with it), C second (the only one that could carry a whole site on type alone, which is the Ballet bar; riskier on phones), B third (the strongest first impression for a stranger who wants to press play, but the film does the work the type should do, and it is the closest to Lafour).

## SHARED RULES FOR ALL THREE (already in glow.css)

- Fonts: Bespoke Stencil 700 only for display (`.st`: line-height .82, tracking -.03em, uppercase). General Sans 400 and 500 only (the 300 Nazar named is not in /fonts; use 400). Small voice 12px (`.sm`), labels 11px uppercase tracking .08em (`.lab`).
- Grounds: black #0B0B0B everywhere on the home page; white #F2F2F0 is reserved for type and for the photograph rows' labels. No cream anywhere.
- Orange: DARE, the play control (`.play`), the one ask button (`.btn`). Nothing else. The orange logo mark in the top bar is the identity and stays at 24px.
- Top bar `.top`: logo (fsi-mark.svg 24px + wordmark.png 76px), links Work / What we do / Audit / AI system / About, and "Ask for the audit" as a 12px underlined link to https://linktr.ee/flowstateimpact. On phones the links become a scrollable 11px row.
- Who this is, on the first screen of every direction, as a 12px block of existing lines: "A strategy and design firm, working from both." / "Dhaka · London" / "We shape the brand. You keep the AI we build."
- Footer `.foot`: "Next: the work" (work.html), wordmark, "Dhaka · London", "Visit" + the Akij Motors address, the five nav links, "Book a call" (https://linktr.ee/flowstateimpact#592953534), "Linktree".
- Every video: muted, playsinline, loop, preload="none" below the fold, poster given. Every image below the fold: loading="lazy" decoding="async", width and height set. Alt text copied from the existing pages where it exists.
- Motion: vendor/gsap.min.js + vendor/ScrollTrigger.min.js (Lenis is NOT in /vendor despite the brief; do not add a dependency). Nothing runs under prefers-reduced-motion. No loader.

## PICTURES AND WHICH SET THEY BELONG TO (looked at)

- media/lane-poster.jpg 1920x804: the woman in black walking the Dhaka lane with the tiger bag (Heritage film, lane.mp4; lane-phone.mp4 for phones with lane-phone-poster.jpg).
- media/eye-poster.jpg 1200x502: hands embroidering the red-thread eye (eye.mp4). The FILMS picture.
- work/heritage-coat-walk.jpg 1288x1600: the black coat from behind, eye on the lining, yellow corridor. Best portrait for Heritage.
- work/heritage-camp-6-lane.jpg 1289x1600: two women, tiger bag, wet lane at night. Second Heritage portrait.
- work/heritage-film-04.jpg 1600x670: wide film still with painted rickshaws. Heritage wide.
- work/heritage-box-lid.jpg 1288x1600 and heritage-box.jpg 451x560: the box, black wool with the embroidered eye.
- work/chhaya-billboard.jpg 1600x827: the Bangla billboard, pink and tan. Chhaya wide.
- work/chhaya-wall.jpg 1595x1600: three posters on a torn wall. Chhaya square.
- work/chhaya-objects.jpg 1600x1236: SIM card, recharge card. chhaya-photo-pack-1-sim-starter.jpg 1288x1600: the SIM pack on the purple table in blind light (the strongest Chhaya photograph). chhaya-web-hero.jpg 1600x1000: the Chhaya site. chhaya-poster.jpg 398x560.
- Worlds (2048x1152 webp, all in media/worlds): sonar-gold (gold ring on black velvet, the strongest), eleven-tower, nouka-river, badabon-channel, borsha-stall, darkroom-casts, gateweave-roofs, haldi-root, taant-hands (2048x1536).
- Photographs, set names as photography.html maps them: houses-* = People (houses-01 a woman with curly hair against grey; houses-02 a smiling woman beside blue glass), interior-* = Weddings (interior-01 a bride looking down), public-* = Streets (public-01 the pink and violet tunnel), travel-* = Products (travel-07 mosaic lamps on a dark wall, 1600x2400). Use -800 for srcset small, -1600 large.

## DIRECTION A: THE LINE (index-a.html + glow-a.css)

First screen (height 100svh, black, nothing but type).
- Top bar. Top right under it: the who-this-is block, 12px, right-aligned, max 26ch.
- h1 `.st`, flush left at var(--m), four lines: WE MAKE / THE WORK / other studios / WILL NOT DARE. Stencil size 13vw at 1440 (about 187px), 11.5vw under 760px. The third line "other studios" in General Sans 400, lowercase, at .62em of the stencil size (about 55 percent of its cap height), same left edge. DARE in `.hot`.
- The crop: the h1 is absolutely positioned with bottom: calc(-0.38 * 13vw), so about 45 percent of DARE's cap height sits below the fold; the next section carries padding-top: calc(.5 * 13vw) so the scroll completes the word. Never overflow:hidden on the hero (that would cut DARE forever instead of letting the scroll finish it).
- Ratio: 187px against 11px labels = 17 to 1 at 1440; at 390, 45px against 11px = 4 to 1 on phones (the 12 to 1 rule is for the desktop first screen; say so in the return).
- Motion: GSAP ScrollTrigger, scrub, moves the h1 up 10 percent slower than the page so DARE "arrives"; nothing else moves on screen one.

Screen two: WORK, the Heritage film (height 100svh, `.crop`).
- lane.mp4 as `.bed` with lane-poster.jpg, lane-phone.mp4 under 760px. No overlay, no tint.
- The word WORK in `.st` at 30vw, white, starting at left 52vw and running off the right edge (overflow hidden on the section), top at 10vh. GSAP scrub drifts it 6vw left as the section passes.
- `.cap` bottom left: label HERITAGE IN MOTION, line "Dhaka dressing Dhaka." Links to heritage-in-motion.html. `.play` bottom right toggles the video.
Screen three: Chhaya (height 100svh): chhaya-billboard.jpg as the bed; the word CHHAYA is NOT cropped (it is a client's name); instead the section word is PICTURES? No: keep one cropped word per screen; here the cropped word is BRAND at 30vw running off the right. `.cap` bottom left: CHHAYA / "A phone network, said small." links chhaya.html. chhaya-photo-pack-1-sim-starter.jpg sits bottom right at 24vw wide overlapping the billboard's lower edge by a third (one picture over another: real depth, a light direction from the blind light in the photograph).
Screen four: the rest of the work as a Lafour strip, NOT a grid: three pictures of different widths and heights in one row with 11px labels placed on the pictures: FILMS (eye-poster.jpg, 46vw wide, 60vh tall, films.html), PICTURES (houses-02-1600.webp, 22vw wide, 70vh, photography.html), WEBSITES (sonar-gold.webp, 28vw wide, 50vh, websites.html). Each picture's `.cap` is at its own bottom left; the row's heights differ on purpose.
What we do: label WHAT WE DO; the six service words in `.st` at 7vw stacked flush left (Branding, Images, Website, Videos, Consultancy, AI system) with each word's existing line at 13px set at the far right edge of the row (the Three Zero Five far-right column): "Known before you speak." "Pictures people save." "It answers for you." "Watched, then visited." "What you sell, read too." (with "with Akij Dynamics" as a 11px line under Consultancy) "You stop repeating yourself." Each row is a link to what-we-do.html. Hairline between rows. Intro line above at 16px: "Our team reads it all and can say no."
The audit: `.st` 9vw "Read first." then the paragraph at 16px max 44ch: "You get, in writing, which parts of your business carry you, which you carry, and where to start. Leave it all alone is an answer the audit gives." then `.btn-row`: the `.btn` "Ask for the audit" and the note "Free for a limited time*" with "*T&Cs apply".
The AI system: `.st` 9vw "An AI system you keep." + "Every department, one memory." + `.go` "See inside" to the-ai-system.html. Set right-aligned, so the page zigzags.
Who we help and why: `.st` 7vw "For people who want to grow." + 16px "Businesses who care, and want more customers to see it." + "We won't sell you what already works." + `.go` "See the work" to about.html.
Team: label TEAM; the four names in General Sans 500 at 4.5vw, each name on its own line, flush left: Asif Farid, Sarowar Jahan, Nafia Islam Faria, Muaz Rakin. No portraits, no roles. A 11px `.dim` line reads "portraits to come" wrapped in `<span data-standin>`.
Close: `.st` 12vw "Growing? Good." whole, never cropped; `.btn-row` with "Ask for the audit" and "Book a call" as `.go`. Footer.
glow-a.css carries: the hero positioning, the 30vw crop words, the strip's three sizes, the service rows, the zigzag alignment, and `html{scroll-snap-type:y proximity}` with `scroll-snap-align:start` on the three 100svh screens only (his open ask for snap; proximity so the long sections never fight).

## DIRECTION B: THE WORK FIRST, THE LINE ON IT (index-b.html + glow-b.css)

First screen (100svh).
- The film fills the left 68vw and the full height (lane.mp4, lane-poster.jpg; lane-phone on phones, where the film becomes the top 62svh full width). The right 32vw is black.
- Top right on the black: the who-this-is block (12px). Under it, the index as a vertical list (11px labels with 40px-tall thumbnails, hairlines between): HERITAGE IN MOTION (heritage-coat-walk), CHHAYA (chhaya-billboard), FILMS (eye-poster), PHOTOGRAPHY (houses-02), WEBSITES (sonar-gold); each links to its page. On phones this list becomes a horizontal 60px strip under the film.
- The tagline sits bottom left over the film at 9vw stencil, three lines: WE MAKE THE WORK / other studios (sans 400 lowercase .62em) / WILL NOT DARE. At 1440 "WE MAKE THE WORK" is about 1250px wide and "WILL NOT DARE" about 1010px, so both cross the film's right edge at 980px onto the black: the letters are white on both sides, the picture's edge passes through them. DARE lands on the black in orange. Ratio 130px to 11px, about 12 to 1.
- `.play` bottom right of the film. Motion: on load the three lines rise into view in 0.7s, staggered 0.1s (clip-path from the baseline), total under one second; no loader.
Then the work as rows, each row a full-width band with the picture on one side at its own width, the stencil word starting 1.5 characters inside the picture and finishing on the black (move 9), the 11px caption on the picture:
1. HERITAGE: heritage-coat-walk at 42vw left, 90vh tall; word HERITAGE at 11vw crossing its right edge; right column 16px: "A fashion house we built whole: the film, the mark, the box." "An eye in red thread. It signs everything the house makes." `.go` "See Heritage" to heritage-in-motion.html. heritage-box-lid at 18vw sits lower right of the text, overlapping the band's bottom edge.
2. CHHAYA: chhaya-billboard at 60vw right, 70vh; word CHHAYA at 11vw crossing its LEFT edge; left column: "A phone network with one thing to say: the signal holds." "Chhaya means shade: a cool room in a hot city." `.go` "See Chhaya".
3. FILMS: eye.mp4 (eye-poster) at 50vw left, 56vh, with `.play`; word FILMS crossing; right column: "Films that show the place and the hands in it." and the first eight film titles from films.json as a ruled 13px list (kind dim, title 500): Highlight Reel 2025, Berlin Super Return, Fluffy Fluffy, Oxford Union, Vincent Club, Chocolatarium, Resolve UK, Jashans Restaurant. `.go` "Watch it" to films.html.
4. PICTURES: public-01 (tunnel) at 64vw right, 60vh, with interior-01 (bride) at 20vw overlapping its lower left corner; word PICTURES crossing; left: "Campaign pictures and pack shots, under the same light." `.go` "See the work" to photography.html.
5. WEBSITES: sonar-gold at 56vw left, 56vh; word WEBSITES crossing; right: "A site that answers before they ask. You're reading one now." and the nine worlds with pictures as a 13px ruled list (name 500, kind dim). `.go` "See the work" to websites.html.
What we do: the six services as a ruled list (Tiger's plain table as Nazar allowed): name General Sans 500 at 28px left, line 13px right, hairlines; intro "Your whole business, read." in `.st` 8vw; "Then only what's needed."
Audit + AI system: two blocks side by side at 1440, stacked on phones: "Read first." + the audit paragraph + `.btn` "Ask for the audit" + the free note; "Your business remembers." + "Built from the audit, so it already knows how you run." + "It stays with you." + `.go` "See inside".
Who we help: "For people who want to grow." + "Businesses who care, and want more customers to see it." Team as in A. Close: "Yours next?" at 12vw + `.btn-row`. Footer with "Next: the work".
Motion below the fold: each row's picture reveals with a clip from its outer edge on enter (GSAP, once); the crossing words scrub 3vw. glow-b.css carries the split hero, the index list, the rows and the crossing-word offsets.

## DIRECTION C: THE SENTENCE (index-c.html + glow-c.css)

First screen (100svh, two columns 45vw / 55vw, black).
- The top bar carries only the logo and "Ask for the audit" here (the big nav IS the nav).
- Left column: Work / What we do / Audit / AI system / About in General Sans 500 at 7vw, line-height .9, flush left, each a link; on hover the word turns orange and the others go to `.dim`. Under them at 12px: the who-this-is block.
- Right column: the tagline in `.st` at 9.5vw, five lines: WE MAKE / THE WORK / other studios (sans lowercase .62em) / WILL NOT / DARE, DARE orange and cut by the fold exactly as in A (bottom: calc(-0.38 * 9.5vw), next section pads). Ratio 137px to 11px = 12.4 to 1.
- Phones: the columns stack; the nav words at 13vw, the tagline under at 11.5vw with DARE still cut by the fold.
Then the page as paragraphs, each with a 11px label hanging in the left margin, each block max 90vw, left-aligned (never justified: Nazar's rivers):
1. WHAT WE DO, 3vw General Sans: "Branding Known before you speak. Images Pictures people save. Website It answers for you. Videos Watched, then visited. Consultancy, with Akij Dynamics What you sell, read too. AI system You stop repeating yourself." Names 500 white; lines 400 at `.dim`. Intro line "Our team reads it all and can say no." at 16px.
2. WORK: two large pictures in flow with the display word crossing the picture edge: heritage-camp-6-lane at 48vw left, word HERITAGE starting inside it; caption "Dhaka dressing Dhaka."; then chhaya-wall at 48vw right, word CHHAYA crossing its left edge; caption "Your biggest claim, said small." Between them one 3vw sentence: "Brands we built, mark to film." `.go` "See both" to work.html.
3. WEBSITES, 3vw paragraph of the nine worlds that have pictures: "Borsha Tea house · Dhaka. Nouka Electric ferries · Buriganga. Dark Room Gallery · Shoreditch. Badabon Forest lodge · Sundarbans. Eleven Residences · Gulshan Lake. Taant Jamdani weaving · Rupganj. Sonar Goldsmith · Hatton Garden. Haldi Skincare · London. Gate Weave Film house · Dhaka and London." Names 500, kinds dim. Hover on a name swaps the block's background to that world's webp (a `<img>` per world stacked under the paragraph, opacity toggled; the paragraph stays readable because the names are white and the picture is dimmed to 55 percent). Each name links to its world url. `.go` "See the work" to websites.html.
4. FILMS, 2.2vw paragraph of all 26 titles from films.json, title 500, kind dim, in the json order. `.go` "Watch it".
5. PICTURES: four full-width rows of differing heights (People 70vh houses-01; Weddings 60vh interior-01; Streets 80vh public-01; Products 64vh travel-07), object-fit cover, the set name as `.lab` on the picture at bottom left, each row linking photography.html. GSAP scrub moves each picture 8 percent inside its frame.
6. AUDIT and AI SYSTEM as one 3vw paragraph: "Read first. You get, in writing, which parts of your business carry you, which you carry, and where to start. Leave it all alone is an answer the audit gives. An AI system you keep. Every department, one memory." The two headings 500, the rest dim. Then `.btn-row` with "Ask for the audit".
7. WHO: "For people who want to grow. Businesses who care, and want more customers to see it. We won't sell you what already works."
8. TEAM as a paragraph: the four names 500 at 3vw on one line, nothing else, plus the standin note.
Close: "Growing? Good." in `.st` 12vw + `.btn-row`. Footer.
glow-c.css carries the two-column first screen, the paragraph system (`.para` with `.n` and `.k`), the world-swap layering, and the four photo rows.

## STAND-INS (every one wrapped in `<span data-standin>`)

- "portraits to come" under the team names, in all three directions. Nothing else: every other word on the three pages is the tagline or an existing line from index.html, what-we-do.html, about.html, work.html, the-audit.html, the-ai-system.html, heritage-in-motion.html, chhaya.html, websites.html, films.html, photography.html, films.json or worlds.json. Section labels used freely: WORK, FILMS, PICTURES, AUDIT, TEAM, WEBSITES, WHAT WE DO, WHO.

## AVOIDED PATTERNS AND WHAT STANDS IN THEIR PLACE

- Cream ground: black #0B0B0B only; white is type.
- Italic accent words: one orange word (DARE) in the same upright face.
- 01/02/03 numbered labels: 11px uppercase words at the far edge.
- Monospace: General Sans 400 at 12px for every small line.
- Pill buttons: one square orange block and underlined 12px links.
- Uniform card grid: A's strip of three different sizes, B's rows of different widths, C's paragraphs and four rows of different heights.
- Texture as wallpaper: none; depth is a picture under type, a picture over a picture, the blind light already inside the Chhaya photograph.
- Every line at one size: 17 to 1 (A), 12 to 1 (B), 12.4 to 1 (C) on the first screen; 3vw paragraphs against 11px labels below.
- Award badges: none.
- Loader: none; B's one reveal finishes under one second.
- Centred one-line hero: flush-left stencil, cut by the fold (A, C) or crossing a film edge (B).
- Live-data gimmicks: none.
- A first screen that never says who this is: the 12px who-this-is block on all three.
- A clever device that hides what the firm does: the tagline plus the firm's own lines, in its own face, over its own work.
- A picture pushed out of frame to dodge type: in A and B the type is set to cross the picture on purpose; nothing is shoved.

## THE SIX WORDS AND THE EIGHT LINES

DIMENSION: pictures sit under and over type (A, B), and over each other (A's SIM pack on the billboard, B's box lid and bride overlapping their bands). DEPTH: the film behind the letters, the blind light in the Chhaya photograph, the gold ring on velvet; the word crossing an edge is a thing in front of another thing. CHARACTER: the person above, elbows on the table, saying the hard thing first. STYLE: one stencil at poster scale, one grotesk at 12px, nothing between, black and white and one orange. SIGNATURE: DARE cut by the fold in orange (A, C) and the tagline crossing the film's edge (B). UNIQUENESS: swap in another studio's name under "We make the work other studios will not dare" over the Dhaka lane and the sentence stops being true; the lane, the eye and the stencil are only ours.
1 Evaluate first: the before was judged against the firm now (one size, two textures, a sidebar; the tiger photograph the best thing on it) and every move answers it. 2 It says what they are: the 12px block on screen one, the six services on screen two or three. 3 Something made is on it: the studio's own film and photographs at full width, no textures, no generated pictures (by his order). 4 The ten percent is the thread: orange on DARE, the play control and the ask, following the reader from the first screen to the last. 5 Figures of speech not literal: no drawn thread, no stickers, no neon; "thread" is recurrence, "Gen Z" is scale and nerve. 6 Premium with Gen Z nerve: black ground, pixel-set type, one word allowed to be too big. 7 Memorable, bold, very well done: the test is the first screen of A; if a stranger cannot say the next day "the orange word cut in half", it failed. 8 Options are different: three structures (type-only first screen then film screens; film first with rows; nav-as-headline with paragraphs), not one layout in three sizes.

## MEASURED (off the renders, 24 Oct evening; pure-Python PNG read, every fourth row, every second pixel; black = all channels under 70, white = all over 190, accent = the orange band, picture = everything else, which on a type-only screen is the anti-aliased letter edges)

Renders, all in /Users/asiffarid/Documents/apps/flowstateimpact-site-glowup/glowup-renders/: a-1440.png, a-1440-full.png (1440x8182), a-390.png, a-390-full.png (390x6942), c-1440.png, c-1440-full.png (1440x11034), c-390.png, c-390-full.png (390x7404). No B renders.

Colour shares, percent of painted area:
- A first screen 1440: black 86.1, white 12.0, orange 1.3, other 0.7. A first screen 390: black 89.6, white 8.1, orange 0.7.
- A whole page 1440: black 80.3, white 6.8, orange 2.2, pictures 10.7. A whole page 390: black 72.0, white 7.3, orange 4.3, pictures 16.4.
- C first screen 1440: black 86.8, white 11.6, orange 0.7, other 0.9. C first screen 390: black 86.2, white 10.8, orange 0.6.
- C whole page 1440: black 67.8, white 6.6, orange 1.0, pictures 24.6. C whole page 390: black 79.7, white 6.4, orange 0.8, pictures 13.0.
- Reading: the orange stays near one percent everywhere and never passes 4.3 (A on a phone, where DARE is proportionally bigger and the two square buttons are closer together); the ground is black at 68 to 90; white is type only. Against the 60/30/10 rule the white share is under 30 because the second ground is carried by the pictures (10 to 25 percent) and the white letters together; the judge should read the pictures as the 30, as the brief's palette note allows (pictures graded into the roles).

Type ratios on the first screen, from the rendered sizes (the font-size of the stencil line against the 11px labels of the top bar and the 12px who-this-is block):
- A at 1440: stencil 12.6vw = 181px (cap height 127px) against 11px = 16.5 to 1 by font size, 11.5 to 1 by cap height against the 11px line. Passes 12 to 1 by font size.
- A at 390, honestly: 17vw = 66px against 11px = 6.0 to 1. The 12 to 1 rule is met on the desktop first screen only; a phone cannot hold a 132px stencil line and a 350px measure at once. At the first spec size (11.5vw) it was 4.1 to 1 and the sheet was two thirds empty, which is why the phone tagline now breaks to five lines.
- C at 1440: stencil 9.5vw = 137px against 11px = 12.4 to 1; the nav words are 7vw = 101px. C at 390: 16vw = 62px against 11px = 5.7 to 1.
- B: not measured, not built.

DARE cut by the fold, checked on the renders: on a-1440 the orange band of DARE begins at row 830 of 900 (about 55 percent of the 127px cap showing, 45 percent below the fold); on c-1440 it begins at row 843 (about 45 percent showing); on both phones the top of DARE sits in the last 30 rows. Scrolling completes the word in A and C: the next section does not hide it (no overflow clipping on the hero), and in A the lower half of DARE lands over the top of the lane film, orange on the dark street, which is the type-across-the-image-edge move.

Texture grep (cloth, textures/, feTurbulence, background-clip) over glow.css, glow-a.css, glow-c.css, index-a.html, index-c.html: zero hits after the header comment in glow.css was reworded (it had said "no cloth").

Stand-ins: one per page, "portraits to come", wrapped in <span data-standin>, confirmed by grep (one hit in each of index-a.html and index-c.html). The tagline is verbatim on both first screens, confirmed by grep on the h1 markup.

My ranking after looking: A first, then C, then B unbuilt. A because the first screen is one sentence at poster scale and nothing competes with it, and the scroll into the lane film with DARE crossing onto it is the single moment a stranger would describe the next day. C second because the nav-as-headline first screen is the most unusual structure of the three and the paragraph pages read as one voice, but the body is longer (11,000px at 1440) and the paragraph of twenty-six film titles is the one place that reads as a list wearing a paragraph's clothes; a shorter cut of titles would help. The Chhaya-wall picture in C should be looked at after the pending re-render before Anwar judges.

---
NOTE FROM P127 (22:40): Nadir round two returned: A and C built, rendered, measured; B not built; the post-fix look at C's work section is still owed (c-1440-full.png y 1200 to 3400, c-390-full.png y 1000 to 2400). His render tools were copied out of P127's scratch folder to /Users/asiffarid/web/glowup-render-tools/ (render.sh, png.py, _phone.html, fullsnippet.txt); render.sh may still name the old scratch paths, check before running. Twin folder owed a merge and verdict: /Users/asiffarid/.claude/state/bridge/duets/20261024-221824-401-nadir-digital. His full report is saved for P129 as relay entry e0e3051350 (flowrelay message e0e3051350).
