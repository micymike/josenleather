import { onMessage } from 'firebase/messaging';
import { messaging } from './firebase';

onMessage(messaging, payload => {
  console.log('Notification received:', payload);

  new Notification(payload.notification?.title || 'New Notification', {
    body: payload.notification?.body,
  });
});
