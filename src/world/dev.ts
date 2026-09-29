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
const gb = buildGreyBox(world, { phone: railId === 'portrait' });

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
const capture = q.has('s') || q.has('gate') || q.has('rec');
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
  gb.update(st, camera, frame, canvas.clientHeight || innerHeight);
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

/* ---------- measurement harness for the part-one gates (dev only) ---------- */
function pixels() {
  const gl = renderer.getContext();
  const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
  const px = new Uint8Array(w * h * 4);
  gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
  return { px, w, h };
}
function measure(s: number, mask: 'none' | 'lamps' | 'owner') {
  gb.setMask(mask);
  frameAt(s);
  const r = pixels();
  gb.setMask('none');
  return r;
}
const gate = {
  /** lamp blobs visible at s: the world drawn black, lamps white, 8-connected blobs over 40 percent grey */
  lampBlobs(s: number) {
    const { px, w, h } = measure(s, 'lamps');
    const on = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) on[i] = px[i * 4] > 102 ? 1 : 0;
    const seen = new Uint8Array(w * h);
    const sizes: number[] = [];
    for (let i = 0; i < w * h; i++) {
      if (!on[i] || seen[i]) continue;
      let n = 0; const stack = [i]; seen[i] = 1;
      while (stack.length) {
        const k = stack.pop()!; n++;
        const x = k % w, y = (k / w) | 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx, yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          const j = yy * w + xx;
          if (on[j] && !seen[j]) { seen[j] = 1; stack.push(j); }
        }
      }
      sizes.push(n);
    }
    return { blobs: sizes.length, sizes };
  },
  /** the owner's drawn box at s, as fractions of the frame (the 12 percent shadow excluded) */
  ownerBox(s: number) {
    const { px, w, h } = measure(s, 'owner');
    let x0 = w, x1 = -1, y0 = h, y1 = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (px[(y * w + x) * 4] > 128) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return null;
    // readPixels rows run bottom-up
    return { across: (x0 + x1) / 2 / w, top: 1 - (y1 + 1) / h, bottom: 1 - y0 / h, tall: (y1 - y0 + 1) / h };
  },
  /** a hash of the full frame at s (FNV-1a) */
  hash(s: number) {
    frameAt(s);
    const { px } = pixels();
    let hsh = 0x811c9dc5;
    for (let i = 0; i < px.length; i += 1) { hsh ^= px[i]; hsh = Math.imul(hsh, 0x01000193); }
    return (hsh >>> 0).toString(16);
  },
  layout: () => lay,
  render: (s: number) => { frameAt(s); },
};
(window as unknown as { __gate: typeof gate }).__gate = gate;

if (capture) {
  const s = parseFloat(q.get('s') || '0');
  // in gate and recording modes the page never scrolls; frames are rendered at the asked position directly
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
