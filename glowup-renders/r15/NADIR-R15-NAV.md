# NADIR R15 NAV: the findable Websites link, the in-page navigator, the UX read

Nadir, digital director (Fable, high), 31 Oct 2026. Chat P14. Written at the wind-down line (164k tokens), so the renders are measured and partly looked at; the looking that is still owed is listed under OPEN. Nothing committed.

## What was built

A. ONE BAR ON ALL ELEVEN PAGES. The home's hairline bar (12px, difference blend, leaves on scroll down, returns on the page's own black on scroll up) now stands on every linked page. Before, eight pages (websites, films, photography, chhaya, heritage-in-motion, the-audit, the-ai-system, about) wore the old 20px menu with the orange pill button; that was the first thing that read basic: two sites in one. The bar's rules moved out of glow.css (lines 44 to 65, gone) into `bar.css`; the bar's scroll hand moved out of glow.js into `bar.js`; both files are loaded by all eleven pages. The three kinds of work stand after Work in the quieter weight (400, .6 opacity) behind a 12px hairline: `Work | Websites Films Pictures   What we do  Audit  AI system  About`. The current page's word is orange with aria-current. One 1px line (`.ind`) rests under the page's own word, walks to the word under the pointer and comes home when the pointer leaves. On phone the five words are the second deck and the three kinds a third, left-aligned; the walking line is off there. Measured on every frame: 0 console errors, document width equals viewport (1440 and 390). The bar's away state measured on every mid shot ("top away"), the back state measured on films after a scroll up ("top back").

B. THE IN-PAGE NAVIGATOR, three variants on websites.html (`?nav=1`, `?nav=2`, default = 3), the same markup on all six work pages (`<nav class="knav">`: 01 Websites, 02 Films, 03 Pictures; on a case page its kind marked `.kin` and a fourth station `Next: Heritage in Motion` / `Next: Chhaya`, reusing the footer's own "Next:" wording).
- V1 THE COUNTER (bottom right): the current kind reads `01 / 03 Websites`, number orange; the other two wait under it in the dim voice and brighten under the pointer. Wolff Olins and Koto's counter doing the work of a menu. Mechanic from Magic UI `dock.tsx` (mouseX distance swelling the nearest item), re-made as the hovered line brightening.
- V2 THE SWITCH (bottom centre): three states in the label voice, an orange hairline walking under the current one; reaching for another kind dims the whole room behind (`html.peek body::after`, .55 black), so the three doors are the lit thing. Basement's register switch. Mechanic from shadcn `tabs.tsx` line variant (the active trigger's after-line, data-state) plus Motion Primitives `animated-background.tsx` (the follower with layoutId that returns on leave).
- V3 THE RAIL (left edge, my pick): a vertical hairline the height of the three stations, words reading up, current first with its number orange; the orange runs down the rail as far as you have read, toward the next kind, so the scroll walks you to the next room. Mechanic from Aceternity tracing-beam (scrollYProgress mapped to the beam's length through a spring), re-made as `--p` set in bar.js and a .35s ease. On phone the rail lies along the bottom edge.
- 21st.dev: the tabs index page was fetched (1.7MB) and not read in depth; it gave no mechanic. Belt clones live in the scratchpad `belt/` folder (motion-primitives, magicui, shadcn, two Aceternity pages).

C. THE UX READ, ranked, what reads basic at 1440 and 390 (eval renders: glowup-renders/r15/nav/eval/):
1. Two header systems and no hand-over between pages (BUILT: one bar).
2. Websites unreachable from the bar (BUILT: the kinds after Work).
3. The sub-page hero is the same beat eight times: orange stencil word, one line, an outlined ghost button `SEE THE WORK`, a `← ALL WORK` back link. The ghost button is the template tell. WAITS: the navigator makes `← All work` redundant on the five work pages; remove it and let the kinds carry it (markup only, no words needed).
4. The polaroid prints with torn-tape name strips on websites, films, photography: scrapbook register, flat drop shadows, every card the same object at the same elevation. WAITS: one object per screen with the caption small and the counter (Nazar move 2), as the home strip already does.
5. The back-to-top arrow bottom left (site.js `.totop`) is a widget; it also shares the left edge with the rail in V3. WAITS: if V3 is chosen, the rail's top station is the way up and the arrow goes.
6. Hover and focus: links underline-in only; nothing on the site answers the pointer with movement that means something. PART BUILT: the walking hairline in the bar and the V2 switch. WAITS: the work cards.
7. The footer map iframe on the site.css pages (a Google map embed) and three footer systems. WAITS.
8. The pagehead keeps 96px of top padding sized for the old menu; the hairline bar is 60px. WAITS: one line in site.css once the bar is accepted.

## Renders (glowup-renders/r15/nav/)
websites-v{1,2,3}-1440.png, -390.png, -1440-mid.png · websites-v3-1440-reduce.png · bar-home-1440.png, bar-home-390.png · bar-chhaya-1440.png, bar-chhaya-390.png · bar-films-1440-back.png (the bar returned on black) · bar-about-1440-mid.png (the bar away) · work-v3-1440.png · nav-log.json with every measure. Shrunk copies for viewing go in small/ (not yet made: the shrink call was refused at the wind-down line).
Failed shots: websites-v2-1440-peek.png, websites-v3-1440-hover.png, bar-home-1440-hover.png rendered but their eval threw (my quoting: the selector's single quotes inside a single-quoted JS string); they show the resting state only. Fix: use double quotes in the selector in job.json and re-run those three.

## Files touched (mine)
bar.css, bar.js (new) · glow.css (the .top block removed; `.inner .top` two lines removed) · glow.js (barState removed) · site.js (one selector: the way-up focus goes to `.top .logo, .menu .logo`) · index.html, work.html, what-we-do.html (links markup + bar.css/bar.js links; index.html lines 25 to 60 untouched) · websites, films, photography, chhaya, heritage-in-motion, the-audit, the-ai-system, about (`.menu` div removed, `<header class="top">` and `.knav` inserted before `.pagehead`). The nine unlinked drafts untouched; site.css `.menu` rules kept for them.

## OPEN
- The PNGs were measured, not all looked at: I looked at the eight eval renders before building; the post-build renders still need eyes (the chat or a fresh helper: shrink with sips -Z 720 and read websites-v1/v2/v3-1440, v3-390, bar-home-1440, bar-chhaya-1440 first). The rail's left edge at 1440 (x about 18px) must be checked against the site.css `.wrap` left padding and the totop arrow.
- Which variant ships: my pick is V3 (the rail), V2 second. Anwar judges.
- Chhaya's kind is set as Websites and Heritage in Motion's as Films (its page's first screen); Asif to confirm.
- On phone the bar is three decks tall (about 104px) until it leaves on scroll; the cost of findability.
- No new sentences were written. No [CHAIN] slots were needed: the kinds reuse Websites, Films, Pictures, Work; the case stations reuse "Next: X".

## Looked at after the build (two frames, shrunk to 720)
- websites-v3-1440.png: the hairline bar reads as one row: Work, a 12px hairline, Websites in orange, Films and Pictures quieter, then the four pages; the walking line rests under Websites. The rail stands at the left edge level with the hero's line, three words reading upward, 01 orange, clear of the stencil headline and of the `← ALL WORK` link. The ask at top right is the plain underlined word here, while on the home it is the orange block from type-a.css (the hero seat's file): the two asks need one look, open for the hero seat or the next wave.
- bar-home-1440.png: the home bar carries the kinds after Work with no current word; the hero (not mine) is untouched.
- Not looked at: websites-v1, v2, the 390 frames, chhaya, films-back, about-mid, work-v3, reduce. Measured only.
