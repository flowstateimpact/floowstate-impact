// Builds the whole page body from the content file at build time, so first paint already carries every word.
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const opt = (s, html) => (s && String(s).trim() ? html(esc(s)) : '');
// Lines the owner has turned down. They are never set, whatever the content file says.
const REFUSED = [
  "If your business needs nothing, we'll tell you.",
  'We look first. Then we make only what your business needs.',
  "Before we make a thing, you'll know what your business needs.",
  'Four things we make. One audit decides which.',
].map((t) => t.toLowerCase().replace(/[^a-z]/g, ''));
const ok = (s) => (s && !REFUSED.includes(String(s).toLowerCase().replace(/[^a-z]/g, '')) ? String(s).trim() : '');
export const markOf = (c) => (c.footer?.line || c.meta.title).split(/[ .·]/)[0];

const figures = {
  branding: (c) => `<figure class="fig fig--brand" aria-hidden="true"><div class="fig__sheet"><span class="fig__mark">${esc(markOf(c))}</span><span class="fig__chips"><i></i><i></i><i></i></span></div></figure>`,
  websites: () => `<figure class="fig fig--web" aria-hidden="true"><img class="fig__a" src="/media/web-haldi.webp" width="1200" height="800" alt="" loading="lazy" decoding="async"><img class="fig__b" src="/media/web-sonar-phone.webp" width="390" height="844" alt="" loading="lazy" decoding="async"></figure>`,
  videos: () => `<figure class="fig fig--film"><video class="fig__a" src="/media/film-cut.mp4" poster="/media/film-poster.webp" width="960" height="540" muted loop playsinline controls preload="none"></video></figure>`,
  images: () => `<figure class="fig fig--img" aria-hidden="true"><img class="fig__a" src="/media/img-kitchen.webp" width="1200" height="800" alt="" loading="lazy" decoding="async"><img class="fig__b" src="/media/img-taant.webp" width="800" height="600" alt="" loading="lazy" decoding="async"></figure>`,
  audit: (c, it) => `<figure class="fig fig--audit" aria-hidden="true"><div class="fig__sheet"><span class="fig__mark">${esc(it.name)}</span><span class="fig__rule"></span><span class="fig__rule"></span><span class="fig__rule"></span><span class="fig__stamp"></span></div></figure>`,
};

export function renderBody(c) {
  const items = c.services.items;
  const n = items.length;
  const work = (c.work.items || []).filter((w) => w.confirmed === true);
  const held = (c.work.items || []).filter((w) => w.confirmed !== true);
  // The headline slot: the line if there is one, otherwise the category line alone and large.
  const line = ok(c.opening.line);
  const head = line || ok(c.opening.eyebrow);
  const words = head.split(/\s+/).filter(Boolean).length;
  const len = words > 18 ? 'l' : words > 10 ? 'm' : 's';
  return `
<header class="nav">
  <a class="nav__mark" href="#top">${esc(markOf(c))}</a>
  <a class="nav__cta" href="#contact">${esc(c.nav.cta)}</a>
</header>
<canvas id="stage" aria-hidden="true"></canvas>
<main id="top">
  <section class="opening" id="opening">
    <div class="opening__pin">
      <div class="opening__still"></div>
      ${line ? opt(ok(c.opening.eyebrow), (s) => `<p class="eyebrow">${s}</p>`) : '<span></span>'}
      <h1 class="opening__line" data-len="${len}">${esc(head)}</h1>
      <div class="opening__foot">
        ${opt(ok(c.opening.sub), (s) => `<p class="opening__sub">${s}</p>`)}
        <div class="cta-row">
          <a class="btn btn--hot" href="#audit">${esc(c.opening.cta_primary)}</a>
          ${opt(c.opening.cta_secondary, (s) => `<a class="btn btn--quiet" href="#services">${s}</a>`)}
        </div>
      </div>
    </div>
  </section>
  <section class="svchead" id="services">
    <div class="svchead__pin">
      ${opt(ok(c.services.heading), (s) => `<h2 class="svchead__h">${s}</h2>`)}
      ${opt(c.services.intro, (s) => `<p class="svchead__p">${s}</p>`)}
    </div>
  </section>
  ${items.map((it, i) => `
  <section class="svc svc--${i % 2 ? 'r' : 'l'}" id="${esc(it.id)}" data-k="${i + 1}">
    <div class="svc__pin">
      ${(figures[it.id] || (() => ''))(c, it)}
      <div class="svc__text">
        <p class="svc__num" aria-hidden="true"><em>${i + 1}</em><span>/${n}</span></p>
        <h3 class="svc__name">${esc(it.name)}</h3>
        ${opt(it.line, (s) => `<p class="svc__line">${s}</p>`)}
        ${opt(it.body, (s) => `<p class="svc__body">${s}</p>`)}
      </div>
    </div>
  </section>`).join('')}
  <section class="svc svc--${n % 2 ? 'r' : 'l'} svc--addon" id="addon" data-k="${n + 1}">
    <div class="svc__pin">
      <figure class="fig fig--fan" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><b></b></figure>
      <div class="svc__text">
        ${opt(c.addon.label, (s) => `<p class="svc__label">${s}</p>`)}
        <h3 class="svc__name svc__name--long">${esc(c.addon.heading)}</h3>
        ${opt(c.addon.body, (s) => `<p class="svc__body">${s}</p>`)}
        ${opt(c.addon.cta, (s) => `<p><a class="btn btn--line" href="#contact">${s}</a></p>`)}
      </div>
    </div>
  </section>
</main>
<div class="later">
  <section class="checks" id="checks">
    <div class="checks__sheet">
      <header class="checks__head">
        ${opt(c.checks.heading, (s) => `<h2>${s}</h2>`)}
        ${opt(c.checks.intro, (s) => `<p>${s}</p>`)}
      </header>
      <ol class="checks__list">
        ${c.checks.items.map((it, i) => `<li><span class="checks__n" aria-hidden="true">${i + 1}</span><h3>${esc(it.title)}</h3>${opt(it.line, (s) => `<p>${s}</p>`)}</li>`).join('')}
      </ol>
    </div>
  </section>
  ${work.length ? `
  <section class="work" id="work">
    ${opt(c.work.heading, (s) => `<h2>${s}</h2>`)}
    <ul class="work__list">${work.map((w) => `<li><h3>${esc(w.name)}</h3><span>${esc(w.kind)}</span><p>${esc(w.line)}</p></li>`).join('')}</ul>
  </section>` : `<!-- work: ${held.length} entries held until confirmed for public use; section not rendered -->`}
  <section class="people" id="people">
    ${opt(c.people.heading, (s) => `<h2>${s}</h2>`)}
    <ul class="people__list">${c.people.items.map((p) => `<li><h3>${esc(p.name)}</h3><p>${esc(p.role)}</p></li>`).join('')}</ul>
  </section>
  <section class="contact" id="contact">
    ${opt(c.contact.heading, (s) => `<h2>${s}</h2>`)}
    ${opt(c.contact.line, (s) => `<p class="contact__line">${s}</p>`)}
    <a class="contact__mail" href="mailto:${esc(c.contact.email)}">${esc(c.contact.email)}</a>
    <ul class="contact__phones">${c.contact.phones.map((p) => `<li><a href="tel:${esc(p.replace(/\s/g, ''))}">${esc(p)}</a></li>`).join('')}</ul>
    <a class="btn btn--hot" href="mailto:${esc(c.contact.email)}">${esc(c.contact.cta)}</a>
  </section>
  <footer class="foot"><p>${esc(c.footer.line)}</p></footer>
</div>`;
}
