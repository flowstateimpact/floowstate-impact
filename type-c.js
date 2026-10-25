/* type-c.js: variant C. The deep DARE comes forward into focus as the first screen leaves and holds on the film; the reader's line reads the title once. 25 Oct 2026, Nadir. */
(function(){
  "use strict";
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches, still=!!window.__still;
  var reader=document.querySelector('[data-reader]');
  if(reader&&!reduce&&!still){ (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){ requestAnimationFrame(function(){ reader.classList.add('go'); }); }); }
  if(reduce||still) return;
  window.addEventListener('load',function(){
    if(!window.gsap||!window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var hero=document.querySelector('[data-small]');
    if(hero){
      var deep=hero.querySelector('.deep'), word=deep.querySelector('.st'), film=document.querySelector('.heritage');
      // the pin wraps the room in a spacer, where inset:0 measures nothing; give it the first screen's size so DARE keeps its place under the sentence
      var size=function(){ deep.style.width=hero.clientWidth+'px'; deep.style.height=hero.clientHeight+'px'; };
      size(); ScrollTrigger.addEventListener('refreshInit',size);
      // the word holds its place in the window while the first screen leaves and the film arrives, then goes with the film
      ScrollTrigger.create({trigger:hero,start:'top top',endTrigger:film||hero,end:'bottom top',pin:deep,pinSpacing:false,refreshPriority:1});
      // over the first screen of scroll it comes 600px forward, sharpens and fills with colour; it is in focus the moment the street is under it
      gsap.to(word,{z:0,opacity:1,filter:'blur(0px)',ease:'power1.inOut',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}});
      gsap.to(hero.querySelectorAll('.line,.who'),{yPercent:-12,autoAlpha:0,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}});
      ScrollTrigger.refresh();
    }
  });
})();
