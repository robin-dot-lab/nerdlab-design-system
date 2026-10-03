import { ArrowLeft, ArrowRight } from '@robin-dot-lab/icons';
import { Button } from '../button/button.js';
import { cn } from '../lib/cn.js';

export interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  /** Accessible name of the navigation landmark (several paginations on a page need distinct names). */
  label?: string;
  /** How many page numbers to show around the current page. Default 3. */
  visiblePages?: number;
  labels?: { previous: string; next: string; page: (n: number) => string };
  className?: string;
}

/** Previous / next and a window of page numbers; the current page carries aria-current="page". */
export function Pagination({
  page, pages, onPageChange, label = 'Pagination', visiblePages = 3, className,
  labels = { previous: 'Page précédente', next: 'Page suivante', page: (n) => `Page ${n}` },
}: PaginationProps) {
  const size = Math.min(visiblePages, pages);
  const start = Math.max(1, Math.min(page - Math.floor(size / 2), pages - size + 1));
  const numbers = Array.from({ length: size }, (_, i) => start + i);
  return (
    <nav aria-label={label} className={cn('nl-pagination', className)}>
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label={labels.previous}><ArrowLeft /></Button>
      {numbers.map((n) => (
        <Button key={n} size="sm" variant={n === page ? 'accent' : 'outline'} aria-current={n === page ? 'page' : undefined} aria-label={labels.page(n)} onClick={() => onPageChange(n)}>{n}</Button>
      ))}
      <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => onPageChange(page + 1)} aria-label={labels.next}><ArrowRight /></Button>
    </nav>
  );
}
