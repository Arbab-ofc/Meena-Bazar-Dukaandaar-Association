import { useEffect, useMemo, useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { SUBMISSION_STATUS } from '@/data/constants';
import { deleteSubmission, getSubmissions, updateStatus } from '@/services/firestore/contactService';
import { formatDateLong } from '@/utils/formatDate';

const PAGE_SIZE = 10;

const AdminContactSubmissions = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const load = async () => setItems(await getSubmissions());

  useEffect(() => {
    document.title = 'Contact Submissions | Admin';
    load();
  }, []);

  const filtered = useMemo(() => filter === 'All' ? items : items.filter((item) => item.status === filter), [filter, items]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, items.length]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-4xl text-text">Contact Submissions</h2>
        <Select value={filter} onChange={(event) => setFilter(event.target.value)} options={[{ label: 'All', value: 'All' }, { label: 'New', value: SUBMISSION_STATUS.NEW }, { label: 'Read', value: SUBMISSION_STATUS.READ }, { label: 'Replied', value: SUBMISSION_STATUS.REPLIED }]} />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-surface-2 text-left text-text-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.phone || '-'}</td>
                  <td className="px-4 py-3">{formatDateLong(item.createdAt)}</td>
                  <td className="px-4 py-3"><Badge variant={item.status === 'new' ? 'warning' : item.status === 'replied' ? 'success' : 'accent'}>{item.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="rounded border border-border p-2" onClick={() => setSelected(item)}><Eye className="h-4 w-4" /></button>
                      <button className="rounded border border-red-500/30 p-2 text-red-600" onClick={async () => { if (window.confirm('Delete this submission?')) { await deleteSubmission(item.id); await load(); } }}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {filtered.length ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : null}

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Submission Details" size="lg">
        {selected ? (
          <div className="space-y-4">
            <p><span className="font-medium">Name:</span> {selected.name}</p>
            <p><span className="font-medium">Email:</span> {selected.email}</p>
            <p><span className="font-medium">Phone:</span> {selected.phone || '-'}</p>
            <p><span className="font-medium">Date:</span> {formatDateLong(selected.createdAt)}</p>
            <div className="rounded-[var(--radius)] border border-border bg-surface p-4 whitespace-pre-line text-sm text-text-muted">{selected.message}</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={async () => { await updateStatus(selected.id, SUBMISSION_STATUS.READ); await load(); setSelected((prev) => ({ ...prev, status: SUBMISSION_STATUS.READ })); }}>Mark as Read</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default AdminContactSubmissions;
