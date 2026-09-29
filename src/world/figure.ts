/*
 * figure.ts · the owner, drawn with the drawn film's own arithmetic (engine plan 5.1).
 *
 * The constants are ported one for one from bodyEl() and toolEl() in
 * fsi-demo-film-2026-09/src/living/film.mjs: head 0.2h, body 0.3h wide, shoulder line at 1.15 head heights
 * below the crown, hips at 0.42h, one arm from 0.42 of the shoulder to 0.95 of the body width, tool 0.22h,
 * legs at +-0.26 of the body width, stroke x1.15 on the legs, round caps and joins, and the film's contact
 * shadow: the same figure offset 0.035h at 12 percent ink, hard edged, no blur.
 * So the owner on the site and the owner in the film are one drawing, not a lookalike.
 *
 * What the site adds, and only this: the owner's colour code (amber fill, ink stroke: a person, not a worker);
 * where the one arm points for each pose; a crouch for the lock; and the owner's own props, never "paper":
 * the red khata (#FF4400, the site's one standing use of it), the phone (its screen lights), the key, the pen.
 * Ungendered as drawn. Upright, weight on both feet (seed 1 gives the film's straight, planted legs).
 */

export const INK = '#0A0A0B';
export const AMBER = '#FFB03B';
export const CREAM = '#F5F1EB';
/** token KHATA: the ledger's cover, the one standing #FF4400 on the site (direction, "Open") */
export const KHATA = '#FF4400';

export type Prop = 'none' | 'phone' | 'phone-lit' | 'key' | 'pen';

export interface Drawing {
  /** where the one hand is, as heights above the floor and reach, in figure units (1 = the figure's height) */
  hand: { x: number; y: number };
  prop: Prop;
  /** the khata tucked under the far arm (hero, "one") or put down (at the desk) */
  khata: boolean;
  /** the lock and unlock drawings bend at the knees */
  crouch: boolean;
  /** the owner seen from behind (at the desk): the same drawing; kept for the atlas key */
  back: boolean;
}

const SEED = 1;

/**
 * Paint one drawing. ctx origin must be at the figure's feet, y up is negative (canvas convention).
 * h is the figure's height in canvas pixels; sw the stroke width in canvas pixels.
 */
function body(ctx: CanvasRenderingContext2D, h: number, sw: number, d: Drawing, shadow: boolean) {
    const ink = INK, fill = shadow ? INK : AMBER, alpha = shadow ? 0 : 1;
    ctx.save();
    ctx.strokeStyle = ink;
    ctx.lineJoin = 'round';
    const hd = h * 0.2;
    const bw = h * 0.3;
    const drop = d.crouch ? h * 0.2 : 0; // the crouch lowers head and body; the legs fold
    const ty = -h + hd * 1.15 + drop;
    const by = -h * 0.42 + drop;
    const ax = bw * 0.42;
    const ay = ty + h * 0.14;
    // the hand: film default is ex = 0.95bw (+0.06h for an odd seed), ey = ay + 0.1h; each pose moves it
    const ex = d.hand.x * h;
    const ey = -d.hand.y * h;
    const t = h * 0.22;

    // legs first, so the body sits over them
    ctx.lineWidth = sw * 1.15;
    ctx.lineCap = 'round';
    [-bw * 0.26, bw * 0.26].forEach((lx, i) => {
      const off = (SEED + i) % 3 === 0 ? h * 0.05 : 0;
      ctx.beginPath();
      ctx.moveTo(lx, by);
      if (d.crouch) {
        // a folded leg: hip to knee forward, knee to foot
        const kx = lx + (i ? 1 : -1) * bw * 0.35, ky = by * 0.45;
        ctx.lineTo(kx, ky);
        ctx.lineTo(lx + off, 0);
      } else ctx.lineTo(lx + off, 0);
      ctx.stroke();
    });

    // the khata, held flat against the body under the far arm: red cover, ink edge
    if (d.khata) {
      ctx.lineWidth = sw;
      ctx.fillStyle = alpha < 1 ? ink : KHATA;
      const kx = -bw * 0.62, kw = bw * 0.46, kh = h * 0.2, ky = ty + h * 0.12;
      ctx.beginPath();
      ctx.rect(kx, ky, kw, kh);
      ctx.fill();
      ctx.stroke();
    }

    // head
    ctx.lineWidth = sw;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(0, -h + hd / 2 + drop, hd / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // torso: the film's tapered body with its curved shoulder line
    ctx.beginPath();
    ctx.moveTo(-bw / 2, by);
    ctx.lineTo(-bw * 0.42, ty);
    ctx.quadraticCurveTo(0, ty - h * 0.045, bw * 0.42, ty);
    ctx.lineTo(bw / 2, by);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // the one arm
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    // the prop in the hand (film toolEl sizes: t = 0.22h)
    if (d.prop === 'phone' || d.prop === 'phone-lit') {
      const pw = t * 0.42, ph = t * 0.72;
      ctx.fillStyle = alpha < 1 ? ink : INK;
      ctx.beginPath();
      ctx.rect(ex - pw * 0.2, ey - ph * 0.55, pw, ph);
      ctx.fill();
      ctx.stroke();
      if (d.prop === 'phone-lit' && alpha === 1) {
        ctx.fillStyle = CREAM;
        ctx.fillRect(ex - pw * 0.2 + sw * 0.9, ey - ph * 0.55 + sw * 0.9, pw - sw * 1.8, ph - sw * 1.8);
      }
    } else if (d.prop === 'key') {
      ctx.beginPath();
      ctx.arc(ex + t * 0.12, ey - t * 0.1, t * 0.12, 0, Math.PI * 2);
      ctx.moveTo(ex + t * 0.2, ey);
      ctx.lineTo(ex + t * 0.55, ey + t * 0.25);
      ctx.stroke();
    } else if (d.prop === 'pen') {
      // film: pen from (ex, ey) to (ex + 0.5t, ey + 0.75t) at 1.1 stroke, round cap
      ctx.lineWidth = sw * 1.1;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + t * 0.5, ey + t * 0.75);
      ctx.stroke();
    }
    ctx.restore();
}

export function paintFigure(ctx: CanvasRenderingContext2D, h: number, sw: number, d: Drawing) {
  // the film's contact shadow: the whole figure as one group, offset 0.035h to camera right, ink at 12 percent,
  // hard edged; drawn as one layer so fill and stroke never double up where they overlap
  const tmp = document.createElement('canvas');
  tmp.width = ctx.canvas.width;
  tmp.height = ctx.canvas.height;
  const t = tmp.getContext('2d')!;
  t.setTransform(ctx.getTransform());
  t.translate(h * 0.035, 0);
  body(t, h, sw, d, true);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 0.12;
  ctx.drawImage(tmp, 0, 0);
  ctx.restore();
  body(ctx, h, sw, d, false);
}

/** the figure's extent around its feet, in figure units, for sizing the canvas (arm reach right, khata left) */
export const FIGURE_BOX = { left: -0.36, right: 0.72, top: 1.06 };
