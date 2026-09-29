# Version 2, Part 0: the baseline

Every later gate of version 2 is compared against these numbers. They describe version 1 exactly as it stands on the `v2-3d` branch (commit 8284d37, version 1 plus the security headers), before any version 2 code ran.

## Lighthouse mobile, measured 29 September 2026

How it was run: `npm run build` on `v2-3d`, served with `vite preview` on 127.0.0.1 only, then Lighthouse 12.8.2 in its default mobile mode (emulated Moto G Power 2022, simulated 4G throttling and a slowed processor), Chromium 1223 headless, on the Mac Studio. Five runs, because one run alone is not a measurement.

| Run | Score | First paint (FCP) | Largest paint (LCP) | Blocking time (TBT) | Layout shift (CLS) | Speed Index |
|---|---|---|---|---|---|---|
| 1 | 65 | 1.35 s | 2.70 s | 3,452 ms | 0.001 | 4.11 s |
| 2 | 95 | 1.36 s | 2.70 s | 106 ms | 0.002 | 2.18 s |
| 3 | 95 | 1.35 s | 2.78 s | 110 ms | 0.037 | 2.00 s |
| 4 | 94 | 1.35 s | 2.78 s | 127 ms | 0.037 | 2.00 s |
| 5 | 95 | 1.36 s | 2.70 s | 93 ms | 0.002 | 2.17 s |
| MEDIAN | 95 | 1.35 s | 2.70 s | 110 ms | 0.002 | 2.17 s |

What the numbers say:

- The median score of 95 clears the plan's target of 90, and layout shift sits far under its 0.05 line.
- The largest paint, 2.70 seconds, is already over the plan's hard line of 2.5 seconds on 4G, before any 3D world is added. Version 2 starts in debt on this one number, and the captured landing image that replaces the hero text as the largest paint (plan section 9) has to earn it back.
- Run 1 blocked the main thread for 3.4 seconds against about a tenth of a second in the other four. Observed: only that run shows it. Concluded, not proven: version 1 loads its 530 KB particle engine after the page settles, and in that run the engine's start-up fell inside Lighthouse's measuring window. It means a heavy world chunk can swing this score by 30 points depending on timing, which is the risk version 2's world chunk will carry.
- These are simulated numbers from a fast Mac pretending to be a phone. They rank builds against each other reliably; they are not what a real phone on a real network shows. The two lines below are the real-device half, and neither can be produced here.

The five full Lighthouse reports: `docs/v2/lighthouse/lh-v1-run1.json` to `lh-v1-run5.json`.

## PENDING: not measured, never estimated

- WebPageTest, Moto G class phone on 4G: PENDING. Needs three things: a public URL of this exact build (a Vercel preview deploy of `v2-3d`, which is a send off this machine and waits for Asif's yes); a WebPageTest login (the free tier asks for an account; whether any plan costs money must be asked, not assumed); and the run itself, three first-view runs on a Moto G class device profile at 4G, recording LCP, TBT, CLS and Speed Index beside the table above.
- Frame trace on a mid-range Android phone: PENDING. Needs a physical Moto G class Android phone (none is known to be in the studio; ask), with developer options and USB debugging on, connected to this Mac, Chrome on the phone inspected from `chrome://inspect`, and a performance trace of the first 20 seconds of scrolling. The number to record is the 90th-percentile frame time, against the plan's gate of under 16 ms at 60 frames a second.
