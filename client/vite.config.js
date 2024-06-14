import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/graphql': {
        target: 'mongodb+srv://motta:baFi5HJmumvX4NtL@cluster0.gdbtbna.mongodb.net/cleanDB?retryWrites=true&w=majority:3001/graphql',
        secure: false,
        changeOrigin: true
      }
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom'
  }
});
