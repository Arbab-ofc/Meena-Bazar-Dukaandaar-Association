import { useEffect, useState } from 'react';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import { createLink, deleteLink, getLinks, updateLink } from '@/services/firestore/linksService';
import { useAuth } from '@/hooks/useAuth';

const initialValues = {
  title: '',
  url: '',
  type: 'Document',
  description: '',
  status: 'published'
};

const linkTypeOptions = [
  { label: 'Document', value: 'Document' },
  { label: 'Video', value: 'Video' },
  { label: 'Other', value: 'Other' }
];

const statusOptions = [
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' }
];

const AdminLinks = () => {
  const { adminData } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [isOpen, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState(initialValues);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await getLinks());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Manage Links | Admin';
    load();
  }, []);

  const filtered = typeFilter === 'All' ? items : items.filter((item) => item.type === typeFilter);

  const resetForm = () => {
    setOpen(false);
    setEditing(null);
    setValues(initialValues);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title: values.title.trim(),
      url: values.url.trim(),
      type: values.type,
      description: values.description.trim(),
      status: values.status,
      createdBy: adminData?.uid || adminData?.id || ''
    };

    if (editing) await updateLink(editing.id, payload);
    else await createLink(payload);

    resetForm();
    await load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-4xl text-text">Links</h2>
        <div className="flex gap-2">
          <Select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            options={[{ label: 'All', value: 'All' }, ...linkTypeOptions]}
          />
          <Button
            onClick={() => {
              setEditing(null);
              setValues(initialValues);
              setOpen(true);
            }}
          >
            Add Link
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? <p className="text-text-muted">Loading...</p> : filtered.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <Badge variant={item.type === 'Video' ? 'gold' : 'accent'}>{item.type}</Badge>
              <Badge variant={item.status === 'published' ? 'success' : 'warning'}>{item.status}</Badge>
            </div>
            <p className="font-medium text-text">{item.title}</p>
            <p className="mt-1 line-clamp-2 text-sm text-text-muted">{item.description || 'No description provided.'}</p>
            <a href={item.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover">
              Open Link <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <div className="mt-3 flex gap-2">
              <button
                className="rounded border border-border p-2"
                aria-label="Edit"
                onClick={() => {
                  setEditing(item);
                  setValues({
                    title: item.title || '',
                    url: item.url || '',
                    type: item.type || 'Document',
                    description: item.description || '',
                    status: item.status || 'published'
                  });
                  setOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                className="rounded border border-red-500/30 p-2 text-red-600"
                aria-label="Delete"
                onClick={async () => {
                  if (window.confirm('Delete this link?')) {
                    await deleteLink(item.id);
                    await load();
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {!loading && !filtered.length ? (
        <p className="mt-6 text-sm text-text-muted">No links found for the selected filter.</p>
      ) : null}

      <Modal isOpen={isOpen} onClose={resetForm} title={editing ? 'Edit Link' : 'Add Link'} size="lg">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            label="Title"
            value={values.title}
            onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
            required
          />
          <Input
            label="URL"
            type="url"
            placeholder="https://example.com/file-or-video"
            value={values.url}
            onChange={(event) => setValues((prev) => ({ ...prev, url: event.target.value }))}
            required
          />
          <Select
            label="Type"
            value={values.type}
            onChange={(event) => setValues((prev) => ({ ...prev, type: event.target.value }))}
            options={linkTypeOptions}
          />
          <Select
            label="Status"
            value={values.status}
            onChange={(event) => setValues((prev) => ({ ...prev, status: event.target.value }))}
            options={statusOptions}
          />
          <Textarea
            label="Description"
            rows={3}
            value={values.description}
            onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
          />
          <div className="flex justify-end">
            <Button type="submit">{editing ? 'Update Link' : 'Create Link'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminLinks;
