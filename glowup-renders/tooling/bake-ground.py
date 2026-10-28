"""bake-ground.py: bakes the passed plaster F2 into the two hero ground files (Nadir, 28 Oct 2026).
Anwar's gate (glowup-renders/patterns/plaster-gen/ANWAR-GATE-PLASTER-R2.md, section 4):
  1. flatten the light, baked, never a CSS filter: luminance divided by a Gaussian blur (about 220 px at 1x), rescaled to the image mean.
     The ratio is applied to all three channels, so the plaster keeps its own warm hue.
  2. black level: every channel scaled so its mean lands on the run 4 stand-in wall's measured mean (BLACK below, measured off
     glowup-renders/r8/hero/b9-4.20s.jpg, wall pixels away from the letters' pools: top band y 120-500 and low band y 1300-1650 at 2x).
  3. crops, both anchored right and top:
       desk  x 330..2752, y 0..1428. At 1.6 to 1 (1440 x 900) cover-fit shows exactly Anwar's window x 468..2752; the 138 px kept
             on the left is what a viewport up to about 1.7 to 1 pulls back in. Wider than 1.7 the fit turns to the width and crops the
             bottom, so the top-left flat patch (x 60..320) and the left vignette never show.
       phone x 1955..2614, y 0..1428: two crescents and a torn lip.
28 Oct, later: F2 (crescents) was rejected by Asif as not our pattern; the source is now G2, the wall remade from the mark.
Anwar's gate on it (ANWAR-GATE-MARK.md): recipe unchanged, new crops in G2 pixels, both anchored right and top:
       desk  x 400..2752, y 100..1420. At 1.6 to 1 cover-fit shows x 640..2752; up to 1.78 to 1 pulls the extra 240 px back in.
       phone x 2140..2549, y 650..1536, scaled to 660x1428 (Anwar R10: the first phone crop hid the tail's point behind NOT;
             this closer window lifts the point into open plaster above the headline). Fallback if the grit goes soft: x 2119..2551, y 600..1536.
The source is read, never written (it carries the content credential) (it carries the content credential). The C2PA note for the derived files is Ilyas's lane.
usage: python3 bake-ground.py [--soft SIGMA]   (SIGMA: optional pre-blur in px at 1x against moire; 0 = none)"""
import sys, os, json
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(ROOT, 'glowup-renders/patterns/plaster-gen/mark/G2.png')
OUT = os.path.join(ROOT, 'media/ground')
BLACK = np.array([17.96, 15.86, 12.41])   # run 4 wall mean, sRGB, measured 28 Oct (see docstring)
BLUR = 220 / 2.0                          # "about 220 px" read as the blur's radius, sigma = 110
CROPS = {'desk': (400, 100, 2752, 1420), 'phone': (2140, 650, 2549, 1536)}
SIZES = {'phone': (660, 1428)}   # a crop smaller than its file is scaled up after the black level
soft = float(sys.argv[sys.argv.index('--soft') + 1]) if '--soft' in sys.argv else 0.0

a = np.asarray(Image.open(SRC).convert('RGB')).astype(np.float64)
Y = a @ np.array([.2126, .7152, .0722])
B = gaussian_filter(Y, BLUR, mode='reflect')
flat = a * (Y.mean() / np.maximum(B, 1e-3))[..., None]
def tenths(img, x0=0, x1=None):
    y = img @ np.array([.2126, .7152, .0722]); x1 = x1 or y.shape[1]; w = (x1 - x0) / 10
    return [round(float(y[:, int(x0 + i * w):int(x0 + (i + 1) * w)].mean()), 1) for i in range(10)]
rep = {'src': SRC, 'blur_sigma': BLUR, 'black': BLACK.tolist(), 'soft': soft,
       'raw_tenths_full': tenths(a), 'flat_tenths_full': tenths(flat),
       'flat_top1pct': round(float(np.percentile(flat @ np.array([.2126, .7152, .0722]), 99)), 1)}
os.makedirs(OUT, exist_ok=True)
for name, (x0, y0, x1, y1) in CROPS.items():
    c = flat[y0:y1, x0:x1]
    if soft > 0: c = gaussian_filter(c, (soft, soft, 0))
    c = c * (BLACK / c.reshape(-1, 3).mean(0))       # the black level, per channel
    img = Image.fromarray(np.clip(np.rint(c), 0, 255).astype(np.uint8))
    if name in SIZES: img = img.resize(SIZES[name], Image.LANCZOS)
    p = os.path.join(OUT, f'plaster-{name}.jpg')
    img.save(p, quality=80, optimize=True, progressive=True, subsampling='4:2:0')
    img.save(os.path.join(OUT, f'plaster-{name}.webp'), quality=84, method=6)
    rep[name] = {'size': img.size, 'kb_jpg': round(os.path.getsize(p) / 1024), 'kb_webp': round(os.path.getsize(p[:-3] + 'webp') / 1024),
                 'flat_tenths': tenths(flat[y0:y1, x0:x1]), 'baked_tenths': tenths(c),
                 'mean_rgb': [round(float(v), 2) for v in c.reshape(-1, 3).mean(0)],
                 'top1pct': round(float(np.percentile(c @ np.array([.2126, .7152, .0722]), 99)), 1)}
    if name == 'desk':   # Anwar's 1440 window inside the desk file: x 640..2752 of G2
        rep['desk']['window_1440_flat_tenths'] = tenths(flat[y0:y1, 640:2752])
print(json.dumps(rep, indent=1))
json.dump(rep, open(os.path.join(ROOT, 'glowup-renders/r10/bake-report.json'), 'w'), indent=1)
