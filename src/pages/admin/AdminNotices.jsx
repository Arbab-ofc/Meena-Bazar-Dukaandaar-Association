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
import { useAuth } from '@/hooks/useAuth';
import { createNotice, deleteNotice, getNotices, updateNotice } from '@/services/firestore/noticesService';
import { slugify } from '@/utils/slugify';
import { formatDate } from '@/utils/formatDate';
import { useToast } from '@/components/ui/Toast';
import { sendContentNotification } from '@/services/push/pushNotificationService';

const initialValues = { title: '', slug: '', summary: '', content: '', status: 'draft', featured: false };
const PAGE_SIZE = 10;

const AdminNotices = () => {
  const { adminData } = useAuth();
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await getNotices());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Manage Notices | Admin';
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

  const openCreate = () => {
    setEditing(null);
    setValues(initialValues);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setValues({
      title: item.title || '',
      slug: item.slug || '',
      summary: item.summary || '',
      content: item.content || '',
      status: item.status || 'draft',
      featured: Boolean(item.featured)
    });
    setOpen(true);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!values.title.trim() || !values.content.trim()) {
      addToast({ variant: 'warning', message: 'Title and content are required.' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...values,
        slug: values.slug || slugify(values.title),
        createdBy: adminData?.uid || adminData?.id || ''
      };

      if (editing) {
        await updateNotice(editing.id, payload);
        addToast({ variant: 'success', message: 'Notice updated.' });
      } else {
        await createNotice(payload);
        if (payload.status === 'published') {
          await sendContentNotification({
            type: 'notice',
            title: 'New Notice Published',
            body: payload.title,
            url: `/notices/${payload.slug}`
          }).catch((error) => {
            addToast({ variant: 'warning', message: error.message || 'Notice created, but notification was not sent.' });
          });
        }
        addToast({ variant: 'success', message: 'Notice created.' });
      }
      setOpen(false);
      await load();
    } catch (error) {
      addToast({ variant: 'error', message: error.message || 'Operation failed.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-heading text-4xl text-text">Notices</h2>
        <Button className="w-full sm:w-auto" onClick={openCreate}>Add New Notice</Button>
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
                      <p className="break-words text-sm font-medium text-text">{item.title}</p>
                      <Badge className="shrink-0" variant={item.status === 'published' ? 'success' : 'warning'}>{item.status}</Badge>
                    </div>
                    <p className="text-xs text-text-muted">Created {formatDate(item.createdAt)}</p>
                    <p className="mt-2 break-words text-xs text-text-subtle">{item.slug}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button aria-label="Edit notice" className="inline-flex h-10 w-10 items-center justify-center rounded border border-border" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></button>
                    <Link
                      aria-label="View notice"
                      className="inline-flex h-10 w-10 items-center justify-center rounded border border-border transition hover:bg-surface-2"
                      to={`/notices/${item.slug}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button aria-label="Delete notice" className="inline-flex h-10 w-10 items-center justify-center rounded border border-red-500/30 text-red-600" onClick={async () => { if (window.confirm('Delete this notice?')) { await deleteNotice(item.id); await load(); } }}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="p-4 text-sm text-text-muted">No notices found.</p>
          )}
        </div>

        <div className="hidden md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-text-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-4 text-text-muted" colSpan={5}>Loading...</td></tr>
              ) : paginated.length ? (
                paginated.map((item) => (
                  <tr key={item.id} className="border-t border-border">
                    <td className="max-w-sm px-4 py-3"><p className="break-words">{item.title}</p></td>
                    <td className="max-w-xs px-4 py-3 text-text-muted"><p className="break-words">{item.slug}</p></td>
                    <td className="px-4 py-3"><Badge variant={item.status === 'published' ? 'success' : 'warning'}>{item.status}</Badge></td>
                    <td className="px-4 py-3 text-text-muted">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button aria-label="Edit notice" className="rounded border border-border p-2" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></button>
                        <Link
                          aria-label="View notice"
                          className="rounded border border-border p-2 transition hover:bg-surface-2"
                          to={`/notices/${item.slug}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button aria-label="Delete notice" className="rounded border border-red-500/30 p-2 text-red-600" onClick={async () => { if (window.confirm('Delete this notice?')) { await deleteNotice(item.id); await load(); } }}><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td className="px-4 py-4 text-text-muted" colSpan={5}>No notices found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {!loading && items.length ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : null}

      <Modal isOpen={isOpen} onClose={() => setOpen(false)} title={editing ? 'Edit Notice' : 'Create Notice'} size="lg">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            label="Title"
            value={values.title}
            onChange={(event) => {
              const title = event.target.value;
              setValues((prev) => ({ ...prev, title, slug: editing ? prev.slug : slugify(title) }));
            }}
            required
          />
          <Input label="Slug" value={values.slug} onChange={(event) => setValues((prev) => ({ ...prev, slug: slugify(event.target.value) }))} required />
          <Textarea label="Summary" rows={3} value={values.summary} onChange={(event) => setValues((prev) => ({ ...prev, summary: event.target.value }))} />
          <Textarea label="Content" rows={10} value={values.content} onChange={(event) => setValues((prev) => ({ ...prev, content: event.target.value }))} required />
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Status"
              value={values.status}
              onChange={(event) => setValues((prev) => ({ ...prev, status: event.target.value }))}
              options={[
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' }
              ]}
            />
            <Select
              label="Featured"
              value={values.featured ? 'yes' : 'no'}
              onChange={(event) => setValues((prev) => ({ ...prev, featured: event.target.value === 'yes' }))}
              options={[
                { label: 'No', value: 'no' },
                { label: 'Yes', value: 'yes' }
              ]}
            />
          </div>
          <div className="flex justify-end"><Button type="submit" loading={saving}>{editing ? 'Update Notice' : 'Create Notice'}</Button></div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminNotices;
