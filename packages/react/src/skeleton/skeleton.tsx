import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

export interface SkeletonProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** text: one line (pass `lines` for a paragraph); circle: an avatar; block: a card or chart. */
  shape?: 'text' | 'circle' | 'block';
  /** Number of text lines; the last one is shorter. */
  lines?: number;
}

/**
 * Placeholder while content loads. Hidden from assistive tech: set aria-busy on the region that loads,
 * and let the real content replace the skeleton.
 */
export function Skeleton({ shape = 'text', lines = 1, className, ...props }: SkeletonProps) {
  if (shape === 'text' && lines > 1) {
    return (
      <span aria-hidden="true" className={cn('nl-skeleton-group', className)} {...props}>
        {Array.from({ length: lines }, (_, i) => <span key={i} className="nl-skeleton nl-skeleton--text" />)}
      </span>
    );
  }
  return <span aria-hidden="true" className={cn('nl-skeleton', `nl-skeleton--${shape}`, className)} {...props} />;
}
