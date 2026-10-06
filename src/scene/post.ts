import * as THREE from 'three';

// The lens. One pass, written here: thin focus from the depth of the room, a soft shoulder on the highlights,
// the page's own ground colour as the darkest tone (never pure black), lens falloff, and coarse grain.

const vert = /* glsl */ `
out vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const frag = /* glsl */ `
precision highp float;
uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform vec2 uPx;
uniform float uNear, uFar, uFocus, uAperture, uMaxBlur, uTime, uExposure, uGrain;
uniform vec3 uFloor;
in vec2 vUv;
out vec4 outColor;

float dist(float d) { return (uNear * uFar) / (uFar - d * (uFar - uNear)); }
float circle(float z) { return min(abs(z - uFocus) / z * uAperture, uMaxBlur); }

uint stir(uint x) { x ^= x >> 15; x *= 0x4f1b2a6du; x ^= x >> 13; x *= 0x7a53c0e9u; x ^= x >> 16; return x; }
float roll(vec2 p, float s) { uvec2 q = uvec2(p); return float(stir(q.x * 0x1f35a7bdu + stir(q.y + uint(s) * 977u)) >> 8) / 16777216.0; }

vec3 encode(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }

void main() {
  float zc = dist(texture(tDepth, vUv).x);
  float c = circle(zc);
  vec3 acc = texture(tColor, vUv).rgb;
  float w = 1.0;
  if (c > 0.5) {
    float turn = roll(gl_FragCoord.xy, 3.0) * 6.2831853;
    for (int i = 0; i < TAPS; i++) {
      float fi = float(i) + 0.5;
      float r = sqrt(fi / float(TAPS));
      float a = fi * 2.3999632 + turn;
      vec2 uv = vUv + vec2(cos(a), sin(a)) * r * c * uPx;
      float zs = dist(texture(tDepth, uv).x);
      // something nearer and sharper than this pixel must not smear into it
      float ws = zs >= zc ? 1.0 : smoothstep(0.0, 1.0, circle(zs) / (r * c + 0.001));
      acc += texture(tColor, uv).rgb * ws;
      w += ws;
    }
  }
  vec3 col = acc / w;

  vec2 q = vUv - 0.5;
  float fall = 1.0 / (1.0 + dot(q, q) * 1.15);
  col *= fall * fall * uExposure;

  col = 1.0 - exp(-col);                       // highlights roll off, they never clip hard
  col = uFloor + col * (1.0 - uFloor);         // the darkest tone in the room is the page's ground

  vec3 e = encode(col);
  float lum = dot(e, vec3(0.3, 0.59, 0.11));
  float frame = floor(uTime * 16.0);
  float g = roll(floor(gl_FragCoord.xy / 1.5), frame) + roll(floor(gl_FragCoord.xy / 2.7) + 91.0, frame + 7.0) * 0.6 - 0.8;
  e += g * uGrain * (0.45 + 0.9 * (1.0 - lum));
  outColor = vec4(e, 1.0);
}
`;

export function makePost(taps: number) {
  const uniforms = {
    tColor: { value: null as THREE.Texture | null },
    tDepth: { value: null as THREE.Texture | null },
    uPx: { value: new THREE.Vector2() },
    uNear: { value: 0.1 }, uFar: { value: 80 },
    uFocus: { value: 7 }, uAperture: { value: 8 }, uMaxBlur: { value: 18 },
    uTime: { value: 0 }, uExposure: { value: 1 }, uGrain: { value: 0.042 },
    uFloor: { value: new THREE.Color() },
  };
  const mat = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: 'in vec3 position; in vec2 uv;\n' + vert,
    fragmentShader: `#define TAPS ${taps}\n` + frag,
    uniforms, depthTest: false, depthWrite: false,
  });
  const tri = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  tri.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.add(tri);
  const cam = new THREE.Camera();
  return { uniforms, compile: (r: THREE.WebGLRenderer) => r.compileAsync(scene, cam), render: (r: THREE.WebGLRenderer) => { r.setRenderTarget(null); r.render(scene, cam); } };
}
