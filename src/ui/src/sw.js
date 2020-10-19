const cacheName = 'v1';
const staticAssets = [
  '/',
  '/js/main.mjs',
  '/assets/style.css',
  '/js/listeners.mjs',
  '/js/events.mjs',
  '/js/elements.mjs',
  '/js/utils.mjs',
  '/manifest.webmanifest',
  '/assets/favicon.ico',
  '/assets/icons/android-icon-144x144.png',
];

self.addEventListener('install', (event) => {
  console.log('Hello from SW! ');
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(staticAssets)),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request) || fetch(event.request));
});
