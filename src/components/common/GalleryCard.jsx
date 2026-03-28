import { memo } from 'react';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import ImageKitImage from '@/components/ui/ImageKitImage';
import { formatDate } from '@/utils/formatDate';

/** @param {{item: any, onClick?: () => void}} props */
const GalleryCard = ({ item, onClick }) => (
  <Card hover className="overflow-hidden" onClick={onClick}>
    <ImageKitImage src={item.thumbnailUrl || item.imageUrl} alt={item.title} className="h-56 w-full" transformations={{ w: 800, h: 500, q: 80, f: 'auto' }} />
    <div className="p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <Badge variant="accent">{item.category}</Badge>
        <span className="text-xs text-text-subtle">{formatDate(item.eventDate)}</span>
      </div>
      <h3 className="font-heading text-2xl text-text">{item.title}</h3>
      <p className="mt-1 text-sm text-text-muted">{item.location}</p>
    </div>
  </Card>
);

export default memo(GalleryCard);
