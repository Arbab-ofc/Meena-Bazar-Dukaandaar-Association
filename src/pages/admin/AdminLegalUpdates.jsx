import { useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-heading text-4xl text-text">Legal Updates</h2>
        <Button className="w-full sm:w-auto" onClick={() => setOpen(true)}>Add Legal Update</Button>
      </div>
      <Card className="overflow-hidden">
        <div className="divide-y divide-border md:hidden">
          {loading ? (
            <p className="p-4 text-sm text-text-muted">Loading...</p>
          ) : paginated.length ? (
            paginated.map((item) => (
              <article key={item.id} className="p-4">
                <div className="flex flex-col gap-3">
                  <div className="min-w-0">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <p className="break-words text-sm font-medium text-text">{item.caseNumber || 'No case number'}</p>
                      <Badge className="shrink-0" variant={item.status === LEGAL_STATUS.RESOLVED ? 'success' : item.status === LEGAL_STATUS.PENDING ? 'warning' : 'accent'}>{item.status}</Badge>
                    </div>
                    <p className="break-words text-sm text-text">{item.title}</p>
                    <p className="mt-2 break-words text-xs text-text-muted">{item.court}</p>
                    <p className="mt-1 text-xs text-text-subtle">{formatDate(item.createdAt)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button aria-label="Edit" className="inline-flex h-10 w-10 items-center justify-center rounded border border-border" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></button>
                    <Link
                      aria-label="View legal update"
                      className="inline-flex h-10 w-10 items-center justify-center rounded border border-border transition hover:bg-surface-2"
                      to={`/legal-updates/${item.slug}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button aria-label="Delete" className="inline-flex h-10 w-10 items-center justify-center rounded border border-red-500/30 text-red-600" onClick={async () => { if (window.confirm('Delete this legal update?')) { await deleteLegalUpdate(item.id); await load(); } }}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="p-4 text-sm text-text-muted">No legal updates found.</p>
          )}
        </div>

        <div className="hidden md:block">
          <table className="w-full text-sm">
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
              ) : paginated.length ? paginated.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="max-w-[11rem] px-4 py-3"><p className="break-words">{item.caseNumber}</p></td>
                  <td className="max-w-sm px-4 py-3"><p className="break-words">{item.title}</p></td>
                  <td className="max-w-[12rem] px-4 py-3"><p className="break-words">{item.court}</p></td>
                  <td className="px-4 py-3"><Badge variant={item.status === LEGAL_STATUS.RESOLVED ? 'success' : item.status === LEGAL_STATUS.PENDING ? 'warning' : 'accent'}>{item.status}</Badge></td>
                  <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button aria-label="Edit" className="rounded border border-border p-2" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></button>
                      <Link
                        aria-label="View legal update"
                        className="rounded border border-border p-2 transition hover:bg-surface-2"
                        to={`/legal-updates/${item.slug}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button aria-label="Delete" className="rounded border border-red-500/30 p-2 text-red-600" onClick={async () => { if (window.confirm('Delete this legal update?')) { await deleteLegalUpdate(item.id); await load(); } }}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td className="px-4 py-4 text-text-muted" colSpan={6}>No legal updates found.</td></tr>
              )}
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
