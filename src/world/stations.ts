/*
 * stations.ts · route rows 1, 2, 2a and 3 of the locked direction (DIRECTION-B-locked-tabeer.md, section 2).
 *
 * Every knot is stored relative to the owner's mark, as the engine plan asks (3.1): right, height above
 * the floor, and behind, in the mark's own frame. Change the premises and the marks move; the rail follows
 * and scripts/rail-lint.mjs re-runs every law against the new numbers.
 *
 * Two rails share the same knot tags: landscape (desktop, fov authored at 16:9) and portrait (phones,
 * fov authored for the full 390 x 844 frame, the world drawn into its top 56 percent).
 */
import type { MarkId } from './premises.ts';

export type RailId = 'landscape' | 'portrait';

export interface Knot {
  anchor: MarkId;
  /** metres to the right of the owner's mark, in the owner's own frame */
  right: number;
  /** camera height above the floor, metres */
  height: number;
  /** metres behind the owner's mark, in the owner's own frame */
  behind: number;
  /** world yaw, degrees (0 looks into the shop, positive turns left) */
  yaw: number;
  pitch: number;
  fov: number;
}

export interface Station {
  id: 'hero' | 'one' | 'wordless' | 'why';
  /** route row in the direction */
  route: '1' | '2' | '2a' | '3';
  label: string;
  /** section length in vh, desktop and phone (engine plan 3.3) */
  len: Record<RailId, number>;
  travel: 'none' | 'pull';
  owner: MarkId;
  walkFrom?: MarkId;
  /** the part of the travel the walk takes, as travel progress */
  walkSpan: [number, number];
  /** optional: the part of the travel the camera's position takes (default: all of it) */
  spans?: { pos?: [number, number] };
  /** optional per-rail keys [travel u, value] for the look, so a travel can turn, hold, and turn again */
  keys?: { yaw?: Array<[number, number]>; pitch?: Array<[number, number]>; fov?: Array<[number, number]> };
  railKeys?: Partial<Record<RailId, Station['keys']>>;
  knots: Record<RailId, { arrive: Knot; settle: Knot }>;
  /** shutter bottom edge over the section's progress: [t, metres, curve into this key] */
  shutter: Array<[number, number, ('lin' | 'cut' | 'pull')?]>;
  /** law 5: during the landing and "The shop is closed", zero lamps are visible */
  zeroLamps: boolean;
}

const CHEST = 1.26;  // the shutter at the owner's chest height (1.70m figure); the spring takes it once pushed past 1.3m (plan 4.4)
const LINTEL = 2.4;

export const STATIONS: Station[] = [
  {
    id: 'hero', route: '1', label: 'Now your business can afford a whole department.',
    len: { landscape: 150, portrait: 130 }, travel: 'none', owner: 'M0', walkSpan: [0, 1],
    // kerb edge, 1.45m high, 3.5m from the shutter, slightly right; the lane bends away to the right
    knots: {
      landscape: {
        arrive: { anchor: 'M0', right: 1.7, height: 1.45, behind: 3.0, yaw: -3.5, pitch: -3.5, fov: 56 },
        settle: { anchor: 'M0', right: 1.7, height: 1.45, behind: 2.96, yaw: -3.8, pitch: -3.5, fov: 56 },
      },
      portrait: {
        arrive: { anchor: 'M0', right: 1.2, height: 1.45, behind: 3.0, yaw: 6, pitch: 1, fov: 60 },
        settle: { anchor: 'M0', right: 1.2, height: 1.45, behind: 2.96, yaw: 5.8, pitch: 1, fov: 60 },
      },
    },
    shutter: [[0, CHEST]], zeroLamps: true,
  },
  {
    id: 'one', route: '2', label: 'Bangladesh, 2024 · The shop is closed',
    len: { landscape: 170, portrait: 140 }, travel: 'pull', owner: 'M0', walkSpan: [0, 1],
    // crab left 1m, down to 1.3m. The owner pulls it down and locks it, the phone lights, the owner lifts it to chest height
    knots: {
      landscape: {
        arrive: { anchor: 'M0', right: 0.7, height: 1.3, behind: 3.0, yaw: -11.5, pitch: -3.5, fov: 52 },
        settle: { anchor: 'M0', right: 0.68, height: 1.3, behind: 2.97, yaw: -11.7, pitch: -3.5, fov: 52 },
      },
      portrait: {
        arrive: { anchor: 'M0', right: 0.2, height: 1.3, behind: 3.0, yaw: -11, pitch: 3.5, fov: 64 },
        settle: { anchor: 'M0', right: 0.18, height: 1.3, behind: 2.97, yaw: -11.2, pitch: 3.5, fov: 64 },
      },
    },
    shutter: [[0, CHEST], [0.3, CHEST], [0.46, 0, 'pull'], [0.72, 0], [0.9, CHEST, 'pull'], [1, CHEST]],
    zeroLamps: true,
  },
  {
    id: 'wordless', route: '2a', label: '(wordless beat)',
    len: { landscape: 160, portrait: 130 }, travel: 'pull', owner: 'M1', walkFrom: 'M0', walkSpan: [0.44, 0.7],
    // Rests under the lintel, behind and right of the owner, looking across the room (stage law).
    // The sequence: turn while the shutter is still at chest height (the level gaze stays on steel), hold with the gaze
    // on the pier edge while the spring throws the shutter up (the reveal fills the right of frame), pan onto the owner's
    // own wall, then slide in past the pier (the pier edge is the wipe; the owner's walk happens behind it).
    spans: { pos: [0.58, 1.0] },
    railKeys: {
      landscape: { yaw: [[0.22, 28], [0.42, 28], [0.62, 60.5]] },
      portrait: { yaw: [[0.22, 22], [0.42, 22], [0.62, 68.5]] },
    },
    knots: {
      landscape: {
        arrive: { anchor: 'M1', right: 1.92, height: 1.2, behind: 1.8, yaw: 60.5, pitch: -5.5, fov: 48 },
        settle: { anchor: 'M1', right: 1.94, height: 1.2, behind: 1.77, yaw: 60.8, pitch: -5.5, fov: 48 },
      },
      portrait: {
        arrive: { anchor: 'M1', right: 1.92, height: 1.2, behind: 1.8, yaw: 68.5, pitch: -1, fov: 56 },
        settle: { anchor: 'M1', right: 1.94, height: 1.2, behind: 1.77, yaw: 68.8, pitch: -1, fov: 56 },
      },
    },
    shutter: [[0, CHEST], [0.072, CHEST], [0.122, LINTEL, 'cut'], [1, LINTEL]], zeroLamps: false,
  },
  {
    id: 'why', route: '3', label: 'why · traits A to D',
    len: { landscape: 220, portrait: 180 }, travel: 'pull', owner: 'M1', walkSpan: [0, 1],
    // 0.3m crab, then the slow upward look, 5 to 22 degrees, no rise
    knots: {
      landscape: {
        arrive: { anchor: 'M1', right: 2.18, height: 1.2, behind: 1.66, yaw: 63, pitch: 5, fov: 48 },
        settle: { anchor: 'M1', right: 2.18, height: 1.2, behind: 1.66, yaw: 65, pitch: 22, fov: 50 },
      },
      portrait: {
        arrive: { anchor: 'M1', right: 2.18, height: 1.2, behind: 1.66, yaw: 69.5, pitch: 5, fov: 68 },
        settle: { anchor: 'M1', right: 2.18, height: 1.2, behind: 1.66, yaw: 71.5, pitch: 22, fov: 68 },
      },
    },
    shutter: [[0, LINTEL]], zeroLamps: false,
  },
];
