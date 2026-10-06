// Photographs each opening of our own room, without the line, for the still page (motion switched off, or no WebGL).
import { chromium } from 'playwright';
const exe = process.env.HOME + '/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const [base, outDir] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
for (const o of ['a', 'b']) for (const p of ['a', 'b']) for (const [name, w, h, d] of [['desk', 1600, 1000, 1], ['phone', 390, 844, 2]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: d });
  const page = await ctx.newPage();
  await page.goto(`${base}/?poster&o=${o}&p=${p}`, { waitUntil: 'load' });
  await page.waitForFunction(() => document.documentElement.classList.contains('live'), null, { timeout: 15000 });
  await page.addStyleTag({ content: 'main,.nav,.later{visibility:hidden!important}' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${outDir}/hero-${o}-${p}-${name}.png` });
  await ctx.close();
}
await browser.close();
