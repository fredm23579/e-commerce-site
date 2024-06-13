
import { defineConfig } from 'vite';
import { resolve } from 'path';

import react from '@vitejs/plugin-react';

const pathSrc = resolve(__dirname, 'src');

const pathPublic = resolve(__dirname, 'public');

const pathNodeModules = resolve(__dirname, 'node_modules');

const pathDist = resolve(__dirname, 'dist');

const pathAssets = resolve(__dirname, 'src/assets');

const pathComponents = resolve(__dirname, 'src/components');

const pathPages = resolve(__dirname, 'src/pages');

const pathUtils = resolve(__dirname, 'src/utils');

const pathStore = resolve(__dirname, 'src/store');

const pathStyles = resolve(__dirname, 'src/styles');

const pathSrcUtils = resolve(__dirname, 'src/utils/helpers');

const pathSrcPages = resolve(__dirname, 'src/pages');

const pathSrcPagesFavorites = resolve(__dirname, 'src/pages/Favorites');

const pathSrcPagesWishlist = resolve(__dirname, 'src/pages/Wishlist');

const pathSrcPagesLogin = resolve(__dirname, 'src/pages/Login');

const pathSrcPagesSignup = resolve(__dirname, 'src/pages/Signup');

const pathSrcPagesOrderHistory = resolve(__dirname, 'src/pages/OrderHistory');

const pathSrcPagesProduct = resolve(__dirname, 'src/pages/Product');

const pathSrcPagesProducts = resolve(__dirname, 'src/pages/Products');

const pathSrcPagesSuccess = resolve(__dirname, 'src/pages/Success');

const pathSrcPagesDetail = resolve(__dirname, 'src/pages/Detail');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 3000,
    open: true,

    proxy: {
      '/graphql': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/graphql/, ''),
      },
    },
  },

  build: {
    outDir: 'dist',
    assetsDir: 'src/assets',

  },

  test: {
    globals: true,
    environment: 'happy-dom',

  },
});
