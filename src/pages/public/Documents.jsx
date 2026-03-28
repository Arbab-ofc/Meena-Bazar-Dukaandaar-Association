import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import DocumentCard from '@/components/common/DocumentCard';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { getDocuments } from '@/services/firestore/documentsService';
import { DOCUMENT_CATEGORIES } from '@/data/constants';

const PAGE_SIZE = 9;

const Documents = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const category = searchParams.get('category') || 'All';

  useEffect(() => {
    document.title = 'Documents Library | Meena Bazar Dukaandaar Association';
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDocuments();
        setItems(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = category === 'All' ? items : items.filter((item) => item.category === category);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, items.length]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-10">
        <h1 className="font-heading text-5xl text-text">Documents</h1>
      </section>

      <section className="mt-12">
        <SectionHeading title="Legal and Institutional Records" />
        <div className="mt-6 flex flex-wrap gap-2">
          {DOCUMENT_CATEGORIES.map((item) => (
            <button
              key={item}
              onClick={() => setSearchParams(item === 'All' ? {} : { category: item })}
              className={`rounded-full border px-4 py-2 text-sm transition ${category === item ? 'border-gold bg-gold/15 text-gold' : 'border-border bg-surface text-text-muted hover:text-text'}`}
            >
              {item}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map((id)=><Skeleton key={id} variant="card" className="h-64" />)}</div>
        ) : filtered.length ? (
          <>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{paginated.map((item) => <DocumentCard key={item.id} item={item} />)}</div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        ) : (
          <div className="mt-8"><EmptyState title="No documents available" description="No document records match the selected category." /></div>
        )}
      </section>
    </motion.div>
  );
};

export default Documents;
