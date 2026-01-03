/**
 * Service Worker for Family Reunion PWA
 * Handles caching and offline functionality
 */

const CACHE_NAME = 'family-reunion-v1';
const RUNTIME_CACHE = 'family-reunion-runtime-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Playfair+Display:wght@700;900&family=Karla:wght@400;600&display=swap'
];

// ===========================
// Install Event
// ===========================
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker installed successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Error during installation:', error);
            })
    );
});

// ===========================
// Activate Event
// ===========================
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // Delete old caches
                            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
                        })
                        .map((cacheName) => {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// ===========================
// Fetch Event - Network First, falling back to cache
// ===========================
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http(s) requests
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        networkFirst(event.request)
    );
});

// ===========================
// Caching Strategies
// ===========================

/**
 * Network First Strategy
 * Try to fetch from network first, fall back to cache if offline
 */
async function networkFirst(request) {
    try {
        // Try to fetch from network
        const networkResponse = await fetch(request);

        // If successful, cache the response and return it
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        // Network failed, try to get from cache
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            console.log('Serving from cache:', request.url);
            return cachedResponse;
        }

        // If not in cache and it's a navigation request, return the offline page
        if (request.mode === 'navigate') {
            const cache = await caches.open(CACHE_NAME);
            const offlineResponse = await cache.match('/index.html');
            if (offlineResponse) {
                return offlineResponse;
            }
        }

        // Return a basic offline response
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

/**
 * Cache First Strategy (alternative for static assets)
 * Try cache first, fall back to network
 */
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);

        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('Fetch failed:', error);
        throw error;
    }
}

// ===========================
// Background Sync (for future implementation)
// ===========================
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-rsvp') {
        event.waitUntil(syncRSVP());
    }
});

async function syncRSVP() {
    // Implement RSVP syncing logic here when backend is available
    console.log('Syncing RSVP data...');
}

// ===========================
// Push Notifications (for future implementation)
// ===========================
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New update available!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Family Reunion 2026', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow('/')
    );
});
