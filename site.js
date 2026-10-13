/* round 6: every heading below the first screen is set to the width of its column, then arrives once by a clip flood.
   No script, no GSAP or reduced motion: every heading stands finished at its stylesheet size. */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var heads = [].slice.call(document.querySelectorAll('main .h2, .pagehead .h1'));
  function lines(h){ return [].filter.call(h.children, function(s){ return s.offsetParent !== null; }); }
  function fit(){
    var phone = window.innerWidth <= 760, cap = phone ? window.innerWidth * 0.27 : Math.min(190, window.innerWidth * 0.132);
    heads.forEach(function(h){
      h.style.fontSize = '';
      var box = h.parentElement, cs = getComputedStyle(box);
      var avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (box.classList.contains('playrow')) avail -= phone ? 82 : 106;
      var fs = parseFloat(getComputedStyle(h).fontSize), w = 0;
      lines(h).forEach(function(s){ w = Math.max(w, s.getBoundingClientRect().width); });
      if (!w || !avail) return;
      h.style.fontSize = Math.min(cap, fs * avail / w * 0.985).toFixed(1) + 'px';
    });
    footEdge();
  }
  /* round 10: the foot's white words end where the big heading above them ends. --fx is the distance from the column's right edge back to its last letter */
  /* round 15: the measure is taken again whenever that heading changes size (a late font, a late fit), and it is never allowed past the room
     the wordmark and the foot menu need side by side, so a wrong or early reading can no longer squeeze the wordmark */
  var footSeen = null, footRO = window.ResizeObserver ? new ResizeObserver(function(){ requestAnimationFrame(footEdge); }) : null;
  function footEdge(){
    [].forEach.call(document.querySelectorAll('.foot'), function(f){
      var w = f.querySelector('.wrap'); if (!w) return;
      f.style.removeProperty('--fx'); f.classList.remove('two');
      var hs = [].filter.call(document.querySelectorAll('.h1, .h2'), function(h){ return h.offsetParent !== null && (h.compareDocumentPosition(f) & 4); });
      var h = hs[hs.length - 1]; if (!h) return;
      if (footRO && h !== footSeen){ if (footSeen) footRO.unobserve(footSeen); footSeen = h; footRO.observe(h); }
      var x = 0; lines(h).forEach(function(s){ x = Math.max(x, s.getBoundingClientRect().right); });
      var r = w.getBoundingClientRect().right, fx = r - x;
      var mk = f.querySelector('.mark'), nv = f.querySelector('nav'), cs = getComputedStyle(w);
      var gaps = function(){ return (parseFloat(cs.columnGap) || 0) * (cs.gridTemplateColumns.split(' ').length - 1); };
      var base = w.clientWidth - parseFloat(cs.paddingLeft) - (mk ? mk.offsetWidth : 0) - (nv ? nv.scrollWidth : 0), room = base - gaps();
      /* round 16: a heading that ends too far left for three columns (heritage) drops the empty middle one: lower-r6.css .foot.two, one gap of 24,
         and the room is counted again, so the white words land on the heading's last letter instead of stopping short of it */
      if (fx > room + 0.5){ f.classList.add('two'); room = base - gaps(); }
      fx = Math.min(fx, room);
      if (x && fx > 0.5) f.style.setProperty('--fx', fx.toFixed(1) + 'px');
    });
  }
  /* round 10: the way back up, and the scroll cue's exit. One passive listener, one frame of work per scroll at most.
     The arrow's spoken name is the top heading itself, so no new word is written: it says where it takes you */
  var doc = document.documentElement, top = document.createElement('a');
  top.className = 'totop'; top.href = '#';
  top.innerHTML = '<svg viewBox="0 0 22 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter" aria-hidden="true"><path d="M3 10.5L10.1 3.4M11.9 3.4L19 10.5M11 7.5V13.5M11 15.5V22"/></svg>';
  var th = [].filter.call(document.querySelectorAll('.first .head, .pagehead .h1'), function(h){ return getComputedStyle(h).display !== 'none'; })[0];
  if (th){ if (!th.id) th.id = 'pagetop'; top.setAttribute('aria-labelledby', th.id); }
  document.body.appendChild(top);
  top.addEventListener('click', function(e){
    e.preventDefault();
    window.scrollTo({top: 0, behavior: reduce ? 'auto' : 'smooth'});
    var lg = document.querySelector('.menu .logo'); if (lg) lg.focus({preventScroll: true});
  });
  var first = document.querySelector('header.first'), bar = first && first.querySelector('.menu nav a.stamp');
  /* round 12, home: the top button is one fixed button from the first frame. A line while the first screen is on view, orange once it has gone.
     The line is its own layer under the button (difference blend, so it reads black on the cream cloth and cream on the film as the column
     draws away from under it); the orange fill then eases in over it. Without this script the bar keeps its own orange button */
  if (bar){
    var dock = bar.cloneNode(true); dock.className = 'stamp dock';
    var ghost = document.createElement('span'); ghost.className = 'dockline'; ghost.setAttribute('aria-hidden', 'true'); ghost.textContent = bar.textContent;
    first.parentNode.insertBefore(dock, first.nextSibling); dock.parentNode.insertBefore(ghost, dock.nextSibling);
    doc.classList.add('dk');
  }
  /* round 12: THE ONE LIST. Every orange main button on every page reads its words from this array, in this order.
     The copywriter's lines go here, nowhere else. Keep each to about 24 characters: the widest line sets every button's width.
     With one line nothing rotates. The spoken name of the button never changes */
  var ASK = ['Ask for the audit', 'Have your business read', 'Where would we start', "See what we'd keep", 'Bring it as it is', 'Go on, ask'];
  var NAME = 'Ask for the audit', rots = [], at = 0;
  [].forEach.call(document.querySelectorAll('a.stamp, .dockline'), function(b){
    if (b.textContent.trim() !== NAME) return;
    if (b.tagName === 'A') b.setAttribute('aria-label', NAME);
    if (reduce || ASK.length < 2){ b.textContent = ASK[0]; return; }
    var r = document.createElement('span'); r.className = 'rot'; r.setAttribute('aria-hidden', 'true');
    ASK.forEach(function(t, i){ var l = document.createElement('span'); l.className = 'rl' + (i ? '' : ' on'); l.textContent = t; r.appendChild(l); });
    b.textContent = ''; b.appendChild(r); r.at = 0; rots.push(r);
  });
  /* round 15: a button shows a line only when the line fits its own box with 8 px of air each side. A line too long for one box is passed over
     on that button alone, which keeps the line it has for that beat. Every box keeps its size, so nothing moves when the line changes */
  function show(r, i){
    if (i === r.at) return;
    [].forEach.call(r.children, function(l, k){ l.classList.toggle('was', k === r.at); l.classList.toggle('on', k === i); }); r.at = i;
  }
  function fits(){
    var rg = document.createRange();
    rots.forEach(function(r){
      var room = r.parentElement.clientWidth - 16;
      r.ok = [].map.call(r.children, function(l){ rg.selectNodeContents(l); return rg.getBoundingClientRect().width <= room; });
      r.ok[0] = true; if (!r.ok[r.at]) show(r, 0);
    });
  }
  if (rots.length) setInterval(function(){
    /* held while a button is under the pointer or the keyboard, and while the tab is out of sight */
    if (document.hidden || document.querySelector('a.stamp:hover, a.stamp:focus-visible')) return;
    at = (at + 1) % ASK.length;
    rots.forEach(function(r){ if (!r.ok || r.ok[at]) show(r, at); });
  }, 3200);
  var ticking = false, gaps = [];
  function onScroll(){
    ticking = false;
    var y = window.scrollY || 0;
    doc.classList.toggle('moved', y > 24);
    if (first) doc.classList.toggle('past', y >= first.offsetHeight - 1);
    top.classList.toggle('on', y > window.innerHeight * 0.5);
    var by = false; for (var i = 0; i < gaps.length; i++){ if (y <= gaps[i][0]) break; if (y < gaps[i][1]){ by = true; break; } }
    top.classList.toggle('by', by);
  }
  window.addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, {passive: true});
  onScroll();
  /* round 19: the arrow yields to the words. Measured once (load, fonts, resize, any reflow), never on scroll: every line of text and every
     button that would pass within reach of the arrow's box becomes a stretch of scroll where it stands down. Scrolling is arithmetic only.
     A clear stretch too short to be more than a flash is closed; the last one, the foot, always stays */
  function yieldMap(){
    var cs = getComputedStyle(top), L = parseFloat(cs.left) || 0, B = parseFloat(cs.bottom) || 0, S = 44, PX = 16, PY = 28, MIN = 140,
        vh = window.innerHeight, sy = window.scrollY || 0, x0 = L - PX, x1 = L + S + PX, iv = [], m = [];
    function pinned(e){ for (; e && e !== document.body; e = e.parentElement) if (getComputedStyle(e).position === 'fixed') return true; return false; }
    function add(r){ if (r.width > 0 && r.height > 0 && r.left < x1 && r.right > x0) iv.push([r.top + sy - PY - vh + B, r.bottom + sy + PY - vh + B + S]); }
    var tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n, el, rg = document.createRange();
    while ((n = tw.nextNode())){
      if (!n.nodeValue.trim() || !(el = n.parentElement) || el.closest('.totop,script,style')) continue;
      if (getComputedStyle(el).visibility === 'hidden' || pinned(el)) continue;
      rg.selectNodeContents(n); [].forEach.call(rg.getClientRects(), add);
    }
    [].forEach.call(document.querySelectorAll('a,button,.steps li'), function(e){ if (e !== top && !e.querySelector('img,video') && !pinned(e)) add(e.getBoundingClientRect()); });
    iv.sort(function(p, q){ return p[0] - q[0]; });
    iv.forEach(function(v){ var k = m[m.length - 1]; if (k && v[0] - k[1] < MIN) k[1] = Math.max(k[1], v[1]); else m.push([v[0], v[1]]); });
    gaps = m;
  }
  var remap = false;
  function askMap(){ if (!remap){ remap = true; requestAnimationFrame(function(){ remap = false; yieldMap(); onScroll(); }); } }
  askMap(); window.addEventListener('load', askMap); window.addEventListener('resize', askMap); setTimeout(askMap, 2600);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(askMap);
  if (window.ResizeObserver) new ResizeObserver(askMap).observe(document.body);

  function flood(){
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    heads.forEach(function(h){
      var ls = lines(h); if (!ls.length) return;
      gsap.set(ls, {clipPath: 'inset(-14% 100% -14% 0%)'});
      ScrollTrigger.create({trigger: h, start: 'top 90%', once: true, onEnter: function(){
        gsap.to(ls, {clipPath: 'inset(-14% 0% -14% 0%)', duration: 0.42, ease: 'power2.in', stagger: 0.07, clearProps: 'clipPath'}); }});
    });
  }
  fit(); fits();
  var t; window.addEventListener('resize', function(){ clearTimeout(t); t = setTimeout(function(){ fit(); fits(); if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 120); });
  window.addEventListener('load', function(){ fit(); fits(); });
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function(){ fit(); fits(); flood(); });
})();

/* sticky bar (13 Oct): html.stuck once the page has moved, so the pinned bar gets its ground. One passive listener, one frame per scroll */
(function(){
  var r = document.documentElement, t = false;
  function s(){ t = false; r.classList.toggle('stuck', (window.scrollY || 0) > 8); }
  window.addEventListener('scroll', function(){ if (!t){ t = true; requestAnimationFrame(s); } }, {passive: true});
  s();
})();

/* round 20: a film's player is fetched only when its play is pressed */
(function(){
  [].forEach.call(document.querySelectorAll('.reel[data-embed]'), function(b){ b.addEventListener('click', function(){
    var f = document.createElement('iframe'); f.src = b.dataset.embed; f.title = b.getAttribute('aria-label').replace(/^Play /, '');
    f.allow = 'autoplay; fullscreen; picture-in-picture'; f.allowFullscreen = true; b.replaceWith(f); f.focus(); }); });
})();
