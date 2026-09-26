import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';
import type { Cloud } from './shapes';

const VERT = /* glsl */ `
attribute vec3 aB;
attribute vec4 aRnd;
uniform float uT;
uniform float uTime;
uniform float uSize;
uniform float uPixel;
uniform float uTurb;
uniform float uScatter;
uniform vec2 uPointer;
uniform float uPointerStrength;
varying float vAlpha;
varying float vHeat;

vec3 curl(vec3 p) {
  return vec3(
    sin(p.y * 1.7 + cos(p.z * 1.3 + uTime * 0.11)),
    sin(p.z * 1.5 + cos(p.x * 1.9 - uTime * 0.07)),
    sin(p.x * 1.3 + cos(p.y * 1.1 + uTime * 0.05))
  );
}

void main() {
  float d = aRnd.x * 0.42;
  float t = smoothstep(d, d + 0.58, uT);
  vec3 p = mix(position, aB, t);
  float mid = sin(t * 3.14159265);
  float amp = (uTurb + mid * 0.42 + uScatter) * (0.35 + aRnd.z);
  p += curl(p * 1.25 + aRnd.y * 6.0) * amp * 0.5;
  p += 0.014 * vec3(sin(uTime * 0.8 + aRnd.w * 20.0), cos(uTime * 0.66 + aRnd.y * 20.0), sin(uTime * 0.5 + aRnd.x * 9.0));

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec4 clip = projectionMatrix * mv;
  vec2 ndc = clip.xy / clip.w;
  vec2 dp = ndc - uPointer;
  float dist = length(dp * vec2(1.6, 1.0));
  float push = uPointerStrength * exp(-dist * dist * 22.0);
  ndc += normalize(dp + 1e-5) * push * 0.12;
  clip.xy = ndc * clip.w;
  gl_Position = clip;

  float size = uSize * uPixel * (0.55 + aRnd.z * 1.15) / max(-mv.z, 0.1);
  gl_PointSize = size * (1.0 + push * 1.5);
  vAlpha = clamp(0.35 + aRnd.z * 0.65, 0.0, 1.0) * (1.0 - smoothstep(4.5, 9.0, -mv.z));
  vHeat = aRnd.w + mid * 0.35 + push;
}
`;

const FRAG = /* glsl */ `
precision mediump float;
uniform vec3 uAmber;
uniform vec3 uCream;
uniform vec3 uFlare;
uniform float uDim;
uniform float uCreamMix;
varying float vAlpha;
varying float vHeat;
void main() {
  float r = length(gl_PointCoord - 0.5);
  if (r > 0.5) discard;
  float a = pow(smoothstep(0.5, 0.0, r), 1.7);
  vec3 col = mix(uAmber, uCream, clamp(uCreamMix + smoothstep(0.7, 1.0, vHeat) * 0.55, 0.0, 1.0));
  col = mix(col, uFlare, step(0.985, fract(vHeat * 7.31)) * 0.9);
  gl_FragColor = vec4(col * a * vAlpha * uDim, 1.0);
}
`;

export type Tier = 'high' | 'mid' | 'low';

export interface Key {
  cloud: Cloud;
  /** 0 = amber, 1 = cream */
  cream?: number;
  turb?: number;
  /** world-space x offset so shapes can sit beside text */
  x?: number;
  y?: number;
  scale?: number;
}

export class Engine {
  readonly count: number;
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private group = new Group();
  private geo = new BufferGeometry();
  private mat: ShaderMaterial;
  private keys: Key[] = [];
  private segment = -1;
  private progress = 0;
  private pointer = new Vector2(10, 10);
  private pointerTarget = new Vector2(10, 10);
  private raf = 0;
  private running = false;
  private last = performance.now();
  private elapsed = 0;
  private scrollVel = 0;
  private dimTarget = 1;
  private lookX = 0;
  private lookY = 0;
  private place = { x: 0, y: 0, s: 1 };

  constructor(private canvas: HTMLCanvasElement, tier: Tier) {
    this.count = tier === 'high' ? 90000 : tier === 'mid' ? 42000 : 18000;
    const dpr = Math.min(window.devicePixelRatio || 1, tier === 'high' ? 1.75 : 1.5);
    this.renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(dpr);
    this.renderer.setClearColor(new Color('#0A0A0B'), 1);
    this.camera = new PerspectiveCamera(38, 1, 0.1, 40);
    this.camera.position.set(0, 0, 4.4);

    const n = this.count;
    const rnd = new Float32Array(n * 4);
    for (let i = 0; i < n * 4; i++) rnd[i] = Math.random();
    this.geo.setAttribute('position', new BufferAttribute(new Float32Array(n * 3), 3));
    this.geo.setAttribute('aB', new BufferAttribute(new Float32Array(n * 3), 3));
    this.geo.setAttribute('aRnd', new BufferAttribute(rnd, 4));

    this.mat = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: AdditiveBlending,
      uniforms: {
        uT: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: tier === 'high' ? 5.2 : 6.2 },
        uPixel: { value: dpr },
        uTurb: { value: 0.05 },
        uScatter: { value: 0 },
        uPointer: { value: this.pointer },
        uPointerStrength: { value: 0 },
        uAmber: { value: new Color('#FFB03B') },
        uCream: { value: new Color('#F5F1EB') },
        uFlare: { value: new Color('#FF4400') },
        uDim: { value: 1 },
        uCreamMix: { value: 0 },
      },
    });
    const pts = new Points(this.geo, this.mat);
    pts.frustumCulled = false;
    this.group.add(pts);
    this.scene.add(this.group);

    this.resize();
    window.addEventListener('resize', this.resize, { passive: true });
    window.addEventListener('pointermove', this.onPointer, { passive: true });
    document.addEventListener('pointerleave', () => this.pointerTarget.set(10, 10));
    document.addEventListener('visibilitychange', () => (document.hidden ? this.stop() : this.start()));
  }

  setKeys(keys: Key[]) {
    this.keys = keys;
    this.segment = -1;
    this.apply(true);
  }

  /** f runs from 0 to keys.length - 1 across the page. */
  setProgress(f: number) {
    this.progress = Math.max(0, Math.min(this.keys.length - 1, f));
  }

  setVelocity(v: number) {
    this.scrollVel = v;
  }

  /** Dim the field behind long reading passages (1 = full, 0.25 = quiet). */
  setDim(v: number) {
    this.dimTarget = v;
  }

  private onPointer = (e: PointerEvent) => {
    this.pointerTarget.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  };

  private resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // keep shapes inside narrow portrait screens
    this.camera.position.z = w / h < 0.8 ? 6.6 : w / h < 1.2 ? 5.4 : 4.4;
    this.camera.updateProjectionMatrix();
  };

  private upload(i: number) {
    const a = this.keys[i];
    const b = this.keys[Math.min(i + 1, this.keys.length - 1)];
    (this.geo.attributes.position as BufferAttribute).set(a.cloud);
    (this.geo.attributes.aB as BufferAttribute).set(b.cloud);
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.aB.needsUpdate = true;
  }

  private apply(force = false) {
    if (!this.keys.length) return;
    const i = Math.min(Math.floor(this.progress), this.keys.length - 2 < 0 ? 0 : this.keys.length - 2);
    if (i !== this.segment || force) {
      this.segment = i;
      this.upload(i);
    }
    const t = this.progress - i;
    this.mat.uniforms.uT.value = t;
    const a = this.keys[i];
    const b = this.keys[Math.min(i + 1, this.keys.length - 1)];
    const lerp = (x = 0, y = 0) => x + (y - x) * t;
    this.mat.uniforms.uCreamMix.value = lerp(a.cream ?? 0, b.cream ?? 0);
    this.mat.uniforms.uTurb.value = lerp(a.turb ?? 0.05, b.turb ?? 0.05);
    const narrow = window.innerWidth < 760;
    const tx = narrow ? 0 : lerp(a.x ?? 0, b.x ?? 0);
    const ty = lerp(a.y ?? 0, b.y ?? 0);
    const ts = lerp(a.scale ?? 1, b.scale ?? 1) * (narrow ? 0.92 : 1);
    this.place.x += (tx - this.place.x) * 0.08;
    this.place.y += (ty - this.place.y) * 0.08;
    this.place.s += (ts - this.place.s) * 0.08;
  }

  private tick = () => {
    if (!this.running) return;
    const now = performance.now();
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    this.elapsed += dt;
    this.apply();
    const u = this.mat.uniforms;
    u.uTime.value = this.elapsed;
    this.pointer.lerp(this.pointerTarget, 0.12);
    const onScreen = Math.abs(this.pointerTarget.x) <= 1 ? 1 : 0;
    u.uPointerStrength.value += (onScreen - u.uPointerStrength.value) * 0.06;
    u.uScatter.value += (Math.min(Math.abs(this.scrollVel) * 0.012, 0.35) - u.uScatter.value) * 0.1;
    u.uDim.value += (this.dimTarget - u.uDim.value) * 0.06;
    this.lookX += (this.pointer.x * (onScreen ? 0.12 : 0) - this.lookX) * 0.04;
    this.lookY += (this.pointer.y * (onScreen ? 0.08 : 0) - this.lookY) * 0.04;
    this.group.rotation.y = Math.sin(this.elapsed * 0.05) * 0.18 + this.lookX + (this.progress % 1) * 0.12;
    this.group.rotation.x = this.lookY * -1;
    this.group.position.set(this.place.x, this.place.y, 0);
    this.group.scale.setScalar(this.place.s);
    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(this.tick);
  };

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }
}
