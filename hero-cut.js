/* hero-cut.js: the home hero's cut, journey V2 made live (R18, 31 Oct 2026, Nadir). Ported from journey/cut.js (R17).
   The layout is the live plate's composition 3 (the stack, the sizes, the closing line right-aligned to WILL NOT DARE), read from the page's own CSS.
   What is new in R18:
     svgPlate  the plate drawn as vectors: the glyph outlines cut the etched wall raster (an SVG mask of the words), so the edges stay sharp at any
               zoom; the camera is the viewBox. Three layers: band (the plate's thickness, moved by the pointer), face (the wall with the words cut
               out), top (the lit lip, the printed lines, DARE). The light spill canvas goes between face and top
     hole      the point the camera enters by: the thickest point of the cut stroke of the O in WORK (we enter the work through the word), and
               the radius of the largest circle that fits there, so the end scale is set by the letter and not by a guess
     spillMask the letters dilated about 30px, the cuts themselves taken out, weighted by the wall's own relief so the ridges catch the film's light */
(function(){
  "use strict";
  function cssPx(prop,fs){ var p=document.createElement('i'); p.style.cssText='position:absolute;visibility:hidden;width:'+prop+';height:0'+(fs?';font-size:'+fs+'px':''); document.body.appendChild(p); var v=parseFloat(getComputedStyle(p).width); p.remove(); return v; }
  function cssNum(prop){ return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(prop))||0; }
  function navBottom(){ var t=document.querySelector('.top'); return t?Math.ceil(t.getBoundingClientRect().bottom):60; }

  function layout(W,H,ctx){
    var L6=cssPx('var(--L6)'), m=cssPx('var(--m)'), L0=cssPx('var(--L0)'), maxW=W-2*m, phone=W<761, track=-.01;
    function width(font,text,ls){ ctx.font=font; if('letterSpacing' in ctx) ctx.letterSpacing=(ls||0)+'px'; return ctx.measureText(text).width; }
    function wrap(font,words){ var lines=[],cur=[]; words.forEach(function(w){ var t=cur.concat([w]).map(function(x){return x.t}).join(' '); if(cur.length&&width(font,t,0)>maxW){ lines.push(cur); cur=[w]; } else cur=cur.concat([w]); }); if(cur.length) lines.push(cur); return lines; }
    var WE={t:'WE',k:'r'},MAKE={t:'MAKE',k:'r'},THE={t:'THE',k:'r'},WORK={t:'WORK',k:'r'},WILL={t:'WILL',k:'r'},NOT={t:'NOT',k:'r'},DARE={t:'DARE',k:'g'};
    var st1=[[WE,MAKE],[THE,WORK]], st2=phone?[[WILL,NOT],[DARE]]:[[WILL,NOT,DARE]];
    var widest=0; st1.concat(st2).forEach(function(ws){ widest=Math.max(widest,width('700 100px "Bespoke Stencil"',ws.map(function(t){return t.t}).join(' '),track*100)); });
    var fitW=Math.floor(100*maxW/widest), nRows=st1.length+st2.length, navH=navBottom();
    var fitH=Math.floor((H-navH-24-88-32)/((nRows-1)*.88+.375+.70+.66));
    L6=Math.min(fitW,fitH);
    var os=Math.round(L6*.30), pitch=L6*.88, cap=.70*L6;
    var stencil='700 '+L6+'px "Bespoke Stencil"', mid='400 '+os+'px "General Sans"', ls=track*L6;
    var rows=[];
    st1.forEach(function(ws){ rows.push({font:stencil,size:L6,ls:ls,pitch:pitch,words:ws}); });
    rows.push({font:mid,size:os,ls:0,pitch:os*1.25,words:[{t:'other',k:'b',a:.66},{t:'firms',k:'b',a:.66}],under:'last'});
    st2.forEach(function(ws){ rows.push({font:stencil,size:L6,ls:ls,pitch:pitch,words:ws,align:'right'}); });
    var strap=wrap(mid,'A strategy and design firm.'.split(' ').map(function(t){return {t:t}})).map(function(ws){ return ws.map(function(w){return w.t}).join(' '); });
    var capM=.718*os, brk=24, lhM=os*1.2;
    var block=0; rows.forEach(function(r,i){ block+= i? r.pitch : 0; }); block+=cap;
    var l3n=phone?2:1, under=brk+Math.round(capM)+(l3n-1)*lhM+40, strapH=capM+(strap.length-1)*lhM+brk, top;
    if(phone){ var lineTop=H-40-lhM-Math.round(capM); top=Math.round(navH+(lineTop-navH-block-strapH)*.42+strapH); }
    else { top=Math.round(navH+(H-navH-block-strapH-under)/2+strapH); }
    var y=top+cap, out=[];
    rows.forEach(function(r,i){ if(i) y+=r.pitch; ctx.font=r.font; if('letterSpacing' in ctx) ctx.letterSpacing=r.ls+'px'; var sp=ctx.measureText(' ').width;
      var ws=r.words.map(function(w){ return {t:w.t,k:w.k,a:w.a||1,w:ctx.measureText(w.t).width}; }), rw=ws.reduce(function(a,w){return a+w.w},0)+sp*(ws.length-1);
      var x=m; if(r.align==='right') x=W-m-rw; else if(r.under==='last'&&out.length){ var pt=out[out.length-1].toks; x=pt[pt.length-1].x; }
      var toks=[]; ws.forEach(function(w){ toks.push({t:w.t,k:w.k,a:w.a,x:x,w:w.w}); x+=w.w+sp; });
      out.push({font:r.font,size:r.size,ls:r.ls,y:Math.round(y),toks:toks,align:r.align||'left'}); });
    var who=[];
    strap.forEach(function(t,i){ who.push({t:t,font:mid,x:m,y:top-brk-Math.round(os*.3)-(strap.length-1-i)*lhM,a:1}); });
    // the closing line: right-aligned to the same margin as WILL NOT DARE, so its right edge is the row's right edge (Asif, 31 Oct)
    var l3s=phone?['We shape the brand.','You keep the AI we build.']:['We shape the brand. You keep the AI we build.'], cy=H-40;
    l3s.forEach(function(t,i){ who.push({t:t,font:mid,x:W-m,align:'right',y:cy-(l3s.length-1-i)*lhM,a:.92}); });
    // the hollow figures from type-base.css
    var rim=Math.max(cssPx('var(--hollow-rim-min)'),cssPx('var(--hollow-rim)',L6)), lipS=getComputedStyle(document.documentElement).getPropertyValue('--hollow-lip').trim();
    var hk={rim:rim,lip:lipS===''?1:Math.max(0,Math.min(1,parseFloat(lipS))),wall:Math.max(1,cssPx('var(--hollow-wall)',L6))};
    // the letter the camera goes through: the O of WORK (we enter the work through the word). Its centre, in CSS px
    var work=null; out.forEach(function(r){ r.toks.forEach(function(t){ if(t.t==='WORK') work={x:t.x,w:t.w,y:r.y}; }); });
    var dare=null; out.forEach(function(r){ r.toks.forEach(function(t){ if(t.t==='DARE') dare={x:t.x,w:t.w,y:r.y,cap:cap}; }); });
    var o={x:work.x+work.w*.405,y:work.y-cap*.5,r:cap*.26};
    return {rows:out,who:who,m:m,capTop:top,L6:L6,os:os,cap:cap,hollow:hk,o:o,dare:dare,W:W,H:H,phone:phone};
  }

  function setFont(x,r){ x.font=r.font; if('letterSpacing' in x) x.letterSpacing=r.ls+'px'; }

  function holes(lay,dpr,w,h){
    var fc=document.createElement('canvas'); fc.width=w; fc.height=h; var f=fc.getContext('2d'); f.scale(dpr,dpr); f.textBaseline='alphabetic'; f.fillStyle='#fff';
    lay.rows.forEach(function(row){ setFont(f,row); row.toks.forEach(function(t){ if(t.k==='r') f.fillText(t.t,t.x,row.y); }); });
    return fc;
  }

  /* the wall picture, cover-fitted and anchored right top like the CSS ground, then etched: the comb's grooves lit from the upper left (--plate-etch) */
  function wallCanvas(img,w,h,etch){
    var c=document.createElement('canvas'); c.width=w; c.height=h; var x=c.getContext('2d',{willReadFrequently:true}); x.imageSmoothingEnabled=true; x.imageSmoothingQuality='high';
    x.fillStyle='#12100C'; x.fillRect(0,0,w,h);
    var iw=img.naturalWidth, ih=img.naturalHeight, k=Math.max(w/iw,h/ih), dw=iw*k, dh=ih*k; x.drawImage(img,w-dw,0,dw,dh);
    if(etch>0){ var id=x.getImageData(0,0,w,h), d=id.data, o=new Uint8ClampedArray(d), s=etch*8, i, p, q, gx, gy, rl, L=function(j){ return .2126*o[j]+.7152*o[j+1]+.0722*o[j+2]; };
      for(var yy=1;yy<h-1;yy++) for(var xx=1;xx<w-1;xx++){ i=(yy*w+xx)*4; gx=L(i+4)-L(i-4); gy=L(i+4*w)-L(i-4*w); rl=(gx*.45+gy*.55)*s/255;   // light from the upper left: a slope facing it brightens, the other falls into shadow
        if(rl>0){ d[i]=o[i]+rl*255; d[i+1]=o[i+1]+rl*242; d[i+2]=o[i+2]+rl*220; } else { d[i]=o[i]+rl*255; d[i+1]=o[i+1]+rl*255; d[i+2]=o[i+2]+rl*255; } }
      x.putImageData(id,0,0); }
    return c;
  }


  var NS='http://www.w3.org/2000/svg';
  function el(n,at,par){ var e=document.createElementNS(NS,n); for(var k in at) e.setAttribute(k,at[k]); if(par) par.appendChild(e); return e; }
  function fontOf(f){ var m=/^(\d+) ([\d.]+)px "(.+)"$/.exec(f); return {w:m[1],s:m[2],f:m[3]}; }
  /* every cut word (k r) as SVG text in the layout's exact places; style sets fill or stroke */
  function cutText(par,lay,at){ lay.rows.forEach(function(r){ var f=fontOf(r.font); r.toks.forEach(function(t){ if(t.k!=='r') return;
    var e=el('text',Object.assign({x:t.x,y:r.y,'font-family':f.f,'font-weight':f.w,'font-size':f.s,'letter-spacing':r.ls},at),par); e.textContent=t.t; }); }); }
  function svgRoot(lay,cls){ var s=el('svg',{'class':cls,viewBox:'0 0 '+lay.W+' '+lay.H,preserveAspectRatio:'none','aria-hidden':'true',focusable:'false'}); return s; }
  function svgPlate(lay,wallURL,T){
    var W=lay.W,H=lay.H,see=Math.min(.9,cssNum('--plate-see')), big={x:-W,y:-H,width:W*3,height:H*3};
    /* band: the wall ink stroked 2T wide, kept inside the cuts */
    var band=svgRoot(lay,'lay hj-band'), bd=el('defs',{},band), bc=el('clipPath',{id:'hj-clip-b'},bd); cutText(bc,lay,{});
    var bg=el('g',{'clip-path':'url(#hj-clip-b)'},band); cutText(bg,lay,{fill:'none',stroke:'#141413','stroke-width':T*2,'stroke-linejoin':'miter','stroke-miterlimit':3});
    /* face: the etched wall, see-through by --plate-see, the words cut out */
    var face=svgRoot(lay,'lay hj-face'), fd=el('defs',{},face), mk=el('mask',Object.assign({id:'hj-mask',maskUnits:'userSpaceOnUse'},big),fd);
    el('rect',Object.assign({fill:'#fff'},big),mk); cutText(mk,lay,{fill:'#000'});
    var fg=el('g',{mask:'url(#hj-mask)',opacity:(1-see*.6).toFixed(3)},face); el('rect',{x:0,y:0,width:W,height:H,fill:'#12100C'},fg);   /* one opacity on the group: the rect and the wall each at .868 stacked to .983 and lost --plate-see */
    var im=el('image',{x:0,y:0,width:W,height:H,preserveAspectRatio:'none'},fg); im.setAttribute('href',wallURL);
    /* top: the lip inside every cut (the wide wall stroke at half, the rim at full, the group at --hollow-lip), the printed lines, DARE */
    /* R20: the lip is its own layer under the printed lines, so its fade is a compositor opacity (same stacking, same pixels as the group opacity it replaces) */
    var lip=svgRoot(lay,'lay hj-lip'), td=el('defs',{},lip), tc=el('clipPath',{id:'hj-clip-t'},td); cutText(tc,lay,{}); lip.style.opacity=String(lay.hollow.lip);
    var top=svgRoot(lay,'lay hj-top');
    var lg=el('g',{'clip-path':'url(#hj-clip-t)'},lip), lk={fill:'none',stroke:'#F2F2F0','stroke-linejoin':'miter','stroke-miterlimit':3};
    cutText(lg,lay,Object.assign({'stroke-width':(lay.hollow.rim+lay.hollow.wall)*2,'stroke-opacity':.5},lk));
    cutText(lg,lay,Object.assign({'stroke-width':2*Math.max(1,lay.hollow.rim*(Math.min(devicePixelRatio||1,2)))/Math.min(devicePixelRatio||1,2)},lk));
    lay.rows.forEach(function(r){ var f=fontOf(r.font); r.toks.forEach(function(t){ if(t.k==='r') return;
      var e=el('text',{x:t.x,y:r.y,'font-family':f.f,'font-weight':f.w,'font-size':f.s,'letter-spacing':r.ls,fill:t.k==='g'?'#E27F22':'#F2F2F0','fill-opacity':t.k==='g'?1:t.a},top); e.textContent=t.t; }); });
    lay.who.forEach(function(wd){ var f=fontOf(wd.font), e=el('text',{x:wd.x,y:wd.y,'font-family':f.f,'font-weight':f.w,'font-size':f.s,'text-anchor':wd.align==='right'?'end':'start',fill:'#F2F2F0','fill-opacity':wd.a},top); e.textContent=wd.t; });
    return {band:band,face:face,lip:lip,top:top,wall:im,all:[band,face,lip,top]};   /* R19: lip and wall returned so the journey can fade them; R20: the lip is the hj-lip svg itself */
  }

  /* the camera's way in: the thickest point of the O's cut stroke (two-pass chamfer distance inside the cut), and that point's clear radius */
  function hole(lay){
    var W=lay.W,H=lay.H,c=document.createElement('canvas'); c.width=W; c.height=H; c.getContext('2d').drawImage(holes(lay,1,W,H),0,0);
    var o=lay.o, rx=Math.round(lay.cap*.55), x0=Math.max(1,Math.round(o.x-rx)), x1=Math.min(W-2,Math.round(o.x+rx)), y0=Math.max(1,Math.round(o.y-lay.cap*.56)), y1=Math.min(H-2,Math.round(o.y+lay.cap*.56));
    var w=x1-x0+1,h=y1-y0+1, a=c.getContext('2d').getImageData(x0,y0,w,h).data, d=new Float32Array(w*h), INF=1e9, i, x, y;
    for(i=0;i<w*h;i++) d[i]=a[i*4+3]>127?INF:0;
    for(y=0;y<h;y++) for(x=0;x<w;x++){ i=y*w+x; if(!d[i]) continue; var v=d[i];
      if(x>0) v=Math.min(v,d[i-1]+1); if(y>0) v=Math.min(v,d[i-w]+1); if(x>0&&y>0) v=Math.min(v,d[i-w-1]+1.414); if(x<w-1&&y>0) v=Math.min(v,d[i-w+1]+1.414);
      if(x===0||y===0||x===w-1) v=Math.min(v,1); d[i]=v; }
    for(y=h-1;y>=0;y--) for(x=w-1;x>=0;x--){ i=y*w+x; if(!d[i]) continue; var u=d[i];
      if(x<w-1) u=Math.min(u,d[i+1]+1); if(y<h-1) u=Math.min(u,d[i+w]+1); if(x<w-1&&y<h-1) u=Math.min(u,d[i+w+1]+1.414); if(x>0&&y<h-1) u=Math.min(u,d[i+w-1]+1.414); d[i]=u; }
    var best=0,bi=-1; for(i=0;i<w*h;i++) if(d[i]>best){ best=d[i]; bi=i; }
    if(bi<0) return {x:o.x,y:o.y,r:lay.cap*.08};
    return {x:x0+bi%w+.5,y:y0+Math.floor(bi/w)+.5,r:best};
  }

  /* the spill mask at a quarter of the screen: the letters blurred out to about 30px, the cuts taken out, times the wall's own relief */
  function boxBlur(src,w,h,r){ var tmp=new Float32Array(w*h),out=new Float32Array(w*h),x,y,s,n=2*r+1;
    for(y=0;y<h;y++){ s=0; for(x=-r;x<=r;x++) s+=src[y*w+Math.min(w-1,Math.max(0,x))]; for(x=0;x<w;x++){ tmp[y*w+x]=s/n; s+=src[y*w+Math.min(w-1,x+r+1)]-src[y*w+Math.max(0,x-r)]; } }
    for(x=0;x<w;x++){ s=0; for(y=-r;y<=r;y++) s+=tmp[Math.min(h-1,Math.max(0,y))*w+x]; for(y=0;y<h;y++){ out[y*w+x]=s/n; s+=tmp[Math.min(h-1,y+r+1)*w+x]-tmp[Math.max(0,y-r)*w+x]; } }
    return out; }
  function spillMask(lay,wall,q,reach){
    var w=Math.max(8,Math.round(lay.W*q)), h=Math.max(8,Math.round(lay.H*q)), hc=document.createElement('canvas'); hc.width=w; hc.height=h; var hx=hc.getContext('2d',{willReadFrequently:true});
    hx.drawImage(holes(lay,1,lay.W,lay.H),0,0,w,h); var hd=hx.getImageData(0,0,w,h).data, cut=new Float32Array(w*h), i;
    for(i=0;i<w*h;i++) cut[i]=hd[i*4+3]/255;
    var r=Math.max(2,Math.round(reach*q/2)), f=boxBlur(boxBlur(boxBlur(cut,w,h,r),w,h,r),w,h,r);   /* three box passes, near Gaussian, reach about 30px */
    var rel=null; if(wall){ var wc=document.createElement('canvas'); wc.width=w; wc.height=h; var wx=wc.getContext('2d',{willReadFrequently:true}); wx.drawImage(wall,0,0,w,h); var wd=wx.getImageData(0,0,w,h).data, lo=255, hi=0; rel=new Float32Array(w*h);
      for(i=0;i<w*h;i++){ rel[i]=.2126*wd[i*4]+.7152*wd[i*4+1]+.0722*wd[i*4+2]; if(rel[i]<lo) lo=rel[i]; if(rel[i]>hi) hi=rel[i]; }
      for(i=0;i<w*h;i++) rel[i]=(rel[i]-lo)/Math.max(1,hi-lo); }
    var mc=document.createElement('canvas'); mc.width=w; mc.height=h; var mx=mc.getContext('2d'), md=mx.createImageData(w,h);
    for(i=0;i<w*h;i++){ var a=Math.min(1,f[i]*2.2)*(1-cut[i]); if(rel) a*=.3+.7*Math.pow(rel[i],.8); md.data[i*4]=255; md.data[i*4+1]=255; md.data[i*4+2]=255; md.data[i*4+3]=Math.round(255*a); }
    mx.putImageData(md,0,0); return mc;
  }

  function fontsReady(){ var r=(document.fonts&&document.fonts.ready)?document.fonts.ready:Promise.resolve();
    return r.then(function(){ return Promise.all([document.fonts.load('700 100px "Bespoke Stencil"'),document.fonts.load('400 100px "General Sans"')]).catch(function(){}); }); }
  function loadWall(){ return new Promise(function(res){ var phone=matchMedia('(max-width:760px)').matches, im=new Image(); im.decoding='async'; im.onload=function(){ res(im); }; im.onerror=function(){ res(null); }; im.src=phone?'media/ground/plaster-phone.jpg':'media/ground/plaster-desk.jpg'; }); }

  window.Cut={layout:layout,holes:holes,wallCanvas:wallCanvas,svgPlate:svgPlate,hole:hole,spillMask:spillMask,fontsReady:fontsReady,loadWall:loadWall,cssNum:cssNum,cssPx:cssPx};
})();
