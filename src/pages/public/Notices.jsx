import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getFeaturedNotices, getPublishedNotices } from '@/services/firestore/noticesService';
import NoticeCard from '@/components/common/NoticeCard';
import SectionHeading from '@/components/ui/SectionHeading';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';

const PAGE_SIZE = 9;

const Notices = () => {
  const [items, setItems] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [year, setYear] = useState('All');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = 'Official Notices | Meena Bazar Dukaandaar Association';
  }, []);

  useEffect(() => {
    const load = async () => {
      const [featuredData, noticeData] = await Promise.allSettled([
        getFeaturedNotices(1),
        getPublishedNotices(100)
      ]);
      setFeatured(featuredData.status === 'fulfilled' ? featuredData.value[0] || null : null);
      setItems(noticeData.status === 'fulfilled' ? noticeData.value : []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (year === 'All') return items;
    return items.filter((item) => {
      const date = item.createdAt?.toDate ? item.createdAt.toDate() : new Date(item.createdAt?.seconds ? item.createdAt.seconds * 1000 : item.createdAt);
      return String(date.getFullYear()) === year;
    });
  }, [items, year]);

  const years = useMemo(() => {
    const values = new Set(['All']);
    items.forEach((item) => {
      const date = item.createdAt?.toDate ? item.createdAt.toDate() : new Date(item.createdAt?.seconds ? item.createdAt.seconds * 1000 : item.createdAt);
      if (!Number.isNaN(date.getTime())) values.add(String(date.getFullYear()));
    });
    return Array.from(values);
  }, [items]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [year, items.length]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-10">
        <h1 className="font-heading text-5xl text-text">Official Notices</h1>
      </section>

      <div className="mt-8 max-w-xs">
        <Select
          label="Filter by Year"
          value={year}
          onChange={(event) => setYear(event.target.value)}
          options={years.map((value) => ({ value, label: value }))}
        />
      </div>

      {loading ? (
        <div className="mt-8 space-y-6"><Skeleton variant="card" className="h-72" /><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{[1,2,3].map((id)=> <Skeleton key={id} variant="card" className="h-56" />)}</div></div>
      ) : (
        <>
          {featured ? (
            <section className="mt-12">
              <SectionHeading label="Featured" title="Highlighted Notice" />
              <div className="mt-6"><NoticeCard notice={featured} featured /></div>
            </section>
          ) : null}

          <section className="mt-12">
            <SectionHeading title="All Notices" />
            {filtered.length ? (
              <>
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{paginated.map((notice) => <NoticeCard key={notice.id} notice={notice} />)}</div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            ) : (
              <div className="mt-6"><EmptyState title="No notices available" description="No published notices match the selected year." /></div>
            )}
          </section>
        </>
      )}
    </motion.div>
  );
};

export default Notices;
