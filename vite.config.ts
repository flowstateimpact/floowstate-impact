import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    target: 'es2022',
    cssMinify: true,
    assetsInlineLimit: 2048,
  },
  server: { port: 4180, host: true },
});
