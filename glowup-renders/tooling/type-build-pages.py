# type-build-pages.py: writes the six type-variant pages from index-a.html and what-we-do.html. 25 Oct 2026, Nadir.
# Only the first-screen block and the head/foot links change; every other line is copied as it is. Never touches the source pages.
# RETIRED 28 Oct 2026: index.html is now the live home and is hand-edited; this script would overwrite it via index-type-a.html.
raise SystemExit('type-build-pages.py is retired: edit index.html directly')
import re, pathlib
W = pathlib.Path('/Users/asiffarid/Documents/apps/flowstateimpact-site-glowup')
home = (W/'index-a.html').read_text()
wwd = (W/'what-we-do.html').read_text()

WHO = '<p class="who"><b>A strategy and design firm, working from both.</b><span class="dim">Dhaka · London</span><span class="dim">We shape the brand. You keep the AI we build.</span></p>'
LANE = re.search(r'  <video class="bed" id="lane".*?</video>\n', home, re.S).group(0)
CAP = '  <a class="cap" href="heritage-in-motion.html"><span class="lab">Heritage in Motion</span><span class="ln">Dhaka dressing Dhaka.</span></a>\n'
PLAY = re.search(r'  <button class="play" data-for="lane".*?</button>\n', home, re.S).group(0)

HERO_A = f'''<!-- screens one and two: the plate. The letters are holes cut in a black steel plate; the lane film plays behind it and is seen only through the cuts.
     DARE is sprayed on the plate, not cut. On scroll the plate hinges away at its top edge and the film floods the screen; DARE lifts last -->
<section class="scene snap" aria-label="FlowStãte Impact" data-plate>
  <div class="stage screen crop">
{LANE}    {WHO.replace('class="who"', 'class="who sr-h"')}
    <h1 class="sr-h">We make the work <span class="os">other studios</span> will not <em class="hot" style="font-style:normal">dare</em></h1>
    <div class="plate" aria-hidden="true"></div>
    <div class="after">
      <div class="word st" aria-hidden="true">Work</div>
    {CAP}    {PLAY}    </div>
  </div>
</section>
'''

HERO_B = f'''<!-- screen one: the ledger. The sentence crosses the screen on a diagonal, a whisper top left and the cut bottom right on the fold.
     WILL, NOT and DARE are three plates at three depths; the who block holds the bottom left corner -->
<section class="hero-t ledger snap" aria-label="FlowStãte Impact" data-ledger>
  <h1 class="led"><span class="l1">We make the work</span> <span class="l2">other studios</span> <span class="l3 st"><span class="pl p1">will</span> <span class="pl p2">not</span> <span class="pl p3 hot">dare</span></span></h1>
  {WHO}
</section>
'''

HERO_C = f'''<!-- screen one: the small line. The whole sentence sharp and small on one line; behind it, deep in the room, the one word DARE enormous and out of focus.
     On scroll it comes forward into focus and lands sharp on the street as the film arrives -->
<section class="hero-t small snap" aria-label="FlowStãte Impact" data-small>
  <div class="deep" aria-hidden="true"><span class="st">Dare</span></div>
  <h1 class="line">We make the work other studios will not <em class="hot" style="font-style:normal">dare</em></h1>
  {WHO}
</section>
'''

LINES = '''    <div class="lines">
      <p>Our team reads it all: what people see, how it runs, what it sells.</p>
      <p>Then only what's needed.</p>
      <a class="go" href="the-audit.html">The audit</a>
    </div>
'''

WWD_A = f'''<!-- screen one: the comma. YOUR WHOLE BUSINESS, at word size, then READ. at poster size in orange: the pause, then the verdict -->
<section class="page-hero-t comma" aria-label="Your whole business, read." data-comma>
  <div class="end">
    <h1 class="st"><span class="l1">Your whole business,</span> <span class="l2 hot">read.</span></h1>
{LINES}  </div>
</section>
'''

WWD_B = f'''<!-- screen one: the spine. The title runs up the left edge like the spine of a book standing with its back to you; on scroll the slab turns to face you and the title lies flat across the cover -->
<section class="page-hero-t spine" aria-label="Your whole business, read." data-spine>
  <div class="slab">
    <div class="face cover">
      <div class="end">
        <h1 class="st">Your whole business, read.</h1>
{LINES}      </div>
    </div>
    <div class="face side" aria-hidden="true"><span class="st v">Your whole</span><span class="st v">business,</span><span class="st v hot">read.</span></div>
  </div>
</section>
'''

WWD_C = f'''<!-- screen one: the reader. The quiet face leads and the stencil is withheld until the close. The full stop is the studio's flame plate, turning; a thin orange line reads the title once on load -->
<section class="page-hero-t reader" aria-label="Your whole business, read." data-reader>
  <div class="end">
    <div class="tw"><h1 class="rd">Your whole business, read<span class="stop"><span class="dot">.</span><span class="mark3d flame" data-mark3d aria-hidden="true"><img class="mark3d-fallback" src="media/fsi-flame.svg" alt="" width="320" height="320"></span></span></h1><i class="readline" aria-hidden="true"></i></div>
{LINES}  </div>
</section>
'''

def head(html, v):
    html = html.replace('<link rel="stylesheet" href="mark3d.css">', f'<link rel="stylesheet" href="mark3d.css">\n<link rel="stylesheet" href="type-base.css">\n<link rel="stylesheet" href="type-{v}.css">')
    html = html.replace('<script src="mark3d.js" defer></script>', f'<script src="mark3d.js" defer></script>\n<script src="type-{v}.js" defer></script>')
    html = re.sub(r'<body( class="([^"]*)")?>', lambda m: f'<body class="{(m.group(2)+" " if m.group(2) else "")}type-{v}">', html, count=1)
    return html

def cut(html, start_marker, end_marker, new):
    i = html.index(start_marker); j = html.index(end_marker, i) + len(end_marker)
    return html[:i] + new + html[j:]

# home A: the hero and the Heritage film screen fold into one scene
a = cut(home, '<!-- screen one: the line -->', '</section>\n\n<!-- screen three: Chhaya -->', HERO_A + '\n<!-- screen three: Chhaya -->')
(W/'index-type-a.html').write_text(head(a, 'a'))
b = cut(home, '<!-- screen one: the line -->', '</section>\n', HERO_B)
(W/'index-type-b.html').write_text(head(b, 'b'))
c = cut(home, '<!-- screen one: the line -->', '</section>\n', HERO_C)
# C: DARE lands on the film and stays its word, so the film screen carries no second picture word
c = c.replace('  <div class="word st" aria-hidden="true">Work</div>\n', '', 1)
(W/'index-type-c.html').write_text(head(c, 'c'))

for v, blk in (('a', WWD_A), ('b', WWD_B), ('c', WWD_C)):
    h = cut(wwd, "<!-- screen one: the page's line", '</section>\n', blk)
    (W/f'what-we-do-type-{v}.html').write_text(head(h, v))
print('built six pages')
