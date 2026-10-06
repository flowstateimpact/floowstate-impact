import * as THREE from 'three';

// Every surface in the room is drawn here from our own arithmetic. No borrowed noise, no downloaded maps.

/** A small deterministic generator (multiply, xor, shift with our own constants). */
export function dice(seed: number) {
  let s = (seed * 2654435 + 91) >>> 0;
  return () => {
    s ^= s << 9; s >>>= 0;
    s ^= s >>> 7;
    s = Math.imul(s, 0x3c9a5b17) >>> 0;
    s = (s ^ (s >>> 14)) >>> 0;
    return s / 4294967296;
  };
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')!] as const;
}

function tex(c: HTMLCanvasElement, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Speckle a canvas with fine tooth, the way uncoated stock looks under a raking light.
 *  The grain is rolled once on a small tile and laid across the sheet, so a large sheet costs no more than a small one. */
const tiles = new Map<string, HTMLCanvasElement>();
function tooth(g: CanvasRenderingContext2D, w: number, h: number, amount: number, seed: number) {
  const key = amount + ':' + (seed % 5);
  let tile = tiles.get(key);
  if (!tile) {
    const T = 256;
    const [c, tg] = canvas(T, T);
    const img = tg.createImageData(T, T);
    const r = dice(seed);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (r() + r() - 1) * amount;
      const v = n > 0 ? 255 : 0;
      d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = Math.abs(n);
    }
    tg.putImageData(img, 0, 0);
    tiles.set(key, (tile = c));
  }
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
  g.fillStyle = g.createPattern(tile, 'repeat')!;
  g.translate((seed * 37) % 256, (seed * 91) % 256);
  g.fillRect(-256, -256, w + 256, h + 256);
  g.restore();
}

/** The table: a dark worked surface. Grey values only; the material tints it. */
export function tableTexture() {
  const S = 1024;
  const [c, g] = canvas(S, S);
  g.fillStyle = '#b4b4b4';
  g.fillRect(0, 0, S, S);
  const r = dice(11);
  for (let i = 0; i < 70; i++) { // slow blotches: years of hands and cups
    const x = r() * S, y = r() * S, rad = 60 + r() * 220;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    const v = r() > 0.5 ? 255 : 0;
    gr.addColorStop(0, `rgba(${v},${v},${v},${0.03 + r() * 0.05})`);
    gr.addColorStop(1, `rgba(${v},${v},${v},0)`);
    g.fillStyle = gr;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  for (let i = 0; i < 160; i++) { // knife and ruler marks, mostly along one direction
    const x = r() * S, y = r() * S, len = 30 + r() * 260, a = (r() - 0.5) * 0.5 + (r() > 0.85 ? 1.4 : 0);
    g.strokeStyle = `rgba(${r() > 0.6 ? 255 : 20},${r() > 0.6 ? 255 : 20},${r() > 0.6 ? 250 : 20},${0.04 + r() * 0.1})`;
    g.lineWidth = 0.5 + r() * 0.8;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); g.stroke();
  }
  tooth(g, S, S, 26, 5);
  const t = tex(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(9, 9);
  return t;
}

/** The window. Projected through the lamp so the light arrives in panes, with the frame's bars falling between the stations.
 *  bars: where each bar sits across the window, 0 to 1. */
export function windowTexture(bars: number[], barWidth: number) {
  const S = 1024;
  const [c, g] = canvas(S, S);
  const gr = g.createLinearGradient(0, 0, 0, S);
  gr.addColorStop(0, '#5a5a5a'); gr.addColorStop(0.35, '#ffffff'); gr.addColorStop(0.62, '#d0d0d0'); gr.addColorStop(1, '#2c2c2c');
  g.fillStyle = gr;
  g.fillRect(0, 0, S, S);
  g.filter = 'blur(9px)';
  g.fillStyle = '#060606';
  for (const u of bars) g.fillRect(u * S - (barWidth * S) / 2, -40, barWidth * S, S + 80);
  g.filter = 'none';
  return tex(c);
}

export interface Ink { base: string; secondary: string; highlight: string }

function wrap(g: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (line && g.measureText(t).width > maxW) { lines.push(line); line = w; } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

/** The opening line, drawn line for line as the page itself broke it, so the room's type lands exactly where the flat type stood.
 *  White on clear; the material gives it its colour. Sizes are in page pixels; k is texture pixels per page pixel. */
export function lineTexture(lines: string[], font: { weight: string; size: number; lead: number; track: number }, w: number, h: number, pad: number) {
  const k = Math.min(3, 4096 / (w + pad * 2), 4096 / (h + pad * 2));
  const [c, g] = canvas(Math.ceil((w + pad * 2) * k), Math.ceil((h + pad * 2) * k));
  g.scale(k, k);
  g.font = `${font.weight} ${font.size}px Zodiak`;
  g.fillStyle = '#fff';
  g.textBaseline = 'alphabetic';
  (g as unknown as { letterSpacing: string }).letterSpacing = `${font.track}px`;
  const m = g.measureText('Hg');
  const asc = m.fontBoundingBoxAscent, desc = m.fontBoundingBoxDescent;
  lines.forEach((l, i) => g.fillText(l, pad, pad + i * font.lead + (font.lead - (asc + desc)) / 2 + asc));
  const t = tex(c);
  t.generateMipmaps = true;
  return t;
}

/** The painted edge of a board: colour laid on by roller over grey card, so it is never one flat tone.
 *  Thin where the roller ran dry, a darker seam where the liner meets the core, the odd nick down to the card. */
export function edgeTexture(ink: Ink, seed: number) {
  const W = 1024, H = 32;
  const [c, g] = canvas(W, H);
  g.fillStyle = ink.highlight; g.fillRect(0, 0, W, H);
  const r = dice(seed);
  for (let i = 0; i < 60; i++) { // long uneven passes of the roller
    const x = r() * W, len = 80 + r() * 400, y = r() * H, th = 1 + r() * 5;
    g.fillStyle = r() > 0.5 ? `rgba(0,0,0,${0.03 + r() * 0.09})` : `rgba(255,220,190,${0.03 + r() * 0.08})`;
    g.fillRect(x, y, len, th);
  }
  g.fillStyle = 'rgba(0,0,0,0.22)'; g.fillRect(0, 3, W, 1.5); g.fillRect(0, H - 4.5, W, 1.5); // liner seams
  g.fillStyle = 'rgba(0,0,0,0.1)'; g.fillRect(0, 0, W, 2); g.fillRect(0, H - 2, W, 2);
  for (let i = 0; i < 26; i++) { // nicks: the card shows through
    g.fillStyle = `rgba(214,200,180,${0.25 + r() * 0.5})`;
    g.fillRect(r() * W, r() > 0.5 ? r() * 4 : H - r() * 5, 2 + r() * 9, 1 + r() * 2.5);
  }
  tooth(g, W, H, 22, seed + 3);
  const [b, bg] = canvas(W, H); // height: fibres along the length
  bg.fillStyle = '#808080'; bg.fillRect(0, 0, W, H);
  for (let i = 0; i < 500; i++) { const v = r() > 0.5 ? 255 : 0; bg.fillStyle = `rgba(${v},${v},${v},${0.05 + r() * 0.12})`; bg.fillRect(r() * W, r() * H, 10 + r() * 70, 1); }
  tooth(bg, W, H, 40, seed + 9);
  return { map: tex(c), bump: tex(b, false) };
}

/** A sheet of coloured stock, with the tooth of uncoated paper. */
export function stockTexture(tone: string, seed: number) {
  const [c, g] = canvas(512, 512);
  g.fillStyle = tone; g.fillRect(0, 0, 512, 512);
  tooth(g, 512, 512, 12, seed);
  return tex(c);
}

const FW = 1200, FH = 800;

/** Branding: the firm's own mark pressed blind into the stock, above the palette painted out at 60, 30 and 10. */
export function brandFace(mark: string, ink: Ink) {
  const [c, g] = canvas(FW, FH);
  g.fillStyle = ink.secondary;
  g.fillRect(0, 0, FW, FH);
  const chipY = FH * 0.74, chipH = FH * 0.26;
  g.fillStyle = ink.base; g.fillRect(0, chipY, FW * 0.6, chipH);
  g.fillStyle = ink.secondary; g.fillRect(FW * 0.6, chipY, FW * 0.3, chipH);
  g.fillStyle = 'rgba(0,0,0,0.13)'; g.fillRect(FW * 0.6, chipY, FW * 0.3, chipH);
  g.fillStyle = ink.highlight; g.fillRect(FW * 0.9, chipY, FW * 0.1, chipH);
  g.fillStyle = 'rgba(0,0,0,0.16)'; g.fillRect(0, chipY - 2, FW, 2);
  tooth(g, FW, FH, 9, 21);

  const [b, bg] = canvas(FW, FH); // height: white is the sheet, dark is pressed in
  bg.fillStyle = '#fff'; bg.fillRect(0, 0, FW, FH);
  bg.filter = 'blur(1.5px)';
  bg.fillStyle = '#000';
  let size = 250;
  bg.font = `700 ${size}px Zodiak`;
  const w = bg.measureText(mark).width;
  size = Math.min(size, (size * FW * 0.84) / w);
  bg.font = `700 ${size}px Zodiak`;
  (bg as unknown as { letterSpacing: string }).letterSpacing = `${-size * 0.02}px`;
  bg.fillText(mark, FW * 0.075, FH * 0.47);
  bg.filter = 'none';
  // Printed in the ground colour and pressed in the same pass, so it reads from across the table and still catches the light.
  g.fillStyle = ink.base;
  g.font = `700 ${size}px Zodiak`;
  (g as unknown as { letterSpacing: string }).letterSpacing = `${-size * 0.02}px`;
  g.fillText(mark, FW * 0.075, FH * 0.47);
  tooth(g, FW, FH, 6, 22);
  return { map: tex(c), bump: tex(b, false) };
}

/** The audit: a written sheet. Title, the one line, room for the findings, and the firm's ring pressed in the corner. */
export function auditFace(name: string, line: string, ink: Ink) {
  const [c, g] = canvas(FW, FH);
  g.fillStyle = ink.secondary;
  g.fillRect(0, 0, FW, FH);
  g.fillStyle = ink.base;
  g.font = '400 132px Zodiak';
  (g as unknown as { letterSpacing: string }).letterSpacing = '-3px';
  g.fillText(name, 84, 190);
  (g as unknown as { letterSpacing: string }).letterSpacing = '0px';
  g.font = 'italic 400 40px Zodiak';
  const ls = wrap(g, line, FW * 0.56);
  ls.forEach((l, i) => g.fillText(l, 88, 270 + i * 50));
  g.strokeStyle = 'rgba(0,0,0,0.3)';
  g.lineWidth = 1.5;
  const top = 300 + ls.length * 50;
  for (let y = top + 40; y < FH - 70; y += 58) { g.beginPath(); g.moveTo(88, y); g.lineTo(FW - 88, y); g.stroke(); }
  // the ring: struck slightly off square, ink uneven where the pad was dry
  g.save();
  g.translate(FW - 235, FH - 240); g.rotate(-0.16);
  g.strokeStyle = ink.highlight; g.globalAlpha = 0.92;
  g.lineWidth = 9; g.beginPath(); g.arc(0, 0, 118, 0.12, Math.PI * 2 - 0.05); g.stroke();
  g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 98, 0, Math.PI * 2); g.stroke();
  g.lineWidth = 12; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(-46, 4); g.lineTo(-12, 40); g.lineTo(52, -38); g.stroke();
  g.restore();
  g.globalAlpha = 1;
  tooth(g, FW, FH, 10, 33);
  return { map: tex(c) };
}

/** A plain painted leaf for the fan deck. */
export function leafTexture(tone: string, seed: number) {
  const [c, g] = canvas(512, 96);
  g.fillStyle = tone; g.fillRect(0, 0, 512, 96);
  tooth(g, 512, 96, 9, seed);
  return tex(c);
}
