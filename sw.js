// IMPORTANTE: Incrementa questo numero ad ogni deploy per forzare l'aggiornamento
const VERSION = '1.2.0';
const CACHE_NAME = `pdf-editor-v${VERSION}`;
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    console.log(`Service Worker: Installing v${VERSION}...`);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log(`Service Worker v${VERSION} installed, taking control...`);
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Cache failed', error);
            })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    console.log(`Service Worker v${VERSION}: Activating...`);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log(`Service Worker: Clearing old cache: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            console.log(`Service Worker v${VERSION} activated, claiming clients...`);
            // Notifica i client dell'aggiornamento
            return self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'SW_UPDATED',
                        version: VERSION
                    });
                });
            });
        })
    );
    return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request)
                    .then((fetchResponse) => {
                        // Don't cache POST requests or non-GET requests
                        if (event.request.method !== 'GET') {
                            return fetchResponse;
                        }

                        // Clone the response
                        const responseToCache = fetchResponse.clone();

                        // Cache the fetched response for future use
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return fetchResponse;
                    })
                    .catch((error) => {
                        console.error('Fetch failed:', error);
                        // You could return a custom offline page here
                        throw error;
                    });
            })
    );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-pdfs') {
        event.waitUntil(syncPDFs());
    }
});

async function syncPDFs() {
    // Implement PDF sync logic if needed
    console.log('Syncing PDFs...');
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Nuova notifica da PDF Editor',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('PDF Editor', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked');
    event.notification.close();

    event.waitUntil(
        clients.openWindow('/')
    );
});
