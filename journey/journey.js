/* journey/journey.js: the shared journey: Lenis-weighted scroll, the scroll progress p over the three-screen scene, the hand-over
   into the first chapter, the pointer, and the CSS plate (face + thickness band) that V2 and V3 use and V1 falls back to. 31 Oct 2026, Nadir. */
(function(){
  "use strict";
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches, still=!!window.__still, render=/render=1/.test(location.search);
  var scene=document.querySelector('[data-journey]'), stage=scene.querySelector('.stage'), host=scene.querySelector('.plate'), reel=scene.querySelector('.reel'), after=scene.querySelector('.after');
  var J=window.Journey={scene:scene,stage:stage,host:host,reel:reel,after:after,reduce:reduce,still:still,p:0,pointer:{x:0,y:0,has:false},T:12,on:[]};
  function seg(p,a,b){ return Math.max(0,Math.min(1,(p-a)/(b-a))); }
  function ease(t){ t=Math.max(0,Math.min(1,t)); return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; }
  J.seg=seg; J.ease=ease;
  J.setP=function(v){ J.p=v; window.__journey.p=v;
    // the hand-over: the reel gives way to the lane film of the first chapter from .8, the word and caption come up with it
    reel.style.setProperty('opacity',String(1-seg(v,.8,.96))); after.style.setProperty('--rev',String(seg(v,.82,1)));
    J.on.forEach(function(f){ f(v); }); };
  window.__journey={p:0};
  window.addEventListener('pointermove',function(e){ J.pointer.x=e.clientX/innerWidth*2-1; J.pointer.y=e.clientY/innerHeight*2-1; J.pointer.has=true; },{passive:true});

  /* the CSS plate: the face as one picture over the thickness band; the pointer slides the band against the face, so every cut reads as a wall with depth */
  J.cssPlate=function(lay,wall,dpr){
    var box=document.createElement('div'); box.className='cutbox'; var cut=document.createElement('div'); cut.className='cut'; box.appendChild(cut);
    var band=Cut.wallBand(lay,dpr,J.T); band.className='band'; var face=Cut.plateCanvas(lay,dpr,Cut.wallCanvas(wall,Math.round(lay.W*dpr),Math.round(lay.H*dpr),Cut.cssNum('--plate-etch')));
    cut.appendChild(band); cut.appendChild(face); host.innerHTML=''; host.appendChild(box);
    cut.style.setProperty('--ox',(lay.o.x/lay.W*100).toFixed(3)+'%'); cut.style.setProperty('--oy',(lay.o.y/lay.H*100).toFixed(3)+'%');
    return {box:box,cut:cut,band:band,face:face};
  };
  J.start=function(){
    if(reduce||still){ document.documentElement.classList.add('plate-still'); J.setP(0); return; }
    if(!window.gsap||!window.ScrollTrigger){ document.documentElement.classList.add('plate-still'); return; }
    gsap.registerPlugin(ScrollTrigger);
    if(window.Lenis&&!render){ var lenis=new Lenis({lerp:.09,wheelMultiplier:.9}); lenis.on('scroll',ScrollTrigger.update); gsap.ticker.add(function(t){ lenis.raf(t*1000); }); gsap.ticker.lagSmoothing(0); J.lenis=lenis; }
    ScrollTrigger.create({trigger:scene,start:'top top',end:'bottom bottom',scrub:true,onUpdate:function(st){ J.setP(st.progress); }});
  };
})();
