/*
 * shutter.ts · the owner's roller shutter as a real slatted object (engine plan 4.2 to 4.4).
 *
 * Slats hinged together, running up the guide rails, wound over a barrel inside the hood above the opening;
 * a heavier bottom rail carries the handle and the lock tab. The whole state is ONE number, the height of the
 * bottom rail, so it is exactly reversible under scroll. The rail decides that number: while the owner's hand
 * leads it steps with the hand (figures on twos); past chest height the spring takes it on CUT, on ones.
 *
 * Mechanism (a pure function, slatPose): slat i's centre sits at s = bottom + (i + 0.5) * slatH along the path.
 * Up to the barrel's tangent point it is upright in the guides; beyond it the slat wraps the barrel (radius R)
 * toward the lane and into the hood, and the first 0.35 radians of the wrap run through CUT, so each slat
 * clacks over the top instead of sliding. A slat more than 2.6 radians round is inside the hood and is not drawn.
 */
import * as THREE from 'three';
import type { PremisesSpec } from './premises.ts';
import { cut } from './rail.ts';

export const SLATS = { desktop: 28, phone: 20 } as const;
export const BARREL_R = 0.14;
/** the shutter runs just proud of the facade face */
export const SHUTTER_Z = 0.03;

export interface SlatPose { y: number; z: number; angle: number; hidden: boolean }

export function slatPose(spec: PremisesSpec, count: number, bottom: number, i: number): SlatPose {
  const L = spec.frontage.lintel, R = BARREL_R;
  const slatH = L / count;
  const sc = bottom + (i + 0.5) * slatH;
  const tangent = L + R;
  if (sc <= tangent) return { y: sc, z: SHUTTER_Z, angle: 0, hidden: false };
  let a = (sc - tangent) / R;
  if (a < 0.35) a = 0.35 * cut(a / 0.35);
  if (a > 2.6) return { y: tangent, z: SHUTTER_Z, angle: a, hidden: true };
  // barrel centre at (tangent, SHUTTER_Z + R); the slat wraps toward the lane
  return { y: tangent + R * Math.sin(a), z: SHUTTER_Z + R - R * Math.cos(a), angle: a, hidden: false };
}

/** one slat: the opening's width, a shallow curved profile of 8 segments across its height; aV runs 0..1 up the slat */
function slatGeometry(width: number, h: number): THREE.BufferGeometry {
  const pos: number[] = [], nrm: number[] = [], v: number[] = [], idx: number[] = [];
  const seg = 8, bulge = h * 0.09;
  for (let j = 0; j <= seg; j++) {
    const t = j / seg;
    const y = (t - 0.5) * h;
    const z = bulge * Math.sin(Math.PI * t);
    const dz = bulge * Math.PI * Math.cos(Math.PI * t) / h;
    const nl = Math.hypot(1, dz);
    for (const x of [-width / 2, width / 2]) { pos.push(x, y, z); nrm.push(0, -dz / nl, 1 / nl); v.push(t); }
  }
  for (let j = 0; j < seg; j++) { const a = j * 2; idx.push(a, a + 1, a + 3, a, a + 3, a + 2); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('aV', new THREE.Float32BufferAttribute(v, 1));
  g.setAttribute('aBase', new THREE.Float32BufferAttribute(new Array(pos.length / 3).fill(0.2), 1));
  g.setIndex(idx);
  return g;
}

export class Shutter {
  group = new THREE.Group();
  private slats: THREE.InstancedMesh;
  private rail: THREE.Mesh;
  private handle: THREE.Mesh;
  private lock: THREE.Group;
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private e = new THREE.Euler();
  constructor(private spec: PremisesSpec, private count: number, slatMat: THREE.Material, solidMat: THREE.Material) {
    const width = spec.frontage.width + 0.08;
    this.slats = new THREE.InstancedMesh(slatGeometry(width, spec.frontage.lintel / count), slatMat, count);
    this.slats.frustumCulled = false;
    const withBase = (g: THREE.BufferGeometry, b: number) => { g.setAttribute('aBase', new THREE.Float32BufferAttribute(new Array(g.attributes.position.count).fill(b), 1)); return g; };
    // the bottom rail: heavier than a slat, with the handle and the lock tab near the owner's end
    this.rail = new THREE.Mesh(withBase(new THREE.BoxGeometry(width, 0.07, 0.06), 0.24), solidMat);
    this.handle = new THREE.Mesh(withBase(new THREE.BoxGeometry(0.16, 0.035, 0.05), 0.3), solidMat);
    this.lock = new THREE.Group();
    const body = new THREE.Mesh(withBase(new THREE.BoxGeometry(0.055, 0.065, 0.028), 0.34), solidMat);
    const shackle = new THREE.Mesh(withBase(new THREE.TorusGeometry(0.019, 0.005, 6, 12, Math.PI), 0.34), solidMat);
    shackle.position.y = 0.032;
    this.lock.add(body, shackle);
    this.group.add(this.slats, this.rail, this.handle, this.lock);
  }
  /** bottom: the rail's height; locked: the padlock hangs on the lock tab (the lock click is one CUT between drawings) */
  update(bottom: number, locked: boolean) {
    const half = this.spec.frontage.width / 2;
    for (let i = 0; i < this.count; i++) {
      const p = slatPose(this.spec, this.count, bottom, i);
      this.e.set(p.angle, 0, 0);
      this.q.setFromEuler(this.e);
      this.m.compose(new THREE.Vector3(0, p.y, p.z), this.q, new THREE.Vector3(p.hidden ? 0 : 1, p.hidden ? 0 : 1, p.hidden ? 0 : 1));
      this.slats.setMatrixAt(i, this.m);
    }
    this.slats.instanceMatrix.needsUpdate = true;
    const railY = Math.min(bottom, this.spec.frontage.lintel) + 0.035;
    this.rail.position.set(0, railY, SHUTTER_Z + 0.01);
    this.handle.position.set(-half + 0.55, railY + 0.01, SHUTTER_Z + 0.055);
    this.lock.visible = locked;
    this.lock.position.set(-half + 0.28, 0.06, SHUTTER_Z + 0.07);
  }
}
