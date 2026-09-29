import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    target: 'es2022',
    cssMinify: true,
    assetsInlineLimit: 2048,
  },
  // This Mac only (Asif 2026-09-27): host: true published the dev server on every network
  // interface, so any device on the same wifi could open it. Loopback now; the browser here
  // still reaches http://localhost:4180. Undo: host: true.
  server: { port: 4180, host: '127.0.0.1' },
});
