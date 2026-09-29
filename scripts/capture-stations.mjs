#!/usr/bin/env node
/*
 * capture-stations.mjs · dev only. One PNG per station of slice one, per rail, from the dev page.
 * Needs the dev server on loopback:  npx vite --host 127.0.0.1 --port 4182
 *   node scripts/capture-stations.mjs [baseUrl]
 * Each capture sits at the station's held dwell (for "why", the end of the slow look up, all eight lit;
 * for "one", the shutter down and locked). Writes docs/v2/captures/<rail>-<route>-<station>.png
 */
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { layout } from '../src/world/rail.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs', 'v2', 'captures');
mkdirSync(OUT, { recursive: true });
const base = process.argv[2] || 'http://127.0.0.1:4182';

// where in each dwell to hold the capture (fraction of the dwell)
const HOLD = { hero: 0.5, one: 0.35, wordless: 0.6, why: 0.97 };
const RAILS = {
  landscape: { viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 },
  portrait: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 },
};

// use the locally cached Chromium when present (no download): CHROMIUM_PATH overrides
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
const cached = join(homedir(), 'Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const executablePath = process.env.CHROMIUM_PATH || (existsSync(cached) ? cached : undefined);
const browser = await chromium.launch({ executablePath, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const written = [];
for (const [railId, ctxOpts] of Object.entries(RAILS)) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  for (const sec of layout(railId).sections) {
    const s = sec.start + sec.travel + (sec.len - sec.travel) * HOLD[sec.station.id];
    await page.goto(`${base}/dev/rail.html?rail=${railId}&clean&s=${s.toFixed(2)}`);
    await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 30000 });
    const file = join(OUT, `${railId}-${sec.station.route}-${sec.station.id}.png`);
    await page.screenshot({ path: file });
    written.push(`${file}  (s=${s.toFixed(1)}vh)`);
  }
  // two frames inside the 2a travel, landscape only: the reveal (spring done, gaze on the pier edge) and the pier wipe
  if (railId === 'landscape') {
    const sec = layout(railId).sections.find((x) => x.station.id === 'wordless');
    const lay = layout(railId);
    const one = lay.sections.find((x) => x.station.id === 'one'), why = lay.sections.find((x) => x.station.id === 'why');
    for (const [name, s] of [
      ['2a-travel-reveal', sec.start + sec.travel * 0.4], ['2a-travel-wipe', sec.start + sec.travel * 0.8],
      ['2-one-phone', one.start + one.len * 0.66], ['2-one-lift', one.start + one.len * 0.84],
      ['3-why-midway', why.start + why.travel + (why.len - why.travel) * 0.7],
    ]) {
      await page.goto(`${base}/dev/rail.html?rail=${railId}&clean&s=${s.toFixed(2)}`);
      await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 30000 });
      const file = join(OUT, `${railId}-${name}.png`);
      await page.screenshot({ path: file });
      written.push(`${file}  (s=${s.toFixed(1)}vh, extra)`);
    }
  }
  if (errors.filter((e) => !e.includes('404')).length) console.error(`${railId} page errors:\n  ${errors.join('\n  ')}`);
  await ctx.close();
}
await browser.close();
console.log(written.join('\n'));
