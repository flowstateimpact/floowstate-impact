# D1 Beyond Black, Ava run 3: GROOVES CUT INTO FLAT PLASTER, LAMPS MADE OF THE WORK, FIVE FRAMES UPLOADED. STOPPED AT THE 150,000 TOKEN LINE BEFORE THE FIGMA 0.5x SCREENSHOTS.
28 Oct 2026. File https://www.figma.com/design/8xOXIPGj5M7jUEywhojOWz (page "D1 Beyond Black", 42:2). whoami: Asif Farid's team, Dev seat, pro. No write refused, no sign of a charge.

## Nodes
- LURK 1440: 42:3, plate 42:4 (re-cut, uploaded)
- SEAM 1440: 42:8, plate 42:9 (re-cut, uploaded)
- HIGH 1440: 42:15, plate 42:16 (re-cut, uploaded), button 42:19 solid #E27F22 unchanged
- PHONE 390 hero: 42:23, plate 42:24 (re-cut, uploaded)
- NEW, PHONE 390 UNDER HERO (the audit section, next scroll): frame 45:2 at x 5110. Plate 45:3, nav cloned from my run 2 nodes (45:4 to 45:11, orange underline 45:6), heading cut "READ FIRST." 45:12 (300 x 56.2 at 20,112), picture heritage-coat-walk 45:13 (260 x 323 at 110,196, the lamp), body 45:14 (17/25 bone), button 45:15 (236 x 56 solid orange, ink text), fine print 45:17, 45:18.

## Fill really changed (brief item 3): CONFIRMED BY HASH
Figma's imageHash is the SHA-1 of the uploaded bytes. Every POST returned a hash equal to `shasum` of the local file: lurk 8c1cee00..., seam 6013a523..., high 961dc3d8..., phone 0a6b7be5..., phone2 e7be4f44..., heading bf2596a8..., picture 53491ec3....
Before this run 42:16 carried 1f456542..., which is the SHA-1 of run 2's steeper plate: the run 2 upload DID take; its screenshot only looked unchanged because the change was subtle. New HIGH hash 961dc3d8 differs, so the fill changed. Read back off the nodes after the upload: all seven node hashes equal the local SHA-1s (42:16 now 961dc3d8...).

## The profile (d1_plate.py)
- Default: grooves cut into flat land, land to groove about 4 to 1 (groove = mean spacing / 5, times a per-tooth width 0.72 to 1.3, a worn comb). Section: steep kept top edge, slightly rounded floor, long slanted lower wall, low burr of pushed-up plaster on the slanted lip (the sgraffito rule: slant the knife away from the edge you keep). Depth 0.18 to 0.42 of the groove width, swelling and fading along the wall, and lifting out where the comb lifted (lift threshold per groove 0.45 to 0.85). Land: trowel-flat with plaster tooth at 4, 8 and 28px and slow undulation at 140 and 380px.
- `--rib` flag renders the run 2 matching-flank rib unchanged to plate-<name>-rib.png. Proof: plates/d1/plate-high-rib.png rendered. Run 2 file kept whole as plates/d1/d1_plate_run2.py; run 2 plates kept in plates/d1/run2-plates/.

## Lamps (brief item 2): ZERO OUTSIDE THE FRAME
The off-frame point lamp code is deleted; the render asserts every emitter sits inside the frame. Each source fades to zero by a soft window (380px at 1440, 300 to 320 on the phone; at 350px the window leaves 2 percent).
- LURK: the heading letters (159 cells, bone).
- HIGH: the orange button (main) plus READ FIRST. at 0.5 and the body text block at 0.07.
- SEAM: the film's top 40 percent (28 cells), as run 2.
- PHONE hero: the film-filled letters (run 2 cells).
- PHONE under: the picture (130 cells of its own colour), the button, the heading.

## Measured (plate render log)
- Rest ground: LURK 14.6/13.1/10.7, HIGH 14.6/13.2/10.7, SEAM 15.0/13.5/11.0, PHONE 14.7/13.2/10.7, PHONE UNDER 15.1/13.5/11.0. Red over blue 3.9 to 4.1. Three frames sit 0.4 under target; a one-line per-frame calibration fixes it if Anwar wants exact.
- 99.7th percentile peaks: LURK 44 (max 51), HIGH 70 (max 101.5), SEAM 44 (max 56.7), PHONE 46 (max 50.4), PHONE UNDER 52 (max 59.8).
- Plate pixels at rest (no light at all): LURK 49, HIGH 30, SEAM 72, PHONE 22, PHONE UNDER 34 percent.

## Shares: NOT MEASURED THIS RUN
The by-area and by-layer count on the Figma screenshots was not reached. Honest expectation from the local composites: LURK and SEAM are dark rooms, near 90 percent black by area with the lit plaster a thin band near the letters or film; HIGH carries warm-lit plaster in its lower-left third. Do not take these as numbers.

## My half-size read
- HIGH, FIGMA RENDER AT 0.5x (d1-run3/D1-high-0.5x.png, looked at): PLASTER. A toothed, hand-worked wall with cut channels, warm round the button, a faint lift under READ FIRST.; it no longer reads as slats. Watch: the cut lines are still long and straight across the left half.
- The rest below are from local composites, not yet the Figma render:
- HIGH: plaster. Around the button the wall reads as hand-worked, toothed, with cut channels and a lit lip; the rib version beside it (same lamps) still reads as banded slats. Risk: the cut lines run long and straight, so a hard eye could still say panel seams. The right 55 percent of the frame is dead dark.
- LURK: borderline. Faint, it reads as fine ruled lines around the heading more than combed plaster; too little light to show the tooth.
- SEAM: plaster, faint: the film light climbs two or three cuts.
- PHONE hero and PHONE UNDER: plate alone, plaster near the sources (phone2 at four times exposure clearly shows tooth and cut channels).

## References read (by address)
- https://sto.com/en/portfolio/facade-finishes/render/combed-render.html : the comb's tooth is drawn through wet render; "the shape and size of the grooves will be determined by the teeth on the tool" (triangular, square, rounded).
- https://victorianweb.org/victorian/art/design/sgraffiti/sumner1902.html : slant the knife "away from the edge which you mean to leave as a sharp outline"; the source of the asymmetric groove.
- https://en.wikipedia.org/wiki/Sgraffito : cut through the upper coat to a contrasting ground.
- Search pages only, not read whole: thequoteyard.com.au ("fine striations to bold grooves"), hausbau-forum.de (trowel grooves stayed visible on lime). superellipse.co and poliigon.com refused the fetch (403).
- Recall, not read: the burr of displaced plaster on a combed groove's lip.

## Self-grade
- New groove profile, old behind a flag: YES
- Zero lamps outside the frame: YES (asserted in code)
- HIGH fill confirmed changed: YES by hash (POST response, local SHA-1, old hash differs)
- Phone under-hero screen drawn: YES, 45:2
- Half-size read per frame: HIGH plaster, SEAM plaster (faint), LURK borderline ruled lines, phones plaster near sources. From local composites only.
- Shares by area and layer: NO, not reached

## Not finished, next three steps
1. Screenshot 42:3, 42:8, 42:23, 45:2 (HIGH is done) at 0.5x one call per frame (`await node.screenshot({scale:0.5})`; returning base64 of all five overflows the 48,000 byte limit) and save to glowup-renders/patterns/figma/d1-run3/. Look at each: plaster or blinds.
2. If LURK still reads as ruled lines: raise its peak to about 50 and widen d0 so the tooth shows, or add the sub-line "Every department, one memory." as a faint lamp.
3. Count shares by area and by layer on those screenshots (lit plaster as material or light, not black), then hand to Anwar.
