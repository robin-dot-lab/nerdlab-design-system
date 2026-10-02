import { Button } from '@nerdlab/react';
// LIBRARY GAP: pagination with previous/next and a window of page numbers.
export function Pagination({ page, pages, onChange, label = 'Pagination' }: { page: number; pages: number; onChange: (p: number) => void; label?: string }) {
  const start = Math.max(1, Math.min(page - 1, pages - 2)), nums = Array.from({ length: Math.min(3, pages) }, (_, i) => start + i);
  return (
    <nav aria-label={label} className="pager">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Page précédente">←</Button>
      {nums.map((n) => (
        <Button key={n} variant={n === page ? 'accent' : 'outline'} size="sm" aria-current={n === page ? 'page' : undefined} aria-label={`Page ${n}`} onClick={() => onChange(n)}>{n}</Button>
      ))}
      <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Page suivante">→</Button>
    </nav>
  );
}
