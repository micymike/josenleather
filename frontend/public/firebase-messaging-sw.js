importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyBEfavZ0KVTjSRc775oWgj94RNC6nT83Ho",
  authDomain: "josenleather.firebaseapp.com",
  projectId: "josenleather",
  storageBucket: "josenleather.firebasestorage.app",
  messagingSenderId: "1072474386511",
  appId: "1:1072474386511:web:11b2edcb97be5ec192ba3a",
  measurementId: "G-JTK9YGCB95"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data,
    tag: payload.data?.orderId || 'default'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  // Get the order ID from the notification data
  const orderId = event.notification.data?.orderId;
  const orderRef = event.notification.data?.orderRef;
  
  // Open the appropriate URL
  if (orderId || orderRef) {
    const url = `/orders/${orderId || orderRef}`;
    event.waitUntil(
      clients.openWindow(url)
    );
  } else {
    // Default to home page
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
