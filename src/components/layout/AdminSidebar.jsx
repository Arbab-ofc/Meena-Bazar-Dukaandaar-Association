import { Bell, FolderOpen, Image, LayoutDashboard, Link as LinkIcon, LogOut, MessageSquare, Scale, Store, User, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';

const links = [
  ['Dashboard', '/admin/dashboard', LayoutDashboard],
  ['Notices', '/admin/notices', Bell],
  ['Legal Updates', '/admin/legal-updates', Scale],
  ['Documents', '/admin/documents', FolderOpen],
  ['Gallery', '/admin/gallery', Image],
  ['Links', '/admin/links', LinkIcon],
  ['Team', '/admin/team', Users],
  ['Members', '/admin/members', Store],
  ['Contact Submissions', '/admin/contact-submissions', MessageSquare],
  ['Profile', '/admin/profile', User]
];

/** @param {{mobile?: boolean, onNavigate?: () => void}} props */
const AdminSidebar = ({ mobile = false, onNavigate }) => {
  const { signOut } = useAuth();
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
    <aside className={`flex h-full flex-col border-r border-border bg-surface ${mobile ? 'w-[85vw] max-w-sm p-4' : 'w-72 p-5'}`}>
      <p className="font-heading text-2xl text-text">Meena Bazar Dukaandaar Association</p>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold-muted">Admin Portal</p>
      <nav className="mt-8 flex-1 space-y-1">
        {links.map(([label, href, Icon]) => (
          <NavLink
            key={href}
            to={href}
            onClick={onNavigate}
            className={({ isActive }) => `flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-sm transition ${isActive ? 'bg-accent/15 text-accent' : 'text-text-muted hover:bg-surface-2 hover:text-text'}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <button onClick={handleLogout} className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius)] border border-border px-3 py-2 text-sm text-text-muted transition hover:bg-surface-2 hover:text-text">
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
