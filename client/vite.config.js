import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
    proxy: {
      '/graphql': {
        target: 'https://e-commerce-site-us2y.onrender.com/',
        secure: false, // Set to true if your backend uses HTTPS
        changeOrigin: true,
        // Optional error handling
        onError: (err, req, res) => {
          console.error('Proxy error:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Something went wrong. And we are reporting a custom error message.');
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom'
  }
});
