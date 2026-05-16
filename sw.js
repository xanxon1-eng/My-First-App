// Purge Worker v1.0.1
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(names.map(name => caches.delete(name)));
    }).then(() => self.clients.claim())
  );
});

// No-op fetch to avoid hijacking
// self.addEventListener('fetch', () => {
//   return;
// });
