// hero-reveal-render.mjs: drives hero-reveal-board.html in headless Chrome and writes each beat as a JPEG, plus the bridge test PNGs.
// usage: node hero-reveal-render.mjs [port-of-local-server, default 4391] [output folder]
// writes each beat at full device size (JPEG) and at half size (PNG, how Anwar judges), plus the bridge test PNGs.
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
const SRV = process.argv[2] || "4391";
const OUT = process.argv[3] || "/Users/asiffarid/Documents/apps/flowstateimpact-site-glowup/glowup-renders/patterns/figma/hero-reveal/out"; // second arg: output folder (run 3 writes glowup-renders/r7/hero)
mkdirSync(OUT, { recursive: true });
const CH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9800 + Math.floor(Math.random() * 300);
const chrome = spawn(CH, ["--headless=new", "--remote-debugging-port=" + PORT, "--no-first-run", "--user-data-dir=/tmp/hrb-" + PORT, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 80; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); if (r.ok) break; } catch {} await sleep(150); }
const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map(); const errs = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } else if (d.method === "Runtime.exceptionThrown") errs.push(d.params.exceptionDetails.exception?.description); };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails || r.error) throw new Error(JSON.stringify(r.result?.exceptionDetails || r.error).slice(0, 600)); return r.result.result.value; };
await send("Runtime.enable"); await send("Page.enable");
await send("Page.navigate", { url: `http://127.0.0.1:${SRV}/glowup-renders/tooling/hero-reveal-board.html` });
await sleep(1500);
const n = await ev("window.count");
const report = [];
for (let i = 0; i < n; i++) {
  const r = await ev(`window.make(${i})`);
  writeFileSync(`${OUT}/${r.name}.jpg`, Buffer.from(r.url.split(",")[1], "base64"));
  writeFileSync(`${OUT}/${r.name}-half.png`, Buffer.from(r.half.split(",")[1], "base64"));
  delete r.url; delete r.half; report.push(r); console.log(JSON.stringify(r));
}
for (const w of ["desk", "phone"]) {
  const r = await ev(`window.bridges('${w}')`);
  writeFileSync(`${OUT}/bridge-${w}-today.png`, Buffer.from(r.today.split(",")[1], "base64"));
  writeFileSync(`${OUT}/bridge-${w}-40.png`, Buffer.from(r.narrow.split(",")[1], "base64"));
  delete r.today; delete r.narrow; report.push({ bridge: w, ...r }); console.log(JSON.stringify({ bridge: w, ...r }));
}
writeFileSync(`${OUT}/report.json`, JSON.stringify({ report, errors: errs }, null, 1));
console.log("errors", errs);
ws.close(); chrome.kill();
process.exit(0);
