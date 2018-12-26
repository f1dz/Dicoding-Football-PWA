var CACHE_NAME = 'football-pwa-v9'

var urlsToCache = [
  '/',
  '/img/ball.png',
  '/img/empty_badge.svg',
  '/css/main.css',
  '/js/main.js',
  '/js/nav.js',
  '/js/api.js',
  '/js/idb.js',
  '/nav.html',
  '/index.html',
  '/materialize/css/materialize.min.css',
  '/materialize/js/materialize.min.js'
]

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  )
});

self.addEventListener('fetch', (event) => {
  event.respondWith(async function () {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) return cachedResponse;
    const networkResponse = await fetch(event.request);
    event.waitUntil(
      cache.put(event.request, networkResponse.clone())
    );
    return networkResponse;
  }());
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
});

self.addEventListener('push', event => {
  var body;

  console.log(event);

  if(event.data) {
    body = event.data.text()
  } else {
    body = "This is push message"
  }

  var options = {
    body: body,
    icon: '/img/ball.png',
    vibrate: [500, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  }

  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});