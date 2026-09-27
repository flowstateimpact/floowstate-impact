import './styles/main.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { renderArchive } from './archive';
import type { Engine, Key, Tier } from './gl/engine';

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const root = document.documentElement;

renderArchive();

/* ---------- rooms: draw the workers (lead with amber dot, filled makers) ---------- */
document.querySelectorAll<HTMLElement>('.room').forEach((room) => {
  const lead = room.dataset.lead === '1';
  const n = parseInt(room.dataset.n || '0', 10);
  const figs = document.createElement('div');
  figs.className = 'room__figs';
  figs.setAttribute('aria-hidden', 'true');
  if (lead) figs.insertAdjacentHTML('beforeend', '<i class="fig fig--lead"></i>');
  for (let i = 0; i < n; i++) figs.insertAdjacentHTML('beforeend', `<i class="fig${i % 3 === 2 ? ' fig--line' : ''}"></i>`);
  room.appendChild(figs);
});
if (finePointer && !reduce) root.classList.add('has-cursor');

/* ---------- smooth scroll ---------- */
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!;
    const el = id === '#top' ? document.body : document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6 });
    else (el as HTMLElement).scrollIntoView();
  });
});

/* ---------- split text into words for reveals ---------- */
function splitWords(el: HTMLElement) {
  if (el.dataset.splitDone) return;
  el.dataset.splitDone = '1';
  const targets = el.querySelectorAll('.line').length ? Array.from(el.querySelectorAll<HTMLElement>('.line')) : [el];
  targets.forEach((t) => {
    const walk = (node: Node) => {
      Array.from(node.childNodes).forEach((c) => {
        if (c.nodeType === 3) {
          const words = (c.textContent ?? '').split(/(\s+)/);
          const frag = document.createDocumentFragment();
          words.forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) frag.appendChild(document.createTextNode(w));
            else {
              const o = document.createElement('span');
              o.className = 'w';
              const i = document.createElement('span');
              i.className = 'wi';
              i.textContent = w;
              o.appendChild(i);
              frag.appendChild(o);
            }
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1) walk(c);
      });
    };
    walk(t);
  });
}
document.querySelectorAll<HTMLElement>('[data-split]').forEach(splitWords);

/* ---------- hero: fit the widest line to the frame at its final width ---------- */
const heroTitle = document.querySelector<HTMLElement>('.hero__title');
function fitHero() {
  if (!heroTitle) return;
  const lines = Array.from(heroTitle.querySelectorAll<HTMLElement>('.line'));
  const saved = lines.map((l) => l.style.getPropertyValue('--wd'));
  lines.forEach((l) => l.style.setProperty('--wd', getComputedStyle(root).getPropertyValue('--wd-t').trim() || '112'));
  heroTitle.style.fontSize = '';
  const base = parseFloat(getComputedStyle(heroTitle).fontSize);
  const widest = Math.max(...lines.map((l) => l.scrollWidth));
  const avail = heroTitle.clientWidth;
  if (widest > 0 && avail > 0) heroTitle.style.fontSize = `${Math.min(base * (avail / widest) * 0.985, 280)}px`;
  lines.forEach((l, i) => (saved[i] ? l.style.setProperty('--wd', saved[i]) : l.style.removeProperty('--wd')));
}
fitHero();
document.fonts?.ready.then(fitHero);
let fitT = 0;
window.addEventListener('resize', () => { clearTimeout(fitT); fitT = window.setTimeout(fitHero, 120); }, { passive: true });

/* ---------- Dhaka clock ---------- */
const clock = document.querySelector<HTMLElement>('[data-clock]');
const tickClock = () => {
  if (!clock) return;
  const d = new Date();
  const f = (tz: string) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz });
  clock.textContent = `${f('Asia/Dhaka')} DAC · ${f('Europe/London')} LDN`;
};
tickClock();
setInterval(tickClock, 30000);

/* ---------- loader + intro ---------- */
const loaderNum = document.querySelector<HTMLElement>('[data-loader-num]');
const introDone = new Promise<void>((resolve) => {
  if (reduce) {
    root.classList.add('is-ready');
    resolve();
    return;
  }
  const o = { v: 0 };
  const tl = gsap.timeline({ onComplete: resolve });
  tl.to(o, {
    v: 83,
    duration: 1.5,
    ease: 'power2.inOut',
    onUpdate: () => loaderNum && (loaderNum.textContent = String(Math.round(o.v)).padStart(3, '0')),
  })
    .to('.loader__line span', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
    .add(() => root.classList.add('is-ready'))
    .to('.loader', { autoAlpha: 0, duration: 0.7, ease: 'power2.out' })
    .from('.hero__title .wi', { yPercent: 118, rotate: 4, duration: 1.3, ease: 'expo.out', stagger: 0.045 }, '-=0.5')
    .fromTo('.hero__title .line', { '--wd': 50 }, { '--wd': () => parseFloat(getComputedStyle(root).getPropertyValue('--wd-t')) || 112, duration: 1.8, ease: 'expo.out', stagger: 0.12 }, '<')
    .from('.hero__foot > *, .hero__meta, .nav', { autoAlpha: 0, y: 24, duration: 1, ease: 'expo.out', stagger: 0.08 }, '-=1.0');
});

/* ---------- section reveals ---------- */
if (!reduce) {
  gsap.utils.toArray<HTMLElement>('.s:not(.s--hero) [data-split]').forEach((el) => {
    gsap.from(el.querySelectorAll('.wi'), {
      yPercent: 115,
      rotate: 3,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.03,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
  gsap.utils.toArray<HTMLElement>('.kicker, .s__sub, .why__item, .door__step, .room, .gates__doors li, .who__half, .get__grid > div, .keep__body p, .nums__row li, .case, .team__list li, .archive__proof li').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 40,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  // stamps slam in
  gsap.from('.stamps li', {
    scale: 1.8,
    autoAlpha: 0,
    rotate: () => gsap.utils.random(-14, 14),
    duration: 0.5,
    ease: 'back.out(2.2)',
    stagger: 0.12,
    scrollTrigger: { trigger: '.stamps', start: 'top 80%' },
  });

  // count-ups
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count!);
    const dec = el.dataset.count!.includes('.') ? 2 : 0;
    const o = { v: 0 };
    gsap.to(o, {
      v: target,
      duration: 1.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => (el.textContent = o.v.toFixed(dec)),
    });
  });

  // five doors light up one at a time while the section passes
  const doors = gsap.utils.toArray<HTMLElement>('.gates__doors li');
  ScrollTrigger.create({
    trigger: '.gates__doors',
    start: 'top 70%',
    end: 'bottom 40%',
    onUpdate: (self) => {
      const lit = Math.floor(self.progress * (doors.length + 0.999));
      doors.forEach((d, i) => d.classList.toggle('is-lit', i < lit));
    },
  });

  // front door: horizontal travel on wide screens
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1000px)', () => {
    const track = document.querySelector<HTMLElement>('.door__track');
    if (!track) return;
    const dist = () => track.scrollWidth - window.innerWidth + 120;
    gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: { trigger: '.s--door', start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
    });
  });

  // case images drift at different depths
  gsap.utils.toArray<HTMLElement>('.case__img').forEach((img, i) => {
    gsap.fromTo(img, { yPercent: 10 + (i % 3) * 6 }, {
      yPercent: -10 - (i % 3) * 8,
      ease: 'none',
      scrollTrigger: { trigger: img.closest('.case'), start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // keep: the room opens
  gsap.fromTo('.keep__title', { scale: 0.86, autoAlpha: 0.2 }, {
    scale: 1,
    autoAlpha: 1,
    ease: 'none',
    scrollTrigger: { trigger: '.s--keep', start: 'top 80%', end: 'center center', scrub: true },
  });
}

/* ---------- nav progress + hide on scroll ---------- */
const bar = document.querySelector<HTMLElement>('.nav__progress span');
ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate: (self) => {
    if (bar) bar.style.transform = `scaleX(${self.progress})`;
    root.classList.toggle('is-scrolled', self.scroll() > 40);
  },
});

/* ---------- magnetic buttons + cursor (desktop only) ---------- */
if (finePointer && !reduce) {
  document.querySelectorAll<HTMLElement>('.magnetic').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.28);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
  const cur = document.createElement('div');
  cur.className = 'cursor';
  cur.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cur);
  const cx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
  const cy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { cur.classList.add('is-on'); cx(e.clientX); cy(e.clientY); }, { passive: true });
  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('pointerenter', () => cur.classList.add('is-hot'));
    el.addEventListener('pointerleave', () => cur.classList.remove('is-hot'));
  });
}

/* ---------- the film ---------- */
const video = document.querySelector<HTMLVideoElement>('[data-film]');
const play = document.querySelector<HTMLButtonElement>('[data-film-play]');
play?.addEventListener('click', () => {
  if (!video) return;
  video.preload = 'auto';
  video.muted = false;
  video.play().catch(() => { video.muted = true; video.play(); });
  play.classList.add('is-gone');
});
video?.addEventListener('play', () => play?.classList.add('is-gone'));

/* ---------- the field: lazy WebGL after first paint ---------- */
function pickTier(): Tier {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = navigator.hardwareConcurrency || 4;
  const mem = nav.deviceMemory ?? 8;
  const small = window.innerWidth < 760;
  if (cores <= 4 || mem <= 3) return 'low';
  if (small) return 'mid';
  return 'high';
}

function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

async function bootField() {
  const canvas = document.getElementById('field') as HTMLCanvasElement | null;
  if (!canvas || reduce || !webglOK()) {
    root.classList.add('no-field');
    return;
  }
  const [{ Engine }, S] = await Promise.all([import('./gl/engine'), import('./gl/shapes')]);
  const tier = pickTier();
  const engine: Engine = new Engine(canvas, tier);
  const n = engine.count;
  const displayFont = getComputedStyle(root).getPropertyValue('--f-display').trim() || 'serif';
  const ribbon = await S.ribbon(n, '/brand/ribbon.svg').catch(() => S.filament(n));

  // one key per section, in page order; key 0 is the intro nebula
  const byKey: Record<string, Key> = {
    hero: { cloud: ribbon, x: 0.55, y: 0.42, scale: 0.8, turb: 0.03 },
    one: { cloud: S.one(n), x: 1.0, scale: 1.1, turb: 0.04 },
    why: { cloud: S.workers(n), x: 0.2, y: -0.1, scale: 0.9, cream: 0.25 },
    door: { cloud: S.filament(n), y: -0.35, turb: 0.06 },
    room: { cloud: S.workers(n, 11), y: 0.05, scale: 1.05, cream: 0.4 },
    gates: { cloud: S.doors(n), x: 0.9, turb: 0.03 },
    who: { cloud: S.text(n, '56 · 27', `700 300px ${displayFont}`), y: 0.1, cream: 0.2 },
    get: { cloud: S.nebula(n, 12), turb: 0.1 },
    keep: { cloud: S.room(n), scale: 1.1, cream: 0.1 },
    nums: { cloud: S.text(n, '20×', `700 300px ${displayFont}`), x: 0.85, cream: 0.3 },
    work: { cloud: S.nebula(n, 13), turb: 0.12 },
    archive: { cloud: S.filament(n, 14), y: 0.6, turb: 0.1, cream: 0.5 },
    film: { cloud: S.nebula(n, 15), turb: 0.08 },
    team: { cloud: S.one(n, 16), x: 1.0, scale: 0.9, cream: 0.6 },
    contact: { cloud: ribbon, y: 0.35, scale: 1.3, turb: 0.02 },
  };
  const dimFor: Record<string, number> = {
    hero: 1, one: 0.9, why: 0.45, door: 0.8, room: 0.55, gates: 0.8, who: 0.7, get: 0.35,
    keep: 1, nums: 0.8, work: 0.25, archive: 0.3, film: 0.12, team: 0.6, contact: 1,
  };
  const sections = Array.from(document.querySelectorAll<HTMLElement>('main > .s[data-key]'));
  const keys: Key[] = [{ cloud: S.nebula(n), turb: 0.2 }, ...sections.map((s) => byKey[s.dataset.key!] ?? { cloud: S.nebula(n) })];
  engine.setKeys(keys);
  engine.setProgress(0);
  engine.start();
  root.classList.add('has-field');

  // map scroll to key index using section centres
  let centres: number[] = [];
  const measure = () => {
    centres = sections.map((s) => s.offsetTop + s.offsetHeight / 2 - window.innerHeight / 2);
  };
  measure();
  ScrollTrigger.addEventListener('refresh', measure);
  let intro = 0;
  const introTween = { v: 0 };
  await introDone;
  gsap.to(introTween, { v: 1, duration: 2.2, ease: 'power3.inOut', onUpdate: () => (intro = introTween.v) });

  const update = (y: number) => {
    let f = 0;
    if (y <= centres[0]) f = 0;
    else if (y >= centres[centres.length - 1]) f = centres.length - 1;
    else {
      for (let i = 0; i < centres.length - 1; i++) {
        if (y >= centres[i] && y < centres[i + 1]) {
          f = i + (y - centres[i]) / (centres[i + 1] - centres[i]);
          break;
        }
      }
    }
    // key 0 is the intro; the hero sits at key 1
    engine.setProgress(Math.min(intro, 1) * 1 + f);
    const idx = Math.round(f);
    engine.setDim(dimFor[sections[idx]?.dataset.key ?? 'hero'] ?? 1);
  };
  gsap.ticker.add(() => {
    const y = lenis ? lenis.scroll : window.scrollY;
    update(y);
    engine.setVelocity(lenis ? lenis.velocity : 0);
  });
  video?.addEventListener('play', () => engine.setDim(0.05));
}

const idle = (cb: () => void) =>
  'requestIdleCallback' in window ? (window as Window & { requestIdleCallback: (c: () => void, o?: object) => void }).requestIdleCallback(cb, { timeout: 1200 }) : setTimeout(cb, 200);
window.addEventListener('load', () => idle(() => { bootField(); }));

// fonts can change layout; re-measure triggers once they settle
document.fonts?.ready.then(() => ScrollTrigger.refresh());
