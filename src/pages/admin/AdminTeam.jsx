import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { uploadImageToImageKit } from '@/services/imagekit/imagekitService';
import Pagination from '@/components/ui/Pagination';
import { createMember, deleteMember, getTeamMembers, reorder, updateMember } from '@/services/firestore/teamService';

const initialValues = {
  name: '',
  roleEn: '',
  roleHi: '',
  photoUrl: '',
  designationOrder: 1,
  isLeadership: false,
  isBoardMember: false
};
const PAGE_SIZE = 10;

const AdminTeam = () => {
  const [items, setItems] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState(initialValues);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const load = async () => {
    setItems(await getTeamMembers());
  };

  useEffect(() => {
    document.title = 'Manage Team | Admin';
    load();
  }, []);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paginated = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const resetForm = () => {
    setOpen(false);
    setEditing(null);
    setValues(initialValues);
    setSelectedFile(null);
    setUploadError('');
  };

  const uploadSelectedImage = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError('');

    try {
      const upload = await uploadImageToImageKit(selectedFile, {
        folder: '/team',
        fileName: `${Date.now()}-${selectedFile.name}`
      });
      setValues((prev) => ({ ...prev, photoUrl: upload.url || '' }));
    } catch (error) {
      setUploadError(error.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...values, designationOrder: Number(values.designationOrder || 0) };
    if (editing) await updateMember(editing.id, payload);
    else await createMember(payload);
    resetForm();
    await load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-4xl text-text">Team Members</h2>
        <Button onClick={() => { setEditing(null); setValues(initialValues); setSelectedFile(null); setUploadError(''); setOpen(true); }}>
          Add Team Member
        </Button>
      </div>
      <div className="space-y-3">
        {paginated.map((item) => (
          <Card key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium text-text">{item.name}</p>
              <p className="text-sm text-text-muted">{item.roleEn} / {item.roleHi}</p>
              <div className="mt-2 flex gap-2">
                {item.isLeadership ? <Badge variant="gold">Leadership</Badge> : null}
                {item.isBoardMember ? <Badge variant="accent">Board</Badge> : null}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="rounded border border-border p-2" onClick={() => { setEditing(item); setValues(item); setSelectedFile(null); setUploadError(''); setOpen(true); }}><Pencil className="h-4 w-4" /></button>
              <button className="rounded border border-red-500/30 p-2 text-red-600" onClick={async () => { if (window.confirm('Delete this member?')) { await deleteMember(item.id); await load(); } }}><Trash2 className="h-4 w-4" /></button>
            </div>
          </Card>
        ))}
      </div>
      {items.length ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : null}

      <div className="mt-4"><Button variant="secondary" onClick={async () => { await reorder(items); await load(); }}>Save Current Order</Button></div>

      <Modal isOpen={isOpen} onClose={resetForm} title={editing ? 'Edit Team Member' : 'Add Team Member'}>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input label="Name" value={values.name} onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))} required />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Role (English)" value={values.roleEn} onChange={(event) => setValues((prev) => ({ ...prev, roleEn: event.target.value }))} required />
            <Input label="Role (Hindi)" value={values.roleHi} onChange={(event) => setValues((prev) => ({ ...prev, roleHi: event.target.value }))} required />
          </div>
          <Input
            label="Upload Photo"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              setSelectedFile(file);
              setUploadError('');
            }}
          />
          <div className="flex items-center gap-3">
            <Button type="button" variant="secondary" onClick={uploadSelectedImage} disabled={!selectedFile || uploading}>
              {uploading ? 'Uploading...' : 'Upload to ImageKit'}
            </Button>
            {values.photoUrl ? <p className="text-xs text-green-600">Image uploaded successfully.</p> : null}
          </div>
          {uploadError ? <p className="text-sm text-red-500">{uploadError}</p> : null}
          <Input label="Photo URL (Generated)" value={values.photoUrl} readOnly />
          <Input label="Designation Order" type="number" value={values.designationOrder} onChange={(event) => setValues((prev) => ({ ...prev, designationOrder: event.target.value }))} />
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Leadership" value={values.isLeadership ? 'yes' : 'no'} onChange={(event) => setValues((prev) => ({ ...prev, isLeadership: event.target.value === 'yes' }))} options={[{ label: 'No', value: 'no' }, { label: 'Yes', value: 'yes' }]} />
            <Select label="Board Member" value={values.isBoardMember ? 'yes' : 'no'} onChange={(event) => setValues((prev) => ({ ...prev, isBoardMember: event.target.value === 'yes' }))} options={[{ label: 'No', value: 'no' }, { label: 'Yes', value: 'yes' }]} />
          </div>
          <div className="flex justify-end"><Button type="submit">{editing ? 'Update Member' : 'Create Member'}</Button></div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTeam;
