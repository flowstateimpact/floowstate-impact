/* journey/v3.js: V3 HOLD TO DARE. The plate stands as in V2 but sliced into louvres. Press and hold DARE: an orange line fills under the word
   (the pressure), then the louvres part from DARE outward and the reel plays full frame WITH sound while held; release and they close and the
   sound goes. The hold is the browser's own unmute gesture, so no mute button exists. Scroll opens the louvres too, into the first chapter.
   The one orange state while sound plays: a small mark top right. 31 Oct 2026, Nadir. */
(function(){
  "use strict";
  var J=window.Journey, meas=document.createElement('canvas').getContext('2d'), dpr=Math.min(devicePixelRatio||1,2), lay=null, strips=[], N=0, holdV=0, hold=null, armT=0, armed=false, sx=0, sy=0, built=false;
  var btn=J.scene.querySelector('.hold'), arc=btn.querySelector('.arc'), hint=J.scene.querySelector('.hint'), snd=J.scene.querySelector('.snd');
  function url(c){ return new Promise(function(res){ c.toBlob(function(b){ res(URL.createObjectURL(b)); },'image/png'); }); }
  function build(wall){
    var r=J.stage.getBoundingClientRect(); lay=Cut.layout(Math.round(r.width),Math.round(r.height),meas); window.__journey.lay=lay;
    var face=Cut.plateCanvas(lay,dpr,Cut.wallCanvas(wall,Math.round(lay.W*dpr),Math.round(lay.H*dpr),Cut.cssNum('--plate-etch'))), band=Cut.wallBand(lay,dpr,J.T);
    return Promise.all([url(face),url(band)]).then(function(u){
      J.host.innerHTML=''; var box=document.createElement('div'); box.className='cutbox'; var lv=document.createElement('div'); lv.className='louvres'; box.appendChild(lv); J.host.appendChild(box);
      N=lay.phone?14:18; var h=lay.H/N; strips=[];
      for(var i=0;i<N;i++){ var s=document.createElement('div'); s.className='louvre'; s.style.top=(i*h)+'px'; s.style.height=(h+.5)+'px'; s.style.overflow='hidden'; s.style.setProperty('--H',lay.H+'px');
        var b=document.createElement('div'); b.className='lay band'; b.style.top=(-i*h)+'px'; b.style.backgroundImage='url('+u[1]+')';
        var f=document.createElement('div'); f.className='lay'; f.style.top=(-i*h)+'px'; f.style.backgroundImage='url('+u[0]+')';
        s.appendChild(b); s.appendChild(f); lv.appendChild(s); strips.push(s); }
      // the hold target sits on DARE
      var d=lay.dare; btn.style.left=d.x+'px'; btn.style.top=(d.y-d.cap)+'px'; btn.style.width=d.w+'px'; btn.style.height=(d.cap*1.1)+'px';
      hint.style.left=(d.x+d.w-hint.offsetWidth)+'px'; hint.style.top=(d.y+16)+'px'; hint.style.right='auto'; hint.style.textAlign='right';
      built=true; apply(J.p); });
  }
  var dareStrip=function(){ return Math.min(N-1,Math.floor((lay.dare.y-lay.dare.cap*.5)/(lay.H/N))); };
  function apply(p){ if(!built) return; var scroll=J.ease(J.seg(p,0,.62)), open=Math.max(holdV,scroll), ds=dareStrip(), maxd=Math.max(ds,N-1-ds);
    for(var i=0;i<N;i++){ var dist=Math.abs(i-ds)/Math.max(1,maxd), a=Math.max(0,Math.min(1,(open-dist*.42)/(1-.42))); a=a*a*(3-2*a);
      strips[i].style.transform='perspective(1400px) rotateX('+(-a*84).toFixed(2)+'deg) translateZ('+(a*6).toFixed(1)+'px)'; strips[i].style.opacity=String(1-J.seg(p,.66,.76)); }
    var bx=3+sx*J.T*.6, by=4+sy*J.T*.5; J.host.style.setProperty('--bx',bx.toFixed(2)+'px'); J.host.style.setProperty('--by',by.toFixed(2)+'px');
    btn.style.opacity=String(1-J.seg(p,.3,.5)); hint.style.opacity=hint.classList.contains('gone')?'0':String(1-J.seg(p,.2,.4)); }
  J.on.push(apply);
  function tick(){ if(J.pointer.has){ sx+=(J.pointer.x-sx)*.06; sy+=(J.pointer.y-sy)*.06; }
    if(hold!==null){ var e=(performance.now()-hold)/450; if(!armed&&e>=1){ armed=true; open(); } arc.style.transform='scaleX('+Math.min(1,e).toFixed(3)+')'; }
    apply(J.p); requestAnimationFrame(tick); }
  function open(){ hint.classList.add('gone'); gsap.to(window.__journey.h3,{v:1,duration:.9,ease:'power3.inOut',onUpdate:function(){ holdV=window.__journey.h3.v; }}); J.reel.muted=false; J.reel.volume=0; gsap.to(J.reel,{volume:1,duration:.7}); snd.classList.add('on'); }
  function close(){ gsap.killTweensOf(window.__journey.h3); gsap.to(window.__journey.h3,{v:0,duration:.8,ease:'power3.inOut',onUpdate:function(){ holdV=window.__journey.h3.v; }}); gsap.to(J.reel,{volume:0,duration:.35,onComplete:function(){ J.reel.muted=true; }}); snd.classList.remove('on'); }
  window.__journey.h3={v:0};
  btn.addEventListener('pointerdown',function(e){ e.preventDefault(); btn.setPointerCapture(e.pointerId); hold=performance.now(); armed=false; });
  function up(){ if(hold===null) return; hold=null; arc.style.transform='scaleX(0)'; if(armed) close(); armed=false; }
  btn.addEventListener('pointerup',up); btn.addEventListener('pointercancel',up); btn.addEventListener('lostpointercapture',up);
  window.__journey.hold=function(on){ if(on){ hold=performance.now()-460; } else up(); };
  Cut.fontsReady().then(Cut.loadWall).then(function(wall){ return build(wall).then(function(){ new ResizeObserver(function(){ var r=J.stage.getBoundingClientRect(); if(lay&&(Math.round(r.width)!==lay.W||Math.round(r.height)!==lay.H)) build(wall); }).observe(J.stage); J.start(); if(!J.reduce&&!J.still) tick(); window.__journey.mode='css-louvres'; }); });
})();
