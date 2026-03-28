import { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import NoticeCard from '@/components/common/NoticeCard';
import { getNoticeBySlug, getPublishedNotices } from '@/services/firestore/noticesService';
import { formatDateLong } from '@/utils/formatDate';
import { useToast } from '@/components/ui/Toast';

const NoticeDetail = () => {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const [current, notices] = await Promise.all([getNoticeBySlug(slug), getPublishedNotices(6)]);
        setItem(current);
        setRelated(notices.filter((notice) => notice.slug !== slug).slice(0, 3));
        document.title = current ? `${current.title} | Notices` : 'Notice Not Found';
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-10 md:px-6"><Skeleton variant="card" className="h-96" /></div>;
  if (!item) return <div className="mx-auto max-w-7xl px-4 py-10 md:px-6"><EmptyState title="Notice not found" description="The requested notice could not be located." /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Notices', href: '/notices' }, { label: item.title }]} />
      <article className="rounded-[var(--radius-lg)] border border-border bg-surface p-8">
        <h1 className="font-heading text-5xl text-text">{item.title}</h1>
        <p className="mt-3 text-sm text-text-muted">Published {formatDateLong(item.createdAt)} {item.author ? `| ${item.author}` : ''}</p>
        <div className="prose prose-neutral mt-6 max-w-none whitespace-pre-line text-text-muted">{item.content}</div>
        <div className="mt-8">
          <Button
            variant="secondary"
            leftIcon={<Copy className="h-4 w-4" />}
            onClick={async () => {
              await navigator.clipboard.writeText(window.location.href);
              addToast({ variant: 'success', message: 'Notice link copied.' });
            }}
          >
            Share
          </Button>
        </div>
      </article>

      <section className="mt-12">
        <h2 className="font-heading text-4xl text-text">Related Notices</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">{related.map((notice) => <NoticeCard key={notice.id} notice={notice} />)}</div>
        <div className="mt-6"><Link to="/notices"><Button variant="ghost">Back to Notices</Button></Link></div>
      </section>
    </div>
  );
};

export default NoticeDetail;
