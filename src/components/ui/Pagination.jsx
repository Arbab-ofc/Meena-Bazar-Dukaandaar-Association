import { cn } from '@/utils/cn';

const getPageItems = (currentPage, totalPages) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push('...');
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < totalPages - 1) pages.push('...');
  pages.push(totalPages);
  return pages;
};

/** @param {{currentPage: number, totalPages: number, onPageChange: (page: number) => void, className?: string}} props */
const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  if (totalPages <= 1) return null;

  const items = getPageItems(currentPage, totalPages);

  return (
    <nav className={cn('mt-8 flex flex-wrap items-center justify-between gap-3', className)} aria-label="Pagination">
      <p className="text-sm text-text-muted">
        Page <span className="font-medium text-text">{currentPage}</span> of{' '}
        <span className="font-medium text-text">{totalPages}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded border border-border bg-surface px-3 py-2 text-sm text-text transition hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {items.map((item, index) =>
          item === '...' ? (
            <span key={`dots-${index}`} className="px-2 text-text-muted">
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(Number(item))}
              className={cn(
                'min-w-10 rounded border px-3 py-2 text-sm transition',
                currentPage === item
                  ? 'border-gold bg-gold/15 font-medium text-gold'
                  : 'border-border bg-surface text-text hover:bg-surface-2'
              )}
              aria-current={currentPage === item ? 'page' : undefined}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          className="rounded border border-border bg-surface px-3 py-2 text-sm text-text transition hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
