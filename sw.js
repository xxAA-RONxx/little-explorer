// Service Worker for Little Explorer PWA
const CACHE_NAME = 'little-explorer-v2.0.0';
const OFFLINE_URL = '/little-explorer/offline.html';

// Assets to cache on install
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
  '/little-explorer/js/modules/games.js'
];

// Install event - cache assets
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

// Activate event - clean old caches
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
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
  // Skip cross-origin requests
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(cachedResponse) {
        // Return cached response if found
        if (cachedResponse) {
          // Check if it's the offline page - don't serve stale offline page
          if (event.request.url.includes('offline.html')) {
            return cachedResponse;
          }
          
          // Network-first strategy for HTML pages
          if (event.request.headers.get('Accept').includes('text/html')) {
            return fetch(event.request)
              .then(function(networkResponse) {
                // Update cache with fresh response
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then(function(cache) {
                    cache.put(event.request, responseToCache);
                  });
                return networkResponse;
              })
              .catch(function() {
                // Network failed, return cached version
                return cachedResponse;
              });
          }
          
          return cachedResponse;
        }
        
        // Not in cache - fetch from network
        return fetch(event.request)
          .then(function(networkResponse) {
            // Cache the fetched response for future
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          })
          .catch(function(error) {
            console.log('[SW] Fetch failed:', error);
            // Return offline page for HTML requests
            if (event.request.headers.get('Accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
            // Return a simple error response for other requests
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline actions (optional)
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

function syncData() {
  // Implement data sync logic here if needed
  console.log('[SW] Syncing data...');
  return Promise.resolve();
}