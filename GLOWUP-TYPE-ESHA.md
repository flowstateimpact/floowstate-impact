# THE TYPE COMPOSITION SYSTEM FOR FLOWSTATEIMPACT.COM
Esha, typography, 25 Oct 2026. For Nadir to build, Anwar to judge, Asif to pick.
Faces stay: Bespoke Stencil 700 (display) and General Sans 400 and 500 (text). No new face. Every word of copy stays as it is; only sizes, breaks, faces per word, and placement change.
Numbers were measured off glow.css, glow-a.css and the r6 renders (a-1440-full, a-390-full, wwd-1440-full, wwd-390-full). Screen taken as 1440 by 900, 1920 by 1080, 390 by 844.

## 1. WHY THE HEADLINES READ MASSIVE (six causes, each measured)

1. The ink fills the screen. Home tagline at 12.6vw is 181px at 1440, line-height .82 gives 149px a line; four lines (one at .62em) stack to 581px, which is 65 percent of a 900px screen. At 1920 it is 242px type and 775px of block, 72 percent of the screen. Size in vw grows without a ceiling, so the wider the monitor the more literally massive it gets. There is no clamp anywhere on the site.
2. A paragraph set at poster size. Poster scale belongs to one to three words. The tagline is 8 words over 4 lines; the longest line, WILL NOT DARE, is 13 characters, WE MAKE is 7. The eye reads a 7 character line as a shape, not a sentence, and four shapes in a column is a wall.
3. No air between lines. At line-height .82 the gap between one line's baseline and the next cap top is about .12em, 22px at 181px. On a stencil the cuts inside the letters are the only white the face owns; when the line gap is of the same order, cuts and gaps fuse and the block reads as one perforated slab. The r6 render shows exactly that.
4. Tracking squeezed on a face that needs air. letter-spacing −.03em takes 5.4px out of every letter pair at 181px. A stencil already has its stems broken; close the sides too and the counters close first, the thing my own gate rule says fails at any size.
5. No middle voice, so the top shouts. Sizes on the home at 1440: 12, 16, 32, 50, then 101, 144, 173, 181, 432. Five settings above 100px and nothing between 50 and 101. The who block at 12px sits beside 181px type, a 15 to 1 jump with no step. The inner title (144px) sits against its 16px lines, 9 to 1. A scale with no middle makes every display line feel like the biggest thing on the page, because next to its neighbours it is.
6. The loud note repeats. After Anwar's fix the stencil still runs at 7vw or more in four zones on the home (tagline 181, WORK 432, BRAND 144, six service words at 101 each, GROWING GOOD 173). Six words at 101px is a second poster. On what-we-do the title is 144px and the close is 150px: the page opens and ends at the same volume, so there is no arc, only level.
Phone: 17vw is 66px on 390, five lines, 267px, 32 percent of the screen, and the stencil's cuts at 66px are about 2px wide, so the face loses its one idea exactly where most people will meet it.

Premise challenged: bold does not mean big. Bold is contrast. The three defaults I refused: shrink everything 20 percent and call it done; an italic serif accent word; a giant menu or marquee hero.

## 2. THE SCALE (clamp, with the value it gives at 390, 1440, 1920)

| Level | Role | clamp | 390 | 1440 | 1920 | line-height | tracking | face, case |
|---|---|---|---|---|---|---|---|---|
| L0 Whisper | who block, captions, labels | 12px fixed, 13px above 1800 | 12 | 12 | 13 | 1.4 | +.027em (labels +.06em caps) | General Sans 400, 500 for the bold line |
| L1 Text | paragraphs | clamp(16px, 15px + .1vw, 17px) | 16 | 16.4 | 17 | 1.5 (24px) | 0 | General Sans 400 |
| L2 Lead | the lines beside a title, intros | clamp(18px, 16.5px + .26vw, 22px) | 18 | 20 | 21.5 | 1.4 | 0 | General Sans 400 |
| L3 Heading | section heads (Anwar's text-face role) | clamp(30px, 24px + 1.5vw, 54px) | 30 | 46 | 53 | 1.04 | −.02em | General Sans 500, sentence case |
| L4 Word | service words, crop words at reading size | clamp(40px, 12px + 5vw, 96px) | 40 | 84 | 96 | .9 | 0 (+.005em on phone) | Bespoke Stencil 700, caps |
| L5 Title | inner page h1 | clamp(52px, 10px + 7.1vw, 128px) | 52 | 112 | 128 | .9 | −.01em | Bespoke Stencil 700, caps |
| L6 Poster | the home tagline only | clamp(58px, 17px + 8vw, 148px) | 58 | 132 | 148 | .88 | −.01em | Bespoke Stencil 700, caps |
| L7 Picture word | WORK, BRAND running off an edge, aria-hidden | clamp(160px, 26vw, 480px) | 160 | 374 | 480 | .8 | 0 | Bespoke Stencil 700, one per screen |

What this does to the complaint: the tagline drops from 181 to 132 at 1440 (27 percent) and from 242 to 148 at 1920 (39 percent). WE MAKE THE WORK fits one line at 132px inside 1360px, so the tagline is three lines, not four: 132 × .88 × 2 + 66 = 298px, 33 percent of the screen instead of 65. Rule: display type covers at most 35 percent of a first screen's height at 1440 and 30 at 1920.

Baseline: unit 8px. Text 16 on 24, Lead 20 on 28, Heading 46 on 48, Word 84 on 76 (a 4px grid at display is fine, the rhythm is carried by the 24px text line, not the poster). Cap height of Bespoke Stencil I could not read off the woff2 without a shell; Nadir confirms it in one line and sets the display margins from cap top, not em box, so the gap above a stencil line is real white and not font metrics.

## 3. HOW THE TWO FACES SIT TOGETHER

- Volume ladder. Stencil owns L4 and above, the text face owns L3 and below. One exception per page, chosen on purpose: the text face may rise to L5 when the composition wants the quiet voice to lead (W2 below), and then the stencil is withheld until the close.
- Scale contrast. Two settings on one screen differ by at least 1.6 times, or are the same size. The current 101, 144, 173, 181 are near-sames and read as a shouting match. Two stencil settings on one screen differ by 2 times or more.
- Weight contrast. Stencil 700 against General Sans 400 at display. General Sans 500 lives only at L3 and in 11 to 13px labels. The 500 next to the 700 stencil at the same size is mud; never set them side by side at one size.
- Case. Stencil caps always. Text face sentence case always; caps only at L0 labels. Case is the second axis that keeps the pair a conversation, not a match.
- Tracking opens as size grows on the stencil (−.01 at display, 0 at Word, +.005 on phone), the reverse of the text face (−.02 at Heading, 0 below). The stencil needs the side air because its stems are already cut.
- Big type meets pictures: (a) a word that crosses a picture is cut by an edge (the fold, the frame, a subject in front), never floating whole; (b) it sits behind the subject or in front of empty ground, never across a face; (c) one L7 word per screen, aria-hidden, carrying no meaning the reader needs; (d) the text face never sits on a picture above 20px except the 12px caption voice; (e) the orange goes on one word per page and nothing else in the type.
- Mobile floor: the smallest stencil setting on a phone is 40px; below that the cuts fall under 2px and the face is a blurred bold.

## 4. THREE COMPOSITIONS FOR THE HOME HERO
Copy: "We make the work other studios will not dare" plus the who block. Orange on DARE in all three.

H1 THE PLATE (type as a cut sheet, Law 6: the letters live in z)
Feel: the work is behind the words. A stencil is a plate you cut once and spray through; here the Dhaka lane film plays behind a black plate and is seen only through the letter holes. The move: the letters are holes, not ink. Three lines at L6: WE MAKE THE WORK / other studios (General Sans 400, .5em, solid white, the only printed line) / WILL NOT DARE. DARE is the one word that is not a hole: solid orange, painted on the plate. Motion and 3D slot: on scroll the plate lifts away on a hinge at the top (perspective 1200px, rotateX to −18 degrees, then translateZ out), the film floods the screen, DARE is the last thing to lift. Build: CSS background-clip text over the video for the fallback, a WebGL mask for the real one. On 390: two lines at 58px plus the quiet line, the plate hinge still works. Risk: text in a mask has no selection; keep the real h1 in the DOM, visually hidden.

H2 THE LEDGER (Tschichold, the sentence crosses the screen on a diagonal)
Feel: hush, then the cut. The sentence whispers top left and shouts bottom right. Top left, under the nav: We make the work at L3 (46px, General Sans 400, sentence case, max 14ch). Mid screen right: other studios at L2. Bottom right, on the fold: WILL NOT DARE at L6, DARE cut by the fold and landing on the film as now. The who block moves to the bottom left corner, at L0, so the four corners each hold one thing and the eye travels the full screen to reach DARE. Motion and 3D slot: WILL, NOT, DARE are three plates at three depths (translateZ 0, −160px, +120px) with a 2 degree mouse parallax and a scroll parallax, so the line has physical thickness; the mark3d rig already in the footer is the same stack. On 390 the diagonal becomes a stair of three left-aligned steps, 30, 18, 58px. Ink at 1440: one L6 line, about 116px of poster against 581 today.

H3 THE SMALL LINE (withhold everything but one word)
Feel: threat held back. Posh is restraint with one extreme. The whole sentence sits on one line at L2 (20px, General Sans 400, white, centred on the vertical axis, left aligned to the margin), sharp, with DARE in orange. Behind it, in depth, the word DARE alone at L7 (374px), stencil, orange at 18 percent opacity, blurred 6px, drifting 2 percent on scroll, cut by the right edge. The one small line in front of one enormous soft word behind. The move: inverting the hierarchy; the only big thing is out of focus and the only sharp thing is small. Motion and 3D slot: the big DARE sits 600px back in perspective and sharpens to full orange as the user scrolls it toward the camera, arriving in focus exactly as the film enters. On 390 the back word is 160px and the front line breaks to two. Note for Anwar: this is the one of three that gives up the poster first screen he passed; it is here because it is the composition the category does not own.

## 5. THREE COMPOSITIONS FOR THE WHAT-WE-DO TITLE
Copy: "Your whole business, read." with the two lines and the audit link.

W1 THE COMMA (scale contrast inside one sentence)
Feel: the pause, then the verdict. YOUR WHOLE BUSINESS, at L4 (84px, two lines on 1440 if needed, one at 1920), then READ. at L6 (132px) on its own line, orange, the comma holding the beat between them. The 2 to 1 jump between two stencil sizes is the structure. The two lines at L2 sit right, bottom aligned to READ. Motion and 3D slot: READ. arrives 500ms after the first line; the four row pictures that already form the stair stand behind the title as four sheets in depth, and on scroll they turn one by one like pages being read, the title staying still. 390: 40px then 58px.

W2 THE READER (the quiet face leads, the stencil withheld)
Feel: calm authority. The firm that reads you does not shout. Title in General Sans 400 at L5 scaled to fit one line: Your whole business, read. is 26 characters, 92px at 1440 inside 1360 (clamp(44px, 2px + 6.25vw, 120px)), sentence case, tracking −.025em. No stencil on the first screen at all; the stencil appears first in the close, TAKE ONLY WHAT YOU NEED at L5, so the page has a quiet open and a loud end instead of the same volume twice. Motion and 3D slot: the full stop is the object: the FSI flame from mark3d sits in the stop's place at cap height, turning slowly; a thin orange reading line passes under the title left to right on load, the page reading itself. 390: 44px, two lines.

W3 THE SPINE (the title turned into the page's edge)
Feel: an object on the table, high-fashion poise. The title runs vertically up the left margin at L4 (84px), rotated −90 degrees, bottom to top, the full first screen height, stencil caps, like a book's spine; the two L2 lines sit at reading height beside it and the first picture (the Heritage lid) enters at the right already on the first screen, so the four rows hang from a spine. Motion and 3D slot: the title is the side face of a slab seen in perspective (rotateY 90 degrees at the left edge); on scroll the slab turns 90 degrees to face the reader and the title lays flat at L5 across the top as the first row heading appears. 390: the spine lies down to a horizontal L5 title at 52px; the rotation is desktop only.

## 6. OPEN TO THE CHAT, NOT ADDED
- Fontshare's Bespoke Stencil family has lighter cuts (Light 300 to Extrabold 800 are listed on its page, not verified on disk). A 500 Medium at L4 would give the service words the same voice at a lower volume and would do more against the "stencil everywhere" reading than any size change. Question for Asif, since it is a new file, not a new face.
- General Sans 600 Semibold for L3 on phones only, where 500 at 30px goes thin against 40px stencil words. Question, not added.
- Nadir reads the stencil's cap height from the woff2 and confirms the plate (H1) mask works with the video on Safari before Anwar sees it.

## 7. REFERENCES READ BY ADDRESS (markup read, not measured on a render; said plainly)
- https://klim.co.nz: the foundry's own home has no sentence at poster size; the first screen is a product name and a specimen image, and every heading below is small. The maker of display type lets the specimen carry the scale and keeps its own words quiet. Supports W2 and H3.
- https://pangrampangram.com: each hero banner is one product name as the heading, a three-word strapline (Calm. Efficient. Swiss.), two small links. The size sits on one or two words, the sentence lives a level down. Supports the ladder in section 3 and W1.
- https://locomotive.ca: the hero line (Digital-First Design Agency Based in Montreal, Canada) is split into one element per letter in the markup so it can move letter by letter, and the phrase repeats four times for a looping treatment. The mechanic is in our house already (.rot splits letters for the buttons); the register (an emoji inside the h1) is not ours. Supports the motion slots.
- https://abcdinamo.com: hierarchy read from the markup is one-word h1, three-word statements at h2, product names at h3. Three-word statements at the second level is the proportion W1 uses.
Live taste file (the-eye-now, 4 Oct): "withhold everything but one proof" and "the one loud note" are the two mechanics H3 and W2 are built on.

## 8. SELF-GRADE
Six causes with numbers; full clamp scale at 390, 1440, 1920; three structurally different compositions per page each with feel, move, motion or 3D slot and a phone note; copy unchanged; four references read by address. Nazar's file did not exist when this was written (checked twice); the chat reads the two together.
