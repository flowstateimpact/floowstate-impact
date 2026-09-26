// Point-cloud generators. Every generator returns exactly `n` xyz triples in a
// roughly [-1.6, 1.6] x [-1, 1] world box, so any two clouds can morph 1:1.

export type Cloud = Float32Array;

const rand = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Fill `out` by sampling random points from a candidate list, jittered in z. */
function fillFrom(cands: number[], n: number, depth: number, seed: number): Cloud {
  const r = rand(seed);
  const out = new Float32Array(n * 3);
  const m = cands.length / 2;
  if (m === 0) return out;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(r() * m) * 2;
    out[i * 3] = cands[k] + (r() - 0.5) * 0.004;
    out[i * 3 + 1] = cands[k + 1] + (r() - 0.5) * 0.004;
    out[i * 3 + 2] = (r() - 0.5) * depth;
  }
  return out;
}

/** Rasterise something onto a canvas and sample lit pixels as candidates. */
function sampleCanvas(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  w: number,
  h: number,
  worldW: number,
  step = 2,
): number[] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  draw(ctx, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const cands: number[] = [];
  const scale = worldW / w;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4] > 128) {
        cands.push((x - w / 2) * scale, -(y - h / 2) * scale);
      }
    }
  }
  return cands;
}

/** A drifting nebula: the resting state before anything has a shape. */
export function nebula(n: number, seed = 1): Cloud {
  const r = rand(seed);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const rad = Math.pow(r(), 0.55) * 2.4;
    out[i * 3] = Math.cos(a) * rad * 1.3;
    out[i * 3 + 1] = Math.sin(a) * rad * 0.7;
    out[i * 3 + 2] = (r() - 0.5) * 2.2;
  }
  return out;
}

/** One amber thread: a long filament crossing the frame, a single line of light. */
export function filament(n: number, seed = 2): Cloud {
  const r = rand(seed);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = r();
    const x = (t - 0.5) * 4.2;
    const y = Math.sin(t * Math.PI * 2.2 + 0.4) * 0.28 + Math.sin(t * 13.0) * 0.03;
    const spread = 0.015 + Math.pow(r(), 6) * 0.25;
    const a = r() * Math.PI * 2;
    out[i * 3] = x;
    out[i * 3 + 1] = y + Math.cos(a) * spread;
    out[i * 3 + 2] = Math.sin(a) * spread;
  }
  return out;
}

/** The FlowStãte ribbon mark, sampled from the real SVG (never redrawn). */
export async function ribbon(n: number, svgUrl: string, seed = 3): Promise<Cloud> {
  const img = new Image();
  img.decoding = 'async';
  img.src = svgUrl;
  await img.decode();
  const w = 640;
  const h = Math.round((w * img.naturalHeight) / img.naturalWidth) || 350;
  const cands = sampleCanvas(
    (ctx) => {
      ctx.filter = 'brightness(3)';
      ctx.drawImage(img, 0, 0, w, h);
    },
    w,
    h,
    3.0,
  );
  return fillFrom(cands, n, 0.35, seed);
}

/** 83 small figures in rooms: 56 filled (make or judge), 27 outline (gather). */
export function workers(n: number, seed = 4): Cloud {
  const w = 900;
  const h = 520;
  const cands = sampleCanvas(
    (ctx) => {
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      const cols = 14;
      const rows = 6;
      let k = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (k >= 83) break;
          const x = 60 + col * 57 + (row % 2) * 12;
          const y = 50 + row * 78;
          const filled = k < 56;
          const lead = k % 14 === 0;
          const s = lead ? 1.25 : 1;
          ctx.beginPath();
          ctx.arc(x, y, 7 * s, 0, Math.PI * 2);
          filled ? ctx.fill() : ctx.stroke();
          ctx.beginPath();
          ctx.roundRect(x - 9 * s, y + 11 * s, 18 * s, 34 * s, 8);
          filled ? ctx.fill() : ctx.stroke();
          k++;
        }
      }
    },
    w,
    h,
    3.2,
  );
  return fillFrom(cands, n, 0.5, seed);
}

/** Five doors in perspective: nothing leaves until it passes all five. */
export function doors(n: number, seed = 5): Cloud {
  const r = rand(seed);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const d = Math.floor(r() * 5);
    const z = 0.9 - d * 0.55;
    const s = 1 - d * 0.1;
    const wHalf = 0.42 * s;
    const hHalf = 0.78 * s;
    // perimeter of a door frame, points concentrated on the edges
    const edge = r() * 4;
    let x = 0;
    let y = 0;
    const t = edge % 1;
    if (edge < 1) { x = -wHalf + t * 2 * wHalf; y = hHalf; }
    else if (edge < 2) { x = wHalf; y = hHalf - t * 2 * hHalf; }
    else if (edge < 3) { x = -wHalf; y = hHalf - t * 2 * hHalf; }
    else { x = -wHalf + t * 2 * wHalf; y = -hHalf; }
    const j = Math.pow(r(), 3) * 0.05;
    out[i * 3] = x + (r() - 0.5) * j + (d - 2) * 0.12;
    out[i * 3 + 1] = y + (r() - 0.5) * j;
    out[i * 3 + 2] = z;
  }
  return out;
}

/** A single figure: "there is only one of him". */
export function one(n: number, seed = 6): Cloud {
  const w = 400;
  const h = 400;
  const cands = sampleCanvas(
    (ctx) => {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(200, 120, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(150, 172, 100, 190, 44);
      ctx.fill();
    },
    w,
    h,
    1.6,
  );
  return fillFrom(cands, n, 0.25, seed);
}

/** Text as particles (numbers, short words). */
export function text(n: number, str: string, font: string, seed = 7): Cloud {
  const w = 1000;
  const h = 360;
  const cands = sampleCanvas(
    (ctx) => {
      ctx.fillStyle = '#fff';
      ctx.font = font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(str, w / 2, h / 2);
    },
    w,
    h,
    3.4,
  );
  return fillFrom(cands, n, 0.2, seed);
}

/** A ringed horizon: the kept system, a room of your own. */
export function room(n: number, seed = 8): Cloud {
  const r = rand(seed);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = r();
    if (u < 0.55) {
      // a cube-room wireframe
      const e = Math.floor(r() * 12);
      const t = r() * 2 - 1;
      const s = 0.7;
      const axes = [
        [t, 1, 1], [t, -1, 1], [t, 1, -1], [t, -1, -1],
        [1, t, 1], [-1, t, 1], [1, t, -1], [-1, t, -1],
        [1, 1, t], [-1, 1, t], [1, -1, t], [-1, -1, t],
      ][e];
      out[i * 3] = axes[0] * s;
      out[i * 3 + 1] = axes[1] * s * 0.8;
      out[i * 3 + 2] = axes[2] * s;
    } else {
      // warm floor glow inside
      const a = r() * Math.PI * 2;
      const rad = Math.sqrt(r()) * 0.6;
      out[i * 3] = Math.cos(a) * rad;
      out[i * 3 + 1] = -0.56 + (r() - 0.5) * 0.02;
      out[i * 3 + 2] = Math.sin(a) * rad;
    }
  }
  return out;
}
