// usage: node scripts/shots.mjs <url> <outPrefix> <w> <h> <beats comma list> [dpr]
import { chromium } from 'playwright';
const exe = process.env.HOME + '/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const [url, out, w, h, beats, dpr] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: +(dpr || 1) });
const page = await ctx.newPage();
const errs = [];
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
page.on('pageerror', (e) => errs.push(String(e)));
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => document.documentElement.classList.contains('live') || document.documentElement.classList.contains('still'), null, { timeout: 15000 }).catch(() => errs.push('never went live'));
await page.waitForTimeout(1500);
for (const b of beats.split(',')) {
  const beat = parseFloat(b);
  await page.evaluate((beat) => {
    const vh = innerHeight;
    const secs = [...document.querySelectorAll('.svc')];
    const anchors = [0, ...secs.map((s) => s.offsetTop + (s.offsetHeight - vh) * 0.3)];
    let y;
    if (beat >= 90) y = document.querySelector('.later').offsetTop + (beat - 90) * vh;
    else { const k = Math.min(Math.floor(beat), anchors.length - 2); y = anchors[k] + (anchors[k + 1] - anchors[k]) * (beat - k); if (beat >= anchors.length - 1) y = anchors[anchors.length - 1]; }
    window.scrollTo(0, y);
  }, beat);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${out}-${b}.png` });
}
if (errs.length) console.log('ERRORS', errs.slice(0, 8));
await browser.close();
