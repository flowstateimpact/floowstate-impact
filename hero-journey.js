/* hero-journey.js: the home hero as a journey (R18, 31 Oct 2026, Nadir). Journey V2 made live: journey/journey.js and journey/v2.js merged onto hero-cut.js.
   The reel plays full frame behind the black plate; the words are cut through the plate as vectors (svgPlate), so the edges stay sharp at any zoom.
   Scroll is a camera, not a CSS scale: the viewBox flies into the thickest point of the O in WORK (we enter the work through the word) and carries that
   point to the frame centre as it grows, so the frame fills with film, never with plate. The plate's thickness band slides under the pointer and fades
   from p .35; the light spill (the reel blurred and screened onto the plate's ridges round each letter) glows with the film; the plate goes at .6 to .72.
   Hand-over: the reel stays whole to .88, FILM and the caption come up over it from .82 to .9, and at .9 the lane film replaces it on one frame, from
   its first frame (her face). Two moving pictures never share the frame. Nothing here knows the length of either film. */
(function(){
  "use strict";
  var scene=document.querySelector('[data-journey]'); if(!scene||!window.Cut) return;
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches, still=!!window.__still, render=/render=1/.test(location.search), root=document.documentElement;
  var stage=scene.querySelector('.stage'), host=scene.querySelector('.plate'), reel=scene.querySelector('#reel'), lane=scene.querySelector('#lane'), after=scene.querySelector('.after'), btn=scene.querySelector('.hj-pause');
  var dpr=Math.min(devicePixelRatio||1,2), meas=document.createElement('canvas').getContext('2d'), T=7, Q=.25, REACH=30, SPILL=.3;
  var J=window.__journey={p:0,mode:'boot',past:false};
  var lay=null, hole=null, S=39, parts=null, url=null, spill=null, sctx=null, mask=null, tiny=null, tctx=null, lastT=-1, seen=true, userPaused=false, armed=false, past=false;
  var ptr={x:0,y:0,has:false}, sx=0, sy=0;
  function seg(p,a,b){ return Math.max(0,Math.min(1,(p-a)/(b-a))); }
  function ease(t){ t=Math.max(0,Math.min(1,t)); return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; }
  function cur(){ return past?lane:reel; }

  /* the films: the reel is current until .9, the lane after; the lane is not fetched until p .6 */
  lane.removeAttribute('autoplay'); lane.preload='none'; lane.pause(); lane.style.visibility='hidden';
  if(reduce||still){ reel.removeAttribute('autoplay'); reel.pause(); }
  function label(){ var v=cur(), on=!v.paused; btn.textContent=on?'Pause':'Play'; btn.setAttribute('aria-label',on?'Pause the film':'Play the film'); }
  [reel,lane].forEach(function(v){ v.addEventListener('play',label); v.addEventListener('pause',label); });
  btn.addEventListener('click',function(){ var v=cur(); if(v.paused){ userPaused=false; v.play().catch(function(){}); } else { userPaused=true; v.pause(); } label(); });
  function want(v){ if(!userPaused&&seen&&!reduce&&!still) v.play().catch(function(){}); }
  if('IntersectionObserver' in window&&!still) new IntersectionObserver(function(es){ seen=es[0].isIntersecting; if(seen) want(cur()); else cur().pause(); },{threshold:0}).observe(stage);

  function handOver(p){
    if(p>=.6&&!armed){ armed=true; lane.preload='auto'; lane.load(); lane.pause(); }
    var now=p>=.9; if(now===past) return; past=now; scene.classList.toggle('past',past);
    if(past){ reel.pause(); reel.style.visibility='hidden'; lane.style.visibility='visible'; try{ lane.currentTime=0; }catch(e){} want(lane); }
    else { lane.pause(); lane.style.visibility='hidden'; reel.style.visibility='visible'; want(reel); }
    J.past=past; label();
  }

  /* the camera: screen(X) = P + (C - P) e + s (X - P), done as the viewBox so the glyph edges re-render as vectors at every zoom */
  function apply(p){
    after.style.setProperty('--rev',String(seg(p,.82,.9))); scene.classList.toggle('rev',p>=.82); handOver(p);   /* P3: .rev moves Pause right as the caption rises, it sat on the caption at .82 to .9 */
    if(!parts) return;
    var W=lay.W,H=lay.H, e=ease(seg(p,0,.7)), s=1+e*(S-1), Tx=hole.x+(W/2-hole.x)*e-s*hole.x, Ty=hole.y+(H/2-hole.y)*e-s*hole.y, tilt=1-seg(p,0,.3);
    var vb=(-Tx/s).toFixed(3)+' '+(-Ty/s).toFixed(3)+' '+(W/s).toFixed(3)+' '+(H/s).toFixed(3);
    parts.all.forEach(function(g){ g.setAttribute('viewBox',vb); });
    spill.style.transform='matrix('+s.toFixed(4)+',0,0,'+s.toFixed(4)+','+Tx.toFixed(2)+','+Ty.toFixed(2)+')';
    var fade=1-seg(p,.6,.72);
    parts.cut.style.transform='rotateX('+(-sy*2.2*tilt).toFixed(3)+'deg) rotateY('+(sx*2.6*tilt).toFixed(3)+'deg)';
    parts.cut.style.opacity=String(fade); parts.cut.style.visibility=fade>0?'visible':'hidden';
    parts.band.style.opacity=String(1-seg(p,.3,.38));   /* P3: was .35 to .5; a half-faded band read as grey veils over the film at .42, so it now clears in one short step as the camera passes through the wall */
    parts.band.style.transform='translate3d('+((3+sx*T*.6)*s).toFixed(2)+'px,'+((4+sy*T*.5)*s).toFixed(2)+'px,0)';
    J.s=s; J.e=e;
  }
  function setP(v){ J.p=v; apply(v); }

  /* the light spill: each new film frame drawn at a sixteenth (the upscale is the blur), kept only on the ridges round the letters */
  function drawSpill(){
    if(!spill||J.p>=.72||!seen||reel.readyState<2) return;
    var t=reel.currentTime; if(t===lastT) return; lastT=t;
    var vw=reel.videoWidth, vh=reel.videoHeight; if(!vw) return;
    var k=Math.max(lay.W/vw,lay.H/vh), sw=lay.W/k, sh=lay.H/k;
    tctx.drawImage(reel,(vw-sw)/2,(vh-sh)/2,sw,sh,0,0,tiny.width,tiny.height);
    sctx.globalCompositeOperation='copy'; sctx.drawImage(tiny,0,0,spill.width,spill.height);
    sctx.globalCompositeOperation='destination-in'; sctx.drawImage(mask,0,0); sctx.globalCompositeOperation='source-over';
  }

  function build(wall){
    var r=stage.getBoundingClientRect(), W=Math.round(r.width), H=Math.round(r.height);
    lay=Cut.layout(W,H,meas); T=Math.max(2.5,Math.min(8,lay.cap*.06)); J.T=+T.toFixed(2); hole=Cut.hole(lay);   /* P3: the band's thickness follows the letter size (was a fixed 12, which filled the thin stencil stems and left film in slivers) */ S=Math.max(39,1.2*Math.hypot(W,H)/2/Math.max(1,hole.r));
    var wc;
    if(wall) wc=Cut.wallCanvas(wall,Math.round(W*dpr),Math.round(H*dpr),Cut.cssNum('--plate-etch'));
    else { wc=document.createElement('canvas'); wc.width=Math.round(W*dpr); wc.height=Math.round(H*dpr); var g=wc.getContext('2d'); g.fillStyle='#12100C'; g.fillRect(0,0,wc.width,wc.height); }
    return new Promise(function(res){ wc.toBlob(function(b){ res(b); },'image/jpeg',.92); }).then(function(b){
      if(url) URL.revokeObjectURL(url); url=URL.createObjectURL(b);
      var pl=Cut.svgPlate(lay,url,T);
      var box=document.createElement('div'); box.className='cutbox'; var cut=document.createElement('div'); cut.className='cut'; box.appendChild(cut);
      spill=document.createElement('canvas'); spill.className='spill'; spill.width=Math.max(8,Math.round(W*Q)); spill.height=Math.max(8,Math.round(H*Q)); sctx=spill.getContext('2d'); sctx.imageSmoothingEnabled=true; sctx.imageSmoothingQuality='high';
      spill.style.setProperty('--spill',String(SPILL));
      tiny=document.createElement('canvas'); tiny.width=Math.max(4,Math.round(W/16)); tiny.height=Math.max(4,Math.round(H/16)); tctx=tiny.getContext('2d'); tctx.imageSmoothingEnabled=true;
      mask=Cut.spillMask(lay,wc,Q,REACH); lastT=-1;
      cut.appendChild(pl.band); cut.appendChild(pl.face); cut.appendChild(spill); cut.appendChild(pl.top);
      host.innerHTML=''; host.appendChild(box);
      parts={cut:cut,band:pl.band,face:pl.face,top:pl.top,all:pl.all};
      scene.classList.add('built'); J.hole=hole; J.S=S; J.lay={W:W,H:H,L6:lay.L6,o:lay.o}; J.check=spacingCheck();
      apply(J.p); drawSpill();
    });
  }
  /* SVG text against the canvas layout: the advance of every cut word, in px (the brief: one pixel at most inside a word) */
  function spacingCheck(){ var out=[], i=0, els=parts.top.querySelectorAll('g text');
    lay.rows.forEach(function(r){ r.toks.forEach(function(t){ if(t.k!=='r') return; var e=els[i++]; if(!e) return; out.push([t.t,+(e.getComputedTextLength()-t.w).toFixed(2)]); }); });
    return out; }

  window.addEventListener('pointermove',function(e){ ptr.x=e.clientX/innerWidth*2-1; ptr.y=e.clientY/innerHeight*2-1; ptr.has=true; },{passive:true});
  function tick(){ if(ptr.has&&J.p<.35){ var nx=sx+(ptr.x-sx)*.06, ny=sy+(ptr.y-sy)*.06; if(Math.abs(nx-sx)+Math.abs(ny-sy)>1e-4){ sx=nx; sy=ny; apply(J.p); } } drawSpill(); requestAnimationFrame(tick); }

  function start(){
    if(reduce||still||!window.gsap||!window.ScrollTrigger){ root.classList.add('plate-still'); J.mode='still'; setP(0); label(); return; }
    root.classList.add('journey-on'); gsap.registerPlugin(ScrollTrigger);
    if(window.Lenis&&!render){ var lenis=new Lenis({lerp:.09,wheelMultiplier:.9}); lenis.on('scroll',ScrollTrigger.update); gsap.ticker.add(function(t){ lenis.raf(t*1000); }); gsap.ticker.lagSmoothing(0); J.lenis=true; }
    ScrollTrigger.create({trigger:scene,start:'top top',end:'bottom bottom',scrub:true,onUpdate:function(st){ setP(st.progress); }});
    ScrollTrigger.refresh(); J.mode='journey'; label(); requestAnimationFrame(tick);
  }

  Cut.fontsReady().then(Cut.loadWall).then(function(wall){
    return build(wall).then(function(){
      new ResizeObserver(function(){ var r=stage.getBoundingClientRect(); if(lay&&(Math.round(r.width)!==lay.W||Math.round(r.height)!==lay.H)) build(wall); }).observe(stage);
      if(window.gsap||document.readyState==='complete') start(); else addEventListener('load',start,{once:true});
    });
  }).catch(function(e){ J.error=String(e); root.classList.add('plate-still'); });
})();
