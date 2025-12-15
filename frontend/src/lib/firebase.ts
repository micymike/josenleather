import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBEfavZ0KVTjSRc775oWgj94RNC6nT83Ho",
  authDomain: "josenleather.firebaseapp.com",
  projectId: "josenleather",
  storageBucket: "josenleather.firebasestorage.app",
  messagingSenderId: "1072474386511",
  appId: "1:1072474386511:web:11b2edcb97be5ec192ba3a",
  measurementId: "G-JTK9YGCB95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get token
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Register service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered:', registration);
      }
      
      const token = await getToken(messaging, {
        vapidKey: 'BDu3wMRdvovMotDnmjAVmfIV67YwwCwM6fp9VBr4oUy-xQu1GmS8HmaULM0F8AMchBNrl77NPVPzT2LbHEWJ0tQ' // Get this from Firebase Console > Project Settings > Cloud Messaging
      });
      console.log('FCM Token:', token);
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

// Handle incoming messages when the app is in the foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { messaging };
