import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://progres.univ-dz.dz',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});