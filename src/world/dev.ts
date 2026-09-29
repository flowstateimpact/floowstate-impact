/*
 * dev.ts · dev-only page (dev/rail.html): the four stations of slice one travelled on scroll.
 * Not part of the production build (vite builds index.html only).
 *
 *   /dev/rail.html                 scroll through hero, one, the wordless beat, why
 *   ?rail=portrait|landscape       force a rail (default: portrait when the window is taller than wide)
 *   ?s=<vh>                        jump to a scroll position and hold (used by the captures)
 *   ?clean                         hide the readout, the plan and the captions
 */
import './dev.css';
import * as THREE from 'three';
import Lenis from 'lenis';
import { FRONT_ROOM } from './premises.ts';
import { buildWorld, deg } from './world.ts';
import { rail, layout, effectiveFov, basis, LANDSCAPE_REF, PORTRAIT_REF, PHONE_WORLD_SHARE, type Frame, type RailState } from './rail.ts';
import type { RailId } from './stations.ts';
import { buildGreyBox } from './greybox.ts';

const q = new URLSearchParams(location.search);
const forced = q.get('rail');
const railId: RailId = forced === 'portrait' || forced === 'landscape' ? forced : innerWidth >= innerHeight ? 'landscape' : 'portrait';
document.body.classList.toggle('portrait', railId === 'portrait');
document.body.classList.toggle('clean', q.has('clean'));

const spec = FRONT_ROOM;
const world = buildWorld(spec);
const lay = layout(railId);
const gb = buildGreyBox(world);

/* ---------- the scroll track: one section per station, travel then dwell; words only in the dwell ---------- */
const track = document.getElementById('track')!;
const caps: HTMLElement[] = [];
for (const sec of lay.sections) {
  const el = document.createElement('section');
  el.style.height = `${sec.len}vh`;
  el.id = sec.station.id;
  const cap = document.createElement('p');
  cap.className = 'cap';
  const words = sec.station.id === 'wordless' ? '' : sec.station.label;
  cap.innerHTML = `<small>route ${sec.station.route} · ${sec.station.id}</small>`;
  cap.append(document.createTextNode(words));
  if (sec.station.id === 'wordless') cap.setAttribute('aria-hidden', 'true');
  el.appendChild(cap);
  track.appendChild(el);
  caps.push(cap);
}
// a little run-out so the last dwell can be reached with the page bottom
const tail = document.createElement('section');
tail.style.height = '100vh';
track.appendChild(tail);

/* ---------- renderer ---------- */
const canvas = document.getElementById('world') as HTMLCanvasElement;
const capture = q.has('s');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: capture, powerPreference: 'high-performance' });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 400);
camera.rotation.order = 'YXZ';

let frame: Frame = { aspect: 16 / 9, refAspect: LANDSCAPE_REF, fit: 'landscape', window: [0, 1] };
function resize() {
  const w = innerWidth, h = railId === 'portrait' ? Math.round(innerHeight * PHONE_WORLD_SHARE) : innerHeight;
  renderer.setSize(w, h, false);
  canvas.style.height = `${h}px`;
  frame = railId === 'portrait'
    ? { aspect: w / h, refAspect: PORTRAIT_REF, fit: 'portrait', window: [0, 1] }
    : { aspect: w / h, refAspect: LANDSCAPE_REF, fit: 'landscape', window: [0, 1] };
  camera.aspect = w / h;
}
addEventListener('resize', () => { resize(); dirty = true; });
resize();

/* ---------- the eight "why" placeholders ignite one at a time across the why dwell ---------- */
function whyLit(st: RailState) {
  const i = lay.sections.findIndex((x) => x.station.id === 'why');
  if (st.index < i) return 0;
  if (st.index > i || st.phase === 'dwell' && st.u >= 1) return 8;
  if (st.phase === 'travel') return 0;
  // two per trait, A to D, each as the pen lifts: evenly through the first 90 percent of the dwell
  return Math.min(8, Math.floor((st.u / 0.9) * 8 + 0.0001));
}

/* ---------- the plan of the premises, top down, with the rail and the view cone ---------- */
const map = document.getElementById('map') as HTMLCanvasElement;
const mctx = map.getContext('2d')!;
const railPts = Array.from({ length: 300 }, (_, i) => rail(spec, railId, (lay.total * i) / 299, lay).pose.pos);
function drawMap(st: RailState) {
  const W = map.width, S = W / 14, ox = W * 0.62, oz = W * 0.34; // metres to pixels; origin at the shutter line
  const P = (x: number, z: number): [number, number] => [ox + x * S, oz + z * S];
  mctx.clearRect(0, 0, W, W);
  mctx.lineWidth = 1;
  const rect = (x0: number, z0: number, x1: number, z1: number, stroke: string, fill?: string) => {
    const [a, b] = P(x0, z0), [c, d] = P(x1, z1);
    if (fill) { mctx.fillStyle = fill; mctx.fillRect(a, b, c - a, d - b); }
    mctx.strokeStyle = stroke; mctx.strokeRect(a, b, c - a, d - b);
  };
  rect(spec.inside.left, -spec.inside.depth, spec.inside.right, 0, '#7A4F1E', 'rgba(43,28,14,0.6)');
  rect(spec.apron.left, 0, spec.apron.right, spec.apron.depth, '#7A4F1E');
  for (const s of world.solids) {
    if (s.rotY || s.c[1] - s.s[1] / 2 > 2.2 || !['wall', 'pier', 'partition', 'bay', 'furniture', 'shelf'].includes(s.kind)) continue;
    rect(s.c[0] - s.s[0] / 2, s.c[2] - s.s[2] / 2, s.c[0] + s.s[0] / 2, s.c[2] + s.s[2] / 2, 'rgba(245,241,235,0.35)');
  }
  mctx.strokeStyle = 'rgba(255,176,59,0.55)';
  mctx.beginPath();
  railPts.forEach((p, i) => { const [x, y] = P(p[0], p[2]); if (i) mctx.lineTo(x, y); else mctx.moveTo(x, y); });
  mctx.stroke();
  // the view cone (horizontal field of view)
  const fovH = 2 * Math.atan(Math.tan(deg(effectiveFov(st.pose.fov, frame)) / 2) * frame.aspect);
  const [cx, cy] = P(st.pose.pos[0], st.pose.pos[2]);
  mctx.fillStyle = 'rgba(245,241,235,0.14)';
  mctx.beginPath(); mctx.moveTo(cx, cy);
  for (const a of [-fovH / 2, fovH / 2]) {
    const y = deg(st.pose.yaw) + a;
    mctx.lineTo(cx - Math.sin(y) * 7 * S, cy - Math.cos(y) * 7 * S);
  }
  mctx.closePath(); mctx.fill();
  mctx.fillStyle = '#F5F1EB'; mctx.beginPath(); mctx.arc(cx, cy, 4, 0, Math.PI * 2); mctx.fill();
  const [ox2, oy2] = P(st.owner.at[0], st.owner.at[2]);
  mctx.fillStyle = '#FFB03B'; mctx.beginPath(); mctx.arc(ox2, oy2, 4, 0, Math.PI * 2); mctx.fill();
}

/* ---------- the loop: render only when the scroll moved ---------- */
const hud = document.getElementById('hud')!;
let dirty = true;
let lastS = -1;
function frameAt(s: number) {
  const st = rail(spec, railId, s, lay);
  camera.position.set(st.pose.pos[0], st.pose.pos[1], st.pose.pos[2]);
  camera.rotation.set(deg(st.pose.pitch), deg(st.pose.yaw), 0, 'YXZ');
  camera.fov = effectiveFov(st.pose.fov, frame);
  camera.updateProjectionMatrix();
  gb.update({ shutter: st.shutter, owner: st.owner.at, camera, whyLit: whyLit(st) });
  renderer.clippingPlanes = gb.clip;
  renderer.render(gb.scene, camera);
  caps.forEach((c, i) => c.classList.toggle('on', i === st.index && st.phase === 'dwell'));
  if (!q.has('clean')) {
    const f = basis(st.pose).f;
    hud.textContent = [
      `rail      ${railId}`,
      `s         ${st.s.toFixed(1)} / ${lay.total} vh`,
      `station   ${st.station} (route ${lay.sections[st.index].station.route}) · ${st.phase} ${(st.u * 100).toFixed(0)}%`,
      `camera    x ${st.pose.pos[0].toFixed(2)}  y ${st.pose.pos[1].toFixed(3)}  z ${st.pose.pos[2].toFixed(2)}`,
      `look      yaw ${st.pose.yaw.toFixed(1)}  pitch ${st.pose.pitch.toFixed(1)}  fov ${camera.fov.toFixed(1)}`,
      `gaze      ${(Math.acos(Math.min(1, Math.abs(f[2]) / Math.hypot(f[0], f[2]))) * 180 / Math.PI).toFixed(1)} deg to the long axis`,
      `shutter   bottom ${st.shutter.toFixed(2)} m`,
      `draws     ${renderer.info.render.calls}`,
    ].join('\n');
    drawMap(st);
  }
  return st;
}

if (capture) {
  const s = parseFloat(q.get('s') || '0');
  resize();
  scrollTo(0, (s * innerHeight) / 100);
  requestAnimationFrame(() => {
    frameAt(s);
    requestAnimationFrame(() => { frameAt(s); document.documentElement.dataset.ready = '1'; });
  });
} else {
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
  const loop = (t: number) => {
    lenis.raf(t);
    const s = (lenis.scroll / innerHeight) * 100;
    if (dirty || Math.abs(s - lastS) > 1e-4) { frameAt(s); lastS = s; dirty = false; }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  addEventListener('visibilitychange', () => { dirty = true; });
}
