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

if __name__=='__main__':
    c=sys.argv[1]
    if c=='words': words(sys.argv[2],sys.argv[3],sys.argv[4] if len(sys.argv)>4 else None)
    elif c=='label': label(sys.argv[2],sys.argv[3],sys.argv[4] if len(sys.argv)>4 else None)
    elif c=='bands': bands(sys.argv[2],int(sys.argv[3]) if len(sys.argv)>3 else 900)
    elif c=='errors': errors(sys.argv[2])
    elif c=='line': line(sys.argv[2],*map(int,sys.argv[3:7]))
