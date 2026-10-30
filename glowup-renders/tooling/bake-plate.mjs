// bake-plate.mjs: screenshots the live WebGL plate at rest on a transparent ground. 30 Oct 2026. No library.
// usage: node bake-plate.mjs <out.png> <w> <h> <fit, e.g. "2.62 1.75">
import { spawn } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";
const CH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333 + Math.floor(Math.random() * 400);
const [out, W, H, FIT] = [process.argv[2], +process.argv[3], +process.argv[4], process.argv[5]];
const html = readFileSync(new URL("./bake-plate.html", import.meta.url), "utf8").replace(/FIT/g, FIT);
writeFileSync("/Users/asiffarid/Documents/apps/flowstateimpact-site-glowup/glowup-renders/tooling/bake-plate.live.html", html);
const chrome = spawn(CH, ["--headless=new", "--remote-debugging-port=" + PORT, "--no-first-run", "--hide-scrollbars",
  "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist",
  "--user-data-dir=/tmp/bake-plate-profile-" + PORT, "--window-size=" + W + "," + H, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 80; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); if (r.ok) break; } catch {} await sleep(150); }
const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0; const pending = new Map(); const errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { const p = pending.get(d.id); pending.delete(d.id); d.error ? p.rej(new Error(JSON.stringify(d.error))) : p.res(d.result); }
  else if (d.method === "Runtime.exceptionThrown") errors.push(d.params.exceptionDetails.text); else if (d.method === "Runtime.consoleAPICalled" && d.params.type !== "log") errors.push(d.params.args.map(a => a.value).join(" ")); };
const send = (method, params = {}) => { const i = ++id; return new Promise((res, rej) => { pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); }); };
const ev = async (e) => (await send("Runtime.evaluate", { expression: e, awaitPromise: true, returnByValue: true })).result.value;
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
await send("Page.navigate", { url: "http://127.0.0.1:8791/glowup-renders/tooling/bake-plate.live.html" });
await sleep(600); await ev("new Promise(r=>{if(document.readyState==='complete')r();else addEventListener('load',r)})");
await sleep(4000); // the springs settle in about 1.6 s; four is rest
const live = await ev("(()=>{const m=document.querySelector('.mark3d');const c=m.querySelector('canvas');return JSON.stringify({live:m.classList.contains('is-live'),cw:c&&c.width,ch:c&&c.height})})()");
const png = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
writeFileSync(out, Buffer.from(png.data, "base64"));
console.log(JSON.stringify({ out, W, H, FIT, live, errors }));
ws.close(); chrome.kill();
