import { Bell, Menu, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';

const titleMap = {
  '/admin/dashboard': 'Dashboard',
  '/admin/notices': 'Manage Notices',
  '/admin/legal-updates': 'Manage Legal Updates',
  '/admin/documents': 'Manage Documents',
  '/admin/gallery': 'Manage Gallery',
  '/admin/links': 'Manage Links',
  '/admin/team': 'Manage Team',
  '/admin/members': 'Manage Members',
  '/admin/contact-submissions': 'Contact Submissions',
  '/admin/profile': 'My Profile'
};

/** @param {{onToggleSidebar: () => void}} props */
const AdminHeader = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { adminData, signOut } = useAuth();
  const { addToast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      addToast({ variant: 'success', message: 'Logged out successfully.' });
    } catch (error) {
      addToast({ variant: 'error', message: error.message || 'Unable to logout.' });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-bg-elevated px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button className="inline-flex rounded border border-border p-2 lg:hidden" onClick={onToggleSidebar} aria-label="Toggle admin sidebar">
          <Menu className="h-4 w-4" />
        </button>
        <h1 className="font-heading text-3xl text-text">{titleMap[location.pathname] || 'Admin'}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm text-text">{adminData?.name || 'Administrator'}</p>
          <p className="text-xs text-text-muted">{adminData?.role || 'Admin'}</p>
        </div>
        <ThemeToggle />
        <button className="rounded border border-border p-2 text-text-muted" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </button>
        <button className="rounded border border-border p-2 text-text-muted" aria-label="Logout" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
