/*
 * owner.ts · the owner in the world (engine plan 5.2, direction route rows 1, 2, 2a, 3 and section 2b).
 *
 * Two halves. ownerState(): which drawing the owner is on, a pure function of the rail state, so the same
 * scroll position always gives the same drawing (figures on twos: poses change by whole drawings, never
 * in-betweens). OwnerPuppet: a cut-paper card standing on the owner's mark, turning about its vertical axis
 * to face the lens, painted by figure.ts at the owner's on-screen size so the stroke stays 5.5 percent of the
 * on-screen height within 2 to 5px. Paintings are cached by drawing and by size band (steps of 15 percent), so
 * the picture depends only on where the scroll is, never on the path taken to get there.
 */
import * as THREE from 'three';
import type { PremisesSpec, Vec3 } from './premises.ts';
import type { RailState } from './rail.ts';
import { project, type Frame } from './rail.ts';
import { paintFigure, FIGURE_BOX, CREAM, INK, KHATA, type Drawing } from './figure.ts';
import { WRITE_LINES } from './sky.ts';

export interface OwnerState {
  drawing: Drawing;
  /** the padlock hangs on the lock tab */
  locked: boolean;
  ledger: 'carried' | 'closed' | 'open';
  /** lines written on the open page */
  lines: number;
  /** metres the card slides toward the lens (0 while stepping behind the pier, so the pier still hides it) */
  slide: number;
}

const H = 1.7;
const STAND: Drawing = { hand: { x: 0.345, y: 0.53 }, prop: 'phone', khata: true, crouch: false, back: false };
const at = (d: Partial<Drawing>): Drawing => ({ ...STAND, ...d, hand: { ...STAND.hand, ...(d.hand ?? {}) } });
/** the hand on the shutter's bottom rail; low rails are reached from a crouch */
const onRail = (bottom: number, extra: Partial<Drawing> = {}): Drawing =>
  at({ hand: { x: 0.3, y: Math.max(bottom, 0.07) / H }, prop: 'none', crouch: bottom < 0.62, ...extra });

export function ownerState(st: RailState): OwnerState {
  const t = st.t, u = st.u;
  const base: OwnerState = { drawing: STAND, locked: false, ledger: 'carried', lines: 0, slide: st.station === 'hero' || st.station === 'one' ? 0.7 : 0.35 };
  switch (st.station) {
    case 'hero':
      return base;
    case 'one': {
      const locked = t >= 0.5 && t < 0.74;
      if (t < 0.3) return base;
      if (t < 0.46) return { ...base, drawing: onRail(st.shutter) };                                  // PULL-DOWN, hand leads
      if (t < 0.5) return { ...base, drawing: at({ hand: { x: 0.4, y: 0.06 }, prop: 'key', crouch: true }) }; // LOCK
      if (t < 0.58) return { ...base, locked, drawing: at({ prop: 'key' }) };                            // key held
      if (t < 0.6) return { ...base, locked, drawing: at({ hand: { x: 0.3, y: 0.62 }, prop: 'phone' }) };
      if (t < 0.72) return { ...base, locked, drawing: at({ hand: { x: 0.3, y: 0.62 }, prop: 'phone-lit' }) }; // a late order
      if (t < 0.76) return { ...base, locked, drawing: at({ hand: { x: 0.4, y: 0.06 }, prop: 'key', crouch: true }) }; // UNLOCK
      if (t < 0.9) return { ...base, drawing: onRail(st.shutter) };                                   // LIFT, hand leads
      return { ...base, drawing: onRail(st.shutter) };                                                // holding at chest
    }
    case 'wordless': {
      if (st.phase === 'travel') {
        if (u < 0.2) return { ...base, slide: 0.7, drawing: onRail(st.shutter) };
        if (u < 0.28) return { ...base, slide: 0.7, drawing: at({ hand: { x: 0.28, y: 0.92 }, prop: 'none' }) }; // the push past chest height
        if (u < 0.39) return { ...base, slide: 0, drawing: at({ back: true }) };                        // stepping in, behind the pier
        return { ...base, ledger: 'closed', drawing: at({ hand: { x: 0.42, y: 0.47 }, prop: 'none', khata: false, back: true }) };
      }
      if (u < 0.25) return { ...base, ledger: 'closed', drawing: at({ hand: { x: 0.46, y: 0.48 }, prop: 'none', khata: false, back: true }) };
      return { ...base, ledger: 'open', drawing: at({ hand: { x: 0.42, y: 0.47 }, prop: u < 0.6 ? 'none' : 'pen', khata: false, back: true }) };
    }
    case 'why': {
      const read = at({ hand: { x: 0.42, y: 0.47 }, prop: 'pen', khata: false, back: true });
      if (st.phase === 'travel') return { ...base, ledger: 'open', drawing: read };
      let lines = 0;
      let drawing = read;
      for (const line of WRITE_LINES) {
        if (u >= line.lift) { lines++; drawing = at({ hand: { x: 0.54, y: 0.55 }, prop: 'pen', khata: false, back: true }); }  // PEN LIFTS
        else if (u >= line.start) {
          const j = Math.min(3, Math.floor(((u - line.start) / (line.lift - line.start)) * 4));                      // WRITE, 4 drawings a line
          drawing = at({ hand: { x: 0.4 + j * 0.04, y: 0.47 }, prop: 'pen', khata: false, back: true });
          break;
        } else break;
      }
      return { ...base, ledger: 'open', lines, drawing };
    }
  }
  return base;
}

/* ---------- the puppet ---------- */
interface Painted { tex: THREE.CanvasTexture; w: number; h: number; cx: number; cy: number }

export class OwnerPuppet {
  group = new THREE.Group();
  private card: THREE.Mesh;
  private mat: THREE.MeshBasicMaterial;
  private cache = new Map<string, Painted>();
  private ledger: THREE.Group;
  private ledgerClosed: THREE.Mesh;
  private ledgerOpen: THREE.Mesh;
  private pageCanvas = document.createElement('canvas');
  private pageTex: THREE.CanvasTexture;
  private pageLines = -1;

  constructor(private spec: PremisesSpec) {
    this.mat = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide });
    this.card = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.mat);
    this.card.renderOrder = 2;
    this.group.add(this.card);
    // the red khata on the desk: closed, then open with the owner's lines on its page
    this.ledger = new THREE.Group();
    this.ledgerClosed = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.035, 0.32), new THREE.MeshBasicMaterial({ color: KHATA }));
    this.pageCanvas.width = 128; this.pageCanvas.height = 96;
    this.pageTex = new THREE.CanvasTexture(this.pageCanvas);
    this.ledgerOpen = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.02, 0.32), [
      new THREE.MeshBasicMaterial({ color: KHATA }), new THREE.MeshBasicMaterial({ color: KHATA }),
      new THREE.MeshBasicMaterial({ map: this.pageTex }), new THREE.MeshBasicMaterial({ color: KHATA }),
      new THREE.MeshBasicMaterial({ color: KHATA }), new THREE.MeshBasicMaterial({ color: KHATA }),
    ]);
    const c = spec.counter.at;
    this.ledger.position.set(c[0] + spec.counter.length / 2 - 0.2, spec.counter.height + 0.02, c[2] + 0.35);
    this.ledger.rotation.y = 0.35;
    this.ledger.add(this.ledgerClosed, this.ledgerOpen);
  }

  private paint(key: string, d: Drawing, screenH: number, dpr: number): Painted {
    const hit = this.cache.get(key);
    if (hit) return hit;
    const hpx = screenH * dpr;
    const sw = Math.min(5, Math.max(2, screenH * 0.055)) * dpr;
    const pad = sw * 4;
    const W = Math.ceil((FIGURE_BOX.right - FIGURE_BOX.left) * hpx + pad * 2);
    const Ht = Math.ceil(FIGURE_BOX.top * hpx + pad * 2);
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = Ht;
    const ctx = cv.getContext('2d')!;
    ctx.translate(-FIGURE_BOX.left * hpx + pad, FIGURE_BOX.top * hpx + pad);
    paintFigure(ctx, hpx, sw, d);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.NoColorSpace;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    const m = H / hpx; // metres per canvas pixel
    const p: Painted = { tex, w: W * m, h: Ht * m, cx: (W / 2 - (-FIGURE_BOX.left * hpx + pad)) * m, cy: (FIGURE_BOX.top * hpx + pad - Ht / 2) * m };
    if (this.cache.size > 96) { const first = this.cache.keys().next().value!; this.cache.get(first)!.tex.dispose(); this.cache.delete(first); }
    this.cache.set(key, p);
    return p;
  }

  update(os: OwnerState, pos: Vec3, camera: THREE.PerspectiveCamera, frame: Frame, viewportH: number, pose: { pos: Vec3; yaw: number; pitch: number; fov: number }) {
    // on-screen height, banded in 15 percent steps so the painting depends only on where the scroll is
    const head = project(pose, [pos[0], H, pos[2]], frame), feet = project(pose, [pos[0], 0, pos[2]], frame);
    const raw = Math.max(8, Math.abs(feet.down - head.down) * viewportH);
    const band = Math.round(Math.log(raw) / Math.log(1.15));
    const screenH = Math.pow(1.15, band);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const d = os.drawing;
    const key = `${band}|${dpr}|${d.hand.x.toFixed(3)},${d.hand.y.toFixed(3)}|${d.prop}|${d.khata}|${d.crouch}`;
    const p = this.paint(key, d, screenH, dpr);
    this.mat.map = p.tex;
    this.mat.needsUpdate = true;
    this.card.scale.set(p.w, p.h, 1);
    this.card.position.set(p.cx, p.cy, 0);
    // the card turns to face the lens; it is slid toward the lens along the line from the eye to the owner's feet and
    // shrunk in the same proportion, so it lands on exactly the same pixels but no longer cuts into the wall behind
    const c = camera.position;
    const dx = pos[0] - c.x, dy = 0 - c.y, dz = pos[2] - c.z;
    const dist = Math.hypot(dx, dy, dz);
    const k = (dist - Math.min(os.slide, dist * 0.3)) / dist;
    this.group.position.set(c.x + dx * k, c.y + dy * k, c.z + dz * k);
    this.group.scale.setScalar(k);
    this.group.rotation.y = Math.atan2(c.x - pos[0], c.z - pos[2]);
    // the ledger on the desk
    this.ledger.visible = os.ledger !== 'carried';
    this.ledgerClosed.visible = os.ledger === 'closed';
    this.ledgerOpen.visible = os.ledger === 'open';
    if (os.ledger === 'open' && os.lines !== this.pageLines) {
      const g = this.pageCanvas.getContext('2d')!;
      g.fillStyle = CREAM; g.fillRect(0, 0, 128, 96);
      g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(64, 0); g.lineTo(64, 96); g.stroke();
      g.lineWidth = 4;
      for (let k = 0; k < os.lines; k++) { g.beginPath(); g.moveTo(74, 16 + k * 18); g.lineTo(118 - (k % 2) * 14, 16 + k * 18); g.stroke(); }
      this.pageTex.needsUpdate = true;
      this.pageLines = os.lines;
    }
  }

  ledgerObject() { return this.ledger; }
}
