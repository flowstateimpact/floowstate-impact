# measure-r4.py: the round 4 measures, read off real renders. 25 Oct 2026, Nadir. No library (PIL is not installed); png.py decodes.
#   words  <render.png> <render-log.json> [file]   per cut word: rim luma median against the cut's 95th percentile luma inside the rim, contrast in linear light; and against the plate
#   label  <render.png> <render-log.json> [file]   the middle label's summed light against the WILL NOT line's (rims included), and the label's peak luma against the rim's
#   bands  <render.png> [band]                     accent pixels per band of <band> rows (900 at 1440, 844 x dpr on the phone) down the whole image
#   errors <render-log.json>                       console errors per shot (must be zero)
#   line   <render.png> x0 y0 x1 y1                a scrolled shot: rim-class pixels (luma over 200) against cut-class pixels (61 to 160) inside a box, contrast of medians and rim median against cut p95
import sys,json,base64,io,zlib,struct
sys.path.insert(0,'/Users/asiffarid/Documents/apps/flowstateimpact-site-glowup/glowup-renders/tooling'); import png

def luma(r,g,b): return .2126*r+.7152*g+.0722*b
def lin(c):
    c=c/255.
    return c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4
def contrast(a,b):  # sRGB lumas in, WCAG style ratio out, both ways round so the lighter is on top
    la,lb=lin(a),lin(b); hi,lo=max(la,lb),min(la,lb); return (hi+.05)/(lo+.05)
def px(rows,bpp,x,y): o=x*bpp; r=rows[y]; return r[o],r[o+1],r[o+2]
def pct(v,p): v=sorted(v); return v[min(len(v)-1,int(p*len(v)))] if v else None

def read_data_url(u):
    b=base64.b64decode(u.split(',',1)[1]); tmp='/private/tmp/claude-501/measure-r4-tmp.png'; open(tmp,'wb').write(b); return png.read(tmp)

def words(render,log,file=None):
    L=json.load(open(log)); shot=[s for s in L if (file is None or s['file']==file) and isinstance(s.get('measure'),dict) and 'mask' in s['measure']][0]
    m=shot['measure']; mw,mh,mbpp,M=read_data_url(m['mask']); rw,rh,rbpp,RM=read_data_url(m['rim'])
    w,h,bpp,R=png.read(render)
    print('render',w,h,'mask',mw,mh,'rim px',m['hollow']['rim'],'L6',m['L6'])
    out=[]
    for row in m['rows']:
        for t in row['toks']:
            if t['k']!='r': continue
            # css px -> device px uses the render's own dpr; texture and render share the device grid
            dprv=w/ (390 if w<1000 else 1440)
            x0=int(t['x']*dprv); x1=int((t['x']+t['w'])*dprv); y0=int((row['y']-row['size']*.74)*dprv); y1=int((row['y']+row['size']*.06)*dprv)
            x0=max(0,x0); x1=min(w,x1); y0=max(0,y0); y1=min(h,y1)
            rimv=[];cutv=[];facev=[]
            for y in range(y0,y1):
                for x in range(x0,x1):
                    isrim=px(RM,rbpp,x,y)[0]>128; incut=px(M,mbpp,x,y)[0]>128
                    l=luma(*px(R,bpp,x,y))
                    if isrim: rimv.append(l)
                    elif incut: cutv.append(l)
                    else: facev.append(l)
            rim50=pct(rimv,.5); cut95=pct(cutv,.95); cut50=pct(cutv,.5); face50=pct(facev,.5)
            c=contrast(rim50,cut95) if rimv and cutv else None; cf=contrast(rim50,face50) if rimv and facev else None
            out.append((t['t'],len(rimv),len(cutv),rim50,cut50,cut95,c,face50,cf))
            print('  %-5s rim n=%6d luma50=%5.1f | cut n=%6d luma50=%5.1f p95=%5.1f | rim:cut95 = %s | plate luma50=%s rim:plate=%s' % (t['t'],len(rimv),rim50 or 0,len(cutv),cut50 or 0,cut95 or 0,('%.2f'%c) if c else 'n/a',('%.1f'%face50) if face50 is not None else 'n/a',('%.1f'%cf) if cf else 'n/a'))
    return out

def label(render,log,file=None):
    L=json.load(open(log)); shot=[s for s in L if (file is None or s['file']==file) and isinstance(s.get('measure'),dict) and 'rows' in s['measure']][0]
    m=shot['measure']; w,h,bpp,R=png.read(render); dprv=w/(390 if w<1000 else 1440)
    def box_sum(x0,y0,x1,y1):
        x0,y0,x1,y1=[int(v*dprv) for v in (x0,y0,x1,y1)]; x0=max(0,x0);y0=max(0,y0);x1=min(w,x1);y1=min(h,y1)
        tot=0; peak=0
        for y in range(y0,y1):
            for x in range(x0,x1):
                l=luma(*px(R,bpp,x,y)); tot+=l; peak=max(peak,l)
        return tot,peak,(x1-x0)*(y1-y0)
    lab=[r for r in m['rows'] if r['toks'][0]['k']=='b'][0]; head=[r for r in m['rows'] if r['toks'][0]['t']=='WILL'][0]
    lx0=lab['toks'][0]['x']; lx1=lab['toks'][-1]['x']+lab['toks'][-1]['w']; ly0=lab['y']-lab['size']*.76; ly1=lab['y']+lab['size']*.1
    hx0=head['toks'][0]['x']; hx1=head['toks'][1]['x']+head['toks'][1]['w']; hy0=head['y']-head['size']*.74; hy1=head['y']+head['size']*.06
    ls,lp,la=box_sum(lx0,ly0,lx1,ly1); hs,hp,ha=box_sum(hx0,hy0,hx1,hy1)
    print('label box css',(lx0,round(ly0),lx1,round(ly1)),'size',lab['size'],'light sum',round(ls),'peak luma',round(lp,1),'| WILL NOT box',(hx0,round(hy0),hx1,round(hy1)),'light sum',round(hs),'peak',round(hp,1),'| label/headline = %.1f%%'%(100*ls/hs))
    return ls/hs,lp,hp

def bands(render,band=900):
    w,h,bpp,R=png.read(render); nb=(h+band-1)//band; res=[]
    for b in range(nb):
        n=0
        for y in range(b*band,min(h,(b+1)*band)):
            r=R[y]
            for x in range(w):
                if png.classify(r[x*bpp],r[x*bpp+1],r[x*bpp+2])=='accent': n+=1
        res.append(n); print('  band %d (rows %d-%d): accent px %d'%(b,b*band,min(h,(b+1)*band)-1,n))
    return res

def errors(log):
    L=json.load(open(log)); tot=0
    for s in L: print('  %-28s errors %d %s'%(s['file'],len(s['errors']),('; '.join(s['errors'])[:300] if s['errors'] else ''))); tot+=len(s['errors'])
    print('total console errors',tot); return tot

def line(render,x0,y0,x1,y1):
    w,h,bpp,R=png.read(render); rimv=[];cutv=[]
    for y in range(y0,y1):
        for x in range(x0,x1):
            l=luma(*px(R,bpp,x,y))
            if l>200: rimv.append(l)
            elif 61<=l<=160: cutv.append(l)
    print('  box',(x0,y0,x1,y1),'rim-class n=%d luma50=%.1f | cut-class n=%d luma50=%.1f p95=%.1f | rim50:cut95=%.2f'%(len(rimv),pct(rimv,.5) or 0,len(cutv),pct(cutv,.5) or 0,pct(cutv,.95) or 0,contrast(pct(rimv,.5),pct(cutv,.95)) if rimv and cutv else 0))

def honest(render,log,file=None,wall_css=None):
    """the honest per-word measure (25 Oct, asks round): distance from the rim is computed by dilation, so the sample inside a cut is split into
       the wall band (within --hollow-wall of the lip), a fringe one rim wide past it (excluded: anti-aliasing), and the open film beyond.
       Reports the lip against the band it actually borders, the wall against the open film, and the lip against the open film for the record."""
    L=json.load(open(log)); shot=[s for s in L if (file is None or s['file']==file) and isinstance(s.get('measure'),dict) and 'mask' in s['measure']][0]
    m=shot['measure']; mw,mh,mbpp,M=read_data_url(m['mask']); rw,rh,rbpp,RM=read_data_url(m['rim'])
    w,h,bpp,R=png.read(render); dprv=w/(390 if w<1000 else 1440)
    rim_css=m['hollow']['rim']; wall_c=m['hollow'].get('wall',0) if wall_css is None else wall_css
    rimD=max(1,int(round(rim_css*dprv))); wallD=int(round(wall_c*dprv)); D=wallD+rimD
    print('render',w,h,'dpr',dprv,'rim px',round(rim_css*dprv,2),'wall px',round(wall_c*dprv,2),'L6',round(m['L6'],1),'comp',m.get('comp'),'dim',m['hollow']['dim'])
    out=[]
    for row in m['rows']:
        for t in row['toks']:
            if t['k']!='r': continue
            x0=max(0,int(t['x']*dprv)-4); x1=min(w,int((t['x']+t['w'])*dprv)+4); y0=max(0,int((row['y']-row['size']*.74)*dprv)); y1=min(h,int((row['y']+row['size']*.06)*dprv))
            W_=x1-x0; H_=y1-y0
            dist=[[99]*W_ for _ in range(H_)]; front=[]
            for yy in range(H_):
                for xx in range(W_):
                    if px(RM,rbpp,x0+xx,y0+yy)[0]>128: dist[yy][xx]=0; front.append((xx,yy))
            d=0
            while front and d<D:
                d+=1; nxt=[]
                for (xx,yy) in front:
                    for dy in (-1,0,1):
                        for dx in (-1,0,1):
                            nx,ny=xx+dx,yy+dy
                            if 0<=nx<W_ and 0<=ny<H_ and dist[ny][nx]>d: dist[ny][nx]=d; nxt.append((nx,ny))
                front=nxt
            rimv=[];wallv=[];openv=[];facev=[]
            for yy in range(H_):
                for xx in range(W_):
                    dd=dist[yy][xx]; incut=px(M,mbpp,x0+xx,y0+yy)[0]>128; l=luma(*px(R,bpp,x0+xx,y0+yy))
                    if dd==0: rimv.append(l)
                    elif incut:
                        if dd<=wallD: wallv.append(l)
                        elif dd<=D: pass
                        else: openv.append(l)
                    elif dd>D: facev.append(l)
            rim50=pct(rimv,.5); w95=pct(wallv,.95); w50=pct(wallv,.5); o95=pct(openv,.95); o50=pct(openv,.5); f50=pct(facev,.5)
            c_rim_nb=contrast(rim50,w95) if wallv else (contrast(rim50,o95) if openv else None)
            c_wall_open=contrast(o50,w95) if (wallv and openv) else None
            c_rim_open=contrast(rim50,o95) if openv else None
            print('  %-5s rim n=%5d L=%5.1f | wall n=%5d p50=%5.1f p95=%5.1f | open film n=%6d p50=%5.1f p95=%5.1f | lip:neighbour %s | film50:wall95 %s | lip:film95 %s | plate %s'%(
                t['t'],len(rimv),rim50 or 0,len(wallv),w50 or 0,w95 or 0,len(openv),o50 or 0,o95 or 0,
                ('%.2f'%c_rim_nb) if c_rim_nb else 'n/a',('%.2f'%c_wall_open) if c_wall_open else 'n/a',('%.2f'%c_rim_open) if c_rim_open else 'n/a',('%.1f'%f50) if f50 is not None else 'n/a'))
            out.append((t['t'],len(rimv),rim50,w50,w95,o50,o95,c_rim_nb,c_wall_open,c_rim_open))
    return out

def zones(render,log,file=None):
    """honest() split the cut by distance from mask>128, which put the lip-to-wall blend (mask 129 to 254) at distance 0 and the wall-to-film blend
       (mask 1 to 127) inside the wall band, so bright film fringe set the wall's p95. The rim mask already says what each pixel is: the lip is
       painted 255, the wall exactly 128 (rgba .5), the film 0. So: lip = mask 240+, wall = mask 120 to 136 inside the cut, film = mask 0 inside the
       cut and more than one css px from any painted mask pixel (a rim-width gap ate the whole 3 to 8 px film stripe). Blend pixels are excluded from every sample."""
    L=json.load(open(log)); shot=[s for s in L if (file is None or s['file']==file) and isinstance(s.get('measure'),dict) and 'mask' in s['measure']][0]
    m=shot['measure']; mw,mh,mbpp,M=read_data_url(m['mask']); rw,rh,rbpp,RM=read_data_url(m['rim'])
    w,h,bpp,R=png.read(render); dprv=w/(390 if w<1000 else 1440); rimD=max(1,int(round(dprv)))  # blends measured 1 to 2 px wide (WORK, comp1 1440, row trace); the blend pixels are non-zero in the mask and already excluded, this adds one css px
    print('zones',render.split('/')[-1],'dpr',dprv,'fringe gap px',rimD,'L6',round(m['L6'],1),'comp',m.get('comp'),'dim',m['hollow']['dim'])
    out=[]
    for row in m['rows']:
        for t in row['toks']:
            if t['k']!='r': continue
            x0=max(0,int(t['x']*dprv)-4); x1=min(w,int((t['x']+t['w'])*dprv)+4); y0=max(0,int((row['y']-row['size']*.74)*dprv)); y1=min(h,int((row['y']+row['size']*.06)*dprv))
            W_=x1-x0; H_=y1-y0; near=[[False]*W_ for _ in range(H_)]; front=[]
            for yy in range(H_):
                for xx in range(W_):
                    if px(RM,rbpp,x0+xx,y0+yy)[0]>0: near[yy][xx]=True; front.append((xx,yy))
            for _ in range(rimD):
                nxt=[]
                for (xx,yy) in front:
                    for dy in (-1,0,1):
                        for dx in (-1,0,1):
                            nx,ny=xx+dx,yy+dy
                            if 0<=nx<W_ and 0<=ny<H_ and not near[ny][nx]: near[ny][nx]=True; nxt.append((nx,ny))
                front=nxt
            lip=[];wall=[];film=[]
            for yy in range(H_):
                for xx in range(W_):
                    r=px(RM,rbpp,x0+xx,y0+yy)[0]; incut=px(M,mbpp,x0+xx,y0+yy)[0]>128; l=luma(*px(R,bpp,x0+xx,y0+yy))
                    if r>=240: lip.append(l)
                    elif incut and 120<=r<=136: wall.append(l)
                    elif incut and not near[yy][xx]: film.append(l)
            l50=pct(lip,.5); w50=pct(wall,.5); w95=pct(wall,.95); f50=pct(film,.5); f95=pct(film,.95)
            c1=contrast(l50,w95) if wall else None; c2=contrast(f50,w95) if (wall and film) else None; c3=contrast(l50,f95) if film else None
            print('  %-5s lip n=%5d p50=%5.1f | wall n=%5d p50=%5.1f p95=%5.1f | film n=%6d p50=%5.1f p95=%5.1f | lip:wall95 %s | film50:wall95 %s | lip:film95 %s'%(
                t['t'],len(lip),l50 or 0,len(wall),w50 or 0,w95 or 0,len(film),f50 or 0,f95 or 0,
                ('%.2f'%c1) if c1 else 'n/a',('%.2f'%c2) if c2 else 'n/a',('%.2f'%c3) if c3 else 'n/a'))
            out.append((t['t'],l50,w95,f50,f95,c1,c2,c3))
    return out

def strap(render,log,file=None):
    """the strategy line and the label against the WILL NOT line: light above the plate (luma minus 40, clamped) summed over each box, and peak luma"""
    L=json.load(open(log)); shot=[s for s in L if (file is None or s['file']==file) and isinstance(s.get('measure'),dict) and 'rows' in s['measure']][0]
    m=shot['measure']; w,h,bpp,R=png.read(render); dprv=w/(390 if w<1000 else 1440); Wc=390 if w<1000 else 1440
    def box(x0,y0,x1,y1):
        x0,y0,x1,y1=[int(v*dprv) for v in (x0,y0,x1,y1)]; x0=max(0,x0);y0=max(0,y0);x1=min(w,x1);y1=min(h,y1); tot=0;peak=0;raw=0
        for y in range(y0,y1):
            for x in range(x0,x1):
                l=luma(*px(R,bpp,x,y)); raw+=l; tot+=max(0,l-40); peak=max(peak,l)
        return tot,peak,raw
    head=[r for r in m['rows'] if r['toks'][0]['t']=='WILL'][0]; lab=[r for r in m['rows'] if r['toks'][0]['k']=='b'][0]
    hx0=head['toks'][0]['x']; hx1=head['toks'][-1]['x']+head['toks'][-1]['w']
    if head['toks'][-1]['t']=='DARE': hx1=head['toks'][1]['x']+head['toks'][1]['w']
    hs,hp,hr=box(hx0,head['y']-head['size']*.74,hx1,head['y']+head['size']*.06)
    ls,lp,lr=box(lab['toks'][0]['x'],lab['y']-lab['size']*.76,lab['toks'][-1]['x']+lab['toks'][-1]['w'],lab['y']+lab['size']*.1)
    print('WILL NOT light above plate',round(hs),'raw',round(hr),'peak',round(hp,1))
    print('label "other studios" size',lab['size'],'light above plate',round(ls),'= %.1f%% of WILL NOT'%(100*ls/hs),'| raw %.1f%%'%(100*lr/hr),'| peak luma',round(lp,1))
    tot=0;pk=0;n=0;size=1
    for wl in m['who']:
        size=float(wl['font'].split(' ')[1].replace('px',''))
        if wl.get('a',1)<1: continue
        x0=wl['x'] if wl.get('align')!='right' else 0; x1=Wc if wl.get('align')!='right' else wl['x']
        s_,p_,r_=box(x0,wl['y']-size*.76,x1,wl['y']+size*.25); tot+=s_; pk=max(pk,p_); n+=1
        print('strategy line %d size %spx: "%s" light above plate %d peak %.1f'%(n,size,wl['t'],s_,p_))
    print('strategy total = %.1f%% of WILL NOT light above plate; L6/strap = %.2f'%(100*tot/hs, m['L6']/size))

if __name__=='__main__':
    c=sys.argv[1]
    if c=='words': words(sys.argv[2],sys.argv[3],sys.argv[4] if len(sys.argv)>4 else None)
    elif c=='label': label(sys.argv[2],sys.argv[3],sys.argv[4] if len(sys.argv)>4 else None)
    elif c=='bands': bands(sys.argv[2],int(sys.argv[3]) if len(sys.argv)>3 else 900)
    elif c=='errors': errors(sys.argv[2])
    elif c=='line': line(sys.argv[2],*map(int,sys.argv[3:7]))
    elif c=='honest': honest(sys.argv[2],sys.argv[3],sys.argv[4] if len(sys.argv)>4 else None,float(sys.argv[5]) if len(sys.argv)>5 else None)
    elif c=='zones': zones(sys.argv[2],sys.argv[3],sys.argv[4] if len(sys.argv)>4 else None)
    elif c=='strap': strap(sys.argv[2],sys.argv[3],sys.argv[4] if len(sys.argv)>4 else None)
