// Records an opening as it arrives: four seconds untouched from load, then the scroll into the first service.
// usage: node scripts/clip.mjs <url> <out.mp4> [w h]
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const exe = process.env.HOME + '/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const [url, out, w = 1440, h = 900] = process.argv.slice(2);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clip-'));
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, recordVideo: { dir, size: { width: +w, height: +h } } });
const page = await ctx.newPage();
const born = Date.now();
await page.goto(url, { waitUntil: 'commit' });
const lead = (Date.now() - born) / 1000;
// how well the opening itself holds its frame rate, counted from the first frame the room draws
await page.waitForFunction(() => window.__stage && window.__stage.since() >= 0, null, { timeout: 15000 });
const fps = await page.evaluate(() => new Promise((res) => { const t0 = performance.now(); let n = 0, worst = 0, last = t0; const tick = (t) => { n++; worst = Math.max(worst, t - last); last = t; if (t - t0 < 2500) requestAnimationFrame(tick); else res({ fps: +(n / ((performance.now() - t0) / 1000)).toFixed(1), worstFrameMs: +worst.toFixed(1) }); }; requestAnimationFrame(tick); }));
console.log('frame rate while the opening plays:', JSON.stringify(fps));
await page.waitForTimeout(Math.max(0, 4000 - (Date.now() - born - lead * 1000)));
const target = await page.evaluate(() => { const s = document.querySelector('.svc'); return s.offsetTop + (s.offsetHeight - innerHeight) * 0.3; });
const steps = 58; // five seconds of scroll, eased, by wheel so the page's own smoothing is in the picture
let prev = 0;
for (let i = 1; i <= steps; i++) { const x = i / steps; const e = x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; const y = target * e; await page.mouse.wheel(0, y - prev); prev = y; await page.waitForTimeout(1000 / 30); }
await page.waitForTimeout(1500);
const total = (Date.now() - born) / 1000 - lead;
await ctx.close();
const webm = fs.readdirSync(dir).find((f) => f.endsWith('.webm'));
execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', lead.toFixed(2), '-i', path.join(dir, webm), '-t', total.toFixed(2), '-c:v', 'libx264', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
console.log('lead trimmed', lead.toFixed(2), '->', out);
await browser.close();
