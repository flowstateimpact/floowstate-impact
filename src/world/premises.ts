/*
 * premises.ts · the owner's premises as a small typed description (engine plan section 2).
 * Pure data, no three.js: the rail check (scripts/rail-lint.mjs) imports this file directly.
 *
 * Frame of reference, used everywhere in src/world:
 *   origin  = centre of the shutter opening, on the floor, at the shutter line
 *   +x      = to the right, as seen from the lane looking at the shop
 *   +y      = up
 *   +z      = out toward the lane (the kerb edge sits at z = apron.depth)
 *   interior = z < 0.  Yaw 0 looks into the shop (-z); positive yaw turns left (toward -x).
 *
 * Values are the direction's front room (DIRECTION-B-locked-tabeer.md sections 1, 2, 13)
 * over the plan's front-room row (3.0m frontage, 2.4m lintel, 2.9m ceiling line, 10 x 30m, desk 0.78m).
 */

export type Vec3 = readonly [number, number, number];
export type Category = 'showroom' | 'workshop-front' | 'factory-floor' | 'front-room';
export type MarkId = 'M0' | 'M1' | 'M2' | 'M3' | 'M4';

export interface Mark {
  at: Vec3;
  /** the way the owner faces, world yaw in degrees (0 = into the shop) */
  facing: number;
}

export interface PremisesSpec {
  category: Category;
  /** the owner's pavement, shutter line to kerb edge; counts as premises */
  apron: { depth: number; left: number; right: number };
  /** the shutter opening */
  frontage: { width: number; lintel: number };
  /** the ordinary building above: the owner's unit sits at its right end, the lane bends away beyond it */
  facade: { storeys: 6; groundH: number; storeyH: number; left: number; right: number; wall: number; litWindows: number };
  /** the room, bigger than the facade allows */
  inside: { left: number; right: number; depth: number };
  /** THE CEILING LINE: only its edge exists (a cornice round the walls and beams along the length); above it, open night */
  ceiling: { height: number; edge: 'beam'; beamDepth: number; beamWidth: number; beamsX: readonly number[] };
  /** the front room as seen from the lane: a normal shallow room whose back is a shelved partition on the right */
  frontRoom: { partitionZ: number; partitionFromX: number };
  counter: { at: Vec3; length: number; depth: number; height: number; kind: 'desk' };
  /** the owner's eye and height (plan law 1: 0.93 of 1.70m) */
  owner: { height: number; eye: number };
  marks: Partial<Record<MarkId, Mark>>;
  /** the lane: kerb step, road width, the bend to the right beyond the owner's building */
  lane: { roadWidth: number; bendX: number; bendDeg: number };
  plates: string;
}

export const FRONT_ROOM: PremisesSpec = {
  category: 'front-room',
  apron: { depth: 3.5, left: -2.1, right: 2.1 },
  frontage: { width: 3.0, lintel: 2.4 },
  facade: { storeys: 6, groundH: 3.3, storeyH: 3.0, left: -6.2, right: 2.6, wall: 0.25, litWindows: 4 },
  inside: { left: -7.5, right: 2.5, depth: 30 },
  ceiling: { height: 2.9, edge: 'beam', beamDepth: 0.28, beamWidth: 0.22, beamsX: [-2.2, -5.0] },
  frontRoom: { partitionZ: -2.3, partitionFromX: 0.0 },
  counter: { at: [-2.55, 0, -1.55], length: 1.9, depth: 0.7, height: 0.78, kind: 'desk' },
  owner: { height: 1.7, eye: 1.58 },
  marks: {
    // M0: on the apron in front of the shutter's left half, where the handle is
    M0: { at: [-0.5, 0, 0.45], facing: 0 },
    // M1: at the desk, just inside the front wall, facing into the room toward the desk's near-right corner
    M1: { at: [-1.4, 0, -0.6], facing: 34 },
  },
  lane: { roadWidth: 6.0, bendX: 3.0, bendDeg: 50 },
  plates: 'front-room',
};
