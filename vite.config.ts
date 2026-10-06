import { defineConfig, type Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-ignore plain module
import { renderBody } from './site/markup.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
// The narrative director's file is the source of truth. A copy is kept in the repo so the site builds anywhere.
const EXTERNAL = '/Users/asiffarid/Documents/apps/fsi-website-2026-10/copy/site-copy.json';
const LOCAL = path.join(here, 'site/site-copy.json');
const FALLBACK = path.join(here, 'site/provisional.json');

function loadContent() {
  if (fs.existsSync(EXTERNAL)) fs.copyFileSync(EXTERNAL, LOCAL);
  const file = fs.existsSync(LOCAL) ? LOCAL : FALLBACK;
  return { file, data: JSON.parse(fs.readFileSync(file, 'utf8')) };
}

function content(): Plugin {
  const id = 'virtual:content';
  return {
    name: 'site-content',
    resolveId: (s) => (s === id ? '\0' + id : null),
    load(s) {
      if (s !== '\0' + id) return null;
      const { data } = loadContent();
      return `export default ${JSON.stringify(data)};`;
    },
    transformIndexHtml(html) {
      const { file, data } = loadContent();
      const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
      console.log(`\n[content] ${path.basename(file)}`);
      return html
        .replace('%TITLE%', esc(data.meta.title))
        .replace('%DESC%', esc(data.meta.description))
        .replace('<!--body-->', renderBody(data));
    },
  };
}

export default defineConfig({
  plugins: [content()],
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
  build: { target: 'es2022', assetsInlineLimit: 0, chunkSizeWarningLimit: 900 },
});
