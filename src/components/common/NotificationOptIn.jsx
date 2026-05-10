import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { isPushMessagingSupported } from '@/services/firebase/messagingService';
import { isPushWorkerConfigured, subscribeToPushNotifications } from '@/services/push/pushNotificationService';

const NotificationOptIn = ({ compact = false, className = '', onSubscribed }) => {
  const { addToast } = useToast();
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState(() =>
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    isPushMessagingSupported().then((value) => {
      if (mounted) setSupported(value);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!isPushWorkerConfigured() || !supported || permission === 'granted') return null;

  const onEnable = async () => {
    setLoading(true);
    try {
      await subscribeToPushNotifications();
      setPermission(Notification.permission);
      addToast({ variant: 'success', message: 'Notifications enabled.' });
      onSubscribed?.();
    } catch (error) {
      setPermission(typeof Notification === 'undefined' ? 'unsupported' : Notification.permission);
      addToast({ variant: 'error', message: error.message || 'Unable to enable notifications.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size={compact ? 'sm' : 'md'}
      leftIcon={<Bell className="h-4 w-4" />}
      loading={loading}
      onClick={onEnable}
      className={`${compact ? 'w-full justify-start' : ''} ${className}`}
    >
      Enable
    </Button>
  );
};

export default NotificationOptIn;
