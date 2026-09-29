#!/usr/bin/env node
/*
 * rail-lint.mjs · the camera laws as a build-failing check (engine plan 3.2, direction section 2).
 *
 * Imports the SAME rail, stations and world the page draws (src/world/*.ts, run by Node's built-in
 * type stripping), samples every rail at every knot and 400 evenly spaced points (plus a dense pass
 * for the laws that need path length), and exits 1 on any breach. `npm run build` runs it first.
 *
 *   node scripts/rail-lint.mjs              check, write the logs, exit 1 on any breach
 *   node scripts/rail-lint.mjs --selftest   break each law on purpose and prove the check catches it
 *
 * Laws: 1 eye height or lower (0.6 to 1.58m) · 2 never past the ceiling line · 3 never outside the
 * premises (interior plus apron, and never inside a solid) · 4 lamp homes inside the footprint, inset
 * 1m, 4 to 24m above the ceiling line · 5 no sky from the street · 6 the owner bottom-left and never
 * small · 7 no tunnel · STAGE never looks down the length (55 degrees or more to the long axis, or
 * faces a wall under 6m away).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FRONT_ROOM } from '../src/world/premises.ts';
import { buildWorld, raycast, pointBoxDist, inPremises, shutterSolid, sub, len, norm, deg } from '../src/world/world.ts';
import { STATIONS } from '../src/world/stations.ts';
import { rail, layout, project, LANDSCAPE_REF, PORTRAIT_REF, phoneAspect } from '../src/world/rail.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs', 'v2', 'rail-lint');
const N = 400;          // evenly spaced samples per rail (plan 3.2)
const DENSE = 4000;     // dense pass for path-length and clearance laws

const EYE_MAX = 1.58, EYE_MIN = 0.6;
const CLEARANCE = 0.15;           // the lens never sits inside or against a solid
const STAGE_MIN_DEG = 55, STAGE_WALL_M = 6;
const TUNNEL_SIDE_M = 1.5, TUNNEL_RUN_M = 2.0;
const WALLISH = new Set(['facade', 'pier', 'lintel', 'wall', 'partition', 'shelf', 'bay', 'shutter', 'street']);

const FRAMES = {
  landscape: { min: 0.22, frames: [16 / 10, 16 / 9, 21 / 9].map((a) => ({ name: a.toFixed(2), aspect: a, refAspect: LANDSCAPE_REF, fit: 'landscape', window: [0, 1] })) },
  portrait: { min: 0.18, frames: [[360, 780], [390, 844], [430, 932], [375, 667]].map(([w, h]) => ({ name: `${w}x${h}`, aspect: phoneAspect(w, h), refAspect: PORTRAIT_REF, fit: 'portrait', window: [0, 1] })) },
};

/* ---------- one full check of a premises + station set ---------- */
export function lint(spec, stations, opts = {}) {
  const world = opts.world ?? buildWorld(spec);
  if (opts.extraLamps) world.lamps.push(...opts.extraLamps);
  if (opts.extraSolids) world.solids.push(...opts.extraSolids);
  const v = [];   // violations
  const logs = {};
  const C = spec.ceiling.height;
  const add = (law, rail, s, station, detail) => v.push({ law, rail, s: +s.toFixed(2), station, detail });

  /* law 4: every lamp home inside the footprint, inset 1m, 4 to 24m above the ceiling line (direction 1b);
     a waiting lamp sits exactly 1m above the ceiling line (direction 3a) */
  const { inside } = spec;
  for (const l of world.lamps) {
    const [x, y, z] = l.at;
    const inFoot = x >= inside.left + 1 && x <= inside.right - 1 && z <= -1 && z >= -inside.depth + 1;
    const hOk = l.waiting ? Math.abs(y - (C + 1)) < 0.01 : y >= C + 4 - 1e-9 && y <= C + 24 + 1e-9;
    if (!inFoot) add('4', '-', 0, '-', `lamp ${l.id} at (${x.toFixed(2)}, ${z.toFixed(2)}) is outside the footprint inset 1m`);
    if (!hOk) add('4', '-', 0, '-', `lamp ${l.id} at ${y.toFixed(2)}m, allowed ${l.waiting ? `${C + 1}m (waiting)` : `${C + 4} to ${C + 24}m`}`);
  }

  for (const railId of ['landscape', 'portrait']) {
    const lay = layout(railId, stations);
    const at = (s) => rail(spec, railId, s, lay);
    // samples: 400 evenly spaced, plus every knot (section start, end of travel, just before the section ends)
    const ss = new Set();
    for (let i = 0; i < N; i++) ss.add((lay.total * i) / (N - 1));
    for (const sec of lay.sections) { ss.add(sec.start); ss.add(sec.start + sec.travel); ss.add(sec.start + sec.len - 1e-6); }
    const samples = [...ss].sort((a, b) => a - b).map(at);
    const even = [];
    for (let i = 0; i < N; i++) even.push(at((lay.total * i) / (N - 1)));
    const dense = [];
    for (let i = 0; i < DENSE; i++) dense.push(at((lay.total * i) / (DENSE - 1)));
    const solidsAt = (st) => { const sh = shutterSolid(spec, st.shutter); return sh ? [...world.solids, sh] : world.solids; };

    /* laws 1, 2, 3 on every sample and the dense pass */
    for (const st of [...samples, ...dense]) {
      const [x, y, z] = st.pose.pos;
      if (y > EYE_MAX + 1e-9) add('1', railId, st.s, st.station, `camera at ${y.toFixed(3)}m, above the owner's eye (${EYE_MAX}m)`);
      if (y < EYE_MIN - 1e-9) add('1', railId, st.s, st.station, `camera at ${y.toFixed(3)}m, below ${EYE_MIN}m`);
      if (y >= C) add('2', railId, st.s, st.station, `camera at ${y.toFixed(3)}m, at or past the ceiling line (${C}m)`);
      const where = inPremises(spec, [x, y, z]);
      if (!where) add('3', railId, st.s, st.station, `camera at (${x.toFixed(2)}, ${z.toFixed(2)}) is outside the interior and the apron`);
      let clear = Infinity, near = null;
      for (const so of solidsAt(st)) { if (!so.occludes) continue; const d = pointBoxDist([x, y, z], so); if (d < clear) { clear = d; near = so.id; } }
      if (clear < CLEARANCE) add('3', railId, st.s, st.station, `lens ${clear.toFixed(3)}m from ${near} (inside or against a solid)`);
    }

    /* law 5: from every apron sample a sight line to each lamp is stopped by the facade, lintel or shutter,
       unless it passes through the owner's open shutter; during the landing and "one", zero lamps are visible */
    const half = spec.frontage.width / 2;
    const zeroIds = new Set(stations.filter((s) => s.zeroLamps).map((s) => s.id));
    for (const st of [...samples, ...dense]) {
      if (inPremises(spec, st.pose.pos) !== 'apron') continue;
      const solids = solidsAt(st);
      for (const l of world.lamps) {
        const d = sub(l.at, st.pose.pos), dist = len(d), dir = norm(d);
        if (raycast(st.pose.pos, dir, solids, dist)) continue;
        const t0 = -st.pose.pos[2] / dir[2];
        const cx = st.pose.pos[0] + dir[0] * t0, cy = st.pose.pos[1] + dir[1] * t0;
        const throughShutter = Math.abs(cx) <= half && cy < st.shutter && cy >= 0;
        if (zeroIds.has(st.station)) add('5', railId, st.s, st.station, `lamp ${l.id} visible during a zero-lamp station (crosses the shutter line at x ${cx.toFixed(2)}, y ${cy.toFixed(2)})`);
        else if (!throughShutter) add('5', railId, st.s, st.station, `lamp ${l.id} visible from the lane over or beside the building (crosses at x ${cx.toFixed(2)}, y ${cy.toFixed(2)})`);
      }
    }

    /* law 6 (placeholder mark): at every dwell sample the owner is bottom-left and never small */
    const cfg = FRAMES[railId];
    const dwell = samples.filter((x) => x.phase === 'dwell');
    for (const sec of lay.sections) for (let k = 0; k <= 24; k++) dwell.push(at(sec.start + sec.travel + ((sec.len - sec.travel - 1e-6) * k) / 24));
    const l6 = [];
    for (const st of dwell) {
      for (const fr of cfg.frames) {
        const o = st.owner.at;
        const feet = project(st.pose, [o[0], 0, o[2]], fr), head = project(st.pose, [o[0], spec.owner.height, o[2]], fr);
        const bottom = Math.min(feet.down, 1), top = Math.max(head.down, 0);
        const vis = bottom - top, across = (feet.across + head.across) / 2;
        const fails = [];
        if (feet.depth <= 0 || head.depth <= 0) fails.push('behind the camera');
        if (head.down < 0.02 || head.down > 1) fails.push(`head cut (at ${(head.down * 100).toFixed(1)}% down)`);
        if (bottom < 0.72) fails.push(`feet at ${(feet.down * 100).toFixed(1)}% down, need 72% or lower in frame`);
        if (across < 0.04 || across > 0.34) fails.push(`${(across * 100).toFixed(1)}% across, need 4 to 34%`);
        if (vis < cfg.min) fails.push(`${(vis * 100).toFixed(1)}% of the frame tall, need ${cfg.min * 100}%`);
        if (fails.length) add('6', railId, st.s, st.station, `at ${fr.name}: ${fails.join('; ')}`);
        l6.push({ station: st.station, frame: fr.name, across, feet: feet.down, head: head.down, vis });
      }
    }

    /* law 7: no stretch where geometry sits within 1.5m of the lens on both sides for more than 2m of travel.
       "Both sides" is checked two ways, and either one encloses: across the view, and across the direction of
       travel (a camera crabbing sideways between two walls is in a tunnel even while it looks at one of them). */
    let run = 0, runStart = null, worst = 0, prev = null;
    const bothSides = (pos, side, solids) => !!raycast(pos, side, solids, TUNNEL_SIDE_M + 1e-9) && !!raycast(pos, [-side[0], 0, -side[2]], solids, TUNNEL_SIDE_M + 1e-9);
    for (let i = 0; i < dense.length; i++) {
      const st = dense[i];
      const yw = deg(st.pose.yaw);
      const solids = solidsAt(st);
      let enclosed = bothSides(st.pose.pos, [Math.cos(yw), 0, -Math.sin(yw)], solids);
      const nb = dense[Math.min(i + 1, dense.length - 1)], pb = dense[Math.max(i - 1, 0)];
      const mv = [nb.pose.pos[0] - pb.pose.pos[0], 0, nb.pose.pos[2] - pb.pose.pos[2]];
      if (!enclosed && Math.hypot(mv[0], mv[2]) > 1e-6) { const m = norm(mv); enclosed = bothSides(st.pose.pos, [-m[2], 0, m[0]], solids); }
      if (enclosed && prev) { run += len(sub(st.pose.pos, prev.pose.pos)); runStart ??= prev; }
      else if (!enclosed) { run = 0; runStart = null; }
      if (run > worst) worst = run;
      if (run > TUNNEL_RUN_M) { add('7', railId, st.s, st.station, `enclosed on both sides for ${run.toFixed(2)}m of travel since s=${runStart.s.toFixed(1)}vh`); run = -Infinity; }
      prev = st;
    }

    /* STAGE (direction section 2): looks across at 55 degrees or more to the long axis, or faces a wall under 6m.
       Logged every sample: the angle and the floor ahead of the lens (distance to what the level gaze meets). */
    const stageRow = (st) => {
      const yw = deg(st.pose.yaw);
      const h = [-Math.sin(yw), 0, -Math.cos(yw)];
      const angle = (Math.acos(Math.min(1, Math.abs(h[2]))) * 180) / Math.PI;
      // the level gaze passes over or through furniture to the first wall it meets
      const wall = raycast(st.pose.pos, h, solidsAt(st), 200, (so) => WALLISH.has(so.kind));
      return { angle, ahead: wall ? wall.t : Infinity, surface: wall ? wall.solid.id : 'none', ok: angle >= STAGE_MIN_DEG || (!!wall && wall.t <= STAGE_WALL_M) };
    };
    for (const st of [...samples, ...dense]) {
      const r = stageRow(st);
      if (!r.ok) add('STAGE', railId, st.s, st.station, `gaze ${r.angle.toFixed(1)} degrees to the long axis and the floor runs ${Number.isFinite(r.ahead) ? r.ahead.toFixed(2) + 'm to ' + r.surface : 'on'}`);
    }

    // the log: 400 evenly spaced samples (height, pose, stage angle, floor ahead)
    logs[railId] = {
      total: lay.total, worstTunnelRun: worst,
      rows: even.map((st) => ({ st, stage: stageRow(st) })),
      l6,
      heights: even.map((st) => st.pose.pos[1]),
      sections: lay.sections.map((x) => ({ id: x.station.id, start: x.start, len: x.len, travel: x.travel })),
    };
  }
  return { violations: v, logs, world };
}

/* ---------- reporting ---------- */
const LAWS = ['1', '2', '3', '4', '5', '6', '7', 'STAGE'];
const LAW_NAME = {
  1: 'eye height or lower (0.6 to 1.58m)', 2: 'never past the ceiling line', 3: 'never outside the premises, never inside a solid',
  4: 'lamp homes in the footprint, 4 to 24m up', 5: 'no sky from the street', 6: 'owner bottom-left, never small (placeholder mark)',
  7: 'no tunnel', STAGE: 'stage law: never down the length',
};

function writeLogs(res) {
  mkdirSync(OUT, { recursive: true });
  const f = (n, d = 3) => (Number.isFinite(n) ? n.toFixed(d) : 'inf');
  const summary = { note: 'Deterministic: the same code gives the same file. Written by scripts/rail-lint.mjs.', rails: {} };
  for (const [railId, lg] of Object.entries(res.logs)) {
    const head = 'i,s_vh,station,phase,x,y_height,z,yaw,pitch,fov,shutter_bottom,stage_angle_deg,wall_ahead_m,gaze_meets_wall';
    const rows = lg.rows.map(({ st, stage }, i) => [i, f(st.s, 2), st.station, st.phase, f(st.pose.pos[0]), f(st.pose.pos[1], 4), f(st.pose.pos[2]), f(st.pose.yaw, 2), f(st.pose.pitch, 2), f(st.pose.fov, 2), f(st.shutter), f(stage.angle, 1), f(stage.ahead, 2), stage.surface].join(','));
    writeFileSync(join(OUT, `${railId}-400.csv`), [head, ...rows].join('\n') + '\n');
    const h = lg.heights;
    const byStation = {};
    for (const r of lg.l6) {
      const b = (byStation[`${r.station} @ ${r.frame}`] ??= { acrossMin: 1, acrossMax: 0, visMin: 9, feetMin: 9, headMin: 9 });
      b.acrossMin = Math.min(b.acrossMin, r.across); b.acrossMax = Math.max(b.acrossMax, r.across);
      b.visMin = Math.min(b.visMin, r.vis); b.feetMin = Math.min(b.feetMin, r.feet); b.headMin = Math.min(b.headMin, r.head);
    }
    summary.rails[railId] = {
      totalVh: lg.total, sections: lg.sections, samples: h.length,
      heightMax: +Math.max(...h).toFixed(4), heightMin: +Math.min(...h).toFixed(4),
      stageAngleMinWhereNoWall: +Math.min(...lg.rows.filter((r) => !(Number.isFinite(r.stage.ahead) && r.stage.ahead <= STAGE_WALL_M)).map((r) => r.stage.angle)).toFixed(1),
      worstTunnelRunM: +lg.worstTunnelRun.toFixed(2),
      ownerAtDwell: Object.fromEntries(Object.entries(byStation).map(([k, b]) => [k, `across ${(b.acrossMin * 100).toFixed(0)}-${(b.acrossMax * 100).toFixed(0)}%, feet from ${(b.feetMin * 100).toFixed(0)}% down, head from ${(b.headMin * 100).toFixed(0)}% down, at least ${(b.visMin * 100).toFixed(0)}% tall`])),
    };
  }
  summary.violationsPerLaw = Object.fromEntries(LAWS.map((l) => [l, res.violations.filter((x) => x.law === l).length]));
  writeFileSync(join(OUT, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  return summary;
}

function report(res, summary) {
  const out = [];
  out.push('rail-lint · direction B, slice one (hero, one, 2a, why) · front-room premises');
  for (const [railId, s] of Object.entries(summary.rails)) {
    out.push(`  ${railId.padEnd(9)} ${s.totalVh}vh · ${s.samples} even samples + knots + ${DENSE} dense · height ${s.heightMin.toFixed(3)} to ${s.heightMax.toFixed(3)}m · worst enclosed run ${s.worstTunnelRunM}m`);
  }
  for (const l of LAWS) {
    const perRail = ['landscape', 'portrait'].map((r) => res.violations.filter((x) => x.law === l && (x.rail === r || x.rail === '-')).length);
    out.push(`  law ${l.padEnd(5)} ${LAW_NAME[l].padEnd(52)} landscape ${String(perRail[0]).padStart(3)} · portrait ${String(perRail[1]).padStart(3)}`);
  }
  out.push('  waits for later slices: law 4 real sky placement (slice three) · law 5 blob count on the contact frame (contact is not built) ·');
  out.push('    law 6 against directors and opened workers, and the brightest-person check (owner module, slice four) · laws 8 to 10 (not in this slice)');
  if (res.violations.length) {
    out.push(`  FAIL: ${res.violations.length} breach(es). First ten:`);
    for (const x of res.violations.slice(0, 10)) out.push(`    law ${x.law} · ${x.rail} · s=${x.s}vh · ${x.station} · ${x.detail}`);
  } else out.push('  PASS: zero breaches on every rail.');
  out.push(`  log: ${join('docs', 'v2', 'rail-lint')}/{landscape-400.csv, portrait-400.csv, summary.json}`);
  return out.join('\n');
}

/* ---------- self-test: break each law on purpose; the check must catch every one ---------- */
function selftest() {
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const set = (stations, id, rail, which, patch) => { const s = clone(stations); const st = s.find((x) => x.id === id); Object.assign(st.knots[rail][which], patch); return s; };
  const M1 = FRONT_ROOM.marks.M1.at;
  const cases = [
    { law: '1', name: 'camera forced to 1.60m at "why"', stations: set(STATIONS, 'why', 'landscape', 'settle', { height: 1.6 }) },
    { law: '1', name: 'camera dropped to 0.5m at the landing', stations: set(STATIONS, 'hero', 'portrait', 'arrive', { height: 0.5 }) },
    { law: '3', name: 'landing pulled back into the road', stations: set(STATIONS, 'hero', 'landscape', 'arrive', { behind: 4.6 }) },
    { law: '4', name: 'a lamp 2m above the ceiling line', opts: { extraLamps: [{ id: 900, at: [-3, FRONT_ROOM.ceiling.height + 2, -10], lead: false, why: false, waiting: false }] } },
    { law: '5', name: 'a lamp high over the front wall, seen over the roof', opts: { extraLamps: [{ id: 901, at: [-2, FRONT_ROOM.ceiling.height + 24, -1.2], lead: false, why: false, waiting: false }] } },
    { law: '6', name: 'landing turned so the owner leaves the bottom-left', stations: set(STATIONS, 'hero', 'landscape', 'settle', { yaw: 20 }) },
    { law: '7', name: 'a 3m corridor built round the 2a travel', opts: { extraSolids: corridor() } },
    { law: 'STAGE', name: '"why" walked into the hall, gazing down the length', stations: set(STATIONS, 'why', 'landscape', 'arrive', { right: -2.4, behind: -3.2, yaw: 8 }) },
  ];
  function corridor() {
    // two walls 1.2m either side of the real one-to-2a travel line, 3m long, on the apron
    const lay = layout('landscape');
    const sec = lay.sections.find((x) => x.station.id === 'wordless');
    const a = rail(FRONT_ROOM, 'landscape', sec.start - 1e-6, lay).pose.pos;
    const b = rail(FRONT_ROOM, 'landscape', sec.start + sec.travel - 1e-6, lay).pose.pos;
    const d = norm([b[0] - a[0], 0, b[2] - a[2]]);
    const n = [-d[2], 0, d[0]];
    const c = [a[0] + d[0] * 1.6, 1.0, a[2] + d[2] * 1.6];
    const rot = (Math.atan2(-d[2], d[0]) * 180) / Math.PI;
    return [1, -1].map((side) => ({ id: `test-wall-${side}`, kind: 'wall', c: [c[0] + n[0] * 1.2 * side, 1.0, c[2] + n[2] * 1.2 * side], s: [3.0, 2.0, 0.1], rotY: rot, base: 0.1, occludes: true }));
  }
  let ok = true;
  const lines = ['rail-lint self-test: each law broken on purpose must be caught'];
  const base = lint(FRONT_ROOM, STATIONS);
  lines.push(`  baseline (real rail): ${base.violations.length} breach(es) ${base.violations.length ? 'FAIL' : 'ok'}`);
  if (base.violations.length) ok = false;
  for (const c of cases) {
    const r = lint(FRONT_ROOM, c.stations ?? STATIONS, c.opts ?? {});
    const caught = r.violations.filter((x) => x.law === c.law);
    const pass = caught.length > 0;
    ok &&= pass;
    lines.push(`  law ${c.law.padEnd(5)} ${c.name.padEnd(52)} ${pass ? 'CAUGHT' : 'MISSED'} (${caught.length}${caught[0] ? ': ' + caught[0].detail.slice(0, 70) : ''})`);
  }
  lines.push(ok ? '  self-test PASS: every law can fail.' : '  self-test FAIL');
  console.log(lines.join('\n'));
  process.exit(ok ? 0 : 1);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  if (process.argv.includes('--selftest')) selftest();
  else {
    const res = lint(FRONT_ROOM, STATIONS);
    const summary = writeLogs(res);
    console.log(report(res, summary));
    process.exit(res.violations.length ? 1 : 0);
  }
}
