# NAZAR R16: the immersive journey, read live, for the FlowStãte Impact site

Written by Nazar, the taste scout, 31 October 2026. Salvage run: the first run was killed at its 30 minute limit after gathering; this note is built from that run's transcript (31 sites fetched, 30 screenshots taken, 7 case studies read) plus four new lookups. Reads for Nadir, the digital director. Nothing here ships as copy.

How to read the labels. LOOKED AT means I opened the page or a screenshot of it. READ means I read a case study or the page's own code (the HTML) and did not see the page. MOVING means I saw it move; I saw NOTHING move this run, because the headless browser on this Mac has no graphics card path, so every 3D site gave me its loader, its cookie wall or a "browser not supported" screen. Every motion judgment below is therefore from stills, markup and case studies, and says so. RECALLED means memory, not a find, and it never counts.

Date read for everything below: 31 October 2026.

---

## 0. What moved since the eye file of 4 October

The 4 October eye file was a print and branding reading (the hand-drawn authenticity cycle). For the web, since then:

- "Immersive journey" is now the caption on nearly every Awwwards Site of the Day: Santioni Spirits (5 Oct), Belgrade Arbor (17 Oct), Cartier Le Choeur des Pierres (20 Oct), Davaris Textiles (nominee 30 Oct), Navtec (nominee). The word itself is the median. The move has to be ours; the label cannot be.
- HOLD TO ADVANCE is going median fast. Count this run: 5 (Santioni Spirits, Why Zero, IVRESS, Trionn's hold-to-blast, Collins's site with 11 "hold" hits in its markup). Six months ago it was one site.
- THE COUNTER LOADER (000 to 100 before anything shows): 5 this run (Lusion 000, Trionn 100, Immersive Garden 51, IVRESS 00%, Active Theory). Refuse on sight; it is the WebGL house's handshake and tells a buyer nothing.
- WebGPU arrived as a shipping path: Three.js's WebGPU renderer with a WebGL fallback, shaders written once in TSL (Three.js Shading Language) and compiled to both. Utsubo's IVRESS (FWA Site of the Month, May 2026) is the proof piece. Exhibita's stack page: "expect the visual weight of award-winning 3D to increase noticeably as this pattern spreads."
- GSAP is on 16 of the 31 sites winning this month (52%); WebGL on 13; 3D on 10; Three.js on only 7; Webflow on 7 (Exhibita, exhibita.design/stack.html, READ). The tooling floor has risen; award tier no longer implies a bespoke build. What separates tiers is "what gets written into the materials", the shader work, not the library.
- Sound as a narrative layer, not ambience (Exhibita names Immersive Garden's Cartier build and Resn). The gate is still the unmute click; whoever solves that gate owns a sense of place others cannot match visually.
- Native CSS scroll-driven animation (animation-timeline: view()) now does entry reveals, progress and pinning with no JavaScript and automatic reduced motion. Not for 3D camera sequences, but it is the free option for everything below the hero.

---

## 1. Journey sites, read live

Each: address, maker, what they DID (the one mechanic), the transition grammar, where 3D sits against real film and flat type, how a person knows where they are, what it costs to run, and the principle we could take. Never the look.

1. Santioni Spirits, The Notturno Experience, santionispirits.com. Maker: Active Theory, sound by plan8. READ (Utsubo guide; the Awwwards page refused the scraper). FWA of the Month August 2026, Awwwards SOTD 5 Oct 2026. DID: treats the viewport as a comic panel: black and white ink, one spot colour, hand-lettered narration boxes placed where a comic would put them, a rough paper border instead of a web container. Progression is HOLD to advance, not scroll; the audio builds against your hold. The product barely appears until the story is done. 3D sits inside drawn panels; type is hand-lettered, part of the picture. Wayfinding: the panel sequence itself. Cost: a hold gate kills casual scrolling, a known trade. PRINCIPLE: make the reader apply pressure to move the story, and let sound live in that pressure. Felt: envy at the nerve of hiding the product.

2. IVRESS, brand.ivress.co.jp. Maker: Utsubo (their own piece). READ, LOOKED AT (loader only). FWA Site of the Month May 2026. DID: seven scenes that LOOP, the last returning you to the first; "the cycle is the meaning." Every transition is continuous camera and material change, never a cut, because a loop with a visible seam fails. Shaders authored once in TSL for WebGPU and WebGL. Wayfinding: none needed; you can leave anywhere without missing an ending. Cost: seven scenes breaks the five-scene rule; they argue the exemption. PRINCIPLE: budget transitions as scenes in their own right, not as gaps. Felt: the loop idea held me longer than any single scene described.

3. Why Zero, why.zero.university. Maker not found (an education project, not an agency). READ; markup shows canvas, WebGL, two "hold" gates. Awwwards SOTD 7 Sept 2026. DID: game structure for an argument: scroll drives a 3D parallax, sections UNLOCK rather than appear, some transitions need a hold, an XP counter accumulates in the corner, the waitlist form is presented as a quest. Wayfinding: the XP counter. PRINCIPLE: progress made visible as a score the visitor earns. REJECT for us: Trying Too Hard for a buyer with a budget line to sign.

4. Where Worlds Take Shape, paodao.fr. Maker not found (personal portfolio). READ. DID: abandons scroll; you walk a character across an open landscape with mouse, keys, touch or gamepad; procedural grass, parallax occlusion mapping for surface depth without geometry cost, small mini-games. Two visitors leave with different impressions. Cost: you lose control of first impressions. PRINCIPLE: exploration proves range; sequence proves argument. Ours is an argument. REJECT as a whole, TAKE the lesson.

5. Ponpon Mania, ponpon-mania.com. Makers: Justine Soulié (art director) and Patrick Heng (creative developer), two people, no studio. READ. Awwwards Site of the Month October 2025. DID: chapters structured like tracks on an album; physics applied to 2D artwork, no 3D; runs on mid-range phones. PRINCIPLE: "physics applied to 2D artwork buys more perceived life per kilobyte than a 3D scene." This is the golden pair 112 in one sentence: a mix of 3D and 2D, never 3D alone.

6. Oryzo, oryzo.ai. Maker: Lusion (Bristol). READ, LOOKED AT (blank green first paint). Awwwards Site of the Month April 2026. DID: one hero object (a cork coaster, as a joke about launch sites) rendered live with real weight and inertia; scroll moves the CAMERA through true depth rather than sliding flat layers. Every frame is about the one object. PRINCIPLE: sell one object properly; one object with mass beats a crowded world. This is the mechanic closest to our plate.

7. Shopify Editions Spring 2026, shopify.com/editions/spring2026. Maker: Shopify's in-house team (not credited further). LOOKED AT (a real still landed: a particle forest in violet and green with the word "Everywhere" set three times, one mirrored, one flipped). DID: each section is a staged beat with entrance, hold and exit; type scatters into particles and reforms; depth-layered panels. 150 feature updates read as one continuous piece. Wayfinding: the section as beat. PRINCIPLE: treat scroll as the narrative device so a dense page never becomes a wall of cards. Felt: the mirrored word was the one thing on 30 screenshots I looked at twice.

8. Hubtown, hubtown.co.in. Maker: Unseen Studio (London). READ, LOOKED AT (black screen, one dot: the loader). Awwwards SOTD June 2026. DID: a single lit 3D monolith over a dark reflective ground for a 40-year Indian property developer; the cursor uncovers detail in geometry and light (mouse-reveal). PRINCIPLE: one confident centrepiece dignifies an unglamorous category. Respect note: a Mumbai developer given the Cartier treatment, read as capability, not exotic.

9. Sleep Well Creative, sleep-well-creatives.com. Maker not found. READ, LOOKED AT (cream loader). Awwwards SOTD January 2026. DID: hand-drawn art direction on a Three.js stage; each scroll beat advances words and picture together, "an animated editorial". PRINCIPLE: editorial pacing inside a 3D scene; long-form that people finish.

10. Explore Primland, explore.ownprimland.com. Maker not found. READ, LOOKED AT (cookie wall only). Awwwards SOTD February 2026. DID: real terrain rendered in Three.js with fog; the camera glides over it on scroll. PRINCIPLE: a place made explorable from the air. For us: Dhaka and London are two places; a flythrough is the literal read, so refuse the look and keep "the camera travels between two grounds".

11. Cartier Watches and Wonders 2026, cartier.com/en-fr/watchesandwonders. Maker: Immersive Garden (Paris), as credited by Utsubo; Immersive Garden's own home page lists Watches and Wonders 24, Cartier in Time (with Jake Gyllenhaal), Cartier End of Year 23, Louis Vuitton VIA, Dioriviera, Longines Spirit Zulu Time (immersive-g.com, READ live this run). LOOKED AT (cookie wall). DID: six self-contained 3D alcoves, one per watch, scrolled like museum rooms; a score carried as a narrative layer. PRINCIPLE: one room per object, and the hand-over between rooms IS the design.

12. Cartier, Le Choeur des Pierres, cartier.com/en-fr/lechoeurdespierres. Maker: makemepulse (Paris), with Alexandre Saad and Alexis Demachy credited (awwwards.com/sites/cartier-le-choeur-des-pierres, READ). Awwwards SOTD 20 Oct 2026, 7.51. Palette sampled: two colours, #fafafa and #000000. DID: gemstones reveal the inspiration, craft and gouache paintings behind each piece. Two-colour discipline on a high jewellery site. PRINCIPLE: the richest subject on the fewest colours.

13. Lando Norris, landonorris.com. Maker: RECALLED as Lusion (the search to confirm it was refused by every engine this run; treat as unconfirmed). Awwwards SOTD 17 Nov 2025, 8.18, creativity 8.71, accessibility 7.00, the lowest of its marks (exhibita.design/site/lando-norris.html, READ). Palette sampled: two colours, #D2FF00 on #111112. LOOKED AT (dark olive first paint, the wordmark and a STORE button, a loader). PRINCIPLE: acid on near-black, two colours only, is what Gen Z nerve looks like when it costs money.

14. Trionn, trionn.com. Maker: Trionn (studio, own site). READ in depth (Codrops, 15 July 2026), LOOKED AT (loader at 100). Built over FOUR MONTHS. DID: hero symbol in Three.js with magnetic hover, weld sparks, hold-to-blast where nearby UI vibrates as the charge builds; a helix of service cards bent in 3D and scrubbed by scroll; SVG strokes that become pluckable strings; procedural, audio-reactive fog; a depth-mapped portrait behind a curtain. Stack: GSAP with ScrollTrigger and SplitText, plain Three.js (they refused React Three Fiber to own the render loop), Lenis driven from gsap.ticker, Web Audio synthesising sounds at runtime, Next.js. Reduced motion SLOWS the hero rotation rather than stopping it; gsap.matchMedia gives phone and desktop separate animation logic. PRINCIPLE: every section its own system, one shared scroll driver. REJECT for us: eleven ideas on one page is the WebGL house showing its toolbox; one loud note per screen is our law.

15. Joseph Santamaria's portfolio, joseph-san.com. Maker: Joseph Santamaria, one person, Ecuador. READ (Codrops, 28 April 2026). Three months plus three weeks of polish, after three abandoned versions. DID: each section is a scene; scroll maps to camera, object animation and reveal timing; GSAP Observer unifies mouse, touch and trackpad "so the whole site feels like a single camera take"; mid-site the scroll MODE switches from free scroll to snap blocks for a four-beat sequence; opening a project unfolds a tesseract; the soundtrack is MUFFLED by a lowpass filter when a project opens, "as if you stepped through a door into an adjacent room". 144 FPS on good hardware, steady on mid-range phones via KTX2 textures, GPU instancing, Draco, low-resolution shaders for the atmosphere passes, frustum culling instead of LOD tiers. PRINCIPLE: the muffled sound on a page change is the cheapest "you are now somewhere else" I have read all year. Felt: that one line made me want to build it tonight.

16. Igloo Inc, igloo.inc. Maker: Igloo (Tokyo and Berlin). LOOKED AT: "Seems like WebGL2 is not supported by your browser", a grey wall. RECALLED mechanic (a frozen 3D world you scroll through), not seen. Cost named: a hard wall for any visitor without WebGL2. Two of the famous houses (Igloo, Active Theory) show a wall or a "browser not supported" screen before anything; our buyer on a locked corporate laptop must never meet that.

Studio sites that sell taste the way we do (LOOKED AT as stills):

- Koto, koto.studio. A muted full-bleed loop fills the hero (absolute, inset-0, object-cover, preload auto) with "Play showreel" over it and "We're Koto / The Creative Company" bottom left; five cities each shown with the LOCAL TIME and the album cover currently playing in that office. Rive on 16 elements. PRINCIPLE: the studio's two or five places made present by time and what is on. Our Dhaka and London could carry that honestly.
- Porto Rocha, portorocha.com. The home page is laid out like a desktop operating system: a window with the studio's own clock, a stack of project "files" on the left, news tiles below, a Nike RUN Bangkok banner as the open window. PRINCIPLE: a metaphor that explains the firm (an operating system) carried by the page's structure, not by decoration. Closest to what we sell (the client keeps a system).
- Antinomy, antinomy.studio. One line of text top left, then a huge headline where letters are swapped for other weights and a small running mascot ("Super fast Motion for every team"). PRINCIPLE: character inside the type, one substitution per word.
- Exo Ape, exoape.com. A photograph (a Venice dome) with one enormous word "Digital" and "Scroll to explore". Vimeo progressive 720p loops below. REJECT: Dated; the big-word-over-photo hero is the 2022 median.
- Buck, buck.co. White, two project tiles, a one-sentence description, Mux streaming for film. REJECT for us: Blends In; the tile grid is boxes.
- Makemepulse, makemepulse.com. Three serif words stepped down the hero with two tiny annotations ("we turn aesthetics into experiences", "tech that's light as air"); the only site of 31 with prefers-reduced-motion in its markup. PRINCIPLE: the stepped headline with footnotes; the reduced-motion care.
- Hato, hato.co. A numbered index of work (817, 167, 763) as the whole home page, fading down the list. PRINCIPLE: the archive as a ledger. Not ours yet; we lack the archive.
- Darkroom Engineering, darkroom.engineering. Red monospace at display size on black, "WHERE THINGS GET DEVELOPED", a manifesto dropdown, a neon Oreo and BTS frame below. They wrote Lenis. PRINCIPLE: one typeface at two sizes carries the whole personality.
- Lusion, lusion.co. Hero: "We create 3D visual storytelling and interactive web experiences", a "Play Reel" button, project titles that explode into letters, a labs link (labs.lusion.co). Their own current work: Oryzo, Atlas Motion, Devin AI, Of The Oak, Everswap, Porsche Dream Machine, Synthetic Human. Their lines "We do not chase trends or produce work that looks like everyone else" sit next to a counter loader. Noted.

Gen Z nerve that still reads expensive (LOOKED AT as stills):

- Corteiz, crtz.xyz. Black ground, a hand-drawn globe mark, 7-point caps nav down the left, six garments photographed flat with no model, prices in caps. Nerve by refusal: nothing is sold to you.
- Palace, palaceskateboards.com. One figure in a puffer on a warm gradient, lookbook names fading behind, a single "View lookbook". No grid.
- Lando Norris as above: acid #D2FF00 on #111112, two colours.
- Nothing, nothing.tech. Dot-matrix wordmark and type (cookie wall covered the rest).
- Riff Raff Films, riffrafffilms.tv. A hand-lettered logo against a strict thumbnail grid and a 9-point mono nav; 607 video tags and a 9.5 MB first HTML, the heaviest page of the run.

---

## 2. Showreel behind the first screen

What each does to keep the words readable and the page light, read from the markup and stills.

1. Koto, koto.studio (Koto, London). Full-bleed muted loop, autoplay, playsinline, preload auto, object-cover; a Vimeo poster image as first paint; words bottom left over it; "Play showreel" opens the full cut. Readability by grade and placement, no scrim visible.
2. Cuberto, cuberto.com (Cuberto, Moscow). THREE FILES: showreel/short.mp4 for the hero loop, short-sm.mp4 for small screens, full-1440-60.mp4 loaded only on click (preload none). Autoplay muted loop playsinline. The cleanest weight discipline of the run.
3. Stink, stink.co (Stink Films and Stink Studios, London). Two side-by-side panels, each an autoplay muted loop with its own poster JPG (stink-films.jpg, stink-studios.jpg), the firm's one line in a serif above on black. The reel is split by business, not shown whole.
4. Iconoclast, iconoclast.tv (Iconoclast, Paris). Full-bleed director film with a poster frame as first paint, Vimeo 1080p progressive file, title lower right in caps, a numbered index 1 to 10 along the bottom as the wayfinder. LOOKED AT: a hospital hand on a bed in green, the words readable because the frame is quiet.
5. Antinomy, antinomy.studio. Showreel with a poster (260624_showreel-mobile.jpg), muted loop, preload none: nothing downloads until needed, opacity fades in.
6. Tendril, tendril.ca (Tendril, Toronto). A self-hosted 2026_tendril_reel.mp4 plus a Vimeo embed with background=1 as fallback; the hero still shows a 3D dark room with a watch render.
7. Riff Raff, riffrafffilms.tv. Loops at 854 by 480, preload none, opacity 0 until loaded; many small loops rather than one big one.
8. Exo Ape, exoape.com. Vimeo progressive_redirect 720p renditions, loop muted, no hero reel (photo hero).
9. Buck, buck.co. Mux streaming with a thumbnail poster at time=0.

PRINCIPLES for our reel behind the hero (mechanics, not looks):
- Cut a SEPARATE 12 to 20 second loop from the 4 minute 45 second Highlight Reel 2025, and a second file for phones (Cuberto's three-file method). The full reel is never the hero file; it streams on a click (Vimeo progressive or Mux).
- Poster frame as first paint, so the hero is wow on load even before a byte of video (golden pair 114).
- Muted, playsinline, loop; preload none below the fold, auto only for the hero.
- Readability by GRADE and by MASK, never by a grey scrim: grade the loop toward near-mono with the orange kept, and let the film show only THROUGH the cut letters of the plate at first. No site I looked at masks a reel behind cut type; that is ours.
- Reduced motion: show the poster, not the loop (Trionn slows rather than stops; for a film, the still is the honest fallback).

---

## 3. How the expensive ones are actually made

Sourced lines only; recall marked.

- Team shape. Two people made Ponpon Mania (an art director and a creative developer; Utsubo guide). One person made joseph-san.com in three months plus three weeks (Codrops, 28 April 2026). One studio made Trionn over four months (Codrops, 15 July 2026). Cartier's pieces come from Paris studios of ten to forty (RECALLED; headcounts not read this run).
- Order of work (Utsubo's four phases, READ): Strategy and story (what should visitors feel, learn, do) · Concept and STORYBOARD, "not wireframe", scene by scene, with key interactions PROTOTYPED early and sound direction planned · Development · Launch and amplify. Their rules: five scenes maximum for an arc that ends on a call to action; two to three minutes of experience; "if there's no interaction, make a video."
- Stack (Exhibita's four layers, READ): Render in Three.js over WebGL, migrating to WebGPU · Choreograph with GSAP ScrollTrigger · Feel with Lenis, "the single cheapest upgrade in this stack", the weighted scroll that reads as expensive · Shade by writing the surfaces yourself, "the pixel-level material work that separates tiers". Framework, CMS and host are interchangeable; only 30% of winners name one.
- Current libraries seen in the markup of the 31 sites: Lenis (Immersive Garden, makemepulse, Darkroom, Partizan, Cuberto), Rive (Koto 16, Partizan 22, Buck 14, Darkroom 5), Three.js (Riff Raff, Buck, Koto, makemepulse, Darkroom), Next.js (Koto, Antinomy, Buck, Darkroom, Riff Raff), Nuxt (makemepulse, Immersive Garden, Exo Ape, Somesuch, Collins), Mux (Buck, Collins), Vimeo progressive (Somesuch 114, Iconoclast 60). React Three Fiber: Darkroom only. Theatre.js and Spline: none seen in this set. GSAP's plugins are free since the Webflow acquisition (RECALLED; the search to confirm was refused).
- Performance disciplines that a buyer never sees (joseph-san, Codrops): KTX2 compressed textures decoded on the GPU, GPU instancing for repeated geometry ("30 FPS to 144"), Draco for GLTF, low-resolution render targets for atmosphere passes composited back, frustum culling on a camera-pathed scene instead of LOD tiers, GSAP Observer to unify mouse, touch and trackpad.
- Phone and reduced motion: Trionn slows motion under prefers-reduced-motion and splits phone logic with gsap.matchMedia; makemepulse is the only home page of 31 whose markup carries prefers-reduced-motion; Lando Norris scored 7.00 on accessibility, lowest of its six engineering marks (Exhibita). Igloo and Active Theory show a wall when WebGL2 is missing.
- Time and budget, where stated: Utsubo, "Simple scroll narrative $15,000 to $30,000; rich storytelling site $30,000 to $70,000; full 3D explorable environments $150,000+." Trionn: four months. Joseph Santamaria: three months plus three weeks. BRIX Templates' agency list (search result, not opened): "Cula, an 8-week interactive build running on Three.js and GSAP", and agency profiles "starting at $25,000" as the floor. Junca Studio (search result): Framer sites in 4 to 6 weeks; immersive on Astro or Next.js with Blender and Three.js, no price.
- Weight, measured from first HTML this run: Riff Raff 9.5 MB (607 video tags), Buck 734 KB, Koto 478 KB, Giant Ant 411 KB, Somesuch 373 KB, Immersive Garden 233 KB, makemepulse 216 KB, Darkroom 186 KB, Lusion 60 KB (everything loads after). Our target: first HTML under 150 KB and a poster before any script.

---

## 4. Gen Z for a serious studio: nerve versus slang

What read young AND expensive on the pages I looked at: restraint plus ONE rude move.
- Two colours only, one of them acid (Lando Norris, #D2FF00 on #111112; Cartier's two-colour palette is the same discipline in black and white).
- One typeface at enormous size doing all the personality (Darkroom's red monospace; Antinomy's swapped letters).
- A hand-drawn mark against machine type (Riff Raff's lettered logo on a strict grid; Corteiz's globe).
- The product or film shown without a model, a grid or a sell (Corteiz flat garments, Palace's single figure).
- The firm's places made present by local time and what is playing there (Koto).

What read cheap or Trying Too Hard, seen in the trend listicles the search returned (gleamstudio, Envato, Kittl, expandbuzz, boundev, all 2026): "anti-design", "ugly branding", "childlike anarchy", Y2K chrome, stickers, neon gradients, puffy textures. Three listicles in one month calling "ugly" the Gen Z move means it is the median by Christmas. The eye file's 4 October line holds: take the mechanics, refuse the argument.

For us: Gen Z nerve is the cut (words cut out of the plate, the film behind), the acid note kept to one orange, the refusal to explain, and the local clocks of Dhaka and London. Never slang, never a sticker, never a neon gradient.

---

## 5. Where the references land against our golden pairs

- Pair 112 (not full 3D, a mix of 3D and 2D, realistic): Ponpon Mania and Sleep Well Creative are the proof that 2D with physics and drawing in a 3D stage reads richer per kilobyte than full 3D. Oryzo is the one-object exception that earns full 3D. Trionn and paodao.fr are what "more 3D" looks like when it is 3D alone: a toolbox and a game. Asif's "more 3D" is read as one 3D object (the plate) with weight, real film behind it and flat type cut through it. Never a 3D world.
- Pair 114 (hero wow on load): every WebGL house fails it with a counter loader. Koto, Iconoclast and Stink pass it with a poster frame of real film. We pass it with the plate and the poster.
- Pair 116 (bold from the studio's own films): Iconoclast, Stink, Riff Raff and Koto all lead with real film; none cut it through type. Ours does.
- Pair 118 (UK buyers first): no counter loader, no WebGL wall, a first HTML under 150 KB, a poster before script, the full reel on a click.

---

## 6. THREE RANKED DIRECTIONS for our home journey

Each: one sentence of idea, three lines of mechanic, where the reel sits, and why only we could own it (swap in another studio's name and it fails).

### 1. THE PLATE IS A WINDOW (recommended)
Idea: the black combed-plaster plate becomes a single 3D object with real weight, and the Highlight Reel plays behind it, seen first only through the cut letters WE MAKE THE WORK / WILL NOT / DARE, so the film is the light source of the page.
- Mechanic 1: one object, one camera. The plate is a Three.js mesh with the combed pattern as a displacement and normal map; the cut letters are true holes (CSG or an alpha mask on the plate material); the reel is a video texture on a plane behind it. Scroll moves the CAMERA toward the plate (Oryzo's depth scroll, not sliding layers); the holes widen as you approach until the film fills the frame; the plate's edge becomes the frame of the first work chapter.
- Mechanic 2: chapters hand over by passing through a letter. Each work chapter is entered through one cut letter (the D of DARE for films, the W of WORK for brands, the N of NOT for the kept AI systems); the camera's path is fixed, so culling is exact and the phone runs it. Between chapters the reel's sound is muffled by a lowpass filter (joseph-san's door), so the reel is always "in the next room".
- Mechanic 3: light and type. Orange is only the rim light on the plate's cut edges and the one state mark; the reel is graded near-mono so white type over it stays legible without a scrim. Reduced motion: the poster frame behind a static plate. First paint: the poster and the plate image, no counter.
- Reel: BEHIND the hero, a 15 second muted loop cut from the 4:45, phone file separate; the full reel streams on a click in the films chapter.
- Only ours: the comb pattern is our mark, the cut words are our line, the film is ours from Dhaka. With another studio's name there is no plate, no line, no film.

### 2. TWO CITIES, ONE TAKE
Idea: the whole visit is a single camera take along the Dhaka to London axis, through a corridor built from our own film frames standing as planes in depth, with both cities' live clocks as the wayfinder.
- Mechanic 1: 2.5D corridor. Stills and short loops from the reel are planes placed in Z depth (Shopify Editions' section-as-beat, Ponpon Mania's 2D-with-physics economy); the camera travels down the corridor on scroll with GSAP Observer unifying input; planes turn to face the camera as it passes, each one a chapter beat with entrance, hold, exit.
- Mechanic 2: the two clocks. Koto's local-time device becomes the navigation: Dhaka time and London time sit fixed in the bar; the corridor's light shifts from one city's hour to the other's as you travel; the work pages are sorted by which city the work was made in.
- Mechanic 3: the hand-over. Each chapter ends on a hairline, two words and the next title (R15 move 3); the plate from direction 1 appears once, at the end, as the door back to the start (IVRESS's loop without the seam problem, because our loop is the axis itself).
- Reel: the GROUND FLOOR. The muted loop plays beneath the corridor, visible in the gaps between the frame planes, full frame at the hero for the first screen only.
- Only ours: the axis is Dhaka and London, the frames are our films, the clocks are our offices. A Paris studio's version is a travel site.

### 3. HOLD TO DARE
Idea: the hero word DARE is a hold target; press and hold and the plate's combed lines part like shutters to reveal the reel full frame WITH sound; release and it closes back to type.
- Mechanic 1: the hold is the unmute gate. Holding is the user gesture browsers require for sound, so the reel plays with its soundtrack only while held (Santioni's pressure, solving Exhibita's "interaction to unmute" problem in one move). On touch, the hold is a thumb on the word.
- Mechanic 2: the comb parts. The plate's combed ridges are instanced strips (GPU instancing); on hold they rotate on their long axis like louvres with a stagger from the pressed letter outward; on release they close. No new geometry, one shader uniform.
- Mechanic 3: the same hold opens every case. Each work page's title is held to open its film; scroll moves between cases; nothing else on the site asks for a hold, so the gesture stays rare and meaningful.
- Reel: BEHIND the louvres, full frame with sound on hold, poster at rest.
- Only ours: DARE is our word and the comb is our mark. With another studio's name there is nothing to hold.

Why this order. Direction 1 is the only one that satisfies all four golden pairs at once and is within a four-to-eight-week build for one creative developer plus Nadir: one object, one video texture, one camera path. Direction 2 is the biggest journey and the most expensive (many planes, two grades, a loop); it is the one to grow into after 1 ships. Direction 3 has the most nerve and the clearest Gen Z read, but hold-to-advance counted 5 this run and is going median; by the time we ship it the gesture will be the WebGL house's handshake, and a gate before the first screen fails pair 114 (wow on load) for a UK buyer who does not press.

---

## 7. What I did not see moving, and what is recall

- NOTHING was seen moving. Headless Chrome on this Mac gave loaders, cookie walls and WebGL walls on every 3D site; the SwiftShader fallback was tried and gave the same. Every motion judgment above comes from stills, markup and case studies and is labelled so. Nadir should open directions 1 and 3's nearest references (oryzo.ai, santionispirits.com, joseph-san.com) in a real browser before building, and judge the motion himself.
- RECALLED, unconfirmed: Lusion as the maker of landonorris.com; GSAP's plugins free after the Webflow acquisition; Igloo's frozen-world mechanic; Paris studio headcounts.
- Not read: Resn, Locomotive, Dogstudio and Unseen's current case pages (Resn and Locomotive returned near-empty HTML; Unseen's loader only). Immersive Garden's own home page was read live and its work list is in section 1.
- The Awwwards Santioni page refused the scraper (antibot); its mechanics come from Utsubo's guide.
- Searches were degraded all run (Brave, DuckDuckGo and Google CSE all refused); the trend listicles in section 4 are search snippets, not opened pages.
- Credits corrected from the first run's assumption: Cartier Le Choeur des Pierres is makemepulse's, not Immersive Garden's.
