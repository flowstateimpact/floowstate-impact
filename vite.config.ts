import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// WORLD_PAGE=1 adds the dev rail page to a build (for measuring the world's load cost only; never deployed)
const world = process.env.WORLD_PAGE === '1';
const at = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  build: {
    target: 'es2022',
    cssMinify: true,
    assetsInlineLimit: 2048,
    ...(world ? { outDir: 'dist-world', rollupOptions: { input: { main: at('index.html'), rail: at('dev/rail.html') } } } : {}),
  },
  server: { port: 4180, host: '127.0.0.1' },
});
