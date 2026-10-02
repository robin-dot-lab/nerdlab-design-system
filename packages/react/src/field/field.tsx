'use client';

import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';

interface FieldContextValue { id: string; describedBy: string | undefined; invalid: boolean }
const FieldContext = createContext<FieldContextValue | null>(null);

export interface FieldProps extends Omit<ComponentProps<'div'>, 'children'> {
  label: ReactNode;
  /** Help text under the control. Replaced by `error` when both are set. */
  help?: ReactNode;
  /** Error message: marks the control invalid and is announced via aria-describedby. */
  error?: ReactNode;
  /** Explicit id for the control; generated otherwise. */
  id?: string;
  children: ReactNode;
}

/** Label + control + help/error, wired together (htmlFor, aria-describedby, aria-invalid). */
export function Field({ label, help, error, id, className, children, ...props }: FieldProps) {
  const generated = useId();
  const controlId = id ?? `nl-field-${generated}`;
  const message = error ?? help;
  const messageId = message ? `${controlId}-message` : undefined;
  return (
    <div className={cn('nl-field', className)} {...props}>
      <label className="nl-label" htmlFor={controlId}>{label}</label>
      <FieldContext.Provider value={{ id: controlId, describedBy: messageId, invalid: Boolean(error) }}>
        {children}
      </FieldContext.Provider>
      {message && <span id={messageId} className={cn('nl-help', error ? 'nl-help--error' : undefined)}>{message}</span>}
    </div>
  );
}

/** id, aria-describedby and invalid state of a control, merged with the enclosing <Field> if any. */
function useFieldControl(id: string | undefined, invalid: boolean | undefined, describedBy: string | undefined) {
  const field = useContext(FieldContext);
  const isInvalid = invalid ?? field?.invalid ?? false;
  return {
    id: id ?? field?.id,
    isInvalid,
    describedBy: [describedBy, field?.describedBy].filter(Boolean).join(' ') || undefined,
  };
}

export interface InputProps extends ComponentProps<'input'> {
  /** Error styling + aria-invalid. Set automatically inside a `<Field error>`. */
  invalid?: boolean;
}

export function Input({ className, invalid, id, ...props }: InputProps) {
  const c = useFieldControl(id, invalid, props['aria-describedby']);
  return (
    <input
      id={c.id}
      className={cn('nl-input', c.isInvalid && 'nl-input--error', className)}
      aria-invalid={c.isInvalid || undefined}
      {...props}
      aria-describedby={c.describedBy}
    />
  );
}

export interface TextareaProps extends ComponentProps<'textarea'> {
  /** Error styling + aria-invalid. Set automatically inside a `<Field error>`. */
  invalid?: boolean;
}

/** Multi-line text, resizable vertically. Wire it to a label with `<Field>`. */
export function Textarea({ className, invalid, id, ...props }: TextareaProps) {
  const c = useFieldControl(id, invalid, props['aria-describedby']);
  return (
    <textarea
      id={c.id}
      className={cn('nl-input', c.isInvalid && 'nl-input--error', className)}
      aria-invalid={c.isInvalid || undefined}
      {...props}
      aria-describedby={c.describedBy}
    />
  );
}

export interface SelectProps extends ComponentProps<'select'> {
  /** Error styling + aria-invalid. Set automatically inside a `<Field error>`. */
  invalid?: boolean;
  /** Class for the wrapper that draws the chevron. `className` goes to the <select>. */
  wrapperClassName?: string;
}

/**
 * Native <select> with the input look and a drawn chevron: the platform picker on phones, typeahead
 * and form submission for free. Pass <option> children; wire it to a label with `<Field>`.
 */
export function Select({ className, wrapperClassName, invalid, id, ...props }: SelectProps) {
  const c = useFieldControl(id, invalid, props['aria-describedby']);
  return (
    <span className={cn('nl-select', wrapperClassName)}>
      <select
        id={c.id}
        className={cn('nl-input', c.isInvalid && 'nl-input--error', className)}
        aria-invalid={c.isInvalid || undefined}
        {...props}
        aria-describedby={c.describedBy}
      />
    </span>
  );
}
