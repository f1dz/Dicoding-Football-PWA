var CACHE_NAME = 'football-pwa-v1'

var urlsToCache = [
  '/',
  '/img/codepolitan_logo.png',
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

self.addEventListener("fetch", event => {

  var base_url = "https://readerapi.codepolitan.com/";

  if(event.request.url.indexOf(base_url) > -1) {
    
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return fetch(event.request).then(response => {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    )
  } else {
    event.respondWith(
      caches.match(event.request, {ignoreSearch: true}).then(response => {
        return response || fetch(event.request);
      })
    )
  }
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if(cacheName != CACHE_NAME){
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
});