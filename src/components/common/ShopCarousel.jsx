import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import ShopCard from '@/components/common/ShopCard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const getVisibleCount = ({ isDesktop, isTablet }) => {
  if (isDesktop) return 3;
  if (isTablet) return 2;
  return 1;
};

/** @param {{shops: any[], loading?: boolean}} props */
const ShopCarousel = ({ shops, loading = false }) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 640px)');
  const reduceMotion = useReducedMotion();
  const visibleCount = getVisibleCount({ isDesktop, isTablet });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const maxIndex = Math.max(0, shops.length - visibleCount);
  const canSlide = shops.length > visibleCount;

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (!canSlide || isPaused || reduceMotion) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index >= maxIndex ? 0 : index + 1));
    }, 4800);

    return () => window.clearInterval(intervalId);
  }, [canSlide, isPaused, maxIndex, reduceMotion]);

  const visibleShops = useMemo(
    () => shops.slice(activeIndex, activeIndex + visibleCount),
    [activeIndex, shops, visibleCount]
  );

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: visibleCount }).map((_, index) => (
          <Skeleton key={index} variant="card" className="h-[420px]" />
        ))}
      </div>
    );
  }

  if (!shops.length) {
    return (
      <EmptyState
        title="No member shops available"
        description="Active member shops will appear here after they are added from the admin panel."
      />
    );
  }

  const goPrevious = () => setActiveIndex((index) => (index <= 0 ? maxIndex : index - 1));
  const goNext = () => setActiveIndex((index) => (index >= maxIndex ? 0 : index + 1));

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleShops.map((shop) => (
            <motion.div
              key={shop.id}
              layout
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ShopCard shop={shop} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {canSlide ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show shop group ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${activeIndex === index ? 'w-7 bg-gold' : 'w-2.5 bg-border-strong'}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous shops"
              className="inline-flex h-10 w-10 items-center justify-center rounded border border-border bg-surface transition hover:bg-surface-2"
              onClick={goPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next shops"
              className="inline-flex h-10 w-10 items-center justify-center rounded border border-border bg-surface transition hover:bg-surface-2"
              onClick={goNext}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ShopCarousel;
