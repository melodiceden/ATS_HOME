const CACHE_NAME = 'ats-v1';
const ASSETS = [
  '/homepage/index.html',
  '/homepage/index.css',
  '/homepage/index.js',
  '/homepage/mockup.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
