import { auth } from '@/services/firebase/config';
import { requestFcmToken } from '@/services/firebase/messagingService';
import { createLogger } from '@/utils/logger';

const log = createLogger('pushNotificationService');

const endpoint = (import.meta.env.VITE_PUSH_WORKER_ENDPOINT || '').replace(/\/+$/, '');

export const isPushWorkerConfigured = () => Boolean(endpoint);

const postToWorker = async (path, body, options = {}) => {
  if (!endpoint) {
    throw new Error('Missing VITE_PUSH_WORKER_ENDPOINT.');
  }

  const headers = { 'Content-Type': 'application/json' };
  if (options.authenticated) {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('Admin session is required to send notifications.');
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${endpoint}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Push notification request failed.');
  }

  return data;
};

export const subscribeToPushNotifications = async () => {
  const token = await requestFcmToken();
  await postToWorker('/api/push/subscribe', {
    token,
    userAgent: navigator.userAgent,
    permission: Notification.permission
  });
  log.info('Push token subscribed');
  return token;
};

export const sendContentNotification = async ({ type, title, body, url }) => {
  try {
    return await postToWorker(
      '/api/push/send',
      {
        type,
        title,
        body,
        url
      },
      { authenticated: true }
    );
  } catch (error) {
    log.warn('Push notification send skipped or failed', { message: error.message, type, title });
    throw error;
  }
};
