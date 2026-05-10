import { useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import { listenForForegroundMessages } from '@/services/firebase/messagingService';

const PushMessageListener = () => {
  const { addToast } = useToast();

  useEffect(
    () =>
      listenForForegroundMessages((payload) => {
        const title = payload.notification?.title || payload.data?.title || 'New update';
        const message = payload.notification?.body || payload.data?.body || 'A new association update is available.';

        addToast({
          variant: 'info',
          title,
          message,
          duration: 7000
        });
      }),
    [addToast]
  );

  return null;
};

export default PushMessageListener;
