import { createLogger } from '@/utils/logger';

const runtimeLog = createLogger('runtime');

let initialized = false;

export const setupRuntimeLogging = () => {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  window.addEventListener('error', (event) => {
    runtimeLog.error('Unhandled window error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    runtimeLog.error('Unhandled promise rejection', {
      reason:
        event.reason instanceof Error
          ? { message: event.reason.message, stack: event.reason.stack }
          : event.reason
    });
  });

  runtimeLog.info('Runtime logging initialized');
};
