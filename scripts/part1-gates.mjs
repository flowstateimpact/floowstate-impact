#!/usr/bin/env node
/*
 * part1-gates.mjs · dev only. Measures part one's pixel gates on the dev page (engine plan 12, row 1).
 * Needs the dev server on loopback:  npx vite --host 127.0.0.1 --port 4182
 *   node scripts/part1-gates.mjs [baseUrl]  -> prints JSON and writes docs/v2/part1-gates.json
 *
 * (c) lamp pixels: the world drawn black, the lamps white; 8-connected blobs counted. Landing and "one": zero.
 *     "why" once all have ignited: exactly eight.
 * (d) the same scroll position gives a bit-identical frame going down and coming back, over 200 positions.
 * (e) at every captured dwell and 6 more positions per dwell, the owner (drawn alone, white, shadow excluded) is
 *     bottom-left and inside the taste read's size range.
 */
import { writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { layout } from '../src/world/rail.ts';
import { OWNER_SIZE } from './rail-lint.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const base = process.argv[2] || 'http://127.0.0.1:4182';
const cached = join(homedir(), 'Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (existsSync(cached) ? cached : undefined), args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const RAILS = {
  landscape: { viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 },
  portrait: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 },
};
const out = { when: 'measured on the dev page, SwiftShader (software GL) in headless Chromium 1223', c: {}, d: {}, e: {} };

for (const [railId, ctxOpts] of Object.entries(RAILS)) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  await page.goto(`${base}/dev/rail.html?rail=${railId}&clean&gate`);
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1' && !!window.__gate, null, { timeout: 60000 });
  const lay = layout(railId);
  const sec = (id) => lay.sections.find((x) => x.station.id === id);
  const dwellAt = (id, f) => { const x = sec(id); return x.start + x.travel + (x.len - x.travel) * f; };

  /* (c) */
  const c = {};
  for (const [name, s] of [
    ['hero dwell 0.1', dwellAt('hero', 0.1)], ['hero dwell 0.5', dwellAt('hero', 0.5)], ['hero dwell 0.9', dwellAt('hero', 0.9)],
    ['one dwell 0.2', dwellAt('one', 0.2)], ['one dwell 0.5', dwellAt('one', 0.5)], ['one dwell 0.9', dwellAt('one', 0.9)],
    ['why dwell 0.97 (all ignited)', dwellAt('why', 0.97)], ['why dwell 0.60 (line A lifted: 2 lit)', dwellAt('why', 0.6)], ['why dwell 0.75 (lines A and B: 5 lit)', dwellAt('why', 0.75)],
  ]) c[name] = await page.evaluate((s) => window.__gate.lampBlobs(s), s).then((r) => ({ s: +s.toFixed(1), blobs: r.blobs, sizes: r.sizes }));
  out.c[railId] = c;

  /* (d): 200 positions, down then back up */
  const N = 200;
  const ss = Array.from({ length: N }, (_, i) => (lay.total * i) / (N - 1));
  const down = await page.evaluate((ss) => ss.map((s) => window.__gate.hash(s)), ss);
  const up = await page.evaluate((ss) => ss.map((s) => window.__gate.hash(s)), [...ss].reverse());
  up.reverse();
  const mismatches = ss.filter((_, i) => down[i] !== up[i]).map((s) => +s.toFixed(1));
  out.d[railId] = { positions: N, identical: N - mismatches.length, mismatches };

  /* (e) */
  const e = [];
  for (const id of ['hero', 'one', 'wordless', 'why']) {
    const fr = id === 'why' ? [0.4, 0.5, 0.6, 0.7, 0.8, 0.97] : [0.05, 0.25, 0.35, 0.5, 0.6, 0.75, 0.95];
    for (const f of fr) {
      const s = dwellAt(id, f);
      const b = await page.evaluate((s) => window.__gate.ownerBox(s), s);
      const range = OWNER_SIZE[id] ?? OWNER_SIZE.default;
      const pass = !!b && b.across >= 0.04 && b.across <= 0.34 && b.tall >= range[0] - 0.005 && b.tall <= range[1] + 0.005 && b.bottom >= 0.62;
      e.push({ station: id, dwell: f, s: +s.toFixed(1), across: b && +b.across.toFixed(3), tall: b && +b.tall.toFixed(3), bottom: b && +b.bottom.toFixed(3), range, pass });
    }
  }
  out.e[railId] = { samples: e.length, pass: e.filter((x) => x.pass).length, fails: e.filter((x) => !x.pass), all: e };
  await ctx.close();
}
await browser.close();
writeFileSync(join(ROOT, 'docs', 'v2', 'part1-gates.json'), JSON.stringify(out, null, 2) + '\n');
const brief = {
  c: Object.fromEntries(Object.entries(out.c).map(([r, v]) => [r, Object.fromEntries(Object.entries(v).map(([k, x]) => [k, x.blobs]))])),
  d: out.d,
  e: Object.fromEntries(Object.entries(out.e).map(([r, v]) => [r, { samples: v.samples, pass: v.pass, fails: v.fails.map((f) => `${f.station}@${f.dwell}: tall ${f.tall} across ${f.across} bottom ${f.bottom}`) }])),
};
console.log(JSON.stringify(brief, null, 2));
