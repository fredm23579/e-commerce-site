import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
    proxy: {
      '/graphql': {
        target: 'https://e-commerce-site-us2y.onrender.com/graphql', // Ensure the path includes /graphql
        secure: true,          // Set to true if your backend uses HTTPS (recommended)
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/graphql/, ''), // Remove '/graphql' prefix from requests
      },
      '/images': { // Proxy for images
        target: 'https://e-commerce-site-us2y.onrender.com/', 
        secure: true,
        changeOrigin: true
      }
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom'
  }
});
