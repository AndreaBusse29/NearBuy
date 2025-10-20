// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then((registration: ServiceWorkerRegistration): void => {
      console.log('Service Worker registered:', registration);
    })
    .catch((error: Error): void => {
      console.error('Service Worker registration failed:', error);
    });
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}