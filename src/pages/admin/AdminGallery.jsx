import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import ImageKitImage from '@/components/ui/ImageKitImage';
import Pagination from '@/components/ui/Pagination';
import { uploadImageToImageKit } from '@/services/imagekit/imagekitService';
import { createItem, deleteItem, getGalleryItems, updateItem } from '@/services/firestore/galleryService';
import { GALLERY_CATEGORIES } from '@/data/constants';
import { formatDate } from '@/utils/formatDate';

const initialValues = {
  title: '',
  category: 'Meetings',
  imageUrl: '',
  thumbnailUrl: '',
  publicId: '',
  eventDate: '',
  location: ''
};
const PAGE_SIZE = 9;

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState(initialValues);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await getGalleryItems());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Manage Gallery | Admin';
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
        folder: '/gallery',
        fileName: `${Date.now()}-${selectedFile.name}`
      });

      setValues((prev) => ({
        ...prev,
        imageUrl: upload.url || '',
        thumbnailUrl: upload.thumbnailUrl || upload.url || '',
        publicId: upload.filePath || upload.fileId || upload.name || ''
      }));
    } catch (error) {
      setUploadError(error.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!values.imageUrl) {
      setUploadError('Please upload an image first.');
      return;
    }

    const payload = {
      ...values,
      eventDate: values.eventDate ? new Date(values.eventDate) : new Date()
    };

    if (editing) await updateItem(editing.id, payload);
    else await createItem(payload);
    resetForm();
    await load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-4xl text-text">Gallery</h2>
        <Button onClick={() => { setEditing(null); setValues(initialValues); setSelectedFile(null); setUploadError(''); setOpen(true); }}>Add Gallery Item</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? <p className="text-text-muted">Loading...</p> : paginated.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <ImageKitImage src={item.thumbnailUrl || item.imageUrl} alt={item.title} className="h-44 w-full" />
            <div className="p-4">
              <p className="font-medium text-text">{item.title}</p>
              <p className="text-xs text-text-muted">{item.category} | {formatDate(item.eventDate)}</p>
              <div className="mt-3 flex gap-2">
                <button className="rounded border border-border p-2" onClick={() => { setEditing(item); setSelectedFile(null); setUploadError(''); setValues({ ...item, eventDate: item.eventDate?.toDate ? item.eventDate.toDate().toISOString().slice(0, 10) : new Date(item.eventDate).toISOString().slice(0, 10) }); setOpen(true); }}><Pencil className="h-4 w-4" /></button>
                <button className="rounded border border-red-500/30 p-2 text-red-600" onClick={async () => { if (window.confirm('Delete this item?')) { await deleteItem(item.id); await load(); } }}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {!loading && items.length ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : null}

      <Modal isOpen={isOpen} onClose={resetForm} title={editing ? 'Edit Gallery Item' : 'Add Gallery Item'} size="lg">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input label="Title" value={values.title} onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))} required />
          <Select label="Category" value={values.category} onChange={(event) => setValues((prev) => ({ ...prev, category: event.target.value }))} options={GALLERY_CATEGORIES.filter((item) => item !== 'All').map((value) => ({ label: value, value }))} />
          <Input
            label="Upload Image"
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
            {values.imageUrl ? <p className="text-xs text-green-600">Image uploaded successfully.</p> : null}
          </div>
          {uploadError ? <p className="text-sm text-red-500">{uploadError}</p> : null}
          <Input label="Image URL (Generated)" value={values.imageUrl} readOnly required />
          <Input label="Thumbnail URL (Generated)" value={values.thumbnailUrl} readOnly />
          <Input label="Public ID (Generated)" value={values.publicId} readOnly />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Event Date" type="date" value={values.eventDate} onChange={(event) => setValues((prev) => ({ ...prev, eventDate: event.target.value }))} />
            <Input label="Location" value={values.location} onChange={(event) => setValues((prev) => ({ ...prev, location: event.target.value }))} />
          </div>
          <div className="flex justify-end"><Button type="submit">{editing ? 'Update Item' : 'Create Item'}</Button></div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminGallery;
