/*
 * sky.ts · the first eight lamps (engine plan 6, direction sections 6.2 and 8). Pure data and pure maths.
 *
 * Part one lights eight of the 83, at "why", one at a time, as the owner's pen lifts at the end of each of
 * the four lines: 2, 3, 1, 2 (direction section 8). Nothing lights at the landing or at "one".
 *
 * WHICH WORKERS LIGHT IS THE COPY OWNER'S CALL. The eight ids below are placeholders that follow the
 * direction's own suggestion; replace the ids and rooms in this one list and nothing else changes.
 *
 * Homes: found by search (29 Sep 2026) under every constraint at once: inside the footprint inset 1m;
 * 4 to 24m above the ceiling line; seen above the near beam in every "why" frame on every screen, desktop
 * and phone; hidden from every point of the apron (law 5); at least 5.2 degrees apart (countable).
 * They sit over the hall's left side, ordered left to right across the frame, so the sky fills along the
 * owner's page. Slice three replaces them with the vantage-locked sky of 83.
 */
import type { Vec3 } from './premises.ts';

export type Trait = 'A' | 'B' | 'C' | 'D';

export interface SkyLamp {
  id: string;
  room: string;
  lead: boolean;
  trait: Trait;
  at: Vec3;
}

/** the eight, in ignition order. Two amber (leads), six cream. */
export const WHY_LAMPS: SkyLamp[] = [
  { id: 'finders-worker-1', room: 'Finders', lead: false, trait: 'A', at: [-6.48, 7.08, -3.14] },
  { id: 'numbers-worker-1', room: 'Numbers', lead: false, trait: 'A', at: [-6.42, 6.94, -4.42] },
  { id: 'bench-lead', room: 'The bench', lead: true, trait: 'B', at: [-5.67, 7.19, -4.63] },
  { id: 'bench-worker-1', room: 'The bench', lead: false, trait: 'B', at: [-6.45, 6.95, -5.79] },
  { id: 'bench-worker-2', room: 'The bench', lead: false, trait: 'B', at: [-6.49, 8.6, -6.09] },
  { id: 'office-worker-1', room: 'The office', lead: false, trait: 'C', at: [-6.48, 7.96, -6.78] },
  { id: 'planners-worker-1', room: 'Planners', lead: false, trait: 'D', at: [-5.54, 7.94, -7.1] },
  { id: 'office-lead', room: 'The office', lead: true, trait: 'D', at: [-6.39, 6.98, -7.47] },
];

/* ---------- the four lines the owner writes during the "why" dwell ----------
 * Dwell progress 0..1. The tilt settles by 0.33 (stations.ts), then four lines, each written then the pen lifts;
 * that trait's lamps ignite one at a time after the lift. */
export const WRITE_LINES: Array<{ trait: Trait; start: number; lift: number }> = [
  { trait: 'A', start: 0.36, lift: 0.46 },
  { trait: 'B', start: 0.51, lift: 0.61 },
  { trait: 'C', start: 0.66, lift: 0.76 },
  { trait: 'D', start: 0.81, lift: 0.91 },
];
/** gap between lamps of one trait, and each lamp's rise (IGNITE: one lamp at a time, a plain quick rise, no flicker) */
export const IGNITE_GAP = 0.018;
export const IGNITE_RISE = 0.008;

/** how lit each of the eight is, 0..1, from the station index and dwell progress (pure: same scroll, same sky) */
export function igniteLevels(whyIndex: number, index: number, phase: 'travel' | 'dwell', u: number): number[] {
  if (index < whyIndex || (index === whyIndex && phase === 'travel')) return WHY_LAMPS.map(() => 0);
  if (index > whyIndex) return WHY_LAMPS.map(() => 1);
  return WHY_LAMPS.map((l) => {
    const line = WRITE_LINES.find((w) => w.trait === l.trait)!;
    const nth = WHY_LAMPS.filter((x) => x.trait === l.trait).indexOf(l);
    const t0 = line.lift + 0.012 + nth * IGNITE_GAP;
    return Math.min(1, Math.max(0, (u - t0) / IGNITE_RISE));
  });
}

/** lamp core size by depth (direction 6.2): 4px at 4m above the ceiling line, 2px at 24m */
export function coreSizePx(heightAboveCeiling: number): number {
  const t = Math.min(1, Math.max(0, (heightAboveCeiling - 4) / 20));
  return 4 - 2 * t;
}
