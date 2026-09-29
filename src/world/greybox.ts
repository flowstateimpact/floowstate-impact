/*
 * greybox.ts · draws the world of world.ts in flat tones, before any plate exists.
 *
 * One idea from the direction (section 5): the drawing only exists where the owner's light falls.
 * Every surface takes one of the five fixed tones by how much light reaches it, stepped, never
 * smooth: ink, deep, mid, lit, highlight. Edges are drawn in ink, so on lit surfaces they read as
 * the film's line and on unlit ones they sink into the ground, as the ink plates will.
 *
 * Cost: every static box is merged into one mesh and one line set, the signs and windows into a
 * third, so the whole grey box is a handful of draw calls. Original code; no public shader used.
 */
import * as THREE from 'three';
import type { Vec3 } from './premises.ts';
import { RAMP, deg, type Solid, type World } from './world.ts';
import type { Frame, RailState } from './rail.ts';
import { STATIONS } from './stations.ts';
import { Shutter, SLATS } from './shutter.ts';
import { OwnerPuppet, ownerState } from './owner.ts';
import { WHY_LAMPS, igniteLevels, coreSizePx } from './sky.ts';

THREE.ColorManagement.enabled = false;

const hex = (h: string) => new THREE.Color(h);

const VERT = /* glsl */ `
attribute float aBase;
#ifdef SEAM
attribute float aV;
varying float vV;
#endif
varying vec3 vW;
varying vec3 vN;
varying float vBase;
void main() {
  vec4 local = vec4(position, 1.0);
  vec3 nrm = normal;
#ifdef USE_INSTANCING
  local = instanceMatrix * local;
  nrm = mat3(instanceMatrix) * nrm;
#endif
  vec4 w = modelMatrix * local;
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * nrm);
  vBase = aBase;
#ifdef SEAM
  vV = aV;
#endif
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const FRAG = /* glsl */ `
precision highp float;
#define MAXL 12
uniform vec3 uRamp[5];
uniform vec4 uLight[MAXL];   // xyz position, w intensity
uniform vec3 uInfo[MAXL];    // x radius, y scope (0 inside, 1 outside), z 1 for a shaded pendant's downward cone
uniform int uCount;
uniform float uGap;          // how much of the opening is clear under the shutter, 0..1
uniform float uInside;       // 1 when the camera is behind the shutter line
uniform float uCeil;         // the ceiling line
uniform float uMask;         // 1 while measuring: the world draws as flat black
#ifdef SEAM
varying float vV;
#endif
varying vec3 vW;
varying vec3 vN;
varying float vBase;
void main() {
  // from inside, the building above the ceiling line does not exist: the night takes its place (the Skyspace move)
  if (uInside > 0.5 && vW.y > uCeil + 0.002) discard;
  if (uMask > 0.5) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
#ifdef SEAM
  // the seam between slats, drawn in ink along each slat's lower edge
  if (vV < 0.09) { gl_FragColor = vec4(uRamp[0], 1.0); return; }
#endif
  vec3 n = normalize(vN);
  // what a surface shows before any lamp reaches it; upper storeys fall toward ink
  float lum = vBase * mix(1.0, 0.3, smoothstep(3.5, 14.0, vW.y));
  for (int i = 0; i < MAXL; i++) {
    if (i >= uCount) break;
    vec3 d = uLight[i].xyz - vW;
    float dist = length(d);
    float ndl = max(dot(n, d / dist), 0.0);
    // a shade: light leaves only downward, full inside 30 degrees of straight down, none past 50 (no arch on the wall)
    float cone = uInfo[i].z > 0.5 ? smoothstep(0.64, 0.87, d.y / dist) : 1.0;
    float r = uInfo[i].x;
    float att = uLight[i].w / (1.0 + dist * dist / (r * r));
    // light from inside reaches the apron only through the gap under the shutter; street light stays outside
    // and it stops at the kerb
    float outside = uGap * 0.7 * (1.0 - smoothstep(0.4, 3.3, vW.z));
    float reach = uInfo[i].y < 0.5 ? (vW.z > 0.03 ? outside : 1.0) : (vW.z < -0.3 ? 0.0 : 1.0);
    // the floor inside takes little light, so no stage pool gathers round the owner: light reads from its hardware
    float floorIn = (n.y > 0.9 && vW.y < 0.01 && vW.z < -0.3) ? 0.45 : 1.0;
    lum += att * ndl * reach * floorIn * cone;
  }
  int k = lum < 0.08 ? 0 : lum < 0.22 ? 1 : lum < 0.5 ? 2 : lum < 1.05 ? 3 : 4;
  vec3 c = uRamp[0];
  if (k == 1) c = uRamp[1];
  if (k == 2) c = uRamp[2];
  if (k == 3) c = uRamp[3];
  if (k == 4) c = uRamp[4];
  gl_FragColor = vec4(c, 1.0);
}`;

/* ---------- geometry builders (merged) ---------- */
interface Buf { pos: number[]; nrm: number[]; base: number[] }

function corner(s: Solid, lx: number, ly: number, lz: number): Vec3 {
  const r = deg(s.rotY ?? 0);
  const x = lx * s.s[0] / 2, y = ly * s.s[1] / 2, z = lz * s.s[2] / 2;
  return [s.c[0] + x * Math.cos(r) + z * Math.sin(r), s.c[1] + y, s.c[2] - x * Math.sin(r) + z * Math.cos(r)];
}

function quad(b: Buf, a: Vec3, bb: Vec3, c: Vec3, d: Vec3, want: Vec3, base: number) {
  // make the winding agree with the outward normal we want
  const e1 = [bb[0] - a[0], bb[1] - a[1], bb[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const cr = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
  const flip = cr[0] * want[0] + cr[1] * want[1] + cr[2] * want[2] < 0;
  const tris = flip ? [a, c, bb, a, d, c] : [a, bb, c, a, c, d];
  for (const p of tris) { b.pos.push(p[0], p[1], p[2]); b.nrm.push(want[0], want[1], want[2]); b.base.push(base); }
}

function addBox(b: Buf, lines: number[], s: Solid) {
  const r = deg(s.rotY ?? 0);
  const X: Vec3 = [Math.cos(r), 0, -Math.sin(r)], Z: Vec3 = [Math.sin(r), 0, Math.cos(r)], Y: Vec3 = [0, 1, 0];
  const k = (lx: number, ly: number, lz: number) => corner(s, lx, ly, lz);
  const faces: Array<[Vec3, Vec3, Vec3, Vec3, Vec3]> = [
    [k(-1, -1, 1), k(1, -1, 1), k(1, 1, 1), k(-1, 1, 1), Z],
    [k(-1, -1, -1), k(1, -1, -1), k(1, 1, -1), k(-1, 1, -1), [-Z[0], 0, -Z[2]]],
    [k(1, -1, -1), k(1, -1, 1), k(1, 1, 1), k(1, 1, -1), X],
    [k(-1, -1, -1), k(-1, -1, 1), k(-1, 1, 1), k(-1, 1, -1), [-X[0], 0, -X[2]]],
    [k(-1, 1, -1), k(1, 1, -1), k(1, 1, 1), k(-1, 1, 1), Y],
    [k(-1, -1, -1), k(1, -1, -1), k(1, -1, 1), k(-1, -1, 1), [0, -1, 0]],
  ];
  const use = s.frontOnly ? [faces[0]] : faces;
  for (const f of use) quad(b, f[0], f[1], f[2], f[3], f[4], s.base);
  const edge = (p: Vec3, q: Vec3) => lines.push(p[0], p[1], p[2], q[0], q[1], q[2]);
  if (s.frontOnly) {
    const [a, bb, c, d] = faces[0];
    edge(a, bb); edge(bb, c); edge(c, d); edge(d, a);
  } else {
    for (const ly of [-1, 1]) for (const lz of [-1, 1]) edge(k(-1, ly, lz), k(1, ly, lz));
    for (const lx of [-1, 1]) for (const lz of [-1, 1]) edge(k(lx, -1, lz), k(lx, 1, lz));
    for (const lx of [-1, 1]) for (const ly of [-1, 1]) edge(k(lx, ly, -1), k(lx, ly, 1));
  }
}

function toneMaterial(world: World) {
  const lights = world.lights.slice(0, 12);
  const uLight = Array.from({ length: 12 }, (_, i) => (lights[i] ? new THREE.Vector4(...lights[i].at, lights[i].intensity) : new THREE.Vector4()));
  const uInfo = Array.from({ length: 12 }, (_, i) => (lights[i] ? new THREE.Vector3(lights[i].radius, lights[i].scope === 'inside' ? 0 : 1, lights[i].down ? 1 : 0) : new THREE.Vector3()));
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uRamp: { value: RAMP.map((h) => hex(h)) },
      uLight: { value: uLight },
      uInfo: { value: uInfo },
      uCount: { value: lights.length },
      uGap: { value: 1 },
      uInside: { value: 0 },
      uMask: { value: 0 },
      uCeil: { value: world.spec.ceiling.height },
    },
    // a small constant push only: a slope-scaled push lets hidden edges bleed through at grazing angles
    polygonOffset: true,
    polygonOffsetFactor: 0.15,
    polygonOffsetUnits: 2,
  });
}

function merged(b: Buf) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(b.pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(b.nrm, 3));
  g.setAttribute('aBase', new THREE.Float32BufferAttribute(b.base, 1));
  return g;
}

export interface GreyBox {
  scene: THREE.Scene;
  /** clip planes the renderer applies to the built-in materials (lines, panels) */
  clip: THREE.Plane[];
  /** apply the rail's state for this frame */
  update(st: RailState, camera: THREE.PerspectiveCamera, frame: Frame, viewportH: number): void;
  /** measurement passes for the gates: 'lamps' draws only the lamps, white; 'owner' only the owner, white */
  setMask(mode: 'none' | 'lamps' | 'owner'): void;
}

export function buildGreyBox(world: World, opts: { phone?: boolean } = {}): GreyBox {
  const scene = new THREE.Scene();
  scene.background = hex(RAMP[0]);
  const mat = toneMaterial(world);
  const slatMat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: mat.uniforms, defines: { SEAM: '' }, polygonOffset: true, polygonOffsetFactor: 0.15, polygonOffsetUnits: 2 });
  const ink = new THREE.LineBasicMaterial({ color: hex(RAMP[0]) });
  const spec = world.spec;

  /* the static world: one mesh, one line set */
  const b: Buf = { pos: [], nrm: [], base: [] };
  const lines: number[] = [];
  for (const s of world.solids) addBox(b, lines, s);
  for (const f of world.floors) {
    const r = deg(f.rotY ?? 0), pv = f.pivot ?? [0, 0, 0];
    const P = (x: number, z: number): Vec3 => (f.rotY ? [pv[0] + x * Math.cos(r) + z * Math.sin(r), f.y, pv[2] - x * Math.sin(r) + z * Math.cos(r)] : [x, f.y, z]);
    quad(b, P(f.x0, f.z0), P(f.x1, f.z0), P(f.x1, f.z1), P(f.x0, f.z1), [0, 1, 0], f.base);
  }
  scene.add(new THREE.Mesh(merged(b), mat));
  const lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
  const lineSet = new THREE.LineSegments(lg, ink);
  scene.add(lineSet);

  /* signs, lit windows, bands of light: fixed tones, one mesh */
  const pp: number[] = [], pc: number[] = [];
  for (const p of world.panels) {
    const r = deg(p.rotY);
    const ax: Vec3 = [Math.cos(r) * p.w / 2, 0, -Math.sin(r) * p.w / 2];
    const C = (sx: number, sy: number): Vec3 => [p.c[0] + ax[0] * sx, p.c[1] + (p.h / 2) * sy, p.c[2] + ax[2] * sx];
    const col = hex(RAMP[p.tone]);
    for (const q of [C(-1, -1), C(1, -1), C(1, 1), C(-1, -1), C(1, 1), C(-1, 1)]) { pp.push(...q); pc.push(col.r, col.g, col.b); }
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.Float32BufferAttribute(pp, 3));
  pg.setAttribute('color', new THREE.Float32BufferAttribute(pc, 3));
  const panels = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }));
  scene.add(panels);

  /* the shutter: 28 slats on desktop, 20 on phones (plan 4.2) */
  const shutter = new Shutter(spec, opts.phone ? SLATS.phone : SLATS.desktop, slatMat, mat);
  scene.add(shutter.group);

  /* the owner, and the khata on the desk */
  const owner = new OwnerPuppet(spec);
  scene.add(owner.group, owner.ledgerObject());
  const maskCard = new THREE.ShaderMaterial({
    uniforms: { map: { value: null } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform sampler2D map; varying vec2 vUv; void main(){ float a = texture2D(map, vUv).a; if (a < 0.5) discard; gl_FragColor = vec4(1.0); }',
    side: THREE.DoubleSide,
  });

  /* the eight lamps: round points, core size by depth, cream workers and amber leads, no glow pass */
  const lampGeo = new THREE.BufferGeometry();
  lampGeo.setAttribute('position', new THREE.Float32BufferAttribute(WHY_LAMPS.flatMap((l) => [...l.at]), 3));
  lampGeo.setAttribute('aLead', new THREE.Float32BufferAttribute(WHY_LAMPS.map((l) => (l.lead ? 1 : 0)), 1));
  lampGeo.setAttribute('aCore', new THREE.Float32BufferAttribute(WHY_LAMPS.map((l) => coreSizePx(l.at[1] - spec.ceiling.height)), 1));
  const levelAttr = new THREE.Float32BufferAttribute(new Float32Array(WHY_LAMPS.length), 1);
  lampGeo.setAttribute('aLevel', levelAttr);
  const lampMat = new THREE.ShaderMaterial({
    uniforms: { uDpr: { value: 1 }, uCream: { value: hex(RAMP[4]) }, uAmber: { value: hex(RAMP[3]) }, uMask: { value: 0 } },
    vertexShader: /* glsl */ `
      attribute float aLead; attribute float aCore; attribute float aLevel;
      uniform float uDpr;
      varying float vLead; varying float vLevel; varying float vCore;
      void main() {
        vLead = aLead; vLevel = aLevel; vCore = aCore * uDpr;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aCore * uDpr + 2.0 * uDpr + 2.0;
      }`,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform vec3 uCream; uniform vec3 uAmber; uniform float uDpr; uniform float uMask;
      varying float vLead; varying float vLevel; varying float vCore;
      void main() {
        if (vLevel <= 0.0) discard;
        float size = vCore + 2.0 * uDpr + 2.0;
        float px = length(gl_PointCoord - 0.5) * size;
        // a round core with a 1px soft edge; nothing wider (the halo stays under 3px)
        float a = 1.0 - smoothstep(vCore * 0.5, vCore * 0.5 + uDpr, px);
        if (a <= 0.0) discard;
        vec3 c = uMask > 0.5 ? vec3(1.0) : (vLead > 0.5 ? uAmber : uCream);
        gl_FragColor = vec4(c, a * vLevel);
      }`,
    transparent: true,
    depthWrite: false,
  });
  const lamps = new THREE.Points(lampGeo, lampMat);
  lamps.frustumCulled = false;
  lamps.renderOrder = 3;
  scene.add(lamps);

  const whyIndex = STATIONS.findIndex((x) => x.id === 'why');
  const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), spec.ceiling.height + 0.002);
  const clip: THREE.Plane[] = [];
  let mask: 'none' | 'lamps' | 'owner' = 'none';
  let cardMat: THREE.Material | null = null;
  return {
    scene,
    clip,
    setMask(mode) {
      mask = mode;
      mat.uniforms.uMask.value = mode === 'none' ? 0 : 1;
      lampMat.uniforms.uMask.value = mode === 'lamps' ? 1 : 0;
      lineSet.visible = panels.visible = mode === 'none';
      lamps.visible = mode !== 'owner';
      owner.ledgerObject().visible = mode === 'none';
      scene.background = hex(RAMP[0]);
      if (mode !== 'none') scene.background = new THREE.Color(0, 0, 0);
    },
    update(st, camera, frame, viewportH) {
      const inside = camera.position.z < -0.02;
      mat.uniforms.uInside.value = inside ? 1 : 0;
      clip.length = 0;
      if (inside) clip.push(clipPlane);
      const os = ownerState(st);
      shutter.update(st.shutter, os.locked);
      mat.uniforms.uGap.value = Math.min(1, Math.max(0, st.shutter / spec.frontage.lintel));
      owner.update(os, st.owner.at, camera, frame, viewportH, st.pose);
      if (mask !== 'none') owner.ledgerObject().visible = false;
      const card = owner.group.children[0] as THREE.Mesh;
      if (mask === 'owner') {
        cardMat ??= card.material as THREE.Material;
        maskCard.uniforms.map.value = (cardMat as THREE.MeshBasicMaterial).map;
        card.material = maskCard;
        owner.group.visible = true;
      } else {
        if (cardMat) { card.material = cardMat; cardMat = null; }
        owner.group.visible = mask === 'none';
        if (mask === 'none') owner.ledgerObject().visible = os.ledger !== 'carried';
      }
      const lv = igniteLevels(whyIndex, st.index, st.phase, st.u);
      lv.forEach((v, i) => levelAttr.setX(i, v));
      levelAttr.needsUpdate = true;
      lampMat.uniforms.uDpr.value = Math.min(window.devicePixelRatio || 1, 2);
    },
  };
}
