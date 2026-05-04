import { useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import { MEMBER_STATUS } from '@/data/constants';
import { uploadImageToImageKit } from '@/services/imagekit/imagekitService';
import { createMember, deleteMember, getMembers, updateMember } from '@/services/firestore/membersService';

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const defaultSchedule = () => Object.fromEntries(WEEK_DAYS.map((day) => [day, true]));
const PAGE_SIZE = 10;
const getInitialValues = () => ({
  shopNumber: '',
  shopName: '',
  ownerName: '',
  displayOrder: 1,
  status: MEMBER_STATUS.ACTIVE,
  openTime: '',
  closeTime: '',
  shopImageUrl: '',
  ownerImageUrl: '',
  schedule: defaultSchedule()
});

const AdminMembers = () => {
  const [items, setItems] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState(getInitialValues);
  const [search, setSearch] = useState('');
  const [shopImageFile, setShopImageFile] = useState(null);
  const [ownerImageFile, setOwnerImageFile] = useState(null);
  const [uploading, setUploading] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const load = async () => setItems(await getMembers());

  useEffect(() => {
    document.title = 'Manage Members | Admin';
    load();
  }, []);

  const filtered = useMemo(() => items.filter((item) => `${item.shopNumber} ${item.shopName} ${item.ownerName}`.toLowerCase().includes(search.toLowerCase())), [items, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, items.length]);

  const resetForm = () => {
    setOpen(false);
    setEditing(null);
    setValues(getInitialValues());
    setShopImageFile(null);
    setOwnerImageFile(null);
    setUploadError('');
  };

  const uploadMemberImage = async ({ file, folder, field, uploadKey }) => {
    if (!file) return;
    setUploading(uploadKey);
    setUploadError('');

    try {
      const upload = await uploadImageToImageKit(file, {
        folder,
        fileName: `${Date.now()}-${file.name}`
      });
      setValues((prev) => ({ ...prev, [field]: upload.url || '' }));
    } catch (error) {
      setUploadError(error.message || 'Image upload failed.');
    } finally {
      setUploading('');
    }
  };

  const openEdit = (item) => {
    setEditing(item);
    setValues({
      ...getInitialValues(),
      ...item,
      schedule: { ...defaultSchedule(), ...(item.schedule || {}) }
    });
    setShopImageFile(null);
    setOwnerImageFile(null);
    setUploadError('');
    setOpen(true);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...values,
      displayOrder: Number(values.displayOrder || 0),
      schedule: values.schedule || defaultSchedule()
    };
    if (editing) await updateMember(editing.id, payload);
    else await createMember(payload);
    resetForm();
    await load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="font-heading text-4xl text-text">Members</h2>
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] lg:min-w-[460px]">
          <Input className="min-w-0" placeholder="Search members" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Button className="w-full sm:w-auto" onClick={() => { setEditing(null); setValues(getInitialValues()); setShopImageFile(null); setOwnerImageFile(null); setUploadError(''); setOpen(true); }}>
            Add Member
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="divide-y divide-border md:hidden">
          {paginated.length ? (
            paginated.map((item) => (
              <article key={item.id} className="p-4">
                <div className="flex flex-col gap-3">
                  <div className="min-w-0">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words font-heading text-2xl leading-tight text-text">{item.shopName}</p>
                        <p className="mt-1 break-words text-sm text-text-muted">{item.ownerName}</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-text-muted">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs uppercase tracking-[0.12em] text-gold">Shop No. {item.shopNumber}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button aria-label="Edit member" className="inline-flex h-10 w-10 items-center justify-center rounded border border-border" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></button>
                    <button aria-label="Delete member" className="inline-flex h-10 w-10 items-center justify-center rounded border border-red-500/30 text-red-600" onClick={async () => { if (window.confirm('Delete this member?')) { await deleteMember(item.id); await load(); } }}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="p-4 text-sm text-text-muted">No members found.</p>
          )}
        </div>

        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-text-muted">
              <tr>
                <th className="px-4 py-3">Shop Number</th>
                <th className="px-4 py-3">Shop Name</th>
                <th className="px-4 py-3">Owner Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length ? paginated.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3">{item.shopNumber}</td>
                  <td className="max-w-sm px-4 py-3"><p className="break-words">{item.shopName}</p></td>
                  <td className="max-w-sm px-4 py-3"><p className="break-words">{item.ownerName}</p></td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        aria-label="Edit member"
                        className="rounded border border-border p-2"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button aria-label="Delete member" className="rounded border border-red-500/30 p-2 text-red-600" onClick={async () => { if (window.confirm('Delete this member?')) { await deleteMember(item.id); await load(); } }}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td className="px-4 py-4 text-text-muted" colSpan={5}>No members found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {filtered.length ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : null}

      <Modal isOpen={isOpen} onClose={resetForm} title={editing ? 'Edit Member' : 'Add Member'}>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input label="Shop Number" value={values.shopNumber} onChange={(event) => setValues((prev) => ({ ...prev, shopNumber: event.target.value }))} required />
          <Input label="Shop Name" value={values.shopName} onChange={(event) => setValues((prev) => ({ ...prev, shopName: event.target.value }))} required />
          <Input label="Owner Name" value={values.ownerName} onChange={(event) => setValues((prev) => ({ ...prev, ownerName: event.target.value }))} required />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Shop Open Time" type="time" value={values.openTime} onChange={(event) => setValues((prev) => ({ ...prev, openTime: event.target.value }))} />
            <Input label="Shop Close Time" type="time" value={values.closeTime} onChange={(event) => setValues((prev) => ({ ...prev, closeTime: event.target.value }))} />
          </div>
          <div className="space-y-2 rounded-[var(--radius)] border border-border p-3">
            <p className="text-sm font-medium text-text">Shop Picture</p>
            <Input type="file" accept="image/*" onChange={(event) => setShopImageFile(event.target.files?.[0] || null)} />
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => uploadMemberImage({ file: shopImageFile, folder: '/members/shops', field: 'shopImageUrl', uploadKey: 'shop' })}
                disabled={!shopImageFile || uploading === 'shop'}
              >
                {uploading === 'shop' ? 'Uploading...' : 'Upload Shop Image'}
              </Button>
              {values.shopImageUrl ? <p className="text-xs text-green-600">Uploaded</p> : null}
            </div>
          </div>
          <div className="space-y-2 rounded-[var(--radius)] border border-border p-3">
            <p className="text-sm font-medium text-text">Owner Picture</p>
            <Input type="file" accept="image/*" onChange={(event) => setOwnerImageFile(event.target.files?.[0] || null)} />
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => uploadMemberImage({ file: ownerImageFile, folder: '/members/owners', field: 'ownerImageUrl', uploadKey: 'owner' })}
                disabled={!ownerImageFile || uploading === 'owner'}
              >
                {uploading === 'owner' ? 'Uploading...' : 'Upload Owner Image'}
              </Button>
              {values.ownerImageUrl ? <p className="text-xs text-green-600">Uploaded</p> : null}
            </div>
          </div>
          {uploadError ? <p className="text-sm text-red-500">{uploadError}</p> : null}
          <div className="space-y-2 rounded-[var(--radius)] border border-border p-3">
            <p className="text-sm font-medium text-text">Weekly Schedule (Open Days)</p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {WEEK_DAYS.map((day) => (
                <label key={day} className="inline-flex items-center gap-2 text-sm text-text">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={Boolean(values.schedule?.[day])}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        schedule: { ...prev.schedule, [day]: event.target.checked }
                      }))
                    }
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
          <Input label="Display Order" type="number" value={values.displayOrder} onChange={(event) => setValues((prev) => ({ ...prev, displayOrder: event.target.value }))} />
          <Select label="Status" value={values.status} onChange={(event) => setValues((prev) => ({ ...prev, status: event.target.value }))} options={Object.values(MEMBER_STATUS).map((value) => ({ label: value, value }))} />
          <div className="flex justify-end"><Button type="submit">{editing ? 'Update Member' : 'Create Member'}</Button></div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMembers;
