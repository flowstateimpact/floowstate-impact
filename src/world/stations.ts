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
import type { MarkId, Vec3 } from './premises.ts';

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
  /** the step drawings of a walk, in order (each held for an equal share of walkSpan) */
  walkSteps?: Vec3[];
  /** optional: the part of the travel the camera's position takes (default: all of it) */
  spans?: { pos?: [number, number] };
  /** optional per-rail keys [travel u, value] for the look, so a travel can turn, hold, and turn again */
  keys?: { yaw?: Array<[number, number]>; pitch?: Array<[number, number]>; fov?: Array<[number, number]> };
  railKeys?: Partial<Record<RailId, Station['keys']>>;
  knots: Record<RailId, { arrive: Knot; settle: Knot }>;
  /** shutter bottom edge over the section's progress: [t, metres, curve into this key] */
  shutter: Array<[number, number, ('lin' | 'cut' | 'pull' | 'hand')?]>;
  /** optional: the part of the dwell over which arrive settles into settle, then held (default: all of it) */
  dwellSettle?: number;
  /** optional per-rail keys over the settle, [settle progress, value]: the "why" lens stays wide while it tilts */
  dwellKeys?: Partial<Record<RailId, { fov?: Array<[number, number]> }>>;
  /** law 5: during the landing and "The shop is closed", zero lamps are visible */
  zeroLamps: boolean;
}

const CHEST = 1.26;  // the shutter at the owner's chest height (1.70m figure); the spring takes it once pushed past 1.3m (plan 4.4)
const LINTEL = 2.4;

export const STATIONS: Station[] = [
  {
    id: 'hero', route: '1', label: 'Now your business can afford a whole department.',
    len: { landscape: 150, portrait: 130 }, travel: 'none', owner: 'M0', walkSpan: [0, 1],
    // kerb edge, 1.45m high, 3.5m from the shutter, right of the opening; a level wide lens keeps the building's verticals upright
    knots: {
      landscape: {
        arrive: { anchor: 'M0', right: 4.03, height: 1.45, behind: 3.25, yaw: 12.3, pitch: -3.6, fov: 59.3 },
        settle: { anchor: 'M0', right: 4.03, height: 1.45, behind: 3.22, yaw: 12.1, pitch: -3.6, fov: 59.3 },
      },
      portrait: {
        arrive: { anchor: 'M0', right: 2.96, height: 1.45, behind: 3.25, yaw: 19.5, pitch: -2.7, fov: 61.4 },
        settle: { anchor: 'M0', right: 2.96, height: 1.45, behind: 3.22, yaw: 19.3, pitch: -2.7, fov: 61.4 },
      },
    },
    shutter: [[0, CHEST]], zeroLamps: true,
  },
  {
    id: 'one', route: '2', label: 'Bangladesh, 2024 · The shop is closed',
    len: { landscape: 170, portrait: 140 }, travel: 'pull', owner: 'M0', walkSpan: [0, 1],
    // crab left 1m, down to 1.3m, and the lens opens: as the shop closes the owner grows small in the lane.
    // The owner pulls it down and locks it, the phone lights with a late order, the owner lifts it to chest height.
    knots: {
      landscape: {
        arrive: { anchor: 'M0', right: 3.03, height: 1.3, behind: 3.25, yaw: 12.5, pitch: 2.3, fov: 69.5 },
        settle: { anchor: 'M0', right: 3.03, height: 1.3, behind: 3.23, yaw: 12.4, pitch: 2.3, fov: 69.5 },
      },
      portrait: {
        arrive: { anchor: 'M0', right: 1.96, height: 1.3, behind: 3.25, yaw: 16.0, pitch: 1.0, fov: 72 },
        settle: { anchor: 'M0', right: 1.96, height: 1.3, behind: 3.23, yaw: 15.9, pitch: 1.0, fov: 72 },
      },
    },
    shutter: [[0, CHEST], [0.3, CHEST], [0.46, 0, 'hand'], [0.76, 0], [0.9, CHEST, 'hand'], [1, CHEST]],
    zeroLamps: true,
  },
  {
    id: 'wordless', route: '2a', label: '(wordless beat)',
    len: { landscape: 160, portrait: 130 }, travel: 'pull', owner: 'M1', walkFrom: 'M0', walkSpan: [0.3, 0.39],
    // two step drawings: over the threshold, then half behind the left pier; the next drawing is inside, out of sight
    walkSteps: [[-1.3, 0, -0.1], [-1.8, 0, -0.45], [-5.784, 0, -2.381]],
    // The sequence: turn while the shutter is still at chest height (the level gaze stays on steel), hold with the gaze
    // on the pier edge while the spring throws the shutter up (the reveal fills the right of frame), pan onto the owner's
    // own wall, then duck under the lintel and rest inside, behind and right of the owner, looking across the room.
    // The owner steps in behind the pier while the camera holds on it; the walk itself is never shown (hidden cut).
    spans: { pos: [0.58, 1.0] },
    railKeys: {
      landscape: { yaw: [[0.22, 41], [0.42, 41], [0.62, 57.3]] },
      portrait: { yaw: [[0.22, 28], [0.42, 28], [0.62, 69.5]] },
    },
    knots: {
      landscape: {
        arrive: { anchor: 'M1', right: 1.97, height: 1.2, behind: 4.83, yaw: 57.3, pitch: 5, fov: 61.7 },
        settle: { anchor: 'M1', right: 1.99, height: 1.2, behind: 4.81, yaw: 57.4, pitch: 5, fov: 61.7 },
      },
      portrait: {
        arrive: { anchor: 'M1', right: 1.62, height: 1.2, behind: 4.8, yaw: 69.5, pitch: 5, fov: 57.7 },
        settle: { anchor: 'M1', right: 1.64, height: 1.2, behind: 4.78, yaw: 69.6, pitch: 5, fov: 57.7 },
      },
    },
    shutter: [[0, CHEST], [0.072, CHEST], [0.122, LINTEL, 'cut'], [1, LINTEL]], zeroLamps: false,
  },
  {
    id: 'why', route: '3', label: 'why · traits A to D',
    len: { landscape: 220, portrait: 180 }, travel: 'pull', owner: 'M1', walkSpan: [0, 1],
    // 0.3m crab; then the slow upward look, 5 to 22 degrees, no rise, finished in the first third of the dwell,
    // so the eight lamps ignite into a settled field as the pen lifts at the end of each of the four lines
    dwellSettle: 0.33,
    // the lens holds wide while the view tilts up, and closes only in the last quarter of the tilt
    dwellKeys: { landscape: { fov: [[0.75, 66]] }, portrait: { fov: [[0.75, 64]] } },
    knots: {
      landscape: {
        arrive: { anchor: 'M1', right: 2.26, height: 1.2, behind: 4.87, yaw: 57.3, pitch: 5, fov: 66 },
        settle: { anchor: 'M1', right: 2.26, height: 1.2, behind: 4.87, yaw: 57.25, pitch: 22, fov: 57.7 },
      },
      portrait: {
        arrive: { anchor: 'M1', right: 1.92, height: 1.2, behind: 4.78, yaw: 69.8, pitch: 5, fov: 64 },
        settle: { anchor: 'M1', right: 1.92, height: 1.2, behind: 4.78, yaw: 69.8, pitch: 22, fov: 57.3 },
      },
    },
    shutter: [[0, LINTEL]], zeroLamps: false,
  },
];
