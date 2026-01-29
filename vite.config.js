import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the Progres frontend.  This file configures the
// React plugin and allows environment variables prefixed with `VITE_` to
// be referenced in the client code via `import.meta.env`.
export default defineConfig({
  plugins: [react()],
});