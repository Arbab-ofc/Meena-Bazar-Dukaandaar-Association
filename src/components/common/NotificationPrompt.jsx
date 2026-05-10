import { BellRing } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import NotificationOptIn from '@/components/common/NotificationOptIn';
import { isPushMessagingSupported } from '@/services/firebase/messagingService';
import { isPushWorkerConfigured } from '@/services/push/pushNotificationService';

const DISMISS_KEY = 'mbda-push-prompt-dismissed';

const NotificationPrompt = () => {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      if (!isPushWorkerConfigured()) return;
      if (sessionStorage.getItem(DISMISS_KEY) === '1') return;
      if (typeof Notification === 'undefined' || Notification.permission === 'granted') return;
      if (!(await isPushMessagingSupported())) return;

      window.setTimeout(() => {
        if (mounted) setOpen(true);
      }, 900);
    };

    check();

    return () => {
      mounted = false;
    };
  }, []);

  const close = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title="Stay Updated" size="sm">
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius)] border border-gold/30 bg-gold/10 text-gold">
            <BellRing className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm text-text-muted">
              Get notified when the association publishes a new notice or legal update.
            </p>
            <p className="mt-2 text-xs text-text-subtle">
              You can change this anytime from your browser site settings.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <NotificationOptIn className="w-full" onSubscribed={close} />
          <Button type="button" variant="ghost" onClick={close} className="w-full">
            Not Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationPrompt;
