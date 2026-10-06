import { chromium } from 'playwright';
const exe = process.env.HOME + '/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const out = process.argv[2];
const sites = process.argv.slice(3).map(s => s.split('='));
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
await Promise.all(sites.map(async ([name, url]) => {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 750 } });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(9000);
    await page.mouse.move(600, 380); await page.mouse.click(600, 600).catch(() => {});
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/${name}-1.jpg`, type: 'jpeg', quality: 70 });
    for (let k = 2; k <= 4; k++) {
      for (let i = 0; i < 14; i++) { await page.mouse.wheel(0, 160); await page.waitForTimeout(90); }
      await page.waitForTimeout(1600);
      await page.screenshot({ path: `${out}/${name}-${k}.jpg`, type: 'jpeg', quality: 70 });
    }
    const info = await page.evaluate(() => ({ t: document.title, h: document.documentElement.scrollHeight, canv: document.querySelectorAll('canvas').length, vid: document.querySelectorAll('video').length, fonts: [...new Set([...document.querySelectorAll('h1,h2,p,a')].slice(0, 60).map(e => getComputedStyle(e).fontFamily.split(',')[0]))].slice(0, 6), bg: getComputedStyle(document.body).backgroundColor, text: document.body.innerText.slice(0, 500).replace(/\s+/g, ' ') }));
    console.log(name, JSON.stringify(info));
  } catch (e) { console.log(name, 'FAIL', String(e).slice(0, 200)); }
  await ctx.close();
}));
await browser.close();
