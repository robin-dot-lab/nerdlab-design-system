import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

export interface SearchProps extends Omit<ComponentProps<'input'>, 'type'> {
  /** Accessible name of the field (there is no visible label). */
  label: string;
  /** Class for the wrapping <label>. `className` goes to the input. */
  labelClassName?: string;
}

/** Search field on the skin's .nl-search bar: magnifier icon + input type="search". */
export function Search({ label, labelClassName, className, ...props }: SearchProps) {
  return (
    <label className={cn('nl-search', labelClassName)}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <circle cx="10" cy="10" r="7" /><path d="M15 15l6 6" strokeLinecap="round" />
      </svg>
      <input type="search" aria-label={label} className={className} {...props} />
    </label>
  );
}
