import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** @param {{open: boolean, onClose: () => void, links: Array<{label: string, href: string}>, isAdmin?: boolean, onLogout?: () => void}} props */
const MobileDrawer = ({ open, onClose, links, isAdmin = false, onLogout }) => {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {open ? (
        <>
          <motion.button
            aria-label="Close mobile menu"
            className="fixed inset-0 z-50 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0.01 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
          />
          <motion.aside
            className="mobile-drawer fixed right-0 top-0 z-[60] flex h-[100dvh] max-h-[100dvh] w-[84vw] max-w-[420px] flex-col overflow-hidden border-l border-border bg-bg-elevated p-5 shadow-xl sm:p-6"
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={reduceMotion ? { duration: 0.01 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-heading text-xl leading-tight text-text sm:text-2xl">Patna Market Dukaandaar Association</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold-muted">Meena Bazar</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-text-muted">Theme</span>
              <ThemeToggle />
            </div>
            <motion.nav
              className="mt-6 min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pb-6 pr-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: reduceMotion ? undefined : { staggerChildren: 0.05, delayChildren: 0.02 }
                }
              }}
            >
              {links.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, x: reduceMotion ? 0 : 12 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  transition={reduceMotion ? { duration: 0.01 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to={item.href} className="block text-base text-text-muted transition-colors hover:text-text" onClick={onClose}>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {isAdmin ? (
                <>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: reduceMotion ? 0 : 12 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    transition={reduceMotion ? { duration: 0.01 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link to="/admin/dashboard" className="block text-base text-text-muted transition-colors hover:text-text" onClick={onClose}>
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.button
                    variants={{
                      hidden: { opacity: 0, x: reduceMotion ? 0 : 12 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    transition={reduceMotion ? { duration: 0.01 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    onClick={onLogout}
                    className="text-base text-text-muted transition-colors hover:text-text"
                  >
                    Logout
                  </motion.button>
                </>
              ) : null}
            </motion.nav>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default MobileDrawer;
