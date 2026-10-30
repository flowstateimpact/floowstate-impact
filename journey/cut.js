/* journey/cut.js: the cut, shared by the three journey prototypes. 31 Oct 2026, Nadir. Prototype, never published (.vercelignore).
   One layout for the hero words (the live plate's composition 3, ported from type-a.js so the stack, sizes and the right-aligned closing line
   are the ones the site already carries), and the canvases every variant draws from:
     tex    RGBA bytes for a shader: R = the cut letters (holes), G = DARE's orange, B = the printed white, A = the lit lip inside each cut
     plate  the plate as one picture: the combed wall (etched, lit from the upper left), the holes transparent, the lip, the print, DARE
     wall   the plate's thickness: a dark band just inside every cut, drawn as its own layer so a pointer can move it against the face
   Reads --L6, --m, --L0, the hollow figures and --plate-etch from the page's own CSS, so nothing here invents a size. */
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
    rows.push({font:mid,size:os,ls:0,pitch:os*1.25,words:[{t:'other',k:'b',a:.66},{t:'studios',k:'b',a:.66}],under:'last'});
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

  /* the shader texture, as type-a.js builds it */
  function tex(lay,dpr){
    var W=lay.W,H=lay.H,w=Math.round(W*dpr),h=Math.round(H*dpr);
    var c=document.createElement('canvas'); c.width=w; c.height=h; var x=c.getContext('2d',{willReadFrequently:true}); x.fillStyle='#000'; x.fillRect(0,0,w,h); x.scale(dpr,dpr); x.textBaseline='alphabetic';
    lay.rows.forEach(function(r){ setFont(x,r); r.toks.forEach(function(t){ x.fillStyle=t.k==='r'?'#f00':t.k==='g'?'#0f0':'rgb(0,0,'+Math.round(255*t.a)+')'; x.fillText(t.t,t.x,r.y); }); });
    if('letterSpacing' in x) x.letterSpacing='0px';
    lay.who.forEach(function(wd){ x.font=wd.font; x.textAlign=wd.align==='right'?'right':'left'; x.fillStyle='rgb(0,0,'+Math.round(255*wd.a)+')'; x.fillText(wd.t,wd.x,wd.y); }); x.textAlign='left';
    var lipC=lip(lay,dpr,w,h), e=lipC.getContext('2d').getImageData(0,0,w,h).data, a=x.getImageData(0,0,w,h), d=a.data;
    for(var i=3;i<d.length;i+=4) d[i]=e[i];
    return {w:w,h:h,data:d};
  }
  /* the lip: the cut words stroked at twice the width, then kept only inside the glyphs, so the lit edge is exactly one lip wide */
  function lip(lay,dpr,w,h){
    var rc=document.createElement('canvas'); rc.width=w; rc.height=h; var r=rc.getContext('2d',{willReadFrequently:true}); r.scale(dpr,dpr); r.textBaseline='alphabetic'; r.lineJoin='miter'; r.miterLimit=3;
    r.lineWidth=(lay.hollow.rim+lay.hollow.wall)*2; r.strokeStyle='rgba(255,255,255,.5)';
    lay.rows.forEach(function(row){ setFont(r,row); row.toks.forEach(function(t){ if(t.k==='r') r.strokeText(t.t,t.x,row.y); }); });
    r.lineWidth=2*Math.max(1,lay.hollow.rim*dpr)/dpr; r.strokeStyle='#fff';
    lay.rows.forEach(function(row){ setFont(r,row); row.toks.forEach(function(t){ if(t.k==='r') r.strokeText(t.t,t.x,row.y); }); });
    var fc=holes(lay,dpr,w,h);
    r.setTransform(1,0,0,1,0,0); r.globalCompositeOperation='destination-in'; r.drawImage(fc,0,0); r.globalCompositeOperation='source-over';
    return rc;
  }
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

  /* the plate as one picture for the CSS variants: the wall, see-through by --plate-see, the holes punched out, the lip, the print, DARE */
  function plateCanvas(lay,dpr,wall){
    var w=Math.round(lay.W*dpr), h=Math.round(lay.H*dpr), see=Math.min(.9,cssNum('--plate-see'));
    var c=document.createElement('canvas'); c.width=w; c.height=h; var x=c.getContext('2d');
    x.drawImage(wall,0,0,w,h);
    x.globalCompositeOperation='destination-in'; x.fillStyle='rgba(0,0,0,'+(1-see*.6)+')'; x.fillRect(0,0,w,h);
    x.globalCompositeOperation='destination-out'; x.drawImage(holes(lay,dpr,w,h),0,0);
    x.globalCompositeOperation='source-over';
    var lp=lip(lay,dpr,w,h), lc=document.createElement('canvas'); lc.width=w; lc.height=h; var l=lc.getContext('2d'); l.drawImage(lp,0,0);
    l.globalCompositeOperation='source-in'; l.fillStyle='rgba(242,242,240,'+lay.hollow.lip+')'; l.fillRect(0,0,w,h);   // the lip's own white, at --hollow-lip
    x.drawImage(lc,0,0);
    x.save(); x.scale(dpr,dpr); x.textBaseline='alphabetic';
    lay.rows.forEach(function(r){ setFont(x,r); r.toks.forEach(function(t){ if(t.k==='g'){ x.fillStyle='#E27F22'; x.fillText(t.t,t.x,r.y); } else if(t.k==='b'){ x.fillStyle='rgba(242,242,240,'+t.a+')'; x.fillText(t.t,t.x,r.y); } }); });
    if('letterSpacing' in x) x.letterSpacing='0px';
    lay.who.forEach(function(wd){ x.font=wd.font; x.textAlign=wd.align==='right'?'right':'left'; x.fillStyle='rgba(242,242,240,'+wd.a+')'; x.fillText(wd.t,wd.x,wd.y); });
    x.restore();
    return c;
  }
  /* the thickness: the wall ink (type-base.css --hollow-wall-ink) as a band inside every cut, T px wide; its own layer, moved by the pointer */
  function wallBand(lay,dpr,T){
    var w=Math.round(lay.W*dpr), h=Math.round(lay.H*dpr), c=document.createElement('canvas'); c.width=w; c.height=h; var x=c.getContext('2d'); x.scale(dpr,dpr); x.textBaseline='alphabetic'; x.lineJoin='miter'; x.miterLimit=3;
    x.strokeStyle='#141413'; x.lineWidth=T*2;
    lay.rows.forEach(function(row){ setFont(x,row); row.toks.forEach(function(t){ if(t.k==='r') x.strokeText(t.t,t.x,row.y); }); });
    x.setTransform(1,0,0,1,0,0); x.globalCompositeOperation='destination-in'; x.drawImage(holes(lay,dpr,w,h),0,0); x.globalCompositeOperation='source-over';
    return c;
  }

  function fontsReady(){ var r=(document.fonts&&document.fonts.ready)?document.fonts.ready:Promise.resolve();
    return r.then(function(){ return Promise.all([document.fonts.load('700 100px "Bespoke Stencil"'),document.fonts.load('400 100px "General Sans"')]).catch(function(){}); }); }
  function loadWall(){ return new Promise(function(res){ var phone=matchMedia('(max-width:760px)').matches, im=new Image(); im.decoding='async'; im.onload=function(){ res(im); }; im.onerror=function(){ res(null); }; im.src=phone?'../media/ground/plaster-phone.jpg':'../media/ground/plaster-desk.jpg'; }); }

  window.Cut={layout:layout,tex:tex,holes:holes,wallCanvas:wallCanvas,plateCanvas:plateCanvas,wallBand:wallBand,fontsReady:fontsReady,loadWall:loadWall,cssNum:cssNum,cssPx:cssPx};
})();
