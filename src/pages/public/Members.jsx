import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import MemberRow from '@/components/common/MemberRow';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import Pagination from '@/components/ui/Pagination';
import { getMembers } from '@/services/firestore/membersService';

const PAGE_SIZE = 12;

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = 'Member Directory | Meena Bazar Dukaandaar Association';
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMembers();
        setMembers(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return members.filter((item) => {
      const text = `${item.shopName || ''} ${item.ownerName || ''} ${item.shopNumber || ''}`.toLowerCase();
      const matchSearch = text.includes(search.toLowerCase());
      const matchStatus = status === 'All' || item.status === status;
      return matchSearch && matchStatus;
    });
  }, [members, search, status]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-10">
        <h1 className="font-heading text-5xl text-text">Member Directory</h1>
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Input label="Search" placeholder="Search by shop or owner" value={search} onChange={(event) => setSearch(event.target.value)} />
        <Select
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          options={[
            { label: 'All', value: 'All' },
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' }
          ]}
        />
      </div>

      <div className="mt-8 space-y-3">
        {loading ? (
          [1, 2, 3, 4, 5].map((id) => <Skeleton key={id} variant="card" className="h-24" />)
        ) : filtered.length ? (
          paginated.map((member) => <MemberRow key={member.id} member={member} />)
        ) : (
          <EmptyState title="No members found" description="Member records are not available for the current filters." />
        )}
      </div>
      {!loading && filtered.length ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : null}
    </motion.div>
  );
};

export default Members;
