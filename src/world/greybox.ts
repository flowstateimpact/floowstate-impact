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
import { RAMP, deg, shutterSolid, type Solid, type World } from './world.ts';

THREE.ColorManagement.enabled = false;

const hex = (h: string) => new THREE.Color(h);

const VERT = /* glsl */ `
attribute float aBase;
varying vec3 vW;
varying vec3 vN;
varying float vBase;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vBase = aBase;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const FRAG = /* glsl */ `
precision highp float;
#define MAXL 12
uniform vec3 uRamp[5];
uniform vec4 uLight[MAXL];   // xyz position, w intensity
uniform vec2 uInfo[MAXL];    // x radius, y scope (0 inside, 1 outside)
uniform int uCount;
uniform float uGap;          // how much of the opening is clear under the shutter, 0..1
uniform float uInside;       // 1 when the camera is behind the shutter line
uniform float uCeil;         // the ceiling line
varying vec3 vW;
varying vec3 vN;
varying float vBase;
void main() {
  // from inside, the building above the ceiling line does not exist: the night takes its place (the Skyspace move)
  if (uInside > 0.5 && vW.y > uCeil + 0.002) discard;
  vec3 n = normalize(vN);
  // what a surface shows before any lamp reaches it; upper storeys fall toward ink
  float lum = vBase * mix(1.0, 0.3, smoothstep(3.5, 14.0, vW.y));
  for (int i = 0; i < MAXL; i++) {
    if (i >= uCount) break;
    vec3 d = uLight[i].xyz - vW;
    float dist = length(d);
    float ndl = max(dot(n, d / dist), 0.0);
    float r = uInfo[i].x;
    float att = uLight[i].w / (1.0 + dist * dist / (r * r));
    // light from inside reaches the apron only through the gap under the shutter; street light stays outside
    // and it stops at the kerb
    float outside = uGap * 0.7 * (1.0 - smoothstep(0.4, 3.3, vW.z));
    float reach = uInfo[i].y < 0.5 ? (vW.z > 0.03 ? outside : 1.0) : (vW.z < -0.3 ? 0.0 : 1.0);
    lum += att * ndl * reach;
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
  const uInfo = Array.from({ length: 12 }, (_, i) => (lights[i] ? new THREE.Vector2(lights[i].radius, lights[i].scope === 'inside' ? 0 : 1) : new THREE.Vector2()));
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
  update(state: { shutter: number; owner: Vec3; camera: THREE.PerspectiveCamera; whyLit: number }): void;
}

export function buildGreyBox(world: World): GreyBox {
  const scene = new THREE.Scene();
  scene.background = hex(RAMP[0]);
  const mat = toneMaterial(world);
  const ink = new THREE.LineBasicMaterial({ color: hex(RAMP[0]) });

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
  scene.add(new THREE.LineSegments(lg, ink));

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
  scene.add(new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })));

  /* the shutter: PLACEHOLDER flat panel with its 28 slat lines (the real slatted shutter is slice two) */
  const spec = world.spec;
  const half = spec.frontage.width / 2;
  const shutterMesh = new THREE.Mesh(new THREE.BoxGeometry(spec.frontage.width, 1, 0.05), mat);
  const slatH = spec.frontage.lintel / 28;
  const slatGeo = new THREE.BufferGeometry();
  const slatAttr = new THREE.Float32BufferAttribute(new Float32Array(28 * 6), 3);
  slatGeo.setAttribute('position', slatAttr);
  const slatLines = new THREE.LineSegments(slatGeo, ink);
  slatLines.frustumCulled = false;
  const shutter = new THREE.Group();
  shutter.add(shutterMesh, slatLines);
  scene.add(shutter);
  const baseAttr = (g: THREE.BufferGeometry) => g.setAttribute('aBase', new THREE.Float32BufferAttribute(new Array(g.attributes.position.count).fill(0.22), 1));
  baseAttr(shutterMesh.geometry);

  /* the owner: PLACEHOLDER MARK for law 6, 1.70m, amber with an ink stroke; the drawn figure is slice four */
  const ownerShape = new THREE.Shape();
  const w = 0.22, top = 1.46, hr = 0.12;
  ownerShape.moveTo(-w, 0); ownerShape.lineTo(w, 0); ownerShape.lineTo(w * 0.8, top); ownerShape.lineTo(-w * 0.8, top); ownerShape.lineTo(-w, 0);
  const headShape = new THREE.Shape();
  headShape.absarc(0, 1.7 - hr, hr, 0, Math.PI * 2, false);
  const ownerGeo = new THREE.ShapeGeometry([ownerShape, headShape], 12);
  const owner = new THREE.Group();
  owner.add(new THREE.Mesh(ownerGeo, new THREE.MeshBasicMaterial({ color: hex(RAMP[3]), side: THREE.DoubleSide })));
  owner.add(new THREE.LineSegments(new THREE.EdgesGeometry(ownerGeo), ink));
  scene.add(owner);

  /* the eight "why" lamps: PLACEHOLDER points, round, 3px (4px for the two amber leads), no glow pass */
  const why = world.lamps.filter((l) => l.why);
  const lg2 = new THREE.BufferGeometry();
  lg2.setAttribute('position', new THREE.Float32BufferAttribute(why.flatMap((l) => [...l.at]), 3));
  lg2.setAttribute('aLead', new THREE.Float32BufferAttribute(why.map((l) => (l.lead ? 1 : 0)), 1));
  lg2.setAttribute('aOrder', new THREE.Float32BufferAttribute(why.map((_, i) => i), 1));
  const lampMat = new THREE.ShaderMaterial({
    uniforms: { uLit: { value: 0 }, uDpr: { value: 1 }, uCream: { value: hex(RAMP[4]) }, uAmber: { value: hex(RAMP[3]) } },
    vertexShader: /* glsl */ `
      attribute float aLead; attribute float aOrder;
      uniform float uLit; uniform float uDpr;
      varying float vLead; varying float vOn;
      void main() {
        vLead = aLead; vOn = step(aOrder + 0.5, uLit);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = (aLead > 0.5 ? 4.0 : 3.0) * uDpr + 2.0 * uDpr;
      }`,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform vec3 uCream; uniform vec3 uAmber; uniform float uDpr;
      varying float vLead; varying float vOn;
      void main() {
        if (vOn < 0.5) discard;
        float px = length(gl_PointCoord - 0.5) * (vLead > 0.5 ? 6.0 : 5.0) * uDpr;
        float core = (vLead > 0.5 ? 2.0 : 1.5) * uDpr;
        float a = 1.0 - smoothstep(core, core + uDpr, px);
        if (a <= 0.0) discard;
        gl_FragColor = vec4(vLead > 0.5 ? uAmber : uCream, a);
      }`,
    transparent: true,
    depthWrite: false,
  });
  const lamps = new THREE.Points(lg2, lampMat);
  lamps.frustumCulled = false;
  scene.add(lamps);

  const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), spec.ceiling.height + 0.002);
  const clip: THREE.Plane[] = [];
  return {
    scene,
    clip,
    update({ shutter: bottom, owner: at, camera, whyLit }) {
      const inside = camera.position.z < -0.02;
      mat.uniforms.uInside.value = inside ? 1 : 0;
      clip.length = 0;
      if (inside) clip.push(clipPlane);
      const sol = shutterSolid(spec, bottom);
      shutter.visible = !!sol;
      if (sol) {
        shutterMesh.position.set(sol.c[0], sol.c[1], sol.c[2]);
        shutterMesh.scale.set(1, sol.s[1], 1);
        // slat seams ride up with the bottom edge, as a real shutter's slats do
        let n = 0;
        for (let i = 1; i < 28; i++) {
          const y = bottom + i * slatH;
          if (y >= spec.frontage.lintel) break;
          slatAttr.setXYZ(n++, -half, y, 0.056); slatAttr.setXYZ(n++, half, y, 0.056);
        }
        slatAttr.needsUpdate = true;
        slatGeo.setDrawRange(0, n);
      }
      mat.uniforms.uGap.value = Math.min(1, Math.max(0, bottom / spec.frontage.lintel));
      owner.position.set(at[0], 0, at[2]);
      owner.rotation.y = Math.atan2(camera.position.x - at[0], camera.position.z - at[2]);
      lampMat.uniforms.uLit.value = whyLit;
      lampMat.uniforms.uDpr.value = Math.min(window.devicePixelRatio || 1, 2);
    },
  };
}
