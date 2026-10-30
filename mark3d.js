/* mark3d.js: the studio flame as a used stencil plate. 24 Oct 2026. Original code, no library.
   A blackened steel plate with the flame cut through it, held above the page it was sprayed onto.
   Through the cut you see the orange mark it left; on its face, the overspray it kept.
   Mount: <div class="mark3d" data-mark3d aria-hidden="true"><img class="mark3d-fallback" ...></div>
   The img stays when WebGL is missing, when reduced motion is asked for, or when JS is off. */
(function () {
  "use strict";
  var FLAME = "M-56.2 311.7 0 311.7 2.6 312 5.7 313.7 7.8 316.7 8.3 319.8 8.3 327.7 8.9 328.4 12.6 325.1 20.4 319.3 29.5 313.2 36.5 309.2 56.6 299.1 65.3 295.3 68.1 294.7 86.6 288.4 95.7 285.8 98.8 285.4 104.2 283.9 120.3 281.1 125.7 280.8 129.7 279.9 162.9 279.9 166.9 280.7 170.6 280.8 174.4 281.7 179.1 282 197.1 285.8 205.5 288.2 217.7 281.8 222.7 278.3 237.8 270.8 250.2 266 275.5 257.6 285.8 254.9 301 252 307.4 251.7 312 250.8 330.8 250.8 334.7 251.7 341.1 252 355.1 254.8 367.5 258.5 377.3 262.5 394 270.8 401 274.8 412.9 282.7 420.6 288.5 423.9 291.7 426.4 293.3 431.3 298.2 434 300 442.3 308.3 444.1 311 450.8 317.8 452.4 320.2 461.2 330.1 465.5 336.1 467.8 338.5 473.6 346.2 483.3 360.7 500.3 389 511.1 408.7 531.3 443.6 535.4 451.8 542.1 463.2 545.2 467.7 547.7 472.6 556.3 485.3 558 488.5 577.9 515.9 580.1 518.3 581.8 520.8 587.6 526.7 589.2 529.1 594.2 534.2 595.9 536.8 613.7 554.5 616.3 556.3 619.6 559.5 625.5 563.7 628.2 566.2 632 568.3 640.4 574.7 645.6 577.8 663.4 586.7 673.2 590.6 681.6 593.4 694.1 596.3 698 596.4 701.8 597.2 710 597.3 714.2 598.2 727.5 598.2 731.7 597.3 739.9 597.2 743.7 596.4 746.7 596.3 767.6 591.5 785.3 585.9 790.5 583.9 803.7 577.7 816 569.7 836.5 559 839 557.3 867.5 543.5 878.7 539.1 880.9 537.2 883.4 535.9 889 535.4 900 532 909.6 530.1 919.9 528.9 923.5 528 927.4 527.9 931.2 527.1 968.2 527 982.7 529.2 1003.7 535.4 1013.6 537.6 1019.4 539.5 1030.9 544.3 1049.4 553.5 1074.9 570.2 1085 579.2 1089.9 582.4 1092.7 585 1100.2 589.9 1107.9 595.7 1113.5 600.4 1114.8 602.8 1115.2 605.1 1114.7 607.7 1113.1 610.4 1110.3 612.2 1107.7 612.6 1104.6 612.1 1097.1 609.5 1089.4 607.6 1085.7 607.3 1069.5 603.8 1064.1 603.8 1059.9 602.9 1047.3 602.9 1044 602.2 1036.8 603.8 1029.5 603.8 1025.7 604.7 1021.8 604.8 1012.4 606.7 996.3 611.4 980.1 617.1 963.5 624 955.3 628.1 945.9 633.7 931.6 643.2 926 647.7 921.3 650.7 912 658 899.6 666.8 889.6 675.6 887.2 676.6 880.4 677 879.7 683.3 878 686.4 872.1 692.4 869.3 694.3 848.8 714.8 845.9 716.8 828.2 734.4 825.5 736.2 816.9 744.7 814.1 746.6 806.5 754.2 804 755.9 798.1 761.7 795.6 763.3 789.7 769.2 787.1 770.8 782.2 775.7 779.6 777.4 775.5 781.5 773.1 783 769 787.1 756.6 796.6 734.6 811.9 719.3 821.4 698.9 832.2 696.4 833.9 685.6 839.2 670.2 846 648.2 853.7 628.7 859.1 608.8 862.3 603.2 863.8 598.5 864.2 596.2 865 592.9 865.1 589 866 549.4 866 545.2 865.1 541.4 865 537.9 864.2 533.2 863.8 531.4 863.2 516.4 861 510.8 859.5 507.7 859.1 493.7 855.4 483.8 852 478.7 850.8 456.5 842.1 432.6 830.1 430.1 828.4 422.1 824.4 408.3 815.5 406.1 813.6 383.7 798.5 374.5 790.4 362.1 780.8 334.6 753.3 332.7 750.5 322.3 740 320.8 737.6 313.8 729.6 312.3 727.3 307.3 722.1 293.6 703.9 291.2 701.3 281.6 687.2 277.1 681.6 265.6 664.3 263.8 661 234.8 617.9 223.4 602.8 220.2 599.5 214.9 592.4 209.9 587.3 208.2 584.7 191.1 567.6 188.6 566 183.5 561 171.1 551.5 157.5 542.8 145.4 536.7 130.9 530.9 113.8 526.1 103.5 524.9 101.4 524.2 96.7 524.4 95.8 528.6 93.7 532.3 90.8 535.6 88.3 540.5 80.3 552.4 78.7 554.3 70.9 565.6 64.8 572.8 63.3 575.1 59.2 579.3 57.5 581.9 46.2 593.2 44.5 595.8 36.9 603.5 35 606.3 8.2 632.7 6.3 633.4 3.7 633.8 -56.2 633.8ZM18.1 409.9 22 408.7 26.3 405 34.3 394.9 45.2 376.9 46.2 372.9 45.4 369.4 43.5 366.5 40.5 364.4 36 363.4 33.7 363.7 31.1 364.8 25.6 369.4 17.1 378.4 11.6 381.6 9.3 384.6 8.3 389 8.3 400.5 9 404 10.7 406.8 12.9 408.6 15.4 409.7 18.1 409.9ZM482.6 557.6 486.4 556.4 488.5 554.9 490 552.9 491.2 548.5 490.2 544.5 454.6 485.3 445.2 467.5 439.4 457.7 434.9 448.7 419.7 423.7 409.4 409.6 401.8 401 399.8 398.1 392.7 390.9 390.5 387.9 387.9 385.2 381.6 379.8 372.1 373.8 365.2 370.4 361.9 369.3 359.3 368.8 357.4 369.1 353.5 371 351.3 373.6 350.3 376.2 350.3 379.9 351.3 382.5 355.5 388.1 359.1 391.8 365.8 400.3 368.5 403.1 378.7 416.9 380.9 419.2 387.9 429.3 396.7 444.5 401.5 449.2 407.1 456.7 414.3 467.5 421.3 476.7 429.2 488.5 434.3 497.7 442.1 514.3 446.1 520.8 465.5 544.9 476.1 555.5 479.4 557.2 482.6 557.6ZM500.3 758.9 504.4 757.6 506.4 756.1 507.9 754 509 749.8 507.9 745.6 506.4 743.4 497.4 734.4 495 731 481 717.1 475.9 713.1 472.7 708.3 468.4 699.9 465.2 697.1 462.3 693.2 458.8 690.1 457.4 687.5 455.3 681.6 454.1 675.1 450.5 667.8 447.6 665.5 445 664.5 441.2 664.5 438.7 665.5 436.5 667.1 434.9 669.5 433 677.7 431.7 680.2 428.8 682.4 425.6 683.1 422.8 682.4 416.9 678.8 412.5 673.6 406.8 670 400.2 663.4 398 660.3 394.4 656.7 392.4 653.8 388.8 650.1 386.8 647.2 383.2 643.6 379.4 638.8 368.2 622.2 365.8 619.6 363.3 615.6 353 603 341.1 582.4 332.8 570.5 316.7 544 297.4 516.4 282.6 492.7 272.6 479.6 267.1 474.1 263.5 469.6 259 465.1 255.7 462.8 239.9 447 235 443 229.1 437 224.4 430 220.6 427.2 218.2 426.2 211.6 425.1 201.1 419.9 189.8 412.4 183.5 409.4 176.5 407.5 173 408.2 170.2 410 167.1 413.4 159.9 424.2 150 437.3 149 441 149.3 443.1 150 445.2 151.6 447.6 153.8 449.2 155.7 450 170.9 453.4 185.2 458.1 196.6 462.9 205.8 467.4 223.8 478.4 236.2 488 239.9 491.7 242.8 493.7 259.7 510.5 261.9 513.6 266.5 518.3 274.1 527.8 279.8 535.3 287.6 547.1 296.3 562 301 565.9 312.5 580.3 345.9 631.3 356.4 644.7 367.5 656.7 369.6 659.7 375 665.2 377.1 668.2 382.5 673.6 384.8 676.8 390.6 682.6 393.8 684.9 413.2 704.2 428.3 716.5 447.1 730.6 458.8 738.1 477.1 748.7 496 758.1 500.3 758.9ZM18.1 480.3 21.8 479.3 36 470.5 45.4 465.8 56.9 461.9 61.3 459.9 63.8 458.1 65.4 455.8 80.6 425.1 81.1 422.3 80.8 420.2 80 418.1 78.2 415.6 75.4 413.8 71.9 413.1 69.5 413.4 61.8 416.2 50.6 421.3 44.9 424.6 39.6 428.5 34.5 433.5 28.6 441.2 21.1 449.9 15.3 458.6 10.9 462.1 9 465.1 8.3 468.4 8.3 471.2 9.6 475.7 11.1 477.8 13.3 479.3 15.7 480.2 18.1 480.3ZM780.5 714.9 783.9 714 787.9 711.4 807.6 696.7 836.6 671.5 867.7 647 876.9 640.5 878.4 638.8 882 632.9 890.9 631 910.8 619.2 921.8 613.7 949.4 601.3 959 597.5 971 593.9 973.3 592.5 975.7 589.4 976.7 585.7 976 582.2 974.5 579.6 971.4 577.2 967.7 576.2 955.8 577.9 936.3 583.5 923.2 588.5 909.6 594.7 889.5 605.9 883.4 607.6 881 609.6 878.3 614 874.9 617.5 873.1 620.2 869.6 621.3 864.7 623.8 862.1 624.1 859 623.4 856.9 622 854 618.4 850.2 616.6 848.1 616.3 846 616.6 842.2 618.4 830.8 628.8 824.8 633 819.7 639 817.2 643.1 808.9 650.7 807.4 653.1 806.4 656.6 805 659.2 801.3 663.5 793.7 670.6 772 701.3 771 703.7 770.8 705.8 772 710.2 773.5 712.3 775.7 713.9 778.1 714.7 780.5 714.9Z";

  // the plate, in its own units: 2 wide. The flame is cut to 82 percent of that width.
  var HB = [1.06, 0.69];          // the distance field covers this half extent
  var HR = [1.0, 0.63];           // the plate's half extent
  var HOLE = [0.875, 0.495, 0.03]; // the hang hole, top right: a workshop plate hangs on a nail
  var RANGE = 0.1;                // distance encoded in the texture, plus or minus, in plate units
  var TEXW = 1024, TEXH = 667;
  var PPU = TEXW / (2 * HB[0]);   // texels per plate unit
  var SVGC = [529.5, 558], SVGS = 1.64 / 1171; // flame centre and scale from svg units

  var VS = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
  var FS = [
    "precision highp float;",
    "uniform sampler2D uS;uniform vec2 uRes,uView;uniform mat3 uR;uniform float uD,uTime,uBack;uniform vec3 uL;",
    "const float ZC=6.,TH=.09,H=.045,TB=.03,RG=" + RANGE.toFixed(3) + ";",
    "const vec2 HB=vec2(" + HB[0] + "," + HB[1] + "),HR=vec2(" + HR[0] + "," + HR[1] + ");",
    "const vec3 HO=vec3(" + HOLE.join(",") + ");",
    "const vec3 ACC=vec3(.761,.212,.016);", // #E27F22 in linear light
    "float hs(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
    "float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+1.),f.x),f.y);}",
    "float fb(vec2 p){return .5*vn(p)+.3*vn(p*2.13+7.)+.2*vn(p*4.7+3.);}",
    "vec2 tx(vec2 p){return vec2(p.x/(2.*HB.x)+.5,.5-p.y/(2.*HB.y));}",
    "float box(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}",
    // the solid: plate minus cut, islands kept. Positive in air.
    "float sF(vec2 p){float d=(texture2D(uS,tx(p)).r-.5)*2.*RG;vec2 q=abs(p)-HB;return d+length(max(q,0.));}",
    // the ties that hold the islands, only in the front third of the plate
    "float sB(vec2 p){vec2 q=abs(p)-HB;if(max(q.x,q.y)>0.)return 1.;return(texture2D(uS,tx(p)).a-.5)*2.*RG;}",
    "float sol(vec3 p){float d=sF(p.xy);if(p.z>H-TB)d=min(d,sB(p.xy));return d;}",
    "vec2 gr(vec3 p){vec2 e=vec2(.0025,0.);return normalize(vec2(sol(p+e.xyy)-sol(p-e.xyy),sol(p+e.yxy)-sol(p-e.yxy))+1e-6);}",
    // spray: round dots, antialiased against the pixel size
    "float dots(vec2 p,float c,float dn,float px){vec2 q=p/c,i=floor(q),f=fract(q);float h=hs(i);vec2 o=vec2(hs(i+17.1),hs(i+31.7))*.5+.25;",
    " float r=.16+.2*hs(i+5.3);return step(h,dn)*clamp(.5-(length(f-o)-r)*c/px,0.,1.);}",
    "float lam(vec3 n){return .38+.62*max(dot(n,uL),0.)/.87;}",
    // the room: one soft window high on the left, a dim ceiling. Only the steel sees it.
    "float env(vec3 r){float e=dot(r,normalize(vec3(-.32,.46,.83)));return .01+.9*smoothstep(.975,.998,e)+.05*smoothstep(.8,.97,e)+.02*smoothstep(0.,1.,r.y);}",
    "vec3 metal(vec3 n,vec3 v,vec3 alb,float ro,float f0){",
    " vec3 h=normalize(uL+v);float a=ro*ro,a2=a*a,nh=max(dot(n,h),0.),k=nh*nh*(a2-1.)+1.;",
    " float D=a2/(3.1416*k*k),nl=max(dot(n,uL),0.),nv=max(dot(n,v),.05);",
    " float F=f0+(1.-f0)*pow(1.-max(dot(h,v),0.),5.);",
    " vec3 c=alb*(.12+1.1*nl)+vec3(1.,.97,.93)*D*F*nl*.22/(nv+.2);",
    " return c+env(reflect(-v,n))*mix(f0,1.,pow(1.-nv,5.))*(1.-ro*.6)*1.4;}",
    "void main(){",
    " vec2 uv=gl_FragCoord.xy/uRes;vec2 g=(uv*2.-1.)*uView;float pxg=2.*uView.x/uRes.x,px=pxg*(ZC-uD)/ZC;",
    " vec3 ro=vec3(0.,0.,ZC),rd=normalize(vec3(g,0.)-ro),C=vec3(0.,0.,uD);",
    " vec3 ol=(ro-C)*uR,dl=rd*uR,lL=uL*uR;",
    " vec3 p0=ol+dl*((H-ol.z)/dl.z),pb=ol+dl*((-H-ol.z)/dl.z);",
    " float s0=sol(p0);float cov=clamp(.5-s0/px,0.,1.);",
    " vec4 back=vec4(0.);",
    " if(cov<1.){",
    "  float hit=-1.;vec3 pp=p0,q=p0;",
    "  for(int i=1;i<=18;i++){q=mix(p0,pb,float(i)/18.);if(sol(q)<0.){hit=1.;break;}pp=q;}",
    "  if(hit>0.){",
    "   for(int j=0;j<5;j++){vec3 m=(pp+q)*.5;if(sol(m)<0.)q=m;else pp=m;}",
    "   vec2 n2=gr(q);vec3 n=vec3(n2,0.);vec3 nw=uR*n;vec3 vw=-rd;",
    "   float st=vn(vec2((q.x-q.y)*260.,q.z*9.));",           // the drag lines a blade leaves in a cut edge
    "   vec3 alb=vec3(.05,.05,.052)*(.7+.6*st);",
    "   float ao=.35+.65*smoothstep(-H,H,q.z);",
    "   vec3 c=metal(nw,vw,alb,.6,.12)*ao;",
    "   float wp=smoothstep(H-.03,H,q.z)*(.35+.65*vn(q.xy*70.));",   // paint that crept down the cut
    "   c=mix(c,ACC*lam(nw)*ao,clamp(wp*1.2,0.,.9));",
    "   back=vec4(c,1.);",
    "  }else{",
    "   vec3 pg=ro+rd*(-ro.z/rd.z);vec2 gp=pg.xy;",
    "   float sg=sF(gp);if(length(gp-HO.xy)<HO.z+.004)sg=-1.;",
    "   float inR=step(box(gp,HR,.04),0.);",
    "   float pnt=smoothstep(-.0012,.0022,sg)*inR*(.9+.1*fb(gp*14.));",
    "   pnt=max(pnt,dots(gp,.0055,exp(sg/.004)*.55,pxg)*inR*step(sg,0.));",   // the underspray a lifted edge lets through
    // the plate's shadow: light from high left, through the cut, soft with distance
    "   vec3 o=(pg-C)*uR;float vis=1.;",
    "   float tm=(-o.z)/lL.z,tf=(H-o.z)/lL.z,tbk=(-H-o.z)/lL.z;",
    "   float pen=.003+.05*tm;",
    "   vis=min(smoothstep(-pen,pen,sF((o+lL*tm).xy)),smoothstep(-pen,pen,sF((o+lL*tbk).xy)));",
    "   vis=min(vis,smoothstep(-pen,pen,sB((o+lL*tf).xy)));",
    "   vec2 eg=uView-abs(g);float fade=smoothstep(0.,.06,min(eg.x,eg.y));",
    "   float sh=(1.-vis)*.34*fade;",
    "   vec3 pc=ACC*uBack*(.4+.6*vis);",
    "   float a=pnt+(1.-pnt)*sh;",
    "   back=vec4(pc*pnt,a);",   // premultiplied: the shadow is black
    "  }",
    " }",
    " vec4 front=vec4(0.);",
    " if(cov>0.){",
    "  vec3 p=p0;vec2 n2=gr(p);float ed=-s0;",
    "  float bev=smoothstep(-.006,0.,s0)*1.4;",
    "  vec3 n=normalize(vec3(n2*bev,1.));vec3 nw=uR*n,vw=-rd;",
    "  float bl=fb(p.xy*4.+3.),fine=vn(p.xy*900.),ox=fb(p.xy*11.+9.);",   // mill scale: blue-grey oxide, warmer where it has worn
"  vec2 r1=mat2(.94,.34,-.34,.94)*p.xy,r2=mat2(.6,-.8,.8,.6)*p.xy;",
"  float scr=smoothstep(.93,.99,vn(r1*vec2(2.,700.)))*step(.6,vn(r1*vec2(4.,3.)))+smoothstep(.95,.995,vn(r2*vec2(2.5,800.)))*step(.62,vn(r2*vec2(3.,5.)));",   // a few fine scratches
"  vec3 alb=mix(vec3(.02,.022,.026),vec3(.032,.027,.022),smoothstep(.35,.75,ox))*(.84+.32*bl);",
"  float ro=.5+.12*bl;",
"  float dr=-box(p.xy,HR,.04);",
"  float wear=smoothstep(.014,0.,ed)*smoothstep(.3,.8,vn(p.xy*60.)+.3*fine);",   // edges handled bare
"  alb=mix(alb,vec3(.11,.105,.1),wear*.75+scr*.5);ro=mix(ro,.3,max(wear,scr));",
"  vec3 c=metal(nw,vw,alb,ro,mix(.07,.5,max(wear,scr)))*(1.+.22*dot(p.xy,vec2(-.55,.45)));",   // the lamp is near: the face falls off away from it
    // the overspray the plate kept: one continuous crust on the cut edge, a dark rust haze behind it, no loose dots
    "  float cut=step(ed+.0015,dr)*step(HO.z+.02,length(p.xy-HO.xy));",
    "  float cw=.0018+.0045*vn(p.xy*38.)+.002*vn(p.xy*130.);",
    "  float crust=clamp(.5-(ed-cw)/px,0.,1.);",
    "  float pm=clamp(crust,0.,1.)*cut*(.75+.25*bl);",
    "  vec3 pcol=ACC*lam(nw)*(.82+.18*fine);",
    "  c=mix(c,pcol*.35,exp(-ed/.02)*.3*cut);",
    "  c=mix(c,pcol,pm);",
    "  front=vec4(c,1.);",
    " }",
    " vec4 o4=mix(back,front,cov);",
    " vec3 sr=o4.a>0.?pow(o4.rgb/o4.a,vec3(1./2.2)):vec3(0.);",
    " sr+=(hs(gl_FragCoord.xy+fract(uTime))-.5)/255.;",
    " gl_FragColor=vec4(sr*o4.a,o4.a);",
    "}"
  ].join("\n");

  /* ---------- the distance field, made once per page ---------- */
  var field = null;
  function edt(grid, w, h) { // exact squared distance transform, separable, written for this file
    var n = Math.max(w, h), f = new Float64Array(n), d = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1);
    function pass(off, stride, len) {
      for (var i = 0; i < len; i++) f[i] = grid[off + i * stride];
      var k = 0; v[0] = 0; z[0] = -Infinity; z[1] = Infinity;
      for (var q = 1; q < len; q++) {
        var r = v[k], s = (f[q] - f[r] + q * q - r * r) / (2 * q - 2 * r);
        while (s <= z[k]) { k--; r = v[k]; s = (f[q] - f[r] + q * q - r * r) / (2 * q - 2 * r); }
        k++; v[k] = q; z[k] = s; z[k + 1] = Infinity;
      }
      k = 0;
      for (var p = 0; p < len; p++) {
        while (z[k + 1] < p) k++;
        var t = p - v[k]; d[p] = t * t + f[v[k]];
      }
      for (var j = 0; j < len; j++) grid[off + j * stride] = d[j];
    }
    for (var x = 0; x < w; x++) pass(x, w, h);
    for (var y = 0; y < h; y++) pass(y * w, 1, w);
  }
  function sdfFrom(alpha, w, h, out, ch) { // alpha 0..255, 255 = solid. Writes 0..255 into out channel ch
    var N = w * h, BIG = 1e20, a, i, outer = new Float64Array(N), inner = new Float64Array(N);
    for (i = 0; i < N; i++) {
      a = alpha[i] / 255;
      if (a >= 1) { outer[i] = 0; inner[i] = BIG; }
      else if (a <= 0) { outer[i] = BIG; inner[i] = 0; }
      else { var o = Math.max(0, .5 - a), u = Math.max(0, a - .5); outer[i] = o * o; inner[i] = u * u; }
    }
    edt(outer, w, h); edt(inner, w, h);
    var k = 255 / (2 * RANGE * PPU);
    for (i = 0; i < N; i++) {
      var dd = Math.sqrt(outer[i]) - Math.sqrt(inner[i]); // texels, positive in air
      var val = 127.5 + dd * k;
      out[i * 2 + ch] = val < 0 ? 0 : val > 255 ? 255 : val;
    }
  }
  function subpaths() {
    return FLAME.split("M").filter(Boolean).map(function (s) {
      var n = s.replace(/Z/g, "").trim().split(/[\s,]+/).map(Number), pts = [];
      for (var i = 0; i + 1 < n.length; i += 2) pts.push([n[i], n[i + 1]]);
      return pts;
    });
  }
  function bridges(subs) { // one tie per island, at its shortest reach to the outline, so no tie spans the open cut
    var outer = subs[0], out = [];
    for (var s = 1; s < subs.length; s++) {
      var P = subs[s], bd = Infinity, A = null, B = null;
      for (var i = 0; i < P.length; i++) for (var j = 0; j < outer.length; j++) {
        var x = outer[j][0] - P[i][0], y = outer[j][1] - P[i][1], d = x * x + y * y;
        if (d < bd) { bd = d; A = P[i]; B = outer[j]; }
      }
      var vx = B[0] - A[0], vy = B[1] - A[1], l = Math.hypot(vx, vy) || 1;
      out.push([A[0] - vx / l * 8, A[1] - vy / l * 8, B[0] + vx / l * 8, B[1] + vy / l * 8]);
    }
    return out;
  }
  function bake() {
    if (field) return field;
    var cv = document.createElement("canvas"); cv.width = TEXW; cv.height = TEXH;
    var c = cv.getContext("2d", { willReadFrequently: true }), m = SVGS * PPU, tr = [m, 0, 0, m, TEXW / 2 - SVGC[0] * m, TEXH / 2 - SVGC[1] * m];
    var rx = HR[0] * PPU, ry = HR[1] * PPU, r = .04 * PPU, x0 = TEXW / 2 - rx, y0 = TEXH / 2 - ry;
    c.fillStyle = "#fff"; c.beginPath();
    c.moveTo(x0 + r, y0); c.arcTo(x0 + 2 * rx, y0, x0 + 2 * rx, y0 + 2 * ry, r); c.arcTo(x0 + 2 * rx, y0 + 2 * ry, x0, y0 + 2 * ry, r);
    c.arcTo(x0, y0 + 2 * ry, x0, y0, r); c.arcTo(x0, y0, x0 + 2 * rx, y0, r); c.closePath(); c.fill();
    c.globalCompositeOperation = "destination-out";
    c.setTransform(tr[0], 0, 0, tr[3], tr[4], tr[5]); c.fill(new Path2D(FLAME), "evenodd");
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.beginPath(); c.arc(TEXW / 2 + HOLE[0] * PPU, TEXH / 2 - HOLE[1] * PPU, HOLE[2] * PPU, 0, 7); c.fill();
    var A = c.getImageData(0, 0, TEXW, TEXH).data, N = TEXW * TEXH, al = new Uint8Array(N), i;
    for (i = 0; i < N; i++) al[i] = A[i * 4 + 3];
    var out = new Uint8Array(N * 2);
    sdfFrom(al, TEXW, TEXH, out, 0);
    c.globalCompositeOperation = "source-over"; c.clearRect(0, 0, TEXW, TEXH);
    c.setTransform(tr[0], 0, 0, tr[3], tr[4], tr[5]);
    c.strokeStyle = "#fff"; c.lineCap = "round"; c.lineWidth = .011 / SVGS;
    bridges(subpaths()).forEach(function (b) { c.beginPath(); c.moveTo(b[0], b[1]); c.lineTo(b[2], b[3]); c.stroke(); });
    A = c.getImageData(0, 0, TEXW, TEXH).data;
    for (i = 0; i < N; i++) al[i] = A[i * 4 + 3];
    sdfFrom(al, TEXW, TEXH, out, 1);
    field = out; return out;
  }

  /* ---------- motion: a heavy plate on a sprung hand ---------- */
  // stiffness 9, damping ratio 0.82: it follows you late, overshoots by a hair, settles in about 1.6 s
  var K = 9, CD = 2 * 0.82 * Math.sqrt(K), DEG = Math.PI / 180;
  function spring(x) { return { x: x, v: 0, t: x }; }
  function stepSpring(s, dt) { var a = K * (s.t - s.x) - CD * s.v; s.v += a * dt; s.x += s.v * dt; }

  var pointer = { x: 0, y: 0, has: false };
  var marks = [], raf = 0, t0 = 0, last = 0, hidden = false;

  function Mark(el) {
    this.el = el; this.img = el.querySelector(".mark3d-fallback");
    this.cv = document.createElement("canvas"); this.cv.className = "mark3d-canvas";
    var gl = this.cv.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false });
    if (!gl) throw 0;
    this.gl = gl;
    var p = gl.createProgram();
    [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, FS]].forEach(function (s) {
      var sh = gl.createShader(s[0]); gl.shaderSource(sh, s[1]); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
      gl.attachShader(p, sh);
    });
    gl.bindAttribLocation(p, 0, "a");
    gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    gl.useProgram(p);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    var tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE_ALPHA, TEXW, TEXH, 0, gl.LUMINANCE_ALPHA, gl.UNSIGNED_BYTE, bake());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var U = {}; ["uS", "uRes", "uView", "uR", "uD", "uTime", "uL", "uBack"].forEach(function (n) { U[n] = gl.getUniformLocation(p, n); });
    this.U = U;
    // R14 (30 Oct): a plate may carry its own fit, light and scroll turn in data attributes, so the hero-scale plate on the home
    // (data-fit="2.62 1.75" data-fit-phone="2.25 1.75" data-light="-.78 .34 .53" data-turn="-14") is the same object under a raking light,
    // turning by 14 degrees about its vertical axis as the screen scrolls past. Absent, every figure is what it was.
    var ds = el.dataset || {}, nums = function (s, d) { var a = (s || "").trim().split(/[\s,]+/).map(Number); return a.length === d.length && a.every(isFinite) ? a : d; };
    this.fit = nums(ds.fit, [2.62, 1.96]); this.fitPhone = nums(ds.fitPhone, this.fit); this.turn = parseFloat(ds.turn) || 0; this.clampY = 9 + Math.abs(this.turn) * .5;
    var L = nums(ds.light, [-.3, .42, .86]), l = Math.hypot(L[0], L[1], L[2]);
    gl.uniform3f(U.uL, L[0] / l, L[1] / l, L[2] / l); gl.uniform1i(U.uS, 0);
    // Anwar R14: data-back dims the orange seen through the cut on one plate only (the hero-scale plate, .4); absent, 1
    var bk = parseFloat(ds.back); gl.uniform1f(U.uBack, isFinite(bk) ? bk : 1);
    // it arrives a little tipped and lifted, then settles: the heft of something put down
    this.ax = spring(5 * DEG); this.ay = spring(-6 * DEG); this.d = spring(.42);
    this.visible = false; this.drawn = false; this.w = 0; this.h = 0;
    el.appendChild(this.cv);
    var self = this;
    this.cv.addEventListener("webglcontextlost", function (e) { e.preventDefault(); self.destroy(); });
    this.io = new IntersectionObserver(function (en) { self.visible = en[0].isIntersecting; wake(); }, { rootMargin: "120px" });
    this.io.observe(el);
    this.ro = new ResizeObserver(function () { self.size(); });
    this.ro.observe(el);
    this.size();
  }
  Mark.prototype.size = function () {
    var r = this.el.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var k = Math.min(dpr, 1600 / Math.max(r.width, r.height, 1));
    var w = Math.max(1, Math.round(r.width * k)), h = Math.max(1, Math.round(r.height * k));
    if (w === this.w && h === this.h) return;
    this.w = this.cv.width = w; this.h = this.cv.height = h;
    this.gl.viewport(0, 0, w, h);
    // fit: room for the plate, its tilt and its shadow falling right and down
    var fit = (window.matchMedia && matchMedia("(max-width:760px)").matches) ? this.fitPhone : this.fit;
    var s = Math.min(w / fit[0], h / fit[1]);
    this.gl.uniform2f(this.U.uRes, w, h); this.gl.uniform2f(this.U.uView, w / 2 / s, h / 2 / s);
    this.drawn = false; wake();
  };
  Mark.prototype.frame = function (t, dt) {
    var r = this.el.getBoundingClientRect(), vh = window.innerHeight || 1, vw = window.innerWidth || 1;
    var prog = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height))); // 0 entering at the bottom, 1 leaving at the top
    var px = 0, py = 0;
    if (pointer.has) {
      px = Math.max(-1, Math.min(1, (pointer.x - (r.left + r.width / 2)) / (vw * .5)));
      py = Math.max(-1, Math.min(1, (pointer.y - (r.top + r.height / 2)) / (vh * .5)));
    }
    // idle: it breathes just under notice, never perfectly still
    var bx = .55 * Math.sin(t * .29 + 1.3) + .25 * Math.sin(t * .71), by = .8 * Math.sin(t * .37) + .2 * Math.sin(t * .93 + 2);
    this.ay.t = (px * 8 + by + (prog - .5) * this.turn) * DEG;
    this.ax.t = (py * 5.5 + (prog - .5) * 7 + bx) * DEG;
    this.d.t = .36 + .008 * Math.sin(t * .23);
    var n = Math.max(1, Math.ceil(dt / (1 / 120))), h = dt / n;
    for (var i = 0; i < n; i++) { stepSpring(this.ax, h); stepSpring(this.ay, h); stepSpring(this.d, h); }
    // the plate never touches the page: clamp the tilt so its lowest corner stays clear
    var cy = this.clampY * DEG, ax = Math.max(-9.5 * DEG, Math.min(9.5 * DEG, this.ax.x)), ay = Math.max(-cy, Math.min(cy, this.ay.x));
    var cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
    // R = Ry * Rx, column major. Pointer to the right turns the face toward it.
    var R = [cy, 0, -sy, sy * sx, cx, cy * sx, sy * cx, -sx, cy * cx];
    var gl = this.gl;
    gl.uniformMatrix3fv(this.U.uR, false, R);
    gl.uniform1f(this.U.uD, this.d.x); gl.uniform1f(this.U.uTime, t);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!this.drawn) { this.drawn = true; this.el.classList.add("is-live"); }
  };
  Mark.prototype.destroy = function () {
    this.io.disconnect(); this.ro.disconnect();
    var ext = this.gl.getExtension("WEBGL_lose_context");
    if (this.cv.parentNode) this.cv.parentNode.removeChild(this.cv);
    this.el.classList.remove("is-live");
    if (ext && !this.gl.isContextLost()) ext.loseContext();
    marks = marks.filter(function (m) { return m !== this; }, this);
  };

  function loop(now) {
    raf = 0;
    var t = now / 1000, dt = Math.min(1 / 30, last ? t - last : 1 / 60); last = t;
    var any = false;
    for (var i = 0; i < marks.length; i++) if (marks[i].visible) { marks[i].frame(t, dt); any = true; }
    if (any && !hidden) raf = requestAnimationFrame(loop); else last = 0;
  }
  function wake() { if (!raf && !hidden) raf = requestAnimationFrame(loop); }

  var rm = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  function start() {
    if (rm && rm.matches) return;
    if (!window.IntersectionObserver || !window.ResizeObserver || !window.Path2D) return;
    var els = document.querySelectorAll("[data-mark3d]");
    for (var i = 0; i < els.length; i++) {
      if (els[i].querySelector(".mark3d-canvas")) continue;
      try { marks.push(new Mark(els[i])); } catch (e) { if (e && e.message && window.console) console.warn("mark3d:", e.message); }
    }
  }
  function stop() { marks.slice().forEach(function (m) { m.destroy(); }); }
  if (rm) { var onrm = function () { if (rm.matches) stop(); else start(); }; rm.addEventListener ? rm.addEventListener("change", onrm) : rm.addListener(onrm); }
  window.addEventListener("pointermove", function (e) { pointer.x = e.clientX; pointer.y = e.clientY; pointer.has = true; }, { passive: true });
  document.addEventListener("visibilitychange", function () { hidden = document.hidden; if (!hidden) wake(); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
