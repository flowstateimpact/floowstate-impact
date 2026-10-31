# ANWAR R19: do the R18 conditions hold? (31 Oct 2026, Opus)

VERDICT: PUSH. All seven lines hold. Nothing these fixes introduced would embarrass the studio on the public home tonight.

Looked at: hero frames p20, p30, p42, reduce, 390-mid and both loads; the code lines behind fixes 1 to 3; both tiger join sheets and the phone walk sheet; ten walk frames pulled from media/lane.mp4 and media/lane-phone.mp4 (output 159 to 188), three at full size (166, 170, 174); the reel drizzle sheet.

## The checklist

1. Lip fade: PASS. r18-1440-p42: film runs to the dark edge of the hole on both sides, no pale band. r18-390-mid: the carved slab fills the screen, no arc. Cause fixed at hero-journey.js line 54 (lip fades p .32 to .40), lip returned at hero-cut.js line 105.

2. Wall into shadow: PASS. r18-1440-p30: walls near black either side, comb faint, no staircase; the domes and sky inside the O are the brightest thing on screen. The rim on the O's left edge stays at full, as R18 asked. hero-journey.js lines 52 to 53. Both load frames unchanged: DARE still the only orange, comb still reads.

3. Reduced motion: PASS. r18-1440-reduce: "Play" bottom left, clear of the caption. The code confirms nothing moves unasked: in still mode, start() (hero-journey.js line 100) sets p to 0 once and returns before smooth scrolling, the scroll trigger or the pointer tilt can start. Only full-page renders hide the word (hero-journey.css line 43). One press plays, a second pauses: Nadir's headless test, not seen by me.

4. Smoothness: YES, enough for tonight. A typical frame takes 16.5 to 16.8 milliseconds. Five of six passes stayed at or under 50 ms; the phone run sat at exactly 50. The one 150 ms stall came on a cold first pass, did not return on a second cold run, and has no traced cause. Still owed: one pass in real Chrome on a laptop, Performance panel open. If the stall returns, it sits at p .19, inside the new wall fade that starts at .15; first suspect is the wall image changing opacity inside its masked group (hero-journey.js line 53). Inference, not measured.

5. Tiger v3: PASS. The bag-at-dusk plume is gone: seven shots on both sheets, none at dusk before the walk. From 1208 the walk reads as two animals. At full size (166, 170, 174) the far tiger is soft, warm-lit and walking on its own legs behind the near one's left shoulder; the near tiger is sharp and in shadow. Focus and light keep them apart. No head grows from a chest, no shared body. Joins at 32, 60, 84, 124, 160 and 188 are clean at both sizes. Boat in daylight to tiger at dusk holds, because the bag glows on the sand behind it.

6. Reel phone drizzle: PASS. reel-v5-phone-drizzle, frames 31 to 55: sharp chocolate strands, the dripping tray above, the glove at right; no face or shop at either edge. The shot now earns its place between two faces.

7. PUSH tonight.

## Notes

- Phone tiger, last walk frame (output 187): the lit eye just touches the left edge for about two frames, then the cut lands on the real eye, so it reads as the push in. No fix.
- Not mine, not checked: whether Ilyas has ruled on a label for the tiger film, which R18 flagged as likely generated. This PUSH covers taste only and does not stand in for his word.
