const CACHE_NAME = 'e-commerce-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/public/',
  '/public/images/',
  '/public/images/alphabet-blocks.jpg',
  '/public/images/bedtime-book.jpg',
  '/public/images/camera.jpg',
  '/public/images/canned-coffee.jpg',
  '/public/images/cookie-tin.jpg',
  '/public/images/plastic-horses.jpg',
  '/public/images/soap.jpg',
  '/public/images/spinning-top.jpg',
  '/public/images/tablet.jpg',
  '/public/images/teady-bear.jpg',
  '/public/images/toilet-paper.jpg',
  '/public/images/wooden-spoons.jpg',
  '/public/vite.svg',
  '/public/icons/',
  '/public/index.html',
  '/public/manifest.json',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/App.css',
  '/src/components/Nav/index.jsx',
  '/src/components/Cart/index.jsx',
  '/src/components/Cart/style.jsx',
  '/src/components/Carttem/index.jsx',
  '/src/components/CategoryMenu/index.jsx',
  '/src/components/DeleteBtn/index.jsx',
  '/src/components/Jumbotron/index.jsx',
  '/src/components/ProductItem/index.jsx',
  '/src/components/ProductList/index.jsx',
  '/src/Loading.jsx',
  '/src/assets/react.svg',
  '/src/assets/spinner.gif',
  '/src/serviceWorker.js',
  '/src/pages/Home.jsx',
  '/src/pages/Detail.jsx',
  '/src/pages/Login.jsx',
  '/src/pages/NoMatch.jsx',
  '/src/pages/Signup.jsx',
  '/src/pages/Success.jsx',
  '/src/pages/OrderHistory.jsx',
  '/src/utils/auth.js',
  '/src/utils/action.js',
  '/src/utils/GlobalState.jsx',
  '/src/utils/helpers.js',
  '/src/utils/mutations.js',
  '/src/utils/queries.js',
  '/src/utils/reducers.js',
  '/public/icons/icon-192x192.png',
  '/public/icons/icon-512x512.png',
  
  // Add other resources you want to cache
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
