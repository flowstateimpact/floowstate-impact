/* glow.js: the one motion language for home A and the inner pages (round six, 25 Oct 2026: home A's inline copy folded in).
   The same hand as home A: the bar leaves while you read down and returns when you look up;
   a film plays only while it is on screen and only by its one orange control;
   pictures rise from their own bottom edge once; a block's words settle 18px once;
   the thing in front moves faster than the thing behind. Nothing moves under reduced motion. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches, still=!!window.__still;

  // the top bar: see-through on the first screen, gone while you read down, back on the page's own black when you look up
  var bar=document.querySelector('.top'), ly=0;
  function barState(){ var y=window.scrollY||0; if(y<120){ bar.classList.remove('away','back'); } else if(y>ly+4){ bar.classList.add('away'); bar.classList.remove('back'); } else if(y<ly-4){ bar.classList.remove('away'); bar.classList.add('back'); } ly=y; }
  if(bar&&!still){ addEventListener('scroll',barState,{passive:true}); barState(); }

  // the films: one orange control each. A film plays only while it is on screen; a film without autoplay waits to be pressed,
  // except a film marked data-view, which plays once by itself the first time it is seen (the eye on home A)
  var vids=[];
  document.querySelectorAll('.play').forEach(function(b){
    var v=document.getElementById(b.dataset.for); if(!v) return;
    if(reduce){ v.removeAttribute('autoplay'); v.pause(); }
    function state(on){ b.dataset.on=on?'1':'0'; b.setAttribute('aria-label',on?'Pause the film':'Play the film'); }
    b.addEventListener('click',function(){ if(v.paused){ v.wanted=true; v.play(); } else { v.wanted=false; v.pause(); } });
    v.addEventListener('pause',function(){state(false)}); v.addEventListener('play',function(){state(true)});
    state(!v.paused&&!reduce);
    v.wanted=!reduce&&v.hasAttribute('autoplay'); vids.push(v);
  });
  if('IntersectionObserver' in window && !still){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){
      var v=e.target;
      if(e.isIntersecting){ if(v.wanted||(!reduce&&v.hasAttribute('data-view')&&!v.seen)){ v.seen=true; v.wanted=true; v.play().catch(function(){}); } }
      else if(!v.paused){ v.pause(); v.wanted=true; }
    }); },{threshold:.25});
    vids.forEach(function(v){ io.observe(v); });
  }

  // the button lines: every letter moves on its own, each button in its own temperament, never two buttons at once (the site's own six lines)
  var ASK=['Ask for the audit','Have your business read','Where would we start',"See what we'd keep",'Bring it as it is','Go on, ask'], NAME='Ask for the audit', rots=[];
  function letters(l,t){
    var ls=t.replace(/ /g,'').length,n=0;
    t.split('').forEach(function(ch){
      if(ch===' '){ l.appendChild(document.createTextNode(' ')); return; }
      var i=document.createElement('i'); i.textContent=ch;
      i.style.cssText='--i:'+n+';--j:'+(ls-1-n)+';--c:'+Math.abs(n-(ls-1)/2); l.appendChild(i); n++;
    });
  }
  document.querySelectorAll('.btn[data-swap]').forEach(function(b){
    if(b.textContent.trim()!==NAME) return;
    b.setAttribute('aria-label',NAME);
    if(reduce||still) return;
    var r=document.createElement('span'); r.className='rot'; r.setAttribute('aria-hidden','true');
    ASK.forEach(function(t,i){ var l=document.createElement('span'); l.className='rl'+(i?'':' on'); letters(l,t); r.appendChild(l); });
    b.textContent=''; b.appendChild(r); r.at=0; r.btn=b; rots.push(r);
  });
  function show(r,i){ [].forEach.call(r.children,function(l,k){ l.classList.toggle('was',k===r.at); l.classList.toggle('on',k===i); }); r.at=i; }
  if(rots.length){
    var turn=0;
    function tick(){
      var r=rots[turn%rots.length]; turn++;
      var busy=document.hidden||r.btn.matches(':hover,:focus-visible');
      if(!busy) show(r,(r.at+1)%ASK.length);
      setTimeout(tick,2600+Math.random()*1800);
    }
    setTimeout(tick,2200+Math.random()*1600);
  }

  if(reduce||still) return;
  window.addEventListener('load',function(){
    if(!window.gsap||!window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    // 1. the page's line moves up a tenth slower than the page, so it stays a beat longer than the screen it was on
    //    (home A: the tagline, so DARE arrives on the street; a film hero: the line and its slot move as one, so the slot never meets the heading)
    var hero=document.querySelector('.hero, .page-hero, .film-hero');
    if(hero){ gsap.to(hero.querySelector('.line, h1'),{yPercent:10,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}}); }
    // 2. a film screen holds while the page lifts off it: you walk out of the lane, the lane does not follow
    if(document.querySelector('.film-hero .bed')){ gsap.to('.film-hero .bed',{yPercent:14,ease:'none',scrollTrigger:{trigger:'.film-hero',start:'top top',end:'bottom top',scrub:true}}); }
    // 2b. the lane on home A: you walk into the picture, it does not come to you. The film settles from 1.06 to 1 as the screen arrives
    if(document.querySelector('.heritage .bed')){ gsap.fromTo('.heritage .bed',{scale:1.06},{scale:1,ease:'none',scrollTrigger:{trigger:'.heritage',start:'top bottom',end:'top top',scrub:true}}); }
    // 2c. the section words drift against the scroll as their screens pass
    gsap.utils.toArray('.screen .word').forEach(function(w){ gsap.fromTo(w,{x:'3vw'},{x:'-3vw',ease:'none',scrollTrigger:{trigger:w.parentNode,start:'top bottom',end:'bottom top',scrub:true}}); });
    // 2d. the stencil service words arrive the way paint arrives: through the cut, once, as you reach them
    var words=gsap.utils.toArray('.svc .row .st');
    if(words.length){ gsap.set(words,{clipPath:'inset(-12% 100% -12% 0%)'});
      ScrollTrigger.batch(words,{start:'top 88%',once:true,onEnter:function(els){ gsap.to(els,{clipPath:'inset(-12% 0% -12% 0%)',duration:.46,ease:'power2.in',stagger:.07,clearProps:'clipPath'}); }}); }
    // 3. pictures rise from their own bottom edge as they come into reading distance, once
    var pics=gsap.utils.toArray('.strip .s1w, .strip .s2, .strip .s3, .block .pic, .wrow .big, .wrow .small, .duo .pic, .pair .pic');
    if(pics.length){ gsap.set(pics,{clipPath:'inset(100% 0% 0% 0%)'});
      ScrollTrigger.batch(pics,{start:'top 85%',once:true,onEnter:function(els){ gsap.to(els,{clipPath:'inset(0% 0% 0% 0%)',duration:.8,ease:'power3.out',stagger:.12,clearProps:'clipPath'}); }}); }
    // 4. a block's heading, paragraph and link settle into place together, once
    gsap.utils.toArray('.block, .team, .close, .wrow, .duo .txt, .pair .blk').forEach(function(s){
      var parts=gsap.utils.toArray(s.querySelectorAll('.h, .st, p, .btn-row, .go, .names'));
      if(!parts.length) return;
      gsap.set(parts,{y:18,autoAlpha:0});
      ScrollTrigger.create({trigger:s,start:'top 80%',once:true,onEnter:function(){ gsap.to(parts,{y:0,autoAlpha:1,duration:.6,ease:'power3.out',stagger:.08,clearProps:'transform,opacity,visibility'}); }});
    });
    // 4b. captions on a film or picture screen lift a little as their picture arrives
    gsap.utils.toArray('.screen .cap').forEach(function(c){
      gsap.set(c,{y:10,autoAlpha:0});
      ScrollTrigger.create({trigger:c.parentNode,start:'top 60%',once:true,onEnter:function(){ gsap.to(c,{y:0,autoAlpha:1,duration:.6,ease:'power3.out',clearProps:'transform,opacity,visibility'}); }});
    });
    // 5. depth on scrub (a fitted picture, shown whole, does not drift: only the thing in front of it moves): a picture drifts a little inside its frame; the small picture in front moves faster than the street behind it
    gsap.utils.toArray('.block .pic img, .duo .pic img, .wrow .big:not(.fit) img, .pair .pic img').forEach(function(i){ gsap.fromTo(i,{yPercent:-4},{yPercent:4,ease:'none',scrollTrigger:{trigger:i.parentNode,start:'top bottom',end:'bottom top',scrub:true}}); });
    gsap.utils.toArray('.wrow .small').forEach(function(f){ gsap.fromTo(f,{y:'3vw'},{y:'-3vw',ease:'none',scrollTrigger:{trigger:f.parentNode,start:'top bottom',end:'bottom top',scrub:true}}); });
  });
})();
