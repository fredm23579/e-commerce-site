const CACHE_NAME = 'e-commerce-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/src/App.jsx',
  '/src/main.jsx',
  '/src/App.css',
  '/src/components/Nav/index.jsx',
  '/src/pages/Home/index.jsx',
  '/src/pages/Detail/index.jsx',
  '/src/pages/NoMatch/index.jsx',
  '/src/pages/Login/index.jsx',
  '/src/pages/Signup/index.jsx',
  '/src/pages/Success/index.jsx',
  '/src/pages/OrderHistory/index.jsx',
  '/src/utils/auth.js',
  '/src/components/Nav/Nav.jsx',
  '/src/components/Nav/Nav.css',
  // Add other resources you want to cache
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.map((url) => {
          return new Request(url, { integrity: 'sha384-<hash-value>' });
        }));
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
