import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';
import { FieldBoundary } from './field.js';

export type InputGroupProps = ComponentProps<'span'>;

/**
 * One bordered control made of an `<Input>` (or `Select`) and addons before or after it: `alias` + `@nerdlab.sh`,
 * or an alias and a domain `<Select>`. Inside a `<Field>`, the input keeps the field's label, help and error.
 */
export function InputGroup({ className, ...props }: InputGroupProps) {
  return <span className={cn('nl-input-group', className)} {...props} />;
}

export type InputAddonProps = ComponentProps<'span'>;

/**
 * Text (`@nerdlab.sh`) or an element placed before or after the input of an `InputGroup`. What it wraps is cut
 * off from the enclosing `<Field>`: a control inside (a domain `<Select>`) needs its own `aria-label`.
 */
export function InputAddon({ className, children, ...props }: InputAddonProps) {
  return <span className={cn('nl-input-group__addon', className)} {...props}><FieldBoundary>{children}</FieldBoundary></span>;
}
