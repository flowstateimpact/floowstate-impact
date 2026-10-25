/* type-b.js: variant B. The three plates of WILL NOT DARE answer the hand (2 degrees) and the scroll (three speeds); the spine slab turns to face the reader. 25 Oct 2026, Nadir. */
(function(){
  "use strict";
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches, still=!!window.__still, desk=matchMedia('(min-width:761px)').matches;
  if(reduce||still) return;
  window.addEventListener('load',function(){
    if(!window.gsap||!window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    var hero=document.querySelector('[data-ledger]');
    if(hero){
      var l3=hero.querySelector('.l3'), p1=hero.querySelector('.p1'), p2=hero.querySelector('.p2'), p3=hero.querySelector('.p3');
      // the hand: the line turns up to 2 degrees toward the pointer, late and soft, the way a held plate follows a hand. Sizes are cached, never read on move
      if(desk&&matchMedia('(pointer:fine)').matches){
        var vw=innerWidth, vh=innerHeight; addEventListener('resize',function(){ vw=innerWidth; vh=innerHeight; },{passive:true});
        var rx=gsap.quickTo(l3,'rotateX',{duration:.9,ease:'power3.out'}), ry=gsap.quickTo(l3,'rotateY',{duration:.9,ease:'power3.out'});
        addEventListener('pointermove',function(e){ ry((e.clientX/vw-.5)*4); rx(-(e.clientY/vh-.5)*4); },{passive:true});
        addEventListener('pointerleave',function(){ ry(0); rx(0); });
      }
      // the scroll: the far plate holds back, the near one leaves first. DARE still lands on the street
      var st={trigger:hero,start:'top top',end:'bottom top',scrub:true};
      gsap.to(p1,{yPercent:-4,ease:'none',scrollTrigger:st});
      gsap.to(p2,{yPercent:4,ease:'none',scrollTrigger:st});
      gsap.to(p3,{yPercent:11,ease:'none',scrollTrigger:st});
      gsap.to(hero.querySelectorAll('.l1,.l2,.who'),{yPercent:-10,autoAlpha:.35,ease:'none',scrollTrigger:st});
    }

    var spine=document.querySelector('[data-spine]');
    if(spine&&desk){
      var slab=spine.querySelector('.slab'), cover=spine.querySelector('.cover'), side=spine.querySelector('.side');
      var shade={a:.55,b:0}, h1=cover.querySelector('h1'), vs=side.querySelectorAll('.v'), ang={v:78};
      var tl=gsap.timeline({scrollTrigger:{trigger:spine,start:'top top',end:'+=100%',pin:true,scrub:.5,refreshPriority:1,anticipatePin:1}});
      tl.to(slab,{rotateY:0,ease:'power2.inOut',duration:1},0)
        .to(shade,{a:0,b:.55,ease:'power2.inOut',duration:1,onUpdate:function(){ cover.style.setProperty('--shade',shade.a); side.style.setProperty('--shade2',shade.b); }},0)
        // one title on screen at a time, driven by the slab's real angle: the face title is 0 until 45 degrees, then comes up on a squared curve (.11 at 30 degrees, .31 at 20, .6 at 10, 1 flat), so it stays under reading until about 20 degrees of turn; the spine title fades by the same curve (Anwar round 2, fix 3 note)
        .to(ang,{v:0,ease:'power2.inOut',duration:1,onUpdate:function(){ var k=Math.max(0,Math.min(1,(45-ang.v)/45)); k=k*k; h1.style.opacity=k; vs.forEach(function(v){ v.style.opacity=1-k; }); }},0);
      ScrollTrigger.refresh();
    }
  });
})();
