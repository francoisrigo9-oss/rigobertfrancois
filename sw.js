const CACHE_NAME = 'rigobert-pwa-v2';

// Liste des fichiers essentiels à stocker sur le téléphone
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './francois.jpg.jpeg'
];

// 1. Installation : Mise en cache des fichiers de base
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Mise en cache des ressources principales');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Force le nouveau service worker à s'activer immédiatement
  );
});

// 2. Activation : Nettoyage des anciens caches obsolètes
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache :', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prend le contrôle des pages immédiatement
  );
});

// 3. Stratégie : Charge le cache d'abord, puis met à jour en tâche de fond
self.addEventListener('fetch', (event) => {
  // On ne gère pas les requêtes externes comme l'API WhatsApp
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Version locale trouvée (vitesse maximale)
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Si la réponse réseau est valide, on met à jour le cache
        if (networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
          return networkResponse;
      }).catch(() => {
        // Optionnel : Gestion des erreurs réseau silencieuses
      });

      // Renvoie la version rapide du cache, ou attend le réseau si absent
      return cachedResponse || fetchPromise;
    })
  );
});
