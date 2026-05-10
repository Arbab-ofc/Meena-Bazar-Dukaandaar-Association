import { BellRing, FileText, Scale } from 'lucide-react';
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
    <Modal isOpen={isOpen} onClose={close} title="Stay Updated" size="md">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-[64px_minmax(0,1fr)] sm:items-start">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius)] border border-gold/30 bg-gold/10 text-gold sm:h-16 sm:w-16">
            <BellRing className="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <h4 className="font-heading text-2xl leading-tight text-text sm:text-3xl">
              Get association updates as soon as they are published.
            </h4>
            <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">
              Receive browser alerts for new notices and legal updates. You can change this anytime from your browser settings.
            </p>
          </div>
        </div>

        <div className="grid gap-3 rounded-[var(--radius)] border border-border bg-surface p-3 text-sm text-text-muted sm:grid-cols-2 sm:p-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border bg-bg-elevated text-gold">
              <FileText className="h-4 w-4" />
            </span>
            <span className="min-w-0 break-words">Official notices</span>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border bg-bg-elevated text-gold">
              <Scale className="h-4 w-4" />
            </span>
            <span className="min-w-0 break-words">Legal case updates</span>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button type="button" variant="ghost" onClick={close} className="w-full sm:w-auto">
            Not Now
          </Button>
          <NotificationOptIn className="w-full sm:w-auto" onSubscribed={close} />
        </div>
      </div>
    </Modal>
  );
};

export default NotificationPrompt;
