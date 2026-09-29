#!/usr/bin/env node
/*
 * record-first-scroll.mjs · dev only. The felt gate (engine plan 12, gate h): a clean 20-second recording of the
 * first scroll, desktop 1920x1080 and phone 390x844, no overlay, written to docs/v2/recordings/*.mp4.
 * Needs the dev server on loopback (npx vite --host 127.0.0.1 --port 4182) and ffmpeg.
 *
 * Because every frame is a pure function of scroll, the recording renders exactly the frames a scroll passes
 * through: 30 frames a second, on a human scroll curve (a beat on the landing, slow through the closing and the
 * reopening, quicker through the reveal, then the slow look up while the eight lamps light). The curve is monotone
 * (Fritsch-Carlson), so the scroll never runs backwards or overshoots.
 */
import { mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { layout } from '../src/world/rail.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs', 'v2', 'recordings');
const FFMPEG = process.env.FFMPEG || join(homedir(), '.local/bin/ffmpeg');
const base = process.argv[2] || 'http://127.0.0.1:4182';
const FPS = 30, SECONDS = 20;
mkdirSync(OUT, { recursive: true });

// the scroll's key points: [seconds, station, fraction of that section]
const KEYS = [[0, 'hero', 0.2], [1.6, 'hero', 0.7], [3.2, 'one', 0.3], [6.4, 'one', 0.74], [9.0, 'one', 0.99], [12.6, 'wordless', 0.98], [15.0, 'why', 0.45], [20, 'why', 0.985]];

function monotone(xs, ys) {
  const n = xs.length, d = [], m = [];
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m.push(d[0]);
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
    if (h > 9) { const t = 3 / Math.sqrt(h); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return (x) => {
    let i = Math.min(n - 2, Math.max(0, xs.findIndex((v, k) => x >= v && x <= xs[k + 1])));
    const hh = xs[i + 1] - xs[i], t = (x - xs[i]) / hh;
    const h00 = 2 * t ** 3 - 3 * t ** 2 + 1, h10 = t ** 3 - 2 * t ** 2 + t, h01 = -2 * t ** 3 + 3 * t ** 2, h11 = t ** 3 - t ** 2;
    return h00 * ys[i] + h10 * hh * m[i] + h01 * ys[i + 1] + h11 * hh * m[i + 1];
  };
}

const cached = join(homedir(), 'Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (existsSync(cached) ? cached : undefined), args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const RAILS = {
  landscape: { file: 'first-scroll-desktop-1920x1080.mp4', ctx: { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 } },
  portrait: { file: 'first-scroll-phone-390x844.mp4', ctx: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 } },
};
for (const [railId, cfg] of Object.entries(RAILS)) {
  const lay = layout(railId);
  const sAt = (id, f) => { const x = lay.sections.find((q) => q.station.id === id); return x.start + x.len * f; };
  const curve = monotone(KEYS.map((k) => k[0]), KEYS.map((k) => sAt(k[1], k[2])));
  const dir = join(OUT, `.frames-${railId}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext(cfg.ctx);
  const page = await ctx.newPage();
  await page.goto(`${base}/dev/rail.html?rail=${railId}&clean&rec`);
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1' && !!window.__gate, null, { timeout: 60000 });
  const frames = FPS * SECONDS;
  for (let f = 0; f < frames; f++) {
    const s = curve(f / FPS);
    await page.evaluate((s) => window.__gate.render(s), s);
    await page.screenshot({ path: join(dir, `f${String(f).padStart(4, '0')}.png`) });
  }
  await ctx.close();
  const out = join(OUT, cfg.file);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(dir, 'f%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'slow', '-movflags', '+faststart', out]);
  rmSync(dir, { recursive: true, force: true });
  console.log(out);
}
await browser.close();
