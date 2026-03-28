import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { getLegalUpdateBySlug } from '@/services/firestore/legalUpdatesService';
import { SEED_LEGAL_UPDATES } from '@/data/seedData';
import { formatDateLong } from '@/utils/formatDate';

const LegalUpdateDetail = () => {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLegalUpdateBySlug(slug);
        setItem(data || (slug === 'letters-patent-appeal-lpa-486-2021' ? { ...SEED_LEGAL_UPDATES[0], slug } : null));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-10 md:px-6"><Skeleton variant="card" className="h-96" /></div>;
  if (!item) return <div className="mx-auto max-w-7xl px-4 py-10 md:px-6"><EmptyState title="Legal update not found" /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Legal Updates', href: '/legal-updates' }, { label: item.title }]} />
      <article className="rounded-[var(--radius-lg)] border border-border bg-surface p-8">
        <Badge variant="gold" className="mb-4">{item.caseNumber}</Badge>
        <h1 className="font-heading text-5xl text-text">{item.title}</h1>
        <p className="mt-3 text-sm text-text-muted">{item.court} | {formatDateLong(item.createdAt)}</p>
        <p className="mt-6 text-text-muted">{item.summary}</p>

        <section className="mt-8">
          <h2 className="font-heading text-3xl text-text">Documents</h2>
          {item.documentLinks?.length ? (
            <ul className="mt-4 space-y-3">
              {item.documentLinks.map((link) => (
                <li key={link.url}><a href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover"><FileText className="h-4 w-4" /> {link.label}</a></li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-text-muted">No documents linked yet.</p>
          )}
        </section>

        <section className="mt-8">
          <h2 className="font-heading text-3xl text-text">Timeline</h2>
          <ol className="mt-4 space-y-3 border-l border-border pl-5 text-sm text-text-muted">
            <li>Case listed before competent authority.</li>
            <li>Association submissions filed on behalf of member merchants.</li>
            <li>Proceedings continue as per listing and judicial direction.</li>
          </ol>
        </section>

        <div className="mt-8"><Link to="/legal-updates"><Button variant="ghost">Back to Legal Updates</Button></Link></div>
      </article>
    </div>
  );
};

export default LegalUpdateDetail;
