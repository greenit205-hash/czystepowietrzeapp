const CACHE_NAME = 'seczp-cache-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: zawsze próbuje pobrać najnowszą wersję, gdy jest internet.
// Pamięć podręczna służy tylko jako zapasowa wersja offline.
self.addEventListener('fetch', (event) => {
  // Nigdy nie cachuj wywołań do Google Apps Script — zawsze do sieci
  if (event.request.url.includes('script.google.com')) return;
  if (event.request.method !== 'GET') return;

  // Biblioteki z zewnętrznych CDN obsługuje przeglądarka bezpośrednio
  const url = event.request.url;
  if (url.includes('cdnjs.cloudflare.com') || url.includes('cdn.jsdelivr.net') || url.includes('unpkg.com')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
