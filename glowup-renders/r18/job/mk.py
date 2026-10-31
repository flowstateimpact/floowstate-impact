import json,sys
out='/Users/asiffarid/Documents/apps/flowstateimpact-site-glowup/glowup-renders/r18'
U='http://127.0.0.1:8791/index.html?render=1'
EV="JSON.stringify({docW:document.documentElement.scrollWidth,iw:innerWidth,j:(()=>{const j=window.__journey||{};return {p:j.p&&+j.p.toFixed(3),mode:j.mode,past:j.past,s:j.s&&+j.s.toFixed(2),T:j.T,S:j.S&&+j.S.toFixed(1),hole:j.hole,plate:(()=>{const w=document.querySelector('.hj-face image'),l=document.querySelector('.hj-top g[clip-path]'),sp=document.querySelector('.cut .spill');return [w&&w.style.opacity,l&&l.style.opacity,sp&&sp.style.opacity,document.documentElement.className]})(),check:j.check,err:j.error}})(),reel:(()=>{const v=document.getElementById('reel');return [v.currentSrc.split('/').pop(),v.paused,v.readyState,getComputedStyle(v).visibility]})(),lane:(()=>{const v=document.getElementById('lane');return [v.currentSrc.split('/').pop(),v.paused,v.readyState,getComputedStyle(v).visibility,v.preload]})(),btn:(()=>{const b=document.querySelector('.hj-pause');const r=b.getBoundingClientRect();return [b.textContent,Math.round(r.left),Math.round(r.top),getComputedStyle(b).display,getComputedStyle(b).fontSize,Math.round(r.height)]})()})"
shots={
 'load':dict(file='r18-1440-load.png',w=1440,h=900,wait=3500),
 'p20':dict(file='r18-1440-p20.png',w=1440,h=900,wait=3500,scroll=round(.20*1800)),
 'p30':dict(file='r18-1440-p30.png',w=1440,h=900,wait=3500,scroll=round(.30*1800)),
 'p42':dict(file='r18-1440-p42.png',w=1440,h=900,wait=3500,scroll=round(.42*1800)),
 'p88':dict(file='r18-1440-p88.png',w=1440,h=900,wait=3500,scroll=round(.88*1800),settle=2500),
 'p92':dict(file='r18-1440-p92.png',w=1440,h=900,wait=3500,scroll=round(.92*1800),settle=2500),
 'm-load':dict(file='r18-390-load.png',w=390,h=844,wait=3500,dpr=2),
 'm-mid':dict(file='r18-390-mid.png',w=390,h=844,wait=3500,dpr=2,scroll=round(.42*1688)),
 'm-p92':dict(file='r18-390-p92.png',w=390,h=844,wait=3500,dpr=2,scroll=round(.92*1688),settle=2500),
 'reduce':dict(file='r18-1440-reduce.png',w=1440,h=900,wait=3500,reduce=True),
}
sel=sys.argv[1].split(',')
job={'out':out,'logName':'log-'+sys.argv[2],'shots':[]}
for k in sel:
  s=dict(shots[k]); s['url']=U; s['eval']=EV; job['shots'].append(s)
print(json.dumps(job))
