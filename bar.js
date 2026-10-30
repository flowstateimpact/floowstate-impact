/* bar.js: the one hand on the top bar and the in-page navigator, every linked page (R15 nav, 31 Oct 2026; R16 fixes the same day).
   The bar leaves while you read down and returns when you look up (home A's barState, moved here from glow.js; the same reading of
   scroll direction Aceternity's floating-navbar takes from scrollYProgress); on the phone the navigator strip rides the same state.
   The hairline under the bar's words walks to the word under the pointer and comes home to the page's own word (Motion Primitives
   animated-background, without the library). The rail waits while a banner's picture or film is still in the top half of the screen,
   so it stands on the wall at all times. Nothing moves under reduced motion or in a still render; the wait state is read in both. */
(function(){
  var still=!!window.__still;
  var bar=document.querySelector('.top'), rail=document.querySelector('.knav'), ly=0;
  function state(on,off){ [bar,rail].forEach(function(el){ if(!el) return; on.forEach(function(c){ el.classList.add(c); }); off.forEach(function(c){ el.classList.remove(c); }); }); }
  function barState(){ var y=window.scrollY||0; if(y<120){ state([],['away','back']); } else if(y>ly+4){ state(['away'],['back']); } else if(y<ly-4){ state(['back'],['away']); } ly=y; }
  if(bar&&!still){ addEventListener('scroll',barState,{passive:true}); barState(); }

  /* the rail is on the wall at all times: while the banner's picture or film is in the top half of the screen it waits */
  var bed=rail&&document.querySelector('.pagehead .hero.pic .bed, .film-hero .bed');
  if(bed){
    var w=false, wall=function(){ w=false; rail.classList.toggle('wait',bed.getBoundingClientRect().bottom>innerHeight*.5); };
    addEventListener('scroll',function(){ if(!w){ w=true; requestAnimationFrame(wall); } },{passive:true}); addEventListener('resize',wall); wall();
  }

  /* the walking line under the bar's words */
  var box=document.querySelector('.top .links');
  if(box){
    var ind=document.createElement('i'); ind.className='ind'; ind.setAttribute('aria-hidden','true'); box.appendChild(ind);
    var home=box.querySelector('[aria-current]');
    function to(a){ if(!a){ ind.style.opacity=0; return; } var r=a.getBoundingClientRect(), b=box.getBoundingClientRect(); ind.style.left=(r.left-b.left)+'px'; ind.style.width=r.width+'px'; ind.style.opacity=1; }
    function rest(){ to(home); }
    box.querySelectorAll('a').forEach(function(a){
      a.addEventListener('mouseenter',function(){ to(a); });
      a.addEventListener('focus',function(){ to(a); });
    });
    box.addEventListener('mouseleave',rest);
    box.addEventListener('focusout',rest);
    ind.style.transition='none'; rest(); requestAnimationFrame(function(){ ind.style.transition=''; });
    addEventListener('resize',rest);
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(rest);
  }
})();
