importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

var urlsToCache = [
  { url: '/', revision: '1' },
  { url: '/img/ball.png', revision: '1' },
  { url: '/img/empty_badge.svg', revision: '1' },
  { url: '/css/main.css', revision: '1' },
  { url: '/js/main.js', revision: '1' },
  { url: '/js/nav.js', revision: '1' },
  { url: '/js/api.js', revision: '1' },
  { url: '/js/idb.js', revision: '1' },
  { url: '/nav.html', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/materialize/css/materialize.min.css', revision: '1' },
  { url: '/materialize/js/materialize.min.js', revision: '1' },
]

if(workbox){
  // Force development builds
  //workbox.setConfig({ debug: true });
  // The most verbose - displays all logs.
  //workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);
  
  workbox.precaching.precacheAndRoute(urlsToCache);

  workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ]
    })
  );
  
  workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate()
  )

  // Caching Google Fonts
  workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
    })
  );
}

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