import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';

const statusVariants = cva('nl-status', {
  variants: {
    tone: { neutral: '', ok: 'nl-status--ok', warn: 'nl-status--warn', bad: 'nl-status--bad', info: 'nl-status--info' },
    pulse: { true: 'nl-status--pulse', false: '' },
  },
  defaultVariants: { tone: 'neutral', pulse: false },
});

export interface StatusDotProps extends Omit<ComponentProps<'span'>, 'children'>, VariantProps<typeof statusVariants> {
  /** What the status is, in words (“Active”, “Live”, “Expired”): never the colour alone. */
  label: ReactNode;
  /** Keep the words for screen readers only (next to a heading that already says it, in a dense list). */
  hideLabel?: boolean;
}

/**
 * A coloured dot with its status in words, visible or not. `pulse` marks something live (a mailbox receiving
 * mail); the pulse stands still when the user reduces motion. Add `role="status"` if a change should be announced.
 */
export function StatusDot({ label, hideLabel = false, tone, pulse, className, ...props }: StatusDotProps) {
  return (
    <span className={cn(statusVariants({ tone, pulse }), className)} {...props}>
      <span className="nl-status__dot" aria-hidden="true" />
      <span className={hideLabel ? 'nl-visually-hidden' : 'nl-status__label'}>{label}</span>
    </span>
  );
}
