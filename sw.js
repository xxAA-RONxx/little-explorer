// Service Worker for Little Explorer PWA
const CACHE_NAME = 'little-explorer-v2.0.1';

const ASSETS = [
  '/little-explorer/',
  '/little-explorer/index.html',
  '/little-explorer/manifest.json',
  '/little-explorer/css/style.css',
  '/little-explorer/css/components.css',
  '/little-explorer/css/modules/sensory.css',
  '/little-explorer/css/modules/nepali.css',
  '/little-explorer/css/modules/games.css',
  '/little-explorer/js/app.js',
  '/little-explorer/js/services/storage.js',
  '/little-explorer/js/services/ageManager.js',
  '/little-explorer/js/services/languageService.js',
  '/little-explorer/js/modules/sensory.js',
  '/little-explorer/js/modules/explorer.js',
  '/little-explorer/js/modules/nepali.js',
  '/little-explorer/js/modules/nepali-simple.js',
  '/little-explorer/js/modules/games.js'
];

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[SW] Caching assets');
        return cache.addAll(ASSETS);
      })
      .then(function() {
        return self.skipWaiting();
      })
      .catch(function(error) {
        console.log('[SW] Install failed:', error);
      })
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Removing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(function() {
        return self.clients.claim();
      })
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(cachedResponse) {
        if (cachedResponse) {
          if (event.request.headers.get('Accept').includes('text/html')) {
            return fetch(event.request)
              .then(function(networkResponse) {
                var responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then(function(cache) {
                    cache.put(event.request, responseToCache);
                  });
                return networkResponse;
              })
              .catch(function() {
                return cachedResponse;
              });
          }
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(function(networkResponse) {
            var responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          })
          .catch(function(error) {
            console.log('[SW] Fetch failed:', error);
            if (event.request.headers.get('Accept').includes('text/html')) {
              return new Response(
                '<html><body><h1>Offline</h1><p>Please connect to the internet.</p></body></html>',
                { headers: { 'Content-Type': 'text/html' } }
              );
            }
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});
