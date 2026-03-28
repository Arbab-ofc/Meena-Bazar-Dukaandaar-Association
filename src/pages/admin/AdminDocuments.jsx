import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { DOCUMENT_CATEGORIES, FILE_TYPES } from '@/data/constants';
import { createDocument, deleteDocument, getDocuments, updateDocument } from '@/services/firestore/documentsService';
import { uploadFileToImageKit } from '@/services/imagekit/imagekitService';
import { useAuth } from '@/hooks/useAuth';

const initialValues = {
  title: '',
  category: 'Registration',
  description: '',
  fileUrl: '',
  fileType: 'PDF',
  tags: '',
  publicId: ''
};
const PAGE_SIZE = 9;

const AdminDocuments = () => {
  const { adminData } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
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
      setItems(await getDocuments());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Manage Documents | Admin';
    load();
  }, []);

  const filtered = categoryFilter === 'All' ? items : items.filter((item) => item.category === categoryFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, items.length]);

  const resetForm = () => {
    setOpen(false);
    setEditing(null);
    setValues(initialValues);
    setSelectedFile(null);
    setUploadError('');
  };

  const inferFileType = (file) => {
    const name = file?.name?.toLowerCase() || '';
    if (name.endsWith('.pdf')) return 'PDF';
    if (name.endsWith('.doc') || name.endsWith('.docx')) return 'DOC';
    if (/\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i.test(name)) return 'Image';
    return 'Other';
  };

  const uploadSelectedFile = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError('');

    try {
      const upload = await uploadFileToImageKit(selectedFile, {
        folder: '/documents',
        fileName: `${Date.now()}-${selectedFile.name}`
      });

      setValues((prev) => ({
        ...prev,
        fileUrl: upload.url || '',
        publicId: upload.filePath || upload.fileId || upload.name || '',
        fileType: inferFileType(selectedFile)
      }));
    } catch (error) {
      setUploadError(error.message || 'Document upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!values.fileUrl) {
      setUploadError('Please upload a file first.');
      return;
    }

    const payload = {
      title: values.title,
      category: values.category,
      description: values.description,
      fileUrl: values.fileUrl,
      fileType: values.fileType,
      tags: values.tags.split(',').map((item) => item.trim()).filter(Boolean),
      publicId: values.publicId,
      uploadedBy: adminData?.uid || adminData?.id || ''
    };

    if (editing) await updateDocument(editing.id, payload);
    else await createDocument(payload);

    resetForm();
    await load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-4xl text-text">Documents</h2>
        <div className="flex gap-2">
          <Select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} options={DOCUMENT_CATEGORIES.map((c) => ({ label: c, value: c }))} />
          <Button onClick={() => { setEditing(null); setValues(initialValues); setSelectedFile(null); setUploadError(''); setOpen(true); }}>Add Document</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? <p className="text-text-muted">Loading...</p> : paginated.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <Badge variant="accent">{item.category}</Badge>
              <Badge variant="default">{item.fileType}</Badge>
            </div>
            <p className="font-medium text-text">{item.title}</p>
            <p className="mt-1 line-clamp-2 text-sm text-text-muted">{item.description}</p>
            <div className="mt-3 flex gap-2">
              <button className="rounded border border-border p-2" aria-label="Edit" onClick={() => { setEditing(item); setSelectedFile(null); setUploadError(''); setValues({ ...item, tags: (item.tags || []).join(', ') }); setOpen(true); }}><Pencil className="h-4 w-4" /></button>
              <button className="rounded border border-red-500/30 p-2 text-red-600" aria-label="Delete" onClick={async () => { if (window.confirm('Delete this document?')) { await deleteDocument(item.id); await load(); } }}><Trash2 className="h-4 w-4" /></button>
            </div>
          </Card>
        ))}
      </div>
      {!loading && filtered.length ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : null}

      <Modal isOpen={isOpen} onClose={resetForm} title={editing ? 'Edit Document' : 'Add Document'} size="lg">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input label="Title" value={values.title} onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))} required />
          <Select label="Category" value={values.category} onChange={(event) => setValues((prev) => ({ ...prev, category: event.target.value }))} options={DOCUMENT_CATEGORIES.filter((item) => item !== 'All').map((item) => ({ label: item, value: item }))} />
          <Textarea label="Description" value={values.description} onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))} rows={4} />
          <Input
            label="Upload File"
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              setSelectedFile(file);
              setUploadError('');
            }}
          />
          <div className="flex items-center gap-3">
            <Button type="button" variant="secondary" onClick={uploadSelectedFile} disabled={!selectedFile || uploading}>
              {uploading ? 'Uploading...' : 'Upload to ImageKit'}
            </Button>
            {values.fileUrl ? <p className="text-xs text-green-600">File uploaded successfully.</p> : null}
          </div>
          {uploadError ? <p className="text-sm text-red-500">{uploadError}</p> : null}
          <Input label="File URL (Generated)" value={values.fileUrl} readOnly required />
          <Select label="File Type" value={values.fileType} onChange={(event) => setValues((prev) => ({ ...prev, fileType: event.target.value }))} options={FILE_TYPES.map((value) => ({ label: value, value }))} />
          <Input label="Tags" helperText="Comma separated" value={values.tags} onChange={(event) => setValues((prev) => ({ ...prev, tags: event.target.value }))} />
          <Input label="Public ID (Generated)" value={values.publicId} readOnly />
          <div className="flex justify-end"><Button type="submit">{editing ? 'Update Document' : 'Create Document'}</Button></div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDocuments;
