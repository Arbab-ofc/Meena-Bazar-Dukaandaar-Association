import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

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
  const { adminData } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-border bg-bg-elevated px-3 py-2 sm:px-4 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button className="inline-flex shrink-0 rounded border border-border p-2 lg:hidden" onClick={onToggleSidebar} aria-label="Toggle admin sidebar">
          <Menu className="h-4 w-4" />
        </button>
        <h1 className="min-w-0 truncate font-heading text-2xl leading-tight text-text sm:text-3xl">{titleMap[location.pathname] || 'Admin'}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden text-right md:block">
          <p className="text-sm text-text">{adminData?.name || 'Administrator'}</p>
          <p className="text-xs text-text-muted">{adminData?.role || 'Admin'}</p>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
