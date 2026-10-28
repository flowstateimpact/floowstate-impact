# d1_plate.py: Beyond Black ground plates. Black pigment plaster, a comb dragged through it, shaded in linear light, dithered.
# Standard library only (numpy is not installed).
# Ava, D1 Beyond Black. Run 1 and 2: 25 Oct 2026. Run 3 and run 4: 28 Oct 2026.
# STAND-IN for the final material (a real combed panel shot in raking light).
#
# usage: python3 d1_plate.py [--rib|--run3] lurk|seam|high|phone|phone2 ...
#   default (run 4): COMB PASSES, NOT BOARDS. Each set of grooves is one comb, dragged an arm's reach at a time
#     (500 to 900px at 1440, 220 to 320 at 390). A pass sets down with a slanted seam of piled plaster and wider
#     tooth pits, tilts up to 0.6 degrees, bows 6 to 10px, and lifts out in a ragged tapering tail. The next pass
#     starts 40 to 120px back over that tail, jogged 4 to 14px, and wipes the old grooves under it to a ghost.
#     Sets are separated by 1.6 to 2.2 tooth spacings of untouched land (Anwar's spec, ANWAR-GATE-R3.md section 1).
#   --run3: run 3 geometry (full-width grooves, comb tooth offsets repeating), writes plate-<name>-run3.png.
#   default profile (run 3): GROOVES CUT INTO FLAT LAND, land to groove about 4 to 1. Each comb tooth cuts a narrow
#     channel: one steep kept edge, one slanted wall with a small burr of pushed-up plaster on its lip (the sgraffito
#     knife is slanted away from the edge you keep). Tooth widths differ (worn comb), depth swells and fades along the
#     wall (hand pressure) and lifts out in places (comb lifted). The land between is trowel-flat with plaster tooth and
#     a slow undulation.
#   --rib: the run 2 profile (matching-flank raised rib, flat-domed), kept only for comparison. Writes plate-<name>-rib.png.
#
# LIGHT (run 3 law): every source sits INSIDE the frame and is made of the work itself: letters, film, picture, the
# orange button. No off-frame lamp exists in this file any more. Each source fades out inside about 350px (a soft window
# multiplies the falloff to zero by WIN px).
import sys, math, random, json
D = "/Users/asiffarid/Documents/apps/flowstateimpact-site-glowup/glowup-renders/patterns/plates/d1"
sys.path.insert(0, D)
import pngio

def lin(v):
    v /= 255.0
    return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
def srgb(l):
    if l <= 0: return 0.0
    v = 12.92 * l if l <= 0.0031308 else 1.055 * l ** (1 / 2.4) - 0.055
    return 255.0 * v
def ss(a, b, x):
    u = min(max((x - a) / (b - a), 0.0), 1.0); return u * u * (3 - 2 * u)

REST = (15.0, 13.5, 11.0)          # target rest ground, sRGB: red over blue by 4
AMB = 0.19
AMPK = 0.10                        # rib profile only
SHEEN = 0.012
BONE = (1.0, .90, .76)             # light off the bone letters: bone, a shade warm, no new hue
ORANGE = (lin(0xE2), lin(0x7F), lin(0x22))   # the audit button, #E27F22

# objects that sit on the wall (frame px): their own area is covered by the node, the plate skips it
COMB_D = dict(sp=[27, 24, 28, 25, 29, 23], plen=(500, 900), ovl=(40, 120), jog=(4, 14), bow=(6, 10))     # 1440
COMB_P = dict(sp=[12, 10.5, 12.5, 11, 12, 11], plen=(220, 320), ovl=(18, 54), jog=(2, 6.3), bow=(2.7, 4.5))  # 390, x0.45
FR = {
 "lurk":   dict(W=1440, H=900, sp=[104, 96, 110, 100, 92, 106], peak=50, d0=300, win=380, seed=11),   # run 4: peak 44 to 50, d0 210 to 300
 "high":   dict(W=1440, H=900, sp=[104, 96, 110, 100, 92, 106], peak=70, d0=200, win=380, seed=13,
                cover=[(120, 600, 416, 678)]),
 "seam":   dict(W=1440, H=900, sp=[104, 96, 110, 100, 92, 106], peak=44, d0=190, win=380, seed=12,
                cover=[(120, 440, 1128, 862)]),
 "phone":  dict(W=390, H=844, sp=[62, 54, 66, 58, 50, 60], peak=46, d0=150, win=320, seed=14),
 "phone2": dict(W=390, H=844, sp=[62, 54, 66, 58, 50, 60], peak=52, d0=130, win=300, seed=15,
                cover=[(110, 196, 370, 519), (20, 676, 256, 732)]),
}

# ---------------------------------------------------------------- height fields
def lattice(rnd, W, H, cell):
    gw = int(W / cell) + 3; gh = int(H / cell) + 3
    return [[rnd.random() * 2 - 1 for _ in range(gw)] for _ in range(gh)], cell
def vnoise(L, x, y):
    g, cell = L; fx = x / cell; fy = y / cell; ix = int(fx); iy = int(fy); tx = fx - ix; ty = fy - iy
    tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty)
    r0 = g[iy]; r1 = g[iy + 1]
    a = r0[ix] + (r0[ix + 1] - r0[ix]) * tx; b = r1[ix] + (r1[ix + 1] - r1[ix]) * tx
    return a + (b - a) * ty

def centres(rnd, H, sp, k):   # run 3 (and rib) geometry
    # comb passes of six teeth, small offsets between passes
    cs = []; y = -sum(sp) * 0.37
    while y < H + 200:
        off = rnd.uniform(-3, 3) * k
        for t, s in enumerate(sp):
            cs.append((y + off, t, s)); y += s
    return cs

def build_rib(W, H, sp, seed):
    """Run 2 profile, unchanged: a raised rib with matching flanks. Kept for comparison only."""
    rnd = random.Random(seed)
    k = W / 1440.0 if W > 600 else 0.6
    cs = [c[0] for c in centres(rnd, H, sp, k)]
    Q = 4; y0 = -200; n = (H + 400) * Q
    prof = [0.0] * n; amp_t = [0.0] * n
    j = 0
    for i in range(n):
        yy = y0 + i / Q
        while j + 1 < len(cs) and cs[j + 1] <= yy: j += 1
        c0 = cs[j]; c1 = cs[j + 1] if j + 1 < len(cs) else c0 + sp[0]
        s = c1 - c0; t = (yy - c0) / s if s > 0 else 0
        t = min(max(t, 0.0), 1.0)
        hgt = ss(0, .34, t) * ss(1, .66, t) + 0.10 * math.sin(math.pi * t)
        prof[i] = hgt * AMPK * s; amp_t[i] = AMPK * s * 1.1
    n8 = lattice(rnd, W, H, 8 * max(k, .75)); n28 = lattice(rnd, W, H, 28 * max(k, .75)); n140 = lattice(rnd, W, H, 140 * max(k, .6))
    ph1 = rnd.uniform(0, 6.28); ph2 = rnd.uniform(0, 6.28)
    hgt = [0.0] * (W * H); occ = [0.0] * (W * H); alb = [0.0] * (W * H)
    tw1 = 2 * math.pi / (1310 * max(k, .6)); tw2 = 2 * math.pi / (530 * max(k, .6))
    for y in range(H):
        for x in range(W):
            dr = 1.6 * math.sin(tw1 * x + ph1 + y / 600.0) + 0.6 * math.sin(tw2 * x + ph2 + y / 250.0)
            fi = (y + dr - y0) * Q; ii = int(fi); f = fi - ii
            p = prof[ii] + (prof[ii + 1] - prof[ii]) * f
            nz = 0.35 * vnoise(n8, x, y) + 0.7 * vnoise(n28, x, y)
            i = y * W + x
            hgt[i] = p + nz * (0.6 if W < 600 else 1.0)
            occ[i] = 0.96 + 0.04 * min(max(p / amp_t[ii], 0.0), 1.0)
            alb[i] = 1.0 + 0.06 * vnoise(n140, x, y)
    return hgt, occ, alb

def groove_section(u):
    """Cross-section of one cut channel, u = offset / groove width. Returns (cut 0..1, burr 0..1).
    Steep kept edge on top (u -0.5 to -0.32), a slightly rounded floor, a long slanted lower wall (u 0 to 0.5),
    then a low burr of displaced plaster on the slanted lip."""
    if u < -0.5 or u > 0.85: return 0.0, 0.0
    if u < -0.32: g = ss(-0.5, -0.32, u)
    elif u < 0.0:
        q = (u + 0.16) / 0.16; g = 1.0 - 0.08 * q * q
    elif u < 0.5: g = (1.0 - ss(0.0, 0.5, u)) * 0.92
    else: g = 0.0
    b = math.exp(-((u - 0.6) / 0.1) ** 2)
    return g, b

def build_groove_run3(W, H, sp, seed):
    rnd = random.Random(seed)
    k = W / 1440.0 if W > 600 else 0.6
    cs = centres(rnd, H, sp, k)
    sbar = sum(sp) / len(sp)
    toothw = [rnd.uniform(0.72, 1.3) for _ in sp]          # a worn comb: each tooth its own width, every pass
    G = []
    for (c, t, s) in cs:
        gw = sbar / 5.0 * toothw[t] * rnd.uniform(0.92, 1.08)  # land to groove about 4 to 1
        dep = gw * rnd.uniform(0.18, 0.42)
        G.append((c, gw, dep, rnd.uniform(0, 6.28), rnd.uniform(0, 6.28), rnd.uniform(0, 6.28), rnd.uniform(0.45, 0.85)))
    # nearest groove at quarter px over [-200, H+200]
    Q = 4; y0 = -200; n = (H + 400) * Q
    jt = [0] * n; ot = [0.0] * n
    j = 0
    for i in range(n):
        yy = y0 + i / Q
        while j + 1 < len(G) and abs(G[j + 1][0] - yy) < abs(G[j][0] - yy): j += 1
        jt[i] = j; ot[i] = yy - G[j][0]
    n4 = lattice(rnd, W, H, 4 * max(k, .75)); n8 = lattice(rnd, W, H, 8 * max(k, .75)); n28 = lattice(rnd, W, H, 28 * max(k, .75))
    n140 = lattice(rnd, W, H, 140 * max(k, .6)); n380 = lattice(rnd, W, H, 380 * max(k, .6))
    ph1 = rnd.uniform(0, 6.28); ph2 = rnd.uniform(0, 6.28)
    hgt = [0.0] * (W * H); occ = [0.0] * (W * H); alb = [0.0] * (W * H)
    tw1 = 2 * math.pi / (1310 * max(k, .6)); tw2 = 2 * math.pi / (530 * max(k, .6))
    La = 2 * math.pi / (700 * max(k, .6)); Lb = 2 * math.pi / (190 * max(k, .6)); Lc = 2 * math.pi / (1900 * max(k, .6))
    tooth = 0.6 if W < 600 else 1.0
    for y in range(H):
        for x in range(W):
            # the hand: centreline drift 1.6px over 1310px plus 0.6px over 530px
            dr = 1.6 * math.sin(tw1 * x + ph1 + y / 600.0) + 0.6 * math.sin(tw2 * x + ph2 + y / 250.0)
            ii = int((y + dr - y0) * Q)
            c, gw, dep, pa, pb, pc, lift = G[jt[ii]]
            u = ot[ii] / gw
            g, b = groove_section(u)
            i = y * W + x
            slow = vnoise(n140, x, y); big = vnoise(n380, x, y)
            land = 1.6 * slow + 2.4 * big + tooth * (0.25 * vnoise(n4, x, y) + 0.35 * vnoise(n8, x, y) + 0.6 * vnoise(n28, x, y))
            if g > 0 or b > 0:
                # pressure swells and fades along the wall; the comb lifts out where the slow wave crests
                m = 0.6 + 0.24 * math.sin(La * x + pa) + 0.16 * math.sin(Lb * x + pb)
                sc = math.sin(Lc * x + pc)
                if sc > lift: m *= max(0.12, 1.0 - (sc - lift) / (1.0 - lift) * 0.9)
                hgt[i] = land - dep * m * g + 0.2 * dep * m * b
                occ[i] = 1.0 - 0.08 * g * m
            else:
                hgt[i] = land; occ[i] = 1.0
            alb[i] = 1.0 + 0.07 * slow + 0.04 * big
    return hgt, occ, alb

# ---------------------------------------------------------------- the lamps, all made of the work
def cut_emitters(path, ox, oy, box_w, cell, col, wt, z=18.0):
    """Light off a cut (RGBA, any scale): one emitter per cell with ink in it, strength by coverage."""
    w, h, b, rows = pngio.read(path)
    sc = w / float(box_w)                      # image px per frame px
    cpx = max(2, int(cell * sc)); out = []
    for cy in range(0, h, cpx):
        for cx in range(0, w, cpx):
            a = 0; n = 0
            for yy in range(cy, min(h, cy + cpx), 2):
                r = rows[yy]
                for xx in range(cx, min(w, cx + cpx), 2):
                    a += r[xx * b + 3] if b == 4 else 255; n += 1
            cov = a / (255.0 * max(n, 1))
            if cov > 0.06:
                out.append((ox + (cx + cpx / 2) / sc, oy + (cy + cpx / 2) / sc, z, tuple(q * wt * cov for q in col)))
    return out

def rect_emitters(x0, y0, x1, y1, cell, col, wt, z=18.0):
    out = []; y = y0 + cell / 2
    while y < y1:
        x = x0 + cell / 2
        while x < x1:
            out.append((x, y, z, tuple(q * wt for q in col))); x += cell
        y += cell
    return out

def picture_emitters(path, ox, oy, cell, wt, z=18.0):
    w, h, b, rows = pngio.read(path); out = []
    for cy in range(0, h, cell):
        for cx in range(0, w, cell):
            acc = [0.0, 0.0, 0.0]; n = 0
            for yy in range(cy, min(h, cy + cell), 2):
                r = rows[yy]
                for xx in range(cx, min(w, cx + cell), 2):
                    for q in range(3): acc[q] += lin(r[xx * b + q])
                    n += 1
            out.append((ox + cx + cell / 2, oy + cy + cell / 2, z, tuple(a / n * wt for a in acc)))
    return out

def comb_passes(rnd, W, H, cm):
    """Run 4. The plasterer's passes, in the order they were made: set by set top to bottom, pass by pass along."""
    sp = cm["sp"]; offs = [0.0]
    for s in sp: offs.append(offs[-1] + s)
    span = offs[-1]; ms = sum(sp) / len(sp); sc = 1.0 if W > 600 else 0.45
    sets = []; y = -rnd.uniform(0.2, 0.9) * span
    gaps = []
    while y < H + 10:
        sets.append(y); g = rnd.uniform(1.6, 2.2) * ms; gaps.append(g); y += span + g
    P = []
    for si, ynom in enumerate(sets):
        d = 1 if rnd.random() < 0.75 else -1                 # mostly left to right
        L = rnd.uniform(*cm["plen"])
        xa = -rnd.uniform(0.1, 0.55) * L if d == 1 else W + rnd.uniform(0.1, 0.55) * L
        y0 = ynom + rnd.uniform(-4, 4) * sc; prev = None
        while True:
            th = math.tan(math.radians(rnd.uniform(-0.6, 0.6)))
            bow = rnd.uniform(*cm["bow"]) * rnd.choice((-1, 1))
            slope = math.tan(math.radians(rnd.uniform(8, 28))) * rnd.choice((-1, 1))   # comb held at a slant: the set-down seam
            p = dict(set=si, d=d, xa=xa, L=L, y0=y0, th=th, bow=bow, slope=slope, offs=offs,
                     tail=rnd.uniform(0.10, 0.22) * L, rag=[rnd.uniform(-1, 1) * 12 * sc for _ in offs],
                     sdj=[rnd.uniform(-1, 1) * 2 * sc for _ in offs], pa=rnd.uniform(0, 6.28), pb=rnd.uniform(0, 6.28),
                     dep=[rnd.uniform(0.18, 0.42) for _ in offs], ov=None, jog=None)
            if prev is not None: p["ov"], p["jog"] = prev
            P.append(p)
            xe = xa + d * L
            if (d == 1 and xe >= W) or (d == -1 and xe <= 0): break
            ov = rnd.uniform(*cm["ovl"]); xn = xe - d * ov
            yat = pass_y(p, xn)
            jm = rnd.uniform(*cm["jog"])
            if abs(yat - ynom) > 6 * sc: js = -1 if yat > ynom else 1      # the hand pulls back toward the row
            else: js = rnd.choice((-1, 1))
            y0 = yat + js * jm; xa = xn; L = rnd.uniform(*cm["plen"]); prev = (ov, js * jm)
    return P, gaps, ms

def pass_y(p, x):
    s = p["d"] * (x - p["xa"]); t = min(max(s / p["L"], 0.0), 1.0)
    return p["y0"] + p["th"] * s + p["bow"] * 4 * t * (1 - t)

def build_groove(W, H, sp, seed, cm=None, log=None):
    """Run 4: comb passes. Land as run 3; grooves stamped pass by pass, each later pass wiping what it covers."""
    rnd = random.Random(seed)
    k = W / 1440.0 if W > 600 else 0.6
    cm = cm or (COMB_D if W > 600 else COMB_P)
    sc = 1.0 if W > 600 else 0.45
    P, gaps, ms = comb_passes(rnd, W, H, cm)
    toothw = [rnd.uniform(0.72, 1.3) for _ in P[0]["offs"]]     # one worn comb for the whole wall
    gw0 = ms / 3.2
    N = W * H
    cut = [0.0] * N; burr = [0.0] * N; gm = [0.0] * N
    for p in P:
        d = p["d"]; offs = p["offs"]; L = p["L"]; xa = p["xa"]; span = offs[-1]
        x_lo = int(max(0, min(xa, xa + d * L) - 3 * gw0 - abs(p["slope"]) * span)); x_hi = int(min(W - 1, max(xa, xa + d * L) + 3 * gw0 + abs(p["slope"]) * span))
        if x_hi < 0 or x_lo >= W: continue
        # 1. the comb's body wipes what it passes over (old grooves left as a ghost), between set-down seam and lift-out
        for x in range(x_lo, x_hi + 1):
            yc = pass_y(p, x)
            ya = int(max(0, yc - 0.6 * gw0 * 1.4)); yb = int(min(H - 1, yc + span + 0.9 * gw0 * 1.4))
            for y in range(ya, yb + 1):
                v = y - yc
                xsd = xa + d * p["slope"] * v
                s = d * (x - xsd)
                if s < 0 or s > L - 0.5 * p["tail"]: continue
                i = y * W + x
                cut[i] *= 0.2; burr[i] *= 0.3; gm[i] *= 0.2
        # 2. the teeth
        for j, o in enumerate(offs):
            gw = gw0 * toothw[j]; dep = gw * p["dep"][j]
            xs = xa + d * (p["slope"] * o + p["sdj"][j])
            Lj = L - d * 0 + p["rag"][j] - p["slope"] * o * 0
            tl = p["tail"]
            for x in range(x_lo, x_hi + 1):
                s = d * (x - xs)
                if s < -1.6 * gw or s > Lj: continue
                if s < 0: a = math.exp(-(s / (0.45 * gw)) ** 2)
                elif s > Lj - tl: a = (1.0 - ss(Lj - tl, Lj, s)) ** 0.8
                else: a = 1.0
                sd = math.exp(-(max(s, 0.0) / (14 * sc)) ** 2)
                wf = (1.0 + 0.4 * sd) * (1.0 - 0.45 * (ss(Lj - tl, Lj, s) if s > Lj - tl else 0.0))
                df = 1.0 + 0.25 * sd
                bb = 1.0 + 2.0 * math.exp(-(max(s, 0.0) / (16 * sc)) ** 2)
                m = 0.75 + 0.15 * math.sin(2 * math.pi * x / (700 * sc) + p["pa"]) + 0.10 * math.sin(2 * math.pi * x / (190 * sc) + p["pb"])
                yj = pass_y(p, x) + o + 0.7 * sc * math.sin(x / (37.0 * sc) + p["pa"] + j)
                w_ = gw * wf
                ya = int(max(0, yj - 0.5 * w_)); yb = int(min(H - 1, yj + 0.85 * w_ + 1))
                for y in range(ya, yb + 1):
                    g, b = groove_section((y - yj) / w_)
                    if g <= 0 and b <= 0: continue
                    i = y * W + x
                    cv = dep * m * a * df * g
                    if cv > cut[i]: cut[i] = cv
                    bv = 0.2 * dep * m * a * bb * b
                    if bv > burr[i]: burr[i] = bv
                    gv = g * m * a
                    if gv > gm[i]: gm[i] = gv
        # 3. the set-down seam: plaster piled where the comb's heel came down, across the whole set
        dm = gw0 * 0.3
        for x in range(x_lo, x_hi + 1):
            yc = pass_y(p, x)
            ya = int(max(0, yc - 0.6 * gw0)); yb = int(min(H - 1, yc + span + 0.8 * gw0))
            for y in range(ya, yb + 1):
                v = y - yc; xsd = xa + d * p["slope"] * v
                s = d * (x - xsd) + 0.8 * gw0
                if abs(s) > 1.6 * gw0: continue
                endf = ss(-0.6 * gw0, 0.3 * gw0, v) * ss(span + 0.8 * gw0, span - 0.3 * gw0, v)
                bv = 0.55 * dm * math.exp(-(s / (0.6 * gw0)) ** 2) * endf
                i = y * W + x
                if bv > burr[i]: burr[i] = bv
    if log is not None:
        log.update(passes=P, gaps=gaps, ms=ms, W=W, H=H)
    n4 = lattice(rnd, W, H, 4 * max(k, .75)); n8 = lattice(rnd, W, H, 8 * max(k, .75)); n28 = lattice(rnd, W, H, 28 * max(k, .75))
    n140 = lattice(rnd, W, H, 140 * max(k, .6)); n380 = lattice(rnd, W, H, 380 * max(k, .6))
    hgt = [0.0] * N; occ = [0.0] * N; alb = [0.0] * N
    tooth = 0.6 if W < 600 else 1.0
    for y in range(H):
        for x in range(W):
            i = y * W + x
            slow = vnoise(n140, x, y); big = vnoise(n380, x, y)
            land = 1.6 * slow + 2.4 * big + tooth * (0.25 * vnoise(n4, x, y) + 0.35 * vnoise(n8, x, y) + 0.6 * vnoise(n28, x, y))
            gg = min(gm[i], 1.0)
            hgt[i] = land - cut[i] + burr[i] * (1.0 - gg)
            occ[i] = 1.0 - 0.08 * gg
            alb[i] = 1.0 + 0.07 * slow + 0.04 * big
    return hgt, occ, alb

def pass_stats(log):
    """Measured geometry: pass lengths, overlaps, jogs, tilts, bows, set gaps, and breaks per groove inside the frame."""
    P = log["passes"]; W = log["W"]; H = log["H"]
    inside = lambda p: any(0 <= pass_y(p, x) + p["offs"][-1] and pass_y(p, x) <= H for x in (max(0, min(p["xa"], p["xa"] + p["d"] * p["L"])), min(W, max(p["xa"], p["xa"] + p["d"] * p["L"]))))
    vis = [p for p in P if inside(p)]
    Ls = [p["L"] for p in vis]; ov = [p["ov"] for p in vis if p["ov"] is not None]; jg = [abs(p["jog"]) for p in vis if p["jog"] is not None]
    tilt = [math.degrees(math.atan(abs(p["th"]))) for p in vis]; bow = [abs(p["bow"]) for p in vis]
    # breaks inside the frame, per visible set: number of set-down seams with 0 < x < W
    br = {}
    for p in vis:
        if 0 < p["xa"] < W: br[p["set"]] = br.get(p["set"], 0) + 1
    sets = sorted(set(p["set"] for p in vis))
    r = lambda a: (round(min(a), 1), round(max(a), 1)) if a else None
    return dict(passes=len(vis), length=r(Ls), overlap=r(ov), jog=r(jg), tilt_deg=r(tilt), bow=r(bow),
                gap_over_tooth=r([g / log["ms"] for g in log["gaps"]]), sets=len(sets),
                breaks_per_set=[br.get(s, 0) for s in sets], every_set_breaks=all(br.get(s, 0) >= 1 for s in sets))

def emitters(name):
    if name == "lurk":     # the heading is the lamp: AN AI SYSTEM / YOU KEEP. at (104, 300), 749 wide
        return cut_emitters(D + "/type/lurk-h2.png", 104, 300, 749, 24, BONE, 1.0)
    if name == "high":     # the orange audit button is the main lamp, READ FIRST. the second
        return (rect_emitters(120, 600, 416, 678, 18, ORANGE, 1.0)
                + cut_emitters(D + "/type/high-h2.png", 104, 150, 635, 24, BONE, 0.5)
                + rect_emitters(830, 176, 1290, 262, 30, BONE, 0.07))   # the body text block, faint
    if name == "phone":    # hero letters with the film inside them (cells sampled in run 2)
        cells = json.load(open(D + "/hero390-emitters.json"))
        return [(c["x"], c["y"], 20.0, tuple(c["rgb"])) for c in cells]
    if name == "phone2":   # under the hero: the picture, the button, the heading
        return (picture_emitters(D + "/coat-walk-1x.png", 110, 196, 26, 1.0)
                + rect_emitters(20, 676, 256, 732, 14, ORANGE, 0.9)
                + cut_emitters(D + "/type/high-h2.png", 20, 112, 300, 16, BONE, 0.25))
    # seam: the film's top 40 percent, 14 x 2 samples coloured from the graded still (2x of 1008 x 422 at x 120, y 440)
    w, h, b, rows = pngio.read(D + "/film-lane-graded.png")
    out = []
    for jy, fy in enumerate((0.08, 0.28)):
        for ix in range(14):
            fx = (ix + 0.5) / 14
            px = int(fx * w); py = int(fy * h); acc = [0.0, 0.0, 0.0]; n = 0
            for yy in range(max(0, py - 30), min(h, py + 30), 3):
                r = rows[yy]
                for xx in range(max(0, px - 70), min(w, px + 70), 3):
                    for c in range(3): acc[c] += lin(r[xx * b + c])
                    n += 1
            out.append((120 + fx * 1008, 440 + fy * 422, 18.0, tuple(a / n for a in acc)))
    return out

# ---------------------------------------------------------------- render
def render(name, rib=False, run3=False):
    cfg = FR[name]; W, H = cfg["W"], cfg["H"]
    log = {}
    if rib: hgt, occ, alb = build_rib(W, H, cfg["sp"], cfg["seed"])
    elif run3: hgt, occ, alb = build_groove_run3(W, H, cfg["sp"], cfg["seed"])
    else:
        hgt, occ, alb = build_groove(W, H, cfg["sp"], cfg["seed"], log=log)
        st = pass_stats(log); print(name, "geometry", json.dumps(st))
        json.dump(st, open(f"{D}/geom-{name}.json", "w"), indent=1)
    albedo = [lin(v) / (AMB * 1.012) for v in REST]   # so the unlit ground lands on REST
    rnd = random.Random(7)
    N = W * H
    lr = [0.0] * N; lg = [0.0] * N; lb = [0.0] * N; spec = [0.0] * N
    em = emitters(name); G = 4
    for (ex, ey, ez, ec) in em:
        assert 0 <= ex <= W and 0 <= ey <= H, ("lamp outside the frame", name, ex, ey)
    gw = W // G + 2; gh = H // G + 2
    cover = cfg.get("cover", [])
    d0 = cfg["d0"]; win = cfg["win"]; win2 = win * win
    grid = [None] * (gw * gh)
    for gy in range(gh):
        for gx in range(gw):
            px = gx * G; py = gy * G
            E = [0.0, 0.0, 0.0]; Dx = Dy = Dz = 0.0
            for (ex, ey, ez, ec) in em:
                vx = ex - px; vy = ey - py
                r2 = vx * vx + vy * vy
                if r2 >= win2: continue
                vz = ez; d = math.sqrt(r2 + vz * vz)
                w_ = 1.0 - r2 / win2
                fall = w_ * w_ / (1.0 + (d / d0) ** 2)
                cz = vz / d
                lum = (ec[0] * .3 + ec[1] * .59 + ec[2] * .11) * fall
                for q in range(3): E[q] += ec[q] * fall * cz
                Dx += lum * vx / d; Dy += lum * vy / d; Dz += lum * cz
            dl = math.sqrt(Dx * Dx + Dy * Dy + Dz * Dz) or 1.0
            grid[gy * gw + gx] = (E[0], E[1], E[2], Dx / dl, Dy / dl, Dz / dl)
    for y in range(1, H - 1):
        gy = y // G; ty = (y % G) / G
        for x in range(1, W - 1):
            if any(c[0] <= x < c[2] and c[1] <= y < c[3] for c in cover): continue
            gx = x // G; tx = (x % G) / G
            a = grid[gy * gw + gx]; b = grid[gy * gw + gx + 1]; c2 = grid[(gy + 1) * gw + gx]; d2 = grid[(gy + 1) * gw + gx + 1]
            if a[0] + b[0] + c2[0] + d2[0] <= 0: continue
            v = [(a[q] * (1 - tx) + b[q] * tx) * (1 - ty) + (c2[q] * (1 - tx) + d2[q] * tx) * ty for q in range(6)]
            i = y * W + x; h0 = hgt[i]
            nx = -(hgt[i + 1] - hgt[i - 1]) * 0.5; ny = -(hgt[i + W] - hgt[i - W]) * 0.5
            inv = 1.0 / math.sqrt(nx * nx + ny * ny + 1.0)
            ndl = (nx * v[3] + ny * v[4] + v[5]) * inv
            if ndl <= 0: continue
            # cast shadow inside the cut: march toward the light's mean direction
            sh = 1.0; hz_ = math.sqrt(v[3] * v[3] + v[4] * v[4])
            if hz_ > 0.02:
                ux = v[3] / hz_; uy = v[4] / hz_; slope = v[5] / hz_; occl = 0.0
                for s in range(1, 9):
                    t = s * 2.5
                    sx = int(x + ux * t); sy = int(y + uy * t)
                    if sx < 0 or sy < 0 or sx >= W or sy >= H: break
                    o = hgt[sy * W + sx] - (h0 + slope * t)
                    if o > occl: occl = o
                sh = max(0.0, 1.0 - occl / 1.6)
            ratio = min(ndl / max(v[5], 0.05), 4.0) * sh
            lr[i] = v[0] * ratio; lg[i] = v[1] * ratio; lb[i] = v[2] * ratio
            hz = v[5] + 1.0; hl = math.sqrt(v[3] ** 2 + v[4] ** 2 + hz * hz)
            ndh = (nx * v[3] + ny * v[4] + hz) * inv / hl
            spec[i] = sh * (v[0] * .3 + v[1] * .59 + v[2] * .11) * (ndh ** 10 if ndh > 0 else 0.0)
    # calibrate the light's power so the 99.7th percentile of the lit ground lands on the frame's peak
    sample = [i for i in range(0, N, 7) if lr[i] > 0]
    def peakat(P):
        vals = sorted(srgb(albedo[0] * alb[i] * (AMB * occ[i] + P * lr[i]) + P * SHEEN * spec[i]) for i in sample)
        return vals[int(len(vals) * 0.997)] if vals else 0
    lo, hi = 0.0, 1.0
    while peakat(hi) < cfg["peak"] and hi < 1e7: hi *= 2
    for _ in range(30):
        mid = (lo + hi) / 2
        if peakat(mid) < cfg["peak"]: lo = mid
        else: hi = mid
    P = (lo + hi) / 2
    rows = []; stats = {"rest": [0, 0, 0, 0], "max": 0}
    for y in range(H):
        row = bytearray(W * 3)
        for x in range(W):
            i = y * W + x; a = alb[i]; o = AMB * occ[i]; s = P * SHEEN * spec[i]
            out = (srgb(albedo[0] * a * (o + P * lr[i]) + s), srgb(albedo[1] * a * (o + P * lg[i]) + s), srgb(albedo[2] * a * (o + P * lb[i]) + s))
            dz = rnd.random() + rnd.random() - 1.0   # triangular dither, one level
            v = [max(0, min(255, int(ch + dz + 0.5))) for ch in out]
            row[x * 3:x * 3 + 3] = bytes(v)
            if lr[i] * P < 0.002 * AMB:
                st = stats["rest"]; st[0] += out[0]; st[1] += out[1]; st[2] += out[2]; st[3] += 1
            if out[0] > stats["max"]: stats["max"] = out[0]
        rows.append(bytes(row))
    fn = f"{D}/plate-{name}{'-rib' if rib else ('-run3' if run3 else '')}.png"
    pngio.write(fn, W, rows, 3)
    r = stats["rest"]
    print(name, "rib" if rib else "groove", "lamps", len(em), "rest", [round(r[k] / max(r[3], 1), 1) for k in range(3)],
          "rest px %", round(100.0 * r[3] / N, 1), "peak99.7", round(peakat(P), 1), "max", round(stats["max"], 1), "->", fn)

if __name__ == "__main__":
    rib = "--rib" in sys.argv; run3 = "--run3" in sys.argv
    for nm in [a for a in sys.argv[1:] if not a.startswith("--")]: render(nm, rib, run3)
