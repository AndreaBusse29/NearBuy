/// <reference lib="webworker" />

const CACHE_NAME = 'nearbuy-v1';
const urlsToCache: string[] = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/dist/app.js',
  '/manifest.json',
];

// Type for service worker global scope
declare const self: ServiceWorkerGlobalScope;

// SyncEvent interface for Background Sync API
interface SyncEvent extends ExtendableEvent {
  readonly tag: string;
  readonly lastChance: boolean;
}

// Install event - cache resources
self.addEventListener('install', (event: ExtendableEvent): void => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache: Cache): Promise<void> => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event: FetchEvent): void => {
  event.respondWith(
    caches.match(event.request).then((response: Response | undefined): Promise<Response> => {
      // Cache hit - return response
      if (response) {
        return Promise.resolve(response);
      }

      return fetch(event.request).then((response: Response): Response => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache: Cache): void => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: ExtendableEvent): void => {
  const cacheWhitelist: string[] = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames: string[]): Promise<void> => {
      return Promise.all(
        cacheNames.map((cacheName: string): Promise<void> => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName).then(() => undefined);
          }
          return Promise.resolve();
        })
      ).then(() => undefined);
    })
  );
});

// Background sync for checking price updates
self.addEventListener('sync', ((event: SyncEvent): void => {
  if (event.tag === 'check-prices') {
    event.waitUntil(checkPrices());
  }
}) as EventListener);

// Check prices function (placeholder for future implementation)
async function checkPrices(): Promise<void> {
  // This will be implemented to check product prices
  // and send notifications when prices drop
  console.log('Checking prices in background...');
}

// Push notification event
self.addEventListener('push', (event: PushEvent): void => {
  const options: NotificationOptions = {
    body: event.data ? event.data.text() : 'A product is on sale!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'price-alert',
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration.showNotification('NearBuy Price Alert', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event: NotificationEvent): void => {
  event.notification.close();

  event.waitUntil(
    self.clients.openWindow('/').then((client: WindowClient | null): WindowClient | null => {
      return client;
    })
  );
});

export {};