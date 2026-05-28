import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BIT3208 Week 1 — Vite configuration
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
