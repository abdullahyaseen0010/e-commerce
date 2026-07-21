import { cn } from '@/lib/utils/cn';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** How many page numbers to show on each side of the current page. */
  siblingCount?: number;
  className?: string;
}

const ELLIPSIS = 'ellipsis' as const;

function getPageRange(currentPage: number, totalPages: number, siblingCount: number) {
  const totalNumbers = siblingCount * 2 + 5; // first + last + current + 2 ellipses
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const pages: (number | typeof ELLIPSIS)[] = [1];
  if (showLeftEllipsis) pages.push(ELLIPSIS);

  for (let page = Math.max(leftSibling, 2); page <= Math.min(rightSibling, totalPages - 1); page++) {
    pages.push(page);
  }

  if (showRightEllipsis) pages.push(ELLIPSIS);
  pages.push(totalPages);

  return pages;
}

/** Numbered pagination, driven entirely by props — wrap onPageChange to also sync the URL if needed. */
export function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages, siblingCount);
  const navButtonStyles = cn(
    'flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium text-zinc-600',
    'transition-colors duration-150 hover:bg-zinc-100',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-40'
  );

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1', className)}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={navButtonStyles}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>

      {pages.map((page, index) =>
        page === ELLIPSIS ? (
          <span key={`ellipsis-${index}`} className="flex h-9 min-w-9 items-center justify-center text-sm text-zinc-400">
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={cn(
              'flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
              page === currentPage ? 'bg-violet-600 text-white' : 'text-zinc-600 hover:bg-zinc-100'
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={navButtonStyles}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </nav>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M12.5 15L7.5 10l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
