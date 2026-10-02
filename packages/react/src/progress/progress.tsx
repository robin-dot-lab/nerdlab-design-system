import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

export interface ProgressProps extends Omit<ComponentProps<'progress'>, 'children' | 'value'> {
  /** Done so far, between 0 and `max`. Omit it while the amount is unknown: the bar becomes indeterminate. */
  value?: number;
  max?: number;
  /** Accessible name. Omit only if you pass aria-labelledby. */
  label?: string;
  /** Pixel-art variant (sand track, moss segments). */
  pixel?: boolean;
}

/**
 * Native <progress>: how far a task has gone. The browser draws the fill and announces the value.
 * Use `Meter` for a measurement within a range (a fill rate, a quota), not for a task.
 */
export function Progress({ value, max = 1, label, pixel = false, className, ...props }: ProgressProps) {
  const clamped = value == null ? undefined : Math.min(max, Math.max(0, value));
  return (
    <progress
      className={cn('nl-progress', pixel && 'nl-progress--pixel', className)}
      aria-label={label}
      max={max}
      value={clamped}
      {...props}
    />
  );
}
