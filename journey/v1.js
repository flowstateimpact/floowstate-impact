/* journey/v1.js: V1 THE PLATE IS A WINDOW. One Three.js plate: the combed wall as its face, the sweep standing proud (vertex relief from the
   wall's own luminance), the grooves lit as a normal relief, the hero words true holes with a real thickness (the far wall of every cut is found
   by parallax along the view ray, so it moves as you move), the reel a video texture on a plane behind, lighting the walls of the cuts.
   Scroll moves the CAMERA toward the O of WORK (we enter the work through the word) until the film fills the frame, then the first chapter.
   Orange: the film's warmth on the cut walls, DARE's paint. Without WebGL, under reduced motion or in a still: the CSS plate at rest. 31 Oct 2026, Nadir. */
import * as THREE from './vendor/three.module.min.js';
const J=window.Journey, meas=document.createElement('canvas').getContext('2d');
const Z0=1200, D=320, T=14;
let W=0,H=0,lay=null,renderer=null,camera=null,scene=null,plate=null,film=null,mat=null,videoTex=null,posterTex=null,filmMat=null,ax=0,ay=0,t0=performance.now();
function wrapStill(wall){ const r=J.stage.getBoundingClientRect(); lay=Cut.layout(Math.round(r.width),Math.round(r.height),meas); J.cssPlate(lay,wall,Math.min(devicePixelRatio||1,2)); window.__journey.mode='css'; window.__journey.lay=lay; }
const VS=`uniform sampler2D uWall;uniform float uRelief;varying vec2 vUv;varying vec3 vPos;
void main(){vUv=uv;vec3 p=position;float l=dot(texture2DLodEXT(uWall,uv,5.0).rgb,vec3(.33));p.z+=(l-.1)*uRelief;vPos=p;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
const FS=`precision highp float;uniform sampler2D uTex,uWall,uFilm;uniform vec2 uSize,uRes,uFilmFit;uniform vec3 uCamL,uL;uniform float uT,uSee,uLip,uEtch,uDare,uTime;varying vec2 vUv;varying vec3 vPos;
float lum(vec3 c){return dot(c,vec3(.2126,.7152,.0722));}
vec2 cutUV(vec2 p){return vec2(p.x/uSize.x+.5,.5-p.y/uSize.y);}
void main(){
 vec2 c=cutUV(vPos.xy);bool inside=c.x>0.&&c.x<1.&&c.y>0.&&c.y<1.;
 vec4 tx=inside?texture2D(uTex,c):vec4(0.);
 vec3 vd=normalize(uCamL-vPos);
 vec2 pb=vPos.xy-vd.xy/max(vd.z,.08)*uT;vec2 cb=cutUV(pb);bool inB=cb.x>0.&&cb.x<1.&&cb.y>0.&&cb.y<1.;
 float holeB=inB?texture2D(uTex,cb).r:0.;
 vec2 s=gl_FragCoord.xy/uRes;vec2 fuv=(s-.5)*uFilmFit+.5;vec3 fb=texture2D(uFilm,fuv,3.5).rgb;
 if(tx.r>.5){ if(holeB>.5) discard;
  // the wall of the cut: the plate's own dark thickness, lit by the film behind it, warm where the film is warm
  float fl=lum(fb);vec3 wall=vec3(.075,.072,.068)+fb*vec3(.9,.55,.3)*.55+fl*vec3(.25,.12,.04);
  wall=mix(wall,vec3(.97,.97,.96),smoothstep(.6,.9,tx.a)*uLip);
  gl_FragColor=vec4(wall,1.);return;}
 // the face: the combed wall, its grooves a relief lit from the upper left, the film faintly through it, the print and DARE on it
 vec3 wc=texture2D(uWall,vUv).rgb;vec2 e=1.5/vec2(2048.,1152.);
 float gx=lum(texture2D(uWall,vUv+vec2(e.x,0.)).rgb)-lum(texture2D(uWall,vUv-vec2(e.x,0.)).rgb),gy=lum(texture2D(uWall,vUv+vec2(0.,e.y)).rgb)-lum(texture2D(uWall,vUv-vec2(0.,e.y)).rgb);
 vec3 n=normalize(vec3(-gx*uEtch*40.,gy*uEtch*40.,1.));float dif=max(dot(n,uL),0.);
 vec3 face=wc*(.72+.5*dif)+vec3(.05,.045,.035)*pow(max(dot(n,normalize(uL+vd)),0.),40.);
 face=mix(face,fb*.6,uSee);
 face+=fb*vec3(.08,.05,.03);   // the film is the light in the room: a breath of it on the plate
 float hard=smoothstep(.3,.7,tx.b);face=mix(face,vec3(.95,.95,.94),hard*tx.b);
 vec3 paint=vec3(.886,.498,.133)*(.7+.3*dif);face=mix(face,paint,smoothstep(.3,.7,tx.g)*uDare);
 gl_FragColor=vec4(face,1.);}`;
function cover(tw,th){ const sa=W/H, va=tw/th; return va>sa?[sa/va,1]:[1,va/sa]; }
function build(wall){
  const r=J.stage.getBoundingClientRect(); W=Math.round(r.width); H=Math.round(r.height); lay=Cut.layout(W,H,meas); window.__journey.lay=lay;
  const dpr=Math.min(devicePixelRatio||1,2);
  if(!renderer){ renderer=new THREE.WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance'}); renderer.outputColorSpace=THREE.SRGBColorSpace; J.host.innerHTML=''; J.host.appendChild(renderer.domElement); scene=new THREE.Scene(); scene.background=new THREE.Color(0x0b0b0b);
    camera=new THREE.PerspectiveCamera(40,1,2,6000); }
  renderer.setPixelRatio(dpr); renderer.setSize(W,H,false); camera.aspect=W/H; camera.fov=2*Math.atan((H/2)/Z0)*180/Math.PI; camera.updateProjectionMatrix();
  const tx=Cut.tex(lay,dpr), cutTex=new THREE.DataTexture(new Uint8Array(tx.data.buffer),tx.w,tx.h,THREE.RGBAFormat); cutTex.flipY=true; cutTex.needsUpdate=true; cutTex.minFilter=cutTex.magFilter=THREE.LinearFilter;
  const wc=Cut.wallCanvas(wall,2048,1152,0), wallTex=new THREE.CanvasTexture(wc); wallTex.colorSpace=THREE.SRGBColorSpace; wallTex.generateMipmaps=true; wallTex.minFilter=THREE.LinearMipmapLinearFilter;
  if(!videoTex){ videoTex=new THREE.VideoTexture(J.reel); videoTex.colorSpace=THREE.SRGBColorSpace; videoTex.generateMipmaps=true; videoTex.minFilter=THREE.LinearMipmapLinearFilter; posterTex=new THREE.TextureLoader().load(J.reel.getAttribute('poster'),()=>{ posterTex.colorSpace=THREE.SRGBColorSpace; }); }
  const L=new THREE.Vector3(-.5,.6,.62).normalize();
  if(plate) scene.remove(plate); if(film) scene.remove(film);
  mat=new THREE.ShaderMaterial({vertexShader:VS,fragmentShader:FS,extensions:{shaderTextureLOD:true},uniforms:{uTex:{value:cutTex},uWall:{value:wallTex},uFilm:{value:posterTex},uSize:{value:new THREE.Vector2(W,H)},uRes:{value:new THREE.Vector2(W*dpr,H*dpr)},uFilmFit:{value:new THREE.Vector2(1,1)},uCamL:{value:new THREE.Vector3()},uL:{value:L},uT:{value:T},uSee:{value:Math.min(.9,Cut.cssNum('--plate-see'))*.7},uLip:{value:lay.hollow.lip},uEtch:{value:Math.max(0,Cut.cssNum('--plate-etch'))},uDare:{value:1},uTime:{value:0},uRelief:{value:lay.phone?8:12}}});
  plate=new THREE.Mesh(new THREE.PlaneGeometry(W*1.1,H*1.1,lay.phone?90:160,lay.phone?120:100),mat); scene.add(plate);
  const fh=H*(Z0+D)/Z0*1.5, fw=fh*W/H;
  filmMat=new THREE.ShaderMaterial({vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform sampler2D uFilm;uniform vec2 uFit;varying vec2 vUv;void main(){vec2 u=(vUv-.5)*uFit+.5;gl_FragColor=vec4(texture2D(uFilm,u).rgb,1.);}',uniforms:{uFilm:{value:posterTex},uFit:{value:new THREE.Vector2(1,1)}}});
  film=new THREE.Mesh(new THREE.PlaneGeometry(fw,fh),filmMat); film.position.z=-D; scene.add(film);
  setFit(1280,720); window.__journey.mode='gl';
}
function setFit(tw,th){ const f=cover(tw,th); const k=1.5; filmMat.uniforms.uFit.value.set(f[0]/k,f[1]/k); mat.uniforms.uFilmFit.value.set(f[0],f[1]); }
let vidOK=false;
function frame(){
  requestAnimationFrame(frame); if(!renderer) return;
  const t=(performance.now()-t0)/1000, p=J.p;
  if(!vidOK&&J.reel.readyState>=2&&!J.reel.paused){ vidOK=true; mat.uniforms.uFilm.value=videoTex; filmMat.uniforms.uFilm.value=videoTex; setFit(J.reel.videoWidth||1280,J.reel.videoHeight||720); }
  // the pointer tilts the plate, sprung, and the plate breathes under notice; both fade as the camera goes in
  const fade=1-J.seg(p,0,.35), px=J.pointer.has?J.pointer.x:0, py=J.pointer.has?J.pointer.y:0;
  ax+=((py*2.2+.5*Math.sin(t*.37))*Math.PI/180*fade-ax)*.05; ay+=((px*2.8+.4*Math.sin(t*.29+1.3))*Math.PI/180*fade-ay)*.05;
  plate.rotation.x=-ax; plate.rotation.y=ay;
  // the camera: in toward the O of WORK, through it, into the film
  const ox=lay.o.x-W/2, oy=H/2-lay.o.y, e1=J.ease(J.seg(p,0,.58)), e2=J.seg(p,.58,.8);
  const cz=Z0+(40-Z0)*e1-120*e2, cx=ox*e1+px*18*fade, cy=oy*e1+py*12*fade;
  camera.position.set(cx,cy,cz); camera.lookAt(ox*e1,oy*e1,-D*Math.max(e1,.001)-1);
  mat.uniforms.uCamL.value.copy(plate.worldToLocal(camera.position.clone()));
  mat.uniforms.uTime.value=t; plate.visible=cz>2;
  renderer.domElement.style.opacity=String(1-J.seg(p,.8,.96));
  renderer.render(scene,camera);
}
Cut.fontsReady().then(Cut.loadWall).then(wall=>{
  let gl=null; try{ gl=document.createElement('canvas').getContext('webgl'); }catch(e){}
  if(J.reduce||J.still||!gl){ wrapStill(wall); J.start(); return; }
  try{ build(wall); }catch(e){ console.warn('v1:',e.message); wrapStill(wall); J.start(); return; }
  J.reel.style.visibility='hidden';
  new ResizeObserver(()=>{ const r=J.stage.getBoundingClientRect(); if(Math.round(r.width)!==W||Math.round(r.height)!==H) build(wall); }).observe(J.stage);
  J.start(); frame();
});
