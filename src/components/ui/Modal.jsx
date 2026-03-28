import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl'
};

/** @param {{isOpen: boolean, onClose: () => void, title?: string, children?: import('react').ReactNode, size?: 'sm'|'md'|'lg'|'xl', footer?: import('react').ReactNode}} props */
const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div className="fixed inset-0 z-[90] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close modal backdrop" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className={cn('relative z-10 max-h-[85vh] w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg-elevated shadow-xl', sizes[size])}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-heading text-2xl text-text">{title}</h3>
              <button ref={closeRef} onClick={onClose} aria-label="Close modal" className="rounded p-2 text-text-muted transition hover:bg-surface hover:text-text">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[calc(85vh-140px)] overflow-y-auto overscroll-contain p-5 [touch-action:pan-y]">{children}</div>
            {footer ? <div className="border-t border-border px-5 py-4">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
