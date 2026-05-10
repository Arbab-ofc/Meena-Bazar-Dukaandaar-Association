importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const params = new URL(self.location.href).searchParams;

firebase.initializeApp({
  apiKey: params.get('apiKey') || 'AIzaSyA2TGoiu9_Nky_ORqhJYOtIAuPk-we1fJQ',
  authDomain: params.get('authDomain') || 'meena-bazar-association.firebaseapp.com',
  projectId: params.get('projectId') || 'meena-bazar-association',
  storageBucket: params.get('storageBucket') || 'meena-bazar-association.firebasestorage.app',
  messagingSenderId: params.get('messagingSenderId') || '550677330949',
  appId: params.get('appId') || '1:550677330949:web:15c52243c92b434a1bf06c'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || 'New update';
  const options = {
    body: payload.notification?.body || payload.data?.body || 'A new association update is available.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: {
      url: payload.data?.url || '/'
    }
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
