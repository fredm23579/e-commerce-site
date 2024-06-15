import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/graphql': {
        target: process.env.REACT_APP_API_URL || 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/graphql/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});