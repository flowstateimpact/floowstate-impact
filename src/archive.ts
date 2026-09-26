import data from './data/archive.json';

interface Item { cat: string; title: string; url: string | null }

export function renderArchive() {
  const list = document.querySelector<HTMLOListElement>('[data-archive]');
  const bar = document.querySelector<HTMLDivElement>('[data-filters]');
  if (!list || !bar) return;
  const film = (data as { sections: { id: string; items: Item[] }[] }).sections.find((s) => s.id === 'film');
  const items = film?.items ?? [];
  const cats = ['All', ...Array.from(new Set(items.map((i) => i.cat)))];

  const frag = document.createDocumentFragment();
  items.forEach((it, i) => {
    const li = document.createElement('li');
    li.className = 'archive__row';
    li.dataset.cat = it.cat;
    const n = String(i + 1).padStart(2, '0');
    const inner = `<span class="archive__n mono">${n}</span><span class="archive__t">${it.title}</span><span class="archive__c mono">${it.cat}</span><span class="archive__go mono" aria-hidden="true">${it.url ? 'Watch ↗' : ''}</span>`;
    if (it.url) {
      const a = document.createElement('a');
      a.href = it.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = inner;
      a.setAttribute('aria-label', `${it.title}, ${it.cat}, opens in a new tab`);
      li.appendChild(a);
    } else {
      li.innerHTML = `<div class="archive__static">${inner}</div>`;
    }
    frag.appendChild(li);
  });
  list.appendChild(frag);

  cats.forEach((c, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.role = 'tab';
    b.textContent = c === 'All' ? `All · ${items.length}` : c;
    b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    b.addEventListener('click', () => {
      bar.querySelectorAll('button').forEach((x) => x.setAttribute('aria-selected', 'false'));
      b.setAttribute('aria-selected', 'true');
      list.querySelectorAll<HTMLLIElement>('.archive__row').forEach((row) => {
        row.hidden = !(c === 'All' || row.dataset.cat === c);
      });
    });
    bar.appendChild(b);
  });
}
