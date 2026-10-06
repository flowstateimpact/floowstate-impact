// Measures the production build: console errors, requests leaving this machine, first-load weight, opening frame rate, text contrast.
import { chromium } from 'playwright';
const exe = process.env.HOME + '/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const base = process.argv[2];
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errs = [], external = []; let bytes = 0, film = 0; const sizes = {};
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
page.on('pageerror', (e) => errs.push(String(e)));
page.on('request', (r) => { const u = new URL(r.url()); if (!['127.0.0.1', 'localhost'].includes(u.hostname) && u.protocol.startsWith('http')) external.push(r.url()); });
page.on('response', async (r) => { try { const b = (await r.body()).length; const n = new URL(r.url()).pathname; if (n.endsWith('.mp4')) film += b; else { bytes += b; sizes[n] = b; } } catch {} });
await page.goto(base, { waitUntil: 'load' });
await page.waitForFunction(() => document.documentElement.classList.contains('live'), null, { timeout: 15000 });
await page.waitForTimeout(2500);
const firstLoad = bytes;
// frame rate at the opening: still, then while the first board is being dealt
const fps = async (scroll) => page.evaluate(async (scroll) => {
  const t0 = performance.now(); let n = 0, worst = 0, last = t0;
  await new Promise((res) => { const tick = (t) => { n++; worst = Math.max(worst, t - last); last = t; if (scroll) window.scrollBy(0, 6); if (t - t0 < 4000) requestAnimationFrame(tick); else res(); }; requestAnimationFrame(tick); });
  return { fps: +(n / ((performance.now() - t0) / 1000)).toFixed(1), worstFrameMs: +worst.toFixed(1) };
}, scroll);
const fpsStill = await fps(false);
const fpsMoving = await fps(true);
// contrast: body text colour against the brightest thing painted behind each service paragraph
const lum = (r, g, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const contrast = [];
const n = await page.locator('.svc').count();
for (let k = 0; k < n; k++) {
  await page.evaluate((k) => { const s = document.querySelectorAll('.svc')[k]; window.scrollTo(0, s.offsetTop + (s.offsetHeight - innerHeight) * 0.3); }, k);
  await page.waitForTimeout(1500);
  const el = page.locator('.svc').nth(k).locator('.svc__body');
  if (!(await el.count())) continue;
  const color = await el.evaluate((e) => getComputedStyle(e).color);
  const box = await el.boundingBox();
  await page.addStyleTag({ content: '.svc__text > *{visibility:hidden!important}' });
  await page.waitForTimeout(150);
  const png = await page.screenshot({ clip: box });
  await page.evaluate(() => document.querySelectorAll('style').forEach((s) => { if (s.textContent.includes('visibility:hidden!important')) s.remove(); }));
  const px = await page.evaluate(async (b64) => { const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode(); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data; const out = []; for (let i = 0; i < d.length; i += 4 * 7) out.push([d[i], d[i + 1], d[i + 2]]); return out; }, png.toString('base64'));
  const ls = px.map((p) => lum(...p)).sort((a, b) => a - b);
  const bg = ls[Math.floor(ls.length * 0.99)];
  const m = color.match(/[\d.]+/g).map(Number);
  let fg = color.startsWith('color(') ? lum(m[0] * 255, m[1] * 255, m[2] * 255) : lum(m[0], m[1], m[2]);
  contrast.push({ service: k + 1, textColor: color, ratio: +((fg + 0.05) / (bg + 0.05)).toFixed(2) });
}
console.log(JSON.stringify({ consoleErrors: errs, externalRequests: external, firstLoadBytes: firstLoad, firstLoadMB: +(firstLoad / 1048576).toFixed(2), totalAfterFullScrollMB: +(bytes / 1048576).toFixed(2), filmBytes: film, fpsStill, fpsMoving, contrast, sizes }, null, 1));
await browser.close();
