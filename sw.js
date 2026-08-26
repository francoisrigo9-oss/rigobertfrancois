const CACHE_NAME = "rigobert-portfolio-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./francois.jpg",
  "./restaurant.html",
  "./boutique.html",
  "./medical.html"
];

self.addEventListener("install", function(event) {

  event.waitUntil(

    caches.open(CACHE_NAME).then(function(cache) {

      return cache.addAll(FILES_TO_CACHE);

    })

  );

  self.skipWaiting();

});


self.addEventListener("activate", function(event) {

  event.waitUntil(

    caches.keys().then(function(cacheNames) {

      return Promise.all(

        cacheNames.map(function(cacheName) {

          if (cacheName !== CACHE_NAME) {

            return caches.delete(cacheName);

          }

        })

      );

    })

  );

  self.clients.claim();

});


self.addEventListener("fetch", function(event) {

  event.respondWith(

    caches.match(event.request).then(function(response) {

      return response || fetch(event.request);

    })

  );

});
