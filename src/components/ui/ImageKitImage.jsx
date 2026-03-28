import { useMemo, useState } from 'react';
import Skeleton from '@/components/ui/Skeleton';
import { getImageUrl } from '@/services/imagekit/imagekitService';
import { cn } from '@/utils/cn';

/** @param {{src?: string, alt: string, width?: number, height?: number, className?: string, objectFit?: 'cover'|'contain', transformations?: {w?: number, h?: number, q?: number, f?: string}}} props */
const ImageKitImage = ({ src, alt, width, height, className, objectFit = 'cover', transformations }) => {
  const [isLoading, setLoading] = useState(true);
  const [hasError, setError] = useState(false);

  const imageUrl = useMemo(() => getImageUrl(src, transformations), [src, transformations]);

  if (!src || hasError) {
    return (
      <div className={cn('flex items-center justify-center rounded-[var(--radius)] border border-border bg-surface text-xs text-text-muted', className)}>
        Image unavailable
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden rounded-[var(--radius)]', className)}>
      {isLoading ? <Skeleton variant="image" className="absolute inset-0 h-full w-full" /> : null}
      <img
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className={cn(
          'h-full w-full transition duration-500',
          objectFit === 'contain' ? 'object-contain' : 'object-cover',
          isLoading && 'opacity-0'
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </div>
  );
};

export default ImageKitImage;
