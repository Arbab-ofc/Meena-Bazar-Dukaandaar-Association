import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import Button from '@/components/ui/Button';
import { seedInitialDataToDb } from '@/services/firestore/seedService';
import { useAuth } from '@/hooks/useAuth';

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const hasSeeded = useRef(false);

  useEffect(() => {
    if (!isAdmin || hasSeeded.current) return;

    hasSeeded.current = true;
    seedInitialDataToDb().catch(() => {
      hasSeeded.current = false;
    });
  }, [isAdmin]);

  return (
    <div className="flex min-h-screen bg-bg">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>
      <AnimatePresence>
        {open ? (
          <>
            <motion.button className="fixed inset-0 z-40 bg-black/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} aria-label="Close sidebar backdrop" />
            <motion.div className="fixed left-0 top-0 z-50 h-full lg:hidden" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 32 }}>
              <AdminSidebar mobile onNavigate={() => setOpen(false)} />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminHeader onToggleSidebar={() => setOpen((prev) => !prev)} />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-4 flex justify-end">
            <Button size="sm" variant="secondary" leftIcon={<Home className="h-4 w-4" />} onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
