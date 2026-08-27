const CACHE_NAME = "rigobert-portfolio-v1";

const FILES = [
  "index.html",
  "restaurant.html",
  "boutique.html",
  "medical.html",
  "competences.html",
  "actualites.html",
  "manifest.json",
  "francois.jpg"
];

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME).then(cache => {

      return cache.addAll(FILES);

    })

  );

});


self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request).then(response => {

      return response || fetch(event.request);

    })

  );

});
