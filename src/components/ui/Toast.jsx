import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

const ToastContext = createContext({
  addToast: () => {},
  removeToast: () => {}
});

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
  info: Info
};

const colorMap = {
  success: {
    rail: 'bg-emerald-500',
    iconWrap: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
    progress: 'bg-emerald-500'
  },
  error: {
    rail: 'bg-red-500',
    iconWrap: 'bg-red-500/15 text-red-600 dark:text-red-300',
    progress: 'bg-red-500'
  },
  warning: {
    rail: 'bg-amber-500',
    iconWrap: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    progress: 'bg-amber-500'
  },
  info: {
    rail: 'bg-accent',
    iconWrap: 'bg-accent/15 text-accent',
    progress: 'bg-accent'
  }
};

/** @param {{children: import('react').ReactNode}} props */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addToast = useCallback(
    ({ message, title, variant = 'info', duration = 4000 }) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, title, variant }]);
      window.setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-3 top-3 z-[120] flex w-[calc(100%-1.5rem)] max-w-sm flex-col gap-3 sm:right-4 sm:top-4">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = iconMap[toast.variant] || Info;
            const palette = colorMap[toast.variant] || colorMap.info;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 30, scale: 0.98 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className="relative overflow-hidden rounded-[var(--radius)] border border-border bg-bg-elevated shadow-xl"
              >
                <div className={`absolute inset-y-0 left-0 w-1 ${palette.rail}`} />
                <div className="flex items-start gap-3 p-4 pl-5">
                  <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${palette.iconWrap}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    {toast.title ? <p className="text-sm font-semibold text-text">{toast.title}</p> : null}
                    <p className="text-sm text-text-muted">{toast.message}</p>
                  </div>
                  <button
                    aria-label="Close toast"
                    className="rounded p-1 text-text-subtle transition hover:bg-surface hover:text-text"
                    onClick={() => removeToast(toast.id)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <motion.div
                  className={`h-0.5 ${palette.progress}`}
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 4, ease: 'linear' }}
                  style={{ transformOrigin: 'left' }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
