// Photographs how an opening ARRIVES: frames at fixed times after load, with no scroll, then (optionally) at scroll beats.
// usage: node scripts/arrive.mjs <url> <outPrefix> <w> <h> <times ms, comma list> [beats comma list] [dpr]
import { chromium } from 'playwright';
const exe = process.env.HOME + '/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const [url, out, w, h, times, beats, dpr] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: +(dpr || 1) });
const page = await ctx.newPage();
const errs = [];
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
page.on('pageerror', (e) => errs.push(String(e)));
await page.goto(url, { waitUntil: 'load' });
const t0 = Date.now();
for (const ms of times.split(',').filter(Boolean)) {
  const wait = +ms - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `${out}-t${ms}.png` });
}
console.log('live after load (s):', await page.evaluate(() => window.__stage ? +(performance.now() / 1000 - window.__stage.since()).toFixed(2) : 'not live'), 'load at', await page.evaluate(() => +(performance.timing.loadEventEnd - performance.timing.navigationStart) / 1000));
for (const b of (beats || '').split(',').filter(Boolean)) {
  const beat = parseFloat(b);
  await page.evaluate((beat) => {
    const vh = innerHeight;
    const secs = [...document.querySelectorAll('.svc')];
    const anchors = [0, ...secs.map((s) => s.offsetTop + (s.offsetHeight - vh) * 0.3)];
    const k = Math.min(Math.floor(beat), anchors.length - 2);
    window.scrollTo(0, anchors[k] + (anchors[k + 1] - anchors[k]) * (beat - k));
  }, beat);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${out}-b${b}.png` });
}
if (errs.length) console.log('ERRORS', errs.slice(0, 8));
await browser.close();
