import content from 'virtual:content';

const root = document.documentElement;
const q = new URLSearchParams(location.search);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function hasWebGL2(): boolean {
  if (q.has('nogl')) return false;
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

// The still page is the floor: complete, legible, no motion. The room is added on top only when it can run well.
const still = reduce || root.classList.contains('force-still') || !hasWebGL2();
if (still) {
  root.classList.add('still');
} else {
  const boot = () =>
    import('./scene/stage').then((m) =>
      m.start(document.getElementById('stage') as HTMLCanvasElement, content, {
        poster: q.has('poster'),
        opening: root.dataset.o === 'b' ? 'b' : 'a',
        onLive: () => root.classList.add('live'),
        onFail: () => { root.classList.remove('live'); root.classList.add('still'); },
      }),
    ).catch((e) => { console.warn(e); root.classList.remove('live'); root.classList.add('still'); });
  // First paint belongs to the type on its dark ground. The room starts the moment that paint has happened.
  requestAnimationFrame(() => requestAnimationFrame(boot));
}
