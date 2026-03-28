import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import MobileDrawer from '@/components/layout/MobileDrawer';
import { useAuth } from '@/hooks/useAuth';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useToast } from '@/components/ui/Toast';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Team', href: '/team' },
  { label: 'Members', href: '/members' },
  { label: 'Notices', href: '/notices' },
  { label: 'Legal Updates', href: '/legal-updates' },
  { label: 'Documents', href: '/documents' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
  { label: 'Links', href: '/links' }
];

const Header = () => {
  const scrollY = useScrollPosition();
  const isScrolled = scrollY > 60;
  const [isMobileOpen, setMobileOpen] = useState(false);
  const { isAdmin, signOut } = useAuth();
  const reduceMotion = useReducedMotion();
  const { addToast } = useToast();

  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', isMobileOpen);
    return () => document.body.classList.remove('mobile-menu-open');
  }, [isMobileOpen]);

  const headerClass = useMemo(
    () =>
      isScrolled
        ? 'bg-[var(--glass-bg)] border-b border-border backdrop-blur-xl'
        : 'bg-transparent border-b border-transparent',
    [isScrolled]
  );

  return (
    <>
      <motion.header animate={{ opacity: 1 }} className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${headerClass}`}>
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 py-3 md:px-6">
          <Link to="/" className="min-w-0">
            <p className="truncate font-heading text-lg tracking-wide text-text md:text-2xl">Patna Market Dukaandaar Association</p>
            <p className="truncate text-xs uppercase tracking-[0.16em] text-gold-muted">Meena Bazar</p>
          </Link>

          <div className="flex items-center gap-2 justify-self-end">
            <button
              aria-label="Toggle menu"
              className="relative inline-flex h-10 items-center gap-2 rounded border border-border bg-surface px-3"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <motion.span
                animate={{ rotate: isMobileOpen ? 90 : 0 }}
                transition={reduceMotion ? { duration: 0.01 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <Menu className="h-4 w-4 text-text" />
              </motion.span>
              <span className="hidden text-sm text-text-muted sm:inline">Menu</span>
            </button>
          </div>
        </div>
      </motion.header>
      <MobileDrawer
        open={isMobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
        isAdmin={isAdmin}
        onLogout={async () => {
          try {
            await signOut();
            addToast({ variant: 'success', message: 'Logged out successfully.' });
            setMobileOpen(false);
          } catch (error) {
            addToast({ variant: 'error', message: error.message || 'Unable to logout.' });
          }
        }}
      />
    </>
  );
};

export default Header;
