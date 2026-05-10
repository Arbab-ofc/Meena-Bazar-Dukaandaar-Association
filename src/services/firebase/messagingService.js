import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { app, firebaseConfig } from '@/services/firebase/config';
import { createLogger } from '@/utils/logger';

const log = createLogger('messagingService');

const vapidKey = import.meta.env.VITE_FIREBASE_MESSAGING_VAPID_KEY;
const workerPath = '/firebase-messaging-sw.js';

export const isPushMessagingSupported = async () => {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return false;
  return isSupported();
};

const registerMessagingWorker = async () => {
  const params = new URLSearchParams({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId
  });

  return navigator.serviceWorker.register(`${workerPath}?${params.toString()}`);
};

export const requestFcmToken = async () => {
  if (!vapidKey) {
    throw new Error('Missing VITE_FIREBASE_MESSAGING_VAPID_KEY.');
  }

  if (!(await isPushMessagingSupported())) {
    throw new Error('Push notifications are not supported in this browser.');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }

  const registration = await registerMessagingWorker();
  const messaging = getMessaging(app);
  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration
  });

  if (!token) {
    throw new Error('Unable to generate a notification token.');
  }

  log.info('FCM token generated');
  return token;
};

export const listenForForegroundMessages = (callback) => {
  if (!('Notification' in window)) return () => {};

  isSupported()
    .then((supported) => {
      if (!supported) return null;
      const messaging = getMessaging(app);
      return onMessage(messaging, (payload) => {
        log.debug('Foreground push message received', { messageId: payload.messageId });
        callback(payload);
      });
    })
    .catch((error) => {
      log.warn('Foreground push listener unavailable', { message: error.message });
    });

  return () => {};
};
