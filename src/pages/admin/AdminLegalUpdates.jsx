import { useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { createLegalUpdate, deleteLegalUpdate, getLegalUpdates, updateLegalUpdate } from '@/services/firestore/legalUpdatesService';
import { slugify } from '@/utils/slugify';
import { LEGAL_STATUS } from '@/data/constants';
import { formatDate } from '@/utils/formatDate';

const initialValues = {
  title: '',
  slug: '',
  caseNumber: '',
  court: '',
  summary: '',
  content: '',
  status: LEGAL_STATUS.ACTIVE,
  documentLinks: [{ label: '', url: '' }]
};
const PAGE_SIZE = 10;

const AdminLegalUpdates = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState(initialValues);
  const [currentPage, setCurrentPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await getLegalUpdates());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Manage Legal Updates | Admin';
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

  const openEdit = (item) => {
    setEditing(item);
    setValues({ ...initialValues, ...item, documentLinks: item.documentLinks?.length ? item.documentLinks : [{ label: '', url: '' }] });
    setOpen(true);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...values,
      slug: values.slug || slugify(values.title),
      documentLinks: values.documentLinks.filter((link) => link.label && link.url)
    };

    if (editing) await updateLegalUpdate(editing.id, payload);
    else await createLegalUpdate(payload);
    setOpen(false);
    setEditing(null);
    setValues(initialValues);
    await load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-4xl text-text">Legal Updates</h2>
        <Button onClick={() => setOpen(true)}>Add Legal Update</Button>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-surface-2 text-left text-text-muted">
              <tr>
                <th className="px-4 py-3">Case</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Court</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-4 text-text-muted" colSpan={6}>Loading...</td></tr>
              ) : paginated.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3">{item.caseNumber}</td>
                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3">{item.court}</td>
                  <td className="px-4 py-3"><Badge variant={item.status === LEGAL_STATUS.RESOLVED ? 'success' : item.status === LEGAL_STATUS.PENDING ? 'warning' : 'accent'}>{item.status}</Badge></td>
                  <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button aria-label="Edit" className="rounded border border-border p-2" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></button>
                      <button aria-label="Delete" className="rounded border border-red-500/30 p-2 text-red-600" onClick={async () => { if (window.confirm('Delete this legal update?')) { await deleteLegalUpdate(item.id); await load(); } }}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {!loading && items.length ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : null}

      <Modal isOpen={isOpen} onClose={() => { setOpen(false); setEditing(null); setValues(initialValues); }} title={editing ? 'Edit Legal Update' : 'Create Legal Update'} size="xl">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input label="Title" value={values.title} onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value, slug: editing ? prev.slug : slugify(event.target.value) }))} required />
          <Input label="Slug" value={values.slug} onChange={(event) => setValues((prev) => ({ ...prev, slug: slugify(event.target.value) }))} required />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Case Number" value={values.caseNumber} onChange={(event) => setValues((prev) => ({ ...prev, caseNumber: event.target.value }))} required />
            <Input label="Court / Commission" value={values.court} onChange={(event) => setValues((prev) => ({ ...prev, court: event.target.value }))} required />
          </div>
          <Textarea label="Summary" rows={3} value={values.summary} onChange={(event) => setValues((prev) => ({ ...prev, summary: event.target.value }))} required />
          <Textarea label="Content" rows={8} value={values.content} onChange={(event) => setValues((prev) => ({ ...prev, content: event.target.value }))} />
          <Select
            label="Status"
            value={values.status}
            onChange={(event) => setValues((prev) => ({ ...prev, status: event.target.value }))}
            options={Object.values(LEGAL_STATUS).map((value) => ({ label: value, value }))}
          />

          <div className="space-y-2">
            <p className="text-sm font-medium text-text">Document Links</p>
            {values.documentLinks.map((link, index) => (
              <div key={`${index}-${link.url}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                <Input placeholder="Label" value={link.label} onChange={(event) => setValues((prev) => ({ ...prev, documentLinks: prev.documentLinks.map((item, i) => i === index ? { ...item, label: event.target.value } : item) }))} />
                <Input placeholder="URL" value={link.url} onChange={(event) => setValues((prev) => ({ ...prev, documentLinks: prev.documentLinks.map((item, i) => i === index ? { ...item, url: event.target.value } : item) }))} />
                <Button type="button" variant="ghost" onClick={() => setValues((prev) => ({ ...prev, documentLinks: prev.documentLinks.filter((_, i) => i !== index) }))}>Remove</Button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={() => setValues((prev) => ({ ...prev, documentLinks: [...prev.documentLinks, { label: '', url: '' }] }))}>Add Link</Button>
          </div>

          <div className="flex justify-end"><Button type="submit">{editing ? 'Update' : 'Create'}</Button></div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminLegalUpdates;
