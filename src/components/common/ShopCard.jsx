import { Clock, Store, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '@/components/ui/Badge';
import ImageKitImage from '@/components/ui/ImageKitImage';

const formatTimeRange = (openTime, closeTime) => {
  if (openTime && closeTime) return `${openTime} - ${closeTime}`;
  if (openTime) return `Opens ${openTime}`;
  if (closeTime) return `Closes ${closeTime}`;
  return 'Timings not set';
};

/** @param {{shop: any}} props */
const ShopCard = ({ shop }) => {
  return (
    <Link
      to={`/members/${encodeURIComponent(shop.id)}`}
      state={{ shop }}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      aria-label={`View details for ${shop.shopName || 'member shop'}`}
    >
      <article className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg-elevated shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
      <div className="relative h-56 overflow-hidden bg-surface">
        <ImageKitImage
          src={shop.shopImageUrl}
          alt={shop.shopName ? `${shop.shopName} shop` : 'Member shop'}
          className="h-full w-full rounded-none"
          transformations={{ w: 720, h: 420, q: 82, f: 'auto' }}
        />
        <div className="absolute left-4 top-4 drop-shadow-md">
          <Badge variant="gold" className="border-gold bg-bg-elevated px-3 py-1.5 font-semibold text-gold shadow-md">
            Shop {shop.shopNumber || 'N/A'}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-gold-muted">
            <Store className="h-3.5 w-3.5" />
            Member Shop
          </p>
          <h3 className="mt-3 line-clamp-2 font-heading text-3xl leading-tight text-text">
            {shop.shopName || 'Unnamed Shop'}
          </h3>
        </div>

        <div className="mt-5 space-y-3 text-sm text-text-muted">
          <p className="flex items-center gap-2">
            <UserRound className="h-4 w-4 shrink-0 text-gold" />
            <span className="min-w-0 truncate">{shop.ownerName || 'Owner not listed'}</span>
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-gold" />
            <span className="min-w-0 truncate">{formatTimeRange(shop.openTime, shop.closeTime)}</span>
          </p>
        </div>

        <div className="mt-auto pt-5">
          <div className="h-px w-full bg-border" />
          <p className="mt-4 text-xs text-text-subtle">
            Listed by Meena Bazar Dukaandaar Association.
          </p>
        </div>
      </div>
      </article>
    </Link>
  );
};

export default ShopCard;
