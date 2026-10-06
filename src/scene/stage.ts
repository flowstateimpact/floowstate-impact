import * as THREE from 'three';
import gsap from 'gsap';
import Lenis from 'lenis';
import type { Content } from '../types';
import { auditFace, brandFace, edgeTexture, leafTexture, lineTexture, stockTexture, tableTexture, windowTexture, dice, type Ink } from './textures';
import { makePost } from './post';

interface Opts { poster: boolean; opening: 'a' | 'b'; onLive: () => void; onFail: () => void }

const TH = 0.07;            // one presentation board, 3 by 2, seven hundredths thick
const BW = 3, BD = 2;
const ST_Z0 = -8, ST_DZ = 4.8;
const LAMP_OFF = new THREE.Vector3(-31, 11.5, 6), LAMP_AIM_Z = -14.75, LAMP_ANGLE = 0.6;
const SLANT = LAMP_OFF.z / LAMP_OFF.x; // how far a bar's shadow drifts in z for each unit of x
const stZ = (i: number, x: number) => ST_Z0 - i * ST_DZ + SLANT * x;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const inOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
// The room is put together in short sittings so the page never stops answering the visitor while it loads.
let step = 0;
const breath = () => { performance.mark('room:' + step++); return new Promise<void>((r) => setTimeout(r, 0)); };
const mixHex = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), k);

const outQuart = (x: number) => 1 - Math.pow(1 - clamp01(x), 4);
const rad = (d: number) => (d * Math.PI) / 180;

/* THE TWO OPENINGS
   a  THE DEAL       The work is put down in front of you. Five boards are dealt across the table, past the lens, as the lamp comes up.
   b  THE SPREAD     A flat page, seen from straight above, that daylight crosses in one sweep. Scroll, and the page tips over into a room.
   Each board is placed by where it should sit in the FRAME (x and y from -1 to 1), then found on the table from there,
   so the composition holds at any window size. [x, y, turn in degrees, how many boards lie under it] */
type Spot = [number, number, number, number];
interface Comp { pos: [number, number, number]; look: [number, number, number]; aperture: number; typeDepth: number; boards: Spot[]; prints: Spot[]; sheet: [number, number, number, number, number] }
// boards in the order branding, websites, videos, images, audit. prints in the order: a second website, a phone screen, two photographs.
const COMP: Record<'a' | 'b', Record<'wide' | 'tall', Comp>> = {
  a: {
    wide: { pos: [-0.3, 2.7, 7.0], look: [0.5, 0.25, 0.3], aperture: 4.6, typeDepth: 5.6,
      boards: [[0.8, -0.46, -9, 1], [0.1, -0.72, 5, 2], [0.86, 0.34, 11, 0], [1.05, -0.78, -15, 0], [0.4, -0.36, -5, 0]],
      prints: [[0.72, 0.02, 14, 0], [-0.16, -0.3, 7, 0], [-0.52, -0.42, -10, 0], [0.99, -0.16, -4, 0]], sheet: [0.52, -0.2, 17, 3.7, 2.6] },
    tall: { pos: [0, 5.2, 11.5], look: [0, 0.2, 0.4], aperture: 5, typeDepth: 8.6,
      boards: [[0.3, -0.34, -8, 1], [-0.22, -0.72, 6, 2], [0.5, 0.0, 12, 0], [0.95, -0.82, -14, 0], [-0.55, -0.2, -6, 0]],
      prints: [[-0.7, -0.5, -10, 0], [0.75, -0.42, 7, 0], [-0.2, 0.02, 12, 0], [0.1, -0.5, -4, 0]], sheet: [0.2, -0.45, 18, 3.2, 2.6] },
  },
  b: {
    wide: { pos: [0, 12, -1.5], look: [0, 0, -1.5], aperture: 2, typeDepth: 0,
      boards: [[0.74, 0.6, -5, 0], [0.2, -0.52, 4, 0], [0.74, -0.42, 9, 1], [1.04, 0.08, -11, 1], [1.0, -1.02, -7, 0]],
      prints: [[0.34, -1.02, -4, 0], [-0.15, -0.44, -9, 0], [-0.52, -0.46, 7, 0], [0.88, -0.03, 12, 0]], sheet: [0.97, 0.14, 13, 3.9, 3.0] },
    tall: { pos: [0, 14, -1.5], look: [0, 0, -1.5], aperture: 2, typeDepth: 0,
      boards: [[0.4, -0.02, -6, 1], [-0.42, -0.34, 5, 0], [0.48, -0.6, 8, 1], [-0.62, 0.02, -10, 0], [0.9, -0.3, -9, 0]],
      prints: [[-0.6, -0.62, 7, 0], [0.8, 0.1, -9, 0], [0.0, -0.8, 12, 0], [-0.9, -0.3, -4, 0]], sheet: [0.1, -0.2, 14, 3.4, 2.8] },
  },
};

export async function start(canvas: HTMLCanvasElement, content: Content, opts: Opts) {
  const O = opts.opening;
  try {
    await Promise.all(['400 100px Zodiak', '700 100px Zodiak', 'italic 400 40px Zodiak'].map((f) => document.fonts.load(f)));
  } catch { /* the fallback serif will do */ }

  const css = getComputedStyle(document.documentElement);
  const ink: Ink = {
    base: css.getPropertyValue('--base').trim(),
    secondary: css.getPropertyValue('--secondary').trim(),
    highlight: css.getPropertyValue('--highlight').trim(),
  };
  const lampHex = css.getPropertyValue('--light').trim();

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  } catch {
    opts.onFail();
    return;
  }
  const small = Math.min(innerWidth, innerHeight) < 600;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;

  let dirty = true, shadowDirty = true;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 13, 40);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);

  // ---------- light: one low window to the left, a breath of fill, nothing else
  const lamp = new THREE.SpotLight(lampHex, 9, 0, LAMP_ANGLE, 0.12, 0);
  const lampAim = new THREE.Vector3(0, 0, LAMP_AIM_Z);
  lamp.position.copy(lampAim).add(LAMP_OFF);
  lamp.target.position.copy(lampAim);
  {
    // put the window's bars between the stations, so each piece of work lies in its own pane of light
    const flat = Math.hypot(LAMP_OFF.x, LAMP_OFF.z), across = Math.abs(LAMP_OFF.x) / flat;
    const span = 2 * LAMP_OFF.length() * Math.tan(LAMP_ANGLE);
    const zs = O === 'b' ? [] : [4.6]; // b lies in one clear pane; its light is shaped by the blind instead for (let i = 0; i <= 6; i++) zs.push(ST_Z0 + ST_DZ / 2 - i * ST_DZ);
    const sign = -1;
    lamp.map = windowTexture(zs.map((z) => 0.5 + (sign * (z - LAMP_AIM_Z) * across) / span), 0.9 / span);
  }
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(small ? 2048 : 4096, small ? 2048 : 4096);
  lamp.shadow.camera.near = 8; lamp.shadow.camera.far = 70;
  lamp.shadow.bias = -0.0005; lamp.shadow.normalBias = 0.012; lamp.shadow.radius = 5;
  scene.add(lamp, lamp.target);
  scene.add(new THREE.HemisphereLight(mixHex(ink.secondary, '#8fa6c8', 0.5), mixHex(ink.base, ink.highlight, 0.12), 0.16));

  await breath();
  // ---------- the table
  const tableMap = tableTexture();
  await breath();
  const table = new THREE.Mesh(
    new THREE.PlaneGeometry(110, 110),
    new THREE.MeshStandardMaterial({ color: mixHex(ink.base, ink.secondary, 0.078), map: tableMap, roughnessMap: tableMap, roughness: 0.92, metalness: 0 }),
  );
  table.rotation.x = -Math.PI / 2;
  table.position.set(0, 0, -15);
  table.receiveShadow = true;
  scene.add(table);

  // ---------- materials shared by every board
  const edgeTex = edgeTexture(ink, 61);
  const edge = new THREE.MeshStandardMaterial({ map: edgeTex.map, bumpMap: edgeTex.bump, bumpScale: 2.2, roughness: 0.78 });
  const under = new THREE.MeshStandardMaterial({ color: mixHex(ink.base, ink.secondary, 0.35), roughness: 0.95 });
  const paper = (extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.86, ...extra });
  const loader = new THREE.TextureLoader();
  const load = (url: string) => { const t = loader.load(url, () => { dirty = true; shadowDirty = true; }); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

  const boardGeo = new THREE.BoxGeometry(BW, TH, BD);
  const makeBoard = (face: THREE.Material) => {
    const m = new THREE.Mesh(boardGeo, [edge, edge, face, under, edge, edge]);
    m.castShadow = m.receiveShadow = true;
    return m;
  };

  // ---------- the five boards that carry the work
  const items = content.services.items;
  const N = items.length;
  const rnd = dice(4);

  const mark = (content.footer.line || content.meta.title).split(/[ .·]/)[0];
  await breath();
  const brand = brandFace(mark, ink);
  await breath();
  const audit = auditFace(items.find((i) => i.id === 'audit')?.name ?? '', items.find((i) => i.id === 'audit')?.line ?? '', ink);
  await breath();
  const filmStill = load('/media/film-still.webp'); // a frame of the studio's film with no caption burnt into it
  const filmMat = new THREE.MeshStandardMaterial({ map: filmStill, emissiveMap: filmStill, emissive: 0xffffff, emissiveIntensity: 0.42, roughness: 0.9 });
  const faces: Record<string, THREE.Material> = {
    branding: paper({ map: brand.map, bumpMap: brand.bump, bumpScale: 1.5 }),
    websites: paper({ map: load('/media/web-haldi.webp'), roughness: 0.7 }),
    videos: paper({ color: mixHex(ink.secondary, ink.base, 0.06) }),
    images: paper({ map: load('/media/img-kitchen.webp'), roughness: 0.62 }),
    audit: paper({ map: audit.map }),
  };

  interface Dealt { mesh: THREE.Mesh; home: THREE.Vector3; homeYaw: number; from: THREE.Vector3; order: number; to: THREE.Vector3; toYaw: number; lift: number }
  const dealt: Dealt[] = [];
  const side = (i: number) => (i % 2 === 0 ? 1 : -1); // which half of the frame the object takes; the type takes the other
  items.forEach((it, i) => {
    const mesh = makeBoard(faces[it.id] ?? paper());
    dealt.push({ mesh, home: new THREE.Vector3(), homeYaw: 0, from: new THREE.Vector3(), order: i, to: new THREE.Vector3(), toYaw: side(i) * (0.07 + rnd() * 0.07), lift: i === 0 ? 3.7 : 1.5 });
    scene.add(mesh);
    if (it.id === 'videos') {
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.72, 1.53), filmMat);
      screen.rotation.x = -Math.PI / 2;
      screen.position.y = TH / 2 + 0.002;
      screen.receiveShadow = true;
      mesh.add(screen);
    }
  });

  // ---------- loose prints already lying at their stations, and the one pencil somebody left
  const loose: (Dealt & { at: number; dx: number; dz: number })[] = [];
  const print = (url: string, w: number, d: number, at: number, dx: number, dz: number, yaw: number, y = 0.006) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.012, d), [under, under, paper({ map: load(url), roughness: 0.66 }), under, under, under]);
    m.castShadow = m.receiveShadow = true;
    scene.add(m);
    loose.push({ mesh: m, at, dx, dz, home: new THREE.Vector3(), homeYaw: 0, from: new THREE.Vector3(), order: 0, to: new THREE.Vector3(0, y, 0), toYaw: yaw, lift: 0.9 });
  };
  const at = (id: string) => items.findIndex((i) => i.id === id);
  if (at('websites') >= 0) {
    print('/media/web-lowfreq.webp', 2.3, 1.44, at('websites'), 1.15, -1.25, 0.2);
    print('/media/web-sonar-phone.webp', 0.74, 1.6, at('websites'), -2.05, 0.25, -0.13);
  }
  if (at('images') >= 0) {
    print('/media/img-taant.webp', 1.7, 1.275, at('images'), 1.5, -1.15, -0.22);
    print('/media/img-nouka.webp', 1.9, 1.07, at('images'), -1.9, 0.75, 0.12);
  }
  const pencil = new THREE.Group();
  {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 1.5, 6), new THREE.MeshStandardMaterial({ color: mixHex(ink.base, ink.secondary, 0.1), roughness: 0.42 }));
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.16, 6), new THREE.MeshStandardMaterial({ color: mixHex(ink.secondary, ink.base, 0.25), roughness: 0.9 }));
    tip.position.y = 0.83;
    body.castShadow = tip.castShadow = true;
    pencil.add(body, tip);
    pencil.rotation.set(Math.PI / 2, 0, 0.5);
    pencil.position.y = 0.034;
    scene.add(pencil);
  }

  // ---------- one sheet of the highlight stock, lying under the work: the loud tenth of the frame
  const sheet = new THREE.Mesh(new THREE.BoxGeometry(1, 0.008, 1), new THREE.MeshStandardMaterial({ map: stockTexture(ink.highlight, 77), roughness: 0.82 }));
  sheet.castShadow = sheet.receiveShadow = true;
  scene.add(sheet);

  // ---------- opening b: the blind. Never seen, only its shadow: it is drawn back and daylight crosses the table.
  const blind = new THREE.Group();
  {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(70, 120), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide }));
    m.rotation.x = -Math.PI / 2; m.position.x = 35;
    m.castShadow = true;
    blind.add(m);
    blind.rotation.y = 0.34;
    blind.position.set(-40, 6, 0);
    blind.visible = O === 'b';
    scene.add(blind);
  }

  await breath();
  // ---------- the add-on: a fan deck. Several leaves, one rivet. It is handed over whole.
  const fan = new THREE.Group();
  const leaves: THREE.Mesh[] = [];
  {
    const geo = new THREE.BoxGeometry(2.7, 0.02, 0.52);
    geo.translate(1.18, 0, 0);
    const L = 7;
    for (let i = 0; i < L; i++) {
      const tone = '#' + mixHex(ink.secondary, ink.base, 0.5 - (i / (L - 1)) * 0.5).getHexString();
      const leaf = new THREE.Mesh(geo, [edge, edge, paper({ map: leafTexture(tone, 40 + i) }), under, edge, edge]);
      leaf.position.y = 0.012 + i * 0.022;
      leaf.castShadow = leaf.receiveShadow = true;
      fan.add(leaf);
      leaves.push(leaf);
    }
    const rivet = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.17, 20), new THREE.MeshStandardMaterial({ color: mixHex(ink.base, ink.secondary, 0.16), roughness: 0.38, metalness: 0.6 }));
    rivet.position.y = 0.085;
    rivet.castShadow = true;
    fan.add(rivet);
    scene.add(fan);
  }

  // ---------- the opening line. It is read off the page, line for line, and rebuilt in the room exactly where the flat type stood.
  // In a it stands on glass behind the work, so boards pass in front of it. In b it is painted on the table, so the daylight crosses it.
  const E = 1.0; // exposure the lens applies; the glass ink is pre-compensated so it lands on the paper colour
  const sec = new THREE.Color(ink.secondary);
  const glassInk = new THREE.Color(-Math.log(1 - sec.r * 0.985) / E, -Math.log(1 - sec.g * 0.985) / E, -Math.log(1 - sec.b * 0.985) / E);
  const h1 = document.querySelector<HTMLElement>('.opening__line');
  const readLine = () => {
    const node = h1?.firstChild as Text | null;
    if (!h1 || !node || !node.data) return null;
    const cs = getComputedStyle(h1), range = document.createRange();
    const lines: string[] = []; let cur = '', top = 0;
    for (const m of node.data.matchAll(/\S+/g)) {
      range.setStart(node, m.index); range.setEnd(node, m.index + m[0].length);
      const r = range.getBoundingClientRect();
      if (cur && r.top - top > r.height * 0.5) { lines.push(cur); cur = ''; }
      if (!cur) top = r.top;
      cur += (cur ? ' ' : '') + m[0];
    }
    if (cur) lines.push(cur);
    const size = parseFloat(cs.fontSize);
    return { lines, font: { weight: cs.fontWeight, size, lead: parseFloat(cs.lineHeight) || size, track: parseFloat(cs.letterSpacing) || 0 }, x: h1.offsetLeft, y: h1.offsetTop, w: h1.offsetWidth, h: h1.offsetHeight };
  };
  let glass: THREE.Mesh | null = null;
  let typeDepth = 6;
  const typeAt = new THREE.Vector3();
  /** Call with the camera standing at the opening pose. depth is how far along the view the type sits. */
  const buildType = (depth: number) => {
    if (glass) { scene.remove(glass); ((glass.material as THREE.MeshBasicMaterial).map)?.dispose(); glass.geometry.dispose(); glass = null; }
    const L = readLine();
    if (!L) return;
    const pad = L.font.size * 0.3;
    const texture = lineTexture(L.lines, L.font, L.w, L.h, pad);
    const upp = (2 * depth * Math.tan(rad(camera.fov / 2))) / innerHeight; // room units per page pixel at that depth
    const mat = O === 'a'
      ? new THREE.MeshBasicMaterial({ map: texture, color: glassInk, transparent: true, alphaTest: 0.02, side: THREE.DoubleSide, fog: false })
      : new THREE.MeshStandardMaterial({ map: texture, color: 0xffffff, roughness: 0.9, transparent: true, alphaTest: 0.02, emissive: glassInk, emissiveMap: texture, emissiveIntensity: 1 });
    glass = new THREE.Mesh(new THREE.PlaneGeometry((L.w + pad * 2) * upp, (L.h + pad * 2) * upp), mat);
    glass.position.set((L.x + L.w / 2 - innerWidth / 2) * upp, -(L.y + L.h / 2 - innerHeight / 2) * upp, -depth).applyMatrix4(camera.matrixWorld);
    glass.quaternion.copy(camera.quaternion);
    typeAt.copy(glass.position);
    // The glass throws no shadow: seen from the lamp it is edge on, and its shadow would be one dark stroke across the work.
    if (O === 'b') glass.receiveShadow = true;
    glass.visible = !opts.poster;
    scene.add(glass);
  };

  // ---------- the film: one frame until the visitor is near, then the cut itself
  let video: HTMLVideoElement | null = null;
  const wakeFilm = () => {
    if (video) return;
    video = document.createElement('video');
    video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'auto';
    video.src = '/media/film-cut.mp4';
    video.addEventListener('playing', () => {
      const vt = new THREE.VideoTexture(video!);
      vt.colorSpace = THREE.SRGBColorSpace;
      filmMat.map = vt; filmMat.emissiveMap = vt; filmMat.needsUpdate = true;
    }, { once: true });
  };

  await breath();
  // ---------- lens and targets
  const post = makePost(small ? 14 : 26);
  post.uniforms.uFloor.value.set(ink.base);
  post.uniforms.uExposure.value = E;
  let rt: THREE.WebGLRenderTarget | null = null;

  // ---------- layout: where everything sits for this viewport, and where the camera stands for each beat
  interface Pose { pos: THREE.Vector3; look: THREE.Vector3; aperture: number }
  let poses: Pose[] = [];
  let through = new THREE.Vector3();
  let portrait = false;
  const UP_ROOM = new THREE.Vector3(0, 1, 0), UP_PAGE = new THREE.Vector3(0, 0, -1);
  const ray = new THREE.Vector3();
  /** Where a point of the frame (x and y from -1 to 1) falls on the table, seen from the camera as it stands now. */
  const onTable = (nx: number, ny: number, y = 0) => {
    ray.set(nx, ny, 0.5).unproject(camera).sub(camera.position).normalize();
    return camera.position.clone().addScaledVector(ray, (y - camera.position.y) / ray.y);
  };
  const layout = () => {
    const w = innerWidth, h = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    portrait = w / h < 0.85;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    const bw = Math.round(w * dpr), bh = Math.round(h * dpr);
    rt?.dispose();
    rt = new THREE.WebGLRenderTarget(bw, bh, { type: THREE.HalfFloatType, samples: 4, depthTexture: new THREE.DepthTexture(bw, bh) });
    rt.depthTexture!.type = THREE.UnsignedIntType;
    post.uniforms.tColor.value = rt.texture;
    post.uniforms.tDepth.value = rt.depthTexture;
    post.uniforms.uPx.value.set(1 / bw, 1 / bh);
    post.uniforms.uMaxBlur.value = (bh / 900) * 20;
    camera.aspect = w / h;
    camera.fov = portrait ? 46 : 32;
    camera.updateProjectionMatrix();

    // stand the camera at the opening, and compose the frame from there
    const C = COMP[O][portrait ? 'tall' : 'wide'];
    const p0: Pose = { pos: new THREE.Vector3(...C.pos), look: new THREE.Vector3(...C.look), aperture: C.aperture };
    camera.position.copy(p0.pos);
    camera.up.copy(O === 'b' ? UP_PAGE : UP_ROOM);
    camera.lookAt(p0.look);
    camera.updateMatrixWorld();
    typeDepth = O === 'b' ? p0.pos.y - 0.006 : C.typeDepth;
    buildType(typeDepth);
    dealt.forEach((d, i) => {
      const [nx, ny, turn, under] = C.boards[i] ?? C.boards[C.boards.length - 1];
      d.home.copy(onTable(nx, ny)); d.home.y = TH / 2 + 0.012 + under * (TH + 0.004) + i * 0.003; // no two faces ever share a height
      d.homeYaw = rad(turn);
      d.order = under * 10 - ny; // what lies underneath lands first; among those, the far ones first
      d.from.copy(onTable(1.25 + i * 0.12, -2.6)); d.from.y = 1.5 + (i % 3) * 0.35;
    });
    loose.forEach((l, i) => {
      const [nx, ny, turn, under] = C.prints[i] ?? C.prints[C.prints.length - 1];
      l.home.copy(onTable(nx, ny)); l.home.y = 0.008 + under * (TH + 0.012) + i * 0.013;
      l.homeYaw = rad(turn);
      l.order = 5 + under * 10 - ny;
      l.from.copy(onTable(1.15 + i * 0.15, -2.4)); l.from.y = 1.3 + (i % 2) * 0.4;
    });
    [...dealt, ...loose].sort((a, b) => a.order - b.order).forEach((d, k) => { d.order = k; });
    { const [nx, ny, turn, sw, sd] = C.sheet; sheet.position.copy(onTable(nx, ny)); sheet.position.y = 0.006; sheet.rotation.y = rad(turn); sheet.scale.set(sw, 1, sd); }
    blind.position.z = p0.look.z;

    const sx = portrait ? 0 : 1.05;
    dealt.forEach((d, i) => d.to.set(side(i) * sx, TH / 2 + 0.014, stZ(i, side(i) * sx)));
    loose.forEach((l) => { const s = portrait ? 0 : side(l.at) * sx; l.to.x = s + l.dx * (portrait ? 0.8 : 1); l.to.z = stZ(l.at, s) + l.dz; });
    const a = at('audit');
    if (a >= 0) pencil.position.set((portrait ? 0 : side(a) * sx) - side(a) * 1.75, 0.034, stZ(a, side(a) * sx) + 0.35);
    { const fx = portrait ? 0 : side(N) * sx; fan.position.set(fx - 1.15, 0, stZ(N, fx) + (portrait ? 1.5 : 0.75)); }

    poses = [p0];
    for (let k = 0; k <= N; k++) {
      const s = side(k), bx = portrait ? 0 : s * sx, bz = stZ(k, bx);
      poses.push(portrait
        ? { pos: new THREE.Vector3(bx, 7.6, bz + 4.4), look: new THREE.Vector3(bx, 0, bz + 1.55), aperture: 11 }
        : { pos: new THREE.Vector3(bx - s * 0.7, 5.3, bz + 5.7), look: new THREE.Vector3(bx - s * 1.35, 0, bz - 0.1), aperture: 12 });
    }
    // a: the camera leaves through the line itself, so for a moment the type is larger than the window
    through.copy(typeAt).addScaledVector(tmpB.copy(p0.look).sub(p0.pos).normalize(), 1.1);
    through.y = Math.max(through.y, 1.1);
    measure();
    dirty = true; shadowDirty = true;
  };

  // ---------- scroll: the page position becomes one number, 0 at the opening, k at the k-th beat
  const beats = Array.from(document.querySelectorAll<HTMLElement>('.svc'));
  const pins = [document.querySelector<HTMLElement>('.svchead__pin'), ...beats.map((b) => b.querySelector<HTMLElement>('.svc__pin'))];
  const later = document.querySelector<HTMLElement>('.later');
  const openingPin = document.querySelector<HTMLElement>('.opening__pin');
  let anchors: number[] = [0];
  let laterTop = Infinity;
  function measure() {
    const vh = innerHeight;
    anchors = [0, ...beats.map((b) => b.offsetTop + (b.offsetHeight - vh) * 0.3)];
    laterTop = later ? later.offsetTop : Infinity;
  }
  const beatOf = (y: number) => {
    for (let k = 1; k < anchors.length; k++) {
      if (y < anchors[k]) return k - 1 + (y - anchors[k - 1]) / (anchors[k] - anchors[k - 1]);
    }
    return anchors.length - 1;
  };

  // ---------- the frame
  let live = false;
  let t = 0, lastT = -1;
  const mouse = new THREE.Vector2(), mouseNow = new THREE.Vector2();
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), pos = new THREE.Vector3(), look = new THREE.Vector3();
  const right = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);

  let t0 = -1; // the moment the room was first drawn; the opening plays from here, with no scroll
  const DEAL = 0.72, GAP = 0.06, SWEEP = 2.0;
  const place = (time: number) => {
    const tt = opts.poster ? 60 : t0 < 0 ? 0 : time - t0;
    const near = 1 - smooth(0.02, 0.5, t); // 1 while the visitor is still at the opening

    // light on load. a: the lamp comes up. b: the blind is drawn back and daylight runs across the page.
    lamp.intensity = (9 + 4.5 * near) * (O === 'a' ? 0.04 + 0.96 * smooth(0.0, 1.1, tt) : 1);
    if (O === 'b') {
      // the painted line starts as bright as the flat type it replaces, then hands over to the daylight as the light front reaches it
      if (glass) (glass.material as THREE.MeshStandardMaterial).emissiveIntensity = 1 - 0.8 * smooth(0.3, 1.3, tt);
      const reach = (portrait ? 0.5 : 1) * 5.4;
      blind.position.x = -31 + (31 - reach * 1.25 + (1 - Math.pow(1 - clamp01((tt - 0.2) / SWEEP), 2.4)) * reach * 4.2) / 2.09;
    }

    // boards. a: each is dealt in past the lens and lands, one after another. Then, on scroll, each leaves for its station.
    const deal = (d: Dealt, i: number, yawSign: number) => {
      tmpA.copy(d.home);
      let yaw = d.homeYaw, tip = 0;
      if (O === 'a') {
        const p = clamp01((tt - 0.05 - d.order * GAP) / DEAL), e = outQuart(p);
        tmpA.lerpVectors(d.from, d.home, e);
        tmpA.y = d.home.y + (d.from.y - d.home.y) * Math.pow(1 - p, 2.2);
        yaw += (1 - e) * (0.9 + (i % 2) * 0.5) * yawSign;
        tip = (1 - e) * 0.16;
      }
      return [yaw, tip] as const;
    };
    dealt.forEach((d, i) => {
      const f = inOut(clamp01((t - i - 0.06) / 0.8));
      const [yaw, tip] = deal(d, i, i % 2 ? -1 : 1);
      d.mesh.position.lerpVectors(tmpA, d.to, f);
      const arc = Math.sin(Math.PI * f);
      d.mesh.position.y += arc * d.lift;
      d.mesh.rotation.set((i === 0 ? arc * 0.62 : -arc * 0.42) - tip, THREE.MathUtils.lerp(yaw, d.toYaw, f) + arc * 0.25 * side(i), arc * 0.1 * side(i) + tip * 0.6, 'YXZ');
    });
    // the loose prints leave with their board and are set down around it
    loose.forEach((l, i) => {
      const f = inOut(clamp01((t - l.at - 0.02 - (i % 2) * 0.06) / 0.76));
      const [yaw, tip] = deal(l, i + 1, i % 2 ? 1 : -1);
      l.mesh.position.lerpVectors(tmpA, l.to, f);
      const arc = Math.sin(Math.PI * f);
      l.mesh.position.y += arc * l.lift;
      l.mesh.rotation.set(-arc * 0.3 - tip, THREE.MathUtils.lerp(yaw, l.toYaw, f), tip * 0.6, 'YXZ');
    });
    const open = smooth(N + 0.25, N + 1, t);
    leaves.forEach((l, i) => { l.rotation.y = 0.06 + i * 0.012 + i * 0.165 * open; });

    // camera: holds on the opening, then walks the table beat to beat
    const k = Math.min(Math.floor(t), poses.length - 2);
    const raw = t - k;
    const A = poses[k], B = poses[k + 1];
    let u: number;
    camera.up.copy(UP_ROOM);
    if (k === 0 && O === 'a') {
      u = smooth(0.2, 0.86, raw);
      const m = 1 - u;
      pos.set(0, 0, 0).addScaledVector(A.pos, m * m).addScaledVector(through, 2 * u * m).addScaledVector(B.pos, u * u);
      look.lerpVectors(A.look, B.look, smooth(0.3, 0.9, raw));
    } else if (k === 0) {
      // b: the page tips over. The camera comes down off the vertical and the flat spread becomes a table running away from you.
      u = smooth(0.04, 0.9, raw);
      pos.lerpVectors(A.pos, B.pos, u);
      look.lerpVectors(A.look, B.look, smooth(0.04, 0.8, raw));
      camera.up.lerpVectors(UP_PAGE, UP_ROOM, smooth(0.0, 0.6, raw)).normalize();
    } else {
      u = smooth(0.1, 0.9, raw);
      pos.lerpVectors(A.pos, B.pos, u);
      pos.y += Math.sin(Math.PI * u) * 0.35;
      look.lerpVectors(A.look, B.look, u);
    }
    // while nobody scrolls the camera is never quite still: it eases toward the work, the way a held shot breathes
    const drift = near * (O === 'a' ? 0.28 : -0.7) * (1 - Math.exp(-Math.max(0, tt - 0.2) / 7));
        pos.addScaledVector(tmpB.copy(look).sub(pos).normalize(), drift);
    mouseNow.lerp(mouse, 0.06);
    camera.position.copy(pos);
    camera.lookAt(look);
    right.setFromMatrixColumn(camera.matrixWorld, 0); up.setFromMatrixColumn(camera.matrixWorld, 1);
    camera.position.addScaledVector(right, mouseNow.x * 0.16).addScaledVector(up, mouseNow.y * 0.07);
    camera.lookAt(look);
    const reachTo = tmpB.copy(look).sub(camera.position).length();
    post.uniforms.uFocus.value = k === 0 && O === 'a' ? THREE.MathUtils.lerp(typeDepth, reachTo, u) : reachTo; // a: the line is what is sharp at the opening
    post.uniforms.uAperture.value = THREE.MathUtils.lerp(A.aperture, B.aperture, u) * (innerHeight * Math.min(devicePixelRatio || 1, 2)) / 900;

    pins.forEach((p, i) => p?.classList.toggle('is-on', i === 0 ? t > 0.6 && t < 0.9 : i === 1 ? t > 0.93 && t < 1.36 : Math.abs(t - i) < 0.36));
    if (openingPin) { const o = 1 - smooth(0.015, 0.1, t); openingPin.style.setProperty('--o', o.toFixed(3)); openingPin.style.pointerEvents = o < 0.5 ? 'none' : ''; }
    const film = at('videos') + 1;
    if (film > 0) {
      if (t > film - 1.6) wakeFilm();
      if (video) { if (Math.abs(t - film) < 0.8) { if (video.paused) void video.play().catch(() => {}); } else if (!video.paused) video.pause(); }
    }
    return tt;
  };

  const frame = (time: number) => {
    const y = scrollY;
    if (y > laterTop + innerHeight * 0.2) return; // the paper has covered the room; nothing to draw
    t = opts.poster ? 0 : beatOf(y);
    if (t0 < 0 && live) t0 = time;
    const tt = place(time);
    if (Math.abs(t - lastT) > 1e-5 || shadowDirty || dirty || tt < 3.2 ) renderer.shadowMap.needsUpdate = true;
    lastT = t; dirty = false; shadowDirty = false;
    post.uniforms.uTime.value = time;
    renderer.setRenderTarget(rt);
    renderer.render(scene, camera);
    post.render(renderer);
    if (!live) { live = true; requestAnimationFrame(() => opts.onLive()); }
  };

  layout();
  await breath();
  // hand every surface and every shader to the graphics card ahead of the first frame, one at a time
  const seen = new Set<THREE.Texture>();
  scene.traverse((o) => {
    const ms = (o as THREE.Mesh).material;
    for (const m of Array.isArray(ms) ? ms : ms ? [ms] : []) {
      for (const key of ['map', 'bumpMap', 'roughnessMap', 'emissiveMap'] as const) {
        const tx = (m as unknown as Record<string, THREE.Texture | null>)[key];
        if (tx && tx.image && (tx.image as { width?: number }).width) seen.add(tx);
      }
    }
  });
  if (lamp.map) seen.add(lamp.map);
  for (const tx of seen) { renderer.initTexture(tx); await breath(); }
  try { await renderer.compileAsync(scene, camera); await post.compile(renderer); } catch { /* compiles on first frame instead */ }
  await breath();
  const lenis = new Lenis({ lerp: 0.11, anchors: true });
  gsap.ticker.lagSmoothing(0);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); frame(time); });
  let rz = 0;
  addEventListener('resize', () => { clearTimeout(rz); rz = window.setTimeout(layout, 120); });
  addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') mouse.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1)); }, { passive: true });
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); opts.onFail(); });
  (window as unknown as { __stage: unknown }).__stage = { renderer, beat: () => t, since: () => (t0 < 0 ? -1 : performance.now() / 1000 - t0) };
}
