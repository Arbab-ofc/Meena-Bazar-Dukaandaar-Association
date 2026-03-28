import { useEffect, useMemo, useState } from 'react';
import { Bell, FileText, Image, LayoutGrid, Link as LinkIcon, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { getNotices } from '@/services/firestore/noticesService';
import { getDocuments } from '@/services/firestore/documentsService';
import { getGalleryItems } from '@/services/firestore/galleryService';
import { getSubmissions } from '@/services/firestore/contactService';
import { getLinks } from '@/services/firestore/linksService';
import { formatDate } from '@/utils/formatDate';

const Dashboard = () => {
  const { adminData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [links, setLinks] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    document.title = 'Admin Dashboard | Meena Bazar Dukaandaar Association';
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [n, d, g, l, s] = await Promise.all([getNotices(), getDocuments(), getGalleryItems(), getLinks(), getSubmissions()]);
        setNotices(n);
        setDocuments(d);
        setGallery(g);
        setLinks(l);
        setSubmissions(s);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(
    () => [
      ['Total Notices', notices.length, Bell],
      ['Total Documents', documents.length, FileText],
      ['Total Gallery Items', gallery.length, Image],
      ['Total Links', links.length, LinkIcon],
      ['New Contact Submissions', submissions.filter((s) => s.status === 'new').length, Mail]
    ],
    [documents.length, gallery.length, links.length, notices.length, submissions]
  );

  return (
    <div className="space-y-8">
      <h2 className="font-heading text-4xl text-text">Welcome back, {adminData?.name || 'Administrator'}</h2>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {loading
          ? [1, 2, 3, 4, 5].map((id) => <Skeleton key={id} variant="card" className="h-28" />)
          : stats.map(([label, value, Icon]) => (
              <Card key={label} className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-muted">{label}</p>
                    <p className="mt-1 font-heading text-4xl text-text">{value}</p>
                  </div>
                  <span className="rounded-[var(--radius)] bg-accent/10 p-3 text-accent"><Icon className="h-5 w-5" /></span>
                </div>
              </Card>
            ))}
      </section>

      <section>
        <h3 className="mb-4 font-heading text-3xl text-text">Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ['Add Notice', '/admin/notices'],
            ['Add Document', '/admin/documents'],
            ['Add Gallery Item', '/admin/gallery'],
            ['Add Link', '/admin/links'],
            ['Add Team Member', '/admin/team']
          ].map(([label, href]) => (
            <Link key={href} to={href}>
              <Card hover className="p-4 text-center"><p className="text-sm font-medium text-text">{label}</p></Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-heading text-2xl text-text">Latest Notices</h4>
            <Link to="/admin/notices"><Button size="sm" variant="ghost">View All</Button></Link>
          </div>
          <div className="space-y-3">
            {notices.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-[var(--radius)] border border-border p-3">
                <div>
                  <p className="text-sm text-text">{item.title}</p>
                  <p className="text-xs text-text-subtle">{formatDate(item.createdAt)}</p>
                </div>
                <Badge variant={item.status === 'published' ? 'success' : 'warning'}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-heading text-2xl text-text">Latest Contact Submissions</h4>
            <Link to="/admin/contact-submissions"><Button size="sm" variant="ghost">View All</Button></Link>
          </div>
          <div className="space-y-3">
            {submissions.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-[var(--radius)] border border-border p-3">
                <div>
                  <p className="text-sm text-text">{item.name}</p>
                  <p className="text-xs text-text-subtle">{item.email}</p>
                </div>
                <Badge variant={item.status === 'new' ? 'warning' : item.status === 'replied' ? 'success' : 'accent'}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
