# Prompt lab: the combed-plaster ground (P3, 28 Oct 2026)

## PE0 Intake
- Artifact: one wall-finish photograph used as the hero ground of flowstateimpact.com (desktop 1440, phone 390 crop). Raw material only: graded, grained and lit in code by Nadir's passed light model; never a finished frame.
- Why: four code rounds read as blinds, boards, slate, wood grain and torn card (ANWAR-GATE-R4.md). Anwar: "At half size plaster lives in tooth, crumb and mottled land."
- Budget: his words, "yes, Higgsfield up to 20 credits". Tag website (29.15 left, 2 a job cap). Ran: 6 Seedream 5.0 Flash drafts 3.0 (Z-Image failed twice, no charge), 1 Nano Banana Pro 2K proof 2 (P2 never generated, 2 booked back), 2 Nano Banana Pro 2K finals 4. Real spend 9 credits; hard stop 20.
- Gate: Anwar at half size, one question: "what is this surface?" Plaster or it dies.

## PE1 Direction (inherited, not rebuilt)
- Standing lock: Beyond Black, LOCK-CARD-P199.md decision one (warm black as a material, light only from the work).
- Tabeer, TABEER-MATURE.md line 161: "A thick black worked in broad combed strokes, ridges and valleys, photographed or generated in raking light. The strokes run, at a scale too large to recognise, along the long sweep of the mark's curve."
- Anwar's panel spec, ANWAR-GATE-R4.md section 3: fine 12 to 16 tooth comb, short arcing swaths, no overlay, one low side lamp so every groove throws a shadow.
- NOT list (what killed rounds 1 to 4): level horizontal ledges, full-width grooves, long straight passes, coarse 5 to 7 tooth combs, layered strips, slanted seams, stacked-stone feature walls, wood grain.

## PE2 Prompt system
DNA block (identical in every prompt):
"Straight-on photograph of a real hand-finished wall panel: lime plaster tinted a warm near-black, the colour of wet charcoal with a faint brown undertone. The surface was combed by hand with a fine notched comb of about fourteen teeth: short arcing swaths, each about an arm's reach long, laid side by side and gently fanned so together they follow one long slow curve across the panel. Swaths overlap softly at their edges; small lips of pushed-up plaster sit where the comb was lifted. Between swaths are patches of flat troweled plaster with fine sand tooth, pinholes and crumbs. One low lamp at the left edge rakes across the surface almost parallel to it, so every groove throws a thin shadow, the left third glows dull bronze-grey and the right side falls away to near black. The panel fills the frame edge to edge. Photographed as an architectural material study on a Phase One IQ4 with a 120mm lens at f/11, matte, fine film grain, almost monochrome."

Variation axes (one changes per row): DISTANCE (how many swaths across the frame) · lamp height. Never changes: colour, one lamp from the left, no objects, no corners, no type.
Higgsfield takes positive clauses only: the NOT list lives in the DNA as what IS.

| Row | Model | Distance line added after the DNA | Aspect |
|---|---|---|---|
| A1, A2 | seedream_5_0_flash | "Close: about four swaths fill the frame, every comb tooth line and sand grain readable." | 16:9 |
| B1, B2 | seedream_5_0_flash | "Wall distance: about nine swaths fill the frame, the curve of the whole field reads before the single grooves." | 16:9 |
| C1, C2 | seedream_5_0_flash | "Far: the whole wall, about sixteen swaths, the grooves read as a fine sheen of texture on dark plaster." | 16:9 |
| P1, P2 | nano_banana_pro 2k | the strongest distance from A to C | 16:9 |
| F1, F2 | nano_banana_pro 2k | P row with Anwar's ADJUST clause applied | 16:9 |

Rule 6.
- Premise check: is a generated photo the right route? Anwar's first choice is a real panel; this is his second, taken because Asif chose credits. The real panel stays the fallback.
- Anti-default three the average maker does: a centred hero texture with a vignette; glossy Venetian plaster with marble swirls; even overhead light that flattens the relief. Refused: edge-to-edge, matte lime, one raking lamp.
- Felt test: a stranger at half size says "someone combed that wall by hand", and leans closer.

Seeds: neither model exposes a seed in this CLI; every job id, prompt and file is ledgered in runs/plaster.ndjson.
Provenance: the C2PA credential on each download is kept; nothing strips it (rules/realism-default.md, line 2).

## PE4 gate, round 1 (Anwar, ANWAR-GATE-PLASTER.md): HOLD
- Every picture reads as plaster. A1 A2 B1 B2 C1 KILL; C2 ADJUST (arrangement); P1 ADJUST, base (matte lime, dim light). P1 layout reads as stock fan comb texture (Artex).
- ADJUST clause applied to the SYSTEM (prompts.json F1, F2): one single tier of tall swaths, each an unbroken pull bending through a quarter-turn arc, each leaning further right; ends at different heights; equal light to the borders. "Right" checked against media/fsi-mark.svg: one wave travelling left to right.
- Fault caught by the gate: P2's download saved the reference picture. The CLI needs the reference as an uploaded id (higgsfield upload create), passed as --image=<id>; zsh does not split a variable into two words.
- Living photographer's name removed from the DNA.
## PE5 finals: F1 text only, F2 with P1 as reference (upload c3329b96). Gate round 2: ANWAR-GATE-PLASTER-R2.md.
