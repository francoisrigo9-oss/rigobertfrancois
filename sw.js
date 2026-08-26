const CACHE_NAME = "rigobert-app-v1";
const FILES_TO_CACHE = [
  "/rigobertfrancois/",
  "/rigobertfrancois/index.html",
  "/rigobertfrancois/projets.html",
  "/rigobertfrancois/contact.html",
  "/rigobertfrancois/apropos.html",
  "/rigobertfrancois/actualite.html",
  "/rigobertfrancois/francois.jpg.jpeg",
  "/rigobertfrancois/manifest.json"
];

// Installer et mettre en cache
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

// Servir depuis le cache si pas internet
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
