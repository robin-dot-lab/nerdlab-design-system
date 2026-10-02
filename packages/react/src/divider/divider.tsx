import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

export type DividerProps = Omit<ComponentProps<'hr'>, 'children'>;

/** Dashed thematic break (<hr>, announced as a separator). */
export function Divider({ className, ...props }: DividerProps) {
  return <hr className={cn('nl-divider-dashed', className)} {...props} />;
}
