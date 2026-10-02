import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

export interface CardProps extends ComponentProps<'div'> {
  /** Render the single child (e.g. `<article>`, `<a>`) with card styles. */
  asChild?: boolean;
}

export function Card({ className, asChild = false, ...props }: CardProps) {
  const Comp = asChild ? Slot : 'div';
  return <Comp className={cn('nl-card', className)} {...props} />;
}
