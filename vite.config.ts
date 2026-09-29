import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// WORLD_PAGE=1 adds the dev rail page to a build. The v2-3d branch's vercel.json builds this way for its PREVIEW link only;
// production (main) never builds it. Revert vercel.json's buildCommand, outputDirectory and "/" redirect before v2 merges to main.
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
