import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration
//
// During development the dev server proxies any request beginning
// with `/api` to the production Progres backend.  This mirrors the
// configuration used in the original project.  When running in
// production (e.g. on Netlify) the Netlify redirect rules defined
// in netlify.toml perform the same proxying behaviour.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://progres.mesrs.dz',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});