/* journey/v2.js: V2 THE WINDOW, LIGHT. No WebGL camera. The reel plays full frame; the plate is one picture with the letters punched out,
   over a thickness band the pointer slides against the face (depth by lip and wall); scroll scales the plate about the O of WORK
   until the film fills the frame, then the first chapter comes up. The phone route and every fallback. 31 Oct 2026, Nadir. */
(function(){
  "use strict";
  var J=window.Journey, lay=null, parts=null, dpr=Math.min(devicePixelRatio||1,2), meas=document.createElement('canvas').getContext('2d');
  var sx=0, sy=0; // the pointer, sprung
  function build(wall){ var r=J.stage.getBoundingClientRect(); lay=Cut.layout(Math.round(r.width),Math.round(r.height),meas); window.__journey.lay=lay; parts=J.cssPlate(lay,wall,dpr); apply(J.p); }
  function apply(p){ if(!parts) return; var s=1+Cut.cssNum('--j-scale-max')||1; var e=J.ease(J.seg(p,0,.7)), scale=1+e*e*38, tilt=1-J.seg(p,0,.3);
    parts.cut.style.transform='rotateX('+(-sy*2.2*tilt).toFixed(3)+'deg) rotateY('+(sx*2.6*tilt).toFixed(3)+'deg) scale('+scale.toFixed(4)+')';
    parts.cut.style.opacity=String(1-J.seg(p,.6,.72));
    parts.band.style.setProperty('--bx',(3+sx*J.T*.6).toFixed(2)+'px'); parts.band.style.setProperty('--by',(4+sy*J.T*.5).toFixed(2)+'px'); }
  J.on.push(apply);
  function tick(){ if(!J.reduce&&!J.still&&J.pointer.has){ sx+=(J.pointer.x-sx)*.06; sy+=(J.pointer.y-sy)*.06; apply(J.p); } requestAnimationFrame(tick); }
  Cut.fontsReady().then(Cut.loadWall).then(function(wall){ build(wall); new ResizeObserver(function(){ var r=J.stage.getBoundingClientRect(); if(lay&&(Math.round(r.width)!==lay.W||Math.round(r.height)!==lay.H)) build(wall); }).observe(J.stage); J.start(); if(!J.reduce&&!J.still) tick(); window.__journey.mode='css'; });
})();
