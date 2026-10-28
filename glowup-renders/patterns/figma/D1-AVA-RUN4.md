# D1 Beyond Black, Ava run 4: COMB PASSES, NOT BOARDS. FIVE PLATES RE-CUT AND UPLOADED. STOPPED AT THE 150,000 TOKEN LINE BEFORE THE FIGMA 0.5x SCREENSHOTS AND THE SHARES COUNT.
28 Oct 2026. File https://www.figma.com/design/8xOXIPGj5M7jUEywhojOWz (page "D1 Beyond Black", 42:2). whoami: Asif Farid's team, Dev seat, pro. No write refused, no sign of a charge. Not committed (the chat commits after the judge).

## Files changed
- glowup-renders/patterns/plates/d1/d1_plate.py
  - New: COMB_D / COMB_P (comb + pass ranges), comb_passes(), pass_y(), build_groove() (run 4), pass_stats(). Run 3 builder kept whole as build_groove_run3(); centres() kept for --rib and --run3.
  - render(): `--run3` renders run 3 geometry to plate-<name>-run3.png; default is run 4 and writes geom-<name>.json (measured geometry).
  - FR["lurk"]: peak 44 to 50, d0 210 to 300 (wider falloff). Light model, colours, emitters otherwise untouched. Note: --run3 lurk now also gets the new LURK light; the true run 3 plates are archived.
- Archive: plates/d1/d1_plate_run3.py (run 3 file whole), plates/d1/run3-plates/ (five run 3 plates).
- New outputs: plates/d1/plate-{high,lurk,seam,phone,phone2}.png, plates/d1/geom-{high,lurk,seam,phone,phone2}.json.
- hero-reveal-board.html: not touched (Nadir's).

## The geometry (how the hand is modelled)
- One worn comb for the whole wall: 7 teeth, spacings 27/24/28/25/29/23px at 1440 (12/10.5/12.5/11/12/11 at 390), each tooth its own width 0.72 to 1.3.
- Sets = one comb's band; between sets 1.6 to 2.2 tooth spacings of untouched land.
- Each pass: arm's reach, tilt up to 0.6 deg, bow 6 to 10px (2.7 to 4.5 at 390), comb held at a slant (8 to 28 deg) so the set-down is a slanted SEAM of piled plaster across the whole set, tooth pits wider (x1.4) and deeper (x1.25) for ~14px, burr x3 at the set-down; lift-out tail over the last 10 to 22 percent, narrowing and shallowing, each tooth ending ragged (+-12px).
- Next pass starts 40 to 120px back over the tail, jogged 4 to 14px (sign pulls back toward the row), and WIPES the old grooves under its body to a 20 percent ghost (from the Kaihoi reference: a later pass overwrites the earlier one with a crisp edge).
- 75 percent of rows drawn left to right, 25 right to left.

## Measured (geom-*.json, visible passes only)
| frame | passes | length px | overlap px | jog px | tilt deg | bow px | gap / tooth | breaks per set |
|---|---|---|---|---|---|---|---|---|
| HIGH 1440 | 17 | 534 to 873 | 41 to 119 | 4.9 to 13.2 | 0 to 0.6 | 6.1 to 9.9 | 1.7 to 2.1 | 2,2,2,3,3 |
| LURK 1440 | 16 | 505 to 899 | 54 to 116 | 4.6 to 13.9 | 0 to 0.5 | 6.1 to 9.9 | 1.9 to 2.2 | 2,2,2,3,2 |
| SEAM 1440 | 14 | 533 to 837 | 46 to 117 | 4.4 to 13.9 | 0.1 to 0.5 | 6.2 to 9.7 | 1.6 to 2.0 | 2,2,1,2,2 |
| PHONE 390 | 22 | 222 to 318 | 25 to 50 | 2.1 to 6.2 | 0 to 0.5 | 2.7 to 4.5 | 1.8 to 2.2 | 1 or 2 each |
| PHONE UNDER 390 | 21 | 231 to 316 | 22 to 50 | 2.0 to 5.9 | 0 to 0.5 | 2.9 to 4.5 | 1.6 to 2.2 | 1 or 2 each |
- Every groove breaks at least once inside the frame: YES, every set in every frame (every_set_breaks true in all five).
- Phone overlap, jog and bow are Anwar's 1440 figures times 0.45 (he gave only the phone pass length); my scaling, his to correct.
- Render log: rest ground HIGH 14.6/13.1/10.6, LURK 14.8/13.3/10.8, SEAM 14.6/13.1/10.7, PHONE 14.7/13.2/10.7, PHONE UNDER 14.5/13.0/10.6. Peaks (99.7th) HIGH 70, LURK 50 (was 44), SEAM 44, PHONE 46, PHONE UNDER 52.

## Figma fills confirmed changed (hash = SHA-1 of the uploaded bytes; POST response equals local shasum)
| node | before (run 3) | after (run 4) |
|---|---|---|
| 42:4 plate LURK | 8c1cee00... | b1e9191ac26f41dd8b4778366461dfd08a763520 |
| 42:9 plate SEAM | 6013a523... | 7a53d19830cb30845942d9da42f7185353038b52 |
| 42:16 plate HIGH | 961dc3d8... | fe2238268fb16874b25e0adb5b70e83209ef199f |
| 42:24 plate PHONE | 0a6b7be5... | 88ba34595328369f7e3a10632a69ab1821e98d67 |
| 45:3 plate PHONE UNDER | e7be4f44... | b261ffbd6217d38a540ba7b3d2715b4a828036d1 |
Frames: LURK 42:3, SEAM 42:8, HIGH 42:15, PHONE 42:23, PHONE UNDER 45:2. Read-back off the nodes after upload: NOT DONE (see below); the POST responses name each node as placedOnNodeId.

## What I looked at, and my honest half-size answer
Looked at (local plate only, not the Figma composite with type): HIGH at half size true exposure and at 3x gain, LURK at half size true exposure, PHONE UNDER at full size 4x gain beside its run 3 plate. Scratch views: /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/2560e570-f127-4aeb-b652-6d080498e454/scratchpad/ava/ (high-half-g1.png, high-half-g3.png, lurk-half-g1.png, phone2-g4.png, phone2-run3-g4.png).
- HIGH: PLASTER, worked by hand. In the orange pool the lines step and restart at slanted seams; bundles of fine grooves, not boards. Residual risk I can name: at 3x gain a hard eye could say "layered shale" or "patched veneer", never shiplap; the set gaps are faint, so the grouping reads less than the breaks.
- LURK: PLASTER. Wider falloff now shows the tooth on the land and one slanted seam right of centre; not yet judged with the heading on top (the ruled-stationery risk lived there).
- PHONE UNDER: PLASTER, clearly combed swaths with seams (run 3 beside it reads as four or five ruled bars).
- SEAM and PHONE hero: not looked at this run.

## References (looked at unless marked)
- Schumacher x David Kaihoi, Hand Combed Plaster (birch), image via https://www.chairish.com/product/29435634/schumacher-x-david-kaihoi-hand-combed-plaster-wallpaper-in-birch : LOOKED. Each pass is a band of fine teeth about 1.5 to 2 band-heights long, gently bowed; a pass starts with a crisp, SLANTED edge where the comb came down; the next pass overlays the previous one's end and wipes it, so lines stop dead at a seam and restart offset. Source of the seam and the wipe.
- alsecco Kreativdatenblatt Kammzug (cover photo), https://alsecco.de/fileadmin/alsecco_de/media/kdb/FLY_ALS_Kreativdatenblatt_Kammzug_LY01_2024.pdf : LOOKED. Dense fine teeth, lines wander together, tooth texture on every land; one pull top to bottom, no break inside the sample.
- Clayworks custom slim corrugated clay plaster, Fulton Avenue, https://static-2026.dezeen.com/uploads/2023/05/clayworks-custom-finishes-fulton-avenue-dezeen-promotion_dezeen_2364_col_0-411x308.jpg (Dezeen, 24 May 2023): LOOKED. Counter-reference: an even, unbroken rake at room scale reads exactly as fluted panelling. Confirms Anwar's diagnosis.
- Kunsthaus Goettingen, Kammzug facade, https://www.heinze.de/architekturobjekt/neubau-des-kunsthauses-im-kunstquartier-goettingen/13124168/ : READ, not looked. A 60cm comb on a guide rail, identical repeat, continuous across the facade: the industrial version is the board look; the hand version is the break.
- Bob Vila, wall texture types: READ (comb texture as fans and arcs; uneven teeth for an organic look).

## Self-grade (once)
- Pass length range measured at 1440 and 390: YES (505 to 899; 222 to 318)
- Every groove breaks at least once: YES
- Overlap and jog measured: YES (41 to 119 / 4.4 to 13.9 at 1440; 22 to 50 / 2.0 to 6.2 at 390)
- Figma fills confirmed changed: YES by POST hash = local SHA-1, all five differ from run 3. Node read-back: NO
- Half-size answer per frame: HIGH plaster, LURK plaster (plate only), PHONE UNDER plaster; SEAM and PHONE not looked at; none yet from the Figma composite with type
- Shares by layer per frame: NO, not reached

## Not finished, next three steps (stopped at the 150,000 token wind-down)
1. Screenshot 42:3, 42:8, 42:15, 42:23, 45:2 at 0.5x into glowup-renders/patterns/figma/d1-run4/ (folder not yet made). Use mcp__figma__get_screenshot and curl the returned link, one per frame; inline base64 overflows. Look at each: plaster or boards, with the type on.
2. Read the five plate fills back (`(await figma.getNodeByIdAsync('42:16')).fills[0].imageHash`) and confirm they equal the after column above.
3. Run `python3 glowup-renders/tooling/shares-by-hue.py glowup-renders/patterns/figma/d1-run4/*.png` and add the shares by layer; then hand to Anwar. If LURK with its heading still reads as ruled lines, the next lever is fewer, wider sets on LURK only.
