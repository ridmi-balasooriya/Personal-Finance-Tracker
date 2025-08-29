import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), svgr(), tailwind()],
  server: {
    port: 3000, // CRA used 3000, so keep consistent
    open: true, // auto-open browser
  },
  build: {
    outDir: 'build', // CRA default is "build"
  },
});