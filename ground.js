/* ground.js: the wall under every page, the other half of the pair with ground.css. 29 Oct 2026, Nadir. No library.
   Two jobs. One: on every page but the home it puts the fixed wall layer behind the content (three nested swings, animated by ground.css)
   and eases that layer upward by a few percent as the page scrolls, so the wall sits a step behind the words. Two: it publishes the same
   three swings as numbers, window.__wall.at(seconds) -> {x,y,s}, read from the custom properties in ground.css, so the home's plate
   (type-a.js, the texture uG) drifts by the figures the CSS layer drifts by: one motion, two renderers, one set of numbers.
   prefers-reduced-motion, or a full-page render (window.__still): the layer stands still and at() returns the rest pose. */
(function(){
  "use strict";
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches, still=!!window.__still, doc=document.documentElement;
  if(still) doc.classList.add('wall-still');

  /* the figures, read once from ground.css so the two renderers cannot disagree */
  function prop(n){ return getComputedStyle(doc).getPropertyValue(n).trim(); }
  function num(s){ return parseFloat(s)||0; }
  /* the home loads no ground.css, so every figure falls back on its own to the value written there (29 Oct, P9: an empty
     --wall-s read as 0 and gave a breath of -1, shrinking the plate's wall to under a tenth) */
  function fig(n,d){ var s=prop(n); return s?num(s):d; }
  var F={ // amplitudes as fractions of the viewport (the plate is the viewport on the home), periods in seconds for one swing each way
    ax:fig('--wall-x',1.4)/100, ay:fig('--wall-y',.9)/100, as:fig('--wall-s',1.012)-1,
    tx:fig('--wall-tx',52)||52, ty:fig('--wall-ty',73)||73, ts:fig('--wall-ts',61)||61 };

  /* cubic-bezier(.42,0,.58,1), the CSS ease-in-out, solved for y at a given x so the plate and the layer share one curve */
  function bez(x){ if(x<=0) return 0; if(x>=1) return 1; var t=x;
    for(var i=0;i<6;i++){ var t1=1-t, cx=3*t1*t1*t*.42+3*t1*t*t*.58+t*t*t, dx=3*t1*t1*.42+6*t1*t*(.58-.42)+3*t*t*(1-.58); if(Math.abs(dx)<1e-6) break; t-=(cx-x)/dx; t=Math.max(0,Math.min(1,t)); }
    var s=1-t; return 3*s*t*t*1+t*t*t; }   // y1=0, y2=1
  /* one swing: -1 at one end, +1 at the other, alternating, started half a leg in (ground.css animation-delay) so the first frame is 0 */
  function leg(t,T){ var u=(t/T+.5)%2; if(u>1) u=2-u; return 2*bez(u)-1; }
  function at(t){ if(reduce||still) return {x:0,y:0,s:1};
    return {x:F.ax*leg(t,F.tx), y:F.ay*leg(t,F.ty), s:1+F.as*(leg(t,F.ts)+1)*.5}; }
  function now(){ var tl=document.timeline&&document.timeline.currentTime; return (tl!=null?tl:performance.now())/1000; }   // the CSS animations run on the document timeline; the plate reads the same clock
  window.__wall={at:at,now:now,figures:F,still:reduce||still};

  /* the layer, on every page that carries it. The home's plate wears the wall itself (data-plate); since Anwar R13 the home carries the layer too,
     painted over by its main, so only the home's footer stands on it, as on every other page. */
  if(!doc.classList.contains('has-wall')) return;
  var wall=document.createElement('div'); wall.className='wall'; wall.setAttribute('aria-hidden','true');
  wall.innerHTML='<div class="wall-x"><div class="wall-y"><div class="wall-s"></div></div></div>';
  document.body.insertBefore(wall,document.body.firstChild);

  /* the scroll: the wall rises by the 8vh it has in hand over the whole page, so the words travel a step in front of it. Arithmetic only, one frame per scroll */
  if(reduce||still) return;
  var ticking=false;
  function place(){ ticking=false;
    var max=Math.max(1,doc.scrollHeight-window.innerHeight), p=Math.max(0,Math.min(1,(window.scrollY||0)/max));
    wall.style.transform='translate3d(0,'+(-p*8*window.innerHeight/100).toFixed(1)+'px,0)'; }
  window.addEventListener('scroll',function(){ if(!ticking){ ticking=true; requestAnimationFrame(place); } },{passive:true});
  window.addEventListener('resize',place); place();
})();
