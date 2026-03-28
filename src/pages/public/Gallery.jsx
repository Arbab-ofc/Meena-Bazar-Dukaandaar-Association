import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import GalleryCard from '@/components/common/GalleryCard';
import Modal from '@/components/ui/Modal';
import ImageKitImage from '@/components/ui/ImageKitImage';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import Pagination from '@/components/ui/Pagination';
import { getGalleryItems } from '@/services/firestore/galleryService';
import { GALLERY_CATEGORIES } from '@/data/constants';
import { formatDate } from '@/utils/formatDate';

const PAGE_SIZE = 12;

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = 'Gallery | Meena Bazar Dukaandaar Association';
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getGalleryItems();
        setItems(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => (category === 'All' ? items : items.filter((item) => item.category === category)), [category, items]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );
  const activeItem = activeIndex >= 0 ? paginated[activeIndex] : null;

  useEffect(() => {
    setCurrentPage(1);
    setActiveIndex(-1);
  }, [category, items.length]);

  useEffect(() => {
    const onKey = (event) => {
      if (activeIndex < 0) return;
      if (event.key === 'ArrowRight') setActiveIndex((prev) => (prev + 1) % paginated.length);
      if (event.key === 'ArrowLeft') setActiveIndex((prev) => (prev - 1 + paginated.length) % paginated.length);
      if (event.key === 'Escape') setActiveIndex(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, paginated.length]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-10">
        <h1 className="font-heading text-5xl text-text">Gallery</h1>
      </section>
      <div className="mt-6 flex flex-wrap gap-2">
        {GALLERY_CATEGORIES.map((value) => (
          <button key={value} onClick={() => setCategory(value)} className={`rounded-full border px-4 py-2 text-sm ${category === value ? 'border-gold bg-gold/15 text-gold' : 'border-border bg-surface text-text-muted hover:text-text'}`}>
            {value}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">{[1,2,3,4,5,6].map((id)=><Skeleton key={id} variant="card" className="h-72" />)}</div>
      ) : filtered.length ? (
        <>
          <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">{paginated.map((item, index) => <GalleryCard key={item.id} item={item} onClick={() => setActiveIndex(index)} />)}</div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      ) : (
        <div className="mt-8"><EmptyState title="No gallery items" description="No visual records match the selected category." /></div>
      )}

      <Modal isOpen={Boolean(activeItem)} onClose={() => setActiveIndex(-1)} title={activeItem?.title || 'Gallery'} size="lg">
        {activeItem ? (
          <div>
            <ImageKitImage
              src={activeItem.imageUrl}
              alt={activeItem.title}
              className="h-[60vh] w-full bg-surface"
              objectFit="contain"
              transformations={{ q: 85, f: 'auto' }}
            />
            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-heading text-2xl text-text">{activeItem.title}</p>
                <p className="text-sm text-text-muted">{formatDate(activeItem.eventDate)} | {activeItem.location}</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded border border-border p-2" aria-label="Previous image" onClick={() => setActiveIndex((prev) => (prev - 1 + paginated.length) % paginated.length)}><ChevronLeft className="h-4 w-4" /></button>
                <button className="rounded border border-border p-2" aria-label="Next image" onClick={() => setActiveIndex((prev) => (prev + 1) % paginated.length)}><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </motion.div>
  );
};

export default Gallery;
