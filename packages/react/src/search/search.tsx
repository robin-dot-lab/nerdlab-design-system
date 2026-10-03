import { Search as SearchIcon } from '@robin-dot-lab/icons';
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
      <SearchIcon />
      <input type="search" aria-label={label} className={className} {...props} />
    </label>
  );
}
