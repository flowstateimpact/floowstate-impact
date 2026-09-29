# Version 2, part one: the gates

Part one exists to answer one felt question: when the owner's hand lifts the shutter, do you lean in. These are the eight gates from the engine plan (section 12, row 1), each with a measured number or a reason it could not be measured here. Measured 29 September 2026 on branch `v2-3d`, working copy on top of commit 6acbd4f, nothing committed.

| Gate | What it asks | Result |
|---|---|---|
| (a) | The rail check passes every law on both rails | PASS. Zero breaches on laws 1 to 7 and the stage law, desktop and phone. The self-test breaks each law on purpose and catches all nine cases, including the new owner-size range. |
| (b) | Camera height over 400 samples never above 1.58m | PASS. 1.200 to 1.450m on both rails. |
| (c) | Landing: zero lamp pixels. "why": exactly 8 | PASS. Zero blobs at nine positions across the landing and "one", both rails. Exactly 8 at "why" once all have ignited, both rails. |
| (d) | Same scroll position, same frame, going down and coming back | PASS. 200 of 200 positions bit-identical on desktop, 200 of 200 on the phone. |
| (e) | The owner bottom-left and inside the size ranges at every captured dwell | PASS. 27 of 27 dwell samples on desktop, 27 of 27 on the phone. |
| (f) | Mid-range Android, 90th-percentile frame under 16ms | PENDING. No device. |
| (g) | Lighthouse mobile at least 90 with the world loaded, LCP under 2.5s | FAIL. Median score 82, LCP 3.60s. |
| (h) | The felt gate: 20-second recordings, desktop and phone | Recorded: `docs/v2/recordings/`. The verdict belongs to the taste director and Asif. |

## (c) and (e), how they were counted

Both count real pixels, not geometry. The page draws the world flat black and only the thing being measured in white, reads the frame back, and counts.

- Lamps: 8-connected blobs over 40 percent grey. Two lamps are lit after the first line, five after the second, eight at the end, one at a time.
- Owner: the drawn figure's own box, the 12 percent shadow excluded.

Owner sizes measured on the drawn figure, as a share of the frame's height:

| Station | Range asked | Desktop | Phone |
|---|---|---|---|
| hero | 34 to 40 | 37.8 to 38.1 | 36.4 to 36.7 |
| one | 26 to 34 | 27.0 to 33.6 | 27.1 to 33.7 |
| wordless beat | 26 to 34 | 33.1 to 33.2 | 33.4 to 33.6 |
| why, chest up | 22 to 28 | 24.8 | 24.0 |

The owner sits 12 to 33 percent across the frame in every sample. The wordless beat runs close to its 34 percent ceiling on both rails.

Full numbers: `docs/v2/part1-gates.json`.

## (f) What the Android trace needs

A physical Moto G class Android phone, which nobody here has confirmed the studio owns. It must have developer options and USB debugging on, and be connected to this Mac. Chrome on the phone is inspected from `chrome://inspect`. The trace is 20 seconds of the first scroll on the dev page, recording the 90th-percentile frame time.

The dev server would need to be reachable from the phone. That means opening it beyond this Mac's loopback, which is a separate decision.

## (g) Why it fails, plainly

The page measured is the dev rail page, built with `WORLD_PAGE=1 npx vite build`. It loads three.js and builds the world before anything paints. First paint therefore waits for the whole world: FCP and LCP both land at about 3.6 seconds, and in one of three runs the main thread was blocked for 1.6 seconds.

This page is not the design, and the design is what fixes it. Plan section 9 paints the HTML headline and the captured landing image first, then imports the world after the page settles. That first-paint path is not built yet.

The world's code weighs 146.6 KB compressed (three.js 131.7, the world 14.9), just under the plan's 150 KB budget for that chunk. The size is inside budget; the timing is not. The version 1 baseline LCP was already 2.70 seconds.

Reports: `docs/v2/lighthouse/lh-world-run1.json` to `lh-world-run3.json`.

## (h) The recordings

- `docs/v2/recordings/first-scroll-desktop-1920x1080.mp4`: 20 seconds, 30 frames a second, H.264.
- `docs/v2/recordings/first-scroll-phone-390x844.mp4`: the same, at the phone's full pixel size (780 x 1688).

Every frame is rendered at the exact scroll position a human scroll passes through, on a smooth curve that never runs backwards: a beat on the landing, slow through the closing and the reopening, quicker through the reveal, then the slow look up while the eight lamps light. There is no overlay and no captions; the site's words are not part of part one.

Made with `node scripts/record-first-scroll.mjs`.
