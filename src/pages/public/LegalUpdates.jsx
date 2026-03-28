import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import LegalUpdateCard from '@/components/common/LegalUpdateCard';
import SectionHeading from '@/components/ui/SectionHeading';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { getLegalUpdates } from '@/services/firestore/legalUpdatesService';
import { SEED_LEGAL_UPDATES } from '@/data/seedData';

const PAGE_SIZE = 8;

const LegalUpdates = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = 'Legal Updates | Meena Bazar Dukaandaar Association';
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLegalUpdates();
        setItems(data.length ? data : SEED_LEGAL_UPDATES.map((item) => ({ ...item, slug: 'letters-patent-appeal-lpa-486-2021' })));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paginated = useMemo(
    () => items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [items, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-10">
        <h1 className="font-heading text-5xl text-text">Legal Updates</h1>
      </section>
      <section className="mt-12">
        <SectionHeading title="Case Timeline and Proceedings" subtitle="Formal legal updates from courts and commissions." />
        {loading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">{[1, 2, 3].map((id) => <Skeleton key={id} variant="card" className="h-60" />)}</div>
        ) : items.length ? (
          <>
            <div className="mt-8 space-y-6">{paginated.map((item) => <LegalUpdateCard key={item.id} item={item} />)}</div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        ) : (
          <div className="mt-8"><EmptyState title="No legal updates found" description="Case records will appear here when published." /></div>
        )}
      </section>
    </motion.div>
  );
};

export default LegalUpdates;
