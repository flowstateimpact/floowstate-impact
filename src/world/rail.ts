/*
 * rail.ts · the camera as a pure function of scroll (engine plan 3.1, direction section 2).
 *
 * rail(railId, s) takes the scroll position in vh from the top of the page and returns the camera
 * pose and the state of the world at that point. Nothing here reads the clock, the DOM or three.js,
 * so the same scroll position always gives the same frame, forward or back, and scripts/rail-lint.mjs
 * checks exactly what the page shows.
 *
 * Each section is travel then dwell: the first 30 percent of its scroll (at least 40vh) is travel on
 * PULL, straight and taut, no overshoot; the rest is a held drift, eased so it starts and ends at rest.
 */
import type { MarkId, PremisesSpec, Vec3 } from './premises.ts';
import { add, deg, scale } from './world.ts';
import { STATIONS, type Knot, type RailId, type Station } from './stations.ts';

export interface Pose {
  pos: Vec3;
  /** world yaw in degrees, 0 looks into the shop (-z), positive turns left */
  yaw: number;
  /** degrees, positive looks up */
  pitch: number;
  /** vertical field of view in degrees at the rail's reference aspect */
  fov: number;
}

export interface RailState {
  s: number;
  station: Station['id'];
  index: number;
  /** progress through the whole section, 0..1 */
  t: number;
  phase: 'travel' | 'dwell';
  /** progress through the current phase, 0..1 */
  u: number;
  pose: Pose;
  /** height of the shutter's bottom edge (placeholder for slice two's slatted shutter) */
  shutter: number;
  owner: { at: Vec3; mark: MarkId };
}

/* ---------- the motion language's curves ---------- */
/** PULL: taut travel, zero speed at both ends, never past the target */
export const pull = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** the held drift: a slow sine ease, starts and ends at rest */
export const drift = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);
/** CUT: fast start, dead stop, no bounce (the spring finishing the shutter) */
export const cut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t) * (1 - t));

/** drawings in one hand-led shutter move (pull down, or lift to chest) */
export const HAND_DRAWINGS = 8;

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** a knot is stored relative to the owner's mark: right, height above the floor, behind, in the mark's own frame */
export function knotPose(spec: PremisesSpec, k: Knot): Pose {
  const m = spec.marks[k.anchor];
  if (!m) throw new Error(`rail: mark ${k.anchor} is not defined for ${spec.category}`);
  const f = deg(m.facing);
  const right: Vec3 = [Math.cos(f), 0, -Math.sin(f)];
  const behind: Vec3 = [Math.sin(f), 0, Math.cos(f)];
  const p = add(add(m.at, scale(right, k.right)), scale(behind, k.behind));
  return { pos: [p[0], k.height, p[2]], yaw: k.yaw, pitch: k.pitch, fov: k.fov };
}

function mixPose(a: Pose, b: Pose, t: number): Pose {
  return { pos: lerp3(a.pos, b.pos, t), yaw: lerp(a.yaw, b.yaw, t), pitch: lerp(a.pitch, b.pitch, t), fov: lerp(a.fov, b.fov, t) };
}

/** a channel through its own keys [u, value], PULL between each pair, holding before the first and after the last */
function keyed(from: number, to: number, u: number, keys?: Array<[number, number]>): number {
  const ks: Array<[number, number]> = [[0, from], ...(keys ?? []), [1, to]];
  for (let i = 1; i < ks.length; i++) {
    const [u0, v0] = ks[i - 1], [u1, v1] = ks[i];
    if (u <= u1) return u1 <= u0 ? v1 : lerp(v0, v1, pull(clamp01((u - u0) / (u1 - u0))));
  }
  return to;
}

/** travel with each channel on its own timing (turn first, hold for the spring, then move), each on PULL */
function travelPose(a: Pose, b: Pose, u: number, st: Station, railId: RailId): Pose {
  const tp = pull(clamp01(st.spans?.pos ? (u - st.spans.pos[0]) / (st.spans.pos[1] - st.spans.pos[0]) : u));
  const keys = st.railKeys?.[railId] ?? st.keys;
  const yaw = keyed(a.yaw, b.yaw, u, keys?.yaw);
  const pitch = keyed(a.pitch, b.pitch, u, keys?.pitch);
  const fov = keyed(a.fov, b.fov, u, keys?.fov);
  return { pos: lerp3(a.pos, b.pos, tp), yaw, pitch, fov };
}

export interface Layout {
  rail: RailId;
  total: number;
  sections: Array<{ station: Station; start: number; len: number; travel: number }>;
}

export function layout(rail: RailId, stations: Station[] = STATIONS): Layout {
  let at = 0;
  const sections = stations.map((st) => {
    const len = st.len[rail];
    const travel = st.travel === 'none' ? 0 : Math.max(0.3 * len, 40);
    const sec = { station: st, start: at, len, travel };
    at += len;
    return sec;
  });
  return { rail, total: at, sections };
}

/** piecewise shutter keys over a section's own progress 0..1 */
function shutterAt(keys: Station['shutter'], t: number): number {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t0, h0] = keys[i - 1], [t1, h1, curve] = keys[i];
    if (t <= t1) {
      const k = (t - t0) / Math.max(1e-9, t1 - t0);
      // 'hand': the owner's hand leads and the shutter follows it drawing by drawing (figures on twos): eight drawings
      const e = curve === 'cut' ? cut(k) : curve === 'pull' ? pull(k) : curve === 'hand' ? pull(Math.floor(k * HAND_DRAWINGS) / HAND_DRAWINGS) : k;
      return lerp(h0, h1, e);
    }
  }
  return keys[keys.length - 1][1];
}

export function rail(spec: PremisesSpec, railId: RailId, s: number, lay: Layout = layout(railId)): RailState {
  const sc = Math.min(Math.max(s, 0), lay.total);
  let i = lay.sections.findIndex((x) => sc < x.start + x.len);
  if (i < 0) i = lay.sections.length - 1;
  const sec = lay.sections[i];
  const st = sec.station;
  const local = sc - sec.start;
  const knots = st.knots[railId];
  const arrive = knotPose(spec, knots.arrive);
  const settle = knotPose(spec, knots.settle);

  let pose: Pose, phase: RailState['phase'], u: number;
  if (local < sec.travel) {
    const prev = lay.sections[i - 1];
    const from = prev ? knotPose(spec, prev.station.knots[railId].settle) : arrive;
    u = local / sec.travel;
    pose = travelPose(from, arrive, u, st, railId);
    phase = 'travel';
  } else {
    u = clamp01((local - sec.travel) / Math.max(1e-9, sec.len - sec.travel));
    // the held drift runs over the whole dwell, or settles early and holds (the "why" tilt ends before the first lamp)
    const span = st.dwellSettle ?? 1;
    const t = clamp01(u / span);
    pose = mixPose(arrive, settle, drift(t));
    const dk = st.dwellKeys?.[railId];
    if (dk?.fov) pose.fov = keyed(arrive.fov, settle.fov, t, dk.fov);
    phase = 'dwell';
  }

  // the owner: at the station's mark, or walking between marks during the travel that names a walk
  let ownerAt: Vec3 = spec.marks[st.owner]!.at;
  if (phase === 'travel' && st.walkFrom) {
    // no walk cycle in part one: the owner is at the old mark, then at each step drawing, then (hidden) at the new mark
    const steps = st.walkSteps ?? [];
    if (u < st.walkSpan[0]) ownerAt = spec.marks[st.walkFrom]!.at;
    else if (u < st.walkSpan[1]) {
      const k = Math.min(steps.length - 1, Math.floor(((u - st.walkSpan[0]) / (st.walkSpan[1] - st.walkSpan[0])) * steps.length));
      ownerAt = steps[k] ?? ownerAt;
    }
  }

  return { s: sc, station: st.id, index: i, t: local / sec.len, phase, u, pose, shutter: shutterAt(st.shutter, local / sec.len), owner: { at: ownerAt, mark: st.owner } };
}

/* ---------- projection, shared by the page's camera and the rail check ---------- */
export interface Frame {
  /** width / height of the full frustum */
  aspect: number;
  /** the rail's reference aspect: fov is authored at it */
  refAspect: number;
  /** keep the vertical view below the reference aspect and the horizontal view above it (landscape);
   *  portrait always keeps the horizontal view */
  fit: 'landscape' | 'portrait';
  /** the part of the full frame the world is drawn into, as fractions from the top (phones: 0 to 0.56) */
  window: [number, number];
}

export const LANDSCAPE_REF = 16 / 9;
/** phones: the world is drawn into the top 56 percent of the screen, text in the sheet below (plan 5.5, 10);
 *  the world window is its own camera, so its aspect is width / (0.56 x height) */
export const PHONE_WORLD_SHARE = 0.56;
export const phoneAspect = (w: number, h: number) => w / (PHONE_WORLD_SHARE * h);
export const PORTRAIT_REF = phoneAspect(390, 844);

/** the vertical field of view actually used at this aspect, degrees.
 *  Part one keeps the vertical view on every screen (wider screens see more to the sides), so the owner's
 *  share of the frame's height, which law 6 fixes per station, is the same on every screen. */
export function effectiveFov(fov: number, _fr: Frame): number {
  return fov;
}

/* ---------- the owner's framing (law 6), shared by the rail check and the page's own measurement ---------- */
/** heights on the film's figure, as fractions of its height: shoulder line ty = 0.77h, chest 0.62h (film.mjs bodyEl) */
export const FIG = { shoulder: 0.77, chest: 0.62 };

export function ownerFraming(p: Pose, at: Vec3, h: number, fr: Frame) {
  const P = (y: number) => project(p, [at[0], y, at[2]], fr);
  const feet = P(0), head = P(h), sh = P(h * FIG.shoulder), ch = P(h * FIG.chest);
  const bottom = Math.min(feet.down, 1), top = Math.max(head.down, 0);
  const inFrame = (q: { across: number; down: number; depth: number }) => q.depth > 0 && q.down >= 0 && q.down <= 1 && q.across >= 0 && q.across <= 1;
  return {
    across: (feet.across + head.across) / 2,
    feet: feet.down,
    head: head.down,
    /** the owner's visible share of the frame's height */
    vis: bottom - top,
    bottom,
    headIn: head.depth > 0 && head.down >= 0.02 && head.down <= 1,
    shoulderIn: inFrame(sh),
    chestIn: inFrame(ch),
    behind: feet.depth <= 0 || head.depth <= 0,
  };
}

export function basis(p: Pose) {
  const y = deg(p.yaw), x = deg(p.pitch);
  const f: Vec3 = [-Math.sin(y) * Math.cos(x), Math.sin(x), -Math.cos(y) * Math.cos(x)];
  const r: Vec3 = [Math.cos(y), 0, -Math.sin(y)];
  const u: Vec3 = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  return { f, r, u };
}

/** where a world point lands on screen: across and down as fractions of the world window (0..1 on screen) */
export function project(p: Pose, pt: Vec3, fr: Frame) {
  const { f, r, u } = basis(p);
  const d: Vec3 = [pt[0] - p.pos[0], pt[1] - p.pos[1], pt[2] - p.pos[2]];
  const Z = d[0] * f[0] + d[1] * f[1] + d[2] * f[2];
  const X = d[0] * r[0] + d[1] * r[1] + d[2] * r[2];
  const Y = d[0] * u[0] + d[1] * u[1] + d[2] * u[2];
  const tv = Math.tan(deg(effectiveFov(p.fov, fr)) / 2);
  const th = tv * fr.aspect;
  const nx = X / (Z * th), ny = Y / (Z * tv);
  const downFull = (1 - ny) / 2;
  const [w0, w1] = fr.window;
  return { across: (nx + 1) / 2, down: (downFull - w0) / (w1 - w0), depth: Z };
}
