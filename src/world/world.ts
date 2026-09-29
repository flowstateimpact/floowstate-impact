/*
 * world.ts · the grey-box world built from a PremisesSpec. Pure data and pure maths, no three.js,
 * so scripts/rail-lint.mjs checks exactly the geometry the page draws.
 *
 * Everything is a box (optionally turned about the vertical axis) or a flat panel. Tones are the
 * direction's fixed ramp (section 5): 0 ink, 1 deep, 2 mid, 3 lit, 4 highlight. Nothing generated.
 */
import type { PremisesSpec, Vec3 } from './premises.ts';
import { WHY_LAMPS } from './sky.ts';

export type Tone = 0 | 1 | 2 | 3 | 4;
export const RAMP = ['#0A0A0B', '#2B1C0E', '#7A4F1E', '#FFB03B', '#F5F1EB'] as const;

export type SolidKind =
  | 'facade' | 'pier' | 'lintel' | 'wall' | 'partition' | 'shelf' | 'bay' | 'beam' | 'cornice'
  | 'furniture' | 'fixture' | 'street' | 'shutter';

export interface Solid {
  id: string;
  kind: SolidKind;
  /** centre */
  c: Vec3;
  /** full size along its own x, y, z */
  s: Vec3;
  /** turn about the vertical axis, degrees; local +x maps to (cos, 0, -sin) */
  rotY?: number;
  /** how bright the surface is before any light reaches it (0..1 on the tone scale) */
  base: number;
  /** render only the face whose normal is local +z (facades seen only from the lane) */
  frontOnly?: boolean;
  /** does it stop sight lines in the rail check (everything opaque does) */
  occludes: boolean;
}

export interface Panel {
  id: string;
  /** centre, size (w, h), turn, and a fixed tone: signs, lit windows, bands of light */
  c: Vec3;
  w: number;
  h: number;
  rotY: number;
  tone: Tone;
}

export interface Floor {
  id: string;
  x0: number; x1: number; z0: number; z1: number; y: number;
  rotY?: number;
  /** pivot for a turned floor */
  pivot?: Vec3;
  base: number;
}

export interface Light {
  id: string;
  at: Vec3;
  intensity: number;
  radius: number;
  /** 'inside' lights reach the apron only through the shutter gap */
  scope: 'inside' | 'outside';
  /** a shaded pendant throws its light down in a cone, never sideways onto the wall behind it */
  down?: boolean;
}

export interface LampHome {
  id: string;
  at: Vec3;
  lead: boolean;
  /** true for the eight that light at "why" (direction section 8) */
  why: boolean;
  /** a waiting lamp sits 1m above the ceiling line (direction 3a); none in slice one */
  waiting: boolean;
}

export interface World {
  spec: PremisesSpec;
  solids: Solid[];
  panels: Panel[];
  floors: Floor[];
  lights: Light[];
  lamps: LampHome[];
}

/* ---------- small vector helpers ---------- */
export const deg = (d: number) => (d * Math.PI) / 180;
export const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k];
export const len = (a: Vec3) => Math.hypot(a[0], a[1], a[2]);
export const norm = (a: Vec3): Vec3 => scale(a, 1 / (len(a) || 1));
export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** seeded random, so every build places the same things */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** a box from min/max corners */
function box(id: string, kind: SolidKind, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, base: number, extra: Partial<Solid> = {}): Solid {
  return { id, kind, c: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], s: [x1 - x0, y1 - y0, z1 - z0], base, occludes: true, ...extra };
}

/** a box set along a turned line: s0..s1 along the line, n0..n1 off it (toward the lane), y0..y1 */
function lineBox(id: string, kind: SolidKind, origin: Vec3, rotY: number, s0: number, s1: number, n0: number, n1: number, y0: number, y1: number, base: number, extra: Partial<Solid> = {}): Solid {
  const r = deg(rotY);
  const ax: Vec3 = [Math.cos(r), 0, -Math.sin(r)];
  const nz: Vec3 = [Math.sin(r), 0, Math.cos(r)];
  const sm = (s0 + s1) / 2, nm = (n0 + n1) / 2;
  const c = add(add(origin, scale(ax, sm)), scale(nz, nm));
  return { id, kind, c: [c[0], (y0 + y1) / 2, c[2]], s: [s1 - s0, y1 - y0, n1 - n0], rotY, base, occludes: true, ...extra };
}

function linePanel(id: string, origin: Vec3, rotY: number, sMid: number, n: number, y: number, w: number, h: number, tone: Tone): Panel {
  const r = deg(rotY);
  const c = add(add(origin, scale([Math.cos(r), 0, -Math.sin(r)], sMid)), scale([Math.sin(r), 0, Math.cos(r)], n));
  return { id, c: [c[0], y, c[2]], w, h, rotY, tone };
}

/* ---------- the world ---------- */
export function buildWorld(spec: PremisesSpec): World {
  const solids: Solid[] = [];
  const panels: Panel[] = [];
  const floors: Floor[] = [];
  const lights: Light[] = [];
  const { apron, frontage, facade, inside, ceiling, frontRoom, counter } = spec;
  const half = frontage.width / 2;
  const W = facade.wall;
  const C = ceiling.height;
  const roof = facade.groundH + (facade.storeys - 1) * facade.storeyH;

  /* the owner's building, seen from the lane */
  solids.push(box('pier-left', 'pier', facade.left, -half, 0, C, -W, 0, 0.16));
  solids.push(box('pier-right', 'pier', half, facade.right, 0, C, -W, 0, 0.16));
  solids.push(box('lintel', 'lintel', -half, half, frontage.lintel, C, -W, 0, 0.18));
  solids.push(box('facade-upper', 'facade', facade.left, facade.right, C, roof, -W, 0, 0.1, { frontOnly: true }));
  solids.push(box('parapet', 'facade', facade.left, facade.right, roof, roof + 0.9, -W, 0, 0.05, { frontOnly: true }));
  // slab edges between storeys and plain balconies with straight grilles
  for (let k = 1; k < facade.storeys; k++) {
    const y = facade.groundH + (k - 1) * facade.storeyH;
    solids.push(box(`slab-${k}`, 'facade', facade.left, facade.right, y - 0.12, y + 0.08, 0, 0.18, 0.08));
    solids.push(box(`balcony-${k}`, 'facade', facade.left + 0.9, facade.left + 3.9, y + 0.08, y + 1.0, 0, 0.9, 0.06));
  }
  // guide rails of the shutter and the blank glowing signboard (dimmer than the band under the shutter)
  solids.push(box('guide-left', 'fixture', -half - 0.06, -half, 0, frontage.lintel, 0, 0.08, 0.2));
  solids.push(box('guide-right', 'fixture', half, half + 0.06, 0, frontage.lintel, 0, 0.08, 0.2));
  // the shutter's hood over the opening: the barrel and the wound slats live inside it (shutter.ts)
  solids.push(box('hood', 'fixture', -half - 0.12, half + 0.12, frontage.lintel - 0.02, frontage.lintel + 0.34, 0, 0.36, 0.18));
  // the blank signboard sits on the facade above the hood, dimmer than the band under the shutter
  panels.push({ id: 'sign', c: [0, 2.97, 0.02], w: frontage.width + 0.2, h: 0.36, rotY: 0, tone: 2 });
  // four of twenty windows lit (plate 2)
  const winLit = new Set([3, 8, 14, 17]);
  for (let k = 0; k < 20; k++) {
    const storey = 1 + Math.floor(k / 4), col = k % 4;
    const x = facade.left + 1.2 + col * ((facade.right - facade.left - 2.4) / 3);
    const y = facade.groundH + (storey - 1) * facade.storeyH + 1.5;
    panels.push({ id: `win-${k}`, c: [x, y, 0.02], w: 1.1, h: 1.2, rotY: 0, tone: winLit.has(k) ? 4 : 0 });
  }

  /* the left neighbour, a six-storey building with its own shop, shutter half down, light under it */
  const nl = facade.left - 9.5;
  solids.push(box('nbrL-pier-a', 'street', nl, -10.6, 0, C, -W, 0, 0.12));
  solids.push(box('nbrL-pier-b', 'street', -7.4, facade.left, 0, C, -W, 0, 0.12));
  solids.push(box('nbrL-lintel', 'street', -10.6, -7.4, 2.4, C, -W, 0, 0.12));
  solids.push(box('nbrL-shutter', 'street', -10.6, -7.4, 1.05, 2.4, 0, 0.05, 0.12));
  solids.push(box('nbrL-upper', 'street', nl, facade.left, C, roof - 1.0, -W, 0, 0.06, { frontOnly: true }));
  panels.push({ id: 'nbrL-band', c: [-9.0, 0.52, 0.01], w: 3.2, h: 1.04, rotY: 0, tone: 3 });
  panels.push({ id: 'nbrL-sign', c: [-9.0, 2.7, 0.02], w: 3.0, h: 0.42, rotY: 0, tone: 2 });
  panels.push({ id: 'nbrL-win', c: [-12.5, 7.8, 0.02], w: 1.1, h: 1.2, rotY: 0, tone: 4 });
  solids.push(box('row-left', 'street', -40, nl, 0, 14.3, -W, 0, 0.05, { frontOnly: true }));
  lights.push({ id: 'nbrL-band', at: [-9.0, 0.4, 0.6], intensity: 0.55, radius: 1.3, scope: 'outside' });

  /* the lane bends away to the right beyond the owner's building (direction row 1: the lane alive to the right) */
  const bend: Vec3 = [facade.right, 0, 0];
  const bd = spec.lane.bendDeg;
  const fw = 0.3;
  // building A: the neighbour's shop, shutter half down with a band of light under it
  solids.push(lineBox('laneA-a', 'street', bend, bd, -0.3, 4.0, -fw, 0, 0, C, 0.12));
  solids.push(lineBox('laneA-b', 'street', bend, bd, 7.0, 11.0, -fw, 0, 0, C, 0.12));
  solids.push(lineBox('laneA-lintel', 'street', bend, bd, 4.0, 7.0, -fw, 0, 2.4, C, 0.12));
  solids.push(lineBox('laneA-shutter', 'street', bend, bd, 4.0, 7.0, 0, 0.05, 0.95, 2.4, 0.14));
  solids.push(lineBox('laneA-upper', 'street', bend, bd, -0.3, 11.0, -fw, 0, C, roof, 0.07, { frontOnly: true }));
  panels.push(linePanel('laneA-band', bend, bd, 5.5, 0.02, 0.475, 3.0, 0.95, 3));
  panels.push(linePanel('laneA-sign', bend, bd, 5.5, 0.03, 2.72, 2.8, 0.42, 3));
  panels.push(linePanel('laneA-win1', bend, bd, 2.0, 0.02, 7.8, 1.1, 1.2, 4));
  panels.push(linePanel('laneA-win2', bend, bd, 8.8, 0.02, 13.8, 1.1, 1.2, 4));
  lights.push({ id: 'laneA-band', at: (() => { const p = linePanel('x', bend, bd, 5.5, 0.9, 0.3, 0, 0, 0).c; return p; })(), intensity: 0.6, radius: 1.5, scope: 'outside' });
  // building B, five storeys, with the tea stall under a small tin awning in front
  solids.push(lineBox('laneB', 'street', bend, bd, 11.0, 21.0, -fw, 0, 0, roof - 3.0, 0.08, { frontOnly: true }));
  solids.push(lineBox('tea-counter', 'furniture', bend, bd, 13.2, 14.8, 0.2, 1.0, 0, 0.95, 0.14));
  solids.push(lineBox('tea-awning', 'fixture', bend, bd, 12.9, 15.1, 0, 1.5, 2.25, 2.33, 0.1));
  solids.push(lineBox('tea-post', 'fixture', bend, bd, 15.0, 15.08, 1.42, 1.5, 0, 2.25, 0.1));
  panels.push(linePanel('tea-glow', bend, bd, 14.0, 0.05, 1.5, 1.4, 1.0, 3));
  lights.push({ id: 'tea', at: (() => linePanel('x', bend, bd, 14.0, 0.8, 2.05, 0, 0, 0).c)(), intensity: 0.7, radius: 1.4, scope: 'outside' });
  // building C and the far parked rickshaw, hood up, a silhouette in the tea stall's light
  solids.push(lineBox('laneC', 'street', bend, bd, 21.0, 36.0, -fw, 0, 0, roof, 0.05, { frontOnly: true }));
  solids.push(lineBox('rickshaw-hood', 'street', bend, bd, 25.0, 26.1, 2.2, 3.0, 0.9, 2.0, 0.02));
  solids.push(lineBox('rickshaw-seat', 'street', bend, bd, 24.6, 26.4, 2.25, 2.95, 0.3, 0.9, 0.02));
  // the far side of the bent lane (mostly out of frame; kept so the lane has two sides)
  solids.push(lineBox('laneFar', 'street', bend, bd, -2.0, 36.0, spec.lane.roadWidth + 3.0, spec.lane.roadWidth + 3.3, 0, 12.0, 0.03));
  // the concrete pole at the bend with its lamp head on an arm, and a small pool on dry paving
  const pole = linePanel('x', bend, bd, 3.0, 1.1, 0, 0, 0, 0).c;
  solids.push(box('pole', 'fixture', pole[0] - 0.09, pole[0] + 0.09, 0, 6.6, pole[2] - 0.09, pole[2] + 0.09, 0.12));
  solids.push(box('pole-arm', 'fixture', pole[0] - 0.7, pole[0] + 0.05, 6.2, 6.28, pole[2] - 0.04, pole[2] + 0.04, 0.12));
  panels.push({ id: 'pole-head', c: [pole[0] - 0.62, 6.12, pole[2]], w: 0.34, h: 0.12, rotY: 0, tone: 4 });
  lights.push({ id: 'streetlamp', at: [pole[0] - 0.62, 6.0, pole[2]], intensity: 0.5, radius: 3.2, scope: 'outside' });
  // one overhead cable crossing high (a thin box)
  solids.push(box('cable', 'fixture', -8, 8, 7.4, 7.43, 1.8, 1.83, 0.05, { occludes: false }));

  /* the lane across from the shop, behind the landing camera */
  solids.push(box('row-opposite', 'street', -40, 1.0, 0, 16.0, apron.depth + spec.lane.roadWidth + 1.5, apron.depth + spec.lane.roadWidth + 1.8, 0.03));

  /* floors: the owner's apron and the pavement, the road, the interior tiles */
  floors.push({ id: 'pavement', x0: -40, x1: facade.right + 0.4, z0: 0, z1: apron.depth, y: 0, base: 0.1 });
  floors.push({ id: 'road', x0: -40, x1: 40, z0: apron.depth, z1: apron.depth + spec.lane.roadWidth + 1.8, y: -0.15, base: 0.04 });
  floors.push({ id: 'lane-bent', x0: 0, x1: 38, z0: 0, z1: spec.lane.roadWidth + 3.0, y: -0.15, rotY: bd, pivot: bend, base: 0.04 });
  floors.push({ id: 'tiles', x0: inside.left, x1: inside.right, z0: -inside.depth, z1: 0, y: 0, base: 0.02 });

  /* the room: walls rise only to the ceiling line; above it, open night */
  const L = inside.left, R = inside.right, D = -inside.depth;
  solids.push(box('front-wall-far', 'wall', L, facade.left, 0, C, -W, 0, 0.1));
  solids.push(box('wall-right', 'wall', R, R + W, 0, C, D, 0, 0.1));
  solids.push(box('wall-back', 'wall', L - W, R + W, 0, C, D - W, D, 0.1));
  // the long left wall with five plain doorways, each onto a back room with a little warm light in it
  const doors = [-8.5, -12.0, -15.5, -19.0, -22.5];
  let zPrev = 0;
  doors.forEach((zc, i) => {
    solids.push(box(`wall-left-${i}`, 'wall', L - W, L, 0, C, zc + 0.55, zPrev, 0.1));
    solids.push(box(`door-head-${i}`, 'wall', L - W, L, 2.1, C, zc - 0.55, zc + 0.55, 0.1));
    panels.push({ id: `backroom-${i}`, c: [L - 1.4, 1.05, zc], w: 1.1, h: 2.1, rotY: 90, tone: 2 });
    // the warm spill from each back room falls off across the tiles (plate 6)
    lights.push({ id: `backroom-${i}`, at: [L + 0.35, 1.3, zc], intensity: 0.6, radius: 1.3, scope: 'inside' });
    zPrev = zc - 0.55;
  });
  solids.push(box('wall-left-end', 'wall', L - W, L, 0, C, D, zPrev, 0.1));

  // the ceiling line: a cornice round the walls and two beams along the length, and nothing above
  const bw = ceiling.beamWidth, bdp = ceiling.beamDepth;
  solids.push(box('cornice-front', 'cornice', L, R, C - 0.2, C, -W - 0.2, -W, 0.14));
  solids.push(box('cornice-left', 'cornice', L, L + 0.2, C - 0.2, C, D, -W, 0.14));
  solids.push(box('cornice-right', 'cornice', R - 0.2, R, C - 0.2, C, D, -W, 0.14));
  solids.push(box('cornice-back', 'cornice', L, R, C - 0.2, C, D, D + 0.2, 0.14));
  ceiling.beamsX.forEach((x, i) => solids.push(box(`beam-${i}`, 'beam', x - bw / 2, x + bw / 2, C - bdp, C, D, -W, 0.16)));

  // the front room seen from the lane: shelved partition on the right, fabric faced edge-on in value order
  const pz = frontRoom.partitionZ;
  // a shelving divider, not a full wall: it stops at 2.3m so nothing but the beams ever crosses the sky
  solids.push(box('partition', 'partition', frontRoom.partitionFromX, R, 0, 2.3, pz - 0.15, pz, 0.12));
  for (let k = 0; k < 4; k++) {
    const y0 = 0.35 + k * 0.48;
    solids.push(box(`shelf-${k}`, 'shelf', frontRoom.partitionFromX + 0.1, R - 0.1, y0, y0 + 0.04, pz, pz + 0.35, 0.2));
    for (let j = 0; j < 10; j++) {
      const x0 = frontRoom.partitionFromX + 0.2 + j * 0.37;
      solids.push(box(`fabric-${k}-${j}`, 'shelf', x0, x0 + 0.3, y0 + 0.04, y0 + 0.3, pz + 0.04, pz + 0.32, 0.08 + 0.03 * ((j + k) % 4)));
    }
  }
  // the desk counter with its glass top, lit by one warm pendant from the beam
  const [cx, , cz] = counter.at;
  solids.push(box('desk', 'furniture', cx - counter.length / 2, cx + counter.length / 2, 0, counter.height - 0.04, cz - counter.depth / 2, cz + counter.depth / 2, 0.14));
  solids.push(box('desk-glass', 'furniture', cx - counter.length / 2 - 0.02, cx + counter.length / 2 + 0.02, counter.height - 0.04, counter.height, cz - counter.depth / 2 - 0.02, cz + counter.depth / 2 + 0.02, 0.22));
  const lampAt: Vec3 = [cx + 0.15, 2.12, cz];
  solids.push(box('pendant-cord', 'fixture', lampAt[0] - 0.01, lampAt[0] + 0.01, lampAt[1] + 0.1, C - bdp, cz - 0.01, cz + 0.01, 0.1, { occludes: false }));
  solids.push(box('pendant-shade', 'fixture', lampAt[0] - 0.16, lampAt[0] + 0.16, lampAt[1], lampAt[1] + 0.12, cz - 0.16, cz + 0.16, 0.1));
  panels.push({ id: 'pendant-bulb', c: [lampAt[0], lampAt[1] - 0.01, cz], w: 0.12, h: 0.06, rotY: 0, tone: 4 });
  lights.push({ id: 'pendant', at: [lampAt[0], lampAt[1] - 0.06, cz], intensity: 1.9, radius: 1.55, scope: 'inside', down: true });
  // the front room's own pendant: the room the lane sees under the shutter (direction plate 1)
  const frontLamp: Vec3 = [0.55, 2.15, -1.05];
  solids.push(box('front-cord', 'fixture', frontLamp[0] - 0.01, frontLamp[0] + 0.01, frontLamp[1] + 0.12, C, frontLamp[2] - 0.01, frontLamp[2] + 0.01, 0.1, { occludes: false }));
  solids.push(box('front-shade', 'fixture', frontLamp[0] - 0.16, frontLamp[0] + 0.16, frontLamp[1], frontLamp[1] + 0.12, frontLamp[2] - 0.16, frontLamp[2] + 0.16, 0.1));
  panels.push({ id: 'front-bulb', c: [frontLamp[0], frontLamp[1] - 0.01, frontLamp[2]], w: 0.12, h: 0.06, rotY: 0, tone: 4 });
  lights.push({ id: 'front-pendant', at: [frontLamp[0], frontLamp[1] - 0.06, frontLamp[2]], intensity: 2.2, radius: 1.9, scope: 'inside', down: true });
  // the packing table along the right wall, courier parcels on it; the garment rail of eight pieces in front of the shelves
  solids.push(box('packing', 'furniture', R - 0.75, R - 0.05, 0, 0.8, -1.95, -0.95, 0.14));
  for (let k = 0; k < 3; k++) {
    const z0 = -1.85 + k * 0.32;
    solids.push(box(`parcel-${k}`, 'furniture', R - 0.62, R - 0.2, 0.8, 0.98, z0, z0 + 0.27, 0.2));
  }
  solids.push(box('rail-post-a', 'fixture', 0.15, 0.19, 0, 1.62, -1.72, -1.68, 0.14));
  solids.push(box('rail-post-b', 'fixture', 1.45, 1.49, 0, 1.62, -1.72, -1.68, 0.14));
  solids.push(box('rail-bar', 'fixture', 0.15, 1.49, 1.58, 1.62, -1.72, -1.68, 0.14));
  for (let k = 0; k < 8; k++) {
    const x0 = 0.24 + k * 0.155;
    solids.push(box(`garment-${k}`, 'furniture', x0, x0 + 0.05, 0.6, 1.56, -1.95, -1.45, 0.12 + 0.02 * (k % 3)));
  }
  solids.push(box('mirror', 'fixture', R - 0.06, R, 0.1, 1.95, -0.95, -0.4, 0.26));
  solids.push(box('ringlight-stand', 'fixture', 2.18, 2.22, 0, 1.45, -0.42, -0.38, 0.1));
  solids.push(box('ringlight', 'fixture', 2.0, 2.4, 1.45, 1.85, -0.41, -0.39, 0.06));
  // the seating corner at the desk's end: a low glass table and five upright chairs
  solids.push(box('low-table', 'furniture', -5.4, -4.4, 0, 0.45, -1.35, -0.75, 0.14));
  const chairs: Array<[number, number]> = [[-5.8, -1.05], [-4.0, -1.05], [-5.2, -1.75], [-4.6, -1.75], [-4.9, -0.45]];
  chairs.forEach(([x, z], i) => {
    solids.push(box(`chair-${i}`, 'furniture', x - 0.22, x + 0.22, 0, 0.46, z - 0.22, z + 0.22, 0.12));
    solids.push(box(`chair-back-${i}`, 'furniture', x - 0.22, x + 0.22, 0.46, 0.95, z - 0.24, z - 0.2, 0.12));
  });
  // the deep premises: freestanding bays of folded fabric, side-on, overlapping toward the right
  const bays: Array<[number, number]> = [
    [-3.3, -3.9], [-5.3, -4.9], [-4.2, -6.4], [-6.3, -7.6], [-2.4, -8.2],
    [-5.0, -10.0], [-0.9, -10.6], [-3.4, -12.0], [-6.1, -13.2], [-1.8, -14.6], [-4.4, -16.2],
  ];
  bays.forEach(([x, z], i) => solids.push(box(`bay-${i}`, 'bay', x - 0.55, x + 0.55, 0, 2.05, z - 0.55, z + 0.55, 0.12)));

  // a shelf run standing square to the lane: from the kerb at the reveal, its face closes the one long run
  // of floor the open shutter would show, so the eye counts layers instead of following a length
  solids.push(box('bay-run', 'bay', -3.0, -0.6, 0, 2.05, -5.75, -5.25, 0.12));
  solids.push(box('display-a', 'furniture', -3.7, -2.5, 0, 0.72, -4.9, -4.3, 0.14));
  solids.push(box('display-b', 'furniture', -3.2, -2.0, 0, 0.72, -6.3, -5.6, 0.12));

  // part one's sky: the eight real homes (sky.ts); laws 4 and 5 judge exactly these
  const lamps: LampHome[] = WHY_LAMPS.map((l) => ({ id: l.id, at: l.at, lead: l.lead, why: true, waiting: false }));
  return { spec, solids, panels, floors, lights, lamps };
}

/* ---------- ray casting against boxes (turned about y) ---------- */
export interface Hit { t: number; solid: Solid }

function toLocal(p: Vec3, s: Solid): Vec3 {
  const d = sub(p, s.c);
  if (!s.rotY) return d;
  const r = deg(s.rotY);
  // local x axis = (cos, 0, -sin), local z axis = (sin, 0, cos)
  return [d[0] * Math.cos(r) - d[2] * Math.sin(r), d[1], d[0] * Math.sin(r) + d[2] * Math.cos(r)];
}
function dirLocal(v: Vec3, s: Solid): Vec3 {
  if (!s.rotY) return v;
  const r = deg(s.rotY);
  return [v[0] * Math.cos(r) - v[2] * Math.sin(r), v[1], v[0] * Math.sin(r) + v[2] * Math.cos(r)];
}

export function rayBox(o: Vec3, d: Vec3, s: Solid): number {
  const lo = toLocal(o, s), ld = dirLocal(d, s);
  let tmin = -Infinity, tmax = Infinity;
  for (let a = 0; a < 3; a++) {
    const h = s.s[a] / 2;
    if (Math.abs(ld[a]) < 1e-12) {
      if (lo[a] < -h || lo[a] > h) return Infinity;
    } else {
      let t1 = (-h - lo[a]) / ld[a], t2 = (h - lo[a]) / ld[a];
      if (t1 > t2) [t1, t2] = [t2, t1];
      tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
      if (tmin > tmax) return Infinity;
    }
  }
  if (tmax < 0) return Infinity;
  return tmin >= 0 ? tmin : 0; // origin inside counts as a hit at 0
}

export function raycast(o: Vec3, d: Vec3, solids: Solid[], maxT = Infinity, filter?: (s: Solid) => boolean): Hit | null {
  let best: Hit | null = null;
  for (const s of solids) {
    if (!s.occludes || (filter && !filter(s))) continue;
    const t = rayBox(o, d, s);
    if (t < maxT && (!best || t < best.t)) best = { t, solid: s };
  }
  return best;
}

/** distance from a point to a box's surface (0 inside) */
export function pointBoxDist(p: Vec3, s: Solid): number {
  const l = toLocal(p, s);
  let q = 0;
  for (let a = 0; a < 3; a++) {
    const e = Math.abs(l[a]) - s.s[a] / 2;
    if (e > 0) q += e * e;
  }
  return Math.sqrt(q);
}

/** the premises: interior plus the owner's apron, shutter line to kerb; the street beyond is seen, never entered */
export function inPremises(spec: PremisesSpec, p: Vec3): 'interior' | 'apron' | null {
  const [x, y, z] = p;
  if (y < 0 || y > spec.ceiling.height) return null;
  if (x >= spec.inside.left && x <= spec.inside.right && z <= 0 && z >= -spec.inside.depth) return 'interior';
  if (x >= spec.apron.left && x <= spec.apron.right && z >= 0 && z <= spec.apron.depth) return 'apron';
  return null;
}

/** the shutter as a solid at a given height of its bottom edge (placeholder for slice two's slatted shutter) */
export function shutterSolid(spec: PremisesSpec, bottom: number): Solid | null {
  const half = spec.frontage.width / 2;
  const top = spec.frontage.lintel;
  if (bottom >= top - 1e-3) return null;
  return box('shutter', 'shutter', -half, half, bottom, top, 0, 0.05, 0.2);
}
