'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';
import { useMessages } from '../lib/i18n.js';

const spinnerVariants = cva('nl-spinner', {
  variants: { size: { sm: 'nl-spinner--sm', md: '', lg: 'nl-spinner--lg' } },
  defaultVariants: { size: 'md' },
});

export interface SpinnerProps extends Omit<ComponentProps<'span'>, 'children'>, VariantProps<typeof spinnerVariants> {
  /** What is loading, read by screen readers. Defaults to “Loading” in the active locale. */
  label?: string;
}

/**
 * Indeterminate wait, announced politely (role="status") with its label. The ring turns, and stands still
 * when the user reduces motion. Inside a button, use `<Button loading>` instead.
 */
export function Spinner({ label, size, className, ...props }: SpinnerProps) {
  const { t } = useMessages();
  return (
    <span role="status" className={cn('nl-spinner-wrap', className)} {...props}>
      <span className={spinnerVariants({ size })} aria-hidden="true" />
      <span className="nl-visually-hidden">{label ?? t.loading}</span>
    </span>
  );
}
