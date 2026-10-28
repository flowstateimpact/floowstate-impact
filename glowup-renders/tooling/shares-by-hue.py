"""Colour shares by role, counted by hue and light, not by one darkness cut.
Roles: REST (the bare warm-black ground) · LIT (the same material catching light: warm, darker than type)
· BONE (type and pale marks) · ORANGE (the accent, #E27F22 family) · PICTURE (anything with real chroma
or tone outside those: film and photos). 60/30/10 reading: base = REST+LIT, secondary = BONE+PICTURE, accent = ORANGE.
usage: python3 shares-by-hue.py img.png [img.png ...]"""
import sys, colorsys
import os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import png
def role(r,g,b):
    h,l,s=colorsys.rgb_to_hls(r/255,g/255,b/255); L=l*255
    if s>.45 and 15/360<h<45/360 and L>60: return 'ORANGE'
    if L>150 and s<.25: return 'BONE'
    if L<=19: return 'REST'
    if L<=95 and r>=b and s<.45: return 'LIT'
    return 'PICTURE'
for p in sys.argv[1:]:
    w,h,bpp,rows=png.read(p); st=max(1,w//720)
    px=[(r[x*bpp],r[x*bpp+1],r[x*bpp+2]) for r in rows[::st] for x in range(0,w,st)]; n=len(px)
    c={k:0 for k in ('REST','LIT','BONE','PICTURE','ORANGE')}
    for q in px: c[role(*q)]+=1
    pc={k:100*v/n for k,v in c.items()}
    print(f"{p.split('/')[-1]:28s} rest {pc['REST']:5.1f} lit {pc['LIT']:5.1f} bone {pc['BONE']:4.1f} picture {pc['PICTURE']:5.1f} orange {pc['ORANGE']:4.1f}  | 60/30/10 reads {pc['REST']+pc['LIT']:.0f}/{pc['BONE']+pc['PICTURE']:.0f}/{pc['ORANGE']:.0f}")
