const CACHE_NAME = 'hotel-discounts-mobile-pwa-20260716-1';
const APP_SHELL = [
  './',
  './index.html',
  './mobile.html',
  './manifest.webmanifest',
  './assets/mobile.css',
  './assets/mobile.js',
  './assets/section-loader.js',
  './assets/algara-prices-v26-lite-data.js',
  './assets/algara-lite-calculator.js',
  './assets/pwa-icon-192.png',
  './assets/pwa-icon-512.png',
  './assets/pwa-icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL.map(url => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./mobile.html').then(fallback => fallback || caches.match('./index.html'));
        }
        return undefined;
      });
    })
  );
});
