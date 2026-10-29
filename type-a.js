/* type-a.js: variant A. THE PLATE on the home, THE COMMA and the turning pages on what we do. 25 Oct 2026, Nadir. Original code, no library beyond the vendored GSAP.
   The plate: a full-screen WebGL sheet in the mark3d manner. The tagline is baked into a texture (R = the cuts, G = DARE's orange spray, B = the printed white).
   Every pixel casts a ray from the camera to the hinged plate; a cut shows the film behind, the face is the combed plaster wall from --ground (glow.css), unlit, its edge lit only while it tilts,
   the plate's thickness throws a shadow onto the film inside each cut. DARE rides its own plane that lags the plate, so it is the last thing to lift.
   Without WebGL, or when the film cannot be read as a texture (double-clicked file), the same layout is drawn as an SVG sheet masked by the letters and hinged by CSS. */
(function(){
  "use strict";
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches, still=!!window.__still;
  var scene=document.querySelector('[data-plate]');
  if(scene) plate(scene);
  var comma=document.querySelector('[data-comma]');
  if(comma) commaPage(comma);

  function cssPx(prop,el,fs){ var p=document.createElement('i'); p.style.cssText='position:absolute;visibility:hidden;width:'+prop+';height:0'+(fs?';font-size:'+fs+'px':''); (el||document.body).appendChild(p); var v=parseFloat(getComputedStyle(p).width); p.remove(); return v; }
  function cssNum(prop){ return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(prop))||0; }
  /* the hollow rule, read once from type-base.css so the plate and the DOM words agree */
  function hollow(L6){ var dim=cssNum('--hollow-dim')||.48, C=(dim-.24)/.68; // the cut's output is .24 + .68 x shoulder(film); the shoulder's ceiling is set so the output tops out at dim
    var rim=Math.max(cssPx('var(--hollow-rim-min)'),cssPx('var(--hollow-rim)',null,L6));
    var clear=dim>=1; // dim 1 = a clear window: the film as it plays, no shoulder, no floor
    return {rim:rim, wall:Math.max(1,cssPx('var(--hollow-wall)',null,L6)), soft:cssPx('var(--hollow-soft)',null,L6)||0, dim:dim, sat:clear?1:(cssNum('--hollow-sat')||.6), a:clear?1:C*.926/(.926-C), clear:clear?1:0}; }
  function ease(t){ t=Math.max(0,Math.min(1,t)); return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; }
  function seg(p,a,b){ return Math.max(0,Math.min(1,(p-a)/(b-a))); }

  /* ---------- the layout, shared by the texture and the SVG: CSS px, y down ---------- */
  /* the composition flag: ?comp=1|2|3 on the URL, or data-comp on the scene; the default is the recommended one (NADIR-R4.md section 11).
     1 THE BIG CUT: three stencil rows, the size grown until the widest row meets the margin (up to 1.25 x the ladder's L6); the film gets a quarter more window.
     2 THE PRINTED SHEET: the giant centred, the small print at the plate's corners, the way a stencil sheet carries its registration marks.
     3 THE STAIR: WE MAKE THE WORK flush left, "other studios" tucked under WORK, WILL NOT DARE flush right, so DARE leaves the frame at its right edge. */
  var COMP=(function(){ var q=location.search.match(/comp=(\d)/), sc=document.querySelector('[data-plate]'); return parseInt(q&&q[1],10)||parseInt(sc&&sc.getAttribute('data-comp'),10)||3; })();
  function layout(W,H,ctx){
    var comp=COMP, L6=cssPx('var(--L6)'), m=cssPx('var(--m)'), L0=cssPx('var(--L0)');
    var maxW=W-2*m, phone=W<761, track=-.01;
    function width(font,text,ls){ ctx.font=font; if('letterSpacing' in ctx) ctx.letterSpacing=(ls||0)+'px'; var w=ctx.measureText(text).width; return w; }
    function wrap(font,words,ls){ var lines=[],cur=[]; words.forEach(function(w){ var t=cur.concat([w]).map(function(x){return x.t}).join(' '); if(cur.length&&width(font,t,ls)>maxW){ lines.push(cur); cur=[w]; } else cur=cur.concat([w]); }); if(cur.length) lines.push(cur); return lines; }
    var WE={t:'WE',k:'r'},MAKE={t:'MAKE',k:'r'},THE={t:'THE',k:'r'},WORK={t:'WORK',k:'r'},WILL={t:'WILL',k:'r'},NOT={t:'NOT',k:'r'},DARE={t:'DARE',k:'g'};
    var st1,st2;
    if(comp===1||comp===3){ // forced rows, then the size that fits the widest of them to the margin. Comp 3 (Asif, 29 Oct: "the see through letters need to be a lot bigger") grows to the margin, capped only by the screen's height
      st1=[[WE,MAKE],[THE,WORK]]; st2=phone?[[WILL,NOT],[DARE]]:[[WILL,NOT,DARE]];
      var widest=0; st1.concat(st2).forEach(function(ws){ widest=Math.max(widest,width('700 100px "Bespoke Stencil"',ws.map(function(t){return t.t}).join(' '),track*100)); });
      var fitW=Math.floor(100*maxW/widest);
      if(comp===1) L6=Math.min(L6*1.25,fitW);
      else { var nRows=st1.length+st2.length, navH=(function(){ var t=document.querySelector('.top'); return t?Math.ceil(t.getBoundingClientRect().bottom):60; })();
        // the stack in L6 units: the rows' pitch .88, the run-in .30 x 1.25, the cap .70, the strategy line about .30 + 24px above, the bottom line about .30 + 64px below
        var fitH=Math.floor((H-navH-24-88-32)/((nRows-1)*.88+.375+.70+.66));
        L6=Math.min(fitW,fitH); }
    }
    var os=Math.round(L6*.30), pitch=L6*.88, cap=.70*L6;   /* the one middle size: 30 percent of the poster (40px at 1440). The strategy line prints at it in full white; "other studios" at it in 66 percent white (was 36, then 46; Asif asked brighter twice, 25 Oct), a run-in, never a box */
    var stencil='700 '+L6+'px "Bespoke Stencil"', sans='400 '+os+'px "General Sans"', mid='400 '+os+'px "General Sans"', small='400 '+L0+'px "General Sans"';
    var ls=track*L6;
    if(comp===2){ st1=wrap(stencil,[WE,MAKE,THE,WORK],ls); st2=wrap(stencil,[WILL,NOT,DARE],ls); }
    var rows=[];
    st1.forEach(function(ws){ rows.push({font:stencil,size:L6,ls:ls,pitch:pitch,words:ws}); });
    rows.push({font:sans,size:os,ls:0,pitch:os*1.25,words:[{t:'other',k:'b',a:.66},{t:'studios',k:'b',a:.66}],under:comp===3?'last':null});
    st2.forEach(function(ws){ rows.push({font:stencil,size:L6,ls:ls,pitch:pitch,words:ws,align:comp===3?'right':'left'}); });
    // the strategy line, wrapped at the middle size (two lines on the phone)
    var strap=wrap(mid,'A strategy and design firm.'.split(' ').map(function(t){return {t:t}}),0).map(function(ws){ return ws.map(function(w){return w.t}).join(' '); });
    var capM=.718*os, brk=24, lhM=os*1.2;
    var block=0; rows.forEach(function(r,i){ block+= i? r.pitch : 0; }); block+=cap;
    var top;
    if(comp===2){ top=Math.round(H*.5-block*.5+H*.02); }
    else { // the strategy line is part of the block: its lines sit brk above the cap top, so the whole stack centres
      var l3n=(comp===3&&phone)?2:1, under=comp===3?brk+Math.round(capM)+(l3n-1)*lhM+40:brk+Math.round(L0*.72)+Math.round(L0*1.4);
      var strapH=capM+(strap.length-1)*lhM+brk;
      top=Math.round(H*.5-(block+strapH+under)*.5+strapH+H*.01); }
    var y=top+cap, out=[];
    rows.forEach(function(r,i){ if(i) y+=r.pitch; ctx.font=r.font; if('letterSpacing' in ctx) ctx.letterSpacing=r.ls+'px'; var sp=ctx.measureText(' ').width;
      var ws=r.words.map(function(w){ return {t:w.t,k:w.k,a:w.a||1,w:ctx.measureText(w.t).width}; }), rw=ws.reduce(function(a,w){return a+w.w},0)+sp*(ws.length-1);
      var x=m; if(r.align==='right') x=W-m-rw; else if(r.under==='last'&&out.length){ var pt=out[out.length-1].toks; x=pt[pt.length-1].x; }
      var toks=[]; ws.forEach(function(w){ toks.push({t:w.t,k:w.k,a:w.a,x:x,w:w.w}); x+=w.w+sp; });
      out.push({font:r.font,size:r.size,ls:r.ls,y:Math.round(y),toks:toks,align:r.align||'left'}); });
    var last=out[out.length-1].y, lastRow=out[out.length-1];
    // the printed lines around the cut. Each carries its own x and alignment so a composition can put it where the sheet needs it
    var who=[], navB=(function(){ var t=document.querySelector('.top'); return t?Math.ceil(t.getBoundingClientRect().bottom):60; })();
    var l3='We shape the brand. You keep the AI we build.'; // Dhaka · London left the hero (Asif, 25 Oct: "lets not highlight the london and dhaka so much"); the footer still carries it
    if(comp===2){ // the corners: the strategy line under the nav at the left, the two dim lines on one baseline at the foot, left and right
      strap.forEach(function(t,i){ who.push({t:t,font:mid,x:m,y:navB+brk+Math.round(capM)+i*lhM,k:'b',a:1}); });
      var fy=H-m-Math.round(L0*.3);
      if(phone){ who.push({t:l3,font:small,x:m,y:fy,k:'b',a:.5}); }
      else { who.push({t:l3,font:small,x:W-m,align:'right',y:fy,k:'b',a:.5}); }
    } else {
      strap.forEach(function(t,i){ who.push({t:t,font:mid,x:m,y:top-brk-Math.round(os*.3)-(strap.length-1-i)*lhM,k:'b',a:1}); });
      if(comp===3){ // the bottom-right edge, at the middle size and near full white like the strategy line (Asif, 29 Oct: "on bottom right edge and make it readable better like the middle text"); two lines on the phone
        var l3s=phone?['We shape the brand.','You keep the AI we build.']:[l3], cy=H-40;
        l3s.forEach(function(t,i){ who.push({t:t,font:mid,x:W-m,align:'right',y:cy-(l3s.length-1-i)*lhM,k:'b',a:.92}); });
      } else {
        who.push({t:l3,font:small,x:m,align:'left',y:last+brk+Math.round(L0*.72),k:'b',a:.5});
      }
    }
    return {rows:out,who:who,m:m,capTop:top,base:last,L6:L6,os:os,comp:comp,hollow:hollow(L6)};
  }

  /* ---------- the plate ---------- */
  function plate(scene){
    var stage=scene.querySelector('.stage'), host=scene.querySelector('.plate'), video=scene.querySelector('video'), after=scene.querySelector('.after');
    var W=0,H=0,dpr=1, lay=null, mode=null, gl=null, prog=null, U={}, texT=null, texV=null, texG=null, gImg=null, gSrc='', vidOK=false, poster=null, posterOK=false, pm=0, lastT=-1;
    var p=0; // scroll progress 0..1 over the first screen
    var meas=document.createElement('canvas').getContext('2d');
    window.__plate={};

    function texture(){ // the letters and the printed lines, at device pixels. R = the cuts, G = DARE's spray, B = the printed white (scaled by each token's alpha), A = the lit rim inside every cut
      var w=Math.round(W*dpr), h=Math.round(H*dpr);
      var c=document.createElement('canvas'); c.width=w; c.height=h;
      var x=c.getContext('2d'); x.fillStyle='#000'; x.fillRect(0,0,w,h); x.scale(dpr,dpr); x.textBaseline='alphabetic';
      lay.rows.forEach(function(r){ x.font=r.font; if('letterSpacing' in x) x.letterSpacing=r.ls+'px'; r.toks.forEach(function(t){ x.fillStyle=t.k==='r'?'#f00':t.k==='g'?'#0f0':'rgb(0,0,'+Math.round(255*t.a)+')'; x.fillText(t.t,t.x,r.y); }); });
      if('letterSpacing' in x) x.letterSpacing='0px';
      lay.who.forEach(function(w){ x.font=w.font; x.textAlign=w.align==='right'?'right':'left'; x.fillStyle='rgb(0,0,'+Math.round(255*w.a)+')'; x.fillText(w.t,w.x,w.y); }); x.textAlign='left';
      // the rim: each cut word stroked at twice the rim width, then kept only inside the glyph, so the lip is exactly one rim wide and the cut keeps its shape
      var rc=document.createElement('canvas'); rc.width=w; rc.height=h;
      var r=rc.getContext('2d'); r.scale(dpr,dpr); r.textBaseline='alphabetic'; r.lineJoin='miter'; r.miterLimit=3; r.fillStyle='#fff';
      // the wall first, at half alpha and twice (rim + wall) wide: the plate's thickness seen inside the cut, in shadow; then the lip at full alpha over it. The shader reads the two levels
      r.lineWidth=(lay.hollow.rim+lay.hollow.wall)*2; r.strokeStyle='rgba(255,255,255,.5)';
      lay.rows.forEach(function(row){ r.font=row.font; if('letterSpacing' in r) r.letterSpacing=row.ls+'px'; row.toks.forEach(function(t){ if(t.k==='r') r.strokeText(t.t,t.x,row.y); }); });
      r.lineWidth=lay.hollow.rim*2; r.strokeStyle='#fff';
      lay.rows.forEach(function(row){ r.font=row.font; if('letterSpacing' in r) r.letterSpacing=row.ls+'px'; row.toks.forEach(function(t){ if(t.k==='r') r.strokeText(t.t,t.x,row.y); }); });
      // destination-in wipes everything outside each shape it draws, so the cut words go onto one canvas first and trim the stroke in a single pass
      var fc=document.createElement('canvas'); fc.width=w; fc.height=h;
      var f=fc.getContext('2d'); f.scale(dpr,dpr); f.textBaseline='alphabetic'; f.fillStyle='#fff';
      lay.rows.forEach(function(row){ f.font=row.font; if('letterSpacing' in f) f.letterSpacing=row.ls+'px'; row.toks.forEach(function(t){ if(t.k==='r') f.fillText(t.t,t.x,row.y); }); });
      r.setTransform(1,0,0,1,0,0); r.globalCompositeOperation='destination-in'; r.drawImage(fc,0,0); r.globalCompositeOperation='source-over';
      var a=x.getImageData(0,0,w,h), b=r.getImageData(0,0,w,h), d=a.data, e=b.data;
      for(var i=3;i<d.length;i+=4) d[i]=e[i];
      return {w:w,h:h,data:d,rgb:c,rim:rc};
    }
    function rimPNG(){ var t=texture(), c=document.createElement('canvas'); c.width=t.w; c.height=t.h; var x=c.getContext('2d'); x.fillStyle='#000'; x.fillRect(0,0,t.w,t.h); x.drawImage(t.rim,0,0); return c.toDataURL('image/png'); }

    /* the wall: the plate's face is the combed plaster, read from --ground (glow.css, the one switch point) through the stage's own computed background,
       so the CSS ground, the GL face and the SVG face can never disagree. Drawn at the plate canvas's device size, cover, anchored right top, resampled with
       high quality smoothing so the shader samples it one to one at rest: the moire guard for the fine comb grooves */
    function groundURL(){ var b=getComputedStyle(stage).backgroundImage||'', m=/url\(["']?([^"')]+)["']?\)/.exec(b); return m?m[1]:''; }
    function loadGround(){ var u=groundURL(); if(!u||u===gSrc) return; gSrc=u; var im=new Image(); im.decoding='async';
      im.onload=function(){ if(gSrc!==u) return; gImg=im; if(mode==='gl'){ uploadGround(); wake(); } }; im.src=u; }
    function uploadGround(){
      if(!gl||!gImg||!W) return;
      var w=Math.round(W*dpr), h=Math.round(H*dpr), c=document.createElement('canvas'); c.width=w; c.height=h;
      var x=c.getContext('2d'); x.imageSmoothingEnabled=true; x.imageSmoothingQuality='high'; x.fillStyle='#12100C'; x.fillRect(0,0,w,h);
      var iw=gImg.naturalWidth, ih=gImg.naturalHeight, k=Math.max(w/iw,h/ih), dw=iw*k, dh=ih*k; x.drawImage(gImg,w-dw,0,dw,dh);
      gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D,texG); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,c); gl.uniform1f(U.uHasG,1); gl.activeTexture(gl.TEXTURE0);
    }

    var VS='attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
    var FS=[
      'precision highp float;varying vec2 v;uniform sampler2D uT,uV,uG;uniform vec2 uRes,uVid,uAnc;uniform float uP,uHas,uHasG;uniform vec4 uA,uB,uH;uniform vec3 uL;',
      'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      // the plate hinged at its top edge: returns plate uv (y down), the ray depth, and the facing
      'vec4 plate(vec3 d,float ang,float tz,float ty){float W=uRes.x,H=uRes.y;vec3 p0=vec3(0.,H*.5+ty,uP+tz);float s=sin(ang),c=cos(ang);vec3 n=vec3(0.,s,c);vec3 vd=vec3(0.,c,-s);float den=dot(n,d);if(abs(den)<1e-5)return vec4(0.,0.,-1.,0.);float t=dot(n,p0)/den;if(t<=0.)return vec4(0.,0.,-1.,0.);vec3 q=t*d-p0;float r=dot(q,vd);return vec4((q.x+W*.5)/W,-r/H,t,den);}',
      // the film, cover-fitted, anchored to its right edge like the DOM video
      'vec3 filmAt(vec2 q){vec3 f0=vec3(.043,.043,.043);if(uHas>.5){float sa=uRes.x/uRes.y,va=uVid.x/uVid.y;vec2 f=vec2(q.x,1.-q.y);if(va>sa){float k=sa/va;f.x=uAnc.x*(1.-k)+f.x*k;}else{float k=va/sa;f.y=uAnc.y*(1.-k)+f.y*k;}f0=texture2D(uV,f).rgb;}return f0;}',
      'float lum(vec3 c){return dot(c,vec3(.2126,.7152,.0722));}',
      // while the sheet is in front of it the street is lit up through a soft curve, one light for the cuts and the exposed edges alike; as the sheet goes the film settles to its own grade
      'vec3 filmLit(vec2 q){vec3 r=filmAt(q);return mix(r,1.-exp(-r*2.6),uA.w);}',
      'void main(){vec2 px=(v-.5)*uRes;vec3 d=normalize(vec3(px,uP));',
      'vec3 raw=filmAt(v);',
      'vec3 film=filmLit(v);',
      'vec3 col=film;',
      'vec4 m=plate(d,uA.x,uA.y,uA.z);',
      'if(uA.w>0.&&m.z>0.&&m.x>=0.&&m.x<=1.&&m.y>=0.&&m.y<=1.){',
      ' vec4 tx=texture2D(uT,m.xy);float hole=tx.r,white=tx.b,rim=smoothstep(.62,.88,tx.a),wall=smoothstep(.14,.38,tx.a);',
      ' float s=sin(uA.x),c=cos(uA.x);vec3 nf=vec3(0.,-s,-c);float dif=max(dot(nf,uL),0.);vec3 h=normalize(uL-d);float spec=pow(max(dot(nf,h),0.),70.);',
      // the face is the wall itself: the combed plaster, unlit, sampled in plate space so it travels with the sheet as it hinges. No lamp on it; the light lives in the work
      ' vec3 steel=uHasG>.5?texture2D(uG,m.xy).rgb:vec3(.0706,.0627,.0471);',
      // the sheet's edge catches the light only once it starts to tilt; at rest the wall runs to the frame with no drawn border
      ' float e=min(min(m.x,1.-m.x)*uRes.x,min(m.y,1.-m.y)*uRes.y);steel+=vec3(.16,.16,.15)*(1.-smoothstep(0.,2.5,e))*smoothstep(0.,.05,uA.x);',
      // inside a cut the plate's thickness throws a shadow onto the film at the cut's top left; it lengthens as the plate lifts away
      ' float L=(7.+uA.y*.012)*max(uRes.x/1440.,.6)/uRes.y;vec2 o=vec2(-L*.7*uRes.y/uRes.x,-L);',
      ' float a1=texture2D(uT,m.xy+o).r,a2=texture2D(uT,m.xy+o*.5).r,a3=texture2D(uT,m.xy+o*1.7).r;float sh=mix(.55,1.,(a1+a2+a3)/3.);',
      ' vec3 face=mix(steel,vec3(.95,.95,.94)*(.5+.5*dif),white);',
      // the hollow rule inside a cut (type-base.css): the street is softened (nine taps, --hollow-soft wide), pulled toward grey (--hollow-sat), and run through a shoulder whose ceiling is set so the cut's brightest pixel stays under --hollow-dim;
      // Anwar's 24 percent floor stays under it and the cut shadow still falls across it. So the window is always lit and never brighter than the rim can stand 3 to 1 above
      ' vec3 fs=film;if(hole>.08&&uH.w<.5){vec2 sp=uH.x/uRes;fs=(film+filmLit(v+vec2(sp.x,0.))+filmLit(v-vec2(sp.x,0.))+filmLit(v+vec2(0.,sp.y))+filmLit(v-vec2(0.,sp.y))+filmLit(v+sp)+filmLit(v-sp)+filmLit(v+vec2(sp.x,-sp.y))+filmLit(v-vec2(sp.x,-sp.y)))/9.;',
      '  fs=mix(vec3(lum(fs)),fs,uH.z);fs=uH.y*fs/(fs+uH.y);}',
      ' float aa=smoothstep(.3,.7,hole);vec3 pc=mix(face,uH.w>.5?film*sh:.24+.68*fs*sh,aa);',   // clear (uH.w): the film itself, only the plate's own thickness shadow on it
      // the cut's wall: the plate's thickness in shadow, one --hollow-wall wide just inside the lip, so the lip always has a dark neighbour whatever the film does
      ' pc=mix(pc,vec3(.006,.006,.0055)*(.7+.3*dif),wall);',
      // the lit lip of the cut: one rim wide, inside the edge, the plate's own white catching the same light as its face
      ' pc=mix(pc,vec3(.97,.97,.96)*(.85+.15*dif),rim);',
      ' col=mix(col,pc,uA.w);}',
      // DARE: orange sprayed on its own plane, the last to lift
      'vec4 b=plate(d,uB.x,uB.y,uB.z);',
      'if(uB.w>0.&&b.z>0.&&b.x>=0.&&b.x<=1.&&b.y>=0.&&b.y<=1.){float o=texture2D(uT,b.xy).g;float s=sin(uB.x),c=cos(uB.x);vec3 nf=vec3(0.,-s,-c);float dif=max(dot(nf,uL),0.);vec3 paint=vec3(.886,.498,.133)*(.62+.38*dif);',
      // as the sheet goes DARE stops being paint on steel and becomes a title card on the film: the film's own grain (its luma against its four neighbours) and a fine speckle pass over the word, and the street's light modulates it
      ' float card=1.-uA.w;vec2 e=1.5/uRes;float g0=lum(raw);float gb=(lum(filmAt(v+vec2(e.x,0.)))+lum(filmAt(v-vec2(e.x,0.)))+lum(filmAt(v+vec2(0.,e.y)))+lum(filmAt(v-vec2(0.,e.y))))*.25;',
      ' float grain=clamp((g0-gb)*5.,-.3,.3)+(hash(floor(px*.5)+vec2(7.,3.))-.5)*.16;',
      ' paint*=1.+grain*card;paint=mix(paint,paint*(.86+.3*g0),card*.7);',
      ' col=mix(col,paint,smoothstep(.3,.7,o)*uB.w);}',
      'gl_FragColor=vec4(col,1.);}'
    ].join('\n');

    function startGL(){
      var cv=document.createElement('canvas'); gl=cv.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false});
      if(!gl) return false;
      prog=gl.createProgram();
      [[gl.VERTEX_SHADER,VS],[gl.FRAGMENT_SHADER,FS]].forEach(function(s){ var sh=gl.createShader(s[0]); gl.shaderSource(sh,s[1]); gl.compileShader(sh); if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)); gl.attachShader(prog,sh); });
      gl.bindAttribLocation(prog,0,'a'); gl.linkProgram(prog); if(!gl.getProgramParameter(prog,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      gl.useProgram(prog);
      var b=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,b); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
      ['uT','uV','uG','uRes','uVid','uAnc','uP','uHas','uHasG','uA','uB','uL','uH'].forEach(function(n){ U[n]=gl.getUniformLocation(prog,n); });
      texT=gl.createTexture(); texV=gl.createTexture(); texG=gl.createTexture();
      [texT,texV,texG].forEach(function(t){ gl.bindTexture(gl.TEXTURE_2D,t); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE); });
      gl.uniform1i(U.uT,0); gl.uniform1i(U.uV,1); gl.uniform1i(U.uG,2); gl.uniform1f(U.uHasG,0);
      var L=[-.45,.55,-.7], l=Math.hypot(L[0],L[1],L[2]); gl.uniform3f(U.uL,L[0]/l,L[1]/l,L[2]/l);
      gl.uniform2f(U.uAnc,1,.5);
      host.appendChild(cv); mode='gl'; cv.addEventListener('webglcontextlost',function(e){ e.preventDefault(); gl=null; host.innerHTML=''; mode=null; startSVG(); });
      // the poster is the film's first frame until the film itself can be read
      poster=new Image(); poster.onload=function(){ posterOK=true; }; poster.src=video.getAttribute('poster');
      return true;
    }
    function uploadVideo(){
      if(!gl) return;
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D,texV);
      if(video.readyState>=2&&!video.paused&&video.currentTime!==lastT){
        try{ gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,video); vidOK=true; lastT=video.currentTime; gl.uniform2f(U.uVid,video.videoWidth,video.videoHeight); gl.uniform1f(U.uHas,1); }
        catch(e){ // a double-clicked file: the film cannot be read as a texture. Draw the plate the other way
          gl=null; host.innerHTML=''; mode=null; startSVG(); return; }
      } else if(!vidOK&&posterOK&&pm!==1){ try{ gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,poster); pm=1; gl.uniform2f(U.uVid,poster.naturalWidth,poster.naturalHeight); gl.uniform1f(U.uHas,1); }catch(e){ gl=null; host.innerHTML=''; mode=null; startSVG(); return; } }
      gl.activeTexture(gl.TEXTURE0);
    }
    function sizeGL(){
      var cv=host.querySelector('canvas'); dpr=Math.min(window.devicePixelRatio||1,2); if(W*dpr>3600) dpr=3600/W;
      cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); gl.viewport(0,0,cv.width,cv.height);
      gl.uniform2f(U.uRes,cv.width,cv.height); gl.uniform1f(U.uP,1200*dpr);
      var t=texture(), hk=lay.hollow; gl.uniform4f(U.uH,hk.soft*dpr,hk.a,hk.sat,hk.clear);
      // uploaded as raw bytes, never as a canvas: a canvas upload would premultiply the rim's alpha into the cut's red and lose the cut wherever the rim is 0
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,texT); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,t.w,t.h,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array(t.data.buffer));
      uploadGround();
    }
    function poses(p){ // the sheet hinges at its top edge, recedes and rises clean out of the top of the frame, and is gone (opacity 0) by .74:
      // never a thumbnail hanging mid-screen. DARE is the paint that went through the stencil onto the street: it holds flat and whole while the sheet leaves,
      // then dissolves into the film (.76 to .94) a beat before the ghost word arrives (.78)
      var a1=ease(seg(p,0,.72))*1.02, z1=ease(seg(p,.22,.78))*1500, y1=ease(seg(p,.3,.76))*H*1.6, f1=1-seg(p,.52,.74);
      var s=seg(p,.74,.94), z2=ease(s)*300, y2=ease(s)*H*.12, f2=1-seg(p,.76,.94);
      return {A:[a1,z1,y1,f1],B:[0,z2,y2,f2]};
    }
    var raf=0, running=true;
    function drawGL(){
      raf=0; if(!gl) return;
      uploadVideo(); if(!gl) return;
      var k=poses(p), d=dpr;
      gl.uniform4f(U.uA,k.A[0],k.A[1]*d,k.A[2]*d,k.A[3]); gl.uniform4f(U.uB,k.B[0],k.B[1]*d,k.B[2]*d,k.B[3]);
      gl.drawArrays(gl.TRIANGLES,0,3);
      if(running&&!document.hidden&&(p<1||!video.paused)) raf=requestAnimationFrame(drawGL);
    }
    function wake(){ if(mode==='gl'&&!raf) raf=requestAnimationFrame(drawGL); }

    /* the SVG sheet: the same layout, the letters cut by a mask, hinged by CSS */
    function startSVG(){
      mode='svg'; host.innerHTML='';
      var NS='http://www.w3.org/2000/svg';
      function el(n,at,par){ var e=document.createElementNS(NS,n); for(var k in at) e.setAttribute(k,at[k]); (par||null)&&par.appendChild(e); return e; }
      var svg=el('svg',{class:'sheet',viewBox:'0 0 '+W+' '+H,width:W,height:H,'aria-hidden':'true'},host);
      var defs=el('defs',{},svg), mask=el('mask',{id:'plate-cut',maskUnits:'userSpaceOnUse',x:0,y:0,width:W,height:H},defs);
      el('rect',{x:0,y:0,width:W,height:H,fill:'#fff'},mask);
      function text(par,t,x,y,font,fill,ls){ var m=/^(\d+) ([\d.]+)px "(.+)"$/.exec(font);   /* the size may be fractional: --L6 is 17px + 8vw, 132.2px at 1440 */ var e=el('text',{x:x,y:y,fill:fill,'font-family':'"'+m[3]+'"','font-weight':m[1],'font-size':m[2],'letter-spacing':ls||0,'xml:space':'preserve'},par); e.textContent=t; return e; }
      lay.rows.forEach(function(r){ r.toks.forEach(function(t){ if(t.k==='r') text(mask,t.t,t.x,r.y,r.font,'#000',r.ls); }); });
      // the face: the unlit wall's own black under the plaster picture, both cut by the letters; the picture is re-read from --ground each time the sheet is drawn, so crossing 760px swaps desk and phone files
      el('rect',{x:0,y:0,width:W,height:H,fill:'#12100C',mask:'url(#plate-cut)'},svg);
      var gu=groundURL(); if(gu) el('image',{href:gu,x:0,y:0,width:W,height:H,preserveAspectRatio:'xMaxYMin slice',mask:'url(#plate-cut)'},svg);
      // the hollow rule's rim: the cut words stroked at twice the rim and clipped to their own shapes, so the lip is one rim wide inside the edge
      var clip=el('clipPath',{id:'plate-cuts'},defs);
      lay.rows.forEach(function(r){ r.toks.forEach(function(t){ if(t.k==='r') text(clip,t.t,t.x,r.y,r.font,'#fff',r.ls); }); });
      var wall=el('g',{'clip-path':'url(#plate-cuts)',fill:'none',stroke:'#141413','stroke-width':(lay.hollow.rim+lay.hollow.wall)*2,'stroke-linejoin':'miter'},svg);
      lay.rows.forEach(function(r){ r.toks.forEach(function(t){ if(t.k==='r') text(wall,t.t,t.x,r.y,r.font,'none',r.ls); }); });
      var lip=el('g',{'clip-path':'url(#plate-cuts)',fill:'none',stroke:'#F2F2F0','stroke-width':lay.hollow.rim*2,'stroke-linejoin':'miter'},svg);
      lay.rows.forEach(function(r){ r.toks.forEach(function(t){ if(t.k==='r') text(lip,t.t,t.x,r.y,r.font,'none',r.ls); }); });
      el('rect',{class:'edge',x:.5,y:.5,width:W-1,height:H-1,fill:'none',stroke:'rgba(242,242,240,.16)',opacity:0},svg);   // the edge shows only while the sheet tilts, as in the shader
      lay.rows.forEach(function(r){ r.toks.forEach(function(t){ if(t.k==='b') text(svg,t.t,t.x,r.y,r.font,'rgba(242,242,240,'+t.a+')',0); }); });
      lay.who.forEach(function(w){ var e=text(svg,w.t,w.x,w.y,w.font,'rgba(242,242,240,'+w.a+')',0); e.setAttribute('letter-spacing',w.a===1?'0':'.32'); if(w.align==='right') e.setAttribute('text-anchor','end'); });
      var dare=el('svg',{class:'dare',viewBox:'0 0 '+W+' '+H,width:W,height:H,'aria-hidden':'true'},host);
      lay.rows.forEach(function(r){ r.toks.forEach(function(t){ if(t.k==='g') text(dare,t.t,t.x,r.y,r.font,'#E27F22',r.ls); }); });
      video.classList.add('under'); video.classList.add('cutlit');   /* the film under the sheet is dimmed, softened and greyed (type-a.css .cutlit) while the sheet stands in front of it */
      drawSVG();
    }
    function drawSVG(){
      var k=poses(p), s=host.querySelector('.sheet'), d=host.querySelector('.dare'); if(!s) return;
      s.style.transform='translate3d(0,'+(-k.A[2])+'px,'+(-k.A[1])+'px) rotateX('+(-k.A[0]*180/Math.PI)+'deg)'; s.style.opacity=k.A[3]; var ed=s.querySelector('.edge'); if(ed){ var q=Math.min(1,k.A[0]/.05); ed.setAttribute('opacity',(q*q*(3-2*q)).toFixed(3)); }
      d.style.transform='translate3d(0,'+(-k.B[2])+'px,'+(-k.B[1])+'px) rotateX('+(-k.B[0]*180/Math.PI)+'deg)'; d.style.opacity=k.B[3];
      video.classList.toggle('cutlit',k.A[3]>.5);
    }

    function size(){
      var r=stage.getBoundingClientRect(); var w=Math.round(r.width), h=Math.round(r.height); if(!w||!h||(w===W&&h===H)) return; W=w; H=h;
      lay=layout(W,H,meas); window.__plate={capTop:lay.capTop,base:lay.base,L6:lay.L6,os:lay.os,comp:lay.comp,W:W,H:H,mode:mode,rows:lay.rows,who:lay.who,hollow:lay.hollow};
      loadGround(); if(mode==='gl') sizeGL(); else if(mode==='svg') startSVG();
      if(mode==='gl') wake();
    }
    function setP(v){ p=v; window.__plate.p=p; after.style.setProperty('--rev',seg(p,.78,1)); if(mode==='gl') wake(); else drawSVG(); }

    function boot(){
      var r=stage.getBoundingClientRect(); W=Math.round(r.width); H=Math.round(r.height); lay=layout(W,H,meas);
      window.__plate={capTop:lay.capTop,base:lay.base,L6:lay.L6,os:lay.os,comp:lay.comp,W:W,H:H,rows:lay.rows,who:lay.who,hollow:lay.hollow};
      var ok=false; if(!still){ try{ ok=startGL(); if(ok) sizeGL(); }catch(e){ ok=false; if(window.console) console.warn('plate:',e.message); } }
      if(!ok) startSVG(); loadGround(); window.__plate.mode=mode; window.__plate.ground=function(){ return {src:gSrc,loaded:!!gImg}; }; window.__plate.at=poses; window.__plate.mask=function(){ return texture().rgb.toDataURL('image/png'); }; window.__plate.rim=rimPNG;
      if(mode==='gl'){ wake(); video.addEventListener('play',wake); }
      new ResizeObserver(size).observe(stage);
      document.addEventListener('visibilitychange',function(){ if(!document.hidden) wake(); });
      if(reduce||still){ document.documentElement.classList.add('plate-still'); setP(0); return; }
      window.addEventListener('load',function(){
        if(!window.gsap||!window.ScrollTrigger){ document.documentElement.classList.add('plate-still'); return; }
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.create({trigger:scene,start:'top top',end:'bottom bottom',scrub:true,onUpdate:function(st){ setP(st.progress); }});
      });
    }
    var ready=(document.fonts&&document.fonts.ready)?document.fonts.ready:Promise.resolve();
    ready.then(function(){ return Promise.all([document.fonts.load('700 100px "Bespoke Stencil"'),document.fonts.load('400 100px "General Sans"'),document.fonts.load('500 12px "General Sans"')]).catch(function(){}); }).then(boot);
  }

  /* ---------- what we do: the comma, and the pages ---------- */
  function commaPage(hero){
    if(!reduce&&!still){ hero.classList.add('arm'); var go=function(){ requestAnimationFrame(function(){ requestAnimationFrame(function(){ hero.classList.add('in'); }); }); }; (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(go); }
    if(reduce||still||!matchMedia('(min-width:761px)').matches) return;
    window.addEventListener('load',function(){
      if(!window.gsap||!window.ScrollTrigger) return;
      gsap.registerPlugin(ScrollTrigger);
      var main=document.querySelector('main'), duos=gsap.utils.toArray('main > .duo'), pics=duos.map(function(d){ return d.querySelector('.pic'); }).filter(Boolean);
      if(pics.length<2) return;
      var pages=document.createElement('div'); pages.className='pages'; pages.setAttribute('aria-hidden','false');
      // the sheets stack square, no sideways fan: a 4px fan showed past the box as a 1px seam at x 1401 (Anwar, round 2, ruling 9); depth alone carries the stack
      pics.forEach(function(pc,i){ pages.appendChild(pc); gsap.set(pc,{zIndex:10-i,z:-i*22,x:0,y:0});
        // glow.js bound its row parallax to ".duo .pic img" before the move: that scrub would drift a 1600px image through the sheet. Kill it and its trigger, clear what it set
        var im=pc.querySelector('img'); if(im){ gsap.getTweensOf(im).forEach(function(t){ if(t.scrollTrigger) t.scrollTrigger.kill(); t.kill(); }); gsap.set(im,{clearProps:'all'}); } });
      main.appendChild(pages);
      // the stack holds its place on the right while the ledger of words scrolls past; each row turns its own page as it is read
      // the stack stands in the right 40 percent of the first screen at rest (Anwar fix 5, his second option) and is pinned from scroll 0 while the ledger reads past it
      ScrollTrigger.create({trigger:pages,start:0,endTrigger:duos[duos.length-1],end:'bottom 80%',pin:pages,pinSpacing:false,refreshPriority:1});
      pics.forEach(function(pc,i){ if(i===pics.length-1) return;
        gsap.fromTo(pc,{rotateY:0},{rotateY:-112,ease:'none',immediateRender:false,scrollTrigger:{trigger:duos[i],start:'bottom 70%',end:'bottom 25%',scrub:.4,onUpdate:function(st){ pc.style.setProperty('--lift',Math.sin(st.progress*Math.PI)*.9); }}});
      });
      ScrollTrigger.refresh();
    });
  }
})();
